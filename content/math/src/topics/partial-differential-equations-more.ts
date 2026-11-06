// More of Partial Differential Equations: shocks, domains of dependence, reflections, energy, the heat kernel,
// dispersion relations, Poisson's equation, membranes, Robin conditions, damping, well-posedness and leapfrog.

import type { TopicDef } from "@ga/content";
import { Q } from "@ga/subject-math";
import { pdeDrawings1 } from "../explanation-drawings-partial-differential-equations-1.ts";

import { ask, choose, type Pair, point, topic } from "../university-kit.ts";

/** times writes a coefficient before a symbol, leaving out a coefficient of one. */
const times = (c: number, symbol: string): string => (c === 1 ? symbol : `${c} ${symbol}`);

/** PYTHAGOREAN lists right triangles with small whole sides. */
const PYTHAGOREAN = [
  [3, 4, 5],
  [4, 3, 5],
  [6, 8, 10],
  [8, 6, 10],
  [5, 12, 13],
  [12, 5, 13],
  [8, 15, 17],
  [15, 8, 17],
] as const;

const shocks = topic(
  "nonlinear-transport-and-shocks",
  ["Nonlinear Transport and Shocks", "非线性输运和激波"],
  [
    "Follow characteristics whose speed depends on the solution, up to the moment they cross.",
    "跟踪速度取决于解本身的特征线，直到它们相交。",
  ],
  ["the-method-of-characteristics"],
  [],
  [
    point(
      "a-characteristic-of-burgers-equation",
      ["A characteristic of Burgers' equation", "伯格斯方程的特征线"],
      [
        "In the equation $u_t + u u_x = 0$, the solution is constant along each characteristic, and the speed of that characteristic is the value of $u$ it carries. So the line starting at $x_0$ is $x = x_0 + u(x_0, 0) \\, t$. Taller parts of the wave travel faster than lower parts.",
        "在方程 $u_t + u u_x = 0$ 中，解沿每条特征线不变，而这条特征线的速度就是它携带的 $u$ 值。所以从 $x_0$ 出发的直线是 $x = x_0 + u(x_0, 0) \\, t$。波的高处比低处走得快。",
      ],
      (rng) => {
        const [a, b] = [rng.int(1, 4), rng.int(1, 5)];
        const [x0, time] = [rng.int(1, 5), rng.int(2, 5)];
        const speed = a * x0 + b;
        const answer = x0 + speed * time;
        return ask(
          [
            `For $u_t + u u_x = 0$ with $u(x, 0) = ${times(a, "x")} + ${b}$, where is the characteristic from $x_0 = ${x0}$ at time $t = ${time}$?`,
            `对 $u_t + u u_x = 0$，$u(x, 0) = ${times(a, "x")} + ${b}$，从 $x_0 = ${x0}$ 出发的特征线在 $t = ${time}$ 时位于何处？`,
          ],
          answer,
          [speed * time, x0 + b * time, x0 + a * time, speed + time],
          [
            `The characteristic carries $u = ${a} \\cdot ${x0} + ${b} = ${speed}$, which is its speed. So $x = ${x0} + ${speed} \\cdot ${time} = ${answer}$.`,
            `特征线携带的值是 $u = ${a} \\cdot ${x0} + ${b} = ${speed}$，这就是它的速度。所以 $x = ${x0} + ${speed} \\cdot ${time} = ${answer}$。`,
          ],
        );
      },
    ),
    point(
      "when-two-characteristics-cross",
      ["When two characteristics cross", "两条特征线何时相交"],
      [
        "If a faster characteristic starts behind a slower one, it catches up. Setting $x_1 + u_1 t = x_2 + u_2 t$ gives the crossing time $t = (x_2 - x_1) / (u_1 - u_2)$. At that moment the solution would need two values at one point, so a smooth solution cannot continue past it.",
        "如果较快的特征线从较慢的后方出发，就会追上它。令 $x_1 + u_1 t = x_2 + u_2 t$，得相交时间 $t = (x_2 - x_1) / (u_1 - u_2)$。此刻解在同一点需要取两个值，所以光滑解不能继续下去。",
      ],
      (rng) => {
        const x1 = rng.int(0, 6);
        const gap = rng.int(1, 9);
        const u2 = rng.int(1, 5);
        const drop = rng.int(1, 6);
        const u1 = u2 + drop;
        const answer = Q.of(gap, drop);
        return ask(
          [
            `For $u_t + u u_x = 0$, one characteristic starts at $x = ${x1}$ carrying $u = ${u1}$, and another starts at $x = ${x1 + gap}$ carrying $u = ${u2}$. At what time do they cross?`,
            `对 $u_t + u u_x = 0$，一条特征线从 $x = ${x1}$ 出发，携带 $u = ${u1}$；另一条从 $x = ${x1 + gap}$ 出发，携带 $u = ${u2}$。它们在什么时刻相交？`,
          ],
          answer,
          [Q.of(gap, u1 + u2), Q.of(drop, gap), gap, Q.of(gap, u1)],
          [
            `The gap between them is ${gap}, and it closes at the rate $${u1} - ${u2} = ${drop}$. So $t = ${answer.toLatex()}$.`,
            `它们相距 ${gap}，以 $${u1} - ${u2} = ${drop}$ 的速度缩小。所以 $t = ${answer.toLatex()}$。`,
          ],
        );
      },
    ),
    point(
      "the-speed-of-a-shock",
      ["The speed of a shock", "激波的速度"],
      [
        "After characteristics cross, the solution contains a jump called a shock. For $u_t + u u_x = 0$, conservation requires the jump to move at the average of the values on its two sides, $\\frac{1}{2} (u_L + u_R)$. This is the Rankine-Hugoniot condition, and a shock needs $u_L > u_R$.",
        "特征线相交后，解中出现一个跳跃，称为激波。对 $u_t + u u_x = 0$，守恒要求跳跃以两侧值的平均值 $\\frac{1}{2} (u_L + u_R)$ 移动。这就是兰金–于戈尼奥条件，激波要求 $u_L > u_R$。",
      ],
      (rng) => {
        const uR = rng.int(0, 6);
        const uL = uR + rng.int(1, 8);
        const answer = Q.of(uL + uR, 2);
        return ask(
          [
            `A shock in $u_t + u u_x = 0$ has $u = ${uL}$ on its left and $u = ${uR}$ on its right. How fast does it move?`,
            `$u_t + u u_x = 0$ 的一个激波，左侧 $u = ${uL}$，右侧 $u = ${uR}$。它移动得多快？`,
          ],
          answer,
          [uL - uR, uL + uR, uL, Q.of(uL - uR, 2)],
          [
            `A shock moves at the average of the two sides: $\\frac{1}{2} (${uL} + ${uR}) = ${answer.toLatex()}$.`,
            `激波以两侧值的平均值移动：$\\frac{1}{2} (${uL} + ${uR}) = ${answer.toLatex()}$。`,
          ],
        );
      },
    ),
  ],
);

const dependence = topic(
  "domains-of-dependence",
  ["Domains of Dependence", "依赖域"],
  ["See which initial data can affect a wave at a given point and time.", "判断哪些初始数据能影响给定时空点的波。"],
  ["dalemberts-formula"],
  [],
  [
    point(
      "the-interval-that-decides-a-value",
      ["The interval that decides a value", "决定一个值的区间"],
      [
        "D'Alembert's formula shows that the wave $u(x, t)$ uses initial data only on the interval from $x - ct$ to $x + ct$. This is the domain of dependence of the point. Changing the initial data outside it cannot affect the value, because no signal travels faster than $c$.",
        "达朗贝尔公式表明，波 $u(x, t)$ 只用到从 $x - ct$ 到 $x + ct$ 区间上的初始数据。这个区间称为该点的依赖域。改变依赖域外的初始数据不影响这个值，因为信号的速度不超过 $c$。",
      ],
      (rng) => {
        const [c, time] = [rng.int(2, 6), rng.int(2, 5)];
        const x = rng.int(-5, 9);
        const right = rng.bool();
        const answer = right ? x + c * time : x - c * time;
        return ask(
          [
            `For $u_{tt} = ${c * c} u_{xx}$, what is the ${right ? "right" : "left"} end of the domain of dependence of the point $x = ${x}$, $t = ${time}$?`,
            `对 $u_{tt} = ${c * c} u_{xx}$，点 $x = ${x}$，$t = ${time}$ 的依赖域的${right ? "右" : "左"}端点是多少？`,
          ],
          answer,
          [
            right ? x - c * time : x + c * time,
            right ? x + c * c * time : x - c * c * time,
            right ? x + time : x - time,
            right ? x + c : x - c,
          ],
          [
            `The wave speed is $c = \\sqrt{${c * c}} = ${c}$, so the end is $x ${right ? "+" : "-"} ct = ${x} ${right ? "+" : "-"} ${c * time} = ${answer}$.`,
            `波速是 $c = \\sqrt{${c * c}} = ${c}$，所以端点是 $x ${right ? "+" : "-"} ct = ${x} ${right ? "+" : "-"} ${c * time} = ${answer}$。`,
          ],
        );
      },
    ),
    point(
      "when-a-disturbance-arrives",
      ["When a disturbance arrives", "扰动何时到达"],
      [
        "Suppose the initial shape is nonzero only on $[a, b]$ and the initial velocity is zero. A point to the right first feels the wave when the front from $b$ arrives, at time $(x - b) / c$. It is still again after the back from $a$ has passed, at time $(x - a) / c$.",
        "设初始形状只在 $[a, b]$ 上非零，初始速度为零。右侧一点在来自 $b$ 的波前到达时首先感受到波，时间是 $(x - b) / c$。来自 $a$ 的波尾经过之后，它重新静止，时间是 $(x - a) / c$。",
      ],
      (rng) => {
        const a = rng.int(-3, 2);
        const b = a + rng.int(1, 4);
        const x = b + rng.int(2, 9);
        const c = rng.int(2, 5);
        const first = rng.bool();
        const answer = Q.of(first ? x - b : x - a, c);
        return ask(
          [
            `A string with wave speed ${c} starts at rest, displaced only on $[${a}, ${b}]$. At what time does the point $x = ${x}$ ${first ? "first start to move" : "come to rest for good"}?`,
            `一根波速为 ${c} 的弦从静止开始，只在 $[${a}, ${b}]$ 上有初始位移。点 $x = ${x}$ 在什么时刻${first ? "开始运动" : "最终静止"}？`,
          ],
          answer,
          [Q.of(first ? x - a : x - b, c), first ? x - b : x - a, Q.of(x, c), Q.of(b - a, c)],
          [
            `The ${first ? "front comes from the nearer end" : "back comes from the farther end"}, at distance ${first ? x - b : x - a}. At speed ${c} that takes $${answer.toLatex()}$.`,
            `${first ? "波前来自较近的一端" : "波尾来自较远的一端"}，距离是 ${first ? x - b : x - a}。速度为 ${c} 时需要 $${answer.toLatex()}$。`,
          ],
        );
      },
    ),
  ],
);

const reflection = topic(
  "reflection-at-a-boundary",
  ["Reflection at a Boundary", "边界上的反射"],
  ["Use images to see how pulses bounce off fixed and free ends.", "用镜像法看脉冲如何在固定端和自由端反射。"],
  ["the-wave-equation-on-a-finite-string"],
  [],
  [
    {
      ...point(
        "fixed-and-free-ends",
        ["Fixed and free ends", "固定端和自由端"],
        [
          "A fixed end keeps $u = 0$, which is achieved by an upside-down image of the pulse beyond the end, so a reflected pulse comes back inverted. A free end keeps $u_x = 0$, which is achieved by an upright image, so the pulse comes back the same way up with the same height.",
          "固定端保持 $u = 0$，相当于端点外有一个倒置的镜像脉冲，所以反射脉冲是倒过来的。自由端保持 $u_x = 0$，相当于有一个正立的镜像，所以脉冲反射后方向不变，高度也不变。",
        ],
        (rng) => {
          const height = rng.int(1, 9);
          const bounces = rng.int(1, 6);
          const fixed = rng.bool();
          const answer = fixed && bounces % 2 === 1 ? -height : height;
          const lead: Pair = fixed ? ["fixed", "固定"] : ["free", "自由"];
          return ask(
            [
              `A pulse of height ${height} travels on a string with ${lead[0]} ends. What is its height after ${bounces === 1 ? "1 reflection" : `${bounces} reflections`}?`,
              `高度为 ${height} 的脉冲在两端${lead[1]}的弦上传播。反射 ${bounces} 次后它的高度是多少？`,
            ],
            answer,
            [-answer, 0, height + bounces, height * bounces],
            [
              fixed
                ? `Each fixed end turns the pulse upside down without changing its size, and ${bounces} ${bounces % 2 === 1 ? "is odd" : "is even"}, so the height is ${answer}.`
                : "A free end sends the pulse back the same way up, so the height does not change.",
              fixed
                ? `每次固定端反射都把脉冲倒过来，大小不变，而 ${bounces} 是${bounces % 2 === 1 ? "奇数" : "偶数"}，所以高度是 ${answer}。`
                : "自由端把脉冲按原方向反射回来，所以高度不变。",
            ],
          );
        },
      ),
      figure: pdeDrawings1["reflection-at-a-boundary#fixed-and-free-ends"],
    },
    point(
      "where-a-pulse-is-later",
      ["Where a pulse is later", "脉冲之后的位置"],
      [
        "To follow a pulse on a string of length $L$, imagine it moving straight on through copies of the string. Add the distance traveled to the starting point, and reduce the total modulo $2L$. A result above $L$ means the pulse is on its way back, at the distance $2L$ minus that result.",
        "要跟踪长度为 $L$ 的弦上的脉冲，可以想象它一直向前穿过弦的一个个副本。把走过的路程加到起点上，再对 $2L$ 取余。结果大于 $L$ 表示脉冲正在返回，它的位置是 $2L$ 减去这个结果。",
      ],
      (rng) => {
        const length = rng.int(6, 12);
        const start = rng.int(1, length - 1);
        const c = rng.int(1, 4);
        const time = rng.int(2, 9);
        const total = (start + c * time) % (2 * length);
        const answer = total <= length ? total : 2 * length - total;
        return ask(
          [
            `A string runs from $x = 0$ to $x = ${length}$. A pulse at $x = ${start}$ moves right at speed ${c}. Where is it at time ${time}?`,
            `弦从 $x = 0$ 到 $x = ${length}$。一个脉冲在 $x = ${start}$ 处以速度 ${c} 向右运动。在时刻 ${time} 它在哪里？`,
          ],
          answer,
          [start + c * time, total, Math.abs(start - c * time), length - answer],
          [
            `The straight-line position is $${start} + ${c * time} = ${start + c * time}$, and modulo ${2 * length} this is ${total}. ${total <= length ? "This lies on the string" : `This is past the end, so the position is $${2 * length} - ${total}$`}, which gives $x = ${answer}$.`,
            `直线位置是 $${start} + ${c * time} = ${start + c * time}$，对 ${2 * length} 取余得 ${total}。${total <= length ? "这个位置在弦上" : `这已越过端点，所以位置是 $${2 * length} - ${total}$`}，得 $x = ${answer}$。`,
          ],
        );
      },
    ),
  ],
);

const energy = topic(
  "energy-of-a-vibrating-string",
  ["Energy of a Vibrating String", "振动弦的能量"],
  ["Add kinetic and potential energy, and see how it divides among the modes.", "把动能和势能相加，看它如何分配到各个模态。"],
  ["the-wave-equation-on-a-finite-string"],
  [],
  [
    point(
      "comparing-the-energy-of-two-modes",
      ["Comparing the energy of two modes", "比较两个模态的能量"],
      [
        "A mode of a fixed string with number $n$ and amplitude $A$ has energy proportional to $n^2 A^2$. Doubling the amplitude gives four times the energy, and so does doubling the mode number, because the string then moves twice as fast and bends twice as sharply.",
        "固定弦上编号为 $n$、振幅为 $A$ 的模态，能量与 $n^2 A^2$ 成正比。振幅加倍使能量变为四倍，模态编号加倍也一样，因为这时弦的运动速度和弯曲程度都加倍。",
      ],
      (rng) => {
        const [n, m] = rng.sample([1, 2, 3, 4, 5, 6], 2) as [number, number];
        const [a, b] = [rng.int(1, 5), rng.int(1, 5)];
        const answer = Q.of(n * n * a * a, m * m * b * b);
        return ask(
          [
            `Mode ${n} of a string has amplitude ${a} and mode ${m} has amplitude ${b}. What is the energy of mode ${n} divided by the energy of mode ${m}?`,
            `弦的第 ${n} 模态振幅为 ${a}，第 ${m} 模态振幅为 ${b}。第 ${n} 模态的能量除以第 ${m} 模态的能量是多少？`,
          ],
          answer,
          [Q.of(n * a, m * b), Q.of(a * a, b * b), Q.of(n * n, m * m), Q.of(m * m * b * b, n * n * a * a)],
          [
            `The ratio is $\\frac{${n}^2 \\cdot ${a}^2}{${m}^2 \\cdot ${b}^2} = ${answer.toLatex()}$.`,
            `比值是 $\\frac{${n}^2 \\cdot ${a}^2}{${m}^2 \\cdot ${b}^2} = ${answer.toLatex()}$。`,
          ],
        );
      },
    ),
    point(
      "energy-stays-constant",
      ["Energy stays constant", "能量保持不变"],
      [
        "The total energy of a string with fixed ends does not change over time, as differentiating it and using the wave equation shows. Energy passes back and forth between motion and bending, and different modes do not exchange energy. So the total can be read directly from the initial amplitudes.",
        "两端固定的弦的总能量不随时间变化，对它求导并使用波动方程就能看出。能量在运动和弯曲之间来回转换，不同模态之间不交换能量。所以总能量可以直接由初始振幅读出。",
      ],
      (rng) => {
        const [n, m] = rng.sample([1, 2, 3, 4, 5], 2) as [number, number];
        const [low, high] = n < m ? [n, m] : [m, n];
        const [a, b] = [rng.int(1, 6), rng.int(1, 6)];
        const answer = low * low * a * a + high * high * b * b;
        const time = rng.int(2, 9);
        return ask(
          [
            `In suitable units, mode $n$ with amplitude $A$ has energy $n^2 A^2$. A string starts at rest as $${times(a, `\\sin ${low === 1 ? "" : low}x`)} + ${times(b, `\\sin ${high}x`)}$. What is its total energy at time ${time}?`,
            `取适当单位，编号 $n$、振幅 $A$ 的模态能量为 $n^2 A^2$。弦从静止开始，形状为 $${times(a, `\\sin ${low === 1 ? "" : low}x`)} + ${times(b, `\\sin ${high}x`)}$。在时刻 ${time} 它的总能量是多少？`,
          ],
          answer,
          [a * a + b * b, low * a + high * b, answer * time, (low * a + high * b) ** 2],
          [
            `Energy does not depend on the time, and each mode has its own: $${low}^2 \\cdot ${a}^2 + ${high}^2 \\cdot ${b}^2 = ${answer}$.`,
            `能量与时间无关，每个模态各有各的能量：$${low}^2 \\cdot ${a}^2 + ${high}^2 \\cdot ${b}^2 = ${answer}$。`,
          ],
        );
      },
    ),
  ],
);

const kernel = topic(
  "the-heat-kernel",
  ["The Heat Kernel", "热核"],
  ["Describe how heat from one point spreads along an infinite rod.", "描述从一点出发的热如何沿无限长的杆扩散。"],
  ["the-heat-equation"],
  [],
  [
    point(
      "the-peak-falls-over-time",
      ["The peak falls over time", "峰值随时间下降"],
      [
        "Heat released at one point of an infinite rod has the profile $\\frac{1}{\\sqrt{4 \\pi D t}} e^{-x^2 / (4 D t)}$. Its peak at $x = 0$ is proportional to $1 / \\sqrt{t}$. So making the time four times as long only halves the peak, and the temperature falls more and more slowly.",
        "在无限长杆上一点释放的热，分布为 $\\frac{1}{\\sqrt{4 \\pi D t}} e^{-x^2 / (4 D t)}$。它在 $x = 0$ 处的峰值与 $1 / \\sqrt{t}$ 成正比。所以时间变为四倍，峰值只减半，温度下降得越来越慢。",
      ],
      (rng) => {
        const s = rng.int(2, 6);
        const start = rng.int(1, 5);
        const peak = rng.int(2, 12);
        const answer = Q.of(peak, s);
        return ask(
          [
            `Heat from a point source has peak temperature ${peak} at time ${start}. What is the peak temperature at time ${start * s * s}?`,
            `点热源在时刻 ${start} 的峰值温度是 ${peak}。在时刻 ${start * s * s} 的峰值温度是多少？`,
          ],
          answer,
          [Q.of(peak, s * s), peak * s, Q.of(peak, 2), Q.of(peak * start, start * s * s + 1)],
          [
            `The time grew by a factor of ${s * s}, so the peak falls by $\\sqrt{${s * s}} = ${s}$, which gives $${answer.toLatex()}$.`,
            `时间变为 ${s * s} 倍，所以峰值除以 $\\sqrt{${s * s}} = ${s}$，得 $${answer.toLatex()}$。`,
          ],
        );
      },
    ),
    point(
      "the-width-grows-like-a-square-root",
      ["The width grows like a square root", "宽度按平方根增长"],
      [
        "The heat kernel is a normal curve with standard deviation $\\sqrt{2 D t}$. The spread therefore grows like the square root of the time, not in proportion to it. This is the signature of diffusion: heat crosses a short distance quickly but takes four times as long to cross twice that distance.",
        "热核是标准差为 $\\sqrt{2 D t}$ 的正态曲线。因此扩散宽度按时间的平方根增长，而不是与时间成正比。这是扩散的标志：热很快穿过一小段距离，但穿过两倍距离要用四倍时间。",
      ],
      (rng) => {
        const [a, b] = [rng.int(1, 6), rng.int(1, 6)];
        const D = 2 * a * a;
        const time = b * b;
        const answer = 2 * a * b;
        return ask(
          [
            `What is the standard deviation of the heat kernel with $D = ${D}$ at time $t = ${time}$?`,
            `$D = ${D}$ 的热核在时刻 $t = ${time}$ 的标准差是多少？`,
          ],
          answer,
          [2 * D * time, D * time, a * b, 2 * D + time],
          [
            `The standard deviation is $\\sqrt{2 \\cdot ${D} \\cdot ${time}} = \\sqrt{${2 * D * time}} = ${answer}$.`,
            `标准差是 $\\sqrt{2 \\cdot ${D} \\cdot ${time}} = \\sqrt{${2 * D * time}} = ${answer}$。`,
          ],
        );
      },
    ),
    point(
      "total-heat-is-conserved",
      ["Total heat is conserved", "总热量守恒"],
      [
        "On an infinite rod, the integral of $u$ over all $x$ does not change with time, since no heat leaves. The profile becomes lower and wider but keeps the same area. So the total at any later time equals the area under the initial temperature profile.",
        "在无限长的杆上，$u$ 对所有 $x$ 的积分不随时间变化，因为热量没有流失。分布变得更低更宽，但面积不变。所以此后任何时刻的总量都等于初始温度分布下的面积。",
      ],
      (rng) => {
        const a = rng.int(-4, 3);
        const b = a + rng.int(1, 6);
        const T = rng.int(2, 9);
        const time = rng.int(2, 20);
        const answer = T * (b - a);
        return ask(
          [
            `An infinite rod starts at temperature ${T} on $[${a}, ${b}]$ and 0 elsewhere. What is $\\int_{-\\infty}^{\\infty} u(x, ${time}) \\, dx$?`,
            `无限长的杆初始时在 $[${a}, ${b}]$ 上温度为 ${T}，其他地方为 0。$\\int_{-\\infty}^{\\infty} u(x, ${time}) \\, dx$ 是多少？`,
          ],
          answer,
          [T, b - a, T * (b + a) === answer ? T + b - a : T * (b + a), Q.of(answer, time)],
          [
            `The integral stays at its initial value, the area of a rectangle: $${T} \\cdot ${b - a} = ${answer}$.`,
            `积分保持初始值，也就是矩形的面积：$${T} \\cdot ${b - a} = ${answer}$。`,
          ],
        );
      },
    ),
  ],
);

const heatMaximum = topic(
  "the-maximum-principle-for-heat",
  ["The Maximum Principle for Heat", "热方程的最大值原理"],
  ["Bound a temperature using only its initial values and its values at the ends.", "只用初始值和端点值来估计温度。"],
  ["solving-the-heat-equation-on-an-interval"],
  [],
  [
    {
      ...point(
        "bounding-a-temperature",
        ["Bounding a temperature", "估计温度的范围"],
        [
          "A solution of the heat equation on a rod over a time interval reaches its maximum and minimum on the bottom or the two sides of the space-time rectangle: at the initial time or at an end. So a rod with no sources never gets hotter than its hottest initial or end value.",
          "杆上热方程的解在时空矩形的底边或两条侧边上取到最大值和最小值，也就是在初始时刻或端点。所以没有热源的杆，温度不会超过初始值和端点值中的最高者。",
        ],
        (rng) => {
          const hot = rng.bool();
          const [initial, left, right] = rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 3) as [number, number, number];
          const answer = hot ? Math.max(initial, left, right) : Math.min(initial, left, right);
          const word: Pair = hot ? ["at most", "不超过"] : ["at least", "不低于"];
          const initialWord: Pair = hot ? ["at most", "最高"] : ["at least", "最低"];
          return ask(
            [
              `A rod has initial temperature ${initialWord[0]} ${initial} everywhere, with left end held at ${left} and right end held at ${right}. What is the sharpest number $B$ the maximum principle gives such that $u$ is always ${word[0]} $B$?`,
              `一根杆的初始温度处处${initialWord[1]}为 ${initial}，左端保持 ${left}，右端保持 ${right}。最大值原理给出的最精确的数 $B$ 是多少，使 $u$ 总是${word[1]} $B$？`,
            ],
            answer,
            [
              hot ? Math.min(initial, left, right) : Math.max(initial, left, right),
              initial,
              Q.of(left + right, 2),
              initial + left + right,
            ].filter((v) => v !== answer),
            [
              `The extreme value lies among the initial bound and the two end values: ${initial}, ${left} and ${right}. The ${hot ? "largest" : "smallest"} of these is ${answer}.`,
              `极值出现在初始界和两个端点值之中：${initial}、${left} 和 ${right}。其中${hot ? "最大" : "最小"}的是 ${answer}。`,
            ],
          );
        },
      ),
      figure: pdeDrawings1["the-maximum-principle-for-heat#bounding-a-temperature"],
    },
    point(
      "two-nearby-solutions-stay-close",
      ["Two nearby solutions stay close", "相近的解保持相近"],
      [
        "The difference of two solutions of the heat equation also solves the heat equation, so the maximum principle bounds it too. If two solutions differ by a small amount initially and at the ends, they differ by no more than that small amount at any later time. This is stability under small changes in the data.",
        "热方程两个解的差也是热方程的解，所以最大值原理同样适用于它。如果两个解在初始时刻和端点处只差一点点，那么它们此后也不会差得更多。这就是解对数据微小变化的稳定性。",
      ],
      (rng) => {
        const initial = rng.int(1, 9);
        const ends = rng.int(1, 9);
        const time = rng.int(2, 9);
        const answer = Math.max(initial, ends);
        return ask(
          [
            `Two solutions of the heat equation on a rod differ by at most ${initial} at $t = 0$, and by at most ${ends} at the ends for all times. What bound on their difference holds at $t = ${time}$?`,
            `杆上热方程的两个解在 $t = 0$ 时相差不超过 ${initial}，在端点处始终相差不超过 ${ends}。在 $t = ${time}$ 时它们的差有什么界？`,
          ],
          answer,
          [
            initial + ends,
            Math.min(initial, ends) === answer ? initial + ends + 1 : Math.min(initial, ends),
            answer * time,
            initial * ends,
          ],
          [
            `The difference solves the heat equation, so it is bounded by the larger of the data bounds, ${answer}. Time does not make it worse.`,
            `差也是热方程的解，所以它不超过数据界中较大的一个，即 ${answer}。时间不会使它变差。`,
          ],
        );
      },
    ),
  ],
);

const dispersion = topic(
  "dispersion-relations",
  ["Dispersion Relations", "色散关系"],
  ["Try a plane wave to learn how each frequency moves or fades.", "代入平面波，了解每个频率如何传播或衰减。"],
  ["the-wave-equation", "the-heat-equation"],
  [],
  [
    point(
      "the-frequency-of-a-plane-wave",
      ["The frequency of a plane wave", "平面波的频率"],
      [
        "Substituting $e^{i(kx - \\omega t)}$ into a linear equation replaces each $x$ derivative by $ik$ and each $t$ derivative by $-i \\omega$. The wave equation gives $\\omega^2 = c^2 k^2$. Adding a term as in $u_{tt} = c^2 u_{xx} - m^2 u$ gives $\\omega^2 = c^2 k^2 + m^2$.",
        "把 $e^{i(kx - \\omega t)}$ 代入线性方程，每个对 $x$ 的导数变为 $ik$，每个对 $t$ 的导数变为 $-i \\omega$。波动方程给出 $\\omega^2 = c^2 k^2$。增加一项，如 $u_{tt} = c^2 u_{xx} - m^2 u$，得 $\\omega^2 = c^2 k^2 + m^2$。",
      ],
      (rng) => {
        const [a, m, w] = rng.pick(PYTHAGOREAN);
        const c = rng.pick([1, a].filter((v, i, all) => all.indexOf(v) === i));
        const k = a / c;
        const scale = rng.int(1, 4);
        const [C, M, W] = [c * scale, m * scale, w * scale];
        return ask(
          [
            `For $u_{tt} = ${C * C === 1 ? "" : C * C} u_{xx} - ${M * M} u$, what is the positive frequency $\\omega$ of a plane wave with wave number $k = ${k}$?`,
            `对 $u_{tt} = ${C * C === 1 ? "" : C * C} u_{xx} - ${M * M} u$，波数 $k = ${k}$ 的平面波的正频率 $\\omega$ 是多少？`,
          ],
          W,
          [C * k, C * k + M, M, W + scale],
          [
            `$\\omega^2 = c^2 k^2 + m^2 = ${(C * k) ** 2} + ${M * M} = ${W * W}$, so $\\omega = ${W}$.`,
            `$\\omega^2 = c^2 k^2 + m^2 = ${(C * k) ** 2} + ${M * M} = ${W * W}$，所以 $\\omega = ${W}$。`,
          ],
        );
      },
    ),
    point(
      "phase-speed-and-group-speed",
      ["Phase speed and group speed", "相速度和群速度"],
      [
        "From a relation $\\omega(k)$, the crests of a wave move at the phase speed $\\omega / k$, and a packet of nearby waves moves at the group speed $d\\omega / dk$. They agree for the plain wave equation. When they differ, as for $\\omega = \\alpha k^2$, different wave numbers separate and the packet spreads out.",
        "由关系 $\\omega(k)$，波峰以相速度 $\\omega / k$ 移动，相近波组成的波包以群速度 $d\\omega / dk$ 移动。对普通波动方程，二者相同。当二者不同时（如 $\\omega = \\alpha k^2$），不同波数的波分开，波包就散开了。",
      ],
      (rng) => {
        const [alpha, k] = [rng.int(1, 5), rng.int(1, 9)];
        const phase = rng.bool();
        const answer = phase ? alpha * k : 2 * alpha * k;
        return ask(
          [
            `A wave has dispersion relation $\\omega = ${times(alpha, "k^2")}$. What is its ${phase ? "phase" : "group"} speed at $k = ${k}$?`,
            `一个波的色散关系是 $\\omega = ${times(alpha, "k^2")}$。在 $k = ${k}$ 处它的${phase ? "相" : "群"}速度是多少？`,
          ],
          answer,
          [phase ? 2 * alpha * k : alpha * k, alpha * k * k, alpha, k],
          [
            phase
              ? `The phase speed is $\\omega / k = ${times(alpha, "k")} = ${answer}$.`
              : `The group speed is $d\\omega / dk = ${times(2 * alpha, "k")} = ${answer}$.`,
            phase
              ? `相速度是 $\\omega / k = ${times(alpha, "k")} = ${answer}$。`
              : `群速度是 $d\\omega / dk = ${times(2 * alpha, "k")} = ${answer}$。`,
          ],
        );
      },
    ),
    point(
      "the-rate-of-a-heat-mode",
      ["The rate of a heat mode", "热模态的变化率"],
      [
        "Putting $e^{ikx + rt}$ into $u_t = D u_{xx}$ gives $r = -D k^2$. High wave numbers fade fastest, which is why heat flow smooths a profile. Reversing time, in $u_t = -D u_{xx}$, gives $r = +D k^2$: fine detail grows without limit, and this is why running the heat equation backward fails.",
        "把 $e^{ikx + rt}$ 代入 $u_t = D u_{xx}$，得 $r = -D k^2$。高波数衰减最快，这就是热流使分布变平滑的原因。把时间反过来，在 $u_t = -D u_{xx}$ 中，$r = +D k^2$：细节无限增长，这就是热方程不能倒着求解的原因。",
      ],
      (rng) => {
        const [D, k] = [rng.int(1, 5), rng.int(1, 6)];
        const backward = rng.bool();
        const answer = (backward ? 1 : -1) * D * k * k;
        return ask(
          [
            `For $u_t = ${backward ? "-" : ""}${times(D, "u_{xx}")}$, a solution has the form $e^{${k === 1 ? "" : k}ix + rt}$. What is $r$?`,
            `对 $u_t = ${backward ? "-" : ""}${times(D, "u_{xx}")}$，解的形式是 $e^{${k === 1 ? "" : k}ix + rt}$。$r$ 是多少？`,
          ],
          answer,
          [-answer, (backward ? 1 : -1) * D * k, D + k * k, k * k].filter((v) => v !== answer),
          [
            `Two $x$ derivatives give the factor $(${k === 1 ? "" : k}i)^2 = -${k * k}$, and multiplying by the coefficient ${backward ? `$-${D}$` : `$${D}$`} gives $r = ${answer}$.`,
            `两次对 $x$ 求导得因子 $(${k === 1 ? "" : k}i)^2 = -${k * k}$，乘系数 ${backward ? `$-${D}$` : `$${D}$`} 得 $r = ${answer}$。`,
          ],
        );
      },
    ),
  ],
);

const poisson = topic(
  "poissons-equation",
  ["Poisson's Equation", "泊松方程"],
  [
    "Solve Laplace's equation with a source, and see when insulated problems can be solved.",
    "求解带源项的拉普拉斯方程，判断绝热问题何时有解。",
  ],
  ["laplaces-equation"],
  [],
  [
    {
      ...point(
        "a-value-at-the-center-of-a-disc",
        ["A value at the center of a disc", "圆心处的值"],
        [
          "Poisson's equation is $\\Delta u = f$. For a constant $f$ on a disc of radius $R$ with $u = 0$ on the circle, try the radial function $u = \\frac{f}{4} (x^2 + y^2 - R^2)$. It vanishes on the circle, and its Laplacian is $\\frac{f}{4} \\cdot 4 = f$, so it is the solution.",
          "泊松方程是 $\\Delta u = f$。对半径为 $R$ 的圆盘，$f$ 为常数，圆周上 $u = 0$，试取径向函数 $u = \\frac{f}{4} (x^2 + y^2 - R^2)$。它在圆周上为零，拉普拉斯算子作用后是 $\\frac{f}{4} \\cdot 4 = f$，所以它就是解。",
        ],
        (rng) => {
          const f = rng.int(1, 9);
          const R = rng.int(1, 6);
          const answer = Q.of(-f * R * R, 4);
          return ask(
            [
              `Let $\\Delta u = ${f}$ on the disc $x^2 + y^2 < ${R * R}$, with $u = 0$ on the boundary. What is $u$ at the center?`,
              `设在圆盘 $x^2 + y^2 < ${R * R}$ 上 $\\Delta u = ${f}$，边界上 $u = 0$。圆心处 $u$ 是多少？`,
            ],
            answer,
            [Q.of(f * R * R, 4), Q.of(-f * R * R, 2), Q.of(-f * R, 4), -f],
            [
              `$u = \\frac{${f}}{4} (x^2 + y^2 - ${R * R})$, and at the center this is $\\frac{${f}}{4} \\cdot (-${R * R}) = ${answer.toLatex()}$.`,
              `$u = \\frac{${f}}{4} (x^2 + y^2 - ${R * R})$，在圆心处等于 $\\frac{${f}}{4} \\cdot (-${R * R}) = ${answer.toLatex()}$。`,
            ],
          );
        },
      ),
      figure: pdeDrawings1["poissons-equation#a-value-at-the-center-of-a-disc"],
    },
    point(
      "when-an-insulated-problem-has-a-solution",
      ["When an insulated problem has a solution", "绝热问题何时有解"],
      [
        "Integrating $u'' = f$ across an interval gives $u'(L) - u'(0) = \\int_0^L f \\, dx$, so the fluxes given at the ends must match the total source. If they do not, no steady state exists. If they do, solutions exist but differ by a constant, which the data does not fix.",
        "把 $u'' = f$ 在区间上积分，得 $u'(L) - u'(0) = \\int_0^L f \\, dx$，所以端点给定的通量必须与源项总量相符。如果不符，就没有稳态解。如果相符，解存在，但彼此相差一个常数，数据不能确定它。",
      ],
      (rng) => {
        const [f, L] = [rng.int(1, 6), rng.int(2, 6)];
        const p = rng.int(-4, 4);
        const answer = p + f * L;
        return ask(
          [
            `Let $u'' = ${f}$ on $[0, ${L}]$ with $u'(0) = ${p}$. What value of $u'(${L})$ makes a solution possible?`,
            `设在 $[0, ${L}]$ 上 $u'' = ${f}$，$u'(0) = ${p}$。$u'(${L})$ 取什么值时才可能有解？`,
          ],
          answer,
          [p - f * L, f * L, p + f, p],
          [
            `The change in $u'$ across the interval equals the total source, $${f} \\cdot ${L} = ${f * L}$. So $u'(${L}) = ${p} + ${f * L} = ${answer}$.`,
            `$u'$ 在区间上的变化等于源项总量 $${f} \\cdot ${L} = ${f * L}$。所以 $u'(${L}) = ${p} + ${f * L} = ${answer}$。`,
          ],
        );
      },
    ),
  ],
);

const membrane = topic(
  "the-vibrating-membrane",
  ["The Vibrating Membrane", "振动的膜"],
  ["Separate variables in two dimensions and find the frequencies of a drum.", "在二维中分离变量，求鼓面的频率。"],
  ["the-wave-equation-on-a-finite-string"],
  [],
  [
    point(
      "a-frequency-of-a-square-drum",
      ["A frequency of a square drum", "方形鼓的频率"],
      [
        "A square membrane of side $L$, fixed at its edge, has modes $\\sin \\frac{m \\pi x}{L} \\sin \\frac{n \\pi y}{L}$ with angular frequency $\\omega = \\frac{c \\pi}{L} \\sqrt{m^2 + n^2}$. Unlike a string, these frequencies are not whole multiples of the lowest one, which is why a drum has no clear pitch.",
        "边长为 $L$、边缘固定的方形膜，模态是 $\\sin \\frac{m \\pi x}{L} \\sin \\frac{n \\pi y}{L}$，角频率是 $\\omega = \\frac{c \\pi}{L} \\sqrt{m^2 + n^2}$。与弦不同，这些频率不是最低频率的整数倍，所以鼓没有清晰的音高。",
      ],
      (rng) => {
        const [m, n, root] = rng.pick(PYTHAGOREAN);
        const c = rng.int(1, 6);
        const L = rng.int(1, 5);
        const answer = Q.of(c * root, L);
        return ask(
          [
            `A square membrane of side ${L} has wave speed ${c}. Its mode $(m, n) = (${m}, ${n})$ has frequency $\\omega = k \\pi$. What is $k$?`,
            `边长为 ${L} 的方形膜波速为 ${c}。它的模态 $(m, n) = (${m}, ${n})$ 的频率是 $\\omega = k \\pi$。$k$ 是多少？`,
          ],
          answer,
          [Q.of(c * (m + n), L), Q.of(root, L), Q.of(c * root, L * L), c * root],
          [
            `$\\sqrt{${m}^2 + ${n}^2} = ${root}$, so $\\omega = \\frac{${times(c, "\\pi")}}{${L}} \\cdot ${root}$, and $k = ${answer.toLatex()}$.`,
            `$\\sqrt{${m}^2 + ${n}^2} = ${root}$，所以 $\\omega = \\frac{${times(c, "\\pi")}}{${L}} \\cdot ${root}$，$k = ${answer.toLatex()}$。`,
          ],
        );
      },
    ),
    point(
      "modes-that-share-a-frequency",
      ["Modes that share a frequency", "频率相同的模态"],
      [
        "On a square drum, the modes $(m, n)$ with the same value of $m^2 + n^2$ share a frequency. The pairs $(m, n)$ and $(n, m)$ are always such partners when $m \\ne n$, and some numbers such as 50 have more than one way to be written as a sum of two squares.",
        "方形鼓上，$m^2 + n^2$ 相同的模态 $(m, n)$ 频率相同。当 $m \\ne n$ 时，$(m, n)$ 和 $(n, m)$ 总是这样的一对，而有些数（如 50）不止一种方法写成两个平方数之和。",
      ],
      (rng) => {
        const pairs = (value: number) => {
          const found: [number, number][] = [];
          for (let m = 1; m * m < value; m++) {
            const n = Math.round(Math.sqrt(value - m * m));
            if (n > 0 && n * n === value - m * m) found.push([m, n]);
          }
          return found;
        };
        const values = Array.from({ length: 200 }, (_, i) => i + 2).filter((v) => pairs(v).length > 0);
        const value = rng.pick(values);
        const found = pairs(value);
        const list = found.map(([m, n]) => `(${m}, ${n})`).join(", ");
        const count = found.length;
        return ask(
          [
            `On a square drum, how many modes $(m, n)$, with $m$ and $n$ positive whole numbers and order counted, have $m^2 + n^2 = ${value}$?`,
            `方形鼓上，有多少个模态 $(m, n)$ 满足 $m^2 + n^2 = ${value}$？这里 $m$、$n$ 是正整数，并区分顺序。`,
          ],
          count,
          [count + 1, count + 2, count === 1 ? 4 : Math.ceil(count / 2), 0].filter((v) => v !== count),
          [
            `Try $m = 1, 2, \\ldots$ while $m^2 < ${value}$, and keep each $m$ for which $${value} - m^2$ is a square. That gives ${"$"}${list}${"$"}, which makes ${count}.`,
            `依次试 $m = 1, 2, \\ldots$（$m^2 < ${value}$），保留使 $${value} - m^2$ 为平方数的 $m$。得到 ${"$"}${list}${"$"}，共 ${count} 个。`,
          ],
        );
      },
    ),
  ],
);

const robin = topic(
  "robin-boundary-conditions",
  ["Robin Boundary Conditions", "罗宾边界条件"],
  ["Model an end that loses heat to its surroundings.", "为向周围散热的端点建立模型。"],
  ["nonhomogeneous-heat-problems"],
  [],
  [
    point(
      "naming-a-boundary-condition",
      ["Naming a boundary condition", "辨认边界条件"],
      [
        "A Dirichlet condition gives the value of $u$ at the boundary, and a Neumann condition gives its derivative. A Robin condition gives a combination of both, such as $u_x + h u = g$. Physically, Newton's law of cooling is a Robin condition: heat leaves an end at a rate proportional to its excess temperature.",
        "狄利克雷条件给出边界上 $u$ 的值，诺伊曼条件给出它的导数。罗宾条件给出二者的组合，如 $u_x + h u = g$。从物理上说，牛顿冷却定律就是罗宾条件：端点散热的速率与它高出环境的温度成正比。",
      ],
      (rng) => {
        const kind = rng.int(0, 2);
        const [a, h] = [rng.int(1, 12), rng.int(2, 9)];
        const body = kind === 0 ? `u(0, t) = ${a}` : kind === 1 ? `u_x(0, t) = ${a}` : `u_x(0, t) + ${h} u(0, t) = ${a}`;
        const names: Pair[] = [
          ["Dirichlet", "狄利克雷条件"],
          ["Neumann", "诺伊曼条件"],
          ["Robin", "罗宾条件"],
        ];
        const correct = names[kind] as Pair;
        return choose(
          rng,
          [`What kind of boundary condition is $${body}$?`, `$${body}$ 是哪种边界条件？`],
          correct,
          [...names, ["Periodic", "周期条件"]],
          [
            kind === 0
              ? "It gives the value of $u$ itself, so it is a Dirichlet condition."
              : kind === 1
                ? "It gives only the derivative of $u$, so it is a Neumann condition."
                : "It combines the value and the derivative of $u$, so it is a Robin condition.",
            kind === 0
              ? "它给出 $u$ 本身的值，所以是狄利克雷条件。"
              : kind === 1
                ? "它只给出 $u$ 的导数，所以是诺伊曼条件。"
                : "它把 $u$ 的值和导数组合在一起，所以是罗宾条件。",
          ],
        );
      },
    ),
    point(
      "the-end-of-a-cooling-rod",
      ["The end of a cooling rod", "散热杆的端点"],
      [
        "A steady state in a rod is a straight line, $u = T + s x$. If one end is held at $T$ and the other at $x = L$ cools by $u_x = -h (u - E)$ into surroundings at $E$, substitute the line to find the slope: $s (1 + h L) = -h (T - E)$. The end lies between $T$ and $E$.",
        "杆的稳态是一条直线 $u = T + s x$。如果一端保持 $T$，另一端 $x = L$ 按 $u_x = -h (u - E)$ 向温度为 $E$ 的环境散热，代入直线可求斜率：$s (1 + h L) = -h (T - E)$。端点温度在 $T$ 和 $E$ 之间。",
      ],
      (rng) => {
        const [h, L] = [rng.int(1, 4), rng.int(1, 4)];
        const E = rng.int(0, 6);
        const T = E + (1 + h * L) * rng.int(1, 5);
        const slope = Q.of(-h * (T - E), 1 + h * L);
        const answer = slope.mul(Q.of(L, 1)).add(Q.of(T, 1));
        return ask(
          [
            `A rod on $[0, ${L}]$ is steady, with $u(0) = ${T}$ and $u_x(${L}) = -${h === 1 ? "" : h} (u(${L}) - ${E})$. What is $u(${L})$?`,
            `$[0, ${L}]$ 上的杆处于稳态，$u(0) = ${T}$，$u_x(${L}) = -${h === 1 ? "" : h} (u(${L}) - ${E})$。$u(${L})$ 是多少？`,
          ],
          answer,
          [E, T, Q.of(T + E, 2), slope],
          [
            `Put $u = ${T} + s x$. Then $s = -${h === 1 ? "" : h} (${T} + ${times(L, "s")} - ${E})$, which gives $s = ${slope.toLatex()}$. So $u(${L}) = ${T} + ${L} \\cdot (${slope.toLatex()}) = ${answer.toLatex()}$.`,
            `令 $u = ${T} + s x$。则 $s = -${h === 1 ? "" : h} (${T} + ${times(L, "s")} - ${E})$，得 $s = ${slope.toLatex()}$。所以 $u(${L}) = ${T} + ${L} \\cdot (${slope.toLatex()}) = ${answer.toLatex()}$。`,
          ],
        );
      },
    ),
  ],
);

const damped = topic(
  "damped-waves",
  ["Damped Waves", "阻尼波"],
  ["Add friction to the wave equation and see which modes still oscillate.", "在波动方程中加入摩擦，看哪些模态仍然振荡。"],
  ["the-wave-equation-on-a-finite-string"],
  [],
  [
    point(
      "the-frequency-of-a-damped-mode",
      ["The frequency of a damped mode", "阻尼模态的频率"],
      [
        "In $u_{tt} + 2b u_t = c^2 u_{xx}$, each mode has a time factor solving $T'' + 2b T' + \\omega^2 T = 0$, where $\\omega$ is the frequency without damping. When $b < \\omega$, it oscillates at the lower frequency $\\sqrt{\\omega^2 - b^2}$ inside an envelope $e^{-bt}$ that is the same for all modes.",
        "在 $u_{tt} + 2b u_t = c^2 u_{xx}$ 中，每个模态的时间因子满足 $T'' + 2b T' + \\omega^2 T = 0$，其中 $\\omega$ 是无阻尼时的频率。当 $b < \\omega$ 时，它以较低的频率 $\\sqrt{\\omega^2 - b^2}$ 振荡，包络 $e^{-bt}$ 对所有模态相同。",
      ],
      (rng) => {
        const [b, nu, w] = rng.pick(PYTHAGOREAN);
        const scale = rng.int(1, 4);
        const [B, N, W] = [b * scale, nu * scale, w * scale];
        const askRate = rng.bool();
        const answer = askRate ? B : N;
        return ask(
          [
            `A mode of a damped string satisfies $T'' + ${2 * B} T' + ${W * W} T = 0$. What is ${askRate ? "the rate $r$ in its envelope $e^{-rt}$" : "the frequency of its oscillation"}?`,
            `阻尼弦的一个模态满足 $T'' + ${2 * B} T' + ${W * W} T = 0$。${askRate ? "它的包络 $e^{-rt}$ 中的 $r$" : "它的振荡频率"}是多少？`,
          ],
          answer,
          [askRate ? 2 * B : W, askRate ? N : B, W + B, 2 * W],
          [
            `Here $b = ${B}$ and $\\omega = ${W}$. The envelope has rate $b = ${B}$, and the frequency is $\\sqrt{${W * W} - ${B * B}} = ${N}$.`,
            `这里 $b = ${B}$，$\\omega = ${W}$。包络的衰减率是 $b = ${B}$，频率是 $\\sqrt{${W * W} - ${B * B}} = ${N}$。`,
          ],
        );
      },
    ),
    point(
      "modes-that-do-not-oscillate",
      ["Modes that do not oscillate", "不振荡的模态"],
      [
        "On a string of length $\\pi$ with fixed ends, mode $n$ has undamped frequency $\\omega_n = n c$. Strong damping affects only the low modes: those with $n c \\le b$ decay without oscillating, while all the higher modes still vibrate. So only finitely many modes stop oscillating, however large $b$ may be.",
        "长度为 $\\pi$、两端固定的弦，第 $n$ 模态的无阻尼频率是 $\\omega_n = n c$。强阻尼只影响低模态：满足 $n c \\le b$ 的模态衰减而不振荡，其余较高的模态仍然振动。所以无论 $b$ 多大，不振荡的模态都只有有限个。",
      ],
      (rng) => {
        const c = rng.int(1, 5);
        const b = rng.int(c, 30);
        const answer = Math.floor(b / c);
        return ask(
          [
            `For $u_{tt} + ${2 * b} u_t = ${c * c === 1 ? "" : c * c} u_{xx}$ on $[0, \\pi]$ with fixed ends, how many modes do not oscillate?`,
            `对 $[0, \\pi]$ 上两端固定的 $u_{tt} + ${2 * b} u_t = ${c * c === 1 ? "" : c * c} u_{xx}$，有多少个模态不振荡？`,
          ],
          answer,
          [answer + 1, Math.floor((2 * b) / c), Math.max(answer - 1, 0) === answer ? answer + 2 : Math.max(answer - 1, 0), b],
          [
            `Here $b = ${b}$ and $c = ${c}$. A mode fails to oscillate when $${times(c, "n")} \\le ${b}$, that is, for $n$ up to ${answer}.`,
            `这里 $b = ${b}$，$c = ${c}$。当 $${times(c, "n")} \\le ${b}$ 时模态不振荡，即 $n$ 不超过 ${answer}。`,
          ],
        );
      },
    ),
  ],
);

const wellPosed = topic(
  "well-posed-problems",
  ["Well-Posed Problems", "适定问题"],
  ["Match each type of equation with the data that determines its solution.", "把每类方程与决定其解的数据配对。"],
  ["classifying-second-order-equations", "the-wave-equation", "the-heat-equation"],
  [],
  [
    point(
      "how-many-initial-conditions",
      ["How many initial conditions", "需要几个初始条件"],
      [
        "An equation with $k$ time derivatives needs $k$ initial conditions: the heat equation needs one, the initial temperature, and the wave equation needs two, the initial shape and velocity. Laplace's equation has no time and takes boundary conditions all around instead, so the number of initial conditions is zero.",
        "含 $k$ 阶时间导数的方程需要 $k$ 个初始条件：热方程需要一个，即初始温度；波动方程需要两个，即初始形状和速度。拉普拉斯方程没有时间，改为在四周给边界条件，所以初始条件的个数是零。",
      ],
      (rng) => {
        const [a, b] = [rng.int(2, 9), rng.int(2, 9)];
        const [body, answer] = rng.pick([
          [`u_t = ${a} u_{xx}`, 1],
          [`u_t + ${a} u_x = ${b}`, 1],
          [`u_{tt} = ${a} u_{xx}`, 2],
          [`u_{tt} + ${b} u_t = ${a} u_{xx}`, 2],
          [`u_{tt} = -${a} u_{xxxx}`, 2],
          [`u_{ttt} = ${a} u_{x}`, 3],
        ] as const);
        return ask(
          [`How many initial conditions at $t = 0$ does $${body}$ need?`, `$${body}$ 在 $t = 0$ 时需要几个初始条件？`],
          answer,
          [1, 2, 3, 4].filter((v) => v !== answer),
          [
            `The highest time derivative has order ${answer}, so ${answer === 1 ? "one initial condition is" : `${answer} initial conditions are`} needed. Derivatives in $x$ do not count.`,
            `最高阶时间导数是 ${answer} 阶，所以需要 ${answer} 个初始条件。对 $x$ 的导数不算。`,
          ],
        );
      },
    ),
    point(
      "spotting-the-ill-posed-problem",
      ["Spotting the ill-posed problem", "识别不适定问题"],
      [
        "A problem is well posed when a solution exists, is unique, and depends continuously on the data. The usual failures are running the heat equation backward in time and giving Laplace's equation initial data as if it were a wave equation. In both, tiny high-frequency changes in the data grow enormously.",
        "问题适定是指解存在、唯一，并且连续依赖于数据。常见的失败情形是把热方程倒着时间求解，以及把拉普拉斯方程当成波动方程来给初始数据。在这两种情形下，数据中微小的高频变化都会急剧增大。",
      ],
      (rng) => {
        const [a, b] = [rng.int(2, 9), rng.int(2, 9)];
        const backward = rng.bool();
        const bad: Pair = backward
          ? [`$u_t = ${a} u_{xx}$ for $t < 0$, given $u$ at $t = 0$`, `$u_t = ${a} u_{xx}$，$t < 0$，给定 $t = 0$ 时的 $u$`]
          : [
              `$u_{xx} + u_{yy} = 0$ for $y > 0$, given $u$ and $u_y$ at $y = 0$`,
              `$u_{xx} + u_{yy} = 0$，$y > 0$，给定 $y = 0$ 时的 $u$ 和 $u_y$`,
            ];
        return choose(
          rng,
          ["Which of these problems is ill posed?", "下面哪个问题是不适定的？"],
          bad,
          [
            [`$u_t = ${a} u_{xx}$ for $t > 0$, given $u$ at $t = 0$`, `$u_t = ${a} u_{xx}$，$t > 0$，给定 $t = 0$ 时的 $u$`],
            [
              `$u_{tt} = ${b} u_{xx}$ for $t > 0$, given $u$ and $u_t$ at $t = 0$`,
              `$u_{tt} = ${b} u_{xx}$，$t > 0$，给定 $t = 0$ 时的 $u$ 和 $u_t$`,
            ],
            [
              "$u_{xx} + u_{yy} = 0$ in a square, given $u$ on the whole boundary",
              "$u_{xx} + u_{yy} = 0$ 在正方形内，给定整个边界上的 $u$",
            ],
          ],
          [
            backward
              ? "Running heat backward multiplies a mode with wave number $k$ by a factor that grows like $e^{D k^2 |t|}$, so small data can grow without bound."
              : "Laplace's equation given both $u$ and $u_y$ on a line has solutions such as $\\frac{1}{k^2} \\sin kx \\cosh ky$, which blow up from tiny data.",
            backward
              ? "倒着求解热方程时，波数为 $k$ 的模态乘以按 $e^{D k^2 |t|}$ 增长的因子，所以微小的数据可以无限增大。"
              : "在一条线上同时给定 $u$ 和 $u_y$ 的拉普拉斯方程，有 $\\frac{1}{k^2} \\sin kx \\cosh ky$ 这样的解，极小的数据会导致爆炸式增长。",
          ],
        );
      },
    ),
  ],
);

const leapfrog = topic(
  "finite-differences-for-the-wave-equation",
  ["Finite Differences for the Wave Equation", "波动方程的有限差分"],
  ["Step a wave forward on a grid, and keep the time step small enough.", "在网格上推进波，并保持时间步长足够小。"],
  ["the-wave-equation", "finite-differences-for-the-heat-equation"],
  [],
  [
    point(
      "the-largest-stable-time-step",
      ["The largest stable time step", "最大的稳定时间步长"],
      [
        "The standard scheme for the wave equation is stable when the Courant number $c \\, \\Delta t / \\Delta x$ is at most 1. The reason is physical: a grid value can only learn from its neighbors, so the numerical signal must be able to keep up with the true wave. Finer grids therefore need proportionally smaller steps.",
        "波动方程的标准格式在库朗数 $c \\, \\Delta t / \\Delta x$ 不超过 1 时稳定。原因来自物理：格点的值只能从相邻格点获得信息，所以数值信号必须跟得上真实的波。因此网格越细，时间步长要按比例越小。",
      ],
      (rng) => {
        const c = rng.int(2, 9);
        const parts = rng.int(2, 12);
        const answer = Q.of(1, c * parts);
        return ask(
          [
            `For a wave with speed ${c} on a grid with $\\Delta x = \\frac{1}{${parts}}$, what is the largest stable $\\Delta t$?`,
            `波速为 ${c}，网格 $\\Delta x = \\frac{1}{${parts}}$。稳定的最大 $\\Delta t$ 是多少？`,
          ],
          answer,
          [Q.of(c, parts), Q.of(1, 2 * c * parts), Q.of(1, c * parts * parts), Q.of(1, parts)],
          [
            `Stability needs $${c} \\, \\Delta t \\le \\frac{1}{${parts}}$, so the largest step is $${answer.toLatex()}$.`,
            `稳定性要求 $${c} \\, \\Delta t \\le \\frac{1}{${parts}}$，所以最大步长是 $${answer.toLatex()}$。`,
          ],
        );
      },
    ),
    point(
      "one-step-of-the-leapfrog-scheme",
      ["One step of the leapfrog scheme", "蛙跳格式的一步"],
      [
        "The leapfrog scheme uses two earlier time levels: $u_i^{n+1} = 2 u_i^n - u_i^{n-1} + r^2 (u_{i+1}^n - 2 u_i^n + u_{i-1}^n)$, where $r$ is the Courant number. It needs two starting levels because the wave equation needs both an initial shape and an initial velocity.",
        "蛙跳格式用到前两个时间层：$u_i^{n+1} = 2 u_i^n - u_i^{n-1} + r^2 (u_{i+1}^n - 2 u_i^n + u_{i-1}^n)$，其中 $r$ 是库朗数。它需要两个起始层，因为波动方程既需要初始形状，又需要初始速度。",
      ],
      (rng) => {
        const r2 = rng.pick([Q.of(1, 1), Q.of(1, 4), Q.of(1, 2)]);
        const [left, mid, right, last] = [rng.int(0, 9), rng.int(1, 9), rng.int(0, 9), rng.int(0, 9)];
        const curvature = left - 2 * mid + right;
        const answer = Q.of(2 * mid - last, 1).add(r2.mul(Q.of(curvature, 1)));
        return ask(
          [
            `With $r^2 = ${r2.toLatex()}$, a leapfrog step has neighbors $u_{i-1}^n = ${left}$ and $u_{i+1}^n = ${right}$, with $u_i^n = ${mid}$ and $u_i^{n-1} = ${last}$. What is $u_i^{n+1}$?`,
            `$r^2 = ${r2.toLatex()}$，蛙跳的一步中相邻值 $u_{i-1}^n = ${left}$，$u_{i+1}^n = ${right}$，并且 $u_i^n = ${mid}$，$u_i^{n-1} = ${last}$。$u_i^{n+1}$ 是多少？`,
          ],
          answer,
          [
            Q.of(2 * mid + last, 1).add(r2.mul(Q.of(curvature, 1))),
            Q.of(mid, 1).add(r2.mul(Q.of(curvature, 1))),
            Q.of(2 * mid - last, 1),
            Q.of(left + right - last, 1).add(Q.of(1, 2)),
          ],
          [
            `The neighbors give $${left} - 2 \\cdot ${mid} + ${right} = ${curvature}$. Then $2 \\cdot ${mid} - ${last} + ${r2.toLatex()} \\cdot (${curvature}) = ${answer.toLatex()}$.`,
            `相邻值给出 $${left} - 2 \\cdot ${mid} + ${right} = ${curvature}$。于是 $2 \\cdot ${mid} - ${last} + ${r2.toLatex()} \\cdot (${curvature}) = ${answer.toLatex()}$。`,
          ],
        );
      },
    ),
  ],
);

/** partialDifferentialEquationsMoreTopics holds the later topics of the Partial Differential Equations course. */
export const partialDifferentialEquationsMoreTopics: readonly TopicDef[] = [
  shocks,
  dependence,
  reflection,
  energy,
  kernel,
  heatMaximum,
  dispersion,
  poisson,
  membrane,
  robin,
  damped,
  wellPosed,
  leapfrog,
];
