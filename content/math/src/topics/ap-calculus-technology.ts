import type { Figure, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, linear, plane, poly, Q } from "@ga/subject-math";
import { calculusDrawings5 } from "../explanation-drawings-calculus-5.ts";

import { numberProblem, pointLatex, pointProblem, withMistakes } from "../problems.ts";
import { none, type Step, walked } from "./calculus-i-differentiation.ts";
import { slip, worked } from "./calculus-ii-parametric.ts";

// AP Calculus AB Unit 9 & AP Calculus BC Unit 16: Applications of Technology
// (Using Graphing Calculators).

/** step is a labelled step of a worked solution with its displayed lines. */
const step = (en: string, zh: string, said: Text, ...lines: string[]): Step => [[en, zh], said, lines];

/** ratio writes n/d as a fraction and, when it reduces, its lowest terms after it. */
const ratio = (n: number, d: number) => {
  const q = Q.of(n, d).toLatex();
  return q === `\\frac{${n}}{${d}}` ? q : `\\frac{${n}}{${d}} = ${q}`;
};

/** par writes a negative number in parentheses. */
const par = (n: number) => (n < 0 ? `(${n})` : `${n}`);

/** evaluatingExpressionsUsingAGraphingCalculator practices grouping expressions with parentheses, using radian mode, and storing intermediate values at full precision. */
export const evaluatingExpressionsUsingAGraphingCalculator: TopicDef = {
  id: "evaluating-expressions-using-a-graphing-calculator",
  title: t("Evaluating Expressions Using a Graphing Calculator", "用图形计算器计算表达式"),
  summary: t(
    "Group numerators, denominators and compound exponents with parentheses, keep the calculator in radian mode, and store intermediate values at full precision.",
    "用括号对分子、分母与复合指数分组，保持弧度模式，并以完整精度存储中间计算值。",
  ),
  intro: t(
    "A graphing calculator evaluates exactly what is typed, following the order of operations. To evaluate $f(x) = \\frac{3x^2 + 1}{x + 2}$ at $x = 2$, type `(3*2^2 + 1)/(2 + 2)`, which gives $\\frac{13}{4} = 3.25$. Without the parentheses, `3*2^2 + 1/2 + 2` means $12 + \\frac{1}{2} + 2 = 14.5$.\n\nCheck: by hand, the numerator is $3 \\cdot 4 + 1 = 13$ and the denominator is $2 + 2 = 4$, so $f(2) = 3.25$.\n\nIn this lesson we type fractions with the right parentheses, keep the calculator in radian mode, store intermediate results instead of retyping rounded ones, and read numbers shown in E notation.",
    "图形计算器严格按照运算顺序计算所输入的内容。要计算 $f(x) = \\frac{3x^2 + 1}{x + 2}$ 在 $x = 2$ 处的值，应输入 `(3*2^2 + 1)/(2 + 2)`，得 $\\frac{13}{4} = 3.25$。若不加括号，`3*2^2 + 1/2 + 2` 表示 $12 + \\frac{1}{2} + 2 = 14.5$。\n\n检验：手算分子为 $3 \\cdot 4 + 1 = 13$，分母为 $2 + 2 = 4$，所以 $f(2) = 3.25$。\n\n本课我们用正确的括号输入分式，让计算器保持弧度模式，存储中间结果而不重新输入舍入后的值，并读懂 E 记法显示的数。",
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
        "When entering rational or exponential expressions in a single line on a graphing calculator, wrap the entire numerator, denominator, and compound exponent in parentheses so the calculator respects the order of operations. For example, to evaluate $f(x) = \\frac{3x^2 + 1}{x + 2}$ at $x = 2$, entering `(3*2^2 + 1)/(2 + 2)` gives $\\frac{13}{4}$, whereas omitting parentheses and typing `3*2^2 + 1/2 + 2` computes $3(4) + \\frac{1}{2} + 2 = \\frac{29}{2}$.\n\nCheck: by hand, $\\frac{3 \\cdot 2^2 + 1}{2 + 2} = \\frac{13}{4}$, which matches the grouped entry.\n\n> **Watch out.** `(3*2^2 + 1)/2 + 2` still leaves the denominator ungrouped: it divides by $2$ and then adds $2$, giving $\\frac{13}{2} + 2 = 8.5$.",
        "在图形计算器中单行输入分式或指数表达式时，必须将整个分子、整个分母以及复合指数用括号括起来，以确保计算器遵循正确的运算顺序。例如计算 $f(x) = \\frac{3x^2 + 1}{x + 2}$ 在 $x = 2$ 处的值时，输入 `(3*2^2 + 1)/(2 + 2)` 得 $\\frac{13}{4}$，而若漏掉括号输入 `3*2^2 + 1/2 + 2`，计算器会按 $3(4) + \\frac{1}{2} + 2 = \\frac{29}{2}$ 计算。\n\n检验：手算 $\\frac{3 \\cdot 2^2 + 1}{2 + 2} = \\frac{13}{4}$，与加括号的输入结果一致。\n\n> **注意。** `(3*2^2 + 1)/2 + 2` 仍然没有给分母加括号：它先除以 $2$ 再加 $2$，得 $\\frac{13}{2} + 2 = 8.5$。",
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
        const typed = `\`${a}*${x}^2 + ${b}/${x} + ${c}\``;
        const groupedSlip = slip(
          grouped,
          `That is $f(${x})$ from the grouped entry \`(${a}*${x}^2 + ${b})/(${x} + ${c})\`; the line typed here has no parentheses, so the calculator computes something else.`,
          `这是加括号的输入 \`(${a}*${x}^2 + ${b})/(${x} + ${c})\` 所得的 $f(${x})$；这里输入的一行没有括号，计算器算的是别的式子。`,
        );
        const ungroupedSlip = slip(
          ungrouped,
          `That is what ${typed} gives with no parentheses at all: only $${b}$ is divided, and by $${x}$ alone.`,
          `这是完全不加括号输入 ${typed} 的结果：只有 $${b}$ 被除，而且只除以 $${x}$。`,
        );
        const denSlip = slip(
          noDenParen,
          `That is the value of \`(${a}*${x}^2 + ${b})/${x} + ${c}\`, where the numerator is grouped but the denominator is not: it divides by $${x}$ and then adds $${c}$.`,
          `这是 \`(${a}*${x}^2 + ${b})/${x} + ${c}\` 的值，分子加了括号而分母没有：先除以 $${x}$，再加 $${c}$。`,
        );
        const numSlip = slip(
          noNumParen,
          `That is the value of \`${a}*${x}^2 + ${b}/(${x} + ${c})\`, where the denominator is grouped but the numerator is not: only $${b}$ is divided by $${den}$.`,
          `这是 \`${a}*${x}^2 + ${b}/(${x} + ${c})\` 的值，分母加了括号而分子没有：只有 $${b}$ 被 $${den}$ 除。`,
        );
        if (askUngrouped)
          return worked(
            t(
              `A student intends to evaluate $f(x) = \\frac{${a}x^2 + ${b}}{x + ${c}}$ at $x = ${x}$, but omits parentheses and types ${typed} into a calculator. What exact value does the calculator return for this ungrouped entry?`,
              `某学生原本要计算 $f(x) = \\frac{${a}x^2 + ${b}}{x + ${c}}$ 在 $x = ${x}$ 处的值，但漏掉了括号，在计算器中输入了 ${typed}。计算器对该未加括号的输入返回的精确值是多少？`,
            ),
            ungrouped,
            [
              step(
                "Follow the order of operations",
                "按运算顺序",
                t(
                  "The calculator does the power, the product and the division before the additions:",
                  "计算器先算乘方、乘法和除法，再算加法：",
                ),
                `${a} \\cdot ${x}^2 + \\frac{${b}}{${x}} + ${c} = ${a * x * x} + \\frac{${b}}{${x}} + ${c}`,
              ),
              step(
                "Add",
                "相加",
                t("Add the whole numbers, then the fraction:", "先加整数，再加分数："),
                `${a * x * x + c} + \\frac{${b}}{${x}} = ${ungrouped.toLatex()}`,
              ),
            ],
            t(
              `Put the three terms over the common denominator $${x}$: $\\frac{${a} \\cdot ${x}^3 + ${b} + ${c} \\cdot ${x}}{${x}} = ${ratio(a * x ** 3 + b + c * x, x)}$.`,
              `把三项通分到分母 $${x}$：$\\frac{${a} \\cdot ${x}^3 + ${b} + ${c} \\cdot ${x}}{${x}} = ${ratio(a * x ** 3 + b + c * x, x)}$。`,
            ),
            [groupedSlip, denSlip, numSlip],
          );
        return worked(
          t(
            `You evaluate $f(x) = \\frac{${a}x^2 + ${b}}{x + ${c}}$ at $x = ${x}$ on a calculator using the properly grouped entry \`(${a}*${x}^2 + ${b})/(${x} + ${c})\`. What exact value does this produce?`,
            `在计算器上使用正确加括号的输入方式 \`(${a}*${x}^2 + ${b})/(${x} + ${c})\` 计算函数 $f(x) = \\frac{${a}x^2 + ${b}}{x + ${c}}$ 在 $x = ${x}$ 处的值，所得的精确值是多少？`,
          ),
          grouped,
          [
            step("Evaluate the numerator", "计算分子", none, `${a}(${x})^2 + ${b} = ${num}`),
            step("Evaluate the denominator", "计算分母", none, `${x} + ${c} = ${den}`),
            step("Divide", "相除", none, ratio(num, den)),
          ],
          t(
            `Multiply back: the denominator times the result should give the numerator, and $${den} \\cdot ${grouped.toLatex()} = ${num}$.`,
            `反过来乘：分母乘结果应得到分子，而 $${den} \\cdot ${grouped.toLatex()} = ${num}$。`,
          ),
          [ungroupedSlip, denSlip, numSlip],
        );
      },
    },
    {
      id: "radian-mode-and-storing-intermediate-values",
      title: t("Radian Mode and Storing Intermediate Values", "弧度模式与中间值存储"),
      explanation: t(
        "All calculus differentiation and integration formulas for trigonometric functions assume angles are measured in radians, so your graphing calculator must always remain in radian mode on AP Calculus exams. In addition, when a multi-step problem uses an intermediate number $A$, store $A$ in a calculator variable rather than re-typing a rounded approximation. For example, $\\cos\\pi = -1$ in radian mode, while in degree mode the same keys compute $\\cos(3.14159^{\\circ}) \\approx 0.9985$.\n\nCheck: $\\pi$ radians is half a turn, which lands at the point $(-1, 0)$ of the unit circle, so its cosine is $-1$.\n\n> **Watch out.** Rounding early carries the error into every later step: with $A = 2.004$ stored, $3000A = 6012$, but retyping $2.00$ gives $6000$, which is $12$ too small.",
        "微积分中所有三角函数的求导与积分公式都以弧度制为前提，因此在 AP 微积分考试中图形计算器必须始终处于弧度（Radian）模式。此外，当多步计算题需要使用中间数值 $A$ 时，应将 $A$ 存储在计算器变量中，切勿将四舍五入后的近似值重新输入，以免产生累计舍入误差。例如在弧度模式下 $\\cos\\pi = -1$，而在角度模式下按同样的键计算的是 $\\cos(3.14159^{\\circ}) \\approx 0.9985$。\n\n检验：$\\pi$ 弧度是半圈，落在单位圆上的点 $(-1, 0)$，所以余弦为 $-1$。\n\n> **注意。** 过早舍入会把误差带进后面每一步：存储 $A = 2.004$ 时 $3000A = 6012$，而重新输入 $2.00$ 得 $6000$，少了 $12$。",
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
          const angle = `\\frac{${x}\\pi}{2}`;
          return worked(
            t(
              `With your graphing calculator set to Radian mode, you evaluate $f(x) = ${a}\\cos(\\pi x) + ${b}\\sin\\left(\\frac{\\pi x}{2}\\right)$ at $x = ${x}$. What exact value does the calculator return?`,
              `将图形计算器设为弧度（Radian）模式，计算函数 $f(x) = ${a}\\cos(\\pi x) + ${b}\\sin\\left(\\frac{\\pi x}{2}\\right)$ 在 $x = ${x}$ 处的值，计算器返回的精确值是多少？`,
            ),
            Q.of(radAns),
            [
              step(
                "Place the angles on the unit circle",
                "把角放到单位圆上",
                t(
                  `$${x}\\pi$ is an odd multiple of $\\pi$, at the point $(-1, 0)$; $${angle}$ is an odd multiple of $\\frac{\\pi}{2}$, at the point $(0, ${sinVal})$:`,
                  `$${x}\\pi$ 是 $\\pi$ 的奇数倍，落在点 $(-1, 0)$；$${angle}$ 是 $\\frac{\\pi}{2}$ 的奇数倍，落在点 $(0, ${sinVal})$：`,
                ),
                `\\cos(${x}\\pi) = -1, \\quad \\sin\\left(${angle}\\right) = ${sinVal}`,
              ),
              step("Substitute", "代入", none, `f(${x}) = ${a}(-1) + ${b}(${sinVal}) = ${radAns}`),
            ],
            t(
              `Get the cosine from the sine instead, by $\\cos 2u = 1 - 2\\sin^2 u$ with $u = ${angle}$: $\\cos(${x}\\pi) = 1 - 2(${sinVal})^2 = -1$, so again $f(${x}) = ${-a} ${sinVal > 0 ? "+" : "-"} ${b} = ${radAns}$.`,
              `改由正弦求余弦，用 $\\cos 2u = 1 - 2\\sin^2 u$，取 $u = ${angle}$：$\\cos(${x}\\pi) = 1 - 2(${sinVal})^2 = -1$，所以仍得 $f(${x}) = ${-a} ${sinVal > 0 ? "+" : "-"} ${b} = ${radAns}$。`,
            ),
            [
              slip(
                a + b * sinVal,
                `This takes $\\cos(${x}\\pi)$ as $1$; an odd multiple of $\\pi$ is half a turn past whole turns, where the cosine is $-1$.`,
                `这把 $\\cos(${x}\\pi)$ 当成了 $1$；$\\pi$ 的奇数倍比整圈多半圈，余弦是 $-1$。`,
              ),
              slip(
                -a - b * sinVal,
                `This has the sign of $\\sin\\left(${angle}\\right)$ the wrong way round; the angle lands at $(0, ${sinVal})$, so the sine is $${sinVal}$.`,
                `这把 $\\sin\\left(${angle}\\right)$ 的符号弄反了；这个角落在 $(0, ${sinVal})$，正弦是 $${sinVal}$。`,
              ),
              slip(
                -a,
                `This drops the sine term, as if it were $\\sin(${x}\\pi) = 0$; the angle is $${angle}$, an odd multiple of $\\frac{\\pi}{2}$, where the sine is $\\pm 1$.`,
                `这丢掉了正弦项，好像它是 $\\sin(${x}\\pi) = 0$；角是 $${angle}$，是 $\\frac{\\pi}{2}$ 的奇数倍，正弦为 $\\pm 1$。`,
              ),
            ],
          );
        }
        const k = rng.int(2, 9) * 1000;
        const baseTenths = rng.int(12, 38);
        const extraThousandths = rng.int(2, 4);
        const exactThousandths = baseTenths * 100 + extraThousandths;
        const exactVal = (k * exactThousandths) / 1000;
        const roundedVal = (k * (baseTenths * 100)) / 1000;
        const diff = exactVal - roundedVal;
        const stored = (exactThousandths / 1000).toFixed(3);
        const rounded = (baseTenths / 10).toFixed(2);
        return worked(
          t(
            `A calculator stores the intermediate value $A = ${stored}$. If you compute $N = ${k}A$ using the stored value of $A$ instead of the two-decimal rounded value $${rounded}$, by how much does the stored-value result exceed the prematurely rounded result?`,
            `计算器存储了中间值 $A = ${stored}$。若使用存储的 $A$ 值计算 $N = ${k}A$，而不是使用四舍五入到两位小数的值 $${rounded}$，使用存储值所得结果比提前舍入所得结果大多少？`,
          ),
          Q.of(diff),
          [
            step("Use the stored value", "用存储值", none, `${k} \\times ${stored} = ${exactVal}`),
            step("Use the rounded value", "用舍入值", none, `${k} \\times ${rounded} = ${roundedVal}`),
            step("Subtract", "相减", none, `${exactVal} - ${roundedVal} = ${diff}`),
          ],
          t(
            `Only the dropped digits matter: $${stored} - ${rounded} = 0.00${extraThousandths}$, and $${k} \\times 0.00${extraThousandths} = ${diff}$.`,
            `只有被舍去的数字起作用：$${stored} - ${rounded} = 0.00${extraThousandths}$，而 $${k} \\times 0.00${extraThousandths} = ${diff}$。`,
          ),
          [
            slip(
              exactVal,
              `That is $N$ itself with the stored value; the question asks for the difference.`,
              `这是用存储值算出的 $N$ 本身；题目问的是差。`,
            ),
            slip(
              roundedVal,
              `That is $N$ with the rounded value; the question asks for the difference.`,
              `这是用舍入值算出的 $N$；题目问的是差。`,
            ),
            slip(
              diff * 10,
              `This misplaces the decimal point: the dropped part of $A$ is $0.00${extraThousandths}$, not $0.0${extraThousandths}$.`,
              `这把小数点的位置弄错了：$A$ 被舍去的部分是 $0.00${extraThousandths}$，不是 $0.0${extraThousandths}$。`,
            ),
            slip(
              Q.of(extraThousandths, 1000),
              `That is the difference in $A$; multiply it by $${k}$ to get the difference in $N$.`,
              `这是 $A$ 的差；乘以 $${k}$ 才是 $N$ 的差。`,
            ),
          ],
        );
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
  intro: t(
    "A calculator's `zero` command needs a left bound and a right bound around one root, and a sign change provides them. For $f(x) = x^3 - 5$, $f(1) = -4 < 0$ and $f(2) = 3 > 0$, so by the Intermediate Value Theorem a root lies in $(1, 2)$; with these bounds the calculator returns $x \\approx 1.710$.\n\nCheck: $1.710^3 \\approx 5.000$, so $f(1.710) \\approx 0$.\n\nIn this lesson we bracket roots by sign changes, solve an equation $g(x) = c$ as a zero of $g(x) - c$, and narrow a bracket by bisection.",
    "计算器的求零点（`zero`）命令需要在一个根两侧给出左边界和右边界，而符号变化正好提供这两个边界。对 $f(x) = x^3 - 5$，$f(1) = -4 < 0$，$f(2) = 3 > 0$，由介值定理，$(1, 2)$ 内有根；用这两个边界，计算器给出 $x \\approx 1.710$。\n\n检验：$1.710^3 \\approx 5.000$，所以 $f(1.710) \\approx 0$。\n\n本课我们用符号变化锁定根，把方程 $g(x) = c$ 化为 $g(x) - c$ 的零点来解，并用二分法缩小区间。",
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
        "The graphing calculator's `zero` (or `root`) command requires a left bound $a$ and a right bound $b$ surrounding a single $x$-intercept. For a continuous function $f$, a sign change ($f(a)$ and $f(b)$ having opposite signs) guarantees by the Intermediate Value Theorem that at least one root lies in $(a, b)$. For $f(x) = x^3 - 5$, $f(1) = -4$ and $f(2) = 3$, so $a = 1$ and $b = 2$ bracket a root.\n\nCheck: the root is $\\sqrt[3]{5} \\approx 1.71$, which indeed lies between $1$ and $2$.\n\n> **Watch out.** The bounds must sit on either side of the sign change. Two bounds where $f$ has the same sign, such as $f(2) = 3$ and $f(3) = 22$, need not contain any root.",
        "图形计算器的求零点（`zero` 或 `root`）功能需要指定包含单个 $x$ 轴交点的左边界 $a$ 和右边界 $b$。对于连续函数 $f$，若 $f(a)$ 与 $f(b)$ 异号，则由介值定理可知区间 $(a, b)$ 内必存在至少一个实根。对 $f(x) = x^3 - 5$，$f(1) = -4$，$f(2) = 3$，所以 $a = 1$、$b = 2$ 锁定了一个根。\n\n检验：这个根是 $\\sqrt[3]{5} \\approx 1.71$，确实在 $1$ 与 $2$ 之间。\n\n> **注意。** 两个边界必须分处符号变化的两侧。$f$ 同号的两个边界，例如 $f(2) = 3$ 与 $f(3) = 22$，之间不一定有根。",
      ),
      generate: (rng: Rng) => {
        const k = rng.int(1, 6);
        const v0 = -rng.int(5, 9);
        const v1 = -rng.int(1, 4);
        const v2 = rng.int(1, 4);
        const v3 = rng.int(5, 9);
        return worked(
          t(
            `A calculator table for a strictly increasing continuous function $f(x)$ shows $f(${k}) = ${v0}$, $f(${k + 1}) = ${v1}$, $f(${k + 2}) = ${v2}$, and $f(${k + 3}) = ${v3}$. If you use consecutive integers $[n, n+1]$ as the left and right bounds for the calculator's root finder, what is the left bound $n$?`,
            `严格递增连续函数 $f(x)$ 的计算器数值表显示：$f(${k}) = ${v0}$，$f(${k + 1}) = ${v1}$，$f(${k + 2}) = ${v2}$，$f(${k + 3}) = ${v3}$。若选用相邻整数 $[n, n+1]$ 作为计算器求根功能的左、右边界，左边界 $n$ 是多少？`,
          ),
          Q.of(k + 1),
          [
            step(
              "Read the signs",
              "看符号",
              t(
                `The values are negative at $x = ${k}, ${k + 1}$ and positive at $x = ${k + 2}, ${k + 3}$:`,
                `函数值在 $x = ${k}, ${k + 1}$ 处为负，在 $x = ${k + 2}, ${k + 3}$ 处为正：`,
              ),
              `f(${k + 1}) = ${v1} < 0, \\quad f(${k + 2}) = ${v2} > 0`,
            ),
            step(
              "Bracket the root",
              "锁定根",
              t(
                `The only sign change is between $${k + 1}$ and $${k + 2}$, so the bounds are $[${k + 1}, ${k + 2}]$ and $n = ${k + 1}$.`,
                `唯一的变号发生在 $${k + 1}$ 与 $${k + 2}$ 之间，所以边界是 $[${k + 1}, ${k + 2}]$，$n = ${k + 1}$。`,
              ),
            ),
          ],
          t(
            `Since $f$ increases, it has only one root, and that root lies above every $x$ with $f(x) < 0$ (the largest is $${k + 1}$) and below every $x$ with $f(x) > 0$ (the smallest is $${k + 2}$): between $${k + 1}$ and $${k + 2}$ again.`,
            `由于 $f$ 递增，它只有一个根，而且这个根大于所有使 $f(x) < 0$ 的 $x$（其中最大的是 $${k + 1}$），小于所有使 $f(x) > 0$ 的 $x$（其中最小的是 $${k + 2}$）：同样在 $${k + 1}$ 与 $${k + 2}$ 之间。`,
          ),
          [
            slip(
              k,
              `On $[${k}, ${k + 1}]$ both values, $${v0}$ and $${v1}$, are negative: there is no sign change to bracket.`,
              `在 $[${k}, ${k + 1}]$ 上两个值 $${v0}$ 与 $${v1}$ 都是负的：没有变号可以锁定根。`,
            ),
            slip(
              k + 2,
              `$${k + 2}$ is the right bound of the bracket; on $[${k + 2}, ${k + 3}]$ both values are positive.`,
              `$${k + 2}$ 是右边界；在 $[${k + 2}, ${k + 3}]$ 上两个值都是正的。`,
            ),
            slip(
              k + 3,
              `Since $f$ increases and $f(${k + 3}) = ${v3} > 0$, $f$ stays positive after $${k + 3}$, so no root lies there.`,
              `由于 $f$ 递增且 $f(${k + 3}) = ${v3} > 0$，$f$ 在 $${k + 3}$ 之后一直为正，那里没有根。`,
            ),
          ],
        );
      },
    },
    {
      id: "solving-equations-with-a-difference-function",
      figure: calculusDrawings5["finding-roots-of-functions-using-a-graphing-calculator#solving-equations-with-a-difference-function"],
      title: t("Solving Equations by Finding Zeros of a Difference Function", "通过求差函数的零点解方程"),
      explanation: t(
        "Any equation $g(x) = c$ can be solved with a calculator's root finder by graphing the difference function $Y_1 = g(x) - c$ and locating its $x$-intercept. Zooming in with a table step of $\\Delta\\text{Tbl} = 0.001$ around the sign change of $Y_1(x)$ determines the root to three decimal places. For $e^x + x = 5$, graph $Y_1 = e^x + x - 5$: $Y_1(1) \\approx -1.28$ and $Y_1(2) \\approx 4.39$, and the root finder gives $x \\approx 1.307$.\n\nCheck: $e^{1.307} + 1.307 \\approx 3.695 + 1.307 = 5.002 \\approx 5$.\n\n> **Watch out.** Graph $g(x) - c$, not $g(x)$: the zeros of $g(x)$ solve $g(x) = 0$, not $g(x) = c$.",
        "对于任意方程 $g(x) = c$，都可以通过绘制差函数 $Y_1 = g(x) - c$ 并定位其 $x$ 轴交点来用计算器求根功能求解。在 $Y_1(x)$ 变号处将数值表步长设为 $\\Delta\\text{Tbl} = 0.001$，即可将根确定到小数点后三位。对 $e^x + x = 5$，画 $Y_1 = e^x + x - 5$：$Y_1(1) \\approx -1.28$，$Y_1(2) \\approx 4.39$，求根功能给出 $x \\approx 1.307$。\n\n检验：$e^{1.307} + 1.307 \\approx 3.695 + 1.307 = 5.002 \\approx 5$。\n\n> **注意。** 要画 $g(x) - c$，而不是 $g(x)$：$g(x)$ 的零点解的是 $g(x) = 0$，不是 $g(x) = c$。",
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
        const lnC = Q.of(Math.round(Math.log(c) * 1000), 1000);
        const back = (Math.exp(thousandths / 1000) + thousandths / 1000).toFixed(3);
        return numberProblem({
          prompt: t(
            `To solve $e^x + x = ${c}$, you graph the difference function $Y_1 = e^x + x - ${c}$ and inspect a zoomed calculator table with step $\\Delta\\text{Tbl} = 0.001$:\n\n$$Y_1(${dec(rMinus)}) = ${yMinus}, \\quad Y_1(${dec(r)}) = ${yZero}, \\quad Y_1(${dec(rPlus)}) = ${yPlus}.$$\n\nWhat is the root of $e^x + x = ${c}$ rounded to three decimal places?`,
            `为解方程 $e^x + x = ${c}$，绘制差函数 $Y_1 = e^x + x - ${c}$ 并查看步长为 $\\Delta\\text{Tbl} = 0.001$ 的局部放大计算器数值表：\n\n$$Y_1(${dec(rMinus)}) = ${yMinus}, \\quad Y_1(${dec(r)}) = ${yZero}, \\quad Y_1(${dec(rPlus)}) = ${yPlus}$$\n\n求方程 $e^x + x = ${c}$ 精确到小数点后三位的根。`,
          ),
          answer: r,
          form: "decimal",
          mistakes: [
            {
              value: rMinus,
              why: t(
                `$Y_1(${dec(rMinus)}) = ${yMinus}$ is further from $0$ than $Y_1(${dec(r)}) = ${yZero}$; the root rounds to the table entry nearest to it.`,
                `$Y_1(${dec(rMinus)}) = ${yMinus}$ 比 $Y_1(${dec(r)}) = ${yZero}$ 离 $0$ 更远；根应舍入到离它最近的那个表值。`,
              ),
            },
            {
              value: rPlus,
              why: t(
                `$Y_1(${dec(rPlus)}) = ${yPlus}$ is further from $0$ than $Y_1(${dec(r)}) = ${yZero}$; the root rounds to the table entry nearest to it.`,
                `$Y_1(${dec(rPlus)}) = ${yPlus}$ 比 $Y_1(${dec(r)}) = ${yZero}$ 离 $0$ 更远；根应舍入到离它最近的那个表值。`,
              ),
            },
            {
              value: lnC,
              why: t(
                `That solves $e^x = ${c}$, leaving out the $+\\,x$ term; it is $\\ln ${c}$, not a zero of $Y_1$.`,
                `这解的是 $e^x = ${c}$，漏掉了 $+\\,x$ 项；它是 $\\ln ${c}$，不是 $Y_1$ 的零点。`,
              ),
            },
          ],
          solution: walked(
            [
              step(
                "Find the sign change",
                "找变号",
                t(
                  `$Y_1$ is negative at $${dec(rMinus)}$ and positive at $${dec(rPlus)}$, so the root lies between them.`,
                  `$Y_1$ 在 $${dec(rMinus)}$ 处为负，在 $${dec(rPlus)}$ 处为正，所以根在两者之间。`,
                ),
              ),
              step(
                "Pick the nearest entry",
                "取最近的表值",
                t(
                  `Of the three values, $Y_1(${dec(r)}) = ${yZero}$ is the closest to $0$, so the root rounded to three decimal places is $${dec(r)}$.`,
                  `三个值中 $Y_1(${dec(r)}) = ${yZero}$ 最接近 $0$，所以精确到三位小数的根是 $${dec(r)}$。`,
                ),
              ),
            ],
            t(
              `Substitute into the original equation: $e^{${dec(r)}} + ${dec(r)} \\approx ${back}$, which rounds to $${c}$.`,
              `代回原方程：$e^{${dec(r)}} + ${dec(r)} \\approx ${back}$，约等于 $${c}$。`,
            ),
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
  intro: t(
    "To solve $f(x) = g(x)$ on a calculator, graph $Y_1 = f(x)$ and $Y_2 = g(x)$ and use the `intersect` command. For $Y_1 = x^2$ and $Y_2 = x + 2$, it finds the points $(-1, 1)$ and $(2, 4)$.\n\nCheck: $(-1)^2 = 1 = -1 + 2$ and $2^2 = 4 = 2 + 2$, so both points lie on both graphs.\n\nIn this lesson we read intersection points, choose a window large enough to show every intersection, and count crossings from the sign changes of $f(x) - g(x)$.",
    "在计算器上解 $f(x) = g(x)$，可画出 $Y_1 = f(x)$ 与 $Y_2 = g(x)$，再用求交点（`intersect`）命令。对 $Y_1 = x^2$ 与 $Y_2 = x + 2$，它求出交点 $(-1, 1)$ 和 $(2, 4)$。\n\n检验：$(-1)^2 = 1 = -1 + 2$，$2^2 = 4 = 2 + 2$，所以两个点都在两条图象上。\n\n本课我们读出交点坐标，选取足够大的窗口以显示所有交点，并由 $f(x) - g(x)$ 的变号数出交点个数。",
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
        "To solve $f(x) = g(x)$ graphically, graph $Y_1 = f(x)$ and $Y_2 = g(x)$ and use the `intersect` command (or inspect a table where $Y_1(x) = Y_2(x)$). In AP Calculus area and volume problems, always store the intersection coordinates $(x, y)$ in calculator variables to use as limits of integration. For $Y_1 = x^2$ and $Y_2 = x + 2$, the table row $x = 2$ shows $Y_1 = Y_2 = 4$, so $(2, 4)$ is an intersection.\n\nCheck: $(2, 4)$ satisfies both equations: $2^2 = 4$ and $2 + 2 = 4$.\n\n> **Watch out.** An intersection is a point $(x, y)$ with the $x$-coordinate first. Reversed, $(4, 2)$ lies on neither graph.",
        "用图像法解方程 $f(x) = g(x)$ 时，可分别绘制 $Y_1 = f(x)$ 与 $Y_2 = g(x)$ 并使用求交点（`intersect`）命令（或在数值表中寻找使 $Y_1(x) = Y_2(x)$ 的行）。在 AP 微积分的面积与体积问题中，务必将交点坐标 $(x, y)$ 存入计算器变量以作为积分上下限。对 $Y_1 = x^2$ 与 $Y_2 = x + 2$，数值表中 $x = 2$ 这一行显示 $Y_1 = Y_2 = 4$，所以 $(2, 4)$ 是交点。\n\n检验：$(2, 4)$ 满足两个方程：$2^2 = 4$，$2 + 2 = 4$。\n\n> **注意。** 交点是点 $(x, y)$，横坐标在前。反过来的 $(4, 2)$ 不在任何一条图象上。",
      ),
      generate: (rng: Rng) => {
        const x0 = rng.int(1, 6);
        const y0 = rng.int(4, 18);
        const d1 = rng.int(2, 5);
        const d2 = rng.int(2, 5);
        const problem = pointProblem({
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
          solution: walked(
            [
              step(
                "Compare the rows",
                "比较各行",
                t(
                  `The two columns agree only in the row $x = ${x0}$; in the other rows they differ:`,
                  `两列只在 $x = ${x0}$ 这一行相等；其他行都不相等：`,
                ),
                `Y_1(${x0}) = Y_2(${x0}) = ${y0}, \\quad ${y0 - d1} \\ne ${y0 - d1 + d2}, \\quad ${y0 + d2} \\ne ${y0 + d2 - d1}`,
              ),
              step(
                "Write the point",
                "写出点",
                t(`The $x$-coordinate comes first: the intersection is $(${x0}, ${y0})$.`, `横坐标在前：交点是 $(${x0}, ${y0})$。`),
              ),
            ],
            t(
              `Look at the difference $Y_1 - Y_2$ instead: it is $${-d2}$ at $x = ${x0 - 1}$, $0$ at $x = ${x0}$ and $${d1}$ at $x = ${x0 + 1}$. It changes sign exactly at its zero $x = ${x0}$, where $Y_1 = ${y0}$.`,
              `改看差 $Y_1 - Y_2$：它在 $x = ${x0 - 1}$ 处为 $${-d2}$，在 $x = ${x0}$ 处为 $0$，在 $x = ${x0 + 1}$ 处为 $${d1}$。它恰在零点 $x = ${x0}$ 处变号，此时 $Y_1 = ${y0}$。`,
            ),
          ),
        });
        return withMistakes(problem, [
          {
            response: pointLatex([y0, x0]),
            why: t(
              `This lists the coordinates in reverse; the $x$-coordinate $${x0}$ comes first.`,
              `这把坐标顺序写反了；横坐标 $${x0}$ 应在前。`,
            ),
          },
          {
            response: pointLatex([x0 - 1, y0 - d1]),
            why: t(
              `At $x = ${x0 - 1}$ the columns differ, $${y0 - d1} \\ne ${y0 - d1 + d2}$: this point is on $Y_1$ only.`,
              `在 $x = ${x0 - 1}$ 处两列不相等，$${y0 - d1} \\ne ${y0 - d1 + d2}$：这个点只在 $Y_1$ 上。`,
            ),
          },
          {
            response: pointLatex([x0 + 1, y0 + d2]),
            why: t(
              `At $x = ${x0 + 1}$ the columns differ, $${y0 + d2} \\ne ${y0 + d2 - d1}$: this point is on $Y_1$ only.`,
              `在 $x = ${x0 + 1}$ 处两列不相等，$${y0 + d2} \\ne ${y0 + d2 - d1}$：这个点只在 $Y_1$ 上。`,
            ),
          },
        ]);
      },
    },
    {
      id: "counting-intersections-by-window-and-end-behavior",
      title: t("Adjusting the Viewing Window to Find All Intersections", "调整视图窗口以找出所有交点"),
      explanation: t(
        "A standard $[-10, 10] \\times [-10, 10]$ viewing window misses any intersection $(x_0, y_0)$ with $|x_0| > 10$ or $|y_0| > 10$. To display that intersection on screen, both $X_{\\max} > x_0$ and $Y_{\\max} > y_0$ (for a first-quadrant intersection) must be chosen large enough. For example, $Y_1 = x^2$ and $Y_2 = 12x - 11$ meet at $(1, 1)$ and at $(11, 121)$; the second point needs $X_{\\max} > 11$ and $Y_{\\max} > 121$.\n\nCheck: $11^2 = 121$ and $12 \\cdot 11 - 11 = 121$, so $(11, 121)$ is on both graphs.\n\n> **Watch out.** Both window settings must change: the point $(11, 121)$ stays off screen if either $X_{\\max} \\le 11$ or $Y_{\\max} \\le 121$.",
        "标准视图窗口 $[-10, 10] \\times [-10, 10]$ 会遗漏满足 $|x_0| > 10$ 或 $|y_0| > 10$ 的交点 $(x_0, y_0)$。要在屏幕上完整显示第一象限内的该交点，必须将窗口边界调整为 $X_{\\max} > x_0$ 且 $Y_{\\max} > y_0$。例如 $Y_1 = x^2$ 与 $Y_2 = 12x - 11$ 交于 $(1, 1)$ 和 $(11, 121)$；第二个点需要 $X_{\\max} > 11$ 且 $Y_{\\max} > 121$。\n\n检验：$11^2 = 121$，$12 \\cdot 11 - 11 = 121$，所以 $(11, 121)$ 在两条图象上。\n\n> **注意。** 两个窗口设置都要改：只要 $X_{\\max} \\le 11$ 或 $Y_{\\max} \\le 121$，点 $(11, 121)$ 就仍在屏幕之外。",
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
        const square = `${a === 1 ? "" : `${a} \\cdot `}${r2}^2${c === 0 ? "" : ` + ${c}`}`;
        return worked(
          t(
            `On the standard $[-10, 10] \\times [-10, 10]$ viewing window, a student sees only one intersection of $Y_1 = ${poly([a, "x^2"], [c, ""])}$ and $Y_2 = ${poly([m, "x"], [b, ""])}$ at $(${r1}, ${y1})$. The second intersection occurs at $x = ${r2}$. What is the $y$-coordinate of this second intersection that $Y_{\\max}$ must exceed for the intersection to appear in the viewing window?`,
            `在标准视图窗口 $[-10, 10] \\times [-10, 10]$ 下，某学生只看到 $Y_1 = ${poly([a, "x^2"], [c, ""])}$ 与 $Y_2 = ${poly([m, "x"], [b, ""])}$ 在 $(${r1}, ${y1})$ 处的一个交点。第二个交点位于 $x = ${r2}$ 处。要使该交点显示在视图窗口内，$Y_{\\max}$ 必须超过该交点的纵坐标 $y$，求这个纵坐标的值。`,
          ),
          Q.of(y2),
          [
            step("Substitute into $Y_1$", "代入 $Y_1$", none, `Y_1(${r2}) = ${square} = ${y2}`),
            step(
              "Set the window",
              "设置窗口",
              t(
                `The point $(${r2}, ${y2})$ appears only if $Y_{\\max} > ${y2}$ (and $X_{\\max} > ${r2}$).`,
                `只有 $Y_{\\max} > ${y2}$（且 $X_{\\max} > ${r2}$）时，点 $(${r2}, ${y2})$ 才会出现。`,
              ),
            ),
          ],
          t(
            `Substitute into $Y_2$ instead: $${m} \\cdot ${r2} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${y2}$, the same value, so $(${r2}, ${y2})$ is on both graphs.`,
            `改代入 $Y_2$：$${m} \\cdot ${r2} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${y2}$，值相同，所以 $(${r2}, ${y2})$ 在两条图象上。`,
          ),
          [
            slip(
              r2,
              `That is the $x$-coordinate of the second intersection; $Y_{\\max}$ bounds the $y$-values.`,
              `这是第二个交点的横坐标；$Y_{\\max}$ 限制的是纵坐标。`,
            ),
            slip(
              m * r2,
              `That is only the term $${m}x$ of $Y_2$ at $x = ${r2}$; the constant $${b}$ is left out.`,
              `这只是 $Y_2$ 中 $${m}x$ 一项在 $x = ${r2}$ 处的值；漏掉了常数 $${b}$。`,
            ),
            slip(
              y1,
              `That is the $y$-coordinate of the first intersection, which is already on screen.`,
              `这是第一个交点的纵坐标，它已经在屏幕上了。`,
            ),
          ],
        );
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
  intro: t(
    "The `maximum` and `minimum` commands report a local extremum $(x, y)$ inside a chosen interval. For $f(x) = x^3 - 3x$ on $[0, 3]$, `minimum` gives $(1, -2)$; the absolute maximum, though, is at the endpoint, $f(3) = 18$.\n\nCheck: $f'(x) = 3x^2 - 3$ is zero in $[0, 3]$ only at $x = 1$, and the candidates are $f(0) = 0$, $f(1) = -2$ and $f(3) = 18$.\n\nIn this lesson we read extreme values from calculator commands, find extrema from the zeros of a graphed derivative, and compare them with the endpoints.",
    "最大值（`maximum`）与最小值（`minimum`）命令给出所选区间内的局部极值点 $(x, y)$。对 $[0, 3]$ 上的 $f(x) = x^3 - 3x$，`minimum` 给出 $(1, -2)$；但绝对最大值在端点处，$f(3) = 18$。\n\n检验：$f'(x) = 3x^2 - 3$ 在 $[0, 3]$ 上只在 $x = 1$ 处为零，候选值是 $f(0) = 0$、$f(1) = -2$ 和 $f(3) = 18$。\n\n本课我们用计算器命令读出极值，由所画导函数的零点找极值，并与端点比较。",
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
        "The graphing calculator's `minimum` and `maximum` commands report the coordinates $(x, y)$ of a local extremum within a user-specified interval $[a, b]$. Always distinguish between the location of the extremum (the $x$-coordinate) and the extreme value itself (the $y$-coordinate), and compare interior extrema with endpoint values when finding an absolute extremum on $[a, b]$. For $f(x) = x^3 - 3x$ on $[0, 3]$, the candidates are $f(0) = 0$, the minimum point $(1, -2)$ and $f(3) = 18$, so the absolute maximum is $18$ and the absolute minimum is $-2$.\n\nCheck: $f'(x) = 3x^2 - 3$ vanishes in $(0, 3)$ only at $x = 1$, so no other interior point can be an extremum.\n\n> **Watch out.** The question may ask for the value $y$, not its location $x$: the minimum point is $(1, -2)$, and the minimum value is $-2$.",
        "图形计算器的 `minimum`（最小值）与 `maximum`（最大值）命令会报告指定区间 $[a, b]$ 内局部极值点的坐标 $(x, y)$。解题时务必区分极值的位置（横坐标 $x$）与极值本身（纵坐标 $y$）；在求闭区间 $[a, b]$ 上的绝对最值时，还需将内部极值与端点函数值进行比较。对 $[0, 3]$ 上的 $f(x) = x^3 - 3x$，候选值是 $f(0) = 0$、极小值点 $(1, -2)$ 和 $f(3) = 18$，所以绝对最大值是 $18$，绝对最小值是 $-2$。\n\n检验：$f'(x) = 3x^2 - 3$ 在 $(0, 3)$ 内只在 $x = 1$ 处为零，所以其他内部点都不是极值点。\n\n> **注意。** 题目可能问的是值 $y$，而不是位置 $x$：极小值点是 $(1, -2)$，极小值是 $-2$。",
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
        // The two candidates for the asked extreme: the calculator's interior extremum and the endpoint beside it.
        const inner = askMax ? { x: xMin, y: yLocalMax } : { x: xMax, y: yLocalMin };
        const end = askMax ? { x: 8, y: yEndRight } : { x: 0, y: yEndLeft };
        const endWins = askMax ? end.y > inner.y : end.y < inner.y;
        const [win, lose] = endWins ? [end, inner] : [inner, end];
        const values = [yEndLeft, yLocalMax, yLocalMin, yEndRight].sort((p, q) => p - q);
        return worked(
          t(
            `To analyze a continuous function $f$ on $[0, 8]$, you use a graphing calculator:\n\n- Endpoint values: $f(0) = ${yEndLeft}$ and $f(8) = ${yEndRight}$\n- Calculator \`Maximum\` command on $(0, 8)$: $(${xMin}, ${yLocalMax})$\n- Calculator \`Minimum\` command on $(0, 8)$: $(${xMax}, ${yLocalMin})$\n\nWhat is the absolute ${en} value of $f$ on the closed interval $[0, 8]$?`,
            `在 $[0, 8]$ 上分析连续函数 $f$ 时，使用图形计算器测得：\n\n- 端点值：$f(0) = ${yEndLeft}$，$f(8) = ${yEndRight}$\n- $(0, 8)$ 内的 \`Maximum\`（最大值）命令结果：$(${xMin}, ${yLocalMax})$\n- $(0, 8)$ 内的 \`Minimum\`（最小值）命令结果：$(${xMax}, ${yLocalMin})$\n\n函数 $f$ 在闭区间 $[0, 8]$ 上的绝对${zh}是多少？`,
          ),
          Q.of(win.y),
          [
            step(
              "List the candidates",
              "列出候选值",
              t(
                "An absolute extremum on a closed interval is at an interior extremum or at an endpoint, so the candidate values are:",
                "闭区间上的绝对最值出现在内部极值点或端点，所以候选值是：",
              ),
              `f(0) = ${yEndLeft}, \\quad f(${xMin}) = ${yLocalMax}, \\quad f(${xMax}) = ${yLocalMin}, \\quad f(8) = ${yEndRight}`,
            ),
            step(
              `Pick the ${askMax ? "largest" : "smallest"}`,
              `取${askMax ? "最大" : "最小"}的`,
              t(
                `The ${askMax ? "largest" : "smallest"} is $${win.y}$, at $x = ${win.x}$${endWins ? ", an endpoint" : ""}.`,
                `${askMax ? "最大" : "最小"}的是 $${win.y}$，在 $x = ${win.x}$ 处${endWins ? "，这是端点" : ""}。`,
              ),
            ),
          ],
          t(
            `Put all four values in order: $${values.join(" < ")}$. The ${askMax ? "last" : "first"} one is $${win.y}$.`,
            `把四个值排序：$${values.join(" < ")}$。${askMax ? "最后" : "最前"}一个是 $${win.y}$。`,
          ),
          [
            slip(
              lose.y,
              endWins
                ? `That is the calculator's local ${en}, the extreme only inside $(0, 8)$; the endpoint value $f(${end.x}) = ${end.y}$ is ${askMax ? "larger" : "smaller"}.`
                : `That is the endpoint value $f(${end.x})$; the local ${en} $${inner.y}$ is ${askMax ? "larger" : "smaller"}.`,
              endWins
                ? `这是计算器给出的局部${askMax ? "极大值" : "极小值"}，只是 $(0, 8)$ 内部的极值；端点值 $f(${end.x}) = ${end.y}$ 更${askMax ? "大" : "小"}。`
                : `这是端点值 $f(${end.x})$；局部${askMax ? "极大值" : "极小值"} $${inner.y}$ 更${askMax ? "大" : "小"}。`,
            ),
            slip(
              win.x,
              `That is where the absolute ${en} occurs, the $x$-coordinate; the question asks for the value $f(${win.x})$.`,
              `这是取得绝对${zh}的位置，即横坐标；题目问的是值 $f(${win.x})$。`,
            ),
            slip(
              lose.x,
              `That is the $x$-coordinate of the other candidate; the question asks for a value of $f$, and that candidate is not the ${en} anyway.`,
              `这是另一个候选点的横坐标；题目问的是 $f$ 的值，何况那个候选点也不是${zh}。`,
            ),
          ],
        );
      },
    },
    {
      id: "finding-extrema-via-zeros-of-the-derivative",
      figure: calculusDrawings5["finding-extrema-of-functions-using-a-graphing-calculator#finding-extrema-via-zeros-of-the-derivative"],
      title: t("Finding Extrema by Graphing the Derivative", "通过绘制导函数图像求极值"),
      explanation: t(
        "On AP Calculus calculator-active problems, you are often given the derivative $f'(x)$ directly rather than $f(x)$. To find where $f$ has a local maximum or minimum, graph $Y_1 = f'(x)$ and use the `zero` command to find where $f'(x)$ changes sign (positive to negative for a local maximum; negative to positive for a local minimum; no sign change means neither). For $f'(x) = x^2 - 4$, the zero $x = 2$ has $f'(1) = -3 < 0$ and $f'(3) = 5 > 0$, so $f$ has a local minimum at $x = 2$.\n\nCheck: $f(x) = \\frac{x^3}{3} - 4x$ has this derivative, and $f(1) = -\\frac{11}{3}$, $f(2) = -\\frac{16}{3}$ and $f(3) = -3$, lowest in the middle.\n\n> **Watch out.** A zero where $f'$ does not change sign, such as $x = 0$ for $f'(x) = x^2$, is neither a maximum nor a minimum.",
        "在 AP 微积分允许使用计算器的题目中，题目往往直接给出导函数 $f'(x)$ 而非原函数 $f(x)$。要求 $f$ 取得局部极大值或极小值的位置，应绘制 $Y_1 = f'(x)$ 的图像并使用求零点（`zero`）功能，找出 $f'(x)$ 变号的点（由正变负为局部极大值点，由负变正为局部极小值点，不变号则不是极值点）。对 $f'(x) = x^2 - 4$，零点 $x = 2$ 两侧 $f'(1) = -3 < 0$，$f'(3) = 5 > 0$，所以 $f$ 在 $x = 2$ 处取得局部极小值。\n\n检验：$f(x) = \\frac{x^3}{3} - 4x$ 的导数正是它，而 $f(1) = -\\frac{11}{3}$，$f(2) = -\\frac{16}{3}$，$f(3) = -3$，中间最低。\n\n> **注意。** $f'$ 不变号的零点，例如 $f'(x) = x^2$ 的 $x = 0$，既不是极大值点也不是极小值点。",
      ),
      generate: (rng: Rng) => {
        const r1 = rng.int(1, 3);
        const r2 = r1 + rng.int(2, 3);
        const r3 = r2 + rng.int(2, 4);
        const askMax = rng.bool();
        const ans = askMax ? r2 : r3;
        return worked(
          t(
            `You graph $Y_1 = f'(x)$ on a calculator and find that $f'(x)$ has three zeros at $x = ${r1}$, $x = ${r2}$, and $x = ${r3}$, with the following signs on the subintervals:\n\n- $f'(x) > 0$ on $(0, ${r1})$ and $(${r1}, ${r2})$\n- $f'(x) < 0$ on $(${r2}, ${r3})$\n- $f'(x) > 0$ on $(${r3}, 12)$\n\nAt what value of $x$ does $f$ attain a local ${askMax ? "maximum" : "minimum"}?`,
            `在计算器上绘制 $Y_1 = f'(x)$，发现 $f'(x)$ 在 $x = ${r1}$、$x = ${r2}$ 和 $x = ${r3}$ 处有三个零点，且在各子区间上的符号如下：\n\n- 在 $(0, ${r1})$ 与 $(${r1}, ${r2})$ 上 $f'(x) > 0$\n- 在 $(${r2}, ${r3})$ 上 $f'(x) < 0$\n- 在 $(${r3}, 12)$ 上 $f'(x) > 0$\n\n原函数 $f$ 在 $x$ 取何值时取得局部${askMax ? "极大值" : "极小值"}？`,
          ),
          Q.of(ans),
          [
            step(
              "Read the sign changes",
              "看变号",
              t("Compare the sign of $f'$ on the two sides of each zero:", "比较 $f'$ 在每个零点两侧的符号："),
              `x = ${r1}: + \\to +, \\quad x = ${r2}: + \\to -, \\quad x = ${r3}: - \\to +`,
            ),
            step(
              "Classify",
              "判断",
              askMax
                ? t(
                    `$f'$ changes from positive to negative only at $x = ${r2}$, so $f$ has a local maximum there.`,
                    `$f'$ 只在 $x = ${r2}$ 处由正变负，所以 $f$ 在那里取得局部极大值。`,
                  )
                : t(
                    `$f'$ changes from negative to positive only at $x = ${r3}$, so $f$ has a local minimum there.`,
                    `$f'$ 只在 $x = ${r3}$ 处由负变正，所以 $f$ 在那里取得局部极小值。`,
                  ),
            ),
          ],
          t(
            `Follow $f$ itself: it rises on $(0, ${r2})$, falls on $(${r2}, ${r3})$ and rises again on $(${r3}, 12)$. So it turns from rising to falling at $x = ${r2}$ and from falling to rising at $x = ${r3}$; the local ${askMax ? "maximum" : "minimum"} is at $x = ${ans}$.`,
            `跟踪 $f$ 本身：它在 $(0, ${r2})$ 上上升，在 $(${r2}, ${r3})$ 上下降，在 $(${r3}, 12)$ 上又上升。所以它在 $x = ${r2}$ 处由升转降，在 $x = ${r3}$ 处由降转升；局部${askMax ? "极大值" : "极小值"}在 $x = ${ans}$ 处。`,
          ),
          [
            slip(
              r1,
              `At $x = ${r1}$, $f'$ is positive on both sides, so $f$ keeps rising: no extremum there.`,
              `在 $x = ${r1}$ 两侧 $f'$ 都为正，$f$ 一直上升：那里没有极值。`,
            ),
            askMax
              ? slip(
                  r3,
                  `At $x = ${r3}$, $f'$ changes from negative to positive: that is a local minimum.`,
                  `在 $x = ${r3}$ 处 $f'$ 由负变正：那是局部极小值点。`,
                )
              : slip(
                  r2,
                  `At $x = ${r2}$, $f'$ changes from positive to negative: that is a local maximum.`,
                  `在 $x = ${r2}$ 处 $f'$ 由正变负：那是局部极大值点。`,
                ),
          ],
        );
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
  intro: t(
    "`nDeriv` estimates $f'(a)$ by the symmetric difference quotient $\\frac{f(a + h) - f(a - h)}{2h}$. For $f(x) = x^3$ at $a = 2$ with $h = 0.1$:\n\n$$\\frac{2.1^3 - 1.9^3}{0.2} = \\frac{9.261 - 6.859}{0.2} = 12.01,$$\n\nclose to the exact $f'(2) = 12$.\n\nCheck: for $kx^3$ the quotient is $3ka^2 + kh^2$, here $12 + 0.01 = 12.01$.\n\nIn this lesson we compute symmetric difference quotients from tables, and see why `nDeriv` can return a number at a corner where the derivative does not exist.",
    "`nDeriv` 用对称差商 $\\frac{f(a + h) - f(a - h)}{2h}$ 估计 $f'(a)$。对 $f(x) = x^3$，取 $a = 2$，$h = 0.1$：\n\n$$\\frac{2.1^3 - 1.9^3}{0.2} = \\frac{9.261 - 6.859}{0.2} = 12.01$$\n\n与精确值 $f'(2) = 12$ 很接近。\n\n检验：对 $kx^3$，对称差商是 $3ka^2 + kh^2$，这里为 $12 + 0.01 = 12.01$。\n\n本课我们由数值表计算对称差商，并了解为什么在导数不存在的尖角处 `nDeriv` 仍可能返回一个数。",
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
        "Graphing calculators compute numerical derivatives (`nDeriv`) using the symmetric difference quotient $\\frac{f(a + h) - f(a - h)}{2h}$ with step size $h$. While this is exact for quadratic functions, for a cubic $f(x) = kx^3$ it gives $\\frac{k(a+h)^3 - k(a-h)^3}{2h} = 3ka^2 + kh^2$, which differs from the exact derivative $3ka^2$ by $kh^2$. For $f(x) = 2x^3$ at $a = 1$ with $h = 0.1$: $\\frac{2(1.1)^3 - 2(0.9)^3}{0.2} = \\frac{2.662 - 1.458}{0.2} = 6.02$.\n\nCheck: the formula gives $3 \\cdot 2 \\cdot 1^2 + 2(0.1)^2 = 6 + 0.02 = 6.02$.\n\n> **Watch out.** Divide by the whole width $2h$, not by $h$: the inputs $a - h$ and $a + h$ are $2h$ apart.",
        "图形计算器使用步长为 $h$ 的对称差商 $\\frac{f(a + h) - f(a - h)}{2h}$ 来计算数值导数（`nDeriv`）。对于二次函数该公式精确成立，但对于三次函数 $f(x) = kx^3$，对称差商等于 $\\frac{k(a+h)^3 - k(a-h)^3}{2h} = 3ka^2 + kh^2$，与精确导数 $3ka^2$ 相差 $kh^2$。对 $f(x) = 2x^3$，取 $a = 1$，$h = 0.1$：$\\frac{2(1.1)^3 - 2(0.9)^3}{0.2} = \\frac{2.662 - 1.458}{0.2} = 6.02$。\n\n检验：公式给出 $3 \\cdot 2 \\cdot 1^2 + 2(0.1)^2 = 6 + 0.02 = 6.02$。\n\n> **注意。** 要除以整个宽度 $2h$，而不是 $h$：输入 $a - h$ 与 $a + h$ 相距 $2h$。",
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
        return worked(
          t(
            `A graphing calculator's numerical derivative command approximates $f'(${a})$ using the symmetric difference quotient $\\frac{f(${a} + h) - f(${a} - h)}{2h}$ with step $h = 0.1$. Given the calculator table values $f(${a - 0.1}) = ${yMinus}$, $f(${a}) = ${yCenter}$, and $f(${a + 0.1}) = ${yPlus}$, what value does this symmetric difference quotient produce?`,
            `图形计算器的数值求导功能使用步长为 $h = 0.1$ 的对称差商 $\\frac{f(${a} + h) - f(${a} - h)}{2h}$ 来近似 $f'(${a})$。已知计算器数值表给出 $f(${a - 0.1}) = ${yMinus}$，$f(${a}) = ${yCenter}$，$f(${a + 0.1}) = ${yPlus}$，该对称差商计算出的值是多少？`,
          ),
          Q.of(ans),
          [
            step(
              "Substitute",
              "代入",
              t(
                `Use the two values on either side of the point; $f(${a})$ itself is not needed:`,
                `用该点两侧的两个值；$f(${a})$ 本身用不到：`,
              ),
              `\\frac{f(${a + 0.1}) - f(${a - 0.1})}{2(0.1)} = \\frac{${yPlus} - ${yMinus}}{0.2}`,
            ),
            step("Divide", "相除", none, `\\frac{${yPlus - yMinus}}{0.2} = ${ans}`),
          ],
          t(
            `The symmetric quotient is the average of the forward quotient $\\frac{${yPlus} - ${yCenter}}{0.1} = ${forward}$ and the backward quotient $\\frac{${yCenter} - ${yMinus}}{0.1} = ${backward}$: $\\frac{${forward} + ${backward}}{2} = ${ans}$.`,
            `对称差商是向前差商 $\\frac{${yPlus} - ${yCenter}}{0.1} = ${forward}$ 与向后差商 $\\frac{${yCenter} - ${yMinus}}{0.1} = ${backward}$ 的平均：$\\frac{${forward} + ${backward}}{2} = ${ans}$。`,
          ),
          [
            slip(
              forward,
              `That is the forward quotient $\\frac{f(${a + 0.1}) - f(${a})}{0.1}$, which uses the right side only.`,
              `这是向前差商 $\\frac{f(${a + 0.1}) - f(${a})}{0.1}$，只用了右侧。`,
            ),
            slip(
              backward,
              `That is the backward quotient $\\frac{f(${a}) - f(${a - 0.1})}{0.1}$, which uses the left side only.`,
              `这是向后差商 $\\frac{f(${a}) - f(${a - 0.1})}{0.1}$，只用了左侧。`,
            ),
            slip(
              yPlus - yMinus,
              `That is the change in $f$ only; it still has to be divided by $2h = 0.2$.`,
              `这只是 $f$ 的变化量；还要除以 $2h = 0.2$。`,
            ),
            slip(
              10 * (yPlus - yMinus),
              `This divides by $h = 0.1$ instead of $2h = 0.2$; the two inputs are $0.2$ apart.`,
              `这除以了 $h = 0.1$ 而不是 $2h = 0.2$；两个输入相距 $0.2$。`,
            ),
          ],
        );
      },
    },
    {
      id: "limitations-of-numerical-derivatives-at-corners",
      title: t("Recognizing False Numerical Derivatives at Non-Differentiable Points", "识别不可导点处的伪数值导数"),
      explanation: t(
        "Because `nDeriv` uses the symmetric difference quotient $\\frac{f(a+h) - f(a-h)}{2h}$, it can return a finite number even when $f'(a)$ does not exist! For example, at the corner of $f(x) = k|x - a| + mx$, the left and right slopes are $m - k$ and $m + k$, so the symmetric difference quotient averages them to $m$ even though $f$ is not differentiable at $x = a$. For $f(x) = 3|x - 1| + 2x$ with $h = 0.1$: $f(1.1) = 0.3 + 2.2 = 2.5$ and $f(0.9) = 0.3 + 1.8 = 2.1$, so the quotient is $\\frac{2.5 - 2.1}{0.2} = 2$.\n\nCheck: the one-sided slopes are $2 - 3 = -1$ and $2 + 3 = 5$, whose average is $\\frac{-1 + 5}{2} = 2$.\n\n> **Watch out.** A number from `nDeriv` does not prove that $f'(a)$ exists; at a corner, compare the one-sided slopes.",
        "由于 `nDeriv` 使用对称差商 $\\frac{f(a+h) - f(a-h)}{2h}$，即使 $f'(a)$ 不存在，它仍可能返回一个有限数值！例如在折点函数 $f(x) = k|x - a| + mx$ 的 $x = a$ 处，左、右斜率分别为 $m - k$ 与 $m + k$，尽管 $f$ 在 $x = a$ 处不可导，对称差商仍会返回两者的平均值 $m$。对 $f(x) = 3|x - 1| + 2x$，取 $h = 0.1$：$f(1.1) = 0.3 + 2.2 = 2.5$，$f(0.9) = 0.3 + 1.8 = 2.1$，所以差商为 $\\frac{2.5 - 2.1}{0.2} = 2$。\n\n检验：单侧斜率为 $2 - 3 = -1$ 和 $2 + 3 = 5$，平均值为 $\\frac{-1 + 5}{2} = 2$。\n\n> **注意。** `nDeriv` 给出一个数并不能证明 $f'(a)$ 存在；在尖角处要比较两侧的斜率。",
      ),
      generate: (rng: Rng) => {
        const k = rng.int(2, 8);
        const m = rng.int(1, 7);
        const a = rng.int(1, 6);
        const inside = linear(1, -a);
        const times = (s: string) => (m === 1 ? `(${s})` : `${m}(${s})`);
        return worked(
          t(
            `The function $f(x) = ${k}|${inside}| + ${poly([m, "x"])}$ has a sharp corner at $x = ${a}$, so $f'(${a})$ does not exist. What misleading numerical value does a calculator's symmetric difference quotient $\\frac{f(${a}+h) - f(${a}-h)}{2h}$ report at $x = ${a}$?`,
            `函数 $f(x) = ${k}|${inside}| + ${poly([m, "x"])}$ 在 $x = ${a}$ 处有尖角，故 $f'(${a})$ 不存在。计算器的对称差商 $\\frac{f(${a}+h) - f(${a}-h)}{2h}$ 在 $x = ${a}$ 处会报告什么具有误导性的数值？`,
          ),
          Q.of(m),
          [
            step(
              "Evaluate both sides",
              "计算两侧",
              t(
                `For $h > 0$, $|${inside}|$ equals $h$ at both $x = ${a} + h$ and $x = ${a} - h$:`,
                `当 $h > 0$ 时，$|${inside}|$ 在 $x = ${a} + h$ 与 $x = ${a} - h$ 处都等于 $h$：`,
              ),
              `f(${a} + h) = ${k}h + ${times(`${a} + h`)}`,
              `f(${a} - h) = ${k}h + ${times(`${a} - h`)}`,
            ),
            step(
              "Subtract and divide",
              "相减再除",
              t(`The $${k}h$ terms cancel:`, `$${k}h$ 项相互抵消：`),
              `\\frac{f(${a}+h) - f(${a}-h)}{2h} = \\frac{${2 * m}h}{2h} = ${m}`,
            ),
          ],
          t(
            `The one-sided slopes are $${m} - ${k} = ${m - k}$ on the left and $${m} + ${k} = ${m + k}$ on the right; their average is $\\frac{${m - k} + ${m + k}}{2} = ${m}$, the same number, though the slopes differ.`,
            `左侧斜率为 $${m} - ${k} = ${m - k}$，右侧斜率为 $${m} + ${k} = ${m + k}$；两者平均为 $\\frac{${m - k} + ${m + k}}{2} = ${m}$，结果相同，但两侧斜率并不相等。`,
          ),
          [
            slip(
              k,
              `That is the coefficient of the absolute value, which is half the jump between the two slopes, not their average.`,
              `这是绝对值的系数，它是两侧斜率之差的一半，而不是它们的平均。`,
            ),
            slip(m + k, `That is the slope on the right side only.`, `这只是右侧的斜率。`),
            slip(m - k, `That is the slope on the left side only.`, `这只是左侧的斜率。`),
          ],
        );
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
  intro: t(
    "`fnInt` computes a definite integral numerically, even when the integrand has no elementary antiderivative. With the Fundamental Theorem of Calculus, $f(b) = f(a) + \\int_a^b f'(x)\\,dx$: if $f(0) = 2$ and $f'(x) = \\sin(x^2)$, the calculator gives $\\int_0^2 \\sin(x^2)\\,dx \\approx 0.805$, so $f(2) \\approx 2.805$.\n\nCheck: the same steps with an integrand we can integrate by hand: for $f'(x) = 3x^2$ and $f(0) = 2$, `fnInt` gives $\\int_0^2 3x^2\\,dx = 8$, so $f(2) = 10$; and indeed $f(x) = x^3 + 2$ has $f(2) = 10$.\n\nIn this lesson we find values of $f$ from an initial value and calculator integrals, compute total distance with `abs(`, and use symmetry to check an integral.",
    "`fnInt` 用数值方法计算定积分，即使被积函数没有初等原函数也可以。结合微积分基本定理 $f(b) = f(a) + \\int_a^b f'(x)\\,dx$：若 $f(0) = 2$，$f'(x) = \\sin(x^2)$，计算器给出 $\\int_0^2 \\sin(x^2)\\,dx \\approx 0.805$，所以 $f(2) \\approx 2.805$。\n\n检验：对能手算积分的被积函数做同样的步骤：$f'(x) = 3x^2$，$f(0) = 2$，`fnInt` 给出 $\\int_0^2 3x^2\\,dx = 8$，所以 $f(2) = 10$；而 $f(x) = x^3 + 2$ 确实有 $f(2) = 10$。\n\n本课我们由初始值和计算器积分求 $f$ 的值，用 `abs(` 计算总路程，并用对称性检验积分。",
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
        "The calculator's numerical integration command (`fnInt`) approximates $\\int_a^b f'(x)\\,dx$ even when $f'(x)$ has no elementary antiderivative (such as $f'(x) = \\sin(x^2)$). Combined with the Fundamental Theorem of Calculus, $f(b) = f(a) + \\int_a^b f'(x)\\,dx$, this determines $f(b)$ from an initial value and a calculator integral. For $f'(x) = 2x$ and $f(1) = 5$, `fnInt` gives $\\int_1^3 2x\\,dx = 8$, so $f(3) = 5 + 8 = 13$.\n\nCheck: $f(x) = x^2 + 4$ has $f'(x) = 2x$ and $f(1) = 5$, and $f(3) = 9 + 4 = 13$.\n\n> **Watch out.** Add the initial value: $\\int_a^b f'(x)\\,dx$ alone is the change $f(b) - f(a)$, not $f(b)$.",
        "即使 $f'(x)$ 没有初等原函数（如 $f'(x) = \\sin(x^2)$），计算器的数值积分命令（`fnInt`）仍能高精度计算 $\\int_a^b f'(x)\\,dx$。结合微积分基本定理 $f(b) = f(a) + \\int_a^b f'(x)\\,dx$，可由初始值与计算器定积分求出 $f(b)$。对 $f'(x) = 2x$，$f(1) = 5$，`fnInt` 给出 $\\int_1^3 2x\\,dx = 8$，所以 $f(3) = 5 + 8 = 13$。\n\n检验：$f(x) = x^2 + 4$ 满足 $f'(x) = 2x$，$f(1) = 5$，且 $f(3) = 9 + 4 = 13$。\n\n> **注意。** 要加上初始值：$\\int_a^b f'(x)\\,dx$ 本身只是变化量 $f(b) - f(a)$，不是 $f(b)$。",
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
        return worked(
          t(
            `A function $f$ satisfies $f(${a}) = ${y0}$ and has derivative $f'(x)$ with critical points at $x = ${b}$ and $x = ${c}$. Using a graphing calculator's \`fnInt\` command, you find $\\int_{${a}}^{${b}} f'(x)\\,dx = ${i1}$ and $\\int_{${b}}^{${c}} f'(x)\\,dx = ${i2}$. What is the value of $f(${c})$?`,
            `函数 $f$ 满足 $f(${a}) = ${y0}$，其导函数 $f'(x)$ 的驻点为 $x = ${b}$ 与 $x = ${c}$。使用图形计算器的 \`fnInt\` 命令求得 $\\int_{${a}}^{${b}} f'(x)\\,dx = ${i1}$ 且 $\\int_{${b}}^{${c}} f'(x)\\,dx = ${i2}$。求 $f(${c})$ 的值。`,
          ),
          Q.of(fc),
          [
            step(
              "Apply the Fundamental Theorem",
              "用微积分基本定理",
              t("The value at the end is the starting value plus the accumulated change:", "终点的值等于起点的值加上累积的变化量："),
              `f(${c}) = f(${a}) + \\int_{${a}}^{${b}} f'(x)\\,dx + \\int_{${b}}^{${c}} f'(x)\\,dx`,
            ),
            step("Add", "相加", none, `f(${c}) = ${y0} + ${i1} + (${i2}) = ${fc}`),
          ],
          t(
            `Go one interval at a time: $f(${b}) = ${y0} + ${i1} = ${fb}$, then $f(${c}) = ${fb} + (${i2}) = ${fc}$.`,
            `一段一段地算：$f(${b}) = ${y0} + ${i1} = ${fb}$，再 $f(${c}) = ${fb} + (${i2}) = ${fc}$。`,
          ),
          [
            slip(
              fb,
              `That is $f(${b})$: it stops after the first integral and leaves out the change on $[${b}, ${c}]$.`,
              `这是 $f(${b})$：只加了第一个积分，漏掉了 $[${b}, ${c}]$ 上的变化。`,
            ),
            slip(
              y0 + i1 - i2,
              `This subtracts the second integral; it is already negative, $${i2}$, so it is added as it is.`,
              `这减去了第二个积分；它本身已是负数 $${i2}$，应直接加上。`,
            ),
            slip(
              i1 + i2,
              `That is the net change $f(${c}) - f(${a})$; the initial value $f(${a}) = ${y0}$ still has to be added.`,
              `这是净变化量 $f(${c}) - f(${a})$；还要加上初始值 $f(${a}) = ${y0}$。`,
            ),
          ],
        );
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
        "On a graphing calculator, entering $\\int_a^b |v(t)|\\,dt$ using `abs(` computes total distance traveled without splitting the integral at zeros of $v(t)$. Comparing the signed displacement integral $\\int_a^b v(t)\\,dt$ with the total distance integral $\\int_a^b |v(t)|\\,dt$ reveals how far the particle moved in each direction. For example, if $\\int_0^2 v(t)\\,dt = -3$ and $\\int_2^5 v(t)\\,dt = 7$ with $v$ changing sign only at $t = 2$, the displacement on $[0, 5]$ is $4$ and `fnInt(abs(v))` returns the distance $3 + 7 = 10$.\n\nCheck: the distance exceeds the displacement by twice the backward motion: $4 + 2 \\cdot 3 = 10$.\n\n> **Watch out.** $\\int_a^b |v(t)|\\,dt$ is not $\\left|\\int_a^b v(t)\\,dt\\right|$: in the second, the backward motion cancels part of the forward motion.",
        "在图形计算器中使用 `abs(` 直接输入 $\\int_a^b |v(t)|\\,dt$，即可在不分段的情况下求出总路程。比较有向位移积分 $\\int_a^b v(t)\\,dt$ 与总路程积分 $\\int_a^b |v(t)|\\,dt$，还能算出质点沿正、负方向各自移动的距离。例如若 $\\int_0^2 v(t)\\,dt = -3$，$\\int_2^5 v(t)\\,dt = 7$，且 $v$ 只在 $t = 2$ 处变号，则 $[0, 5]$ 上的位移是 $4$，而 `fnInt(abs(v))` 返回路程 $3 + 7 = 10$。\n\n检验：路程比位移多出两倍的反向运动：$4 + 2 \\cdot 3 = 10$。\n\n> **注意。** $\\int_a^b |v(t)|\\,dt$ 不是 $\\left|\\int_a^b v(t)\\,dt\\right|$：后者中反向运动会抵消一部分正向运动。",
      ),
      generate: (rng: Rng) => {
        const backwardDist = rng.int(6, 22);
        const forwardDist = rng.int(10, 30);
        const t1 = rng.int(2, 4);
        const t2 = t1 + rng.int(2, 5);
        const net = forwardDist - backwardDist;
        const total = forwardDist + backwardDist;
        if (rng.bool())
          return worked(
            t(
              `A particle moves along a line so that $v(t) \\le 0$ on $[0, ${t1}]$ and $v(t) \\ge 0$ on $[${t1}, ${t2}]$. A calculator gives $\\int_0^{${t1}} v(t)\\,dt = -${backwardDist}$ and $\\int_{${t1}}^{${t2}} v(t)\\,dt = ${forwardDist}$. What value does the calculator return for the single absolute-value integral $\\int_0^{${t2}} |v(t)|\\,dt$?`,
              `质点沿直线运动，在 $[0, ${t1}]$ 上 $v(t) \\le 0$，在 $[${t1}, ${t2}]$ 上 $v(t) \\ge 0$。计算器给出 $\\int_0^{${t1}} v(t)\\,dt = -${backwardDist}$ 且 $\\int_{${t1}}^{${t2}} v(t)\\,dt = ${forwardDist}$。计算器对单个绝对值积分 $\\int_0^{${t2}} |v(t)|\\,dt$ 返回的值是多少？`,
            ),
            Q.of(total),
            [
              step(
                "Take the sizes",
                "取大小",
                t(
                  `On $[0, ${t1}]$, $|v| = -v$, so that piece contributes $${backwardDist}$; on $[${t1}, ${t2}]$, $|v| = v$:`,
                  `在 $[0, ${t1}]$ 上 $|v| = -v$，这一段贡献 $${backwardDist}$；在 $[${t1}, ${t2}]$ 上 $|v| = v$：`,
                ),
                `\\int_0^{${t1}} |v(t)|\\,dt = ${backwardDist}, \\quad \\int_{${t1}}^{${t2}} |v(t)|\\,dt = ${forwardDist}`,
              ),
              step("Add", "相加", none, `\\int_0^{${t2}} |v(t)|\\,dt = ${backwardDist} + ${forwardDist} = ${total}`),
            ],
            t(
              `The displacement is $-${backwardDist} + ${forwardDist} = ${net}$, and the distance exceeds it by twice the backward motion: $${net} + 2 \\cdot ${backwardDist} = ${total}$.`,
              `位移是 $-${backwardDist} + ${forwardDist} = ${net}$，路程比它多出两倍的反向运动：$${net} + 2 \\cdot ${backwardDist} = ${total}$。`,
            ),
            [
              slip(
                net,
                `That is the displacement $\\int_0^{${t2}} v(t)\\,dt$, in which the backward motion cancels part of the forward motion.`,
                `这是位移 $\\int_0^{${t2}} v(t)\\,dt$，其中反向运动抵消了一部分正向运动。`,
              ),
              slip(forwardDist, `That counts only the forward motion on $[${t1}, ${t2}]$.`, `这只算了 $[${t1}, ${t2}]$ 上的正向运动。`),
              slip(backwardDist, `That counts only the backward motion on $[0, ${t1}]$.`, `这只算了 $[0, ${t1}]$ 上的反向运动。`),
            ],
          );
        return worked(
          t(
            `For a particle moving on $0 \\le t \\le ${t2}$, a graphing calculator gives the net displacement $\\int_0^{${t2}} v(t)\\,dt = ${net}$ and the total distance $\\int_0^{${t2}} |v(t)|\\,dt = ${total}$. What is the total distance the particle traveled in the negative direction (where $v(t) < 0$)?`,
            `对于在 $0 \\le t \\le ${t2}$ 上运动的质点，图形计算器给出净位移 $\\int_0^{${t2}} v(t)\\,dt = ${net}$ 以及总路程 $\\int_0^{${t2}} |v(t)|\\,dt = ${total}$。求质点向负方向（即 $v(t) < 0$ 时）运动的总距离。`,
          ),
          Q.of(backwardDist),
          [
            step(
              "Set up two equations",
              "列两个方程",
              t(
                "Let $D_+$ and $D_-$ be the distances traveled in the positive and negative directions. The distance adds them; the displacement subtracts them:",
                "设质点向正、负方向运动的距离分别为 $D_+$ 与 $D_-$。路程是两者之和，位移是两者之差：",
              ),
              `D_+ + D_- = ${total}, \\quad D_+ - D_- = ${net}`,
            ),
            step(
              "Subtract",
              "相减",
              t("Subtracting the second equation from the first removes $D_+$:", "第一个方程减去第二个，消去 $D_+$："),
              `2D_- = ${total} - ${par(net)} = ${total - net}, \\quad D_- = ${backwardDist}`,
            ),
          ],
          t(
            `Substitute back: $D_+ = ${total} - ${backwardDist} = ${forwardDist}$, and $D_+ - D_- = ${forwardDist} - ${backwardDist} = ${net}$, the given displacement.`,
            `代回检验：$D_+ = ${total} - ${backwardDist} = ${forwardDist}$，而 $D_+ - D_- = ${forwardDist} - ${backwardDist} = ${net}$，正是所给的位移。`,
          ),
          [
            slip(forwardDist, `That is $D_+$, the distance in the positive direction.`, `这是 $D_+$，即向正方向运动的距离。`),
            slip(total, `That is the total distance in both directions.`, `这是两个方向的总路程。`),
            slip(
              Math.abs(net),
              `That is the size of the displacement, $|D_+ - D_-|$, not the backward distance.`,
              `这是位移的大小 $|D_+ - D_-|$，不是反向运动的距离。`,
            ),
          ],
        );
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
  intro: t(
    "A calculator needs finite limits of integration, so to estimate $\\int_1^{\\infty} \\frac{1}{x^2}\\,dx$ it computes $I(B) = \\int_1^{B} \\frac{1}{x^2}\\,dx = 1 - \\frac{1}{B}$ for growing $B$: $0.9$ at $B = 10$, $0.99$ at $B = 100$ and $0.999$ at $B = 1000$, approaching $1$.\n\nCheck: the exact value is $\\lim_{B \\to \\infty}\\left(1 - \\frac{1}{B}\\right) = 1$, and the gap at $B = 1000$ is the tail $\\int_{1000}^{\\infty} \\frac{1}{x^2}\\,dx = \\frac{1}{1000} = 0.001$.\n\nIn this lesson we approximate improper integrals on a calculator by cutting off an infinite bound or a vertical asymptote, and find the error that the cutoff leaves.",
    "计算器需要有限的积分限，所以要估计 $\\int_1^{\\infty} \\frac{1}{x^2}\\,dx$，就对越来越大的 $B$ 计算 $I(B) = \\int_1^{B} \\frac{1}{x^2}\\,dx = 1 - \\frac{1}{B}$：$B = 10$ 时为 $0.9$，$B = 100$ 时为 $0.99$，$B = 1000$ 时为 $0.999$，逐渐趋近 $1$。\n\n检验：精确值是 $\\lim_{B \\to \\infty}\\left(1 - \\frac{1}{B}\\right) = 1$，$B = 1000$ 时的差距正是尾积分 $\\int_{1000}^{\\infty} \\frac{1}{x^2}\\,dx = \\frac{1}{1000} = 0.001$。\n\n本课我们在计算器上截断无穷积分限或垂直渐近线来近似反常积分，并求出截断留下的误差。",
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
        "Standard graphing calculators require finite limits of integration in `fnInt`. To investigate $\\int_a^{\\infty} f(x)\\,dx$ numerically, evaluate $I(B) = \\int_a^B f(x)\\,dx$ for successively larger values of $B$ (such as $B = 10, 100, 1000$). The truncation error committed by stopping at $x = B$ is the tail integral $\\int_B^{\\infty} f(x)\\,dx$. For $\\int_1^{\\infty} \\frac{2}{x^2}\\,dx = 2$, $I(10) = 2 - \\frac{2}{10} = 1.8$, and the tail $\\int_{10}^{\\infty} \\frac{2}{x^2}\\,dx = 0.2$.\n\nCheck: $I(10)$ plus the tail is $1.8 + 0.2 = 2$, the whole integral.\n\n> **Watch out.** Values of $I(B)$ that seem to settle down suggest convergence but cannot prove it: $\\int_1^{B} \\frac{1}{x}\\,dx = \\ln B$ grows without bound, yet only from about $6.9$ to $9.2$ as $B$ goes from $1000$ to $10000$.",
        "标准图形计算器的数值积分功能（`fnInt`）要求积分上下限为有限数。要数值研究反常积分 $\\int_a^{\\infty} f(x)\\,dx$，可依次取越来越大的上限 $B$（如 $B = 10, 100, 1000$）计算 $I(B) = \\int_a^B f(x)\\,dx$。在 $x = B$ 处截断所产生的截断误差即为尾积分 $\\int_B^{\\infty} f(x)\\,dx$。对 $\\int_1^{\\infty} \\frac{2}{x^2}\\,dx = 2$，$I(10) = 2 - \\frac{2}{10} = 1.8$，尾积分 $\\int_{10}^{\\infty} \\frac{2}{x^2}\\,dx = 0.2$。\n\n检验：$I(10)$ 加上尾积分是 $1.8 + 0.2 = 2$，正是整个积分。\n\n> **注意。** $I(B)$ 的值看起来趋于稳定，只能提示收敛，不能证明收敛：$\\int_1^{B} \\frac{1}{x}\\,dx = \\ln B$ 无界增长，但 $B$ 从 $1000$ 增到 $10000$ 时它只从约 $6.9$ 增到 $9.2$。",
      ),
      generate: (rng: Rng) => {
        const k = rng.int(2, 9);
        const a = rng.int(1, 4);
        const B = rng.pick([10, 20, 50, 100] as const);
        const exactLim = Q.of(k, a);
        const truncVal = Q.of(k * (B - a), a * B);
        const tailErr = Q.of(k, B);
        const anti = t(
          `An antiderivative of $\\frac{${k}}{x^2}$ is $-\\frac{${k}}{x}$:`,
          `$\\frac{${k}}{x^2}$ 的一个原函数是 $-\\frac{${k}}{x}$：`,
        );
        if (rng.bool())
          return worked(
            t(
              `To approximate the improper integral $\\int_{${a}}^{\\infty} \\frac{${k}}{x^2}\\,dx$ on a graphing calculator, you enter the finite integral $I(${B}) = \\int_{${a}}^{${B}} \\frac{${k}}{x^2}\\,dx$. What exact value does $I(${B})$ equal?`,
              `为在图形计算器上近似反常积分 $\\int_{${a}}^{\\infty} \\frac{${k}}{x^2}\\,dx$，输入有限定积分 $I(${B}) = \\int_{${a}}^{${B}} \\frac{${k}}{x^2}\\,dx$。$I(${B})$ 的精确值是多少？`,
            ),
            truncVal,
            [
              step("Find an antiderivative", "求原函数", anti, `\\int \\frac{${k}}{x^2}\\,dx = -\\frac{${k}}{x} + C`),
              step(
                "Evaluate",
                "代入上下限",
                none,
                `I(${B}) = -\\frac{${k}}{${B}} - \\left(-\\frac{${k}}{${a}}\\right) = ${exactLim.toLatex()} - ${tailErr.toLatex()} = ${truncVal.toLatex()}`,
              ),
            ],
            t(
              `Start from the whole integral, $\\int_{${a}}^{\\infty} \\frac{${k}}{x^2}\\,dx = ${exactLim.toLatex()}$, and remove the tail beyond $${B}$, which is $${tailErr.toLatex()}$: $${exactLim.toLatex()} - ${tailErr.toLatex()} = ${truncVal.toLatex()}$.`,
              `从整个积分 $\\int_{${a}}^{\\infty} \\frac{${k}}{x^2}\\,dx = ${exactLim.toLatex()}$ 出发，去掉 $${B}$ 之后的尾部 $${tailErr.toLatex()}$：$${exactLim.toLatex()} - ${tailErr.toLatex()} = ${truncVal.toLatex()}$。`,
            ),
            [
              slip(
                exactLim,
                `That is the whole improper integral; cutting off at $${B}$ leaves out the tail $${tailErr.toLatex()}$.`,
                `这是整个反常积分；在 $${B}$ 处截断会漏掉尾部 $${tailErr.toLatex()}$。`,
              ),
              slip(
                tailErr,
                `That is the tail beyond $${B}$, the part the cutoff leaves out.`,
                `这是 $${B}$ 之后的尾部，正是截断漏掉的部分。`,
              ),
              slip(
                exactLim.add(tailErr),
                `This adds $${tailErr.toLatex()}$; the antiderivative is $-\\frac{${k}}{x}$, so its value at the upper limit is negative.`,
                `这加上了 $${tailErr.toLatex()}$；原函数是 $-\\frac{${k}}{x}$，它在上限处的值是负的。`,
              ),
            ],
          );
        return worked(
          t(
            `When approximating $\\int_{${a}}^{\\infty} \\frac{${k}}{x^2}\\,dx$ on a calculator by truncating the upper bound at $B = ${B}$, what is the exact truncation error $\\int_{${B}}^{\\infty} \\frac{${k}}{x^2}\\,dx$?`,
            `在计算器上将上限截断为 $B = ${B}$ 来近似反常积分 $\\int_{${a}}^{\\infty} \\frac{${k}}{x^2}\\,dx$ 时，精确截断误差 $\\int_{${B}}^{\\infty} \\frac{${k}}{x^2}\\,dx$ 是多少？`,
          ),
          tailErr,
          [
            step("Find an antiderivative", "求原函数", anti, `\\int \\frac{${k}}{x^2}\\,dx = -\\frac{${k}}{x} + C`),
            step(
              "Take the limit",
              "取极限",
              t(`As the upper limit grows, $-\\frac{${k}}{b} \\to 0$:`, `上限增大时 $-\\frac{${k}}{b} \\to 0$：`),
              `\\int_{${B}}^{\\infty} \\frac{${k}}{x^2}\\,dx = \\lim_{b \\to \\infty}\\left(-\\frac{${k}}{b}\\right) - \\left(-\\frac{${k}}{${B}}\\right) = 0 + \\frac{${k}}{${B}} = ${tailErr.toLatex()}`,
            ),
          ],
          t(
            `The error is the whole integral minus what the calculator computes: $\\int_{${a}}^{\\infty} = ${exactLim.toLatex()}$ and $I(${B}) = ${truncVal.toLatex()}$, so the error is $${exactLim.toLatex()} - ${truncVal.toLatex()} = ${tailErr.toLatex()}$.`,
            `误差等于整个积分减去计算器算出的部分：$\\int_{${a}}^{\\infty} = ${exactLim.toLatex()}$，$I(${B}) = ${truncVal.toLatex()}$，所以误差是 $${exactLim.toLatex()} - ${truncVal.toLatex()} = ${tailErr.toLatex()}$。`,
          ),
          [
            slip(
              exactLim,
              `That is the whole improper integral, not the part beyond $${B}$.`,
              `这是整个反常积分，不是 $${B}$ 之后的部分。`,
            ),
            slip(
              truncVal,
              `That is $I(${B})$, the part the calculator computes; the error is what is left over.`,
              `这是 $I(${B})$，即计算器算出的部分；误差是剩下的部分。`,
            ),
            slip(
              tailErr.neg(),
              `This keeps the sign of the antiderivative at $${B}$; subtracting $-\\frac{${k}}{${B}}$ makes the tail positive, as the integrand is positive.`,
              `这保留了原函数在 $${B}$ 处的负号；减去 $-\\frac{${k}}{${B}}$ 后尾部为正，因为被积函数为正。`,
            ),
          ],
        );
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
        "For an improper integral $\\int_a^b f(x)\\,dx$ with a vertical asymptote at $x = a$, replace the lower bound with $a + \\varepsilon$ for a small positive number $\\varepsilon$ (such as $0.01$ or $0.0001$) and evaluate $J(\\varepsilon) = \\int_{a+\\varepsilon}^b f(x)\\,dx$ on the calculator. For $\\int_0^4 \\frac{1}{\\sqrt{x}}\\,dx = 4$, the antiderivative $2\\sqrt{x}$ gives $J(0.01) = 2\\sqrt{4} - 2\\sqrt{0.01} = 4 - 0.2 = 3.8$.\n\nCheck: the omitted piece $\\int_0^{0.01} \\frac{1}{\\sqrt{x}}\\,dx = 2\\sqrt{0.01} = 0.2$, and $3.8 + 0.2 = 4$.\n\n> **Watch out.** The omitted piece shrinks like $\\sqrt{\\varepsilon}$, not like $\\varepsilon$: with $\\varepsilon = 0.01$ it is $0.2$, twenty times $\\varepsilon$.",
        "对于在 $x = a$ 处有垂直渐近线的反常积分 $\\int_a^b f(x)\\,dx$，可将下限替换为 $a + \\varepsilon$（其中 $\\varepsilon$ 为很小的正数，如 $0.01$ 或 $0.0001$），并在计算器上计算 $J(\\varepsilon) = \\int_{a+\\varepsilon}^b f(x)\\,dx$。对 $\\int_0^4 \\frac{1}{\\sqrt{x}}\\,dx = 4$，由原函数 $2\\sqrt{x}$ 得 $J(0.01) = 2\\sqrt{4} - 2\\sqrt{0.01} = 4 - 0.2 = 3.8$。\n\n检验：略去的部分 $\\int_0^{0.01} \\frac{1}{\\sqrt{x}}\\,dx = 2\\sqrt{0.01} = 0.2$，而 $3.8 + 0.2 = 4$。\n\n> **注意。** 略去的部分像 $\\sqrt{\\varepsilon}$ 那样缩小，而不是像 $\\varepsilon$：$\\varepsilon = 0.01$ 时它是 $0.2$，是 $\\varepsilon$ 的二十倍。",
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
        const lower = a + (n === 10 ? 0.01 : 0.0001);
        const integrand = `\\frac{${k}}{\\sqrt{${inside}}}`;
        const anti = step(
          "Find an antiderivative",
          "求原函数",
          t(
            `Since $\\frac{d}{dx}\\sqrt{${inside}} = \\frac{1}{2\\sqrt{${inside}}}$:`,
            `由于 $\\frac{d}{dx}\\sqrt{${inside}} = \\frac{1}{2\\sqrt{${inside}}}$：`,
          ),
          `\\int ${integrand}\\,dx = ${2 * k}\\sqrt{${inside}} + C`,
        );
        const noTwo = slip(
          Q.of(k * m).sub(Q.of(k, n)),
          `This uses $${k === 1 ? "" : k}\\sqrt{${inside}}$ as the antiderivative, which is missing the factor $2$.`,
          `这把 $${k === 1 ? "" : k}\\sqrt{${inside}}$ 当作原函数，少了因子 $2$。`,
        );
        if (rng.bool())
          return worked(
            t(
              `To approximate $\\int_{${a}}^{${b}} ${integrand}\\,dx$ on a calculator, you offset the vertical asymptote at $x = ${a}$ by $\\varepsilon = ${epsTex}$ and compute $J(${epsTex}) = \\int_{${lower}}^{${b}} ${integrand}\\,dx$. What exact value does $J(${epsTex})$ equal?`,
              `为在计算器上近似反常积分 $\\int_{${a}}^{${b}} ${integrand}\\,dx$，将 $x = ${a}$ 处的垂直渐近线偏移 $\\varepsilon = ${epsTex}$，计算 $J(${epsTex}) = \\int_{${lower}}^{${b}} ${integrand}\\,dx$。$J(${epsTex})$ 的精确值是多少？`,
            ),
            jVal,
            [
              anti,
              step(
                "Evaluate",
                "代入上下限",
                t(
                  `At the upper limit $\\sqrt{${b} - ${a}} = ${m}$, and at the lower limit $\\sqrt{${epsTex}} = \\frac{1}{${n}}$:`,
                  `在上限处 $\\sqrt{${b} - ${a}} = ${m}$，在下限处 $\\sqrt{${epsTex}} = \\frac{1}{${n}}$：`,
                ),
                `J(${epsTex}) = ${2 * k}(${m}) - ${2 * k} \\cdot \\frac{1}{${n}} = ${2 * k * m} - ${err.toLatex()} = ${jVal.toLatex()}`,
              ),
            ],
            t(
              `The whole improper integral is $${2 * k}\\sqrt{${m * m}} - ${2 * k}\\sqrt{0} = ${2 * k * m}$, and the omitted piece on $[${a}, ${lower}]$ is $${2 * k}\\sqrt{${epsTex}} = ${err.toLatex()}$; their difference $${2 * k * m} - ${err.toLatex()} = ${jVal.toLatex()}$ matches.`,
              `整个反常积分是 $${2 * k}\\sqrt{${m * m}} - ${2 * k}\\sqrt{0} = ${2 * k * m}$，在 $[${a}, ${lower}]$ 上略去的部分是 $${2 * k}\\sqrt{${epsTex}} = ${err.toLatex()}$；两者之差 $${2 * k * m} - ${err.toLatex()} = ${jVal.toLatex()}$，结果一致。`,
            ),
            [
              slip(
                fullLim,
                `That is the whole improper integral; the cutoff leaves out the piece on $[${a}, ${lower}]$.`,
                `这是整个反常积分；截断漏掉了 $[${a}, ${lower}]$ 上的部分。`,
              ),
              slip(
                err,
                `That is the omitted piece near the asymptote, not $J(${epsTex})$.`,
                `这是渐近线附近被略去的部分，不是 $J(${epsTex})$。`,
              ),
              noTwo,
              slip(
                fullLim.sub(Q.of(2 * k, n * n)),
                `This puts $\\varepsilon = ${epsTex}$ into the antiderivative without the square root; at the lower limit it is $\\sqrt{${epsTex}} = \\frac{1}{${n}}$.`,
                `这把 $\\varepsilon = ${epsTex}$ 代入原函数时漏了开方；下限处应是 $\\sqrt{${epsTex}} = \\frac{1}{${n}}$。`,
              ),
            ],
          );
        return worked(
          t(
            `When approximating $\\int_{${a}}^{${b}} ${integrand}\\,dx$ by the finite calculator integral $J(${epsTex}) = \\int_{${lower}}^{${b}} ${integrand}\\,dx$, by how much does $J(${epsTex})$ underestimate the exact improper integral?`,
            `用有限计算器积分 $J(${epsTex}) = \\int_{${lower}}^{${b}} ${integrand}\\,dx$ 近似反常积分 $\\int_{${a}}^{${b}} ${integrand}\\,dx$ 时，$J(${epsTex})$ 比精确反常积分小多少？`,
          ),
          err,
          [
            anti,
            step(
              "Integrate the omitted piece",
              "求略去部分的积分",
              t(`The calculator leaves out $[${a}, ${lower}]$:`, `计算器略去了 $[${a}, ${lower}]$：`),
              `\\int_{${a}}^{${lower}} ${integrand}\\,dx = ${2 * k}\\sqrt{${epsTex}} - ${2 * k}\\sqrt{0} = \\frac{${2 * k}}{${n}} = ${err.toLatex()}`,
            ),
          ],
          t(
            `Subtract the two integrals instead: the whole integral is $${2 * k}\\sqrt{${m * m}} = ${2 * k * m}$ and $J(${epsTex}) = ${2 * k * m} - \\frac{${2 * k}}{${n}} = ${jVal.toLatex()}$, so the shortfall is $${2 * k * m} - ${jVal.toLatex()} = ${err.toLatex()}$.`,
            `改为两个积分相减：整个积分是 $${2 * k}\\sqrt{${m * m}} = ${2 * k * m}$，$J(${epsTex}) = ${2 * k * m} - \\frac{${2 * k}}{${n}} = ${jVal.toLatex()}$，所以少了 $${2 * k * m} - ${jVal.toLatex()} = ${err.toLatex()}$。`,
          ),
          [
            slip(
              fullLim,
              `That is the whole improper integral, not the part the cutoff leaves out.`,
              `这是整个反常积分，不是截断略去的部分。`,
            ),
            slip(
              jVal,
              `That is $J(${epsTex})$ itself; the question asks how much it falls short.`,
              `这是 $J(${epsTex})$ 本身；题目问的是它少了多少。`,
            ),
            slip(
              Q.of(k, n),
              `This uses $${k === 1 ? "" : k}\\sqrt{${inside}}$ as the antiderivative, which is missing the factor $2$.`,
              `这把 $${k === 1 ? "" : k}\\sqrt{${inside}}$ 当作原函数，少了因子 $2$。`,
            ),
            slip(
              Q.of(2 * k, n * n),
              `This uses $\\varepsilon = ${epsTex}$ where the antiderivative needs $\\sqrt{${epsTex}} = \\frac{1}{${n}}$.`,
              `这用了 $\\varepsilon = ${epsTex}$，而原函数中应是 $\\sqrt{${epsTex}} = \\frac{1}{${n}}$。`,
            ),
          ],
        );
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
  intro: t(
    "Graphing $f'$ or $f''$ shows how $f$ behaves even without a formula for $f$. The inflection points of $f$ are at the local extrema of $f'$: for $f'(x) = x^2 - 4x$, the graph of $f'$ has its lowest point at $x = 2$, so $f$ has an inflection point there.\n\nCheck: $f''(x) = 2x - 4$ is negative for $x < 2$ and positive for $x > 2$, so the concavity of $f$ changes at $x = 2$.\n\nIn this lesson we find inflection points and extrema of $f$ from the graph of $f'$, and intervals where two conditions, such as increasing and concave up, hold together.",
    "即使没有 $f$ 的表达式，画出 $f'$ 或 $f''$ 也能看出 $f$ 的性态。$f$ 的拐点位于 $f'$ 的局部极值点处：对 $f'(x) = x^2 - 4x$，$f'$ 的图象在 $x = 2$ 处最低，所以 $f$ 在那里有拐点。\n\n检验：$f''(x) = 2x - 4$ 在 $x < 2$ 时为负，在 $x > 2$ 时为正，所以 $f$ 的凹凸性在 $x = 2$ 处改变。\n\n本课我们由 $f'$ 的图象找 $f$ 的拐点和极值，并找出两个条件（例如递增且上凹）同时成立的区间。",
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
        "When a calculator problem gives the formula for $f'(x)$, you do not need to differentiate $f'(x)$ by hand to find the inflection points of $f$. Because $f''(x)$ changes sign wherever $f'(x)$ changes from increasing to decreasing (or vice versa), the inflection points of $f$ occur at the $x$-coordinates of the local extrema of $Y_1 = f'(x)$. For $f'(x) = x^2 - 4x$, the `minimum` command gives $(2, -4)$, so $f$ has an inflection point at $x = 2$, where its tangent slope is $-4$.\n\nCheck: $f''(x) = 2x - 4$ changes sign at $x = 2$, exactly where $f'$ has its minimum.\n\n> **Watch out.** The zeros of $f'$ locate extrema of $f$, not inflection points; the inflection points come from the turning points of $f'$.",
        "当计算器题目给出导函数 $f'(x)$ 的表达式时，无需手动对 $f'(x)$ 求导即可找出 $f$ 的拐点。因为每当 $f'(x)$ 由递增变为递减（或由递减变为递增）时，$f''(x)$ 就会变号，所以原函数 $f$ 的拐点恰好出现在导函数 $Y_1 = f'(x)$ 的局部极值点的横坐标处。对 $f'(x) = x^2 - 4x$，`minimum` 命令给出 $(2, -4)$，所以 $f$ 在 $x = 2$ 处有拐点，那里的切线斜率是 $-4$。\n\n检验：$f''(x) = 2x - 4$ 恰在 $x = 2$ 处变号，也就是 $f'$ 取最小值的地方。\n\n> **注意。** $f'$ 的零点给出的是 $f$ 的极值点，不是拐点；拐点来自 $f'$ 的转折点。",
      ),
      generate: (rng: Rng) => {
        const z1 = rng.int(1, 2);
        const x1 = z1 + rng.int(1, 2);
        const z2 = x1 + rng.int(1, 2);
        const x2 = z2 + rng.int(1, 2);
        const y1 = rng.int(3, 9);
        const y2 = -rng.int(2, 7);
        const seen = t(
          `By graphing $Y_1 = f'(x)$ on a calculator, you find zeros at $x = ${z1}$ and $x = ${z2}$, a local maximum of $f'(x)$ at $(${x1}, ${y1})$, and a local minimum of $f'(x)$ at $(${x2}, ${y2})$.`,
          `在计算器上绘制 $Y_1 = f'(x)$，测得零点为 $x = ${z1}$ 与 $x = ${z2}$，$f'(x)$ 的局部极大值点为 $(${x1}, ${y1})$，局部极小值点为 $(${x2}, ${y2})$。`,
        );
        const inflections = step(
          "Find the inflection points",
          "找拐点",
          t(
            `The inflection points of $f$ are at the local extrema of $f'$, $x = ${x1}$ and $x = ${x2}$, not at the zeros $x = ${z1}, ${z2}$.`,
            `$f$ 的拐点在 $f'$ 的局部极值点 $x = ${x1}$ 与 $x = ${x2}$ 处，而不在零点 $x = ${z1}, ${z2}$ 处。`,
          ),
        );
        if (rng.bool())
          return worked(
            t(
              `${seen.en} At the smaller inflection point $x$-coordinate of $f$, what is the slope of the tangent line to the graph of $f$?`,
              `${seen["zh-CN"]}在原函数 $f$ 横坐标较小的那个拐点处，$f$ 图像的切线斜率是多少？`,
            ),
            Q.of(y1),
            [
              inflections,
              step(
                "Read the slope",
                "读出斜率",
                t(
                  `The smaller is $x = ${x1}$, and the slope of $f$ there is $f'(${x1})$:`,
                  `较小的是 $x = ${x1}$，$f$ 在那里的斜率是 $f'(${x1})$：`,
                ),
                `f'(${x1}) = ${y1}`,
              ),
            ],
            t(
              `The sign fits: $x = ${x1}$ lies between the zeros $${z1}$ and $${z2}$, where $f'$ rises from $0$ to its peak and falls back to $0$, so the slope there must be positive, and $${y1} > 0$.`,
              `符号相符：$x = ${x1}$ 在零点 $${z1}$ 与 $${z2}$ 之间，$f'$ 在那里从 $0$ 升到峰值再降回 $0$，所以该处斜率必为正，而 $${y1} > 0$。`,
            ),
            [
              slip(
                x1,
                `That is the $x$-coordinate of the inflection point; the slope is the $y$-value $f'(${x1})$.`,
                `这是拐点的横坐标；斜率是纵坐标 $f'(${x1})$。`,
              ),
              slip(
                0,
                `The slope is $0$ at a zero of $f'$, where $f$ has an extremum; the inflection point is at a turning point of $f'$.`,
                `斜率为 $0$ 的地方是 $f'$ 的零点，$f$ 在那里有极值；拐点在 $f'$ 的转折点处。`,
              ),
              slip(y2, `That is the slope at the larger inflection point, $x = ${x2}$.`, `这是横坐标较大的拐点 $x = ${x2}$ 处的斜率。`),
            ],
          );
        return worked(
          t(
            `${seen.en} At which $x$-coordinate does the graph of $f$ change from concave down to concave up?`,
            `${seen["zh-CN"]}原函数 $f$ 的图像在哪个横坐标 $x$ 处由下凹变为上凹？`,
          ),
          Q.of(x2),
          [
            inflections,
            step(
              "Match the direction",
              "看变化方向",
              t(
                `$f$ is concave down where $f'$ decreases and concave up where $f'$ increases. $f'$ decreases from its maximum at $x = ${x1}$ to its minimum at $x = ${x2}$, then increases; so the change from concave down to concave up is at $x = ${x2}$.`,
                `$f'$ 递减时 $f$ 下凹，$f'$ 递增时 $f$ 上凹。$f'$ 从 $x = ${x1}$ 处的极大值减到 $x = ${x2}$ 处的极小值，然后递增；所以由下凹变为上凹发生在 $x = ${x2}$ 处。`,
              ),
            ),
          ],
          t(
            `Use $f''$, the slope of the graph of $f'$: just before $x = ${x2}$ the graph of $f'$ is heading down to its minimum, so $f'' < 0$; just after, it heads up, so $f'' > 0$. The sign of $f''$ goes from negative to positive at $x = ${x2}$.`,
            `用 $f''$，即 $f'$ 图象的斜率：在 $x = ${x2}$ 之前，$f'$ 的图象向下走向最低点，$f'' < 0$；之后向上，$f'' > 0$。$f''$ 在 $x = ${x2}$ 处由负变正。`,
          ),
          [
            slip(
              z2,
              `At $x = ${z2}$, $f'$ changes from positive to negative: $f$ has a local maximum there, not an inflection point.`,
              `在 $x = ${z2}$ 处 $f'$ 由正变负：$f$ 在那里有局部极大值，而不是拐点。`,
            ),
            slip(
              x1,
              `At $x = ${x1}$, $f'$ turns from increasing to decreasing, so $f$ changes from concave up to concave down: the opposite change.`,
              `在 $x = ${x1}$ 处 $f'$ 由增变减，所以 $f$ 由上凹变为下凹：方向正好相反。`,
            ),
            slip(
              y2,
              `That is $f'(${x2})$, the slope of $f$ at the inflection point, not its $x$-coordinate.`,
              `这是 $f'(${x2})$，即 $f$ 在拐点处的斜率，不是横坐标。`,
            ),
          ],
        );
      },
    },
    {
      id: "simultaneous-monotonicity-and-concavity-conditions",
      figure: calculusDrawings5["exploring-functions-using-technology#simultaneous-monotonicity-and-concavity-conditions"],
      title: t("Finding Intervals Where Two Calculus Conditions Hold", "确定同时满足两个微积分性质的区间"),
      explanation: t(
        "By graphing $Y_1 = f'(x)$ and $Y_2 = f''(x)$ in the same viewing window, you can quickly identify intervals where both functions have prescribed signs—for example, where $f$ is both increasing ($f'(x) > 0$) and concave down ($f''(x) < 0$), or where a particle's speed is increasing ($v(t)$ and $a(t)$ have the same sign). For $f'(x) = -(x - 1)(x - 5)$ and $f''(x) = -2x + 6$, $f$ is increasing on $(1, 5)$ and concave up on $(-\\infty, 3)$, so both hold on $(1, 3)$.\n\nCheck: at $x = 2$, $f'(2) = -(1)(-3) = 3 > 0$ and $f''(2) = 2 > 0$.\n\n> **Watch out.** Take the overlap of the two intervals, not either one alone: increasing alone is $(1, 5)$, but only $(1, 3)$ is also concave up.",
        "通过在同一个视图窗口中同时绘制 $Y_1 = f'(x)$ 与 $Y_2 = f''(x)$，可以快速确定两个函数同时具有特定符号的区间——例如 $f$ 既递增（$f'(x) > 0$）又下凹（$f''(x) < 0$）的区间，或者质点速率增加（$v(t)$ 与 $a(t)$ 同号）的时间段。对 $f'(x) = -(x - 1)(x - 5)$ 与 $f''(x) = -2x + 6$，$f$ 在 $(1, 5)$ 上递增，在 $(-\\infty, 3)$ 上上凹，所以两者同时成立的区间是 $(1, 3)$。\n\n检验：在 $x = 2$ 处，$f'(2) = -(1)(-3) = 3 > 0$，$f''(2) = 2 > 0$。\n\n> **注意。** 要取两个区间的公共部分，而不是其中一个：单看递增是 $(1, 5)$，但只有 $(1, 3)$ 同时上凹。",
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
        const test = r1 + 1;
        return worked(
          t(
            `You graph $Y_1 = f'(x) = ${coeff}(${fac1})(${fac2})$ and $Y_2 = f''(x) = ${poly([-2 * a, "x"], [a * (r1 + r2), ""])}$ on a calculator. What is the length of the interval on which $f$ is both increasing and concave up?`,
            `在计算器上绘制 $Y_1 = f'(x) = ${coeff}(${fac1})(${fac2})$ 与 $Y_2 = f''(x) = ${poly([-2 * a, "x"], [a * (r1 + r2), ""])}$。函数 $f$ 既递增又上凹的区间长度是多少？`,
          ),
          len,
          [
            step(
              "Where $f$ increases",
              "$f$ 递增处",
              t(
                `$f'$ is a downward parabola with zeros $${r1}$ and $${r2}$, so $f'(x) > 0$ between them: on $(${r1}, ${r2})$.`,
                `$f'$ 是开口向下、零点为 $${r1}$ 和 $${r2}$ 的抛物线，所以在两零点之间 $f'(x) > 0$：即 $(${r1}, ${r2})$。`,
              ),
            ),
            step(
              "Where $f$ is concave up",
              "$f$ 上凹处",
              t(
                `$f''(x) > 0$ when $${2 * a}x < ${a * (r1 + r2)}$, that is, on $(-\\infty, ${mid.toLatex()})$.`,
                `当 $${2 * a}x < ${a * (r1 + r2)}$ 即 $x \\in (-\\infty, ${mid.toLatex()})$ 时 $f''(x) > 0$。`,
              ),
            ),
            step(
              "Take the overlap",
              "取公共部分",
              t(`Both hold on $(${r1}, ${mid.toLatex()})$, whose length is:`, `两者在 $(${r1}, ${mid.toLatex()})$ 上同时成立，其长度为：`),
              `${mid.toLatex()} - ${r1} = ${len.toLatex()}`,
            ),
          ],
          t(
            `Test a point inside, $x = ${test}$: $f'(${test}) = ${a * (r2 - r1 - 1)} > 0$ and $f''(${test}) = ${a * (r2 - r1 - 2)} > 0$. The interval ends at the vertex $x = ${mid.toLatex()}$ of $f'$, halfway between its zeros, so its length is half of $${r2 - r1}$.`,
            `取区间内一点 $x = ${test}$ 检验：$f'(${test}) = ${a * (r2 - r1 - 1)} > 0$，$f''(${test}) = ${a * (r2 - r1 - 2)} > 0$。区间止于 $f'$ 的顶点 $x = ${mid.toLatex()}$，即两零点的中点，所以长度是 $${r2 - r1}$ 的一半。`,
          ),
          [
            slip(
              r2 - r1,
              `That is the length of the whole interval where $f$ increases; on its right half $f$ is concave down.`,
              `这是 $f$ 递增的整个区间的长度；在它的右半部分 $f$ 是下凹的。`,
            ),
            slip(
              mid,
              `That is the right end $x = ${mid.toLatex()}$ of the interval, not its length.`,
              `这是区间的右端点 $x = ${mid.toLatex()}$，不是长度。`,
            ),
          ],
        );
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
  intro: t(
    "In parametric mode a calculator plots $(x(t), y(t))$, and in polar mode $(r\\cos\\theta, r\\sin\\theta)$; `nDeriv` then gives derivatives at a point. For $x = 4\\cos t$, $y = 3\\sin 2t$ at $t = \\frac{\\pi}{6}$: $x' = -4\\sin\\frac{\\pi}{6} = -2$ and $y' = 6\\cos\\frac{\\pi}{3} = 3$, so the slope is $\\frac{3}{-2} = -\\frac{3}{2}$ and the speed is $\\sqrt{(-2)^2 + 3^2} = \\sqrt{13} \\approx 3.61$.\n\nCheck: over a short time $0.01$ the point moves about $0.01 \\cdot \\langle -2, 3 \\rangle = \\langle -0.02, 0.03 \\rangle$, a rise of $0.03$ over a run of $-0.02$: slope $-\\frac{3}{2}$ again.\n\nIn this lesson we compute slopes and speeds on parametric curves, and rates of change on polar curves, from calculator values.",
    "在参数模式下计算器绘制 $(x(t), y(t))$，在极坐标模式下绘制 $(r\\cos\\theta, r\\sin\\theta)$；再用 `nDeriv` 求某点处的导数。对 $x = 4\\cos t$，$y = 3\\sin 2t$，在 $t = \\frac{\\pi}{6}$ 处：$x' = -4\\sin\\frac{\\pi}{6} = -2$，$y' = 6\\cos\\frac{\\pi}{3} = 3$，所以斜率是 $\\frac{3}{-2} = -\\frac{3}{2}$，速率是 $\\sqrt{(-2)^2 + 3^2} = \\sqrt{13} \\approx 3.61$。\n\n检验：在很短的时间 $0.01$ 内，点大约移动 $0.01 \\cdot \\langle -2, 3 \\rangle = \\langle -0.02, 0.03 \\rangle$，升高 $0.03$、水平移动 $-0.02$：斜率仍是 $-\\frac{3}{2}$。\n\n本课我们由计算器给出的值求参数曲线的斜率与速率，以及极坐标曲线的变化率。",
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
        "In Parametric (`PAR`) mode, a graphing calculator plots $(x(t), y(t))$ as $t$ increases from $T_{\\min}$ to $T_{\\max}$ in steps of $T_{\\text{step}}$. Combining numerical derivatives `nDeriv` of $x(t)$ and $y(t)$ lets you compute the slope $\\frac{dy}{dx} = \\frac{y'(t)}{x'(t)}$ and the speed $\\sqrt{(x'(t))^2 + (y'(t))^2}$.\n\nThe figure shows $x = 4\\cos t$, $y = 3\\sin 2t$ for $0 \\le t \\le 2\\pi$, with the velocity arrow at $t = \\frac{\\pi}{6}$: there $x' = -2$ and $y' = 3$, so the slope is $-\\frac{3}{2}$ and the speed is $\\sqrt{13}$.\n\nCheck: $\\sqrt{(-2)^2 + 3^2} = \\sqrt{13} \\approx 3.61$, and the negative slope $-\\frac{3}{2}$ matches an arrow that points up and to the left.\n\n> **Watch out.** The slope uses the derivatives, $\\frac{y'(t)}{x'(t)}$, not the coordinates $\\frac{y(t)}{x(t)}$, and it is $y'$ over $x'$, not the other way round.",
        "在参数（`PAR`）模式下，图形计算器令 $t$ 从 $T_{\\min}$ 以步长 $T_{\\text{step}}$ 递增到 $T_{\\max}$，依次绘制点 $(x(t), y(t))$。结合 $x(t)$ 与 $y(t)$ 的数值导数 `nDeriv`，可以求出切线斜率 $\\frac{dy}{dx} = \\frac{y'(t)}{x'(t)}$ 以及速率 $\\sqrt{(x'(t))^2 + (y'(t))^2}$。\n\n图中是 $x = 4\\cos t$，$y = 3\\sin 2t$（$0 \\le t \\le 2\\pi$），箭头表示 $t = \\frac{\\pi}{6}$ 时的速度：此时 $x' = -2$，$y' = 3$，所以斜率为 $-\\frac{3}{2}$，速率为 $\\sqrt{13}$。\n\n检验：$\\sqrt{(-2)^2 + 3^2} = \\sqrt{13} \\approx 3.61$，负斜率 $-\\frac{3}{2}$ 与指向左上方的箭头相符。\n\n> **注意。** 斜率用的是导数 $\\frac{y'(t)}{x'(t)}$，不是坐标 $\\frac{y(t)}{x(t)}$；而且是 $y'$ 比 $x'$，不能颠倒。",
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
        const slope = Q.of(vy, vx);
        const traced = (en: string, zh: string) =>
          t(
            `In Parametric mode, a graphing calculator traces $(x(t), y(t))$ to the point $(x(${t0}), y(${t0})) = (${xPos}, ${yPos})$ and reports the numerical derivatives $x'(${t0}) = ${vx}$ and $y'(${t0}) = ${vy}$. ${en}`,
            `在参数模式下，图形计算器追踪曲线 $(x(t), y(t))$ 至点 $(x(${t0}), y(${t0})) = (${xPos}, ${yPos})$，并给出数值导数 $x'(${t0}) = ${vx}$ 与 $y'(${t0}) = ${vy}$。${zh}`,
          );
        if (rng.bool())
          return worked(
            traced(
              `What is the slope $\\frac{dy}{dx}$ of the tangent line to the curve at $t = ${t0}$?`,
              `求曲线在 $t = ${t0}$ 处的切线斜率 $\\frac{dy}{dx}$。`,
            ),
            slope,
            [
              step(
                "Use the derivatives",
                "用导数",
                t("By the chain rule, $\\frac{dy}{dx} = \\frac{dy/dt}{dx/dt}$:", "由链式法则，$\\frac{dy}{dx} = \\frac{dy/dt}{dx/dt}$："),
                `\\frac{dy}{dx} = \\frac{y'(${t0})}{x'(${t0})}`,
              ),
              step("Divide", "相除", none, `\\frac{${vy}}{${vx}} = ${slope.toLatex()}`),
            ],
            t(
              `In a short time $0.01$ the point moves by about $0.01 \\cdot \\langle ${vx}, ${vy} \\rangle$: a run of $${vx / 100}$ and a rise of $${vy / 100}$, whose ratio is again $${slope.toLatex()}$.`,
              `在很短的时间 $0.01$ 内，点大约移动 $0.01 \\cdot \\langle ${vx}, ${vy} \\rangle$：水平移动 $${vx / 100}$，升高 $${vy / 100}$，两者之比仍是 $${slope.toLatex()}$。`,
            ),
            [
              slip(
                Q.of(vx, vy),
                `This is $\\frac{x'}{y'}$, upside down; the slope is the rise $y'$ over the run $x'$.`,
                `这是 $\\frac{x'}{y'}$，上下颠倒了；斜率是升高 $y'$ 比水平移动 $x'$。`,
              ),
              slip(
                Q.of(yPos, xPos),
                `This divides the coordinates, $\\frac{y(${t0})}{x(${t0})}$; the slope uses the derivatives.`,
                `这用坐标相除 $\\frac{y(${t0})}{x(${t0})}$；斜率要用导数。`,
              ),
              slip(hyp, `That is the speed, the length of the velocity vector, not the slope.`, `这是速率，即速度向量的长度，不是斜率。`),
            ],
          );
        return worked(
          traced(`What is the speed of the particle at $t = ${t0}$?`, `求质点在 $t = ${t0}$ 时刻的速率。`),
          Q.of(hyp),
          [
            step(
              "Square and add",
              "平方后相加",
              t("Speed is the length of the velocity vector:", "速率是速度向量的长度："),
              `${par(vx)}^2 + ${par(vy)}^2 = ${dx * dx} + ${dy * dy} = ${dx * dx + dy * dy}`,
            ),
            step("Take the square root", "开平方", none, `\\sqrt{${dx * dx + dy * dy}} = ${hyp}`),
          ],
          t(
            `Square the answer back: $${hyp}^2 = ${hyp * hyp} = ${dx}^2 + ${dy}^2$, so a vector with components of sizes $${dx}$ and $${dy}$ has length $${hyp}$.`,
            `把答案平方回去：$${hyp}^2 = ${hyp * hyp} = ${dx}^2 + ${dy}^2$，所以分量大小为 $${dx}$ 和 $${dy}$ 的向量长度是 $${hyp}$。`,
          ),
          [
            slip(
              dx + dy,
              `This adds the sizes of the components; the speed is $\\sqrt{x'^2 + y'^2}$, which is less than their sum.`,
              `这把分量的大小直接相加；速率是 $\\sqrt{x'^2 + y'^2}$，比它们的和小。`,
            ),
            slip(dx * dx + dy * dy, `That is the square of the speed; take its square root.`, `这是速率的平方；还要开平方。`),
            slip(
              Math.abs(vx + vy),
              `This adds the components with their signs; the speed squares each component first.`,
              `这把带符号的分量相加；速率要先把每个分量平方。`,
            ),
          ],
        );
      },
    },
    {
      id: "polar-mode-windows-and-area-integrals",
      title: t("Tracing Polar Curves and Rates of Change in Polar Mode", "极坐标曲线追踪与极坐标模式下的变化率"),
      explanation: t(
        "In Polar (`POL`) mode, the calculator plots $(r(\\theta)\\cos\\theta, r(\\theta)\\sin\\theta)$ as $\\theta$ sweeps from $\\theta_{\\min}$ to $\\theta_{\\max}$. From calculator values of $r(\\theta_0)$ and $r'(\\theta_0)$, you can determine both the Cartesian coordinate rates $x'(\\theta_0), y'(\\theta_0)$ and the rate $\\frac{dA}{d\\theta} = \\frac{1}{2}(r(\\theta_0))^2$ at which the radius vector sweeps out area.\n\nThe figure shows $r = 2 + 2\\cos\\theta$ with the radius at $\\theta = \\frac{\\pi}{2}$: there $r = 2$ and $r' = -2$, so $\\frac{dA}{d\\theta} = \\frac{1}{2}(2)^2 = 2$.\n\nCheck: a thin sector of radius $2$ and angle $0.01$ has area $\\frac{1}{2}(2)^2(0.01) = 0.02$, which is $2 \\times 0.01$.\n\n> **Watch out.** $\\frac{dy}{d\\theta}$ needs the product rule on $y = r\\sin\\theta$, giving $r'\\sin\\theta + r\\cos\\theta$; it is not $r'(\\theta)$ alone.",
        "在极坐标（`POL`）模式下，当 $\\theta$ 从 $\\theta_{\\min}$ 扫过到 $\\theta_{\\max}$ 时，计算器绘制点 $(r(\\theta)\\cos\\theta, r(\\theta)\\sin\\theta)$。利用计算器给出的 $r(\\theta_0)$ 与 $r'(\\theta_0)$，既可以求直角坐标的变化率 $x'(\\theta_0), y'(\\theta_0)$，也可以求极径扫过面积的变化率 $\\frac{dA}{d\\theta} = \\frac{1}{2}(r(\\theta_0))^2$。\n\n图中是 $r = 2 + 2\\cos\\theta$ 以及 $\\theta = \\frac{\\pi}{2}$ 处的极径：此时 $r = 2$，$r' = -2$，所以 $\\frac{dA}{d\\theta} = \\frac{1}{2}(2)^2 = 2$。\n\n检验：半径为 $2$、圆心角为 $0.01$ 的细扇形面积是 $\\frac{1}{2}(2)^2(0.01) = 0.02$，正是 $2 \\times 0.01$。\n\n> **注意。** 求 $\\frac{dy}{d\\theta}$ 要对 $y = r\\sin\\theta$ 用乘积法则，得 $r'\\sin\\theta + r\\cos\\theta$；它不只是 $r'(\\theta)$。",
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
        const shown = (en: string, zh: string) =>
          t(
            `You plot a polar curve $r = f(\\theta)$ on a graphing calculator. At $\\theta = ${angleTex}$, the calculator table and numerical derivative show $r(${angleTex}) = ${rVal}$ and $r'(${angleTex}) = ${drVal}$. ${en}`,
            `在图形计算器上绘制极坐标曲线 $r = f(\\theta)$。在 $\\theta = ${angleTex}$ 处，计算器数值表与数值导数显示 $r(${angleTex}) = ${rVal}$ 且 $r'(${angleTex}) = ${drVal}$。${zh}`,
          );
        if (askAreaRate)
          return worked(
            shown(
              `At what rate $\\frac{dA}{d\\theta}$ is the area swept out by the polar curve changing with respect to $\\theta$ at $\\theta = ${angleTex}$?`,
              `在 $\\theta = ${angleTex}$ 处，极径扫过的面积关于 $\\theta$ 的变化率 $\\frac{dA}{d\\theta}$ 是多少？`,
            ),
            areaRate,
            [
              step(
                "Differentiate the area",
                "对面积求导",
                t(
                  "The swept area is $A(\\theta) = \\int \\frac{1}{2}r^2\\,d\\theta$, so its rate is the integrand:",
                  "扫过的面积是 $A(\\theta) = \\int \\frac{1}{2}r^2\\,d\\theta$，所以它的变化率就是被积函数：",
                ),
                `\\frac{dA}{d\\theta} = \\frac{1}{2}(r(\\theta))^2`,
              ),
              step("Substitute", "代入", none, `\\frac{1}{2}(${rVal})^2 = ${areaRate.toLatex()}`),
            ],
            t(
              `A thin sector of radius $${rVal}$ and angle $0.01$ has area $\\frac{1}{2}(${rVal})^2(0.01) = ${dec(areaRate.mul(Q.of(1, 100)))}$, which is $${areaRate.toLatex()}$ times $0.01$; $r'$ does not enter.`,
              `半径为 $${rVal}$、圆心角为 $0.01$ 的细扇形面积是 $\\frac{1}{2}(${rVal})^2(0.01) = ${dec(areaRate.mul(Q.of(1, 100)))}$，正是 $${areaRate.toLatex()}$ 乘 $0.01$；$r'$ 不参与。`,
            ),
            [
              slip(
                rVal * rVal,
                `This leaves out the factor $\\frac{1}{2}$ of the sector area $\\frac{1}{2}r^2\\,\\Delta\\theta$.`,
                `这漏掉了扇形面积 $\\frac{1}{2}r^2\\,\\Delta\\theta$ 中的因子 $\\frac{1}{2}$。`,
              ),
              slip(
                rVal * drVal,
                `That is $r\\,r'$, the derivative of $\\frac{1}{2}r^2$: how fast $\\frac{dA}{d\\theta}$ itself changes, not the rate of the area.`,
                `这是 $r\\,r'$，即 $\\frac{1}{2}r^2$ 的导数：它表示 $\\frac{dA}{d\\theta}$ 本身变化的快慢，不是面积的变化率。`,
              ),
              slip(rVal, `That is the radius $r$; the area rate is $\\frac{1}{2}r^2$.`, `这是极径 $r$；面积变化率是 $\\frac{1}{2}r^2$。`),
            ],
          );
        const atHalf = c === 0;
        return worked(
          shown(
            `What is the value of $\\frac{dy}{d\\theta}$ at $\\theta = ${angleTex}$?`,
            `求 $\\theta = ${angleTex}$ 处 $\\frac{dy}{d\\theta}$ 的值。`,
          ),
          Q.of(dyDtheta),
          [
            step(
              "Differentiate $y = r\\sin\\theta$",
              "对 $y = r\\sin\\theta$ 求导",
              t("By the product rule:", "由乘积法则："),
              `\\frac{dy}{d\\theta} = r'(\\theta)\\sin\\theta + r(\\theta)\\cos\\theta`,
            ),
            step(
              "Substitute",
              "代入",
              t(
                `At $\\theta = ${angleTex}$, $\\sin\\theta = ${s}$ and $\\cos\\theta = ${c}$:`,
                `在 $\\theta = ${angleTex}$ 处，$\\sin\\theta = ${s}$，$\\cos\\theta = ${c}$：`,
              ),
              `\\frac{dy}{d\\theta} = (${drVal})(${s}) + (${rVal})(${c}) = ${dyDtheta}`,
            ),
          ],
          atHalf
            ? t(
                `Near $\\theta = \\frac{\\pi}{2}$, $\\sin\\theta$ stays close to $1$ (it changes only to second order), so $y \\approx r(\\theta)$ and $y$ changes at the rate of $r$: $r' = ${drVal}$.`,
                `在 $\\theta = \\frac{\\pi}{2}$ 附近 $\\sin\\theta$ 接近 $1$（只有二阶变化），所以 $y \\approx r(\\theta)$，$y$ 的变化率就是 $r$ 的变化率：$r' = ${drVal}$。`,
              )
            : t(
                `Near $\\theta = \\pi$, $\\sin\\theta \\approx -(\\theta - \\pi)$ and $r \\approx ${rVal}$, so $y \\approx -${rVal}(\\theta - \\pi)$, which changes at the rate $-${rVal}$.`,
                `在 $\\theta = \\pi$ 附近 $\\sin\\theta \\approx -(\\theta - \\pi)$，$r \\approx ${rVal}$，所以 $y \\approx -${rVal}(\\theta - \\pi)$，其变化率是 $-${rVal}$。`,
              ),
          atHalf
            ? [
                slip(
                  dxDtheta,
                  `That is $\\frac{dx}{d\\theta} = r'\\cos\\theta - r\\sin\\theta$, the horizontal rate.`,
                  `这是 $\\frac{dx}{d\\theta} = r'\\cos\\theta - r\\sin\\theta$，即水平方向的变化率。`,
                ),
                slip(
                  rVal,
                  `This takes the term $r\\cos\\theta$ as $r$, but $\\cos\\frac{\\pi}{2} = 0$.`,
                  `这把 $r\\cos\\theta$ 一项当成了 $r$，但 $\\cos\\frac{\\pi}{2} = 0$。`,
                ),
                slip(
                  drVal + rVal,
                  `This takes both $\\sin\\theta$ and $\\cos\\theta$ as $1$; at $\\frac{\\pi}{2}$ the cosine is $0$.`,
                  `这把 $\\sin\\theta$ 和 $\\cos\\theta$ 都当成了 $1$；在 $\\frac{\\pi}{2}$ 处余弦为 $0$。`,
                ),
              ]
            : [
                slip(
                  dxDtheta,
                  `That is $\\frac{dx}{d\\theta} = r'\\cos\\theta - r\\sin\\theta$, the horizontal rate.`,
                  `这是 $\\frac{dx}{d\\theta} = r'\\cos\\theta - r\\sin\\theta$，即水平方向的变化率。`,
                ),
                slip(
                  drVal,
                  `That is $r'$ alone; at $\\theta = \\pi$, $\\sin\\theta = 0$, so the $r'$ term vanishes.`,
                  `这只是 $r'$；在 $\\theta = \\pi$ 处 $\\sin\\theta = 0$，$r'$ 一项为零。`,
                ),
                slip(rVal, `This takes $\\cos\\pi$ as $1$; it is $-1$.`, `这把 $\\cos\\pi$ 当成了 $1$；它是 $-1$。`),
              ],
        );
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
