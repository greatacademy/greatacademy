import type { KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import { gradeDrawings5 } from "../explanation-drawings-grades-5.ts";

import { numberProblem, steps } from "../problems.ts";
import type { Pair } from "./early-grades-more-kit.ts";
import { graphFigure, monotoneWalk } from "./functions.ts";
import { chosen, chosenMath, drawn, lesson, valued, withIntro } from "./grade-6-kit.ts";
import { tableFigure } from "./grade-8-kit.ts";

// Topics several outlines ask for that nothing else covered: telling the number of solutions of a system by inspection,
// reading a function's extreme values, and linear equations whose sides contain binomials.

/** topic builds a TopicDef with the common fields filled in. */
function topic(
  id: string,
  title: Text,
  summary: Text,
  prerequisites: string[],
  standards: string[],
  knowledgePoints: KnowledgePointDef[],
): TopicDef {
  return {
    id,
    title,
    summary,
    prerequisites,
    encompasses: [],
    xp: 10,
    standards: standards.map((s) => `CCSS.${s}`),
    knowledgePoints,
  };
}

/** kp builds a KnowledgePointDef. */
function kp(id: string, title: Text, explanation: Text, generate: (rng: Rng) => Problem): KnowledgePointDef {
  return { id, title, explanation, generate };
}

/** signed writes a term with its sign for use after another term, and nothing for zero. */
const signed = (n: number, suffix = "") => (n === 0 ? "" : ` ${n < 0 ? "-" : "+"} ${Math.abs(n)}${suffix}`);

/** factor writes a binomial such as x + 3 in a letter. */
const factor = (v: string, n: number) => `(${v}${signed(n)})`;

/** standard writes ax + by = c with unit coefficients left implicit. */
function standard(a: number, b: number, c: number): string {
  const first = a === 1 ? "x" : a === -1 ? "-x" : `${a}x`;
  const second = Math.abs(b) === 1 ? ` ${b < 0 ? "-" : "+"} y` : ` ${b < 0 ? "-" : "+"} ${Math.abs(b)}y`;
  return `${first}${second} = ${c}`;
}

const howMany = {
  one: t("Exactly one solution", "恰有一个解"),
  none: t("No solution", "无解"),
  many: t("Infinitely many solutions", "有无穷多个解"),
  two: t("Exactly two solutions", "恰有两个解"),
};

/** coefficientTable draws the numbers of two equations ax + by = c in rows, so that their multiples can be compared. */
const coefficientTable = (first: readonly string[], second: readonly string[]) =>
  tableFigure(
    ["(1)", "(2)"],
    ["x", "y", "="],
    [first, second],
    [
      `The coefficients of two equations in rows: equation (1) has ${first.join(", ")} and equation (2) has ${second.join(", ")}, for x, y and the constant.`,
      `两个方程的系数按行排列：方程 (1) 是 ${first.join("、")}，方程 (2) 是 ${second.join("、")}，依次是 x、y 的系数和常数。`,
    ],
  );

/** wrapped writes a number in parentheses when it is negative, for use after a product sign. */
const wrapped = (n: number) => (n < 0 ? `(${n})` : `${n}`);

/** shifted writes x - h, or x for h = 0, with a number in place of x when one is given. */
const shifted = (h: number, x = "x") => (h === 0 ? x : `(${x} ${h < 0 ? `+ ${-h}` : `- ${h}`})`);

/** identifyingTheNumberOfSolutionsByInspection tells how many solutions a linear system has without solving it. */
export const identifyingTheNumberOfSolutionsByInspection = withIntro(
  topic(
    "identifying-the-number-of-solutions-to-a-system-by-inspection",
    t("Identifying the Number of Solutions to a System by Inspection", "通过观察判断方程组解的个数"),
    t(
      "Compare the coefficients of two linear equations to tell, without solving, whether the system has one solution, none or infinitely many.",
      "比较两个线性方程的系数，不必求解就判断方程组有一个解、无解还是有无穷多个解。",
    ),
    ["elimination-with-two-transformations"],
    ["8.EE.C.8b"],
    [
      lesson(
        "comparing-coefficients",
        ["Comparing coefficients", "比较系数"],
        [
          [
            "Two lines meet once unless they are parallel. If the $x$ and $y$ coefficients of one equation are not the same multiple of the other's, the slopes differ and there is one solution. If they are the same multiple but the constants are not, the lines are parallel, with no solution. If everything is the same multiple, it is one line, with infinitely many solutions.",
            "两条直线除非平行，否则恰好相交一次。如果一个方程 $x$ 和 $y$ 的系数不是另一个方程系数的同一倍数，斜率就不同，方程组有一个解。如果是同一倍数而常数项不是，两条直线平行，方程组无解。如果全部是同一倍数，就是同一条直线，有无穷多个解。",
          ],
          [
            "$x + 2y = 4$ and $2x + 4y = 9$ have slopes $-\\frac{1}{2}$ and $-\\frac{2}{4} = -\\frac{1}{2}$: equal, so the lines are parallel.",
            "$x + 2y = 4$ 和 $2x + 4y = 9$ 的斜率是 $-\\frac{1}{2}$ 和 $-\\frac{2}{4} = -\\frac{1}{2}$：相等，所以两条直线平行。",
          ],
          [
            "Check the constants too. Matching coefficients alone could mean no solution or infinitely many.",
            "还要看常数项。只是系数成倍数，可能无解，也可能有无穷多个解。",
          ],
        ],
        (rng) => {
          const a = rng.pick([1, 2, 3, 4, 5]);
          const b = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
          // c is a multiple of the common factor of a and b, so the first line passes through a point with whole coordinates.
          const g = [5, 4, 3, 2, 1].find((d) => a % d === 0 && b % d === 0)!;
          const c = g * rng.int(Math.ceil(-12 / g), Math.floor(12 / g));
          const px = [0, 1, -1, 2, -2, 3, -3, 4, -4, 5, -5].find((x) => (c - a * x) % b === 0)!;
          const py = (c - a * px) / b;
          const k = rng.pick([-3, -2, 2, 3, 4, 5]);
          const picked = rng.pick(["one", "none", "many"] as const);
          const a2 = k * a;
          let b2 = picked === "one" ? k * b + rng.pick([-2, -1, 1, 2]) : k * b;
          if (b2 === 0) b2 = 1;
          const c2 = picked === "none" ? k * c + rng.pick([-5, -3, -1, 1, 2, 4]) : picked === "many" ? k * c : rng.int(-20, 20);
          const kind = b2 !== k * b ? "one" : picked;
          const two = [howMany.two, "Two lines cannot meet in exactly two points.", "两条直线不可能恰好相交于两点。"] as const;
          const pair = (x: Text): Pair => [x.en, x["zh-CN"]];
          const wrong: [Pair, string, string][] =
            kind === "one"
              ? [
                  [
                    pair(howMany.none),
                    "Parallel lines need both coefficients to be the same multiple, and here they are not.",
                    "平行线要求两个系数是同一倍数，这里不是。",
                  ],
                  [
                    pair(howMany.many),
                    "One line needs every number to be the same multiple, and here the coefficients are not.",
                    "同一条直线要求所有数都是同一倍数，这里系数就不是。",
                  ],
                ]
              : kind === "none"
                ? [
                    [
                      pair(howMany.one),
                      "The coefficients are the same multiple, so the slopes match and the lines cannot cross once.",
                      "系数是同一倍数，所以斜率相同，两条直线不会只相交一次。",
                    ],
                    [
                      pair(howMany.many),
                      `$${k} \\cdot ${wrapped(c)} = ${k * c}$ is not $${c2}$, so the lines are not the same.`,
                      `$${k} \\cdot ${wrapped(c)} = ${k * c}$ 不等于 $${c2}$，所以两条直线不重合。`,
                    ],
                  ]
                : [
                    [
                      pair(howMany.one),
                      "The coefficients are the same multiple, so the slopes match and the lines cannot cross once.",
                      "系数是同一倍数，所以斜率相同，两条直线不会只相交一次。",
                    ],
                    [
                      pair(howMany.none),
                      "The constants are the same multiple too, so it is one line, not two parallel ones.",
                      "常数项也是同一倍数，所以是同一条直线，不是两条平行线。",
                    ],
                  ];
          const line1 = standard(a, b, c);
          const line2 = standard(a2, b2, c2);
          return chosen(
            rng,
            [
              `Without solving, how many solutions does this system have?$$\\begin{cases} ${line1} \\\\ ${line2} \\end{cases}$$`,
              `不必求解，这个方程组有多少个解？$$\\begin{cases} ${line1} \\\\ ${line2} \\end{cases}$$`,
            ],
            pair(howMany[kind]),
            [...wrong, [pair(two[0]), two[1], two[2]]],
            [
              [
                ["Compare the coefficients", "比较系数"],
                kind === "one"
                  ? [
                      `$${a2} = ${k} \\cdot ${a}$, but $${b2} \\ne ${k} \\cdot ${wrapped(b)}$, so the slopes differ.`,
                      `$${a2} = ${k} \\cdot ${a}$，但 $${b2} \\ne ${k} \\cdot ${wrapped(b)}$，所以斜率不同。`,
                    ]
                  : [
                      `$${a2} = ${k} \\cdot ${a}$ and $${b2} = ${k} \\cdot ${wrapped(b)}$, so the slopes match.`,
                      `$${a2} = ${k} \\cdot ${a}$，$${b2} = ${k} \\cdot ${wrapped(b)}$，所以斜率相同。`,
                    ],
              ],
              [
                ["Decide", "下结论"],
                kind === "one"
                  ? ["Lines with different slopes cross exactly once.", "斜率不同的两条直线恰好相交一次。"]
                  : kind === "none"
                    ? [
                        `$${k} \\cdot ${wrapped(c)} = ${k * c}$ is not $${c2}$, so the lines are parallel and never meet.`,
                        `$${k} \\cdot ${wrapped(c)} = ${k * c}$ 不等于 $${c2}$，所以两条直线平行，永不相交。`,
                      ]
                    : [
                        `$${k} \\cdot ${wrapped(c)} = ${c2}$ as well, so both equations describe one line.`,
                        `$${k} \\cdot ${wrapped(c)}$ 也等于 $${c2}$，所以两个方程表示同一条直线。`,
                      ],
              ],
            ],
            kind === "one"
              ? [
                  `The slopes are $${Q.of(-a, b).toLatex()}$ and $${Q.of(-a2, b2).toLatex()}$, which differ.`,
                  `两条直线的斜率是 $${Q.of(-a, b).toLatex()}$ 和 $${Q.of(-a2, b2).toLatex()}$，不相等。`,
                ]
              : [
                  `Test a point: $(${px}, ${py})$ is on the first line, since $${a} \\cdot ${wrapped(px)} + ${wrapped(b)} \\cdot ${wrapped(py)} = ${c}$. In the second, $${a2} \\cdot ${wrapped(px)} + ${wrapped(b2)} \\cdot ${wrapped(py)} = ${a2 * px + b2 * py}$, ${
                    kind === "many" ? "the same as" : "not"
                  } $${c2}$, so the lines ${kind === "many" ? "share the point, as one line does" : "miss each other there, as parallel lines do"}.`,
                  `代入一个点检验：$(${px}, ${py})$ 在第一条直线上，因为 $${a} \\cdot ${wrapped(px)} + ${wrapped(b)} \\cdot ${wrapped(py)} = ${c}$。代入第二个方程，$${a2} \\cdot ${wrapped(px)} + ${wrapped(b2)} \\cdot ${wrapped(py)} = ${a2 * px + b2 * py}$，${
                    kind === "many" ? "正好等于" : "不等于"
                  } $${c2}$，所以${kind === "many" ? "两条直线共有这个点，正如同一条直线那样" : "两条直线在这里错开，正如平行线那样"}。`,
                ],
          );
        },
        drawn(gradeDrawings5["identifying-the-number-of-solutions-to-a-system-by-inspection#comparing-coefficients"]),
      ),
      lesson(
        "choosing-a-value-for-a-number-of-solutions",
        ["Choosing a value for a number of solutions", "选取数值使解的个数符合要求"],
        [
          [
            "The same comparison runs backward to find a missing number. Find the multiple from the pair of coefficients that is fully known, then apply it to the unknown. For $2x + 3y = 5$ and $kx + 6y = 7$, the $y$ coefficients give the multiple $2$. So $k = 4$ makes the lines parallel, and since $2 \\cdot 5 = 10 \\ne 7$, there is no solution.",
            "同样的比较可以反过来求未知的数。先由完全已知的一对系数求出倍数，再用到未知数上。对 $2x + 3y = 5$ 和 $kx + 6y = 7$，$y$ 的系数给出倍数 $2$。所以 $k = 4$ 时两条直线平行，又因为 $2 \\cdot 5 = 10 \\ne 7$，方程组无解。",
          ],
          [
            "With $k = 4$, both lines have slope $-\\frac{2}{3}$, and they cross the $y$-axis at different points.",
            "当 $k = 4$ 时，两条直线的斜率都是 $-\\frac{2}{3}$，与 $y$ 轴的交点不同。",
          ],
          [
            "The multiple comes from division, not subtraction. Here it is $\\frac{6}{3} = 2$, not $6 - 3 = 3$.",
            "倍数要用除法求，不是减法。这里是 $\\frac{6}{3} = 2$，不是 $6 - 3 = 3$。",
          ],
        ],
        (rng) => {
          const a = rng.pick([1, 2, 3, 4, 5, 6]);
          const b = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
          const c = rng.int(2, 15) * rng.pick([-1, 1]);
          const r = rng.pick([-3, -2, 2, 3, 4, 5]);
          if (rng.bool()) {
            const answer = r * a;
            const c2 = r * c + rng.pick([-4, -2, -1, 1, 3, 5]);
            const system = `\\begin{cases} ${standard(a, b, c)} \\\\ kx ${r * b < 0 ? "-" : "+"} ${Math.abs(r * b)}y = ${c2} \\end{cases}`;
            return valued(
              [`For what value of $k$ does this system have no solution?$$${system}$$`, `当 $k$ 为何值时，这个方程组无解？$$${system}$$`],
              answer,
              [
                [
                  ["Find the multiple", "求倍数"],
                  [
                    `The $y$ coefficients are both known: $${r * b} = ${r} \\cdot ${wrapped(b)}$.`,
                    `两个 $y$ 系数都已知：$${r * b} = ${r} \\cdot ${wrapped(b)}$。`,
                  ],
                ],
                [
                  ["Apply it to x", "用到 x 上"],
                  ["Parallel lines need the same multiple for $x$:", "平行线要求 $x$ 的系数也是这一倍数："],
                  [`k = ${r} \\cdot ${a} = ${answer}`],
                ],
              ],
              [
                `The constants $${c2}$ and $${r} \\cdot ${wrapped(c)} = ${r * c}$ differ, so the lines are parallel, not the same.`,
                `常数项 $${c2}$ 与 $${r} \\cdot ${wrapped(c)} = ${r * c}$ 不同，所以两条直线平行而不重合。`,
              ],
              [
                [a, `That copies the first $x$ coefficient; multiply it by $${r}$.`, `这是照抄了第一个 $x$ 的系数；还要乘以 $${r}$。`],
                [-answer, "That has the wrong sign.", "符号错了。"],
                [r, "That is the multiple itself, not the coefficient.", "这是倍数本身，不是系数。"],
                [b, "That is a $y$ coefficient.", "这是 $y$ 的系数。"],
              ],
              { solveFor: "k" },
            );
          }
          const answer = r * c;
          const system = `\\begin{cases} ${standard(a, b, c)} \\\\ ${standard(r * a, r * b, 0).replace("= 0", "= k")} \\end{cases}`;
          return valued(
            [
              `For what value of $k$ does this system have infinitely many solutions?$$${system}$$`,
              `当 $k$ 为何值时，这个方程组有无穷多个解？$$${system}$$`,
            ],
            answer,
            [
              [
                ["Find the multiple", "求倍数"],
                [`The coefficients of the second equation are $${r}$ times those of the first.`, `第二个方程的系数是第一个的 $${r}$ 倍。`],
              ],
              [
                ["Apply it to the constant", "用到常数项上"],
                ["One line needs the constant to be the same multiple:", "同一条直线要求常数项也是这一倍数："],
                [`k = ${r} \\cdot ${wrapped(c)} = ${answer}`],
              ],
            ],
            [
              `Dividing the second equation by $${r}$ gives back $${standard(a, b, c)}$.`,
              `把第二个方程除以 $${r}$，又得到 $${standard(a, b, c)}$。`,
            ],
            [
              [c, `That copies the first constant; multiply it by $${r}$.`, `这是照抄了第一个常数；还要乘以 $${r}$。`],
              [-answer, "That has the wrong sign.", "符号错了。"],
              [r, "That is the multiple itself, not the constant.", "这是倍数本身，不是常数。"],
              [c + r, "That adds the multiple instead of multiplying by it.", "这是加上了倍数，而不是乘以倍数。"],
            ],
            { solveFor: "k" },
          );
        },
        coefficientTable(["2", "3", "5"], ["k", "6", "7"]),
      ),
      lesson(
        "the-value-giving-infinitely-many-solutions",
        ["The value giving infinitely many solutions", "使解有无穷多个的值"],
        [
          [
            "A system has infinitely many solutions when one equation is a multiple of the other, constant included. Then both describe the same line. For $2x + 3y = 5$ and $6x + 9y = k$, the left side is $3$ times the first, so $k = 3 \\cdot 5 = 15$.",
            "一个方程是另一个方程的倍数（包括常数）时，方程组有无穷多个解，两个方程表示同一条直线。对 $2x + 3y = 5$ 和 $6x + 9y = k$，左边是第一个的 $3$ 倍，所以 $k = 3 \\cdot 5 = 15$。",
          ],
          ["$6x + 9y = 15$ divided by $3$ is $2x + 3y = 5$.", "$6x + 9y = 15$ 除以 $3$ 就是 $2x + 3y = 5$。"],
          [
            "Multiply the constant by the same multiple. Keeping $5$ gives parallel lines, with no solution.",
            "常数也要乘以同一倍数。保留 $5$ 会得到两条平行线，方程组无解。",
          ],
        ],
        (rng) => {
          const a = rng.int(2, 9);
          const b = rng.int(2, 9);
          const c = rng.int(2, 15);
          const m = rng.int(2, 6);
          return valued(
            [
              `For what value of $k$ does the system $${a}x + ${b}y = ${c}$ and $${a * m}x + ${b * m}y = k$ have infinitely many solutions?`,
              `$k$ 为何值时，方程组 $${a}x + ${b}y = ${c}$ 和 $${a * m}x + ${b * m}y = k$ 有无穷多个解？`,
            ],
            c * m,
            [
              [
                ["Find the multiple", "求倍数"],
                [
                  `$${a * m} = ${m} \\cdot ${a}$ and $${b * m} = ${m} \\cdot ${b}$, so the multiple is $${m}$.`,
                  `$${a * m} = ${m} \\cdot ${a}$，$${b * m} = ${m} \\cdot ${b}$，所以倍数是 $${m}$。`,
                ],
              ],
              [
                ["Apply it to the constant", "用到常数上"],
                ["The constant takes the same multiple:", "常数也乘以这个倍数："],
                [`k = ${m} \\cdot ${c} = ${c * m}`],
              ],
            ],
            [
              `Dividing $${a * m}x + ${b * m}y = ${c * m}$ by $${m}$ gives $${a}x + ${b}y = ${c}$, the same line.`,
              `把 $${a * m}x + ${b * m}y = ${c * m}$ 除以 $${m}$ 得 $${a}x + ${b}y = ${c}$，是同一条直线。`,
            ],
            [
              [c, "That copies the first constant, which gives parallel lines.", "这是照抄了第一个常数，会得到两条平行线。"],
              [c + m, "That adds the multiple instead of multiplying by it.", "这是加上了倍数，而不是乘以倍数。"],
              [m, "That is the multiple, not the constant.", "这是倍数，不是常数。"],
            ],
            { solveFor: "k" },
          );
        },
        coefficientTable(["2", "3", "5"], ["6", "9", "k"]),
      ),
    ],
  ),
  [
    "Two lines are given by $x + 2y = 4$ and $2x + 4y = 9$. Will they ever cross?",
    "两条直线是 $x + 2y = 4$ 和 $2x + 4y = 9$。它们会相交吗？",
  ],
  [
    "No: the coefficients double, but $2 \\cdot 4 = 8$ is not $9$, so the lines are parallel.",
    "不会：系数都扩大到 $2$ 倍，但 $2 \\cdot 4 = 8$ 不等于 $9$，所以两条直线平行。",
  ],
  [
    "tell the number of solutions from the coefficients, and choose values that give a wanted number.",
    "由系数判断解的个数，并选取数值使解的个数符合要求。",
  ],
);

/** walkWithUniqueExtreme draws a graph whose highest and lowest values each occur at one vertex. */
function walkWithUniqueExtreme(rng: Rng): readonly (readonly [number, number])[] {
  for (;;) {
    const pts = monotoneWalk(rng, false);
    const ys = pts.map((p) => p[1]);
    const hi = Math.max(...ys);
    const lo = Math.min(...ys);
    if (ys.filter((y) => y === hi).length === 1 && ys.filter((y) => y === lo).length === 1) return pts;
  }
}

/** identifyingMaximumAndMinimumValuesOfAFunction reads the greatest and least values of a function from its graph. */
export const identifyingMaximumAndMinimumValuesOfAFunction = withIntro(
  topic(
    "identifying-maximum-and-minimum-values-of-a-function",
    t("Identifying Maximum and Minimum Values of a Function", "判断函数的最大值与最小值"),
    t(
      "Read a function's maximum and minimum values from its graph, and tell the value of a function apart from the input where it occurs.",
      "由图象读出函数的最大值和最小值，并区分函数值与取得该值的输入。",
    ),
    ["graphs-of-functions"],
    ["8.F.B.5", "HSF.IF.B.4"],
    [
      lesson(
        "the-greatest-or-least-value",
        ["The greatest or least value", "最大值或最小值"],
        [
          [
            "The **maximum** of a function is its greatest output, and the **minimum** is its least. On a graph they are the $y$-coordinates of the highest and lowest points. So read across to the vertical axis, not down to the horizontal one.",
            "函数的**最大值**是它最大的输出，**最小值**是它最小的输出。在图象上，它们是最高点和最低点的纵坐标。所以要向纵轴读数，而不是向横轴读数。",
          ],
          [
            "On a graph through $(1, 2)$, $(3, 7)$ and $(5, 4)$, no point is higher than $(3, 7)$, so the maximum is $7$.",
            "在经过 $(1, 2)$、$(3, 7)$ 和 $(5, 4)$ 的图象上，没有点比 $(3, 7)$ 更高，所以最大值是 $7$。",
          ],
          [
            "Read the height, not the position. At the highest point $(3, 7)$ the maximum is $7$, not $3$.",
            "要读高度，不是位置。在最高点 $(3, 7)$，最大值是 $7$，不是 $3$。",
          ],
        ],
        (rng) => {
          const name = rng.pick(["f", "g", "h"]);
          const pts = walkWithUniqueExtreme(rng);
          const ys = pts.map((p) => p[1]);
          const wantMax = rng.bool();
          const answer = wantMax ? Math.max(...ys) : Math.min(...ys);
          const other = wantMax ? Math.min(...ys) : Math.max(...ys);
          const at = pts.find((p) => p[1] === answer)?.[0] as number;
          const last = pts[pts.length - 1]?.[1] as number;
          return valued(
            [
              `The whole graph of $${name}$ is shown. What is the ${wantMax ? "maximum" : "minimum"} value of $${name}$?`,
              `如图是 $${name}$ 的完整图象。$${name}$ 的${wantMax ? "最大值" : "最小值"}是多少？`,
            ],
            answer,
            [
              [
                [wantMax ? "Find the highest point" : "Find the lowest point", wantMax ? "找到最高点" : "找到最低点"],
                [
                  `The ${wantMax ? "highest" : "lowest"} point of the graph is $(${at}, ${answer})$.`,
                  `图象的${wantMax ? "最高点" : "最低点"}是 $(${at}, ${answer})$。`,
                ],
              ],
              [
                ["Read its height", "读出它的高度"],
                [`The value of $${name}$ there is the $y$-coordinate, $${answer}$.`, `$${name}$ 在该点的值是纵坐标 $${answer}$。`],
              ],
            ],
            [
              `Read the height of every corner and end of the graph from left to right: ${ys.map((y) => `$${y}$`).join(", ")}. The ${wantMax ? "greatest" : "least"} of them is $${answer}$.`,
              `从左到右读出图象每个拐点和端点的高度：${ys.map((y) => `$${y}$`).join("、")}。其中${wantMax ? "最大" : "最小"}的是 $${answer}$。`,
            ],
            [
              [at, "That is the input where it happens, not the value.", "这是取得该值的输入，不是函数值。"],
              [other, `That is the ${wantMax ? "minimum" : "maximum"} instead.`, `这是${wantMax ? "最小值" : "最大值"}。`],
              [last, "That is the value at the right end, which need not be the extreme one.", "这是最右端的值，它不一定是最值。"],
            ],
            { figure: graphFigure([{ pts: pts as [number, number][] }], name) },
          );
        },
        drawn(gradeDrawings5["identifying-maximum-and-minimum-values-of-a-function#the-greatest-or-least-value"]),
      ),
      lesson(
        "where-the-extreme-value-occurs",
        ["Where the extreme value occurs", "最值在何处取得"],
        [
          [
            "A question can ask for the input instead of the output: where does the function reach its maximum or minimum? Then the answer is the $x$-coordinate of that point. The value of the function and the place it occurs are two different numbers, and one point on the graph gives both.",
            "题目也可能问输入而不是输出：函数在哪里取得最大值或最小值？这时答案是该点的横坐标。函数值与取得它的位置是两个不同的数，图象上的同一个点同时给出它们。",
          ],
          ["The highest point $(3, 7)$ gives the place $x = 3$ and the value $7$.", "最高点 $(3, 7)$ 给出位置 $x = 3$ 和函数值 $7$。"],
          [
            "Answer what is asked. Where is an $x$-coordinate; the value is a $y$-coordinate.",
            "问什么答什么。在何处取得问的是横坐标；函数值是纵坐标。",
          ],
        ],
        (rng) => {
          const name = rng.pick(["f", "g", "h"]);
          const pts = walkWithUniqueExtreme(rng);
          const ys = pts.map((p) => p[1]);
          const wantMax = rng.bool();
          const value = wantMax ? Math.max(...ys) : Math.min(...ys);
          const otherValue = wantMax ? Math.min(...ys) : Math.max(...ys);
          const answer = pts.find((p) => p[1] === value)?.[0] as number;
          const otherAt = pts.find((p) => p[1] === otherValue)?.[0] as number;
          return valued(
            [
              `The whole graph of $${name}$ is shown. For what value of $x$ does $${name}$ reach its ${wantMax ? "maximum" : "minimum"}?`,
              `如图是 $${name}$ 的完整图象。当 $x$ 为何值时，$${name}$ 取得${wantMax ? "最大值" : "最小值"}？`,
            ],
            answer,
            [
              [
                [wantMax ? "Find the highest point" : "Find the lowest point", wantMax ? "找到最高点" : "找到最低点"],
                [
                  `The ${wantMax ? "highest" : "lowest"} point is $(${answer}, ${value})$.`,
                  `${wantMax ? "最高点" : "最低点"}是 $(${answer}, ${value})$。`,
                ],
              ],
              [
                ["Read its input", "读出它的输入"],
                [
                  `The question asks where, so the answer is the $x$-coordinate, $${answer}$.`,
                  `题目问的是在何处，所以答案是横坐标 $${answer}$。`,
                ],
              ],
            ],
            [
              `Read every corner and end of the graph from left to right: ${pts.map((q) => `$(${q[0]}, ${q[1]})$`).join(", ")}. The ${wantMax ? "greatest" : "least"} height, $${value}$, belongs to the point with $x = ${answer}$.`,
              `从左到右读出图象每个拐点和端点：${pts.map((q) => `$(${q[0]}, ${q[1]})$`).join("、")}。其中${wantMax ? "最大" : "最小"}的高度 $${value}$ 属于横坐标为 $${answer}$ 的点。`,
            ],
            [
              [value, "That is the value of the function, not where it happens.", "这是函数值，不是取得它的位置。"],
              [
                otherAt,
                `That is where the ${wantMax ? "minimum" : "maximum"} happens.`,
                `这是取得${wantMax ? "最小值" : "最大值"}的位置。`,
              ],
              [-answer, "That flips the sign of the input.", "这是把输入的符号弄反了。"],
            ],
            { solveFor: "x", figure: graphFigure([{ pts: pts as [number, number][] }], name) },
          );
        },
        drawn(gradeDrawings5["identifying-maximum-and-minimum-values-of-a-function#where-the-extreme-value-occurs"]),
      ),
      lesson(
        "the-extreme-value-on-an-interval",
        ["The extreme value on an interval", "区间上的最值"],
        [
          [
            "On a closed interval, a parabola's greatest and least values occur at the vertex, if it lies inside, or at the ends. So compare these few values rather than only using the vertex. For $f(x) = x^{2} + 1$ on $1 \\le x \\le 3$, the vertex $x = 0$ is outside, so the minimum is $f(1) = 2$.",
            "在闭区间上，抛物线的最大值和最小值出现在顶点（如果在区间内）或端点。所以要比较这几个值，不能只看顶点。对 $f(x) = x^{2} + 1$ 在 $1 \\le x \\le 3$ 上，顶点 $x = 0$ 在区间外，所以最小值是 $f(1) = 2$。",
          ],
          [
            "$f(3) = 10$ is larger, and the vertex value $1$ is never reached on the interval.",
            "$f(3) = 10$ 更大，而顶点的值 $1$ 在这个区间上取不到。",
          ],
          [
            "Check that the vertex lies in the interval before using it. Here $x = 0$ is outside, so $1$ is not the minimum.",
            "用顶点之前，先看它在不在区间里。这里 $x = 0$ 在区间外，所以 $1$ 不是最小值。",
          ],
        ],
        (rng) => {
          const h = rng.int(-4, 4);
          const k = rng.int(1, 9);
          const left = h + rng.int(1, 3);
          const right = left + rng.int(1, 4);
          const g = (x: number) => (x - h) ** 2 + k;
          const min = rng.bool();
          const [end, far] = min ? [left, right] : [right, left];
          const answer = g(end);
          return chosenMath(
            rng,
            [
              `What is the ${min ? "minimum" : "maximum"} value of $f(x) = ${shifted(h)}^{2} + ${k}$ on the interval $${left} \\le x \\le ${right}$?`,
              `$f(x) = ${shifted(h)}^{2} + ${k}$ 在区间 $${left} \\le x \\le ${right}$ 上的${min ? "最小值" : "最大值"}是多少？`,
            ],
            `${answer}`,
            [
              [`${g(far)}`, `That is the ${min ? "maximum" : "minimum"} on the interval.`, `这是区间上的${min ? "最大值" : "最小值"}。`],
              [`${k}`, "That is the vertex value, but the vertex lies outside the interval.", "这是顶点的值，但顶点在区间外。"],
              [`${g(right) + g(left)}`, "That adds the values at the two ends.", "这是把两个端点的值相加了。"],
            ],
            [
              [
                ["Locate the vertex", "找到顶点"],
                [
                  `The vertex is at $x = ${h}$, left of the interval, so $f$ rises from $x = ${left}$ to $x = ${right}$.`,
                  `顶点在 $x = ${h}$，在区间左侧，所以 $f$ 从 $x = ${left}$ 到 $x = ${right}$ 一直上升。`,
                ],
              ],
              [
                ["Use the end", "看端点"],
                [
                  `The ${min ? "least" : "greatest"} value is at the ${min ? "left" : "right"} end:`,
                  `${min ? "最小值" : "最大值"}在${min ? "左" : "右"}端点取得：`,
                ],
                [`f(${end}) = ${shifted(h, String(end))}^{2} + ${k} = ${answer}`],
              ],
            ],
            [
              `The other end gives $f(${far}) = ${g(far)}$, which is ${min ? "greater" : "less"}.`,
              `另一端给出 $f(${far}) = ${g(far)}$，${min ? "更大" : "更小"}。`,
            ],
          );
        },
        drawn(gradeDrawings5["identifying-maximum-and-minimum-values-of-a-function#the-extreme-value-on-an-interval"]),
      ),
    ],
  ),
  [
    "A graph shows a city's temperature over one day. When was it warmest, and how warm was it?",
    "一张图象显示一座城市一天里的气温。什么时候最暖和？最高气温是多少？",
  ],
  [
    "The highest point, say $(14, 31)$, gives the maximum $31$ degrees, reached at hour $14$.",
    "最高点，比如 $(14, 31)$，给出最高气温 $31$ 度，在第 $14$ 时取得。",
  ],
  [
    "read maximum and minimum values, where they occur, and the extremes on an interval.",
    "读出最大值和最小值、它们在何处取得，以及区间上的最值。",
  ],
);

const letters = ["x", "n", "t", "y", "m", "w"] as const;

/** solvingLinearEquationsContainingBinomials expands binomials on each side of an equation that is linear after all. */
export const solvingLinearEquationsContainingBinomials = topic(
  "solving-linear-equations-containing-binomials",
  t("Solving Linear Equations Containing Binomials", "解含二项式的线性方程"),
  t(
    "Solve equations whose sides contain multiples or products of binomials, expanding first so that the equation becomes linear.",
    "解两边含二项式的倍数或乘积的方程，先展开使方程化为线性方程。",
  ),
  ["two-step-equations", "applying-the-distributive-law-to-linear-expressions"],
  ["8.EE.C.7b", "HSA.REI.B.3"],
  [
    kp(
      "multiples-of-binomials-on-both-sides",
      t("Multiples of binomials on both sides", "两边都有二项式的倍数"),
      t(
        "A multiple of a binomial has to be distributed to both of its terms: $3(x + 2)$ is $3x + 6$, not $3x + 2$. After expanding each side, collect the variable terms on one side and the constants on the other, then divide. Expanding first is what turns an unfamiliar-looking equation into an ordinary linear one.",
        "二项式的倍数要分配到它的两项：$3(x + 2)$ 是 $3x + 6$，而不是 $3x + 2$。两边展开后，把含未知数的项移到一边，常数移到另一边，再相除。先展开，才能把看起来陌生的方程变成普通的线性方程。",
      ),
      (rng) => {
        const v = rng.pick(letters);
        const x = rng.int(-9, 9);
        const a = rng.int(2, 7);
        const c = rng.pick([2, 3, 4, 5, 6, 7, 8, 9].filter((n) => n !== a));
        const b = rng.pick([-8, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7]);
        const d = rng.pick([-7, -5, -4, -3, -2, -1, 1, 2, 3, 4, 6, 8]);
        const e = c * (x + d) - a * (x + b);
        const left = `${a}${factor(v, b)}${signed(e)}`;
        const right = `${c}${factor(v, d)}`;
        return numberProblem({
          prompt: t(`Solve for $${v}$: $${left} = ${right}$`, `解关于 $${v}$ 的方程：$${left} = ${right}$`),
          answer: x,
          solveFor: v,
          wrong: [Q.of(d - b - e, a - c), -x, x + 1, Q.of(c * d - a * b + e, a - c)],
          solution: t(
            `Distribute first, since each multiple applies to both terms of its binomial.${steps(`${a}${v}${signed(a * b + e)} = ${c}${v}${signed(c * d)}`, `${a - c === 1 ? "" : a - c === -1 ? "-" : a - c}${v} = ${c * d - a * b - e}`, `${v} = ${x}`)}`,
            `先分配，因为每个倍数都作用在二项式的两项上。${steps(`${a}${v}${signed(a * b + e)} = ${c}${v}${signed(c * d)}`, `${a - c === 1 ? "" : a - c === -1 ? "-" : a - c}${v} = ${c * d - a * b - e}`, `${v} = ${x}`)}`,
          ),
        });
      },
    ),
    kp(
      "products-of-binomials-whose-squares-cancel",
      t("Products of binomials whose squares cancel", "平方项相消的二项式乘积"),
      t(
        "An equation with a product of binomials can still be linear. Multiply out with each term of the first binomial times each term of the second, which gives a squared term. If the other side has the same squared term, subtracting it from both sides removes it, and what remains is a linear equation to solve as usual.",
        "含二项式乘积的方程仍可能是线性方程。用第一个二项式的每一项乘第二个二项式的每一项展开，会得到平方项。如果另一边有相同的平方项，两边同时减去它就消掉了，剩下的是普通的线性方程。",
      ),
      (rng) => {
        const v = rng.pick(letters);
        const x = rng.int(-8, 8);
        const a = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
        const b = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
        const p = rng.pick([-5, -3, -2, -1, 1, 2, 3, 4, 5, 7, 8].filter((n) => n !== a + b));
        const q = (x + a) * (x + b) - x * x - p * x;
        const slope = a + b - p;
        const rhs = `${v}^2${p === 1 ? ` + ${v}` : p === -1 ? ` - ${v}` : signed(p, v)}${signed(q)}`;
        const wrong = [-x, x + 1, Q.of(q + a * b, slope)];
        if (a + b + p !== 0) wrong.push(Q.of(q - a * b, a + b + p));
        return numberProblem({
          prompt: t(
            `Solve for $${v}$: $${factor(v, a)}${factor(v, b)} = ${rhs}$`,
            `解关于 $${v}$ 的方程：$${factor(v, a)}${factor(v, b)} = ${rhs}$`,
          ),
          answer: x,
          solveFor: v,
          wrong,
          solution: t(
            `Multiply out the left side, then subtract $${v}^2$ from both sides, because it appears on each side and removing it leaves a linear equation.${steps(`${v}^2${signed(a + b, v)}${signed(a * b)} = ${rhs}`, `${slope === 1 ? "" : slope === -1 ? "-" : slope}${v} = ${q - a * b}`, `${v} = ${x}`)}`,
            `展开左边，再从两边减去 $${v}^2$，因为两边都有它，消去后剩下线性方程。${steps(`${v}^2${signed(a + b, v)}${signed(a * b)} = ${rhs}`, `${slope === 1 ? "" : slope === -1 ? "-" : slope}${v} = ${q - a * b}`, `${v} = ${x}`)}`,
          ),
        });
      },
    ),
  ],
);

/** outlineGapTopics lists the topics that close the remaining outline gaps. */
export const outlineGapTopics: readonly TopicDef[] = [
  identifyingTheNumberOfSolutionsByInspection,
  identifyingMaximumAndMinimumValuesOfAFunction,
  solvingLinearEquationsContainingBinomials,
];
