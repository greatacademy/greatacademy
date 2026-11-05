import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import { choiceProblem, numberProblem, steps } from "../problems.ts";

/** par writes a number, in parentheses when it is negative. */
const par = (v: number | Q): string => {
  const q = v instanceof Q ? v : Q.of(v);
  return q.sign() < 0 ? `(${q.toLatex()})` : q.toLatex();
};

/** piFrac writes c·π for a positive rational c: "\\pi", "2\\pi", "\\frac{\\pi}{4}", "\\frac{3\\pi}{2}". */
const piFrac = (c: Q): string => {
  const top = c.n === 1n ? "\\pi" : `${c.n}\\pi`;
  return c.d === 1n ? top : `\\frac{${top}}{${c.d}}`;
};

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
          "A zero second derivative means the solution is a straight line, so it is fixed by the values at the two ends and its midpoint value is their average. For $y'' = 0$ on $[0, L]$ with $y(0) = a$ and $y(L) = b$, the solution is the straight line $y(x) = a + \\frac{b - a}{L} x$. At the midpoint $x = L/2$, $y(L/2) = \\frac{a + b}{2}$.",
          "二阶导数为零意味着解是一条直线，所以它由两端的值确定，中点处的值是它们的平均值。对于区间 $[0, L]$ 上的边值问题 $y'' = 0$（边界条件 $y(0) = a$，$y(L) = b$），其解为直线 $y(x) = a + \\frac{b - a}{L} x$。在区间中点 $x = L/2$ 处，解的值恰为两端点值的算术平均：$y(L/2) = \\frac{a + b}{2}$。",
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
      {
        id: "counting-solutions-of-oscillatory-bvps",
        title: t("Counting solutions of oscillatory BVPs", "振动型边值问题解的个数"),
        explanation: t(
          "Unlike an initial value problem, a boundary value problem can have one solution, none, or infinitely many. For $y'' + k^{2}y = 0$ the general solution is $y = c_1\\cos kx + c_2\\sin kx$, and $y(0) = a$ gives $c_1 = a$. The second condition $y(x_1) = b$ reads $a\\cos kx_1 + c_2\\sin kx_1 = b$:\n\n- if $\\sin kx_1 \\ne 0$, it fixes $c_2$: exactly one solution;\n- if $\\sin kx_1 = 0$, $c_2$ drops out, and the condition is either automatically true (infinitely many solutions) or impossible (none).",
          "与初值问题不同，边值问题可能有唯一解、无解或无穷多解。$y'' + k^{2}y = 0$ 的通解为 $y = c_1\\cos kx + c_2\\sin kx$，由 $y(0) = a$ 得 $c_1 = a$。第二个条件 $y(x_1) = b$ 成为 $a\\cos kx_1 + c_2\\sin kx_1 = b$：\n\n- 若 $\\sin kx_1 \\ne 0$，它确定 $c_2$：恰有一个解；\n- 若 $\\sin kx_1 = 0$，$c_2$ 消失，条件要么自动成立（无穷多解），要么不可能成立（无解）。",
        ),
        generate(rng: Rng): Problem {
          const k = rng.int(1, 4);
          const a = rng.nonZero(-6, 6);
          const kind = rng.pick(["one", "none", "many"] as const);
          const j = rng.int(1, 2);
          const x1 = kind === "one" ? Q.of(2 * j - 1, 2 * k) : Q.of(j, k);
          const atEnd = a * (j % 2 === 0 ? 1 : -1);
          const b = kind === "one" ? rng.int(-6, 6) : kind === "many" ? atEnd : atEnd + rng.nonZero(-3, 3);
          const eq = k === 1 ? "y'' + y = 0" : `y'' + ${k * k}y = 0`;
          const kx = k === 1 ? "x" : `${k}x`;
          const options = [t("Exactly one", "恰有一个"), t("None", "没有"), t("Infinitely many", "无穷多个")];
          const correct = kind === "one" ? 0 : kind === "none" ? 1 : 2;
          const sinv = kind === "one" ? (j % 2 === 1 ? 1 : -1) : 0;
          const cosv = kind === "one" ? 0 : j % 2 === 0 ? 1 : -1;
          const verdict =
            kind === "one"
              ? t(
                  `it gives $${sinv < 0 ? "-" : ""}c_2 = ${b}$, so there is exactly one solution.`,
                  `由此得 $${sinv < 0 ? "-" : ""}c_2 = ${b}$，所以恰有一个解。`,
                )
              : kind === "many"
                ? t(
                    `it reads $${atEnd} = ${b}$, true for every $c_2$: infinitely many solutions.`,
                    `它成为 $${atEnd} = ${b}$，对任意 $c_2$ 都成立：有无穷多个解。`,
                  )
                : t(`it reads $${atEnd} = ${b}$, which is false: there is no solution.`, `它成为 $${atEnd} = ${b}$，不成立：无解。`);
          return choiceProblem({
            prompt: t(
              `How many solutions does the boundary value problem $${eq}$, $y(0) = ${a}$, $y\\left(${piFrac(x1)}\\right) = ${b}$ have?`,
              `边值问题 $${eq}$，$y(0) = ${a}$，$y\\left(${piFrac(x1)}\\right) = ${b}$ 有多少个解？`,
            ),
            options,
            correct,
            solution: t(
              `The general solution is $y = c_1\\cos ${kx} + c_2\\sin ${kx}$, and $y(0) = ${a}$ gives $c_1 = ${a}$. At $x = ${piFrac(x1)}$, $\\cos = ${cosv}$ and $\\sin = ${sinv}$, so the second condition is $${a} \\cdot ${cosv < 0 ? `(${cosv})` : cosv} + c_2 \\cdot ${sinv < 0 ? `(${sinv})` : sinv} = ${b}$; ${verdict.en}`,
              `通解为 $y = c_1\\cos ${kx} + c_2\\sin ${kx}$，由 $y(0) = ${a}$ 得 $c_1 = ${a}$。在 $x = ${piFrac(x1)}$ 处 $\\cos = ${cosv}$，$\\sin = ${sinv}$，所以第二个条件为 $${a} \\cdot ${cosv < 0 ? `(${cosv})` : cosv} + c_2 \\cdot ${sinv < 0 ? `(${sinv})` : sinv} = ${b}$；${verdict["zh-CN"]}`,
            ),
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
          "One boundary condition fixes a value and the other fixes a slope, and together they determine the two constants of the straight line solution. For $y'' = 0$ on $[0, L]$ with $y(0) = 0$ and $y'(L) = k$, integrating gives $y(x) = c_1 x + c_2$. The derivative is $y'(x) = c_1 = k$, and $y(0) = 0 \\implies c_2 = 0$. Thus $y(x) = k x$, so $y(m) = k m$.",
          "一个边界条件固定函数值，另一个固定斜率，二者共同确定直线解中的两个常数。对于 $[0, L]$ 上的 $y'' = 0$（边界条件 $y(0) = 0$，$y'(L) = k$），积分得 $y(x) = c_1 x + c_2$。导数为 $y'(x) = c_1 = k$，初值 $y(0) = 0$ 给出 $c_2 = 0$。因此 $y(x) = k x$，从而 $y(m) = k m$。",
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
      {
        id: "oscillatory-dirichlet-problems",
        title: t("Oscillatory Dirichlet problems", "振动型狄利克雷问题"),
        explanation: t(
          "For $y'' + k^{2}y = 0$ with values given at $x = 0$ and at a quarter period $x = \\frac{\\pi}{2k}$, each condition picks out one constant of $y = c_1\\cos kx + c_2\\sin kx$: at $x = 0$ the sine vanishes, and at $x = \\frac{\\pi}{2k}$ the cosine does. So $y(0) = a$ and $y\\left(\\frac{\\pi}{2k}\\right) = b$ give\n\n$$y(x) = a\\cos kx + b\\sin kx,$$\n\nfrom which any value or slope follows, such as $y'(0) = kb$ and $y\\left(\\frac{\\pi}{k}\\right) = -a$.",
          "对于 $y'' + k^{2}y = 0$，若在 $x = 0$ 和四分之一周期 $x = \\frac{\\pi}{2k}$ 处给定函数值，每个条件各确定 $y = c_1\\cos kx + c_2\\sin kx$ 中的一个常数：在 $x = 0$ 处正弦为零，在 $x = \\frac{\\pi}{2k}$ 处余弦为零。所以 $y(0) = a$，$y\\left(\\frac{\\pi}{2k}\\right) = b$ 给出\n\n$$y(x) = a\\cos kx + b\\sin kx,$$\n\n由此可得任意函数值或斜率，例如 $y'(0) = kb$，$y\\left(\\frac{\\pi}{k}\\right) = -a$。",
        ),
        generate(rng: Rng): Problem {
          const k = rng.int(1, 5);
          const a = rng.nonZero(-9, 9);
          const b = rng.nonZero(-9, 9);
          const ask = rng.pick(["slope", "half", "slope-end"] as const);
          const eq = k === 1 ? "y'' + y = 0" : `y'' + ${k * k}y = 0`;
          const kx = k === 1 ? "x" : `${k}x`;
          const quarter = piFrac(Q.of(1, 2 * k));
          const half = piFrac(Q.of(1, k));
          const [target, ans, work] =
            ask === "slope"
              ? [
                  "y'(0)",
                  k * b,
                  `y'(x) = ${-k * a}\\sin ${kx} ${k * b < 0 ? "-" : "+"} ${Math.abs(k * b)}\\cos ${kx}, \\quad y'(0) = ${k * b}`,
                ]
              : ask === "half"
                ? [`y\\left(${half}\\right)`, -a, `y\\left(${half}\\right) = ${a}\\cos \\pi + ${par(b)}\\sin \\pi = ${-a}`]
                : [
                    `y'\\left(${quarter}\\right)`,
                    -k * a,
                    `y'(x) = ${-k * a}\\sin ${kx} ${k * b < 0 ? "-" : "+"} ${Math.abs(k * b)}\\cos ${kx}, \\quad y'\\left(${quarter}\\right) = ${-k * a}`,
                  ];
          return numberProblem({
            prompt: t(
              `Solve $${eq}$ with $y(0) = ${a}$ and $y\\left(${quarter}\\right) = ${b}$, and find $${target}$.`,
              `求解 $${eq}$，$y(0) = ${a}$，$y\\left(${quarter}\\right) = ${b}$，并求 $${target}$。`,
            ),
            answer: ans,
            wrong: [a, b, k * a, -k * b, -ans].filter((w) => w !== ans),
            solution: t(
              steps(
                `With $y = c_1\\cos ${kx} + c_2\\sin ${kx}$: $y(0) = c_1 = ${a}$ and $y\\left(${quarter}\\right) = c_2 = ${b}$.`,
                `So $y = ${a}\\cos ${kx} ${b < 0 ? "-" : "+"} ${Math.abs(b)}\\sin ${kx}$ and $${work}$.`,
              ),
              steps(
                `设 $y = c_1\\cos ${kx} + c_2\\sin ${kx}$：$y(0) = c_1 = ${a}$，$y\\left(${quarter}\\right) = c_2 = ${b}$。`,
                `所以 $y = ${a}\\cos ${kx} ${b < 0 ? "-" : "+"} ${Math.abs(b)}\\sin ${kx}$，且 $${work}$。`,
              ),
            ),
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
          "Integrating the constant load twice gives a parabola, and the two boundary conditions pin it down so that its maximum lies at the center. For $y'' = -q$ with $y(0) = 0$ and $y(L) = 0$, integration yields $y(x) = \\frac{q}{2} x (L - x)$. The maximum occurs at the midpoint $x = L/2$, where $y(L/2) = \\frac{q L^2}{8}$.",
          "把常数载荷积分两次得到一条抛物线，两个边界条件把它确定下来，使其最大值位于中点。对于方程 $y'' = -q$（满足 $y(0) = 0$，$y(L) = 0$），积分得到抛物线型解 $y(x) = \\frac{q}{2} x (L - x)$。最大值出现在中点 $x = L/2$，此时 $y(L/2) = \\frac{q L^2}{8}$。",
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
      {
        id: "a-load-that-varies-along-the-interval",
        title: t("A load that varies along the interval", "沿区间变化的载荷"),
        explanation: t(
          "When the right-hand side depends on $x$, integrate twice and keep both constants, then use the two boundary values. For $y'' = 6x$:\n\n$$y' = 3x^{2} + c_1, \\qquad y = x^{3} + c_1x + c_2.$$\n\nWith $y(0) = A$ and $y(L) = B$: $c_2 = A$ and $L^{3} + c_1L + A = B$, so $c_1 = \\frac{B - A - L^{3}}{L}$. On $[0, 2]$ with $y(0) = 0$ and $y(2) = 0$: $c_1 = -4$, so $y = x^{3} - 4x$ and $y(1) = -3$.",
          "当右端依赖于 $x$ 时，积分两次并保留两个常数，再用两个边界值确定它们。对 $y'' = 6x$：\n\n$$y' = 3x^{2} + c_1, \\qquad y = x^{3} + c_1x + c_2.$$\n\n由 $y(0) = A$，$y(L) = B$：$c_2 = A$，$L^{3} + c_1L + A = B$，所以 $c_1 = \\frac{B - A - L^{3}}{L}$。例如在 $[0, 2]$ 上 $y(0) = 0$，$y(2) = 0$：$c_1 = -4$，$y = x^{3} - 4x$，$y(1) = -3$。",
        ),
        generate(rng: Rng): Problem {
          const L = rng.int(2, 6);
          const A = rng.int(-10, 10);
          const B = rng.int(-10, 10);
          const x0 = rng.int(1, L - 1);
          const c1 = Q.of(B - A - L ** 3, L);
          const ans = Q.of(x0 ** 3 + A).add(c1.mul(Q.of(x0)));
          return numberProblem({
            prompt: t(
              `Solve $y'' = 6x$ on $[0, ${L}]$ with $y(0) = ${A}$ and $y(${L}) = ${B}$, and find $y(${x0})$.`,
              `求解 $[0, ${L}]$ 上的 $y'' = 6x$，$y(0) = ${A}$，$y(${L}) = ${B}$，并求 $y(${x0})$。`,
            ),
            answer: ans,
            wrong: [Q.of(A).add(Q.of((B - A) * x0, L)), Q.of(x0 ** 3 + A), Q.of(x0 ** 3 + A).add(Q.of(B - A, L).mul(Q.of(x0))), ans.neg()],
            solution: t(
              steps(
                `Integrating twice: $y = x^{3} + c_1x + c_2$. From $y(0) = ${A}$, $c_2 = ${A}$.`,
                `From $y(${L}) = ${B}$: $${L ** 3} + ${L}c_1 + ${par(A)} = ${B}$, so $c_1 = ${c1.toLatex()}$.`,
                `$y(${x0}) = ${x0 ** 3} + ${par(c1)} \\cdot ${x0} + ${par(A)} = ${ans.toLatex()}$.`,
              ),
              steps(
                `积分两次：$y = x^{3} + c_1x + c_2$。由 $y(0) = ${A}$ 得 $c_2 = ${A}$。`,
                `由 $y(${L}) = ${B}$：$${L ** 3} + ${L}c_1 + ${par(A)} = ${B}$，所以 $c_1 = ${c1.toLatex()}$。`,
                `$y(${x0}) = ${x0 ** 3} + ${par(c1)} \\cdot ${x0} + ${par(A)} = ${ans.toLatex()}$。`,
              ),
            ),
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
      "The Sturm-Liouville problem $y'' + \\lambda y = 0$ with $y(0) = 0$, $y(\\pi) = 0$ has nontrivial solutions only for the eigenvalues $\\lambda_n = n^2$.",
      "施图姆-刘维尔问题 $y'' + \\lambda y = 0$，$y(0) = 0$，$y(\\pi) = 0$ 只在特征值 $\\lambda_n = n^2$ 时有非平凡解。",
    ),
    prerequisites: ["second-order-inhomogeneous-boundary-value-problems"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "dirichlet-eigenvalues",
        title: t("Finding the n-th eigenvalue for Dirichlet boundary conditions", "求狄利克雷边界条件下的第 n 个特征值"),
        explanation: t(
          "Only special values of the parameter allow a nonzero solution that vanishes at both ends, and these are the squares of whole numbers. For $y'' + \\lambda y = 0$ on $[0, \\pi]$ with $y(0) = 0$ and $y(\\pi) = 0$, nontrivial solutions are $\\phi_n(x) = \\sin(nx)$ corresponding to eigenvalues $\\lambda_n = n^2$.",
          "只有参数取特殊的值时，才存在两端都为零的非零解，这些值是整数的平方。对于定义在 $[0, \\pi]$ 上的问题 $y'' + \\lambda y = 0$（边界条件 $y(0) = 0$ 与 $y(\\pi) = 0$），非平凡特征函数为 $\\phi_n(x) = \\sin(nx)$，对应的特征值为 $\\lambda_n = n^2$。",
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
      {
        id: "eigenvalues-with-a-free-end",
        title: t("Eigenvalues with a free end", "一端自由时的特征值"),
        explanation: t(
          "Change one boundary condition and the eigenvalues change. For $y'' + \\lambda y = 0$ with $y(0) = 0$ and $y'(L) = 0$, the first condition leaves $y = \\sin(\\sqrt{\\lambda}\\,x)$, and the second needs $\\cos(\\sqrt{\\lambda}\\,L) = 0$, so $\\sqrt{\\lambda}\\,L$ is an odd multiple of $\\frac{\\pi}{2}$:\n\n$$\\lambda_n = \\left(\\frac{(2n - 1)\\pi}{2L}\\right)^{2}, \\qquad y_n = \\sin\\frac{(2n - 1)\\pi x}{2L}.$$\n\nOn $[0, \\pi]$ these are $\\frac{1}{4}, \\frac{9}{4}, \\frac{25}{4}, \\dots$, a quarter wave, three quarter waves, and so on.",
          "改变一个边界条件，特征值就会改变。对于 $y'' + \\lambda y = 0$，$y(0) = 0$，$y'(L) = 0$，第一个条件留下 $y = \\sin(\\sqrt{\\lambda}\\,x)$，第二个条件要求 $\\cos(\\sqrt{\\lambda}\\,L) = 0$，所以 $\\sqrt{\\lambda}\\,L$ 是 $\\frac{\\pi}{2}$ 的奇数倍：\n\n$$\\lambda_n = \\left(\\frac{(2n - 1)\\pi}{2L}\\right)^{2}, \\qquad y_n = \\sin\\frac{(2n - 1)\\pi x}{2L}.$$\n\n在 $[0, \\pi]$ 上它们是 $\\frac{1}{4}, \\frac{9}{4}, \\frac{25}{4}, \\dots$，分别对应四分之一波、四分之三波，依此类推。",
        ),
        generate(rng: Rng): Problem {
          const c = rng.pick([Q.of(1), Q.of(2), Q.of(1, 2), Q.of(3), Q.of(3, 2), Q.of(1, 3)]);
          const n = rng.int(1, 6);
          const root = Q.of(2 * n - 1, 2).div(c);
          const ans = root.pow(2);
          const L = piFrac(c);
          return numberProblem({
            prompt: t(
              `The eigenvalues of $y'' + \\lambda y = 0$ with $y(0) = 0$ and $y'\\left(${L}\\right) = 0$ are $\\lambda_1 < \\lambda_2 < \\cdots$. Find $\\lambda_{${n}}$.`,
              `$y'' + \\lambda y = 0$，$y(0) = 0$，$y'\\left(${L}\\right) = 0$ 的特征值为 $\\lambda_1 < \\lambda_2 < \\cdots$。求 $\\lambda_{${n}}$。`,
            ),
            answer: ans,
            wrong: [
              Q.of(n).div(c).pow(2),
              Q.of(2 * n - 1)
                .div(c)
                .pow(2),
              root,
              Q.of(2 * n + 1, 2)
                .div(c)
                .pow(2),
            ],
            solution: t(
              steps(
                `$y(0) = 0$ leaves $y = \\sin(\\sqrt{\\lambda}\\,x)$, and $y'\\left(${L}\\right) = 0$ needs $\\cos\\left(\\sqrt{\\lambda} \\cdot ${L}\\right) = 0$.`,
                `So $\\sqrt{\\lambda} \\cdot ${L} = \\frac{(2n - 1)\\pi}{2}$, and for $n = ${n}$, $\\sqrt{\\lambda_{${n}}} = ${root.toLatex()}$ and $\\lambda_{${n}} = ${ans.toLatex()}$.`,
              ),
              steps(
                `$y(0) = 0$ 留下 $y = \\sin(\\sqrt{\\lambda}\\,x)$，$y'\\left(${L}\\right) = 0$ 要求 $\\cos\\left(\\sqrt{\\lambda} \\cdot ${L}\\right) = 0$。`,
                `所以 $\\sqrt{\\lambda} \\cdot ${L} = \\frac{(2n - 1)\\pi}{2}$；当 $n = ${n}$ 时，$\\sqrt{\\lambda_{${n}}} = ${root.toLatex()}$，$\\lambda_{${n}} = ${ans.toLatex()}$。`,
              ),
            ),
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
          "The constant coefficient of a Fourier series is related to the average value of the function over one period. For a function $f(x)$ on $[-\\pi, \\pi]$, the coefficient $a_0 = \\frac{1}{\\pi} \\int_{-\\pi}^\\pi f(x)\\,dx$. For $f(x) = C$, $a_0 = \\frac{1}{\\pi}(2\\pi C) = 2C$.",
          "傅里叶级数的常数项系数与函数在一个周期上的平均值有关。对于定义在 $[-\\pi, \\pi]$ 上的函数 $f(x)$，傅里叶常数项系数定义为 $a_0 = \\frac{1}{\\pi} \\int_{-\\pi}^\\pi f(x)\\,dx$。当 $f(x) = C$ 为常数时，$a_0 = \\frac{1}{\\pi}(2\\pi C) = 2C$。",
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
      {
        id: "the-fourier-coefficients-of-a-linear-function",
        title: t("The Fourier coefficients of a linear function", "线性函数的傅里叶系数"),
        explanation: t(
          "For $f(x) = cx$ on $[-\\pi, \\pi]$ the function is odd, so every $a_n$ is $0$ and only sines appear. Integrating by parts,\n\n$$b_n = \\frac{1}{\\pi}\\int_{-\\pi}^{\\pi} cx\\sin nx\\,dx = \\frac{2c}{\\pi}\\left[-\\frac{x\\cos nx}{n}\\right]_{0}^{\\pi} = \\frac{2c(-1)^{n+1}}{n},$$\n\nsince the remaining integral of $\\cos nx$ vanishes. So $x = 2\\left(\\sin x - \\frac{\\sin 2x}{2} + \\frac{\\sin 3x}{3} - \\cdots\\right)$: the signs alternate and the coefficients shrink like $\\frac{1}{n}$.",
          "$[-\\pi, \\pi]$ 上的 $f(x) = cx$ 是奇函数，所以所有 $a_n$ 都为 $0$，只出现正弦项。分部积分：\n\n$$b_n = \\frac{1}{\\pi}\\int_{-\\pi}^{\\pi} cx\\sin nx\\,dx = \\frac{2c}{\\pi}\\left[-\\frac{x\\cos nx}{n}\\right]_{0}^{\\pi} = \\frac{2c(-1)^{n+1}}{n},$$\n\n因为剩下的 $\\cos nx$ 的积分为零。所以 $x = 2\\left(\\sin x - \\frac{\\sin 2x}{2} + \\frac{\\sin 3x}{3} - \\cdots\\right)$：符号交替，系数按 $\\frac{1}{n}$ 减小。",
        ),
        generate(rng: Rng): Problem {
          const c = rng.nonZero(-6, 6);
          const n = rng.int(1, 8);
          const ans = Q.of(2 * c * (n % 2 === 1 ? 1 : -1), n);
          const f = c === 1 ? "x" : c === -1 ? "-x" : `${c}x`;
          return numberProblem({
            prompt: t(
              `Find the Fourier coefficient $b_{${n}} = \\frac{1}{\\pi}\\int_{-\\pi}^{\\pi} f(x)\\sin ${n === 1 ? "" : n}x\\,dx$ for $f(x) = ${f}$ on $[-\\pi, \\pi]$.`,
              `对 $[-\\pi, \\pi]$ 上的 $f(x) = ${f}$，求傅里叶系数 $b_{${n}} = \\frac{1}{\\pi}\\int_{-\\pi}^{\\pi} f(x)\\sin ${n === 1 ? "" : n}x\\,dx$。`,
            ),
            answer: ans,
            wrong: [ans.neg(), Q.of(2 * c, n), Q.of(c, n), Q.zero],
            solution: t(
              steps(
                `$f$ is odd, and by parts $b_n = \\frac{2c(-1)^{n+1}}{n}$ with $c = ${c}$.`,
                `For $n = ${n}$: $b_{${n}} = \\frac{2 \\cdot ${par(c)} \\cdot (-1)^{${n + 1}}}{${n}} = ${ans.toLatex()}$.`,
              ),
              steps(
                `$f$ 是奇函数，分部积分得 $b_n = \\frac{2c(-1)^{n+1}}{n}$，其中 $c = ${c}$。`,
                `当 $n = ${n}$ 时：$b_{${n}} = \\frac{2 \\cdot ${par(c)} \\cdot (-1)^{${n + 1}}}{${n}} = ${ans.toLatex()}$。`,
              ),
            ),
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
          "Different sine and cosine modes are orthogonal over a full period, so each mode can be isolated by multiplying by it and integrating. By orthogonality, $\\int_{-\\pi}^\\pi \\sin^2(nx)\\,dx = \\pi$ for any non-zero integer $n$. Thus $\\frac{1}{\\pi} \\int_{-\\pi}^\\pi (k \\sin(nx))^2\\,dx = k^2$.",
          "不同的正弦和余弦模式在一个完整周期上是正交的，所以乘以某个模式再积分就能把它单独分离出来。根据正交性，对任意非零整数 $n$，均有 $\\int_{-\\pi}^\\pi \\sin^2(nx)\\,dx = \\pi$。因此 $\\frac{1}{\\pi} \\int_{-\\pi}^\\pi (k \\sin(nx))^2\\,dx = k^2$。",
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
      {
        id: "parsevals-identity-for-a-trigonometric-polynomial",
        title: t("Parseval's identity for a trigonometric polynomial", "三角多项式的帕塞瓦尔恒等式"),
        explanation: t(
          "Squaring a Fourier series and integrating term by term, every cross term vanishes by orthogonality, leaving **Parseval's identity**:\n\n$$\\frac{1}{\\pi}\\int_{-\\pi}^{\\pi} f(x)^{2}\\,dx = \\frac{a_0^{2}}{2} + \\sum_{n \\ge 1}\\left(a_n^{2} + b_n^{2}\\right).$$\n\nThe constant term of the series is $\\frac{a_0}{2}$, so a constant $A$ contributes $\\frac{(2A)^{2}}{2} = 2A^{2}$, not $A^{2}$. For $f = 1 + 3\\cos x - 2\\sin 4x$: $2 + 9 + 4 = 15$.",
          "把傅里叶级数平方后逐项积分，由正交性所有交叉项都为零，得到**帕塞瓦尔恒等式**：\n\n$$\\frac{1}{\\pi}\\int_{-\\pi}^{\\pi} f(x)^{2}\\,dx = \\frac{a_0^{2}}{2} + \\sum_{n \\ge 1}\\left(a_n^{2} + b_n^{2}\\right).$$\n\n级数的常数项是 $\\frac{a_0}{2}$，所以常数 $A$ 贡献 $\\frac{(2A)^{2}}{2} = 2A^{2}$，而不是 $A^{2}$。例如 $f = 1 + 3\\cos x - 2\\sin 4x$：$2 + 9 + 4 = 15$。",
        ),
        generate(rng: Rng): Problem {
          const A = rng.nonZero(-5, 5);
          const B = rng.nonZero(-6, 6);
          const C = rng.nonZero(-6, 6);
          const m = rng.int(1, 4);
          const n = rng.int(1, 5);
          const ans = 2 * A * A + B * B + C * C;
          const term = (c: number, fn: string, k: number) =>
            `${c < 0 ? "-" : "+"} ${Math.abs(c) === 1 ? "" : Math.abs(c)}\\${fn} ${k === 1 ? "" : k}x`;
          const f = `${A} ${term(B, "cos", m)} ${term(C, "sin", n)}`;
          return numberProblem({
            prompt: t(
              `Use Parseval's identity to evaluate $\\frac{1}{\\pi}\\int_{-\\pi}^{\\pi} f(x)^{2}\\,dx$ for $f(x) = ${f}$.`,
              `用帕塞瓦尔恒等式计算 $f(x) = ${f}$ 的 $\\frac{1}{\\pi}\\int_{-\\pi}^{\\pi} f(x)^{2}\\,dx$。`,
            ),
            answer: ans,
            wrong: [A * A + B * B + C * C, (A + B + C) ** 2, 2 * A * A + (B * B + C * C) / 2, 4 * A * A + B * B + C * C].filter((w) =>
              Number.isInteger(w),
            ),
            solution: t(
              steps(
                `Here $\\frac{a_0}{2} = ${A}$, so $a_0 = ${2 * A}$; the other coefficients are $a_{${m}} = ${B}$ and $b_{${n}} = ${C}$.`,
                `$\\frac{a_0^{2}}{2} + a_{${m}}^{2} + b_{${n}}^{2} = \\frac{${4 * A * A}}{2} + ${B * B} + ${C * C} = ${ans}$.`,
              ),
              steps(
                `这里 $\\frac{a_0}{2} = ${A}$，所以 $a_0 = ${2 * A}$；其余系数为 $a_{${m}} = ${B}$，$b_{${n}} = ${C}$。`,
                `$\\frac{a_0^{2}}{2} + a_{${m}}^{2} + b_{${n}}^{2} = \\frac{${4 * A * A}}{2} + ${B * B} + ${C * C} = ${ans}$。`,
              ),
            ),
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
      "The odd extension to $[-\\pi, \\pi]$ has a Fourier series of sines only, with $b_n = \\frac{2}{\\pi}\\int_0^{\\pi} f(x)\\sin nx\\,dx$.",
      "奇延拓到 $[-\\pi, \\pi]$ 的傅里叶级数只含正弦项，系数为 $b_n = \\frac{2}{\\pi}\\int_0^{\\pi} f(x)\\sin nx\\,dx$。",
    ),
    prerequisites: ["properties-of-fourier-series"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "fourier-sine-coefficient-pure-tone",
        title: t("Fourier sine coefficient of a harmonic component", "谐波分量的傅里叶正弦系数"),
        explanation: t(
          "A function that is already a single sine mode has that mode as its only Fourier component, so every other coefficient is zero. For $f(x) = k \\sin(m x)$ on $(0, \\pi)$, orthogonality implies that $b_n = k$ when $n = m$ and $0$ for all $n \\ne m$.",
          "本身就是单个正弦模式的函数，其傅里叶分量只有这一个模式，所以其他系数都为零。对于在 $(0, \\pi)$ 上定义的正弦函数 $f(x) = k \\sin(m x)$，由正交性可知，当 $n = m$ 时其傅里叶正弦系数 $b_m = k$，其余系数均为 $0$。",
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
      {
        id: "the-sine-series-of-a-constant",
        title: t("The sine series of a constant", "常数的正弦级数"),
        explanation: t(
          "Even a constant has a sine series on $(0, \\pi)$: its odd extension is a square wave. For $f(x) = c$,\n\n$$b_n = \\frac{2}{\\pi}\\int_{0}^{\\pi} c\\sin nx\\,dx = \\frac{2c}{\\pi}\\left[-\\frac{\\cos nx}{n}\\right]_{0}^{\\pi} = \\frac{2c\\left(1 - (-1)^{n}\\right)}{n\\pi}.$$\n\nSo $b_n = \\frac{4c}{n\\pi}$ for odd $n$ and $b_n = 0$ for even $n$: $1 = \\frac{4}{\\pi}\\left(\\sin x + \\frac{\\sin 3x}{3} + \\frac{\\sin 5x}{5} + \\cdots\\right)$ on $(0, \\pi)$.",
          "即使是常数，在 $(0, \\pi)$ 上也有正弦级数：它的奇延拓是方波。对 $f(x) = c$，\n\n$$b_n = \\frac{2}{\\pi}\\int_{0}^{\\pi} c\\sin nx\\,dx = \\frac{2c}{\\pi}\\left[-\\frac{\\cos nx}{n}\\right]_{0}^{\\pi} = \\frac{2c\\left(1 - (-1)^{n}\\right)}{n\\pi}.$$\n\n所以 $n$ 为奇数时 $b_n = \\frac{4c}{n\\pi}$，为偶数时 $b_n = 0$：在 $(0, \\pi)$ 上 $1 = \\frac{4}{\\pi}\\left(\\sin x + \\frac{\\sin 3x}{3} + \\frac{\\sin 5x}{5} + \\cdots\\right)$。",
        ),
        generate(rng: Rng): Problem {
          const c = rng.nonZero(-9, 9);
          const n = rng.bool(0.8) ? 2 * rng.int(0, 4) + 1 : 2 * rng.int(1, 4);
          const ans = Q.of(n % 2 === 1 ? 4 * c : 0, n);
          return numberProblem({
            prompt: t(
              `The Fourier sine series of $f(x) = ${c}$ on $(0, \\pi)$ has coefficients $b_n$. Writing $b_{${n}} = \\frac{K}{\\pi}$, find $K$.`,
              `$f(x) = ${c}$ 在 $(0, \\pi)$ 上的傅里叶正弦级数的系数为 $b_n$。把 $b_{${n}}$ 写成 $\\frac{K}{\\pi}$，求 $K$。`,
            ),
            answer: ans,
            wrong: [Q.of(2 * c, n), Q.of(4 * c, n), Q.of(4 * c, n * n), Q.of(-4 * c, n)],
            solution: t(
              steps(
                `$b_n = \\frac{2}{\\pi}\\int_{0}^{\\pi} ${par(c)}\\sin nx\\,dx = \\frac{2 \\cdot ${par(c)}\\left(1 - (-1)^{n}\\right)}{n\\pi}$.`,
                `For $n = ${n}$, $1 - (-1)^{${n}} = ${n % 2 === 1 ? 2 : 0}$, so $b_{${n}} = \\frac{${ans.toLatex()}}{\\pi}$ and $K = ${ans.toLatex()}$.`,
              ),
              steps(
                `$b_n = \\frac{2}{\\pi}\\int_{0}^{\\pi} ${par(c)}\\sin nx\\,dx = \\frac{2 \\cdot ${par(c)}\\left(1 - (-1)^{n}\\right)}{n\\pi}$。`,
                `当 $n = ${n}$ 时，$1 - (-1)^{${n}} = ${n % 2 === 1 ? 2 : 0}$，所以 $b_{${n}} = \\frac{${ans.toLatex()}}{\\pi}$，$K = ${ans.toLatex()}$。`,
              ),
            ),
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
      "The even extension to $[-\\pi, \\pi]$ has a Fourier series of cosines only, with $a_n = \\frac{2}{\\pi}\\int_0^{\\pi} f(x)\\cos nx\\,dx$.",
      "偶延拓到 $[-\\pi, \\pi]$ 的傅里叶级数只含余弦项，系数为 $a_n = \\frac{2}{\\pi}\\int_0^{\\pi} f(x)\\cos nx\\,dx$。",
    ),
    prerequisites: ["fourier-sine-series"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "fourier-cosine-coefficient-pure-tone",
        title: t("Fourier cosine coefficient of a harmonic component", "谐波分量的傅里叶余弦系数"),
        explanation: t(
          "A function that is already a single cosine mode has only one nonzero cosine coefficient, equal to its amplitude. For $f(x) = k \\cos(m x)$ on $(0, \\pi)$, orthogonality implies that $a_m = k$ and all other $a_n = 0$.",
          "本身就是单个余弦模式的函数只有一个非零的余弦系数，等于它的振幅。对于在 $(0, \\pi)$ 上定义的余弦函数 $f(x) = k \\cos(m x)$，由正交性可知，当 $n = m$ 时其傅里叶余弦系数 $a_m = k$，其余系数均为 $0$。",
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
      {
        id: "the-cosine-series-of-a-linear-function",
        title: t("The cosine series of a linear function", "线性函数的余弦级数"),
        explanation: t(
          "The even extension of $f(x) = cx$ from $(0, \\pi)$ is the triangle wave $c|x|$, so its series has cosines only. By parts,\n\n$$a_n = \\frac{2}{\\pi}\\int_{0}^{\\pi} cx\\cos nx\\,dx = \\frac{2c}{\\pi}\\left[\\frac{\\cos nx}{n^{2}}\\right]_{0}^{\\pi} = \\frac{2c\\left((-1)^{n} - 1\\right)}{n^{2}\\pi},$$\n\nwhich is $-\\frac{4c}{n^{2}\\pi}$ for odd $n$ and $0$ for even $n$, while $a_0 = c\\pi$. The coefficients shrink like $\\frac{1}{n^{2}}$, faster than for the sine series, because the triangle wave has no jumps.",
          "$f(x) = cx$ 从 $(0, \\pi)$ 出发的偶延拓是三角波 $c|x|$，所以其级数只有余弦项。分部积分：\n\n$$a_n = \\frac{2}{\\pi}\\int_{0}^{\\pi} cx\\cos nx\\,dx = \\frac{2c}{\\pi}\\left[\\frac{\\cos nx}{n^{2}}\\right]_{0}^{\\pi} = \\frac{2c\\left((-1)^{n} - 1\\right)}{n^{2}\\pi},$$\n\n$n$ 为奇数时为 $-\\frac{4c}{n^{2}\\pi}$，为偶数时为 $0$，而 $a_0 = c\\pi$。系数按 $\\frac{1}{n^{2}}$ 减小，比正弦级数快，因为三角波没有跳跃。",
        ),
        generate(rng: Rng): Problem {
          const c = rng.nonZero(-9, 9);
          const n = rng.bool(0.8) ? 2 * rng.int(0, 3) + 1 : 2 * rng.int(1, 3);
          const ans = Q.of(n % 2 === 1 ? -4 * c : 0, n * n);
          const f = c === 1 ? "x" : c === -1 ? "-x" : `${c}x`;
          return numberProblem({
            prompt: t(
              `The Fourier cosine series of $f(x) = ${f}$ on $(0, \\pi)$ has coefficients $a_n$. Writing $a_{${n}} = \\frac{K}{\\pi}$, find $K$.`,
              `$f(x) = ${f}$ 在 $(0, \\pi)$ 上的傅里叶余弦级数的系数为 $a_n$。把 $a_{${n}}$ 写成 $\\frac{K}{\\pi}$，求 $K$。`,
            ),
            answer: ans,
            wrong: [Q.of(4 * c, n * n), Q.of(-4 * c, n), Q.of(-2 * c, n * n), Q.of(2 * c * (n % 2 === 1 ? 1 : -1), n)],
            solution: t(
              steps(
                `$a_n = \\frac{2}{\\pi}\\int_{0}^{\\pi} ${f}\\cos nx\\,dx = \\frac{2 \\cdot ${par(c)}\\left((-1)^{n} - 1\\right)}{n^{2}\\pi}$.`,
                `For $n = ${n}$, $(-1)^{${n}} - 1 = ${n % 2 === 1 ? -2 : 0}$, so $a_{${n}} = \\frac{${ans.toLatex()}}{\\pi}$ and $K = ${ans.toLatex()}$.`,
              ),
              steps(
                `$a_n = \\frac{2}{\\pi}\\int_{0}^{\\pi} ${f}\\cos nx\\,dx = \\frac{2 \\cdot ${par(c)}\\left((-1)^{n} - 1\\right)}{n^{2}\\pi}$。`,
                `当 $n = ${n}$ 时，$(-1)^{${n}} - 1 = ${n % 2 === 1 ? -2 : 0}$，所以 $a_{${n}} = \\frac{${ans.toLatex()}}{\\pi}$，$K = ${ans.toLatex()}$。`,
              ),
            ),
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
      {
        id: "coefficients-on-a-general-interval",
        title: t("Coefficients on a general interval", "一般区间上的系数"),
        explanation: t(
          "On $[-L, L]$ the coefficients use $\\frac{1}{L}$ and the scaled modes $\\frac{n\\pi x}{L}$:\n\n$$b_n = \\frac{1}{L}\\int_{-L}^{L} f(x)\\sin\\frac{n\\pi x}{L}\\,dx.$$\n\nSubstituting $u = \\frac{\\pi x}{L}$ turns this into the familiar $2\\pi$-periodic case, so for $f(x) = x$ the result is the $[-\\pi, \\pi]$ answer scaled by $\\frac{L}{\\pi}$:\n\n$$b_n = \\frac{2L(-1)^{n+1}}{n\\pi}.$$\n\nFor $L = 3$, $b_1 = \\frac{6}{\\pi}$ and $b_2 = -\\frac{3}{\\pi}$.",
          "在 $[-L, L]$ 上，系数用 $\\frac{1}{L}$ 和伸缩后的模式 $\\frac{n\\pi x}{L}$：\n\n$$b_n = \\frac{1}{L}\\int_{-L}^{L} f(x)\\sin\\frac{n\\pi x}{L}\\,dx.$$\n\n代换 $u = \\frac{\\pi x}{L}$ 把它变回熟悉的 $2\\pi$ 周期情形，所以对 $f(x) = x$，结果就是 $[-\\pi, \\pi]$ 上的答案乘以 $\\frac{L}{\\pi}$：\n\n$$b_n = \\frac{2L(-1)^{n+1}}{n\\pi}.$$\n\n例如 $L = 3$ 时，$b_1 = \\frac{6}{\\pi}$，$b_2 = -\\frac{3}{\\pi}$。",
        ),
        generate(rng: Rng): Problem {
          const L = rng.int(2, 9);
          const n = rng.int(1, 6);
          const c = rng.pick([1, 1, 2, 3, -1, -2]);
          const ans = Q.of(2 * L * c * (n % 2 === 1 ? 1 : -1), n);
          const f = c === 1 ? "x" : c === -1 ? "-x" : `${c}x`;
          const mode = `\\frac{${n === 1 ? "" : n}\\pi x}{${L}}`;
          return numberProblem({
            prompt: t(
              `$f(x) = ${f}$ on $[-${L}, ${L}]$ is extended with period $${2 * L}$. Its Fourier coefficient $b_{${n}}$ of $\\sin ${mode}$ can be written $\\frac{K}{\\pi}$. Find $K$.`,
              `$[-${L}, ${L}]$ 上的 $f(x) = ${f}$ 以 $${2 * L}$ 为周期延拓。它关于 $\\sin ${mode}$ 的傅里叶系数 $b_{${n}}$ 可写成 $\\frac{K}{\\pi}$。求 $K$。`,
            ),
            answer: ans,
            wrong: [
              ans.neg(),
              Q.of(2 * c * (n % 2 === 1 ? 1 : -1), n),
              Q.of(2 * L * L * c * (n % 2 === 1 ? 1 : -1), n),
              Q.of(L * c * (n % 2 === 1 ? 1 : -1), n),
            ],
            solution: t(
              steps(
                `By parts, $b_n = \\frac{1}{${L}}\\int_{-${L}}^{${L}} ${f}\\sin\\frac{n\\pi x}{${L}}\\,dx = \\frac{2 \\cdot ${L} \\cdot ${par(c)}(-1)^{n+1}}{n\\pi}$.`,
                `For $n = ${n}$: $b_{${n}} = \\frac{${ans.toLatex()}}{\\pi}$, so $K = ${ans.toLatex()}$.`,
              ),
              steps(
                `分部积分，$b_n = \\frac{1}{${L}}\\int_{-${L}}^{${L}} ${f}\\sin\\frac{n\\pi x}{${L}}\\,dx = \\frac{2 \\cdot ${L} \\cdot ${par(c)}(-1)^{n+1}}{n\\pi}$。`,
                `当 $n = ${n}$ 时：$b_{${n}} = \\frac{${ans.toLatex()}}{\\pi}$，所以 $K = ${ans.toLatex()}$。`,
              ),
            ),
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
          "At a jump, the Fourier series cannot choose either side, so it converges to the midpoint of the two one sided limits. At a jump discontinuity $x_0$, the Fourier series converges to $\\frac{f(x_0^+) + f(x_0^-)}{2}$.",
          "在跳跃点处，傅里叶级数无法偏向任何一侧，所以它收敛到两个单侧极限的中点。在跳跃间断点 $x_0$ 处，傅里叶级数收敛于左右极限的平均值：$\\frac{f(x_0^+) + f(x_0^-)}{2}$。",
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
      {
        id: "convergence-of-the-periodic-extension",
        title: t("Convergence of the periodic extension", "周期延拓的收敛"),
        explanation: t(
          "A Fourier series converges to the **periodic extension** of $f$, not to $f$ itself outside the base interval. For $f$ on $(-L, L)$ with period $2L$:\n\n1. shift $x$ by a multiple of $2L$ into $(-L, L]$;\n2. at an interior point of continuity the sum is $f$ there;\n3. at $x = L$ (and every $L + 2kL$) the ends of the interval meet, so the sum is $\\frac{f(L^{-}) + f(-L^{+})}{2}$.\n\nFor $f(x) = x$ on $(-2, 2)$, the series is $1$ at $x = 5$ (shifted to $1$) and $0$ at $x = 2$, the average of $2$ and $-2$.",
          "傅里叶级数收敛到 $f$ 的**周期延拓**，在基本区间之外并不收敛到 $f$ 本身。对 $(-L, L)$ 上、周期为 $2L$ 的 $f$：\n\n1. 把 $x$ 平移 $2L$ 的整数倍，移到 $(-L, L]$ 中；\n2. 在内部的连续点，级数和就是 $f$ 在该点的值；\n3. 在 $x = L$（以及每个 $L + 2kL$）处区间两端相接，级数和为 $\\frac{f(L^{-}) + f(-L^{+})}{2}$。\n\n例如 $(-2, 2)$ 上的 $f(x) = x$，级数在 $x = 5$ 处（平移到 $1$）为 $1$，在 $x = 2$ 处为 $2$ 与 $-2$ 的平均值 $0$。",
        ),
        generate(rng: Rng): Problem {
          const L = rng.int(1, 5);
          const a = rng.nonZero(-4, 4);
          const b = rng.nonZero(-6, 6);
          const end = rng.bool(0.4);
          const x0 = end ? L : rng.int(-L + 1, L - 1);
          const shift = rng.pick([-2, -1, 1, 2]);
          const x = x0 + 2 * L * shift;
          const ans = end ? b : a * x0 + b;
          const f = `${a === 1 ? "" : a === -1 ? "-" : a}x ${b < 0 ? "-" : "+"} ${Math.abs(b)}`;
          return numberProblem({
            prompt: t(
              `$f(x) = ${f}$ on $(-${L}, ${L})$ is extended with period $${2 * L}$. To what value does its Fourier series converge at $x = ${x}$?`,
              `$(-${L}, ${L})$ 上的 $f(x) = ${f}$ 以 $${2 * L}$ 为周期延拓。它的傅里叶级数在 $x = ${x}$ 处收敛到什么值？`,
            ),
            answer: ans,
            wrong: [a * x + b, a * L + b, -a * L + b, a * x0 + b].filter((w) => w !== ans),
            solution: end
              ? t(
                  `Shifting by $${2 * L * shift}$ moves $x = ${x}$ to $${L}$, where the ends meet: the sum is $\\frac{f(${L}^{-}) + f(-${L}^{+})}{2} = \\frac{${a * L + b} + ${par(-a * L + b)}}{2} = ${b}$.`,
                  `平移 $${2 * L * shift}$ 把 $x = ${x}$ 移到 $${L}$，这里区间两端相接：级数和为 $\\frac{f(${L}^{-}) + f(-${L}^{+})}{2} = \\frac{${a * L + b} + ${par(-a * L + b)}}{2} = ${b}$。`,
                )
              : t(
                  `Shifting by $${2 * L * shift}$ moves $x = ${x}$ to $${x0}$, a point of continuity, so the sum is $f(${x0}) = ${ans}$.`,
                  `平移 $${2 * L * shift}$ 把 $x = ${x}$ 移到 $${x0}$，这是连续点，所以级数和为 $f(${x0}) = ${ans}$。`,
                ),
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
          "Differentiating a sine mode gives a cosine mode multiplied by its frequency, so the coefficients of the derivative are the old ones times the frequency. For $f(x) = b_n \\sin(nx)$, differentiating term-by-term gives $f'(x) = (n b_n) \\cos(nx)$. The coefficient of $\\cos(nx)$ is $n b_n$.",
          "对正弦模式求导得到乘以频率的余弦模式，所以导数的系数是原系数乘以频率。对于 $f(x) = b_n \\sin(nx)$，逐项求导得 $f'(x) = (n b_n) \\cos(nx)$。因此 $\\cos(nx)$ 项的系数为 $n b_n$。",
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
              `因此 $\\cos(${n}x)$ 的系数为 $${ans}$。`,
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
      {
        id: "term-by-term-integration",
        title: t("Term-by-term integration", "逐项积分"),
        explanation: t(
          "Integration is gentler than differentiation: a Fourier series can always be integrated term by term, and each coefficient is divided by $n$. From $0$ to $x$,\n\n$$\\int_{0}^{x} a\\cos nt\\,dt = \\frac{a}{n}\\sin nx, \\qquad \\int_{0}^{x} b\\sin nt\\,dt = \\frac{b}{n} - \\frac{b}{n}\\cos nx.$$\n\nA sine term turns into a cosine term with coefficient $-\\frac{b}{n}$, plus a constant. Dividing by $n$ makes the coefficients shrink faster, which is why integrated series converge better.",
          "积分比求导更温和：傅里叶级数总可以逐项积分，每个系数除以 $n$。从 $0$ 积到 $x$：\n\n$$\\int_{0}^{x} a\\cos nt\\,dt = \\frac{a}{n}\\sin nx, \\qquad \\int_{0}^{x} b\\sin nt\\,dt = \\frac{b}{n} - \\frac{b}{n}\\cos nx.$$\n\n正弦项变成系数为 $-\\frac{b}{n}$ 的余弦项，外加一个常数。除以 $n$ 使系数衰减得更快，所以积分后的级数收敛得更好。",
        ),
        generate(rng: Rng): Problem {
          const n = rng.int(2, 9);
          const c = rng.nonZero(-20, 20);
          const sine = rng.bool();
          const ans = Q.of(sine ? -c : c, n);
          const term = `${c}\\${sine ? "sin" : "cos"} ${n}t`;
          const target = sine ? `\\cos ${n}x` : `\\sin ${n}x`;
          return numberProblem({
            prompt: t(
              `A Fourier series contains the term $${term}$. Integrating term by term, find the coefficient of $${target}$ that this term contributes to $\\int_{0}^{x} f(t)\\,dt$.`,
              `某傅里叶级数含有项 $${term}$。逐项积分，求该项在 $\\int_{0}^{x} f(t)\\,dt$ 中贡献的 $${target}$ 的系数。`,
            ),
            answer: ans,
            wrong: [ans.neg(), Q.of(c * n), Q.of(-c * n), Q.of(c, n * n)],
            solution: sine
              ? t(
                  `$\\int_{0}^{x} ${c}\\sin ${n}t\\,dt = \\left[-\\frac{${c}}{${n}}\\cos ${n}t\\right]_{0}^{x} = ${Q.of(c, n).toLatex()} - ${par(Q.of(c, n))}\\cos ${n}x$, so the coefficient of $\\cos ${n}x$ is $${ans.toLatex()}$.`,
                  `$\\int_{0}^{x} ${c}\\sin ${n}t\\,dt = \\left[-\\frac{${c}}{${n}}\\cos ${n}t\\right]_{0}^{x} = ${Q.of(c, n).toLatex()} - ${par(Q.of(c, n))}\\cos ${n}x$，所以 $\\cos ${n}x$ 的系数为 $${ans.toLatex()}$。`,
                )
              : t(
                  `$\\int_{0}^{x} ${c}\\cos ${n}t\\,dt = \\frac{${c}}{${n}}\\sin ${n}x$, so the coefficient of $\\sin ${n}x$ is $${ans.toLatex()}$.`,
                  `$\\int_{0}^{x} ${c}\\cos ${n}t\\,dt = \\frac{${c}}{${n}}\\sin ${n}x$，所以 $\\sin ${n}x$ 的系数为 $${ans.toLatex()}$。`,
                ),
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
      "Under a Fourier series, the driven equation $y'' + \\omega_0^2 y = \\sum F_n \\sin nx$ splits into harmonics with amplitudes $Y_n = \\frac{F_n}{\\omega_0^2 - n^2}$.",
      "借助傅里叶级数，受迫方程 $y'' + \\omega_0^2 y = \\sum F_n \\sin nx$ 分解为各谐波，振幅为 $Y_n = \\frac{F_n}{\\omega_0^2 - n^2}$。",
    ),
    prerequisites: ["differentiating-and-integrating-fourier-series"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "fourier-mode-amplitude",
        title: t("Fundamental mode response amplitude in driven oscillation", "受迫振荡中的基频响应振幅"),
        explanation: t(
          "Each forcing mode drives a response in the same mode, and its amplitude is the forcing amplitude divided by the difference of the squared frequencies. For $y'' + \\omega_0^2 y = F_1 \\sin(x)$, substituting the ansatz $y_p(t) = Y_1 \\sin(x)$ gives $(-1 + \\omega_0^2) Y_1 = F_1$, so $Y_1 = \\frac{F_1}{\\omega_0^2 - 1}$.",
          "每个强迫模式都会在同一模式中引起响应，振幅等于强迫振幅除以频率平方之差。对于方程 $y'' + \\omega_0^2 y = F_1 \\sin(x)$，代入试探解 $y_p(t) = Y_1 \\sin(x)$ 得到 $(-1 + \\omega_0^2) Y_1 = F_1$，故响应振幅为 $Y_1 = \\frac{F_1}{\\omega_0^2 - 1}$。",
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
      {
        id: "the-response-to-a-square-wave",
        title: t("The response to a square wave", "对方波的响应"),
        explanation: t(
          "A periodic force that is not a single sine is first expanded in its Fourier series, and then each harmonic is answered separately. The square wave of height $1$ is\n\n$$f(x) = \\frac{4}{\\pi}\\sum_{n \\text{ odd}} \\frac{\\sin nx}{n},$$\n\nso the steady response of $y'' + \\omega_0^{2}y = f(x)$ is $\\sum Y_n\\sin nx$ with\n\n$$Y_n = \\frac{4}{\\pi n\\left(\\omega_0^{2} - n^{2}\\right)} \\quad (n \\text{ odd}).$$\n\nA harmonic with $n$ close to $\\omega_0$ has a small denominator and dominates the response, even if its forcing coefficient is small.",
          "不是单一正弦的周期外力，先展开为傅里叶级数，再对每个谐波分别求响应。高度为 $1$ 的方波为\n\n$$f(x) = \\frac{4}{\\pi}\\sum_{n \\text{ 为奇数}} \\frac{\\sin nx}{n},$$\n\n所以 $y'' + \\omega_0^{2}y = f(x)$ 的稳态响应为 $\\sum Y_n\\sin nx$，其中\n\n$$Y_n = \\frac{4}{\\pi n\\left(\\omega_0^{2} - n^{2}\\right)} \\quad (n \\text{ 为奇数}).$$\n\n$n$ 接近 $\\omega_0$ 的谐波分母很小，即使其激励系数很小，也会主导响应。",
        ),
        generate(rng: Rng): Problem {
          const w = rng.pick([2, 3, 5, 6, 7, 8, 10, 11, 12, 15, 17]);
          const n = rng.pick([1, 3, 5]);
          const ans = Q.of(4, n * (w - n * n));
          return numberProblem({
            prompt: t(
              `The square wave $f(x) = \\frac{4}{\\pi}\\left(\\sin x + \\frac{\\sin 3x}{3} + \\frac{\\sin 5x}{5} + \\cdots\\right)$ drives $y'' + ${w}y = f(x)$. The steady response has the term $Y_{${n}}\\sin ${n === 1 ? "" : n}x$ with $Y_{${n}} = \\frac{K}{\\pi}$. Find $K$.`,
              `方波 $f(x) = \\frac{4}{\\pi}\\left(\\sin x + \\frac{\\sin 3x}{3} + \\frac{\\sin 5x}{5} + \\cdots\\right)$ 驱动 $y'' + ${w}y = f(x)$。稳态响应中含有项 $Y_{${n}}\\sin ${n === 1 ? "" : n}x$，且 $Y_{${n}} = \\frac{K}{\\pi}$。求 $K$。`,
            ),
            answer: ans,
            wrong: [Q.of(4, w - n * n), Q.of(4, n * (w + n * n)), Q.of(4, n * (n * n - w)), Q.of(4 * n, w - n * n)],
            solution: t(
              steps(
                `The forcing coefficient of $\\sin ${n === 1 ? "" : n}x$ is $F_{${n}} = \\frac{4}{${n}\\pi}$.`,
                `Substituting $Y_{${n}}\\sin ${n === 1 ? "" : n}x$ gives $(${w} - ${n * n})Y_{${n}} = F_{${n}}$, so $Y_{${n}} = \\frac{4}{${n} \\cdot ${par(w - n * n)}\\pi} = \\frac{${ans.toLatex()}}{\\pi}$ and $K = ${ans.toLatex()}$.`,
              ),
              steps(
                `$\\sin ${n === 1 ? "" : n}x$ 的激励系数为 $F_{${n}} = \\frac{4}{${n}\\pi}$。`,
                `代入 $Y_{${n}}\\sin ${n === 1 ? "" : n}x$ 得 $(${w} - ${n * n})Y_{${n}} = F_{${n}}$，所以 $Y_{${n}} = \\frac{4}{${n} \\cdot ${par(w - n * n)}\\pi} = \\frac{${ans.toLatex()}}{\\pi}$，$K = ${ans.toLatex()}$。`,
              ),
            ),
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
          "The particular solution handles the forcing, and the initial conditions then fix the coefficients of the homogeneous part of the solution. For $y'' + \\omega_0^2 y = F(t)$ with a particular solution satisfying $y_p(0) = 0$, the general solution is $y(t) = y_p(t) + c_1 \\cos(\\omega_0 t) + c_2 \\sin(\\omega_0 t)$. Setting $t = 0$ yields $y(0) = c_1 = y_0$.",
          "特解处理强迫项，再由初始条件确定解中齐次部分的系数。对于包含满足 $y_p(0) = 0$ 的特解的方程 $y'' + \\omega_0^2 y = F(t)$，通解为 $y(t) = y_p(t) + c_1 \\cos(\\omega_0 t) + c_2 \\sin(\\omega_0 t)$。在 $t = 0$ 处代入即得 $y(0) = c_1 = y_0$。",
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
      {
        id: "starting-from-rest",
        title: t("Starting from rest", "从静止开始"),
        explanation: t(
          "A driven oscillator that starts at rest, $y(0) = 0$ and $y'(0) = 0$, still needs free oscillations to cancel the slope of the forced response. For $y'' + \\omega_0^{2}y = F\\sin nt$ with $n \\ne \\omega_0$:\n\n$$y = Y\\sin nt + c_1\\cos\\omega_0 t + c_2\\sin\\omega_0 t, \\qquad Y = \\frac{F}{\\omega_0^{2} - n^{2}}.$$\n\n$y(0) = 0$ gives $c_1 = 0$, and $y'(0) = nY + \\omega_0c_2 = 0$ gives $c_2 = -\\frac{nY}{\\omega_0}$. The motion mixes the driving frequency with the natural one.",
          "从静止开始（$y(0) = 0$，$y'(0) = 0$）的受迫振子，仍需要自由振动来抵消受迫响应的初始斜率。对 $y'' + \\omega_0^{2}y = F\\sin nt$（$n \\ne \\omega_0$）：\n\n$$y = Y\\sin nt + c_1\\cos\\omega_0 t + c_2\\sin\\omega_0 t, \\qquad Y = \\frac{F}{\\omega_0^{2} - n^{2}}.$$\n\n由 $y(0) = 0$ 得 $c_1 = 0$，由 $y'(0) = nY + \\omega_0c_2 = 0$ 得 $c_2 = -\\frac{nY}{\\omega_0}$。运动是驱动频率与固有频率的混合。",
        ),
        generate(rng: Rng): Problem {
          const w = rng.int(2, 6);
          const n = rng.pick([1, 2, 3, 4, 5, 7].filter((m) => m !== w));
          const Y = rng.nonZero(-6, 6);
          const F = Y * (w * w - n * n);
          const c2 = Q.of(-n * Y, w);
          const nt = n === 1 ? "t" : `${n}t`;
          return numberProblem({
            prompt: t(
              `Solve $y'' + ${w * w}y = ${F}\\sin ${nt}$ with $y(0) = 0$ and $y'(0) = 0$, writing $y = Y\\sin ${nt} + c_1\\cos ${w}t + c_2\\sin ${w}t$. Find $c_2$.`,
              `求解 $y'' + ${w * w}y = ${F}\\sin ${nt}$，$y(0) = 0$，$y'(0) = 0$，写成 $y = Y\\sin ${nt} + c_1\\cos ${w}t + c_2\\sin ${w}t$。求 $c_2$。`,
            ),
            answer: c2,
            wrong: [c2.neg(), Q.of(-Y), Q.of(-w * Y, n), Q.zero],
            solution: t(
              steps(
                `The forced amplitude is $Y = \\frac{${F}}{${w * w} - ${n * n}} = ${Y}$.`,
                `$y(0) = c_1 = 0$, and $y'(0) = ${n}Y + ${w}c_2 = ${n * Y} + ${w}c_2 = 0$, so $c_2 = ${c2.toLatex()}$.`,
              ),
              steps(
                `受迫振幅为 $Y = \\frac{${F}}{${w * w} - ${n * n}} = ${Y}$。`,
                `$y(0) = c_1 = 0$，$y'(0) = ${n}Y + ${w}c_2 = ${n * Y} + ${w}c_2 = 0$，所以 $c_2 = ${c2.toLatex()}$。`,
              ),
            ),
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
          "A sine mode already vanishes at both ends, so substituting it reduces the boundary value problem to finding a single amplitude. For $-y'' = F_m \\sin(mx)$ on $[0, \\pi]$ with $y(0) = 0$ and $y(\\pi) = 0$, substituting $y(x) = Y_m \\sin(mx)$ yields $m^2 Y_m = F_m$, so $Y_m = \\frac{F_m}{m^2}$.",
          "正弦模式在两端本来就为零，所以代入后边值问题就简化为求一个振幅。对于定义在 $[0, \\pi]$ 上的边值问题 $-y'' = F_m \\sin(mx)$（边界条件 $y(0) = 0$，$y(\\pi) = 0$），代入 $y(x) = Y_m \\sin(mx)$ 得 $m^2 Y_m = F_m$，因此响应振幅为 $Y_m = \\frac{F_m}{m^2}$。",
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
              `Equate with the forcing term: $${mSq} Y_{${m}} = ${Fm}$.`,
              `Dividing gives $Y_{${m}} = \\frac{${Fm}}{${mSq}} = ${ans}$. Notice that the boundary conditions $y(0) = 0$ and $y(\\pi) = 0$ are automatically satisfied.`,
            ),
            steps(
              `将试探解 $y(x) = Y_{${m}} \\sin(${m}x)$ 代入方程：$-y''(x) = -(-${m}^2 Y_{${m}} \\sin(${m}x)) = ${mSq} Y_{${m}} \\sin(${m}x)$。`,
              `与右端激励项对比系数：$${mSq} Y_{${m}} = ${Fm}$。`,
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
      {
        id: "values-of-a-two-mode-solution",
        title: t("Values of a two-mode solution", "双模式解的取值"),
        explanation: t(
          "When the source of $-y'' = f(x)$ on $[0, \\pi]$ with $y(0) = y(\\pi) = 0$ is a sum of sine modes, each mode is solved on its own: $-y'' = F_m\\sin mx$ has $y = \\frac{F_m}{m^{2}}\\sin mx$, and the solution is the sum\n\n$$y(x) = \\sum \\frac{F_m}{m^{2}}\\sin mx.$$\n\nTo evaluate it at the midpoint use $\\sin\\frac{m\\pi}{2} = 1, 0, -1, 0, \\dots$ for $m = 1, 2, 3, 4, \\dots$. For $f = 9\\sin x + 18\\sin 3x$: $y = 9\\sin x + 2\\sin 3x$ and $y\\left(\\frac{\\pi}{2}\\right) = 9 - 2 = 7$.",
          "当 $[0, \\pi]$ 上 $-y'' = f(x)$（$y(0) = y(\\pi) = 0$）的源项是若干正弦模式之和时，每个模式分别求解：$-y'' = F_m\\sin mx$ 的解为 $y = \\frac{F_m}{m^{2}}\\sin mx$，总解为它们的和\n\n$$y(x) = \\sum \\frac{F_m}{m^{2}}\\sin mx.$$\n\n在中点求值时，对 $m = 1, 2, 3, 4, \\dots$ 用 $\\sin\\frac{m\\pi}{2} = 1, 0, -1, 0, \\dots$。例如 $f = 9\\sin x + 18\\sin 3x$：$y = 9\\sin x + 2\\sin 3x$，$y\\left(\\frac{\\pi}{2}\\right) = 9 - 2 = 7$。",
        ),
        generate(rng: Rng): Problem {
          const [m1, m2] = rng.pick([
            [1, 2],
            [1, 3],
            [1, 5],
            [2, 3],
            [3, 5],
            [1, 4],
          ] as const);
          const A1 = rng.nonZero(-6, 6);
          const A2 = rng.nonZero(-6, 6);
          const F1 = A1 * m1 * m1;
          const F2 = A2 * m2 * m2;
          const s = (m: number) => [0, 1, 0, -1][m % 4] ?? 0;
          const ans = A1 * s(m1) + A2 * s(m2);
          const mx = (m: number) => (m === 1 ? "x" : `${m}x`);
          const f = `${F1}\\sin ${mx(m1)} ${F2 < 0 ? "-" : "+"} ${Math.abs(F2)}\\sin ${mx(m2)}`;
          const y = `${A1}\\sin ${mx(m1)} ${A2 < 0 ? "-" : "+"} ${Math.abs(A2)}\\sin ${mx(m2)}`;
          return numberProblem({
            prompt: t(
              `Solve $-y'' = ${f}$ on $[0, \\pi]$ with $y(0) = y(\\pi) = 0$, and find $y\\left(\\frac{\\pi}{2}\\right)$.`,
              `求解 $[0, \\pi]$ 上的 $-y'' = ${f}$，$y(0) = y(\\pi) = 0$，并求 $y\\left(\\frac{\\pi}{2}\\right)$。`,
            ),
            answer: ans,
            wrong: [F1 * s(m1) + F2 * s(m2), A1 + A2, A1 * s(m1) - A2 * s(m2), -ans].filter((w) => w !== ans),
            solution: t(
              steps(
                `Each mode is divided by $m^{2}$: $y = ${y}$.`,
                `At $x = \\frac{\\pi}{2}$: $\\sin\\frac{${m1}\\pi}{2} = ${s(m1)}$ and $\\sin\\frac{${m2}\\pi}{2} = ${s(m2)}$, so $y\\left(\\frac{\\pi}{2}\\right) = ${par(A1)} \\cdot ${par(s(m1))} + ${par(A2)} \\cdot ${par(s(m2))} = ${ans}$.`,
              ),
              steps(
                `每个模式除以 $m^{2}$：$y = ${y}$。`,
                `在 $x = \\frac{\\pi}{2}$ 处：$\\sin\\frac{${m1}\\pi}{2} = ${s(m1)}$，$\\sin\\frac{${m2}\\pi}{2} = ${s(m2)}$，所以 $y\\left(\\frac{\\pi}{2}\\right) = ${par(A1)} \\cdot ${par(s(m1))} + ${par(A2)} \\cdot ${par(s(m2))} = ${ans}$。`,
              ),
            ),
          });
        },
      },
    ],
  },
];
