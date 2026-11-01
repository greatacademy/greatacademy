import type { Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { poly, Q } from "@ga/subject-math";

import { numberProblem, pointProblem } from "../problems.ts";

// AP Calculus AB Unit 9 & AP Calculus BC Unit 16: Applications of Technology
// (Using Graphing Calculators).

const evaluatingExpressionsUsingAGraphingCalculator: TopicDef = {
  id: "evaluating-expressions-using-a-graphing-calculator",
  title: t("Evaluating Expressions Using a Graphing Calculator", "用图形计算器计算表达式"),
  summary: t(
    "Group numerators, denominators and compound exponents with parentheses, keep the calculator in radian mode, and store intermediate values at full precision.",
    "用括号对分子、分母与复合指数分组，保持弧度模式，并以完整精度存储中间计算值。",
  ),
  prerequisites: ["the-finite-limit-of-a-function"],
  encompasses: [{ topic: "the-finite-limit-of-a-function", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "order-of-operations-and-parentheses-on-calculators",
      title: t("Grouping Numerators, Denominators, and Exponents", "分子、分母与指数的括号分组"),
      explanation: t(
        "When entering rational or exponential expressions in a single line on a graphing calculator, wrap the entire numerator, denominator, and compound exponent in parentheses so the calculator respects the order of operations. For example, to evaluate $f(x) = \\frac{3x^2 + 1}{x + 2}$ at $x = 2$, enter $(3\\cdot 2^2 + 1)/(2 + 2) = \\frac{13}{4}$.",
        "在图形计算器中单行输入分式或指数表达式时，必须将整个分子、整个分母以及复合指数用括号括起来，以确保计算器遵循正确的运算顺序。例如计算 $f(x) = \\frac{3x^2 + 1}{x + 2}$ 在 $x = 2$ 处的值时，应输入 $(3\\cdot 2^2 + 1)/(2 + 2) = \\frac{13}{4}$。",
      ),
      generate: (rng: Rng) => {
        const a = rng.int(2, 7);
        const b = rng.int(1, 6);
        const c = rng.int(1, 5);
        const x = rng.int(2, 5);
        const num = a * x * x + b;
        const den = x + c;
        const ans = Q.of(num, den);
        const ungrouped = Q.of(a * x * x * x + b + a * x * x * c, x);
        return numberProblem({
          prompt: t(
            `Suppose you evaluate $f(x) = \\frac{${a}x^2 + ${b}}{x + ${c}}$ at $x = ${x}$ on a calculator using the properly grouped entry $(${a}x^2 + ${b})/(x + ${c})$. What exact value does this produce?`,
            `在计算器上使用正确加括号的输入方式 $(${a}x^2 + ${b})/(x + ${c})$ 计算函数 $f(x) = \\frac{${a}x^2 + ${b}}{x + ${c}}$ 在 $x = ${x}$ 处的值，所得的精确值是多少？`,
          ),
          answer: ans,
          wrong: [ungrouped, Q.of(num, x), Q.of(a * x + b, den)],
          solution: t(
            `Evaluate the grouped numerator and denominator at $x = ${x}$: numerator $= ${a}(${x})^2 + ${b} = ${num}$, denominator $= ${x} + ${c} = ${den}$. Dividing gives $\\frac{${num}}{${den}} = ${ans.toLatex()}$.`,
            `在 $x = ${x}$ 处分别计算括号内的分子与分母：分子 $= ${a}(${x})^2 + ${b} = ${num}$，分母 $= ${x} + ${c} = ${den}$。相除得 $\\frac{${num}}{${den}} = ${ans.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "radian-mode-and-storing-intermediate-values",
      title: t("Radian Mode and Storing Intermediate Values", "弧度模式与中间值存储"),
      explanation: t(
        "All calculus differentiation and integration formulas for trigonometric functions assume angles are measured in radians, so your graphing calculator must always remain in radian mode on AP Calculus exams. When a multi-step problem uses an intermediate number $A$, store $A$ in a calculator variable rather than re-typing a rounded approximation.",
        "微积分中所有三角函数的求导与积分公式都以弧度制为前提，因此在 AP 微积分考试中图形计算器必须始终处于弧度（Radian）模式。当多步计算题需要使用中间数值 $A$ 时，应将 $A$ 存储在计算器变量中，切勿将四舍五入后的近似值重新输入，以免产生累计舍入误差。",
      ),
      generate: (rng: Rng) => {
        const k = rng.int(2, 9) * 1000;
        const baseTenths = rng.int(12, 38);
        const extraThousandths = rng.int(2, 4);
        const exactThousandths = baseTenths * 100 + extraThousandths;
        const exactVal = (k * exactThousandths) / 1000;
        const roundedVal = (k * (baseTenths * 100)) / 1000;
        const diff = exactVal - roundedVal;
        return numberProblem({
          prompt: t(
            `A calculator stores the exact intermediate value $A = ${(exactThousandths / 1000).toFixed(3)}$. If you compute $N = ${k}A$ using the stored value of $A$ instead of the two-decimal rounded value $${(baseTenths / 10).toFixed(2)}$, by how much does the exact result exceed the prematurely rounded result?`,
            `计算器存储了精确中间值 $A = ${(exactThousandths / 1000).toFixed(3)}$。若使用存储的 $A$ 值计算 $N = ${k}A$，而不是使用四舍五入到两位小数的值 $${(baseTenths / 10).toFixed(2)}$，精确结果比提前舍入的结果大多少？`,
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

const findingRootsOfFunctionsUsingAGraphingCalculator: TopicDef = {
  id: "finding-roots-of-functions-using-a-graphing-calculator",
  title: t("Finding Roots of Functions Using a Graphing Calculator", "用图形计算器求函数的根"),
  summary: t(
    "Bracket roots with left and right bounds where a continuous function changes sign, and use the calculator's zero finder to solve f(x) = 0.",
    "利用连续函数变号处的左、右边界锁定根所在的区间，并使用计算器的求零点功能求解 f(x) = 0。",
  ),
  prerequisites: ["evaluating-expressions-using-a-graphing-calculator", "the-intermediate-value-theorem"],
  encompasses: [
    { topic: "evaluating-expressions-using-a-graphing-calculator", weight: 0.4 },
    { topic: "the-intermediate-value-theorem", weight: 0.4 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "bracketing-a-root-with-sign-changes",
      title: t("Bracketing Roots Using Sign Changes", "利用符号变化锁定根所在的区间"),
      explanation: t(
        "The graphing calculator's `zero` (or `root`) command requires a left bound $a$ and a right bound $b$ surrounding a single $x$-intercept. For a continuous function $f$, a sign change ($f(a)$ and $f(b)$ having opposite signs) guarantees by the Intermediate Value Theorem that at least one root lies in $(a, b)$.",
        "图形计算器的求零点（`zero` 或 `root`）功能需要指定包含单个 $x$ 轴交点的左边界 $a$ 和右边界 $b$。对于连续函数 $f$，若 $f(a)$ 与 $f(b)$ 异号，则由介值定理可知区间 $(a, b)$ 内必存在至少一个实根。",
      ),
      generate: (rng: Rng) => {
        const k = rng.int(1, 5);
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
      id: "linear-interpolation-and-decimal-roots",
      title: t("Solving Equations by Finding Zeros of a Difference Function", "通过求差函数的零点解方程"),
      explanation: t(
        "Any equation $g(x) = c$ can be solved with a calculator's root finder by graphing $f(x) = g(x) - c$ and locating its $x$-intercept. For example, to solve $x^3 + 2x = 12$, graph $y = x^3 + 2x - 12$ and find its zero at $x = 2$.",
        "对于任意方程 $g(x) = c$，都可以通过绘制差函数 $f(x) = g(x) - c$ 并定位其 $x$ 轴交点来用计算器求根功能求解。例如解 $x^3 + 2x = 12$ 时，可绘制 $y = x^3 + 2x - 12$ 并求出其零点 $x = 2$。",
      ),
      generate: (rng: Rng) => {
        const a = rng.int(1, 4);
        const b = rng.int(2, 6);
        const r = rng.int(1, 5);
        const c = a * r * r * r + b * r;
        return numberProblem({
          prompt: t(
            `You use a graphing calculator to find the real root of $${a}x^3 + ${b}x = ${c}$ by graphing $y = ${a}x^3 + ${b}x - ${c}$ and locating its $x$-intercept. What is the value of this root?`,
            `使用图形计算器绘制 $y = ${a}x^3 + ${b}x - ${c}$ 并定位其 $x$ 轴交点，以求方程 $${a}x^3 + ${b}x = ${c}$ 的实根。该实根的值是多少？`,
          ),
          answer: r,
          wrong: [-r, r + 1, c],
          solution: t(
            `The function $f(x) = ${a}x^3 + ${b}x - ${c}$ is strictly increasing because $f'(x) = ${3 * a}x^2 + ${b} > 0$. Testing $x = ${r}$ gives $${a}(${r})^3 + ${b}(${r}) - ${c} = 0$, so the unique real root is $x = ${r}$.`,
            `由于 $f'(x) = ${3 * a}x^2 + ${b} > 0$，函数 $f(x) = ${a}x^3 + ${b}x - ${c}$ 严格递增。代入 $x = ${r}$ 得 $${a}(${r})^3 + ${b}(${r}) - ${c} = 0$，故唯一实根为 $x = ${r}$。`,
          ),
        });
      },
    },
  ],
};

const findingIntersectionsOfFunctionsUsingAGraphingCalculator: TopicDef = {
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
      title: t("Locating Points of Intersection", "定位两函数图像的交点坐标"),
      explanation: t(
        "To solve $f(x) = g(x)$ graphically, either graph $Y_1 = f(x)$ and $Y_2 = g(x)$ and use the `intersect` command, or graph the difference $Y_1 = f(x) - g(x)$ and use the `zero` command. In AP Calculus area and volume problems, always store the intersection $x$-coordinates in calculator variables to use as limits of integration.",
        "用图像法解方程 $f(x) = g(x)$ 时，可以分别绘制 $Y_1 = f(x)$ 与 $Y_2 = g(x)$ 并使用求交点（`intersect`）命令，也可以绘制差函数 $Y_1 = f(x) - g(x)$ 并使用求零点（`zero`）命令。在 AP 微积分的面积与体积问题中，务必将交点的横坐标存入计算器变量以作为积分上下限。",
      ),
      generate: (rng: Rng) => {
        const x0 = rng.int(1, 5);
        const a = rng.int(1, 3);
        const m = rng.int(2, 6);
        const y0 = a * x0 * x0;
        const b = y0 - m * x0;
        return pointProblem({
          prompt: t(
            `Using a graphing calculator's intersect feature on $Y_1 = ${poly([a, "x^2"])}$ and $Y_2 = ${poly([m, "x"], [b, ""])}$ with initial guess near $x = ${x0}$, what intersection point $(x, y)$ does the calculator return?`,
            `在图形计算器上对 $Y_1 = ${poly([a, "x^2"])}$ 与 $Y_2 = ${poly([m, "x"], [b, ""])}$ 使用求交点功能，并在 $x = ${x0}$ 附近选取初始猜测值，计算器返回的交点坐标 $(x, y)$ 是什么？`,
          ),
          answer: [x0, y0],
          wrong: [
            [y0, x0],
            [x0, m * x0],
            [-x0, y0],
          ],
          solution: t(
            `At $x = ${x0}$, $Y_1(${x0}) = ${a}(${x0})^2 = ${y0}$ and $Y_2(${x0}) = ${m}(${x0}) + (${b}) = ${y0}$. Therefore the intersection point is $(${x0}, ${y0})$.`,
            `当 $x = ${x0}$ 时，$Y_1(${x0}) = ${a}(${x0})^2 = ${y0}$，且 $Y_2(${x0}) = ${m}(${x0}) + (${b}) = ${y0}$。因此交点坐标为 $(${x0}, ${y0})$。`,
          ),
        });
      },
    },
    {
      id: "counting-intersections-by-window-and-end-behavior",
      title: t("Adjusting the Viewing Window to Find All Intersections", "调整视图窗口以找出所有交点"),
      explanation: t(
        "A standard $[-10, 10] \\times [-10, 10]$ viewing window can miss intersections that occur at large $x$- or $y$-values. Comparing growth rates or algebraic structure helps determine whether an additional intersection exists outside the initial window.",
        "默认的 $[-10, 10] \\times [-10, 10]$ 视图窗口可能会遗漏发生在较大 $x$ 或 $y$ 值处的交点。通过分析函数的增长速率或代数结构，可以判断在初始窗口之外是否还存在其他交点。",
      ),
      generate: (rng: Rng) => {
        const r1 = rng.int(1, 4);
        const r2 = rng.int(14, 24);
        const m = rng.int(2, 5);
        const b = rng.int(1, 6);
        const sum = r1 + r2;
        const prod = r1 * r2;
        const c1 = m - sum;
        const c0 = prod + b;
        return numberProblem({
          prompt: t(
            `On the standard window $[-10, 10]$, a student sees only one intersection of $f(x) = ${poly([1, "x^2"], [c1, "x"], [c0, ""])}$ and $g(x) = ${poly([m, "x"], [b, ""])}$ at $x = ${r1}$. What is the $x$-coordinate of the second intersection that appears when the window is widened to $X_{\\max} = 30$?`,
            `在标准窗口 $[-10, 10]$ 下，某学生只看到 $f(x) = ${poly([1, "x^2"], [c1, "x"], [c0, ""])}$ 与 $g(x) = ${poly([m, "x"], [b, ""])}$ 在 $x = ${r1}$ 处的一个交点。当将窗口扩大至 $X_{\\max} = 30$ 时，出现的第二个交点的横坐标是多少？`,
          ),
          answer: r2,
          wrong: [r1, sum, prod],
          solution: t(
            `Setting $f(x) = g(x)$ gives $x^2 - ${sum}x + ${prod} = 0$, which factors as $(x - ${r1})(x - ${r2}) = 0$. The intersection outside $[-10, 10]$ occurs at $x = ${r2}$.`,
            `令 $f(x) = g(x)$ 得 $x^2 - ${sum}x + ${prod} = 0$，因式分解为 $(x - ${r1})(x - ${r2}) = 0$。位于 $[-10, 10]$ 之外的交点横坐标为 $x = ${r2}$。`,
          ),
        });
      },
    },
  ],
};

const findingExtremaOfFunctionsUsingAGraphingCalculator: TopicDef = {
  id: "finding-extrema-of-functions-using-a-graphing-calculator",
  title: t("Finding Extrema of Functions Using a Graphing Calculator", "用图形计算器求函数的极值"),
  summary: t(
    "Locate local extrema directly with the minimum/maximum commands or by finding sign-changing zeros of the derivative graph.",
    "使用最小值/最大值命令直接定位局部极值，或通过寻找导函数图像变号的零点求极值位置。",
  ),
  prerequisites: ["finding-roots-of-functions-using-a-graphing-calculator", "using-the-first-derivative-test-to-classify-local-extrema"],
  encompasses: [
    { topic: "finding-roots-of-functions-using-a-graphing-calculator", weight: 0.5 },
    { topic: "using-the-first-derivative-test-to-classify-local-extrema", weight: 0.4 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "finding-extrema-directly-from-the-graph",
      title: t("Using the Minimum and Maximum Commands", "使用计算器的最小值与最大值功能"),
      explanation: t(
        "The graphing calculator's `minimum` and `maximum` commands locate local extrema of $f(x)$ within a user-specified interval $[a, b]$. Always distinguish between the location of the extremum (the $x$-coordinate) and the extreme value itself (the $y$-coordinate).",
        "图形计算器的 `minimum`（最小值）与 `maximum`（最大值）命令可在指定的区间 $[a, b]$ 内定位函数 $f(x)$ 的局部极值。解题时务必区分极值所在的位置（横坐标 $x$）与极值本身（纵坐标 $y$）。",
      ),
      generate: (rng: Rng) => {
        const h = rng.int(-4, 5);
        const k = rng.int(-6, 8);
        const a = rng.int(1, 3);
        const bCoeff = -2 * a * h;
        const cCoeff = a * h * h + k;
        return pointProblem({
          prompt: t(
            `A graphing calculator's minimum command is applied to $f(x) = ${poly([a, "x^2"], [bCoeff, "x"], [cCoeff, ""])}$. What coordinates $(x, y)$ does it report for the local minimum?`,
            `对函数 $f(x) = ${poly([a, "x^2"], [bCoeff, "x"], [cCoeff, ""])}$ 使用图形计算器的求最小值功能，它所报告的局部最小值点坐标 $(x, y)$ 是什么？`,
          ),
          answer: [h, k],
          wrong: [
            [k, h],
            [-h, k],
            [h, cCoeff],
          ],
          solution: t(
            `Rewrite $f(x) = ${a}(x - (${h}))^2 + (${k})$. Since ${a} > 0$, the minimum occurs when $x = ${h}$ with minimum value $y = ${k}$.`,
            `将函数改写为 $f(x) = ${a}(x - (${h}))^2 + (${k})$。由于 ${a} > 0$，当 $x = ${h}$ 时取得最小值 $y = ${k}$。`,
          ),
        });
      },
    },
    {
      id: "finding-extrema-via-zeros-of-the-derivative",
      title: t("Finding Extrema by Graphing the Derivative", "通过绘制导函数图像求极值"),
      explanation: t(
        "On AP Calculus calculator-active problems, you are often given the derivative $f'(x)$ directly rather than $f(x)$. To find where $f$ has a local maximum or minimum, graph $Y_1 = f'(x)$ and use the `zero` command to find where $f'(x)$ changes sign (positive to negative for a local maximum; negative to positive for a local minimum).",
        "在 AP 微积分允许使用计算器的题目中，题目往往直接给出导函数 $f'(x)$ 而非原函数 $f(x)$。要求 $f$ 取得局部极大值或极小值的位置，应绘制 $Y_1 = f'(x)$ 的图像并使用求零点（`zero`）功能，找出 $f'(x)$ 变号的点（由正变负为局部极大值点，由负变正为局部极小值点）。",
      ),
      generate: (rng: Rng) => {
        const r1 = rng.int(1, 4);
        const r2 = rng.int(6, 10);
        const askMax = rng.bool();
        const sum = r1 + r2;
        const prod = r1 * r2;
        const ans = askMax ? r1 : r2;
        return numberProblem({
          prompt: askMax
            ? t(
                `Suppose $f'(x) = ${poly([1, "x^2"], [-sum, "x"], [prod, ""])}$. When you graph $Y_1 = f'(x)$ on a calculator and inspect its sign changes, at what value of $x$ does $f$ attain a local maximum?`,
                `设 $f'(x) = ${poly([1, "x^2"], [-sum, "x"], [prod, ""])}$。在计算器上绘制 $Y_1 = f'(x)$ 并观察其符号变化，函数 $f$ 在 $x$ 取何值时取得局部极大值？`,
              )
            : t(
                `Suppose $f'(x) = ${poly([1, "x^2"], [-sum, "x"], [prod, ""])}$. When you graph $Y_1 = f'(x)$ on a calculator and inspect its sign changes, at what value of $x$ does $f$ attain a local minimum?`,
                `设 $f'(x) = ${poly([1, "x^2"], [-sum, "x"], [prod, ""])}$。在计算器上绘制 $Y_1 = f'(x)$ 并观察其符号变化，函数 $f$ 在 $x$ 取何值时取得局部极小值？`,
              ),
          answer: ans,
          wrong: [askMax ? r2 : r1, Q.of(sum, 2), prod],
          solution: askMax
            ? t(
                `Factor the derivative: $f'(x) = (x - ${r1})(x - ${r2})$. Because $f'(x)$ changes from positive to negative at $x = ${r1}$, $f$ has a local maximum at $x = ${r1}$.`,
                `将导函数因式分解：$f'(x) = (x - ${r1})(x - ${r2})$。由于 $f'(x)$ 在 $x = ${r1}$ 处由正变负，$f$ 在 $x = ${r1}$ 处取得局部极大值。`,
              )
            : t(
                `Factor the derivative: $f'(x) = (x - ${r1})(x - ${r2})$. Because $f'(x)$ changes from negative to positive at $x = ${r2}$, $f$ has a local minimum at $x = ${r2}$.`,
                `将导函数因式分解：$f'(x) = (x - ${r1})(x - ${r2})$。由于 $f'(x)$ 在 $x = ${r2}$ 处由负变正，$f$ 在 $x = ${r2}$ 处取得局部极小值。`,
              ),
        });
      },
    },
  ],
};

const findingDerivativesUsingAGraphingCalculator: TopicDef = {
  id: "finding-derivatives-using-a-graphing-calculator",
  title: t("Finding Derivatives Using a Graphing Calculator", "用图形计算器求导数"),
  summary: t(
    "Evaluate numerical derivatives using the calculator's symmetric difference quotient command and recognize its behavior at sharp corners.",
    "使用计算器的对称差商求导命令计算数值导数，并理解其在尖角不可导点处的表现。",
  ),
  prerequisites: ["evaluating-expressions-using-a-graphing-calculator", "estimating-derivatives-using-a-central-difference-quotient"],
  encompasses: [
    { topic: "evaluating-expressions-using-a-graphing-calculator", weight: 0.3 },
    { topic: "estimating-derivatives-using-a-central-difference-quotient", weight: 0.7 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "numerical-derivative-command-and-symmetric-difference",
      title: t("The Numerical Derivative Command (nDeriv)", "数值求导命令（nDeriv）与对称差商"),
      explanation: t(
        "Most graphing calculators compute numerical derivatives (`nDeriv`) using the symmetric difference quotient $\\frac{f(a + h) - f(a - h)}{2h}$ with a small step size $h$. For any quadratic function $f(x) = px^2 + qx + r$, the symmetric difference quotient equals the exact derivative $f'(a) = 2pa + q$ for every step size $h > 0$.",
        "大多数图形计算器通过步长 $h$ 很小的对称差商 $\\frac{f(a + h) - f(a - h)}{2h}$ 来计算数值导数（`nDeriv`）。对于任意二次函数 $f(x) = px^2 + qx + r$，无论步长 $h > 0$ 取何值，对称差商都精确等于导数值 $f'(a) = 2pa + q$。",
      ),
      generate: (rng: Rng) => {
        const p = rng.int(1, 5);
        const q = rng.int(-5, 6);
        const r = rng.int(1, 8);
        const a = rng.int(1, 5);
        const ans = 2 * p * a + q;
        const fVal = p * a * a + q * a + r;
        return numberProblem({
          prompt: t(
            `You enter $\\text{nDeriv}(${poly([p, "x^2"], [q, "x"], [r, ""])}, x, ${a})$ on a graphing calculator. What value does it produce?`,
            `在图形计算器上输入 $\\text{nDeriv}(${poly([p, "x^2"], [q, "x"], [r, ""])}, x, ${a})$，计算器输出的值是多少？`,
          ),
          answer: ans,
          wrong: [fVal, p * a + q, 2 * p * a + q + r],
          solution: t(
            `For the quadratic $f(x) = ${poly([p, "x^2"], [q, "x"], [r, ""])}$, the symmetric difference quotient equals the exact derivative $f'(x) = ${poly([2 * p, "x"], [q, ""])}$. Evaluating at $x = ${a}$ gives $f'(${a}) = ${ans}$.`,
            `对于二次函数 $f(x) = ${poly([p, "x^2"], [q, "x"], [r, ""])}$，对称差商等于精确导数 $f'(x) = ${poly([2 * p, "x"], [q, ""])}$。在 $x = ${a}$ 处求值得 $f'(${a}) = ${ans}$。`,
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
        const k = rng.int(2, 7);
        const m = rng.int(1, 6);
        const a = rng.int(1, 5);
        return numberProblem({
          prompt: t(
            `The function $f(x) = ${k}|x - ${a}| + ${m}x$ has a sharp corner at $x = ${a}$, so $f'(${a})$ does not exist. What misleading numerical value does a calculator's symmetric difference quotient $\\frac{f(${a}+h) - f(${a}-h)}{2h}$ report at $x = ${a}$?`,
            `函数 $f(x) = ${k}|x - ${a}| + ${m}x$ 在 $x = ${a}$ 处有尖角，故 $f'(${a})$ 不存在。计算器的对称差商 $\\frac{f(${a}+h) - f(${a}-h)}{2h}$ 在 $x = ${a}$ 处会报告什么具有误导性的数值？`,
          ),
          answer: m,
          wrong: [k, m + k, m - k],
          solution: t(
            `For $h > 0$, the $|x - ${a}|$ terms cancel in $f(${a}+h) - f(${a}-h) = (${k}h + ${m}\\cdot ${a} + ${m}h) - (${k}h + ${m}\\cdot ${a} - ${m}h) = ${2 * m}h$. Dividing by $2h$ gives the average of the left and right slopes, $${m}$.`,
            `当 $h > 0$ 时，$f(${a}+h) - f(${a}-h) = (${k}h + ${m}\\cdot ${a} + ${m}h) - (${k}h + ${m}\\cdot ${a} - ${m}h) = ${2 * m}h$，其中 $|x - ${a}|$ 项相互抵消。除以 $2h$ 得到左、右斜率的平均值 $${m}$。`,
          ),
        });
      },
    },
  ],
};

const findingDefiniteIntegralsUsingAGraphingCalculator: TopicDef = {
  id: "finding-definite-integrals-using-a-graphing-calculator",
  title: t("Finding Definite Integrals Using a Graphing Calculator", "用图形计算器求定积分"),
  summary: t(
    "Use numerical integration (fnInt) with the Fundamental Theorem of Calculus and absolute-value integrands to compute net change and total distance.",
    "结合微积分基本定理与绝对值被积函数，使用数值积分（fnInt）计算净变化量与总路程。",
  ),
  prerequisites: ["finding-derivatives-using-a-graphing-calculator", "the-fundamental-theorem-of-calculus"],
  encompasses: [
    { topic: "finding-derivatives-using-a-graphing-calculator", weight: 0.4 },
    { topic: "the-fundamental-theorem-of-calculus", weight: 0.5 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "numerical-integration-and-accumulation",
      title: t("Computing Definite Integrals and Net Change with fnInt", "用数值积分（fnInt）计算定积分与净变化量"),
      explanation: t(
        "The calculator's numerical integration command (`fnInt`) approximates $\\int_a^b f(x)\\,dx$ to high precision. Combined with the Fundamental Theorem of Calculus, $f(b) = f(a) + \\int_a^b f'(x)\\,dx$, this lets you find values of a function from its initial value and a calculator integral of its rate of change.",
        "计算器的数值积分命令（`fnInt`）能高精度地计算定积分 $\\int_a^b f(x)\\,dx$。结合微积分基本定理 $f(b) = f(a) + \\int_a^b f'(x)\\,dx$，可以由初始值和变化率的计算器定积分求出函数在任意点的值。",
      ),
      generate: (rng: Rng) => {
        const y0 = rng.int(15, 50);
        const net = rng.int(12, 45) * (rng.bool() ? 1 : -1);
        const a = rng.int(1, 3);
        const b = a + rng.int(2, 5);
        const ans = y0 + net;
        return numberProblem({
          prompt: t(
            `A differentiable function $f$ satisfies $f(${a}) = ${y0}$. Using a graphing calculator's numerical integration command, you find $\\int_{${a}}^{${b}} f'(x)\\,dx = ${net}$. What is $f(${b})$?`,
            `可导函数 $f$ 满足 $f(${a}) = ${y0}$。利用图形计算器的数值积分功能求得 $\\int_{${a}}^{${b}} f'(x)\\,dx = ${net}$，求 $f(${b})$ 的值。`,
          ),
          answer: ans,
          wrong: [y0 - net, net, ans + a],
          solution: t(
            `Apply the Fundamental Theorem of Calculus: $f(${b}) = f(${a}) + \\int_{${a}}^{${b}} f'(x)\\,dx = ${y0} + (${net}) = ${ans}$.`,
            `应用微积分基本定理：$f(${b}) = f(${a}) + \\int_{${a}}^{${b}} f'(x)\\,dx = ${y0} + (${net}) = ${ans}$。`,
          ),
        });
      },
    },
    {
      id: "total-distance-and-absolute-value-integrals-on-calculators",
      title: t("Integrating Absolute Value for Total Area and Distance", "对绝对值函数数值积分求总面积与总路程"),
      explanation: t(
        "On a graphing calculator, you do not need to split an integral at its zeros to find total area or total distance traveled: simply enter $\\int_a^b |f(x)|\\,dx$ using the calculator's `abs(` function.",
        "在图形计算器上求总面积或质点运动的总路程时，无需在零点处分段积分，只需使用计算器的绝对值函数 `abs(` 直接输入 $\\int_a^b |f(x)|\\,dx$ 即可。",
      ),
      generate: (rng: Rng) => {
        const c = rng.int(1, 4);
        const b = c + rng.int(1, 4);
        const k = 2 * rng.int(1, 3);
        const area1 = (k * c * c) / 2;
        const area2 = (k * (b - c) * (b - c)) / 2;
        const total = area1 + area2;
        const net = area2 - area1;
        return numberProblem({
          prompt: t(
            `A particle moves along a line with velocity $v(t) = ${poly([k, "t"], [-k * c, ""])}$ for $0 \\le t \\le ${b}$. What value does the calculator return for the total distance integral $\\int_0^{${b}} |v(t)|\\,dt$?`,
            `质点沿直线运动，在 $0 \\le t \\le ${b}$ 内的速度为 $v(t) = ${poly([k, "t"], [-k * c, ""])}$。计算器对总路程积分 $\\int_0^{${b}} |v(t)|\\,dt$ 返回的值是多少？`,
          ),
          answer: total,
          wrong: [net, area1, area2 * 2],
          solution: t(
            `Since $v(t) = ${k}(t - ${c})$ changes sign at $t = ${c}$, the area on $[0, ${c}]$ is $\\frac{1}{2}(${c})(${k * c}) = ${area1}$ and on $[${c}, ${b}]$ is $\\frac{1}{2}(${b - c})(${k * (b - c)}) = ${area2}$. Adding both positive areas gives $\\int_0^{${b}} |v(t)|\\,dt = ${total}$.`,
            `由于 $v(t) = ${k}(t - ${c})$ 在 $t = ${c}$ 处变号，$[0, ${c}]$ 上的面积为 $\\frac{1}{2}(${c})(${k * c}) = ${area1}$，$[${c}, ${b}]$ 上的面积为 $\\frac{1}{2}(${b - c})(${k * (b - c)}) = ${area2}$。将两部分正面积相加得 $\\int_0^{${b}} |v(t)|\\,dt = ${total}$。`,
          ),
        });
      },
    },
  ],
};

const findingImproperIntegralsUsingAGraphingCalculator: TopicDef = {
  id: "finding-improper-integrals-using-a-graphing-calculator",
  title: t("Finding Improper Integrals Using a Graphing Calculator", "用图形计算器求反常积分"),
  summary: t(
    "Approximate improper integrals on a calculator by evaluating definite integrals over successively larger upper bounds or bounds approaching a vertical asymptote.",
    "通过依次增大积分上限或令积分限逼近垂直渐近线，在计算器上用定积分近似反常积分。",
  ),
  prerequisites: ["finding-definite-integrals-using-a-graphing-calculator", "improper-integrals"],
  encompasses: [
    { topic: "finding-definite-integrals-using-a-graphing-calculator", weight: 0.4 },
    { topic: "improper-integrals", weight: 0.6 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "approximating-infinite-interval-integrals-with-large-bounds",
      title: t("Estimating Improper Integrals Over Infinite Intervals", "用大上限估计无穷区间上的反常积分"),
      explanation: t(
        "Standard graphing calculators require finite limits of integration in `fnInt`. To investigate $\\int_a^{\\infty} f(x)\\,dx$ numerically, evaluate $I(B) = \\int_a^B f(x)\\,dx$ for successively larger values of $B$ (such as $B = 10, 100, 1000$). If $I(B)$ stabilizes around a constant $L$, the improper integral converges to $L$; if $I(B)$ grows without bound, it diverges.",
        "标准图形计算器的数值积分功能（`fnInt`）要求积分上下限为有限数。要数值研究反常积分 $\\int_a^{\\infty} f(x)\\,dx$，可依次取越来越大的上限 $B$（如 $B = 10, 100, 1000$）计算 $I(B) = \\int_a^B f(x)\\,dx$。若 $I(B)$ 趋于稳定常数 $L$，则反常积分收敛于 $L$；若 $I(B)$ 无限增大，则发散。",
      ),
      generate: (rng: Rng) => {
        const k = rng.int(2, 8);
        const a = rng.int(1, 4);
        const B = 100;
        const exactLim = Q.of(k, a);
        const truncVal = Q.of(k * (B - a), a * B);
        const tailErr = Q.of(k, B);
        const askLimit = rng.bool();
        return numberProblem({
          prompt: askLimit
            ? t(
                `A student uses a calculator to evaluate $I(B) = \\int_{${a}}^B \\frac{${k}}{x^2}\\,dx$ for $B = 10, 100, 1000$. What exact limiting value $\\lim_{B\\to\\infty} I(B)$ do these numerical integrals approach?`,
                `某学生用计算器在 $B = 10, 100, 1000$ 时计算 $I(B) = \\int_{${a}}^B \\frac{${k}}{x^2}\\,dx$。这些数值积分趋近的精确极限值 $\\lim_{B\\to\\infty} I(B)$ 是多少？`,
              )
            : t(
                `When approximating $\\int_{${a}}^{\\infty} \\frac{${k}}{x^2}\\,dx$ on a calculator by truncating the upper bound at $B = ${B}$, what is the exact truncation error $\\int_{${B}}^{\\infty} \\frac{${k}}{x^2}\\,dx$?`,
                `在计算器上将上限截断为 $B = ${B}$ 来近似反常积分 $\\int_{${a}}^{\\infty} \\frac{${k}}{x^2}\\,dx$ 时，精确截断误差 $\\int_{${B}}^{\\infty} \\frac{${k}}{x^2}\\,dx$ 是多少？`,
              ),
          answer: askLimit ? exactLim : tailErr,
          wrong: askLimit ? [truncVal, tailErr, Q.of(k, a * a)] : [exactLim, truncVal, Q.of(k, B * B)],
          solution: askLimit
            ? t(
                `Use the antiderivative $-\\frac{${k}}{x}$: $\\int_{${a}}^B \\frac{${k}}{x^2}\\,dx = \\frac{${k}}{${a}} - \\frac{${k}}{B}$, which approaches $\\frac{${k}}{${a}} = ${exactLim.toLatex()}$ as $B \\to \\infty$.`,
                `利用原函数 $-\\frac{${k}}{x}$：$\\int_{${a}}^B \\frac{${k}}{x^2}\\,dx = \\frac{${k}}{${a}} - \\frac{${k}}{B}$，当 $B \\to \\infty$ 时趋近于 $\\frac{${k}}{${a}} = ${exactLim.toLatex()}$。`,
              )
            : t(
                `Use the antiderivative $-\\frac{${k}}{x}$: the tail integral from $x = ${B}$ to $\\infty$ equals $\\frac{${k}}{${B}} = ${tailErr.toLatex()}$.`,
                `利用原函数 $-\\frac{${k}}{x}$：从 $x = ${B}$ 到 $\\infty$ 的尾积分等于 $\\frac{${k}}{${B}} = ${tailErr.toLatex()}$。`,
              ),
        });
      },
    },
    {
      id: "improper-integrals-near-vertical-asymptotes-with-technology",
      title: t("Investigating Vertical Asymptotes Numerically", "用数值方法研究垂直渐近线处的反常积分"),
      explanation: t(
        "For an improper integral $\\int_0^b f(x)\\,dx$ with a vertical asymptote at $x = 0$, replace the lower bound with a small positive number $\\varepsilon$ (such as $0.01, 0.0001$) and observe whether $\\int_{\\varepsilon}^b f(x)\\,dx$ approaches a finite limit as $\\varepsilon \\to 0^+$.",
        "对于在 $x = 0$ 处有垂直渐近线的反常积分 $\\int_0^b f(x)\\,dx$，可将下限替换为很小的正数 $\\varepsilon$（如 $0.01, 0.0001$），观察当 $\\varepsilon \\to 0^+$ 时 $\\int_{\\varepsilon}^b f(x)\\,dx$ 是否趋近于有限极限。",
      ),
      generate: (rng: Rng) => {
        const k = rng.int(1, 9);
        const m = rng.int(2, 8);
        const a = rng.int(0, 4);
        const b = a + m * m;
        const ans = 2 * k * m;
        return numberProblem({
          prompt: t(
            `To evaluate the improper integral $\\int_{${a}}^{${b}} \\frac{${k}}{\\sqrt{x - ${a}}}\\,dx$ numerically, you compute $J(\\varepsilon) = \\int_{${a}+\\varepsilon}^{${b}} \\frac{${k}}{\\sqrt{x - ${a}}}\\,dx$ for $\\varepsilon = 10^{-2}, 10^{-4}, 10^{-6}$. What limiting value does $J(\\varepsilon)$ approach as $\\varepsilon \\to 0^+$?`,
            `为数值计算反常积分 $\\int_{${a}}^{${b}} \\frac{${k}}{\\sqrt{x - ${a}}}\\,dx$，依次取 $\\varepsilon = 10^{-2}, 10^{-4}, 10^{-6}$ 计算 $J(\\varepsilon) = \\int_{${a}+\\varepsilon}^{${b}} \\frac{${k}}{\\sqrt{x - ${a}}}\\,dx$。当 $\\varepsilon \\to 0^+$ 时，$J(\\varepsilon)$ 趋近的极限值是多少？`,
          ),
          answer: ans,
          wrong: [k * m, k * (b - a), 2 * k * (b - a)],
          solution: t(
            `Since $\\int_{${a}+\\varepsilon}^{${b}} \\frac{${k}}{\\sqrt{x - ${a}}}\\,dx = ${2 * k}\\sqrt{${b - a}} - ${2 * k}\\sqrt{\\varepsilon}$, taking $\\varepsilon \\to 0^+$ gives $${2 * k} \\cdot ${m} = ${ans}$.`,
            `由于 $\\int_{${a}+\\varepsilon}^{${b}} \\frac{${k}}{\\sqrt{x - ${a}}}\\,dx = ${2 * k}\\sqrt{${b - a}} - ${2 * k}\\sqrt{\\varepsilon}$，令 $\\varepsilon \\to 0^+$ 得 $${2 * k} \\cdot ${m} = ${ans}$。`,
          ),
        });
      },
    },
  ],
};

const exploringFunctionsUsingTechnology: TopicDef = {
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
        const x1 = rng.int(1, 3);
        const x2 = rng.int(5, 8);
        const y1 = rng.int(3, 9);
        const y2 = -rng.int(2, 7);
        const askMaxSlope = rng.bool();
        return numberProblem({
          prompt: askMaxSlope
            ? t(
                `By graphing $Y_1 = f'(x)$ on a calculator, you find that $f'(x)$ has a local maximum at $(${x1}, ${y1})$ and a local minimum at $(${x2}, ${y2})$. At the inflection point $x = ${x1}$, what is the slope of the tangent line to the graph of $f$?`,
                `在计算器上绘制 $Y_1 = f'(x)$，测得 $f'(x)$ 在 $(${x1}, ${y1})$ 处取得局部极大值，在 $(${x2}, ${y2})$ 处取得局部极小值。在拐点 $x = ${x1}$ 处，原函数 $f$ 图像的切线斜率是多少？`,
              )
            : t(
                `By graphing $Y_1 = f'(x)$ on a calculator, you find that $f'(x)$ has a local maximum at $(${x1}, ${y1})$ and a local minimum at $(${x2}, ${y2})$. At which larger $x$-coordinate does the graph of $f$ change from concave down to concave up?`,
                `在计算器上绘制 $Y_1 = f'(x)$，测得 $f'(x)$ 在 $(${x1}, ${y1})$ 处取得局部极大值，在 $(${x2}, ${y2})$ 处取得局部极小值。原函数 $f$ 的图像在哪个较大的横坐标 $x$ 处由下凹变为上凹？`,
              ),
          answer: askMaxSlope ? y1 : x2,
          wrong: askMaxSlope ? [x1, y2, 0] : [x1, y2, y1],
          solution: askMaxSlope
            ? t(
                `The point $(${x1}, ${y1})$ lies on the graph of $Y_1 = f'(x)$, so $f'(${x1}) = ${y1}$. Thus the slope of the tangent line to $f$ at its inflection point $x = ${x1}$ is $${y1}$.`,
                `点 $(${x1}, ${y1})$ 在导函数 $Y_1 = f'(x)$ 的图像上，因此 $f'(${x1}) = ${y1}$。故原函数 $f$ 在拐点 $x = ${x1}$ 处的切线斜率为 $${y1}$。`,
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
      title: t("Finding Intervals Where Two Calculus Conditions Hold", "确定同时满足两个微积分性质的区间"),
      explanation: t(
        "By graphing $Y_1 = f'(x)$ and $Y_2 = f''(x)$ in the same viewing window, you can quickly identify intervals where both functions have prescribed signs—for example, where $f$ is both increasing ($f'(x) > 0$) and concave down ($f''(x) < 0$), or where a particle's speed is increasing ($v(t)$ and $a(t)$ have the same sign).",
        "通过在同一个视图窗口中同时绘制 $Y_1 = f'(x)$ 与 $Y_2 = f''(x)$，可以快速确定两个函数同时具有特定符号的区间——例如 $f$ 既递增（$f'(x) > 0$）又下凹（$f''(x) < 0$）的区间，或者质点速率增加（$v(t)$ 与 $a(t)$ 同号）的时间段。",
      ),
      generate: (rng: Rng) => {
        const r1 = rng.int(-4, 4);
        const r2 = r1 + rng.int(2, 9);
        const a = rng.int(1, 4);
        const mid = Q.of(r1 + r2, 2);
        const len = Q.of(r2 - r1, 2);
        return numberProblem({
          prompt: t(
            `You graph $Y_1 = f'(x) = -${a}(x - (${r1}))(x - (${r2}))$ and $Y_2 = f''(x) = ${poly([-2 * a, "x"], [a * (r1 + r2), ""])}$ on a calculator. What is the length of the interval on which $f$ is both increasing and concave up?`,
            `在计算器上绘制 $Y_1 = f'(x) = -${a}(x - (${r1}))(x - (${r2}))$ 与 $Y_2 = f''(x) = ${poly([-2 * a, "x"], [a * (r1 + r2), ""])}$。函数 $f$ 既递增又上凹的区间长度是多少？`,
          ),
          answer: len,
          wrong: [r2 - r1, mid, Q.of(r2 - r1, 4)],
          solution: t(
            `The function $f$ is increasing where $f'(x) > 0$, which is $(${r1}, ${r2})$, and concave up where $f''(x) > 0$, which is $(-\\infty, ${mid.toLatex()})$. Their intersection is $(${r1}, ${mid.toLatex()})$, which has length $${mid.toLatex()} - (${r1}) = ${len.toLatex()}$.`,
            `当 $f'(x) > 0$ 即 $x \\in (${r1}, ${r2})$ 时 $f$ 递增；当 $f''(x) > 0$ 即 $x \\in (-\\infty, ${mid.toLatex()})$ 时 $f$ 上凹。两区间的交集为 $(${r1}, ${mid.toLatex()})$，其长度为 $${mid.toLatex()} - (${r1}) = ${len.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

const plottingParametricAndPolarCurvesUsingTechnology: TopicDef = {
  id: "plotting-parametric-and-polar-curves-using-technology",
  title: t("Plotting Parametric and Polar Curves Using Technology", "利用技术绘制参数曲线与极坐标曲线"),
  summary: t(
    "Plot parametric and polar curves on a calculator to compute speed, tangent slopes, and polar curve intersections and bounds.",
    "在计算器上绘制参数曲线与极坐标曲线，以计算质点速率、切线斜率以及极坐标曲线的交点与积分限。",
  ),
  prerequisites: ["exploring-functions-using-technology", "differentiating-curves-given-in-polar-form"],
  encompasses: [
    { topic: "exploring-functions-using-technology", weight: 0.3 },
    { topic: "differentiating-curves-given-in-polar-form", weight: 0.5 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "parametric-mode-tracing-and-direction",
      title: t("Tracing Parametric Curves and Speed in Parametric Mode", "参数模式下的曲线追踪与速率计算"),
      explanation: t(
        "In Parametric (`PAR`) mode, a graphing calculator plots $(x(t), y(t))$ as $t$ increases from $T_{\\min}$ to $T_{\\max}$ in steps of $T_{\\text{step}}$. Combining numerical derivatives `nDeriv` of $x(t)$ and $y(t)$ lets you compute the slope $\\frac{dy}{dx} = \\frac{y'(t)}{x'(t)}$, the speed $\\sqrt{(x'(t))^2 + (y'(t))^2}$, and the arc length $\\int_{t_1}^{t_2} \\sqrt{(x'(t))^2 + (y'(t))^2}\\,dt$.",
        "在参数（`PAR`）模式下，图形计算器令 $t$ 从 $T_{\\min}$ 以步长 $T_{\\text{step}}$ 递增到 $T_{\\max}$，依次绘制点 $(x(t), y(t))$。结合 $x(t)$ 与 $y(t)$ 的数值导数 `nDeriv`，可以求出切线斜率 $\\frac{dy}{dx} = \\frac{y'(t)}{x'(t)}$、速率 $\\sqrt{(x'(t))^2 + (y'(t))^2}$ 以及弧长 $\\int_{t_1}^{t_2} \\sqrt{(x'(t))^2 + (y'(t))^2}\\,dt$。",
      ),
      generate: (rng: Rng) => {
        const [dx, dy, hyp] = rng.pick([
          [3, 4, 5],
          [5, 12, 13],
          [6, 8, 10],
          [8, 15, 17],
          [9, 12, 15],
        ] as const);
        const t0 = rng.int(1, 5);
        const signX = rng.bool() ? 1 : -1;
        const signY = rng.bool() ? 1 : -1;
        const vx = signX * dx;
        const vy = signY * dy;
        return numberProblem({
          prompt: t(
            `A particle moves in the $xy$-plane so that at time $t = ${t0}$, a calculator's numerical derivative command gives $x'(${t0}) = ${vx}$ and $y'(${t0}) = ${vy}$. What is the speed of the particle at $t = ${t0}$?`,
            `质点在 $xy$ 平面内运动，在 $t = ${t0}$ 时刻，计算器的数值求导功能给出 $x'(${t0}) = ${vx}$ 且 $y'(${t0}) = ${vy}$。质点在 $t = ${t0}$ 时刻的速率是多少？`,
          ),
          answer: hyp,
          wrong: [dx + dy, Math.abs(vx - vy), hyp * hyp],
          solution: t(
            `Speed is the magnitude of the velocity vector: $\\sqrt{(x'(${t0}))^2 + (y'(${t0}))^2} = \\sqrt{(${vx})^2 + (${vy})^2} = \\sqrt{${dx * dx + dy * dy}} = ${hyp}$.`,
            `速率为速度向量的模：$\\sqrt{(x'(${t0}))^2 + (y'(${t0}))^2} = \\sqrt{(${vx})^2 + (${vy})^2} = \\sqrt{${dx * dx + dy * dy}} = ${hyp}$。`,
          ),
        });
      },
    },
    {
      id: "polar-mode-windows-and-area-integrals",
      title: t("Tracing Polar Curves and Rate of Change of Distance to the Origin", "极坐标曲线追踪与到原点距离的变化率"),
      explanation: t(
        "In Polar (`POL`) mode, the calculator plots $(r(\\theta)\\cos\\theta, r(\\theta)\\sin\\theta)$ as $\\theta$ sweeps from $\\theta_{\\min}$ to $\\theta_{\\max}$. When $r(\\theta) > 0$, the distance from the curve to the origin is $r(\\theta)$ itself; the curve moves away from the origin when $r'(\\theta) > 0$ and toward the origin when $r'(\\theta) < 0$.",
        "在极坐标（`POL`）模式下，当 $\\theta$ 从 $\\theta_{\\min}$ 扫过到 $\\theta_{\\max}$ 时，计算器绘制点 $(r(\\theta)\\cos\\theta, r(\\theta)\\sin\\theta)$。当 $r(\\theta) > 0$ 时，曲线上一点到原点的距离即为 $r(\\theta)$；当 $r'(\\theta) > 0$ 时曲线远离原点，当 $r'(\\theta) < 0$ 时曲线靠近原点。",
      ),
      generate: (rng: Rng) => {
        const k = rng.int(2, 6);
        const a = rng.int(1, 5);
        // r(theta) = a + k*theta on [0, pi], at theta = 1: x = r cos theta, y = r sin theta, dr/dtheta = k
        const rVal = a + k;
        const drVal = -rng.int(2, 7);
        const [c, s] = rng.pick([
          [0, 1],
          [-1, 0],
        ] as const);
        const angleTex = c === 0 ? "\\frac{\\pi}{2}" : "\\pi";
        // dy/dtheta = r' sin theta + r cos theta
        const dyDtheta = drVal * s + rVal * c;
        const dxDtheta = drVal * c - rVal * s;
        return numberProblem({
          prompt: t(
            `You plot a polar curve $r = f(\\theta)$ on a graphing calculator. At $\\theta = ${angleTex}$, the calculator table and numerical derivative show $r(${angleTex}) = ${rVal}$ and $r'(${angleTex}) = ${drVal}$. What is the value of $\\frac{dy}{d\\theta}$ at $\\theta = ${angleTex}$?`,
            `在图形计算器上绘制极坐标曲线 $r = f(\\theta)$。在 $\\theta = ${angleTex}$ 处，计算器数值表与数值导数显示 $r(${angleTex}) = ${rVal}$ 且 $r'(${angleTex}) = ${drVal}$。求 $\\theta = ${angleTex}$ 处 $\\frac{dy}{d\\theta}$ 的值。`,
          ),
          answer: dyDtheta,
          wrong: [dxDtheta, drVal, rVal],
          solution: t(
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
