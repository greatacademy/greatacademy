// Third knowledge points for thin topics of Differential Equations, from first-order
// methods to variation of parameters: the reverse question, a harder case or a common
// trap. See `deeperDifferentialEquationsThirdPoints`.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { linear, paren, poly, Q } from "@ga/subject-math";

import { ask, choose, type Pair, point } from "../university-kit.ts";

/** nz picks a nonzero integer from -r to r. */
const nz = (rng: Rng, r: number) => rng.pick([...Array(2 * r + 1).keys()].map((i) => i - r).filter((i) => i !== 0));
/** expOf writes e to a multiple of x, leaving out a coefficient of 1. */
const expOf = (k: number, v = "x") => `e^{${k === 1 ? "" : k === -1 ? "-" : k}${v}}`;

const integratingFactorPower = point(
  "the-integrating-factor-after-standardizing",
  ["The integrating factor after standardizing", "化为标准形式后的积分因子"],
  [
    "The integrating factor $e^{\\int P \\, dx}$ uses $P$ from the standard form, with $y'$ having coefficient $1$. So divide first. For $axy' + by = g$ on $x > 0$, $P = \\frac{b}{ax}$, which makes the integrating factor $x^{b/a}$.",
    "积分因子 $e^{\\int P \\, dx}$ 中的 $P$ 来自标准形式，即 $y'$ 的系数为 $1$。所以要先相除。对 $x > 0$ 上的 $axy' + by = g$，$P = \\frac{b}{ax}$，所以积分因子是 $x^{b/a}$。",
  ],
  (rng) => {
    const a = rng.int(2, 7);
    const b = nz(rng, 12);
    const answer = Q.of(b, a);
    const g = rng.pick(["x^{2}", "e^{x}", "\\sin x", "7"]);
    return ask(
      [
        `For $x > 0$, an integrating factor of $${a}xy' ${b < 0 ? "-" : "+"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}y = ${g}$ has the form $x^{m}$. Find $m$.`,
        `当 $x > 0$ 时，$${a}xy' ${b < 0 ? "-" : "+"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}y = ${g}$ 的一个积分因子形如 $x^{m}$。求 $m$。`,
      ],
      answer,
      [b, Q.of(a, b), answer.neg()],
      [
        `Dividing by $${a}x$ gives $P(x) = \\frac{${b}}{${a}x}$, so $\\int P \\, dx = ${answer.toLatex()}\\ln x$ and the integrating factor is $x^{${answer.toLatex()}}$.`,
        `除以 $${a}x$ 得 $P(x) = \\frac{${b}}{${a}x}$，所以 $\\int P \\, dx = ${answer.toLatex()}\\ln x$，积分因子是 $x^{${answer.toLatex()}}$。`,
      ],
    );
  },
);

const steadyMean = point(
  "the-mean-level-of-the-steady-state",
  ["The mean level of the steady state", "稳态的平均水平"],
  [
    "When a constant is added to a sinusoidal forcing, linearity splits the response. The constant part gives a steady level $\\frac{c}{k}$ for $y' + ky = c$, and the sinusoid oscillates around it with average zero, so its amplitude does not change the mean level.",
    "当正弦强迫项加上一个常数时，线性使响应分开。常数部分对 $y' + ky = c$ 给出稳定水平 $\\frac{c}{k}$，正弦部分围绕它振荡，平均值为零，所以其振幅不改变平均水平。",
  ],
  (rng) => {
    const k = rng.int(2, 9);
    const m = nz(rng, 9);
    const c = k * m;
    const A = rng.int(2, 40);
    const w = rng.int(1, 9);
    return ask(
      [
        `The steady-state solution of $y' + ${k}y = ${c} + ${A}\\cos ${w === 1 ? "" : w}x$ oscillates around a constant level. Find that level.`,
        `$y' + ${k}y = ${c} + ${A}\\cos ${w === 1 ? "" : w}x$ 的稳态解围绕一个常数水平振荡。求这个水平。`,
      ],
      m,
      [c, Q.of(A, k), Q.of(c + A, k)],
      [
        `The constant forcing has the constant response $\\frac{${c}}{${k}} = ${m}$. The cosine forcing gives a sinusoid with mean zero, so the level is $${m}$.`,
        `常数强迫项的响应是常数 $\\frac{${c}}{${k}} = ${m}$。余弦强迫项给出平均值为零的正弦型函数，所以水平是 $${m}$。`,
      ],
    );
  },
);

const straightLineFromSubstitution = point(
  "straight-line-solutions-from-a-constant-in-v",
  ["Straight-line solutions from a constant in v", "由 v 为常数得到直线解"],
  [
    "After $v = ax + y$, the equation is autonomous in $v$, so its equilibria are worth finding. Each constant $v = m$ means $ax + y = m$, a straight-line solution of the original equation with slope $-a$ and intercept $m$.",
    "代换 $v = ax + y$ 后，方程关于 $v$ 是自治的，所以应当求它的平衡解。每个常数 $v = m$ 就是 $ax + y = m$，这是原方程的一条直线解，斜率为 $-a$，截距为 $m$。",
  ],
  (rng) => {
    const a = rng.int(1, 6);
    const m = rng.int(1, 9);
    const q = a + m * m;
    const inner = poly([a, "x"], [1, "y"]);
    return ask(
      [
        `$y' = (${inner})^{2} - ${q}$ has two straight-line solutions, found by setting $v = ${inner}$ equal to a constant. Find the larger $y$-intercept of the two.`,
        `$y' = (${inner})^{2} - ${q}$ 有两条直线解，令 $v = ${inner}$ 等于常数即可求得。求两者中较大的 $y$ 轴截距。`,
      ],
      m,
      [m * m, -m, q],
      [
        `$v' = ${a} + y' = v^{2} - ${q} + ${a} = v^{2} - ${m * m}$, which is zero when $v = \\pm ${m}$. So the lines are $y = ${poly([-a, "x"])} \\pm ${m}$, and the larger intercept is $${m}$.`,
        `$v' = ${a} + y' = v^{2} - ${q} + ${a} = v^{2} - ${m * m}$，当 $v = \\pm ${m}$ 时为零。所以直线是 $y = ${poly([-a, "x"])} \\pm ${m}$，较大的截距是 $${m}$。`,
      ],
    );
  },
);

const bernoulliCoefficient = point(
  "the-linear-equation-from-a-bernoulli-equation",
  ["The linear equation from a Bernoulli equation", "由伯努利方程得到的线性方程"],
  [
    "For $y' + ky = cy^{n}$, the substitution $v = y^{1 - n}$ gives $v' + (1 - n)kv = (1 - n)c$. Both sides are multiplied by $1 - n$, which is negative for $n \\ge 2$, and this factor is often forgotten or written as $n - 1$.",
    "对 $y' + ky = cy^{n}$，代换 $v = y^{1 - n}$ 得 $v' + (1 - n)kv = (1 - n)c$。两边都乘以 $1 - n$，当 $n \\ge 2$ 时它是负数，这个因子常被漏掉或写成 $n - 1$。",
  ],
  (rng) => {
    const k = nz(rng, 9);
    const c = nz(rng, 9);
    const n = rng.int(2, 5);
    const left = rng.bool();
    const answer = (1 - n) * (left ? k : c);
    const eq = `y' ${k < 0 ? "-" : "+"} ${Math.abs(k) === 1 ? "" : Math.abs(k)}y = ${poly([c, `y^{${n}}`])}`;
    const name = left ? "P" : "Q";
    return ask(
      [
        `The substitution $v = y^{${1 - n}}$ turns $${eq}$ into $v' + Pv = Q$. Find $${name}$.`,
        `代换 $v = y^{${1 - n}}$ 把 $${eq}$ 变成 $v' + Pv = Q$。求 $${name}$。`,
      ],
      answer,
      [-answer, left ? k : c, left ? (1 - n) * c : (1 - n) * k],
      [
        `$v' = ${poly([1 - n, `y^{${-n}}y'`])}$. Multiplying the equation by $${poly([1 - n, `y^{${-n}}`])}$ gives $${poly([1, "v'"], [(1 - n) * k, "v"])} = ${(1 - n) * c}$, so $${name} = ${answer}$.`,
        `$v' = ${poly([1 - n, `y^{${-n}}y'`])}$。方程乘以 $${poly([1 - n, `y^{${-n}}`])}$，得 $${poly([1, "v'"], [(1 - n) * k, "v"])} = ${(1 - n) * c}$，所以 $${name} = ${answer}$。`,
      ],
    );
  },
);

const recognizingHomogeneous = point(
  "recognizing-a-homogeneous-right-side",
  ["Recognizing a homogeneous right side", "识别齐次的右端"],
  [
    "The $v$ substitution works only when the right side depends on $\\frac{y}{x}$ alone, which means every term of the numerator and the denominator has the same total degree. A single term of different degree, such as a constant, breaks this.",
    "只有当右端只依赖于 $\\frac{y}{x}$ 时，$v$ 代换才有效，也就是分子和分母的每一项总次数都相同。只要有一项次数不同（例如一个常数），就不成立。",
  ],
  (rng) => {
    const a = rng.int(2, 9);
    const b = rng.int(2, 9);
    const c = rng.int(1, 9);
    const den = `${b}xy`;
    return choose(
      rng,
      [
        `Which of these equations can be written with its right side as a function of $\\frac{y}{x}$ alone?`,
        `下列哪个方程的右端可以写成只依赖于 $\\frac{y}{x}$ 的函数？`,
      ],
      [`$y' = \\frac{x^{2} + ${a}y^{2}}{${den}}$`, `$y' = \\frac{x^{2} + ${a}y^{2}}{${den}}$`],
      [
        [`$y' = \\frac{x^{2} + ${a}y^{2} + ${c}}{${den}}$`, `$y' = \\frac{x^{2} + ${a}y^{2} + ${c}}{${den}}$`],
        [`$y' = \\frac{x + ${a}y^{2}}{${den}}$`, `$y' = \\frac{x + ${a}y^{2}}{${den}}$`],
        [`$y' = \\frac{x^{2} + ${a}y}{${den}}$`, `$y' = \\frac{x^{2} + ${a}y}{${den}}$`],
      ],
      [
        `In $\\frac{x^{2} + ${a}y^{2}}{${den}}$ every term has degree $2$, so dividing the top and bottom by $x^{2}$ leaves only $\\frac{y}{x}$. Each other choice has a term of a different degree.`,
        `在 $\\frac{x^{2} + ${a}y^{2}}{${den}}$ 中，每一项的次数都是 $2$，所以分子分母同除以 $x^{2}$，只剩下 $\\frac{y}{x}$。其他选项都有次数不同的项。`,
      ],
    );
  },
);

const riccatiLinearKnown = point(
  "riccati-equations-with-a-non-constant-known-solution",
  ["Riccati equations with a non-constant known solution", "已知解不是常数的里卡蒂方程"],
  [
    "The substitution $y = y_{1} + \\frac{1}{u}$ also works when $y_{1}$ depends on $x$, and then the linear equation for $u$ has a variable coefficient. For $y' = y^{2} + \\cdots$ it is $u' = -2y_{1}u - 1$, so the coefficient comes from the known solution.",
    "当 $y_{1}$ 依赖于 $x$ 时，代换 $y = y_{1} + \\frac{1}{u}$ 同样有效，此时 $u$ 的线性方程系数是变量。对 $y' = y^{2} + \\cdots$，它是 $u' = -2y_{1}u - 1$，所以系数来自已知解。",
  ],
  (rng) => {
    const k = rng.int(1, 9);
    const x0 = nz(rng, 6);
    const answer = -2 * k * x0;
    const y1 = poly([k, "x"]);
    return ask(
      [
        `$y_{1} = ${y1}$ solves $y' = ${poly([1, "y^{2}"], [-k * k, "x^{2}"], [k, ""])}$. The substitution $y = y_{1} + \\frac{1}{u}$ gives $u' = g(x)u - 1$. Find $g(${x0})$.`,
        `$y_{1} = ${y1}$ 是 $y' = ${poly([1, "y^{2}"], [-k * k, "x^{2}"], [k, ""])}$ 的解。代换 $y = y_{1} + \\frac{1}{u}$ 得 $u' = g(x)u - 1$。求 $g(${x0})$。`,
      ],
      answer,
      [-answer, -k * x0, -2 * k],
      [
        `$y' = ${k} - \\frac{u'}{u^{2}}$, and the right side becomes $\\frac{${2 * k}x}{u} + \\frac{1}{u^{2}} + ${k}$. So $u' = ${poly([-2 * k, "x"])}u - 1$ and $g(${x0}) = ${answer}$.`,
        `$y' = ${k} - \\frac{u'}{u^{2}}$，右端变成 $\\frac{${2 * k}x}{u} + \\frac{1}{u^{2}} + ${k}$。所以 $u' = ${poly([-2 * k, "x"])}u - 1$，$g(${x0}) = ${answer}$。`,
      ],
    );
  },
);

const clairautThroughPoint = point(
  "clairaut-lines-through-a-given-point",
  ["Clairaut lines through a given point", "过定点的克莱罗直线"],
  [
    "The special d'Alembert equation $y = xy' + g(y')$ is a Clairaut equation, and its general solution is the family of lines $y = cx + g(c)$. To find the solutions through a point, substitute the point and solve for the slope $c$.",
    "特殊的达朗贝尔方程 $y = xy' + g(y')$ 是克莱罗方程，通解是直线族 $y = cx + g(c)$。要求过某点的解，把点代入并解出斜率 $c$。",
  ],
  (rng) => {
    const c1 = rng.int(-6, 5);
    const c2 = c1 + rng.int(1, 6);
    const x0 = -(c1 + c2);
    const y0 = -c1 * c2;
    return ask(
      [
        `The general solution of $y = xy' + (y')^{2}$ is the family of lines $y = cx + c^{2}$. Two of them pass through $(${x0}, ${y0})$. Find the larger value of $c$.`,
        `$y = xy' + (y')^{2}$ 的通解是直线族 $y = cx + c^{2}$。其中两条经过 $(${x0}, ${y0})$。求较大的 $c$。`,
      ],
      c2,
      [c1, -c1, x0],
      [
        `Substituting gives $${poly([1, "c^{2}"], [x0, "c"], [-y0, ""])} = 0$, whose roots are $${c1}$ and $${c2}$. The larger is $${c2}$.`,
        `代入得 $${poly([1, "c^{2}"], [x0, "c"], [-y0, ""])} = 0$，根是 $${c1}$ 和 $${c2}$。较大的是 $${c2}$。`,
      ],
    );
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

const zeroConditions = point(
  "zero-initial-data-force-the-zero-solution",
  ["Zero initial data force the zero solution", "零初值迫使解为零"],
  [
    "By the uniqueness theorem, a solution of a homogeneous linear equation with continuous coefficients is fixed by $y(a)$ and $y'(a)$. If both are zero, it is the zero solution. So no nonzero solution can have a graph that touches the axis with zero slope.",
    "由唯一性定理，系数连续的齐次线性方程的解由 $y(a)$ 和 $y'(a)$ 确定。如果二者都为零，解就是零解。所以非零解的图像不可能以零斜率接触坐标轴。",
  ],
  (rng) => {
    const p = nz(rng, 9);
    const q = nz(rng, 9);
    const a = rng.int(-5, 5);
    const b = a + rng.int(1, 6);
    const eq = poly([1, "y''"], [p, "xy'"], [q, "y"]);
    return choose(
      rng,
      [
        `$y$ solves $${eq} = 0$ with $y(${a}) = 0$ and $y'(${a}) = 0$. What is $y(${b})$?`,
        `$y$ 是 $${eq} = 0$ 的解，且 $y(${a}) = 0$，$y'(${a}) = 0$。$y(${b})$ 是多少？`,
      ],
      ["$0$", "$0$"],
      [
        ["It cannot be determined without solving the equation", "不解方程无法确定"],
        ["It depends on the two arbitrary constants", "取决于两个任意常数"],
        [`$${b - a}$`, `$${b - a}$`],
      ],
      [
        `The zero function satisfies the equation and both conditions. The coefficients are continuous, so the solution is unique, and $y$ is zero everywhere.`,
        `零函数满足方程和两个条件。系数连续，所以解唯一，因此 $y$ 处处为零。`,
      ],
    );
  },
);

const affineCombination = point(
  "combinations-that-solve-a-forced-equation",
  ["Combinations that solve a forced equation", "满足强迫方程的组合"],
  [
    "Superposition for a forced equation has a condition. If $L[y_{1}] = g$ and $L[y_{2}] = g$, then $L[ay_{1} + by_{2}] = (a + b)g$. So the combination solves the same equation only when $a + b = 1$, unlike the homogeneous case, where any combination works.",
    "强迫方程的叠加是有条件的。如果 $L[y_{1}] = g$，$L[y_{2}] = g$，则 $L[ay_{1} + by_{2}] = (a + b)g$。所以只有 $a + b = 1$ 时组合才满足同一方程，这与任何组合都成立的齐次情形不同。",
  ],
  (rng) => {
    const a = rng.pick([-7, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8]);
    const g = rng.pick(["e^{x}", "\\sin x", "x^{2}", "\\cos 2x", "x + 1", "e^{-x}", "7"]);
    const eq = rng.pick(["y'' + 3y' + 2y", "y'' - 4y", "y'' + y", "y'' - y' + 5y"]);
    return ask(
      [
        `$y_{1}$ and $y_{2}$ both solve $${eq} = ${g}$. For which $b$ does $${a}y_{1} + by_{2}$ also solve it?`,
        `$y_{1}$ 和 $y_{2}$ 都是 $${eq} = ${g}$ 的解。当 $b$ 为何值时，$${a}y_{1} + by_{2}$ 也是它的解？`,
      ],
      1 - a,
      [-a, a, 1 + a],
      [
        `Applying the operator to the combination gives $(${a} + b)$ times the right side. This must equal the right side, so $${a} + b = 1$ and $b = ${1 - a}$.`,
        `把算子作用于这个组合，得到 $(${a} + b)$ 乘以右端。它必须等于右端，所以 $${a} + b = 1$，$b = ${1 - a}$。`,
      ],
    );
  },
);

const rateFromWronskian = point(
  "a-rate-from-the-wronskian-of-two-exponentials",
  ["A rate from the Wronskian of two exponentials", "由两个指数函数的朗斯基行列式求速率"],
  [
    "For exponentials, $W(e^{ax}, e^{kx}) = (k - a)e^{(a + k)x}$. Its value at $0$ is $k - a$, in that order, and it vanishes exactly when the rates agree, so two exponentials with different rates are always independent.",
    "对指数函数，$W(e^{ax}, e^{kx}) = (k - a)e^{(a + k)x}$。它在 $0$ 处的值是 $k - a$，注意顺序；它恰好在速率相同时为零，所以速率不同的两个指数函数总是线性无关。",
  ],
  (rng) => {
    const a = nz(rng, 8);
    const w = nz(rng, 9);
    const k = a + w;
    return ask(
      [
        `For $y_{1} = ${expOf(a)}$ and $y_{2} = e^{kx}$, the Wronskian $W(y_{1}, y_{2})$ has the value $${w}$ at $x = 0$. Find $k$.`,
        `对 $y_{1} = ${expOf(a)}$ 和 $y_{2} = e^{kx}$，朗斯基行列式 $W(y_{1}, y_{2})$ 在 $x = 0$ 处的值是 $${w}$。求 $k$。`,
      ],
      k,
      [a - w, w, -w],
      [
        `$W = y_{1}y_{2}' - y_{1}'y_{2}$, which at $0$ is $k - ${paren(a)}$. So $k - ${paren(a)} = ${w}$ and $k = ${k}$.`,
        `$W = y_{1}y_{2}' - y_{1}'y_{2}$，在 $0$ 处等于 $k - ${paren(a)}$。所以 $k - ${paren(a)} = ${w}$，$k = ${k}$。`,
      ],
    );
  },
);

const anotherParticular = point(
  "other-solutions-of-the-same-forced-equation",
  ["Other solutions of the same forced equation", "同一强迫方程的其他解"],
  [
    "A particular solution is not unique. Adding any homogeneous solution gives another one. But doubling the particular part, or dropping part of it, does not work, because the result no longer satisfies the forced equation.",
    "特解不唯一。加上任何齐次解都得到另一个特解。但把特解部分加倍或去掉其中一部分都不行，因为结果不再满足强迫方程。",
  ],
  (rng) => {
    const a = rng.int(1, 6);
    const b = -rng.int(1, 6);
    const p = nz(rng, 9);
    const q = nz(rng, 9);
    const c = nz(rng, 9);
    const part = linear(p, q);
    const general = poly([1, `c_{1}${expOf(a)}`], [1, `c_{2}${expOf(b)}`], [p, "x"], [q, ""]);
    return choose(
      rng,
      [
        `An equation has the general solution $y = ${general}$. Which of these also solves it?`,
        `一个方程的通解是 $y = ${general}$。下列哪一个也是它的解？`,
      ],
      [`$y = ${poly([p, "x"], [q, ""], [c, expOf(a)])}$`, `$y = ${poly([p, "x"], [q, ""], [c, expOf(a)])}$`],
      [
        [`$y = ${poly([c, expOf(a)], [c, expOf(b)])}$`, `$y = ${poly([c, expOf(a)], [c, expOf(b)])}$`],
        [`$y = ${linear(2 * p, 2 * q)}$`, `$y = ${linear(2 * p, 2 * q)}$`],
        [`$y = ${poly([p, "x"], [c, expOf(a)])}$`, `$y = ${poly([p, "x"], [c, expOf(a)])}$`],
      ],
      [
        `Taking $c_{1} = ${c}$ and $c_{2} = 0$ keeps the particular part $${part}$ whole. The other forms change or drop the particular part, so they are not of the general form.`,
        `取 $c_{1} = ${c}$，$c_{2} = 0$，完整保留了特解部分 $${part}$。其他形式改变或去掉了特解部分，所以不符合通解的形式。`,
      ],
    );
  },
);

const coefficientFromWronskianDecay = point(
  "the-coefficient-from-how-the-wronskian-changes",
  ["The coefficient from how the Wronskian changes", "由朗斯基行列式的变化求系数"],
  [
    "Abel's identity can be read in reverse. For $y'' + Py' + Qy = 0$ with constant $P$, $W(x) = W(0)e^{-Px}$. So two values of the Wronskian determine $P$, while $Q$ plays no part, and the minus sign means that positive $P$ makes $W$ shrink.",
    "阿贝尔恒等式可以反过来读。对常数 $P$ 的 $y'' + Py' + Qy = 0$，$W(x) = W(0)e^{-Px}$。所以朗斯基行列式的两个值决定 $P$，而 $Q$ 不起作用；负号说明正的 $P$ 使 $W$ 缩小。",
  ],
  (rng) => {
    const P = nz(rng, 5);
    const w = rng.pick([1, 2, 3, 5, 6, 7]);
    const value = Q.of(w).mul(Q.of(2).pow(-P));
    const eq = `y'' + Py' + ${rng.int(2, 9)}y = 0`;
    return ask(
      [
        `Two solutions of $${eq}$ have Wronskian $W(0) = ${w}$ and $W(\\ln 2) = ${value.toLatex()}$. Find the constant $P$.`,
        `$${eq}$ 的两个解的朗斯基行列式满足 $W(0) = ${w}$，$W(\\ln 2) = ${value.toLatex()}$。求常数 $P$。`,
      ],
      P,
      [-P, 2 ** Math.abs(P), Q.of(P, 2)],
      [
        `$W(\\ln 2) = ${w}e^{-P\\ln 2} = ${w} \\cdot 2^{-P}$. Here the ratio $W(\\ln 2) \\div W(0)$ is $2^{${-P}}$, so $P = ${P}$.`,
        `$W(\\ln 2) = ${w}e^{-P\\ln 2} = ${w} \\cdot 2^{-P}$。这里比值 $W(\\ln 2) \\div W(0)$ 是 $2^{${-P}}$，所以 $P = ${P}$。`,
      ],
    );
  },
);

const quadraticForcing = point(
  "the-constant-term-under-quadratic-forcing",
  ["The constant term under quadratic forcing", "二次强迫项下的常数项"],
  [
    "For quadratic forcing, try $y_{p} = Ax^{2} + Bx + C$ and match coefficients from the highest power down. The constant term of the equation collects three contributions, $2A + aB + bC$, so the constant $C$ is not simply the forcing constant divided by $b$.",
    "对二次强迫项，设 $y_{p} = Ax^{2} + Bx + C$，从最高次幂开始比较系数。方程的常数项有三个来源：$2A + aB + bC$，所以 $C$ 并不只是强迫项的常数除以 $b$。",
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
    return ask(
      [
        `The equation $${eq} = ${g}$ has a particular solution $y_{p} = Ax^{2} + Bx + C$. Find $C$.`,
        `方程 $${eq} = ${g}$ 有特解 $y_{p} = Ax^{2} + Bx + C$。求 $C$。`,
      ],
      C,
      [Q.of(g0, b), A, B],
      [
        `Matching $x^{2}$ gives $A = ${A}$, and matching $x$ gives $B = ${B}$. The constant term needs $2A + ${paren(a)}B + ${paren(b)}C = ${g0}$, so $C = ${C}$.`,
        `比较 $x^{2}$ 的系数得 $A = ${A}$，比较 $x$ 的系数得 $B = ${B}$。常数项要求 $2A + ${paren(a)}B + ${paren(b)}C = ${g0}$，所以 $C = ${C}$。`,
      ],
    );
  },
);

const resonance = point(
  "the-coefficient-at-resonance",
  ["The coefficient at resonance", "共振时的系数"],
  [
    "When the forcing frequency equals the natural frequency, $A\\cos\\omega t$ solves the homogeneous equation and cannot be a particular solution. The right form has a factor of $t$, and for $y'' + \\omega^{2}y = F\\cos\\omega t$ it is $y_{p} = \\frac{F}{2\\omega}t\\sin\\omega t$.",
    "当强迫频率等于固有频率时，$A\\cos\\omega t$ 满足齐次方程，不可能是特解。正确的形式带有因子 $t$，对 $y'' + \\omega^{2}y = F\\cos\\omega t$，它是 $y_{p} = \\frac{F}{2\\omega}t\\sin\\omega t$。",
  ],
  (rng) => {
    const w = rng.int(1, 9);
    const F = nz(rng, 40);
    const answer = Q.of(F, 2 * w);
    const c = w === 1 ? "" : w;
    const eq = `${poly([1, "y''"], [w * w, "y"])} = ${poly([F, `\\cos ${c}t`])}`;
    const second = poly([2 * w, `A\\cos ${c}t`], [-w * w, `At\\sin ${c}t`]);
    const cancel = poly([w * w, "y_{p}"]);
    return ask(
      [
        `The equation $${eq}$ has a particular solution $y_{p} = At\\sin ${c}t$. Find $A$.`,
        `方程 $${eq}$ 有特解 $y_{p} = At\\sin ${c}t$。求 $A$。`,
      ],
      answer,
      [Q.of(F, w), Q.of(F, w * w), answer.neg()],
      [
        `$y_{p}'' = ${second}$. The terms with $t$ cancel with $${cancel}$, which leaves $${2 * w}A = ${F}$, so $A = ${answer.toLatex()}$.`,
        `$y_{p}'' = ${second}$。含 $t$ 的项与 $${cancel}$ 抵消，剩下 $${2 * w}A = ${F}$，所以 $A = ${answer.toLatex()}$。`,
      ],
    );
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

const dependentVectors = point(
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
);

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
