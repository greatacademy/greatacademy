import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, Q } from "@ga/subject-math";
import { choiceProblem, isTerminating, lowestTerms, numberProblem, yesNo } from "../problems.ts";

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
    prerequisites: ["joint-distributions-for-discrete-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-joint-discrete-cdf",
        title: t("Evaluating the joint CDF from a probability mass table", "根据概率质量表计算联合累积分布函数值"),
        explanation: t(
          "The joint cumulative distribution function at a point is the total probability of the lower left corner of the table, where both variables are at most the given values. Sum $p(u, v)$ for all pairs $(u, v)$ with $u \\le x$ and $v \\le y$.",
          "联合累积分布函数在一点的值是表格左下角部分的总概率，即两个变量都不超过给定值的部分。将所有满足 $u \\le x$ 且 $v \\le y$ 的点 $(u, v)$ 处的联合概率 $p(u, v)$ 求和。",
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
            wrong: [Q.of(b, total), Q.of(a, total), Q.of(a + c, total)],
            solution: t(
              `By definition, $F_{X,Y}(0, 1) = P(X \\le 0, Y \\le 1) = P(0, 0) + P(0, 1) = \\frac{${a}}{${total}} + \\frac{${b}}{${total}} = \\frac{${sumVal}}{${total}}${lowestTerms(sumVal, total)}$.`,
              `根据定义，$F_{X,Y}(0, 1) = P(X \\le 0, Y \\le 1) = P(0, 0) + P(0, 1) = \\frac{${a}}{${total}} + \\frac{${b}}{${total}} = \\frac{${sumVal}}{${total}}${lowestTerms(sumVal, total)}$。`,
            ),
          });
        },
      },
      {
        id: "probabilities-of-regions-from-a-joint-table",
        title: t("Probabilities of regions from a joint table", "由联合分布表求区域概率"),
        explanation: t(
          "Any event about $(X, Y)$ is a set of cells in the joint table, and its probability is the sum of those cells. For $P(X + Y \\le c)$, mark every cell with $x + y \\le c$; for $P(X < Y)$, the cells above the diagonal.\n\nThe joint CDF is the special case of a lower-left rectangle, $F(x, y) = P(X \\le x, Y \\le y)$. Other regions, such as $X + Y \\le 2$, are not rectangles, so they cannot be read from a single CDF value.",
          "关于 $(X, Y)$ 的任一事件都是联合分布表中的若干格，其概率等于这些格的概率之和。求 $P(X + Y \\le c)$ 时，标出所有 $x + y \\le c$ 的格；求 $P(X < Y)$ 时，取对角线上方的格。\n\n联合分布函数是左下矩形这一特殊情形：$F(x, y) = P(X \\le x, Y \\le y)$。其他区域如 $X + Y \\le 2$ 不是矩形，不能由单个分布函数值读出。",
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
            wrong: [Q.of(miss, total), Q.of(rect, total), Q.of(hit, 9)].filter((x) => !x.eq(ans)),
            solution: t(
              `Add the cells with $${ev}$: their weights sum to $${hit}$ out of $${total}$, so $P(${ev}) = \\frac{${hit}}{${total}}${lowestTerms(hit, total)}$.`,
              `把满足 $${ev}$ 的格相加：权重和为 $${hit}$（总数 $${total}$），所以 $P(${ev}) = \\frac{${hit}}{${total}}${lowestTerms(hit, total)}$。`,
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
    prerequisites: ["joint-distributions-for-discrete-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "calculating-discrete-marginal-pmf",
        title: t("Summing rows to compute marginal probabilities", "通过行或列求和计算边际概率"),
        explanation: t(
          "To get the distribution of one variable alone, add across the table over all values of the other variable. The marginal pmf $p_X(x) = \\sum_y p(x, y)$ sums the joint probabilities over all $y$.",
          "要得到单个变量的分布，就在表格中把另一个变量所有取值对应的概率加起来。边际分布律 $p_X(x) = \\sum_y p(x, y)$ 是对所有 $y$ 的联合概率求和。",
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
            wrong: [Q.of(p1, total), Q.of(margX, 3 * total), Q.of(other, total)],
            solution: t(
              `The marginal probability is $P(X = ${xVal}) = \\sum_{y} P(${xVal}, y) = \\frac{${p1}}{${total}} + \\frac{${p2}}{${total}} + \\frac{${p3}}{${total}} = \\frac{${margX}}{${total}}${lowestTerms(margX, total)}$.`,
              `边际概率为 $P(X = ${xVal}) = \\sum_{y} P(${xVal}, y) = \\frac{${p1}}{${total}} + \\frac{${p2}}{${total}} + \\frac{${p3}}{${total}} = \\frac{${margX}}{${total}}${lowestTerms(margX, total)}$。`,
            ),
          });
        },
      },
      {
        id: "a-marginal-from-a-two-way-table",
        title: t("A marginal from a two-way table", "由二维表求边缘分布"),
        explanation: t(
          "In a joint table with $X$ along the rows and $Y$ along the columns, the marginal of $X$ is the row totals and the marginal of $Y$ is the column totals:\n\n$$p_Y(y) = \\sum_x p(x, y).$$\n\nThe totals are written in the margins of the table, which is where the name comes from. Each marginal sums to $1$, a quick check on the arithmetic.",
          "在行表示 $X$、列表示 $Y$ 的联合分布表中，$X$ 的边缘分布是各行之和，$Y$ 的边缘分布是各列之和：\n\n$$p_Y(y) = \\sum_x p(x, y).$$\n\n这些和写在表的边缘上，“边缘分布”因此得名。每个边缘分布之和都为 $1$，可以用来检查计算。",
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
            wrong: [Q.of(w[0]?.[col] ?? 0, total), Q.of(row0, total), Q.of(colSum, total * 2)].filter((x) => !x.eq(ans)),
            solution: t(
              `$P(Y = ${col + 1}) = P(0, ${col + 1}) + P(1, ${col + 1}) = \\frac{${w[0]?.[col]} + ${w[1]?.[col]}}{${total}} = \\frac{${colSum}}{${total}}${lowestTerms(colSum, total)}$.`,
              `$P(Y = ${col + 1}) = P(0, ${col + 1}) + P(1, ${col + 1}) = \\frac{${w[0]?.[col]} + ${w[1]?.[col]}}{${total}} = \\frac{${colSum}}{${total}}${lowestTerms(colSum, total)}$。`,
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
    prerequisites: ["marginal-distributions-for-discrete-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "discrete-independence-product-rule",
        title: t("Checking independence via joint and marginal products", "通过联合与边际概率乘积验证独立性"),
        explanation: t(
          "Two variables are independent only if every entry of the joint table equals the product of its row total and column total; one failure is enough to show dependence. Under independence, P(X = x, Y = y) = P(X = x) P(Y = y).",
          "只有当联合表中每个元素都等于其行和与列和的乘积时，两个变量才相互独立；只要有一处不符，就说明它们不独立。在独立性下，P(X = x, Y = y) = P(X = x) P(Y = y)。",
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
            wrong: [Q.of(numA + numB, denA + denB), Q.of(numA * denB + numB * denA, jointDen), Q.of(numA, denA)],
            solution: t(
              `Since $X$ and $Y$ are independent, $P(X = 2, Y = 3) = P(X = 2) \\cdot P(Y = 3) = \\frac{${numA}}{${denA}} \\times \\frac{${numB}}{${denB}} = \\frac{${jointNum}}{${jointDen}}${lowestTerms(jointNum, jointDen)}$.`,
              `由于 $X$ 与 $Y$ 相互独立，$P(X = 2, Y = 3) = P(X = 2) \\cdot P(Y = 3) = \\frac{${numA}}{${denA}} \\times \\frac{${numB}}{${denB}} = \\frac{${jointNum}}{${jointDen}}${lowestTerms(jointNum, jointDen)}$。`,
            ),
          });
        },
      },
      {
        id: "checking-independence-in-a-table",
        title: t("Checking independence in a table", "在表中检验独立性"),
        explanation: t(
          "To check independence, compute both marginals and test **every** cell: $p(x, y) = p_X(x)p_Y(y)$. One failing cell is enough to show dependence. For a $2 \\times 2$ table it suffices to check one cell, because the margins then force the others.\n\nA table whose rows are proportional, such as $\\frac{1}{10}, \\frac{2}{10}$ over $\\frac{3}{10}, \\frac{6}{10}$, describes independent variables: knowing $X$ does not change the relative chances of the values of $Y$.",
          "检验独立性时，先求出两个边缘分布，再检验**每一格**是否满足 $p(x, y) = p_X(x)p_Y(y)$。只要有一格不满足就说明不独立。对 $2 \\times 2$ 表只需检验一格，因为边缘分布确定后其余各格随之确定。\n\n若表的各行成比例，例如 $\\frac{1}{10}, \\frac{2}{10}$ 与 $\\frac{3}{10}, \\frac{6}{10}$，则变量独立：知道 $X$ 不会改变 $Y$ 各取值的相对机会。",
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
          return choiceProblem({
            prompt: t(
              `$X, Y \\in \\{0, 1\\}$ have joint probabilities $P(0, 0) = \\frac{${p00}}{${total}}$, $P(0, 1) = \\frac{${p01}}{${total}}$, $P(1, 0) = \\frac{${p10}}{${total}}$, $P(1, 1) = \\frac{${p11}}{${total}}$. Are $X$ and $Y$ independent?`,
              `$X, Y \\in \\{0, 1\\}$ 的联合概率为 $P(0, 0) = \\frac{${p00}}{${total}}$，$P(0, 1) = \\frac{${p01}}{${total}}$，$P(1, 0) = \\frac{${p10}}{${total}}$，$P(1, 1) = \\frac{${p11}}{${total}}$。$X$ 与 $Y$ 是否独立？`,
            ),
            options: yesNo,
            correct: isIndep ? 0 : 1,
            solution: t(
              `$P(X = 0) = \\frac{${r0}}{${total}}$ and $P(Y = 0) = \\frac{${c0}}{${total}}$, whose product is $${Q.of(r0 * c0, total * total).toLatex()}$, while $P(0, 0) = ${Q.of(p00, total).toLatex()}$. ${isIndep ? "They agree (and in a $2 \\times 2$ table one cell decides), so $X$ and $Y$ are independent." : "They differ, so $X$ and $Y$ are not independent."}`,
              `$P(X = 0) = \\frac{${r0}}{${total}}$，$P(Y = 0) = \\frac{${c0}}{${total}}$，乘积为 $${Q.of(r0 * c0, total * total).toLatex()}$，而 $P(0, 0) = ${Q.of(p00, total).toLatex()}$。${isIndep ? "两者相等（$2 \\times 2$ 表中一格即可判定），所以 $X$ 与 $Y$ 独立。" : "两者不等，所以 $X$ 与 $Y$ 不独立。"}`,
            ),
          });
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
    prerequisites: ["marginal-distributions-for-discrete-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-discrete-conditional-pmf",
        title: t("Computing conditional PMF values", "计算条件概率分布律取值"),
        explanation: t(
          "A conditional probability restricts attention to one row or column of the table and rescales it by dividing by that row or column total. P(Y = y | X = x) = P(X = x, Y = y) / P(X = x).",
          "条件概率只关注表格中的一行或一列，并除以这一行或这一列的总和来重新缩放。P(Y = y | X = x) = P(X = x, Y = y) / P(X = x)。",
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
            wrong: [Q.of(jointVal, denom), Q.of(margVal, jointVal), Q.of(jointVal * margVal, denom * denom)],
            solution: t(
              `The conditional probability is $P(Y = 2 \\mid X = 1) = \\frac{P(X = 1, Y = 2)}{P(X = 1)} = \\frac{${jointVal}/${denom}}{${margVal}/${denom}} = \\frac{${jointVal}}{${margVal}}${lowestTerms(jointVal, margVal)}$.`,
              `条件概率为 $P(Y = 2 \\mid X = 1) = \\frac{P(X = 1, Y = 2)}{P(X = 1)} = \\frac{${jointVal}/${denom}}{${margVal}/${denom}} = \\frac{${jointVal}}{${margVal}}${lowestTerms(jointVal, margVal)}$。`,
            ),
          });
        },
      },
      {
        id: "conditional-probabilities-from-a-table",
        title: t("Conditional probabilities from a table", "由联合分布表求条件概率"),
        explanation: t(
          "Conditioning on $X = x$ keeps only that row of the table and rescales it to sum to $1$:\n\n$$P(Y = y \\mid X = x) = \\frac{p(x, y)}{\\sum_{y'} p(x, y')}.$$\n\nWith weights, the common denominator of the table cancels: if the row for $X = 1$ has weights $2, 5, 3$, then $P(Y = 2 \\mid X = 1) = \\frac{5}{10}$, whatever the table's total.",
          "以 $X = x$ 为条件，只保留表中这一行，并重新缩放使其和为 $1$：\n\n$$P(Y = y \\mid X = x) = \\frac{p(x, y)}{\\sum_{y'} p(x, y')}.$$\n\n用权重表示时，表的公分母会约去：若 $X = 1$ 那一行的权重为 $2, 5, 3$，则无论表的总和是多少，$P(Y = 2 \\mid X = 1) = \\frac{5}{10}$。",
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
            wrong: [Q.of(cell, total), Q.of(cell, col), Q.of(row, total)].filter((v) => !v.eq(ans)),
            solution: t(
              `The row $X = ${x}$ has weights $${(w[x] ?? []).join(", ")}$ summing to $${row}$, so $P(Y = ${j + 1} \\mid X = ${x}) = \\frac{${cell}}{${row}}${lowestTerms(cell, row)}$.`,
              `$X = ${x}$ 这一行的权重为 $${(w[x] ?? []).join(", ")}$，和为 $${row}$，所以 $P(Y = ${j + 1} \\mid X = ${x}) = \\frac{${cell}}{${row}}${lowestTerms(cell, row)}$。`,
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
    prerequisites: ["the-binomial-distribution", "joint-distributions-for-discrete-random-variables"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "trinomial-coefficient-evaluation",
        title: t("Computing the trinomial coefficient n! / (x! y! z!)", "计算三项式系数 n! / (x! y! z!)"),
        explanation: t(
          "Arrange all the items in order, then divide by the orderings within each group, since items in the same group are not distinguished. The number of ways to divide n items into groups of sizes x, y, z is n! / (x! y! z!).",
          "先把所有物品排成一列，再除以每组内部的排列数，因为同一组中的物品不加区分。将 n 个不同物品分成大小为 x, y, z 的三组的方法数为多项式系数 n! / (x! y! z!)。",
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
            wrong: [fact(n), fact(n) / fact(x), x * y * z],
            solution: t(
              `$\\frac{${n}!}{${x}! \\, ${y}! \\, ${z}!} = \\frac{${fact(n)}}{${fact(x)} \\times ${fact(y)} \\times ${fact(z)}} = ${coeff}$.`,
              `$\\frac{${n}!}{${x}! \\, ${y}! \\, ${z}!} = \\frac{${fact(n)}}{${fact(x)} \\times ${fact(y)} \\times ${fact(z)}} = ${coeff}$。`,
            ),
          });
        },
      },
      {
        id: "a-trinomial-probability",
        title: t("A trinomial probability", "三项分布的概率"),
        explanation: t(
          "Multiply the number of arrangements by the probability of any one arrangement:\n\n$$P(X = x, Y = y) = \\frac{n!}{x!\\,y!\\,z!}p_1^{x}p_2^{y}p_3^{z}, \\qquad z = n - x - y.$$\n\nFor a match that a team wins, draws or loses with probabilities $\\frac{1}{2}, \\frac{1}{3}, \\frac{1}{6}$, the chance of $2$ wins, $1$ draw and $1$ loss in $4$ matches is $\\frac{4!}{2!\\,1!\\,1!} \\cdot \\frac{1}{4} \\cdot \\frac{1}{3} \\cdot \\frac{1}{6} = \\frac{12}{72} = \\frac{1}{6}$.",
          "用排列数乘以任一种排列的概率：\n\n$$P(X = x, Y = y) = \\frac{n!}{x!\\,y!\\,z!}p_1^{x}p_2^{y}p_3^{z}, \\qquad z = n - x - y.$$\n\n例如某队每场胜、平、负的概率为 $\\frac{1}{2}, \\frac{1}{3}, \\frac{1}{6}$，$4$ 场中恰好 $2$ 胜 $1$ 平 $1$ 负的概率为 $\\frac{4!}{2!\\,1!\\,1!} \\cdot \\frac{1}{4} \\cdot \\frac{1}{3} \\cdot \\frac{1}{6} = \\frac{12}{72} = \\frac{1}{6}$。",
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
          return numberProblem({
            prompt: t(
              `Each of $${n}$ independent trials ends in outcome A, B or C with probabilities $${p1.toLatex()}$, $${p2.toLatex()}$, $${p3.toLatex()}$. Find the probability of exactly $${x}$ A's, $${y}$ B's and $${z}$ C's.`,
              `$${n}$ 次独立试验，每次结果为 A、B、C 的概率分别为 $${p1.toLatex()}$，$${p2.toLatex()}$，$${p3.toLatex()}$。求恰好 $${x}$ 次 A、$${y}$ 次 B、$${z}$ 次 C 的概率。`,
            ),
            answer: ans,
            wrong: [prod, Q.of(coef), ans.mul(Q.of(2))].filter((v) => !v.eq(ans)),
            solution: t(
              `$\\frac{${n}!}{${x}!\\,${y}!\\,${z}!} = ${coef}$ and $p_1^{${x}}p_2^{${y}}p_3^{${z}} = ${prod.toLatex()}$, so the probability is $${coef} \\cdot ${prod.toLatex()} = ${ans.toLatex()}$.`,
              `$\\frac{${n}!}{${x}!\\,${y}!\\,${z}!} = ${coef}$，$p_1^{${x}}p_2^{${y}}p_3^{${z}} = ${prod.toLatex()}$，所以概率为 $${coef} \\cdot ${prod.toLatex()} = ${ans.toLatex()}$。`,
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
    prerequisites: ["the-trinomial-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "multinomial-marginal-binomial",
        title: t("Recognizing that each marginal of a multinomial distribution is binomial", "多项分布的每个边际分布均为二项分布"),
        explanation: t(
          "Focusing on one category and lumping all others together as failure turns each trial into a success or failure, so each count is binomial. For $(X_1, \\dots, X_k) \\sim \\text{Multinomial}(n, p_1, \\dots, p_k)$, each component $X_i$ follows $\\text{Binomial}(n, p_i)$.",
          "只关注一个类别，把其他类别都归为失败，每次试验就变成成功或失败，所以每个计数都服从二项分布。若 $(X_1, \\dots, X_k) \\sim \\text{Multinomial}(n, p_1, \\dots, p_k)$，则每个分量 $X_i$ 均服从二项分布 $\\text{Binomial}(n, p_i)$。",
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

          return choiceProblem({
            prompt: t(
              `In a multinomial experiment with $n = ${n}$ trials and $k = 4$ categories with probabilities $p_1 = \\frac{${pFrac.num}}{${pFrac.den}}$, $p_2, p_3, p_4$, what is the exact marginal distribution of the count $X_1$?`,
              `在进行具有 $n = ${n}$ 次试验与 $4$ 个类别的多项试验中，第一类的发生概率为 $p_1 = \\frac{${pFrac.num}}{${pFrac.den}}$。计数随机变量 $X_1$ 的精确边际分布是什么？`,
            ),
            options,
            correct,
            solution: t(
              `By collapsing the other categories into 'not category 1', the number of outcomes of type 1 across $n$ independent trials is binomial: $X_1 \\sim \\text{Binomial}\\left(${n}, \\frac{${pFrac.num}}{${pFrac.den}}\\right)$.`,
              `将其他类别统归为“非类别 1”，则在 $n$ 次独立试验中该类别的发生次数服从二项分布：$X_1 \\sim \\text{Binomial}\\left(${n}, \\frac{${pFrac.num}}{${pFrac.den}}\\right)$。`,
            ),
          });
        },
      },
      {
        id: "the-covariance-of-two-multinomial-counts",
        title: t("The covariance of two multinomial counts", "多项分布两个计数的协方差"),
        explanation: t(
          "The counts of a multinomial distribution compete for the same $n$ trials, so they are negatively related: a trial that lands in category $i$ cannot land in $j$. For $i \\neq j$,\n\n$$\\operatorname{Cov}(X_i, X_j) = -np_ip_j, \\qquad \\operatorname{Var}(X_i) = np_i(1 - p_i).$$\n\nFor a fair die rolled $60$ times, the numbers of ones and twos have covariance $-60 \\cdot \\frac{1}{6} \\cdot \\frac{1}{6} = -\\frac{5}{3}$.",
          "多项分布的各计数争夺同样的 $n$ 次试验，因此负相关：落入第 $i$ 类的试验不能再落入第 $j$ 类。对 $i \\neq j$，\n\n$$\\operatorname{Cov}(X_i, X_j) = -np_ip_j, \\qquad \\operatorname{Var}(X_i) = np_i(1 - p_i).$$\n\n例如掷均匀骰子 $60$ 次，一点与二点的次数的协方差为 $-60 \\cdot \\frac{1}{6} \\cdot \\frac{1}{6} = -\\frac{5}{3}$。",
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
              `$(X_1, X_2, X_3, X_4)$ is multinomial with $n = ${n}$ and probabilities $${ps.map((p) => p.toLatex()).join(", ")}$. Find $\\operatorname{Cov}(X_${i + 1}, X_${j + 1})$.`,
              `$(X_1, X_2, X_3, X_4)$ 服从 $n = ${n}$、概率为 $${ps.map((p) => p.toLatex()).join(", ")}$ 的多项分布。求 $\\operatorname{Cov}(X_${i + 1}, X_${j + 1})$。`,
            ),
            answer: ans,
            wrong: [ans.neg(), Q.zero, Q.of(-n).mul(pi).mul(Q.one.sub(pj))].filter((v) => !v.eq(ans)),
            solution: t(
              `$\\operatorname{Cov}(X_${i + 1}, X_${j + 1}) = -np_${i + 1}p_${j + 1} = -${n} \\cdot ${pi.toLatex()} \\cdot ${pj.toLatex()} = ${ans.toLatex()}$.`,
              `$\\operatorname{Cov}(X_${i + 1}, X_${j + 1}) = -np_${i + 1}p_${j + 1} = -${n} \\cdot ${pi.toLatex()} \\cdot ${pj.toLatex()} = ${ans.toLatex()}$。`,
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
    prerequisites: ["joint-distributions-for-continuous-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "integrating-marginal-density-constant",
        title: t("Evaluating marginal density coefficients", "计算边际密度函数的系数"),
        explanation: t(
          "Integrating the joint density over the other variable leaves a function of one variable, which is the marginal density. For $f(x, y) = c(x + y)$ on $[0, 1] \\times [0, 1]$, $f_X(x) = c\\left(x + \\frac{1}{2}\\right)$.",
          "把联合密度对另一个变量积分，剩下一个单变量函数，这就是边缘密度。对于 $[0, 1] \\times [0, 1]$ 上的 $f(x, y) = c(x + y)$，边际密度为 $f_X(x) = c\\left(x + \\frac{1}{2}\\right)$。",
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
            wrong: [Q.of(4, a * a * b * b), Q.of(2, b * b), Q.of(4, a * a)],
            solution: t(
              `Integrate out $y$: $f_X(x) = \\int_0^{${b}} \\frac{4}{${a * a * b * b}} x y \\, dy = \\frac{4 x}{${a * a * b * b}} \\left[\\frac{y^2}{2}\\right]_0^{${b}} = \\frac{4 x}{${a * a * b * b}} \\cdot \\frac{${b * b}}{2} = \\frac{2}{${a * a}} x$. Thus $k = \\frac{2}{${den}}${lowestTerms(2, den)}$.`,
              `对 $y$ 积分：$f_X(x) = \\int_0^{${b}} \\frac{4}{${a * a * b * b}} x y \\, dy = \\frac{4 x}{${a * a * b * b}} \\left[\\frac{y^2}{2}\\right]_0^{${b}} = \\frac{2}{${a * a}} x$。因此 $k = \\frac{2}{${den}}${lowestTerms(2, den)}$。`,
            ),
          });
        },
      },
      {
        id: "marginal-densities-on-non-rectangular-regions",
        title: t("Marginal densities on non-rectangular regions", "非矩形区域上的边缘密度"),
        explanation: t(
          "When the support is not a rectangle, the limits of integration depend on the fixed variable. For $f(x, y) = 2$ on the triangle $0 \\le y \\le x \\le 1$:\n\n$$f_X(x) = \\int_0^{x} 2\\,dy = 2x, \\qquad f_Y(y) = \\int_y^{1} 2\\,dx = 2(1 - y).$$\n\nOn a rectangle the limits are constants: for $f(x, y) = x + y$ on the unit square, $f_X(x) = \\int_0^1 (x + y)\\,dy = x + \\frac{1}{2}$.",
          "当支撑集不是矩形时，积分限依赖于固定的那个变量。对三角形 $0 \\le y \\le x \\le 1$ 上的 $f(x, y) = 2$：\n\n$$f_X(x) = \\int_0^{x} 2\\,dy = 2x, \\qquad f_Y(y) = \\int_y^{1} 2\\,dx = 2(1 - y).$$\n\n在矩形上积分限是常数：对单位正方形上的 $f(x, y) = x + y$，$f_X(x) = \\int_0^1 (x + y)\\,dy = x + \\frac{1}{2}$。",
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
            wrong: wrong.filter((w) => !w.eq(ans)),
            solution: t(
              kind === 0
                ? `$f_X(x) = \\int_0^{x} 2\\,dy = 2x$, so $${target} = ${ans.toLatex()}$.`
                : kind === 1
                  ? `$f_Y(y) = \\int_y^{1} 2\\,dx = 2(1 - y)$, so $${target} = ${ans.toLatex()}$.`
                  : `$f_X(x) = \\int_0^{1} (x + y)\\,dy = x + \\frac{1}{2}$, so $${target} = ${ans.toLatex()}$.`,
              kind === 0
                ? `$f_X(x) = \\int_0^{x} 2\\,dy = 2x$，所以 $${target} = ${ans.toLatex()}$。`
                : kind === 1
                  ? `$f_Y(y) = \\int_y^{1} 2\\,dx = 2(1 - y)$，所以 $${target} = ${ans.toLatex()}$。`
                  : `$f_X(x) = \\int_0^{1} (x + y)\\,dy = x + \\frac{1}{2}$，所以 $${target} = ${ans.toLatex()}$。`,
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
    prerequisites: ["marginal-distributions-for-continuous-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "continuous-independence-factorization",
        title: t("Testing independence by factorability of joint PDF", "根据联合密度的可乘积分解检验独立性"),
        explanation: t(
          "If the joint density splits into a function of one variable times a function of the other on a rectangle, the variables carry no information about each other. If $f(x, y) = g(x) h(y)$ on a product domain $[a, b] \\times [c, d]$, then $X$ and $Y$ are independent.",
          "如果在矩形区域上联合密度可以分解为一个变量的函数乘以另一个变量的函数，那么两个变量彼此不提供任何信息。若在笛卡尔积区间 $[a, b] \\times [c, d]$ 上 $f(x, y) = g(x) h(y)$，则 $X$ 与 $Y$ 相互独立。",
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
            t(`No, because independence requires $m = n$.`, `否，因为独立性要求幂次满足 $m = n$。`),
            t(`Cannot be determined without computing higher-order joint moments.`, `不计算更高阶联合矩则无法确定。`),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);

          return choiceProblem({
            prompt: t(
              `Let $X$ and $Y$ have joint probability density function $f(x, y) = ${(m + 1) * (n + 1)} x^{${m}} y^{${n}}$ for $0 \\le x \\le 1$ and $0 \\le y \\le 1$. Are $X$ and $Y$ independent?`,
              `设连续随机变量 $X$ 与 $Y$ 在 $0 \\le x \\le 1$ 且 $0 \\le y \\le 1$ 上的联合概率密度函数为 $f(x, y) = ${(m + 1) * (n + 1)} x^{${m}} y^{${n}}$。问 $X$ 与 $Y$ 是否相互独立？`,
            ),
            options,
            correct,
            solution: t(
              `The joint PDF factors as $f(x, y) = f_X(x) f_Y(y) = [(${m + 1}) x^{${m}}] \\cdot [(${n + 1}) y^{${n}}]$ on the rectangular support $[0, 1] \\times [0, 1]$. Therefore, $X$ and $Y$ are independent.`,
              `在矩形支撑集 $[0, 1] \\times [0, 1]$ 上，联合密度可以精确分解为 $f(x, y) = f_X(x) f_Y(y) = [(${m + 1}) x^{${m}}] \\cdot [(${n + 1}) y^{${n}}]$。因此 $X$ 与 $Y$ 相互独立。`,
            ),
          });
        },
      },
      {
        id: "joint-probabilities-under-independence",
        title: t("Joint probabilities under independence", "独立条件下的联合概率"),
        explanation: t(
          "When $X$ and $Y$ are independent, a probability about a rectangle splits into a product of one-dimensional probabilities:\n\n$$P(X \\le a, Y \\le b) = P(X \\le a)\\,P(Y \\le b) = F_X(a)F_Y(b).$$\n\nFor $f_X(x) = 2x$ and $f_Y(y) = 3y^{2}$ on $[0, 1]$, $F_X(a) = a^{2}$ and $F_Y(b) = b^{3}$, so $P(X \\le \\frac{1}{2}, Y \\le \\frac{1}{2}) = \\frac{1}{4} \\cdot \\frac{1}{8} = \\frac{1}{32}$. No double integral is needed.",
          "当 $X$ 与 $Y$ 独立时，关于矩形的概率可以分解为一维概率之积：\n\n$$P(X \\le a, Y \\le b) = P(X \\le a)\\,P(Y \\le b) = F_X(a)F_Y(b).$$\n\n例如在 $[0, 1]$ 上 $f_X(x) = 2x$，$f_Y(y) = 3y^{2}$，则 $F_X(a) = a^{2}$，$F_Y(b) = b^{3}$，所以 $P(X \\le \\frac{1}{2}, Y \\le \\frac{1}{2}) = \\frac{1}{4} \\cdot \\frac{1}{8} = \\frac{1}{32}$。不需要二重积分。",
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
            wrong: [a.pow(m).mul(b.pow(k)), a.mul(b), a.pow(m + 1).add(b.pow(k + 1))].filter((v) => !v.eq(ans)),
            solution: t(
              `$F_X(a) = a^{${m + 1}}$ and $F_Y(b) = b^{${k + 1}}$, so the probability is $\\left(${a.toLatex()}\\right)^{${m + 1}}\\left(${b.toLatex()}\\right)^{${k + 1}} = ${ans.toLatex()}$.`,
              `$F_X(a) = a^{${m + 1}}$，$F_Y(b) = b^{${k + 1}}$，所以概率为 $\\left(${a.toLatex()}\\right)^{${m + 1}}\\left(${b.toLatex()}\\right)^{${k + 1}} = ${ans.toLatex()}$。`,
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
    prerequisites: ["marginal-distributions-for-continuous-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-conditional-density",
        title: t("Evaluating the conditional density at a given value", "计算给定条件下的条件概率密度值"),
        explanation: t(
          "A conditional density is a slice of the joint density at a fixed value of one variable, rescaled by the marginal so that it integrates to one. The conditional density is $f_{Y \\mid X}(y \\mid x) = \\frac{f(x, y)}{f_X(x)}$.",
          "条件密度是在一个变量取固定值时联合密度的一个切片，再用边缘密度重新缩放，使它的积分为 1。条件密度为 $f_{Y \\mid X}(y \\mid x) = \\frac{f(x, y)}{f_X(x)}$。",
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
            wrong: [Q.of(numX, denX), Q.of(2 * denX, numX), 2],
            solution: t(
              `The marginal density of $X$ is $f_X(x) = \\int_0^x 2 \\, dy = 2x$. Thus the conditional density is $f_{Y \\mid X}(y \\mid x) = \\frac{f(x, y)}{f_X(x)} = \\frac{2}{2x} = \\frac{1}{x}$. Evaluating at $x = \\frac{${numX}}{${denX}}$ gives $\\frac{1}{${numX}/${denX}} = \\frac{${denX}}{${numX}}${lowestTerms(denX, numX)}$.`,
              `$X$ 的边际密度为 $f_X(x) = \\int_0^x 2 \\, dy = 2x$。因此条件密度为 $f_{Y \\mid X}(y \\mid x) = \\frac{f(x, y)}{f_X(x)} = \\frac{2}{2x} = \\frac{1}{x}$。在 $x = \\frac{${numX}}{${denX}}$ 处求值得到 $\\frac{1}{${numX}/${denX}} = \\frac{${denX}}{${numX}}${lowestTerms(denX, numX)}$。`,
            ),
          });
        },
      },
      {
        id: "probabilities-from-a-conditional-density",
        title: t("Probabilities from a conditional density", "由条件密度求概率"),
        explanation: t(
          "Once the conditional density $f_{Y \\mid X}(y \\mid x)$ is known, conditional probabilities are one-dimensional integrals:\n\n$$P(Y \\le c \\mid X = x) = \\int_{-\\infty}^{c} f_{Y \\mid X}(y \\mid x)\\,dy.$$\n\nFor $f(x, y) = 2$ on $0 \\le y \\le x \\le 1$, given $X = x$ the variable $Y$ is uniform on $[0, x]$, so $P(Y \\le c \\mid X = x) = \\frac{c}{x}$ for $0 \\le c \\le x$, and $1$ once $c \\ge x$.",
          "知道条件密度 $f_{Y \\mid X}(y \\mid x)$ 后，条件概率就是一维积分：\n\n$$P(Y \\le c \\mid X = x) = \\int_{-\\infty}^{c} f_{Y \\mid X}(y \\mid x)\\,dy.$$\n\n对 $0 \\le y \\le x \\le 1$ 上的 $f(x, y) = 2$，给定 $X = x$ 时 $Y$ 在 $[0, x]$ 上均匀分布，所以当 $0 \\le c \\le x$ 时 $P(Y \\le c \\mid X = x) = \\frac{c}{x}$，当 $c \\ge x$ 时为 $1$。",
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
            wrong: [c, Q.of(2).mul(c), c.mul(x)].filter((v) => !v.eq(ans) && v.cmp(Q.of(2)) <= 0),
            solution: t(
              `$f_X(x) = 2x$, so $f_{Y \\mid X}(y \\mid x) = \\frac{2}{2x} = \\frac{1}{x}$ on $[0, x]$: $Y$ is uniform on $[0, ${dec(x)}]$. ${c.cmp(x) >= 0 ? `Since $${dec(c)} \\ge ${dec(x)}$, the probability is $1$.` : `The probability is $\\frac{${dec(c)}}{${dec(x)}} = ${ans.toLatex()}$.`}`,
              `$f_X(x) = 2x$，所以在 $[0, x]$ 上 $f_{Y \\mid X}(y \\mid x) = \\frac{2}{2x} = \\frac{1}{x}$：$Y$ 在 $[0, ${dec(x)}]$ 上均匀分布。${c.cmp(x) >= 0 ? `由于 $${dec(c)} \\ge ${dec(x)}$，概率为 $1$。` : `概率为 $\\frac{${dec(c)}}{${dec(x)}} = ${ans.toLatex()}$。`}`,
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
    prerequisites: ["joint-distributions-for-continuous-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-joint-continuous-cdf",
        title: t("Evaluating double integral of joint density for CDF", "通过联合密度的二重积分计算累积分布函数值"),
        explanation: t(
          "The joint cumulative distribution function adds up the density over the region to the lower left of the point, so it is a double integral. The joint CDF is $F(x, y) = P(X \\le x, Y \\le y) = \\int_{-\\infty}^x \\int_{-\\infty}^y f(u, v) \\, dv \\, du$.",
          "联合累积分布函数把该点左下方区域上的密度加起来，所以它是一个二重积分。联合分布函数为 $F(x, y) = P(X \\le x, Y \\le y) = \\int_{-\\infty}^x \\int_{-\\infty}^y f(u, v) \\, dv \\, du$。",
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
            wrong: [Q.of(numX * denY + numY * denX, ansDen), Q.of(numX + numY, denX + denY), Q.of(numX, denX)],
            solution: t(
              `$F_{X,Y}(x, y) = \\int_0^x \\int_0^y 1 \\, dv \\, du = x y$. Thus $F_{X,Y}\\left(\\frac{${numX}}{${denX}}, \\frac{${numY}}{${denY}}\\right) = \\frac{${numX}}{${denX}} \\times \\frac{${numY}}{${denY}} = \\frac{${ansNum}}{${ansDen}}${lowestTerms(ansNum, ansDen)}$.`,
              `$F_{X,Y}(x, y) = \\int_0^x \\int_0^y 1 \\, dv \\, du = x y$。因此 $F_{X,Y}\\left(\\frac{${numX}}{${denX}}, \\frac{${numY}}{${denY}}\\right) = \\frac{${numX}}{${denX}} \\times \\frac{${numY}}{${denY}} = \\frac{${ansNum}}{${ansDen}}${lowestTerms(ansNum, ansDen)}$。`,
            ),
          });
        },
      },
      {
        id: "the-joint-cdf-of-a-non-uniform-density",
        title: t("The joint CDF of a non-uniform density", "非均匀密度的联合分布函数"),
        explanation: t(
          "For a density that is not constant, integrate it over the lower-left rectangle. For $f(x, y) = x + y$ on the unit square and $0 \\le a, b \\le 1$:\n\n$$F(a, b) = \\int_0^{a}\\int_0^{b} (u + v)\\,dv\\,du = \\frac{a^{2}b + ab^{2}}{2} = \\frac{ab(a + b)}{2}.$$\n\nCheck: $F(1, 1) = 1$, as every joint CDF must reach.",
          "对于非常数的密度，要在左下矩形上积分。对单位正方形上的 $f(x, y) = x + y$ 及 $0 \\le a, b \\le 1$：\n\n$$F(a, b) = \\int_0^{a}\\int_0^{b} (u + v)\\,dv\\,du = \\frac{a^{2}b + ab^{2}}{2} = \\frac{ab(a + b)}{2}.$$\n\n检验：$F(1, 1) = 1$，这是任何联合分布函数都必须达到的。",
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
            wrong: [a.mul(b), a.mul(b).mul(a.add(b)), a.add(b).div(Q.of(2))].filter((v) => !v.eq(ans)),
            solution: t(
              `$F(a, b) = \\frac{ab(a + b)}{2} = \\frac{${dec(a)} \\cdot ${dec(b)} \\cdot ${dec(a.add(b))}}{2} = ${dec(ans)}$.`,
              `$F(a, b) = \\frac{ab(a + b)}{2} = \\frac{${dec(a)} \\cdot ${dec(b)} \\cdot ${dec(a.add(b))}}{2} = ${dec(ans)}$。`,
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
    prerequisites: ["the-joint-cdf-of-two-continuous-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "joint-cdf-rectangular-probability",
        title: t("Expressing rectangular probability in terms of the joint CDF", "用联合累积分布函数表示矩形区域上的概率"),
        explanation: t(
          "Subtracting the two strips removes their overlap twice, so the corner region must be added back once, as in inclusion and exclusion.\n\n$$P(a < X \\le b,\\ c < Y \\le d) = F(b, d) - F(a, d) - F(b, c) + F(a, c)$$",
          "减去两个条带时它们的重叠部分被减了两次，所以要把角上的区域加回一次，这与容斥原理一样。\n\n$$P(a < X \\le b,\\ c < Y \\le d) = F(b, d) - F(a, d) - F(b, c) + F(a, c)$$",
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

          return choiceProblem({
            prompt: t(
              `For any joint cumulative distribution function $F(x, y)$, which expression correctly computes the probability $P(${a} < X \\le ${b}, \\; ${c} < Y \\le ${d})$?`,
              `对于任意联合累积分布函数 $F(x, y)$，下列哪个表达式能够正确计算矩形概率 $P(${a} < X \\le ${b}, \\; ${c} < Y \\le ${d})$？`,
            ),
            options,
            correct,
            solution: t(
              `By the 2D inclusion-exclusion principle for joint CDFs, $P(a < X \\le b, c < Y \\le d) = F(b, d) - F(a, d) - F(b, c) + F(a, c)$. Here, that gives $F(${b}, ${d}) - F(${a}, ${d}) - F(${b}, ${c}) + F(${a}, ${c})$.`,
              `由二维容斥原理，联合分布函数在矩形上的概率为 $P(a < X \\le b, c < Y \\le d) = F(b, d) - F(a, d) - F(b, c) + F(a, c)$。此处对应为 $F(${b}, ${d}) - F(${a}, ${d}) - F(${b}, ${c}) + F(${a}, ${c})$。`,
            ),
          });
        },
      },
      {
        id: "a-rectangle-probability-from-cdf-values",
        title: t("A rectangle probability from CDF values", "由分布函数值求矩形概率"),
        explanation: t(
          "Inclusion–exclusion on the four corners gives the probability of a rectangle:\n\n$$P(a < X \\le b, c < Y \\le d) = F(b, d) - F(a, d) - F(b, c) + F(a, c).$$\n\nThe corner $F(a, c)$ is subtracted twice, once in each middle term, so it is added back once. The result can never be negative; a negative answer signals a sign error.",
          "对四个角作容斥，就得到矩形的概率：\n\n$$P(a < X \\le b, c < Y \\le d) = F(b, d) - F(a, d) - F(b, c) + F(a, c).$$\n\n角 $F(a, c)$ 在中间两项中各被减去一次，共两次，所以要加回一次。结果不可能为负；得到负值说明符号有误。",
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
            wrong: [v(bd - ad - bc), v(bd - ac), v(bd - ad - bc + 2 * ac)].filter((w) => !w.eq(ans)),
            solution: t(
              `$F(4, 5) - F(1, 5) - F(4, 2) + F(1, 2) = ${dec(v(bd))} - ${dec(v(ad))} - ${dec(v(bc))} + ${dec(v(ac))} = ${dec(ans)}$.`,
              `$F(4, 5) - F(1, 5) - F(4, 2) + F(1, 2) = ${dec(v(bd))} - ${dec(v(ad))} - ${dec(v(bc))} + ${dec(v(ac))} = ${dec(ans)}$。`,
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
    prerequisites: ["the-normal-distribution", "marginal-distributions-for-continuous-random-variables"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "bivariate-normal-zero-correlation-independence",
        title: t("Zero correlation implies independence for bivariate normal variables", "二元正态变量零相关即独立"),
        explanation: t(
          "For most pairs of variables zero correlation does not imply independence, but for jointly normal variables it does, because the density then factors. For jointly normal random variables, $\\operatorname{Cov}(X, Y) = 0$ (or $\\rho = 0$) is necessary and sufficient for independence.",
          "对大多数变量对来说，相关系数为零并不意味着独立，但对联合正态变量却成立，因为此时密度可以分解。对于联合正态随机变量，$\\operatorname{Cov}(X, Y) = 0$（或 $\\rho = 0$）是两者相互独立的充要条件。",
        ),
        generate: (rng: Rng): Problem => {
          const muX = rng.int(1, 25);
          const muY = rng.int(1, 25);
          const rho = rng.pick([0, 0.5, -0.4, 0.8]);
          const isZero = rho === 0;

          const opts = isZero
            ? [
                t(
                  "Yes, because for bivariate normal random variables, zero correlation (ρ = 0) is equivalent to independence.",
                  "是，因为对于二元正态随机变量，零相关系数（ρ = 0）等价于相互独立。",
                ),
                t(
                  "No, zero correlation never guarantees independence for continuous variables.",
                  "否，零相关在连续变量中绝不能保证相互独立。",
                ),
                t("Only if the means are both zero.", "仅当两个均值都为零时才成立。"),
                t("Only if the variances are equal (σ_X = σ_Y).", "仅当方差相等（σ_X = σ_Y）时才成立。"),
              ]
            : [
                t(
                  `No, because $\\rho = ${rho} \\ne 0$, meaning the variables are correlated and therefore not independent.`,
                  `否，因为相关系数 $\\rho = ${rho} \\ne 0$，说明变量相关，从而不独立。`,
                ),
                t("Yes, any bivariate normal distribution has independent marginals.", "是，任意二元正态分布都具有相互独立的边际分布。"),
                t("Yes, provided the conditional distribution is symmetric.", "是，只要条件分布对称即可。"),
                t("Cannot be determined without knowing the means μ_X and μ_Y.", "在未知均值 μ_X 与 μ_Y 的情况下无法确定。"),
              ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);

          return choiceProblem({
            prompt: t(
              `Suppose $(X, Y)$ follows a bivariate normal distribution with means $\\mu_X = ${muX}$, $\\mu_Y = ${muY}$, and correlation coefficient $\\rho = ${rho}$. Are $X$ and $Y$ independent?`,
              `设 $(X, Y)$ 服从均值为 $\\mu_X = ${muX}$、$\\mu_Y = ${muY}$ 且相关系数为 $\\rho = ${rho}$ 的二元正态分布。问 $X$ 与 $Y$ 是否相互独立？`,
            ),
            options,
            correct,
            solution: t(
              isZero
                ? "For jointly normal variables, the joint PDF factors if and only if ρ = 0. Therefore, zero correlation implies independence."
                : `Because $\\rho = ${rho} \\ne 0$, $X$ and $Y$ are correlated, so they cannot be independent.`,
              isZero
                ? "对于联合正态变量，联合密度函数可分解当且仅当相关系数 ρ = 0。因此零相关意味着独立。"
                : `因为 $\\rho = ${rho} \\ne 0$，故 $X$ 与 $Y$ 相关，因而不能独立。`,
            ),
          });
        },
      },
      {
        id: "the-conditional-mean-of-a-bivariate-normal",
        title: t("The conditional mean of a bivariate normal", "二元正态的条件均值"),
        explanation: t(
          "For a bivariate normal pair, the conditional distribution of $Y$ given $X = x$ is normal, with a mean that is linear in $x$:\n\n$$E[Y \\mid X = x] = \\mu_Y + \\rho\\frac{\\sigma_Y}{\\sigma_X}(x - \\mu_X), \\qquad \\operatorname{Var}(Y \\mid X = x) = \\sigma_Y^{2}(1 - \\rho^{2}).$$\n\nThis is the population regression line. Since $|\\rho| < 1$, the prediction moves fewer standard deviations than $x$ did: regression toward the mean.",
          "对二元正态变量，给定 $X = x$ 时 $Y$ 的条件分布仍是正态，其均值关于 $x$ 线性：\n\n$$E[Y \\mid X = x] = \\mu_Y + \\rho\\frac{\\sigma_Y}{\\sigma_X}(x - \\mu_X), \\qquad \\operatorname{Var}(Y \\mid X = x) = \\sigma_Y^{2}(1 - \\rho^{2}).$$\n\n这就是总体回归直线。由于 $|\\rho| < 1$，预测值偏离的标准差个数比 $x$ 少：这就是向均值回归。",
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
            wrong: [
              Q.of(muY),
              Q.of(muY).add(rho.mul(Q.of(sx, sy)).mul(Q.of(x - muX))),
              Q.of(muY).add(Q.of(sy, sx).mul(Q.of(x - muX))),
            ].filter((v) => !v.eq(ans) && isTerminating(v)),
            solution: t(
              `$E[Y \\mid X = ${x}] = ${muY} + ${par(rho)} \\cdot \\frac{${sy}}{${sx}} \\cdot ${par(Q.of(x - muX))} = ${dec(ans)}$.`,
              `$E[Y \\mid X = ${x}] = ${muY} + ${par(rho)} \\cdot \\frac{${sy}}{${sx}} \\cdot ${par(Q.of(x - muX))} = ${dec(ans)}$。`,
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
    prerequisites: ["the-binomial-distribution", "properties-of-expectation-for-discrete-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "sum-of-independent-binomials-same-p",
        title: t("Adding independent binomial variables with identical p", "具有相同成功概率的独立二项变量求和"),
        explanation: t(
          "Two sets of independent trials with the same success probability can be combined into one longer set, so the total is binomial with the trials added. If $X \\sim \\text{Binomial}(n_1, p)$ and $Y \\sim \\text{Binomial}(n_2, p)$ are independent, then $X + Y \\sim \\text{Binomial}(n_1 + n_2, p)$.",
          "两组成功概率相同的独立试验可以合并成更长的一组，所以总数服从试验次数相加的二项分布。若 $X \\sim \\text{Binomial}(n_1, p)$ 与 $Y \\sim \\text{Binomial}(n_2, p)$ 相互独立，则 $X + Y \\sim \\text{Binomial}(n_1 + n_2, p)$。",
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
            wrong: [Math.max(n1, n2), n1 * n2, Q.of(nSum * 3, 10)],
            solution: t(
              `The sum of independent binomial random variables with common parameter $p$ has number of trials equal to the sum of the individual trial counts: $n = n_1 + n_2 = ${n1} + ${n2} = ${nSum}$.`,
              `具有相同参数 $p$ 的独立二项随机变量之和的试验次数等于各自试验次数之和：$n = n_1 + n_2 = ${n1} + ${n2} = ${nSum}$。`,
            ),
          });
        },
      },
      {
        id: "the-mean-and-variance-of-a-difference-of-binomials",
        title: t("The mean and variance of a difference of binomials", "二项变量之差的均值与方差"),
        explanation: t(
          "When the success probabilities differ, $X + Y$ is no longer binomial, but its moments are still easy. For independent $X \\sim \\text{Bin}(n_1, p_1)$ and $Y \\sim \\text{Bin}(n_2, p_2)$,\n\n$$E[X - Y] = n_1p_1 - n_2p_2, \\qquad \\operatorname{Var}(X - Y) = n_1p_1(1 - p_1) + n_2p_2(1 - p_2).$$\n\nThe variances **add** even for a difference, because $\\operatorname{Var}(-Y) = (-1)^{2}\\operatorname{Var}(Y)$.",
          "当成功概率不同时，$X + Y$ 不再服从二项分布，但其矩仍然容易计算。对独立的 $X \\sim \\text{Bin}(n_1, p_1)$ 与 $Y \\sim \\text{Bin}(n_2, p_2)$，\n\n$$E[X - Y] = n_1p_1 - n_2p_2, \\qquad \\operatorname{Var}(X - Y) = n_1p_1(1 - p_1) + n_2p_2(1 - p_2).$$\n\n即使是差，方差也要**相加**，因为 $\\operatorname{Var}(-Y) = (-1)^{2}\\operatorname{Var}(Y)$。",
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
            wrong: [
              v1.sub(v2),
              Q.of(n1).mul(p1).add(Q.of(n2).mul(p2)),
              Q.of(n1 + n2)
                .mul(p1)
                .mul(Q.one.sub(p1)),
            ].filter((v) => !v.eq(ans)),
            solution: t(
              `$\\operatorname{Var}(X) = ${n1} \\cdot ${dec(p1)} \\cdot ${dec(Q.one.sub(p1))} = ${dec(v1)}$ and $\\operatorname{Var}(Y) = ${n2} \\cdot ${dec(p2)} \\cdot ${dec(Q.one.sub(p2))} = ${dec(v2)}$. They add: $${dec(ans)}$.`,
              `$\\operatorname{Var}(X) = ${n1} \\cdot ${dec(p1)} \\cdot ${dec(Q.one.sub(p1))} = ${dec(v1)}$，$\\operatorname{Var}(Y) = ${n2} \\cdot ${dec(p2)} \\cdot ${dec(Q.one.sub(p2))} = ${dec(v2)}$。两者相加：$${dec(ans)}$。`,
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
    prerequisites: ["the-poisson-distribution", "properties-of-expectation-for-discrete-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "sum-of-independent-poisson-parameters",
        title: t("Adding independent Poisson variables", "独立泊松变量求和"),
        explanation: t(
          "Counting events from two independent sources together is still a Poisson count, with the two rates added. For independent $X \\sim \\text{Poisson}(\\lambda_1)$ and $Y \\sim \\text{Poisson}(\\lambda_2)$, $X + Y \\sim \\text{Poisson}(\\lambda_1 + \\lambda_2)$.",
          "把两个独立来源的事件合起来计数，仍是泊松计数，速率为两者之和。若 $X \\sim \\text{Poisson}(\\lambda_1)$ 与 $Y \\sim \\text{Poisson}(\\lambda_2)$ 相互独立，则 $X + Y \\sim \\text{Poisson}(\\lambda_1 + \\lambda_2)$。",
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
            wrong: [l1 * l2, Q.of(lSum, 2), Math.abs(l1 - l2)],
            solution: t(
              `By the reproductive property of the Poisson distribution, the sum of independent Poisson variables is Poisson with parameter $\\lambda = \\lambda_1 + \\lambda_2 = ${l1} + ${l2} = ${lSum}$.`,
              `由泊松分布的可加性，独立泊松随机变量之和服从泊松分布，其参数为 $\\lambda = \\lambda_1 + \\lambda_2 = ${l1} + ${l2} = ${lSum}$。`,
            ),
          });
        },
      },
      {
        id: "probabilities-for-a-sum-of-poissons",
        title: t("Probabilities for a sum of Poissons", "泊松变量之和的概率"),
        explanation: t(
          "Once the rates are added, a probability about the total is a single Poisson calculation:\n\n$$P(X + Y = k) = e^{-(\\lambda_1 + \\lambda_2)}\\frac{(\\lambda_1 + \\lambda_2)^{k}}{k!}.$$\n\nIf a shop gets $2$ calls per hour on one line and $1$ on another, independently, the chance of exactly $4$ calls in total in an hour is $e^{-3}\\frac{3^{4}}{24} \\approx 0.1680$. Computing it from the two separate distributions would need a sum over all ways to split the $4$ calls.",
          "把强度相加后，关于总数的概率只需一次泊松计算：\n\n$$P(X + Y = k) = e^{-(\\lambda_1 + \\lambda_2)}\\frac{(\\lambda_1 + \\lambda_2)^{k}}{k!}.$$\n\n若某店一条线路每小时平均来电 $2$ 次，另一条 $1$ 次，相互独立，则一小时内总共恰好 $4$ 次来电的概率为 $e^{-3}\\frac{3^{4}}{24} \\approx 0.1680$。若用两个分布分别计算，需要对 $4$ 次来电的所有分配方式求和。",
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
          const wrong = [r4(pk(l1.toNumber()) * pk(l2.toNumber())), r4(pk(l1.toNumber()) + pk(l2.toNumber())), r4(1 - pk(lam))].filter(
            (v) => !v.eq(ans),
          );
          return numberProblem({
            prompt: t(
              `$X \\sim \\text{Poisson}(${dec(l1)})$ and $Y \\sim \\text{Poisson}(${dec(l2)})$ are independent. Find $P(X + Y = ${k})$, rounded to four decimal places.`,
              `$X \\sim \\text{Poisson}(${dec(l1)})$ 与 $Y \\sim \\text{Poisson}(${dec(l2)})$ 相互独立。求 $P(X + Y = ${k})$，精确到四位小数。`,
            ),
            answer: ans,
            form: "decimal",
            wrong,
            solution: t(
              `$X + Y \\sim \\text{Poisson}(${dec(l1.add(l2))})$, so $P(X + Y = ${k}) = e^{-${dec(l1.add(l2))}}\\frac{${dec(l1.add(l2))}^{${k}}}{${k}!} \\approx ${dec(ans)}$.`,
              `$X + Y \\sim \\text{Poisson}(${dec(l1.add(l2))})$，所以 $P(X + Y = ${k}) = e^{-${dec(l1.add(l2))}}\\frac{${dec(l1.add(l2))}^{${k}}}{${k}!} \\approx ${dec(ans)}$。`,
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
    prerequisites: ["the-normal-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "variance-of-two-normal-linear-combination",
        title: t("Variance of linear combination of two independent normals", "两个独立正态变量线性组合的方差"),
        explanation: t(
          "A combination of independent normal variables is normal again, and its variance uses the squares of the coefficients. $\\operatorname{Var}(aX + bY) = a^2 \\operatorname{Var}(X) + b^2 \\operatorname{Var}(Y)$ when $X$ and $Y$ are independent.",
          "独立正态变量的组合仍然是正态的，它的方差要用系数的平方。当 $X$ 与 $Y$ 独立时，$\\operatorname{Var}(aX + bY) = a^2 \\operatorname{Var}(X) + b^2 \\operatorname{Var}(Y)$。",
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
            wrong: [a * a * v1 - b * b * v2, a * v1 + b * v2, a * v1 - b * v2],
            solution: t(
              `Since $X$ and $Y$ are independent, $\\text{Var}(${a}X - ${b}Y) = ${a}^2 \\text{Var}(X) + (-${b})^2 \\text{Var}(Y) = ${a * a}(${v1}) + ${b * b}(${v2}) = ${a * a * v1} + ${b * b * v2} = ${varTotal}$.`,
              `由于 $X$ 与 $Y$ 相互独立，$\\text{Var}(${a}X - ${b}Y) = ${a}^2 \\text{Var}(X) + (-${b})^2 \\text{Var}(Y) = ${a * a}(${v1}) + ${b * b}(${v2}) = ${a * a * v1} + ${b * b * v2} = ${varTotal}$。`,
            ),
          });
        },
      },
      {
        id: "the-probability-that-one-normal-exceeds-another",
        title: t("The probability that one normal exceeds another", "一个正态变量超过另一个的概率"),
        explanation: t(
          "To compare two independent normal variables, study their difference. $D = X - Y$ is normal with mean $\\mu_X - \\mu_Y$ and variance $\\sigma_X^{2} + \\sigma_Y^{2}$, and\n\n$$P(X > Y) = P(D > 0) = 1 - \\Phi\\left(\\frac{0 - (\\mu_X - \\mu_Y)}{\\sqrt{\\sigma_X^{2} + \\sigma_Y^{2}}}\\right).$$\n\nIf a bolt's length is $N(50, 9)$ and a hole's depth is $N(52, 16)$, then $P(\\text{bolt} > \\text{hole}) = 1 - \\Phi\\left(\\frac{2}{5}\\right)$.",
          "比较两个独立的正态变量时，研究它们的差。$D = X - Y$ 服从均值 $\\mu_X - \\mu_Y$、方差 $\\sigma_X^{2} + \\sigma_Y^{2}$ 的正态分布，且\n\n$$P(X > Y) = P(D > 0) = 1 - \\Phi\\left(\\frac{0 - (\\mu_X - \\mu_Y)}{\\sqrt{\\sigma_X^{2} + \\sigma_Y^{2}}}\\right).$$\n\n例如螺栓长度为 $N(50, 9)$，孔深为 $N(52, 16)$，则 $P(\\text{螺栓} > \\text{孔}) = 1 - \\Phi\\left(\\frac{2}{5}\\right)$。",
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
            wrong: [phi(zv), Q.one.sub(phi(Math.max(-2.5, Math.min(2.5, Math.round(((zv * c) / (a + b)) * 2) / 2))))].filter(
              (v) => !v.eq(ans),
            ),
            solution: t(
              `$X - Y \\sim N(${dec(diff)}, ${a * a} + ${b * b}) = N(${dec(diff)}, ${c * c})$. So $P(X - Y > 0) = 1 - \\Phi\\left(\\frac{0 - ${par(diff)}}{${c}}\\right) = 1 - \\Phi(${zv}) = ${dec(ans)}$.`,
              `$X - Y \\sim N(${dec(diff)}, ${a * a} + ${b * b}) = N(${dec(diff)}, ${c * c})$。所以 $P(X - Y > 0) = 1 - \\Phi\\left(\\frac{0 - ${par(diff)}}{${c}}\\right) = 1 - \\Phi(${zv}) = ${dec(ans)}$。`,
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
    prerequisites: ["combining-two-normally-distributed-random-variables"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "mean-of-multiple-normal-combination",
        title: t("Mean of a general linear combination of normal variables", "多个正态变量一般线性组合的均值"),
        explanation: t(
          "The mean of any linear combination is the same combination of the means, whether or not the variables are independent. Expectation is linear: $E\\left[\\sum_i c_i X_i\\right] = \\sum_i c_i E[X_i]$.",
          "无论变量是否独立，任意线性组合的均值都是各均值的同样组合。期望是线性的：$E\\left[\\sum_i c_i X_i\\right] = \\sum_i c_i E[X_i]$。",
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
            wrong: [c1 * m1 + c2 * m2 + c3 * m3, m1 + m2 - m3, c1 * m1 + c2 * m2],
            solution: t(
              `By linearity of expectation, $E[W] = ${c1} E[X_1] + ${c2} E[X_2] - ${c3} E[X_3] = ${c1}(${m1}) + ${c2}(${m2}) - ${c3}(${m3}) = ${meanTotal}$.`,
              `由期望的线性性质，$E[W] = ${c1} E[X_1] + ${c2} E[X_2] - ${c3} E[X_3] = ${c1}(${m1}) + ${c2}(${m2}) - ${c3}(${m3}) = ${meanTotal}$。`,
            ),
          });
        },
      },
      {
        id: "the-variance-of-a-combination-of-several-normals",
        title: t("The variance of a combination of several normals", "多个正态变量组合的方差"),
        explanation: t(
          "Each coefficient is squared, so signs disappear from the variance:\n\n$$\\operatorname{Var}\\left(\\sum c_iX_i\\right) = \\sum c_i^{2}\\sigma_i^{2}$$\n\nfor independent $X_i$. A coefficient of $-3$ contributes $9\\sigma_i^{2}$, the same as $+3$. Together with the mean $\\sum c_i\\mu_i$, this pins down the normal distribution of the combination.",
          "每个系数都要平方，因此符号在方差中消失：对独立的 $X_i$，\n\n$$\\operatorname{Var}\\left(\\sum c_iX_i\\right) = \\sum c_i^{2}\\sigma_i^{2}.$$\n\n系数 $-3$ 贡献 $9\\sigma_i^{2}$，与 $+3$ 相同。连同均值 $\\sum c_i\\mu_i$，就完全确定了组合的正态分布。",
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
            wrong: [signed, abs, vs.reduce((s, v) => s + v, 0)].filter((v) => v !== ans),
            solution: t(
              `$\\operatorname{Var} = ${cs.map((c, i) => `${c * c} \\cdot ${vs[i]}`).join(" + ")} = ${ans}$.`,
              `$\\operatorname{Var} = ${cs.map((c, i) => `${c * c} \\cdot ${vs[i]}`).join(" + ")} = ${ans}$。`,
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
    prerequisites: ["combining-multiple-normally-distributed-random-variables"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "sample-mean-variance-iid-normal",
        title: t("Variance of the sample mean for i.i.d. normal variables", "独立同分布正态样本均值的方差"),
        explanation: t(
          "Averaging independent observations cancels part of their random variation, so the variance of the mean shrinks in proportion to the sample size. For $X_1, \\dots, X_n$ i.i.d. $N(\\mu, \\sigma^2)$, $\\operatorname{Var}(\\bar{X}) = \\frac{\\sigma^2}{n}$.",
          "对独立观测取平均会抵消一部分随机波动，所以均值的方差与样本量成反比地缩小。对于独立同分布的 $X_1, \\dots, X_n \\sim N(\\mu, \\sigma^2)$，样本均值的方差为 $\\operatorname{Var}(\\bar{X}) = \\frac{\\sigma^2}{n}$。",
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
            wrong: [sigmaSq, Q.of(sigmaSq, n * n), sigmaSq * n],
            solution: t(
              `The variance of the sample mean is $\\text{Var}(\\bar{X}) = \\frac{\\sigma^2}{n} = \\frac{${sigmaSq}}{${n}}${lowestTerms(sigmaSq, n)}$.`,
              `样本均值的方差为 $\\text{Var}(\\bar{X}) = \\frac{\\sigma^2}{n} = \\frac{${sigmaSq}}{${n}}${lowestTerms(sigmaSq, n)}$。`,
            ),
          });
        },
      },
      {
        id: "adding-copies-versus-scaling-one",
        title: t("Adding copies versus scaling one", "多个副本相加与单个放大"),
        explanation: t(
          "$X_1 + X_2 + \\cdots + X_n$ and $nX_1$ have the same mean $n\\mu$, but not the same variance:\n\n$$\\operatorname{Var}(X_1 + \\cdots + X_n) = n\\sigma^{2}, \\qquad \\operatorname{Var}(nX_1) = n^{2}\\sigma^{2}.$$\n\nIndependent copies partly cancel each other's deviations, while a single scaled variable has its deviation multiplied in full. The total weight of $10$ bags varies far less than $10$ times the weight of one bag.",
          "$X_1 + X_2 + \\cdots + X_n$ 与 $nX_1$ 的均值都是 $n\\mu$，但方差不同：\n\n$$\\operatorname{Var}(X_1 + \\cdots + X_n) = n\\sigma^{2}, \\qquad \\operatorname{Var}(nX_1) = n^{2}\\sigma^{2}.$$\n\n独立的副本会部分抵消彼此的偏差，而单个变量放大时偏差被完全放大。$10$ 袋的总重量的波动远小于一袋重量的 $10$ 倍。",
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
            wrong: [sum ? n * n * v : n * v, v, sum ? v : n * v * 2].filter((w) => w !== ans),
            solution: t(
              sum
                ? `The variances of independent terms add: $${n} \\cdot ${v} = ${ans}$.`
                : `Scaling by $${n}$ multiplies the variance by $${n}^{2}$: $${n * n} \\cdot ${v} = ${ans}$.`,
              sum
                ? `独立项的方差相加：$${n} \\cdot ${v} = ${ans}$。`
                : `乘以 $${n}$ 使方差乘以 $${n}^{2}$：$${n * n} \\cdot ${v} = ${ans}$。`,
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
    prerequisites: ["independence-of-discrete-random-variables", "properties-of-expectation-for-discrete-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "multiplicative-expectation-independent",
        title: t("Evaluating the expectation of a product of independent variables", "计算相互独立变量积的数学期望"),
        explanation: t(
          "For independent variables the mean of a product splits into the product of the means, which fails in general when they are dependent. If X and Y are independent, E[XY] = E[X] E[Y].",
          "对于独立变量，乘积的均值可以拆成均值的乘积，而在变量相关时一般不成立。若 X 与 Y 相互独立，则 E[XY] = E[X] E[Y]。",
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
            wrong: [eX + eY, eX * eY + 1, eY - eX],
            solution: t(
              `Because $X$ and $Y$ are independent, $E[XY] = E[X] \\cdot E[Y] = (${eX})(${eY}) = ${prod}$.`,
              `由于 $X$ 与 $Y$ 相互独立，因此 $E[XY] = E[X] \\cdot E[Y] = (${eX})(${eY}) = ${prod}$。`,
            ),
          });
        },
      },
      {
        id: "expectations-of-products-of-powers",
        title: t("Expectations of products of powers", "幂的乘积的期望"),
        explanation: t(
          "Independence lets functions of $X$ and $Y$ separate too: $E[g(X)h(Y)] = E[g(X)]\\,E[h(Y)]$. For squares, recover $E[X^{2}]$ from the variance:\n\n$$E[X^{2}Y] = E[X^{2}]\\,E[Y] = \\left(\\operatorname{Var}(X) + E[X]^{2}\\right)E[Y].$$\n\nA common slip is to use $E[X]^{2}$ for $E[X^{2}]$; they differ by exactly the variance.",
          "独立性同样使 $X$ 与 $Y$ 的函数可以分开：$E[g(X)h(Y)] = E[g(X)]\\,E[h(Y)]$。对于平方，由方差求出 $E[X^{2}]$：\n\n$$E[X^{2}Y] = E[X^{2}]\\,E[Y] = \\left(\\operatorname{Var}(X) + E[X]^{2}\\right)E[Y].$$\n\n常见错误是把 $E[X]^{2}$ 当作 $E[X^{2}]$；两者恰好相差方差。",
        ),
        generate: (rng: Rng): Problem => {
          const ex = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
          const vx = rng.int(1, 9);
          let ey = rng.int(-5, 7);
          if (ey === 0) ey = 3;
          const ans = (vx + ex * ex) * ey;
          return numberProblem({
            prompt: t(
              `$X$ and $Y$ are independent with $E[X] = ${ex}$, $\\operatorname{Var}(X) = ${vx}$ and $E[Y] = ${ey}$. Find $E[X^{2}Y]$.`,
              `$X$ 与 $Y$ 独立，$E[X] = ${ex}$，$\\operatorname{Var}(X) = ${vx}$，$E[Y] = ${ey}$。求 $E[X^{2}Y]$。`,
            ),
            answer: ans,
            wrong: [ex * ex * ey, vx * ey, (vx - ex * ex) * ey].filter((w) => w !== ans),
            solution: t(
              `$E[X^{2}] = ${vx} + ${par(Q.of(ex))}^{2} = ${vx + ex * ex}$, so $E[X^{2}Y] = ${vx + ex * ex} \\cdot ${par(Q.of(ey))} = ${ans}$.`,
              `$E[X^{2}] = ${vx} + ${par(Q.of(ex))}^{2} = ${vx + ex * ex}$，所以 $E[X^{2}Y] = ${vx + ex * ex} \\cdot ${par(Q.of(ey))} = ${ans}$。`,
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
    prerequisites: ["expected-values-of-sums-and-products-of-random-variables", "properties-of-variance-for-discrete-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "sum-of-variances-independent",
        title: t("Computing variance of sum of independent variables", "计算独立随机变量和的方差"),
        explanation: t(
          "Independence makes the covariance term vanish, so the variance of a sum is just the sum of the variances. For independent variables, $\\operatorname{Var}(X + Y) = \\operatorname{Var}(X) + \\operatorname{Var}(Y)$.",
          "独立性使协方差项为零，所以和的方差就是方差之和。对于相互独立的变量，$\\operatorname{Var}(X + Y) = \\operatorname{Var}(X) + \\operatorname{Var}(Y)$。",
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
            wrong: [v1 - v2, v2 - v1, v1 + v2 + 2],
            solution: t(
              `For independent variables, $\\text{Var}(X - Y) = \\text{Var}(X) + (-1)^2 \\text{Var}(Y) = \\text{Var}(X) + \\text{Var}(Y) = ${v1} + ${v2} = ${vTotal}$.`,
              `对于相互独立的随机变量，$\\text{Var}(X - Y) = \\text{Var}(X) + (-1)^2 \\text{Var}(Y) = \\text{Var}(X) + \\text{Var}(Y) = ${v1} + ${v2} = ${vTotal}$。`,
            ),
          });
        },
      },
      {
        id: "the-variance-of-a-scaled-combination",
        title: t("The variance of a scaled combination", "带系数组合的方差"),
        explanation: t(
          "For independent $X$ and $Y$ and constants $a, b, c$,\n\n$$\\operatorname{Var}(aX + bY + c) = a^{2}\\operatorname{Var}(X) + b^{2}\\operatorname{Var}(Y).$$\n\nThe added constant $c$ shifts every value equally and does not change the spread; the coefficients enter squared. For $\\operatorname{Var}(X) = 4$, $\\operatorname{Var}(Y) = 1$: $\\operatorname{Var}(3X - 2Y + 7) = 36 + 4 = 40$.",
          "对独立的 $X$、$Y$ 与常数 $a, b, c$，\n\n$$\\operatorname{Var}(aX + bY + c) = a^{2}\\operatorname{Var}(X) + b^{2}\\operatorname{Var}(Y).$$\n\n加上的常数 $c$ 使每个值同样平移，不改变离散程度；系数以平方进入。若 $\\operatorname{Var}(X) = 4$，$\\operatorname{Var}(Y) = 1$：$\\operatorname{Var}(3X - 2Y + 7) = 36 + 4 = 40$。",
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
            wrong: [a * a * vx + b * vy, a * vx + b * vy, ans + c].filter((w) => w !== ans),
            solution: t(
              `$\\operatorname{Var} = ${a}^{2} \\cdot ${vx} + ${b}^{2} \\cdot ${vy} = ${a * a * vx} + ${b * b * vy} = ${ans}$; the constant $${c}$ does not affect the variance.`,
              `$\\operatorname{Var} = ${a}^{2} \\cdot ${vx} + ${b}^{2} \\cdot ${vy} = ${a * a * vx} + ${b * b * vy} = ${ans}$；常数 $${c}$ 不影响方差。`,
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
    prerequisites: ["expected-values-of-sums-and-products-of-random-variables"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "evaluating-discrete-joint-expectation",
        title: t("Evaluating E[XY] from a discrete probability table", "根据离散概率表计算 E[XY]"),
        explanation: t(
          "Multiply the two values in each cell of the table by the probability in that cell, and add the results over the whole table. $E[XY] = \\sum_x \\sum_y xy \\, p(x, y)$.",
          "把表格中每个格子对应的两个取值相乘，再乘以该格子的概率，然后对整个表格求和。$E[XY] = \\sum_x \\sum_y xy \\, p(x, y)$。",
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
            wrong: [Q.of(p11 + p12 + p21 + p22, total), Q.of(p11 + 4 * p22, total), Q.of(num, 4 * total)],
            solution: t(
              `$E[XY] = \\sum_{x} \\sum_{y} xy P(x, y) = 1(1)\\frac{${p11}}{${total}} + 1(2)\\frac{${p12}}{${total}} + 2(1)\\frac{${p21}}{${total}} + 2(2)\\frac{${p22}}{${total}} = \\frac{${num}}{${total}}${lowestTerms(num, total)}$.`,
              `$E[XY] = \\sum_{x} \\sum_{y} xy P(x, y) = 1(1)\\frac{${p11}}{${total}} + 1(2)\\frac{${p12}}{${total}} + 2(1)\\frac{${p21}}{${total}} + 2(2)\\frac{${p22}}{${total}} = \\frac{${num}}{${total}}${lowestTerms(num, total)}$。`,
            ),
          });
        },
      },
      {
        id: "the-expectation-of-a-nonlinear-function-from-a-table",
        title: t("The expectation of a nonlinear function from a table", "由联合分布表求非线性函数的期望"),
        explanation: t(
          "For a function that is not linear, such as $(X - Y)^{2}$ or $\\max(X, Y)$, there is no shortcut through $E[X]$ and $E[Y]$. Evaluate the function in every cell, multiply by the cell's probability, and add:\n\n$$E[g(X, Y)] = \\sum_x\\sum_y g(x, y)\\,p(x, y).$$\n\nCells where $g = 0$ contribute nothing, which often saves work.",
          "对于非线性函数，如 $(X - Y)^{2}$ 或 $\\max(X, Y)$，不能借助 $E[X]$ 与 $E[Y]$ 走捷径。要在每一格计算函数值，乘以该格的概率，再相加：\n\n$$E[g(X, Y)] = \\sum_x\\sum_y g(x, y)\\,p(x, y).$$\n\n$g = 0$ 的格没有贡献，常可省去计算。",
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
            wrong: [naive, Q.of(num, 9), Q.of(num)].filter((v) => !v.eq(ans)),
            solution: t(
              `Weighting $${label}$ in each cell by its weight gives a total of $${num}$, so $E[${label}] = \\frac{${num}}{${total}}${lowestTerms(num, total)}$.`,
              `把每格的 $${label}$ 乘以该格权重再相加得 $${num}$，所以 $E[${label}] = \\frac{${num}}{${total}}${lowestTerms(num, total)}$。`,
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
    prerequisites: ["conditional-distributions-for-discrete-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-discrete-conditional-expectation",
        title: t("Calculating conditional expectation from conditional PMF", "根据条件概率质量函数计算条件期望"),
        explanation: t(
          "A conditional expectation is an ordinary mean computed with the conditional probabilities for the given value of the other variable. $E[Y \\mid X = x] = \\sum_y y \\, P(Y = y \\mid X = x)$.",
          "条件期望就是用另一个变量取给定值时的条件概率计算的普通均值。$E[Y \\mid X = x] = \\sum_y y \\, P(Y = y \\mid X = x)$。",
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
            wrong: [Q.of(w1 + w2, totalW), 2, Q.of(3 * w1 + w2, totalW)],
            solution: t(
              `$E[Y \\mid X = 1] = 1 \\cdot P(Y = 1 \\mid X = 1) + 3 \\cdot P(Y = 3 \\mid X = 1) = 1 \\left(\\frac{${w1}}{${totalW}}\\right) + 3 \\left(\\frac{${w2}}{${totalW}}\\right) = \\frac{${num}}{${totalW}}${lowestTerms(num, totalW)}$.`,
              `$E[Y \\mid X = 1] = 1 \\cdot P(Y = 1 \\mid X = 1) + 3 \\cdot P(Y = 3 \\mid X = 1) = 1 \\left(\\frac{${w1}}{${totalW}}\\right) + 3 \\left(\\frac{${w2}}{${totalW}}\\right) = \\frac{${num}}{${totalW}}${lowestTerms(num, totalW)}$。`,
            ),
          });
        },
      },
      {
        id: "conditional-expectation-from-a-joint-table",
        title: t("Conditional expectation from a joint table", "由联合分布表求条件期望"),
        explanation: t(
          "Take the row for $X = x$, rescale it into a conditional distribution, and average $y$ over it:\n\n$$E[Y \\mid X = x] = \\frac{\\sum_y y\\,p(x, y)}{\\sum_y p(x, y)}.$$\n\nThe table's overall denominator cancels, so you may work with the weights directly. Different rows usually give different conditional means; how they vary with $x$ shows how $Y$ depends on $X$.",
          "取 $X = x$ 这一行，缩放成条件分布，再对其求 $y$ 的平均：\n\n$$E[Y \\mid X = x] = \\frac{\\sum_y y\\,p(x, y)}{\\sum_y p(x, y)}.$$\n\n表的总分母会约去，可以直接用权重计算。不同行通常给出不同的条件均值；它们随 $x$ 的变化反映了 $Y$ 如何依赖于 $X$。",
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
            wrong: [Q.of(num, total), Q.of(all, total), Q.of(2)].filter((v) => !v.eq(ans)),
            solution: t(
              `The row $X = ${x}$ has weights $${row.join(", ")}$ (total $${rs}$), so $E[Y \\mid X = ${x}] = \\frac{1 \\cdot ${row[0]} + 2 \\cdot ${row[1]} + 3 \\cdot ${row[2]}}{${rs}} = \\frac{${num}}{${rs}}${lowestTerms(num, rs)}$.`,
              `$X = ${x}$ 这一行的权重为 $${row.join(", ")}$（和为 $${rs}$），所以 $E[Y \\mid X = ${x}] = \\frac{1 \\cdot ${row[0]} + 2 \\cdot ${row[1]} + 3 \\cdot ${row[2]}}{${rs}} = \\frac{${num}}{${rs}}${lowestTerms(num, rs)}$。`,
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
    prerequisites: ["conditional-expectation-for-discrete-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-conditional-variance-discrete",
        title: t("Computing conditional variance using moments", "利用条件矩计算条件方差"),
        explanation: t(
          "The conditional variance uses the same shortcut as ordinary variance, with every expectation replaced by its conditional version. $\\operatorname{Var}(Y \\mid X = x) = E[Y^2 \\mid X = x] - (E[Y \\mid X = x])^2$.",
          "条件方差使用与普通方差相同的简便公式，只是把每个期望都换成条件期望。$\\operatorname{Var}(Y \\mid X = x) = E[Y^2 \\mid X = x] - (E[Y \\mid X = x])^2$。",
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
            wrong: [k, 2 * k * k, 4 * k * k],
            solution: t(
              `$E[Y \\mid X = 0] = \\frac{1}{2}(0) + \\frac{1}{2}(${2 * k}) = ${k}$. $E[Y^2 \\mid X = 0] = \\frac{1}{2}(0^2) + \\frac{1}{2}(${4 * k * k}) = ${2 * k * k}$. Thus $\\text{Var}(Y \\mid X = 0) = E[Y^2 \\mid X = 0] - (E[Y \\mid X = 0])^2 = ${2 * k * k} - ${k}^2 = ${varVal}$.`,
              `$E[Y \\mid X = 0] = \\frac{1}{2}(0) + \\frac{1}{2}(${2 * k}) = ${k}$。$E[Y^2 \\mid X = 0] = \\frac{1}{2}(0^2) + \\frac{1}{2}(${4 * k * k}) = ${2 * k * k}$。因此 $\\text{Var}(Y \\mid X = 0) = E[Y^2 \\mid X = 0] - (E[Y \\mid X = 0])^2 = ${2 * k * k} - ${k}^2 = ${varVal}$。`,
            ),
          });
        },
      },
      {
        id: "conditional-variance-from-conditional-probabilities",
        title: t("Conditional variance from conditional probabilities", "由条件概率求条件方差"),
        explanation: t(
          "Compute the first two conditional moments and subtract:\n\n$$\\operatorname{Var}(Y \\mid X = x) = E[Y^{2} \\mid X = x] - \\left(E[Y \\mid X = x]\\right)^{2}.$$\n\nIf, given $X = 1$, $Y$ is $0$, $1$ or $2$ with probabilities $\\frac{1}{4}, \\frac{1}{2}, \\frac{1}{4}$, then $E[Y \\mid X = 1] = 1$, $E[Y^{2} \\mid X = 1] = \\frac{3}{2}$ and the conditional variance is $\\frac{1}{2}$.",
          "求出前两阶条件矩再相减：\n\n$$\\operatorname{Var}(Y \\mid X = x) = E[Y^{2} \\mid X = x] - \\left(E[Y \\mid X = x]\\right)^{2}.$$\n\n若给定 $X = 1$ 时 $Y$ 取 $0$、$1$、$2$ 的概率为 $\\frac{1}{4}, \\frac{1}{2}, \\frac{1}{4}$，则 $E[Y \\mid X = 1] = 1$，$E[Y^{2} \\mid X = 1] = \\frac{3}{2}$，条件方差为 $\\frac{1}{2}$。",
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
            wrong: [m2, m2.sub(m1), m1.pow(2)].filter((v) => !v.eq(ans)),
            solution: t(
              `$E[Y \\mid X = 1] = ${m1.toLatex()}$ and $E[Y^{2} \\mid X = 1] = ${m2.toLatex()}$, so the variance is $${m2.toLatex()} - \\left(${m1.toLatex()}\\right)^{2} = ${ans.toLatex()}$.`,
              `$E[Y \\mid X = 1] = ${m1.toLatex()}$，$E[Y^{2} \\mid X = 1] = ${m2.toLatex()}$，所以方差为 $${m2.toLatex()} - \\left(${m1.toLatex()}\\right)^{2} = ${ans.toLatex()}$。`,
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
    prerequisites: ["computing-expected-values-from-joint-distributions"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "lotus-for-two-variables-concept",
        title: t("Understanding the direct expectation integral/sum under LOTUS", "理解 LOTUS 下直接期望积分与求和的概念"),
        explanation: t(
          "You can average a function of two variables directly against their joint density, without first working out the distribution of the function itself. $E[g(X, Y)] = \\iint g(x, y) f(x, y) \\, dy \\, dx$ eliminates the need to determine the density of $g(X, Y)$.",
          "可以直接用联合密度对两个变量的函数求平均，而不必先求出这个函数本身的分布。$E[g(X, Y)] = \\iint g(x, y) f(x, y) \\, dy \\, dx$ 免除了求解 $g(X, Y)$ 本身概率密度的繁琐步骤。",
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

          return choiceProblem({
            prompt: t(
              `By the 2D Law of the Unconscious Statistician (LOTUS), what is the direct double integral used to evaluate the expected value $E[${c}X + Y^2]$ for continuous random variables with joint PDF $f_{X,Y}(x, y)$?`,
              `根据二维无意识统计学家法则（LOTUS），对于联合概率密度为 $f_{X,Y}(x, y)$ 的连续随机变量，直接计算期望值 $E[${c}X + Y^2]$ 的二重积分表达式是什么？`,
            ),
            options,
            correct,
            solution: t(
              `LOTUS states that $E[g(X, Y)] = \\int_{-\\infty}^\\infty \\int_{-\\infty}^\\infty g(x, y) f_{X,Y}(x, y) \\, dy \\, dx$. Setting $g(x, y) = ${c}x + y^2$ gives $\\int_{-\\infty}^\\infty \\int_{-\\infty}^\\infty (${c} x + y^2) f_{X,Y}(x, y) \\, dy \\, dx$.`,
              `LOTUS 指出 $E[g(X, Y)] = \\int_{-\\infty}^\\infty \\int_{-\\infty}^\\infty g(x, y) f_{X,Y}(x, y) \\, dy \\, dx$。令 $g(x, y) = ${c}x + y^2$ 即得所求积分表达式。`,
            ),
          });
        },
      },
      {
        id: "evaluating-a-two-variable-lotus-integral",
        title: t("Evaluating a two-variable LOTUS integral", "计算二元无意识统计学家法则积分"),
        explanation: t(
          "For $f(x, y) = 4xy$ on the unit square, the rule gives $E[X^{m}Y^{k}] = \\int_0^1\\int_0^1 x^{m}y^{k} \\cdot 4xy\\,dy\\,dx$. The integrand factors, so the double integral is a product:\n\n$$E[X^{m}Y^{k}] = 4\\int_0^1 x^{m+1}\\,dx\\int_0^1 y^{k+1}\\,dy = \\frac{4}{(m + 2)(k + 2)}.$$\n\nFor example, $E[XY] = \\frac{4}{9}$ and $E[X^{2}] = \\frac{4}{4 \\cdot 2} = \\frac{1}{2}$.",
          "对单位正方形上的 $f(x, y) = 4xy$，由该法则 $E[X^{m}Y^{k}] = \\int_0^1\\int_0^1 x^{m}y^{k} \\cdot 4xy\\,dy\\,dx$。被积函数可以分解，所以二重积分成为乘积：\n\n$$E[X^{m}Y^{k}] = 4\\int_0^1 x^{m+1}\\,dx\\int_0^1 y^{k+1}\\,dy = \\frac{4}{(m + 2)(k + 2)}.$$\n\n例如 $E[XY] = \\frac{4}{9}$，$E[X^{2}] = \\frac{4}{4 \\cdot 2} = \\frac{1}{2}$。",
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
            wrong: [Q.of(1, (m + 1) * (k + 1)), Q.of(4, (m + 1) * (k + 1)), Q.of(1, (m + 2) * (k + 2))].filter((v) => !v.eq(ans)),
            solution: t(
              `$E[${g}] = 4\\int_0^1 x^{${m + 1}}\\,dx\\int_0^1 y^{${k + 1}}\\,dy = 4 \\cdot \\frac{1}{${m + 2}} \\cdot \\frac{1}{${k + 2}} = ${ans.toLatex()}$.`,
              `$E[${g}] = 4\\int_0^1 x^{${m + 1}}\\,dx\\int_0^1 y^{${k + 1}}\\,dy = 4 \\cdot \\frac{1}{${m + 2}} \\cdot \\frac{1}{${k + 2}} = ${ans.toLatex()}$。`,
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
    prerequisites: ["conditional-expectation-for-discrete-random-variables"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "evaluating-law-of-total-expectation",
        title: t("Computing overall mean via conditional expectations", "通过条件期望加权计算总体均值"),
        explanation: t(
          "The overall mean is a weighted average of the conditional means, with each weight being the probability of its condition. By the law of total expectation, $E[Y] = \\sum_x E[Y \\mid X = x] \\, P(X = x)$.",
          "总均值是各条件均值的加权平均，每个权重是相应条件发生的概率。由全期望公式，$E[Y] = \\sum_x E[Y \\mid X = x] \\, P(X = x)$。",
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
            wrong: [Q.of(e1 + e2, 2), Q.of(e1 * (p1.den - p1.num) + e2 * p1.num, den), e1 + e2],
            solution: t(
              `By the Law of Total Expectation, $E[T] = E[T \\mid \\text{State 1}] P(\\text{State 1}) + E[T \\mid \\text{State 2}] P(\\text{State 2}) = ${e1} \\left(\\frac{${p1.num}}{${p1.den}}\\right) + ${e2} \\left(\\frac{${p1.den - p1.num}}{${p1.den}}\\right) = \\frac{${num}}{${den}}${lowestTerms(num, den)}$.`,
              `由全期望公式，$E[T] = E[T \\mid \\text{状态 1}] P(\\text{状态 1}) + E[T \\mid \\text{状态 2}] P(\\text{状态 2}) = ${e1} \\left(\\frac{${p1.num}}{${p1.den}}\\right) + ${e2} \\left(\\frac{${p1.den - p1.num}}{${p1.den}}\\right) = \\frac{${num}}{${den}}${lowestTerms(num, den)}$。`,
            ),
          });
        },
      },
      {
        id: "the-mean-of-a-random-sum",
        title: t("The mean of a random sum", "随机和的均值"),
        explanation: t(
          "Let $N$ be a count and $X_1, X_2, \\ldots$ independent copies of $X$, independent of $N$. Conditioning on $N$ gives $E[S \\mid N = n] = nE[X]$ for $S = X_1 + \\cdots + X_N$, and averaging over $N$:\n\n$$E[S] = E\\big[E[S \\mid N]\\big] = E[N]\\,E[X].$$\n\nIf a shop gets on average $12$ customers an hour who each spend on average $\\$5$, expected hourly takings are $\\$60$.",
          "设 $N$ 为计数，$X_1, X_2, \\ldots$ 为 $X$ 的独立副本，且与 $N$ 独立。对 $N$ 取条件，$S = X_1 + \\cdots + X_N$ 满足 $E[S \\mid N = n] = nE[X]$，再对 $N$ 求平均：\n\n$$E[S] = E\\big[E[S \\mid N]\\big] = E[N]\\,E[X].$$\n\n若一家店平均每小时 $12$ 位顾客，每人平均消费 $5$ 元，则每小时期望营业额为 $60$ 元。",
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
            wrong: [mid.mul(ex), Q.of(ns[1] ?? 0).mul(ex), en].filter((v) => !v.eq(ans)),
            solution: t(
              `$E[N] = ${ns[0]} \\cdot \\frac{${pn}}{${pd}} + ${ns[1]} \\cdot \\frac{${pd - pn}}{${pd}} = ${en.toLatex()}$, so $E[S] = E[N]E[X] = ${en.toLatex()} \\cdot ${ex.toLatex()} = ${ans.toLatex()}$.`,
              `$E[N] = ${ns[0]} \\cdot \\frac{${pn}}{${pd}} + ${ns[1]} \\cdot \\frac{${pd - pn}}{${pd}} = ${en.toLatex()}$，所以 $E[S] = E[N]E[X] = ${en.toLatex()} \\cdot ${ex.toLatex()} = ${ans.toLatex()}$。`,
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
    prerequisites: ["computing-expected-values-from-joint-distributions"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-covariance-formula",
        title: t("Computing covariance from expectations", "根据期望值计算协方差"),
        explanation: t(
          "Covariance measures whether two variables tend to be above their means together, and the shortcut is the mean of the product minus the product of the means. $\\operatorname{Cov}(X, Y) = E[XY] - E[X] \\, E[Y]$.",
          "协方差衡量两个变量是否倾向于同时高于各自的均值，简便公式是乘积的均值减去均值的乘积。$\\operatorname{Cov}(X, Y) = E[XY] - E[X] \\, E[Y]$。",
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
            wrong: [eXY, eXY + eX * eY, eX * eY - eXY],
            solution: t(
              `$\\text{Cov}(X, Y) = E[XY] - E[X] E[Y] = ${eXY} - (${eX})(${eY}) = ${eXY} - ${eX * eY} = ${cov}$.`,
              `$\\text{Cov}(X, Y) = E[XY] - E[X] E[Y] = ${eXY} - (${eX})(${eY}) = ${eXY} - ${eX * eY} = ${cov}$。`,
            ),
          });
        },
      },
      {
        id: "covariance-of-two-indicators",
        title: t("Covariance of two indicators", "两个示性变量的协方差"),
        explanation: t(
          "For indicators $X, Y \\in \\{0, 1\\}$, $XY = 1$ only when both are $1$, so $E[XY] = P(X = 1, Y = 1)$ and\n\n$$\\operatorname{Cov}(X, Y) = P(X = 1, Y = 1) - P(X = 1)\\,P(Y = 1).$$\n\nThe sign tells whether the two events happen together more often than independence would predict (positive) or less often (negative).",
          "对示性变量 $X, Y \\in \\{0, 1\\}$，只有两者都为 $1$ 时 $XY = 1$，所以 $E[XY] = P(X = 1, Y = 1)$，并且\n\n$$\\operatorname{Cov}(X, Y) = P(X = 1, Y = 1) - P(X = 1)\\,P(Y = 1).$$\n\n符号说明两个事件同时发生的频率比独立时预期的更高（正）还是更低（负）。",
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
            wrong: [p11, px.mul(py).sub(p11), px.mul(py)].filter((v) => !v.eq(ans)),
            solution: t(
              `$E[XY] = P(1, 1) = ${p11.toLatex()}$, $P(X = 1) = ${px.toLatex()}$, $P(Y = 1) = ${py.toLatex()}$, so $\\operatorname{Cov} = ${p11.toLatex()} - ${px.toLatex()} \\cdot ${py.toLatex()} = ${ans.toLatex()}$.`,
              `$E[XY] = P(1, 1) = ${p11.toLatex()}$，$P(X = 1) = ${px.toLatex()}$，$P(Y = 1) = ${py.toLatex()}$，所以 $\\operatorname{Cov} = ${p11.toLatex()} - ${px.toLatex()} \\cdot ${py.toLatex()} = ${ans.toLatex()}$。`,
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
    prerequisites: ["the-covariance-of-two-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-variance-with-covariance",
        title: t("Computing variance of a sum using the covariance term", "利用协方差项计算随机变量和的方差"),
        explanation: t(
          "When variables are dependent, the variance of a sum includes twice their covariance, which adds spread when they move together. $\\operatorname{Var}(X + Y) = \\operatorname{Var}(X) + \\operatorname{Var}(Y) + 2\\operatorname{Cov}(X, Y)$.",
          "当变量相关时，和的方差包含两倍的协方差，它们同向变动时会增大分散程度。$\\operatorname{Var}(X + Y) = \\operatorname{Var}(X) + \\operatorname{Var}(Y) + 2\\operatorname{Cov}(X, Y)$。",
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
            wrong: [vx + vy, vx + vy + cov, vx + vy - 2 * cov],
            solution: t(
              `$\\text{Var}(X + Y) = \\text{Var}(X) + \\text{Var}(Y) + 2\\text{Cov}(X, Y) = ${vx} + ${vy} + 2(${cov}) = ${totalVar}$.`,
              `$\\text{Var}(X + Y) = \\text{Var}(X) + \\text{Var}(Y) + 2\\text{Cov}(X, Y) = ${vx} + ${vy} + 2(${cov}) = ${totalVar}$。`,
            ),
          });
        },
      },
      {
        id: "the-variance-of-a-weighted-difference",
        title: t("The variance of a weighted difference", "加权差的方差"),
        explanation: t(
          "Expanding the square in the definition of variance gives, for any constants $a$ and $b$,\n\n$$\\operatorname{Var}(aX - bY) = a^{2}\\operatorname{Var}(X) + b^{2}\\operatorname{Var}(Y) - 2ab\\operatorname{Cov}(X, Y).$$\n\nThe minus sign flips the covariance term: two positively related variables partly cancel in a difference, so the difference varies less than if they were independent.",
          "展开方差定义中的平方，对任意常数 $a$ 与 $b$ 有\n\n$$\\operatorname{Var}(aX - bY) = a^{2}\\operatorname{Var}(X) + b^{2}\\operatorname{Var}(Y) - 2ab\\operatorname{Cov}(X, Y).$$\n\n减号使协方差项变号：正相关的两个变量在差中部分抵消，因此差的波动比独立时小。",
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
            wrong: [a * a * vx + b * b * vy + 2 * a * b * c, a * a * vx + b * b * vy, a * a * vx - b * b * vy - 2 * a * b * c].filter(
              (w) => w !== ans,
            ),
            solution: t(
              `$${a * a} \\cdot ${vx} + ${b * b} \\cdot ${vy} - 2 \\cdot ${a} \\cdot ${b} \\cdot ${par(Q.of(c))} = ${a * a * vx} + ${b * b * vy} ${2 * a * b * c < 0 ? "+" : "-"} ${Math.abs(2 * a * b * c)} = ${ans}$.`,
              `$${a * a} \\cdot ${vx} + ${b * b} \\cdot ${vy} - 2 \\cdot ${a} \\cdot ${b} \\cdot ${par(Q.of(c))} = ${a * a * vx} + ${b * b * vy} ${2 * a * b * c < 0 ? "+" : "-"} ${Math.abs(2 * a * b * c)} = ${ans}$。`,
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
    prerequisites: ["the-covariance-of-two-random-variables"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "covariance-matrix-symmetry-and-entries",
        title: t("Identifying diagonal and off-diagonal entries of covariance matrix", "识别协方差矩阵的对角与非对角元素"),
        explanation: t(
          "The covariance of a variable with itself is its variance, and covariance does not depend on order, so the matrix is symmetric. The diagonal holds the variances $\\operatorname{Var}(X_i)$, and the off-diagonal entries are $\\operatorname{Cov}(X_i, X_j) = \\operatorname{Cov}(X_j, X_i)$.",
          "变量与自身的协方差就是它的方差，而协方差与顺序无关，所以这个矩阵是对称的。对角元为方差 $\\operatorname{Var}(X_i)$，非对角元为协方差 $\\operatorname{Cov}(X_i, X_j) = \\operatorname{Cov}(X_j, X_i)$。",
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
            wrong: [v1 + v2 + 2 * cov, v1 * v2 - cov * cov, v1 + v2 + cov],
            solution: t(
              `The trace is the sum of diagonal entries, which represent the variances of the individual variables: $\\text{tr}(\\Sigma) = ${v1} + ${v2} = ${v1 + v2}$.`,
              `矩阵的迹是对角线元素之和，对应每个变量的方差之和：$\\text{tr}(\\Sigma) = ${v1} + ${v2} = ${v1 + v2}$。`,
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
          "For a random vector $\\mathbf{X}$ with covariance matrix $\\Sigma$ and a constant vector $\\mathbf{a}$,\n\n$$\\operatorname{Var}(\\mathbf{a}^{\\mathsf{T}}\\mathbf{X}) = \\mathbf{a}^{\\mathsf{T}}\\Sigma\\,\\mathbf{a} = \\sum_i\\sum_j a_i a_j\\Sigma_{ij}.$$\n\nIn two dimensions this is $a_1^{2}\\Sigma_{11} + 2a_1a_2\\Sigma_{12} + a_2^{2}\\Sigma_{22}$: each off-diagonal entry is counted twice, once as $\\Sigma_{12}$ and once as $\\Sigma_{21}$.",
          "对协方差矩阵为 $\\Sigma$ 的随机向量 $\\mathbf{X}$ 与常向量 $\\mathbf{a}$，\n\n$$\\operatorname{Var}(\\mathbf{a}^{\\mathsf{T}}\\mathbf{X}) = \\mathbf{a}^{\\mathsf{T}}\\Sigma\\,\\mathbf{a} = \\sum_i\\sum_j a_i a_j\\Sigma_{ij}.$$\n\n二维时为 $a_1^{2}\\Sigma_{11} + 2a_1a_2\\Sigma_{12} + a_2^{2}\\Sigma_{22}$：每个非对角元计入两次，一次作为 $\\Sigma_{12}$，一次作为 $\\Sigma_{21}$。",
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
            wrong: [
              a1 * a1 * s11 + a1 * a2 * s12 + a2 * a2 * s22,
              a1 * a1 * s11 + a2 * a2 * s22,
              a1 * s11 + 2 * a1 * a2 * s12 + a2 * s22,
            ].filter((w) => w !== ans),
            solution: t(
              `$\\mathbf{a}^{\\mathsf{T}}\\Sigma\\mathbf{a} = ${a1 * a1} \\cdot ${s11} + 2 \\cdot ${par(Q.of(a1))} \\cdot ${par(Q.of(a2))} \\cdot ${par(Q.of(s12))} + ${a2 * a2} \\cdot ${s22} = ${a1 * a1 * s11} + ${par(Q.of(2 * a1 * a2 * s12))} + ${a2 * a2 * s22} = ${ans}$.`,
              `$\\mathbf{a}^{\\mathsf{T}}\\Sigma\\mathbf{a} = ${a1 * a1} \\cdot ${s11} + 2 \\cdot ${par(Q.of(a1))} \\cdot ${par(Q.of(a2))} \\cdot ${par(Q.of(s12))} + ${a2 * a2} \\cdot ${s22} = ${a1 * a1 * s11} + ${par(Q.of(2 * a1 * a2 * s12))} + ${a2 * a2 * s22} = ${ans}$。`,
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
    prerequisites: ["the-covariance-of-two-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "computing-correlation-coefficient",
        title: t("Evaluating the correlation coefficient from covariance and standard deviations", "根据协方差与标准差计算相关系数"),
        explanation: t(
          "Dividing the covariance by both standard deviations removes the units, giving a number between minus one and one that measures linear association. $\\rho(X, Y) = \\frac{\\operatorname{Cov}(X, Y)}{\\sigma_X \\sigma_Y}$.",
          "把协方差除以两个标准差就去掉了单位，得到一个介于 −1 和 1 之间、衡量线性关联程度的数。$\\rho(X, Y) = \\frac{\\operatorname{Cov}(X, Y)}{\\sigma_X \\sigma_Y}$。",
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
            wrong: [Q.of(cov, sx * sx * sy * sy), Q.of(cov, sx + sy), Q.of(cov, sx * sy * sy)],
            solution: t(
              `$\\rho(X, Y) = \\frac{\\text{Cov}(X, Y)}{\\sigma_X \\sigma_Y} = \\frac{${cov}}{(${sx})(${sy})} = \\frac{${cov}}{${sx * sy}}${lowestTerms(cov, sx * sy)}$.`,
              `$\\rho(X, Y) = \\frac{\\text{Cov}(X, Y)}{\\sigma_X \\sigma_Y} = \\frac{${cov}}{(${sx})(${sy})} = \\frac{${cov}}{${sx * sy}}${lowestTerms(cov, sx * sy)}$。`,
            ),
          });
        },
      },
      {
        id: "the-variance-of-a-sum-from-the-correlation",
        title: t("The variance of a sum from the correlation", "由相关系数求和的方差"),
        explanation: t(
          "Since $\\operatorname{Cov}(X, Y) = \\rho\\,\\sigma_X\\sigma_Y$, the variance of a sum can be written with the correlation:\n\n$$\\operatorname{Var}(X + Y) = \\sigma_X^{2} + \\sigma_Y^{2} + 2\\rho\\,\\sigma_X\\sigma_Y.$$\n\nWith $\\sigma_X = 3$, $\\sigma_Y = 4$ and $\\rho = \\frac{1}{2}$: $9 + 16 + 12 = 37$. At $\\rho = 0$ it is $25$, and at $\\rho = -1$ it is $(4 - 3)^{2} = 1$.",
          "由于 $\\operatorname{Cov}(X, Y) = \\rho\\,\\sigma_X\\sigma_Y$，和的方差可以用相关系数表示：\n\n$$\\operatorname{Var}(X + Y) = \\sigma_X^{2} + \\sigma_Y^{2} + 2\\rho\\,\\sigma_X\\sigma_Y.$$\n\n若 $\\sigma_X = 3$，$\\sigma_Y = 4$，$\\rho = \\frac{1}{2}$：$9 + 16 + 12 = 37$。$\\rho = 0$ 时为 $25$，$\\rho = -1$ 时为 $(4 - 3)^{2} = 1$。",
        ),
        generate: (rng: Rng): Problem => {
          const sx = rng.int(1, 8);
          const sy = rng.int(1, 8);
          const rho = rng.pick([Q.of(1, 2), Q.of(-1, 2), Q.of(1, 4), Q.of(-1, 4), Q.of(3, 4), Q.of(-3, 4), Q.of(1, 5), Q.of(-2, 5)]);
          const cov = rho.mul(Q.of(sx * sy));
          const base = Q.of(sx * sx + sy * sy);
          const ans = base.add(cov.mul(Q.of(2)));
          return numberProblem({
            prompt: t(
              `$X$ has standard deviation $${sx}$, $Y$ has standard deviation $${sy}$ and their correlation is $\\rho = ${rho.toLatex()}$. Find $\\operatorname{Var}(X + Y)$.`,
              `$X$ 的标准差为 $${sx}$，$Y$ 的标准差为 $${sy}$，两者的相关系数为 $\\rho = ${rho.toLatex()}$。求 $\\operatorname{Var}(X + Y)$。`,
            ),
            answer: ans,
            wrong: [base.add(cov), base, Q.of(sx + sy).add(rho.mul(Q.of(2 * sx * sy)))].filter((v) => !v.eq(ans)),
            solution: t(
              `$\\operatorname{Cov}(X, Y) = ${rho.toLatex()} \\cdot ${sx} \\cdot ${sy} = ${cov.toLatex()}$, so $\\operatorname{Var}(X + Y) = ${sx * sx} + ${sy * sy} + 2 \\cdot ${par(cov)} = ${ans.toLatex()}$.`,
              `$\\operatorname{Cov}(X, Y) = ${rho.toLatex()} \\cdot ${sx} \\cdot ${sy} = ${cov.toLatex()}$，所以 $\\operatorname{Var}(X + Y) = ${sx * sx} + ${sy * sy} + 2 \\cdot ${par(cov)} = ${ans.toLatex()}$。`,
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
    prerequisites: ["the-covariance-matrix"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "sample-covariance-divisor",
        title: t("Understanding the Bessel correction divisor n - 1 for sample covariance", "理解样本协方差的贝塞尔校正除数 n - 1"),
        explanation: t(
          "As with the sample variance, using the sample means uses up one degree of freedom, so dividing by one less than the sample size removes the bias. Unbiased sample covariance divides by degrees of freedom n - 1, not n.",
          "与样本方差一样，使用样本均值会用掉一个自由度，所以除以样本量减 1 可以消除偏差。为保证无偏性，样本协方差除以自由度 n - 1，而非样本容量 n。",
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

          return choiceProblem({
            prompt: t(
              `When calculating the unbiased sample covariance matrix $S$ from a multivariate sample of size $n = ${n}$, what divisor is used in the formula $S = \\frac{1}{d} \\sum_{i=1}^{n} (\\mathbf{x}_i - \\bar{\\mathbf{x}})(\\mathbf{x}_i - \\bar{\\mathbf{x}})^T$?`,
              `当根据样本容量为 $n = ${n}$ 的多元样本计算无偏样本协方差矩阵 $S$ 时，公式 $S = \\frac{1}{d} \\sum_{i=1}^{n} (\\mathbf{x}_i - \\bar{\\mathbf{x}})(\\mathbf{x}_i - \\bar{\\mathbf{x}})^T$ 中的除数 $d$ 是什么？`,
            ),
            options,
            correct,
            solution: t(
              `To ensure the estimator is unbiased, Bessel's correction uses degrees of freedom $d = n - 1 = ${n} - 1 = ${n - 1}$.`,
              `为保证估计量的无偏性，贝塞尔校正采用自由度 $d = n - 1 = ${n} - 1 = ${n - 1}$。`,
            ),
          });
        },
      },
      {
        id: "the-off-diagonal-entry-of-a-sample-covariance-matrix",
        title: t("The off-diagonal entry of a sample covariance matrix", "样本协方差矩阵的非对角元"),
        explanation: t(
          "The off-diagonal entry of the sample covariance matrix is the sample covariance\n\n$$s_{xy} = \\frac{1}{n - 1}\\sum_{i=1}^{n}(x_i - \\bar{x})(y_i - \\bar{y}).$$\n\nSubtract the means, multiply the deviations pair by pair, add, and divide by $n - 1$ (not $n$), as for the sample variances on the diagonal.",
          "样本协方差矩阵的非对角元是样本协方差\n\n$$s_{xy} = \\frac{1}{n - 1}\\sum_{i=1}^{n}(x_i - \\bar{x})(y_i - \\bar{y}).$$\n\n减去均值，逐对相乘偏差，相加，再除以 $n - 1$（不是 $n$），与对角线上的样本方差一样。",
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
          return numberProblem({
            prompt: t(
              `Find the sample covariance $s_{xy}$, the off-diagonal entry of the sample covariance matrix, for the data $${pts}$.`,
              `求数据 $${pts}$ 的样本协方差 $s_{xy}$，即样本协方差矩阵的非对角元。`,
            ),
            answer: ans,
            wrong: [Q.of(sp, n), Q.of(sp), Q.of(sp + 1, n - 1)].filter((v) => !v.eq(ans)),
            solution: t(
              `$\\bar{x} = ${mx}$ and $\\bar{y} = ${my}$. The deviation products add to $${dx.map((v, i) => `${par(Q.of(v))} \\cdot ${par(Q.of(dy[i] ?? 0))}`).join(" + ")} = ${sp}$, so $s_{xy} = \\frac{${sp}}{${n - 1}}${lowestTerms(sp, n - 1)}$.`,
              `$\\bar{x} = ${mx}$，$\\bar{y} = ${my}$。偏差乘积之和为 $${dx.map((v, i) => `${par(Q.of(v))} \\cdot ${par(Q.of(dy[i] ?? 0))}`).join(" + ")} = ${sp}$，所以 $s_{xy} = \\frac{${sp}}{${n - 1}}${lowestTerms(sp, n - 1)}$。`,
            ),
          });
        },
      },
    ],
  },
];
