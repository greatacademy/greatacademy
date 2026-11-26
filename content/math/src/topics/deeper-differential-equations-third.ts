// Third knowledge points for thin topics of Differential Equations, from first-order
// methods to variation of parameters: the reverse question, a harder case or a common
// trap. See `deeperDifferentialEquationsThirdPoints`.

import type { KnowledgePointDef, Rng, Text } from "@ga/content";
import { t } from "@ga/content";
import { linear, paren, poly, Q } from "@ga/subject-math";
import { differentialEquationsDrawings1 } from "../explanation-drawings-differential-equations-1.ts";

import { explainedChoice, numberProblem, why } from "../problems.ts";
import { ask, choose, type Pair, point } from "../university-kit.ts";
import { walked } from "./calculus-i-differentiation.ts";

/** apart drops the mistakes whose value is the answer or repeats an earlier one. */
const apart = (answer: number | Q, mistakes: readonly { readonly value: number | Q; readonly why: Text }[]) => {
  const key = (v: number | Q) => (typeof v === "number" ? Q.of(v) : v).toLatex();
  return mistakes.filter((m, i, all) => key(m.value) !== key(answer) && all.findIndex((x) => key(x.value) === key(m.value)) === i);
};

/** nz picks a nonzero integer from -r to r. */
const nz = (rng: Rng, r: number) => rng.pick([...Array(2 * r + 1).keys()].map((i) => i - r).filter((i) => i !== 0));
/** expOf writes e to a multiple of x, leaving out a coefficient of 1. */
const expOf = (k: number, v = "x") => `e^{${k === 1 ? "" : k === -1 ? "-" : k}${v}}`;

const integratingFactorPower = point(
  "the-integrating-factor-after-standardizing",
  ["The integrating factor after standardizing", "化为标准形式后的积分因子"],
  [
    "The integrating factor $e^{\\int P \\, dx}$ uses $P$ from the standard form, with $y'$ having coefficient $1$. So divide first. For $axy' + by = g$ on $x > 0$, $P = \\frac{b}{ax}$, which makes the integrating factor $x^{b/a}$. For $2xy' + 3y = x^{2}$, $P = \\frac{3}{2x}$ and the factor is $x^{3/2}$.\n\n> **Watch out.** Divide by the whole coefficient $ax$ of $y'$, not just by $x$: skipping the division by $a$ gives $x^{b}$, and dividing the wrong way gives $x^{a/b}$.",
    "积分因子 $e^{\\int P \\, dx}$ 中的 $P$ 来自标准形式，即 $y'$ 的系数为 $1$。所以要先相除。对 $x > 0$ 上的 $axy' + by = g$，$P = \\frac{b}{ax}$，所以积分因子是 $x^{b/a}$。对 $2xy' + 3y = x^{2}$，$P = \\frac{3}{2x}$，积分因子是 $x^{3/2}$。\n\n> **注意。** 要除以 $y'$ 的整个系数 $ax$，而不只是除以 $x$：漏掉除以 $a$ 会得到 $x^{b}$，除反了会得到 $x^{a/b}$。",
  ],
  (rng) => {
    const a = rng.int(2, 7);
    const b = nz(rng, 12);
    const answer = Q.of(b, a);
    const g = rng.pick(["x^{2}", "e^{x}", "\\sin x", "7"]);
    const by = `${b < 0 ? "-" : "+"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}y`;
    const m = answer.toLatex();
    const mc = m === "1" ? "" : m === "-1" ? "-" : m;
    return numberProblem({
      prompt: t(
        `For $x > 0$, an integrating factor of $${a}xy' ${by} = ${g}$ has the form $x^{m}$. Find $m$.`,
        `当 $x > 0$ 时，$${a}xy' ${by} = ${g}$ 的一个积分因子形如 $x^{m}$。求 $m$。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(b, `That skips dividing by $${a}$, the number in the coefficient of $y'$.`, `这里漏掉了除以 $y'$ 系数中的 $${a}$。`),
        why(
          Q.of(a, b),
          "That divides the wrong way round; $P$ is the coefficient of $y$ over the coefficient of $y'$.",
          "这是除反了；$P$ 是 $y$ 的系数除以 $y'$ 的系数。",
        ),
        why(
          answer.neg(),
          "The sign is flipped; the integrating factor uses $+\\int P \\, dx$.",
          "符号反了；积分因子用的是 $+\\int P \\, dx$。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Put the equation in standard form", "化为标准形式"],
            t(`Divide by $${a}x$:`, `除以 $${a}x$：`),
            [`y' + \\frac{${b}}{${a}x}y = \\frac{${g}}{${a}x}`],
          ],
          [
            ["Integrate P", "对 P 积分"],
            t("", ""),
            [`\\int \\frac{${b}}{${a}x} \\, dx = ${mc}\\ln x`, `e^{${mc}\\ln x} = x^{${m}}, \\quad m = ${m}`],
          ],
        ],
        t(
          `$\\frac{(x^{m})'}{x^{m}} = \\frac{m}{x} = ${m}\\cdot\\frac{1}{x} = \\frac{${b}}{${a}x}$, which is $P$, as an integrating factor requires.`,
          `$\\frac{(x^{m})'}{x^{m}} = \\frac{m}{x} = ${m}\\cdot\\frac{1}{x} = \\frac{${b}}{${a}x}$，正是 $P$，符合积分因子的要求。`,
        ),
      ),
    });
  },
);

const steadyMean = point(
  "the-mean-level-of-the-steady-state",
  ["The mean level of the steady state", "稳态的平均水平"],
  [
    "When a constant is added to a sinusoidal forcing, linearity splits the response. The constant part gives a steady level $\\frac{c}{k}$ for $y' + ky = c$, and the sinusoid oscillates around it with average zero, so its amplitude does not change the mean level. For $y' + 4y = 12 + 5\\cos x$ the level is $\\frac{12}{4} = 3$.\n\n> **Watch out.** The level is the constant forcing divided by $k$, not the forcing $c$ itself, and the amplitude $A$ of the cosine adds nothing to it.",
    "当正弦强迫项加上一个常数时，线性使响应分开。常数部分对 $y' + ky = c$ 给出稳定水平 $\\frac{c}{k}$，正弦部分围绕它振荡，平均值为零，所以其振幅不改变平均水平。对 $y' + 4y = 12 + 5\\cos x$，水平是 $\\frac{12}{4} = 3$。\n\n> **注意。** 水平是常数强迫项除以 $k$，而不是强迫项 $c$ 本身；余弦的振幅 $A$ 对它没有贡献。",
  ],
  (rng) => {
    const k = rng.int(2, 9);
    const m = nz(rng, 9);
    const c = k * m;
    const A = rng.int(2, 40);
    const w = rng.int(1, 9);
    const wx = `${w === 1 ? "" : w}x`;
    return numberProblem({
      prompt: t(
        `The steady-state solution of $y' + ${k}y = ${c} + ${A}\\cos ${wx}$ oscillates around a constant level. Find that level.`,
        `$y' + ${k}y = ${c} + ${A}\\cos ${wx}$ 的稳态解围绕一个常数水平振荡。求这个水平。`,
      ),
      answer: m,
      mistakes: apart(m, [
        why(
          c,
          `That is the constant forcing itself; the steady response to it is the forcing divided by $${k}$.`,
          `这是常数强迫项本身；对它的稳态响应要除以 $${k}$。`,
        ),
        why(
          Q.of(A, k),
          "That treats the amplitude of the cosine as a constant forcing; the cosine part averages to zero.",
          "这是把余弦的振幅当成常数强迫项；余弦部分的平均值为零。",
        ),
        why(
          Q.of(c + A, k),
          "That adds the amplitude of the cosine to the constant; the cosine part averages to zero.",
          "这是把余弦的振幅加到常数上；余弦部分的平均值为零。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Split the forcing", "拆分强迫项"],
            t(
              `By linearity the steady state is $y_{c} + y_{s}$, where $y_{c}' + ${k}y_{c} = ${c}$ and $y_{s}' + ${k}y_{s} = ${A}\\cos ${wx}$.`,
              `由线性，稳态解是 $y_{c} + y_{s}$，其中 $y_{c}' + ${k}y_{c} = ${c}$，$y_{s}' + ${k}y_{s} = ${A}\\cos ${wx}$。`,
            ),
          ],
          [
            ["Find the level", "求水平"],
            t(
              `The constant response is $y_{c} = \\frac{${c}}{${k}} = ${m}$. The response $y_{s}$ is a combination of $\\cos ${wx}$ and $\\sin ${wx}$, whose average is zero, so the level is $${m}$.`,
              `常数响应是 $y_{c} = \\frac{${c}}{${k}} = ${m}$。响应 $y_{s}$ 是 $\\cos ${wx}$ 与 $\\sin ${wx}$ 的组合，平均值为零，所以水平是 $${m}$。`,
            ),
          ],
        ],
        t(
          `$y_{c} = ${m}$ has $y_{c}' = 0$, and $0 + ${k} \\cdot ${paren(m)} = ${c}$, the constant forcing.`,
          `$y_{c} = ${m}$ 满足 $y_{c}' = 0$，且 $0 + ${k} \\cdot ${paren(m)} = ${c}$，正是常数强迫项。`,
        ),
      ),
    });
  },
);

const straightLineFromSubstitution = point(
  "straight-line-solutions-from-a-constant-in-v",
  ["Straight-line solutions from a constant in v", "由 v 为常数得到直线解"],
  [
    "After $v = ax + y$, the equation is autonomous in $v$, so its equilibria are worth finding. Each constant $v = m$ means $ax + y = m$, a straight-line solution of the original equation with slope $-a$ and intercept $m$. For $y' = (2x + y)^{2} - 6$, $v' = v^{2} - 4$, so $v = \\pm 2$ and the lines are $y = -2x \\pm 2$.\n\n> **Watch out.** $v' = a + y'$, so the $a$ from differentiating $ax$ must be added before setting $v' = 0$; forgetting it gives $v^{2} = q$ instead of $v^{2} = q - a$.",
    "代换 $v = ax + y$ 后，方程关于 $v$ 是自治的，所以应当求它的平衡解。每个常数 $v = m$ 就是 $ax + y = m$，这是原方程的一条直线解，斜率为 $-a$，截距为 $m$。对 $y' = (2x + y)^{2} - 6$，$v' = v^{2} - 4$，所以 $v = \\pm 2$，直线是 $y = -2x \\pm 2$。\n\n> **注意。** $v' = a + y'$，所以在令 $v' = 0$ 之前要加上对 $ax$ 求导得到的 $a$；漏掉它会得到 $v^{2} = q$，而不是 $v^{2} = q - a$。",
  ],
  (rng) => {
    const a = rng.int(1, 6);
    const m = rng.int(1, 9);
    const q = a + m * m;
    const inner = poly([a, "x"], [1, "y"]);
    return numberProblem({
      prompt: t(
        `$y' = (${inner})^{2} - ${q}$ has two straight-line solutions, found by setting $v = ${inner}$ equal to a constant. Find the larger $y$-intercept of the two.`,
        `$y' = (${inner})^{2} - ${q}$ 有两条直线解，令 $v = ${inner}$ 等于常数即可求得。求两者中较大的 $y$ 轴截距。`,
      ),
      answer: m,
      mistakes: apart(m, [
        why(m * m, `That is $v^{2}$; the intercept is the constant value of $v$ itself.`, `这是 $v^{2}$；截距是 $v$ 本身的常数值。`),
        why(-m, "That is the smaller of the two intercepts.", "这是两条直线中较小的截距。"),
        why(
          q,
          `That reads the constant $${q}$ off the equation; $v'$ also contains the $${a}$ from differentiating $${poly([a, "x"])}$.`,
          `这是直接读出方程中的常数 $${q}$；$v'$ 中还有对 $${poly([a, "x"])}$ 求导得到的 $${a}$。`,
        ),
      ]),
      solution: walked(
        [
          [["Write the equation for v", "写出 v 的方程"], t("", ""), [`v' = ${a} + y' = v^{2} - ${q} + ${a} = v^{2} - ${m * m}`]],
          [
            ["Set v constant", "令 v 为常数"],
            t(
              `$v' = 0$ when $v = \\pm ${m}$. So the lines are $y = ${poly([-a, "x"])} \\pm ${m}$, and the larger intercept is $${m}$.`,
              `当 $v = \\pm ${m}$ 时 $v' = 0$。所以直线是 $y = ${poly([-a, "x"])} \\pm ${m}$，较大的截距是 $${m}$。`,
            ),
          ],
        ],
        t(
          `On $y = ${poly([-a, "x"], [m, ""])}$, $y' = ${-a}$ and $(${inner})^{2} - ${q} = ${m * m} - ${q} = ${-a}$.`,
          `在 $y = ${poly([-a, "x"], [m, ""])}$ 上，$y' = ${-a}$，而 $(${inner})^{2} - ${q} = ${m * m} - ${q} = ${-a}$。`,
        ),
      ),
    });
  },
);

const bernoulliCoefficient = point(
  "the-linear-equation-from-a-bernoulli-equation",
  ["The linear equation from a Bernoulli equation", "由伯努利方程得到的线性方程"],
  [
    "For $y' + ky = cy^{n}$, the substitution $v = y^{1 - n}$ gives $v' + (1 - n)kv = (1 - n)c$. Both sides are multiplied by $1 - n$, which is negative for $n \\ge 2$, and this factor is often forgotten or written as $n - 1$. For $y' + 2y = 5y^{3}$, $v = y^{-2}$ gives $v' - 4v = -10$.\n\n> **Watch out.** The factor $1 - n$ multiplies both $P$ and $Q$, not just one of them, and for $n \\ge 2$ it is negative, so the signs of both change.",
    "对 $y' + ky = cy^{n}$，代换 $v = y^{1 - n}$ 得 $v' + (1 - n)kv = (1 - n)c$。两边都乘以 $1 - n$，当 $n \\ge 2$ 时它是负数，这个因子常被漏掉或写成 $n - 1$。对 $y' + 2y = 5y^{3}$，$v = y^{-2}$ 给出 $v' - 4v = -10$。\n\n> **注意。** 因子 $1 - n$ 同时乘到 $P$ 和 $Q$ 上，而不只是其中一个；当 $n \\ge 2$ 时它是负数，所以两者都要变号。",
  ],
  (rng) => {
    const k = nz(rng, 9);
    const c = nz(rng, 9);
    const n = rng.int(2, 5);
    const left = rng.bool();
    const answer = (1 - n) * (left ? k : c);
    const eq = `y' ${k < 0 ? "-" : "+"} ${Math.abs(k) === 1 ? "" : Math.abs(k)}y = ${poly([c, `y^{${n}}`])}`;
    const name = left ? "P" : "Q";
    return numberProblem({
      prompt: t(
        `The substitution $v = y^{${1 - n}}$ turns $${eq}$ into $v' + Pv = Q$. Find $${name}$.`,
        `代换 $v = y^{${1 - n}}$ 把 $${eq}$ 变成 $v' + Pv = Q$。求 $${name}$。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          -answer,
          `That multiplies by $n - 1 = ${n - 1}$; the factor from $v' = (1 - n)y^{-n}y'$ is $1 - n = ${1 - n}$.`,
          `这是乘以 $n - 1 = ${n - 1}$；由 $v' = (1 - n)y^{-n}y'$ 得到的因子是 $1 - n = ${1 - n}$。`,
        ),
        why(left ? k : c, `That forgets to multiply by $1 - n = ${1 - n}$.`, `这里忘了乘以 $1 - n = ${1 - n}$。`),
        why(
          left ? (1 - n) * c : (1 - n) * k,
          left
            ? "That is $Q$, the right side; $P$ is the coefficient of $v$."
            : "That is $P$, the coefficient of $v$; $Q$ is the right side.",
          left ? "这是右端 $Q$；$P$ 是 $v$ 的系数。" : "这是 $v$ 的系数 $P$；$Q$ 是右端。",
        ),
      ]),
      solution: walked(
        [
          [["Differentiate v", "对 v 求导"], t("", ""), [`v = y^{${1 - n}}, \\quad v' = ${poly([1 - n, `y^{${-n}}y'`])}`]],
          [
            ["Multiply the equation", "方程两边相乘"],
            t(
              `Multiplying the equation by $${poly([1 - n, `y^{${-n}}`])}$ gives $${poly([1, "v'"], [(1 - n) * k, "v"])} = ${(1 - n) * c}$, so $${name} = ${answer}$.`,
              `方程两边乘以 $${poly([1 - n, `y^{${-n}}`])}$，得 $${poly([1, "v'"], [(1 - n) * k, "v"])} = ${(1 - n) * c}$，所以 $${name} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `Term by term: $${poly([1 - n, `y^{${-n}}`])} \\cdot y' = v'$, $${poly([1 - n, `y^{${-n}}`])} \\cdot ${paren(k)}y = ${(1 - n) * k}v$ and $${poly([1 - n, `y^{${-n}}`])} \\cdot ${paren(c)}y^{${n}} = ${(1 - n) * c}$.`,
          `逐项看：$${poly([1 - n, `y^{${-n}}`])} \\cdot y' = v'$，$${poly([1 - n, `y^{${-n}}`])} \\cdot ${paren(k)}y = ${(1 - n) * k}v$，$${poly([1 - n, `y^{${-n}}`])} \\cdot ${paren(c)}y^{${n}} = ${(1 - n) * c}$。`,
        ),
      ),
    });
  },
);

const recognizingHomogeneous = point(
  "recognizing-a-homogeneous-right-side",
  ["Recognizing a homogeneous right side", "识别齐次的右端"],
  [
    "The $v$ substitution works only when the right side depends on $\\frac{y}{x}$ alone, which means every term of the numerator and the denominator has the same total degree. A single term of different degree, such as a constant, breaks this. For example $\\frac{x^{2} + y^{2}}{xy} = \\frac{1 + (y/x)^{2}}{y/x}$, while $\\frac{x^{2} + y^{2} + 1}{xy}$ keeps a leftover $\\frac{1}{x^{2}}$.\n\n> **Watch out.** Count the total degree of every single term, $xy$ included, which has degree $2$. One term of degree $1$ or $0$ is enough to stop the right side from depending on $\\frac{y}{x}$ alone.",
    "只有当右端只依赖于 $\\frac{y}{x}$ 时，$v$ 代换才有效，也就是分子和分母的每一项总次数都相同。只要有一项次数不同（例如一个常数），就不成立。例如 $\\frac{x^{2} + y^{2}}{xy} = \\frac{1 + (y/x)^{2}}{y/x}$，而 $\\frac{x^{2} + y^{2} + 1}{xy}$ 会剩下一个 $\\frac{1}{x^{2}}$。\n\n> **注意。** 要数出每一项的总次数，$xy$ 也算，它的次数是 $2$。只要有一项次数为 $1$ 或 $0$，右端就不只依赖于 $\\frac{y}{x}$。",
  ],
  (rng) => {
    const a = rng.int(2, 9);
    const b = rng.int(2, 9);
    const c = rng.int(1, 9);
    const den = `${b}xy`;
    const both = (latex: string) => t(`$y' = ${latex}$`, `$y' = ${latex}$`);
    return explainedChoice(rng, {
      prompt: t(
        `Which of these equations can be written with its right side as a function of $\\frac{y}{x}$ alone?`,
        `下列哪个方程的右端可以写成只依赖于 $\\frac{y}{x}$ 的函数？`,
      ),
      correct: both(`\\frac{x^{2} + ${a}y^{2}}{${den}}`),
      wrong: [
        {
          option: both(`\\frac{x^{2} + ${a}y^{2} + ${c}}{${den}}`),
          why: t("The constant term has degree $0$ while the others have degree $2$.", "常数项的次数是 $0$，而其他项的次数是 $2$。"),
        },
        {
          option: both(`\\frac{x + ${a}y^{2}}{${den}}`),
          why: t("The term $x$ has degree $1$ while the others have degree $2$.", "$x$ 这一项的次数是 $1$，而其他项的次数是 $2$。"),
        },
        {
          option: both(`\\frac{x^{2} + ${a}y}{${den}}`),
          why: t(`The term $${a}y$ has degree $1$ while the others have degree $2$.`, `$${a}y$ 这一项的次数是 $1$，而其他项的次数是 $2$。`),
        },
      ],
      solution: walked(
        [
          [
            ["Check the degrees", "检查次数"],
            t(
              `In $\\frac{x^{2} + ${a}y^{2}}{${den}}$ the terms $x^{2}$, $${a}y^{2}$ and $${den}$ all have degree $2$.`,
              `在 $\\frac{x^{2} + ${a}y^{2}}{${den}}$ 中，$x^{2}$、$${a}y^{2}$ 与 $${den}$ 的次数都是 $2$。`,
            ),
          ],
          [
            ["Divide by x squared", "同除以 x 的平方"],
            t("Dividing the top and bottom by $x^{2}$:", "分子分母同除以 $x^{2}$："),
            [`\\frac{x^{2} + ${a}y^{2}}{${den}} = \\frac{1 + ${a}\\left(\\frac{y}{x}\\right)^{2}}{${b}\\frac{y}{x}}`],
          ],
        ],
        t(
          `Replacing $x, y$ by $2x, 2y$ multiplies the top and the bottom by $4$, so the right side does not change, as a function of $\\frac{y}{x}$ alone must behave.`,
          `把 $x, y$ 换成 $2x, 2y$，分子分母都乘以 $4$，所以右端不变，这正是只依赖于 $\\frac{y}{x}$ 的函数应有的性质。`,
        ),
      ),
    });
  },
);

const riccatiLinearKnown = point(
  "riccati-equations-with-a-non-constant-known-solution",
  ["Riccati equations with a non-constant known solution", "已知解不是常数的里卡蒂方程"],
  [
    "The substitution $y = y_{1} + \\frac{1}{u}$ also works when $y_{1}$ depends on $x$, and then the linear equation for $u$ has a variable coefficient. For $y' = y^{2} + \\cdots$ it is $u' = -2y_{1}u - 1$, so the coefficient comes from the known solution. With $y_{1} = 3x$ the equation is $u' = -6xu - 1$, so $g(1) = -6$.\n\n> **Watch out.** The coefficient is $-2y_{1}$, from the cross term $\\frac{2y_{1}}{u}$ of $\\left(y_{1} + \\frac{1}{u}\\right)^{2}$: the factor $2$ and the minus sign both stay, and $y_{1}$ is evaluated at the given $x$.",
    "当 $y_{1}$ 依赖于 $x$ 时，代换 $y = y_{1} + \\frac{1}{u}$ 同样有效，此时 $u$ 的线性方程系数是变量。对 $y' = y^{2} + \\cdots$，它是 $u' = -2y_{1}u - 1$，所以系数来自已知解。当 $y_{1} = 3x$ 时方程是 $u' = -6xu - 1$，所以 $g(1) = -6$。\n\n> **注意。** 系数 $-2y_{1}$ 来自 $\\left(y_{1} + \\frac{1}{u}\\right)^{2}$ 的交叉项 $\\frac{2y_{1}}{u}$：因子 $2$ 和负号都要保留，并且 $y_{1}$ 要在给定的 $x$ 处取值。",
  ],
  (rng) => {
    const k = rng.int(1, 9);
    const x0 = nz(rng, 6);
    const answer = -2 * k * x0;
    const y1 = poly([k, "x"]);
    const eq = poly([1, "y^{2}"], [-k * k, "x^{2}"], [k, ""]);
    return numberProblem({
      prompt: t(
        `$y_{1} = ${y1}$ solves $y' = ${eq}$. The substitution $y = y_{1} + \\frac{1}{u}$ gives $u' = g(x)u - 1$. Find $g(${x0})$.`,
        `$y_{1} = ${y1}$ 是 $y' = ${eq}$ 的解。代换 $y = y_{1} + \\frac{1}{u}$ 得 $u' = g(x)u - 1$。求 $g(${x0})$。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          -answer,
          "The sign is flipped; multiplying by $-u^{2}$ makes the coefficient $-2y_{1}$.",
          "符号反了；两边乘以 $-u^{2}$ 后系数是 $-2y_{1}$。",
        ),
        why(
          -k * x0,
          "That loses the factor $2$ of the cross term $\\frac{2y_{1}}{u}$.",
          "这里丢掉了交叉项 $\\frac{2y_{1}}{u}$ 中的因子 $2$。",
        ),
        why(
          -2 * k,
          `That uses the slope $${k}$ of $y_{1}$; the coefficient is $-2y_{1}$ evaluated at $x = ${x0}$.`,
          `这里用了 $y_{1}$ 的斜率 $${k}$；系数是 $-2y_{1}$ 在 $x = ${x0}$ 处的值。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Substitute", "代换"],
            t(
              `With $y = ${y1} + \\frac{1}{u}$, the left side is $y' = ${k} - \\frac{u'}{u^{2}}$ and the right side is $\\frac{${2 * k}x}{u} + \\frac{1}{u^{2}} + ${k}$, since $y_{1}^{2} - ${k * k}x^{2} = 0$.`,
              `令 $y = ${y1} + \\frac{1}{u}$，左边是 $y' = ${k} - \\frac{u'}{u^{2}}$，右边是 $\\frac{${2 * k}x}{u} + \\frac{1}{u^{2}} + ${k}$，因为 $y_{1}^{2} - ${k * k}x^{2} = 0$。`,
            ),
          ],
          [
            ["Multiply by minus u squared", "两边乘以负的 u 平方"],
            t("", ""),
            [`u' = ${poly([-2 * k, "x"])}u - 1`, `g(${x0}) = ${-2 * k} \\cdot ${paren(x0)} = ${answer}`],
          ],
        ],
        t(
          `$y_{1} = ${y1}$ does solve the equation: $y_{1}' = ${k}$ and $${k * k}x^{2} - ${k * k}x^{2} + ${k} = ${k}$. And $g = -2y_{1} = ${poly([-2 * k, "x"])}$ agrees with the general rule.`,
          `$y_{1} = ${y1}$ 确实是解：$y_{1}' = ${k}$，且 $${k * k}x^{2} - ${k * k}x^{2} + ${k} = ${k}$。而 $g = -2y_{1} = ${poly([-2 * k, "x"])}$ 与一般规律一致。`,
        ),
      ),
    });
  },
);

const clairautThroughPoint = point(
  "clairaut-lines-through-a-given-point",
  ["Clairaut lines through a given point", "过定点的克莱罗直线"],
  [
    "The special d'Alembert equation $y = xy' + g(y')$ is a Clairaut equation, and its general solution is the family of lines $y = cx + g(c)$. To find the solutions through a point, substitute the point and solve for the slope $c$. For $y = cx + c^{2}$ through $(-3, -2)$, $c^{2} - 3c + 2 = 0$ gives $c = 1$ and $c = 2$.\n\n> **Watch out.** Substitute $x_{0}$ for $x$ and $y_{0}$ for $y$, then solve the quadratic in $c$; its roots are the slopes, not the coordinates of the point, and the larger root is asked for.",
    "特殊的达朗贝尔方程 $y = xy' + g(y')$ 是克莱罗方程，通解是直线族 $y = cx + g(c)$。要求过某点的解，把点代入并解出斜率 $c$。对 $y = cx + c^{2}$，过 $(-3, -2)$ 时 $c^{2} - 3c + 2 = 0$，得 $c = 1$ 与 $c = 2$。\n\n> **注意。** 把 $x_{0}$ 代入 $x$，$y_{0}$ 代入 $y$，再解关于 $c$ 的二次方程；它的根是斜率，而不是点的坐标，并且要的是较大的根。",
  ],
  (rng) => {
    const c1 = rng.int(-6, 5);
    const c2 = c1 + rng.int(1, 6);
    const x0 = -(c1 + c2);
    const y0 = -c1 * c2;
    const quad = poly([1, "c^{2}"], [x0, "c"], [-y0, ""]);
    return numberProblem({
      prompt: t(
        `The general solution of $y = xy' + (y')^{2}$ is the family of lines $y = cx + c^{2}$. Two of them pass through $(${x0}, ${y0})$. Find the larger value of $c$.`,
        `$y = xy' + (y')^{2}$ 的通解是直线族 $y = cx + c^{2}$。其中两条经过 $(${x0}, ${y0})$。求较大的 $c$。`,
      ),
      answer: c2,
      mistakes: apart(c2, [
        why(c1, "That is the smaller of the two slopes.", "这是两个斜率中较小的一个。"),
        why(
          -c1,
          "That flips the sign of the smaller root; the two roots of $c^{2} + x_{0}c - y_{0} = 0$ are read off with their own signs.",
          "这是把较小根的符号弄反了；$c^{2} + x_{0}c - y_{0} = 0$ 的两个根要按各自的符号读出。",
        ),
        why(
          x0,
          "That is the $x$-coordinate of the point; the slope is a root of the quadratic in $c$.",
          "这是点的 $x$ 坐标；斜率是关于 $c$ 的二次方程的根。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Substitute the point", "代入该点"],
            t(`Putting $x = ${x0}$ and $y = ${y0}$ into $y = cx + c^{2}$:`, `把 $x = ${x0}$、$y = ${y0}$ 代入 $y = cx + c^{2}$：`),
            [`${y0} = ${paren(x0)}c + c^{2}`, `${quad} = 0`],
          ],
          [
            ["Solve for c", "解出 c"],
            t(`The roots are $${c1}$ and $${c2}$; the larger is $${c2}$.`, `根是 $${c1}$ 和 $${c2}$；较大的是 $${c2}$。`),
          ],
        ],
        t(
          `$${c2} \\cdot ${paren(x0)} + ${paren(c2)}^{2} = ${c2 * x0} + ${c2 * c2} = ${y0}$, so the line $y = ${poly([c2, "x"], [c2 * c2, ""]) || "0"}$ passes through the point.`,
          `$${c2} \\cdot ${paren(x0)} + ${paren(c2)}^{2} = ${c2 * x0} + ${c2 * c2} = ${y0}$，所以直线 $y = ${poly([c2, "x"], [c2 * c2, ""]) || "0"}$ 经过该点。`,
        ),
      ),
    });
  },
);

const ambientFromReadings = point(
  "the-room-temperature-from-three-readings",
  ["The room temperature from three readings", "由三个读数求室温"],
  [
    "Under Newton's law the difference $T - A$ shrinks by the same factor over equal times, so $(T_{1} - A)^{2} = (T_{0} - A)(T_{2} - A)$. Three equally spaced readings therefore give the room temperature without knowing the rate constant, and it is lower than every reading.",
    "按牛顿定律，差值 $T - A$ 在相等的时间内按相同比例缩小，所以 $(T_{1} - A)^{2} = (T_{0} - A)(T_{2} - A)$。因此三个等间隔的读数不需要速率常数就能给出室温，而且它低于每个读数。",
  ],
  (rng) => {
    const A = rng.int(10, 30);
    const d = rng.int(2, 15);
    const ratio = rng.pick([2, 3]);
    const T2 = A + d;
    const T1 = A + d * ratio;
    const T0 = A + d * ratio * ratio;
    const gap = rng.int(2, 20);
    return ask(
      [
        `An object cools by Newton's law. Its temperature is $${T0}$ degrees at first, $${T1}$ degrees after $${gap}$ minutes and $${T2}$ degrees after $${2 * gap}$ minutes. Find the room temperature.`,
        `一个物体按牛顿定律冷却。它的温度开始时是 $${T0}$ 度，$${gap}$ 分钟后是 $${T1}$ 度，$${2 * gap}$ 分钟后是 $${T2}$ 度。求室温。`,
      ],
      A,
      [T2, T1, Q.of(T0 + T1 + T2, 3)],
      [
        `$(${T1} - A)^{2} = (${T0} - A)(${T2} - A)$. The $A^{2}$ terms cancel, and solving the linear equation gives $A = ${A}$. Check: the differences $${T0 - A}$, $${T1 - A}$ and $${T2 - A}$ shrink by the same factor.`,
        `$(${T1} - A)^{2} = (${T0} - A)(${T2} - A)$。$A^{2}$ 项抵消，解一次方程得 $A = ${A}$。检验：差值 $${T0 - A}$、$${T1 - A}$ 和 $${T2 - A}$ 按相同比例缩小。`,
      ],
    );
  },
);

/** rightTriples are Pythagorean triples used for positions and speeds on a circle in the phase plane. */
const rightTriples = [
  [3, 4, 5],
  [4, 3, 5],
  [5, 12, 13],
  [12, 5, 13],
  [8, 15, 17],
  [15, 8, 17],
] as const;

const turningPoint = point(
  "the-turning-point-of-a-restoring-force",
  ["The turning point of a restoring force", "恢复力下的折返点"],
  [
    "Using $v\\frac{dv}{dx} = a(x)$ with $a = -k^{2}x$ gives the conserved quantity $v^{2} + k^{2}x^{2}$. The particle turns back where $v = 0$, so the amplitude comes from the initial position and speed together, not from either one alone.",
    "用 $v\\frac{dv}{dx} = a(x)$，当 $a = -k^{2}x$ 时得到守恒量 $v^{2} + k^{2}x^{2}$。质点在 $v = 0$ 处折返，所以振幅由初始位置和速度共同决定，而不是由其中之一决定。",
  ],
  (rng) => {
    const [p, q, h] = rng.pick(rightTriples);
    const k = rng.int(1, 6);
    const u = rng.int(1, 4);
    const x0 = p * u;
    const v0 = k * q * u;
    return ask(
      [
        `A particle has acceleration $a = ${poly([-k * k, "x"])}$. It is at $x = ${x0}$ with speed $${v0}$. What is the greatest distance from $x = 0$ that it reaches?`,
        `质点的加速度是 $a = ${poly([-k * k, "x"])}$。它在 $x = ${x0}$ 处，速率是 $${v0}$。它离 $x = 0$ 的最大距离是多少？`,
      ],
      h * u,
      [x0, q * u, (p + q) * u],
      [
        `$${poly([1, "v^{2}"], [k * k, "x^{2}"])}$ is constant, and it equals $${v0 * v0} + ${k * k * x0 * x0} = ${v0 * v0 + k * k * x0 * x0}$. At the turning point $v = 0$, so $x^{2} = ${(h * u) ** 2}$ and the distance is $${h * u}$.`,
        `$${poly([1, "v^{2}"], [k * k, "x^{2}"])}$ 是常数，等于 $${v0 * v0} + ${k * k * x0 * x0} = ${v0 * v0 + k * k * x0 * x0}$。在折返点 $v = 0$，所以 $x^{2} = ${(h * u) ** 2}$，距离是 $${h * u}$。`,
      ],
    );
  },
);

const zeroConditions = {
  ...point(
    "zero-initial-data-force-the-zero-solution",
    ["Zero initial data force the zero solution", "零初值迫使解为零"],
    [
      "By the uniqueness theorem, a solution of a homogeneous linear equation with continuous coefficients is fixed by $y(a)$ and $y'(a)$. If both are zero, it is the zero solution. So no nonzero solution can have a graph that touches the axis with zero slope. For example, if $y'' + xy' + y = 0$ with $y(1) = 0$ and $y'(1) = 0$, then $y(3) = 0$, with no solving needed.\n\n> **Watch out.** Two conditions fix both constants, so nothing is left undetermined; and the zero function is always a solution of a homogeneous linear equation, so it is the one.",
      "由唯一性定理，系数连续的齐次线性方程的解由 $y(a)$ 和 $y'(a)$ 确定。如果二者都为零，解就是零解。所以非零解的图像不可能以零斜率接触坐标轴。例如，若 $y'' + xy' + y = 0$，$y(1) = 0$，$y'(1) = 0$，则不必求解就有 $y(3) = 0$。\n\n> **注意。** 两个条件确定了两个常数，所以没有任何东西是不确定的；而零函数总是齐次线性方程的解，所以解就是它。",
    ],
    (rng) => {
      const p = nz(rng, 9);
      const q = nz(rng, 9);
      const a = rng.int(-5, 5);
      const b = a + rng.int(1, 6);
      const eq = poly([1, "y''"], [p, "xy'"], [q, "y"]);
      return explainedChoice(rng, {
        prompt: t(
          `$y$ solves $${eq} = 0$ with $y(${a}) = 0$ and $y'(${a}) = 0$. What is $y(${b})$?`,
          `$y$ 是 $${eq} = 0$ 的解，且 $y(${a}) = 0$，$y'(${a}) = 0$。$y(${b})$ 是多少？`,
        ),
        correct: t("$0$", "$0$"),
        wrong: [
          {
            option: t("It cannot be determined without solving the equation", "不解方程无法确定"),
            why: t(
              "The uniqueness theorem settles it: only one solution meets both conditions.",
              "唯一性定理已经决定了它：只有一个解满足两个条件。",
            ),
          },
          {
            option: t("It depends on the two arbitrary constants", "取决于两个任意常数"),
            why: t("The two conditions fix both constants, so none is left free.", "两个条件确定了两个常数，没有自由的常数。"),
          },
          {
            option: t(`$${b - a}$`, `$${b - a}$`),
            why: t(
              `That is the distance from $${a}$ to $${b}$, which plays no part in the value of $y$.`,
              `这是从 $${a}$ 到 $${b}$ 的距离，与 $y$ 的值无关。`,
            ),
          },
        ],
        solution: walked(
          [
            [
              ["Find one solution", "找出一个解"],
              t(
                `The zero function $y = 0$ satisfies $${eq} = 0$, and it has $y(${a}) = 0$ and $y'(${a}) = 0$.`,
                `零函数 $y = 0$ 满足 $${eq} = 0$，且 $y(${a}) = 0$，$y'(${a}) = 0$。`,
              ),
            ],
            [
              ["Use uniqueness", "利用唯一性"],
              t(
                `The coefficients $1$, $${p === 1 ? "" : p === -1 ? "-" : p}x$ and $${q}$ are continuous everywhere, so only one solution meets the two conditions. It is the zero function, and $y(${b}) = 0$.`,
                `系数 $1$、$${p === 1 ? "" : p === -1 ? "-" : p}x$ 与 $${q}$ 处处连续，所以只有一个解满足这两个条件。它就是零函数，所以 $y(${b}) = 0$。`,
              ),
            ],
          ],
          t(
            "Any nonzero solution would touch the axis with zero slope at the starting point, which uniqueness rules out.",
            "任何非零解都会在起点以零斜率接触坐标轴，而唯一性排除了这种情况。",
          ),
        ),
      });
    },
  ),
  figure: differentialEquationsDrawings1["introduction-to-second-order-linear-odes#zero-initial-data-force-the-zero-solution"],
};

const affineCombination = point(
  "combinations-that-solve-a-forced-equation",
  ["Combinations that solve a forced equation", "满足强迫方程的组合"],
  [
    "Superposition for a forced equation has a condition. If $L[y_{1}] = g$ and $L[y_{2}] = g$, then $L[ay_{1} + by_{2}] = (a + b)g$. So the combination solves the same equation only when $a + b = 1$, unlike the homogeneous case, where any combination works. For $3y_{1} + by_{2}$ this means $b = -2$.\n\n> **Watch out.** The coefficients must add to $1$, not $0$: with $a + b = 0$ the combination solves the homogeneous equation instead.",
    "强迫方程的叠加是有条件的。如果 $L[y_{1}] = g$，$L[y_{2}] = g$，则 $L[ay_{1} + by_{2}] = (a + b)g$。所以只有 $a + b = 1$ 时组合才满足同一方程，这与任何组合都成立的齐次情形不同。对 $3y_{1} + by_{2}$，这意味着 $b = -2$。\n\n> **注意。** 系数之和必须是 $1$，而不是 $0$：若 $a + b = 0$，组合满足的是齐次方程。",
  ],
  (rng) => {
    const a = rng.pick([-7, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8]);
    const g = rng.pick(["e^{x}", "\\sin x", "x^{2}", "\\cos 2x", "x + 1", "e^{-x}", "7"]);
    const eq = rng.pick(["y'' + 3y' + 2y", "y'' - 4y", "y'' + y", "y'' - y' + 5y"]);
    const answer = 1 - a;
    return numberProblem({
      prompt: t(
        `$y_{1}$ and $y_{2}$ both solve $${eq} = ${g}$. For which $b$ does $${a}y_{1} + by_{2}$ also solve it?`,
        `$y_{1}$ 和 $y_{2}$ 都是 $${eq} = ${g}$ 的解。当 $b$ 为何值时，$${a}y_{1} + by_{2}$ 也是它的解？`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          -a,
          "That makes the coefficients add to $0$, so the combination solves the homogeneous equation.",
          "这使系数之和为 $0$，组合满足的是齐次方程。",
        ),
        why(
          a,
          `That takes $b$ equal to $${a}$; the right side would then be multiplied by $${2 * a}$.`,
          `这是取 $b$ 等于 $${a}$；右端就会乘以 $${2 * a}$。`,
        ),
        why(
          1 + a,
          `The sign is off; from $${a} + b = 1$, $b = 1 - ${paren(a)}$.`,
          `符号错了；由 $${a} + b = 1$ 得 $b = 1 - ${paren(a)}$。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Apply the operator", "作用算子"],
            t("The operator is linear, so", "算子是线性的，所以"),
            [`L[${a}y_{1} + by_{2}] = ${a}L[y_{1}] + bL[y_{2}] = (${a} + b)\\left(${g}\\right)`],
          ],
          [["Match the right side", "与右端相等"], t("", ""), [`${a} + b = 1`, `b = ${answer}`]],
        ],
        t(
          `$${a} + ${paren(answer)} = 1$, so $L[${a}y_{1} ${answer < 0 ? "-" : "+"} ${Math.abs(answer) === 1 ? "" : Math.abs(answer)}y_{2}] = 1 \\cdot \\left(${g}\\right)$, the same right side.`,
          `$${a} + ${paren(answer)} = 1$，所以 $L[${a}y_{1} ${answer < 0 ? "-" : "+"} ${Math.abs(answer) === 1 ? "" : Math.abs(answer)}y_{2}] = 1 \\cdot \\left(${g}\\right)$，右端相同。`,
        ),
      ),
    });
  },
);

const rateFromWronskian = point(
  "a-rate-from-the-wronskian-of-two-exponentials",
  ["A rate from the Wronskian of two exponentials", "由两个指数函数的朗斯基行列式求速率"],
  [
    "For exponentials, $W(e^{ax}, e^{kx}) = (k - a)e^{(a + k)x}$. Its value at $0$ is $k - a$, in that order, and it vanishes exactly when the rates agree, so two exponentials with different rates are always independent. If $y_{1} = e^{2x}$ and $W(0) = 3$, then $k - 2 = 3$ and $k = 5$.\n\n> **Watch out.** The value at $0$ is $k - a$, the second rate minus the first; reading it as $a - k$, or as $k$ itself, gives the wrong rate.",
    "对指数函数，$W(e^{ax}, e^{kx}) = (k - a)e^{(a + k)x}$。它在 $0$ 处的值是 $k - a$，注意顺序；它恰好在速率相同时为零，所以速率不同的两个指数函数总是线性无关。若 $y_{1} = e^{2x}$，$W(0) = 3$，则 $k - 2 = 3$，$k = 5$。\n\n> **注意。** $0$ 处的值是 $k - a$，即第二个速率减第一个；把它读成 $a - k$ 或 $k$ 本身，都会得到错误的速率。",
  ],
  (rng) => {
    const a = nz(rng, 8);
    const w = nz(rng, 9);
    const k = a + w;
    return numberProblem({
      prompt: t(
        `For $y_{1} = ${expOf(a)}$ and $y_{2} = e^{kx}$, the Wronskian $W(y_{1}, y_{2})$ has the value $${w}$ at $x = 0$. Find $k$.`,
        `对 $y_{1} = ${expOf(a)}$ 和 $y_{2} = e^{kx}$，朗斯基行列式 $W(y_{1}, y_{2})$ 在 $x = 0$ 处的值是 $${w}$。求 $k$。`,
      ),
      answer: k,
      mistakes: apart(k, [
        why(a - w, "That uses $a - k$; the Wronskian at $0$ is $k - a$.", "这是用了 $a - k$；朗斯基行列式在 $0$ 处是 $k - a$。"),
        why(
          w,
          `That takes $k$ as the value of $W(0)$; the rate $${a}$ of $y_{1}$ must be added.`,
          `这是把 $k$ 当成 $W(0)$ 的值；还要加上 $y_{1}$ 的速率 $${a}$。`,
        ),
        why(
          -w,
          "That is minus the value of the Wronskian, with the rate of $y_{1}$ left out.",
          "这是朗斯基行列式值的相反数，而且漏掉了 $y_{1}$ 的速率。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Evaluate at 0", "在 0 处求值"],
            t(
              "At $x = 0$ both exponentials are $1$, and their derivatives are the rates:",
              "在 $x = 0$ 处两个指数函数都等于 $1$，导数等于速率：",
            ),
            [`W(0) = 1 \\cdot k - ${paren(a)} \\cdot 1 = k - ${paren(a)}`],
          ],
          [["Solve for k", "解出 k"], t("", ""), [`k - ${paren(a)} = ${w}`, `k = ${k}`]],
        ],
        t(
          `With $k = ${k}$, $W = (${k} - ${paren(a)})${a + k === 0 ? "" : expOf(a + k)} = ${poly([w, a + k === 0 ? "" : expOf(a + k)])}$, which is $${w}$ at $0$.`,
          `取 $k = ${k}$，$W = (${k} - ${paren(a)})${a + k === 0 ? "" : expOf(a + k)} = ${poly([w, a + k === 0 ? "" : expOf(a + k)])}$，在 $0$ 处为 $${w}$。`,
        ),
      ),
    });
  },
);

const anotherParticular = point(
  "other-solutions-of-the-same-forced-equation",
  ["Other solutions of the same forced equation", "同一强迫方程的其他解"],
  [
    "A particular solution is not unique. Adding any homogeneous solution gives another one. But doubling the particular part, or dropping part of it, does not work, because the result no longer satisfies the forced equation. If the general solution is $c_{1}e^{x} + c_{2}e^{-x} + 2x + 1$, then $2x + 1 + 5e^{x}$ is a solution, while $4x + 2$ is not.\n\n> **Watch out.** Every solution must contain the whole particular part, with coefficient $1$; only the homogeneous part can be changed freely.",
    "特解不唯一。加上任何齐次解都得到另一个特解。但把特解部分加倍或去掉其中一部分都不行，因为结果不再满足强迫方程。若通解是 $c_{1}e^{x} + c_{2}e^{-x} + 2x + 1$，则 $2x + 1 + 5e^{x}$ 是解，而 $4x + 2$ 不是。\n\n> **注意。** 每个解都必须完整地包含特解部分，且系数为 $1$；只有齐次部分可以随意改变。",
  ],
  (rng) => {
    const a = rng.int(1, 6);
    const b = -rng.int(1, 6);
    const p = nz(rng, 9);
    const q = nz(rng, 9);
    const c = nz(rng, 9);
    const part = linear(p, q);
    const general = poly([1, `c_{1}${expOf(a)}`], [1, `c_{2}${expOf(b)}`], [p, "x"], [q, ""]);
    const both = (latex: string) => t(`$y = ${latex}$`, `$y = ${latex}$`);
    return explainedChoice(rng, {
      prompt: t(
        `An equation has the general solution $y = ${general}$. Which of these also solves it?`,
        `一个方程的通解是 $y = ${general}$。下列哪一个也是它的解？`,
      ),
      correct: both(poly([p, "x"], [q, ""], [c, expOf(a)])),
      wrong: [
        {
          option: both(poly([c, expOf(a)], [c, expOf(b)])),
          why: t(`This has no particular part, so it solves only the homogeneous equation.`, `它没有特解部分，所以只满足齐次方程。`),
        },
        {
          option: both(linear(2 * p, 2 * q)),
          why: t(
            `This doubles the particular part $${part}$, which doubles the right side as well.`,
            `它把特解部分 $${part}$ 加倍了，右端也随之加倍。`,
          ),
        },
        {
          option: both(poly([p, "x"], [c, expOf(a)])),
          why: t(`This drops the constant $${q}$ of the particular part.`, `它丢掉了特解部分中的常数 $${q}$。`),
        },
      ],
      solution: walked(
        [
          [
            ["Separate the parts", "分开两部分"],
            t(
              `The particular part is $${part}$; the homogeneous part is $${poly([1, `c_{1}${expOf(a)}`], [1, `c_{2}${expOf(b)}`])}$, with any constants.`,
              `特解部分是 $${part}$；齐次部分是 $${poly([1, `c_{1}${expOf(a)}`], [1, `c_{2}${expOf(b)}`])}$，常数任意。`,
            ),
          ],
          [
            ["Match the general form", "与通解形式对照"],
            t(
              `Taking $c_{1} = ${c}$ and $c_{2} = 0$ gives $${poly([p, "x"], [q, ""], [c, expOf(a)])}$, which keeps the particular part whole.`,
              `取 $c_{1} = ${c}$，$c_{2} = 0$ 得 $${poly([p, "x"], [q, ""], [c, expOf(a)])}$，它完整保留了特解部分。`,
            ),
          ],
        ],
        t(
          `Subtracting the particular part $${part}$ from this solution leaves $${poly([c, expOf(a)])}$, a solution of the homogeneous equation, as it must.`,
          `从这个解中减去特解部分 $${part}$，剩下 $${poly([c, expOf(a)])}$，它是齐次方程的解，正应如此。`,
        ),
      ),
    });
  },
);

const coefficientFromWronskianDecay = point(
  "the-coefficient-from-how-the-wronskian-changes",
  ["The coefficient from how the Wronskian changes", "由朗斯基行列式的变化求系数"],
  [
    "Abel's identity can be read in reverse. For $y'' + Py' + Qy = 0$ with constant $P$, $W(x) = W(0)e^{-Px}$. So two values of the Wronskian determine $P$, while $Q$ plays no part, and the minus sign means that positive $P$ makes $W$ shrink. If $W(0) = 3$ and $W(\\ln 2) = \\frac{3}{4}$, the ratio is $2^{-P} = \\frac{1}{4}$, so $P = 2$.\n\n> **Watch out.** A shrinking Wronskian means a positive $P$, because of the minus sign in $e^{-Px}$; and $P$ is the exponent of the ratio, not the ratio itself.",
    "阿贝尔恒等式可以反过来读。对常数 $P$ 的 $y'' + Py' + Qy = 0$，$W(x) = W(0)e^{-Px}$。所以朗斯基行列式的两个值决定 $P$，而 $Q$ 不起作用；负号说明正的 $P$ 使 $W$ 缩小。若 $W(0) = 3$，$W(\\ln 2) = \\frac{3}{4}$，比值为 $2^{-P} = \\frac{1}{4}$，所以 $P = 2$。\n\n> **注意。** 朗斯基行列式缩小说明 $P$ 为正，因为 $e^{-Px}$ 中有负号；$P$ 是比值的指数，而不是比值本身。",
  ],
  (rng) => {
    const P = nz(rng, 5);
    const w = rng.pick([1, 2, 3, 5, 6, 7]);
    const value = Q.of(w).mul(Q.of(2).pow(-P));
    const ratio = Q.of(2).pow(-P);
    const eq = `y'' + Py' + ${rng.int(2, 9)}y = 0`;
    return numberProblem({
      prompt: t(
        `Two solutions of $${eq}$ have Wronskian $W(0) = ${w}$ and $W(\\ln 2) = ${value.toLatex()}$. Find the constant $P$.`,
        `$${eq}$ 的两个解的朗斯基行列式满足 $W(0) = ${w}$，$W(\\ln 2) = ${value.toLatex()}$。求常数 $P$。`,
      ),
      answer: P,
      mistakes: apart(P, [
        why(
          -P,
          "The sign is flipped; Abel's identity has $e^{-Px}$, so a shrinking $W$ means $P > 0$.",
          "符号反了；阿贝尔恒等式中是 $e^{-Px}$，所以 $W$ 缩小意味着 $P > 0$。",
        ),
        why(
          ratio,
          "That is the ratio $W(\\ln 2) \\div W(0)$; $P$ is minus its exponent base $2$.",
          "这是比值 $W(\\ln 2) \\div W(0)$；$P$ 是它以 $2$ 为底的指数的相反数。",
        ),
        why(
          Q.of(P, 2),
          "That divides by $2$ instead of by $\\ln 2$; at $x = \\ln 2$, $e^{-P\\ln 2} = 2^{-P}$.",
          "这是除以 $2$ 而不是 $\\ln 2$；在 $x = \\ln 2$ 处 $e^{-P\\ln 2} = 2^{-P}$。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Write Abel's identity", "写出阿贝尔恒等式"],
            t("With constant $P$:", "当 $P$ 为常数时："),
            [`W(\\ln 2) = W(0)e^{-P\\ln 2} = ${w} \\cdot 2^{-P}`],
          ],
          [
            ["Compare with the given value", "与所给值比较"],
            t("", ""),
            [`2^{-P} = ${w === 1 ? "" : `${value.toLatex()} \\div ${w} = `}${ratio.toLatex()} = 2^{${-P}}`, `P = ${P}`],
          ],
        ],
        t(
          `$${w} \\cdot 2^{${-P}} = ${value.toLatex()}$, the given value of $W(\\ln 2)$.`,
          `$${w} \\cdot 2^{${-P}} = ${value.toLatex()}$，正是所给的 $W(\\ln 2)$。`,
        ),
      ),
    });
  },
);

const quadraticForcing = point(
  "the-constant-term-under-quadratic-forcing",
  ["The constant term under quadratic forcing", "二次强迫项下的常数项"],
  [
    "For quadratic forcing, try $y_{p} = Ax^{2} + Bx + C$ and match coefficients from the highest power down. The constant term of the equation collects three contributions, $2A + aB + bC$, so the constant $C$ is not simply the forcing constant divided by $b$. For $y'' + y' + y = x^{2} + 2x + 3$: $A = 1$, then $2A + B = 2$ gives $B = 0$, and $2A + B + C = 3$ gives $C = 1$.\n\n> **Watch out.** The constant term gets $2A$ from $y_{p}''$ and $aB$ from $ay_{p}'$; subtract both before dividing by $b$.",
    "对二次强迫项，设 $y_{p} = Ax^{2} + Bx + C$，从最高次幂开始比较系数。方程的常数项有三个来源：$2A + aB + bC$，所以 $C$ 并不只是强迫项的常数除以 $b$。对 $y'' + y' + y = x^{2} + 2x + 3$：$A = 1$；由 $2A + B = 2$ 得 $B = 0$；由 $2A + B + C = 3$ 得 $C = 1$。\n\n> **注意。** 常数项从 $y_{p}''$ 得到 $2A$，从 $ay_{p}'$ 得到 $aB$；两者都要先减去，再除以 $b$。",
  ],
  (rng) => {
    const a = nz(rng, 4);
    const b = rng.pick([-2, -1, 1, 2]);
    const A = nz(rng, 4);
    const B = nz(rng, 5);
    const C = rng.int(-6, 6);
    const g2 = b * A;
    const g1 = 2 * a * A + b * B;
    const g0 = 2 * A + a * B + b * C;
    const eq = poly([1, "y''"], [a, "y'"], [b, "y"]);
    const g = poly([g2, "x^{2}"], [g1, "x"], [g0, ""]);
    return numberProblem({
      prompt: t(
        `The equation $${eq} = ${g}$ has a particular solution $y_{p} = Ax^{2} + Bx + C$. Find $C$.`,
        `方程 $${eq} = ${g}$ 有特解 $y_{p} = Ax^{2} + Bx + C$。求 $C$。`,
      ),
      answer: C,
      mistakes: apart(C, [
        why(
          Q.of(g0, b),
          `That divides the constant $${g0}$ by $${b}$ directly; $2A$ and $${paren(a)}B$ also land in the constant term.`,
          `这是直接用 $${g0}$ 除以 $${b}$；$2A$ 与 $${paren(a)}B$ 也落在常数项里。`,
        ),
        why(Q.of(g0 - a * B, b), "That leaves out the $2A$ that comes from $y_{p}''$.", "这里漏掉了来自 $y_{p}''$ 的 $2A$。"),
        why(
          Q.of(g0 - 2 * A, b),
          `That leaves out the $${paren(a)}B$ that comes from the $y'$ term.`,
          `这里漏掉了来自 $y'$ 项的 $${paren(a)}B$。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Match from the top power down", "从最高次幂开始比较"],
            t("Substituting $y_{p}' = 2Ax + B$ and $y_{p}'' = 2A$:", "代入 $y_{p}' = 2Ax + B$，$y_{p}'' = 2A$："),
            [`x^{2}: \\ ${paren(b)}A = ${g2} \\implies A = ${A}`, `x: \\ 2 \\cdot ${paren(a)}A + ${paren(b)}B = ${g1} \\implies B = ${B}`],
          ],
          [
            ["Match the constants", "比较常数项"],
            t("", ""),
            [`2A + ${paren(a)}B + ${paren(b)}C = ${g0}`, `${2 * A} + ${paren(a * B)} + ${paren(b)}C = ${g0} \\implies C = ${C}`],
          ],
        ],
        t(
          `$2 \\cdot ${paren(A)} + ${paren(a)} \\cdot ${paren(B)} + ${paren(b)} \\cdot ${paren(C)} = ${g0}$, the constant term of the right side.`,
          `$2 \\cdot ${paren(A)} + ${paren(a)} \\cdot ${paren(B)} + ${paren(b)} \\cdot ${paren(C)} = ${g0}$，正是右端的常数项。`,
        ),
      ),
    });
  },
);

const resonance = point(
  "the-coefficient-at-resonance",
  ["The coefficient at resonance", "共振时的系数"],
  [
    "When the forcing frequency equals the natural frequency, $A\\cos\\omega t$ solves the homogeneous equation and cannot be a particular solution. The right form has a factor of $t$, and for $y'' + \\omega^{2}y = F\\cos\\omega t$ it is $y_{p} = \\frac{F}{2\\omega}t\\sin\\omega t$. For $y'' + 4y = 8\\cos 2t$ this gives $A = \\frac{8}{4} = 2$.\n\n> **Watch out.** The surviving term is $2\\omega A\\cos\\omega t$, from differentiating the product twice; so divide by $2\\omega$, not by $\\omega$ or $\\omega^{2}$.",
    "当强迫频率等于固有频率时，$A\\cos\\omega t$ 满足齐次方程，不可能是特解。正确的形式带有因子 $t$，对 $y'' + \\omega^{2}y = F\\cos\\omega t$，它是 $y_{p} = \\frac{F}{2\\omega}t\\sin\\omega t$。对 $y'' + 4y = 8\\cos 2t$，得 $A = \\frac{8}{4} = 2$。\n\n> **注意。** 留下的项是对乘积求两次导得到的 $2\\omega A\\cos\\omega t$；所以要除以 $2\\omega$，而不是 $\\omega$ 或 $\\omega^{2}$。",
  ],
  (rng) => {
    const w = rng.int(1, 9);
    const F = nz(rng, 40);
    const answer = Q.of(F, 2 * w);
    const c = w === 1 ? "" : w;
    const eq = `${poly([1, "y''"], [w * w, "y"])} = ${poly([F, `\\cos ${c}t`])}`;
    const second = poly([2 * w, `A\\cos ${c}t`], [-w * w, `At\\sin ${c}t`]);
    const cancel = poly([w * w, "y_{p}"]);
    return numberProblem({
      prompt: t(
        `The equation $${eq}$ has a particular solution $y_{p} = At\\sin ${c}t$. Find $A$.`,
        `方程 $${eq}$ 有特解 $y_{p} = At\\sin ${c}t$。求 $A$。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          Q.of(F, w),
          "That forgets the factor $2$: the product rule produces the cosine term twice.",
          "这里忘了因子 $2$：乘积法则两次产生余弦项。",
        ),
        why(
          Q.of(F, w * w),
          "That divides by $\\omega^{2}$, as if the $t\\sin$ terms survived; they cancel.",
          "这是除以 $\\omega^{2}$，好像含 $t\\sin$ 的项还在；它们其实抵消了。",
        ),
        why(
          answer.neg(),
          "The sign is flipped; the second derivative of $t\\sin\\omega t$ has $+2\\omega\\cos\\omega t$.",
          "符号反了；$t\\sin\\omega t$ 的二阶导数中是 $+2\\omega\\cos\\omega t$。",
        ),
      ]),
      solution: walked(
        [
          [["Differentiate twice", "求两次导"], t("", ""), [`y_{p}'' = ${second}`]],
          [
            ["Substitute", "代入"],
            t(`The terms with $t$ cancel with $${cancel}$, which leaves`, `含 $t$ 的项与 $${cancel}$ 抵消，剩下`),
            [`${poly([2 * w, `A\\cos ${c}t`])} = ${poly([F, `\\cos ${c}t`])}`, `A = ${answer.toLatex()}`],
          ],
        ],
        t(
          `$2 \\cdot ${w} \\cdot ${answer.sign() < 0 ? `\\left(${answer.toLatex()}\\right)` : answer.toLatex()} = ${F}$, the forcing amplitude.`,
          `$2 \\cdot ${w} \\cdot ${answer.sign() < 0 ? `\\left(${answer.toLatex()}\\right)` : answer.toLatex()} = ${F}$，正是强迫振幅。`,
        ),
      ),
    });
  },
);

const eulerResonance = point(
  "a-logarithm-when-the-power-solves-the-homogeneous-equation",
  ["A logarithm when the power solves the homogeneous equation", "幂满足齐次方程时出现对数"],
  [
    "In a Cauchy-Euler equation, a forcing power $x^{r}$ with $r$ a root of the indicial equation is the analogue of resonance: $Ax^{r}$ gives zero. The right form is $Ax^{r}\\ln x$, and for distinct roots $r$ and $s$ the coefficient is $A = \\frac{c}{r - s}$.",
    "在柯西-欧拉方程中，如果强迫幂 $x^{r}$ 的 $r$ 是指标方程的根，就类似于共振：$Ax^{r}$ 代入后为零。正确的形式是 $Ax^{r}\\ln x$；对不同的根 $r$ 和 $s$，系数是 $A = \\frac{c}{r - s}$。",
  ],
  (rng) => {
    const r = rng.pick([-3, -2, -1, 1, 2, 3, 4, 5]);
    const s = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4, 5, 6].filter((v) => v !== r));
    const c = nz(rng, 12);
    const a = 1 - r - s;
    const b = r * s;
    const answer = Q.of(c, r - s);
    const eq = poly([1, "x^{2}y''"], [a, "xy'"], [b, "y"]);
    const pw = r === 1 ? "x" : `x^{${r}}`;
    return ask(
      [
        `The equation $${eq} = ${poly([c, pw])}$ has a particular solution $y_{p} = A${pw}\\ln x$. Find $A$.`,
        `方程 $${eq} = ${poly([c, pw])}$ 有特解 $y_{p} = A${pw}\\ln x$。求 $A$。`,
      ],
      answer,
      [c, answer.neg(), Q.of(c, r)],
      [
        `The indicial equation has roots $r = ${r}$ and $${s}$, so $${pw}$ solves the homogeneous equation and the terms with $\\ln x$ cancel. With $${a}$ the coefficient of $xy'$, what remains is $(2r - 1 + ${paren(a)})A = ${poly([r - s, "A"])}$ times the power. So $${poly([r - s, "A"])} = ${c}$ and $A = ${answer.toLatex()}$.`,
        `指标方程的根是 $r = ${r}$ 和 $${s}$，所以 $${pw}$ 满足齐次方程，含 $\\ln x$ 的项抵消。$xy'$ 的系数是 $${a}$，剩下的是 $(2r - 1 + ${paren(a)})A = ${poly([r - s, "A"])}$ 乘以这个幂。所以 $${poly([r - s, "A"])} = ${c}$，$A = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const nonResonantParameter = point(
  "variation-of-parameters-away-from-resonance",
  ["Variation of parameters away from resonance", "非共振时的参数变易"],
  [
    "With $y = u(x)e^{-kx}$, the equation $y' + ky = ce^{mx}$ gives $u' = ce^{(m + k)x}$. When $m + k \\ne 0$, integrating brings a factor $\\frac{1}{m + k}$, so the particular solution is $\\frac{c}{m + k}e^{mx}$. The exponents add, and do not subtract.",
    "设 $y = u(x)e^{-kx}$，方程 $y' + ky = ce^{mx}$ 给出 $u' = ce^{(m + k)x}$。当 $m + k \\ne 0$ 时，积分带来因子 $\\frac{1}{m + k}$，所以特解是 $\\frac{c}{m + k}e^{mx}$。指数是相加，而不是相减。",
  ],
  (rng) => {
    const k = nz(rng, 7);
    const options = [-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6].filter((v) => v !== -k && v !== k);
    const m = rng.pick(options);
    const c = nz(rng, 12);
    const answer = Q.of(c, m + k);
    const left = poly([1, "y'"], [k, "y"]);
    return ask(
      [
        `Using $y = u(x)${expOf(-k)}$, find the coefficient $A$ of the particular solution $y_{p} = A${expOf(m)}$ of $${left} = ${poly([c, expOf(m)])}$.`,
        `用 $y = u(x)${expOf(-k)}$，求 $${left} = ${poly([c, expOf(m)])}$ 的特解 $y_{p} = A${expOf(m)}$ 的系数 $A$。`,
      ],
      answer,
      [Q.of(c, m - k), c, Q.of(c, m)],
      [
        `$u' = ${poly([c, expOf(m + k)])}$, so $u = ${poly([answer, expOf(m + k)])}$. Multiplying by $${expOf(-k)}$ gives $A = ${answer.toLatex()}$.`,
        `$u' = ${poly([c, expOf(m + k)])}$，所以 $u = ${poly([answer, expOf(m + k)])}$。乘以 $${expOf(-k)}$，得 $A = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const secondParameterSign = point(
  "the-other-parameter-and-its-sign",
  ["The other parameter and its sign", "另一个参数及其符号"],
  [
    "In $u_{1}' = -\\frac{y_{2}g}{W}$ and $u_{2}' = \\frac{y_{1}g}{W}$ the minus sign is only on $u_{1}'$, and swapping the solutions changes the sign of $W$. So $u_{2}'$ uses $y_{1}$, the other solution, with the Wronskian computed in the stated order.",
    "在 $u_{1}' = -\\frac{y_{2}g}{W}$ 和 $u_{2}' = \\frac{y_{1}g}{W}$ 中，负号只在 $u_{1}'$ 上，而交换两个解会改变 $W$ 的符号。所以 $u_{2}'$ 用的是另一个解 $y_{1}$，并按给定顺序计算朗斯基行列式。",
  ],
  (rng) => {
    const a = nz(rng, 5);
    const b = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].filter((v) => v !== a));
    const m = rng.pick([-3, -2, -1, 1, 2, 3].filter((v) => v !== a && v !== b));
    const c = nz(rng, 12);
    const answer = Q.of(c, b - a);
    const eq = poly([1, "y''"], [-(a + b), "y'"], [a * b, "y"]);
    return ask(
      [
        `For $${eq} = ${poly([c, expOf(m)])}$, take $y_{1} = ${expOf(a)}$ and $y_{2} = ${expOf(b)}$. Then $u_{2}' = C${expOf(m - b)}$. Find $C$.`,
        `对 $${eq} = ${poly([c, expOf(m)])}$，取 $y_{1} = ${expOf(a)}$，$y_{2} = ${expOf(b)}$。于是 $u_{2}' = C${expOf(m - b)}$。求 $C$。`,
      ],
      answer,
      [answer.neg(), c, Q.of(c, a + b === 0 ? 2 * a : a + b)],
      [
        `$W = ${b - a}${a + b === 0 ? "" : expOf(a + b)}$. Then $u_{2}' = \\frac{y_{1}g}{W}$, and dividing gives the coefficient $${answer.toLatex()}$.`,
        `$W = ${b - a}${a + b === 0 ? "" : expOf(a + b)}$。于是 $u_{2}' = \\frac{y_{1}g}{W}$，相除得系数 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const cosecantForcing = point(
  "cosecant-forcing-with-a-frequency",
  ["Cosecant forcing with a frequency", "带频率的余割强迫项"],
  [
    "For $y'' + \\omega^{2}y = k\\csc\\omega x$, the Wronskian of $\\cos\\omega x$ and $\\sin\\omega x$ is $\\omega$, not $1$. So $u_{1} = -\\frac{k}{\\omega}x$ and $u_{2} = \\frac{k}{\\omega^{2}}\\ln|\\sin\\omega x|$, where the second has a further factor $\\frac{1}{\\omega}$ from integrating $\\cot\\omega x$.",
    "对 $y'' + \\omega^{2}y = k\\csc\\omega x$，$\\cos\\omega x$ 和 $\\sin\\omega x$ 的朗斯基行列式是 $\\omega$，而不是 $1$。所以 $u_{1} = -\\frac{k}{\\omega}x$，$u_{2} = \\frac{k}{\\omega^{2}}\\ln|\\sin\\omega x|$，后者由于积分 $\\cot\\omega x$ 又多了一个因子 $\\frac{1}{\\omega}$。",
  ],
  (rng) => {
    const w = rng.int(1, 6);
    const k = nz(rng, 12);
    const askX = rng.bool();
    const c = w === 1 ? "" : w;
    const first = Q.of(-k, w);
    const second = Q.of(k, w * w);
    const answer = askX ? first : second;
    const form = askX ? `x\\cos ${c}x` : `\\sin ${c}x\\,\\ln|\\sin ${c}x|`;
    const eq = `${poly([1, "y''"], [w * w, "y"])} = ${poly([k, `\\csc ${c}x`])}`;
    const cot = poly([first.neg(), `\\cot ${c}x`]);
    const logs = poly([second, `\\ln|\\sin ${c}x|`]);
    return ask(
      [
        `Variation of parameters gives a particular solution of $${eq}$ with $y_{1} = \\cos ${c}x$ and $y_{2} = \\sin ${c}x$. Find the coefficient of $${form}$ in it.`,
        `用参数变易法，取 $y_{1} = \\cos ${c}x$，$y_{2} = \\sin ${c}x$，求 $${eq}$ 的特解。求其中 $${form}$ 的系数。`,
      ],
      answer,
      [answer.neg(), askX ? second : first, k],
      [
        `$W = ${w}$. Then $u_{1}' = ${first.toLatex()}$ and $u_{2}' = ${cot}$, whose integrals are $${poly([first, "x"])}$ and $${logs}$. So the coefficient is $${answer.toLatex()}$.`,
        `$W = ${w}$。于是 $u_{1}' = ${first.toLatex()}$，$u_{2}' = ${cot}$，积分得 $${poly([first, "x"])}$ 和 $${logs}$。所以系数是 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const thirdParameter = point(
  "the-last-parameter-of-a-third-order-equation",
  ["The last parameter of a third-order equation", "三阶方程的最后一个参数"],
  [
    "For a third-order equation with leading coefficient $1$, Cramer's rule gives $u_{3}' = \\frac{W_{3}g}{W}$, where $W_{3}$ is the determinant with the third column replaced by $(0, 0, 1)$. For $y''' = g$ with $1, x, x^{2}$, $W = 2$ and $W_{3} = 1$.",
    "对首项系数为 $1$ 的三阶方程，克拉默法则给出 $u_{3}' = \\frac{W_{3}g}{W}$，其中 $W_{3}$ 是把第三列换成 $(0, 0, 1)$ 后的行列式。对 $y''' = g$ 和 $1, x, x^{2}$，$W = 2$，$W_{3} = 1$。",
  ],
  (rng) => {
    const c = nz(rng, 12);
    const m = rng.int(1, 4);
    const x0 = nz(rng, 3);
    const value = c * x0 ** m;
    const answer = Q.of(value, 2);
    const g = poly([c, m === 1 ? "x" : `x^{${m}}`]);
    return ask(
      [
        `For $y''' = ${g}$, take $y_{1} = 1$, $y_{2} = x$, $y_{3} = x^{2}$. Find $u_{3}'(${x0})$ in variation of parameters.`,
        `对 $y''' = ${g}$，取 $y_{1} = 1$，$y_{2} = x$，$y_{3} = x^{2}$。在参数变易法中，求 $u_{3}'(${x0})$。`,
      ],
      answer,
      [value, Q.of(value, 6), answer.neg()],
      [
        `The Wronskian of $1, x, x^{2}$ is $2$, and replacing the last column by $(0, 0, 1)$ gives $W_{3} = 1$. So $u_{3}' = \\frac{g}{2}$, which is $${answer.toLatex()}$ at $x = ${x0}$.`,
        `$1, x, x^{2}$ 的朗斯基行列式是 $2$，把最后一列换成 $(0, 0, 1)$ 得 $W_{3} = 1$。所以 $u_{3}' = \\frac{g}{2}$，在 $x = ${x0}$ 处等于 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const eliminatingOneVariable = point(
  "a-second-order-equation-from-a-system",
  ["A second-order equation from a system", "由方程组得到二阶方程"],
  [
    "A system of two first-order equations can be reduced to one second-order equation. Eliminating $x_{2}$ from a system with matrix $A$ gives $x_{1}'' - \\operatorname{tr}(A)x_{1}' + \\det(A)x_{1} = 0$, whose coefficients are the trace and determinant of the matrix.",
    "两个一阶方程组成的方程组可以化为一个二阶方程。从矩阵为 $A$ 的方程组中消去 $x_{2}$，得 $x_{1}'' - \\operatorname{tr}(A)x_{1}' + \\det(A)x_{1} = 0$，系数就是矩阵的迹和行列式。",
  ],
  (rng) => {
    const a = nz(rng, 7);
    const b = nz(rng, 7);
    const c = nz(rng, 7);
    const d = nz(rng, 7);
    const useDet = rng.bool();
    const tr = a + d;
    const det = a * d - b * c;
    const answer = useDet ? det : -tr;
    const name = useDet ? "q" : "p";
    return ask(
      [
        `From $x_{1}' = ${poly([a, "x_{1}"], [b, "x_{2}"])}$, $x_{2}' = ${poly([c, "x_{1}"], [d, "x_{2}"])}$, eliminating $x_{2}$ gives $x_{1}'' + px_{1}' + qx_{1} = 0$. Find $${name}$.`,
        `从 $x_{1}' = ${poly([a, "x_{1}"], [b, "x_{2}"])}$，$x_{2}' = ${poly([c, "x_{1}"], [d, "x_{2}"])}$ 中消去 $x_{2}$，得 $x_{1}'' + px_{1}' + qx_{1} = 0$。求 $${name}$。`,
      ],
      answer,
      [useDet ? a * d + b * c : tr, useDet ? -det : a - d, useDet ? tr : det],
      [
        `The trace is $${tr}$ and the determinant is $${det}$, and the equation is $x_{1}'' - \\operatorname{tr}(A)x_{1}' + \\det(A)x_{1} = 0$. So $${name} = ${answer}$.`,
        `迹是 $${tr}$，行列式是 $${det}$，方程是 $x_{1}'' - \\operatorname{tr}(A)x_{1}' + \\det(A)x_{1} = 0$。所以 $${name} = ${answer}$。`,
      ],
    );
  },
);

const thirdOrderState = point(
  "the-state-velocity-of-a-third-order-equation",
  ["The state velocity of a third-order equation", "三阶方程的状态速度"],
  [
    "A third-order equation needs three state variables: $x_{1} = y$, $x_{2} = y'$ and $x_{3} = y''$. The first two equations just pass along the next variable. All the content is in $x_{3}'$, which is the forcing minus the other terms moved to the right side.",
    "三阶方程需要三个状态变量：$x_{1} = y$，$x_{2} = y'$，$x_{3} = y''$。前两个方程只是传递下一个变量。所有内容都在 $x_{3}'$ 中，它等于强迫项减去移到右边的其他项。",
  ],
  (rng) => {
    const a = nz(rng, 5);
    const b = nz(rng, 5);
    const c = nz(rng, 5);
    const p = nz(rng, 5);
    const q = rng.int(-5, 5);
    const T = rng.int(1, 3);
    const x1 = rng.int(-4, 4);
    const x2 = rng.int(-4, 4);
    const x3 = rng.int(-4, 4);
    const g = p * T + q;
    const answer = g - a * x3 - b * x2 - c * x1;
    const eq = poly([1, "y'''"], [a, "y''"], [b, "y'"], [c, "y"]);
    return ask(
      [
        `Write $${eq} = ${linear(p, q).replace(/x/g, "t")}$ as a system with $x_{1} = y$, $x_{2} = y'$, $x_{3} = y''$. If $y(${T}) = ${x1}$, $y'(${T}) = ${x2}$ and $y''(${T}) = ${x3}$, find $x_{3}'(${T})$.`,
        `把 $${eq} = ${linear(p, q).replace(/x/g, "t")}$ 写成方程组，其中 $x_{1} = y$，$x_{2} = y'$，$x_{3} = y''$。如果 $y(${T}) = ${x1}$，$y'(${T}) = ${x2}$，$y''(${T}) = ${x3}$，求 $x_{3}'(${T})$。`,
      ],
      answer,
      [g + a * x3 + b * x2 + c * x1, g, -a * x3 - b * x2 - c * x1],
      [
        `$x_{3}' = y''' = ${g} - ${paren(a)} \\cdot ${paren(x3)} - ${paren(b)} \\cdot ${paren(x2)} - ${paren(c)} \\cdot ${paren(x1)} = ${answer}$, where $${g}$ is the forcing at $t = ${T}$.`,
        `$x_{3}' = y''' = ${g} - ${paren(a)} \\cdot ${paren(x3)} - ${paren(b)} \\cdot ${paren(x2)} - ${paren(c)} \\cdot ${paren(x1)} = ${answer}$，其中 $${g}$ 是 $t = ${T}$ 时的强迫项。`,
      ],
    );
  },
);

const dependentVectors = {
  ...point(
    "the-entry-that-makes-vector-solutions-dependent",
    ["The entry that makes vector solutions dependent", "使向量解线性相关的分量"],
    [
      "For a linear system, two solutions are dependent exactly when their Wronskian is zero, and checking one time is enough. So requiring $\\det(\\mathbf{x}_{1}(0), \\mathbf{x}_{2}(0)) = 0$ gives an equation for an unknown entry, which makes the initial vectors parallel.",
      "对线性方程组，两个解线性相关，当且仅当它们的朗斯基行列式为零，而且检查一个时刻就够了。所以令 $\\det(\\mathbf{x}_{1}(0), \\mathbf{x}_{2}(0)) = 0$，就得到未知分量的方程，这使初始向量平行。",
    ],
    (rng) => {
      const a = rng.int(2, 6);
      const m = nz(rng, 5);
      const b = a * m;
      const c = nz(rng, 9);
      const answer = m * c;
      return ask(
        [
          `Two solutions of a linear system have $\\mathbf{x}_{1}(0) = \\begin{pmatrix} ${a} \\\\ ${b} \\end{pmatrix}$ and $\\mathbf{x}_{2}(0) = \\begin{pmatrix} ${c} \\\\ k \\end{pmatrix}$. For which $k$ are they linearly dependent?`,
          `线性方程组的两个解满足 $\\mathbf{x}_{1}(0) = \\begin{pmatrix} ${a} \\\\ ${b} \\end{pmatrix}$，$\\mathbf{x}_{2}(0) = \\begin{pmatrix} ${c} \\\\ k \\end{pmatrix}$。当 $k$ 为何值时，它们线性相关？`,
        ],
        answer,
        [-answer, Q.of(a * c, b), b + c],
        [
          `The determinant is $${a}k - ${paren(b)} \\cdot ${paren(c)}$. Setting it to zero gives $k = \\frac{${b * c}}{${a}} = ${answer}$, and then the vectors are parallel.`,
          `行列式是 $${a}k - ${paren(b)} \\cdot ${paren(c)}$。令它为零，得 $k = \\frac{${b * c}}{${a}} = ${answer}$，此时两个向量平行。`,
        ],
      );
    },
  ),
  figure:
    differentialEquationsDrawings1["linear-independence-for-homogeneous-systems-of-odes#the-entry-that-makes-vector-solutions-dependent"],
};

const longRunOfGeneral = point(
  "the-long-run-depends-on-the-growing-coefficient",
  ["The long run depends on the growing coefficient", "长期行为取决于增长项的系数"],
  [
    "With one decaying and one growing mode, almost every solution grows. It tends to zero only if the coefficient of the growing mode is exactly zero, which happens when the initial state lies along the decaying eigenvector. So decompose the initial state before deciding.",
    "有一个衰减模式和一个增长模式时，几乎所有解都增长。只有增长模式的系数恰好为零时解才趋于零，也就是初始状态在衰减的特征向量方向上。所以判断之前要先分解初始状态。",
  ],
  (rng) => {
    const a = rng.int(1, 5);
    const b = rng.int(1, 5);
    const v1 = rng.pick([1, 2, 3, -1, -2, -3]);
    const v2 = rng.pick([4, 5, 6, -4, -5, -6]);
    const p = nz(rng, 5);
    const q = rng.bool() ? 0 : nz(rng, 5);
    const x0 = p + q;
    const y0 = p * v1 + q * v2;
    const decay: Pair = ["It tends to the zero vector", "它趋于零向量"];
    const grow: Pair = ["It grows without bound", "它无限增大"];
    const stay: Pair = ["It stays at its initial state", "它停留在初始状态"];
    const other: Pair = ["It tends to a nonzero constant vector", "它趋于非零常向量"];
    const correct = q === 0 ? decay : grow;
    const m = (v: number) => `\\begin{pmatrix} 1 \\\\ ${v} \\end{pmatrix}`;
    const general = `c_{1}${expOf(-a, "t")}${m(v1)} + c_{2}${expOf(b, "t")}${m(v2)}`;
    return choose(
      rng,
      [
        `A system has general solution $\\mathbf{x}(t) = ${general}$. What happens as $t \\to \\infty$ to the solution with $\\mathbf{x}(0) = \\begin{pmatrix} ${x0} \\\\ ${y0} \\end{pmatrix}$?`,
        `一个方程组的通解是 $\\mathbf{x}(t) = ${general}$。当 $t \\to \\infty$ 时，满足 $\\mathbf{x}(0) = \\begin{pmatrix} ${x0} \\\\ ${y0} \\end{pmatrix}$ 的解会怎样？`,
      ],
      correct,
      [decay, grow, stay, other].filter((o) => o !== correct),
      [
        `Matching at $t = 0$ gives $c_{1} = ${p}$ and $c_{2} = ${q}$. ${q === 0 ? "The growing mode is absent, so only the decaying term remains and the solution tends to zero." : "The growing mode is present, so the solution grows without bound."}`,
        `在 $t = 0$ 处比较，得 $c_{1} = ${p}$，$c_{2} = ${q}$。${q === 0 ? "增长模式不出现，只剩衰减项，所以解趋于零。" : "增长模式存在，所以解无限增大。"}`,
      ],
    );
  },
);

const crossingTime = point(
  "when-two-decoupled-components-agree",
  ["When two decoupled components agree", "两个解耦分量何时相等"],
  [
    "Each component of a decoupled system is its own exponential, so comparing them is simple algebra. Setting $pe^{at} = qe^{bt}$ gives $e^{(a - b)t} = \\frac{q}{p}$, and taking logarithms gives the time when the components agree.",
    "解耦方程组的每个分量都是各自的指数函数，所以比较它们只是简单的代数。令 $pe^{at} = qe^{bt}$，得 $e^{(a - b)t} = \\frac{q}{p}$，取对数就得到两个分量相等的时刻。",
  ],
  (rng) => {
    const b = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3]);
    const a = b + rng.pick([1, 2, 3, 4, 5, 6].filter((d) => d !== -b));
    const p = rng.int(1, 9);
    const m = rng.int(1, 5);
    const q = p * 2 ** m;
    const answer = Q.of(m, a - b);
    const meet = `${poly([p, expOf(a, "t")])} = ${poly([q, expOf(b, "t")])}`;
    const logs = `${poly([a - b, "t"])} = ${poly([m, "\\ln 2"])}`;
    return ask(
      [
        `$x_{1}' = ${poly([a, "x_{1}"])}$ and $x_{2}' = ${poly([b, "x_{2}"])}$, with $x_{1}(0) = ${p}$ and $x_{2}(0) = ${q}$. The components agree at $t = k\\ln 2$. Find $k$.`,
        `$x_{1}' = ${poly([a, "x_{1}"])}$，$x_{2}' = ${poly([b, "x_{2}"])}$，且 $x_{1}(0) = ${p}$，$x_{2}(0) = ${q}$。两个分量在 $t = k\\ln 2$ 时相等。求 $k$。`,
      ],
      answer,
      [m, answer.neg(), Q.of(m, a + b === 0 ? 1 : a + b)],
      [
        `$${meet}$ means $${expOf(a - b, "t")} = ${2 ** m}$. So $${logs}$ and $k = ${answer.toLatex()}$.`,
        `$${meet}$ 即 $${expOf(a - b, "t")} = ${2 ** m}$。所以 $${logs}$，$k = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const secondEigenvalue = point(
  "the-second-eigenvalue-from-the-trace",
  ["The second eigenvalue from the trace", "由迹求第二个特征值"],
  [
    "Once one eigenvalue is known, there is no need to factor again. The trace equals the sum of the eigenvalues, so the other is the trace minus the known one. The product with the known one should then equal the determinant, which is a useful check.",
    "知道一个特征值后，不必重新因式分解。迹等于特征值之和，所以另一个等于迹减去已知的那个。它与已知特征值的积应等于行列式，这是一个有用的检验。",
  ],
  (rng) => {
    const l1 = nz(rng, 7);
    const l2 = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6].filter((v) => v !== l1));
    const a = rng.int(-6, 6);
    const d = l1 + l2 - a;
    const c = a * d - l1 * l2;
    const b = 1;
    const m = `\\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}`;
    return ask(
      [
        `One eigenvalue of $A = ${m}$ is $\\lambda = ${l1}$. Find the other eigenvalue.`,
        `$A = ${m}$ 的一个特征值是 $\\lambda = ${l1}$。求另一个特征值。`,
      ],
      l2,
      [-l1, a + d, a * d - c],
      [
        `The trace is $${a + d}$, so the other eigenvalue is $${a + d} - ${paren(l1)} = ${l2}$. Check: $${paren(l1)} \\cdot ${paren(l2)} = ${l1 * l2}$, which is the determinant.`,
        `迹是 $${a + d}$，所以另一个特征值是 $${a + d} - ${paren(l1)} = ${l2}$。检验：$${paren(l1)} \\cdot ${paren(l2)} = ${l1 * l2}$，等于行列式。`,
      ],
    );
  },
);

const initialDirectionThatDecays = point(
  "the-initial-direction-that-decays",
  ["The initial direction that decays", "衰减的初始方向"],
  [
    "When $A$ has one negative and one positive eigenvalue, only the initial states along the eigenvector of the negative one give a solution that tends to zero. Any other initial state has some of the growing mode. So find this eigenvector from $(A - \\lambda I)\\mathbf{v} = \\mathbf{0}$.",
    "当 $A$ 有一个负特征值和一个正特征值时，只有沿负特征值的特征向量方向的初始状态，才给出趋于零的解。其他初始状态都含有增长模式。所以由 $(A - \\lambda I)\\mathbf{v} = \\mathbf{0}$ 求这个特征向量。",
  ],
  (rng) => {
    const s = rng.int(1, 6);
    const g = rng.int(1, 6);
    const m = nz(rng, 5);
    const entry = m * (-s - g);
    const A = `\\begin{pmatrix} ${-s} & 0 \\\\ ${entry} & ${g} \\end{pmatrix}`;
    return ask(
      [
        `For $\\mathbf{x}' = ${A}\\mathbf{x}$, the solution with $\\mathbf{x}(0) = \\begin{pmatrix} 1 \\\\ m \\end{pmatrix}$ tends to $\\mathbf{0}$ as $t \\to \\infty$. Find $m$.`,
        `对 $\\mathbf{x}' = ${A}\\mathbf{x}$，满足 $\\mathbf{x}(0) = \\begin{pmatrix} 1 \\\\ m \\end{pmatrix}$ 的解在 $t \\to \\infty$ 时趋于 $\\mathbf{0}$。求 $m$。`,
      ],
      m,
      [-m, entry, Q.of(entry, g)],
      [
        `The negative eigenvalue is $${-s}$. The second row of $(A - \\lambda I)\\mathbf{v} = \\mathbf{0}$ reads $${entry} + ${g + s}m = 0$, so $m = ${m}$.`,
        `负特征值是 $${-s}$。$(A - \\lambda I)\\mathbf{v} = \\mathbf{0}$ 的第二行是 $${entry} + ${g + s}m = 0$，所以 $m = ${m}$。`,
      ],
    );
  },
);

/** deeperDifferentialEquationsThirdPoints maps topics of Differential Equations, from first-order methods to distinct eigenvalues, to a third knowledge point. */
export const deeperDifferentialEquationsThirdPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "introduction-to-first-order-linear-odes": [integratingFactorPower],
  "solving-first-order-linear-odes-with-sinusoidal-forcing": [steadyMean],
  "solving-first-order-odes-by-substitution": [straightLineFromSubstitution],
  "further-solving-first-order-odes-by-substitution": [bernoulliCoefficient],
  "homogeneous-first-order-odes": [recognizingHomogeneous],
  "riccati-differential-equations": [riccatiLinearKnown],
  "dalembert-differential-equations": [clairautThroughPoint],
  "inhibited-decay-models-with-first-order-odes": [ambientFromReadings],
  "determining-properties-of-objects-described-as-functions-of-displacement": [turningPoint],
  "introduction-to-second-order-linear-odes": [zeroConditions],
  "the-superposition-principle": [affineCombination],
  "linear-independence-of-solutions-to-homogeneous-odes": [rateFromWronskian],
  "general-solutions-of-linear-odes": [anotherParticular],
  "abels-identity": [coefficientFromWronskianDecay],
  "second-order-inhomogeneous-odes-with-polynomial-forcing": [quadraticForcing],
  "second-order-inhomogeneous-odes-with-sinusoidal-forcing": [resonance],
  "cauchy-euler-equations-with-forcing": [eulerResonance],
  "variation-of-parameters-for-first-order-linear-odes": [nonResonantParameter],
  "variation-of-parameters-for-second-order-odes": [secondParameterSign],
  "solving-second-order-odes-using-variation-of-parameters": [cosecantForcing],
  "variation-of-parameters-with-higher-order-odes": [thirdParameter],
  "introduction-to-systems-of-linear-odes": [eliminatingOneVariable],
  "expressing-inhomogeneous-odes-as-first-order-systems": [thirdOrderState],
  "linear-independence-for-homogeneous-systems-of-odes": [dependentVectors],
  "general-solutions-of-first-order-linear-systems-of-odes": [longRunOfGeneral],
  "solving-decoupled-homogeneous-systems-of-odes": [crossingTime],
  "solving-homogeneous-systems-of-odes-with-distinct-eigenvalues": [secondEigenvalue],
  "solving-homogeneous-systems-of-odes-with-distinct-eigenvalues-and-initial-conditions": [initialDirectionThatDecays],
};
