import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { paren, poly, Q } from "@ga/subject-math";
import { multivariableDrawings8 } from "../explanation-drawings-multivariable-8.ts";
import { numberProblem, why } from "../problems.ts";
import { walked } from "./calculus-i-differentiation.ts";

/** asQ turns a number into a rational number so that values can be compared. */
const asQ = (c: number | Q): Q => (typeof c === "number" ? Q.of(c) : c);

/** coef writes a coefficient in front of a symbol, leaving out a 1 and writing -1 as a minus sign. */
const coef = (k: number): string => (k === 1 ? "" : k === -1 ? "-" : `${k}`);

/** withPi writes a rational multiple of a power of pi, leaving out a coefficient of 1. */
const withPi = (q: Q, pi = "\\pi"): string =>
  q.toLatex() === "1" ? pi : q.toLatex() === "-1" ? `-${pi}` : q.toLatex() === "0" ? "0" : `${q.toLatex()}${pi}`;

/** qcoef writes a rational coefficient in front of a symbol, leaving out a 1 and writing -1 as a minus sign. */
const qcoef = (q: Q): string => (q.toLatex() === "1" ? "" : q.toLatex() === "-1" ? "-" : q.toLatex());

/** sumOf writes a sum of integers with each negative term shown as a subtraction. */
const sumOf = (terms: readonly number[]): string => terms.map((v, i) => (i === 0 ? `${v}` : v < 0 ? `- ${-v}` : `+ ${v}`)).join(" ");

/** distinct drops the mistakes whose value is the answer or repeats an earlier one. */
function distinct<M extends { readonly value: number | Q }>(answer: number | Q, mistakes: readonly M[]): M[] {
  return mistakes.filter((m, i, all) => !asQ(m.value).eq(asQ(answer)) && all.findIndex((x) => asQ(x.value).eq(asQ(m.value))) === i);
}

// ---------------------------------------------------------------------------
// 6.27 Vector Mechanics
// ---------------------------------------------------------------------------

/** velocityAndAccelerationAsFunctionsOfDisplacement applies the chain rule a = v dv/dx. */
export const velocityAndAccelerationAsFunctionsOfDisplacement: TopicDef = {
  id: "velocity-and-acceleration-as-functions-of-displacement",
  title: t("Velocity and Acceleration as Functions of Displacement", "位移的函数：速度与加速度"),
  summary: t(
    "When speed is given as a function of position v(x), acceleration is computed via the chain rule as a(x) = v dv/dx.",
    "当速度以位置的函数 v(x) 给出时，通过链式法则计算加速度：a(x) = v dv/dx。",
  ),
  intro: t(
    "A particle moves with velocity $v(x) = 3x$. Find its acceleration at $x = 2$. By the chain rule $a = \\frac{dv}{dt} = \\frac{dv}{dx}\\frac{dx}{dt} = v\\frac{dv}{dx}$, so $a = 3x \\cdot 3 = 9x$, which is $18$ at $x = 2$.\n\nCheck: $\\frac{dx}{dt} = 3x$ is solved by $x = 2e^{3t}$, which passes $x = 2$ at $t = 0$; there $\\frac{d^2x}{dt^2} = 18e^{3t} = 18$.\n\nIn this lesson we find acceleration from a velocity given as a function of position, using $a = v\\frac{dv}{dx}$.",
    "质点的速度为 $v(x) = 3x$。求它在 $x = 2$ 处的加速度。由链式法则 $a = \\frac{dv}{dt} = \\frac{dv}{dx}\\frac{dx}{dt} = v\\frac{dv}{dx}$，所以 $a = 3x \\cdot 3 = 9x$，在 $x = 2$ 处为 $18$。\n\n检验：$\\frac{dx}{dt} = 3x$ 的解 $x = 2e^{3t}$ 在 $t = 0$ 时经过 $x = 2$；此时 $\\frac{d^2x}{dt^2} = 18e^{3t} = 18$。\n\n本课我们用 $a = v\\frac{dv}{dx}$，由以位置为自变量的速度求加速度。",
  ),
  prerequisites: ["calculating-velocity-for-straight-line-motion-using-differentiation"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "relating-acceleration-to-velocity-and-displacement",
      title: t("Relating acceleration to velocity and displacement", "建立加速度、速度与位移之间的链式法则关系"),
      explanation: t(
        "When acceleration is given in terms of position rather than time, the chain rule rewrites it as velocity times the derivative of velocity with respect to position. By the chain rule, $a = \\frac{dv}{dt} = \\frac{dv}{dx}\\frac{dx}{dt} = v\\frac{dv}{dx}$. For $v(x) = c x^2$, the derivative is $v'(x) = 2cx$, so $a(x) = (cx^2)(2cx) = 2c^2 x^3$. For $v = 8x^2$ at $x = 1$, this is $128$.\n\n> **Watch out.** The acceleration is $v$ times $\\frac{dv}{dx}$, not $\\frac{dv}{dx}$ alone; and since both factors contain $c$, the result has $c^2$.",
        "当加速度用位置而不是时间表示时，链式法则把它改写成速度乘以速度对位置的导数。由链式法则，$a = \\frac{dv}{dt} = \\frac{dv}{dx}\\frac{dx}{dt} = v\\frac{dv}{dx}$。对于 $v(x) = c x^2$，导数为 $v'(x) = 2cx$，故 $a(x) = (cx^2)(2cx) = 2c^2 x^3$。对 $v = 8x^2$，在 $x = 1$ 处为 $128$。\n\n> **注意。** 加速度是 $v$ 乘以 $\\frac{dv}{dx}$，而不只是 $\\frac{dv}{dx}$；两个因子都含 $c$，所以结果中是 $c^2$。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(2, 7);
        const x0 = rng.int(1, 6);
        const ans = 2 * c * c * x0 * x0 * x0;
        return numberProblem({
          prompt: t(
            `A particle moves along a straight line with velocity given by $v(x) = ${c}x^2$ as a function of displacement $x$. Find the acceleration $a$ at position $x = ${x0}$.`,
            `一质点沿直线运动，其速度随位移 $x$ 的变化规律为 $v(x) = ${c}x^2$。求质点位于位置 $x = ${x0}$ 时的加速度 $a$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              c * x0 * x0,
              "That is the velocity at that point; the acceleration is $v\\frac{dv}{dx}$.",
              "那是该点的速度；加速度是 $v\\frac{dv}{dx}$。",
            ),
            why(2 * c * x0, "That is $\\frac{dv}{dx}$ alone; it must be multiplied by $v$.", "那只是 $\\frac{dv}{dx}$；还要乘以 $v$。"),
            why(
              2 * c * x0 ** 3,
              `That multiplies $\\frac{dv}{dx}$ by $x^2$ instead of by $v = ${c}x^2$, losing a factor $${c}$.`,
              `那是用 $\\frac{dv}{dx}$ 乘以 $x^2$ 而不是乘以 $v = ${c}x^2$，少了因子 $${c}$。`,
            ),
          ]),
          solution: walked(
            [
              [["Differentiate v", "对 v 求导"], t(`$\\frac{dv}{dx} = ${2 * c}x$.`, `$\\frac{dv}{dx} = ${2 * c}x$。`)],
              [
                ["Multiply by v", "乘以 v"],
                t(
                  `$a = v\\frac{dv}{dx} = (${c}x^2)(${2 * c}x) = ${2 * c * c}x^3$.`,
                  `$a = v\\frac{dv}{dx} = (${c}x^2)(${2 * c}x) = ${2 * c * c}x^3$。`,
                ),
              ],
              [
                ["Evaluate", "代入"],
                t(
                  `At $x = ${x0}$, $a = ${2 * c * c} \\cdot ${x0}^3 = ${ans}$.`,
                  `在 $x = ${x0}$ 处，$a = ${2 * c * c} \\cdot ${x0}^3 = ${ans}$。`,
                ),
              ],
            ],
            t(
              `In the form $a = \\frac{1}{2}\\frac{d}{dx}(v^2)$: $v^2 = ${c * c}x^4$, whose derivative halved is $${2 * c * c}x^3$, the same.`,
              `用 $a = \\frac{1}{2}\\frac{d}{dx}(v^2)$ 的形式：$v^2 = ${c * c}x^4$，其导数的一半为 $${2 * c * c}x^3$，结果相同。`,
            ),
          ),
        });
      },
    },
    {
      id: "acceleration-from-the-square-of-the-speed",
      title: t("Acceleration from the square of the speed", "由速度平方求加速度"),
      explanation: t(
        "Since $\\frac{d}{dx}(v^2) = 2v\\frac{dv}{dx}$, the relation $a = v\\frac{dv}{dx}$ can be written as\n\n$$a = \\frac{1}{2}\\frac{d}{dx}\\left(v^2\\right).$$\n\nThis form is convenient when $v^2$ is given as a function of position, as it is in energy calculations: differentiate $v^2$, halve the result, and there is no square root to deal with. For $v^2 = 5x^2 + 50$, $a = \\frac{1}{2} \\cdot 10x = 5x$, which is $15$ at $x = 3$.\n\n> **Watch out.** Differentiate before evaluating and then halve: the constant term of $v^2$ drops out, and forgetting the $\\frac{1}{2}$ doubles the answer.",
        "由于 $\\frac{d}{dx}(v^2) = 2v\\frac{dv}{dx}$，关系 $a = v\\frac{dv}{dx}$ 可写成\n\n$$a = \\frac{1}{2}\\frac{d}{dx}\\left(v^2\\right)$$\n\n当 $v^2$ 以位置的函数给出时（如能量计算中），这种形式很方便：对 $v^2$ 求导再取一半，无需处理平方根。对 $v^2 = 5x^2 + 50$，$a = \\frac{1}{2} \\cdot 10x = 5x$，在 $x = 3$ 处为 $15$。\n\n> **注意。** 先求导再代入，然后取一半：$v^2$ 的常数项会消失，漏掉 $\\frac{1}{2}$ 会使答案加倍。",
      ),
      generate(rng: Rng): Problem {
        const p = rng.nonZero(-4, 4);
        const q = rng.int(-6, 6);
        const r = rng.int(10, 40);
        const x0 = rng.int(1, 4);
        const D = 2 * p * x0 + q;
        const ans = Q.of(D, 2);
        const vSq = poly([p, "x^2"], [q, "x"], [r, ""]);
        const dv = poly([2 * p, "x"], [q, ""]);
        return numberProblem({
          prompt: t(
            `A particle moving along the $x$-axis has $v^2 = ${vSq}$ (in m²/s²). Find its acceleration at $x = ${x0}$.`,
            `沿 $x$ 轴运动的质点满足 $v^2 = ${vSq}$（单位 m²/s²）。求它在 $x = ${x0}$ 处的加速度。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(Q.of(D), "That is the derivative of $v^2$; the acceleration is half of it.", "那是 $v^2$ 的导数；加速度是它的一半。"),
            why(
              Q.of(p * x0 * x0 + q * x0 + r, 2),
              "That halves $v^2$ itself; it must be differentiated first.",
              "那是把 $v^2$ 本身取一半；应先求导。",
            ),
            why(
              ans.neg(),
              "That has the wrong sign; $a = \\frac{1}{2}\\frac{d}{dx}(v^2)$ with no minus sign.",
              "那是符号错了；$a = \\frac{1}{2}\\frac{d}{dx}(v^2)$，没有负号。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Differentiate v²", "对 v² 求导"],
                t(
                  `$\\frac{d}{dx}(v^2) = ${dv}$, which is $${D}$ at $x = ${x0}$.`,
                  `$\\frac{d}{dx}(v^2) = ${dv}$，在 $x = ${x0}$ 处为 $${D}$。`,
                ),
              ],
              [
                ["Halve it", "取一半"],
                t(
                  `$a = \\frac{1}{2} \\cdot ${paren(D)} = ${ans.toLatex()}$.`,
                  `$a = \\frac{1}{2} \\cdot ${paren(D)} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `With $v = \\sqrt{v^2}$, $\\frac{dv}{dx} = \\frac{${D}}{2v}$ at that point, so $v\\frac{dv}{dx} = \\frac{${D}}{2} = ${ans.toLatex()}$.`,
              `由 $v = \\sqrt{v^2}$，该点处 $\\frac{dv}{dx} = \\frac{${D}}{2v}$，所以 $v\\frac{dv}{dx} = \\frac{${D}}{2} = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** determiningPropertiesOfObjectsDescribedAsFunctionsOfDisplacement integrates motion relations. */
export const determiningPropertiesOfObjectsDescribedAsFunctionsOfDisplacement: TopicDef = {
  id: "determining-properties-of-objects-described-as-functions-of-displacement",
  title: t("Determining Properties of Objects Described as Functions of Displacement", "位移函数描述下物体的运动性质"),
  summary: t(
    "Integrating the relation $v\\,dv = a(x)\\,dx$ gives $v(x)^2 - v_0^2 = 2\\int a(x)\\,dx$.",
    "对关系式 $v\\,dv = a(x)\\,dx$ 积分得到 $v(x)^2 - v_0^2 = 2\\int a(x)\\,dx$。",
  ),
  intro: t(
    "A particle starts from rest at $x = 0$ with constant acceleration $a = 6$. Find $v^2$ at $x = 3$. Separating $v\\,dv = 6\\,dx$ and integrating gives $\\frac{1}{2}v^2 = 6x$, so $v^2 = 12x = 36$ at $x = 3$.\n\nCheck: the constant-acceleration formula $v^2 = v_0^2 + 2as = 0 + 2 \\cdot 6 \\cdot 3 = 36$ agrees.\n\nIn this lesson we integrate $v\\,dv = a(x)\\,dx$ to find the speed of an object whose acceleration depends on its position.",
    "质点从 $x = 0$ 处由静止出发，加速度恒为 $a = 6$。求 $x = 3$ 处的 $v^2$。分离 $v\\,dv = 6\\,dx$ 并积分，得 $\\frac{1}{2}v^2 = 6x$，所以在 $x = 3$ 处 $v^2 = 12x = 36$。\n\n检验：匀加速公式 $v^2 = v_0^2 + 2as = 0 + 2 \\cdot 6 \\cdot 3 = 36$，结果一致。\n\n本课我们对 $v\\,dv = a(x)\\,dx$ 积分，求加速度依赖于位置的物体的速率。",
  ),
  prerequisites: ["velocity-and-acceleration-as-functions-of-displacement"],
  encompasses: [
    {
      topic: "velocity-and-acceleration-as-functions-of-displacement",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "integrating-equations-of-motion-with-displacement-dependence",
      title: t("Integrating equations of motion with displacement dependence", "积分含位移依赖的运动微分方程"),
      explanation: t(
        "Separating the variables and integrating gives half the square of the velocity in terms of position, which is an energy equation. From $a(x) = v \\frac{dv}{dx}$, separating variables gives $v\\,dv = a(x)\\,dx$. Integrating from $x = 0$ (starting from rest, $v(0) = 0$) to $x_1$ gives $\\frac{1}{2}v(x_1)^2 = \\int_0^{x_1} a(x)\\,dx$, so $v(x_1)^2 = 2 \\int_0^{x_1} a(x)\\,dx$. For $a = 10x + 1$ and $x_1 = 1$, the integral is $5 + 1 = 6$ and $v^2 = 12$.\n\n> **Watch out.** The left side integrates to $\\frac{1}{2}v^2$, so the integral must be doubled; and $kx$ integrates to $\\frac{k}{2}x^2$, not $kx^2$.",
        "分离变量并积分后得到用位置表示的速度平方的一半，这是一个能量方程。由 $a(x) = v \\frac{dv}{dx}$，分离变量得 $v\\,dv = a(x)\\,dx$。从 $x = 0$（初速为零 $v(0) = 0$）积分到 $x_1$ 可得 $\\frac{1}{2}v(x_1)^2 = \\int_0^{x_1} a(x)\\,dx$，即 $v(x_1)^2 = 2 \\int_0^{x_1} a(x)\\,dx$。对 $a = 10x + 1$ 与 $x_1 = 1$，积分为 $5 + 1 = 6$，$v^2 = 12$。\n\n> **注意。** 左边积分得 $\\frac{1}{2}v^2$，所以积分值要加倍；$kx$ 的积分是 $\\frac{k}{2}x^2$，不是 $kx^2$。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(2, 8);
        const b = rng.int(1, 8);
        const x1 = rng.int(1, 6);
        const vSq = k * x1 * x1 + 2 * b * x1;
        const half = Q.of(vSq, 2);
        const kx2 = k === 2 ? "x^2" : k % 2 === 0 ? `${k / 2}x^2` : `\\frac{${k}}{2}x^2`;
        return numberProblem({
          prompt: t(
            `A particle starts from rest at $x = 0$ and moves along the $x$-axis with acceleration $a(x) = ${k}x + ${b}$. Find the squared speed $v^2$ when the particle reaches $x = ${x1}$.`,
            `一质点自 $x = 0$ 处由静止出发沿 $x$ 轴正向运动，加速度为 $a(x) = ${k}x + ${b}$。求质点到达 $x = ${x1}$ 处的速度平方 $v^2$。`,
          ),
          answer: vSq,
          mistakes: distinct(vSq, [
            why(
              half,
              "That is $\\int a\\,dx$, which equals $\\frac{1}{2}v^2$; it must be doubled.",
              "那是 $\\int a\\,dx$，它等于 $\\frac{1}{2}v^2$；还要加倍。",
            ),
            why(
              k * x1 + b,
              "That is the acceleration at that point; $v^2$ comes from integrating the acceleration.",
              "那是该点的加速度；$v^2$ 要由加速度积分得到。",
            ),
            why(
              2 * k * x1 * x1 + 2 * b * x1,
              `That integrates $${k}x$ to $${k}x^2$; its antiderivative is $${kx2}$.`,
              `那是把 $${k}x$ 积分成 $${k}x^2$；它的原函数是 $${kx2}$。`,
            ),
          ]),
          solution: walked(
            [
              [["Separate the variables", "分离变量"], t(`$v\\,dv = (${k}x + ${b})\\,dx$.`, `$v\\,dv = (${k}x + ${b})\\,dx$。`)],
              [
                ["Integrate", "积分"],
                t(
                  `$\\frac{1}{2}v^2 = \\left[${kx2} + ${coef(b)}x\\right]_0^{${x1}} = ${Q.of(k * x1 * x1, 2).toLatex()} + ${b * x1} = ${half.toLatex()}$.`,
                  `$\\frac{1}{2}v^2 = \\left[${kx2} + ${coef(b)}x\\right]_0^{${x1}} = ${Q.of(k * x1 * x1, 2).toLatex()} + ${b * x1} = ${half.toLatex()}$。`,
                ),
              ],
              [["Double", "加倍"], t(`$v^2 = ${vSq}$.`, `$v^2 = ${vSq}$。`)],
            ],
            t(
              `Differentiating $\\frac{1}{2}v^2 = ${kx2} + ${coef(b)}x$ gives $v\\frac{dv}{dx} = ${k}x + ${b}$, which is $a(x)$.`,
              `对 $\\frac{1}{2}v^2 = ${kx2} + ${coef(b)}x$ 求导得 $v\\frac{dv}{dx} = ${k}x + ${b}$，正是 $a(x)$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-amplitude-of-a-restoring-force-motion",
      title: t("The amplitude of motion under a restoring acceleration", "回复加速度下运动的振幅"),
      explanation: t(
        "For $a(x) = -\\omega^2 x$, separating $v\\,dv = -\\omega^2 x\\,dx$ and integrating from $x = 0$, where the speed is $v_0$, gives\n\n$$v^2 = v_0^2 - \\omega^2 x^2.$$\n\nThe particle stops and turns back where $v = 0$, at $x = \\pm\\frac{v_0}{\\omega}$. So the amplitude of the oscillation is $A = \\frac{v_0}{\\omega}$. For $a = -49x$ and $v_0 = 14$, $\\omega = 7$ and the amplitude is $2$.\n\n> **Watch out.** The coefficient in $a = -\\omega^2 x$ is $\\omega^2$, so take its square root before dividing $v_0$ by it; and the turning point is where $v^2 = 0$, so solve for $x$, not $x^2$.",
        "对 $a(x) = -\\omega^2 x$，分离 $v\\,dv = -\\omega^2 x\\,dx$ 并从速率为 $v_0$ 的 $x = 0$ 处积分，得\n\n$$v^2 = v_0^2 - \\omega^2 x^2$$\n\n质点在 $v = 0$ 处停下并折返，即 $x = \\pm\\frac{v_0}{\\omega}$。所以振动的振幅为 $A = \\frac{v_0}{\\omega}$。对 $a = -49x$ 与 $v_0 = 14$，$\\omega = 7$，振幅为 $2$。\n\n> **注意。** $a = -\\omega^2 x$ 中的系数是 $\\omega^2$，所以要先开平方再用它去除 $v_0$；折返点是 $v^2 = 0$ 处，要解出 $x$ 而不是 $x^2$。",
      ),
      generate(rng: Rng): Problem {
        const w = rng.int(2, 6);
        const A = rng.int(1, 8);
        const v0 = w * A;
        const ask = rng.int(0, 1) === 0;
        const x1 = rng.int(0, A - 1);
        const ans = ask ? A : v0 * v0 - w * w * x1 * x1;
        return numberProblem({
          prompt: ask
            ? t(
                `A particle has acceleration $a = -${w * w}x$ and passes $x = 0$ with speed $${v0}$ m/s. How far from the origin does it get?`,
                `质点的加速度为 $a = -${w * w}x$，以 $${v0}$ m/s 的速率经过 $x = 0$。它离原点最远多少？`,
              )
            : t(
                `A particle has acceleration $a = -${w * w}x$ and passes $x = 0$ with speed $${v0}$ m/s. Find $v^2$ at $x = ${x1}$.`,
                `质点的加速度为 $a = -${w * w}x$，以 $${v0}$ m/s 的速率经过 $x = 0$。求 $x = ${x1}$ 处的 $v^2$。`,
              ),
          answer: ans,
          mistakes: distinct(
            ans,
            ask
              ? [
                  why(
                    Q.of(v0, w * w),
                    `That divides by $${w * w}$, which is $\\omega^2$; the amplitude is $\\frac{v_0}{\\omega}$ with $\\omega = ${w}$.`,
                    `那是除以了 $${w * w}$，它是 $\\omega^2$；振幅是 $\\frac{v_0}{\\omega}$，其中 $\\omega = ${w}$。`,
                  ),
                  why(v0, "That is the speed at the origin, not a distance.", "那是经过原点时的速率，不是距离。"),
                  why(
                    A * A,
                    "That is the value of $x^2$ at the turning point; take its square root.",
                    "那是折返点处 $x^2$ 的值；还要开平方。",
                  ),
                ]
              : [
                  why(
                    v0 * v0 + w * w * x1 * x1,
                    "That adds the $\\omega^2x^2$ term; the restoring acceleration slows the particle, so it is subtracted.",
                    "那是把 $\\omega^2x^2$ 项加上了；回复加速度使质点减速，所以要减去。",
                  ),
                  why(
                    v0 * v0 - w * x1 * x1,
                    `That uses $\\omega = ${w}$ in place of $\\omega^2 = ${w * w}$.`,
                    `那是用 $\\omega = ${w}$ 代替了 $\\omega^2 = ${w * w}$。`,
                  ),
                  why(
                    v0 - w * x1,
                    "That works with $v$ and $x$ instead of their squares; the integration gives $v^2 = v_0^2 - \\omega^2x^2$.",
                    "那是用 $v$ 与 $x$ 而不是它们的平方；积分给出 $v^2 = v_0^2 - \\omega^2x^2$。",
                  ),
                ],
          ),
          solution: walked(
            [
              [
                ["Integrate", "积分"],
                t(
                  `$v\\,dv = -${w * w}x\\,dx$ from $x = 0$ gives $v^2 = ${v0 * v0} - ${w * w}x^2$.`,
                  `从 $x = 0$ 积分 $v\\,dv = -${w * w}x\\,dx$，得 $v^2 = ${v0 * v0} - ${w * w}x^2$。`,
                ),
              ],
              ask
                ? [
                    ["Set v = 0", "令 v = 0"],
                    t(
                      `$x^2 = \\frac{${v0 * v0}}{${w * w}} = ${A * A}$, so the particle reaches $${A}$ m from the origin.`,
                      `$x^2 = \\frac{${v0 * v0}}{${w * w}} = ${A * A}$，所以质点最远离原点 $${A}$ m。`,
                    ),
                  ]
                : [
                    ["Evaluate", "代入"],
                    t(
                      `At $x = ${x1}$, $v^2 = ${v0 * v0} - ${w * w * x1 * x1} = ${ans}$.`,
                      `在 $x = ${x1}$ 处，$v^2 = ${v0 * v0} - ${w * w * x1 * x1} = ${ans}$。`,
                    ),
                  ],
            ],
            ask
              ? t(
                  `$\\frac{v_0}{\\omega} = \\frac{${v0}}{${w}} = ${A}$, the same amplitude.`,
                  `$\\frac{v_0}{\\omega} = \\frac{${v0}}{${w}} = ${A}$，振幅相同。`,
                )
              : t(
                  `The quantity $v^2 + ${w * w}x^2$ stays at $${v0 * v0}$: $${ans} + ${w * w * x1 * x1} = ${v0 * v0}$.`,
                  `量 $v^2 + ${w * w}x^2$ 保持为 $${v0 * v0}$：$${ans} + ${w * w * x1 * x1} = ${v0 * v0}$。`,
                ),
          ),
        });
      },
    },
  ],
};

/** theComponentsOfAcceleration decomposes acceleration along T and N. */
export const theComponentsOfAcceleration: TopicDef = {
  id: "the-components-of-acceleration",
  title: t("The Components of Acceleration", "加速度的切向与法向分量"),
  summary: t(
    "Acceleration splits into orthogonal tangential and normal components: $\\mathbf{a} = a_T\\mathbf{T} + a_N\\mathbf{N}$, where $a_T = v'$ and $a_N = \\kappa v^2$.",
    "加速度可正交分解为切向分量与法向分量：$\\mathbf{a} = a_T\\mathbf{T} + a_N\\mathbf{N}$，其中 $a_T = v'$，$a_N = \\kappa v^2$。",
  ),
  intro: t(
    "Find the tangential and normal components of acceleration for $\\mathbf{r}(t) = \\langle t, t^2 \\rangle$ at $t = 1$. There $\\mathbf{v} = \\langle 1, 2 \\rangle$ and $\\mathbf{a} = \\langle 0, 2 \\rangle$, so $a_T = \\frac{\\mathbf{v} \\cdot \\mathbf{a}}{\\|\\mathbf{v}\\|} = \\frac{4}{\\sqrt{5}}$ and $a_N = \\frac{\\|\\mathbf{v} \\times \\mathbf{a}\\|}{\\|\\mathbf{v}\\|} = \\frac{2}{\\sqrt{5}}$.\n\nCheck: $a_T^2 + a_N^2 = \\frac{16}{5} + \\frac{4}{5} = 4 = \\|\\mathbf{a}\\|^2$.\n\nIn this lesson we split acceleration into a part along the motion, which changes the speed, and a part across it, which turns the path.",
    "求 $\\mathbf{r}(t) = \\langle t, t^2 \\rangle$ 在 $t = 1$ 处加速度的切向与法向分量。此时 $\\mathbf{v} = \\langle 1, 2 \\rangle$，$\\mathbf{a} = \\langle 0, 2 \\rangle$，所以 $a_T = \\frac{\\mathbf{v} \\cdot \\mathbf{a}}{\\|\\mathbf{v}\\|} = \\frac{4}{\\sqrt{5}}$，$a_N = \\frac{\\|\\mathbf{v} \\times \\mathbf{a}\\|}{\\|\\mathbf{v}\\|} = \\frac{2}{\\sqrt{5}}$。\n\n检验：$a_T^2 + a_N^2 = \\frac{16}{5} + \\frac{4}{5} = 4 = \\|\\mathbf{a}\\|^2$。\n\n本课我们把加速度分成沿运动方向、改变速率的部分，和垂直于运动方向、使路径转弯的部分。",
  ),
  prerequisites: ["principal-normal-vectors", "differentiation-rules-for-vector-valued-functions"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "resolving-acceleration-into-tangential-and-normal-components",
      title: t("Resolving acceleration into tangential and normal components", "将加速度分解为切向与法向分量"),
      explanation: t(
        "For a helical trajectory $\\mathbf{r}(t) = \\langle R \\cos(k t), R \\sin(k t), c t \\rangle$, the velocity is $\\mathbf{v}(t) = \\langle -k R \\sin(k t), k R \\cos(k t), c \\rangle$ with constant speed $v = \\sqrt{k^2 R^2 + c^2}$. Since speed is constant, the tangential acceleration is $a_T = \\frac{dv}{dt} = 0$, and the normal acceleration is the full acceleration magnitude $a_N = \\|\\mathbf{a}(t)\\| = k^2 R$. For $\\langle 3\\cos t, 3\\sin t, 4t \\rangle$, $a_N = 3$.\n\n> **Watch out.** Differentiating twice brings out $k$ twice, so $a_N = k^2R$, not the speed $kR$ of the circular part; and the vertical rate $c$ plays no part, since the third component of $\\mathbf{a}$ is $0$.",
        "对于螺旋线轨迹 $\\mathbf{r}(t) = \\langle R \\cos(k t), R \\sin(k t), c t \\rangle$，速度为 $\\mathbf{v}(t) = \\langle -k R \\sin(k t), k R \\cos(k t), c \\rangle$，速率恒定为 $v = \\sqrt{k^2 R^2 + c^2}$。由于速率恒定，切向加速度 $a_T = \\frac{dv}{dt} = 0$，法向加速度大小等于总加速度大小 $a_N = \\|\\mathbf{a}(t)\\| = k^2 R$。对 $\\langle 3\\cos t, 3\\sin t, 4t \\rangle$，$a_N = 3$。\n\n> **注意。** 求两次导数会带出两个 $k$，所以 $a_N = k^2R$，而不是圆周部分的速率 $kR$；竖直方向的速率 $c$ 不起作用，因为 $\\mathbf{a}$ 的第三个分量为 $0$。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(2, 6);
        const R = rng.int(2, 10);
        const c = rng.int(1, 8);
        const aN = k * k * R;
        const kt = poly([k, "t"]);
        return numberProblem({
          prompt: t(
            `A particle traverses the helix $\\mathbf{r}(t) = \\langle ${R} \\cos(${kt}), ${R} \\sin(${kt}), ${poly([c, "t"])} \\rangle$. Find the magnitude of the normal component of acceleration $a_N$.`,
            `一质点沿螺旋线 $\\mathbf{r}(t) = \\langle ${R} \\cos(${kt}), ${R} \\sin(${kt}), ${poly([c, "t"])} \\rangle$ 运动。求加速度法向分量的模长 $a_N$。`,
          ),
          answer: aN,
          mistakes: distinct(aN, [
            why(
              k * R,
              "That is the speed of the circular part; differentiating once more brings out another factor $k$.",
              "那是圆周部分的速率；再求一次导数还会带出一个因子 $k$。",
            ),
            why(
              2 * k * R,
              `That doubles $kR$; the acceleration has size $k^2R = ${aN}$.`,
              `那是把 $kR$ 加倍了；加速度的大小是 $k^2R = ${aN}$。`,
            ),
            why(
              k * R * R,
              `That squares the radius instead of $k$; $\\|\\mathbf{a}\\| = ${k}^2 \\cdot ${R}$.`,
              `那是把半径而不是 $k$ 平方了；$\\|\\mathbf{a}\\| = ${k}^2 \\cdot ${R}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Differentiate once", "求一次导数"],
                t(
                  `$\\mathbf{v} = \\langle -${k * R}\\sin(${kt}), ${k * R}\\cos(${kt}), ${c} \\rangle$, whose length $\\sqrt{${k * k * R * R} + ${c * c}}$ is constant, so $a_T = 0$.`,
                  `$\\mathbf{v} = \\langle -${k * R}\\sin(${kt}), ${k * R}\\cos(${kt}), ${c} \\rangle$，其长度 $\\sqrt{${k * k * R * R} + ${c * c}}$ 为常数，所以 $a_T = 0$。`,
                ),
              ],
              [
                ["Differentiate again", "再求一次导数"],
                t(
                  `$\\mathbf{a} = \\langle -${aN}\\cos(${kt}), -${aN}\\sin(${kt}), 0 \\rangle$.`,
                  `$\\mathbf{a} = \\langle -${aN}\\cos(${kt}), -${aN}\\sin(${kt}), 0 \\rangle$。`,
                ),
              ],
              [
                ["Take the length", "求长度"],
                t(`Since $a_T = 0$, $a_N = \\|\\mathbf{a}\\| = ${aN}$.`, `由于 $a_T = 0$，$a_N = \\|\\mathbf{a}\\| = ${aN}$。`),
              ],
            ],
            t(
              `$\\mathbf{v} \\cdot \\mathbf{a} = ${k * R * aN}\\sin(${kt})\\cos(${kt}) - ${k * R * aN}\\cos(${kt})\\sin(${kt}) + 0 = 0$, so all of $\\mathbf{a}$ is normal to the motion.`,
              `$\\mathbf{v} \\cdot \\mathbf{a} = ${k * R * aN}\\sin(${kt})\\cos(${kt}) - ${k * R * aN}\\cos(${kt})\\sin(${kt}) + 0 = 0$，所以 $\\mathbf{a}$ 全部垂直于运动方向。`,
            ),
          ),
        });
      },
    },
    {
      id: "tangential-acceleration-from-velocity-and-acceleration-vectors",
      title: t("Tangential acceleration from $\\mathbf{v}$ and $\\mathbf{a}$", "由 $\\mathbf{v}$ 与 $\\mathbf{a}$ 求切向加速度"),
      explanation: t(
        "At any instant the acceleration splits as $\\mathbf{a} = a_T\\mathbf{T} + a_N\\mathbf{N}$. The tangential part is the projection of $\\mathbf{a}$ onto the direction of motion,\n\n$$a_T = \\frac{\\mathbf{v} \\cdot \\mathbf{a}}{\\|\\mathbf{v}\\|},$$\n\nand it equals the rate of change of speed. A positive $a_T$ means the particle is speeding up, a negative one that it is slowing down. The normal part then follows from $a_N = \\sqrt{\\|\\mathbf{a}\\|^2 - a_T^2}$. For $\\mathbf{v} = \\langle 0, 3, 4 \\rangle$ and $\\mathbf{a} = \\langle 1, 2, 2 \\rangle$, $a_T = \\frac{14}{5}$.\n\n> **Watch out.** Divide by $\\|\\mathbf{v}\\|$ once, not by $\\|\\mathbf{v}\\|^2$, which gives the multiple of $\\mathbf{v}$ instead of a length; and keep the sign of the dot product.",
        "任一时刻加速度都可分解为 $\\mathbf{a} = a_T\\mathbf{T} + a_N\\mathbf{N}$。切向部分是 $\\mathbf{a}$ 在运动方向上的投影，\n\n$$a_T = \\frac{\\mathbf{v} \\cdot \\mathbf{a}}{\\|\\mathbf{v}\\|},$$\n\n它等于速率的变化率。$a_T$ 为正表示质点在加速，为负表示在减速。法向部分随后由 $a_N = \\sqrt{\\|\\mathbf{a}\\|^2 - a_T^2}$ 求出。对 $\\mathbf{v} = \\langle 0, 3, 4 \\rangle$ 与 $\\mathbf{a} = \\langle 1, 2, 2 \\rangle$，$a_T = \\frac{14}{5}$。\n\n> **注意。** 只除以一次 $\\|\\mathbf{v}\\|$，而不是 $\\|\\mathbf{v}\\|^2$，后者给出的是 $\\mathbf{v}$ 的倍数而不是长度；点积的符号要保留。",
      ),
      generate(rng: Rng): Problem {
        const triples: [number[], number][] = [
          [[1, 2, 2], 3],
          [[2, 3, 6], 7],
          [[1, 4, 8], 9],
          [[4, 4, 7], 9],
        ];
        const [p, n] = rng.pick(triples);
        const v = rng.shuffle(p.map((x) => (rng.int(0, 1) === 0 ? x : -x)));
        const a = [rng.int(-4, 4), rng.int(-4, 4), rng.nonZero(-4, 4)];
        const dot = v.reduce((s, x, i) => s + x * a[i]!, 0);
        const ans = Q.of(dot, n);
        const aSq = a.reduce((s, x) => s + x * x, 0);
        const products = v.map((x, i) => `(${x})(${a[i]})`).join(" + ");
        return numberProblem({
          prompt: t(
            `At some instant a particle has velocity $\\mathbf{v} = \\langle ${v.join(", ")} \\rangle$ and acceleration $\\mathbf{a} = \\langle ${a.join(", ")} \\rangle$. Find the tangential component $a_T$.`,
            `某一时刻质点的速度为 $\\mathbf{v} = \\langle ${v.join(", ")} \\rangle$，加速度为 $\\mathbf{a} = \\langle ${a.join(", ")} \\rangle$。求切向分量 $a_T$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(dot),
              `That is the dot product alone; it must be divided by $\\|\\mathbf{v}\\| = ${n}$.`,
              `那只是点积；还要除以 $\\|\\mathbf{v}\\| = ${n}$。`,
            ),
            why(
              Q.of(dot, n * n),
              `That divides by $\\|\\mathbf{v}\\|^2 = ${n * n}$; the projection onto the unit tangent divides by $\\|\\mathbf{v}\\|$ once.`,
              `那是除以了 $\\|\\mathbf{v}\\|^2 = ${n * n}$；投影到单位切向量上只除一次 $\\|\\mathbf{v}\\|$。`,
            ),
            why(
              ans.neg(),
              "That has the wrong sign; $a_T$ has the sign of $\\mathbf{v} \\cdot \\mathbf{a}$.",
              "那是符号错了；$a_T$ 与 $\\mathbf{v} \\cdot \\mathbf{a}$ 同号。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Dot the vectors", "作点积"],
                t(`$\\mathbf{v} \\cdot \\mathbf{a} = ${products} = ${dot}$.`, `$\\mathbf{v} \\cdot \\mathbf{a} = ${products} = ${dot}$。`),
              ],
              [
                ["Find the speed", "求速率"],
                t(
                  `$\\|\\mathbf{v}\\| = \\sqrt{${p[0]! ** 2} + ${p[1]! ** 2} + ${p[2]! ** 2}} = ${n}$.`,
                  `$\\|\\mathbf{v}\\| = \\sqrt{${p[0]! ** 2} + ${p[1]! ** 2} + ${p[2]! ** 2}} = ${n}$。`,
                ),
              ],
              [
                ["Divide", "相除"],
                t(`$a_T = \\frac{${dot}}{${n}} = ${ans.toLatex()}$.`, `$a_T = \\frac{${dot}}{${n}} = ${ans.toLatex()}$。`),
              ],
            ],
            t(
              `$a_T^2 = ${Q.of(dot * dot, n * n).toLatex()}$ is at most $\\|\\mathbf{a}\\|^2 = ${aSq}$, leaving $a_N^2 = ${Q.of(aSq * n * n - dot * dot, n * n).toLatex()} \\ge 0$, as it must.`,
              `$a_T^2 = ${Q.of(dot * dot, n * n).toLatex()}$ 不超过 $\\|\\mathbf{a}\\|^2 = ${aSq}$，剩下 $a_N^2 = ${Q.of(aSq * n * n - dot * dot, n * n).toLatex()} \\ge 0$，理应如此。`,
            ),
          ),
        });
      },
    },
  ],
};

/** theWorkEnergyPrinciple equates work done along a path to kinetic energy change. */
export const theWorkEnergyPrinciple: TopicDef = {
  id: "the-work-energy-principle",
  title: t("The Work-Energy Principle", "动能定理与做功"),
  summary: t(
    "The line integral of the net force along a path equals the total work done and the change in kinetic energy: $W = \\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\Delta K$.",
    "合外力沿路径的线积分等于所做的总功，也等于动能的变化量：$W = \\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\Delta K$。",
  ),
  intro: t(
    "A $4$ kg object starts from rest and reaches $5$ m/s. How much net work was done on it? By the work-energy principle $W = \\frac{1}{2}mv_2^2 - \\frac{1}{2}mv_1^2 = \\frac{1}{2} \\cdot 4 \\cdot 25 - 0 = 50$ J, whatever path it took.\n\nCheck: running it backwards, $v_2 = \\sqrt{\\frac{2W}{m}} = \\sqrt{\\frac{100}{4}} = 5$ m/s.\n\nIn this lesson we use $W = \\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\Delta K$ to pass between the work done and the change in speed.",
    "一个 $4$ kg 的物体从静止加速到 $5$ m/s。对它做了多少净功？由动能定理 $W = \\frac{1}{2}mv_2^2 - \\frac{1}{2}mv_1^2 = \\frac{1}{2} \\cdot 4 \\cdot 25 - 0 = 50$ J，与路径无关。\n\n检验：反过来，$v_2 = \\sqrt{\\frac{2W}{m}} = \\sqrt{\\frac{100}{4}} = 5$ m/s。\n\n本课我们用 $W = \\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\Delta K$ 在所做的功与速率变化之间相互换算。",
  ),
  prerequisites: ["interpreting-line-integrals-of-vector-valued-functions"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "computing-work-and-kinetic-energy-changes",
      title: t("Computing work and kinetic energy changes", "计算合外力做功与动能变化"),
      explanation: t(
        "The work done by the net force along a path equals the change in kinetic energy, so you can find one from the other. The work-energy theorem states $W = \\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\frac{1}{2}m v_2^2 - \\frac{1}{2}m v_1^2$. For an even mass $m = 2k$, $W = k(v_2^2 - v_1^2)$. For $m = 10$ kg going from $1$ to $3$ m/s, $W = 5(9 - 1) = 40$ J.\n\n> **Watch out.** Square each speed before subtracting: $v_2^2 - v_1^2$ is not $(v_2 - v_1)^2$; and kinetic energy has the factor $\\frac{1}{2}$.",
        "合力沿路径所做的功等于动能的变化，所以可以由其中一个求出另一个。动能定理指出 $W = \\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\frac{1}{2}m v_2^2 - \\frac{1}{2}m v_1^2$。对于偶数质量 $m = 2k$，做功为 $W = k(v_2^2 - v_1^2)$。对 $m = 10$ kg 从 $1$ m/s 到 $3$ m/s，$W = 5(9 - 1) = 40$ J。\n\n> **注意。** 先把每个速率平方再相减：$v_2^2 - v_1^2$ 不等于 $(v_2 - v_1)^2$；动能带有因子 $\\frac{1}{2}$。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(1, 4);
        const m = 2 * k; // ensure integer work
        const v1 = rng.int(1, 5);
        const v2 = rng.int(v1 + 1, v1 + 6);
        const work = k * (v2 * v2 - v1 * v1);
        return numberProblem({
          prompt: t(
            `A particle of mass $m = ${m}$ kg accelerates along a curved path from an initial speed $v_1 = ${v1}$ m/s to a final speed $v_2 = ${v2}$ m/s under net force $\\mathbf{F}$. Calculate the total work $W = \\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ done on the particle (in Joules).`,
            `一质量为 $m = ${m}$ kg 的质点在合外力 $\\mathbf{F}$ 作用下沿曲线路径加速，速率从初速度 $v_1 = ${v1}$ m/s 增加到末速度 $v_2 = ${v2}$ m/s。求合外力对质点所做的总功 $W = \\int_C \\mathbf{F} \\cdot d\\mathbf{r}$（单位：焦耳 J）。`,
          ),
          answer: work,
          mistakes: distinct(work, [
            why(
              k * (v2 - v1) ** 2,
              "That squares the change in speed; the kinetic energies are squared separately and then subtracted.",
              "那是把速率的变化量平方了；应分别求出动能再相减。",
            ),
            why(
              2 * work,
              "That leaves out the $\\frac{1}{2}$ in the kinetic energy $\\frac{1}{2}mv^2$.",
              "那是漏了动能 $\\frac{1}{2}mv^2$ 中的 $\\frac{1}{2}$。",
            ),
            why(
              k * v2 * v2,
              "That is the final kinetic energy; the particle already had some at the start, which must be subtracted.",
              "那是末动能；质点开始时已有动能，要减去。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Initial kinetic energy", "初动能"],
                t(
                  `$K_1 = \\frac{1}{2} \\cdot ${m} \\cdot ${v1}^2 = ${k * v1 * v1}$ J.`,
                  `$K_1 = \\frac{1}{2} \\cdot ${m} \\cdot ${v1}^2 = ${k * v1 * v1}$ J。`,
                ),
              ],
              [
                ["Final kinetic energy", "末动能"],
                t(
                  `$K_2 = \\frac{1}{2} \\cdot ${m} \\cdot ${v2}^2 = ${k * v2 * v2}$ J.`,
                  `$K_2 = \\frac{1}{2} \\cdot ${m} \\cdot ${v2}^2 = ${k * v2 * v2}$ J。`,
                ),
              ],
              [
                ["Subtract", "相减"],
                t(`$W = ${k * v2 * v2} - ${k * v1 * v1} = ${work}$ J.`, `$W = ${k * v2 * v2} - ${k * v1 * v1} = ${work}$ J。`),
              ],
            ],
            t(
              `Factoring, $v_2^2 - v_1^2 = (${v2} - ${v1})(${v2} + ${v1}) = ${v2 * v2 - v1 * v1}$, and half the mass, $${k}$, times that is $${work}$.`,
              `因式分解得 $v_2^2 - v_1^2 = (${v2} - ${v1})(${v2} + ${v1}) = ${v2 * v2 - v1 * v1}$，质量的一半 $${k}$ 乘以它得 $${work}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "final-speed-from-the-work-done",
      title: t("Final speed from the work done", "由所做的功求末速率"),
      explanation: t(
        "The work–energy principle $W = \\frac{1}{2}mv_2^2 - \\frac{1}{2}mv_1^2$ can be run backwards: if the net work done on the object is known, then\n\n$$v_2 = \\sqrt{v_1^2 + \\frac{2W}{m}}.$$\n\nPositive work raises the speed and negative work lowers it. Only the total work matters, not the shape of the path or how the force varied along it. For $m = 20$ kg, $v_1 = 2$ m/s and $W = 50$ J, $v_2 = \\sqrt{4 + 5} = 3$ m/s.\n\n> **Watch out.** The work changes $v^2$, not $v$: add $\\frac{2W}{m}$ to $v_1^2$ and then take the square root.",
        "功能原理 $W = \\frac{1}{2}mv_2^2 - \\frac{1}{2}mv_1^2$ 可以反过来用：若已知对物体所做的净功，则\n\n$$v_2 = \\sqrt{v_1^2 + \\frac{2W}{m}}$$\n\n正功使速率增大，负功使速率减小。只有总功有关，与路径形状或力沿路径如何变化无关。对 $m = 20$ kg、$v_1 = 2$ m/s、$W = 50$ J，$v_2 = \\sqrt{4 + 5} = 3$ m/s。\n\n> **注意。** 功改变的是 $v^2$ 而不是 $v$：把 $\\frac{2W}{m}$ 加到 $v_1^2$ 上，再开平方。",
      ),
      generate(rng: Rng): Problem {
        const m = 2 * rng.int(1, 5);
        const v1 = rng.int(1, 9);
        let v2 = rng.int(1, 12);
        if (v2 === v1) v2 += 1;
        const W = (m * (v2 * v2 - v1 * v1)) / 2;
        const d = v2 * v2 - v1 * v1;
        return numberProblem({
          prompt: t(
            `An object of mass $${m}$ kg moving at $${v1}$ m/s has $${W}$ J of net work done on it. Find its final speed in m/s.`,
            `质量为 $${m}$ kg、速率为 $${v1}$ m/s 的物体受到 $${W}$ J 的净功。求它的末速率（m/s）。`,
          ),
          answer: v2,
          mistakes: distinct(v2, [
            why(
              v1 + d,
              "That adds $\\frac{2W}{m}$ to the speed; it adds to the square of the speed.",
              "那是把 $\\frac{2W}{m}$ 加到速率上；它应加到速率的平方上。",
            ),
            why(v2 * v2, "That is $v_2^2$; take its square root.", "那是 $v_2^2$；还要开平方。"),
            why(
              d,
              "That is $\\frac{2W}{m}$ alone; it must be added to $v_1^2$ before taking the root.",
              "那只是 $\\frac{2W}{m}$；要先加上 $v_1^2$ 再开平方。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find v₂²", "求 v₂²"],
                t(
                  `$v_2^2 = v_1^2 + \\frac{2W}{m} = ${v1 * v1} + \\frac{${2 * W}}{${m}} = ${v1 * v1} + ${paren(d)} = ${v2 * v2}$.`,
                  `$v_2^2 = v_1^2 + \\frac{2W}{m} = ${v1 * v1} + \\frac{${2 * W}}{${m}} = ${v1 * v1} + ${paren(d)} = ${v2 * v2}$。`,
                ),
              ],
              [["Take the root", "开平方"], t(`$v_2 = ${v2}$ m/s.`, `$v_2 = ${v2}$ m/s。`)],
            ],
            t(
              `The kinetic energy goes from $${(m / 2) * v1 * v1}$ J to $${(m / 2) * v2 * v2}$ J, and $${(m / 2) * v2 * v2} - ${(m / 2) * v1 * v1} = ${W}$ J.`,
              `动能从 $${(m / 2) * v1 * v1}$ J 变为 $${(m / 2) * v2 * v2}$ J，而 $${(m / 2) * v2 * v2} - ${(m / 2) * v1 * v1} = ${W}$ J。`,
            ),
          ),
        });
      },
    },
  ],
};

/** circularMotionAboutTheOrigin analyzes centripetal acceleration in circular paths. */
export const circularMotionAboutTheOrigin: TopicDef = {
  id: "circular-motion-about-the-origin",
  title: t("Circular Motion About the Origin", "绕原点的圆周运动"),
  summary: t(
    "In circular motion with radius $R$ and constant angular speed $\\omega$, the centripetal acceleration points toward the center and has magnitude $a_c = \\omega^2 R$.",
    "在半径为 $R$、角速度 $\\omega$ 恒定的圆周运动中，向心加速度指向圆心，大小为 $a_c = \\omega^2 R$。",
  ),
  intro: t(
    "Find the acceleration of $\\mathbf{r}(t) = \\langle 5\\cos 2t, 5\\sin 2t \\rangle$. Differentiating twice gives $\\mathbf{a} = \\langle -20\\cos 2t, -20\\sin 2t \\rangle = -4\\mathbf{r}$, which points to the center and has size $20$.\n\nCheck: the speed is $\\omega R = 10$, and $\\frac{v^2}{R} = \\frac{100}{5} = 20$.\n\nIn this lesson we find the centripetal acceleration and force of uniform circular motion from its radius, angular speed or period.",
    "求 $\\mathbf{r}(t) = \\langle 5\\cos 2t, 5\\sin 2t \\rangle$ 的加速度。求两次导数得 $\\mathbf{a} = \\langle -20\\cos 2t, -20\\sin 2t \\rangle = -4\\mathbf{r}$，它指向圆心，大小为 $20$。\n\n检验：速率为 $\\omega R = 10$，而 $\\frac{v^2}{R} = \\frac{100}{5} = 20$。\n\n本课我们由半径、角速度或周期求匀速圆周运动的向心加速度与向心力。",
  ),
  prerequisites: ["the-components-of-acceleration"],
  encompasses: [{ topic: "the-components-of-acceleration", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "centripetal-acceleration-and-speed-in-circular-motion",
      title: t("Centripetal acceleration and speed in circular motion", "圆周运动中的向心加速度与速率计算"),
      explanation: t(
        "For $\\mathbf{r}(t) = \\langle R \\cos(\\omega t), R \\sin(\\omega t) \\rangle$, the acceleration is $\\mathbf{a}(t) = -\\omega^2 \\mathbf{r}(t)$, which has magnitude $a_c = \\omega^2 R$. The centripetal force required to keep mass $m$ in orbit is $F_c = m \\omega^2 R$. For $m = 7$ kg, $R = 1$ m and $\\omega = 3$ rad/s, $F_c = 63$ N.\n\n> **Watch out.** The angular speed is squared, the radius is not; and the force is the mass times the acceleration, so do not leave out $m$.",
        "对于 $\\mathbf{r}(t) = \\langle R \\cos(\\omega t), R \\sin(\\omega t) \\rangle$，加速度为 $\\mathbf{a}(t) = -\\omega^2 \\mathbf{r}(t)$，大小为向心加速度 $a_c = \\omega^2 R$。维持质量为 $m$ 的物体做圆周运动所需的向心力为 $F_c = m \\omega^2 R$。对 $m = 7$ kg、$R = 1$ m、$\\omega = 3$ rad/s，$F_c = 63$ N。\n\n> **注意。** 角速度要平方，半径不要平方；力是质量乘以加速度，不要漏掉 $m$。",
      ),
      generate(rng: Rng): Problem {
        const m = rng.int(1, 6);
        const R = rng.int(2, 10);
        const w = rng.int(2, 7);
        const ac = w * w * R;
        const Fc = m * ac;
        return numberProblem({
          prompt: t(
            `A particle of mass $m = ${m}$ kg moves in a horizontal circle of radius $R = ${R}$ m at a constant angular speed $\\omega = ${w}$ rad/s. Calculate the magnitude of the centripetal force $F_c$ acting on the particle (in Newtons).`,
            `一质量为 $m = ${m}$ kg 的质点在水平面内做半径为 $R = ${R}$ m 的匀速圆周运动，角速度为 $\\omega = ${w}$ rad/s。计算作用在质点上的向心力大小 $F_c$（单位：牛顿 N）。`,
          ),
          answer: Fc,
          mistakes: distinct(Fc, [
            why(
              m * w * R,
              "That uses $\\omega$ instead of $\\omega^2$; the acceleration is $\\omega^2R$.",
              "那是用 $\\omega$ 代替了 $\\omega^2$；加速度是 $\\omega^2R$。",
            ),
            why(ac, "That is the acceleration; the force is the mass times it.", "那是加速度；力是质量乘以它。"),
            why(
              m * w * w * R * R,
              "That squares the radius as well; only $\\omega$ is squared.",
              "那是把半径也平方了；只有 $\\omega$ 要平方。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the acceleration", "求加速度"],
                t(`$a_c = \\omega^2R = ${w}^2 \\cdot ${R} = ${ac}$ m/s².`, `$a_c = \\omega^2R = ${w}^2 \\cdot ${R} = ${ac}$ m/s²。`),
              ],
              [["Multiply by the mass", "乘以质量"], t(`$F_c = ma_c = ${Fc}$ N.`, `$F_c = ma_c = ${Fc}$ N。`)],
            ],
            t(
              `The speed is $v = \\omega R = ${w * R}$ m/s, and $\\frac{mv^2}{R} = \\frac{${m * w * w * R * R}}{${R}} = ${Fc}$ N.`,
              `速率为 $v = \\omega R = ${w * R}$ m/s，而 $\\frac{mv^2}{R} = \\frac{${m * w * w * R * R}}{${R}} = ${Fc}$ N。`,
            ),
          ),
        });
      },
    },
    {
      id: "centripetal-acceleration-from-the-period",
      title: t("Centripetal acceleration from the period", "由周期求向心加速度"),
      explanation: t(
        "For uniform motion $\\mathbf{r}(t) = R\\langle \\cos \\omega t, \\sin \\omega t \\rangle$, differentiating twice gives $\\mathbf{a} = -\\omega^2\\mathbf{r}$, which points to the center with size $\\omega^2R$. One revolution takes the period $T = \\frac{2\\pi}{\\omega}$, so\n\n$$\\|\\mathbf{a}\\| = \\omega^2 R = \\frac{4\\pi^2 R}{T^2}.$$\n\nHalving the period quadruples the acceleration, while doubling the radius only doubles it. For $R = 13$ m and $T = 2$ s, $\\|\\mathbf{a}\\| = \\frac{4\\pi^2 \\cdot 13}{4} = 13\\pi^2$ m/s².\n\n> **Watch out.** The period is squared, and so is the $2\\pi$ in $\\omega = \\frac{2\\pi}{T}$, which gives $4\\pi^2$; $\\frac{2\\pi R}{T}$ is the speed, not the acceleration.",
        "对匀速圆周运动 $\\mathbf{r}(t) = R\\langle \\cos \\omega t, \\sin \\omega t \\rangle$，求两次导数得 $\\mathbf{a} = -\\omega^2\\mathbf{r}$，它指向圆心，大小为 $\\omega^2R$。转一圈用时为周期 $T = \\frac{2\\pi}{\\omega}$，所以\n\n$$\\|\\mathbf{a}\\| = \\omega^2 R = \\frac{4\\pi^2 R}{T^2}$$\n\n周期减半使加速度变为四倍，而半径加倍只使它加倍。对 $R = 13$ m、$T = 2$ s，$\\|\\mathbf{a}\\| = \\frac{4\\pi^2 \\cdot 13}{4} = 13\\pi^2$ m/s²。\n\n> **注意。** 周期要平方，$\\omega = \\frac{2\\pi}{T}$ 中的 $2\\pi$ 也要平方，得到 $4\\pi^2$；$\\frac{2\\pi R}{T}$ 是速率，不是加速度。",
      ),
      generate(rng: Rng): Problem {
        const R = rng.int(1, 12);
        const T = rng.int(1, 6);
        const k = Q.of(4 * R, T * T);
        const omega = T === 1 ? "2\\pi" : `\\frac{2\\pi}{${T}}`;
        const accel = T === 1 ? `${4 * R}\\pi^2` : `\\frac{${4 * R}\\pi^2}{${T * T}}`;
        return numberProblem({
          prompt: t(
            `A particle moves uniformly around a circle of radius $${R}$ m, completing one revolution every $${T}$ s. Its centripetal acceleration is $k\\pi^2$ m/s². Find $k$.`,
            `质点沿半径 $${R}$ m 的圆匀速运动，每 $${T}$ s 转一圈。它的向心加速度为 $k\\pi^2$ m/s²。求 $k$。`,
          ),
          answer: k,
          mistakes: distinct(k, [
            why(
              Q.of(2 * R, T),
              "That is the speed $\\frac{2\\pi R}{T}$ divided by $\\pi$; the acceleration is $\\omega^2R$.",
              "那是速率 $\\frac{2\\pi R}{T}$ 除以 $\\pi$；加速度是 $\\omega^2R$。",
            ),
            why(
              Q.of(4 * R, T),
              "That leaves the period unsquared; $\\omega^2 = \\frac{4\\pi^2}{T^2}$.",
              "那是没有把周期平方；$\\omega^2 = \\frac{4\\pi^2}{T^2}$。",
            ),
            why(Q.of(R, T * T), "That loses the $4$ from squaring $2\\pi$.", "那是漏了 $2\\pi$ 平方得到的 $4$。"),
          ]),
          solution: walked(
            [
              [
                ["Find the angular speed", "求角速度"],
                t(`$\\omega = \\frac{2\\pi}{T} = ${omega}$ rad/s.`, `$\\omega = \\frac{2\\pi}{T} = ${omega}$ rad/s。`),
              ],
              [
                ["Find the acceleration", "求加速度"],
                t(
                  `$\\|\\mathbf{a}\\| = \\omega^2R = ${accel} = ${withPi(k, "\\pi^2")}$, so $k = ${k.toLatex()}$.`,
                  `$\\|\\mathbf{a}\\| = \\omega^2R = ${accel} = ${withPi(k, "\\pi^2")}$，所以 $k = ${k.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The speed is $v = \\frac{2\\pi R}{T} = ${withPi(Q.of(2 * R, T))}$ m/s, and $\\frac{v^2}{R} = ${withPi(k, "\\pi^2")}$, the same.`,
              `速率为 $v = \\frac{2\\pi R}{T} = ${withPi(Q.of(2 * R, T))}$ m/s，而 $\\frac{v^2}{R} = ${withPi(k, "\\pi^2")}$，结果相同。`,
            ),
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 6.28 Applications of Multiple Integrals
// ---------------------------------------------------------------------------

/** theAverageValueOfAMultivariableFunction computes f_avg = (1/Area) ∬ f dA. */
export const theAverageValueOfAMultivariableFunction: TopicDef = {
  id: "the-average-value-of-a-multivariable-function",
  title: t("The Average Value of a Multivariable Function", "多元函数的平均值"),
  summary: t(
    "The average value of a continuous function $f(x, y)$ over a plane region $D$ is $f_{\\text{avg}} = \\frac{1}{\\operatorname{Area}(D)} \\iint_D f(x, y)\\,dA$.",
    "连续函数 $f(x, y)$ 在平面区域 $D$ 上的平均值为 $f_{\\text{avg}} = \\frac{1}{\\operatorname{Area}(D)} \\iint_D f(x, y)\\,dA$。",
  ),
  intro: t(
    "Find the average of $f(x, y) = xy$ over the rectangle $[0, 2] \\times [0, 3]$. The integral is $\\int_0^2 x\\,dx \\cdot \\int_0^3 y\\,dy = 2 \\cdot \\frac{9}{2} = 9$, and the area is $6$, so the average is $\\frac{9}{6} = \\frac{3}{2}$.\n\nCheck: on a rectangle $x$ and $y$ vary separately, so the average of $xy$ is the average of $x$, which is $1$, times the average of $y$, which is $\\frac{3}{2}$.\n\nIn this lesson we find the average value of a function of two variables over rectangles and disks by dividing its double integral by the area.",
    "求 $f(x, y) = xy$ 在矩形 $[0, 2] \\times [0, 3]$ 上的平均值。积分为 $\\int_0^2 x\\,dx \\cdot \\int_0^3 y\\,dy = 2 \\cdot \\frac{9}{2} = 9$，面积为 $6$，所以平均值为 $\\frac{9}{6} = \\frac{3}{2}$。\n\n检验：在矩形上 $x$ 与 $y$ 各自独立变化，所以 $xy$ 的平均值等于 $x$ 的平均值 $1$ 乘以 $y$ 的平均值 $\\frac{3}{2}$。\n\n本课我们把二重积分除以面积，求二元函数在矩形和圆盘上的平均值。",
  ),
  prerequisites: ["double-integrals-over-rectangular-domains"],
  encompasses: [{ topic: "double-integrals-over-rectangular-domains", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "calculating-average-values-over-planar-domains",
      figure: multivariableDrawings8["the-average-value-of-a-multivariable-function#calculating-average-values-over-planar-domains"],
      title: t("Calculating average values over planar domains", "计算平面区域上多元函数的平均值"),
      explanation: t(
        "The average value of a function over a region is its integral over the region divided by the area of the region. For $f(x, y) = 3x + 5y$ on $[0, 3] \\times [0, 5]$, the integral is $3 \\cdot \\frac{9}{2} \\cdot 5 + 5 \\cdot 3 \\cdot \\frac{25}{2} = \\frac{135}{2} + \\frac{375}{2} = 255$, and the area is $15$, so the average is $\\frac{255}{15} = 17$. A linear function averages to its value at the center of the rectangle: $f\\left(\\frac{3}{2}, \\frac{5}{2}\\right) = \\frac{9}{2} + \\frac{25}{2} = 17$.\n\n> **Watch out.** The average of $x$ over $[0, W]$ is $\\frac{W}{2}$, not $W$; and the integral is not yet the average until it is divided by the area.",
        "函数在区域上的平均值等于它在该区域上的积分除以区域的面积。对 $[0, 3] \\times [0, 5]$ 上的 $f(x, y) = 3x + 5y$，积分为 $3 \\cdot \\frac{9}{2} \\cdot 5 + 5 \\cdot 3 \\cdot \\frac{25}{2} = \\frac{135}{2} + \\frac{375}{2} = 255$，面积为 $15$，所以平均值为 $\\frac{255}{15} = 17$。线性函数的平均值等于它在矩形中心的值：$f\\left(\\frac{3}{2}, \\frac{5}{2}\\right) = \\frac{9}{2} + \\frac{25}{2} = 17$。\n\n> **注意。** $x$ 在 $[0, W]$ 上的平均值是 $\\frac{W}{2}$ 而不是 $W$；积分还要除以面积才是平均值。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 8);
        const b = rng.int(2, 8);
        const halfW = rng.int(1, 6);
        const halfH = rng.int(1, 6);
        const W = 2 * halfW;
        const H = 2 * halfH;
        const ans = a * halfW + b * halfH;
        const area = W * H;
        const xPart = a * halfW * area;
        const yPart = b * halfH * area;
        return numberProblem({
          prompt: t(
            `Find the average value $f_{\\text{avg}}$ of $f(x, y) = ${a}x + ${b}y$ over the rectangle $D = [0, ${W}] \\times [0, ${H}]$.`,
            `求函数 $f(x, y) = ${a}x + ${b}y$ 在矩形区域 $D = [0, ${W}] \\times [0, ${H}]$ 上的平均值 $f_{\\text{avg}}$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              a * W + b * H,
              "That uses the far edges $W$ and $H$; the average of $x$ over $[0, W]$ is $\\frac{W}{2}$.",
              "那是用了远端的边长 $W$ 与 $H$；$x$ 在 $[0, W]$ 上的平均值是 $\\frac{W}{2}$。",
            ),
            why(
              xPart + yPart,
              "That is the double integral; divide it by the area to get the average.",
              "那是二重积分；还要除以面积才是平均值。",
            ),
            why(
              a * halfW + b * H,
              "That halves only the $x$-term; the average of $y$ over $[0, H]$ is $\\frac{H}{2}$ as well.",
              "那是只把 $x$ 项减半了；$y$ 在 $[0, H]$ 上的平均值同样是 $\\frac{H}{2}$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the area", "求面积"],
                t(`$\\operatorname{Area}(D) = ${W} \\cdot ${H} = ${area}$.`, `$\\operatorname{Area}(D) = ${W} \\cdot ${H} = ${area}$。`),
              ],
              [
                ["Integrate", "求积分"],
                t(
                  `$\\iint_D (${a}x + ${b}y)\\,dA = ${a} \\cdot \\frac{${W * W}}{2} \\cdot ${H} + ${b} \\cdot ${W} \\cdot \\frac{${H * H}}{2} = ${xPart} + ${yPart} = ${xPart + yPart}$.`,
                  `$\\iint_D (${a}x + ${b}y)\\,dA = ${a} \\cdot \\frac{${W * W}}{2} \\cdot ${H} + ${b} \\cdot ${W} \\cdot \\frac{${H * H}}{2} = ${xPart} + ${yPart} = ${xPart + yPart}$。`,
                ),
              ],
              [
                ["Divide by the area", "除以面积"],
                t(
                  `$f_{\\text{avg}} = \\frac{${xPart + yPart}}{${area}} = ${ans}$.`,
                  `$f_{\\text{avg}} = \\frac{${xPart + yPart}}{${area}} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `A linear function averages to its value at the center $(${halfW}, ${halfH})$: $${a} \\cdot ${halfW} + ${b} \\cdot ${halfH} = ${ans}$.`,
              `线性函数的平均值等于它在中心 $(${halfW}, ${halfH})$ 处的值：$${a} \\cdot ${halfW} + ${b} \\cdot ${halfH} = ${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "average-value-over-a-disk",
      title: t("The average value over a disk", "圆盘上的平均值"),
      explanation: t(
        "The average of $f$ over a region $D$ is $\\frac{1}{\\operatorname{Area}(D)}\\iint_D f\\,dA$. On a disk of radius $R$ polar coordinates make radial functions easy: $\\iint_D (x^2 + y^2)\\,dA = \\int_0^{2\\pi}\\int_0^R r^2 \\cdot r\\,dr\\,d\\theta = \\frac{\\pi R^4}{2}$, and dividing by $\\pi R^2$ gives an average of $\\frac{R^2}{2}$. A constant added to $f$ is added to its average. On the disk $x^2 + y^2 \\le 36$, the average of $x^2 + y^2 + 7$ is $\\frac{36}{2} + 7 = 25$.\n\n> **Watch out.** The average of $x^2 + y^2$ is $\\frac{R^2}{2}$, half its largest value $R^2$ on the edge; remember the factor $r$ in $dA = r\\,dr\\,d\\theta$, and keep the constant term.",
        "$f$ 在区域 $D$ 上的平均值为 $\\frac{1}{\\operatorname{Area}(D)}\\iint_D f\\,dA$。在半径为 $R$ 的圆盘上，极坐标使径向函数容易计算：$\\iint_D (x^2 + y^2)\\,dA = \\int_0^{2\\pi}\\int_0^R r^2 \\cdot r\\,dr\\,d\\theta = \\frac{\\pi R^4}{2}$，除以 $\\pi R^2$ 得平均值 $\\frac{R^2}{2}$。给 $f$ 加一个常数，平均值也加上这个常数。在圆盘 $x^2 + y^2 \\le 36$ 上，$x^2 + y^2 + 7$ 的平均值为 $\\frac{36}{2} + 7 = 25$。\n\n> **注意。** $x^2 + y^2$ 的平均值是 $\\frac{R^2}{2}$，是它在边界上的最大值 $R^2$ 的一半；别忘了 $dA = r\\,dr\\,d\\theta$ 中的因子 $r$，也不要丢掉常数项。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-4, 4);
        const b = rng.int(-6, 6);
        const R = rng.int(1, 5);
        const ans = Q.of(a * R * R + 2 * b, 2);
        const radial = Q.of(a * R * R, 2);
        const constant = b === 0 ? "" : b < 0 ? ` - ${-b}` : ` + ${b}`;
        const f = poly([a, "(x^2 + y^2)"], [b, ""]);
        const integral = Q.of(a * R * R * R * R + 2 * b * R * R, 2);
        return numberProblem({
          prompt: t(
            `Find the average value of $f(x, y) = ${f}$ over the disk $x^2 + y^2 \\le ${R * R}$.`,
            `求 $f(x, y) = ${f}$ 在圆盘 $x^2 + y^2 \\le ${R * R}$ 上的平均值。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(a * R * R + b),
              "That uses the edge value $R^2$ of $x^2 + y^2$; its average over the disk is $\\frac{R^2}{2}$.",
              "那是用了 $x^2 + y^2$ 在边界上的值 $R^2$；它在圆盘上的平均值是 $\\frac{R^2}{2}$。",
            ),
            why(
              Q.of(a * R * R + 3 * b, 3),
              "That uses $\\frac{R^2}{3}$, which comes from dropping the factor $r$ in $dA$, and also divides the constant by $3$.",
              "那是用了 $\\frac{R^2}{3}$，来自漏掉 $dA$ 中的因子 $r$，还把常数也除以了 $3$。",
            ),
            why(
              radial,
              "That drops the constant term; a constant added to $f$ is added to the average.",
              "那是丢掉了常数项；给 $f$ 加的常数也要加到平均值上。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Average the radial part", "求径向部分的平均值"],
                t(
                  `The average of $x^2 + y^2$ over a disk of radius $${R}$ is $\\frac{R^2}{2} = ${Q.of(R * R, 2).toLatex()}$, so the average of $${poly([a, "(x^2 + y^2)"])}$ is $${radial.toLatex()}$.`,
                  `$x^2 + y^2$ 在半径为 $${R}$ 的圆盘上的平均值为 $\\frac{R^2}{2} = ${Q.of(R * R, 2).toLatex()}$，所以 $${poly([a, "(x^2 + y^2)"])}$ 的平均值为 $${radial.toLatex()}$。`,
                ),
              ],
              [
                ["Add the constant", "加上常数"],
                t(
                  `$f_{\\text{avg}} = ${radial.toLatex()}${constant} = ${ans.toLatex()}$.`,
                  `$f_{\\text{avg}} = ${radial.toLatex()}${constant} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `In polar coordinates $\\iint_D f\\,dA = 2\\pi\\int_0^{${R}} (${poly([a, "r^3"], [b, "r"])})\\,dr = ${withPi(integral)}$, and dividing by the area $${withPi(Q.of(R * R))}$ gives $${ans.toLatex()}$.`,
              `用极坐标，$\\iint_D f\\,dA = 2\\pi\\int_0^{${R}} (${poly([a, "r^3"], [b, "r"])})\\,dr = ${withPi(integral)}$，除以面积 $${withPi(Q.of(R * R))}$ 得 $${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** densityMassAndChargeOfPlaneLaminas calculates total mass M = ∬ ρ dA. */
export const densityMassAndChargeOfPlaneLaminas: TopicDef = {
  id: "density-mass-and-charge-of-plane-laminas",
  title: t("Density, Mass, and Charge of Plane Laminas", "平面薄片的密度、质量与电荷"),
  summary: t(
    "The total mass or net charge of a plane lamina with area density $\\rho(x, y)$ is $M = \\iint_D \\rho(x, y)\\,dA$.",
    "面密度为 $\\rho(x, y)$ 的平面薄片的总质量或净电荷为 $M = \\iint_D \\rho(x, y)\\,dA$。",
  ),
  intro: t(
    "Find the mass of a plate on $[0, 2] \\times [0, 3]$ with density $\\rho = x + y$. The inner integral is $\\int_0^2 (x + y)\\,dx = 2 + 2y$, and $\\int_0^3 (2 + 2y)\\,dy = 6 + 9 = 15$.\n\nCheck: a linear density averages to its value at the center $\\left(1, \\frac{3}{2}\\right)$, which is $\\frac{5}{2}$, and $\\frac{5}{2}$ times the area $6$ is $15$.\n\nIn this lesson we find the total mass or charge of a flat plate by integrating its density over the region it covers.",
    "求占据 $[0, 2] \\times [0, 3]$、密度为 $\\rho = x + y$ 的薄板的质量。内层积分为 $\\int_0^2 (x + y)\\,dx = 2 + 2y$，而 $\\int_0^3 (2 + 2y)\\,dy = 6 + 9 = 15$。\n\n检验：线性密度的平均值等于它在中心 $\\left(1, \\frac{3}{2}\\right)$ 处的值 $\\frac{5}{2}$，$\\frac{5}{2}$ 乘以面积 $6$ 得 $15$。\n\n本课我们把密度在薄板所占区域上积分，求它的总质量或总电荷。",
  ),
  prerequisites: ["double-integrals-over-rectangular-domains"],
  encompasses: [{ topic: "double-integrals-over-rectangular-domains", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "calculating-total-mass-and-charge-from-area-density",
      title: t("Calculating total mass and charge from area density", "由面密度积分计算薄片总质量与总电荷"),
      explanation: t(
        "Density is mass per unit area, so integrating the density over the region adds up the mass of all the small pieces: $M = \\iint_D \\rho\\,dA$. For $\\rho = 2x + 3$ on $[0, 3] \\times [0, 4]$, the inner integral is $\\int_0^3 (2x + 3)\\,dx = 9 + 9 = 18$, and integrating over $y$ multiplies by the height $4$, so $M = 72$.\n\n> **Watch out.** The area alone is the mass only when the density is $1$; keep the $\\frac{1}{2}$ from $\\int x\\,dx$, keep the constant part of the density, and do not stop after the inner integral.",
        "密度是单位面积的质量，所以把密度在区域上积分，就把所有小块的质量加了起来：$M = \\iint_D \\rho\\,dA$。对 $[0, 3] \\times [0, 4]$ 上的 $\\rho = 2x + 3$，内层积分为 $\\int_0^3 (2x + 3)\\,dx = 9 + 9 = 18$，再对 $y$ 积分就是乘以高 $4$，所以 $M = 72$。\n\n> **注意。** 只有密度为 $1$ 时面积才等于质量；要保留 $\\int x\\,dx$ 中的 $\\frac{1}{2}$，保留密度的常数部分，也不要在内层积分后就停下。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 5);
        const b = rng.int(1, 5);
        const halfW = rng.int(1, 5);
        const W = 2 * halfW;
        const H = rng.int(2, 6);
        const inner = a * halfW * W + b * W;
        const mass = H * inner;
        const rho = `${poly([a, "x"])} + ${b}`;
        return numberProblem({
          prompt: t(
            `Find the total mass $M$ of a planar lamina occupying the rectangle $D = [0, ${W}] \\times [0, ${H}]$ with density function $\\rho(x, y) = ${rho}$.`,
            `求占据矩形区域 $D = [0, ${W}] \\times [0, ${H}]$、面密度为 $\\rho(x, y) = ${rho}$ 的平面薄片的总质量 $M$。`,
          ),
          answer: mass,
          mistakes: distinct(mass, [
            why(W * H, "That is the area; it equals the mass only when the density is $1$.", "那是面积；只有密度为 $1$ 时它才等于质量。"),
            why(
              H * (a * W * W + b * W),
              "That loses the $\\frac{1}{2}$ in $\\int_0^W x\\,dx = \\frac{W^2}{2}$.",
              "那是漏了 $\\int_0^W x\\,dx = \\frac{W^2}{2}$ 中的 $\\frac{1}{2}$。",
            ),
            why(
              inner,
              "That stops after the inner integral; integrating over $y$ multiplies by the height.",
              "那是只做了内层积分；对 $y$ 积分还要乘以高。",
            ),
            why(H * a * halfW * W, "That leaves out the constant part of the density.", "那是漏掉了密度的常数部分。"),
          ]),
          solution: walked(
            [
              [
                ["Integrate across", "先对 x 积分"],
                t(
                  `$\\int_0^{${W}} (${rho})\\,dx = ${a * halfW * W} + ${b * W} = ${inner}$.`,
                  `$\\int_0^{${W}} (${rho})\\,dx = ${a * halfW * W} + ${b * W} = ${inner}$。`,
                ),
              ],
              [
                ["Integrate up", "再对 y 积分"],
                t(
                  `$M = \\int_0^{${H}} ${inner}\\,dy = ${inner} \\cdot ${H} = ${mass}$.`,
                  `$M = \\int_0^{${H}} ${inner}\\,dy = ${inner} \\cdot ${H} = ${mass}$。`,
                ),
              ],
            ],
            t(
              `The density at the middle $x = ${halfW}$ is $${a * halfW + b}$, and that average times the area $${W * H}$ is $${mass}$.`,
              `中间 $x = ${halfW}$ 处的密度为 $${a * halfW + b}$，这个平均密度乘以面积 $${W * H}$ 得 $${mass}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "charge-on-a-triangular-plate",
      figure: multivariableDrawings8["density-mass-and-charge-of-plane-laminas#charge-on-a-triangular-plate"],
      title: t("Charge on a triangular plate", "三角形板上的电荷"),
      explanation: t(
        "Total charge is the double integral of the charge density, $Q = \\iint_D \\sigma(x, y)\\,dA$, just as mass is the integral of mass density. For the triangle $0 \\le y \\le x \\le L$, integrate $y$ first from $0$ to $x$:\n\n$$\\iint_D \\sigma\\,dA = \\int_0^L \\int_0^x \\sigma(x, y)\\,dy\\,dx.$$\n\nFor $\\sigma = x + y$ on $0 \\le y \\le x \\le 3$, the inner integral is $x^2 + \\frac{x^2}{2} = \\frac{3}{2}x^2$, and $\\int_0^3 \\frac{3}{2}x^2\\,dx = \\frac{27}{2}$. A linear density averages to its value at the centroid $(2, 1)$, which is $3$, and $3$ times the area $\\frac{9}{2}$ is $\\frac{27}{2}$.\n\n> **Watch out.** The inner limit is $x$, not $L$; integrating over the whole square $[0, L]^2$ counts a second triangle that is not part of the plate.",
        "总电荷是电荷密度的二重积分 $Q = \\iint_D \\sigma(x, y)\\,dA$，正如质量是质量密度的积分。对三角形 $0 \\le y \\le x \\le L$，先对 $y$ 从 $0$ 积到 $x$：\n\n$$\\iint_D \\sigma\\,dA = \\int_0^L \\int_0^x \\sigma(x, y)\\,dy\\,dx$$\n\n对 $0 \\le y \\le x \\le 3$ 上的 $\\sigma = x + y$，内层积分为 $x^2 + \\frac{x^2}{2} = \\frac{3}{2}x^2$，而 $\\int_0^3 \\frac{3}{2}x^2\\,dx = \\frac{27}{2}$。线性密度的平均值等于它在形心 $(2, 1)$ 处的值 $3$，$3$ 乘以面积 $\\frac{9}{2}$ 得 $\\frac{27}{2}$。\n\n> **注意。** 内层上限是 $x$ 而不是 $L$；在整个正方形 $[0, L]^2$ 上积分会多算一个不属于板的三角形。",
      ),
      generate(rng: Rng): Problem {
        const L = rng.int(1, 6);
        const c = rng.int(1, 6);
        const useY = rng.int(0, 1) === 1;
        // ∫0^L ∫0^x c y dy dx = c L^3 / 6.
        const ans = useY ? Q.of(c * L * L * L, 6) : Q.of(c * L * L * L, 3);
        const sigma = useY ? poly([c, "y"]) : poly([c, "x"]);
        const inner = useY ? `${qcoef(Q.of(c, 2))}x^2` : poly([c, "x^2"]);
        const atCentroid = useY ? Q.of(c * L, 3) : Q.of(2 * c * L, 3);
        return numberProblem({
          prompt: t(
            `A plate occupies the triangle $0 \\le y \\le x \\le ${L}$ with charge density $\\sigma(x, y) = ${sigma}$ C/m². Find the total charge.`,
            `一块板占据三角形 $0 \\le y \\le x \\le ${L}$，电荷密度为 $\\sigma(x, y) = ${sigma}$ C/m²。求总电荷。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(c * L * L * L, 2),
              "That integrates over the whole square $[0, L]^2$; the inner limit is $x$, not $L$.",
              "那是在整个正方形 $[0, L]^2$ 上积分；内层上限是 $x$ 而不是 $L$。",
            ),
            why(
              useY ? Q.of(c * L * L * L, 3) : Q.of(c * L * L * L, 6),
              useY
                ? "That treats the density as $cx$; integrating $cy$ from $0$ to $x$ gives $\\frac{c}{2}x^2$."
                : "That treats the density as $cy$; integrating $cx$ from $0$ to $x$ gives $cx^2$.",
              useY
                ? "那是把密度当成了 $cx$；$cy$ 从 $0$ 积到 $x$ 得 $\\frac{c}{2}x^2$。"
                : "那是把密度当成了 $cy$；$cx$ 从 $0$ 积到 $x$ 得 $cx^2$。",
            ),
            why(
              Q.of(c * L * L, 2),
              "That multiplies the density's coefficient by the area $\\frac{L^2}{2}$, as if the density were constant.",
              "那是把密度的系数乘以面积 $\\frac{L^2}{2}$，好像密度是常数。",
            ),
          ]),
          solution: walked(
            [
              [["Integrate in y", "对 y 积分"], t(`$\\int_0^x ${sigma}\\,dy = ${inner}$.`, `$\\int_0^x ${sigma}\\,dy = ${inner}$。`)],
              [
                ["Integrate in x", "对 x 积分"],
                t(`$\\int_0^{${L}} ${inner}\\,dx = ${ans.toLatex()}$ C.`, `$\\int_0^{${L}} ${inner}\\,dx = ${ans.toLatex()}$ C。`),
              ],
            ],
            t(
              `A linear density averages to its value at the centroid $\\left(${Q.of(2 * L, 3).toLatex()}, ${Q.of(L, 3).toLatex()}\\right)$, which is $${atCentroid.toLatex()}$, and that times the area $${Q.of(L * L, 2).toLatex()}$ is $${ans.toLatex()}$.`,
              `线性密度的平均值等于它在形心 $\\left(${Q.of(2 * L, 3).toLatex()}, ${Q.of(L, 3).toLatex()}\\right)$ 处的值 $${atCentroid.toLatex()}$，乘以面积 $${Q.of(L * L, 2).toLatex()}$ 得 $${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** momentsAndCenterOfMass defines moments and center of mass for planar regions. */
export const momentsAndCenterOfMass: TopicDef = {
  id: "moments-and-center-of-mass",
  title: t("Moments and Center of Mass", "质心与力矩的概念"),
  summary: t(
    "The first moments $M_y = \\iint x\\rho\\,dA$ and $M_x = \\iint y\\rho\\,dA$ locate the center of mass $(\\bar{x}, \\bar{y}) = \\left(\\frac{M_y}{M}, \\frac{M_x}{M}\\right)$.",
    "一阶矩 $M_y = \\iint x\\rho\\,dA$ 与 $M_x = \\iint y\\rho\\,dA$ 确定质心 $(\\bar{x}, \\bar{y}) = \\left(\\frac{M_y}{M}, \\frac{M_x}{M}\\right)$。",
  ),
  intro: t(
    "Find the center of mass of $2$ kg at $(0, 4)$ and $3$ kg at $(5, -1)$. The total mass is $5$, $M_y = 2 \\cdot 0 + 3 \\cdot 5 = 15$ and $M_x = 8 - 3 = 5$, so $(\\bar{x}, \\bar{y}) = (3, 1)$.\n\nCheck: the center lies on the segment between the masses, $\\frac{3}{5}$ of the way from the lighter one: $(0, 4) + \\frac{3}{5}(5, -5) = (3, 1)$.\n\nIn this lesson we define the first moments about the axes and use them to locate the center of mass of point masses and of plates.",
    "求 $(0, 4)$ 处 $2$ kg 与 $(5, -1)$ 处 $3$ kg 的质心。总质量为 $5$，$M_y = 2 \\cdot 0 + 3 \\cdot 5 = 15$，$M_x = 8 - 3 = 5$，所以 $(\\bar{x}, \\bar{y}) = (3, 1)$。\n\n检验：质心位于两质点之间的线段上，从较轻者出发走全程的 $\\frac{3}{5}$：$(0, 4) + \\frac{3}{5}(5, -5) = (3, 1)$。\n\n本课我们定义关于坐标轴的一阶矩，并用它求质点组和薄板的质心。",
  ),
  prerequisites: ["density-mass-and-charge-of-plane-laminas"],
  encompasses: [{ topic: "density-mass-and-charge-of-plane-laminas", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "defining-moments-and-center-of-mass-coordinates",
      title: t("Defining moments and center of mass coordinates", "一阶矩与质心坐标的定义"),
      explanation: t(
        "A moment weights each piece of mass by its distance from an axis, and dividing the moment by the total mass gives the coordinate of the center of mass. The first moment about the $y$-axis is $M_y = \\iint_D x \\rho(x, y)\\,dA$, since $x$ is the distance from that axis. For a uniform lamina ($\\rho = 1$) on $[0, 3] \\times [0, 4]$, $M_y = \\int_0^4 \\int_0^3 x\\,dx\\,dy = \\frac{9}{2} \\cdot 4 = 18$. Dividing by the mass $12$ gives $\\bar{x} = \\frac{3}{2}$, the middle of the base.\n\n> **Watch out.** The moment about the $y$-axis uses $x$, not $y$; keep the $\\frac{1}{2}$ from $\\int x\\,dx$, and multiply by the height for the outer integral.",
        "力矩用每一小块质量到轴的距离对它加权，把力矩除以总质量就得到质心的坐标。薄片对 $y$ 轴的一阶矩为 $M_y = \\iint_D x \\rho(x, y)\\,dA$，因为 $x$ 是到该轴的距离。对 $[0, 3] \\times [0, 4]$ 上的均匀薄片（$\\rho = 1$），$M_y = \\int_0^4 \\int_0^3 x\\,dx\\,dy = \\frac{9}{2} \\cdot 4 = 18$。除以质量 $12$ 得 $\\bar{x} = \\frac{3}{2}$，正是底边的中点。\n\n> **注意。** 对 $y$ 轴的矩用 $x$ 而不是 $y$；要保留 $\\int x\\,dx$ 中的 $\\frac{1}{2}$，外层积分还要乘以高。",
      ),
      generate(rng: Rng): Problem {
        const halfW = rng.int(1, 6);
        const W = 2 * halfW;
        const H = rng.int(2, 8);
        const My = H * halfW * W;
        return numberProblem({
          prompt: t(
            `Calculate the first moment about the $y$-axis, $M_y = \\iint_D x\\,dA$, for the uniform rectangular lamina $D = [0, ${W}] \\times [0, ${H}]$ (with density $\\rho = 1$).`,
            `计算均匀矩形薄片 $D = [0, ${W}] \\times [0, ${H}]$（面密度 $\\rho = 1$）对 $y$ 轴的一阶矩 $M_y = \\iint_D x\\,dA$。`,
          ),
          answer: My,
          mistakes: distinct(My, [
            why(
              W * H,
              "That is the mass, the area; the moment weights each piece by its $x$.",
              "那是质量，即面积；矩要用每一小块的 $x$ 加权。",
            ),
            why(
              H * W * W,
              "That loses the $\\frac{1}{2}$ in $\\int_0^W x\\,dx = \\frac{W^2}{2}$.",
              "那是漏了 $\\int_0^W x\\,dx = \\frac{W^2}{2}$ 中的 $\\frac{1}{2}$。",
            ),
            why(
              halfW * W,
              "That stops after the inner integral; integrating over $y$ multiplies by the height.",
              "那是只做了内层积分；对 $y$ 积分还要乘以高。",
            ),
            why(
              (W * H * H) / 2,
              "That is $M_x$, which weights by $y$; the moment about the $y$-axis weights by $x$.",
              "那是用 $y$ 加权的 $M_x$；对 $y$ 轴的矩用 $x$ 加权。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Integrate in x", "对 x 积分"],
                t(
                  `$\\int_0^{${W}} x\\,dx = \\frac{${W * W}}{2} = ${halfW * W}$.`,
                  `$\\int_0^{${W}} x\\,dx = \\frac{${W * W}}{2} = ${halfW * W}$。`,
                ),
              ],
              [
                ["Integrate in y", "对 y 积分"],
                t(
                  `$M_y = \\int_0^{${H}} ${halfW * W}\\,dy = ${halfW * W} \\cdot ${H} = ${My}$.`,
                  `$M_y = \\int_0^{${H}} ${halfW * W}\\,dy = ${halfW * W} \\cdot ${H} = ${My}$。`,
                ),
              ],
            ],
            t(
              `The center of a uniform rectangle is at $\\bar{x} = ${halfW}$, and $M_y = M\\bar{x} = ${W * H} \\cdot ${halfW} = ${My}$.`,
              `均匀矩形的中心在 $\\bar{x} = ${halfW}$，而 $M_y = M\\bar{x} = ${W * H} \\cdot ${halfW} = ${My}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "center-of-mass-of-point-masses",
      title: t("The center of mass of point masses", "质点组的质心"),
      explanation: t(
        "For point masses $m_i$ at $(x_i, y_i)$, the moments about the axes are $M_y = \\sum m_i x_i$ and $M_x = \\sum m_i y_i$, and the center of mass is\n\n$$\\bar{x} = \\frac{M_y}{m}, \\qquad \\bar{y} = \\frac{M_x}{m}, \\qquad m = \\sum m_i.$$\n\nFor $4$ kg at $(-2, 1)$ and $6$ kg at $(3, 6)$, $m = 10$, $M_y = -8 + 18 = 10$ and $M_x = 4 + 36 = 40$, so the center is $(1, 4)$, closer to the heavier mass.\n\n> **Watch out.** The labels are crossed: the moment about the $y$-axis uses the $x$-coordinates. Divide by the total mass, not by the number of points.",
        "对位于 $(x_i, y_i)$ 的质点 $m_i$，关于两轴的矩为 $M_y = \\sum m_i x_i$ 与 $M_x = \\sum m_i y_i$，质心为\n\n$$\\bar{x} = \\frac{M_y}{m}, \\qquad \\bar{y} = \\frac{M_x}{m}, \\qquad m = \\sum m_i$$\n\n对 $(-2, 1)$ 处 $4$ kg 与 $(3, 6)$ 处 $6$ kg，$m = 10$，$M_y = -8 + 18 = 10$，$M_x = 4 + 36 = 40$，所以质心为 $(1, 4)$，更靠近较重的质点。\n\n> **注意。** 下标是交叉的：关于 $y$ 轴的矩用 $x$ 坐标。要除以总质量，而不是点的个数。",
      ),
      generate(rng: Rng): Problem {
        const ms = [rng.int(1, 5), rng.int(1, 5), rng.int(1, 5)];
        const xs = rng.sample([-4, -3, -2, -1, 0, 1, 2, 3, 4, 5], 3);
        const pts = ms.map((_, i) => [xs[i]!, rng.int(-4, 5)] as const);
        const askX = rng.int(0, 1) === 0;
        const k = askX ? 0 : 1;
        const m = ms[0]! + ms[1]! + ms[2]!;
        const terms = ms.map((mi, i) => mi * pts[i]![k]);
        const mom = terms.reduce((s, v) => s + v, 0);
        const ans = Q.of(mom, m);
        const coords = pts.map((p) => p[k]);
        const list = ms.map((mi, i) => `$${mi}$ kg at $(${pts[i]![0]}, ${pts[i]![1]})$`);
        const listZh = ms.map((mi, i) => `$(${pts[i]![0]}, ${pts[i]![1]})$ 处 $${mi}$ kg`);
        const bar = askX ? "\\bar{x}" : "\\bar{y}";
        const M = askX ? "M_y" : "M_x";
        return numberProblem({
          prompt: t(
            `Point masses are placed as follows: ${list.join(", ")}. Find $${bar}$ of the center of mass.`,
            `质点放置如下：${listZh.join("，")}。求质心的 $${bar}$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(
                coords.reduce((s, c) => s + c, 0),
                3,
              ),
              "That averages the coordinates without weighting them by the masses.",
              "那是没有用质量加权，直接平均了坐标。",
            ),
            why(
              Q.of(
                ms.reduce((s, mi, i) => s + mi * pts[i]![askX ? 1 : 0], 0),
                m,
              ),
              `That uses the ${askX ? "$y$" : "$x$"}-coordinates, which give the other coordinate of the center.`,
              `那是用了${askX ? " $y$ " : " $x$ "}坐标，得到的是质心的另一个坐标。`,
            ),
            why(Q.of(mom), "That is the moment; divide it by the total mass.", "那是矩；还要除以总质量。"),
            why(Q.of(mom, 3), "That divides by the number of points; divide by the total mass.", "那是除以了点的个数；应除以总质量。"),
          ]),
          solution: walked(
            [
              [["Add the masses", "求总质量"], t(`$m = ${ms.join(" + ")} = ${m}$.`, `$m = ${ms.join(" + ")} = ${m}$。`)],
              [
                ["Find the moment", "求矩"],
                t(
                  `Multiplying each mass by its ${askX ? "$x$" : "$y$"}-coordinate, $${M} = ${sumOf(terms)} = ${mom}$.`,
                  `每个质量乘以它的${askX ? " $x$ " : " $y$ "}坐标，$${M} = ${sumOf(terms)} = ${mom}$。`,
                ),
              ],
              [["Divide", "相除"], t(`$${bar} = \\frac{${M}}{m} = ${ans.toLatex()}$.`, `$${bar} = \\frac{${M}}{m} = ${ans.toLatex()}$。`)],
            ],
            t(
              `$${ans.toLatex()}$ lies between the smallest and largest coordinates, $${Math.min(...coords)}$ and $${Math.max(...coords)}$, as a balance point must.`,
              `$${ans.toLatex()}$ 介于最小坐标 $${Math.min(...coords)}$ 与最大坐标 $${Math.max(...coords)}$ 之间，平衡点理应如此。`,
            ),
          ),
        });
      },
    },
  ],
};

/** momentsAndCentersOfMassOfThinRods finds centers of mass in 1D. */
export const momentsAndCentersOfMassOfThinRods: TopicDef = {
  id: "moments-and-centers-of-mass-of-thin-rods",
  title: t("Moments and Centers of Mass of Thin Rods", "细棒的力矩与质心"),
  summary: t(
    "For a straight thin rod along $[0, L]$ with linear density $\\lambda(x)$, the total mass is $m = \\int_0^L \\lambda\\,dx$ and the center of mass is $\\bar{x} = \\frac{1}{m}\\int_0^L x\\lambda\\,dx$.",
    "对于位于 $[0, L]$ 且线密度为 $\\lambda(x)$ 的细直棒，总质量为 $m = \\int_0^L \\lambda\\,dx$，质心坐标为 $\\bar{x} = \\frac{1}{m}\\int_0^L x\\lambda\\,dx$。",
  ),
  intro: t(
    "Find the center of mass of a rod on $[0, 2]$ with density $\\lambda = 3x^2$. The mass is $\\int_0^2 3x^2\\,dx = 8$ and the moment is $\\int_0^2 3x^3\\,dx = 12$, so $\\bar{x} = \\frac{12}{8} = \\frac{3}{2}$.\n\nCheck: the density grows toward $x = 2$, so the center lies past the midpoint $1$ but still inside the rod, and $\\frac{3}{2}$ does.\n\nIn this lesson we find the mass of a thin rod by integrating its linear density, and its center of mass by dividing its moment by that mass.",
    "求位于 $[0, 2]$、密度为 $\\lambda = 3x^2$ 的细杆的质心。质量为 $\\int_0^2 3x^2\\,dx = 8$，矩为 $\\int_0^2 3x^3\\,dx = 12$，所以 $\\bar{x} = \\frac{12}{8} = \\frac{3}{2}$。\n\n检验：密度向 $x = 2$ 增大，所以质心越过中点 $1$ 但仍在杆内，$\\frac{3}{2}$ 正是如此。\n\n本课我们对线密度积分求细杆的质量，再用矩除以质量求它的质心。",
  ),
  prerequisites: ["moments-and-center-of-mass"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "one-dimensional-center-of-mass-integrals",
      title: t("One-dimensional center of mass integrals", "一维细棒质心的一元定积分计算"),
      explanation: t(
        "For a thin rod with linear density $\\lambda(x) = kx$ on $[0, L]$, the total mass is $m = \\int_0^L kx\\,dx = \\frac{kL^2}{2}$, and the first moment about the origin is $M_0 = \\int_0^L kx^2\\,dx = \\frac{kL^3}{3}$. For $\\lambda = 5x$ on $[0, 4]$, $m = \\frac{5 \\cdot 16}{2} = 40$; the density at the midpoint is $10$, and $10$ times the length $4$ is $40$ as well.\n\n> **Watch out.** The mass is the integral of the density, not the density at the end times the length; the density grows from $0$, so its average is only half of $kL$.",
        "对于在 $[0, L]$ 上线密度为 $\\lambda(x) = kx$ 的细棒，总质量为 $m = \\int_0^L kx\\,dx = \\frac{kL^2}{2}$，对原点的一阶矩为 $M_0 = \\int_0^L kx^2\\,dx = \\frac{kL^3}{3}$。对 $[0, 4]$ 上的 $\\lambda = 5x$，$m = \\frac{5 \\cdot 16}{2} = 40$；中点处的密度为 $10$，$10$ 乘以长度 $4$ 也是 $40$。\n\n> **注意。** 质量是密度的积分，不是端点处的密度乘以长度；密度从 $0$ 开始增大，所以平均密度只有 $kL$ 的一半。",
      ),
      generate(rng: Rng): Problem {
        const kappa = rng.int(1, 5);
        const k = 2 * kappa; // so mass = kappa * L^2 is an integer
        const L = rng.int(2, 8);
        const mass = kappa * L * L;
        const lambda = poly([k, "x"]);
        return numberProblem({
          prompt: t(
            `A thin straight rod occupies the interval $[0, ${L}]$ with linear density $\\lambda(x) = ${lambda}$. Find the total mass $m$ of the rod.`,
            `一根细直棒占据区间 $[0, ${L}]$，其线密度为 $\\lambda(x) = ${lambda}$。求该细棒的总质量 $m$。`,
          ),
          answer: mass,
          mistakes: distinct(mass, [
            why(k * L, "That is the density at the far end, not the mass.", "那是远端处的密度，不是质量。"),
            why(
              k * L * L,
              "That multiplies the end density by the length; the density grows from $0$, so its average is half of that.",
              "那是用端点密度乘以长度；密度从 $0$ 增大，平均值只有它的一半。",
            ),
            why(
              Q.of(k * L * L * L, 3),
              "That is the moment $\\int_0^L x\\lambda\\,dx$, not the mass.",
              "那是矩 $\\int_0^L x\\lambda\\,dx$，不是质量。",
            ),
          ]),
          solution: walked(
            [
              [["Set up the mass", "列出质量"], t(`$m = \\int_0^{${L}} ${lambda}\\,dx$.`, `$m = \\int_0^{${L}} ${lambda}\\,dx$。`)],
              [
                ["Integrate", "积分"],
                t(
                  `$m = \\left[${poly([kappa, "x^2"])}\\right]_0^{${L}} = ${mass}$.`,
                  `$m = \\left[${poly([kappa, "x^2"])}\\right]_0^{${L}} = ${mass}$。`,
                ),
              ],
            ],
            t(
              `The density at the midpoint $x = ${Q.of(L, 2).toLatex()}$ is $${kappa * L}$, and that average times the length $${L}$ is $${mass}$.`,
              `中点 $x = ${Q.of(L, 2).toLatex()}$ 处的密度为 $${kappa * L}$，这个平均密度乘以长度 $${L}$ 得 $${mass}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "center-of-mass-of-a-rod-with-linear-density",
      title: t("The center of mass of a rod with varying density", "变密度细杆的质心"),
      explanation: t(
        "A rod on $[0, L]$ with linear density $\\lambda(x)$ has mass $m = \\int_0^L \\lambda\\,dx$ and moment $M_0 = \\int_0^L x\\lambda\\,dx$ about the origin. Its center of mass is $\\bar{x} = \\frac{M_0}{m}$. For $\\lambda = 2x + 6$ on $[0, 3]$, $m = 9 + 18 = 27$ and $M_0 = 18 + 27 = 45$, so $\\bar{x} = \\frac{45}{27} = \\frac{5}{3}$, past the midpoint $\\frac{3}{2}$ toward the heavier end.\n\n> **Watch out.** Divide the moment by the mass; the midpoint ignores the density, and $\\frac{2L}{3}$ is the center only when the density is proportional to $x$ with no constant part.",
        "位于 $[0, L]$、线密度为 $\\lambda(x)$ 的细杆，质量为 $m = \\int_0^L \\lambda\\,dx$，关于原点的矩为 $M_0 = \\int_0^L x\\lambda\\,dx$。质心为 $\\bar{x} = \\frac{M_0}{m}$。对 $[0, 3]$ 上的 $\\lambda = 2x + 6$，$m = 9 + 18 = 27$，$M_0 = 18 + 27 = 45$，所以 $\\bar{x} = \\frac{45}{27} = \\frac{5}{3}$，越过中点 $\\frac{3}{2}$ 移向较重的一端。\n\n> **注意。** 要用矩除以质量；中点忽略了密度，而只有当密度与 $x$ 成正比、没有常数部分时，质心才是 $\\frac{2L}{3}$。",
      ),
      generate(rng: Rng): Problem {
        const L = rng.int(1, 6);
        const k = rng.int(1, 4);
        const c = rng.int(1, 5);
        // m = kL^2/2 + cL, M0 = kL^3/3 + cL^2/2.
        const m = Q.of(k * L * L + 2 * c * L, 2);
        const M0 = Q.of(2 * k * L * L * L + 3 * c * L * L, 6);
        const ans = M0.div(m);
        const lambda = poly([k, "x"], [c, ""]);
        return numberProblem({
          prompt: t(
            `A rod occupies $[0, ${L}]$ with linear density $\\lambda(x) = ${lambda}$ kg/m. Find its center of mass $\\bar{x}$.`,
            `细杆占据 $[0, ${L}]$，线密度为 $\\lambda(x) = ${lambda}$ kg/m。求其质心 $\\bar{x}$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(Q.of(L, 2), "That is the midpoint, which ignores the density.", "那是中点，忽略了密度。"),
            why(M0, "That is the moment $M_0$; divide it by the mass.", "那是矩 $M_0$；还要除以质量。"),
            why(
              Q.of(2 * L, 3),
              "That is the center for a density proportional to $x$; the constant part pulls it back toward the middle.",
              "那是密度与 $x$ 成正比时的质心；常数部分会把它拉回中点附近。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the mass", "求质量"],
                t(`$m = \\int_0^{${L}} (${lambda})\\,dx = ${m.toLatex()}$.`, `$m = \\int_0^{${L}} (${lambda})\\,dx = ${m.toLatex()}$。`),
              ],
              [
                ["Find the moment", "求矩"],
                t(
                  `$M_0 = \\int_0^{${L}} (${poly([k, "x^2"], [c, "x"])})\\,dx = ${M0.toLatex()}$.`,
                  `$M_0 = \\int_0^{${L}} (${poly([k, "x^2"], [c, "x"])})\\,dx = ${M0.toLatex()}$。`,
                ),
              ],
              [
                ["Divide", "相除"],
                t(`$\\bar{x} = \\frac{M_0}{m} = ${ans.toLatex()}$.`, `$\\bar{x} = \\frac{M_0}{m} = ${ans.toLatex()}$。`),
              ],
            ],
            t(
              `$${ans.toLatex()}$ lies between the midpoint $${Q.of(L, 2).toLatex()}$ and $${Q.of(2 * L, 3).toLatex()}$, the center for a density proportional to $x$, as it must for a mix of a constant and a growing density.`,
              `$${ans.toLatex()}$ 介于中点 $${Q.of(L, 2).toLatex()}$ 与密度正比于 $x$ 时的质心 $${Q.of(2 * L, 3).toLatex()}$ 之间，常数密度与增长密度混合时理应如此。`,
            ),
          ),
        });
      },
    },
  ],
};

/** momentsAndCentersOfMassOfPlaneLaminas calculates centers of mass of 2D laminas. */
export const momentsAndCentersOfMassOfPlaneLaminas: TopicDef = {
  id: "moments-and-centers-of-mass-of-plane-laminas",
  title: t("Moments and Centers of Mass of Plane Laminas", "平面薄片的质心计算"),
  summary: t(
    "For a planar lamina $D$ with varying density $\\rho(x, y)$, the center of mass is $\\bar{x} = \\frac{1}{M}\\iint_D x\\rho\\,dA$ and $\\bar{y} = \\frac{1}{M}\\iint_D y\\rho\\,dA$.",
    "对于具有变面密度 $\\rho(x, y)$ 的平面薄片 $D$，质心坐标为 $\\bar{x} = \\frac{1}{M}\\iint_D x\\rho\\,dA$ 与 $\\bar{y} = \\frac{1}{M}\\iint_D y\\rho\\,dA$。",
  ),
  intro: t(
    "Find $\\bar{y}$ for the plate $[0, 4] \\times [0, 3]$ with density $\\rho = y$. The mass is $4 \\cdot \\frac{9}{2} = 18$ and $M_x = \\iint y^2\\,dA = 4 \\cdot 9 = 36$, so $\\bar{y} = \\frac{36}{18} = 2$.\n\nCheck: the density does not depend on $x$, so $\\bar{x} = 2$ is the middle of the base, while $\\bar{y} = 2$ sits above the middle height $\\frac{3}{2}$, toward the denser top.\n\nIn this lesson we find the center of mass of plates whose density varies, by dividing the moments about the axes by the mass.",
    "求密度为 $\\rho = y$ 的薄板 $[0, 4] \\times [0, 3]$ 的 $\\bar{y}$。质量为 $4 \\cdot \\frac{9}{2} = 18$，$M_x = \\iint y^2\\,dA = 4 \\cdot 9 = 36$，所以 $\\bar{y} = \\frac{36}{18} = 2$。\n\n检验：密度与 $x$ 无关，所以 $\\bar{x} = 2$ 是底边中点；而 $\\bar{y} = 2$ 高于中间高度 $\\frac{3}{2}$，偏向密度较大的上方。\n\n本课我们用关于坐标轴的矩除以质量，求密度变化的薄板的质心。",
  ),
  prerequisites: ["moments-and-center-of-mass"],
  encompasses: [{ topic: "moments-and-center-of-mass", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "two-dimensional-center-of-mass-calculations",
      figure: multivariableDrawings8["moments-and-centers-of-mass-of-plane-laminas#two-dimensional-center-of-mass-calculations"],
      title: t("Two-dimensional center of mass calculations", "二维平面薄片质心坐标的计算"),
      explanation: t(
        "When the density increases in one direction, the center of mass shifts toward the denser side, away from the geometric center. For a rectangle $[0, W] \\times [0, H]$ with density $\\rho(x, y) = cx$, the constant $c$ and the height $H$ cancel, and\n\n$$\\bar{x} = \\frac{\\int_0^W x^2\\,dx}{\\int_0^W x\\,dx} = \\frac{W^3/3}{W^2/2} = \\frac{2}{3}W.$$\n\nFor $\\rho = 2x$ on $[0, 5] \\times [0, 3]$, $\\bar{x} = \\frac{10}{3}$, past the middle $\\frac{5}{2}$.\n\n> **Watch out.** The center is two thirds of the way across, toward the dense side, not one third and not the middle; $c$ and $H$ do not change it.",
        "当密度沿某个方向增大时，质心会偏离几何中心，向密度较大的一侧移动。对于在矩形 $[0, W] \\times [0, H]$ 上面密度为 $\\rho(x, y) = cx$ 的薄片，常数 $c$ 与高 $H$ 会约去，\n\n$$\\bar{x} = \\frac{\\int_0^W x^2\\,dx}{\\int_0^W x\\,dx} = \\frac{W^3/3}{W^2/2} = \\frac{2}{3}W$$\n\n对 $[0, 5] \\times [0, 3]$ 上的 $\\rho = 2x$，$\\bar{x} = \\frac{10}{3}$，越过了中点 $\\frac{5}{2}$。\n\n> **注意。** 质心在宽度的三分之二处，偏向密度大的一侧，不是三分之一处，也不是中点；$c$ 与 $H$ 不影响它。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(1, 5);
        const w = rng.int(1, 8);
        const W = 3 * w;
        const H = rng.int(2, 8);
        const xBar = 2 * w;
        const rho = poly([c, "x"]);
        const mass = Q.of(c * H * W * W, 2);
        const My = Q.of(c * H * W * W * W, 3);
        return numberProblem({
          prompt: t(
            `Find the $x$-coordinate of the center of mass $\\bar{x}$ of the planar lamina occupying $D = [0, ${W}] \\times [0, ${H}]$ with density $\\rho(x, y) = ${rho}$.`,
            `求占据矩形区域 $D = [0, ${W}] \\times [0, ${H}]$、面密度为 $\\rho(x, y) = ${rho}$ 的平面薄片质心的横坐标 $\\bar{x}$。`,
          ),
          answer: xBar,
          mistakes: distinct(xBar, [
            why(Q.of(W, 2), "That is the middle of the base, which ignores the density.", "那是底边的中点，忽略了密度。"),
            why(
              w,
              "That is one third of the way across, toward the light side; the center is pulled toward the dense side.",
              "那是靠轻的一侧的三分之一处；质心应偏向密度大的一侧。",
            ),
            why(W, "That is the far edge; the center of mass lies inside the plate.", "那是远端的边；质心在薄板内部。"),
          ]),
          solution: walked(
            [
              [
                ["Find the mass", "求质量"],
                t(
                  `$M = \\int_0^{${H}}\\int_0^{${W}} ${rho}\\,dx\\,dy = ${mass.toLatex()}$.`,
                  `$M = \\int_0^{${H}}\\int_0^{${W}} ${rho}\\,dx\\,dy = ${mass.toLatex()}$。`,
                ),
              ],
              [
                ["Find the moment", "求矩"],
                t(
                  `$M_y = \\int_0^{${H}}\\int_0^{${W}} ${poly([c, "x^2"])}\\,dx\\,dy = ${My.toLatex()}$.`,
                  `$M_y = \\int_0^{${H}}\\int_0^{${W}} ${poly([c, "x^2"])}\\,dx\\,dy = ${My.toLatex()}$。`,
                ),
              ],
              [["Divide", "相除"], t(`$\\bar{x} = \\frac{M_y}{M} = ${xBar}$.`, `$\\bar{x} = \\frac{M_y}{M} = ${xBar}$。`)],
            ],
            t(
              `$${xBar}$ is $\\frac{2}{3}$ of the width $${W}$, past the middle $${Q.of(W, 2).toLatex()}$ on the denser side.`,
              `$${xBar}$ 是宽度 $${W}$ 的 $\\frac{2}{3}$，越过中点 $${Q.of(W, 2).toLatex()}$，位于密度较大的一侧。`,
            ),
          ),
        });
      },
    },
    {
      id: "centroid-of-the-region-under-a-parabola",
      figure: multivariableDrawings8["moments-and-centers-of-mass-of-plane-laminas#centroid-of-the-region-under-a-parabola"],
      title: t("The centroid of the region under a parabola", "抛物线下区域的形心"),
      explanation: t(
        "For a uniform lamina under $y = f(x)$ on $[0, a]$, the area is $A = \\int_0^a f\\,dx$ and the moments come from integrating thin vertical strips:\n\n$$M_y = \\int_0^a x f(x)\\,dx, \\qquad M_x = \\int_0^a \\frac{f(x)^2}{2}\\,dx.$$\n\nThe factor $\\frac{1}{2}$ appears because each strip's own center sits at height $\\frac{f(x)}{2}$. Then $\\bar{x} = \\frac{M_y}{A}$ and $\\bar{y} = \\frac{M_x}{A}$. Under $y = 6x^2$ on $[0, 1]$, $A = 2$, $M_y = \\frac{3}{2}$ and $M_x = \\int_0^1 18x^4\\,dx = \\frac{18}{5}$, so the centroid is $\\left(\\frac{3}{4}, \\frac{9}{5}\\right)$.\n\n> **Watch out.** $M_x$ integrates $\\frac{f^2}{2}$, so do not drop the $\\frac{1}{2}$; and both moments must still be divided by the area.",
        "对 $[0, a]$ 上 $y = f(x)$ 下方的均匀薄板，面积为 $A = \\int_0^a f\\,dx$，矩由竖直细条积分得到：\n\n$$M_y = \\int_0^a x f(x)\\,dx, \\qquad M_x = \\int_0^a \\frac{f(x)^2}{2}\\,dx$$\n\n出现因子 $\\frac{1}{2}$ 是因为每个细条自身的中心在高度 $\\frac{f(x)}{2}$ 处。于是 $\\bar{x} = \\frac{M_y}{A}$，$\\bar{y} = \\frac{M_x}{A}$。在 $[0, 1]$ 上 $y = 6x^2$ 下方，$A = 2$，$M_y = \\frac{3}{2}$，$M_x = \\int_0^1 18x^4\\,dx = \\frac{18}{5}$，所以形心为 $\\left(\\frac{3}{4}, \\frac{9}{5}\\right)$。\n\n> **注意。** $M_x$ 积分的是 $\\frac{f^2}{2}$，不要丢掉 $\\frac{1}{2}$；两个矩都还要除以面积。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(1, 5);
        const a = rng.int(1, 6);
        const askX = rng.int(0, 1) === 0;
        // A = c a^3/3, M_y = c a^4/4, M_x = c^2 a^5/10.
        const ans = askX ? Q.of(3 * a, 4) : Q.of(3 * c * a * a, 10);
        const f = poly([c, "x^2"]);
        const area = Q.of(c * a * a * a, 3);
        const My = Q.of(c * a ** 4, 4);
        const Mx = Q.of(c * c * a ** 5, 10);
        const bar = askX ? "\\bar{x}" : "\\bar{y}";
        return numberProblem({
          prompt: t(
            `Find $${bar}$ for the uniform lamina bounded by $y = ${f}$, $y = 0$ and $x = ${a}$.`,
            `求由 $y = ${f}$、$y = 0$ 与 $x = ${a}$ 围成的均匀薄板的 $${bar}$。`,
          ),
          answer: ans,
          mistakes: distinct(
            ans,
            askX
              ? [
                  why(
                    Q.of(a, 2),
                    "That is the middle of the base; the region is taller on the right, so the centroid is further right.",
                    "那是底边中点；区域右侧更高，形心应更靠右。",
                  ),
                  why(
                    Q.of(2 * a, 3),
                    "That is the centroid of a triangle under a line; under a parabola even more area sits on the right.",
                    "那是直线下三角形的形心；抛物线下更多面积在右侧。",
                  ),
                  why(My, "That is the moment $M_y$; divide it by the area.", "那是矩 $M_y$；还要除以面积。"),
                ]
              : [
                  why(
                    Q.of(3 * c * a * a, 5),
                    "That drops the $\\frac{1}{2}$ in $M_x = \\int \\frac{f^2}{2}\\,dx$.",
                    "那是丢掉了 $M_x = \\int \\frac{f^2}{2}\\,dx$ 中的 $\\frac{1}{2}$。",
                  ),
                  why(
                    Q.of(c * a * a, 2),
                    "That is half the greatest height; most of the area lies low, so the centroid is lower.",
                    "那是最大高度的一半；大部分面积在下方，形心更低。",
                  ),
                  why(Mx, "That is the moment $M_x$; divide it by the area.", "那是矩 $M_x$；还要除以面积。"),
                ],
          ),
          solution: walked(
            [
              [
                ["Find the area", "求面积"],
                t(`$A = \\int_0^{${a}} ${f}\\,dx = ${area.toLatex()}$.`, `$A = \\int_0^{${a}} ${f}\\,dx = ${area.toLatex()}$。`),
              ],
              askX
                ? [
                    ["Find the moment", "求矩"],
                    t(
                      `$M_y = \\int_0^{${a}} ${poly([c, "x^3"])}\\,dx = ${My.toLatex()}$.`,
                      `$M_y = \\int_0^{${a}} ${poly([c, "x^3"])}\\,dx = ${My.toLatex()}$。`,
                    ),
                  ]
                : [
                    ["Find the moment", "求矩"],
                    t(
                      `$M_x = \\int_0^{${a}} \\frac{${coef(c * c)}x^4}{2}\\,dx = ${Mx.toLatex()}$.`,
                      `$M_x = \\int_0^{${a}} \\frac{${coef(c * c)}x^4}{2}\\,dx = ${Mx.toLatex()}$。`,
                    ),
                  ],
              [
                ["Divide", "相除"],
                t(
                  `$${bar} = \\frac{${askX ? "M_y" : "M_x"}}{A} = ${ans.toLatex()}$.`,
                  `$${bar} = \\frac{${askX ? "M_y" : "M_x"}}{A} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            askX
              ? t(
                  `$\\bar{x} = \\frac{3}{4} \\cdot ${a}$ lies past the middle $${Q.of(a, 2).toLatex()}$, as it should where the region is taller on the right.`,
                  `$\\bar{x} = \\frac{3}{4} \\cdot ${a}$ 越过中点 $${Q.of(a, 2).toLatex()}$，区域右侧更高，理应如此。`,
                )
              : t(
                  `$\\bar{y}$ is $\\frac{3}{10}$ of the greatest height $${c * a * a}$, below half of it because most of the area lies low.`,
                  `$\\bar{y}$ 是最大高度 $${c * a * a}$ 的 $\\frac{3}{10}$，低于它的一半，因为大部分面积在下方。`,
                ),
          ),
        });
      },
    },
  ],
};

/** momentsOfInertiaOfLaminasAboutTheCoordinateAxes calculates rotational inertia. */
export const momentsOfInertiaOfLaminasAboutTheCoordinateAxes: TopicDef = {
  id: "moments-of-inertia-of-laminas-about-the-coordinate-axes",
  title: t("Moments of Inertia of Laminas About the Coordinate Axes", "薄片对坐标轴的转动惯量"),
  summary: t(
    "The moments of inertia about the coordinate axes are $I_x = \\iint y^2\\rho\\,dA$ and $I_y = \\iint x^2\\rho\\,dA$.",
    "薄片对坐标轴的转动惯量为 $I_x = \\iint y^2\\rho\\,dA$ 与 $I_y = \\iint x^2\\rho\\,dA$。",
  ),
  intro: t(
    "Find $I_y$ for the uniform plate $[0, 3] \\times [0, 2]$ with $\\rho = 1$. The distance from the $y$-axis is $x$, so $I_y = \\int_0^2\\int_0^3 x^2\\,dx\\,dy = 9 \\cdot 2 = 18$.\n\nCheck: for a uniform rectangle with one side on the axis, $I = \\frac{MW^2}{3}$, and $\\frac{6 \\cdot 9}{3} = 18$.\n\nIn this lesson we find the moments of inertia of plates about the coordinate axes and about the origin by integrating squared distances.",
    "求均匀薄板 $[0, 3] \\times [0, 2]$（$\\rho = 1$）的 $I_y$。到 $y$ 轴的距离是 $x$，所以 $I_y = \\int_0^2\\int_0^3 x^2\\,dx\\,dy = 9 \\cdot 2 = 18$。\n\n检验：一边在轴上的均匀矩形有 $I = \\frac{MW^2}{3}$，而 $\\frac{6 \\cdot 9}{3} = 18$。\n\n本课我们对距离的平方积分，求薄板对坐标轴和对原点的转动惯量。",
  ),
  prerequisites: ["moments-and-centers-of-mass-of-plane-laminas"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-moments-of-inertia-about-axes",
      figure: multivariableDrawings8["moments-of-inertia-of-laminas-about-the-coordinate-axes#evaluating-moments-of-inertia-about-axes"],
      title: t("Evaluating moments of inertia about axes", "计算薄片对坐标轴的转动惯量"),
      explanation: t(
        "A moment of inertia weights each piece of mass by the square of its distance from the axis, measuring how hard the object is to rotate. For a uniform rectangular lamina $[0, W] \\times [0, H]$ with $\\rho = 1$, the distance from the $x$-axis is $y$, so $I_x = \\int_0^W \\int_0^H y^2\\,dy\\,dx = \\frac{WH^3}{3}$. For $[0, 4] \\times [0, 2]$, $I_x = \\frac{4 \\cdot 8}{3} = \\frac{32}{3}$.\n\n> **Watch out.** The moment of inertia squares the distance, so $H$ is cubed and the $\\frac{1}{3}$ stays; $\\frac{WH^2}{2}$ is the first moment, and $\\frac{HW^3}{3}$ is the moment about the other axis.",
        "转动惯量用每一小块质量到轴的距离的平方对它加权，衡量物体转动的难易程度。对于在 $[0, W] \\times [0, H]$ 上面密度为 $\\rho = 1$ 的均匀矩形薄片，到 $x$ 轴的距离是 $y$，所以 $I_x = \\int_0^W \\int_0^H y^2\\,dy\\,dx = \\frac{WH^3}{3}$。对 $[0, 4] \\times [0, 2]$，$I_x = \\frac{4 \\cdot 8}{3} = \\frac{32}{3}$。\n\n> **注意。** 转动惯量要把距离平方，所以 $H$ 是三次方，$\\frac{1}{3}$ 也要保留；$\\frac{WH^2}{2}$ 是一阶矩，$\\frac{HW^3}{3}$ 是关于另一条轴的转动惯量。",
      ),
      generate(rng: Rng): Problem {
        const W = rng.int(2, 8);
        const h = rng.int(1, 5);
        const H = 3 * h;
        const inner = 9 * h * h * h;
        const Ix = W * inner;
        return numberProblem({
          prompt: t(
            `Calculate the moment of inertia about the $x$-axis, $I_x = \\iint_D y^2\\,dA$, for the uniform rectangular lamina $D = [0, ${W}] \\times [0, ${H}]$ (with density $\\rho = 1$).`,
            `计算均匀矩形薄片 $D = [0, ${W}] \\times [0, ${H}]$（面密度 $\\rho = 1$）对 $x$ 轴的转动惯量 $I_x = \\iint_D y^2\\,dA$。`,
          ),
          answer: Ix,
          mistakes: distinct(Ix, [
            why(
              W * H * H * H,
              "That loses the $\\frac{1}{3}$ in $\\int_0^H y^2\\,dy = \\frac{H^3}{3}$.",
              "那是漏了 $\\int_0^H y^2\\,dy = \\frac{H^3}{3}$ 中的 $\\frac{1}{3}$。",
            ),
            why(
              Q.of(W * H * H, 2),
              "That is the first moment $\\iint y\\,dA$; the moment of inertia squares the distance.",
              "那是一阶矩 $\\iint y\\,dA$；转动惯量要把距离平方。",
            ),
            why(
              Q.of(H * W * W * W, 3),
              "That is $I_y$; the distance from the $x$-axis is $y$, not $x$.",
              "那是 $I_y$；到 $x$ 轴的距离是 $y$，不是 $x$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Integrate in y", "对 y 积分"],
                t(
                  `$\\int_0^{${H}} y^2\\,dy = \\frac{${H * H * H}}{3} = ${inner}$.`,
                  `$\\int_0^{${H}} y^2\\,dy = \\frac{${H * H * H}}{3} = ${inner}$。`,
                ),
              ],
              [
                ["Integrate in x", "对 x 积分"],
                t(
                  `$I_x = \\int_0^{${W}} ${inner}\\,dx = ${inner} \\cdot ${W} = ${Ix}$.`,
                  `$I_x = \\int_0^{${W}} ${inner}\\,dx = ${inner} \\cdot ${W} = ${Ix}$。`,
                ),
              ],
            ],
            t(
              `With mass $M = ${W * H}$, the rule $\\frac{MH^2}{3}$ for a side on the axis gives $\\frac{${W * H} \\cdot ${H * H}}{3} = ${Ix}$.`,
              `质量 $M = ${W * H}$，一边在轴上的规则 $\\frac{MH^2}{3}$ 给出 $\\frac{${W * H} \\cdot ${H * H}}{3} = ${Ix}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-polar-moment-of-inertia",
      figure: multivariableDrawings8["moments-of-inertia-of-laminas-about-the-coordinate-axes#the-polar-moment-of-inertia"],
      title: t("The polar moment of inertia", "极转动惯量"),
      explanation: t(
        "The moment of inertia about the origin, for rotation in the plane of the lamina, is $I_0 = \\iint_D (x^2 + y^2)\\rho\\,dA$. Since $x^2 + y^2$ splits into two pieces, it is the sum of the moments about the two axes:\n\n$$I_0 = I_x + I_y.$$\n\nFor a uniform rectangle $[0, W] \\times [0, H]$ of density $\\rho$, $I_x = \\frac{\\rho WH^3}{3}$ and $I_y = \\frac{\\rho W^3H}{3}$. For $[0, 6] \\times [0, 3]$ with $\\rho = 2$, $I_x = 108$ and $I_y = 432$, so $I_0 = 540$; as a check, $\\frac{M(W^2 + H^2)}{3} = \\frac{36 \\cdot 45}{3} = 540$.\n\n> **Watch out.** Add both moments; and the $\\frac{1}{12}$ formula is for an axis through the center, not through the corner at the origin.",
        "关于原点、在薄板所在平面内转动的转动惯量为 $I_0 = \\iint_D (x^2 + y^2)\\rho\\,dA$。由于 $x^2 + y^2$ 分成两部分，它是关于两轴转动惯量之和：\n\n$$I_0 = I_x + I_y$$\n\n对密度为 $\\rho$ 的均匀矩形 $[0, W] \\times [0, H]$，$I_x = \\frac{\\rho WH^3}{3}$，$I_y = \\frac{\\rho W^3H}{3}$。对 $\\rho = 2$ 的 $[0, 6] \\times [0, 3]$，$I_x = 108$，$I_y = 432$，所以 $I_0 = 540$；检验：$\\frac{M(W^2 + H^2)}{3} = \\frac{36 \\cdot 45}{3} = 540$。\n\n> **注意。** 两个转动惯量都要加上；$\\frac{1}{12}$ 的公式对应通过中心的轴，而不是通过原点处顶点的轴。",
      ),
      generate(rng: Rng): Problem {
        const W = rng.int(1, 5);
        let H = rng.int(1, 5);
        if (H === W) H += 1;
        const rho = rng.int(1, 4);
        const Ix = Q.of(rho * W * H ** 3, 3);
        const Iy = Q.of(rho * W ** 3 * H, 3);
        const ans = Ix.add(Iy);
        const M = rho * W * H;
        return numberProblem({
          prompt: t(
            `Find the polar moment of inertia $I_0$ of the rectangle $[0, ${W}] \\times [0, ${H}]$ with constant density $\\rho = ${rho}$.`,
            `求常密度 $\\rho = ${rho}$ 的矩形 $[0, ${W}] \\times [0, ${H}]$ 的极转动惯量 $I_0$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(Ix, "That is only $I_x$; the polar moment adds $I_y$.", "那只是 $I_x$；极转动惯量还要加上 $I_y$。"),
            why(Iy, "That is only $I_y$; the polar moment adds $I_x$.", "那只是 $I_y$；极转动惯量还要加上 $I_x$。"),
            why(
              Q.of(M * (W * W + H * H), 12),
              "That is the moment about the center of the rectangle, not about the corner at the origin.",
              "那是关于矩形中心的转动惯量，不是关于原点处顶点的。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find I_x", "求 I_x"],
                t(`$I_x = \\frac{\\rho WH^3}{3} = ${Ix.toLatex()}$.`, `$I_x = \\frac{\\rho WH^3}{3} = ${Ix.toLatex()}$。`),
              ],
              [
                ["Find I_y", "求 I_y"],
                t(`$I_y = \\frac{\\rho W^3H}{3} = ${Iy.toLatex()}$.`, `$I_y = \\frac{\\rho W^3H}{3} = ${Iy.toLatex()}$。`),
              ],
              [["Add", "相加"], t(`$I_0 = I_x + I_y = ${ans.toLatex()}$.`, `$I_0 = I_x + I_y = ${ans.toLatex()}$。`)],
            ],
            t(
              `The mass is $M = ${M}$, and $\\frac{M(W^2 + H^2)}{3} = \\frac{${M} \\cdot ${W * W + H * H}}{3} = ${ans.toLatex()}$.`,
              `质量为 $M = ${M}$，而 $\\frac{M(W^2 + H^2)}{3} = \\frac{${M} \\cdot ${W * W + H * H}}{3} = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** momentsOfInertiaOfLaminasAboutOtherAxes computes inertia about arbitrary lines. */
export const momentsOfInertiaOfLaminasAboutOtherAxes: TopicDef = {
  id: "moments-of-inertia-of-laminas-about-other-axes",
  title: t("Moments of Inertia of Laminas About Other Axes", "薄片对任意轴的转动惯量"),
  summary: t(
    "The moment of inertia about any axis $L$ is $I_L = \\iint d(x, y)^2\\rho\\,dA$, where $d(x, y)$ is the perpendicular distance from $(x, y)$ to $L$.",
    "对任意轴 $L$ 的转动惯量为 $I_L = \\iint d(x, y)^2\\rho\\,dA$，其中 $d(x, y)$ 为点 $(x, y)$ 到 $L$ 的垂直距离。",
  ),
  intro: t(
    "Find the moment of inertia of the uniform plate $[0, 1] \\times [0, 3]$ about the line $x = -2$. A point at $x$ is at distance $x + 2$, so $I = 3\\int_0^1 (x + 2)^2\\,dx = 3 \\cdot \\frac{27 - 8}{3} = 19$.\n\nCheck: about its own center line $x = \\frac{1}{2}$ the plate has $\\frac{MW^2}{12} = \\frac{1}{4}$, and adding $Md^2 = 3 \\cdot \\frac{25}{4}$ gives $\\frac{76}{4} = 19$.\n\nIn this lesson we find moments of inertia about lines other than the coordinate axes by integrating the squared distance to the line.",
    "求均匀薄板 $[0, 1] \\times [0, 3]$ 关于直线 $x = -2$ 的转动惯量。位于 $x$ 的点到它的距离为 $x + 2$，所以 $I = 3\\int_0^1 (x + 2)^2\\,dx = 3 \\cdot \\frac{27 - 8}{3} = 19$。\n\n检验：关于自身中线 $x = \\frac{1}{2}$，薄板的转动惯量为 $\\frac{MW^2}{12} = \\frac{1}{4}$，加上 $Md^2 = 3 \\cdot \\frac{25}{4}$ 得 $\\frac{76}{4} = 19$。\n\n本课我们对到直线距离的平方积分，求关于坐标轴以外直线的转动惯量。",
  ),
  prerequisites: ["moments-of-inertia-of-laminas-about-the-coordinate-axes"],
  encompasses: [
    {
      topic: "moments-of-inertia-of-laminas-about-the-coordinate-axes",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-moments-of-inertia-about-shifted-axes",
      figure: multivariableDrawings8["moments-of-inertia-of-laminas-about-other-axes#evaluating-moments-of-inertia-about-shifted-axes"],
      title: t("Evaluating moments of inertia about shifted axes", "计算对平移轴或端点轴的转动惯量"),
      explanation: t(
        "For a uniform thin rod of mass $M$ and length $L$, the linear density is $\\frac{M}{L}$, and the moment of inertia about an axis through one end perpendicular to the rod is $I_{\\text{end}} = \\int_0^L \\frac{M}{L} x^2\\,dx = \\frac{ML^2}{3}$. For $M = 9$ and $L = 4$, $I_{\\text{end}} = \\frac{9 \\cdot 16}{3} = 48$. About the middle the distances are shorter and $I = \\frac{ML^2}{12} = 12$; adding $M\\left(\\frac{L}{2}\\right)^2 = 36$ gives $48$ again.\n\n> **Watch out.** About an end the factor is $\\frac{1}{3}$; $\\frac{1}{12}$ is for the middle, and $ML^2$ would put all the mass at the far end.",
        "对于质量为 $M$、长度为 $L$ 的均匀细棒，线密度为 $\\frac{M}{L}$，绕通过其一端且垂直于棒的轴的转动惯量为 $I_{\\text{end}} = \\int_0^L \\frac{M}{L} x^2\\,dx = \\frac{ML^2}{3}$。对 $M = 9$、$L = 4$，$I_{\\text{end}} = \\frac{9 \\cdot 16}{3} = 48$。绕中点时距离更短，$I = \\frac{ML^2}{12} = 12$；加上 $M\\left(\\frac{L}{2}\\right)^2 = 36$ 又得 $48$。\n\n> **注意。** 绕端点的系数是 $\\frac{1}{3}$；$\\frac{1}{12}$ 对应中点，而 $ML^2$ 相当于把全部质量放在远端。",
      ),
      generate(rng: Rng): Problem {
        const M = rng.int(2, 7);
        const ell = rng.int(1, 5);
        const L = 6 * ell;
        const Iend = 12 * M * ell * ell;
        const lambda = Q.of(M, L);
        return numberProblem({
          prompt: t(
            `Find the moment of inertia $I$ of a uniform thin rod of mass $M = ${M}$ kg and length $L = ${L}$ m about an axis passing through one of its endpoints perpendicular to the rod.`,
            `一均匀细棒质量为 $M = ${M}$ kg，长度为 $L = ${L}$ m。求该细棒绕通过其一端且垂直于棒的转轴的转动惯量 $I$（单位：kg·m$^2$）。`,
          ),
          answer: Iend,
          mistakes: distinct(Iend, [
            why(
              M * L * L,
              "That leaves out the $\\frac{1}{3}$; it puts all the mass at the far end.",
              "那是漏了 $\\frac{1}{3}$；相当于把全部质量放在远端。",
            ),
            why(
              M * 3 * ell * ell,
              "That is $\\frac{ML^2}{12}$, the moment about the middle of the rod, not about an end.",
              "那是 $\\frac{ML^2}{12}$，绕杆中点的转动惯量，不是绕端点的。",
            ),
            why(
              (M * L * L) / 2,
              "That integrates $x$ instead of $x^2$; the moment of inertia squares the distance.",
              "那是积分了 $x$ 而不是 $x^2$；转动惯量要把距离平方。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the density", "求线密度"],
                t(`$\\lambda = \\frac{M}{L} = ${lambda.toLatex()}$ kg/m.`, `$\\lambda = \\frac{M}{L} = ${lambda.toLatex()}$ kg/m。`),
              ],
              [
                ["Integrate", "积分"],
                t(
                  `$I = \\int_0^{${L}} \\lambda x^2\\,dx = \\frac{\\lambda L^3}{3} = \\frac{ML^2}{3} = \\frac{${M} \\cdot ${L * L}}{3} = ${Iend}$ kg·m$^2$.`,
                  `$I = \\int_0^{${L}} \\lambda x^2\\,dx = \\frac{\\lambda L^3}{3} = \\frac{ML^2}{3} = \\frac{${M} \\cdot ${L * L}}{3} = ${Iend}$ kg·m$^2$。`,
                ),
              ],
            ],
            t(
              `About the middle, $\\frac{ML^2}{12} = ${3 * M * ell * ell}$, and adding $M\\left(\\frac{L}{2}\\right)^2 = ${9 * M * ell * ell}$ gives $${Iend}$.`,
              `绕中点时 $\\frac{ML^2}{12} = ${3 * M * ell * ell}$，加上 $M\\left(\\frac{L}{2}\\right)^2 = ${9 * M * ell * ell}$ 得 $${Iend}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "moment-of-inertia-about-a-line-outside-the-lamina",
      figure: multivariableDrawings8["moments-of-inertia-of-laminas-about-other-axes#moment-of-inertia-about-a-line-outside-the-lamina"],
      title: t("Moment of inertia about a line outside the lamina", "关于薄板外直线的转动惯量"),
      explanation: t(
        "The moment of inertia about any line integrates the squared distance to that line. For the horizontal line $y = -d$, a point at height $y$ is at distance $y + d$, so for a uniform rectangle $[0, W] \\times [0, H]$\n\n$$I = \\int_0^W \\int_0^H (y + d)^2\\,dy\\,dx = \\frac{W\\left[(H + d)^3 - d^3\\right]}{3}.$$\n\nThe substitution $u = y + d$ makes the inner integral immediate. For $[0, 2] \\times [0, 3]$ about $y = -5$, $I = \\frac{2(512 - 125)}{3} = 258$.\n\n> **Watch out.** The distance is $y + d$, not $y$; after substituting $u = y + d$ the lower limit is $d$, so subtract $d^3$.",
        "关于任意直线的转动惯量是对到该直线距离的平方积分。对水平线 $y = -d$，高度为 $y$ 的点到它的距离为 $y + d$，所以对均匀矩形 $[0, W] \\times [0, H]$\n\n$$I = \\int_0^W \\int_0^H (y + d)^2\\,dy\\,dx = \\frac{W\\left[(H + d)^3 - d^3\\right]}{3}$$\n\n代换 $u = y + d$ 使内层积分一步可得。对 $[0, 2] \\times [0, 3]$ 关于 $y = -5$，$I = \\frac{2(512 - 125)}{3} = 258$。\n\n> **注意。** 距离是 $y + d$ 而不是 $y$；代换 $u = y + d$ 后下限是 $d$，所以要减去 $d^3$。",
      ),
      generate(rng: Rng): Problem {
        const W = rng.int(1, 5);
        const H = rng.int(1, 4);
        const d = rng.int(1, 4);
        const ans = Q.of(W * ((H + d) ** 3 - d ** 3), 3);
        const inner = Q.of((H + d) ** 3 - d ** 3, 3);
        const own = Q.of(W * H * H * H, 12);
        const shift = Q.of(W * H * (H + 2 * d) ** 2, 4);
        return numberProblem({
          prompt: t(
            `Find the moment of inertia of the uniform lamina $[0, ${W}] \\times [0, ${H}]$ (density $1$) about the line $y = -${d}$.`,
            `求均匀薄板 $[0, ${W}] \\times [0, ${H}]$（密度为 $1$）关于直线 $y = -${d}$ 的转动惯量。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(W * H ** 3, 3),
              "That is the moment about the $x$-axis; the distance to $y = -d$ is $y + d$.",
              "那是关于 $x$ 轴的转动惯量；到 $y = -d$ 的距离是 $y + d$。",
            ),
            why(
              Q.of(W * (H + d) ** 3, 3),
              "That forgets the lower limit; after substituting $u = y + d$, subtract $d^3$.",
              "那是忘了下限；代换 $u = y + d$ 后要减去 $d^3$。",
            ),
            why(
              Q.of(W * ((H - d) ** 3 + d ** 3), 3),
              "That uses the distance $y - d$, which is to the line $y = d$.",
              "那是用了距离 $y - d$，那是到直线 $y = d$ 的距离。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Write the distance", "写出距离"],
                t(
                  `A point at height $y$ is at distance $y + ${d}$ from $y = -${d}$.`,
                  `高度为 $y$ 的点到 $y = -${d}$ 的距离为 $y + ${d}$。`,
                ),
              ],
              [
                ["Integrate in y", "对 y 积分"],
                t(
                  `$\\int_0^{${H}} (y + ${d})^2\\,dy = \\frac{${H + d}^3 - ${d}^3}{3} = ${inner.toLatex()}$.`,
                  `$\\int_0^{${H}} (y + ${d})^2\\,dy = \\frac{${H + d}^3 - ${d}^3}{3} = ${inner.toLatex()}$。`,
                ),
              ],
              [
                ["Integrate in x", "对 x 积分"],
                t(`Multiplying by the width $${W}$ gives $I = ${ans.toLatex()}$.`, `乘以宽度 $${W}$ 得 $I = ${ans.toLatex()}$。`),
              ],
            ],
            t(
              `By the parallel axis theorem, the moment about the center line is $\\frac{WH^3}{12} = ${own.toLatex()}$, and adding $WH\\left(\\frac{H}{2} + ${d}\\right)^2 = ${shift.toLatex()}$ gives $${ans.toLatex()}$.`,
              `由平行轴定理，关于中线的转动惯量为 $\\frac{WH^3}{12} = ${own.toLatex()}$，加上 $WH\\left(\\frac{H}{2} + ${d}\\right)^2 = ${shift.toLatex()}$ 得 $${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** calculatingTheRadiusOfGyrationOfAPlaneLamina defines k_bar^2 = I / M. */
export const calculatingTheRadiusOfGyrationOfAPlaneLamina: TopicDef = {
  id: "calculating-the-radius-of-gyration-of-a-plane-lamina",
  title: t("Calculating the Radius of Gyration of a Plane Lamina", "计算平面薄片的回转半径"),
  summary: t(
    "The radius of gyration $\\bar{k}$ is the distance at which the whole mass could be concentrated with the same moment of inertia: $I = M\\bar{k}^2$.",
    "回转半径 $\\bar{k}$ 是把全部质量集中于一点而转动惯量不变时该点的距离：$I = M\\bar{k}^2$。",
  ),
  intro: t(
    "Find the radius of gyration about the $y$-axis of the uniform plate $[0, 4] \\times [0, 5]$. Here $I_y = \\int_0^5\\int_0^4 x^2\\,dx\\,dy = \\frac{320}{3}$ and $M = 20$, so $\\bar{k}_y^2 = \\frac{320}{3 \\cdot 20} = \\frac{16}{3}$ and $\\bar{k}_y = \\frac{4}{\\sqrt{3}} \\approx 2.31$.\n\nCheck: $\\bar{k}_y$ is more than the distance $2$ to the center, because squaring weights the far side more, and less than the width $4$.\n\nIn this lesson we find the radius of gyration, the distance at which all the mass would give the same moment of inertia, for plates and rods.",
    "求均匀薄板 $[0, 4] \\times [0, 5]$ 关于 $y$ 轴的回转半径。这里 $I_y = \\int_0^5\\int_0^4 x^2\\,dx\\,dy = \\frac{320}{3}$，$M = 20$，所以 $\\bar{k}_y^2 = \\frac{320}{3 \\cdot 20} = \\frac{16}{3}$，$\\bar{k}_y = \\frac{4}{\\sqrt{3}} \\approx 2.31$。\n\n检验：$\\bar{k}_y$ 大于到中心的距离 $2$，因为平方使远侧的权重更大；又小于宽度 $4$。\n\n本课我们求薄板和细杆的回转半径，即把全部质量放在该距离处时转动惯量不变的那个距离。",
  ),
  prerequisites: ["moments-of-inertia-of-laminas-about-the-coordinate-axes"],
  encompasses: [
    {
      topic: "moments-of-inertia-of-laminas-about-the-coordinate-axes",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "determining-the-squared-radius-of-gyration",
      figure: multivariableDrawings8["calculating-the-radius-of-gyration-of-a-plane-lamina#determining-the-squared-radius-of-gyration"],
      title: t("Determining the squared radius of gyration", "确定回转半径的平方值"),
      explanation: t(
        "The squared radius of gyration is the moment of inertia per unit mass, $\\bar{k}^2 = \\frac{I}{M}$. For a uniform rectangular lamina of height $H$ rotated about its base on the $x$-axis, $I_x = \\frac{MH^2}{3}$, so $\\bar{k}_x^2 = \\frac{H^2}{3}$, whatever the width. For $[0, 7] \\times [0, 5]$, $I_x = \\frac{7 \\cdot 125}{3}$ and $M = 35$, so $\\bar{k}_x^2 = \\frac{25}{3}$.\n\n> **Watch out.** Divide the moment of inertia by the mass; $\\bar{k}$ is not the distance $\\frac{H}{2}$ to the center, and $\\frac{H^2}{12}$ belongs to the axis through the center, not the base.",
        "回转半径的平方是单位质量的转动惯量 $\\bar{k}^2 = \\frac{I}{M}$。对高为 $H$、绕位于 $x$ 轴上的底边旋转的均匀矩形薄片，$I_x = \\frac{MH^2}{3}$，所以 $\\bar{k}_x^2 = \\frac{H^2}{3}$，与宽度无关。对 $[0, 7] \\times [0, 5]$，$I_x = \\frac{7 \\cdot 125}{3}$，$M = 35$，所以 $\\bar{k}_x^2 = \\frac{25}{3}$。\n\n> **注意。** 要用转动惯量除以质量；$\\bar{k}$ 不是到中心的距离 $\\frac{H}{2}$，而 $\\frac{H^2}{12}$ 对应过中心的轴，不是底边。",
      ),
      generate(rng: Rng): Problem {
        const W = rng.int(2, 9);
        const h = rng.int(1, 8);
        const H = 3 * h;
        const ans = 3 * h * h;
        const Ix = W * 9 * h * h * h;
        const M = W * H;
        return numberProblem({
          prompt: t(
            `Find the squared radius of gyration $\\bar{k}_x^2$ about the $x$-axis for the uniform rectangular lamina occupying $D = [0, ${W}] \\times [0, ${H}]$.`,
            `求占据矩形区域 $D = [0, ${W}] \\times [0, ${H}]$ 的均匀矩形薄片绕 $x$ 轴的回转半径平方 $\\bar{k}_x^2$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              H * H,
              "That loses the $\\frac{1}{3}$ in $I_x = \\frac{MH^2}{3}$.",
              "那是漏了 $I_x = \\frac{MH^2}{3}$ 中的 $\\frac{1}{3}$。",
            ),
            why(
              Q.of(H * H, 4),
              "That squares the distance $\\frac{H}{2}$ to the center; the radius of gyration weights the far parts more.",
              "那是把到中心的距离 $\\frac{H}{2}$ 平方；回转半径给远处更大的权重。",
            ),
            why(Ix, "That is the moment of inertia $I_x$; divide it by the mass.", "那是转动惯量 $I_x$；还要除以质量。"),
            why(
              Q.of(H * H, 12),
              "That is for the axis through the center; the $x$-axis runs along the base.",
              "那对应过中心的轴；$x$ 轴沿着底边。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the moment of inertia", "求转动惯量"],
                t(
                  `$I_x = \\frac{WH^3}{3} = \\frac{${W} \\cdot ${H ** 3}}{3} = ${Ix}$.`,
                  `$I_x = \\frac{WH^3}{3} = \\frac{${W} \\cdot ${H ** 3}}{3} = ${Ix}$。`,
                ),
              ],
              [["Find the mass", "求质量"], t(`$M = ${W} \\cdot ${H} = ${M}$.`, `$M = ${W} \\cdot ${H} = ${M}$。`)],
              [["Divide", "相除"], t(`$\\bar{k}_x^2 = \\frac{${Ix}}{${M}} = ${ans}$.`, `$\\bar{k}_x^2 = \\frac{${Ix}}{${M}} = ${ans}$。`)],
            ],
            t(
              `$\\bar{k}_x = \\sqrt{${ans}} \\approx ${Math.sqrt(ans).toFixed(2)}$ lies between the middle height $${Q.of(H, 2).toLatex()}$ and the top $${H}$, as it should.`,
              `$\\bar{k}_x = \\sqrt{${ans}} \\approx ${Math.sqrt(ans).toFixed(2)}$ 介于中间高度 $${Q.of(H, 2).toLatex()}$ 与顶边 $${H}$ 之间，理应如此。`,
            ),
          ),
        });
      },
    },
    {
      id: "radius-of-gyration-of-a-rod-with-power-density",
      title: t("Radius of gyration with a power-law density", "幂律密度下的回转半径"),
      explanation: t(
        "The radius of gyration $k$ is the distance at which the whole mass, concentrated at one point, would give the same moment of inertia: $k^2 = \\frac{I}{m}$. For a rod on $[0, L]$ with density $\\lambda = cx^n$, about the end at the origin,\n\n$$m = \\frac{cL^{n+1}}{n+1}, \\qquad I = \\frac{cL^{n+3}}{n+3}, \\qquad k^2 = \\frac{n+1}{n+3}L^2.$$\n\nThe constant $c$ cancels, and more mass toward the far end makes $k$ closer to $L$. For $\\lambda = x^5$ on $[0, 2]$, $m = \\frac{32}{3}$ and $I = \\frac{256}{8} = 32$, so $k^2 = 3 = \\frac{6}{8} \\cdot 4$.\n\n> **Watch out.** The moment of inertia raises the power by three, not two; $\\frac{L^2}{3}$ is only for a uniform rod, and the constant $c$ cancels.",
        "回转半径 $k$ 是把全部质量集中在一点时、给出相同转动惯量的距离：$k^2 = \\frac{I}{m}$。对 $[0, L]$ 上密度 $\\lambda = cx^n$ 的细杆，关于原点处的端点，\n\n$$m = \\frac{cL^{n+1}}{n+1}, \\qquad I = \\frac{cL^{n+3}}{n+3}, \\qquad k^2 = \\frac{n+1}{n+3}L^2$$\n\n常数 $c$ 约去，质量越集中在远端，$k$ 越接近 $L$。对 $[0, 2]$ 上的 $\\lambda = x^5$，$m = \\frac{32}{3}$，$I = \\frac{256}{8} = 32$，所以 $k^2 = 3 = \\frac{6}{8} \\cdot 4$。\n\n> **注意。** 转动惯量的幂次要加三而不是加二；$\\frac{L^2}{3}$ 只适用于均匀细杆，常数 $c$ 会约去。",
      ),
      generate(rng: Rng): Problem {
        const n = rng.int(0, 4);
        const L = rng.int(1, 6);
        const c = rng.int(1, 5);
        const ans = Q.of((n + 1) * L * L, n + 3);
        const dens = n === 0 ? `${c}` : `${c === 1 ? "" : c}x${n === 1 ? "" : `^${n}`}`;
        const m = Q.of(c * L ** (n + 1), n + 1);
        const I = Q.of(c * L ** (n + 3), n + 3);
        return numberProblem({
          prompt: t(
            `A rod on $[0, ${L}]$ has linear density $\\lambda(x) = ${dens}$. Find the square of its radius of gyration $k^2$ about the end at $x = 0$.`,
            `$[0, ${L}]$ 上的细杆线密度为 $\\lambda(x) = ${dens}$。求它关于 $x = 0$ 处端点的回转半径的平方 $k^2$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(L * L, 3),
              "That is the value for a uniform rod; a density growing along the rod pushes $k$ toward the far end.",
              "那是均匀细杆的值；沿杆增大的密度会把 $k$ 推向远端。",
            ),
            why(
              Q.of((n + 1) * L * L, n + 2),
              "That raises the power by two for the moment of inertia; $\\int x^2 \\cdot x^n\\,dx$ raises it by three.",
              "那是转动惯量的幂次只加了二；$\\int x^2 \\cdot x^n\\,dx$ 要加三。",
            ),
            why(
              Q.of(c * (n + 1) * L * L, n + 3),
              "That keeps the constant $c$; it cancels between $I$ and $m$.",
              "那是保留了常数 $c$；它在 $I$ 与 $m$ 之间约去了。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the mass", "求质量"],
                t(`$m = \\int_0^{${L}} ${dens}\\,dx = ${m.toLatex()}$.`, `$m = \\int_0^{${L}} ${dens}\\,dx = ${m.toLatex()}$。`),
              ],
              [
                ["Find the moment of inertia", "求转动惯量"],
                t(
                  `$I = \\int_0^{${L}} x^2 \\cdot ${dens}\\,dx = ${I.toLatex()}$.`,
                  `$I = \\int_0^{${L}} x^2 \\cdot ${dens}\\,dx = ${I.toLatex()}$。`,
                ),
              ],
              [["Divide", "相除"], t(`$k^2 = \\frac{I}{m} = ${ans.toLatex()}$.`, `$k^2 = \\frac{I}{m} = ${ans.toLatex()}$。`)],
            ],
            t(
              `$k^2 = \\frac{${n + 1}}{${n + 3}}L^2$ lies between $\\frac{L^2}{3}$ and $L^2 = ${L * L}$: no less than for a uniform rod, and less than if all the mass sat at the far end.`,
              `$k^2 = \\frac{${n + 1}}{${n + 3}}L^2$ 介于 $\\frac{L^2}{3}$ 与 $L^2 = ${L * L}$ 之间：不小于均匀细杆的值，又小于全部质量都在远端时的值。`,
            ),
          ),
        });
      },
    },
  ],
};

/** theParallelAxisTheorem relates inertia about parallel axes: I = I_cm + M d^2. */
export const theParallelAxisTheorem: TopicDef = {
  id: "the-parallel-axis-theorem",
  title: t("The Parallel Axis Theorem", "平行轴定理"),
  summary: t(
    "The parallel axis theorem relates the moment of inertia about any axis to that about the parallel axis through the center of mass: $I = I_{\\text{cm}} + Md^2$.",
    "平行轴定理指出，绕任意轴的转动惯量与绕过质心的平行轴的转动惯量满足 $I = I_{\\text{cm}} + Md^2$。",
  ),
  intro: t(
    "A uniform rod of mass $3$ and length $4$ has $I_{\\text{cm}} = \\frac{ML^2}{12} = 4$ about its middle. About an end, at distance $d = 2$, the theorem gives $I = 4 + 3 \\cdot 2^2 = 16$.\n\nCheck: integrating directly about the end gives $\\frac{ML^2}{3} = \\frac{3 \\cdot 16}{3} = 16$.\n\nIn this lesson we move a moment of inertia from the axis through the center of mass to any parallel axis, and between two parallel axes.",
    "质量为 $3$、长为 $4$ 的均匀细杆，关于中点有 $I_{\\text{cm}} = \\frac{ML^2}{12} = 4$。关于端点，距离为 $d = 2$，定理给出 $I = 4 + 3 \\cdot 2^2 = 16$。\n\n检验：直接关于端点积分得 $\\frac{ML^2}{3} = \\frac{3 \\cdot 16}{3} = 16$。\n\n本课我们把转动惯量从过质心的轴移到任一平行轴，以及在两条平行轴之间换算。",
  ),
  prerequisites: ["moments-of-inertia-of-laminas-about-other-axes"],
  encompasses: [
    {
      topic: "moments-of-inertia-of-laminas-about-other-axes",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "applying-the-parallel-axis-theorem",
      figure: multivariableDrawings8["the-parallel-axis-theorem#applying-the-parallel-axis-theorem"],
      title: t("Applying the Parallel Axis Theorem", "应用平行轴定理计算转动惯量"),
      explanation: t(
        "The Parallel Axis Theorem states $I = I_{\\text{cm}} + M d^2$ where $I_{\\text{cm}}$ is the moment of inertia about an axis through the center of mass, $M$ is total mass, and $d$ is the distance between the two parallel axes. For $M = 10$, $I_{\\text{cm}} = 5$ and $d = 3$, $I = 5 + 10 \\cdot 9 = 95$. The axis through the center of mass has the smallest moment of all the parallel axes.\n\n> **Watch out.** Square the distance and multiply it by the mass, then add $I_{\\text{cm}}$; leaving out any one of these gives the wrong moment.",
        "平行轴定理表述为 $I = I_{\\text{cm}} + M d^2$，其中 $I_{\\text{cm}}$ 为通过质心的轴的转动惯量，$M$ 为总质量，$d$ 为两平行轴之间的垂直距离。对 $M = 10$、$I_{\\text{cm}} = 5$、$d = 3$，$I = 5 + 10 \\cdot 9 = 95$。在所有平行轴中，过质心的轴转动惯量最小。\n\n> **注意。** 要把距离平方再乘以质量，然后加上 $I_{\\text{cm}}$；漏掉任何一步都会得到错误的转动惯量。",
      ),
      generate(rng: Rng): Problem {
        const Icm = rng.int(10, 50);
        const M = rng.int(2, 9);
        const d = rng.int(2, 7);
        const shift = M * d * d;
        const ans = Icm + shift;
        return numberProblem({
          prompt: t(
            `A rigid body of mass $M = ${M}$ kg has moment of inertia $I_{\\text{cm}} = ${Icm}$ kg·m$^2$ about an axis passing through its center of mass. Using the Parallel Axis Theorem, find the moment of inertia $I$ about a parallel axis located at distance $d = ${d}$ m.`,
            `一质量为 $M = ${M}$ kg 的刚体绕通过其质心的转轴的转动惯量为 $I_{\\text{cm}} = ${Icm}$ kg·m$^2$。利用平行轴定理，求该刚体绕与该轴距离为 $d = ${d}$ m 的平行转轴的转动惯量 $I$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(Icm + M * d, "That forgets to square the distance; the shift is $Md^2$.", "那是忘了把距离平方；平移项是 $Md^2$。"),
            why(Icm + d * d, "That leaves out the mass in $Md^2$.", "那是漏掉了 $Md^2$ 中的质量。"),
            why(
              shift,
              "That leaves out $I_{\\text{cm}}$; the shift is added to the moment about the center.",
              "那是漏掉了 $I_{\\text{cm}}$；平移项要加到关于质心的转动惯量上。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the shift", "求平移项"],
                t(`$Md^2 = ${M} \\cdot ${d * d} = ${shift}$.`, `$Md^2 = ${M} \\cdot ${d * d} = ${shift}$。`),
              ],
              [["Add", "相加"], t(`$I = ${Icm} + ${shift} = ${ans}$ kg·m$^2$.`, `$I = ${Icm} + ${shift} = ${ans}$ kg·m$^2$。`)],
            ],
            t(
              `$${ans}$ is larger than $I_{\\text{cm}} = ${Icm}$, as it must be, and taking away $Md^2 = ${shift}$ gives back $${Icm}$.`,
              `$${ans}$ 大于 $I_{\\text{cm}} = ${Icm}$，理应如此；减去 $Md^2 = ${shift}$ 又得回 $${Icm}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "moving-between-two-parallel-axes",
      figure: multivariableDrawings8["the-parallel-axis-theorem#moving-between-two-parallel-axes"],
      title: t("Moving between two axes that miss the center of mass", "在两条不过质心的平行轴之间换算"),
      explanation: t(
        "The parallel axis theorem $I = I_{\\text{cm}} + Md^2$ always goes through the center of mass. To move from one off-center axis at distance $d_1$ to another at distance $d_2$, first go back to the center of mass and then out again:\n\n$$I_2 = I_1 - Md_1^2 + Md_2^2.$$\n\nFor $M = 8$ with $I_1 = 50$ at $d_1 = 2$, $I_{\\text{cm}} = 50 - 32 = 18$, and at $d_2 = 3$, $I_2 = 18 + 72 = 90$.\n\n> **Watch out.** Adding $M(d_2 - d_1)^2$ directly is a common mistake; it is only right when $d_1 = 0$. Subtract $Md_1^2$ before adding $Md_2^2$.",
        "平行轴定理 $I = I_{\\text{cm}} + Md^2$ 总是经过质心。从距质心 $d_1$ 的一条轴换到距质心 $d_2$ 的另一条轴，要先回到质心再移出去：\n\n$$I_2 = I_1 - Md_1^2 + Md_2^2$$\n\n对 $M = 8$，$I_1 = 50$、$d_1 = 2$ 时，$I_{\\text{cm}} = 50 - 32 = 18$；在 $d_2 = 3$ 处，$I_2 = 18 + 72 = 90$。\n\n> **注意。** 直接加上 $M(d_2 - d_1)^2$ 是常见错误，只有当 $d_1 = 0$ 时才对。要先减去 $Md_1^2$，再加上 $Md_2^2$。",
      ),
      generate(rng: Rng): Problem {
        const M = rng.int(1, 6);
        const Icm = rng.int(2, 20);
        const d1 = rng.int(1, 3);
        let d2 = rng.int(1, 5);
        if (d2 === d1) d2 += 1;
        const I1 = Icm + M * d1 * d1;
        const ans = Icm + M * d2 * d2;
        return numberProblem({
          prompt: t(
            `A body of mass $${M}$ kg has moment of inertia $${I1}$ kg·m² about an axis $${d1}$ m from its center of mass. Find its moment of inertia about a parallel axis $${d2}$ m from the center of mass.`,
            `质量为 $${M}$ kg 的物体关于距质心 $${d1}$ m 的轴的转动惯量为 $${I1}$ kg·m²。求它关于距质心 $${d2}$ m 的平行轴的转动惯量。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              I1 + M * (d2 - d1) ** 2,
              "That adds $M(d_2 - d_1)^2$ directly; the theorem has to go through the center of mass.",
              "那是直接加上 $M(d_2 - d_1)^2$；定理必须经过质心。",
            ),
            why(I1 + M * d2 * d2, "That adds $Md_2^2$ without first taking away $Md_1^2$.", "那是没有先减去 $Md_1^2$ 就加上了 $Md_2^2$。"),
            why(Icm, "That is the moment about the center of mass; move out to the new axis.", "那是关于质心的转动惯量；还要移到新轴。"),
          ]),
          solution: walked(
            [
              [
                ["Go back to the center", "回到质心"],
                t(
                  `$Md_1^2 = ${M * d1 * d1}$, so $I_{\\text{cm}} = ${I1} - ${M * d1 * d1} = ${Icm}$.`,
                  `$Md_1^2 = ${M * d1 * d1}$，所以 $I_{\\text{cm}} = ${I1} - ${M * d1 * d1} = ${Icm}$。`,
                ),
              ],
              [
                ["Move out again", "再移出去"],
                t(
                  `$Md_2^2 = ${M * d2 * d2}$, so $I_2 = ${Icm} + ${M * d2 * d2} = ${ans}$ kg·m².`,
                  `$Md_2^2 = ${M * d2 * d2}$，所以 $I_2 = ${Icm} + ${M * d2 * d2} = ${ans}$ kg·m²。`,
                ),
              ],
            ],
            t(
              `$I_2 - I_1 = ${ans - I1}$, which equals $M(d_2^2 - d_1^2) = ${M * (d2 * d2 - d1 * d1)}$.`,
              `$I_2 - I_1 = ${ans - I1}$，等于 $M(d_2^2 - d_1^2) = ${M * (d2 * d2 - d1 * d1)}$。`,
            ),
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 6.29 Random Variables
// ---------------------------------------------------------------------------

/** probabilityDensityFunctionsOfContinuousRandomVariables defines joint pdfs. */
export const probabilityDensityFunctionsOfContinuousRandomVariables: TopicDef = {
  id: "probability-density-functions-of-continuous-random-variables",
  title: t("Probability Density Functions of Continuous Random Variables", "连续型随机变量的概率密度函数"),
  summary: t(
    "A joint probability density function $f(x, y)$ satisfies $f(x, y) \\ge 0$ and $\\iint_{\\mathbb{R}^2} f(x, y)\\,dA = 1$.",
    "联合概率密度函数 $f(x, y)$ 满足 $f(x, y) \\ge 0$ 以及 $\\iint_{\\mathbb{R}^2} f(x, y)\\,dA = 1$。",
  ),
  intro: t(
    "Find $C$ so that $f(x, y) = Cx$ is a joint density on $[0, 2] \\times [0, 3]$. The integral of $x$ over the rectangle is $\\int_0^2 x\\,dx \\cdot 3 = 6$, so $6C = 1$ and $C = \\frac{1}{6}$.\n\nCheck: $f \\ge 0$ on the rectangle, and $\\int_0^3\\int_0^2 \\frac{x}{6}\\,dx\\,dy = \\frac{2}{6} \\cdot 3 = 1$.\n\nIn this lesson we use the two conditions on a joint density, that it is never negative and has total integral $1$, to find its unknown constant.",
    "求 $C$，使 $f(x, y) = Cx$ 是 $[0, 2] \\times [0, 3]$ 上的联合密度。$x$ 在矩形上的积分为 $\\int_0^2 x\\,dx \\cdot 3 = 6$，所以 $6C = 1$，$C = \\frac{1}{6}$。\n\n检验：在矩形上 $f \\ge 0$，且 $\\int_0^3\\int_0^2 \\frac{x}{6}\\,dx\\,dy = \\frac{2}{6} \\cdot 3 = 1$。\n\n本课我们利用联合密度的两个条件——处处非负、总积分为 $1$——求其中未知的常数。",
  ),
  prerequisites: ["double-integrals-over-rectangular-domains"],
  encompasses: [{ topic: "double-integrals-over-rectangular-domains", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "normalizing-multivariable-probability-density-functions",
      figure:
        multivariableDrawings8[
          "probability-density-functions-of-continuous-random-variables#normalizing-multivariable-probability-density-functions"
        ],
      title: t("Normalizing multivariable probability density functions", "多元概率密度函数的归一化条件与常数确定"),
      explanation: t(
        "A joint density must have total integral one over its support, so the constant is chosen to make the volume under the density equal to one. For a uniform joint density $f(x, y) = C$ supported on the rectangle $[0, a] \\times [0, b]$, normalization requires $\\iint_D C\\,dA = C(ab) = 1$, so $C = \\frac{1}{ab}$, or $1/C = ab$. On $[0, 10] \\times [0, 3]$, $1/C = 30$.\n\n> **Watch out.** The volume is $C$ times the area $ab$, not times the sum or the perimeter of the sides; and $\\frac{1}{ab}$ is $C$ itself, not $1/C$.",
        "联合密度在其支撑集上的总积分必须为 1，所以要选择常数使密度下方的体积等于 1。对于在矩形 $[0, a] \\times [0, b]$ 上均匀分布的联合概率密度 $f(x, y) = C$，由归一化条件 $\\iint_D C\\,dA = C(ab) = 1$，得 $C = \\frac{1}{ab}$，即常数倒数为 $1/C = ab$。在 $[0, 10] \\times [0, 3]$ 上，$1/C = 30$。\n\n> **注意。** 体积是 $C$ 乘以面积 $ab$，不是乘以两边之和或周长；$\\frac{1}{ab}$ 是 $C$ 本身，不是 $1/C$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const invC = a * b;
        return numberProblem({
          prompt: t(
            `A continuous two-dimensional random variable $(X, Y)$ is uniformly distributed over the rectangle $D = [0, ${a}] \\times [0, ${b}]$ with joint probability density function $f(x, y) = C$. Find the value of $1/C$.`,
            `二维连续型随机变量 $(X, Y)$ 在矩形区域 $D = [0, ${a}] \\times [0, ${b}]$ 上服从均匀分布，其联合概率密度函数为 $f(x, y) = C$。求常数倒数 $1/C$ 的值。`,
          ),
          answer: invC,
          mistakes: distinct(invC, [
            why(
              a + b,
              "That adds the sides; the volume under $f$ is $C$ times the area $ab$.",
              "那是把两边相加；$f$ 下方的体积是 $C$ 乘以面积 $ab$。",
            ),
            why(2 * (a + b), "That is the perimeter; the integral uses the area.", "那是周长；积分用的是面积。"),
            why(Q.of(1, invC), "That is $C$ itself; the question asks for $1/C$.", "那是 $C$ 本身；题目求的是 $1/C$。"),
          ]),
          solution: walked(
            [
              [["Set the total to one", "令总概率为一"], t("$\\iint_D f(x, y)\\,dA = 1$.", "$\\iint_D f(x, y)\\,dA = 1$。")],
              [
                ["Integrate the constant", "对常数积分"],
                t(
                  `$\\iint_D C\\,dA = C \\cdot ${a} \\cdot ${b} = ${invC}C$.`,
                  `$\\iint_D C\\,dA = C \\cdot ${a} \\cdot ${b} = ${invC}C$。`,
                ),
              ],
              [["Solve", "求解"], t(`$${invC}C = 1$, so $1/C = ${invC}$.`, `$${invC}C = 1$，所以 $1/C = ${invC}$。`)],
            ],
            t(
              `With $C = \\frac{1}{${invC}}$, the density is positive and its volume over the rectangle is $\\frac{1}{${invC}} \\cdot ${invC} = 1$.`,
              `取 $C = \\frac{1}{${invC}}$，密度为正，它在矩形上的体积为 $\\frac{1}{${invC}} \\cdot ${invC} = 1$。`,
            ),
          ),
        });
      },
    },
    {
      id: "normalizing-a-non-uniform-joint-density",
      figure:
        multivariableDrawings8["probability-density-functions-of-continuous-random-variables#normalizing-a-non-uniform-joint-density"],
      title: t("Normalizing a non-uniform joint density", "非均匀联合密度的归一化"),
      explanation: t(
        "A joint density must be nonnegative and integrate to $1$ over its domain. When it is given up to a constant, $f(x, y) = C\\,g(x, y)$, compute $\\iint_D g\\,dA$ and set $C = \\frac{1}{\\iint_D g\\,dA}$. For a product such as $g = xy$ on a rectangle the double integral factors: $\\int_0^a\\int_0^b xy\\,dy\\,dx = \\frac{a^2}{2} \\cdot \\frac{b^2}{2}$. On $[0, 6] \\times [0, 2]$ that is $18 \\cdot 2 = 36$, so $C = \\frac{1}{36}$.\n\n> **Watch out.** $C$ is the reciprocal of the integral of $g$, not the integral itself, and not $\\frac{1}{ab}$, which treats $g$ as $1$. A sum such as $x + y$ is integrated term by term; it does not factor.",
        "联合密度必须非负，且在定义域上积分为 $1$。若它只给到相差一个常数，$f(x, y) = C\\,g(x, y)$，就计算 $\\iint_D g\\,dA$ 并令 $C = \\frac{1}{\\iint_D g\\,dA}$。对矩形上的乘积 $g = xy$，二重积分可以分解：$\\int_0^a\\int_0^b xy\\,dy\\,dx = \\frac{a^2}{2} \\cdot \\frac{b^2}{2}$。在 $[0, 6] \\times [0, 2]$ 上它等于 $18 \\cdot 2 = 36$，所以 $C = \\frac{1}{36}$。\n\n> **注意。** $C$ 是 $g$ 的积分的倒数，不是积分本身，也不是把 $g$ 当成 $1$ 的 $\\frac{1}{ab}$。像 $x + y$ 这样的和要逐项积分，不能分解成乘积。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 5);
        const b = rng.int(1, 5);
        const sum = rng.int(0, 1) === 1;
        // ∫∫ (x + y) over [0,a]×[0,b] = (a^2 b + a b^2) / 2.
        const total = sum ? Q.of(a * a * b + a * b * b, 2) : Q.of(a * a * b * b, 4);
        const ans = Q.one.div(total);
        const g = sum ? "(x + y)" : "xy";
        return numberProblem({
          prompt: t(
            `$f(x, y) = C${g}$ is a joint density on $[0, ${a}] \\times [0, ${b}]$. Find $C$.`,
            `$f(x, y) = C${g}$ 是 $[0, ${a}] \\times [0, ${b}]$ 上的联合密度。求 $C$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              total,
              "That is the integral of the unnormalized function; $C$ is its reciprocal.",
              "那是未归一化函数的积分；$C$ 是它的倒数。",
            ),
            why(Q.of(1, a * b), "That divides by the area, as if the function were $1$.", "那是除以了面积，好像函数是 $1$。"),
            ...(sum
              ? [
                  why(
                    Q.of(1, a * a * b + a * b * b),
                    "That drops the $\\frac{1}{2}$ from $\\int x\\,dx$ and $\\int y\\,dy$.",
                    "那是丢掉了 $\\int x\\,dx$ 与 $\\int y\\,dy$ 中的 $\\frac{1}{2}$。",
                  ),
                  why(
                    Q.of(4, a * a * b * b),
                    "That treats $x + y$ as the product $xy$; a sum is integrated term by term.",
                    "那是把 $x + y$ 当成了乘积 $xy$；和要逐项积分。",
                  ),
                ]
              : [
                  why(
                    Q.of(2, a * a * b * b),
                    "That keeps only one of the two factors $\\frac{1}{2}$.",
                    "那是只保留了两个因子 $\\frac{1}{2}$ 中的一个。",
                  ),
                ]),
          ]),
          solution: walked(
            [
              sum
                ? [
                    ["Integrate term by term", "逐项积分"],
                    t(
                      `$\\iint x\\,dA = ${b} \\cdot \\frac{${a * a}}{2} = ${Q.of(a * a * b, 2).toLatex()}$ and $\\iint y\\,dA = ${a} \\cdot \\frac{${b * b}}{2} = ${Q.of(a * b * b, 2).toLatex()}$, so $\\iint (x + y)\\,dA = ${total.toLatex()}$.`,
                      `$\\iint x\\,dA = ${b} \\cdot \\frac{${a * a}}{2} = ${Q.of(a * a * b, 2).toLatex()}$，$\\iint y\\,dA = ${a} \\cdot \\frac{${b * b}}{2} = ${Q.of(a * b * b, 2).toLatex()}$，所以 $\\iint (x + y)\\,dA = ${total.toLatex()}$。`,
                    ),
                  ]
                : [
                    ["Factor the integral", "分解积分"],
                    t(
                      `$\\iint xy\\,dA = \\int_0^{${a}} x\\,dx \\cdot \\int_0^{${b}} y\\,dy = ${Q.of(a * a, 2).toLatex()} \\cdot ${Q.of(b * b, 2).toLatex()} = ${total.toLatex()}$.`,
                      `$\\iint xy\\,dA = \\int_0^{${a}} x\\,dx \\cdot \\int_0^{${b}} y\\,dy = ${Q.of(a * a, 2).toLatex()} \\cdot ${Q.of(b * b, 2).toLatex()} = ${total.toLatex()}$。`,
                    ),
                  ],
              [
                ["Take the reciprocal", "取倒数"],
                t(`$C = \\frac{1}{${total.toLatex()}} = ${ans.toLatex()}$.`, `$C = \\frac{1}{${total.toLatex()}} = ${ans.toLatex()}$。`),
              ],
            ],
            t(
              `$${g}$ is nonnegative on the rectangle, and $C$ times the integral is $${ans.toLatex()} \\cdot ${total.toLatex()} = 1$.`,
              `$${g}$ 在矩形上非负，且 $C$ 乘以积分为 $${ans.toLatex()} \\cdot ${total.toLatex()} = 1$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** calculatingProbabilitiesWithContinuousRandomVariables computes P((X, Y) ∈ R). */
export const calculatingProbabilitiesWithContinuousRandomVariables: TopicDef = {
  id: "calculating-probabilities-with-continuous-random-variables",
  title: t("Calculating Probabilities With Continuous Random Variables", "连续型随机变量区域概率的计算"),
  summary: t(
    "The probability that $(X, Y)$ falls in a region $R$ is the double integral $P((X, Y) \\in R) = \\iint_R f(x, y)\\,dA$.",
    "$(X, Y)$ 落在区域 $R$ 内的概率由二重积分给出：$P((X, Y) \\in R) = \\iint_R f(x, y)\\,dA$。",
  ),
  intro: t(
    "$(X, Y)$ is uniform on $[0, 4] \\times [0, 2]$, so its density is $\\frac{1}{8}$. The event $X \\ge 3$ is the strip $[3, 4] \\times [0, 2]$ of area $2$, so $P(X \\ge 3) = \\frac{2}{8} = \\frac{1}{4}$.\n\nCheck: $X$ alone is uniform on $[0, 4]$, and the last unit of that interval is a quarter of it.\n\nIn this lesson we find the probability that a random point falls in a region by integrating the joint density over the region.",
    "$(X, Y)$ 在 $[0, 4] \\times [0, 2]$ 上均匀分布，所以密度为 $\\frac{1}{8}$。事件 $X \\ge 3$ 是面积为 $2$ 的带形 $[3, 4] \\times [0, 2]$，所以 $P(X \\ge 3) = \\frac{2}{8} = \\frac{1}{4}$。\n\n检验：$X$ 单独在 $[0, 4]$ 上均匀分布，最后一个单位长度占区间的四分之一。\n\n本课我们把联合密度在区域上积分，求随机点落在该区域内的概率。",
  ),
  prerequisites: ["probability-density-functions-of-continuous-random-variables"],
  encompasses: [
    {
      topic: "probability-density-functions-of-continuous-random-variables",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-joint-probabilities-via-double-integrals",
      title: t("Evaluating joint probabilities via double integrals", "通过二重积分计算联合概率"),
      explanation: t(
        "The probability that a random point lands in a region is the integral of the joint density over that region, which for a uniform density is a ratio of areas. If $(X, Y)$ is uniformly distributed with joint density $f(x, y) = \\frac{1}{WH}$ on $[0, W] \\times [0, H]$, then $P(X \\le x_1, Y \\le y_1) = \\frac{x_1 y_1}{WH}$. On $[0, 8] \\times [0, 5]$, $P(X \\le 5, Y \\le 2) = \\frac{10}{40} = \\frac{1}{4}$.\n\n> **Watch out.** Both conditions must hold, so the event is a rectangle whose area is a product; using only one condition, or adding lengths, gives the wrong probability.",
        "随机点落在某个区域内的概率等于联合密度在该区域上的积分，对于均匀密度，这是面积之比。若 $(X, Y)$ 在 $[0, W] \\times [0, H]$ 上均匀分布，联合概率密度为 $f(x, y) = \\frac{1}{WH}$，则 $P(X \\le x_1, Y \\le y_1) = \\frac{x_1 y_1}{WH}$。在 $[0, 8] \\times [0, 5]$ 上，$P(X \\le 5, Y \\le 2) = \\frac{10}{40} = \\frac{1}{4}$。\n\n> **注意。** 两个条件必须同时成立，所以事件是一个矩形，面积是乘积；只用一个条件或把长度相加都会得到错误的概率。",
      ),
      generate(rng: Rng): Problem {
        const x1 = rng.int(1, 4);
        const y1 = rng.int(1, 4);
        const W = rng.int(x1 + 1, x1 + 6);
        const H = rng.int(y1 + 1, y1 + 6);
        const ans = Q.of(x1 * y1, W * H);
        return numberProblem({
          prompt: t(
            `Let $(X, Y)$ be uniformly distributed over the rectangle $[0, ${W}] \\times [0, ${H}]$. Calculate the probability $P(X \\le ${x1}, Y \\le ${y1})$.`,
            `设二维随机变量 $(X, Y)$ 在矩形区域 $[0, ${W}] \\times [0, ${H}]$ 上服从均匀分布。计算概率 $P(X \\le ${x1}, Y \\le ${y1})$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(x1, W),
              "That uses only the condition on $X$; the event also needs $Y \\le y_1$.",
              "那是只用了关于 $X$ 的条件；事件还要求 $Y \\le y_1$。",
            ),
            why(
              Q.of(y1, H),
              "That uses only the condition on $Y$; the event also needs $X \\le x_1$.",
              "那是只用了关于 $Y$ 的条件；事件还要求 $X \\le x_1$。",
            ),
            why(
              Q.of(x1 + y1, W + H),
              "That adds lengths; a probability for a uniform point is a ratio of areas.",
              "那是把长度相加；均匀点的概率是面积之比。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the density", "求密度"],
                t(
                  `$f(x, y) = \\frac{1}{${W} \\cdot ${H}} = \\frac{1}{${W * H}}$.`,
                  `$f(x, y) = \\frac{1}{${W} \\cdot ${H}} = \\frac{1}{${W * H}}$。`,
                ),
              ],
              [
                ["Find the event's area", "求事件的面积"],
                t(
                  `The event is $[0, ${x1}] \\times [0, ${y1}]$, of area $${x1 * y1}$.`,
                  `事件为 $[0, ${x1}] \\times [0, ${y1}]$，面积为 $${x1 * y1}$。`,
                ),
              ],
              [
                ["Divide", "相除"],
                t(`$P = \\frac{${x1 * y1}}{${W * H}} = ${ans.toLatex()}$.`, `$P = \\frac{${x1 * y1}}{${W * H}} = ${ans.toLatex()}$。`),
              ],
            ],
            t(
              `$X$ and $Y$ are independent here, and $P(X \\le ${x1})P(Y \\le ${y1}) = ${Q.of(x1, W).toLatex()} \\cdot ${Q.of(y1, H).toLatex()} = ${ans.toLatex()}$.`,
              `这里 $X$ 与 $Y$ 独立，而 $P(X \\le ${x1})P(Y \\le ${y1}) = ${Q.of(x1, W).toLatex()} \\cdot ${Q.of(y1, H).toLatex()} = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "probability-that-a-sum-is-small",
      figure: multivariableDrawings8["calculating-probabilities-with-continuous-random-variables#probability-that-a-sum-is-small"],
      title: t("The probability that $X + Y$ is small", "$X + Y$ 较小的概率"),
      explanation: t(
        "For a uniform distribution on a region, a probability is the area of the event divided by the total area. If $(X, Y)$ is uniform on the square $[0, L]^2$ and $0 \\le s \\le L$, the event $X + Y \\le s$ is the triangle with legs $s$, so\n\n$$P(X + Y \\le s) = \\frac{s^2/2}{L^2} = \\frac{s^2}{2L^2}.$$\n\nDrawing the line $x + y = s$ first shows which shape the event has; for $s > L$ the region is no longer a triangle. On $[0, 10]^2$, $P(X + Y \\le 4) = \\frac{8}{100} = \\frac{2}{25}$.\n\n> **Watch out.** The event is a triangle of area $\\frac{s^2}{2}$, not the square $s^2$; and a probability divides areas, not the lengths $s$ and $L$.",
        "对区域上的均匀分布，概率是事件的面积除以总面积。若 $(X, Y)$ 在正方形 $[0, L]^2$ 上均匀分布且 $0 \\le s \\le L$，事件 $X + Y \\le s$ 是两直角边为 $s$ 的三角形，所以\n\n$$P(X + Y \\le s) = \\frac{s^2/2}{L^2} = \\frac{s^2}{2L^2}$$\n\n先画出直线 $x + y = s$ 就能看出事件的形状；当 $s > L$ 时区域不再是三角形。在 $[0, 10]^2$ 上，$P(X + Y \\le 4) = \\frac{8}{100} = \\frac{2}{25}$。\n\n> **注意。** 事件是面积为 $\\frac{s^2}{2}$ 的三角形，不是正方形 $s^2$；概率是面积之比，不是长度 $s$ 与 $L$ 之比。",
      ),
      generate(rng: Rng): Problem {
        const L = rng.int(2, 8);
        const s = rng.int(1, L);
        const ans = Q.of(s * s, 2 * L * L);
        return numberProblem({
          prompt: t(
            `$(X, Y)$ is uniformly distributed on the square $[0, ${L}] \\times [0, ${L}]$. Find $P(X + Y \\le ${s})$.`,
            `$(X, Y)$ 在正方形 $[0, ${L}] \\times [0, ${L}]$ 上均匀分布。求 $P(X + Y \\le ${s})$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(s * s, L * L),
              "That uses the square of side $s$; the event is the triangle under $x + y = s$, half of it.",
              "那是用了边长为 $s$ 的正方形；事件是 $x + y = s$ 下方的三角形，只有它的一半。",
            ),
            why(
              Q.of(s, 2 * L),
              "That divides lengths; a probability for a uniform point divides areas.",
              "那是长度之比；均匀点的概率是面积之比。",
            ),
            why(
              Q.of(s, L),
              "That is $P(X \\le s)$ for one variable; the event constrains the sum.",
              "那是单个变量的 $P(X \\le s)$；事件约束的是和。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Draw the event", "画出事件"],
                t(
                  `Since $${s} \\le ${L}$, the line $x + y = ${s}$ cuts a triangle with legs $${s}$ from the corner at the origin.`,
                  `由于 $${s} \\le ${L}$，直线 $x + y = ${s}$ 在原点处的角上截出两直角边为 $${s}$ 的三角形。`,
                ),
              ],
              [
                ["Find its area", "求面积"],
                t(
                  `The triangle has area $\\frac{${s * s}}{2} = ${Q.of(s * s, 2).toLatex()}$.`,
                  `三角形面积为 $\\frac{${s * s}}{2} = ${Q.of(s * s, 2).toLatex()}$。`,
                ),
              ],
              [
                ["Divide", "相除"],
                t(
                  `$P = \\frac{${Q.of(s * s, 2).toLatex()}}{${L * L}} = ${ans.toLatex()}$.`,
                  `$P = \\frac{${Q.of(s * s, 2).toLatex()}}{${L * L}} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `At $s = L$ the formula gives $\\frac{1}{2}$, the half of the square below the diagonal; here $s \\le L$, and $${ans.toLatex()}$ is at most $\\frac{1}{2}$.`,
              `当 $s = L$ 时公式给出 $\\frac{1}{2}$，即对角线下方的半个正方形；这里 $s \\le L$，而 $${ans.toLatex()}$ 不超过 $\\frac{1}{2}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** continuousRandomVariablesOverInfiniteDomains integrates densities over ℝ_≥0^2. */
export const continuousRandomVariablesOverInfiniteDomains: TopicDef = {
  id: "continuous-random-variables-over-infinite-domains",
  title: t("Continuous Random Variables Over Infinite Domains", "无穷区域上的连续型随机变量"),
  summary: t(
    "Improper double integrals evaluate joint probability distributions supported on unbounded domains such as the first quadrant.",
    "通过反常二重积分计算在第一象限等无界区域上定义的联合概率分布。",
  ),
  intro: t(
    "Evaluate $\\int_0^\\infty\\int_0^\\infty e^{-x - 2y}\\,dx\\,dy$. The integrand is $e^{-x}e^{-2y}$, so the integral is $\\int_0^\\infty e^{-x}\\,dx \\cdot \\int_0^\\infty e^{-2y}\\,dy = 1 \\cdot \\frac{1}{2} = \\frac{1}{2}$.\n\nCheck: integrating $y$ first gives $\\frac{1}{2}e^{-x}$, and $\\int_0^\\infty \\frac{1}{2}e^{-x}\\,dx = \\frac{1}{2}$ as well.\n\nIn this lesson we evaluate improper double integrals of joint densities over the first quadrant and use them to find probabilities.",
    "计算 $\\int_0^\\infty\\int_0^\\infty e^{-x - 2y}\\,dx\\,dy$。被积函数为 $e^{-x}e^{-2y}$，所以积分为 $\\int_0^\\infty e^{-x}\\,dx \\cdot \\int_0^\\infty e^{-2y}\\,dy = 1 \\cdot \\frac{1}{2} = \\frac{1}{2}$。\n\n检验：先对 $y$ 积分得 $\\frac{1}{2}e^{-x}$，而 $\\int_0^\\infty \\frac{1}{2}e^{-x}\\,dx$ 同样等于 $\\frac{1}{2}$。\n\n本课我们计算联合密度在第一象限上的反常二重积分，并用它求概率。",
  ),
  prerequisites: ["calculating-probabilities-with-continuous-random-variables", "improper-integrals-involving-exponential-functions"],
  encompasses: [
    {
      topic: "calculating-probabilities-with-continuous-random-variables",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "integrating-joint-densities-over-unbounded-regions",
      title: t("Integrating joint densities over unbounded regions", "在无界区域上计算联合概率密度的反常二重积分"),
      explanation: t(
        "When the density factors into a function of each variable, the double integral over the quadrant splits into a product of two single improper integrals. For $f(x, y) = ce^{-ax - by}$ over $x \\ge 0, y \\ge 0$, since $\\int_0^\\infty e^{-ax}\\,dx = \\frac{1}{a}$, the integral is $c \\cdot \\frac{1}{a} \\cdot \\frac{1}{b} = \\frac{c}{ab}$. For $21e^{-7x - 3y}$ it is $\\frac{21}{21} = 1$, so that function is a density.\n\n> **Watch out.** $\\int_0^\\infty e^{-ax}\\,dx$ is $\\frac{1}{a}$, so divide by each rate; do not add the rates, and do not forget the constant in front.",
        "当密度可以分解为各变量函数的乘积时，第一象限上的二重积分可以拆成两个一元反常积分的乘积。对第一象限 $x \\ge 0, y \\ge 0$ 上的 $f(x, y) = ce^{-ax - by}$，由于 $\\int_0^\\infty e^{-ax}\\,dx = \\frac{1}{a}$，积分为 $c \\cdot \\frac{1}{a} \\cdot \\frac{1}{b} = \\frac{c}{ab}$。对 $21e^{-7x - 3y}$，它等于 $\\frac{21}{21} = 1$，所以这个函数是一个密度。\n\n> **注意。** $\\int_0^\\infty e^{-ax}\\,dx$ 等于 $\\frac{1}{a}$，所以要除以每个速率；不要把速率相加，也别忘了前面的常数。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 6);
        const b = rng.int(2, 6);
        const k = rng.int(2, 8);
        const c = k * a * b;
        const ans = k;
        return numberProblem({
          prompt: t(
            `Evaluate the improper double integral $\\int_0^\\infty \\int_0^\\infty ${c} e^{-${a}x - ${b}y}\\,dx\\,dy$.`,
            `计算反常二重积分 $\\int_0^\\infty \\int_0^\\infty ${c} e^{-${a}x - ${b}y}\\,dx\\,dy$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              c,
              "That forgets to integrate; each exponential integrates to the reciprocal of its rate.",
              "那是忘了积分；每个指数函数积分后得到其速率的倒数。",
            ),
            why(
              c * a * b,
              "That multiplies by the rates; $\\int_0^\\infty e^{-ax}\\,dx = \\frac{1}{a}$ divides by them.",
              "那是乘以了速率；$\\int_0^\\infty e^{-ax}\\,dx = \\frac{1}{a}$ 要除以速率。",
            ),
            why(
              Q.of(c, a + b),
              "That adds the rates; the integral factors into a product $\\frac{1}{a} \\cdot \\frac{1}{b}$.",
              "那是把速率相加；积分分解成乘积 $\\frac{1}{a} \\cdot \\frac{1}{b}$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Separate", "分离变量"],
                t(
                  `$${c}e^{-${a}x - ${b}y} = ${c}e^{-${a}x}e^{-${b}y}$, so the integral is $${c}\\int_0^\\infty e^{-${a}x}\\,dx \\int_0^\\infty e^{-${b}y}\\,dy$.`,
                  `$${c}e^{-${a}x - ${b}y} = ${c}e^{-${a}x}e^{-${b}y}$，所以积分为 $${c}\\int_0^\\infty e^{-${a}x}\\,dx \\int_0^\\infty e^{-${b}y}\\,dy$。`,
                ),
              ],
              [
                ["Integrate each factor", "分别积分"],
                t(
                  `$\\int_0^\\infty e^{-${a}x}\\,dx = \\frac{1}{${a}}$ and $\\int_0^\\infty e^{-${b}y}\\,dy = \\frac{1}{${b}}$.`,
                  `$\\int_0^\\infty e^{-${a}x}\\,dx = \\frac{1}{${a}}$，$\\int_0^\\infty e^{-${b}y}\\,dy = \\frac{1}{${b}}$。`,
                ),
              ],
              [["Multiply", "相乘"], t(`$\\frac{${c}}{${a} \\cdot ${b}} = ${ans}$.`, `$\\frac{${c}}{${a} \\cdot ${b}} = ${ans}$。`)],
            ],
            t(
              `The integrand is $${k}$ times $${a * b}e^{-${a}x - ${b}y}$, a density whose integral is $1$, so the answer is $${k}$.`,
              `被积函数是 $${a * b}e^{-${a}x - ${b}y}$ 的 $${k}$ 倍，而后者是积分为 $1$ 的密度，所以答案为 $${k}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "probability-that-one-exponential-variable-is-smaller",
      title: t("The probability that one exponential variable comes first", "一个指数变量先发生的概率"),
      explanation: t(
        "For $f(x, y) = ab\\,e^{-ax - by}$ on $x, y \\ge 0$, the event $X < Y$ is the unbounded region above the line $y = x$. Integrate $y$ from $x$ to $\\infty$ first, which gives $a e^{-(a + b)x}$, and then $x$ from $0$ to $\\infty$:\n\n$$P(X < Y) = \\int_0^\\infty a e^{-(a+b)x}\\,dx = \\frac{a}{a + b}.$$\n\nThe variable with the larger rate tends to happen first. For $21e^{-7x - 3y}$, $P(X < Y) = \\frac{7}{10}$ and $P(Y < X) = \\frac{3}{10}$.\n\n> **Watch out.** Divide the rate of the variable that comes first by the sum of the rates, not by the other rate; the answer is $\\frac{1}{2}$ only when the rates are equal.",
        "对 $x, y \\ge 0$ 上的 $f(x, y) = ab\\,e^{-ax - by}$，事件 $X < Y$ 是直线 $y = x$ 上方的无界区域。先把 $y$ 从 $x$ 积到 $\\infty$，得 $a e^{-(a + b)x}$，再把 $x$ 从 $0$ 积到 $\\infty$：\n\n$$P(X < Y) = \\int_0^\\infty a e^{-(a+b)x}\\,dx = \\frac{a}{a + b}$$\n\n速率较大的变量往往先发生。对 $21e^{-7x - 3y}$，$P(X < Y) = \\frac{7}{10}$，$P(Y < X) = \\frac{3}{10}$。\n\n> **注意。** 要用先发生的那个变量的速率除以速率之和，而不是除以另一个速率；只有速率相等时答案才是 $\\frac{1}{2}$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 6);
        let b = rng.int(1, 6);
        if (b === a) b += 1;
        const askX = rng.int(0, 1) === 0;
        const ans = askX ? Q.of(a, a + b) : Q.of(b, a + b);
        const first = askX ? a : b;
        const second = askX ? b : a;
        const u = askX ? "x" : "y";
        const w = askX ? "y" : "x";
        const event = askX ? "X < Y" : "Y < X";
        return numberProblem({
          prompt: t(
            `$(X, Y)$ has joint density $f(x, y) = ${a * b}e^{-${coef(a)}x - ${coef(b)}y}$ for $x, y \\ge 0$. Find $P(${event})$.`,
            `$(X, Y)$ 的联合密度为 $f(x, y) = ${a * b}e^{-${coef(a)}x - ${coef(b)}y}$（$x, y \\ge 0$）。求 $P(${event})$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(Q.of(second, a + b), "That is the probability that the other variable comes first.", "那是另一个变量先发生的概率。"),
            why(Q.of(1, 2), "That would hold only if the two rates were equal.", "只有两个速率相等时才是这样。"),
            why(
              Q.of(first, second),
              "That divides by the other rate; divide by the sum of the rates.",
              "那是除以了另一个速率；应除以速率之和。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Integrate the later variable", "先对后发生的变量积分"],
                t(
                  `$\\int_${u}^\\infty ${coef(second)}e^{-${coef(second)}${w}}\\,d${w} = e^{-${coef(second)}${u}}$, leaving $${coef(first)}e^{-${coef(first)}${u}}e^{-${coef(second)}${u}} = ${coef(first)}e^{-${a + b}${u}}$.`,
                  `$\\int_${u}^\\infty ${coef(second)}e^{-${coef(second)}${w}}\\,d${w} = e^{-${coef(second)}${u}}$，剩下 $${coef(first)}e^{-${coef(first)}${u}}e^{-${coef(second)}${u}} = ${coef(first)}e^{-${a + b}${u}}$。`,
                ),
              ],
              [
                ["Integrate the earlier variable", "再对先发生的变量积分"],
                t(
                  `$P(${event}) = \\int_0^\\infty ${coef(first)}e^{-${a + b}${u}}\\,d${u} = \\frac{${first}}{${a + b}} = ${ans.toLatex()}$.`,
                  `$P(${event}) = \\int_0^\\infty ${coef(first)}e^{-${a + b}${u}}\\,d${u} = \\frac{${first}}{${a + b}} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The two events $X < Y$ and $Y < X$ cover everything, and $\\frac{${first}}{${a + b}} + \\frac{${second}}{${a + b}} = 1$.`,
              `事件 $X < Y$ 与 $Y < X$ 覆盖了全部情形，而 $\\frac{${first}}{${a + b}} + \\frac{${second}}{${a + b}} = 1$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** jointDistributionsForDiscreteRandomVariables handles discrete joint PMFs. */
export const jointDistributionsForDiscreteRandomVariables: TopicDef = {
  id: "joint-distributions-for-discrete-random-variables",
  title: t("Joint Distributions for Discrete Random Variables", "离散型随机变量的联合分布"),
  summary: t(
    "For discrete random variables, the joint PMF $p(x_i, y_j)$ sums to $1$, and the marginal distributions are the row and column sums.",
    "对于离散型随机变量，联合分布律 $p(x_i, y_j)$ 之和为 $1$，边际分布由行和与列和给出。",
  ),
  intro: t(
    "$X, Y \\in \\{0, 1\\}$ have $P(X = 0, Y = 0) = \\frac{1}{8}$, $P(X = 0, Y = 1) = \\frac{3}{8}$, $P(X = 1, Y = 0) = \\frac{1}{4}$ and $P(X = 1, Y = 1) = \\frac{1}{4}$. The event $Y = 1$ happens with $X = 0$ or with $X = 1$, so $P(Y = 1) = \\frac{3}{8} + \\frac{1}{4} = \\frac{5}{8}$.\n\nCheck: $P(Y = 0) = \\frac{1}{8} + \\frac{1}{4} = \\frac{3}{8}$, and $\\frac{5}{8} + \\frac{3}{8} = 1$.\n\nIn this lesson we read a joint probability table: its entries add to $1$, its row and column sums are the marginal probabilities, and dividing by a marginal gives a conditional probability.",
    "$X, Y \\in \\{0, 1\\}$，$P(X = 0, Y = 0) = \\frac{1}{8}$，$P(X = 0, Y = 1) = \\frac{3}{8}$，$P(X = 1, Y = 0) = \\frac{1}{4}$，$P(X = 1, Y = 1) = \\frac{1}{4}$。事件 $Y = 1$ 可以与 $X = 0$ 或 $X = 1$ 一起发生，所以 $P(Y = 1) = \\frac{3}{8} + \\frac{1}{4} = \\frac{5}{8}$。\n\n检验：$P(Y = 0) = \\frac{1}{8} + \\frac{1}{4} = \\frac{3}{8}$，而 $\\frac{5}{8} + \\frac{3}{8} = 1$。\n\n本课我们阅读联合概率表：表中各项之和为 $1$，行和与列和是边际概率，除以边际概率得到条件概率。",
  ),
  prerequisites: ["double-summations"],
  encompasses: [{ topic: "double-summations", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "marginal-probabilities-and-joint-pmf-sums",
      title: t("Marginal probabilities and joint pmf sums", "联合概率分布列的求和与边际概率"),
      explanation: t(
        "To find the probability for one variable alone, add the joint probabilities over every value of the other variable, which is a row or column sum of the table: $P(X = x_1) = \\sum_j P(X = x_1, Y = y_j)$. If $Y$ takes three values and $P(X = 1, Y = 1) = 0.12$, $P(X = 1, Y = 2) = 0.08$, $P(X = 1, Y = 3) = 0.2$, then $P(X = 1) = 0.4$.\n\n> **Watch out.** Add along the value of the variable you are asked about, over every value of the other one; a single entry is a joint probability, and the sum for the other variable is a different marginal.",
        "要求单个变量的概率，就把另一个变量所有取值下的联合概率加起来，也就是表格中一行或一列的和：$P(X = x_1) = \\sum_j P(X = x_1, Y = y_j)$。若 $Y$ 取三个值，且 $P(X = 1, Y = 1) = 0.12$，$P(X = 1, Y = 2) = 0.08$，$P(X = 1, Y = 3) = 0.2$，则 $P(X = 1) = 0.4$。\n\n> **注意。** 要固定所问变量的取值，对另一个变量的所有取值求和；单独一项只是联合概率，而对另一个变量固定取值求和得到的是另一个边际概率。",
      ),
      generate(rng: Rng): Problem {
        const p11 = rng.int(10, 30); // in percent
        const p12 = rng.int(10, 30);
        const p21 = rng.int(10, 30);
        const p22 = 100 - p11 - p12 - p21;
        const pX1 = p11 + p12;
        return numberProblem({
          prompt: t(
            `Two discrete random variables $X \\in \\{1, 2\\}$ and $Y \\in \\{1, 2\\}$ have joint probabilities (in percent): $P(X=1, Y=1) = ${p11}\\%$, $P(X=1, Y=2) = ${p12}\\%$, $P(X=2, Y=1) = ${p21}\\%$, and $P(X=2, Y=2) = ${p22}\\%$. Find the marginal probability $P(X = 1)$ (in percent).`,
            `两离散型随机变量 $X \\in \\{1, 2\\}$ 与 $Y \\in \\{1, 2\\}$ 的联合概率（以百分比计）为：$P(X=1, Y=1) = ${p11}\\%$，$P(X=1, Y=2) = ${p12}\\%$，$P(X=2, Y=1) = ${p21}\\%$，$P(X=2, Y=2) = ${p22}\\%$。求边际概率 $P(X = 1)$（百分比整数值）。`,
          ),
          answer: pX1,
          mistakes: distinct(pX1, [
            why(
              p11,
              "That is the single entry $P(X = 1, Y = 1)$; add the entry for $Y = 2$ as well.",
              "那只是单独一项 $P(X = 1, Y = 1)$；还要加上 $Y = 2$ 的那一项。",
            ),
            why(
              p12,
              "That is the single entry $P(X = 1, Y = 2)$; add the entry for $Y = 1$ as well.",
              "那只是单独一项 $P(X = 1, Y = 2)$；还要加上 $Y = 1$ 的那一项。",
            ),
            why(100 - pX1, "That is $P(X = 2)$, the sum of the entries with $X = 2$.", "那是 $P(X = 2)$，即 $X = 2$ 各项之和。"),
            why(
              p11 + p21,
              "That is $P(Y = 1)$; for $P(X = 1)$ hold $X = 1$ and add over $Y$.",
              "那是 $P(Y = 1)$；求 $P(X = 1)$ 要固定 $X = 1$ 对 $Y$ 求和。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Sum over $Y$", "对 $Y$ 求和"],
                t("$P(X = 1) = P(X = 1, Y = 1) + P(X = 1, Y = 2)$.", "$P(X = 1) = P(X = 1, Y = 1) + P(X = 1, Y = 2)$。"),
              ],
              [["Add", "相加"], t(`$P(X = 1) = ${p11}\\% + ${p12}\\% = ${pX1}\\%$.`, `$P(X = 1) = ${p11}\\% + ${p12}\\% = ${pX1}\\%$。`)],
            ],
            t(
              `$P(X = 2) = ${p21}\\% + ${p22}\\% = ${100 - pX1}\\%$, and $${pX1}\\% + ${100 - pX1}\\% = 100\\%$.`,
              `$P(X = 2) = ${p21}\\% + ${p22}\\% = ${100 - pX1}\\%$，而 $${pX1}\\% + ${100 - pX1}\\% = 100\\%$。`,
            ),
          ),
        });
      },
    },
    {
      id: "conditional-probability-from-a-joint-table",
      title: t("Conditional probability from a joint table", "由联合分布表求条件概率"),
      explanation: t(
        "A conditional probability restricts attention to one row or column of the joint table and rescales it to total $1$:\n\n$$P(X = x \\mid Y = y) = \\frac{P(X = x, Y = y)}{P(Y = y)}.$$\n\nThe denominator is the marginal $P(Y = y)$, found by adding the column for $Y = y$. If $P(X = 1, Y = 2) = 0.06$ and $P(X = 2, Y = 2) = 0.24$, then $P(Y = 2) = 0.3$ and $P(X = 1 \\mid Y = 2) = \\frac{0.06}{0.3} = \\frac{1}{5}$.\n\n> **Watch out.** Divide by the marginal of the variable after the bar, not by the total $1$, which leaves the joint probability, and not by the marginal of the other variable.",
        "条件概率只看联合分布表的一行或一列，并把它重新缩放使总和为 $1$：\n\n$$P(X = x \\mid Y = y) = \\frac{P(X = x, Y = y)}{P(Y = y)}$$\n\n分母是边缘概率 $P(Y = y)$，由 $Y = y$ 那一列相加得到。若 $P(X = 1, Y = 2) = 0.06$，$P(X = 2, Y = 2) = 0.24$，则 $P(Y = 2) = 0.3$，$P(X = 1 \\mid Y = 2) = \\frac{0.06}{0.3} = \\frac{1}{5}$。\n\n> **注意。** 要除以竖线后面那个变量的边缘概率；除以总和 $1$ 得到的仍是联合概率，除以另一个变量的边缘概率也不对。",
      ),
      generate(rng: Rng): Problem {
        const p11 = rng.int(1, 4) * 5;
        const p12 = rng.int(1, 4) * 5;
        const p21 = rng.int(1, 4) * 5;
        const p22 = 100 - p11 - p12 - p21;
        const x = rng.int(1, 2);
        const y = rng.int(1, 2);
        const table = [
          [p11, p12],
          [p21, p22],
        ];
        const num = table[x - 1]![y - 1]!;
        const top = table[0]![y - 1]!;
        const bottom = table[1]![y - 1]!;
        const den = top + bottom;
        const ans = Q.of(num, den);
        return numberProblem({
          prompt: t(
            `$X, Y \\in \\{1, 2\\}$ with $P(1, 1) = ${p11}\\%$, $P(1, 2) = ${p12}\\%$, $P(2, 1) = ${p21}\\%$ and $P(2, 2) = ${p22}\\%$, where $P(i, j) = P(X = i, Y = j)$. Find $P(X = ${x} \\mid Y = ${y})$.`,
            `$X, Y \\in \\{1, 2\\}$，$P(1, 1) = ${p11}\\%$，$P(1, 2) = ${p12}\\%$，$P(2, 1) = ${p21}\\%$，$P(2, 2) = ${p22}\\%$，其中 $P(i, j) = P(X = i, Y = j)$。求 $P(X = ${x} \\mid Y = ${y})$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(num, 100),
              "That is the joint probability; divide by $P(Y = y)$, not by the whole table.",
              "那是联合概率；要除以 $P(Y = y)$，而不是整张表的总和。",
            ),
            why(
              Q.of(num, table[x - 1]![0]! + table[x - 1]![1]!),
              "That divides by $P(X = x)$, which gives $P(Y = y \\mid X = x)$.",
              "那是除以了 $P(X = x)$，得到的是 $P(Y = y \\mid X = x)$。",
            ),
            why(Q.of(den - num, den), "That is the conditional probability of the other value of $X$.", "那是 $X$ 取另一个值的条件概率。"),
          ]),
          solution: walked(
            [
              [
                ["Find the marginal of $Y$", "求 $Y$ 的边缘概率"],
                t(`$P(Y = ${y}) = ${top}\\% + ${bottom}\\% = ${den}\\%$.`, `$P(Y = ${y}) = ${top}\\% + ${bottom}\\% = ${den}\\%$。`),
              ],
              [
                ["Divide", "相除"],
                t(
                  `$P(X = ${x} \\mid Y = ${y}) = \\frac{${num}}{${den}} = ${ans.toLatex()}$.`,
                  `$P(X = ${x} \\mid Y = ${y}) = \\frac{${num}}{${den}} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The two conditional probabilities given $Y = ${y}$ are $\\frac{${top}}{${den}}$ and $\\frac{${bottom}}{${den}}$, and they add to $1$.`,
              `给定 $Y = ${y}$ 的两个条件概率为 $\\frac{${top}}{${den}}$ 与 $\\frac{${bottom}}{${den}}$，它们之和为 $1$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** jointDistributionsForContinuousRandomVariables defines marginal densities. */
export const jointDistributionsForContinuousRandomVariables: TopicDef = {
  id: "joint-distributions-for-continuous-random-variables",
  title: t("Joint Distributions for Continuous Random Variables", "连续型随机变量的边际密度与独立性"),
  summary: t(
    "Marginal density functions are obtained by integrating out the other variable: $f_X(x) = \\int f(x, y)\\,dy$.",
    "对另一个变量积分即得边际密度函数：$f_X(x) = \\int f(x, y)\\,dy$。",
  ),
  intro: t(
    "$(X, Y)$ has density $f(x, y) = 4xy$ on $[0, 1] \\times [0, 1]$. Integrating out $y$ gives $f_X(x) = \\int_0^1 4xy\\,dy = 2x$, and likewise $f_Y(y) = 2y$. Since $f_X(x)f_Y(y) = 4xy = f(x, y)$, $X$ and $Y$ are independent.\n\nCheck: $\\int_0^1 2x\\,dx = 1$, so $f_X$ is a density on $[0, 1]$.\n\nIn this lesson we find marginal densities by integrating out a variable, test independence, and compute expected values from a joint density.",
    "$(X, Y)$ 在 $[0, 1] \\times [0, 1]$ 上的密度为 $f(x, y) = 4xy$。把 $y$ 积分掉得 $f_X(x) = \\int_0^1 4xy\\,dy = 2x$，同样 $f_Y(y) = 2y$。由于 $f_X(x)f_Y(y) = 4xy = f(x, y)$，$X$ 与 $Y$ 相互独立。\n\n检验：$\\int_0^1 2x\\,dx = 1$，所以 $f_X$ 是 $[0, 1]$ 上的密度。\n\n本课我们通过把一个变量积分掉求边缘密度，判断独立性，并由联合密度计算期望。",
  ),
  prerequisites: ["calculating-probabilities-with-continuous-random-variables"],
  encompasses: [
    {
      topic: "calculating-probabilities-with-continuous-random-variables",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "marginal-densities-and-independence-of-continuous-variables",
      title: t("Marginal densities and independence of continuous variables", "连续型随机变量边际密度的积分求解"),
      explanation: t(
        "Integrating out the other variable gives the marginal density, and the variables are independent when the joint density equals the product of the marginals. The marginal probability density function of $X$ is $f_X(x) = \\int_{-\\infty}^\\infty f(x, y)\\,dy$. For $f(x, y) = x + y$ on $[0, 1] \\times [0, 1]$, $f_X(x) = \\int_0^1 (x + y)\\,dy = x + \\frac{1}{2}$, so $f_X\\left(\\frac{1}{2}\\right) = 1$. Here $X$ and $Y$ are not independent, since $\\left(x + \\frac{1}{2}\\right)\\left(y + \\frac{1}{2}\\right) \\ne x + y$.\n\n> **Watch out.** While integrating in $y$, $x$ is a constant, so it contributes $x$ times the length $1$; and $\\int_0^1 y\\,dy = \\frac{1}{2}$, not $1$. Keep the constant in front of the density.",
        "把另一个变量积分掉就得到边缘密度，当联合密度等于边缘密度之积时，两个变量相互独立。随机变量 $X$ 的边际概率密度函数为 $f_X(x) = \\int_{-\\infty}^\\infty f(x, y)\\,dy$。对于在 $[0, 1] \\times [0, 1]$ 上的联合密度 $f(x, y) = x + y$，$f_X(x) = \\int_0^1 (x + y)\\,dy = x + \\frac{1}{2}$，所以 $f_X\\left(\\frac{1}{2}\\right) = 1$。这里 $X$ 与 $Y$ 不独立，因为 $\\left(x + \\frac{1}{2}\\right)\\left(y + \\frac{1}{2}\\right) \\ne x + y$。\n\n> **注意。** 对 $y$ 积分时 $x$ 是常数，贡献 $x$ 乘以长度 $1$；而 $\\int_0^1 y\\,dy = \\frac{1}{2}$，不是 $1$。别丢掉密度前面的常数。",
      ),
      generate(rng: Rng): Problem {
        // f(x, y) = (2 / (1 + a))(x + a y) has total integral 1 on the unit square.
        const a = rng.int(2, 7);
        const xVal = rng.pick([Q.of(1, 4), Q.of(1, 3), Q.of(1, 2), Q.of(2, 3), Q.of(3, 4)]);
        const c = Q.of(2, 1 + a);
        const half = Q.of(a, 2);
        const inner = xVal.add(half);
        const ans = c.mul(inner);
        const f = `${c.toLatex()}(x + ${a}y)`;
        const marginal = `${c.toLatex()}\\left(x + ${half.toLatex()}\\right)`;
        return numberProblem({
          prompt: t(
            `A continuous random vector $(X, Y)$ on $[0, 1] \\times [0, 1]$ has joint density $f(x, y) = ${f}$. Evaluate the marginal probability density $f_X(x)$ at $x = ${xVal.toLatex()}$.`,
            `定义在 $[0, 1] \\times [0, 1]$ 上的连续型随机向量 $(X, Y)$ 具有联合密度 $f(x, y) = ${f}$。求边际概率密度 $f_X(x)$ 在 $x = ${xVal.toLatex()}$ 处的值。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              c.mul(xVal),
              "That drops the $y$ term; $\\int_0^1 ay\\,dy = \\frac{a}{2}$ stays in the marginal.",
              "那是丢掉了 $y$ 项；$\\int_0^1 ay\\,dy = \\frac{a}{2}$ 要留在边缘密度里。",
            ),
            why(
              c.mul(xVal.add(Q.of(a, 1))),
              "That integrates $y$ to $1$; $\\int_0^1 y\\,dy = \\frac{1}{2}$.",
              "那是把 $y$ 积成了 $1$；$\\int_0^1 y\\,dy = \\frac{1}{2}$。",
            ),
            why(
              c.mul(half),
              "That drops the $x$ term; $x$ is constant in the $y$-integral and stays.",
              "那是丢掉了 $x$ 项；$x$ 在对 $y$ 的积分中是常数，要保留。",
            ),
            why(inner, "That forgets the constant in front of the density.", "那是忘了密度前面的常数。"),
          ]),
          solution: walked(
            [
              [["Integrate out $y$", "把 $y$ 积分掉"], t(`$f_X(x) = \\int_0^1 ${f}\\,dy$.`, `$f_X(x) = \\int_0^1 ${f}\\,dy$。`)],
              [
                ["Integrate term by term", "逐项积分"],
                t(
                  `$x$ is constant and $\\int_0^1 ${a}y\\,dy = ${half.toLatex()}$, so $f_X(x) = ${marginal}$.`,
                  `$x$ 是常数，且 $\\int_0^1 ${a}y\\,dy = ${half.toLatex()}$，所以 $f_X(x) = ${marginal}$。`,
                ),
              ],
              [
                ["Evaluate", "代入"],
                t(
                  `$f_X\\left(${xVal.toLatex()}\\right) = ${c.toLatex()} \\cdot ${inner.toLatex()} = ${ans.toLatex()}$.`,
                  `$f_X\\left(${xVal.toLatex()}\\right) = ${c.toLatex()} \\cdot ${inner.toLatex()} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `$f_X$ is a density: $\\int_0^1 ${marginal}\\,dx = ${c.toLatex()}\\left(\\frac{1}{2} + ${half.toLatex()}\\right) = 1$.`,
              `$f_X$ 是密度：$\\int_0^1 ${marginal}\\,dx = ${c.toLatex()}\\left(\\frac{1}{2} + ${half.toLatex()}\\right) = 1$。`,
            ),
          ),
        });
      },
    },
    {
      id: "expected-value-from-a-product-density",
      title: t("An expected value from a joint density", "由联合密度求期望"),
      explanation: t(
        "The expected value of $X$ under a joint density is $E[X] = \\iint x\\,f(x, y)\\,dA$. For the density $f(x, y) = (m + 1)(n + 1)x^my^n$ on the unit square, the $y$-integral contributes a factor $1$, leaving\n\n$$E[X] = (m + 1)\\int_0^1 x^{m+1}\\,dx = \\frac{m + 1}{m + 2},$$\n\nand likewise $E[Y] = \\frac{n + 1}{n + 2}$. For $9x^2y^2$, $E[X] = E[Y] = \\frac{3}{4}$. A larger exponent pushes the mean toward $1$.\n\n> **Watch out.** Multiply the density by $x$ once, so the power rises by one, not two; keep the constant $m + 1$; and use the exponent of the variable asked about.",
        "在联合密度下 $X$ 的期望为 $E[X] = \\iint x\\,f(x, y)\\,dA$。对单位正方形上的密度 $f(x, y) = (m + 1)(n + 1)x^my^n$，对 $y$ 的积分给出因子 $1$，剩下\n\n$$E[X] = (m + 1)\\int_0^1 x^{m+1}\\,dx = \\frac{m + 1}{m + 2},$$\n\n同样 $E[Y] = \\frac{n + 1}{n + 2}$。对 $9x^2y^2$，$E[X] = E[Y] = \\frac{3}{4}$。指数越大，均值越靠近 $1$。\n\n> **注意。** 密度只乘一次 $x$，幂次升高一而不是二；保留常数 $m + 1$；并使用所问变量的指数。",
      ),
      generate(rng: Rng): Problem {
        const m = rng.int(1, 5);
        let n = rng.int(1, 5);
        if (n === m) n = (m % 5) + 1;
        const askX = rng.int(0, 1) === 0;
        const e = askX ? m : n;
        const o = askX ? n : m;
        const ans = Q.of(e + 1, e + 2);
        const pw = (v: string, k: number): string => (k === 1 ? v : `${v}^{${k}}`);
        const xp = m === 1 ? "x" : `x^${m}`;
        const yp = n === 1 ? "y" : `y^${n}`;
        const V = askX ? "X" : "Y";
        const v = askX ? "x" : "y";
        const w = askX ? "y" : "x";
        return numberProblem({
          prompt: t(
            `$(X, Y)$ has joint density $f(x, y) = ${(m + 1) * (n + 1)}${xp}${yp}$ on $[0, 1] \\times [0, 1]$. Find $E[${V}]$.`,
            `$(X, Y)$ 在 $[0, 1] \\times [0, 1]$ 上的联合密度为 $f(x, y) = ${(m + 1) * (n + 1)}${xp}${yp}$。求 $E[${V}]$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(o + 1, o + 2),
              "That is the mean of the other variable; use the exponent of the one asked about.",
              "那是另一个变量的均值；要用所问变量的指数。",
            ),
            why(Q.of(1, 2), "That is the mean of a uniform variable; this density is not flat.", "那是均匀变量的均值；这个密度不是常数。"),
            why(
              Q.of(e + 1, e + 3),
              "That multiplies by the variable twice; $E$ multiplies the density by it once.",
              "那是乘了两次该变量；求期望只把密度乘一次。",
            ),
            why(Q.of(1, e + 2), "That drops the constant of the marginal density.", "那是丢掉了边缘密度的常数。"),
          ]),
          solution: walked(
            [
              [
                ["Find the marginal", "求边缘密度"],
                t(
                  `$\\int_0^1 ${o + 1}${pw(w, o)}\\,d${w} = 1$, so $f_${V}(${v}) = ${e + 1}${pw(v, e)}$.`,
                  `$\\int_0^1 ${o + 1}${pw(w, o)}\\,d${w} = 1$，所以 $f_${V}(${v}) = ${e + 1}${pw(v, e)}$。`,
                ),
              ],
              [
                ["Multiply by the variable and integrate", "乘以变量再积分"],
                t(
                  `$E[${V}] = \\int_0^1 ${e + 1}${pw(v, e + 1)}\\,d${v} = \\frac{${e + 1}}{${e + 2}} = ${ans.toLatex()}$.`,
                  `$E[${V}] = \\int_0^1 ${e + 1}${pw(v, e + 1)}\\,d${v} = \\frac{${e + 1}}{${e + 2}} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The marginal is a density, $\\int_0^1 ${e + 1}${pw(v, e)}\\,d${v} = 1$, and the mean $${ans.toLatex()}$ lies between $\\frac{1}{2}$ and $1$ because the density grows toward $${v} = 1$.`,
              `边缘密度满足 $\\int_0^1 ${e + 1}${pw(v, e)}\\,d${v} = 1$，而密度向 $${v} = 1$ 增大，所以均值 $${ans.toLatex()}$ 介于 $\\frac{1}{2}$ 与 $1$ 之间。`,
            ),
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Export Array
// ---------------------------------------------------------------------------

export const multivariableCalculusApplicationTopics: readonly TopicDef[] = [
  // 6.27 Vector Mechanics
  velocityAndAccelerationAsFunctionsOfDisplacement,
  determiningPropertiesOfObjectsDescribedAsFunctionsOfDisplacement,
  theComponentsOfAcceleration,
  theWorkEnergyPrinciple,
  circularMotionAboutTheOrigin,

  // 6.28 Applications of Multiple Integrals
  theAverageValueOfAMultivariableFunction,
  densityMassAndChargeOfPlaneLaminas,
  momentsAndCenterOfMass,
  momentsAndCentersOfMassOfThinRods,
  momentsAndCentersOfMassOfPlaneLaminas,
  momentsOfInertiaOfLaminasAboutTheCoordinateAxes,
  momentsOfInertiaOfLaminasAboutOtherAxes,
  calculatingTheRadiusOfGyrationOfAPlaneLamina,
  theParallelAxisTheorem,

  // 6.29 Random Variables
  probabilityDensityFunctionsOfContinuousRandomVariables,
  calculatingProbabilitiesWithContinuousRandomVariables,
  continuousRandomVariablesOverInfiniteDomains,
  jointDistributionsForDiscreteRandomVariables,
  jointDistributionsForContinuousRandomVariables,
];
