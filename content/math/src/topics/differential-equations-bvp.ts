import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { numberProblem, steps } from "../problems.ts";

/** Topics for Unit 6: Boundary Value Problems and Fourier Series in Differential Equations. */
export const differentialEquationsBvpTopics: TopicDef[] = [
  // 6.20.1 Introduction to Boundary Value Problems
  {
    id: "introduction-to-boundary-value-problems",
    title: t("Introduction to Boundary Value Problems", "边值问题简介"),
    summary: t(
      "Boundary value problems specify conditions at two distinct points, leading to unique, infinite, or nonexistent solutions.",
      "边值问题在两个不同边界点上指定约束条件，其解可能唯一存在、有无穷多个或根本不存在。",
    ),
    prerequisites: ["second-order-homogeneous-initial-value-problems"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "bvp-midpoint-solution",
        title: t("Midpoint evaluation of a linear Dirichlet BVP", "线性狄利克雷边值问题的中点值计算"),
        explanation: t(
          "For $y'' = 0$ on $[0, L]$ with $y(0) = a$ and $y(L) = b$, the solution is the straight line $y(x) = a + \\frac{b - a}{L} x$. At the midpoint $x = L/2$, $y(L/2) = \\frac{a + b}{2}$.",
          "对于区间 $[0, L]$ 上的边值问题 $y'' = 0$（边界条件 $y(0) = a$，$y(L) = b$），其解为直线 $y(x) = a + \\frac{b - a}{L} x$。在区间中点 $x = L/2$ 处，解的值恰为两端点值的算术平均：$y(L/2) = \\frac{a + b}{2}$。",
        ),
        generate(rng: Rng): Problem {
          const k1 = rng.int(2, 35);
          const k2 = rng.int(2, 35);
          const a = 2 * k1;
          const b = 2 * k2;
          const L = rng.int(2, 10);
          const ans = k1 + k2;

          const prompt = t(
            `Solve the boundary value problem $y'' = 0$ on the interval $[0, ${L}]$ subject to boundary conditions $y(0) = ${a}$ and $y(${L}) = ${b}$. Evaluate the solution at the midpoint $x = ${L}/2$.`,
            `求解定义在区间 $[0, ${L}]$ 上的边值问题 $y'' = 0$，边界条件为 $y(0) = ${a}$ 与 $y(${L}) = ${b}$。计算中点 $x = ${L}/2$ 处的解值。`,
          );
          const solution = t(
            steps(
              `Integrate $y'' = 0$ twice: $y(x) = c_1 x + c_2$.`,
              `Apply $y(0) = ${a} \\implies c_2 = ${a}$.`,
              `Apply $y(${L}) = ${b} \\implies c_1(${L}) + ${a} = ${b} \\implies c_1 = \\frac{${b - a}}{${L}}$.`,
              `At the midpoint $x = ${L}/2$, $y(${L}/2) = ${a} + \\frac{${b - a}}{2} = \\frac{${a} + ${b}}{2} = ${ans}$.`,
            ),
            steps(
              `对 $y'' = 0$ 连续积分两次：$y(x) = c_1 x + c_2$。`,
              `由边界条件 $y(0) = ${a}$ 可知 $c_2 = ${a}$。`,
              `由 $y(${L}) = ${b}$ 得 $c_1(${L}) + ${a} = ${b} \\implies c_1 = \\frac{${b - a}}{${L}}$。`,
              `代入区间中点 $x = ${L}/2$：$y(${L}/2) = ${a} + \\frac{${b - a}}{2} = \\frac{${a} + ${b}}{2} = ${ans}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [a, b, Math.abs(a - b), a + b, ans + 1, ans - 1],
          });
        },
      },
    ],
  },

  // 6.20.2 Second-Order Homogeneous Boundary Value Problems
  {
    id: "second-order-homogeneous-boundary-value-problems",
    title: t("Second-Order Homogeneous Boundary Value Problems", "二阶齐次常微分方程边值问题"),
    summary: t(
      "Homogeneous linear BVPs with mixed Dirichlet-Neumann conditions yield unique linear solutions determined by the boundary gradient.",
      "具有混合狄利克雷-诺依曼边界条件的二阶齐次边值问题具有由边界梯度唯一确定的线性解。",
    ),
    prerequisites: ["introduction-to-boundary-value-problems"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "dirichlet-neumann-mixed-bvp",
        title: t("Solving a Dirichlet-Neumann mixed BVP", "求解狄利克雷-诺依曼混合边值问题"),
        explanation: t(
          "For $y'' = 0$ on $[0, L]$ with $y(0) = 0$ and $y'(L) = k$, integrating gives $y(x) = c_1 x + c_2$. The derivative is $y'(x) = c_1 = k$, and $y(0) = 0 \\implies c_2 = 0$. Thus $y(x) = k x$, so $y(m) = k m$.",
          "对于 $[0, L]$ 上的 $y'' = 0$（边界条件 $y(0) = 0$，$y'(L) = k$），积分得 $y(x) = c_1 x + c_2$。导数为 $y'(x) = c_1 = k$，初值 $y(0) = 0$ 给出 $c_2 = 0$。因此 $y(x) = k x$，从而 $y(m) = k m$。",
        ),
        generate(rng: Rng): Problem {
          const k = rng.int(2, 10);
          const m = rng.int(2, 20);
          const L = m + rng.int(2, 5);
          const ans = k * m;

          const prompt = t(
            `Solve the mixed boundary value problem $y'' = 0$ on $[0, ${L}]$ with $y(0) = 0$ and $y'(${L}) = ${k}$. Evaluate $y(${m})$.`,
            `求解区间 $[0, ${L}]$ 上的混合边值问题 $y'' = 0$，满足边界条件 $y(0) = 0$ 与 $y'(${L}) = ${k}$。求 $y(${m})$ 的值。`,
          );
          const solution = t(
            steps(
              `The general solution of $y'' = 0$ is $y(x) = c_1 x + c_2$.`,
              `The derivative is $y'(x) = c_1$. Setting $y'(${L}) = ${k}$ gives $c_1 = ${k}$.`,
              `Setting $y(0) = 0$ gives $c_2 = 0$, so $y(x) = ${k}x$.`,
              `Evaluating at $x = ${m}$ yields $y(${m}) = ${k}(${m}) = ${ans}$.`,
            ),
            steps(
              `$y'' = 0$ 的通解为 $y(x) = c_1 x + c_2$。`,
              `求导得 $y'(x) = c_1$。由 $y'(${L}) = ${k}$ 可得 $c_1 = ${k}$。`,
              `由 $y(0) = 0$ 可得 $c_2 = 0$，因此 $y(x) = ${k}x$。`,
              `代入 $x = ${m}$ 计算得 $y(${m}) = ${k}(${m}) = ${ans}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [k, m, k + m, k * (m + 1), ans - 1, ans + 1],
          });
        },
      },
    ],
  },

  // 6.20.3 Second-Order Inhomogeneous Boundary Value Problems
  {
    id: "second-order-inhomogeneous-boundary-value-problems",
    title: t("Second-Order Inhomogeneous Boundary Value Problems", "二阶非齐次常微分方程边值问题"),
    summary: t(
      "Inhomogeneous BVPs such as y'' = -q describe physical equilibrium states under external load, with maximum deflection occurring at midspan.",
      "如 y'' = -q 的非齐次边值问题描述外载荷作用下的物理平衡状态，最大挠度通常出现在跨中中点。",
    ),
    prerequisites: ["second-order-homogeneous-boundary-value-problems"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "inhomogeneous-bvp-solution",
        title: t("Maximum deflection under uniform load", "均布载荷下的最大挠度"),
        explanation: t(
          "For $y'' = -q$ with $y(0) = 0$ and $y(L) = 0$, integration yields $y(x) = \\frac{q}{2} x (L - x)$. The maximum occurs at the midpoint $x = L/2$, where $y(L/2) = \\frac{q L^2}{8}$.",
          "对于方程 $y'' = -q$（满足 $y(0) = 0$，$y(L) = 0$），积分得到抛物线型解 $y(x) = \\frac{q}{2} x (L - x)$。最大值出现在中点 $x = L/2$，此时 $y(L/2) = \\frac{q L^2}{8}$。",
        ),
        generate(rng: Rng): Problem {
          const k = rng.int(1, 4);
          const q = rng.int(2, 20);
          const L = 4 * k;
          const ans = 2 * q * k * k;

          const prompt = t(
            `A uniform beam under constant distributed load satisfies $y'' = -${q}$ on $[0, ${L}]$ with pinned ends $y(0) = 0$ and $y(${L}) = 0$. Find the maximum deflection $y_{\\max} = y(${2 * k})$.`,
            `一根均布受荷简支梁满足方程 $y'' = -${q}$（定义在 $[0, ${L}]$ 上，两端支撑 $y(0) = 0$ 与 $y(${L}) = 0$）。求跨中最大挠度 $y_{\\max} = y(${2 * k})$。`,
          );
          const solution = t(
            steps(
              `Integrate twice: $y(x) = -\\frac{${q}}{2}x^2 + c_1 x + c_2$.`,
              `Applying $y(0) = 0$ gives $c_2 = 0$.`,
              `Applying $y(${L}) = 0$ gives $-\\frac{${q}}{2}(${L})^2 + c_1(${L}) = 0 \\implies c_1 = \\frac{${q}(${L})}{2} = ${q * 2 * k}$.`,
              `Thus $y(x) = \\frac{${q}}{2}x(${L} - x)$. At $x = ${2 * k}$, $y(${2 * k}) = \\frac{${q}}{2}(${2 * k})(${2 * k}) = ${ans}$.`,
            ),
            steps(
              `两次积分得：$y(x) = -\\frac{${q}}{2}x^2 + c_1 x + c_2$。`,
              `由 $y(0) = 0$ 得 $c_2 = 0$。`,
              `由 $y(${L}) = 0$ 得 $-\\frac{${q}}{2}(${L})^2 + c_1(${L}) = 0 \\implies c_1 = \\frac{${q}(${L})}{2} = ${q * 2 * k}$。`,
              `因此 $y(x) = \\frac{${q}}{2}x(${L} - x)$。在 $x = ${2 * k}$ 处，代入得 $y(${2 * k}) = ${ans}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [q * L, q * k, 4 * q * k * k, ans + 1, ans - 1],
          });
        },
      },
    ],
  },

  // 6.20.4 Eigenvalues and Eigenfunctions of Homogeneous BVPs
  {
    id: "eigenvalues-and-eigenfunctions-of-homogeneous-bvps",
    title: t("Eigenvalues and Eigenfunctions of Homogeneous BVPs", "齐次常微分方程边值问题的特征值与特征函数"),
    summary: t(
      "The Sturm-Liouville problem y'' + lambda y = 0 with Dirichlet conditions y(0) = 0, y(pi) = 0 admits nontrivial solutions only for discrete eigenvalues lambda_n = n^2.",
      "施图姆-刘维尔问题 y'' + lambda y = 0 在狄利克雷边界条件 y(0) = 0, y(pi) = 0 下，仅对离散特征值 lambda_n = n^2 存在非平凡解。",
    ),
    prerequisites: ["second-order-inhomogeneous-boundary-value-problems"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "dirichlet-eigenvalues",
        title: t("Finding the n-th eigenvalue for Dirichlet boundary conditions", "求狄利克雷边界条件下的第 n 个特征值"),
        explanation: t(
          "For $y'' + \\lambda y = 0$ on $[0, \\pi]$ with $y(0) = 0$ and $y(\\pi) = 0$, nontrivial solutions are $\\phi_n(x) = \\sin(nx)$ corresponding to eigenvalues $\\lambda_n = n^2$.",
          "对于定义在 $[0, \\pi]$ 上的问题 $y'' + \\lambda y = 0$（边界条件 $y(0) = 0$ 与 $y(\\pi) = 0$），非平凡特征函数为 $\\phi_n(x) = \\sin(nx)$，对应的特征值为 $\\lambda_n = n^2$。",
        ),
        generate(rng: Rng): Problem {
          const n = rng.int(2, 35);
          const ans = n * n;

          const prompt = t(
            `Find the $n = ${n}$ eigenvalue $\\lambda_{${n}}$ of the Sturm-Liouville problem $y'' + \\lambda y = 0$ on $[0, \\pi]$ with boundary conditions $y(0) = 0$ and $y(\\pi) = 0$.`,
            `求施图姆-刘维尔问题 $y'' + \\lambda y = 0$（定义在 $[0, \\pi]$ 上，满足边界条件 $y(0) = 0$ 与 $y(\\pi) = 0$）的第 $n = ${n}$ 个特征值 $\\lambda_{${n}}$。`,
          );
          const solution = t(
            steps(
              `For $\\lambda > 0$, set $\\lambda = \\mu^2$. The general solution is $y(x) = c_1 \\cos(\\mu x) + c_2 \\sin(\\mu x)$.`,
              `Applying $y(0) = 0$ implies $c_1 = 0$.`,
              `Applying $y(\\pi) = 0$ implies $c_2 \\sin(\\mu \\pi) = 0$. For nontrivial solutions ($c_2 \\ne 0$), $\\sin(\\mu \\pi) = 0$, so $\\mu = n$ for $n = 1, 2, \\dots$.`,
              `Thus the eigenvalues are $\\lambda_n = n^2$. For $n = ${n}$, $\\lambda_{${n}} = ${n}^2 = ${ans}$.`,
            ),
            steps(
              `设 $\\lambda = \\mu^2 > 0$。方程通解为 $y(x) = c_1 \\cos(\\mu x) + c_2 \\sin(\\mu x)$。`,
              `代入边界条件 $y(0) = 0$ 得 $c_1 = 0$。`,
              `代入 $y(\\pi) = 0$ 得 $c_2 \\sin(\\mu \\pi) = 0$。存在非零解要求 $\\sin(\\mu \\pi) = 0$，即 $\\mu = n$（$n = 1, 2, \\dots$）。`,
              `因此特征值为 $\\lambda_n = n^2$。对于 $n = ${n}$，$\\lambda_{${n}} = ${n}^2 = ${ans}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [n, 2 * n, (n + 1) * (n + 1), ans - 1, ans + 1],
          });
        },
      },
    ],
  },

  // 6.21.1 Introduction to Fourier Series
  {
    id: "introduction-to-fourier-series",
    title: t("Introduction to Fourier Series", "傅里叶级数简介"),
    summary: t(
      "A periodic function can be expanded into an infinite series of trigonometric basis functions: f(x) = a0/2 + sum [an cos(nx) + bn sin(nx)].",
      "周期函数可展开为三角基函数的无穷级数：f(x) = a0/2 + sum [an cos(nx) + bn sin(nx)]。",
    ),
    prerequisites: ["eigenvalues-and-eigenfunctions-of-homogeneous-bvps"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "fourier-constant-coefficient",
        title: t("Constant term coefficient in a Fourier series", "傅里叶级数中的常数项系数"),
        explanation: t(
          "For a function $f(x)$ on $[-\\pi, \\pi]$, the coefficient $a_0 = \\frac{1}{\\pi} \\int_{-\\pi}^\\pi f(x)\\,dx$. For $f(x) = C$, $a_0 = \\frac{1}{\\pi}(2\\pi C) = 2C$.",
          "对于定义在 $[-\\pi, \\pi]$ 上的函数 $f(x)$，傅里叶常数项系数定义为 $a_0 = \\frac{1}{\\pi} \\int_{-\\pi}^\\pi f(x)\\,dx$。当 $f(x) = C$ 为常数时，$a_0 = \\frac{1}{\\pi}(2\\pi C) = 2C$。",
        ),
        generate(rng: Rng): Problem {
          const C = rng.int(2, 35);
          const ans = 2 * C;

          const prompt = t(
            `Find the Fourier coefficient $a_0 = \\frac{1}{\\pi} \\int_{-\\pi}^\\pi f(x)\\,dx$ for the constant function $f(x) = ${C}$ on $[-\\pi, \\pi]$.`,
            `求常数函数 $f(x) = ${C}$（定义在 $[-\\pi, \\pi]$ 上）的傅里叶系数 $a_0 = \\frac{1}{\\pi} \\int_{-\\pi}^\\pi f(x)\\,dx$。`,
          );
          const solution = t(
            steps(
              `The formula for $a_0$ is $a_0 = \\frac{1}{\\pi} \\int_{-\\pi}^\\pi f(x)\\,dx$.`,
              `Substitute $f(x) = ${C}$: $a_0 = \\frac{1}{\\pi} \\int_{-\\pi}^\\pi ${C}\\,dx = \\frac{${C}}{\\pi}(2\\pi) = ${ans}$.`,
              `Note that the leading term $\\frac{a_0}{2}$ equals the average value $C = ${C}$.`,
            ),
            steps(
              `常数项系数公式为 $a_0 = \\frac{1}{\\pi} \\int_{-\\pi}^\\pi f(x)\\,dx$。`,
              `代入 $f(x) = ${C}$：$a_0 = \\frac{1}{\\pi} \\int_{-\\pi}^\\pi ${C}\\,dx = \\frac{${C}}{\\pi}(2\\pi) = ${ans}$。`,
              `注意常数项 $\\frac{a_0}{2}$ 恰好等于函数的平均值 $C = ${C}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [C, 4 * C, C * C, ans - 1, ans + 1],
          });
        },
      },
    ],
  },

  // 6.21.2 Properties of Fourier Series
  {
    id: "properties-of-fourier-series",
    title: t("Properties of Fourier Series", "傅里叶级数的性质"),
    summary: t(
      "Trigonometric functions satisfy mutual orthogonality over [-pi, pi], establishing Parseval's identity and energy conservation.",
      "三角函数系在 [-pi, pi] 上具有正交性，这是帕塞瓦尔恒等式与能量守恒的数学基础。",
    ),
    prerequisites: ["introduction-to-fourier-series"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "fourier-orthogonality-integral",
        title: t("Orthogonality norm integral of trigonometric modes", "三角模态的正交范数积分"),
        explanation: t(
          "By orthogonality, $\\int_{-\\pi}^\\pi \\sin^2(nx)\\,dx = \\pi$ for any non-zero integer $n$. Thus $\\frac{1}{\\pi} \\int_{-\\pi}^\\pi (k \\sin(nx))^2\\,dx = k^2$.",
          "根据正交性，对任意非零整数 $n$，均有 $\\int_{-\\pi}^\\pi \\sin^2(nx)\\,dx = \\pi$。因此 $\\frac{1}{\\pi} \\int_{-\\pi}^\\pi (k \\sin(nx))^2\\,dx = k^2$。",
        ),
        generate(rng: Rng): Problem {
          const k = rng.int(2, 35);
          const n = rng.int(1, 10);
          const ans = k * k;

          const prompt = t(
            `Using the orthogonality of the trigonometric system on $[-\\pi, \\pi]$, evaluate $\\frac{1}{\\pi} \\int_{-\\pi}^\\pi (${k} \\sin(${n}x))^2\\,dx$.`,
            `利用三角函数系在 $[-\\pi, \\pi]$ 上的正交性，计算定积分 $\\frac{1}{\\pi} \\int_{-\\pi}^\\pi (${k} \\sin(${n}x))^2\\,dx$ 的值。`,
          );
          const solution = t(
            steps(
              `Factor out the amplitude: $\\frac{1}{\\pi} \\int_{-\\pi}^\\pi (${k} \\sin(${n}x))^2\\,dx = \\frac{${k * k}}{\\pi} \\int_{-\\pi}^\\pi \\sin^2(${n}x)\\,dx$.`,
              `Using the half-angle identity $\\sin^2(${n}x) = \\frac{1 - \\cos(${2 * n}x)}{2}$, the integral over $[-\\pi, \\pi]$ is $\\pi$.`,
              `Thus $\\frac{${k * k}}{\\pi}(\\pi) = ${ans}$.`,
            ),
            steps(
              `提振幅系数：$\\frac{1}{\\pi} \\int_{-\\pi}^\\pi (${k} \\sin(${n}x))^2\\,dx = \\frac{${k * k}}{\\pi} \\int_{-\\pi}^\\pi \\sin^2(${n}x)\\,dx$。`,
              `利用降幂公式 $\\sin^2(${n}x) = \\frac{1 - \\cos(${2 * n}x)}{2}$，其在 $[-\\pi, \\pi]$ 上的积分为 $\\pi$。`,
              `因此 $\\frac{${k * k}}{\\pi}(\\pi) = ${ans}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [k, 2 * k, k * n, ans - 1, ans + 1],
          });
        },
      },
    ],
  },

  // 6.21.3 Fourier Sine Series
  {
    id: "fourier-sine-series",
    title: t("Fourier Sine Series", "正弦傅里叶级数"),
    summary: t(
      "Odd periodic extensions on [-pi, pi] have Fourier expansions containing exclusively sine terms, with coefficients bn = (2/pi) integral_0^pi f(x) sin(nx) dx.",
      "奇周期延拓的傅里叶级数仅包含正弦项，其系数公式为 bn = (2/pi) integral_0^pi f(x) sin(nx) dx。",
    ),
    prerequisites: ["properties-of-fourier-series"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "fourier-sine-coefficient-pure-tone",
        title: t("Fourier sine coefficient of a harmonic component", "谐波分量的傅里叶正弦系数"),
        explanation: t(
          "For $f(x) = k \\sin(m x)$ on $(0, \\pi)$, orthogonality implies that $b_n = k$ when $n = m$ and $0$ for all $n \\ne m$.",
          "对于在 $(0, \\pi)$ 上定义的正弦函数 $f(x) = k \\sin(m x)$，由正交性可知，当 $n = m$ 时其傅里叶正弦系数 $b_m = k$，其余系数均为 $0$。",
        ),
        generate(rng: Rng): Problem {
          const k = rng.int(2, 35);
          const m = rng.int(2, 10);
          const ans = k;

          const prompt = t(
            `Find the $m = ${m}$ Fourier sine coefficient $b_{${m}} = \\frac{2}{\\pi} \\int_0^\\pi f(x) \\sin(${m}x)\\,dx$ for $f(x) = ${k} \\sin(${m}x)$ on $(0, \\pi)$.`,
            `求函数 $f(x) = ${k} \\sin(${m}x)$ 在 $(0, \\pi)$ 上的第 $m = ${m}$ 个傅里叶正弦系数 $b_{${m}} = \\frac{2}{\\pi} \\int_0^\\pi f(x) \\sin(${m}x)\\,dx$。`,
          );
          const solution = t(
            steps(
              `The coefficient formula is $b_{${m}} = \\frac{2}{\\pi} \\int_0^\\pi (${k} \\sin(${m}x)) \\sin(${m}x)\\,dx = \\frac{2(${k})}{\\pi} \\int_0^\\pi \\sin^2(${m}x)\\,dx$.`,
              `Since $\\int_0^\\pi \\sin^2(${m}x)\\,dx = \\frac{\\pi}{2}$, we have $b_{${m}} = \\frac{2(${k})}{\\pi} \\left(\\frac{\\pi}{2}\\right) = ${ans}$.`,
            ),
            steps(
              `由正弦系数计算公式：$b_{${m}} = \\frac{2}{\\pi} \\int_0^\\pi (${k} \\sin(${m}x)) \\sin(${m}x)\\,dx = \\frac{2(${k})}{\\pi} \\int_0^\\pi \\sin^2(${m}x)\\,dx$。`,
              `因为 $\\int_0^\\pi \\sin^2(${m}x)\\,dx = \\frac{\\pi}{2}$，所以 $b_{${m}} = \\frac{2(${k})}{\\pi} \\left(\\frac{\\pi}{2}\\right) = ${ans}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [k * m, m, 2 * k, ans - 1, ans + 1],
          });
        },
      },
    ],
  },

  // 6.21.4 Fourier Cosine Series
  {
    id: "fourier-cosine-series",
    title: t("Fourier Cosine Series", "余弦傅里叶级数"),
    summary: t(
      "Even periodic extensions on [-pi, pi] have Fourier expansions containing exclusively cosine terms, with an = (2/pi) integral_0^pi f(x) cos(nx) dx.",
      "偶周期延拓的傅里叶级数仅包含余弦项，其系数公式为 an = (2/pi) integral_0^pi f(x) cos(nx) dx。",
    ),
    prerequisites: ["fourier-sine-series"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "fourier-cosine-coefficient-pure-tone",
        title: t("Fourier cosine coefficient of a harmonic component", "谐波分量的傅里叶余弦系数"),
        explanation: t(
          "For $f(x) = k \\cos(m x)$ on $(0, \\pi)$, orthogonality implies that $a_m = k$ and all other $a_n = 0$.",
          "对于在 $(0, \\pi)$ 上定义的余弦函数 $f(x) = k \\cos(m x)$，由正交性可知，当 $n = m$ 时其傅里叶余弦系数 $a_m = k$，其余系数均为 $0$。",
        ),
        generate(rng: Rng): Problem {
          const k = rng.int(2, 35);
          const m = rng.int(2, 10);
          const ans = k;

          const prompt = t(
            `Find the $m = ${m}$ Fourier cosine coefficient $a_{${m}} = \\frac{2}{\\pi} \\int_0^\\pi f(x) \\cos(${m}x)\\,dx$ for $f(x) = ${k} \\cos(${m}x)$ on $(0, \\pi)$.`,
            `求函数 $f(x) = ${k} \\cos(${m}x)$ 在 $(0, \\pi)$ 上的第 $m = ${m}$ 个傅里叶余弦系数 $a_{${m}} = \\frac{2}{\\pi} \\int_0^\\pi f(x) \\cos(${m}x)\\,dx$。`,
          );
          const solution = t(
            steps(
              `The formula is $a_{${m}} = \\frac{2}{\\pi} \\int_0^\\pi (${k} \\cos(${m}x)) \\cos(${m}x)\\,dx = \\frac{2(${k})}{\\pi} \\int_0^\\pi \\cos^2(${m}x)\\,dx$.`,
              `Since $\\int_0^\\pi \\cos^2(${m}x)\\,dx = \\frac{\\pi}{2}$, we have $a_{${m}} = \\frac{2(${k})}{\\pi} \\left(\\frac{\\pi}{2}\\right) = ${ans}$.`,
            ),
            steps(
              `余弦系数公式为：$a_{${m}} = \\frac{2}{\\pi} \\int_0^\\pi (${k} \\cos(${m}x)) \\cos(${m}x)\\,dx = \\frac{2(${k})}{\\pi} \\int_0^\\pi \\cos^2(${m}x)\\,dx$。`,
              `因为 $\\int_0^\\pi \\cos^2(${m}x)\\,dx = \\frac{\\pi}{2}$，所以 $a_{${m}} = \\frac{2(${k})}{\\pi} \\left(\\frac{\\pi}{2}\\right) = ${ans}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [k * m, m, 2 * k, ans - 1, ans + 1],
          });
        },
      },
    ],
  },

  // 6.21.5 Fourier Series of Arbitrary Period
  {
    id: "fourier-series-of-arbitrary-period",
    title: t("Fourier Series of Arbitrary Period", "任意周期的傅里叶级数"),
    summary: t(
      "A signal with period T = 2L scales frequency modes to n pi / L, expanding in cos(n pi x / L) and sin(n pi x / L).",
      "周期为 T = 2L 的信号将频率缩放为 n pi / L，基函数推广为 cos(n pi x / L) 与 sin(n pi x / L)。",
    ),
    prerequisites: ["fourier-cosine-series"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "fundamental-period-and-frequency",
        title: t("Fundamental period from half-period L", "由半周期 L 确定基波周期"),
        explanation: t(
          "When a Fourier series is defined using the spatial scale $L$ with basis functions $\\sin\\left(\\frac{n\\pi x}{L}\\right)$, the fundamental period of the periodic extension is $T = 2L$.",
          "当傅里叶级数基于半周期 $L$（基函数为 $\\sin\\left(\\frac{n\\pi x}{L}\\right)$）展开时，其周期延拓函数的基波周期为 $T = 2L$。",
        ),
        generate(rng: Rng): Problem {
          const L = rng.int(2, 35);
          const ans = 2 * L;

          const prompt = t(
            `A periodic function $f(x)$ is expanded in a Fourier series with spatial harmonics $\\cos\\left(\\frac{n\\pi x}{${L}}\\right)$ and $\\sin\\left(\\frac{n\\pi x}{${L}}\\right)$. What is the fundamental period $T$ of $f(x)$?`,
            `周期函数 $f(x)$ 展开为空间谐波 $\\cos\\left(\\frac{n\\pi x}{${L}}\\right)$ 与 $\\sin\\left(\\frac{n\\pi x}{${L}}\\right)$ 的傅里叶级数。求 $f(x)$ 的基波周期 $T$。`,
          );
          const solution = t(
            steps(
              `The harmonic frequencies are $\\omega_n = \\frac{n\\pi}{L}$.`,
              `For $n = 1$, the fundamental mode is $\\cos\\left(\\frac{\\pi x}{${L}}\\right)$ or $\\sin\\left(\\frac{\\pi x}{${L}}\\right)$.`,
              `The period of $\\sin\\left(\\frac{\\pi x}{${L}}\\right)$ is $T = \\frac{2\\pi}{\\pi / ${L}} = 2(${L}) = ${ans}$.`,
            ),
            steps(
              `谐波的空间角频率为 $\\omega_n = \\frac{n\\pi}{L}$。`,
              `当 $n = 1$ 时，基频分量为 $\\cos\\left(\\frac{\\pi x}{${L}}\\right)$ 或 $\\sin\\left(\\frac{\\pi x}{${L}}\\right)$。`,
              `其周期为 $T = \\frac{2\\pi}{\\pi / ${L}} = 2(${L}) = ${ans}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [L, 4 * L, L * L, ans - 1, ans + 1],
          });
        },
      },
    ],
  },

  // 6.21.6 Convergence of Fourier Series
  {
    id: "convergence-of-fourier-series",
    title: t("Convergence of Fourier Series", "傅里叶级数的收敛性"),
    summary: t(
      "Dirichlet's theorem guarantees pointwise convergence to f(x) at continuity points, and to the arithmetic mean of one-sided limits at jump discontinuities.",
      "狄利克雷收敛定理保证级数在连续点处逐点收敛于 f(x)，在跳跃间断点处收敛于左右单侧极限的算术平均值。",
    ),
    prerequisites: ["fourier-series-of-arbitrary-period"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "dirichlet-jump-convergence",
        title: t("Convergence at a jump discontinuity via Dirichlet's theorem", "狄利克雷定理下跳跃间断点处的收敛值"),
        explanation: t(
          "At a jump discontinuity $x_0$, the Fourier series converges to $\\frac{f(x_0^+) + f(x_0^-)}{2}$.",
          "在跳跃间断点 $x_0$ 处，傅里叶级数收敛于左右极限的平均值：$\\frac{f(x_0^+) + f(x_0^-)}{2}$。",
        ),
        generate(rng: Rng): Problem {
          const k1 = rng.int(2, 35);
          const k2 = rng.int(2, 35);
          const leftLim = 2 * k1;
          const rightLim = 2 * k2;
          const ans = k1 + k2;

          const prompt = t(
            `A piecewise continuous function $f(x)$ has left limit $\\lim_{x \\to 0^-} f(x) = ${leftLim}$ and right limit $\\lim_{x \\to 0^+} f(x) = ${rightLim}$. To what value does the Fourier series of $f(x)$ converge at $x = 0$?`,
            `分段连续函数 $f(x)$ 在 $x = 0$ 处的左极限为 $\\lim_{x \\to 0^-} f(x) = ${leftLim}$，右极限为 $\\lim_{x \\to 0^+} f(x) = ${rightLim}$。由狄利克雷定理，其傅里叶级数在 $x = 0$ 处收敛于何值？`,
          );
          const solution = t(
            steps(
              `According to Dirichlet's convergence theorem, at a jump discontinuity $x_0$, the Fourier series converges to the average of the one-sided limits: $S(x_0) = \\frac{f(x_0^+) + f(x_0^-)}{2}$.`,
              `Substitute values: $S(0) = \\frac{${rightLim} + ${leftLim}}{2} = ${ans}$.`,
            ),
            steps(
              `根据狄利克雷收敛定理，在跳跃间断点 $x_0$ 处，傅里叶级数收敛于左右极限的平均值：$S(x_0) = \\frac{f(x_0^+) + f(x_0^-)}{2}$。`,
              `代入数值计算：$S(0) = \\frac{${rightLim} + ${leftLim}}{2} = ${ans}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [leftLim, rightLim, Math.abs(leftLim - rightLim), leftLim + rightLim, ans - 1, ans + 1],
          });
        },
      },
    ],
  },

  // 6.21.7 Differentiating and Integrating Fourier Series
  {
    id: "differentiating-and-integrating-fourier-series",
    title: t("Differentiating and Integrating Fourier Series", "傅里叶级数的逐项求导与逐项积分"),
    summary: t(
      "Differentiating a Fourier sine series term-by-term scales each coefficient by n, producing a cosine series.",
      "对傅里叶正弦级数逐项求导将各项系数放大 n 倍，转化为余弦级数。",
    ),
    prerequisites: ["convergence-of-fourier-series"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "term-by-term-differentiation-coefficient",
        title: t("Cosine coefficient obtained from term-by-term differentiation", "逐项求导得到的余弦分量系数"),
        explanation: t(
          "For $f(x) = b_n \\sin(nx)$, differentiating term-by-term gives $f'(x) = (n b_n) \\cos(nx)$. The coefficient of $\\cos(nx)$ is $n b_n$.",
          "对于 $f(x) = b_n \\sin(nx)$，逐项求导得 $f'(x) = (n b_n) \\cos(nx)$。因此 $\\cos(nx)$ 项的系数为 $n b_n$。",
        ),
        generate(rng: Rng): Problem {
          const n = rng.int(2, 8);
          const bn = rng.int(2, 20);
          const ans = n * bn;

          const prompt = t(
            `Suppose a signal has the harmonic term $f(x) = ${bn} \\sin(${n}x)$. Find the coefficient of $\\cos(${n}x)$ in the term-by-term derivative $f'(x)$.`,
            `设信号包含谐波项 $f(x) = ${bn} \\sin(${n}x)$。求其逐项导数 $f'(x)$ 中 $\\cos(${n}x)$ 项的系数。`,
          );
          const solution = t(
            steps(
              `Differentiate directly: $\\frac{d}{dx}[${bn} \\sin(${n}x)] = ${bn} \\cdot ${n} \\cos(${n}x) = ${ans} \\cos(${n}x)$.`,
              `Thus the coefficient of $\\cos(${n}x)$ is ${ans}.`,
            ),
            steps(
              `直接求导：$\\frac{d}{dx}[${bn} \\sin(${n}x)] = ${bn} \\cdot ${n} \\cos(${n}x) = ${ans} \\cos(${n}x)$。`,
              `因此 $\\cos(${n}x)$ 的系数为 ${ans}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [bn, n, bn + n, ans + n, ans - 1, ans + 1],
          });
        },
      },
    ],
  },

  // 6.21.8 Solving ODEs Using Fourier Series
  {
    id: "solving-odes-using-fourier-series",
    title: t("Solving ODEs Using Fourier Series", "用傅里叶级数求解常微分方程"),
    summary: t(
      "Driven linear ODEs y'' + omega0^2 y = F_n sin(nx) decouple under Fourier series into independent harmonic response amplitudes Y_n = F_n / (omega0^2 - n^2).",
      "在周期外力驱动下，线性微分方程 y'' + omega0^2 y = F_n sin(nx) 在傅里叶级数下解耦为各谐波分量的独立振幅方程 Y_n = F_n / (omega0^2 - n^2)。",
    ),
    prerequisites: ["differentiating-and-integrating-fourier-series"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "fourier-mode-amplitude",
        title: t("Fundamental mode response amplitude in driven oscillation", "受迫振荡中的基频响应振幅"),
        explanation: t(
          "For $y'' + \\omega_0^2 y = F_1 \\sin(x)$, substituting the ansatz $y_p(t) = Y_1 \\sin(x)$ gives $(-1 + \\omega_0^2) Y_1 = F_1$, so $Y_1 = \\frac{F_1}{\\omega_0^2 - 1}$.",
          "对于方程 $y'' + \\omega_0^2 y = F_1 \\sin(x)$，代入试探解 $y_p(t) = Y_1 \\sin(x)$ 得到 $(-1 + \\omega_0^2) Y_1 = F_1$，故响应振幅为 $Y_1 = \\frac{F_1}{\\omega_0^2 - 1}$。",
        ),
        generate(rng: Rng): Problem {
          const omega0 = rng.int(2, 8);
          const ans = rng.int(2, 35);
          const denom = omega0 * omega0 - 1;
          const F1 = ans * denom;
          const omega0Sq = omega0 * omega0;

          const prompt = t(
            `Find the amplitude $Y_1$ of the steady periodic response $y_p(x) = Y_1 \\sin(x)$ to the driven differential equation $y'' + ${omega0Sq}y = ${F1} \\sin(x)$.`,
            `求受迫微分方程 $y'' + ${omega0Sq}y = ${F1} \\sin(x)$ 的周期稳态响应 $y_p(x) = Y_1 \\sin(x)$ 的振幅 $Y_1$。`,
          );
          const solution = t(
            steps(
              `Substitute $y_p(x) = Y_1 \\sin(x)$ into the ODE: $y_p'' + ${omega0Sq} y_p = -Y_1 \\sin(x) + ${omega0Sq} Y_1 \\sin(x) = (${omega0Sq} - 1) Y_1 \\sin(x)$.`,
              `Equating coefficients with the driving term: $(${denom}) Y_1 = ${F1}$.`,
              `Dividing gives $Y_1 = \\frac{${F1}}{${denom}} = ${ans}$.`,
            ),
            steps(
              `将试探解 $y_p(x) = Y_1 \\sin(x)$ 代入方程：$y_p'' + ${omega0Sq} y_p = -Y_1 \\sin(x) + ${omega0Sq} Y_1 \\sin(x) = (${omega0Sq} - 1) Y_1 \\sin(x)$。`,
              `与右端激励项对比系数：$(${denom}) Y_1 = ${F1}$。`,
              `解得 $Y_1 = \\frac{${F1}}{${denom}} = ${ans}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [F1, denom, ans * denom, ans + 1, ans - 1],
          });
        },
      },
    ],
  },

  // 6.21.9 Solving IVPs Using Fourier Series
  {
    id: "solving-ivps-using-fourier-series",
    title: t("Solving IVPs Using Fourier Series", "用傅里叶级数求解初值问题"),
    summary: t(
      "Combining the particular Fourier series with homogeneous solutions enables solving IVPs under periodic driving forces.",
      "将傅里叶级数特解与齐次通解线性叠加，可求解周期激励下的常微分方程初值问题。",
    ),
    prerequisites: ["solving-odes-using-fourier-series"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "fourier-ivp-constant-determination",
        title: t("Determining homogeneous coefficient in a driven IVP", "确定受迫初值问题中的齐次项系数"),
        explanation: t(
          "For $y'' + \\omega_0^2 y = F(t)$ with a particular solution satisfying $y_p(0) = 0$, the general solution is $y(t) = y_p(t) + c_1 \\cos(\\omega_0 t) + c_2 \\sin(\\omega_0 t)$. Setting $t = 0$ yields $y(0) = c_1 = y_0$.",
          "对于包含满足 $y_p(0) = 0$ 的特解的方程 $y'' + \\omega_0^2 y = F(t)$，通解为 $y(t) = y_p(t) + c_1 \\cos(\\omega_0 t) + c_2 \\sin(\\omega_0 t)$。在 $t = 0$ 处代入即得 $y(0) = c_1 = y_0$。",
        ),
        generate(rng: Rng): Problem {
          const omega0 = rng.int(2, 6);
          const ans = rng.int(2, 35);
          const omega0Sq = omega0 * omega0;

          const prompt = t(
            `A driven oscillator satisfies $y'' + ${omega0Sq}y = \\sin(t)$ with initial conditions $y(0) = ${ans}$ and $y'(0) = 0$. In the solution $y(t) = y_p(t) + c_1 \\cos(${omega0}t) + c_2 \\sin(${omega0}t)$, where $y_p(t) = \\frac{1}{${omega0Sq - 1}} \\sin(t)$, find the coefficient $c_1$.`,
            `受迫振子满足 $y'' + ${omega0Sq}y = \\sin(t)$，初始条件为 $y(0) = ${ans}$ 与 $y'(0) = 0$。在解 $y(t) = y_p(t) + c_1 \\cos(${omega0}t) + c_2 \\sin(${omega0}t)$（其中特解为 $y_p(t) = \\frac{1}{${omega0Sq - 1}} \\sin(t)$）中，求齐次系数 $c_1$。`,
          );
          const solution = t(
            steps(
              `The particular solution is $y_p(t) = \\frac{1}{${omega0Sq - 1}} \\sin(t)$, so $y_p(0) = 0$.`,
              `Evaluating the general solution at $t = 0$: $y(0) = y_p(0) + c_1 \\cos(0) + c_2 \\sin(0) = c_1$.`,
              `Since $y(0) = ${ans}$, we immediately find $c_1 = ${ans}$.`,
            ),
            steps(
              `特解为 $y_p(t) = \\frac{1}{${omega0Sq - 1}} \\sin(t)$，其在 $t = 0$ 处的取值为 $y_p(0) = 0$。`,
              `在 $t = 0$ 处计算通解：$y(0) = y_p(0) + c_1 \\cos(0) + c_2 \\sin(0) = c_1$。`,
              `由初始条件 $y(0) = ${ans}$，直接可得 $c_1 = ${ans}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [omega0, omega0Sq, ans + 1, ans - 1],
          });
        },
      },
    ],
  },

  // 6.21.10 Solving BVPs Using Fourier Series
  {
    id: "solving-bvps-using-fourier-series",
    title: t("Solving BVPs Using Fourier Series", "用傅里叶级数求解边值问题"),
    summary: t(
      "Expanding source terms in Fourier sine series allows solving boundary value problems -y'' = f(x) with Dirichlet boundary conditions term-by-term.",
      "将非齐次源项展开为傅里叶正弦级数，可逐项直接求解齐次狄利克雷边值问题 -y'' = f(x)。",
    ),
    prerequisites: ["solving-ivps-using-fourier-series"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "fourier-bvp-sine-expansion",
        title: t("Sine mode amplitude in a Poisson-type BVP", "泊松型边值问题中的正弦模态振幅"),
        explanation: t(
          "For $-y'' = F_m \\sin(mx)$ on $[0, \\pi]$ with $y(0) = 0$ and $y(\\pi) = 0$, substituting $y(x) = Y_m \\sin(mx)$ yields $m^2 Y_m = F_m$, so $Y_m = \\frac{F_m}{m^2}$.",
          "对于定义在 $[0, \\pi]$ 上的边值问题 $-y'' = F_m \\sin(mx)$（边界条件 $y(0) = 0$，$y(\\pi) = 0$），代入 $y(x) = Y_m \\sin(mx)$ 得 $m^2 Y_m = F_m$，因此响应振幅为 $Y_m = \\frac{F_m}{m^2}$。",
        ),
        generate(rng: Rng): Problem {
          const m = rng.int(2, 6);
          const ans = rng.int(2, 35);
          const mSq = m * m;
          const Fm = ans * mSq;

          const prompt = t(
            `Solve the Dirichlet boundary value problem $-y'' = ${Fm} \\sin(${m}x)$ on $[0, \\pi]$ with $y(0) = 0$ and $y(\\pi) = 0$. Find the amplitude $Y_{${m}}$ of the solution $y(x) = Y_{${m}} \\sin(${m}x)$.`,
            `求解定义在 $[0, \\pi]$ 上的狄利克雷边值问题 $-y'' = ${Fm} \\sin(${m}x)$，边界条件为 $y(0) = 0$ 与 $y(\\pi) = 0$。求正弦响应解 $y(x) = Y_{${m}} \\sin(${m}x)$ 的振幅 $Y_{${m}}$。`,
          );
          const solution = t(
            steps(
              `Substitute $y(x) = Y_{${m}} \\sin(${m}x)$ into the ODE: $-y''(x) = -(-${m}^2 Y_{${m}} \\sin(${m}x)) = ${mSq} Y_{${m}} \\sin(${m}x)$.`,
              `Equate with the forcing term: ${mSq} Y_{${m}} = ${Fm}.`,
              `Dividing gives $Y_{${m}} = \\frac{${Fm}}{${mSq}} = ${ans}$. Notice that the boundary conditions $y(0) = 0$ and $y(\\pi) = 0$ are automatically satisfied.`,
            ),
            steps(
              `将试探解 $y(x) = Y_{${m}} \\sin(${m}x)$ 代入方程：$-y''(x) = -(-${m}^2 Y_{${m}} \\sin(${m}x)) = ${mSq} Y_{${m}} \\sin(${m}x)$。`,
              `与右端激励项对比系数：${mSq} Y_{${m}} = ${Fm}。`,
              `解得 $Y_{${m}} = \\frac{${Fm}}{${mSq}} = ${ans}$。注意该解自动满足边界条件 $y(0) = 0$ 与 $y(\\pi) = 0$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [Fm, m, mSq, ans * m, ans - 1, ans + 1],
          });
        },
      },
    ],
  },
];
