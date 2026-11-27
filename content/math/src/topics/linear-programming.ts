// Linear Programming: formulation, the graphical method, the simplex method, duality,
// sensitivity, transportation and assignment, network flows, integer programs and matrix games.

import type { Figure, Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { plane, Q } from "@ga/subject-math";
import { linearProgrammingDrawings1 } from "../explanation-drawings-linear-programming-1.ts";

import { numberProblem, why } from "../problems.ts";
import { type Pair, point, same, topic } from "../university-kit.ts";
import { chosen, lesson, type Miss, type Slip, type Walk, walk } from "./number-theory-course.ts";

/** solved builds a number problem whose typical wrong answers are explained and whose solution is walked through;
 * a wrong answer that repeats the answer or an earlier one is dropped. */
export function solved(
  prompt: Pair,
  answer: number | Q,
  misses: readonly Miss[],
  steps: readonly Walk[],
  check: Pair,
  figure?: Figure,
): Problem {
  const key = (v: number | Q) => (typeof v === "number" ? `${v}` : v.toLatex());
  const seen = new Set([key(answer)]);
  const kept = misses.filter(([v]) => !seen.has(key(v)) && Boolean(seen.add(key(v))));
  const problem = numberProblem({
    prompt: t(prompt[0], prompt[1]),
    answer,
    mistakes: kept.map(([v, en, zh]) => why(v, en, zh)),
    solution: walk(steps, check),
  });
  return figure ? { ...problem, figure } : problem;
}

/** plus writes a number after another term with its own sign, as "+ 3" or "- 3". */
export const plus = (v: number) => (v < 0 ? `- ${-v}` : `+ ${v}`);

/** listed writes a list of numbers in TeX, separated by commas. */
const listed = (values: readonly number[]) => `$${values.join(", ")}$`;

/** term writes a coefficient times a variable, leaving out a coefficient of one. */
const term = (c: number, v: string) => (c === 1 ? v : `${c}${v}`);

/** matrix writes a table of numbers in LaTeX. */
const matrix = (rows: readonly (readonly number[])[]) =>
  `\\begin{pmatrix} ${rows.map((row) => row.join(" & ")).join(" \\\\ ")} \\end{pmatrix}`;

const formulating = lesson(
  topic(
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
          "A linear program chooses values of some variables to make a linear objective as large or as small as possible, subject to linear constraints. Each scarce resource gives one inequality: the amount used by every activity, added up, cannot exceed what is available. Each coefficient says how much of that resource one unit of the activity consumes, so getting the units right matters most.\n\nA shirt takes 2 metres of cloth and a dress takes 5, with 80 metres available. With $x$ shirts and $y$ dresses, the cloth constraint is $2x + 5y \\le 80$.\n\nCheck: 20 shirts and 8 dresses use $2(20) + 5(8) = 80$ metres, exactly the cloth available, so that plan sits on the boundary.\n\n> **Watch out.** Each coefficient belongs to its own variable: the cloth of a shirt goes with $x$, not with $y$. And a limit on what is available gives $\\le$, not $\\ge$.",
          "线性规划选择一些变量的值，使线性目标尽可能大或尽可能小，同时满足线性约束。每种稀缺资源给出一个不等式：各项活动使用的量加起来，不能超过可用的量。每个系数表示一单位活动消耗多少这种资源，所以弄清单位最重要。\n\n一件衬衫用 2 米布，一条连衣裙用 5 米布，共有 80 米布。做 $x$ 件衬衫和 $y$ 条连衣裙时，布料约束是 $2x + 5y \\le 80$。\n\n检验：20 件衬衫和 8 条连衣裙用布 $2(20) + 5(8) = 80$ 米，恰好用完，所以这个计划在边界上。\n\n> **注意。** 每个系数属于它自己的变量：衬衫的用布量跟 $x$ 走，而不是跟 $y$。而可用量的上限给出 $\\le$，不是 $\\ge$。",
        ],
        (rng) => {
          const a = rng.int(2, 9);
          const b = rng.pick([2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== a));
          const h = rng.int(30, 120);
          return chosen(
            rng,
            [
              `A table takes ${a} hours and a chair takes ${b} hours, with ${h} hours available. With $x$ tables and $y$ chairs, which constraint describes the hours?`,
              `一张桌子用 ${a} 小时，一把椅子用 ${b} 小时，共有 ${h} 小时可用。做 $x$ 张桌子和 $y$ 把椅子时，哪个约束描述了工时？`,
            ],
            same(`${a}x + ${b}y \\le ${h}`),
            [
              [
                same(`${b}x + ${a}y \\le ${h}`),
                `That swaps the hours: a table, counted by $x$, takes ${a} hours, not ${b}.`,
                `这把工时对调了：桌子由 $x$ 计数，用 ${a} 小时，而不是 ${b} 小时。`,
              ],
              [
                same(`${a}x + ${b}y \\ge ${h}`),
                `That makes ${h} hours a minimum, but it is the most that is available.`,
                `这把 ${h} 小时当成了下限，但它是可用的最多工时。`,
              ],
              [
                same(`x + y \\le ${h}`),
                "That counts pieces of furniture, not hours; each piece takes several hours.",
                "这数的是家具的件数，不是工时；每件家具都要用好几个小时。",
              ],
            ],
            [
              [
                ["Hours for each product", "每种产品的工时"],
                [
                  `$x$ tables take $${a}x$ hours and $y$ chairs take $${b}y$ hours.`,
                  `$x$ 张桌子用 $${a}x$ 小时，$y$ 把椅子用 $${b}y$ 小时。`,
                ],
              ],
              [
                ["Compare with what is available", "与可用量比较"],
                [
                  `Together they cannot exceed ${h}, so $${a}x + ${b}y \\le ${h}$.`,
                  `两者合起来不能超过 ${h}，所以 $${a}x + ${b}y \\le ${h}$。`,
                ],
              ],
            ],
            [
              `One table alone, $x = 1$ and $y = 0$, makes the left side ${a}, the hours of one table, as it should.`,
              `只做一张桌子，即 $x = 1$、$y = 0$，左边等于 ${a}，正是一张桌子的工时。`,
            ],
          );
        },
      ),
      point(
        "what-a-plan-leaves-room-for",
        ["What a plan leaves room for", "计划还能容纳多少"],
        [
          "A plan is feasible when it satisfies every constraint at once. Fixing some of the variables shows what room remains for the others: subtract what the fixed activities use, then divide the rest by the amount that one more unit needs. With whole units only, the result rounds down, because rounding up would break the constraint even though it looks closer to the limit.\n\nWith 50 hours, a table taking 4 hours and a chair taking 3, making 7 tables uses 28 hours and leaves 22. Since $\\frac{22}{3}$ lies between 7 and 8, at most 7 chairs fit.\n\nCheck: 7 chairs use 21 hours, within the 22 left, while 8 would need 24.\n\n> **Watch out.** Round down even when the quotient is close to the next whole number; the next chair would need more hours than remain.",
          "满足所有约束的计划是可行的。固定一部分变量，就能看出其他变量还有多少余地：减去固定活动使用的量，再用剩余量除以每增加一单位所需的量。只能取整数单位时，结果向下取整，因为向上取整看似更接近上限，却会违反约束。\n\n共有 50 小时，桌子用 4 小时，椅子用 3 小时，做 7 张桌子用 28 小时，剩 22 小时。因为 $\\frac{22}{3}$ 在 7 和 8 之间，最多能做 7 把椅子。\n\n检验：7 把椅子用 21 小时，没有超过剩下的 22 小时，而 8 把需要 24 小时。\n\n> **注意。** 即使商很接近下一个整数也要向下取整；再多一把椅子需要的工时比剩下的多。",
        ],
        (rng) => {
          const a = rng.int(2, 9);
          const b = rng.int(3, 9);
          const x = rng.int(2, 8);
          const left = b * rng.int(2, 9) + rng.int(1, b - 1);
          const h = a * x + left;
          const answer = Math.floor(left / b);
          return solved(
            [
              `A table takes ${a} hours and a chair takes ${b} hours, with ${h} hours available. If ${x} tables are made, how many whole chairs can be made at most?`,
              `一张桌子用 ${a} 小时，一把椅子用 ${b} 小时，共有 ${h} 小时可用。如果做 ${x} 张桌子，最多还能做多少把完整的椅子？`,
            ],
            answer,
            [
              [
                answer + 1,
                `That rounds up, but ${answer + 1} chairs need ${b * (answer + 1)} hours, more than the ${left} left.`,
                `这是向上取整，但 ${answer + 1} 把椅子需要 ${b * (answer + 1)} 小时，比剩下的 ${left} 小时多。`,
              ],
              [
                Math.floor(h / b),
                `That divides all ${h} hours by ${b}, forgetting the ${a * x} hours the tables use.`,
                `这把全部 ${h} 小时都除以 ${b}，忘了桌子用掉的 ${a * x} 小时。`,
              ],
              [left, "That is the number of hours left, not the number of chairs they make.", "这是剩下的工时，不是能做的椅子数。"],
              [
                answer - 1,
                `That leaves out a chair that still fits: ${answer} chairs use ${b * answer} hours, within the ${left} left.`,
                `这少算了一把还放得下的椅子：${answer} 把椅子用 ${b * answer} 小时，没有超过剩下的 ${left} 小时。`,
              ],
            ],
            [
              [
                ["Subtract the tables", "减去桌子的工时"],
                [
                  `${x} tables use $${a} \\times ${x} = ${a * x}$ hours, which leaves $${h} - ${a * x} = ${left}$.`,
                  `${x} 张桌子用 $${a} \\times ${x} = ${a * x}$ 小时，剩下 $${h} - ${a * x} = ${left}$ 小时。`,
                ],
              ],
              [
                ["Divide and round down", "相除并向下取整"],
                [
                  `$\\frac{${left}}{${b}}$ lies between ${answer} and ${answer + 1}, so at most ${answer} whole chairs fit.`,
                  `$\\frac{${left}}{${b}}$ 在 ${answer} 和 ${answer + 1} 之间，所以最多能做 ${answer} 把完整的椅子。`,
                ],
              ],
            ],
            [
              `${answer} chairs use ${b * answer} hours, within the ${left} left, while ${answer + 1} would need ${b * (answer + 1)}.`,
              `${answer} 把椅子用 ${b * answer} 小时，没有超过剩下的 ${left} 小时，而 ${answer + 1} 把需要 ${b * (answer + 1)} 小时。`,
            ],
          );
        },
      ),
    ],
  ),
  [
    "A bakery makes loaves, which take 3 cups of flour, and cakes, which take 2, from 60 cups of flour. With $x$ loaves and $y$ cakes the flour constraint is $3x + 2y \\le 60$, and if a loaf earns 4 and a cake earns 5, the objective is to maximize $4x + 5y$.",
    "面包店做面包和蛋糕，一个面包用 3 杯面粉，一个蛋糕用 2 杯，共有 60 杯面粉。做 $x$ 个面包和 $y$ 个蛋糕时，面粉约束是 $3x + 2y \\le 60$；如果一个面包赚 4，一个蛋糕赚 5，目标就是使 $4x + 5y$ 最大。",
  ],
  [
    "10 loaves and 15 cakes use $3(10) + 2(15) = 60$ cups, exactly the flour available, so that plan is feasible and earns $4(10) + 5(15) = 115$.",
    "10 个面包和 15 个蛋糕用面粉 $3(10) + 2(15) = 60$ 杯，恰好用完，所以这个计划可行，收益是 $4(10) + 5(15) = 115$。",
  ],
  [
    "turn a story into constraints and an objective, and find how much room a plan leaves for one more activity.",
    "把情境转化为约束和目标，并求一个计划还能为另一项活动留出多少余地。",
  ],
);

const graphical = lesson(
  topic(
    "the-graphical-method-for-linear-programs",
    ["The Graphical Method for Linear Programs", "线性规划的图解法"],
    ["Find corner points of a feasible region, and locate the optimum among them.", "求可行域的顶点，并在其中找到最优解。"],
    ["formulating-linear-programs"],
    [],
    [
      {
        ...point(
          "finding-a-corner-point",
          ["Finding a corner point", "求顶点"],
          [
            "With two variables, the constraints cut out a polygon called the feasible region. Its corners are where two boundary lines meet, so each corner comes from solving two equations together. Corners matter because of the central fact of linear programming: when an optimum exists, some corner attains it. The interior never needs a separate search, since a linear objective keeps improving until the boundary stops it.\n\nThe lines $x + 2y = 8$ and $3x + y = 9$ meet where twice the second minus the first gives $5x = 10$, so $x = 2$, and then $y = 9 - 6 = 3$.\n\nCheck: $2 + 2(3) = 8$ and $3(2) + 3 = 9$, so $(2, 3)$ lies on both lines.\n\n> **Watch out.** A corner must satisfy both equations. A point found from one equation alone lies on one line only.",
            "两个变量时，约束围成一个称为可行域的多边形。它的顶点是两条边界线的交点，所以每个顶点都来自联立两个方程。顶点重要，是因为线性规划的核心事实：最优解存在时，总有某个顶点能达到它。内部不必单独搜索，因为线性目标会一直改进，直到被边界挡住。\n\n直线 $x + 2y = 8$ 和 $3x + y = 9$ 的交点：第二个方程的两倍减去第一个，得 $5x = 10$，所以 $x = 2$，进而 $y = 9 - 6 = 3$。\n\n检验：$2 + 2(3) = 8$，$3(2) + 3 = 9$，所以 $(2, 3)$ 在两条直线上。\n\n> **注意。** 顶点必须同时满足两个方程。只由一个方程得到的点只在一条直线上。",
          ],
          (rng) => {
            const x = rng.int(2, 12);
            const y = rng.int(2, 12);
            const asksX = rng.bool();
            const [A, B] = [x + 2 * y, 3 * x + y];
            const [en, zh] = asksX ? ["$y$", "$y$"] : ["$x$", "$x$"];
            return solved(
              [
                `The boundary lines $x + 2y = ${A}$ and $3x + y = ${B}$ meet at a corner of a feasible region. What is its ${asksX ? "$x$" : "$y$"} coordinate?`,
                `边界线 $x + 2y = ${A}$ 和 $3x + y = ${B}$ 相交于可行域的一个顶点。它的${asksX ? "$x$" : "$y$"}坐标是多少？`,
              ],
              asksX ? x : y,
              [
                [asksX ? y : x, `That is the ${en} coordinate of the corner.`, `这是顶点的${zh}坐标。`],
                [x + y, "That adds the two coordinates together.", "这把两个坐标加在了一起。"],
                [
                  asksX ? A : B,
                  `That is the right side of the ${asksX ? "first" : "second"} equation, not a coordinate.`,
                  `这是${asksX ? "第一个" : "第二个"}方程的右端，不是坐标。`,
                ],
                [
                  asksX ? x + 1 : y + 1,
                  "That is one too many: put back into the equations, it does not balance them.",
                  "这多了 1：代回方程后两边不相等。",
                ],
              ],
              [
                [
                  ["Eliminate one variable", "消去一个变量"],
                  [
                    `Twice the second equation minus the first gives $5x = ${2 * B} - ${A} = ${2 * B - A}$, so $x = ${x}$.`,
                    `第二个方程的两倍减去第一个，得 $5x = ${2 * B} - ${A} = ${2 * B - A}$，所以 $x = ${x}$。`,
                  ],
                ],
                [
                  ["Substitute back", "回代"],
                  [`Then $y = ${B} - 3(${x}) = ${y}$.`, `于是 $y = ${B} - 3(${x}) = ${y}$。`],
                ],
              ],
              [
                `$${x} + 2(${y}) = ${A}$ and $3(${x}) + ${y} = ${B}$, so $(${x}, ${y})$ lies on both lines.`,
                `$${x} + 2(${y}) = ${A}$，$3(${x}) + ${y} = ${B}$，所以 $(${x}, ${y})$ 在两条直线上。`,
              ],
            );
          },
        ),
        figure: linearProgrammingDrawings1["the-graphical-method-for-linear-programs#finding-a-corner-point"],
      },
      {
        ...point(
          "the-best-corner",
          ["The best corner", "最好的顶点"],
          [
            "To solve a two-variable program by hand, list the corners of the feasible region, evaluate the objective at each, and take the best. Parallel lines of equal objective value slide across the region, and the last point they touch is the optimum, which explains why a corner always suffices. If two neighbouring corners tie, every point on the edge between them is optimal too.\n\nOn the region $x + y \\le 5$, $x \\le 3$, $x, y \\ge 0$, the corners are $(0, 0)$, $(3, 0)$, $(3, 2)$ and $(0, 5)$, where $2x + y$ is $0$, $6$, $8$ and $5$. The maximum is $8$, at $(3, 2)$.\n\nCheck: $(3, 2)$ satisfies $3 + 2 = 5 \\le 5$ and $3 \\le 3$, so the best value is reached by a feasible point.\n\n> **Watch out.** Compare every corner, not only the one where a single variable is largest, and leave out any crossing of lines that lies outside the region, however good its value.",
            "手工求解两个变量的规划时，列出可行域的顶点，在每个顶点计算目标值，再取最好的。目标值相等的平行线滑过可行域，最后碰到的点就是最优解，这解释了为什么只看顶点就够了。如果两个相邻顶点的值相等，它们之间那条边上的每个点也都是最优的。\n\n在可行域 $x + y \\le 5$，$x \\le 3$，$x, y \\ge 0$ 上，顶点是 $(0, 0)$，$(3, 0)$，$(3, 2)$ 和 $(0, 5)$，$2x + y$ 在这些点的值是 $0$，$6$，$8$ 和 $5$。最大值是 $8$，在 $(3, 2)$ 处取得。\n\n检验：$(3, 2)$ 满足 $3 + 2 = 5 \\le 5$ 和 $3 \\le 3$，所以最好的值由可行点取得。\n\n> **注意。** 要比较每个顶点，而不只是某个变量最大的那个；可行域外的直线交点，不论值多好，都不算。",
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
            return solved(
              [
                `Maximize $${objective}$ subject to $x + y \\le ${a}$, $x \\le ${b}$, $y \\le ${c}$, $x, y \\ge 0$. What is the maximum value?`,
                `在 $x + y \\le ${a}$，$x \\le ${b}$，$y \\le ${c}$，$x, y \\ge 0$ 的条件下，使 $${objective}$ 最大。最大值是多少？`,
              ],
              answer,
              [
                ...corners.map(
                  ([x, y], i): Miss => [
                    values[i] as number,
                    `That is the value at the corner $(${x}, ${y})$, which is not the largest.`,
                    `这是顶点 $(${x}, ${y})$ 处的值，不是最大的。`,
                  ],
                ),
                [
                  p * b + q * c,
                  `That is the value at $(${b}, ${c})$, which breaks $x + y \\le ${a}$, since $${b} + ${c} = ${b + c}$.`,
                  `这是 $(${b}, ${c})$ 处的值，但它不满足 $x + y \\le ${a}$，因为 $${b} + ${c} = ${b + c}$。`,
                ],
              ],
              [
                [
                  ["List the corners", "列出顶点"],
                  [
                    `Besides the origin, the corners are $(${b}, 0)$, $(${b}, ${a - b})$, $(${a - c}, ${c})$ and $(0, ${c})$.`,
                    `除原点外，顶点是 $(${b}, 0)$，$(${b}, ${a - b})$，$(${a - c}, ${c})$ 和 $(0, ${c})$。`,
                  ],
                ],
                [
                  ["Evaluate the objective", "计算目标值"],
                  [
                    `There $${objective}$ takes the values ${listed(values)}, and the largest is ${answer}, at $(${best[0]}, ${best[1]})$.`,
                    `目标 $${objective}$ 在这些点的值是 ${listed(values)}，最大的是 ${answer}，在 $(${best[0]}, ${best[1]})$ 处取得。`,
                  ],
                ],
              ],
              [
                `$(${best[0]}, ${best[1]})$ satisfies $${best[0]} + ${best[1]} = ${best[0] + best[1]} \\le ${a}$, $${best[0]} \\le ${b}$ and $${best[1]} \\le ${c}$, so the maximum ${answer} is reached by a feasible point.`,
                `$(${best[0]}, ${best[1]})$ 满足 $${best[0]} + ${best[1]} = ${best[0] + best[1]} \\le ${a}$，$${best[0]} \\le ${b}$ 和 $${best[1]} \\le ${c}$，所以最大值 ${answer} 由可行点取得。`,
              ],
              figure,
            );
          },
        ),
        figure: linearProgrammingDrawings1["the-graphical-method-for-linear-programs#the-best-corner"],
      },
    ],
  ),
  [
    "Maximize $x + 2y$ on the region $x + y \\le 4$, $x, y \\ge 0$. Its corners are $(0, 0)$, $(4, 0)$ and $(0, 4)$, where the objective is $0$, $4$ and $8$, so the maximum is $8$, at $(0, 4)$.",
    "在可行域 $x + y \\le 4$，$x, y \\ge 0$ 上使 $x + 2y$ 最大。它的顶点是 $(0, 0)$，$(4, 0)$ 和 $(0, 4)$，目标值分别是 $0$，$4$ 和 $8$，所以最大值是 $8$，在 $(0, 4)$ 处取得。",
  ],
  [
    "a point inside, such as $(1, 2)$, gives $1 + 4 = 5$, less than $8$, as the corner theorem predicts.",
    "内部的点，比如 $(1, 2)$，给出 $1 + 4 = 5$，小于 $8$，正如顶点定理所说。",
  ],
  [
    "find the corners of a feasible region by solving pairs of boundary equations, and compare the objective at them.",
    "通过联立边界方程求可行域的顶点，并比较各顶点处的目标值。",
  ],
);

const standardForm = lesson(
  topic(
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
          "The simplex method works with equations, so each inequality is rewritten first. A less-than constraint gains a slack variable, which measures the unused part of the resource and must be nonnegative. A point is feasible exactly when all its slack values are nonnegative, and a slack of zero means that the constraint is tight at that point, so the point lies on that boundary.\n\nFor $3x + 2y \\le 20$ at $(4, 2)$, the point uses $12 + 4 = 16$, so the slack in $3x + 2y + s = 20$ is $s = 4$.\n\nCheck: $16 + 4 = 20$, and $s \\ge 0$, so the point is feasible.\n\n> **Watch out.** The slack is what is left, the right side minus the amount used, not the amount used itself.",
          "单纯形法处理等式，所以先要把每个不等式改写。小于等于约束加上一个松弛变量，它度量资源未用的部分，必须非负。一个点可行，当且仅当它所有的松弛值都非负；松弛为零表示约束在这一点是紧的，这个点位于那条边界上。\n\n对 $3x + 2y \\le 20$，在 $(4, 2)$ 处用了 $12 + 4 = 16$，所以 $3x + 2y + s = 20$ 中的松弛是 $s = 4$。\n\n检验：$16 + 4 = 20$，且 $s \\ge 0$，所以这个点可行。\n\n> **注意。** 松弛是剩下的量，即右端减去用掉的量，而不是用掉的量本身。",
        ],
        (rng) => {
          const a = rng.int(2, 9);
          const b = rng.int(2, 9);
          const x = rng.int(1, 9);
          const y = rng.int(1, 9);
          const s = rng.int(0, 15);
          const c = a * x + b * y + s;
          const used = a * x + b * y;
          return solved(
            [
              `The constraint $${a}x + ${b}y \\le ${c}$ becomes $${a}x + ${b}y + s = ${c}$. What is $s$ at the point $(${x}, ${y})$?`,
              `约束 $${a}x + ${b}y \\le ${c}$ 变成 $${a}x + ${b}y + s = ${c}$。在点 $(${x}, ${y})$ 处，$s$ 是多少？`,
            ],
            s,
            [
              [used, `That is the amount the point uses, ${used}, not the amount left.`, `这是这个点用掉的量 ${used}，不是剩下的量。`],
              [
                s + a,
                `That counts one unit of $x$ too few: the point uses $${a}(${x})$ in full.`,
                `这少算了一单位 $x$：这个点用掉的是完整的 $${a}(${x})$。`,
              ],
              [
                s + b,
                `That counts one unit of $y$ too few: the point uses $${b}(${y})$ in full.`,
                `这少算了一单位 $y$：这个点用掉的是完整的 $${b}(${y})$。`,
              ],
              [c, "That is the whole right side, as if the point used nothing.", "这是整个右端，好像这个点什么都没用。"],
            ],
            [
              [
                ["Evaluate the left side", "计算左边"],
                [
                  `At $(${x}, ${y})$, $${a}x + ${b}y = ${a}(${x}) + ${b}(${y}) = ${used}$.`,
                  `在 $(${x}, ${y})$ 处，$${a}x + ${b}y = ${a}(${x}) + ${b}(${y}) = ${used}$。`,
                ],
              ],
              [
                ["Solve for the slack", "解出松弛变量"],
                [
                  `$s = ${c} - ${used} = ${s}$${s === 0 ? ", so the constraint is tight at this point" : ""}.`,
                  `$s = ${c} - ${used} = ${s}$${s === 0 ? "，所以约束在这一点是紧的" : ""}。`,
                ],
              ],
            ],
            [
              `$${used} + ${s} = ${c}$, and $s \\ge 0$, so the point is feasible.`,
              `$${used} + ${s} = ${c}$，且 $s \\ge 0$，所以这个点可行。`,
            ],
          );
        },
      ),
      point(
        "counting-variables-in-standard-form",
        ["Counting variables in standard form", "数标准形式中的变量"],
        [
          "In standard form, every constraint is an equation and every variable is nonnegative. Each less-than constraint adds a slack variable and each greater-than constraint subtracts a surplus variable, whereas an equality constraint needs neither. So the total number of variables is the number of original ones plus one for each inequality. The number of equations stays equal to the number of constraints.\n\nA program with 3 variables, 2 less-than constraints, 1 greater-than constraint and 1 equality has $3 + 2 + 1 = 6$ variables in standard form.\n\nCheck: its 4 constraints become 4 equations, and only the equality gained no new variable, so $3 + 4 - 1 = 6$.\n\n> **Watch out.** An equality constraint is already an equation, so it adds no variable.",
          "在标准形式中，每个约束都是等式，每个变量都非负。每个小于等于约束加一个松弛变量，每个大于等于约束减一个剩余变量，而等式约束都不需要。所以变量总数是原变量的个数加上不等式的个数。方程的个数仍然等于约束的个数。\n\n一个有 3 个变量、2 个小于等于约束、1 个大于等于约束和 1 个等式约束的规划，标准形式有 $3 + 2 + 1 = 6$ 个变量。\n\n检验：它的 4 个约束变成 4 个方程，只有等式约束没有增加新变量，所以 $3 + 4 - 1 = 6$。\n\n> **注意。** 等式约束本来就是方程，不增加变量。",
        ],
        (rng) => {
          const n = rng.int(2, 9);
          const le = rng.int(2, 6);
          const ge = rng.int(2, 5);
          const eq = rng.int(2, 4);
          const answer = n + le + ge;
          return solved(
            [
              `A program has ${n} variables, with ${le} less-than constraints, ${ge} greater-than constraints and ${eq} equality constraints. How many variables does its standard form have, counting slack and surplus?`,
              `一个规划有 ${n} 个变量，${le} 个小于等于约束，${ge} 个大于等于约束和 ${eq} 个等式约束。算上松弛变量和剩余变量，它的标准形式有多少个变量？`,
            ],
            answer,
            [
              [
                n + le,
                `That forgets the surplus variables of the ${ge} greater-than constraints.`,
                `这忘了 ${ge} 个大于等于约束的剩余变量。`,
              ],
              [
                answer + eq,
                `That gives the ${eq} equality constraints a variable too, but they need none.`,
                `这也给 ${eq} 个等式约束加了变量，但它们不需要。`,
              ],
              [n, "That counts only the original variables.", "这只数了原来的变量。"],
              [n + ge, `That forgets the slack variables of the ${le} less-than constraints.`, `这忘了 ${le} 个小于等于约束的松弛变量。`],
            ],
            [
              [
                ["Count the inequalities", "数不等式"],
                [
                  `There are $${le} + ${ge} = ${le + ge}$ inequalities, and each adds one slack or surplus variable.`,
                  `共有 $${le} + ${ge} = ${le + ge}$ 个不等式，每个增加一个松弛变量或剩余变量。`,
                ],
              ],
              [
                ["Add the original variables", "加上原变量"],
                [
                  `With the ${n} original variables, the total is $${n} + ${le + ge} = ${answer}$.`,
                  `加上原来的 ${n} 个变量，总数是 $${n} + ${le + ge} = ${answer}$。`,
                ],
              ],
            ],
            [
              `The ${le + ge + eq} constraints become ${le + ge + eq} equations, and only the ${eq} equalities gained no variable: $${n} + ${le + ge + eq} - ${eq} = ${answer}$.`,
              `这 ${le + ge + eq} 个约束变成 ${le + ge + eq} 个方程，只有 ${eq} 个等式没有增加变量：$${n} + ${le + ge + eq} - ${eq} = ${answer}$。`,
            ],
          );
        },
      ),
    ],
  ),
  [
    "The constraint $2x + 3y \\le 12$ becomes $2x + 3y + s = 12$ with $s \\ge 0$. At $(3, 1)$ the left side uses $6 + 3 = 9$, so $s = 3$: three units of the resource are left over.",
    "约束 $2x + 3y \\le 12$ 变成 $2x + 3y + s = 12$，其中 $s \\ge 0$。在 $(3, 1)$ 处左边用了 $6 + 3 = 9$，所以 $s = 3$：资源还剩 3 个单位。",
  ],
  ["$2(3) + 3(1) + 3 = 12$, as the equation requires.", "$2(3) + 3(1) + 3 = 12$，正如等式所要求的。"],
  [
    "turn inequalities into equations with slack and surplus variables, and count the variables that standard form needs.",
    "用松弛变量和剩余变量把不等式变成等式，并数出标准形式需要多少个变量。",
  ],
);

const basicSolutions = lesson(
  topic(
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
          "With m independent equations in n variables, a basic solution sets all but m variables to zero and solves for the rest. The m chosen variables form the basis. So there are at most n choose m basic solutions, which is finite, and only those with nonnegative values are basic feasible solutions. These are exactly the corners of the feasible region, written in algebra rather than geometry.\n\nWith 2 equations in 4 variables, a basis is a choice of 2 of the 4, so there are at most $\\binom{4}{2} = 6$ basic solutions.\n\nCheck: the pairs are $x_1 x_2$, $x_1 x_3$, $x_1 x_4$, $x_2 x_3$, $x_2 x_4$ and $x_3 x_4$, six in all.\n\n> **Watch out.** This is only an upper bound: some choices give a system with no unique solution, and only the nonnegative solutions are feasible.",
          "n 个变量的 m 个独立方程中，基本解把除 m 个以外的变量都设为零，再解出其余的变量。选出的 m 个变量构成基。所以基本解至多有 n 选 m 个，数目有限，其中取值都非负的才是基本可行解。它们恰好是可行域的顶点，只是用代数而不是几何来写。\n\n4 个变量的 2 个方程中，基是从 4 个变量里选 2 个，所以基本解至多有 $\\binom{4}{2} = 6$ 个。\n\n检验：这些对是 $x_1 x_2$，$x_1 x_3$，$x_1 x_4$，$x_2 x_3$，$x_2 x_4$ 和 $x_3 x_4$，共六个。\n\n> **注意。** 这只是一个上界：有些选法得到的方程组没有唯一解，而且只有非负的解才可行。",
        ],
        (rng) => {
          const n = rng.int(5, 13);
          const m = rng.int(2, 4);
          let answer = 1;
          for (let i = 0; i < m; i += 1) answer = (answer * (n - i)) / (i + 1);
          const top = Array.from({ length: m }, (_, i) => n - i).join(" \\times ");
          const bottom = Array.from({ length: m }, (_, i) => i + 1).join(" \\times ");
          return solved(
            [
              `A system has ${m} independent equations in ${n} variables. At most how many basic solutions can it have?`,
              `一个方程组有 ${n} 个变量和 ${m} 个独立方程。它至多有多少个基本解？`,
            ],
            answer,
            [
              [
                n * m,
                `That multiplies ${n} by ${m}, but a basis is a choice of ${m} variables, counted by $\\binom{${n}}{${m}}$.`,
                `这是 ${n} 乘 ${m}，但基是选 ${m} 个变量，个数是 $\\binom{${n}}{${m}}$。`,
              ],
              [
                answer * 2,
                `That doubles the count; each choice of ${m} variables gives one basic solution.`,
                `这把个数翻了一倍；每种选 ${m} 个变量的方法只给出一个基本解。`,
              ],
              [n - m, "That is the number of nonbasic variables, not the number of bases.", "这是非基变量的个数，不是基的个数。"],
              [
                n ** 2,
                `That squares ${n}, which counts ordered pairs, not choices of ${m} variables.`,
                `这是 ${n} 的平方，数的是有序对，不是选 ${m} 个变量的方法。`,
              ],
            ],
            [
              [
                ["Choose the basis", "选基"],
                [
                  `A basic solution is fixed by which ${m} of the ${n} variables are basic.`,
                  `一个基本解由 ${n} 个变量中哪 ${m} 个是基变量决定。`,
                ],
              ],
              [
                ["Count the choices", "数选法"],
                [
                  `$\\binom{${n}}{${m}} = \\frac{${top}}{${bottom}} = ${answer}$.`,
                  `$\\binom{${n}}{${m}} = \\frac{${top}}{${bottom}} = ${answer}$。`,
                ],
              ],
            ],
            [
              `Choosing the ${n - m} nonbasic variables instead gives the same count, $\\binom{${n}}{${n - m}} = ${answer}$.`,
              `改为选 ${n - m} 个非基变量，得到同样的个数 $\\binom{${n}}{${n - m}} = ${answer}$。`,
            ],
          );
        },
      ),
      {
        ...point(
          "computing-a-basic-solution",
          ["Computing a basic solution", "计算基本解"],
          [
            "To find a basic solution, set the nonbasic variables to zero and solve what remains. If every basic variable comes out nonnegative, the solution is feasible and it is a corner. If some value is negative, it is still a basic solution, but it lies outside the feasible region, at a place where two boundary lines cross beyond the polygon. The sign is what tells these two cases apart.\n\nFor $x_1 + 2x_2 + s_1 = 4$ and $3x_1 + x_2 + s_2 = 10$ with $x_2 = s_1 = 0$, the first equation gives $x_1 = 4$, and then $s_2 = 10 - 12 = -2$. This basic solution is not feasible.\n\nCheck: $3(4) + 0 - 2 = 10$, so the values do satisfy both equations.\n\n> **Watch out.** A negative value still gives a basic solution; it is just not feasible, so it is not a corner of the region.",
            "求基本解时，把非基变量设为零，再解剩下的方程。如果每个基变量都非负，这个解就是可行的，它是一个顶点。如果某个值是负的，它仍然是基本解，但位于可行域外，是两条边界线在多边形外的交点。正负号正是区分这两种情况的依据。\n\n对 $x_1 + 2x_2 + s_1 = 4$ 和 $3x_1 + x_2 + s_2 = 10$，取 $x_2 = s_1 = 0$，第一个方程给出 $x_1 = 4$，于是 $s_2 = 10 - 12 = -2$。这个基本解不可行。\n\n检验：$3(4) + 0 - 2 = 10$，所以这些值确实满足两个方程。\n\n> **注意。** 有负值时它仍是基本解，只是不可行，所以不是可行域的顶点。",
          ],
          (rng) => {
            const b = rng.int(2, 6);
            const c = rng.int(2, 7);
            const d = rng.int(2, 6);
            const A = rng.int(2, 12);
            const B = rng.int(4, 60);
            const answer = B - c * A;
            return solved(
              [
                `Take the equations $x_1 + ${b}x_2 + s_1 = ${A}$ and $${c}x_1 + ${d}x_2 + s_2 = ${B}$. In the basic solution with $x_2 = s_1 = 0$, what is $s_2$?`,
                `取方程 $x_1 + ${b}x_2 + s_1 = ${A}$ 和 $${c}x_1 + ${d}x_2 + s_2 = ${B}$。在 $x_2 = s_1 = 0$ 的基本解中，$s_2$ 是多少？`,
              ],
              answer,
              [
                [
                  B,
                  `That leaves out $${c}x_1$, which takes away ${c * A} when $x_1 = ${A}$.`,
                  `这漏掉了 $${c}x_1$；当 $x_1 = ${A}$ 时它要减去 ${c * A}。`,
                ],
                [B - A, `That subtracts $x_1 = ${A}$ once, but its coefficient is ${c}.`, `这只减了一次 $x_1 = ${A}$，但它的系数是 ${c}。`],
                [
                  c * A - B,
                  `That has the sign reversed: $s_2 = ${B} - ${c * A}$, not the other way round.`,
                  `这把符号弄反了：$s_2 = ${B} - ${c * A}$，而不是反过来。`,
                ],
                [
                  B - d * A,
                  `That uses the coefficient ${d} of $x_2$, but $x_2 = 0$; the term that counts is $${c}x_1$.`,
                  `这用了 $x_2$ 的系数 ${d}，但 $x_2 = 0$；起作用的是 $${c}x_1$。`,
                ],
              ],
              [
                [
                  ["Solve the first equation", "解第一个方程"],
                  [`With $x_2 = s_1 = 0$, the first equation gives $x_1 = ${A}$.`, `取 $x_2 = s_1 = 0$，第一个方程给出 $x_1 = ${A}$。`],
                ],
                [
                  ["Solve the second equation", "解第二个方程"],
                  [
                    `Then $${c}(${A}) + s_2 = ${B}$, so $s_2 = ${B} - ${c * A} = ${answer}$.${answer < 0 ? " It is negative, so this basic solution is not feasible." : ""}`,
                    `于是 $${c}(${A}) + s_2 = ${B}$，所以 $s_2 = ${B} - ${c * A} = ${answer}$。${answer < 0 ? "它是负数，所以这个基本解不可行。" : ""}`,
                  ],
                ],
              ],
              [
                `$${c}(${A}) + ${d}(0) ${plus(answer)} = ${B}$, so the values satisfy the second equation.`,
                `$${c}(${A}) + ${d}(0) ${plus(answer)} = ${B}$，所以这些值满足第二个方程。`,
              ],
            );
          },
        ),
        figure: linearProgrammingDrawings1["basic-feasible-solutions#computing-a-basic-solution"],
      },
    ],
  ),
  [
    "Take $x_1 + 2x_2 + s_1 = 8$ and $3x_1 + x_2 + s_2 = 9$. Setting the slack variables $s_1 = s_2 = 0$ leaves $x_1 + 2x_2 = 8$ and $3x_1 + x_2 = 9$, so $x_1 = 2$ and $x_2 = 3$. Both are nonnegative, so this basic solution is feasible: it is the corner $(2, 3)$.",
    "取 $x_1 + 2x_2 + s_1 = 8$ 和 $3x_1 + x_2 + s_2 = 9$。令松弛变量 $s_1 = s_2 = 0$，剩下 $x_1 + 2x_2 = 8$ 和 $3x_1 + x_2 = 9$，所以 $x_1 = 2$，$x_2 = 3$。两者都非负，所以这个基本解可行：它就是顶点 $(2, 3)$。",
  ],
  ["$2 + 2(3) = 8$ and $3(2) + 3 = 9$.", "$2 + 2(3) = 8$，$3(2) + 3 = 9$。"],
  [
    "count the basic solutions of a system, compute one by setting the nonbasic variables to zero, and tell the feasible ones by their signs.",
    "数方程组的基本解，令非基变量为零算出一个基本解，并由正负号判断它是否可行。",
  ],
);

const tableau = lesson(
  topic(
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
          "The simplex method walks from corner to corner, improving the objective at each step. In a maximization tableau, the objective row is written with the coefficients moved across, so a negative entry marks a variable that would raise the objective. The usual rule picks the most negative entry. When no negative entries remain, no neighbouring corner is better, and the current corner is optimal.\n\nIf the objective row reads $-4$, $-7$ and $2$ under $x_1$, $x_2$ and $x_3$, the most negative entry is $-7$, so $x_2$ enters.\n\nCheck: each unit of $x_2$ raises the objective by 7, more than the 4 of $x_1$, and $x_3$ would lower it.\n\n> **Watch out.** Most negative means smallest. A positive entry, however large, never enters a maximization.",
          "单纯形法从一个顶点走到另一个顶点，每一步都改进目标。在最大化的单纯形表中，目标行的系数是移项后写的，所以负数表示这个变量能提高目标。通常的法则选最负的数。当没有负数时，相邻的顶点都不更好，当前顶点就是最优的。\n\n如果目标行在 $x_1$，$x_2$，$x_3$ 下的数是 $-4$，$-7$ 和 $2$，最负的是 $-7$，所以 $x_2$ 进基。\n\n检验：每单位 $x_2$ 使目标增加 7，比 $x_1$ 的 4 多，而 $x_3$ 会使目标减少。\n\n> **注意。** 最负就是最小。正数不论多大，在最大化中都不会进基。",
        ],
        (rng) => {
          const entries = rng.shuffle([-rng.int(6, 12), -rng.int(1, 5), rng.int(1, 9), rng.int(0, 9)]);
          const index = entries.indexOf(Math.min(...entries));
          const least = entries[index] as number;
          const names = [0, 1, 2, 3].map((i): Pair => [`$x_{${i + 1}}$`, `$x_{${i + 1}}$`]);
          const negatives = entries.filter((e) => e < 0);
          return chosen(
            rng,
            [
              `The objective row of a maximization tableau has entries ${entries.map((e, i) => `$${e}$ under $x_{${i + 1}}$`).join(", ")}. Which variable enters under the most negative rule?`,
              `最大化单纯形表的目标行中，${entries.map((e, i) => `$x_{${i + 1}}$ 下的数是 $${e}$`).join("，")}。按最负法则，哪个变量进基？`,
            ],
            names[index] as Pair,
            entries.flatMap((e, i): Slip[] =>
              i === index
                ? []
                : [
                    e < 0
                      ? [
                          names[i] as Pair,
                          `Its entry $${e}$ is negative, but $${least}$ is more negative.`,
                          `它的数 $${e}$ 是负的，但 $${least}$ 更负。`,
                        ]
                      : [
                          names[i] as Pair,
                          `Its entry $${e}$ is not negative, so raising it would not increase the objective.`,
                          `它的数 $${e}$ 不是负的，所以增大它不会使目标增加。`,
                        ],
                  ],
            ),
            [
              [
                ["Find the negative entries", "找负数"],
                [`The negative entries are ${listed(negatives)}.`, `负数是 ${listed(negatives)}。`],
              ],
              [
                ["Take the most negative", "取最负的"],
                [
                  `The most negative is $${least}$, under $x_{${index + 1}}$, so $x_{${index + 1}}$ enters.`,
                  `最负的是 $x_{${index + 1}}$ 下的 $${least}$，所以 $x_{${index + 1}}$ 进基。`,
                ],
              ],
            ],
            [
              `Each unit of $x_{${index + 1}}$ raises the objective by ${-least}, more than any other variable would.`,
              `每单位 $x_{${index + 1}}$ 使目标增加 ${-least}，比其他任何变量都多。`,
            ],
          );
        },
      ),
      point(
        "the-ratio-test",
        ["The ratio test", "比值检验"],
        [
          "Once a variable enters, it grows until some basic variable reaches zero. For each row with a positive entry in the entering column, divide the right side by that entry. The smallest ratio tells how far the variable can go, and that row leaves the basis. Rows with zero or negative entries are skipped, since a growing variable does not push their basic variables down to zero.\n\nWith column entries $2$, $-1$ and $4$ and right sides $10$, $3$ and $12$, the middle row is skipped, and the ratios are $\\frac{10}{2} = 5$ and $\\frac{12}{4} = 3$. The smallest is $3$, so the third row leaves.\n\nCheck: at $3$ the third row reaches $12 - 4(3) = 0$, while the first still has $10 - 2(3) = 4$.\n\n> **Watch out.** Skip zero and negative entries: dividing by them gives a ratio that limits nothing.",
          "变量进基后不断增大，直到某个基变量变成零。对进基列中元素为正的每一行，用右端除以这个元素。最小的比值说明变量能增大多少，这一行离基。元素为零或负的行要跳过，因为变量增大不会把这些行的基变量压到零。\n\n进基列元素是 $2$，$-1$ 和 $4$，右端是 $10$，$3$ 和 $12$，中间一行跳过，比值是 $\\frac{10}{2} = 5$ 和 $\\frac{12}{4} = 3$。最小的是 $3$，所以第三行离基。\n\n检验：增大到 $3$ 时第三行变为 $12 - 4(3) = 0$，而第一行还有 $10 - 2(3) = 4$。\n\n> **注意。** 元素为零或负的行要跳过：用它们相除得到的比值不构成任何限制。",
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
          return solved(
            [
              `The entering column has entries ${listed(rows.map((r) => r[0] as number))}, and the right sides of those rows are ${listed(rows.map((r) => r[1] as number))}. What is the smallest ratio that counts?`,
              `进基列的元素是 ${listed(rows.map((r) => r[0] as number))}，这些行的右端是 ${listed(rows.map((r) => r[1] as number))}。有效的最小比值是多少？`,
            ],
            small,
            [
              [big, "That is the larger ratio; the smaller one stops the variable first.", "这是较大的比值；较小的那个先挡住变量。"],
              [
                Q.of(free, n),
                `That divides by the negative entry $${n}$, but rows with negative entries are skipped.`,
                `这是除以负元素 $${n}$，但元素为负的行要跳过。`,
              ],
              [
                Q.of(free, -n),
                `That uses the row with the entry $${n}$, ignoring its sign; that row is skipped.`,
                `这用了元素为 $${n}$ 的行，却忽略了它的符号；这一行要跳过。`,
              ],
              [
                small + 1,
                `That is one past the smallest ratio; the variable can grow only to ${small}.`,
                `这比最小比值多 1；变量只能增大到 ${small}。`,
              ],
            ],
            [
              [
                ["Skip the negative entry", "跳过负元素"],
                [
                  `The entry $${n}$ is negative, so its row puts no limit on the entering variable.`,
                  `元素 $${n}$ 是负的，所以这一行对进基变量没有限制。`,
                ],
              ],
              [
                ["Divide the other rows", "其余各行相除"],
                [
                  `$\\frac{${p * small}}{${p}} = ${small}$ and $\\frac{${q * big}}{${q}} = ${big}$, and the smaller is ${small}.`,
                  `$\\frac{${p * small}}{${p}} = ${small}$，$\\frac{${q * big}}{${q}} = ${big}$，较小的是 ${small}。`,
                ],
              ],
            ],
            [
              `At ${small}, the row with entry ${p} reaches $${p * small} - ${p}(${small}) = 0$, while the row with entry ${q} still has $${q * big} - ${q}(${small}) = ${q * (big - small)}$.`,
              `增大到 ${small} 时，元素为 ${p} 的行变为 $${p * small} - ${p}(${small}) = 0$，而元素为 ${q} 的行还有 $${q * big} - ${q}(${small}) = ${q * (big - small)}$。`,
            ],
          );
        },
      ),
    ],
  ),
  [
    "A maximization tableau has objective row $-5$, $-3$, $0$ under $x_1$, $x_2$, $s_1$. The most negative entry, $-5$, says that $x_1$ enters. If its column has entries $2$ and $1$ with right sides $8$ and $6$, the ratios are $4$ and $6$, so the first row leaves.",
    "最大化单纯形表的目标行在 $x_1$，$x_2$，$s_1$ 下是 $-5$，$-3$，$0$。最负的数 $-5$ 表示 $x_1$ 进基。如果它的列元素是 $2$ 和 $1$，右端是 $8$ 和 $6$，比值就是 $4$ 和 $6$，所以第一行离基。",
  ],
  [
    "raising $x_1$ to $4$ uses all of the first row, $8 - 2(4) = 0$, while the second row keeps $6 - 4 = 2$.",
    "把 $x_1$ 增大到 $4$ 用完了第一行，$8 - 2(4) = 0$，而第二行还剩 $6 - 4 = 2$。",
  ],
  [
    "choose the entering variable from the objective row and the leaving row by the ratio test.",
    "由目标行选择进基变量，并用比值检验选择离基行。",
  ],
);

const pivoting = lesson(
  topic(
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
          "A pivot is a round of row operations that makes the entering column a unit vector. Divide the pivot row by the pivot, then subtract multiples of it from every other row to clear the column. The right sides change along with everything else, and they give the new values of the basic variables. It is just Gaussian elimination, applied one column at a time.\n\nPivoting on the 3 in $3x_1 + 6x_2 + s_1 = 12$ gives $x_1 + 2x_2 + \\frac{1}{3}s_1 = 4$. Subtracting 2 times this from $2x_1 + 5x_2 + s_2 = 11$ leaves the $x_2$ coefficient $5 - 4 = 1$ and the right side $11 - 8 = 3$.\n\nCheck: the $x_1$ entry becomes $2 - 2 = 0$, as a pivot requires.\n\n> **Watch out.** Divide the pivot row first, then subtract; using the undivided row subtracts the wrong multiple.",
          "主元运算是一轮行变换，它把进基列变成单位向量。把主元行除以主元，再从其他每一行减去它的倍数，把这一列消去。右端也随之变化，它们给出基变量的新值。这就是高斯消元，一次处理一列。\n\n以 $3x_1 + 6x_2 + s_1 = 12$ 中的 3 为主元，得 $x_1 + 2x_2 + \\frac{1}{3}s_1 = 4$。从 $2x_1 + 5x_2 + s_2 = 11$ 减去它的 2 倍，$x_2$ 的系数变为 $5 - 4 = 1$，右端变为 $11 - 8 = 3$。\n\n检验：$x_1$ 的系数变为 $2 - 2 = 0$，正是主元运算所要求的。\n\n> **注意。** 先把主元行相除，再相减；用没有相除的行去减，减去的倍数就不对。",
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
          const [from, by] = asksRight ? [h, t] : [f, k];
          const done = asksRight ? `$${h} - ${e}(${t}) = ${answer}$` : `$${f} - ${e}(${k}) = ${answer}$`;
          const other = asksRight ? `$${f} - ${e}(${k}) = ${f - e * k}$` : `$${h} - ${e}(${t}) = ${h - e * t}$`;
          return solved(
            [
              `Pivoting on the ${a} in the row $${a}x_1 + ${a * k}x_2 + s_1 = ${a * t}$, what does the row $${e}x_1 + ${f}x_2 + s_2 = ${h}$ have as its ${asksRight ? "right side" : "$x_2$ coefficient"} afterwards?`,
              `以行 $${a}x_1 + ${a * k}x_2 + s_1 = ${a * t}$ 中的 ${a} 为主元，运算后行 $${e}x_1 + ${f}x_2 + s_2 = ${h}$ 的${asksRight ? "右端" : "$x_2$ 系数"}是多少？`,
            ],
            answer,
            [
              [
                from - a * by,
                `That subtracts the undivided pivot row once; the row must lose ${e} times the divided one.`,
                `这减去了一次没有相除的主元行；这一行应减去相除后那一行的 ${e} 倍。`,
              ],
              [
                from,
                `That leaves the row unchanged, but the pivot must clear its $${e}x_1$.`,
                `这一行没有变，但主元运算必须消去它的 $${e}x_1$。`,
              ],
              [
                from - by,
                `That subtracts the divided row once, but clearing $${e}x_1$ takes ${e} times it.`,
                `这只减去一次相除后的行，但消去 $${e}x_1$ 需要它的 ${e} 倍。`,
              ],
              [
                answer + e,
                `That subtracts ${e} times ${by - 1} instead of ${e} times ${by}.`,
                `这减去的是 ${e} 乘 ${by - 1}，而不是 ${e} 乘 ${by}。`,
              ],
            ],
            [
              [
                ["Divide the pivot row", "主元行相除"],
                [
                  `Dividing by ${a} gives $x_1 + ${term(k, "x_2")} + \\frac{1}{${a}}s_1 = ${t}$.`,
                  `除以 ${a}，得 $x_1 + ${term(k, "x_2")} + \\frac{1}{${a}}s_1 = ${t}$。`,
                ],
              ],
              [
                ["Clear the column", "消去这一列"],
                [
                  `Subtracting ${e} times this row removes $${e}x_1$ and leaves ${done}.`,
                  `减去这一行的 ${e} 倍，消去 $${e}x_1$，得 ${done}。`,
                ],
              ],
            ],
            [
              `Afterwards the $x_1$ entry is $${e} - ${e}(1) = 0$, as a pivot requires, and the ${asksRight ? "$x_2$ coefficient" : "right side"} is ${other}.`,
              `运算后 $x_1$ 的系数是 $${e} - ${e}(1) = 0$，正是主元运算所要求的，而${asksRight ? "$x_2$ 系数" : "右端"}是 ${other}。`,
            ],
          );
        },
      ),
      point(
        "the-objective-after-a-pivot",
        ["The objective after a pivot", "主元运算后的目标值"],
        [
          "The gain from a pivot can be predicted before doing it. The entering variable has a reduced profit, the rate at which the objective rises per unit, and the ratio test says how many units it can take. Their product is the increase. So the new objective value is the old one plus the rate times the step, which provides a useful check on the arithmetic of the whole pivot.\n\nWith the objective at 10, a rate of 3 per unit and a smallest ratio of 4, the pivot raises the objective by $3 \\times 4 = 12$, to $22$.\n\nCheck: $22 - 10 = 12$, and $\\frac{12}{3} = 4$ is the step.\n\n> **Watch out.** Multiply the rate by the step. Adding them mixes a rate per unit with a number of units.",
          "主元运算的收益可以预先算出。进基变量有一个检验数，也就是每增加一单位目标上升的速率，而比值检验说明它能增加多少单位。两者的乘积就是增加量。所以新的目标值等于旧值加上速率乘步长，这是检验整个主元运算是否算对的好办法。\n\n目标值是 10，速率是每单位 3，最小比值是 4，主元运算使目标增加 $3 \\times 4 = 12$，变为 $22$。\n\n检验：$22 - 10 = 12$，而 $\\frac{12}{3} = 4$ 正是步长。\n\n> **注意。** 要把速率乘以步长。把它们相加，就把每单位的速率和单位个数混在了一起。",
        ],
        (rng) => {
          const z = rng.int(0, 40);
          const c = rng.int(2, 9);
          const step = rng.int(2, 9);
          const answer = z + c * step;
          return solved(
            [
              `The objective is now ${z}. The entering variable raises it by ${c} per unit, and the smallest ratio is ${step}. What is the objective after the pivot?`,
              `目标值现在是 ${z}。进基变量每增加一单位使它增加 ${c}，最小比值是 ${step}。主元运算后目标值是多少？`,
            ],
            answer,
            [
              [c * step, `That is only the increase; add it to the current ${z}.`, `这只是增加量；还要加上现在的 ${z}。`],
              [z + c + step, "That adds the rate and the step instead of multiplying them.", "这是把速率和步长相加，而不是相乘。"],
              [
                z + c,
                `That counts one unit of the entering variable, but it rises by ${step}.`,
                `这只算了进基变量的一个单位，但它增加了 ${step}。`,
              ],
              [
                answer + c,
                `That takes ${step + 1} units, one more than the ratio test allows.`,
                `这取了 ${step + 1} 个单位，比比值检验允许的多一个。`,
              ],
            ],
            [
              [
                ["Find the increase", "求增加量"],
                [`The rate times the step is $${c} \\times ${step} = ${c * step}$.`, `速率乘步长是 $${c} \\times ${step} = ${c * step}$。`],
              ],
              [
                ["Add it on", "加上去"],
                [`The new objective is $${z} + ${c * step} = ${answer}$.`, `新的目标值是 $${z} + ${c * step} = ${answer}$。`],
              ],
            ],
            [
              `$${answer} - ${z} = ${c * step}$, and dividing by the rate ${c} gives back the step ${step}.`,
              `$${answer} - ${z} = ${c * step}$，除以速率 ${c} 又得到步长 ${step}。`,
            ],
          );
        },
      ),
    ],
  ),
  [
    "Pivot on the 2 in $2x_1 + 4x_2 + s_1 = 10$. Dividing the row gives $x_1 + 2x_2 + \\frac{1}{2}s_1 = 5$, and subtracting 3 times this from $3x_1 + 7x_2 + s_2 = 20$ leaves $x_2 - \\frac{3}{2}s_1 + s_2 = 5$.",
    "以 $2x_1 + 4x_2 + s_1 = 10$ 中的 2 为主元。这一行相除得 $x_1 + 2x_2 + \\frac{1}{2}s_1 = 5$，从 $3x_1 + 7x_2 + s_2 = 20$ 减去它的 3 倍，得 $x_2 - \\frac{3}{2}s_1 + s_2 = 5$。",
  ],
  ["$7 - 3(2) = 1$ and $20 - 3(5) = 5$, matching the new row.", "$7 - 3(2) = 1$，$20 - 3(5) = 5$，与新的一行相符。"],
  [
    "carry out a pivot row by row, and predict the objective after it from the rate and the step.",
    "逐行进行主元运算，并由速率和步长预测运算后的目标值。",
  ],
);

const twoPhase = lesson(
  topic(
    "the-two-phase-method",
    ["The Two-Phase Method", "两阶段法"],
    [
      "Start the simplex method when no obvious basis exists, and detect infeasibility.",
      "在没有明显基时启动单纯形法，并发现不可行的情况。",
    ],
    ["pivoting-in-the-simplex-method"],
    [],
    [
      point(
        "counting-artificial-variables",
        ["Counting artificial variables", "数人工变量"],
        [
          "A less-than constraint with a nonnegative right side has a slack variable ready to serve in the starting basis. A greater-than constraint does not, because its surplus variable appears with a minus sign, and an equality has no such variable at all. Each of those needs a temporary artificial variable, which exists only to get the method started and must finally be driven to zero.\n\nA program with 3 less-than constraints, 2 greater-than constraints and 1 equality needs $2 + 1 = 3$ artificial variables.\n\nCheck: the 3 slack variables and the 3 artificial variables give one starting basic variable for each of the 6 constraints.\n\n> **Watch out.** A greater-than constraint does have a surplus variable, but it enters with a minus sign, so starting it in the basis would make it negative; such a constraint still needs an artificial variable.",
          "右端非负的小于等于约束有现成的松弛变量，可以进入初始基。大于等于约束没有，因为它的剩余变量带负号；等式约束则根本没有这样的变量。这些约束各需要一个临时的人工变量，它只用于启动方法，最后必须变成零。\n\n一个有 3 个小于等于约束、2 个大于等于约束和 1 个等式约束的规划，需要 $2 + 1 = 3$ 个人工变量。\n\n检验：3 个松弛变量和 3 个人工变量，正好为 6 个约束各提供一个初始基变量。\n\n> **注意。** 大于等于约束确实有剩余变量，但它带负号，放进初始基会取负值；所以这样的约束仍需要人工变量。",
        ],
        (rng) => {
          const le = rng.int(2, 6);
          const ge = rng.int(2, 5);
          const eq = rng.int(2, 4);
          const answer = ge + eq;
          return solved(
            [
              `A program with nonnegative right sides has ${le} less-than constraints, ${ge} greater-than constraints and ${eq} equality constraints. How many artificial variables does phase one need?`,
              `一个右端非负的规划有 ${le} 个小于等于约束，${ge} 个大于等于约束和 ${eq} 个等式约束。第一阶段需要多少个人工变量？`,
            ],
            answer,
            [
              [
                le + ge + eq,
                `That gives the ${le} less-than constraints one too, but their slack variables are ready to start the basis.`,
                `这也给 ${le} 个小于等于约束加了人工变量，但它们的松弛变量可以直接进入初始基。`,
              ],
              [
                ge,
                `That forgets the ${eq} equality constraints, which have no slack variable at all.`,
                `这忘了 ${eq} 个等式约束，它们根本没有松弛变量。`,
              ],
              [
                eq,
                `That forgets the ${ge} greater-than constraints, whose surplus variables cannot start the basis.`,
                `这忘了 ${ge} 个大于等于约束，它们的剩余变量不能进入初始基。`,
              ],
              [
                le + ge,
                `That counts the less-than constraints, which need none, and leaves out the ${eq} equalities.`,
                `这数了不需要人工变量的小于等于约束，却漏掉了 ${eq} 个等式约束。`,
              ],
            ],
            [
              [
                ["Find the constraints without a ready variable", "找出没有现成变量的约束"],
                [
                  `The ${le} less-than constraints have slack variables ready; the ${ge} greater-than and ${eq} equality constraints do not.`,
                  `${le} 个小于等于约束有现成的松弛变量；${ge} 个大于等于约束和 ${eq} 个等式约束没有。`,
                ],
              ],
              [
                ["Count them", "数一数"],
                [
                  `Each of those needs one artificial variable: $${ge} + ${eq} = ${answer}$.`,
                  `它们各需要一个人工变量：$${ge} + ${eq} = ${answer}$。`,
                ],
              ],
            ],
            [
              `The ${le} slack variables and ${answer} artificial variables give one starting basic variable for each constraint: $${le} + ${answer} = ${le + ge + eq}$.`,
              `${le} 个松弛变量和 ${answer} 个人工变量为每个约束各提供一个初始基变量：$${le} + ${answer} = ${le + ge + eq}$。`,
            ],
          );
        },
      ),
      point(
        "reading-the-end-of-phase-one",
        ["Reading the end of phase one", "解读第一阶段的结果"],
        [
          "Phase one minimizes the sum of the artificial variables. If the minimum is zero, all of them have left the solution, so the point reached is feasible for the original problem, and phase two continues from there with the true objective. If the minimum is positive, no choice of variables can satisfy the constraints without help from an artificial variable, so the original program is infeasible.\n\nIf phase one ends with the sum at 0, phase two starts from that basis. If it ends at 3, the original program is infeasible.\n\nCheck: a feasible point of the original program, with every artificial variable set to 0, would give a sum of 0, so a minimum of 3 rules out any feasible point.\n\n> **Watch out.** A positive minimum is about the constraints, not the objective: the program is infeasible, not unbounded.",
          "第一阶段使人工变量之和最小。如果最小值是零，它们都已离开解，得到的点对原问题是可行的，第二阶段用真正的目标从那里继续。如果最小值是正的，没有人工变量的帮助，任何取值都不能满足约束，所以原规划不可行。\n\n如果第一阶段结束时和为 0，第二阶段就从这个基开始。如果结束时和为 3，原规划不可行。\n\n检验：原规划的可行点，把所有人工变量都设为 0，和就是 0，所以最小值为 3 说明不存在可行点。\n\n> **注意。** 最小值为正说的是约束，不是目标：规划不可行，而不是无界。",
        ],
        (rng) => {
          const k = rng.int(2, 7);
          const zero = rng.bool();
          const v = zero ? 0 : rng.int(1, 30);
          const go: Pair = ["Continue with phase two from this basis", "从这个基开始第二阶段"];
          const no: Pair = ["The original program is infeasible", "原规划不可行"];
          return chosen(
            rng,
            [
              `Phase one, with ${k} artificial variables, ends with their sum at its minimum value of ${v}. What follows?`,
              `第一阶段有 ${k} 个人工变量，结束时它们的和取最小值 ${v}。接下来是什么结论？`,
            ],
            zero ? go : no,
            [
              zero
                ? [no, "Infeasibility needs a positive minimum, but this minimum is 0.", "不可行需要最小值为正，但这里最小值是 0。"]
                : [
                    go,
                    `Phase two needs a feasible start, and a minimum of ${v} means none exists.`,
                    `第二阶段需要可行的起点，而最小值为 ${v} 说明不存在可行点。`,
                  ],
              [
                ["The original program is unbounded", "原规划无界"],
                "Phase one says nothing about the objective growing; it only tests whether the constraints can be met.",
                "第一阶段与目标能否无限增大无关；它只检验约束能否满足。",
              ],
              zero
                ? [
                    ["The current point is optimal for the original objective", "当前点对原目标已是最优"],
                    "Phase one ignores the true objective, so the point is only known to be feasible.",
                    "第一阶段不考虑真正的目标，所以只知道这个点可行。",
                  ]
                : [
                    ["The current point is optimal for the original objective", "当前点对原目标已是最优"],
                    "With a positive minimum there is no feasible point at all, let alone an optimal one.",
                    "最小值为正时根本没有可行点，更谈不上最优点。",
                  ],
            ],
            [
              [
                ["Read the minimum", "看最小值"],
                zero
                  ? ["The minimum is 0, so every artificial variable equals 0.", "最小值是 0，所以每个人工变量都等于 0。"]
                  : [
                      `The minimum is ${v}, so some artificial variable stays positive however the variables are chosen.`,
                      `最小值是 ${v}，所以不论怎样取值，总有人工变量保持为正。`,
                    ],
              ],
              [
                ["Draw the conclusion", "得出结论"],
                zero
                  ? [
                      "The point is feasible for the original program, so phase two starts there.",
                      "这个点对原规划可行，所以第二阶段从这里开始。",
                    ]
                  : ["The original constraints cannot all hold, so the program is infeasible.", "原约束不能同时成立，所以规划不可行。"],
              ],
            ],
            zero
              ? [
                  "With every artificial variable at 0, the original constraints hold exactly at this point.",
                  "所有人工变量都为 0 时，原约束在这一点恰好成立。",
                ]
              : [
                  `A feasible point, with every artificial variable set to 0, would give a sum of 0, below the minimum ${v}.`,
                  `如果有可行点，把所有人工变量设为 0，和就是 0，比最小值 ${v} 还小。`,
                ],
          );
        },
      ),
    ],
  ),
  [
    "The constraints $x + y \\ge 4$ and $x + 2y = 6$ offer no slack variable to start from. Phase one writes $x + y - s + a_1 = 4$ and $x + 2y + a_2 = 6$, starts from $a_1 = 4$ and $a_2 = 6$, and minimizes $a_1 + a_2$. It ends at $(2, 2)$ with $a_1 = a_2 = 0$.",
    "约束 $x + y \\ge 4$ 和 $x + 2y = 6$ 没有可以起步的松弛变量。第一阶段写成 $x + y - s + a_1 = 4$ 和 $x + 2y + a_2 = 6$，从 $a_1 = 4$、$a_2 = 6$ 出发，使 $a_1 + a_2$ 最小。它在 $(2, 2)$ 处结束，此时 $a_1 = a_2 = 0$。",
  ],
  [
    "at $(2, 2)$, $2 + 2 = 4$ and $2 + 4 = 6$, so both original constraints hold without any artificial variable.",
    "在 $(2, 2)$ 处，$2 + 2 = 4$，$2 + 4 = 6$，所以不用人工变量，两个原约束都成立。",
  ],
  [
    "count the artificial variables that phase one needs, and read what the end of phase one says about the original program.",
    "数出第一阶段需要的人工变量，并解读第一阶段的结果对原规划意味着什么。",
  ],
);

const specialCases = lesson(
  topic(
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
          "The entering column decides what happens next. If it has no positive entry, the variable can grow forever while staying feasible, so the objective has no upper limit and the program is unbounded. If the smallest ratio is shared by two rows, then one of their basic variables stays in the basis with value zero after the pivot, which makes the next corner degenerate. Otherwise, it is an ordinary pivot.\n\nWith column entries $3$ and $1$ and right sides $6$ and $2$, both ratios equal $2$, so the next corner is degenerate.\n\nCheck: after pivoting on the first row, the second row keeps $2 - 1(2) = 0$, a basic variable at zero.\n\n> **Watch out.** A tie does not stop the method, and negative entries do not make it fail; only a column with no positive entry at all shows that the program is unbounded.",
          "进基列决定接下来发生什么。如果它没有正元素，变量可以一直增大而保持可行，目标没有上限，规划无界。如果两行的最小比值相同，主元运算后其中一行的基变量留在基中且值为零，下一个顶点就是退化的。否则就是普通的主元运算。\n\n进基列元素是 $3$ 和 $1$，右端是 $6$ 和 $2$，两个比值都等于 $2$，所以下一个顶点是退化的。\n\n检验：以第一行为主元行运算后，第二行剩下 $2 - 1(2) = 0$，有一个基变量为零。\n\n> **注意。** 并列不会让方法停止，有负元素也不会让它失败；只有整列没有一个正元素，才说明规划无界。",
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
          const reasons: Record<string, Pair> = {
            unbounded: [
              "A positive entry limits the variable, so nothing shows the program unbounded.",
              "有正元素限制变量，所以看不出规划无界。",
            ],
            degenerate:
              kind === "unbounded"
                ? ["With no positive entry there are no ratios, so there is nothing to tie.", "没有正元素就没有比值，也就谈不上并列。"]
                : [
                    `The ratios ${r1} and ${r2} differ, so no tie leaves a basic variable at zero.`,
                    `比值 ${r1} 和 ${r2} 不同，没有并列使基变量取零。`,
                  ],
            ordinary:
              kind === "unbounded"
                ? ["No row limits the variable, so no row leaves.", "没有一行限制变量，所以没有行离基。"]
                : [
                    `Both ratios equal ${r1}, so the pivot leaves a basic variable at zero, which makes the next corner degenerate.`,
                    `两个比值都等于 ${r1}，主元运算后有一个基变量取零，下一个顶点是退化的。`,
                  ],
            optimal: [
              "The column is entering because its objective entry is negative, so the current corner is not optimal.",
              "这一列进基是因为它的目标行元素是负的，所以当前顶点不是最优的。",
            ],
          };
          return chosen(
            rng,
            [
              `In a maximization tableau the entering column has entries ${listed(column)}, and the right sides of those rows are ${listed(right)}. What does this show?`,
              `最大化单纯形表的进基列元素是 ${listed(column)}，这些行的右端是 ${listed(right)}。这说明什么？`,
            ],
            words[kind] as Pair,
            Object.entries(words)
              .filter(([w]) => w !== kind)
              .map(([w, option]): Slip => [option, (reasons[w] as Pair)[0], (reasons[w] as Pair)[1]]),
            kind === "unbounded"
              ? [
                  [
                    ["Look for positive entries", "找正元素"],
                    [`The entries ${listed(column)} are all negative.`, `元素 ${listed(column)} 都是负的。`],
                  ],
                  [
                    ["Draw the conclusion", "得出结论"],
                    [
                      "No ratio limits the entering variable, so the objective can grow without bound.",
                      "没有比值限制进基变量，所以目标可以无限增大。",
                    ],
                  ],
                ]
              : [
                  [
                    ["Look for positive entries", "找正元素"],
                    ["Both entries are positive, so both rows give ratios.", "两个元素都是正的，所以两行都给出比值。"],
                  ],
                  [
                    ["Compare the ratios", "比较比值"],
                    [
                      `The ratios are $\\frac{${p * r1}}{${p}} = ${r1}$ and $\\frac{${q * r2}}{${q}} = ${r2}$${kind === "degenerate" ? ", a tie" : `, and the smaller, ${r1}, decides the leaving row`}.`,
                      `比值是 $\\frac{${p * r1}}{${p}} = ${r1}$ 和 $\\frac{${q * r2}}{${q}} = ${r2}$${kind === "degenerate" ? "，两者并列" : `，较小的 ${r1} 决定离基行`}。`,
                    ],
                  ],
                ],
            kind === "unbounded"
              ? [
                  `Raising the variable by any amount $t$ turns the right sides into $${right[0]} + ${p === 1 ? "" : p}t$ and $${right[1]} + ${q === 1 ? "" : q}t$, which never fall below zero.`,
                  `把变量增大任意的量 $t$，右端变成 $${right[0]} + ${p === 1 ? "" : p}t$ 和 $${right[1]} + ${q === 1 ? "" : q}t$，永远不会小于零。`,
                ]
              : kind === "degenerate"
                ? [
                    `After the pivot on the first row, the second row keeps $${q * r1} - ${q}(${r1}) = 0$.`,
                    `以第一行为主元行运算后，第二行剩下 $${q * r1} - ${q}(${r1}) = 0$。`,
                  ]
                : [
                    `At ${r1} the second row still has $${q * r2} - ${q}(${r1}) = ${q * (r2 - r1)}$, so only the first row reaches zero.`,
                    `增大到 ${r1} 时第二行还有 $${q * r2} - ${q}(${r1}) = ${q * (r2 - r1)}$，所以只有第一行变为零。`,
                  ],
          );
        },
      ),
      point(
        "a-degenerate-step",
        ["A degenerate step", "退化的一步"],
        [
          "At a degenerate corner, some basic variable already equals zero. If the entering column has a positive entry in that row, the ratio is zero, so the pivot changes the basis without moving the point, and the objective stays exactly where it was. Such steps are usually harmless, but in rare cases the method can cycle through bases forever, and Bland's rule is a choice of pivots that prevents it.\n\nWith the objective at 30, a rate of 4 per unit, and right sides 0 and 9 in rows with positive entries, the smallest ratio is 0, so the objective stays at 30.\n\nCheck: the increase is $4 \\times 0 = 0$.\n\n> **Watch out.** The ratio of the row with right side 0 is 0, however large the other ratios are; the step has length zero.",
          "在退化的顶点，某个基变量已经等于零。如果进基列在这一行有正元素，比值就是零，所以主元运算改变了基却没有移动这个点，目标值完全不变。这样的步骤通常无害，但在极少数情况下方法会在基之间无限循环，布兰德法则是一种防止循环的主元选择。\n\n目标值是 30，速率是每单位 4，元素为正的两行右端是 0 和 9，最小比值是 0，所以目标值保持 30。\n\n检验：增加量是 $4 \\times 0 = 0$。\n\n> **注意。** 右端为 0 的行比值是 0，不论其他比值多大；这一步的步长为零。",
        ],
        (rng) => {
          const z = rng.int(5, 60);
          const c = rng.int(2, 9);
          const p = rng.int(2, 6);
          const q = rng.int(1, 6);
          const r = rng.int(2, 20);
          return solved(
            [
              `The objective is ${z}, and the entering variable raises it by ${c} per unit. Its column has entries ${p} and ${q}, with right sides 0 and ${r}. What is the objective after the pivot?`,
              `目标值是 ${z}，进基变量每增加一单位使它增加 ${c}。进基列元素是 ${p} 和 ${q}，右端是 0 和 ${r}。主元运算后目标值是多少？`,
            ],
            z,
            [
              [z + c, "That takes a step of one unit, but the first row's ratio is 0.", "这走了一个单位，但第一行的比值是 0。"],
              [
                z + c * r,
                `That moves by ${r}, the right side of the second row, but the first row stops the variable at once.`,
                `这走了 ${r}，即第二行的右端，但第一行立刻挡住了变量。`,
              ],
              [z + c * p, `That moves by the entry ${p}, which is not a ratio at all.`, `这走了元素 ${p}，它根本不是比值。`],
              [z + r, `That adds the right side ${r} to the objective.`, `这把右端 ${r} 加到了目标值上。`],
            ],
            [
              [
                ["Find the smallest ratio", "求最小比值"],
                [
                  `The ratios are $\\frac{0}{${p}} = 0$ and $\\frac{${r}}{${q}}$, so the smallest is 0.`,
                  `比值是 $\\frac{0}{${p}} = 0$ 和 $\\frac{${r}}{${q}}$，所以最小的是 0。`,
                ],
              ],
              [
                ["Find the change", "求变化量"],
                [`The objective changes by $${c} \\times 0 = 0$, so it stays at ${z}.`, `目标值变化 $${c} \\times 0 = 0$，所以保持 ${z}。`],
              ],
            ],
            [
              "The basis changes, but the point does not move, so every variable keeps its value and so does the objective.",
              "基变了，但点没有移动，所以每个变量都保持原值，目标值也一样。",
            ],
          );
        },
      ),
    ],
  ),
  [
    "In one tableau the entering column has entries $-1$ and $-2$: no row limits the variable, so the program is unbounded. In another, the entries are $2$ and $1$ with right sides $6$ and $3$, and both ratios equal $3$: a tie, so the next corner is degenerate.",
    "在一张表中，进基列元素是 $-1$ 和 $-2$：没有一行限制变量，所以规划无界。在另一张表中，元素是 $2$ 和 $1$，右端是 $6$ 和 $3$，两个比值都等于 $3$：并列，所以下一个顶点是退化的。",
  ],
  [
    "in the tie, pivoting on the first row leaves the second with $3 - 1(3) = 0$.",
    "并列时，以第一行为主元行运算后，第二行剩下 $3 - 1(3) = 0$。",
  ],
  [
    "read the entering column to tell an unbounded program, a degenerate pivot and an ordinary one apart, and see why a degenerate step leaves the objective unchanged.",
    "通过解读进基列区分无界规划、退化的主元运算和普通的主元运算，并理解退化的一步为什么不改变目标值。",
  ],
);

const dualProgram = lesson(
  topic(
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
          "Every linear program has a partner called its dual. For a program maximizing $c^T x$ subject to $Ax \\le b$ with $x \\ge 0$, the dual minimizes $b^T y$ subject to $A^T y \\ge c$ with $y \\ge 0$. There is one dual variable for each constraint, so the right sides of the primal become the costs of the dual, and the roles swap.\n\nIf a maximization program has two constraints with right sides 10 and 15, its dual minimizes $10y_1 + 15y_2$.\n\nCheck: two constraints give two dual variables, one for each right side.\n\n> **Watch out.** The dual's costs come from the primal's right sides, not from its objective; the objective coefficients become the right sides of the dual.",
          "每个线性规划都有一个称为对偶的伙伴。对于在 $Ax \\le b$、$x \\ge 0$ 的条件下使 $c^T x$ 最大的规划，它的对偶是在 $A^T y \\ge c$、$y \\ge 0$ 的条件下使 $b^T y$ 最小。每个约束对应一个对偶变量，所以原问题的右端变成对偶的系数，两者角色互换。\n\n如果一个最大化规划有两个约束，右端是 10 和 15，它的对偶就是使 $10y_1 + 15y_2$ 最小。\n\n检验：两个约束给出两个对偶变量，每个右端对应一个。\n\n> **注意。** 对偶的系数来自原问题的右端，而不是它的目标；目标系数变成对偶的右端。",
        ],
        (rng) => {
          const c1 = rng.int(2, 9);
          const c2 = rng.pick([2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== c1));
          const [a, b, c, d] = [rng.int(1, 5), rng.int(1, 5), rng.int(1, 5), rng.int(1, 5)];
          const b1 = rng.int(10, 40);
          const b2 = b1 + rng.int(1, 12);
          return chosen(
            rng,
            [
              `What is the objective of the dual of: maximize $${c1}x_1 + ${c2}x_2$ subject to $${term(a, "x_1")} + ${term(b, "x_2")} \\le ${b1}$, $${term(c, "x_1")} + ${term(d, "x_2")} \\le ${b2}$, $x \\ge 0$?`,
              `规划“在 $${term(a, "x_1")} + ${term(b, "x_2")} \\le ${b1}$，$${term(c, "x_1")} + ${term(d, "x_2")} \\le ${b2}$，$x \\ge 0$ 的条件下使 $${c1}x_1 + ${c2}x_2$ 最大”的对偶目标是什么？`,
            ],
            [`Minimize $${b1}y_1 + ${b2}y_2$`, `使 $${b1}y_1 + ${b2}y_2$ 最小`],
            [
              [
                [`Maximize $${b1}y_1 + ${b2}y_2$`, `使 $${b1}y_1 + ${b2}y_2$ 最大`],
                "The dual of a maximum is a minimum.",
                "最大化的对偶是最小化。",
              ],
              [
                [`Minimize $${c1}y_1 + ${c2}y_2$`, `使 $${c1}y_1 + ${c2}y_2$ 最小`],
                "Those are the primal's objective coefficients; in the dual they become the right sides.",
                "这些是原问题的目标系数；在对偶中它们变成右端。",
              ],
              [
                [`Minimize $${b2}y_1 + ${b1}y_2$`, `使 $${b2}y_1 + ${b1}y_2$ 最小`],
                `That swaps the right sides: $y_1$ belongs to the first constraint, whose right side is ${b1}.`,
                `这把右端对调了：$y_1$ 属于第一个约束，它的右端是 ${b1}。`,
              ],
            ],
            [
              [
                ["Choose the direction", "确定方向"],
                ["The primal is a maximum, so its dual is a minimum.", "原问题是最大化，所以它的对偶是最小化。"],
              ],
              [
                ["Read the right sides", "读出右端"],
                [
                  `The constraints have right sides ${b1} and ${b2}, so the dual objective is $${b1}y_1 + ${b2}y_2$.`,
                  `约束的右端是 ${b1} 和 ${b2}，所以对偶目标是 $${b1}y_1 + ${b2}y_2$。`,
                ],
              ],
            ],
            [
              `Each dual variable prices one constraint, so $y_1$ pairs with ${b1} and $y_2$ with ${b2}.`,
              `每个对偶变量给一个约束定价，所以 $y_1$ 对应 ${b1}，$y_2$ 对应 ${b2}。`,
            ],
          );
        },
      ),
      point(
        "a-constraint-of-the-dual",
        ["A constraint of the dual", "对偶的约束"],
        [
          "Each primal variable gives one dual constraint, built by reading down its column. The column of the first variable supplies the coefficients of the first dual constraint, and its objective coefficient supplies the right side. Because the matrix is transposed, reading across a row by mistake gives the wrong constraint. A dual variable can be read as the value of one unit of the resource in its constraint.\n\nIf $x_1$ has the entries 2 and 4 in its column and the objective coefficient 5, its dual constraint is $2y_1 + 4y_2 \\ge 5$.\n\nCheck: the left side is what the resources in one unit of $x_1$ are worth at the prices $y$, and it must be at least the profit 5.\n\n> **Watch out.** Read down the column of the variable, not across a row; across a row mixes the coefficients of different variables.",
          "每个原变量给出一个对偶约束，由它的列纵向读出。第一个变量的列给出第一个对偶约束的系数，它的目标系数给出右端。因为矩阵被转置了，错误地横向读一行就会得到错误的约束。对偶变量可以理解为相应约束中一单位资源的价值。\n\n如果 $x_1$ 的列元素是 2 和 4，目标系数是 5，它的对偶约束就是 $2y_1 + 4y_2 \\ge 5$。\n\n检验：左边是一单位 $x_1$ 所用资源按价格 $y$ 计算的价值，它必须不小于利润 5。\n\n> **注意。** 要纵向读变量的列，而不是横向读一行；横向读会把不同变量的系数混在一起。",
        ],
        (rng) => {
          const c1 = rng.int(2, 12);
          const c2 = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter((v) => v !== c1));
          const a = rng.int(2, 6);
          const b = rng.pick([2, 3, 4, 5, 6].filter((v) => v !== a));
          const c = rng.pick([2, 3, 4, 5, 6, 7].filter((v) => v !== a && v !== b));
          const d = rng.int(2, 7);
          const [b1, b2] = [rng.int(10, 40), rng.int(10, 40)];
          return chosen(
            rng,
            [
              `Maximize $${c1}x_1 + ${c2}x_2$ subject to $${a}x_1 + ${b}x_2 \\le ${b1}$, $${c}x_1 + ${d}x_2 \\le ${b2}$, $x \\ge 0$. Which is the dual constraint from $x_1$?`,
              `在 $${a}x_1 + ${b}x_2 \\le ${b1}$，$${c}x_1 + ${d}x_2 \\le ${b2}$，$x \\ge 0$ 的条件下使 $${c1}x_1 + ${c2}x_2$ 最大。由 $x_1$ 得到的对偶约束是哪个？`,
            ],
            same(`${a}y_1 + ${c}y_2 \\ge ${c1}`),
            [
              [
                same(`${a}y_1 + ${b}y_2 \\ge ${c1}`),
                "That reads across the first row; the dual constraint reads down the column of $x_1$.",
                "这是横向读第一行；对偶约束要纵向读 $x_1$ 的列。",
              ],
              [
                same(`${a}y_1 + ${c}y_2 \\le ${c1}`),
                "A maximum has a dual with greater-than constraints.",
                "最大化问题的对偶约束是大于等于。",
              ],
              [
                same(`${a}y_1 + ${c}y_2 \\ge ${c2}`),
                `The right side ${c2} belongs to $x_2$; the constraint from $x_1$ uses its coefficient ${c1}.`,
                `右端 ${c2} 属于 $x_2$；由 $x_1$ 得到的约束用它自己的系数 ${c1}。`,
              ],
            ],
            [
              [
                ["Read down the column", "纵向读列"],
                [`The column of $x_1$ holds ${a} and ${c}.`, `$x_1$ 的列是 ${a} 和 ${c}。`],
              ],
              [
                ["Set the direction and the right side", "确定方向和右端"],
                [
                  `Its objective coefficient ${c1} is the right side, with $\\ge$ because the primal is a maximum.`,
                  `它的目标系数 ${c1} 是右端；因为原问题是最大化，取 $\\ge$。`,
                ],
              ],
            ],
            [
              `The left side $${a}y_1 + ${c}y_2$ is what the resources in one unit of $x_1$ are worth, which must be at least its profit ${c1}.`,
              `左边 $${a}y_1 + ${c}y_2$ 是一单位 $x_1$ 所用资源的价值，它必须不小于利润 ${c1}。`,
            ],
          );
        },
      ),
    ],
  ),
  [
    "Maximize $3x_1 + 2x_2$ subject to $x_1 + x_2 \\le 4$, $x_1 + 3x_2 \\le 6$, $x \\ge 0$. Its dual minimizes $4y_1 + 6y_2$ subject to $y_1 + y_2 \\ge 3$, $y_1 + 3y_2 \\ge 2$, $y \\ge 0$: the right sides and the costs trade places, and each column becomes a row.",
    "在 $x_1 + x_2 \\le 4$，$x_1 + 3x_2 \\le 6$，$x \\ge 0$ 的条件下使 $3x_1 + 2x_2$ 最大。它的对偶是在 $y_1 + y_2 \\ge 3$，$y_1 + 3y_2 \\ge 2$，$y \\ge 0$ 的条件下使 $4y_1 + 6y_2$ 最小：右端和系数互换位置，每一列变成一行。",
  ],
  [
    "$y = (3, 0)$ satisfies both dual constraints and gives $12$, and $x = (4, 0)$ gives $3(4) = 12$ too, so both are optimal.",
    "$y = (3, 0)$ 满足两个对偶约束，给出 $12$；$x = (4, 0)$ 也给出 $3(4) = 12$，所以两者都是最优的。",
  ],
  ["write the objective and the constraints of the dual of a maximization program.", "写出最大化规划的对偶的目标和约束。"],
);

const weakDuality = lesson(
  topic(
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
          "Weak duality says that any feasible dual value is at least as large as any feasible primal value, when the primal is a maximum. The proof takes one line: multiply the constraints by the nonnegative dual variables and add them. So every dual feasible point certifies an upper bound on the maximum, without any need to solve the primal program, and this is often valuable in practice.\n\nMaximize $3x_1 + 2x_2$ subject to $x_1 + x_2 \\le 5$, $2x_1 + x_2 \\le 8$. The point $y = (1, 1)$ is dual feasible, since $1 + 2 = 3 \\ge 3$ and $1 + 1 = 2 \\ge 2$, and it gives the bound $5 + 8 = 13$.\n\nCheck: the primal point $(3, 2)$ is feasible and gives $9 + 4 = 13$, so here the bound is reached.\n\n> **Watch out.** The bound uses the right sides times the dual values. Check dual feasibility first, or the number bounds nothing.",
          "弱对偶是说，当原问题是最大化时，任何可行的对偶值都不小于任何可行的原问题值。证明只有一行：把约束乘以非负的对偶变量再相加。所以每个对偶可行点都给出最大值的一个上界，完全不用求解原问题，这在实践中常常很有价值。\n\n在 $x_1 + x_2 \\le 5$，$2x_1 + x_2 \\le 8$ 的条件下使 $3x_1 + 2x_2$ 最大。点 $y = (1, 1)$ 对偶可行，因为 $1 + 2 = 3 \\ge 3$，$1 + 1 = 2 \\ge 2$，它给出上界 $5 + 8 = 13$。\n\n检验：原问题的点 $(3, 2)$ 可行，给出 $9 + 4 = 13$，所以这里上界被取到。\n\n> **注意。** 上界是右端乘以对偶值。要先检验对偶可行性，否则这个数什么也界定不了。",
        ],
        (rng) => {
          const y1 = rng.int(1, 5);
          const y2 = rng.int(1, 5);
          const c1 = y1 + 2 * y2 - rng.int(0, 1);
          const c2 = y1 + y2 - rng.int(0, 1);
          const A = rng.int(8, 30);
          const B = rng.int(10, 40);
          const answer = A * y1 + B * y2;
          const times = (y: number) => (y === 1 ? "" : `${y}`);
          return solved(
            [
              `Maximize $${term(c1, "x_1")} + ${term(c2, "x_2")}$ subject to $x_1 + x_2 \\le ${A}$, $2x_1 + x_2 \\le ${B}$, $x \\ge 0$. What upper bound does the dual point $y = (${y1}, ${y2})$ give?`,
              `在 $x_1 + x_2 \\le ${A}$，$2x_1 + x_2 \\le ${B}$，$x \\ge 0$ 的条件下使 $${term(c1, "x_1")} + ${term(c2, "x_2")}$ 最大。对偶点 $y = (${y1}, ${y2})$ 给出的上界是多少？`,
            ],
            answer,
            [
              [
                A * y2 + B * y1,
                `That pairs the dual values with the wrong right sides: $y_1 = ${y1}$ goes with ${A}, the right side of the first constraint.`,
                `这把对偶值和右端配错了：$y_1 = ${y1}$ 应配第一个约束的右端 ${A}。`,
              ],
              [A + B, "That adds the right sides without weighting them by the dual values.", "这把右端直接相加，没有乘以对偶值。"],
              [
                c1 * y1 + c2 * y2,
                "That multiplies the objective coefficients by the dual values; the dual objective uses the right sides.",
                "这是目标系数乘以对偶值；对偶目标用的是右端。",
              ],
            ],
            [
              [
                ["Check dual feasibility", "检验对偶可行性"],
                [
                  `The column of $x_1$ gives $${y1} + 2(${y2}) = ${y1 + 2 * y2} \\ge ${c1}$, and the column of $x_2$ gives $${y1} + ${y2} = ${y1 + y2} \\ge ${c2}$.`,
                  `$x_1$ 的列给出 $${y1} + 2(${y2}) = ${y1 + 2 * y2} \\ge ${c1}$，$x_2$ 的列给出 $${y1} + ${y2} = ${y1 + y2} \\ge ${c2}$。`,
                ],
              ],
              [
                ["Evaluate the dual objective", "计算对偶目标"],
                [`$${A}(${y1}) + ${B}(${y2}) = ${answer}$.`, `$${A}(${y1}) + ${B}(${y2}) = ${answer}$。`],
              ],
            ],
            [
              `For any feasible $x$, $${term(c1, "x_1")} + ${term(c2, "x_2")} \\le ${times(y1)}(x_1 + x_2) + ${times(y2)}(2x_1 + x_2) \\le ${answer}$.`,
              `对任何可行的 $x$，$${term(c1, "x_1")} + ${term(c2, "x_2")} \\le ${times(y1)}(x_1 + x_2) + ${times(y2)}(2x_1 + x_2) \\le ${answer}$。`,
            ],
          );
        },
      ),
      point(
        "the-gap-between-two-points",
        ["The gap between two points", "两点之间的间隙"],
        [
          "A feasible primal point gives a lower bound on the maximum, and a feasible dual point gives an upper bound, so the optimum lies between them. The difference between the two values is the duality gap of that pair of points. It measures how far either point could be from optimal, so an algorithm can stop as soon as the gap is small, and a gap of zero proves both optimal.\n\nIf a feasible primal point gives 14 and a feasible dual point gives 17, the gap is $17 - 14 = 3$, and the maximum lies between 14 and 17.\n\nCheck: $14 + 3 = 17$.\n\n> **Watch out.** The gap is the difference of the two values, dual minus primal, not either value on its own.",
          "可行的原问题点给出最大值的下界，可行的对偶点给出上界，所以最优值在它们之间。这两个值的差就是这对点的对偶间隙。它度量任一点离最优有多远，所以算法在间隙足够小时就可以停止，而间隙为零证明两个点都是最优的。\n\n如果一个可行的原问题点给出 14，一个可行的对偶点给出 17，间隙就是 $17 - 14 = 3$，最大值在 14 和 17 之间。\n\n检验：$14 + 3 = 17$。\n\n> **注意。** 间隙是两个值的差，即对偶值减原问题值，而不是其中某一个值。",
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
          return solved(
            [
              `For a program maximizing $${c1}x_1 + ${c2}x_2$, the feasible point $x = (${x1}, ${x2})$ is known. The right sides are ${b1} and ${b2}, and $y = (${y1}, ${y2})$ is dual feasible. What is the gap between the two values?`,
              `对于使 $${c1}x_1 + ${c2}x_2$ 最大的规划，已知可行点 $x = (${x1}, ${x2})$。右端是 ${b1} 和 ${b2}，$y = (${y1}, ${y2})$ 对偶可行。两个值的间隙是多少？`,
            ],
            answer,
            [
              [dual, `That is the dual value alone; subtract the primal value ${primal}.`, `这只是对偶值；还要减去原问题的值 ${primal}。`],
              [
                primal,
                `That is the primal value alone; the gap is the dual value ${dual} minus it.`,
                `这只是原问题的值；间隙是对偶值 ${dual} 减去它。`,
              ],
              [dual + primal, "That adds the two values instead of subtracting them.", "这把两个值相加，而不是相减。"],
            ],
            [
              [
                ["Evaluate both points", "计算两个点的值"],
                [
                  `The primal value is $${c1}(${x1}) + ${c2}(${x2}) = ${primal}$, and the dual value is $${b1}(${y1}) + ${b2}(${y2}) = ${dual}$.`,
                  `原问题的值是 $${c1}(${x1}) + ${c2}(${x2}) = ${primal}$，对偶的值是 $${b1}(${y1}) + ${b2}(${y2}) = ${dual}$。`,
                ],
              ],
              [
                ["Subtract", "相减"],
                [`The gap is $${dual} - ${primal} = ${answer}$.`, `间隙是 $${dual} - ${primal} = ${answer}$。`],
              ],
            ],
            [
              `$${primal} + ${answer} = ${dual}$, so the maximum lies in a window of width ${answer}.`,
              `$${primal} + ${answer} = ${dual}$，所以最大值落在宽度为 ${answer} 的范围内。`,
            ],
          );
        },
      ),
    ],
  ),
  [
    "Maximize $x_1 + x_2$ subject to $x_1 + 2x_2 \\le 6$, $2x_1 + x_2 \\le 6$, $x \\ge 0$. The dual point $y = (1, 1)$ is feasible, since each column sums to $3 \\ge 1$, so the maximum is at most $6 + 6 = 12$.",
    "在 $x_1 + 2x_2 \\le 6$，$2x_1 + x_2 \\le 6$，$x \\ge 0$ 的条件下使 $x_1 + x_2$ 最大。对偶点 $y = (1, 1)$ 可行，因为每一列之和是 $3 \\ge 1$，所以最大值至多是 $6 + 6 = 12$。",
  ],
  ["the feasible point $(2, 2)$ gives $4$, which is indeed at most $12$.", "可行点 $(2, 2)$ 给出 $4$，确实不超过 $12$。"],
  [
    "bound a maximum by a dual feasible point, and measure the gap between a primal and a dual point.",
    "用对偶可行点给出最大值的上界，并度量原问题点和对偶点之间的间隙。",
  ],
);

const strongDuality = lesson(
  topic(
    "strong-duality-and-complementary-slackness",
    ["Strong Duality and Complementary Slackness", "强对偶和互补松弛"],
    [
      "Use equal optimal values, and deduce dual values from which constraints are tight.",
      "利用最优值相等，并由哪些约束是紧的推出对偶值。",
    ],
    ["weak-duality"],
    [["weak-duality", 0.5]],
    [
      point(
        "using-equal-optimal-values",
        ["Using equal optimal values", "利用最优值相等"],
        [
          "Strong duality says that when a program has an optimum, its dual has one too, and the two optimal values are equal. No gap remains. This is deep, as the simplex method's last tableau actually displays the optimal dual solution in its objective row. Knowing the optimal value and all but one dual variable, the remaining variable follows from a single linear equation.\n\nWith right sides 6 and 5, optimal value 28 and $y_1 = 3$, strong duality gives $18 + 5y_2 = 28$, so $y_2 = 2$.\n\nCheck: $6(3) + 5(2) = 28$.\n\n> **Watch out.** Subtract the known part, the right side times $y_1$, before dividing by the right side that multiplies $y_2$.",
          "强对偶是说，规划有最优解时，它的对偶也有，而且两个最优值相等，没有间隙。这是深刻的结论，单纯形法的最后一张表其实就在目标行中显示了最优的对偶解。知道最优值和除一个以外的所有对偶变量后，剩下的变量由一个线性方程就能求出。\n\n右端是 6 和 5，最优值是 28，$y_1 = 3$，强对偶给出 $18 + 5y_2 = 28$，所以 $y_2 = 2$。\n\n检验：$6(3) + 5(2) = 28$。\n\n> **注意。** 先减去已知的部分，即右端乘 $y_1$，再除以乘 $y_2$ 的那个右端。",
        ],
        (rng) => {
          const [b1, b2] = [rng.int(5, 30), rng.int(2, 12)];
          const [y1, y2] = [rng.int(1, 9), rng.int(1, 9)];
          const z = b1 * y1 + b2 * y2;
          return solved(
            [
              `A program with right sides ${b1} and ${b2} has optimal value ${z}. Its optimal dual solution has $y_1 = ${y1}$. What is $y_2$?`,
              `一个规划的右端是 ${b1} 和 ${b2}，最优值是 ${z}。它的最优对偶解中 $y_1 = ${y1}$。$y_2$ 是多少？`,
            ],
            y2,
            [
              [y1, "That is $y_1$, not $y_2$.", "这是 $y_1$，不是 $y_2$。"],
              [
                Q.of(z, b2),
                `That divides all of ${z} by ${b2}, forgetting the ${b1 * y1} that $y_1$ contributes.`,
                `这把整个 ${z} 除以 ${b2}，忘了 $y_1$ 贡献的 ${b1 * y1}。`,
              ],
              [
                Q.of(z - b1, b2),
                `That subtracts ${b1} once, but $y_1 = ${y1}$ contributes $${b1}(${y1}) = ${b1 * y1}$.`,
                `这只减了一次 ${b1}，但 $y_1 = ${y1}$ 贡献的是 $${b1}(${y1}) = ${b1 * y1}$。`,
              ],
              [
                Q.of(z - b1 * y1, b1),
                `That divides by ${b1}, but $y_2$ is multiplied by the second right side, ${b2}.`,
                `这是除以 ${b1}，但乘 $y_2$ 的是第二个右端 ${b2}。`,
              ],
            ],
            [
              [
                ["Set the values equal", "令两个值相等"],
                [`Strong duality gives $${b1}(${y1}) + ${b2}y_2 = ${z}$.`, `强对偶给出 $${b1}(${y1}) + ${b2}y_2 = ${z}$。`],
              ],
              [
                ["Solve", "求解"],
                [
                  `So $${b2}y_2 = ${z} - ${b1 * y1} = ${b2 * y2}$, and $y_2 = ${y2}$.`,
                  `所以 $${b2}y_2 = ${z} - ${b1 * y1} = ${b2 * y2}$，$y_2 = ${y2}$。`,
                ],
              ],
            ],
            [
              `$${b1}(${y1}) + ${b2}(${y2}) = ${b1 * y1} + ${b2 * y2} = ${z}$.`,
              `$${b1}(${y1}) + ${b2}(${y2}) = ${b1 * y1} + ${b2 * y2} = ${z}$。`,
            ],
          );
        },
      ),
      point(
        "complementary-slackness",
        ["Complementary slackness", "互补松弛"],
        [
          "Complementary slackness links the two optimal solutions. If a primal constraint has slack, its dual variable is zero: a resource left over has no value at the margin. And if a primal variable is positive, its dual constraint is tight. These conditions turn a claimed optimum into a small system of equations for the dual values, which then either confirms the claim or refutes it.\n\nMaximize $6x_1 + x_2$ subject to $x_1 + x_2 \\le 5$, $2x_1 + x_2 \\le 6$, with optimum $(3, 0)$. The first constraint has slack, as $3 < 5$, so $y_1 = 0$. As $x_1 > 0$, its dual constraint $y_1 + 2y_2 \\ge 6$ is tight, so $y_2 = 3$.\n\nCheck: the dual value $6(3) = 18$ equals the primal value $6(3) = 18$.\n\n> **Watch out.** A tight dual constraint comes from a positive primal variable. A variable at zero says nothing about its own dual constraint.",
          "互补松弛把两个最优解联系起来。如果原问题的约束有松弛，它的对偶变量就是零：有剩余的资源在边际上没有价值。如果原变量是正的，它的对偶约束就是紧的。这些条件把声称的最优解变成关于对偶值的小方程组，它要么证实这个说法，要么否定它。\n\n在 $x_1 + x_2 \\le 5$，$2x_1 + x_2 \\le 6$ 的条件下使 $6x_1 + x_2$ 最大，最优解是 $(3, 0)$。第一个约束有松弛，因为 $3 < 5$，所以 $y_1 = 0$。因为 $x_1 > 0$，它的对偶约束 $y_1 + 2y_2 \\ge 6$ 是紧的，所以 $y_2 = 3$。\n\n检验：对偶值 $6(3) = 18$ 等于原问题的值 $6(3) = 18$。\n\n> **注意。** 紧的对偶约束来自取正值的原变量。取零的变量对它自己的对偶约束什么也说明不了。",
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
          return solved(
            [
              `Maximize $${c1}x_1 + ${term(c2, "x_2")}$ subject to $x_1 + x_2 \\le ${A}$, $${a}x_1 + ${term(b, "x_2")} \\le ${B}$, $x \\ge 0$. The optimum is $x = (${x0}, 0)$. What is the optimal $y_2$?`,
              `在 $x_1 + x_2 \\le ${A}$，$${a}x_1 + ${term(b, "x_2")} \\le ${B}$，$x \\ge 0$ 的条件下使 $${c1}x_1 + ${term(c2, "x_2")}$ 最大。最优解是 $x = (${x0}, 0)$。最优的 $y_2$ 是多少？`,
            ],
            k,
            [
              [
                c1,
                `That is the right side of the tight dual constraint, before dividing by ${a}.`,
                `这是紧的对偶约束的右端，还没有除以 ${a}。`,
              ],
              [
                0,
                `That treats the second constraint as slack, but $${a}(${x0}) = ${B}$ makes it tight.`,
                `这把第二个约束当成有松弛，但 $${a}(${x0}) = ${B}$ 说明它是紧的。`,
              ],
              [x0, "That is the value of $x_1$, not a dual value.", "这是 $x_1$ 的值，不是对偶值。"],
              [
                Q.of(c2, b),
                "That makes the dual constraint of $x_2$ tight, but $x_2 = 0$, so that constraint need not be tight.",
                "这让 $x_2$ 的对偶约束取等号，但 $x_2 = 0$，那个约束不必是紧的。",
              ],
            ],
            [
              [
                ["Find the slack constraint", "找有松弛的约束"],
                [
                  `At $x = (${x0}, 0)$, $x_1 + x_2 = ${x0} < ${A}$, so the first constraint has slack and $y_1 = 0$.`,
                  `在 $x = (${x0}, 0)$ 处，$x_1 + x_2 = ${x0} < ${A}$，所以第一个约束有松弛，$y_1 = 0$。`,
                ],
              ],
              [
                ["Use the tight dual constraint", "利用紧的对偶约束"],
                [
                  `As $x_1 > 0$, its dual constraint $y_1 + ${a}y_2 \\ge ${c1}$ is tight, so $${a}y_2 = ${c1}$ and $y_2 = ${k}$.`,
                  `因为 $x_1 > 0$，它的对偶约束 $y_1 + ${a}y_2 \\ge ${c1}$ 是紧的，所以 $${a}y_2 = ${c1}$，$y_2 = ${k}$。`,
                ],
              ],
            ],
            [
              `The dual value $${B}(${k}) = ${B * k}$ equals the primal value $${c1}(${x0}) = ${c1 * x0}$.`,
              `对偶值 $${B}(${k}) = ${B * k}$ 等于原问题的值 $${c1}(${x0}) = ${c1 * x0}$。`,
            ],
          );
        },
      ),
    ],
  ),
  [
    "A program with right sides 10 and 4 has optimal value 26, and its optimal dual solution has $y_1 = 2$. Strong duality makes the dual value 26 too, so $10(2) + 4y_2 = 26$, which gives $y_2 = \\frac{3}{2}$.",
    "一个规划的右端是 10 和 4，最优值是 26，它的最优对偶解中 $y_1 = 2$。强对偶使对偶值也是 26，所以 $10(2) + 4y_2 = 26$，得 $y_2 = \\frac{3}{2}$。",
  ],
  ["$20 + 4 \\times \\frac{3}{2} = 20 + 6 = 26$.", "$20 + 4 \\times \\frac{3}{2} = 20 + 6 = 26$。"],
  [
    "use equal optimal values to find a missing dual value, and deduce dual values from which constraints are tight.",
    "利用最优值相等求出缺少的对偶值，并由哪些约束是紧的推出对偶值。",
  ],
);

const sensitivity = lesson(
  topic(
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
          "An optimal dual variable is called a shadow price: it is the rate at which the optimal value changes as that constraint's right side grows. So buying more of a resource is worthwhile only below its shadow price. The rate holds for as long as the same basis stays optimal, and beyond that range it changes, so the prediction is safe only for small changes in the right side.\n\nA maximum of 80 with shadow price 3 on a constraint rises by $3 \\times 5 = 15$, to 95, when that right side rises by 5.\n\nCheck: $\\frac{95 - 80}{5} = 3$, the shadow price.\n\n> **Watch out.** Multiply the shadow price by the change in the right side; the change alone, or the price alone, is not the change in the maximum.",
          "最优的对偶变量称为影子价格：它是约束右端增大时最优值变化的速率。所以只有价格低于影子价格时，多买这种资源才划算。只要同一个基保持最优，这个速率就成立；超出范围就会改变，所以这个预测只对右端的小变化才可靠。\n\n最大值 80 在某个约束上的影子价格是 3，右端增加 5 时，最大值增加 $3 \\times 5 = 15$，变为 95。\n\n检验：$\\frac{95 - 80}{5} = 3$，正是影子价格。\n\n> **注意。** 要用影子价格乘以右端的变化量；只看变化量或只看价格，都不是最大值的变化。",
        ],
        (rng) => {
          const z = rng.int(40, 200);
          const y = rng.int(2, 9);
          const d = rng.int(2, 9);
          const lower = rng.bool();
          const answer = lower ? z - y * d : z + y * d;
          const [move, moveZh] = lower ? ["falls", "减少"] : ["rises", "增加"];
          return solved(
            [
              `A maximum of ${z} has shadow price ${y} on a constraint. If the right side ${lower ? "falls" : "rises"} by ${d}, and the basis stays optimal, what is the new maximum?`,
              `最大值 ${z} 在某个约束上的影子价格是 ${y}。如果右端${lower ? "减少" : "增加"} ${d}，而基保持最优，新的最大值是多少？`,
            ],
            answer,
            [
              [
                lower ? z + y * d : z - y * d,
                `That moves the wrong way: when the right side ${move}, a positive shadow price makes the maximum ${move === "falls" ? "fall" : "rise"} too.`,
                `方向反了：右端${moveZh}时，正的影子价格使最大值也${moveZh}。`,
              ],
              [
                lower ? z - d : z + d,
                `That changes the maximum by ${d}, without multiplying by the shadow price ${y}.`,
                `这让最大值变化 ${d}，没有乘以影子价格 ${y}。`,
              ],
              [
                z * y,
                "That multiplies the maximum by the shadow price; the price multiplies the change.",
                "这是最大值乘以影子价格；影子价格应乘以变化量。",
              ],
              [
                lower ? z - y : z + y,
                `That changes the maximum by the shadow price once, for one unit instead of ${d}.`,
                `这只按一个单位变化了一次影子价格，而不是 ${d} 个单位。`,
              ],
            ],
            [
              [
                ["Find the change", "求变化量"],
                [`The maximum changes by $${y} \\times ${d} = ${y * d}$.`, `最大值变化 $${y} \\times ${d} = ${y * d}$。`],
              ],
              [
                ["Apply it", "代入"],
                [
                  `The right side ${move}, so the maximum becomes $${z} ${lower ? "-" : "+"} ${y * d} = ${answer}$.`,
                  `右端${moveZh}，所以最大值变为 $${z} ${lower ? "-" : "+"} ${y * d} = ${answer}$。`,
                ],
              ],
            ],
            [
              `The maximum moved by ${y * d}, and $\\frac{${y * d}}{${d}} = ${y}$ gives back the shadow price.`,
              `最大值变化了 ${y * d}，而 $\\frac{${y * d}}{${d}} = ${y}$ 又得到影子价格。`,
            ],
          );
        },
      ),
      point(
        "pricing-out-a-new-activity",
        ["Pricing out a new activity", "为新活动定价"],
        [
          "Shadow prices also value a new activity. Its resources would cost the amounts used times the shadow prices, and it is worth doing only if its profit is more than that. The difference is called the reduced cost. So a product can be assessed without resolving the whole program, and the shortfall says exactly how much its price must rise before it enters the optimal plan.\n\nWith shadow prices 2 and 3, a product using 4 and 1 units has resources worth $4(2) + 1(3) = 11$. If it earns 8, its profit must rise by $11 - 8 = 3$.\n\nCheck: at a profit of $8 + 3 = 11$, it exactly pays for its resources.\n\n> **Watch out.** Value each resource at its own shadow price: the units of the first resource go with the first price.",
          "影子价格也能评估新活动。它用的资源的成本是用量乘影子价格，只有利润超过这个成本才值得做。这个差称为检验数。所以不用重新求解整个规划就能评估一个产品，而差额恰好说明它的价格必须上涨多少才能进入最优计划。\n\n影子价格是 2 和 3，一种产品用 4 和 1 单位，它的资源价值 $4(2) + 1(3) = 11$。如果它赚 8，利润要增加 $11 - 8 = 3$。\n\n检验：利润为 $8 + 3 = 11$ 时，它恰好抵得上所用资源的价值。\n\n> **注意。** 每种资源按它自己的影子价格计价：第一种资源的用量配第一个价格。",
        ],
        (rng) => {
          const [y1, y2] = [rng.int(1, 6), rng.int(1, 6)];
          const [a1, a2] = [rng.int(1, 5), rng.int(1, 5)];
          const worth = a1 * y1 + a2 * y2;
          const gap = rng.int(1, worth - 1 > 8 ? 8 : Math.max(1, worth - 1));
          const price = Math.max(1, worth - gap);
          const answer = worth - price;
          return solved(
            [
              `Two resources have shadow prices ${y1} and ${y2}. A new product uses ${a1} and ${a2} units of them, and earns ${price} per unit. By how much must its profit rise before it is worth making?`,
              `两种资源的影子价格是 ${y1} 和 ${y2}。一种新产品每单位用它们 ${a1} 和 ${a2} 单位，利润是 ${price}。它的利润要增加多少才值得生产？`,
            ],
            answer,
            [
              [
                worth,
                `That is the worth of its resources; subtract the profit ${price} it already earns.`,
                `这是它所用资源的价值；还要减去它已有的利润 ${price}。`,
              ],
              [price, "That is its current profit, not the shortfall.", "这是它现在的利润，不是差额。"],
              [worth + price, "That adds the profit to the worth instead of subtracting it.", "这把利润加到资源价值上，而不是相减。"],
              [
                Math.abs(a1 * y2 + a2 * y1 - price),
                "That pairs each resource with the other's shadow price.",
                "这把每种资源配上了另一种资源的影子价格。",
              ],
            ],
            [
              [
                ["Value the resources", "给资源计价"],
                [
                  `Its resources are worth $${a1}(${y1}) + ${a2}(${y2}) = ${worth}$.`,
                  `它所用资源的价值是 $${a1}(${y1}) + ${a2}(${y2}) = ${worth}$。`,
                ],
              ],
              [
                ["Compare with the profit", "与利润比较"],
                [`The shortfall is $${worth} - ${price} = ${answer}$.`, `差额是 $${worth} - ${price} = ${answer}$。`],
              ],
            ],
            [
              `At a profit of $${price} + ${answer} = ${worth}$, the product exactly pays for its resources.`,
              `利润为 $${price} + ${answer} = ${worth}$ 时，这种产品恰好抵得上所用资源的价值。`,
            ],
          );
        },
      ),
    ],
  ),
  [
    "A factory's maximum profit is 100, and the shadow price of its machine hours is 4. Ten more hours, as long as the same basis stays optimal, raise the maximum by $4 \\times 10 = 40$, to $140$.",
    "一家工厂的最大利润是 100，机器工时的影子价格是 4。只要同一个基保持最优，再增加 10 小时，最大值就增加 $4 \\times 10 = 40$，变为 $140$。",
  ],
  ["$\\frac{140 - 100}{10} = 4$, the shadow price.", "$\\frac{140 - 100}{10} = 4$，正是影子价格。"],
  [
    "predict a new optimum from a shadow price, and price out a new activity from the resources it uses.",
    "由影子价格预测新的最优值，并由新活动所用的资源为它定价。",
  ],
);

const transportation = lesson(
  topic(
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
          "A transportation problem ships goods from sources with fixed supplies to destinations with fixed demands, at the least total cost. The standard method assumes that total supply equals total demand. When supply exceeds demand, a dummy destination is added with demand equal to the excess and zero cost, and shipments to it simply mean goods that stay behind. A shortage gets a dummy source in the same way.\n\nWith supplies 40 and 35 and demands 30 and 25, supply totals 75 and demand totals 55, so a dummy store with demand $75 - 55 = 20$ balances the problem.\n\nCheck: $30 + 25 + 20 = 75$, the total supply.\n\n> **Watch out.** The dummy takes only the excess, total supply minus total demand, not a whole supply.",
          "运输问题把货物从供应量固定的产地运到需求量固定的销地，使总成本最小。标准方法假设总供应等于总需求。供应超过需求时，加一个虚拟销地，需求等于多余的量，成本为零，运到那里就表示货物留在原地。短缺时用同样的方法加一个虚拟产地。\n\n供应量是 40 和 35，需求量是 30 和 25，总供应是 75，总需求是 55，所以需求为 $75 - 55 = 20$ 的虚拟商店能平衡问题。\n\n检验：$30 + 25 + 20 = 75$，正是总供应。\n\n> **注意。** 虚拟点只接收多余的量，即总供应减总需求，而不是整个供应量。",
        ],
        (rng) => {
          const s = [rng.int(30, 60), rng.int(30, 60), rng.int(30, 60)];
          const d = [rng.int(10, 40), rng.int(10, 40)];
          const answer = (s[0] as number) + (s[1] as number) + (s[2] as number) - (d[0] as number) - (d[1] as number);
          const supply = answer + (d[0] as number) + (d[1] as number);
          const demand = (d[0] as number) + (d[1] as number);
          return solved(
            [
              `Three factories supply ${listed(s)} units, and two stores demand ${listed(d)} units. What demand must a dummy store have to balance the problem?`,
              `三家工厂分别供应 ${listed(s)} 单位，两家商店分别需要 ${listed(d)} 单位。要平衡这个问题，虚拟商店的需求必须是多少？`,
            ],
            answer,
            [
              [
                supply,
                "That is the total supply; the dummy takes only the excess over demand.",
                "这是总供应；虚拟商店只接收超过需求的部分。",
              ],
              [demand, "That is the total demand, not the excess of supply over it.", "这是总需求，不是供应超出它的部分。"],
              [
                supply - (d[0] as number),
                `That subtracts only the first store's demand, leaving out the ${d[1] as number} of the second.`,
                `这只减去了第一家商店的需求，漏掉了第二家的 ${d[1] as number}。`,
              ],
            ],
            [
              [
                ["Add up both sides", "两边分别求和"],
                [
                  `Supply totals $${s.join(" + ")} = ${supply}$, and demand totals $${d.join(" + ")} = ${demand}$.`,
                  `总供应是 $${s.join(" + ")} = ${supply}$，总需求是 $${d.join(" + ")} = ${demand}$。`,
                ],
              ],
              [
                ["Take the excess", "取多余的量"],
                [`The dummy store takes $${supply} - ${demand} = ${answer}$.`, `虚拟商店接收 $${supply} - ${demand} = ${answer}$。`],
              ],
            ],
            [
              `With the dummy, demand totals $${demand} + ${answer} = ${supply}$, equal to the supply.`,
              `加上虚拟商店后，总需求是 $${demand} + ${answer} = ${supply}$，等于总供应。`,
            ],
          );
        },
      ),
      point(
        "the-northwest-corner-rule",
        ["The northwest corner rule", "西北角法则"],
        [
          "The northwest corner rule builds a feasible starting plan while ignoring costs. Begin at the top left cell and ship as much as supply and demand allow, which finishes either the row or the column. Move right if the column is finished, or down if the row is finished, and repeat until all goods are placed. The plan is rarely cheap, but improvement steps start from it.\n\nWith supplies 10 and 15 and demands 6, 12 and 7, ship 6 in the top left cell, then the remaining 4 of the first supply to the second store. The second row ships the other 8 to the second store and 7 to the third.\n\nCheck: the rows total $6 + 4 = 10$ and $8 + 7 = 15$, and the second column totals $4 + 8 = 12$.\n\n> **Watch out.** After a row runs out, the next row must finish the demand that is still open; it does not start again from that store's full demand.",
          "西北角法则不考虑成本，建立一个可行的初始方案。从左上角的格子开始，尽量多运，这样会用完一行或一列。如果用完了列就向右移，如果用完了行就向下移，重复直到所有货物都分配完。这个方案很少是便宜的，但改进步骤从它开始。\n\n供应量是 10 和 15，需求量是 6，12 和 7，左上角运 6，再把第一个供应剩下的 4 运给第二家商店。第二行把另外 8 运给第二家商店，7 运给第三家。\n\n检验：两行合计 $6 + 4 = 10$ 和 $8 + 7 = 15$，第二列合计 $4 + 8 = 12$。\n\n> **注意。** 一行用完后，下一行要补足还没满足的需求，而不是从那家商店的全部需求重新开始。",
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
          return solved(
            [
              `Supplies are ${s1} and ${s2}, demands are ${d1}, ${d2}, ${d3}, and the unit costs are $${matrix(costs)}$. What is the total cost of the northwest corner plan?`,
              `供应量是 ${s1} 和 ${s2}，需求量是 ${d1}，${d2}，${d3}，单位成本是 $${matrix(costs)}$。西北角方案的总成本是多少？`,
            ],
            answer,
            [
              [
                d1 * costs[0][0] + d2 * costs[0][1] + d3 * costs[1][2],
                `That ships the whole second demand from the first factory, which has only ${first} left after the first store.`,
                `这把第二家商店的全部需求都由第一家工厂运出，但它满足第一家商店后只剩 ${first}。`,
              ],
              [
                s1 * costs[0][0] + s2 * costs[1][2],
                "That sends each whole supply to a single store, ignoring the demands.",
                "这把每个供应量整个运到一家商店，不顾需求。",
              ],
              [
                d1 * costs[0][0] + first * costs[0][1] + second * costs[1][1],
                `That leaves out the last shipment, ${d3} units to the third store.`,
                `这漏掉了最后一笔运输，即运给第三家商店的 ${d3} 单位。`,
              ],
            ],
            [
              [
                ["Fill the first row", "填第一行"],
                [
                  `Ship ${d1} to the first store, then the remaining $${s1} - ${d1} = ${first}$ to the second.`,
                  `运 ${d1} 给第一家商店，再把剩下的 $${s1} - ${d1} = ${first}$ 运给第二家。`,
                ],
              ],
              [
                ["Fill the second row", "填第二行"],
                [
                  `The second store still needs $${d2} - ${first} = ${second}$, and then the third takes ${d3}.`,
                  `第二家商店还需要 $${d2} - ${first} = ${second}$，然后第三家接收 ${d3}。`,
                ],
              ],
              [
                ["Add the costs", "累加成本"],
                [
                  `$${d1}(${costs[0][0]}) + ${first}(${costs[0][1]}) + ${second}(${costs[1][1]}) + ${d3}(${costs[1][2]}) = ${answer}$.`,
                  `$${d1}(${costs[0][0]}) + ${first}(${costs[0][1]}) + ${second}(${costs[1][1]}) + ${d3}(${costs[1][2]}) = ${answer}$。`,
                ],
              ],
            ],
            [
              `The rows total $${d1} + ${first} = ${s1}$ and $${second} + ${d3} = ${s2}$, and the second column totals $${first} + ${second} = ${d2}$.`,
              `两行合计 $${d1} + ${first} = ${s1}$ 和 $${second} + ${d3} = ${s2}$，第二列合计 $${first} + ${second} = ${d2}$。`,
            ],
          );
        },
      ),
    ],
  ),
  [
    "Two warehouses hold 30 and 50 units, and three shops need 20, 25 and 25. Supply totals 80 but demand totals 70, so a dummy shop with demand 10 and zero cost balances the problem, and the units sent there simply stay behind.",
    "两个仓库存有 30 和 50 单位，三家商店需要 20，25 和 25 单位。总供应是 80，总需求是 70，所以加一个需求为 10、成本为零的虚拟商店来平衡问题，运到那里的货物就是留在原地的货物。",
  ],
  ["$20 + 25 + 25 + 10 = 80 = 30 + 50$.", "$20 + 25 + 25 + 10 = 80 = 30 + 50$。"],
  [
    "balance a transportation problem with a dummy, and build a starting plan with the northwest corner rule.",
    "用虚拟点平衡运输问题，并用西北角法则建立初始方案。",
  ],
);

const improvingTransport = lesson(
  topic(
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
          "A balanced transportation problem with $m$ sources and $n$ destinations has $m + n - 1$ independent constraints, because one of the row and column totals follows from all the others. So a basic plan uses that many cells, and the northwest corner rule produces exactly that number. A plan using fewer is degenerate, and a zero shipment is written in an extra cell to keep the count correct.\n\nWith 3 sources and 4 destinations, a basic plan uses $3 + 4 - 1 = 6$ cells out of the 12.\n\nCheck: the northwest corner rule finishes a row or a column at each step and both at its last step, so it fills $7 - 1 = 6$ cells.\n\n> **Watch out.** Subtract exactly one: only one of the $m + n$ totals is redundant.",
          "$m$ 个产地、$n$ 个销地的平衡运输问题有 $m + n - 1$ 个独立约束，因为行列总和中有一个可由其他的推出。所以基本方案使用这么多个格子，西北角法则恰好产生这个数目。使用更少格子的方案是退化的，要在一个额外的格子里写上零运量，使数目保持正确。\n\n3 个产地、4 个销地时，基本方案在 12 个格子中使用 $3 + 4 - 1 = 6$ 个。\n\n检验：西北角法则每一步用完一行或一列，最后一步同时用完两者，所以它填 $7 - 1 = 6$ 个格子。\n\n> **注意。** 只减一：$m + n$ 个总和中只有一个是多余的。",
        ],
        (rng) => {
          const m = rng.int(2, 9);
          const n = rng.int(2, 9);
          const answer = m + n - 1;
          return solved(
            [
              `A balanced transportation problem has ${m} sources and ${n} destinations. How many cells does a basic plan use?`,
              `一个平衡运输问题有 ${m} 个产地和 ${n} 个销地。基本方案使用多少个格子？`,
            ],
            answer,
            [
              [m + n, "That forgets that one of the row and column totals is redundant.", "这忘了行列总和中有一个是多余的。"],
              [
                m * n,
                "That counts every cell of the table, not the cells of a basic plan.",
                "这数的是表中所有的格子，不是基本方案用的格子。",
              ],
              [answer - 1, "That removes two constraints, but only one is redundant.", "这去掉了两个约束，但只有一个是多余的。"],
              [Math.max(m, n), "That counts only the longer side of the table.", "这只数了表格较长的一边。"],
            ],
            [
              [
                ["Count the constraints", "数约束"],
                [`There are $${m} + ${n} = ${m + n}$ row and column totals.`, `共有 $${m} + ${n} = ${m + n}$ 个行列总和。`],
              ],
              [
                ["Remove the redundant one", "去掉多余的一个"],
                [
                  `One follows from the others, so a basic plan uses $${m + n} - 1 = ${answer}$ cells.`,
                  `其中一个可由其他的推出，所以基本方案使用 $${m + n} - 1 = ${answer}$ 个格子。`,
                ],
              ],
            ],
            [
              `The northwest corner rule finishes a row or a column at each step and both at its last step, so it fills $${m + n} - 1 = ${answer}$ cells.`,
              `西北角法则每一步用完一行或一列，最后一步同时用完两者，所以它填 $${m + n} - 1 = ${answer}$ 个格子。`,
            ],
          );
        },
      ),
      point(
        "evaluating-an-empty-cell",
        ["Evaluating an empty cell", "评估空格"],
        [
          "To judge an empty cell, trace a closed loop from it through used cells, turning only at used cells, and alternately add and subtract one unit around the loop. Row and column totals stay balanced, so the change in total cost is the alternating sum of the unit costs. If this is negative, shipping along the loop saves money. A plan is optimal when no empty cell has a negative sum.\n\nWith costs $\\begin{pmatrix} 4 & 7 \\\\ 3 & 5 \\end{pmatrix}$ and the top right cell empty, the loop gives $7 - 5 + 3 - 4 = 1$, so moving a unit there costs 1 more.\n\nCheck: each row and each column of the loop gains one unit and loses one, so every total stays the same.\n\n> **Watch out.** The signs alternate around the loop, starting with a plus at the empty cell; they do not go by rows.",
          "判断空格时，从它出发经过已用的格子画一条闭回路，只在已用的格子转弯，沿回路交替加减一单位。行列总和保持平衡，所以总成本的变化是单位成本的交替和。如果它是负的，沿回路运输就能省钱。当没有空格的和为负时，方案就是最优的。\n\n成本是 $\\begin{pmatrix} 4 & 7 \\\\ 3 & 5 \\end{pmatrix}$，右上角为空，回路给出 $7 - 5 + 3 - 4 = 1$，所以把一单位移到那里要多花 1。\n\n检验：回路经过的每一行每一列都加一单位、减一单位，所以每个总和都不变。\n\n> **注意。** 符号沿回路交替，从空格处的加号开始；不是按行来定。",
        ],
        (rng) => {
          const costs = [
            [rng.int(1, 15), rng.int(1, 15)],
            [rng.int(1, 15), rng.int(1, 15)],
          ] as [[number, number], [number, number]];
          const answer = costs[0][1] - costs[1][1] + costs[1][0] - costs[0][0];
          const verdict: Pair =
            answer < 0
              ? ["The sum is negative, so the move saves money.", "和是负的，所以这样移动能省钱。"]
              : answer === 0
                ? ["The sum is zero, so the move costs nothing.", "和是零，所以这样移动不改变成本。"]
                : ["The sum is positive, so the move costs more.", "和是正的，所以这样移动会多花钱。"];
          return solved(
            [
              `The unit costs are $${matrix(costs)}$, and a plan uses every cell except the top right. By how much does the total cost change when one unit moves around the loop through the top right cell?`,
              `单位成本是 $${matrix(costs)}$，方案使用除右上角外的所有格子。一单位沿经过右上角的回路移动时，总成本变化多少？`,
            ],
            answer,
            [
              [
                costs[0][1] + costs[1][1] - costs[1][0] - costs[0][0],
                "That gives the signs by column rather than alternating them around the loop.",
                "这按列定符号，而不是沿回路交替。",
              ],
              [
                -answer,
                "That has the signs reversed: the empty cell gains a unit, so its cost is added.",
                "符号反了：空格增加一单位，所以它的成本要加上。",
              ],
              [
                costs[0][1],
                "That counts only the cost of the empty cell, not the rest of the loop.",
                "这只算了空格的成本，没有算回路的其他部分。",
              ],
            ],
            [
              [
                ["Trace the loop", "画出回路"],
                [
                  "Add a unit at the top right and the bottom left, and remove one at the bottom right and the top left.",
                  "在右上角和左下角各加一单位，在右下角和左上角各减一单位。",
                ],
              ],
              [
                ["Add the costs with signs", "带符号累加成本"],
                [
                  `$${costs[0][1]} - ${costs[1][1]} + ${costs[1][0]} - ${costs[0][0]} = ${answer}$. ${verdict[0]}`,
                  `$${costs[0][1]} - ${costs[1][1]} + ${costs[1][0]} - ${costs[0][0]} = ${answer}$。${verdict[1]}`,
                ],
              ],
            ],
            [
              "Each row and each column of the loop gains one unit and loses one, so every supply and demand still balances.",
              "回路经过的每一行每一列都加一单位、减一单位，所以每个供应量和需求量仍然平衡。",
            ],
          );
        },
      ),
    ],
  ),
  [
    "A plan with 2 sources and 3 destinations uses $2 + 3 - 1 = 4$ cells. For an empty cell, a loop through used cells with costs 5, 3, 2 and 6 gives $5 - 3 + 2 - 6 = -2$: each unit moved along the loop saves 2.",
    "2 个产地、3 个销地的方案使用 $2 + 3 - 1 = 4$ 个格子。对一个空格，经过成本为 5，3，2 和 6 的已用格子的回路给出 $5 - 3 + 2 - 6 = -2$：沿回路每移动一单位省 2。",
  ],
  [
    "the loop adds a unit at two cells and removes one at two, so every row and column total stays the same.",
    "回路在两个格子加一单位，在两个格子减一单位，所以每个行列总和都不变。",
  ],
  [
    "count the cells of a basic plan, and evaluate an empty cell by the alternating sum around its loop.",
    "数基本方案的格子，并用回路上的交替和评估空格。",
  ],
);

const assignment = lesson(
  topic(
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
          "An assignment problem matches each worker with one job at the least total cost. Subtracting a constant from a whole row or column changes every assignment's cost by the same amount, so the best assignment stays the best. The Hungarian method uses this to produce zeros: subtract each row's minimum from that row, then each column's minimum from that column. An assignment using only zeros is optimal.\n\nReducing $\\begin{pmatrix} 5 & 8 \\\\ 6 & 4 \\end{pmatrix}$ by the row minimums 5 and 4 gives $\\begin{pmatrix} 0 & 3 \\\\ 2 & 0 \\end{pmatrix}$, and every column already has a zero. The zeros on the diagonal give the assignment costing $5 + 4 = 9$.\n\nCheck: the other assignment costs $8 + 6 = 14$, more than 9.\n\n> **Watch out.** Take each column's minimum after the row step, not in the original matrix.",
          "指派问题把每个工人匹配到一项工作，使总成本最小。从一整行或一整列减去一个常数，会使每种指派的成本变化相同的量，所以最好的指派仍然最好。匈牙利法用这一点产生零：从每一行减去该行的最小值，再从每一列减去该列的最小值。只用零的指派就是最优的。\n\n用行最小值 5 和 4 化简 $\\begin{pmatrix} 5 & 8 \\\\ 6 & 4 \\end{pmatrix}$，得 $\\begin{pmatrix} 0 & 3 \\\\ 2 & 0 \\end{pmatrix}$，每一列都已有零。对角线上的零给出成本为 $5 + 4 = 9$ 的指派。\n\n检验：另一种指派的成本是 $8 + 6 = 14$，比 9 多。\n\n> **注意。** 每列的最小值要在行化简之后取，而不是在原矩阵中取。",
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
          const original = rows[i]?.[j] as number;
          const rowMin = Math.min(...(rows[i] as number[]));
          return solved(
            [
              `Reduce $${matrix(rows)}$ by subtracting each row's minimum and then each column's minimum. What is the entry in row ${i + 1}, column ${j + 1}?`,
              `化简 $${matrix(rows)}$：先从每行减去该行的最小值，再从每列减去该列的最小值。第 ${i + 1} 行第 ${j + 1} 列的元素是多少？`,
            ],
            answer,
            [
              [original, "That is the original entry, before any reduction.", "这是原来的元素，还没有化简。"],
              [
                entry,
                `That stops after the row step; the column minimum ${columnMin} must still be subtracted.`,
                `这停在了行化简之后；还要减去列最小值 ${columnMin}。`,
              ],
              [
                original - columnMin,
                `That subtracts the column minimum but skips the row step, which removes ${rowMin}.`,
                `这减去了列最小值，却跳过了减去 ${rowMin} 的行化简。`,
              ],
              [
                rowMin,
                "That is the row's minimum, the amount the row step removes, not the entry left.",
                "这是该行的最小值，即行化简减去的量，不是剩下的元素。",
              ],
            ],
            [
              [
                ["Reduce the row", "化简行"],
                [
                  `Row ${i + 1} has minimum ${rowMin}, so the entry becomes $${original} - ${rowMin} = ${entry}$.`,
                  `第 ${i + 1} 行的最小值是 ${rowMin}，所以这个元素变为 $${original} - ${rowMin} = ${entry}$。`,
                ],
              ],
              [
                ["Reduce the column", "化简列"],
                [
                  `After the row step, column ${j + 1} has minimum ${columnMin}, so the entry becomes $${entry} - ${columnMin} = ${answer}$.`,
                  `行化简后，第 ${j + 1} 列的最小值是 ${columnMin}，所以这个元素变为 $${entry} - ${columnMin} = ${answer}$。`,
                ],
              ],
            ],
            [
              `$${original} - ${rowMin} - ${columnMin} = ${answer}$, and it is not negative, as every reduced entry must be.`,
              `$${original} - ${rowMin} - ${columnMin} = ${answer}$，它不是负数，正如每个化简后的元素都应满足的那样。`,
            ],
          );
        },
      ),
      point(
        "the-cheapest-assignment",
        ["The cheapest assignment", "最便宜的指派"],
        [
          "A three by three assignment problem has only six possible assignments, one for each ordering of the jobs, so it can be checked by hand. Choosing the cheapest entry in each row is tempting but may give two workers the same job, and the sum of the row minimums is then only a lower bound. The answer must be a real assignment, using one entry from each row and each column.\n\nFor $\\begin{pmatrix} 3 & 1 & 4 \\\\ 2 & 5 & 1 \\\\ 6 & 2 & 3 \\end{pmatrix}$ the six assignments cost 11, 6, 6, 8, 8 and 15, so the minimum is 6. The row minimums add to $1 + 1 + 2 = 4$, but they give the second job to two workers.\n\nCheck: columns 1, 3, 2 for rows 1, 2, 3 cost $3 + 1 + 2 = 6$, one entry from each row and column.\n\n> **Watch out.** The sum of the row minimums is only a lower bound; a real assignment uses each column once.",
          "三乘三的指派问题只有六种可能的指派，每种工作的排列对应一种，所以可以手工检查。在每一行选最便宜的元素很诱人，但可能把同一项工作分给两个工人，这时各行最小值之和只是一个下界。答案必须是真正的指派，每行每列各用一个元素。\n\n对 $\\begin{pmatrix} 3 & 1 & 4 \\\\ 2 & 5 & 1 \\\\ 6 & 2 & 3 \\end{pmatrix}$，六种指派的成本是 11，6，6，8，8 和 15，所以最小值是 6。各行最小值之和是 $1 + 1 + 2 = 4$，但它们把第二项工作分给了两个工人。\n\n检验：第 1、2、3 行分别取第 1、3、2 列，成本是 $3 + 1 + 2 = 6$，每行每列各用一个元素。\n\n> **注意。** 各行最小值之和只是下界；真正的指派每列只用一次。",
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
          const higher = totals.filter((v) => v > answer);
          return solved(
            [
              `Workers are the rows and jobs are the columns of the cost matrix $${matrix(rows)}$. What is the smallest total cost of an assignment?`,
              `成本矩阵 $${matrix(rows)}$ 的行是工人，列是工作。指派的最小总成本是多少？`,
            ],
            answer,
            [
              [Math.max(...totals), "That is the most expensive assignment, not the cheapest.", "这是最贵的指派，不是最便宜的。"],
              [
                rowMins,
                "That adds the row minimums, which give some job to two workers.",
                "这把各行最小值相加，但这会把某项工作分给两个工人。",
              ],
              [
                at(0, 0) + at(1, 1) + at(2, 2),
                "That is the diagonal assignment, which is not the cheapest.",
                "这是对角线上的指派，不是最便宜的。",
              ],
              ...(higher.length > 0
                ? [
                    [
                      Math.min(...higher),
                      "That is the second cheapest assignment; one costs less.",
                      "这是第二便宜的指派；还有更便宜的。",
                    ] as Miss,
                  ]
                : []),
            ],
            [
              [
                ["List the assignments", "列出指派"],
                [`The six orderings of the columns cost ${listed(totals)}.`, `六种列的排列的成本是 ${listed(totals)}。`],
              ],
              [
                ["Take the smallest", "取最小的"],
                [
                  `The smallest is ${answer}, from columns ${best[0] + 1}, ${best[1] + 1}, ${best[2] + 1} for rows 1, 2, 3.`,
                  `最小的是 ${answer}，即第 1、2、3 行分别取第 ${best[0] + 1}、${best[1] + 1}、${best[2] + 1} 列。`,
                ],
              ],
            ],
            [
              `$${at(0, best[0])} + ${at(1, best[1])} + ${at(2, best[2])} = ${answer}$ uses one entry from each row and each column, so it is a real assignment.`,
              `$${at(0, best[0])} + ${at(1, best[1])} + ${at(2, best[2])} = ${answer}$ 每行每列各用一个元素，所以是真正的指派。`,
            ],
          );
        },
      ),
    ],
  ),
  [
    "Two workers and two jobs have costs $\\begin{pmatrix} 4 & 2 \\\\ 3 & 6 \\end{pmatrix}$. Subtracting the row minimums 2 and 3 gives $\\begin{pmatrix} 2 & 0 \\\\ 0 & 3 \\end{pmatrix}$, whose zeros give the first worker the second job and the second worker the first, at a cost of $2 + 3 = 5$.",
    "两个工人和两项工作的成本是 $\\begin{pmatrix} 4 & 2 \\\\ 3 & 6 \\end{pmatrix}$。减去行最小值 2 和 3，得 $\\begin{pmatrix} 2 & 0 \\\\ 0 & 3 \\end{pmatrix}$，它的零把第二项工作给第一个工人，第一项工作给第二个工人，成本是 $2 + 3 = 5$。",
  ],
  ["the other assignment costs $4 + 6 = 10$, more than 5.", "另一种指派的成本是 $4 + 6 = 10$，比 5 多。"],
  [
    "reduce a cost matrix by its row and column minimums, and find the cheapest assignment of a small problem.",
    "用行和列的最小值化简成本矩阵，并求小规模问题的最便宜指派。",
  ],
);

const maximumFlow = lesson(
  topic(
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
          "A flow network sends material from a source to a sink along edges with capacities. A cut splits the nodes into a part containing the source and a part containing the sink, and its capacity adds the capacities of edges leading from the first part to the second. Edges running backwards are not counted. Every unit of flow must cross the cut, so a cut's capacity bounds the flow.\n\nWith $s$ and $a$ on the source side, and edges $s \\to b$ of capacity 3, $a \\to t$ of capacity 4 and $a \\to b$ of capacity 2 leaving it, the cut has capacity $3 + 4 + 2 = 9$.\n\nCheck: the edge $s \\to a$ stays inside the source side, so it is not counted.\n\n> **Watch out.** Count every edge from the source side to the sink side, including one between two middle nodes such as $a \\to b$.",
          "流网络沿有容量的边把物质从源点送到汇点。割把节点分成含源点和含汇点的两部分，它的容量是从第一部分指向第二部分的边的容量之和。反向的边不计入。每一单位流都必须穿过割，所以割的容量是流的上界。\n\n$s$ 和 $a$ 在源点一侧，离开这一侧的边有容量为 3 的 $s \\to b$、容量为 4 的 $a \\to t$ 和容量为 2 的 $a \\to b$，割的容量是 $3 + 4 + 2 = 9$。\n\n检验：边 $s \\to a$ 留在源点一侧内部，所以不计入。\n\n> **注意。** 每条从源点一侧指向汇点一侧的边都要计入，包括像 $a \\to b$ 这样连接两个中间节点的边。",
        ],
        (rng) => {
          const [sa, sb, at, bt, ab] = [rng.int(2, 12), rng.int(2, 12), rng.int(2, 12), rng.int(2, 12), rng.int(1, 6)];
          const answer = sb + at + ab;
          return solved(
            [
              `A network has edges $s \\to a$ of capacity ${sa}, $s \\to b$ of capacity ${sb}, $a \\to t$ of capacity ${at}, $b \\to t$ of capacity ${bt} and $a \\to b$ of capacity ${ab}. What is the capacity of the cut with $s$ and $a$ on the source side?`,
              `网络的边有：$s \\to a$ 容量 ${sa}，$s \\to b$ 容量 ${sb}，$a \\to t$ 容量 ${at}，$b \\to t$ 容量 ${bt}，$a \\to b$ 容量 ${ab}。$s$ 和 $a$ 在源点一侧的割的容量是多少？`,
            ],
            answer,
            [
              [sb + at, "That forgets the edge $a \\to b$, which also leaves the source side.", "这忘了边 $a \\to b$，它也离开源点一侧。"],
              [sa + sb, "That is the cut with only $s$ on the source side.", "这是只有 $s$ 在源点一侧的割。"],
              [at + bt, "That is the cut with only $t$ on the sink side.", "这是只有 $t$ 在汇点一侧的割。"],
              [sa + bt, "That is the cut with $s$ and $b$ on the source side.", "这是 $s$ 和 $b$ 在源点一侧的割。"],
            ],
            [
              [
                ["Find the edges that cross", "找穿过割的边"],
                [
                  "The edges from $\\{s, a\\}$ to $\\{b, t\\}$ are $s \\to b$, $a \\to t$ and $a \\to b$.",
                  "从 $\\{s, a\\}$ 指向 $\\{b, t\\}$ 的边是 $s \\to b$，$a \\to t$ 和 $a \\to b$。",
                ],
              ],
              [
                ["Add their capacities", "容量相加"],
                [`$${sb} + ${at} + ${ab} = ${answer}$.`, `$${sb} + ${at} + ${ab} = ${answer}$。`],
              ],
            ],
            [
              "The edge $s \\to a$ stays inside the source side and $b \\to t$ inside the sink side, so neither counts.",
              "边 $s \\to a$ 留在源点一侧内部，$b \\to t$ 留在汇点一侧内部，所以都不计入。",
            ],
          );
        },
      ),
      point(
        "the-maximum-flow",
        ["The maximum flow", "最大流"],
        [
          "The max-flow min-cut theorem says that the largest flow from source to sink equals the smallest capacity of any cut. It is linear programming duality in another form, since the two problems are dual to each other. In a small network, listing every cut and taking the smallest gives the maximum flow directly, and the smallest cut shows exactly which edges form the bottleneck.\n\nWith edges $s \\to a$ of 4, $s \\to b$ of 5, $a \\to t$ of 6, $b \\to t$ of 2 and $a \\to b$ of 3, the four cuts have capacities 9, 14, 6 and 8, so the maximum flow is 6.\n\nCheck: sending 4 along $s \\to a \\to t$ and 2 along $s \\to b \\to t$ is a flow of 6.\n\n> **Watch out.** The maximum flow is the smallest cut, not the largest; every cut bounds the flow, so the tightest bound is the one that holds.",
          "最大流最小割定理说，从源点到汇点的最大流等于所有割的最小容量。它是线性规划对偶的另一种形式，因为这两个问题互为对偶。在小网络中，列出所有的割并取最小的，就能直接得到最大流，而最小割恰好显示哪些边构成瓶颈。\n\n边 $s \\to a$ 容量 4，$s \\to b$ 容量 5，$a \\to t$ 容量 6，$b \\to t$ 容量 2，$a \\to b$ 容量 3，四个割的容量是 9，14，6 和 8，所以最大流是 6。\n\n检验：沿 $s \\to a \\to t$ 送 4，沿 $s \\to b \\to t$ 送 2，就是大小为 6 的流。\n\n> **注意。** 最大流是最小的割，而不是最大的；每个割都是流的上界，起作用的是最紧的那个。",
        ],
        (rng) => {
          const [sa, sb, at, bt, ab] = [rng.int(2, 12), rng.int(2, 12), rng.int(2, 12), rng.int(2, 12), rng.int(1, 6)];
          const cuts = [sa + sb, sb + at + ab, sa + bt, at + bt];
          const answer = Math.min(...cuts);
          const sides: readonly Pair[] = [
            ["only $s$", "只有 $s$"],
            ["$s$ and $a$", "$s$ 和 $a$"],
            ["$s$ and $b$", "$s$ 和 $b$"],
            ["$s$, $a$ and $b$", "$s$，$a$ 和 $b$"],
          ];
          return solved(
            [
              `A network has edges $s \\to a$ of capacity ${sa}, $s \\to b$ of capacity ${sb}, $a \\to t$ of capacity ${at}, $b \\to t$ of capacity ${bt} and $a \\to b$ of capacity ${ab}. What is the maximum flow from $s$ to $t$?`,
              `网络的边有：$s \\to a$ 容量 ${sa}，$s \\to b$ 容量 ${sb}，$a \\to t$ 容量 ${at}，$b \\to t$ 容量 ${bt}，$a \\to b$ 容量 ${ab}。从 $s$ 到 $t$ 的最大流是多少？`,
            ],
            answer,
            [
              ...cuts.map(
                (c, k): Miss => [
                  c,
                  `That is the capacity of the cut with ${(sides[k] as Pair)[0]} on the source side, but a smaller cut exists.`,
                  `这是${(sides[k] as Pair)[1]}在源点一侧的割的容量，但还有更小的割。`,
                ],
              ),
              [
                sa + sb + ab,
                "That adds $a \\to b$ to the cut around $s$, but that edge does not leave the source side of that cut.",
                "这把 $a \\to b$ 加到了只围住 $s$ 的割上，但这条边并不离开那个割的源点一侧。",
              ],
            ],
            [
              [
                ["List the cuts", "列出割"],
                [
                  `With $s$ alone, with $a$, with $b$, and with both on the source side, the cuts have capacities ${listed(cuts)}.`,
                  `源点一侧只有 $s$、加上 $a$、加上 $b$、两者都加上时，割的容量是 ${listed(cuts)}。`,
                ],
              ],
              [
                ["Take the smallest", "取最小的"],
                [`The smallest is ${answer}, so the maximum flow is ${answer}.`, `最小的是 ${answer}，所以最大流是 ${answer}。`],
              ],
            ],
            [
              `Every flow crosses each cut, so no flow exceeds ${answer}, and by the max-flow min-cut theorem a flow of ${answer} exists.`,
              `每个流都穿过每个割，所以没有流超过 ${answer}；由最大流最小割定理，大小为 ${answer} 的流存在。`,
            ],
          );
        },
      ),
    ],
  ),
  [
    "A network has edges $s \\to a$ of capacity 5, $s \\to b$ of 3, $a \\to t$ of 4 and $b \\to t$ of 6. Its four cuts have capacities $5 + 3 = 8$, $3 + 4 = 7$, $5 + 6 = 11$ and $4 + 6 = 10$, so the maximum flow is the smallest, 7.",
    "网络的边有：$s \\to a$ 容量 5，$s \\to b$ 容量 3，$a \\to t$ 容量 4，$b \\to t$ 容量 6。它的四个割的容量是 $5 + 3 = 8$，$3 + 4 = 7$，$5 + 6 = 11$ 和 $4 + 6 = 10$，所以最大流是最小的那个，7。",
  ],
  [
    "sending 4 along $s \\to a \\to t$ and 3 along $s \\to b \\to t$ is a flow of 7.",
    "沿 $s \\to a \\to t$ 送 4，沿 $s \\to b \\to t$ 送 3，就是大小为 7 的流。",
  ],
  [
    "compute the capacity of a cut, and find the maximum flow of a small network from its smallest cut.",
    "计算割的容量，并由最小割求小网络的最大流。",
  ],
);

const integerPrograms = lesson(
  topic(
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
          "When variables must be whole numbers, the program is much harder, and the corner theorem no longer applies. Dropping the whole-number requirement gives the relaxation, a linear program whose optimum bounds the integer optimum. For a maximum, the relaxed value is an upper bound. Simply rounding its solution may lose feasibility or optimality, so rounding is at best a starting point, not a method.\n\nMaximize $5x$ subject to $3x \\le 11$ with $x$ a whole number. The relaxation allows $x = \\frac{11}{3}$, but a whole number can reach only $x = 3$, which gives 15.\n\nCheck: $3(3) = 9 \\le 11$, while $3(4) = 12$ exceeds 11.\n\n> **Watch out.** Rounding the relaxed solution up breaks the constraint; here the best whole number lies below it.",
          "变量必须是整数时，规划难得多，顶点定理也不再适用。去掉整数要求就得到松弛问题，它是一个线性规划，其最优值是整数最优值的界。对最大化问题，松弛的值是上界。直接把解四舍五入可能失去可行性或最优性，所以取整最多是一个起点，而不是方法。\n\n在 $3x \\le 11$，$x$ 为整数的条件下使 $5x$ 最大。松弛问题允许 $x = \\frac{11}{3}$，但整数最多取 $x = 3$，得到 15。\n\n检验：$3(3) = 9 \\le 11$，而 $3(4) = 12$ 超过 11。\n\n> **注意。** 把松弛解向上取整会违反约束；这里最好的整数在它下面。",
        ],
        (rng) => {
          const a = rng.int(2, 9);
          const c = rng.int(2, 9);
          const q = rng.int(2, 12);
          const r = rng.int(1, a - 1);
          const b = a * q + r;
          const answer = c * q;
          return solved(
            [
              `Maximize $${c}x$ subject to $${a}x \\le ${b}$, with $x$ a nonnegative whole number. What is the maximum?`,
              `在 $${a}x \\le ${b}$，$x$ 为非负整数的条件下使 $${c}x$ 最大。最大值是多少？`,
            ],
            answer,
            [
              [Q.of(c * b, a), "That is the value of the relaxation, which a whole number cannot reach.", "这是松弛问题的值，整数取不到。"],
              [
                c * (q + 1),
                `That rounds $x$ up to ${q + 1}, but $${a}(${q + 1}) = ${a * (q + 1)}$ exceeds ${b}.`,
                `这把 $x$ 向上取整为 ${q + 1}，但 $${a}(${q + 1}) = ${a * (q + 1)}$ 超过了 ${b}。`,
              ],
              [q, "That is the best value of $x$, not the value of the objective.", "这是 $x$ 的最好取值，不是目标值。"],
            ],
            [
              [
                ["Solve the relaxation", "解松弛问题"],
                [`Without the whole-number requirement, $x = ${Q.of(b, a).toLatex()}$.`, `去掉整数要求，$x = ${Q.of(b, a).toLatex()}$。`],
              ],
              [
                ["Take the largest whole number", "取最大的整数"],
                [
                  `The largest whole number with $${a}x \\le ${b}$ is $x = ${q}$, which gives $${c}(${q}) = ${answer}$.`,
                  `满足 $${a}x \\le ${b}$ 的最大整数是 $x = ${q}$，得到 $${c}(${q}) = ${answer}$。`,
                ],
              ],
            ],
            [
              `$${a}(${q}) = ${a * q} \\le ${b}$, while $${a}(${q + 1}) = ${a * (q + 1)}$ exceeds ${b}.`,
              `$${a}(${q}) = ${a * q} \\le ${b}$，而 $${a}(${q + 1}) = ${a * (q + 1)}$ 超过了 ${b}。`,
            ],
          );
        },
      ),
      point(
        "branching-on-a-variable",
        ["Branching on a variable", "按变量分支"],
        [
          "Branch and bound splits a problem wherever the relaxation gives a fractional value. If a variable comes out between two whole numbers, no integer solution can lie strictly between them, so one branch adds a constraint that it is at most the lower one, and the other adds that it is at least the upper one. A branch whose bound cannot beat the best known solution is discarded.\n\nIf the relaxation gives $x_1 = \\frac{7}{2}$, the branches are $x_1 \\le 3$ and $x_1 \\ge 4$.\n\nCheck: every whole number is at most 3 or at least 4, while $\\frac{7}{2}$ satisfies neither branch.\n\n> **Watch out.** The two branches must surround the fractional value: the lower one ends at the whole number just below it, and the upper one starts at the whole number just above.",
          "分支定界法在松弛问题给出分数值的地方拆分问题。如果一个变量取值在两个整数之间，整数解不可能严格落在它们之间，所以一个分支加上它不超过较小整数的约束，另一个分支加上它不小于较大整数的约束。界不可能超过已知最优解的分支被舍弃。\n\n如果松弛问题给出 $x_1 = \\frac{7}{2}$，两个分支就是 $x_1 \\le 3$ 和 $x_1 \\ge 4$。\n\n检验：每个整数都不超过 3 或不小于 4，而 $\\frac{7}{2}$ 两个分支都不满足。\n\n> **注意。** 两个分支必须把分数值夹在中间：较低的分支止于它下面紧挨的整数，较高的分支始于它上面紧挨的整数。",
        ],
        (rng) => {
          const d = rng.int(2, 7);
          const f = rng.int(1, d - 1);
          const w = rng.int(1, 20);
          const value = Q.of(w * d + f, d);
          return chosen(
            rng,
            [
              `The relaxation gives $x_1 = ${value.toLatex()}$, and $x_1$ must be a whole number. Which two branches come next?`,
              `松弛问题给出 $x_1 = ${value.toLatex()}$，而 $x_1$ 必须是整数。接下来是哪两个分支？`,
            ],
            same(`x_1 \\le ${w} \\text{ and } x_1 \\ge ${w + 1}`),
            [
              [
                same(`x_1 \\le ${w + 1} \\text{ and } x_1 \\ge ${w + 2}`),
                `That cuts out the gap between ${w + 1} and ${w + 2}, but the value lies between ${w} and ${w + 1}, so it survives in the first branch.`,
                `这排除的是 ${w + 1} 和 ${w + 2} 之间的空隙，但这个值在 ${w} 和 ${w + 1} 之间，所以它仍留在第一个分支中。`,
              ],
              [
                same(`x_1 \\le ${w - 1} \\text{ and } x_1 \\ge ${w}`),
                `That cuts out the gap between ${w - 1} and ${w}, but the value lies above ${w}, so it survives in the second branch.`,
                `这排除的是 ${w - 1} 和 ${w} 之间的空隙，但这个值大于 ${w}，所以它仍留在第二个分支中。`,
              ],
              [
                same(`x_1 = ${w} \\text{ and } x_1 = ${w + 1}`),
                `That keeps only two values of $x_1$ and loses whole numbers such as ${w + 2}, which may be optimal.`,
                `这只保留 $x_1$ 的两个值，丢掉了像 ${w + 2} 这样可能最优的整数。`,
              ],
            ],
            [
              [
                ["Locate the value", "确定值的位置"],
                [`$${value.toLatex()}$ lies between ${w} and ${w + 1}.`, `$${value.toLatex()}$ 在 ${w} 和 ${w + 1} 之间。`],
              ],
              [
                ["Split around it", "在它两侧拆分"],
                [
                  `The branches $x_1 \\le ${w}$ and $x_1 \\ge ${w + 1}$ exclude only the gap between ${w} and ${w + 1}.`,
                  `分支 $x_1 \\le ${w}$ 和 $x_1 \\ge ${w + 1}$ 只排除 ${w} 和 ${w + 1} 之间的空隙。`,
                ],
              ],
            ],
            [
              `Every whole number is at most ${w} or at least ${w + 1}, so no integer solution is lost, while $${value.toLatex()}$ is excluded from both branches.`,
              `每个整数都不超过 ${w} 或不小于 ${w + 1}，所以没有丢掉整数解，而 $${value.toLatex()}$ 被两个分支都排除了。`,
            ],
          );
        },
      ),
    ],
  ),
  [
    "Maximize $3x$ subject to $2x \\le 7$, with $x$ a whole number. The relaxation allows $x = \\frac{7}{2}$, with value $\\frac{21}{2}$, an upper bound. The integer optimum is $x = 3$, with value 9.",
    "在 $2x \\le 7$，$x$ 为整数的条件下使 $3x$ 最大。松弛问题允许 $x = \\frac{7}{2}$，值为 $\\frac{21}{2}$，这是一个上界。整数最优解是 $x = 3$，值为 9。",
  ],
  [
    "$9 \\le \\frac{21}{2}$, as the bound requires, and $x = 4$ would need $2(4) = 8 > 7$.",
    "$9 \\le \\frac{21}{2}$，符合上界；而 $x = 4$ 需要 $2(4) = 8 > 7$。",
  ],
  [
    "compare an integer program with its relaxation, and branch on a variable whose relaxed value is fractional.",
    "比较整数规划和它的松弛问题，并按松弛值为分数的变量分支。",
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

const matrixGames = lesson(
  topic(
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
          "In a matrix game, the row player chooses a row, the column player chooses a column, and the entry is paid to the row player. The row player guarantees the largest of the row minimums, and the column player limits the loss to the smallest of the column maximums. When these are equal, the entry is a saddle point, the smallest in its row and the largest in its column.\n\nIn $\\begin{pmatrix} 2 & 6 \\\\ 0 & 7 \\end{pmatrix}$ the row minimums are 2 and 0 and the column maximums are 2 and 7. Both guarantees equal 2, so the value is 2.\n\nCheck: the entry 2 is the smallest in its row, $2 < 6$, and the largest in its column, $2 > 0$.\n\n> **Watch out.** The value is the saddle entry, not the largest or smallest entry of the matrix; each player can avoid the extremes.",
          "在矩阵博弈中，行方选一行，列方选一列，相应的元素付给行方。行方能保证各行最小值中的最大者，列方能把损失限制在各列最大值中的最小者。这两者相等时，这个元素就是鞍点，它在所在行中最小，在所在列中最大。\n\n在 $\\begin{pmatrix} 2 & 6 \\\\ 0 & 7 \\end{pmatrix}$ 中，各行最小值是 2 和 0，各列最大值是 2 和 7。两个保证值都等于 2，所以博弈的值是 2。\n\n检验：元素 2 在所在行中最小，$2 < 6$，在所在列中最大，$2 > 0$。\n\n> **注意。** 值是鞍点处的元素，而不是矩阵中最大或最小的元素；每一方都能避开极端情况。",
        ],
        (rng) => {
          const v = rng.int(-5, 12);
          const { rows, i, j } = gameWithSaddle(rng, v);
          const flat = rows.flat();
          const rowMins = rows.map((r) => Math.min(...r));
          const columnMaxes = [0, 1, 2].map((c) => Math.max(...rows.map((r) => r[c] as number)));
          return solved(
            [
              `The payoff matrix $${matrix(rows)}$ pays the row player, and it has a saddle point. What is the value of the game?`,
              `收益矩阵 $${matrix(rows)}$ 付给行方，它有鞍点。这个博弈的值是多少？`,
            ],
            v,
            [
              [
                Math.max(...flat),
                "That is the largest entry, which the column player can always avoid.",
                "这是最大的元素，列方总能避开它。",
              ],
              [Math.min(...flat), "That is the smallest entry, which the row player can always avoid.", "这是最小的元素，行方总能避开它。"],
              [
                Math.max(...(rows[i] as number[])),
                "That is the largest entry in the saddle point's row, but the column player answers that row with the saddle point's column.",
                "这是鞍点所在行中最大的元素，但列方会用鞍点所在的列来应对这一行。",
              ],
              [
                Math.min(...rows.map((r) => r[j] as number)),
                "That is the smallest entry in the saddle point's column, but the row player answers that column with the saddle point's row.",
                "这是鞍点所在列中最小的元素，但行方会用鞍点所在的行来应对这一列。",
              ],
            ],
            [
              [
                ["The row player's guarantee", "行方的保证值"],
                [
                  `The row minimums are ${listed(rowMins)}, and the largest is $${v}$.`,
                  `各行最小值是 ${listed(rowMins)}，最大的是 $${v}$。`,
                ],
              ],
              [
                ["The column player's guarantee", "列方的保证值"],
                [
                  `The column maximums are ${listed(columnMaxes)}, and the smallest is $${v}$, so the value is $${v}$.`,
                  `各列最大值是 ${listed(columnMaxes)}，最小的是 $${v}$，所以博弈的值是 $${v}$。`,
                ],
              ],
            ],
            [
              `The entry $${v}$ in row ${i + 1}, column ${j + 1} is the smallest in its row and the largest in its column.`,
              `第 ${i + 1} 行第 ${j + 1} 列的元素 $${v}$ 在所在行中最小，在所在列中最大。`,
            ],
          );
        },
      ),
      point(
        "a-mixed-strategy-value",
        ["The value of a mixed strategy", "混合策略的值"],
        [
          "When no saddle point exists, each player mixes rows or columns at random, and von Neumann's minimax theorem says the guarantees then meet, a fact equal to strong duality for a suitable pair of programs. For a two by two game, the row player makes the opponent indifferent between columns. This gives the formula that the value is $\\frac{ad - bc}{a + d - b - c}$.\n\nFor $\\begin{pmatrix} 6 & 2 \\\\ 1 & 5 \\end{pmatrix}$ the denominator is $6 + 5 - 2 - 1 = 8$, so the value is $\\frac{30 - 2}{8} = \\frac{7}{2}$, and the row player chooses the first row with probability $\\frac{5 - 1}{8} = \\frac{1}{2}$.\n\nCheck: with $p = \\frac{1}{2}$, the first column pays $\\frac{6 + 1}{2} = \\frac{7}{2}$ and the second pays $\\frac{2 + 5}{2} = \\frac{7}{2}$, the same.\n\n> **Watch out.** The numerator subtracts $bc$, and the denominator includes all four entries; the formula applies only when there is no saddle point.",
          "没有鞍点时，每一方都随机混合各行或各列，冯·诺伊曼的极小极大定理说，这时双方的保证值相等，这相当于一对相应规划的强对偶。对二乘二博弈，行方使对手在各列之间无差别。这就给出公式：值等于 $\\frac{ad - bc}{a + d - b - c}$。\n\n对 $\\begin{pmatrix} 6 & 2 \\\\ 1 & 5 \\end{pmatrix}$，分母是 $6 + 5 - 2 - 1 = 8$，所以值是 $\\frac{30 - 2}{8} = \\frac{7}{2}$，行方以概率 $\\frac{5 - 1}{8} = \\frac{1}{2}$ 选择第一行。\n\n检验：取 $p = \\frac{1}{2}$，第一列给出 $\\frac{6 + 1}{2} = \\frac{7}{2}$，第二列给出 $\\frac{2 + 5}{2} = \\frac{7}{2}$，两者相同。\n\n> **注意。** 分子减去 $bc$，分母包含全部四个元素；这个公式只在没有鞍点时适用。",
        ],
        (rng) => {
          const low1 = rng.int(1, 4);
          const low2 = rng.int(1, 4);
          const a = rng.int(5, 12);
          const d = rng.int(5, 12);
          const denominator = a + d - low1 - low2;
          const asksValue = rng.bool();
          const answer = asksValue ? Q.of(a * d - low1 * low2, denominator) : Q.of(d - low2, denominator);
          const game = matrix([
            [a, low1],
            [low2, d],
          ]);
          const p = Q.of(d - low2, denominator).toLatex();
          const noSaddle: Walk = [
            ["Check for a saddle point", "检查鞍点"],
            [
              `The row minimums are ${low1} and ${low2}, but the column maximums are ${a} and ${d}, so no entry is a saddle point and the players mix.`,
              `各行最小值是 ${low1} 和 ${low2}，但各列最大值是 ${a} 和 ${d}，所以没有鞍点，双方都要混合。`,
            ],
          ];
          return solved(
            [
              `The game $${game}$ has no saddle point. ${asksValue ? "What is its value?" : "With what probability does the row player choose the first row?"}`,
              `博弈 $${game}$ 没有鞍点。${asksValue ? "它的值是多少？" : "行方选择第一行的概率是多少？"}`,
            ],
            answer,
            asksValue
              ? [
                  [
                    Q.of(a * d + low1 * low2, denominator),
                    "That adds $bc$ in the numerator; the formula subtracts it.",
                    "这在分子中加上了 $bc$；公式是减去它。",
                  ],
                  [
                    Q.of(a + d, 2),
                    `That averages the large payoffs ${a} and ${d}, ignoring the small ones.`,
                    `这是大收益 ${a} 和 ${d} 的平均，忽略了小的收益。`,
                  ],
                  [
                    Q.of(a * d - low1 * low2, a + d),
                    `That leaves the small payoffs ${low1} and ${low2} out of the denominator.`,
                    `这在分母中漏掉了小收益 ${low1} 和 ${low2}。`,
                  ],
                ]
              : [
                  [Q.of(a - low1, denominator), "That is the probability of the second row.", "这是选择第二行的概率。"],
                  [
                    Q.of(1, 2),
                    "Mixing the rows equally does not make the column player indifferent here.",
                    "这里平均混合两行并不能使列方无差别。",
                  ],
                  [Q.of(d, a + d), `That uses only the large payoffs ${a} and ${d}.`, `这只用了大收益 ${a} 和 ${d}。`],
                  [
                    Q.of(a - low2, denominator),
                    `That puts the wrong entries in the numerator, which is $${d} - ${low2}$.`,
                    `这在分子中用错了元素，分子应是 $${d} - ${low2}$。`,
                  ],
                ],
            asksValue
              ? [
                  noSaddle,
                  [
                    ["Apply the formula", "代入公式"],
                    [
                      `The value is $\\frac{${a}(${d}) - ${low1}(${low2})}{${a} + ${d} - ${low1} - ${low2}} = ${answer.toLatex()}$.`,
                      `值是 $\\frac{${a}(${d}) - ${low1}(${low2})}{${a} + ${d} - ${low1} - ${low2}} = ${answer.toLatex()}$。`,
                    ],
                  ],
                ]
              : [
                  noSaddle,
                  [
                    ["Equalize the columns", "使两列相等"],
                    [
                      `Equal payoffs against both columns require $${a}p + ${low2}(1 - p) = ${low1}p + ${d}(1 - p)$, so $${denominator}p = ${d} - ${low2}$ and $p = ${answer.toLatex()}$.`,
                      `对两列的收益相等要求 $${a}p + ${low2}(1 - p) = ${low1}p + ${d}(1 - p)$，所以 $${denominator}p = ${d} - ${low2}$，$p = ${answer.toLatex()}$。`,
                    ],
                  ],
                ],
            asksValue
              ? [
                  `With $p = ${p}$, the first column pays $\\frac{${a}(${d - low2}) + ${low2}(${a - low1})}{${denominator}} = ${answer.toLatex()}$, the same value.`,
                  `取 $p = ${p}$，第一列给出 $\\frac{${a}(${d - low2}) + ${low2}(${a - low1})}{${denominator}} = ${answer.toLatex()}$，值相同。`,
                ]
              : [
                  `The second row then has probability $1 - p = ${Q.of(a - low1, denominator).toLatex()}$, and both probabilities lie between 0 and 1.`,
                  `第二行的概率是 $1 - p = ${Q.of(a - low1, denominator).toLatex()}$，两个概率都在 0 和 1 之间。`,
                ],
          );
        },
      ),
    ],
  ),
  [
    "In the game $\\begin{pmatrix} 3 & 5 \\\\ 1 & 4 \\end{pmatrix}$ the row player guarantees the larger row minimum, 3, and the column player concedes at most the smaller column maximum, 3. They agree, so the entry 3 is a saddle point and the value of the game is 3.",
    "在博弈 $\\begin{pmatrix} 3 & 5 \\\\ 1 & 4 \\end{pmatrix}$ 中，行方能保证较大的行最小值 3，列方至多付出较小的列最大值 3。两者一致，所以元素 3 是鞍点，博弈的值是 3。",
  ],
  [
    "3 is the smallest in its row, $3 < 5$, and the largest in its column, $3 > 1$.",
    "3 在所在行中最小，$3 < 5$，在所在列中最大，$3 > 1$。",
  ],
  [
    "find the value of a game with a saddle point, and the value and optimal mix of a two by two game without one.",
    "求有鞍点的博弈的值，以及没有鞍点的二乘二博弈的值和最优混合策略。",
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
