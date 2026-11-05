// The rest of a first course in Partial Differential Equations: conservation laws, Sturm-Liouville problems,
// transforms, sources, Green's functions, images, higher dimensions, special functions, and numerical stability.

import type { TopicDef } from "@ga/content";
import { Q } from "@ga/subject-math";

import { ask, choose, point, same, topic } from "../university-kit.ts";

const conservationLaws = topic(
  "conservation-laws-and-traffic-flow",
  ["Conservation Laws and Traffic Flow", "守恒律和交通流"],
  ["Write a density equation from a flux, and read wave and shock speeds from it.", "由通量写出密度方程，并从中读出波速和激波速度。"],
  ["nonlinear-transport-and-shocks"],
  [],
  [
    point(
      "the-change-in-total-mass",
      ["The change in total mass", "总质量的变化"],
      [
        "A conservation law $u_t + q_x = 0$ says that the amount in a stretch of road changes only through its ends. So the rate of change of the total is the flux in at the left minus the flux out at the right.",
        "守恒律 $u_t + q_x = 0$ 说明一段路上的总量只通过两端变化。所以总量的变化率是左端流入的通量减去右端流出的通量。",
      ],
      (rng) => {
        const a = rng.int(1, 40);
        const b = rng.int(1, 40);
        const t = rng.int(2, 9);
        const start = rng.int(50, 200);
        return ask(
          [
            `A road section holds ${start} cars. Cars enter at the rate ${a} per minute and leave at the rate ${b} per minute. How many cars does it hold after ${t} minutes?`,
            `一段路上有 ${start} 辆车。车以每分钟 ${a} 辆的速率进入，以每分钟 ${b} 辆的速率离开。${t} 分钟后这段路上有多少辆车？`,
          ],
          start + (a - b) * t,
          [start + (b - a) * t, start + a * t, start + (a + b) * t],
          [
            `The total changes at the rate in minus out, which is $${a} - ${b}$ per minute.`,
            `总量的变化率是流入减流出，即每分钟 $${a} - ${b}$。`,
          ],
        );
      },
    ),
    point(
      "the-speed-of-a-small-wave",
      ["The speed of a small wave", "小波的速度"],
      [
        "With flux $q(u)$ the equation becomes $u_t + q'(u) u_x = 0$, so density values travel at the speed $q'(u)$. In the traffic model $q = u(1 - u)$, this wave speed is different from the speed of the cars.",
        "通量为 $q(u)$ 时方程变成 $u_t + q'(u) u_x = 0$，所以密度值以速度 $q'(u)$ 传播。在交通模型 $q = u(1 - u)$ 中，这个波速与车速不同。",
      ],
      (rng) => {
        const b = rng.int(2, 40);
        const v = rng.int(2, 25);
        const a = rng.int(1, b - 1);
        return ask(
          [
            `With $q(u) = ${v}u(1 - u)$, what is the wave speed at the density $u = ${Q.of(a, b).toLatex()}$?`,
            `当 $q(u) = ${v}u(1 - u)$ 时，密度 $u = ${Q.of(a, b).toLatex()}$ 处的波速是多少？`,
          ],
          Q.of(v * (b - 2 * a), b),
          [Q.of(v * (b - a), b), Q.of(v * a * (b - a), b * b), Q.of(-v * (b - 2 * a), b)],
          [
            `Differentiate the flux to get $q'(u) = ${v}(1 - 2u)$, and put in the density.`,
            `对通量求导得 $q'(u) = ${v}(1 - 2u)$，再代入密度。`,
          ],
        );
      },
    ),
    point(
      "the-rankine-hugoniot-speed",
      ["The Rankine-Hugoniot speed", "兰金-于戈尼奥速度"],
      [
        "A shock joining two densities moves at the jump in flux divided by the jump in density. This rule follows from conservation, and for the traffic model it simplifies to a formula using the sum of the two densities.",
        "连接两个密度的激波以通量的跃变除以密度的跃变的速度运动。这个规则来自守恒，在交通模型中它化简为用两个密度之和表示的公式。",
      ],
      (rng) => {
        const b = rng.int(4, 30);
        const l = rng.int(1, b - 2);
        const r = rng.int(l + 1, b - 1);
        const v = rng.int(2, 12);
        return ask(
          [
            `With $q(u) = ${v}u(1 - u)$, a shock joins $u_L = ${Q.of(l, b).toLatex()}$ to $u_R = ${Q.of(r, b).toLatex()}$. What is its speed?`,
            `当 $q(u) = ${v}u(1 - u)$ 时，激波连接 $u_L = ${Q.of(l, b).toLatex()}$ 和 $u_R = ${Q.of(r, b).toLatex()}$。它的速度是多少？`,
          ],
          Q.of(v * (b - l - r), b),
          [Q.of(v * (b - 2 * l), b), Q.of(v * (r - l), b), Q.of(v * (l + r), b)],
          [`The jump formula gives $${v}(1 - u_L - u_R)$ for this flux.`, `对这个通量，跃变公式给出 $${v}(1 - u_L - u_R)$。`],
        );
      },
    ),
  ],
);

const burgers = topic(
  "burgers-equation-and-rarefaction-waves",
  ["Burgers' Equation and Rarefaction Waves", "伯格斯方程和稀疏波"],
  ["Tell a shock from a rarefaction, and find when a smooth solution breaks.", "区分激波和稀疏波，并求光滑解何时破裂。"],
  ["conservation-laws-and-traffic-flow"],
  [],
  [
    point(
      "the-breaking-time",
      ["The breaking time", "破裂时间"],
      [
        "Characteristics of $u_t + uu_x = 0$ are straight lines with speed $f(x_0)$. Where $f$ decreases they converge, and the first crossing happens at the time $-\\frac{1}{\\min f'}$, when the solution stops being smooth.",
        "$u_t + uu_x = 0$ 的特征线是速度为 $f(x_0)$ 的直线。在 $f$ 递减的地方它们会聚，第一次相交发生在时间 $-\\frac{1}{\\min f'}$，这时解不再光滑。",
      ],
      (rng) => {
        const a = rng.int(2, 30);
        const b = rng.int(1, 30);
        return ask(
          [
            `For Burgers' equation with $u(x, 0) = ${b} - ${a}x$, when does the solution first break?`,
            `对伯格斯方程，$u(x, 0) = ${b} - ${a}x$，解什么时候第一次破裂？`,
          ],
          Q.of(1, a),
          [Q.of(a, 1), Q.of(b, a), Q.of(1, a + b)],
          [
            `The slope of the data is $-${a}$ everywhere, so the time is $\\frac{1}{${a}}$.`,
            `数据的斜率处处是 $-${a}$，所以时间是 $\\frac{1}{${a}}$。`,
          ],
        );
      },
    ),
    point(
      "shock-or-rarefaction",
      ["Shock or rarefaction", "激波还是稀疏波"],
      [
        "For Burgers' equation a jump from a high value on the left to a low value on the right makes characteristics collide, which forms a shock. The opposite jump makes them spread apart, which leaves a fan called a rarefaction.",
        "对伯格斯方程，从左边的高值跳到右边的低值使特征线相撞，形成激波。相反的跳跃使它们散开，留下一个称为稀疏波的扇形。",
      ],
      (rng) => {
        const a = rng.int(-20, 20);
        const d0 = rng.int(1, 20);
        const d = 2 * a + d0 === 0 ? d0 + 1 : d0;
        const shock = rng.bool();
        const [l, r] = shock ? [a + d, a] : [a, a + d];
        const s: [string, string] = [
          `A shock moving at speed $${Q.of(l + r, 2).toLatex()}$`,
          `以速度 $${Q.of(l + r, 2).toLatex()}$ 运动的激波`,
        ];
        const fan: [string, string] = [`A rarefaction fan between speeds ${l} and ${r}`, `速度在 ${l} 和 ${r} 之间的稀疏扇形`];
        const swapped: [string, string] = [
          `A shock moving at speed $${Q.of(l + r + 2, 2).toLatex()}$`,
          `以速度 $${Q.of(l + r + 2, 2).toLatex()}$ 运动的激波`,
        ];
        const still: [string, string] = [`A jump that stays at $x = 0$`, `停留在 $x = 0$ 的跳跃`];
        return choose(
          rng,
          [
            `For Burgers' equation, the data jumps from ${l} on the left of 0 to ${r} on the right. What forms?`,
            `对伯格斯方程，数据在 0 的左边是 ${l}，右边跳到 ${r}。会形成什么？`,
          ],
          shock ? s : fan,
          shock ? [fan, swapped, still] : [s, swapped, still],
          shock
            ? [
                `The left value is larger, so characteristics collide, and the shock moves at the average.`,
                `左边的值更大，所以特征线相撞，激波以平均值运动。`,
              ]
            : [
                `The right value is larger, so characteristics spread apart and leave a fan.`,
                `右边的值更大，所以特征线散开，留下一个扇形。`,
              ],
        );
      },
    ),
    point(
      "a-value-inside-the-fan",
      ["A value inside the fan", "扇形内的值"],
      [
        "Inside a rarefaction centered at the origin, the solution of Burgers' equation is $u = \\frac{x}{t}$. Each ray from the origin carries its own constant value, and the fan fills the gap between the two states.",
        "在以原点为中心的稀疏波内部，伯格斯方程的解是 $u = \\frac{x}{t}$。从原点出发的每条射线携带自己的常数值，扇形填满两个状态之间的空隙。",
      ],
      (rng) => {
        const l = rng.int(-9, 5);
        const r = l + rng.int(3, 15);
        const t = rng.int(2, 12);
        const x = rng.int(-15, 40);
        const v = Q.of(x, t);
        const left = x < l * t;
        const right = x > r * t;
        const answer = left ? Q.of(l, 1) : right ? Q.of(r, 1) : v;
        return ask(
          [
            `For Burgers' equation, the data is ${l} for $x < 0$ and ${r} for $x > 0$. What is $u$ at $x = ${x}$, $t = ${t}$?`,
            `对伯格斯方程，$x < 0$ 时数据是 ${l}，$x > 0$ 时是 ${r}。$u$ 在 $x = ${x}$、$t = ${t}$ 处的值是多少？`,
          ],
          answer,
          [Q.of(l + r, 2), Q.of(r, t), Q.of(x, t + 1)],
          left || right
            ? [
                `Here $\\frac{x}{t}$ is outside the fan, so the constant state on that side applies.`,
                `这里 $\\frac{x}{t}$ 在扇形之外，所以用那一侧的常数状态。`,
              ]
            : [
                `Here $\\frac{x}{t}$ lies between ${l} and ${r}, so the fan formula applies.`,
                `这里 $\\frac{x}{t}$ 在 ${l} 和 ${r} 之间，所以用扇形公式。`,
              ],
        );
      },
    ),
  ],
);

const sturmLiouville = topic(
  "sturm-liouville-problems",
  ["Sturm-Liouville Problems", "施图姆-刘维尔问题"],
  [
    "Find eigenvalues for different end conditions, and use the orthogonality of eigenfunctions.",
    "求不同端点条件下的特征值，并使用特征函数的正交性。",
  ],
  ["orthogonal-eigenfunctions-for-pdes"],
  [],
  [
    point(
      "eigenvalues-for-mixed-ends",
      ["Eigenvalues for mixed ends", "混合端点的特征值"],
      [
        "For $y'' + \\lambda y = 0$, the end conditions choose the eigenvalues. Fixed ends give $\\left(\\frac{n\\pi}{L}\\right)^{2}$, while one fixed end and one free end give odd quarter waves, $\\left(\\frac{(2n - 1)\\pi}{2L}\\right)^{2}$.",
        "对 $y'' + \\lambda y = 0$，端点条件决定特征值。两端固定给出 $\\left(\\frac{n\\pi}{L}\\right)^{2}$，一端固定一端自由给出奇数四分之一波，$\\left(\\frac{(2n - 1)\\pi}{2L}\\right)^{2}$。",
      ],
      (rng) => {
        const big = rng.int(1, 12);
        const n = rng.int(1, 6);
        const mixed = rng.bool();
        const top = mixed ? (2 * n - 1) ** 2 : n * n;
        const bottom = mixed ? 4 * big * big : big * big;
        return ask(
          mixed
            ? [
                `For $y'' + \\lambda y = 0$ with $y(0) = 0$ and $y'(${big}) = 0$, the eigenvalue number ${n} is $m\\pi^{2}$. What is $m$?`,
                `对 $y'' + \\lambda y = 0$，$y(0) = 0$，$y'(${big}) = 0$，第 ${n} 个特征值是 $m\\pi^{2}$。$m$ 是多少？`,
              ]
            : [
                `For $y'' + \\lambda y = 0$ with $y(0) = 0$ and $y(${big}) = 0$, the eigenvalue number ${n} is $m\\pi^{2}$. What is $m$?`,
                `对 $y'' + \\lambda y = 0$，$y(0) = 0$，$y(${big}) = 0$，第 ${n} 个特征值是 $m\\pi^{2}$。$m$ 是多少？`,
              ],
          Q.of(top, bottom),
          mixed
            ? [Q.of(n * n, big * big), Q.of(2 * n - 1, 2 * big), Q.of(top, 2 * big * big)]
            : [Q.of((2 * n - 1) ** 2, 4 * big * big), Q.of(n, big), Q.of(4 * top, big * big)],
          mixed
            ? [
                `A fixed end and a free end give $\\left(\\frac{(2n - 1)\\pi}{2L}\\right)^{2}$.`,
                `一端固定一端自由给出 $\\left(\\frac{(2n - 1)\\pi}{2L}\\right)^{2}$。`,
              ]
            : [`Two fixed ends give $\\left(\\frac{n\\pi}{L}\\right)^{2}$.`, `两端固定给出 $\\left(\\frac{n\\pi}{L}\\right)^{2}$。`],
        );
      },
    ),
    point(
      "a-rayleigh-quotient",
      ["A Rayleigh quotient", "瑞利商"],
      [
        "The lowest eigenvalue is the smallest possible value of the Rayleigh quotient, the integral of $(y')^{2}$ over the integral of $y^{2}$. So any test function that satisfies the end conditions gives an upper bound.",
        "最低特征值是瑞利商的最小可能值，瑞利商是 $(y')^{2}$ 的积分除以 $y^{2}$ 的积分。所以满足端点条件的任何试验函数都给出一个上界。",
      ],
      (rng) => {
        const big = rng.int(1, 40);
        return ask(
          [
            `Using $y = x(${big} - x)$ on $[0, ${big}]$ with fixed ends, what upper bound does the Rayleigh quotient give for the lowest eigenvalue?`,
            `在 $[0, ${big}]$ 上取固定端点的 $y = x(${big} - x)$，瑞利商给出最低特征值的什么上界？`,
          ],
          Q.of(10, big * big),
          [Q.of(1, big * big), Q.of(12, big * big), Q.of(10, big)],
          [
            `The integrals are $\\frac{${big}^{3}}{3}$ and $\\frac{${big}^{5}}{30}$, and their ratio is $\\frac{10}{${big}^{2}}$.`,
            `两个积分是 $\\frac{${big}^{3}}{3}$ 和 $\\frac{${big}^{5}}{30}$，比值是 $\\frac{10}{${big}^{2}}$。`,
          ],
        );
      },
    ),
    point(
      "a-coefficient-with-a-weight",
      ["A coefficient with a weight", "带权的系数"],
      [
        "Eigenfunctions are orthogonal, in general with a weight function. So a series coefficient is the weighted integral of the data against the mode, divided by the weighted integral of the mode squared.",
        "特征函数是正交的，一般带权函数。所以级数系数是数据与该模式的加权积分，除以该模式平方的加权积分。",
      ],
      (rng) => {
        const big = rng.int(1, 12);
        const n = rng.int(1, 9);
        const a = rng.int(2, 25);
        const b = rng.int(2, 25);
        const m = n + rng.int(1, 5);
        const ask1 = rng.bool();
        return ask(
          [
            `On $[0, ${big}]$, the data is $${a}\\sin\\left(\\frac{${n}\\pi x}{${big}}\\right) + ${b}\\sin\\left(\\frac{${m}\\pi x}{${big}}\\right)$. What is the sine series coefficient of mode ${ask1 ? n : m}?`,
            `在 $[0, ${big}]$ 上，数据是 $${a}\\sin\\left(\\frac{${n}\\pi x}{${big}}\\right) + ${b}\\sin\\left(\\frac{${m}\\pi x}{${big}}\\right)$。模式 ${ask1 ? n : m} 的正弦级数系数是多少？`,
          ],
          ask1 ? a : b,
          [ask1 ? (a === b ? a + 1 : b) : a === b ? b + 1 : a, a + b, Q.of(ask1 ? a : b, big)],
          [
            `Orthogonality removes the other mode, so the coefficient can be read off directly.`,
            `正交性去掉了另一个模式，所以可以直接读出系数。`,
          ],
        );
      },
    ),
  ],
);

const eigenvalues2d = topic(
  "eigenvalues-in-two-dimensions",
  ["Eigenvalues in Two Dimensions", "二维特征值"],
  [
    "Combine one-dimensional modes on a rectangle, and notice when different modes share a frequency.",
    "在矩形上组合一维模式，注意不同模式何时共享频率。",
  ],
  ["sturm-liouville-problems", "the-vibrating-membrane"],
  [],
  [
    point(
      "an-eigenvalue-on-a-rectangle",
      ["An eigenvalue on a rectangle", "矩形上的特征值"],
      [
        "On a rectangle with fixed edges, separation gives $\\sin\\frac{m\\pi x}{a}\\sin\\frac{n\\pi y}{b}$. Its eigenvalue is $\\pi^{2}\\left(\\frac{m^{2}}{a^{2}} + \\frac{n^{2}}{b^{2}}\\right)$, the sum of the two one-dimensional eigenvalues.",
        "在边固定的矩形上，分离变量给出 $\\sin\\frac{m\\pi x}{a}\\sin\\frac{n\\pi y}{b}$。它的特征值是 $\\pi^{2}\\left(\\frac{m^{2}}{a^{2}} + \\frac{n^{2}}{b^{2}}\\right)$，是两个一维特征值之和。",
      ],
      (rng) => {
        const a = rng.int(1, 6);
        const b = rng.int(1, 6);
        const m = rng.int(1, 5);
        const n = rng.int(1, 5);
        return ask(
          [
            `On the rectangle $[0, ${a}] \\times [0, ${b}]$ with fixed edges, the mode $(m, n) = (${m}, ${n})$ has eigenvalue $k\\pi^{2}$. What is $k$?`,
            `在边固定的矩形 $[0, ${a}] \\times [0, ${b}]$ 上，模式 $(m, n) = (${m}, ${n})$ 的特征值是 $k\\pi^{2}$。$k$ 是多少？`,
          ],
          Q.of(m * m * b * b + n * n * a * a, a * a * b * b),
          [Q.of(m * b + n * a, a * b), Q.of(m * m + n * n, a * a + b * b), Q.of(n * n * b * b + m * m * a * a + 1, a * a * b * b)],
          [
            `Add $\\frac{${m}^{2}}{${a}^{2}}$ and $\\frac{${n}^{2}}{${b}^{2}}$.`,
            `把 $\\frac{${m}^{2}}{${a}^{2}}$ 和 $\\frac{${n}^{2}}{${b}^{2}}$ 相加。`,
          ],
        );
      },
    ),
    point(
      "modes-that-share-a-frequency",
      ["Modes that share a frequency", "共享频率的模式"],
      [
        "On a square, the eigenvalue depends on $m^{2} + n^{2}$, so different modes can share a value. Those modes can be combined with any weights, and this explains the rich Chladni patterns seen on square plates.",
        "在正方形上，特征值取决于 $m^{2} + n^{2}$，所以不同的模式可以共享一个值。这些模式可以用任意权重组合，这解释了方板上丰富的克拉德尼图形。",
      ],
      (rng) => {
        const value = rng.pick([
          2, 5, 8, 10, 13, 17, 18, 20, 25, 26, 29, 32, 34, 37, 40, 41, 45, 50, 52, 53, 58, 61, 65, 68, 72, 73, 74, 80, 82, 85, 89, 90, 97,
          98, 100, 101, 104, 106, 109, 113, 116, 117, 122, 125, 130,
        ]);
        let count = 0;
        for (let m = 1; m * m < value; m++) {
          const n = Math.round(Math.sqrt(value - m * m));
          if (n >= 1 && m * m + n * n === value) count += 1;
        }
        return ask(
          [
            `On a square with fixed edges, how many ordered modes $(m, n)$ with $m, n \\ge 1$ have $m^{2} + n^{2} = ${value}$?`,
            `在边固定的正方形上，有多少个有序模式 $(m, n)$（$m, n \\ge 1$）满足 $m^{2} + n^{2} = ${value}$？`,
          ],
          count,
          [count + 1, count === 1 ? 2 : count - 1, count + 2],
          [
            `List the sums of two positive squares equal to ${value}, counting both orders when $m \\ne n$.`,
            `列出等于 ${value} 的两个正平方数之和，$m \\ne n$ 时两种顺序都算。`,
          ],
        );
      },
    ),
    point(
      "how-a-mode-decays",
      ["How a mode decays", "模式如何衰减"],
      [
        "In the two-dimensional heat equation, each mode decays like $e^{-\\alpha\\lambda t}$. So higher modes die away faster, and after a short time the lowest mode shapes the whole temperature profile.",
        "在二维热方程中，每个模式按 $e^{-\\alpha\\lambda t}$ 衰减。所以高阶模式消失得更快，短时间后最低模式决定整个温度分布。",
      ],
      (rng) => {
        const m = rng.int(1, 6);
        const n = rng.int(1, 6);
        const big = rng.int(1, 6);
        const alpha = rng.int(2, 9);
        return ask(
          [
            `For $u_t = ${alpha}\\Delta u$ on a square of side ${big} with fixed edges, mode $(${m}, ${n})$ decays like $e^{-k\\pi^{2} t}$. What is $k$?`,
            `对边长为 ${big}、边固定的正方形上的 $u_t = ${alpha}\\Delta u$，模式 $(${m}, ${n})$ 按 $e^{-k\\pi^{2} t}$ 衰减。$k$ 是多少？`,
          ],
          Q.of(alpha * (m * m + n * n), big * big),
          [Q.of(m * m + n * n, big * big), Q.of(alpha * (m + n), big), Q.of(alpha * (m * m + n * n), big)],
          [
            `The rate is $${alpha}$ times the eigenvalue, whose coefficient is $${Q.of(m * m + n * n, big * big).toLatex()}$.`,
            `衰减率是 $${alpha}$ 乘特征值，特征值的系数是 $${Q.of(m * m + n * n, big * big).toLatex()}$。`,
          ],
        );
      },
    ),
  ],
);

const fourierHeat = topic(
  "the-fourier-transform-for-the-heat-equation",
  ["The Fourier Transform for the Heat Equation", "用傅里叶变换解热方程"],
  [
    "Turn the heat equation on the line into an ordinary differential equation for each frequency.",
    "把直线上的热方程变成每个频率的常微分方程。",
  ],
  ["the-heat-kernel"],
  [],
  [
    point(
      "derivatives-become-multiplication",
      ["Derivatives become multiplication", "导数变成乘法"],
      [
        "The Fourier transform turns $\\partial_x$ into multiplication by $ik$, so $u_{xx}$ becomes $-k^{2}\\hat{u}$. This is what turns a partial differential equation into an ordinary one in $t$ for each fixed frequency $k$.",
        "傅里叶变换把 $\\partial_x$ 变成乘 $ik$，所以 $u_{xx}$ 变成 $-k^{2}\\hat{u}$。这就是把偏微分方程变成每个固定频率 $k$ 下关于 $t$ 的常微分方程的原因。",
      ],
      (rng) => {
        const k = rng.int(2, 15);
        const n = rng.pick([2, 4]);
        const c = rng.int(2, 9);
        return ask(
          [
            `Under the Fourier transform, $${c}\\partial_x^{${n}} u$ becomes $m\\hat{u}$ at frequency $k = ${k}$. What is $m$?`,
            `在傅里叶变换下，$${c}\\partial_x^{${n}} u$ 在频率 $k = ${k}$ 处变成 $m\\hat{u}$。$m$ 是多少？`,
          ],
          c * (n === 2 ? -1 : 1) * k ** n,
          [c * (n === 2 ? 1 : -1) * k ** n, c * k, (n === 2 ? -1 : 1) * k ** n],
          [
            `Each derivative multiplies by $ik$, and $(i)^{${n}} = ${n === 2 ? -1 : 1}$.`,
            `每次求导乘 $ik$，而 $(i)^{${n}} = ${n === 2 ? -1 : 1}$。`,
          ],
        );
      },
    ),
    point(
      "the-decay-of-a-frequency",
      ["The decay of a frequency", "频率的衰减"],
      [
        "For $u_t = \\alpha u_{xx}$, each frequency obeys $\\hat{u}_t = -\\alpha k^{2}\\hat{u}$, so it decays like $e^{-\\alpha k^{2} t}$. Rapid wiggles vanish first, and this is why heat flow smooths out rough data.",
        "对 $u_t = \\alpha u_{xx}$，每个频率满足 $\\hat{u}_t = -\\alpha k^{2}\\hat{u}$，所以按 $e^{-\\alpha k^{2} t}$ 衰减。快速的抖动最先消失，这就是热流使粗糙数据变光滑的原因。",
      ],
      (rng) => {
        const alpha = rng.int(2, 9);
        const k = rng.int(2, 12);
        const t = rng.int(2, 9);
        return ask(
          [
            `For $u_t = ${alpha}u_{xx}$, frequency $k = ${k}$ is multiplied by $e^{-m}$ by the time $t = ${t}$. What is $m$?`,
            `对 $u_t = ${alpha}u_{xx}$，到时间 $t = ${t}$ 时频率 $k = ${k}$ 乘 $e^{-m}$。$m$ 是多少？`,
          ],
          alpha * k * k * t,
          [alpha * k * t, k * k * t, alpha * k * k],
          [
            `The exponent is $\\alpha k^{2} t = ${alpha} \\cdot ${k * k} \\cdot ${t}$.`,
            `指数是 $\\alpha k^{2} t = ${alpha} \\cdot ${k * k} \\cdot ${t}$。`,
          ],
        );
      },
    ),
    point(
      "how-a-gaussian-spreads",
      ["How a Gaussian spreads", "高斯分布如何扩散"],
      [
        "A Gaussian's transform is again a Gaussian, so a Gaussian stays Gaussian under heat flow. Multiplying transforms adds the variances, which means the variance grows by $2\\alpha t$ as time passes.",
        "高斯函数的变换仍是高斯函数，所以高斯分布在热流下保持高斯形状。变换相乘使方差相加，这意味着方差随时间增加 $2\\alpha t$。",
      ],
      (rng) => {
        const s = rng.int(1, 30);
        const alpha = rng.int(2, 9);
        const t = rng.int(2, 12);
        return ask(
          [
            `A Gaussian temperature profile with variance ${s} evolves under $u_t = ${alpha}u_{xx}$. What is its variance at $t = ${t}$?`,
            `方差为 ${s} 的高斯温度分布按 $u_t = ${alpha}u_{xx}$ 演化。在 $t = ${t}$ 时它的方差是多少？`,
          ],
          s + 2 * alpha * t,
          [s + alpha * t, 2 * alpha * t, s * 2 * alpha * t],
          [
            `The variance increases by $2 \\cdot ${alpha} \\cdot ${t}$, added to the starting ${s}.`,
            `方差增加 $2 \\cdot ${alpha} \\cdot ${t}$，再加上开始的 ${s}。`,
          ],
        );
      },
    ),
  ],
);

const laplacePde = topic(
  "the-laplace-transform-for-pdes",
  ["The Laplace Transform for PDEs", "用拉普拉斯变换解偏微分方程"],
  ["Transform in time, and solve an ordinary differential equation in space.", "对时间作变换，再解关于空间的常微分方程。"],
  ["the-heat-equation"],
  [],
  [
    point(
      "transforming-the-time-derivative",
      ["Transforming the time derivative", "变换时间导数"],
      [
        "The Laplace transform in time turns $u_t$ into $sU - u(x, 0)$. So the heat equation with initial data becomes an ordinary differential equation in $x$, in which $s$ acts as a parameter.",
        "对时间作拉普拉斯变换，把 $u_t$ 变成 $sU - u(x, 0)$。所以带初值的热方程变成关于 $x$ 的常微分方程，其中 $s$ 是参数。",
      ],
      (rng) => {
        const s = rng.int(2, 12);
        const u = rng.int(-20, 40);
        const big = rng.int(-20, 20);
        return ask(
          [
            `At a point $x$, $U(x, ${s}) = ${big}$ and $u(x, 0) = ${u}$. What is the transform of $u_t$ at $s = ${s}$?`,
            `在某点 $x$ 处，$U(x, ${s}) = ${big}$，$u(x, 0) = ${u}$。$u_t$ 在 $s = ${s}$ 处的变换是多少？`,
          ],
          s * big - u,
          [s * big + u, big - u, s * (big - u)],
          [`Use $sU - u(x, 0) = ${s}(${big}) - (${u})$.`, `用 $sU - u(x, 0) = ${s}(${big}) - (${u})$。`],
        );
      },
    ),
    point(
      "the-decay-rate-in-space",
      ["The decay rate in space", "空间中的衰减率"],
      [
        "With zero initial data, the transformed heat equation is $\\alpha U'' = sU$. On a half line the bounded solution is $e^{-x\\sqrt{s/\\alpha}}$, so the rate of decay in space depends on the transform variable.",
        "初值为零时，变换后的热方程是 $\\alpha U'' = sU$。在半直线上，有界解是 $e^{-x\\sqrt{s/\\alpha}}$，所以空间中的衰减率取决于变换变量。",
      ],
      (rng) => {
        const a = rng.int(1, 12);
        const r = rng.int(2, 12);
        const s = a * r * r;
        return ask(
          [
            `Solving $${a}U'' = ${s}U$ on $x > 0$ with a bounded solution gives $U = Ce^{-mx}$. What is $m$?`,
            `在 $x > 0$ 上解 $${a}U'' = ${s}U$，有界解为 $U = Ce^{-mx}$。$m$ 是多少？`,
          ],
          r,
          [r * r, -r, a * r],
          [`We need $${a}m^{2} = ${s}$, and the positive root gives decay.`, `需要 $${a}m^{2} = ${s}$，正根给出衰减。`],
        );
      },
    ),
    point(
      "matching-a-boundary-value",
      ["Matching a boundary value", "匹配边界值"],
      [
        "A constant boundary temperature $T$ has transform $\\frac{T}{s}$. This fixes the constant in the bounded solution, so the transform at a point is known, and inverting it gives the erfc profile at each position.",
        "常数边界温度 $T$ 的变换是 $\\frac{T}{s}$。这确定了有界解中的常数，所以一点处的变换是已知的，反演后在每个位置给出 erfc 分布。",
      ],
      (rng) => {
        const t = rng.int(2, 60);
        const s = rng.int(2, 12);
        return ask(
          [
            `The boundary temperature at $x = 0$ is the constant ${t}. What is $U(0, s)$ at $s = ${s}$?`,
            `$x = 0$ 处的边界温度是常数 ${t}。$U(0, s)$ 在 $s = ${s}$ 处是多少？`,
          ],
          Q.of(t, s),
          [t, Q.of(s, t), t * s],
          [`The transform of a constant ${t} is ${t} divided by $s$.`, `常数 ${t} 的变换是 ${t} 除以 $s$。`],
        );
      },
    ),
  ],
);

const duhamel = topic(
  "duhamels-principle",
  ["Duhamel's Principle", "杜阿梅尔原理"],
  ["Build the response to a source by adding up the responses to its instants.", "把源的响应看成各时刻响应的叠加。"],
  ["nonhomogeneous-heat-problems"],
  [],
  [
    point(
      "a-source-on-a-single-mode",
      ["A source on a single mode", "单一模式上的源"],
      [
        "For a mode with decay rate $\\lambda$ and a steady source $Q$, Duhamel's integral gives $\\frac{Q}{\\lambda}(1 - e^{-\\lambda t})$. The amplitude climbs from zero toward the steady value, where the source balances the decay.",
        "对衰减率为 $\\lambda$、稳定源为 $Q$ 的模式，杜阿梅尔积分给出 $\\frac{Q}{\\lambda}(1 - e^{-\\lambda t})$。振幅从零上升到稳定值，在那里源与衰减平衡。",
      ],
      (rng) => {
        const q = rng.int(2, 40);
        const l = rng.int(2, 15);
        return ask(
          [
            `A mode obeys $b'(t) = -${l}b + ${q}$ with $b(0) = 0$. What value does $b$ approach as $t \\to \\infty$?`,
            `一个模式满足 $b'(t) = -${l}b + ${q}$，$b(0) = 0$。当 $t \\to \\infty$ 时 $b$ 趋于什么值？`,
          ],
          Q.of(q, l),
          [Q.of(l, q), q, 0],
          [`The steady state has $b' = 0$, so $${l}b = ${q}$.`, `稳态时 $b' = 0$，所以 $${l}b = ${q}$。`],
        );
      },
    ),
    point(
      "the-duhamel-integral",
      ["The Duhamel integral", "杜阿梅尔积分"],
      [
        "With no decay, the Duhamel integral is just the total source received so far. For a source that grows with time, this integral adds up the source from the start to the present moment.",
        "没有衰减时，杜阿梅尔积分就是到目前为止收到的总源量。对随时间增长的源，这个积分把从开始到现在的源加起来。",
      ],
      (rng) => {
        const a = rng.int(2, 12);
        const b = rng.int(1, 9);
        const t = rng.int(2, 9);
        return ask(
          [
            `A mode obeys $b'(t) = ${a}t + ${b}$ with $b(0) = 0$. What is $b(${t})$?`,
            `一个模式满足 $b'(t) = ${a}t + ${b}$，$b(0) = 0$。$b(${t})$ 是多少？`,
          ],
          Q.of(a * t * t + 2 * b * t, 2),
          [a * t + b, a * t * t + b * t, Q.of(a * t * t, 2)],
          [
            `Integrate the source from 0 to ${t}, which gives $\\frac{${a}}{2} \\cdot ${t * t} + ${b} \\cdot ${t}$.`,
            `把源从 0 积分到 ${t}，得 $\\frac{${a}}{2} \\cdot ${t * t} + ${b} \\cdot ${t}$。`,
          ],
        );
      },
    ),
    point(
      "a-short-pulse",
      ["A short pulse", "短脉冲"],
      [
        "A brief pulse of source acts like a new initial condition at the moment it occurs. So the later response is the pulse's strength multiplied by the decay over the time that has passed since it happened.",
        "短暂的源脉冲相当于在它发生的时刻有一个新的初始条件。所以之后的响应是脉冲强度乘从它发生到现在这段时间的衰减。",
      ],
      (rng) => {
        const j = rng.int(2, 30);
        const l = rng.int(2, 9);
        const t0 = rng.int(1, 5);
        const t = t0 + rng.int(1, 9);
        return choose(
          rng,
          [
            `A mode with decay rate ${l} starts at 0, and a pulse of size ${j} hits at $t = ${t0}$. What is the amplitude at $t = ${t}$?`,
            `衰减率为 ${l} 的模式从 0 开始，大小为 ${j} 的脉冲在 $t = ${t0}$ 时到来。$t = ${t}$ 时的振幅是多少？`,
          ],
          same(`${j} e^{-${l * (t - t0)}}`),
          [same(`${j} e^{-${l * t}}`), same(`${j} e^{-${l * (t + t0)}}`), same(`${j}`)],
          [`The pulse decays only during the $${t - t0}$ time units after it hits.`, `脉冲只在到来后的 $${t - t0}$ 个时间单位内衰减。`],
        );
      },
    ),
  ],
);

const energy = topic(
  "the-energy-method",
  ["The Energy Method", "能量法"],
  ["Prove uniqueness and decay by watching an integral of the solution.", "通过观察解的积分证明唯一性和衰减。"],
  ["the-maximum-principle-for-heat", "well-posed-problems"],
  [],
  [
    point(
      "the-heat-energy-falls",
      ["The heat energy falls", "热能量下降"],
      [
        "For the heat equation with fixed ends, integration by parts gives the rate of change of $\\int u^{2}$ as $-2\\alpha\\int u_x^{2}$. This is never positive, so the energy can only fall as time goes on.",
        "对两端固定的热方程，分部积分给出 $\\int u^{2}$ 的变化率是 $-2\\alpha\\int u_x^{2}$。它永远不为正，所以能量只能随时间下降。",
      ],
      (rng) => {
        const alpha = rng.int(2, 9);
        const g = rng.int(2, 40);
        return ask(
          [
            `For $u_t = ${alpha}u_{xx}$ with fixed ends, $\\int u_x^{2}\\, dx = ${g}$ at some moment. What is $\\frac{d}{dt}\\int u^{2}\\, dx$ then?`,
            `对两端固定的 $u_t = ${alpha}u_{xx}$，某时刻 $\\int u_x^{2}\\, dx = ${g}$。这时 $\\frac{d}{dt}\\int u^{2}\\, dx$ 是多少？`,
          ],
          -2 * alpha * g,
          [2 * alpha * g, -alpha * g, -2 * g],
          [
            `The rate is $-2\\alpha\\int u_x^{2} = -2 \\cdot ${alpha} \\cdot ${g}$.`,
            `变化率是 $-2\\alpha\\int u_x^{2} = -2 \\cdot ${alpha} \\cdot ${g}$。`,
          ],
        );
      },
    ),
    point(
      "the-energy-of-a-single-mode",
      ["The energy of a single mode", "单一模式的能量"],
      [
        "For a pure mode the energy can be computed exactly. The integral of $\\sin^{2}\\frac{n\\pi x}{L}$ over the interval is $\\frac{L}{2}$, whatever the value of $n$, so only the amplitude and length matter.",
        "对纯模式可以精确算出能量。$\\sin^{2}\\frac{n\\pi x}{L}$ 在区间上的积分是 $\\frac{L}{2}$，与 $n$ 的值无关，所以只有振幅和长度起作用。",
      ],
      (rng) => {
        const a = rng.int(2, 15);
        const big = rng.int(1, 15);
        const n = rng.int(1, 9);
        return ask(
          [
            `What is $\\int_0^{${big}} u^{2}\\, dx$ for $u = ${a}\\sin\\left(\\frac{${n}\\pi x}{${big}}\\right)$?`,
            `对 $u = ${a}\\sin\\left(\\frac{${n}\\pi x}{${big}}\\right)$，$\\int_0^{${big}} u^{2}\\, dx$ 是多少？`,
          ],
          Q.of(a * a * big, 2),
          [a * a * big, Q.of(a * big, 2), Q.of(a * a, 2)],
          [`The integral of the squared sine is half the length, times $${a}^{2}$.`, `正弦平方的积分是长度的一半，再乘 $${a}^{2}$。`],
        );
      },
    ),
    point(
      "uniqueness-from-energy",
      ["Uniqueness from energy", "由能量得唯一性"],
      [
        "If two solutions share the same data, their difference starts with zero energy. The energy cannot grow, and it is never negative, so the difference must stay zero, which proves the solution is unique.",
        "如果两个解有相同的数据，它们的差的能量从零开始。能量不会增长，也不会为负，所以差始终为零，这就证明了解是唯一的。",
      ],
      (rng) => {
        const a = rng.int(2, 30);
        const t = rng.int(2, 30);
        return choose(
          rng,
          [
            `Two solutions of $u_t = ${a}u_{xx}$ have the same initial and boundary data. What is the energy of their difference at $t = ${t}$?`,
            `$u_t = ${a}u_{xx}$ 的两个解有相同的初值和边界数据。它们的差在 $t = ${t}$ 时的能量是多少？`,
          ],
          same(`0`),
          [same(`${a}`), same(`e^{-${a * t}}`), same(`${a * t}`)],
          [`It starts at 0 and cannot grow or become negative, so it stays at 0.`, `它从 0 开始，不能增长也不能为负，所以一直是 0。`],
        );
      },
    ),
  ],
);

const greens1d = topic(
  "greens-functions-on-an-interval",
  ["Green's Functions on an Interval", "区间上的格林函数"],
  ["Write the solution of a boundary value problem as an integral against a unit point source.", "把边值问题的解写成对单位点源的积分。"],
  ["poissons-equation"],
  [],
  [
    point(
      "evaluating-a-greens-function",
      ["Evaluating a Green's function", "计算格林函数"],
      [
        "For $-u'' = f$ with fixed ends on $[0, L]$, a unit source at $\\xi$ gives a tent. So $G(x, \\xi)$ is $\\frac{x(L - \\xi)}{L}$ for $x \\le \\xi$, and $\\frac{\\xi(L - x)}{L}$ for $x \\ge \\xi$.",
        "对 $[0, L]$ 上两端固定的 $-u'' = f$，$\\xi$ 处的单位源给出一个帐篷形。所以 $x \\le \\xi$ 时 $G(x, \\xi)$ 是 $\\frac{x(L - \\xi)}{L}$，$x \\ge \\xi$ 时是 $\\frac{\\xi(L - x)}{L}$。",
      ],
      (rng) => {
        const big = rng.int(4, 20);
        const x = rng.int(1, big - 1);
        const s = rng.int(1, big - 1);
        const lo = Math.min(x, s);
        const hi = Math.max(x, s);
        return ask(
          [
            `For $-u'' = f$ on $[0, ${big}]$ with fixed ends, what is $G(${x}, ${s})$?`,
            `对 $[0, ${big}]$ 上两端固定的 $-u'' = f$，$G(${x}, ${s})$ 是多少？`,
          ],
          Q.of(lo * (big - hi), big),
          [Q.of(hi * (big - lo), big), Q.of(x * s, big), Q.of(big - hi, big)],
          [
            `The smaller argument is ${lo} and the larger is ${hi}, so $G = \\frac{${lo}(${big} - ${hi})}{${big}}$.`,
            `较小的自变量是 ${lo}，较大的是 ${hi}，所以 $G = \\frac{${lo}(${big} - ${hi})}{${big}}$。`,
          ],
        );
      },
    ),
    point(
      "the-deflection-under-a-point-load",
      ["The deflection under a point load", "点载荷下的挠度"],
      [
        "A point source of strength $P$ gives $u(x) = PG(x, \\xi)$. Because the problem is linear, several point loads simply add, and symmetry of $G$ means that swapping the load and the observer gives the same result.",
        "强度为 $P$ 的点源给出 $u(x) = PG(x, \\xi)$。因为问题是线性的，多个点载荷直接相加，而 $G$ 的对称性意味着交换载荷和观察点结果相同。",
      ],
      (rng) => {
        const big = rng.int(4, 16);
        const p = rng.int(2, 15);
        const s1 = rng.int(1, big - 1);
        const s2 = s1 === big - 1 ? s1 - 1 : s1 + 1;
        const x = rng.int(1, big - 1);
        const g = (u: number, v: number) => Math.min(u, v) * (big - Math.max(u, v));
        const total = p * g(x, s1) + p * g(x, s2);
        return ask(
          [
            `On $[0, ${big}]$ with fixed ends, equal loads of ${p} sit at ${s1} and ${s2}. What is the solution of $-u'' = f$ at $x = ${x}$?`,
            `在 $[0, ${big}]$ 上两端固定，大小为 ${p} 的相等载荷位于 ${s1} 和 ${s2}。$-u'' = f$ 的解在 $x = ${x}$ 处是多少？`,
          ],
          Q.of(total, big),
          [Q.of(p * g(x, s1), big), Q.of(2 * total, big), Q.of(total + p, big)],
          [
            `Add $${p}G(${x}, ${s1})$ and $${p}G(${x}, ${s2})$, because the problem is linear.`,
            `把 $${p}G(${x}, ${s1})$ 和 $${p}G(${x}, ${s2})$ 相加，因为问题是线性的。`,
          ],
        );
      },
    ),
    point(
      "integrating-against-the-kernel",
      ["Integrating against the kernel", "对核积分"],
      [
        "For a distributed source, integrating $G$ against $f$ gives the solution. With a constant source $f$, this integral equals the parabola $\\frac{f}{2}x(L - x)$, which agrees with solving the equation directly.",
        "对分布源，把 $G$ 对 $f$ 积分就得到解。源为常数 $f$ 时，这个积分等于抛物线 $\\frac{f}{2}x(L - x)$，与直接解方程一致。",
      ],
      (rng) => {
        const big = rng.int(2, 20);
        const x = rng.int(1, big - 1);
        const f = rng.int(1, 15);
        return ask(
          [
            `Solve $-u'' = ${f}$ on $[0, ${big}]$ with fixed ends, and give $u(${x})$.`,
            `解 $[0, ${big}]$ 上两端固定的 $-u'' = ${f}$，给出 $u(${x})$。`,
          ],
          Q.of(f * x * (big - x), 2),
          [f * x * (big - x), Q.of(f * x * x, 2), Q.of(x * (big - x), 2)],
          [
            `The integral equals $\\frac{${f}}{2} \\cdot ${x} \\cdot (${big} - ${x})$.`,
            `积分等于 $\\frac{${f}}{2} \\cdot ${x} \\cdot (${big} - ${x})$。`,
          ],
        );
      },
    ),
  ],
);

const images = topic(
  "the-method-of-images",
  ["The Method of Images", "镜像法"],
  ["Meet a boundary condition by adding mirror sources.", "通过增加镜像源满足边界条件。"],
  ["greens-functions-on-an-interval", "reflection-at-a-boundary"],
  [],
  [
    point(
      "where-the-image-goes",
      ["Where the image goes", "镜像在哪里"],
      [
        "A source near a straight wall has an image at the mirror point across the wall. The two together make the boundary condition automatic, and the image lies outside the region so it adds no new source inside.",
        "直壁附近的源在关于壁的镜像点上有一个镜像。两者合起来自动满足边界条件，而镜像在区域外，所以不增加区域内的新源。",
      ],
      (rng) => {
        const w = rng.int(-20, 20);
        const d = rng.int(1, 25);
        return ask(
          [
            `A source sits at $x = ${w + d}$, to the right of a wall at $x = ${w}$. Where is its image?`,
            `一个源位于 $x = ${w + d}$，在 $x = ${w}$ 处的壁的右边。它的镜像在哪里？`,
          ],
          w - d,
          [w + d, -(w + d), w],
          [`The image is ${d} to the left of the wall, the same distance as the source.`, `镜像在壁左边 ${d} 处，与源到壁的距离相同。`],
        );
      },
    ),
    point(
      "odd-or-even-reflection",
      ["Odd or even reflection", "奇反射还是偶反射"],
      [
        "A fixed end needs zero value, so the image has the opposite sign and the extension is odd. An insulated end needs zero slope, so the image has the same sign and the extension is even.",
        "固定端需要值为零，所以镜像符号相反，延拓是奇的。绝热端需要斜率为零，所以镜像符号相同，延拓是偶的。",
      ],
      (rng) => {
        const a = rng.int(2, 30);
        const x = rng.int(1, 30);
        const fixed = rng.bool();
        return ask(
          [
            `Data on $x > 0$ has $f(${x}) = ${a}$. The boundary at 0 is ${fixed ? "fixed at zero" : "insulated"}. What is the extended data at $x = -${x}$?`,
            `$x > 0$ 上的数据有 $f(${x}) = ${a}$。0 处的边界${fixed ? "固定为零" : "绝热"}。延拓后的数据在 $x = -${x}$ 处是多少？`,
          ],
          fixed ? -a : a,
          [fixed ? a : -a, 0, x],
          [
            `A ${fixed ? "fixed" : "insulated"} end calls for an ${fixed ? "odd" : "even"} extension.`,
            `${fixed ? "固定" : "绝热"}端需要${fixed ? "奇" : "偶"}延拓。`,
          ],
        );
      },
    ),
    point(
      "a-wave-reflected-from-a-fixed-end",
      ["A wave reflected from a fixed end", "从固定端反射的波"],
      [
        "With d'Alembert's formula on a half line, a pulse moves toward the fixed end, and the odd image moves in from the other side. The image emerges as the reflection, flipped upside down, after the original passes the end.",
        "在半直线上用达朗贝尔公式时，脉冲向固定端运动，奇镜像从另一侧进来。原波经过端点后，镜像就作为反射出现，并且上下翻转。",
      ],
      (rng) => {
        const c = rng.int(1, 9);
        const x0 = c * rng.int(1, 9);
        const h = rng.int(2, 30);
        const extra = rng.int(1, 9);
        const t = x0 / c + extra;
        return ask(
          [
            `A pulse of height ${h} starts at $x = ${x0}$ moving left at speed ${c} toward a fixed end at 0. At $t = ${t}$, where is its center?`,
            `高度为 ${h} 的脉冲从 $x = ${x0}$ 出发，以速度 ${c} 向左朝 0 处的固定端运动。在 $t = ${t}$ 时它的中心在哪里？`,
          ],
          c * extra,
          [-c * extra, x0 - c * extra, c * t],
          [
            `It reaches the end at $t = ${x0 / c}$, and then moves right for ${extra} more time units.`,
            `它在 $t = ${x0 / c}$ 时到达端点，再向右运动 ${extra} 个时间单位。`,
          ],
        );
      },
    ),
  ],
);

const forcedWave = topic(
  "the-wave-equation-with-a-source",
  ["The Wave Equation With a Source", "带源的波动方程"],
  ["Add a forcing term to the wave equation, and meet resonance.", "给波动方程加上外力项，并认识共振。"],
  ["dalemberts-formula", "duhamels-principle"],
  [],
  [
    point(
      "a-uniform-force",
      ["A uniform force", "均匀力"],
      [
        "If the force does not depend on $x$ and the data are zero, then the solution does not either, and it obeys $u'' = f$. So the displacement grows like $\\frac{f t^{2}}{2}$, just as for constant acceleration.",
        "如果力与 $x$ 无关且数据为零，那么解也与 $x$ 无关，它满足 $u'' = f$。所以位移按 $\\frac{f t^{2}}{2}$ 增长，就像匀加速运动一样。",
      ],
      (rng) => {
        const f = rng.int(2, 25);
        const t = rng.int(1, 12);
        const c = rng.int(2, 9);
        return ask(
          [
            `Solve $u_{tt} = ${c * c}u_{xx} + ${f}$ on the whole line with zero initial data, and give $u$ at $t = ${t}$.`,
            `在整条直线上解 $u_{tt} = ${c * c}u_{xx} + ${f}$，初值为零，给出 $t = ${t}$ 时的 $u$。`,
          ],
          Q.of(f * t * t, 2),
          [f * t * t, Q.of(f * t, 2), Q.of(f * t * t, 2 * c)],
          [`The solution has no dependence on $x$, so $u = \\frac{${f} t^{2}}{2}$.`, `解与 $x$ 无关，所以 $u = \\frac{${f} t^{2}}{2}$。`],
        );
      },
    ),
    point(
      "the-natural-frequencies",
      ["The natural frequencies", "固有频率"],
      [
        "A string of length $L$ with fixed ends has natural frequencies $\\omega_n = \\frac{n\\pi c}{L}$. Forcing a string at one of these frequencies pumps energy steadily into that mode, and this phenomenon is called resonance.",
        "长度为 $L$、两端固定的弦的固有频率是 $\\omega_n = \\frac{n\\pi c}{L}$。以这些频率之一驱动弦时，能量会持续注入该模式，这种现象叫共振。",
      ],
      (rng) => {
        const n = rng.int(1, 9);
        const c = rng.int(2, 25);
        const big = rng.int(1, 12);
        return ask(
          [
            `A string with $c = ${c}$ and length ${big} has fixed ends. Natural frequency number ${n} is $m\\pi$. What is $m$?`,
            `$c = ${c}$、长度为 ${big} 的弦两端固定。第 ${n} 个固有频率是 $m\\pi$。$m$ 是多少？`,
          ],
          Q.of(n * c, big),
          [Q.of(n, big), Q.of(c, big), Q.of(n * c, 2 * big)],
          [`Use $\\omega_n = \\frac{n\\pi c}{L}$ with $n = ${n}$.`, `用 $\\omega_n = \\frac{n\\pi c}{L}$，取 $n = ${n}$。`],
        );
      },
    ),
    point(
      "growth-at-resonance",
      ["Growth at resonance", "共振时的增长"],
      [
        "A mode forced at its own frequency obeys $b'' + \\omega^{2} b = F\\cos(\\omega t)$. Its solution is $\\frac{F}{2\\omega}t\\sin(\\omega t)$, so the amplitude grows in proportion to time rather than staying bounded.",
        "以自身频率驱动的模式满足 $b'' + \\omega^{2} b = F\\cos(\\omega t)$。它的解是 $\\frac{F}{2\\omega}t\\sin(\\omega t)$，所以振幅与时间成正比增长，而不是保持有界。",
      ],
      (rng) => {
        const f = rng.int(2, 30);
        const w = rng.int(2, 15);
        const t = rng.int(2, 15);
        return ask(
          [
            `For $b'' + ${w * w}b = ${f}\\cos(${w}t)$ with zero start, what is the amplitude $\\frac{Ft}{2\\omega}$ at $t = ${t}$?`,
            `对 $b'' + ${w * w}b = ${f}\\cos(${w}t)$，从零开始，$t = ${t}$ 时的振幅 $\\frac{Ft}{2\\omega}$ 是多少？`,
          ],
          Q.of(f * t, 2 * w),
          [Q.of(f, 2 * w), Q.of(f * t, w), Q.of(f, w * w)],
          [
            `Put $F = ${f}$, $\\omega = ${w}$ and $t = ${t}$ into the growth formula.`,
            `把 $F = ${f}$、$\\omega = ${w}$、$t = ${t}$ 代入增长公式。`,
          ],
        );
      },
    ),
  ],
);

const wave3d = topic(
  "waves-in-three-dimensions",
  ["Waves in Three Dimensions", "三维中的波"],
  [
    "See how spherical waves weaken with distance, and why signals in 3D stay sharp.",
    "看球面波如何随距离减弱，以及为什么三维信号保持清晰。",
  ],
  ["domains-of-dependence", "the-vibrating-membrane"],
  [],
  [
    point(
      "the-amplitude-of-a-spherical-wave",
      ["The amplitude of a spherical wave", "球面波的振幅"],
      [
        "Spherically symmetric solutions of the wave equation have the form $\\frac{F(r - ct)}{r}$. The product $ru$ obeys the one-dimensional wave equation, so the amplitude falls in proportion to one over the distance.",
        "波动方程的球对称解形如 $\\frac{F(r - ct)}{r}$。乘积 $ru$ 满足一维波动方程，所以振幅与距离成反比下降。",
      ],
      (rng) => {
        const a = rng.int(2, 40);
        const r1 = rng.int(1, 12);
        const r2 = r1 * rng.int(2, 6);
        return ask(
          [
            `A spherical wave has amplitude ${a} at the radius ${r1}. What is its amplitude at the radius ${r2}?`,
            `球面波在半径 ${r1} 处的振幅是 ${a}。它在半径 ${r2} 处的振幅是多少？`,
          ],
          Q.of(a * r1, r2),
          [Q.of(a * r1 * r1, r2 * r2), a, Q.of(a * r2, r1)],
          [
            `The amplitude varies as one over $r$, so multiply by $\\frac{${r1}}{${r2}}$.`,
            `振幅与 $r$ 成反比，所以乘 $\\frac{${r1}}{${r2}}$。`,
          ],
        );
      },
    ),
    point(
      "when-a-signal-is-heard",
      ["When a signal is heard", "何时听到信号"],
      [
        "Kirchhoff's formula takes averages over a sphere of radius $ct$. So in 3D a brief signal starting in a ball reaches a listener only while the sphere of radius $ct$ crosses that ball, and this is Huygens' principle.",
        "基尔霍夫公式取半径为 $ct$ 的球面上的平均。所以在三维中，从一个球内发出的短暂信号，只在半径为 $ct$ 的球面穿过那个球时才到达听者，这就是惠更斯原理。",
      ],
      (rng) => {
        const c = rng.int(1, 9);
        const big = rng.int(1, 9);
        const r = big + rng.int(1, 30);
        const last = rng.bool();
        return ask(
          [
            `A signal starts at $t = 0$ inside a ball of radius ${big}, with speed $c = ${c}$. A listener is at distance ${r} from the center. At what time does the listener hear it ${last ? "for the last time" : "first"}?`,
            `信号在 $t = 0$ 时从半径为 ${big} 的球内发出，速度 $c = ${c}$。听者距球心 ${r}。听者${last ? "最后一次" : "第一次"}听到它是在什么时间？`,
          ],
          Q.of(last ? r + big : r - big, c),
          [Q.of(last ? r - big : r + big, c), Q.of(r, c), Q.of(big, c)],
          [
            `The sphere of radius $ct$ around the listener ${last ? "last touches" : "first touches"} the ball at $ct = ${r} ${last ? "+" : "-"} ${big}$.`,
            `以听者为中心、半径为 $ct$ 的球面在 $ct = ${r} ${last ? "+" : "-"} ${big}$ 时${last ? "最后" : "第一次"}接触这个球。`,
          ],
        );
      },
    ),
    point(
      "sharp-signals-in-odd-dimensions",
      ["Sharp signals in odd dimensions", "奇数维的清晰信号"],
      [
        "In three dimensions, a sharp signal stays sharp and passes completely. In two dimensions, the formula integrates over a whole disc, so a sharp signal leaves a lingering tail, like a ripple on a pond.",
        "在三维中，清晰的信号保持清晰并完全通过。在二维中，公式对整个圆盘积分，所以清晰的信号留下一条拖尾，就像池塘上的涟漪。",
      ],
      (rng) => {
        const c = rng.int(2, 12);
        const r = rng.int(2, 30);
        const three = rng.bool();
        const silent: [string, string] = ["It is exactly zero again", "它又恰好是零"];
        const tail: [string, string] = ["It is generally not zero: a tail lingers", "它一般不为零：有拖尾"];
        return choose(
          rng,
          [
            `A brief point signal with speed ${c} passes a listener at distance ${r} in ${three ? "three" : "two"} dimensions. What happens at the listener after $t = ${Q.of(r + 1, c).toLatex()}$?`,
            `速度为 ${c} 的短暂点信号在${three ? "三" : "二"}维中经过距离为 ${r} 的听者。在 $t = ${Q.of(r + 1, c).toLatex()}$ 之后听者处发生什么？`,
          ],
          three ? silent : tail,
          [
            three ? tail : silent,
            ["It grows without bound", "它无限增长"],
            ["It repeats the signal at equal intervals", "它按相等间隔重复信号"],
          ],
          [
            three
              ? `In 3D, Kirchhoff's formula uses only the surface of the sphere.`
              : `In 2D, the formula uses the whole disc, so earlier data keeps contributing.`,
            three ? `在三维中，基尔霍夫公式只用球面。` : `在二维中，公式用整个圆盘，所以较早的数据持续有贡献。`,
          ],
        );
      },
    ),
  ],
);

const bessel = topic(
  "bessel-functions-and-the-circular-drum",
  ["Bessel Functions and the Circular Drum", "贝塞尔函数和圆鼓"],
  ["Use zeros of Bessel functions to find the sound of a round membrane.", "用贝塞尔函数的零点求圆形膜的声音。"],
  ["the-vibrating-membrane"],
  [],
  [
    point(
      "a-drum-frequency",
      ["A drum frequency", "鼓的频率"],
      [
        "Separating the wave equation in polar coordinates gives Bessel functions in $r$. The rim condition $J_m(kR) = 0$ gives $k = \\frac{j}{R}$, where $j$ is a zero of $J_m$, and the frequency is $\\omega = ck$.",
        "在极坐标下分离波动方程，得到关于 $r$ 的贝塞尔函数。边缘条件 $J_m(kR) = 0$ 给出 $k = \\frac{j}{R}$，其中 $j$ 是 $J_m$ 的零点，频率是 $\\omega = ck$。",
      ],
      (rng) => {
        const j = rng.pick([2.4, 3.8, 5.1, 5.5, 8.7]);
        const c = rng.int(2, 25);
        const r = rng.int(1, 12);
        return ask(
          [
            `A drum of radius ${r} has wave speed ${c}, and the relevant Bessel zero is about ${j}. What is the frequency $\\omega$?`,
            `半径为 ${r} 的鼓波速为 ${c}，相关的贝塞尔零点约为 ${j}。频率 $\\omega$ 是多少？`,
          ],
          Q.of(Math.round(j * 10) * c, 10 * r),
          [Q.of(Math.round(j * 10), 10 * r), Q.of(c, r), Q.of(Math.round(j * 10) * r, 10 * c)],
          [
            `Use $\\omega = \\frac{cj}{R} = \\frac{${c} \\cdot ${j}}{${r}}$.`,
            `用 $\\omega = \\frac{cj}{R} = \\frac{${c} \\cdot ${j}}{${r}}$。`,
          ],
        );
      },
    ),
    point(
      "changing-the-size-of-the-drum",
      ["Changing the size of the drum", "改变鼓的大小"],
      [
        "All the frequencies scale with $\\frac{c}{R}$. So doubling the radius halves every frequency, which lowers the pitch by an octave, and this is why bigger drums sound deeper.",
        "所有频率都按 $\\frac{c}{R}$ 缩放。所以半径加倍使每个频率减半，音高降低一个八度，这就是大鼓声音更低沉的原因。",
      ],
      (rng) => {
        const f = rng.int(20, 400);
        const a = rng.int(1, 12);
        const b = rng.int(1, 12);
        return ask(
          [
            `A drum of radius ${a} has a frequency ${f}. What is the matching frequency for a drum of radius ${b} with the same wave speed?`,
            `半径为 ${a} 的鼓有频率 ${f}。波速相同、半径为 ${b} 的鼓对应的频率是多少？`,
          ],
          Q.of(f * a, b),
          [Q.of(f * b, a), Q.of(f * a * a, b * b), f + a - b === f ? f + 1 : f + a - b],
          [
            `Frequency varies as one over the radius, so multiply by $${Q.of(a, b).toLatex()}$.`,
            `频率与半径成反比，所以乘 $${Q.of(a, b).toLatex()}$。`,
          ],
        );
      },
    ),
    point(
      "the-series-for-a-bessel-function",
      ["The series for a Bessel function", "贝塞尔函数的级数"],
      [
        "Solving Bessel's equation by power series gives $J_0(x) = \\sum_{k \\ge 0} \\frac{(-1)^{k}}{(k!)^{2}} \\left(\\frac{x}{2}\\right)^{2k}$. The first few terms are good approximations for small $x$.",
        "用幂级数解贝塞尔方程得 $J_0(x) = \\sum_{k \\ge 0} \\frac{(-1)^{k}}{(k!)^{2}} \\left(\\frac{x}{2}\\right)^{2k}$。对小的 $x$，前几项是很好的近似。",
      ],
      (rng) => {
        const a = rng.int(1, 12);
        const b = rng.int(2, 15);
        const v = Q.of(a, b);
        return ask(
          [
            `Use the terms up to $k = 1$ of the series for $J_0(x)$ to approximate $J_0\\left(${v.toLatex()}\\right)$.`,
            `用 $J_0(x)$ 级数中 $k = 1$ 及之前的项，近似 $J_0\\left(${v.toLatex()}\\right)$。`,
          ],
          Q.of(4 * b * b - a * a, 4 * b * b),
          [Q.of(4 * b * b + a * a, 4 * b * b), Q.of(2 * b * b - a * a, 2 * b * b), Q.of(a * a, 4 * b * b)],
          [
            `The terms are $1 - \\left(\\frac{x}{2}\\right)^{2}$ with $x = ${v.toLatex()}$.`,
            `这些项是 $1 - \\left(\\frac{x}{2}\\right)^{2}$，其中 $x = ${v.toLatex()}$。`,
          ],
        );
      },
    ),
  ],
);

const legendre = topic(
  "legendre-polynomials-and-the-sphere",
  ["Legendre Polynomials and the Sphere", "勒让德多项式和球"],
  ["Solve Laplace's equation in a ball, using Legendre polynomials.", "用勒让德多项式解球内的拉普拉斯方程。"],
  ["laplaces-equation-in-a-rectangle-and-a-disc"],
  [],
  [
    point(
      "evaluating-a-legendre-polynomial",
      ["Evaluating a Legendre polynomial", "计算勒让德多项式"],
      [
        "Separating Laplace's equation in spherical coordinates, with symmetry about the axis, gives Legendre polynomials. The first are $P_0 = 1$, $P_1 = x$, $P_2 = \\frac{3x^{2} - 1}{2}$ and $P_3 = \\frac{5x^{3} - 3x}{2}$.",
        "在球坐标下分离拉普拉斯方程，并利用轴对称，得到勒让德多项式。前几个是 $P_0 = 1$，$P_1 = x$，$P_2 = \\frac{3x^{2} - 1}{2}$，$P_3 = \\frac{5x^{3} - 3x}{2}$。",
      ],
      (rng) => {
        const b = rng.int(2, 12);
        const a = rng.int(1, b - 1);
        const three = rng.bool();
        const x = Q.of(a, b).toLatex();
        return ask(
          [`Evaluate $P_{${three ? 3 : 2}}\\left(${x}\\right)$.`, `计算 $P_{${three ? 3 : 2}}\\left(${x}\\right)$。`],
          three ? Q.of(5 * a * a * a - 3 * a * b * b, 2 * b * b * b) : Q.of(3 * a * a - b * b, 2 * b * b),
          three
            ? [Q.of(5 * a * a * a + 3 * a * b * b, 2 * b * b * b), Q.of(5 * a * a * a - 3 * a * b * b, b * b * b), Q.of(a, b)]
            : [Q.of(3 * a * a + b * b, 2 * b * b), Q.of(3 * a * a - b * b, b * b), Q.of(a, b)],
          [`Put $x = ${x}$ into the polynomial $P_{${three ? 3 : 2}}$.`, `把 $x = ${x}$ 代入多项式 $P_{${three ? 3 : 2}}$。`],
        );
      },
    ),
    point(
      "orthogonality-of-legendre-polynomials",
      ["Orthogonality of Legendre polynomials", "勒让德多项式的正交性"],
      [
        "Legendre polynomials are orthogonal on $[-1, 1]$, with $\\int_{-1}^{1} P_n^{2}\\, dx = \\frac{2}{2n + 1}$. Different ones integrate to zero against each other, so a coefficient can be found by a single integral.",
        "勒让德多项式在 $[-1, 1]$ 上正交，$\\int_{-1}^{1} P_n^{2}\\, dx = \\frac{2}{2n + 1}$。不同的多项式相乘积分为零，所以系数可以由单个积分求出。",
      ],
      (rng) => {
        const n = rng.int(0, 12);
        const k = rng.int(1, 12);
        const other = rng.int(1, 5);
        const zero = rng.bool();
        return ask(
          zero
            ? [
                `Evaluate $\\int_{-1}^{1} ${k} P_{${n}} P_{${n + other}}\\, dx$.`,
                `计算 $\\int_{-1}^{1} ${k} P_{${n}} P_{${n + other}}\\, dx$。`,
              ]
            : [`Evaluate $\\int_{-1}^{1} ${k} P_{${n}}^{2}\\, dx$.`, `计算 $\\int_{-1}^{1} ${k} P_{${n}}^{2}\\, dx$。`],
          zero ? 0 : Q.of(2 * k, 2 * n + 1),
          zero ? [Q.of(2 * k, 2 * n + 1), k, 2 * k] : [Q.of(k, 2 * n + 1), 0, Q.of(2 * k, n + 1)],
          zero
            ? [`Different Legendre polynomials are orthogonal, so the integral is 0.`, `不同的勒让德多项式正交，所以积分是 0。`]
            : [
                `The squared norm is $\\frac{2}{2 \\cdot ${n} + 1}$, times ${k}.`,
                `范数的平方是 $\\frac{2}{2 \\cdot ${n} + 1}$，再乘 ${k}。`,
              ],
        );
      },
    ),
    point(
      "a-solution-in-the-ball",
      ["A solution in the ball", "球内的解"],
      [
        "Inside a ball of radius $R$, the solutions regular at the center are $r^{n}P_n(\\cos\\phi)$. So boundary data $AP_n(\\cos\\phi)$ gives $A\\left(\\frac{r}{R}\\right)^{n}P_n(\\cos\\phi)$, which is easy to evaluate along the axis.",
        "在半径为 $R$ 的球内，在中心正则的解是 $r^{n}P_n(\\cos\\phi)$。所以边界数据 $AP_n(\\cos\\phi)$ 给出 $A\\left(\\frac{r}{R}\\right)^{n}P_n(\\cos\\phi)$，沿轴线很容易计算。",
      ],
      (rng) => {
        const big = rng.int(2, 9);
        const r = rng.int(1, big - 1);
        const n = rng.int(1, 4);
        const a = rng.int(2, 30);
        return ask(
          [
            `$u$ is harmonic in the ball $r < ${big}$, with $u = ${a}P_{${n}}(\\cos\\phi)$ on the surface. What is $u$ at $r = ${r}$ on the axis $\\phi = 0$?`,
            `$u$ 在球 $r < ${big}$ 内调和，球面上 $u = ${a}P_{${n}}(\\cos\\phi)$。$u$ 在轴线 $\\phi = 0$ 上 $r = ${r}$ 处的值是多少？`,
          ],
          Q.of(a * r ** n, big ** n),
          [a, Q.of(a * r, big), Q.of(a * big ** n, r ** n)],
          [
            `On the axis $P_{${n}}(1) = 1$, which leaves $${a}\\left(\\frac{${r}}{${big}}\\right)^{${n}}$.`,
            `在轴线上 $P_{${n}}(1) = 1$，剩下 $${a}\\left(\\frac{${r}}{${big}}\\right)^{${n}}$。`,
          ],
        );
      },
    ),
  ],
);

const wedge = topic(
  "laplaces-equation-on-wedges-and-annuli",
  ["Laplace's Equation on Wedges and Annuli", "楔形和圆环上的拉普拉斯方程"],
  ["Choose powers of $r$ and logarithms to fit the geometry of a region.", "选择 $r$ 的幂和对数来适应区域的几何。"],
  ["laplaces-equation-in-a-rectangle-and-a-disc"],
  [],
  [
    point(
      "the-power-on-a-wedge",
      ["The power on a wedge", "楔形上的幂"],
      [
        "On a wedge of angle $\\beta$ with zero on both edges, the harmonic solutions are $r^{\\nu}\\sin(\\nu\\theta)$ with $\\nu = \\frac{n\\pi}{\\beta}$. So the geometry of the corner fixes which power of $r$ is allowed.",
        "在角度为 $\\beta$、两边为零的楔形上，调和解是 $r^{\\nu}\\sin(\\nu\\theta)$，其中 $\\nu = \\frac{n\\pi}{\\beta}$。所以角的几何决定允许 $r$ 的哪个幂。",
      ],
      (rng) => {
        const q0 = rng.int(2, 12);
        const p = rng.int(1, 3);
        const q = p === q0 || q0 % p === 0 ? q0 * p + 1 : q0;
        const n = rng.int(1, 6);
        return ask(
          [
            `On a wedge of angle $\\frac{${p === 1 ? "" : p}\\pi}{${q}}$ with zero on both edges, what is the power $\\nu$ for the mode $n = ${n}$?`,
            `在角度为 $\\frac{${p === 1 ? "" : p}\\pi}{${q}}$、两边为零的楔形上，模式 $n = ${n}$ 的幂 $\\nu$ 是多少？`,
          ],
          Q.of(n * q, p),
          [Q.of(n * p, q), Q.of(q, p), Q.of(n * q, p + 1)],
          [`Use $\\nu = n\\pi \\div \\beta$ with $n = ${n}$.`, `用 $\\nu = n\\pi \\div \\beta$，取 $n = ${n}$。`],
        );
      },
    ),
    point(
      "a-solution-outside-a-disc",
      ["A solution outside a disc", "圆盘外的解"],
      [
        "Outside a disc, bounded harmonic functions use negative powers. Boundary data $A\\cos(n\\theta)$ on the radius $R$ gives $A\\left(\\frac{R}{r}\\right)^{n}\\cos(n\\theta)$, which falls off as $r$ grows, rather than blowing up.",
        "在圆盘外，有界调和函数用负幂。半径 $R$ 上的边界数据 $A\\cos(n\\theta)$ 给出 $A\\left(\\frac{R}{r}\\right)^{n}\\cos(n\\theta)$，它随 $r$ 增大而减小，而不是爆炸。",
      ],
      (rng) => {
        const big = rng.int(1, 8);
        const r = big + rng.int(1, 12);
        const n = rng.int(2, 4);
        const a = rng.int(2, 30);
        return ask(
          [
            `$u$ is bounded and harmonic on $r > ${big}$, with $u = ${a}\\cos(${n}\\theta)$ on $r = ${big}$. What is $u$ at $r = ${r}$, $\\theta = 0$?`,
            `$u$ 在 $r > ${big}$ 上有界且调和，$r = ${big}$ 上 $u = ${a}\\cos(${n}\\theta)$。$u$ 在 $r = ${r}$、$\\theta = 0$ 处的值是多少？`,
          ],
          Q.of(a * big ** n, r ** n),
          [Q.of(a * r ** n, big ** n), a, Q.of(a * big, r)],
          [
            `The bounded solution uses $\\left(\\frac{${big}}{r}\\right)^{${n}}$, which shrinks as $r$ grows.`,
            `有界解用 $\\left(\\frac{${big}}{r}\\right)^{${n}}$，它随 $r$ 增大而减小。`,
          ],
        );
      },
    ),
    point(
      "a-radial-solution-on-an-annulus",
      ["A radial solution on an annulus", "圆环上的径向解"],
      [
        "Radially symmetric harmonic functions in the plane have the form $A + B\\ln r$. When the radii are powers of a common base, the logarithms give simple ratios, so the value at an intermediate radius is rational.",
        "平面上径向对称的调和函数形如 $A + B\\ln r$。当半径是同一底数的幂时，对数给出简单的比，所以中间半径处的值是有理数。",
      ],
      (rng) => {
        const base = rng.pick([2, 3, 5]);
        const n = rng.int(2, 6);
        const k = rng.int(1, n - 1);
        const a = rng.int(-20, 20);
        const b = a + rng.int(1, 40);
        return ask(
          [
            `$u$ is radial and harmonic on $1 < r < ${base ** n}$, with $u = ${a}$ at $r = 1$ and $u = ${b}$ at $r = ${base ** n}$. What is $u$ at $r = ${base ** k}$?`,
            `$u$ 在 $1 < r < ${base ** n}$ 上径向且调和，$r = 1$ 时 $u = ${a}$，$r = ${base ** n}$ 时 $u = ${b}$。$u$ 在 $r = ${base ** k}$ 处的值是多少？`,
          ],
          Q.of(a * n + (b - a) * k, n),
          [Q.of(a + b, 2), Q.of(a * base ** n + (b - a) * base ** k, base ** n), Q.of((b - a) * k, n)],
          [
            `The value is linear in $\\ln r$, and $\\ln r$ is the fraction $${Q.of(k, n).toLatex()}$ of the way across.`,
            `值关于 $\\ln r$ 是线性的，而 $\\ln r$ 走过了全程的 $${Q.of(k, n).toLatex()}$。`,
          ],
        );
      },
    ),
  ],
);

const harmonicMax = topic(
  "the-maximum-principle-for-harmonic-functions",
  ["The Maximum Principle for Harmonic Functions", "调和函数的最大值原理"],
  ["Locate the extremes of a harmonic function, and solve the Neumann compatibility condition.", "找调和函数的最值，并解诺伊曼相容条件。"],
  ["laplaces-equation", "well-posed-problems"],
  [],
  [
    point(
      "the-center-of-a-ball",
      ["The center of a ball", "球心"],
      [
        "Because a harmonic function at the center of a ball equals its average on the surface, it cannot have a strict maximum inside. In three dimensions, a function such as $x^{2} + y^{2} - 2z^{2}$ illustrates this at any center.",
        "因为调和函数在球心的值等于它在球面上的平均，它在内部不可能有严格最大值。在三维中，像 $x^{2} + y^{2} - 2z^{2}$ 这样的函数在任何中心都说明了这一点。",
      ],
      (rng) => {
        const [x, y, z] = [rng.int(-9, 9), rng.int(-9, 9), rng.int(-9, 9)];
        const r = rng.int(1, 9);
        return ask(
          [
            `What is the average of $u = x^{2} + y^{2} - 2z^{2}$ on the sphere of radius ${r} centered at $(${x}, ${y}, ${z})$?`,
            `$u = x^{2} + y^{2} - 2z^{2}$ 在以 $(${x}, ${y}, ${z})$ 为球心、半径为 ${r} 的球面上的平均值是多少？`,
          ],
          x * x + y * y - 2 * z * z,
          [x * x + y * y + 2 * z * z, x * x + y * y - 2 * z * z + r * r, 0],
          [
            `This $u$ has zero Laplacian, since $2 + 2 - 4 = 0$, so the average is its center value.`,
            `这个 $u$ 的拉普拉斯算子为零，因为 $2 + 2 - 4 = 0$，所以平均值是中心的值。`,
          ],
        );
      },
    ),
    point(
      "extremes-on-the-boundary",
      ["Extremes on the boundary", "边界上的最值"],
      [
        "The maximum and minimum of a harmonic function on a closed bounded region occur on the boundary. So on a disc, write the function in polar form, and read the largest value from the boundary circle.",
        "调和函数在闭有界区域上的最大值和最小值都在边界上。所以在圆盘上，把函数写成极坐标形式，再从边界圆上读出最大值。",
      ],
      (rng) => {
        const r = rng.int(1, 15);
        const a = rng.int(1, 9);
        const c = rng.int(-20, 20);
        return ask(
          [
            `What is the maximum of $u = ${a}(x^{2} - y^{2}) + (${c})$ on the disc $x^{2} + y^{2} \\le ${r * r}$?`,
            `$u = ${a}(x^{2} - y^{2}) + (${c})$ 在圆盘 $x^{2} + y^{2} \\le ${r * r}$ 上的最大值是多少？`,
          ],
          a * r * r + c,
          [c, a * r + c, 2 * a * r * r + c],
          [
            `On the circle $x^{2} - y^{2} = ${r * r}\\cos(2\\theta)$, whose largest value is ${r * r}.`,
            `在圆周上 $x^{2} - y^{2} = ${r * r}\\cos(2\\theta)$，它的最大值是 ${r * r}。`,
          ],
        );
      },
    ),
    point(
      "the-neumann-compatibility-condition",
      ["The Neumann compatibility condition", "诺伊曼相容条件"],
      [
        "The divergence theorem says a solution of $\\Delta u = f$ with prescribed flux must have the integral of $f$ equal to the total boundary flux. Without this balance, the steady Neumann problem has no solution at all.",
        "散度定理说明，$\\Delta u = f$ 在给定通量下有解时，$f$ 的积分必须等于边界总通量。没有这个平衡，稳态诺伊曼问题根本无解。",
      ],
      (rng) => {
        const f = rng.int(1, 12);
        const a = rng.int(1, 9);
        const b = rng.int(1, 9);
        const flux = rng.int(1, 40);
        return ask(
          [
            `For $\\Delta u = ${f}$ on a ${a} by ${b} rectangle, the flux out is ${flux} through part of the boundary and a constant total $T$ through the rest. For a solution to exist, what must $T$ be?`,
            `对 ${a} 乘 ${b} 的矩形上的 $\\Delta u = ${f}$，通过部分边界向外的通量是 ${flux}，通过其余边界的总量是常数 $T$。要使解存在，$T$ 必须是多少？`,
          ],
          f * a * b - flux,
          [f * a * b + flux, flux, f * (a + b) - flux],
          [
            `The total flux must equal $${f} \\cdot ${a} \\cdot ${b}$, which is the integral of the source.`,
            `总通量必须等于 $${f} \\cdot ${a} \\cdot ${b}$，即源的积分。`,
          ],
        );
      },
    ),
  ],
);

const fdLaplace = topic(
  "finite-differences-for-laplaces-equation",
  ["Finite Differences for Laplace's Equation", "拉普拉斯方程的有限差分"],
  ["Solve Laplace's equation on a grid by repeatedly averaging neighbors.", "在网格上反复平均相邻点来解拉普拉斯方程。"],
  ["laplaces-equation", "finite-differences-for-the-heat-equation"],
  [],
  [
    point(
      "the-five-point-rule",
      ["The five point rule", "五点格式"],
      [
        "Replacing second derivatives by differences on a square grid gives the five point rule. Each interior value of the discrete solution equals the average of its four neighbors, which mirrors the mean value property.",
        "在正方形网格上用差分代替二阶导数，得到五点格式。离散解的每个内部值等于它四个相邻点的平均，这对应平均值性质。",
      ],
      (rng) => {
        const n = [rng.int(-20, 40), rng.int(-20, 40), rng.int(-20, 40), rng.int(-20, 40)];
        const s = n.reduce((a, b) => a + b, 0);
        return ask(
          [
            `A grid point has neighbors with the values $${n.join(", ")}$. What value does the five point rule give at this point?`,
            `一个网格点的相邻点值为 $${n.join(", ")}$。五点格式给出这一点的值是多少？`,
          ],
          Q.of(s, 4),
          [s, Q.of(s, 5), Q.of(s, 2)],
          [`Take the average of the four neighbors, whose sum is ${s}.`, `取四个相邻点的平均，它们的和是 ${s}。`],
        );
      },
    ),
    point(
      "one-jacobi-sweep",
      ["One Jacobi sweep", "一次雅可比迭代"],
      [
        "Jacobi iteration updates every interior point at once from the old values of its neighbors. Repeating this sweep lets the boundary information spread inward, and the iteration settles to the discrete solution.",
        "雅可比迭代用相邻点的旧值同时更新每个内部点。重复这一过程使边界信息向内传播，迭代收敛到离散解。",
      ],
      (rng) => {
        const a = rng.int(-20, 40) * 4;
        const b = rng.int(-20, 40);
        const c = rng.int(-20, 40);
        const d = rng.int(-20, 40);
        const oldNext = rng.int(-20, 40);
        return ask(
          [
            `An interior point has three boundary neighbors $${b}$, $${c}$ and $${d}$, and one interior neighbor whose old value is ${oldNext}. Its own old value is ${a}. What is its value after one Jacobi sweep?`,
            `一个内部点有三个边界相邻点 $${b}$、$${c}$ 和 $${d}$，以及一个旧值为 ${oldNext} 的内部相邻点。它自己的旧值是 ${a}。一次雅可比迭代后它的值是多少？`,
          ],
          Q.of(b + c + d + oldNext, 4),
          [Q.of(a + b + c + d, 4), Q.of(b + c + d + oldNext + a, 5), Q.of(b + c + d, 3)],
          [`Its own old value is not used, so average the four neighbor values.`, `不用它自己的旧值，所以取四个相邻值的平均。`],
        );
      },
    ),
    point(
      "a-small-grid-exactly",
      ["A small grid exactly", "精确解小网格"],
      [
        "A grid with a few interior points yields a small linear system. Solving it exactly gives the discrete solution, and symmetric boundary data lets the unknowns be reduced before any arithmetic is done.",
        "内部点很少的网格给出一个小线性方程组。精确求解它就得到离散解，对称的边界数据可以在计算之前减少未知数。",
      ],
      (rng) => {
        const p = rng.int(-20, 40);
        const q = rng.int(-20, 40);
        const r = rng.int(-20, 40);
        const s = rng.int(-20, 40);
        const t = rng.int(-20, 40);
        const v = rng.int(-20, 40);
        const left = p + q + r;
        const right = s + t + v;
        return ask(
          [
            `Two adjacent interior points $A$ and $B$ each have three boundary neighbors. Those of $A$ are $${p}, ${q}, ${r}$, and those of $B$ are $${s}, ${t}, ${v}$. What is $A$ under the five point rule?`,
            `两个相邻的内部点 $A$ 和 $B$ 各有三个边界相邻点。$A$ 的是 $${p}, ${q}, ${r}$，$B$ 的是 $${s}, ${t}, ${v}$。按五点格式 $A$ 是多少？`,
          ],
          Q.of(4 * left + right, 15),
          [Q.of(left + right, 8), Q.of(left, 3), Q.of(left, 4)],
          [`Solve $4A = ${left} + B$ together with $4B = ${right} + A$.`, `联立解 $4A = ${left} + B$ 和 $4B = ${right} + A$。`],
        );
      },
    ),
  ],
);

const stability = topic(
  "stability-of-difference-schemes",
  ["Stability of Difference Schemes", "差分格式的稳定性"],
  ["Choose a time step that keeps explicit schemes from blowing up.", "选择使显式格式不爆炸的时间步长。"],
  ["finite-differences-for-the-wave-equation"],
  [],
  [
    point(
      "the-largest-heat-step",
      ["The largest heat step", "最大的热方程步长"],
      [
        "The explicit scheme for the heat equation is stable only when $\\alpha\\frac{\\Delta t}{\\Delta x^{2}} \\le \\frac{1}{2}$. So halving the space step forces a time step four times smaller, which makes fine grids expensive.",
        "热方程的显式格式只有在 $\\alpha\\frac{\\Delta t}{\\Delta x^{2}} \\le \\frac{1}{2}$ 时才稳定。所以空间步长减半迫使时间步长缩小四倍，使细网格代价很高。",
      ],
      (rng) => {
        const alpha = rng.int(1, 12);
        const n = rng.int(2, 25);
        return ask(
          [
            `For $u_t = ${alpha}u_{xx}$ with $\\Delta x = \\frac{1}{${n}}$, what is the largest stable $\\Delta t$ for the explicit scheme?`,
            `对 $u_t = ${alpha}u_{xx}$，$\\Delta x = \\frac{1}{${n}}$，显式格式最大的稳定 $\\Delta t$ 是多少？`,
          ],
          Q.of(1, 2 * alpha * n * n),
          [Q.of(1, alpha * n * n), Q.of(1, 2 * alpha * n), Q.of(1, 2 * n * n)],
          [
            `Solve $${alpha}\\Delta t \\cdot ${n * n} = \\frac{1}{2}$ for $\\Delta t$.`,
            `由 $${alpha}\\Delta t \\cdot ${n * n} = \\frac{1}{2}$ 解出 $\\Delta t$。`,
          ],
        );
      },
    ),
    point(
      "the-cfl-condition",
      ["The CFL condition", "CFL 条件"],
      [
        "The explicit wave scheme needs $c\\frac{\\Delta t}{\\Delta x} \\le 1$, the Courant-Friedrichs-Lewy condition. The numerical domain of dependence must contain the true one, or information would outrun the grid.",
        "显式波动格式需要 $c\\frac{\\Delta t}{\\Delta x} \\le 1$，即柯朗-弗里德里希斯-列维条件。数值依赖域必须包含真实依赖域，否则信息会跑得比网格快。",
      ],
      (rng) => {
        const c = rng.int(2, 30);
        const n = rng.int(2, 60);
        return ask(
          [
            `For the wave equation with $c = ${c}$ and $\\Delta x = \\frac{1}{${n}}$, what is the largest stable $\\Delta t$ for the explicit scheme?`,
            `对 $c = ${c}$、$\\Delta x = \\frac{1}{${n}}$ 的波动方程，显式格式最大的稳定 $\\Delta t$ 是多少？`,
          ],
          Q.of(1, c * n),
          [Q.of(c, n), Q.of(1, 2 * c * n), Q.of(1, n)],
          [`The condition gives $\\Delta t \\le \\frac{\\Delta x}{c}$.`, `这个条件给出 $\\Delta t \\le \\frac{\\Delta x}{c}$。`],
        );
      },
    ),
    point(
      "the-amplification-factor",
      ["The amplification factor", "放大因子"],
      [
        "Von Neumann analysis puts a single wave into the scheme and asks how much it grows each step. For the explicit heat scheme, the factor is $1 - 4r\\sin^{2}\\frac{\\theta}{2}$, and stability needs its size to be at most 1.",
        "冯·诺伊曼分析把单一波放入格式，看它每步增长多少。对显式热方程格式，因子是 $1 - 4r\\sin^{2}\\frac{\\theta}{2}$，稳定性要求它的绝对值不超过 1。",
      ],
      (rng) => {
        const b = rng.int(2, 40);
        const a = rng.int(1, 3 * b);
        const r = Q.of(a, b);
        return ask(
          [
            `With $r = ${r.toLatex()}$, what is the amplification factor $1 - 4r\\sin^{2}\\frac{\\theta}{2}$ of the highest frequency, $\\theta = \\pi$?`,
            `当 $r = ${r.toLatex()}$ 时，最高频率 $\\theta = \\pi$ 的放大因子 $1 - 4r\\sin^{2}\\frac{\\theta}{2}$ 是多少？`,
          ],
          Q.of(b - 4 * a, b),
          [Q.of(b + 4 * a, b), Q.of(b - 2 * a, b), Q.of(4 * a, b)],
          [
            `At $\\theta = \\pi$ the squared sine equals 1, so the factor is $1 - 4r$.`,
            `当 $\\theta = \\pi$ 时正弦平方等于 1，所以因子是 $1 - 4r$。`,
          ],
        );
      },
    ),
  ],
);

const similarity = topic(
  "scaling-and-similarity-solutions",
  ["Scaling and Similarity Solutions", "缩放和相似解"],
  ["Use the symmetries of an equation to reduce the number of variables.", "利用方程的对称性减少变量的个数。"],
  ["the-heat-kernel"],
  [],
  [
    point(
      "rescaling-a-heat-solution",
      ["Rescaling a heat solution", "缩放热方程的解"],
      [
        "If $u(x, t)$ solves the heat equation, then so does $u(\\lambda x, \\lambda^{2} t)$, because each side picks up the same factor. So time scales as the square of length, and doubling a rod quadruples its cooling time.",
        "如果 $u(x, t)$ 解热方程，那么 $u(\\lambda x, \\lambda^{2} t)$ 也是解，因为两边得到相同的因子。所以时间按长度的平方缩放，杆长加倍使冷却时间变成四倍。",
      ],
      (rng) => {
        const a = rng.int(1, 12);
        const b = rng.int(1, 12);
        const t = rng.int(2, 60);
        return ask(
          [
            `A rod of length ${a} cools to some state in ${t} minutes. How long does a similar rod of length ${b} with the same material take?`,
            `长度为 ${a} 的杆在 ${t} 分钟内冷却到某个状态。材料相同、长度为 ${b} 的相似杆需要多长时间？`,
          ],
          Q.of(t * b * b, a * a),
          [Q.of(t * b, a), Q.of(t * a * a, b * b), t + b - a === t ? t + 1 : t + Math.abs(b - a)],
          [
            `Time scales as length squared, so multiply by $${Q.of(b * b, a * a).toLatex()}$.`,
            `时间按长度的平方缩放，所以乘 $${Q.of(b * b, a * a).toLatex()}$。`,
          ],
        );
      },
    ),
    point(
      "the-similarity-variable",
      ["The similarity variable", "相似变量"],
      [
        "The combination $\\eta = \\frac{x}{\\sqrt{4\\alpha t}}$ is unchanged by that scaling. So data with no length scale, such as a step, gives a solution depending only on $\\eta$, turning the PDE into an ODE.",
        "组合 $\\eta = \\frac{x}{\\sqrt{4\\alpha t}}$ 在这种缩放下不变。所以没有长度尺度的数据（例如阶跃）给出只依赖 $\\eta$ 的解，把偏微分方程变成常微分方程。",
      ],
      (rng) => {
        const alpha = rng.pick([1, 2, 3, 5, 6, 7]);
        const m = rng.int(1, 6);
        const t = alpha * m * m;
        const x = rng.int(1, 60);
        const s = 2 * alpha * m;
        return ask(
          [
            `For $u_t = ${alpha}u_{xx}$, what is the similarity variable $\\eta = \\frac{x}{\\sqrt{4\\alpha t}}$ at $x = ${x}$, $t = ${t}$?`,
            `对 $u_t = ${alpha}u_{xx}$，相似变量 $\\eta = \\frac{x}{\\sqrt{4\\alpha t}}$ 在 $x = ${x}$、$t = ${t}$ 处是多少？`,
          ],
          Q.of(x, s),
          [Q.of(x, 2 * s), Q.of(x, alpha * m), Q.of(x, t)],
          [`Here $\\sqrt{4 \\cdot ${alpha} \\cdot ${t}} = ${s}$.`, `这里 $\\sqrt{4 \\cdot ${alpha} \\cdot ${t}} = ${s}$。`],
        );
      },
    ),
    point(
      "how-far-diffusion-reaches",
      ["How far diffusion reaches", "扩散能走多远"],
      [
        "Since the solution depends on $\\frac{x}{\\sqrt{t}}$, any feature of a similarity solution moves like the square root of time. So to go twice as far by diffusion takes four times as long.",
        "因为解依赖于 $\\frac{x}{\\sqrt{t}}$，相似解的任何特征都按时间的平方根移动。所以靠扩散走两倍远需要四倍的时间。",
      ],
      (rng) => {
        const x = rng.int(2, 15);
        const k = rng.int(2, 9);
        const t = rng.int(2, 30);
        return ask(
          [
            `A similarity solution has some feature at $x = ${x}$ when $t = ${t}$. Where is that feature when $t = ${t * k * k}$?`,
            `相似解的某个特征在 $t = ${t}$ 时位于 $x = ${x}$。当 $t = ${t * k * k}$ 时这个特征在哪里？`,
          ],
          x * k,
          [x * k * k, x + k, x],
          [
            `Time grew by the factor $${k}^{2}$, and the position grows by its square root ${k}.`,
            `时间增大了 $${k}^{2}$ 倍，位置按它的平方根 ${k} 增大。`,
          ],
        );
      },
    ),
  ],
);

const schrodinger = topic(
  "the-schrodinger-equation",
  ["The Schrödinger Equation", "薛定谔方程"],
  ["Solve the free equation by separation, and read energies and group speeds.", "用分离变量解自由方程，并读出能量和群速度。"],
  ["dispersion-relations"],
  [],
  [
    point(
      "energies-in-a-box",
      ["Energies in a box", "盒中的能量"],
      [
        "Separating $iu_t = -u_{xx}$ on an interval with fixed ends gives modes $\\sin\\frac{n\\pi x}{L}$ with the energy $E_n = \\left(\\frac{n\\pi}{L}\\right)^{2}$. So the energy levels grow like the square of $n$.",
        "在两端固定的区间上分离 $iu_t = -u_{xx}$，得到模式 $\\sin\\frac{n\\pi x}{L}$，能量为 $E_n = \\left(\\frac{n\\pi}{L}\\right)^{2}$。所以能级按 $n$ 的平方增长。",
      ],
      (rng) => {
        const big = rng.int(1, 12);
        const n = rng.int(1, 12);
        return ask(
          [
            `For $iu_t = -u_{xx}$ on $[0, ${big}]$ with fixed ends, the energy of mode ${n} is $m\\pi^{2}$. What is $m$?`,
            `对 $[0, ${big}]$ 上两端固定的 $iu_t = -u_{xx}$，模式 ${n} 的能量是 $m\\pi^{2}$。$m$ 是多少？`,
          ],
          Q.of(n * n, big * big),
          [Q.of(n, big), Q.of(n * n, big), Q.of(n * n, 2 * big * big)],
          [
            `Use $E_n = \\left(\\frac{n\\pi}{L}\\right)^{2}$ with $n = ${n}$.`,
            `用 $E_n = \\left(\\frac{n\\pi}{L}\\right)^{2}$，取 $n = ${n}$。`,
          ],
        );
      },
    ),
    point(
      "the-probability-stays-still",
      ["The probability stays still", "概率保持不变"],
      [
        "A single mode changes in time only by the phase $e^{-iEt}$, whose size is 1. So its probability density $|u|^{2}$ does not change at all, which is why such a state is called stationary.",
        "单一模式随时间只变化相位 $e^{-iEt}$，它的模是 1。所以它的概率密度 $|u|^{2}$ 完全不变，这就是这种状态被称为定态的原因。",
      ],
      (rng) => {
        const a = rng.int(2, 15);
        const t = rng.int(2, 30);
        const e = rng.int(2, 30);
        return ask(
          [
            `A stationary state has $u(x_0, t) = ${a}e^{-${e}it}$ at a point $x_0$. What is $|u(x_0, ${t})|^{2}$?`,
            `定态在点 $x_0$ 处有 $u(x_0, t) = ${a}e^{-${e}it}$。$|u(x_0, ${t})|^{2}$ 是多少？`,
          ],
          a * a,
          [a, a * a * t, 0],
          [
            `The phase has size 1, so only the amplitude ${a} matters, and we square it.`,
            `相位的模是 1，所以只有振幅 ${a} 起作用，再平方。`,
          ],
        );
      },
    ),
    point(
      "group-speed-of-a-wave-packet",
      ["Group speed of a wave packet", "波包的群速度"],
      [
        "A plane wave $e^{i(kx - \\omega t)}$ solves $iu_t = -u_{xx}$ when $\\omega = k^{2}$. A packet moves at the group speed $\\frac{d\\omega}{dk} = 2k$, which is twice the speed of its individual crests.",
        "平面波 $e^{i(kx - \\omega t)}$ 在 $\\omega = k^{2}$ 时解 $iu_t = -u_{xx}$。波包以群速度 $\\frac{d\\omega}{dk} = 2k$ 运动，是单个波峰速度的两倍。",
      ],
      (rng) => {
        const k = rng.int(1, 30);
        const phase = rng.bool();
        return ask(
          [
            `For $iu_t = -u_{xx}$ and wave number $k = ${k}$, what is the ${phase ? "phase speed of the crests" : "group speed of a packet"}?`,
            `对 $iu_t = -u_{xx}$ 和波数 $k = ${k}$，${phase ? "波峰的相速度" : "波包的群速度"}是多少？`,
          ],
          phase ? k : 2 * k,
          [phase ? 2 * k : k, k * k, phase ? k + 1 : 2 * k + 1],
          phase
            ? [
                `The phase speed is $\\frac{\\omega}{k} = k$, from $\\omega = k^{2}$.`,
                `相速度是 $\\frac{\\omega}{k} = k$，来自 $\\omega = k^{2}$。`,
              ]
            : [`The group speed is the derivative of $\\omega = k^{2}$, namely $2k$.`, `群速度是 $\\omega = k^{2}$ 的导数，即 $2k$。`],
        );
      },
    ),
  ],
);

/** partialDifferentialEquationsExtraTopics holds the topics that complete the Partial Differential Equations course. */
export const partialDifferentialEquationsExtraTopics: readonly TopicDef[] = [
  conservationLaws,
  burgers,
  sturmLiouville,
  eigenvalues2d,
  fourierHeat,
  laplacePde,
  duhamel,
  energy,
  greens1d,
  images,
  forcedWave,
  wave3d,
  bessel,
  legendre,
  wedge,
  harmonicMax,
  fdLaplace,
  stability,
  similarity,
  schrodinger,
];
