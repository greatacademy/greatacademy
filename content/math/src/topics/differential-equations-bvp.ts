import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import { differentialEquationsDrawings1 } from "../explanation-drawings-differential-equations-1.ts";
import { explainedChoice, numberProblem, why } from "../problems.ts";
import { walked } from "./calculus-i-differentiation.ts";

/** overPi writes a number divided by pi with one fraction bar: "-\\frac{12}{5\\pi}". */
const overPi = (v: Q): string => {
  if (v.isZero()) return "0";
  const a = v.abs();
  return `${v.sign() < 0 ? "-" : ""}\\frac{${a.n}}{${a.d === 1n ? "" : a.d}\\pi}`;
};

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

/** piTimes writes c·π for any rational c, with its sign: "-\\frac{2\\pi}{3}". */
const piTimes = (c: Q): string => (c.isZero() ? "0" : `${c.sign() < 0 ? "-" : ""}${piFrac(c.abs())}`);

/** wrap puts a written number that starts with a minus sign in parentheses, for use after an operator. */
const wrap = (s: string): string => (s.startsWith("-") ? `\\left(${s}\\right)` : s);

/** signed writes a number as a signed term: "+ 3" or "- 3". */
const signed = (n: number): string => (n < 0 ? `- ${-n}` : `+ ${n}`);

/** plus writes a number as a signed term after something else, and nothing for zero. */
const plus = (n: number): string => (n === 0 ? "" : ` ${signed(n)}`);

/** coQ writes a rational coefficient before a symbol: "" for 1 and "-" for -1. */
const coQ = (q: Q): string => (q.eq(Q.one) ? "" : q.eq(Q.one.neg()) ? "-" : q.toLatex());

/** mx writes the argument m·x of a mode: "x" or "3x". */
const mx = (m: number, v = "x"): string => (m === 1 ? v : `${m}${v}`);

/** nz2 picks an integer from 2 to max with a random sign. */
const nz2 = (rng: Rng, max: number): number => rng.int(2, max) * (rng.bool() ? 1 : -1);

/** Mistake is a wrong value with what to say about it. */
type Mistake = { readonly value: number | Q; readonly why: Text };

/** apart drops the mistakes whose value is the answer or repeats an earlier one. */
const apart = (answer: number | Q, mistakes: readonly Mistake[]): Mistake[] => {
  const q = (v: number | Q) => (typeof v === "number" ? Q.of(v) : v);
  return mistakes.filter((m, i, all) => !q(m.value).eq(q(answer)) && all.findIndex((x) => q(x.value).eq(q(m.value))) === i);
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
    intro: t(
      "Take $y'' = 0$ on $[0, 4]$ with $y(0) = 2$ and $y(4) = 10$. Integrating twice gives $y = c_1x + c_2$; the left end gives $c_2 = 2$ and the right end gives $4c_1 + 2 = 10$, so $c_1 = 2$ and $y = 2x + 2$.\n\nCheck: $y(0) = 2$, $y(4) = 8 + 2 = 10$, and a straight line has $y'' = 0$.\n\nIn this lesson we solve problems whose two conditions sit at the two ends of an interval, and see that such a problem can have one solution, none, or infinitely many.",
      "取 $[0, 4]$ 上的 $y'' = 0$，$y(0) = 2$，$y(4) = 10$。积分两次得 $y = c_1x + c_2$；左端给出 $c_2 = 2$，右端给出 $4c_1 + 2 = 10$，所以 $c_1 = 2$，$y = 2x + 2$。\n\n检验：$y(0) = 2$，$y(4) = 8 + 2 = 10$，而直线满足 $y'' = 0$。\n\n本课我们求解两个条件分别给在区间两端的问题，并看到这样的问题可能有唯一解、无解或无穷多解。",
    ),
    prerequisites: ["second-order-homogeneous-initial-value-problems"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "bvp-midpoint-solution",
        title: t("Midpoint evaluation of a linear Dirichlet BVP", "线性狄利克雷边值问题的中点值计算"),
        explanation: t(
          "A zero second derivative means the solution is a straight line, so it is fixed by the values at the two ends and its midpoint value is their average. For $y'' = 0$ on $[0, L]$ with $y(0) = a$ and $y(L) = b$, the solution is the straight line $y(x) = a + \\frac{b - a}{L} x$. At the midpoint $x = L/2$, $y(L/2) = \\frac{a + b}{2}$.\n\n> **Watch out.** The midpoint value is the average of the end values, not half their difference. For $y(0) = 4$ and $y(6) = 10$, $y(3) = \\frac{4 + 10}{2} = 7$, not $\\frac{10 - 4}{2} = 3$; the $3$ is only the rise from the left end.",
          "二阶导数为零意味着解是一条直线，所以它由两端的值确定，中点处的值是它们的平均值。对于区间 $[0, L]$ 上的边值问题 $y'' = 0$（边界条件 $y(0) = a$，$y(L) = b$），其解为直线 $y(x) = a + \\frac{b - a}{L} x$。在区间中点 $x = L/2$ 处，解的值恰为两端点值的算术平均：$y(L/2) = \\frac{a + b}{2}$。\n\n> **注意。** 中点值是两端值的平均，不是两端值之差的一半。对 $y(0) = 4$，$y(6) = 10$，$y(3) = \\frac{4 + 10}{2} = 7$，不是 $\\frac{10 - 4}{2} = 3$；$3$ 只是从左端起的增量。",
        ),
        generate(rng: Rng): Problem {
          const k1 = rng.int(2, 35);
          let k2 = rng.int(2, 35);
          if (k2 === k1) k2 = k1 + 3;
          const a = 2 * k1;
          const b = 2 * k2;
          const L = 2 * rng.int(1, 5);
          const mid = L / 2;
          const ans = k1 + k2;
          const slope = Q.of(b - a, L);
          return numberProblem({
            prompt: t(
              `Solve the boundary value problem $y'' = 0$ on the interval $[0, ${L}]$ subject to boundary conditions $y(0) = ${a}$ and $y(${L}) = ${b}$. Evaluate the solution at the midpoint $x = ${mid}$.`,
              `求解定义在区间 $[0, ${L}]$ 上的边值问题 $y'' = 0$，边界条件为 $y(0) = ${a}$ 与 $y(${L}) = ${b}$。计算中点 $x = ${mid}$ 处的解值。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                k2 - k1,
                `That is half the difference, the rise from $x = 0$ to the midpoint; it still has to be added to $y(0) = ${a}$.`,
                `这是两端值之差的一半，即从 $x = 0$ 到中点的增量；还要加上 $y(0) = ${a}$。`,
              ),
              why(
                a + b,
                "That adds the end values without halving them; the midpoint value is their average.",
                "这把两端值相加而没有取一半；中点值是它们的平均。",
              ),
              why(a, "That is the value at the left end, not at the midpoint.", "这是左端的值，不是中点的值。"),
            ]),
            solution: walked(
              [
                [
                  ["Integrate twice", "积分两次"],
                  t("A zero second derivative leaves a straight line:", "二阶导数为零，解是一条直线："),
                  ["y(x) = c_1x + c_2"],
                ],
                [
                  ["Use the two boundary values", "使用两个边界值"],
                  t("", ""),
                  [`y(0) = c_2 = ${a}`, `y(${L}) = ${L}c_1 + ${a} = ${b} \\implies c_1 = \\frac{${b} - ${a}}{${L}} = ${slope.toLatex()}`],
                ],
                [
                  ["Evaluate at the midpoint", "在中点求值"],
                  t("", ""),
                  [`y(${mid}) = ${a} + ${par(slope)} \\cdot ${mid} = ${a} ${signed(k2 - k1)} = ${ans}`],
                ],
              ],
              t(
                `$${ans}$ lies halfway between the end values: $${ans} - ${a} = ${b} - ${ans} = ${k2 - k1}$.`,
                `$${ans}$ 正好位于两端值的中间：$${ans} - ${a} = ${b} - ${ans} = ${k2 - k1}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "counting-solutions-of-oscillatory-bvps",
        title: t("Counting solutions of oscillatory BVPs", "振动型边值问题解的个数"),
        explanation: t(
          "Unlike an initial value problem, a boundary value problem can have one solution, none, or infinitely many. For $y'' + k^{2}y = 0$ the general solution is $y = c_1\\cos kx + c_2\\sin kx$, and $y(0) = a$ gives $c_1 = a$. The second condition $y(x_1) = b$ reads $a\\cos kx_1 + c_2\\sin kx_1 = b$:\n\n- if $\\sin kx_1 \\ne 0$, it fixes $c_2$: exactly one solution;\n- if $\\sin kx_1 = 0$, $c_2$ drops out, and the condition is either automatically true (infinitely many solutions) or impossible (none).\n\n> **Watch out.** When $\\sin kx_1 = 0$ the answer depends on $b$, so look at the numbers before deciding. For $y'' + y = 0$ and $y(0) = 2$: with $y(\\pi) = -2$ every $c_2$ works (infinitely many), but with $y(\\pi) = 3$ none does, since every solution has $y(\\pi) = -2$.",
          "与初值问题不同，边值问题可能有唯一解、无解或无穷多解。$y'' + k^{2}y = 0$ 的通解为 $y = c_1\\cos kx + c_2\\sin kx$，由 $y(0) = a$ 得 $c_1 = a$。第二个条件 $y(x_1) = b$ 成为 $a\\cos kx_1 + c_2\\sin kx_1 = b$：\n\n- 若 $\\sin kx_1 \\ne 0$，它确定 $c_2$：恰有一个解；\n- 若 $\\sin kx_1 = 0$，$c_2$ 消失，条件要么自动成立（无穷多解），要么不可能成立（无解）。\n\n> **注意。** 当 $\\sin kx_1 = 0$ 时，结论取决于 $b$，要看具体数值再下结论。对 $y'' + y = 0$，$y(0) = 2$：若 $y(\\pi) = -2$，任意 $c_2$ 都满足（无穷多解）；若 $y(\\pi) = 3$，没有 $c_2$ 满足，因为每个解都有 $y(\\pi) = -2$。",
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
          const kx = mx(k);
          const at = piFrac(x1);
          const sinv = kind === "one" ? (j % 2 === 1 ? 1 : -1) : 0;
          const cosv = kind === "one" ? 0 : j % 2 === 0 ? 1 : -1;
          const c2 = sinv * b;
          const one = t("Exactly one", "恰有一个");
          const none = t("None", "没有");
          const many = t("Infinitely many", "无穷多个");
          const fixes = t(
            `At $x = ${at}$ the sine is $${sinv}$, not $0$, so the second condition can be solved for $c_2$.`,
            `在 $x = ${at}$ 处正弦为 $${sinv}$，不为 $0$，所以第二个条件可以解出 $c_2$。`,
          );
          const pinned = t(
            `The second condition gives the single value $c_2 = ${c2}$, so only one choice of $c_2$ works, not every one.`,
            `第二个条件只给出一个值 $c_2 = ${c2}$，所以只有一个 $c_2$ 可行，而不是每个都行。`,
          );
          const dropsOut = t(
            `At $x = ${at}$ the sine is $0$, so $c_2$ drops out of the second condition and cannot be chosen to satisfy it.`,
            `在 $x = ${at}$ 处正弦为 $0$，$c_2$ 从第二个条件中消失，无法通过选取它来满足条件。`,
          );
          const holds = t(
            `The condition reads $${atEnd} = ${b}$, which is true, so every $c_2$ satisfies it.`,
            `条件成为 $${atEnd} = ${b}$，它成立，所以每个 $c_2$ 都满足。`,
          );
          const fails = t(
            `The condition reads $${atEnd} = ${b}$, which is false whatever $c_2$ is.`,
            `条件成为 $${atEnd} = ${b}$，无论 $c_2$ 取什么都不成立。`,
          );
          const [correct, wrong] =
            kind === "one"
              ? [
                  one,
                  [
                    { option: none, why: fixes },
                    { option: many, why: pinned },
                  ],
                ]
              : kind === "many"
                ? [
                    many,
                    [
                      { option: one, why: dropsOut },
                      { option: none, why: holds },
                    ],
                  ]
                : [
                    none,
                    [
                      { option: one, why: dropsOut },
                      { option: many, why: fails },
                    ],
                  ];
          const verdict =
            kind === "one"
              ? t(`So $c_2 = ${c2}$, exactly one value.`, `所以 $c_2 = ${c2}$，只有一个值。`)
              : kind === "many"
                ? t(`It reads $${atEnd} = ${b}$, true for every $c_2$.`, `它成为 $${atEnd} = ${b}$，对每个 $c_2$ 都成立。`)
                : t(`It reads $${atEnd} = ${b}$, which is false.`, `它成为 $${atEnd} = ${b}$，不成立。`);
          const condition =
            kind === "one" ? `${a} \\cdot 0 ${sinv < 0 ? "-" : "+"} c_2 = ${b}` : `${a} \\cdot ${par(cosv)} + c_2 \\cdot 0 = ${b}`;
          return explainedChoice(rng, {
            prompt: t(
              `How many solutions does the boundary value problem $${eq}$, $y(0) = ${a}$, $y\\left(${at}\\right) = ${b}$ have?`,
              `边值问题 $${eq}$，$y(0) = ${a}$，$y\\left(${at}\\right) = ${b}$ 有多少个解？`,
            ),
            correct,
            wrong,
            solution: walked(
              [
                [["Use the left end", "使用左端条件"], t("", ""), [`y = c_1\\cos ${kx} + c_2\\sin ${kx}`, `y(0) = c_1 = ${a}`]],
                [
                  ["Write the right-end condition", "写出右端条件"],
                  t(
                    `At $x = ${at}$, $\\cos ${kx} = ${cosv}$ and $\\sin ${kx} = ${sinv}$:`,
                    `在 $x = ${at}$ 处，$\\cos ${kx} = ${cosv}$，$\\sin ${kx} = ${sinv}$：`,
                  ),
                  [condition],
                ],
                [["Count the values of the constant", "数出常数的取值"], verdict],
              ],
              kind === "one"
                ? t(
                    `$y = ${a}\\cos ${kx} ${c2 === 0 ? "" : `${c2 < 0 ? "-" : "+"} ${Math.abs(c2) === 1 ? "" : Math.abs(c2)}\\sin ${kx}`}$ has $y(0) = ${a}$ and $y\\left(${at}\\right) = ${b}$, and no other choice of $c_2$ does.`,
                    `$y = ${a}\\cos ${kx} ${c2 === 0 ? "" : `${c2 < 0 ? "-" : "+"} ${Math.abs(c2) === 1 ? "" : Math.abs(c2)}\\sin ${kx}`}$ 满足 $y(0) = ${a}$ 与 $y\\left(${at}\\right) = ${b}$，其他 $c_2$ 都不满足。`,
                  )
                : kind === "many"
                  ? t(
                      `Both $${a}\\cos ${kx}$ and $${a}\\cos ${kx} + \\sin ${kx}$ take the values $${a}$ at $0$ and $${b}$ at $${at}$.`,
                      `$${a}\\cos ${kx}$ 与 $${a}\\cos ${kx} + \\sin ${kx}$ 在 $0$ 处都取 $${a}$，在 $${at}$ 处都取 $${b}$。`,
                    )
                  : t(
                      `Every candidate $${a}\\cos ${kx} + c_2\\sin ${kx}$ takes the value $${atEnd}$ at $x = ${at}$, never $${b}$.`,
                      `每个候选解 $${a}\\cos ${kx} + c_2\\sin ${kx}$ 在 $x = ${at}$ 处都取 $${atEnd}$，永远不是 $${b}$。`,
                    ),
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
    intro: t(
      "Take $y'' + 4y = 0$ with $y(0) = 3$ and $y\\left(\\frac{\\pi}{4}\\right) = 5$. In $y = c_1\\cos 2x + c_2\\sin 2x$, the left end gives $c_1 = 3$, and at $x = \\frac{\\pi}{4}$ the cosine is $0$ and the sine is $1$, so $c_2 = 5$: $y = 3\\cos 2x + 5\\sin 2x$.\n\nCheck: $y'' = -12\\cos 2x - 20\\sin 2x = -4y$, $y(0) = 3$ and $y\\left(\\frac{\\pi}{4}\\right) = 3 \\cdot 0 + 5 \\cdot 1 = 5$.\n\nIn this lesson we solve homogeneous second-order problems whose conditions give values or slopes at the two ends.",
      "取 $y'' + 4y = 0$，$y(0) = 3$，$y\\left(\\frac{\\pi}{4}\\right) = 5$。在 $y = c_1\\cos 2x + c_2\\sin 2x$ 中，左端给出 $c_1 = 3$；在 $x = \\frac{\\pi}{4}$ 处余弦为 $0$、正弦为 $1$，所以 $c_2 = 5$：$y = 3\\cos 2x + 5\\sin 2x$。\n\n检验：$y'' = -12\\cos 2x - 20\\sin 2x = -4y$，$y(0) = 3$，$y\\left(\\frac{\\pi}{4}\\right) = 3 \\cdot 0 + 5 \\cdot 1 = 5$。\n\n本课我们求解两端给定函数值或斜率的二阶齐次问题。",
    ),
    prerequisites: ["introduction-to-boundary-value-problems"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "dirichlet-neumann-mixed-bvp",
        title: t("Solving a Dirichlet-Neumann mixed BVP", "求解狄利克雷-诺依曼混合边值问题"),
        explanation: t(
          "One boundary condition fixes a value and the other fixes a slope, and together they determine the two constants of the straight line solution. For $y'' = 0$ on $[0, L]$ with $y(0) = 0$ and $y'(L) = k$, integrating gives $y(x) = c_1 x + c_2$. The derivative is $y'(x) = c_1 = k$, and $y(0) = 0 \\implies c_2 = 0$. Thus $y(x) = k x$, so $y(m) = k m$.\n\n> **Watch out.** $y'(L) = k$ gives the slope, not the value at $L$. For $y(0) = 0$ and $y'(4) = 3$, the solution is $y = 3x$, so $y(4) = 12$, not $3$.",
          "一个边界条件固定函数值，另一个固定斜率，二者共同确定直线解中的两个常数。对于 $[0, L]$ 上的 $y'' = 0$（边界条件 $y(0) = 0$，$y'(L) = k$），积分得 $y(x) = c_1 x + c_2$。导数为 $y'(x) = c_1 = k$，初值 $y(0) = 0$ 给出 $c_2 = 0$。因此 $y(x) = k x$，从而 $y(m) = k m$。\n\n> **注意。** $y'(L) = k$ 给出的是斜率，不是 $L$ 处的函数值。对 $y(0) = 0$，$y'(4) = 3$，解为 $y = 3x$，所以 $y(4) = 12$，不是 $3$。",
        ),
        generate(rng: Rng): Problem {
          const k = rng.int(2, 10);
          const m = rng.int(2, 20);
          const L = m + rng.int(2, 5);
          const ans = k * m;
          return numberProblem({
            prompt: t(
              `Solve the mixed boundary value problem $y'' = 0$ on $[0, ${L}]$ with $y(0) = 0$ and $y'(${L}) = ${k}$. Evaluate $y(${m})$.`,
              `求解区间 $[0, ${L}]$ 上的混合边值问题 $y'' = 0$，满足边界条件 $y(0) = 0$ 与 $y'(${L}) = ${k}$。求 $y(${m})$ 的值。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                k,
                `That is the slope $y'$, which is the same everywhere; the value at $x = ${m}$ is the slope times ${m}.`,
                `这是斜率 $y'$，它处处相同；$x = ${m}$ 处的值是斜率乘以 ${m}。`,
              ),
              why(
                k * L,
                `That is $y(${L})$, the value at the right end, not at $x = ${m}$.`,
                `这是右端的值 $y(${L})$，不是 $x = ${m}$ 处的值。`,
              ),
              why(
                k + m,
                "That adds the slope to the point; along a line through the origin the value is the slope times $x$.",
                "这把斜率与自变量相加；过原点的直线上，函数值是斜率乘以 $x$。",
              ),
            ]),
            solution: walked(
              [
                [["Integrate twice", "积分两次"], t("", ""), ["y(x) = c_1x + c_2, \\qquad y'(x) = c_1"]],
                [["Use the slope and the value", "使用斜率条件和函数值条件"], t("", ""), [`y'(${L}) = c_1 = ${k}`, "y(0) = c_2 = 0"]],
                [["Evaluate", "求值"], t("", ""), [`y(x) = ${k}x, \\qquad y(${m}) = ${k} \\cdot ${m} = ${ans}`]],
              ],
              t(
                `$y = ${k}x$ has $y'' = 0$, $y(0) = 0$ and slope $${k}$ everywhere, in particular at $x = ${L}$.`,
                `$y = ${k}x$ 满足 $y'' = 0$，$y(0) = 0$，且斜率处处为 $${k}$，在 $x = ${L}$ 处也是。`,
              ),
            ),
          });
        },
      },
      {
        id: "oscillatory-dirichlet-problems",
        title: t("Oscillatory Dirichlet problems", "振动型狄利克雷问题"),
        explanation: t(
          "For $y'' + k^{2}y = 0$ with values given at $x = 0$ and at a quarter period $x = \\frac{\\pi}{2k}$, each condition picks out one constant of $y = c_1\\cos kx + c_2\\sin kx$: at $x = 0$ the sine vanishes, and at $x = \\frac{\\pi}{2k}$ the cosine does. So $y(0) = a$ and $y\\left(\\frac{\\pi}{2k}\\right) = b$ give\n\n$$y(x) = a\\cos kx + b\\sin kx,$$\n\nfrom which any value or slope follows, such as $y'(0) = kb$ and $y\\left(\\frac{\\pi}{k}\\right) = -a$.\n\n> **Watch out.** Differentiating brings out the factor $k$. For $y = 3\\cos 2x + 5\\sin 2x$, $y'(0) = 2 \\cdot 5 = 10$, not $5$.",
          "对于 $y'' + k^{2}y = 0$，若在 $x = 0$ 和四分之一周期 $x = \\frac{\\pi}{2k}$ 处给定函数值，每个条件各确定 $y = c_1\\cos kx + c_2\\sin kx$ 中的一个常数：在 $x = 0$ 处正弦为零，在 $x = \\frac{\\pi}{2k}$ 处余弦为零。所以 $y(0) = a$，$y\\left(\\frac{\\pi}{2k}\\right) = b$ 给出\n\n$$y(x) = a\\cos kx + b\\sin kx,$$\n\n由此可得任意函数值或斜率，例如 $y'(0) = kb$，$y\\left(\\frac{\\pi}{k}\\right) = -a$。\n\n> **注意。** 求导会带出因子 $k$。对 $y = 3\\cos 2x + 5\\sin 2x$，$y'(0) = 2 \\cdot 5 = 10$，不是 $5$。",
        ),
        generate(rng: Rng): Problem {
          const k = rng.int(2, 5);
          const a = nz2(rng, 9);
          const b = nz2(rng, 9);
          const ask = rng.pick(["slope", "half", "slope-end"] as const);
          const eq = `y'' + ${k * k}y = 0`;
          const kx = mx(k);
          const quarter = piFrac(Q.of(1, 2 * k));
          const half = piFrac(Q.of(1, k));
          const y = `${a}\\cos ${kx} ${b < 0 ? "-" : "+"} ${Math.abs(b)}\\sin ${kx}`;
          const dy = `${-k * a}\\sin ${kx} ${k * b < 0 ? "-" : "+"} ${Math.abs(k * b)}\\cos ${kx}`;
          const [target, ans, work, mistakes] =
            ask === "slope"
              ? ([
                  "y'(0)",
                  k * b,
                  [`y'(x) = ${dy}`, `y'(0) = ${-k * a} \\cdot 0 + ${par(k * b)} \\cdot 1 = ${k * b}`],
                  [
                    why(
                      b,
                      `That leaves out the factor $${k}$ that differentiating $\\sin ${kx}$ brings.`,
                      `这漏掉了对 $\\sin ${kx}$ 求导带出的因子 $${k}$。`,
                    ),
                    why(
                      k * a,
                      "That uses the cosine constant; at $x = 0$ the derivative of the cosine term is $0$.",
                      "这用了余弦项的常数；在 $x = 0$ 处余弦项的导数为 $0$。",
                    ),
                  ],
                ] as const)
              : ask === "half"
                ? ([
                    `y\\left(${half}\\right)`,
                    -a,
                    [
                      `y\\left(${half}\\right) = ${a}\\cos \\pi ${b < 0 ? "-" : "+"} ${Math.abs(b)}\\sin \\pi = ${a} \\cdot (-1) + 0 = ${-a}`,
                    ],
                    [
                      why(
                        a,
                        "That takes $\\cos \\pi$ as $1$; half a turn gives $\\cos \\pi = -1$.",
                        "这把 $\\cos \\pi$ 当成了 $1$；转半圈后 $\\cos \\pi = -1$。",
                      ),
                      why(b, "That keeps the sine term, but $\\sin \\pi = 0$.", "这保留了正弦项，但 $\\sin \\pi = 0$。"),
                    ],
                  ] as const)
                : ([
                    `y'\\left(${quarter}\\right)`,
                    -k * a,
                    [`y'(x) = ${dy}`, `y'\\left(${quarter}\\right) = ${-k * a} \\cdot 1 + ${par(k * b)} \\cdot 0 = ${-k * a}`],
                    [
                      why(
                        k * a,
                        `That has the wrong sign: the derivative of $\\cos ${kx}$ is $-${k}\\sin ${kx}$.`,
                        `符号错了：$\\cos ${kx}$ 的导数是 $-${k}\\sin ${kx}$。`,
                      ),
                      why(
                        -a,
                        `That leaves out the factor $${k}$ that differentiating $\\cos ${kx}$ brings.`,
                        `这漏掉了对 $\\cos ${kx}$ 求导带出的因子 $${k}$。`,
                      ),
                      why(
                        k * b,
                        `That keeps the cosine term of $y'$, but $\\cos ${kx} = 0$ at $x = ${quarter}$.`,
                        `这保留了 $y'$ 中的余弦项，但在 $x = ${quarter}$ 处 $\\cos ${kx} = 0$。`,
                      ),
                    ],
                  ] as const);
          return numberProblem({
            prompt: t(
              `Solve $${eq}$ with $y(0) = ${a}$ and $y\\left(${quarter}\\right) = ${b}$, and find $${target}$.`,
              `求解 $${eq}$，$y(0) = ${a}$，$y\\left(${quarter}\\right) = ${b}$，并求 $${target}$。`,
            ),
            answer: ans,
            mistakes: apart(ans, mistakes),
            solution: walked(
              [
                [
                  ["Fix the constants", "确定常数"],
                  t(
                    `In $y = c_1\\cos ${kx} + c_2\\sin ${kx}$, the sine vanishes at $0$ and the cosine at $${quarter}$:`,
                    `在 $y = c_1\\cos ${kx} + c_2\\sin ${kx}$ 中，正弦在 $0$ 处为零，余弦在 $${quarter}$ 处为零：`,
                  ),
                  [`y(0) = c_1 = ${a}, \\qquad y\\left(${quarter}\\right) = c_2 = ${b}`, `y = ${y}`],
                ],
                [["Evaluate", "求值"], t("", ""), [...work]],
              ],
              t(
                `$y'' = ${-k * k * a}\\cos ${kx} ${-k * k * b < 0 ? "-" : "+"} ${Math.abs(k * k * b)}\\sin ${kx} = -${k * k}y$, so $y$ solves the equation, and it takes the values $${a}$ and $${b}$ at the two ends.`,
                `$y'' = ${-k * k * a}\\cos ${kx} ${-k * k * b < 0 ? "-" : "+"} ${Math.abs(k * k * b)}\\sin ${kx} = -${k * k}y$，所以 $y$ 满足方程，且在两端分别取 $${a}$ 与 $${b}$。`,
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
    intro: t(
      "Take $y'' = -2$ on $[0, 4]$ with $y(0) = 0$ and $y(4) = 0$. Integrating twice gives $y = -x^{2} + c_1x + c_2$; the left end gives $c_2 = 0$ and the right end gives $-16 + 4c_1 = 0$, so $c_1 = 4$ and $y = x(4 - x)$, with $y(2) = 4$.\n\nCheck: $y'' = -2$, and $y = x(4 - x)$ is $0$ at both ends.\n\nIn this lesson we solve second-order problems with a load on the right-hand side, keeping both constants until both ends are used.",
      "取 $[0, 4]$ 上的 $y'' = -2$，$y(0) = 0$，$y(4) = 0$。积分两次得 $y = -x^{2} + c_1x + c_2$；左端给出 $c_2 = 0$，右端给出 $-16 + 4c_1 = 0$，所以 $c_1 = 4$，$y = x(4 - x)$，$y(2) = 4$。\n\n检验：$y'' = -2$，且 $y = x(4 - x)$ 在两端都为 $0$。\n\n本课我们求解右端带载荷的二阶问题，在用完两端条件之前保留两个常数。",
    ),
    prerequisites: ["second-order-homogeneous-boundary-value-problems"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "inhomogeneous-bvp-solution",
        figure: differentialEquationsDrawings1["second-order-inhomogeneous-boundary-value-problems#inhomogeneous-bvp-solution"],
        title: t("Maximum deflection under uniform load", "均布载荷下的最大挠度"),
        explanation: t(
          "Integrating the constant load twice gives a parabola, and the two boundary conditions pin it down so that its maximum lies at the center. For $y'' = -q$ with $y(0) = 0$ and $y(L) = 0$, integration yields $y(x) = \\frac{q}{2} x (L - x)$. The maximum occurs at the midpoint $x = L/2$, where $y(L/2) = \\frac{q L^2}{8}$.\n\n> **Watch out.** Integrating $-q$ twice gives $-\\frac{q}{2}x^{2}$, not $-qx^{2}$. For $q = 4$ on $[0, 4]$, $y = 2x(4 - x)$ and $y(2) = 8$, not $16$.",
          "把常数载荷积分两次得到一条抛物线，两个边界条件把它确定下来，使其最大值位于中点。对于方程 $y'' = -q$（满足 $y(0) = 0$，$y(L) = 0$），积分得到抛物线型解 $y(x) = \\frac{q}{2} x (L - x)$。最大值出现在中点 $x = L/2$，此时 $y(L/2) = \\frac{q L^2}{8}$。\n\n> **注意。** $-q$ 积分两次得 $-\\frac{q}{2}x^{2}$，不是 $-qx^{2}$。对 $[0, 4]$ 上 $q = 4$，$y = 2x(4 - x)$，$y(2) = 8$，不是 $16$。",
        ),
        generate(rng: Rng): Problem {
          const k = rng.int(1, 4);
          const q = rng.int(2, 20);
          const L = 4 * k;
          const h = 2 * k;
          const ans = 2 * q * k * k;
          const c1 = q * h;
          const half = Q.of(q, 2);
          return numberProblem({
            prompt: t(
              `A uniform beam under constant distributed load satisfies $y'' = -${q}$ on $[0, ${L}]$ with pinned ends $y(0) = 0$ and $y(${L}) = 0$. Find the maximum deflection $y_{\\max} = y(${h})$.`,
              `一根均布受荷简支梁满足方程 $y'' = -${q}$（定义在 $[0, ${L}]$ 上，两端支撑 $y(0) = 0$ 与 $y(${L}) = 0$）。求跨中最大挠度 $y_{\\max} = y(${h})$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                2 * ans,
                `That integrates $-${q}$ twice to $-${q}x^{2}$; the second integration halves it to $-${half.toLatex()}x^{2}$.`,
                `这把 $-${q}$ 积分两次写成 $-${q}x^{2}$；第二次积分会除以 $2$，得到 $-${half.toLatex()}x^{2}$。`,
              ),
              why(c1, "That is $c_1$, the slope at the left end, not the deflection.", "这是 $c_1$，即左端的斜率，不是挠度。"),
              why(
                -ans,
                "That has the wrong sign: $y'' < 0$ makes the curve bend down from the ends, so it lies above the axis between them.",
                "符号错了：$y'' < 0$ 使曲线从两端向下弯，所以两端之间的曲线位于轴的上方。",
              ),
            ]),
            solution: walked(
              [
                [["Integrate twice", "积分两次"], t("", ""), [`y(x) = -${half.toLatex()}x^{2} + c_1x + c_2`]],
                [
                  ["Use both ends", "使用两端条件"],
                  t("", ""),
                  ["y(0) = c_2 = 0", `y(${L}) = -${half.toLatex()} \\cdot ${L * L} + ${L}c_1 = 0 \\implies c_1 = ${c1}`],
                ],
                [
                  ["Evaluate at the midpoint", "在中点求值"],
                  t("", ""),
                  [`y(x) = ${half.toLatex()}x(${L} - x), \\qquad y(${h}) = ${half.toLatex()} \\cdot ${h} \\cdot ${h} = ${ans}`],
                ],
              ],
              t(
                `The formula $\\frac{qL^{2}}{8}$ gives $\\frac{${q} \\cdot ${L * L}}{8} = ${ans}$, and the parabola $${half.toLatex()}x(${L} - x)$ is symmetric about $x = ${h}$, so its peak is there.`,
                `公式 $\\frac{qL^{2}}{8}$ 给出 $\\frac{${q} \\cdot ${L * L}}{8} = ${ans}$，而抛物线 $${half.toLatex()}x(${L} - x)$ 关于 $x = ${h}$ 对称，所以最高点就在那里。`,
              ),
            ),
          });
        },
      },
      {
        id: "a-load-that-varies-along-the-interval",
        title: t("A load that varies along the interval", "沿区间变化的载荷"),
        explanation: t(
          "When the right-hand side depends on $x$, integrate twice and keep both constants, then use the two boundary values. For $y'' = 6x$:\n\n$$y' = 3x^{2} + c_1, \\qquad y = x^{3} + c_1x + c_2.$$\n\nWith $y(0) = A$ and $y(L) = B$: $c_2 = A$ and $L^{3} + c_1L + A = B$, so $c_1 = \\frac{B - A - L^{3}}{L}$. On $[0, 2]$ with $y(0) = 0$ and $y(2) = 0$: $c_1 = -4$, so $y = x^{3} - 4x$ and $y(1) = -3$.\n\n> **Watch out.** The slope $c_1$ is not $\\frac{B - A}{L}$ as it would be for $y'' = 0$: the $x^{3}$ part already rises by $L^{3}$. In the example above $\\frac{B - A}{L} = 0$, but $c_1 = -4$.",
          "当右端依赖于 $x$ 时，积分两次并保留两个常数，再用两个边界值确定它们。对 $y'' = 6x$：\n\n$$y' = 3x^{2} + c_1, \\qquad y = x^{3} + c_1x + c_2.$$\n\n由 $y(0) = A$，$y(L) = B$：$c_2 = A$，$L^{3} + c_1L + A = B$，所以 $c_1 = \\frac{B - A - L^{3}}{L}$。例如在 $[0, 2]$ 上 $y(0) = 0$，$y(2) = 0$：$c_1 = -4$，$y = x^{3} - 4x$，$y(1) = -3$。\n\n> **注意。** $c_1$ 不是 $y'' = 0$ 时的 $\\frac{B - A}{L}$：$x^{3}$ 部分本身已经升高了 $L^{3}$。上例中 $\\frac{B - A}{L} = 0$，但 $c_1 = -4$。",
        ),
        generate(rng: Rng): Problem {
          const L = rng.int(2, 6);
          const A = rng.int(-10, 10);
          const B = rng.int(-10, 10);
          const x0 = rng.int(1, L - 1);
          const c1 = Q.of(B - A - L ** 3, L);
          const ans = Q.of(x0 ** 3 + A).add(c1.mul(Q.of(x0)));
          const tailA = plus(A);
          return numberProblem({
            prompt: t(
              `Solve $y'' = 6x$ on $[0, ${L}]$ with $y(0) = ${A}$ and $y(${L}) = ${B}$, and find $y(${x0})$.`,
              `求解 $[0, ${L}]$ 上的 $y'' = 6x$，$y(0) = ${A}$，$y(${L}) = ${B}$，并求 $y(${x0})$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                Q.of(A).add(Q.of((B - A) * x0, L)),
                "That is the straight line through the end values, the solution of $y'' = 0$; the load adds the $x^{3}$ part.",
                "这是过两端值的直线，即 $y'' = 0$ 的解；载荷还带来 $x^{3}$ 部分。",
              ),
              why(
                Q.of(x0 ** 3 + A),
                "That drops the $c_1x$ term; $c_1$ is needed to reach the right-end value.",
                "这丢掉了 $c_1x$ 项；需要 $c_1$ 才能达到右端的值。",
              ),
              why(
                Q.of(x0 ** 3 + A).add(Q.of(B - A, L).mul(Q.of(x0))),
                `That takes $c_1 = \\frac{B - A}{L}$; the $x^{3}$ part already rises by $${L ** 3}$ across the interval, which must be taken off.`,
                `这取了 $c_1 = \\frac{B - A}{L}$；$x^{3}$ 部分在区间上已经升高了 $${L ** 3}$，必须减去。`,
              ),
            ]),
            solution: walked(
              [
                [["Integrate twice", "积分两次"], t("", ""), ["y' = 3x^{2} + c_1, \\qquad y = x^{3} + c_1x + c_2"]],
                [
                  ["Use both ends", "使用两端条件"],
                  t("", ""),
                  [`y(0) = c_2 = ${A}`, `y(${L}) = ${L ** 3} + ${L}c_1${tailA} = ${B} \\implies c_1 = ${c1.toLatex()}`],
                ],
                [["Evaluate", "求值"], t("", ""), [`y(${x0}) = ${x0 ** 3} + ${par(c1)} \\cdot ${x0}${tailA} = ${ans.toLatex()}`]],
              ],
              t(
                `At the right end, $${L ** 3} + ${par(c1)} \\cdot ${L}${tailA} = ${L ** 3}${plus(B - A - L ** 3)}${tailA} = ${B}$, and differentiating $x^{3} + c_1x + c_2$ twice gives $6x$.`,
                `在右端，$${L ** 3} + ${par(c1)} \\cdot ${L}${tailA} = ${L ** 3}${plus(B - A - L ** 3)}${tailA} = ${B}$；而 $x^{3} + c_1x + c_2$ 求两次导得 $6x$。`,
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
    intro: t(
      "Take $y'' + \\lambda y = 0$ with $y(0) = 0$ and $y(\\pi) = 0$, and try $\\lambda = 9$. The solutions are $c_1\\cos 3x + c_2\\sin 3x$; the left end gives $c_1 = 0$, and $\\sin 3\\pi = 0$, so the right end holds for every $c_2$: $y = \\sin 3x$ is a nonzero solution and $9$ is an eigenvalue.\n\nCheck: $(\\sin 3x)'' = -9\\sin 3x$, so $y'' + 9y = 0$, and $\\sin 0 = \\sin 3\\pi = 0$.\n\nIn this lesson we find the values of $\\lambda$ for which a homogeneous boundary value problem has a nonzero solution.",
      "取 $y'' + \\lambda y = 0$，$y(0) = 0$，$y(\\pi) = 0$，试 $\\lambda = 9$。解为 $c_1\\cos 3x + c_2\\sin 3x$；左端给出 $c_1 = 0$，而 $\\sin 3\\pi = 0$，所以右端条件对每个 $c_2$ 都成立：$y = \\sin 3x$ 是非零解，$9$ 是特征值。\n\n检验：$(\\sin 3x)'' = -9\\sin 3x$，所以 $y'' + 9y = 0$，且 $\\sin 0 = \\sin 3\\pi = 0$。\n\n本课我们求使齐次边值问题有非零解的 $\\lambda$ 值。",
    ),
    prerequisites: ["second-order-inhomogeneous-boundary-value-problems"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "dirichlet-eigenvalues",
        title: t("Finding the n-th eigenvalue for Dirichlet boundary conditions", "求狄利克雷边界条件下的第 n 个特征值"),
        explanation: t(
          "Only special values of the parameter allow a nonzero solution that vanishes at both ends, and these are the squares of whole numbers. For $y'' + \\lambda y = 0$ on $[0, \\pi]$ with $y(0) = 0$ and $y(\\pi) = 0$, nontrivial solutions are $\\phi_n(x) = \\sin(nx)$ corresponding to eigenvalues $\\lambda_n = n^2$.\n\n> **Watch out.** $\\lambda = 0$ is not an eigenvalue here: $y'' = 0$ gives a line, and a line that is $0$ at both ends is $0$ everywhere. So the list starts at $\\lambda_1 = 1$, and $\\lambda_3 = 9$, not $4$.",
          "只有参数取特殊的值时，才存在两端都为零的非零解，这些值是整数的平方。对于定义在 $[0, \\pi]$ 上的问题 $y'' + \\lambda y = 0$（边界条件 $y(0) = 0$ 与 $y(\\pi) = 0$），非平凡特征函数为 $\\phi_n(x) = \\sin(nx)$，对应的特征值为 $\\lambda_n = n^2$。\n\n> **注意。** 这里 $\\lambda = 0$ 不是特征值：$y'' = 0$ 给出直线，两端都为 $0$ 的直线处处为 $0$。所以特征值从 $\\lambda_1 = 1$ 开始，$\\lambda_3 = 9$，不是 $4$。",
        ),
        generate(rng: Rng): Problem {
          const n = rng.int(2, 35);
          const ans = n * n;
          return numberProblem({
            prompt: t(
              `Find the $n = ${n}$ eigenvalue $\\lambda_{${n}}$ of the Sturm-Liouville problem $y'' + \\lambda y = 0$ on $[0, \\pi]$ with boundary conditions $y(0) = 0$ and $y(\\pi) = 0$.`,
              `求施图姆-刘维尔问题 $y'' + \\lambda y = 0$（定义在 $[0, \\pi]$ 上，满足边界条件 $y(0) = 0$ 与 $y(\\pi) = 0$）的第 $n = ${n}$ 个特征值 $\\lambda_{${n}}$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                n,
                `That is $\\mu = \\sqrt{\\lambda}$, the frequency of $\\sin ${n}x$; the eigenvalue is its square.`,
                `这是 $\\mu = \\sqrt{\\lambda}$，即 $\\sin ${n}x$ 的频率；特征值是它的平方。`,
              ),
              why(
                (n - 1) * (n - 1),
                "That counts $\\lambda = 0$ as the first eigenvalue; it only gives the zero solution, so the list starts at $1$.",
                "这把 $\\lambda = 0$ 算作第一个特征值；它只给出零解，所以特征值从 $1$ 开始。",
              ),
              why(2 * n, `That doubles $${n}$ instead of squaring it.`, `这把 $${n}$ 乘以 $2$，而不是平方。`),
            ]),
            solution: walked(
              [
                [
                  ["Write the solutions", "写出解"],
                  t("For $\\lambda = \\mu^{2} > 0$:", "对 $\\lambda = \\mu^{2} > 0$："),
                  ["y = c_1\\cos \\mu x + c_2\\sin \\mu x"],
                ],
                [
                  ["Use both ends", "使用两端条件"],
                  t("A nonzero solution needs $c_2 \\ne 0$:", "非零解要求 $c_2 \\ne 0$："),
                  ["y(0) = c_1 = 0", "y(\\pi) = c_2\\sin \\mu\\pi = 0 \\implies \\mu = 1, 2, 3, \\dots"],
                ],
                [["Square the frequency", "把频率平方"], t("", ""), [`\\lambda_{${n}} = ${n}^{2} = ${ans}`]],
              ],
              t(
                `$y = \\sin ${n}x$ vanishes at $0$ and at $\\pi$, and $y'' = -${ans}\\sin ${n}x$, so $y'' + ${ans}y = 0$.`,
                `$y = \\sin ${n}x$ 在 $0$ 和 $\\pi$ 处都为零，且 $y'' = -${ans}\\sin ${n}x$，所以 $y'' + ${ans}y = 0$。`,
              ),
            ),
          });
        },
      },
      {
        id: "eigenvalues-with-a-free-end",
        title: t("Eigenvalues with a free end", "一端自由时的特征值"),
        explanation: t(
          "Change one boundary condition and the eigenvalues change. For $y'' + \\lambda y = 0$ with $y(0) = 0$ and $y'(L) = 0$, the first condition leaves $y = \\sin(\\sqrt{\\lambda}\\,x)$, and the second needs $\\cos(\\sqrt{\\lambda}\\,L) = 0$, so $\\sqrt{\\lambda}\\,L$ is an odd multiple of $\\frac{\\pi}{2}$:\n\n$$\\lambda_n = \\left(\\frac{(2n - 1)\\pi}{2L}\\right)^{2}, \\qquad y_n = \\sin\\frac{(2n - 1)\\pi x}{2L}.$$\n\nOn $[0, \\pi]$ these are $\\frac{1}{4}, \\frac{9}{4}, \\frac{25}{4}, \\dots$, a quarter wave, three quarter waves, and so on.\n\n> **Watch out.** A free end does not take whole half waves. On $[0, \\pi]$ with $y'(\\pi) = 0$, $\\lambda_1 = \\frac{1}{4}$, not $1$: $\\sin x$ has slope $\\cos \\pi = -1$ at $\\pi$, while $\\sin\\frac{x}{2}$ has slope $\\frac{1}{2}\\cos\\frac{\\pi}{2} = 0$.",
          "改变一个边界条件，特征值就会改变。对于 $y'' + \\lambda y = 0$，$y(0) = 0$，$y'(L) = 0$，第一个条件留下 $y = \\sin(\\sqrt{\\lambda}\\,x)$，第二个条件要求 $\\cos(\\sqrt{\\lambda}\\,L) = 0$，所以 $\\sqrt{\\lambda}\\,L$ 是 $\\frac{\\pi}{2}$ 的奇数倍：\n\n$$\\lambda_n = \\left(\\frac{(2n - 1)\\pi}{2L}\\right)^{2}, \\qquad y_n = \\sin\\frac{(2n - 1)\\pi x}{2L}.$$\n\n在 $[0, \\pi]$ 上它们是 $\\frac{1}{4}, \\frac{9}{4}, \\frac{25}{4}, \\dots$，分别对应四分之一波、四分之三波，依此类推。\n\n> **注意。** 自由端容纳的不是整数个半波。在 $[0, \\pi]$ 上、$y'(\\pi) = 0$ 时，$\\lambda_1 = \\frac{1}{4}$，不是 $1$：$\\sin x$ 在 $\\pi$ 处的斜率为 $\\cos \\pi = -1$，而 $\\sin\\frac{x}{2}$ 的斜率为 $\\frac{1}{2}\\cos\\frac{\\pi}{2} = 0$。",
        ),
        generate(rng: Rng): Problem {
          const c = rng.pick([Q.of(1), Q.of(2), Q.of(1, 2), Q.of(3), Q.of(3, 2), Q.of(1, 3)]);
          const n = rng.int(1, 6);
          const root = Q.of(2 * n - 1, 2).div(c);
          const ans = root.pow(2);
          const L = piFrac(c);
          const odd = piFrac(Q.of(2 * n - 1, 2));
          return numberProblem({
            prompt: t(
              `The eigenvalues of $y'' + \\lambda y = 0$ with $y(0) = 0$ and $y'\\left(${L}\\right) = 0$ are $\\lambda_1 < \\lambda_2 < \\cdots$. Find $\\lambda_{${n}}$.`,
              `$y'' + \\lambda y = 0$，$y(0) = 0$，$y'\\left(${L}\\right) = 0$ 的特征值为 $\\lambda_1 < \\lambda_2 < \\cdots$。求 $\\lambda_{${n}}$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                Q.of(n).div(c).pow(2),
                "That fits whole half waves, which is right for two fixed ends; a free end needs the cosine to vanish there.",
                "这放进的是整数个半波，那是两端固定的情形；自由端要求余弦在那里为零。",
              ),
              why(root, "That is $\\sqrt{\\lambda}$; the eigenvalue is its square.", "这是 $\\sqrt{\\lambda}$；特征值是它的平方。"),
              why(
                Q.of(2 * n + 1, 2)
                  .div(c)
                  .pow(2),
                `That starts counting at $n = 0$, so it is $\\lambda_{${n + 1}}$.`,
                `这从 $n = 0$ 开始数，所以得到的是 $\\lambda_{${n + 1}}$。`,
              ),
              why(
                Q.of(2 * n - 1)
                  .div(c)
                  .pow(2),
                "That drops the $2$ in $\\frac{(2n - 1)\\pi}{2}$, as if the cosine vanished at multiples of $\\pi$.",
                "这丢掉了 $\\frac{(2n - 1)\\pi}{2}$ 中的 $2$，好像余弦在 $\\pi$ 的倍数处为零。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Use the fixed end", "使用固定端"],
                  t("$y(0) = 0$ removes the cosine:", "$y(0) = 0$ 去掉余弦项："),
                  ["y = \\sin\\left(\\sqrt{\\lambda}\\,x\\right), \\qquad y' = \\sqrt{\\lambda}\\cos\\left(\\sqrt{\\lambda}\\,x\\right)"],
                ],
                [
                  ["Use the free end", "使用自由端"],
                  t(
                    "The cosine must vanish, so the angle is an odd multiple of $\\frac{\\pi}{2}$; the $n$-th one is:",
                    "余弦必须为零，所以角度是 $\\frac{\\pi}{2}$ 的奇数倍；第 $n$ 个是：",
                  ),
                  [`\\sqrt{\\lambda_{${n}}} \\cdot ${L} = ${odd} \\implies \\sqrt{\\lambda_{${n}}} = ${root.toLatex()}`],
                ],
                [["Square", "平方"], t("", ""), [`\\lambda_{${n}} = ${ans.toLatex()}`]],
              ],
              t(
                `With $\\sqrt{\\lambda} = ${root.toLatex()}$ the slope at the free end is $${root.eq(Q.one) ? "" : root.toLatex()}\\cos ${odd} = 0$, and $${odd}$ is the odd multiple of $\\frac{\\pi}{2}$ with $2n - 1 = ${2 * n - 1}$, so this is eigenvalue number $${n}$.`,
                `取 $\\sqrt{\\lambda} = ${root.toLatex()}$ 时，自由端的斜率为 $${root.eq(Q.one) ? "" : root.toLatex()}\\cos ${odd} = 0$，且 $${odd}$ 是 $2n - 1 = ${2 * n - 1}$ 时 $\\frac{\\pi}{2}$ 的奇数倍，所以这是第 $${n}$ 个特征值。`,
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
    intro: t(
      "Take $f(x) = 3 + 2\\sin x$ on $[-\\pi, \\pi]$. Then $a_0 = \\frac{1}{\\pi}\\int_{-\\pi}^{\\pi}(3 + 2\\sin x)\\,dx = \\frac{1}{\\pi}(6\\pi + 0) = 6$, and $b_1 = \\frac{1}{\\pi}\\int_{-\\pi}^{\\pi}(3 + 2\\sin x)\\sin x\\,dx = \\frac{1}{\\pi}(0 + 2\\pi) = 2$.\n\nCheck: the series $\\frac{a_0}{2} + b_1\\sin x = 3 + 2\\sin x$ gives back $f$, as it must for a function that is already a sum of modes.\n\nIn this lesson we compute Fourier coefficients from their integrals over one period.",
      "取 $[-\\pi, \\pi]$ 上的 $f(x) = 3 + 2\\sin x$。则 $a_0 = \\frac{1}{\\pi}\\int_{-\\pi}^{\\pi}(3 + 2\\sin x)\\,dx = \\frac{1}{\\pi}(6\\pi + 0) = 6$，$b_1 = \\frac{1}{\\pi}\\int_{-\\pi}^{\\pi}(3 + 2\\sin x)\\sin x\\,dx = \\frac{1}{\\pi}(0 + 2\\pi) = 2$。\n\n检验：级数 $\\frac{a_0}{2} + b_1\\sin x = 3 + 2\\sin x$ 还原出 $f$，对本身就是若干模式之和的函数理应如此。\n\n本课我们由一个周期上的积分计算傅里叶系数。",
    ),
    prerequisites: ["introduction-to-integration-by-parts"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "fourier-constant-coefficient",
        title: t("Constant term coefficient in a Fourier series", "傅里叶级数中的常数项系数"),
        explanation: t(
          "The constant coefficient of a Fourier series is related to the average value of the function over one period. For a function $f(x)$ on $[-\\pi, \\pi]$, the coefficient $a_0 = \\frac{1}{\\pi} \\int_{-\\pi}^\\pi f(x)\\,dx$. For $f(x) = C$, $a_0 = \\frac{1}{\\pi}(2\\pi C) = 2C$, and a term $D\\cos mx$ or $D\\sin mx$ adds nothing, since it integrates to $0$ over a full period.\n\n> **Watch out.** $a_0$ is twice the average; the constant term of the series is $\\frac{a_0}{2}$. For $f(x) = 5 + 3\\cos 2x$, $a_0 = 10$, not $5$, and the constant term is $5$.",
          "傅里叶级数的常数项系数与函数在一个周期上的平均值有关。对于定义在 $[-\\pi, \\pi]$ 上的函数 $f(x)$，傅里叶常数项系数定义为 $a_0 = \\frac{1}{\\pi} \\int_{-\\pi}^\\pi f(x)\\,dx$。当 $f(x) = C$ 为常数时，$a_0 = \\frac{1}{\\pi}(2\\pi C) = 2C$；而 $D\\cos mx$ 或 $D\\sin mx$ 这样的项没有贡献，因为它在整个周期上的积分为 $0$。\n\n> **注意。** $a_0$ 是平均值的两倍；级数的常数项是 $\\frac{a_0}{2}$。对 $f(x) = 5 + 3\\cos 2x$，$a_0 = 10$，不是 $5$，常数项才是 $5$。",
        ),
        generate(rng: Rng): Problem {
          const C = rng.int(2, 35);
          const D = nz2(rng, 9);
          const m = rng.int(1, 5);
          const ans = 2 * C;
          const f = `${C} ${D < 0 ? "-" : "+"} ${Math.abs(D)}\\cos ${mx(m)}`;
          return numberProblem({
            prompt: t(
              `Find the Fourier coefficient $a_0 = \\frac{1}{\\pi} \\int_{-\\pi}^\\pi f(x)\\,dx$ for $f(x) = ${f}$ on $[-\\pi, \\pi]$.`,
              `对 $[-\\pi, \\pi]$ 上的 $f(x) = ${f}$，求傅里叶系数 $a_0 = \\frac{1}{\\pi} \\int_{-\\pi}^\\pi f(x)\\,dx$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                C,
                "That is the average of $f$, the constant term $\\frac{a_0}{2}$ of the series; $a_0$ is twice it.",
                "这是 $f$ 的平均值，即级数的常数项 $\\frac{a_0}{2}$；$a_0$ 是它的两倍。",
              ),
              why(
                2 * (C + D),
                `That lets the cosine contribute; $\\cos ${mx(m)}$ runs through whole periods on $[-\\pi, \\pi]$ and integrates to $0$.`,
                `这让余弦项也有贡献；$\\cos ${mx(m)}$ 在 $[-\\pi, \\pi]$ 上走过整数个周期，积分为 $0$。`,
              ),
              why(
                C + D,
                "That is $f(0)$, the value at one point; $a_0$ comes from the integral over the whole period.",
                "这是 $f(0)$，即一点处的值；$a_0$ 来自整个周期上的积分。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Integrate term by term", "逐项积分"],
                  t("", ""),
                  [`\\int_{-\\pi}^{\\pi} ${C}\\,dx = ${2 * C}\\pi`, `\\int_{-\\pi}^{\\pi} ${D}\\cos ${mx(m)}\\,dx = 0`],
                ],
                [["Divide by π", "除以 π"], t("", ""), [`a_0 = \\frac{1}{\\pi} \\cdot ${2 * C}\\pi = ${ans}`]],
              ],
              t(
                `The constant term $\\frac{a_0}{2} = ${C}$ is the average of $f$: the cosine swings equally above and below $0$, leaving $${C}$.`,
                `常数项 $\\frac{a_0}{2} = ${C}$ 就是 $f$ 的平均值：余弦在 $0$ 上下摆动的幅度相同，平均下来剩下 $${C}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-fourier-coefficients-of-a-linear-function",
        title: t("The Fourier coefficients of a linear function", "线性函数的傅里叶系数"),
        explanation: t(
          "For $f(x) = cx$ on $[-\\pi, \\pi]$ the function is odd, so every $a_n$ is $0$ and only sines appear. Integrating by parts,\n\n$$b_n = \\frac{1}{\\pi}\\int_{-\\pi}^{\\pi} cx\\sin nx\\,dx = \\frac{2c}{\\pi}\\left[-\\frac{x\\cos nx}{n}\\right]_{0}^{\\pi} = \\frac{2c(-1)^{n+1}}{n},$$\n\nsince the remaining integral of $\\cos nx$ vanishes. So $x = 2\\left(\\sin x - \\frac{\\sin 2x}{2} + \\frac{\\sin 3x}{3} - \\cdots\\right)$: the signs alternate and the coefficients shrink like $\\frac{1}{n}$.\n\n> **Watch out.** $(-1)^{n+1}$ is $+1$ for odd $n$ and $-1$ for even $n$. For $f(x) = x$, $b_2 = \\frac{2 \\cdot (-1)}{2} = -1$, not $1$.",
          "$[-\\pi, \\pi]$ 上的 $f(x) = cx$ 是奇函数，所以所有 $a_n$ 都为 $0$，只出现正弦项。分部积分：\n\n$$b_n = \\frac{1}{\\pi}\\int_{-\\pi}^{\\pi} cx\\sin nx\\,dx = \\frac{2c}{\\pi}\\left[-\\frac{x\\cos nx}{n}\\right]_{0}^{\\pi} = \\frac{2c(-1)^{n+1}}{n},$$\n\n因为剩下的 $\\cos nx$ 的积分为零。所以 $x = 2\\left(\\sin x - \\frac{\\sin 2x}{2} + \\frac{\\sin 3x}{3} - \\cdots\\right)$：符号交替，系数按 $\\frac{1}{n}$ 减小。\n\n> **注意。** $(-1)^{n+1}$ 在 $n$ 为奇数时是 $+1$，为偶数时是 $-1$。对 $f(x) = x$，$b_2 = \\frac{2 \\cdot (-1)}{2} = -1$，不是 $1$。",
        ),
        generate(rng: Rng): Problem {
          const c = rng.nonZero(-6, 6);
          const n = rng.int(1, 8);
          const sgn = n % 2 === 1 ? 1 : -1;
          const ans = Q.of(2 * c * sgn, n);
          const f = c === 1 ? "x" : c === -1 ? "-x" : `${c}x`;
          const nx = mx(n);
          const anti = n === 1 ? "-x\\cos x + \\sin x" : `-\\frac{x\\cos ${nx}}{${n}} + \\frac{\\sin ${nx}}{${n * n}}`;
          const part = piTimes(Q.of(sgn, n));
          const lead = `${c < 0 ? "-" : ""}\\frac{${Math.abs(2 * c)}}{\\pi}`;
          return numberProblem({
            prompt: t(
              `Find the Fourier coefficient $b_{${n}} = \\frac{1}{\\pi}\\int_{-\\pi}^{\\pi} f(x)\\sin ${nx}\\,dx$ for $f(x) = ${f}$ on $[-\\pi, \\pi]$.`,
              `对 $[-\\pi, \\pi]$ 上的 $f(x) = ${f}$，求傅里叶系数 $b_{${n}} = \\frac{1}{\\pi}\\int_{-\\pi}^{\\pi} f(x)\\sin ${nx}\\,dx$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                ans.neg(),
                `That has the wrong sign: $\\cos ${n}\\pi = ${-sgn}$, so the boundary term is $${part}$.`,
                `符号错了：$\\cos ${n}\\pi = ${-sgn}$，所以边界项为 $${part}$。`,
              ),
              why(
                Q.of(c, n),
                "That integrates over $[0, \\pi]$ only; the even integrand gives the same again on $[-\\pi, 0]$.",
                "这只在 $[0, \\pi]$ 上积分；被积函数是偶函数，在 $[-\\pi, 0]$ 上还有同样多。",
              ),
              why(
                Q.zero,
                "That is true of the cosine coefficients of an odd function, not the sine ones: $x\\sin nx$ is even.",
                "这对奇函数的余弦系数成立，对正弦系数不成立：$x\\sin nx$ 是偶函数。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Use the symmetry", "利用对称性"],
                  t(
                    `$${f}\\sin ${nx}$ is even, so the integral is twice the one over $[0, \\pi]$:`,
                    `$${f}\\sin ${nx}$ 是偶函数，所以积分是 $[0, \\pi]$ 上积分的两倍：`,
                  ),
                  [`b_{${n}} = ${lead}\\int_0^\\pi x\\sin ${nx}\\,dx`],
                ],
                [
                  ["Integrate by parts", "分部积分"],
                  t("", ""),
                  [`\\int_0^\\pi x\\sin ${nx}\\,dx = \\left[${anti}\\right]_0^\\pi = ${part}`],
                ],
                [["Multiply", "相乘"], t("", ""), [`b_{${n}} = ${lead} \\cdot ${wrap(part)} = ${ans.toLatex()}`]],
              ],
              t(
                `Differentiating the antiderivative gives back the integrand: $\\frac{d}{dx}\\left(${anti}\\right) = x\\sin ${nx}$.`,
                `对原函数求导还原出被积函数：$\\frac{d}{dx}\\left(${anti}\\right) = x\\sin ${nx}$。`,
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
    intro: t(
      "Take $f(x) = 2\\sin x + 3\\cos 2x$. Squaring gives $4\\sin^{2} x + 12\\sin x\\cos 2x + 9\\cos^{2} 2x$; over $[-\\pi, \\pi]$ the middle term integrates to $0$ and each square to $\\pi$, so $\\frac{1}{\\pi}\\int_{-\\pi}^{\\pi} f^{2}\\,dx = 4 + 9 = 13$.\n\nCheck: $\\sin x\\cos 2x$ is odd, so its integral over $[-\\pi, \\pi]$ is $0$, and $\\sin^{2}$ and $\\cos^{2}$ average $\\frac{1}{2}$ over the interval of length $2\\pi$.\n\nIn this lesson we use orthogonality to integrate products of modes and to apply Parseval's identity.",
      "取 $f(x) = 2\\sin x + 3\\cos 2x$。平方得 $4\\sin^{2} x + 12\\sin x\\cos 2x + 9\\cos^{2} 2x$；在 $[-\\pi, \\pi]$ 上中间项积分为 $0$，每个平方项积分为 $\\pi$，所以 $\\frac{1}{\\pi}\\int_{-\\pi}^{\\pi} f^{2}\\,dx = 4 + 9 = 13$。\n\n检验：$\\sin x\\cos 2x$ 是奇函数，在 $[-\\pi, \\pi]$ 上积分为 $0$；$\\sin^{2}$ 与 $\\cos^{2}$ 在长为 $2\\pi$ 的区间上平均值为 $\\frac{1}{2}$。\n\n本课我们用正交性计算模式乘积的积分，并应用帕塞瓦尔恒等式。",
    ),
    prerequisites: ["introduction-to-fourier-series"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "fourier-orthogonality-integral",
        title: t("Orthogonality norm integral of trigonometric modes", "三角模态的正交范数积分"),
        explanation: t(
          "Different sine and cosine modes are orthogonal over a full period, so each mode can be isolated by multiplying by it and integrating. By orthogonality, $\\int_{-\\pi}^\\pi \\sin^2(nx)\\,dx = \\pi$ for any non-zero integer $n$. Thus $\\frac{1}{\\pi} \\int_{-\\pi}^\\pi (k \\sin(nx))^2\\,dx = k^2$.\n\n> **Watch out.** $\\int_{-\\pi}^{\\pi}\\sin^{2} nx\\,dx$ is $\\pi$, not $2\\pi$: $\\sin^{2}$ averages $\\frac{1}{2}$. So $\\frac{1}{\\pi}\\int_{-\\pi}^{\\pi}(3\\sin 2x)^{2}\\,dx = 9$, not $18$.",
          "不同的正弦和余弦模式在一个完整周期上是正交的，所以乘以某个模式再积分就能把它单独分离出来。根据正交性，对任意非零整数 $n$，均有 $\\int_{-\\pi}^\\pi \\sin^2(nx)\\,dx = \\pi$。因此 $\\frac{1}{\\pi} \\int_{-\\pi}^\\pi (k \\sin(nx))^2\\,dx = k^2$。\n\n> **注意。** $\\int_{-\\pi}^{\\pi}\\sin^{2} nx\\,dx$ 是 $\\pi$，不是 $2\\pi$：$\\sin^{2}$ 的平均值为 $\\frac{1}{2}$。所以 $\\frac{1}{\\pi}\\int_{-\\pi}^{\\pi}(3\\sin 2x)^{2}\\,dx = 9$，不是 $18$。",
        ),
        generate(rng: Rng): Problem {
          const k = rng.int(2, 35);
          const n = rng.int(1, 10);
          const ans = k * k;
          const nx = mx(n);
          return numberProblem({
            prompt: t(
              `Using the orthogonality of the trigonometric system on $[-\\pi, \\pi]$, evaluate $\\frac{1}{\\pi} \\int_{-\\pi}^\\pi \\left(${k}\\sin ${nx}\\right)^2\\,dx$.`,
              `利用三角函数系在 $[-\\pi, \\pi]$ 上的正交性，计算定积分 $\\frac{1}{\\pi} \\int_{-\\pi}^\\pi \\left(${k}\\sin ${nx}\\right)^2\\,dx$ 的值。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(k, "That forgets to square the amplitude.", "这忘了把振幅平方。"),
              why(
                2 * ans,
                `That takes $\\int_{-\\pi}^{\\pi}\\sin^{2} ${nx}\\,dx$ as $2\\pi$; $\\sin^{2}$ averages $\\frac{1}{2}$, so the integral is $\\pi$.`,
                `这把 $\\int_{-\\pi}^{\\pi}\\sin^{2} ${nx}\\,dx$ 当成 $2\\pi$；$\\sin^{2}$ 的平均值为 $\\frac{1}{2}$，所以积分为 $\\pi$。`,
              ),
              why(
                0,
                "Orthogonality makes the product of two different modes integrate to $0$; here the mode is multiplied by itself.",
                "正交性使两个不同模式的乘积积分为 $0$；这里是模式与它自身相乘。",
              ),
            ]),
            solution: walked(
              [
                [["Factor out the amplitude", "提出振幅"], t("", ""), [`\\frac{${ans}}{\\pi}\\int_{-\\pi}^{\\pi}\\sin^{2} ${nx}\\,dx`]],
                [
                  ["Lower the power", "降幂"],
                  t("The cosine term runs through whole periods and integrates to $0$:", "余弦项走过整数个周期，积分为 $0$："),
                  [`\\int_{-\\pi}^{\\pi}\\frac{1 - \\cos ${2 * n}x}{2}\\,dx = \\pi`],
                ],
                [["Multiply", "相乘"], t("", ""), [`\\frac{${ans}}{\\pi} \\cdot \\pi = ${ans}`]],
              ],
              t(
                `$\\left(${k}\\sin ${nx}\\right)^{2}$ averages $\\frac{${ans}}{2}$ over the interval of length $2\\pi$, so its integral is $${ans}\\pi$, and dividing by $\\pi$ gives $${ans}$.`,
                `$\\left(${k}\\sin ${nx}\\right)^{2}$ 在长为 $2\\pi$ 的区间上平均值为 $\\frac{${ans}}{2}$，所以积分为 $${ans}\\pi$，除以 $\\pi$ 得 $${ans}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "parsevals-identity-for-a-trigonometric-polynomial",
        title: t("Parseval's identity for a trigonometric polynomial", "三角多项式的帕塞瓦尔恒等式"),
        explanation: t(
          "Squaring a Fourier series and integrating term by term, every cross term vanishes by orthogonality, leaving **Parseval's identity**:\n\n$$\\frac{1}{\\pi}\\int_{-\\pi}^{\\pi} f(x)^{2}\\,dx = \\frac{a_0^{2}}{2} + \\sum_{n \\ge 1}\\left(a_n^{2} + b_n^{2}\\right).$$\n\nThe constant term of the series is $\\frac{a_0}{2}$, so a constant $A$ contributes $\\frac{(2A)^{2}}{2} = 2A^{2}$, not $A^{2}$. For $f = 1 + 3\\cos x - 2\\sin 4x$: $2 + 9 + 4 = 15$.\n\n> **Watch out.** The constant counts double because it does not average down: $\\frac{1}{\\pi}\\int_{-\\pi}^{\\pi} 3^{2}\\,dx = 18 = 2 \\cdot 9$, while $\\frac{1}{\\pi}\\int_{-\\pi}^{\\pi}(3\\cos x)^{2}\\,dx = 9$.",
          "把傅里叶级数平方后逐项积分，由正交性所有交叉项都为零，得到**帕塞瓦尔恒等式**：\n\n$$\\frac{1}{\\pi}\\int_{-\\pi}^{\\pi} f(x)^{2}\\,dx = \\frac{a_0^{2}}{2} + \\sum_{n \\ge 1}\\left(a_n^{2} + b_n^{2}\\right).$$\n\n级数的常数项是 $\\frac{a_0}{2}$，所以常数 $A$ 贡献 $\\frac{(2A)^{2}}{2} = 2A^{2}$，而不是 $A^{2}$。例如 $f = 1 + 3\\cos x - 2\\sin 4x$：$2 + 9 + 4 = 15$。\n\n> **注意。** 常数项算两倍，因为它的平方不会被平均掉：$\\frac{1}{\\pi}\\int_{-\\pi}^{\\pi} 3^{2}\\,dx = 18 = 2 \\cdot 9$，而 $\\frac{1}{\\pi}\\int_{-\\pi}^{\\pi}(3\\cos x)^{2}\\,dx = 9$。",
        ),
        generate(rng: Rng): Problem {
          const A = rng.nonZero(-5, 5);
          const B = rng.nonZero(-6, 6);
          const C = rng.nonZero(-6, 6);
          const m = rng.int(1, 4);
          const n = rng.int(1, 5);
          const ans = 2 * A * A + B * B + C * C;
          const term = (c: number, fn: string, k: number) => `${c < 0 ? "-" : "+"} ${Math.abs(c) === 1 ? "" : Math.abs(c)}\\${fn} ${mx(k)}`;
          const f = `${A} ${term(B, "cos", m)} ${term(C, "sin", n)}`;
          return numberProblem({
            prompt: t(
              `Use Parseval's identity to evaluate $\\frac{1}{\\pi}\\int_{-\\pi}^{\\pi} f(x)^{2}\\,dx$ for $f(x) = ${f}$.`,
              `用帕塞瓦尔恒等式计算 $f(x) = ${f}$ 的 $\\frac{1}{\\pi}\\int_{-\\pi}^{\\pi} f(x)^{2}\\,dx$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                A * A + B * B + C * C,
                `That counts the constant as $${A * A}$; with $a_0 = ${2 * A}$ it contributes $\\frac{a_0^{2}}{2} = ${2 * A * A}$.`,
                `这把常数项算成 $${A * A}$；由 $a_0 = ${2 * A}$，它贡献 $\\frac{a_0^{2}}{2} = ${2 * A * A}$。`,
              ),
              why(
                4 * A * A + B * B + C * C,
                `That uses $a_0^{2} = ${4 * A * A}$ without halving it.`,
                `这用了 $a_0^{2} = ${4 * A * A}$，没有除以 $2$。`,
              ),
              why(
                (A + B + C) ** 2,
                "That squares the sum of the coefficients; the cross terms integrate to $0$, so only the squares remain.",
                "这把系数之和平方；交叉项积分为 $0$，只剩下各平方项。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Read the coefficients", "读出系数"],
                  t("", ""),
                  [`\\frac{a_0}{2} = ${A} \\implies a_0 = ${2 * A}, \\qquad a_{${m}} = ${B}, \\qquad b_{${n}} = ${C}`],
                ],
                [
                  ["Apply Parseval's identity", "应用帕塞瓦尔恒等式"],
                  t("", ""),
                  [`\\frac{a_0^{2}}{2} + a_{${m}}^{2} + b_{${n}}^{2} = \\frac{${4 * A * A}}{2} + ${B * B} + ${C * C} = ${ans}`],
                ],
              ],
              t(
                `Directly: the constant squared, $${A * A}$, integrates to $${2 * A * A}\\pi$, each squared mode to its coefficient squared times $\\pi$, and the cross terms to $0$, giving $\\frac{1}{\\pi}(${2 * A * A} + ${B * B} + ${C * C})\\pi = ${ans}$.`,
                `直接计算：常数的平方 $${A * A}$ 积分为 $${2 * A * A}\\pi$，每个模式的平方积分为系数平方乘以 $\\pi$，交叉项积分为 $0$，得 $\\frac{1}{\\pi}(${2 * A * A} + ${B * B} + ${C * C})\\pi = ${ans}$。`,
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
    intro: t(
      "Take $f(x) = 2$ on $(0, \\pi)$. Its sine coefficients are $b_n = \\frac{2}{\\pi}\\int_0^{\\pi} 2\\sin nx\\,dx$; for $n = 1$ this is $\\frac{4}{\\pi}\\left[-\\cos x\\right]_0^{\\pi} = \\frac{8}{\\pi}$, and for $n = 2$ it is $\\frac{4}{\\pi} \\cdot \\frac{1 - 1}{2} = 0$.\n\nCheck: $\\int_0^{\\pi}\\sin x\\,dx = 2$, so $b_1 = \\frac{2}{\\pi} \\cdot 2 \\cdot 2 = \\frac{8}{\\pi}$, and $\\sin 2x$ has one positive and one negative lobe on $(0, \\pi)$ that cancel.\n\nIn this lesson we expand functions on $(0, \\pi)$ in sines alone, through their odd extensions.",
      "取 $(0, \\pi)$ 上的 $f(x) = 2$。它的正弦系数为 $b_n = \\frac{2}{\\pi}\\int_0^{\\pi} 2\\sin nx\\,dx$；$n = 1$ 时为 $\\frac{4}{\\pi}\\left[-\\cos x\\right]_0^{\\pi} = \\frac{8}{\\pi}$，$n = 2$ 时为 $\\frac{4}{\\pi} \\cdot \\frac{1 - 1}{2} = 0$。\n\n检验：$\\int_0^{\\pi}\\sin x\\,dx = 2$，所以 $b_1 = \\frac{2}{\\pi} \\cdot 2 \\cdot 2 = \\frac{8}{\\pi}$；而 $\\sin 2x$ 在 $(0, \\pi)$ 上有一正一负两个拱，正好抵消。\n\n本课我们通过奇延拓，把 $(0, \\pi)$ 上的函数只用正弦展开。",
    ),
    prerequisites: ["properties-of-fourier-series"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "fourier-sine-coefficient-pure-tone",
        title: t("Fourier sine coefficient of a harmonic component", "谐波分量的傅里叶正弦系数"),
        explanation: t(
          "A function that is already a single sine mode has that mode as its only Fourier component, so every other coefficient is zero. For $f(x) = k \\sin(m x)$ on $(0, \\pi)$, orthogonality implies that $b_n = k$ when $n = m$ and $0$ for all $n \\ne m$. The value $b_m = k$ comes from $\\int_0^\\pi \\sin^2(mx)\\,dx = \\frac{\\pi}{2}$, since $\\sin^2(mx) = \\frac{1 - \\cos(2mx)}{2}$.\n\n> **Watch out.** On $(0, \\pi)$, half the full period, $\\int_0^{\\pi}\\sin^{2} mx\\,dx = \\frac{\\pi}{2}$, not $\\pi$. For $f = 6\\sin 3x$ the integral $\\int_0^{\\pi} f\\sin 3x\\,dx$ is $3\\pi$, and $b_3 = \\frac{2}{\\pi} \\cdot 3\\pi = 6$.",
          "本身就是单个正弦模式的函数，其傅里叶分量只有这一个模式，所以其他系数都为零。对于在 $(0, \\pi)$ 上定义的正弦函数 $f(x) = k \\sin(m x)$，由正交性可知，当 $n = m$ 时其傅里叶正弦系数 $b_m = k$，其余系数均为 $0$。其中 $b_m = k$ 来自 $\\int_0^\\pi \\sin^2(mx)\\,dx = \\frac{\\pi}{2}$，因为 $\\sin^2(mx) = \\frac{1 - \\cos(2mx)}{2}$。\n\n> **注意。** 在只有半个整周期的 $(0, \\pi)$ 上，$\\int_0^{\\pi}\\sin^{2} mx\\,dx = \\frac{\\pi}{2}$，不是 $\\pi$。对 $f = 6\\sin 3x$，积分 $\\int_0^{\\pi} f\\sin 3x\\,dx$ 为 $3\\pi$，$b_3 = \\frac{2}{\\pi} \\cdot 3\\pi = 6$。",
        ),
        generate(rng: Rng): Problem {
          const k = rng.int(2, 35);
          const m = rng.int(2, 10);
          const ans = Q.of(k, 2);
          return numberProblem({
            prompt: t(
              `For $f(x) = ${k} \\sin ${m}x$ on $(0, \\pi)$, the integral in the Fourier coefficient of $\\sin ${m}x$ is $\\int_0^\\pi f(x) \\sin ${m}x\\,dx = K\\pi$. Find $K$.`,
              `对 $(0, \\pi)$ 上的 $f(x) = ${k} \\sin ${m}x$，关于 $\\sin ${m}x$ 的傅里叶系数中的积分为 $\\int_0^\\pi f(x) \\sin ${m}x\\,dx = K\\pi$。求 $K$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                k,
                `That takes $\\int_0^{\\pi}\\sin^{2} ${m}x\\,dx$ as $\\pi$; over $(0, \\pi)$ it is $\\frac{\\pi}{2}$.`,
                `这把 $\\int_0^{\\pi}\\sin^{2} ${m}x\\,dx$ 当成 $\\pi$；在 $(0, \\pi)$ 上它是 $\\frac{\\pi}{2}$。`,
              ),
              why(
                0,
                "Orthogonality makes different modes integrate to $0$; here the mode is multiplied by itself.",
                "正交性使不同模式的乘积积分为 $0$；这里是模式与它自身相乘。",
              ),
            ]),
            solution: walked(
              [
                [["Write the integrand", "写出被积函数"], t("", ""), [`${k}\\sin^{2} ${m}x = ${k} \\cdot \\frac{1 - \\cos ${2 * m}x}{2}`]],
                [
                  ["Integrate", "积分"],
                  t(
                    "The cosine runs through whole periods on $(0, \\pi)$ and integrates to $0$:",
                    "余弦在 $(0, \\pi)$ 上走过整数个周期，积分为 $0$：",
                  ),
                  [`\\int_0^\\pi ${k}\\sin^{2} ${m}x\\,dx = ${k} \\cdot \\frac{\\pi}{2} = ${piTimes(ans)}`, `K = ${ans.toLatex()}`],
                ],
              ],
              t(
                `The sine coefficient is then $b_{${m}} = \\frac{2}{\\pi} \\cdot ${piTimes(ans)} = ${k}$, the amplitude of the single mode, as it must be.`,
                `于是正弦系数 $b_{${m}} = \\frac{2}{\\pi} \\cdot ${piTimes(ans)} = ${k}$，正是这个单一模式的振幅，理应如此。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-sine-series-of-a-constant",
        title: t("The sine series of a constant", "常数的正弦级数"),
        explanation: t(
          "Even a constant has a sine series on $(0, \\pi)$: its odd extension is a square wave. For $f(x) = c$,\n\n$$b_n = \\frac{2}{\\pi}\\int_{0}^{\\pi} c\\sin nx\\,dx = \\frac{2c}{\\pi}\\left[-\\frac{\\cos nx}{n}\\right]_{0}^{\\pi} = \\frac{2c\\left(1 - (-1)^{n}\\right)}{n\\pi}.$$\n\nSo $b_n = \\frac{4c}{n\\pi}$ for odd $n$ and $b_n = 0$ for even $n$: $1 = \\frac{4}{\\pi}\\left(\\sin x + \\frac{\\sin 3x}{3} + \\frac{\\sin 5x}{5} + \\cdots\\right)$ on $(0, \\pi)$.\n\n> **Watch out.** The even coefficients are $0$, not $\\frac{4c}{n\\pi}$: for even $n$, $\\cos n\\pi = 1$ and the bracket is $0$. For $f = 3$, $b_2 = 0$ and $b_3 = \\frac{4}{\\pi}$.",
          "即使是常数，在 $(0, \\pi)$ 上也有正弦级数：它的奇延拓是方波。对 $f(x) = c$，\n\n$$b_n = \\frac{2}{\\pi}\\int_{0}^{\\pi} c\\sin nx\\,dx = \\frac{2c}{\\pi}\\left[-\\frac{\\cos nx}{n}\\right]_{0}^{\\pi} = \\frac{2c\\left(1 - (-1)^{n}\\right)}{n\\pi}.$$\n\n所以 $n$ 为奇数时 $b_n = \\frac{4c}{n\\pi}$，为偶数时 $b_n = 0$：在 $(0, \\pi)$ 上 $1 = \\frac{4}{\\pi}\\left(\\sin x + \\frac{\\sin 3x}{3} + \\frac{\\sin 5x}{5} + \\cdots\\right)$。\n\n> **注意。** 偶数项系数为 $0$，不是 $\\frac{4c}{n\\pi}$：$n$ 为偶数时 $\\cos n\\pi = 1$，括号为 $0$。对 $f = 3$，$b_2 = 0$，$b_3 = \\frac{4}{\\pi}$。",
        ),
        generate(rng: Rng): Problem {
          const c = nz2(rng, 9);
          const n = rng.bool(0.8) ? 2 * rng.int(0, 4) + 1 : 2 * rng.int(1, 4);
          const odd = n % 2 === 1;
          const ans = Q.of(odd ? 4 * c : 0, n);
          const bracket = odd ? 2 : 0;
          const twoOverN = n === 1 ? "2" : `\\frac{2}{${n}}`;
          const mistakes = odd
            ? [
                why(
                  Q.of(2 * c, n),
                  `That takes $1 - (-1)^{${n}}$ as $1$; for odd $n$ it is $2$.`,
                  `这把 $1 - (-1)^{${n}}$ 当成 $1$；$n$ 为奇数时它是 $2$。`,
                ),
                why(
                  Q.of(-4 * c, n),
                  "That has the wrong sign: $\\left[-\\cos nx\\right]_0^{\\pi} = 1 - \\cos n\\pi$.",
                  "符号错了：$\\left[-\\cos nx\\right]_0^{\\pi} = 1 - \\cos n\\pi$。",
                ),
                why(
                  Q.of(4 * c, n * n),
                  "That divides by $n$ twice; integrating $\\sin nx$ once brings one factor $\\frac{1}{n}$.",
                  "这除了两次 $n$；对 $\\sin nx$ 积分一次只带来一个因子 $\\frac{1}{n}$。",
                ),
              ]
            : [
                why(
                  Q.of(4 * c, n),
                  `That is the odd-$n$ formula; for $n = ${n}$, $\\cos ${n}\\pi = 1$ and the bracket is $0$.`,
                  `这是 $n$ 为奇数时的公式；$n = ${n}$ 时 $\\cos ${n}\\pi = 1$，括号为 $0$。`,
                ),
                why(
                  Q.of(2 * c, n),
                  `That takes $1 - (-1)^{${n}}$ as $1$; for even $n$ it is $0$.`,
                  `这把 $1 - (-1)^{${n}}$ 当成 $1$；$n$ 为偶数时它是 $0$。`,
                ),
              ];
          return numberProblem({
            prompt: t(
              `The Fourier sine series of $f(x) = ${c}$ on $(0, \\pi)$ has coefficients $b_n$. Writing $b_{${n}} = \\frac{K}{\\pi}$, find $K$.`,
              `$f(x) = ${c}$ 在 $(0, \\pi)$ 上的傅里叶正弦级数的系数为 $b_n$。把 $b_{${n}}$ 写成 $\\frac{K}{\\pi}$，求 $K$。`,
            ),
            answer: ans,
            mistakes: apart(ans, mistakes),
            solution: walked(
              [
                [
                  ["Integrate", "积分"],
                  t("", ""),
                  [
                    `b_n = \\frac{2}{\\pi}\\int_{0}^{\\pi} ${c}\\sin nx\\,dx = \\frac{${2 * c}}{\\pi}\\left[-\\frac{\\cos nx}{n}\\right]_{0}^{\\pi} = \\frac{${2 * c}\\left(1 - \\cos n\\pi\\right)}{n\\pi}`,
                  ],
                ],
                [
                  [`Put in n = ${n}`, `代入 n = ${n}`],
                  t("", ""),
                  [`1 - \\cos ${n}\\pi = ${bracket}, \\qquad b_{${n}} = ${odd ? overPi(ans) : "0"}`, `K = ${ans.toLatex()}`],
                ],
              ],
              odd
                ? t(
                    `$\\int_0^{\\pi}\\sin ${mx(n)}\\,dx = ${twoOverN}$ for odd $n$, so $b_{${n}} = \\frac{2}{\\pi} \\cdot ${par(c)} \\cdot ${twoOverN} = ${overPi(ans)}$.`,
                    `$n$ 为奇数时 $\\int_0^{\\pi}\\sin ${mx(n)}\\,dx = ${twoOverN}$，所以 $b_{${n}} = \\frac{2}{\\pi} \\cdot ${par(c)} \\cdot ${twoOverN} = ${overPi(ans)}$。`,
                  )
                : t(
                    `$\\sin ${n}x$ runs through $${n / 2}$ whole periods on $(0, \\pi)$, with equal positive and negative lobes, so its integral, and $b_{${n}}$, is $0$.`,
                    `$\\sin ${n}x$ 在 $(0, \\pi)$ 上走过 $${n / 2}$ 个整周期，正负拱面积相等，所以积分为 $0$，$b_{${n}}$ 也为 $0$。`,
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
    intro: t(
      "Take $f(x) = x$ on $(0, \\pi)$. Its cosine coefficients start with $a_0 = \\frac{2}{\\pi}\\int_0^{\\pi} x\\,dx = \\pi$, and by parts $a_1 = \\frac{2}{\\pi}\\int_0^{\\pi} x\\cos x\\,dx = \\frac{2}{\\pi}\\left[x\\sin x + \\cos x\\right]_0^{\\pi} = \\frac{2}{\\pi}(-1 - 1) = -\\frac{4}{\\pi}$.\n\nCheck: the constant term $\\frac{a_0}{2} = \\frac{\\pi}{2}$ is the average of $x$ over $(0, \\pi)$, as it should be.\n\nIn this lesson we expand functions on $(0, \\pi)$ in cosines alone, through their even extensions.",
      "取 $(0, \\pi)$ 上的 $f(x) = x$。它的余弦系数从 $a_0 = \\frac{2}{\\pi}\\int_0^{\\pi} x\\,dx = \\pi$ 开始，分部积分得 $a_1 = \\frac{2}{\\pi}\\int_0^{\\pi} x\\cos x\\,dx = \\frac{2}{\\pi}\\left[x\\sin x + \\cos x\\right]_0^{\\pi} = \\frac{2}{\\pi}(-1 - 1) = -\\frac{4}{\\pi}$。\n\n检验：常数项 $\\frac{a_0}{2} = \\frac{\\pi}{2}$ 正是 $x$ 在 $(0, \\pi)$ 上的平均值。\n\n本课我们通过偶延拓，把 $(0, \\pi)$ 上的函数只用余弦展开。",
    ),
    prerequisites: ["fourier-sine-series"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "fourier-cosine-coefficient-pure-tone",
        title: t("Fourier cosine coefficient of a harmonic component", "谐波分量的傅里叶余弦系数"),
        explanation: t(
          "A function that is already a single cosine mode has only one nonzero cosine coefficient, equal to its amplitude. For $f(x) = k \\cos(m x)$ on $(0, \\pi)$, orthogonality implies that $a_m = k$ and all other $a_n = 0$. The value $a_m = k$ comes from $\\int_0^\\pi \\cos^2(mx)\\,dx = \\frac{\\pi}{2}$, since $\\cos^2(mx) = \\frac{1 + \\cos(2mx)}{2}$.\n\n> **Watch out.** On $(0, \\pi)$, $\\int_0^{\\pi}\\cos^{2} mx\\,dx = \\frac{\\pi}{2}$, not $\\pi$. For $f = 8\\cos 2x$ the integral $\\int_0^{\\pi} f\\cos 2x\\,dx$ is $4\\pi$, and $a_2 = \\frac{2}{\\pi} \\cdot 4\\pi = 8$.",
          "本身就是单个余弦模式的函数只有一个非零的余弦系数，等于它的振幅。对于在 $(0, \\pi)$ 上定义的余弦函数 $f(x) = k \\cos(m x)$，由正交性可知，当 $n = m$ 时其傅里叶余弦系数 $a_m = k$，其余系数均为 $0$。其中 $a_m = k$ 来自 $\\int_0^\\pi \\cos^2(mx)\\,dx = \\frac{\\pi}{2}$，因为 $\\cos^2(mx) = \\frac{1 + \\cos(2mx)}{2}$。\n\n> **注意。** 在 $(0, \\pi)$ 上，$\\int_0^{\\pi}\\cos^{2} mx\\,dx = \\frac{\\pi}{2}$，不是 $\\pi$。对 $f = 8\\cos 2x$，积分 $\\int_0^{\\pi} f\\cos 2x\\,dx$ 为 $4\\pi$，$a_2 = \\frac{2}{\\pi} \\cdot 4\\pi = 8$。",
        ),
        generate(rng: Rng): Problem {
          const k = rng.int(2, 35);
          const m = rng.int(2, 10);
          const ans = Q.of(k, 2);
          return numberProblem({
            prompt: t(
              `For $f(x) = ${k} \\cos ${m}x$ on $(0, \\pi)$, the integral in the Fourier coefficient of $\\cos ${m}x$ is $\\int_0^\\pi f(x) \\cos ${m}x\\,dx = K\\pi$. Find $K$.`,
              `对 $(0, \\pi)$ 上的 $f(x) = ${k} \\cos ${m}x$，关于 $\\cos ${m}x$ 的傅里叶系数中的积分为 $\\int_0^\\pi f(x) \\cos ${m}x\\,dx = K\\pi$。求 $K$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                k,
                `That takes $\\int_0^{\\pi}\\cos^{2} ${m}x\\,dx$ as $\\pi$; over $(0, \\pi)$ it is $\\frac{\\pi}{2}$.`,
                `这把 $\\int_0^{\\pi}\\cos^{2} ${m}x\\,dx$ 当成 $\\pi$；在 $(0, \\pi)$ 上它是 $\\frac{\\pi}{2}$。`,
              ),
              why(
                0,
                "Orthogonality makes different modes integrate to $0$; here the mode is multiplied by itself.",
                "正交性使不同模式的乘积积分为 $0$；这里是模式与它自身相乘。",
              ),
            ]),
            solution: walked(
              [
                [["Write the integrand", "写出被积函数"], t("", ""), [`${k}\\cos^{2} ${m}x = ${k} \\cdot \\frac{1 + \\cos ${2 * m}x}{2}`]],
                [
                  ["Integrate", "积分"],
                  t(
                    "The cosine runs through whole periods on $(0, \\pi)$ and integrates to $0$:",
                    "余弦在 $(0, \\pi)$ 上走过整数个周期，积分为 $0$：",
                  ),
                  [`\\int_0^\\pi ${k}\\cos^{2} ${m}x\\,dx = ${k} \\cdot \\frac{\\pi}{2} = ${piTimes(ans)}`, `K = ${ans.toLatex()}`],
                ],
              ],
              t(
                `The cosine coefficient is then $a_{${m}} = \\frac{2}{\\pi} \\cdot ${piTimes(ans)} = ${k}$, the amplitude of the single mode, as it must be.`,
                `于是余弦系数 $a_{${m}} = \\frac{2}{\\pi} \\cdot ${piTimes(ans)} = ${k}$，正是这个单一模式的振幅，理应如此。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-cosine-series-of-a-linear-function",
        figure: differentialEquationsDrawings1["fourier-cosine-series#the-cosine-series-of-a-linear-function"],
        title: t("The cosine series of a linear function", "线性函数的余弦级数"),
        explanation: t(
          "The even extension of $f(x) = cx$ from $(0, \\pi)$ is the triangle wave $c|x|$, so its series has cosines only. By parts,\n\n$$a_n = \\frac{2}{\\pi}\\int_{0}^{\\pi} cx\\cos nx\\,dx = \\frac{2c}{\\pi}\\left[\\frac{\\cos nx}{n^{2}}\\right]_{0}^{\\pi} = \\frac{2c\\left((-1)^{n} - 1\\right)}{n^{2}\\pi},$$\n\nwhich is $-\\frac{4c}{n^{2}\\pi}$ for odd $n$ and $0$ for even $n$, while $a_0 = c\\pi$. The coefficients shrink like $\\frac{1}{n^{2}}$, faster than for the sine series, because the triangle wave has no jumps.\n\n> **Watch out.** The boundary term $\\frac{x\\sin nx}{n}$ is $0$ at both ends, so the result has $n^{2}$ in the denominator, not $n$. For $f = x$, $a_3 = -\\frac{4}{9\\pi}$, not $-\\frac{4}{3\\pi}$.",
          "$f(x) = cx$ 从 $(0, \\pi)$ 出发的偶延拓是三角波 $c|x|$，所以其级数只有余弦项。分部积分：\n\n$$a_n = \\frac{2}{\\pi}\\int_{0}^{\\pi} cx\\cos nx\\,dx = \\frac{2c}{\\pi}\\left[\\frac{\\cos nx}{n^{2}}\\right]_{0}^{\\pi} = \\frac{2c\\left((-1)^{n} - 1\\right)}{n^{2}\\pi},$$\n\n$n$ 为奇数时为 $-\\frac{4c}{n^{2}\\pi}$，为偶数时为 $0$，而 $a_0 = c\\pi$。系数按 $\\frac{1}{n^{2}}$ 减小，比正弦级数快，因为三角波没有跳跃。\n\n> **注意。** 边界项 $\\frac{x\\sin nx}{n}$ 在两端都为 $0$，所以结果的分母是 $n^{2}$，不是 $n$。对 $f = x$，$a_3 = -\\frac{4}{9\\pi}$，不是 $-\\frac{4}{3\\pi}$。",
        ),
        generate(rng: Rng): Problem {
          const c = rng.nonZero(-9, 9);
          const n = rng.bool(0.8) ? 2 * rng.int(0, 3) + 1 : 2 * rng.int(1, 3);
          const odd = n % 2 === 1;
          const ans = Q.of(odd ? -4 * c : 0, n * n);
          const f = c === 1 ? "x" : c === -1 ? "-x" : `${c}x`;
          const nx = mx(n);
          const anti = n === 1 ? "x\\sin x + \\cos x" : `\\frac{x\\sin ${nx}}{${n}} + \\frac{\\cos ${nx}}{${n * n}}`;
          const inner = Q.of(odd ? -2 : 0, n * n);
          const lead = `${c < 0 ? "-" : ""}\\frac{${Math.abs(2 * c)}}{\\pi}`;
          const mistakes = odd
            ? [
                why(
                  ans.neg(),
                  "That has the wrong sign: $\\cos n\\pi - \\cos 0 = -2$ for odd $n$.",
                  "符号错了：$n$ 为奇数时 $\\cos n\\pi - \\cos 0 = -2$。",
                ),
                why(
                  Q.of(-4 * c, n),
                  "That keeps only one factor $n$; the cosine term of the antiderivative has $n^{2}$ below it.",
                  "这只保留了一个因子 $n$；原函数中余弦项的分母是 $n^{2}$。",
                ),
                why(
                  Q.of(-2 * c, n * n),
                  "That takes $(-1)^{n} - 1$ as $-1$; for odd $n$ it is $-2$.",
                  "这把 $(-1)^{n} - 1$ 当成 $-1$；$n$ 为奇数时它是 $-2$。",
                ),
              ]
            : [
                why(
                  Q.of(-4 * c, n * n),
                  `That is the odd-$n$ formula; for $n = ${n}$, $\\cos ${n}\\pi = 1$ and the bracket is $0$.`,
                  `这是 $n$ 为奇数时的公式；$n = ${n}$ 时 $\\cos ${n}\\pi = 1$，括号为 $0$。`,
                ),
                why(
                  Q.of(-2 * c, n * n),
                  `That takes $(-1)^{${n}} - 1$ as $-1$; for even $n$ it is $0$.`,
                  `这把 $(-1)^{${n}} - 1$ 当成 $-1$；$n$ 为偶数时它是 $0$。`,
                ),
              ];
          return numberProblem({
            prompt: t(
              `The Fourier cosine series of $f(x) = ${f}$ on $(0, \\pi)$ has coefficients $a_n$. Writing $a_{${n}} = \\frac{K}{\\pi}$, find $K$.`,
              `$f(x) = ${f}$ 在 $(0, \\pi)$ 上的傅里叶余弦级数的系数为 $a_n$。把 $a_{${n}}$ 写成 $\\frac{K}{\\pi}$，求 $K$。`,
            ),
            answer: ans,
            mistakes: apart(ans, mistakes),
            solution: walked(
              [
                [["Set up the coefficient", "写出系数"], t("", ""), [`a_{${n}} = ${lead}\\int_0^{\\pi} x\\cos ${nx}\\,dx`]],
                [
                  ["Integrate by parts", "分部积分"],
                  t("The term with $\\sin$ is $0$ at both ends:", "含 $\\sin$ 的项在两端都为 $0$："),
                  [`\\int_0^{\\pi} x\\cos ${nx}\\,dx = \\left[${anti}\\right]_0^{\\pi} = ${inner.toLatex()}`],
                ],
                [
                  ["Multiply", "相乘"],
                  t("", ""),
                  [`a_{${n}} = ${lead} \\cdot ${wrap(inner.toLatex())} = ${overPi(ans)}`, `K = ${ans.toLatex()}`],
                ],
              ],
              t(
                `Differentiating the antiderivative gives back the integrand: $\\frac{d}{dx}\\left(${anti}\\right) = x\\cos ${nx}$.`,
                `对原函数求导还原出被积函数：$\\frac{d}{dx}\\left(${anti}\\right) = x\\cos ${nx}$。`,
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
    intro: t(
      "Take $f(x) = x$ on $[-2, 2]$, extended with period $4$. Its coefficient of $\\sin\\frac{\\pi x}{2}$ is $b_1 = \\frac{1}{2}\\int_{-2}^{2} x\\sin\\frac{\\pi x}{2}\\,dx$, and substituting $u = \\frac{\\pi x}{2}$ turns it into $\\frac{2}{\\pi} \\cdot \\frac{1}{\\pi}\\int_{-\\pi}^{\\pi} u\\sin u\\,du = \\frac{2}{\\pi} \\cdot 2 = \\frac{4}{\\pi}$.\n\nCheck: on $[-\\pi, \\pi]$ the coefficient of $\\sin x$ in $x$ is $2$; stretching the interval by $\\frac{2}{\\pi}$ stretches the function by the same factor, giving $\\frac{4}{\\pi}$.\n\nIn this lesson we work with Fourier series on $[-L, L]$, whose modes are $\\cos\\frac{n\\pi x}{L}$ and $\\sin\\frac{n\\pi x}{L}$.",
      "取 $[-2, 2]$ 上的 $f(x) = x$，以 $4$ 为周期延拓。它关于 $\\sin\\frac{\\pi x}{2}$ 的系数为 $b_1 = \\frac{1}{2}\\int_{-2}^{2} x\\sin\\frac{\\pi x}{2}\\,dx$，代换 $u = \\frac{\\pi x}{2}$ 把它化为 $\\frac{2}{\\pi} \\cdot \\frac{1}{\\pi}\\int_{-\\pi}^{\\pi} u\\sin u\\,du = \\frac{2}{\\pi} \\cdot 2 = \\frac{4}{\\pi}$。\n\n检验：在 $[-\\pi, \\pi]$ 上，$x$ 中 $\\sin x$ 的系数为 $2$；区间伸缩 $\\frac{2}{\\pi}$ 倍，函数也伸缩同样倍数，得 $\\frac{4}{\\pi}$。\n\n本课我们处理 $[-L, L]$ 上的傅里叶级数，其模式为 $\\cos\\frac{n\\pi x}{L}$ 与 $\\sin\\frac{n\\pi x}{L}$。",
    ),
    prerequisites: ["fourier-cosine-series"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "fundamental-period-and-frequency",
        title: t("Fundamental period from half-period L", "由半周期 L 确定基波周期"),
        explanation: t(
          "When a Fourier series is defined using the spatial scale $L$ with basis functions $\\sin\\left(\\frac{n\\pi x}{L}\\right)$, the fundamental period of the periodic extension is $T = 2L$.\n\n> **Watch out.** $L$ is half the period. For modes $\\cos\\frac{n\\pi x}{5}$, $T = 10$, not $5$: at $x = 5$ the angle $\\frac{\\pi x}{5}$ has only reached $\\pi$.",
          "当傅里叶级数基于半周期 $L$（基函数为 $\\sin\\left(\\frac{n\\pi x}{L}\\right)$）展开时，其周期延拓函数的基波周期为 $T = 2L$。\n\n> **注意。** $L$ 是半个周期。对模式 $\\cos\\frac{n\\pi x}{5}$，$T = 10$，不是 $5$：在 $x = 5$ 处角 $\\frac{\\pi x}{5}$ 才到 $\\pi$。",
        ),
        generate(rng: Rng): Problem {
          const L = rng.int(2, 35);
          const ans = 2 * L;
          return numberProblem({
            prompt: t(
              `A periodic function $f(x)$ is expanded in a Fourier series with spatial harmonics $\\cos\\left(\\frac{n\\pi x}{${L}}\\right)$ and $\\sin\\left(\\frac{n\\pi x}{${L}}\\right)$. What is the fundamental period $T$ of $f(x)$?`,
              `周期函数 $f(x)$ 展开为空间谐波 $\\cos\\left(\\frac{n\\pi x}{${L}}\\right)$ 与 $\\sin\\left(\\frac{n\\pi x}{${L}}\\right)$ 的傅里叶级数。求 $f(x)$ 的基波周期 $T$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                L,
                `That is half the period: at $x = ${L}$ the angle $\\frac{\\pi x}{${L}}$ is only $\\pi$.`,
                `这是半个周期：在 $x = ${L}$ 处角 $\\frac{\\pi x}{${L}}$ 只有 $\\pi$。`,
              ),
              why(
                4 * L,
                `That waits for the angle to reach $4\\pi$, two full turns; one full turn, $2\\pi$, already completes a period.`,
                `这等角度到 $4\\pi$，即转两圈；转一圈 $2\\pi$ 就已完成一个周期。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Take the fundamental mode", "取基波"],
                  t("The slowest mode is $n = 1$:", "最慢的模式是 $n = 1$："),
                  [`\\sin\\frac{\\pi x}{${L}}, \\qquad \\omega_1 = \\frac{\\pi}{${L}}`],
                ],
                [["Find its period", "求它的周期"], t("", ""), [`T = \\frac{2\\pi}{\\omega_1} = 2\\pi \\cdot \\frac{${L}}{\\pi} = ${ans}`]],
              ],
              t(
                `At $x = ${ans}$ the angle is $\\frac{${ans}\\pi}{${L}} = 2\\pi$, one full turn, and every higher mode $n$ has made $n$ full turns, so the whole series repeats there.`,
                `在 $x = ${ans}$ 处角为 $\\frac{${ans}\\pi}{${L}} = 2\\pi$，正好一圈，而每个高阶模式 $n$ 转了 $n$ 圈，所以整个级数在那里重复。`,
              ),
            ),
          });
        },
      },
      {
        id: "coefficients-on-a-general-interval",
        title: t("Coefficients on a general interval", "一般区间上的系数"),
        explanation: t(
          "On $[-L, L]$ the coefficients use $\\frac{1}{L}$ and the scaled modes $\\frac{n\\pi x}{L}$:\n\n$$b_n = \\frac{1}{L}\\int_{-L}^{L} f(x)\\sin\\frac{n\\pi x}{L}\\,dx.$$\n\nSubstituting $u = \\frac{\\pi x}{L}$ turns this into the familiar $2\\pi$-periodic case, so for $f(x) = x$ the result is the $[-\\pi, \\pi]$ answer scaled by $\\frac{L}{\\pi}$:\n\n$$b_n = \\frac{2L(-1)^{n+1}}{n\\pi}.$$\n\nFor $L = 3$, $b_1 = \\frac{6}{\\pi}$ and $b_2 = -\\frac{3}{\\pi}$.\n\n> **Watch out.** Do not reuse the $[-\\pi, \\pi]$ answer unchanged. For $f = x$ on $[-3, 3]$, $b_1 = \\frac{6}{\\pi}$, not $2$: the function reaches $3$ at the end of the interval, not $\\pi$.",
          "在 $[-L, L]$ 上，系数用 $\\frac{1}{L}$ 和伸缩后的模式 $\\frac{n\\pi x}{L}$：\n\n$$b_n = \\frac{1}{L}\\int_{-L}^{L} f(x)\\sin\\frac{n\\pi x}{L}\\,dx.$$\n\n代换 $u = \\frac{\\pi x}{L}$ 把它变回熟悉的 $2\\pi$ 周期情形，所以对 $f(x) = x$，结果就是 $[-\\pi, \\pi]$ 上的答案乘以 $\\frac{L}{\\pi}$：\n\n$$b_n = \\frac{2L(-1)^{n+1}}{n\\pi}.$$\n\n例如 $L = 3$ 时，$b_1 = \\frac{6}{\\pi}$，$b_2 = -\\frac{3}{\\pi}$。\n\n> **注意。** 不能原样照搬 $[-\\pi, \\pi]$ 上的答案。对 $[-3, 3]$ 上的 $f = x$，$b_1 = \\frac{6}{\\pi}$，不是 $2$：函数在区间端点处达到的是 $3$，不是 $\\pi$。",
        ),
        generate(rng: Rng): Problem {
          const L = rng.int(2, 9);
          const n = rng.int(1, 6);
          const c = rng.pick([1, 1, 2, 3, -1, -2]);
          const sgn = n % 2 === 1 ? 1 : -1;
          const ans = Q.of(2 * L * c * sgn, n);
          const f = c === 1 ? "x" : c === -1 ? "-x" : `${c}x`;
          const mode = `\\frac{${n === 1 ? "" : n}\\pi x}{${L}}`;
          const inner = piTimes(Q.of(2 * sgn, n));
          const lead = `${c < 0 ? "-" : ""}\\frac{${Math.abs(c * L)}}{\\pi^{2}}`;
          return numberProblem({
            prompt: t(
              `$f(x) = ${f}$ on $[-${L}, ${L}]$ is extended with period $${2 * L}$. Its Fourier coefficient $b_{${n}}$ of $\\sin ${mode}$ can be written $\\frac{K}{\\pi}$. Find $K$.`,
              `$[-${L}, ${L}]$ 上的 $f(x) = ${f}$ 以 $${2 * L}$ 为周期延拓。它关于 $\\sin ${mode}$ 的傅里叶系数 $b_{${n}}$ 可写成 $\\frac{K}{\\pi}$。求 $K$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                ans.neg(),
                `That has the wrong sign: $(-1)^{n+1} = ${sgn}$ for $n = ${n}$.`,
                `符号错了：$n = ${n}$ 时 $(-1)^{n+1} = ${sgn}$。`,
              ),
              why(
                Q.of(2 * c * sgn, n),
                `That drops the factor $L = ${L}$ that the stretched interval brings.`,
                `这丢掉了区间伸缩带来的因子 $L = ${L}$。`,
              ),
              why(
                Q.of(L * c * sgn, n),
                "That integrates over $[0, L]$ only; the even integrand gives the same again on $[-L, 0]$.",
                "这只在 $[0, L]$ 上积分；被积函数是偶函数，在 $[-L, 0]$ 上还有同样多。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Substitute", "换元"],
                  t(
                    `Put $x = \\frac{${L}u}{\\pi}$, so $dx = \\frac{${L}}{\\pi}\\,du$ and $u$ runs over $[-\\pi, \\pi]$:`,
                    `令 $x = \\frac{${L}u}{\\pi}$，则 $dx = \\frac{${L}}{\\pi}\\,du$，$u$ 取遍 $[-\\pi, \\pi]$：`,
                  ),
                  [
                    `b_{${n}} = \\frac{1}{${L}} \\cdot \\frac{${L * L}}{\\pi^{2}} \\cdot ${c === 1 ? "" : c === -1 ? "(-1) \\cdot " : `${par(c)} \\cdot `}\\int_{-\\pi}^{\\pi} u\\sin ${mx(n, "u")}\\,du`,
                  ],
                ],
                [
                  ["Use the 2π-periodic integral", "利用 2π 周期的积分"],
                  t("By parts, as on $[-\\pi, \\pi]$:", "分部积分，与 $[-\\pi, \\pi]$ 上相同："),
                  [`\\int_{-\\pi}^{\\pi} u\\sin ${mx(n, "u")}\\,du = ${inner}`],
                ],
                [["Multiply", "相乘"], t("", ""), [`b_{${n}} = ${lead} \\cdot ${wrap(inner)} = ${overPi(ans)}`, `K = ${ans.toLatex()}`]],
              ],
              t(
                `On $[-\\pi, \\pi]$ the coefficient of $\\sin ${mx(n)}$ in $${f}$ is $${Q.of(2 * c * sgn, n).toLatex()}$; stretching the interval by $\\frac{${L}}{\\pi}$ multiplies it by $\\frac{${L}}{\\pi}$, giving $${overPi(ans)}$.`,
                `在 $[-\\pi, \\pi]$ 上，$${f}$ 中 $\\sin ${mx(n)}$ 的系数为 $${Q.of(2 * c * sgn, n).toLatex()}$；区间伸缩 $\\frac{${L}}{\\pi}$ 倍，系数也乘以 $\\frac{${L}}{\\pi}$，得 $${overPi(ans)}$。`,
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
    intro: t(
      "Take $f(x) = x$ on $(-\\pi, \\pi)$, extended with period $2\\pi$. At $x = 1$ the extension is continuous, so its Fourier series converges to $1$; at $x = \\pi$ the extension jumps from $\\pi$ down to $-\\pi$, so the series converges to $\\frac{\\pi + (-\\pi)}{2} = 0$.\n\nCheck: the series $2\\left(\\sin x - \\frac{\\sin 2x}{2} + \\cdots\\right)$ has every term $0$ at $x = \\pi$, so its sum there is indeed $0$.\n\nIn this lesson we find the value a Fourier series converges to, at points of continuity, at jumps and outside the base interval.",
      "取 $(-\\pi, \\pi)$ 上的 $f(x) = x$，以 $2\\pi$ 为周期延拓。在 $x = 1$ 处延拓连续，所以傅里叶级数收敛到 $1$；在 $x = \\pi$ 处延拓从 $\\pi$ 跳到 $-\\pi$，所以级数收敛到 $\\frac{\\pi + (-\\pi)}{2} = 0$。\n\n检验：级数 $2\\left(\\sin x - \\frac{\\sin 2x}{2} + \\cdots\\right)$ 在 $x = \\pi$ 处每一项都为 $0$，所以和确实为 $0$。\n\n本课我们求傅里叶级数在连续点、跳跃点以及基本区间之外收敛到的值。",
    ),
    prerequisites: ["fourier-series-of-arbitrary-period"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "dirichlet-jump-convergence",
        title: t("Convergence at a jump discontinuity via Dirichlet's theorem", "狄利克雷定理下跳跃间断点处的收敛值"),
        explanation: t(
          "At a jump, the Fourier series cannot choose either side, so it converges to the midpoint of the two one sided limits. At a jump discontinuity $x_0$, the Fourier series converges to $\\frac{f(x_0^+) + f(x_0^-)}{2}$.\n\n> **Watch out.** The series ignores the value $f$ is given at the jump itself. If $f = 1$ for $x < 0$ and $f = 5$ for $x \\ge 0$, the series converges to $3$ at $x = 0$, not to $f(0) = 5$.",
          "在跳跃点处，傅里叶级数无法偏向任何一侧，所以它收敛到两个单侧极限的中点。在跳跃间断点 $x_0$ 处，傅里叶级数收敛于左右极限的平均值：$\\frac{f(x_0^+) + f(x_0^-)}{2}$。\n\n> **注意。** 级数不理会 $f$ 在跳跃点本身被赋予的值。若 $x < 0$ 时 $f = 1$，$x \\ge 0$ 时 $f = 5$，级数在 $x = 0$ 处收敛到 $3$，不是 $f(0) = 5$。",
        ),
        generate(rng: Rng): Problem {
          const k1 = rng.int(2, 35);
          let k2 = rng.int(2, 35);
          if (k2 === k1) k2 = k1 + 3;
          const leftLim = 2 * k1;
          const rightLim = 2 * k2;
          const ans = k1 + k2;
          return numberProblem({
            prompt: t(
              `A piecewise continuous function $f(x)$ has left limit $\\lim_{x \\to 0^-} f(x) = ${leftLim}$ and right limit $\\lim_{x \\to 0^+} f(x) = ${rightLim}$. To what value does the Fourier series of $f(x)$ converge at $x = 0$?`,
              `分段连续函数 $f(x)$ 在 $x = 0$ 处的左极限为 $\\lim_{x \\to 0^-} f(x) = ${leftLim}$，右极限为 $\\lim_{x \\to 0^+} f(x) = ${rightLim}$。由狄利克雷定理，其傅里叶级数在 $x = 0$ 处收敛于何值？`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                rightLim,
                "That takes the right-hand limit; at a jump the series takes neither side.",
                "这取了右极限；在跳跃点处级数不偏向任何一侧。",
              ),
              why(
                leftLim,
                "That takes the left-hand limit; at a jump the series takes neither side.",
                "这取了左极限；在跳跃点处级数不偏向任何一侧。",
              ),
              why(
                Math.abs(rightLim - leftLim),
                "That is the size of the jump, not the value at its middle.",
                "这是跳跃的大小，不是跳跃中点处的值。",
              ),
              why(leftLim + rightLim, "That adds the one-sided limits without halving them.", "这把两个单侧极限相加，没有取一半。"),
            ]),
            solution: walked(
              [
                [["Read the one-sided limits", "读出单侧极限"], t("", ""), [`f(0^-) = ${leftLim}, \\qquad f(0^+) = ${rightLim}`]],
                [
                  ["Average them", "取平均"],
                  t("By Dirichlet's theorem:", "由狄利克雷定理："),
                  [`S(0) = \\frac{${leftLim} + ${rightLim}}{2} = ${ans}`],
                ],
              ],
              t(
                `$${ans}$ is the same distance, $${Math.abs(k2 - k1)}$, from both one-sided limits: $|${ans} - ${leftLim}| = |${rightLim} - ${ans}| = ${Math.abs(k2 - k1)}$.`,
                `$${ans}$ 到两个单侧极限的距离相同，都是 $${Math.abs(k2 - k1)}$：$|${ans} - ${leftLim}| = |${rightLim} - ${ans}| = ${Math.abs(k2 - k1)}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "convergence-of-the-periodic-extension",
        title: t("Convergence of the periodic extension", "周期延拓的收敛"),
        explanation: t(
          "A Fourier series converges to the **periodic extension** of $f$, not to $f$ itself outside the base interval. For $f$ on $(-L, L)$ with period $2L$:\n\n1. shift $x$ by a multiple of $2L$ into $(-L, L]$;\n2. at an interior point of continuity the sum is $f$ there;\n3. at $x = L$ (and every $L + 2kL$) the ends of the interval meet, so the sum is $\\frac{f(L^{-}) + f(-L^{+})}{2}$.\n\nFor $f(x) = x$ on $(-2, 2)$, the series is $1$ at $x = 5$ (shifted to $1$) and $0$ at $x = 2$, the average of $2$ and $-2$.\n\n> **Watch out.** Do not put $x$ into the formula for $f$ when it lies outside the interval. For $f(x) = x$ on $(-2, 2)$, at $x = 6$ the series is $0$ ($6$ shifts to $-2$, where the ends meet), not $6$.",
          "傅里叶级数收敛到 $f$ 的**周期延拓**，在基本区间之外并不收敛到 $f$ 本身。对 $(-L, L)$ 上、周期为 $2L$ 的 $f$：\n\n1. 把 $x$ 平移 $2L$ 的整数倍，移到 $(-L, L]$ 中；\n2. 在内部的连续点，级数和就是 $f$ 在该点的值；\n3. 在 $x = L$（以及每个 $L + 2kL$）处区间两端相接，级数和为 $\\frac{f(L^{-}) + f(-L^{+})}{2}$。\n\n例如 $(-2, 2)$ 上的 $f(x) = x$，级数在 $x = 5$ 处（平移到 $1$）为 $1$，在 $x = 2$ 处为 $2$ 与 $-2$ 的平均值 $0$。\n\n> **注意。** $x$ 在区间之外时，不能直接代入 $f$ 的式子。对 $(-2, 2)$ 上的 $f(x) = x$，在 $x = 6$ 处级数为 $0$（$6$ 平移到 $-2$，那里两端相接），不是 $6$。",
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
          const fAt = (v: number) => `${a === 1 ? "" : a === -1 ? "-" : `${a} \\cdot `}${par(v)} ${b < 0 ? "-" : "+"} ${Math.abs(b)}`;
          const mistakes = end
            ? [
                why(
                  a * L + b,
                  `That is $f(${L}^{-})$ alone; at the meeting point the series averages it with $f(-${L}^{+})$.`,
                  `这只是 $f(${L}^{-})$；在两端相接处级数要把它与 $f(-${L}^{+})$ 取平均。`,
                ),
                why(
                  -a * L + b,
                  `That is $f(-${L}^{+})$ alone; at the meeting point the series averages it with $f(${L}^{-})$.`,
                  `这只是 $f(-${L}^{+})$；在两端相接处级数要把它与 $f(${L}^{-})$ 取平均。`,
                ),
                why(
                  a * x + b,
                  `That puts $x = ${x}$ into the formula, which only holds on $(-${L}, ${L})$.`,
                  `这把 $x = ${x}$ 直接代入式子，而式子只在 $(-${L}, ${L})$ 上成立。`,
                ),
              ]
            : [
                why(
                  a * x + b,
                  `That puts $x = ${x}$ into the formula, which only holds on $(-${L}, ${L})$.`,
                  `这把 $x = ${x}$ 直接代入式子，而式子只在 $(-${L}, ${L})$ 上成立。`,
                ),
                why(
                  a * (x0 + L * shift) + b,
                  `That shifts by multiples of $${L}$; the period is $${2 * L}$.`,
                  `这按 $${L}$ 的倍数平移；周期是 $${2 * L}$。`,
                ),
              ];
          return numberProblem({
            prompt: t(
              `$f(x) = ${f}$ on $(-${L}, ${L})$ is extended with period $${2 * L}$. To what value does its Fourier series converge at $x = ${x}$?`,
              `$(-${L}, ${L})$ 上的 $f(x) = ${f}$ 以 $${2 * L}$ 为周期延拓。它的傅里叶级数在 $x = ${x}$ 处收敛到什么值？`,
            ),
            answer: ans,
            mistakes: apart(ans, mistakes),
            solution: walked(
              end
                ? [
                    [["Shift into the base interval", "平移到基本区间"], t("", ""), [`${x} ${signed(-2 * L * shift)} = ${L}`]],
                    [
                      ["Average across the meeting point", "在相接处取平均"],
                      t(`At $x = ${L}$ the right end meets the left end of the next copy:`, `在 $x = ${L}$ 处，右端与下一段的左端相接：`),
                      [
                        `f(${L}^{-}) = ${a * L + b}, \\qquad f(-${L}^{+}) = ${-a * L + b}`,
                        `S = \\frac{${a * L + b} + ${par(-a * L + b)}}{2} = ${b}`,
                      ],
                    ],
                  ]
                : [
                    [["Shift into the base interval", "平移到基本区间"], t("", ""), [`${x} ${signed(-2 * L * shift)} = ${x0}`]],
                    [
                      ["Evaluate", "求值"],
                      t(
                        `$x = ${x0}$ is inside $(-${L}, ${L})$, where $f$ is continuous:`,
                        `$x = ${x0}$ 在 $(-${L}, ${L})$ 内部，$f$ 在那里连续：`,
                      ),
                      [`S = f(${x0}) = ${fAt(x0)} = ${ans}`],
                    ],
                  ],
              end
                ? t(
                    `The two one-sided values $${a * L + b}$ and $${-a * L + b}$ lie $${Math.abs(a * L)}$ above and below the middle of the jump, which is $${b}$.`,
                    `两个单侧值 $${a * L + b}$ 与 $${-a * L + b}$ 分别在 $${b}$ 上下 $${Math.abs(a * L)}$ 处，所以 $${b}$ 是跳跃的中点。`,
                  )
                : t(
                    `$${x} - ${par(x0)} = ${x - x0} = ${shift} \\cdot ${2 * L}$, a whole number of periods, so the extension repeats the value at $${x0}$.`,
                    `$${x} - ${par(x0)} = ${x - x0} = ${shift} \\cdot ${2 * L}$，是整数个周期，所以延拓在这里重复 $${x0}$ 处的值。`,
                  ),
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
    intro: t(
      "Take the term $3\\sin 2x$. Differentiating gives $6\\cos 2x$, the coefficient multiplied by $2$; integrating from $0$ to $x$ gives $\\left[-\\frac{3}{2}\\cos 2t\\right]_0^x = \\frac{3}{2} - \\frac{3}{2}\\cos 2x$, the coefficient divided by $2$.\n\nCheck: differentiating $\\frac{3}{2} - \\frac{3}{2}\\cos 2x$ gives $\\frac{3}{2} \\cdot 2\\sin 2x = 3\\sin 2x$ again.\n\nIn this lesson we differentiate and integrate Fourier series term by term and track what happens to each coefficient.",
      "取项 $3\\sin 2x$。求导得 $6\\cos 2x$，系数乘以 $2$；从 $0$ 积分到 $x$ 得 $\\left[-\\frac{3}{2}\\cos 2t\\right]_0^x = \\frac{3}{2} - \\frac{3}{2}\\cos 2x$，系数除以 $2$。\n\n检验：对 $\\frac{3}{2} - \\frac{3}{2}\\cos 2x$ 求导得 $\\frac{3}{2} \\cdot 2\\sin 2x = 3\\sin 2x$，还原了原项。\n\n本课我们对傅里叶级数逐项求导和逐项积分，并跟踪每个系数的变化。",
    ),
    prerequisites: ["convergence-of-fourier-series"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "term-by-term-differentiation-coefficient",
        title: t("Cosine coefficient obtained from term-by-term differentiation", "逐项求导得到的余弦分量系数"),
        explanation: t(
          "Differentiating a sine mode gives a cosine mode multiplied by its frequency, so the coefficients of the derivative are the old ones times the frequency. For $f(x) = b_n \\sin(nx)$, differentiating term-by-term gives $f'(x) = (n b_n) \\cos(nx)$. The coefficient of $\\cos(nx)$ is $n b_n$.\n\n> **Watch out.** The chain rule brings out the frequency. The derivative of $4\\sin 3x$ is $12\\cos 3x$, not $4\\cos 3x$.",
          "对正弦模式求导得到乘以频率的余弦模式，所以导数的系数是原系数乘以频率。对于 $f(x) = b_n \\sin(nx)$，逐项求导得 $f'(x) = (n b_n) \\cos(nx)$。因此 $\\cos(nx)$ 项的系数为 $n b_n$。\n\n> **注意。** 链式法则会带出频率。$4\\sin 3x$ 的导数是 $12\\cos 3x$，不是 $4\\cos 3x$。",
        ),
        generate(rng: Rng): Problem {
          const n = rng.int(2, 8);
          const bn = rng.int(2, 20);
          const ans = n * bn;
          return numberProblem({
            prompt: t(
              `Suppose a signal has the harmonic term $f(x) = ${bn} \\sin ${n}x$. Find the coefficient of $\\cos ${n}x$ in the term-by-term derivative $f'(x)$.`,
              `设信号包含谐波项 $f(x) = ${bn} \\sin ${n}x$。求其逐项导数 $f'(x)$ 中 $\\cos ${n}x$ 项的系数。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(bn, `That leaves out the factor $${n}$ that the chain rule brings.`, `这漏掉了链式法则带出的因子 $${n}$。`),
              why(-ans, "That has the wrong sign: the derivative of $\\sin$ is $+\\cos$.", "符号错了：$\\sin$ 的导数是 $+\\cos$。"),
              why(Q.of(bn, n), `That divides by $${n}$, which is what integrating does.`, `这除以了 $${n}$，那是积分的做法。`),
            ]),
            solution: walked(
              [
                [
                  ["Differentiate", "求导"],
                  t("", ""),
                  [`\\frac{d}{dx}\\left(${bn}\\sin ${n}x\\right) = ${bn} \\cdot ${n}\\cos ${n}x = ${ans}\\cos ${n}x`],
                ],
                [
                  ["Read the coefficient", "读出系数"],
                  t(`The coefficient of $\\cos ${n}x$ is $${ans}$.`, `$\\cos ${n}x$ 的系数为 $${ans}$。`),
                ],
              ],
              t(
                `Integrating back: $\\int ${ans}\\cos ${n}x\\,dx = \\frac{${ans}}{${n}}\\sin ${n}x = ${bn}\\sin ${n}x$, the term we started with.`,
                `积分回去：$\\int ${ans}\\cos ${n}x\\,dx = \\frac{${ans}}{${n}}\\sin ${n}x = ${bn}\\sin ${n}x$，正是原来的项。`,
              ),
            ),
          });
        },
      },
      {
        id: "term-by-term-integration",
        title: t("Term-by-term integration", "逐项积分"),
        explanation: t(
          "Integration is gentler than differentiation: a Fourier series can always be integrated term by term, and each coefficient is divided by $n$. From $0$ to $x$,\n\n$$\\int_{0}^{x} a\\cos nt\\,dt = \\frac{a}{n}\\sin nx, \\qquad \\int_{0}^{x} b\\sin nt\\,dt = \\frac{b}{n} - \\frac{b}{n}\\cos nx.$$\n\nA sine term turns into a cosine term with coefficient $-\\frac{b}{n}$, plus a constant. Dividing by $n$ makes the coefficients shrink faster, which is why integrated series converge better.\n\n> **Watch out.** Integrating $\\sin$ gives $-\\cos$. For $\\int_0^x 6\\sin 3t\\,dt = 2 - 2\\cos 3x$, the coefficient of $\\cos 3x$ is $-2$, not $2$.",
          "积分比求导更温和：傅里叶级数总可以逐项积分，每个系数除以 $n$。从 $0$ 积到 $x$：\n\n$$\\int_{0}^{x} a\\cos nt\\,dt = \\frac{a}{n}\\sin nx, \\qquad \\int_{0}^{x} b\\sin nt\\,dt = \\frac{b}{n} - \\frac{b}{n}\\cos nx.$$\n\n正弦项变成系数为 $-\\frac{b}{n}$ 的余弦项，外加一个常数。除以 $n$ 使系数衰减得更快，所以积分后的级数收敛得更好。\n\n> **注意。** $\\sin$ 的积分是 $-\\cos$。对 $\\int_0^x 6\\sin 3t\\,dt = 2 - 2\\cos 3x$，$\\cos 3x$ 的系数是 $-2$，不是 $2$。",
        ),
        generate(rng: Rng): Problem {
          const n = rng.int(2, 9);
          const c = nz2(rng, 20);
          const sine = rng.bool();
          const ans = Q.of(sine ? -c : c, n);
          const r = Q.of(c, n);
          const term = `${c}\\${sine ? "sin" : "cos"} ${n}t`;
          const target = sine ? `\\cos ${n}x` : `\\sin ${n}x`;
          return numberProblem({
            prompt: t(
              `A Fourier series contains the term $${term}$. Integrating term by term, find the coefficient of $${target}$ that this term contributes to $\\int_{0}^{x} f(t)\\,dt$.`,
              `某傅里叶级数含有项 $${term}$。逐项积分，求该项在 $\\int_{0}^{x} f(t)\\,dt$ 中贡献的 $${target}$ 的系数。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                ans.neg(),
                sine
                  ? "That has the wrong sign: an antiderivative of $\\sin$ is $-\\cos$."
                  : "That has the wrong sign: an antiderivative of $\\cos$ is $+\\sin$.",
                sine ? "符号错了：$\\sin$ 的原函数是 $-\\cos$。" : "符号错了：$\\cos$ 的原函数是 $+\\sin$。",
              ),
              why(
                Q.of(sine ? -c * n : c * n),
                `That multiplies by $${n}$, which is what differentiating does.`,
                `这乘以了 $${n}$，那是求导的做法。`,
              ),
              why(
                Q.of(sine ? -c : c, n * n),
                `That divides by $${n}$ twice; integrating once brings one factor $\\frac{1}{${n}}$.`,
                `这除了两次 $${n}$；积分一次只带来一个因子 $\\frac{1}{${n}}$。`,
              ),
            ]),
            solution: walked(
              sine
                ? [
                    [["Take an antiderivative", "求原函数"], t("", ""), [`\\int ${c}\\sin ${n}t\\,dt = ${coQ(r.neg())}\\cos ${n}t`]],
                    [
                      ["Evaluate from 0 to x", "从 0 到 x 求值"],
                      t("", ""),
                      [
                        `\\left[${coQ(r.neg())}\\cos ${n}t\\right]_0^x = ${r.toLatex()} ${r.sign() < 0 ? "+" : "-"} ${coQ(r.abs())}\\cos ${n}x`,
                      ],
                    ],
                    [
                      ["Read the coefficient", "读出系数"],
                      t(`The coefficient of $\\cos ${n}x$ is $${ans.toLatex()}$.`, `$\\cos ${n}x$ 的系数为 $${ans.toLatex()}$。`),
                    ],
                  ]
                : [
                    [["Take an antiderivative", "求原函数"], t("", ""), [`\\int ${c}\\cos ${n}t\\,dt = ${coQ(r)}\\sin ${n}t`]],
                    [
                      ["Evaluate from 0 to x", "从 0 到 x 求值"],
                      t("The lower limit gives $\\sin 0 = 0$:", "下限给出 $\\sin 0 = 0$："),
                      [`\\left[${coQ(r)}\\sin ${n}t\\right]_0^x = ${coQ(r)}\\sin ${n}x`],
                    ],
                  ],
              t(
                sine
                  ? `Differentiating $${r.toLatex()} ${r.sign() < 0 ? "+" : "-"} ${coQ(r.abs())}\\cos ${n}x$ gives $${r.neg().toLatex()} \\cdot (-${n})\\sin ${n}x = ${c}\\sin ${n}x$, the term we started with.`
                  : `Differentiating $${coQ(r)}\\sin ${n}x$ gives $${r.toLatex()} \\cdot ${n}\\cos ${n}x = ${c}\\cos ${n}x$, the term we started with.`,
                sine
                  ? `对 $${r.toLatex()} ${r.sign() < 0 ? "+" : "-"} ${coQ(r.abs())}\\cos ${n}x$ 求导得 $${r.neg().toLatex()} \\cdot (-${n})\\sin ${n}x = ${c}\\sin ${n}x$，正是原来的项。`
                  : `对 $${coQ(r)}\\sin ${n}x$ 求导得 $${r.toLatex()} \\cdot ${n}\\cos ${n}x = ${c}\\cos ${n}x$，正是原来的项。`,
              ),
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
    intro: t(
      "Take $y'' + 4y = 6\\sin x + 10\\sin 3x$. Each forcing mode gets its own response: $Y_1 = \\frac{6}{4 - 1} = 2$ and $Y_3 = \\frac{10}{4 - 9} = -2$, so $y_p = 2\\sin x - 2\\sin 3x$.\n\nCheck: $y_p'' = -2\\sin x + 18\\sin 3x$, and $y_p'' + 4y_p = 6\\sin x + 10\\sin 3x$.\n\nIn this lesson we find periodic responses to periodic forcing one Fourier mode at a time.",
      "取 $y'' + 4y = 6\\sin x + 10\\sin 3x$。每个激励模式各有自己的响应：$Y_1 = \\frac{6}{4 - 1} = 2$，$Y_3 = \\frac{10}{4 - 9} = -2$，所以 $y_p = 2\\sin x - 2\\sin 3x$。\n\n检验：$y_p'' = -2\\sin x + 18\\sin 3x$，$y_p'' + 4y_p = 6\\sin x + 10\\sin 3x$。\n\n本课我们逐个傅里叶模式地求周期激励下的周期响应。",
    ),
    prerequisites: ["differentiating-and-integrating-fourier-series"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "fourier-mode-amplitude",
        title: t("Fundamental mode response amplitude in driven oscillation", "受迫振荡中的基频响应振幅"),
        explanation: t(
          "Each forcing mode drives a response in the same mode, and its amplitude is the forcing amplitude divided by the difference of the squared frequencies. For $y'' + \\omega_0^2 y = F_1 \\sin x$, substituting the ansatz $y_p(x) = Y_1 \\sin x$ gives $(-1 + \\omega_0^2) Y_1 = F_1$, so $Y_1 = \\frac{F_1}{\\omega_0^2 - 1}$.\n\n> **Watch out.** $y_p''$ contributes $-Y_1\\sin x$, so the factor is $\\omega_0^{2} - 1$, not $\\omega_0^{2}$ or $\\omega_0^{2} + 1$. For $y'' + 9y = 16\\sin x$, $Y_1 = \\frac{16}{8} = 2$.",
          "每个强迫模式都会在同一模式中引起响应，振幅等于强迫振幅除以频率平方之差。对于方程 $y'' + \\omega_0^2 y = F_1 \\sin x$，代入试探解 $y_p(x) = Y_1 \\sin x$ 得到 $(-1 + \\omega_0^2) Y_1 = F_1$，故响应振幅为 $Y_1 = \\frac{F_1}{\\omega_0^2 - 1}$。\n\n> **注意。** $y_p''$ 贡献 $-Y_1\\sin x$，所以因子是 $\\omega_0^{2} - 1$，不是 $\\omega_0^{2}$ 或 $\\omega_0^{2} + 1$。对 $y'' + 9y = 16\\sin x$，$Y_1 = \\frac{16}{8} = 2$。",
        ),
        generate(rng: Rng): Problem {
          const omega0 = rng.int(2, 8);
          const ans = rng.int(2, 35);
          const w2 = omega0 * omega0;
          const denom = w2 - 1;
          const F1 = ans * denom;
          return numberProblem({
            prompt: t(
              `Find the amplitude $Y_1$ of the steady periodic response $y_p(x) = Y_1 \\sin x$ to the driven differential equation $y'' + ${w2}y = ${F1} \\sin x$.`,
              `求受迫微分方程 $y'' + ${w2}y = ${F1} \\sin x$ 的周期稳态响应 $y_p(x) = Y_1 \\sin x$ 的振幅 $Y_1$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                Q.of(F1, w2),
                `That leaves out $y_p''$, which contributes $-Y_1\\sin x$; the factor is $${w2} - 1$.`,
                `这漏掉了 $y_p''$，它贡献 $-Y_1\\sin x$；因子是 $${w2} - 1$。`,
              ),
              why(
                Q.of(F1, w2 + 1),
                `That has the wrong sign: $(\\sin x)'' = -\\sin x$, so the factor is $${w2} - 1$, not $${w2} + 1$.`,
                `符号错了：$(\\sin x)'' = -\\sin x$，所以因子是 $${w2} - 1$，不是 $${w2} + 1$。`,
              ),
              why(F1, "That is the forcing amplitude; it still has to be divided by the factor.", "这是激励振幅；还要除以因子。"),
            ]),
            solution: walked(
              [
                [
                  ["Substitute the trial solution", "代入试探解"],
                  t("", ""),
                  [`y_p'' + ${w2}y_p = -Y_1\\sin x + ${w2}Y_1\\sin x = ${denom}Y_1\\sin x`],
                ],
                [["Match the forcing", "与激励比较"], t("", ""), [`${denom}Y_1 = ${F1} \\implies Y_1 = \\frac{${F1}}{${denom}} = ${ans}`]],
              ],
              t(
                `With $y_p = ${ans}\\sin x$: $y_p'' + ${w2}y_p = -${ans}\\sin x + ${w2 * ans}\\sin x = ${F1}\\sin x$.`,
                `取 $y_p = ${ans}\\sin x$：$y_p'' + ${w2}y_p = -${ans}\\sin x + ${w2 * ans}\\sin x = ${F1}\\sin x$。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-response-to-a-square-wave",
        title: t("The response to a square wave", "对方波的响应"),
        explanation: t(
          "A periodic force that is not a single sine is first expanded in its Fourier series, and then each harmonic is answered separately. The square wave of height $1$ is\n\n$$f(x) = \\frac{4}{\\pi}\\sum_{n \\text{ odd}} \\frac{\\sin nx}{n},$$\n\nso the steady response of $y'' + \\omega_0^{2}y = f(x)$ is $\\sum Y_n\\sin nx$ with\n\n$$Y_n = \\frac{4}{\\pi n\\left(\\omega_0^{2} - n^{2}\\right)} \\quad (n \\text{ odd}).$$\n\nA harmonic with $n$ close to $\\omega_0$ has a small denominator and dominates the response, even if its forcing coefficient is small.\n\n> **Watch out.** Keep the $\\frac{1}{n}$ of the square wave's own coefficient. For $y'' + 2y = f(x)$, $Y_3 = \\frac{4}{3 \\cdot (2 - 9)\\pi} = -\\frac{4}{21\\pi}$, not $\\frac{4}{(2 - 9)\\pi} = -\\frac{4}{7\\pi}$.",
          "不是单一正弦的周期外力，先展开为傅里叶级数，再对每个谐波分别求响应。高度为 $1$ 的方波为\n\n$$f(x) = \\frac{4}{\\pi}\\sum_{n \\text{ 为奇数}} \\frac{\\sin nx}{n},$$\n\n所以 $y'' + \\omega_0^{2}y = f(x)$ 的稳态响应为 $\\sum Y_n\\sin nx$，其中\n\n$$Y_n = \\frac{4}{\\pi n\\left(\\omega_0^{2} - n^{2}\\right)} \\quad (n \\text{ 为奇数}).$$\n\n$n$ 接近 $\\omega_0$ 的谐波分母很小，即使其激励系数很小，也会主导响应。\n\n> **注意。** 要保留方波自身系数中的 $\\frac{1}{n}$。对 $y'' + 2y = f(x)$，$Y_3 = \\frac{4}{3 \\cdot (2 - 9)\\pi} = -\\frac{4}{21\\pi}$，不是 $\\frac{4}{(2 - 9)\\pi} = -\\frac{4}{7\\pi}$。",
        ),
        generate(rng: Rng): Problem {
          const w = rng.pick([2, 3, 5, 6, 7, 8, 10, 11, 12, 15, 17]);
          const n = rng.pick([1, 3, 5]);
          const d = w - n * n;
          const ans = Q.of(4, n * d);
          const Fn = Q.of(4, n);
          const nx = mx(n);
          return numberProblem({
            prompt: t(
              `The square wave $f(x) = \\frac{4}{\\pi}\\left(\\sin x + \\frac{\\sin 3x}{3} + \\frac{\\sin 5x}{5} + \\cdots\\right)$ drives $y'' + ${w}y = f(x)$. The steady response has the term $Y_{${n}}\\sin ${nx}$ with $Y_{${n}} = \\frac{K}{\\pi}$. Find $K$.`,
              `方波 $f(x) = \\frac{4}{\\pi}\\left(\\sin x + \\frac{\\sin 3x}{3} + \\frac{\\sin 5x}{5} + \\cdots\\right)$ 驱动 $y'' + ${w}y = f(x)$。稳态响应中含有项 $Y_{${n}}\\sin ${nx}$，且 $Y_{${n}} = \\frac{K}{\\pi}$。求 $K$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                Q.of(4, d),
                `That drops the $\\frac{1}{${n}}$ in the forcing coefficient $\\frac{4}{${n}\\pi}$.`,
                `这丢掉了激励系数 $\\frac{4}{${n}\\pi}$ 中的 $\\frac{1}{${n}}$。`,
              ),
              why(
                Q.of(4, n * (w + n * n)),
                `That has the wrong sign: $(\\sin ${nx})'' = -${n * n}\\sin ${nx}$, so the factor is $${w} - ${n * n}$.`,
                `符号错了：$(\\sin ${nx})'' = -${n * n}\\sin ${nx}$，所以因子是 $${w} - ${n * n}$。`,
              ),
              why(
                Q.of(4, -n * d),
                `That takes the factor as $${n * n} - ${w}$; it is $\\omega_0^{2} - n^{2} = ${w} - ${n * n}$.`,
                `这把因子当成 $${n * n} - ${w}$；它是 $\\omega_0^{2} - n^{2} = ${w} - ${n * n}$。`,
              ),
            ]),
            solution: walked(
              [
                [["Read the forcing coefficient", "读出激励系数"], t("", ""), [`F_{${n}} = ${overPi(Fn)}`]],
                [
                  ["Substitute the mode", "代入该模式"],
                  t(
                    `For $Y_{${n}}\\sin ${nx}$ the second derivative contributes $-${n * n}Y_{${n}}$:`,
                    `对 $Y_{${n}}\\sin ${nx}$，二阶导数贡献 $-${n * n}Y_{${n}}$：`,
                  ),
                  [`(${w} - ${n * n})Y_{${n}} = ${overPi(Fn)} \\implies Y_{${n}} = ${overPi(ans)}`, `K = ${ans.toLatex()}`],
                ],
              ],
              t(
                `Multiplying back: $${d} \\cdot ${wrap(overPi(ans))} = ${overPi(Fn)}$, the forcing coefficient of $\\sin ${nx}$.`,
                `乘回去：$${d} \\cdot ${wrap(overPi(ans))} = ${overPi(Fn)}$，正是 $\\sin ${nx}$ 的激励系数。`,
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
    intro: t(
      "Take $y'' + 4y = 3\\sin t$ with $y(0) = 0$ and $y'(0) = 0$. The forced response is $\\sin t$, since $(4 - 1)Y = 3$; adding free oscillations gives $y = \\sin t + c_1\\cos 2t + c_2\\sin 2t$. Then $y(0) = c_1 = 0$ and $y'(0) = 1 + 2c_2 = 0$, so $c_2 = -\\frac{1}{2}$.\n\nCheck: $y = \\sin t - \\frac{1}{2}\\sin 2t$ has $y(0) = 0$ and $y'(0) = 1 - 1 = 0$.\n\nIn this lesson we combine a Fourier particular solution with the free oscillations to meet initial conditions.",
      "取 $y'' + 4y = 3\\sin t$，$y(0) = 0$，$y'(0) = 0$。受迫响应为 $\\sin t$，因为 $(4 - 1)Y = 3$；加上自由振动得 $y = \\sin t + c_1\\cos 2t + c_2\\sin 2t$。于是 $y(0) = c_1 = 0$，$y'(0) = 1 + 2c_2 = 0$，所以 $c_2 = -\\frac{1}{2}$。\n\n检验：$y = \\sin t - \\frac{1}{2}\\sin 2t$ 满足 $y(0) = 0$，$y'(0) = 1 - 1 = 0$。\n\n本课我们把傅里叶特解与自由振动结合，使解满足初始条件。",
    ),
    prerequisites: ["solving-odes-using-fourier-series"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "fourier-ivp-constant-determination",
        title: t("Determining homogeneous coefficient in a driven IVP", "确定受迫初值问题中的齐次项系数"),
        explanation: t(
          "The particular solution handles the forcing, and the initial conditions then fix the coefficients of the homogeneous part of the solution. For $y'' + \\omega_0^2 y = F(t)$ with a particular solution satisfying $y_p(0) = 0$, the general solution is $y(t) = y_p(t) + c_1 \\cos(\\omega_0 t) + c_2 \\sin(\\omega_0 t)$. Setting $t = 0$ yields $y(0) = c_1 = y_0$. Differentiating and setting $t = 0$ yields $y'(0) = y_p'(0) + \\omega_0 c_2$.\n\n> **Watch out.** $y_p(0) = 0$ does not mean $y_p'(0) = 0$. With $y_p = \\sin t$ and $\\omega_0 = 2$, $y'(0) = 5$ gives $1 + 2c_2 = 5$, so $c_2 = 2$, not $\\frac{5}{2}$.",
          "特解处理强迫项，再由初始条件确定解中齐次部分的系数。对于包含满足 $y_p(0) = 0$ 的特解的方程 $y'' + \\omega_0^2 y = F(t)$，通解为 $y(t) = y_p(t) + c_1 \\cos(\\omega_0 t) + c_2 \\sin(\\omega_0 t)$。在 $t = 0$ 处代入即得 $y(0) = c_1 = y_0$。求导后令 $t = 0$ 得 $y'(0) = y_p'(0) + \\omega_0 c_2$。\n\n> **注意。** $y_p(0) = 0$ 并不意味着 $y_p'(0) = 0$。取 $y_p = \\sin t$，$\\omega_0 = 2$，由 $y'(0) = 5$ 得 $1 + 2c_2 = 5$，所以 $c_2 = 2$，不是 $\\frac{5}{2}$。",
        ),
        generate(rng: Rng): Problem {
          const omega0 = rng.int(2, 6);
          const w2 = omega0 * omega0;
          const p = rng.nonZero(-6, 8);
          const ans = rng.nonZero(-6, 8);
          const v = 1 + omega0 * ans;
          return numberProblem({
            prompt: t(
              `A driven oscillator satisfies $y'' + ${w2}y = ${w2 - 1}\\sin t$ with initial conditions $y(0) = ${p}$ and $y'(0) = ${v}$. In the solution $y(t) = y_p(t) + c_1 \\cos ${omega0}t + c_2 \\sin ${omega0}t$, where $y_p(t) = \\sin t$, find the coefficient $c_2$.`,
              `受迫振子满足 $y'' + ${w2}y = ${w2 - 1}\\sin t$，初始条件为 $y(0) = ${p}$ 与 $y'(0) = ${v}$。在解 $y(t) = y_p(t) + c_1 \\cos ${omega0}t + c_2 \\sin ${omega0}t$（其中特解为 $y_p(t) = \\sin t$）中，求系数 $c_2$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                Q.of(v, omega0),
                `That forgets the slope of $y_p = \\sin t$, which is $1$ at $t = 0$.`,
                `这忘了 $y_p = \\sin t$ 的斜率，它在 $t = 0$ 处为 $1$。`,
              ),
              why(
                Q.of(v),
                `That takes $c_2$ as $y'(0)$; the free term contributes $${omega0}c_2$, and $y_p$ contributes $1$.`,
                `这把 $c_2$ 当成 $y'(0)$；自由项贡献 $${omega0}c_2$，$y_p$ 贡献 $1$。`,
              ),
              why(Q.of(p), "That is $c_1$, fixed by $y(0)$; $c_2$ comes from $y'(0)$.", "这是由 $y(0)$ 确定的 $c_1$；$c_2$ 来自 $y'(0)$。"),
              why(Q.of(v + 1, omega0), "That adds the slope of $y_p$ instead of subtracting it.", "这把 $y_p$ 的斜率加上了，应该减去。"),
            ]),
            solution: walked(
              [
                [["Differentiate", "求导"], t("", ""), [`y'(t) = \\cos t - ${omega0}c_1\\sin ${omega0}t + ${omega0}c_2\\cos ${omega0}t`]],
                [
                  ["Put in t = 0", "代入 t = 0"],
                  t("", ""),
                  [`y'(0) = 1 + ${omega0}c_2 = ${v}`, `c_2 = \\frac{${v} - 1}{${omega0}} = ${ans}`],
                ],
              ],
              t(
                `With $c_2 = ${ans}$ the slope at $0$ is $1 + ${omega0} \\cdot ${par(ans)} = ${v}$, as required, and $c_1 = ${p}$ takes care of $y(0)$ separately.`,
                `取 $c_2 = ${ans}$，$t = 0$ 处的斜率为 $1 + ${omega0} \\cdot ${par(ans)} = ${v}$，符合要求；$c_1 = ${p}$ 单独满足 $y(0)$。`,
              ),
            ),
          });
        },
      },
      {
        id: "starting-from-rest",
        title: t("Starting from rest", "从静止开始"),
        explanation: t(
          "A driven oscillator that starts at rest, $y(0) = 0$ and $y'(0) = 0$, still needs free oscillations to cancel the slope of the forced response. For $y'' + \\omega_0^{2}y = F\\sin nt$ with $n \\ne \\omega_0$:\n\n$$y = Y\\sin nt + c_1\\cos\\omega_0 t + c_2\\sin\\omega_0 t, \\qquad Y = \\frac{F}{\\omega_0^{2} - n^{2}}.$$\n\n$y(0) = 0$ gives $c_1 = 0$, and $y'(0) = nY + \\omega_0c_2 = 0$ gives $c_2 = -\\frac{nY}{\\omega_0}$. The motion mixes the driving frequency with the natural one.\n\n> **Watch out.** Starting from rest does not make $c_2$ zero: the forced response already moves at $t = 0$. For $y'' + 4y = 3\\sin t$, $Y = 1$ and $c_2 = -\\frac{1}{2}$.",
          "从静止开始（$y(0) = 0$，$y'(0) = 0$）的受迫振子，仍需要自由振动来抵消受迫响应的初始斜率。对 $y'' + \\omega_0^{2}y = F\\sin nt$（$n \\ne \\omega_0$）：\n\n$$y = Y\\sin nt + c_1\\cos\\omega_0 t + c_2\\sin\\omega_0 t, \\qquad Y = \\frac{F}{\\omega_0^{2} - n^{2}}.$$\n\n由 $y(0) = 0$ 得 $c_1 = 0$，由 $y'(0) = nY + \\omega_0c_2 = 0$ 得 $c_2 = -\\frac{nY}{\\omega_0}$。运动是驱动频率与固有频率的混合。\n\n> **注意。** 从静止开始并不使 $c_2$ 为零：受迫响应在 $t = 0$ 时已经在运动。对 $y'' + 4y = 3\\sin t$，$Y = 1$，$c_2 = -\\frac{1}{2}$。",
        ),
        generate(rng: Rng): Problem {
          const w = rng.int(2, 6);
          const n = rng.pick([1, 2, 3, 4, 5, 7].filter((m) => m !== w));
          const Y = rng.nonZero(-6, 6);
          const F = Y * (w * w - n * n);
          const c2 = Q.of(-n * Y, w);
          const nt = mx(n, "t");
          const nY = n === 1 ? "Y" : `${n}Y`;
          return numberProblem({
            prompt: t(
              `Solve $y'' + ${w * w}y = ${F}\\sin ${nt}$ with $y(0) = 0$ and $y'(0) = 0$, writing $y = Y\\sin ${nt} + c_1\\cos ${w}t + c_2\\sin ${w}t$. Find $c_2$.`,
              `求解 $y'' + ${w * w}y = ${F}\\sin ${nt}$，$y(0) = 0$，$y'(0) = 0$，写成 $y = Y\\sin ${nt} + c_1\\cos ${w}t + c_2\\sin ${w}t$。求 $c_2$。`,
            ),
            answer: c2,
            mistakes: apart(c2, [
              why(
                c2.neg(),
                "That has the wrong sign: the free term must cancel the slope of the forced one.",
                "符号错了：自由项必须抵消受迫项的斜率。",
              ),
              why(
                Q.of(-Y),
                `That leaves out the ratio $\\frac{${n}}{${w}}$ of the two frequencies.`,
                `这漏掉了两个频率之比 $\\frac{${n}}{${w}}$。`,
              ),
              why(
                Q.of(-w * Y, n),
                `That turns the ratio of frequencies upside down; it is $\\frac{${n}}{${w}}$.`,
                `这把频率之比颠倒了；应为 $\\frac{${n}}{${w}}$。`,
              ),
              why(
                Q.zero,
                "Starting from rest does not make $c_2$ zero: the forced response already has a slope at $t = 0$.",
                "从静止开始并不使 $c_2$ 为零：受迫响应在 $t = 0$ 时已有斜率。",
              ),
            ]),
            solution: walked(
              [
                [["Find the forced amplitude", "求受迫振幅"], t("", ""), [`Y = \\frac{${F}}{${w * w} - ${n * n}} = ${Y}`]],
                [["Use the initial value", "使用初始值"], t("", ""), ["y(0) = c_1 = 0"]],
                [
                  ["Use the initial slope", "使用初始斜率"],
                  t("", ""),
                  [`y'(0) = ${nY} + ${w}c_2 = ${n * Y} + ${w}c_2 = 0 \\implies c_2 = ${c2.toLatex()}`],
                ],
              ],
              t(
                `The two slopes at $t = 0$ cancel: $${n} \\cdot ${par(Y)} + ${w} \\cdot ${wrap(c2.toLatex())} = ${n * Y} ${signed(-n * Y)} = 0$.`,
                `$t = 0$ 时两部分斜率抵消：$${n} \\cdot ${par(Y)} + ${w} \\cdot ${wrap(c2.toLatex())} = ${n * Y} ${signed(-n * Y)} = 0$。`,
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
    intro: t(
      "Take $-y'' = 8\\sin 2x$ on $[0, \\pi]$ with $y(0) = y(\\pi) = 0$. Trying $y = Y\\sin 2x$ gives $-y'' = 4Y\\sin 2x$, so $4Y = 8$ and $y = 2\\sin 2x$.\n\nCheck: $-(2\\sin 2x)'' = 8\\sin 2x$, and $\\sin 0 = \\sin 2\\pi = 0$, so both ends hold.\n\nIn this lesson we solve boundary value problems by expanding the source in sine modes, each of which already vanishes at both ends.",
      "取 $[0, \\pi]$ 上的 $-y'' = 8\\sin 2x$，$y(0) = y(\\pi) = 0$。试 $y = Y\\sin 2x$ 得 $-y'' = 4Y\\sin 2x$，所以 $4Y = 8$，$y = 2\\sin 2x$。\n\n检验：$-(2\\sin 2x)'' = 8\\sin 2x$，且 $\\sin 0 = \\sin 2\\pi = 0$，两端条件都成立。\n\n本课我们把源项展开为正弦模式来求解边值问题，每个正弦模式在两端本来就为零。",
    ),
    prerequisites: ["solving-ivps-using-fourier-series"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "fourier-bvp-sine-expansion",
        title: t("Sine mode amplitude in a Poisson-type BVP", "泊松型边值问题中的正弦模态振幅"),
        explanation: t(
          "A sine mode already vanishes at both ends, so substituting it reduces the boundary value problem to finding a single amplitude. For $-y'' = F_m \\sin(mx)$ on $[0, \\pi]$ with $y(0) = 0$ and $y(\\pi) = 0$, substituting $y(x) = Y_m \\sin(mx)$ yields $m^2 Y_m = F_m$, so $Y_m = \\frac{F_m}{m^2}$.\n\n> **Watch out.** Two derivatives bring out $m^{2}$, not $m$. For $-y'' = 18\\sin 3x$, $Y_3 = \\frac{18}{9} = 2$, not $\\frac{18}{3} = 6$.",
          "正弦模式在两端本来就为零，所以代入后边值问题就简化为求一个振幅。对于定义在 $[0, \\pi]$ 上的边值问题 $-y'' = F_m \\sin(mx)$（边界条件 $y(0) = 0$，$y(\\pi) = 0$），代入 $y(x) = Y_m \\sin(mx)$ 得 $m^2 Y_m = F_m$，因此响应振幅为 $Y_m = \\frac{F_m}{m^2}$。\n\n> **注意。** 求两次导带出的是 $m^{2}$，不是 $m$。对 $-y'' = 18\\sin 3x$，$Y_3 = \\frac{18}{9} = 2$，不是 $\\frac{18}{3} = 6$。",
        ),
        generate(rng: Rng): Problem {
          const m = rng.int(2, 6);
          const ans = rng.int(2, 35);
          const mSq = m * m;
          const Fm = ans * mSq;
          return numberProblem({
            prompt: t(
              `Solve the Dirichlet boundary value problem $-y'' = ${Fm} \\sin ${m}x$ on $[0, \\pi]$ with $y(0) = 0$ and $y(\\pi) = 0$. Find the amplitude $Y_{${m}}$ of the solution $y(x) = Y_{${m}} \\sin ${m}x$.`,
              `求解定义在 $[0, \\pi]$ 上的狄利克雷边值问题 $-y'' = ${Fm} \\sin ${m}x$，边界条件为 $y(0) = 0$ 与 $y(\\pi) = 0$。求正弦响应解 $y(x) = Y_{${m}} \\sin ${m}x$ 的振幅 $Y_{${m}}$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                ans * m,
                `That divides by $${m}$ once; two derivatives bring out $${m}^{2} = ${mSq}$.`,
                `这只除了一次 $${m}$；求两次导带出 $${m}^{2} = ${mSq}$。`,
              ),
              why(Fm, "That is the source amplitude; it still has to be divided by $m^{2}$.", "这是源项振幅；还要除以 $m^{2}$。"),
              why(-ans, "That has the wrong sign: $-y''$ is $+m^{2}Y\\sin mx$.", "符号错了：$-y''$ 等于 $+m^{2}Y\\sin mx$。"),
            ]),
            solution: walked(
              [
                [["Substitute the mode", "代入该模式"], t("", ""), [`y = Y_{${m}}\\sin ${m}x, \\qquad -y'' = ${mSq}Y_{${m}}\\sin ${m}x`]],
                [
                  ["Match the source", "与源项比较"],
                  t("", ""),
                  [`${mSq}Y_{${m}} = ${Fm} \\implies Y_{${m}} = \\frac{${Fm}}{${mSq}} = ${ans}`],
                ],
              ],
              t(
                `$-(${ans}\\sin ${m}x)'' = ${ans} \\cdot ${mSq}\\sin ${m}x = ${Fm}\\sin ${m}x$, and $\\sin 0 = \\sin ${m}\\pi = 0$, so both boundary conditions hold.`,
                `$-(${ans}\\sin ${m}x)'' = ${ans} \\cdot ${mSq}\\sin ${m}x = ${Fm}\\sin ${m}x$，且 $\\sin 0 = \\sin ${m}\\pi = 0$，两个边界条件都成立。`,
              ),
            ),
          });
        },
      },
      {
        id: "values-of-a-two-mode-solution",
        title: t("Values of a two-mode solution", "双模式解的取值"),
        explanation: t(
          "When the source of $-y'' = f(x)$ on $[0, \\pi]$ with $y(0) = y(\\pi) = 0$ is a sum of sine modes, each mode is solved on its own: $-y'' = F_m\\sin mx$ has $y = \\frac{F_m}{m^{2}}\\sin mx$, and the solution is the sum\n\n$$y(x) = \\sum \\frac{F_m}{m^{2}}\\sin mx.$$\n\nTo evaluate it at the midpoint use $\\sin\\frac{m\\pi}{2} = 1, 0, -1, 0, \\dots$ for $m = 1, 2, 3, 4, \\dots$. For $f = 9\\sin x + 18\\sin 3x$: $y = 9\\sin x + 2\\sin 3x$ and $y\\left(\\frac{\\pi}{2}\\right) = 9 - 2 = 7$.\n\n> **Watch out.** Not every mode is $1$ at the midpoint. In the example, adding the amplitudes gives $9 + 2 = 11$, but $\\sin\\frac{3\\pi}{2} = -1$, so the value is $7$; an even mode such as $\\sin 2x$ adds nothing there.",
          "当 $[0, \\pi]$ 上 $-y'' = f(x)$（$y(0) = y(\\pi) = 0$）的源项是若干正弦模式之和时，每个模式分别求解：$-y'' = F_m\\sin mx$ 的解为 $y = \\frac{F_m}{m^{2}}\\sin mx$，总解为它们的和\n\n$$y(x) = \\sum \\frac{F_m}{m^{2}}\\sin mx.$$\n\n在中点求值时，对 $m = 1, 2, 3, 4, \\dots$ 用 $\\sin\\frac{m\\pi}{2} = 1, 0, -1, 0, \\dots$。例如 $f = 9\\sin x + 18\\sin 3x$：$y = 9\\sin x + 2\\sin 3x$，$y\\left(\\frac{\\pi}{2}\\right) = 9 - 2 = 7$。\n\n> **注意。** 并非每个模式在中点处都等于 $1$。上例中把振幅相加得 $9 + 2 = 11$，但 $\\sin\\frac{3\\pi}{2} = -1$，所以值为 $7$；像 $\\sin 2x$ 这样的偶数模式在那里没有贡献。",
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
          const A1 = nz2(rng, 6);
          const A2 = nz2(rng, 6);
          const F1 = A1 * m1 * m1;
          const F2 = A2 * m2 * m2;
          const s = (m: number) => [0, 1, 0, -1][m % 4] ?? 0;
          const ans = A1 * s(m1) + A2 * s(m2);
          const f = `${F1}\\sin ${mx(m1)} ${F2 < 0 ? "-" : "+"} ${Math.abs(F2)}\\sin ${mx(m2)}`;
          const y = `${A1}\\sin ${mx(m1)} ${A2 < 0 ? "-" : "+"} ${Math.abs(A2)}\\sin ${mx(m2)}`;
          const half = (m: number) => piFrac(Q.of(m, 2));
          return numberProblem({
            prompt: t(
              `Solve $-y'' = ${f}$ on $[0, \\pi]$ with $y(0) = y(\\pi) = 0$, and find $y\\left(\\frac{\\pi}{2}\\right)$.`,
              `求解 $[0, \\pi]$ 上的 $-y'' = ${f}$，$y(0) = y(\\pi) = 0$，并求 $y\\left(\\frac{\\pi}{2}\\right)$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                F1 * s(m1) + F2 * s(m2),
                "That evaluates the source, not the solution; each mode must first be divided by $m^{2}$.",
                "这求的是源项的值，不是解的值；每个模式要先除以 $m^{2}$。",
              ),
              why(
                A1 + A2,
                "That adds the amplitudes as if every sine were $1$ at the midpoint; $\\sin\\frac{m\\pi}{2}$ is $1$, $0$ or $-1$.",
                "这把振幅直接相加，好像每个正弦在中点都等于 $1$；$\\sin\\frac{m\\pi}{2}$ 可能是 $1$、$0$ 或 $-1$。",
              ),
              why(
                -ans,
                "That has the wrong sign: $-y'' = m^{2}Y\\sin mx$ makes each amplitude the same sign as its source.",
                "符号错了：$-y'' = m^{2}Y\\sin mx$ 使每个振幅与其源项同号。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Solve each mode", "逐个模式求解"],
                  t("Each source coefficient is divided by $m^{2}$:", "每个源项系数除以 $m^{2}$："),
                  [
                    `${m1 === 1 ? `Y_{1} = ${A1}` : `Y_{${m1}} = \\frac{${F1}}{${m1 * m1}} = ${A1}`}, \\qquad Y_{${m2}} = \\frac{${F2}}{${m2 * m2}} = ${A2}`,
                    `y = ${y}`,
                  ],
                ],
                [
                  ["Evaluate at the midpoint", "在中点求值"],
                  t("", ""),
                  [
                    `\\sin ${half(m1)} = ${s(m1)}, \\qquad \\sin ${half(m2)} = ${s(m2)}`,
                    `y\\left(\\frac{\\pi}{2}\\right) = ${A1} \\cdot ${par(s(m1))} + ${par(A2)} \\cdot ${par(s(m2))} = ${ans}`,
                  ],
                ],
              ],
              t(
                `$-y'' = ${A1 * m1 * m1}\\sin ${mx(m1)} ${F2 < 0 ? "-" : "+"} ${Math.abs(F2)}\\sin ${mx(m2)}$ gives back the source, and every $\\sin mx$ vanishes at $0$ and $\\pi$.`,
                `$-y'' = ${A1 * m1 * m1}\\sin ${mx(m1)} ${F2 < 0 ? "-" : "+"} ${Math.abs(F2)}\\sin ${mx(m2)}$ 还原出源项，而每个 $\\sin mx$ 在 $0$ 和 $\\pi$ 处都为零。`,
              ),
            ),
          });
        },
      },
    ],
  },
];
