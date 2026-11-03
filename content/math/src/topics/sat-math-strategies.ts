import type { TopicDef } from "@ga/content";
import { t } from "@ga/content";

import { choiceProblem, numberProblem } from "../problems.ts";

/** satLinearSystemsUnknownConstants finds unknown coefficients in linear systems with special solution sets. */
export const satLinearSystemsUnknownConstants: TopicDef = {
  id: "sat-linear-systems-unknown-constants",
  title: t("Determining Unknown Parameters in Systems of Linear Equations", "确定线性方程组中的未知参数"),
  summary: t(
    "Determine unknown constants that result in a linear system having no solution or infinitely many solutions.",
    "求解使线性方程组无解或有无穷多解的未知常数。",
  ),
  prerequisites: ["systems-with-no-solution-or-infinitely-many-solutions"],
  encompasses: [],
  xp: 8,
  standards: ["CCSS.HSA.REI.C.6"],
  knowledgePoints: [
    {
      id: "sat-no-solution-constants",
      title: t("Finding Constants for No Solution", "求解使方程组无解的常数"),
      explanation: t(
        "A system of two linear equations has **no solution** when the two lines are parallel and distinct: they have the same slope but different $y$-intercepts.\n\nIn standard form, if $\\frac{A_1}{A_2} = \\frac{B_1}{B_2} \\neq \\frac{C_1}{C_2}$, the lines are parallel and never intersect.",
        "当两条直线平行且不重合时，二元一次方程组**无解**：两直线斜率相同但截距不同。\n\n在一般式中，若 $\\frac{A_1}{A_2} = \\frac{B_1}{B_2} \\neq \\frac{C_1}{C_2}$，则两直线平行且永不相交。",
      ),
      generate(rng) {
        const a = rng.int(2, 7);
        const b = rng.int(2, 8);
        const c = rng.int(3, 15);
        const multiplier = rng.int(2, 5);

        const scaledB = b * multiplier;
        const targetA = a * multiplier;
        const differentC = c * multiplier + rng.pick([-3, -2, 2, 3]);

        const prompt = t(
          `In the system of equations below, $k$ is a constant:\n$$\\begin{cases} ${a}x + ${b}y = ${c} \\\\ kx + ${scaledB}y = ${differentC} \\end{cases}$$\nIf the system has no solution, what is the value of $k$?`,
          `在以下方程组中，$k$ 为常数：\n$$\\begin{cases} ${a}x + ${b}y = ${c} \\\\ kx + ${scaledB}y = ${differentC} \\end{cases}$$\n如果该方程组无解，$k$ 的值是多少？`,
        );
        const solution = t(
          `For the system to have no solution, the lines must be parallel, so their coefficient ratios must match:\n$$\\frac{k}{${a}} = \\frac{${scaledB}}{${b}} = ${multiplier}$$\nTherefore, $k = ${a} \\times ${multiplier} = ${targetA}$. Since $${differentC} \\neq ${c} \\times ${multiplier}$, the lines are distinct and parallel.`,
          `若方程组无解，两直线必须平行，因此未知数系数的比值必须相等：\n$$\\frac{k}{${a}} = \\frac{${scaledB}}{${b}} = ${multiplier}$$\n因此 $k = ${a} \\times ${multiplier} = ${targetA}$。由于常数项 $${differentC} \\neq ${c} \\times ${multiplier}$，两直线不重合，方程组无解。`,
        );

        return numberProblem({
          prompt,
          answer: targetA,
          form: "integer",
          wrong: [targetA + multiplier, targetA - multiplier, scaledB],
          solution,
        });
      },
    },
    {
      id: "sat-infinitely-many-solutions-constants",
      title: t("Finding Constants for Infinitely Many Solutions", "求解使方程组有无穷多解的常数"),
      explanation: t(
        "A system of two linear equations has **infinitely many solutions** when both equations represent the same line: $\\frac{A_1}{A_2} = \\frac{B_1}{B_2} = \\frac{C_1}{C_2}$.",
        "当两个方程表示同一条重合直线时，二元一次方程组有**无穷多解**：$\\frac{A_1}{A_2} = \\frac{B_1}{B_2} = \\frac{C_1}{C_2}$。",
      ),
      generate(rng) {
        const a = rng.int(2, 6);
        const b = rng.int(3, 7);
        const c = rng.int(4, 12);
        const m = rng.int(2, 4);

        const scaledA = a * m;
        const scaledB = b * m;
        const targetC = c * m;

        const prompt = t(
          `In the system of equations below, $c$ is a constant:\n$$\\begin{cases} ${a}x + ${b}y = ${c} \\\\ ${scaledA}x + ${scaledB}y = c \\end{cases}$$\nIf the system has infinitely many solutions, what is the value of $c$?`,
          `在以下方程组中，$c$ 为常数：\n$$\\begin{cases} ${a}x + ${b}y = ${c} \\\\ ${scaledA}x + ${scaledB}y = c \\end{cases}$$\n如果该方程组有无穷多解，$c$ 的值是多少？`,
        );
        const solution = t(
          `For the system to have infinitely many solutions, the second equation must be a constant multiple of the first. The scale factor is $\\frac{${scaledA}}{${a}} = ${m}$. Therefore, $c = ${c} \\times ${m} = ${targetC}$.`,
          `若方程组有无穷多解，第二个方程必须是第一个方程的常数倍。比例系数为 $\\frac{${scaledA}}{${a}} = ${m}$。因此 $c = ${c} \\times ${m} = ${targetC}$。`,
        );

        return numberProblem({
          prompt,
          answer: targetC,
          form: "integer",
          wrong: [targetC + m, targetC - m, c * 2],
          solution,
        });
      },
    },
  ],
};

/** satEquatingPolynomialCoefficients solves polynomial identities by equating coefficients. */
export const satEquatingPolynomialCoefficients: TopicDef = {
  id: "sat-equating-polynomial-coefficients",
  title: t("Equating Polynomial Coefficients in SAT Problems", "SAT 题中的多项式待定系数法"),
  summary: t(
    "Find unknown coefficients and constants in polynomial identities by expanding and equating corresponding terms.",
    "通过展开并比较同类项系数，求解多项式恒等式中的未知系数与常数。",
  ),
  prerequisites: ["equating-polynomial-coefficients"],
  encompasses: [{ topic: "equating-polynomial-coefficients", weight: 1 }],
  xp: 8,
  standards: ["CCSS.HSA.SSE.A.2"],
  knowledgePoints: [
    {
      id: "sat-binomial-expansion-coefficients",
      title: t("Coefficients in Binomial Products", "二项式乘积中的未知系数"),
      explanation: t(
        "If two polynomials are equal for all values of $x$, the coefficients of like terms must be equal:\n$$(ax + b)(cx + d) = acx^2 + (ad + bc)x + bd$$\nEquating coefficients on both sides determines the unknown constants.",
        "如果两个多项式对所有 $x$ 恒等，则同类项系数必须对应相等：\n$$(ax + b)(cx + d) = acx^2 + (ad + bc)x + bd$$\n通过令两边对应次数的系数相等，即可求出未知常数。",
      ),
      generate(rng) {
        const a = rng.int(2, 5);
        const b = rng.int(1, 6);
        const c = rng.int(2, 4);
        const d = rng.int(1, 5);

        const leadingCoeff = a * c;
        const middleCoeff = a * d + b * c;
        const constantTerm = b * d;

        const prompt = t(
          `The equation $(${a}x + ${b})(${c}x + ${d}) = ${leadingCoeff}x^2 + Bx + ${constantTerm}$ is true for all values of $x$. What is the value of $B$?`,
          `等式 $(${a}x + ${b})(${c}x + ${d}) = ${leadingCoeff}x^2 + Bx + ${constantTerm}$ 对所有 $x$ 的值均成立。$B$ 的值是多少？`,
        );
        const solution = t(
          `Expand the left-hand side:\n$$(${a}x + ${b})(${c}x + ${d}) = (${a} \\times ${c})x^2 + (${a} \\times ${d} + ${b} \\times ${c})x + (${b} \\times ${d}) = ${leadingCoeff}x^2 + ${middleCoeff}x + ${constantTerm}$$\nEquating the coefficient of $x$ gives $B = ${middleCoeff}$.`,
          `展开左边多项式：\n$$(${a}x + ${b})(${c}x + ${d}) = (${a} \\times ${c})x^2 + (${a} \\times ${d} + ${b} \\times ${c})x + (${b} \\times ${d}) = ${leadingCoeff}x^2 + ${middleCoeff}x + ${constantTerm}$$\n比较一次项系数可得 $B = ${middleCoeff}$。`,
        );

        return numberProblem({
          prompt,
          answer: middleCoeff,
          form: "integer",
          wrong: [middleCoeff + 2, middleCoeff - 2, a * c + b * d],
          solution,
        });
      },
    },
    {
      id: "sat-unknown-inside-a-factor",
      title: t("Finding an Unknown Inside a Factor", "求因式中的未知常数"),
      explanation: t(
        "When the unknown sits inside one of the factors, expand anyway, keeping the unknown as a letter, and then match the coefficient you are given. For\n$$(3x + 2)(4x + k) = 12x^2 + 23x + 2k$$\nthe $x$-coefficient on the left is $3k + 2 \\cdot 4 = 3k + 8$. Setting $3k + 8 = 23$ gives $k = 5$. Check with the constant term: $2k = 10$ on both sides.",
        "当未知数在某个因式里时，照样展开，把未知数保留为字母，再与已知系数比较。对于\n$$(3x + 2)(4x + k) = 12x^2 + 23x + 2k$$\n左边的一次项系数为 $3k + 2 \\cdot 4 = 3k + 8$。令 $3k + 8 = 23$，得 $k = 5$。用常数项检验：两边都是 $2k = 10$。",
      ),
      generate(rng) {
        const a = rng.int(2, 6);
        const b = rng.int(1, 7);
        const c = rng.int(2, 5);
        const k = rng.int(2, 9);
        const middle = a * k + b * c;
        return numberProblem({
          prompt: t(
            `The equation $(${a}x + ${b})(${c}x + k) = ${a * c}x^2 + ${middle}x + ${b}k$, where $k$ is a constant, is true for all values of $x$. What is the value of $k$?`,
            `等式 $(${a}x + ${b})(${c}x + k) = ${a * c}x^2 + ${middle}x + ${b}k$（$k$ 为常数）对所有 $x$ 的值均成立。$k$ 的值是多少？`,
          ),
          answer: k,
          form: "integer",
          wrong: [middle - b * c, middle - a * c, k + 1].filter((w) => w !== k),
          solution: t(
            `The $x$-coefficient of the left side is $${a}k + ${b} \\cdot ${c} = ${a}k + ${b * c}$. Setting $${a}k + ${b * c} = ${middle}$ gives $${a}k = ${a * k}$, so $k = ${k}$.`,
            `左边的一次项系数为 $${a}k + ${b} \\cdot ${c} = ${a}k + ${b * c}$。令 $${a}k + ${b * c} = ${middle}$，得 $${a}k = ${a * k}$，所以 $k = ${k}$。`,
          ),
        });
      },
    },
  ],
};

/** satMarginOfErrorInterpretation interprets margins of error in survey estimates. */
export const satMarginOfErrorInterpretation: TopicDef = {
  id: "sat-margin-of-error-interpretation",
  title: t("Interpreting Margin of Error", "识读与解释抽样误差范围"),
  summary: t(
    "Interpret margin of error from sample surveys to determine plausible population ranges and evaluate sample size effects.",
    "解读抽样调查中的误差范围，确定总体参数的合理区间，并评估样本容量对误差的影响。",
  ),
  prerequisites: ["sampling"],
  encompasses: [],
  xp: 8,
  standards: ["CCSS.HSS.IC.B.4"],
  knowledgePoints: [
    {
      id: "sat-plausible-interval-bounds",
      title: t("Plausible Value Intervals", "总体参数的置信合理区间"),
      explanation: t(
        "When a survey reports an estimate of $p\\%$ with a **margin of error** of $e\\%$, the plausible range for the true population percentage is $[p - e, p + e]$.",
        "当一项调查报告估计值为 $p\\%$ 且**误差范围**为 $e\\%$ 时，真实总体百分比的合理区间为 $[p - e, p + e]$。",
      ),
      generate(rng) {
        const p = rng.int(35, 75);
        const e = rng.int(2, 5);
        const askUpper = rng.bool();
        const bound = askUpper ? p + e : p - e;

        const prompt = t(
          `A random survey of voters finds that $${p}\\%$ favor a proposed measure, with an associated margin of error of $${e}\\%$. What is the ${askUpper ? "maximum" : "minimum"} plausible percentage of all voters in the population who favor the measure?`,
          `一项对选民的随机调查发现，有 $${p}\\%$ 的人支持某项提案，该调查的误差范围为 $${e}\\%$。总体中支持该提案的选民比例的${askUpper ? "最大" : "最小"}合理百分比是多少？`,
        );
        const solution = t(
          `The plausible interval is $${p}\\% \\pm ${e}\\%$, which extends from $${p - e}\\%$ to $${p + e}\\%$. The ${askUpper ? "maximum" : "minimum"} plausible percentage is $${bound}\\%$.`,
          `合理区间为 $${p}\\% \\pm ${e}\\%$，即从 $${p - e}\\%$ 到 $${p + e}\\%$。${askUpper ? "最大" : "最小"}合理百分比为 $${bound}\\%$。`,
        );

        return numberProblem({
          prompt,
          answer: bound,
          form: "integer",
          unit: "%",
          wrong: [askUpper ? p - e : p + e, p, bound + 1],
          solution,
        });
      },
    },
    {
      id: "sat-sample-size-and-margin-of-error",
      title: t("Sample Size Effect on Margin of Error", "样本容量对误差范围的影响"),
      explanation: t(
        "Increasing the sample size of a random survey reduces the margin of error, making the estimate more precise. Decreasing sample size increases the margin of error.",
        "增大随机调查的样本容量会减小误差范围，使估计更加精确；减小样本容量则会增大误差范围。",
      ),
      generate(rng) {
        const small = rng.int(3, 8) * 100;
        const large = small * rng.pick([2, 4]);
        const grows = rng.bool();
        const [n1, n2] = grows ? [small, large] : [large, small];
        const e1 = rng.int(4, 7);

        const decrease = t("The margin of error will decrease.", "误差范围会减小。");
        const increase = t("The margin of error will increase.", "误差范围会增大。");
        const correct = grows ? decrease : increase;
        const options = rng.shuffle([
          decrease,
          increase,
          t("The margin of error will remain exactly the same.", "误差范围保持完全不变。"),
          t("The sample estimate will necessarily become 100%.", "样本估计值必然变为 100%。"),
        ]);

        const prompt = t(
          `A researcher conducts a poll with $${n1}$ randomly selected adults and reports a margin of error of $${e1}\\%$. If a second identical poll is conducted with a ${grows ? "larger" : "smaller"} sample of $${n2}$ adults from the same population, how is the margin of error expected to change?`,
          `研究人员对随机抽选的 $${n1}$ 名成年人进行民意调查，报告的误差范围为 $${e1}\\%$。如果从同一总体中抽取${grows ? "更大" : "更小"}的样本（$${n2}$ 人）进行第二次相同调查，预期的误差范围将如何变化？`,
        );
        const solution = grows
          ? t(
              `Increasing the sample size from $${n1}$ to $${n2}$ provides more information and reduces sampling variability, which decreases the margin of error.`,
              `将样本容量从 $${n1}$ 增大至 $${n2}$ 提供了更多信息并降低了抽样波动性，从而减小了误差范围。`,
            )
          : t(
              `Decreasing the sample size from $${n1}$ to $${n2}$ provides less information and increases sampling variability, which increases the margin of error.`,
              `将样本容量从 $${n1}$ 减小至 $${n2}$ 提供的信息更少，抽样波动性增大，从而增大了误差范围。`,
            );

        return choiceProblem({
          prompt,
          options,
          correct: options.indexOf(correct),
          solution,
        });
      },
    },
  ],
};

/** satExponentialModelRewriting interprets growth factors and rewritten exponential equations. */
export const satExponentialModelRewriting: TopicDef = {
  id: "sat-exponential-model-rewriting",
  title: t("Working With Equivalent Forms of Exponential Functions", "指数函数的等价形式"),
  summary: t(
    "Rewrite exponential equations and interpret percent growth or decay rates over different time periods.",
    "改写指数方程并解释不同时间周期下的百分比增长率或衰减率。",
  ),
  prerequisites: ["exponential-functions"],
  encompasses: [],
  xp: 8,
  standards: ["CCSS.HSF.IF.C.8b"],
  knowledgePoints: [
    {
      id: "sat-exponential-growth-percent",
      title: t("Interpreting Annual Growth Percent", "解读年增长百分比"),
      explanation: t(
        "In an exponential model $P(t) = a(1 + r)^t$, the growth factor is $b = 1 + r$. The annual percentage increase is $r \\times 100\\% = (b - 1) \\times 100\\%$.\n\nFor example, if $P(t) = 500(1.08)^t$, the annual rate of increase is $(1.08 - 1) \\times 100\\% = 8\\%$.",
        "在指数模型 $P(t) = a(1 + r)^t$ 中，增长因子为 $b = 1 + r$。年百分比增长率为 $r \\times 100\\% = (b - 1) \\times 100\\%$。\n\n例如，若 $P(t) = 500(1.08)^t$，则年增长率为 $(1.08 - 1) \\times 100\\% = 8\\%$。",
      ),
      generate(rng) {
        const initial = rng.int(2, 20) * 50;
        const percent = rng.int(3, 18);
        const pctStr = String(percent).padStart(2, "0");
        const growthFactor = `1.${pctStr}`;

        const prompt = t(
          `The population of an endangered animal species is modeled by $P(t) = ${initial}(${growthFactor})^t$, where $t$ is the number of years since the start of a conservation program. By what percentage does the population increase each year?`,
          `某濒危动物种群数量模型为 $P(t) = ${initial}(${growthFactor})^t$，其中 $t$ 为保护计划启动以来的年数。该种群数量每年增加百分之几？`,
        );
        const solution = t(
          `The base of the exponential term is $${growthFactor} = 1 + 0.${pctStr}$. The annual growth rate is $0.${pctStr} \\times 100\\% = ${percent}\\%$.`,
          `指数项的底数为 $${growthFactor} = 1 + 0.${pctStr}$。年增长率为 $0.${pctStr} \\times 100\\% = ${percent}\\%$。`,
        );

        return numberProblem({
          prompt,
          answer: percent,
          form: "integer",
          unit: "%",
          wrong: [percent + 1, percent - 1, Math.round(Number(growthFactor) * 10)],
          solution,
        });
      },
    },
    {
      id: "sat-growth-over-a-shorter-period",
      title: t("Percent Change over a Shorter Period", "较短周期内的百分比变化"),
      explanation: t(
        "A yearly factor can be rewritten for a shorter period with the exponent rules. Every half year is $\\frac{1}{2}$ of a year, so the half-year factor $q$ must satisfy $q^2 = b$, and\n$$a\\,b^t = a\\,(q^2)^t = a\\,q^{2t},$$\nwhere $2t$ counts half years. For $P(t) = 800(1.21)^t$, $q = \\sqrt{1.21} = 1.1$, so the quantity grows by $10\\%$ every half year, not by half of $21\\%$.",
        "年增长因子可以用指数法则改写成较短周期的因子。每半年是 $\\frac{1}{2}$ 年，所以半年因子 $q$ 满足 $q^2 = b$，并且\n$$a\\,b^t = a\\,(q^2)^t = a\\,q^{2t},$$\n其中 $2t$ 是半年的个数。对于 $P(t) = 800(1.21)^t$，$q = \\sqrt{1.21} = 1.1$，所以该量每半年增长 $10\\%$，而不是 $21\\%$ 的一半。",
      ),
      generate(rng) {
        const q = rng.pick([110, 120, 130, 140, 150, 90, 80, 70, 60, 105, 95, 102, 98]);
        const square = q * q;
        const dec = (n: number) => (n / 10000).toString();
        const base = dec(square);
        const initial = rng.int(2, 30) * 100;
        const change = Math.abs(q - 100);
        const grows = q > 100;
        const yearly = Math.abs(square - 10000) / 100;
        const [what, whatZh] = rng.pick([
          ["the number of users of an app", "某应用的用户数"],
          ["the value of a machine", "一台机器的价值"],
          ["the mass of a sample", "一个样本的质量"],
          ["the population of a town", "某镇的人口"],
        ] as const);
        return numberProblem({
          prompt: t(
            `The function $f(t) = ${initial}(${base})^t$ models ${what}, where $t$ is the time in years. By what percent does it ${grows ? "increase" : "decrease"} every half year?`,
            `函数 $f(t) = ${initial}(${base})^t$ 描述${whatZh}，其中 $t$ 为时间（年）。它每半年${grows ? "增加" : "减少"}百分之几？`,
          ),
          answer: change,
          form: "integer",
          unit: "%",
          wrong: [yearly, yearly / 2, change * 2].filter((w) => Number.isInteger(w) && w !== change),
          solution: t(
            `Write $${base} = (${dec(q * 100)})^2$, so $f(t) = ${initial}(${dec(q * 100)})^{2t}$, where $2t$ counts half years. The half-year factor $${dec(q * 100)}$ means a ${change}% ${grows ? "increase" : "decrease"} each half year.`,
            `把 $${base}$ 写成 $(${dec(q * 100)})^2$，则 $f(t) = ${initial}(${dec(q * 100)})^{2t}$，其中 $2t$ 是半年的个数。半年因子 $${dec(q * 100)}$ 表示每半年${grows ? "增加" : "减少"} ${change}%。`,
          ),
        });
      },
    },
  ],
};

/** satQuadraticVertexAndConstants finds vertex coordinates and extremum values. */
export const satQuadraticVertexAndConstants: TopicDef = {
  id: "sat-quadratic-vertex-and-constants",
  title: t("Quadratic Vertex and Minimum-Maximum Values", "二次函数的顶点与极值分析"),
  summary: t(
    "Determine unknown constants and optimal values of quadratic models using the vertex and symmetry.",
    "利用顶点与对称性确定二次模型的未知常数与最值。",
  ),
  prerequisites: ["the-vertex-form-of-a-parabola"],
  encompasses: [],
  xp: 8,
  standards: ["CCSS.HSA.CED.A.1", "CCSS.HSF.IF.C.8a"],
  knowledgePoints: [
    {
      id: "sat-vertex-extremum-value",
      title: t("Minimum or Maximum Value of a Quadratic", "二次函数的最值"),
      explanation: t(
        "For a parabola in vertex form $f(x) = a(x - h)^2 + k$, if $a > 0$, the parabola opens upward and has a minimum value of $k$ at $x = h$.\n\nIf $a < 0$, it opens downward and has a maximum value of $k$ at $x = h$.",
        "对于顶点式抛物线 $f(x) = a(x - h)^2 + k$，若 $a > 0$，抛物线开口向上，在 $x = h$ 处取得最小值 $k$；若 $a < 0$，抛物线开口向下，在 $x = h$ 处取得最大值 $k$。",
      ),
      generate(rng) {
        const a = rng.int(1, 4);
        const h = rng.int(2, 9);
        const k = rng.int(5, 30);
        const isOpenUp = rng.bool();
        const coeff = isOpenUp ? a : -a;

        const expr = coeff === 1 ? `(x - ${h})^2 + ${k}` : coeff === -1 ? `-(x - ${h})^2 + ${k}` : `${coeff}(x - ${h})^2 + ${k}`;

        const prompt = t(
          `The function $f$ is defined by $f(x) = ${expr}$. What is the ${isOpenUp ? "minimum" : "maximum"} value of $f(x)$?`,
          `函数 $f$ 定义为 $f(x) = ${expr}$。$f(x)$ 的${isOpenUp ? "最小" : "最大"}值是多少？`,
        );
        const solution = t(
          `Since the quadratic expression is in vertex form $a(x - h)^2 + k$ with vertex $(h, k) = (${h}, ${k})$ and $a = ${coeff}$, the parabola reaches its ${isOpenUp ? "minimum" : "maximum"} value at the vertex, which is $k = ${k}$.`,
          `由于二次表达式为顶点式 $a(x - h)^2 + k$，顶点为 $(h, k) = (${h}, ${k})$ 且 $a = ${coeff}$，抛物线在顶点处取得${isOpenUp ? "最小" : "最大"}值，即 $k = ${k}$。`,
        );

        return numberProblem({
          prompt,
          answer: k,
          form: "integer",
          wrong: [h, k + h, k - h],
          solution,
        });
      },
    },
    {
      id: "sat-constant-from-the-vertex",
      title: t("Finding a Coefficient from the Vertex", "由顶点求系数"),
      explanation: t(
        "In standard form $f(x) = ax^2 + bx + c$, the vertex has $x$-coordinate $-\\frac{b}{2a}$. If the minimum or maximum is known to occur at $x = h$, then $-\\frac{b}{2a} = h$, so $b = -2ah$.\n\nFor $f(x) = 3x^2 + bx + 5$ with its minimum at $x = 2$: $b = -2 \\cdot 3 \\cdot 2 = -12$. Check: $-\\frac{-12}{2 \\cdot 3} = 2$.",
        "在一般式 $f(x) = ax^2 + bx + c$ 中，顶点的横坐标为 $-\\frac{b}{2a}$。若已知最小值或最大值在 $x = h$ 处取得，则 $-\\frac{b}{2a} = h$，所以 $b = -2ah$。\n\n对于在 $x = 2$ 处取得最小值的 $f(x) = 3x^2 + bx + 5$：$b = -2 \\cdot 3 \\cdot 2 = -12$。检验：$-\\frac{-12}{2 \\cdot 3} = 2$。",
      ),
      generate(rng) {
        const up = rng.bool();
        const a = (up ? 1 : -1) * rng.int(1, 5);
        const h = rng.pick([-1, 1]) * rng.int(1, 8);
        const c = rng.int(-9, 20);
        const b = -2 * a * h;
        const lead = a === 1 ? "" : a === -1 ? "-" : `${a}`;
        const cTex = c < 0 ? ` - ${-c}` : c === 0 ? "" : ` + ${c}`;
        return numberProblem({
          prompt: t(
            `The function $f(x) = ${lead}x^2 + bx${cTex}$, where $b$ is a constant, reaches its ${up ? "minimum" : "maximum"} value at $x = ${h}$. What is the value of $b$?`,
            `函数 $f(x) = ${lead}x^2 + bx${cTex}$（$b$ 为常数）在 $x = ${h}$ 处取得${up ? "最小" : "最大"}值。$b$ 的值是多少？`,
          ),
          answer: b,
          form: "integer",
          wrong: [-b, -a * h, -2 * h].filter((w) => w !== b),
          solution: t(
            `The vertex is at $x = -\\frac{b}{2a}$ with $a = ${a}$. Setting $-\\frac{b}{2(${a})} = ${h}$ gives $b = -2(${a})(${h}) = ${b}$.`,
            `顶点横坐标为 $x = -\\frac{b}{2a}$，其中 $a = ${a}$。令 $-\\frac{b}{2(${a})} = ${h}$，得 $b = -2(${a})(${h}) = ${b}$。`,
          ),
        });
      },
    },
  ],
};

/** satMathStrategyTopics contains high-leverage SAT problem-solving topics. */
export const satMathStrategyTopics: readonly TopicDef[] = [
  satLinearSystemsUnknownConstants,
  satEquatingPolynomialCoefficients,
  satMarginOfErrorInterpretation,
  satExponentialModelRewriting,
  satQuadraticVertexAndConstants,
];
