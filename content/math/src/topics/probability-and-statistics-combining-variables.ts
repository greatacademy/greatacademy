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
      "The joint cumulative distribution function F_{X,Y}(x, y) = P(X ≤ x, Y ≤ y) sums the joint probabilities p(u, v) over u ≤ x and v ≤ y.",
      "两个离散型随机变量的联合累积分布函数 F_{X,Y}(x, y) = P(X ≤ x, Y ≤ y) 为所有满足 u ≤ x 且 v ≤ y 的联合概率 p(u, v) 之和。",
    ),
    prerequisites: ["joint-distributions-for-discrete-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-joint-discrete-cdf",
        title: t("Evaluating the joint CDF from a probability mass table", "根据概率质量表计算联合累积分布函数值"),
        explanation: t(
          "Sum p(u, v) for all pairs (u, v) with u ≤ x and v ≤ y.",
          "将所有满足 u ≤ x 且 v ≤ y 的点 (u, v) 处的联合概率 p(u, v) 求和。",
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
      "The marginal PMF of X is obtained by summing the joint PMF over all possible values of Y: p_X(x) = ∑_y p(x, y).",
      "通过对 Y 的所有可能取值求和得到 X 的边际概率分布律：p_X(x) = ∑_y p(x, y)。",
    ),
    prerequisites: ["joint-distributions-for-discrete-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "calculating-discrete-marginal-pmf",
        title: t("Summing rows to compute marginal probabilities", "通过行或列求和计算边际概率"),
        explanation: t(
          "The marginal pmf $p_X(x) = \\sum_y p(x, y)$ sums the joint probabilities over all $y$.",
          "边际分布律 $p_X(x) = \\sum_y p(x, y)$ 是对所有 $y$ 的联合概率求和。",
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
      "Two discrete random variables X and Y are independent if and only if p(x, y) = p_X(x) p_Y(y) for all values x and y.",
      "两个离散型随机变量 X 与 Y 相互独立，当且仅当对所有 x 和 y 均满足 p(x, y) = p_X(x) p_Y(y)。",
    ),
    prerequisites: ["marginal-distributions-for-discrete-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "discrete-independence-product-rule",
        title: t("Checking independence via joint and marginal products", "通过联合与边际概率乘积验证独立性"),
        explanation: t("Under independence, P(X = x, Y = y) = P(X = x) P(Y = y).", "在独立性下，P(X = x, Y = y) = P(X = x) P(Y = y)。"),
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
      "The conditional PMF of Y given X = x is p_{Y|X}(y|x) = p(x, y) / p_X(x) for all x where p_X(x) > 0.",
      "在 X = x 的条件下，Y 的条件分布律定义为 p_{Y|X}(y|x) = p(x, y) / p_X(x)（要求 p_X(x) > 0）。",
    ),
    prerequisites: ["marginal-distributions-for-discrete-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-discrete-conditional-pmf",
        title: t("Computing conditional PMF values", "计算条件概率分布律取值"),
        explanation: t("P(Y = y | X = x) = P(X = x, Y = y) / P(X = x).", "P(Y = y | X = x) = P(X = x, Y = y) / P(X = x)。"),
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
      "The trinomial distribution models the counts of three mutually exclusive outcomes across n independent trials: P(X=x, Y=y) = n!/(x! y! z!) p1^x p2^y p3^z where z = n - x - y.",
      "三项分布对 n 次独立试验中三种互斥结果的发生频数进行建模：P(X=x, Y=y) = n!/(x! y! z!) p1^x p2^y p3^z，其中 z = n - x - y。",
    ),
    prerequisites: ["the-binomial-distribution", "joint-distributions-for-discrete-random-variables"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "trinomial-coefficient-evaluation",
        title: t("Computing the trinomial coefficient n! / (x! y! z!)", "计算三项式系数 n! / (x! y! z!)"),
        explanation: t(
          "The number of ways to divide n items into groups of sizes x, y, z is n! / (x! y! z!).",
          "将 n 个不同物品分成大小为 x, y, z 的三组的方法数为多项式系数 n! / (x! y! z!)。",
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
      "The multinomial distribution generalizes the binomial distribution to k mutually exclusive categories across n trials: P(X_1=x_1, ..., X_k=x_k) = (n! / ∏ x_i!) ∏ p_i^{x_i}.",
      "多项分布将二项分布推广至具有 k 个互斥类别的 n 次独立试验中：P(X_1=x_1, ..., X_k=x_k) = (n! / ∏ x_i!) ∏ p_i^{x_i}。",
    ),
    prerequisites: ["the-trinomial-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "multinomial-marginal-binomial",
        title: t("Recognizing that each marginal of a multinomial distribution is binomial", "多项分布的每个边际分布均为二项分布"),
        explanation: t(
          "For $(X_1, \\dots, X_k) \\sim \\text{Multinomial}(n, p_1, \\dots, p_k)$, each component $X_i$ follows $\\text{Binomial}(n, p_i)$.",
          "若 $(X_1, \\dots, X_k) \\sim \\text{Multinomial}(n, p_1, \\dots, p_k)$，则每个分量 $X_i$ 均服从二项分布 $\\text{Binomial}(n, p_i)$。",
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
      "For continuous random variables with joint density f(x, y), marginal densities are obtained by integrating: f_X(x) = ∫ f(x, y) dy and f_Y(y) = ∫ f(x, y) dx.",
      "连续型随机变量的边际概率密度通过定积分求得：f_X(x) = ∫ f(x, y) dy 及 f_Y(y) = ∫ f(x, y) dx。",
    ),
    prerequisites: ["joint-distributions-for-continuous-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "integrating-marginal-density-constant",
        title: t("Evaluating marginal density coefficients", "计算边际密度函数的系数"),
        explanation: t(
          "For $f(x, y) = c(x + y)$ on $[0, 1] \\times [0, 1]$, $f_X(x) = c\\left(x + \\frac{1}{2}\\right)$.",
          "对于 $[0, 1] \\times [0, 1]$ 上的 $f(x, y) = c(x + y)$，边际密度为 $f_X(x) = c\\left(x + \\frac{1}{2}\\right)$。",
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
      "Continuous random variables X and Y are independent if and only if their joint PDF factors into the product of marginal PDFs: f(x, y) = f_X(x) f_Y(y) on the entire Cartesian product domain.",
      "连续型随机变量 X 与 Y 相互独立，当且仅当其联合概率密度函数在笛卡尔积域上可分解为边际概率密度的乘积：f(x, y) = f_X(x) f_Y(y)。",
    ),
    prerequisites: ["marginal-distributions-for-continuous-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "continuous-independence-factorization",
        title: t("Testing independence by factorability of joint PDF", "根据联合密度的可乘积分解检验独立性"),
        explanation: t(
          "If f(x, y) = g(x) h(y) on a product domain [a, b] x [c, d], then X and Y are independent.",
          "若在笛卡尔积区间 [a, b] x [c, d] 上 f(x, y) = g(x) h(y)，则 X 与 Y 相互独立。",
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
      "The conditional PDF of Y given X = x is f_{Y|X}(y|x) = f(x, y) / f_X(x) for points where f_X(x) > 0.",
      "在给定 X = x 的条件下，Y 的条件概率密度函数定义为 f_{Y|X}(y|x) = f(x, y) / f_X(x)（要求 f_X(x) > 0）。",
    ),
    prerequisites: ["marginal-distributions-for-continuous-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-conditional-density",
        title: t("Evaluating the conditional density at a given value", "计算给定条件下的条件概率密度值"),
        explanation: t(
          "The conditional density is $f_{Y \\mid X}(y \\mid x) = \\frac{f(x, y)}{f_X(x)}$.",
          "条件密度为 $f_{Y \\mid X}(y \\mid x) = \\frac{f(x, y)}{f_X(x)}$。",
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
      "For continuous random variables, F_{X,Y}(x, y) = ∫_{-∞}^x ∫_{-∞}^y f(u, v) dv du and f(x, y) = ∂^2 F / ∂x ∂y.",
      "对连续型随机变量，联合累积分布函数为 F_{X,Y}(x, y) = ∫_{-∞}^x ∫_{-∞}^y f(u, v) dv du，且满足 f(x, y) = ∂^2 F / ∂x ∂y。",
    ),
    prerequisites: ["joint-distributions-for-continuous-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-joint-continuous-cdf",
        title: t("Evaluating double integral of joint density for CDF", "通过联合密度的二重积分计算累积分布函数值"),
        explanation: t(
          "The joint CDF is $F(x, y) = P(X \\le x, Y \\le y) = \\int_{-\\infty}^x \\int_{-\\infty}^y f(u, v) \\, dv \\, du$.",
          "联合分布函数为 $F(x, y) = P(X \\le x, Y \\le y) = \\int_{-\\infty}^x \\int_{-\\infty}^y f(u, v) \\, dv \\, du$。",
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
      "A valid joint CDF satisfies 0 ≤ F(x, y) ≤ 1, non-decreasing in each argument, limits F(∞, ∞) = 1, F(-∞, y) = F(x, -∞) = 0, and rectangular non-negativity Δ_{a,b}^{c,d} F ≥ 0.",
      "合法的联合累积分布函数满足 0 ≤ F(x, y) ≤ 1，对每个自变量单调非减，极限满足 F(∞, ∞) = 1，F(-∞, y) = F(x, -∞) = 0，以及矩形非负性 Δ_{a,b}^{c,d} F ≥ 0。",
    ),
    prerequisites: ["the-joint-cdf-of-two-continuous-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "joint-cdf-rectangular-probability",
        title: t("Expressing rectangular probability in terms of the joint CDF", "用联合累积分布函数表示矩形区域上的概率"),
        explanation: t(
          "P(a < X ≤ b, c < Y ≤ d) = F(b, d) - F(a, d) - F(b, c) + F(a, c).",
          "P(a < X ≤ b, c < Y ≤ d) = F(b, d) - F(a, d) - F(b, c) + F(a, c)。",
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
      "The bivariate normal distribution N(μ_X, μ_Y, σ_X^2, σ_Y^2, ρ) is completely characterized by five parameters, with elliptical contours of constant density.",
      "二元正态分布 N(μ_X, μ_Y, σ_X^2, σ_Y^2, ρ) 完全由五个参数决定，其等密度线呈椭圆族。",
    ),
    prerequisites: ["the-normal-distribution", "marginal-distributions-for-continuous-random-variables"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "bivariate-normal-zero-correlation-independence",
        title: t("Zero correlation implies independence for bivariate normal variables", "二元正态变量零相关即独立"),
        explanation: t(
          "For jointly normal random variables, $\\operatorname{Cov}(X, Y) = 0$ (or $\\rho = 0$) is necessary and sufficient for independence.",
          "对于联合正态随机变量，$\\operatorname{Cov}(X, Y) = 0$（或 $\\rho = 0$）是两者相互独立的充要条件。",
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
          "If $X \\sim \\text{Binomial}(n_1, p)$ and $Y \\sim \\text{Binomial}(n_2, p)$ are independent, then $X + Y \\sim \\text{Binomial}(n_1 + n_2, p)$.",
          "若 $X \\sim \\text{Binomial}(n_1, p)$ 与 $Y \\sim \\text{Binomial}(n_2, p)$ 相互独立，则 $X + Y \\sim \\text{Binomial}(n_1 + n_2, p)$。",
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
          "For independent $X \\sim \\text{Poisson}(\\lambda_1)$ and $Y \\sim \\text{Poisson}(\\lambda_2)$, $X + Y \\sim \\text{Poisson}(\\lambda_1 + \\lambda_2)$.",
          "若 $X \\sim \\text{Poisson}(\\lambda_1)$ 与 $Y \\sim \\text{Poisson}(\\lambda_2)$ 相互独立，则 $X + Y \\sim \\text{Poisson}(\\lambda_1 + \\lambda_2)$。",
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
      "Any linear combination of independent normal variables is normal: if X ~ N(μ1, σ1^2) and Y ~ N(μ2, σ2^2), then aX + bY ~ N(aμ1 + bμ2, a^2 σ1^2 + b^2 σ2^2).",
      "独立正态变量的任意线性组合仍为正态分布：若 X ~ N(μ1, σ1^2) 且 Y ~ N(μ2, σ2^2) 独立，则 aX + bY ~ N(aμ1 + bμ2, a^2 σ1^2 + b^2 σ2^2)。",
    ),
    prerequisites: ["the-normal-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "variance-of-two-normal-linear-combination",
        title: t("Variance of linear combination of two independent normals", "两个独立正态变量线性组合的方差"),
        explanation: t(
          "$\\operatorname{Var}(aX + bY) = a^2 \\operatorname{Var}(X) + b^2 \\operatorname{Var}(Y)$ when $X$ and $Y$ are independent.",
          "当 $X$ 与 $Y$ 独立时，$\\operatorname{Var}(aX + bY) = a^2 \\operatorname{Var}(X) + b^2 \\operatorname{Var}(Y)$。",
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
      "For independent normal variables X_i ~ N(μ_i, σ_i^2), the linear combination ∑ c_i X_i is normally distributed with mean ∑ c_i μ_i and variance ∑ c_i^2 σ_i^2.",
      "对于相互独立的正态随机变量 X_i ~ N(μ_i, σ_i^2)，其线性组合 ∑ c_i X_i 服从正态分布，其均值为 ∑ c_i μ_i，方差为 ∑ c_i^2 σ_i^2。",
    ),
    prerequisites: ["combining-two-normally-distributed-random-variables"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "mean-of-multiple-normal-combination",
        title: t("Mean of a general linear combination of normal variables", "多个正态变量一般线性组合的均值"),
        explanation: t(
          "Expectation is linear: $E\\left[\\sum_i c_i X_i\\right] = \\sum_i c_i E[X_i]$.",
          "期望是线性的：$E\\left[\\sum_i c_i X_i\\right] = \\sum_i c_i E[X_i]$。",
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
      "The sample mean X̄ of n i.i.d. N(μ, σ^2) variables is distributed as N(μ, σ^2 / n), and the sample sum S_n is distributed as N(nμ, nσ^2).",
      "n 个独立同分布 N(μ, σ^2) 随机变量的样本均值 X̄ 服从正态分布 N(μ, σ^2 / n)，样本总和 S_n 服从 N(nμ, nσ^2)。",
    ),
    prerequisites: ["combining-multiple-normally-distributed-random-variables"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "sample-mean-variance-iid-normal",
        title: t("Variance of the sample mean for i.i.d. normal variables", "独立同分布正态样本均值的方差"),
        explanation: t(
          "For $X_1, \\dots, X_n$ i.i.d. $N(\\mu, \\sigma^2)$, $\\operatorname{Var}(\\bar{X}) = \\frac{\\sigma^2}{n}$.",
          "对于独立同分布的 $X_1, \\dots, X_n \\sim N(\\mu, \\sigma^2)$，样本均值的方差为 $\\operatorname{Var}(\\bar{X}) = \\frac{\\sigma^2}{n}$。",
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
        explanation: t("If X and Y are independent, E[XY] = E[X] E[Y].", "若 X 与 Y 相互独立，则 E[XY] = E[X] E[Y]。"),
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
      "If X_1, ..., X_n are pairwise independent, Var(∑ X_i) = ∑ Var(X_i).",
      "若 X_1, ..., X_n 两两独立，则其和的方差等于各方差之和：Var(∑ X_i) = ∑ Var(X_i)。",
    ),
    prerequisites: ["expected-values-of-sums-and-products-of-random-variables", "properties-of-variance-for-discrete-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "sum-of-variances-independent",
        title: t("Computing variance of sum of independent variables", "计算独立随机变量和的方差"),
        explanation: t(
          "For independent variables, $\\operatorname{Var}(X + Y) = \\operatorname{Var}(X) + \\operatorname{Var}(Y)$.",
          "对于相互独立的变量，$\\operatorname{Var}(X + Y) = \\operatorname{Var}(X) + \\operatorname{Var}(Y)$。",
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
        explanation: t("$E[XY] = \\sum_x \\sum_y xy \\, p(x, y)$.", "$E[XY] = \\sum_x \\sum_y xy \\, p(x, y)$。"),
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
      "The conditional expectation of Y given X = x is the mean of Y under the conditional distribution: E[Y | X = x] = ∑_y y p_{Y|X}(y|x).",
      "在给定 X = x 的条件下，Y 的条件期望为 Y 在条件分布下的均值：E[Y | X = x] = ∑_y y p_{Y|X}(y|x)。",
    ),
    prerequisites: ["conditional-distributions-for-discrete-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-discrete-conditional-expectation",
        title: t("Calculating conditional expectation from conditional PMF", "根据条件概率质量函数计算条件期望"),
        explanation: t(
          "$E[Y \\mid X = x] = \\sum_y y \\, P(Y = y \\mid X = x)$.",
          "$E[Y \\mid X = x] = \\sum_y y \\, P(Y = y \\mid X = x)$。",
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
      "The conditional variance of Y given X = x is Var(Y | X = x) = E[Y^2 | X = x] - (E[Y | X = x])^2.",
      "在给定 X = x 条件下，Y 的条件方差为 Var(Y | X = x) = E[Y^2 | X = x] - (E[Y | X = x])^2。",
    ),
    prerequisites: ["conditional-expectation-for-discrete-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-conditional-variance-discrete",
        title: t("Computing conditional variance using moments", "利用条件矩计算条件方差"),
        explanation: t(
          "$\\operatorname{Var}(Y \\mid X = x) = E[Y^2 \\mid X = x] - (E[Y \\mid X = x])^2$.",
          "$\\operatorname{Var}(Y \\mid X = x) = E[Y^2 \\mid X = x] - (E[Y \\mid X = x])^2$。",
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
          "E[g(X, Y)] = ∬ g(x, y) f(x, y) dy dx eliminates the need to determine the density of g(X, Y).",
          "E[g(X, Y)] = ∬ g(x, y) f(x, y) dy dx 免除了求解 g(X, Y) 本身概率密度的繁琐步骤。",
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
      "The Law of Total Expectation (Adam's Law) states that E[Y] = E[E[Y|X]] = ∑_x E[Y|X=x] P(X=x).",
      "全期望公式（又称亚当法则）指出 E[Y] = E[E[Y|X]] = ∑_x E[Y|X=x] P(X=x)。",
    ),
    prerequisites: ["conditional-expectation-for-discrete-random-variables"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "evaluating-law-of-total-expectation",
        title: t("Computing overall mean via conditional expectations", "通过条件期望加权计算总体均值"),
        explanation: t(
          "By the law of total expectation, $E[Y] = \\sum_x E[Y \\mid X = x] \\, P(X = x)$.",
          "由全期望公式，$E[Y] = \\sum_x E[Y \\mid X = x] \\, P(X = x)$。",
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
      "The covariance of X and Y measures their joint linear variability: Cov(X, Y) = E[(X - μ_X)(Y - μ_Y)] = E[XY] - E[X] E[Y].",
      "随机变量 X 与 Y 的协方差度量它们之间的联合线性变化关系：Cov(X, Y) = E[(X - μ_X)(Y - μ_Y)] = E[XY] - E[X] E[Y]。",
    ),
    prerequisites: ["computing-expected-values-from-joint-distributions"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-covariance-formula",
        title: t("Computing covariance from expectations", "根据期望值计算协方差"),
        explanation: t("$\\operatorname{Cov}(X, Y) = E[XY] - E[X] \\, E[Y]$.", "$\\operatorname{Cov}(X, Y) = E[XY] - E[X] \\, E[Y]$。"),
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
      "For general (possibly dependent) random variables, Var(aX + bY) = a^2 Var(X) + b^2 Var(Y) + 2ab Cov(X, Y).",
      "对于一般（可能相关的）随机变量，Var(aX + bY) = a^2 Var(X) + b^2 Var(Y) + 2ab Cov(X, Y)。",
    ),
    prerequisites: ["the-covariance-of-two-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-variance-with-covariance",
        title: t("Computing variance of a sum using the covariance term", "利用协方差项计算随机变量和的方差"),
        explanation: t(
          "$\\operatorname{Var}(X + Y) = \\operatorname{Var}(X) + \\operatorname{Var}(Y) + 2\\operatorname{Cov}(X, Y)$.",
          "$\\operatorname{Var}(X + Y) = \\operatorname{Var}(X) + \\operatorname{Var}(Y) + 2\\operatorname{Cov}(X, Y)$。",
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
      "The covariance matrix Σ of a random vector X = (X_1, ..., X_p)^T is a symmetric, positive semidefinite p × p matrix with Σ_{ij} = Cov(X_i, X_j) and diagonal entries Var(X_i).",
      "随机向量 X = (X_1, ..., X_p)^T 的协方差矩阵 Σ 是一个对称半正定 p × p 矩阵，满足 Σ_{ij} = Cov(X_i, X_j)，对角元为各自的方差 Var(X_i)。",
    ),
    prerequisites: ["the-covariance-of-two-random-variables"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "covariance-matrix-symmetry-and-entries",
        title: t("Identifying diagonal and off-diagonal entries of covariance matrix", "识别协方差矩阵的对角与非对角元素"),
        explanation: t(
          "The diagonal holds the variances $\\operatorname{Var}(X_i)$, and the off-diagonal entries are $\\operatorname{Cov}(X_i, X_j) = \\operatorname{Cov}(X_j, X_i)$.",
          "对角元为方差 $\\operatorname{Var}(X_i)$，非对角元为协方差 $\\operatorname{Cov}(X_i, X_j) = \\operatorname{Cov}(X_j, X_i)$。",
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
      "The Pearson correlation coefficient ρ = Cov(X, Y) / (σ_X σ_Y) standardizes covariance to the range [-1, 1], measuring the strength and direction of linear relationship.",
      "皮尔逊相关系数 ρ = Cov(X, Y) / (σ_X σ_Y) 将协方差标准化至区间 [-1, 1]，度量变量间线性关系的强度与方向。",
    ),
    prerequisites: ["the-covariance-of-two-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "computing-correlation-coefficient",
        title: t("Evaluating the correlation coefficient from covariance and standard deviations", "根据协方差与标准差计算相关系数"),
        explanation: t(
          "$\\rho(X, Y) = \\frac{\\operatorname{Cov}(X, Y)}{\\sigma_X \\sigma_Y}$.",
          "$\\rho(X, Y) = \\frac{\\operatorname{Cov}(X, Y)}{\\sigma_X \\sigma_Y}$。",
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
      "The sample covariance matrix S = (1/(n-1)) ∑_{i=1}^n (x_i - x̄)(x_i - x̄)^T provides an unbiased estimator of the population covariance matrix Σ.",
      "样本协方差矩阵 S = (1/(n-1)) ∑_{i=1}^n (x_i - x̄)(x_i - x̄)^T 是总体协方差矩阵 Σ 的无偏估计量。",
    ),
    prerequisites: ["the-covariance-matrix"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "sample-covariance-divisor",
        title: t("Understanding the Bessel correction divisor n - 1 for sample covariance", "理解样本协方差的贝塞尔校正除数 n - 1"),
        explanation: t(
          "Unbiased sample covariance divides by degrees of freedom n - 1, not n.",
          "为保证无偏性，样本协方差除以自由度 n - 1，而非样本容量 n。",
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
