// Further knowledge points for topics of Partial Differential Equations, each a skill the topic's own
// points leave out. See `deeperPartialDifferentialEquationsPoints`.

import type { KnowledgePointDef } from "@ga/content";
import { Q } from "@ga/subject-math";

import { ask, choose, type Pair, point } from "../university-kit.ts";

/** coef writes a coefficient before a symbol, leaving out 1. */
const coef = (c: number, symbol: string) => (c === 1 ? symbol : c === -1 ? `-${symbol}` : `${c}${symbol}`);

const superposition = point(
  "combining-solutions-by-superposition",
  ["Combining solutions by superposition", "用叠加法合并解"],
  [
    "A linear homogeneous equation has the property that any combination $c_1 u_1 + c_2 u_2$ of solutions is again a solution. This is the principle of superposition, and every series solution relies on it. At a given point, the value of the combination comes straight from the two values there.",
    "线性齐次方程有这样的性质：解的任何组合 $c_1 u_1 + c_2 u_2$ 仍是解。这就是叠加原理，所有级数解都依赖于它。在给定的点，组合的值直接由那里的两个值得出。",
  ],
  (rng) => {
    const [c1, c2] = [rng.int(2, 6), rng.pick([-4, -3, -2, 2, 3, 5])];
    const [v, w] = [rng.int(-9, 9), rng.int(-9, 9)];
    const answer = c1 * v + c2 * w;
    const par = (x: number) => (x < 0 ? `(${x})` : `${x}`);
    const sum = `${c1} \\cdot ${par(v)} ${c2 < 0 ? "-" : "+"} ${Math.abs(c2)} \\cdot ${par(w)}`;
    return ask(
      [
        `$u_1$ and $u_2$ solve the heat equation, with $u_1 = ${v}$ and $u_2 = ${w}$ at some point. What is the value there of the solution $${c1} u_1 ${c2 < 0 ? "-" : "+"} ${Math.abs(c2)} u_2$?`,
        `$u_1$ 和 $u_2$ 是热方程的解，在某点 $u_1 = ${v}$，$u_2 = ${w}$。解 $${c1} u_1 ${c2 < 0 ? "-" : "+"} ${Math.abs(c2)} u_2$ 在那一点的值是多少？`,
      ],
      answer,
      [v + w, c1 * v - c2 * w, c1 * w + c2 * v, c1 + c2].filter((x) => x !== answer),
      [`Substitute: $${sum} = ${answer}$.`, `代入：$${sum} = ${answer}$。`],
    );
  },
);

const typeAtAPoint = point(
  "a-type-that-depends-on-the-point",
  ["A type that depends on the point", "随点变化的类型"],
  [
    "With variable coefficients, the type of a second-order equation can change from point to point. For $u_{xx} + k y u_{yy} = 0$ with $k > 0$, the discriminant has the sign of $-y$. So the equation is elliptic above the $x$-axis, hyperbolic below it, and parabolic on it, as in the study of transonic flow.",
    "系数可变时，二阶方程的类型可能随点变化。对 $u_{xx} + k y u_{yy} = 0$（$k > 0$），判别式的符号与 $-y$ 相同。所以方程在 $x$ 轴上方是椭圆型，下方是双曲型，轴上是抛物型，跨音速流的研究中就有这种情形。",
  ],
  (rng) => {
    const k = rng.int(1, 9);
    const x = rng.int(-5, 5);
    const y = rng.pick([-6, -4, -3, -2, -1, 0, 1, 2, 3, 5, 7]);
    const elliptic: Pair = ["Elliptic", "椭圆型"];
    const hyperbolic: Pair = ["Hyperbolic", "双曲型"];
    const parabolic: Pair = ["Parabolic", "抛物型"];
    return choose(
      rng,
      [
        `What type is $u_{xx} + ${coef(k, "y")} u_{yy} = 0$ at the point $(${x}, ${y})$?`,
        `$u_{xx} + ${coef(k, "y")} u_{yy} = 0$ 在点 $(${x}, ${y})$ 处是什么类型？`,
      ],
      y > 0 ? elliptic : y < 0 ? hyperbolic : parabolic,
      [elliptic, hyperbolic, parabolic],
      [
        `The discriminant is $-4 \\cdot ${coef(k, "y")}$, which at $y = ${y}$ is ${-4 * k * y}.`,
        `判别式是 $-4 \\cdot ${coef(k, "y")}$，在 $y = ${y}$ 处等于 ${-4 * k * y}。`,
      ],
    );
  },
);

const nodes = point(
  "the-nodes-of-a-mode",
  ["The nodes of a mode", "模态的节点"],
  [
    "The mode $\\sin \\frac{n \\pi x}{L}$ is zero at the ends and also at $n - 1$ points inside the interval. These points, called nodes, stay at rest for a standing wave. So a mode with a higher index has more oscillation in space, and it pairs with a higher eigenvalue.",
    "模态 $\\sin \\frac{n \\pi x}{L}$ 在两端为零，在区间内部还有 $n - 1$ 个零点。这些点称为节点，在驻波中保持静止。所以下标越大的模态在空间上振荡越多，对应的特征值也越大。",
  ],
  (rng) => {
    const n = rng.int(2, 12);
    const L = rng.pick([1, 2, 3, 4, 5]);
    const askFirst = rng.bool();
    const answer = askFirst ? Q.of(L, n) : Q.of(n - 1, 1);
    const mode = L === 1 ? `\\sin ${n} \\pi x` : `\\sin \\frac{${n} \\pi x}{${L}}`;
    return ask(
      askFirst
        ? [
            `On $[0, ${L}]$, where is the first zero of $${mode}$ to the right of 0?`,
            `在 $[0, ${L}]$ 上，$${mode}$ 在 0 右边的第一个零点在哪里？`,
          ]
        : [
            `On $[0, ${L}]$, how many zeros does $${mode}$ have strictly inside the interval?`,
            `在 $[0, ${L}]$ 上，$${mode}$ 严格在区间内部有多少个零点？`,
          ],
      answer,
      askFirst
        ? [Q.of(1, n), Q.of(2 * L, n), Q.of(L, 2 * n), Q.of(L, n + 1)]
        : [Q.of(n, 1), Q.of(n + 1, 1), Q.of(2 * n, 1), Q.of(n - 2, 1)],
      [
        askFirst
          ? `The sine first vanishes again when its angle reaches $\\pi$, so $x = ${answer.toLatex()}$.`
          : `Zeros occur at multiples of $\\frac{${L}}{${n}}$, and those strictly inside number $${n} - 1 = ${n - 1}$.`,
        askFirst
          ? `正弦在角度达到 $\\pi$ 时再次为零，所以 $x = ${answer.toLatex()}$。`
          : `零点在 $\\frac{${L}}{${n}}$ 的倍数处，严格在内部的有 $${n} - 1 = ${n - 1}$ 个。`,
      ],
    );
  },
);

const parseval = point(
  "the-integral-of-a-squared-sum-of-modes",
  ["The integral of a squared sum of modes", "模态和平方的积分"],
  [
    "Sine modes on $[0, L]$ are orthogonal, and each has $\\int_0^L \\sin^2 \\frac{n \\pi x}{L} \\, dx = \\frac{L}{2}$. So when a sum of modes is squared and integrated, every cross term vanishes. What remains is $\\frac{L}{2}$ times the sum of the squared coefficients, which measures the size of the data.",
    "$[0, L]$ 上的正弦模态相互正交，每个都有 $\\int_0^L \\sin^2 \\frac{n \\pi x}{L} \\, dx = \\frac{L}{2}$。所以模态和平方后积分，所有交叉项都消失。剩下的是 $\\frac{L}{2}$ 乘系数的平方和，它衡量数据的大小。",
  ],
  (rng) => {
    const [a, b] = [rng.int(1, 6), rng.int(1, 6)];
    const L = rng.int(1, 6);
    const [m, n] = rng.sample([1, 2, 3, 4, 5], 2).sort((x, y) => x - y) as [number, number];
    const answer = Q.of((a * a + b * b) * L, 2);
    const mode = (k: number) => (L === 1 ? `\\sin ${k === 1 ? "" : k} \\pi x` : `\\sin \\frac{${k === 1 ? "" : k} \\pi x}{${L}}`);
    return ask(
      [
        `What is $\\int_0^{${L}} \\left( ${coef(a, mode(m))} + ${coef(b, mode(n))} \\right)^2 dx$?`,
        `$\\int_0^{${L}} \\left( ${coef(a, mode(m))} + ${coef(b, mode(n))} \\right)^2 dx$ 是多少？`,
      ],
      answer,
      [Q.of((a + b) * (a + b) * L, 2), Q.of(a * a + b * b, 2), Q.of((a * a + b * b) * L, 1), Q.of((a + b) * L, 2)],
      [
        `The cross term vanishes, so the integral is $(${a * a} + ${b * b}) \\cdot \\frac{${L}}{2} = ${answer.toLatex()}$.`,
        `交叉项消失，所以积分是 $(${a * a} + ${b * b}) \\cdot \\frac{${L}}{2} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const insulatedAverage = point(
  "the-final-temperature-of-an-insulated-rod",
  ["The final temperature of an insulated rod", "绝热杆的最终温度"],
  [
    "With both ends of a rod insulated, no heat escapes, so the total heat stays constant in time. As the differences smooth out, the temperature tends to a constant value. That value must be the average of the initial temperature over the rod, weighted by the length of each part.",
    "杆的两端绝热时，热量不会散失，所以总热量不随时间变化。随着差异被抹平，温度趋于常数。这个值一定是初始温度在杆上的平均值，按每段的长度加权。",
  ],
  (rng) => {
    const L = rng.pick([2, 3, 4, 5, 6, 8, 10]);
    const cut = rng.int(1, L - 1);
    const [a, b] = [rng.int(10, 90), rng.int(10, 90)];
    const answer = Q.of(a * cut + b * (L - cut), L);
    return ask(
      [
        `An insulated rod of length ${L} starts with a part of length ${cut} at temperature ${a} and the rest at temperature ${b}. What temperature does it approach?`,
        `长度为 ${L} 的绝热杆，开始时长度为 ${cut} 的一段温度是 ${a}，其余部分是 ${b}。它趋于什么温度？`,
      ],
      answer,
      [Q.of(a + b, 2), Q.of(0, 1), Q.of(a * (L - cut) + b * cut, L), Q.of(Math.max(a, b), 1)],
      [
        `The average is $\\frac{${a} \\cdot ${cut} + ${b} \\cdot ${L - cut}}{${L}} = ${answer.toLatex()}$.`,
        `平均值是 $\\frac{${a} \\cdot ${cut} + ${b} \\cdot ${L - cut}}{${L}} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const dAlembert = point(
  "dalemberts-formula-at-a-point",
  ["D'Alembert's formula at a point", "某点处的达朗贝尔公式"],
  [
    "On the whole line, with initial position $f$ and zero initial velocity, the wave equation has the solution $u(x, t) = \\frac{1}{2} \\left( f(x - c t) + f(x + c t) \\right)$. So the initial shape splits into two halves that travel in opposite directions, and the value at any point can be computed directly.",
    "在整条直线上，初始位置为 $f$、初速度为零时，波动方程的解是 $u(x, t) = \\frac{1}{2} \\left( f(x - c t) + f(x + c t) \\right)$。所以初始形状分成两半，朝相反方向传播，任意一点的值都能直接算出。",
  ],
  (rng) => {
    const [c, t, x] = [rng.int(1, 4), rng.int(1, 3), rng.int(-5, 5)];
    const m = rng.int(1, 3);
    const [left, right] = [x - c * t, x + c * t];
    const answer = Q.of(m * (left * left + right * right), 2);
    return ask(
      [
        `For $u_{tt} = ${c * c === 1 ? "" : c * c} u_{xx}$ on the line with $u(x, 0) = ${coef(m, "x^2")}$ and zero initial velocity, what is $u(${x}, ${t})$?`,
        `直线上的 $u_{tt} = ${c * c === 1 ? "" : c * c} u_{xx}$，$u(x, 0) = ${coef(m, "x^2")}$，初速度为零，$u(${x}, ${t})$ 是多少？`,
      ],
      answer,
      [Q.of(m * x * x, 1), Q.of(m * (left * left + right * right), 1), Q.of(m * right * right, 1), Q.of(m * (x * x + c * t), 1)],
      [
        `Here the speed is ${c}, so the formula uses the points ${left} and ${right}, and it gives $\\frac{1}{2} (${m * left * left} + ${m * right * right}) = ${answer.toLatex()}$.`,
        `这里波速是 ${c}，所以公式用到点 ${left} 和 ${right}，得 $\\frac{1}{2} (${m * left * left} + ${m * right * right}) = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const stringSpeed = point(
  "the-speed-from-tension-and-density",
  ["The speed from tension and density", "由张力和密度求波速"],
  [
    "For a string with tension $T$ and linear density $\\rho$, Newton's law gives the wave equation with $c^2 = \\frac{T}{\\rho}$. So tightening a string raises its speed and its pitch, and a heavier string lowers them. The units confirm this, as the ratio has the dimensions of a squared velocity.",
    "对张力为 $T$、线密度为 $\\rho$ 的弦，牛顿定律给出波动方程，其中 $c^2 = \\frac{T}{\\rho}$。所以绷紧弦会提高波速和音高，而更重的弦会降低它们。量纲也证实了这一点，这个比值的量纲是速度的平方。",
  ],
  (rng) => {
    const c = rng.int(2, 12);
    const rho = rng.pick([2, 3, 4, 5, 6, 8, 10]);
    const T = c * c * rho;
    return ask(
      [
        `A string has tension ${T} and linear density ${rho}, in consistent units. What is its wave speed?`,
        `弦的张力是 ${T}，线密度是 ${rho}，单位一致。它的波速是多少？`,
      ],
      c,
      [c * c, T, T * rho, c + 1],
      [`$c^2 = \\frac{${T}}{${rho}} = ${c * c}$, so $c = ${c}$.`, `$c^2 = \\frac{${T}}{${rho}} = ${c * c}$，所以 $c = ${c}$。`],
    );
  },
);

const meanValue = point(
  "the-mean-value-property",
  ["The mean value property", "平均值性质"],
  [
    "A harmonic function equals the average of its values on any circle centered at a point, as long as the closed disc lies in its domain. So the average over a circle can be found with no integration, by evaluating at the center. The maximum principle follows from this property.",
    "调和函数等于它在以某点为心的任何圆上的平均值，只要闭圆盘在定义域内。所以圆上的平均值不用积分，只需在圆心求值就能得到。最大值原理正是由这个性质得出的。",
  ],
  (rng) => {
    const [a, b, c] = [rng.int(1, 5), rng.int(1, 5), rng.int(-9, 9)];
    const [p, q] = [rng.int(-4, 4), rng.int(-4, 4)];
    const r = rng.int(1, 9);
    const answer = a * (p * p - q * q) + b * p * q + c;
    const f = `${coef(a, "(x^2 - y^2)")} + ${coef(b, "x y")} ${c < 0 ? "-" : "+"} ${Math.abs(c)}`;
    return ask(
      [
        `What is the average of the harmonic function $${f}$ on the circle of radius ${r} centered at $(${p}, ${q})$?`,
        `调和函数 $${f}$ 在以 $(${p}, ${q})$ 为心、半径为 ${r} 的圆上的平均值是多少？`,
      ],
      answer,
      [answer + r, answer + r * r, a * (p * p + q * q) + b * p * q + c, c].filter((v) => v !== answer),
      [
        `By the mean value property, the average is the value at the center, which is ${answer}.`,
        `由平均值性质，平均值就是圆心处的值，即 ${answer}。`,
      ],
    );
  },
);

const radialPoisson = point(
  "a-radial-solution-of-poissons-equation",
  ["A radial solution of Poisson's equation", "泊松方程的径向解"],
  [
    "On the disc of radius $R$, the problem $\\Delta u = -f$ with constant $f$ and $u = 0$ on the circle has the solution $u = \\frac{f}{4} (R^2 - r^2)$. Check it directly: $x^2 + y^2$ has laplacian 4. It describes a loaded membrane, deepest at the center and level with the rim at the boundary.",
    "在半径为 $R$ 的圆盘上，常数 $f$ 的问题 $\\Delta u = -f$，圆周上 $u = 0$，其解是 $u = \\frac{f}{4} (R^2 - r^2)$。可以直接验证：$x^2 + y^2$ 的拉普拉斯值是 4。它描述受载的薄膜，中心最深，边界与圆周齐平。",
  ],
  (rng) => {
    const R = rng.int(2, 9);
    const r = rng.int(1, R - 1);
    const f = rng.int(1, 9);
    const answer = Q.of(f * (R * R - r * r), 4);
    return ask(
      [
        `On the disc of radius ${R}, $\\Delta u = -${f}$ with $u = 0$ on the circle. What is $u$ at distance ${r} from the center?`,
        `在半径为 ${R} 的圆盘上，$\\Delta u = -${f}$，圆周上 $u = 0$。距圆心 ${r} 处的 $u$ 是多少？`,
      ],
      answer,
      [Q.of(f * R * R, 4), Q.of(f * (R * R - r * r), 2), Q.of(f * (R - r), 4), Q.of(R * R - r * r, 4)],
      [
        `$u = \\frac{${f}}{4} (${R * R} - ${r * r}) = ${answer.toLatex()}$.`,
        `$u = \\frac{${f}}{4} (${R * R} - ${r * r}) = ${answer.toLatex()}$。`,
      ],
    );
  },
);

/** deeperPartialDifferentialEquationsPoints maps topics of Partial Differential Equations to their further knowledge points. */
export const deeperPartialDifferentialEquationsPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "introduction-to-partial-differential-equations": [superposition],
  "classifying-second-order-equations": [typeAtAPoint],
  "separation-of-variables-for-pdes": [nodes],
  "orthogonal-eigenfunctions-for-pdes": [parseval],
  "solving-the-heat-equation-on-an-interval": [insulatedAverage],
  "the-wave-equation": [dAlembert, stringSpeed],
  "laplaces-equation-in-a-rectangle-and-a-disc": [meanValue],
  "poissons-equation": [radialPoisson],
};
