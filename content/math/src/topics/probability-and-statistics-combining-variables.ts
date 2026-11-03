import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import { choiceProblem, lowestTerms, numberProblem } from "../problems.ts";

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
          "The joint cumulative distribution function at a point is the total probability of the lower left corner of the table, where both variables are at most the given values. Sum p(u, v) for all pairs (u, v) with u ≤ x and v ≤ y.",
          "联合累积分布函数在一点的值是表格左下角部分的总概率，即两个变量都不超过给定值的部分。将所有满足 u ≤ x 且 v ≤ y 的点 (u, v) 处的联合概率 p(u, v) 求和。",
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
          "If the joint density splits into a function of one variable times a function of the other on a rectangle, the variables carry no information about each other. If f(x, y) = g(x) h(y) on a product domain [a, b] x [c, d], then X and Y are independent.",
          "如果在矩形区域上联合密度可以分解为一个变量的函数乘以另一个变量的函数，那么两个变量彼此不提供任何信息。若在笛卡尔积区间 [a, b] x [c, d] 上 f(x, y) = g(x) h(y)，则 X 与 Y 相互独立。",
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
          "Subtracting the two strips removes their overlap twice, so the corner region must be added back once, as in inclusion and exclusion. P(a < X ≤ b, c < Y ≤ d) = F(b, d) - F(a, d) - F(b, c) + F(a, c).",
          "减去两个条带时它们的重叠部分被减了两次，所以要把角上的区域加回一次，这与容斥原理一样。P(a < X ≤ b, c < Y ≤ d) = F(b, d) - F(a, d) - F(b, c) + F(a, c)。",
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
          "You can average a function of two variables directly against their joint density, without first working out the distribution of the function itself. E[g(X, Y)] = ∬ g(x, y) f(x, y) dy dx eliminates the need to determine the density of g(X, Y).",
          "可以直接用联合密度对两个变量的函数求平均，而不必先求出这个函数本身的分布。E[g(X, Y)] = ∬ g(x, y) f(x, y) dy dx 免除了求解 g(X, Y) 本身概率密度的繁琐步骤。",
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
    ],
  },
];
