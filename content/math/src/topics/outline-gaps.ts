import type { KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";

import { numberProblem, steps } from "../problems.ts";
import { graphFigure, monotoneWalk } from "./functions.ts";
import { pickChoice } from "./grade-4-fractions.ts";

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

/** identifyingTheNumberOfSolutionsByInspection tells how many solutions a linear system has without solving it. */
export const identifyingTheNumberOfSolutionsByInspection = topic(
  "identifying-the-number-of-solutions-to-a-system-by-inspection",
  t("Identifying the Number of Solutions to a System by Inspection", "通过观察判断方程组解的个数"),
  t(
    "Compare the coefficients of two linear equations to tell, without solving, whether the system has one solution, none or infinitely many.",
    "比较两个线性方程的系数，不必求解就判断方程组有一个解、无解还是有无穷多个解。",
  ),
  ["elimination-with-two-transformations"],
  ["8.EE.C.8b"],
  [
    kp(
      "comparing-coefficients",
      t("Comparing coefficients", "比较系数"),
      t(
        "Two lines meet once unless they are parallel. If one equation's $x$ and $y$ coefficients are not the same multiple of the other's, the slopes differ and there is one solution. If they are the same multiple but the constants are not, the lines are parallel with no solution. If everything is the same multiple, it is one line, with infinitely many solutions.",
        "两条直线除非平行，否则恰好相交一次。如果一个方程 $x$ 和 $y$ 的系数不是另一个方程系数的同一倍数，斜率就不同，方程组有一个解。如果是同一倍数而常数项不是，两条直线平行，方程组无解。如果全部是同一倍数，就是同一条直线，有无穷多个解。",
      ),
      (rng) => {
        const a = rng.pick([1, 2, 3, 4, 5]);
        const b = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const c = rng.int(-12, 12);
        const k = rng.pick([-3, -2, 2, 3, 4, 5]);
        const kind = rng.pick(["one", "none", "many"] as const);
        const a2 = k * a;
        const b2 = kind === "one" ? k * b + rng.pick([-2, -1, 1, 2]) : k * b;
        const c2 = kind === "none" ? k * c + rng.pick([-5, -3, -1, 1, 2, 4]) : kind === "many" ? k * c : rng.int(-20, 20);
        const others = (["one", "none", "many", "two"] as const).filter((x) => x !== kind).map((x) => howMany[x]);
        const line1 = standard(a, b, c);
        const line2 = standard(a2, b2 === 0 ? 1 : b2, c2);
        const b2Shown = b2 === 0 ? 1 : b2;
        const isOne = kind === "one" || b2Shown !== k * b;
        const correct = isOne ? howMany.one : howMany[kind];
        const wrong = isOne ? [howMany.none, howMany.many, howMany.two] : others;
        return pickChoice(
          rng,
          t(
            `Without solving, how many solutions does this system have?$$\\begin{cases} ${line1} \\\\ ${line2} \\end{cases}$$`,
            `不必求解，这个方程组有多少个解？$$\\begin{cases} ${line1} \\\\ ${line2} \\end{cases}$$`,
          ),
          correct,
          wrong,
          isOne
            ? t(
                `The $x$ coefficient of the second equation is $${k}$ times the first, but its $y$ coefficient is not, so the slopes differ and the lines cross exactly once.`,
                `第二个方程 $x$ 的系数是第一个的 $${k}$ 倍，而 $y$ 的系数不是，所以斜率不同，两条直线恰好相交一次。`,
              )
            : kind === "none"
              ? t(
                  `Both coefficients of the second equation are $${k}$ times those of the first, but $${k} \\cdot ${c} = ${k * c}$ is not its constant $${c2}$. The lines are parallel and distinct, so they never meet.`,
                  `第二个方程的两个系数都是第一个的 $${k}$ 倍，但 $${k} \\cdot ${c} = ${k * c}$ 不等于它的常数项 $${c2}$。两条直线平行且不重合，永不相交。`,
                )
              : t(
                  `Every number in the second equation is $${k}$ times the one in the first, so both equations describe the same line and each of its points is a solution.`,
                  `第二个方程的每个数都是第一个方程对应数的 $${k}$ 倍，所以两个方程表示同一条直线，线上每个点都是解。`,
                ),
        );
      },
    ),
    kp(
      "choosing-a-value-for-a-number-of-solutions",
      t("Choosing a value for a number of solutions", "选取数值使解的个数符合要求"),
      t(
        "The same comparison runs backward to find a missing number. For no solution, the $x$ and $y$ coefficients must share one multiple while the constants do not. For infinitely many, the constants must share that multiple as well. So find the multiple from the pair of coefficients that is fully known, then apply it to the unknown.",
        "同样的比较可以反过来求未知的数。要无解，$x$ 和 $y$ 的系数必须是同一倍数，而常数项不是。要有无穷多个解，常数项也必须是这一倍数。所以先由完全已知的一对系数求出倍数，再用到未知数上。",
      ),
      (rng) => {
        const a = rng.pick([1, 2, 3, 4, 5, 6]);
        const b = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const c = rng.int(2, 15) * rng.pick([-1, 1]);
        const r = rng.pick([-3, -2, 2, 3, 4, 5]);
        if (rng.bool()) {
          const answer = r * a;
          const c2 = r * c + rng.pick([-4, -2, -1, 1, 3, 5]);
          return numberProblem({
            prompt: t(
              `For what value of $k$ does this system have no solution?$$\\begin{cases} ${standard(a, b, c)} \\\\ kx ${r * b < 0 ? "-" : "+"} ${Math.abs(r * b)}y = ${c2} \\end{cases}$$`,
              `当 $k$ 为何值时，这个方程组无解？$$\\begin{cases} ${standard(a, b, c)} \\\\ kx ${r * b < 0 ? "-" : "+"} ${Math.abs(r * b)}y = ${c2} \\end{cases}$$`,
            ),
            answer,
            solveFor: "k",
            wrong: [a, -answer, r, answer + 1, b],
            solution: t(
              `The $y$ coefficients are both known, and $${r * b}$ is $${r}$ times $${b}$. Parallel lines need the $x$ coefficient to be the same multiple, so $k = ${r} \\cdot ${a} = ${answer}$. The constants, $${c2}$ and $${r} \\cdot ${c} = ${r * c}$, differ, so the lines are distinct.`,
              `两个 $y$ 系数都已知，$${r * b}$ 是 $${b}$ 的 $${r}$ 倍。平行线要求 $x$ 的系数也是这一倍数，所以 $k = ${r} \\cdot ${a} = ${answer}$。常数项 $${c2}$ 与 $${r} \\cdot ${c} = ${r * c}$ 不同，所以两条直线不重合。`,
            ),
          });
        }
        const answer = r * c;
        return numberProblem({
          prompt: t(
            `For what value of $k$ does this system have infinitely many solutions?$$\\begin{cases} ${standard(a, b, c)} \\\\ ${standard(r * a, r * b, 0).replace("= 0", "= k")} \\end{cases}$$`,
            `当 $k$ 为何值时，这个方程组有无穷多个解？$$\\begin{cases} ${standard(a, b, c)} \\\\ ${standard(r * a, r * b, 0).replace("= 0", "= k")} \\end{cases}$$`,
          ),
          answer,
          solveFor: "k",
          wrong: [c, -answer, r, answer + 1, c + r],
          solution: t(
            `The coefficients of the second equation are $${r}$ times those of the first. For the two to be one line, the constant must be the same multiple: $k = ${r} \\cdot ${c < 0 ? `(${c})` : c} = ${answer}$.`,
            `第二个方程的系数是第一个的 $${r}$ 倍。要成为同一条直线，常数项也必须是这一倍数：$k = ${r} \\cdot ${c < 0 ? `(${c})` : c} = ${answer}$。`,
          ),
        });
      },
    ),
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
export const identifyingMaximumAndMinimumValuesOfAFunction = topic(
  "identifying-maximum-and-minimum-values-of-a-function",
  t("Identifying Maximum and Minimum Values of a Function", "判断函数的最大值与最小值"),
  t(
    "Read a function's maximum and minimum values from its graph, and tell the value of a function apart from the input where it occurs.",
    "由图象读出函数的最大值和最小值，并区分函数值与取得该值的输入。",
  ),
  ["increasing-and-decreasing"],
  ["8.F.B.5", "HSF.IF.B.4"],
  [
    kp(
      "the-greatest-or-least-value",
      t("The greatest or least value", "最大值或最小值"),
      t(
        "The **maximum** of a function is its greatest output, and the **minimum** is its least. On a graph they are the $y$-coordinates of the highest and lowest points, so read across to the vertical axis, not down to the horizontal one. A maximum need not be at the right end, since where the graph is highest depends only on height.",
        "函数的**最大值**是它最大的输出，**最小值**是它最小的输出。在图象上，它们是最高点和最低点的纵坐标，所以要向纵轴读数，而不是向横轴读数。最大值不一定在最右端，因为图象最高的位置只取决于高度。",
      ),
      (rng) => {
        const name = rng.pick(["f", "g", "h"]);
        const pts = walkWithUniqueExtreme(rng);
        const ys = pts.map((p) => p[1]);
        const wantMax = rng.bool();
        const answer = wantMax ? Math.max(...ys) : Math.min(...ys);
        const other = wantMax ? Math.min(...ys) : Math.max(...ys);
        const at = pts.find((p) => p[1] === answer)?.[0] as number;
        return {
          ...numberProblem({
            prompt: t(
              `The whole graph of $${name}$ is shown. What is the ${wantMax ? "maximum" : "minimum"} value of $${name}$?`,
              `如图是 $${name}$ 的完整图象。$${name}$ 的${wantMax ? "最大值" : "最小值"}是多少？`,
            ),
            answer,
            wrong: [
              at === answer ? answer + 1 : at,
              other,
              pts[pts.length - 1]?.[1] === answer ? answer - 1 : (pts[pts.length - 1]?.[1] as number),
              answer + 2,
            ],
            solution: t(
              `The ${wantMax ? "highest" : "lowest"} point of the graph is $(${at}, ${answer})$. The value of the function there is its $y$-coordinate, $${answer}$; the input $${at}$ only says where it happens.`,
              `图象的${wantMax ? "最高点" : "最低点"}是 $(${at}, ${answer})$。函数在该点的值是纵坐标 $${answer}$；输入 $${at}$ 只说明它在何处取得。`,
            ),
          }),
          figure: graphFigure([{ pts: pts as [number, number][] }], name),
        };
      },
    ),
    kp(
      "where-the-extreme-value-occurs",
      t("Where the extreme value occurs", "最值在何处取得"),
      t(
        "A question can ask for the input instead of the output: where does the function reach its maximum or minimum? Then the answer is the $x$-coordinate of that point. Read the wording closely, since the value of the function and the place it occurs are two different numbers, and a graph gives both of them from the same point.",
        "题目也可能问输入而不是输出：函数在哪里取得最大值或最小值？这时答案是该点的横坐标。要仔细看清题目，因为函数值与取得它的位置是两个不同的数，图象上的同一个点同时给出它们。",
      ),
      (rng) => {
        const name = rng.pick(["f", "g", "h"]);
        const pts = walkWithUniqueExtreme(rng);
        const ys = pts.map((p) => p[1]);
        const wantMax = rng.bool();
        const value = wantMax ? Math.max(...ys) : Math.min(...ys);
        const otherValue = wantMax ? Math.min(...ys) : Math.max(...ys);
        const answer = pts.find((p) => p[1] === value)?.[0] as number;
        const otherAt = pts.find((p) => p[1] === otherValue)?.[0] as number;
        return {
          ...numberProblem({
            prompt: t(
              `The whole graph of $${name}$ is shown. For what value of $x$ does $${name}$ reach its ${wantMax ? "maximum" : "minimum"}?`,
              `如图是 $${name}$ 的完整图象。当 $x$ 为何值时，$${name}$ 取得${wantMax ? "最大值" : "最小值"}？`,
            ),
            answer,
            solveFor: "x",
            wrong: [value === answer ? answer + 1 : value, otherAt, -answer === answer ? answer - 1 : -answer, answer + 2],
            solution: t(
              `The ${wantMax ? "highest" : "lowest"} point is $(${answer}, ${value})$. The question asks where this happens, so the answer is its input, $${answer}$${value === answer ? "" : `, not the value $${value}$`}.`,
              `${wantMax ? "最高点" : "最低点"}是 $(${answer}, ${value})$。题目问的是在何处取得，所以答案是它的输入 $${answer}$${value === answer ? "" : `，而不是函数值 $${value}$`}。`,
            ),
          }),
          figure: graphFigure([{ pts: pts as [number, number][] }], name),
        };
      },
    ),
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
