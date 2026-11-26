import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { poly, Q } from "@ga/subject-math";
import { choiceProblem, numberProblem, why, yesNo } from "../problems.ts";
import { reasoned } from "../wrong-reasons.ts";
import { walked } from "./calculus-i-differentiation.ts";

/** par writes a negative number in parentheses. */
const par = (n: number): string => (n < 0 ? `(${n})` : String(n));

/** signed writes a number as a signed term: "+ 3" or "- 3". */
const signed = (n: number): string => (n < 0 ? `- ${-n}` : `+ ${n}`);

/** signedQ writes a rational number as a signed term: "+ \frac{1}{2}" or "- \frac{1}{2}". */
const signedQ = (q: Q): string => (q.sign() < 0 ? `- ${q.neg().toLatex()}` : `+ ${q.toLatex()}`);

/** Mistake is a wrong value with what to say about it. */
type Mistake = { readonly value: number | Q; readonly why: Text };

/** apart drops the mistakes whose value is the answer or repeats an earlier one. */
const apart = (answer: number | Q, mistakes: readonly Mistake[]): Mistake[] => {
  const key = (v: number | Q) => (typeof v === "number" ? Q.of(v) : v).toLatex();
  return mistakes.filter((m, i, all) => key(m.value) !== key(answer) && all.findIndex((x) => key(x.value) === key(m.value)) === i);
};

/** Pythagorean triples for clean magnitudes. */
const pythagoreanTriples = [
  [3, 4, 5],
  [4, 3, 5],
  [5, 12, 13],
  [12, 5, 13],
  [6, 8, 10],
  [8, 6, 10],
  [8, 15, 17],
  [15, 8, 17],
  [7, 24, 25],
  [24, 7, 25],
  [9, 12, 15],
  [12, 9, 15],
] as const;

// ---------------------------------------------------------------------------
// 1.1 Techniques for Solving First-Order ODEs
// ---------------------------------------------------------------------------

/** introductionToFirstOrderLinearOdes defines standard linear form y' + P(x)y = Q(x). */
export const introductionToFirstOrderLinearOdes: TopicDef = {
  id: "introduction-to-first-order-linear-odes",
  title: t("Introduction to First-Order Linear ODEs", "一阶线性常微分方程简介"),
  summary: t(
    "A first-order differential equation is linear if it can be written as y' + P(x)y = Q(x); it is homogeneous when Q(x) = 0.",
    "一阶常微分方程若能写成 y' + P(x)y = Q(x) 的形式则为线性方程；当 Q(x) = 0 时为齐次方程。",
  ),
  intro: t(
    "Put $2xy' + 6y = 4x^{2}$ in standard form. The unknown $y$ and its derivative appear only to the first power, so the equation is linear. Divide every term by the coefficient $2x$ of $y'$: $y' + \\frac{3}{x}y = 2x$. So $P(x) = \\frac{3}{x}$ and $Q(x) = 2x$.\n\nCheck: multiplying $y' + \\frac{3}{x}y = 2x$ back by $2x$ gives $2xy' + 6y = 4x^{2}$, the equation we started from.\n\nIn this lesson we recognise linear first-order equations, divide them into the standard form $y' + P(x)y = Q(x)$, and read off $P$ and $Q$.",
    "把 $2xy' + 6y = 4x^{2}$ 化为标准形式。未知函数 $y$ 及其导数都只以一次幂出现，所以方程是线性的。每一项都除以 $y'$ 的系数 $2x$：$y' + \\frac{3}{x}y = 2x$。所以 $P(x) = \\frac{3}{x}$，$Q(x) = 2x$。\n\n检验：把 $y' + \\frac{3}{x}y = 2x$ 再乘以 $2x$，得 $2xy' + 6y = 4x^{2}$，正是原方程。\n\n本课我们识别一阶线性方程，把它们除成标准形式 $y' + P(x)y = Q(x)$，并读出 $P$ 与 $Q$。",
  ),
  prerequisites: ["solving-first-order-odes-using-separation-of-variables"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "identifying-and-standardizing-first-order-linear-odes",
      title: t("Identifying and standardizing first-order linear ODEs", "识别一阶线性常微分方程并化为标准形式"),
      explanation: t(
        "A first order equation is linear when the unknown function and its derivative appear only to the first power, and dividing by the leading coefficient puts it in standard form. Dividing $a x y' + b y = c x^m$ by $a x$ yields standard form $y' + \\frac{b}{a x}y = \\frac{c}{a}x^{m-1}$, where the coefficient function is $P(x) = \\frac{b}{a x}$. For example, $3xy' + 6y = x^{2}$ becomes $y' + \\frac{2}{x}y = \\frac{x}{3}$, so $P(x) = \\frac{2}{x}$ and $P(2) = 1$.\n\n> **Watch out.** Divide by the whole leading coefficient $ax$, not by $x$ alone or by $a$ alone: $P(x) = \\frac{b}{ax}$, which still depends on $x$.",
        "当未知函数及其导数都只以一次幂出现时，一阶方程是线性的；除以首项系数就化为标准形式。将方程 $a x y' + b y = c x^m$ 两端同除以 $a x$ 可化为标准形式 $y' + \\frac{b}{a x}y = \\frac{c}{a}x^{m-1}$，其中系数函数为 $P(x) = \\frac{b}{a x}$。例如 $3xy' + 6y = x^{2}$ 化为 $y' + \\frac{2}{x}y = \\frac{x}{3}$，所以 $P(x) = \\frac{2}{x}$，$P(2) = 1$。\n\n> **注意。** 要除以整个首项系数 $ax$，而不是只除以 $x$ 或只除以 $a$：$P(x) = \\frac{b}{ax}$，它仍然依赖于 $x$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 6);
        const b = rng.int(2, 9);
        const x0 = rng.int(1, 6);
        const c = rng.int(1, 8);
        const ans = Q.of(b, a * x0);
        const ax = poly([a, "x"]);
        return numberProblem({
          prompt: t(
            `Convert the differential equation $(${ax})y' + ${poly([b, "y"])} = ${poly([c, "x^2"])}$ into standard form $y' + P(x)y = Q(x)$, and evaluate $P(${x0})$.`,
            `将微分方程 $(${ax})y' + ${poly([b, "y"])} = ${poly([c, "x^2"])}$ 化为标准形式 $y' + P(x)y = Q(x)$，并计算 $P(${x0})$ 的值。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              Q.of(a, b * x0),
              "That divides the leading coefficient by the coefficient of $y$; $P$ is the coefficient of $y$ divided by the leading coefficient.",
              "这是用首项系数除以 $y$ 的系数；$P$ 应是 $y$ 的系数除以首项系数。",
            ),
            why(
              Q.of(b, x0),
              `That divides only by $x$; the leading coefficient is $${ax}$, so the factor $${a}$ must be divided out too.`,
              `这里只除以了 $x$；首项系数是 $${ax}$，还要除去因子 $${a}$。`,
            ),
            why(
              Q.of(b, a),
              "That drops the $x$ from the leading coefficient; $P(x)$ still has $x$ in its denominator, so substitute the given $x$.",
              "这里丢掉了首项系数中的 $x$；$P(x)$ 的分母中仍含 $x$，要代入给定的 $x$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Divide by the leading coefficient", "除以首项系数"],
                t(`Every term is divided by $${ax}$:`, `每一项都除以 $${ax}$：`),
                [`y' + \\frac{${b}}{${ax}}y = \\frac{${c}}{${a}}x`],
              ],
              [
                ["Read off P and evaluate", "读出 P 并求值"],
                t(`The coefficient of $y$ is $P(x) = \\frac{${b}}{${ax}}$, so`, `$y$ 的系数是 $P(x) = \\frac{${b}}{${ax}}$，所以`),
                [`P(${x0}) = \\frac{${b}}{${a} \\cdot ${x0}} = ${ans.toLatex()}`],
              ],
            ],
            t(
              `Multiplying back by the leading coefficient at $x = ${x0}$: $${a * x0} \\cdot ${ans.toLatex()} = ${b}$, the coefficient of $y$ in the original equation.`,
              `在 $x = ${x0}$ 处乘回首项系数：$${a * x0} \\cdot ${ans.toLatex()} = ${b}$，正是原方程中 $y$ 的系数。`,
            ),
          ),
        });
      },
    },
    {
      id: "recognizing-linear-equations",
      title: t("Recognizing linear equations", "识别线性方程"),
      explanation: t(
        "An equation is linear in $y$ when $y$ and $y'$ appear only to the first power, are never multiplied together, and never sit inside another function. The coefficients may be any functions of $x$.\n\nSo $x^{2}y' + (\\sin x)y = e^{x}$ is linear, but $y' + y^{2} = x$, $yy' = x$ and $y' = \\sin y$ are not.\n\n> **Watch out.** Functions of $x$ such as $\\sin x$ or $e^{x}$ do not spoil linearity; only $y$ or $y'$ inside a power, a product with each other, or another function does.",
        "当 $y$ 与 $y'$ 只以一次幂出现、彼此不相乘、也不出现在其他函数内部时，方程关于 $y$ 是线性的。系数可以是 $x$ 的任意函数。\n\n因此 $x^{2}y' + (\\sin x)y = e^{x}$ 是线性的，而 $y' + y^{2} = x$、$yy' = x$ 和 $y' = \\sin y$ 都不是。\n\n> **注意。** $\\sin x$、$e^{x}$ 这样的 $x$ 的函数不会破坏线性；只有 $y$ 或 $y'$ 出现在幂中、彼此相乘或出现在其他函数内部时才会。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 9);
        const b = rng.int(2, 5);
        const linear = [
          `x^{${b}}y' + ${a}y = \\sin x`,
          `y' = ${a}xy + e^{x}`,
          `(x^{2} + 1)y' - ${a}y = x^{${b}}`,
          `y' + (\\cos x)y = ${a}x^{${b}}`,
        ];
        const nonlinear: [string, Text][] = [
          [`y' + ${a}y^{2} = x`, t("$y$ is squared", "$y$ 被平方")],
          [`yy' + ${a}x = 0`, t("$y$ multiplies $y'$", "$y$ 与 $y'$ 相乘")],
          [`y' = \\sin(${a}y) + x`, t("$y$ sits inside the sine", "$y$ 出现在正弦函数内部")],
          [`y' + ${a}e^{y} = x^{${b}}`, t("$y$ sits inside the exponential", "$y$ 出现在指数函数内部")],
          [`(y')^{2} + ${a}y = x`, t("$y'$ is squared", "$y'$ 被平方")],
        ];
        const isLinear = rng.bool(0.5);
        const [eq, flaw] = isLinear ? [rng.pick(linear), undefined] : rng.pick(nonlinear);
        const problem = choiceProblem({
          prompt: t(`Is $${eq}$ linear in $y$?`, `$${eq}$ 关于 $y$ 是线性的吗？`),
          options: yesNo,
          correct: isLinear ? 0 : 1,
          solution: walked(
            [
              [
                ["Look at how y and y' appear", "看 y 与 y' 怎样出现"],
                flaw
                  ? t(`In $${eq}$, ${flaw.en}.`, `在 $${eq}$ 中，${flaw["zh-CN"]}。`)
                  : t(
                      `In $${eq}$, $y$ and $y'$ appear only to the first power and are not multiplied together; every other factor is a function of $x$.`,
                      `在 $${eq}$ 中，$y$ 与 $y'$ 只以一次幂出现，彼此不相乘；其余因子都是 $x$ 的函数。`,
                    ),
              ],
              [
                ["Decide", "作出判断"],
                flaw
                  ? t("So the equation is not linear in $y$.", "所以方程关于 $y$ 不是线性的。")
                  : t("So the equation is linear in $y$.", "所以方程关于 $y$ 是线性的。"),
              ],
            ],
            flaw
              ? t(
                  "A linear term doubles when $y$ is doubled; this term does not, so no rearrangement reaches the form $y' + P(x)y = Q(x)$.",
                  "线性项在 $y$ 加倍时也加倍；这一项不是这样，所以无论怎样移项都得不到 $y' + P(x)y = Q(x)$ 的形式。",
                )
              : t(
                  "Moving every $y$ term to the left and dividing by the coefficient of $y'$ gives the form $y' + P(x)y = Q(x)$.",
                  "把所有含 $y$ 的项移到左边，再除以 $y'$ 的系数，就得到 $y' + P(x)y = Q(x)$ 的形式。",
                ),
          ),
        });
        return reasoned(
          problem,
          flaw
            ? [
                [
                  "Yes",
                  `Look again: ${flaw.en}, which is not a first-power term in $y$.`,
                  `再看一遍：${flaw["zh-CN"]}，这不是 $y$ 的一次项。`,
                ],
              ]
            : [
                [
                  "No",
                  "Coefficients that are functions of $x$, such as $\\sin x$ or $e^{x}$, are allowed; check how $y$ and $y'$ themselves appear.",
                  "系数可以是 $x$ 的函数，例如 $\\sin x$ 或 $e^{x}$；要看的是 $y$ 与 $y'$ 本身怎样出现。",
                ],
              ],
        );
      },
    },
  ],
};

/** generalSolutionsOfFirstOrderLinearOdes establishes solution structure y = y_h + y_p. */
export const generalSolutionsOfFirstOrderLinearOdes: TopicDef = {
  id: "general-solutions-of-first-order-linear-odes",
  title: t("General Solutions of First-Order Linear ODEs", "一阶线性微分方程的通解结构"),
  summary: t(
    "The general solution of $y' + ay = b$ is $y = \\frac{b}{a} + Ce^{-ax}$, which tends to the steady state $\\frac{b}{a}$ as $x \\to \\infty$ when $a > 0$.",
    "方程 $y' + ay = b$ 的通解为 $y = \\frac{b}{a} + Ce^{-ax}$；当 $a > 0$ 时，$x \\to \\infty$ 时趋于稳态 $\\frac{b}{a}$。",
  ),
  intro: t(
    "Solve $y' + 2y = 6$ with $y(0) = 5$. The homogeneous equation $y' + 2y = 0$ has the solutions $Ce^{-2x}$, and the constant $y_p = 3$ solves the full equation, since $0 + 2 \\cdot 3 = 6$. So $y = 3 + Ce^{-2x}$, and $y(0) = 3 + C = 5$ gives $C = 2$: $y = 3 + 2e^{-2x}$.\n\nCheck: $y' = -4e^{-2x}$, so $y' + 2y = -4e^{-2x} + 6 + 4e^{-2x} = 6$, and $y(0) = 3 + 2 = 5$.\n\nIn this lesson we write the general solution of $y' + ay = b$ as a steady state plus a transient, fix the constant from an initial value, and find the long-run limit.",
    "求解 $y' + 2y = 6$，$y(0) = 5$。齐次方程 $y' + 2y = 0$ 的解是 $Ce^{-2x}$，而常数 $y_p = 3$ 满足完整方程，因为 $0 + 2 \\cdot 3 = 6$。所以 $y = 3 + Ce^{-2x}$，由 $y(0) = 3 + C = 5$ 得 $C = 2$：$y = 3 + 2e^{-2x}$。\n\n检验：$y' = -4e^{-2x}$，所以 $y' + 2y = -4e^{-2x} + 6 + 4e^{-2x} = 6$，且 $y(0) = 3 + 2 = 5$。\n\n本课我们把 $y' + ay = b$ 的通解写成稳态加瞬态，由初值确定常数，并求长期极限。",
  ),
  prerequisites: ["introduction-to-first-order-linear-odes"],
  encompasses: [{ topic: "introduction-to-first-order-linear-odes", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "steady-state-and-transient-solutions-of-first-order-odes",
      title: t("Steady-state and transient solutions of first-order ODEs", "一阶微分方程的稳态解与瞬态解"),
      explanation: t(
        "For $y' + a y = b$ with $a > 0$, the general solution is $y(x) = \\frac{b}{a} + C e^{-a x}$. As $x \\to \\infty$, the transient term $C e^{-a x} \\to 0$, leaving the steady-state value $y_{\\text{steady}} = \\frac{b}{a}$. For example, every solution of $y' + 4y = 12$ tends to $\\frac{12}{4} = 3$.\n\n> **Watch out.** The limit does not depend on $y(0)$: the initial value only fixes $C$, and the term $Ce^{-ax}$ dies out. Divide $b$ by $a$; do not keep $b$ itself.",
        "对于 $a > 0$ 的常系数方程 $y' + a y = b$，通解为 $y(x) = \\frac{b}{a} + C e^{-a x}$。当 $x \\to \\infty$ 时，瞬态项 $C e^{-a x} \\to 0$，趋向稳态值 $y_{\\text{steady}} = \\frac{b}{a}$。例如 $y' + 4y = 12$ 的每个解都趋于 $\\frac{12}{4} = 3$。\n\n> **注意。** 极限与 $y(0)$ 无关：初值只确定 $C$，而 $Ce^{-ax}$ 会消失。要用 $b$ 除以 $a$，不能保留 $b$ 本身。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 8);
        const k = rng.int(2, 9);
        const b = a * k;
        const y0 = rng.int(1, 15);
        const ans = k;
        return numberProblem({
          prompt: t(
            `Find the steady-state limit $\\lim_{x \\to \\infty} y(x)$ of the solution to the initial value problem $y' + ${a}y = ${b}$, $y(0) = ${y0}$.`,
            `求初值问题 $y' + ${a}y = ${b}$，$y(0) = ${y0}$ 的解在 $x \\to \\infty$ 时的稳态极限值 $\\lim_{x \\to \\infty} y(x)$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              b,
              `That is the right side itself; the constant solution must satisfy $${a}y = ${b}$.`,
              `这是右边本身；常数解必须满足 $${a}y = ${b}$。`,
            ),
            why(
              y0,
              "That is the starting value; the transient term decays, so the solution does not stay there.",
              "这是初值；瞬态项会衰减，所以解不会停留在那里。",
            ),
            why(
              Q.of(a, b),
              "That divides the wrong way round; the steady state is $\\frac{b}{a}$.",
              "这是除反了；稳态值是 $\\frac{b}{a}$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Write the general solution", "写出通解"],
                t(
                  `The homogeneous part is $Ce^{-${a}x}$, and the constant $y_p = \\frac{${b}}{${a}} = ${k}$ solves the equation:`,
                  `齐次部分是 $Ce^{-${a}x}$，常数 $y_p = \\frac{${b}}{${a}} = ${k}$ 满足方程：`,
                ),
                [`y(x) = ${k} + Ce^{-${a}x}`],
              ],
              [
                ["Fix C and let x grow", "确定 C 并令 x 增大"],
                t(
                  `$y(0) = ${y0}$ gives $C = ${y0 - k}$. Since $${a} > 0$, $e^{-${a}x} \\to 0$, so $y(x) \\to ${k}$.`,
                  `由 $y(0) = ${y0}$ 得 $C = ${y0 - k}$。因为 $${a} > 0$，$e^{-${a}x} \\to 0$，所以 $y(x) \\to ${k}$。`,
                ),
              ],
            ],
            t(
              `The constant $y = ${k}$ has $y' = 0$, and $0 + ${a} \\cdot ${k} = ${b}$, so it is an equilibrium of the equation.`,
              `常数 $y = ${k}$ 满足 $y' = 0$，且 $0 + ${a} \\cdot ${k} = ${b}$，所以它是方程的平衡解。`,
            ),
          ),
        });
      },
    },
    {
      id: "evaluating-the-solution-of-an-initial-value-problem",
      title: t("Evaluating the solution of an initial value problem", "求初值问题的解在某点的值"),
      explanation: t(
        "The initial condition fixes the constant in $y = \\frac{b}{a} + Ce^{-ax}$: at $x = 0$, $C = y(0) - \\frac{b}{a}$. The transient part $Ce^{-ax}$ halves every $\\frac{\\ln 2}{a}$, so\n\n$$y\\left(\\frac{\\ln 2}{a}\\right) = \\frac{b}{a} + \\frac{1}{2}\\left(y(0) - \\frac{b}{a}\\right),$$\n\nthe value halfway between the start and the steady state. For $y' + 3y = 6$ with $y(0) = 8$: the steady state is $2$, $C = 6$, and $y\\left(\\frac{\\ln 2}{3}\\right) = 2 + 3 = 5$.\n\n> **Watch out.** Only the distance $y(0) - \\frac{b}{a}$ from the steady state is halved, not $y(0)$ itself; and $e^{-a x}$ at $x = \\frac{\\ln 2}{a}$ is $\\frac{1}{2}$, not $2$.",
        "初值条件确定 $y = \\frac{b}{a} + Ce^{-ax}$ 中的常数：令 $x = 0$，$C = y(0) - \\frac{b}{a}$。瞬态部分 $Ce^{-ax}$ 每经过 $\\frac{\\ln 2}{a}$ 减半，所以\n\n$$y\\left(\\frac{\\ln 2}{a}\\right) = \\frac{b}{a} + \\frac{1}{2}\\left(y(0) - \\frac{b}{a}\\right),$$\n\n即初值与稳态值的中点。对 $y' + 3y = 6$，$y(0) = 8$：稳态值为 $2$，$C = 6$，$y\\left(\\frac{\\ln 2}{3}\\right) = 2 + 3 = 5$。\n\n> **注意。** 减半的只是与稳态的距离 $y(0) - \\frac{b}{a}$，而不是 $y(0)$ 本身；并且 $x = \\frac{\\ln 2}{a}$ 时 $e^{-a x}$ 等于 $\\frac{1}{2}$，不是 $2$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 6);
        const k = rng.int(1, 9);
        let y0 = rng.int(-6, 15);
        if (y0 === k) y0 = k + 4;
        const ans = Q.of(k + y0, 2);
        const half = Q.of(y0 - k, 2);
        return numberProblem({
          prompt: t(
            `Solve $y' + ${a}y = ${a * k}$ with $y(0) = ${y0}$, and find $y\\left(\\frac{\\ln 2}{${a}}\\right)$.`,
            `求解 $y' + ${a}y = ${a * k}$，$y(0) = ${y0}$，并求 $y\\left(\\frac{\\ln 2}{${a}}\\right)$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              k,
              "That is the steady state, which is reached only as $x \\to \\infty$; at this $x$ the transient has only halved.",
              "这是稳态值，只有 $x \\to \\infty$ 时才达到；在这个 $x$ 处瞬态项只减半。",
            ),
            why(
              Q.of(y0, 2),
              "That halves the whole initial value; only the distance from the steady state is halved.",
              "这是把整个初值减半；减半的只是与稳态的距离。",
            ),
            why(
              2 * y0 - k,
              "That doubles the transient; $e^{-ax}$ at $x = \\frac{\\ln 2}{a}$ is $\\frac{1}{2}$, not $2$.",
              "这是把瞬态项加倍了；$x = \\frac{\\ln 2}{a}$ 时 $e^{-ax}$ 等于 $\\frac{1}{2}$，不是 $2$。",
            ),
            why(half, "That is only the transient part; add the steady state back.", "这只是瞬态部分；还要加上稳态值。"),
          ]),
          solution: walked(
            [
              [
                ["Find the steady state and C", "求稳态值与 C"],
                t(
                  `The steady state is $\\frac{${a * k}}{${a}} = ${k}$, so $y = ${k} + Ce^{-${a}x}$, and $y(0) = ${y0}$ gives $C = ${y0} - ${par(k)} = ${y0 - k}$.`,
                  `稳态值为 $\\frac{${a * k}}{${a}} = ${k}$，所以 $y = ${k} + Ce^{-${a}x}$，由 $y(0) = ${y0}$ 得 $C = ${y0} - ${par(k)} = ${y0 - k}$。`,
                ),
              ],
              [
                ["Evaluate at the halving time", "在减半时刻求值"],
                t(
                  `At $x = \\frac{\\ln 2}{${a}}$, $e^{-${a}x} = \\frac{1}{2}$, so`,
                  `当 $x = \\frac{\\ln 2}{${a}}$ 时 $e^{-${a}x} = \\frac{1}{2}$，所以`,
                ),
                [`y = ${k} ${signedQ(half)} = ${ans.toLatex()}`],
              ],
            ],
            t(
              `The distance from the steady state went from $${y0 - k}$ to $${ans.sub(Q.of(k)).toLatex()}$, exactly half, as one halving time requires.`,
              `与稳态的距离从 $${y0 - k}$ 变为 $${ans.sub(Q.of(k)).toLatex()}$，恰好减半，符合一个减半时间。`,
            ),
          ),
        });
      },
    },
  ],
};

/** solvingFirstOrderLinearOdesWithExponentialForcing solves y' + a y = b e^{kx}. */
export const solvingFirstOrderLinearOdesWithExponentialForcing: TopicDef = {
  id: "solving-first-order-linear-odes-with-exponential-forcing",
  title: t("Solving First-Order Linear ODEs With Exponential Forcing", "指数非齐次项的一阶线性方程求解"),
  summary: t(
    "For $y' + ay = be^{kx}$ with $k \\ne -a$, undetermined coefficients gives $y_p = Ae^{kx}$ with $A = \\frac{b}{a + k}$.",
    "对 $y' + ay = be^{kx}$（$k \\ne -a$），待定系数法给出特解 $y_p = Ae^{kx}$，其中 $A = \\frac{b}{a + k}$。",
  ),
  intro: t(
    "Find a particular solution of $y' + 2y = 10e^{3x}$. The forcing is an exponential, so try a multiple of it, $y_p = Ae^{3x}$. Then $y_p' = 3Ae^{3x}$, and substituting gives $3Ae^{3x} + 2Ae^{3x} = 5Ae^{3x} = 10e^{3x}$, so $A = 2$ and $y_p = 2e^{3x}$.\n\nCheck: $y_p' + 2y_p = 6e^{3x} + 4e^{3x} = 10e^{3x}$, the forcing.\n\nIn this lesson we find particular solutions for exponential forcing by undetermined coefficients, handle the resonant case where the guess must be multiplied by $x$, and use the result in initial value problems.",
    "求 $y' + 2y = 10e^{3x}$ 的一个特解。激励是指数函数，所以设它的倍数 $y_p = Ae^{3x}$。则 $y_p' = 3Ae^{3x}$，代入得 $3Ae^{3x} + 2Ae^{3x} = 5Ae^{3x} = 10e^{3x}$，所以 $A = 2$，$y_p = 2e^{3x}$。\n\n检验：$y_p' + 2y_p = 6e^{3x} + 4e^{3x} = 10e^{3x}$，正是激励项。\n\n本课我们用待定系数法求指数激励下的特解，处理猜测必须乘以 $x$ 的共振情形，并把结果用于初值问题。",
  ),
  prerequisites: ["general-solutions-of-first-order-linear-odes"],
  encompasses: [{ topic: "general-solutions-of-first-order-linear-odes", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "method-of-undetermined-coefficients-for-exponential-forcing",
      title: t("Method of undetermined coefficients for exponential forcing", "待定系数法求解指数激励一阶常微分方程"),
      explanation: t(
        "When the forcing term is an exponential, guess a multiple of the same exponential, substitute it, and solve for the unknown coefficient. Substituting $y_p(x) = A e^{kx}$ into $y' + ay = b e^{kx}$ gives $(k + a) A e^{kx} = b e^{kx}$, so $A = \\frac{b}{a + k}$. For $y' + y = 8e^{3x}$, $4A = 8$ and $A = 2$.\n\n> **Watch out.** Both terms contribute: the derivative gives $kA$ and the $ay$ term gives $aA$. Dividing $b$ by $a$ alone or by $k$ alone leaves one of them out.",
        "当强迫项是指数函数时，猜测解是同一个指数函数的倍数，代入后解出未知系数。将特解形式 $y_p(x) = A e^{kx}$ 代入方程 $y' + ay = b e^{kx}$ 得 $(k + a) A e^{kx} = b e^{kx}$，由此解得 $A = \\frac{b}{a + k}$。对 $y' + y = 8e^{3x}$，$4A = 8$，$A = 2$。\n\n> **注意。** 两项都有贡献：导数给出 $kA$，$ay$ 项给出 $aA$。只用 $a$ 或只用 $k$ 去除 $b$，都漏掉了其中一项。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 6);
        const k = rng.int(1, 6);
        const A = rng.int(2, 8);
        const b = A * (a + k);
        const ex = `e^{${poly([k, "x"])}}`;
        return numberProblem({
          prompt: t(
            `Find the coefficient $A$ of the particular solution $y_p(x) = A ${ex}$ to the differential equation $y' + ${poly([a, "y"])} = ${b}${ex}$.`,
            `求微分方程 $y' + ${poly([a, "y"])} = ${b}${ex}$ 的特解 $y_p(x) = A ${ex}$ 的系数 $A$。`,
          ),
          answer: A,
          mistakes: apart(A, [
            why(
              b,
              "That is the forcing coefficient itself; it still has to be divided by the factor from substituting.",
              "这是激励项的系数本身；还要除以代入后得到的因子。",
            ),
            why(
              Q.of(b, a),
              `That leaves out the derivative: $y_p'$ contributes $${k}A$ as well.`,
              `这里漏掉了导数：$y_p'$ 还贡献 $${k}A$。`,
            ),
            why(
              Q.of(b, k),
              `That leaves out the term $${poly([a, "y"])}$, which contributes $${a}A$.`,
              `这里漏掉了 $${poly([a, "y"])}$ 项，它贡献 $${a}A$。`,
            ),
          ]),
          solution: walked(
            [
              [["Differentiate the guess", "对猜测求导"], t(`With $y_p = A${ex}$:`, `设 $y_p = A${ex}$：`), [`y_p' = ${k}A${ex}`]],
              [
                ["Substitute and match", "代入并比较系数"],
                t("", ""),
                [`${k}A${ex} + ${a}A${ex} = ${k + a}A${ex} = ${b}${ex}`, `A = \\frac{${b}}{${k + a}} = ${A}`],
              ],
            ],
            t(
              `$y_p = ${A}${ex}$ gives $y_p' + ${a}y_p = ${k * A}${ex} + ${a * A}${ex} = ${b}${ex}$.`,
              `$y_p = ${A}${ex}$ 时 $y_p' + ${a}y_p = ${k * A}${ex} + ${a * A}${ex} = ${b}${ex}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-resonant-case-of-exponential-forcing",
      title: t("The resonant case of exponential forcing", "指数激励的共振情形"),
      explanation: t(
        "When $k = -a$ the guess $Ae^{-ax}$ solves the homogeneous equation and cannot produce the forcing. Multiply the guess by $x$: substituting $y_p = Bxe^{-ax}$ into $y' + ay = be^{-ax}$ gives $B = b$. With $y(0) = y_0$ the solution is\n\n$$y = (bx + y_0)e^{-ax}.$$\n\nFor $b > ay_0 > 0$ it first rises and then decays; $y' = e^{-ax}\\left(b - a(bx + y_0)\\right)$ vanishes at $x = \\frac{1}{a} - \\frac{y_0}{b}$, where $y$ is largest. For $y' + 2y = 3e^{-2x}$ with $y(0) = 1$: $y = (3x + 1)e^{-2x}$, largest at $x = \\frac{1}{2} - \\frac{1}{3} = \\frac{1}{6}$.\n\n> **Watch out.** The guess $Ae^{-ax}$ gives $0 = be^{-ax}$ and fails; the factor $x$ is needed. And at the maximum the term $\\frac{y_0}{b}$ is subtracted from $\\frac{1}{a}$, not added.",
        "当 $k = -a$ 时，猜测 $Ae^{-ax}$ 是齐次方程的解，无法产生激励项。把猜测乘以 $x$：将 $y_p = Bxe^{-ax}$ 代入 $y' + ay = be^{-ax}$ 得 $B = b$。若 $y(0) = y_0$，解为\n\n$$y = (bx + y_0)e^{-ax}.$$\n\n当 $b > ay_0 > 0$ 时，它先上升后衰减；$y' = e^{-ax}\\left(b - a(bx + y_0)\\right)$ 在 $x = \\frac{1}{a} - \\frac{y_0}{b}$ 处为零，此时 $y$ 最大。对 $y' + 2y = 3e^{-2x}$，$y(0) = 1$：$y = (3x + 1)e^{-2x}$，在 $x = \\frac{1}{2} - \\frac{1}{3} = \\frac{1}{6}$ 处最大。\n\n> **注意。** 猜测 $Ae^{-ax}$ 会得到 $0 = be^{-ax}$，行不通；必须乘以因子 $x$。在最大值处，$\\frac{y_0}{b}$ 是从 $\\frac{1}{a}$ 中减去，而不是加上。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 4);
        const y0 = rng.int(1, 4);
        const b = a * y0 + rng.int(1, 8);
        const ans = Q.of(b - a * y0, a * b);
        const ac = a === 1 ? "" : `${a}`;
        const peak = Q.of(b, a);
        return numberProblem({
          prompt: t(
            `Solve $y' + ${ac}y = ${b}e^{-${ac}x}$ with $y(0) = ${y0}$, and find the value of $x$ at which $y$ is largest.`,
            `求解 $y' + ${ac}y = ${b}e^{-${ac}x}$，$y(0) = ${y0}$，并求 $y$ 取最大值时 $x$ 的值。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              Q.of(1, a),
              "That leaves out the initial value; the factor $bx + y_0$ includes $y_0$.",
              "这里漏掉了初值；因子 $bx + y_0$ 中含有 $y_0$。",
            ),
            why(
              Q.of(y0, b),
              "That keeps only the initial-value part of the critical point; it starts from $\\frac{1}{a}$.",
              "这只保留了临界点中与初值有关的部分；它应从 $\\frac{1}{a}$ 开始。",
            ),
            why(
              Q.of(b + a * y0, a * b),
              "The sign of the $y_0$ term is flipped; setting $b - a(bx + y_0) = 0$ subtracts it.",
              "$y_0$ 项的符号反了；令 $b - a(bx + y_0) = 0$ 时要减去它。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Multiply the guess by x", "把猜测乘以 x"],
                t(
                  `The forcing $e^{-${ac}x}$ solves the homogeneous equation, so try $y_p = Bxe^{-${ac}x}$; substituting gives $B = ${b}$. With $y(0) = ${y0}$:`,
                  `激励 $e^{-${ac}x}$ 是齐次方程的解，所以设 $y_p = Bxe^{-${ac}x}$；代入得 $B = ${b}$。由 $y(0) = ${y0}$：`,
                ),
                [`y = (${b}x + ${y0})e^{-${ac}x}`],
              ],
              [
                ["Set the derivative to zero", "令导数为零"],
                t("", ""),
                [
                  `y' = e^{-${ac}x}\\left(${b} - ${a}(${b}x + ${y0})\\right) = 0`,
                  `x = \\frac{${b} - ${a * y0}}{${a * b}} = ${ans.toLatex()}`,
                ],
              ],
            ],
            t(
              `At $x = ${ans.toLatex()}$, $${b}x + ${y0} = ${peak.toLatex()}$, and $${a} \\cdot ${peak.toLatex()} = ${b}$, so $y' = 0$; $y'$ is positive before and negative after.`,
              `在 $x = ${ans.toLatex()}$ 处 $${b}x + ${y0} = ${peak.toLatex()}$，而 $${a} \\cdot ${peak.toLatex()} = ${b}$，所以 $y' = 0$；此前 $y'$ 为正，此后为负。`,
            ),
          ),
        });
      },
    },
  ],
};

/** solvingFirstOrderLinearOdesWithSinusoidalForcing solves y' + a y = b cos(ω x). */
export const solvingFirstOrderLinearOdesWithSinusoidalForcing: TopicDef = {
  id: "solving-first-order-linear-odes-with-sinusoidal-forcing",
  title: t("Solving First-Order Linear ODEs With Sinusoidal Forcing", "正弦非齐次项的一阶线性方程求解"),
  summary: t(
    "For $y' + ay = b\\cos \\omega x$, the steady-state response has amplitude $R = \\frac{b}{\\sqrt{a^2 + \\omega^2}}$.",
    "对 $y' + ay = b\\cos \\omega x$，稳态响应的振幅为 $R = \\frac{b}{\\sqrt{a^2 + \\omega^2}}$。",
  ),
  intro: t(
    "Find the steady state of $y' + 3y = 10\\cos x$. Try $y_p = A\\cos x + B\\sin x$, so $y_p' = -A\\sin x + B\\cos x$. Matching cosines gives $B + 3A = 10$ and matching sines gives $3B - A = 0$. So $A = 3B$, $10B = 10$, and $y_p = 3\\cos x + \\sin x$, with amplitude $\\sqrt{3^{2} + 1^{2}} = \\sqrt{10}$.\n\nCheck: $y_p' + 3y_p = (-3\\sin x + \\cos x) + (9\\cos x + 3\\sin x) = 10\\cos x$, and the formula $\\frac{b}{\\sqrt{a^{2} + \\omega^{2}}} = \\frac{10}{\\sqrt{10}} = \\sqrt{10}$ agrees.\n\nIn this lesson we find the sine and cosine coefficients of the steady-state response to sinusoidal forcing, and its amplitude.",
    "求 $y' + 3y = 10\\cos x$ 的稳态解。设 $y_p = A\\cos x + B\\sin x$，则 $y_p' = -A\\sin x + B\\cos x$。比较余弦项得 $B + 3A = 10$，比较正弦项得 $3B - A = 0$。所以 $A = 3B$，$10B = 10$，$y_p = 3\\cos x + \\sin x$，振幅为 $\\sqrt{3^{2} + 1^{2}} = \\sqrt{10}$。\n\n检验：$y_p' + 3y_p = (-3\\sin x + \\cos x) + (9\\cos x + 3\\sin x) = 10\\cos x$，公式 $\\frac{b}{\\sqrt{a^{2} + \\omega^{2}}} = \\frac{10}{\\sqrt{10}} = \\sqrt{10}$ 也一致。\n\n本课我们求正弦激励下稳态响应的正弦、余弦系数及其振幅。",
  ),
  prerequisites: ["general-solutions-of-first-order-linear-odes"],
  encompasses: [{ topic: "general-solutions-of-first-order-linear-odes", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "steady-state-amplitude-for-sinusoidal-forcing",
      title: t("Steady-state amplitude for sinusoidal forcing", "正弦激励下稳态振荡的振幅计算"),
      explanation: t(
        "A sinusoidal input produces a sinusoidal output at the same frequency, and the amplitude of that output is the length of the vector of its two coefficients. Substituting $y_p = A \\cos(\\omega x) + B \\sin(\\omega x)$ into $y' + a y = b \\cos(\\omega x)$ yields amplitude $R = \\sqrt{A^2 + B^2} = \\frac{b}{\\sqrt{a^2 + \\omega^2}}$. For $y' + 3y = 10\\cos 4x$, $R = \\frac{10}{\\sqrt{9 + 16}} = 2$.\n\n> **Watch out.** Divide by $\\sqrt{a^2 + \\omega^2}$: not by $a + \\omega$, not by $a^2 + \\omega^2$ without the root, and not by $a$ alone as for a constant forcing.",
        "正弦输入产生同频率的正弦输出，输出的振幅等于由两个系数构成的向量的长度。设特解为 $y_p = A \\cos(\\omega x) + B \\sin(\\omega x)$，代入 $y' + a y = b \\cos(\\omega x)$ 可得稳态响应振幅为 $R = \\sqrt{A^2 + B^2} = \\frac{b}{\\sqrt{a^2 + \\omega^2}}$。对 $y' + 3y = 10\\cos 4x$，$R = \\frac{10}{\\sqrt{9 + 16}} = 2$。\n\n> **注意。** 要除以 $\\sqrt{a^2 + \\omega^2}$：不是除以 $a + \\omega$，也不是除以不开方的 $a^2 + \\omega^2$，更不是像常数激励那样只除以 $a$。",
      ),
      generate(rng: Rng): Problem {
        const triple = rng.pick(pythagoreanTriples);
        const a = triple[0];
        const w = triple[1];
        const denom = triple[2];
        const R = rng.int(2, 7);
        const b = R * denom;
        const sq = denom * denom;
        const A = Q.of(a * b, sq);
        const B = Q.of(w * b, sq);
        return numberProblem({
          prompt: t(
            `Find the amplitude $R$ of the steady-state sinusoidal solution $y_p(x)$ to the differential equation $y' + ${a}y = ${b}\\cos(${w}x)$.`,
            `求微分方程 $y' + ${a}y = ${b}\\cos(${w}x)$ 的稳态正弦特解 $y_p(x)$ 的振幅 $R$。`,
          ),
          answer: R,
          mistakes: apart(R, [
            why(
              Q.of(b, a + w),
              "That divides by $a + \\omega$; the amplitude divides by $\\sqrt{a^2 + \\omega^2}$.",
              "这是除以 $a + \\omega$；振幅应除以 $\\sqrt{a^2 + \\omega^2}$。",
            ),
            why(
              Q.of(b, sq),
              "That divides by $a^2 + \\omega^2$ without taking the square root.",
              "这是除以 $a^2 + \\omega^2$，却没有开平方。",
            ),
            why(Q.of(b, a), "That ignores the frequency, as if the forcing were constant.", "这忽略了频率，好像激励是常数。"),
          ]),
          solution: walked(
            [
              [
                ["Find the coefficients", "求系数"],
                t(
                  `Substituting $y_p = A\\cos(${w}x) + B\\sin(${w}x)$ and matching terms gives $${a}A + ${w}B = ${b}$ and $${a}B - ${w}A = 0$, so`,
                  `代入 $y_p = A\\cos(${w}x) + B\\sin(${w}x)$ 并比较系数，得 $${a}A + ${w}B = ${b}$ 与 $${a}B - ${w}A = 0$，所以`,
                ),
                [`A = ${A.toLatex()}, \\quad B = ${B.toLatex()}`],
              ],
              [["Take the amplitude", "求振幅"], t("", ""), [`R = \\frac{${b}}{\\sqrt{${a}^2 + ${w}^2}} = \\frac{${b}}{${denom}} = ${R}`]],
            ],
            t(
              `$A^2 + B^2 = ${A.mul(A).toLatex()} + ${B.mul(B).toLatex()} = ${R * R} = R^2$.`,
              `$A^2 + B^2 = ${A.mul(A).toLatex()} + ${B.mul(B).toLatex()} = ${R * R} = R^2$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-coefficients-of-the-steady-state-response",
      title: t("The coefficients of the steady-state response", "稳态响应的系数"),
      explanation: t(
        "Write the steady state as $y_p = A\\cos\\omega x + B\\sin\\omega x$ and substitute into $y' + ay = b\\cos\\omega x$. Matching the cosine and sine terms gives $aA + \\omega B = b$ and $aB - \\omega A = 0$, so\n\n$$A = \\frac{ab}{a^{2} + \\omega^{2}}, \\qquad B = \\frac{\\omega b}{a^{2} + \\omega^{2}}.$$\n\nThe sine part appears even though the forcing has none: the response lags behind the input. For $y' + 3y = 10\\cos x$, $A = \\frac{30}{10} = 3$ and $B = \\frac{10}{10} = 1$.\n\n> **Watch out.** The derivative of $A\\cos\\omega x$ is $-\\omega A\\sin\\omega x$; dropping that minus sign makes $B$ come out negative. And $A$ has $a$ in its numerator, $B$ has $\\omega$.",
        "把稳态写成 $y_p = A\\cos\\omega x + B\\sin\\omega x$，代入 $y' + ay = b\\cos\\omega x$。比较余弦项与正弦项得 $aA + \\omega B = b$ 与 $aB - \\omega A = 0$，所以\n\n$$A = \\frac{ab}{a^{2} + \\omega^{2}}, \\qquad B = \\frac{\\omega b}{a^{2} + \\omega^{2}}.$$\n\n尽管激励中没有正弦项，响应中仍出现正弦部分：响应滞后于输入。对 $y' + 3y = 10\\cos x$，$A = \\frac{30}{10} = 3$，$B = \\frac{10}{10} = 1$。\n\n> **注意。** $A\\cos\\omega x$ 的导数是 $-\\omega A\\sin\\omega x$；漏掉这个负号会使 $B$ 变成负数。而且 $A$ 的分子含 $a$，$B$ 的分子含 $\\omega$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 6);
        const w = rng.int(1, 6);
        const b = rng.int(2, 12);
        const den = a * a + w * w;
        const askA = rng.bool(0.5);
        const A = Q.of(a * b, den);
        const B = Q.of(w * b, den);
        const ans = askA ? A : B;
        const other = askA ? B : A;
        const name = askA ? "A" : "B";
        const ac = a === 1 ? "" : `${a}`;
        const wc = w === 1 ? "" : `${w}`;
        return numberProblem({
          prompt: t(
            `The steady-state solution of $y' + ${ac}y = ${b}\\cos ${wc}x$ is $y_p = A\\cos ${wc}x + B\\sin ${wc}x$. Find $${name}$.`,
            `$y' + ${ac}y = ${b}\\cos ${wc}x$ 的稳态解为 $y_p = A\\cos ${wc}x + B\\sin ${wc}x$。求 $${name}$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              other,
              `That is the other coefficient; $${name}$ has $${askA ? "a" : "\\omega"}$ in its numerator.`,
              `这是另一个系数；$${name}$ 的分子含 $${askA ? "a" : "\\omega"}$。`,
            ),
            why(
              Q.of(b, askA ? a : w),
              "That solves one matching equation as if the other coefficient were zero; the two equations must be solved together.",
              "这是在另一个系数为零的假设下解一个方程；两个方程必须联立求解。",
            ),
            why(
              Q.of((askA ? a : w) * b, a + w),
              "That divides by $a + \\omega$; solving the two equations gives the denominator $a^2 + \\omega^2$.",
              "这是除以 $a + \\omega$；联立两个方程得到的分母是 $a^2 + \\omega^2$。",
            ),
            why(
              ans.neg(),
              "The sign is flipped; check the minus sign in the derivative of the cosine.",
              "符号反了；检查余弦导数中的负号。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Substitute the guess", "代入猜测"],
                t(
                  `$y_p' = -${w}A\\sin ${wc}x + ${w}B\\cos ${wc}x$. Matching the cosine and the sine terms:`,
                  `$y_p' = -${w}A\\sin ${wc}x + ${w}B\\cos ${wc}x$。比较余弦项与正弦项：`,
                ),
                [`${a}A + ${w}B = ${b}`, `${a}B - ${w}A = 0`],
              ],
              [
                ["Solve the pair", "解方程组"],
                t("", ""),
                [
                  `A = \\frac{${a} \\cdot ${b}}{${a}^{2} + ${w}^{2}} = ${A.toLatex()}`,
                  `B = \\frac{${w} \\cdot ${b}}{${den}} = ${B.toLatex()}`,
                ],
              ],
            ],
            t(
              `$${a} \\cdot ${A.toLatex()} + ${w} \\cdot ${B.toLatex()} = ${b}$ and $${a} \\cdot ${B.toLatex()} - ${w} \\cdot ${A.toLatex()} = 0$, so both equations hold and $${name} = ${ans.toLatex()}$.`,
              `$${a} \\cdot ${A.toLatex()} + ${w} \\cdot ${B.toLatex()} = ${b}$，$${a} \\cdot ${B.toLatex()} - ${w} \\cdot ${A.toLatex()} = 0$，两个方程都成立，$${name} = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** solvingFirstOrderLinearOdesUsingIntegratingFactors multiplies by I(x) = e^{∫P dx}. */
export const solvingFirstOrderLinearOdesUsingIntegratingFactors: TopicDef = {
  id: "solving-first-order-linear-odes-using-integrating-factors",
  title: t("Solving First-Order Linear ODEs Using Integrating Factors", "用积分因子法解一阶线性常微分方程"),
  summary: t(
    "Multiplying y' + P(x)y = Q(x) by I(x) = exp(∫ P(x) dx) condenses the left side into (I(x)y)', allowing direct integration.",
    "通过乘以积分因子 I(x) = exp(∫ P(x) dx)，方程左边化为 (I(x)y)'，从而可通过直接积分求解。",
  ),
  intro: t(
    "Solve $xy' + 2y = 4x^{2}$ for $x > 0$. In standard form it is $y' + \\frac{2}{x}y = 4x$, so the integrating factor is $e^{\\int 2/x\\,dx} = x^{2}$. Multiplying by $x^{2}$ makes the left side $(x^{2}y)'$, so $(x^{2}y)' = 4x^{3}$, $x^{2}y = x^{4} + C$, and $y = x^{2} + \\frac{C}{x^{2}}$.\n\nCheck: for $y = x^{2}$, $xy' + 2y = 2x^{2} + 2x^{2} = 4x^{2}$; and $\\frac{C}{x^{2}}$ gives $x \\cdot \\left(-\\frac{2C}{x^{3}}\\right) + \\frac{2C}{x^{2}} = 0$.\n\nIn this lesson we find integrating factors from the standard form, solve with them, and fix the constant from an initial value.",
    "在 $x > 0$ 上求解 $xy' + 2y = 4x^{2}$。标准形式为 $y' + \\frac{2}{x}y = 4x$，所以积分因子是 $e^{\\int 2/x\\,dx} = x^{2}$。乘以 $x^{2}$ 后左边变成 $(x^{2}y)'$，所以 $(x^{2}y)' = 4x^{3}$，$x^{2}y = x^{4} + C$，$y = x^{2} + \\frac{C}{x^{2}}$。\n\n检验：对 $y = x^{2}$，$xy' + 2y = 2x^{2} + 2x^{2} = 4x^{2}$；而 $\\frac{C}{x^{2}}$ 给出 $x \\cdot \\left(-\\frac{2C}{x^{3}}\\right) + \\frac{2C}{x^{2}} = 0$。\n\n本课我们由标准形式求积分因子，用它求解方程，并由初值确定常数。",
  ),
  prerequisites: ["general-solutions-of-first-order-linear-odes"],
  encompasses: [{ topic: "general-solutions-of-first-order-linear-odes", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "determining-the-integrating-factor",
      title: t("Determining the integrating factor", "确定一阶线性微分方程的积分因子"),
      explanation: t(
        "Multiplying by the integrating factor turns the left side into the derivative of a product, so the equation can be solved by integrating once. For $x y' + k y = Q(x)$ ($x > 0$), dividing by $x$ gives $y' + \\frac{k}{x}y = \\frac{Q(x)}{x}$. The integrating factor is $I(x) = e^{\\int \\frac{k}{x}dx} = e^{k \\ln x} = x^k$. For $xy' + 3y = x^{2}$ it is $x^{3}$, and indeed $x^{3}y' + 3x^{2}y = (x^{3}y)'$.\n\n> **Watch out.** The factor is $e^{+\\int P\\,dx}$, not $e^{-\\int P\\,dx}$, and $P$ is read from the standard form: the exponent comes from the coefficient of $y$, not from the right side.",
        "乘以积分因子后，左边变成一个乘积的导数，所以积分一次就能解出方程。对于 $x y' + k y = Q(x)$（$x > 0$），同除以 $x$ 得 $y' + \\frac{k}{x}y = \\frac{Q(x)}{x}$。其积分因子为 $I(x) = e^{\\int \\frac{k}{x}dx} = e^{k \\ln x} = x^k$。对 $xy' + 3y = x^{2}$，积分因子是 $x^{3}$，确实 $x^{3}y' + 3x^{2}y = (x^{3}y)'$。\n\n> **注意。** 积分因子是 $e^{+\\int P\\,dx}$，不是 $e^{-\\int P\\,dx}$；$P$ 要从标准形式中读出：指数来自 $y$ 的系数，而不是右边。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(2, 9);
        const c = rng.int(1, 8);
        return numberProblem({
          prompt: t(
            `Write $x y' + ${k}y = ${c}x^3$ (for $x > 0$) in the standard form $y' + P(x)y = Q(x)$. Its integrating factor $e^{\\int P(x)\\,dx}$ is $x^p$. Find $p$.`,
            `把 $x y' + ${k}y = ${c}x^3$（$x > 0$）写成标准形式 $y' + P(x)y = Q(x)$。它的积分因子 $e^{\\int P(x)\\,dx}$ 是 $x^p$。求 $p$。`,
          ),
          answer: k,
          mistakes: apart(k, [
            why(-k, "The sign is flipped: the integrating factor is $e^{+\\int P\\,dx}$.", "符号反了：积分因子是 $e^{+\\int P\\,dx}$。"),
            why(
              k - 1,
              "That power makes the equation exact before it is divided by $x$; the factor $e^{\\int P\\,dx}$ belongs to the standard form.",
              "这个幂次是在除以 $x$ 之前使方程成为全导数的因子；$e^{\\int P\\,dx}$ 对应的是标准形式。",
            ),
            why(
              c,
              "That is read from the right side; the exponent comes from $P(x)$, the coefficient of $y$.",
              "这是从右边读出的；指数来自 $y$ 的系数 $P(x)$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Standardize", "化为标准形式"],
                t("Divide by $x$:", "除以 $x$："),
                [`y' + \\frac{${k}}{x}y = ${c}x^2`, `P(x) = \\frac{${k}}{x}`],
              ],
              [["Integrate P", "对 P 积分"], t("", ""), [`e^{\\int \\frac{${k}}{x}dx} = e^{${k} \\ln x} = x^{${k}}`, `p = ${k}`]],
            ],
            t(
              `$x^{${k}}\\left(y' + \\frac{${k}}{x}y\\right) = x^{${k}}y' + ${k}x^{${k - 1}}y = (x^{${k}}y)'$, a single derivative.`,
              `$x^{${k}}\\left(y' + \\frac{${k}}{x}y\\right) = x^{${k}}y' + ${k}x^{${k - 1}}y = (x^{${k}}y)'$，正是一个导数。`,
            ),
          ),
        });
      },
    },
    {
      id: "solving-with-a-power-integrating-factor",
      title: t("Solving with a power integrating factor", "用幂函数积分因子求解"),
      explanation: t(
        "For $xy' + py = cx^{m+1}$ on $x > 0$, divide by $x$ to get $y' + \\frac{p}{x}y = cx^{m}$. The integrating factor is $e^{\\int p/x\\,dx} = x^{p}$, and\n\n$$(x^{p}y)' = cx^{m+p} \\implies x^{p}y = \\frac{c}{m + p + 1}x^{m+p+1} + C.$$\n\nDivide by $x^{p}$ and use the initial condition to find $C$. For $xy' + y = 2x$ with $y(1) = 3$: $(xy)' = 2x$, $xy = x^{2} + C$, so $y = x + \\frac{C}{x}$, $C = 2$, and $y(2) = 2 + 1 = 3$.\n\n> **Watch out.** Divide the constant by $x^{p}$ too: $y = \\cdots + Cx^{-p}$, not $\\cdots + C$ and not $\\cdots + Cx^{p}$.",
        "对 $x > 0$ 上的 $xy' + py = cx^{m+1}$，除以 $x$ 得 $y' + \\frac{p}{x}y = cx^{m}$。积分因子为 $e^{\\int p/x\\,dx} = x^{p}$，且\n\n$$(x^{p}y)' = cx^{m+p} \\implies x^{p}y = \\frac{c}{m + p + 1}x^{m+p+1} + C.$$\n\n两边除以 $x^{p}$，再用初值条件求 $C$。对 $xy' + y = 2x$，$y(1) = 3$：$(xy)' = 2x$，$xy = x^{2} + C$，所以 $y = x + \\frac{C}{x}$，$C = 2$，$y(2) = 2 + 1 = 3$。\n\n> **注意。** 常数也要除以 $x^{p}$：$y = \\cdots + Cx^{-p}$，不是 $\\cdots + C$，也不是 $\\cdots + Cx^{p}$。",
      ),
      generate(rng: Rng): Problem {
        const p = rng.int(1, 3);
        const m = rng.int(0, 2);
        const k = rng.int(1, 4);
        let y0 = rng.int(-3, 9);
        if (y0 === k) y0 = k + 2;
        const c = k * (m + p + 1);
        const big = Q.of(k * 2 ** (m + 1));
        const tail = Q.of(y0 - k, 2 ** p);
        const ans = big.add(tail);
        const rhs = m === 0 ? "x" : `x^{${m + 1}}`;
        const pc = p === 1 ? "" : `${p}`;
        return numberProblem({
          prompt: t(
            `Solve $xy' + ${pc}y = ${c}${rhs}$ for $x > 0$ with $y(1) = ${y0}$, and find $y(2)$.`,
            `在 $x > 0$ 上求解 $xy' + ${pc}y = ${c}${rhs}$，$y(1) = ${y0}$，并求 $y(2)$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              big,
              "That leaves out the term with the constant $C$; the initial value makes $C \\ne 0$.",
              "这里漏掉了含常数 $C$ 的项；初值使 $C \\ne 0$。",
            ),
            why(
              big.add(Q.of((y0 - k) * 2 ** p)),
              "That multiplies the constant by $x^{p}$; dividing $x^{p}y = \\cdots + C$ by $x^{p}$ gives $Cx^{-p}$.",
              "这是把常数乘以了 $x^{p}$；$x^{p}y = \\cdots + C$ 除以 $x^{p}$ 得 $Cx^{-p}$。",
            ),
            why(
              big.add(Q.of(y0 - k)),
              "That leaves $C$ undivided; after dividing by $x^{p}$ the constant term is $Cx^{-p}$.",
              "这里常数没有除以 $x^{p}$；除以 $x^{p}$ 后常数项是 $Cx^{-p}$。",
            ),
            why(
              Q.of(y0 * 2 ** (m + 1)),
              "That scales the initial value like the particular solution; the solution has two parts with different powers.",
              "这是把初值按特解的幂次缩放；解由幂次不同的两部分组成。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Multiply by the integrating factor", "乘以积分因子"],
                t(
                  `In standard form $P = \\frac{${p}}{x}$, so the factor is $x^{${p}}$:`,
                  `标准形式中 $P = \\frac{${p}}{x}$，所以积分因子是 $x^{${p}}$：`,
                ),
                [`(x^{${p}}y)' = ${c}x^{${m + p}}`, `x^{${p}}y = ${k}x^{${m + p + 1}} + C`, `y = ${k}x^{${m + 1}} + Cx^{-${p}}`],
              ],
              [
                ["Fix C and evaluate", "确定 C 并求值"],
                t(
                  `$y(1) = ${k} + C = ${y0}$ gives $C = ${y0 - k}$. At $x = 2$:`,
                  `由 $y(1) = ${k} + C = ${y0}$ 得 $C = ${y0 - k}$。在 $x = 2$ 处：`,
                ),
                [`y(2) = ${k} \\cdot 2^{${m + 1}} ${signedQ(tail)} = ${ans.toLatex()}`],
              ],
            ],
            t(
              `$y = ${k}x^{${m + 1}}$ gives $xy' + ${pc}y = ${k * (m + 1)}x^{${m + 1}} + ${k * p}x^{${m + 1}} = ${c}${rhs}$, and $Cx^{-${p}}$ gives $-${pc}Cx^{-${p}} + ${pc}Cx^{-${p}} = 0$, so the solution is right.`,
              `$y = ${k}x^{${m + 1}}$ 给出 $xy' + ${pc}y = ${k * (m + 1)}x^{${m + 1}} + ${k * p}x^{${m + 1}} = ${c}${rhs}$，$Cx^{-${p}}$ 给出 $-${pc}Cx^{-${p}} + ${pc}Cx^{-${p}} = 0$，所以解是对的。`,
            ),
          ),
        });
      },
    },
  ],
};

/** solvingFirstOrderOdesBySubstitution solves y' = f(ax + by + c). */
export const solvingFirstOrderOdesBySubstitution: TopicDef = {
  id: "solving-first-order-odes-by-substitution",
  title: t("Solving First-Order ODEs by Substitution", "变量代换法解一阶常微分方程"),
  summary: t(
    "Equations of the form y' = f(ax + by + c) are transformed into separable equations using the linear substitution v = ax + by + c.",
    "形如 y' = f(ax + by + c) 的方程通过线性变量代换 v = ax + by + c 化为可分离变量的微分方程。",
  ),
  intro: t(
    "Solve $y' = (x + y)^{2}$ with $y(0) = 0$. The right side depends only on $x + y$, so let $v = x + y$. Then $v' = 1 + y' = 1 + v^{2}$, which separates: $\\arctan v = x + C$. Since $v(0) = 0$, $C = 0$, so $v = \\tan x$ and $y = \\tan x - x$.\n\nCheck: $y' = \\sec^{2}x - 1 = \\tan^{2}x$, and $(x + y)^{2} = \\tan^{2}x$; also $y(0) = 0$.\n\nIn this lesson we use a linear substitution $v = ax + by$ to turn an equation into a separable one, solve initial value problems with it, and undo the substitution at the end.",
    "求解 $y' = (x + y)^{2}$，$y(0) = 0$。右边只依赖于 $x + y$，所以令 $v = x + y$。则 $v' = 1 + y' = 1 + v^{2}$，可分离变量：$\\arctan v = x + C$。由于 $v(0) = 0$，$C = 0$，所以 $v = \\tan x$，$y = \\tan x - x$。\n\n检验：$y' = \\sec^{2}x - 1 = \\tan^{2}x$，而 $(x + y)^{2} = \\tan^{2}x$；并且 $y(0) = 0$。\n\n本课我们用线性代换 $v = ax + by$ 把方程化为可分离变量的方程，用它求解初值问题，并在最后还原代换。",
  ),
  prerequisites: ["solving-first-order-odes-using-separation-of-variables"],
  encompasses: [
    {
      topic: "solving-first-order-odes-using-separation-of-variables",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "linear-substitutions-in-first-order-odes",
      title: t("Linear substitutions in first-order ODEs", "一阶微分方程中的一次式代换"),
      explanation: t(
        "When the right side depends only on a linear combination of the variables, naming that combination as a new unknown often makes the equation separable. For $y' = (ax + by)^2$, letting $v = ax + by$ gives $\\frac{dv}{dx} = a + b y' = a + b v^2$, which is separable. For $y' = (2x + 3y)^{2}$, $v' = 2 + 3v^{2}$, so $g(1) = 5$.\n\n> **Watch out.** Differentiate all of $v$: the term $ax$ contributes $a$, and $y'$ is multiplied by $b$. Then replace $y'$ by $v^{2}$, the square, not by $v$.",
        "当右边只依赖于变量的某个线性组合时，把这个组合设为新的未知函数，方程常常变为可分离变量的。对于 $y' = (ax + by)^2$，令 $v = ax + by$ 可得 $\\frac{dv}{dx} = a + b y' = a + b v^2$，方程化为可分离变量形式。对 $y' = (2x + 3y)^{2}$，$v' = 2 + 3v^{2}$，所以 $g(1) = 5$。\n\n> **注意。** 要对整个 $v$ 求导：$ax$ 项贡献 $a$，$y'$ 要乘以 $b$。然后把 $y'$ 换成 $v^{2}$，是平方而不是 $v$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 6);
        const b = rng.int(1, 5);
        const v0 = rng.int(2, 4);
        const ans = a + b * v0 * v0;
        const lin = `${poly([a, "x"])} + ${poly([b, "y"])}`;
        return numberProblem({
          prompt: t(
            `Under the substitution $v = ${lin}$, the equation $y' = (${lin})^2$ transforms into $\\frac{dv}{dx} = g(v)$. Evaluate $g(${v0})$.`,
            `通过变量代换 $v = ${lin}$，方程 $y' = (${lin})^2$ 化为 $\\frac{dv}{dx} = g(v)$。计算 $g(${v0})$ 的值。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              b * v0 * v0,
              `That leaves out the term $${a}$ that comes from differentiating $${poly([a, "x"])}$.`,
              `这里漏掉了对 $${poly([a, "x"])}$ 求导得到的 $${a}$。`,
            ),
            why(
              a + v0 * v0,
              `That forgets to multiply $y'$ by $${b}$, the coefficient of $y$ in $v$.`,
              `这里忘了把 $y'$ 乘以 $v$ 中 $y$ 的系数 $${b}$。`,
            ),
            why(
              v0 * v0,
              "That takes $g(v)$ to be $y'$ itself; $v'$ differs from $y'$.",
              "这是把 $g(v)$ 当成 $y'$ 本身；$v'$ 与 $y'$ 不同。",
            ),
            why(
              a + b * v0,
              "That replaces $y'$ by $v$; the equation says $y' = v^{2}$.",
              "这是把 $y'$ 换成了 $v$；方程给出的是 $y' = v^{2}$。",
            ),
          ]),
          solution: walked(
            [
              [["Differentiate the substitution", "对代换求导"], t("", ""), [`\\frac{dv}{dx} = ${a} + ${b}\\frac{dy}{dx}`]],
              [
                ["Replace y' and evaluate", "替换 y' 并求值"],
                t("Since $y' = v^{2}$:", "因为 $y' = v^{2}$："),
                [`g(v) = ${a} + ${b}v^2`, `g(${v0}) = ${a} + ${b} \\cdot ${v0 * v0} = ${ans}`],
              ],
            ],
            t(
              `At the point $x = 0$, $y = \\frac{${v0}}{${b}}$ we have $v = ${v0}$ and $y' = ${v0 * v0}$, so $v' = ${a} + ${b} \\cdot ${v0 * v0} = ${ans}$.`,
              `在点 $x = 0$，$y = \\frac{${v0}}{${b}}$ 处 $v = ${v0}$，$y' = ${v0 * v0}$，所以 $v' = ${a} + ${b} \\cdot ${v0 * v0} = ${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "solving-an-initial-value-problem-by-a-linear-substitution",
      title: t("Solving an initial value problem by a linear substitution", "用线性代换求解初值问题"),
      explanation: t(
        "For $y' = (ax + y)^{2} - a$, let $v = ax + y$. Then $v' = a + y' = v^{2}$, which separates:\n\n$$-\\frac{1}{v} = x + C \\implies v = \\frac{v_0}{1 - v_0x}, \\qquad v_0 = v(0) = y(0).$$\n\nFinally undo the substitution, $y = v - ax$. For $y' = (x + y)^{2} - 1$ with $y(0) = 1$: $v = \\frac{1}{1 - x}$, so at $x = \\frac{1}{2}$, $v = 2$ and $y = 2 - \\frac{1}{2} = \\frac{3}{2}$.\n\n> **Watch out.** The answer asks for $y$, so subtract $ax$ at the end; and the denominator is $1 - v_0x$, with a minus sign from $-\\frac{1}{v}$.",
        "对 $y' = (ax + y)^{2} - a$，令 $v = ax + y$。则 $v' = a + y' = v^{2}$，可分离变量：\n\n$$-\\frac{1}{v} = x + C \\implies v = \\frac{v_0}{1 - v_0x}, \\qquad v_0 = v(0) = y(0).$$\n\n最后还原代换，$y = v - ax$。对 $y' = (x + y)^{2} - 1$，$y(0) = 1$：$v = \\frac{1}{1 - x}$，所以在 $x = \\frac{1}{2}$ 处 $v = 2$，$y = 2 - \\frac{1}{2} = \\frac{3}{2}$。\n\n> **注意。** 题目求的是 $y$，所以最后要减去 $ax$；分母是 $1 - v_0x$，其中的负号来自 $-\\frac{1}{v}$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 4);
        const y0 = rng.pick([-3, -2, -1, 1, 2, 3]);
        const m = rng.int(Math.abs(y0) + 1, Math.abs(y0) + 5);
        const x1 = Q.of(1, m);
        const v = Q.of(y0).div(Q.one.sub(Q.of(y0).mul(x1)));
        const ans = v.sub(Q.of(a).mul(x1));
        const ax = a === 1 ? "x" : `${a}x`;
        const den = `1 ${y0 > 0 ? "-" : "+"} ${Math.abs(y0) === 1 ? "" : Math.abs(y0)}x`;
        return numberProblem({
          prompt: t(
            `Solve $y' = (${ax} + y)^{2} - ${a}$ with $y(0) = ${y0}$, and find $y\\left(\\frac{1}{${m}}\\right)$.`,
            `求解 $y' = (${ax} + y)^{2} - ${a}$，$y(0) = ${y0}$，并求 $y\\left(\\frac{1}{${m}}\\right)$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(v, `That is $v$, not $y$; undo the substitution by subtracting $${ax}$.`, `这是 $v$ 而不是 $y$；要减去 $${ax}$ 还原代换。`),
            why(
              Q.of(y0)
                .div(Q.one.add(Q.of(y0).mul(x1)))
                .sub(Q.of(a).mul(x1)),
              "The sign in the denominator is flipped; $-\\frac{1}{v} = x + C$ gives $1 - v_0x$.",
              "分母中的符号反了；由 $-\\frac{1}{v} = x + C$ 得到 $1 - v_0x$。",
            ),
            why(
              Q.of(y0).sub(Q.of(a).mul(x1)),
              "That keeps $v$ at its starting value; $v$ changes, since $v' = v^{2}$.",
              "这是让 $v$ 停留在初值；由于 $v' = v^{2}$，$v$ 会变化。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Substitute", "代换"],
                t(
                  `With $v = ${ax} + y$, $v' = ${a} + y' = v^{2}$, and $v(0) = ${y0}$.`,
                  `令 $v = ${ax} + y$，则 $v' = ${a} + y' = v^{2}$，$v(0) = ${y0}$。`,
                ),
              ],
              [
                ["Separate and solve for v", "分离变量解出 v"],
                t(
                  `$-\\frac{1}{v} = x + C$ with $C = ${Q.of(-1, y0).toLatex()}$, so`,
                  `$-\\frac{1}{v} = x + C$，其中 $C = ${Q.of(-1, y0).toLatex()}$，所以`,
                ),
                [`v = \\frac{${y0}}{${den}}`],
              ],
              [
                ["Evaluate and undo the substitution", "求值并还原代换"],
                t(`At $x = \\frac{1}{${m}}$, $v = ${v.toLatex()}$, so`, `当 $x = \\frac{1}{${m}}$ 时 $v = ${v.toLatex()}$，所以`),
                [`y = ${v.toLatex()} - ${a} \\cdot \\frac{1}{${m}} = ${ans.toLatex()}`],
              ],
            ],
            t(
              `$v = \\frac{${y0}}{${den}}$ equals $${y0}$ at $x = 0$, and its derivative $\\frac{${y0 * y0}}{(${den})^{2}}$ is $v^{2}$, as required.`,
              `$v = \\frac{${y0}}{${den}}$ 在 $x = 0$ 处等于 $${y0}$，其导数 $\\frac{${y0 * y0}}{(${den})^{2}}$ 正是 $v^{2}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** furtherSolvingFirstOrderOdesBySubstitution applies nonlinear substitutions. */
export const furtherSolvingFirstOrderOdesBySubstitution: TopicDef = {
  id: "further-solving-first-order-odes-by-substitution",
  title: t("Further Solving First-Order ODEs by Substitution", "变量代换法的深入应用"),
  summary: t(
    "Nonlinear substitutions such as $u = \\ln y$ or $u = y^2$ turn harder equations into separable or linear ones.",
    "非线性代换（如 $u = \\ln y$ 或 $u = y^2$）把较难的方程化为可分离或线性方程。",
  ),
  intro: t(
    "Solve $y' = y(6 - 2\\ln y)$ for $y > 0$. Let $u = \\ln y$, so $u' = \\frac{y'}{y} = 6 - 2u$, a linear equation. Its solutions are $u = 3 + Ce^{-2x}$, so $\\ln y \\to 3$ and $y \\to e^{3}$ for every positive start.\n\nCheck: the constant $y = e^{3}$ has $\\ln y = 3$, so the right side is $e^{3}(6 - 6) = 0 = y'$.\n\nIn this lesson we use substitutions such as $u = \\ln y$ to turn nonlinear equations into linear ones, and read the long-run behavior from the result.",
    "在 $y > 0$ 上求解 $y' = y(6 - 2\\ln y)$。令 $u = \\ln y$，则 $u' = \\frac{y'}{y} = 6 - 2u$，这是线性方程。其解为 $u = 3 + Ce^{-2x}$，所以对每个正初值都有 $\\ln y \\to 3$，$y \\to e^{3}$。\n\n检验：常数 $y = e^{3}$ 满足 $\\ln y = 3$，所以右边为 $e^{3}(6 - 6) = 0 = y'$。\n\n本课我们用 $u = \\ln y$ 等代换把非线性方程化为线性方程，并由结果读出长期行为。",
  ),
  prerequisites: ["solving-first-order-odes-by-substitution"],
  encompasses: [{ topic: "solving-first-order-odes-by-substitution", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "logarithmic-and-power-substitutions",
      title: t("Logarithmic and power substitutions", "对数与幂次变量代换技巧"),
      explanation: t(
        "A substitution is useful when the derivative of the new unknown turns the equation into a form you already know how to solve, such as a linear equation. For $y' = y(a - b \\ln y)$, setting $u = \\ln y$ gives $u' = \\frac{y'}{y} = a - b u$, which is linear and separable. For $y' = y(6 - 2\\ln y)$, $h(u) = 6 - 2u$ and $h(1) = 4$.\n\n> **Watch out.** Dividing $y'$ by $y$ cancels the factor $y$ and leaves $a - bu$: keep the minus sign and the coefficient $b$ on $u$.",
        "当新未知函数的导数能把方程化成已经会解的形式（例如线性方程）时，这种换元就很有用。对于方程 $y' = y(a - b \\ln y)$，令 $u = \\ln y$ 可得 $u' = \\frac{y'}{y} = a - b u$，方程转化为线性且可分离形式。对 $y' = y(6 - 2\\ln y)$，$h(u) = 6 - 2u$，$h(1) = 4$。\n\n> **注意。** $y'$ 除以 $y$ 后消去因子 $y$，剩下 $a - bu$：要保留负号和 $u$ 的系数 $b$。",
      ),
      generate(rng: Rng): Problem {
        const b = rng.int(2, 6);
        const k = rng.int(2, 6);
        const a = k * b;
        const u0 = rng.int(1, 5);
        const ans = a - b * u0;
        return numberProblem({
          prompt: t(
            `Let $u = \\ln y$. The equation $y' = y(${a} - ${b}\\ln y)$ transforms into $u' = h(u)$. Evaluate $h(${u0})$.`,
            `令 $u = \\ln y$。微分方程 $y' = y(${a} - ${b}\\ln y)$ 变换为 $u' = h(u)$。计算 $h(${u0})$ 的值。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              a + b * u0,
              `The sign of the $u$ term is flipped; the equation has $-${b}\\ln y$.`,
              `$u$ 项的符号反了；方程中是 $-${b}\\ln y$。`,
            ),
            why(a - u0, `That drops the coefficient $${b}$ of $\\ln y$.`, `这里丢掉了 $\\ln y$ 的系数 $${b}$。`),
            why(-ans, "The subtraction is reversed; $h(u) = a - bu$, in that order.", "减法顺序反了；$h(u) = a - bu$。"),
          ]),
          solution: walked(
            [
              [
                ["Differentiate the substitution", "对代换求导"],
                t("", ""),
                [`u' = \\frac{y'}{y} = \\frac{y(${a} - ${b}\\ln y)}{y} = ${a} - ${b}u`],
              ],
              [["Evaluate", "求值"], t("", ""), [`h(${u0}) = ${a} - ${b} \\cdot ${u0} = ${ans}`]],
            ],
            t(
              `At $y = e^{${u0}}$, $y' = e^{${u0}}(${a} - ${b * u0}) = ${ans}e^{${u0}}$, and dividing by $y = e^{${u0}}$ gives $${ans}$.`,
              `在 $y = e^{${u0}}$ 处 $y' = e^{${u0}}(${a} - ${b * u0}) = ${ans}e^{${u0}}$，除以 $y = e^{${u0}}$ 得 $${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-long-run-behavior-after-a-logarithmic-substitution",
      title: t("The long-run behavior after a logarithmic substitution", "对数代换后的长期行为"),
      explanation: t(
        "For $y' = y(a - b\\ln y)$ with $y > 0$, the substitution $u = \\ln y$ gives $u' = \\frac{y'}{y} = a - bu$, a linear equation with solution $u = \\frac{a}{b} + Ce^{-bx}$.\n\nFor $b > 0$ the exponential dies out, so $\\ln y \\to \\frac{a}{b}$ and $y \\to e^{a/b}$ whatever the positive starting value. This is the Gompertz growth law. For $y' = y(6 - 4\\ln y)$, $\\ln y \\to \\frac{3}{2}$.\n\n> **Watch out.** The limit of $\\ln y$ is $\\frac{a}{b}$: divide $a$ by $b$, keep the sign of $a$, and ignore the starting value, which only fixes $C$.",
        "对 $y > 0$ 的 $y' = y(a - b\\ln y)$，代换 $u = \\ln y$ 得 $u' = \\frac{y'}{y} = a - bu$，这是线性方程，解为 $u = \\frac{a}{b} + Ce^{-bx}$。\n\n当 $b > 0$ 时指数项消失，所以无论正初值是多少，都有 $\\ln y \\to \\frac{a}{b}$，$y \\to e^{a/b}$。这就是冈珀茨增长律。对 $y' = y(6 - 4\\ln y)$，$\\ln y \\to \\frac{3}{2}$。\n\n> **注意。** $\\ln y$ 的极限是 $\\frac{a}{b}$：用 $a$ 除以 $b$，保留 $a$ 的符号，不必理会初值，它只确定 $C$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(-6, 12) || 5;
        let b = rng.int(2, 8);
        if (Math.abs(a) === b) b += 1;
        const y0 = rng.int(1, 9);
        const ans = Q.of(a, b);
        return numberProblem({
          prompt: t(
            `$y > 0$ satisfies $y' = y(${a} - ${b}\\ln y)$ with $y(0) = ${y0}$. Find $\\lim_{x \\to \\infty} \\ln y(x)$.`,
            `$y > 0$ 满足 $y' = y(${a} - ${b}\\ln y)$，$y(0) = ${y0}$。求 $\\lim_{x \\to \\infty} \\ln y(x)$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(a, `That forgets to divide by $${b}$, the coefficient of $u$.`, `这里忘了除以 $u$ 的系数 $${b}$。`),
            why(
              Q.of(b, a),
              "That divides the wrong way round; the equilibrium of $u' = a - bu$ is $\\frac{a}{b}$.",
              "这是除反了；$u' = a - bu$ 的平衡点是 $\\frac{a}{b}$。",
            ),
            why(ans.neg(), "The sign is flipped; set $a - bu = 0$ and solve.", "符号反了；令 $a - bu = 0$ 再求解。"),
          ]),
          solution: walked(
            [
              [
                ["Substitute", "代换"],
                t("With $u = \\ln y$:", "令 $u = \\ln y$："),
                [`u' = ${a} - ${b}u`, `u = ${ans.toLatex()} + Ce^{-${b}x}`],
              ],
              [
                ["Let x grow", "令 x 增大"],
                t(
                  `Since $e^{-${b}x} \\to 0$, $\\ln y \\to ${ans.toLatex()}$, whatever $y(0) = ${y0}$ is.`,
                  `由于 $e^{-${b}x} \\to 0$，$\\ln y \\to ${ans.toLatex()}$，与 $y(0) = ${y0}$ 无关。`,
                ),
              ],
            ],
            t(
              `$u = ${ans.toLatex()}$ is an equilibrium: $${a} - ${b} \\cdot ${ans.toLatex()} = 0$.`,
              `$u = ${ans.toLatex()}$ 是平衡点：$${a} - ${b} \\cdot ${ans.toLatex()} = 0$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** reducingOdesToFirstOrderLinearBySubstitution reduces equations to linear form. */
export const reducingOdesToFirstOrderLinearBySubstitution: TopicDef = {
  id: "reducing-odes-to-first-order-linear-by-substitution",
  title: t("Reducing ODEs to First-Order Linear by Substitution", "通过代换将微分方程化为一阶线性方程"),
  summary: t(
    "Differential equations of the form f'(y) y' + P(x) f(y) = Q(x) transform directly into linear ODEs v' + P(x) v = Q(x) via v = f(y).",
    "形如 f'(y) y' + P(x) f(y) = Q(x) 的微分方程通过变量代换 v = f(y) 可直接化为一阶线性常微分方程 v' + P(x) v = Q(x)。",
  ),
  intro: t(
    "Solve $e^{y}y' + 2e^{y} = 4$ with $y(0) = 0$. Both $e^{y}$ and its derivative $e^{y}y'$ appear, so let $v = e^{y}$: then $v' + 2v = 4$, with $v(0) = e^{0} = 1$. So $v = 2 + Ce^{-2x}$ with $C = -1$, and $y = \\ln\\left(2 - e^{-2x}\\right)$.\n\nCheck: $e^{y} = 2 - e^{-2x}$, so $e^{y}y' = (e^{y})' = 2e^{-2x}$ and $e^{y}y' + 2e^{y} = 2e^{-2x} + 4 - 2e^{-2x} = 4$.\n\nIn this lesson we spot an expression whose derivative also appears, make it the new unknown so the equation becomes linear, and solve.",
    "求解 $e^{y}y' + 2e^{y} = 4$，$y(0) = 0$。$e^{y}$ 及其导数 $e^{y}y'$ 都出现了，所以令 $v = e^{y}$：则 $v' + 2v = 4$，$v(0) = e^{0} = 1$。所以 $v = 2 + Ce^{-2x}$，$C = -1$，$y = \\ln\\left(2 - e^{-2x}\\right)$。\n\n检验：$e^{y} = 2 - e^{-2x}$，所以 $e^{y}y' = (e^{y})' = 2e^{-2x}$，$e^{y}y' + 2e^{y} = 2e^{-2x} + 4 - 2e^{-2x} = 4$。\n\n本课我们找出导数也出现在方程中的式子，把它设为新的未知函数使方程变为线性，再求解。",
  ),
  prerequisites: ["further-solving-first-order-odes-by-substitution"],
  encompasses: [
    {
      topic: "further-solving-first-order-odes-by-substitution",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "transforming-to-linear-form-via-functional-substitutions",
      title: t("Transforming to linear form via functional substitutions", "利用函数代换化为一阶线性微分方程"),
      explanation: t(
        "If one expression and its derivative both appear in the equation, letting that expression be the new unknown makes the equation linear. For $e^y y' + a e^y = b$, setting $v = e^y$ yields $v' + a v = b$. The steady-state value of $v$ as $x \\to \\infty$ is $\\frac{b}{a}$. For $e^{y}y' + 2e^{y} = 6$, $v \\to 3$, so $y \\to \\ln 3$.\n\n> **Watch out.** The steady state found is that of $v = e^{y}$, namely $\\frac{b}{a}$; divide $b$ by $a$, not the other way round.",
        "如果某个式子及其导数都出现在方程中，把这个式子设为新的未知函数，方程就变成线性的。对于方程 $e^y y' + a e^y = b$，令 $v = e^y$ 得 $v' + a v = b$。当 $x \\to \\infty$ 时 $v$ 的稳态值为 $\\frac{b}{a}$。对 $e^{y}y' + 2e^{y} = 6$，$v \\to 3$，所以 $y \\to \\ln 3$。\n\n> **注意。** 求出的稳态是 $v = e^{y}$ 的稳态，即 $\\frac{b}{a}$；要用 $b$ 除以 $a$，不能除反。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 6);
        const k = rng.int(2, 7);
        const b = a * k;
        return numberProblem({
          prompt: t(
            `Under the substitution $v = e^y$, the equation $e^y y' + ${a}e^y = ${b}$ transforms into a linear equation in $v$. Find the steady-state limit $\\lim_{x \\to \\infty} v(x)$.`,
            `通过变量代换 $v = e^y$，方程 $e^y y' + ${a}e^y = ${b}$ 化为关于 $v$ 的线性方程。求 $\\lim_{x \\to \\infty} v(x)$ 的稳态极限值。`,
          ),
          answer: k,
          mistakes: apart(k, [
            why(
              b,
              `That is the right side itself; the constant $v$ must satisfy $${a}v = ${b}$.`,
              `这是右边本身；常数 $v$ 必须满足 $${a}v = ${b}$。`,
            ),
            why(
              Q.of(a, b),
              "That divides the wrong way round; the steady state is $\\frac{b}{a}$.",
              "这是除反了；稳态值是 $\\frac{b}{a}$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Substitute", "代换"],
                t("With $v = e^{y}$, $v' = e^{y}y'$, so the equation becomes", "令 $v = e^{y}$，则 $v' = e^{y}y'$，方程变为"),
                [`v' + ${a}v = ${b}`],
              ],
              [
                ["Find the steady state", "求稳态"],
                t(
                  `The solutions are $v = \\frac{${b}}{${a}} + Ce^{-${a}x}$, and the exponential dies out, so $v \\to ${k}$.`,
                  `解为 $v = \\frac{${b}}{${a}} + Ce^{-${a}x}$，指数项消失，所以 $v \\to ${k}$。`,
                ),
              ],
            ],
            t(`The constant $v = ${k}$ gives $0 + ${a} \\cdot ${k} = ${b}$.`, `常数 $v = ${k}$ 给出 $0 + ${a} \\cdot ${k} = ${b}$。`),
          ),
        });
      },
    },
    {
      id: "solving-with-the-substitution-v-equals-y-squared",
      title: t("Solving with the substitution $v = y^{2}$", "用代换 $v = y^{2}$ 求解"),
      explanation: t(
        "Since $(y^{2})' = 2yy'$, the equation $2yy' + ay^{2} = b$ becomes $v' + av = b$ for $v = y^{2}$. Its solution is\n\n$$v = \\frac{b}{a} + \\left(y_0^{2} - \\frac{b}{a}\\right)e^{-ax},$$\n\nand $y = \\sqrt{v}$ for a positive solution. For $2yy' + 2y^{2} = 6$ with $y(0) = 1$: $v = 3 - 2e^{-2x}$, so at $x = \\frac{\\ln 2}{2}$, $y^{2} = 3 - 1 = 2$.\n\n> **Watch out.** The initial value of $v$ is $y_0^{2}$, not $y_0$; and at $x = \\frac{\\ln 2}{a}$ only the distance from the steady state $\\frac{b}{a}$ is halved.",
        "由于 $(y^{2})' = 2yy'$，令 $v = y^{2}$，方程 $2yy' + ay^{2} = b$ 化为 $v' + av = b$。其解为\n\n$$v = \\frac{b}{a} + \\left(y_0^{2} - \\frac{b}{a}\\right)e^{-ax},$$\n\n对正解有 $y = \\sqrt{v}$。对 $2yy' + 2y^{2} = 6$，$y(0) = 1$：$v = 3 - 2e^{-2x}$，所以在 $x = \\frac{\\ln 2}{2}$ 处 $y^{2} = 3 - 1 = 2$。\n\n> **注意。** $v$ 的初值是 $y_0^{2}$，不是 $y_0$；在 $x = \\frac{\\ln 2}{a}$ 处减半的只是与稳态 $\\frac{b}{a}$ 的距离。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 5);
        const y0 = rng.int(2, 6);
        // k = y0^2 would be the constant solution, with no exponential term left to halve.
        const k = rng.pick([1, 2, 3, 5, 6, 7, 8, 10, 11, 12].filter((v) => v !== y0 * y0));
        const ans = Q.of(k + y0 * y0, 2);
        const half = Q.of(y0 * y0 - k, 2);
        return numberProblem({
          prompt: t(
            `$y > 0$ satisfies $2yy' + ${a}y^{2} = ${a * k}$ with $y(0) = ${y0}$. Find $\\left[y\\left(\\frac{\\ln 2}{${a}}\\right)\\right]^{2}$.`,
            `$y > 0$ 满足 $2yy' + ${a}y^{2} = ${a * k}$，$y(0) = ${y0}$。求 $\\left[y\\left(\\frac{\\ln 2}{${a}}\\right)\\right]^{2}$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              Q.of(k + y0, 2),
              `That starts $v$ at $${y0}$; since $v = y^{2}$, $v(0) = ${y0 * y0}$.`,
              `这是让 $v$ 从 $${y0}$ 开始；由于 $v = y^{2}$，$v(0) = ${y0 * y0}$。`,
            ),
            why(k, "That is the steady state, reached only as $x \\to \\infty$.", "这是稳态值，只有 $x \\to \\infty$ 时才达到。"),
            why(
              Q.of(y0 * y0, 2),
              "That halves all of $v(0)$; only its distance from the steady state is halved.",
              "这是把整个 $v(0)$ 减半；减半的只是它与稳态的距离。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Substitute", "代换"],
                t(`With $v = y^{2}$, $v' = 2yy'$, so`, `令 $v = y^{2}$，则 $v' = 2yy'$，所以`),
                [`v' + ${a}v = ${a * k}, \\quad v(0) = ${y0 * y0}`],
              ],
              [["Solve the linear equation", "解线性方程"], t("", ""), [`v = ${k} ${signed(y0 * y0 - k)}e^{-${a}x}`]],
              [
                ["Evaluate", "求值"],
                t(
                  `At $x = \\frac{\\ln 2}{${a}}$, $e^{-${a}x} = \\frac{1}{2}$, so`,
                  `当 $x = \\frac{\\ln 2}{${a}}$ 时 $e^{-${a}x} = \\frac{1}{2}$，所以`,
                ),
                [`y^{2} = v = ${k} ${signedQ(half)} = ${ans.toLatex()}`],
              ],
            ],
            t(
              `The distance of $v$ from the steady state $${k}$ went from $${y0 * y0 - k}$ to $${half.toLatex()}$, half of it, as one halving time requires.`,
              `$v$ 与稳态 $${k}$ 的距离从 $${y0 * y0 - k}$ 变为 $${half.toLatex()}$，恰好减半，符合一个减半时间。`,
            ),
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 1.2 Special First-Order Equations
// ---------------------------------------------------------------------------

/** homogeneousFunctions defines f(tx, ty) = t^n f(x, y). */
export const homogeneousFunctions: TopicDef = {
  id: "homogeneous-functions",
  title: t("Homogeneous Functions", "齐次函数"),
  summary: t(
    "A function $f(x, y)$ is homogeneous of degree $n$ if $f(tx, ty) = t^n f(x, y)$ for all $t > 0$.",
    "若对任意 $t > 0$ 都有 $f(tx, ty) = t^n f(x, y)$，则称 $f(x, y)$ 为 $n$ 次齐次函数。",
  ),
  intro: t(
    "Is $f(x, y) = x^{2} + 3xy$ homogeneous? Scaling both inputs by $t$ gives $f(tx, ty) = t^{2}x^{2} + 3t^{2}xy = t^{2}f(x, y)$, so it is homogeneous of degree $2$. Since $f(1, 1) = 4$, the value at $(2, 2) = 2(1, 1)$ is $2^{2} \\cdot 4 = 16$.\n\nCheck: directly, $f(2, 2) = 4 + 12 = 16$.\n\nIn this lesson we find the degree of a homogeneous function, scale its values along rays, and meet Euler's theorem.",
    "$f(x, y) = x^{2} + 3xy$ 是齐次函数吗？把两个自变量都乘以 $t$ 得 $f(tx, ty) = t^{2}x^{2} + 3t^{2}xy = t^{2}f(x, y)$，所以它是 $2$ 次齐次函数。由于 $f(1, 1) = 4$，在 $(2, 2) = 2(1, 1)$ 处的值是 $2^{2} \\cdot 4 = 16$。\n\n检验：直接计算，$f(2, 2) = 4 + 12 = 16$。\n\n本课我们求齐次函数的次数，沿射线缩放它的值，并学习欧拉定理。",
  ),
  prerequisites: ["introduction-to-first-order-linear-odes"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "determining-the-degree-of-homogeneity",
      title: t("Determining the degree of homogeneity", "确定多项式齐次函数的齐次次数"),
      explanation: t(
        "A function is homogeneous of some degree when scaling both inputs by the same factor scales the output by a fixed power of that factor. For $f(x, y) = a x^p y^q + b x^{p+q}$, scaling by $t$ gives $f(tx, ty) = a (tx)^p (ty)^q + b (tx)^{p+q} = t^{p+q} f(x, y)$, so the degree of homogeneity is $n = p + q$. For example, $4x^{2}y^{3} + x^{5}$ has degree $5$.\n\n> **Watch out.** The degree of a term $x^{p}y^{q}$ is the sum $p + q$ of its exponents, not one exponent alone and not their product.",
        "如果把两个自变量都乘以同一个因子时，函数值乘以这个因子的固定次幂，那么函数就是该次齐次的。对于 $f(x, y) = a x^p y^q + b x^{p+q}$，代入缩放系数 $t$ 得 $f(tx, ty) = t^{p+q} f(x, y)$，因此其齐次次数为 $n = p + q$。例如 $4x^{2}y^{3} + x^{5}$ 的次数是 $5$。\n\n> **注意。** 项 $x^{p}y^{q}$ 的次数是指数之和 $p + q$，不是其中一个指数，也不是指数之积。",
      ),
      generate(rng: Rng): Problem {
        const p = rng.int(1, 5);
        const q = rng.int(1, 5);
        const n = p + q;
        const a = rng.int(2, 7);
        const b = rng.int(2, 7);
        const monomial = `${a}x${p === 1 ? "" : `^{${p}}`}y${q === 1 ? "" : `^{${q}}`}`;
        const bx = `${poly([b, "x"])}^{${n}}`;
        return numberProblem({
          prompt: t(
            `Determine the degree of homogeneity $n$ of the function $f(x, y) = ${monomial} + ${bx}$.`,
            `确定函数 $f(x, y) = ${monomial} + ${bx}$ 的齐次次数 $n$。`,
          ),
          answer: n,
          mistakes: apart(n, [
            why(
              p,
              "That is only the exponent of $x$ in the first term; the exponent of $y$ counts too.",
              "这只是第一项中 $x$ 的指数；$y$ 的指数也要算上。",
            ),
            why(
              q,
              "That is only the exponent of $y$ in the first term; the exponent of $x$ counts too.",
              "这只是第一项中 $y$ 的指数；$x$ 的指数也要算上。",
            ),
            why(p * q, "That multiplies the exponents; the degree of a term adds them.", "这是把指数相乘；一项的次数是指数相加。"),
          ]),
          solution: walked(
            [
              [["Scale both inputs", "缩放两个自变量"], t("", ""), [`f(tx, ty) = ${a}(tx)^{${p}}(ty)^{${q}} + ${b}(tx)^{${n}}`]],
              [
                ["Factor out the power of t", "提出 t 的幂"],
                t("", ""),
                [`f(tx, ty) = t^{${p} + ${q}}\\left(${monomial}\\right) + t^{${n}}\\left(${bx}\\right) = t^{${n}}f(x, y)`, `n = ${n}`],
              ],
            ],
            t(
              `The second term $${bx}$ has degree $${n}$ as well, so both terms agree, as they must for $f$ to be homogeneous.`,
              `第二项 $${bx}$ 的次数也是 $${n}$，两项一致，这正是 $f$ 为齐次函数所必需的。`,
            ),
          ),
        });
      },
    },
    {
      id: "scaling-a-homogeneous-function",
      title: t("Scaling a homogeneous function", "齐次函数的缩放"),
      explanation: t(
        "If $f$ is homogeneous of degree $n$, one value fixes $f$ along the whole ray through that point: $f(tx, ty) = t^{n}f(x, y)$. For example, if $f$ has degree $3$ and $f(1, 2) = 5$, then $f(2, 4) = 2^{3} \\cdot 5 = 40$. The degree may be negative or zero; degree $0$ means $f$ is constant along rays, which is exactly the case $f(x, y) = F\\left(\\frac{y}{x}\\right)$.\n\n> **Watch out.** The factor $t$ is raised to the power $n$: $f(tx, ty)$ is $t^{n}f(x, y)$, not $tf(x, y)$ or $ntf(x, y)$. Find $t$ by comparing the two points first.",
        "若 $f$ 是 $n$ 次齐次函数，一个函数值就确定了 $f$ 在过该点的整条射线上的值：$f(tx, ty) = t^{n}f(x, y)$。例如，若 $f$ 为 $3$ 次且 $f(1, 2) = 5$，则 $f(2, 4) = 2^{3} \\cdot 5 = 40$。次数可以是负数或零；$0$ 次意味着 $f$ 沿射线为常数，这正是 $f(x, y) = F\\left(\\frac{y}{x}\\right)$ 的情形。\n\n> **注意。** 因子 $t$ 要取 $n$ 次幂：$f(tx, ty)$ 是 $t^{n}f(x, y)$，不是 $tf(x, y)$，也不是 $ntf(x, y)$。先比较两个点求出 $t$。",
      ),
      generate(rng: Rng): Problem {
        const n = rng.int(-2, 4);
        const tq = rng.pick([Q.of(2), Q.of(3), Q.of(1, 2), Q.of(-2)]);
        const x0 = rng.int(1, 4);
        const y0 = rng.int(-3, 5);
        const c = rng.int(-6, 9) || 4;
        const ans = tq.pow(n).mul(Q.of(c));
        const sx = tq.mul(Q.of(x0));
        const sy = tq.mul(Q.of(y0));
        const scale = n === 1 ? "t" : `t^{${n}}`;
        const power = n === 1 ? tq.toLatex() : `\\left(${tq.toLatex()}\\right)^{${n}}`;
        const back = n === 1 ? Q.one.div(tq).toLatex() : `\\left(${Q.one.div(tq).toLatex()}\\right)^{${n}}`;
        return numberProblem({
          prompt: t(
            `$f(x, y)$ is homogeneous of degree $${n}$ in the sense $f(tx, ty) = ${scale}f(x, y)$ for all $t \\ne 0$, and $f(${x0}, ${y0}) = ${c}$. Find $f(${sx.toLatex()}, ${sy.toLatex()})$.`,
            `$f(x, y)$ 是 $${n}$ 次齐次函数，即对所有 $t \\ne 0$ 有 $f(tx, ty) = ${scale}f(x, y)$，且 $f(${x0}, ${y0}) = ${c}$。求 $f(${sx.toLatex()}, ${sy.toLatex()})$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              tq.mul(Q.of(c)),
              "That multiplies by $t$ once; the degree says to multiply by $t^{n}$.",
              "这是只乘了一次 $t$；次数要求乘以 $t^{n}$。",
            ),
            why(
              Q.of(n).mul(tq).mul(Q.of(c)),
              "That multiplies by $n$ times $t$; the degree is a power of $t$, not a factor.",
              "这是乘以 $n$ 倍的 $t$；次数是 $t$ 的幂指数，而不是乘数。",
            ),
            why(
              tq.pow(n),
              "That is only the scale factor $t^{n}$; it multiplies the given value of $f$.",
              "这只是缩放因子 $t^{n}$；它还要乘以已知的 $f$ 值。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the scale factor", "求缩放因子"],
                t(
                  `$(${sx.toLatex()}, ${sy.toLatex()}) = t(${x0}, ${y0})$ with $t = ${tq.toLatex()}$.`,
                  `$(${sx.toLatex()}, ${sy.toLatex()}) = t(${x0}, ${y0})$，其中 $t = ${tq.toLatex()}$。`,
                ),
              ],
              [
                ["Scale the value", "缩放函数值"],
                t("", ""),
                [`f(${sx.toLatex()}, ${sy.toLatex()}) = ${power} \\cdot ${par(c)} = ${ans.toLatex()}`],
              ],
            ],
            t(
              `Scaling back by $\\frac{1}{t} = ${Q.one.div(tq).toLatex()}$ returns the given value: $${back} \\cdot ${ans.sign() < 0 ? `(${ans.toLatex()})` : ans.toLatex()} = ${c}$.`,
              `再按 $\\frac{1}{t} = ${Q.one.div(tq).toLatex()}$ 缩放回去，得到已知值：$${back} \\cdot ${ans.sign() < 0 ? `(${ans.toLatex()})` : ans.toLatex()} = ${c}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** homogeneousFirstOrderOdes solves y' = F(y/x) using y = vx. */
export const homogeneousFirstOrderOdes: TopicDef = {
  id: "homogeneous-first-order-odes",
  title: t("Homogeneous First-Order ODEs", "一阶齐次常微分方程"),
  summary: t(
    "If dy/dx = F(y/x), the substitution y = v x converts the ODE into separable form x dv/dx = F(v) - v.",
    "若 dy/dx = F(y/x)，通过代换 y = v x 可将方程转化为可分离变量形式 x dv/dx = F(v) - v。",
  ),
  intro: t(
    "Solve $y' = \\frac{x + y}{x}$ for $x > 0$ with $y(1) = 2$. The right side is $1 + \\frac{y}{x}$, a function of $\\frac{y}{x}$, so put $y = vx$ and $y' = v + xv'$. Then $v + xv' = 1 + v$, so $v' = \\frac{1}{x}$ and $v = \\ln x + C$. From $v(1) = 2$, $C = 2$, so $y = x\\ln x + 2x$.\n\nCheck: $y' = \\ln x + 1 + 2 = \\ln x + 3$, and $\\frac{x + y}{x} = 1 + \\ln x + 2 = \\ln x + 3$.\n\nIn this lesson we recognise equations $y' = F\\left(\\frac{y}{x}\\right)$, separate them with $y = vx$, and solve initial value problems.",
    "在 $x > 0$ 上求解 $y' = \\frac{x + y}{x}$，$y(1) = 2$。右边是 $1 + \\frac{y}{x}$，是 $\\frac{y}{x}$ 的函数，所以令 $y = vx$，$y' = v + xv'$。则 $v + xv' = 1 + v$，所以 $v' = \\frac{1}{x}$，$v = \\ln x + C$。由 $v(1) = 2$ 得 $C = 2$，所以 $y = x\\ln x + 2x$。\n\n检验：$y' = \\ln x + 1 + 2 = \\ln x + 3$，而 $\\frac{x + y}{x} = 1 + \\ln x + 2 = \\ln x + 3$。\n\n本课我们识别形如 $y' = F\\left(\\frac{y}{x}\\right)$ 的方程，用 $y = vx$ 分离变量，并求解初值问题。",
  ),
  prerequisites: ["homogeneous-functions"],
  encompasses: [{ topic: "homogeneous-functions", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "solving-homogeneous-odes-via-v-substitution",
      title: t("Solving homogeneous ODEs via v-substitution", "利用 y = vx 代换解一阶齐次方程"),
      explanation: t(
        "In a homogeneous equation the slope depends only on the ratio of the variables, so writing the unknown as that ratio times the variable makes the equation separable. For $x y' = y + k \\frac{y^2}{x}$, setting $y = v x$ gives $x v' + v = v + k v^2$, so $x \\frac{dv}{dx} = k v^2$. Separating variables yields $-\\frac{1}{v} = k \\ln|x| + C$. With $y(1) = \\frac{1}{4}$, $v(1) = \\frac{1}{4}$, so $C = -4$.\n\n> **Watch out.** The constant comes from $-\\frac{1}{v}$ at $x = 1$, not from $v$ itself; and since $\\ln 1 = 0$, the logarithm term drops out there.",
        "在齐次方程中，斜率只取决于变量之比，所以把未知函数写成这个比值乘以自变量，方程就变为可分离变量的。对于方程 $x y' = y + k \\frac{y^2}{x}$，令 $y = v x$ 得 $x v' + v = v + k v^2$，化简为 $x \\frac{dv}{dx} = k v^2$。分离变量积分得 $-\\frac{1}{v} = k \\ln|x| + C$。若 $y(1) = \\frac{1}{4}$，则 $v(1) = \\frac{1}{4}$，所以 $C = -4$。\n\n> **注意。** 常数来自 $x = 1$ 处的 $-\\frac{1}{v}$，而不是 $v$ 本身；由于 $\\ln 1 = 0$，对数项在那里消失。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(2, 7);
        const c = rng.int(2, 8);
        return numberProblem({
          prompt: t(
            `Under the substitution $y = v x$, the homogeneous equation $x y' = y + ${k}\\frac{y^2}{x}$ integrates to $-\\frac{1}{v} = ${k}\\ln x + C$ (for $x > 0$). If $y(1) = \\frac{1}{${c}}$, find the value of the constant $-C$.`,
            `通过变量代换 $y = v x$，齐次方程 $x y' = y + ${k}\\frac{y^2}{x}$ 积分得通解 $-\\frac{1}{v} = ${k}\\ln x + C$（$x > 0$）。若初始条件为 $y(1) = \\frac{1}{${c}}$，求常数 $-C$ 的值。`,
          ),
          answer: c,
          mistakes: apart(c, [
            why(
              Q.of(1, c),
              "That is $v(1)$ itself; the constant comes from $-\\frac{1}{v}$.",
              "这是 $v(1)$ 本身；常数来自 $-\\frac{1}{v}$。",
            ),
            why(-c, "That is $C$; the question asks for $-C$.", "这是 $C$；题目求的是 $-C$。"),
            why(
              k,
              "That is the coefficient of $\\ln x$; at $x = 1$ the logarithm is zero.",
              "这是 $\\ln x$ 的系数；在 $x = 1$ 处对数为零。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find v at x = 1", "求 x = 1 处的 v"],
                t(`$v(1) = \\frac{y(1)}{1} = \\frac{1}{${c}}$.`, `$v(1) = \\frac{y(1)}{1} = \\frac{1}{${c}}$。`),
              ],
              [
                ["Substitute into the solution", "代入通解"],
                t("Since $\\ln 1 = 0$:", "由于 $\\ln 1 = 0$："),
                [`-\\frac{1}{1/${c}} = ${k} \\cdot 0 + C`, `C = -${c}, \\quad -C = ${c}`],
              ],
            ],
            t(
              `With $C = -${c}$, at $x = 1$ the solution reads $-\\frac{1}{v} = -${c}$, so $v = \\frac{1}{${c}} = y(1)$, as given.`,
              `取 $C = -${c}$，在 $x = 1$ 处通解为 $-\\frac{1}{v} = -${c}$，所以 $v = \\frac{1}{${c}} = y(1)$，与已知一致。`,
            ),
          ),
        });
      },
    },
    {
      id: "solving-a-homogeneous-initial-value-problem",
      title: t("Solving a homogeneous initial value problem", "求解齐次初值问题"),
      explanation: t(
        "Every term on the right has degree two, so the equation depends only on the ratio $\\frac{y}{x}$ and the substitution $y = vx$ separates it. For $xyy' = ax^{2} + y^{2}$ on $x > 0$, put $y = vx$, so $y' = v + xv'$. Dividing by $x^{2}$ gives $v(v + xv') = a + v^{2}$, that is $vv' = \\frac{a}{x}$. Integrating,\n\n$$\\frac{v^{2}}{2} = a\\ln x + C \\implies \\left(\\frac{y}{x}\\right)^{2} = 2a\\ln x + v_0^{2},$$\n\nwhere $v_0 = y(1)$. At $x = e^{k}$ this is $2ak + v_0^{2}$. For $xyy' = x^{2} + y^{2}$ with $y(1) = 1$, $\\left(\\frac{y(e)}{e}\\right)^{2} = 2 + 1 = 3$.\n\n> **Watch out.** Integrating $vv'$ gives $\\frac{v^{2}}{2}$, so the logarithm term is doubled: $v^{2} = 2a\\ln x + v_0^{2}$. And the constant is $v_0^{2}$, not $v_0$.",
        "右边每一项都是二次的，所以方程只依赖于比值 $\\frac{y}{x}$，代换 $y = vx$ 可使其分离变量。对 $x > 0$ 上的 $xyy' = ax^{2} + y^{2}$，令 $y = vx$，则 $y' = v + xv'$。两边除以 $x^{2}$ 得 $v(v + xv') = a + v^{2}$，即 $vv' = \\frac{a}{x}$。积分得\n\n$$\\frac{v^{2}}{2} = a\\ln x + C \\implies \\left(\\frac{y}{x}\\right)^{2} = 2a\\ln x + v_0^{2},$$\n\n其中 $v_0 = y(1)$。在 $x = e^{k}$ 处其值为 $2ak + v_0^{2}$。对 $xyy' = x^{2} + y^{2}$，$y(1) = 1$，$\\left(\\frac{y(e)}{e}\\right)^{2} = 2 + 1 = 3$。\n\n> **注意。** $vv'$ 积分得 $\\frac{v^{2}}{2}$，所以对数项要加倍：$v^{2} = 2a\\ln x + v_0^{2}$。常数是 $v_0^{2}$，不是 $v_0$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 6);
        const c = rng.int(1, 5);
        const k = rng.int(1, 4);
        const ans = 2 * a * k + c * c;
        const ek = k === 1 ? "e" : `e^{${k}}`;
        return numberProblem({
          prompt: t(
            `For $x > 0$, $y$ satisfies $xy\\,y' = ${a === 1 ? "" : a}x^{2} + y^{2}$ with $y(1) = ${c}$. Find $\\left(\\frac{y(${ek})}{${ek}}\\right)^{2}$.`,
            `在 $x > 0$ 上，$y$ 满足 $xy\\,y' = ${a === 1 ? "" : a}x^{2} + y^{2}$，$y(1) = ${c}$。求 $\\left(\\frac{y(${ek})}{${ek}}\\right)^{2}$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              a * k + c * c,
              "That forgets the factor $2$: integrating $vv'$ gives $\\frac{v^{2}}{2}$.",
              "这里漏掉了因子 $2$：$vv'$ 积分得 $\\frac{v^{2}}{2}$。",
            ),
            why(
              2 * a * k + c,
              `That uses $v_0 = ${c}$ as the constant; the constant in $v^{2}$ is $v_0^{2}$.`,
              `这是把 $v_0 = ${c}$ 当作常数；$v^{2}$ 中的常数是 $v_0^{2}$。`,
            ),
            why(2 * a + c * c, `That takes $\\ln ${ek}$ to be $1$; it is $${k}$.`, `这是把 $\\ln ${ek}$ 当成 $1$；它等于 $${k}$。`),
          ]),
          solution: walked(
            [
              [
                ["Substitute y = vx", "代换 y = vx"],
                t("Dividing by $x^{2}$ after substituting:", "代入后除以 $x^{2}$："),
                [`v(v + xv') = ${a} + v^{2}`, `vv' = \\frac{${a}}{x}`],
              ],
              [
                ["Integrate and fix the constant", "积分并确定常数"],
                t(`$\\frac{v^{2}}{2} = ${a}\\ln x + C$, and $v(1) = ${c}$:`, `$\\frac{v^{2}}{2} = ${a}\\ln x + C$，由 $v(1) = ${c}$：`),
                [`v^{2} = ${2 * a}\\ln x + ${c * c}`],
              ],
              [["Evaluate", "求值"], t("", ""), [`v(${ek})^{2} = ${2 * a} \\cdot ${k} + ${c * c} = ${ans}`]],
            ],
            t(
              `Differentiating $v^{2} = ${2 * a}\\ln x + ${c * c}$ gives $2vv' = \\frac{${2 * a}}{x}$, that is $vv' = \\frac{${a}}{x}$, and at $x = 1$ it gives $v^{2} = ${c * c}$.`,
              `对 $v^{2} = ${2 * a}\\ln x + ${c * c}$ 求导得 $2vv' = \\frac{${2 * a}}{x}$，即 $vv' = \\frac{${a}}{x}$；在 $x = 1$ 处 $v^{2} = ${c * c}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** exactDifferentialEquations tests ∂M/∂y = ∂N/∂x. */
export const exactDifferentialEquations: TopicDef = {
  id: "exact-differential-equations",
  title: t("Exact Differential Equations", "恰当微分方程"),
  summary: t(
    "A differential form M(x, y) dx + N(x, y) dy = 0 is exact if and only if ∂M/∂y = ∂N/∂x, stemming from a potential function Ψ(x, y) = C.",
    "微分形式 M(x, y) dx + N(x, y) dy = 0 恰当当且仅当 ∂M/∂y = ∂N/∂x，其解由势函数 Ψ(x, y) = C 给出。",
  ),
  intro: t(
    "Solve $(2xy + 3)\\,dx + (x^{2} + 4y)\\,dy = 0$ through $(1, 1)$. Here $M_y = 2x$ and $N_x = 2x$ agree, so the equation is exact. Integrating $M$ in $x$ gives $x^{2}y + 3x$; its $y$-derivative $x^{2}$ accounts for part of $N$, and the rest, $4y$, adds $2y^{2}$. So $\\Psi = x^{2}y + 3x + 2y^{2}$, and the solution through $(1, 1)$ is $\\Psi = 1 + 3 + 2 = 6$.\n\nCheck: $\\Psi_x = 2xy + 3 = M$ and $\\Psi_y = x^{2} + 4y = N$.\n\nIn this lesson we test equations for exactness with mixed partial derivatives, build the potential function, and find the level curve through a point.",
    "求 $(2xy + 3)\\,dx + (x^{2} + 4y)\\,dy = 0$ 过 $(1, 1)$ 的解。这里 $M_y = 2x$ 与 $N_x = 2x$ 相等，所以方程是恰当的。对 $x$ 积分 $M$ 得 $x^{2}y + 3x$；它对 $y$ 的导数 $x^{2}$ 是 $N$ 的一部分，剩下的 $4y$ 补上 $2y^{2}$。所以 $\\Psi = x^{2}y + 3x + 2y^{2}$，过 $(1, 1)$ 的解是 $\\Psi = 1 + 3 + 2 = 6$。\n\n检验：$\\Psi_x = 2xy + 3 = M$，$\\Psi_y = x^{2} + 4y = N$。\n\n本课我们用混合偏导数检验方程是否恰当，构造势函数，并求过一点的等值线。",
  ),
  prerequisites: ["gradient-vector-fields"],
  encompasses: [{ topic: "gradient-vector-fields", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "exactness-condition-and-mixed-partials",
      title: t("Exactness condition and mixed partials", "恰当微分方程的判别条件与混合偏导数"),
      explanation: t(
        "An equation is exact when its left side is the total differential of some function, and equal mixed partial derivatives are the test for this. For $M(x, y) dx + N(x, y) dy = 0$, exactness requires $\\frac{\\partial M}{\\partial y} = \\frac{\\partial N}{\\partial x}$. If $M(x, y) = 2a x y + b y^2$, then $\\frac{\\partial M}{\\partial y} = 2a x + 2b y$. For $M = 4xy + 3y^{2}$, $M_y = 4x + 6y$, which is $10$ at $(1, 1)$.\n\n> **Watch out.** $M$ is the coefficient of $dx$, and it is differentiated with respect to $y$, holding $x$ fixed. The power rule gives $\\frac{\\partial}{\\partial y}(by^{2}) = 2by$.",
        "当方程的左边是某个函数的全微分时，方程是恰当的，检验方法是看混合偏导数是否相等。对于 $M(x, y) dx + N(x, y) dy = 0$，恰当性条件为 $\\frac{\\partial M}{\\partial y} = \\frac{\\partial N}{\\partial x}$。若 $M(x, y) = 2a x y + b y^2$，则 $\\frac{\\partial M}{\\partial y} = 2a x + 2b y$。对 $M = 4xy + 3y^{2}$，$M_y = 4x + 6y$，在 $(1, 1)$ 处为 $10$。\n\n> **注意。** $M$ 是 $dx$ 的系数，要对 $y$ 求偏导，同时把 $x$ 看作常数。幂法则给出 $\\frac{\\partial}{\\partial y}(by^{2}) = 2by$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 5);
        const b = rng.int(1, 5);
        const x0 = rng.int(1, 5);
        const y0 = rng.int(1, 5);
        const ans = 2 * a * x0 + 2 * b * y0;
        const M = `${poly([2 * a, "xy"])} + ${poly([b, "y^2"])}`;
        return numberProblem({
          prompt: t(
            `For the differential equation $(${M})\\,dx + (${poly([a, "x^2"])} + ${poly([2 * b, "xy"])})\\,dy = 0$, evaluate the partial derivative $\\frac{\\partial M}{\\partial y}$ at $(x, y) = (${x0}, ${y0})$.`,
            `对于微分方程 $(${M})\\,dx + (${poly([a, "x^2"])} + ${poly([2 * b, "xy"])})\\,dy = 0$，计算偏导数 $\\frac{\\partial M}{\\partial y}$ 在点 $(x, y) = (${x0}, ${y0})$ 处的值。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              2 * a * x0 + b * y0,
              `The power rule was skipped on $${poly([b, "y^2"])}$; its $y$-derivative is $${poly([2 * b, "y"])}$.`,
              `对 $${poly([b, "y^2"])}$ 没有用幂法则；它对 $y$ 的导数是 $${poly([2 * b, "y"])}$。`,
            ),
            why(
              2 * a * y0,
              "That differentiates $M$ with respect to $x$; the test needs its $y$-derivative.",
              "这是对 $x$ 求 $M$ 的导数；判别需要的是对 $y$ 的导数。",
            ),
            why(2 * a * x0, `That drops the derivative of $${poly([b, "y^2"])}$.`, `这里漏掉了 $${poly([b, "y^2"])}$ 的导数。`),
          ]),
          solution: walked(
            [
              [
                ["Differentiate M in y", "对 y 求 M 的偏导"],
                t(`$M = ${M}$, with $x$ held fixed:`, `$M = ${M}$，把 $x$ 看作常数：`),
                [`\\frac{\\partial M}{\\partial y} = ${poly([2 * a, "x"])} + ${poly([2 * b, "y"])}`],
              ],
              [["Evaluate at the point", "在该点求值"], t("", ""), [`${2 * a}(${x0}) + ${2 * b}(${y0}) = ${ans}`]],
            ],
            t(
              `$N_x = ${poly([2 * a, "x"])} + ${poly([2 * b, "y"])}$ is the same, also $${ans}$ at the point, so the equation is exact.`,
              `$N_x = ${poly([2 * a, "x"])} + ${poly([2 * b, "y"])}$ 与之相同，在该点也等于 $${ans}$，所以方程是恰当的。`,
            ),
          ),
        });
      },
    },
    {
      id: "finding-the-potential-function-of-an-exact-equation",
      title: t("Finding the potential function of an exact equation", "求恰当方程的势函数"),
      explanation: t(
        "When $M\\,dx + N\\,dy = 0$ is exact, find $\\Psi$ with $\\Psi_x = M$ and $\\Psi_y = N$: integrate $M$ in $x$, then add only the terms of $\\int N\\,dy$ that are missing. Solutions are the level curves $\\Psi(x, y) = C$, and the curve through $(x_0, y_0)$ has $C = \\Psi(x_0, y_0)$.\n\nFor $(2xy + 3)\\,dx + (x^{2} + 4y)\\,dy = 0$: $\\Psi = x^{2}y + 3x + 2y^{2}$, and through $(1, 2)$, $C = 2 + 3 + 8 = 13$.\n\n> **Watch out.** Adding $\\int M\\,dx$ and $\\int N\\,dy$ outright counts the shared term $x^{2}y$ twice. Add only what is missing, and integrate it: $4y$ contributes $2y^{2}$.",
        "当 $M\\,dx + N\\,dy = 0$ 为恰当方程时，求满足 $\\Psi_x = M$、$\\Psi_y = N$ 的 $\\Psi$：先对 $x$ 积分 $M$，再只补上 $\\int N\\,dy$ 中缺少的项。解是等值线 $\\Psi(x, y) = C$，过 $(x_0, y_0)$ 的曲线有 $C = \\Psi(x_0, y_0)$。\n\n对 $(2xy + 3)\\,dx + (x^{2} + 4y)\\,dy = 0$：$\\Psi = x^{2}y + 3x + 2y^{2}$，过 $(1, 2)$ 时 $C = 2 + 3 + 8 = 13$。\n\n> **注意。** 直接把 $\\int M\\,dx$ 与 $\\int N\\,dy$ 相加，会把公共项 $x^{2}y$ 算两次。只补上缺少的部分，并且要积分：$4y$ 贡献 $2y^{2}$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 4);
        const b = rng.int(-6, 6) || 3;
        const c = rng.int(1, 3);
        const x0 = rng.int(-3, 3) || 2;
        const y0 = rng.int(-3, 3) || -1;
        const shared = a * x0 * x0 * y0;
        const ans = shared + b * x0 + c * y0 * y0;
        const ax2 = a === 1 ? "x^{2}" : `${a}x^{2}`;
        const cy2 = `${c === 1 ? "" : c}y^{2}`;
        return numberProblem({
          prompt: t(
            `The equation $(${2 * a}xy ${signed(b)})\\,dx + (${ax2} + ${2 * c}y)\\,dy = 0$ is exact. Its solution through $(${x0}, ${y0})$ is $\\Psi(x, y) = C$, where $\\Psi$ has no constant term. Find $C$.`,
            `方程 $(${2 * a}xy ${signed(b)})\\,dx + (${ax2} + ${2 * c}y)\\,dy = 0$ 是恰当方程。它过 $(${x0}, ${y0})$ 的解为 $\\Psi(x, y) = C$，其中 $\\Psi$ 不含常数项。求 $C$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              ans + shared,
              `That counts the term $${ax2}y$ twice; it comes from both integrations but belongs in $\\Psi$ once.`,
              `这把 $${ax2}y$ 项算了两次；两次积分都会得到它，但它在 $\\Psi$ 中只出现一次。`,
            ),
            why(ans - b * x0, `That leaves out the term $${b}x$ from integrating $M$.`, `这里漏掉了积分 $M$ 得到的 $${b}x$ 项。`),
            why(
              shared + b * x0 + 2 * c * y0 * y0,
              `That uses $${2 * c}y^{2}$; the missing part $${2 * c}y$ of $N$ integrates to $${cy2}$.`,
              `这里用了 $${2 * c}y^{2}$；$N$ 中缺少的部分 $${2 * c}y$ 积分后是 $${cy2}$。`,
            ),
          ]),
          solution: walked(
            [
              [["Integrate M in x", "对 x 积分 M"], t("", ""), [`\\int M\\,dx = ${ax2}y ${signed(b)}x`]],
              [
                ["Add the missing part of N", "补上 N 中缺少的部分"],
                t(
                  `Its $y$-derivative is $${ax2}$, so the part $${2 * c}y$ of $N$ is missing; it integrates to $${cy2}$:`,
                  `它对 $y$ 的导数是 $${ax2}$，所以 $N$ 中缺少 $${2 * c}y$；积分得 $${cy2}$：`,
                ),
                [`\\Psi = ${ax2}y ${signed(b)}x + ${cy2}`],
              ],
              [
                ["Evaluate at the point", "在该点求值"],
                t("", ""),
                [`C = \\Psi(${x0}, ${y0}) = ${shared} ${signed(b * x0)} + ${c * y0 * y0} = ${ans}`],
              ],
            ],
            t(
              `$\\Psi_x = ${2 * a}xy ${signed(b)} = M$ and $\\Psi_y = ${ax2} + ${2 * c}y = N$.`,
              `$\\Psi_x = ${2 * a}xy ${signed(b)} = M$，$\\Psi_y = ${ax2} + ${2 * c}y = N$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** solvingExactOdesUsingIntegratingFactors finds μ(x) = exp(∫(My - Nx)/N dx). */
export const solvingExactOdesUsingIntegratingFactors: TopicDef = {
  id: "solving-exact-odes-using-integrating-factors",
  title: t("Solving Exact ODEs Using Integrating Factors", "积分因子法解非恰当方程"),
  summary: t(
    "When $\\frac{M_y - N_x}{N} = f(x)$ depends only on $x$, multiplying by $\\mu(x) = \\exp\\left(\\int f(x)\\,dx\\right)$ makes the equation exact.",
    "当 $\\frac{M_y - N_x}{N} = f(x)$ 只与 $x$ 有关时，乘以积分因子 $\\mu(x) = \\exp\\left(\\int f(x)\\,dx\\right)$ 可使方程成为恰当方程。",
  ),
  intro: t(
    "Make $(3y + 2x)\\,dx + x\\,dy = 0$ exact. Here $M_y = 3$ and $N_x = 1$ differ, but $\\frac{M_y - N_x}{N} = \\frac{2}{x}$ depends on $x$ alone, so $\\mu = e^{\\int 2/x\\,dx} = x^{2}$. Multiplying gives $(3x^{2}y + 2x^{3})\\,dx + x^{3}\\,dy = 0$, with potential $\\Psi = x^{3}y + \\frac{x^{4}}{2}$.\n\nCheck: now $M_y = 3x^{2} = N_x$, and $\\Psi_x = 3x^{2}y + 2x^{3}$, $\\Psi_y = x^{3}$.\n\nIn this lesson we find integrating factors that depend on one variable, use them to make an equation exact, and then solve it.",
    "把 $(3y + 2x)\\,dx + x\\,dy = 0$ 化为恰当方程。这里 $M_y = 3$ 与 $N_x = 1$ 不相等，但 $\\frac{M_y - N_x}{N} = \\frac{2}{x}$ 只依赖于 $x$，所以 $\\mu = e^{\\int 2/x\\,dx} = x^{2}$。相乘得 $(3x^{2}y + 2x^{3})\\,dx + x^{3}\\,dy = 0$，势函数为 $\\Psi = x^{3}y + \\frac{x^{4}}{2}$。\n\n检验：现在 $M_y = 3x^{2} = N_x$，且 $\\Psi_x = 3x^{2}y + 2x^{3}$，$\\Psi_y = x^{3}$。\n\n本课我们求只依赖于一个变量的积分因子，用它把方程化为恰当方程，再求解。",
  ),
  prerequisites: ["exact-differential-equations"],
  encompasses: [{ topic: "exact-differential-equations", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "integrating-factors-as-functions-of-a-single-variable",
      title: t("Integrating factors as functions of a single variable", "一元积分因子的构造准则"),
      explanation: t(
        "When the expression that measures the failure of exactness depends on one variable alone, an integrating factor depending on that variable will fix it. If $\\frac{M_y - N_x}{N} = \\frac{k}{x}$, then the integrating factor making the equation exact is $\\mu(x) = e^{\\int \\frac{k}{x}dx} = x^k$. For $\\frac{M_y - N_x}{N} = \\frac{3}{x}$, $\\mu = x^{3}$.\n\n> **Watch out.** The factor is the exponential of the integral, $e^{\\int f\\,dx}$, not $f$ itself, and its exponent is $+\\int f\\,dx$, not $-\\int f\\,dx$.",
        "当衡量不恰当程度的式子只依赖于一个变量时，用只依赖于该变量的积分因子就能使方程恰当。若 $\\frac{M_y - N_x}{N} = \\frac{k}{x}$，则使方程变为恰当方程的积分因子为 $\\mu(x) = e^{\\int \\frac{k}{x}dx} = x^k$。对 $\\frac{M_y - N_x}{N} = \\frac{3}{x}$，$\\mu = x^{3}$。\n\n> **注意。** 积分因子是积分的指数 $e^{\\int f\\,dx}$，不是 $f$ 本身；它的指数是 $+\\int f\\,dx$，不是 $-\\int f\\,dx$。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(2, 35);
        return numberProblem({
          prompt: t(
            `For a first-order differential equation $M\\,dx + N\\,dy = 0$, suppose $\\frac{M_y - N_x}{N} = \\frac{${k}}{x}$ (for $x > 0$). Find the power $p$ in the integrating factor $\\mu(x) = x^p$.`,
            `对于一阶微分方程 $M\\,dx + N\\,dy = 0$，已知 $\\frac{M_y - N_x}{N} = \\frac{${k}}{x}$（$x > 0$）。求积分因子 $\\mu(x) = x^p$ 中的幂指数 $p$。`,
          ),
          answer: k,
          mistakes: apart(k, [
            why(-k, "The sign is flipped: the factor is $e^{+\\int f\\,dx}$.", "符号反了：积分因子是 $e^{+\\int f\\,dx}$。"),
            why(
              -1,
              `That is the power of $x$ in $\\frac{${k}}{x}$ itself; the factor is the exponential of its integral.`,
              `这是 $\\frac{${k}}{x}$ 本身中 $x$ 的幂；积分因子是它的积分的指数。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Integrate the ratio", "对比值积分"],
                t("The ratio depends on $x$ alone, so", "比值只依赖于 $x$，所以"),
                [`\\int \\frac{${k}}{x}\\,dx = ${k}\\ln x`],
              ],
              [["Exponentiate", "取指数"], t("", ""), [`\\mu(x) = e^{${k}\\ln x} = x^{${k}}`, `p = ${k}`]],
            ],
            t(
              `$\\mu = x^{${k}}$ has $\\frac{\\mu'}{\\mu} = \\frac{${k}x^{${k - 1}}}{x^{${k}}} = \\frac{${k}}{x}$, which is the condition an integrating factor in $x$ alone must meet.`,
              `$\\mu = x^{${k}}$ 满足 $\\frac{\\mu'}{\\mu} = \\frac{${k}x^{${k - 1}}}{x^{${k}}} = \\frac{${k}}{x}$，这正是只依赖于 $x$ 的积分因子必须满足的条件。`,
            ),
          ),
        });
      },
    },
    {
      id: "solving-after-making-an-equation-exact",
      title: t("Solving after making an equation exact", "化为恰当方程后求解"),
      explanation: t(
        "For $(py + qx^{j})\\,dx + x\\,dy = 0$, $\\frac{M_y - N_x}{N} = \\frac{p - 1}{x}$, so $\\mu = x^{p-1}$. Multiplying gives the exact equation $(px^{p-1}y + qx^{j+p-1})\\,dx + x^{p}\\,dy = 0$ with potential\n\n$$\\Psi = x^{p}y + \\frac{q}{j + p}x^{j+p}.$$\n\nThe solution through a point keeps $\\Psi$ at its value there; solve $\\Psi = C$ for $y$ at the new $x$. For $(2y + 3x)\\,dx + x\\,dy = 0$ with $y(1) = 0$: $\\mu = x$, $\\Psi = x^{2}y + x^{3}$, $C = 1$, and at $x = 2$, $4y + 8 = 1$, so $y = -\\frac{7}{4}$.\n\n> **Watch out.** Both terms of $\\Psi$ change with $x$: at the new $x$, $y$ is multiplied by $2^{p}$ and the other term becomes $\\frac{q}{j + p}2^{j + p}$. Use $C$ from the starting point, not $y(1)$ itself.",
        "对 $(py + qx^{j})\\,dx + x\\,dy = 0$，$\\frac{M_y - N_x}{N} = \\frac{p - 1}{x}$，所以 $\\mu = x^{p-1}$。相乘得恰当方程 $(px^{p-1}y + qx^{j+p-1})\\,dx + x^{p}\\,dy = 0$，势函数为\n\n$$\\Psi = x^{p}y + \\frac{q}{j + p}x^{j+p}.$$\n\n过某点的解使 $\\Psi$ 保持该点处的值；在新的 $x$ 处由 $\\Psi = C$ 解出 $y$。对 $(2y + 3x)\\,dx + x\\,dy = 0$，$y(1) = 0$：$\\mu = x$，$\\Psi = x^{2}y + x^{3}$，$C = 1$，在 $x = 2$ 处 $4y + 8 = 1$，所以 $y = -\\frac{7}{4}$。\n\n> **注意。** $\\Psi$ 的两项都随 $x$ 变化：在新的 $x$ 处，$y$ 要乘以 $2^{p}$，另一项变为 $\\frac{q}{j + p}2^{j + p}$。要用起点处的 $C$，而不是 $y(1)$ 本身。",
      ),
      generate(rng: Rng): Problem {
        const p = rng.int(2, 3);
        const j = rng.int(1, 2);
        const s = rng.int(1, 3);
        const q = s * (j + p);
        const y0 = rng.int(-4, 6);
        const C = y0 + s;
        const rest = s * 2 ** (j + p);
        const ans = Q.of(C - rest, 2 ** p);
        const xj = j === 1 ? "x" : `x^{${j}}`;
        const sx = `${s === 1 ? "" : s}x^{${j + p}}`;
        const xp1 = p === 2 ? "x" : `x^{${p - 1}}`;
        return numberProblem({
          prompt: t(
            `Make $(${p}y + ${q}${xj})\\,dx + x\\,dy = 0$ exact with an integrating factor $\\mu(x)$, and find $y(2)$ for the solution with $y(1) = ${y0}$.`,
            `用积分因子 $\\mu(x)$ 把 $(${p}y + ${q}${xj})\\,dx + x\\,dy = 0$ 化为恰当方程，并对满足 $y(1) = ${y0}$ 的解求 $y(2)$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              Q.of(C - rest, 2),
              `That divides by $2$; at $x = 2$ the coefficient of $y$ is $2^{${p}} = ${2 ** p}$.`,
              `这是除以 $2$；在 $x = 2$ 处 $y$ 的系数是 $2^{${p}} = ${2 ** p}$。`,
            ),
            why(
              Q.of(y0, 2 ** p),
              `That uses $y(1)$ as the level $C$ and drops the other term; $C = \\Psi(1, ${y0})$ includes $${s}$.`,
              `这是把 $y(1)$ 当作 $C$ 并丢掉了另一项；$C = \\Psi(1, ${y0})$ 中还含有 $${s}$。`,
            ),
            why(
              Q.of(C, 2 ** p),
              `That leaves out the term $${sx}$ at $x = 2$, which is $${rest}$.`,
              `这里漏掉了 $${sx}$ 在 $x = 2$ 处的值 $${rest}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the integrating factor", "求积分因子"],
                t(`$M_y = ${p}$ and $N_x = 1$, so`, `$M_y = ${p}$，$N_x = 1$，所以`),
                [`\\frac{M_y - N_x}{N} = \\frac{${p - 1}}{x}, \\quad \\mu = ${xp1}`],
              ],
              [
                ["Build the potential", "构造势函数"],
                t("", ""),
                [`\\Psi = x^{${p}}y + ${sx}`, `C = \\Psi(1, ${y0}) = ${y0} + ${s} = ${C}`],
              ],
              [["Solve at x = 2", "在 x = 2 处求解"], t("", ""), [`${2 ** p}y + ${rest} = ${C}`, `y(2) = ${ans.toLatex()}`]],
            ],
            t(
              `$\\Psi_x = ${p}${xp1}y + ${q}x^{${j + p - 1}}$ and $\\Psi_y = x^{${p}}$ are $${xp1}$ times $M$ and $N$, so $\\Psi$ is the potential of the exact equation.`,
              `$\\Psi_x = ${p}${xp1}y + ${q}x^{${j + p - 1}}$，$\\Psi_y = x^{${p}}$，分别是 $${xp1}$ 乘以 $M$ 与 $N$，所以 $\\Psi$ 是恰当方程的势函数。`,
            ),
          ),
        });
      },
    },
  ],
};

/** bernoulliDifferentialEquations solves y' + P(x)y = Q(x)y^n via v = y^{1-n}. */
export const bernoulliDifferentialEquations: TopicDef = {
  id: "bernoulli-differential-equations",
  title: t("Bernoulli Differential Equations", "伯努利微分方程"),
  summary: t(
    "The substitution $v = y^{1-n}$ turns a Bernoulli equation $y' + P(x)y = Q(x)y^n$ into the linear equation $v' + (1 - n)P(x)v = (1 - n)Q(x)$.",
    "代换 $v = y^{1-n}$ 把伯努利方程 $y' + P(x)y = Q(x)y^n$ 化为线性方程 $v' + (1 - n)P(x)v = (1 - n)Q(x)$。",
  ),
  intro: t(
    "Solve $y' + y = y^{2}$ with $y(0) = \\frac{1}{2}$. Here $n = 2$, so let $v = y^{-1}$, with $v' = -y^{-2}y'$. Dividing the equation by $y^{2}$ gives $y^{-2}y' + y^{-1} = 1$, that is $-v' + v = 1$, or $v' - v = -1$. So $v = 1 + Ce^{x}$, and $v(0) = 2$ gives $C = 1$: $y = \\frac{1}{1 + e^{x}}$.\n\nCheck: $y' = -\\frac{e^{x}}{(1 + e^{x})^{2}}$, so $y' + y = \\frac{-e^{x} + 1 + e^{x}}{(1 + e^{x})^{2}} = y^{2}$, and $y(0) = \\frac{1}{2}$.\n\nIn this lesson we turn Bernoulli equations into linear ones with $v = y^{1-n}$, solve them, and return to $y$.",
    "求解 $y' + y = y^{2}$，$y(0) = \\frac{1}{2}$。这里 $n = 2$，所以令 $v = y^{-1}$，$v' = -y^{-2}y'$。方程除以 $y^{2}$ 得 $y^{-2}y' + y^{-1} = 1$，即 $-v' + v = 1$，或 $v' - v = -1$。所以 $v = 1 + Ce^{x}$，由 $v(0) = 2$ 得 $C = 1$：$y = \\frac{1}{1 + e^{x}}$。\n\n检验：$y' = -\\frac{e^{x}}{(1 + e^{x})^{2}}$，所以 $y' + y = \\frac{-e^{x} + 1 + e^{x}}{(1 + e^{x})^{2}} = y^{2}$，且 $y(0) = \\frac{1}{2}$。\n\n本课我们用 $v = y^{1-n}$ 把伯努利方程化为线性方程，求解后再回到 $y$。",
  ),
  prerequisites: ["reducing-odes-to-first-order-linear-by-substitution"],
  encompasses: [
    {
      topic: "reducing-odes-to-first-order-linear-by-substitution",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "linearizing-bernoulli-equations",
      title: t("Linearizing Bernoulli equations", "伯努利方程的线性化变量代换"),
      explanation: t(
        "A Bernoulli equation is not linear because of the power of the unknown, but a substitution with a power of the unknown removes that term and leaves a linear equation. Dividing $y' + a y = b y^n$ by $y^n$ gives $y^{-n} y' + a y^{1-n} = b$. With $v = y^{1-n}$, $\\frac{dv}{dx} = (1-n) y^{-n} y'$, leading to $v' + (1-n) a v = (1-n) b$. For $y' + 2y = 4y^{3}$, $v = y^{-2}$ and $v' - 4v = -8$.\n\n> **Watch out.** The whole equation is multiplied by $1 - n$, which is negative for $n \\ge 2$: the coefficient of $v$ is $(1 - n)a$, not $(n - 1)a$ and not $a$.",
        "伯努利方程因含未知函数的幂而不是线性的，但用未知函数的幂换元可以消去这一项，得到线性方程。将方程 $y' + a y = b y^n$ 同除以 $y^n$ 得 $y^{-n} y' + a y^{1-n} = b$。令 $v = y^{1-n}$，则 $v' = (1-n)y^{-n}y'$，方程化为 $v' + (1-n) a v = (1-n) b$。对 $y' + 2y = 4y^{3}$，$v = y^{-2}$，$v' - 4v = -8$。\n\n> **注意。** 整个方程要乘以 $1 - n$，当 $n \\ge 2$ 时它是负数：$v$ 的系数是 $(1 - n)a$，不是 $(n - 1)a$，也不是 $a$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 5);
        const n = rng.int(2, 6);
        const factor = 1 - n;
        const coeffV = factor * a;
        return numberProblem({
          prompt: t(
            `Under the substitution $v = y^{1 - ${n}}$, the Bernoulli equation $y' + ${poly([a, "y"])} = 4y^{${n}}$ transforms into $v' + C v = D$. Find the coefficient $C$ of $v$.`,
            `通过变量代换 $v = y^{1 - ${n}}$，伯努利方程 $y' + ${poly([a, "y"])} = 4y^{${n}}$ 转化为线性方程 $v' + C v = D$。求其中 $v$ 的系数 $C$。`,
          ),
          answer: coeffV,
          mistakes: apart(coeffV, [
            why(
              -coeffV,
              `The sign is flipped: the factor is $1 - ${n} = ${factor}$, not $${n} - 1$.`,
              `符号反了：因子是 $1 - ${n} = ${factor}$，不是 $${n} - 1$。`,
            ),
            why(
              factor,
              `That is the factor $1 - ${n}$ alone; it multiplies the coefficient $${a}$ of $y$.`,
              `这只是因子 $1 - ${n}$；它还要乘以 $y$ 的系数 $${a}$。`,
            ),
            why(
              a,
              `That forgets to multiply by $1 - ${n}$, which appears in $v' = (1 - ${n})y^{-${n}}y'$.`,
              `这里忘了乘以 $1 - ${n}$，它出现在 $v' = (1 - ${n})y^{-${n}}y'$ 中。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Divide by the power", "除以幂次项"],
                t(`Dividing by $y^{${n}}$:`, `除以 $y^{${n}}$：`),
                [`y^{-${n}}y' + ${a}y^{${factor}} = 4`],
              ],
              [
                ["Substitute", "代换"],
                t(
                  `With $v = y^{${factor}}$, $v' = ${factor}y^{-${n}}y'$, so multiply the equation by $${factor}$:`,
                  `令 $v = y^{${factor}}$，则 $v' = ${factor}y^{-${n}}y'$，所以方程乘以 $${factor}$：`,
                ),
                [`v' + (${factor})(${a})v = (${factor})(4)`, `C = ${coeffV}`],
              ],
            ],
            t(
              `Dividing $v' ${signed(coeffV)}v = ${4 * factor}$ back by $${factor}$ gives $y^{-${n}}y' + ${a}y^{${factor}} = 4$, the original equation divided by $y^{${n}}$.`,
              `把 $v' ${signed(coeffV)}v = ${4 * factor}$ 再除以 $${factor}$，得 $y^{-${n}}y' + ${a}y^{${factor}} = 4$，正是原方程除以 $y^{${n}}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "solving-a-bernoulli-initial-value-problem",
      title: t("Solving a Bernoulli initial value problem", "求解伯努利初值问题"),
      explanation: t(
        "For $y' + ay = by^{2}$ take $n = 2$, so $v = y^{-1}$ and $v' - av = -b$. Then\n\n$$v = \\frac{b}{a} + \\left(\\frac{1}{y_0} - \\frac{b}{a}\\right)e^{ax}, \\qquad y = \\frac{1}{v}.$$\n\nAt $x = \\frac{\\ln 2}{a}$ the exponential equals $2$, giving $v = \\frac{2}{y_0} - \\frac{b}{a}$. For $y' + 2y = y^{2}$ with $y(0) = 1$: $v = \\frac{1}{2} + \\frac{1}{2}e^{2x}$, so at $x = \\frac{\\ln 2}{2}$, $v = \\frac{3}{2}$ and $y = \\frac{2}{3}$.\n\n> **Watch out.** The last step inverts: $y = \\frac{1}{v}$, so do not stop at $v$. And here the exponential is $e^{+ax}$, which equals $2$, not $\\frac{1}{2}$.",
        "对 $y' + ay = by^{2}$ 取 $n = 2$，所以 $v = y^{-1}$，$v' - av = -b$。于是\n\n$$v = \\frac{b}{a} + \\left(\\frac{1}{y_0} - \\frac{b}{a}\\right)e^{ax}, \\qquad y = \\frac{1}{v}.$$\n\n在 $x = \\frac{\\ln 2}{a}$ 处指数项等于 $2$，得 $v = \\frac{2}{y_0} - \\frac{b}{a}$。对 $y' + 2y = y^{2}$，$y(0) = 1$：$v = \\frac{1}{2} + \\frac{1}{2}e^{2x}$，所以在 $x = \\frac{\\ln 2}{2}$ 处 $v = \\frac{3}{2}$，$y = \\frac{2}{3}$。\n\n> **注意。** 最后一步要取倒数：$y = \\frac{1}{v}$，不能停在 $v$。而且这里的指数是 $e^{+ax}$，它等于 $2$，不是 $\\frac{1}{2}$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 6);
        const y0 = rng.int(1, 2);
        const b = rng.int(1, Math.floor((2 * a - 1) / y0));
        const ans = Q.of(a * y0, 2 * a - b * y0);
        const v = Q.of(2 * a - b * y0, a * y0);
        const bc = b === 1 ? "" : `${b}`;
        return numberProblem({
          prompt: t(
            `Solve $y' + ${a}y = ${bc}y^{2}$ with $y(0) = ${y0}$, and find $y\\left(\\frac{\\ln 2}{${a}}\\right)$.`,
            `求解 $y' + ${a}y = ${bc}y^{2}$，$y(0) = ${y0}$，并求 $y\\left(\\frac{\\ln 2}{${a}}\\right)$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(v, "That is $v = \\frac{1}{y}$; invert it to get $y$.", "这是 $v = \\frac{1}{y}$；取倒数才得到 $y$。"),
            why(
              Q.of(2 * a * y0, a + b * y0),
              "That uses $e^{ax} = \\frac{1}{2}$; in this equation the exponential grows and equals $2$.",
              "这是用了 $e^{ax} = \\frac{1}{2}$；在这个方程中指数项增长，等于 $2$。",
            ),
            why(
              Q.of(a * y0, 2 * a + b * y0),
              `The sign of the $\\frac{${b}}{${a}}$ term is flipped; $v = \\frac{2}{y_0} - \\frac{b}{a}$.`,
              `$\\frac{${b}}{${a}}$ 项的符号反了；$v = \\frac{2}{y_0} - \\frac{b}{a}$。`,
            ),
          ]),
          solution: walked(
            [
              [["Substitute v = 1/y", "代换 v = 1/y"], t("", ""), [`v' - ${a}v = -${b}, \\quad v(0) = \\frac{1}{${y0}}`]],
              [
                ["Solve the linear equation", "解线性方程"],
                t("", ""),
                [`v = \\frac{${b}}{${a}} + \\left(\\frac{1}{${y0}} - \\frac{${b}}{${a}}\\right)e^{${a}x}`],
              ],
              [
                ["Evaluate and invert", "求值并取倒数"],
                t(`At $x = \\frac{\\ln 2}{${a}}$, $e^{${a}x} = 2$:`, `当 $x = \\frac{\\ln 2}{${a}}$ 时 $e^{${a}x} = 2$：`),
                [`v = \\frac{2}{${y0}} - \\frac{${b}}{${a}} = ${v.toLatex()}`, `y = \\frac{1}{v} = ${ans.toLatex()}`],
              ],
            ],
            t(
              `$v - \\frac{${b}}{${a}} = \\left(\\frac{1}{${y0}} - \\frac{${b}}{${a}}\\right)e^{${a}x}$ has derivative $${a}\\left(v - \\frac{${b}}{${a}}\\right) = ${a}v - ${b}$, so $v' - ${a}v = -${b}$ holds.`,
              `$v - \\frac{${b}}{${a}} = \\left(\\frac{1}{${y0}} - \\frac{${b}}{${a}}\\right)e^{${a}x}$ 的导数是 $${a}\\left(v - \\frac{${b}}{${a}}\\right) = ${a}v - ${b}$，所以 $v' - ${a}v = -${b}$ 成立。`,
            ),
          ),
        });
      },
    },
  ],
};

/** riccatiDifferentialEquations reduces y' = q0 + q1 y + q2 y^2 using a known solution. */
export const riccatiDifferentialEquations: TopicDef = {
  id: "riccati-differential-equations",
  title: t("Riccati Differential Equations", "黎卡提微分方程"),
  summary: t(
    "Given a particular solution $y_1$ of a Riccati equation $y' = q_0 + q_1 y + q_2 y^2$, the substitution $y = y_1 + \\frac{1}{u}$ reduces it to a linear equation.",
    "已知黎卡提方程 $y' = q_0 + q_1 y + q_2 y^2$ 的一个特解 $y_1$，代换 $y = y_1 + \\frac{1}{u}$ 可将其化为线性方程。",
  ),
  intro: t(
    "Solve $y' = y^{2} - 1$ with $y(0) = 0$. The constant $y_1 = 1$ is a solution, so set $y = 1 + \\frac{1}{u}$. Then $y' = -\\frac{u'}{u^{2}}$ and $y^{2} - 1 = \\frac{2}{u} + \\frac{1}{u^{2}}$, so $u' + 2u = -1$. With $u(0) = -1$, $u = -\\frac{1 + e^{-2x}}{2}$, and $y = 1 - \\frac{2}{1 + e^{-2x}} = -\\tanh x$.\n\nCheck: $y = -\\tanh x$ has $y' = -(1 - \\tanh^{2}x) = y^{2} - 1$, and $y(0) = 0$.\n\nIn this lesson we use one known solution of a Riccati equation to reduce it to a linear equation, and solve initial value problems with it.",
    "求解 $y' = y^{2} - 1$，$y(0) = 0$。常数 $y_1 = 1$ 是一个解，所以令 $y = 1 + \\frac{1}{u}$。则 $y' = -\\frac{u'}{u^{2}}$，$y^{2} - 1 = \\frac{2}{u} + \\frac{1}{u^{2}}$，所以 $u' + 2u = -1$。由 $u(0) = -1$ 得 $u = -\\frac{1 + e^{-2x}}{2}$，$y = 1 - \\frac{2}{1 + e^{-2x}} = -\\tanh x$。\n\n检验：$y = -\\tanh x$ 满足 $y' = -(1 - \\tanh^{2}x) = y^{2} - 1$，且 $y(0) = 0$。\n\n本课我们利用里卡蒂方程的一个已知解把它化为线性方程，并用它求解初值问题。",
  ),
  prerequisites: ["bernoulli-differential-equations"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "transforming-riccati-equations-with-a-known-solution",
      title: t("Transforming Riccati equations with a known solution", "已知特解时黎卡提方程的线性化代换"),
      explanation: t(
        "Once one solution of a Riccati equation is known, writing the general solution as that solution plus a new unknown leads to a Bernoulli equation. For $y' = y^2 - a^2$, a particular solution is $y_1 = a$. Substituting $y = a + \\frac{1}{u}$ yields $u' + 2a u = -1$, a first-order linear equation in $u$. For $y' = y^{2} - 9$, $y_1 = 3$ and $u' + 6u = -1$.\n\n> **Watch out.** Squaring $a + \\frac{1}{u}$ gives the cross term $\\frac{2a}{u}$, with a factor $2$, while $a^{2}$ cancels. Multiplying by $-u^{2}$ then changes every sign.",
        "一旦知道里卡蒂方程的一个解，把通解写成这个解加上一个新的未知函数，就得到伯努利方程。对于方程 $y' = y^2 - a^2$，常数特解为 $y_1 = a$。代入 $y = a + \\frac{1}{u}$ 可化简得 $u' + 2a u = -1$，这是一阶线性常微分方程。对 $y' = y^{2} - 9$，$y_1 = 3$，$u' + 6u = -1$。\n\n> **注意。** $a + \\frac{1}{u}$ 平方后交叉项是 $\\frac{2a}{u}$，带有因子 $2$，而 $a^{2}$ 被消去。再乘以 $-u^{2}$ 时每一项都变号。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 40);
        const coeffU = 2 * a;
        return numberProblem({
          prompt: t(
            `Given that $y_1 = ${a}$ is a particular solution to $y' = y^2 - ${a * a}$, the substitution $y = ${a} + \\frac{1}{u}$ transforms the ODE into $u' + K u = -1$. Find the constant $K$.`,
            `已知 $y_1 = ${a}$ 是微分方程 $y' = y^2 - ${a * a}$ 的一个特解。通过代换 $y = ${a} + \\frac{1}{u}$，方程转化为 $u' + K u = -1$。求常数 $K$ 的值。`,
          ),
          answer: coeffU,
          mistakes: apart(coeffU, [
            why(a, "That misses the factor $2$ in the cross term of the square.", "这里漏掉了平方展开中交叉项的因子 $2$。"),
            why(
              -coeffU,
              "The sign is flipped; multiplying by $-u^{2}$ moves the term to the left with a plus sign.",
              "符号反了；乘以 $-u^{2}$ 后这一项移到左边是正号。",
            ),
            why(a * a, `That keeps $${a * a}$, which cancels against $-${a * a}$.`, `这里保留了 $${a * a}$，它与 $-${a * a}$ 相互抵消。`),
          ]),
          solution: walked(
            [
              [
                ["Substitute", "代换"],
                t(
                  `With $y = ${a} + \\frac{1}{u}$, $y' = -\\frac{u'}{u^{2}}$, and`,
                  `令 $y = ${a} + \\frac{1}{u}$，则 $y' = -\\frac{u'}{u^{2}}$，且`,
                ),
                [`y^2 - ${a * a} = \\frac{${2 * a}}{u} + \\frac{1}{u^{2}}`],
              ],
              [
                ["Clear the denominators", "去分母"],
                t(
                  "Multiply $-\\frac{u'}{u^{2}} = \\frac{2a}{u} + \\frac{1}{u^{2}}$ by $-u^{2}$:",
                  "把 $-\\frac{u'}{u^{2}} = \\frac{2a}{u} + \\frac{1}{u^{2}}$ 乘以 $-u^{2}$：",
                ),
                [`u' = -${coeffU}u - 1`, `u' + ${coeffU}u = -1, \\quad K = ${coeffU}`],
              ],
            ],
            t(
              `The constant $u = -\\frac{1}{${coeffU}}$ solves $u' + ${coeffU}u = -1$, and it gives $y = ${a} - ${coeffU} = -${a}$, which is indeed the other constant solution: $(-${a})^{2} - ${a * a} = 0$.`,
              `常数 $u = -\\frac{1}{${coeffU}}$ 满足 $u' + ${coeffU}u = -1$，它给出 $y = ${a} - ${coeffU} = -${a}$，这确实是另一个常数解：$(-${a})^{2} - ${a * a} = 0$。`,
            ),
          ),
        });
      },
    },
    {
      id: "solving-a-riccati-initial-value-problem",
      title: t("Solving a Riccati initial value problem", "求解里卡蒂初值问题"),
      explanation: t(
        "Knowing one solution turns the nonlinear Riccati equation into a linear one for a new unknown, which we then solve with an integrating factor. For $y' = y^{2} - k^{2}$ with known solution $y_1 = k$, set $y = k + \\frac{1}{u}$. Then $u' + 2ku = -1$, so $u = -\\frac{1}{2k} + Ce^{-2kx}$. With $y(0) = 0$, $u(0) = -\\frac{1}{k}$ and $C = -\\frac{1}{2k}$:\n\n$$u = -\\frac{1 + e^{-2kx}}{2k}, \\qquad y = k - \\frac{2k}{1 + e^{-2kx}}.$$\n\nAs $x \\to \\infty$, $y \\to -k$, the other equilibrium. For $k = 1$ at $x = \\frac{\\ln 3}{2}$: $e^{-2x} = \\frac{1}{3}$, so $y = 1 - \\frac{2}{4/3} = -\\frac{1}{2}$.\n\n> **Watch out.** At $x = \\frac{\\ln m}{2k}$ the exponential $e^{-2kx}$ is $\\frac{1}{m}$, not $m$; and the answer is $y = k + \\frac{1}{u}$, not $u$.",
        "知道一个解，就能把非线性的里卡蒂方程化为关于新未知函数的线性方程，再用积分因子求解。对已知解 $y_1 = k$ 的 $y' = y^{2} - k^{2}$，令 $y = k + \\frac{1}{u}$。则 $u' + 2ku = -1$，所以 $u = -\\frac{1}{2k} + Ce^{-2kx}$。若 $y(0) = 0$，则 $u(0) = -\\frac{1}{k}$，$C = -\\frac{1}{2k}$：\n\n$$u = -\\frac{1 + e^{-2kx}}{2k}, \\qquad y = k - \\frac{2k}{1 + e^{-2kx}}.$$\n\n当 $x \\to \\infty$ 时 $y \\to -k$，即另一个平衡解。对 $k = 1$，在 $x = \\frac{\\ln 3}{2}$ 处：$e^{-2x} = \\frac{1}{3}$，所以 $y = 1 - \\frac{2}{4/3} = -\\frac{1}{2}$。\n\n> **注意。** 在 $x = \\frac{\\ln m}{2k}$ 处指数 $e^{-2kx}$ 等于 $\\frac{1}{m}$，不是 $m$；答案是 $y = k + \\frac{1}{u}$，而不是 $u$。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(1, 6);
        const m = rng.int(2, 6);
        const ans = Q.of(k * (1 - m), m + 1);
        const u = Q.of(-(m + 1), 2 * k * m);
        return numberProblem({
          prompt: t(
            `$y_1 = ${k}$ solves $y' = y^{2} - ${k * k}$. Use it to solve the equation with $y(0) = 0$, and find $y\\left(\\frac{\\ln ${m}}{${2 * k}}\\right)$.`,
            `$y_1 = ${k}$ 是 $y' = y^{2} - ${k * k}$ 的解。利用它求解满足 $y(0) = 0$ 的方程，并求 $y\\left(\\frac{\\ln ${m}}{${2 * k}}\\right)$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              -k,
              `That is the limit as $x \\to \\infty$; at this $x$ the solution has not reached $-${k}$.`,
              `这是 $x \\to \\infty$ 时的极限；在这个 $x$ 处解还没有到达 $-${k}$。`,
            ),
            why(
              ans.neg(),
              `That takes $e^{-${2 * k}x}$ to be $${m}$; at this $x$ it is $\\frac{1}{${m}}$.`,
              `这是把 $e^{-${2 * k}x}$ 当成 $${m}$；在这个 $x$ 处它等于 $\\frac{1}{${m}}$。`,
            ),
            why(u, `That is $u$; the solution is $y = ${k} + \\frac{1}{u}$.`, `这是 $u$；解是 $y = ${k} + \\frac{1}{u}$。`),
          ]),
          solution: walked(
            [
              [
                ["Reduce to a linear equation", "化为线性方程"],
                t(`With $y = ${k} + \\frac{1}{u}$:`, `令 $y = ${k} + \\frac{1}{u}$：`),
                [`u' + ${2 * k}u = -1, \\quad u(0) = -\\frac{1}{${k}}`, `u = -\\frac{1 + e^{-${2 * k}x}}{${2 * k}}`],
              ],
              [
                ["Evaluate u", "求 u 的值"],
                t(
                  `At $x = \\frac{\\ln ${m}}{${2 * k}}$, $e^{-${2 * k}x} = \\frac{1}{${m}}$, so`,
                  `当 $x = \\frac{\\ln ${m}}{${2 * k}}$ 时 $e^{-${2 * k}x} = \\frac{1}{${m}}$，所以`,
                ),
                [`u = ${u.toLatex()}`],
              ],
              [
                ["Return to y", "回到 y"],
                t("", ""),
                [`y = ${k} + \\frac{1}{u} = ${k} - ${Q.of(2 * k * m, m + 1).toLatex()} = ${ans.toLatex()}`],
              ],
            ],
            t(
              `The value $${ans.toLatex()}$ lies between $-${k}$ and $0$, as it must for a solution that starts at $0$ and falls toward the equilibrium $-${k}$.`,
              `$${ans.toLatex()}$ 位于 $-${k}$ 与 $0$ 之间，这正符合从 $0$ 出发、向平衡解 $-${k}$ 下降的解。`,
            ),
          ),
        });
      },
    },
  ],
};

/** clairautDifferentialEquations solves y = x y' + f(y'). */
export const clairautDifferentialEquations: TopicDef = {
  id: "clairaut-differential-equations",
  title: t("Clairaut Differential Equations", "克莱罗微分方程"),
  summary: t(
    "Clairaut's equation y = x y' + f(y') admits a family of linear general solutions y = C x + f(C) alongside a singular envelope solution.",
    "克莱罗方程 y = x y' + f(y') 的通解为一直线族 y = C x + f(C)，并具有一条由包络线构成的奇解。",
  ),
  intro: t(
    "Solve $y = xy' + (y')^{2}$. Replacing $y'$ by a constant $C$ gives the lines $y = Cx + C^{2}$; for $C = 1$ this is $y = x + 1$. The singular solution comes from $x + 2p = 0$: $p = -\\frac{x}{2}$, so $y = -\\frac{x^{2}}{2} + \\frac{x^{2}}{4} = -\\frac{x^{2}}{4}$, a parabola that every line touches.\n\nCheck: on $y = x + 1$, $y' = 1$ and $xy' + (y')^{2} = x + 1$; on $y = -\\frac{x^{2}}{4}$, $y' = -\\frac{x}{2}$ and $xy' + (y')^{2} = -\\frac{x^{2}}{2} + \\frac{x^{2}}{4} = -\\frac{x^{2}}{4}$.\n\nIn this lesson we find the family of straight-line solutions of a Clairaut equation and its singular solution, the envelope of the lines.",
    "求解 $y = xy' + (y')^{2}$。把 $y'$ 换成常数 $C$ 得直线族 $y = Cx + C^{2}$；$C = 1$ 时是 $y = x + 1$。奇解来自 $x + 2p = 0$：$p = -\\frac{x}{2}$，所以 $y = -\\frac{x^{2}}{2} + \\frac{x^{2}}{4} = -\\frac{x^{2}}{4}$，这是一条与每条直线都相切的抛物线。\n\n检验：在 $y = x + 1$ 上 $y' = 1$，$xy' + (y')^{2} = x + 1$；在 $y = -\\frac{x^{2}}{4}$ 上 $y' = -\\frac{x}{2}$，$xy' + (y')^{2} = -\\frac{x^{2}}{2} + \\frac{x^{2}}{4} = -\\frac{x^{2}}{4}$。\n\n本课我们求克莱罗方程的直线解族及其奇解，即这些直线的包络。",
  ),
  prerequisites: ["exact-differential-equations"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "general-linear-solutions-of-clairauts-equation",
      title: t("General linear solutions of Clairaut's equation", "克莱罗方程的通解直线族"),
      explanation: t(
        "Differentiating the equation gives a product equal to zero, and setting the second derivative to zero gives a family of straight line solutions. Differentiating $y = x y' + f(y')$ yields $y' = y' + x y'' + f'(y')y'' \\implies [x + f'(y')]y'' = 0$. Setting $y'' = 0$ gives $y' = C$, leading to general solution lines $y = C x + f(C)$. For $y = xy' + 2(y')^{2}$ the line with slope $3$ is $y = 3x + 18$, which is $21$ at $x = 1$.\n\n> **Watch out.** Replace every $y'$ by the same constant $C$, including the one inside $f$: the line is $y = Cx + f(C)$, so neither term may be dropped, and $f(C) = kC^{2}$ keeps its square.",
        "对方程求导得到一个等于零的乘积，令二阶导数为零就得到一族直线解。对克莱罗方程 $y = x y' + f(y')$ 求导得 $y' = y' + [x + f'(y')]y'' \\implies [x + f'(y')]y'' = 0$。令 $y'' = 0$ 可得斜率为常数 $y' = C$，从而得到通解直线族 $y = C x + f(C)$。对 $y = xy' + 2(y')^{2}$，斜率为 $3$ 的直线是 $y = 3x + 18$，在 $x = 1$ 处为 $21$。\n\n> **注意。** 每个 $y'$ 都要换成同一个常数 $C$，包括 $f$ 中的那个：直线是 $y = Cx + f(C)$，两项都不能丢，并且 $f(C) = kC^{2}$ 要保留平方。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(2, 6);
        const C = rng.int(1, 5);
        const x0 = rng.int(1, 5);
        const ans = C * x0 + k * C * C;
        return numberProblem({
          prompt: t(
            `For the Clairaut differential equation $y = x y' + ${k}(y')^2$, find the value of $y$ on the solution line with slope $y' = ${C}$ at $x = ${x0}$.`,
            `对于克莱罗微分方程 $y = x y' + ${k}(y')^2$，求斜率 $y' = ${C}$ 的通解直线在 $x = ${x0}$ 处对应的 $y$ 值。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(C * x0, `That drops the term $f(C) = ${k}C^{2}$ of the line.`, `这里丢掉了直线中的 $f(C) = ${k}C^{2}$ 项。`),
            why(k * C * C, "That drops the term $Cx$ of the line.", "这里丢掉了直线中的 $Cx$ 项。"),
            why(
              C * x0 + k * C,
              `That uses $${k}C$ for $f(C)$; the square of the slope is needed.`,
              `这里把 $f(C)$ 当成 $${k}C$；要用斜率的平方。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Write the line", "写出直线"],
                t("Replacing $y'$ by the constant $C$:", "把 $y'$ 换成常数 $C$："),
                [`y = Cx + ${k}C^2`, `y = ${C}x + ${k * C * C}`],
              ],
              [["Evaluate", "求值"], t("", ""), [`y(${x0}) = ${C}(${x0}) + ${k * C * C} = ${ans}`]],
            ],
            t(
              `On this line $y' = ${C}$, so $xy' + ${k}(y')^{2} = ${C}x + ${k * C * C}$, which is $y$ itself.`,
              `在这条直线上 $y' = ${C}$，所以 $xy' + ${k}(y')^{2} = ${C}x + ${k * C * C}$，正是 $y$ 本身。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-singular-solution-of-clairauts-equation",
      title: t("The singular solution of Clairaut's equation", "克莱罗方程的奇解"),
      explanation: t(
        "Differentiating $y = xp + f(p)$ gives $\\left(x + f'(p)\\right)p' = 0$. The factor $p' = 0$ gives the lines $y = Cx + f(C)$; the factor $x + f'(p) = 0$ gives the singular solution, the envelope of those lines.\n\nFor $f(p) = cp^{2}$: $x = -2cp$, so $p = -\\frac{x}{2c}$ and\n\n$$y = xp + cp^{2} = -\\frac{x^{2}}{4c}.$$\n\nFor $c = 1$ the singular solution is $y = -\\frac{x^{2}}{4}$, which is $-1$ at $x = 2$.\n\n> **Watch out.** Substitute $p$ into both terms: $xp$ alone gives $-\\frac{x^{2}}{2c}$, and $cp^{2}$ adds back $\\frac{x^{2}}{4c}$. Solving $x + 2cp = 0$ gives $p = -\\frac{x}{2c}$, with a minus sign.",
        "对 $y = xp + f(p)$ 求导得 $\\left(x + f'(p)\\right)p' = 0$。因子 $p' = 0$ 给出直线族 $y = Cx + f(C)$；因子 $x + f'(p) = 0$ 给出奇解，即这些直线的包络。\n\n对 $f(p) = cp^{2}$：$x = -2cp$，所以 $p = -\\frac{x}{2c}$，\n\n$$y = xp + cp^{2} = -\\frac{x^{2}}{4c}.$$\n\n当 $c = 1$ 时奇解是 $y = -\\frac{x^{2}}{4}$，在 $x = 2$ 处为 $-1$。\n\n> **注意。** $p$ 要代入两项：只算 $xp$ 得 $-\\frac{x^{2}}{2c}$，$cp^{2}$ 还要加回 $\\frac{x^{2}}{4c}$。由 $x + 2cp = 0$ 解得 $p = -\\frac{x}{2c}$，带有负号。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const x0 = rng.int(1, 9);
        const ans = Q.of(-x0 * x0, 4 * c);
        const cp = c === 1 ? "" : c === -1 ? "-" : `${c}`;
        const pc2 = c < 0 ? (c === -1 ? "- " : `- ${-c}`) : c === 1 ? "+ " : `+ ${c}`;
        const slope = Q.of(-1, 2 * c);
        const lead = Q.of(-1, 4 * c);
        const rhs = `xy' ${c < 0 ? "-" : "+"} ${Math.abs(c) === 1 ? "" : Math.abs(c)}(y')^{2}`;
        return numberProblem({
          prompt: t(
            `Find the value at $x = ${x0}$ of the singular solution of the Clairaut equation $y = ${rhs}$.`,
            `求克莱罗方程 $y = ${rhs}$ 的奇解在 $x = ${x0}$ 处的值。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              ans.neg(),
              "The sign is flipped; recheck the sign of $p$ from $x + 2cp = 0$ and the sign of $c$.",
              "符号反了；重新检查由 $x + 2cp = 0$ 得到的 $p$ 的符号以及 $c$ 的符号。",
            ),
            why(
              Q.of(-x0 * x0, 2 * c),
              "That keeps only $xp$; the term $cp^{2}$ must be added as well.",
              "这只保留了 $xp$；还要加上 $cp^{2}$ 项。",
            ),
            why(
              Q.of(3 * x0 * x0, 4 * c),
              "That solves $x + 2cp = 0$ as $p = \\frac{x}{2c}$; the minus sign is lost.",
              "这是把 $x + 2cp = 0$ 解成了 $p = \\frac{x}{2c}$；丢掉了负号。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Solve x + f'(p) = 0 for p", "由 x + f'(p) = 0 解出 p"],
                t(
                  `Here $f(p) = ${cp}p^{2}$, so $x ${signed(2 * c)}p = 0$ and`,
                  `这里 $f(p) = ${cp}p^{2}$，所以 $x ${signed(2 * c)}p = 0$，`,
                ),
                [`p = ${slope.toLatex()}x`],
              ],
              [
                ["Substitute into the equation", "代回方程"],
                t("", ""),
                [`y = xp ${pc2}p^{2} = ${lead.toLatex()}x^{2}`, `y(${x0}) = ${ans.toLatex()}`],
              ],
            ],
            t(
              `$y = ${lead.toLatex()}x^{2}$ has $y' = ${slope.toLatex()}x$, and $xy' ${c < 0 ? "-" : "+"} ${Math.abs(c) === 1 ? "" : Math.abs(c)}(y')^{2} = ${slope.toLatex()}x^{2} ${signedQ(Q.of(1, 4 * c))}x^{2} = ${lead.toLatex()}x^{2} = y$.`,
              `$y = ${lead.toLatex()}x^{2}$ 满足 $y' = ${slope.toLatex()}x$，且 $xy' ${c < 0 ? "-" : "+"} ${Math.abs(c) === 1 ? "" : Math.abs(c)}(y')^{2} = ${slope.toLatex()}x^{2} ${signedQ(Q.of(1, 4 * c))}x^{2} = ${lead.toLatex()}x^{2} = y$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** dalembertDifferentialEquations solves y = x f(y') + g(y'). */
export const dalembertDifferentialEquations: TopicDef = {
  id: "dalembert-differential-equations",
  title: t("d'Alembert Differential Equations", "达朗贝尔微分方程"),
  summary: t(
    "d'Alembert's equation y = x f(y') + g(y') is solved by differentiating with respect to x, converting it into a linear equation for x(p) where p = y'.",
    "达朗贝尔方程 y = x f(y') + g(y') 通过对 x 求导，转化为关于 x(p)（其中 p = y'）的一阶线性常微分方程进行求解。",
  ),
  intro: t(
    "Find the straight-line solutions of $y = 2x(y')^{2} + 3y'$. Write $p = y'$; differentiating gives $p - 2p^{2} = (4xp + 3)p'$. A line has constant $p$, so $p' = 0$ and $p = 2p^{2}$: $p = 0$ or $p = \\frac{1}{2}$. These give $y = 0$ and $y = \\frac{x}{2} + \\frac{3}{2}$.\n\nCheck: on $y = \\frac{x}{2} + \\frac{3}{2}$, $y' = \\frac{1}{2}$, and $2x \\cdot \\frac{1}{4} + 3 \\cdot \\frac{1}{2} = \\frac{x}{2} + \\frac{3}{2}$.\n\nIn this lesson we differentiate d'Alembert equations to get a linear equation for $x$ as a function of $p$, and find their straight-line solutions.",
    "求 $y = 2x(y')^{2} + 3y'$ 的直线解。记 $p = y'$；求导得 $p - 2p^{2} = (4xp + 3)p'$。直线的 $p$ 是常数，所以 $p' = 0$，$p = 2p^{2}$：$p = 0$ 或 $p = \\frac{1}{2}$。它们给出 $y = 0$ 与 $y = \\frac{x}{2} + \\frac{3}{2}$。\n\n检验：在 $y = \\frac{x}{2} + \\frac{3}{2}$ 上 $y' = \\frac{1}{2}$，而 $2x \\cdot \\frac{1}{4} + 3 \\cdot \\frac{1}{2} = \\frac{x}{2} + \\frac{3}{2}$。\n\n本课我们对达朗贝尔方程求导，得到 $x$ 关于 $p$ 的线性方程，并求它们的直线解。",
  ),
  prerequisites: ["clairaut-differential-equations"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "reduction-of-dalembert-equations-to-linear-form",
      title: t("Reduction of d'Alembert equations to linear form", "达朗贝尔方程求导转化为线性方程"),
      explanation: t(
        "Differentiating the equation and treating the variable as a function of the slope turns the problem into a linear equation in the variable. For $y = 2x p + g(p)$, differentiating with respect to $x$ gives $p = 2p + 2x \\frac{dp}{dx} + g'(p)\\frac{dp}{dx}$, which rearranges to $\\frac{dx}{dp} + \\frac{2}{p}x = -\\frac{g'(p)}{p}$, an integrating factor $p^2$ ODE. For $y = 3xp + p^{2}$, the coefficient of $x$ is $\\frac{3}{2p}$, so the integrating factor is $p^{3/2}$.\n\n> **Watch out.** After collecting the $\\frac{dp}{dx}$ terms, divide by $(m - 1)p$: the coefficient of $x$ is $\\frac{m}{(m - 1)p}$, so the power is $\\frac{m}{m - 1}$, not $m$ and not its reciprocal.",
        "对方程求导，并把自变量看作斜率的函数，问题就化为关于自变量的线性方程。对于方程 $y = 2x p + g(p)$，关于 $x$ 求导得 $p = 2p + [2x + g'(p)]\\frac{dp}{dx}$，变形可得 $\\frac{dx}{dp} + \\frac{2}{p}x = -\\frac{g'(p)}{p}$，该线性方程的积分因子为 $p^2$。对 $y = 3xp + p^{2}$，$x$ 的系数是 $\\frac{3}{2p}$，所以积分因子是 $p^{3/2}$。\n\n> **注意。** 合并含 $\\frac{dp}{dx}$ 的项后，要除以 $(m - 1)p$：$x$ 的系数是 $\\frac{m}{(m - 1)p}$，所以幂次是 $\\frac{m}{m - 1}$，不是 $m$，也不是它的倒数。",
      ),
      generate(rng: Rng): Problem {
        const m = rng.int(2, 35);
        const ans = Q.of(m, m - 1);
        return numberProblem({
          prompt: t(
            `Differentiating the d'Alembert equation $y = ${m}x y' + (y')^2$ with $p = y'$ turns it into a linear equation $\\frac{dx}{dp} + P(p)x = G(p)$ for $x$ as a function of $p$. Its integrating factor is $p^{r}$. Find $r$.`,
            `对达朗贝尔方程 $y = ${m}x y' + (y')^2$（记 $p = y'$）两端关于 $x$ 求导，它化为关于 $x(p)$ 的线性方程 $\\frac{dx}{dp} + P(p)x = G(p)$，其积分因子为 $p^{r}$。求 $r$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              m,
              `That keeps only the numerator $${m}$; the coefficient of $x$ is divided by $${m - 1}$ as well.`,
              `这只保留了分子 $${m}$；$x$ 的系数还要除以 $${m - 1}$。`,
            ),
            why(
              Q.of(m - 1, m),
              "That is the reciprocal; the coefficient of $x$ is $\\frac{m}{(m - 1)p}$.",
              "这是倒数；$x$ 的系数是 $\\frac{m}{(m - 1)p}$。",
            ),
            why(
              ans.neg(),
              "The sign is flipped; moving the $x$ term across makes its coefficient positive here.",
              "符号反了；这里把 $x$ 项移过去后其系数为正。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Differentiate in x", "对 x 求导"],
                t("", ""),
                [`p = ${m}p + ${m}x \\frac{dp}{dx} + 2p \\frac{dp}{dx}`, `(1 - ${m})p = (${m}x + 2p)\\frac{dp}{dx}`],
              ],
              [
                ["Write x as a function of p", "把 x 写成 p 的函数"],
                t("", ""),
                [`\\frac{dx}{dp} + \\frac{${m}}{${m - 1}p}x = -\\frac{2}{${m - 1}}`],
              ],
              [
                ["Find the integrating factor", "求积分因子"],
                t("", ""),
                [`e^{\\int \\frac{${m}}{${m - 1}p}dp} = p^{${ans.toLatex()}}, \\quad r = ${ans.toLatex()}`],
              ],
            ],
            t(
              `$\\frac{(p^{r})'}{p^{r}} = \\frac{r}{p} = \\frac{${m}}{${m - 1}p}$ for $r = ${ans.toLatex()}$, the coefficient of $x$, as an integrating factor requires.`,
              `当 $r = ${ans.toLatex()}$ 时 $\\frac{(p^{r})'}{p^{r}} = \\frac{r}{p} = \\frac{${m}}{${m - 1}p}$，正是 $x$ 的系数，符合积分因子的要求。`,
            ),
          ),
        });
      },
    },
    {
      id: "straight-line-solutions-of-dalembert-equations",
      title: t("Straight-line solutions of d'Alembert equations", "达朗贝尔方程的直线解"),
      explanation: t(
        "Differentiating $y = xf(p) + g(p)$ gives $p - f(p) = \\left(xf'(p) + g'(p)\\right)p'$. If $p$ is a constant $p_0$, the left side must vanish: $p_0 = f(p_0)$. Each such fixed point gives a straight-line solution\n\n$$y = p_0x + g(p_0).$$\n\nFor $y = 2xp^{2} + 3p$: $p = 2p^{2}$ gives $p_0 = 0$ or $p_0 = \\frac{1}{2}$, so $y = 0$ and $y = \\frac{x}{2} + \\frac{3}{2}$ are solutions.\n\n> **Watch out.** The slope is the fixed point $p_0 = \\frac{1}{a}$ of $f(p) = ap^{2}$, not $a$; and the intercept is $g(p_0)$, so $g(p) = bp$ gives $\\frac{b}{a}$, not $b$.",
        "对 $y = xf(p) + g(p)$ 求导得 $p - f(p) = \\left(xf'(p) + g'(p)\\right)p'$。若 $p$ 是常数 $p_0$，左边必须为零：$p_0 = f(p_0)$。每个这样的不动点给出一条直线解\n\n$$y = p_0x + g(p_0).$$\n\n对 $y = 2xp^{2} + 3p$：由 $p = 2p^{2}$ 得 $p_0 = 0$ 或 $p_0 = \\frac{1}{2}$，所以 $y = 0$ 与 $y = \\frac{x}{2} + \\frac{3}{2}$ 都是解。\n\n> **注意。** 斜率是 $f(p) = ap^{2}$ 的不动点 $p_0 = \\frac{1}{a}$，不是 $a$；截距是 $g(p_0)$，所以 $g(p) = bp$ 给出 $\\frac{b}{a}$，不是 $b$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 6);
        const b = rng.int(-6, 8) || 5;
        const x0 = rng.int(1, 9);
        const ans = Q.of(x0 + b, a);
        return numberProblem({
          prompt: t(
            `The d'Alembert equation $y = ${a}x(y')^{2} ${b === 1 ? "+ " : b === -1 ? "- " : signed(b)}y'$ has a straight-line solution with nonzero slope. Find its value at $x = ${x0}$.`,
            `达朗贝尔方程 $y = ${a}x(y')^{2} ${b === 1 ? "+ " : b === -1 ? "- " : signed(b)}y'$ 有一条斜率不为零的直线解。求它在 $x = ${x0}$ 处的值。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              Q.of(x0, a),
              `That drops the intercept $g(p_0)$ that comes from the term $${b}y'$.`,
              `这里丢掉了来自 $${b}y'$ 项的截距 $g(p_0)$。`,
            ),
            why(
              Q.of(a * x0 + b),
              `That uses $${a}$ as the slope; the slope is the nonzero fixed point of $p = ${a}p^{2}$.`,
              `这是把 $${a}$ 当作斜率；斜率是 $p = ${a}p^{2}$ 的非零不动点。`,
            ),
            why(
              Q.of(x0 + b * a, a),
              `That uses $${b}$ as the intercept; the intercept is $${b}p_0$.`,
              `这是把 $${b}$ 当作截距；截距是 $${b}p_0$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the constant slope", "求常数斜率"],
                t(
                  `A line has constant $p_0$, which must satisfy $p_0 = ${a}p_0^{2}$; the nonzero root is`,
                  `直线的斜率 $p_0$ 是常数，必须满足 $p_0 = ${a}p_0^{2}$；非零根是`,
                ),
                [`p_0 = \\frac{1}{${a}}`],
              ],
              [
                ["Write the line and evaluate", "写出直线并求值"],
                t("", ""),
                [`y = \\frac{x}{${a}} ${signed(b)} \\cdot \\frac{1}{${a}} = \\frac{x ${signed(b)}}{${a}}`, `y(${x0}) = ${ans.toLatex()}`],
              ],
            ],
            t(
              `On this line $y' = \\frac{1}{${a}}$, and $${a}x \\cdot \\frac{1}{${a * a}} ${signed(b)} \\cdot \\frac{1}{${a}} = \\frac{x ${signed(b)}}{${a}} = y$.`,
              `在这条直线上 $y' = \\frac{1}{${a}}$，而 $${a}x \\cdot \\frac{1}{${a * a}} ${signed(b)} \\cdot \\frac{1}{${a}} = \\frac{x ${signed(b)}}{${a}} = y$。`,
            ),
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 1.4 Qualitative Techniques for Differential Equations
// ---------------------------------------------------------------------------

/** phaseLinesOfFirstOrderOdes visualizes 1D autonomous dynamics. */
export const phaseLinesOfFirstOrderOdes: TopicDef = {
  id: "phase-lines-of-first-order-odes",
  title: t("Phase Lines of First-Order ODEs", "一阶微分方程的相位线"),
  summary: t(
    "A phase line for an autonomous ODE y' = f(y) represents the real axis with arrows showing direction of flow and dots at equilibrium points.",
    "一阶自治方程 y' = f(y) 的相位线在实轴上标出平衡点并用箭头指示解曲线的演化流动方向。",
  ),
  intro: t(
    "Draw the phase line of $y' = y(3 - y)$. The equilibria are the zeros $y = 0$ and $y = 3$. Between them, at $y = 1$, $y' = 2 > 0$, so the arrow points up; above $3$, at $y = 4$, $y' = -4 < 0$; below $0$, at $y = -1$, $y' = -4 < 0$. So a solution with $y(0) = 1$ rises toward $3$.\n\nCheck: arrows point toward $3$ from both sides and away from $0$ on both sides, so $3$ attracts and $0$ repels, which agrees with $f'(y) = 3 - 2y$ being $-3$ at $3$ and $3$ at $0$.\n\nIn this lesson we build phase lines from the sign of the right side, and read long-run behavior from them and from graphs.",
    "画出 $y' = y(3 - y)$ 的相线。平衡点是零点 $y = 0$ 和 $y = 3$。在它们之间，$y = 1$ 处 $y' = 2 > 0$，箭头向上；在 $3$ 以上，$y = 4$ 处 $y' = -4 < 0$；在 $0$ 以下，$y = -1$ 处 $y' = -4 < 0$。所以满足 $y(0) = 1$ 的解上升趋于 $3$。\n\n检验：箭头从两侧指向 $3$，在 $0$ 两侧都背离 $0$，所以 $3$ 吸引、$0$ 排斥，这与 $f'(y) = 3 - 2y$ 在 $3$ 处为 $-3$、在 $0$ 处为 $3$ 一致。\n\n本课我们由右边的符号画出相线，并从相线和图像读出长期行为。",
  ),
  prerequisites: ["equilibrium-solutions-of-first-order-odes"],
  encompasses: [{ topic: "equilibrium-solutions-of-first-order-odes", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "constructing-and-interpreting-phase-lines",
      title: t("Constructing and interpreting phase lines", "构造与分析自治方程的相位线"),
      explanation: t(
        "A phase line marks the equilibria and shows, between them, whether solutions increase or decrease according to the sign of the right side. For $y' = (y - a)(b - y)$ with $a < b$, $f(y) > 0$ when $a < y < b$ (solutions increase, arrow points right/up), while $f(y) < 0$ when $y > b$ or $y < a$ (solutions decrease). For $y' = (y - 1)(5 - y)$ at $y = 2$, $y' = 1 \\cdot 3 = 3 > 0$.\n\n> **Watch out.** Keep the order inside each factor: $(b - y)$ is positive for $y < b$. Writing it as $(y - b)$ flips the sign of $y'$ and the direction of the arrow.",
        "相线标出平衡点，并在平衡点之间根据右边的符号说明解是增加还是减少。对于 $y' = (y - a)(b - y)$（$a < b$），在区间 $a < y < b$ 上 $f(y) > 0$（解单调递增，箭头指向正方向）；在 $y > b$ 或 $y < a$ 时 $f(y) < 0$（解单调递减）。对 $y' = (y - 1)(5 - y)$，在 $y = 2$ 处 $y' = 1 \\cdot 3 = 3 > 0$。\n\n> **注意。** 要保持每个因子内的顺序：$(b - y)$ 在 $y < b$ 时为正。把它写成 $(y - b)$ 会使 $y'$ 变号，箭头方向也随之反过来。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 8);
        const b = rng.int(a + 2, a + 15);
        const yTest = a + 1; // lies in (a, b)
        const ans = (yTest - a) * (b - yTest);
        return numberProblem({
          prompt: t(
            `For the autonomous differential equation $y' = (y - ${a})(${b} - y)$, evaluate the slope $y'$ on the phase line at $y = ${yTest}$.`,
            `对于自治微分方程 $y' = (y - ${a})(${b} - y)$，求相位线上在 $y = ${yTest}$ 处的导数值 $y'$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(-ans, `The sign is flipped; $${b} - y$ is positive at $y = ${yTest}$.`, `符号反了；$${b} - y$ 在 $y = ${yTest}$ 处为正。`),
            why(b - a, "That adds the two factors; the right side is their product.", "这是把两个因子相加；右边是它们的乘积。"),
          ]),
          solution: walked(
            [
              [["Evaluate each factor", "求各因子的值"], t("", ""), [`${yTest} - ${a} = ${yTest - a}`, `${b} - ${yTest} = ${b - yTest}`]],
              [
                ["Multiply", "相乘"],
                t(
                  `$y' = ${yTest - a} \\cdot ${b - yTest} = ${ans}$, positive, so the arrow on $(${a}, ${b})$ points toward larger $y$.`,
                  `$y' = ${yTest - a} \\cdot ${b - yTest} = ${ans}$，为正，所以 $(${a}, ${b})$ 上的箭头指向 $y$ 增大的方向。`,
                ),
              ],
            ],
            t(
              `$y = ${yTest}$ lies between the equilibria $${a}$ and $${b}$, where both factors are positive, so the slope must be positive, as found.`,
              `$y = ${yTest}$ 位于平衡点 $${a}$ 与 $${b}$ 之间，那里两个因子都为正，所以斜率必为正，与所得一致。`,
            ),
          ),
        });
      },
    },
    {
      id: "long-run-behavior-from-a-phase-line",
      title: t("Long-run behavior from a phase line", "由相线判断长期行为"),
      explanation: t(
        "On a phase line a solution moves in the direction of the arrows and can never cross an equilibrium, so it approaches the nearest equilibrium in its direction of motion.\n\nFor $y' = (1 - y)(y - 3)(y - 5)$: the sign is $+$ below $1$, $-$ on $(1, 3)$, $+$ on $(3, 5)$ and $-$ above $5$. A solution starting at $y(0) = 4$ rises to $5$; one starting at $y(0) = 2$ falls to $1$.\n\n> **Watch out.** A solution never settles at a repelling equilibrium unless it starts there, and it does not stay at its starting value: follow the arrow to the next equilibrium.",
        "在相线上，解沿箭头方向移动，且不能越过平衡点，所以它趋向运动方向上最近的平衡点。\n\n对 $y' = (1 - y)(y - 3)(y - 5)$：符号在 $1$ 以下为 $+$，在 $(1, 3)$ 上为 $-$，在 $(3, 5)$ 上为 $+$，在 $5$ 以上为 $-$。从 $y(0) = 4$ 出发的解上升到 $5$；从 $y(0) = 2$ 出发的解下降到 $1$。\n\n> **注意。** 除非从排斥的平衡点出发，解不会停在那里；解也不会停留在初值：要沿箭头走到下一个平衡点。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 3);
        const b = a + rng.int(1, 3);
        const c = b + rng.int(1, 3);
        let y0 = rng.int(Math.max(0, a - 3), c + 3);
        if (y0 === b) y0 = c + 1;
        const ans = y0 < b ? a : c;
        const f0 = (a - y0) * (y0 - b) * (y0 - c);
        return numberProblem({
          prompt: t(
            `For $y' = (${a} - y)(y - ${b})(y - ${c})$ with $y(0) = ${y0}$, find $\\lim_{t \\to \\infty} y(t)$.`,
            `对 $y' = (${a} - y)(y - ${b})(y - ${c})$，$y(0) = ${y0}$，求 $\\lim_{t \\to \\infty} y(t)$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(b, `$${b}$ repels: the arrows on both sides point away from it.`, `$${b}$ 是排斥的：两侧的箭头都背离它。`),
            why(
              ans === a ? c : a,
              "That equilibrium lies on the other side of the repelling one, and a solution cannot cross an equilibrium.",
              "那个平衡点位于排斥平衡点的另一侧，而解不能越过平衡点。",
            ),
            why(
              y0,
              "That is the starting value; the solution moves unless it starts at an equilibrium.",
              "这是初值；除非从平衡点出发，解会移动。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Mark the equilibria and signs", "标出平衡点与符号"],
                t(
                  `The equilibria are $${a}$, $${b}$, $${c}$; $y'$ is $+$ below $${a}$, $-$ on $(${a}, ${b})$, $+$ on $(${b}, ${c})$ and $-$ above $${c}$. So $${a}$ and $${c}$ attract and $${b}$ repels.`,
                  `平衡点为 $${a}$、$${b}$、$${c}$；$y'$ 在 $${a}$ 以下为 $+$，在 $(${a}, ${b})$ 上为 $-$，在 $(${b}, ${c})$ 上为 $+$，在 $${c}$ 以上为 $-$。所以 $${a}$ 与 $${c}$ 吸引，$${b}$ 排斥。`,
                ),
              ],
              [
                ["Follow the arrow", "沿箭头走"],
                t(
                  `$y(0) = ${y0}$ is ${y0 < b ? "below" : "above"} the repelling equilibrium $${b}$, so the solution tends to $${ans}$.`,
                  `$y(0) = ${y0}$ 位于排斥平衡点 $${b}$ 的${y0 < b ? "下方" : "上方"}，所以解趋于 $${ans}$。`,
                ),
              ],
            ],
            f0 === 0
              ? t(
                  `At $y = ${y0}$, $y' = 0$: the solution starts at the equilibrium and stays there.`,
                  `在 $y = ${y0}$ 处 $y' = 0$：解从平衡点出发并停留在那里。`,
                )
              : t(
                  `At $y = ${y0}$, $y' = ${f0}$, which is ${f0 > 0 ? "positive, so $y$ rises" : "negative, so $y$ falls"} toward $${ans}$.`,
                  `在 $y = ${y0}$ 处 $y' = ${f0}$，${f0 > 0 ? "为正，所以 $y$ 上升" : "为负，所以 $y$ 下降"}趋向 $${ans}$。`,
                ),
          ),
        });
      },
    },
  ],
};

/** classifyingEquilibriumSolutionsOfFirstOrderOdes classifies sinks, sources, and nodes. */
export const classifyingEquilibriumSolutionsOfFirstOrderOdes: TopicDef = {
  id: "classifying-equilibrium-solutions-of-first-order-odes",
  title: t("Classifying Equilibrium Solutions of First-Order ODEs", "一阶微分方程平衡解的稳定性分类"),
  summary: t(
    "An equilibrium $y^*$ of $y' = f(y)$ is asymptotically stable (a sink) if $f'(y^*) < 0$ and unstable (a source) if $f'(y^*) > 0$.",
    "对 $y' = f(y)$，若 $f'(y^*) < 0$，平衡点 $y^*$ 渐近稳定（汇）；若 $f'(y^*) > 0$，则不稳定（源）。",
  ),
  intro: t(
    "Classify the equilibria of $y' = y^{2} - 4$. They are $y = \\pm 2$. With $f(y) = y^{2} - 4$, $f'(y) = 2y$: $f'(-2) = -4 < 0$, so $-2$ is a sink, and $f'(2) = 4 > 0$, so $2$ is a source.\n\nCheck: $f$ is $+$ below $-2$, $-$ between $-2$ and $2$, and $+$ above $2$, so arrows point toward $-2$ from both sides and away from $2$.\n\nIn this lesson we classify equilibria as sinks, sources or nodes with the derivative test, by the sign of $f$ when that test fails, and from graphs; we also find where equilibria appear as a parameter changes.",
    "判断 $y' = y^{2} - 4$ 的平衡点的类型。平衡点是 $y = \\pm 2$。记 $f(y) = y^{2} - 4$，则 $f'(y) = 2y$：$f'(-2) = -4 < 0$，所以 $-2$ 是汇；$f'(2) = 4 > 0$，所以 $2$ 是源。\n\n检验：$f$ 在 $-2$ 以下为 $+$，在 $-2$ 与 $2$ 之间为 $-$，在 $2$ 以上为 $+$，所以箭头从两侧指向 $-2$，背离 $2$。\n\n本课我们用导数判别法把平衡点分为汇、源和结点，在判别法失效时看 $f$ 的符号，也从图像判断；还要求出参数变化时平衡点出现的位置。",
  ),
  prerequisites: ["phase-lines-of-first-order-odes"],
  encompasses: [{ topic: "phase-lines-of-first-order-odes", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "derivative-test-for-equilibrium-stability",
      title: t("Derivative test for equilibrium stability", "平衡点稳定性判别的导数检验法"),
      explanation: t(
        "An equilibrium is stable when the right side decreases through it, because nearby solutions are then pushed back toward the equilibrium. For $y' = k(y - a)(y - b)$ ($k > 0$, $a < b$), the derivative is $f'(y) = k(y - b) + k(y - a)$. At $y = a$, $f'(a) = k(a - b) < 0$, identifying $y = a$ as a stable equilibrium. For $y' = 2(y - 1)(y - 4)$, $f'(1) = 2(1 - 4) = -6$, so $y = 1$ is a sink.\n\n> **Watch out.** Evaluate the derivative $f'$, not $f$, which is zero at every equilibrium. At $y = a$ only the term $k(a - b)$ survives, and the factor $k$ stays in.",
        "当右边在平衡点处递减时，平衡点是稳定的，因为附近的解会被推回平衡点。对于 $y' = k(y - a)(y - b)$（$k > 0$，$a < b$），导函数为 $f'(y) = k(y - b) + k(y - a)$。在 $y = a$ 处，$f'(a) = k(a - b) < 0$，因此 $y = a$ 为渐近稳定平衡解。对 $y' = 2(y - 1)(y - 4)$，$f'(1) = 2(1 - 4) = -6$，所以 $y = 1$ 是汇。\n\n> **注意。** 要计算导数 $f'$ 而不是 $f$，$f$ 在每个平衡点处都为零。在 $y = a$ 处只剩下 $k(a - b)$ 这一项，因子 $k$ 要保留。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(1, 4);
        const a = rng.int(1, 4);
        const b = rng.int(a + 2, a + 7);
        const fPrimeA = k * (a - b);
        const kc = k === 1 ? "" : `${k}`;
        return numberProblem({
          prompt: t(
            `For the differential equation $y' = ${kc}(y - ${a})(y - ${b})$, evaluate the derivative $f'(${a})$ to determine the stability of the equilibrium point $y = ${a}$.`,
            `对于微分方程 $y' = ${kc}(y - ${a})(y - ${b})$，计算导数 $f'(${a})$ 的值以判定平衡点 $y = ${a}$ 的稳定性。`,
          ),
          answer: fPrimeA,
          mistakes: apart(fPrimeA, [
            why(
              -fPrimeA,
              `The sign is flipped; at $y = ${a}$ the surviving factor is $${a} - ${b}$.`,
              `符号反了；在 $y = ${a}$ 处剩下的因子是 $${a} - ${b}$。`,
            ),
            why(
              0,
              `That is $f(${a})$, which is zero at every equilibrium; the test uses $f'$.`,
              `这是 $f(${a})$，它在每个平衡点都为零；判别要用 $f'$。`,
            ),
            why(a - b, `That drops the factor $${k}$ in front.`, `这里丢掉了前面的因子 $${k}$。`),
          ]),
          solution: walked(
            [
              [["Differentiate", "求导"], t("By the product rule:", "由乘积法则："), [`f'(y) = ${kc}(y - ${b}) + ${kc}(y - ${a})`]],
              [
                ["Evaluate and classify", "求值并判断"],
                t(
                  `$f'(${a}) = ${kc}(${a} - ${b}) + 0 = ${fPrimeA} < 0$, so $y = ${a}$ is asymptotically stable (a sink).`,
                  `$f'(${a}) = ${kc}(${a} - ${b}) + 0 = ${fPrimeA} < 0$，所以 $y = ${a}$ 是渐近稳定的（汇）。`,
                ),
              ],
            ],
            t(
              `Just below $${a}$ both factors are negative, so $y' > 0$; between $${a}$ and $${b}$, $y' < 0$. Nearby solutions move toward $${a}$ from both sides.`,
              `在 $${a}$ 稍下方两个因子都为负，所以 $y' > 0$；在 $${a}$ 与 $${b}$ 之间 $y' < 0$。附近的解从两侧都向 $${a}$ 移动。`,
            ),
          ),
        });
      },
    },
    {
      id: "classifying-equilibria-when-the-derivative-test-fails",
      title: t("Classifying equilibria when the derivative test fails", "导数判别法失效时的平衡点分类"),
      explanation: t(
        "When $f'(y^{*}) = 0$ the derivative test says nothing; look at the sign of $f$ on each side instead. At a double root such as $y^{*} = a$ in $f(y) = (y - a)^{2}(y - b)$, the factor $(y - a)^{2}$ never changes sign, so $f$ has the same sign on both sides: solutions approach from one side and leave on the other. Such an equilibrium is semi-stable (a node).\n\nAt the simple root $y = b$, $f'(b) = (b - a)^{2} > 0$, so it is a source; a minus sign in front of $f$ reverses this to a sink. For $y' = (y - 1)^{2}(y - 3)$: $f(0) = -3$ and $f(2) = -1$ are both negative, so $y = 1$ is semi-stable, while $f'(3) = 4 > 0$ makes $y = 3$ a source.\n\n> **Watch out.** A zero derivative does not mean stable or unstable; it decides nothing. Check the sign of $f$ just below and just above the equilibrium.",
        "当 $f'(y^{*}) = 0$ 时导数判别法失效；应改看 $f$ 在两侧的符号。在二重根处，例如 $f(y) = (y - a)^{2}(y - b)$ 中的 $y^{*} = a$，因子 $(y - a)^{2}$ 从不变号，所以 $f$ 在两侧同号：解从一侧趋近，从另一侧离开。这样的平衡点是半稳定的（结点）。\n\n在单根 $y = b$ 处，$f'(b) = (b - a)^{2} > 0$，所以它是源；在 $f$ 前加负号会使它变成汇。对 $y' = (y - 1)^{2}(y - 3)$：$f(0) = -3$ 与 $f(2) = -1$ 都为负，所以 $y = 1$ 是半稳定的；而 $f'(3) = 4 > 0$ 使 $y = 3$ 成为源。\n\n> **注意。** 导数为零并不意味着稳定或不稳定；它什么也决定不了。要检查 $f$ 在平衡点稍下方和稍上方的符号。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(-4, 6);
        let b = rng.int(-4, 6);
        if (b === a) b = a + 3;
        const s = rng.bool(0.5) ? 1 : -1;
        const askDouble = rng.bool(0.4);
        const yStar = askDouble ? a : b;
        const correct = askDouble ? 2 : s > 0 ? 1 : 0;
        const lin = (r: number): string => (r === 0 ? "y" : `y ${signed(-r)}`);
        const sq = a === 0 ? "y^{2}" : `(${lin(a)})^{2}`;
        const f = `${s < 0 ? "-" : ""}${sq}${b === 0 ? "y" : `(${lin(b)})`}`;
        const at = (y: Q) =>
          y
            .sub(Q.of(a))
            .pow(2)
            .mul(y.sub(Q.of(b)))
            .mul(Q.of(s));
        const below = Q.of(2 * yStar - 1, 2);
        const above = Q.of(2 * yStar + 1, 2);
        const sign = (q: Q, en: boolean) => (q.sign() > 0 ? (en ? "positive" : "为正") : en ? "negative" : "为负");
        const options = [
          t("Stable (a sink)", "稳定（汇）"),
          t("Unstable (a source)", "不稳定（源）"),
          t("Semi-stable (a node)", "半稳定（结点）"),
        ];
        const problem = choiceProblem({
          prompt: t(`Classify the equilibrium $y = ${yStar}$ of $y' = ${f}$.`, `判断 $y' = ${f}$ 的平衡点 $y = ${yStar}$ 的类型。`),
          options,
          correct,
          solution: walked(
            askDouble
              ? [
                  [
                    ["Try the derivative test", "尝试导数判别法"],
                    t(
                      `$y = ${a}$ is a double root, so $f'(${a}) = 0$ and the derivative test fails.`,
                      `$y = ${a}$ 是二重根，所以 $f'(${a}) = 0$，导数判别法失效。`,
                    ),
                  ],
                  [
                    ["Compare the signs on both sides", "比较两侧的符号"],
                    t(
                      `The factor $${sq}$ keeps its sign, so $f$ has the same sign on both sides of $${a}$: solutions approach on one side and leave on the other, and the equilibrium is semi-stable.`,
                      `因子 $${sq}$ 不变号，所以 $f$ 在 $${a}$ 两侧同号：解从一侧趋近、从另一侧离开，该平衡点是半稳定的。`,
                    ),
                  ],
                ]
              : [
                  [
                    ["Differentiate at the simple root", "在单根处求导"],
                    t("", ""),
                    [`f'(${b}) = ${s < 0 ? "-" : ""}(${b} ${signed(-a)})^{2} = ${s * (b - a) ** 2}`],
                  ],
                  [
                    ["Classify", "判断"],
                    t(
                      `$f'(${b})$ is ${s > 0 ? "positive" : "negative"}, so $y = ${b}$ is a ${s > 0 ? "source" : "sink"}.`,
                      `$f'(${b})$ ${s > 0 ? "为正" : "为负"}，所以 $y = ${b}$ 是${s > 0 ? "源" : "汇"}。`,
                    ),
                  ],
                ],
            t(
              `$f(${below.toLatex()}) = ${at(below).toLatex()}$ is ${sign(at(below), true)} and $f(${above.toLatex()}) = ${at(above).toLatex()}$ is ${sign(at(above), true)}, which matches.`,
              `$f(${below.toLatex()}) = ${at(below).toLatex()}$ ${sign(at(below), false)}，$f(${above.toLatex()}) = ${at(above).toLatex()}$ ${sign(at(above), false)}，与结论一致。`,
            ),
          ),
        });
        return reasoned(
          problem,
          askDouble
            ? [
                [
                  "Stable (a sink)",
                  "A sink needs $f$ to change from $+$ to $-$ through the equilibrium; check whether the squared factor lets $f$ change sign at all.",
                  "汇要求 $f$ 经过平衡点时由 $+$ 变为 $-$；检查平方因子是否允许 $f$ 变号。",
                ],
                [
                  "Unstable (a source)",
                  "A source needs $f$ to change from $-$ to $+$ through the equilibrium; check whether the squared factor lets $f$ change sign at all.",
                  "源要求 $f$ 经过平衡点时由 $-$ 变为 $+$；检查平方因子是否允许 $f$ 变号。",
                ],
              ]
            : [
                [
                  "Stable (a sink)",
                  `Check the sign of $f'(${b})$: a sink needs it to be negative.`,
                  `检查 $f'(${b})$ 的符号：汇要求它为负。`,
                ],
                [
                  "Unstable (a source)",
                  `Check the sign of $f'(${b})$: a source needs it to be positive.`,
                  `检查 $f'(${b})$ 的符号：源要求它为正。`,
                ],
                [
                  "Semi-stable (a node)",
                  `At the simple root $${b}$ the factor $${b === 0 ? "y" : lin(b)}$ changes sign and $f'(${b}) \\ne 0$, so the derivative test decides.`,
                  `在单根 $${b}$ 处因子 $${b === 0 ? "y" : lin(b)}$ 变号且 $f'(${b}) \\ne 0$，所以导数判别法可以判定。`,
                ],
              ],
        );
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Export Array
// ---------------------------------------------------------------------------

export const differentialEquationsFirstOrderTopics: readonly TopicDef[] = [
  // 1.1 Techniques for Solving First-Order ODEs
  introductionToFirstOrderLinearOdes,
  generalSolutionsOfFirstOrderLinearOdes,
  solvingFirstOrderLinearOdesWithExponentialForcing,
  solvingFirstOrderLinearOdesWithSinusoidalForcing,
  solvingFirstOrderLinearOdesUsingIntegratingFactors,
  solvingFirstOrderOdesBySubstitution,
  furtherSolvingFirstOrderOdesBySubstitution,
  reducingOdesToFirstOrderLinearBySubstitution,

  // 1.2 Special First-Order Equations
  homogeneousFunctions,
  homogeneousFirstOrderOdes,
  exactDifferentialEquations,
  solvingExactOdesUsingIntegratingFactors,
  bernoulliDifferentialEquations,
  riccatiDifferentialEquations,
  clairautDifferentialEquations,
  dalembertDifferentialEquations,

  // 1.4 Qualitative Techniques
  phaseLinesOfFirstOrderOdes,
  classifyingEquilibriumSolutionsOfFirstOrderOdes,
];
