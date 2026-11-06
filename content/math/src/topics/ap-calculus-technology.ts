import type { Figure, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, linear, plane, poly, Q } from "@ga/subject-math";
import { calculusDrawings5 } from "../explanation-drawings-calculus-5.ts";

import { numberProblem, pointProblem } from "../problems.ts";

// AP Calculus AB Unit 9 & AP Calculus BC Unit 16: Applications of Technology
// (Using Graphing Calculators).

/** evaluatingExpressionsUsingAGraphingCalculator practices grouping expressions with parentheses, using radian mode, and storing intermediate values at full precision. */
export const evaluatingExpressionsUsingAGraphingCalculator: TopicDef = {
  id: "evaluating-expressions-using-a-graphing-calculator",
  title: t("Evaluating Expressions Using a Graphing Calculator", "用图形计算器计算表达式"),
  summary: t(
    "Group numerators, denominators and compound exponents with parentheses, keep the calculator in radian mode, and store intermediate values at full precision.",
    "用括号对分子、分母与复合指数分组，保持弧度模式，并以完整精度存储中间计算值。",
  ),
  prerequisites: ["extending-the-trigonometric-ratios-using-angles-in-radians"],
  encompasses: [{ topic: "evaluating-expressions", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "order-of-operations-and-parentheses-on-calculators",
      title: t("Grouping Numerators, Denominators, and Exponents", "分子、分母与指数的括号分组"),
      explanation: t(
        "When entering rational or exponential expressions in a single line on a graphing calculator, wrap the entire numerator, denominator, and compound exponent in parentheses so the calculator respects the order of operations. For example, to evaluate $f(x) = \\frac{3x^2 + 1}{x + 2}$ at $x = 2$, entering `(3*2^2 + 1)/(2 + 2)` gives $\\frac{13}{4}$, whereas omitting parentheses and typing `3*2^2 + 1/2 + 2` computes $3(4) + \\frac{1}{2} + 2 = \\frac{29}{2}$.",
        "在图形计算器中单行输入分式或指数表达式时，必须将整个分子、整个分母以及复合指数用括号括起来，以确保计算器遵循正确的运算顺序。例如计算 $f(x) = \\frac{3x^2 + 1}{x + 2}$ 在 $x = 2$ 处的值时，输入 `(3*2^2 + 1)/(2 + 2)` 得 $\\frac{13}{4}$，而若漏掉括号输入 `3*2^2 + 1/2 + 2`，计算器会按 $3(4) + \\frac{1}{2} + 2 = \\frac{29}{2}$ 计算。",
      ),
      generate: (rng: Rng) => {
        const a = rng.int(2, 7);
        const b = rng.int(1, 6);
        const c = rng.int(1, 5);
        const x = rng.int(2, 5);
        const num = a * x * x + b;
        const den = x + c;
        const grouped = Q.of(num, den);
        // Entering a*x^2 + b/x + c without any parentheses computes a*x^2 + b/x + c = (a*x^3 + b + c*x)/x
        const ungrouped = Q.of(a * x * x * x + b + c * x, x);
        // Entering (a*x^2 + b)/x + c (missing denominator parentheses)
        const noDenParen = Q.of(num + c * x, x);
        // Entering a*x^2 + b/(x + c) (missing numerator parentheses)
        const noNumParen = Q.of(a * x * x * den + b, den);
        const askUngrouped = rng.bool();
        return numberProblem({
          prompt: askUngrouped
            ? t(
                `A student intends to evaluate $f(x) = \\frac{${a}x^2 + ${b}}{x + ${c}}$ at $x = ${x}$, but omits parentheses and types \`${a}*${x}^2 + ${b}/${x} + ${c}\` into a calculator. What exact value does the calculator return for this ungrouped entry?`,
                `某学生原本要计算 $f(x) = \\frac{${a}x^2 + ${b}}{x + ${c}}$ 在 $x = ${x}$ 处的值，但漏掉了括号，在计算器中输入了 \`${a}*${x}^2 + ${b}/${x} + ${c}\`。计算器对该未加括号的输入返回的精确值是多少？`,
              )
            : t(
                `You evaluate $f(x) = \\frac{${a}x^2 + ${b}}{x + ${c}}$ at $x = ${x}$ on a calculator using the properly grouped entry \`(${a}*${x}^2 + ${b})/(${x} + ${c})\`. What exact value does this produce?`,
                `在计算器上使用正确加括号的输入方式 \`(${a}*${x}^2 + ${b})/(${x} + ${c})\` 计算函数 $f(x) = \\frac{${a}x^2 + ${b}}{x + ${c}}$ 在 $x = ${x}$ 处的值，所得的精确值是多少？`,
              ),
          answer: askUngrouped ? ungrouped : grouped,
          wrong: askUngrouped ? [grouped, noDenParen, noNumParen] : [ungrouped, noDenParen, noNumParen],
          solution: askUngrouped
            ? t(
                `By order of operations, \`${a}*${x}^2 + ${b}/${x} + ${c}\` is evaluated as $${a}(${x})^2 + \\frac{${b}}{${x}} + ${c} = ${a * x * x + c} + \\frac{${b}}{${x}} = ${ungrouped.toLatex()}$.`,
                `按运算顺序，\`${a}*${x}^2 + ${b}/${x} + ${c}\` 会被计算为 $${a}(${x})^2 + \\frac{${b}}{${x}} + ${c} = ${a * x * x + c} + \\frac{${b}}{${x}} = ${ungrouped.toLatex()}$。`,
              )
            : t(
                `Evaluate the grouped numerator and denominator at $x = ${x}$: numerator $= ${a}(${x})^2 + ${b} = ${num}$, denominator $= ${x} + ${c} = ${den}$. Dividing gives $${`\\frac{${num}}{${den}}` === grouped.toLatex() ? grouped.toLatex() : `\\frac{${num}}{${den}} = ${grouped.toLatex()}`}$.`,
                `在 $x = ${x}$ 处分别计算括号内的分子与分母：分子 $= ${a}(${x})^2 + ${b} = ${num}$，分母 $= ${x} + ${c} = ${den}$。相除得 $${`\\frac{${num}}{${den}}` === grouped.toLatex() ? grouped.toLatex() : `\\frac{${num}}{${den}} = ${grouped.toLatex()}`}$。`,
              ),
        });
      },
    },
    {
      id: "radian-mode-and-storing-intermediate-values",
      title: t("Radian Mode and Storing Intermediate Values", "弧度模式与中间值存储"),
      explanation: t(
        "All calculus differentiation and integration formulas for trigonometric functions assume angles are measured in radians, so your graphing calculator must always remain in radian mode on AP Calculus exams. In addition, when a multi-step problem uses an intermediate number $A$, store $A$ in a calculator variable rather than re-typing a rounded approximation.",
        "微积分中所有三角函数的求导与积分公式都以弧度制为前提，因此在 AP 微积分考试中图形计算器必须始终处于弧度（Radian）模式。此外，当多步计算题需要使用中间数值 $A$ 时，应将 $A$ 存储在计算器变量中，切勿将四舍五入后的近似值重新输入，以免产生累计舍入误差。",
      ),
      generate: (rng: Rng) => {
        if (rng.bool()) {
          const a = rng.int(2, 9);
          const b = rng.int(2, 9);
          const k = rng.int(1, 4);
          // Evaluate f(x) = a cos(pi * x) + b sin((pi/2) * x) at x = 2k - 1 in radian mode:
          // cos((2k-1)pi) = -1, sin((2k-1)pi/2) = (-1)^(k-1)
          const x = 2 * k - 1;
          const sinVal = k % 2 === 1 ? 1 : -1;
          const radAns = -a + b * sinVal;
          // If evaluated at 0 or with cos = 1
          const wrong1 = a + b * sinVal;
          const wrong2 = -a - b * sinVal;
          const wrong3 = a + b;
          return numberProblem({
            prompt: t(
              `With your graphing calculator set to Radian mode, you evaluate $f(x) = ${a}\\cos(\\pi x) + ${b}\\sin\\left(\\frac{\\pi x}{2}\\right)$ at $x = ${x}$. What exact value does the calculator return?`,
              `将图形计算器设为弧度（Radian）模式，计算函数 $f(x) = ${a}\\cos(\\pi x) + ${b}\\sin\\left(\\frac{\\pi x}{2}\\right)$ 在 $x = ${x}$ 处的值，计算器返回的精确值是多少？`,
            ),
            answer: radAns,
            wrong: [wrong1, wrong2, wrong3],
            solution: t(
              `In radian mode at $x = ${x}$, $\\cos(${x}\\pi) = -1$ and $\\sin\\left(\\frac{${x}\\pi}{2}\\right) = ${sinVal}$, so $f(${x}) = ${a}(-1) + ${b}(${sinVal}) = ${radAns}$.`,
              `在弧度模式下，当 $x = ${x}$ 时，$\\cos(${x}\\pi) = -1$ 且 $\\sin\\left(\\frac{${x}\\pi}{2}\\right) = ${sinVal}$，因此 $f(${x}) = ${a}(-1) + ${b}(${sinVal}) = ${radAns}$。`,
            ),
          });
        }
        const k = rng.int(2, 9) * 1000;
        const baseTenths = rng.int(12, 38);
        const extraThousandths = rng.int(2, 4);
        const exactThousandths = baseTenths * 100 + extraThousandths;
        const exactVal = (k * exactThousandths) / 1000;
        const roundedVal = (k * (baseTenths * 100)) / 1000;
        const diff = exactVal - roundedVal;
        return numberProblem({
          prompt: t(
            `A calculator stores the intermediate value $A = ${(exactThousandths / 1000).toFixed(3)}$. If you compute $N = ${k}A$ using the stored value of $A$ instead of the two-decimal rounded value $${(baseTenths / 10).toFixed(2)}$, by how much does the stored-value result exceed the prematurely rounded result?`,
            `计算器存储了中间值 $A = ${(exactThousandths / 1000).toFixed(3)}$。若使用存储的 $A$ 值计算 $N = ${k}A$，而不是使用四舍五入到两位小数的值 $${(baseTenths / 10).toFixed(2)}$，使用存储值所得结果比提前舍入所得结果大多少？`,
          ),
          answer: diff,
          wrong: [exactVal, roundedVal, diff * 10],
          solution: t(
            `With stored $A = ${(exactThousandths / 1000).toFixed(3)}$, $${k}A = ${exactVal}$. With rounded $A \\approx ${(baseTenths / 10).toFixed(2)}$, $${k}A \\approx ${roundedVal}$. The difference is $${exactVal} - ${roundedVal} = ${diff}$.`,
            `使用存储值 $A = ${(exactThousandths / 1000).toFixed(3)}$ 时，$${k}A = ${exactVal}$；使用舍入值 $A \\approx ${(baseTenths / 10).toFixed(2)}$ 时，$${k}A \\approx ${roundedVal}$。两者之差为 $${exactVal} - ${roundedVal} = ${diff}$。`,
          ),
        });
      },
    },
  ],
};

/** findingRootsOfFunctionsUsingAGraphingCalculator practices bracketing zeros with sign changes and solving equations g(x) = c by finding zeros of g(x) - c. */
export const findingRootsOfFunctionsUsingAGraphingCalculator: TopicDef = {
  id: "finding-roots-of-functions-using-a-graphing-calculator",
  title: t("Finding Roots of Functions Using a Graphing Calculator", "用图形计算器求函数的根"),
  summary: t(
    "Bracket roots with left and right bounds where a continuous function changes sign, and use the calculator's zero finder to solve g(x) = c via g(x) - c = 0.",
    "利用连续函数变号处的左、右边界锁定根所在的区间，并通过求差函数 g(x) - c = 0 的零点求解方程 g(x) = c。",
  ),
  prerequisites: ["evaluating-expressions-using-a-graphing-calculator", "the-intermediate-value-theorem"],
  encompasses: [{ topic: "the-intermediate-value-theorem", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "bracketing-a-root-with-sign-changes",
      figure: calculusDrawings5["finding-roots-of-functions-using-a-graphing-calculator#bracketing-a-root-with-sign-changes"],
      title: t("Bracketing Roots Using Sign Changes", "利用符号变化锁定根所在的区间"),
      explanation: t(
        "The graphing calculator's `zero` (or `root`) command requires a left bound $a$ and a right bound $b$ surrounding a single $x$-intercept. For a continuous function $f$, a sign change ($f(a)$ and $f(b)$ having opposite signs) guarantees by the Intermediate Value Theorem that at least one root lies in $(a, b)$.",
        "图形计算器的求零点（`zero` 或 `root`）功能需要指定包含单个 $x$ 轴交点的左边界 $a$ 和右边界 $b$。对于连续函数 $f$，若 $f(a)$ 与 $f(b)$ 异号，则由介值定理可知区间 $(a, b)$ 内必存在至少一个实根。",
      ),
      generate: (rng: Rng) => {
        const k = rng.int(1, 6);
        const v0 = -rng.int(5, 9);
        const v1 = -rng.int(1, 4);
        const v2 = rng.int(1, 4);
        const v3 = rng.int(5, 9);
        return numberProblem({
          prompt: t(
            `A calculator table for a strictly increasing continuous function $f(x)$ shows $f(${k}) = ${v0}$, $f(${k + 1}) = ${v1}$, $f(${k + 2}) = ${v2}$, and $f(${k + 3}) = ${v3}$. If you use consecutive integers $[n, n+1]$ as the left and right bounds for the calculator's root finder, what is the left bound $n$?`,
            `严格递增连续函数 $f(x)$ 的计算器数值表显示：$f(${k}) = ${v0}$，$f(${k + 1}) = ${v1}$，$f(${k + 2}) = ${v2}$，$f(${k + 3}) = ${v3}$。若选用相邻整数 $[n, n+1]$ 作为计算器求根功能的左、右边界，左边界 $n$ 是多少？`,
          ),
          answer: k + 1,
          wrong: [k, k + 2, k + 3],
          solution: t(
            `Look for the interval where $f(x)$ changes sign: $f(${k + 1}) = ${v1} < 0$ and $f(${k + 2}) = ${v2} > 0$. The root lies in $(${k + 1}, ${k + 2})$, so the integer left bound is $n = ${k + 1}$.`,
            `寻找 $f(x)$ 变号的区间：$f(${k + 1}) = ${v1} < 0$ 且 $f(${k + 2}) = ${v2} > 0$。根位于区间 $(${k + 1}, ${k + 2})$ 内，因此整数左边界为 $n = ${k + 1}$。`,
          ),
        });
      },
    },
    {
      id: "solving-equations-with-a-difference-function",
      figure: calculusDrawings5["finding-roots-of-functions-using-a-graphing-calculator#solving-equations-with-a-difference-function"],
      title: t("Solving Equations by Finding Zeros of a Difference Function", "通过求差函数的零点解方程"),
      explanation: t(
        "Any equation $g(x) = c$ can be solved with a calculator's root finder by graphing the difference function $Y_1 = g(x) - c$ and locating its $x$-intercept. Zooming in with a table step of $\\Delta\\text{Tbl} = 0.001$ around the sign change of $Y_1(x)$ determines the root to three decimal places.",
        "对于任意方程 $g(x) = c$，都可以通过绘制差函数 $Y_1 = g(x) - c$ 并定位其 $x$ 轴交点来用计算器求根功能求解。在 $Y_1(x)$ 变号处将数值表步长设为 $\\Delta\\text{Tbl} = 0.001$，即可将根确定到小数点后三位。",
      ),
      generate: (rng: Rng) => {
        const c = rng.int(3, 30);
        const difference = (x: number) => Math.exp(x) + x - c;
        let [lo, hi] = [0, 4];
        for (let i = 0; i < 40; i++) {
          const mid = (lo + hi) / 2;
          if (difference(mid) < 0) lo = mid;
          else hi = mid;
        }
        const thousandths = Math.round(lo * 1000);
        const r = Q.of(thousandths, 1000);
        const rMinus = Q.of(thousandths - 1, 1000);
        const rPlus = Q.of(thousandths + 1, 1000);
        const shown = (n: number) => difference(n / 1000).toFixed(5);
        const [yMinus, yZero, yPlus] = [shown(thousandths - 1), shown(thousandths), shown(thousandths + 1)];
        return numberProblem({
          prompt: t(
            `To solve $e^x + x = ${c}$, you graph the difference function $Y_1 = e^x + x - ${c}$ and inspect a zoomed calculator table with step $\\Delta\\text{Tbl} = 0.001$:\n\n$$Y_1(${dec(rMinus)}) = ${yMinus}, \\quad Y_1(${dec(r)}) = ${yZero}, \\quad Y_1(${dec(rPlus)}) = ${yPlus}.$$\n\nWhat is the root of $e^x + x = ${c}$ rounded to three decimal places?`,
            `为解方程 $e^x + x = ${c}$，绘制差函数 $Y_1 = e^x + x - ${c}$ 并查看步长为 $\\Delta\\text{Tbl} = 0.001$ 的局部放大计算器数值表：\n\n$$Y_1(${dec(rMinus)}) = ${yMinus}, \\quad Y_1(${dec(r)}) = ${yZero}, \\quad Y_1(${dec(rPlus)}) = ${yPlus}$$\n\n求方程 $e^x + x = ${c}$ 精确到小数点后三位的根。`,
          ),
          answer: r,
          form: "decimal",
          wrong: [rMinus, rPlus, Q.of(c)],
          solution: t(
            `The difference function $Y_1(x) = e^x + x - ${c}$ is negative at $${dec(rMinus)}$ and positive at $${dec(rPlus)}$, so the root lies between them. The value $Y_1(${dec(r)}) = ${yZero}$ is much closer to $0$ than the other two, so the root rounded to three decimal places is $${dec(r)}$.`,
            `差函数 $Y_1(x) = e^x + x - ${c}$ 在 $${dec(rMinus)}$ 处为负，在 $${dec(rPlus)}$ 处为正，所以根在两者之间。$Y_1(${dec(r)}) = ${yZero}$ 比另外两个值更接近 $0$，因此精确到三位小数的根为 $${dec(r)}$。`,
          ),
        });
      },
    },
  ],
};

/** findingIntersectionsOfFunctionsUsingAGraphingCalculator practices locating intersection coordinates and adjusting the viewing window to capture all intersections. */
export const findingIntersectionsOfFunctionsUsingAGraphingCalculator: TopicDef = {
  id: "finding-intersections-of-functions-using-a-graphing-calculator",
  title: t("Finding Intersections of Functions Using a Graphing Calculator", "用图形计算器求函数的交点"),
  summary: t(
    "Locate points of intersection (x, y) using the intersect command and adjust the viewing window to capture all intersections.",
    "使用求交点命令定位交点坐标 (x, y)，并调整视图窗口以捕捉所有交点。",
  ),
  prerequisites: ["finding-roots-of-functions-using-a-graphing-calculator"],
  encompasses: [{ topic: "finding-roots-of-functions-using-a-graphing-calculator", weight: 0.7 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "locating-intersection-coordinates",
      figure: calculusDrawings5["finding-intersections-of-functions-using-a-graphing-calculator#locating-intersection-coordinates"],
      title: t("Locating Points of Intersection", "定位两函数图像的交点坐标"),
      explanation: t(
        "To solve $f(x) = g(x)$ graphically, graph $Y_1 = f(x)$ and $Y_2 = g(x)$ and use the `intersect` command (or inspect a table where $Y_1(x) = Y_2(x)$). In AP Calculus area and volume problems, always store the intersection coordinates $(x, y)$ in calculator variables to use as limits of integration.",
        "用图像法解方程 $f(x) = g(x)$ 时，可分别绘制 $Y_1 = f(x)$ 与 $Y_2 = g(x)$ 并使用求交点（`intersect`）命令（或在数值表中寻找使 $Y_1(x) = Y_2(x)$ 的行）。在 AP 微积分的面积与体积问题中，务必将交点坐标 $(x, y)$ 存入计算器变量以作为积分上下限。",
      ),
      generate: (rng: Rng) => {
        const x0 = rng.int(1, 6);
        const y0 = rng.int(4, 18);
        const d1 = rng.int(2, 5);
        const d2 = rng.int(2, 5);
        return pointProblem({
          prompt: t(
            `A graphing calculator table for $Y_1 = f(x)$ and $Y_2 = g(x)$ shows:\n\n- At $x = ${x0 - 1}$: $Y_1 = ${y0 - d1}$ and $Y_2 = ${y0 - d1 + d2}$\n- At $x = ${x0}$: $Y_1 = ${y0}$ and $Y_2 = ${y0}$\n- At $x = ${x0 + 1}$: $Y_1 = ${y0 + d2}$ and $Y_2 = ${y0 + d2 - d1}$\n\nWhat intersection point $(x, y)$ does the calculator's \`intersect\` command return on $[${x0 - 1}, ${x0 + 1}]$?`,
            `图形计算器关于 $Y_1 = f(x)$ 与 $Y_2 = g(x)$ 的数值表显示：\n\n- 当 $x = ${x0 - 1}$ 时：$Y_1 = ${y0 - d1}$，$Y_2 = ${y0 - d1 + d2}$\n- 当 $x = ${x0}$ 时：$Y_1 = ${y0}$，$Y_2 = ${y0}$\n- 当 $x = ${x0 + 1}$ 时：$Y_1 = ${y0 + d2}$，$Y_2 = ${y0 + d2 - d1}$\n\n计算器的求交点（\`intersect\`）功能在 $[${x0 - 1}, ${x0 + 1}]$ 上返回的交点坐标 $(x, y)$ 是什么？`,
          ),
          answer: [x0, y0],
          wrong: [
            [y0, x0],
            [x0 - 1, y0 - d1],
            [x0 + 1, y0 + d2],
          ],
          solution: t(
            `At $x = ${x0}$, both functions have the same value $Y_1(${x0}) = Y_2(${x0}) = ${y0}$, so the intersection point is $(${x0}, ${y0})$.`,
            `当 $x = ${x0}$ 时，两函数值相等，即 $Y_1(${x0}) = Y_2(${x0}) = ${y0}$，故交点坐标为 $(${x0}, ${y0})$。`,
          ),
        });
      },
    },
    {
      id: "counting-intersections-by-window-and-end-behavior",
      title: t("Adjusting the Viewing Window to Find All Intersections", "调整视图窗口以找出所有交点"),
      explanation: t(
        "A standard $[-10, 10] \\times [-10, 10]$ viewing window misses any intersection $(x_0, y_0)$ with $|x_0| > 10$ or $|y_0| > 10$. To display that intersection on screen, both $X_{\\max} > x_0$ and $Y_{\\max} > y_0$ (for a first-quadrant intersection) must be chosen large enough.",
        "标准视图窗口 $[-10, 10] \\times [-10, 10]$ 会遗漏满足 $|x_0| > 10$ 或 $|y_0| > 10$ 的交点 $(x_0, y_0)$。要在屏幕上完整显示第一象限内的该交点，必须将窗口边界调整为 $X_{\\max} > x_0$ 且 $Y_{\\max} > y_0$。",
      ),
      generate: (rng: Rng) => {
        const a = rng.int(1, 3);
        const c = rng.int(0, 5);
        const r1 = rng.int(1, 3);
        const r2 = rng.int(11, 18);
        // f(x) = a*x^2 + c and g(x) = a*(r1 + r2)*x - a*r1*r2 + c intersect at x = r1 and x = r2
        const m = a * (r1 + r2);
        const b = c - a * r1 * r2;
        const y1 = a * r1 * r1 + c;
        const y2 = a * r2 * r2 + c;
        return numberProblem({
          prompt: t(
            `On the standard $[-10, 10] \\times [-10, 10]$ viewing window, a student sees only one intersection of $Y_1 = ${poly([a, "x^2"], [c, ""])}$ and $Y_2 = ${poly([m, "x"], [b, ""])}$ at $(${r1}, ${y1})$. The second intersection occurs at $x = ${r2}$. What is the $y$-coordinate of this second intersection that $Y_{\\max}$ must exceed for the intersection to appear in the viewing window?`,
            `在标准视图窗口 $[-10, 10] \\times [-10, 10]$ 下，某学生只看到 $Y_1 = ${poly([a, "x^2"], [c, ""])}$ 与 $Y_2 = ${poly([m, "x"], [b, ""])}$ 在 $(${r1}, ${y1})$ 处的一个交点。第二个交点位于 $x = ${r2}$ 处。要使该交点显示在视图窗口内，$Y_{\\max}$ 必须超过该交点的纵坐标 $y$，求这个纵坐标的值。`,
          ),
          answer: y2,
          wrong: [r2, m * r2, y1],
          solution: t(
            `At $x = ${r2}$, the $y$-coordinate on both graphs is $Y_1(${r2}) = ${a === 1 ? "" : `${a}\\cdot `}${r2}^2${c === 0 ? "" : ` + ${c}`} = ${y2}$, so the viewing window must have $Y_{\\max} > ${y2}$.`,
            `在 $x = ${r2}$ 处，两图像上的纵坐标均为 $Y_1(${r2}) = ${a === 1 ? "" : `${a}\\cdot `}${r2}^2${c === 0 ? "" : ` + ${c}`} = ${y2}$，因此视图窗口必须满足 $Y_{\\max} > ${y2}$。`,
          ),
        });
      },
    },
  ],
};

/** findingExtremaOfFunctionsUsingAGraphingCalculator practices locating local extrema from calculator graphs/tables and via sign-changing zeros of the derivative. */
export const findingExtremaOfFunctionsUsingAGraphingCalculator: TopicDef = {
  id: "finding-extrema-of-functions-using-a-graphing-calculator",
  title: t("Finding Extrema of Functions Using a Graphing Calculator", "用图形计算器求函数的极值"),
  summary: t(
    "Locate local extrema directly with the minimum/maximum commands or by finding sign-changing zeros of the derivative graph.",
    "使用最小值/最大值命令直接定位局部极值，或通过寻找导函数图像变号的零点求极值位置。",
  ),
  prerequisites: ["finding-roots-of-functions-using-a-graphing-calculator", "using-the-first-derivative-test-to-classify-local-extrema"],
  encompasses: [{ topic: "using-the-first-derivative-test-to-classify-local-extrema", weight: 0.2 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "finding-extrema-directly-from-the-graph",
      figure: calculusDrawings5["finding-extrema-of-functions-using-a-graphing-calculator#finding-extrema-directly-from-the-graph"],
      title: t("Using the Minimum and Maximum Commands", "使用计算器的最小值与最大值功能"),
      explanation: t(
        "The graphing calculator's `minimum` and `maximum` commands report the coordinates $(x, y)$ of a local extremum within a user-specified interval $[a, b]$. Always distinguish between the location of the extremum (the $x$-coordinate) and the extreme value itself (the $y$-coordinate), and compare interior extrema with endpoint values when finding an absolute extremum on $[a, b]$.",
        "图形计算器的 `minimum`（最小值）与 `maximum`（最大值）命令会报告指定区间 $[a, b]$ 内局部极值点的坐标 $(x, y)$。解题时务必区分极值的位置（横坐标 $x$）与极值本身（纵坐标 $y$）；在求闭区间 $[a, b]$ 上的绝对最值时，还需将内部极值与端点函数值进行比较。",
      ),
      generate: (rng: Rng) => {
        const xMin = rng.int(1, 3);
        const xMax = rng.int(5, 7);
        const yLocalMax = rng.int(12, 22);
        const yLocalMin = -rng.int(3, 9);
        const askMax = rng.bool();
        const endpointWins = rng.bool();
        const yEndLeft = !askMax && endpointWins ? yLocalMin - rng.int(2, 6) : rng.int(2, 8);
        const yEndRight = yLocalMax + (askMax && !endpointWins ? -rng.int(3, 8) : rng.int(3, 8));
        const [en, zh] = askMax ? ["maximum", "最大值"] : ["minimum", "最小值"];
        return numberProblem({
          prompt: t(
            `To analyze a continuous function $f$ on $[0, 8]$, you use a graphing calculator:\n\n- Endpoint values: $f(0) = ${yEndLeft}$ and $f(8) = ${yEndRight}$\n- Calculator \`Maximum\` command on $(0, 8)$: $(${xMin}, ${yLocalMax})$\n- Calculator \`Minimum\` command on $(0, 8)$: $(${xMax}, ${yLocalMin})$\n\nWhat is the absolute ${en} value of $f$ on the closed interval $[0, 8]$?`,
            `在 $[0, 8]$ 上分析连续函数 $f$ 时，使用图形计算器测得：\n\n- 端点值：$f(0) = ${yEndLeft}$，$f(8) = ${yEndRight}$\n- $(0, 8)$ 内的 \`Maximum\`（最大值）命令结果：$(${xMin}, ${yLocalMax})$\n- $(0, 8)$ 内的 \`Minimum\`（最小值）命令结果：$(${xMax}, ${yLocalMin})$\n\n函数 $f$ 在闭区间 $[0, 8]$ 上的绝对${zh}是多少？`,
          ),
          answer: askMax ? Math.max(yLocalMax, yEndRight) : Math.min(yLocalMin, yEndLeft),
          wrong: askMax ? [Math.min(yLocalMax, yEndRight), xMin, 8] : [Math.max(yLocalMin, yEndLeft), xMax, 0],
          solution: t(
            `An absolute extremum on a closed interval occurs at an interior extremum or at an endpoint. Compare the $y$-values $${yLocalMax}$ and $${yLocalMin}$ with $f(0) = ${yEndLeft}$ and $f(8) = ${yEndRight}$: the ${askMax ? "largest" : "smallest"} is $${askMax ? Math.max(yLocalMax, yEndRight) : Math.min(yLocalMin, yEndLeft)}$.`,
            `闭区间上的绝对最值出现在内部极值点或端点。比较纵坐标 $${yLocalMax}$、$${yLocalMin}$ 与 $f(0) = ${yEndLeft}$、$f(8) = ${yEndRight}$：${askMax ? "最大" : "最小"}的是 $${askMax ? Math.max(yLocalMax, yEndRight) : Math.min(yLocalMin, yEndLeft)}$。`,
          ),
        });
      },
    },
    {
      id: "finding-extrema-via-zeros-of-the-derivative",
      figure: calculusDrawings5["finding-extrema-of-functions-using-a-graphing-calculator#finding-extrema-via-zeros-of-the-derivative"],
      title: t("Finding Extrema by Graphing the Derivative", "通过绘制导函数图像求极值"),
      explanation: t(
        "On AP Calculus calculator-active problems, you are often given the derivative $f'(x)$ directly rather than $f(x)$. To find where $f$ has a local maximum or minimum, graph $Y_1 = f'(x)$ and use the `zero` command to find where $f'(x)$ changes sign (positive to negative for a local maximum; negative to positive for a local minimum; no sign change means neither).",
        "在 AP 微积分允许使用计算器的题目中，题目往往直接给出导函数 $f'(x)$ 而非原函数 $f(x)$。要求 $f$ 取得局部极大值或极小值的位置，应绘制 $Y_1 = f'(x)$ 的图像并使用求零点（`zero`）功能，找出 $f'(x)$ 变号的点（由正变负为局部极大值点，由负变正为局部极小值点，不变号则不是极值点）。",
      ),
      generate: (rng: Rng) => {
        const r1 = rng.int(1, 3);
        const r2 = r1 + rng.int(2, 3);
        const r3 = r2 + rng.int(2, 4);
        const askMax = rng.bool();
        const ans = askMax ? r2 : r3;
        return numberProblem({
          prompt: t(
            `You graph $Y_1 = f'(x)$ on a calculator and find that $f'(x)$ has three zeros at $x = ${r1}$, $x = ${r2}$, and $x = ${r3}$, with the following signs on the subintervals:\n\n- $f'(x) > 0$ on $(0, ${r1})$ and $(${r1}, ${r2})$\n- $f'(x) < 0$ on $(${r2}, ${r3})$\n- $f'(x) > 0$ on $(${r3}, 12)$\n\nAt what value of $x$ does $f$ attain a local ${askMax ? "maximum" : "minimum"}?`,
            `在计算器上绘制 $Y_1 = f'(x)$，发现 $f'(x)$ 在 $x = ${r1}$、$x = ${r2}$ 和 $x = ${r3}$ 处有三个零点，且在各子区间上的符号如下：\n\n- 在 $(0, ${r1})$ 与 $(${r1}, ${r2})$ 上 $f'(x) > 0$\n- 在 $(${r2}, ${r3})$ 上 $f'(x) < 0$\n- 在 $(${r3}, 12)$ 上 $f'(x) > 0$\n\n原函数 $f$ 在 $x$ 取何值时取得局部${askMax ? "极大值" : "极小值"}？`,
          ),
          answer: ans,
          wrong: [r1, askMax ? r3 : r2, r1 + r2],
          solution: askMax
            ? t(
                `At $x = ${r1}$, $f'(x)$ does not change sign. At $x = ${r2}$, $f'(x)$ changes from positive to negative, so $f$ has a local maximum at $x = ${r2}$.`,
                `在 $x = ${r1}$ 处 $f'(x)$ 不变号；在 $x = ${r2}$ 处 $f'(x)$ 由正变负，故 $f$ 在 $x = ${r2}$ 处取得局部极大值。`,
              )
            : t(
                `At $x = ${r1}$, $f'(x)$ does not change sign. At $x = ${r3}$, $f'(x)$ changes from negative to positive, so $f$ has a local minimum at $x = ${r3}$.`,
                `在 $x = ${r1}$ 处 $f'(x)$ 不变号；在 $x = ${r3}$ 处 $f'(x)$ 由负变正，故 $f$ 在 $x = ${r3}$ 处取得局部极小值。`,
              ),
        });
      },
    },
  ],
};

/** findingDerivativesUsingAGraphingCalculator practices computing symmetric difference quotients and recognizing numerical derivative artifacts at sharp corners. */
export const findingDerivativesUsingAGraphingCalculator: TopicDef = {
  id: "finding-derivatives-using-a-graphing-calculator",
  title: t("Finding Derivatives Using a Graphing Calculator", "用图形计算器求导数"),
  summary: t(
    "Evaluate numerical derivatives using the calculator's symmetric difference quotient command and recognize its behavior at sharp corners.",
    "使用计算器的对称差商求导命令计算数值导数，并理解其在尖角不可导点处的表现。",
  ),
  prerequisites: ["evaluating-expressions-using-a-graphing-calculator", "estimating-derivatives-using-a-central-difference-quotient"],
  encompasses: [{ topic: "estimating-derivatives-using-a-central-difference-quotient", weight: 0.7 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "numerical-derivative-command-and-symmetric-difference",
      figure: calculusDrawings5["finding-derivatives-using-a-graphing-calculator#numerical-derivative-command-and-symmetric-difference"],
      title: t("The Numerical Derivative Command (nDeriv)", "数值求导命令（nDeriv）与对称差商"),
      explanation: t(
        "Graphing calculators compute numerical derivatives (`nDeriv`) using the symmetric difference quotient $\\frac{f(a + h) - f(a - h)}{2h}$ with step size $h$. While this is exact for quadratic functions, for a cubic $f(x) = kx^3$ it gives $\\frac{k(a+h)^3 - k(a-h)^3}{2h} = 3ka^2 + kh^2$, which differs from the exact derivative $3ka^2$ by $kh^2$.",
        "图形计算器使用步长为 $h$ 的对称差商 $\\frac{f(a + h) - f(a - h)}{2h}$ 来计算数值导数（`nDeriv`）。对于二次函数该公式精确成立，但对于三次函数 $f(x) = kx^3$，对称差商等于 $\\frac{k(a+h)^3 - k(a-h)^3}{2h} = 3ka^2 + kh^2$，与精确导数 $3ka^2$ 相差 $kh^2$。",
      ),
      generate: (rng: Rng) => {
        const a = rng.int(2, 6);
        const yMinus = rng.int(3, 15);
        const yCenter = yMinus + rng.int(2, 9);
        const yPlus = yCenter + rng.int(4, 15);
        // Step h = 0.1 = 1/10, so (f(a+h) - f(a-h)) / (2h) = (yPlus - yMinus) / (2/10) = 5 * (yPlus - yMinus)
        const ans = 5 * (yPlus - yMinus);
        const forward = 10 * (yPlus - yCenter);
        const backward = 10 * (yCenter - yMinus);
        return numberProblem({
          prompt: t(
            `A graphing calculator's numerical derivative command approximates $f'(${a})$ using the symmetric difference quotient $\\frac{f(${a} + h) - f(${a} - h)}{2h}$ with step $h = 0.1$. Given the calculator table values $f(${a - 0.1}) = ${yMinus}$, $f(${a}) = ${yCenter}$, and $f(${a + 0.1}) = ${yPlus}$, what value does this symmetric difference quotient produce?`,
            `图形计算器的数值求导功能使用步长为 $h = 0.1$ 的对称差商 $\\frac{f(${a} + h) - f(${a} - h)}{2h}$ 来近似 $f'(${a})$。已知计算器数值表给出 $f(${a - 0.1}) = ${yMinus}$，$f(${a}) = ${yCenter}$，$f(${a + 0.1}) = ${yPlus}$，该对称差商计算出的值是多少？`,
          ),
          answer: ans,
          wrong: [forward, backward, yPlus - yMinus],
          solution: t(
            `Substitute $f(${a + 0.1}) = ${yPlus}$, $f(${a - 0.1}) = ${yMinus}$, and $2h = 0.2$: $\\frac{${yPlus} - ${yMinus}}{0.2} = 5(${yPlus - yMinus}) = ${ans}$.`,
            `代入 $f(${a + 0.1}) = ${yPlus}$、$f(${a - 0.1}) = ${yMinus}$ 与 $2h = 0.2$：$\\frac{${yPlus} - ${yMinus}}{0.2} = 5(${yPlus - yMinus}) = ${ans}$。`,
          ),
        });
      },
    },
    {
      id: "limitations-of-numerical-derivatives-at-corners",
      title: t("Recognizing False Numerical Derivatives at Non-Differentiable Points", "识别不可导点处的伪数值导数"),
      explanation: t(
        "Because `nDeriv` uses the symmetric difference quotient $\\frac{f(a+h) - f(a-h)}{2h}$, it can return a finite number even when $f'(a)$ does not exist! For example, at the corner of $f(x) = k|x - a| + mx$, the left and right slopes are $m - k$ and $m + k$, so the symmetric difference quotient averages them to $m$ even though $f$ is not differentiable at $x = a$.",
        "由于 `nDeriv` 使用对称差商 $\\frac{f(a+h) - f(a-h)}{2h}$，即使 $f'(a)$ 不存在，它仍可能返回一个有限数值！例如在折点函数 $f(x) = k|x - a| + mx$ 的 $x = a$ 处，左、右斜率分别为 $m - k$ 与 $m + k$，尽管 $f$ 在 $x = a$ 处不可导，对称差商仍会返回两者的平均值 $m$。",
      ),
      generate: (rng: Rng) => {
        const k = rng.int(2, 8);
        const m = rng.int(1, 7);
        const a = rng.int(1, 6);
        const inside = linear(1, -a);
        return numberProblem({
          prompt: t(
            `The function $f(x) = ${k}|${inside}| + ${poly([m, "x"])}$ has a sharp corner at $x = ${a}$, so $f'(${a})$ does not exist. What misleading numerical value does a calculator's symmetric difference quotient $\\frac{f(${a}+h) - f(${a}-h)}{2h}$ report at $x = ${a}$?`,
            `函数 $f(x) = ${k}|${inside}| + ${poly([m, "x"])}$ 在 $x = ${a}$ 处有尖角，故 $f'(${a})$ 不存在。计算器的对称差商 $\\frac{f(${a}+h) - f(${a}-h)}{2h}$ 在 $x = ${a}$ 处会报告什么具有误导性的数值？`,
          ),
          answer: m,
          wrong: [k, m + k, m - k],
          solution: t(
            `For $h > 0$, the $|${inside}|$ terms cancel in $f(${a}+h) - f(${a}-h) = (${k}h + ${m}\\cdot ${a} + ${m}h) - (${k}h + ${m}\\cdot ${a} - ${m}h) = ${2 * m}h$. Dividing by $2h$ gives the average of the left and right slopes, $${m}$.`,
            `当 $h > 0$ 时，$f(${a}+h) - f(${a}-h) = (${k}h + ${m}\\cdot ${a} + ${m}h) - (${k}h + ${m}\\cdot ${a} - ${m}h) = ${2 * m}h$，其中 $|${inside}|$ 项相互抵消。除以 $2h$ 得到左、右斜率的平均值 $${m}$。`,
          ),
        });
      },
    },
  ],
};

/** findingDefiniteIntegralsUsingAGraphingCalculator practices combining calculator definite integrals with the Fundamental Theorem of Calculus and absolute-value integrands. */
export const findingDefiniteIntegralsUsingAGraphingCalculator: TopicDef = {
  id: "finding-definite-integrals-using-a-graphing-calculator",
  title: t("Finding Definite Integrals Using a Graphing Calculator", "用图形计算器求定积分"),
  summary: t(
    "Use numerical integration (fnInt) with the Fundamental Theorem of Calculus and absolute-value integrands to compute net change and total distance.",
    "结合微积分基本定理与绝对值被积函数，使用数值积分（fnInt）计算净变化量与总路程。",
  ),
  prerequisites: ["finding-derivatives-using-a-graphing-calculator", "the-fundamental-theorem-of-calculus"],
  encompasses: [{ topic: "the-fundamental-theorem-of-calculus", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "numerical-integration-and-accumulation",
      figure: calculusDrawings5["finding-definite-integrals-using-a-graphing-calculator#numerical-integration-and-accumulation"],
      title: t("Computing Definite Integrals and Net Change with fnInt", "用数值积分（fnInt）计算定积分与净变化量"),
      explanation: t(
        "The calculator's numerical integration command (`fnInt`) approximates $\\int_a^b f'(x)\\,dx$ even when $f'(x)$ has no elementary antiderivative (such as $f'(x) = \\sin(x^2)$). Combined with the Fundamental Theorem of Calculus, $f(b) = f(a) + \\int_a^b f'(x)\\,dx$, this determines $f(b)$ from an initial value and a calculator integral.",
        "即使 $f'(x)$ 没有初等原函数（如 $f'(x) = \\sin(x^2)$），计算器的数值积分命令（`fnInt`）仍能高精度计算 $\\int_a^b f'(x)\\,dx$。结合微积分基本定理 $f(b) = f(a) + \\int_a^b f'(x)\\,dx$，可由初始值与计算器定积分求出 $f(b)$。",
      ),
      generate: (rng: Rng) => {
        const y0 = rng.int(10, 40);
        const i1 = rng.int(8, 25);
        const i2 = -rng.int(5, 20);
        const a = rng.int(1, 3);
        const b = a + rng.int(2, 3);
        const c = b + rng.int(2, 3);
        const fb = y0 + i1;
        const fc = fb + i2;
        return numberProblem({
          prompt: t(
            `A function $f$ satisfies $f(${a}) = ${y0}$ and has derivative $f'(x)$ with critical points at $x = ${b}$ and $x = ${c}$. Using a graphing calculator's \`fnInt\` command, you find $\\int_{${a}}^{${b}} f'(x)\\,dx = ${i1}$ and $\\int_{${b}}^{${c}} f'(x)\\,dx = ${i2}$. What is the value of $f(${c})$?`,
            `函数 $f$ 满足 $f(${a}) = ${y0}$，其导函数 $f'(x)$ 的驻点为 $x = ${b}$ 与 $x = ${c}$。使用图形计算器的 \`fnInt\` 命令求得 $\\int_{${a}}^{${b}} f'(x)\\,dx = ${i1}$ 且 $\\int_{${b}}^{${c}} f'(x)\\,dx = ${i2}$。求 $f(${c})$ 的值。`,
          ),
          answer: fc,
          wrong: [fb, y0 + i1 - i2, i1 + i2],
          solution: t(
            `By the Fundamental Theorem of Calculus, $f(${c}) = f(${a}) + \\int_{${a}}^{${b}} f'(x)\\,dx + \\int_{${b}}^{${c}} f'(x)\\,dx = ${y0} + ${i1} + (${i2}) = ${fc}$.`,
            `由微积分基本定理，$f(${c}) = f(${a}) + \\int_{${a}}^{${b}} f'(x)\\,dx + \\int_{${b}}^{${c}} f'(x)\\,dx = ${y0} + ${i1} + (${i2}) = ${fc}$。`,
          ),
        });
      },
    },
    {
      id: "total-distance-and-absolute-value-integrals-on-calculators",
      figure:
        calculusDrawings5[
          "finding-definite-integrals-using-a-graphing-calculator#total-distance-and-absolute-value-integrals-on-calculators"
        ],
      title: t("Integrating Absolute Value for Total Area and Distance", "对绝对值函数数值积分求总面积与总路程"),
      explanation: t(
        "On a graphing calculator, entering $\\int_a^b |v(t)|\\,dt$ using `abs(` computes total distance traveled without splitting the integral at zeros of $v(t)$. Comparing the signed displacement integral $\\int_a^b v(t)\\,dt$ with the total distance integral $\\int_a^b |v(t)|\\,dt$ reveals how far the particle moved in each direction.",
        "在图形计算器中使用 `abs(` 直接输入 $\\int_a^b |v(t)|\\,dt$，即可在不分段的情况下求出总路程。比较有向位移积分 $\\int_a^b v(t)\\,dt$ 与总路程积分 $\\int_a^b |v(t)|\\,dt$，还能算出质点沿正、负方向各自移动的距离。",
      ),
      generate: (rng: Rng) => {
        const backwardDist = rng.int(6, 22);
        const forwardDist = rng.int(10, 30);
        const t1 = rng.int(2, 4);
        const t2 = t1 + rng.int(2, 5);
        const net = forwardDist - backwardDist;
        const total = forwardDist + backwardDist;
        const askTotal = rng.bool();
        return numberProblem({
          prompt: askTotal
            ? t(
                `A particle moves along a line so that $v(t) \\le 0$ on $[0, ${t1}]$ and $v(t) \\ge 0$ on $[${t1}, ${t2}]$. A calculator gives $\\int_0^{${t1}} v(t)\\,dt = -${backwardDist}$ and $\\int_{${t1}}^{${t2}} v(t)\\,dt = ${forwardDist}$. What value does the calculator return for the single absolute-value integral $\\int_0^{${t2}} |v(t)|\\,dt$?`,
                `质点沿直线运动，在 $[0, ${t1}]$ 上 $v(t) \\le 0$，在 $[${t1}, ${t2}]$ 上 $v(t) \\ge 0$。计算器给出 $\\int_0^{${t1}} v(t)\\,dt = -${backwardDist}$ 且 $\\int_{${t1}}^{${t2}} v(t)\\,dt = ${forwardDist}$。计算器对单个绝对值积分 $\\int_0^{${t2}} |v(t)|\\,dt$ 返回的值是多少？`,
              )
            : t(
                `For a particle moving on $0 \\le t \\le ${t2}$, a graphing calculator gives the net displacement $\\int_0^{${t2}} v(t)\\,dt = ${net}$ and the total distance $\\int_0^{${t2}} |v(t)|\\,dt = ${total}$. What is the total distance the particle traveled in the negative direction (where $v(t) < 0$)?`,
                `对于在 $0 \\le t \\le ${t2}$ 上运动的质点，图形计算器给出净位移 $\\int_0^{${t2}} v(t)\\,dt = ${net}$ 以及总路程 $\\int_0^{${t2}} |v(t)|\\,dt = ${total}$。求质点向负方向（即 $v(t) < 0$ 时）运动的总距离。`,
              ),
          answer: askTotal ? total : backwardDist,
          wrong: askTotal ? [net, forwardDist, backwardDist] : [forwardDist, total, Math.abs(net)],
          solution: askTotal
            ? t(
                `The absolute-value integral adds the magnitudes of motion on both intervals: $\\int_0^{${t2}} |v(t)|\\,dt = |-${backwardDist}| + ${forwardDist} = ${total}$.`,
                `绝对值积分将两段区间上运动距离的绝对值相加：$\\int_0^{${t2}} |v(t)|\\,dt = |-${backwardDist}| + ${forwardDist} = ${total}$。`,
              )
            : t(
                `Let $D_+$ and $D_-$ be the distances traveled in the positive and negative directions. Since $D_+ + D_- = ${total}$ and $D_+ - D_- = ${net}$, subtracting gives $2D_- = ${total - net}$, so $D_- = ${backwardDist}$.`,
                `设质点向正、负方向运动的距离分别为 $D_+$ 与 $D_-$。由 $D_+ + D_- = ${total}$ 且 $D_+ - D_- = ${net}$，两式相减得 $2D_- = ${total - net}$，故 $D_- = ${backwardDist}$。`,
              ),
        });
      },
    },
  ],
};

/** findingImproperIntegralsUsingAGraphingCalculator practices approximating improper integrals numerically by truncating infinite intervals or vertical asymptotes. */
export const findingImproperIntegralsUsingAGraphingCalculator: TopicDef = {
  id: "finding-improper-integrals-using-a-graphing-calculator",
  title: t("Finding Improper Integrals Using a Graphing Calculator", "用图形计算器求反常积分"),
  summary: t(
    "Approximate improper integrals on a calculator by evaluating definite integrals over successively larger upper bounds or bounds approaching a vertical asymptote.",
    "通过依次增大积分上限或令积分限逼近垂直渐近线，在计算器上用定积分近似反常积分。",
  ),
  prerequisites: ["finding-definite-integrals-using-a-graphing-calculator", "improper-integrals"],
  encompasses: [
    { topic: "finding-definite-integrals-using-a-graphing-calculator", weight: 0.4 },
    { topic: "improper-integrals", weight: 0.3 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "approximating-infinite-interval-integrals-with-large-bounds",
      figure:
        calculusDrawings5[
          "finding-improper-integrals-using-a-graphing-calculator#approximating-infinite-interval-integrals-with-large-bounds"
        ],
      title: t("Estimating Improper Integrals Over Infinite Intervals", "用大上限估计无穷区间上的反常积分"),
      explanation: t(
        "Standard graphing calculators require finite limits of integration in `fnInt`. To investigate $\\int_a^{\\infty} f(x)\\,dx$ numerically, evaluate $I(B) = \\int_a^B f(x)\\,dx$ for successively larger values of $B$ (such as $B = 10, 100, 1000$). The truncation error committed by stopping at $x = B$ is the tail integral $\\int_B^{\\infty} f(x)\\,dx$.",
        "标准图形计算器的数值积分功能（`fnInt`）要求积分上下限为有限数。要数值研究反常积分 $\\int_a^{\\infty} f(x)\\,dx$，可依次取越来越大的上限 $B$（如 $B = 10, 100, 1000$）计算 $I(B) = \\int_a^B f(x)\\,dx$。在 $x = B$ 处截断所产生的截断误差即为尾积分 $\\int_B^{\\infty} f(x)\\,dx$。",
      ),
      generate: (rng: Rng) => {
        const k = rng.int(2, 9);
        const a = rng.int(1, 4);
        const B = rng.pick([10, 20, 50, 100] as const);
        const exactLim = Q.of(k, a);
        const truncVal = Q.of(k * (B - a), a * B);
        const tailErr = Q.of(k, B);
        const askTrunc = rng.bool();
        return numberProblem({
          prompt: askTrunc
            ? t(
                `To approximate the improper integral $\\int_{${a}}^{\\infty} \\frac{${k}}{x^2}\\,dx$ on a graphing calculator, you enter the finite integral $I(${B}) = \\int_{${a}}^{${B}} \\frac{${k}}{x^2}\\,dx$. What exact value does $I(${B})$ equal?`,
                `为在图形计算器上近似反常积分 $\\int_{${a}}^{\\infty} \\frac{${k}}{x^2}\\,dx$，输入有限定积分 $I(${B}) = \\int_{${a}}^{${B}} \\frac{${k}}{x^2}\\,dx$。$I(${B})$ 的精确值是多少？`,
              )
            : t(
                `When approximating $\\int_{${a}}^{\\infty} \\frac{${k}}{x^2}\\,dx$ on a calculator by truncating the upper bound at $B = ${B}$, what is the exact truncation error $\\int_{${B}}^{\\infty} \\frac{${k}}{x^2}\\,dx$?`,
                `在计算器上将上限截断为 $B = ${B}$ 来近似反常积分 $\\int_{${a}}^{\\infty} \\frac{${k}}{x^2}\\,dx$ 时，精确截断误差 $\\int_{${B}}^{\\infty} \\frac{${k}}{x^2}\\,dx$ 是多少？`,
              ),
          answer: askTrunc ? truncVal : tailErr,
          wrong: askTrunc ? [exactLim, tailErr, Q.of(k, a * a)] : [exactLim, truncVal, Q.of(k, B * B)],
          solution: askTrunc
            ? t(
                `Using the antiderivative $-\\frac{${k}}{x}$, the finite calculator integral is $I(${B}) = \\frac{${k}}{${a}} - \\frac{${k}}{${B}} = ${truncVal.toLatex()}$.`,
                `利用原函数 $-\\frac{${k}}{x}$，有限计算器积分为 $I(${B}) = \\frac{${k}}{${a}} - \\frac{${k}}{${B}} = ${truncVal.toLatex()}$。`,
              )
            : t(
                `Using the antiderivative $-\\frac{${k}}{x}$, the tail integral from $x = ${B}$ to $\\infty$ equals $\\frac{${k}}{${B}} = ${tailErr.toLatex()}$.`,
                `利用原函数 $-\\frac{${k}}{x}$，从 $x = ${B}$ 到 $\\infty$ 的尾积分等于 $\\frac{${k}}{${B}} = ${tailErr.toLatex()}$。`,
              ),
        });
      },
    },
    {
      id: "improper-integrals-near-vertical-asymptotes-with-technology",
      figure:
        calculusDrawings5[
          "finding-improper-integrals-using-a-graphing-calculator#improper-integrals-near-vertical-asymptotes-with-technology"
        ],
      title: t("Investigating Vertical Asymptotes Numerically", "用数值方法研究垂直渐近线处的反常积分"),
      explanation: t(
        "For an improper integral $\\int_a^b f(x)\\,dx$ with a vertical asymptote at $x = a$, replace the lower bound with $a + \\varepsilon$ for a small positive number $\\varepsilon$ (such as $0.01$ or $0.0001$) and evaluate $J(\\varepsilon) = \\int_{a+\\varepsilon}^b f(x)\\,dx$ on the calculator.",
        "对于在 $x = a$ 处有垂直渐近线的反常积分 $\\int_a^b f(x)\\,dx$，可将下限替换为 $a + \\varepsilon$（其中 $\\varepsilon$ 为很小的正数，如 $0.01$ 或 $0.0001$），并在计算器上计算 $J(\\varepsilon) = \\int_{a+\\varepsilon}^b f(x)\\,dx$。",
      ),
      generate: (rng: Rng) => {
        const k = rng.int(1, 8);
        const m = rng.int(2, 7);
        const a = rng.int(1, 5);
        const b = a + m * m;
        const n = rng.pick([10, 100] as const);
        // eps = 1/n^2, so sqrt(eps) = 1/n. J(eps) = 2k*m - 2k/n, error = 2k/n
        const epsTex = n === 10 ? "0.01" : "0.0001";
        const fullLim = Q.of(2 * k * m);
        const err = Q.of(2 * k, n);
        const jVal = fullLim.sub(err);
        const inside = linear(1, -a);
        const askJ = rng.bool();
        return numberProblem({
          prompt: askJ
            ? t(
                `To approximate $\\int_{${a}}^{${b}} \\frac{${k}}{\\sqrt{${inside}}}\\,dx$ on a calculator, you offset the vertical asymptote at $x = ${a}$ by $\\varepsilon = ${epsTex}$ and compute $J(${epsTex}) = \\int_{${a + (n === 10 ? 0.01 : 0.0001)}}^{${b}} \\frac{${k}}{\\sqrt{${inside}}}\\,dx$. What exact value does $J(${epsTex})$ equal?`,
                `为在计算器上近似反常积分 $\\int_{${a}}^{${b}} \\frac{${k}}{\\sqrt{${inside}}}\\,dx$，将 $x = ${a}$ 处的垂直渐近线偏移 $\\varepsilon = ${epsTex}$，计算 $J(${epsTex}) = \\int_{${a + (n === 10 ? 0.01 : 0.0001)}}^{${b}} \\frac{${k}}{\\sqrt{${inside}}}\\,dx$。$J(${epsTex})$ 的精确值是多少？`,
              )
            : t(
                `When approximating $\\int_{${a}}^{${b}} \\frac{${k}}{\\sqrt{${inside}}}\\,dx$ by the finite calculator integral $J(${epsTex}) = \\int_{${a + (n === 10 ? 0.01 : 0.0001)}}^{${b}} \\frac{${k}}{\\sqrt{${inside}}}\\,dx$, by how much does $J(${epsTex})$ underestimate the exact improper integral?`,
                `用有限计算器积分 $J(${epsTex}) = \\int_{${a + (n === 10 ? 0.01 : 0.0001)}}^{${b}} \\frac{${k}}{\\sqrt{${inside}}}\\,dx$ 近似反常积分 $\\int_{${a}}^{${b}} \\frac{${k}}{\\sqrt{${inside}}}\\,dx$ 时，$J(${epsTex})$ 比精确反常积分小多少？`,
              ),
          answer: askJ ? jVal : err,
          wrong: askJ ? [fullLim, err, Q.of(k * m)] : [fullLim, jVal, Q.of(k, n)],
          solution: askJ
            ? t(
                `Evaluating the antiderivative $2\\cdot ${k}\\sqrt{${inside}} = ${2 * k}\\sqrt{${inside}}$ from $x = ${a} + ${epsTex}$ to $x = ${b}$ gives $${2 * k}(${m}) - ${2 * k}\\sqrt{${epsTex}} = ${2 * k * m} - \\frac{${2 * k}}{${n}} = ${jVal.toLatex()}$.`,
                `将原函数 $${2 * k}\\sqrt{${inside}}$ 从 $x = ${a} + ${epsTex}$ 到 $x = ${b}$ 求值，得 $${2 * k}(${m}) - ${2 * k}\\sqrt{${epsTex}} = ${2 * k * m} - \\frac{${2 * k}}{${n}} = ${jVal.toLatex()}$。`,
              )
            : t(
                `The omitted integral on $[${a}, ${a} + ${epsTex}]$ equals $${2 * k}\\sqrt{${epsTex}} = \\frac{${2 * k}}{${n}} = ${err.toLatex()}$.`,
                `在 $[${a}, ${a} + ${epsTex}]$ 上被略去的积分等于 $${2 * k}\\sqrt{${epsTex}} = \\frac{${2 * k}}{${n}} = ${err.toLatex()}$。`,
              ),
        });
      },
    },
  ],
};

/** exploringFunctionsUsingTechnology practices locating inflection points and intervals of simultaneous monotonicity and concavity from calculator graphs of derivatives. */
export const exploringFunctionsUsingTechnology: TopicDef = {
  id: "exploring-functions-using-technology",
  title: t("Exploring Functions Using Technology", "利用技术探索函数"),
  summary: t(
    "Analyze inflection points and intervals of simultaneous monotonicity and concavity by graphing f'(x) and f''(x).",
    "通过绘制 f'(x) 与 f''(x) 的图像，分析原函数的拐点以及同时满足单调性与凹凸性条件的区间。",
  ),
  prerequisites: [
    "finding-extrema-of-functions-using-a-graphing-calculator",
    "finding-derivatives-using-a-graphing-calculator",
    "points-of-inflection",
  ],
  encompasses: [
    { topic: "finding-extrema-of-functions-using-a-graphing-calculator", weight: 0.4 },
    { topic: "points-of-inflection", weight: 0.4 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "finding-inflection-points-from-derivative-extrema",
      title: t("Locating Inflection Points via Local Extrema of the Derivative", "通过导函数的局部极值定位拐点"),
      explanation: t(
        "When a calculator problem gives the formula for $f'(x)$, you do not need to differentiate $f'(x)$ by hand to find the inflection points of $f$. Because $f''(x)$ changes sign wherever $f'(x)$ changes from increasing to decreasing (or vice versa), the inflection points of $f$ occur at the $x$-coordinates of the local extrema of $Y_1 = f'(x)$.",
        "当计算器题目给出导函数 $f'(x)$ 的表达式时，无需手动对 $f'(x)$ 求导即可找出 $f$ 的拐点。因为每当 $f'(x)$ 由递增变为递减（或由递减变为递增）时，$f''(x)$ 就会变号，所以原函数 $f$ 的拐点恰好出现在导函数 $Y_1 = f'(x)$ 的局部极值点的横坐标处。",
      ),
      generate: (rng: Rng) => {
        const z1 = rng.int(1, 2);
        const x1 = z1 + rng.int(1, 2);
        const z2 = x1 + rng.int(1, 2);
        const x2 = z2 + rng.int(1, 2);
        const y1 = rng.int(3, 9);
        const y2 = -rng.int(2, 7);
        const askMaxSlope = rng.bool();
        return numberProblem({
          prompt: askMaxSlope
            ? t(
                `By graphing $Y_1 = f'(x)$ on a calculator, you find zeros at $x = ${z1}$ and $x = ${z2}$, a local maximum of $f'(x)$ at $(${x1}, ${y1})$, and a local minimum of $f'(x)$ at $(${x2}, ${y2})$. At the smaller inflection point $x$-coordinate of $f$, what is the slope of the tangent line to the graph of $f$?`,
                `在计算器上绘制 $Y_1 = f'(x)$，测得零点为 $x = ${z1}$ 与 $x = ${z2}$，$f'(x)$ 的局部极大值点为 $(${x1}, ${y1})$，局部极小值点为 $(${x2}, ${y2})$。在原函数 $f$ 横坐标较小的那个拐点处，$f$ 图像的切线斜率是多少？`,
              )
            : t(
                `By graphing $Y_1 = f'(x)$ on a calculator, you find zeros at $x = ${z1}$ and $x = ${z2}$, a local maximum of $f'(x)$ at $(${x1}, ${y1})$, and a local minimum of $f'(x)$ at $(${x2}, ${y2})$. At which $x$-coordinate does the graph of $f$ change from concave down to concave up?`,
                `在计算器上绘制 $Y_1 = f'(x)$，测得零点为 $x = ${z1}$ 与 $x = ${z2}$，$f'(x)$ 的局部极大值点为 $(${x1}, ${y1})$，局部极小值点为 $(${x2}, ${y2})$。原函数 $f$ 的图像在哪个横坐标 $x$ 处由下凹变为上凹？`,
              ),
          answer: askMaxSlope ? y1 : x2,
          wrong: askMaxSlope ? [x1, z1, y2] : [z2, x1, y2],
          solution: askMaxSlope
            ? t(
                `Inflection points of $f$ occur at local extrema of $f'(x)$, namely $x = ${x1}$ and $x = ${x2}$ (not at the zeros $x = ${z1}, ${z2}$). At $x = ${x1}$, the tangent slope of $f$ is $f'(${x1}) = ${y1}$.`,
                `原函数 $f$ 的拐点出现在导函数 $f'(x)$ 的局部极值点 $x = ${x1}$ 与 $x = ${x2}$ 处（而非零点 $x = ${z1}, ${z2}$ 处）。在 $x = ${x1}$ 处，$f$ 的切线斜率为 $f'(${x1}) = ${y1}$。`,
              )
            : t(
                `The graph of $f$ is concave down where $f'(x)$ is decreasing and concave up where $f'(x)$ is increasing. Since $f'(x)$ changes from decreasing to increasing at its local minimum $(${x2}, ${y2})$, $f$ changes from concave down to concave up at $x = ${x2}$.`,
                `当 $f'(x)$ 递减时 $f$ 下凹，当 $f'(x)$ 递增时 $f$ 上凹。由于 $f'(x)$ 在其局部极小值点 $(${x2}, ${y2})$ 处由递减变为递增，故 $f$ 在 $x = ${x2}$ 处由下凹变为上凹。`,
              ),
        });
      },
    },
    {
      id: "simultaneous-monotonicity-and-concavity-conditions",
      figure: calculusDrawings5["exploring-functions-using-technology#simultaneous-monotonicity-and-concavity-conditions"],
      title: t("Finding Intervals Where Two Calculus Conditions Hold", "确定同时满足两个微积分性质的区间"),
      explanation: t(
        "By graphing $Y_1 = f'(x)$ and $Y_2 = f''(x)$ in the same viewing window, you can quickly identify intervals where both functions have prescribed signs—for example, where $f$ is both increasing ($f'(x) > 0$) and concave down ($f''(x) < 0$), or where a particle's speed is increasing ($v(t)$ and $a(t)$ have the same sign).",
        "通过在同一个视图窗口中同时绘制 $Y_1 = f'(x)$ 与 $Y_2 = f''(x)$，可以快速确定两个函数同时具有特定符号的区间——例如 $f$ 既递增（$f'(x) > 0$）又下凹（$f''(x) < 0$）的区间，或者质点速率增加（$v(t)$ 与 $a(t)$ 同号）的时间段。",
      ),
      generate: (rng: Rng) => {
        const r1 = rng.int(1, 5);
        const r2 = r1 + rng.int(3, 9);
        const a = rng.int(1, 4);
        const mid = Q.of(r1 + r2, 2);
        const len = Q.of(r2 - r1, 2);
        const fac1 = linear(1, -r1);
        const fac2 = linear(1, -r2);
        const coeff = a === 1 ? "-" : `-${a}`;
        return numberProblem({
          prompt: t(
            `You graph $Y_1 = f'(x) = ${coeff}(${fac1})(${fac2})$ and $Y_2 = f''(x) = ${poly([-2 * a, "x"], [a * (r1 + r2), ""])}$ on a calculator. What is the length of the interval on which $f$ is both increasing and concave up?`,
            `在计算器上绘制 $Y_1 = f'(x) = ${coeff}(${fac1})(${fac2})$ 与 $Y_2 = f''(x) = ${poly([-2 * a, "x"], [a * (r1 + r2), ""])}$。函数 $f$ 既递增又上凹的区间长度是多少？`,
          ),
          answer: len,
          wrong: [r2 - r1, mid, Q.of(r2 - r1, 4)],
          solution: t(
            `The function $f$ is increasing where $f'(x) > 0$, which is $(${r1}, ${r2})$, and concave up where $f''(x) > 0$, which is $(-\\infty, ${mid.toLatex()})$. Their intersection is $(${r1}, ${mid.toLatex()})$, which has length $${mid.toLatex()} - ${r1} = ${len.toLatex()}$.`,
            `当 $f'(x) > 0$ 即 $x \\in (${r1}, ${r2})$ 时 $f$ 递增；当 $f''(x) > 0$ 即 $x \\in (-\\infty, ${mid.toLatex()})$ 时 $f$ 上凹。两区间的交集为 $(${r1}, ${mid.toLatex()})$，其长度为 $${mid.toLatex()} - ${r1} = ${len.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** tracedCurve samples a curve given by its parameter from 0 to 2π. */
const tracedCurve = (at: (u: number) => readonly [number, number]) => Array.from({ length: 241 }, (_, i) => at((i * Math.PI) / 120));

/** parametricModeFigure draws x = 4 cos t, y = 3 sin 2t with its velocity arrow at t = π/6. */
const parametricModeFigure: Figure = (() => {
  const start: readonly [number, number] = [2 * Math.sqrt(3), (3 * Math.sqrt(3)) / 2];
  return {
    svg: plane({ xMin: -6, xMax: 6, yMin: -5, yMax: 5 }, [
      { kind: "path", points: tracedCurve((u) => [4 * Math.cos(u), 3 * Math.sin(2 * u)]), accent: true },
      { kind: "arrow", from: start, to: [start[0] - 1, start[1] + 1.5] },
      { kind: "point", at: start, accent: true },
    ]),
    alt: t(
      "A figure-eight curve x = 4 cos t, y = 3 sin 2t, with an arrow showing the velocity at t = π/6, pointing up and to the left.",
      "8 字形曲线 x = 4 cos t，y = 3 sin 2t，箭头表示 t = π/6 时的速度，指向左上方。",
    ),
  };
})();

/** polarModeFigure draws the cardioid r = 2 + 2 cos θ with its radius at θ = π/2. */
const polarModeFigure: Figure = {
  svg: plane({ xMin: -3, xMax: 6, yMin: -4, yMax: 4 }, [
    {
      kind: "path",
      points: tracedCurve((u) => [(2 + 2 * Math.cos(u)) * Math.cos(u), (2 + 2 * Math.cos(u)) * Math.sin(u)]),
      accent: true,
    },
    { kind: "segment", a: [0, 0], b: [0, 2], dashed: true },
    { kind: "point", at: [0, 2], accent: true },
  ]),
  alt: t(
    "The cardioid r = 2 + 2 cos θ, with a dashed radius from the origin to the point (0, 2) at θ = π/2.",
    "心形线 r = 2 + 2 cos θ，一条虚线极径从原点连到 θ = π/2 处的点 (0, 2)。",
  ),
};

/** plottingParametricAndPolarCurvesUsingTechnology practices using parametric and polar calculator modes with numerical derivatives and integrals. */
export const plottingParametricAndPolarCurvesUsingTechnology: TopicDef = {
  id: "plotting-parametric-and-polar-curves-using-technology",
  title: t("Plotting Parametric and Polar Curves Using Technology", "利用技术绘制参数曲线与极坐标曲线"),
  summary: t(
    "Plot parametric and polar curves on a calculator to compute speed, tangent slopes, and polar curve rates of change.",
    "在计算器上绘制参数曲线与极坐标曲线，以计算质点速率、切线斜率以及极坐标曲线的变化率。",
  ),
  prerequisites: ["exploring-functions-using-technology", "differentiating-curves-given-in-polar-form"],
  encompasses: [{ topic: "differentiating-curves-given-in-polar-form", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "parametric-mode-tracing-and-direction",
      title: t("Tracing Parametric Curves and Speed in Parametric Mode", "参数模式下的曲线追踪与速率计算"),
      explanation: t(
        "In Parametric (`PAR`) mode, a graphing calculator plots $(x(t), y(t))$ as $t$ increases from $T_{\\min}$ to $T_{\\max}$ in steps of $T_{\\text{step}}$. Combining numerical derivatives `nDeriv` of $x(t)$ and $y(t)$ lets you compute the slope $\\frac{dy}{dx} = \\frac{y'(t)}{x'(t)}$ and the speed $\\sqrt{(x'(t))^2 + (y'(t))^2}$.\n\nThe figure shows $x = 4\\cos t$, $y = 3\\sin 2t$ for $0 \\le t \\le 2\\pi$, with the velocity arrow at $t = \\frac{\\pi}{6}$: there $x' = -2$ and $y' = 3$, so the slope is $-\\frac{3}{2}$ and the speed is $\\sqrt{13}$.",
        "在参数（`PAR`）模式下，图形计算器令 $t$ 从 $T_{\\min}$ 以步长 $T_{\\text{step}}$ 递增到 $T_{\\max}$，依次绘制点 $(x(t), y(t))$。结合 $x(t)$ 与 $y(t)$ 的数值导数 `nDeriv`，可以求出切线斜率 $\\frac{dy}{dx} = \\frac{y'(t)}{x'(t)}$ 以及速率 $\\sqrt{(x'(t))^2 + (y'(t))^2}$。\n\n图中是 $x = 4\\cos t$，$y = 3\\sin 2t$（$0 \\le t \\le 2\\pi$），箭头表示 $t = \\frac{\\pi}{6}$ 时的速度：此时 $x' = -2$，$y' = 3$，所以斜率为 $-\\frac{3}{2}$，速率为 $\\sqrt{13}$。",
      ),
      figure: parametricModeFigure,
      generate: (rng: Rng) => {
        const [dx, dy, hyp] = rng.pick([
          [3, 4, 5],
          [5, 12, 13],
          [6, 8, 10],
          [8, 15, 17],
          [9, 12, 15],
        ] as const);
        const t0 = rng.int(1, 5);
        const xPos = rng.int(2, 9);
        const yPos = rng.int(2, 9);
        const signX = rng.bool() ? 1 : -1;
        const signY = rng.bool() ? 1 : -1;
        const vx = signX * dx;
        const vy = signY * dy;
        const askSlope = rng.bool();
        const slope = Q.of(vy, vx);
        return numberProblem({
          prompt: askSlope
            ? t(
                `In Parametric mode, a graphing calculator traces $(x(t), y(t))$ to the point $(x(${t0}), y(${t0})) = (${xPos}, ${yPos})$ and reports the numerical derivatives $x'(${t0}) = ${vx}$ and $y'(${t0}) = ${vy}$. What is the slope $\\frac{dy}{dx}$ of the tangent line to the curve at $t = ${t0}$?`,
                `在参数模式下，图形计算器追踪曲线 $(x(t), y(t))$ 至点 $(x(${t0}), y(${t0})) = (${xPos}, ${yPos})$，并给出数值导数 $x'(${t0}) = ${vx}$ 与 $y'(${t0}) = ${vy}$。求曲线在 $t = ${t0}$ 处的切线斜率 $\\frac{dy}{dx}$。`,
              )
            : t(
                `In Parametric mode, a graphing calculator traces $(x(t), y(t))$ to the point $(x(${t0}), y(${t0})) = (${xPos}, ${yPos})$ and reports the numerical derivatives $x'(${t0}) = ${vx}$ and $y'(${t0}) = ${vy}$. What is the speed of the particle at $t = ${t0}$?`,
                `在参数模式下，图形计算器追踪曲线 $(x(t), y(t))$ 至点 $(x(${t0}), y(${t0})) = (${xPos}, ${yPos})$，并给出数值导数 $x'(${t0}) = ${vx}$ 与 $y'(${t0}) = ${vy}$。求质点在 $t = ${t0}$ 时刻的速率。`,
              ),
          answer: askSlope ? slope : hyp,
          wrong: askSlope ? [Q.of(vx, vy), Q.of(yPos, xPos), Q.of(hyp)] : [dx + dy, Math.abs(vx - vy), xPos * xPos + yPos * yPos],
          solution: askSlope
            ? t(
                `Use the parametric slope formula $\\frac{dy}{dx} = \\frac{y'(${t0})}{x'(${t0})} = \\frac{${vy}}{${vx}} = ${slope.toLatex()}$ (not $\\frac{y(${t0})}{x(${t0})}$).`,
                `由参数方程切线斜率公式得 $\\frac{dy}{dx} = \\frac{y'(${t0})}{x'(${t0})} = \\frac{${vy}}{${vx}} = ${slope.toLatex()}$（注意不是 $\\frac{y(${t0})}{x(${t0})}$）。`,
              )
            : t(
                `Speed is the magnitude of the velocity vector: $\\sqrt{(x'(${t0}))^2 + (y'(${t0}))^2} = \\sqrt{(${vx})^2 + (${vy})^2} = \\sqrt{${dx * dx + dy * dy}} = ${hyp}$.`,
                `速率为速度向量的模：$\\sqrt{(x'(${t0}))^2 + (y'(${t0}))^2} = \\sqrt{(${vx})^2 + (${vy})^2} = \\sqrt{${dx * dx + dy * dy}} = ${hyp}$。`,
              ),
        });
      },
    },
    {
      id: "polar-mode-windows-and-area-integrals",
      title: t("Tracing Polar Curves and Rates of Change in Polar Mode", "极坐标曲线追踪与极坐标模式下的变化率"),
      explanation: t(
        "In Polar (`POL`) mode, the calculator plots $(r(\\theta)\\cos\\theta, r(\\theta)\\sin\\theta)$ as $\\theta$ sweeps from $\\theta_{\\min}$ to $\\theta_{\\max}$. From calculator values of $r(\\theta_0)$ and $r'(\\theta_0)$, you can determine both the Cartesian coordinate rates $x'(\\theta_0), y'(\\theta_0)$ and the rate $\\frac{dA}{d\\theta} = \\frac{1}{2}(r(\\theta_0))^2$ at which the radius vector sweeps out area.\n\nThe figure shows $r = 2 + 2\\cos\\theta$ with the radius at $\\theta = \\frac{\\pi}{2}$: there $r = 2$ and $r' = -2$, so $\\frac{dA}{d\\theta} = \\frac{1}{2}(2)^2 = 2$.",
        "在极坐标（`POL`）模式下，当 $\\theta$ 从 $\\theta_{\\min}$ 扫过到 $\\theta_{\\max}$ 时，计算器绘制点 $(r(\\theta)\\cos\\theta, r(\\theta)\\sin\\theta)$。利用计算器给出的 $r(\\theta_0)$ 与 $r'(\\theta_0)$，既可以求直角坐标的变化率 $x'(\\theta_0), y'(\\theta_0)$，也可以求极径扫过面积的变化率 $\\frac{dA}{d\\theta} = \\frac{1}{2}(r(\\theta_0))^2$。\n\n图中是 $r = 2 + 2\\cos\\theta$ 以及 $\\theta = \\frac{\\pi}{2}$ 处的极径：此时 $r = 2$，$r' = -2$，所以 $\\frac{dA}{d\\theta} = \\frac{1}{2}(2)^2 = 2$。",
      ),
      figure: polarModeFigure,
      generate: (rng: Rng) => {
        const rVal = rng.int(2, 9);
        const drVal = -rng.int(2, 8);
        const [c, s] = rng.pick([
          [0, 1],
          [-1, 0],
        ] as const);
        const angleTex = c === 0 ? "\\frac{\\pi}{2}" : "\\pi";
        const askAreaRate = rng.bool();
        const dyDtheta = drVal * s + rVal * c;
        const dxDtheta = drVal * c - rVal * s;
        const areaRate = Q.of(rVal * rVal, 2);
        return numberProblem({
          prompt: askAreaRate
            ? t(
                `You plot a polar curve $r = f(\\theta)$ on a graphing calculator. At $\\theta = ${angleTex}$, the calculator table and numerical derivative show $r(${angleTex}) = ${rVal}$ and $r'(${angleTex}) = ${drVal}$. At what rate $\\frac{dA}{d\\theta}$ is the area swept out by the polar curve changing with respect to $\\theta$ at $\\theta = ${angleTex}$?`,
                `在图形计算器上绘制极坐标曲线 $r = f(\\theta)$。在 $\\theta = ${angleTex}$ 处，计算器数值表与数值导数显示 $r(${angleTex}) = ${rVal}$ 且 $r'(${angleTex}) = ${drVal}$。在 $\\theta = ${angleTex}$ 处，极径扫过的面积关于 $\\theta$ 的变化率 $\\frac{dA}{d\\theta}$ 是多少？`,
              )
            : t(
                `You plot a polar curve $r = f(\\theta)$ on a graphing calculator. At $\\theta = ${angleTex}$, the calculator table and numerical derivative show $r(${angleTex}) = ${rVal}$ and $r'(${angleTex}) = ${drVal}$. What is the value of $\\frac{dy}{d\\theta}$ at $\\theta = ${angleTex}$?`,
                `在图形计算器上绘制极坐标曲线 $r = f(\\theta)$。在 $\\theta = ${angleTex}$ 处，计算器数值表与数值导数显示 $r(${angleTex}) = ${rVal}$ 且 $r'(${angleTex}) = ${drVal}$。求 $\\theta = ${angleTex}$ 处 $\\frac{dy}{d\\theta}$ 的值。`,
              ),
          answer: askAreaRate ? areaRate : dyDtheta,
          wrong: askAreaRate ? [Q.of(rVal * rVal), Q.of(rVal * drVal), Q.of(rVal)] : [dxDtheta, drVal, rVal],
          solution: askAreaRate
            ? t(
                `Since $A(\\theta) = \\frac{1}{2}\\int (r(\\theta))^2\\,d\\theta$, the rate of change of area with respect to $\\theta$ is $\\frac{dA}{d\\theta} = \\frac{1}{2}(r(${angleTex}))^2 = \\frac{1}{2}(${rVal})^2 = ${areaRate.toLatex()}$.`,
                `由极坐标面积公式 $A(\\theta) = \\frac{1}{2}\\int (r(\\theta))^2\\,d\\theta$，面积关于 $\\theta$ 的变化率为 $\\frac{dA}{d\\theta} = \\frac{1}{2}(r(${angleTex}))^2 = \\frac{1}{2}(${rVal})^2 = ${areaRate.toLatex()}$。`,
              )
            : t(
                `Since $y = r(\\theta)\\sin\\theta$, the product rule gives $\\frac{dy}{d\\theta} = r'(\\theta)\\sin\\theta + r(\\theta)\\cos\\theta$. At $\\theta = ${angleTex}$, $\\sin\\theta = ${s}$ and $\\cos\\theta = ${c}$, so $\\frac{dy}{d\\theta} = (${drVal})(${s}) + (${rVal})(${c}) = ${dyDtheta}$.`,
                `由于 $y = r(\\theta)\\sin\\theta$，由乘积法则得 $\\frac{dy}{d\\theta} = r'(\\theta)\\sin\\theta + r(\\theta)\\cos\\theta$。在 $\\theta = ${angleTex}$ 处，$\\sin\\theta = ${s}$，$\\cos\\theta = ${c}$，故 $\\frac{dy}{d\\theta} = (${drVal})(${s}) + (${rVal})(${c}) = ${dyDtheta}$。`,
              ),
        });
      },
    },
  ],
};

/** apCalculusTechnologyTopics are the graphing calculator and technology topics for AP Calculus AB and BC. */
export const apCalculusTechnologyTopics: readonly TopicDef[] = [
  evaluatingExpressionsUsingAGraphingCalculator,
  findingRootsOfFunctionsUsingAGraphingCalculator,
  findingIntersectionsOfFunctionsUsingAGraphingCalculator,
  findingExtremaOfFunctionsUsingAGraphingCalculator,
  findingDerivativesUsingAGraphingCalculator,
  findingDefiniteIntegralsUsingAGraphingCalculator,
  findingImproperIntegralsUsingAGraphingCalculator,
  exploringFunctionsUsingTechnology,
  plottingParametricAndPolarCurvesUsingTechnology,
];
