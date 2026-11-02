import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { numberProblem, steps } from "../problems.ts";

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
          "For $y' = b x + y$ with $y(0) = a$, differentiating gives $y'' = b + y'$. At $x = 0$, $y'(0) = y(0) = a$, so $y''(0) = b + a$.",
          "对于微分方程 $y' = b x + y$（初值 $y(0) = a$），两边求导得 $y'' = b + y'$。在 $x = 0$ 处，$y'(0) = y(0) = a$，因此 $y''(0) = b + a$。",
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
    ],
  },

  // 7.22.3 Power Series Solutions of Differential Equations
  {
    id: "power-series-solutions-of-differential-equations",
    title: t("Power Series Solutions of Differential Equations", "常微分方程的幂级数解法"),
    summary: t(
      "Near an ordinary point, substituting y = sum a_n x^n yields a recurrence relation that generates all series coefficients from a_0 and a_1.",
      "在常点邻域内，代入幂级数 y = sum a_n x^n 可导出递推关系，由 a_0 与 a_1 确定全部级数展开系数。",
    ),
    prerequisites: ["taylor-series-solutions-of-differential-equations"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "power-series-recurrence-step",
        title: t("Calculating higher coefficient from power series recurrence", "由幂级数递推关系计算高阶系数"),
        explanation: t(
          "For $y'' - k y = 0$, substituting $y = \\sum a_n x^n$ gives $(n+2)(n+1)a_{n+2} = k a_n$. For $n = 0$, $a_2 = \\frac{k a_0}{2}$.",
          "对于方程 $y'' - k y = 0$，代入 $y = \\sum a_n x^n$ 得递推公式 $(n+2)(n+1)a_{n+2} = k a_n$。当 $n = 0$ 时，$a_2 = \\frac{k a_0}{2}$。",
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
    ],
  },

  // 7.22.4 Regular Singular Points
  {
    id: "regular-singular-points",
    title: t("Regular Singular Points", "正则奇点"),
    summary: t(
      "A singular point x0 of P(x)y'' + Q(x)y' + R(x)y = 0 is regular if (x - x0)Q/P and (x - x0)^2 R/P remain analytic.",
      "若在奇点 x0 处，(x - x0)Q/P 与 (x - x0)^2 R/P 均解析，则称 x0 为微分方程的正则奇点。",
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
    ],
  },

  // 7.22.5 The Method of Frobenius
  {
    id: "the-method-of-frobenius",
    title: t("The Method of Frobenius", "弗罗贝尼乌斯方法"),
    summary: t(
      "The method of Frobenius posits a generalized series solution y = x^r sum a_n x^n, determining index r from the indicial polynomial.",
      "弗罗贝尼乌斯方法采用广义幂级数试探解 y = x^r sum a_n x^n，通过指标方程确定特征指标 r。",
    ),
    prerequisites: ["regular-singular-points"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "frobenius-indicial-root",
        title: t("Larger root of the Frobenius indicial equation", "弗罗贝尼乌斯指标方程的较大根"),
        explanation: t(
          "For $x^2 y'' - r_1 x y' + r_1 y = 0$, the indicial equation is $r(r - 1) - r_1 r + r_1 = (r - 1)(r - r_1) = 0$. The roots are $r = 1$ and $r = r_1$.",
          "对于方程 $x^2 y'' - r_1 x y' + r_1 y = 0$，指标方程为 $r(r - 1) - r_1 r + r_1 = (r - 1)(r - r_1) = 0$。其根为 $r = 1$ 与 $r = r_1$。",
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
          "For $x y'' + c y' + y = 0$ with $r = 0$, equating the $x^0$ term gives $1(c) a_1 + a_0 = 0 \\implies a_1 = -a_0 / c$.",
          "对于方程 $x y'' + c y' + y = 0$（取指标 $r = 0$），令 $x^0$ 项系数为零得 $1(c) a_1 + a_0 = 0 \\implies a_1 = -a_0 / c$。",
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
          "For $2 x^2 y'' + x y' - k(2k - 1) y = 0$, the indicial equation is $2r(r - 1) + r - k(2k - 1) = (2r + 2k - 1)(r - k) = 0$. The larger positive exponent is $r = k$.",
          "对于方程 $2 x^2 y'' + x y' - k(2k - 1) y = 0$，指标方程为 $2r(r - 1) + r - k(2k - 1) = (2r + 2k - 1)(r - k) = 0$。较大的正指标为 $r = k$。",
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
    ],
  },

  // 7.23.3 The Modified Euler Method
  {
    id: "the-modified-euler-method",
    title: t("The Modified Euler Method", "改进欧拉法"),
    summary: t(
      "The modified Euler method (Heun's predictor-corrector) averages slopes at the start and predicted end of each step, achieving second-order accuracy O(h^2).",
      "改进欧拉法（休恩预估-校正法）对步首与预估步末的斜率进行算术平均，达到二阶精度 O(h^2)。",
    ),
    prerequisites: ["eulers-method-calculating-multiple-steps"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "modified-euler-predictor-corrector-step",
        title: t("Executing one step of the modified Euler method", "执行一步改进欧拉预估-校正计算"),
        explanation: t(
          "For $y' = 2t$ with $y(0) = y_0$ and step $h = 1$: slope $k_1 = 2(0) = 0$. Predictor $\\tilde{y}_1 = y_0$. Slope $k_2 = 2(1) = 2$. Corrector $y_1 = y_0 + \\frac{1}{2}(0 + 2) = y_0 + 1$.",
          "对于 $y' = 2t$（初值 $y(0) = y_0$，步长 $h = 1$）：步首斜率 $k_1 = 0$。预估值 $\\tilde{y}_1 = y_0$。步末斜率 $k_2 = 2$。校正值 $y_1 = y_0 + \\frac{1}{2}(0 + 2) = y_0 + 1$。",
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
    ],
  },

  // 7.23.4 Euler's Method for Systems of ODEs
  {
    id: "eulers-method-for-systems-of-odes",
    title: t("Euler's Method for Systems of ODEs", "微分方程组的欧拉法"),
    summary: t(
      "Vector Euler updates the state vector simultaneously: x_{n+1} = x_n + h f(t_n, x_n).",
      "向量形式的欧拉法同时更新状态向量中的所有分量：x_{n+1} = x_n + h f(t_n, x_n)。",
    ),
    prerequisites: ["the-modified-euler-method"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "vector-euler-step-component",
        title: t("Computing a state component after one Euler step", "计算欧拉一步后的状态分量"),
        explanation: t(
          "For $\\mathbf{x}' = A \\mathbf{x}$ with $\\mathbf{x}_0 = \\begin{pmatrix} 0 \\\\ v_0 \\end{pmatrix}$ and $A = \\begin{pmatrix} 0 & 1 \\\\ -1 & 0 \\end{pmatrix}$, $A \\mathbf{x}_0 = \\begin{pmatrix} v_0 \\\\ 0 \\end{pmatrix}$. For $h = 1$, $\\mathbf{x}_1 = \\begin{pmatrix} v_0 \\\\ v_0 \\end{pmatrix}$. The first component is $v_0$.",
          "对于系统 $\\mathbf{x}' = A \\mathbf{x}$（初值 $\\mathbf{x}_0 = \\begin{pmatrix} 0 \\\\ v_0 \\end{pmatrix}$，转移矩阵 $A = \\begin{pmatrix} 0 & 1 \\\\ -1 & 0 \\end{pmatrix}$），导数向量为 $A \\mathbf{x}_0 = \\begin{pmatrix} v_0 \\\\ 0 \\end{pmatrix}$。步长 $h = 1$ 时，$\\mathbf{x}_1 = \\begin{pmatrix} v_0 \\\\ v_0 \\end{pmatrix}$，第一分量为 $v_0$。",
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
          "For $y'' = f(t, y, v)$, setting $y' = v$ gives the Euler position update $y_1 = y_0 + h v_0$. When $y_0 = 0$ and $h = 1$, $y_1 = v_0$.",
          "令 $y' = v$，二阶微分方程的位置更新公式为 $y_1 = y_0 + h v_0$。当 $y_0 = 0$ 且 $h = 1$ 时，一步后的位置即为 $y_1 = v_0$。",
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
    ],
  },

  // 7.24.1 The RK4 Method
  {
    id: "the-rk4-method",
    title: t("The RK4 Method", "四阶龙格-库塔法（RK4）"),
    summary: t(
      "The classic fourth-order Runge-Kutta method achieves global error O(h^4) by blending four stage evaluations with Simpson's rule weights (1/6, 2/6, 2/6, 1/6).",
      "经典四阶龙格-库塔法结合四级斜率估算并按辛普森规则权重 (1/6, 2/6, 2/6, 1/6) 加权平均，实现全局 O(h^4) 高精度。",
    ),
    prerequisites: ["the-modified-euler-method"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "rk4-weighted-average-step",
        title: t("Evaluating the weighted slope average in the RK4 update", "计算 RK4 更新公式中的加权斜率平均"),
        explanation: t(
          "The RK4 update formula is $y_{n+1} = y_n + \\frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)$. For step size $h = 6$, $y_{n+1} = y_n + k_1 + 2k_2 + 2k_3 + k_4$.",
          "RK4 的步进更新公式为 $y_{n+1} = y_n + \\frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)$。当步长 $h = 6$ 时，更新公式简化为 $y_{n+1} = y_n + k_1 + 2k_2 + 2k_3 + k_4$。",
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
          "The explicit 2-step Adams-Bashforth predictor is $y_{n+1}^{(p)} = y_n + \\frac{h}{2}(3 f_n - f_{n-1})$. For $y_n = 0$, $h = 2$, $f_{n-1} = 1$, and $f_n = a$, $y_{n+1}^{(p)} = 3a - 1$.",
          "二步显式亚当斯-巴什福思预测公式为 $y_{n+1}^{(p)} = y_n + \\frac{h}{2}(3 f_n - f_{n-1})$。当 $y_n = 0$，$h = 2$，$f_{n-1} = 1$，$f_n = a$ 时，预测值为 $y_{n+1}^{(p)} = 3a - 1$。",
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
    ],
  },

  // 7.25.1 The Implicit Euler Method
  {
    id: "the-implicit-euler-method",
    title: t("The Implicit Euler Method", "隐式欧拉法"),
    summary: t(
      "The backward (implicit) Euler scheme y_{n+1} = y_n + h f(t_{n+1}, y_{n+1}) evaluates slopes at the future step, delivering unconditional A-stability.",
      "后向（隐式）欧拉格式 y_{n+1} = y_n + h f(t_{n+1}, y_{n+1}) 在未来时间步评估变化率，具备无条件 A-稳定性，适合求解刚性方程。",
    ),
    prerequisites: ["eulers-method-calculating-multiple-steps"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "implicit-euler-decay-step",
        title: t("One step of implicit Euler on a decay equation", "隐式欧拉法对指数衰减方程的一步求解"),
        explanation: t(
          "For $y' = -\\lambda y$, the implicit Euler update is $y_{n+1} = y_n - h\\lambda y_{n+1} \\implies y_{n+1} = \\frac{y_n}{1 + h\\lambda}$. When $h\\lambda = 1$, $y_{n+1} = y_n / 2$.",
          "对于衰减方程 $y' = -\\lambda y$，隐式欧拉格式为 $y_{n+1} = y_n - h\\lambda y_{n+1} \\implies y_{n+1} = \\frac{y_n}{1 + h\\lambda}$。当 $h\\lambda = 1$ 时，$y_{n+1} = y_n / 2$。",
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
    ],
  },

  // 7.25.2 The Trapezoidal Method
  {
    id: "the-trapezoidal-method",
    title: t("The Trapezoidal Method", "梯形法"),
    summary: t(
      "The implicit trapezoidal method y_{n+1} = y_n + (h/2)[f_n + f_{n+1}] combines second-order accuracy with A-stability.",
      "隐式梯形法 y_{n+1} = y_n + (h/2)[f_n + f_{n+1}] 同时兼备二阶精度与 A-稳定性。",
    ),
    prerequisites: ["the-implicit-euler-method"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "trapezoidal-amplification-denominator",
        title: t("Denominators in the trapezoidal amplification factor", "梯形法增长因子中的分母项计算"),
        explanation: t(
          "Applying the trapezoidal method to $y' = -\\lambda y$ gives $y_{n+1} = y_n - \\frac{h\\lambda}{2}y_n - \\frac{h\\lambda}{2}y_{n+1} \\implies y_{n+1} = \\frac{1 - z/2}{1 + z/2} y_n$ where $z = h\\lambda$. For $z = 2k$, the denominator is $1 + k$.",
          "将梯形法应用于 $y' = -\\lambda y$ 导出 $y_{n+1} = \\frac{1 - z/2}{1 + z/2} y_n$（其中 $z = h\\lambda$）。当 $z = 2k$ 时，分母值为 $1 + k$。",
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
          "For $g(y) = y - y_n - h f(t_{n+1}, y) = 0$, the derivative is $g'(y) = 1 - h f_y(t_{n+1}, y)$. For $f(t, y) = -k y$, $g'(y) = 1 + h k$.",
          "定义残差函数 $g(y) = y - y_n - h f(t_{n+1}, y) = 0$，其导数为 $g'(y) = 1 - h f_y(t_{n+1}, y)$。当 $f(t, y) = -k y$ 时，$g'(y) = 1 + h k$。",
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
    ],
  },

  // 7.25.4 Using the Trapezoidal Method With Newton's Method
  {
    id: "using-the-trapezoidal-method-with-newtons-method",
    title: t("Using the Trapezoidal Method With Newton's Method", "结合牛顿迭代法的梯形法"),
    summary: t(
      "Applying the trapezoidal rule to nonlinear ODEs requires Newton iteration on residual g(y) = y - y_n - (h/2)[f_n + f(t_{n+1}, y)] = 0.",
      "对非线性常微分方程应用梯形法时，需对残差方程 g(y) = y - y_n - (h/2)[f_n + f(t_{n+1}, y)] = 0 进行牛顿迭代求解。",
    ),
    prerequisites: ["the-trapezoidal-method", "using-the-implicit-euler-method-with-newtons-method"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "trapezoidal-newton-jacobian",
        title: t("Jacobian evaluation in Newton iteration for trapezoidal method", "梯形法牛顿迭代中的导数值计算"),
        explanation: t(
          "For $g(y) = y - y_n - \\frac{h}{2}f_n - \\frac{h}{2}f(t_{n+1}, y) = 0$, $g'(y) = 1 - \\frac{h}{2} f_y(t_{n+1}, y)$. For $f_y = -2k$ and $h = 1$, $g'(y) = 1 + k$.",
          "对于残差方程 $g(y) = y - y_n - \\frac{h}{2}f_n - \\frac{h}{2}f(t_{n+1}, y) = 0$，其导数为 $g'(y) = 1 - \\frac{h}{2} f_y(t_{n+1}, y)$。当 $f_y = -2k$ 且 $h = 1$ 时，$g'(y) = 1 + k$。",
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
    ],
  },

  // 7.26.2 Error in Numerical Methods
  {
    id: "error-in-numerical-methods",
    title: t("Error in Numerical Methods", "数值方法的误差分析"),
    summary: t(
      "Local truncation error measures error per single step O(h^(p+1)), while global error integrates accumulated errors over N = (T - t0)/h steps to O(h^p).",
      "局部截断误差度量单步误差 O(h^(p+1))，而全局误差累积 N = (T - t0)/h 步后的误差，其阶次为 O(h^p)。",
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
    ],
  },

  // 7.26.3 Order of Numerical Methods
  {
    id: "order-of-numerical-methods",
    title: t("Order of Numerical Methods", "数值方法的收敛阶"),
    summary: t(
      "A method has convergence order p if its global error satisfies E(h) <= C h^p as step size h -> 0.",
      "若数值方法的全局误差满足 E(h) <= C h^p（当步长 h -> 0），则称该算法具有 p 阶收敛速度。",
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
    ],
  },
];
