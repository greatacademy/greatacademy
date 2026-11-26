import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, Q } from "@ga/subject-math";
import { probabilityDrawings1 } from "../explanation-drawings-probability-and-statistics-1.ts";
import { choiceProblem, isTerminating, lowestTerms, numberProblem, why, yesNo } from "../problems.ts";
import { reasoned } from "../wrong-reasons.ts";
import { walked } from "./calculus-i-differentiation.ts";

/** Mistake is a value a typical mistake produces, with what to say about it. */
type Mistake = ReturnType<typeof why>;

/** asQ reads a value as an exact number. */
const asQ = (v: Mistake["value"]) => (v instanceof Q ? v : Q.of(v));

/** distinct keeps the mistakes that differ from the answer, each value once. */
const distinct = (answer: Mistake["value"], ms: readonly Mistake[]): Mistake[] =>
  ms.filter((m, i) => !asQ(m.value).eq(asQ(answer)) && ms.findIndex((o) => asQ(o.value).eq(asQ(m.value))) === i);

/** PHI holds the standard normal cumulative probabilities the problems quote. */
const PHI = new Map<number, string>([
  [0, "0.5"],
  [0.5, "0.6915"],
  [1, "0.8413"],
  [1.5, "0.9332"],
  [2, "0.9772"],
  [2.5, "0.9938"],
]);

/** phi is the standard normal cumulative probability at a tabulated z. */
const phi = (z: number): Q => (z < 0 ? Q.one.sub(phi(-z)) : Q.parse(PHI.get(z) ?? "0.5"));

/** PHI_TABLE quotes the tabulated values for a prompt. */
const PHI_TABLE: Text = t(
  "$\\Phi(0.5) = 0.6915$, $\\Phi(1) = 0.8413$, $\\Phi(1.5) = 0.9332$, $\\Phi(2) = 0.9772$, $\\Phi(2.5) = 0.9938$",
  " $\\Phi(0.5) = 0.6915$，$\\Phi(1) = 0.8413$，$\\Phi(1.5) = 0.9332$，$\\Phi(2) = 0.9772$，$\\Phi(2.5) = 0.9938$",
);

/** par writes a value in parentheses when it is negative. */
const par = (v: Q): string => (v.sign() < 0 ? `(${dec(v)})` : dec(v));

/** shown writes a decimal, followed by its fraction when it is not a whole number. */
const shown = (v: Q): string => (v.isInteger() ? dec(v) : `${dec(v)} = ${v.toLatex()}`);

/** prodTex writes a product of two whole numbers, leaving out a factor of 1. */
const prodTex = (a: number, b: number): string => (a === 1 ? `${b}` : b === 1 ? `${a}` : `${a} \\cdot ${b}`);
/** qProdTex writes the product of two rationals, leaving out a factor of 1. */
const qProdTex = (a: Q, b: Q): string =>
  a.eq(Q.of(1)) ? b.toLatex() : b.eq(Q.of(1)) ? a.toLatex() : `${a.toLatex()} \\cdot ${b.toLatex()}`;

/** Topics for Unit 5: Combining Random Variables (new topics). */
export const probabilityAndStatisticsCombiningVariablesTopics: TopicDef[] = [
  // 5.17.2 The Joint CDF of Two Discrete Random Variables
  {
    id: "the-joint-cdf-of-two-discrete-random-variables",
    title: t("The Joint CDF of Two Discrete Random Variables", "两个离散型随机变量的联合累积分布函数"),
    summary: t(
      "The joint CDF $F_{X,Y}(x, y) = P(X \\le x, Y \\le y)$ sums the joint probabilities $p(u, v)$ over $u \\le x$ and $v \\le y$.",
      "联合累积分布函数 $F_{X,Y}(x, y) = P(X \\le x, Y \\le y)$ 是所有满足 $u \\le x$、$v \\le y$ 的联合概率 $p(u, v)$ 之和。",
    ),
    intro: t(
      "Suppose $P(0, 0) = \\frac{30}{100}$, $P(0, 1) = \\frac{25}{100}$, $P(1, 0) = \\frac{20}{100}$ and $P(1, 1) = \\frac{25}{100}$. The joint CDF $F(0, 1) = P(X \\le 0, Y \\le 1)$ adds the cells with $x \\le 0$ and $y \\le 1$: $\\frac{30 + 25}{100} = \\frac{55}{100}$.\n\nCheck: $F(1, 1)$ adds every cell and gives $\\frac{100}{100} = 1$, as a CDF must at the top corner.\n\nIn this lesson we evaluate the joint CDF of two discrete variables from a table, find the probability of other regions by adding their cells and find the probability of a rectangle from CDF values.",
      "设 $P(0, 0) = \\frac{30}{100}$，$P(0, 1) = \\frac{25}{100}$，$P(1, 0) = \\frac{20}{100}$，$P(1, 1) = \\frac{25}{100}$。联合分布函数 $F(0, 1) = P(X \\le 0, Y \\le 1)$ 把 $x \\le 0$ 且 $y \\le 1$ 的格相加：$\\frac{30 + 25}{100} = \\frac{55}{100}$。\n\n检验：$F(1, 1)$ 把所有格相加，得 $\\frac{100}{100} = 1$，这正是分布函数在右上角应有的值。\n\n本课我们由表计算两个离散变量的联合分布函数，把格相加求其他区域的概率，并由分布函数值求矩形的概率。",
    ),
    prerequisites: ["joint-distributions-for-discrete-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-joint-discrete-cdf",
        title: t("Evaluating the joint CDF from a probability mass table", "根据概率质量表计算联合累积分布函数值"),
        explanation: t(
          "The joint cumulative distribution function at a point is the total probability of the lower left corner of the table, where both variables are at most the given values. Sum $p(u, v)$ for all pairs $(u, v)$ with $u \\le x$ and $v \\le y$. With $P(0, 0) = \\frac{30}{100}$ and $P(0, 1) = \\frac{25}{100}$, $F(0, 1) = \\frac{55}{100}$.\n\n> **Watch out.** $F(0, 1)$ fixes $X \\le 0$ and lets $Y$ run up to $1$, so it adds a whole row of cells, not one cell, and not the cells with $Y \\le 0$.",
          "联合累积分布函数在一点的值是表格左下角部分的总概率，即两个变量都不超过给定值的部分。将所有满足 $u \\le x$ 且 $v \\le y$ 的点 $(u, v)$ 处的联合概率 $p(u, v)$ 求和。若 $P(0, 0) = \\frac{30}{100}$，$P(0, 1) = \\frac{25}{100}$，则 $F(0, 1) = \\frac{55}{100}$。\n\n> **注意。** $F(0, 1)$ 固定 $X \\le 0$，让 $Y$ 取到 $1$，所以要加整行的格，而不是一格，也不是 $Y \\le 0$ 的格。",
        ),
        generate: (rng: Rng): Problem => {
          const a = rng.int(1, 4);
          const b = rng.int(1, 4);
          const c = rng.int(1, 4);
          const d = rng.int(1, 4);
          const total = a + b + c + d;
          // Values: X in {0, 1}, Y in {0, 1}
          // p(0,0)=a/total, p(0,1)=b/total, p(1,0)=c/total, p(1,1)=d/total
          // We ask for F(0, 1) = p(0,0) + p(0,1) = (a + b) / total
          const sumVal = a + b;

          return numberProblem({
            prompt: t(
              `The joint probability mass function of $X \\in \\{0, 1\\}$ and $Y \\in \\{0, 1\\}$ is given by $P(0, 0) = \\frac{${a}}{${total}}$, $P(0, 1) = \\frac{${b}}{${total}}$, $P(1, 0) = \\frac{${c}}{${total}}$, and $P(1, 1) = \\frac{${d}}{${total}}$. Find the joint CDF value $F_{X,Y}(0, 1) = P(X \\le 0, Y \\le 1)$.`,
              `离散随机变量 $X \\in \\{0, 1\\}$ 与 $Y \\in \\{0, 1\\}$ 的联合概率分布律由 $P(0, 0) = \\frac{${a}}{${total}}$、$P(0, 1) = \\frac{${b}}{${total}}$、$P(1, 0) = \\frac{${c}}{${total}}$ 及 $P(1, 1) = \\frac{${d}}{${total}}$ 给出。求联合累积分布函数值 $F_{X,Y}(0, 1) = P(X \\le 0, Y \\le 1)$。`,
            ),
            answer: Q.of(sumVal, total),
            mistakes: distinct(Q.of(sumVal, total), [
              why(
                Q.of(b, total),
                "That is only the cell $P(0, 1)$; the CDF also counts $Y = 0$.",
                "那只是 $P(0, 1)$ 这一格；分布函数还要计入 $Y = 0$。",
              ),
              why(Q.of(a, total), "That is only the cell $P(0, 0)$, which is $F(0, 0)$.", "那只是 $P(0, 0)$ 这一格，即 $F(0, 0)$。"),
              why(Q.of(a + c, total), "That adds the cells with $Y = 0$, which is $F(1, 0)$.", "那是把 $Y = 0$ 的格相加，即 $F(1, 0)$。"),
            ]),
            solution: walked(
              [
                [
                  ["List the cells", "列出各格"],
                  t(
                    `$X \\le 0$ and $Y \\le 1$ hold at $(0, 0)$ and $(0, 1)$.`,
                    `满足 $X \\le 0$ 且 $Y \\le 1$ 的格是 $(0, 0)$ 与 $(0, 1)$。`,
                  ),
                ],
                [
                  ["Add them", "相加"],
                  t(
                    `$F_{X,Y}(0, 1) = \\frac{${a}}{${total}} + \\frac{${b}}{${total}} = \\frac{${sumVal}}{${total}}${lowestTerms(sumVal, total)}$.`,
                    `$F_{X,Y}(0, 1) = \\frac{${a}}{${total}} + \\frac{${b}}{${total}} = \\frac{${sumVal}}{${total}}${lowestTerms(sumVal, total)}$。`,
                  ),
                ],
              ],
              t(
                `The two cells left out, $(1, 0)$ and $(1, 1)$, add to $\\frac{${c + d}}{${total}}$, and $${sumVal} + ${c + d} = ${total}$.`,
                `剩下的两格 $(1, 0)$ 与 $(1, 1)$ 之和为 $\\frac{${c + d}}{${total}}$，而 $${sumVal} + ${c + d} = ${total}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "probabilities-of-regions-from-a-joint-table",
        figure: probabilityDrawings1["the-joint-cdf-of-two-discrete-random-variables#probabilities-of-regions-from-a-joint-table"],
        title: t("Probabilities of regions from a joint table", "由联合分布表求区域概率"),
        explanation: t(
          "Any event about $(X, Y)$ is a set of cells in the joint table, and its probability is the sum of those cells. For $P(X + Y \\le c)$, mark every cell with $x + y \\le c$; for $P(X < Y)$, the cells above the diagonal.\n\nThe joint CDF is the special case of a lower-left rectangle, $F(x, y) = P(X \\le x, Y \\le y)$. Other regions, such as $X + Y \\le 2$, are not rectangles, so they cannot be read from a single CDF value. In the figure, a table in twelfths, the cells with $x + y \\le 2$ add to $\\frac{8}{12}$. For $X$ and $Y$ taking the values $0$ to $50$, the event $X = Y$ is the $51$ diagonal cells.\n\n> **Watch out.** Add only the cells inside the event, over the table's own total: not the cells outside it, not a lower-left rectangle and not over the number of cells.",
          "关于 $(X, Y)$ 的任一事件都是联合分布表中的若干格，其概率等于这些格的概率之和。求 $P(X + Y \\le c)$ 时，标出所有 $x + y \\le c$ 的格；求 $P(X < Y)$ 时，取对角线上方的格。\n\n联合分布函数是左下矩形这一特殊情形：$F(x, y) = P(X \\le x, Y \\le y)$。其他区域如 $X + Y \\le 2$ 不是矩形，不能由单个分布函数值读出。图中的表以十二分之一为单位，满足 $x + y \\le 2$ 的格之和为 $\\frac{8}{12}$。若 $X$ 与 $Y$ 取 $0$ 到 $50$，事件 $X = Y$ 就是对角线上的 $51$ 格。\n\n> **注意。** 只加事件内的格，再除以表的总和：不是事件外的格，不是左下矩形，也不是除以格数。",
        ),
        generate: (rng: Rng): Problem => {
          const w = [0, 1, 2].map(() => [0, 1, 2].map(() => rng.int(1, 6)));
          const total = w.flat().reduce((s, v) => s + v, 0);
          const kind = rng.int(0, 2);
          const c = rng.int(1, 3);
          const inEvent = (x: number, y: number): boolean => (kind === 0 ? x + y <= c : kind === 1 ? x < y : x === y);
          let hit = 0;
          let miss = 0;
          for (let x = 0; x < 3; x++)
            for (let y = 0; y < 3; y++) {
              const v = w[x]?.[y] ?? 0;
              if (inEvent(x, y)) hit += v;
              else miss += v;
            }
          const ans = Q.of(hit, total);
          const ev = kind === 0 ? `X + Y \\le ${c}` : kind === 1 ? "X < Y" : "X = Y";
          const rect = (w[0]?.[0] ?? 0) + (w[0]?.[1] ?? 0) + (w[1]?.[0] ?? 0) + (w[1]?.[1] ?? 0);
          const rows = [0, 1, 2]
            .map((x) => [0, 1, 2].map((y) => `P(${x}, ${y}) = \\frac{${w[x]?.[y]}}{${total}}`).join(",\\ "))
            .join(";\\ ");
          return numberProblem({
            prompt: t(
              `$X$ and $Y$ take values in $\\{0, 1, 2\\}$ with joint probabilities $${rows}$. Find $P(${ev})$.`,
              `$X$ 与 $Y$ 取值于 $\\{0, 1, 2\\}$，联合概率为 $${rows}$。求 $P(${ev})$。`,
            ),
            answer: ans,
            mistakes: distinct(ans, [
              why(Q.of(miss, total), "That adds the cells outside the event, its complement.", "那是把事件外的格相加，得到的是对立事件。"),
              why(
                Q.of(rect, total),
                "That is the lower-left rectangle $F(1, 1)$, not this region.",
                "那是左下矩形 $F(1, 1)$，不是这个区域。",
              ),
              why(Q.of(hit, 9), "That divides by the number of cells instead of the table's total.", "那是除以格数，而不是表的总和。"),
            ]),
            solution: walked(
              [
                [
                  ["Mark the cells", "标出各格"],
                  t(`Pick the cells with $${ev}$; their weights add to $${hit}$.`, `选出满足 $${ev}$ 的格，它们的权重之和为 $${hit}$。`),
                ],
                [
                  ["Divide by the total", "除以总和"],
                  t(
                    `$P(${ev}) = \\frac{${hit}}{${total}}${lowestTerms(hit, total)}$.`,
                    `$P(${ev}) = \\frac{${hit}}{${total}}${lowestTerms(hit, total)}$。`,
                  ),
                ],
              ],
              t(
                `The other cells add to $${miss}$, and $${hit} + ${miss} = ${total}$.`,
                `其余各格之和为 $${miss}$，而 $${hit} + ${miss} = ${total}$。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 5.17.3 Marginal Distributions for Discrete Random Variables
  {
    id: "marginal-distributions-for-discrete-random-variables",
    title: t("Marginal Distributions for Discrete Random Variables", "离散型随机变量的边际分布"),
    summary: t(
      "The marginal PMF of $X$ sums the joint PMF over all values of $Y$: $p_X(x) = \\sum_y p(x, y)$.",
      "对 $Y$ 的所有取值求和得到 $X$ 的边际分布律：$p_X(x) = \\sum_y p(x, y)$。",
    ),
    intro: t(
      "If $X = 5$ occurs with $Y = 1, 2, 3$ with probabilities $\\frac{12}{200}$, $\\frac{30}{200}$ and $\\frac{18}{200}$, then $P(X = 5) = \\frac{12 + 30 + 18}{200} = \\frac{60}{200} = \\frac{3}{10}$, the total of that row.\n\nCheck: the three cells are the only ways $X = 5$ can happen, and each is counted once.\n\nIn this lesson we find marginal probabilities by adding a row or a column of a joint table, read a marginal from a grid of probabilities and use a marginal to find a mean.",
      "若 $X = 5$ 与 $Y = 1, 2, 3$ 同时发生的概率分别为 $\\frac{12}{200}$、$\\frac{30}{200}$、$\\frac{18}{200}$，则 $P(X = 5) = \\frac{12 + 30 + 18}{200} = \\frac{60}{200} = \\frac{3}{10}$，即这一行的总和。\n\n检验：这三格是 $X = 5$ 发生的全部方式，每格只计一次。\n\n本课我们把联合分布表的一行或一列相加求边缘概率，从概率网格中读出边缘分布，并用边缘分布求均值。",
    ),
    prerequisites: ["joint-distributions-for-discrete-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "calculating-discrete-marginal-pmf",
        title: t("Summing rows to compute marginal probabilities", "通过行或列求和计算边际概率"),
        explanation: t(
          "To get the distribution of one variable alone, add across the table over all values of the other variable. The marginal pmf $p_X(x) = \\sum_y p(x, y)$ sums the joint probabilities over all $y$. With $P(5, 1) = \\frac{12}{200}$, $P(5, 2) = \\frac{30}{200}$ and $P(5, 3) = \\frac{18}{200}$, $P(X = 5) = \\frac{60}{200}$.\n\n> **Watch out.** Add the cells of the row; do not stop at one cell, average them, or take the rest of the table.",
          "要得到单个变量的分布，就在表格中把另一个变量所有取值对应的概率加起来。边际分布律 $p_X(x) = \\sum_y p(x, y)$ 是对所有 $y$ 的联合概率求和。若 $P(5, 1) = \\frac{12}{200}$，$P(5, 2) = \\frac{30}{200}$，$P(5, 3) = \\frac{18}{200}$，则 $P(X = 5) = \\frac{60}{200}$。\n\n> **注意。** 要把这一行的格相加；不要只取一格，不要取平均，也不要取表的其余部分。",
        ),
        generate: (rng: Rng): Problem => {
          const p1 = rng.int(1, 5);
          const p2 = rng.int(1, 5);
          const p3 = rng.int(1, 5);
          const other = rng.int(5, 20);
          const total = p1 + p2 + p3 + other;
          const margX = p1 + p2 + p3;
          const xVal = rng.int(1, 5);

          return numberProblem({
            prompt: t(
              `For two discrete random variables $X$ and $Y$, the joint probabilities for $X = ${xVal}$ with $Y \\in \\{1, 2, 3\\}$ are $P(${xVal}, 1) = \\frac{${p1}}{${total}}$, $P(${xVal}, 2) = \\frac{${p2}}{${total}}$, and $P(${xVal}, 3) = \\frac{${p3}}{${total}}$, with $P(${xVal}, y) = 0$ for all other $y$. Find the marginal probability $P(X = ${xVal})$.`,
              `对于离散随机变量 $X$ 与 $Y$，$X = ${xVal}$ 且 $Y \\in \\{1, 2, 3\\}$ 时的联合概率分别为 $P(${xVal}, 1) = \\frac{${p1}}{${total}}$、$P(${xVal}, 2) = \\frac{${p2}}{${total}}$ 及 $P(${xVal}, 3) = \\frac{${p3}}{${total}}$，其余 $y$ 取值处概率均为 $0$。求边际概率 $P(X = ${xVal})$。`,
            ),
            answer: Q.of(margX, total),
            mistakes: distinct(Q.of(margX, total), [
              why(Q.of(p1, total), "That is only the cell with $Y = 1$.", "那只是 $Y = 1$ 的那一格。"),
              why(Q.of(margX, 3 * total), "That averages the three cells instead of adding them.", "那是把三格取平均，而不是相加。"),
              why(
                Q.of(other, total),
                "That is the probability of the rest of the table, where $X$ takes other values.",
                "那是表中其余部分的概率，即 $X$ 取其他值的概率。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Take the row", "取这一行"],
                  t(
                    `$X = ${xVal}$ happens with $Y = 1, 2, 3$, with weights $${p1}$, $${p2}$ and $${p3}$ out of $${total}$.`,
                    `$X = ${xVal}$ 与 $Y = 1, 2, 3$ 同时发生，权重分别为 $${p1}$、$${p2}$、$${p3}$，总数为 $${total}$。`,
                  ),
                ],
                [
                  ["Add the cells", "把各格相加"],
                  t(
                    `$P(X = ${xVal}) = \\frac{${p1} + ${p2} + ${p3}}{${total}} = \\frac{${margX}}{${total}}${lowestTerms(margX, total)}$.`,
                    `$P(X = ${xVal}) = \\frac{${p1} + ${p2} + ${p3}}{${total}} = \\frac{${margX}}{${total}}${lowestTerms(margX, total)}$。`,
                  ),
                ],
              ],
              t(
                `With the rest of the table, $\\frac{${margX}}{${total}} + \\frac{${other}}{${total}} = 1$.`,
                `加上表的其余部分，$\\frac{${margX}}{${total}} + \\frac{${other}}{${total}} = 1$。`,
              ),
            ),
          });
        },
      },
      {
        id: "a-marginal-from-a-two-way-table",
        title: t("A marginal from a two-way table", "由二维表求边缘分布"),
        explanation: t(
          "In a joint table with $X$ along the rows and $Y$ along the columns, the marginal of $X$ is the row totals and the marginal of $Y$ is the column totals:\n\n$$p_Y(y) = \\sum_x p(x, y).$$\n\nThe totals are written in the margins of the table, which is where the name comes from. Each marginal sums to $1$, a quick check on the arithmetic. If a column holds $\\frac{14}{60}$ and $\\frac{25}{60}$, its $Y$ value has probability $\\frac{39}{60}$.\n\n> **Watch out.** For $P(Y = y)$ add down the column of $y$, over every $x$; the row total belongs to $X$.",
          "在行表示 $X$、列表示 $Y$ 的联合分布表中，$X$ 的边缘分布是各行之和，$Y$ 的边缘分布是各列之和：\n\n$$p_Y(y) = \\sum_x p(x, y).$$\n\n这些和写在表的边缘上，“边缘分布”因此得名。每个边缘分布之和都为 $1$，可以用来检查计算。若某一列为 $\\frac{14}{60}$ 与 $\\frac{25}{60}$，则该 $Y$ 值的概率为 $\\frac{39}{60}$。\n\n> **注意。** 求 $P(Y = y)$ 时要沿 $y$ 那一列对所有 $x$ 相加；行和属于 $X$。",
        ),
        generate: (rng: Rng): Problem => {
          const w = [0, 1].map(() => [1, 2, 3].map(() => rng.int(1, 9)));
          const total = w.flat().reduce((s, v) => s + v, 0);
          const col = rng.int(0, 2);
          const colSum = (w[0]?.[col] ?? 0) + (w[1]?.[col] ?? 0);
          const row0 = (w[0] ?? []).reduce((s, v) => s + v, 0);
          const ans = Q.of(colSum, total);
          const cells = [0, 1]
            .map((x) => [1, 2, 3].map((y, j) => `P(X = ${x}, Y = ${y}) = \\frac{${w[x]?.[j]}}{${total}}`).join(",\\ "))
            .join(";\\ ");
          return numberProblem({
            prompt: t(
              `The joint distribution of $X \\in \\{0, 1\\}$ and $Y \\in \\{1, 2, 3\\}$ is $${cells}$. Find $P(Y = ${col + 1})$.`,
              `$X \\in \\{0, 1\\}$ 与 $Y \\in \\{1, 2, 3\\}$ 的联合分布为 $${cells}$。求 $P(Y = ${col + 1})$。`,
            ),
            answer: ans,
            mistakes: distinct(ans, [
              why(Q.of(w[0]?.[col] ?? 0, total), "That is only the cell with $X = 0$.", "那只是 $X = 0$ 的那一格。"),
              why(Q.of(row0, total), "That is the row total $P(X = 0)$, a marginal of $X$.", "那是行和 $P(X = 0)$，是 $X$ 的边缘概率。"),
              why(Q.of(colSum, total * 2), "That averages the column instead of adding it.", "那是对这一列取平均，而不是相加。"),
            ]),
            solution: walked(
              [
                [
                  ["Take the column", "取这一列"],
                  t(
                    `$Y = ${col + 1}$ occurs with $X = 0$ and $X = 1$, with weights $${w[0]?.[col]}$ and $${w[1]?.[col]}$.`,
                    `$Y = ${col + 1}$ 与 $X = 0$、$X = 1$ 同时发生，权重为 $${w[0]?.[col]}$ 与 $${w[1]?.[col]}$。`,
                  ),
                ],
                [
                  ["Add them", "相加"],
                  t(
                    `$P(Y = ${col + 1}) = \\frac{${w[0]?.[col]} + ${w[1]?.[col]}}{${total}} = \\frac{${colSum}}{${total}}${lowestTerms(colSum, total)}$.`,
                    `$P(Y = ${col + 1}) = \\frac{${w[0]?.[col]} + ${w[1]?.[col]}}{${total}} = \\frac{${colSum}}{${total}}${lowestTerms(colSum, total)}$。`,
                  ),
                ],
              ],
              t(
                `The three column totals add to $${total}$, so the marginal of $Y$ sums to $1$.`,
                `三个列和相加为 $${total}$，所以 $Y$ 的边缘分布之和为 $1$。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 5.17.4 Independence of Discrete Random Variables
  {
    id: "independence-of-discrete-random-variables",
    title: t("Independence of Discrete Random Variables", "离散型随机变量的独立性"),
    summary: t(
      "Discrete random variables $X$ and $Y$ are independent if and only if $p(x, y) = p_X(x)p_Y(y)$ for all $x$ and $y$.",
      "离散型随机变量 $X$ 与 $Y$ 相互独立，当且仅当对所有 $x$、$y$ 都有 $p(x, y) = p_X(x)p_Y(y)$。",
    ),
    intro: t(
      "If $X$ and $Y$ are independent with $P(X = 2) = \\frac{3}{10}$ and $P(Y = 3) = \\frac{7}{20}$, then $P(X = 2, Y = 3) = \\frac{3}{10} \\cdot \\frac{7}{20} = \\frac{21}{200}$.\n\nCheck: the joint probability $\\frac{21}{200}$ is smaller than both marginals, as the chance of two things together must be.\n\nIn this lesson we multiply marginals to get joint probabilities of independent variables, test a table for independence and find the probability of a union of independent events.",
      "若 $X$ 与 $Y$ 独立，且 $P(X = 2) = \\frac{3}{10}$，$P(Y = 3) = \\frac{7}{20}$，则 $P(X = 2, Y = 3) = \\frac{3}{10} \\cdot \\frac{7}{20} = \\frac{21}{200}$。\n\n检验：联合概率 $\\frac{21}{200}$ 比两个边缘概率都小，两件事同时发生的概率理应如此。\n\n本课我们把边缘概率相乘得到独立变量的联合概率，检验一张表是否独立，并求独立事件之并的概率。",
    ),
    prerequisites: ["marginal-distributions-for-discrete-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "discrete-independence-product-rule",
        title: t("Checking independence via joint and marginal products", "通过联合与边际概率乘积验证独立性"),
        explanation: t(
          "Two variables are independent only if every entry of the joint table equals the product of its row total and column total; one failure is enough to show dependence. Under independence, $P(X = x, Y = y) = P(X = x) P(Y = y)$. With $P(X = 2) = \\frac{3}{10}$ and $P(Y = 3) = \\frac{7}{20}$, the joint probability is $\\frac{21}{200}$.\n\n> **Watch out.** Multiply the fractions, numerators with numerators and denominators with denominators; adding them, or adding the tops and bottoms, does not give a joint probability.",
          "只有当联合表中每个元素都等于其行和与列和的乘积时，两个变量才相互独立；只要有一处不符，就说明它们不独立。在独立性下，$P(X = x, Y = y) = P(X = x) P(Y = y)$。若 $P(X = 2) = \\frac{3}{10}$，$P(Y = 3) = \\frac{7}{20}$，则联合概率为 $\\frac{21}{200}$。\n\n> **注意。** 要把两个分数相乘，分子乘分子，分母乘分母；把它们相加，或者分子分母各自相加，都得不到联合概率。",
        ),
        generate: (rng: Rng): Problem => {
          const numA = rng.int(1, 4);
          const denA = rng.int(5, 8);
          const numB = rng.int(1, 3);
          const denB = rng.int(4, 7);
          const jointNum = numA * numB;
          const jointDen = denA * denB;

          return numberProblem({
            prompt: t(
              `Let $X$ and $Y$ be independent discrete random variables with marginal probabilities $P(X = 2) = \\frac{${numA}}{${denA}}$ and $P(Y = 3) = \\frac{${numB}}{${denB}}$. What is the joint probability $P(X = 2, Y = 3)$?`,
              `设 $X$ 与 $Y$ 为相互独立的离散型随机变量，其边际概率分别为 $P(X = 2) = \\frac{${numA}}{${denA}}$ 与 $P(Y = 3) = \\frac{${numB}}{${denB}}$。求联合概率 $P(X = 2, Y = 3)$。`,
            ),
            answer: Q.of(jointNum, jointDen),
            mistakes: distinct(Q.of(jointNum, jointDen), [
              why(Q.of(numA + numB, denA + denB), "That adds the numerators and the denominators.", "那是把分子与分母分别相加。"),
              why(
                Q.of(numA * denB + numB * denA, jointDen),
                "That adds the two probabilities instead of multiplying them.",
                "那是把两个概率相加，而不是相乘。",
              ),
              why(
                Q.of(numA, denA),
                "That is only $P(X = 2)$; the joint event also needs $Y = 3$.",
                "那只是 $P(X = 2)$；联合事件还要求 $Y = 3$。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Use independence", "利用独立性"],
                  t(
                    `$P(X = 2, Y = 3) = P(X = 2) \\cdot P(Y = 3) = \\frac{${numA}}{${denA}} \\cdot \\frac{${numB}}{${denB}}$.`,
                    `$P(X = 2, Y = 3) = P(X = 2) \\cdot P(Y = 3) = \\frac{${numA}}{${denA}} \\cdot \\frac{${numB}}{${denB}}$。`,
                  ),
                ],
                [
                  ["Multiply", "相乘"],
                  t(
                    `The numerators multiply to $${jointNum}$ and the denominators to $${jointDen}$, giving $\\frac{${jointNum}}{${jointDen}}${lowestTerms(jointNum, jointDen)}$.`,
                    `分子相乘得 $${jointNum}$，分母相乘得 $${jointDen}$，结果为 $\\frac{${jointNum}}{${jointDen}}${lowestTerms(jointNum, jointDen)}$。`,
                  ),
                ],
              ],
              t(
                `Dividing back, $\\frac{${jointNum}}{${jointDen}} \\div \\frac{${numA}}{${denA}} = \\frac{${numB}}{${denB}} = P(Y = 3)$.`,
                `反过来相除，$\\frac{${jointNum}}{${jointDen}} \\div \\frac{${numA}}{${denA}} = \\frac{${numB}}{${denB}} = P(Y = 3)$。`,
              ),
            ),
          });
        },
      },
      {
        id: "checking-independence-in-a-table",
        title: t("Checking independence in a table", "在表中检验独立性"),
        explanation: t(
          "To check independence, compute both marginals and test **every** cell: $p(x, y) = p_X(x)p_Y(y)$. One failing cell is enough to show dependence. For a $2 \\times 2$ table it suffices to check one cell, because the margins then force the others.\n\nA table whose rows are proportional, such as $\\frac{1}{10}, \\frac{2}{10}$ over $\\frac{3}{10}, \\frac{6}{10}$, describes independent variables: knowing $X$ does not change the relative chances of the values of $Y$. A table in hundredths with rows $\\frac{20}{100}, \\frac{30}{100}$ and $\\frac{20}{100}, \\frac{30}{100}$ has $P(X = 0) = \\frac{50}{100}$ and $P(Y = 0) = \\frac{40}{100}$, whose product $\\frac{20}{100}$ is the cell $P(0, 0)$, so it is independent.\n\n> **Watch out.** Compare the cell with the product of its row and column totals, not with either total alone; for a $2 \\times 2$ table, $p_{00}p_{11} = p_{01}p_{10}$ says the same thing.",
          "检验独立性时，先求出两个边缘分布，再检验**每一格**是否满足 $p(x, y) = p_X(x)p_Y(y)$。只要有一格不满足就说明不独立。对 $2 \\times 2$ 表只需检验一格，因为边缘分布确定后其余各格随之确定。\n\n若表的各行成比例，例如 $\\frac{1}{10}, \\frac{2}{10}$ 与 $\\frac{3}{10}, \\frac{6}{10}$，则变量独立：知道 $X$ 不会改变 $Y$ 各取值的相对机会。以百分之一为单位、两行都是 $\\frac{20}{100}, \\frac{30}{100}$ 的表有 $P(X = 0) = \\frac{50}{100}$，$P(Y = 0) = \\frac{40}{100}$，乘积 $\\frac{20}{100}$ 正是 $P(0, 0)$，所以独立。\n\n> **注意。** 要把格的概率与它所在行和、列和的乘积比较，而不是与单个和比较；对 $2 \\times 2$ 表，$p_{00}p_{11} = p_{01}p_{10}$ 表达的是同一件事。",
        ),
        generate: (rng: Rng): Problem => {
          const a = rng.int(1, 4);
          const b = rng.int(1, 4);
          const c = rng.int(1, 4);
          const indep = rng.bool();
          const d = indep ? b * c : b * c + rng.pick([-1, 1, 2]) * a;
          const cells = [a * a, a * b, a * c, Math.max(1, d)];
          const total = cells.reduce((s, v) => s + v, 0);
          const [p00, p01, p10, p11] = cells as [number, number, number, number];
          const isIndep = p00 * p11 === p01 * p10;
          const r0 = p00 + p01;
          const c0 = p00 + p10;
          return reasoned(
            choiceProblem({
              prompt: t(
                `$X, Y \\in \\{0, 1\\}$ have joint probabilities $P(0, 0) = \\frac{${p00}}{${total}}$, $P(0, 1) = \\frac{${p01}}{${total}}$, $P(1, 0) = \\frac{${p10}}{${total}}$, $P(1, 1) = \\frac{${p11}}{${total}}$. Are $X$ and $Y$ independent?`,
                `$X, Y \\in \\{0, 1\\}$ 的联合概率为 $P(0, 0) = \\frac{${p00}}{${total}}$，$P(0, 1) = \\frac{${p01}}{${total}}$，$P(1, 0) = \\frac{${p10}}{${total}}$，$P(1, 1) = \\frac{${p11}}{${total}}$。$X$ 与 $Y$ 是否独立？`,
              ),
              options: yesNo,
              correct: isIndep ? 0 : 1,
              solution: walked(
                [
                  [
                    ["Find the marginals", "求边缘概率"],
                    t(
                      `$P(X = 0) = \\frac{${r0}}{${total}}$ and $P(Y = 0) = \\frac{${c0}}{${total}}$, whose product is $${Q.of(r0 * c0, total * total).toLatex()}$.`,
                      `$P(X = 0) = \\frac{${r0}}{${total}}$，$P(Y = 0) = \\frac{${c0}}{${total}}$，乘积为 $${Q.of(r0 * c0, total * total).toLatex()}$。`,
                    ),
                  ],
                  [
                    ["Compare with the cell", "与该格比较"],
                    t(
                      `$P(0, 0) = ${Q.of(p00, total).toLatex()}$. ${isIndep ? "They agree (and in a $2 \\times 2$ table one cell decides), so $X$ and $Y$ are independent." : "They differ, so $X$ and $Y$ are not independent."}`,
                      `$P(0, 0) = ${Q.of(p00, total).toLatex()}$。${isIndep ? "两者相等（$2 \\times 2$ 表中一格即可判定），所以 $X$ 与 $Y$ 独立。" : "两者不等，所以 $X$ 与 $Y$ 不独立。"}`,
                    ),
                  ],
                ],
                t(
                  `In weights, the cross products $p_{00}p_{11} = ${p00 * p11}$ and $p_{01}p_{10} = ${p01 * p10}$ are ${isIndep ? "equal" : "unequal"}.`,
                  `按权重计算，交叉乘积 $p_{00}p_{11} = ${p00 * p11}$ 与 $p_{01}p_{10} = ${p01 * p10}$ ${isIndep ? "相等" : "不等"}。`,
                ),
              ),
            }),
            [
              [
                yesNo[0]!.en,
                "The cell $P(0, 0)$ is not the product of its row and column totals.",
                "$P(0, 0)$ 不等于它所在行和与列和的乘积。",
              ],
              [
                yesNo[1]!.en,
                "The cell $P(0, 0)$ equals the product of its margins, and in a $2 \\times 2$ table that one cell decides.",
                "$P(0, 0)$ 等于其边缘概率之积，而在 $2 \\times 2$ 表中这一格即可判定。",
              ],
            ],
          );
        },
      },
    ],
  },

  // 5.17.5 Conditional Distributions for Discrete Random Variables
  {
    id: "conditional-distributions-for-discrete-random-variables",
    title: t("Conditional Distributions for Discrete Random Variables", "离散型随机变量的条件分布"),
    summary: t(
      "The conditional PMF of $Y$ given $X = x$ is $p_{Y \\mid X}(y \\mid x) = \\frac{p(x, y)}{p_X(x)}$ wherever $p_X(x) > 0$.",
      "在 $X = x$ 的条件下，$Y$ 的条件分布律为 $p_{Y \\mid X}(y \\mid x) = \\frac{p(x, y)}{p_X(x)}$（要求 $p_X(x) > 0$）。",
    ),
    intro: t(
      "If $P(X = 1) = \\frac{40}{100}$ and $P(X = 1, Y = 2) = \\frac{10}{100}$, then $P(Y = 2 \\mid X = 1) = \\frac{10/100}{40/100} = \\frac{10}{40} = \\frac{1}{4}$: a quarter of the cases with $X = 1$ have $Y = 2$.\n\nCheck: $\\frac{1}{4} \\cdot \\frac{40}{100} = \\frac{10}{100}$ gives back the joint probability.\n\nIn this lesson we compute conditional probabilities by dividing a joint probability by a marginal, read them from a row of a table or a grid of probabilities and find a conditional mean from joint probabilities.",
      "若 $P(X = 1) = \\frac{40}{100}$，$P(X = 1, Y = 2) = \\frac{10}{100}$，则 $P(Y = 2 \\mid X = 1) = \\frac{10/100}{40/100} = \\frac{10}{40} = \\frac{1}{4}$：在 $X = 1$ 的情形中，四分之一有 $Y = 2$。\n\n检验：$\\frac{1}{4} \\cdot \\frac{40}{100} = \\frac{10}{100}$，还原了联合概率。\n\n本课我们用联合概率除以边缘概率求条件概率，从表的一行或概率网格中读出条件概率，并由联合概率求条件均值。",
    ),
    prerequisites: ["marginal-distributions-for-discrete-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-discrete-conditional-pmf",
        title: t("Computing conditional PMF values", "计算条件概率分布律取值"),
        explanation: t(
          "A conditional probability restricts attention to one row or column of the table and rescales it by dividing by that row or column total. $P(Y = y \\mid X = x) = \\frac{P(X = x, Y = y)}{P(X = x)}$. With $P(X = 1) = \\frac{40}{100}$ and $P(X = 1, Y = 2) = \\frac{10}{100}$, $P(Y = 2 \\mid X = 1) = \\frac{10}{40}$.\n\n> **Watch out.** Divide the joint probability by the marginal of the condition, not the other way round; the joint probability alone is not conditional.",
          "条件概率只关注表格中的一行或一列，并除以这一行或这一列的总和来重新缩放。$P(Y = y \\mid X = x) = \\frac{P(X = x, Y = y)}{P(X = x)}$。若 $P(X = 1) = \\frac{40}{100}$，$P(X = 1, Y = 2) = \\frac{10}{100}$，则 $P(Y = 2 \\mid X = 1) = \\frac{10}{40}$。\n\n> **注意。** 要用联合概率除以条件的边缘概率，不能反过来；联合概率本身不是条件概率。",
        ),
        generate: (rng: Rng): Problem => {
          const jointVal = rng.int(1, 6);
          const otherVal = rng.int(1, 6);
          const margVal = jointVal + otherVal;
          const denom = rng.int(15, 40);

          return numberProblem({
            prompt: t(
              `Suppose $P(X = 1) = \\frac{${margVal}}{${denom}}$ and the joint probability $P(X = 1, Y = 2) = \\frac{${jointVal}}{${denom}}$. Find the conditional probability $P(Y = 2 \\mid X = 1)$.`,
              `设 $P(X = 1) = \\frac{${margVal}}{${denom}}$，且联合概率 $P(X = 1, Y = 2) = \\frac{${jointVal}}{${denom}}$。求条件概率 $P(Y = 2 \\mid X = 1)$。`,
            ),
            answer: Q.of(jointVal, margVal),
            mistakes: distinct(Q.of(jointVal, margVal), [
              why(
                Q.of(jointVal, denom),
                "That is the joint probability, before dividing by $P(X = 1)$.",
                "那是联合概率，还没有除以 $P(X = 1)$。",
              ),
              why(
                Q.of(margVal, jointVal),
                "That divides the marginal by the joint probability, upside down.",
                "那是用边缘概率除以联合概率，颠倒了。",
              ),
              why(
                Q.of(jointVal * margVal, denom * denom),
                "That multiplies by $P(X = 1)$ instead of dividing.",
                "那是乘以 $P(X = 1)$，而不是除以它。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Write the definition", "写出定义"],
                  t(
                    `$P(Y = 2 \\mid X = 1) = \\frac{P(X = 1, Y = 2)}{P(X = 1)} = \\frac{${jointVal}/${denom}}{${margVal}/${denom}}$.`,
                    `$P(Y = 2 \\mid X = 1) = \\frac{P(X = 1, Y = 2)}{P(X = 1)} = \\frac{${jointVal}/${denom}}{${margVal}/${denom}}$。`,
                  ),
                ],
                [
                  ["Cancel the common denominator", "约去公分母"],
                  t(
                    `$\\frac{${jointVal}}{${margVal}}${lowestTerms(jointVal, margVal)}$.`,
                    `$\\frac{${jointVal}}{${margVal}}${lowestTerms(jointVal, margVal)}$。`,
                  ),
                ],
              ],
              t(
                `Multiplying back, $\\frac{${jointVal}}{${margVal}} \\cdot \\frac{${margVal}}{${denom}} = \\frac{${jointVal}}{${denom}}$, the joint probability.`,
                `乘回去，$\\frac{${jointVal}}{${margVal}} \\cdot \\frac{${margVal}}{${denom}} = \\frac{${jointVal}}{${denom}}$，正是联合概率。`,
              ),
            ),
          });
        },
      },
      {
        id: "conditional-probabilities-from-a-table",
        title: t("Conditional probabilities from a table", "由联合分布表求条件概率"),
        explanation: t(
          "Conditioning on $X = x$ keeps only that row of the table and rescales it to sum to $1$:\n\n$$P(Y = y \\mid X = x) = \\frac{p(x, y)}{\\sum_{y'} p(x, y')}.$$\n\nWith weights, the common denominator of the table cancels: if the row for $X = 1$ has weights $2, 5, 3$, then $P(Y = 2 \\mid X = 1) = \\frac{5}{10}$, whatever the table's total. A row with weights $20, 45, 35$ gives $P(Y = 2 \\mid X = 1) = \\frac{45}{100}$.\n\n> **Watch out.** Divide by the row of the condition $X = x$, not by the whole table and not by the column of $y$, which would condition on $Y$.",
          "以 $X = x$ 为条件，只保留表中这一行，并重新缩放使其和为 $1$：\n\n$$P(Y = y \\mid X = x) = \\frac{p(x, y)}{\\sum_{y'} p(x, y')}.$$\n\n用权重表示时，表的公分母会约去：若 $X = 1$ 那一行的权重为 $2, 5, 3$，则无论表的总和是多少，$P(Y = 2 \\mid X = 1) = \\frac{5}{10}$。权重为 $20, 45, 35$ 的一行给出 $P(Y = 2 \\mid X = 1) = \\frac{45}{100}$。\n\n> **注意。** 要除以条件 $X = x$ 所在行的和，不是整张表的总和，也不是 $y$ 所在列的和，那是以 $Y$ 为条件。",
        ),
        generate: (rng: Rng): Problem => {
          const w = [0, 1].map(() => [1, 2, 3].map(() => rng.int(1, 9)));
          const total = w.flat().reduce((s, v) => s + v, 0);
          const x = rng.int(0, 1);
          const j = rng.int(0, 2);
          const row = (w[x] ?? []).reduce((s, v) => s + v, 0);
          const cell = w[x]?.[j] ?? 0;
          const col = (w[0]?.[j] ?? 0) + (w[1]?.[j] ?? 0);
          const ans = Q.of(cell, row);
          const cells = [0, 1]
            .map((xx) => [1, 2, 3].map((y, jj) => `P(${xx}, ${y}) = \\frac{${w[xx]?.[jj]}}{${total}}`).join(",\\ "))
            .join(";\\ ");
          return numberProblem({
            prompt: t(
              `The joint distribution of $X \\in \\{0, 1\\}$ and $Y \\in \\{1, 2, 3\\}$ is $${cells}$. Find $P(Y = ${j + 1} \\mid X = ${x})$.`,
              `$X \\in \\{0, 1\\}$ 与 $Y \\in \\{1, 2, 3\\}$ 的联合分布为 $${cells}$。求 $P(Y = ${j + 1} \\mid X = ${x})$。`,
            ),
            answer: ans,
            mistakes: distinct(ans, [
              why(Q.of(cell, total), "That is the joint probability, over the whole table.", "那是联合概率，除以的是整张表的总和。"),
              why(
                Q.of(cell, col),
                "That divides by the column, which conditions on $Y$ instead of $X$.",
                "那是除以列和，相当于以 $Y$ 为条件，而不是以 $X$ 为条件。",
              ),
              why(Q.of(row, total), "That is $P(X = x)$, the probability of the condition itself.", "那是 $P(X = x)$，即条件本身的概率。"),
            ]),
            solution: walked(
              [
                [
                  ["Keep the row", "保留这一行"],
                  t(
                    `The row $X = ${x}$ has weights $${(w[x] ?? []).join(", ")}$ summing to $${row}$.`,
                    `$X = ${x}$ 这一行的权重为 $${(w[x] ?? []).join(", ")}$，和为 $${row}$。`,
                  ),
                ],
                [
                  ["Rescale", "重新缩放"],
                  t(
                    `$P(Y = ${j + 1} \\mid X = ${x}) = \\frac{${cell}}{${row}}${lowestTerms(cell, row)}$.`,
                    `$P(Y = ${j + 1} \\mid X = ${x}) = \\frac{${cell}}{${row}}${lowestTerms(cell, row)}$。`,
                  ),
                ],
              ],
              t(
                `The conditional probabilities of the row, $\\frac{${(w[x] ?? []).join("}{" + row + "}, \\frac{")}}{${row}}$, add to $1$.`,
                `这一行的条件概率 $\\frac{${(w[x] ?? []).join("}{" + row + "}, \\frac{")}}{${row}}$ 之和为 $1$。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 5.17.6 The Trinomial Distribution
  {
    id: "the-trinomial-distribution",
    title: t("The Trinomial Distribution", "三项分布"),
    summary: t(
      "The trinomial distribution counts three mutually exclusive outcomes in $n$ independent trials: $P(X = x, Y = y) = \\frac{n!}{x!\\,y!\\,z!} p_1^x p_2^y p_3^z$ with $z = n - x - y$.",
      "三项分布描述 $n$ 次独立试验中三种互斥结果的次数：$P(X = x, Y = y) = \\frac{n!}{x!\\,y!\\,z!} p_1^x p_2^y p_3^z$，其中 $z = n - x - y$。",
    ),
    intro: t(
      "Four matches, each won, drawn or lost with probabilities $\\frac{1}{2}$, $\\frac{1}{3}$ and $\\frac{1}{6}$, end in $2$ wins, $1$ draw and $1$ loss in $\\frac{4!}{2!\\,1!\\,1!} = 12$ orders, each with probability $\\frac{1}{4} \\cdot \\frac{1}{3} \\cdot \\frac{1}{6} = \\frac{1}{72}$, so the probability is $\\frac{12}{72} = \\frac{1}{6}$.\n\nCheck: listing the orders, the loss can go in $4$ places and the draw in $3$ of those left, and $4 \\cdot 3 = 12$.\n\nIn this lesson we count arrangements with the trinomial coefficient, find trinomial probabilities and find a conditional mean in a trinomial model.",
      "四场比赛，每场胜、平、负的概率为 $\\frac{1}{2}$、$\\frac{1}{3}$、$\\frac{1}{6}$，$2$ 胜 $1$ 平 $1$ 负共有 $\\frac{4!}{2!\\,1!\\,1!} = 12$ 种顺序，每种的概率为 $\\frac{1}{4} \\cdot \\frac{1}{3} \\cdot \\frac{1}{6} = \\frac{1}{72}$，所以概率为 $\\frac{12}{72} = \\frac{1}{6}$。\n\n检验：逐一列出顺序，负场可放在 $4$ 个位置，平场可放在剩下的 $3$ 个位置之一，$4 \\cdot 3 = 12$。\n\n本课我们用三项式系数计数排列，求三项分布的概率，并在三项模型中求条件均值。",
    ),
    prerequisites: ["the-binomial-distribution", "joint-distributions-for-discrete-random-variables"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "trinomial-coefficient-evaluation",
        title: t("Computing the trinomial coefficient n! / (x! y! z!)", "计算三项式系数 n! / (x! y! z!)"),
        explanation: t(
          "Arrange all the items in order, then divide by the orderings within each group, since items in the same group are not distinguished. The number of ways to divide $n$ items into groups of sizes $x, y, z$ is $\\frac{n!}{x!\\,y!\\,z!}$. For $15$ items in three groups of $5$, it is $\\frac{15!}{5!\\,5!\\,5!} = 756756$.\n\n> **Watch out.** Divide by all three factorials, not just one, and do not stop at $n!$; the product $xyz$ is not a count of arrangements.",
          "先把所有物品排成一列，再除以每组内部的排列数，因为同一组中的物品不加区分。将 $n$ 个不同物品分成大小为 $x, y, z$ 的三组的方法数为多项式系数 $\\frac{n!}{x!\\,y!\\,z!}$。把 $15$ 个物品分成三组各 $5$ 个，方法数为 $\\frac{15!}{5!\\,5!\\,5!} = 756756$。\n\n> **注意。** 要除以全部三个阶乘，而不是只除以一个，也不能停在 $n!$；乘积 $xyz$ 不是排列数。",
        ),
        generate: (rng: Rng): Problem => {
          const x = rng.int(1, 4);
          const y = rng.int(1, 4);
          const z = rng.int(1, 4);
          const n = x + y + z;

          const fact = (k: number): number => {
            let res = 1;
            for (let i = 2; i <= k; i++) res *= i;
            return res;
          };
          const coeff = fact(n) / (fact(x) * fact(y) * fact(z));

          return numberProblem({
            prompt: t(
              `Find the multinomial coefficient for $n = ${n}$ trials with counts $x = ${x}$, $y = ${y}$, and $z = ${z}$: $\\frac{${n}!}{${x}! \\, ${y}! \\, ${z}!}$.`,
              `求 $n = ${n}$ 次试验中分别取得频数 $x = ${x}$、$y = ${y}$ 和 $z = ${z}$ 的多项式系数：$\\frac{${n}!}{${x}! \\, ${y}! \\, ${z}!}$。`,
            ),
            answer: coeff,
            mistakes: distinct(coeff, [
              why(fact(n), "That is $n!$, before dividing by the orderings within each group.", "那是 $n!$，还没有除以各组内部的排列数。"),
              why(fact(n) / fact(x), "That divides by only one of the three factorials.", "那只除以了三个阶乘中的一个。"),
              why(x * y * z, "That multiplies the group sizes, which does not count arrangements.", "那是把各组大小相乘，并不是排列数。"),
            ]),
            solution: walked(
              [
                [
                  ["Evaluate the factorials", "计算阶乘"],
                  t(
                    `$${n}! = ${fact(n)}$ and $${x}! \\, ${y}! \\, ${z}! = ${fact(x) * fact(y) * fact(z)}$.`,
                    `$${n}! = ${fact(n)}$，$${x}! \\, ${y}! \\, ${z}! = ${fact(x) * fact(y) * fact(z)}$。`,
                  ),
                ],
                [
                  ["Divide", "相除"],
                  t(
                    `$\\frac{${fact(n)}}{${fact(x) * fact(y) * fact(z)}} = ${coeff}$.`,
                    `$\\frac{${fact(n)}}{${fact(x) * fact(y) * fact(z)}} = ${coeff}$。`,
                  ),
                ],
              ],
              t(
                `Choosing the group of $${x}$ first and then the group of $${y}$ gives $\\binom{${n}}{${x}}\\binom{${n - x}}{${y}} = ${coeff}$ as well.`,
                `先选 $${x}$ 个的一组，再选 $${y}$ 个的一组，也得到 $\\binom{${n}}{${x}}\\binom{${n - x}}{${y}} = ${coeff}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "a-trinomial-probability",
        title: t("A trinomial probability", "三项分布的概率"),
        explanation: t(
          "Multiply the number of arrangements by the probability of any one arrangement:\n\n$$P(X = x, Y = y) = \\frac{n!}{x!\\,y!\\,z!}p_1^{x}p_2^{y}p_3^{z}, \\qquad z = n - x - y.$$\n\nFor a match that a team wins, draws or loses with probabilities $\\frac{1}{2}, \\frac{1}{3}, \\frac{1}{6}$, the chance of $2$ wins, $1$ draw and $1$ loss in $4$ matches is $\\frac{4!}{2!\\,1!\\,1!} \\cdot \\frac{1}{4} \\cdot \\frac{1}{3} \\cdot \\frac{1}{6} = \\frac{12}{72} = \\frac{1}{6}$. With $10$ trials and three outcomes of probability $\\frac{1}{3}$ each, $4$, $3$ and $3$ of them come with probability $\\frac{10!}{4!\\,3!\\,3!} \\cdot \\left(\\frac{1}{3}\\right)^{10} = \\frac{4200}{59049}$.\n\n> **Watch out.** Both factors are needed: the probability of one order alone forgets the other orders, and the count alone is not a probability.",
          "用排列数乘以任一种排列的概率：\n\n$$P(X = x, Y = y) = \\frac{n!}{x!\\,y!\\,z!}p_1^{x}p_2^{y}p_3^{z}, \\qquad z = n - x - y.$$\n\n例如某队每场胜、平、负的概率为 $\\frac{1}{2}, \\frac{1}{3}, \\frac{1}{6}$，$4$ 场中恰好 $2$ 胜 $1$ 平 $1$ 负的概率为 $\\frac{4!}{2!\\,1!\\,1!} \\cdot \\frac{1}{4} \\cdot \\frac{1}{3} \\cdot \\frac{1}{6} = \\frac{12}{72} = \\frac{1}{6}$。若进行 $10$ 次试验，三种结果的概率都是 $\\frac{1}{3}$，则分别出现 $4$、$3$、$3$ 次的概率为 $\\frac{10!}{4!\\,3!\\,3!} \\cdot \\left(\\frac{1}{3}\\right)^{10} = \\frac{4200}{59049}$。\n\n> **注意。** 两个因子都不能少：只取一种顺序的概率会漏掉其他顺序，而只有排列数也不是概率。",
        ),
        generate: (rng: Rng): Problem => {
          const [p1, p2, p3] = rng.pick([
            [Q.of(1, 2), Q.of(1, 3), Q.of(1, 6)],
            [Q.of(1, 2), Q.of(1, 4), Q.of(1, 4)],
            [Q.of(3, 5), Q.of(1, 5), Q.of(1, 5)],
            [Q.of(1, 3), Q.of(1, 3), Q.of(1, 3)],
            [Q.of(2, 5), Q.of(2, 5), Q.of(1, 5)],
          ] as [Q, Q, Q][]);
          const n = rng.int(3, 6);
          const x = rng.int(0, n);
          const y = rng.int(0, n - x);
          const z = n - x - y;
          const fact = (k: number): number => (k <= 1 ? 1 : k * fact(k - 1));
          const coef = fact(n) / (fact(x) * fact(y) * fact(z));
          const prod = p1.pow(x).mul(p2.pow(y)).mul(p3.pow(z));
          const ans = Q.of(coef).mul(prod);
          const pw = (p: Q, k: number): string => (k === 1 ? p.toLatex() : `\\left(${p.toLatex()}\\right)^{${k}}`);
          const factors = [pw(p1, x), pw(p2, y), pw(p3, z)].filter((_, i) => [x, y, z][i]! > 0).join(" \\cdot ");
          const chain = `${factors} = ${prod.toLatex()}`;
          return numberProblem({
            prompt: t(
              `Each of $${n}$ independent trials ends in outcome A, B or C with probabilities $${p1.toLatex()}$, $${p2.toLatex()}$, $${p3.toLatex()}$. Find the probability of exactly $${x}$ A's, $${y}$ B's and $${z}$ C's.`,
              `$${n}$ 次独立试验，每次结果为 A、B、C 的概率分别为 $${p1.toLatex()}$，$${p2.toLatex()}$，$${p3.toLatex()}$。求恰好 $${x}$ 次 A、$${y}$ 次 B、$${z}$ 次 C 的概率。`,
            ),
            answer: ans,
            mistakes: distinct(ans, [
              why(
                prod,
                "That is the probability of one order only; multiply by the number of orders.",
                "那只是一种顺序的概率；还要乘以顺序的个数。",
              ),
              why(Q.of(coef), "That is the number of orders, not a probability.", "那是顺序的个数，不是概率。"),
              why(ans.mul(Q.of(2)), "That counts every order twice.", "那是把每种顺序都算了两次。"),
            ]),
            solution: walked(
              [
                [
                  ["Count the orders", "数顺序"],
                  t(`$\\frac{${n}!}{${x}!\\,${y}!\\,${z}!} = ${coef}$.`, `$\\frac{${n}!}{${x}!\\,${y}!\\,${z}!} = ${coef}$。`),
                ],
                [
                  ["Multiply by the chance of one order", "乘以一种顺序的概率"],
                  t(
                    `One order has probability $${chain}$, so the probability is $${coef}$ times that, $${ans.toLatex()}$.`,
                    `一种顺序的概率为 $${chain}$，所以所求概率是它的 $${coef}$ 倍，即 $${ans.toLatex()}$。`,
                  ),
                ],
              ],
              t(
                `The counts $${x} + ${y} + ${z} = ${n}$ use up all the trials, and $\\frac{${ans.toLatex()}}{${coef}} = ${prod.toLatex()}$ is the chance of one order.`,
                `次数 $${x} + ${y} + ${z} = ${n}$ 用完了全部试验，而 $\\frac{${ans.toLatex()}}{${coef}} = ${prod.toLatex()}$ 正是一种顺序的概率。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 5.17.7 The Multinomial Distribution
  {
    id: "the-multinomial-distribution",
    title: t("The Multinomial Distribution", "多项分布"),
    summary: t(
      "The multinomial distribution extends the binomial to $k$ categories: $P(X_1 = x_1, \\dots, X_k = x_k) = \\frac{n!}{\\prod x_i!} \\prod p_i^{x_i}$.",
      "多项分布把二项分布推广到 $k$ 个类别：$P(X_1 = x_1, \\dots, X_k = x_k) = \\frac{n!}{\\prod x_i!} \\prod p_i^{x_i}$。",
    ),
    intro: t(
      "Roll a fair die $60$ times and count each face. The number of sixes alone is $\\text{Binomial}(60, \\frac{1}{6})$, with mean $10$, while the numbers of ones and twos have covariance $-60 \\cdot \\frac{1}{6} \\cdot \\frac{1}{6} = -\\frac{5}{3}$, because a roll that is a one cannot be a two.\n\nCheck: the six counts always add to $60$, so when one count is high the others must be lower on average, which is a negative covariance.\n\nIn this lesson we recognize each count of a multinomial distribution as binomial, find the covariance of two counts and find the variance of two counts merged into one.",
      "把均匀骰子掷 $60$ 次，记录每一面出现的次数。单看六点的次数，它服从 $\\text{Binomial}(60, \\frac{1}{6})$，均值为 $10$；一点与二点的次数的协方差为 $-60 \\cdot \\frac{1}{6} \\cdot \\frac{1}{6} = -\\frac{5}{3}$，因为一次掷出一点就不会是二点。\n\n检验：六个计数之和总是 $60$，所以一个计数偏大时其他计数平均要偏小，这就是负协方差。\n\n本课我们把多项分布的每个计数看作二项分布，求两个计数的协方差，并求两个计数合并后的方差。",
    ),
    prerequisites: ["the-trinomial-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "multinomial-marginal-binomial",
        title: t("Recognizing that each marginal of a multinomial distribution is binomial", "多项分布的每个边际分布均为二项分布"),
        explanation: t(
          "Focusing on one category and lumping all others together as failure turns each trial into a success or failure, so each count is binomial. For $(X_1, \\dots, X_k) \\sim \\text{Multinomial}(n, p_1, \\dots, p_k)$, each component $X_i$ follows $\\text{Binomial}(n, p_i)$. So with $500$ trials and $p_1 = \\frac{3}{10}$, $X_1 \\sim \\text{Binomial}(500, \\frac{3}{10})$.\n\n> **Watch out.** The number of trials is fixed, so the count is not Poisson or geometric, and it is exactly binomial, not normal.",
          "只关注一个类别，把其他类别都归为失败，每次试验就变成成功或失败，所以每个计数都服从二项分布。若 $(X_1, \\dots, X_k) \\sim \\text{Multinomial}(n, p_1, \\dots, p_k)$，则每个分量 $X_i$ 均服从二项分布 $\\text{Binomial}(n, p_i)$。所以若有 $500$ 次试验且 $p_1 = \\frac{3}{10}$，则 $X_1 \\sim \\text{Binomial}(500, \\frac{3}{10})$。\n\n> **注意。** 试验次数是固定的，所以这个计数不服从泊松分布或几何分布；它恰好服从二项分布，而不是正态分布。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(10, 100);
          const pFrac = rng.pick([
            { num: 1, den: 4 },
            { num: 1, den: 5 },
            { num: 1, den: 6 },
            { num: 2, den: 5 },
          ]);

          const opts = [
            t(
              `$\\text{Binomial}\\left(${n}, \\frac{${pFrac.num}}{${pFrac.den}}\\right)$`,
              `$\\text{Binomial}\\left(${n}, \\frac{${pFrac.num}}{${pFrac.den}}\\right)$`,
            ),
            t(`$\\text{Poisson}\\left(${n}\\right)$`, `$\\text{Poisson}\\left(${n}\\right)$`),
            t(`$N\\left(${n}, \\frac{${pFrac.num}}{${pFrac.den}}\\right)$`, `$N\\left(${n}, \\frac{${pFrac.num}}{${pFrac.den}}\\right)$`),
            t(
              `$\\text{Geometric}\\left(\\frac{${pFrac.num}}{${pFrac.den}}\\right)$`,
              `$\\text{Geometric}\\left(\\frac{${pFrac.num}}{${pFrac.den}}\\right)$`,
            ),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);
          return reasoned(
            choiceProblem({
              prompt: t(
                `In a multinomial experiment with $n = ${n}$ trials and $k = 4$ categories with probabilities $p_1 = \\frac{${pFrac.num}}{${pFrac.den}}$, $p_2, p_3, p_4$, what is the exact marginal distribution of the count $X_1$?`,
                `在进行具有 $n = ${n}$ 次试验与 $4$ 个类别的多项试验中，第一类的发生概率为 $p_1 = \\frac{${pFrac.num}}{${pFrac.den}}$。计数随机变量 $X_1$ 的精确边际分布是什么？`,
              ),
              options,
              correct,
              solution: walked(
                [
                  [
                    ["Lump the other categories", "合并其他类别"],
                    t(
                      `Call category 1 a success and the other three a failure, so each trial succeeds with probability $\\frac{${pFrac.num}}{${pFrac.den}}$.`,
                      `把第一类记为成功，其余三类记为失败，于是每次试验成功的概率为 $\\frac{${pFrac.num}}{${pFrac.den}}$。`,
                    ),
                  ],
                  [
                    ["Count the successes", "数成功次数"],
                    t(
                      `$X_1$ counts successes in $${n}$ independent trials: $X_1 \\sim \\text{Binomial}\\left(${n}, \\frac{${pFrac.num}}{${pFrac.den}}\\right)$.`,
                      `$X_1$ 是 $${n}$ 次独立试验中的成功次数：$X_1 \\sim \\text{Binomial}\\left(${n}, \\frac{${pFrac.num}}{${pFrac.den}}\\right)$。`,
                    ),
                  ],
                ],
                t(
                  `Its mean is $${n} \\cdot \\frac{${pFrac.num}}{${pFrac.den}} = ${Q.of(n * pFrac.num, pFrac.den).toLatex()}$, the expected number of trials in category 1.`,
                  `它的均值为 $${n} \\cdot \\frac{${pFrac.num}}{${pFrac.den}} = ${Q.of(n * pFrac.num, pFrac.den).toLatex()}$，即落入第一类的试验次数的期望。`,
                ),
              ),
            }),
            [
              [
                opts[1]!.en,
                `A Poisson count can be any size, and this count cannot exceed the $${n}$ trials.`,
                `泊松计数可以取任意大，而这个计数不会超过 $${n}$ 次试验。`,
              ],
              [
                opts[2]!.en,
                "This count takes whole-number values, and these numbers are not even the mean and variance of a normal approximation.",
                "这个计数只取整数，而且这两个数也不是正态近似的均值和方差。",
              ],
              [
                opts[3]!.en,
                "A geometric variable counts trials up to the first success, and here the number of trials is fixed.",
                "几何变量计的是到首次成功的试验次数，而这里试验次数是固定的。",
              ],
            ],
          );
        },
      },
      {
        id: "the-covariance-of-two-multinomial-counts",
        title: t("The covariance of two multinomial counts", "多项分布两个计数的协方差"),
        explanation: t(
          "The counts of a multinomial distribution compete for the same $n$ trials, so they are negatively related: a trial that lands in category $i$ cannot land in $j$. For $i \\neq j$,\n\n$$\\operatorname{Cov}(X_i, X_j) = -np_ip_j, \\qquad \\operatorname{Var}(X_i) = np_i(1 - p_i).$$\n\nFor a fair die rolled $60$ times, the numbers of ones and twos have covariance $-60 \\cdot \\frac{1}{6} \\cdot \\frac{1}{6} = -\\frac{5}{3}$. With $200$ trials and probabilities $\\frac{1}{2}$ and $\\frac{1}{4}$, the covariance is $-200 \\cdot \\frac{1}{8} = -25$.\n\n> **Watch out.** Keep the minus sign; the counts are not independent, so the covariance is not $0$; and $p_j$ appears itself, not $1 - p_j$, which belongs to the variance.",
          "多项分布的各计数争夺同样的 $n$ 次试验，因此负相关：落入第 $i$ 类的试验不能再落入第 $j$ 类。对 $i \\neq j$，\n\n$$\\operatorname{Cov}(X_i, X_j) = -np_ip_j, \\qquad \\operatorname{Var}(X_i) = np_i(1 - p_i).$$\n\n例如掷均匀骰子 $60$ 次，一点与二点的次数的协方差为 $-60 \\cdot \\frac{1}{6} \\cdot \\frac{1}{6} = -\\frac{5}{3}$。若有 $200$ 次试验，概率为 $\\frac{1}{2}$ 与 $\\frac{1}{4}$，则协方差为 $-200 \\cdot \\frac{1}{8} = -25$。\n\n> **注意。** 不要丢掉负号；各计数并不独立，所以协方差不是 $0$；公式中出现的是 $p_j$ 本身，不是 $1 - p_j$，后者属于方差。",
        ),
        generate: (rng: Rng): Problem => {
          const ps = rng.pick([
            [Q.of(1, 2), Q.of(1, 4), Q.of(1, 8), Q.of(1, 8)],
            [Q.of(2, 5), Q.of(3, 10), Q.of(1, 5), Q.of(1, 10)],
            [Q.of(1, 3), Q.of(1, 3), Q.of(1, 6), Q.of(1, 6)],
            [Q.of(1, 4), Q.of(1, 4), Q.of(1, 4), Q.of(1, 4)],
          ] as Q[][]);
          const n = rng.int(10, 80);
          const i = rng.int(0, 3);
          const j = (i + rng.int(1, 3)) % 4;
          const pi = ps[i] ?? Q.zero;
          const pj = ps[j] ?? Q.zero;
          const ans = Q.of(-n).mul(pi).mul(pj);
          return numberProblem({
            prompt: t(
              `$(X_1, X_2, X_3, X_4)$ is multinomial with $n = ${n}$ and probabilities $${ps.map((p) => p.toLatex()).join(", ")}$. Find $\\operatorname{Cov}(X_{${i + 1}}, X_{${j + 1}})$.`,
              `$(X_1, X_2, X_3, X_4)$ 服从 $n = ${n}$、概率为 $${ps.map((p) => p.toLatex()).join(", ")}$ 的多项分布。求 $\\operatorname{Cov}(X_{${i + 1}}, X_{${j + 1}})$。`,
            ),
            answer: ans,
            mistakes: distinct(ans, [
              why(
                ans.neg(),
                "That drops the minus sign; competing counts are negatively related.",
                "那是丢掉了负号；相互争夺试验的计数是负相关的。",
              ),
              why(Q.zero, "The counts are not independent: they share the same trials.", "这些计数并不独立：它们共用同样的试验。"),
              why(
                Q.of(-n).mul(pi).mul(Q.one.sub(pj)),
                "That uses $1 - p_j$, which belongs to the variance formula.",
                "那是用了 $1 - p_j$，它属于方差公式。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Pick the probabilities", "取出概率"],
                  t(
                    `$p_{${i + 1}} = ${pi.toLatex()}$ and $p_{${j + 1}} = ${pj.toLatex()}$.`,
                    `$p_{${i + 1}} = ${pi.toLatex()}$，$p_{${j + 1}} = ${pj.toLatex()}$。`,
                  ),
                ],
                [
                  ["Use the formula", "使用公式"],
                  t(
                    `$\\operatorname{Cov}(X_{${i + 1}}, X_{${j + 1}}) = -np_{${i + 1}}p_{${j + 1}} = -${n} \\cdot ${pi.toLatex()} \\cdot ${pj.toLatex()} = ${ans.toLatex()}$.`,
                    `$\\operatorname{Cov}(X_{${i + 1}}, X_{${j + 1}}) = -np_{${i + 1}}p_{${j + 1}} = -${n} \\cdot ${pi.toLatex()} \\cdot ${pj.toLatex()} = ${ans.toLatex()}$。`,
                  ),
                ],
              ],
              t(
                `The covariance is negative, as it must be for counts that compete for the same $${n}$ trials.`,
                `协方差为负，正符合争夺同样 $${n}$ 次试验的计数的特点。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 5.18.2 Marginal Distributions for Continuous Random Variables
  {
    id: "marginal-distributions-for-continuous-random-variables",
    title: t("Marginal Distributions for Continuous Random Variables", "连续型随机变量的边际概率密度"),
    summary: t(
      "For a joint density $f(x, y)$, the marginal densities are $f_X(x) = \\int f(x, y)\\,dy$ and $f_Y(y) = \\int f(x, y)\\,dx$.",
      "对联合密度 $f(x, y)$，边际密度为 $f_X(x) = \\int f(x, y)\\,dy$ 与 $f_Y(y) = \\int f(x, y)\\,dx$。",
    ),
    intro: t(
      "For $f(x, y) = 2$ on the triangle $0 \\le y \\le x \\le 1$, fixing $x$ leaves a slice from $y = 0$ to $y = x$, so $f_X(x) = \\int_0^{x} 2\\,dy = 2x$; at $x = \\frac{3}{4}$ it is $\\frac{3}{2}$.\n\nCheck: $\\int_0^1 2x\\,dx = 1$, so the marginal is a density.\n\nIn this lesson we find marginal densities by integrating out the other variable, on rectangles and on triangles, including densities that are not constant.",
      "对三角形 $0 \\le y \\le x \\le 1$ 上的 $f(x, y) = 2$，固定 $x$ 后切片从 $y = 0$ 到 $y = x$，所以 $f_X(x) = \\int_0^{x} 2\\,dy = 2x$；在 $x = \\frac{3}{4}$ 处为 $\\frac{3}{2}$。\n\n检验：$\\int_0^1 2x\\,dx = 1$，所以这个边缘函数是一个密度。\n\n本课我们通过积掉另一个变量求边缘密度，包括矩形和三角形上的情形，以及密度不是常数的情形。",
    ),
    prerequisites: ["joint-distributions-for-continuous-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "integrating-marginal-density-constant",
        title: t("Evaluating marginal density coefficients", "计算边际密度函数的系数"),
        explanation: t(
          "Integrating the joint density over the other variable leaves a function of one variable, which is the marginal density. For $f(x, y) = c(x + y)$ on $[0, 1] \\times [0, 1]$, $f_X(x) = c\\left(x + \\frac{1}{2}\\right)$. For $f(x, y) = \\frac{4}{3600}xy$ on $[0, 6] \\times [0, 10]$, $f_X(x) = \\frac{4x}{3600} \\cdot \\frac{100}{2} = \\frac{1}{18}x$.\n\n> **Watch out.** Integrate over $y$ only, up to its own bound: the factor $\\frac{b^2}{2}$ cancels the $b^2$ in the constant and leaves $\\frac{2}{a^2}$, not $\\frac{2}{b^2}$ or the joint constant.",
          "把联合密度对另一个变量积分，剩下一个单变量函数，这就是边缘密度。对于 $[0, 1] \\times [0, 1]$ 上的 $f(x, y) = c(x + y)$，边际密度为 $f_X(x) = c\\left(x + \\frac{1}{2}\\right)$。对于 $[0, 6] \\times [0, 10]$ 上的 $f(x, y) = \\frac{4}{3600}xy$，$f_X(x) = \\frac{4x}{3600} \\cdot \\frac{100}{2} = \\frac{1}{18}x$。\n\n> **注意。** 只对 $y$ 积分，积到 $y$ 自己的上限：因子 $\\frac{b^2}{2}$ 约去常数中的 $b^2$，剩下 $\\frac{2}{a^2}$，而不是 $\\frac{2}{b^2}$ 或联合密度的常数。",
        ),
        generate: (rng: Rng): Problem => {
          // f(x, y) = c * x * y on [0, a] x [0, b]
          // int_0^a int_0^b c xy dx dy = c (a^2 / 2)(b^2 / 2) = 1 => c = 4 / (a^2 b^2)
          const a = rng.int(1, 5);
          const b = rng.int(1, 5);
          // f_X(x) = int_0^b c xy dy = c x b^2 / 2 = (4 / a^2 b^2) (b^2 / 2) x = (2 / a^2) x
          // Let's ask: what is the coefficient of x in f_X(x)?
          const num = 2;
          const den = a * a;

          return numberProblem({
            prompt: t(
              `The continuous random variables $X$ and $Y$ have joint PDF $f(x, y) = \\frac{4}{${a * a * b * b}} x y$ on the rectangular support $0 \\le x \\le ${a}$ and $0 \\le y \\le ${b}$ (and $0$ elsewhere). The marginal density takes the form $f_X(x) = k x$ for $0 \\le x \\le ${a}$. Find the rational value of $k$.`,
              `连续随机变量 $X$ 与 $Y$ 在矩形支撑集 $0 \\le x \\le ${a}$ 且 $0 \\le y \\le ${b}$ 上的联合概率密度函数为 $f(x, y) = \\frac{4}{${a * a * b * b}} x y$。其边际密度函数具有形式 $f_X(x) = k x$（$0 \\le x \\le ${a}$）。求系数 $k$ 的有理数值。`,
            ),
            answer: Q.of(num, den),
            mistakes: distinct(Q.of(num, den), [
              why(
                Q.of(4, a * a * b * b),
                "That is the joint constant, before integrating out $y$.",
                "那是联合密度的常数，还没有积掉 $y$。",
              ),
              why(
                Q.of(2, b * b),
                "That swaps the roles of $a$ and $b$; the $b^2$ cancels.",
                "那是把 $a$ 与 $b$ 的作用弄反了；$b^2$ 会约去。",
              ),
              why(
                Q.of(4, a * a),
                "That drops the $\\frac{1}{2}$ from $\\int y\\,dy = \\frac{y^2}{2}$.",
                "那是丢掉了 $\\int y\\,dy = \\frac{y^2}{2}$ 中的 $\\frac{1}{2}$。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Integrate out $y$", "积掉 $y$"],
                  t(
                    `$\\int_0^${b} y\\,dy = \\frac{${b * b}}{2}$, so $f_X(x) = \\frac{4x}{${a * a * b * b}} \\cdot \\frac{${b * b}}{2}$.`,
                    `$\\int_0^${b} y\\,dy = \\frac{${b * b}}{2}$，所以 $f_X(x) = \\frac{4x}{${a * a * b * b}} \\cdot \\frac{${b * b}}{2}$。`,
                  ),
                ],
                [
                  ["Simplify", "化简"],
                  t(
                    `$f_X(x) = ${Q.of(num, den).toLatex()}x$, so $k = \\frac{2}{${den}}${lowestTerms(2, den)}$.`,
                    `$f_X(x) = ${Q.of(num, den).toLatex()}x$，所以 $k = \\frac{2}{${den}}${lowestTerms(2, den)}$。`,
                  ),
                ],
              ],
              t(
                `$\\int_0^${a} ${Q.of(num, den).toLatex()}x\\,dx = ${Q.of(num, den).toLatex()} \\cdot \\frac{${a * a}}{2} = 1$, so $f_X$ is a density.`,
                `$\\int_0^${a} ${Q.of(num, den).toLatex()}x\\,dx = ${Q.of(num, den).toLatex()} \\cdot \\frac{${a * a}}{2} = 1$，所以 $f_X$ 是一个密度。`,
              ),
            ),
          });
        },
      },
      {
        id: "marginal-densities-on-non-rectangular-regions",
        figure:
          probabilityDrawings1["marginal-distributions-for-continuous-random-variables#marginal-densities-on-non-rectangular-regions"],
        title: t("Marginal densities on non-rectangular regions", "非矩形区域上的边缘密度"),
        explanation: t(
          "When the support is not a rectangle, the limits of integration depend on the fixed variable. For $f(x, y) = 2$ on the triangle $0 \\le y \\le x \\le 1$:\n\n$$f_X(x) = \\int_0^{x} 2\\,dy = 2x, \\qquad f_Y(y) = \\int_y^1 2\\,dx = 2(1 - y).$$\n\nOn a rectangle the limits are constants: for $f(x, y) = x + y$ on the unit square, $f_X(x) = \\int_0^1 (x + y)\\,dy = x + \\frac{1}{2}$. In the figure, the slice at $x = \\frac{1}{2}$ has length $\\frac{1}{2}$, so $f_X(\\frac{1}{2}) = 2 \\cdot \\frac{1}{2} = 1$. Near the corner, $f_Y(\\frac{1}{40}) = 2 \\cdot \\frac{39}{40} = \\frac{39}{20}$.\n\n> **Watch out.** Multiply the density by the length of the slice: the density $2$ alone, or the length alone, is not the marginal, and $f_X$ and $f_Y$ have different slices.",
          "当支撑集不是矩形时，积分限依赖于固定的那个变量。对三角形 $0 \\le y \\le x \\le 1$ 上的 $f(x, y) = 2$：\n\n$$f_X(x) = \\int_0^{x} 2\\,dy = 2x, \\qquad f_Y(y) = \\int_y^1 2\\,dx = 2(1 - y).$$\n\n在矩形上积分限是常数：对单位正方形上的 $f(x, y) = x + y$，$f_X(x) = \\int_0^1 (x + y)\\,dy = x + \\frac{1}{2}$。图中 $x = \\frac{1}{2}$ 处切片的长度为 $\\frac{1}{2}$，所以 $f_X(\\frac{1}{2}) = 2 \\cdot \\frac{1}{2} = 1$。在角落附近，$f_Y(\\frac{1}{40}) = 2 \\cdot \\frac{39}{40} = \\frac{39}{20}$。\n\n> **注意。** 要用密度乘以切片的长度：只有密度 $2$ 或只有长度都不是边缘密度，而且 $f_X$ 与 $f_Y$ 的切片不同。",
        ),
        generate: (rng: Rng): Problem => {
          const kind = rng.int(0, 2);
          const v = Q.of(rng.int(1, 19), 20);
          const ans = kind === 0 ? Q.of(2).mul(v) : kind === 1 ? Q.of(2).mul(Q.one.sub(v)) : v.add(Q.of(1, 2));
          const wrong =
            kind === 0
              ? [Q.of(2), Q.of(2).mul(Q.one.sub(v)), v]
              : kind === 1
                ? [Q.of(2).mul(v), Q.of(2), Q.one.sub(v)]
                : [v, v.add(Q.one), Q.of(1, 2)];
          const desc =
            kind === 2
              ? ["$f(x, y) = x + y$ on the unit square $0 \\le x, y \\le 1$", "单位正方形 $0 \\le x, y \\le 1$ 上的 $f(x, y) = x + y$"]
              : ["$f(x, y) = 2$ on the triangle $0 \\le y \\le x \\le 1$", "三角形 $0 \\le y \\le x \\le 1$ 上的 $f(x, y) = 2$"];
          const target = kind === 1 ? `f_Y(${v.toLatex()})` : `f_X(${v.toLatex()})`;
          return numberProblem({
            prompt: t(`$(X, Y)$ has joint density ${desc[0]}. Find $${target}$.`, `$(X, Y)$ 的联合密度为${desc[1]}。求 $${target}$。`),
            answer: ans,
            mistakes: distinct(
              ans,
              kind === 0
                ? [
                    why(
                      wrong[0]!,
                      "That is the joint density; it still has to be integrated over the slice.",
                      "那是联合密度；还要沿切片积分。",
                    ),
                    why(wrong[1]!, "That is the marginal of $Y$, $2(1 - y)$, not of $X$.", "那是 $Y$ 的边缘密度 $2(1 - y)$，不是 $X$ 的。"),
                    why(wrong[2]!, "That is the length of the slice, without the density $2$.", "那是切片的长度，没有乘以密度 $2$。"),
                  ]
                : kind === 1
                  ? [
                      why(wrong[0]!, "That is the marginal of $X$, $2x$, not of $Y$.", "那是 $X$ 的边缘密度 $2x$，不是 $Y$ 的。"),
                      why(
                        wrong[1]!,
                        "That is the joint density; it still has to be integrated over the slice.",
                        "那是联合密度；还要沿切片积分。",
                      ),
                      why(wrong[2]!, "That is the length of the slice, without the density $2$.", "那是切片的长度，没有乘以密度 $2$。"),
                    ]
                  : [
                      why(wrong[0]!, "That drops the $\\frac{1}{2}$ from integrating $y$.", "那是丢掉了对 $y$ 积分得到的 $\\frac{1}{2}$。"),
                      why(
                        wrong[1]!,
                        "That integrates $y$ to $1$ instead of to $\\frac{1}{2}$.",
                        "那是把对 $y$ 的积分算成 $1$，而不是 $\\frac{1}{2}$。",
                      ),
                      why(wrong[2]!, "That drops the $x$ term.", "那是丢掉了 $x$ 那一项。"),
                    ],
            ),
            solution: walked(
              [
                [
                  ["Find the slice", "找出切片"],
                  t(
                    kind === 0
                      ? "For fixed $x$, $y$ runs from $0$ to $x$."
                      : kind === 1
                        ? "For fixed $y$, $x$ runs from $y$ to $1$."
                        : "On the unit square, $y$ runs from $0$ to $1$ for every $x$.",
                    kind === 0
                      ? "固定 $x$ 时，$y$ 从 $0$ 取到 $x$。"
                      : kind === 1
                        ? "固定 $y$ 时，$x$ 从 $y$ 取到 $1$。"
                        : "在单位正方形上，对每个 $x$，$y$ 都从 $0$ 取到 $1$。",
                  ),
                ],
                [
                  ["Integrate", "积分"],
                  t(
                    kind === 0
                      ? `$f_X(x) = \\int_0^{x} 2\\,dy = 2x$, so $${target} = ${ans.toLatex()}$.`
                      : kind === 1
                        ? `$f_Y(y) = \\int_y^1 2\\,dx = 2(1 - y)$, so $${target} = ${ans.toLatex()}$.`
                        : `$f_X(x) = \\int_0^1 (x + y)\\,dy = x + \\frac{1}{2}$, so $${target} = ${ans.toLatex()}$.`,
                    kind === 0
                      ? `$f_X(x) = \\int_0^{x} 2\\,dy = 2x$，所以 $${target} = ${ans.toLatex()}$。`
                      : kind === 1
                        ? `$f_Y(y) = \\int_y^1 2\\,dx = 2(1 - y)$，所以 $${target} = ${ans.toLatex()}$。`
                        : `$f_X(x) = \\int_0^1 (x + y)\\,dy = x + \\frac{1}{2}$，所以 $${target} = ${ans.toLatex()}$。`,
                  ),
                ],
              ],
              t(
                kind === 2
                  ? "$\\int_0^1 \\left(x + \\frac{1}{2}\\right)dx = \\frac{1}{2} + \\frac{1}{2} = 1$, so the marginal is a density."
                  : "$\\int_0^1 2x\\,dx = \\int_0^1 2(1 - y)\\,dy = 1$, so both marginals are densities.",
                kind === 2
                  ? "$\\int_0^1 \\left(x + \\frac{1}{2}\\right)dx = \\frac{1}{2} + \\frac{1}{2} = 1$，所以这个边缘函数是一个密度。"
                  : "$\\int_0^1 2x\\,dx = \\int_0^1 2(1 - y)\\,dy = 1$，所以两个边缘函数都是密度。",
              ),
            ),
          });
        },
      },
    ],
  },

  // 5.18.3 Independence of Continuous Random Variables
  {
    id: "independence-of-continuous-random-variables",
    title: t("Independence of Continuous Random Variables", "连续型随机变量的独立性"),
    summary: t(
      "Continuous random variables $X$ and $Y$ are independent if and only if their joint density factors as $f(x, y) = f_X(x)f_Y(y)$ on a product domain.",
      "连续型随机变量 $X$ 与 $Y$ 相互独立，当且仅当联合密度在乘积区域上分解为 $f(x, y) = f_X(x)f_Y(y)$。",
    ),
    intro: t(
      "The density $f(x, y) = 6xy^{2}$ on the unit square splits as $(2x)(3y^{2})$, a function of $x$ times a function of $y$ on a rectangle, so $X$ and $Y$ are independent, and $P(X \\le \\frac{1}{2}, Y \\le \\frac{1}{2}) = \\frac{1}{4} \\cdot \\frac{1}{8} = \\frac{1}{32}$.\n\nCheck: $\\int_0^1 2x\\,dx = 1$ and $\\int_0^1 3y^{2}\\,dy = 1$, so the two factors are the marginal densities.\n\nIn this lesson we test independence by factoring the joint density, check that the support factors too, read independence from the shape of the support and multiply probabilities of independent variables.",
      "单位正方形上的密度 $f(x, y) = 6xy^{2}$ 可分解为 $(2x)(3y^{2})$，即在矩形上 $x$ 的函数乘以 $y$ 的函数，所以 $X$ 与 $Y$ 独立，且 $P(X \\le \\frac{1}{2}, Y \\le \\frac{1}{2}) = \\frac{1}{4} \\cdot \\frac{1}{8} = \\frac{1}{32}$。\n\n检验：$\\int_0^1 2x\\,dx = 1$，$\\int_0^1 3y^{2}\\,dy = 1$，所以这两个因子就是边缘密度。\n\n本课我们通过分解联合密度检验独立性，检查支撑集是否也能分解，从支撑集的形状判断独立性，并把独立变量的概率相乘。",
    ),
    prerequisites: ["marginal-distributions-for-continuous-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "continuous-independence-factorization",
        title: t("Testing independence by factorability of joint PDF", "根据联合密度的可乘积分解检验独立性"),
        explanation: t(
          "If the joint density splits into a function of one variable times a function of the other on a rectangle, the variables carry no information about each other. If $f(x, y) = g(x) h(y)$ on a product domain $[a, b] \\times [c, d]$, then $X$ and $Y$ are independent. So $f(x, y) = 231x^{10}y^{20}$ on the unit square is $(11x^{10})(21y^{20})$, and $X$ and $Y$ are independent.\n\n> **Watch out.** A shared constant can always be split between the factors, and the exponents need not match; only the form $g(x)h(y)$ on a rectangle matters.",
          "如果在矩形区域上联合密度可以分解为一个变量的函数乘以另一个变量的函数，那么两个变量彼此不提供任何信息。若在笛卡尔积区间 $[a, b] \\times [c, d]$ 上 $f(x, y) = g(x) h(y)$，则 $X$ 与 $Y$ 相互独立。所以单位正方形上的 $f(x, y) = 231x^{10}y^{20}$ 等于 $(11x^{10})(21y^{20})$，$X$ 与 $Y$ 独立。\n\n> **注意。** 共同的常数总可以分给两个因子，指数也不必相同；要紧的只是在矩形上具有 $g(x)h(y)$ 的形式。",
        ),
        generate: (rng: Rng): Problem => {
          const m = rng.int(2, 8);
          const n = rng.int(2, 8);

          const opts = [
            t(
              `Yes, because $f(x, y) = (${m + 1} x^{${m}}) (${n + 1} y^{${n}})$ factors into functions of $x$ and $y$ on the rectangular support $[0, 1] \\times [0, 1]$.`,
              `是，因为在矩形支撑集 $[0, 1] \\times [0, 1]$ 上 $f(x, y) = (${m + 1} x^{${m}}) (${n + 1} y^{${n}})$ 可分解为纯 $x$ 与纯 $y$ 的函数之积。`,
            ),
            t(
              `No, because the variables share the same constant factor $${(m + 1) * (n + 1)}$.`,
              `否，因为两个变量共享相同的常数因子 $${(m + 1) * (n + 1)}$。`,
            ),
            t("No, because independence requires the two exponents to be equal.", "否，因为独立性要求两个指数相等。"),
            t(`Cannot be determined without computing higher-order joint moments.`, `不计算更高阶联合矩则无法确定。`),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);

          return reasoned(
            choiceProblem({
              prompt: t(
                `Let $X$ and $Y$ have joint probability density function $f(x, y) = ${(m + 1) * (n + 1)} x^{${m}} y^{${n}}$ for $0 \\le x \\le 1$ and $0 \\le y \\le 1$. Are $X$ and $Y$ independent?`,
                `设连续随机变量 $X$ 与 $Y$ 在 $0 \\le x \\le 1$ 且 $0 \\le y \\le 1$ 上的联合概率密度函数为 $f(x, y) = ${(m + 1) * (n + 1)} x^{${m}} y^{${n}}$。问 $X$ 与 $Y$ 是否相互独立？`,
              ),
              options,
              correct,
              solution: walked(
                [
                  [
                    ["Factor the density", "分解密度"],
                    t(
                      `$f(x, y) = [${m + 1} x^{${m}}] \\cdot [${n + 1} y^{${n}}]$, a function of $x$ times a function of $y$.`,
                      `$f(x, y) = [${m + 1} x^{${m}}] \\cdot [${n + 1} y^{${n}}]$，是 $x$ 的函数乘以 $y$ 的函数。`,
                    ),
                  ],
                  [
                    ["Check the support", "检查支撑集"],
                    t(
                      "The support $[0, 1] \\times [0, 1]$ is a rectangle, so $X$ and $Y$ are independent.",
                      "支撑集 $[0, 1] \\times [0, 1]$ 是矩形，所以 $X$ 与 $Y$ 相互独立。",
                    ),
                  ],
                ],
                t(
                  `Each factor is a density: $\\int_0^1 ${m + 1}x^{${m}}\\,dx = 1$ and $\\int_0^1 ${n + 1}y^{${n}}\\,dy = 1$, so they are the marginals $f_X$ and $f_Y$.`,
                  `每个因子都是密度：$\\int_0^1 ${m + 1}x^{${m}}\\,dx = 1$，$\\int_0^1 ${n + 1}y^{${n}}\\,dy = 1$，所以它们就是边缘密度 $f_X$ 与 $f_Y$。`,
                ),
              ),
            }),
            [
              [
                opts[1]!.en,
                "A constant can be split between the two factors, so it never prevents independence.",
                "常数可以分给两个因子，所以它不会妨碍独立性。",
              ],
              [opts[2]!.en, "The exponents need not match; each factor is a density of its own.", "指数不必相同；每个因子各自是一个密度。"],
              [opts[3]!.en, "The factorization on a rectangle already decides independence.", "在矩形上的分解已经可以判定独立性。"],
            ],
          );
        },
      },
      {
        id: "joint-probabilities-under-independence",
        title: t("Joint probabilities under independence", "独立条件下的联合概率"),
        explanation: t(
          "When $X$ and $Y$ are independent, a probability about a rectangle splits into a product of one-dimensional probabilities:\n\n$$P(X \\le a, Y \\le b) = P(X \\le a)\\,P(Y \\le b) = F_X(a)F_Y(b).$$\n\nFor $f_X(x) = 2x$ and $f_Y(y) = 3y^{2}$ on $[0, 1]$, $F_X(a) = a^{2}$ and $F_Y(b) = b^{3}$, so $P(X \\le \\frac{1}{2}, Y \\le \\frac{1}{2}) = \\frac{1}{4} \\cdot \\frac{1}{8} = \\frac{1}{32}$. No double integral is needed. With $f_X(x) = 10x^{9}$ and $f_Y(y) = 2y$, $P(X \\le \\frac{1}{2}, Y \\le \\frac{1}{2}) = \\frac{1}{1024} \\cdot \\frac{1}{4} = \\frac{1}{4096}$.\n\n> **Watch out.** Use the CDFs, whose powers are one higher than the densities', and multiply them; the cutoffs alone, or a sum, are not the probability.",
          "当 $X$ 与 $Y$ 独立时，关于矩形的概率可以分解为一维概率之积：\n\n$$P(X \\le a, Y \\le b) = P(X \\le a)\\,P(Y \\le b) = F_X(a)F_Y(b).$$\n\n例如在 $[0, 1]$ 上 $f_X(x) = 2x$，$f_Y(y) = 3y^{2}$，则 $F_X(a) = a^{2}$，$F_Y(b) = b^{3}$，所以 $P(X \\le \\frac{1}{2}, Y \\le \\frac{1}{2}) = \\frac{1}{4} \\cdot \\frac{1}{8} = \\frac{1}{32}$。不需要二重积分。若 $f_X(x) = 10x^{9}$，$f_Y(y) = 2y$，则 $P(X \\le \\frac{1}{2}, Y \\le \\frac{1}{2}) = \\frac{1}{1024} \\cdot \\frac{1}{4} = \\frac{1}{4096}$。\n\n> **注意。** 要用分布函数，它的幂次比密度高一次，再把它们相乘；只用分界值或把概率相加都不对。",
        ),
        generate: (rng: Rng): Problem => {
          const m = rng.int(1, 3);
          const k = rng.int(1, 3);
          const a = Q.of(rng.int(1, 4), 5);
          const b = Q.of(rng.int(1, 3), 4);
          const ans = a.pow(m + 1).mul(b.pow(k + 1));
          const fx = m === 1 ? "2x" : `${m + 1}x^{${m}}`;
          const fy = k === 1 ? "2y" : `${k + 1}y^{${k}}`;
          return numberProblem({
            prompt: t(
              `$X$ and $Y$ are independent with densities $f_X(x) = ${fx}$ and $f_Y(y) = ${fy}$ on $[0, 1]$. Find $P(X \\le ${a.toLatex()}, Y \\le ${b.toLatex()})$.`,
              `$X$ 与 $Y$ 独立，密度在 $[0, 1]$ 上分别为 $f_X(x) = ${fx}$，$f_Y(y) = ${fy}$。求 $P(X \\le ${a.toLatex()}, Y \\le ${b.toLatex()})$。`,
            ),
            answer: ans,
            mistakes: distinct(ans, [
              why(
                a.pow(m).mul(b.pow(k)),
                "That uses the powers of the densities; the CDFs have powers one higher.",
                "那是用了密度的幂次；分布函数的幂次要高一次。",
              ),
              why(a.mul(b), "That treats both variables as uniform.", "那是把两个变量都当作均匀分布。"),
              why(
                a.pow(m + 1).add(b.pow(k + 1)),
                "That adds the two probabilities instead of multiplying them.",
                "那是把两个概率相加，而不是相乘。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the CDFs", "求分布函数"],
                  t(
                    `$F_X(a) = a^{${m + 1}}$ and $F_Y(b) = b^{${k + 1}}$ on $[0, 1]$.`,
                    `在 $[0, 1]$ 上 $F_X(a) = a^{${m + 1}}$，$F_Y(b) = b^{${k + 1}}$。`,
                  ),
                ],
                [
                  ["Multiply", "相乘"],
                  t(
                    `$\\left(${a.toLatex()}\\right)^{${m + 1}}\\left(${b.toLatex()}\\right)^{${k + 1}} = ${a.pow(m + 1).toLatex()} \\cdot ${b.pow(k + 1).toLatex()} = ${ans.toLatex()}$.`,
                    `$\\left(${a.toLatex()}\\right)^{${m + 1}}\\left(${b.toLatex()}\\right)^{${k + 1}} = ${a.pow(m + 1).toLatex()} \\cdot ${b.pow(k + 1).toLatex()} = ${ans.toLatex()}$。`,
                  ),
                ],
              ],
              t(
                `The answer is below both $${a.pow(m + 1).toLatex()}$ and $${b.pow(k + 1).toLatex()}$, as a probability of both events must be.`,
                `答案比 $${a.pow(m + 1).toLatex()}$ 与 $${b.pow(k + 1).toLatex()}$ 都小，两个事件同时发生的概率理应如此。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 5.18.4 Conditional Distributions for Continuous Random Variables
  {
    id: "conditional-distributions-for-continuous-random-variables",
    title: t("Conditional Distributions for Continuous Random Variables", "连续型随机变量的条件概率分布"),
    summary: t(
      "The conditional density of $Y$ given $X = x$ is $f_{Y \\mid X}(y \\mid x) = \\frac{f(x, y)}{f_X(x)}$ wherever $f_X(x) > 0$.",
      "在 $X = x$ 的条件下，$Y$ 的条件密度为 $f_{Y \\mid X}(y \\mid x) = \\frac{f(x, y)}{f_X(x)}$（要求 $f_X(x) > 0$）。",
    ),
    intro: t(
      "For $f(x, y) = 2$ on $0 \\le y \\le x \\le 1$, the marginal is $f_X(x) = 2x$, so given $X = \\frac{4}{5}$ the conditional density is $\\frac{2}{2 \\cdot 4/5} = \\frac{5}{4}$ on $[0, \\frac{4}{5}]$: $Y$ is uniform there, and $P(Y \\le \\frac{1}{5} \\mid X = \\frac{4}{5}) = \\frac{1}{4}$.\n\nCheck: $\\frac{5}{4} \\cdot \\frac{4}{5} = 1$, so the conditional density integrates to $1$.\n\nIn this lesson we evaluate conditional densities, find probabilities from them and find a conditional variance on a uniform triangle.",
      "对 $0 \\le y \\le x \\le 1$ 上的 $f(x, y) = 2$，边缘密度为 $f_X(x) = 2x$，所以给定 $X = \\frac{4}{5}$ 时，条件密度在 $[0, \\frac{4}{5}]$ 上为 $\\frac{2}{2 \\cdot 4/5} = \\frac{5}{4}$：$Y$ 在那里均匀分布，且 $P(Y \\le \\frac{1}{5} \\mid X = \\frac{4}{5}) = \\frac{1}{4}$。\n\n检验：$\\frac{5}{4} \\cdot \\frac{4}{5} = 1$，所以条件密度的积分为 $1$。\n\n本课我们计算条件密度的值，由条件密度求概率，并在均匀三角形上求条件方差。",
    ),
    prerequisites: ["marginal-distributions-for-continuous-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-conditional-density",
        title: t("Evaluating the conditional density at a given value", "计算给定条件下的条件概率密度值"),
        explanation: t(
          "A conditional density is a slice of the joint density at a fixed value of one variable, rescaled by the marginal so that it integrates to one. The conditional density is $f_{Y \\mid X}(y \\mid x) = \\frac{f(x, y)}{f_X(x)}$. For $f(x, y) = 2$ on $0 \\le y \\le x \\le 1$ and $X = \\frac{1}{20}$, it is $\\frac{2}{2/20} = 20$.\n\n> **Watch out.** Divide the joint density by the marginal $2x$, including its factor $2$; the joint density $2$ itself is not the conditional density, and neither is $x$.",
          "条件密度是在一个变量取固定值时联合密度的一个切片，再用边缘密度重新缩放，使它的积分为 1。条件密度为 $f_{Y \\mid X}(y \\mid x) = \\frac{f(x, y)}{f_X(x)}$。对 $0 \\le y \\le x \\le 1$ 上的 $f(x, y) = 2$，当 $X = \\frac{1}{20}$ 时，它等于 $\\frac{2}{2/20} = 20$。\n\n> **注意。** 要用联合密度除以边缘密度 $2x$，包括其中的因子 $2$；联合密度 $2$ 本身不是条件密度，$x$ 也不是。",
        ),
        generate: (rng: Rng): Problem => {
          // f(x, y) = 2 for 0 <= y <= x <= 1
          // f_X(x) = int_0^x 2 dy = 2x
          // f_{Y|X}(y|x) = 2 / (2x) = 1/x for 0 <= y <= x
          // For a given x0, f_{Y|X}(y|x0) is Uniform(0, x0), density is 1/x0
          const numX = rng.int(1, 6);
          const denX = numX + rng.int(1, 8);
          // x0 = numX / denX => density = denX / numX

          return numberProblem({
            prompt: t(
              `The joint PDF of $X$ and $Y$ is $f(x, y) = 2$ on the triangular region $0 \\le y \\le x \\le 1$. Given that $X = \\frac{${numX}}{${denX}}$, what is the constant value of the conditional PDF $f_{Y \\mid X}\\left(y \\;\\middle|\\; X = \\frac{${numX}}{${denX}}\\right)$ for $0 \\le y \\le \\frac{${numX}}{${denX}}$?`,
              `连续随机变量 $X$ 与 $Y$ 在三角形区域 $0 \\le y \\le x \\le 1$ 上的联合概率密度函数为 $f(x, y) = 2$。已知 $X = \\frac{${numX}}{${denX}}$，求条件概率密度函数 $f_{Y \\mid X}\\left(y \\;\\middle|\\; X = \\frac{${numX}}{${denX}}\\right)$ 在区间 $0 \\le y \\le \\frac{${numX}}{${denX}}$ 上的恒定值。`,
            ),
            answer: Q.of(denX, numX),
            mistakes: distinct(Q.of(denX, numX), [
              why(
                Q.of(numX, denX),
                "That is $x$ itself, the length of the slice, not its reciprocal.",
                "那是 $x$ 本身，即切片的长度，而不是它的倒数。",
              ),
              why(Q.of(2 * denX, numX), "That divides by $x$ instead of by the marginal $2x$.", "那是除以 $x$，而不是除以边缘密度 $2x$。"),
              why(2, "That is the joint density, before dividing by the marginal.", "那是联合密度，还没有除以边缘密度。"),
            ]),
            solution: walked(
              [
                [
                  ["Find the marginal", "求边缘密度"],
                  t(
                    "$f_X(x) = \\int_0^x 2 \\, dy = 2x$, so $f_{Y \\mid X}(y \\mid x) = \\frac{2}{2x} = \\frac{1}{x}$.",
                    "$f_X(x) = \\int_0^x 2 \\, dy = 2x$，所以 $f_{Y \\mid X}(y \\mid x) = \\frac{2}{2x} = \\frac{1}{x}$。",
                  ),
                ],
                [
                  ["Evaluate", "代入求值"],
                  t(
                    `At $x = \\frac{${numX}}{${denX}}$: $\\frac{${denX}}{${numX}}${lowestTerms(denX, numX)}$.`,
                    `在 $x = \\frac{${numX}}{${denX}}$ 处：$\\frac{${denX}}{${numX}}${lowestTerms(denX, numX)}$。`,
                  ),
                ],
              ],
              t(
                `The density $\\frac{${denX}}{${numX}}$ over an interval of length $\\frac{${numX}}{${denX}}$ integrates to $1$.`,
                `密度 $\\frac{${denX}}{${numX}}$ 在长度为 $\\frac{${numX}}{${denX}}$ 的区间上积分为 $1$。`,
              ),
            ),
          });
        },
      },
      {
        id: "probabilities-from-a-conditional-density",
        title: t("Probabilities from a conditional density", "由条件密度求概率"),
        explanation: t(
          "Once the conditional density $f_{Y \\mid X}(y \\mid x)$ is known, conditional probabilities are one-dimensional integrals:\n\n$$P(Y \\le c \\mid X = x) = \\int_{-\\infty}^{c} f_{Y \\mid X}(y \\mid x)\\,dy.$$\n\nFor $f(x, y) = 2$ on $0 \\le y \\le x \\le 1$, given $X = x$ the variable $Y$ is uniform on $[0, x]$, so $P(Y \\le c \\mid X = x) = \\frac{c}{x}$ for $0 \\le c \\le x$, and $1$ once $c \\ge x$. Given $X = 0.98$, $P(Y \\le 0.49 \\mid X = 0.98) = \\frac{1}{2}$.\n\n> **Watch out.** Divide by $x$, the length of the slice: $c$ alone uses the whole unit interval, and the joint density $2$ is not the conditional density.",
          "知道条件密度 $f_{Y \\mid X}(y \\mid x)$ 后，条件概率就是一维积分：\n\n$$P(Y \\le c \\mid X = x) = \\int_{-\\infty}^{c} f_{Y \\mid X}(y \\mid x)\\,dy.$$\n\n对 $0 \\le y \\le x \\le 1$ 上的 $f(x, y) = 2$，给定 $X = x$ 时 $Y$ 在 $[0, x]$ 上均匀分布，所以当 $0 \\le c \\le x$ 时 $P(Y \\le c \\mid X = x) = \\frac{c}{x}$，当 $c \\ge x$ 时为 $1$。给定 $X = 0.98$，$P(Y \\le 0.49 \\mid X = 0.98) = \\frac{1}{2}$。\n\n> **注意。** 要除以切片的长度 $x$：只取 $c$ 相当于用整个单位区间，而联合密度 $2$ 也不是条件密度。",
        ),
        generate: (rng: Rng): Problem => {
          const k = rng.int(3, 9);
          const x = Q.of(k, 10);
          const c = rng.bool(0.15) ? x.add(Q.of(1, 20)) : Q.of(rng.int(1, 2 * k - 1), 20);
          const ans = c.cmp(x) >= 0 ? Q.one : c.div(x);
          return numberProblem({
            prompt: t(
              `$(X, Y)$ has joint density $f(x, y) = 2$ on $0 \\le y \\le x \\le 1$. Find $P\\left(Y \\le ${dec(c)} \\mid X = ${dec(x)}\\right)$.`,
              `$(X, Y)$ 的联合密度为 $0 \\le y \\le x \\le 1$ 上的 $f(x, y) = 2$。求 $P\\left(Y \\le ${dec(c)} \\mid X = ${dec(x)}\\right)$。`,
            ),
            answer: ans,
            mistakes: distinct(ans, [
              why(
                c,
                "That is the length up to the cutoff, not divided by the slice length $x$.",
                "那是到分界点的长度，没有除以切片长度 $x$。",
              ),
              why(
                Q.of(2).mul(c),
                "That integrates the joint density $2$ instead of the conditional density.",
                "那是对联合密度 $2$ 积分，而不是对条件密度积分。",
              ),
              why(c.mul(x), "That multiplies by $x$ instead of dividing by it.", "那是乘以 $x$，而不是除以 $x$。"),
            ]).filter((m) => asQ(m.value).cmp(Q.of(2)) <= 0),
            solution: walked(
              [
                [
                  ["Find the conditional density", "求条件密度"],
                  t(
                    `$f_X(x) = 2x$, so $f_{Y \\mid X}(y \\mid x) = \\frac{2}{2x} = \\frac{1}{x}$ on $[0, x]$: $Y$ is uniform on $[0, ${dec(x)}]$.`,
                    `$f_X(x) = 2x$，所以在 $[0, x]$ 上 $f_{Y \\mid X}(y \\mid x) = \\frac{2}{2x} = \\frac{1}{x}$：$Y$ 在 $[0, ${dec(x)}]$ 上均匀分布。`,
                  ),
                ],
                [
                  ["Integrate up to the cutoff", "积分到分界点"],
                  t(
                    c.cmp(x) >= 0
                      ? `Since $${dec(c)} \\ge ${dec(x)}$, the probability is $1$.`
                      : `The probability is $\\frac{${dec(c)}}{${dec(x)}} = ${ans.toLatex()}$.`,
                    c.cmp(x) >= 0
                      ? `由于 $${dec(c)} \\ge ${dec(x)}$，概率为 $1$。`
                      : `概率为 $\\frac{${dec(c)}}{${dec(x)}} = ${ans.toLatex()}$。`,
                  ),
                ],
              ],
              t(
                `The answer lies between $0$ and $1$, and it is $1$ exactly when the cutoff reaches the end $${dec(x)}$ of the slice.`,
                `答案在 $0$ 与 $1$ 之间，并且恰在分界点达到切片端点 $${dec(x)}$ 时等于 $1$。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 5.18.5 The Joint CDF of Two Continuous Random Variables
  {
    id: "the-joint-cdf-of-two-continuous-random-variables",
    title: t("The Joint CDF of Two Continuous Random Variables", "两个连续型随机变量的联合累积分布函数"),
    summary: t(
      "For continuous random variables, $F_{X,Y}(x, y) = \\int_{-\\infty}^{x} \\int_{-\\infty}^{y} f(u, v)\\,dv\\,du$ and $f(x, y) = \\frac{\\partial^2 F}{\\partial x \\partial y}$.",
      "对连续型随机变量，$F_{X,Y}(x, y) = \\int_{-\\infty}^{x} \\int_{-\\infty}^{y} f(u, v)\\,dv\\,du$，且 $f(x, y) = \\frac{\\partial^2 F}{\\partial x \\partial y}$。",
    ),
    intro: t(
      "For $(X, Y)$ uniform on the unit square, $F(x, y)$ is the area of the lower-left rectangle, $xy$, so $F(\\frac{9}{10}, \\frac{7}{8}) = \\frac{63}{80}$. For the density $x + y$ the same rectangle holds $\\frac{ab(a + b)}{2}$ instead.\n\nCheck: $F(1, 1) = 1$ for both densities, as every joint CDF must reach.\n\nIn this lesson we evaluate joint CDFs of continuous variables by double integrals, for uniform and non-uniform densities, read the CDF of a region as a fraction of a rectangle and find rectangle probabilities from a joint CDF.",
      "若 $(X, Y)$ 在单位正方形上均匀分布，$F(x, y)$ 就是左下矩形的面积 $xy$，所以 $F(\\frac{9}{10}, \\frac{7}{8}) = \\frac{63}{80}$。对密度 $x + y$，同一矩形上的概率则是 $\\frac{ab(a + b)}{2}$。\n\n检验：两种密度都有 $F(1, 1) = 1$，这是任何联合分布函数都必须达到的。\n\n本课我们用二重积分计算连续变量的联合分布函数，包括均匀与非均匀的密度，把区域的分布函数看作矩形的一部分，并由联合分布函数求矩形的概率。",
    ),
    prerequisites: ["joint-distributions-for-continuous-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-joint-continuous-cdf",
        title: t("Evaluating double integral of joint density for CDF", "通过联合密度的二重积分计算累积分布函数值"),
        explanation: t(
          "The joint cumulative distribution function adds up the density over the region to the lower left of the point, so it is a double integral. The joint CDF is $F(x, y) = P(X \\le x, Y \\le y) = \\int_{-\\infty}^x \\int_{-\\infty}^y f(u, v) \\, dv \\, du$. For the uniform density on the unit square, $F(\\frac{9}{10}, \\frac{7}{8}) = \\frac{9}{10} \\cdot \\frac{7}{8} = \\frac{63}{80}$.\n\n> **Watch out.** The CDF is an area, so multiply the two sides of the rectangle; adding them, or using one side alone, does not give a probability of both events.",
          "联合累积分布函数把该点左下方区域上的密度加起来，所以它是一个二重积分。联合分布函数为 $F(x, y) = P(X \\le x, Y \\le y) = \\int_{-\\infty}^x \\int_{-\\infty}^y f(u, v) \\, dv \\, du$。对单位正方形上的均匀密度，$F(\\frac{9}{10}, \\frac{7}{8}) = \\frac{9}{10} \\cdot \\frac{7}{8} = \\frac{63}{80}$。\n\n> **注意。** 分布函数是面积，所以要把矩形的两边相乘；把它们相加或只用一边，都得不到两个事件同时发生的概率。",
        ),
        generate: (rng: Rng): Problem => {
          // f(x, y) = 1 on [0, 1] x [0, 1]
          // F(x, y) = x * y for 0 <= x, y <= 1
          const numX = rng.int(1, 6);
          const denX = numX + rng.int(1, 8);
          const numY = rng.int(1, 4);
          const denY = numY + rng.int(1, 4);
          const ansNum = numX * numY;
          const ansDen = denX * denY;

          return numberProblem({
            prompt: t(
              `Let $(X, Y)$ be uniformly distributed over the unit square $[0, 1] \\times [0, 1]$, so $f(x, y) = 1$. Evaluate the joint CDF $F_{X,Y}\\left(\\frac{${numX}}{${denX}}, \\frac{${numY}}{${denY}}\\right)$.`,
              `设 $(X, Y)$ 在单位正方形 $[0, 1] \\times [0, 1]$ 上服从均匀分布（即 $f(x, y) = 1$）。计算联合累积分布函数值 $F_{X,Y}\\left(\\frac{${numX}}{${denX}}, \\frac{${numY}}{${denY}}\\right)$。`,
            ),
            answer: Q.of(ansNum, ansDen),
            mistakes: distinct(Q.of(ansNum, ansDen), [
              why(
                Q.of(numX * denY + numY * denX, ansDen),
                "That adds the two sides instead of multiplying them.",
                "那是把两边相加，而不是相乘。",
              ),
              why(Q.of(numX + numY, denX + denY), "That adds the numerators and the denominators.", "那是把分子与分母分别相加。"),
              why(
                Q.of(numX, denX),
                "That is $P(X \\le x)$ alone; the event also needs $Y \\le y$.",
                "那只是 $P(X \\le x)$；事件还要求 $Y \\le y$。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Integrate the density", "对密度积分"],
                  t(
                    "$F_{X,Y}(x, y) = \\int_0^x \\int_0^y 1 \\, dv \\, du = xy$, the area of the lower-left rectangle.",
                    "$F_{X,Y}(x, y) = \\int_0^x \\int_0^y 1 \\, dv \\, du = xy$，即左下矩形的面积。",
                  ),
                ],
                [
                  ["Evaluate", "代入求值"],
                  t(
                    `$\\frac{${numX}}{${denX}} \\cdot \\frac{${numY}}{${denY}} = \\frac{${ansNum}}{${ansDen}}${lowestTerms(ansNum, ansDen)}$.`,
                    `$\\frac{${numX}}{${denX}} \\cdot \\frac{${numY}}{${denY}} = \\frac{${ansNum}}{${ansDen}}${lowestTerms(ansNum, ansDen)}$。`,
                  ),
                ],
              ],
              t(
                `The answer is below both $\\frac{${numX}}{${denX}}$ and $\\frac{${numY}}{${denY}}$, as a probability of both events must be.`,
                `答案比 $\\frac{${numX}}{${denX}}$ 与 $\\frac{${numY}}{${denY}}$ 都小，两个事件同时发生的概率理应如此。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-joint-cdf-of-a-non-uniform-density",
        figure: probabilityDrawings1["the-joint-cdf-of-two-continuous-random-variables#the-joint-cdf-of-a-non-uniform-density"],
        title: t("The joint CDF of a non-uniform density", "非均匀密度的联合分布函数"),
        explanation: t(
          "For a density that is not constant, integrate it over the lower-left rectangle. For $f(x, y) = x + y$ on the unit square and $0 \\le a, b \\le 1$:\n\n$$F(a, b) = \\int_0^{a}\\int_0^{b} (u + v)\\,dv\\,du = \\frac{a^{2}b + ab^{2}}{2} = \\frac{ab(a + b)}{2}.$$\n\nCheck: $F(1, 1) = 1$, as every joint CDF must reach. In the figure, $F(\\frac{1}{2}, \\frac{1}{2}) = \\frac{1}{8}$: a quarter of the area holds only an eighth of the probability, because the density is small near the origin. Along an edge, $F(1, 0.5) = \\frac{(0.5)(1.5)}{2} = 0.375$.\n\n> **Watch out.** Keep the division by $2$ and the factor $a + b$; $ab$ alone is the answer for a uniform density, not for $x + y$.",
          "对于非常数的密度，要在左下矩形上积分。对单位正方形上的 $f(x, y) = x + y$ 及 $0 \\le a, b \\le 1$：\n\n$$F(a, b) = \\int_0^{a}\\int_0^{b} (u + v)\\,dv\\,du = \\frac{a^{2}b + ab^{2}}{2} = \\frac{ab(a + b)}{2}.$$\n\n检验：$F(1, 1) = 1$，这是任何联合分布函数都必须达到的。图中 $F(\\frac{1}{2}, \\frac{1}{2}) = \\frac{1}{8}$：四分之一的面积只占八分之一的概率，因为原点附近密度较小。沿着一条边，$F(1, 0.5) = \\frac{(0.5)(1.5)}{2} = 0.375$。\n\n> **注意。** 不要丢掉除以 $2$ 和因子 $a + b$；只有 $ab$ 是均匀密度的答案，不是 $x + y$ 的。",
        ),
        generate: (rng: Rng): Problem => {
          const a = Q.of(rng.int(1, 9), 10);
          const b = Q.of(rng.int(1, 9), 10);
          const ans = a.mul(b).mul(a.add(b)).div(Q.of(2));
          return numberProblem({
            prompt: t(
              `$(X, Y)$ has joint density $f(x, y) = x + y$ on $0 \\le x, y \\le 1$. Find $F(${dec(a)}, ${dec(b)}) = P(X \\le ${dec(a)}, Y \\le ${dec(b)})$.`,
              `$(X, Y)$ 的联合密度为 $0 \\le x, y \\le 1$ 上的 $f(x, y) = x + y$。求 $F(${dec(a)}, ${dec(b)}) = P(X \\le ${dec(a)}, Y \\le ${dec(b)})$。`,
            ),
            answer: ans,
            form: "decimal",
            mistakes: distinct(ans, [
              why(a.mul(b), "That is the area of the rectangle, the answer for a uniform density.", "那是矩形的面积，是均匀密度的答案。"),
              why(a.mul(b).mul(a.add(b)), "That forgets to divide by $2$.", "那是忘了除以 $2$。"),
              why(a.add(b).div(Q.of(2)), "That drops the factor $ab$.", "那是丢掉了因子 $ab$。"),
            ]),
            solution: walked(
              [
                [
                  ["Integrate over the rectangle", "在矩形上积分"],
                  t(
                    "$F(a, b) = \\int_0^{a}\\int_0^{b} (u + v)\\,dv\\,du = \\frac{ab(a + b)}{2}$.",
                    "$F(a, b) = \\int_0^{a}\\int_0^{b} (u + v)\\,dv\\,du = \\frac{ab(a + b)}{2}$。",
                  ),
                ],
                [
                  ["Evaluate", "代入求值"],
                  t(
                    `$\\frac{(${dec(a)})(${dec(b)})(${dec(a.add(b))})}{2} = ${shown(ans)}$.`,
                    `$\\frac{(${dec(a)})(${dec(b)})(${dec(a.add(b))})}{2} = ${shown(ans)}$。`,
                  ),
                ],
              ],
              t(
                `The formula gives $F(1, 1) = \\frac{2}{2} = 1$, and $${dec(ans)}$ lies between $0$ and $1$.`,
                `公式给出 $F(1, 1) = \\frac{2}{2} = 1$，而 $${dec(ans)}$ 在 $0$ 与 $1$ 之间。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 5.18.6 Properties of the Joint CDF of Two Continuous Random Variables
  {
    id: "properties-of-the-joint-cdf-of-two-continuous-random-variables",
    title: t("Properties of the Joint CDF of Two Continuous Random Variables", "两个连续型随机变量联合累积分布函数的性质"),
    summary: t(
      "A joint CDF satisfies $0 \\le F(x, y) \\le 1$, is non-decreasing in each argument, has $F(\\infty, \\infty) = 1$ and $F(-\\infty, y) = F(x, -\\infty) = 0$, and gives every rectangle a non-negative probability.",
      "联合累积分布函数满足 $0 \\le F(x, y) \\le 1$，对每个自变量单调不减，$F(\\infty, \\infty) = 1$，$F(-\\infty, y) = F(x, -\\infty) = 0$，并且每个矩形的概率非负。",
    ),
    intro: t(
      "If $F(10, 20) = 0.95$, $F(5, 20) = 0.6$, $F(10, 8) = 0.7$ and $F(5, 8) = 0.4$, then $P(5 < X \\le 10, 8 < Y \\le 20) = 0.95 - 0.6 - 0.7 + 0.4 = 0.05$: subtract the two strips and add back the corner they both removed.\n\nCheck: $0.05$ is between $0$ and $1$; a negative result would signal a sign error.\n\nIn this lesson we write rectangle probabilities in terms of a joint CDF, evaluate them from CDF values and find a marginal CDF from a joint one.",
      "若 $F(10, 20) = 0.95$，$F(5, 20) = 0.6$，$F(10, 8) = 0.7$，$F(5, 8) = 0.4$，则 $P(5 < X \\le 10, 8 < Y \\le 20) = 0.95 - 0.6 - 0.7 + 0.4 = 0.05$：减去两个条带，再加回它们都减掉的角。\n\n检验：$0.05$ 在 $0$ 与 $1$ 之间；结果为负说明符号有误。\n\n本课我们用联合分布函数表示矩形的概率，由分布函数值计算它，并由联合分布函数求边缘分布函数。",
    ),
    prerequisites: ["the-joint-cdf-of-two-continuous-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "joint-cdf-rectangular-probability",
        title: t("Expressing rectangular probability in terms of the joint CDF", "用联合累积分布函数表示矩形区域上的概率"),
        explanation: t(
          "Subtracting the two strips removes their overlap twice, so the corner region must be added back once, as in inclusion and exclusion.\n\n$$P(a < X \\le b,\\ c < Y \\le d) = F(b, d) - F(a, d) - F(b, c) + F(a, c)$$\n\nSo $P(10 < X \\le 20, 30 < Y \\le 50) = F(20, 50) - F(10, 50) - F(20, 30) + F(10, 30)$.\n\n> **Watch out.** All four corners appear; the two mixed corners, one low bound and one high, are subtracted and the low corner is added.",
          "减去两个条带时它们的重叠部分被减了两次，所以要把角上的区域加回一次，这与容斥原理一样。\n\n$$P(a < X \\le b,\\ c < Y \\le d) = F(b, d) - F(a, d) - F(b, c) + F(a, c)$$\n\n所以 $P(10 < X \\le 20, 30 < Y \\le 50) = F(20, 50) - F(10, 50) - F(20, 30) + F(10, 30)$。\n\n> **注意。** 四个角都要出现；一低一高的两个混合角要减去，两个都低的角要加上。",
        ),
        generate: (rng: Rng): Problem => {
          const a = rng.int(1, 3);
          const b = a + rng.int(1, 3);
          const c = rng.int(1, 3);
          const d = c + rng.int(1, 3);

          const correctStr = `F(${b}, ${d}) - F(${a}, ${d}) - F(${b}, ${c}) + F(${a}, ${c})`;
          const alt1 = `F(${b}, ${d}) - F(${a}, ${c})`;
          const alt2 = `F(${b}, ${d}) - F(${a}, ${d}) + F(${b}, ${c}) - F(${a}, ${c})`;
          const alt3 = `F(${b}, ${d}) + F(${a}, ${d}) + F(${b}, ${c}) + F(${a}, ${c})`;

          const opts = [
            t(`$${correctStr}$`, `$${correctStr}$`),
            t(`$${alt1}$`, `$${alt1}$`),
            t(`$${alt2}$`, `$${alt2}$`),
            t(`$${alt3}$`, `$${alt3}$`),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);
          return reasoned(
            choiceProblem({
              prompt: t(
                `For any joint cumulative distribution function $F(x, y)$, which expression correctly computes the probability $P(${a} < X \\le ${b}, \\; ${c} < Y \\le ${d})$?`,
                `对于任意联合累积分布函数 $F(x, y)$，下列哪个表达式能够正确计算矩形概率 $P(${a} < X \\le ${b}, \\; ${c} < Y \\le ${d})$？`,
              ),
              options,
              correct,
              solution: walked(
                [
                  [
                    ["Subtract the strips", "减去条带"],
                    t(
                      `From $F(${b}, ${d})$, remove $X \\le ${a}$ with $F(${a}, ${d})$ and $Y \\le ${c}$ with $F(${b}, ${c})$.`,
                      `从 $F(${b}, ${d})$ 中用 $F(${a}, ${d})$ 去掉 $X \\le ${a}$ 的部分，用 $F(${b}, ${c})$ 去掉 $Y \\le ${c}$ 的部分。`,
                    ),
                  ],
                  [
                    ["Add back the corner", "加回角"],
                    t(
                      `The corner $X \\le ${a}, Y \\le ${c}$ was removed twice, so add $F(${a}, ${c})$: $F(${b}, ${d}) - F(${a}, ${d}) - F(${b}, ${c}) + F(${a}, ${c})$.`,
                      `角 $X \\le ${a}, Y \\le ${c}$ 被去掉了两次，所以加上 $F(${a}, ${c})$：$F(${b}, ${d}) - F(${a}, ${d}) - F(${b}, ${c}) + F(${a}, ${c})$。`,
                    ),
                  ],
                ],
                t(
                  "With the uniform distribution on a large square, each term is an area, and the four areas combine to the area of the rectangle.",
                  "对大正方形上的均匀分布，每一项都是面积，四个面积组合起来正是这个矩形的面积。",
                ),
              ),
            }),
            [
              [opts[1]!.en, "Only two corners are used: inclusion and exclusion needs all four.", "这里只用了两个角：容斥需要全部四个角。"],
              [
                opts[2]!.en,
                "The signs are wrong: the two corners that mix a low and a high bound are both subtracted.",
                "符号错了：一低一高的两个角都要减去。",
              ],
              [
                opts[3]!.en,
                "Adding all four corners counts regions outside the rectangle.",
                "把四个角全部相加，会把矩形以外的区域也算进去。",
              ],
            ],
          );
        },
      },
      {
        id: "a-rectangle-probability-from-cdf-values",
        figure:
          probabilityDrawings1["properties-of-the-joint-cdf-of-two-continuous-random-variables#a-rectangle-probability-from-cdf-values"],
        title: t("A rectangle probability from CDF values", "由分布函数值求矩形概率"),
        explanation: t(
          "Inclusion–exclusion on the four corners gives the probability of a rectangle:\n\n$$P(a < X \\le b, c < Y \\le d) = F(b, d) - F(a, d) - F(b, c) + F(a, c).$$\n\nThe corner $F(a, c)$ is subtracted twice, once in each middle term, so it is added back once. The result can never be negative; a negative answer signals a sign error. In the figure, $0.8 - 0.5 - 0.4 + 0.3 = 0.2$. With $F(b, d) = 0.95$, $F(a, d) = 0.6$, $F(b, c) = 0.7$ and $F(a, c) = 0.4$, the rectangle has probability $0.05$.\n\n> **Watch out.** Add $F(a, c)$ back exactly once: leaving it out, or adding it twice, gives the wrong area, and so does using only two corners.",
          "对四个角作容斥，就得到矩形的概率：\n\n$$P(a < X \\le b, c < Y \\le d) = F(b, d) - F(a, d) - F(b, c) + F(a, c).$$\n\n角 $F(a, c)$ 在中间两项中各被减去一次，共两次，所以要加回一次。结果不可能为负；得到负值说明符号有误。图中 $0.8 - 0.5 - 0.4 + 0.3 = 0.2$。若 $F(b, d) = 0.95$，$F(a, d) = 0.6$，$F(b, c) = 0.7$，$F(a, c) = 0.4$，则矩形的概率为 $0.05$。\n\n> **注意。** $F(a, c)$ 恰好加回一次：不加或加两次都会得到错误的面积，只用两个角也不对。",
        ),
        generate: (rng: Rng): Problem => {
          const ac = rng.int(2, 15);
          const ad = ac + rng.int(5, 20);
          const bc = ac + rng.int(5, 20);
          const bd = ad + bc - ac + rng.int(3, 30);
          const v = (n: number): Q => Q.of(n, 100);
          const ans = v(bd - ad - bc + ac);
          return numberProblem({
            prompt: t(
              `A joint CDF has $F(1, 2) = ${dec(v(ac))}$, $F(1, 5) = ${dec(v(ad))}$, $F(4, 2) = ${dec(v(bc))}$ and $F(4, 5) = ${dec(v(bd))}$. Find $P(1 < X \\le 4, 2 < Y \\le 5)$.`,
              `某联合分布函数满足 $F(1, 2) = ${dec(v(ac))}$，$F(1, 5) = ${dec(v(ad))}$，$F(4, 2) = ${dec(v(bc))}$，$F(4, 5) = ${dec(v(bd))}$。求 $P(1 < X \\le 4, 2 < Y \\le 5)$。`,
            ),
            answer: ans,
            form: "decimal",
            mistakes: distinct(ans, [
              why(
                v(bd - ad - bc),
                "That forgets to add back the corner $F(1, 2)$, removed twice.",
                "那是忘了加回被减了两次的角 $F(1, 2)$。",
              ),
              why(
                v(bd - ac),
                "That uses only two corners; inclusion and exclusion needs all four.",
                "那只用了两个角；容斥需要全部四个角。",
              ),
              why(v(bd - ad - bc + 2 * ac), "That adds the corner back twice instead of once.", "那是把角加回了两次，而不是一次。"),
            ]),
            solution: walked(
              [
                [
                  ["Write inclusion and exclusion", "写出容斥式"],
                  t(
                    "$P(1 < X \\le 4, 2 < Y \\le 5) = F(4, 5) - F(1, 5) - F(4, 2) + F(1, 2)$.",
                    "$P(1 < X \\le 4, 2 < Y \\le 5) = F(4, 5) - F(1, 5) - F(4, 2) + F(1, 2)$。",
                  ),
                ],
                [
                  ["Substitute", "代入"],
                  t(
                    `$${dec(v(bd))} - ${dec(v(ad))} - ${dec(v(bc))} + ${dec(v(ac))} = ${shown(ans)}$.`,
                    `$${dec(v(bd))} - ${dec(v(ad))} - ${dec(v(bc))} + ${dec(v(ac))} = ${shown(ans)}$。`,
                  ),
                ],
              ],
              t(
                `The answer $${dec(ans)}$ is between $0$ and $1$, and it is at most $F(4, 5) - F(1, 5) = ${dec(v(bd - ad))}$, the strip that contains the rectangle.`,
                `答案 $${dec(ans)}$ 在 $0$ 与 $1$ 之间，而且不超过包含该矩形的条带 $F(4, 5) - F(1, 5) = ${dec(v(bd - ad))}$。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 5.18.7 The Bivariate Normal Distribution
  {
    id: "the-bivariate-normal-distribution",
    title: t("The Bivariate Normal Distribution", "二元正态分布"),
    summary: t(
      "The bivariate normal distribution is determined by five parameters $\\mu_X, \\mu_Y, \\sigma_X^2, \\sigma_Y^2, \\rho$, and its contours of constant density are ellipses.",
      "二元正态分布由五个参数 $\\mu_X, \\mu_Y, \\sigma_X^2, \\sigma_Y^2, \\rho$ 决定，等密度线是椭圆。",
    ),
    intro: t(
      "Heights of parents and children might be bivariate normal with $\\mu_X = \\mu_Y = 170$, $\\sigma_X = \\sigma_Y = 10$ and $\\rho = 0.5$. For a parent of height $190$, two standard deviations up, the predicted child height is $170 + 0.5 \\cdot 20 = 180$, only one standard deviation up.\n\nCheck: the conditional variance $100(1 - 0.25) = 75$ is smaller than $100$, since knowing $X$ narrows down $Y$.\n\nIn this lesson we use the fact that zero correlation means independence for jointly normal variables, find conditional means and variances and read the correlation from the contour ellipses.",
      "父母与子女的身高可以看作二元正态分布，$\\mu_X = \\mu_Y = 170$，$\\sigma_X = \\sigma_Y = 10$，$\\rho = 0.5$。若父母身高 $190$，高出两个标准差，则子女身高的预测值为 $170 + 0.5 \\cdot 20 = 180$，只高出一个标准差。\n\n检验：条件方差 $100(1 - 0.25) = 75$ 小于 $100$，因为知道 $X$ 缩小了 $Y$ 的范围。\n\n本课我们利用联合正态变量零相关即独立这一事实，求条件均值和条件方差，并从等密度椭圆读出相关系数。",
    ),
    prerequisites: ["the-normal-distribution", "marginal-distributions-for-continuous-random-variables"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "bivariate-normal-zero-correlation-independence",
        title: t("Zero correlation implies independence for bivariate normal variables", "二元正态变量零相关即独立"),
        explanation: t(
          "For most pairs of variables zero correlation does not imply independence, but for jointly normal variables it does, because the density then factors. For jointly normal random variables, $\\operatorname{Cov}(X, Y) = 0$ (or $\\rho = 0$) is necessary and sufficient for independence. So a bivariate normal pair with $\\mu_X = 100$, $\\mu_Y = -50$ and $\\rho = 0$ is independent, while one with $\\rho = 0.05$ is not.\n\n> **Watch out.** The means and the variances play no part; only $\\rho$ decides. And this works because the pair is jointly normal, not for continuous variables in general.",
          "对大多数变量对来说，相关系数为零并不意味着独立，但对联合正态变量却成立，因为此时密度可以分解。对于联合正态随机变量，$\\operatorname{Cov}(X, Y) = 0$（或 $\\rho = 0$）是两者相互独立的充要条件。所以 $\\mu_X = 100$、$\\mu_Y = -50$、$\\rho = 0$ 的二元正态变量独立，而 $\\rho = 0.05$ 的则不独立。\n\n> **注意。** 均值与方差都不起作用，只有 $\\rho$ 起决定作用。这一结论成立是因为变量联合正态，对一般的连续变量并不成立。",
        ),
        generate: (rng: Rng): Problem => {
          const muX = rng.int(1, 25);
          const muY = rng.int(1, 25);
          const rho = rng.pick([0, 0.5, -0.4, 0.8]);
          const isZero = rho === 0;

          const opts = isZero
            ? [
                t(
                  "Yes, because for bivariate normal random variables, zero correlation ($\\rho = 0$) is equivalent to independence.",
                  "是，因为对于二元正态随机变量，零相关系数（$\\rho = 0$）等价于相互独立。",
                ),
                t(
                  "No, zero correlation never guarantees independence for continuous variables.",
                  "否，零相关在连续变量中绝不能保证相互独立。",
                ),
                t("Only if the means are both zero.", "仅当两个均值都为零时才成立。"),
                t("Only if the variances are equal ($\\sigma_X = \\sigma_Y$).", "仅当方差相等（$\\sigma_X = \\sigma_Y$）时才成立。"),
              ]
            : [
                t(
                  `No, because $\\rho = ${rho} \\ne 0$, meaning the variables are correlated and therefore not independent.`,
                  `否，因为相关系数 $\\rho = ${rho} \\ne 0$，说明变量相关，从而不独立。`,
                ),
                t("Yes, any bivariate normal distribution has independent marginals.", "是，任意二元正态分布都具有相互独立的边际分布。"),
                t("Yes, provided the conditional distribution is symmetric.", "是，只要条件分布对称即可。"),
                t(
                  "Cannot be determined without knowing the means $\\mu_X$ and $\\mu_Y$.",
                  "在未知均值 $\\mu_X$ 与 $\\mu_Y$ 的情况下无法确定。",
                ),
              ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);

          return reasoned(
            choiceProblem({
              prompt: t(
                `Suppose $(X, Y)$ follows a bivariate normal distribution with means $\\mu_X = ${muX}$, $\\mu_Y = ${muY}$, and correlation coefficient $\\rho = ${rho}$. Are $X$ and $Y$ independent?`,
                `设 $(X, Y)$ 服从均值为 $\\mu_X = ${muX}$、$\\mu_Y = ${muY}$ 且相关系数为 $\\rho = ${rho}$ 的二元正态分布。问 $X$ 与 $Y$ 是否相互独立？`,
              ),
              options,
              correct,
              solution: walked(
                [
                  [["Read the correlation", "读出相关系数"], t(`The correlation is $\\rho = ${rho}$.`, `相关系数为 $\\rho = ${rho}$。`)],
                  [
                    ["Apply the rule for jointly normal variables", "应用联合正态变量的结论"],
                    t(
                      isZero
                        ? "For jointly normal variables, the joint PDF factors if and only if $\\rho = 0$. Therefore, zero correlation implies independence."
                        : `Because $\\rho = ${rho} \\ne 0$, $X$ and $Y$ are correlated, so they cannot be independent.`,
                      isZero
                        ? "对于联合正态变量，联合密度函数可分解当且仅当相关系数 $\\rho = 0$。因此零相关意味着独立。"
                        : `因为 $\\rho = ${rho} \\ne 0$，故 $X$ 与 $Y$ 相关，因而不能独立。`,
                    ),
                  ],
                ],
                t(
                  isZero
                    ? "With $\\rho = 0$ the cross term in the exponent of the density vanishes, and the density splits into the two normal marginals."
                    : "Independent variables have covariance $0$, so a nonzero $\\rho$ rules independence out.",
                  isZero
                    ? "当 $\\rho = 0$ 时，密度指数中的交叉项消失，密度分解为两个正态边缘密度之积。"
                    : "独立变量的协方差为 $0$，所以非零的 $\\rho$ 排除了独立性。",
                ),
              ),
            }),
            isZero
              ? [
                  [
                    opts[1]!.en,
                    "That holds for continuous variables in general, but jointly normal variables are the exception.",
                    "这对一般的连续变量成立，但联合正态变量是例外。",
                  ],
                  [
                    opts[2]!.en,
                    "The means only shift the distribution; they do not affect independence.",
                    "均值只是平移分布，不影响独立性。",
                  ],
                  [
                    opts[3]!.en,
                    "The variances only stretch the axes; they do not affect independence.",
                    "方差只是拉伸坐标轴，不影响独立性。",
                  ],
                ]
              : [
                  [
                    opts[1]!.en,
                    "Bivariate normal marginals are independent only when $\\rho = 0$.",
                    "二元正态的边缘变量只有在 $\\rho = 0$ 时才独立。",
                  ],
                  [
                    opts[2]!.en,
                    "Symmetry of the conditional distribution says nothing about independence.",
                    "条件分布对称与否与独立性无关。",
                  ],
                  [
                    opts[3]!.en,
                    "The means do not matter; the nonzero correlation already decides.",
                    "均值无关紧要；非零的相关系数已经可以判定。",
                  ],
                ],
          );
        },
      },
      {
        id: "the-conditional-mean-of-a-bivariate-normal",
        title: t("The conditional mean of a bivariate normal", "二元正态的条件均值"),
        explanation: t(
          "For a bivariate normal pair, the conditional distribution of $Y$ given $X = x$ is normal, with a mean that is linear in $x$:\n\n$$E[Y \\mid X = x] = \\mu_Y + \\rho\\frac{\\sigma_Y}{\\sigma_X}(x - \\mu_X), \\qquad \\operatorname{Var}(Y \\mid X = x) = \\sigma_Y^{2}(1 - \\rho^{2}).$$\n\nThis is the population regression line. Since $|\\rho| < 1$, the prediction moves fewer standard deviations than $x$ did: regression toward the mean. With $\\mu_X = \\mu_Y = 170$, $\\sigma_X = \\sigma_Y = 10$ and $\\rho = 0.5$, $E[Y \\mid X = 190] = 170 + 0.5 \\cdot 20 = 180$.\n\n> **Watch out.** The slope is $\\rho\\frac{\\sigma_Y}{\\sigma_X}$, with $\\sigma_Y$ on top; dropping $\\rho$ or inverting the ratio gives the wrong line, and $\\mu_Y$ alone ignores $x$.",
          "对二元正态变量，给定 $X = x$ 时 $Y$ 的条件分布仍是正态，其均值关于 $x$ 线性：\n\n$$E[Y \\mid X = x] = \\mu_Y + \\rho\\frac{\\sigma_Y}{\\sigma_X}(x - \\mu_X), \\qquad \\operatorname{Var}(Y \\mid X = x) = \\sigma_Y^{2}(1 - \\rho^{2}).$$\n\n这就是总体回归直线。由于 $|\\rho| < 1$，预测值偏离的标准差个数比 $x$ 少：这就是向均值回归。若 $\\mu_X = \\mu_Y = 170$，$\\sigma_X = \\sigma_Y = 10$，$\\rho = 0.5$，则 $E[Y \\mid X = 190] = 170 + 0.5 \\cdot 20 = 180$。\n\n> **注意。** 斜率是 $\\rho\\frac{\\sigma_Y}{\\sigma_X}$，$\\sigma_Y$ 在分子上；丢掉 $\\rho$ 或把比值倒过来都会得到错误的直线，而只取 $\\mu_Y$ 则忽略了 $x$。",
        ),
        generate: (rng: Rng): Problem => {
          const muX = rng.int(20, 80);
          const muY = rng.int(20, 80);
          const sx = rng.int(2, 10);
          const sy = rng.int(2, 10);
          const rho = Q.of(rng.pick([-8, -6, -5, -4, -2, 2, 3, 4, 5, 6, 8]), 10);
          const x = muX + rng.pick([-2, -1, 1, 2]) * sx;
          const slope = rho.mul(Q.of(sy, sx));
          const ans = Q.of(muY).add(slope.mul(Q.of(x - muX)));
          return numberProblem({
            prompt: t(
              `$(X, Y)$ is bivariate normal with $\\mu_X = ${muX}$, $\\sigma_X = ${sx}$, $\\mu_Y = ${muY}$, $\\sigma_Y = ${sy}$ and $\\rho = ${dec(rho)}$. Find $E[Y \\mid X = ${x}]$.`,
              `$(X, Y)$ 服从二元正态分布，$\\mu_X = ${muX}$，$\\sigma_X = ${sx}$，$\\mu_Y = ${muY}$，$\\sigma_Y = ${sy}$，$\\rho = ${dec(rho)}$。求 $E[Y \\mid X = ${x}]$。`,
            ),
            answer: ans,
            form: "decimal",
            mistakes: distinct(ans, [
              why(Q.of(muY), "That is the unconditional mean; it ignores the given $x$.", "那是无条件均值，忽略了给定的 $x$。"),
              why(
                Q.of(muY).add(rho.mul(Q.of(sx, sy)).mul(Q.of(x - muX))),
                "That inverts the ratio of standard deviations; $\\sigma_Y$ goes on top.",
                "那是把标准差之比倒过来了；$\\sigma_Y$ 应在分子上。",
              ),
              why(
                Q.of(muY).add(Q.of(sy, sx).mul(Q.of(x - muX))),
                "That drops the correlation $\\rho$ from the slope.",
                "那是从斜率中丢掉了相关系数 $\\rho$。",
              ),
            ]).filter((m) => isTerminating(asQ(m.value))),
            solution: walked(
              [
                [
                  ["Find the slope", "求斜率"],
                  t(
                    `$\\rho\\frac{\\sigma_Y}{\\sigma_X} = ${par(rho)} \\cdot \\frac{${sy}}{${sx}}$, and $x - \\mu_X = ${x - muX}$.`,
                    `$\\rho\\frac{\\sigma_Y}{\\sigma_X} = ${par(rho)} \\cdot \\frac{${sy}}{${sx}}$，$x - \\mu_X = ${x - muX}$。`,
                  ),
                ],
                [
                  ["Move from the mean", "从均值出发"],
                  t(
                    `$E[Y \\mid X = ${x}] = ${muY} + ${par(rho)} \\cdot \\frac{${sy}}{${sx}} \\cdot ${par(Q.of(x - muX))} = ${shown(ans)}$.`,
                    `$E[Y \\mid X = ${x}] = ${muY} + ${par(rho)} \\cdot \\frac{${sy}}{${sx}} \\cdot ${par(Q.of(x - muX))} = ${shown(ans)}$。`,
                  ),
                ],
              ],
              t(
                `In standard units, $x$ is $${(x - muX) / sx}$ standard deviations from $\\mu_X$ and the prediction is $${dec(rho.mul(Q.of((x - muX) / sx)))}$ standard deviations from $\\mu_Y$, which is $\\rho$ times as far.`,
                `用标准单位表示，$x$ 偏离 $\\mu_X$ 共 $${(x - muX) / sx}$ 个标准差，预测值偏离 $\\mu_Y$ 共 $${dec(rho.mul(Q.of((x - muX) / sx)))}$ 个标准差，是前者的 $\\rho$ 倍。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 5.19.1 Linear Combinations of Binomial Random Variables
  {
    id: "linear-combinations-of-binomial-random-variables",
    title: t("Linear Combinations of Binomial Random Variables", "二项随机变量的线性组合"),
    summary: t(
      "The sum of independent binomial random variables with the same success probability p satisfies X + Y ~ Binomial(n1 + n2, p).",
      "具有相同成功概率 p 的独立二项随机变量之和满足 X + Y ~ Binomial(n1 + n2, p)。",
    ),
    intro: t(
      "A clinic tests $150$ patients in the morning and $250$ in the afternoon, each positive with probability $0.3$, independently. The day's positives are $\\text{Binomial}(400, 0.3)$, with mean $120$.\n\nCheck: the morning mean $45$ and the afternoon mean $75$ add to $120$.\n\nIn this lesson we add independent binomials with the same success probability, find the mean and variance of a difference of binomials and find the probability that two binomial counts are both zero.",
      "某诊所上午检测 $150$ 名病人，下午检测 $250$ 名，每人独立地以概率 $0.3$ 呈阳性。全天阳性人数服从 $\\text{Binomial}(400, 0.3)$，均值为 $120$。\n\n检验：上午的均值 $45$ 与下午的均值 $75$ 相加为 $120$。\n\n本课我们把成功概率相同的独立二项变量相加，求二项变量之差的均值与方差，并求两个二项计数都为零的概率。",
    ),
    prerequisites: ["the-binomial-distribution", "properties-of-expectation-for-discrete-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "sum-of-independent-binomials-same-p",
        title: t("Adding independent binomial variables with identical p", "具有相同成功概率的独立二项变量求和"),
        explanation: t(
          "Two sets of independent trials with the same success probability can be combined into one longer set, so the total is binomial with the trials added. If $X \\sim \\text{Binomial}(n_1, p)$ and $Y \\sim \\text{Binomial}(n_2, p)$ are independent, then $X + Y \\sim \\text{Binomial}(n_1 + n_2, p)$. So $\\text{Binomial}(150, 0.3)$ plus an independent $\\text{Binomial}(250, 0.3)$ is $\\text{Binomial}(400, 0.3)$.\n\n> **Watch out.** The trials add: not the larger of the two, not their product, and not the mean $np$ of the total.",
          "两组成功概率相同的独立试验可以合并成更长的一组，所以总数服从试验次数相加的二项分布。若 $X \\sim \\text{Binomial}(n_1, p)$ 与 $Y \\sim \\text{Binomial}(n_2, p)$ 相互独立，则 $X + Y \\sim \\text{Binomial}(n_1 + n_2, p)$。所以 $\\text{Binomial}(150, 0.3)$ 加上独立的 $\\text{Binomial}(250, 0.3)$ 服从 $\\text{Binomial}(400, 0.3)$。\n\n> **注意。** 试验次数相加：不是取两者中较大的，不是相乘，也不是总数的均值 $np$。",
        ),
        generate: (rng: Rng): Problem => {
          const n1 = rng.int(5, 50);
          const n2 = rng.int(5, 50);
          const nSum = n1 + n2;

          return numberProblem({
            prompt: t(
              `Let $X \\sim \\text{Binomial}(${n1}, 0.3)$ and $Y \\sim \\text{Binomial}(${n2}, 0.3)$ be independent random variables. Their sum $S = X + Y$ follows a binomial distribution $\\text{Binomial}(n, 0.3)$. Find the trial parameter $n$.`,
              `设 $X \\sim \\text{Binomial}(${n1}, 0.3)$ 与 $Y \\sim \\text{Binomial}(${n2}, 0.3)$ 为相互独立的随机变量。其和 $S = X + Y$ 服从二项分布 $\\text{Binomial}(n, 0.3)$。求试验次数参数 $n$。`,
            ),
            answer: nSum,
            mistakes: distinct(nSum, [
              why(Math.max(n1, n2), "That keeps only the larger group of trials.", "那只保留了较多的那一组试验。"),
              why(n1 * n2, "That multiplies the numbers of trials instead of adding them.", "那是把试验次数相乘，而不是相加。"),
              why(Q.of(nSum * 3, 10), "That is the mean $np$ of the sum, not its number of trials.", "那是和的均值 $np$，不是试验次数。"),
            ]),
            solution: walked(
              [
                [
                  ["Combine the trials", "合并试验"],
                  t(
                    `$X$ counts successes in $${n1}$ trials and $Y$ in another $${n2}$, all with success probability $0.3$.`,
                    `$X$ 计 $${n1}$ 次试验中的成功次数，$Y$ 计另外 $${n2}$ 次试验中的成功次数，成功概率都是 $0.3$。`,
                  ),
                ],
                [["Add the trials", "试验次数相加"], t(`$n = ${n1} + ${n2} = ${nSum}$.`, `$n = ${n1} + ${n2} = ${nSum}$。`)],
              ],
              t(
                `The means agree: $0.3 \\cdot ${n1} + 0.3 \\cdot ${n2} = 0.3 \\cdot ${nSum}$.`,
                `均值一致：$0.3 \\cdot ${n1} + 0.3 \\cdot ${n2} = 0.3 \\cdot ${nSum}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-mean-and-variance-of-a-difference-of-binomials",
        title: t("The mean and variance of a difference of binomials", "二项变量之差的均值与方差"),
        explanation: t(
          "When the success probabilities differ, $X + Y$ is no longer binomial, but its moments are still easy. For independent $X \\sim \\text{Bin}(n_1, p_1)$ and $Y \\sim \\text{Bin}(n_2, p_2)$,\n\n$$E[X - Y] = n_1p_1 - n_2p_2, \\qquad \\operatorname{Var}(X - Y) = n_1p_1(1 - p_1) + n_2p_2(1 - p_2).$$\n\nThe variances **add** even for a difference, because $\\operatorname{Var}(-Y) = (-1)^{2}\\operatorname{Var}(Y)$. For $X \\sim \\text{Bin}(100, 0.5)$ and $Y \\sim \\text{Bin}(200, 0.1)$, $\\operatorname{Var}(X - Y) = 25 + 18 = 43$.\n\n> **Watch out.** Add the variances, do not subtract them; each uses its own $n$ and $p$, and the variance $np(1 - p)$ is not the mean $np$.",
          "当成功概率不同时，$X + Y$ 不再服从二项分布，但其矩仍然容易计算。对独立的 $X \\sim \\text{Bin}(n_1, p_1)$ 与 $Y \\sim \\text{Bin}(n_2, p_2)$，\n\n$$E[X - Y] = n_1p_1 - n_2p_2, \\qquad \\operatorname{Var}(X - Y) = n_1p_1(1 - p_1) + n_2p_2(1 - p_2).$$\n\n即使是差，方差也要**相加**，因为 $\\operatorname{Var}(-Y) = (-1)^{2}\\operatorname{Var}(Y)$。对 $X \\sim \\text{Bin}(100, 0.5)$ 与 $Y \\sim \\text{Bin}(200, 0.1)$，$\\operatorname{Var}(X - Y) = 25 + 18 = 43$。\n\n> **注意。** 方差要相加，不能相减；每个变量用它自己的 $n$ 与 $p$，而方差 $np(1 - p)$ 不是均值 $np$。",
        ),
        generate: (rng: Rng): Problem => {
          const n1 = rng.int(5, 60);
          const n2 = rng.int(5, 60);
          const p1 = Q.of(rng.int(1, 9), 10);
          let p2 = Q.of(rng.int(1, 9), 10);
          if (p2.eq(p1)) p2 = Q.one.sub(p1).eq(p1) ? Q.of(1, 5) : Q.one.sub(p1);
          const v1 = Q.of(n1).mul(p1).mul(Q.one.sub(p1));
          const v2 = Q.of(n2).mul(p2).mul(Q.one.sub(p2));
          const ans = v1.add(v2);
          return numberProblem({
            prompt: t(
              `$X \\sim \\text{Bin}(${n1}, ${dec(p1)})$ and $Y \\sim \\text{Bin}(${n2}, ${dec(p2)})$ are independent. Find $\\operatorname{Var}(X - Y)$.`,
              `$X \\sim \\text{Bin}(${n1}, ${dec(p1)})$ 与 $Y \\sim \\text{Bin}(${n2}, ${dec(p2)})$ 相互独立。求 $\\operatorname{Var}(X - Y)$。`,
            ),
            answer: ans,
            form: "decimal",
            mistakes: distinct(ans, [
              why(v1.sub(v2), "That subtracts the variances; for a difference they still add.", "那是把方差相减；即使是差，方差也要相加。"),
              why(
                Q.of(n1).mul(p1).add(Q.of(n2).mul(p2)),
                "That adds the means $np$ instead of the variances $np(1 - p)$.",
                "那是把均值 $np$ 相加，而不是方差 $np(1 - p)$。",
              ),
              why(
                Q.of(n1 + n2)
                  .mul(p1)
                  .mul(Q.one.sub(p1)),
                "That uses $p_1$ for both variables, as if $X - Y$ were binomial.",
                "那是对两个变量都用 $p_1$，好像 $X - Y$ 服从二项分布。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find each variance", "求各自的方差"],
                  t(
                    `$\\operatorname{Var}(X) = ${n1} \\cdot ${dec(p1)} \\cdot ${dec(Q.one.sub(p1))} = ${dec(v1)}$ and $\\operatorname{Var}(Y) = ${n2} \\cdot ${dec(p2)} \\cdot ${dec(Q.one.sub(p2))} = ${dec(v2)}$.`,
                    `$\\operatorname{Var}(X) = ${n1} \\cdot ${dec(p1)} \\cdot ${dec(Q.one.sub(p1))} = ${dec(v1)}$，$\\operatorname{Var}(Y) = ${n2} \\cdot ${dec(p2)} \\cdot ${dec(Q.one.sub(p2))} = ${dec(v2)}$。`,
                  ),
                ],
                [
                  ["Add them", "相加"],
                  t(
                    `$\\operatorname{Var}(X - Y) = ${dec(v1)} + ${dec(v2)} = ${shown(ans)}$.`,
                    `$\\operatorname{Var}(X - Y) = ${dec(v1)} + ${dec(v2)} = ${shown(ans)}$。`,
                  ),
                ],
              ],
              t(
                `The variance of the difference exceeds each variance alone, since subtracting $Y$ adds its spread rather than removing it.`,
                `差的方差比每个单独的方差都大，因为减去 $Y$ 会增加而不是消除它的波动。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 5.19.2 Linear Combinations of Poisson Random Variables
  {
    id: "linear-combinations-of-poisson-random-variables",
    title: t("Linear Combinations of Poisson Random Variables", "泊松随机变量的线性组合"),
    summary: t(
      "The sum of independent Poisson random variables is Poisson: if X ~ Poisson(λ1) and Y ~ Poisson(λ2) are independent, X + Y ~ Poisson(λ1 + λ2).",
      "独立泊松随机变量之和仍服从泊松分布：若独立变量 X ~ Poisson(λ1) 且 Y ~ Poisson(λ2)，则 X + Y ~ Poisson(λ1 + λ2)。",
    ),
    intro: t(
      "A shop gets $2$ calls an hour on one line and $1$ on another, independently. The total is $\\text{Poisson}(3)$, so the chance of exactly $4$ calls in an hour is $e^{-3}\\frac{3^{4}}{4!} \\approx 0.1680$.\n\nCheck: the mean number of calls, $3$, is the sum of the two means, as it must be for any sum.\n\nIn this lesson we add independent Poisson variables, find probabilities for their sum and find the distribution of one count given the total.",
      "某店一条线路每小时平均来电 $2$ 次，另一条 $1$ 次，相互独立。总来电数服从 $\\text{Poisson}(3)$，所以一小时内恰好来电 $4$ 次的概率为 $e^{-3}\\frac{3^{4}}{4!} \\approx 0.1680$。\n\n检验：来电次数的均值 $3$ 是两个均值之和，任何和都应如此。\n\n本课我们把独立的泊松变量相加，求它们之和的概率，并求给定总数时一个计数的分布。",
    ),
    prerequisites: ["the-poisson-distribution", "properties-of-expectation-for-discrete-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "sum-of-independent-poisson-parameters",
        title: t("Adding independent Poisson variables", "独立泊松变量求和"),
        explanation: t(
          "Counting events from two independent sources together is still a Poisson count, with the two rates added. For independent $X \\sim \\text{Poisson}(\\lambda_1)$ and $Y \\sim \\text{Poisson}(\\lambda_2)$, $X + Y \\sim \\text{Poisson}(\\lambda_1 + \\lambda_2)$. So $\\text{Poisson}(45)$ plus an independent $\\text{Poisson}(60)$ is $\\text{Poisson}(105)$.\n\n> **Watch out.** The rates add: they are not multiplied, averaged or subtracted.",
          "把两个独立来源的事件合起来计数，仍是泊松计数，速率为两者之和。若 $X \\sim \\text{Poisson}(\\lambda_1)$ 与 $Y \\sim \\text{Poisson}(\\lambda_2)$ 相互独立，则 $X + Y \\sim \\text{Poisson}(\\lambda_1 + \\lambda_2)$。所以 $\\text{Poisson}(45)$ 加上独立的 $\\text{Poisson}(60)$ 服从 $\\text{Poisson}(105)$。\n\n> **注意。** 速率相加：不是相乘、取平均或相减。",
        ),
        generate: (rng: Rng): Problem => {
          const l1 = rng.int(2, 40);
          const l2 = rng.int(2, 40);
          const lSum = l1 + l2;

          return numberProblem({
            prompt: t(
              `Let $X \\sim \\text{Poisson}(${l1})$ and $Y \\sim \\text{Poisson}(${l2})$ be independent random variables. Find the parameter $\\lambda$ of their sum $S = X + Y \\sim \\text{Poisson}(\\lambda)$.`,
              `设 $X \\sim \\text{Poisson}(${l1})$ 与 $Y \\sim \\text{Poisson}(${l2})$ 为相互独立的随机变量。求其和 $S = X + Y \\sim \\text{Poisson}(\\lambda)$ 的参数 $\\lambda$。`,
            ),
            answer: lSum,
            mistakes: distinct(lSum, [
              why(l1 * l2, "That multiplies the rates instead of adding them.", "那是把速率相乘，而不是相加。"),
              why(
                Q.of(lSum, 2),
                "That averages the rates; the sum counts the events of both.",
                "那是对速率取平均；和要计入两者的全部事件。",
              ),
              why(Math.abs(l1 - l2), "That subtracts the rates instead of adding them.", "那是把速率相减，而不是相加。"),
            ]),
            solution: walked(
              [
                [
                  ["Use the additive property", "利用可加性"],
                  t("A sum of independent Poisson variables is Poisson, with the rates added.", "独立泊松变量之和服从泊松分布，速率相加。"),
                ],
                [["Add the rates", "速率相加"], t(`$\\lambda = ${l1} + ${l2} = ${lSum}$.`, `$\\lambda = ${l1} + ${l2} = ${lSum}$。`)],
              ],
              t(
                `The mean of $S$ is $E[X] + E[Y] = ${l1} + ${l2} = ${lSum}$, which is the Poisson mean $\\lambda$.`,
                `$S$ 的均值为 $E[X] + E[Y] = ${l1} + ${l2} = ${lSum}$，正是泊松分布的均值 $\\lambda$。`,
              ),
            ),
          });
        },
      },
      {
        id: "probabilities-for-a-sum-of-poissons",
        title: t("Probabilities for a sum of Poissons", "泊松变量之和的概率"),
        explanation: t(
          "Once the rates are added, a probability about the total is a single Poisson calculation:\n\n$$P(X + Y = k) = e^{-(\\lambda_1 + \\lambda_2)}\\frac{(\\lambda_1 + \\lambda_2)^{k}}{k!}.$$\n\nIf a shop gets $2$ calls per hour on one line and $1$ on another, independently, the chance of exactly $4$ calls in total in an hour is $e^{-3}\\frac{3^{4}}{24} \\approx 0.1680$. Computing it from the two separate distributions would need a sum over all ways to split the $4$ calls. With rates $5$ and $4$, $P(X + Y = 10) = e^{-9}\\frac{9^{10}}{10!} \\approx 0.1186$.\n\n> **Watch out.** Add the rates first and use one Poisson probability; multiplying or adding the two separate probabilities of $k$ does not give the total's probability.",
          "把强度相加后，关于总数的概率只需一次泊松计算：\n\n$$P(X + Y = k) = e^{-(\\lambda_1 + \\lambda_2)}\\frac{(\\lambda_1 + \\lambda_2)^{k}}{k!}.$$\n\n若某店一条线路每小时平均来电 $2$ 次，另一条 $1$ 次，相互独立，则一小时内总共恰好 $4$ 次来电的概率为 $e^{-3}\\frac{3^{4}}{24} \\approx 0.1680$。若用两个分布分别计算，需要对 $4$ 次来电的所有分配方式求和。若速率为 $5$ 与 $4$，则 $P(X + Y = 10) = e^{-9}\\frac{9^{10}}{10!} \\approx 0.1186$。\n\n> **注意。** 先把速率相加，再用一次泊松概率；把两个变量各自取 $k$ 的概率相乘或相加，都得不到总数的概率。",
        ),
        generate: (rng: Rng): Problem => {
          const l1 = Q.of(rng.int(2, 30), 10);
          const l2 = Q.of(rng.int(2, 30), 10);
          const lam = l1.add(l2).toNumber();
          const k = rng.int(0, 6);
          let fact = 1;
          for (let i = 2; i <= k; i++) fact *= i;
          const pk = (l: number): number => (Math.exp(-l) * l ** k) / fact;
          const r4 = (x: number): Q => Q.of(Math.round(x * 10000), 10000);
          const ans = r4(pk(lam));
          const wrong = distinct(ans, [
            why(
              r4(pk(l1.toNumber()) * pk(l2.toNumber())),
              "That multiplies the two separate probabilities of $k$.",
              "那是把两个变量各自取 $k$ 的概率相乘。",
            ),
            why(
              r4(pk(l1.toNumber()) + pk(l2.toNumber())),
              "That adds the two separate probabilities of $k$.",
              "那是把两个变量各自取 $k$ 的概率相加。",
            ),
            why(r4(1 - pk(lam)), "That is the probability that the total is not $k$.", "那是总数不等于 $k$ 的概率。"),
          ]);
          const lamTex = dec(l1.add(l2));
          const power = k === 1 ? lamTex : `${lamTex}^{${k}}`;
          return numberProblem({
            prompt: t(
              `$X \\sim \\text{Poisson}(${dec(l1)})$ and $Y \\sim \\text{Poisson}(${dec(l2)})$ are independent. Find $P(X + Y = ${k})$, rounded to four decimal places.`,
              `$X \\sim \\text{Poisson}(${dec(l1)})$ 与 $Y \\sim \\text{Poisson}(${dec(l2)})$ 相互独立。求 $P(X + Y = ${k})$，精确到四位小数。`,
            ),
            answer: ans,
            form: "decimal",
            mistakes: wrong,
            solution: walked(
              [
                [
                  ["Add the rates", "速率相加"],
                  t(
                    `$X + Y \\sim \\text{Poisson}(${dec(l1)} + ${dec(l2)}) = \\text{Poisson}(${lamTex})$.`,
                    `$X + Y \\sim \\text{Poisson}(${dec(l1)} + ${dec(l2)}) = \\text{Poisson}(${lamTex})$。`,
                  ),
                ],
                [
                  ["Use the Poisson formula", "使用泊松公式"],
                  t(
                    `$P(X + Y = ${k}) = e^{-${lamTex}}\\frac{${power}}{${k}!} \\approx ${dec(ans)}$.`,
                    `$P(X + Y = ${k}) = e^{-${lamTex}}\\frac{${power}}{${k}!} \\approx ${dec(ans)}$。`,
                  ),
                ],
              ],
              t(
                `The answer is a probability between $0$ and $1$, and the total has mean $${lamTex}$, the sum of the two means.`,
                `答案是 $0$ 与 $1$ 之间的概率，而总数的均值 $${lamTex}$ 是两个均值之和。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 5.19.3 Combining Two Normally Distributed Random Variables
  {
    id: "combining-two-normally-distributed-random-variables",
    title: t("Combining Two Normally Distributed Random Variables", "组合两个正态随机变量"),
    summary: t(
      "A linear combination of independent normal variables is normal: if $X \\sim N(\\mu_1, \\sigma_1^2)$ and $Y \\sim N(\\mu_2, \\sigma_2^2)$, then $aX + bY \\sim N(a\\mu_1 + b\\mu_2, a^2\\sigma_1^2 + b^2\\sigma_2^2)$.",
      "独立正态变量的线性组合仍服从正态分布：若 $X \\sim N(\\mu_1, \\sigma_1^2)$、$Y \\sim N(\\mu_2, \\sigma_2^2)$ 独立，则 $aX + bY \\sim N(a\\mu_1 + b\\mu_2, a^2\\sigma_1^2 + b^2\\sigma_2^2)$。",
    ),
    intro: t(
      "A bolt's length is $N(50, 9)$ and a hole's depth is $N(52, 16)$, independently. The difference $D = \\text{bolt} - \\text{hole}$ is $N(-2, 25)$, so the bolt is longer than the hole with probability $P(D > 0) = 1 - \\Phi\\left(\\frac{2}{5}\\right)$.\n\nCheck: the variances add, $9 + 16 = 25$, even though the lengths are subtracted.\n\nIn this lesson we find the variance of a combination of two independent normals, compare multiples of two normal variables and find the probability that one normal exceeds another.",
      "螺栓长度服从 $N(50, 9)$，孔深服从 $N(52, 16)$，相互独立。差 $D = \\text{螺栓} - \\text{孔}$ 服从 $N(-2, 25)$，所以螺栓比孔长的概率为 $P(D > 0) = 1 - \\Phi\\left(\\frac{2}{5}\\right)$。\n\n检验：虽然长度相减，方差仍相加，$9 + 16 = 25$。\n\n本课我们求两个独立正态变量组合的方差，比较两个正态变量的倍数，并求一个正态变量超过另一个的概率。",
    ),
    prerequisites: ["the-normal-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "variance-of-two-normal-linear-combination",
        title: t("Variance of linear combination of two independent normals", "两个独立正态变量线性组合的方差"),
        explanation: t(
          "A combination of independent normal variables is normal again, and its variance uses the squares of the coefficients. $\\operatorname{Var}(aX + bY) = a^2 \\operatorname{Var}(X) + b^2 \\operatorname{Var}(Y)$ when $X$ and $Y$ are independent. With $\\operatorname{Var}(X) = 3$ and $\\operatorname{Var}(Y) = 2$, $\\operatorname{Var}(10X - 20Y) = 100 \\cdot 3 + 400 \\cdot 2 = 1100$.\n\n> **Watch out.** Square the coefficients, so a minus sign becomes a plus: the variances add even for a difference.",
          "独立正态变量的组合仍然是正态的，它的方差要用系数的平方。当 $X$ 与 $Y$ 独立时，$\\operatorname{Var}(aX + bY) = a^2 \\operatorname{Var}(X) + b^2 \\operatorname{Var}(Y)$。若 $\\operatorname{Var}(X) = 3$，$\\operatorname{Var}(Y) = 2$，则 $\\operatorname{Var}(10X - 20Y) = 100 \\cdot 3 + 400 \\cdot 2 = 1100$。\n\n> **注意。** 系数要平方，所以负号变成正号：即使是差，方差也要相加。",
        ),
        generate: (rng: Rng): Problem => {
          const a = rng.int(1, 8);
          const b = rng.int(1, 8);
          const v1 = rng.int(2, 20);
          const v2 = rng.int(2, 20);
          const varTotal = a * a * v1 + b * b * v2;

          return numberProblem({
            prompt: t(
              `Let $X \\sim N(10, ${v1})$ and $Y \\sim N(20, ${v2})$ be independent normal random variables. Find the variance of the linear combination $W = ${a}X - ${b}Y$.`,
              `设 $X \\sim N(10, ${v1})$ 与 $Y \\sim N(20, ${v2})$ 为相互独立的正态随机变量。求线性组合 $W = ${a}X - ${b}Y$ 的方差。`,
            ),
            answer: varTotal,
            mistakes: distinct(varTotal, [
              why(
                a * a * v1 - b * b * v2,
                "That subtracts the second variance; squaring the coefficient makes it positive.",
                "那是减去了第二个方差；系数平方后为正。",
              ),
              why(a * v1 + b * v2, "That multiplies by the coefficients without squaring them.", "那是乘以系数而没有平方。"),
              why(
                a * v1 - b * v2,
                "That neither squares the coefficients nor adds the variances.",
                "那既没有把系数平方，也没有把方差相加。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Square the coefficients", "系数平方"],
                  t(
                    `The coefficients of $W$ square to $${a * a}$ and $${b * b}$, so $\\text{Var}(W) = ${a === 1 ? v1 : `${a * a} \\cdot ${v1}`} + ${b === 1 ? v2 : `${b * b} \\cdot ${v2}`}$.`,
                    `$W$ 的系数平方后为 $${a * a}$ 与 $${b * b}$，所以 $\\text{Var}(W) = ${a === 1 ? v1 : `${a * a} \\cdot ${v1}`} + ${b === 1 ? v2 : `${b * b} \\cdot ${v2}`}$。`,
                  ),
                ],
                [["Add", "相加"], t(`$${a * a * v1} + ${b * b * v2} = ${varTotal}$.`, `$${a * a * v1} + ${b * b * v2} = ${varTotal}$。`)],
              ],
              t(
                `The variance $${varTotal}$ is at least $\\text{Var}(${a === 1 ? "" : a}X) = ${a * a * v1}$: subtracting an independent $Y$ only adds spread.`,
                `方差 $${varTotal}$ 不小于 $\\text{Var}(${a === 1 ? "" : a}X) = ${a * a * v1}$：减去独立的 $Y$ 只会增加波动。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-probability-that-one-normal-exceeds-another",
        title: t("The probability that one normal exceeds another", "一个正态变量超过另一个的概率"),
        explanation: t(
          "To compare two independent normal variables, study their difference. $D = X - Y$ is normal with mean $\\mu_X - \\mu_Y$ and variance $\\sigma_X^{2} + \\sigma_Y^{2}$, and\n\n$$P(X > Y) = P(D > 0) = 1 - \\Phi\\left(\\frac{0 - (\\mu_X - \\mu_Y)}{\\sqrt{\\sigma_X^{2} + \\sigma_Y^{2}}}\\right).$$\n\nIf a bolt's length is $N(50, 9)$ and a hole's depth is $N(52, 16)$, then $P(\\text{bolt} > \\text{hole}) = 1 - \\Phi\\left(\\frac{2}{5}\\right)$. For $X \\sim N(158, 400)$ and $Y \\sim N(100, 441)$, $D \\sim N(58, 841)$ has standard deviation $29$, and $P(X > Y) = 1 - \\Phi(-2) = 0.9772$.\n\n> **Watch out.** Add the variances, then take the root; adding the standard deviations gives the wrong spread. And $P(D > 0)$ is the upper tail, $1 - \\Phi(z)$, not $\\Phi(z)$.",
          "比较两个独立的正态变量时，研究它们的差。$D = X - Y$ 服从均值 $\\mu_X - \\mu_Y$、方差 $\\sigma_X^{2} + \\sigma_Y^{2}$ 的正态分布，且\n\n$$P(X > Y) = P(D > 0) = 1 - \\Phi\\left(\\frac{0 - (\\mu_X - \\mu_Y)}{\\sqrt{\\sigma_X^{2} + \\sigma_Y^{2}}}\\right).$$\n\n例如螺栓长度为 $N(50, 9)$，孔深为 $N(52, 16)$，则 $P(\\text{螺栓} > \\text{孔}) = 1 - \\Phi\\left(\\frac{2}{5}\\right)$。对 $X \\sim N(158, 400)$ 与 $Y \\sim N(100, 441)$，$D \\sim N(58, 841)$ 的标准差为 $29$，$P(X > Y) = 1 - \\Phi(-2) = 0.9772$。\n\n> **注意。** 先把方差相加再开方；把标准差相加会得到错误的波动。$P(D > 0)$ 是上尾，等于 $1 - \\Phi(z)$，不是 $\\Phi(z)$。",
        ),
        generate: (rng: Rng): Problem => {
          const [a, b, c] = rng.pick([
            [3, 4, 5],
            [6, 8, 10],
            [5, 12, 13],
            [8, 6, 10],
            [4, 3, 5],
          ] as const);
          const zv = rng.pick([-2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2]);
          const muY = rng.int(30, 90);
          const diff = Q.parse(String(-zv)).mul(Q.of(c));
          const muX = Q.of(muY).add(diff);
          const ans = Q.one.sub(phi(zv));
          return numberProblem({
            prompt: t(
              `$X \\sim N(${dec(muX)}, ${a * a})$ and $Y \\sim N(${muY}, ${b * b})$ are independent. Find $P(X > Y)$. Use ${PHI_TABLE.en}.`,
              `$X \\sim N(${dec(muX)}, ${a * a})$ 与 $Y \\sim N(${muY}, ${b * b})$ 相互独立。求 $P(X > Y)$。利用${PHI_TABLE["zh-CN"]}。`,
            ),
            answer: ans,
            form: "decimal",
            mistakes: distinct(ans, [
              why(phi(zv), "That is the lower tail $\\Phi(z)$; $P(D > 0)$ is the upper tail.", "那是下尾 $\\Phi(z)$；$P(D > 0)$ 是上尾。"),
              why(
                Q.one.sub(phi(Math.max(-2.5, Math.min(2.5, Math.round(((zv * c) / (a + b)) * 2) / 2)))),
                "That adds the standard deviations instead of the variances.",
                "那是把标准差相加，而不是把方差相加。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the distribution of the difference", "求差的分布"],
                  t(
                    `$X - Y \\sim N(${dec(diff)}, ${a * a} + ${b * b}) = N(${dec(diff)}, ${c * c})$, with standard deviation $${c}$.`,
                    `$X - Y \\sim N(${dec(diff)}, ${a * a} + ${b * b}) = N(${dec(diff)}, ${c * c})$，标准差为 $${c}$。`,
                  ),
                ],
                [
                  ["Standardize", "标准化"],
                  t(
                    `$P(X - Y > 0) = 1 - \\Phi\\left(\\frac{0 - ${par(diff)}}{${c}}\\right) = 1 - \\Phi(${zv}) = ${shown(ans)}$.`,
                    `$P(X - Y > 0) = 1 - \\Phi\\left(\\frac{0 - ${par(diff)}}{${c}}\\right) = 1 - \\Phi(${zv}) = ${shown(ans)}$。`,
                  ),
                ],
              ],
              t(
                diff.sign() > 0
                  ? `$X$ has the larger mean, so $P(X > Y)$ should be above $\\frac{1}{2}$, and $${dec(ans)}$ is.`
                  : `$X$ has the smaller mean, so $P(X > Y)$ should be below $\\frac{1}{2}$, and $${dec(ans)}$ is.`,
                diff.sign() > 0
                  ? `$X$ 的均值较大，所以 $P(X > Y)$ 应大于 $\\frac{1}{2}$，而 $${dec(ans)}$ 正是如此。`
                  : `$X$ 的均值较小，所以 $P(X > Y)$ 应小于 $\\frac{1}{2}$，而 $${dec(ans)}$ 正是如此。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 5.19.4 Combining Multiple Normally Distributed Random Variables
  {
    id: "combining-multiple-normally-distributed-random-variables",
    title: t("Combining Multiple Normally Distributed Random Variables", "组合多个正态随机变量"),
    summary: t(
      "For independent $X_i \\sim N(\\mu_i, \\sigma_i^2)$, the combination $\\sum c_i X_i$ is normal with mean $\\sum c_i \\mu_i$ and variance $\\sum c_i^2 \\sigma_i^2$.",
      "对相互独立的 $X_i \\sim N(\\mu_i, \\sigma_i^2)$，线性组合 $\\sum c_i X_i$ 服从正态分布，均值为 $\\sum c_i \\mu_i$，方差为 $\\sum c_i^2 \\sigma_i^2$。",
    ),
    intro: t(
      "Three independent parts have weights $N(5, 1)$, $N(6, 2)$ and $N(7, 3)$ grams. The combination $W = 10X_1 + 20X_2 - 30X_3$ has mean $50 + 120 - 210 = -40$ and variance $100 + 800 + 2700 = 3600$.\n\nCheck: the coefficient $-30$ lowers the mean but adds $900 \\cdot 3$ to the variance, since its square is positive.\n\nIn this lesson we find the mean and the variance of a combination of several independent normals and the probability for a sum of three normals.",
      "三个独立零件的重量分别服从 $N(5, 1)$、$N(6, 2)$、$N(7, 3)$（克）。组合 $W = 10X_1 + 20X_2 - 30X_3$ 的均值为 $50 + 120 - 210 = -40$，方差为 $100 + 800 + 2700 = 3600$。\n\n检验：系数 $-30$ 使均值变小，却给方差加上 $900 \\cdot 3$，因为它的平方为正。\n\n本课我们求多个独立正态变量组合的均值与方差，并求三个正态变量之和的概率。",
    ),
    prerequisites: ["combining-two-normally-distributed-random-variables"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "mean-of-multiple-normal-combination",
        title: t("Mean of a general linear combination of normal variables", "多个正态变量一般线性组合的均值"),
        explanation: t(
          "The mean of any linear combination is the same combination of the means, whether or not the variables are independent. Expectation is linear: $E\\left[\\sum_i c_i X_i\\right] = \\sum_i c_i E[X_i]$. With means $5$, $6$ and $7$, $E[10X_1 + 20X_2 - 30X_3] = 50 + 120 - 210 = -40$.\n\n> **Watch out.** Keep the minus sign on the subtracted term, multiply every mean by its coefficient and leave no term out.",
          "无论变量是否独立，任意线性组合的均值都是各均值的同样组合。期望是线性的：$E\\left[\\sum_i c_i X_i\\right] = \\sum_i c_i E[X_i]$。若均值为 $5$、$6$、$7$，则 $E[10X_1 + 20X_2 - 30X_3] = 50 + 120 - 210 = -40$。\n\n> **注意。** 被减的那一项要保留负号，每个均值都要乘以它的系数，任何一项都不能漏掉。",
        ),
        generate: (rng: Rng): Problem => {
          const c1 = rng.int(1, 4);
          const c2 = rng.int(1, 4);
          const c3 = rng.int(1, 4);
          const m1 = rng.int(5, 30);
          const m2 = rng.int(5, 30);
          const m3 = rng.int(5, 30);
          const meanTotal = c1 * m1 + c2 * m2 - c3 * m3;

          return numberProblem({
            prompt: t(
              `Let $X_1 \\sim N(${m1}, 4)$, $X_2 \\sim N(${m2}, 9)$, and $X_3 \\sim N(${m3}, 16)$ be independent normal random variables. Find the expected value of $W = ${c1} X_1 + ${c2} X_2 - ${c3} X_3$.`,
              `设 $X_1 \\sim N(${m1}, 4)$、$X_2 \\sim N(${m2}, 9)$ 与 $X_3 \\sim N(${m3}, 16)$ 为相互独立的正态随机变量。求线性组合 $W = ${c1} X_1 + ${c2} X_2 - ${c3} X_3$ 的期望值。`,
            ),
            answer: meanTotal,
            mistakes: distinct(meanTotal, [
              why(c1 * m1 + c2 * m2 + c3 * m3, "That adds the third term instead of subtracting it.", "那是把第三项加上，而不是减去。"),
              why(m1 + m2 - m3, "That leaves out the coefficients.", "那是漏掉了系数。"),
              why(c1 * m1 + c2 * m2, "That leaves out the third term.", "那是漏掉了第三项。"),
            ]),
            solution: walked(
              [
                [
                  ["Multiply each mean by its coefficient", "每个均值乘以系数"],
                  t(
                    `The terms contribute $${c1 * m1}$, $${c2 * m2}$ and $-${c3 * m3}$.`,
                    `各项分别贡献 $${c1 * m1}$、$${c2 * m2}$ 与 $-${c3 * m3}$。`,
                  ),
                ],
                [
                  ["Add", "相加"],
                  t(
                    `$E[W] = ${c1 * m1} + ${c2 * m2} - ${c3 * m3} = ${meanTotal}$.`,
                    `$E[W] = ${c1 * m1} + ${c2 * m2} - ${c3 * m3} = ${meanTotal}$。`,
                  ),
                ],
              ],
              t(
                `The positive part $${c1 * m1 + c2 * m2}$ minus the subtracted part $${c3 * m3}$ is $${meanTotal}$; the variances play no part in the mean.`,
                `正的部分 $${c1 * m1 + c2 * m2}$ 减去被减的部分 $${c3 * m3}$ 得 $${meanTotal}$；方差与均值无关。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-variance-of-a-combination-of-several-normals",
        title: t("The variance of a combination of several normals", "多个正态变量组合的方差"),
        explanation: t(
          "Each coefficient is squared, so signs disappear from the variance:\n\n$$\\operatorname{Var}\\left(\\sum c_iX_i\\right) = \\sum c_i^{2}\\sigma_i^{2}$$\n\nfor independent $X_i$. A coefficient of $-3$ contributes $9\\sigma_i^{2}$, the same as $+3$. Together with the mean $\\sum c_i\\mu_i$, this pins down the normal distribution of the combination. With variances $1$, $2$ and $3$, $\\operatorname{Var}(10X_1 - 20X_2 + 5X_3) = 100 + 800 + 75 = 975$.\n\n> **Watch out.** Square every coefficient: using the coefficients as they are, or their absolute values, or dropping them, gives the wrong variance.",
          "每个系数都要平方，因此符号在方差中消失：对独立的 $X_i$，\n\n$$\\operatorname{Var}\\left(\\sum c_iX_i\\right) = \\sum c_i^{2}\\sigma_i^{2}.$$\n\n系数 $-3$ 贡献 $9\\sigma_i^{2}$，与 $+3$ 相同。连同均值 $\\sum c_i\\mu_i$，就完全确定了组合的正态分布。若方差为 $1$、$2$、$3$，则 $\\operatorname{Var}(10X_1 - 20X_2 + 5X_3) = 100 + 800 + 75 = 975$。\n\n> **注意。** 每个系数都要平方：直接用系数、用系数的绝对值或丢掉系数，都会得到错误的方差。",
        ),
        generate: (rng: Rng): Problem => {
          const cs = [rng.int(1, 4), -rng.int(1, 4), rng.int(1, 4)];
          const vs = [rng.int(1, 9), rng.int(1, 9), rng.int(1, 9)];
          const ans = cs.reduce((s, c, i) => s + c * c * (vs[i] ?? 0), 0);
          const signed = cs.reduce((s, c, i) => s + c * (vs[i] ?? 0), 0);
          const abs = cs.reduce((s, c, i) => s + Math.abs(c) * (vs[i] ?? 0), 0);
          const term = (c: number, i: number): string =>
            `${c < 0 ? "-" : i === 0 ? "" : "+"} ${Math.abs(c) === 1 ? "" : Math.abs(c)}X_${i + 1}`;
          const w = cs
            .map((c, i) => term(c, i))
            .join(" ")
            .trim();
          return numberProblem({
            prompt: t(
              `$X_1 \\sim N(0, ${vs[0]})$, $X_2 \\sim N(0, ${vs[1]})$ and $X_3 \\sim N(0, ${vs[2]})$ are independent. Find $\\operatorname{Var}(${w})$.`,
              `$X_1 \\sim N(0, ${vs[0]})$，$X_2 \\sim N(0, ${vs[1]})$，$X_3 \\sim N(0, ${vs[2]})$ 相互独立。求 $\\operatorname{Var}(${w})$。`,
            ),
            answer: ans,
            mistakes: distinct(ans, [
              why(
                signed,
                "That uses the coefficients without squaring them, signs included.",
                "那是直接用系数而没有平方，连符号也保留了。",
              ),
              why(abs, "That uses the absolute values of the coefficients without squaring them.", "那是用系数的绝对值而没有平方。"),
              why(
                vs.reduce((s, v) => s + v, 0),
                "That adds the variances and drops the coefficients.",
                "那是把方差相加而丢掉了系数。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Square the coefficients", "系数平方"],
                  t(
                    `The squared coefficients are $${cs.map((c) => c * c).join(", ")}$.`,
                    `系数的平方为 $${cs.map((c) => c * c).join(", ")}$。`,
                  ),
                ],
                [
                  ["Weight the variances", "对方差加权"],
                  t(
                    `$\\operatorname{Var} = ${cs.map((c, i) => prodTex(c * c, vs[i] ?? 0)).join(" + ")} = ${ans}$.`,
                    `$\\operatorname{Var} = ${cs.map((c, i) => prodTex(c * c, vs[i] ?? 0)).join(" + ")} = ${ans}$。`,
                  ),
                ],
              ],
              t(
                `Each term $c_i^{2}\\sigma_i^{2}$ is positive, so the variance $${ans}$ is at least each one, whatever the signs of the coefficients.`,
                `每一项 $c_i^{2}\\sigma_i^{2}$ 都为正，所以无论系数符号如何，方差 $${ans}$ 都不小于其中任何一项。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 5.19.5 I.I.D Normal Random Variables
  {
    id: "iid-normal-random-variables",
    title: t("I.I.D Normal Random Variables", "独立同分布正态随机变量"),
    summary: t(
      "The mean $\\bar{X}$ of $n$ i.i.d. $N(\\mu, \\sigma^2)$ variables is $N\\left(\\mu, \\frac{\\sigma^2}{n}\\right)$, and their sum $S_n$ is $N(n\\mu, n\\sigma^2)$.",
      "$n$ 个独立同分布 $N(\\mu, \\sigma^2)$ 变量的均值 $\\bar{X}$ 服从 $N\\left(\\mu, \\frac{\\sigma^2}{n}\\right)$，其和 $S_n$ 服从 $N(n\\mu, n\\sigma^2)$。",
    ),
    intro: t(
      "A machine fills bags whose weights are i.i.d. $N(500, 64)$ grams. The total of $100$ bags has variance $100 \\cdot 64 = 6400$, while the mean of the $100$ bags has variance $\\frac{64}{100} = 0.64$, a standard deviation of only $0.8$ grams.\n\nCheck: $100$ times one bag would have variance $100^{2} \\cdot 64 = 640000$, far more than the total of $100$ independent bags.\n\nIn this lesson we find the variance of the sample mean, tell adding copies from scaling one, and find the variance of the sample mean minus one observation.",
      "一台机器装袋，每袋重量独立同分布于 $N(500, 64)$（克）。$100$ 袋的总重量方差为 $100 \\cdot 64 = 6400$，而 $100$ 袋的平均重量方差为 $\\frac{64}{100} = 0.64$，标准差只有 $0.8$ 克。\n\n检验：一袋重量的 $100$ 倍方差为 $100^{2} \\cdot 64 = 640000$，远大于 $100$ 个独立袋子的总重量方差。\n\n本课我们求样本均值的方差，区分多个副本相加与单个放大，并求样本均值减去一个观测值的方差。",
    ),
    prerequisites: ["combining-multiple-normally-distributed-random-variables"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "sample-mean-variance-iid-normal",
        title: t("Variance of the sample mean for i.i.d. normal variables", "独立同分布正态样本均值的方差"),
        explanation: t(
          "Averaging independent observations cancels part of their random variation, so the variance of the mean shrinks in proportion to the sample size. For $X_1, \\dots, X_n$ i.i.d. $N(\\mu, \\sigma^2)$, $\\operatorname{Var}(\\bar{X}) = \\frac{\\sigma^2}{n}$, because $\\operatorname{Var}\\left(\\frac{1}{n}\\sum X_i\\right) = \\frac{1}{n^{2}} \\cdot n\\sigma^{2}$. With $\\sigma^2 = 400$ and $n = 100$, $\\operatorname{Var}(\\bar{X}) = 4$.\n\n> **Watch out.** Divide the variance by $n$, not by $n^{2}$ and not leave it at $\\sigma^2$: the $\\frac{1}{n^{2}}$ from squaring the factor meets the $n\\sigma^{2}$ of the sum.",
          "对独立观测取平均会抵消一部分随机波动，所以均值的方差与样本量成反比地缩小。对于独立同分布的 $X_1, \\dots, X_n \\sim N(\\mu, \\sigma^2)$，样本均值的方差为 $\\operatorname{Var}(\\bar{X}) = \\frac{\\sigma^2}{n}$，因为 $\\operatorname{Var}\\left(\\frac{1}{n}\\sum X_i\\right) = \\frac{1}{n^{2}} \\cdot n\\sigma^{2}$。若 $\\sigma^2 = 400$，$n = 100$，则 $\\operatorname{Var}(\\bar{X}) = 4$。\n\n> **注意。** 方差要除以 $n$，既不是除以 $n^{2}$，也不是保持 $\\sigma^2$ 不变：系数平方带来的 $\\frac{1}{n^{2}}$ 与和的 $n\\sigma^{2}$ 相乘。",
        ),
        generate: (rng: Rng): Problem => {
          const sigmaSq = rng.int(10, 100);
          const n = rng.int(4, 50);

          return numberProblem({
            prompt: t(
              `Let $X_1, X_2, \\dots, X_{${n}}$ be independent and identically distributed normal random variables, each with variance $\\sigma^2 = ${sigmaSq}$. Find the variance of the sample mean $\\bar{X} = \\frac{1}{${n}} \\sum_{i=1}^{${n}} X_i$.`,
              `设 $X_1, X_2, \\dots, X_{${n}}$ 为独立同分布的正态随机变量，每个变量的方差均为 $\\sigma^2 = ${sigmaSq}$。求样本均值 $\\bar{X} = \\frac{1}{${n}} \\sum_{i=1}^{${n}} X_i$ 的方差。`,
            ),
            answer: Q.of(sigmaSq, n),
            mistakes: distinct(Q.of(sigmaSq, n), [
              why(sigmaSq, "That is the variance of one observation, not of the mean.", "那是单个观测值的方差，而不是均值的方差。"),
              why(
                Q.of(sigmaSq, n * n),
                "That divides by $n^{2}$ and forgets that the sum has variance $n\\sigma^{2}$.",
                "那是除以 $n^{2}$，忘了和的方差为 $n\\sigma^{2}$。",
              ),
              why(sigmaSq * n, "That is the variance of the sum, not of the mean.", "那是和的方差，而不是均值的方差。"),
            ]),
            solution: walked(
              [
                [
                  ["Find the variance of the sum", "求和的方差"],
                  t(
                    `The $${n}$ independent terms give $\\operatorname{Var}\\left(\\sum X_i\\right) = ${n} \\cdot ${sigmaSq} = ${n * sigmaSq}$.`,
                    `$${n}$ 个独立项给出 $\\operatorname{Var}\\left(\\sum X_i\\right) = ${n} \\cdot ${sigmaSq} = ${n * sigmaSq}$。`,
                  ),
                ],
                [
                  ["Divide by $n^{2}$", "除以 $n^{2}$"],
                  t(
                    `$\\operatorname{Var}(\\bar{X}) = \\frac{${n * sigmaSq}}{${n * n}} = \\frac{${sigmaSq}}{${n}}${lowestTerms(sigmaSq, n)}$.`,
                    `$\\operatorname{Var}(\\bar{X}) = \\frac{${n * sigmaSq}}{${n * n}} = \\frac{${sigmaSq}}{${n}}${lowestTerms(sigmaSq, n)}$。`,
                  ),
                ],
              ],
              t(
                `Multiplying back, $${n} \\cdot \\frac{${sigmaSq}}{${n}} = ${sigmaSq}$ gives back the variance of one observation.`,
                `反过来乘，$${n} \\cdot \\frac{${sigmaSq}}{${n}} = ${sigmaSq}$ 正好还原单个观测值的方差。`,
              ),
            ),
          });
        },
      },
      {
        id: "adding-copies-versus-scaling-one",
        title: t("Adding copies versus scaling one", "多个副本相加与单个放大"),
        explanation: t(
          "$X_1 + X_2 + \\cdots + X_n$ and $nX_1$ have the same mean $n\\mu$, but not the same variance:\n\n$$\\operatorname{Var}(X_1 + \\cdots + X_n) = n\\sigma^{2}, \\qquad \\operatorname{Var}(nX_1) = n^{2}\\sigma^{2}.$$\n\nIndependent copies partly cancel each other's deviations, while a single scaled variable has its deviation multiplied in full. The total weight of $10$ bags varies far less than $10$ times the weight of one bag. With $n = 20$ and $\\sigma^{2} = 30$, the sum has variance $600$ but $20X_1$ has variance $12000$.\n\n> **Watch out.** Read the expression first: a sum of $n$ copies multiplies the variance by $n$, a single variable scaled by $n$ multiplies it by $n^{2}$.",
          "$X_1 + X_2 + \\cdots + X_n$ 与 $nX_1$ 的均值都是 $n\\mu$，但方差不同：\n\n$$\\operatorname{Var}(X_1 + \\cdots + X_n) = n\\sigma^{2}, \\qquad \\operatorname{Var}(nX_1) = n^{2}\\sigma^{2}.$$\n\n独立的副本会部分抵消彼此的偏差，而单个变量放大时偏差被完全放大。$10$ 袋的总重量的波动远小于一袋重量的 $10$ 倍。若 $n = 20$，$\\sigma^{2} = 30$，则和的方差为 $600$，而 $20X_1$ 的方差为 $12000$。\n\n> **注意。** 先看清表达式：$n$ 个副本相加使方差乘以 $n$，单个变量放大 $n$ 倍使方差乘以 $n^{2}$。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(2, 12);
          const v = rng.int(1, 20);
          const sum = rng.bool();
          const ans = sum ? n * v : n * n * v;
          const expr = sum ? `X_1 + X_2 + \\cdots + X_{${n}}` : `${n}X_1`;
          return numberProblem({
            prompt: t(
              `$X_1, \\dots, X_{${n}}$ are i.i.d. $N(\\mu, ${v})$. Find $\\operatorname{Var}(${expr})$.`,
              `$X_1, \\dots, X_{${n}}$ 独立同分布于 $N(\\mu, ${v})$。求 $\\operatorname{Var}(${expr})$。`,
            ),
            answer: ans,
            mistakes: distinct(ans, [
              sum
                ? why(n * n * v, "That treats the sum as one variable scaled by $n$.", "那是把和当作单个变量放大 $n$ 倍。")
                : why(n * v, "That treats the scaled variable as a sum of independent copies.", "那是把放大的变量当作独立副本之和。"),
              why(v, "That is the variance of one term.", "那是单个项的方差。"),
              sum
                ? why(v, "That is the variance of one term.", "那是单个项的方差。")
                : why(n * v * 2, "That multiplies by $2n$ instead of squaring $n$.", "那是乘以 $2n$，而不是把 $n$ 平方。"),
            ]),
            solution: walked(
              [
                [
                  ["Identify the expression", "识别表达式"],
                  t(
                    sum
                      ? `$${expr}$ is a sum of $${n}$ independent copies, each with variance $${v}$.`
                      : `$${expr}$ is one variable multiplied by $${n}$.`,
                    sum ? `$${expr}$ 是 $${n}$ 个独立副本之和，每个的方差为 $${v}$。` : `$${expr}$ 是单个变量乘以 $${n}$。`,
                  ),
                ],
                [
                  ["Apply the rule", "应用法则"],
                  t(
                    sum
                      ? `The variances of independent terms add: $${prodTex(n, v)} = ${ans}$.`
                      : `Scaling by $${n}$ multiplies the variance by $${n}^{2}$: $${prodTex(n * n, v)} = ${ans}$.`,
                    sum
                      ? `独立项的方差相加：$${prodTex(n, v)} = ${ans}$。`
                      : `乘以 $${n}$ 使方差乘以 $${n}^{2}$：$${prodTex(n * n, v)} = ${ans}$。`,
                  ),
                ],
              ],
              t(
                sum
                  ? `The sum's variance $${ans}$ is $${n}$ times smaller than the $${n * n * v}$ of $${n}X_1$.`
                  : `The variance $${ans}$ is $${n}$ times the $${n * v}$ of a sum of $${n}$ copies.`,
                sum
                  ? `和的方差 $${ans}$ 只是 $${n}X_1$ 的方差 $${n * n * v}$ 的 $\\frac{1}{${n}}$。`
                  : `方差 $${ans}$ 是 $${n}$ 个副本之和的方差 $${n * v}$ 的 $${n}$ 倍。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 5.20.1 Expected Values of Sums and Products of Random Variables
  {
    id: "expected-values-of-sums-and-products-of-random-variables",
    title: t("Expected Values of Sums and Products of Random Variables", "随机变量和与积的期望值"),
    summary: t(
      "Expectation is always linear: E[X + Y] = E[X] + E[Y]. For independent variables, expectation is multiplicative: E[XY] = E[X] E[Y].",
      "期望总是线性的：E[X + Y] = E[X] + E[Y]。对于相互独立的随机变量，期望具有可乘性：E[XY] = E[X] E[Y]。",
    ),
    intro: t(
      "A shop's daily customers $X$ average $40$ and each spends an independent amount $Y$ averaging $25$ dollars. Then $E[X + Y] = 65$ always, and because they are independent, $E[XY] = 40 \\cdot 25 = 1000$.\n\nCheck: if $Y = X$, then $E[X^{2}] = \\operatorname{Var}(X) + 40^{2}$, which exceeds $40 \\cdot 40$ whenever $X$ varies, so the product rule needs independence.\n\nIn this lesson we find the expectation of a product of independent variables, of a product of powers, and the expected square of a sum.",
      "一家店每天的顾客数 $X$ 平均为 $40$，每位顾客独立地消费 $Y$，平均 $25$ 元。于是 $E[X + Y] = 65$ 总成立；又因两者独立，$E[XY] = 40 \\cdot 25 = 1000$。\n\n检验：若 $Y = X$，则 $E[X^{2}] = \\operatorname{Var}(X) + 40^{2}$，只要 $X$ 有波动就大于 $40 \\cdot 40$，所以乘积法则需要独立性。\n\n本课我们求独立变量之积的期望、幂的乘积的期望，以及和的平方的期望。",
    ),
    prerequisites: ["independence-of-discrete-random-variables", "properties-of-expectation-for-discrete-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "multiplicative-expectation-independent",
        title: t("Evaluating the expectation of a product of independent variables", "计算相互独立变量积的数学期望"),
        explanation: t(
          "For independent variables the mean of a product splits into the product of the means, which fails in general when they are dependent. If $X$ and $Y$ are independent, $E[XY] = E[X]\\,E[Y]$. With $E[X] = -15$ and $E[Y] = 30$, $E[XY] = -450$.\n\n> **Watch out.** Multiply the means, do not add them, and keep the sign of a negative mean.",
          "对于独立变量，乘积的均值可以拆成均值的乘积，而在变量相关时一般不成立。若 $X$ 与 $Y$ 相互独立，则 $E[XY] = E[X]\\,E[Y]$。若 $E[X] = -15$，$E[Y] = 30$，则 $E[XY] = -450$。\n\n> **注意。** 要把均值相乘而不是相加，负的均值要保留符号。",
        ),
        generate: (rng: Rng): Problem => {
          const eX = rng.int(-10, 20);
          const eY = rng.int(2, 20);
          const prod = eX * eY;

          return numberProblem({
            prompt: t(
              `Given that $X$ and $Y$ are independent random variables with $E[X] = ${eX}$ and $E[Y] = ${eY}$, evaluate the expected value $E[XY]$.`,
              `已知 $X$ 与 $Y$ 为相互独立的随机变量，满足 $E[X] = ${eX}$ 与 $E[Y] = ${eY}$。计算期望值 $E[XY]$。`,
            ),
            answer: prod,
            mistakes: distinct(prod, [
              why(eX + eY, "That adds the means instead of multiplying them.", "那是把均值相加，而不是相乘。"),
              why(eX * eY + 1, "That adds $1$ to the product of the means.", "那是在均值之积上多加了 $1$。"),
              why(eY - eX, "That subtracts the means instead of multiplying them.", "那是把均值相减，而不是相乘。"),
              why(-prod, "That loses the sign of the product.", "那是丢掉了乘积的符号。"),
            ]),
            solution: walked(
              [
                [
                  ["Use independence", "利用独立性"],
                  t("Because $X$ and $Y$ are independent, $E[XY] = E[X]\\,E[Y]$.", "由于 $X$ 与 $Y$ 相互独立，$E[XY] = E[X]\\,E[Y]$。"),
                ],
                [["Multiply the means", "均值相乘"], t(`$E[XY] = (${eX})(${eY}) = ${prod}$.`, `$E[XY] = (${eX})(${eY}) = ${prod}$。`)],
              ],
              t(
                eX === 0
                  ? `A zero mean for $X$ makes the product's mean $0$, whatever $E[Y]$ is.`
                  : `Dividing back, $${prod} \\div ${eY} = ${eX}$ recovers $E[X]$.`,
                eX === 0
                  ? `$X$ 的均值为零，所以无论 $E[Y]$ 是多少，乘积的均值都是 $0$。`
                  : `反过来除，$${prod} \\div ${eY} = ${eX}$ 还原 $E[X]$。`,
              ),
            ),
          });
        },
      },
      {
        id: "expectations-of-products-of-powers",
        title: t("Expectations of products of powers", "幂的乘积的期望"),
        explanation: t(
          "Independence lets functions of $X$ and $Y$ separate too: $E[g(X)h(Y)] = E[g(X)]\\,E[h(Y)]$. For squares, recover $E[X^{2}]$ from the variance:\n\n$$E[X^{2}Y] = E[X^{2}]\\,E[Y] = \\left(\\operatorname{Var}(X) + E[X]^{2}\\right)E[Y].$$\n\nA common slip is to use $E[X]^{2}$ for $E[X^{2}]$; they differ by exactly the variance. With $E[X] = 10$, $\\operatorname{Var}(X) = 20$ and $E[Y] = -2$, $E[X^{2}Y] = 120 \\cdot (-2) = -240$.\n\n> **Watch out.** Add the variance to $E[X]^{2}$ before multiplying by $E[Y]$; subtracting it or leaving it out gives the wrong value.",
          "独立性同样使 $X$ 与 $Y$ 的函数可以分开：$E[g(X)h(Y)] = E[g(X)]\\,E[h(Y)]$。对于平方，由方差求出 $E[X^{2}]$：\n\n$$E[X^{2}Y] = E[X^{2}]\\,E[Y] = \\left(\\operatorname{Var}(X) + E[X]^{2}\\right)E[Y].$$\n\n常见错误是把 $E[X]^{2}$ 当作 $E[X^{2}]$；两者恰好相差方差。若 $E[X] = 10$，$\\operatorname{Var}(X) = 20$，$E[Y] = -2$，则 $E[X^{2}Y] = 120 \\cdot (-2) = -240$。\n\n> **注意。** 先把方差加到 $E[X]^{2}$ 上，再乘以 $E[Y]$；减去方差或漏掉方差都会出错。",
        ),
        generate: (rng: Rng): Problem => {
          const ex = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
          const vx = rng.int(1, 9);
          let ey = rng.int(-5, 7);
          if (ey === 0) ey = 3;
          const ans = (vx + ex * ex) * ey;
          const mul = ey === 1 ? `${vx + ex * ex}` : `${vx + ex * ex} \\cdot ${par(Q.of(ey))}`;
          return numberProblem({
            prompt: t(
              `$X$ and $Y$ are independent with $E[X] = ${ex}$, $\\operatorname{Var}(X) = ${vx}$ and $E[Y] = ${ey}$. Find $E[X^{2}Y]$.`,
              `$X$ 与 $Y$ 独立，$E[X] = ${ex}$，$\\operatorname{Var}(X) = ${vx}$，$E[Y] = ${ey}$。求 $E[X^{2}Y]$。`,
            ),
            answer: ans,
            mistakes: distinct(ans, [
              why(
                ex * ex * ey,
                "That uses $E[X]^{2}$ for $E[X^{2}]$ and leaves out the variance.",
                "那是把 $E[X]^{2}$ 当作 $E[X^{2}]$，漏掉了方差。",
              ),
              why(
                vx * ey,
                "That uses the variance for $E[X^{2}]$ and leaves out $E[X]^{2}$.",
                "那是把方差当作 $E[X^{2}]$，漏掉了 $E[X]^{2}$。",
              ),
              why(
                (vx - ex * ex) * ey,
                "That subtracts $E[X]^{2}$ from the variance instead of adding it.",
                "那是从方差中减去 $E[X]^{2}$，而不是加上。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find $E[X^{2}]$", "求 $E[X^{2}]$"],
                  t(
                    `$E[X^{2}] = \\operatorname{Var}(X) + E[X]^{2} = ${vx} + ${par(Q.of(ex))}^{2} = ${vx + ex * ex}$.`,
                    `$E[X^{2}] = \\operatorname{Var}(X) + E[X]^{2} = ${vx} + ${par(Q.of(ex))}^{2} = ${vx + ex * ex}$。`,
                  ),
                ],
                [
                  ["Multiply by $E[Y]$", "乘以 $E[Y]$"],
                  t(`By independence, $E[X^{2}Y] = ${mul} = ${ans}$.`, `由独立性，$E[X^{2}Y] = ${mul} = ${ans}$。`),
                ],
              ],
              t(
                `$E[X^{2}] = ${vx + ex * ex}$ is larger than $E[X]^{2} = ${ex * ex}$ by the variance $${vx}$, as it must be.`,
                `$E[X^{2}] = ${vx + ex * ex}$ 比 $E[X]^{2} = ${ex * ex}$ 恰好大出方差 $${vx}$，正应如此。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 5.20.2 Variance of Sums of Independent Random Variables
  {
    id: "variance-of-sums-of-independent-random-variables",
    title: t("Variance of Sums of Independent Random Variables", "独立随机变量和的方差"),
    summary: t(
      "If $X_1, \\dots, X_n$ are pairwise independent, then $\\operatorname{Var}\\left(\\sum X_i\\right) = \\sum \\operatorname{Var}(X_i)$.",
      "若 $X_1, \\dots, X_n$ 两两独立，则 $\\operatorname{Var}\\left(\\sum X_i\\right) = \\sum \\operatorname{Var}(X_i)$。",
    ),
    intro: t(
      "Two independent measurement errors have variances $9$ and $16$. Their sum and their difference both have variance $9 + 16 = 25$, a standard deviation of $5$.\n\nCheck: the standard deviations $3$ and $4$ do not add to $5$; it is the variances that add.\n\nIn this lesson we find the variance of a sum or difference of independent variables, of a scaled combination, and of a product of independent variables.",
      "两个独立的测量误差方差分别为 $9$ 与 $16$。它们的和与差的方差都是 $9 + 16 = 25$，标准差为 $5$。\n\n检验：标准差 $3$ 与 $4$ 相加不等于 $5$；相加的是方差。\n\n本课我们求独立变量之和或差的方差、带系数组合的方差，以及独立变量之积的方差。",
    ),
    prerequisites: ["expected-values-of-sums-and-products-of-random-variables", "properties-of-variance-for-discrete-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "sum-of-variances-independent",
        title: t("Computing variance of sum of independent variables", "计算独立随机变量和的方差"),
        explanation: t(
          "Independence makes the covariance term vanish, so the variance of a sum is just the sum of the variances. For independent variables, $\\operatorname{Var}(X + Y) = \\operatorname{Var}(X) + \\operatorname{Var}(Y)$, and since $(-1)^{2} = 1$ the same holds for $X - Y$. With variances $80$ and $120$, $\\operatorname{Var}(X - Y) = 200$.\n\n> **Watch out.** Variances never subtract: the minus sign in $X - Y$ is squared away.",
          "独立性使协方差项为零，所以和的方差就是方差之和。对于相互独立的变量，$\\operatorname{Var}(X + Y) = \\operatorname{Var}(X) + \\operatorname{Var}(Y)$；又因 $(-1)^{2} = 1$，对 $X - Y$ 也同样成立。若方差为 $80$ 与 $120$，则 $\\operatorname{Var}(X - Y) = 200$。\n\n> **注意。** 方差从不相减：$X - Y$ 中的负号在平方后消失。",
        ),
        generate: (rng: Rng): Problem => {
          const v1 = rng.int(5, 50);
          const v2 = rng.int(5, 50);
          const vTotal = v1 + v2;

          return numberProblem({
            prompt: t(
              `Let $X$ and $Y$ be independent random variables with $\\text{Var}(X) = ${v1}$ and $\\text{Var}(Y) = ${v2}$. Find the variance $\\text{Var}(X - Y)$.`,
              `设 $X$ 与 $Y$ 为相互独立的随机变量，其实际方差分别为 $\\text{Var}(X) = ${v1}$ 与 $\\text{Var}(Y) = ${v2}$。求 $\\text{Var}(X - Y)$。`,
            ),
            answer: vTotal,
            mistakes: distinct(vTotal, [
              why(v1 - v2, "That subtracts the variances; the minus sign is squared away.", "那是把方差相减；负号在平方后消失。"),
              why(v2 - v1, "That subtracts the variances the other way round.", "那是反过来把方差相减。"),
              why(
                v1 + v2 + 2,
                "That adds an extra $2$; independent variables have no covariance term.",
                "那是多加了 $2$；独立变量没有协方差项。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Square the coefficient of $Y$", "把 $Y$ 的系数平方"],
                  t(
                    "$\\text{Var}(X - Y) = \\text{Var}(X) + (-1)^2 \\text{Var}(Y) = \\text{Var}(X) + \\text{Var}(Y)$, with no covariance term by independence.",
                    "$\\text{Var}(X - Y) = \\text{Var}(X) + (-1)^2 \\text{Var}(Y) = \\text{Var}(X) + \\text{Var}(Y)$，由独立性没有协方差项。",
                  ),
                ],
                [["Add the variances", "方差相加"], t(`$${v1} + ${v2} = ${vTotal}$.`, `$${v1} + ${v2} = ${vTotal}$。`)],
              ],
              t(
                `The answer $${vTotal}$ is larger than each of $${v1}$ and $${v2}$, as a variance of a difference of independent variables must be.`,
                `结果 $${vTotal}$ 比 $${v1}$ 与 $${v2}$ 都大，独立变量之差的方差理应如此。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-variance-of-a-scaled-combination",
        title: t("The variance of a scaled combination", "带系数组合的方差"),
        explanation: t(
          "For independent $X$ and $Y$ and constants $a, b, c$,\n\n$$\\operatorname{Var}(aX + bY + c) = a^{2}\\operatorname{Var}(X) + b^{2}\\operatorname{Var}(Y).$$\n\nThe added constant $c$ shifts every value equally and does not change the spread; the coefficients enter squared. For $\\operatorname{Var}(X) = 4$, $\\operatorname{Var}(Y) = 1$: $\\operatorname{Var}(3X - 2Y + 7) = 36 + 4 = 40$. With variances $15$ and $20$, $\\operatorname{Var}(10X - 6Y + 50) = 1500 + 720 = 2220$.\n\n> **Watch out.** Square both coefficients and drop the constant; it moves every value but changes no spread.",
          "对独立的 $X$、$Y$ 与常数 $a, b, c$，\n\n$$\\operatorname{Var}(aX + bY + c) = a^{2}\\operatorname{Var}(X) + b^{2}\\operatorname{Var}(Y).$$\n\n加上的常数 $c$ 使每个值同样平移，不改变离散程度；系数以平方进入。若 $\\operatorname{Var}(X) = 4$，$\\operatorname{Var}(Y) = 1$：$\\operatorname{Var}(3X - 2Y + 7) = 36 + 4 = 40$。若方差为 $15$ 与 $20$，则 $\\operatorname{Var}(10X - 6Y + 50) = 1500 + 720 = 2220$。\n\n> **注意。** 两个系数都要平方，常数要去掉；它平移每个值，但不改变离散程度。",
        ),
        generate: (rng: Rng): Problem => {
          const a = rng.int(2, 5);
          const b = rng.int(1, 5);
          const c = rng.int(1, 20);
          const vx = rng.int(1, 12);
          const vy = rng.int(1, 12);
          const ans = a * a * vx + b * b * vy;
          return numberProblem({
            prompt: t(
              `$X$ and $Y$ are independent with $\\operatorname{Var}(X) = ${vx}$ and $\\operatorname{Var}(Y) = ${vy}$. Find $\\operatorname{Var}(${a}X - ${b === 1 ? "" : b}Y + ${c})$.`,
              `$X$ 与 $Y$ 独立，$\\operatorname{Var}(X) = ${vx}$，$\\operatorname{Var}(Y) = ${vy}$。求 $\\operatorname{Var}(${a}X - ${b === 1 ? "" : b}Y + ${c})$。`,
            ),
            answer: ans,
            mistakes: distinct(ans, [
              why(
                a * a * vx + b * vy,
                "That squares the first coefficient but not the second.",
                "那是只把第一个系数平方，没有平方第二个。",
              ),
              why(a * vx + b * vy, "That uses the coefficients without squaring them.", "那是直接用系数而没有平方。"),
              why(ans + c, "That adds the constant; a shift does not change the variance.", "那是把常数加上了；平移不改变方差。"),
            ]),
            solution: walked(
              [
                [
                  ["Drop the constant", "去掉常数"],
                  t(`The constant $${c}$ shifts every value and does not affect the variance.`, `常数 $${c}$ 使每个值平移，不影响方差。`),
                ],
                [
                  ["Square the coefficients", "系数平方"],
                  t(
                    `$\\operatorname{Var} = ${prodTex(a * a, vx)} + ${prodTex(b * b, vy)} = ${a * a * vx} + ${b * b * vy} = ${ans}$.`,
                    `$\\operatorname{Var} = ${prodTex(a * a, vx)} + ${prodTex(b * b, vy)} = ${a * a * vx} + ${b * b * vy} = ${ans}$。`,
                  ),
                ],
              ],
              t(
                `The sign in front of $Y$ played no part: $(-${b})^{2} = ${b * b}$ is the same as $${b}^{2}$.`,
                `$Y$ 前的符号不起作用：$(-${b})^{2} = ${b * b}$ 与 $${b}^{2}$ 相同。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 5.20.3 Computing Expected Values From Joint Distributions
  {
    id: "computing-expected-values-from-joint-distributions",
    title: t("Computing Expected Values From Joint Distributions", "根据联合分布计算数学期望"),
    summary: t(
      "The expected value of any function g(X, Y) is computed as E[g(X, Y)] = ∑∑ g(x, y) p(x, y) for discrete variables or ∬ g(x, y) f(x, y) dy dx for continuous variables.",
      "对任意函数 g(X, Y)，其数学期望在离散情形下由 E[g(X, Y)] = ∑∑ g(x, y) p(x, y) 计算，在连续情形下由 ∬ g(x, y) f(x, y) dy dx 计算。",
    ),
    intro: t(
      "Two counts $X, Y \\in \\{10, 20\\}$ have joint probabilities $0.4, 0.1, 0.1, 0.4$ for $(10, 10), (10, 20), (20, 10), (20, 20)$. Then $E[XY] = 100(0.4) + 200(0.1) + 200(0.1) + 400(0.4) = 240$.\n\nCheck: $E[X] = E[Y] = 15$, and $15 \\cdot 15 = 225$ is less than $240$, because the values tend to agree.\n\nIn this lesson we find $E[XY]$ from a table, the expectation of a nonlinear function from a table, and a covariance from a joint table.",
      "两个计数 $X, Y \\in \\{10, 20\\}$ 在 $(10, 10)$、$(10, 20)$、$(20, 10)$、$(20, 20)$ 的联合概率为 $0.4, 0.1, 0.1, 0.4$。于是 $E[XY] = 100(0.4) + 200(0.1) + 200(0.1) + 400(0.4) = 240$。\n\n检验：$E[X] = E[Y] = 15$，而 $15 \\cdot 15 = 225$ 小于 $240$，因为两个值倾向于一致。\n\n本课我们由概率表求 $E[XY]$、由概率表求非线性函数的期望，并由联合分布表求协方差。",
    ),
    prerequisites: ["expected-values-of-sums-and-products-of-random-variables"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "evaluating-discrete-joint-expectation",
        title: t("Evaluating E[XY] from a discrete probability table", "根据离散概率表计算 E[XY]"),
        explanation: t(
          "Multiply the two values in each cell of the table by the probability in that cell, and add the results over the whole table. $E[XY] = \\sum_x \\sum_y xy \\, p(x, y)$. For $X, Y \\in \\{10, 20\\}$ with probabilities $0.4, 0.1, 0.1, 0.4$, $E[XY] = 40 + 20 + 20 + 160 = 240$.\n\n> **Watch out.** Weight each cell by its product $xy$; adding only the probabilities gives $1$, and leaving out the off-diagonal cells loses part of the mean.",
          "把表格中每个格子对应的两个取值相乘，再乘以该格子的概率，然后对整个表格求和。$E[XY] = \\sum_x \\sum_y xy \\, p(x, y)$。若 $X, Y \\in \\{10, 20\\}$，概率为 $0.4, 0.1, 0.1, 0.4$，则 $E[XY] = 40 + 20 + 20 + 160 = 240$。\n\n> **注意。** 每一格都要乘以它的积 $xy$；只把概率相加得到 $1$，漏掉非对角格会丢掉一部分均值。",
        ),
        generate: (rng: Rng): Problem => {
          const p11 = rng.int(1, 5);
          const p12 = rng.int(1, 5);
          const p21 = rng.int(1, 5);
          const p22 = rng.int(1, 5);
          const total = p11 + p12 + p21 + p22;
          // Values: X in {1, 2}, Y in {1, 2}
          // E[XY] = 1*1*p11 + 1*2*p12 + 2*1*p21 + 2*2*p22
          const num = 1 * p11 + 2 * p12 + 2 * p21 + 4 * p22;

          return numberProblem({
            prompt: t(
              `The joint distribution of $X \\in \\{1, 2\\}$ and $Y \\in \\{1, 2\\}$ is given by $P(1, 1) = \\frac{${p11}}{${total}}$, $P(1, 2) = \\frac{${p12}}{${total}}$, $P(2, 1) = \\frac{${p21}}{${total}}$, and $P(2, 2) = \\frac{${p22}}{${total}}$. Evaluate the expectation $E[XY]$.`,
              `离散随机变量 $X \\in \\{1, 2\\}$ 与 $Y \\in \\{1, 2\\}$ 的联合分布由 $P(1, 1) = \\frac{${p11}}{${total}}$、$P(1, 2) = \\frac{${p12}}{${total}}$、$P(2, 1) = \\frac{${p21}}{${total}}$ 及 $P(2, 2) = \\frac{${p22}}{${total}}$ 给出。计算数学期望 $E[XY]$。`,
            ),
            answer: Q.of(num, total),
            mistakes: distinct(Q.of(num, total), [
              why(
                Q.of(p11 + p12 + p21 + p22, total),
                "That adds the probabilities without weighting them by $xy$.",
                "那是把概率相加，没有乘以 $xy$。",
              ),
              why(Q.of(p11 + 4 * p22, total), "That keeps only the diagonal cells.", "那是只保留了对角格。"),
              why(Q.of(num, 4 * total), "That divides once more by the number of cells.", "那是又除以了格子数。"),
            ]),
            solution: walked(
              [
                [
                  ["Weight each cell by $xy$", "每格乘以 $xy$"],
                  t(
                    `The products $xy$ are $1, 2, 2, 4$, so the cells contribute $\\frac{${p11}}{${total}}, \\frac{${2 * p12}}{${total}}, \\frac{${2 * p21}}{${total}}, \\frac{${4 * p22}}{${total}}$.`,
                    `积 $xy$ 分别为 $1, 2, 2, 4$，所以各格贡献 $\\frac{${p11}}{${total}}, \\frac{${2 * p12}}{${total}}, \\frac{${2 * p21}}{${total}}, \\frac{${4 * p22}}{${total}}$。`,
                  ),
                ],
                [
                  ["Add", "相加"],
                  t(
                    `$E[XY] = \\frac{${num}}{${total}}${lowestTerms(num, total)}$.`,
                    `$E[XY] = \\frac{${num}}{${total}}${lowestTerms(num, total)}$。`,
                  ),
                ],
              ],
              t("Every product $xy$ lies between $1$ and $4$, and so does the answer.", "每个积 $xy$ 都在 $1$ 与 $4$ 之间，答案也在其间。"),
            ),
          });
        },
      },
      {
        id: "the-expectation-of-a-nonlinear-function-from-a-table",
        title: t("The expectation of a nonlinear function from a table", "由联合分布表求非线性函数的期望"),
        explanation: t(
          "For a function that is not linear, such as $(X - Y)^{2}$ or $\\max(X, Y)$, there is no shortcut through $E[X]$ and $E[Y]$. Evaluate the function in every cell, multiply by the cell's probability, and add:\n\n$$E[g(X, Y)] = \\sum_x\\sum_y g(x, y)\\,p(x, y).$$\n\nCells where $g = 0$ contribute nothing, which often saves work. For $X, Y \\in \\{10, 20\\}$ with probabilities $0.4, 0.1, 0.1, 0.4$, only the two cells with $X \\ne Y$ count in $E[(X - Y)^{2}] = 100(0.1) + 100(0.1) = 20$, while $(E[X] - E[Y])^{2} = 0$.\n\n> **Watch out.** Do not put the means into $g$: $g(E[X], E[Y])$ is not $E[g(X, Y)]$ when $g$ is not linear.",
          "对于非线性函数，如 $(X - Y)^{2}$ 或 $\\max(X, Y)$，不能借助 $E[X]$ 与 $E[Y]$ 走捷径。要在每一格计算函数值，乘以该格的概率，再相加：\n\n$$E[g(X, Y)] = \\sum_x\\sum_y g(x, y)\\,p(x, y).$$\n\n$g = 0$ 的格没有贡献，常可省去计算。若 $X, Y \\in \\{10, 20\\}$，概率为 $0.4, 0.1, 0.1, 0.4$，则只有 $X \\ne Y$ 的两格计入 $E[(X - Y)^{2}] = 100(0.1) + 100(0.1) = 20$，而 $(E[X] - E[Y])^{2} = 0$。\n\n> **注意。** 不要把均值代入 $g$：当 $g$ 不是线性函数时，$g(E[X], E[Y])$ 不等于 $E[g(X, Y)]$。",
        ),
        generate: (rng: Rng): Problem => {
          const w = [0, 1, 2].map(() => [0, 1, 2].map(() => rng.int(1, 5)));
          const total = w.flat().reduce((s, v) => s + v, 0);
          const kind = rng.int(0, 1);
          const g = (x: number, y: number): number => (kind === 0 ? (x - y) ** 2 : Math.max(x, y));
          let num = 0;
          let ex = 0;
          let ey = 0;
          for (let x = 0; x < 3; x++)
            for (let y = 0; y < 3; y++) {
              const v = w[x]?.[y] ?? 0;
              num += g(x, y) * v;
              ex += x * v;
              ey += y * v;
            }
          const ans = Q.of(num, total);
          const naive = kind === 0 ? Q.of(ex, total).sub(Q.of(ey, total)).pow(2) : Q.of(Math.max(ex, ey), total);
          const label = kind === 0 ? "(X - Y)^{2}" : "\\max(X, Y)";
          const rows = [0, 1, 2]
            .map((x) => [0, 1, 2].map((y) => `P(${x}, ${y}) = \\frac{${w[x]?.[y]}}{${total}}`).join(",\\ "))
            .join(";\\ ");
          return numberProblem({
            prompt: t(
              `$X$ and $Y$ take values in $\\{0, 1, 2\\}$ with joint probabilities $${rows}$. Find $E[${label}]$.`,
              `$X$ 与 $Y$ 取值于 $\\{0, 1, 2\\}$，联合概率为 $${rows}$。求 $E[${label}]$。`,
            ),
            answer: ans,
            mistakes: distinct(ans, [
              why(
                naive,
                `That puts the means into $${label}$ instead of averaging $${label}$ over the cells.`,
                `那是把均值代入 $${label}$，而不是对各格的 $${label}$ 求平均。`,
              ),
              why(Q.of(num, 9), "That divides by the $9$ cells instead of by the total weight.", "那是除以 $9$ 个格子，而不是除以总权重。"),
              why(Q.of(num), "That forgets to divide by the total weight.", "那是忘了除以总权重。"),
            ]),
            solution: walked(
              [
                [
                  [`Evaluate $${label}$ in each cell`, `计算每格的 $${label}$`],
                  t(
                    kind === 0
                      ? "$(X - Y)^{2}$ is $0$ on the diagonal, $1$ where $X$ and $Y$ differ by $1$, and $4$ at $(0, 2)$ and $(2, 0)$."
                      : "$\\max(X, Y)$ is $0$ at $(0, 0)$, $1$ where the larger value is $1$, and $2$ wherever $X$ or $Y$ is $2$.",
                    kind === 0
                      ? "$(X - Y)^{2}$ 在对角线上为 $0$，在 $X$ 与 $Y$ 相差 $1$ 处为 $1$，在 $(0, 2)$ 与 $(2, 0)$ 处为 $4$。"
                      : "$\\max(X, Y)$ 在 $(0, 0)$ 处为 $0$，在较大值为 $1$ 处为 $1$，在 $X$ 或 $Y$ 为 $2$ 处为 $2$。",
                  ),
                ],
                [
                  ["Weight and add", "加权求和"],
                  t(
                    `Weighting each value by its cell's weight gives a total of $${num}$, so $E[${label}] = \\frac{${num}}{${total}}${lowestTerms(num, total)}$.`,
                    `把每格的值乘以该格权重再相加得 $${num}$，所以 $E[${label}] = \\frac{${num}}{${total}}${lowestTerms(num, total)}$。`,
                  ),
                ],
              ],
              t(
                `The answer is at least $${naive.toLatex()}$, the value from the means, as it must be for this convex function.`,
                `答案不小于由均值算出的 $${naive.toLatex()}$，对这个凸函数理应如此。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 5.20.4 Conditional Expectation for Discrete Random Variables
  {
    id: "conditional-expectation-for-discrete-random-variables",
    title: t("Conditional Expectation for Discrete Random Variables", "离散型随机变量的条件期望"),
    summary: t(
      "The conditional expectation of $Y$ given $X = x$ is the mean of the conditional distribution: $E[Y \\mid X = x] = \\sum_y y\\,p_{Y \\mid X}(y \\mid x)$.",
      "在 $X = x$ 的条件下，$Y$ 的条件期望是条件分布的均值：$E[Y \\mid X = x] = \\sum_y y\\,p_{Y \\mid X}(y \\mid x)$。",
    ),
    intro: t(
      "Among customers who buy on a weekend ($X = 1$), the number of items $Y$ is $10$ with probability $\\frac{3}{4}$ and $30$ with probability $\\frac{1}{4}$. Then $E[Y \\mid X = 1] = 10 \\cdot \\frac{3}{4} + 30 \\cdot \\frac{1}{4} = 15$.\n\nCheck: $15$ lies between $10$ and $30$, nearer $10$, which carries more probability.\n\nIn this lesson we find a conditional expectation from a conditional distribution, from a joint table, and the mean of a die given that it beats a value.",
      "在周末购物的顾客中（$X = 1$），购买件数 $Y$ 以概率 $\\frac{3}{4}$ 取 $10$，以概率 $\\frac{1}{4}$ 取 $30$。于是 $E[Y \\mid X = 1] = 10 \\cdot \\frac{3}{4} + 30 \\cdot \\frac{1}{4} = 15$。\n\n检验：$15$ 在 $10$ 与 $30$ 之间，且更靠近概率较大的 $10$。\n\n本课我们由条件分布、由联合分布表求条件期望，并求骰子在超过某值条件下的均值。",
    ),
    prerequisites: ["conditional-distributions-for-discrete-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-discrete-conditional-expectation",
        title: t("Calculating conditional expectation from conditional PMF", "根据条件概率质量函数计算条件期望"),
        explanation: t(
          "A conditional expectation is an ordinary mean computed with the conditional probabilities for the given value of the other variable. $E[Y \\mid X = x] = \\sum_y y \\, P(Y = y \\mid X = x)$. If given $X = 1$, $Y$ is $10$ with probability $\\frac{3}{4}$ and $30$ with probability $\\frac{1}{4}$, then $E[Y \\mid X = 1] = 7.5 + 7.5 = 15$.\n\n> **Watch out.** Weight each value by its own conditional probability; swapping the probabilities or taking the plain midpoint of the values is wrong unless the probabilities are equal.",
          "条件期望就是用另一个变量取给定值时的条件概率计算的普通均值。$E[Y \\mid X = x] = \\sum_y y \\, P(Y = y \\mid X = x)$。若在 $X = 1$ 条件下 $Y$ 以概率 $\\frac{3}{4}$ 取 $10$，以概率 $\\frac{1}{4}$ 取 $30$，则 $E[Y \\mid X = 1] = 7.5 + 7.5 = 15$。\n\n> **注意。** 每个值要乘以它自己的条件概率；把概率对调，或直接取两个值的中点，除非概率相等，否则都是错的。",
        ),
        generate: (rng: Rng): Problem => {
          const w1 = rng.int(1, 5);
          const w2 = rng.int(1, 5);
          const totalW = w1 + w2;
          // Y in {1, 3}
          // E[Y | X = 1] = (1*w1 + 3*w2) / totalW
          const num = w1 + 3 * w2;

          return numberProblem({
            prompt: t(
              `Given that $X = 1$, the random variable $Y$ takes values in $\\{1, 3\\}$ with conditional probabilities $P(Y = 1 \\mid X = 1) = \\frac{${w1}}{${totalW}}$ and $P(Y = 3 \\mid X = 1) = \\frac{${w2}}{${totalW}}$. Find the conditional expectation $E[Y \\mid X = 1]$.`,
              `已知 $X = 1$ 条件下，随机变量 $Y$ 在 $\\{1, 3\\}$ 上取值的条件概率分别为 $P(Y = 1 \\mid X = 1) = \\frac{${w1}}{${totalW}}$ 与 $P(Y = 3 \\mid X = 1) = \\frac{${w2}}{${totalW}}$。求条件期望 $E[Y \\mid X = 1]$。`,
            ),
            answer: Q.of(num, totalW),
            mistakes: distinct(Q.of(num, totalW), [
              why(
                Q.of(w1 + w2, totalW),
                "That adds the probabilities without weighting them by the values.",
                "那是把概率相加，没有乘以取值。",
              ),
              why(2, "That takes the midpoint of $1$ and $3$ and ignores the probabilities.", "那是取 $1$ 与 $3$ 的中点，忽略了概率。"),
              why(Q.of(3 * w1 + w2, totalW), "That swaps the two probabilities.", "那是把两个概率对调了。"),
            ]),
            solution: walked(
              [
                [
                  ["Weight each value", "对每个值加权"],
                  t(
                    `The value $1$ contributes $\\frac{${w1}}{${totalW}}$ and the value $3$ contributes $3 \\cdot \\frac{${w2}}{${totalW}} = \\frac{${3 * w2}}{${totalW}}$.`,
                    `值 $1$ 贡献 $\\frac{${w1}}{${totalW}}$，值 $3$ 贡献 $3 \\cdot \\frac{${w2}}{${totalW}} = \\frac{${3 * w2}}{${totalW}}$。`,
                  ),
                ],
                [
                  ["Add", "相加"],
                  t(
                    `$E[Y \\mid X = 1] = \\frac{${num}}{${totalW}}${lowestTerms(num, totalW)}$.`,
                    `$E[Y \\mid X = 1] = \\frac{${num}}{${totalW}}${lowestTerms(num, totalW)}$。`,
                  ),
                ],
              ],
              t(
                "The conditional mean lies between $1$ and $3$, nearer the value with the larger probability.",
                "条件均值在 $1$ 与 $3$ 之间，且更靠近概率较大的那个值。",
              ),
            ),
          });
        },
      },
      {
        id: "conditional-expectation-from-a-joint-table",
        title: t("Conditional expectation from a joint table", "由联合分布表求条件期望"),
        explanation: t(
          "Take the row for $X = x$, rescale it into a conditional distribution, and average $y$ over it:\n\n$$E[Y \\mid X = x] = \\frac{\\sum_y y\\,p(x, y)}{\\sum_y p(x, y)}.$$\n\nThe table's overall denominator cancels, so you may work with the weights directly. Different rows usually give different conditional means; how they vary with $x$ shows how $Y$ depends on $X$. If the row $X = 5$ has weights $10, 20, 30$ for $Y = 1, 2, 3$, then $E[Y \\mid X = 5] = \\frac{10 + 40 + 90}{60} = \\frac{7}{3}$.\n\n> **Watch out.** Divide by the row's total, not by the table's total, and use only the chosen row.",
          "取 $X = x$ 这一行，缩放成条件分布，再对其求 $y$ 的平均：\n\n$$E[Y \\mid X = x] = \\frac{\\sum_y y\\,p(x, y)}{\\sum_y p(x, y)}.$$\n\n表的总分母会约去，可以直接用权重计算。不同行通常给出不同的条件均值；它们随 $x$ 的变化反映了 $Y$ 如何依赖于 $X$。若 $X = 5$ 这一行在 $Y = 1, 2, 3$ 处的权重为 $10, 20, 30$，则 $E[Y \\mid X = 5] = \\frac{10 + 40 + 90}{60} = \\frac{7}{3}$。\n\n> **注意。** 要除以这一行的总和，而不是整张表的总和，并且只用所选的那一行。",
        ),
        generate: (rng: Rng): Problem => {
          const w = [0, 1].map(() => [1, 2, 3].map(() => rng.int(1, 9)));
          const total = w.flat().reduce((s, v) => s + v, 0);
          const x = rng.int(0, 1);
          const row = w[x] ?? [];
          const rs = row.reduce((s, v) => s + v, 0);
          const num = row.reduce((s, v, j) => s + (j + 1) * v, 0);
          const ans = Q.of(num, rs);
          const all = w.flat().reduce((s, v, i) => s + ((i % 3) + 1) * v, 0);
          const cells = [0, 1]
            .map((xx) => [1, 2, 3].map((y, jj) => `P(${xx}, ${y}) = \\frac{${w[xx]?.[jj]}}{${total}}`).join(",\\ "))
            .join(";\\ ");
          return numberProblem({
            prompt: t(
              `The joint distribution of $X \\in \\{0, 1\\}$ and $Y \\in \\{1, 2, 3\\}$ is $${cells}$. Find $E[Y \\mid X = ${x}]$.`,
              `$X \\in \\{0, 1\\}$ 与 $Y \\in \\{1, 2, 3\\}$ 的联合分布为 $${cells}$。求 $E[Y \\mid X = ${x}]$。`,
            ),
            answer: ans,
            mistakes: distinct(ans, [
              why(
                Q.of(num, total),
                "That divides by the table's total instead of the row's total.",
                "那是除以整张表的总和，而不是这一行的总和。",
              ),
              why(Q.of(all, total), "That is the overall mean $E[Y]$, which ignores the condition.", "那是总体均值 $E[Y]$，忽略了条件。"),
              why(Q.of(2), "That takes the middle value and ignores the weights.", "那是取中间值，忽略了权重。"),
            ]),
            solution: walked(
              [
                [
                  ["Take the row", "取出这一行"],
                  t(
                    `The row $X = ${x}$ has weights $${row.join(", ")}$, with total $${rs}$.`,
                    `$X = ${x}$ 这一行的权重为 $${row.join(", ")}$，和为 $${rs}$。`,
                  ),
                ],
                [
                  ["Average $y$ over the row", "对这一行求 $y$ 的平均"],
                  t(
                    `The values $y$ weight the row to $${row[0]} + ${2 * (row[1] ?? 0)} + ${3 * (row[2] ?? 0)} = ${num}$, so $E[Y \\mid X = ${x}] = \\frac{${num}}{${rs}}${lowestTerms(num, rs)}$.`,
                    `用取值 $y$ 加权得 $${row[0]} + ${2 * (row[1] ?? 0)} + ${3 * (row[2] ?? 0)} = ${num}$，所以 $E[Y \\mid X = ${x}] = \\frac{${num}}{${rs}}${lowestTerms(num, rs)}$。`,
                  ),
                ],
              ],
              t(
                "The conditional mean lies between $1$ and $3$, as every value of $Y$ does.",
                "条件均值在 $1$ 与 $3$ 之间，正如 $Y$ 的每个取值一样。",
              ),
            ),
          });
        },
      },
    ],
  },

  // 5.20.5 Conditional Variance for Discrete Random Variables
  {
    id: "conditional-variance-for-discrete-random-variables",
    title: t("Conditional Variance for Discrete Random Variables", "离散型随机变量的条件方差"),
    summary: t(
      "The conditional variance of $Y$ given $X = x$ is $\\operatorname{Var}(Y \\mid X = x) = E[Y^2 \\mid X = x] - (E[Y \\mid X = x])^2$.",
      "在 $X = x$ 的条件下，$Y$ 的条件方差为 $\\operatorname{Var}(Y \\mid X = x) = E[Y^2 \\mid X = x] - (E[Y \\mid X = x])^2$。",
    ),
    intro: t(
      "Given that a delivery is late ($X = 1$), its delay $Y$ is $0$ or $100$ minutes, each with probability $\\frac{1}{2}$. Then $E[Y \\mid X = 1] = 50$, $E[Y^{2} \\mid X = 1] = 5000$ and $\\operatorname{Var}(Y \\mid X = 1) = 5000 - 2500 = 2500$.\n\nCheck: both values sit $50$ from the conditional mean, so the conditional variance is $50^{2} = 2500$.\n\nIn this lesson we find a conditional variance from conditional moments and from conditional probabilities, and use the law of total variance.",
      "已知一次送货迟到（$X = 1$），其延误 $Y$ 以各 $\\frac{1}{2}$ 的概率为 $0$ 或 $100$ 分钟。于是 $E[Y \\mid X = 1] = 50$，$E[Y^{2} \\mid X = 1] = 5000$，$\\operatorname{Var}(Y \\mid X = 1) = 5000 - 2500 = 2500$。\n\n检验：两个值都与条件均值相差 $50$，所以条件方差为 $50^{2} = 2500$。\n\n本课我们由条件矩、由条件概率求条件方差，并运用全方差公式。",
    ),
    prerequisites: ["conditional-expectation-for-discrete-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-conditional-variance-discrete",
        title: t("Computing conditional variance using moments", "利用条件矩计算条件方差"),
        explanation: t(
          "The conditional variance uses the same shortcut as ordinary variance, with every expectation replaced by its conditional version. $\\operatorname{Var}(Y \\mid X = x) = E[Y^2 \\mid X = x] - (E[Y \\mid X = x])^2$. If, given $X = 1$, $Y$ is $0$ or $100$ with equal probability, the conditional variance is $5000 - 50^{2} = 2500$.\n\n> **Watch out.** Subtract the square of the conditional mean; $E[Y^{2} \\mid X = x]$ alone, or the mean itself, is not the variance.",
          "条件方差使用与普通方差相同的简便公式，只是把每个期望都换成条件期望。$\\operatorname{Var}(Y \\mid X = x) = E[Y^2 \\mid X = x] - (E[Y \\mid X = x])^2$。若在 $X = 1$ 条件下 $Y$ 以相等概率取 $0$ 或 $100$，则条件方差为 $5000 - 50^{2} = 2500$。\n\n> **注意。** 要减去条件均值的平方；单独的 $E[Y^{2} \\mid X = x]$ 或均值本身都不是方差。",
        ),
        generate: (rng: Rng): Problem => {
          // Let Y | X = x take values 0 with prob 1/2 and 2*k with prob 1/2
          const k = rng.int(1, 40);
          // E[Y | X] = k, E[Y^2 | X] = (0^2 + (2k)^2)/2 = 2k^2
          // Var(Y | X) = 2k^2 - k^2 = k^2
          const varVal = k * k;

          return numberProblem({
            prompt: t(
              `Given $X = 0$, $Y$ takes values $0$ and $${2 * k}$ each with equal conditional probability $\\frac{1}{2}$. Find the conditional variance $\\text{Var}(Y \\mid X = 0)$.`,
              `已知 $X = 0$ 条件下，$Y$ 分别以等条件概率 $\\frac{1}{2}$ 取值 $0$ 和 $${2 * k}$。求条件方差 $\\text{Var}(Y \\mid X = 0)$。`,
            ),
            answer: varVal,
            mistakes: distinct(varVal, [
              why(k, "That is the conditional mean, not the conditional variance.", "那是条件均值，而不是条件方差。"),
              why(
                2 * k * k,
                "That is $E[Y^{2} \\mid X = 0]$; the square of the mean still has to be subtracted.",
                "那是 $E[Y^{2} \\mid X = 0]$；还要减去均值的平方。",
              ),
              why(4 * k * k, "That is the square of the larger value, not a variance.", "那是较大值的平方，不是方差。"),
            ]),
            solution: walked(
              [
                [
                  ["Find the conditional moments", "求条件矩"],
                  t(
                    `$E[Y \\mid X = 0] = \\frac{1}{2}(0) + \\frac{1}{2}(${2 * k}) = ${k}$ and $E[Y^2 \\mid X = 0] = \\frac{1}{2}(0^2) + \\frac{1}{2}(${4 * k * k}) = ${2 * k * k}$.`,
                    `$E[Y \\mid X = 0] = \\frac{1}{2}(0) + \\frac{1}{2}(${2 * k}) = ${k}$，$E[Y^2 \\mid X = 0] = \\frac{1}{2}(0^2) + \\frac{1}{2}(${4 * k * k}) = ${2 * k * k}$。`,
                  ),
                ],
                [
                  ["Subtract the squared mean", "减去均值的平方"],
                  t(
                    `$\\text{Var}(Y \\mid X = 0) = ${2 * k * k} - ${k}^2 = ${varVal}$.`,
                    `$\\text{Var}(Y \\mid X = 0) = ${2 * k * k} - ${k}^2 = ${varVal}$。`,
                  ),
                ],
              ],
              t(
                `Both values $0$ and $${2 * k}$ sit $${k}$ from the mean $${k}$, so the variance is $${k}^{2} = ${varVal}$.`,
                `两个值 $0$ 与 $${2 * k}$ 都与均值 $${k}$ 相差 $${k}$，所以方差为 $${k}^{2} = ${varVal}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "conditional-variance-from-conditional-probabilities",
        title: t("Conditional variance from conditional probabilities", "由条件概率求条件方差"),
        explanation: t(
          "Compute the first two conditional moments and subtract:\n\n$$\\operatorname{Var}(Y \\mid X = x) = E[Y^{2} \\mid X = x] - \\left(E[Y \\mid X = x]\\right)^{2}.$$\n\nIf, given $X = 1$, $Y$ is $0$, $1$ or $2$ with probabilities $\\frac{1}{4}, \\frac{1}{2}, \\frac{1}{4}$, then $E[Y \\mid X = 1] = 1$, $E[Y^{2} \\mid X = 1] = \\frac{3}{2}$ and the conditional variance is $\\frac{1}{2}$. If instead $Y$ is $0$, $10$ or $20$ with those probabilities, the variance is $150 - 10^{2} = 50$.\n\n> **Watch out.** Square the conditional mean before subtracting it, and do not stop at $E[Y^{2} \\mid X = x]$.",
          "求出前两阶条件矩再相减：\n\n$$\\operatorname{Var}(Y \\mid X = x) = E[Y^{2} \\mid X = x] - \\left(E[Y \\mid X = x]\\right)^{2}.$$\n\n若给定 $X = 1$ 时 $Y$ 取 $0$、$1$、$2$ 的概率为 $\\frac{1}{4}, \\frac{1}{2}, \\frac{1}{4}$，则 $E[Y \\mid X = 1] = 1$，$E[Y^{2} \\mid X = 1] = \\frac{3}{2}$，条件方差为 $\\frac{1}{2}$。若改为以同样的概率取 $0$、$10$、$20$，则方差为 $150 - 10^{2} = 50$。\n\n> **注意。** 减去之前要先把条件均值平方，也不要停在 $E[Y^{2} \\mid X = x]$。",
        ),
        generate: (rng: Rng): Problem => {
          const ys = [0, rng.int(1, 3), rng.int(4, 6)];
          const ws = ys.map(() => rng.int(1, 6));
          const tot = ws.reduce((s, v) => s + v, 0);
          const m1 = Q.of(
            ws.reduce((s, v, i) => s + v * (ys[i] ?? 0), 0),
            tot,
          );
          const m2 = Q.of(
            ws.reduce((s, v, i) => s + v * (ys[i] ?? 0) ** 2, 0),
            tot,
          );
          const ans = m2.sub(m1.pow(2));
          return numberProblem({
            prompt: t(
              `Given $X = 1$, $Y$ takes the values $${ys.join(", ")}$ with conditional probabilities $${ws.map((v) => `\\frac{${v}}{${tot}}`).join(", ")}$. Find $\\operatorname{Var}(Y \\mid X = 1)$.`,
              `给定 $X = 1$，$Y$ 取值 $${ys.join(", ")}$ 的条件概率为 $${ws.map((v) => `\\frac{${v}}{${tot}}`).join(", ")}$。求 $\\operatorname{Var}(Y \\mid X = 1)$。`,
            ),
            answer: ans,
            mistakes: distinct(ans, [
              why(
                m2,
                "That is $E[Y^{2} \\mid X = 1]$; the squared mean still has to be subtracted.",
                "那是 $E[Y^{2} \\mid X = 1]$；还要减去均值的平方。",
              ),
              why(m2.sub(m1), "That subtracts the mean without squaring it.", "那是减去均值而没有平方。"),
              why(m1.pow(2), "That is the squared conditional mean, not the variance.", "那是条件均值的平方，而不是方差。"),
            ]),
            solution: walked(
              [
                [
                  ["Find the two conditional moments", "求两个条件矩"],
                  t(
                    `$E[Y \\mid X = 1] = ${m1.toLatex()}$ and $E[Y^{2} \\mid X = 1] = ${m2.toLatex()}$.`,
                    `$E[Y \\mid X = 1] = ${m1.toLatex()}$，$E[Y^{2} \\mid X = 1] = ${m2.toLatex()}$。`,
                  ),
                ],
                [
                  ["Subtract the squared mean", "减去均值的平方"],
                  t(
                    `$\\operatorname{Var}(Y \\mid X = 1) = ${m2.toLatex()} - \\left(${m1.toLatex()}\\right)^{2} = ${ans.toLatex()}$.`,
                    `$\\operatorname{Var}(Y \\mid X = 1) = ${m2.toLatex()} - \\left(${m1.toLatex()}\\right)^{2} = ${ans.toLatex()}$。`,
                  ),
                ],
              ],
              t(
                `The variance is positive and below $\\left(\\frac{${ys[2]}}{2}\\right)^{2} = ${Q.of((ys[2] ?? 0) ** 2, 4).toLatex()}$, the most a variable on $[0, ${ys[2]}]$ can have.`,
                `方差为正，且小于 $\\left(\\frac{${ys[2]}}{2}\\right)^{2} = ${Q.of((ys[2] ?? 0) ** 2, 4).toLatex()}$，这是取值在 $[0, ${ys[2]}]$ 上的变量方差的最大值。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 5.20.6 The Rule of the Lazy Statistician for Two Random Variables
  {
    id: "the-rule-of-the-lazy-statistician-for-two-random-variables",
    title: t("The Rule of the Lazy Statistician for Two Random Variables", "两个随机变量的无意识统计学家法则 (LOTUS)"),
    summary: t(
      "The Law of the Unconscious Statistician (LOTUS) enables computing E[g(X, Y)] directly from the joint distribution of (X, Y) without first finding the distribution of Z = g(X, Y).",
      "无意识统计学家法则（LOTUS）允许直接根据 (X, Y) 的联合分布计算 E[g(X, Y)]，而无需预先求出随机变量 Z = g(X, Y) 本身的概率分布。",
    ),
    intro: t(
      "To find $E[X^{10}Y^{10}]$ for the density $f(x, y) = 4xy$ on the unit square, we do not need the distribution of $X^{10}Y^{10}$. We integrate it against $f$: $4\\int_0^1 x^{11}\\,dx\\int_0^1 y^{11}\\,dy = \\frac{4}{144} = \\frac{1}{36}$.\n\nCheck: $X^{10}Y^{10}$ lies between $0$ and $1$ and is small unless both $X$ and $Y$ are near $1$, so a small mean such as $\\frac{1}{36}$ is reasonable.\n\nIn this lesson we set up the two-variable rule, evaluate a two-variable integral with it, and find the expected maximum, minimum and distance of two uniforms.",
      "要对单位正方形上的密度 $f(x, y) = 4xy$ 求 $E[X^{10}Y^{10}]$，不必求出 $X^{10}Y^{10}$ 的分布，只需把它对 $f$ 积分：$4\\int_0^1 x^{11}\\,dx\\int_0^1 y^{11}\\,dy = \\frac{4}{144} = \\frac{1}{36}$。\n\n检验：$X^{10}Y^{10}$ 在 $0$ 与 $1$ 之间，除非 $X$ 与 $Y$ 都接近 $1$，否则它很小，所以 $\\frac{1}{36}$ 这样小的均值是合理的。\n\n本课我们建立二元的法则，用它计算二元积分，并求两个均匀变量的最大值、最小值与距离的期望。",
    ),
    prerequisites: ["computing-expected-values-from-joint-distributions"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "lotus-for-two-variables-concept",
        title: t("Understanding the direct expectation integral/sum under LOTUS", "理解 LOTUS 下直接期望积分与求和的概念"),
        explanation: t(
          "You can average a function of two variables directly against their joint density, without first working out the distribution of the function itself. $E[g(X, Y)] = \\iint g(x, y) f(x, y) \\, dy \\, dx$ eliminates the need to determine the density of $g(X, Y)$. For $E[100X + Y^{2}]$, the integrand is $(100x + y^{2})\\,f_{X,Y}(x, y)$ over the whole plane.\n\n> **Watch out.** Put the whole function $g(x, y)$ inside one double integral against the joint density; do not split a sum into a product of integrals or put the means into $g$.",
          "可以直接用联合密度对两个变量的函数求平均，而不必先求出这个函数本身的分布。$E[g(X, Y)] = \\iint g(x, y) f(x, y) \\, dy \\, dx$ 免除了求解 $g(X, Y)$ 本身概率密度的繁琐步骤。对 $E[100X + Y^{2}]$，被积函数是整个平面上的 $(100x + y^{2})\\,f_{X,Y}(x, y)$。\n\n> **注意。** 要把整个函数 $g(x, y)$ 放进对联合密度的一个二重积分里；不要把和拆成积分之积，也不要把均值代入 $g$。",
        ),
        generate: (rng: Rng): Problem => {
          const c = rng.int(2, 50);

          const opts = [
            t(
              `$\\int_{-\\infty}^\\infty \\int_{-\\infty}^\\infty (${c} x + y^2) f_{X,Y}(x, y) \\, dy \\, dx$`,
              `$\\int_{-\\infty}^\\infty \\int_{-\\infty}^\\infty (${c} x + y^2) f_{X,Y}(x, y) \\, dy \\, dx$`,
            ),
            t(
              `$\\int_{-\\infty}^\\infty (${c} x) f_X(x) \\, dx \\times \\int_{-\\infty}^\\infty y^2 f_Y(y) \\, dy$`,
              `$\\int_{-\\infty}^\\infty (${c} x) f_X(x) \\, dx \\times \\int_{-\\infty}^\\infty y^2 f_Y(y) \\, dy$`,
            ),
            t(
              `$\\frac{d}{dx} \\left[ (${c} x + y^2) f_{X,Y}(x, y) \\right]$`,
              `$\\frac{d}{dx} \\left[ (${c} x + y^2) f_{X,Y}(x, y) \\right]$`,
            ),
            t(`$(${c} E[X] + E[Y])^2$`, `$(${c} E[X] + E[Y])^2$`),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);
          return reasoned(
            choiceProblem({
              prompt: t(
                `By the 2D Law of the Unconscious Statistician (LOTUS), what is the direct double integral used to evaluate the expected value $E[${c}X + Y^2]$ for continuous random variables with joint PDF $f_{X,Y}(x, y)$?`,
                `根据二维无意识统计学家法则（LOTUS），对于联合概率密度为 $f_{X,Y}(x, y)$ 的连续随机变量，直接计算期望值 $E[${c}X + Y^2]$ 的二重积分表达式是什么？`,
              ),
              options,
              correct,
              solution: walked(
                [
                  [
                    ["State the rule", "写出法则"],
                    t(
                      "LOTUS states that $E[g(X, Y)] = \\int_{-\\infty}^\\infty \\int_{-\\infty}^\\infty g(x, y) f_{X,Y}(x, y) \\, dy \\, dx$.",
                      "LOTUS 指出 $E[g(X, Y)] = \\int_{-\\infty}^\\infty \\int_{-\\infty}^\\infty g(x, y) f_{X,Y}(x, y) \\, dy \\, dx$。",
                    ),
                  ],
                  [
                    ["Insert the function", "代入函数"],
                    t(
                      `Setting $g(x, y) = ${c}x + y^2$ gives $\\int_{-\\infty}^\\infty \\int_{-\\infty}^\\infty (${c} x + y^2) f_{X,Y}(x, y) \\, dy \\, dx$.`,
                      `令 $g(x, y) = ${c}x + y^2$，得 $\\int_{-\\infty}^\\infty \\int_{-\\infty}^\\infty (${c} x + y^2) f_{X,Y}(x, y) \\, dy \\, dx$。`,
                    ),
                  ],
                ],
                t(
                  `By linearity this equals $${c}E[X] + E[Y^{2}]$, which is what $E[${c}X + Y^2]$ means.`,
                  `由线性性，它等于 $${c}E[X] + E[Y^{2}]$，正是 $E[${c}X + Y^2]$ 的含义。`,
                ),
              ),
            }),
            [
              [
                opts[1]!.en,
                "A sum becomes a product here, and the marginals need not describe the pair: integrate against the joint density.",
                "这里把和变成了积，而且边缘密度不一定能描述这一对变量：要对联合密度积分。",
              ],
              [opts[2]!.en, "An expectation is an integral over both variables, not a derivative.", "期望是对两个变量的积分，不是导数。"],
              [
                opts[3]!.en,
                "This puts expectations inside a function, and the rule averages the function itself over the joint density.",
                "这是把期望放进函数里，而这条规则是把函数本身按联合密度取平均。",
              ],
            ],
          );
        },
      },
      {
        id: "evaluating-a-two-variable-lotus-integral",
        title: t("Evaluating a two-variable LOTUS integral", "计算二元无意识统计学家法则积分"),
        explanation: t(
          "For $f(x, y) = 4xy$ on the unit square, the rule gives $E[X^{m}Y^{k}] = \\int_0^1\\int_0^1 x^{m}y^{k} \\cdot 4xy\\,dy\\,dx$. The integrand factors, so the double integral is a product:\n\n$$E[X^{m}Y^{k}] = 4\\int_0^1 x^{m+1}\\,dx\\int_0^1 y^{k+1}\\,dy = \\frac{4}{(m + 2)(k + 2)}.$$\n\nFor example, $E[XY] = \\frac{4}{9}$ and $E[X^{2}] = \\frac{4}{4 \\cdot 2} = \\frac{1}{2}$, and $E[X^{10}Y^{10}] = \\frac{4}{12 \\cdot 12} = \\frac{1}{36}$.\n\n> **Watch out.** The density's own $xy$ raises each power by one, and its constant $4$ stays in front.",
          "对单位正方形上的 $f(x, y) = 4xy$，由该法则 $E[X^{m}Y^{k}] = \\int_0^1\\int_0^1 x^{m}y^{k} \\cdot 4xy\\,dy\\,dx$。被积函数可以分解，所以二重积分成为乘积：\n\n$$E[X^{m}Y^{k}] = 4\\int_0^1 x^{m+1}\\,dx\\int_0^1 y^{k+1}\\,dy = \\frac{4}{(m + 2)(k + 2)}.$$\n\n例如 $E[XY] = \\frac{4}{9}$，$E[X^{2}] = \\frac{4}{4 \\cdot 2} = \\frac{1}{2}$，$E[X^{10}Y^{10}] = \\frac{4}{12 \\cdot 12} = \\frac{1}{36}$。\n\n> **注意。** 密度本身的 $xy$ 使每个幂次加一，常数 $4$ 要保留在前面。",
        ),
        generate: (rng: Rng): Problem => {
          const m = rng.int(0, 5);
          const k = rng.int(m === 0 ? 1 : 0, 5);
          const ans = Q.of(4, (m + 2) * (k + 2));
          const pw = (v: string, e: number): string => (e === 0 ? "" : e === 1 ? v : `${v}^{${e}}`);
          const g = `${pw("X", m)}${pw("Y", k)}`;
          return numberProblem({
            prompt: t(
              `$(X, Y)$ has joint density $f(x, y) = 4xy$ on $0 \\le x, y \\le 1$. Find $E[${g}]$.`,
              `$(X, Y)$ 的联合密度为 $0 \\le x, y \\le 1$ 上的 $f(x, y) = 4xy$。求 $E[${g}]$。`,
            ),
            answer: ans,
            mistakes: distinct(ans, [
              why(
                Q.of(1, (m + 1) * (k + 1)),
                "That averages over the unit square as if the density were $1$.",
                "那是把密度当作 $1$ 在单位正方形上求平均。",
              ),
              why(
                Q.of(4, (m + 1) * (k + 1)),
                "That keeps the $4$ but forgets that the density's $xy$ raises each power by one.",
                "那是保留了 $4$，却忘了密度中的 $xy$ 使每个幂次加一。",
              ),
              why(Q.of(1, (m + 2) * (k + 2)), "That drops the constant $4$ of the density.", "那是丢掉了密度的常数 $4$。"),
            ]),
            solution: walked(
              [
                [
                  ["Set up and factor the integral", "列出积分并分解"],
                  t(
                    `$E[${g}] = 4\\int_0^1 ${pw("x", m + 1)}\\,dx\\int_0^1 ${pw("y", k + 1)}\\,dy$.`,
                    `$E[${g}] = 4\\int_0^1 ${pw("x", m + 1)}\\,dx\\int_0^1 ${pw("y", k + 1)}\\,dy$。`,
                  ),
                ],
                [
                  ["Evaluate", "计算"],
                  t(
                    `$4 \\cdot \\frac{1}{${m + 2}} \\cdot \\frac{1}{${k + 2}} = ${ans.toLatex()}$.`,
                    `$4 \\cdot \\frac{1}{${m + 2}} \\cdot \\frac{1}{${k + 2}} = ${ans.toLatex()}$。`,
                  ),
                ],
              ],
              t(
                `The formula $\\frac{4}{(m + 2)(k + 2)}$ with $m = ${m}$ and $k = ${k}$ gives $\\frac{4}{${(m + 2) * (k + 2)}}$, the same value.`,
                `公式 $\\frac{4}{(m + 2)(k + 2)}$ 取 $m = ${m}$，$k = ${k}$ 得 $\\frac{4}{${(m + 2) * (k + 2)}}$，数值相同。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 5.20.7 The Law of Total Expectation for Discrete Random Variables
  {
    id: "the-law-of-total-expectation-for-discrete-random-variables",
    title: t("The Law of Total Expectation for Discrete Random Variables", "离散型随机变量的全期望公式"),
    summary: t(
      "The law of total expectation states that $E[Y] = E[E[Y \\mid X]] = \\sum_x E[Y \\mid X = x]\\,P(X = x)$.",
      "全期望公式指出 $E[Y] = E[E[Y \\mid X]] = \\sum_x E[Y \\mid X = x]\\,P(X = x)$。",
    ),
    intro: t(
      "A server is busy with probability $\\frac{1}{4}$, when requests take $200$ ms on average, and idle otherwise, when they take $100$ ms. The overall mean is $200 \\cdot \\frac{1}{4} + 100 \\cdot \\frac{3}{4} = 125$ ms.\n\nCheck: $125$ lies between $100$ and $200$, nearer $100$, the more likely state.\n\nIn this lesson we find an overall mean from conditional means, the mean of a random sum, and the expected wait for two successes in a row.",
      "一台服务器以 $\\frac{1}{4}$ 的概率繁忙，此时请求平均耗时 $200$ 毫秒；否则空闲，平均耗时 $100$ 毫秒。总均值为 $200 \\cdot \\frac{1}{4} + 100 \\cdot \\frac{3}{4} = 125$ 毫秒。\n\n检验：$125$ 在 $100$ 与 $200$ 之间，且更靠近可能性较大的状态对应的 $100$。\n\n本课我们由条件均值求总均值，求随机和的均值，并求连续两次成功所需的期望等待次数。",
    ),
    prerequisites: ["conditional-expectation-for-discrete-random-variables"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "evaluating-law-of-total-expectation",
        title: t("Computing overall mean via conditional expectations", "通过条件期望加权计算总体均值"),
        explanation: t(
          "The overall mean is a weighted average of the conditional means, with each weight being the probability of its condition. By the law of total expectation, $E[Y] = \\sum_x E[Y \\mid X = x] \\, P(X = x)$. With conditional means $200$ and $100$ and probabilities $\\frac{1}{4}$ and $\\frac{3}{4}$, $E[Y] = 50 + 75 = 125$.\n\n> **Watch out.** Pair each conditional mean with its own probability; the plain average of the conditional means is right only when the conditions are equally likely.",
          "总均值是各条件均值的加权平均，每个权重是相应条件发生的概率。由全期望公式，$E[Y] = \\sum_x E[Y \\mid X = x] \\, P(X = x)$。若条件均值为 $200$ 与 $100$，概率为 $\\frac{1}{4}$ 与 $\\frac{3}{4}$，则 $E[Y] = 50 + 75 = 125$。\n\n> **注意。** 每个条件均值要配上它自己的概率；只有各条件等可能时，条件均值的简单平均才正确。",
        ),
        generate: (rng: Rng): Problem => {
          const e1 = rng.int(10, 40);
          const e2 = rng.int(50, 90);
          const p1 = rng.pick([
            { num: 1, den: 2 },
            { num: 1, den: 4 },
            { num: 3, den: 4 },
            { num: 1, den: 5 },
            { num: 2, den: 5 },
          ]);
          const num = e1 * p1.num + e2 * (p1.den - p1.num);
          const den = p1.den;

          return numberProblem({
            prompt: t(
              `A system operates in State 1 with probability $\\frac{${p1.num}}{${p1.den}}$ and in State 2 with probability $\\frac{${p1.den - p1.num}}{${p1.den}}$. The conditional expected response time is $E[T \\mid \\text{State 1}] = ${e1}$ ms and $E[T \\mid \\text{State 2}] = ${e2}$ ms. Find the overall expected response time $E[T]$.`,
              `某系统以 $\\frac{${p1.num}}{${p1.den}}$ 的概率处于状态 1，以 $\\frac{${p1.den - p1.num}}{${p1.den}}$ 的概率处于状态 2。条件平均响应时间分别为 $E[T \\mid \\text{状态 1}] = ${e1}$ ms 与 $E[T \\mid \\text{状态 2}] = ${e2}$ ms。求总平均响应时间 $E[T]$。`,
            ),
            answer: Q.of(num, den),
            mistakes: distinct(Q.of(num, den), [
              why(
                Q.of(e1 + e2, 2),
                "That takes the plain average of the conditional means and ignores the probabilities.",
                "那是对条件均值取简单平均，忽略了概率。",
              ),
              why(
                Q.of(e1 * (p1.den - p1.num) + e2 * p1.num, den),
                "That pairs each conditional mean with the other state's probability.",
                "那是把每个条件均值配上了另一个状态的概率。",
              ),
              why(e1 + e2, "That adds the conditional means without weighting them.", "那是把条件均值直接相加，没有加权。"),
            ]),
            solution: walked(
              [
                [
                  ["Weight each conditional mean", "对每个条件均值加权"],
                  t(
                    `$E[T] = E[T \\mid \\text{State 1}] P(\\text{State 1}) + E[T \\mid \\text{State 2}] P(\\text{State 2}) = ${e1} \\left(\\frac{${p1.num}}{${p1.den}}\\right) + ${e2} \\left(\\frac{${p1.den - p1.num}}{${p1.den}}\\right)$.`,
                    `$E[T] = E[T \\mid \\text{状态 1}] P(\\text{状态 1}) + E[T \\mid \\text{状态 2}] P(\\text{状态 2}) = ${e1} \\left(\\frac{${p1.num}}{${p1.den}}\\right) + ${e2} \\left(\\frac{${p1.den - p1.num}}{${p1.den}}\\right)$。`,
                  ),
                ],
                [
                  ["Add", "相加"],
                  t(
                    `$E[T] = \\frac{${num}}{${den}}${lowestTerms(num, den)}$ ms.`,
                    `$E[T] = \\frac{${num}}{${den}}${lowestTerms(num, den)}$ 毫秒。`,
                  ),
                ],
              ],
              t(
                `The overall mean lies between $${e1}$ and $${e2}$, nearer the state with the larger probability.`,
                `总均值在 $${e1}$ 与 $${e2}$ 之间，且更靠近概率较大的状态。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-mean-of-a-random-sum",
        title: t("The mean of a random sum", "随机和的均值"),
        explanation: t(
          "Let $N$ be a count and $X_1, X_2, \\ldots$ independent copies of $X$, independent of $N$. Conditioning on $N$ gives $E[S \\mid N = n] = nE[X]$ for $S = X_1 + \\cdots + X_N$, and averaging over $N$:\n\n$$E[S] = E\\big[E[S \\mid N]\\big] = E[N]\\,E[X].$$\n\nIf a shop gets on average $12$ customers an hour who each spend on average $\\$5$, expected hourly takings are $\\$60$. With $E[N] = 150$ claims and a mean claim of $40$, $E[S] = 6000$.\n\n> **Watch out.** Use the mean count $E[N]$, not the largest count or the midpoint of the counts, and multiply it by $E[X]$.",
          "设 $N$ 为计数，$X_1, X_2, \\ldots$ 为 $X$ 的独立副本，且与 $N$ 独立。对 $N$ 取条件，$S = X_1 + \\cdots + X_N$ 满足 $E[S \\mid N = n] = nE[X]$，再对 $N$ 求平均：\n\n$$E[S] = E\\big[E[S \\mid N]\\big] = E[N]\\,E[X].$$\n\n若一家店平均每小时 $12$ 位顾客，每人平均消费 $5$ 元，则每小时期望营业额为 $60$ 元。若 $E[N] = 150$ 次理赔，平均每次 $40$，则 $E[S] = 6000$。\n\n> **注意。** 要用平均次数 $E[N]$，而不是最大次数或次数的中点，再乘以 $E[X]$。",
        ),
        generate: (rng: Rng): Problem => {
          const ns = [rng.int(0, 2), rng.int(3, 5)];
          const pn = rng.int(1, 4);
          const pd = pn + rng.int(1, 4);
          const en = Q.of(ns[0] ?? 0)
            .mul(Q.of(pn, pd))
            .add(Q.of(ns[1] ?? 0).mul(Q.of(pd - pn, pd)));
          const ex = Q.of(rng.int(2, 15), rng.pick([1, 2]));
          const ans = en.mul(ex);
          const mid = Q.of((ns[0] ?? 0) + (ns[1] ?? 0), 2);
          return numberProblem({
            prompt: t(
              `The number of claims $N$ in a month is $${ns[0]}$ with probability $\\frac{${pn}}{${pd}}$ and $${ns[1]}$ otherwise. Each claim, independently of $N$, has mean size $${ex.toLatex()}$. Find the expected total of the claims.`,
              `一个月内的理赔次数 $N$ 以概率 $\\frac{${pn}}{${pd}}$ 为 $${ns[0]}$，否则为 $${ns[1]}$。每次理赔与 $N$ 独立，平均金额为 $${ex.toLatex()}$。求理赔总额的期望。`,
            ),
            answer: ans,
            mistakes: distinct(ans, [
              why(mid.mul(ex), "That uses the midpoint of the two counts instead of the mean count.", "那是用两个次数的中点代替平均次数。"),
              why(Q.of(ns[1] ?? 0).mul(ex), "That uses the larger count as if it always happened.", "那是把较大的次数当作总会发生。"),
              why(
                en,
                "That is the mean count $E[N]$; it still has to be multiplied by the mean claim.",
                "那是平均次数 $E[N]$；还要乘以平均理赔额。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find $E[N]$", "求 $E[N]$"],
                  t(
                    `$E[N] = ${qProdTex(Q.of(ns[0] ?? 0), Q.of(pn, pd))} + ${qProdTex(Q.of(ns[1] ?? 0), Q.of(pd - pn, pd))} = ${en.toLatex()}$.`,
                    `$E[N] = ${qProdTex(Q.of(ns[0] ?? 0), Q.of(pn, pd))} + ${qProdTex(Q.of(ns[1] ?? 0), Q.of(pd - pn, pd))} = ${en.toLatex()}$。`,
                  ),
                ],
                [
                  ["Multiply by $E[X]$", "乘以 $E[X]$"],
                  t(
                    `$E[S] = E[N]\\,E[X] = ${qProdTex(en, ex)} = ${ans.toLatex()}$.`,
                    `$E[S] = E[N]\\,E[X] = ${qProdTex(en, ex)} = ${ans.toLatex()}$。`,
                  ),
                ],
              ],
              t(
                `$E[N] = ${en.toLatex()}$ lies between the counts $${ns[0]}$ and $${ns[1]}$, so the total lies between $${Q.of(ns[0] ?? 0)
                  .mul(ex)
                  .toLatex()}$ and $${Q.of(ns[1] ?? 0)
                  .mul(ex)
                  .toLatex()}$.`,
                `$E[N] = ${en.toLatex()}$ 在次数 $${ns[0]}$ 与 $${ns[1]}$ 之间，所以总额在 $${Q.of(ns[0] ?? 0)
                  .mul(ex)
                  .toLatex()}$ 与 $${Q.of(ns[1] ?? 0)
                  .mul(ex)
                  .toLatex()}$ 之间。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 5.21.1 The Covariance of Two Random Variables
  {
    id: "the-covariance-of-two-random-variables",
    title: t("The Covariance of Two Random Variables", "两个随机变量的协方差"),
    summary: t(
      "The covariance of $X$ and $Y$ measures how they vary together: $\\operatorname{Cov}(X, Y) = E[(X - \\mu_X)(Y - \\mu_Y)] = E[XY] - E[X]E[Y]$.",
      "协方差度量 $X$ 与 $Y$ 共同变化的程度：$\\operatorname{Cov}(X, Y) = E[(X - \\mu_X)(Y - \\mu_Y)] = E[XY] - E[X]E[Y]$。",
    ),
    intro: t(
      "Hours studied $X$ and test score $Y$ have $E[X] = 20$, $E[Y] = 70$ and $E[XY] = 1450$. Their covariance is $1450 - 20 \\cdot 70 = 50$, so more hours tend to go with higher scores.\n\nCheck: if $X$ and $Y$ were independent, $E[XY]$ would be exactly $1400$ and the covariance $0$.\n\nIn this lesson we find a covariance from expectations, the covariance of two indicators, and the covariance of linear combinations.",
      "学习时数 $X$ 与考试分数 $Y$ 满足 $E[X] = 20$，$E[Y] = 70$，$E[XY] = 1450$。协方差为 $1450 - 20 \\cdot 70 = 50$，所以学习时间越长，分数往往越高。\n\n检验：若 $X$ 与 $Y$ 独立，$E[XY]$ 恰为 $1400$，协方差为 $0$。\n\n本课我们由期望求协方差，求两个示性变量的协方差，以及线性组合的协方差。",
    ),
    prerequisites: ["computing-expected-values-from-joint-distributions"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-covariance-formula",
        title: t("Computing covariance from expectations", "根据期望值计算协方差"),
        explanation: t(
          "Covariance measures whether two variables tend to be above their means together, and the shortcut is the mean of the product minus the product of the means. $\\operatorname{Cov}(X, Y) = E[XY] - E[X] \\, E[Y]$. With $E[X] = 20$, $E[Y] = 70$ and $E[XY] = 1350$, $\\operatorname{Cov}(X, Y) = 1350 - 1400 = -50$.\n\n> **Watch out.** Subtract the product of the means from $E[XY]$, in that order; $E[XY]$ alone is not the covariance.",
          "协方差衡量两个变量是否倾向于同时高于各自的均值，简便公式是乘积的均值减去均值的乘积。$\\operatorname{Cov}(X, Y) = E[XY] - E[X] \\, E[Y]$。若 $E[X] = 20$，$E[Y] = 70$，$E[XY] = 1350$，则 $\\operatorname{Cov}(X, Y) = 1350 - 1400 = -50$。\n\n> **注意。** 要从 $E[XY]$ 中减去均值之积，顺序不能反；单独的 $E[XY]$ 不是协方差。",
        ),
        generate: (rng: Rng): Problem => {
          const eX = rng.int(2, 10);
          const eY = rng.int(2, 10);
          const cov = rng.int(-15, 25);
          const eXY = eX * eY + cov;

          return numberProblem({
            prompt: t(
              `Given that $E[X] = ${eX}$, $E[Y] = ${eY}$, and $E[XY] = ${eXY}$, calculate the covariance $\\text{Cov}(X, Y)$.`,
              `已知 $E[X] = ${eX}$、$E[Y] = ${eY}$ 且 $E[XY] = ${eXY}$。计算协方差 $\\text{Cov}(X, Y)$。`,
            ),
            answer: cov,
            mistakes: distinct(cov, [
              why(eXY, "That is $E[XY]$; the product of the means still has to be subtracted.", "那是 $E[XY]$；还要减去均值之积。"),
              why(eXY + eX * eY, "That adds the product of the means instead of subtracting it.", "那是加上均值之积，而不是减去。"),
              why(eX * eY - eXY, "That subtracts in the wrong order.", "那是减的顺序反了。"),
            ]),
            solution: walked(
              [
                [
                  ["Multiply the means", "均值相乘"],
                  t(`$E[X]\\,E[Y] = (${eX})(${eY}) = ${eX * eY}$.`, `$E[X]\\,E[Y] = (${eX})(${eY}) = ${eX * eY}$。`),
                ],
                [
                  ["Subtract from $E[XY]$", "从 $E[XY]$ 中减去"],
                  t(`$\\text{Cov}(X, Y) = ${eXY} - ${eX * eY} = ${cov}$.`, `$\\text{Cov}(X, Y) = ${eXY} - ${eX * eY} = ${cov}$。`),
                ],
              ],
              t(
                `Adding back, $${eX * eY} + ${par(Q.of(cov))} = ${eXY}$ is the given $E[XY]$.`,
                `加回去，$${eX * eY} + ${par(Q.of(cov))} = ${eXY}$ 正是已知的 $E[XY]$。`,
              ),
            ),
          });
        },
      },
      {
        id: "covariance-of-two-indicators",
        title: t("Covariance of two indicators", "两个示性变量的协方差"),
        explanation: t(
          "For indicators $X, Y \\in \\{0, 1\\}$, $XY = 1$ only when both are $1$, so $E[XY] = P(X = 1, Y = 1)$ and\n\n$$\\operatorname{Cov}(X, Y) = P(X = 1, Y = 1) - P(X = 1)\\,P(Y = 1).$$\n\nThe sign tells whether the two events happen together more often than independence would predict (positive) or less often (negative). With $P(X = 1, Y = 1) = 0.1$ and $P(X = 1) = P(Y = 1) = 0.5$, $\\operatorname{Cov}(X, Y) = 0.1 - 0.25 = -0.15$.\n\n> **Watch out.** Find $P(X = 1)$ and $P(Y = 1)$ by adding the two cells of each margin, and subtract their product from the joint probability, not the other way round.",
          "对示性变量 $X, Y \\in \\{0, 1\\}$，只有两者都为 $1$ 时 $XY = 1$，所以 $E[XY] = P(X = 1, Y = 1)$，并且\n\n$$\\operatorname{Cov}(X, Y) = P(X = 1, Y = 1) - P(X = 1)\\,P(Y = 1).$$\n\n符号说明两个事件同时发生的频率比独立时预期的更高（正）还是更低（负）。若 $P(X = 1, Y = 1) = 0.1$，$P(X = 1) = P(Y = 1) = 0.5$，则 $\\operatorname{Cov}(X, Y) = 0.1 - 0.25 = -0.15$。\n\n> **注意。** $P(X = 1)$ 与 $P(Y = 1)$ 要把各自边缘的两格相加求得，再用联合概率减去它们的积，顺序不能反。",
        ),
        generate: (rng: Rng): Problem => {
          const w = [rng.int(1, 9), rng.int(1, 9), rng.int(1, 9), rng.int(1, 9)];
          const [a = 0, b = 0, c = 0, d = 0] = w;
          const tot = a + b + c + d;
          const p11 = Q.of(d, tot);
          const px = Q.of(c + d, tot);
          const py = Q.of(b + d, tot);
          const ans = p11.sub(px.mul(py));
          return numberProblem({
            prompt: t(
              `Indicators $X$ and $Y$ have $P(0, 0) = \\frac{${a}}{${tot}}$, $P(0, 1) = \\frac{${b}}{${tot}}$, $P(1, 0) = \\frac{${c}}{${tot}}$, $P(1, 1) = \\frac{${d}}{${tot}}$. Find $\\operatorname{Cov}(X, Y)$.`,
              `示性变量 $X$ 与 $Y$ 满足 $P(0, 0) = \\frac{${a}}{${tot}}$，$P(0, 1) = \\frac{${b}}{${tot}}$，$P(1, 0) = \\frac{${c}}{${tot}}$，$P(1, 1) = \\frac{${d}}{${tot}}$。求 $\\operatorname{Cov}(X, Y)$。`,
            ),
            answer: ans,
            mistakes: distinct(ans, [
              why(
                p11,
                "That is $E[XY] = P(1, 1)$; the product of the margins still has to be subtracted.",
                "那是 $E[XY] = P(1, 1)$；还要减去边缘概率之积。",
              ),
              why(px.mul(py).sub(p11), "That subtracts in the wrong order.", "那是减的顺序反了。"),
              why(px.mul(py), "That is the product of the margins, not the covariance.", "那是边缘概率之积，而不是协方差。"),
            ]),
            solution: walked(
              [
                [
                  ["Read the margins", "读出边缘概率"],
                  t(
                    `$E[XY] = P(1, 1) = ${p11.toLatex()}$, $P(X = 1) = ${px.toLatex()}$ and $P(Y = 1) = ${py.toLatex()}$.`,
                    `$E[XY] = P(1, 1) = ${p11.toLatex()}$，$P(X = 1) = ${px.toLatex()}$，$P(Y = 1) = ${py.toLatex()}$。`,
                  ),
                ],
                [
                  ["Subtract the product", "减去乘积"],
                  t(
                    `$\\operatorname{Cov}(X, Y) = ${p11.toLatex()} - ${px.toLatex()} \\cdot ${py.toLatex()} = ${ans.toLatex()}$.`,
                    `$\\operatorname{Cov}(X, Y) = ${p11.toLatex()} - ${px.toLatex()} \\cdot ${py.toLatex()} = ${ans.toLatex()}$。`,
                  ),
                ],
              ],
              t(
                ans.sign() > 0
                  ? "The covariance is positive: both indicators are $1$ more often than independence predicts."
                  : ans.sign() < 0
                    ? "The covariance is negative: both indicators are $1$ less often than independence predicts."
                    : "The covariance is $0$: both indicators are $1$ exactly as often as independence predicts.",
                ans.sign() > 0
                  ? "协方差为正：两个示性变量同时为 $1$ 的频率高于独立时的预期。"
                  : ans.sign() < 0
                    ? "协方差为负：两个示性变量同时为 $1$ 的频率低于独立时的预期。"
                    : "协方差为 $0$：两个示性变量同时为 $1$ 的频率恰与独立时相同。",
              ),
            ),
          });
        },
      },
    ],
  },

  // 5.21.2 Variance of Sums of Random Variables
  {
    id: "variance-of-sums-of-random-variables",
    title: t("Variance of Sums of Random Variables", "随机变量和的方差"),
    summary: t(
      "For any random variables, $\\operatorname{Var}(aX + bY) = a^2\\operatorname{Var}(X) + b^2\\operatorname{Var}(Y) + 2ab\\operatorname{Cov}(X, Y)$.",
      "对任意随机变量，$\\operatorname{Var}(aX + bY) = a^2\\operatorname{Var}(X) + b^2\\operatorname{Var}(Y) + 2ab\\operatorname{Cov}(X, Y)$。",
    ),
    intro: t(
      "The returns of two stocks have variances $100$ and $144$ and covariance $60$. A portfolio holding one share of each has variance $100 + 144 + 2 \\cdot 60 = 364$, while the difference of the two returns has variance $100 + 144 - 120 = 124$.\n\nCheck: with no covariance both would be $244$; moving together adds spread to the sum and removes it from the difference.\n\nIn this lesson we find the variance of a sum with its covariance term, of a weighted difference, and of a sum with equal covariances.",
      "两只股票收益率的方差为 $100$ 与 $144$，协方差为 $60$。各持一股的组合方差为 $100 + 144 + 2 \\cdot 60 = 364$，而两者收益之差的方差为 $100 + 144 - 120 = 124$。\n\n检验：若没有协方差，两者都是 $244$；同向变动使和的波动增大，使差的波动减小。\n\n本课我们求含协方差项的和的方差、加权差的方差，以及协方差都相等时和的方差。",
    ),
    prerequisites: ["the-covariance-of-two-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-variance-with-covariance",
        title: t("Computing variance of a sum using the covariance term", "利用协方差项计算随机变量和的方差"),
        explanation: t(
          "When variables are dependent, the variance of a sum includes twice their covariance, which adds spread when they move together. $\\operatorname{Var}(X + Y) = \\operatorname{Var}(X) + \\operatorname{Var}(Y) + 2\\operatorname{Cov}(X, Y)$. With variances $100$ and $144$ and covariance $-30$, $\\operatorname{Var}(X + Y) = 244 - 60 = 184$.\n\n> **Watch out.** The covariance enters twice, with its own sign; dropping it or counting it once gives the wrong variance.",
          "当变量相关时，和的方差包含两倍的协方差，它们同向变动时会增大分散程度。$\\operatorname{Var}(X + Y) = \\operatorname{Var}(X) + \\operatorname{Var}(Y) + 2\\operatorname{Cov}(X, Y)$。若方差为 $100$ 与 $144$，协方差为 $-30$，则 $\\operatorname{Var}(X + Y) = 244 - 60 = 184$。\n\n> **注意。** 协方差要带着自己的符号计入两次；丢掉它或只算一次都会出错。",
        ),
        generate: (rng: Rng): Problem => {
          const vx = rng.int(5, 30);
          const vy = rng.int(5, 30);
          const cov = rng.int(-5, 10);
          const totalVar = vx + vy + 2 * cov;

          return numberProblem({
            prompt: t(
              `Two correlated random variables have variances $\\text{Var}(X) = ${vx}$, $\\text{Var}(Y) = ${vy}$, and covariance $\\text{Cov}(X, Y) = ${cov}$. Find the variance of their sum $\\text{Var}(X + Y)$.`,
              `两个相关的随机变量满足方差 $\\text{Var}(X) = ${vx}$、$\\text{Var}(Y) = ${vy}$ 及协方差 $\\text{Cov}(X, Y) = ${cov}$。求两者之和的方差 $\\text{Var}(X + Y)$。`,
            ),
            answer: totalVar,
            mistakes: distinct(totalVar, [
              why(
                vx + vy,
                "That drops the covariance term, as if the variables were independent.",
                "那是丢掉了协方差项，好像两个变量独立一样。",
              ),
              why(vx + vy + cov, "That counts the covariance once instead of twice.", "那是只计入一次协方差，而不是两次。"),
              why(vx + vy - 2 * cov, "That subtracts the covariance term instead of adding it.", "那是减去协方差项，而不是加上。"),
            ]),
            solution: walked(
              [
                [
                  ["Write the formula", "写出公式"],
                  t(
                    "$\\text{Var}(X + Y) = \\text{Var}(X) + \\text{Var}(Y) + 2\\text{Cov}(X, Y)$.",
                    "$\\text{Var}(X + Y) = \\text{Var}(X) + \\text{Var}(Y) + 2\\text{Cov}(X, Y)$。",
                  ),
                ],
                [["Substitute", "代入"], t(`$${vx} + ${vy} + 2(${cov}) = ${totalVar}$.`, `$${vx} + ${vy} + 2(${cov}) = ${totalVar}$。`)],
              ],
              t(
                cov === 0
                  ? `With zero covariance the variance is just $${vx} + ${vy}$.`
                  : `The covariance $${cov}$ moves the variance ${cov > 0 ? "up" : "down"} from $${vx + vy}$ by $${Math.abs(2 * cov)}$.`,
                cov === 0
                  ? `协方差为零时，方差就是 $${vx} + ${vy}$。`
                  : `协方差 $${cov}$ 使方差从 $${vx + vy}$ ${cov > 0 ? "增加" : "减少"} $${Math.abs(2 * cov)}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-variance-of-a-weighted-difference",
        title: t("The variance of a weighted difference", "加权差的方差"),
        explanation: t(
          "Expanding the square in the definition of variance gives, for any constants $a$ and $b$,\n\n$$\\operatorname{Var}(aX - bY) = a^{2}\\operatorname{Var}(X) + b^{2}\\operatorname{Var}(Y) - 2ab\\operatorname{Cov}(X, Y).$$\n\nThe minus sign flips the covariance term: two positively related variables partly cancel in a difference, so the difference varies less than if they were independent. With $\\operatorname{Var}(X) = 100$, $\\operatorname{Var}(Y) = 144$ and $\\operatorname{Cov}(X, Y) = 60$, $\\operatorname{Var}(2X - 3Y) = 400 + 1296 - 720 = 976$.\n\n> **Watch out.** In a difference the covariance term is subtracted; adding it, or leaving it out, gives the wrong variance.",
          "展开方差定义中的平方，对任意常数 $a$ 与 $b$ 有\n\n$$\\operatorname{Var}(aX - bY) = a^{2}\\operatorname{Var}(X) + b^{2}\\operatorname{Var}(Y) - 2ab\\operatorname{Cov}(X, Y).$$\n\n减号使协方差项变号：正相关的两个变量在差中部分抵消，因此差的波动比独立时小。若 $\\operatorname{Var}(X) = 100$，$\\operatorname{Var}(Y) = 144$，$\\operatorname{Cov}(X, Y) = 60$，则 $\\operatorname{Var}(2X - 3Y) = 400 + 1296 - 720 = 976$。\n\n> **注意。** 在差中协方差项要减去；把它加上或漏掉都会得到错误的方差。",
        ),
        generate: (rng: Rng): Problem => {
          const a = rng.int(1, 4);
          const b = rng.int(1, 4);
          const vx = rng.int(4, 16);
          const vy = rng.int(4, 16);
          const lim = Math.floor(Math.sqrt(vx * vy));
          let c = rng.int(-lim + 1, lim - 1);
          if (c === 0) c = 1;
          const ans = a * a * vx + b * b * vy - 2 * a * b * c;
          const fmt = (k: number, v: string): string => (k === 1 ? v : `${k}${v}`);
          return numberProblem({
            prompt: t(
              `$\\operatorname{Var}(X) = ${vx}$, $\\operatorname{Var}(Y) = ${vy}$ and $\\operatorname{Cov}(X, Y) = ${c}$. Find $\\operatorname{Var}(${fmt(a, "X")} - ${fmt(b, "Y")})$.`,
              `$\\operatorname{Var}(X) = ${vx}$，$\\operatorname{Var}(Y) = ${vy}$，$\\operatorname{Cov}(X, Y) = ${c}$。求 $\\operatorname{Var}(${fmt(a, "X")} - ${fmt(b, "Y")})$。`,
            ),
            answer: ans,
            mistakes: distinct(ans, [
              why(
                a * a * vx + b * b * vy + 2 * a * b * c,
                "That adds the covariance term; in a difference it is subtracted.",
                "那是加上协方差项；在差中它要减去。",
              ),
              why(a * a * vx + b * b * vy, "That leaves out the covariance term.", "那是漏掉了协方差项。"),
              why(
                a * a * vx - b * b * vy - 2 * a * b * c,
                "That subtracts the variance of $Y$; squared coefficients are never negative.",
                "那是减去了 $Y$ 的方差；系数的平方从不为负。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the three terms", "求出三项"],
                  t(
                    `$a^{2}\\operatorname{Var}(X) = ${prodTex(a * a, vx)} = ${a * a * vx}$, $b^{2}\\operatorname{Var}(Y) = ${prodTex(b * b, vy)} = ${b * b * vy}$ and $2ab\\operatorname{Cov}(X, Y) = ${2 * a * b * c}$.`,
                    `$a^{2}\\operatorname{Var}(X) = ${prodTex(a * a, vx)} = ${a * a * vx}$，$b^{2}\\operatorname{Var}(Y) = ${prodTex(b * b, vy)} = ${b * b * vy}$，$2ab\\operatorname{Cov}(X, Y) = ${2 * a * b * c}$。`,
                  ),
                ],
                [
                  ["Subtract the covariance term", "减去协方差项"],
                  t(
                    `$${a * a * vx} + ${b * b * vy} ${2 * a * b * c < 0 ? "+" : "-"} ${Math.abs(2 * a * b * c)} = ${ans}$.`,
                    `$${a * a * vx} + ${b * b * vy} ${2 * a * b * c < 0 ? "+" : "-"} ${Math.abs(2 * a * b * c)} = ${ans}$。`,
                  ),
                ],
              ],
              t(
                `The variance $${ans}$ is positive, as it must be; the covariance $${c}$ ${c > 0 ? "lowered" : "raised"} it from $${a * a * vx + b * b * vy}$.`,
                `方差 $${ans}$ 为正，理应如此；协方差 $${c}$ 使它从 $${a * a * vx + b * b * vy}$ ${c > 0 ? "降低" : "升高"}。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 5.21.3 The Covariance Matrix
  {
    id: "the-covariance-matrix",
    title: t("The Covariance Matrix", "协方差矩阵"),
    summary: t(
      "The covariance matrix $\\Sigma$ of a random vector $\\mathbf{X} = (X_1, \\dots, X_p)^T$ is a symmetric positive semidefinite $p \\times p$ matrix with $\\Sigma_{ij} = \\operatorname{Cov}(X_i, X_j)$ and the variances on the diagonal.",
      "随机向量 $\\mathbf{X} = (X_1, \\dots, X_p)^T$ 的协方差矩阵 $\\Sigma$ 是对称半正定的 $p \\times p$ 矩阵，$\\Sigma_{ij} = \\operatorname{Cov}(X_i, X_j)$，对角元为各方差。",
    ),
    intro: t(
      "Height and weight have variances $100$ and $400$ and covariance $150$, so $\\Sigma = \\begin{pmatrix} 100 & 150 \\\\ 150 & 400 \\end{pmatrix}$. For $\\mathbf{a} = (2, -1)$, $\\operatorname{Var}(2X_1 - X_2) = 400 - 600 + 400 = 200$.\n\nCheck: the matrix is symmetric, and its trace $500$ is the total of the two variances.\n\nIn this lesson we read the entries of a covariance matrix, find the variance of $\\mathbf{a}^{\\mathsf{T}}\\mathbf{X}$ from it, and find a correlation from a covariance matrix.",
      "身高与体重的方差为 $100$ 与 $400$，协方差为 $150$，所以 $\\Sigma = \\begin{pmatrix} 100 & 150 \\\\ 150 & 400 \\end{pmatrix}$。对 $\\mathbf{a} = (2, -1)$，$\\operatorname{Var}(2X_1 - X_2) = 400 - 600 + 400 = 200$。\n\n检验：矩阵是对称的，它的迹 $500$ 是两个方差之和。\n\n本课我们读出协方差矩阵的元素，由它求 $\\mathbf{a}^{\\mathsf{T}}\\mathbf{X}$ 的方差，并由协方差矩阵求相关系数。",
    ),
    prerequisites: ["the-covariance-of-two-random-variables"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "covariance-matrix-symmetry-and-entries",
        title: t("Identifying diagonal and off-diagonal entries of covariance matrix", "识别协方差矩阵的对角与非对角元素"),
        explanation: t(
          "The covariance of a variable with itself is its variance, and covariance does not depend on order, so the matrix is symmetric. The diagonal holds the variances $\\operatorname{Var}(X_i)$, and the off-diagonal entries are $\\operatorname{Cov}(X_i, X_j) = \\operatorname{Cov}(X_j, X_i)$. In $\\begin{pmatrix} 100 & 150 \\\\ 150 & 400 \\end{pmatrix}$ the variances are $100$ and $400$, so the trace is $500$.\n\n> **Watch out.** The trace adds only the diagonal; the covariances off the diagonal do not enter it, and it is not the determinant.",
          "变量与自身的协方差就是它的方差，而协方差与顺序无关，所以这个矩阵是对称的。对角元为方差 $\\operatorname{Var}(X_i)$，非对角元为协方差 $\\operatorname{Cov}(X_i, X_j) = \\operatorname{Cov}(X_j, X_i)$。在 $\\begin{pmatrix} 100 & 150 \\\\ 150 & 400 \\end{pmatrix}$ 中，方差为 $100$ 与 $400$，所以迹为 $500$。\n\n> **注意。** 迹只把对角元相加；非对角的协方差不计入，迹也不是行列式。",
        ),
        generate: (rng: Rng): Problem => {
          const v1 = rng.int(4, 25);
          const v2 = rng.int(4, 25);
          const cov = rng.int(-3, 5);

          return numberProblem({
            prompt: t(
              `The random vector $(X_1, X_2)^T$ has covariance matrix $\\Sigma = \\begin{pmatrix} ${v1} & ${cov} \\\\ ${cov} & ${v2} \\end{pmatrix}$. Find the trace $\\text{tr}(\\Sigma) = \\text{Var}(X_1) + \\text{Var}(X_2)$.`,
              `随机向量 $(X_1, X_2)^T$ 的协方差矩阵为 $\\Sigma = \\begin{pmatrix} ${v1} & ${cov} \\\\ ${cov} & ${v2} \\end{pmatrix}$。求迹 $\\text{tr}(\\Sigma) = \\text{Var}(X_1) + \\text{Var}(X_2)$。`,
            ),
            answer: v1 + v2,
            mistakes: distinct(v1 + v2, [
              why(
                v1 + v2 + 2 * cov,
                "That adds the off-diagonal covariances too; the trace uses only the diagonal.",
                "那是把非对角的协方差也加上了；迹只用对角元。",
              ),
              why(v1 * v2 - cov * cov, "That is the determinant, not the trace.", "那是行列式，而不是迹。"),
              why(v1 + v2 + cov, "That adds one covariance; the trace uses only the diagonal.", "那是加上了一个协方差；迹只用对角元。"),
            ]),
            solution: walked(
              [
                [
                  ["Read the diagonal", "读出对角元"],
                  t(
                    `The diagonal holds the variances $\\text{Var}(X_1) = ${v1}$ and $\\text{Var}(X_2) = ${v2}$.`,
                    `对角元是方差 $\\text{Var}(X_1) = ${v1}$ 与 $\\text{Var}(X_2) = ${v2}$。`,
                  ),
                ],
                [
                  ["Add them", "相加"],
                  t(`$\\text{tr}(\\Sigma) = ${v1} + ${v2} = ${v1 + v2}$.`, `$\\text{tr}(\\Sigma) = ${v1} + ${v2} = ${v1 + v2}$。`),
                ],
              ],
              t(
                `The two off-diagonal entries are equal, $${cov}$ and $${cov}$, as symmetry requires, and neither enters the trace.`,
                `两个非对角元相等，都是 $${cov}$，符合对称性，且都不计入迹。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-variance-of-a-linear-combination-from-the-covariance-matrix",
        title: t(
          "The variance of $\\mathbf{a}^{\\mathsf{T}}\\mathbf{X}$ from the covariance matrix",
          "由协方差矩阵求 $\\mathbf{a}^{\\mathsf{T}}\\mathbf{X}$ 的方差",
        ),
        explanation: t(
          "For a random vector $\\mathbf{X}$ with covariance matrix $\\Sigma$ and a constant vector $\\mathbf{a}$,\n\n$$\\operatorname{Var}(\\mathbf{a}^{\\mathsf{T}}\\mathbf{X}) = \\mathbf{a}^{\\mathsf{T}}\\Sigma\\,\\mathbf{a} = \\sum_i\\sum_j a_i a_j\\Sigma_{ij}.$$\n\nIn two dimensions this is $a_1^{2}\\Sigma_{11} + 2a_1a_2\\Sigma_{12} + a_2^{2}\\Sigma_{22}$: each off-diagonal entry is counted twice, once as $\\Sigma_{12}$ and once as $\\Sigma_{21}$. With $\\Sigma_{11} = 100$, $\\Sigma_{12} = 150$, $\\Sigma_{22} = 400$ and $\\mathbf{a} = (2, -1)$, the variance is $400 - 600 + 400 = 200$.\n\n> **Watch out.** Square $a_1$ and $a_2$ on the diagonal terms, and keep the cross term $2a_1a_2\\Sigma_{12}$ with its sign, whose $2$ counts both off-diagonal entries.",
          "对协方差矩阵为 $\\Sigma$ 的随机向量 $\\mathbf{X}$ 与常向量 $\\mathbf{a}$，\n\n$$\\operatorname{Var}(\\mathbf{a}^{\\mathsf{T}}\\mathbf{X}) = \\mathbf{a}^{\\mathsf{T}}\\Sigma\\,\\mathbf{a} = \\sum_i\\sum_j a_i a_j\\Sigma_{ij}.$$\n\n二维时为 $a_1^{2}\\Sigma_{11} + 2a_1a_2\\Sigma_{12} + a_2^{2}\\Sigma_{22}$：每个非对角元计入两次，一次作为 $\\Sigma_{12}$，一次作为 $\\Sigma_{21}$。若 $\\Sigma_{11} = 100$，$\\Sigma_{12} = 150$，$\\Sigma_{22} = 400$，$\\mathbf{a} = (2, -1)$，则方差为 $400 - 600 + 400 = 200$。\n\n> **注意。** 对角项要把 $a_1$、$a_2$ 平方，交叉项 $2a_1a_2\\Sigma_{12}$ 要带着符号保留，其中的 $2$ 计入了两个非对角元。",
        ),
        generate: (rng: Rng): Problem => {
          const s11 = rng.int(2, 10);
          const s22 = rng.int(2, 10);
          const lim = Math.floor(Math.sqrt(s11 * s22));
          let s12 = rng.int(-lim + 1, lim - 1);
          if (s12 === 0) s12 = -1;
          let a1 = rng.int(-3, 3);
          if (a1 === 0) a1 = 2;
          let a2 = rng.int(-3, 3);
          if (a2 === 0) a2 = -1;
          const ans = a1 * a1 * s11 + 2 * a1 * a2 * s12 + a2 * a2 * s22;
          return numberProblem({
            prompt: t(
              `$\\mathbf{X} = (X_1, X_2)$ has covariance matrix $\\Sigma = \\begin{pmatrix} ${s11} & ${s12} \\\\ ${s12} & ${s22} \\end{pmatrix}$. Find $\\operatorname{Var}(\\mathbf{a}^{\\mathsf{T}}\\mathbf{X})$ for $\\mathbf{a} = (${a1}, ${a2})$.`,
              `$\\mathbf{X} = (X_1, X_2)$ 的协方差矩阵为 $\\Sigma = \\begin{pmatrix} ${s11} & ${s12} \\\\ ${s12} & ${s22} \\end{pmatrix}$。对 $\\mathbf{a} = (${a1}, ${a2})$ 求 $\\operatorname{Var}(\\mathbf{a}^{\\mathsf{T}}\\mathbf{X})$。`,
            ),
            answer: ans,
            mistakes: distinct(ans, [
              why(
                a1 * a1 * s11 + a1 * a2 * s12 + a2 * a2 * s22,
                "That counts the off-diagonal entry once instead of twice.",
                "那是只计入一次非对角元，而不是两次。",
              ),
              why(a1 * a1 * s11 + a2 * a2 * s22, "That leaves out the covariance term.", "那是漏掉了协方差项。"),
              why(
                a1 * s11 + 2 * a1 * a2 * s12 + a2 * s22,
                "That does not square the coefficients on the diagonal terms.",
                "那是对角项的系数没有平方。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the three terms", "求出三项"],
                  t(
                    `$a_1^{2}\\Sigma_{11} = ${prodTex(a1 * a1, s11)} = ${a1 * a1 * s11}$, $2a_1a_2\\Sigma_{12} = 2(${a1})(${a2})(${s12}) = ${2 * a1 * a2 * s12}$ and $a_2^{2}\\Sigma_{22} = ${prodTex(a2 * a2, s22)} = ${a2 * a2 * s22}$.`,
                    `$a_1^{2}\\Sigma_{11} = ${prodTex(a1 * a1, s11)} = ${a1 * a1 * s11}$，$2a_1a_2\\Sigma_{12} = 2(${a1})(${a2})(${s12}) = ${2 * a1 * a2 * s12}$，$a_2^{2}\\Sigma_{22} = ${prodTex(a2 * a2, s22)} = ${a2 * a2 * s22}$。`,
                  ),
                ],
                [
                  ["Add", "相加"],
                  t(
                    `$\\mathbf{a}^{\\mathsf{T}}\\Sigma\\mathbf{a} = ${a1 * a1 * s11} + ${par(Q.of(2 * a1 * a2 * s12))} + ${a2 * a2 * s22} = ${ans}$.`,
                    `$\\mathbf{a}^{\\mathsf{T}}\\Sigma\\mathbf{a} = ${a1 * a1 * s11} + ${par(Q.of(2 * a1 * a2 * s12))} + ${a2 * a2 * s22} = ${ans}$。`,
                  ),
                ],
              ],
              t(
                `The variance $${ans}$ is positive, as a variance from a valid covariance matrix must be.`,
                `方差 $${ans}$ 为正，由有效协方差矩阵得到的方差理应如此。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 5.21.4 The Correlation Coefficient for Two Random Variables
  {
    id: "the-correlation-coefficient-for-two-random-variables",
    title: t("The Correlation Coefficient for Two Random Variables", "两个随机变量的相关系数"),
    summary: t(
      "The correlation coefficient $\\rho = \\frac{\\operatorname{Cov}(X, Y)}{\\sigma_X \\sigma_Y}$ scales covariance to $[-1, 1]$ and measures the strength and direction of a linear relationship.",
      "相关系数 $\\rho = \\frac{\\operatorname{Cov}(X, Y)}{\\sigma_X \\sigma_Y}$ 把协方差标准化到 $[-1, 1]$，度量线性关系的强度与方向。",
    ),
    intro: t(
      "Height in centimetres and weight in kilograms have standard deviations $10$ and $20$ and covariance $150$. Their correlation is $\\frac{150}{10 \\cdot 20} = \\frac{3}{4}$, a strong positive linear relationship.\n\nCheck: measuring height in metres divides the covariance by $100$ and $\\sigma_X$ by $100$ too, so $\\rho$ stays $\\frac{3}{4}$.\n\nIn this lesson we compute a correlation from a covariance, find the variance of a sum from the correlation, read a correlation from a scatter plot, and find the largest possible variance of a sum.",
      "以厘米计的身高与以千克计的体重标准差为 $10$ 与 $20$，协方差为 $150$。相关系数为 $\\frac{150}{10 \\cdot 20} = \\frac{3}{4}$，是较强的正线性关系。\n\n检验：把身高改用米计，协方差除以 $100$，$\\sigma_X$ 也除以 $100$，所以 $\\rho$ 仍为 $\\frac{3}{4}$。\n\n本课我们由协方差计算相关系数，由相关系数求和的方差，从散点图读出相关系数，并求和的方差的最大可能值。",
    ),
    prerequisites: ["the-covariance-of-two-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "computing-correlation-coefficient",
        title: t("Evaluating the correlation coefficient from covariance and standard deviations", "根据协方差与标准差计算相关系数"),
        explanation: t(
          "Dividing the covariance by both standard deviations removes the units, giving a number between minus one and one that measures linear association. $\\rho(X, Y) = \\frac{\\operatorname{Cov}(X, Y)}{\\sigma_X \\sigma_Y}$. With $\\sigma_X = 10$, $\\sigma_Y = 20$ and $\\operatorname{Cov}(X, Y) = -150$, $\\rho = -\\frac{3}{4}$.\n\n> **Watch out.** Divide by the product of the standard deviations, not by the variances and not by their sum.",
          "把协方差除以两个标准差就去掉了单位，得到一个介于 $-1$ 和 $1$ 之间、衡量线性关联程度的数。$\\rho(X, Y) = \\frac{\\operatorname{Cov}(X, Y)}{\\sigma_X \\sigma_Y}$。若 $\\sigma_X = 10$，$\\sigma_Y = 20$，$\\operatorname{Cov}(X, Y) = -150$，则 $\\rho = -\\frac{3}{4}$。\n\n> **注意。** 要除以两个标准差之积，而不是除以方差，也不是除以它们的和。",
        ),
        generate: (rng: Rng): Problem => {
          // Choose clean values: sx, sy, cov
          const sx = rng.int(2, 10);
          const sy = rng.int(2, 10);
          const maxCov = sx * sy;
          const cov = rng.int(-maxCov + 1, maxCov - 1);

          return numberProblem({
            prompt: t(
              `Two random variables $X$ and $Y$ have standard deviations $\\sigma_X = ${sx}$ and $\\sigma_Y = ${sy}$, and covariance $\\text{Cov}(X, Y) = ${cov}$. Find their correlation coefficient $\\rho(X, Y)$.`,
              `两个随机变量 $X$ 与 $Y$ 的标准差分别为 $\\sigma_X = ${sx}$ 与 $\\sigma_Y = ${sy}$，协方差为 $\\text{Cov}(X, Y) = ${cov}$。求相关系数 $\\rho(X, Y)$。`,
            ),
            answer: Q.of(cov, sx * sy),
            mistakes: distinct(Q.of(cov, sx * sy), [
              why(
                Q.of(cov, sx * sx * sy * sy),
                "That divides by the product of the variances instead of the standard deviations.",
                "那是除以方差之积，而不是标准差之积。",
              ),
              why(
                Q.of(cov, sx + sy),
                "That divides by the sum of the standard deviations instead of their product.",
                "那是除以标准差之和，而不是它们的积。",
              ),
              why(Q.of(cov, sx * sy * sy), "That squares one of the standard deviations.", "那是把其中一个标准差平方了。"),
            ]),
            solution: walked(
              [
                [
                  ["Multiply the standard deviations", "标准差相乘"],
                  t(`$\\sigma_X \\sigma_Y = (${sx})(${sy}) = ${sx * sy}$.`, `$\\sigma_X \\sigma_Y = (${sx})(${sy}) = ${sx * sy}$。`),
                ],
                [
                  ["Divide the covariance", "用协方差相除"],
                  t(
                    `$\\rho(X, Y) = \\frac{${cov}}{${sx * sy}}${lowestTerms(cov, sx * sy)}$.`,
                    `$\\rho(X, Y) = \\frac{${cov}}{${sx * sy}}${lowestTerms(cov, sx * sy)}$。`,
                  ),
                ],
              ],
              t(
                `Since $|${cov}| < ${sx * sy}$, the correlation lies strictly between $-1$ and $1$ and has the sign of the covariance.`,
                `由于 $|${cov}| < ${sx * sy}$，相关系数严格介于 $-1$ 与 $1$ 之间，并与协方差同号。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-variance-of-a-sum-from-the-correlation",
        title: t("The variance of a sum from the correlation", "由相关系数求和的方差"),
        explanation: t(
          "Since $\\operatorname{Cov}(X, Y) = \\rho\\,\\sigma_X\\sigma_Y$, the variance of a sum can be written with the correlation:\n\n$$\\operatorname{Var}(X + Y) = \\sigma_X^{2} + \\sigma_Y^{2} + 2\\rho\\,\\sigma_X\\sigma_Y.$$\n\nWith $\\sigma_X = 3$, $\\sigma_Y = 4$ and $\\rho = \\frac{1}{2}$: $9 + 16 + 12 = 37$. At $\\rho = 0$ it is $25$, and at $\\rho = -1$ it is $(4 - 3)^{2} = 1$. With $\\sigma_X = 10$, $\\sigma_Y = 20$ and $\\rho = -\\frac{3}{4}$: $100 + 400 - 300 = 200$.\n\n> **Watch out.** Turn the correlation into a covariance first, then count that covariance twice; squaring the standard deviations is needed for the first two terms.",
          "由于 $\\operatorname{Cov}(X, Y) = \\rho\\,\\sigma_X\\sigma_Y$，和的方差可以用相关系数表示：\n\n$$\\operatorname{Var}(X + Y) = \\sigma_X^{2} + \\sigma_Y^{2} + 2\\rho\\,\\sigma_X\\sigma_Y.$$\n\n若 $\\sigma_X = 3$，$\\sigma_Y = 4$，$\\rho = \\frac{1}{2}$：$9 + 16 + 12 = 37$。$\\rho = 0$ 时为 $25$，$\\rho = -1$ 时为 $(4 - 3)^{2} = 1$。若 $\\sigma_X = 10$，$\\sigma_Y = 20$，$\\rho = -\\frac{3}{4}$：$100 + 400 - 300 = 200$。\n\n> **注意。** 先把相关系数化为协方差，再把协方差计入两次；前两项要用标准差的平方。",
        ),
        generate: (rng: Rng): Problem => {
          const sx = rng.int(1, 8);
          const sy = rng.int(1, 8);
          const rho = rng.pick([Q.of(1, 2), Q.of(-1, 2), Q.of(1, 4), Q.of(-1, 4), Q.of(3, 4), Q.of(-3, 4), Q.of(1, 5), Q.of(-2, 5)]);
          const cov = rho.mul(Q.of(sx * sy));
          const base = Q.of(sx * sx + sy * sy);
          const ans = base.add(cov.mul(Q.of(2)));
          const covSteps = sx * sy === 1 ? rho.toLatex() : `${rho.toLatex()} \\cdot ${prodTex(sx, sy)} = ${cov.toLatex()}`;
          const twiceCov = `2\\left(${cov.toLatex()}\\right)`;
          return numberProblem({
            prompt: t(
              `$X$ has standard deviation $${sx}$, $Y$ has standard deviation $${sy}$ and their correlation is $\\rho = ${rho.toLatex()}$. Find $\\operatorname{Var}(X + Y)$.`,
              `$X$ 的标准差为 $${sx}$，$Y$ 的标准差为 $${sy}$，两者的相关系数为 $\\rho = ${rho.toLatex()}$。求 $\\operatorname{Var}(X + Y)$。`,
            ),
            answer: ans,
            mistakes: distinct(ans, [
              why(base.add(cov), "That counts the covariance once instead of twice.", "那是只计入一次协方差，而不是两次。"),
              why(base, "That leaves out the covariance term, as if $\\rho = 0$.", "那是漏掉了协方差项，好像 $\\rho = 0$。"),
              why(
                Q.of(sx + sy).add(rho.mul(Q.of(2 * sx * sy))),
                "That adds the standard deviations instead of the variances.",
                "那是把标准差相加，而不是方差。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Turn the correlation into a covariance", "把相关系数化为协方差"],
                  t(
                    `$\\operatorname{Cov}(X, Y) = \\rho\\,\\sigma_X\\sigma_Y = ${covSteps}$.`,
                    `$\\operatorname{Cov}(X, Y) = \\rho\\,\\sigma_X\\sigma_Y = ${covSteps}$。`,
                  ),
                ],
                [
                  ["Add the terms", "各项相加"],
                  t(
                    `$\\operatorname{Var}(X + Y) = ${sx * sx} + ${sy * sy} + ${twiceCov} = ${ans.toLatex()}$.`,
                    `$\\operatorname{Var}(X + Y) = ${sx * sx} + ${sy * sy} + ${twiceCov} = ${ans.toLatex()}$。`,
                  ),
                ],
              ],
              t(
                `The answer lies between $(${sx} - ${sy})^{2} = ${(sx - sy) ** 2}$ and $(${sx} + ${sy})^{2} = ${(sx + sy) ** 2}$, the values at $\\rho = -1$ and $\\rho = 1$.`,
                `答案在 $(${sx} - ${sy})^{2} = ${(sx - sy) ** 2}$ 与 $(${sx} + ${sy})^{2} = ${(sx + sy) ** 2}$ 之间，即 $\\rho = -1$ 与 $\\rho = 1$ 时的值。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 5.21.5 The Sample Covariance Matrix
  {
    id: "the-sample-covariance-matrix",
    title: t("The Sample Covariance Matrix", "样本协方差矩阵"),
    summary: t(
      "The sample covariance matrix $S = \\frac{1}{n - 1}\\sum_{i=1}^{n} (\\mathbf{x}_i - \\bar{\\mathbf{x}})(\\mathbf{x}_i - \\bar{\\mathbf{x}})^T$ is an unbiased estimator of $\\Sigma$.",
      "样本协方差矩阵 $S = \\frac{1}{n - 1}\\sum_{i=1}^{n} (\\mathbf{x}_i - \\bar{\\mathbf{x}})(\\mathbf{x}_i - \\bar{\\mathbf{x}})^T$ 是 $\\Sigma$ 的无偏估计。",
    ),
    intro: t(
      "Five students' study hours and scores have deviations from their means whose products add to $120$. The sample covariance is $\\frac{120}{5 - 1} = 30$, the off-diagonal entry of the sample covariance matrix.\n\nCheck: dividing by $5$ would give $24$, which on average underestimates the true covariance.\n\nIn this lesson we use the divisor $n - 1$, compute the off-diagonal entry of a sample covariance matrix, and find the variance of a combination from a covariance matrix.",
      "五名学生的学习时数与分数相对各自均值的偏差之积加起来为 $120$。样本协方差为 $\\frac{120}{5 - 1} = 30$，即样本协方差矩阵的非对角元。\n\n检验：若除以 $5$ 会得到 $24$，平均而言会低估真实的协方差。\n\n本课我们使用除数 $n - 1$，计算样本协方差矩阵的非对角元，并由协方差矩阵求组合的方差。",
    ),
    prerequisites: ["the-covariance-matrix"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "sample-covariance-divisor",
        title: t("Understanding the Bessel correction divisor n - 1 for sample covariance", "理解样本协方差的贝塞尔校正除数 n - 1"),
        explanation: t(
          "As with the sample variance, using the sample means uses up one degree of freedom, so dividing by one less than the sample size removes the bias. Unbiased sample covariance divides by the degrees of freedom $n - 1$, not $n$. For a sample of $n = 200$ the divisor is $199$.\n\n> **Watch out.** Only one degree of freedom is lost, for the estimated mean, so the divisor is neither $n$ nor $n - 2$.",
          "与样本方差一样，使用样本均值会用掉一个自由度，所以除以样本量减 $1$ 可以消除偏差。为保证无偏性，样本协方差除以自由度 $n - 1$，而非样本容量 $n$。若样本量 $n = 200$，除数为 $199$。\n\n> **注意。** 估计均值只失去一个自由度，所以除数既不是 $n$，也不是 $n - 2$。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(5, 50);

          const opts = [
            t(`$n - 1 = ${n - 1}$`, `$n - 1 = ${n - 1}$`),
            t(`$n = ${n}$`, `$n = ${n}$`),
            t(`$n + 1 = ${n + 1}$`, `$n + 1 = ${n + 1}$`),
            t(`$n - 2 = ${n - 2}$`, `$n - 2 = ${n - 2}$`),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);
          return reasoned(
            choiceProblem({
              prompt: t(
                `When calculating the unbiased sample covariance matrix $S$ from a multivariate sample of size $n = ${n}$, what divisor is used in the formula $S = \\frac{1}{d} \\sum_{i=1}^{n} (\\mathbf{x}_i - \\bar{\\mathbf{x}})(\\mathbf{x}_i - \\bar{\\mathbf{x}})^T$?`,
                `当根据样本容量为 $n = ${n}$ 的多元样本计算无偏样本协方差矩阵 $S$ 时，公式 $S = \\frac{1}{d} \\sum_{i=1}^{n} (\\mathbf{x}_i - \\bar{\\mathbf{x}})(\\mathbf{x}_i - \\bar{\\mathbf{x}})^T$ 中的除数 $d$ 是什么？`,
              ),
              options,
              correct,
              solution: walked(
                [
                  [
                    ["Count the lost degree of freedom", "计算失去的自由度"],
                    t(
                      "The deviations are taken from the sample mean, which is estimated from the same data, so one degree of freedom is used up.",
                      "偏差是相对样本均值计算的，而样本均值由同一组数据估计，所以用掉一个自由度。",
                    ),
                  ],
                  [["Find the divisor", "求出除数"], t(`$d = n - 1 = ${n} - 1 = ${n - 1}$.`, `$d = n - 1 = ${n} - 1 = ${n - 1}$。`)],
                ],
                t(
                  `The divisor $${n - 1}$ is one less than the sample size $${n}$, as for the sample variance.`,
                  `除数 $${n - 1}$ 比样本量 $${n}$ 少 $1$，与样本方差相同。`,
                ),
              ),
            }),
            [
              [
                opts[1]!.en,
                "Dividing by $n$ gives a biased estimate, because the means are estimated from the same sample.",
                "除以 $n$ 得到的是有偏估计，因为均值是用同一样本估计的。",
              ],
              [
                opts[2]!.en,
                "This divisor makes the estimate smaller still, and nothing in the derivation adds a degree of freedom.",
                "这个除数让估计更小，而推导中没有任何增加自由度的步骤。",
              ],
              [opts[3]!.en, "One degree of freedom is lost for the estimated mean, not two.", "因估计均值只失去一个自由度，不是两个。"],
            ],
          );
        },
      },
      {
        id: "the-off-diagonal-entry-of-a-sample-covariance-matrix",
        title: t("The off-diagonal entry of a sample covariance matrix", "样本协方差矩阵的非对角元"),
        explanation: t(
          "The off-diagonal entry of the sample covariance matrix is the sample covariance\n\n$$s_{xy} = \\frac{1}{n - 1}\\sum_{i=1}^{n}(x_i - \\bar{x})(y_i - \\bar{y}).$$\n\nSubtract the means, multiply the deviations pair by pair, add, and divide by $n - 1$ (not $n$), as for the sample variances on the diagonal. For the points $(10, 50), (20, 70), (30, 60)$, the means are $20$ and $60$, the deviation products add to $100 + 0 + 0 = 100$, and $s_{xy} = \\frac{100}{2} = 50$.\n\n> **Watch out.** Divide the sum of products by $n - 1$; stopping at the sum, or dividing by $n$, gives the wrong entry.",
          "样本协方差矩阵的非对角元是样本协方差\n\n$$s_{xy} = \\frac{1}{n - 1}\\sum_{i=1}^{n}(x_i - \\bar{x})(y_i - \\bar{y}).$$\n\n减去均值，逐对相乘偏差，相加，再除以 $n - 1$（不是 $n$），与对角线上的样本方差一样。对点 $(10, 50), (20, 70), (30, 60)$，均值为 $20$ 与 $60$，偏差乘积之和为 $100 + 0 + 0 = 100$，所以 $s_{xy} = \\frac{100}{2} = 50$。\n\n> **注意。** 乘积之和要除以 $n - 1$；停在和上或除以 $n$ 都会得到错误的元素。",
        ),
        generate: (rng: Rng): Problem => {
          const n = 4;
          const mx = rng.int(1, 9);
          const my = rng.int(1, 9);
          const dx = rng.shuffle([-3, -1, 1, 3]);
          const dy = [rng.int(-4, 4), rng.int(-4, 4), rng.int(-4, 4)];
          dy.push(-(dy[0] ?? 0) - (dy[1] ?? 0) - (dy[2] ?? 0));
          const xs = dx.map((v) => mx + v);
          const ys = dy.map((v) => my + v);
          const sp = dx.reduce((s, v, i) => s + v * (dy[i] ?? 0), 0);
          const ans = Q.of(sp, n - 1);
          const pts = xs.map((x, i) => `(${x}, ${ys[i]})`).join(", ");
          const products = dx.map((v, i) => `(${v})(${dy[i] ?? 0})`).join(" + ");
          return numberProblem({
            prompt: t(
              `Find the sample covariance $s_{xy}$, the off-diagonal entry of the sample covariance matrix, for the data $${pts}$.`,
              `求数据 $${pts}$ 的样本协方差 $s_{xy}$，即样本协方差矩阵的非对角元。`,
            ),
            answer: ans,
            mistakes: distinct(ans, [
              why(Q.of(sp, n), "That divides by $n$ instead of $n - 1$.", "那是除以 $n$，而不是 $n - 1$。"),
              why(Q.of(sp), "That stops at the sum of products and does not divide.", "那是停在乘积之和上，没有相除。"),
              why(Q.of(sp + 1, n - 1), "That is off by one in the sum of the deviation products.", "那是偏差乘积之和算错了 $1$。"),
            ]),
            solution: walked(
              [
                [
                  ["Find the means and deviations", "求均值与偏差"],
                  t(
                    `$\\bar{x} = ${mx}$ and $\\bar{y} = ${my}$; the deviation products add to $${products} = ${sp}$.`,
                    `$\\bar{x} = ${mx}$，$\\bar{y} = ${my}$；偏差乘积之和为 $${products} = ${sp}$。`,
                  ),
                ],
                [
                  ["Divide by $n - 1$", "除以 $n - 1$"],
                  t(
                    `$s_{xy} = \\frac{${sp}}{${n - 1}}${lowestTerms(sp, n - 1)}$.`,
                    `$s_{xy} = \\frac{${sp}}{${n - 1}}${lowestTerms(sp, n - 1)}$。`,
                  ),
                ],
              ],
              t(
                `The $x$ deviations $${dx.join(", ")}$ and the $y$ deviations each add to $0$, as deviations from a mean must.`,
                `$x$ 的偏差 $${dx.join(", ")}$ 与 $y$ 的偏差之和都为 $0$，相对均值的偏差理应如此。`,
              ),
            ),
          });
        },
      },
    ],
  },
];
