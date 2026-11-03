import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, Q } from "@ga/subject-math";
import { choiceProblem, isTerminating, lowestTerms, numberProblem, steps, yesNo } from "../problems.ts";

/** par writes a value in parentheses when it is negative. */
const par = (v: Q): string => (v.sign() < 0 ? `(${dec(v)})` : dec(v));

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
    prerequisites: ["introduction-to-recurrence-relations"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "taylor-series-second-derivative",
        title: t("Evaluating the second derivative from a first-order ODE", "由一阶常微分方程计算二阶导数值"),
        explanation: t(
          "Differentiating the equation itself gives the second derivative in terms of lower derivatives, and the initial condition supplies their values at the center. For $y' = b x + y$ with $y(0) = a$, differentiating gives $y'' = b + y'$. At $x = 0$, $y'(0) = y(0) = a$, so $y''(0) = b + a$.",
          "对方程本身求导，就用低阶导数表示出二阶导数，初始条件提供它们在中心处的值。对于微分方程 $y' = b x + y$（初值 $y(0) = a$），两边求导得 $y'' = b + y'$。在 $x = 0$ 处，$y'(0) = y(0) = a$，因此 $y''(0) = b + a$。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.int(2, 25);
          const b = rng.int(2, 25);
          const ans = a + b;

          const prompt = t(
            `Consider the initial value problem $y' = ${b}x + y$ with $y(0) = ${a}$. Using implicit differentiation, find the second derivative $y''(0)$ at the expansion center $x = 0$.`,
            `考虑初值问题 $y' = ${b}x + y$，其中 $y(0) = ${a}$。利用隐函数求导法，求在展开中心 $x = 0$ 处的二阶导数 $y''(0)$。`,
          );
          const solution = t(
            steps(
              `Evaluate the first derivative at $x = 0$: $y'(0) = ${b}(0) + y(0) = ${a}$.`,
              `Differentiate both sides with respect to $x$: $y'' = \\frac{d}{dx}[${b}x + y] = ${b} + y'$.`,
              `Substitute $x = 0$: $y''(0) = ${b} + y'(0) = ${b} + ${a} = ${ans}$.`,
            ),
            steps(
              `在 $x = 0$ 处计算一阶导数：$y'(0) = ${b}(0) + y(0) = ${a}$。`,
              `方程两边对 $x$ 求导：$y'' = \\frac{d}{dx}[${b}x + y] = ${b} + y'$。`,
              `代入 $x = 0$：$y''(0) = ${b} + y'(0) = ${b} + ${a} = ${ans}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [a, b, a * b, ans + 1, ans - 1],
          });
        },
      },
      {
        id: "a-cubic-taylor-coefficient-of-a-nonlinear-equation",
        title: t("A cubic Taylor coefficient of a nonlinear equation", "非线性方程的三次泰勒系数"),
        explanation: t(
          "The same idea works for nonlinear equations; the chain rule just produces more terms. For $y' = cx + y^{2}$ with $y(0) = a$:\n\n$$y'' = c + 2yy', \\qquad y''' = 2(y')^{2} + 2yy''.$$\n\nAt $0$: $y' = a^{2}$, $y'' = c + 2a^{3}$ and $y''' = 6a^{4} + 2ac$. The Taylor coefficient of $x^{3}$ is $\\frac{y'''(0)}{3!}$; forgetting the factorial is the common slip.",
          "同样的方法适用于非线性方程，只是链式法则会产生更多项。对 $y' = cx + y^{2}$，$y(0) = a$：\n\n$$y'' = c + 2yy', \\qquad y''' = 2(y')^{2} + 2yy''.$$\n\n在 $0$ 处：$y' = a^{2}$，$y'' = c + 2a^{3}$，$y''' = 6a^{4} + 2ac$。$x^{3}$ 的泰勒系数为 $\\frac{y'''(0)}{3!}$；忘记除以阶乘是常见错误。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.pick([-2, -1, 1, 2]);
          const c = rng.int(1, 9);
          const y1 = a * a;
          const y2 = c + 2 * a ** 3;
          const y3 = 2 * y1 * y1 + 2 * a * y2;
          const ans = Q.of(y3, 6);
          return numberProblem({
            prompt: t(
              `For $y' = ${c === 1 ? "" : c}x + y^{2}$ with $y(0) = ${a}$, find the coefficient of $x^{3}$ in the Taylor series of $y$ about $0$.`,
              `对 $y' = ${c === 1 ? "" : c}x + y^{2}$，$y(0) = ${a}$，求 $y$ 在 $0$ 处泰勒级数中 $x^{3}$ 的系数。`,
            ),
            answer: ans,
            wrong: [Q.of(y3), Q.of(2 * y1 * y1, 6), Q.of(y2, 2)].filter((v) => !v.eq(ans)),
            solution: t(
              steps(
                `$y'(0) = ${a < 0 ? `(${a})` : a}^{2} = ${y1}$ and $y''(0) = ${c} + 2 \\cdot ${a < 0 ? `(${a})` : a}^{3} \\cdot 1 = ${y2}$, using $y'' = ${c} + 2yy'$.`,
                `$y''' = 2(y')^{2} + 2yy''$, so $y'''(0) = 2 \\cdot ${y1 * y1} + 2 \\cdot ${a < 0 ? `(${a})` : a} \\cdot ${y2 < 0 ? `(${y2})` : y2} = ${y3}$, and the coefficient is $\\frac{${y3}}{6}${lowestTerms(y3, 6)}$.`,
              ),
              steps(
                `由 $y'' = ${c} + 2yy'$：$y'(0) = ${a < 0 ? `(${a})` : a}^{2} = ${y1}$，$y''(0) = ${c} + 2 \\cdot ${a < 0 ? `(${a})` : a}^{3} \\cdot 1 = ${y2}$。`,
                `$y''' = 2(y')^{2} + 2yy''$，所以 $y'''(0) = 2 \\cdot ${y1 * y1} + 2 \\cdot ${a < 0 ? `(${a})` : a} \\cdot ${y2 < 0 ? `(${y2})` : y2} = ${y3}$，系数为 $\\frac{${y3}}{6}${lowestTerms(y3, 6)}$。`,
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
    prerequisites: ["taylor-series-solutions-of-differential-equations"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "power-series-recurrence-step",
        title: t("Calculating higher coefficient from power series recurrence", "由幂级数递推关系计算高阶系数"),
        explanation: t(
          "Substituting a power series and matching the coefficients of each power gives a recurrence that determines each coefficient from an earlier one. For $y'' - k y = 0$, substituting $y = \\sum a_n x^n$ gives $(n+2)(n+1)a_{n+2} = k a_n$. For $n = 0$, $a_2 = \\frac{k a_0}{2}$.",
          "代入幂级数并比较各次幂的系数，就得到由前面的系数确定每个系数的递推关系。对于方程 $y'' - k y = 0$，代入 $y = \\sum a_n x^n$ 得递推公式 $(n+2)(n+1)a_{n+2} = k a_n$。当 $n = 0$ 时，$a_2 = \\frac{k a_0}{2}$。",
        ),
        generate(rng: Rng): Problem {
          const k = rng.int(2, 10);
          const m = rng.int(2, 35);
          const a0 = 2 * m;
          const ans = k * m;

          const prompt = t(
            `Substitute the power series $y = \\sum_{n=0}^\\infty a_n x^n$ into $y'' - ${k}y = 0$ with $a_0 = ${a0}$. Find the coefficient $a_2$.`,
            `将幂级数 $y = \\sum_{n=0}^\\infty a_n x^n$ 代入微分方程 $y'' - ${k}y = 0$。已知 $a_0 = ${a0}$，求系数 $a_2$ 的值。`,
          );
          const solution = t(
            steps(
              `The second derivative is $y'' = \\sum_{n=0}^\\infty (n+2)(n+1) a_{n+2} x^n$.`,
              `Substitute into the ODE: $\\sum_{n=0}^\\infty [(n+2)(n+1) a_{n+2} - ${k} a_n] x^n = 0$.`,
              `Equating coefficients to zero gives $a_{n+2} = \\frac{${k} a_n}{(n+2)(n+1)}$.`,
              `For $n = 0$: $a_2 = \\frac{${k} a_0}{2} = \\frac{${k}(${a0})}{2} = ${ans}$.`,
            ),
            steps(
              `二阶导数级数形式为 $y'' = \\sum_{n=0}^\\infty (n+2)(n+1) a_{n+2} x^n$。`,
              `代入微分方程：$\\sum_{n=0}^\\infty [(n+2)(n+1) a_{n+2} - ${k} a_n] x^n = 0$。`,
              `令各项系数为零，得到递推关系：$a_{n+2} = \\frac{${k} a_n}{(n+2)(n+1)}$。`,
              `对于 $n = 0$：$a_2 = \\frac{${k} a_0}{2} = \\frac{${k}(${a0})}{2} = ${ans}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [k * a0, a0, ans + 1, ans - 1],
          });
        },
      },
      {
        id: "a-recurrence-for-an-airy-type-equation",
        title: t("A recurrence for an Airy-type equation", "艾里型方程的递推关系"),
        explanation: t(
          "For $y'' = kxy$, substituting $y = \\sum a_nx^{n}$ and matching the coefficient of $x^{n}$ gives\n\n$$(n + 2)(n + 1)a_{n+2} = ka_{n-1}, \\qquad a_2 = 0.$$\n\nThe recurrence jumps by three, so $a_3 = \\frac{ka_0}{6}$, $a_4 = \\frac{ka_1}{12}$, $a_5 = 0$ and $a_6 = \\frac{ka_3}{30}$. The coefficients split into three chains starting from $a_0$, $a_1$ and $a_2 = 0$.",
          "对 $y'' = kxy$，代入 $y = \\sum a_nx^{n}$ 并比较 $x^{n}$ 的系数得\n\n$$(n + 2)(n + 1)a_{n+2} = ka_{n-1}, \\qquad a_2 = 0.$$\n\n递推每次跳三步，所以 $a_3 = \\frac{ka_0}{6}$，$a_4 = \\frac{ka_1}{12}$，$a_5 = 0$，$a_6 = \\frac{ka_3}{30}$。系数分成从 $a_0$、$a_1$ 和 $a_2 = 0$ 出发的三条链。",
        ),
        generate(rng: Rng): Problem {
          const k = rng.pick([-3, -2, -1, 1, 2, 3, 4, 6]);
          const a0 = rng.int(1, 9);
          const a1 = rng.int(-6, 6) || 2;
          const which = rng.pick([3, 4, 6]);
          const a3 = Q.of(k * a0, 6);
          const ans = which === 3 ? a3 : which === 4 ? Q.of(k * a1, 12) : a3.mul(Q.of(k, 30));
          const ky = k === 1 ? "" : k === -1 ? "-" : `${k}`;
          return numberProblem({
            prompt: t(
              `The series $y = \\sum a_nx^{n}$ solves $y'' = ${ky}xy$ with $a_0 = ${a0}$ and $a_1 = ${a1}$. Find $a_{${which}}$.`,
              `级数 $y = \\sum a_nx^{n}$ 是 $y'' = ${ky}xy$ 的解，$a_0 = ${a0}$，$a_1 = ${a1}$。求 $a_{${which}}$。`,
            ),
            answer: ans,
            wrong: [Q.of(k * (which === 4 ? a0 : a1), which === 4 ? 12 : 6), Q.of(k * a0, 2), which === 6 ? a3 : Q.zero].filter(
              (v) => !v.eq(ans),
            ),
            solution: t(
              `Matching $x^{n}$: $(n + 2)(n + 1)a_{n+2} = ${k}a_{n-1}$. ${which === 4 ? `With $n = 2$: $a_4 = \\frac{${k} \\cdot ${a1 < 0 ? `(${a1})` : a1}}{12} = ${ans.toLatex()}$.` : `With $n = 1$: $a_3 = \\frac{${k} \\cdot ${a0}}{6} = ${a3.toLatex()}$.${which === 6 ? ` With $n = 4$: $a_6 = \\frac{${k}a_3}{30} = ${ans.toLatex()}$.` : ""}`}`,
              `比较 $x^{n}$ 的系数：$(n + 2)(n + 1)a_{n+2} = ${k}a_{n-1}$。${which === 4 ? `取 $n = 2$：$a_4 = \\frac{${k} \\cdot ${a1 < 0 ? `(${a1})` : a1}}{12} = ${ans.toLatex()}$。` : `取 $n = 1$：$a_3 = \\frac{${k} \\cdot ${a0}}{6} = ${a3.toLatex()}$。${which === 6 ? `取 $n = 4$：$a_6 = \\frac{${k}a_3}{30} = ${ans.toLatex()}$。` : ""}`}`,
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
    prerequisites: ["power-series-solutions-of-differential-equations"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "identifying-regular-singular-point",
        title: t("Locating a non-zero regular singular point", "确定非零正则奇点的位置"),
        explanation: t(
          "For $x^2 (x - a) y'' + x y' + y = 0$, the roots of $P(x) = 0$ are $x = 0$ and $x = a$. Both satisfy the Fuchs condition and are regular singular points.",
          "对于方程 $x^2 (x - a) y'' + x y' + y = 0$，$P(x) = 0$ 的根为 $x = 0$ 与 $x = a$。两者均满足富克斯条件，均为正则奇点。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.int(2, 35);
          const ans = a;

          const prompt = t(
            `Find the positive regular singular point $x_0 > 0$ of the differential equation $x^2 (x - ${a}) y'' + x y' + y = 0$.`,
            `求微分方程 $x^2 (x - ${a}) y'' + x y' + y = 0$ 的正正则奇点 $x_0 > 0$。`,
          );
          const solution = t(
            steps(
              `The leading coefficient polynomial is $P(x) = x^2 (x - ${a})$. Its zeros are $x = 0$ and $x = ${a}$.`,
              `For $x = ${a}$, $(x - ${a}) \\frac{Q(x)}{P(x)} = \\frac{x(x - ${a})}{x^2(x - ${a})} = \\frac{1}{x}$, which is analytic at $x = ${a}$.`,
              `Similarly, $(x - ${a})^2 \\frac{R(x)}{P(x)} = \\frac{(x - ${a})^2}{x^2(x - ${a})} = \\frac{x - ${a}}{x^2}$, which is analytic at $x = ${a}$.`,
              `Thus $x = ${ans}$ is a regular singular point.`,
            ),
            steps(
              `最高阶导数系数多项式为 $P(x) = x^2 (x - ${a})$，其零点为 $x = 0$ 与 $x = ${a}$。`,
              `在 $x = ${a}$ 处，$(x - ${a}) \\frac{Q(x)}{P(x)} = \\frac{1}{x}$ 在该点解析。`,
              `同理，$(x - ${a})^2 \\frac{R(x)}{P(x)} = \\frac{x - ${a}}{x^2}$ 在该点亦解析。`,
              `因此正正则奇点为 $x = ${ans}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [2 * a, a * a, ans + 1, ans - 1],
          });
        },
      },
      {
        id: "regular-or-irregular-singular-points",
        title: t("Regular or irregular singular points", "正则奇点与非正则奇点"),
        explanation: t(
          "Write the equation as $y'' + p(x)y' + q(x)y = 0$. The singular point $0$ is regular when $xp(x)$ and $x^{2}q(x)$ have no negative powers of $x$; otherwise it is irregular.\n\nFor $x^{3}y'' + xy' + y = 0$: $p = x^{-2}$, so $xp = x^{-1}$ blows up and $0$ is irregular. For $x^{2}y'' + 3xy' + y = 0$: $xp = 3$ and $x^{2}q = 1$, so $0$ is regular.",
          "把方程写成 $y'' + p(x)y' + q(x)y = 0$。若 $xp(x)$ 与 $x^{2}q(x)$ 都不含 $x$ 的负幂，则奇点 $0$ 是正则的；否则是非正则的。\n\n对 $x^{3}y'' + xy' + y = 0$：$p = x^{-2}$，所以 $xp = x^{-1}$ 无界，$0$ 是非正则奇点。对 $x^{2}y'' + 3xy' + y = 0$：$xp = 3$，$x^{2}q = 1$，所以 $0$ 是正则奇点。",
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
          return choiceProblem({
            prompt: t(
              `Is $x = 0$ a regular singular point of $${pw(m)}y'' + ${qc === 1 ? "" : qc}${pw(j)}y' + ${r}y = 0$?`,
              `$x = 0$ 是 $${pw(m)}y'' + ${qc === 1 ? "" : qc}${pw(j)}y' + ${r}y = 0$ 的正则奇点吗？`,
            ),
            options: yesNo,
            correct: regular ? 0 : 1,
            solution: t(
              `$xp(x) = ${mono(qc, pe)}$ and $x^{2}q(x) = ${mono(r, qe)}$. ${regular ? "Neither has a negative power of $x$, so $0$ is a regular singular point." : "A negative power of $x$ appears, so $0$ is an irregular singular point."}`,
              `$xp(x) = ${mono(qc, pe)}$，$x^{2}q(x) = ${mono(r, qe)}$。${regular ? "两者都不含 $x$ 的负幂，所以 $0$ 是正则奇点。" : "出现了 $x$ 的负幂，所以 $0$ 是非正则奇点。"}`,
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
    prerequisites: ["regular-singular-points"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "frobenius-indicial-root",
        title: t("Larger root of the Frobenius indicial equation", "弗罗贝尼乌斯指标方程的较大根"),
        explanation: t(
          "The indicial equation comes from the lowest power of the variable after substitution, and its roots give the possible starting exponents of the series. For $x^2 y'' - r_1 x y' + r_1 y = 0$, the indicial equation is $r(r - 1) - r_1 r + r_1 = (r - 1)(r - r_1) = 0$. The roots are $r = 1$ and $r = r_1$.",
          "指标方程来自代入后变量的最低次幂，它的根给出级数可能的起始指数。对于方程 $x^2 y'' - r_1 x y' + r_1 y = 0$，指标方程为 $r(r - 1) - r_1 r + r_1 = (r - 1)(r - r_1) = 0$。其根为 $r = 1$ 与 $r = r_1$。",
        ),
        generate(rng: Rng): Problem {
          const r1 = rng.int(2, 35);
          const ans = r1;

          const prompt = t(
            `Find the larger root of the indicial equation for the differential equation $x^2 y'' - ${r1} x y' + ${r1} y = 0$ about the regular singular point $x = 0$.`,
            `求微分方程 $x^2 y'' - ${r1} x y' + ${r1} y = 0$ 在正则奇点 $x = 0$ 处的指标方程的较大根。`,
          );
          const solution = t(
            steps(
              `Assume the Frobenius series $y = \\sum_{n=0}^\\infty a_n x^{n+r}$ with $a_0 \\ne 0$.`,
              `The lowest power of $x$ gives the indicial equation: $r(r - 1) - ${r1}r + ${r1} = 0$.`,
              `Factor the quadratic: $r^2 - (${r1 + 1})r + ${r1} = (r - 1)(r - ${r1}) = 0$.`,
              `The roots are $r = 1$ and $r = ${ans}$. The larger root is $${ans}$.`,
            ),
            steps(
              `设弗罗贝尼乌斯级数 $y = \\sum_{n=0}^\\infty a_n x^{n+r}$（$a_0 \\ne 0$）。`,
              `考察最低次幂系数，导出指标方程：$r(r - 1) - ${r1}r + ${r1} = 0$。`,
              `分解二次方程：$r^2 - (${r1 + 1})r + ${r1} = (r - 1)(r - ${r1}) = 0$。`,
              `方程的两根为 $r = 1$ 与 $r = ${ans}$。较大根为 $${ans}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [1, r1 + 1, r1 - 1, 2 * r1],
          });
        },
      },
      {
        id: "the-indicial-equation-with-variable-coefficients",
        title: t("The indicial equation with variable coefficients", "变系数方程的指标方程"),
        explanation: t(
          "Only the lowest-order behavior near $0$ enters the indicial equation. For $ax^{2}y'' + bxy' + (c + dx)y = 0$, the term $dxy$ is of higher order, and substituting $y = x^{r}$ into the remaining part gives\n\n$$ar(r - 1) + br + c = 0.$$\n\nFor $2x^{2}y'' + 3xy' - (1 + x)y = 0$: $2r(r - 1) + 3r - 1 = 2r^{2} + r - 1 = 0$, so $r = \\frac{1}{2}$ or $r = -1$.",
          "只有 $0$ 附近的最低阶部分进入指标方程。对 $ax^{2}y'' + bxy' + (c + dx)y = 0$，项 $dxy$ 是高阶的，把 $y = x^{r}$ 代入其余部分得\n\n$$ar(r - 1) + br + c = 0.$$\n\n对 $2x^{2}y'' + 3xy' - (1 + x)y = 0$：$2r(r - 1) + 3r - 1 = 2r^{2} + r - 1 = 0$，所以 $r = \\frac{1}{2}$ 或 $r = -1$。",
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
          const cy = c === 0 ? `${d === 1 ? "" : d}x` : `${c}${lin(d, "x")}`;
          return numberProblem({
            prompt: t(
              `Find the smaller root of the indicial equation of $2x^{2}y''${lin(b, "xy'")} + (${cy})y = 0$ at $x = 0$.`,
              `求 $2x^{2}y''${lin(b, "xy'")} + (${cy})y = 0$ 在 $x = 0$ 处指标方程的较小根。`,
            ),
            answer: small,
            wrong: [big, small.neg(), Q.of(-c, 2)].filter((v) => !v.eq(small)),
            solution: t(
              `Dropping the higher-order term $${d === 1 ? "" : d}xy$, the indicial equation is $2r(r - 1)${lin(b, "r")}${lin(c, "")} = 2r^{2}${lin(b - 2, "r")}${lin(c, "")} = 0$, with roots $${r1.toLatex()}$ and $${r2.toLatex()}$. The smaller is $${small.toLatex()}$.`,
              `略去高阶项 $${d === 1 ? "" : d}xy$，指标方程为 $2r(r - 1)${lin(b, "r")}${lin(c, "")} = 2r^{2}${lin(b - 2, "r")}${lin(c, "")} = 0$，根为 $${r1.toLatex()}$ 与 $${r2.toLatex()}$。较小的根为 $${small.toLatex()}$。`,
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
    prerequisites: ["the-method-of-frobenius"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "frobenius-first-recurrence-step",
        title: t("First recurrence coefficient in a Frobenius expansion", "弗罗贝尼乌斯展开中的第一递推系数"),
        explanation: t(
          "Matching the coefficient of the next power gives the first coefficient after the leading one in terms of that leading coefficient. For $x y'' + c y' + y = 0$ with $r = 0$, equating the $x^0$ term gives $1(c) a_1 + a_0 = 0 \\implies a_1 = -a_0 / c$.",
          "比较下一个幂的系数，就能用首项系数表示出首项之后的第一个系数。对于方程 $x y'' + c y' + y = 0$（取指标 $r = 0$），令 $x^0$ 项系数为零得 $1(c) a_1 + a_0 = 0 \\implies a_1 = -a_0 / c$。",
        ),
        generate(rng: Rng): Problem {
          const c = rng.int(2, 8);
          const ans = rng.int(2, 35);
          const a0 = -ans * c;

          const prompt = t(
            `In the Frobenius series solution $y = \\sum_{n=0}^\\infty a_n x^n$ (with index $r = 0$) to $x y'' + ${c} y' + y = 0$, given $a_0 = ${a0}$, find the coefficient $a_1$.`,
            `在微分方程 $x y'' + ${c} y' + y = 0$ 对应于指标 $r = 0$ 的弗罗贝尼乌斯级数解 $y = \\sum_{n=0}^\\infty a_n x^n$ 中，已知 $a_0 = ${a0}$，求系数 $a_1$ 的值。`,
          );
          const solution = t(
            steps(
              `Substitute $y = \\sum a_n x^n$: $x y'' = \\sum_{n=1}^\\infty n(n-1)a_n x^{n-1} = \\sum_{k=0}^\\infty (k+1)k a_{k+1} x^k$.`,
              `The second term is $${c} y' = ${c} \\sum_{n=1}^\\infty n a_n x^{n-1} = ${c} \\sum_{k=0}^\\infty (k+1) a_{k+1} x^k$.`,
              `For $k = 0$, the $x^0$ coefficient is $(0 + ${c})a_1 + a_0 = ${c}a_1 + a_0 = 0$.`,
              `Solving for $a_1$: $a_1 = -\\frac{a_0}{${c}} = -\\frac{${a0}}{${c}} = ${ans}$.`,
            ),
            steps(
              `代入级数 $y = \\sum a_n x^n$：$x y'' = \\sum_{k=0}^\\infty (k+1)k a_{k+1} x^k$。`,
              `第二项为 $${c} y' = ${c} \\sum_{k=0}^\\infty (k+1) a_{k+1} x^k$。`,
              `考察常数项（$k = 0$）：$(0 + ${c})a_1 + a_0 = ${c}a_1 + a_0 = 0$。`,
              `解得 $a_1 = -\\frac{a_0}{${c}} = -\\frac{${a0}}{${c}} = ${ans}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [-ans, a0, c, ans + 1, ans - 1],
          });
        },
      },
      {
        id: "running-a-frobenius-recurrence-two-steps",
        title: t("Running a Frobenius recurrence two steps", "把弗罗贝尼乌斯递推运行两步"),
        explanation: t(
          "For $xy'' + by' + y = 0$ with exponent $r = 0$, substituting $y = \\sum a_nx^{n}$ and matching the coefficient of $x^{n}$ gives\n\n$$(n + 1)(n + b)a_{n+1} = -a_n.$$\n\nSo $a_1 = -\\frac{a_0}{b}$ and $a_2 = -\\frac{a_1}{2(b + 1)} = \\frac{a_0}{2b(b + 1)}$. Each step uses the previous coefficient, and the signs alternate.",
          "对指数 $r = 0$ 的 $xy'' + by' + y = 0$，代入 $y = \\sum a_nx^{n}$ 并比较 $x^{n}$ 的系数得\n\n$$(n + 1)(n + b)a_{n+1} = -a_n.$$\n\n所以 $a_1 = -\\frac{a_0}{b}$，$a_2 = -\\frac{a_1}{2(b + 1)} = \\frac{a_0}{2b(b + 1)}$。每一步都用到前一个系数，且符号交替。",
        ),
        generate(rng: Rng): Problem {
          const b = rng.int(1, 6);
          const a0 = rng.int(1, 12) * rng.pick([1, -1]);
          const a1 = Q.of(-a0, b);
          const ans = Q.of(a0, 2 * b * (b + 1));
          return numberProblem({
            prompt: t(
              `The Frobenius solution of $xy'' + ${b === 1 ? "" : b}y' + y = 0$ with exponent $r = 0$ is $y = \\sum a_nx^{n}$ with $a_0 = ${a0}$. Find $a_2$.`,
              `$xy'' + ${b === 1 ? "" : b}y' + y = 0$ 的指数 $r = 0$ 的弗罗贝尼乌斯解为 $y = \\sum a_nx^{n}$，$a_0 = ${a0}$。求 $a_2$。`,
            ),
            answer: ans,
            wrong: [a1, ans.neg(), Q.of(a0, 2 * b * b)].filter((v) => !v.eq(ans)),
            solution: t(
              steps(
                `The recurrence is $(n + 1)(n + ${b})a_{n+1} = -a_n$.`,
                `$n = 0$: $a_1 = -\\frac{${a0}}{${b}} = ${a1.toLatex()}$. $n = 1$: $a_2 = -\\frac{a_1}{2 \\cdot ${b + 1}} = ${ans.toLatex()}$.`,
              ),
              steps(
                `递推关系为 $(n + 1)(n + ${b})a_{n+1} = -a_n$。`,
                `$n = 0$：$a_1 = -\\frac{${a0}}{${b}} = ${a1.toLatex()}$。$n = 1$：$a_2 = -\\frac{a_1}{2 \\cdot ${b + 1}} = ${ans.toLatex()}$。`,
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
    prerequisites: ["finding-recurrence-relations-for-the-coefficients-of-a-frobenius-solution"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "frobenius-non-integer-root-difference",
        title: t("Exponent of the primary Frobenius solution", "主弗罗贝尼乌斯解的指数"),
        explanation: t(
          "When the two roots of the indicial equation do not differ by an integer, each root gives its own independent series solution. For $2 x^2 y'' + x y' - k(2k - 1) y = 0$, the indicial equation is $2r(r - 1) + r - k(2k - 1) = (2r + 2k - 1)(r - k) = 0$. The larger positive exponent is $r = k$.",
          "当指标方程的两个根之差不是整数时，每个根都给出一个独立的级数解。对于方程 $2 x^2 y'' + x y' - k(2k - 1) y = 0$，指标方程为 $2r(r - 1) + r - k(2k - 1) = (2r + 2k - 1)(r - k) = 0$。较大的正指标为 $r = k$。",
        ),
        generate(rng: Rng): Problem {
          const k = rng.int(2, 35);
          const constTerm = k * (2 * k - 1);
          const ans = k;

          const prompt = t(
            `Find the positive exponent $r_1 > 0$ of the primary Frobenius series solution $y_1(x) = x^{r_1} \\sum a_n x^n$ for $2 x^2 y'' + x y' - ${constTerm} y = 0$.`,
            `求微分方程 $2 x^2 y'' + x y' - ${constTerm} y = 0$ 的主弗罗贝尼乌斯级数解 $y_1(x) = x^{r_1} \\sum a_n x^n$ 的正特征指数 $r_1 > 0$。`,
          );
          const solution = t(
            steps(
              `The indicial equation is obtained from the lowest powers: $2r(r - 1) + r - ${constTerm} = 0$.`,
              `Simplify: $2r^2 - r - ${constTerm} = 0$.`,
              `Factor: $(r - ${k})(2r + ${2 * k - 1}) = 0$.`,
              `The positive root is $r_1 = ${ans}$.`,
            ),
            steps(
              `考察最低次幂项，得到指标方程：$2r(r - 1) + r - ${constTerm} = 0$。`,
              `化简二次多项式：$2r^2 - r - ${constTerm} = 0$。`,
              `因式分解：$(r - ${k})(2r + ${2 * k - 1}) = 0$。`,
              `正根为 $r_1 = ${ans}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [2 * k, 2 * k - 1, constTerm, ans + 1, ans - 1],
          });
        },
      },
      {
        id: "when-two-frobenius-series-are-guaranteed",
        title: t("When two Frobenius series are guaranteed", "何时保证有两个弗罗贝尼乌斯级数解"),
        explanation: t(
          "Let $r_1 \\ge r_2$ be the indicial roots. If $r_1 - r_2$ is not an integer, both give independent series $x^{r}\\sum a_nx^{n}$. If the roots are equal, or differ by a positive integer, the second solution may need a term $y_1\\ln x$, so two plain series are not guaranteed.\n\nRoots $\\frac{1}{2}$ and $-1$ differ by $\\frac{3}{2}$: two series. Roots $\\frac{3}{2}$ and $-\\frac{1}{2}$ differ by $2$: not guaranteed.",
          "设指标根为 $r_1 \\ge r_2$。若 $r_1 - r_2$ 不是整数，两者都给出独立的级数 $x^{r}\\sum a_nx^{n}$。若两根相等或相差正整数，第二个解可能需要含 $y_1\\ln x$ 的项，因此不能保证有两个普通级数解。\n\n根 $\\frac{1}{2}$ 与 $-1$ 相差 $\\frac{3}{2}$：有两个级数解。根 $\\frac{3}{2}$ 与 $-\\frac{1}{2}$ 相差 $2$：不能保证。",
        ),
        generate(rng: Rng): Problem {
          const r1 = Q.of(rng.int(-5, 7), 2);
          const r2 = Q.of(rng.int(-5, 7), 2);
          const s = r1.add(r2);
          const pr = r1.mul(r2);
          const b = Q.one.sub(s).mul(Q.of(4));
          const c = pr.mul(Q.of(4));
          const diff = r1.sub(r2);
          const guaranteed = !diff.isInteger();
          const term = (k: Q, v: string): string =>
            k.isZero() ? "" : ` ${k.sign() < 0 ? "-" : "+"} ${k.abs().eq(Q.one) && v !== "" ? "" : k.abs().toLatex()}${v}`;
          return choiceProblem({
            prompt: t(
              `Is $4x^{2}y''${term(b, "xy'")}${term(c, "y")} + xy = 0$ guaranteed two linearly independent Frobenius series solutions $x^{r}\\sum a_nx^{n}$ about $x = 0$?`,
              `$4x^{2}y''${term(b, "xy'")}${term(c, "y")} + xy = 0$ 在 $x = 0$ 附近是否保证有两个线性无关的弗罗贝尼乌斯级数解 $x^{r}\\sum a_nx^{n}$？`,
            ),
            options: yesNo,
            correct: guaranteed ? 0 : 1,
            solution: t(
              `The indicial equation is $4r(r - 1)${term(b, "r")}${term(c, "")} = 0$, with roots $${r1.toLatex()}$ and $${r2.toLatex()}$. Their difference $${diff.abs().toLatex()}$ is ${guaranteed ? "not an integer, so two series solutions exist" : "an integer, so a logarithmic term may be needed and two series are not guaranteed"}.`,
              `指标方程为 $4r(r - 1)${term(b, "r")}${term(c, "")} = 0$，根为 $${r1.toLatex()}$ 与 $${r2.toLatex()}$。它们的差 $${diff.abs().toLatex()}$ ${guaranteed ? "不是整数，所以存在两个级数解" : "是整数，可能需要对数项，因此不能保证有两个级数解"}。`,
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
    prerequisites: ["eulers-method-calculating-multiple-steps"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "modified-euler-predictor-corrector-step",
        title: t("Executing one step of the modified Euler method", "执行一步改进欧拉预估-校正计算"),
        explanation: t(
          "The method first predicts the next value with an Euler step, then corrects it by averaging the slopes at the start and at the predicted point. For $y' = 2t$ with $y(0) = y_0$ and step $h = 1$: slope $k_1 = 2(0) = 0$. Predictor $\\tilde{y}_1 = y_0$. Slope $k_2 = 2(1) = 2$. Corrector $y_1 = y_0 + \\frac{1}{2}(0 + 2) = y_0 + 1$.",
          "这种方法先用欧拉步预测下一个值，再用起点与预测点处斜率的平均值来修正它。对于 $y' = 2t$（初值 $y(0) = y_0$，步长 $h = 1$）：步首斜率 $k_1 = 0$。预估值 $\\tilde{y}_1 = y_0$。步末斜率 $k_2 = 2$。校正值 $y_1 = y_0 + \\frac{1}{2}(0 + 2) = y_0 + 1$。",
        ),
        generate(rng: Rng): Problem {
          const y0 = rng.int(2, 35);
          const ans = y0 + 1;

          const prompt = t(
            `Apply one step of the modified Euler (Heun) method with step size $h = 1$ to approximate $y(1)$ for the IVP $y' = 2t$ with $y(0) = ${y0}$.`,
            `应用步长 $h = 1$ 的改进欧拉（休恩）法对初值问题 $y' = 2t$（$y(0) = ${y0}$）计算一步，求 $y(1)$ 的近似值。`,
          );
          const solution = t(
            steps(
              `Initial slope: $k_1 = f(t_0, y_0) = 2(0) = 0$.`,
              `Predictor step: $\\tilde{y}_1 = y_0 + h k_1 = ${y0} + 1(0) = ${y0}$.`,
              `Predicted slope at $t_1 = 1$: $k_2 = f(t_1, \\tilde{y}_1) = 2(1) = 2$.`,
              `Corrector step: $y_1 = y_0 + \\frac{h}{2}(k_1 + k_2) = ${y0} + \\frac{1}{2}(0 + 2) = ${ans}$.`,
            ),
            steps(
              `计算步首斜率：$k_1 = f(t_0, y_0) = 2(0) = 0$。`,
              `预估步：$\\tilde{y}_1 = y_0 + h k_1 = ${y0} + 1(0) = ${y0}$。`,
              `在 $t_1 = 1$ 处的预估斜率：$k_2 = f(t_1, \\tilde{y}_1) = 2(1) = 2$。`,
              `校正步：$y_1 = y_0 + \\frac{h}{2}(k_1 + k_2) = ${y0} + \\frac{1}{2}(0 + 2) = ${ans}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [y0, y0 + 2, y0 - 1, 2 * y0],
          });
        },
      },
      {
        id: "a-heun-step-for-a-linear-equation",
        title: t("A Heun step for a linear equation", "线性方程的休恩一步"),
        explanation: t(
          "One step of the modified Euler (Heun) method from $(t_0, y_0)$ is\n\n$$k_1 = f(t_0, y_0), \\quad \\tilde{y} = y_0 + hk_1, \\quad k_2 = f(t_0 + h, \\tilde{y}), \\quad y_1 = y_0 + \\frac{h}{2}(k_1 + k_2).$$\n\nThe predictor $\\tilde{y}$ is only used to evaluate $k_2$; the answer is the corrected value $y_1$, not $\\tilde{y}$.",
          "从 $(t_0, y_0)$ 出发，改进欧拉（休恩）法的一步为\n\n$$k_1 = f(t_0, y_0), \\quad \\tilde{y} = y_0 + hk_1, \\quad k_2 = f(t_0 + h, \\tilde{y}), \\quad y_1 = y_0 + \\frac{h}{2}(k_1 + k_2).$$\n\n预测值 $\\tilde{y}$ 只用来计算 $k_2$；结果是校正值 $y_1$，而不是 $\\tilde{y}$。",
        ),
        generate(rng: Rng): Problem {
          const h = rng.pick([Q.of(1, 2), Q.of(1, 5), Q.of(1, 10)]);
          const y0 = Q.of(rng.int(1, 9));
          const c = rng.int(1, 4);
          const k1 = y0;
          const pred = y0.add(h.mul(k1));
          const k2 = Q.of(c).mul(h).add(pred);
          const ans = y0.add(h.div(Q.of(2)).mul(k1.add(k2)));
          return numberProblem({
            prompt: t(
              `Apply one step of the modified Euler method with $h = ${dec(h)}$ to $y' = ${c === 1 ? "" : c}t + y$, $y(0) = ${y0.toLatex()}$. Find $y_1$.`,
              `用步长 $h = ${dec(h)}$ 的改进欧拉法对 $y' = ${c === 1 ? "" : c}t + y$，$y(0) = ${y0.toLatex()}$ 计算一步。求 $y_1$。`,
            ),
            answer: ans,
            form: "decimal",
            wrong: [pred, y0.add(h.mul(k2)), y0.add(h.mul(k1.add(k2)))].filter((v) => !v.eq(ans) && isTerminating(v)),
            solution: t(
              steps(
                `$k_1 = ${c} \\cdot 0 + ${dec(y0)} = ${dec(k1)}$ and $\\tilde{y} = ${dec(y0)} + ${dec(h)} \\cdot ${par(k1)} = ${dec(pred)}$.`,
                `$k_2 = ${c} \\cdot ${par(h)} + ${dec(pred)} = ${dec(k2)}$, so $y_1 = ${dec(y0)} + \\frac{${dec(h)}}{2}(${dec(k1)} + ${dec(k2)}) = ${dec(ans)}$.`,
              ),
              steps(
                `$k_1 = ${c} \\cdot 0 + ${dec(y0)} = ${dec(k1)}$，$\\tilde{y} = ${dec(y0)} + ${dec(h)} \\cdot ${par(k1)} = ${dec(pred)}$。`,
                `$k_2 = ${c} \\cdot ${par(h)} + ${dec(pred)} = ${dec(k2)}$，所以 $y_1 = ${dec(y0)} + \\frac{${dec(h)}}{2}(${dec(k1)} + ${dec(k2)}) = ${dec(ans)}$。`,
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
    prerequisites: ["the-modified-euler-method"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "vector-euler-step-component",
        title: t("Computing a state component after one Euler step", "计算欧拉一步后的状态分量"),
        explanation: t(
          "Euler's method for a system updates every component at once, adding the step size times the corresponding entry of the derivative vector. For $\\mathbf{x}' = A \\mathbf{x}$ with $\\mathbf{x}_0 = \\begin{pmatrix} 0 \\\\ v_0 \\end{pmatrix}$ and $A = \\begin{pmatrix} 0 & 1 \\\\ -1 & 0 \\end{pmatrix}$, $A \\mathbf{x}_0 = \\begin{pmatrix} v_0 \\\\ 0 \\end{pmatrix}$. For $h = 1$, $\\mathbf{x}_1 = \\begin{pmatrix} v_0 \\\\ v_0 \\end{pmatrix}$. The first component is $v_0$.",
          "方程组的欧拉法同时更新所有分量，每个分量加上步长乘以导数向量的相应分量。对于系统 $\\mathbf{x}' = A \\mathbf{x}$（初值 $\\mathbf{x}_0 = \\begin{pmatrix} 0 \\\\ v_0 \\end{pmatrix}$，转移矩阵 $A = \\begin{pmatrix} 0 & 1 \\\\ -1 & 0 \\end{pmatrix}$），导数向量为 $A \\mathbf{x}_0 = \\begin{pmatrix} v_0 \\\\ 0 \\end{pmatrix}$。步长 $h = 1$ 时，$\\mathbf{x}_1 = \\begin{pmatrix} v_0 \\\\ v_0 \\end{pmatrix}$，第一分量为 $v_0$。",
        ),
        generate(rng: Rng): Problem {
          const v0 = rng.int(2, 35);
          const ans = v0;

          const prompt = t(
            `Apply one step of Euler's method with step size $h = 1$ to the system $\\mathbf{x}' = \\begin{pmatrix} 0 & 1 \\\\ -1 & 0 \\end{pmatrix} \\mathbf{x}$ with initial state $\\mathbf{x}_0 = \\begin{pmatrix} 0 \\\\ ${v0} \\end{pmatrix}$. Find the first component $x_1(1)$ of the state vector.`,
            `对系统 $\\mathbf{x}' = \\begin{pmatrix} 0 & 1 \\\\ -1 & 0 \\end{pmatrix} \\mathbf{x}$（初值 $\\mathbf{x}_0 = \\begin{pmatrix} 0 \\\\ ${v0} \\end{pmatrix}$）应用步长 $h = 1$ 的欧拉法计算一步。求状态向量的第一分量 $x_1(1)$。`,
          );
          const solution = t(
            steps(
              `The vector Euler update is $\\mathbf{x}_1 = \\mathbf{x}_0 + h A \\mathbf{x}_0$.`,
              `Compute $A \\mathbf{x}_0 = \\begin{pmatrix} 0 & 1 \\\\ -1 & 0 \\end{pmatrix} \\begin{pmatrix} 0 \\\\ ${v0} \\end{pmatrix} = \\begin{pmatrix} ${v0} \\\\ 0 \\end{pmatrix}$.`,
              `Add to the initial state: $\\mathbf{x}_1 = \\begin{pmatrix} 0 \\\\ ${v0} \\end{pmatrix} + 1 \\begin{pmatrix} ${v0} \\\\ 0 \\end{pmatrix} = \\begin{pmatrix} ${ans} \\\\ ${v0} \\end{pmatrix}$.`,
              `The first component is $${ans}$.`,
            ),
            steps(
              `向量欧拉更新公式为 $\\mathbf{x}_1 = \\mathbf{x}_0 + h A \\mathbf{x}_0$。`,
              `计算变化率向量：$A \\mathbf{x}_0 = \\begin{pmatrix} 0 & 1 \\\\ -1 & 0 \\end{pmatrix} \\begin{pmatrix} 0 \\\\ ${v0} \\end{pmatrix} = \\begin{pmatrix} ${v0} \\\\ 0 \\end{pmatrix}$。`,
              `与初值相加：$\\mathbf{x}_1 = \\begin{pmatrix} 0 \\\\ ${v0} \\end{pmatrix} + 1 \\begin{pmatrix} ${v0} \\\\ 0 \\end{pmatrix} = \\begin{pmatrix} ${ans} \\\\ ${v0} \\end{pmatrix}$。`,
              `因此第一分量为 $${ans}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [0, -v0, 2 * v0, ans + 1, ans - 1],
          });
        },
      },
      {
        id: "two-euler-steps-for-a-linear-system",
        title: t("Two Euler steps for a linear system", "线性方程组的两步欧拉法"),
        explanation: t(
          "For $\\mathbf{x}' = A\\mathbf{x}$, each Euler step multiplies the state by $I + hA$:\n\n$$\\mathbf{x}_{n+1} = \\mathbf{x}_n + hA\\mathbf{x}_n.$$\n\nTake the steps one at a time, and use both components of $\\mathbf{x}_1$ when computing $\\mathbf{x}_2$; updating one component and then using the new value for the other is a different (and wrong) scheme.",
          "对 $\\mathbf{x}' = A\\mathbf{x}$，每一步欧拉法都把状态乘以 $I + hA$：\n\n$$\\mathbf{x}_{n+1} = \\mathbf{x}_n + hA\\mathbf{x}_n.$$\n\n逐步计算，并在求 $\\mathbf{x}_2$ 时使用 $\\mathbf{x}_1$ 的两个分量；先更新一个分量再用新值更新另一个分量是另一种（错误的）格式。",
        ),
        generate(rng: Rng): Problem {
          const h = rng.pick([Q.of(1, 2), Q.of(1, 10), Q.one]);
          const A = [rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3)].map((v) => Q.of(v));
          const [a = Q.zero, b = Q.zero, c = Q.zero, d = Q.zero] = A;
          const x0 = [Q.of(rng.int(-4, 4) || 1), Q.of(rng.int(-4, 4) || 2)];
          const step = (v: Q[]): Q[] => {
            const [p = Q.zero, q = Q.zero] = v;
            return [p.add(h.mul(a.mul(p).add(b.mul(q)))), q.add(h.mul(c.mul(p).add(d.mul(q))))];
          };
          const x1 = step(x0);
          const x2 = step(x1);
          const comp = rng.int(0, 1);
          const ans = x2[comp] ?? Q.zero;
          const fmt = (v: Q[]): string => `\\begin{pmatrix} ${v.map((u) => dec(u)).join(" \\\\ ")} \\end{pmatrix}`;
          return numberProblem({
            prompt: t(
              `Apply two steps of Euler's method with $h = ${dec(h)}$ to $\\mathbf{x}' = \\begin{pmatrix} ${a.toLatex()} & ${b.toLatex()} \\\\ ${c.toLatex()} & ${d.toLatex()} \\end{pmatrix}\\mathbf{x}$, $\\mathbf{x}(0) = ${fmt(x0)}$. Find component ${comp + 1} of $\\mathbf{x}_2$.`,
              `用步长 $h = ${dec(h)}$ 的欧拉法对 $\\mathbf{x}' = \\begin{pmatrix} ${a.toLatex()} & ${b.toLatex()} \\\\ ${c.toLatex()} & ${d.toLatex()} \\end{pmatrix}\\mathbf{x}$，$\\mathbf{x}(0) = ${fmt(x0)}$ 计算两步。求 $\\mathbf{x}_2$ 的第 ${comp + 1} 个分量。`,
            ),
            answer: ans,
            form: "decimal",
            wrong: [
              x1[comp] ?? Q.zero,
              x2[1 - comp] ?? Q.zero,
              (x0[comp] ?? Q.zero).add(Q.of(2).mul((x1[comp] ?? Q.zero).sub(x0[comp] ?? Q.zero))),
            ].filter((v) => !v.eq(ans)),
            solution: t(
              steps(
                `$\\mathbf{x}_1 = \\mathbf{x}_0 + ${dec(h)}A\\mathbf{x}_0 = ${fmt(x1)}$.`,
                `$\\mathbf{x}_2 = \\mathbf{x}_1 + ${dec(h)}A\\mathbf{x}_1 = ${fmt(x2)}$, so component ${comp + 1} is $${dec(ans)}$.`,
              ),
              steps(
                `$\\mathbf{x}_1 = \\mathbf{x}_0 + ${dec(h)}A\\mathbf{x}_0 = ${fmt(x1)}$。`,
                `$\\mathbf{x}_2 = \\mathbf{x}_1 + ${dec(h)}A\\mathbf{x}_1 = ${fmt(x2)}$，所以第 ${comp + 1} 个分量为 $${dec(ans)}$。`,
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
    prerequisites: ["eulers-method-for-systems-of-odes"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "second-order-euler-position-update",
        title: t("Position update for a second-order ODE under Euler's method", "二阶常微分方程欧拉法下的位置更新"),
        explanation: t(
          "Writing the velocity as a second unknown turns the second order equation into a system, and the position update uses the current velocity as its slope. For $y'' = f(t, y, v)$, setting $y' = v$ gives the Euler position update $y_1 = y_0 + h v_0$. When $y_0 = 0$ and $h = 1$, $y_1 = v_0$.",
          "把速度作为第二个未知函数，就把二阶方程化为方程组，位置的更新以当前速度作为斜率。令 $y' = v$，二阶微分方程的位置更新公式为 $y_1 = y_0 + h v_0$。当 $y_0 = 0$ 且 $h = 1$ 时，一步后的位置即为 $y_1 = v_0$。",
        ),
        generate(rng: Rng): Problem {
          const v0 = rng.int(2, 35);
          const omegaSq = rng.int(2, 10);
          const ans = v0;

          const prompt = t(
            `Apply one step of Euler's method with step size $h = 1$ to the oscillator $y'' + ${omegaSq}y = 0$ with initial conditions $y(0) = 0$ and $y'(0) = ${v0}$. Find the estimated position $y_1$.`,
            `对谐振子方程 $y'' + ${omegaSq}y = 0$（初值 $y(0) = 0$ 与 $y'(0) = ${v0}$）应用步长 $h = 1$ 的欧拉法计算一步。求估算的位置值 $y_1$。`,
          );
          const solution = t(
            steps(
              `Convert to a first-order system with state variables $y$ (position) and $v = y'$ (velocity): $y' = v$, $v' = -${omegaSq}y$.`,
              `The Euler update for position is $y_1 = y_0 + h v_0$.`,
              `Substitute values: $y_1 = 0 + 1(${v0}) = ${ans}$.`,
            ),
            steps(
              `引入状态变量 $y$（位置）与 $v = y'$（速度），化为一阶系统：$y' = v$，$v' = -${omegaSq}y$。`,
              `位置分量的欧拉更新公式为 $y_1 = y_0 + h v_0$。`,
              `代入初值与步长：$y_1 = 0 + 1(${v0}) = ${ans}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [0, -v0, omegaSq * v0, ans + 1, ans - 1],
          });
        },
      },
      {
        id: "two-euler-steps-for-a-second-order-equation",
        title: t("Two Euler steps for a second-order equation", "二阶方程的两步欧拉法"),
        explanation: t(
          "Write $y'' = f(t, y, y')$ as the system $y' = v$, $v' = f(t, y, v)$ and update both together:\n\n$$y_{n+1} = y_n + hv_n, \\qquad v_{n+1} = v_n + hf(t_n, y_n, v_n).$$\n\nThe second position update uses the new velocity $v_1$, which already includes one step of acceleration.",
          "把 $y'' = f(t, y, y')$ 写成方程组 $y' = v$，$v' = f(t, y, v)$，并同时更新：\n\n$$y_{n+1} = y_n + hv_n, \\qquad v_{n+1} = v_n + hf(t_n, y_n, v_n).$$\n\n第二次位置更新使用新速度 $v_1$，它已包含一步加速度的作用。",
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
              `Apply two steps of Euler's method with $h = ${dec(h)}$ to $y'' + ${k === 1 ? "" : k}y = 0$, $y(0) = ${y0.toLatex()}$, $y'(0) = ${v0.toLatex()}$. Find $y_2$.`,
              `用步长 $h = ${dec(h)}$ 的欧拉法对 $y'' + ${k === 1 ? "" : k}y = 0$，$y(0) = ${y0.toLatex()}$，$y'(0) = ${v0.toLatex()}$ 计算两步。求 $y_2$。`,
            ),
            answer: y2,
            form: "decimal",
            wrong: [y1, y1.add(h.mul(v0)), y0.add(Q.of(2).mul(h).mul(v1))].filter((v) => !v.eq(y2)),
            solution: t(
              steps(
                `$y_1 = ${dec(y0)} + ${dec(h)} \\cdot ${par(v0)} = ${dec(y1)}$ and $v_1 = ${dec(v0)} - ${dec(h)} \\cdot ${k} \\cdot ${par(y0)} = ${dec(v1)}$.`,
                `$y_2 = y_1 + hv_1 = ${dec(y1)} + ${dec(h)} \\cdot ${v1.sign() < 0 ? `(${dec(v1)})` : dec(v1)} = ${dec(y2)}$.`,
              ),
              steps(
                `$y_1 = ${dec(y0)} + ${dec(h)} \\cdot ${par(v0)} = ${dec(y1)}$，$v_1 = ${dec(v0)} - ${dec(h)} \\cdot ${k} \\cdot ${par(y0)} = ${dec(v1)}$。`,
                `$y_2 = y_1 + hv_1 = ${dec(y1)} + ${dec(h)} \\cdot ${v1.sign() < 0 ? `(${dec(v1)})` : dec(v1)} = ${dec(y2)}$。`,
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
    prerequisites: ["the-modified-euler-method"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "rk4-weighted-average-step",
        title: t("Evaluating the weighted slope average in the RK4 update", "计算 RK4 更新公式中的加权斜率平均"),
        explanation: t(
          "The fourth order method takes a weighted average of four slope estimates, counting the two midpoint slopes twice as heavily as the end slopes. The RK4 update formula is $y_{n+1} = y_n + \\frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)$. For step size $h = 6$, $y_{n+1} = y_n + k_1 + 2k_2 + 2k_3 + k_4$.",
          "四阶方法取四个斜率估计的加权平均，两个中点斜率的权重是端点斜率的两倍。RK4 的步进更新公式为 $y_{n+1} = y_n + \\frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)$。当步长 $h = 6$ 时，更新公式简化为 $y_{n+1} = y_n + k_1 + 2k_2 + 2k_3 + k_4$。",
        ),
        generate(rng: Rng): Problem {
          const y0 = rng.int(2, 25);
          const k1 = rng.int(2, 20);
          const k2 = rng.int(2, 20);
          const k3 = rng.int(2, 20);
          const k4 = rng.int(2, 20);
          const ans = y0 + k1 + 2 * k2 + 2 * k3 + k4;

          const prompt = t(
            `In a step of the classical fourth-order Runge-Kutta method (RK4) with step size $h = 6$, the current state is $y_0 = ${y0}$ and the four stage slopes are $k_1 = ${k1}$, $k_2 = ${k2}$, $k_3 = ${k3}$, and $k_4 = ${k4}$. Compute the updated state $y_1$ using $y_1 = y_0 + \\frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)$.`,
            `在使用经典四阶龙格-库塔法（RK4，步长 $h = 6$）计算一步时，当前状态为 $y_0 = ${y0}$，四级斜率分别为 $k_1 = ${k1}$、$k_2 = ${k2}$、$k_3 = ${k3}$ 与 $k_4 = ${k4}$。利用公式 $y_1 = y_0 + \\frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)$ 计算更新后的值 $y_1$。`,
          );
          const solution = t(
            steps(
              `The RK4 update formula is $y_1 = y_0 + \\frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)$.`,
              `Substitute $h = 6$: $\\frac{6}{6} = 1$, so $y_1 = y_0 + k_1 + 2k_2 + 2k_3 + k_4$.`,
              `Compute the weighted sum: $${y0} + ${k1} + 2(${k2}) + 2(${k3}) + ${k4} = ${y0} + ${k1} + ${2 * k2} + ${2 * k3} + ${k4} = ${ans}$.`,
            ),
            steps(
              `RK4 的更新公式为 $y_1 = y_0 + \\frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)$。`,
              `代入步长 $h = 6$ 得 $\\frac{6}{6} = 1$，因此 $y_1 = y_0 + k_1 + 2k_2 + 2k_3 + k_4$。`,
              `代入各数值计算加权和：$${y0} + ${k1} + 2(${k2}) + 2(${k3}) + ${k4} = ${ans}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [y0 + k1 + k2 + k3 + k4, ans + 6, ans - 6, y0 + 2 * (k1 + k2 + k3 + k4)],
          });
        },
      },
      {
        id: "a-full-rk4-step-for-exponential-growth",
        title: t("A full RK4 step for exponential growth", "指数增长方程的完整 RK4 一步"),
        explanation: t(
          "For $y' = \\lambda y$ the four stages are\n\n$$k_1 = \\lambda y_0, \\quad k_2 = \\lambda\\left(y_0 + \\tfrac{h}{2}k_1\\right), \\quad k_3 = \\lambda\\left(y_0 + \\tfrac{h}{2}k_2\\right), \\quad k_4 = \\lambda(y_0 + hk_3),$$\n\nand $y_1 = y_0 + \\frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)$. Together they give $y_1 = y_0\\left(1 + z + \\frac{z^{2}}{2} + \\frac{z^{3}}{6} + \\frac{z^{4}}{24}\\right)$ with $z = \\lambda h$: the first five terms of $e^{z}$, which is why the method is fourth order.",
          "对 $y' = \\lambda y$，四个阶段为\n\n$$k_1 = \\lambda y_0, \\quad k_2 = \\lambda\\left(y_0 + \\tfrac{h}{2}k_1\\right), \\quad k_3 = \\lambda\\left(y_0 + \\tfrac{h}{2}k_2\\right), \\quad k_4 = \\lambda(y_0 + hk_3),$$\n\n且 $y_1 = y_0 + \\frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)$。合起来得 $y_1 = y_0\\left(1 + z + \\frac{z^{2}}{2} + \\frac{z^{3}}{6} + \\frac{z^{4}}{24}\\right)$，其中 $z = \\lambda h$：恰为 $e^{z}$ 的前五项，这就是该方法为四阶的原因。",
        ),
        generate(rng: Rng): Problem {
          const lam = Q.of(rng.pick([-2, -1, 1, 2, 3]));
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
          const euler = y0.add(h.mul(k1));
          return numberProblem({
            prompt: t(
              `Apply one RK4 step with $h = ${dec(h)}$ to $y' = ${lam.eq(Q.one) ? "" : lam.eq(Q.of(-1)) ? "-" : lam.toLatex()}y$, $y(0) = ${y0.toLatex()}$. Find $y_1$.`,
              `用步长 $h = ${dec(h)}$ 的 RK4 方法对 $y' = ${lam.eq(Q.one) ? "" : lam.eq(Q.of(-1)) ? "-" : lam.toLatex()}y$，$y(0) = ${y0.toLatex()}$ 计算一步。求 $y_1$。`,
            ),
            answer: ans,
            wrong: [euler, y0.add(h.div(Q.of(4)).mul(k1.add(k2).add(k3).add(k4))), y0.add(h.mul(k4))].filter((v) => !v.eq(ans)),
            solution: t(
              steps(
                `$k_1 = ${k1.toLatex()}$, $k_2 = ${k2.toLatex()}$, $k_3 = ${k3.toLatex()}$, $k_4 = ${k4.toLatex()}$.`,
                `$y_1 = ${y0.toLatex()} + \\frac{${dec(h)}}{6}\\left(${k1.toLatex()} + 2 \\cdot ${par(k2)} + 2 \\cdot ${par(k3)} + ${par(k4)}\\right) = ${ans.toLatex()}$.`,
              ),
              steps(
                `$k_1 = ${k1.toLatex()}$，$k_2 = ${k2.toLatex()}$，$k_3 = ${k3.toLatex()}$，$k_4 = ${k4.toLatex()}$。`,
                `$y_1 = ${y0.toLatex()} + \\frac{${dec(h)}}{6}\\left(${k1.toLatex()} + 2 \\cdot ${par(k2)} + 2 \\cdot ${par(k3)} + ${par(k4)}\\right) = ${ans.toLatex()}$。`,
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
    prerequisites: ["the-rk4-method"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "ab2-predictor-formula",
        title: t("Evaluating the Adams-Bashforth two-step predictor", "计算二步亚当斯-巴什福思预测值"),
        explanation: t(
          "A multistep method reuses slopes from earlier steps instead of computing new intermediate ones, extrapolating the trend of the slope forward. The explicit 2-step Adams-Bashforth predictor is $y_{n+1}^{(p)} = y_n + \\frac{h}{2}(3 f_n - f_{n-1})$. For $y_n = 0$, $h = 2$, $f_{n-1} = 1$, and $f_n = a$, $y_{n+1}^{(p)} = 3a - 1$.",
          "多步法重复使用前几步的斜率，而不是计算新的中间斜率，把斜率的变化趋势向前外推。二步显式亚当斯-巴什福思预测公式为 $y_{n+1}^{(p)} = y_n + \\frac{h}{2}(3 f_n - f_{n-1})$。当 $y_n = 0$，$h = 2$，$f_{n-1} = 1$，$f_n = a$ 时，预测值为 $y_{n+1}^{(p)} = 3a - 1$。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.int(2, 35);
          const ans = 3 * a - 1;

          const prompt = t(
            `In the ABM2 multistep method with step size $h = 2$, suppose $y_n = 0$, previous slope $f_{n-1} = 1$, and current slope $f_n = ${a}$. Compute the predicted value $y_{n+1}^{(p)}$ using the Adams-Bashforth 2 predictor formula $y_{n+1}^{(p)} = y_n + \\frac{h}{2}(3 f_n - f_{n-1})$.`,
            `在步长 $h = 2$ 的 ABM2 多步法中，已知当前值 $y_n = 0$，前一步斜率 $f_{n-1} = 1$，当前斜率 $f_n = ${a}$。应用二步亚当斯-巴什福思公式 $y_{n+1}^{(p)} = y_n + \\frac{h}{2}(3 f_n - f_{n-1})$ 计算预测值 $y_{n+1}^{(p)}$。`,
          );
          const solution = t(
            steps(
              `The predictor formula is $y_{n+1}^{(p)} = y_n + \\frac{h}{2}(3 f_n - f_{n-1})$.`,
              `Substitute $y_n = 0$, $h = 2$, $f_n = ${a}$, and $f_{n-1} = 1$: $y_{n+1}^{(p)} = 0 + \\frac{2}{2}(3(${a}) - 1) = 3(${a}) - 1 = ${ans}$.`,
            ),
            steps(
              `预测公式为 $y_{n+1}^{(p)} = y_n + \\frac{h}{2}(3 f_n - f_{n-1})$。`,
              `代入各数值：$y_{n+1}^{(p)} = 0 + \\frac{2}{2}(3(${a}) - 1) = 3(${a}) - 1 = ${ans}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [3 * a, 3 * a + 1, a - 1, ans + 2, ans - 2],
          });
        },
      },
      {
        id: "the-adams-moulton-corrector-step",
        title: t("The Adams-Moulton corrector step", "亚当斯-莫尔顿校正步"),
        explanation: t(
          "ABM2 first predicts with Adams-Bashforth and then corrects with the trapezoidal Adams-Moulton formula, evaluating the slope at the predicted point:\n\n$$y^{(p)} = y_n + \\frac{h}{2}(3f_n - f_{n-1}), \\qquad y_{n+1} = y_n + \\frac{h}{2}\\left(f(t_{n+1}, y^{(p)}) + f_n\\right).$$\n\nThe corrector uses $f_n$ once and the predicted slope once, with equal weights.",
          "ABM2 先用亚当斯-巴什福思公式预测，再用梯形型的亚当斯-莫尔顿公式校正，在预测点处计算斜率：\n\n$$y^{(p)} = y_n + \\frac{h}{2}(3f_n - f_{n-1}), \\qquad y_{n+1} = y_n + \\frac{h}{2}\\left(f(t_{n+1}, y^{(p)}) + f_n\\right).$$\n\n校正公式以相同权重各使用一次 $f_n$ 和预测斜率。",
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
          const ly = lam === 1 ? "" : lam === -1 ? "-" : `${lam}`;
          return numberProblem({
            prompt: t(
              `For $y' = ${ly}y$ with $h = ${dec(h)}$, ABM2 has $y_n = ${yn.toLatex()}$, $f_n = ${fn.toLatex()}$ and $f_{n-1} = ${fp.toLatex()}$. Compute the predictor, then the corrected value $y_{n+1}$.`,
              `对 $y' = ${ly}y$，步长 $h = ${dec(h)}$，ABM2 中 $y_n = ${yn.toLatex()}$，$f_n = ${fn.toLatex()}$，$f_{n-1} = ${fp.toLatex()}$。先计算预测值，再求校正值 $y_{n+1}$。`,
            ),
            answer: ans,
            form: "decimal",
            wrong: [pred, yn.add(h.mul(fpred)), yn.add(half.mul(fpred.add(fp)))].filter((v) => !v.eq(ans)),
            solution: t(
              steps(
                `$y^{(p)} = ${dec(yn)} + ${dec(half)}(3 \\cdot ${par(fn)} - ${par(fp)}) = ${dec(pred)}$, so $f(t_{n+1}, y^{(p)}) = ${dec(fpred)}$.`,
                `$y_{n+1} = ${dec(yn)} + ${dec(half)}(${dec(fpred)} + ${par(fn)}) = ${dec(ans)}$.`,
              ),
              steps(
                `$y^{(p)} = ${dec(yn)} + ${dec(half)}(3 \\cdot ${par(fn)} - ${par(fp)}) = ${dec(pred)}$，所以 $f(t_{n+1}, y^{(p)}) = ${dec(fpred)}$。`,
                `$y_{n+1} = ${dec(yn)} + ${dec(half)}(${dec(fpred)} + ${par(fn)}) = ${dec(ans)}$。`,
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
    prerequisites: ["eulers-method-calculating-multiple-steps"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "implicit-euler-decay-step",
        title: t("One step of implicit Euler on a decay equation", "隐式欧拉法对指数衰减方程的一步求解"),
        explanation: t(
          "The implicit method uses the slope at the new point, which means solving an equation at each step, but it stays stable for large steps on decay problems. For $y' = -\\lambda y$, the implicit Euler update is $y_{n+1} = y_n - h\\lambda y_{n+1} \\implies y_{n+1} = \\frac{y_n}{1 + h\\lambda}$. When $h\\lambda = 1$, $y_{n+1} = y_n / 2$.",
          "隐式方法使用新点处的斜率，所以每一步都要解一个方程，但在衰减问题上即使步长很大也保持稳定。对于衰减方程 $y' = -\\lambda y$，隐式欧拉格式为 $y_{n+1} = y_n - h\\lambda y_{n+1} \\implies y_{n+1} = \\frac{y_n}{1 + h\\lambda}$。当 $h\\lambda = 1$ 时，$y_{n+1} = y_n / 2$。",
        ),
        generate(rng: Rng): Problem {
          const ans = rng.int(2, 35);
          const yn = 2 * ans;

          const prompt = t(
            `Apply one step of the backward (implicit) Euler method with step size $h = 1$ to the decay equation $y' = -y$ with current state $y_0 = ${yn}$. Find $y_1$.`,
            `对衰减方程 $y' = -y$（初值 $y_0 = ${yn}$）应用步长 $h = 1$ 的后向（隐式）欧拉法计算一步。求 $y_1$ 的值。`,
          );
          const solution = t(
            steps(
              `The implicit Euler formula is $y_1 = y_0 + h f(t_1, y_1)$.`,
              `Substitute $f(t_1, y_1) = -y_1$ and $h = 1$: $y_1 = y_0 - 1 \\cdot y_1 \\implies 2 y_1 = y_0$.`,
              `Solving for $y_1$: $y_1 = \\frac{${yn}}{2} = ${ans}$.`,
            ),
            steps(
              `隐式欧拉计算公式为 $y_1 = y_0 + h f(t_1, y_1)$。`,
              `代入 $f(t_1, y_1) = -y_1$ 与 $h = 1$：$y_1 = y_0 - y_1 \\implies 2 y_1 = y_0$。`,
              `解得 $y_1 = \\frac{${yn}}{2} = ${ans}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [yn, 0, yn - 1, ans + 1, ans - 1],
          });
        },
      },
      {
        id: "an-implicit-euler-step-with-forcing",
        title: t("An implicit Euler step with forcing", "带强迫项的隐式欧拉一步"),
        explanation: t(
          "Backward Euler evaluates the slope at the new time: $y_{n+1} = y_n + hf(t_{n+1}, y_{n+1})$. For a linear equation $y' = -\\lambda y + ct$ the unknown can be isolated:\n\n$$y_{n+1} = y_n + h(-\\lambda y_{n+1} + ct_{n+1}) \\implies y_{n+1} = \\frac{y_n + hct_{n+1}}{1 + h\\lambda}.$$\n\nUse $t_{n+1}$, not $t_n$, in the forcing term.",
          "后向欧拉法在新时刻计算斜率：$y_{n+1} = y_n + hf(t_{n+1}, y_{n+1})$。对线性方程 $y' = -\\lambda y + ct$ 可以解出未知量：\n\n$$y_{n+1} = y_n + h(-\\lambda y_{n+1} + ct_{n+1}) \\implies y_{n+1} = \\frac{y_n + hct_{n+1}}{1 + h\\lambda}.$$\n\n强迫项中要用 $t_{n+1}$，而不是 $t_n$。",
        ),
        generate(rng: Rng): Problem {
          const lam = rng.int(1, 9);
          const c = rng.int(1, 8);
          const h = rng.pick([Q.of(1, 2), Q.one, Q.of(1, 4)]);
          const yn = Q.of(rng.int(1, 20));
          const tn = Q.of(rng.int(0, 3));
          const t1 = tn.add(h);
          const den = Q.one.add(h.mul(Q.of(lam)));
          const ans = yn.add(h.mul(Q.of(c)).mul(t1)).div(den);
          return numberProblem({
            prompt: t(
              `Apply one backward Euler step with $h = ${dec(h)}$ to $y' = -${lam === 1 ? "" : lam}y + ${c === 1 ? "" : c}t$ from $t_n = ${tn.toLatex()}$, $y_n = ${yn.toLatex()}$. Find $y_{n+1}$.`,
              `用步长 $h = ${dec(h)}$ 的后向欧拉法对 $y' = -${lam === 1 ? "" : lam}y + ${c === 1 ? "" : c}t$ 从 $t_n = ${tn.toLatex()}$，$y_n = ${yn.toLatex()}$ 计算一步。求 $y_{n+1}$。`,
            ),
            answer: ans,
            wrong: [yn.add(h.mul(Q.of(c)).mul(tn)).div(den), yn.add(h.mul(Q.of(c).mul(tn).sub(Q.of(lam).mul(yn)))), yn.div(den)].filter(
              (v) => !v.eq(ans),
            ),
            solution: t(
              steps(
                `$t_{n+1} = ${dec(t1)}$, and $y_{n+1} = ${yn.toLatex()} + ${dec(h)}\\left(-${lam}y_{n+1} + ${c} \\cdot ${par(t1)}\\right)$.`,
                `So $y_{n+1} = \\frac{${yn.toLatex()} + ${h.mul(Q.of(c)).mul(t1).toLatex()}}{${den.toLatex()}} = ${ans.toLatex()}$.`,
              ),
              steps(
                `$t_{n+1} = ${dec(t1)}$，$y_{n+1} = ${yn.toLatex()} + ${dec(h)}\\left(-${lam}y_{n+1} + ${c} \\cdot ${par(t1)}\\right)$。`,
                `所以 $y_{n+1} = \\frac{${yn.toLatex()} + ${h.mul(Q.of(c)).mul(t1).toLatex()}}{${den.toLatex()}} = ${ans.toLatex()}$。`,
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
    prerequisites: ["the-implicit-euler-method"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "trapezoidal-amplification-denominator",
        title: t("Denominators in the trapezoidal amplification factor", "梯形法增长因子中的分母项计算"),
        explanation: t(
          "The trapezoidal method averages the slopes at both ends of the step, so the amplification factor is a ratio of two linear expressions in the step size. Applying the trapezoidal method to $y' = -\\lambda y$ gives $y_{n+1} = y_n - \\frac{h\\lambda}{2}y_n - \\frac{h\\lambda}{2}y_{n+1} \\implies y_{n+1} = \\frac{1 - z/2}{1 + z/2} y_n$ where $z = h\\lambda$. For $z = 2k$, the denominator is $1 + k$.",
          "梯形法取步长两端斜率的平均值，所以放大因子是两个关于步长的一次式之比。将梯形法应用于 $y' = -\\lambda y$ 导出 $y_{n+1} = \\frac{1 - z/2}{1 + z/2} y_n$（其中 $z = h\\lambda$）。当 $z = 2k$ 时，分母值为 $1 + k$。",
        ),
        generate(rng: Rng): Problem {
          const k = rng.int(2, 35);
          const z = 2 * k;
          const ans = 1 + k;

          const prompt = t(
            `In the implicit trapezoidal scheme applied to the test equation $y' = -\\lambda y$, the solution updates as $y_{n+1} = \\frac{1 - z/2}{1 + z/2} y_n$ with dimensionless parameter $z = \\lambda h$. When $z = ${z}$, evaluate the denominator $1 + z/2$.`,
            `将隐式梯形法应用于试验方程 $y' = -\\lambda y$，解的步进公式为 $y_{n+1} = \\frac{1 - z/2}{1 + z/2} y_n$（其中无量纲参数 $z = \\lambda h$）。当 $z = ${z}$ 时，求分母项 $1 + z/2$ 的值。`,
          );
          const solution = t(
            steps(
              `The trapezoidal update is $y_{n+1} = y_n + \\frac{h}{2}(-\\lambda y_n - \\lambda y_{n+1})$.`,
              `Rearrange: $\\left(1 + \\frac{z}{2}\\right) y_{n+1} = \\left(1 - \\frac{z}{2}\\right) y_n$.`,
              `Substitute $z = ${z}$: $1 + \\frac{${z}}{2} = 1 + ${k} = ${ans}$.`,
            ),
            steps(
              `梯形法步进关系为 $y_{n+1} = y_n + \\frac{h}{2}(-\\lambda y_n - \\lambda y_{n+1})$。`,
              `移项整理：$\\left(1 + \\frac{z}{2}\\right) y_{n+1} = \\left(1 - \\frac{z}{2}\\right) y_n$。`,
              `代入 $z = ${z}$：$1 + \\frac{${z}}{2} = 1 + ${k} = ${ans}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [k, z, 1 + z, ans + 1, ans - 1],
          });
        },
      },
      {
        id: "a-trapezoidal-step-for-a-forced-decay",
        title: t("A trapezoidal step for a forced decay", "受迫衰减方程的梯形法一步"),
        explanation: t(
          "The trapezoidal rule averages the slopes at both ends: $y_{n+1} = y_n + \\frac{h}{2}\\left(f(y_n) + f(y_{n+1})\\right)$. For $y' = -\\lambda y + c$,\n\n$$\\left(1 + \\frac{h\\lambda}{2}\\right)y_{n+1} = \\left(1 - \\frac{h\\lambda}{2}\\right)y_n + hc.$$\n\nThe constant forcing appears at both ends, so it contributes $\\frac{h}{2}c + \\frac{h}{2}c = hc$.",
          "梯形法对两端的斜率取平均：$y_{n+1} = y_n + \\frac{h}{2}\\left(f(y_n) + f(y_{n+1})\\right)$。对 $y' = -\\lambda y + c$，\n\n$$\\left(1 + \\frac{h\\lambda}{2}\\right)y_{n+1} = \\left(1 - \\frac{h\\lambda}{2}\\right)y_n + hc.$$\n\n常数强迫项在两端都出现，所以贡献 $\\frac{h}{2}c + \\frac{h}{2}c = hc$。",
        ),
        generate(rng: Rng): Problem {
          const lam = rng.int(1, 8);
          const c = rng.int(1, 9);
          const h = rng.pick([Q.of(1, 2), Q.one, Q.of(1, 4)]);
          const yn = Q.of(rng.int(1, 20));
          const z = h.mul(Q.of(lam)).div(Q.of(2));
          const num = Q.one
            .sub(z)
            .mul(yn)
            .add(h.mul(Q.of(c)));
          const ans = num.div(Q.one.add(z));
          return numberProblem({
            prompt: t(
              `Apply one trapezoidal step with $h = ${dec(h)}$ to $y' = -${lam === 1 ? "" : lam}y + ${c}$ from $y_n = ${yn.toLatex()}$. Find $y_{n+1}$.`,
              `用步长 $h = ${dec(h)}$ 的梯形法对 $y' = -${lam === 1 ? "" : lam}y + ${c}$ 从 $y_n = ${yn.toLatex()}$ 计算一步。求 $y_{n+1}$。`,
            ),
            answer: ans,
            wrong: [
              Q.one
                .sub(z)
                .mul(yn)
                .add(h.mul(Q.of(c)).div(Q.of(2)))
                .div(Q.one.add(z)),
              Q.one.sub(z).mul(yn).div(Q.one.add(z)),
              yn.add(h.mul(Q.of(c)).sub(h.mul(Q.of(lam)).mul(yn))),
            ].filter((v) => !v.eq(ans)),
            solution: t(
              `$\\frac{h\\lambda}{2} = ${z.toLatex()}$, so $\\left(1 + ${z.toLatex()}\\right)y_{n+1} = \\left(1 - ${z.toLatex()}\\right) \\cdot ${yn.toLatex()} + ${dec(h)} \\cdot ${c} = ${num.toLatex()}$ and $y_{n+1} = ${ans.toLatex()}$.`,
              `$\\frac{h\\lambda}{2} = ${z.toLatex()}$，所以 $\\left(1 + ${z.toLatex()}\\right)y_{n+1} = \\left(1 - ${z.toLatex()}\\right) \\cdot ${yn.toLatex()} + ${dec(h)} \\cdot ${c} = ${num.toLatex()}$，$y_{n+1} = ${ans.toLatex()}$。`,
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
    prerequisites: ["the-implicit-euler-method"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "implicit-euler-newton-jacobian",
        title: t("Jacobian evaluation in Newton iteration for implicit Euler", "隐式欧拉牛顿迭代中的雅可比导数值计算"),
        explanation: t(
          "Each implicit step solves an equation for the new value, and Newton's method needs the derivative of that equation with respect to the unknown. For $g(y) = y - y_n - h f(t_{n+1}, y) = 0$, the derivative is $g'(y) = 1 - h f_y(t_{n+1}, y)$. For $f(t, y) = -k y$, $g'(y) = 1 + h k$.",
          "每一个隐式步都要解关于新值的方程，牛顿法需要这个方程对未知数的导数。定义残差函数 $g(y) = y - y_n - h f(t_{n+1}, y) = 0$，其导数为 $g'(y) = 1 - h f_y(t_{n+1}, y)$。当 $f(t, y) = -k y$ 时，$g'(y) = 1 + h k$。",
        ),
        generate(rng: Rng): Problem {
          const k = rng.int(2, 35);
          const ans = 1 + k;

          const prompt = t(
            `In solving the nonlinear equation $g(y) = y - y_n - h f(t_{n+1}, y) = 0$ arising from implicit Euler with step size $h = 1$ and $f(t, y) = -${k}y$, evaluate the Newton iteration derivative $g'(y)$.`,
            `在求解隐式欧拉法步长 $h = 1$、右端项 $f(t, y) = -${k}y$ 对应的非线性残差方程 $g(y) = y - y_n - h f(t_{n+1}, y) = 0$ 时，计算牛顿迭代导数 $g'(y)$ 的值。`,
          );
          const solution = t(
            steps(
              `The residual function is $g(y) = y - y_n - h f(t_{n+1}, y)$.`,
              `Differentiating with respect to $y$: $g'(y) = 1 - h \\frac{\\partial f}{\\partial y}$.`,
              `Here $\\frac{\\partial f}{\\partial y} = -${k}$ and $h = 1$, so $g'(y) = 1 - 1(-${k}) = 1 + ${k} = ${ans}$.`,
            ),
            steps(
              `残差函数为 $g(y) = y - y_n - h f(t_{n+1}, y)$。`,
              `对未知数 $y$ 求导：$g'(y) = 1 - h \\frac{\\partial f}{\\partial y}$。`,
              `此处 $\\frac{\\partial f}{\\partial y} = -${k}$ 且 $h = 1$，因此 $g'(y) = 1 - 1(-${k}) = 1 + ${k} = ${ans}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [k, 1 - k, 2 * k, ans + 1, ans - 1],
          });
        },
      },
      {
        id: "one-newton-iteration-for-a-backward-euler-step",
        title: t("One Newton iteration for a backward Euler step", "后向欧拉步中的一次牛顿迭代"),
        explanation: t(
          "For $y' = -y^{2}$, a backward Euler step must solve $g(y) = y - y_n + hy^{2} = 0$, with $g'(y) = 1 + 2hy$. Starting from the guess $y^{(0)} = y_n$, one Newton iteration gives\n\n$$y^{(1)} = y_n - \\frac{g(y_n)}{g'(y_n)} = y_n - \\frac{hy_n^{2}}{1 + 2hy_n}.$$\n\nIn practice one or two iterations are enough, since $y_n$ is already close to $y_{n+1}$.",
          "对 $y' = -y^{2}$，后向欧拉一步需解 $g(y) = y - y_n + hy^{2} = 0$，且 $g'(y) = 1 + 2hy$。从初始猜测 $y^{(0)} = y_n$ 出发，一次牛顿迭代得\n\n$$y^{(1)} = y_n - \\frac{g(y_n)}{g'(y_n)} = y_n - \\frac{hy_n^{2}}{1 + 2hy_n}.$$\n\n实际中一两次迭代就够了，因为 $y_n$ 已经接近 $y_{n+1}$。",
        ),
        generate(rng: Rng): Problem {
          const h = rng.pick([Q.of(1, 2), Q.of(1, 10), Q.of(1, 4), Q.of(1, 5)]);
          const yn = Q.of(rng.int(1, 8));
          const g = h.mul(yn.pow(2));
          const gp = Q.one.add(Q.of(2).mul(h).mul(yn));
          const ans = yn.sub(g.div(gp));
          return numberProblem({
            prompt: t(
              `A backward Euler step with $h = ${dec(h)}$ for $y' = -y^{2}$ from $y_n = ${yn.toLatex()}$ requires solving $g(y) = y - y_n + hy^{2} = 0$. Perform one Newton iteration from $y^{(0)} = y_n$ to find $y^{(1)}$.`,
              `对 $y' = -y^{2}$ 从 $y_n = ${yn.toLatex()}$ 出发、步长 $h = ${dec(h)}$ 的后向欧拉一步需解 $g(y) = y - y_n + hy^{2} = 0$。从 $y^{(0)} = y_n$ 出发做一次牛顿迭代，求 $y^{(1)}$。`,
            ),
            answer: ans,
            wrong: [yn.sub(g), yn.sub(g.div(Q.one.add(h.mul(yn)))), yn.add(g.div(gp))].filter((v) => !v.eq(ans)),
            solution: t(
              `$g(${yn.toLatex()}) = ${dec(h)} \\cdot ${yn.toLatex()}^{2} = ${g.toLatex()}$ and $g'(${yn.toLatex()}) = 1 + 2 \\cdot ${par(h)} \\cdot ${yn.toLatex()} = ${gp.toLatex()}$, so $y^{(1)} = ${yn.toLatex()} - \\frac{${g.toLatex()}}{${gp.toLatex()}} = ${ans.toLatex()}$.`,
              `$g(${yn.toLatex()}) = ${dec(h)} \\cdot ${yn.toLatex()}^{2} = ${g.toLatex()}$，$g'(${yn.toLatex()}) = 1 + 2 \\cdot ${par(h)} \\cdot ${yn.toLatex()} = ${gp.toLatex()}$，所以 $y^{(1)} = ${yn.toLatex()} - \\frac{${g.toLatex()}}{${gp.toLatex()}} = ${ans.toLatex()}$。`,
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
    prerequisites: ["the-trapezoidal-method", "using-the-implicit-euler-method-with-newtons-method"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "trapezoidal-newton-jacobian",
        title: t("Jacobian evaluation in Newton iteration for trapezoidal method", "梯形法牛顿迭代中的导数值计算"),
        explanation: t(
          "The trapezoidal equation contains the slope at the new point with half weight, so its derivative has half the factor that the implicit Euler method has. For $g(y) = y - y_n - \\frac{h}{2}f_n - \\frac{h}{2}f(t_{n+1}, y) = 0$, $g'(y) = 1 - \\frac{h}{2} f_y(t_{n+1}, y)$. For $f_y = -2k$ and $h = 1$, $g'(y) = 1 + k$.",
          "梯形法的方程以一半的权重包含新点处的斜率，所以它的导数中的因子是隐式欧拉法的一半。对于残差方程 $g(y) = y - y_n - \\frac{h}{2}f_n - \\frac{h}{2}f(t_{n+1}, y) = 0$，其导数为 $g'(y) = 1 - \\frac{h}{2} f_y(t_{n+1}, y)$。当 $f_y = -2k$ 且 $h = 1$ 时，$g'(y) = 1 + k$。",
        ),
        generate(rng: Rng): Problem {
          const k = rng.int(2, 35);
          const coeff = 2 * k;
          const ans = 1 + k;

          const prompt = t(
            `In the trapezoidal method with step size $h = 1$ applied to an equation where $\\frac{\\partial f}{\\partial y} = -${coeff}$, find the derivative $g'(y)$ of the residual function $g(y) = y - y_n - \\frac{h}{2}f_n - \\frac{h}{2}f(t_{n+1}, y)$.`,
            `对导数满足 $\\frac{\\partial f}{\\partial y} = -${coeff}$ 的方程应用步长 $h = 1$ 的梯形法。计算残差函数 $g(y) = y - y_n - \\frac{h}{2}f_n - \\frac{h}{2}f(t_{n+1}, y)$ 的导数 $g'(y)$。`,
          );
          const solution = t(
            steps(
              `Differentiate the residual function with respect to $y$: $g'(y) = 1 - \\frac{h}{2} \\frac{\\partial f}{\\partial y}$.`,
              `Substitute $h = 1$ and $\\frac{\\partial f}{\\partial y} = -${coeff}$: $g'(y) = 1 - \\frac{1}{2}(-${coeff}) = 1 + ${k} = ${ans}$.`,
            ),
            steps(
              `对残差函数关于未知量 $y$ 求导：$g'(y) = 1 - \\frac{h}{2} \\frac{\\partial f}{\\partial y}$。`,
              `代入 $h = 1$ 与 $\\frac{\\partial f}{\\partial y} = -${coeff}$：$g'(y) = 1 - \\frac{1}{2}(-${coeff}) = 1 + ${k} = ${ans}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [k, coeff, 1 + coeff, ans + 1, ans - 1],
          });
        },
      },
      {
        id: "one-newton-iteration-for-a-trapezoidal-step",
        title: t("One Newton iteration for a trapezoidal step", "梯形法步中的一次牛顿迭代"),
        explanation: t(
          "For $y' = -y^{2}$ the trapezoidal step solves $g(y) = y - y_n + \\frac{h}{2}(y_n^{2} + y^{2}) = 0$, with $g'(y) = 1 + hy$. From $y^{(0)} = y_n$, $g(y_n) = hy_n^{2}$ and\n\n$$y^{(1)} = y_n - \\frac{hy_n^{2}}{1 + hy_n}.$$\n\nCompared with backward Euler, the derivative has $h$ in place of $2h$, because only half of the new slope enters the step.",
          "对 $y' = -y^{2}$，梯形法一步需解 $g(y) = y - y_n + \\frac{h}{2}(y_n^{2} + y^{2}) = 0$，且 $g'(y) = 1 + hy$。从 $y^{(0)} = y_n$ 出发，$g(y_n) = hy_n^{2}$，\n\n$$y^{(1)} = y_n - \\frac{hy_n^{2}}{1 + hy_n}.$$\n\n与后向欧拉法相比，导数中是 $h$ 而不是 $2h$，因为新斜率只有一半进入这一步。",
        ),
        generate(rng: Rng): Problem {
          const h = rng.pick([Q.of(1, 2), Q.of(1, 10), Q.of(1, 4), Q.of(1, 5)]);
          const yn = Q.of(rng.int(1, 8));
          const g = h.mul(yn.pow(2));
          const gp = Q.one.add(h.mul(yn));
          const ans = yn.sub(g.div(gp));
          return numberProblem({
            prompt: t(
              `A trapezoidal step with $h = ${dec(h)}$ for $y' = -y^{2}$ from $y_n = ${yn.toLatex()}$ requires solving $g(y) = y - y_n + \\frac{h}{2}(y_n^{2} + y^{2}) = 0$. Perform one Newton iteration from $y^{(0)} = y_n$ to find $y^{(1)}$.`,
              `对 $y' = -y^{2}$ 从 $y_n = ${yn.toLatex()}$ 出发、步长 $h = ${dec(h)}$ 的梯形法一步需解 $g(y) = y - y_n + \\frac{h}{2}(y_n^{2} + y^{2}) = 0$。从 $y^{(0)} = y_n$ 出发做一次牛顿迭代，求 $y^{(1)}$。`,
            ),
            answer: ans,
            wrong: [yn.sub(g.div(Q.one.add(Q.of(2).mul(h).mul(yn)))), yn.sub(g), yn.sub(g.div(Q.of(2)).div(gp))].filter((v) => !v.eq(ans)),
            solution: t(
              `$g(${yn.toLatex()}) = \\frac{${dec(h)}}{2} \\cdot 2 \\cdot ${yn.toLatex()}^{2} = ${g.toLatex()}$ and $g'(${yn.toLatex()}) = 1 + ${dec(h)} \\cdot ${yn.toLatex()} = ${gp.toLatex()}$, so $y^{(1)} = ${yn.toLatex()} - \\frac{${g.toLatex()}}{${gp.toLatex()}} = ${ans.toLatex()}$.`,
              `$g(${yn.toLatex()}) = \\frac{${dec(h)}}{2} \\cdot 2 \\cdot ${yn.toLatex()}^{2} = ${g.toLatex()}$，$g'(${yn.toLatex()}) = 1 + ${dec(h)} \\cdot ${yn.toLatex()} = ${gp.toLatex()}$，所以 $y^{(1)} = ${yn.toLatex()} - \\frac{${g.toLatex()}}{${gp.toLatex()}} = ${ans.toLatex()}$。`,
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
    prerequisites: ["big-o-notation"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "local-vs-global-error-order",
        title: t("Global error order from local truncation error order", "由局部截断误差阶确定全局误差阶"),
        explanation: t(
          "If the local truncation error of a numerical method is $O(h^{k+1})$, the global accumulated error over a fixed integration interval is $O(h^k)$.",
          "若数值方法的局部截断误差为 $O(h^{k+1})$，则在固定积分区间内累积的全局误差阶次为 $O(h^k)$。",
        ),
        generate(rng: Rng): Problem {
          const k = rng.int(2, 35);
          const localOrder = k + 1;
          const ans = k;

          const prompt = t(
            `A numerical integration scheme has local truncation error $O(h^{${localOrder}})$. What is the order of its global accumulated error over a fixed finite interval?`,
            `某数值积分算法的单步局部截断误差为 $O(h^{${localOrder}})$。求该算法在固定有限区间上的全局累积误差阶次。`,
          );
          const solution = t(
            steps(
              `Over a fixed interval $[t_0, T]$, the number of steps required is $N = \\frac{T - t_0}{h} = O(h^{-1})$.`,
              `The global error is approximately the sum of $N$ local errors: $E_{\\text{global}} \\approx N \\cdot O(h^{${localOrder}}) = O(h^{-1}) \\cdot O(h^{${localOrder}}) = O(h^{${ans}})$.`,
              `Thus the global order is $${ans}$.`,
            ),
            steps(
              `在固定时间区间 $[t_0, T]$ 上，总计算步数为 $N = \\frac{T - t_0}{h} = O(h^{-1})$。`,
              `全局累积误差约为 $N$ 步局部误差之和：$E_{\\text{global}} \\approx N \\cdot O(h^{${localOrder}}) = O(h^{-1}) \\cdot O(h^{${localOrder}}) = O(h^{${ans}})$。`,
              `因此全局误差阶次为 ${ans}。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [localOrder, localOrder + 1, ans - 1, 2 * ans],
          });
        },
      },
      {
        id: "the-global-error-of-euler-on-a-linear-slope",
        title: t("The global error of Euler's method on a linear slope", "欧拉法在线性斜率上的整体误差"),
        explanation: t(
          "For $y' = ct$, $y(0) = 0$ the exact solution is $\\frac{c}{2}t^{2}$. Euler's method uses the slope at the left end of each step, so after $N$ steps of size $h$ it gives\n\n$$y_N = h\\sum_{n=0}^{N-1}c\\,nh = \\frac{c}{2}h^{2}N(N - 1).$$\n\nWith $T = Nh$ the error is $\\frac{c}{2}T^{2} - y_N = \\frac{c}{2}hT$: proportional to $h$, as a first-order method should be.",
          "对 $y' = ct$，$y(0) = 0$，精确解为 $\\frac{c}{2}t^{2}$。欧拉法在每一步使用左端点处的斜率，所以步长为 $h$ 的 $N$ 步之后得\n\n$$y_N = h\\sum_{n=0}^{N-1}c\\,nh = \\frac{c}{2}h^{2}N(N - 1).$$\n\n令 $T = Nh$，误差为 $\\frac{c}{2}T^{2} - y_N = \\frac{c}{2}hT$：与 $h$ 成正比，符合一阶方法的特点。",
        ),
        generate(rng: Rng): Problem {
          const c = rng.int(1, 8);
          const h = rng.pick([Q.of(1, 2), Q.of(1, 10), Q.of(1, 5), Q.of(1, 4)]);
          const T = Q.of(rng.int(1, 4));
          const n = T.div(h);
          const exact = Q.of(c, 2).mul(T.pow(2));
          const approx = Q.of(c, 2).mul(h.pow(2)).mul(n).mul(n.sub(Q.one));
          const ans = exact.sub(approx);
          return numberProblem({
            prompt: t(
              `Euler's method with $h = ${dec(h)}$ is applied to $y' = ${c === 1 ? "" : c}t$, $y(0) = 0$ up to $t = ${T.toLatex()}$. Find the global error $y(${T.toLatex()}) - y_N$.`,
              `用步长 $h = ${dec(h)}$ 的欧拉法求解 $y' = ${c === 1 ? "" : c}t$，$y(0) = 0$，直到 $t = ${T.toLatex()}$。求整体误差 $y(${T.toLatex()}) - y_N$。`,
            ),
            answer: ans,
            form: "decimal",
            wrong: [ans.mul(Q.of(2)), Q.of(c, 2).mul(h.pow(2)), approx].filter((v) => !v.eq(ans)),
            solution: t(
              steps(
                `$N = ${n.toLatex()}$ steps. The exact value is $${Q.of(c, 2).toLatex()} \\cdot ${T.toLatex()}^{2} = ${dec(exact)}$.`,
                `Euler gives $y_N = \\frac{c}{2}h^{2}N(N - 1) = ${dec(approx)}$, so the error is $${dec(exact)} - ${dec(approx)} = ${dec(ans)}$, which equals $\\frac{c}{2}hT$.`,
              ),
              steps(
                `共 $N = ${n.toLatex()}$ 步。精确值为 $${Q.of(c, 2).toLatex()} \\cdot ${T.toLatex()}^{2} = ${dec(exact)}$。`,
                `欧拉法给出 $y_N = \\frac{c}{2}h^{2}N(N - 1) = ${dec(approx)}$，所以误差为 $${dec(exact)} - ${dec(approx)} = ${dec(ans)}$，等于 $\\frac{c}{2}hT$。`,
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
    prerequisites: ["error-in-numerical-methods"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "order-convergence-ratio",
        title: t("Error reduction factor under step size refinement for second-order methods", "二阶方法在步长细化下的误差缩减倍数"),
        explanation: t(
          "For a numerical method of convergence order $p = 2$, dividing the step size by $M$ scales the global error bound by $\\left(\\frac{1}{M}\\right)^2$, shrinking it by a factor of $M^2$.",
          "对于收敛阶为 $p = 2$ 的二阶数值算法，将步长缩减至原来的 $1/M$ 会使全局误差界缩小至原来的 $(1/M)^2$，即误差减小 $M^2$ 倍。",
        ),
        generate(rng: Rng): Problem {
          const M = rng.int(2, 35);
          const ans = M * M;

          const prompt = t(
            `A second-order numerical integration method ($p = 2$) has global error scaling as $E(h) = C h^2$. By what factor does the global error decrease when the step size $h$ is divided by ${M}?`,
            `某二阶数值算法（$p = 2$）的全局误差满足 $E(h) = C h^2$。当计算步长 $h$ 缩小为原来的 $1/${M}$ 时，全局误差将减小多少倍？`,
          );
          const solution = t(
            steps(
              `The global error formula is $E(h) = C h^2$.`,
              `Replacing $h$ with $h/${M}$ gives $E(h/${M}) = C \\left(\\frac{h}{${M}}\\right)^2 = \\frac{1}{${M}^2} E(h)$.`,
              `Therefore, the error is reduced by a factor of $${M}^2 = ${ans}$.`,
            ),
            steps(
              `全局误差公式为 $E(h) = C h^2$。`,
              `将步长更新为 $h/${M}$：$E(h/${M}) = C \\left(\\frac{h}{${M}}\\right)^2 = \\frac{1}{${M}^2} E(h)$。`,
              `因此全局误差减小了 $${M}^2 = ${ans}$ 倍。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [M, 2 * M, M * M * M, ans + 1, ans - 1],
          });
        },
      },
      {
        id: "estimating-the-order-from-two-errors",
        title: t("Estimating the order from two errors", "由两个误差估计阶数"),
        explanation: t(
          "If $E(h) \\approx Ch^{p}$, halving the step divides the error by $2^{p}$, so\n\n$$p \\approx \\log_2\\frac{E(h)}{E(h/2)}.$$\n\nFor errors $0.048$ and $0.006$ the ratio is $8 = 2^{3}$, so the method is third order. The ratio itself is not the order; take its logarithm in the base by which the step was divided.",
          "若 $E(h) \\approx Ch^{p}$，步长减半会使误差除以 $2^{p}$，所以\n\n$$p \\approx \\log_2\\frac{E(h)}{E(h/2)}.$$\n\n若误差为 $0.048$ 与 $0.006$，比值为 $8 = 2^{3}$，所以方法是三阶的。比值本身不是阶数；要以步长缩小的倍数为底取对数。",
        ),
        generate(rng: Rng): Problem {
          const p = rng.int(1, 4);
          const base = rng.pick([2, 10]);
          const e2 = Q.of(rng.int(1, 9), 10 ** rng.int(3, 5));
          const e1 = e2.mul(Q.of(base ** p));
          const ratio = base ** p;
          return numberProblem({
            prompt: t(
              `A method gives global error $${dec(e1)}$ with step $h$ and $${dec(e2)}$ with step $\\frac{h}{${base}}$. Estimate its order $p$.`,
              `某方法在步长为 $h$ 时整体误差为 $${dec(e1)}$，步长为 $\\frac{h}{${base}}$ 时为 $${dec(e2)}$。估计它的阶数 $p$。`,
            ),
            answer: p,
            wrong: [ratio, p + 1, p - 1].filter((w) => w !== p && w > 0),
            solution: t(
              `The ratio is $\\frac{${dec(e1)}}{${dec(e2)}} = ${ratio} = ${base}^{${p}}$, so $p = \\log_{${base}} ${ratio} = ${p}$.`,
              `比值为 $\\frac{${dec(e1)}}{${dec(e2)}} = ${ratio} = ${base}^{${p}}$，所以 $p = \\log_{${base}} ${ratio} = ${p}$。`,
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
    prerequisites: ["order-of-numerical-methods", "the-implicit-euler-method"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "explicit-euler-stability-limit",
        title: t("Critical decay rate for explicit Euler stability boundary", "显式欧拉法临界稳定衰减率计算"),
        explanation: t(
          "For the test equation $y' = -\\lambda y$, explicit Euler yields amplification factor $R(h\\lambda) = 1 - h\\lambda$. Stability requires $|1 - h\\lambda| \\le 1 \\implies h\\lambda \\le 2$. At stability threshold with step size $h$, $\\lambda_{\\max} = 2 / h$.",
          "对于试验方程 $y' = -\\lambda y$，显式欧拉法的增长因子为 $R(h\\lambda) = 1 - h\\lambda$。数值稳定性要求 $|1 - h\\lambda| \\le 1 \\implies h\\lambda \\le 2$。对于给定步长 $h$，允许的最大衰减率为 $\\lambda_{\\max} = 2 / h$。",
        ),
        generate(rng: Rng): Problem {
          const k = rng.int(2, 35);
          const ans = k;
          // Let h = 2 / k, so lambda_max = k. To keep h integer in problem text, formulate as:
          // For decay rate lambda = 2*k, maximum stable step size is 1/k.
          // Or: amplification factor magnitude when h*lambda = 1 + k is |1 - (1 + k)| = k.

          const prompt = t(
            `In explicit Euler integration with step size $h = 1$, suppose the test equation is $y' = -${k + 1}y$. Evaluate the magnitude of the amplification factor $|R(h\\lambda)| = |1 - h\\lambda|$.`,
            `在使用步长 $h = 1$ 的显式欧拉法求解试验方程 $y' = -${k + 1}y$ 时，计算单步增长因子的绝对值 $|R(h\\lambda)| = |1 - h\\lambda|$。`,
          );
          const solution = t(
            steps(
              `The amplification factor for explicit Euler on $y' = -\\lambda y$ is $R(z) = 1 - z$, where $z = h\\lambda$.`,
              `Substitute $h = 1$ and $\\lambda = ${k + 1}$: $z = 1(${k + 1}) = ${k + 1}$.`,
              `Thus $R(z) = 1 - (${k + 1}) = -${k}$.`,
              `The magnitude is $|R(z)| = |-${k}| = ${ans}$. Since this exceeds $1$, the numerical solution is unstable.`,
            ),
            steps(
              `显式欧拉法在试验方程 $y' = -\\lambda y$ 上的单步增长因子为 $R(z) = 1 - z$（其中 $z = h\\lambda$）。`,
              `代入 $h = 1$ 与 $\\lambda = ${k + 1}$：$z = 1(${k + 1}) = ${k + 1}$。`,
              `因此 $R(z) = 1 - (${k + 1}) = -${k}$。`,
              `取绝对值得到放大倍数 $|R(z)| = |-${k}| = ${ans}$。因该值大于 $1$，数值计算呈发散不稳定状态。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [k + 1, k - 1, 1, 2 * k],
          });
        },
      },
      {
        id: "the-stable-step-size-for-a-stiff-system",
        title: t("The stable step size for a stiff system", "刚性方程组的稳定步长"),
        explanation: t(
          "For $\\mathbf{x}' = A\\mathbf{x}$ with real negative eigenvalues $-\\lambda_i$, explicit Euler is stable only if $h\\lambda_i \\le 2$ for every eigenvalue, so\n\n$$h \\le \\frac{2}{\\lambda_{\\max}}.$$\n\nThe fastest-decaying component sets the limit, even after it has long since died out: this is what makes a system stiff, and why implicit methods are preferred for it. For a triangular matrix the eigenvalues are the diagonal entries.",
          "对实特征值为 $-\\lambda_i$（均为负）的 $\\mathbf{x}' = A\\mathbf{x}$，显式欧拉法仅当对每个特征值都有 $h\\lambda_i \\le 2$ 时稳定，所以\n\n$$h \\le \\frac{2}{\\lambda_{\\max}}.$$\n\n衰减最快的分量决定了这个限制，即使它早已消失：这正是方程组刚性的含义，也是对它更宜用隐式方法的原因。三角矩阵的特征值就是其对角元。",
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
            wrong: [Q.of(2, l1), Q.of(1, l2), Q.of(2, l1 + l2)].filter((v) => !v.eq(ans) && isTerminating(v)),
            solution: t(
              `The matrix is triangular, so its eigenvalues are $-${d1}$ and $-${d2}$. Stability needs $${l2}h \\le 2$ and $${l1 === 1 ? "" : l1}h \\le 2$; the first is stricter, so $h \\le \\frac{2}{${l2}} = ${dec(ans)}$.`,
              `矩阵是三角矩阵，特征值为 $-${d1}$ 与 $-${d2}$。稳定要求 $${l2}h \\le 2$ 且 $${l1 === 1 ? "" : l1}h \\le 2$；前者更严格，所以 $h \\le \\frac{2}{${l2}} = ${dec(ans)}$。`,
            ),
          });
        },
      },
    ],
  },
];
