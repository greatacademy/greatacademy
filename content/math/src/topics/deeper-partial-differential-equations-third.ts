// Third knowledge points for thin topics of Partial Differential Equations: the reverse question,
// a harder case or a common trap. See `deeperPartialDifferentialEquationsThirdPoints`.

import type { KnowledgePointDef } from "@ga/content";
import { Q } from "@ga/subject-math";

import { ask, point } from "../university-kit.ts";

const decayRate = point(
  "the-decay-rate-of-a-matched-mode",
  ["The decay rate of a matched mode", "匹配模态的衰减率"],
  [
    "Once the initial data is matched by a sine series, each mode evolves separately. For $u_t = k u_{xx}$ on $[0, L]$, the mode $\\sin\\frac{n\\pi x}{L}$ decays like $e^{-\\lambda t}$ with $\\lambda = k \\frac{n^{2}\\pi^{2}}{L^{2}}$, so higher modes die out much faster.",
    "初始数据用正弦级数匹配之后，每个模态各自演化。对 $[0, L]$ 上的 $u_t = k u_{xx}$，模态 $\\sin\\frac{n\\pi x}{L}$ 按 $e^{-\\lambda t}$ 衰减，其中 $\\lambda = k \\frac{n^{2}\\pi^{2}}{L^{2}}$，所以高阶模态衰减得快得多。",
  ],
  (rng) => {
    const k = rng.int(1, 6);
    const n = rng.int(2, 5);
    const L = rng.pick([1, 2, 3, 4, 5, 6].filter((v) => ![2, 3, 5].some((p) => n % p === 0 && v % p === 0)));
    const b = rng.int(2, 9);
    const answer = Q.of(k * n * n, L * L);
    const mode = L === 1 ? `${n}\\pi x` : `\\frac{${n}\\pi x}{${L}}`;
    const equation = k === 1 ? "u_t = u_{xx}" : `u_t = ${k} u_{xx}`;
    return ask(
      [
        `For $${equation}$ on $[0, ${L}]$ with zero ends and $u(x, 0) = ${b}\\sin\\left(${mode}\\right)$, the solution is $${b}e^{-\\lambda t}\\sin\\left(${mode}\\right)$ with $\\lambda = K\\pi^{2}$. What is $K$?`,
        `对 $[0, ${L}]$ 上的 $${equation}$，两端为零，$u(x, 0) = ${b}\\sin\\left(${mode}\\right)$，解是 $${b}e^{-\\lambda t}\\sin\\left(${mode}\\right)$，其中 $\\lambda = K\\pi^{2}$。$K$ 是多少？`,
      ],
      answer,
      [Q.of(k * n, L), Q.of(k * n * n, L), Q.of(n * n, L * L)],
      [
        `Substituting the mode into the equation gives $\\lambda = ${k} \\cdot \\frac{${n}^{2}\\pi^{2}}{${L}^{2}}$, so $K = ${answer.toLatex()}$.`,
        `把模态代入方程，得 $\\lambda = ${k} \\cdot \\frac{${n}^{2}\\pi^{2}}{${L}^{2}}$，所以 $K = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const sourceBreaksMaximum = point(
  "a-source-breaks-the-maximum-principle",
  ["A source breaks the maximum principle", "热源破坏最大值原理"],
  [
    "The maximum principle says that the largest temperature occurs initially or at the ends, but only for the equation without a source. With a heat source, the interior can grow hotter than all the initial and boundary data, and the steady state shows how much hotter.",
    "最大值原理说最高温度出现在初始时刻或两端，但这只对无热源的方程成立。有热源时，内部可以比所有初始和边界数据都热，稳态说明了热多少。",
  ],
  (rng) => {
    const k = rng.int(1, 6);
    const q = rng.int(1, 12);
    const L = rng.int(1, 6);
    const answer = Q.of(q * L * L, 8 * k);
    const equation = k === 1 ? `u_t = u_{xx} + ${q}` : `u_t = ${k} u_{xx} + ${q}`;
    return ask(
      [
        `A rod on $[0, ${L}]$ has $${equation}$, with $u = 0$ at both ends and at $t = 0$. In the long run, what is the highest temperature in the rod?`,
        `$[0, ${L}]$ 上的杆满足 $${equation}$，两端和 $t = 0$ 时都有 $u = 0$。长时间后，杆上的最高温度是多少？`,
      ],
      answer,
      [Q.of(q * L * L, 2 * k), Q.of(q * L, 8 * k), 0],
      [
        `The steady state solves $${k} u'' + ${q} = 0$ with zero ends, so $u = \\frac{${q}}{${2 * k}} x (${L} - x)$. Its maximum is at the middle, where it equals $${answer.toLatex()}$.`,
        `稳态满足 $${k} u'' + ${q} = 0$，两端为零，所以 $u = \\frac{${q}}{${2 * k}} x (${L} - x)$。它的最大值在中点，等于 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const insulatedSource = point(
  "a-steady-state-with-an-insulated-end",
  ["A steady state with an insulated end", "一端绝热的稳态"],
  [
    "When one end of a rod with a source is insulated, the steady state is no longer symmetric. Integrating $u'' = -\\frac{q}{k}$ twice and applying $u_x(L) = 0$ gives $u = \\frac{q}{k}\\left(Lx - \\frac{x^{2}}{2}\\right)$, which is largest at the insulated end.",
    "当有热源的杆的一端绝热时，稳态不再对称。对 $u'' = -\\frac{q}{k}$ 积分两次，并利用 $u_x(L) = 0$，得 $u = \\frac{q}{k}\\left(Lx - \\frac{x^{2}}{2}\\right)$，它在绝热端最大。",
  ],
  (rng) => {
    const k = rng.int(2, 6);
    const q = rng.int(1, 12);
    const L = rng.int(2, 6);
    const x = rng.int(1, L);
    const answer = Q.of(q * (2 * L * x - x * x), 2 * k);
    const equation = `u_t = ${k} u_{xx} + ${q}`;
    return ask(
      [
        `Find the steady state of $${equation}$ on $[0, ${L}]$ with $u(0) = 0$ and $u_x(${L}) = 0$. What is its value at $x = ${x}$?`,
        `求 $[0, ${L}]$ 上 $${equation}$ 在 $u(0) = 0$，$u_x(${L}) = 0$ 下的稳态。它在 $x = ${x}$ 处的值是多少？`,
      ],
      answer,
      [Q.of(q * x * (L - x), 2 * k).isZero() ? Q.of(q * L, k) : Q.of(q * x * (L - x), 2 * k), Q.of(q * L * x, k), Q.of(q * x * x, 2 * k)],
      [
        `Integrating twice with these conditions gives $u = \\frac{${q}}{${k}}\\left(${L}x - \\frac{x^{2}}{2}\\right)$. At $x = ${x}$ this equals $${answer.toLatex()}$.`,
        `在这些条件下积分两次，得 $u = \\frac{${q}}{${k}}\\left(${L}x - \\frac{x^{2}}{2}\\right)$。在 $x = ${x}$ 处它等于 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const robinBothEnds = point(
  "the-slope-with-robin-conditions-at-both-ends",
  ["The slope with Robin conditions at both ends", "两端都是罗宾条件时的斜率"],
  [
    "A steady rod has a straight-line temperature $u = u(0) + mx$. With Robin conditions at both ends, the unknowns $u(0)$ and $m$ satisfy two linear equations. The heat flow through the rod is limited by both end transfers, so the slope is below $\\frac{T_2 - T_1}{L}$.",
    "稳态杆的温度是直线 $u = u(0) + mx$。两端都是罗宾条件时，未知数 $u(0)$ 和 $m$ 满足两个线性方程。通过杆的热流受两端传热的限制，所以斜率小于 $\\frac{T_2 - T_1}{L}$。",
  ],
  (rng) => {
    const h = rng.int(1, 5);
    const L = rng.int(1, 6);
    const T1 = rng.int(5, 40);
    const T2 = T1 + rng.int(3, 40);
    const gap = T2 - T1;
    const answer = Q.of(h * gap, 2 + h * L);
    const factor = h === 1 ? "" : `${h}`;
    return ask(
      [
        `A rod on $[0, ${L}]$ is steady, with $u_x(0) = ${factor}(u(0) - ${T1})$ and $u_x(${L}) = -${factor}(u(${L}) - ${T2})$. What is the slope of its temperature?`,
        `$[0, ${L}]$ 上的杆处于稳态，且 $u_x(0) = ${factor}(u(0) - ${T1})$，$u_x(${L}) = -${factor}(u(${L}) - ${T2})$。它的温度的斜率是多少？`,
      ],
      answer,
      [Q.of(gap, L), Q.of(h * gap, 1 + h * L), Q.of(h * gap, 2 + L)],
      [
        `Let the slope be $m$. The first condition gives $u(0) = ${T1} + \\frac{m}{${h}}$, and the second gives $m = -${h}\\left(u(0) + ${L}m - ${T2}\\right)$. Solving gives $m = \\frac{${h} \\cdot ${gap}}{${2 + h * L}} = ${answer.toLatex()}$.`,
        `设斜率为 $m$。第一个条件给出 $u(0) = ${T1} + \\frac{m}{${h}}$，第二个条件给出 $m = -${h}\\left(u(0) + ${L}m - ${T2}\\right)$。解得 $m = \\frac{${h} \\cdot ${gap}}{${2 + h * L}} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const velocityDependence = point(
  "a-value-from-an-initial-velocity",
  ["A value from an initial velocity", "由初速度求值"],
  [
    "With zero displacement, d'Alembert's formula gives $u(x, t) = \\frac{1}{2c}\\int_{x - ct}^{x + ct} g$. So only the initial velocity inside the domain of dependence counts, and for a constant velocity on an interval, the value is proportional to the overlap of this interval with the domain.",
    "初始位移为零时，达朗贝尔公式给出 $u(x, t) = \\frac{1}{2c}\\int_{x - ct}^{x + ct} g$。所以只有依赖域内的初速度起作用，对区间上的常数初速度，值与这个区间和依赖域的重叠长度成正比。",
  ],
  (rng) => {
    const c = rng.int(1, 5);
    const t = rng.int(1, 4);
    const a = rng.int(-6, 4);
    const b = a + rng.int(1, 8);
    const v = rng.int(1, 9);
    const x = rng.int(a - c * t + 1, b + c * t - 1);
    const lo = Math.max(a, x - c * t);
    const hi = Math.min(b, x + c * t);
    const overlap = hi - lo;
    const answer = Q.of(v * overlap, 2 * c);
    return ask(
      [
        `A string with wave speed $${c}$ starts with zero displacement. Its initial velocity is $${v}$ on $[${a}, ${b}]$ and $0$ elsewhere. What is $u(${x}, ${t})$?`,
        `波速为 $${c}$ 的弦初始位移为零。初速度在 $[${a}, ${b}]$ 上为 $${v}$，其他地方为 $0$。$u(${x}, ${t})$ 是多少？`,
      ],
      answer,
      [Q.of(v * overlap, c), Q.of(v * overlap), Q.of(v * (b - a), 2 * c).eq(answer) ? answer.add(Q.of(1)) : Q.of(v * (b - a), 2 * c)],
      [
        `The domain of dependence is $[${x - c * t}, ${x + c * t}]$, which overlaps the interval in length $${overlap}$. So $u = \\frac{1}{${2 * c}} \\cdot ${v} \\cdot ${overlap} = ${answer.toLatex()}$.`,
        `依赖域是 $[${x - c * t}, ${x + c * t}]$，它与这个区间的重叠长度是 $${overlap}$。所以 $u = \\frac{1}{${2 * c}} \\cdot ${v} \\cdot ${overlap} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const mixedEndPeriod = point(
  "the-period-with-one-fixed-and-one-free-end",
  ["The period with one fixed and one free end", "一端固定一端自由时的周期"],
  [
    "A pulse flips sign at a fixed end but not at a free end. On a string with one of each, one round trip of length $2L$ returns the pulse with the opposite sign, so it takes two round trips, a time $\\frac{4L}{c}$, to return to its original state.",
    "脉冲在固定端翻转符号，在自由端不翻转。在一端固定一端自由的弦上，长度为 $2L$ 的一次往返使脉冲以相反的符号返回，所以需要两次往返，即时间 $\\frac{4L}{c}$，才能回到原来的状态。",
  ],
  (rng) => {
    const L = rng.int(1, 12);
    const c = rng.int(2, 9);
    const answer = Q.of(4 * L, c);
    return ask(
      [
        `A string of length $${L}$ has one fixed end and one free end, with wave speed $${c}$. After what smallest time does every pulse return to its starting position, direction and sign?`,
        `长度为 $${L}$ 的弦一端固定，一端自由，波速为 $${c}$。经过多长的最短时间，每个脉冲都回到原来的位置、方向和符号？`,
      ],
      answer,
      [Q.of(2 * L, c), Q.of(L, c), Q.of(8 * L, c)],
      [
        `One round trip takes $\\frac{${2 * L}}{${c}}$ and meets the fixed end once, so the sign is reversed. Two round trips restore it, which takes $${answer.toLatex()}$.`,
        `一次往返用时 $\\frac{${2 * L}}{${c}}$，遇到固定端一次，所以符号相反。两次往返使它恢复，用时 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const equalEnergy = point(
  "the-amplitude-that-matches-an-energy",
  ["The amplitude that matches an energy", "匹配能量的振幅"],
  [
    "In suitable units, mode $n$ with amplitude $A$ has energy $n^{2}A^{2}$. So a higher mode carries more energy at the same amplitude. To carry the same energy as another mode, its amplitude must be smaller by the ratio of the mode numbers, not by the ratio of their squares.",
    "在适当的单位下，振幅为 $A$ 的模态 $n$ 的能量是 $n^{2}A^{2}$。所以振幅相同时，高阶模态携带更多能量。要携带与另一模态相同的能量，它的振幅要按模态数之比缩小，而不是按平方之比缩小。",
  ],
  (rng) => {
    const [m, n] = rng.sample([1, 2, 3, 4, 5, 6, 7, 8], 2) as [number, number];
    const A = rng.int(1, 9);
    const answer = Q.of(m * A, n);
    return ask(
      [
        `In units where mode $n$ with amplitude $A$ has energy $n^{2}A^{2}$, mode $${m}$ has amplitude $${A}$. What amplitude must mode $${n}$ have to carry the same energy?`,
        `在模态 $n$ 振幅为 $A$ 时能量为 $n^{2}A^{2}$ 的单位下，模态 $${m}$ 的振幅是 $${A}$。模态 $${n}$ 的振幅应为多少才能携带相同的能量？`,
      ],
      answer,
      [Q.of(n * A, m), Q.of(m * m * A, n * n), Q.of(A)],
      [
        `The energy of mode $${m}$ is $${m * m * A * A}$. Setting $${n * n}B^{2}$ equal to it gives $B = ${answer.toLatex()}$.`,
        `模态 $${m}$ 的能量是 $${m * m * A * A}$。令 $${n * n}B^{2}$ 等于它，得 $B = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const slowestDecay = point(
  "the-slow-rate-of-an-overdamped-mode",
  ["The slow rate of an overdamped mode", "过阻尼模态的慢速率"],
  [
    "A mode of a damped string that does not oscillate satisfies an equation with two real negative roots, and so it is a sum of two decaying exponentials. In the long run the smaller rate wins, because the term with the larger rate dies out first.",
    "阻尼弦中不振荡的模态满足一个有两个负实根的方程，所以它是两个衰减指数的和。长时间后，较小的速率起决定作用，因为速率较大的项先消失。",
  ],
  (rng) => {
    const r = rng.int(1, 12);
    const s = r + rng.int(1, 12);
    return ask(
      [
        `A mode of a damped string satisfies $T'' + ${r + s} T' + ${r * s} T = 0$. In the long run, $T$ behaves like a constant times $e^{-\\rho t}$. What is $\\rho$?`,
        `阻尼弦的一个模态满足 $T'' + ${r + s} T' + ${r * s} T = 0$。长时间后，$T$ 的行为类似常数乘 $e^{-\\rho t}$。$\\rho$ 是多少？`,
      ],
      r,
      [s, r + s, Q.of(r + s, 2)],
      [
        `The characteristic equation factors as $(\\rho - ${r})(\\rho - ${s}) = 0$ for the rates, which are $${r}$ and $${s}$. The term with rate $${s}$ dies out first, so $\\rho = ${r}$.`,
        `对于速率，特征方程分解为 $(\\rho - ${r})(\\rho - ${s}) = 0$，速率是 $${r}$ 和 $${s}$。速率为 $${s}$ 的项先消失，所以 $\\rho = ${r}$。`,
      ],
    );
  },
);

const rectangularDrum = point(
  "a-frequency-of-a-rectangular-drum",
  ["A frequency of a rectangular drum", "矩形鼓的频率"],
  [
    "On a rectangle with sides $a$ and $b$, the mode $(m, n)$ has frequency $\\omega = c\\pi\\sqrt{\\frac{m^{2}}{a^{2}} + \\frac{n^{2}}{b^{2}}}$. Each mode number is divided by its own side, so the two directions no longer play the same role as they do on a square.",
    "在边长为 $a$ 和 $b$ 的矩形上，模态 $(m, n)$ 的频率是 $\\omega = c\\pi\\sqrt{\\frac{m^{2}}{a^{2}} + \\frac{n^{2}}{b^{2}}}$。每个模态数除以各自的边长，所以两个方向不再像正方形上那样地位相同。",
  ],
  (rng) => {
    const [a, b] = rng.sample([2, 3, 4, 5, 6], 2) as [number, number];
    const c = rng.int(1, 5);
    const m = rng.int(1, 4);
    const n = rng.int(1, 4);
    const inner = Q.of(m * m, a * a).add(Q.of(n * n, b * b));
    const answer = inner.mul(Q.of(c * c));
    return ask(
      [
        `A rectangular membrane has sides $${a}$ and $${b}$ and wave speed $${c}$. Its mode $(m, n) = (${m}, ${n})$ has frequency $\\omega$, with $m$ belonging to the side $${a}$. What is $\\frac{\\omega^{2}}{\\pi^{2}}$?`,
        `矩形膜的边长为 $${a}$ 和 $${b}$，波速为 $${c}$。它的模态 $(m, n) = (${m}, ${n})$ 的频率为 $\\omega$，其中 $m$ 对应边长 $${a}$。$\\frac{\\omega^{2}}{\\pi^{2}}$ 是多少？`,
      ],
      answer,
      [
        inner.mul(Q.of(c)).eq(answer) ? answer.add(Q.of(1)) : inner.mul(Q.of(c)),
        Q.of(m * m, b * b)
          .add(Q.of(n * n, a * a))
          .mul(Q.of(c * c)),
        Q.of(c * c * (m * m + n * n), a * b),
      ],
      [
        `The frequency formula gives $\\frac{\\omega^{2}}{\\pi^{2}} = ${c}^{2}\\left(\\frac{${m * m}}{${a * a}} + \\frac{${n * n}}{${b * b}}\\right) = ${answer.toLatex()}$.`,
        `频率公式给出 $\\frac{\\omega^{2}}{\\pi^{2}} = ${c}^{2}\\left(\\frac{${m * m}}{${a * a}} + \\frac{${n * n}}{${b * b}}\\right) = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const stepCount = point(
  "the-work-of-a-stable-wave-computation",
  ["The work of a stable wave computation", "稳定波动计算的工作量"],
  [
    "Stability of the leapfrog scheme requires $\\Delta t \\le \\frac{\\Delta x}{c}$. So refining the grid also forces smaller time steps, in proportion to $\\Delta x$. This differs from the explicit heat scheme, where the time step must shrink like $\\Delta x^{2}$.",
    "蛙跳格式的稳定性要求 $\\Delta t \\le \\frac{\\Delta x}{c}$。所以加密网格也迫使时间步按 $\\Delta x$ 的比例缩小。这与显式热方程格式不同，那里时间步必须按 $\\Delta x^{2}$ 缩小。",
  ],
  (rng) => {
    const c = rng.int(2, 9);
    const k = rng.int(2, 20);
    const T = rng.int(1, 9);
    const answer = T * c * k;
    return ask(
      [
        `A leapfrog computation has wave speed $${c}$ and $\\Delta x = \\frac{1}{${k}}$. What is the smallest number of stable time steps needed to reach $t = ${T}$?`,
        `蛙跳计算的波速为 $${c}$，$\\Delta x = \\frac{1}{${k}}$。到达 $t = ${T}$ 至少需要多少个稳定的时间步？`,
      ],
      answer,
      [T * c * k * k, T * k, T * c],
      [
        `The largest stable step is $\\Delta t = \\frac{1}{${c * k}}$. Reaching $t = ${T}$ therefore takes $${T} \\cdot ${c * k} = ${answer}$ steps.`,
        `最大的稳定步长是 $\\Delta t = \\frac{1}{${c * k}}$。所以到达 $t = ${T}$ 需要 $${T} \\cdot ${c * k} = ${answer}$ 步。`,
      ],
    );
  },
);

const backwardHeat = point(
  "how-fast-the-backward-heat-equation-amplifies",
  ["How fast the backward heat equation amplifies", "逆向热方程的放大速度"],
  [
    "The backward heat equation $u_t = -k u_{xx}$ is ill posed because its modes grow instead of decay, and the growth rate $k n^{2}$ is unbounded as $n$ increases. So even a tiny high-frequency change in the data can cause an enormous change later, and continuous dependence on the data fails.",
    "逆向热方程 $u_t = -k u_{xx}$ 是不适定的，因为它的模态增长而不是衰减，而且增长率 $k n^{2}$ 随 $n$ 增大而无界。所以数据中即使极小的高频变化也可能在之后引起巨大的变化，对数据的连续依赖性不成立。",
  ],
  (rng) => {
    const k = rng.int(1, 5);
    const n = rng.int(2, 12);
    const T = rng.int(1, 5);
    const answer = k * n * n * T;
    const equation = k === 1 ? "u_t = -u_{xx}" : `u_t = -${k} u_{xx}`;
    return ask(
      [
        `For $${equation}$ on $[0, \\pi]$ with zero ends, the data $\\varepsilon \\sin ${n}x$ grows by the factor $e^{K}$ by time $t = ${T}$. What is $K$?`,
        `对 $[0, \\pi]$ 上的 $${equation}$，两端为零，数据 $\\varepsilon \\sin ${n}x$ 到时刻 $t = ${T}$ 增长了 $e^{K}$ 倍。$K$ 是多少？`,
      ],
      answer,
      [-answer, k * n * T, n * n * T === answer ? answer + 1 : n * n * T],
      [
        `Substituting $e^{\\lambda t}\\sin ${n}x$ gives $\\lambda = ${k} \\cdot ${n}^{2} = ${k * n * n}$. Over time $${T}$, this gives $K = ${answer}$.`,
        `代入 $e^{\\lambda t}\\sin ${n}x$，得 $\\lambda = ${k} \\cdot ${n}^{2} = ${k * n * n}$。经过时间 $${T}$，得 $K = ${answer}$。`,
      ],
    );
  },
);

/** deeperPartialDifferentialEquationsThirdPoints maps topics of Partial Differential Equations to a third knowledge point. */
export const deeperPartialDifferentialEquationsThirdPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "matching-initial-data-with-fourier-series": [decayRate],
  "the-maximum-principle-for-heat": [sourceBreaksMaximum],
  "nonhomogeneous-heat-problems": [insulatedSource],
  "robin-boundary-conditions": [robinBothEnds],
  "domains-of-dependence": [velocityDependence],
  "reflection-at-a-boundary": [mixedEndPeriod],
  "energy-of-a-vibrating-string": [equalEnergy],
  "damped-waves": [slowestDecay],
  "the-vibrating-membrane": [rectangularDrum],
  "finite-differences-for-the-wave-equation": [stepCount],
  "well-posed-problems": [backwardHeat],
};
