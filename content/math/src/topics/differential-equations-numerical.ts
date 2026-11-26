import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, poly, Q } from "@ga/subject-math";
import { differentialEquationsDrawings1 } from "../explanation-drawings-differential-equations-1.ts";
import { isTerminating, numberProblem, verdictChoice, why } from "../problems.ts";
import { none, walked } from "./calculus-i-differentiation.ts";

/** toQ reads a number as a rational. */
const toQ = (v: number | Q): Q => (v instanceof Q ? v : Q.of(v));

/** pl writes a rational number, in parentheses when it is negative. */
const pl = (v: number | Q): string => {
  const q = toQ(v);
  return q.sign() < 0 ? `\\left(${q.toLatex()}\\right)` : q.toLatex();
};

/** pd writes a terminating number as a decimal, in parentheses when it is negative. */
const pd = (v: number | Q): string => {
  const q = toQ(v);
  return q.sign() < 0 ? `(${dec(q)})` : dec(q);
};

/** co writes an integer coefficient before a symbol: "" for 1 and "-" for -1. */
const co = (n: number): string => (n === 1 ? "" : n === -1 ? "-" : `${n}`);

/** signed writes a number as a signed term: "+ 3" or "- 3". */
const signed = (n: number): string => (n < 0 ? `- ${-n}` : `+ ${n}`);

/** addQ writes a rational as a signed term after something else, and nothing for zero. */
const addQ = (v: number | Q): string => {
  const q = toQ(v);
  return q.isZero() ? "" : q.sign() < 0 ? ` - ${q.neg().toLatex()}` : ` + ${q.toLatex()}`;
};

/** Mistake is a wrong value with what to say about it. */
type Mistake = { readonly value: number | Q; readonly why: Text };

/** apart drops the mistakes whose value is the answer or repeats an earlier one. */
const apart = (answer: number | Q, mistakes: readonly Mistake[]): Mistake[] =>
  mistakes.filter((m, i, all) => !toQ(m.value).eq(toQ(answer)) && all.findIndex((x) => toQ(x.value).eq(toQ(m.value))) === i);

/** decimals keeps the mistakes that can be written as terminating decimals. */
const decimals = (answer: Q, mistakes: readonly Mistake[]): Mistake[] => apart(answer, mistakes).filter((m) => isTerminating(toQ(m.value)));

/** Topics for Unit 7: Approximating Solutions to Differential Equations. */
export const differentialEquationsNumericalTopics: TopicDef[] = [
  // 7.22.2 Taylor Series Solutions of Differential Equations
  {
    id: "taylor-series-solutions-of-differential-equations",
    title: t("Taylor Series Solutions of Differential Equations", "常微分方程的泰勒级数解法"),
    summary: t(
      "Differentiating the ODE repeatedly produces higher derivatives at the expansion point, constructing the Taylor polynomial solution.",
      "对微分方程逐次求导可求得展开点处的各阶导数值，从而构造微分方程的泰勒多项式解。",
    ),
    intro: t(
      "Take $y' = 2x + y$ with $y(0) = 3$. The equation gives $y'(0) = 0 + 3 = 3$. Differentiating it gives $y'' = 2 + y'$, so $y''(0) = 2 + 3 = 5$, and the Taylor polynomial is $y \\approx 3 + 3x + \\frac{5}{2}x^{2}$.\n\nCheck: the polynomial has $y' \\approx 3 + 5x$, and $2x + y \\approx 2x + 3 + 3x = 3 + 5x$ as well, up to the $x^{2}$ terms we dropped.\n\nIn this lesson we get the derivatives of a solution at a point from the equation itself, by differentiating it again and again, and build the solution's Taylor series from them.",
      "取 $y' = 2x + y$，$y(0) = 3$。方程给出 $y'(0) = 0 + 3 = 3$。对方程求导得 $y'' = 2 + y'$，所以 $y''(0) = 2 + 3 = 5$，泰勒多项式为 $y \\approx 3 + 3x + \\frac{5}{2}x^{2}$。\n\n检验：这个多项式的导数 $y' \\approx 3 + 5x$，而 $2x + y \\approx 2x + 3 + 3x = 3 + 5x$，在略去的 $x^{2}$ 项之外两者一致。\n\n本课我们由方程本身反复求导，得到解在一点处的各阶导数，并用它们写出解的泰勒级数。",
    ),
    prerequisites: ["introduction-to-recurrence-relations"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "taylor-series-second-derivative",
        title: t("Evaluating the second derivative from a first-order ODE", "由一阶常微分方程计算二阶导数值"),
        explanation: t(
          "Differentiating the equation itself gives the second derivative in terms of lower derivatives, and the initial condition supplies their values at the center. For $y' = b x + y$ with $y(0) = a$, differentiating gives $y'' = b + y'$. At $x = 0$, $y'(0) = y(0) = a$, so $y''(0) = b + a$.\n\n> **Watch out.** The $y$ on the right is a function of $x$ too, so its derivative $y'$ must appear. For $y' = 3x + y$ with $y(0) = 4$: $y'' = 3 + y'$ and $y''(0) = 3 + 4 = 7$, not $3$.",
          "对方程本身求导，就用低阶导数表示出二阶导数，初始条件提供它们在中心处的值。对于微分方程 $y' = b x + y$（初值 $y(0) = a$），两边求导得 $y'' = b + y'$。在 $x = 0$ 处，$y'(0) = y(0) = a$，因此 $y''(0) = b + a$。\n\n> **注意。** 右边的 $y$ 也是 $x$ 的函数，求导时必须出现它的导数 $y'$。对 $y' = 3x + y$，$y(0) = 4$：$y'' = 3 + y'$，$y''(0) = 3 + 4 = 7$，而不是 $3$。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.int(2, 25);
          const b = rng.int(2, 25);
          const ans = a + b;
          return numberProblem({
            prompt: t(
              `Consider the initial value problem $y' = ${b}x + y$ with $y(0) = ${a}$. Using implicit differentiation, find the second derivative $y''(0)$ at the expansion center $x = 0$.`,
              `考虑初值问题 $y' = ${b}x + y$，其中 $y(0) = ${a}$。利用隐函数求导法，求在展开中心 $x = 0$ 处的二阶导数 $y''(0)$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                b,
                `That differentiates $${b}x$ but treats $y$ as a constant; its derivative $y'(0) = ${a}$ must be added.`,
                `这只对 $${b}x$ 求了导，把 $y$ 当成了常数；还要加上它的导数 $y'(0) = ${a}$。`,
              ),
              why(
                a,
                `That is $y'(0)$, the first derivative; differentiate the equation once more.`,
                `这是一阶导数 $y'(0)$；还要再对方程求导一次。`,
              ),
              why(a * b, "That multiplies the two numbers; the derivatives add.", "这把两个数相乘了；两部分导数应相加。"),
            ]),
            solution: walked(
              [
                [
                  ["Read off the first derivative", "读出一阶导数"],
                  t("Put $x = 0$ into the equation:", "把 $x = 0$ 代入方程："),
                  [`y'(0) = ${b} \\cdot 0 + y(0) = ${a}`],
                ],
                [
                  ["Differentiate the equation", "对方程求导"],
                  t("Both terms on the right depend on $x$:", "右边两项都依赖于 $x$："),
                  [`y'' = \\frac{d}{dx}(${b}x + y) = ${b} + y'`],
                ],
                [["Evaluate at the center", "在中心处求值"], none, [`y''(0) = ${b} + y'(0) = ${b} + ${a} = ${ans}`]],
              ],
              t(
                `The exact solution is $y = ${ans}e^{x} - ${b}x - ${b}$: it has $y(0) = ${ans} - ${b} = ${a}$, and $y'' = ${ans}e^{x}$ gives $y''(0) = ${ans}$.`,
                `精确解为 $y = ${ans}e^{x} - ${b}x - ${b}$：它满足 $y(0) = ${ans} - ${b} = ${a}$，而由 $y'' = ${ans}e^{x}$ 得 $y''(0) = ${ans}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "a-cubic-taylor-coefficient-of-a-nonlinear-equation",
        title: t("A cubic Taylor coefficient of a nonlinear equation", "非线性方程的三次泰勒系数"),
        explanation: t(
          "The same idea works for nonlinear equations; the chain rule just produces more terms. For $y' = cx + y^{2}$ with $y(0) = a$:\n\n$$y'' = c + 2yy', \\qquad y''' = 2(y')^{2} + 2yy''.$$\n\nAt $0$: $y' = a^{2}$, $y'' = c + 2a^{3}$ and $y''' = 6a^{4} + 2ac$. The Taylor coefficient of $x^{3}$ is $\\frac{y'''(0)}{3!}$; forgetting the factorial is the common slip.\n\n> **Watch out.** The coefficient is the derivative divided by $3! = 6$, not the derivative itself. For $y' = 3x + y^{2}$ with $y(0) = 1$: $y'''(0) = 6 + 6 = 12$, so the coefficient of $x^{3}$ is $\\frac{12}{6} = 2$, not $12$.",
          "同样的方法适用于非线性方程，只是链式法则会产生更多项。对 $y' = cx + y^{2}$，$y(0) = a$：\n\n$$y'' = c + 2yy', \\qquad y''' = 2(y')^{2} + 2yy''.$$\n\n在 $0$ 处：$y' = a^{2}$，$y'' = c + 2a^{3}$，$y''' = 6a^{4} + 2ac$。$x^{3}$ 的泰勒系数为 $\\frac{y'''(0)}{3!}$；忘记除以阶乘是常见错误。\n\n> **注意。** 系数是导数除以 $3! = 6$，而不是导数本身。对 $y' = 3x + y^{2}$，$y(0) = 1$：$y'''(0) = 6 + 6 = 12$，所以 $x^{3}$ 的系数是 $\\frac{12}{6} = 2$，而不是 $12$。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.pick([-2, -1, 1, 2]);
          const c = rng.int(1, 9);
          const y1 = a * a;
          const y2 = c + 2 * a ** 3;
          const y3 = 2 * y1 * y1 + 2 * a * y2;
          const ans = Q.of(y3, 6);
          const cx = `${co(c)}x`;
          return numberProblem({
            prompt: t(
              `For $y' = ${cx} + y^{2}$ with $y(0) = ${a}$, find the coefficient of $x^{3}$ in the Taylor series of $y$ about $0$.`,
              `对 $y' = ${cx} + y^{2}$，$y(0) = ${a}$，求 $y$ 在 $0$ 处泰勒级数中 $x^{3}$ 的系数。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                y3,
                `That is $y'''(0)$ itself; the Taylor coefficient divides it by $3! = 6$.`,
                `这是 $y'''(0)$ 本身；泰勒系数还要除以 $3! = 6$。`,
              ),
              why(Q.of(y3, 3), "That divides by $3$ instead of $3! = 6$.", "这除以的是 $3$，而不是 $3! = 6$。"),
              why(
                Q.of(y2, 2),
                `That is $\\frac{y''(0)}{2!}$, the coefficient of $x^{2}$, not of $x^{3}$.`,
                `这是 $\\frac{y''(0)}{2!}$，即 $x^{2}$ 的系数，而不是 $x^{3}$ 的系数。`,
              ),
              why(
                Q.of(2 * y1 * y1, 6),
                `That keeps only $2(y')^{2}$ in $y'''$; the product rule on $2yy'$ also gives $2yy''$.`,
                `这在 $y'''$ 中只保留了 $2(y')^{2}$；对 $2yy'$ 用乘积法则还会得到 $2yy''$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["The first derivative", "一阶导数"],
                  t("From the equation at $x = 0$:", "由方程在 $x = 0$ 处："),
                  [`y'(0) = ${pl(a)}^{2} = ${y1}`],
                ],
                [
                  ["The second derivative", "二阶导数"],
                  t("Differentiate the equation once, with the chain rule on $y^{2}$:", "对方程求导一次，对 $y^{2}$ 用链式法则："),
                  [`y'' = ${c} + 2yy'`, `y''(0) = ${c} + 2 \\cdot ${pl(a)} \\cdot ${y1} = ${y2}`],
                ],
                [
                  ["The third derivative", "三阶导数"],
                  t("Differentiate $2yy'$ with the product rule:", "用乘积法则对 $2yy'$ 求导："),
                  [`y''' = 2(y')^{2} + 2yy''`, `y'''(0) = 2 \\cdot ${y1}^{2} + 2 \\cdot ${pl(a)} \\cdot ${pl(y2)} = ${y3}`],
                ],
                [["Divide by the factorial", "除以阶乘"], none, [`\\frac{y'''(0)}{3!} = \\frac{${y3}}{6} = ${ans.toLatex()}`]],
              ],
              t(
                `In $y' = ${cx} + y^{2}$ the $x^{2}$ terms must match. On the left, the $x^{3}$ term of $y$ gives $3 \\cdot ${pl(ans)} = ${3 * (y3 / 6)}$. On the right, $y^{2}$ has the $x^{2}$ coefficient $2 \\cdot ${pl(a)} \\cdot \\frac{${y2}}{2} + ${y1}^{2} = ${a * y2 + y1 * y1}$.`,
                `在 $y' = ${cx} + y^{2}$ 中，$x^{2}$ 项必须相等。左边由 $y$ 的 $x^{3}$ 项得 $3 \\cdot ${pl(ans)} = ${3 * (y3 / 6)}$。右边 $y^{2}$ 的 $x^{2}$ 系数为 $2 \\cdot ${pl(a)} \\cdot \\frac{${y2}}{2} + ${y1}^{2} = ${a * y2 + y1 * y1}$。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 7.22.3 Power Series Solutions of Differential Equations
  {
    id: "power-series-solutions-of-differential-equations",
    title: t("Power Series Solutions of Differential Equations", "常微分方程的幂级数解法"),
    summary: t(
      "Near an ordinary point, substituting $y = \\sum a_n x^n$ gives a recurrence that produces every coefficient from $a_0$ and $a_1$.",
      "在常点附近代入 $y = \\sum a_n x^n$，得到递推关系，由 $a_0$ 与 $a_1$ 确定全部系数。",
    ),
    intro: t(
      "Take $y'' - 4y = 0$ with $a_0 = 3$ and $a_1 = 0$. Substituting $y = \\sum a_nx^{n}$ and matching the coefficient of $x^{n}$ gives $(n + 2)(n + 1)a_{n+2} = 4a_n$. So $a_2 = \\frac{4 \\cdot 3}{2} = 6$ and $a_4 = \\frac{4 \\cdot 6}{12} = 2$, while every odd coefficient is $0$.\n\nCheck: the solution with these starting values is $3\\cosh 2x = 3\\left(1 + \\frac{(2x)^{2}}{2} + \\frac{(2x)^{4}}{24} + \\cdots\\right) = 3 + 6x^{2} + 2x^{4} + \\cdots$.\n\nIn this lesson we substitute a power series into an equation with polynomial coefficients, match powers to get a recurrence, and run it to find the coefficients.",
      "取 $y'' - 4y = 0$，$a_0 = 3$，$a_1 = 0$。代入 $y = \\sum a_nx^{n}$ 并比较 $x^{n}$ 的系数得 $(n + 2)(n + 1)a_{n+2} = 4a_n$。所以 $a_2 = \\frac{4 \\cdot 3}{2} = 6$，$a_4 = \\frac{4 \\cdot 6}{12} = 2$，而所有奇数项系数都是 $0$。\n\n检验：满足这些初值的解是 $3\\cosh 2x = 3\\left(1 + \\frac{(2x)^{2}}{2} + \\frac{(2x)^{4}}{24} + \\cdots\\right) = 3 + 6x^{2} + 2x^{4} + \\cdots$。\n\n本课我们把幂级数代入多项式系数的方程，比较各次幂得到递推关系，再运行递推求出各个系数。",
    ),
    prerequisites: ["taylor-series-solutions-of-differential-equations"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "power-series-recurrence-step",
        title: t("Calculating higher coefficient from power series recurrence", "由幂级数递推关系计算高阶系数"),
        explanation: t(
          "Substituting a power series and matching the coefficients of each power gives a recurrence that determines each coefficient from an earlier one. For $y'' - k y = 0$, substituting $y = \\sum a_n x^n$ gives $(n+2)(n+1)a_{n+2} = k a_n$. For $n = 0$, $a_2 = \\frac{k a_0}{2}$.\n\n> **Watch out.** Moving $-ky$ to the other side makes it $+ka_n$, and the factor $(n + 2)(n + 1)$ is $2$ at $n = 0$. For $y'' - 3y = 0$ with $a_0 = 8$: $a_2 = \\frac{3 \\cdot 8}{2} = 12$, not $-12$ and not $24$.",
          "代入幂级数并比较各次幂的系数，就得到由前面的系数确定每个系数的递推关系。对于方程 $y'' - k y = 0$，代入 $y = \\sum a_n x^n$ 得递推公式 $(n+2)(n+1)a_{n+2} = k a_n$。当 $n = 0$ 时，$a_2 = \\frac{k a_0}{2}$。\n\n> **注意。** 把 $-ky$ 移到另一边后变成 $+ka_n$，而因子 $(n + 2)(n + 1)$ 在 $n = 0$ 时等于 $2$。对 $y'' - 3y = 0$，$a_0 = 8$：$a_2 = \\frac{3 \\cdot 8}{2} = 12$，既不是 $-12$ 也不是 $24$。",
        ),
        generate(rng: Rng): Problem {
          const k = rng.int(2, 10);
          const m = rng.int(2, 35);
          const a0 = 2 * m;
          const ans = k * m;
          return numberProblem({
            prompt: t(
              `Substitute the power series $y = \\sum_{n=0}^\\infty a_n x^n$ into $y'' - ${k}y = 0$ with $a_0 = ${a0}$. Find the coefficient $a_2$.`,
              `将幂级数 $y = \\sum_{n=0}^\\infty a_n x^n$ 代入微分方程 $y'' - ${k}y = 0$。已知 $a_0 = ${a0}$，求系数 $a_2$ 的值。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(k * a0, "That forgets to divide by $(n + 2)(n + 1) = 2$ at $n = 0$.", "这忘了除以 $n = 0$ 时的 $(n + 2)(n + 1) = 2$。"),
              why(
                -ans,
                `That keeps the minus sign of $-${k}y$; moved across, it becomes $+${k}a_n$.`,
                `这保留了 $-${k}y$ 的负号；移到另一边后应是 $+${k}a_n$。`,
              ),
              why(m, `That divides $a_0$ by $2$ but leaves out the factor $${k}$.`, `这把 $a_0$ 除以了 $2$，却漏掉了因子 $${k}$。`),
            ]),
            solution: walked(
              [
                [
                  ["Differentiate the series", "对级数求导"],
                  t("Shift the index so that $y''$ is written in powers $x^{n}$:", "平移指标，把 $y''$ 写成 $x^{n}$ 的幂级数："),
                  [`y'' = \\sum_{n=0}^\\infty (n+2)(n+1) a_{n+2} x^n`],
                ],
                [
                  ["Match the powers", "比较各次幂"],
                  t("Every coefficient of the sum must vanish:", "和式的每个系数都必须为零："),
                  [`(n+2)(n+1) a_{n+2} - ${k} a_n = 0`, `a_{n+2} = \\frac{${k} a_n}{(n+2)(n+1)}`],
                ],
                [["Take $n = 0$", "取 $n = 0$"], none, [`a_2 = \\frac{${k} a_0}{2 \\cdot 1} = \\frac{${k} \\cdot ${a0}}{2} = ${ans}`]],
              ],
              t(
                `At $x = 0$ the series gives $y''(0) = 2a_2 = ${2 * ans}$, and the equation needs $y''(0) = ${k}y(0) = ${k} \\cdot ${a0} = ${k * a0}$.`,
                `在 $x = 0$ 处，级数给出 $y''(0) = 2a_2 = ${2 * ans}$，而方程要求 $y''(0) = ${k}y(0) = ${k} \\cdot ${a0} = ${k * a0}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "a-recurrence-for-an-airy-type-equation",
        title: t("A recurrence for an Airy-type equation", "艾里型方程的递推关系"),
        explanation: t(
          "For $y'' = kxy$, substituting $y = \\sum a_nx^{n}$ and matching the coefficient of $x^{n}$ gives\n\n$$(n + 2)(n + 1)a_{n+2} = ka_{n-1}, \\qquad a_2 = 0.$$\n\nThe recurrence jumps by three, so $a_3 = \\frac{ka_0}{6}$, $a_4 = \\frac{ka_1}{12}$, $a_5 = 0$ and $a_6 = \\frac{ka_3}{30}$. The coefficients split into three chains starting from $a_0$, $a_1$ and $a_2 = 0$.\n\n> **Watch out.** Each coefficient comes from the one three places back, not two. For $y'' = 2xy$ with $a_0 = 3$ and $a_1 = 6$: $a_4 = \\frac{2 \\cdot 6}{12} = 1$ comes from $a_1$, while $a_0$ feeds $a_3 = \\frac{2 \\cdot 3}{6} = 1$.",
          "对 $y'' = kxy$，代入 $y = \\sum a_nx^{n}$ 并比较 $x^{n}$ 的系数得\n\n$$(n + 2)(n + 1)a_{n+2} = ka_{n-1}, \\qquad a_2 = 0.$$\n\n递推每次跳三步，所以 $a_3 = \\frac{ka_0}{6}$，$a_4 = \\frac{ka_1}{12}$，$a_5 = 0$，$a_6 = \\frac{ka_3}{30}$。系数分成从 $a_0$、$a_1$ 和 $a_2 = 0$ 出发的三条链。\n\n> **注意。** 每个系数来自它前面第三个系数，而不是前面第二个。对 $y'' = 2xy$，$a_0 = 3$，$a_1 = 6$：$a_4 = \\frac{2 \\cdot 6}{12} = 1$ 来自 $a_1$，而 $a_0$ 给出的是 $a_3 = \\frac{2 \\cdot 3}{6} = 1$。",
        ),
        generate(rng: Rng): Problem {
          const k = rng.pick([-3, -2, -1, 1, 2, 3, 4, 6]);
          const a0 = rng.int(1, 9);
          const a1 = rng.int(-6, 6) || 2;
          const which = rng.pick([3, 4, 6]);
          const a3 = Q.of(k * a0, 6);
          const ans = which === 3 ? a3 : which === 4 ? Q.of(k * a1, 12) : a3.mul(Q.of(k, 30));
          const ky = co(k);
          const d = which * (which - 1);
          const src = which === 3 ? Q.of(a0) : which === 4 ? Q.of(a1) : a3;
          const n = which - 2;
          const mistakes: Mistake[] =
            which === 3
              ? [
                  why(
                    Q.of(k * a1, 6),
                    "That starts from $a_1$; the chain through $a_3$ starts at $a_0$.",
                    "这从 $a_1$ 出发；经过 $a_3$ 的那条链从 $a_0$ 出发。",
                  ),
                  why(
                    Q.of(k * a0, 2),
                    "That divides by $2$; at $n = 1$ the factor is $(n + 2)(n + 1) = 6$.",
                    "这除以了 $2$；在 $n = 1$ 时因子是 $(n + 2)(n + 1) = 6$。",
                  ),
                ]
              : which === 4
                ? [
                    why(
                      Q.of(k * a0, 12),
                      "That starts from $a_0$; $a_4$ comes from $a_1$, three places back.",
                      "这从 $a_0$ 出发；$a_4$ 来自前面第三个系数 $a_1$。",
                    ),
                    why(
                      Q.of(k * a1, 6),
                      "That divides by $6$; at $n = 2$ the factor is $(n + 2)(n + 1) = 12$.",
                      "这除以了 $6$；在 $n = 2$ 时因子是 $(n + 2)(n + 1) = 12$。",
                    ),
                  ]
                : [
                    why(
                      a3,
                      "That is $a_3$; one more step of the recurrence is needed to reach $a_6$.",
                      "这是 $a_3$；还要再递推一步才到 $a_6$。",
                    ),
                    why(
                      a3.mul(Q.of(k, 6)),
                      "That divides by $6$ again; at $n = 4$ the factor is $(n + 2)(n + 1) = 30$.",
                      "这又除以了 $6$；在 $n = 4$ 时因子是 $(n + 2)(n + 1) = 30$。",
                    ),
                    why(
                      Q.zero,
                      "That treats $a_6$ as part of the chain of $a_2 = 0$; it is in the chain of $a_0$.",
                      "这把 $a_6$ 当成了 $a_2 = 0$ 那条链上的系数；它在 $a_0$ 那条链上。",
                    ),
                  ];
          return numberProblem({
            prompt: t(
              `The series $y = \\sum a_nx^{n}$ solves $y'' = ${ky}xy$ with $a_0 = ${a0}$ and $a_1 = ${a1}$. Find $a_{${which}}$.`,
              `级数 $y = \\sum a_nx^{n}$ 是 $y'' = ${ky}xy$ 的解，$a_0 = ${a0}$，$a_1 = ${a1}$。求 $a_{${which}}$。`,
            ),
            answer: ans,
            mistakes: apart(ans, mistakes),
            solution: walked(
              [
                [
                  ["Match the powers", "比较各次幂"],
                  t(
                    `The $x^{n}$ term of $y''$ is $(n + 2)(n + 1)a_{n+2}$, and that of $${ky}xy$ comes from $a_{n-1}$:`,
                    `$y''$ 的 $x^{n}$ 项是 $(n + 2)(n + 1)a_{n+2}$，而 $${ky}xy$ 的 $x^{n}$ 项来自 $a_{n-1}$：`,
                  ),
                  [`(n + 2)(n + 1)a_{n+2} = ${ky}a_{n-1}`],
                ],
                ...(which === 6
                  ? ([[["Take $n = 1$", "取 $n = 1$"], none, [`a_3 = \\frac{${k} \\cdot ${a0}}{6} = ${a3.toLatex()}`]]] as const)
                  : []),
                [[`Take $n = ${n}$`, `取 $n = ${n}$`], none, [`a_{${which}} = \\frac{${k} \\cdot ${pl(src)}}{${d}} = ${ans.toLatex()}`]],
              ],
              t(
                `Multiplying back, $${d} \\cdot ${pl(ans)} = ${ans.mul(Q.of(d)).toLatex()}$, and $${k} \\cdot ${pl(src)} = ${src.mul(Q.of(k)).toLatex()}$ as the recurrence requires.`,
                `乘回去，$${d} \\cdot ${pl(ans)} = ${ans.mul(Q.of(d)).toLatex()}$，而 $${k} \\cdot ${pl(src)} = ${src.mul(Q.of(k)).toLatex()}$，与递推关系相符。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 7.22.4 Regular Singular Points
  {
    id: "regular-singular-points",
    title: t("Regular Singular Points", "正则奇点"),
    summary: t(
      "A singular point $x_0$ of $P(x)y'' + Q(x)y' + R(x)y = 0$ is regular if $(x - x_0)\\frac{Q}{P}$ and $(x - x_0)^2 \\frac{R}{P}$ are analytic there.",
      "若 $(x - x_0)\\frac{Q}{P}$ 与 $(x - x_0)^2 \\frac{R}{P}$ 在奇点 $x_0$ 处解析，则 $x_0$ 是 $P(x)y'' + Q(x)y' + R(x)y = 0$ 的正则奇点。",
    ),
    intro: t(
      "Take $x^{2}y'' + 3xy' + 5y = 0$. The leading coefficient vanishes at $x = 0$, so $0$ is a singular point. Dividing by $x^{2}$ gives $p = \\frac{3}{x}$ and $q = \\frac{5}{x^{2}}$, and then $xp = 3$ and $x^{2}q = 5$ are analytic, so $0$ is a regular singular point.\n\nCheck: this is a Cauchy-Euler equation, and $y = x^{r}$ turns it into $r(r - 1) + 3r + 5 = 0$, an equation for $r$ alone, which is what a regular singular point allows.\n\nIn this lesson we find the singular points of an equation and test whether each one is regular, the condition under which a series method still works there.",
      "取 $x^{2}y'' + 3xy' + 5y = 0$。最高阶系数在 $x = 0$ 处为零，所以 $0$ 是奇点。两边除以 $x^{2}$ 得 $p = \\frac{3}{x}$，$q = \\frac{5}{x^{2}}$，于是 $xp = 3$ 与 $x^{2}q = 5$ 都解析，所以 $0$ 是正则奇点。\n\n检验：这是一个欧拉方程，$y = x^{r}$ 把它化成只含 $r$ 的方程 $r(r - 1) + 3r + 5 = 0$，这正是正则奇点所允许的。\n\n本课我们求方程的奇点，并检验每个奇点是否正则，这是级数方法在该点仍然适用的条件。",
    ),
    prerequisites: ["power-series-solutions-of-differential-equations"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "identifying-regular-singular-point",
        title: t("Locating a non-zero regular singular point", "确定非零正则奇点的位置"),
        explanation: t(
          "In $P(x)y'' + Q(x)y' + R(x)y = 0$, a zero $x_0$ of $P$ is a regular singular point when $(x - x_0)\\frac{Q}{P}$ and $(x - x_0)^2\\frac{R}{P}$ are both analytic at $x_0$. For $x^2 (x - a) y'' + x y' + y = 0$, the zeros of $P$ are $x = 0$ and $x = a$, and both are regular singular points.\n\n> **Watch out.** The singular points are the zeros of $P$, so factor it first. In $x^{2}(x^{2} - 9)y'' + xy' + y = 0$, $P = x^{2}(x - 3)(x + 3)$ vanishes at $0$, $3$ and $-3$; the number $9$ is not a singular point.",
          "在 $P(x)y'' + Q(x)y' + R(x)y = 0$ 中，若 $P$ 的零点 $x_0$ 使 $(x - x_0)\\frac{Q}{P}$ 与 $(x - x_0)^2\\frac{R}{P}$ 在 $x_0$ 处都解析，则 $x_0$ 是正则奇点。对于方程 $x^2 (x - a) y'' + x y' + y = 0$，$P$ 的零点为 $x = 0$ 与 $x = a$，两者都是正则奇点。\n\n> **注意。** 奇点是 $P$ 的零点，所以要先把 $P$ 因式分解。在 $x^{2}(x^{2} - 9)y'' + xy' + y = 0$ 中，$P = x^{2}(x - 3)(x + 3)$ 在 $0$、$3$ 和 $-3$ 处为零；$9$ 不是奇点。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.int(2, 35);
          const sq = a * a;
          return numberProblem({
            prompt: t(
              `Find the positive regular singular point $x_0 > 0$ of the differential equation $x^2 (x^2 - ${sq}) y'' + x y' + y = 0$.`,
              `求微分方程 $x^2 (x^2 - ${sq}) y'' + x y' + y = 0$ 的正正则奇点 $x_0 > 0$。`,
            ),
            answer: a,
            mistakes: apart(a, [
              why(
                sq,
                `That is the constant $${sq}$ in the factor $x^{2} - ${sq}$; the factor vanishes at its square root.`,
                `这是因式 $x^{2} - ${sq}$ 中的常数 $${sq}$；该因式在它的平方根处为零。`,
              ),
              why(-a, "That is the negative singular point; the question asks for the positive one.", "这是负的奇点；题目要的是正的那个。"),
              why(0, "$x = 0$ is a regular singular point too, but it is not positive.", "$x = 0$ 也是正则奇点，但它不是正数。"),
            ]),
            solution: walked(
              [
                [
                  ["Factor the leading coefficient", "分解最高阶系数"],
                  t(
                    `Its zeros are $0$, $${a}$ and $-${a}$, and only $${a}$ is positive:`,
                    `它的零点是 $0$、$${a}$ 和 $-${a}$，其中只有 $${a}$ 是正的：`,
                  ),
                  [`P(x) = x^2 (x - ${a})(x + ${a})`],
                ],
                [
                  ["Test the coefficient of $y'$", "检验 $y'$ 的系数"],
                  t(`This is analytic at $x = ${a}$:`, `它在 $x = ${a}$ 处解析：`),
                  [`(x - ${a}) \\frac{Q(x)}{P(x)} = \\frac{x(x - ${a})}{x^2(x - ${a})(x + ${a})} = \\frac{1}{x(x + ${a})}`],
                ],
                [
                  ["Test the coefficient of $y$", "检验 $y$ 的系数"],
                  t(
                    `This is analytic at $x = ${a}$ as well, so $x = ${a}$ is regular:`,
                    `它在 $x = ${a}$ 处同样解析，所以 $x = ${a}$ 是正则的：`,
                  ),
                  [`(x - ${a})^2 \\frac{R(x)}{P(x)} = \\frac{x - ${a}}{x^2(x + ${a})}`],
                ],
              ],
              t(
                `$P(${a}) = ${a}^{2}(${a}^{2} - ${sq}) = 0$, and the factor $x - ${a}$ appears only once in $P$, which is why one power of $x - ${a}$ already cancels it in front of $Q$.`,
                `$P(${a}) = ${a}^{2}(${a}^{2} - ${sq}) = 0$，且因式 $x - ${a}$ 在 $P$ 中只出现一次，所以在 $Q$ 前乘一次 $x - ${a}$ 就能把它消去。`,
              ),
            ),
          });
        },
      },
      {
        id: "regular-or-irregular-singular-points",
        title: t("Regular or irregular singular points", "正则奇点与非正则奇点"),
        explanation: t(
          "Write the equation as $y'' + p(x)y' + q(x)y = 0$. The singular point $0$ is regular when $xp(x)$ and $x^{2}q(x)$ have no negative powers of $x$; otherwise it is irregular.\n\nFor $x^{3}y'' + xy' + y = 0$: $p = x^{-2}$, so $xp = x^{-1}$ blows up and $0$ is irregular. For $x^{2}y'' + 3xy' + y = 0$: $xp = 3$ and $x^{2}q = 1$, so $0$ is regular.\n\n> **Watch out.** A negative power in $p$ or $q$ itself does not make the point irregular; only what is left after multiplying by $x$ and $x^{2}$ counts. In $x^{2}y'' + 4xy' + 2y = 0$, $p = 4x^{-1}$ and $q = 2x^{-2}$, yet $xp = 4$ and $x^{2}q = 2$, so $0$ is regular.",
          "把方程写成 $y'' + p(x)y' + q(x)y = 0$。若 $xp(x)$ 与 $x^{2}q(x)$ 都不含 $x$ 的负幂，则奇点 $0$ 是正则的；否则是非正则的。\n\n对 $x^{3}y'' + xy' + y = 0$：$p = x^{-2}$，所以 $xp = x^{-1}$ 无界，$0$ 是非正则奇点。对 $x^{2}y'' + 3xy' + y = 0$：$xp = 3$，$x^{2}q = 1$，所以 $0$ 是正则奇点。\n\n> **注意。** $p$ 或 $q$ 本身含负幂并不使该点成为非正则奇点；只看乘以 $x$ 和 $x^{2}$ 之后剩下的部分。在 $x^{2}y'' + 4xy' + 2y = 0$ 中，$p = 4x^{-1}$，$q = 2x^{-2}$，但 $xp = 4$，$x^{2}q = 2$，所以 $0$ 是正则奇点。",
        ),
        generate(rng: Rng): Problem {
          const m = rng.int(1, 3);
          const j = rng.int(0, 2);
          const qc = rng.int(1, 9);
          const r = rng.int(1, 9);
          const pw = (e: number): string => (e === 0 ? "" : e === 1 ? "x" : `x^{${e}}`);
          const pe = j - m + 1;
          const qe = 2 - m;
          const regular = pe >= 0 && qe >= 0;
          const mono = (c: number, e: number): string => (e === 0 ? `${c}` : `${c === 1 ? "" : c}${e < 0 ? `x^{${e}}` : pw(e)}`);
          const equation = `${pw(m)}y'' + ${qc === 1 && j > 0 ? "" : qc}${pw(j)}y' + ${r}y = 0`;
          return verdictChoice(rng, {
            prompt: t(`Is $x = 0$ a regular singular point of $${equation}$?`, `$x = 0$ 是 $${equation}$ 的正则奇点吗？`),
            holds: regular,
            yes: t(
              "$xp(x)$ and $x^{2}q(x)$ have no negative powers of $x$, so both are analytic at $0$",
              "$xp(x)$ 与 $x^{2}q(x)$ 都不含 $x$ 的负幂，在 $0$ 处都解析",
            ),
            no: t(
              "$xp(x)$ or $x^{2}q(x)$ keeps a negative power of $x$, so it blows up at $0$",
              "$xp(x)$ 或 $x^{2}q(x)$ 仍含 $x$ 的负幂，在 $0$ 处无界",
            ),
            yesWrong: t("the coefficient of $y''$ vanishes at $0$", "$y''$ 的系数在 $0$ 处为零"),
            noWrong: t("$p(x)$ itself has a negative power of $x$", "$p(x)$ 本身含 $x$ 的负幂"),
            solution: walked(
              [
                [
                  ["Divide by the leading coefficient", "除以最高阶系数"],
                  t(`Dividing by $${pw(m)}$ gives`, `除以 $${pw(m)}$ 得`),
                  [`p(x) = ${mono(qc, j - m)}`, `q(x) = ${mono(r, -m)}`],
                ],
                [["Multiply by the powers of $x$", "乘以 $x$ 的幂"], none, [`xp(x) = ${mono(qc, pe)}`, `x^{2}q(x) = ${mono(r, qe)}`]],
                [
                  ["Decide", "判断"],
                  regular
                    ? t(
                        "Neither has a negative power of $x$, so $0$ is a regular singular point.",
                        "两者都不含 $x$ 的负幂，所以 $0$ 是正则奇点。",
                      )
                    : t(
                        "A negative power of $x$ is left, so $0$ is an irregular singular point.",
                        "还剩下 $x$ 的负幂，所以 $0$ 是非正则奇点。",
                      ),
                ],
              ],
              t(
                `Equivalently, $0$ is regular exactly when the power of $x$ in front of $y'$ is at least $${m} - 1$ and the power in front of $y$ is at least $${m} - 2$. Here they are $${j}$ and $0$, so the point is ${regular ? "regular" : "irregular"}.`,
                `等价地说，$0$ 是正则奇点当且仅当 $y'$ 前 $x$ 的幂至少为 $${m} - 1$，且 $y$ 前 $x$ 的幂至少为 $${m} - 2$。这里它们分别是 $${j}$ 和 $0$，所以该点是${regular ? "正则" : "非正则"}奇点。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 7.22.5 The Method of Frobenius
  {
    id: "the-method-of-frobenius",
    title: t("The Method of Frobenius", "弗罗贝尼乌斯方法"),
    summary: t(
      "The method of Frobenius tries a series $y = x^r \\sum a_n x^n$ and finds the exponent $r$ from the indicial equation.",
      "弗罗贝尼乌斯方法设广义幂级数解 $y = x^r \\sum a_n x^n$，由指标方程确定指数 $r$。",
    ),
    intro: t(
      "Take $x^{2}y'' + xy' - 4y = 0$. Substituting $y = x^{r}$ gives $r(r - 1) + r - 4 = r^{2} - 4 = 0$, so the indicial roots are $r = 2$ and $r = -2$.\n\nCheck: $y = x^{2}$ gives $x^{2} \\cdot 2 + x \\cdot 2x - 4x^{2} = 0$.\n\nIn this lesson we try a series $x^{r}\\sum a_nx^{n}$ at a regular singular point, and find the possible exponents $r$ from the indicial equation, which comes from the lowest power of $x$.",
      "取 $x^{2}y'' + xy' - 4y = 0$。代入 $y = x^{r}$ 得 $r(r - 1) + r - 4 = r^{2} - 4 = 0$，所以指标根为 $r = 2$ 与 $r = -2$。\n\n检验：$y = x^{2}$ 给出 $x^{2} \\cdot 2 + x \\cdot 2x - 4x^{2} = 0$。\n\n本课我们在正则奇点处设级数 $x^{r}\\sum a_nx^{n}$，并由来自 $x$ 最低次幂的指标方程求出可能的指数 $r$。",
    ),
    prerequisites: ["regular-singular-points"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "frobenius-indicial-root",
        title: t("Larger root of the Frobenius indicial equation", "弗罗贝尼乌斯指标方程的较大根"),
        explanation: t(
          "The indicial equation comes from the lowest power of the variable after substitution, and its roots give the possible starting exponents of the series. For $x^2 y'' - r_1 x y' + r_1 y = 0$, the indicial equation is $r(r - 1) - r_1 r + r_1 = (r - 1)(r - r_1) = 0$. The roots are $r = 1$ and $r = r_1$. In general, $x^2 y'' + bxy' + cy = 0$ has the indicial equation $r(r - 1) + br + c = 0$.\n\n> **Watch out.** The term $x^{2}y''$ gives $r(r - 1)$, not $r^{2}$. For $x^{2}y'' - 2xy' + 2y = 0$: $r(r - 1) - 2r + 2 = r^{2} - 3r + 2 = (r - 1)(r - 2)$, so the roots are $1$ and $2$; writing $r^{2} - 2r + 2$ instead gives no real roots at all.",
          "指标方程来自代入后变量的最低次幂，它的根给出级数可能的起始指数。对于方程 $x^2 y'' - r_1 x y' + r_1 y = 0$，指标方程为 $r(r - 1) - r_1 r + r_1 = (r - 1)(r - r_1) = 0$。其根为 $r = 1$ 与 $r = r_1$。 一般地，$x^2 y'' + bxy' + cy = 0$ 的指标方程为 $r(r - 1) + br + c = 0$。\n\n> **注意。** $x^{2}y''$ 给出的是 $r(r - 1)$，不是 $r^{2}$。对 $x^{2}y'' - 2xy' + 2y = 0$：$r(r - 1) - 2r + 2 = r^{2} - 3r + 2 = (r - 1)(r - 2)$，所以根是 $1$ 和 $2$；若写成 $r^{2} - 2r + 2$，就根本没有实根。",
        ),
        generate(rng: Rng): Problem {
          const p = rng.nonZero(-3, 6);
          const q = p + rng.int(1, 6) || p + 7;
          const ans = q;
          const b = p + q - 1;
          const eq = poly([1, "x^2y''"], [-b, "xy'"], [p * q, "y"]);
          const ind = poly([1, "r^2"], [-(p + q), "r"], [p * q, ""]);
          const factor = (s: number): string => (s === 0 ? "r" : `(${poly([1, "r"], [-s, ""])})`);
          const fac = p === 0 ? `${factor(p)}${factor(q)}` : q === 0 ? `${factor(q)}${factor(p)}` : `${factor(p)}${factor(q)}`;
          return numberProblem({
            prompt: t(
              `Find the larger root of the indicial equation for the differential equation $${eq} = 0$ about the regular singular point $x = 0$.`,
              `求微分方程 $${eq} = 0$ 在正则奇点 $x = 0$ 处的指标方程的较大根。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(p, "That is the smaller root; the question asks for the larger one.", "这是较小的根；题目要的是较大的根。"),
              why(
                -q,
                `That flips the sign: the factor $${factor(q)}$ vanishes at $r = ${q}$.`,
                `这弄反了符号：因式 $${factor(q)}$ 在 $r = ${q}$ 处为零。`,
              ),
              why(p + q, "That is the sum of the two roots, not a root.", "这是两根之和，不是一个根。"),
            ]),
            solution: walked(
              [
                [
                  ["Substitute the Frobenius series", "代入弗罗贝尼乌斯级数"],
                  t(
                    "With $y = \\sum_{n=0}^\\infty a_n x^{n+r}$ and $a_0 \\ne 0$, the lowest power $x^{r}$ gives the indicial equation:",
                    "设 $y = \\sum_{n=0}^\\infty a_n x^{n+r}$，$a_0 \\ne 0$，最低次幂 $x^{r}$ 给出指标方程：",
                  ),
                  [`${poly([1, "r(r - 1)"], [-b, "r"], [p * q, ""])} = 0`],
                ],
                [["Factor it", "因式分解"], none, [`${ind} = ${fac} = 0`]],
                [
                  ["Pick the larger root", "取较大的根"],
                  t(`The roots are $${p}$ and $${q}$, and the larger is $${ans}$.`, `两根为 $${p}$ 与 $${q}$，较大的是 $${ans}$。`),
                ],
              ],
              t(
                `The roots of $r^{2} - (1 + b)r + c = 0$ add to $1 + b$ and multiply to $c$. Here $${p} + ${pl(q)} = ${p + q}$ is $1 + ${pl(b)}$, and $${p} \\cdot ${pl(q)} = ${p * q}$ is the coefficient of $y$.`,
                `$r^{2} - (1 + b)r + c = 0$ 的两根之和为 $1 + b$，之积为 $c$。这里 $${p} + ${pl(q)} = ${p + q}$ 等于 $1 + ${pl(b)}$，$${p} \\cdot ${pl(q)} = ${p * q}$ 等于 $y$ 的系数。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-indicial-equation-with-variable-coefficients",
        title: t("The indicial equation with variable coefficients", "变系数方程的指标方程"),
        explanation: t(
          "Only the lowest-order behavior near $0$ enters the indicial equation. For $ax^{2}y'' + bxy' + (c + dx)y = 0$, the term $dxy$ is of higher order, and substituting $y = x^{r}$ into the remaining part gives\n\n$$ar(r - 1) + br + c = 0.$$\n\nFor $2x^{2}y'' + 3xy' - (1 + x)y = 0$: $2r(r - 1) + 3r - 1 = 2r^{2} + r - 1 = 0$, so $r = \\frac{1}{2}$ or $r = -1$.\n\n> **Watch out.** The term $dxy$ never enters, because after substituting $y = x^{r}$ it gives $x^{r+1}$, one power higher than the rest. For $2x^{2}y'' + xy' + (x - 1)y = 0$ the indicial equation is $2r(r - 1) + r - 1 = 2r^{2} - r - 1 = 0$, with roots $1$ and $-\\frac{1}{2}$; the $x$ in $x - 1$ plays no part.",
          "只有 $0$ 附近的最低阶部分进入指标方程。对 $ax^{2}y'' + bxy' + (c + dx)y = 0$，项 $dxy$ 是高阶的，把 $y = x^{r}$ 代入其余部分得\n\n$$ar(r - 1) + br + c = 0.$$\n\n对 $2x^{2}y'' + 3xy' - (1 + x)y = 0$：$2r(r - 1) + 3r - 1 = 2r^{2} + r - 1 = 0$，所以 $r = \\frac{1}{2}$ 或 $r = -1$。\n\n> **注意。** 项 $dxy$ 从不进入指标方程，因为代入 $y = x^{r}$ 后它给出 $x^{r+1}$，比其余各项高一次。对 $2x^{2}y'' + xy' + (x - 1)y = 0$，指标方程为 $2r(r - 1) + r - 1 = 2r^{2} - r - 1 = 0$，根为 $1$ 与 $-\\frac{1}{2}$；$x - 1$ 中的 $x$ 不起作用。",
        ),
        generate(rng: Rng): Problem {
          const p1 = rng.pick([-3, -1, 1, 3, 5]);
          let p2 = rng.int(-3, 3);
          if (2 * p2 === p1) p2 += 1;
          const b = 2 - p1 - 2 * p2;
          const c = p1 * p2;
          const d = rng.int(1, 5);
          const r1 = Q.of(p1, 2);
          const r2 = Q.of(p2);
          const small = r1.cmp(r2) < 0 ? r1 : r2;
          const big = r1.cmp(r2) < 0 ? r2 : r1;
          const lin = (k: number, v: string): string =>
            k === 0 ? "" : ` ${k < 0 ? "-" : "+"} ${Math.abs(k) === 1 && v !== "" ? "" : Math.abs(k)}${v}`;
          const cy = c === 0 ? `${co(d)}x` : `${c}${lin(d, "x")}`;
          const second = p2 === 0 ? "r" : `(r ${signed(-p2)})`;
          const indicial = `2r^{2}${lin(b - 2, "r")}${lin(c, "")}`;
          const t1 = Q.of(2).mul(small.pow(2));
          const t2 = Q.of(b - 2).mul(small);
          const value = t1.isZero() && t2.isZero() && c === 0 ? "0" : `${t1.toLatex()}${addQ(t2)}${addQ(c)}`;
          return numberProblem({
            prompt: t(
              `Find the smaller root of the indicial equation of $2x^{2}y''${lin(b, "xy'")} + (${cy})y = 0$ at $x = 0$.`,
              `求 $2x^{2}y''${lin(b, "xy'")} + (${cy})y = 0$ 在 $x = 0$ 处指标方程的较小根。`,
            ),
            answer: small,
            mistakes: apart(small, [
              why(big, "That is the larger root; the question asks for the smaller one.", "这是较大的根；题目要的是较小的根。"),
              why(
                small.neg(),
                "That flips the sign of the smaller root: a factor $(r - s)$ vanishes at $r = s$.",
                "这弄反了较小根的符号：因式 $(r - s)$ 在 $r = s$ 处为零。",
              ),
              why(
                big.neg(),
                "That flips the sign of the larger root, which turns it into a smaller number.",
                "这弄反了较大根的符号，使它变成了一个更小的数。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Drop the higher-order term", "略去高阶项"],
                  t(
                    `The term $${co(d)}xy$ gives a power of $x$ one higher, so only $2x^{2}y''${lin(b, "xy'")}${lin(c, "y")}$ enters:`,
                    `项 $${co(d)}xy$ 给出高一次的幂，所以只有 $2x^{2}y''${lin(b, "xy'")}${lin(c, "y")}$ 进入指标方程：`,
                  ),
                  [`2r(r - 1)${lin(b, "r")}${lin(c, "")} = ${indicial} = 0`],
                ],
                [["Factor it", "因式分解"], none, [`(2r ${signed(-p1)})${second} = 0`]],
                [
                  ["Pick the smaller root", "取较小的根"],
                  t(
                    `The roots are $${r1.toLatex()}$ and $${r2.toLatex()}$, and the smaller is $${small.toLatex()}$.`,
                    `两根为 $${r1.toLatex()}$ 与 $${r2.toLatex()}$，较小的是 $${small.toLatex()}$。`,
                  ),
                ],
              ],
              t(
                `Substituting $r = ${small.toLatex()}$ into $${indicial}$ gives $${value} = 0$.`,
                `把 $r = ${small.toLatex()}$ 代入 $${indicial}$ 得 $${value} = 0$。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 7.22.6 Finding Recurrence Relations for the Coefficients of a Frobenius Solution
  {
    id: "finding-recurrence-relations-for-the-coefficients-of-a-frobenius-solution",
    title: t("Finding Recurrence Relations for the Coefficients of a Frobenius Solution", "确定弗罗贝尼乌斯解系数的递推关系"),
    summary: t(
      "Substituting the indicial exponent into higher powers yields the recurrence relation for the Frobenius series coefficients.",
      "将指标方程的解代入高次幂平衡方程，可求得弗罗贝尼乌斯级数系数满足的递推关系。",
    ),
    intro: t(
      "Take $xy'' + 2y' + y = 0$ with exponent $r = 0$ and $a_0 = 6$. Substituting $y = \\sum a_nx^{n}$ and matching the coefficient of $x^{n}$ gives $(n + 1)(n + 2)a_{n+1} = -a_n$. So $a_1 = -\\frac{6}{2} = -3$ and $a_2 = -\\frac{-3}{6} = \\frac{1}{2}$.\n\nCheck: the coefficient of $x$ in $xy'' + 2y' + y$ is $2a_2 + 4a_2 + a_1 = 6 \\cdot \\frac{1}{2} - 3 = 0$, as it must be.\n\nIn this lesson we substitute a Frobenius series with a known exponent, match powers to get the recurrence for its coefficients, and run that recurrence.",
      "取 $xy'' + 2y' + y = 0$，指数 $r = 0$，$a_0 = 6$。代入 $y = \\sum a_nx^{n}$ 并比较 $x^{n}$ 的系数得 $(n + 1)(n + 2)a_{n+1} = -a_n$。所以 $a_1 = -\\frac{6}{2} = -3$，$a_2 = -\\frac{-3}{6} = \\frac{1}{2}$。\n\n检验：$xy'' + 2y' + y$ 中 $x$ 的系数为 $2a_2 + 4a_2 + a_1 = 6 \\cdot \\frac{1}{2} - 3 = 0$，正应如此。\n\n本课我们代入指数已知的弗罗贝尼乌斯级数，比较各次幂得到系数的递推关系，再运行这个递推。",
    ),
    prerequisites: ["the-method-of-frobenius"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "frobenius-first-recurrence-step",
        title: t("First recurrence coefficient in a Frobenius expansion", "弗罗贝尼乌斯展开中的第一递推系数"),
        explanation: t(
          "Matching the coefficient of the next power gives the first coefficient after the leading one in terms of that leading coefficient. For $x y'' + c y' + y = 0$ with $r = 0$, equating the $x^0$ term gives $1(c) a_1 + a_0 = 0 \\implies a_1 = -a_0 / c$.\n\n> **Watch out.** The minus sign stays when $a_1$ is isolated. For $xy'' + 4y' + y = 0$ with $a_0 = 8$: $4a_1 + 8 = 0$, so $a_1 = -2$, not $2$.",
          "比较下一个幂的系数，就能用首项系数表示出首项之后的第一个系数。对于方程 $x y'' + c y' + y = 0$（取指标 $r = 0$），令 $x^0$ 项系数为零得 $1(c) a_1 + a_0 = 0 \\implies a_1 = -a_0 / c$。\n\n> **注意。** 解出 $a_1$ 时负号要保留。对 $xy'' + 4y' + y = 0$，$a_0 = 8$：$4a_1 + 8 = 0$，所以 $a_1 = -2$，而不是 $2$。",
        ),
        generate(rng: Rng): Problem {
          const c = rng.int(2, 8);
          const ans = rng.int(2, 35);
          const a0 = -ans * c;
          return numberProblem({
            prompt: t(
              `In the Frobenius series solution $y = \\sum_{n=0}^\\infty a_n x^n$ (with index $r = 0$) to $x y'' + ${c} y' + y = 0$, given $a_0 = ${a0}$, find the coefficient $a_1$.`,
              `在微分方程 $x y'' + ${c} y' + y = 0$ 对应于指标 $r = 0$ 的弗罗贝尼乌斯级数解 $y = \\sum_{n=0}^\\infty a_n x^n$ 中，已知 $a_0 = ${a0}$，求系数 $a_1$ 的值。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                -ans,
                `That drops the minus sign: $a_1 = -\\frac{a_0}{${c}}$, and $a_0$ is negative.`,
                `这丢了负号：$a_1 = -\\frac{a_0}{${c}}$，而 $a_0$ 是负数。`,
              ),
              why(ans * c, `That moves $a_0$ across but forgets to divide by $${c}$.`, `这移了项却忘了除以 $${c}$。`),
              why(
                Q.of(-a0, c + 1),
                `That uses $n = 1$ in the factor $(n + 1)(n + ${c})$; the constant term has $n = 0$, so the factor is $${c}$.`,
                `这在因子 $(n + 1)(n + ${c})$ 中取了 $n = 1$；常数项对应 $n = 0$，因子是 $${c}$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Shift both derivative terms", "平移两个导数项"],
                  t("Write each in powers $x^{k}$:", "把它们都写成 $x^{k}$ 的幂级数："),
                  [`x y'' = \\sum_{k=0}^\\infty (k+1)k\\, a_{k+1} x^k`, `${c} y' = \\sum_{k=0}^\\infty ${c}(k+1) a_{k+1} x^k`],
                ],
                [
                  ["Match the constant term", "比较常数项"],
                  t("At $k = 0$ the first sum gives nothing:", "当 $k = 0$ 时第一个和式没有贡献："),
                  [`${c}a_1 + a_0 = 0`],
                ],
                [["Solve for $a_1$", "解出 $a_1$"], none, [`a_1 = -\\frac{a_0}{${c}} = -\\frac{${a0}}{${c}} = ${ans}`]],
              ],
              t(
                `Putting it back, $${c} \\cdot ${ans} + (${a0}) = ${c * ans} - ${c * ans} = 0$.`,
                `代回去，$${c} \\cdot ${ans} + (${a0}) = ${c * ans} - ${c * ans} = 0$。`,
              ),
            ),
          });
        },
      },
      {
        id: "running-a-frobenius-recurrence-two-steps",
        title: t("Running a Frobenius recurrence two steps", "把弗罗贝尼乌斯递推运行两步"),
        explanation: t(
          "For $xy'' + by' + y = 0$ with exponent $r = 0$, substituting $y = \\sum a_nx^{n}$ and matching the coefficient of $x^{n}$ gives\n\n$$(n + 1)(n + b)a_{n+1} = -a_n.$$\n\nSo $a_1 = -\\frac{a_0}{b}$ and $a_2 = -\\frac{a_1}{2(b + 1)} = \\frac{a_0}{2b(b + 1)}$. Each step uses the previous coefficient, and the signs alternate.\n\n> **Watch out.** The factor changes with $n$: at $n = 1$ it is $2(b + 1)$, not $2b$. For $xy'' + 3y' + y = 0$ with $a_0 = 24$: $a_1 = -8$ and $a_2 = -\\frac{-8}{2 \\cdot 4} = 1$, not $\\frac{8}{6}$.",
          "对指数 $r = 0$ 的 $xy'' + by' + y = 0$，代入 $y = \\sum a_nx^{n}$ 并比较 $x^{n}$ 的系数得\n\n$$(n + 1)(n + b)a_{n+1} = -a_n.$$\n\n所以 $a_1 = -\\frac{a_0}{b}$，$a_2 = -\\frac{a_1}{2(b + 1)} = \\frac{a_0}{2b(b + 1)}$。每一步都用到前一个系数，且符号交替。\n\n> **注意。** 因子随 $n$ 变化：在 $n = 1$ 时它是 $2(b + 1)$，不是 $2b$。对 $xy'' + 3y' + y = 0$，$a_0 = 24$：$a_1 = -8$，$a_2 = -\\frac{-8}{2 \\cdot 4} = 1$，而不是 $\\frac{8}{6}$。",
        ),
        generate(rng: Rng): Problem {
          const b = rng.int(1, 6);
          const a0 = rng.int(1, 12) * rng.pick([1, -1]);
          const a1 = Q.of(-a0, b);
          const ans = Q.of(a0, 2 * b * (b + 1));
          return numberProblem({
            prompt: t(
              `The Frobenius solution of $xy'' + ${co(b)}y' + y = 0$ with exponent $r = 0$ is $y = \\sum a_nx^{n}$ with $a_0 = ${a0}$. Find $a_2$.`,
              `$xy'' + ${co(b)}y' + y = 0$ 的指数 $r = 0$ 的弗罗贝尼乌斯解为 $y = \\sum a_nx^{n}$，$a_0 = ${a0}$。求 $a_2$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(a1, "That is $a_1$; the recurrence has to run one more step.", "这是 $a_1$；递推还要再走一步。"),
              why(
                ans.neg(),
                "That loses a sign: each step brings a minus sign, so two steps bring the sign of $a_0$ back.",
                "这丢了一个符号：每一步带来一个负号，两步后符号回到 $a_0$ 的符号。",
              ),
              why(
                Q.of(a0, 2 * b * b),
                `That uses $2 \\cdot ${b}$ at $n = 1$; the factor there is $(1 + 1)(1 + ${b}) = ${2 * (b + 1)}$.`,
                `这在 $n = 1$ 时用了 $2 \\cdot ${b}$；那里的因子是 $(1 + 1)(1 + ${b}) = ${2 * (b + 1)}$。`,
              ),
            ]),
            solution: walked(
              [
                [["Write the recurrence", "写出递推关系"], none, [`(n + 1)(n + ${b})a_{n+1} = -a_n`]],
                [["Take $n = 0$", "取 $n = 0$"], none, [`a_1 = -\\frac{${a0}}{1 \\cdot ${b}} = ${a1.toLatex()}`]],
                [["Take $n = 1$", "取 $n = 1$"], none, [`a_2 = -\\frac{1}{2 \\cdot ${b + 1}} \\cdot ${pl(a1)} = ${ans.toLatex()}`]],
              ],
              t(
                `The two steps combine into $a_2 = \\frac{a_0}{2b(b + 1)} = \\frac{${a0}}{2 \\cdot ${b} \\cdot ${b + 1}} = ${ans.toLatex()}$.`,
                `两步合起来是 $a_2 = \\frac{a_0}{2b(b + 1)} = \\frac{${a0}}{2 \\cdot ${b} \\cdot ${b + 1}} = ${ans.toLatex()}$。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 7.22.7 Finding General Solutions Using the Method of Frobenius
  {
    id: "finding-general-solutions-using-the-method-of-frobenius",
    title: t("Finding General Solutions Using the Method of Frobenius", "利用弗罗贝尼乌斯方法求通解"),
    summary: t(
      "When indicial roots differ by a non-integer, two linearly independent Frobenius series solutions form the complete general solution.",
      "当指标方程两根之差不为整数时，由两根分别生成的两个线性无关弗罗贝尼乌斯级数构成完整的通解。",
    ),
    intro: t(
      "Take $2x^{2}y'' + xy' - y = 0$. The indicial equation is $2r(r - 1) + r - 1 = 2r^{2} - r - 1 = (2r + 1)(r - 1) = 0$, with roots $1$ and $-\\frac{1}{2}$. They differ by $\\frac{3}{2}$, not an integer, so the general solution is $y = c_1x + c_2x^{-1/2}$.\n\nCheck: for $y = x^{-1/2}$, $2x^{2}y'' = \\frac{3}{2}x^{-1/2}$ and $xy' = -\\frac{1}{2}x^{-1/2}$, and $\\frac{3}{2} - \\frac{1}{2} - 1 = 0$.\n\nIn this lesson we use the two indicial roots to build two independent Frobenius solutions, and learn when the difference of the roots guarantees that this works.",
      "取 $2x^{2}y'' + xy' - y = 0$。指标方程为 $2r(r - 1) + r - 1 = 2r^{2} - r - 1 = (2r + 1)(r - 1) = 0$，根为 $1$ 与 $-\\frac{1}{2}$。两根相差 $\\frac{3}{2}$，不是整数，所以通解为 $y = c_1x + c_2x^{-1/2}$。\n\n检验：对 $y = x^{-1/2}$，$2x^{2}y'' = \\frac{3}{2}x^{-1/2}$，$xy' = -\\frac{1}{2}x^{-1/2}$，而 $\\frac{3}{2} - \\frac{1}{2} - 1 = 0$。\n\n本课我们用两个指标根构造两个独立的弗罗贝尼乌斯解，并学习两根之差在什么情况下能保证这样做可行。",
    ),
    prerequisites: ["finding-recurrence-relations-for-the-coefficients-of-a-frobenius-solution"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "frobenius-non-integer-root-difference",
        title: t("Exponent of the primary Frobenius solution", "主弗罗贝尼乌斯解的指数"),
        explanation: t(
          "When the two roots of the indicial equation do not differ by an integer, each root gives its own independent series solution. For $2 x^2 y'' + x y' - k(2k - 1) y = 0$, the indicial equation is $2r(r - 1) + r - k(2k - 1) = (2r + 2k - 1)(r - k) = 0$. The larger positive exponent is $r = k$.\n\n> **Watch out.** Expand $2r(r - 1)$ before collecting the $r$ terms. For $2x^{2}y'' + xy' - 3y = 0$: $2r^{2} - 2r + r - 3 = 2r^{2} - r - 3 = (2r - 3)(r + 1)$, so the roots are $\\frac{3}{2}$ and $-1$; writing $2r^{2} + r - 3$ gives the wrong roots $1$ and $-\\frac{3}{2}$.",
          "当指标方程的两个根之差不是整数时，每个根都给出一个独立的级数解。对于方程 $2 x^2 y'' + x y' - k(2k - 1) y = 0$，指标方程为 $2r(r - 1) + r - k(2k - 1) = (2r + 2k - 1)(r - k) = 0$。较大的正指标为 $r = k$。\n\n> **注意。** 先展开 $2r(r - 1)$ 再合并 $r$ 的项。对 $2x^{2}y'' + xy' - 3y = 0$：$2r^{2} - 2r + r - 3 = 2r^{2} - r - 3 = (2r - 3)(r + 1)$，所以根是 $\\frac{3}{2}$ 与 $-1$；若写成 $2r^{2} + r - 3$，会得到错误的根 $1$ 与 $-\\frac{3}{2}$。",
        ),
        generate(rng: Rng): Problem {
          const k = rng.int(2, 35);
          const constTerm = k * (2 * k - 1);
          const ans = k;
          return numberProblem({
            prompt: t(
              `Find the positive exponent $r_1 > 0$ of the primary Frobenius series solution $y_1(x) = x^{r_1} \\sum a_n x^n$ for $2 x^2 y'' + x y' - ${constTerm} y = 0$.`,
              `求微分方程 $2 x^2 y'' + x y' - ${constTerm} y = 0$ 的主弗罗贝尼乌斯级数解 $y_1(x) = x^{r_1} \\sum a_n x^n$ 的正特征指数 $r_1 > 0$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                Q.of(-(2 * k - 1), 2),
                "That is the other root, which is negative; the question asks for the positive one.",
                "这是另一个根，它是负的；题目要的是正根。",
              ),
              why(
                Q.of(2 * k - 1, 2),
                `That flips the sign of the other root: $2r + ${2 * k - 1}$ vanishes at a negative $r$.`,
                `这弄反了另一个根的符号：$2r + ${2 * k - 1}$ 在负的 $r$ 处为零。`,
              ),
              why(constTerm, "That is the constant term of the indicial equation, not a root.", "这是指标方程的常数项，不是根。"),
            ]),
            solution: walked(
              [
                [
                  ["Write the indicial equation", "写出指标方程"],
                  t("The lowest powers of $x$ give", "$x$ 的最低次幂给出"),
                  [`2r(r - 1) + r - ${constTerm} = 2r^2 - r - ${constTerm} = 0`],
                ],
                [["Factor it", "因式分解"], none, [`(r - ${k})(2r + ${2 * k - 1}) = 0`]],
                [
                  ["Pick the positive root", "取正根"],
                  t(
                    `The roots are $${k}$ and $-\\frac{${2 * k - 1}}{2}$, so $r_1 = ${ans}$.`,
                    `两根为 $${k}$ 与 $-\\frac{${2 * k - 1}}{2}$，所以 $r_1 = ${ans}$。`,
                  ),
                ],
              ],
              t(
                `Substituting $y = x^{${k}}$ gives $2 \\cdot ${k} \\cdot ${k - 1} + ${k} - ${constTerm} = ${2 * k * (k - 1) + k} - ${constTerm} = 0$.`,
                `代入 $y = x^{${k}}$ 得 $2 \\cdot ${k} \\cdot ${k - 1} + ${k} - ${constTerm} = ${2 * k * (k - 1) + k} - ${constTerm} = 0$。`,
              ),
            ),
          });
        },
      },
      {
        id: "when-two-frobenius-series-are-guaranteed",
        title: t("When two Frobenius series are guaranteed", "何时保证有两个弗罗贝尼乌斯级数解"),
        explanation: t(
          "Let $r_1 \\ge r_2$ be the indicial roots. If $r_1 - r_2$ is not an integer, both give independent series $x^{r}\\sum a_nx^{n}$. If the roots are equal, or differ by a positive integer, the second solution may need a term $y_1\\ln x$, so two plain series are not guaranteed.\n\nRoots $\\frac{1}{2}$ and $-1$ differ by $\\frac{3}{2}$: two series. Roots $\\frac{3}{2}$ and $-\\frac{1}{2}$ differ by $2$: not guaranteed.\n\n> **Watch out.** Look at the difference of the roots, not at the roots themselves. Roots $\\frac{1}{2}$ and $\\frac{5}{2}$ are both fractions, but they differ by $2$, so two series are not guaranteed; roots $0$ and $-\\frac{1}{2}$ include a negative one, yet they differ by $\\frac{1}{2}$ and give two series.",
          "设指标根为 $r_1 \\ge r_2$。若 $r_1 - r_2$ 不是整数，两者都给出独立的级数 $x^{r}\\sum a_nx^{n}$。若两根相等或相差正整数，第二个解可能需要含 $y_1\\ln x$ 的项，因此不能保证有两个普通级数解。\n\n根 $\\frac{1}{2}$ 与 $-1$ 相差 $\\frac{3}{2}$：有两个级数解。根 $\\frac{3}{2}$ 与 $-\\frac{1}{2}$ 相差 $2$：不能保证。\n\n> **注意。** 要看两根之差，而不是根本身。根 $\\frac{1}{2}$ 与 $\\frac{5}{2}$ 都是分数，但相差 $2$，所以不能保证有两个级数解；根 $0$ 与 $-\\frac{1}{2}$ 中有一个负数，但它们相差 $\\frac{1}{2}$，给出两个级数解。",
        ),
        generate(rng: Rng): Problem {
          const ra = Q.of(rng.int(-5, 7), 2);
          const rb = Q.of(rng.int(-5, 7), 2);
          const r1 = ra.cmp(rb) < 0 ? rb : ra;
          const r2 = ra.cmp(rb) < 0 ? ra : rb;
          const s = r1.add(r2);
          const pr = r1.mul(r2);
          const b = Q.one.sub(s).mul(Q.of(4));
          const c = pr.mul(Q.of(4));
          const diff = r1.sub(r2);
          const guaranteed = !diff.isInteger();
          const term = (k: Q, v: string): string =>
            k.isZero() ? "" : ` ${k.sign() < 0 ? "-" : "+"} ${k.abs().eq(Q.one) && v !== "" ? "" : k.abs().toLatex()}${v}`;
          const factor = (r: Q): string => (r.isZero() ? "r" : `\\left(r${addQ(r.neg())}\\right)`);
          const factored = r1.eq(r2)
            ? r1.isZero()
              ? "4r^{2}"
              : `4${factor(r1)}^{2}`
            : r2.isZero()
              ? `4${factor(r2)}${factor(r1)}`
              : `4${factor(r1)}${factor(r2)}`;
          const indicial = `4r^{2}${term(b.sub(Q.of(4)), "r")}${term(c, "")}`;
          return verdictChoice(rng, {
            prompt: t(
              `Is $4x^{2}y''${term(b, "xy'")}${term(c, "y")} + xy = 0$ guaranteed two linearly independent Frobenius series solutions $x^{r}\\sum a_nx^{n}$ about $x = 0$?`,
              `$4x^{2}y''${term(b, "xy'")}${term(c, "y")} + xy = 0$ 在 $x = 0$ 附近是否保证有两个线性无关的弗罗贝尼乌斯级数解 $x^{r}\\sum a_nx^{n}$？`,
            ),
            holds: guaranteed,
            yes: t("the indicial roots differ by a number that is not an integer", "两个指标根之差不是整数"),
            no: t(
              "the indicial roots are equal or differ by an integer, so the second solution may need a $\\ln x$ term",
              "两个指标根相等或相差整数，第二个解可能需要 $\\ln x$ 项",
            ),
            yesWrong: t("$x = 0$ is a regular singular point", "$x = 0$ 是正则奇点"),
            noWrong: t("one of the indicial roots is negative", "有一个指标根是负数"),
            solution: walked(
              [
                [
                  ["Write the indicial equation", "写出指标方程"],
                  t("The term $xy$ is of higher order and does not enter:", "项 $xy$ 是高阶的，不进入指标方程："),
                  [`4r(r - 1)${term(b, "r")}${term(c, "")} = ${indicial} = 0`],
                ],
                [
                  ["Find the roots", "求根"],
                  t(`The roots are $${r1.toLatex()}$ and $${r2.toLatex()}$:`, `两根为 $${r1.toLatex()}$ 与 $${r2.toLatex()}$：`),
                  [`${indicial} = ${factored}`],
                ],
                [
                  ["Compare the roots", "比较两根"],
                  guaranteed
                    ? t(
                        `Their difference $${diff.toLatex()}$ is not an integer, so each root gives its own series and two are guaranteed.`,
                        `两根之差 $${diff.toLatex()}$ 不是整数，所以每个根各给出一个级数，保证有两个级数解。`,
                      )
                    : t(
                        `Their difference $${diff.toLatex()}$ is an integer, so the second solution may need a $\\ln x$ term and two series are not guaranteed.`,
                        `两根之差 $${diff.toLatex()}$ 是整数，第二个解可能需要 $\\ln x$ 项，所以不能保证有两个级数解。`,
                      ),
                ],
              ],
              t(
                `Doubling the difference, $2 \\cdot ${diff.toLatex()} = ${diff.mul(Q.of(2)).toLatex()}$ is ${guaranteed ? "odd" : "even"}, which is what happens exactly when the difference of two halves ${guaranteed ? "is not" : "is"} an integer.`,
                `把差乘以 $2$，$2 \\cdot ${diff.toLatex()} = ${diff.mul(Q.of(2)).toLatex()}$ 是${guaranteed ? "奇数" : "偶数"}；两个半整数之差${guaranteed ? "不是" : "是"}整数时恰好如此。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 7.23.3 The Modified Euler Method
  {
    id: "the-modified-euler-method",
    title: t("The Modified Euler Method", "改进欧拉法"),
    summary: t(
      "The modified Euler method (Heun's predictor-corrector) averages the slopes at the start and the predicted end of each step and has global error $O(h^2)$.",
      "改进欧拉法（休恩预估-校正法）对步首与预估步末的斜率取平均，全局误差为 $O(h^2)$。",
    ),
    intro: t(
      "Take $y' = y$ with $y(0) = 2$ and $h = 0.5$. The starting slope is $k_1 = 2$, the Euler predictor is $\\tilde{y} = 2 + 0.5 \\cdot 2 = 3$, and the slope there is $k_2 = 3$. The corrected value averages the two slopes: $y_1 = 2 + 0.25(2 + 3) = 3.25$.\n\nCheck: the exact value is $2e^{0.5} \\approx 3.297$. Plain Euler stops at $3$, so averaging the slopes cut the error from about $0.3$ to about $0.05$.\n\nIn this lesson we take steps of the modified Euler method: predict with an Euler step, then correct with the average of the slopes at the two ends.",
      "取 $y' = y$，$y(0) = 2$，$h = 0.5$。起点斜率为 $k_1 = 2$，欧拉预测值为 $\\tilde{y} = 2 + 0.5 \\cdot 2 = 3$，该点的斜率为 $k_2 = 3$。校正值取两个斜率的平均：$y_1 = 2 + 0.25(2 + 3) = 3.25$。\n\n检验：精确值为 $2e^{0.5} \\approx 3.297$。普通欧拉法只得到 $3$，所以对斜率取平均把误差从约 $0.3$ 降到约 $0.05$。\n\n本课我们用改进欧拉法计算：先用欧拉步预测，再用两端斜率的平均值校正。",
    ),
    prerequisites: ["eulers-method-calculating-multiple-steps"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "modified-euler-predictor-corrector-step",
        title: t("Executing one step of the modified Euler method", "执行一步改进欧拉预估-校正计算"),
        explanation: t(
          "The method first predicts the next value with an Euler step, then corrects it by averaging the slopes at the start and at the predicted point. For $y' = 2t$ with $y(0) = y_0$ and step $h = 1$: slope $k_1 = 2(0) = 0$. Predictor $\\tilde{y}_1 = y_0$. Slope $k_2 = 2(1) = 2$. Corrector $y_1 = y_0 + \\frac{1}{2}(0 + 2) = y_0 + 1$.\n\n> **Watch out.** The predictor is not the answer; it only supplies the second slope. For $y' = 2t$ with $y(0) = 5$ and $h = 1$, the predictor is $5$ and the corrected value is $5 + \\frac{1}{2}(0 + 2) = 6$.",
          "这种方法先用欧拉步预测下一个值，再用起点与预测点处斜率的平均值来修正它。对于 $y' = 2t$（初值 $y(0) = y_0$，步长 $h = 1$）：步首斜率 $k_1 = 0$。预估值 $\\tilde{y}_1 = y_0$。步末斜率 $k_2 = 2$。校正值 $y_1 = y_0 + \\frac{1}{2}(0 + 2) = y_0 + 1$。\n\n> **注意。** 预测值不是答案，它只用来给出第二个斜率。对 $y' = 2t$，$y(0) = 5$，$h = 1$，预测值是 $5$，校正值是 $5 + \\frac{1}{2}(0 + 2) = 6$。",
        ),
        generate(rng: Rng): Problem {
          const y0 = rng.int(2, 35);
          const ans = y0 + 1;
          return numberProblem({
            prompt: t(
              `Apply one step of the modified Euler (Heun) method with step size $h = 1$ to approximate $y(1)$ for the IVP $y' = 2t$ with $y(0) = ${y0}$.`,
              `应用步长 $h = 1$ 的改进欧拉（休恩）法对初值问题 $y' = 2t$（$y(0) = ${y0}$）计算一步，求 $y(1)$ 的近似值。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                y0,
                "That is the predictor, the plain Euler value; the corrector still has to be applied.",
                "这是预测值，即普通欧拉法的结果；还要做校正。",
              ),
              why(
                y0 + 2,
                "That adds the sum of the two slopes; the corrector uses their average, $\\frac{h}{2}(k_1 + k_2)$.",
                "这加上了两个斜率之和；校正公式用的是它们的平均 $\\frac{h}{2}(k_1 + k_2)$。",
              ),
              why(1, "That is only the change over the step; it has to be added to $y_0$.", "这只是这一步的增量；还要加上 $y_0$。"),
            ]),
            solution: walked(
              [
                [["Slope at the start", "起点斜率"], none, [`k_1 = f(t_0, y_0) = 2 \\cdot 0 = 0`]],
                [["Predict", "预测"], none, [`\\tilde{y}_1 = y_0 + h k_1 = ${y0} + 1 \\cdot 0 = ${y0}`]],
                [["Slope at the predicted point", "预测点的斜率"], none, [`k_2 = f(t_1, \\tilde{y}_1) = 2 \\cdot 1 = 2`]],
                [["Correct", "校正"], none, [`y_1 = y_0 + \\frac{h}{2}(k_1 + k_2) = ${y0} + \\frac{1}{2}(0 + 2) = ${ans}`]],
              ],
              t(
                `The exact solution $y = t^{2} + ${y0}$ gives $y(1) = ${ans}$ too: the slope $2t$ is a straight line, and averaging its two end values integrates it exactly.`,
                `精确解 $y = t^{2} + ${y0}$ 同样给出 $y(1) = ${ans}$：斜率 $2t$ 是一条直线，取两端值的平均正好把它精确积分。`,
              ),
            ),
          });
        },
      },
      {
        id: "a-heun-step-for-a-linear-equation",
        title: t("A Heun step for a linear equation", "线性方程的休恩一步"),
        explanation: t(
          "One step of the modified Euler (Heun) method from $(t_0, y_0)$ is\n\n$$k_1 = f(t_0, y_0), \\quad \\tilde{y} = y_0 + hk_1, \\quad k_2 = f(t_0 + h, \\tilde{y}), \\quad y_1 = y_0 + \\frac{h}{2}(k_1 + k_2).$$\n\nThe predictor $\\tilde{y}$ is only used to evaluate $k_2$; the answer is the corrected value $y_1$, not $\\tilde{y}$.\n\n> **Watch out.** $k_2$ is evaluated at the new time $t_0 + h$ as well as at $\\tilde{y}$. For $y' = t + y$, $y(0) = 2$, $h = 0.5$: $\\tilde{y} = 3$, $k_2 = 0.5 + 3 = 3.5$ and $y_1 = 2 + 0.25(2 + 3.5) = 3.375$; using $t = 0$ in $k_2$ would give $3.25$.",
          "从 $(t_0, y_0)$ 出发，改进欧拉（休恩）法的一步为\n\n$$k_1 = f(t_0, y_0), \\quad \\tilde{y} = y_0 + hk_1, \\quad k_2 = f(t_0 + h, \\tilde{y}), \\quad y_1 = y_0 + \\frac{h}{2}(k_1 + k_2).$$\n\n预测值 $\\tilde{y}$ 只用来计算 $k_2$；结果是校正值 $y_1$，而不是 $\\tilde{y}$。\n\n> **注意。** $k_2$ 要在新时刻 $t_0 + h$ 和 $\\tilde{y}$ 处计算。对 $y' = t + y$，$y(0) = 2$，$h = 0.5$：$\\tilde{y} = 3$，$k_2 = 0.5 + 3 = 3.5$，$y_1 = 2 + 0.25(2 + 3.5) = 3.375$；若在 $k_2$ 中用 $t = 0$，会得到 $3.25$。",
        ),
        generate(rng: Rng): Problem {
          const h = rng.pick([Q.of(1, 2), Q.of(1, 5), Q.of(1, 10)]);
          const y0 = Q.of(rng.int(1, 9));
          const c = rng.int(1, 4);
          const k1 = y0;
          const pred = y0.add(h.mul(k1));
          const k2 = Q.of(c).mul(h).add(pred);
          const half = h.div(Q.of(2));
          const ans = y0.add(half.mul(k1.add(k2)));
          return numberProblem({
            prompt: t(
              `Apply one step of the modified Euler method with $h = ${dec(h)}$ to $y' = ${co(c)}t + y$, $y(0) = ${y0.toLatex()}$. Find $y_1$.`,
              `用步长 $h = ${dec(h)}$ 的改进欧拉法对 $y' = ${co(c)}t + y$，$y(0) = ${y0.toLatex()}$ 计算一步。求 $y_1$。`,
            ),
            answer: ans,
            form: "decimal",
            mistakes: decimals(ans, [
              why(
                pred,
                "That is the predictor $\\tilde{y}$; it is only used to evaluate $k_2$.",
                "这是预测值 $\\tilde{y}$；它只用来计算 $k_2$。",
              ),
              why(
                y0.add(h.mul(k2)),
                "That uses only the slope $k_2$ at the predicted point; the corrector averages $k_1$ and $k_2$.",
                "这只用了预测点处的斜率 $k_2$；校正公式要对 $k_1$ 与 $k_2$ 取平均。",
              ),
              why(
                y0.add(h.mul(k1.add(k2))),
                "That adds $h$ times the sum of the slopes; the corrector uses $\\frac{h}{2}$.",
                "这加上了 $h$ 乘以斜率之和；校正公式用的是 $\\frac{h}{2}$。",
              ),
            ]),
            solution: walked(
              [
                [["Slope at the start", "起点斜率"], none, [`k_1 = ${c} \\cdot 0 + ${dec(y0)} = ${dec(k1)}`]],
                [["Predict", "预测"], none, [`\\tilde{y} = ${dec(y0)} + ${dec(h)} \\cdot ${dec(k1)} = ${dec(pred)}`]],
                [
                  ["Slope at the new time", "新时刻的斜率"],
                  t(`Evaluate at $t = ${dec(h)}$ and $\\tilde{y}$:`, `在 $t = ${dec(h)}$ 与 $\\tilde{y}$ 处计算：`),
                  [`k_2 = ${c} \\cdot ${dec(h)} + ${dec(pred)} = ${dec(k2)}`],
                ],
                [["Correct", "校正"], none, [`y_1 = ${dec(y0)} + ${dec(half)}(${dec(k1)} + ${dec(k2)}) = ${dec(ans)}`]],
              ],
              t(
                `For this linear equation Heun's step equals the second-order Taylor polynomial $y_0 + hy'(0) + \\frac{h^{2}}{2}y''(0)$ with $y'(0) = ${dec(y0)}$ and $y''(0) = ${c} + y'(0) = ${dec(y0.add(Q.of(c)))}$: $${dec(y0)} + ${dec(h)} \\cdot ${dec(y0)} + ${dec(h.mul(h).div(Q.of(2)))} \\cdot ${dec(y0.add(Q.of(c)))} = ${dec(ans)}$.`,
                `对这个线性方程，休恩一步等于二阶泰勒多项式 $y_0 + hy'(0) + \\frac{h^{2}}{2}y''(0)$，其中 $y'(0) = ${dec(y0)}$，$y''(0) = ${c} + y'(0) = ${dec(y0.add(Q.of(c)))}$：$${dec(y0)} + ${dec(h)} \\cdot ${dec(y0)} + ${dec(h.mul(h).div(Q.of(2)))} \\cdot ${dec(y0.add(Q.of(c)))} = ${dec(ans)}$。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 7.23.4 Euler's Method for Systems of ODEs
  {
    id: "eulers-method-for-systems-of-odes",
    title: t("Euler's Method for Systems of ODEs", "微分方程组的欧拉法"),
    summary: t(
      "Euler's method for systems updates the whole state vector at once: $\\mathbf{x}_{n+1} = \\mathbf{x}_n + h\\mathbf{f}(t_n, \\mathbf{x}_n)$.",
      "方程组的欧拉法同时更新整个状态向量：$\\mathbf{x}_{n+1} = \\mathbf{x}_n + h\\mathbf{f}(t_n, \\mathbf{x}_n)$。",
    ),
    intro: t(
      "Take $x' = y$, $y' = x$ with $x(0) = 2$, $y(0) = 3$ and $h = 0.5$. The slopes at the start are $x' = 3$ and $y' = 2$, so one Euler step gives $x_1 = 2 + 0.5 \\cdot 3 = 3.5$ and $y_1 = 3 + 0.5 \\cdot 2 = 4$.\n\nCheck: in matrix form the step multiplies by $I + hA = \\begin{pmatrix} 1 & 0.5 \\\\ 0.5 & 1 \\end{pmatrix}$, and $\\begin{pmatrix} 2 + 1.5 \\\\ 1 + 3 \\end{pmatrix} = \\begin{pmatrix} 3.5 \\\\ 4 \\end{pmatrix}$.\n\nIn this lesson we apply Euler's method to systems, updating every component at once from the slopes at the current state.",
      "取 $x' = y$，$y' = x$，$x(0) = 2$，$y(0) = 3$，$h = 0.5$。起点处的斜率为 $x' = 3$，$y' = 2$，所以一步欧拉法给出 $x_1 = 2 + 0.5 \\cdot 3 = 3.5$，$y_1 = 3 + 0.5 \\cdot 2 = 4$。\n\n检验：写成矩阵形式，这一步是乘以 $I + hA = \\begin{pmatrix} 1 & 0.5 \\\\ 0.5 & 1 \\end{pmatrix}$，而 $\\begin{pmatrix} 2 + 1.5 \\\\ 1 + 3 \\end{pmatrix} = \\begin{pmatrix} 3.5 \\\\ 4 \\end{pmatrix}$。\n\n本课我们把欧拉法用于方程组，由当前状态处的斜率同时更新所有分量。",
    ),
    prerequisites: ["the-modified-euler-method"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "vector-euler-step-component",
        title: t("Computing a state component after one Euler step", "计算欧拉一步后的状态分量"),
        explanation: t(
          "Euler's method for a system updates every component at once, adding the step size times the corresponding entry of the derivative vector. For $\\mathbf{x}' = A \\mathbf{x}$ with $\\mathbf{x}_0 = \\begin{pmatrix} 0 \\\\ v_0 \\end{pmatrix}$ and $A = \\begin{pmatrix} 0 & 1 \\\\ -1 & 0 \\end{pmatrix}$, $A \\mathbf{x}_0 = \\begin{pmatrix} v_0 \\\\ 0 \\end{pmatrix}$. For $h = 1$, $\\mathbf{x}_1 = \\begin{pmatrix} v_0 \\\\ v_0 \\end{pmatrix}$. The first component is $v_0$.\n\n> **Watch out.** The first component of $A\\mathbf{x}_0$ uses the first row of $A$, not its first column. For $A = \\begin{pmatrix} 2 & 1 \\\\ 3 & 4 \\end{pmatrix}$ and $\\mathbf{x}_0 = \\begin{pmatrix} 2 \\\\ 1 \\end{pmatrix}$ it is $2 \\cdot 2 + 1 \\cdot 1 = 5$, not $2 \\cdot 2 + 3 \\cdot 1 = 7$.",
          "方程组的欧拉法同时更新所有分量，每个分量加上步长乘以导数向量的相应分量。对于系统 $\\mathbf{x}' = A \\mathbf{x}$（初值 $\\mathbf{x}_0 = \\begin{pmatrix} 0 \\\\ v_0 \\end{pmatrix}$，转移矩阵 $A = \\begin{pmatrix} 0 & 1 \\\\ -1 & 0 \\end{pmatrix}$），导数向量为 $A \\mathbf{x}_0 = \\begin{pmatrix} v_0 \\\\ 0 \\end{pmatrix}$。步长 $h = 1$ 时，$\\mathbf{x}_1 = \\begin{pmatrix} v_0 \\\\ v_0 \\end{pmatrix}$，第一分量为 $v_0$。\n\n> **注意。** $A\\mathbf{x}_0$ 的第一分量用的是 $A$ 的第一行，而不是第一列。对 $A = \\begin{pmatrix} 2 & 1 \\\\ 3 & 4 \\end{pmatrix}$，$\\mathbf{x}_0 = \\begin{pmatrix} 2 \\\\ 1 \\end{pmatrix}$，它是 $2 \\cdot 2 + 1 \\cdot 1 = 5$，而不是 $2 \\cdot 2 + 3 \\cdot 1 = 7$。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.nonZero(-3, 4);
          const b = rng.nonZero(-3, 4);
          const c = rng.nonZero(-3, 4);
          const d = rng.nonZero(-3, 4);
          const u = rng.nonZero(-5, 6);
          const v = rng.nonZero(-5, 6);
          const h = rng.pick([Q.of(1, 2), Q.of(1, 4), Q.of(2), Q.of(3)]);
          const slope = a * u + b * v;
          const ans = Q.of(u).add(h.mul(Q.of(slope)));
          const A = `\\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}`;
          const x0 = `\\begin{pmatrix} ${u} \\\\ ${v} \\end{pmatrix}`;
          const row = h.mul(Q.of(a)).add(Q.one);
          return numberProblem({
            prompt: t(
              `Apply one step of Euler's method with step size $h = ${h.toLatex()}$ to the system $\\mathbf{x}' = ${A} \\mathbf{x}$ with initial state $\\mathbf{x}_0 = ${x0}$. Find the first component of the new state $\\mathbf{x}_1$.`,
              `对系统 $\\mathbf{x}' = ${A} \\mathbf{x}$（初值 $\\mathbf{x}_0 = ${x0}$）应用步长 $h = ${h.toLatex()}$ 的欧拉法计算一步。求新状态 $\\mathbf{x}_1$ 的第一分量。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                slope,
                "That is the first component of the slope $A\\mathbf{x}_0$; Euler adds $h$ times it to $u_0$.",
                "这是斜率 $A\\mathbf{x}_0$ 的第一分量；欧拉法要把它乘以 $h$ 再加到 $u_0$ 上。",
              ),
              why(
                h.mul(Q.of(slope)),
                `That is only the change; it has to be added to the starting value $${u}$.`,
                `这只是增量；还要加上初值 $${u}$。`,
              ),
              why(u + slope, `That leaves out the step size $h = ${h.toLatex()}$.`, `这漏掉了步长 $h = ${h.toLatex()}$。`),
              why(
                Q.of(u).add(h.mul(Q.of(a * u + c * v))),
                "That uses the first column of $A$; the first component of $A\\mathbf{x}_0$ comes from the first row.",
                "这用了 $A$ 的第一列；$A\\mathbf{x}_0$ 的第一分量来自第一行。",
              ),
            ]),
            solution: walked(
              [
                [["Write the update", "写出更新公式"], none, [`\\mathbf{x}_1 = \\mathbf{x}_0 + h A \\mathbf{x}_0`]],
                [
                  ["First component of the slope", "斜率的第一分量"],
                  t("Use the first row of $A$:", "用 $A$ 的第一行："),
                  [`${a} \\cdot ${pl(u)} + ${pl(b)} \\cdot ${pl(v)} = ${slope}`],
                ],
                [["Take the step", "迈出一步"], none, [`${u} + ${h.toLatex()} \\cdot ${pl(slope)} = ${ans.toLatex()}`]],
              ],
              t(
                `The first row of $I + hA$ is $\\left(${row.toLatex()},\\ ${h.mul(Q.of(b)).toLatex()}\\right)$, and $${pl(row)} \\cdot ${pl(u)} + ${pl(h.mul(Q.of(b)))} \\cdot ${pl(v)} = ${ans.toLatex()}$.`,
                `$I + hA$ 的第一行是 $\\left(${row.toLatex()},\\ ${h.mul(Q.of(b)).toLatex()}\\right)$，而 $${pl(row)} \\cdot ${pl(u)} + ${pl(h.mul(Q.of(b)))} \\cdot ${pl(v)} = ${ans.toLatex()}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "two-euler-steps-for-a-linear-system",
        title: t("Two Euler steps for a linear system", "线性方程组的两步欧拉法"),
        explanation: t(
          "For $\\mathbf{x}' = A\\mathbf{x}$, each Euler step multiplies the state by $I + hA$:\n\n$$\\mathbf{x}_{n+1} = \\mathbf{x}_n + hA\\mathbf{x}_n.$$\n\nTake the steps one at a time, and use both components of $\\mathbf{x}_1$ when computing $\\mathbf{x}_2$; updating one component and then using the new value for the other is a different (and wrong) scheme.\n\n> **Watch out.** The slope must be recomputed at $\\mathbf{x}_1$. For $x' = -y$, $y' = x$ from $(2, 0)$ with $h = 1$: $\\mathbf{x}_1 = (2, 2)$, and the new slope $(-2, 2)$ gives $\\mathbf{x}_2 = (0, 4)$; reusing the first slope $(0, 2)$ would give $(2, 4)$.",
          "对 $\\mathbf{x}' = A\\mathbf{x}$，每一步欧拉法都把状态乘以 $I + hA$：\n\n$$\\mathbf{x}_{n+1} = \\mathbf{x}_n + hA\\mathbf{x}_n.$$\n\n逐步计算，并在求 $\\mathbf{x}_2$ 时使用 $\\mathbf{x}_1$ 的两个分量；先更新一个分量再用新值更新另一个分量是另一种（错误的）格式。\n\n> **注意。** 斜率必须在 $\\mathbf{x}_1$ 处重新计算。对 $x' = -y$，$y' = x$，从 $(2, 0)$ 出发，$h = 1$：$\\mathbf{x}_1 = (2, 2)$，新斜率 $(-2, 2)$ 给出 $\\mathbf{x}_2 = (0, 4)$；若沿用第一个斜率 $(0, 2)$，会得到 $(2, 4)$。",
        ),
        generate(rng: Rng): Problem {
          const h = rng.pick([Q.of(1, 2), Q.of(1, 10), Q.one]);
          const A = [rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3)].map((v) => Q.of(v));
          const [a = Q.zero, b = Q.zero, c = Q.zero, d = Q.zero] = A;
          const x0 = [Q.of(rng.int(-4, 4) || 1), Q.of(rng.int(-4, 4) || 2)];
          const times = (v: Q[]): Q[] => {
            const [p = Q.zero, q = Q.zero] = v;
            return [a.mul(p).add(b.mul(q)), c.mul(p).add(d.mul(q))];
          };
          const step = (v: Q[]): Q[] => {
            const s = times(v);
            return v.map((x, i) => x.add(h.mul(s[i] ?? Q.zero)));
          };
          const sweep = (v: Q[]): Q[] => {
            const [p = Q.zero, q = Q.zero] = v;
            const p1 = p.add(h.mul(a.mul(p).add(b.mul(q))));
            return [p1, q.add(h.mul(c.mul(p1).add(d.mul(q))))];
          };
          const s0 = times(x0);
          const x1 = step(x0);
          const s1 = times(x1);
          const x2 = step(x1);
          const comp = rng.int(0, 1);
          const at = (v: Q[], i: number): Q => v[i] ?? Q.zero;
          const ans = at(x2, comp);
          const vec = (v: Q[]): string => `\\begin{pmatrix} ${v.map((u) => dec(u)).join(" \\\\ ")} \\end{pmatrix}`;
          const s00 = times(s0);
          return numberProblem({
            prompt: t(
              `Apply two steps of Euler's method with $h = ${dec(h)}$ to $\\mathbf{x}' = \\begin{pmatrix} ${a.toLatex()} & ${b.toLatex()} \\\\ ${c.toLatex()} & ${d.toLatex()} \\end{pmatrix}\\mathbf{x}$, $\\mathbf{x}(0) = ${vec(x0)}$. Find component ${comp + 1} of $\\mathbf{x}_2$.`,
              `用步长 $h = ${dec(h)}$ 的欧拉法对 $\\mathbf{x}' = \\begin{pmatrix} ${a.toLatex()} & ${b.toLatex()} \\\\ ${c.toLatex()} & ${d.toLatex()} \\end{pmatrix}\\mathbf{x}$，$\\mathbf{x}(0) = ${vec(x0)}$ 计算两步。求 $\\mathbf{x}_2$ 的第 ${comp + 1} 个分量。`,
            ),
            answer: ans,
            form: "decimal",
            mistakes: decimals(ans, [
              why(
                at(x1, comp),
                "That is the same component of $\\mathbf{x}_1$, after one step; two steps are asked for.",
                "这是一步之后 $\\mathbf{x}_1$ 的同一分量；题目要求两步。",
              ),
              why(at(x2, 1 - comp), "That is the other component of $\\mathbf{x}_2$.", "这是 $\\mathbf{x}_2$ 的另一个分量。"),
              why(
                at(x0, comp).add(Q.of(2).mul(h).mul(at(s0, comp))),
                "That reuses the first slope $A\\mathbf{x}_0$ for the second step; the slope must be recomputed at $\\mathbf{x}_1$.",
                "这在第二步沿用了第一个斜率 $A\\mathbf{x}_0$；斜率必须在 $\\mathbf{x}_1$ 处重新计算。",
              ),
              why(
                at(sweep(sweep(x0)), comp),
                "That updates the first component and then uses its new value for the second; Euler uses the old state for both.",
                "这先更新第一分量，再用它的新值更新第二分量；欧拉法两个分量都用旧状态。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["First step", "第一步"],
                  t("The slope at $\\mathbf{x}_0$, then the step:", "先求 $\\mathbf{x}_0$ 处的斜率，再迈一步："),
                  [`A\\mathbf{x}_0 = ${vec(s0)}`, `\\mathbf{x}_1 = ${vec(x0)} + ${dec(h)}${vec(s0)} = ${vec(x1)}`],
                ],
                [
                  ["Second step", "第二步"],
                  t("Recompute the slope at $\\mathbf{x}_1$:", "在 $\\mathbf{x}_1$ 处重新计算斜率："),
                  [`A\\mathbf{x}_1 = ${vec(s1)}`, `\\mathbf{x}_2 = ${vec(x1)} + ${dec(h)}${vec(s1)} = ${vec(x2)}`],
                ],
                [
                  ["Read off the component", "读出分量"],
                  t(
                    `Component ${comp + 1} of $\\mathbf{x}_2$ is $${dec(ans)}$.`,
                    `$\\mathbf{x}_2$ 的第 ${comp + 1} 个分量是 $${dec(ans)}$。`,
                  ),
                ],
              ],
              t(
                `Two steps multiply by $(I + hA)^{2} = I + 2hA + h^{2}A^{2}$. With $A^{2}\\mathbf{x}_0 = ${vec(s00)}$, component ${comp + 1} is $${dec(at(x0, comp))} + 2 \\cdot ${dec(h)} \\cdot ${pd(at(s0, comp))} + ${dec(h.mul(h))} \\cdot ${pd(at(s00, comp))} = ${dec(ans)}$.`,
                `两步相当于乘以 $(I + hA)^{2} = I + 2hA + h^{2}A^{2}$。由 $A^{2}\\mathbf{x}_0 = ${vec(s00)}$，第 ${comp + 1} 个分量为 $${dec(at(x0, comp))} + 2 \\cdot ${dec(h)} \\cdot ${pd(at(s0, comp))} + ${dec(h.mul(h))} \\cdot ${pd(at(s00, comp))} = ${dec(ans)}$。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 7.23.5 Euler's Method for Second-Order ODEs
  {
    id: "eulers-method-for-second-order-odes",
    title: t("Euler's Method for Second-Order ODEs", "二阶常微分方程的欧拉法"),
    summary: t(
      "A second-order ODE y'' = f(t, y, y') is converted into a first-order system with position and velocity, updated jointly via Euler's rule.",
      "二阶常微分方程 y'' = f(t, y, y') 转化为关于位置与速度的一阶微分方程组，再利用欧拉法联合更新。",
    ),
    intro: t(
      "Take $y'' = -y$ with $y(0) = 2$, $y'(0) = 3$ and $h = 0.5$. With $v = y'$ the equation becomes $y' = v$, $v' = -y$. One Euler step gives $y_1 = 2 + 0.5 \\cdot 3 = 3.5$ and $v_1 = 3 + 0.5 \\cdot (-2) = 2$.\n\nCheck: the state $(y, v)$ moved from $(2, 3)$ by $0.5$ times the slope vector $(3, -2)$, and $(2, 3) + (1.5, -1) = (3.5, 2)$.\n\nIn this lesson we turn a second-order equation into a system for position and velocity and step both with Euler's method.",
      "取 $y'' = -y$，$y(0) = 2$，$y'(0) = 3$，$h = 0.5$。令 $v = y'$，方程化为 $y' = v$，$v' = -y$。一步欧拉法给出 $y_1 = 2 + 0.5 \\cdot 3 = 3.5$，$v_1 = 3 + 0.5 \\cdot (-2) = 2$。\n\n检验：状态 $(y, v)$ 从 $(2, 3)$ 出发，移动了斜率向量 $(3, -2)$ 的 $0.5$ 倍，而 $(2, 3) + (1.5, -1) = (3.5, 2)$。\n\n本课我们把二阶方程化为关于位置与速度的方程组，并用欧拉法同时推进两者。",
    ),
    prerequisites: ["eulers-method-for-systems-of-odes"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "second-order-euler-position-update",
        title: t("Position update for a second-order ODE under Euler's method", "二阶常微分方程欧拉法下的位置更新"),
        explanation: t(
          "Writing the velocity as a second unknown turns the second order equation into a system, and the position update uses the current velocity as its slope. For $y'' = f(t, y, v)$, setting $y' = v$ gives the Euler position update $y_1 = y_0 + h v_0$. When $y_0 = 0$ and $h = 1$, $y_1 = v_0$.\n\n> **Watch out.** The position moves with the velocity; the acceleration only changes the velocity. For $y'' + 4y = 0$ with $y(0) = 3$, $y'(0) = 2$ and $h = 0.5$: $y_1 = 3 + 0.5 \\cdot 2 = 4$, not $3 + 0.5 \\cdot (-12) = -3$.",
          "把速度作为第二个未知函数，就把二阶方程化为方程组，位置的更新以当前速度作为斜率。令 $y' = v$，二阶微分方程的位置更新公式为 $y_1 = y_0 + h v_0$。当 $y_0 = 0$ 且 $h = 1$ 时，一步后的位置即为 $y_1 = v_0$。\n\n> **注意。** 位置随速度变化；加速度只改变速度。对 $y'' + 4y = 0$，$y(0) = 3$，$y'(0) = 2$，$h = 0.5$：$y_1 = 3 + 0.5 \\cdot 2 = 4$，而不是 $3 + 0.5 \\cdot (-12) = -3$。",
        ),
        generate(rng: Rng): Problem {
          const y0 = rng.nonZero(-6, 8);
          const v0 = rng.nonZero(-9, 9);
          const omegaSq = rng.int(2, 10);
          const h = rng.pick([Q.of(1, 2), Q.of(1, 4), Q.of(2), Q.of(3)]);
          const ans = Q.of(y0).add(h.mul(Q.of(v0)));
          const acc = -omegaSq * y0;
          return numberProblem({
            prompt: t(
              `Apply one step of Euler's method with step size $h = ${h.toLatex()}$ to the oscillator $y'' + ${omegaSq}y = 0$ with initial conditions $y(0) = ${y0}$ and $y'(0) = ${v0}$. Find the estimated position $y_1$.`,
              `对谐振子方程 $y'' + ${omegaSq}y = 0$（初值 $y(0) = ${y0}$ 与 $y'(0) = ${v0}$）应用步长 $h = ${h.toLatex()}$ 的欧拉法计算一步。求估算的位置值 $y_1$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(y0 + v0, `That leaves out the step size $h = ${h.toLatex()}$.`, `这漏掉了步长 $h = ${h.toLatex()}$。`),
              why(
                Q.of(y0).add(h.mul(Q.of(acc))),
                "That moves the position with the acceleration; the position moves with the velocity.",
                "这用加速度推进了位置；位置应随速度推进。",
              ),
              why(
                h.mul(Q.of(v0)),
                `That is only the change in position; it has to be added to $y_0 = ${y0}$.`,
                `这只是位置的增量；还要加上 $y_0 = ${y0}$。`,
              ),
              why(
                Q.of(v0).add(h.mul(Q.of(acc))),
                "That is the new velocity $v_1$, not the new position.",
                "这是新速度 $v_1$，不是新位置。",
              ),
            ]),
            solution: walked(
              [
                [["Write the system", "写成方程组"], t("With $v = y'$:", "令 $v = y'$："), [`y' = v`, `v' = -${omegaSq}y`]],
                [
                  ["Update the position", "更新位置"],
                  t("The slope of $y$ is the current velocity:", "$y$ 的斜率是当前速度："),
                  [`y_1 = y_0 + h v_0`],
                ],
                [["Substitute", "代入"], none, [`y_1 = ${y0} + ${h.toLatex()} \\cdot ${pl(v0)} = ${ans.toLatex()}`]],
              ],
              t(
                `$y_1$ is the tangent-line value $y(0) + hy'(0)$ of the true solution, which is $${ans.toLatex()}$; the acceleration $-${omegaSq} \\cdot ${pl(y0)} = ${acc}$ only enters at the next step, through $v_1$.`,
                `$y_1$ 就是真实解的切线值 $y(0) + hy'(0)$，即 $${ans.toLatex()}$；加速度 $-${omegaSq} \\cdot ${pl(y0)} = ${acc}$ 要到下一步才通过 $v_1$ 起作用。`,
              ),
            ),
          });
        },
      },
      {
        id: "two-euler-steps-for-a-second-order-equation",
        title: t("Two Euler steps for a second-order equation", "二阶方程的两步欧拉法"),
        explanation: t(
          "Write $y'' = f(t, y, y')$ as the system $y' = v$, $v' = f(t, y, v)$ and update both together:\n\n$$y_{n+1} = y_n + hv_n, \\qquad v_{n+1} = v_n + hf(t_n, y_n, v_n).$$\n\nThe second position update uses the new velocity $v_1$, which already includes one step of acceleration.\n\n> **Watch out.** Update the velocity in the first step too, or the second position step goes wrong. For $y'' + y = 0$ with $y(0) = 2$, $y'(0) = 0$ and $h = 0.5$: $y_1 = 2$, $v_1 = -1$ and $y_2 = 2 + 0.5 \\cdot (-1) = 1.5$; keeping $v_0 = 0$ would leave $y_2 = 2$.",
          "把 $y'' = f(t, y, y')$ 写成方程组 $y' = v$，$v' = f(t, y, v)$，并同时更新：\n\n$$y_{n+1} = y_n + hv_n, \\qquad v_{n+1} = v_n + hf(t_n, y_n, v_n).$$\n\n第二次位置更新使用新速度 $v_1$，它已包含一步加速度的作用。\n\n> **注意。** 第一步也要更新速度，否则第二步的位置就会出错。对 $y'' + y = 0$，$y(0) = 2$，$y'(0) = 0$，$h = 0.5$：$y_1 = 2$，$v_1 = -1$，$y_2 = 2 + 0.5 \\cdot (-1) = 1.5$；若一直用 $v_0 = 0$，会得到 $y_2 = 2$。",
        ),
        generate(rng: Rng): Problem {
          const k = rng.int(1, 9);
          const h = rng.pick([Q.of(1, 2), Q.of(1, 10), Q.of(1, 5)]);
          const y0 = Q.of(rng.int(-5, 6) || 3);
          const v0 = Q.of(rng.int(-5, 6));
          const y1 = y0.add(h.mul(v0));
          const v1 = v0.sub(h.mul(Q.of(k)).mul(y0));
          const y2 = y1.add(h.mul(v1));
          return numberProblem({
            prompt: t(
              `Apply two steps of Euler's method with $h = ${dec(h)}$ to $y'' + ${co(k)}y = 0$, $y(0) = ${y0.toLatex()}$, $y'(0) = ${v0.toLatex()}$. Find $y_2$.`,
              `用步长 $h = ${dec(h)}$ 的欧拉法对 $y'' + ${co(k)}y = 0$，$y(0) = ${y0.toLatex()}$，$y'(0) = ${v0.toLatex()}$ 计算两步。求 $y_2$。`,
            ),
            answer: y2,
            form: "decimal",
            mistakes: decimals(y2, [
              why(y1, "That is $y_1$, after one step; two steps are asked for.", "这是一步之后的 $y_1$；题目要求两步。"),
              why(
                y1.add(h.mul(v0)),
                "That keeps the old velocity $v_0$ in the second step; the velocity must be updated to $v_1$.",
                "这在第二步仍用旧速度 $v_0$；速度必须更新为 $v_1$。",
              ),
              why(
                y0.add(Q.of(2).mul(h).mul(v1)),
                "That uses the new velocity $v_1$ for both steps; the first step uses $v_0$.",
                "这两步都用了新速度 $v_1$；第一步应该用 $v_0$。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["First step", "第一步"],
                  t("Update position and velocity from the starting state:", "由初始状态同时更新位置和速度："),
                  [
                    `y_1 = ${dec(y0)} + ${dec(h)} \\cdot ${pd(v0)} = ${dec(y1)}`,
                    `v_1 = ${dec(v0)} - ${dec(h)} \\cdot ${k} \\cdot ${pd(y0)} = ${dec(v1)}`,
                  ],
                ],
                [
                  ["Second step", "第二步"],
                  t("The position now moves with $v_1$:", "现在位置随 $v_1$ 推进："),
                  [`y_2 = y_1 + hv_1 = ${dec(y1)} + ${dec(h)} \\cdot ${pd(v1)} = ${dec(y2)}`],
                ],
              ],
              t(
                `The two steps combine into $y_2 = y_0 + 2hv_0 - h^{2}ky_0 = ${dec(y0)} + 2 \\cdot ${dec(h)} \\cdot ${pd(v0)} - ${dec(h.mul(h))} \\cdot ${k} \\cdot ${pd(y0)} = ${dec(y2)}$.`,
                `两步合起来是 $y_2 = y_0 + 2hv_0 - h^{2}ky_0 = ${dec(y0)} + 2 \\cdot ${dec(h)} \\cdot ${pd(v0)} - ${dec(h.mul(h))} \\cdot ${k} \\cdot ${pd(y0)} = ${dec(y2)}$。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 7.24.1 The RK4 Method
  {
    id: "the-rk4-method",
    title: t("The RK4 Method", "四阶龙格-库塔法（RK4）"),
    summary: t(
      "The classic fourth-order Runge-Kutta method blends four slope evaluations with the weights $\\frac{1}{6}, \\frac{2}{6}, \\frac{2}{6}, \\frac{1}{6}$ and has global error $O(h^4)$.",
      "经典四阶龙格-库塔法以权重 $\\frac{1}{6}, \\frac{2}{6}, \\frac{2}{6}, \\frac{1}{6}$ 组合四个斜率，全局误差为 $O(h^4)$。",
    ),
    intro: t(
      "Take $y' = y$ with $y(0) = 6$ and $h = 1$. The stages are $k_1 = 6$, $k_2 = 6 + \\frac{1}{2} \\cdot 6 = 9$, $k_3 = 6 + \\frac{1}{2} \\cdot 9 = 10.5$ and $k_4 = 6 + 10.5 = 16.5$. Then $y_1 = 6 + \\frac{1}{6}(6 + 18 + 21 + 16.5) = 6 + 10.25 = 16.25$.\n\nCheck: the exact value is $6e \\approx 16.31$, and $6\\left(1 + 1 + \\frac{1}{2} + \\frac{1}{6} + \\frac{1}{24}\\right) = 16.25$, the first five terms of $6e$.\n\nIn this lesson we take steps of the classical fourth-order Runge-Kutta method, which combines four slopes across the step with the weights $1, 2, 2, 1$.",
      "取 $y' = y$，$y(0) = 6$，$h = 1$。各阶段为 $k_1 = 6$，$k_2 = 6 + \\frac{1}{2} \\cdot 6 = 9$，$k_3 = 6 + \\frac{1}{2} \\cdot 9 = 10.5$，$k_4 = 6 + 10.5 = 16.5$。于是 $y_1 = 6 + \\frac{1}{6}(6 + 18 + 21 + 16.5) = 6 + 10.25 = 16.25$。\n\n检验：精确值为 $6e \\approx 16.31$，而 $6\\left(1 + 1 + \\frac{1}{2} + \\frac{1}{6} + \\frac{1}{24}\\right) = 16.25$，正是 $6e$ 展开的前五项。\n\n本课我们用经典四阶龙格-库塔法计算，它以权重 $1, 2, 2, 1$ 组合一步之内的四个斜率。",
    ),
    prerequisites: ["the-modified-euler-method"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "rk4-weighted-average-step",
        title: t("Evaluating the weighted slope average in the RK4 update", "计算 RK4 更新公式中的加权斜率平均"),
        explanation: t(
          "The fourth order method takes a weighted average of four slope estimates, counting the two midpoint slopes twice as heavily as the end slopes. The RK4 update formula is $y_{n+1} = y_n + \\frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)$. For step size $h = 6$, $y_{n+1} = y_n + k_1 + 2k_2 + 2k_3 + k_4$.\n\n> **Watch out.** The weights $1 + 2 + 2 + 1$ add to $6$, so the weighted sum is divided by $6$ before it is multiplied by $h$. For $h = 3$, $y_n = 2$ and slopes $2, 3, 3, 4$: the weighted sum is $2 + 6 + 6 + 4 = 18$, so $y_{n+1} = 2 + \\frac{3}{6} \\cdot 18 = 11$, not $2 + 3 \\cdot 18 = 56$.",
          "四阶方法取四个斜率估计的加权平均，两个中点斜率的权重是端点斜率的两倍。RK4 的步进更新公式为 $y_{n+1} = y_n + \\frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)$。当步长 $h = 6$ 时，更新公式简化为 $y_{n+1} = y_n + k_1 + 2k_2 + 2k_3 + k_4$。\n\n> **注意。** 权重 $1 + 2 + 2 + 1$ 之和为 $6$，所以加权和要先除以 $6$ 再乘以 $h$。对 $h = 3$，$y_n = 2$，斜率 $2, 3, 3, 4$：加权和为 $2 + 6 + 6 + 4 = 18$，所以 $y_{n+1} = 2 + \\frac{3}{6} \\cdot 18 = 11$，而不是 $2 + 3 \\cdot 18 = 56$。",
        ),
        generate(rng: Rng): Problem {
          const y0 = rng.int(2, 25);
          const k1 = rng.int(2, 20);
          const k2 = rng.int(2, 20);
          const k3 = rng.int(2, 20);
          const k4 = rng.int(2, 20);
          const h = rng.pick([6, 3, 2, 12]);
          const sum = k1 + 2 * k2 + 2 * k3 + k4;
          const part = Q.of(h, 6);
          const ans = part.mul(Q.of(sum)).add(Q.of(y0));
          const avg = Q.of(sum, 6);
          return numberProblem({
            prompt: t(
              `In a step of the classical fourth-order Runge-Kutta method (RK4) with step size $h = ${h}$, the current state is $y_0 = ${y0}$ and the four stage slopes are $k_1 = ${k1}$, $k_2 = ${k2}$, $k_3 = ${k3}$, and $k_4 = ${k4}$. Compute the updated state $y_1$.`,
              `在使用经典四阶龙格-库塔法（RK4，步长 $h = ${h}$）计算一步时，当前状态为 $y_0 = ${y0}$，四级斜率分别为 $k_1 = ${k1}$、$k_2 = ${k2}$、$k_3 = ${k3}$ 与 $k_4 = ${k4}$。计算更新后的值 $y_1$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                part.mul(Q.of(k1 + k2 + k3 + k4)).add(Q.of(y0)),
                "That gives all four slopes the weight $1$; the middle two count twice.",
                "这让四个斜率的权重都是 $1$；中间两个要算两次。",
              ),
              why(
                part.mul(Q.of(sum)),
                `That is only the change over the step; it has to be added to $y_0 = ${y0}$.`,
                `这只是这一步的增量；还要加上 $y_0 = ${y0}$。`,
              ),
              why(y0 + h * sum, "That multiplies the weighted sum by $h$ without dividing by $6$.", "这把加权和乘以 $h$，却没有除以 $6$。"),
            ]),
            solution: walked(
              [
                [["Write the update", "写出更新公式"], none, [`y_1 = y_0 + \\frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)`]],
                [["Weighted sum", "加权和"], none, [`${k1} + 2 \\cdot ${k2} + 2 \\cdot ${k3} + ${k4} = ${sum}`]],
                [["Take the step", "迈出一步"], none, [`y_1 = ${y0} + \\frac{${h}}{6} \\cdot ${sum} = ${ans.toLatex()}`]],
              ],
              t(
                `The weighted average slope is $\\frac{${sum}}{6} = ${avg.toLatex()}$, and $${y0} + ${h} \\cdot ${avg.toLatex()} = ${ans.toLatex()}$.`,
                `加权平均斜率为 $\\frac{${sum}}{6} = ${avg.toLatex()}$，而 $${y0} + ${h} \\cdot ${avg.toLatex()} = ${ans.toLatex()}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "a-full-rk4-step-for-exponential-growth",
        title: t("A full RK4 step for exponential growth", "指数增长方程的完整 RK4 一步"),
        explanation: t(
          "For $y' = \\lambda y$ the four stages are\n\n$$k_1 = \\lambda y_0, \\quad k_2 = \\lambda\\left(y_0 + \\tfrac{h}{2}k_1\\right), \\quad k_3 = \\lambda\\left(y_0 + \\tfrac{h}{2}k_2\\right), \\quad k_4 = \\lambda(y_0 + hk_3),$$\n\nand $y_1 = y_0 + \\frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)$. Together they give $y_1 = y_0\\left(1 + z + \\frac{z^{2}}{2} + \\frac{z^{3}}{6} + \\frac{z^{4}}{24}\\right)$ with $z = \\lambda h$: the first five terms of $e^{z}$, which is why the method is fourth order.\n\n> **Watch out.** $k_2$ and $k_3$ use half a step, $k_4$ a full step. For $y' = y$ with $y_0 = 24$ and $h = 1$: $k_1 = 24$ and $k_2 = 24 + \\frac{1}{2} \\cdot 24 = 36$; a full step in $k_2$ would give $48$.",
          "对 $y' = \\lambda y$，四个阶段为\n\n$$k_1 = \\lambda y_0, \\quad k_2 = \\lambda\\left(y_0 + \\tfrac{h}{2}k_1\\right), \\quad k_3 = \\lambda\\left(y_0 + \\tfrac{h}{2}k_2\\right), \\quad k_4 = \\lambda(y_0 + hk_3),$$\n\n且 $y_1 = y_0 + \\frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)$。合起来得 $y_1 = y_0\\left(1 + z + \\frac{z^{2}}{2} + \\frac{z^{3}}{6} + \\frac{z^{4}}{24}\\right)$，其中 $z = \\lambda h$：恰为 $e^{z}$ 的前五项，这就是该方法为四阶的原因。\n\n> **注意。** $k_2$ 与 $k_3$ 用半步，$k_4$ 用整步。对 $y' = y$，$y_0 = 24$，$h = 1$：$k_1 = 24$，$k_2 = 24 + \\frac{1}{2} \\cdot 24 = 36$；若在 $k_2$ 中用整步，会得到 $48$。",
        ),
        generate(rng: Rng): Problem {
          const lamN = rng.pick([-2, -1, 1, 2, 3]);
          const lam = Q.of(lamN);
          const h = rng.pick([Q.of(1, 2), Q.one]);
          const y0 = Q.of(rng.int(1, 6) * 24);
          const half = h.div(Q.of(2));
          const k1 = lam.mul(y0);
          const k2 = lam.mul(y0.add(half.mul(k1)));
          const k3 = lam.mul(y0.add(half.mul(k2)));
          const k4 = lam.mul(y0.add(h.mul(k3)));
          const ans = y0.add(
            h.div(Q.of(6)).mul(
              k1
                .add(k2.mul(Q.of(2)))
                .add(k3.mul(Q.of(2)))
                .add(k4),
            ),
          );
          const z = lam.mul(h);
          const R = Q.one
            .add(z)
            .add(z.pow(2).div(Q.of(2)))
            .add(z.pow(3).div(Q.of(6)))
            .add(z.pow(4).div(Q.of(24)));
          return numberProblem({
            prompt: t(
              `Apply one RK4 step with $h = ${dec(h)}$ to $y' = ${co(lamN)}y$, $y(0) = ${y0.toLatex()}$. Find $y_1$.`,
              `用步长 $h = ${dec(h)}$ 的 RK4 方法对 $y' = ${co(lamN)}y$，$y(0) = ${y0.toLatex()}$ 计算一步。求 $y_1$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                y0.add(h.mul(k1)),
                "That is a single Euler step with $k_1$; RK4 combines all four stages.",
                "这是只用 $k_1$ 的一步欧拉法；RK4 要组合全部四个阶段。",
              ),
              why(
                y0.add(h.div(Q.of(4)).mul(k1.add(k2).add(k3).add(k4))),
                "That averages the four slopes with equal weights; RK4 uses the weights $1, 2, 2, 1$ over $6$.",
                "这对四个斜率取了等权平均；RK4 的权重是 $1, 2, 2, 1$，再除以 $6$。",
              ),
              why(y0.add(h.mul(k4)), "That steps with the last slope $k_4$ alone.", "这只用最后一个斜率 $k_4$ 迈步。"),
            ]),
            solution: walked(
              [
                [
                  ["The four stages", "四个阶段"],
                  t("Half steps for $k_2$ and $k_3$, a full step for $k_4$:", "$k_2$ 与 $k_3$ 用半步，$k_4$ 用整步："),
                  [
                    `k_1 = ${lamN} \\cdot ${y0.toLatex()} = ${k1.toLatex()}`,
                    `k_2 = ${lamN} \\cdot \\left(${y0.toLatex()} + ${dec(half)} \\cdot ${pl(k1)}\\right) = ${k2.toLatex()}`,
                    `k_3 = ${lamN} \\cdot \\left(${y0.toLatex()} + ${dec(half)} \\cdot ${pl(k2)}\\right) = ${k3.toLatex()}`,
                    `k_4 = ${lamN} \\cdot \\left(${y0.toLatex()} + ${dec(h)} \\cdot ${pl(k3)}\\right) = ${k4.toLatex()}`,
                  ],
                ],
                [
                  ["Combine them", "组合"],
                  none,
                  [
                    `y_1 = ${y0.toLatex()} + \\frac{${dec(h)}}{6}\\left(${k1.toLatex()} + 2 \\cdot ${pl(k2)} + 2 \\cdot ${pl(k3)} + ${pl(k4)}\\right) = ${ans.toLatex()}`,
                  ],
                ],
              ],
              t(
                `With $z = \\lambda h = ${z.toLatex()}$, the factor $1 + z + \\frac{z^{2}}{2} + \\frac{z^{3}}{6} + \\frac{z^{4}}{24}$ is $${R.toLatex()}$, and $${y0.toLatex()} \\cdot ${pl(R)} = ${ans.toLatex()}$.`,
                `取 $z = \\lambda h = ${z.toLatex()}$，因子 $1 + z + \\frac{z^{2}}{2} + \\frac{z^{3}}{6} + \\frac{z^{4}}{24}$ 等于 $${R.toLatex()}$，而 $${y0.toLatex()} \\cdot ${pl(R)} = ${ans.toLatex()}$。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 7.24.2 The ABM2 Method
  {
    id: "the-abm2-method",
    title: t("The ABM2 Method", "ABM2 预估-校正法"),
    summary: t(
      "The Adams-Bashforth-Moulton 2 method pairs an explicit 2-step Adams-Bashforth predictor with an implicit Adams-Moulton corrector for efficient multistep integration.",
      "二阶亚当斯-巴什福思-莫尔顿法（ABM2）将显式二步预测公式与隐式校正公式相结合，实现高效的多步数值积分。",
    ),
    intro: t(
      "Take $y_n = 10$, $h = 0.5$, $f_{n-1} = 2$ and $f_n = 3$. The Adams-Bashforth predictor is $y^{(p)} = 10 + 0.25(3 \\cdot 3 - 2) = 11.75$. If the slope at the predicted point is $3.4$, the Adams-Moulton corrector gives $y_{n+1} = 10 + 0.25(3.4 + 3) = 11.6$.\n\nCheck: $\\frac{3f_n - f_{n-1}}{2} = 3 + \\frac{3 - 2}{2} = 3.5$ is the slope extended half a step past $t_n$, and $10 + 0.5 \\cdot 3.5 = 11.75$ is the predictor again.\n\nIn this lesson we take steps of ABM2: predict with slopes already computed at earlier steps, then correct with the slope at the predicted point.",
      "取 $y_n = 10$，$h = 0.5$，$f_{n-1} = 2$，$f_n = 3$。亚当斯-巴什福思预测值为 $y^{(p)} = 10 + 0.25(3 \\cdot 3 - 2) = 11.75$。若预测点处的斜率为 $3.4$，亚当斯-莫尔顿校正给出 $y_{n+1} = 10 + 0.25(3.4 + 3) = 11.6$。\n\n检验：$\\frac{3f_n - f_{n-1}}{2} = 3 + \\frac{3 - 2}{2} = 3.5$ 是把斜率外推到 $t_n$ 之后半步处的值，而 $10 + 0.5 \\cdot 3.5 = 11.75$ 又得到预测值。\n\n本课我们用 ABM2 计算：先用前几步已算出的斜率预测，再用预测点处的斜率校正。",
    ),
    prerequisites: ["the-rk4-method"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "ab2-predictor-formula",
        title: t("Evaluating the Adams-Bashforth two-step predictor", "计算二步亚当斯-巴什福思预测值"),
        explanation: t(
          "A multistep method reuses slopes from earlier steps instead of computing new intermediate ones, extrapolating the trend of the slope forward. The explicit 2-step Adams-Bashforth predictor is $y_{n+1}^{(p)} = y_n + \\frac{h}{2}(3 f_n - f_{n-1})$. For $y_n = 0$, $h = 2$, $f_{n-1} = 1$, and $f_n = a$, $y_{n+1}^{(p)} = 3a - 1$.\n\n> **Watch out.** The weight $3$ belongs to the newer slope $f_n$. For $y_n = 5$, $h = 2$, $f_{n-1} = 2$ and $f_n = 4$: $y^{(p)} = 5 + (12 - 2) = 15$, not $5 + (6 - 4) = 7$.",
          "多步法重复使用前几步的斜率，而不是计算新的中间斜率，把斜率的变化趋势向前外推。二步显式亚当斯-巴什福思预测公式为 $y_{n+1}^{(p)} = y_n + \\frac{h}{2}(3 f_n - f_{n-1})$。当 $y_n = 0$，$h = 2$，$f_{n-1} = 1$，$f_n = a$ 时，预测值为 $y_{n+1}^{(p)} = 3a - 1$。\n\n> **注意。** 权重 $3$ 属于较新的斜率 $f_n$。对 $y_n = 5$，$h = 2$，$f_{n-1} = 2$，$f_n = 4$：$y^{(p)} = 5 + (12 - 2) = 15$，而不是 $5 + (6 - 4) = 7$。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.int(2, 20);
          const b = rng.int(1, 12);
          const y = rng.nonZero(-9, 12);
          const h = rng.pick([1, 2, 4]);
          const inner = 3 * a - b;
          const part = Q.of(h, 2);
          const ans = part.mul(Q.of(inner)).add(Q.of(y));
          const mid = Q.of(inner, 2);
          return numberProblem({
            prompt: t(
              `In the ABM2 multistep method with step size $h = ${h}$, suppose $y_n = ${y}$, previous slope $f_{n-1} = ${b}$, and current slope $f_n = ${a}$. Compute the predicted value $y_{n+1}^{(p)}$ from the Adams-Bashforth 2 predictor.`,
              `在步长 $h = ${h}$ 的 ABM2 多步法中，已知当前值 $y_n = ${y}$，前一步斜率 $f_{n-1} = ${b}$，当前斜率 $f_n = ${a}$。用二步亚当斯-巴什福思预测公式计算预测值 $y_{n+1}^{(p)}$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                part.mul(Q.of(3 * b - a)).add(Q.of(y)),
                "That puts the weight $3$ on the older slope $f_{n-1}$; it belongs to $f_n$.",
                "这把权重 $3$ 给了较旧的斜率 $f_{n-1}$；它应属于 $f_n$。",
              ),
              why(part.mul(Q.of(a - b)).add(Q.of(y)), "That leaves out the weight $3$ on $f_n$.", "这漏掉了 $f_n$ 上的权重 $3$。"),
              why(
                part.mul(Q.of(inner)),
                `That is only the change; it has to be added to $y_n = ${y}$.`,
                `这只是增量；还要加上 $y_n = ${y}$。`,
              ),
              why(y + h * inner, "That multiplies by $h$ instead of $\\frac{h}{2}$.", "这乘的是 $h$，而不是 $\\frac{h}{2}$。"),
            ]),
            solution: walked(
              [
                [["Write the predictor", "写出预测公式"], none, [`y_{n+1}^{(p)} = y_n + \\frac{h}{2}(3 f_n - f_{n-1})`]],
                [["Combine the slopes", "组合斜率"], none, [`3 \\cdot ${a} - ${b} = ${inner}`]],
                [["Take the step", "迈出一步"], none, [`y_{n+1}^{(p)} = ${y} + \\frac{${h}}{2} \\cdot ${pl(inner)} = ${ans.toLatex()}`]],
              ],
              t(
                `The predictor steps with the slope extended half a step past $t_n$: $${a} + \\frac{${a} - ${b}}{2} = ${mid.toLatex()}$, and $${y} + ${h} \\cdot ${pl(mid)} = ${ans.toLatex()}$.`,
                `预测公式用外推到 $t_n$ 之后半步处的斜率迈步：$${a} + \\frac{${a} - ${b}}{2} = ${mid.toLatex()}$，而 $${y} + ${h} \\cdot ${pl(mid)} = ${ans.toLatex()}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-adams-moulton-corrector-step",
        figure: differentialEquationsDrawings1["the-abm2-method#the-adams-moulton-corrector-step"],
        title: t("The Adams-Moulton corrector step", "亚当斯-莫尔顿校正步"),
        explanation: t(
          "ABM2 first predicts with Adams-Bashforth and then corrects with the trapezoidal Adams-Moulton formula, evaluating the slope at the predicted point:\n\n$$y^{(p)} = y_n + \\frac{h}{2}(3f_n - f_{n-1}), \\qquad y_{n+1} = y_n + \\frac{h}{2}\\left(f(t_{n+1}, y^{(p)}) + f_n\\right).$$\n\nThe corrector uses $f_n$ once and the predicted slope once, with equal weights.\n\n> **Watch out.** The corrector pairs the predicted slope with $f_n$, not with $f_{n-1}$. For $y_n = 4$, $h = 0.2$, $f_n = 8$ and a predicted slope of $9$: $y_{n+1} = 4 + 0.1(9 + 8) = 5.7$.",
          "ABM2 先用亚当斯-巴什福思公式预测，再用梯形型的亚当斯-莫尔顿公式校正，在预测点处计算斜率：\n\n$$y^{(p)} = y_n + \\frac{h}{2}(3f_n - f_{n-1}), \\qquad y_{n+1} = y_n + \\frac{h}{2}\\left(f(t_{n+1}, y^{(p)}) + f_n\\right).$$\n\n校正公式以相同权重各使用一次 $f_n$ 和预测斜率。\n\n> **注意。** 校正公式把预测斜率与 $f_n$ 配对，而不是与 $f_{n-1}$ 配对。对 $y_n = 4$，$h = 0.2$，$f_n = 8$，预测斜率为 $9$：$y_{n+1} = 4 + 0.1(9 + 8) = 5.7$。",
        ),
        generate(rng: Rng): Problem {
          const lam = rng.pick([-2, -1, 1, 2]);
          const h = rng.pick([Q.of(1, 2), Q.of(1, 10), Q.of(1, 5)]);
          const yn = Q.of(rng.int(2, 10));
          const fn = Q.of(lam).mul(yn);
          const fp = Q.of(lam * rng.int(1, 9));
          const half = h.div(Q.of(2));
          const pred = yn.add(half.mul(Q.of(3).mul(fn).sub(fp)));
          const fpred = Q.of(lam).mul(pred);
          const ans = yn.add(half.mul(fpred.add(fn)));
          const avg = fpred.add(fn).div(Q.of(2));
          return numberProblem({
            prompt: t(
              `For $y' = ${co(lam)}y$ with $h = ${dec(h)}$, ABM2 has $y_n = ${yn.toLatex()}$, $f_n = ${fn.toLatex()}$ and $f_{n-1} = ${fp.toLatex()}$. Compute the predictor, then the corrected value $y_{n+1}$.`,
              `对 $y' = ${co(lam)}y$，步长 $h = ${dec(h)}$，ABM2 中 $y_n = ${yn.toLatex()}$，$f_n = ${fn.toLatex()}$，$f_{n-1} = ${fp.toLatex()}$。先计算预测值，再求校正值 $y_{n+1}$。`,
            ),
            answer: ans,
            form: "decimal",
            mistakes: decimals(ans, [
              why(pred, "That is the predictor; the corrector still has to be applied.", "这是预测值；还要做校正。"),
              why(
                yn.add(h.mul(fpred)),
                "That steps with the predicted slope alone; the corrector averages it with $f_n$.",
                "这只用预测斜率迈步；校正公式要把它与 $f_n$ 取平均。",
              ),
              why(
                yn.add(half.mul(fpred.add(fp))),
                "That pairs the predicted slope with $f_{n-1}$; the corrector uses $f_n$.",
                "这把预测斜率与 $f_{n-1}$ 配对；校正公式用的是 $f_n$。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Predict", "预测"],
                  none,
                  [`y^{(p)} = ${dec(yn)} + ${dec(half)}\\left(3 \\cdot ${pd(fn)} - ${pd(fp)}\\right) = ${dec(pred)}`],
                ],
                [
                  ["Slope at the predicted point", "预测点的斜率"],
                  none,
                  [`f(t_{n+1}, y^{(p)}) = ${lam} \\cdot ${pd(pred)} = ${dec(fpred)}`],
                ],
                [["Correct", "校正"], none, [`y_{n+1} = ${dec(yn)} + ${dec(half)}\\left(${dec(fpred)} + ${pd(fn)}\\right) = ${dec(ans)}`]],
              ],
              t(
                `The corrector steps with the average of the two slopes, $\\frac{${dec(fpred)} + ${pd(fn)}}{2} = ${dec(avg)}$, and $${dec(yn)} + ${dec(h)} \\cdot ${pd(avg)} = ${dec(ans)}$.`,
                `校正公式用两个斜率的平均迈步，$\\frac{${dec(fpred)} + ${pd(fn)}}{2} = ${dec(avg)}$，而 $${dec(yn)} + ${dec(h)} \\cdot ${pd(avg)} = ${dec(ans)}$。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 7.25.1 The Implicit Euler Method
  {
    id: "the-implicit-euler-method",
    title: t("The Implicit Euler Method", "隐式欧拉法"),
    summary: t(
      "The backward (implicit) Euler scheme $y_{n+1} = y_n + hf(t_{n+1}, y_{n+1})$ evaluates the slope at the new step and is A-stable.",
      "后向（隐式）欧拉格式 $y_{n+1} = y_n + hf(t_{n+1}, y_{n+1})$ 在新时间步计算斜率，具有 A-稳定性，适合刚性方程。",
    ),
    intro: t(
      "Take $y' = -3y$ with $y_0 = 8$ and $h = 1$. Backward Euler puts the unknown into the slope: $y_1 = 8 + 1 \\cdot (-3y_1)$, so $4y_1 = 8$ and $y_1 = 2$.\n\nCheck: $y_1 - y_0 = 2 - 8 = -6$, and $h$ times the slope at the new point is $1 \\cdot (-3 \\cdot 2) = -6$. Explicit Euler would give $8 - 24 = -16$, a sign flip for a decaying solution.\n\nIn this lesson we take steps of the implicit Euler method, which evaluates the slope at the new point and so has to solve an equation for it at every step.",
      "取 $y' = -3y$，$y_0 = 8$，$h = 1$。后向欧拉法把未知量放进斜率：$y_1 = 8 + 1 \\cdot (-3y_1)$，所以 $4y_1 = 8$，$y_1 = 2$。\n\n检验：$y_1 - y_0 = 2 - 8 = -6$，而 $h$ 乘以新点处的斜率为 $1 \\cdot (-3 \\cdot 2) = -6$。显式欧拉法会给出 $8 - 24 = -16$，对衰减的解来说符号都反了。\n\n本课我们用隐式欧拉法计算，它在新点处计算斜率，因此每一步都要解一个关于新值的方程。",
    ),
    prerequisites: ["eulers-method-calculating-multiple-steps"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "implicit-euler-decay-step",
        title: t("One step of implicit Euler on a decay equation", "隐式欧拉法对指数衰减方程的一步求解"),
        explanation: t(
          "The implicit method uses the slope at the new point, which means solving an equation at each step, but it stays stable for large steps on decay problems. For $y' = -\\lambda y$, the implicit Euler update is $y_{n+1} = y_n - h\\lambda y_{n+1} \\implies y_{n+1} = \\frac{y_n}{1 + h\\lambda}$. When $h\\lambda = 1$, $y_{n+1} = y_n / 2$.\n\n> **Watch out.** The slope is taken at $y_{n+1}$, not at $y_n$. For $y' = -y$ with $y_0 = 10$ and $h = 1$: $y_1 = 10 - y_1$ gives $y_1 = 5$; using $y_0$ in the slope gives the explicit value $10 - 10 = 0$.",
          "隐式方法使用新点处的斜率，所以每一步都要解一个方程，但在衰减问题上即使步长很大也保持稳定。对于衰减方程 $y' = -\\lambda y$，隐式欧拉格式为 $y_{n+1} = y_n - h\\lambda y_{n+1} \\implies y_{n+1} = \\frac{y_n}{1 + h\\lambda}$。当 $h\\lambda = 1$ 时，$y_{n+1} = y_n / 2$。\n\n> **注意。** 斜率取在 $y_{n+1}$ 处，而不是 $y_n$ 处。对 $y' = -y$，$y_0 = 10$，$h = 1$：由 $y_1 = 10 - y_1$ 得 $y_1 = 5$；若在斜率中用 $y_0$，得到的是显式值 $10 - 10 = 0$。",
        ),
        generate(rng: Rng): Problem {
          const ans = rng.int(2, 35);
          const yn = 2 * ans;
          return numberProblem({
            prompt: t(
              `Apply one step of the backward (implicit) Euler method with step size $h = 1$ to the decay equation $y' = -y$ with current state $y_0 = ${yn}$. Find $y_1$.`,
              `对衰减方程 $y' = -y$（初值 $y_0 = ${yn}$）应用步长 $h = 1$ 的后向（隐式）欧拉法计算一步。求 $y_1$ 的值。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                0,
                "That is the explicit Euler step, with the slope taken at $y_0$; backward Euler takes it at $y_1$.",
                "这是显式欧拉步，斜率取在 $y_0$ 处；后向欧拉法要取在 $y_1$ 处。",
              ),
              why(
                yn,
                "That leaves the value unchanged; the slope $-y_1$ still has to be included.",
                "这让值保持不变；还要计入斜率 $-y_1$。",
              ),
            ]),
            solution: walked(
              [
                [["Write the implicit step", "写出隐式步"], none, [`y_1 = y_0 + h f(t_1, y_1)`]],
                [
                  ["Substitute the slope", "代入斜率"],
                  t("With $f(t_1, y_1) = -y_1$ and $h = 1$:", "由 $f(t_1, y_1) = -y_1$，$h = 1$："),
                  [`y_1 = ${yn} - 1 \\cdot y_1`, `2y_1 = ${yn}`],
                ],
                [["Solve", "求解"], none, [`y_1 = \\frac{${yn}}{2} = ${ans}`]],
              ],
              t(
                `$y_1 - y_0 = ${ans} - ${yn} = -${ans}$, which is $h$ times the slope at the new point, $1 \\cdot (-${ans})$.`,
                `$y_1 - y_0 = ${ans} - ${yn} = -${ans}$，正是 $h$ 乘以新点处的斜率 $1 \\cdot (-${ans})$。`,
              ),
            ),
          });
        },
      },
      {
        id: "an-implicit-euler-step-with-forcing",
        title: t("An implicit Euler step with forcing", "带强迫项的隐式欧拉一步"),
        explanation: t(
          "Backward Euler evaluates the slope at the new time: $y_{n+1} = y_n + hf(t_{n+1}, y_{n+1})$. For a linear equation $y' = -\\lambda y + ct$ the unknown can be isolated:\n\n$$y_{n+1} = y_n + h(-\\lambda y_{n+1} + ct_{n+1}) \\implies y_{n+1} = \\frac{y_n + hct_{n+1}}{1 + h\\lambda}.$$\n\nUse $t_{n+1}$, not $t_n$, in the forcing term.\n\n> **Watch out.** Both the forcing and the $y$ in the slope are taken at the new step. For $y' = -2y + 4t$ from $t_n = 1$, $y_n = 3$ with $h = 0.5$: $t_{n+1} = 1.5$, so $2y_{n+1} = 3 + 0.5 \\cdot 4 \\cdot 1.5 = 6$ and $y_{n+1} = 3$; using $t_n = 1$ would give $2.5$.",
          "后向欧拉法在新时刻计算斜率：$y_{n+1} = y_n + hf(t_{n+1}, y_{n+1})$。对线性方程 $y' = -\\lambda y + ct$ 可以解出未知量：\n\n$$y_{n+1} = y_n + h(-\\lambda y_{n+1} + ct_{n+1}) \\implies y_{n+1} = \\frac{y_n + hct_{n+1}}{1 + h\\lambda}.$$\n\n强迫项中要用 $t_{n+1}$，而不是 $t_n$。\n\n> **注意。** 斜率中的强迫项和 $y$ 都取在新的一步。对 $y' = -2y + 4t$，从 $t_n = 1$，$y_n = 3$ 出发，$h = 0.5$：$t_{n+1} = 1.5$，所以 $2y_{n+1} = 3 + 0.5 \\cdot 4 \\cdot 1.5 = 6$，$y_{n+1} = 3$；若用 $t_n = 1$，会得到 $2.5$。",
        ),
        generate(rng: Rng): Problem {
          const lam = rng.int(1, 9);
          const c = rng.int(1, 8);
          const h = rng.pick([Q.of(1, 2), Q.one, Q.of(1, 4)]);
          const yn = Q.of(rng.int(1, 20));
          const tn = Q.of(rng.int(0, 3));
          const t1 = tn.add(h);
          const den = Q.one.add(h.mul(Q.of(lam)));
          const force = h.mul(Q.of(c)).mul(t1);
          const num = yn.add(force);
          const ans = num.div(den);
          const frac = `\\frac{${dec(num)}}{${dec(den)}}`;
          const lhs = ans.sub(yn);
          return numberProblem({
            prompt: t(
              `Apply one backward Euler step with $h = ${dec(h)}$ to $y' = -${co(lam)}y + ${co(c)}t$ from $t_n = ${tn.toLatex()}$, $y_n = ${yn.toLatex()}$. Find $y_{n+1}$.`,
              `用步长 $h = ${dec(h)}$ 的后向欧拉法对 $y' = -${co(lam)}y + ${co(c)}t$ 从 $t_n = ${tn.toLatex()}$，$y_n = ${yn.toLatex()}$ 计算一步。求 $y_{n+1}$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                yn.add(h.mul(Q.of(c)).mul(tn)).div(den),
                "That uses $t_n$ in the forcing term; backward Euler takes it at $t_{n+1}$.",
                "这在强迫项中用了 $t_n$；后向欧拉法要取在 $t_{n+1}$ 处。",
              ),
              why(
                yn.add(h.mul(Q.of(c).mul(tn).sub(Q.of(lam).mul(yn)))),
                "That is the explicit Euler step, with the slope taken at $(t_n, y_n)$.",
                "这是显式欧拉步，斜率取在 $(t_n, y_n)$ 处。",
              ),
              why(yn.div(den), "That drops the forcing term $ct$.", "这漏掉了强迫项 $ct$。"),
              why(yn.add(Q.of(c).mul(t1)).div(den), "That leaves the factor $h$ off the forcing term.", "这在强迫项上漏掉了因子 $h$。"),
            ]),
            solution: walked(
              [
                [["The new time", "新时刻"], none, [`t_{n+1} = ${dec(tn)} + ${dec(h)} = ${dec(t1)}`]],
                [
                  ["Write the implicit step", "写出隐式步"],
                  t("Both $y$ and $t$ in the slope are taken at the new step:", "斜率中的 $y$ 与 $t$ 都取在新的一步："),
                  [`y_{n+1} = ${dec(yn)} + ${dec(h)}\\left(-${co(lam)}y_{n+1} + ${c} \\cdot ${dec(t1)}\\right)`],
                ],
                [
                  ["Collect $y_{n+1}$", "合并 $y_{n+1}$"],
                  none,
                  [
                    `${dec(den)}y_{n+1} = ${dec(yn)} + ${dec(force)}`,
                    `y_{n+1} = ${frac === ans.toLatex() ? frac : `${frac} = ${ans.toLatex()}`}`,
                  ],
                ],
              ],
              t(
                `Putting it back: $y_{n+1} - y_n = ${ans.toLatex()} - ${dec(yn)} = ${lhs.toLatex()}$, and the slope term is $${dec(h)}\\left(-${lam} \\cdot ${pl(ans)} + ${c} \\cdot ${dec(t1)}\\right) = ${lhs.toLatex()}$ as well.`,
                `代回去：$y_{n+1} - y_n = ${ans.toLatex()} - ${dec(yn)} = ${lhs.toLatex()}$，而斜率项 $${dec(h)}\\left(-${lam} \\cdot ${pl(ans)} + ${c} \\cdot ${dec(t1)}\\right)$ 也等于 $${lhs.toLatex()}$。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 7.25.2 The Trapezoidal Method
  {
    id: "the-trapezoidal-method",
    title: t("The Trapezoidal Method", "梯形法"),
    summary: t(
      "The implicit trapezoidal method $y_{n+1} = y_n + \\frac{h}{2}(f_n + f_{n+1})$ combines second-order accuracy with A-stability.",
      "隐式梯形法 $y_{n+1} = y_n + \\frac{h}{2}(f_n + f_{n+1})$ 兼具二阶精度与 A-稳定性。",
    ),
    intro: t(
      "Take $y' = -2y$ with $y_0 = 9$ and $h = 0.5$. The trapezoidal step averages the slopes at both ends: $y_1 = 9 + 0.25(-18 - 2y_1)$, so $1.5y_1 = 4.5$ and $y_1 = 3$.\n\nCheck: $y_1 - y_0 = -6$, and $\\frac{h}{2}(f_0 + f_1) = 0.25(-18 - 6) = -6$.\n\nIn this lesson we take steps of the trapezoidal method, an implicit method that averages the slopes at the two ends of each step.",
      "取 $y' = -2y$，$y_0 = 9$，$h = 0.5$。梯形法一步对两端的斜率取平均：$y_1 = 9 + 0.25(-18 - 2y_1)$，所以 $1.5y_1 = 4.5$，$y_1 = 3$。\n\n检验：$y_1 - y_0 = -6$，而 $\\frac{h}{2}(f_0 + f_1) = 0.25(-18 - 6) = -6$。\n\n本课我们用梯形法计算，这是一种对每步两端斜率取平均的隐式方法。",
    ),
    prerequisites: ["the-implicit-euler-method"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "trapezoidal-amplification-denominator",
        title: t("Denominators in the trapezoidal amplification factor", "梯形法增长因子中的分母项计算"),
        explanation: t(
          "The trapezoidal method averages the slopes at both ends of the step, so the amplification factor is a ratio of two linear expressions in the step size. Applying the trapezoidal method to $y' = -\\lambda y$ gives $y_{n+1} = y_n - \\frac{h\\lambda}{2}y_n - \\frac{h\\lambda}{2}y_{n+1} \\implies y_{n+1} = \\frac{1 - z/2}{1 + z/2} y_n$ where $z = h\\lambda$. For $z = 2k$, the denominator is $1 + k$.\n\n> **Watch out.** Only half of the new slope enters, so the denominator is $1 + \\frac{z}{2}$, not $1 + z$. For $z = 6$: $D = 4$ and the factor is $\\frac{-2}{4}$; the $1 + z = 7$ belongs to implicit Euler.",
          "梯形法取步长两端斜率的平均值，所以放大因子是两个关于步长的一次式之比。将梯形法应用于 $y' = -\\lambda y$ 导出 $y_{n+1} = \\frac{1 - z/2}{1 + z/2} y_n$（其中 $z = h\\lambda$）。当 $z = 2k$ 时，分母值为 $1 + k$。\n\n> **注意。** 新斜率只有一半进入，所以分母是 $1 + \\frac{z}{2}$，不是 $1 + z$。对 $z = 6$：$D = 4$，因子为 $\\frac{-2}{4}$；$1 + z = 7$ 是隐式欧拉法的分母。",
        ),
        generate(rng: Rng): Problem {
          const z = rng.int(2, 35);
          const half = Q.of(z, 2);
          const ans = Q.one.add(half);
          const top = Q.one.sub(half);
          return numberProblem({
            prompt: t(
              `The implicit trapezoidal scheme $y_{n+1} = y_n + \\frac{h}{2}(f_n + f_{n+1})$ is applied to the test equation $y' = -\\lambda y$, with $z = \\lambda h$. Collecting terms gives $D\\,y_{n+1} = \\left(1 - \\frac{z}{2}\\right) y_n$. Find $D$ when $z = ${z}$.`,
              `将隐式梯形法 $y_{n+1} = y_n + \\frac{h}{2}(f_n + f_{n+1})$ 应用于试验方程 $y' = -\\lambda y$，记 $z = \\lambda h$。整理得 $D\\,y_{n+1} = \\left(1 - \\frac{z}{2}\\right) y_n$。求 $z = ${z}$ 时的 $D$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                top,
                "That is the numerator $1 - \\frac{z}{2}$, which multiplies $y_n$.",
                "这是分子 $1 - \\frac{z}{2}$，它乘的是 $y_n$。",
              ),
              why(
                Q.of(1 + z),
                "That is $1 + z$, the implicit Euler denominator; the trapezoidal method takes only half of the new slope.",
                "这是 $1 + z$，隐式欧拉法的分母；梯形法只取新斜率的一半。",
              ),
              why(
                half,
                "That leaves out the $y_{n+1}$ on the left side, the $1$ in $1 + \\frac{z}{2}$.",
                "这漏掉了左边的 $y_{n+1}$，即 $1 + \\frac{z}{2}$ 中的 $1$。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Substitute the slopes", "代入斜率"],
                  t(
                    "With $f_n = -\\lambda y_n$ and $f_{n+1} = -\\lambda y_{n+1}$:",
                    "由 $f_n = -\\lambda y_n$，$f_{n+1} = -\\lambda y_{n+1}$：",
                  ),
                  [`y_{n+1} = y_n - \\frac{z}{2} y_n - \\frac{z}{2} y_{n+1}`],
                ],
                [
                  ["Collect $y_{n+1}$", "合并 $y_{n+1}$"],
                  none,
                  [`\\left(1 + \\frac{z}{2}\\right) y_{n+1} = \\left(1 - \\frac{z}{2}\\right) y_n`],
                ],
                [["Substitute $z$", "代入 $z$"], none, [`D = 1 + \\frac{${z}}{2} = ${ans.toLatex()}`]],
              ],
              t(
                `The factor is then $\\frac{${top.toLatex()}}{${ans.toLatex()}}$, and $|${top.toLatex()}| < ${ans.toLatex()}$: the size of the solution shrinks, as the trapezoidal method promises for every $z > 0$.`,
                `于是因子为 $\\frac{${top.toLatex()}}{${ans.toLatex()}}$，且 $|${top.toLatex()}| < ${ans.toLatex()}$：解的大小在减小，这正是梯形法对所有 $z > 0$ 所保证的。`,
              ),
            ),
          });
        },
      },
      {
        id: "a-trapezoidal-step-for-a-forced-decay",
        title: t("A trapezoidal step for a forced decay", "受迫衰减方程的梯形法一步"),
        explanation: t(
          "The trapezoidal rule averages the slopes at both ends: $y_{n+1} = y_n + \\frac{h}{2}\\left(f(y_n) + f(y_{n+1})\\right)$. For $y' = -\\lambda y + c$,\n\n$$\\left(1 + \\frac{h\\lambda}{2}\\right)y_{n+1} = \\left(1 - \\frac{h\\lambda}{2}\\right)y_n + hc.$$\n\nThe constant forcing appears at both ends, so it contributes $\\frac{h}{2}c + \\frac{h}{2}c = hc$.\n\n> **Watch out.** Count the forcing at both ends. For $y' = -2y + 6$ from $y_n = 4$ with $h = 1$: $2y_{n+1} = 0 \\cdot 4 + 6$, so $y_{n+1} = 3$; counting the $6$ only once would give $1.5$.",
          "梯形法对两端的斜率取平均：$y_{n+1} = y_n + \\frac{h}{2}\\left(f(y_n) + f(y_{n+1})\\right)$。对 $y' = -\\lambda y + c$，\n\n$$\\left(1 + \\frac{h\\lambda}{2}\\right)y_{n+1} = \\left(1 - \\frac{h\\lambda}{2}\\right)y_n + hc.$$\n\n常数强迫项在两端都出现，所以贡献 $\\frac{h}{2}c + \\frac{h}{2}c = hc$。\n\n> **注意。** 强迫项在两端都要计入。对 $y' = -2y + 6$，从 $y_n = 4$ 出发，$h = 1$：$2y_{n+1} = 0 \\cdot 4 + 6$，所以 $y_{n+1} = 3$；若只计入一次 $6$，会得到 $1.5$。",
        ),
        generate(rng: Rng): Problem {
          const lam = rng.int(1, 8);
          const c = rng.int(1, 9);
          const h = rng.pick([Q.of(1, 2), Q.one, Q.of(1, 4)]);
          const yn = Q.of(rng.int(1, 20));
          const z = h.mul(Q.of(lam)).div(Q.of(2));
          const hc = h.mul(Q.of(c));
          const num = Q.one.sub(z).mul(yn).add(hc);
          const ans = num.div(Q.one.add(z));
          const lhs = ans.sub(yn);
          const fn = Q.of(c).sub(Q.of(lam).mul(yn));
          const f1 = Q.of(c).sub(Q.of(lam).mul(ans));
          return numberProblem({
            prompt: t(
              `Apply one trapezoidal step with $h = ${dec(h)}$ to $y' = -${co(lam)}y + ${c}$ from $y_n = ${yn.toLatex()}$. Find $y_{n+1}$.`,
              `用步长 $h = ${dec(h)}$ 的梯形法对 $y' = -${co(lam)}y + ${c}$ 从 $y_n = ${yn.toLatex()}$ 计算一步。求 $y_{n+1}$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                Q.one
                  .sub(z)
                  .mul(yn)
                  .add(hc.div(Q.of(2)))
                  .div(Q.one.add(z)),
                "That counts the forcing at one end only; it appears in both slopes, so it contributes $hc$.",
                "这只在一端计入了强迫项；它出现在两个斜率中，所以贡献 $hc$。",
              ),
              why(Q.one.sub(z).mul(yn).div(Q.one.add(z)), "That drops the forcing term.", "这漏掉了强迫项。"),
              why(
                yn.add(hc).sub(h.mul(Q.of(lam)).mul(yn)),
                "That is the explicit Euler step, with the slope taken at $y_n$ only.",
                "这是显式欧拉步，只用了 $y_n$ 处的斜率。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Half the rate times the step", "半步与速率之积"],
                  none,
                  [`\\frac{h\\lambda}{2} = \\frac{${dec(h)} \\cdot ${lam}}{2} = ${z.toLatex()}`],
                ],
                [
                  ["Collect $y_{n+1}$", "合并 $y_{n+1}$"],
                  t("The forcing appears at both ends and adds up to $hc$:", "强迫项在两端都出现，合计为 $hc$："),
                  [
                    `\\left(1 + ${z.toLatex()}\\right)y_{n+1} = \\left(1 - ${z.toLatex()}\\right) \\cdot ${yn.toLatex()} + ${dec(h)} \\cdot ${c} = ${num.toLatex()}`,
                  ],
                ],
                [["Divide", "相除"], none, [`y_{n+1} = \\frac{${num.toLatex()}}{${Q.one.add(z).toLatex()}} = ${ans.toLatex()}`]],
              ],
              t(
                `The slopes at the two ends are $${fn.toLatex()}$ and $${f1.toLatex()}$, and $\\frac{${dec(h)}}{2}\\left(${fn.toLatex()}${addQ(f1)}\\right) = ${lhs.toLatex()}$, which is $y_{n+1} - y_n = ${ans.toLatex()} - ${yn.toLatex()}$.`,
                `两端的斜率为 $${fn.toLatex()}$ 与 $${f1.toLatex()}$，而 $\\frac{${dec(h)}}{2}\\left(${fn.toLatex()}${addQ(f1)}\\right) = ${lhs.toLatex()}$，正是 $y_{n+1} - y_n = ${ans.toLatex()} - ${yn.toLatex()}$。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 7.25.3 Using the Implicit Euler Method With Newton's Method
  {
    id: "using-the-implicit-euler-method-with-newtons-method",
    title: t("Using the Implicit Euler Method With Newton's Method", "结合牛顿迭代法的隐式欧拉法"),
    summary: t(
      "Nonlinear algebraic equations arising from implicit Euler steps are resolved at each time step using Newton-Raphson iteration.",
      "隐式欧拉格式在每一步产生的非线性代数方程通过牛顿-拉弗森迭代法求解。",
    ),
    intro: t(
      "Take $y' = -y^{2}$ with $y_n = 2$ and $h = 0.5$. The backward Euler step must solve $g(y) = y - 2 + 0.5y^{2} = 0$, with $g'(y) = 1 + y$. From the guess $y^{(0)} = 2$: $g(2) = 2$ and $g'(2) = 3$, so $y^{(1)} = 2 - \\frac{2}{3} = \\frac{4}{3}$.\n\nCheck: the exact root is $-1 + \\sqrt{5} \\approx 1.236$, and $g\\left(\\frac{4}{3}\\right) = \\frac{2}{9}$ is already much smaller than $g(2) = 2$.\n\nIn this lesson we solve the equation that an implicit Euler step leads to with Newton's method, starting from the old value as the first guess.",
      "取 $y' = -y^{2}$，$y_n = 2$，$h = 0.5$。后向欧拉一步需解 $g(y) = y - 2 + 0.5y^{2} = 0$，且 $g'(y) = 1 + y$。从猜测值 $y^{(0)} = 2$ 出发：$g(2) = 2$，$g'(2) = 3$，所以 $y^{(1)} = 2 - \\frac{2}{3} = \\frac{4}{3}$。\n\n检验：精确根为 $-1 + \\sqrt{5} \\approx 1.236$，而 $g\\left(\\frac{4}{3}\\right) = \\frac{2}{9}$ 已经远小于 $g(2) = 2$。\n\n本课我们用牛顿法求解隐式欧拉步所导出的方程，以旧值作为初始猜测。",
    ),
    prerequisites: ["the-implicit-euler-method"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "implicit-euler-newton-jacobian",
        title: t("Jacobian evaluation in Newton iteration for implicit Euler", "隐式欧拉牛顿迭代中的雅可比导数值计算"),
        explanation: t(
          "Each implicit step solves an equation for the new value, and Newton's method needs the derivative of that equation with respect to the unknown. For $g(y) = y - y_n - h f(t_{n+1}, y) = 0$, the derivative is $g'(y) = 1 - h f_y(t_{n+1}, y)$. For $f(t, y) = -k y$, $g'(y) = 1 + h k$.\n\n> **Watch out.** The minus sign in front of $hf$ turns a negative $f_y$ into a plus. With $f_y = -5$ and $h = 1$: $g' = 1 - 1 \\cdot (-5) = 6$, not $1 - 5 = -4$.",
          "每一个隐式步都要解关于新值的方程，牛顿法需要这个方程对未知数的导数。定义残差函数 $g(y) = y - y_n - h f(t_{n+1}, y) = 0$，其导数为 $g'(y) = 1 - h f_y(t_{n+1}, y)$。当 $f(t, y) = -k y$ 时，$g'(y) = 1 + h k$。\n\n> **注意。** $hf$ 前面的负号把负的 $f_y$ 变成加号。当 $f_y = -5$，$h = 1$ 时：$g' = 1 - 1 \\cdot (-5) = 6$，而不是 $1 - 5 = -4$。",
        ),
        generate(rng: Rng): Problem {
          const k = rng.int(2, 35);
          const ans = 1 + k;
          return numberProblem({
            prompt: t(
              `In solving the nonlinear equation $g(y) = y - y_n - h f(t_{n+1}, y) = 0$ arising from implicit Euler with step size $h = 1$ and $f(t, y) = -${k}y$, evaluate the Newton iteration derivative $g'(y)$.`,
              `在求解隐式欧拉法步长 $h = 1$、右端项 $f(t, y) = -${k}y$ 对应的非线性残差方程 $g(y) = y - y_n - h f(t_{n+1}, y) = 0$ 时，计算牛顿迭代导数 $g'(y)$ 的值。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(1 - k, `That loses the sign: $-h \\cdot (-${k})$ is $+${k}$.`, `这弄错了符号：$-h \\cdot (-${k})$ 等于 $+${k}$。`),
              why(k, "That leaves out the $1$ from differentiating the $y$ in $g$.", "这漏掉了对 $g$ 中的 $y$ 求导得到的 $1$。"),
              why(-k, "That is $f_y$ itself, not the derivative of $g$.", "这是 $f_y$ 本身，不是 $g$ 的导数。"),
            ]),
            solution: walked(
              [
                [["Differentiate the residual", "对残差函数求导"], none, [`g'(y) = 1 - h \\frac{\\partial f}{\\partial y}`]],
                [
                  ["Substitute", "代入"],
                  t(
                    `Here $\\frac{\\partial f}{\\partial y} = -${k}$ and $h = 1$:`,
                    `这里 $\\frac{\\partial f}{\\partial y} = -${k}$，$h = 1$：`,
                  ),
                  [`g'(y) = 1 - 1 \\cdot (-${k}) = ${ans}`],
                ],
              ],
              t(
                `Written out, $g(y) = y - y_n + ${k}y = ${ans}y - y_n$, a straight line in $y$ with slope $${ans}$.`,
                `写开来，$g(y) = y - y_n + ${k}y = ${ans}y - y_n$，是关于 $y$ 的直线，斜率为 $${ans}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "one-newton-iteration-for-a-backward-euler-step",
        title: t("One Newton iteration for a backward Euler step", "后向欧拉步中的一次牛顿迭代"),
        explanation: t(
          "For $y' = -y^{2}$, a backward Euler step must solve $g(y) = y - y_n + hy^{2} = 0$, with $g'(y) = 1 + 2hy$. Starting from the guess $y^{(0)} = y_n$, one Newton iteration gives\n\n$$y^{(1)} = y_n - \\frac{g(y_n)}{g'(y_n)} = y_n - \\frac{hy_n^{2}}{1 + 2hy_n}.$$\n\nIn practice one or two iterations are enough, since $y_n$ is already close to $y_{n+1}$.\n\n> **Watch out.** At the guess $y_n$ the terms $y - y_n$ cancel, so $g(y_n) = hy_n^{2}$, and the derivative of $hy^{2}$ is $2hy$. For $y_n = 2$ and $h = 0.5$: $g(2) = 2$, $g'(2) = 1 + 2 = 3$ and $y^{(1)} = 2 - \\frac{2}{3} = \\frac{4}{3}$; using $g' = 1 + hy = 2$ would give $1$.",
          "对 $y' = -y^{2}$，后向欧拉一步需解 $g(y) = y - y_n + hy^{2} = 0$，且 $g'(y) = 1 + 2hy$。从初始猜测 $y^{(0)} = y_n$ 出发，一次牛顿迭代得\n\n$$y^{(1)} = y_n - \\frac{g(y_n)}{g'(y_n)} = y_n - \\frac{hy_n^{2}}{1 + 2hy_n}.$$\n\n实际中一两次迭代就够了，因为 $y_n$ 已经接近 $y_{n+1}$。\n\n> **注意。** 在猜测值 $y_n$ 处，$y - y_n$ 两项相消，所以 $g(y_n) = hy_n^{2}$，而 $hy^{2}$ 的导数是 $2hy$。对 $y_n = 2$，$h = 0.5$：$g(2) = 2$，$g'(2) = 1 + 2 = 3$，$y^{(1)} = 2 - \\frac{2}{3} = \\frac{4}{3}$；若用 $g' = 1 + hy = 2$，会得到 $1$。",
        ),
        generate(rng: Rng): Problem {
          const h = rng.pick([Q.of(1, 2), Q.of(1, 10), Q.of(1, 4), Q.of(1, 5)]);
          const yn = Q.of(rng.int(1, 8));
          const g = h.mul(yn.pow(2));
          const gp = Q.one.add(Q.of(2).mul(h).mul(yn));
          const delta = g.div(gp);
          const ans = yn.sub(delta);
          const res = h.mul(delta.pow(2));
          const y = yn.toLatex();
          return numberProblem({
            prompt: t(
              `A backward Euler step with $h = ${dec(h)}$ for $y' = -y^{2}$ from $y_n = ${y}$ requires solving $g(y) = y - y_n + hy^{2} = 0$. Perform one Newton iteration from $y^{(0)} = y_n$ to find $y^{(1)}$.`,
              `对 $y' = -y^{2}$ 从 $y_n = ${y}$ 出发、步长 $h = ${dec(h)}$ 的后向欧拉一步需解 $g(y) = y - y_n + hy^{2} = 0$。从 $y^{(0)} = y_n$ 出发做一次牛顿迭代，求 $y^{(1)}$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(yn.sub(g), "That subtracts $g(y_n)$ without dividing by $g'(y_n)$.", "这减去了 $g(y_n)$，却没有除以 $g'(y_n)$。"),
              why(
                yn.sub(g.div(Q.one.add(h.mul(yn)))),
                "That uses $g' = 1 + hy$; the derivative of $hy^{2}$ is $2hy$.",
                "这用了 $g' = 1 + hy$；$hy^{2}$ 的导数是 $2hy$。",
              ),
              why(
                yn.add(delta),
                "That adds the Newton correction; Newton subtracts $\\frac{g}{g'}$.",
                "这加上了牛顿修正量；牛顿法是减去 $\\frac{g}{g'}$。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["The residual at the guess", "猜测值处的残差"],
                  none,
                  [`g(${y}) = ${y} - ${y} + ${dec(h)} \\cdot ${y}^{2} = ${g.toLatex()}`],
                ],
                [["Its derivative", "它的导数"], none, [`g'(${y}) = 1 + 2 \\cdot ${dec(h)} \\cdot ${y} = ${gp.toLatex()}`]],
                [["The Newton update", "牛顿更新"], none, [`y^{(1)} = ${y} - \\frac{${g.toLatex()}}{${gp.toLatex()}} = ${ans.toLatex()}`]],
              ],
              t(
                `For this quadratic $g$, the residual after one step is $h$ times the square of the correction: $g(y^{(1)}) = ${dec(h)} \\cdot ${pl(delta)}^{2} = ${res.toLatex()}$, far smaller than $g(y_n) = ${g.toLatex()}$.`,
                `对这个二次的 $g$，迭代一步后的残差等于 $h$ 乘以修正量的平方：$g(y^{(1)}) = ${dec(h)} \\cdot ${pl(delta)}^{2} = ${res.toLatex()}$，远小于 $g(y_n) = ${g.toLatex()}$。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 7.25.4 Using the Trapezoidal Method With Newton's Method
  {
    id: "using-the-trapezoidal-method-with-newtons-method",
    title: t("Using the Trapezoidal Method With Newton's Method", "结合牛顿迭代法的梯形法"),
    summary: t(
      "For nonlinear ODEs, each trapezoidal step solves $g(y) = y - y_n - \\frac{h}{2}(f_n + f(t_{n+1}, y)) = 0$ by Newton's method.",
      "对非线性方程，梯形法的每一步都用牛顿法求解 $g(y) = y - y_n - \\frac{h}{2}(f_n + f(t_{n+1}, y)) = 0$。",
    ),
    intro: t(
      "Take $y' = -y^{2}$ with $y_n = 2$ and $h = 0.5$. The trapezoidal step must solve $g(y) = y - 2 + 0.25(4 + y^{2}) = 0$, with $g'(y) = 1 + 0.5y$. From $y^{(0)} = 2$: $g(2) = 2$ and $g'(2) = 2$, so $y^{(1)} = 2 - 1 = 1$.\n\nCheck: $g(1) = 1 - 2 + 0.25 \\cdot 5 = 0.25$, much smaller than $g(2) = 2$.\n\nIn this lesson we solve the equation of a trapezoidal step with Newton's method, where only half of the new slope enters the derivative.",
      "取 $y' = -y^{2}$，$y_n = 2$，$h = 0.5$。梯形法一步需解 $g(y) = y - 2 + 0.25(4 + y^{2}) = 0$，且 $g'(y) = 1 + 0.5y$。从 $y^{(0)} = 2$ 出发：$g(2) = 2$，$g'(2) = 2$，所以 $y^{(1)} = 2 - 1 = 1$。\n\n检验：$g(1) = 1 - 2 + 0.25 \\cdot 5 = 0.25$，远小于 $g(2) = 2$。\n\n本课我们用牛顿法求解梯形法一步的方程，其中只有一半的新斜率进入导数。",
    ),
    prerequisites: ["the-trapezoidal-method", "using-the-implicit-euler-method-with-newtons-method"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "trapezoidal-newton-jacobian",
        title: t("Jacobian evaluation in Newton iteration for trapezoidal method", "梯形法牛顿迭代中的导数值计算"),
        explanation: t(
          "The trapezoidal equation contains the slope at the new point with half weight, so its derivative has half the factor that the implicit Euler method has. For $g(y) = y - y_n - \\frac{h}{2}f_n - \\frac{h}{2}f(t_{n+1}, y) = 0$, $g'(y) = 1 - \\frac{h}{2} f_y(t_{n+1}, y)$. For $f_y = -2k$ and $h = 1$, $g'(y) = 1 + k$.\n\n> **Watch out.** The term $\\frac{h}{2}f_n$ is a constant and drops out, and the new slope carries the factor $\\frac{h}{2}$, not $h$. With $f_y = -8$ and $h = 1$: $g' = 1 + 4 = 5$, not the implicit Euler value $1 + 8 = 9$.",
          "梯形法的方程以一半的权重包含新点处的斜率，所以它的导数中的因子是隐式欧拉法的一半。对于残差方程 $g(y) = y - y_n - \\frac{h}{2}f_n - \\frac{h}{2}f(t_{n+1}, y) = 0$，其导数为 $g'(y) = 1 - \\frac{h}{2} f_y(t_{n+1}, y)$。当 $f_y = -2k$ 且 $h = 1$ 时，$g'(y) = 1 + k$。\n\n> **注意。** 项 $\\frac{h}{2}f_n$ 是常数，求导后消失，而新斜率带的因子是 $\\frac{h}{2}$，不是 $h$。当 $f_y = -8$，$h = 1$ 时：$g' = 1 + 4 = 5$，而不是隐式欧拉法的 $1 + 8 = 9$。",
        ),
        generate(rng: Rng): Problem {
          const k = rng.int(2, 35);
          const coeff = 2 * k;
          const ans = 1 + k;
          return numberProblem({
            prompt: t(
              `In the trapezoidal method with step size $h = 1$ applied to an equation where $\\frac{\\partial f}{\\partial y} = -${coeff}$, find the derivative $g'(y)$ of the residual function $g(y) = y - y_n - \\frac{h}{2}f_n - \\frac{h}{2}f(t_{n+1}, y)$.`,
              `对导数满足 $\\frac{\\partial f}{\\partial y} = -${coeff}$ 的方程应用步长 $h = 1$ 的梯形法。计算残差函数 $g(y) = y - y_n - \\frac{h}{2}f_n - \\frac{h}{2}f(t_{n+1}, y)$ 的导数 $g'(y)$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                1 + coeff,
                "That uses the full step $h$; the new slope enters the trapezoidal step with weight $\\frac{h}{2}$.",
                "这用了整步 $h$；新斜率在梯形法中的权重是 $\\frac{h}{2}$。",
              ),
              why(k, "That leaves out the $1$ from differentiating the $y$ in $g$.", "这漏掉了对 $g$ 中的 $y$ 求导得到的 $1$。"),
              why(
                1 - k,
                `That loses the sign: $-\\frac{1}{2} \\cdot (-${coeff})$ is $+${k}$.`,
                `这弄错了符号：$-\\frac{1}{2} \\cdot (-${coeff})$ 等于 $+${k}$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Differentiate the residual", "对残差函数求导"],
                  t("The term $\\frac{h}{2}f_n$ does not depend on $y$:", "项 $\\frac{h}{2}f_n$ 不依赖于 $y$："),
                  [`g'(y) = 1 - \\frac{h}{2} \\frac{\\partial f}{\\partial y}`],
                ],
                [["Substitute", "代入"], none, [`g'(y) = 1 - \\frac{1}{2} \\cdot (-${coeff}) = 1 + ${k} = ${ans}`]],
              ],
              t(
                `Implicit Euler would add the full $${coeff}$ to the $1$; the trapezoidal method adds half of it, $${k}$, and $1 + ${k} = ${ans}$.`,
                `隐式欧拉法会在 $1$ 上加整个 $${coeff}$；梯形法只加它的一半 $${k}$，而 $1 + ${k} = ${ans}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "one-newton-iteration-for-a-trapezoidal-step",
        figure:
          differentialEquationsDrawings1["using-the-trapezoidal-method-with-newtons-method#one-newton-iteration-for-a-trapezoidal-step"],
        title: t("One Newton iteration for a trapezoidal step", "梯形法步中的一次牛顿迭代"),
        explanation: t(
          "For $y' = -y^{2}$ the trapezoidal step solves $g(y) = y - y_n + \\frac{h}{2}(y_n^{2} + y^{2}) = 0$, with $g'(y) = 1 + hy$. From $y^{(0)} = y_n$, $g(y_n) = hy_n^{2}$ and\n\n$$y^{(1)} = y_n - \\frac{hy_n^{2}}{1 + hy_n}.$$\n\nCompared with backward Euler, the derivative has $h$ in place of $2h$, because only half of the new slope enters the step.\n\n> **Watch out.** At the guess both squares are $y_n^{2}$, so $g(y_n) = \\frac{h}{2} \\cdot 2y_n^{2} = hy_n^{2}$, not $\\frac{h}{2}y_n^{2}$. For $y_n = 4$ and $h = 0.25$: $g(4) = 4$, $g'(4) = 2$ and $y^{(1)} = 4 - 2 = 2$.",
          "对 $y' = -y^{2}$，梯形法一步需解 $g(y) = y - y_n + \\frac{h}{2}(y_n^{2} + y^{2}) = 0$，且 $g'(y) = 1 + hy$。从 $y^{(0)} = y_n$ 出发，$g(y_n) = hy_n^{2}$，\n\n$$y^{(1)} = y_n - \\frac{hy_n^{2}}{1 + hy_n}.$$\n\n与后向欧拉法相比，导数中是 $h$ 而不是 $2h$，因为新斜率只有一半进入这一步。\n\n> **注意。** 在猜测值处两个平方都是 $y_n^{2}$，所以 $g(y_n) = \\frac{h}{2} \\cdot 2y_n^{2} = hy_n^{2}$，而不是 $\\frac{h}{2}y_n^{2}$。对 $y_n = 4$，$h = 0.25$：$g(4) = 4$，$g'(4) = 2$，$y^{(1)} = 4 - 2 = 2$。",
        ),
        generate(rng: Rng): Problem {
          const h = rng.pick([Q.of(1, 2), Q.of(1, 10), Q.of(1, 4), Q.of(1, 5)]);
          const yn = Q.of(rng.int(1, 8));
          const g = h.mul(yn.pow(2));
          const gp = Q.one.add(h.mul(yn));
          const delta = g.div(gp);
          const ans = yn.sub(delta);
          const res = h.div(Q.of(2)).mul(delta.pow(2));
          const y = yn.toLatex();
          return numberProblem({
            prompt: t(
              `A trapezoidal step with $h = ${dec(h)}$ for $y' = -y^{2}$ from $y_n = ${y}$ requires solving $g(y) = y - y_n + \\frac{h}{2}(y_n^{2} + y^{2}) = 0$. Perform one Newton iteration from $y^{(0)} = y_n$ to find $y^{(1)}$.`,
              `对 $y' = -y^{2}$ 从 $y_n = ${y}$ 出发、步长 $h = ${dec(h)}$ 的梯形法一步需解 $g(y) = y - y_n + \\frac{h}{2}(y_n^{2} + y^{2}) = 0$。从 $y^{(0)} = y_n$ 出发做一次牛顿迭代，求 $y^{(1)}$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                yn.sub(g.div(Q.one.add(Q.of(2).mul(h).mul(yn)))),
                "That uses the backward Euler derivative $1 + 2hy$; here only half of the new slope enters, so $g' = 1 + hy$.",
                "这用了后向欧拉法的导数 $1 + 2hy$；这里只有一半的新斜率进入，所以 $g' = 1 + hy$。",
              ),
              why(yn.sub(g), "That subtracts $g(y_n)$ without dividing by $g'(y_n)$.", "这减去了 $g(y_n)$，却没有除以 $g'(y_n)$。"),
              why(
                yn.sub(g.div(Q.of(2)).div(gp)),
                "That counts only one of the two squares in $g(y_n)$; at the guess both equal $y_n^{2}$.",
                "这在 $g(y_n)$ 中只算了两个平方中的一个；在猜测值处两者都等于 $y_n^{2}$。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["The residual at the guess", "猜测值处的残差"],
                  none,
                  [`g(${y}) = \\frac{${dec(h)}}{2}\\left(${y}^{2} + ${y}^{2}\\right) = ${g.toLatex()}`],
                ],
                [["Its derivative", "它的导数"], none, [`g'(${y}) = 1 + ${dec(h)} \\cdot ${y} = ${gp.toLatex()}`]],
                [["The Newton update", "牛顿更新"], none, [`y^{(1)} = ${y} - \\frac{${g.toLatex()}}{${gp.toLatex()}} = ${ans.toLatex()}`]],
              ],
              t(
                `For this quadratic $g$, the residual after one step is $\\frac{h}{2}$ times the square of the correction: $g(y^{(1)}) = \\frac{${dec(h)}}{2} \\cdot ${pl(delta)}^{2} = ${res.toLatex()}$, far smaller than $g(y_n) = ${g.toLatex()}$.`,
                `对这个二次的 $g$，迭代一步后的残差等于 $\\frac{h}{2}$ 乘以修正量的平方：$g(y^{(1)}) = \\frac{${dec(h)}}{2} \\cdot ${pl(delta)}^{2} = ${res.toLatex()}$，远小于 $g(y_n) = ${g.toLatex()}$。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 7.26.2 Error in Numerical Methods
  {
    id: "error-in-numerical-methods",
    title: t("Error in Numerical Methods", "数值方法的误差分析"),
    summary: t(
      "Local truncation error is the error of one step, $O(h^{p+1})$; global error accumulates over $N = \\frac{T - t_0}{h}$ steps to $O(h^p)$.",
      "局部截断误差是单步误差 $O(h^{p+1})$；全局误差经 $N = \\frac{T - t_0}{h}$ 步累积为 $O(h^p)$。",
    ),
    intro: t(
      "Euler's method has local error about $Ch^{2}$ per step. With $h = 0.1$ on $[0, 2]$ it takes $20$ steps, so the errors add up to about $20 \\cdot C \\cdot 0.01 = 0.2C$, which is $2Ch$: the global error is $O(h)$.\n\nCheck: with $h = 0.05$ there are $40$ steps of error $C \\cdot 0.0025$, a total of $0.1C$, half as much, as an error proportional to $h$ should be.\n\nIn this lesson we separate the error of one step from the error accumulated over a whole interval, and see why the global order is one less than the local one.",
      "欧拉法每一步的局部误差约为 $Ch^{2}$。取 $h = 0.1$，在 $[0, 2]$ 上要走 $20$ 步，所以误差累积约为 $20 \\cdot C \\cdot 0.01 = 0.2C$，即 $2Ch$：全局误差是 $O(h)$。\n\n检验：取 $h = 0.05$ 时有 $40$ 步，每步误差 $C \\cdot 0.0025$，合计 $0.1C$，恰为一半，正符合误差与 $h$ 成正比。\n\n本课我们区分单步误差与整个区间上累积的误差，并看到为什么全局阶数比局部阶数低一。",
    ),
    prerequisites: ["big-o-notation"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "local-vs-global-error-order",
        title: t("Global error order from local truncation error order", "由局部截断误差阶确定全局误差阶"),
        explanation: t(
          "If the local truncation error of a numerical method is $O(h^{k+1})$, the global accumulated error over a fixed integration interval is $O(h^k)$.\n\n> **Watch out.** The number of steps $N = \\frac{T - t_0}{h}$ grows as $h$ shrinks, and it costs one power of $h$. A local error $O(h^{5})$ gives the global error $O(h^{4})$, not $O(h^{5})$.",
          "若数值方法的局部截断误差为 $O(h^{k+1})$，则在固定积分区间内累积的全局误差阶次为 $O(h^k)$。\n\n> **注意。** 步数 $N = \\frac{T - t_0}{h}$ 随 $h$ 减小而增大，这会抵掉 $h$ 的一次幂。局部误差 $O(h^{5})$ 给出全局误差 $O(h^{4})$，而不是 $O(h^{5})$。",
        ),
        generate(rng: Rng): Problem {
          const k = rng.int(2, 35);
          const localOrder = k + 1;
          const ans = k;
          return numberProblem({
            prompt: t(
              `A numerical integration scheme has local truncation error $O(h^{${localOrder}})$. What is the order of its global accumulated error over a fixed finite interval?`,
              `某数值积分算法的单步局部截断误差为 $O(h^{${localOrder}})$。求该算法在固定有限区间上的全局累积误差阶次。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                localOrder,
                "That is the local order; adding up the errors of all the steps costs one power of $h$.",
                "这是局部阶数；把所有步的误差加起来会抵掉 $h$ 的一次幂。",
              ),
              why(
                localOrder + 1,
                "That adds a power instead of losing one; the number of steps is $O(h^{-1})$.",
                "这多加了一次幂，而不是减去一次；步数是 $O(h^{-1})$。",
              ),
              why(
                ans - 1,
                "That loses two powers; only the one factor $N = O(h^{-1})$ is involved.",
                "这减去了两次幂；只涉及一个因子 $N = O(h^{-1})$。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Count the steps", "数步数"],
                  t("Over a fixed interval $[t_0, T]$:", "在固定区间 $[t_0, T]$ 上："),
                  [`N = \\frac{T - t_0}{h} = O(h^{-1})`],
                ],
                [
                  ["Add up the local errors", "累加局部误差"],
                  none,
                  [`E_{\\text{global}} \\approx N \\cdot O(h^{${localOrder}}) = O(h^{-1}) \\cdot O(h^{${localOrder}}) = O(h^{${ans}})`],
                ],
                [["Read off the order", "读出阶数"], t(`The global order is $${ans}$.`, `全局阶数为 $${ans}$。`)],
              ],
              t(
                `Halving $h$ doubles the number of steps and divides each local error by $2^{${localOrder}}$, so the total is divided by $2^{${localOrder}} \\div 2 = 2^{${ans}}$.`,
                `把 $h$ 减半，步数加倍，每步局部误差除以 $2^{${localOrder}}$，所以总误差除以 $2^{${localOrder}} \\div 2 = 2^{${ans}}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-global-error-of-euler-on-a-linear-slope",
        title: t("The global error of Euler's method on a linear slope", "欧拉法在线性斜率上的整体误差"),
        explanation: t(
          "For $y' = ct$, $y(0) = 0$ the exact solution is $\\frac{c}{2}t^{2}$. Euler's method uses the slope at the left end of each step, so after $N$ steps of size $h$ it gives\n\n$$y_N = h\\sum_{n=0}^{N-1}c\\,nh = \\frac{c}{2}h^{2}N(N - 1).$$\n\nWith $T = Nh$ the error is $\\frac{c}{2}T^{2} - y_N = \\frac{c}{2}hT$: proportional to $h$, as a first-order method should be.\n\n> **Watch out.** The error is the exact value minus Euler's value, not Euler's value itself. For $y' = 4t$ with $h = 0.5$ up to $T = 2$: $y(2) = 8$, $y_N = 2 \\cdot 0.25 \\cdot 4 \\cdot 3 = 6$, so the error is $2$, which is $\\frac{4}{2} \\cdot 0.5 \\cdot 2$.",
          "对 $y' = ct$，$y(0) = 0$，精确解为 $\\frac{c}{2}t^{2}$。欧拉法在每一步使用左端点处的斜率，所以步长为 $h$ 的 $N$ 步之后得\n\n$$y_N = h\\sum_{n=0}^{N-1}c\\,nh = \\frac{c}{2}h^{2}N(N - 1).$$\n\n令 $T = Nh$，误差为 $\\frac{c}{2}T^{2} - y_N = \\frac{c}{2}hT$：与 $h$ 成正比，符合一阶方法的特点。\n\n> **注意。** 误差是精确值减去欧拉值，而不是欧拉值本身。对 $y' = 4t$，$h = 0.5$，直到 $T = 2$：$y(2) = 8$，$y_N = 2 \\cdot 0.25 \\cdot 4 \\cdot 3 = 6$，所以误差为 $2$，正是 $\\frac{4}{2} \\cdot 0.5 \\cdot 2$。",
        ),
        generate(rng: Rng): Problem {
          const c = rng.int(1, 8);
          const h = rng.pick([Q.of(1, 2), Q.of(1, 10), Q.of(1, 5), Q.of(1, 4)]);
          const T = Q.of(rng.int(1, 4));
          const n = T.div(h);
          const half = Q.of(c, 2);
          const exact = half.mul(T.pow(2));
          const approx = half.mul(h.pow(2)).mul(n).mul(n.sub(Q.one));
          const ans = exact.sub(approx);
          return numberProblem({
            prompt: t(
              `Euler's method with $h = ${dec(h)}$ is applied to $y' = ${co(c)}t$, $y(0) = 0$ up to $t = ${T.toLatex()}$. Find the global error $y(${T.toLatex()}) - y_N$.`,
              `用步长 $h = ${dec(h)}$ 的欧拉法求解 $y' = ${co(c)}t$，$y(0) = 0$，直到 $t = ${T.toLatex()}$。求整体误差 $y(${T.toLatex()}) - y_N$。`,
            ),
            answer: ans,
            form: "decimal",
            mistakes: decimals(ans, [
              why(
                ans.mul(Q.of(2)),
                "That leaves out the $\\frac{1}{2}$ in $\\frac{c}{2}hT$.",
                "这漏掉了 $\\frac{c}{2}hT$ 中的 $\\frac{1}{2}$。",
              ),
              why(
                half.mul(h.pow(2)),
                "That is the error of a single step; the errors of all the steps add up.",
                "这是单独一步的误差；所有步的误差要加起来。",
              ),
              why(approx, "That is Euler's value $y_N$, not the error.", "这是欧拉值 $y_N$，不是误差。"),
            ]),
            solution: walked(
              [
                [
                  ["Count the steps and the exact value", "步数与精确值"],
                  none,
                  [
                    `N = \\frac{${T.toLatex()}}{${dec(h)}} = ${n.toLatex()}`,
                    `y(${T.toLatex()}) = ${half.toLatex()} \\cdot ${T.toLatex()}^{2} = ${dec(exact)}`,
                  ],
                ],
                [
                  ["Euler's value", "欧拉值"],
                  t("Each step uses the slope at its left end:", "每一步都用左端点的斜率："),
                  [
                    `y_N = \\frac{c}{2}h^{2}N(N - 1) = ${half.toLatex()} \\cdot ${dec(h)}^{2} \\cdot ${n.toLatex()} \\cdot ${n.sub(Q.one).toLatex()} = ${dec(approx)}`,
                  ],
                ],
                [["Subtract", "相减"], none, [`${dec(exact)} - ${dec(approx)} = ${dec(ans)}`]],
              ],
              t(
                `The formula $\\frac{c}{2}hT$ gives $\\frac{${c} \\cdot ${dec(h)} \\cdot ${T.toLatex()}}{2} = ${dec(ans)}$ as well.`,
                `公式 $\\frac{c}{2}hT$ 同样给出 $\\frac{${c} \\cdot ${dec(h)} \\cdot ${T.toLatex()}}{2} = ${dec(ans)}$。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 7.26.3 Order of Numerical Methods
  {
    id: "order-of-numerical-methods",
    title: t("Order of Numerical Methods", "数值方法的收敛阶"),
    summary: t(
      "A method has order $p$ if its global error satisfies $E(h) \\le Ch^p$ as the step size $h \\to 0$.",
      "若全局误差满足 $E(h) \\le Ch^p$（步长 $h \\to 0$），则称该方法为 $p$ 阶方法。",
    ),
    intro: t(
      "A method gives global error $0.08$ with step $h$ and $0.02$ with step $\\frac{h}{2}$. The ratio is $\\frac{0.08}{0.02} = 4 = 2^{2}$, so the method has order $2$.\n\nCheck: halving the step once more should divide the error by $4$ again, to about $0.005$; a first-order method would only halve it.\n\nIn this lesson we use the order of a method to predict how its error shrinks with the step, and estimate the order from errors measured at two steps.",
      "某方法在步长为 $h$ 时整体误差为 $0.08$，步长为 $\\frac{h}{2}$ 时为 $0.02$。比值为 $\\frac{0.08}{0.02} = 4 = 2^{2}$，所以该方法是二阶的。\n\n检验：再把步长减半，误差应再除以 $4$，约为 $0.005$；一阶方法只会使它减半。\n\n本课我们用方法的阶数预测误差随步长缩小的情况，并由两个步长下测得的误差估计阶数。",
    ),
    prerequisites: ["error-in-numerical-methods"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "order-convergence-ratio",
        title: t("Error reduction factor under step size refinement for second-order methods", "二阶方法在步长细化下的误差缩减倍数"),
        explanation: t(
          "For a numerical method of convergence order $p = 2$, dividing the step size by $M$ scales the global error bound by $\\left(\\frac{1}{M}\\right)^2$, shrinking it by a factor of $M^2$.\n\n> **Watch out.** The factor is $M^{2}$, a power, not $2M$. Dividing the step by $3$ in a second-order method shrinks the error $9$ times, not $6$ times.",
          "对于收敛阶为 $p = 2$ 的二阶数值算法，将步长缩减至原来的 $1/M$ 会使全局误差界缩小至原来的 $(1/M)^2$，即误差减小 $M^2$ 倍。\n\n> **注意。** 倍数是 $M^{2}$，是幂而不是 $2M$。二阶方法把步长除以 $3$，误差缩小 $9$ 倍，而不是 $6$ 倍。",
        ),
        generate(rng: Rng): Problem {
          const M = rng.int(2, 35);
          const ans = M * M;
          return numberProblem({
            prompt: t(
              `A second-order numerical integration method ($p = 2$) has global error scaling as $E(h) = C h^2$. By what factor does the global error decrease when the step size $h$ is divided by ${M}?`,
              `某二阶数值算法（$p = 2$）的全局误差满足 $E(h) = C h^2$。当计算步长 $h$ 缩小为原来的 $1/${M}$ 时，全局误差将减小多少倍？`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                M,
                "That is the factor for a first-order method; the error here goes with $h^{2}$.",
                "这是一阶方法的倍数；这里的误差与 $h^{2}$ 成正比。",
              ),
              why(
                2 * M,
                `That multiplies by the order; the factor is $${M}$ raised to the order.`,
                `这是乘以阶数；倍数应是 $${M}$ 的阶数次幂。`,
              ),
              why(M * M * M, "That is the factor for a third-order method.", "这是三阶方法的倍数。"),
            ]),
            solution: walked(
              [
                [["Write the error", "写出误差"], none, [`E(h) = C h^2`]],
                [
                  ["Divide the step", "缩小步长"],
                  none,
                  [`E\\left(\\frac{h}{${M}}\\right) = C \\left(\\frac{h}{${M}}\\right)^2 = \\frac{E(h)}{${M}^2}`],
                ],
                [["Read off the factor", "读出倍数"], none, [`${M}^2 = ${ans}`]],
              ],
              t(
                `With $h = ${M}$, $E = ${ans}C$; with $h = 1$, $E = C$. The ratio is $${ans}$.`,
                `取 $h = ${M}$，$E = ${ans}C$；取 $h = 1$，$E = C$。比值为 $${ans}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "estimating-the-order-from-two-errors",
        title: t("Estimating the order from two errors", "由两个误差估计阶数"),
        explanation: t(
          "If $E(h) \\approx Ch^{p}$, halving the step divides the error by $2^{p}$, so\n\n$$p \\approx \\log_2\\frac{E(h)}{E(h/2)}.$$\n\nFor errors $0.048$ and $0.006$ the ratio is $8 = 2^{3}$, so the method is third order. The ratio itself is not the order; take its logarithm in the base by which the step was divided.\n\n> **Watch out.** Divide the larger error by the smaller one, and use the base by which the step was divided. Errors $0.5$ with step $h$ and $0.005$ with step $\\frac{h}{10}$ give the ratio $100 = 10^{2}$, so $p = 2$; $\\log_2 100$ would be wrong here.",
          "若 $E(h) \\approx Ch^{p}$，步长减半会使误差除以 $2^{p}$，所以\n\n$$p \\approx \\log_2\\frac{E(h)}{E(h/2)}.$$\n\n若误差为 $0.048$ 与 $0.006$，比值为 $8 = 2^{3}$，所以方法是三阶的。比值本身不是阶数；要以步长缩小的倍数为底取对数。\n\n> **注意。** 用较大的误差除以较小的误差，并以步长缩小的倍数为底。步长为 $h$ 时误差 $0.5$，步长为 $\\frac{h}{10}$ 时误差 $0.005$，比值为 $100 = 10^{2}$，所以 $p = 2$；这里用 $\\log_2 100$ 是错的。",
        ),
        generate(rng: Rng): Problem {
          const p = rng.int(1, 4);
          const base = rng.pick([2, 10]);
          const e2 = Q.of(rng.int(1, 9), 10 ** rng.int(3, 5));
          const e1 = e2.mul(Q.of(base ** p));
          const ratio = base ** p;
          const power = p === 1 ? "" : ` = ${base}^{${p}}`;
          return numberProblem({
            prompt: t(
              `A method gives global error $${dec(e1)}$ with step $h$ and $${dec(e2)}$ with step $\\frac{h}{${base}}$. Estimate its order $p$.`,
              `某方法在步长为 $h$ 时整体误差为 $${dec(e1)}$，步长为 $\\frac{h}{${base}}$ 时为 $${dec(e2)}$。估计它的阶数 $p$。`,
            ),
            answer: p,
            mistakes: apart(p, [
              why(
                ratio,
                `That is the ratio of the errors; the order is the power of $${base}$ that gives it.`,
                `这是误差之比；阶数是得到它的 $${base}$ 的幂次。`,
              ),
              why(
                -p,
                "That divides the smaller error by the larger one; the error shrinks with the step, so the order is positive.",
                "这用较小的误差除以较大的误差；误差随步长减小，所以阶数是正的。",
              ),
            ]),
            solution: walked(
              [
                [["The ratio of the errors", "误差之比"], none, [`\\frac{${dec(e1)}}{${dec(e2)}} = ${ratio}${power}`]],
                [
                  ["Take the logarithm", "取对数"],
                  t(`The step was divided by $${base}$, so use base $${base}$:`, `步长除以了 $${base}$，所以以 $${base}$ 为底：`),
                  [`p = \\log_{${base}} ${ratio} = ${p}`],
                ],
              ],
              t(
                `An order-$${p}$ method divides the error by $${ratio}$ when the step is divided by $${base}$, and $${dec(e2)} \\cdot ${ratio} = ${dec(e1)}$.`,
                `$${p}$ 阶方法在步长除以 $${base}$ 时误差除以 $${ratio}$，而 $${dec(e2)} \\cdot ${ratio} = ${dec(e1)}$。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 7.26.4 Stability of Numerical Methods
  {
    id: "stability-of-numerical-methods",
    title: t("Stability of Numerical Methods", "数值方法的稳定性"),
    summary: t(
      "Stability analysis examines whether numerical perturbations remain bounded: explicit Euler requires h lambda <= 2 on y' = -lambda y, while implicit methods offer unconditional stability.",
      "稳定性分析研究数值扰动是否保持有界：显式欧拉法在试验方程 y' = -lambda y 上要求步长满足 h lambda <= 2，而隐式方法提供无条件稳定性。",
    ),
    intro: t(
      "Take $y' = -10y$ with explicit Euler. Each step multiplies by $R = 1 - 10h$. With $h = 0.3$, $R = -2$ and $|R| = 2$, so the numbers grow; with $h = 0.1$, $R = 0$. Stability needs $|1 - 10h| \\le 1$, that is $h \\le 0.2$.\n\nCheck: with $h = 0.3$ from $y_0 = 3$ the values are $-6$, $12$, $-24$, growing and flipping sign, while the exact solution $3e^{-10t}$ decays.\n\nIn this lesson we find the factor by which a method multiplies the solution of $y' = -\\lambda y$ at each step, and the step sizes for which that factor keeps the numbers bounded.",
      "对 $y' = -10y$ 用显式欧拉法。每一步乘以 $R = 1 - 10h$。取 $h = 0.3$，$R = -2$，$|R| = 2$，数值会增长；取 $h = 0.1$，$R = 0$。稳定要求 $|1 - 10h| \\le 1$，即 $h \\le 0.2$。\n\n检验：取 $h = 0.3$，从 $y_0 = 3$ 出发，数值依次为 $-6$、$12$、$-24$，越来越大且正负交替，而精确解 $3e^{-10t}$ 在衰减。\n\n本课我们求一种方法在 $y' = -\\lambda y$ 上每一步乘以的因子，以及使这个因子保持数值有界的步长。",
    ),
    prerequisites: ["order-of-numerical-methods", "the-implicit-euler-method"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "explicit-euler-stability-limit",
        title: t("Critical decay rate for explicit Euler stability boundary", "显式欧拉法临界稳定衰减率计算"),
        explanation: t(
          "For the test equation $y' = -\\lambda y$, explicit Euler yields amplification factor $R(h\\lambda) = 1 - h\\lambda$. Stability requires $|1 - h\\lambda| \\le 1 \\implies h\\lambda \\le 2$. At stability threshold with step size $h$, $\\lambda_{\\max} = 2 / h$.\n\n> **Watch out.** Take the absolute value: a negative $R$ can still be large. For $h\\lambda = 3$, $R = -2$ and $|R| = 2 > 1$, so the step is unstable even though $R < 1$.",
          "对于试验方程 $y' = -\\lambda y$，显式欧拉法的增长因子为 $R(h\\lambda) = 1 - h\\lambda$。数值稳定性要求 $|1 - h\\lambda| \\le 1 \\implies h\\lambda \\le 2$。对于给定步长 $h$，允许的最大衰减率为 $\\lambda_{\\max} = 2 / h$。\n\n> **注意。** 要取绝对值：负的 $R$ 也可能很大。当 $h\\lambda = 3$ 时，$R = -2$，$|R| = 2 > 1$，所以即使 $R < 1$，这一步也不稳定。",
        ),
        generate(rng: Rng): Problem {
          const lambda = rng.int(2, 18) * 2;
          const h = rng.pick([Q.of(1, 2), Q.of(1, 4), Q.of(1), Q.of(1, 8)]);
          const z = h.mul(Q.of(lambda));
          const R = Q.one.sub(z);
          const ans = R.abs();
          const unstable = ans.sub(Q.one).sign() > 0;
          const within = z.cmp(Q.of(2)) <= 0;
          return numberProblem({
            prompt: t(
              `Explicit Euler with step size $h = ${h.toLatex()}$ is applied to the test equation $y' = -${lambda}y$, so that $y_{n+1} = R\\,y_n$. Find $|R|$.`,
              `用步长 $h = ${h.toLatex()}$ 的显式欧拉法求解试验方程 $y' = -${lambda}y$，于是 $y_{n+1} = R\\,y_n$。求 $|R|$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(z, "That is $z = h\\lambda$; the factor is $1 - z$.", "这是 $z = h\\lambda$；因子是 $1 - z$。"),
              why(
                Q.one.add(z),
                "That adds $z$; the slope $-\\lambda y$ makes the factor $1 - z$.",
                "这加上了 $z$；斜率 $-\\lambda y$ 使因子为 $1 - z$。",
              ),
              why(R, "That is $R$ itself; the question asks for its absolute value.", "这是 $R$ 本身；题目要的是它的绝对值。"),
            ]),
            solution: walked(
              [
                [["Write the factor", "写出因子"], none, [`y_{n+1} = y_n + h(-\\lambda y_n) = (1 - z)y_n, \\quad z = h\\lambda`]],
                [
                  ["Substitute", "代入"],
                  none,
                  [`z = ${h.toLatex()} \\cdot ${lambda} = ${z.toLatex()}`, `R = 1 - ${z.toLatex()} = ${R.toLatex()}`],
                ],
                [
                  ["Take the absolute value", "取绝对值"],
                  unstable
                    ? t(
                        `$|R| = ${ans.toLatex()}$, which exceeds $1$, so the numerical solution grows without bound.`,
                        `$|R| = ${ans.toLatex()}$，大于 $1$，所以数值解会无界增长。`,
                      )
                    : t(
                        `$|R| = ${ans.toLatex()}$, which does not exceed $1$, so the numerical solution does not grow.`,
                        `$|R| = ${ans.toLatex()}$，不大于 $1$，所以数值解不会增长。`,
                      ),
                ],
              ],
              t(
                `Stability needs $h\\lambda \\le 2$. Here $h\\lambda = ${z.toLatex()}$ is ${within ? "at most" : "more than"} $2$, which agrees with $|R| ${unstable ? ">" : "\\le"} 1$.`,
                `稳定要求 $h\\lambda \\le 2$。这里 $h\\lambda = ${z.toLatex()}$ ${within ? "不超过" : "大于"} $2$，与 $|R| ${unstable ? ">" : "\\le"} 1$ 一致。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-stable-step-size-for-a-stiff-system",
        title: t("The stable step size for a stiff system", "刚性方程组的稳定步长"),
        explanation: t(
          "For $\\mathbf{x}' = A\\mathbf{x}$ with real negative eigenvalues $-\\lambda_i$, explicit Euler is stable only if $h\\lambda_i \\le 2$ for every eigenvalue, so\n\n$$h \\le \\frac{2}{\\lambda_{\\max}}.$$\n\nThe fastest-decaying component sets the limit, even after it has long since died out: this is what makes a system stiff, and why implicit methods are preferred for it. For a triangular matrix the eigenvalues are the diagonal entries.\n\n> **Watch out.** The fast rate sets the limit, not the slow one. For eigenvalues $-2$ and $-50$: $h \\le \\frac{2}{50} = 0.04$; the bound $\\frac{2}{2} = 1$ from the slow mode would let the fast mode blow up.",
          "对实特征值为 $-\\lambda_i$（均为负）的 $\\mathbf{x}' = A\\mathbf{x}$，显式欧拉法仅当对每个特征值都有 $h\\lambda_i \\le 2$ 时稳定，所以\n\n$$h \\le \\frac{2}{\\lambda_{\\max}}.$$\n\n衰减最快的分量决定了这个限制，即使它早已消失：这正是方程组刚性的含义，也是对它更宜用隐式方法的原因。三角矩阵的特征值就是其对角元。\n\n> **注意。** 决定限制的是快的速率，而不是慢的。对特征值 $-2$ 与 $-50$：$h \\le \\frac{2}{50} = 0.04$；若用慢模式给出的界 $\\frac{2}{2} = 1$，快模式就会发散。",
        ),
        generate(rng: Rng): Problem {
          const l1 = rng.int(1, 5);
          const l2 = rng.pick([10, 20, 40, 50, 100, 200]);
          const off = rng.int(-9, 9) || 3;
          const fastFirst = rng.bool(0.5);
          const d1 = fastFirst ? l2 : l1;
          const d2 = fastFirst ? l1 : l2;
          const ans = Q.of(2, l2);
          return numberProblem({
            prompt: t(
              `Find the largest step size $h$ for which explicit Euler is stable on $\\mathbf{x}' = \\begin{pmatrix} -${d1} & ${off} \\\\ 0 & -${d2} \\end{pmatrix}\\mathbf{x}$.`,
              `求显式欧拉法对 $\\mathbf{x}' = \\begin{pmatrix} -${d1} & ${off} \\\\ 0 & -${d2} \\end{pmatrix}\\mathbf{x}$ 稳定的最大步长 $h$。`,
            ),
            answer: ans,
            form: "decimal",
            mistakes: decimals(ans, [
              why(
                Q.of(2, l1),
                "That is the bound from the slow eigenvalue; the fast one is stricter.",
                "这是慢特征值给出的界；快特征值的限制更严格。",
              ),
              why(
                Q.of(1, l2),
                "That uses $h\\lambda \\le 1$; explicit Euler is stable up to $h\\lambda = 2$.",
                "这用了 $h\\lambda \\le 1$；显式欧拉法在 $h\\lambda \\le 2$ 时都稳定。",
              ),
              why(
                Q.of(l2, 2),
                "That turns the bound upside down: $h\\lambda \\le 2$ means $h \\le \\frac{2}{\\lambda}$.",
                "这把界颠倒了：$h\\lambda \\le 2$ 意味着 $h \\le \\frac{2}{\\lambda}$。",
              ),
              why(
                Q.of(2, l1 + l2),
                "That adds the two rates; each mode must be stable on its own.",
                "这把两个速率相加了；每个模式都要各自稳定。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Read off the eigenvalues", "读出特征值"],
                  t("The matrix is triangular, so they are its diagonal entries:", "矩阵是三角矩阵，所以特征值就是对角元："),
                  [`\\lambda = -${d1}, \\quad \\lambda = -${d2}`],
                ],
                [
                  ["Require stability for each mode", "要求每个模式都稳定"],
                  none,
                  [`${l2}h \\le 2 \\quad \\text{and} \\quad ${co(l1)}h \\le 2`],
                ],
                [["Keep the stricter bound", "取更严格的界"], none, [`h \\le \\frac{2}{${l2}} = ${dec(ans)}`]],
              ],
              t(
                `At $h = ${dec(ans)}$ the fast mode has $h\\lambda = 2$ and factor $1 - 2 = -1$, right on the edge, while the slow mode has $h\\lambda = ${Q.of(2 * l1, l2).toLatex()}$, well inside.`,
                `当 $h = ${dec(ans)}$ 时，快模式的 $h\\lambda = 2$，因子为 $1 - 2 = -1$，恰在边界上；慢模式的 $h\\lambda = ${Q.of(2 * l1, l2).toLatex()}$，远在界内。`,
              ),
            ),
          });
        },
      },
    ],
  },
];
