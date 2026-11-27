// More of Partial Differential Equations: shocks, domains of dependence, reflections, energy, the heat kernel,
// dispersion relations, Poisson's equation, membranes, Robin conditions, damping, well-posedness and leapfrog.

import type { TopicDef } from "@ga/content";
import { Q } from "@ga/subject-math";
import { pdeDrawings1 } from "../explanation-drawings-partial-differential-equations-1.ts";

import { type Pair, point, topic } from "../university-kit.ts";
import { chosen, lesson, type Miss, type Slip, until, worked } from "./number-theory-course.ts";

/** times writes a coefficient before a symbol, leaving out a coefficient of one. */
const times = (c: number, symbol: string): string => (c === 1 ? symbol : `${c} ${symbol}`);

/** wrap puts a negative number in parentheses, so that it can follow an operation sign. */
const wrap = (n: number): string => (n < 0 ? `(${n})` : `${n}`);

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
        "In the equation $u_t + u u_x = 0$, the solution is constant along each characteristic, and the speed of that characteristic is the value of $u$ it carries. So the line starting at $x_0$ is $x = x_0 + u(x_0, 0) \\, t$. Taller parts of the wave travel faster than lower parts. For example, with $u(x, 0) = 2x + 1$, the characteristic from $x_0 = 1$ carries $u = 3$, so at $t = 2$ it is at $x = 1 + 3 \\cdot 2 = 7$.\n\nCheck: tracing back from $(7, 2)$, the foot $x_0$ must satisfy $x_0 + (2x_0 + 1) \\cdot 2 = 7$, that is $5x_0 = 5$, so $x_0 = 1$.\n\n> **Watch out.** The speed is the value $u(x_0, 0)$ that the line carries, not the slope of the initial profile.",
        "在方程 $u_t + u u_x = 0$ 中，解沿每条特征线不变，而这条特征线的速度就是它携带的 $u$ 值。所以从 $x_0$ 出发的直线是 $x = x_0 + u(x_0, 0) \\, t$。波的高处比低处走得快。例如，$u(x, 0) = 2x + 1$ 时，从 $x_0 = 1$ 出发的特征线携带 $u = 3$，所以在 $t = 2$ 时位于 $x = 1 + 3 \\cdot 2 = 7$。\n\n检验：从 $(7, 2)$ 往回追，起点 $x_0$ 必须满足 $x_0 + (2x_0 + 1) \\cdot 2 = 7$，即 $5x_0 = 5$，所以 $x_0 = 1$。\n\n> **注意。** 速度是这条线携带的值 $u(x_0, 0)$，而不是初始剖面的斜率。",
      ],
      (rng) =>
        until(() => {
          const [a, b] = [rng.int(1, 4), rng.int(1, 5)];
          const [x0, time] = [rng.int(1, 5), rng.int(2, 5)];
          const speed = a * x0 + b;
          const answer = x0 + speed * time;
          const misses: Miss[] = [
            [speed * time, "That forgets the starting point $x_0$.", "那忘了起点 $x_0$。"],
            [
              x0 + b * time,
              `That uses only the constant $${b}$ as the speed; the line carries $u(x_0, 0) = ${speed}$.`,
              `那只把常数 $${b}$ 当作速度；这条线携带的是 $u(x_0, 0) = ${speed}$。`,
            ],
            [
              x0 + a * time,
              `That uses the slope $${a}$ of the profile as the speed; the speed is the value $${speed}$.`,
              `那把剖面的斜率 $${a}$ 当作速度；速度应是值 $${speed}$。`,
            ],
            [x0 + speed + time, "That adds the time instead of multiplying the speed by it.", "那是加上时间，而不是用速度乘以时间。"],
          ];
          return worked(
            [
              `For $u_t + u u_x = 0$ with $u(x, 0) = ${times(a, "x")} + ${b}$, where is the characteristic from $x_0 = ${x0}$ at time $t = ${time}$?`,
              `对 $u_t + u u_x = 0$，$u(x, 0) = ${times(a, "x")} + ${b}$，从 $x_0 = ${x0}$ 出发的特征线在 $t = ${time}$ 时位于何处？`,
            ],
            answer,
            misses,
            [
              [
                ["Find the speed", "求速度"],
                [
                  `The characteristic carries $u = ${a} \\cdot ${x0} + ${b} = ${speed}$, which is its speed.`,
                  `特征线携带的值是 $u = ${a} \\cdot ${x0} + ${b} = ${speed}$，这就是它的速度。`,
                ],
              ],
              [
                ["Move along the line", "沿直线移动"],
                [`$x = ${x0} + ${speed} \\cdot ${time} = ${answer}$.`, `$x = ${x0} + ${speed} \\cdot ${time} = ${answer}$。`],
              ],
            ],
            [
              `Tracing back from $(${answer}, ${time})$, the foot satisfies $x_0 + (${times(a, "x_0")} + ${b}) \\cdot ${time} = ${answer}$, that is $${1 + a * time}x_0 = ${answer - b * time}$, so $x_0 = ${x0}$.`,
              `从 $(${answer}, ${time})$ 往回追，起点满足 $x_0 + (${times(a, "x_0")} + ${b}) \\cdot ${time} = ${answer}$，即 $${1 + a * time}x_0 = ${answer - b * time}$，所以 $x_0 = ${x0}$。`,
            ],
          );
        }),
    ),
    point(
      "when-two-characteristics-cross",
      ["When two characteristics cross", "两条特征线何时相交"],
      [
        "If a faster characteristic starts behind a slower one, it catches up. Setting $x_1 + u_1 t = x_2 + u_2 t$ gives the crossing time $t = (x_2 - x_1) / (u_1 - u_2)$. At that moment the solution would need two values at one point, so a smooth solution cannot continue past it. For example, lines from $x = 0$ with $u = 5$ and from $x = 4$ with $u = 3$ start $4$ apart, and the gap closes at the rate $2$, so they cross at $t = 2$.\n\nCheck: at $t = 2$ the first is at $0 + 10 = 10$ and the second at $4 + 6 = 10$.\n\n> **Watch out.** Both lines move the same way, so the gap closes at the difference of the speeds, not their sum.",
        "如果较快的特征线从较慢的后方出发，就会追上它。令 $x_1 + u_1 t = x_2 + u_2 t$，得相交时间 $t = (x_2 - x_1) / (u_1 - u_2)$。此刻解在同一点需要取两个值，所以光滑解不能继续下去。例如，从 $x = 0$ 出发、$u = 5$ 的线和从 $x = 4$ 出发、$u = 3$ 的线相距 $4$，距离以 $2$ 的速度缩小，所以它们在 $t = 2$ 相交。\n\n检验：$t = 2$ 时第一条在 $0 + 10 = 10$，第二条在 $4 + 6 = 10$。\n\n> **注意。** 两条线向同一方向运动，所以距离以速度之差缩小，而不是速度之和。",
      ],
      (rng) =>
        until(() => {
          const x1 = rng.int(0, 6);
          const gap = rng.int(1, 9);
          const u2 = rng.int(1, 5);
          const drop = rng.int(1, 6);
          const u1 = u2 + drop;
          const answer = Q.of(gap, drop);
          const meet = Q.of(x1).add(answer.mul(Q.of(u1)));
          const misses: Miss[] = [
            [
              Q.of(gap, u1 + u2),
              "That adds the speeds; both lines move the same way, so the gap closes at their difference.",
              "那把速度相加了；两条线同向运动，距离以速度之差缩小。",
            ],
            [Q.of(drop, gap), "That divides the other way round: time is distance over rate.", "那除反了：时间是距离除以速率。"],
            [Q.of(gap), "That forgets to divide the gap by the rate at which it closes.", "那忘了用距离除以缩小的速率。"],
            [Q.of(gap, u1), "That uses only the faster speed; the slower line is moving too.", "那只用了较快的速度；较慢的线也在运动。"],
          ];
          return worked(
            [
              `For $u_t + u u_x = 0$, one characteristic starts at $x = ${x1}$ carrying $u = ${u1}$, and another starts at $x = ${x1 + gap}$ carrying $u = ${u2}$. At what time do they cross?`,
              `对 $u_t + u u_x = 0$，一条特征线从 $x = ${x1}$ 出发，携带 $u = ${u1}$；另一条从 $x = ${x1 + gap}$ 出发，携带 $u = ${u2}$。它们在什么时刻相交？`,
            ],
            answer,
            misses,
            [
              [
                ["Find the closing rate", "求缩小的速率"],
                [
                  `The gap is ${gap}, and it closes at the rate $${u1} - ${u2} = ${drop}$.`,
                  `它们相距 ${gap}，以 $${u1} - ${u2} = ${drop}$ 的速率缩小。`,
                ],
              ],
              [
                ["Divide", "相除"],
                [
                  `$t = ${drop === 1 ? "" : `\\frac{${gap}}{${drop}} = `}${answer.toLatex()}$.`,
                  `$t = ${drop === 1 ? "" : `\\frac{${gap}}{${drop}} = `}${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `At $t = ${answer.toLatex()}$ the first line is at $${x1} + ${u1} \\cdot ${answer.toLatex()} = ${meet.toLatex()}$ and the second at $${x1 + gap} + ${u2} \\cdot ${answer.toLatex()} = ${meet.toLatex()}$, the same point.`,
              `$t = ${answer.toLatex()}$ 时，第一条线在 $${x1} + ${u1} \\cdot ${answer.toLatex()} = ${meet.toLatex()}$，第二条在 $${x1 + gap} + ${u2} \\cdot ${answer.toLatex()} = ${meet.toLatex()}$，是同一点。`,
            ],
          );
        }),
    ),
    point(
      "the-speed-of-a-shock",
      ["The speed of a shock", "激波的速度"],
      [
        "After characteristics cross, the solution contains a jump called a shock. For $u_t + u u_x = 0$, conservation requires the jump to move at the average of the values on its two sides, $\\frac{1}{2} (u_L + u_R)$. This is the Rankine-Hugoniot condition, and a shock needs $u_L > u_R$. For example, a shock with $u_L = 4$ and $u_R = 0$ moves at $\\frac{1}{2}(4 + 0) = 2$.\n\nCheck: in conservation form the flux is $\\frac{u^{2}}{2}$, and the jump in flux over the jump in $u$ is $\\frac{8 - 0}{4 - 0} = 2$.\n\n> **Watch out.** A jump with $u_L < u_R$ is not a shock: the characteristics spread apart and the jump opens into a fan.",
        "特征线相交后，解中出现一个跳跃，称为激波。对 $u_t + u u_x = 0$，守恒要求跳跃以两侧值的平均值 $\\frac{1}{2} (u_L + u_R)$ 移动。这就是兰金–于戈尼奥条件，激波要求 $u_L > u_R$。例如，$u_L = 4$，$u_R = 0$ 的激波以 $\\frac{1}{2}(4 + 0) = 2$ 的速度移动。\n\n检验：写成守恒形式，通量是 $\\frac{u^{2}}{2}$，通量的跳跃除以 $u$ 的跳跃是 $\\frac{8 - 0}{4 - 0} = 2$。\n\n> **注意。** $u_L < u_R$ 的跳跃不是激波：特征线彼此分开，跳跃展开成扇形。",
      ],
      (rng) =>
        until(() => {
          const uR = rng.int(0, 6);
          const uL = uR + rng.int(1, 8);
          const answer = Q.of(uL + uR, 2);
          const misses: Miss[] = [
            [Q.of(uL - uR), "That is the size of the jump, not its speed.", "那是跳跃的大小，不是它的速度。"],
            [
              Q.of(uL + uR),
              "That adds the two sides without halving; the speed is their average.",
              "那把两侧相加却没有减半；速度是它们的平均值。",
            ],
            [
              Q.of(uL),
              "That is the speed of the characteristics on the left, which run into the shock.",
              "那是左侧特征线的速度，它们会撞进激波。",
            ],
            [Q.of(uL - uR, 2), "That averages with a minus sign; the two values are added.", "那用减号求平均了；两个值应当相加。"],
          ];
          return worked(
            [
              `A shock in $u_t + u u_x = 0$ has $u = ${uL}$ on its left and $u = ${uR}$ on its right. How fast does it move?`,
              `$u_t + u u_x = 0$ 的一个激波，左侧 $u = ${uL}$，右侧 $u = ${uR}$。它移动得多快？`,
            ],
            answer,
            misses,
            [
              [
                ["Apply the jump condition", "应用跳跃条件"],
                ["A shock in this equation moves at the average of the values on its two sides.", "这个方程的激波以两侧值的平均值移动。"],
              ],
              [
                ["Average", "求平均"],
                [`$\\frac{1}{2} (${uL} + ${uR}) = ${answer.toLatex()}$.`, `$\\frac{1}{2} (${uL} + ${uR}) = ${answer.toLatex()}$。`],
              ],
            ],
            [
              `The flux $\\frac{u^2}{2}$ jumps by $${Q.of(uL * uL - uR * uR, 2).toLatex()}$ while $u$ jumps by $${uL - uR}$, and $${Q.of(uL * uL - uR * uR, 2).toLatex()} \\div ${uL - uR} = ${answer.toLatex()}$.`,
              `通量 $\\frac{u^2}{2}$ 跳跃了 $${Q.of(uL * uL - uR * uR, 2).toLatex()}$，而 $u$ 跳跃了 $${uL - uR}$，$${Q.of(uL * uL - uR * uR, 2).toLatex()} \\div ${uL - uR} = ${answer.toLatex()}$。`,
            ],
          );
        }),
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
        "D'Alembert's formula shows that the wave $u(x, t)$ uses initial data only on the interval from $x - ct$ to $x + ct$. This is the domain of dependence of the point. Changing the initial data outside it cannot affect the value, because no signal travels faster than $c$. For example, for $u_{tt} = 9u_{xx}$ the speed is $c = 3$, so the point $x = 2$, $t = 1$ depends on the data on $[2 - 3, 2 + 3] = [-1, 5]$.\n\nCheck: the interval is centred on the point, since $\\frac{-1 + 5}{2} = 2$, and its half-width $3$ is the distance a signal covers in time $1$.\n\n> **Watch out.** The speed is the square root of the coefficient of $u_{xx}$: here $3$, not $9$.",
        "达朗贝尔公式表明，波 $u(x, t)$ 只用到从 $x - ct$ 到 $x + ct$ 区间上的初始数据。这个区间称为该点的依赖域。改变依赖域外的初始数据不影响这个值，因为信号的速度不超过 $c$。例如，对 $u_{tt} = 9u_{xx}$，速度 $c = 3$，所以点 $x = 2$，$t = 1$ 依赖于 $[2 - 3, 2 + 3] = [-1, 5]$ 上的数据。\n\n检验：区间以这个点为中心，因为 $\\frac{-1 + 5}{2} = 2$，而它的半宽 $3$ 正是信号在时间 $1$ 内走过的距离。\n\n> **注意。** 速度是 $u_{xx}$ 系数的平方根：这里是 $3$，不是 $9$。",
      ],
      (rng) =>
        until(() => {
          const [c, time] = [rng.int(2, 6), rng.int(2, 5)];
          const x = rng.int(-5, 9);
          const right = rng.bool();
          const sign = right ? 1 : -1;
          const answer = x + sign * c * time;
          const other = x - sign * c * time;
          const misses: Miss[] = [
            [other, `That is the ${right ? "left" : "right"} end of the interval.`, `那是区间的${right ? "左" : "右"}端点。`],
            [
              x + sign * c * c * time,
              `That uses $${c * c}$ as the speed; the speed is its square root, $${c}$.`,
              `那把 $${c * c}$ 当作速度；速度是它的平方根 $${c}$。`,
            ],
            [x + sign * time, "That leaves out the speed $c$.", "那漏掉了速度 $c$。"],
            [x + sign * c, "That leaves out the time $t$.", "那漏掉了时间 $t$。"],
          ];
          return worked(
            [
              `For $u_{tt} = ${c * c} u_{xx}$, what is the ${right ? "right" : "left"} end of the domain of dependence of the point $x = ${x}$, $t = ${time}$?`,
              `对 $u_{tt} = ${c * c} u_{xx}$，点 $x = ${x}$，$t = ${time}$ 的依赖域的${right ? "右" : "左"}端点是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Find the speed", "求波速"],
                [
                  `$c = \\sqrt{${c * c}} = ${c}$, so a signal covers $ct = ${c * time}$ in the time ${time}.`,
                  `$c = \\sqrt{${c * c}} = ${c}$，所以信号在时间 ${time} 内走过 $ct = ${c * time}$。`,
                ],
              ],
              [
                ["Step from the point", "从这个点出发"],
                [
                  `The end is $x ${right ? "+" : "-"} ct = ${x} ${right ? "+" : "-"} ${c * time} = ${answer}$.`,
                  `端点是 $x ${right ? "+" : "-"} ct = ${x} ${right ? "+" : "-"} ${c * time} = ${answer}$。`,
                ],
              ],
            ],
            [
              `The other end is $${other}$, and the midpoint $\\frac{${Math.min(answer, other)} + ${wrap(Math.max(answer, other))}}{2} = ${x}$ is the point itself, as it must be.`,
              `另一端是 $${other}$，中点 $\\frac{${Math.min(answer, other)} + ${wrap(Math.max(answer, other))}}{2} = ${x}$ 正是这个点本身，理应如此。`,
            ],
          );
        }),
    ),
    point(
      "when-a-disturbance-arrives",
      ["When a disturbance arrives", "扰动何时到达"],
      [
        "Suppose the initial shape is nonzero only on $[a, b]$ and the initial velocity is zero. A point to the right first feels the wave when the front from $b$ arrives, at time $(x - b) / c$. It is still again after the back from $a$ has passed, at time $(x - a) / c$. For example, with the shape on $[0, 2]$ and speed $c = 2$, the point $x = 8$ starts to move at $t = \\frac{8 - 2}{2} = 3$ and comes to rest for good at $t = \\frac{8 - 0}{2} = 4$.\n\nCheck: the point moves for $4 - 3 = 1$, the time the wave takes to pass a pulse of length $2$ at speed $2$.\n\n> **Watch out.** The front comes from the nearer end $b$, and the last motion from the farther end $a$.",
        "设初始形状只在 $[a, b]$ 上非零，初始速度为零。右侧一点在来自 $b$ 的波前到达时首先感受到波，时间是 $(x - b) / c$。来自 $a$ 的波尾经过之后，它重新静止，时间是 $(x - a) / c$。例如，形状在 $[0, 2]$ 上，速度 $c = 2$，点 $x = 8$ 在 $t = \\frac{8 - 2}{2} = 3$ 开始运动，在 $t = \\frac{8 - 0}{2} = 4$ 最终静止。\n\n检验：这个点运动了 $4 - 3 = 1$，正是长为 $2$ 的脉冲以速度 $2$ 经过所需的时间。\n\n> **注意。** 波前来自较近的端点 $b$，最后的运动来自较远的端点 $a$。",
      ],
      (rng) =>
        until(() => {
          const a = rng.int(-3, 2);
          const b = a + rng.int(1, 4);
          const x = b + rng.int(2, 9);
          const c = rng.int(2, 5);
          const first = rng.bool();
          const answer = Q.of(first ? x - b : x - a, c);
          const misses: Miss[] = [
            [
              Q.of(first ? x - a : x - b, c),
              first
                ? "That is when the point comes to rest; the front comes from the nearer end."
                : "That is when the point starts to move; it is still again only after the back has passed.",
              first ? "那是这个点静止的时刻；波前来自较近的一端。" : "那是这个点开始运动的时刻；波尾经过之后它才重新静止。",
            ],
            [Q.of(first ? x - b : x - a), "That is the distance, not yet divided by the speed.", "那是距离，还没有除以速度。"],
            [Q.of(x, c), "That measures from $x = 0$ instead of from an end of the pulse.", "那是从 $x = 0$ 而不是从脉冲的端点量起。"],
            [Q.of(b - a, c), "That is how long the point moves, not when.", "那是这个点运动持续的时间，而不是时刻。"],
          ];
          return worked(
            [
              `A string with wave speed ${c} starts at rest, displaced only on $[${a}, ${b}]$. At what time does the point $x = ${x}$ ${first ? "first start to move" : "come to rest for good"}?`,
              `一根波速为 ${c} 的弦从静止开始，只在 $[${a}, ${b}]$ 上有初始位移。点 $x = ${x}$ 在什么时刻${first ? "开始运动" : "最终静止"}？`,
            ],
            answer,
            misses,
            [
              [
                ["Choose the end", "选择端点"],
                first
                  ? [
                      `The front comes from the nearer end $${b}$, at distance $${x} - ${wrap(b)} = ${x - b}$.`,
                      `波前来自较近的一端 $${b}$，距离是 $${x} - ${wrap(b)} = ${x - b}$。`,
                    ]
                  : [
                      `The back comes from the farther end $${a}$, at distance $${x} - ${wrap(a)} = ${x - a}$.`,
                      `波尾来自较远的一端 $${a}$，距离是 $${x} - ${wrap(a)} = ${x - a}$。`,
                    ],
              ],
              [
                ["Divide by the speed", "除以速度"],
                [
                  `$t = \\frac{${first ? x - b : x - a}}{${c}} = ${answer.toLatex()}$.`,
                  `$t = \\frac{${first ? x - b : x - a}}{${c}} = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `The point moves from $t = ${Q.of(x - b, c).toLatex()}$ to $t = ${Q.of(x - a, c).toLatex()}$, for $${Q.of(b - a, c).toLatex()}$, the time a pulse of length ${b - a} takes to pass at speed ${c}.`,
              `这个点从 $t = ${Q.of(x - b, c).toLatex()}$ 运动到 $t = ${Q.of(x - a, c).toLatex()}$，持续 $${Q.of(b - a, c).toLatex()}$，正是长为 ${b - a} 的脉冲以速度 ${c} 经过所需的时间。`,
            ],
          );
        }),
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
          "A fixed end keeps $u = 0$, which is achieved by an upside-down image of the pulse beyond the end, so a reflected pulse comes back inverted. A free end keeps $u_x = 0$, which is achieved by an upright image, so the pulse comes back the same way up with the same height. In the drawing, a pulse of height $1$ heads for the end at $x = 0$: at the fixed end on the left its dashed image has height $-1$, and at the free end on the right the image has height $1$.\n\nCheck: at the end the pulse and its image meet; upside down they cancel, giving $u = 0$, and upright they are mirror images, giving a flat slope $u_x = 0$.\n\n> **Watch out.** Each fixed-end reflection flips the sign, so after an even number of them the pulse is upright again.",
          "固定端保持 $u = 0$，相当于端点外有一个倒置的镜像脉冲，所以反射脉冲是倒过来的。自由端保持 $u_x = 0$，相当于有一个正立的镜像，所以脉冲反射后方向不变，高度也不变。图中，高为 $1$ 的脉冲向 $x = 0$ 的端点行进：左图固定端的虚线像高为 $-1$，右图自由端的像高为 $1$。\n\n检验：脉冲与它的像在端点相遇；倒置时二者相消，得 $u = 0$；正立时二者互为镜像，斜率为零，即 $u_x = 0$。\n\n> **注意。** 每次固定端反射都改变符号，所以反射偶数次后脉冲又是正立的。",
        ],
        (rng) =>
          until(() => {
            const height = rng.int(1, 9);
            const bounces = rng.int(1, 6);
            const fixed = rng.bool();
            const answer = fixed && bounces % 2 === 1 ? -height : height;
            const lead: Pair = fixed ? ["fixed", "固定"] : ["free", "自由"];
            const misses: Miss[] = [
              [
                -answer,
                fixed
                  ? `That has the parity wrong: ${bounces} flips leave the pulse ${bounces % 2 === 1 ? "upside down" : "upright"}.`
                  : "A free end does not turn the pulse over.",
                fixed ? `奇偶性错了：翻转 ${bounces} 次后脉冲是${bounces % 2 === 1 ? "倒置" : "正立"}的。` : "自由端不会把脉冲翻过来。",
              ],
              [
                0,
                "A reflection keeps the size of the pulse; only a fixed end changes its sign.",
                "反射保持脉冲的大小；只有固定端改变它的符号。",
              ],
              [height * bounces, "A reflection does not add height; the size stays the same.", "反射不会增加高度；大小保持不变。"],
            ];
            return worked(
              [
                `A pulse of height ${height} travels on a string with ${lead[0]} ends. What is its height after ${bounces === 1 ? "1 reflection" : `${bounces} reflections`}?`,
                `高度为 ${height} 的脉冲在两端${lead[1]}的弦上传播。反射 ${bounces} 次后它的高度是多少？`,
              ],
              answer,
              misses,
              [
                [
                  ["One reflection", "一次反射"],
                  fixed
                    ? ["A fixed end turns the pulse upside down without changing its size.", "固定端把脉冲倒过来，大小不变。"]
                    : ["A free end sends the pulse back the same way up, with the same size.", "自由端把脉冲按原方向反射回来，大小不变。"],
                ],
                [
                  ["Count the reflections", "数反射次数"],
                  fixed
                    ? [
                        `${bounces} ${bounces % 2 === 1 ? "is odd" : "is even"}, so the height is $${answer}$.`,
                        `${bounces} 是${bounces % 2 === 1 ? "奇数" : "偶数"}，所以高度是 $${answer}$。`,
                      ]
                    : [`No reflection changes it, so the height is $${answer}$.`, `每次反射都不改变它，所以高度是 $${answer}$。`],
                ],
              ],
              fixed
                ? [
                    `Each fixed end multiplies the height by $-1$, and $${bounces === 1 ? "(-1)" : `(-1)^{${bounces}}`} \\cdot ${height} = ${answer}$.`,
                    `每次固定端反射把高度乘以 $-1$，而 $${bounces === 1 ? "(-1)" : `(-1)^{${bounces}}`} \\cdot ${height} = ${answer}$。`,
                  ]
                : [
                    `Each free end multiplies the height by $1$, so after ${bounces === 1 ? "1 reflection" : `${bounces} reflections`} it is still $${height}$; only the direction of travel has changed.`,
                    `每次自由端反射把高度乘以 $1$，所以反射 ${bounces} 次后仍是 $${height}$；改变的只是传播方向。`,
                  ],
            );
          }),
      ),
      figure: pdeDrawings1["reflection-at-a-boundary#fixed-and-free-ends"],
    },
    point(
      "where-a-pulse-is-later",
      ["Where a pulse is later", "脉冲之后的位置"],
      [
        "To follow a pulse on a string of length $L$, imagine it moving straight on through copies of the string. Add the distance traveled to the starting point, and reduce the total modulo $2L$. A result above $L$ means the pulse is on its way back, at the distance $2L$ minus that result. For example, on a string of length $6$, a pulse at $x = 4$ moving right at speed $1$ is at straight-line position $4 + 5 = 9$ at time $5$; this is past the end, so it is at $12 - 9 = 3$.\n\nCheck: it travels $2$ to reach the end at $6$ and then $3$ back, ending at $6 - 3 = 3$.\n\n> **Watch out.** Reduce modulo $2L$, a full round trip, not modulo $L$.",
        "要跟踪长度为 $L$ 的弦上的脉冲，可以想象它一直向前穿过弦的一个个副本。把走过的路程加到起点上，再对 $2L$ 取余。结果大于 $L$ 表示脉冲正在返回，它的位置是 $2L$ 减去这个结果。例如，在长为 $6$ 的弦上，$x = 4$ 处以速度 $1$ 向右运动的脉冲，在时刻 $5$ 的直线位置是 $4 + 5 = 9$；这已越过端点，所以它在 $12 - 9 = 3$。\n\n检验：它走 $2$ 到达端点 $6$，再返回 $3$，停在 $6 - 3 = 3$。\n\n> **注意。** 要对一个来回 $2L$ 取余，而不是对 $L$ 取余。",
      ],
      (rng) =>
        until(() => {
          const length = rng.int(6, 12);
          const start = rng.int(1, length - 1);
          const c = rng.int(1, 4);
          const time = rng.int(2, 9);
          const straight = start + c * time;
          const total = straight % (2 * length);
          const answer = total <= length ? total : 2 * length - total;
          const misses: Miss[] = [
            [straight, "That ignores the ends; the pulse reflects when it reaches them.", "那忽略了端点；脉冲到达端点时会反射。"],
            [
              total,
              "That is the position on the unfolded line; past the end, the pulse is on its way back.",
              "那是展开后直线上的位置；越过端点后，脉冲正在返回。",
            ],
            [straight % length, "That reduces modulo $L$; a full round trip is $2L$.", "那是对 $L$ 取余；一个来回是 $2L$。"],
            [length - answer, "That measures from the wrong end of the string.", "那是从弦的另一端量起的。"],
          ];
          const passes = total > length;
          const q = Math.floor(straight / (2 * length));
          return worked(
            [
              `A string runs from $x = 0$ to $x = ${length}$. A pulse at $x = ${start}$ moves right at speed ${c}. Where is it at time ${time}?`,
              `弦从 $x = 0$ 到 $x = ${length}$。一个脉冲在 $x = ${start}$ 处以速度 ${c} 向右运动。在时刻 ${time} 它在哪里？`,
            ],
            answer,
            misses,
            [
              [
                ["Unfold the string", "展开弦"],
                [
                  `The straight-line position is $${start} + ${c * time} = ${straight}$, and modulo ${2 * length} this is ${total}.`,
                  `直线位置是 $${start} + ${c * time} = ${straight}$，对 ${2 * length} 取余得 ${total}。`,
                ],
              ],
              [
                ["Fold back", "折回"],
                passes
                  ? [
                      `This is past the end, so the position is $${2 * length} - ${total} = ${answer}$.`,
                      `这已越过端点，所以位置是 $${2 * length} - ${total} = ${answer}$。`,
                    ]
                  : [`This lies on the string, so the position is $x = ${answer}$.`, `这个位置在弦上，所以位置是 $x = ${answer}$。`],
              ],
            ],
            passes
              ? [
                  `The unfolded position is $${straight} = ${2 * length * (q + 1)} - ${answer}$, a multiple of ${2 * length} minus ${answer}; such points are the mirror images of $x = ${answer}$, so the pulse is there, heading left.`,
                  `展开后的位置是 $${straight} = ${2 * length * (q + 1)} - ${answer}$，即 ${2 * length} 的倍数减去 ${answer}；这样的点是 $x = ${answer}$ 的镜像，所以脉冲在那里，正向左运动。`,
                ]
              : [
                  `The unfolded position is $${straight} = ${answer}${q === 0 ? "" : ` + ${2 * length * q}`}$, ${q === 0 ? "short of the end, so no reflection has happened yet" : `that is ${q} full round ${q === 1 ? "trip" : "trips"} past $x = ${answer}$`}, so the pulse is there, heading right.`,
                  `展开后的位置是 $${straight} = ${answer}${q === 0 ? "" : ` + ${2 * length * q}`}$，${q === 0 ? "还没到端点，所以尚未反射" : `即在 $x = ${answer}$ 之后又走了 ${q} 个完整来回`}，所以脉冲在那里，正向右运动。`,
                ],
          );
        }),
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
        "A mode of a fixed string with number $n$ and amplitude $A$ has energy proportional to $n^2 A^2$. Doubling the amplitude gives four times the energy, and so does doubling the mode number, because the string then moves twice as fast and bends twice as sharply. For example, mode $2$ with amplitude $3$ against mode $3$ with amplitude $1$ gives $\\frac{2^{2} \\cdot 3^{2}}{3^{2} \\cdot 1^{2}} = \\frac{36}{9} = 4$.\n\nCheck: $2 \\cdot 3 = 6$ and $3 \\cdot 1 = 3$, and the energies go as the squares of these products: $\\left(\\frac{6}{3}\\right)^{2} = 4$.\n\n> **Watch out.** Both the mode number and the amplitude are squared; the ratio of the products themselves is only $2$.",
        "固定弦上编号为 $n$、振幅为 $A$ 的模态，能量与 $n^2 A^2$ 成正比。振幅加倍使能量变为四倍，模态编号加倍也一样，因为这时弦的运动速度和弯曲程度都加倍。例如，振幅为 $3$ 的第 $2$ 模态与振幅为 $1$ 的第 $3$ 模态相比，得 $\\frac{2^{2} \\cdot 3^{2}}{3^{2} \\cdot 1^{2}} = \\frac{36}{9} = 4$。\n\n检验：$2 \\cdot 3 = 6$，$3 \\cdot 1 = 3$，能量按这两个乘积的平方变化：$\\left(\\frac{6}{3}\\right)^{2} = 4$。\n\n> **注意。** 模态编号和振幅都要平方；乘积本身之比只是 $2$。",
      ],
      (rng) =>
        until(() => {
          const [n, m] = rng.sample([1, 2, 3, 4, 5, 6], 2) as [number, number];
          const [a, b] = [rng.int(1, 5), rng.int(1, 5)];
          const answer = Q.of(n * n * a * a, m * m * b * b);
          const misses: Miss[] = [
            [Q.of(n * a, m * b), "That compares $nA$ without squaring.", "那比较的是 $nA$，没有平方。"],
            [Q.of(a * a, b * b), "That compares only the amplitudes; the mode number counts too.", "那只比较了振幅；模态编号也起作用。"],
            [Q.of(n * n, m * m), "That compares only the mode numbers; the amplitudes count too.", "那只比较了模态编号；振幅也起作用。"],
            [Q.of(m * m * b * b, n * n * a * a), "That is the ratio the other way round.", "那是反过来的比值。"],
          ];
          return worked(
            [
              `Mode ${n} of a string has amplitude ${a} and mode ${m} has amplitude ${b}. What is the energy of mode ${n} divided by the energy of mode ${m}?`,
              `弦的第 ${n} 模态振幅为 ${a}，第 ${m} 模态振幅为 ${b}。第 ${n} 模态的能量除以第 ${m} 模态的能量是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Write each energy", "写出各自的能量"],
                [
                  `Up to a common factor, the energies are $${n}^2 \\cdot ${a}^2 = ${n * n * a * a}$ and $${m}^2 \\cdot ${b}^2 = ${m * m * b * b}$.`,
                  `除去公共因子，能量分别是 $${n}^2 \\cdot ${a}^2 = ${n * n * a * a}$ 和 $${m}^2 \\cdot ${b}^2 = ${m * m * b * b}$。`,
                ],
              ],
              [
                ["Divide", "相除"],
                m * b === 1
                  ? [
                      `The second energy is $1$, so the ratio is $${answer.toLatex()}$.`,
                      `第二个能量是 $1$，所以比值是 $${answer.toLatex()}$。`,
                    ]
                  : [
                      `$\\frac{${n * n * a * a}}{${m * m * b * b}} = ${answer.toLatex()}$.`,
                      `$\\frac{${n * n * a * a}}{${m * m * b * b}} = ${answer.toLatex()}$。`,
                    ],
              ],
            ],
            [
              `The products $nA$ are ${n * a} and ${m * b}, and squaring their ratio gives $\\left(${Q.of(n * a, m * b).toLatex()}\\right)^2 = ${answer.toLatex()}$.`,
              `乘积 $nA$ 分别是 ${n * a} 和 ${m * b}，把它们的比平方得 $\\left(${Q.of(n * a, m * b).toLatex()}\\right)^2 = ${answer.toLatex()}$。`,
            ],
          );
        }),
    ),
    point(
      "energy-stays-constant",
      ["Energy stays constant", "能量保持不变"],
      [
        "The total energy of a string with fixed ends does not change over time, as differentiating it and using the wave equation shows. Energy passes back and forth between motion and bending, and different modes do not exchange energy. So the total can be read directly from the initial amplitudes. For example, in units where mode $n$ with amplitude $A$ has energy $n^{2}A^{2}$, a string released from rest as $2\\sin x + \\sin 3x$ has energy $1 \\cdot 4 + 9 \\cdot 1 = 13$ at every time.\n\nCheck: at $t = 0$ the string is at rest, so all of it is bending energy, and each mode contributes its own share; neither the time nor the other mode changes that share.\n\n> **Watch out.** Add the energies of the modes, not their amplitudes; and the time does not enter at all.",
        "两端固定的弦的总能量不随时间变化，对它求导并使用波动方程就能看出。能量在运动和弯曲之间来回转换，不同模态之间不交换能量。所以总能量可以直接由初始振幅读出。例如，取单位使编号 $n$、振幅 $A$ 的模态能量为 $n^{2}A^{2}$，从静止释放、形状为 $2\\sin x + \\sin 3x$ 的弦，在任何时刻的能量都是 $1 \\cdot 4 + 9 \\cdot 1 = 13$。\n\n检验：$t = 0$ 时弦静止，所以能量全是弯曲能，每个模态贡献自己的一份；时间和另一个模态都不改变这一份。\n\n> **注意。** 要把各模态的能量相加，而不是把振幅相加；时间根本不出现。",
      ],
      (rng) =>
        until(() => {
          const [n, m] = rng.sample([1, 2, 3, 4, 5], 2) as [number, number];
          const [low, high] = n < m ? [n, m] : [m, n];
          const [a, b] = [rng.int(1, 6), rng.int(1, 6)];
          const answer = low * low * a * a + high * high * b * b;
          const time = rng.int(2, 9);
          const misses: Miss[] = [
            [a * a + b * b, "That leaves out the factor $n^2$ of each mode.", "那漏掉了每个模态的因子 $n^2$。"],
            [low * a + high * b, "That adds $nA$ without squaring.", "那把 $nA$ 相加，却没有平方。"],
            [answer * time, "That multiplies by the time; the energy does not change.", "那乘了时间；能量不变。"],
            [
              (low * a + high * b) ** 2,
              "That squares the sum; the modes carry separate energies, which are added.",
              "那把和平方了；各模态的能量是分开的，应当相加。",
            ],
          ];
          const shape = `${times(a, `\\sin ${low === 1 ? "" : low}x`)} + ${times(b, `\\sin ${high}x`)}`;
          return worked(
            [
              `In suitable units, mode $n$ with amplitude $A$ has energy $n^2 A^2$. A string starts at rest as $${shape}$. What is its total energy at time ${time}?`,
              `取适当单位，编号 $n$、振幅 $A$ 的模态能量为 $n^2 A^2$。弦从静止开始，形状为 $${shape}$。在时刻 ${time} 它的总能量是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Use conservation", "利用守恒"],
                [
                  `The energy is the same at time ${time} as at time $0$, and each mode keeps its own.`,
                  `时刻 ${time} 的能量与时刻 $0$ 相同，每个模态各自保持自己的能量。`,
                ],
              ],
              [
                ["Add the modes", "把模态相加"],
                [
                  `$${low}^2 \\cdot ${a}^2 + ${high}^2 \\cdot ${b}^2 = ${low * low * a * a} + ${high * high * b * b} = ${answer}$.`,
                  `$${low}^2 \\cdot ${a}^2 + ${high}^2 \\cdot ${b}^2 = ${low * low * a * a} + ${high * high * b * b} = ${answer}$。`,
                ],
              ],
            ],
            [
              `Each mode's energy is the square of $nA$: $(${low} \\cdot ${a})^2 + (${high} \\cdot ${b})^2 = ${low * a}^2 + ${high * b}^2 = ${answer}$, with no time in it.`,
              `每个模态的能量是 $nA$ 的平方：$(${low} \\cdot ${a})^2 + (${high} \\cdot ${b})^2 = ${low * a}^2 + ${high * b}^2 = ${answer}$，其中没有时间。`,
            ],
          );
        }),
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
        "Heat released at one point of an infinite rod has the profile $\\frac{1}{\\sqrt{4 \\pi D t}} e^{-x^2 / (4 D t)}$. Its peak at $x = 0$ is proportional to $1 / \\sqrt{t}$. So making the time four times as long only halves the peak, and the temperature falls more and more slowly. For example, a peak of $6$ at time $1$ becomes $\\frac{6}{\\sqrt{9}} = 2$ at time $9$.\n\nCheck: peak times $\\sqrt{t}$ stays fixed, and $6 \\cdot \\sqrt{1} = 2 \\cdot \\sqrt{9} = 6$.\n\n> **Watch out.** Divide by the square root of the time factor, not by the factor itself.",
        "在无限长杆上一点释放的热，分布为 $\\frac{1}{\\sqrt{4 \\pi D t}} e^{-x^2 / (4 D t)}$。它在 $x = 0$ 处的峰值与 $1 / \\sqrt{t}$ 成正比。所以时间变为四倍，峰值只减半，温度下降得越来越慢。例如，时刻 $1$ 的峰值 $6$，到时刻 $9$ 变为 $\\frac{6}{\\sqrt{9}} = 2$。\n\n检验：峰值乘 $\\sqrt{t}$ 保持不变，而 $6 \\cdot \\sqrt{1} = 2 \\cdot \\sqrt{9} = 6$。\n\n> **注意。** 要除以时间倍数的平方根，而不是除以倍数本身。",
      ],
      (rng) =>
        until(() => {
          const s = rng.int(2, 6);
          const start = rng.pick([2, 3, 5, 6, 7]);
          const peak = rng.int(2, 12);
          const later = start * s * s;
          if (peak === s) return undefined;
          const answer = Q.of(peak, s);
          const ratio = `\\frac{${peak}}{${s}}`;
          const value = ratio === answer.toLatex() ? ratio : `${ratio} = ${answer.toLatex()}`;
          const misses: Miss[] = [
            [
              Q.of(peak, s * s),
              `That divides by the time factor ${s * s}; the peak goes as $1/\\sqrt{t}$.`,
              `那除以了时间倍数 ${s * s}；峰值按 $1/\\sqrt{t}$ 变化。`,
            ],
            [Q.of(peak * s), "That multiplies; the peak falls as the heat spreads.", "那是乘；热扩散时峰值下降。"],
            [
              Q.of(peak, 2),
              "That halves the peak whatever the time; halving needs four times the time.",
              "那不管时间都减半；减半需要四倍的时间。",
            ],
            [
              Q.of(peak * start, later),
              "That makes the peak go as $1/t$; it goes as $1/\\sqrt{t}$.",
              "那让峰值按 $1/t$ 变化；它按 $1/\\sqrt{t}$ 变化。",
            ],
          ];
          return worked(
            [
              `Heat from a point source has peak temperature ${peak} at time ${start}. What is the peak temperature at time ${later}?`,
              `点热源在时刻 ${start} 的峰值温度是 ${peak}。在时刻 ${later} 的峰值温度是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Find the time factor", "求时间倍数"],
                [
                  `The time grew by a factor of $\\frac{${later}}{${start}} = ${s * s}$.`,
                  `时间变为 $\\frac{${later}}{${start}} = ${s * s}$ 倍。`,
                ],
              ],
              [
                ["Take the square root", "取平方根"],
                [
                  `The peak falls by $\\sqrt{${s * s}} = ${s}$, which gives $${value}$.`,
                  `峰值除以 $\\sqrt{${s * s}} = ${s}$，得 $${value}$。`,
                ],
              ],
            ],
            [
              `The product of peak and $\\sqrt{t}$ stays fixed: $${peak} \\sqrt{${start}}$ and $${answer.toLatex()} \\sqrt{${later}} = ${answer.toLatex()} \\cdot ${s} \\sqrt{${start}} = ${peak}\\sqrt{${start}}$ agree.`,
              `峰值与 $\\sqrt{t}$ 之积保持不变：$${peak} \\sqrt{${start}}$ 与 $${answer.toLatex()} \\sqrt{${later}} = ${answer.toLatex()} \\cdot ${s} \\sqrt{${start}} = ${peak}\\sqrt{${start}}$ 相等。`,
            ],
          );
        }),
    ),
    point(
      "the-width-grows-like-a-square-root",
      ["The width grows like a square root", "宽度按平方根增长"],
      [
        "The heat kernel is a normal curve with standard deviation $\\sqrt{2 D t}$. The spread therefore grows like the square root of the time, not in proportion to it. This is the signature of diffusion: heat crosses a short distance quickly but takes four times as long to cross twice that distance. For example, with $D = 2$ at time $t = 4$ the standard deviation is $\\sqrt{2 \\cdot 2 \\cdot 4} = \\sqrt{16} = 4$.\n\nCheck: squaring back, $4^{2} = 16 = 2Dt$, the variance of the kernel.\n\n> **Watch out.** $2Dt$ is the variance; the standard deviation is its square root.",
        "热核是标准差为 $\\sqrt{2 D t}$ 的正态曲线。因此扩散宽度按时间的平方根增长，而不是与时间成正比。这是扩散的标志：热很快穿过一小段距离，但穿过两倍距离要用四倍时间。例如，$D = 2$，在 $t = 4$ 时标准差是 $\\sqrt{2 \\cdot 2 \\cdot 4} = \\sqrt{16} = 4$。\n\n检验：平方回去，$4^{2} = 16 = 2Dt$，正是热核的方差。\n\n> **注意。** $2Dt$ 是方差；标准差是它的平方根。",
      ],
      (rng) =>
        until(() => {
          const [a, b] = [rng.int(1, 6), rng.int(1, 6)];
          const D = 2 * a * a;
          const time = b * b;
          const answer = 2 * a * b;
          const misses: Miss[] = [
            [2 * D * time, "That is the variance $2Dt$; take its square root.", "那是方差 $2Dt$；要取它的平方根。"],
            [D * time, "That is $Dt$, without the factor $2$ and without the square root.", "那是 $Dt$，既没有因子 $2$，也没有开平方。"],
            [a * b, "That takes the square root of $Dt$ halved; the variance is $2Dt$.", "那取了 $Dt$ 一半的平方根；方差是 $2Dt$。"],
            [2 * D + time, "That adds $2D$ and $t$; they are multiplied.", "那把 $2D$ 与 $t$ 相加了；它们应相乘。"],
          ];
          return worked(
            [
              `What is the standard deviation of the heat kernel with $D = ${D}$ at time $t = ${time}$?`,
              `$D = ${D}$ 的热核在时刻 $t = ${time}$ 的标准差是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Find the variance", "求方差"],
                [`$2Dt = 2 \\cdot ${D} \\cdot ${time} = ${2 * D * time}$.`, `$2Dt = 2 \\cdot ${D} \\cdot ${time} = ${2 * D * time}$。`],
              ],
              [
                ["Take the square root", "取平方根"],
                [`$\\sqrt{${2 * D * time}} = ${answer}$.`, `$\\sqrt{${2 * D * time}} = ${answer}$。`],
              ],
            ],
            [
              `$\\sqrt{2Dt} = \\sqrt{2D} \\cdot \\sqrt{t} = \\sqrt{${2 * D}} \\cdot \\sqrt{${time}} = ${2 * a} \\cdot ${b} = ${answer}$.`,
              `$\\sqrt{2Dt} = \\sqrt{2D} \\cdot \\sqrt{t} = \\sqrt{${2 * D}} \\cdot \\sqrt{${time}} = ${2 * a} \\cdot ${b} = ${answer}$。`,
            ],
          );
        }),
    ),
    point(
      "total-heat-is-conserved",
      ["Total heat is conserved", "总热量守恒"],
      [
        "On an infinite rod, the integral of $u$ over all $x$ does not change with time, since no heat leaves. The profile becomes lower and wider but keeps the same area. So the total at any later time equals the area under the initial temperature profile. For example, a rod at temperature $5$ on $[-1, 3]$ and $0$ elsewhere holds $5 \\cdot 4 = 20$ at time $0$, and still $20$ at every later time.\n\nCheck: differentiating the total and using $u_t = Du_{xx}$ gives $D[u_x]_{-\\infty}^{\\infty} = 0$, since the profile flattens out far away.\n\n> **Watch out.** The total stays the same; it is the peak, not the area, that falls.",
        "在无限长的杆上，$u$ 对所有 $x$ 的积分不随时间变化，因为热量没有流失。分布变得更低更宽，但面积不变。所以此后任何时刻的总量都等于初始温度分布下的面积。例如，杆在 $[-1, 3]$ 上温度为 $5$，其他地方为 $0$，时刻 $0$ 的总量是 $5 \\cdot 4 = 20$，此后每个时刻仍是 $20$。\n\n检验：对总量求导并利用 $u_t = Du_{xx}$，得 $D[u_x]_{-\\infty}^{\\infty} = 0$，因为远处分布是平的。\n\n> **注意。** 总量保持不变；下降的是峰值，而不是面积。",
      ],
      (rng) =>
        until(() => {
          const a = rng.int(-4, 3);
          const b = a + rng.int(1, 6);
          if (b === 1) return undefined;
          const T = rng.int(2, 9);
          const time = rng.int(2, 20);
          const answer = T * (b - a);
          const misses: Miss[] = [
            [T, "That is the initial temperature, not the area under the profile.", "那是初始温度，不是分布下的面积。"],
            [b - a, "That is the length of the hot interval; multiply by the temperature.", "那是热区间的长度；还要乘以温度。"],
            [T * (b + a), "That adds the endpoints; the length is their difference.", "那把端点相加了；长度是它们的差。"],
            [Q.of(answer, time), "That divides by the time; the total does not change.", "那除以了时间；总量不变。"],
          ];
          return worked(
            [
              `An infinite rod starts at temperature ${T} on $[${a}, ${b}]$ and 0 elsewhere. What is $\\int_{-\\infty}^{\\infty} u(x, ${time}) \\, dx$?`,
              `无限长的杆初始时在 $[${a}, ${b}]$ 上温度为 ${T}，其他地方为 0。$\\int_{-\\infty}^{\\infty} u(x, ${time}) \\, dx$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Use conservation", "利用守恒"],
                [`The integral at time ${time} equals its value at time $0$.`, `时刻 ${time} 的积分等于时刻 $0$ 的值。`],
              ],
              [
                ["Find the initial area", "求初始面积"],
                [
                  `The initial profile is a rectangle of height ${T} and width $${b} - ${wrap(a)} = ${b - a}$, with area $${T} \\cdot ${b - a} = ${answer}$.`,
                  `初始分布是高 ${T}、宽 $${b} - ${wrap(a)} = ${b - a}$ 的矩形，面积为 $${T} \\cdot ${b - a} = ${answer}$。`,
                ],
              ],
            ],
            [
              `As an integral, $\\int_{${a}}^{${b}} ${T} \\, dx = ${T}(${b} - ${wrap(a)}) = ${answer}$, and no heat can escape an infinite rod to change it.`,
              `写成积分，$\\int_{${a}}^{${b}} ${T} \\, dx = ${T}(${b} - ${wrap(a)}) = ${answer}$，而无限长的杆没有热量可以散失来改变它。`,
            ],
          );
        }),
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
          "A solution of the heat equation on a rod over a time interval reaches its maximum and minimum on the bottom or the two sides of the space-time rectangle: at the initial time or at an end. So a rod with no sources never gets hotter than its hottest initial or end value. In the drawing, those are the three highlighted sides; the dashed top and the interior need no checking. For example, a rod initially at most $7$, with ends held at $4$ and $9$, stays at most $9$.\n\nCheck: if the maximum were inside or on the top, the temperature there would curve downward, $u_{xx} < 0$, so $u_t < 0$ and it would have been even hotter a moment earlier.\n\n> **Watch out.** Take the most extreme of all three bounds, the initial one and both ends, not just the initial value.",
          "杆上热方程的解在时空矩形的底边或两条侧边上取到最大值和最小值，也就是在初始时刻或端点。所以没有热源的杆，温度不会超过初始值和端点值中的最高者。图中，这就是突出显示的三条边；虚线的顶边和内部无需检查。例如，初始温度最高为 $7$、两端保持 $4$ 和 $9$ 的杆，温度始终不超过 $9$。\n\n检验：如果最大值在内部或顶边上，那里温度向下弯曲，$u_{xx} < 0$，于是 $u_t < 0$，片刻之前那里会更热。\n\n> **注意。** 要在三个界（初始界和两个端点）中取最极端的一个，而不只看初始值。",
        ],
        (rng) =>
          until(() => {
            const hot = rng.bool();
            const [initial, left, right] = rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 3) as [number, number, number];
            const answer = hot ? Math.max(initial, left, right) : Math.min(initial, left, right);
            const word: Pair = hot ? ["at most", "不超过"] : ["at least", "不低于"];
            const initialWord: Pair = hot ? ["at most", "最高"] : ["at least", "最低"];
            const misses: Miss[] = [
              [
                hot ? Math.min(initial, left, right) : Math.max(initial, left, right),
                `That is the ${hot ? "smallest" : "largest"} of the three values; the bound needs the ${hot ? "largest" : "smallest"}.`,
                `那是三个值中${hot ? "最小" : "最大"}的；这个界需要${hot ? "最大" : "最小"}的。`,
              ],
              [initial, "That uses only the initial bound; the ends can be more extreme.", "那只用了初始界；端点可能更极端。"],
              [
                Q.of(left + right, 2),
                "That averages the ends; the principle gives the extreme value, not an average.",
                "那是端点的平均值；极值原理给出的是极值，不是平均。",
              ],
              [initial + left + right, "That adds the values; the bound is one of them.", "那把各值相加了；界是其中之一。"],
            ];
            return worked(
              [
                `A rod has initial temperature ${initialWord[0]} ${initial} everywhere, with left end held at ${left} and right end held at ${right}. What is the sharpest number $B$ the maximum principle gives such that $u$ is always ${word[0]} $B$?`,
                `一根杆的初始温度处处${initialWord[1]}为 ${initial}，左端保持 ${left}，右端保持 ${right}。最大值原理给出的最精确的数 $B$ 是多少，使 $u$ 总是${word[1]} $B$？`,
              ],
              answer,
              misses,
              [
                [
                  ["List the three sides", "列出三条边"],
                  [
                    `The bottom gives ${initial}, the left side ${left} and the right side ${right}.`,
                    `底边给出 ${initial}，左侧边给出 ${left}，右侧边给出 ${right}。`,
                  ],
                ],
                [
                  [hot ? "Take the largest" : "Take the smallest", hot ? "取最大者" : "取最小者"],
                  [`The ${hot ? "largest" : "smallest"} of these is ${answer}.`, `其中${hot ? "最大" : "最小"}的是 ${answer}。`],
                ],
              ],
              [
                `Every one of ${initial}, ${left} and ${right} is ${hot ? "at most" : "at least"} ${answer}, and ${answer} is itself one of these data bounds, so the principle gives nothing sharper.`,
                `所有的 ${initial}、${left}、${right} 都${hot ? "不超过" : "不低于"} ${answer}；而 ${answer} 本身就是这些数据界之一，所以极值原理给不出更精确的界。`,
              ],
            );
          }),
      ),
      figure: pdeDrawings1["the-maximum-principle-for-heat#bounding-a-temperature"],
    },
    point(
      "two-nearby-solutions-stay-close",
      ["Two nearby solutions stay close", "相近的解保持相近"],
      [
        "The difference of two solutions of the heat equation also solves the heat equation, so the maximum principle bounds it too. If two solutions differ by a small amount initially and at the ends, they differ by no more than that small amount at any later time. This is stability under small changes in the data. For example, two solutions that differ by at most $2$ initially and by at most $5$ at the ends differ by at most $5$ at every later time.\n\nCheck: the difference $w$ and its negative $-w$ both solve the heat equation with data at most $5$, so $-5 \\le w \\le 5$.\n\n> **Watch out.** The bound is the larger of the two data bounds, not their sum, and it does not grow with time.",
        "热方程两个解的差也是热方程的解，所以最大值原理同样适用于它。如果两个解在初始时刻和端点处只差一点点，那么它们此后也不会差得更多。这就是解对数据微小变化的稳定性。例如，初始时相差不超过 $2$、端点处相差不超过 $5$ 的两个解，此后每个时刻相差都不超过 $5$。\n\n检验：差 $w$ 和它的相反数 $-w$ 都是热方程的解，数据都不超过 $5$，所以 $-5 \\le w \\le 5$。\n\n> **注意。** 界是两个数据界中较大的一个，而不是它们的和，并且它不随时间增长。",
      ],
      (rng) =>
        until(() => {
          const initial = rng.int(1, 9);
          const ends = rng.int(1, 9);
          const time = rng.int(2, 9);
          const answer = Math.max(initial, ends);
          const misses: Miss[] = [
            [
              initial + ends,
              "That adds the bounds; the difference is bounded by the larger one.",
              "那把两个界相加了；差的界是较大的那个。",
            ],
            [Math.min(initial, ends), "That takes the smaller bound; the larger one can be reached.", "那取了较小的界；较大的界可以达到。"],
            [answer * time, "That lets the bound grow with time; it does not.", "那让界随时间增长；它不会。"],
            [
              initial * ends,
              "That multiplies the bounds; the difference is bounded by the larger one.",
              "那把两个界相乘了；差的界是较大的那个。",
            ],
          ];
          return worked(
            [
              `Two solutions of the heat equation on a rod differ by at most ${initial} at $t = 0$, and by at most ${ends} at the ends for all times. What bound on their difference holds at $t = ${time}$?`,
              `杆上热方程的两个解在 $t = 0$ 时相差不超过 ${initial}，在端点处始终相差不超过 ${ends}。在 $t = ${time}$ 时它们的差有什么界？`,
            ],
            answer,
            misses,
            [
              [
                ["Form the difference", "作差"],
                ["The difference of the two solutions solves the heat equation too.", "两个解的差也满足热方程。"],
              ],
              [
                ["Apply the principle", "应用极值原理"],
                [
                  `It is bounded by the larger data bound, $\\max(${initial}, ${ends}) = ${answer}$, at every time.`,
                  `它在每个时刻都不超过较大的数据界 $\\max(${initial}, ${ends}) = ${answer}$。`,
                ],
              ],
            ],
            [
              `Both $w$ and $-w$ solve the heat equation with data at most ${answer}, so $-${answer} \\le w \\le ${answer}$ at $t = ${time}$ as at any other time.`,
              `$w$ 与 $-w$ 都是热方程的解，数据都不超过 ${answer}，所以在 $t = ${time}$ 时和其他任何时刻一样，$-${answer} \\le w \\le ${answer}$。`,
            ],
          );
        }),
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
        "Substituting $e^{i(kx - \\omega t)}$ into a linear equation replaces each $x$ derivative by $ik$ and each $t$ derivative by $-i \\omega$. The wave equation gives $\\omega^2 = c^2 k^2$. Adding a term as in $u_{tt} = c^2 u_{xx} - m^2 u$ gives $\\omega^2 = c^2 k^2 + m^2$. For example, $u_{tt} = 4u_{xx} - 64u$ with $k = 3$ gives $\\omega^{2} = 4 \\cdot 9 + 64 = 100$, so $\\omega = 10$.\n\nCheck: substituting, $u_{tt} = -100u$ while $4u_{xx} - 64u = -36u - 64u = -100u$.\n\n> **Watch out.** The frequencies add in squares: $\\omega$ is $\\sqrt{36 + 64}$, not $6 + 8$.",
        "把 $e^{i(kx - \\omega t)}$ 代入线性方程，每个对 $x$ 的导数变为 $ik$，每个对 $t$ 的导数变为 $-i \\omega$。波动方程给出 $\\omega^2 = c^2 k^2$。增加一项，如 $u_{tt} = c^2 u_{xx} - m^2 u$，得 $\\omega^2 = c^2 k^2 + m^2$。例如，$u_{tt} = 4u_{xx} - 64u$，$k = 3$，得 $\\omega^{2} = 4 \\cdot 9 + 64 = 100$，所以 $\\omega = 10$。\n\n检验：代入后 $u_{tt} = -100u$，而 $4u_{xx} - 64u = -36u - 64u = -100u$。\n\n> **注意。** 频率按平方相加：$\\omega$ 是 $\\sqrt{36 + 64}$，不是 $6 + 8$。",
      ],
      (rng) =>
        until(() => {
          const [a, m, w] = rng.pick(PYTHAGOREAN);
          const c = rng.pick([1, a].filter((v, i, all) => all.indexOf(v) === i));
          const k = a / c;
          const scale = rng.int(1, 4);
          const [C, M, W] = [c * scale, m * scale, w * scale];
          const coefficient = C * C === 1 ? "" : `${C * C}`;
          const misses: Miss[] = [
            [C * k, `That drops the term $-${M * M}u$.`, `那漏掉了 $-${M * M}u$ 项。`],
            [C * k + M, "That adds the frequencies instead of their squares.", "那把频率相加，而不是把它们的平方相加。"],
            [M, "That keeps only the extra term and drops $c^2k^2$.", "那只保留了附加项，漏掉了 $c^2k^2$。"],
            [W * W, "That is $\\omega^2$; take its square root.", "那是 $\\omega^2$；要取它的平方根。"],
          ];
          return worked(
            [
              `For $u_{tt} = ${coefficient} u_{xx} - ${M * M} u$, what is the positive frequency $\\omega$ of a plane wave with wave number $k = ${k}$?`,
              `对 $u_{tt} = ${coefficient} u_{xx} - ${M * M} u$，波数 $k = ${k}$ 的平面波的正频率 $\\omega$ 是多少？`,
            ],
            W,
            misses,
            [
              [
                ["Substitute the plane wave", "代入平面波"],
                [
                  `$-\\omega^2 = -${C * C} \\cdot ${k * k} - ${M * M}$, so $\\omega^2 = ${(C * k) ** 2} + ${M * M} = ${W * W}$.`,
                  `$-\\omega^2 = -${C * C} \\cdot ${k * k} - ${M * M}$，所以 $\\omega^2 = ${(C * k) ** 2} + ${M * M} = ${W * W}$。`,
                ],
              ],
              [
                ["Take the root", "开平方"],
                [`$\\omega = \\sqrt{${W * W}} = ${W}$.`, `$\\omega = \\sqrt{${W * W}} = ${W}$。`],
              ],
            ],
            [
              `$${C * k}$, $${M}$ and $${W}$ form a right triangle, since $${C * k}^2 + ${M}^2 = ${W}^2$: the two terms add like perpendicular sides.`,
              `$${C * k}$、$${M}$、$${W}$ 构成直角三角形，因为 $${C * k}^2 + ${M}^2 = ${W}^2$：两项像两条直角边那样相加。`,
            ],
          );
        }),
    ),
    point(
      "phase-speed-and-group-speed",
      ["Phase speed and group speed", "相速度和群速度"],
      [
        "From a relation $\\omega(k)$, the crests of a wave move at the phase speed $\\omega / k$, and a packet of nearby waves moves at the group speed $d\\omega / dk$. They agree for the plain wave equation. When they differ, as for $\\omega = \\alpha k^2$, different wave numbers separate and the packet spreads out. For example, $\\omega = 3k^{2}$ at $k = 2$ has phase speed $\\frac{12}{2} = 6$ and group speed $6k = 12$.\n\nCheck: for $\\omega = \\alpha k^{2}$ the group speed is always twice the phase speed, and $12 = 2 \\cdot 6$.\n\n> **Watch out.** The phase speed divides $\\omega$ by $k$; the group speed differentiates it.",
        "由关系 $\\omega(k)$，波峰以相速度 $\\omega / k$ 移动，相近波组成的波包以群速度 $d\\omega / dk$ 移动。对普通波动方程，二者相同。当二者不同时（如 $\\omega = \\alpha k^2$），不同波数的波分开，波包就散开了。例如，$\\omega = 3k^{2}$ 在 $k = 2$ 处的相速度是 $\\frac{12}{2} = 6$，群速度是 $6k = 12$。\n\n检验：对 $\\omega = \\alpha k^{2}$，群速度总是相速度的两倍，而 $12 = 2 \\cdot 6$。\n\n> **注意。** 相速度是 $\\omega$ 除以 $k$；群速度是对它求导。",
      ],
      (rng) =>
        until(() => {
          const [alpha, k] = [rng.int(1, 5), rng.int(2, 9)];
          const phase = rng.bool();
          const answer = phase ? alpha * k : 2 * alpha * k;
          const misses: Miss[] = [
            [
              phase ? 2 * alpha * k : alpha * k,
              phase
                ? "That is the group speed $d\\omega/dk$; the phase speed is $\\omega/k$."
                : "That is the phase speed $\\omega/k$; the group speed is $d\\omega/dk$.",
              phase ? "那是群速度 $d\\omega/dk$；相速度是 $\\omega/k$。" : "那是相速度 $\\omega/k$；群速度是 $d\\omega/dk$。",
            ],
            [alpha * k * k, "That is the frequency $\\omega$ itself, not a speed.", "那是频率 $\\omega$ 本身，不是速度。"],
            [alpha, "That drops the factor $k$.", "那漏掉了因子 $k$。"],
          ];
          return worked(
            [
              `A wave has dispersion relation $\\omega = ${times(alpha, "k^2")}$. What is its ${phase ? "phase" : "group"} speed at $k = ${k}$?`,
              `一个波的色散关系是 $\\omega = ${times(alpha, "k^2")}$。在 $k = ${k}$ 处它的${phase ? "相" : "群"}速度是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Choose the formula", "选择公式"],
                phase
                  ? [
                      `The phase speed is $\\frac{\\omega}{k} = ${times(alpha, "k")}$.`,
                      `相速度是 $\\frac{\\omega}{k} = ${times(alpha, "k")}$。`,
                    ]
                  : [
                      `The group speed is $\\frac{d\\omega}{dk} = ${times(2 * alpha, "k")}$.`,
                      `群速度是 $\\frac{d\\omega}{dk} = ${times(2 * alpha, "k")}$。`,
                    ],
              ],
              [
                ["Evaluate", "求值"],
                [`At $k = ${k}$ this is $${answer}$.`, `在 $k = ${k}$ 处它等于 $${answer}$。`],
              ],
            ],
            phase
              ? [
                  `$\\omega = ${alpha} \\cdot ${k * k} = ${alpha * k * k}$ at $k = ${k}$, and $\\frac{${alpha * k * k}}{${k}} = ${answer}$, half the group speed $${2 * alpha * k}$.`,
                  `$k = ${k}$ 时 $\\omega = ${alpha} \\cdot ${k * k} = ${alpha * k * k}$，而 $\\frac{${alpha * k * k}}{${k}} = ${answer}$，是群速度 $${2 * alpha * k}$ 的一半。`,
                ]
              : [
                  `The phase speed is $\\frac{${alpha * k * k}}{${k}} = ${alpha * k}$, and for $\\omega = \\alpha k^2$ the group speed is twice that, $${answer}$.`,
                  `相速度是 $\\frac{${alpha * k * k}}{${k}} = ${alpha * k}$，而对 $\\omega = \\alpha k^2$，群速度是它的两倍，即 $${answer}$。`,
                ],
          );
        }),
    ),
    point(
      "the-rate-of-a-heat-mode",
      ["The rate of a heat mode", "热模态的变化率"],
      [
        "Putting $e^{ikx + rt}$ into $u_t = D u_{xx}$ gives $r = -D k^2$. High wave numbers fade fastest, which is why heat flow smooths a profile. Reversing time, in $u_t = -D u_{xx}$, gives $r = +D k^2$: fine detail grows without limit, and this is why running the heat equation backward fails. For example, $u_t = 2u_{xx}$ with $e^{3ix + rt}$ gives $r = 2 \\cdot (3i)^{2} = -18$.\n\nCheck: $u_t = -18u$, and $2u_{xx} = 2 \\cdot (-9)u = -18u$.\n\n> **Watch out.** $(ik)^{2} = -k^{2}$: the factor $i^{2} = -1$ is what makes the forward rate negative.",
        "把 $e^{ikx + rt}$ 代入 $u_t = D u_{xx}$，得 $r = -D k^2$。高波数衰减最快，这就是热流使分布变平滑的原因。把时间反过来，在 $u_t = -D u_{xx}$ 中，$r = +D k^2$：细节无限增长，这就是热方程不能倒着求解的原因。例如，$u_t = 2u_{xx}$，取 $e^{3ix + rt}$，得 $r = 2 \\cdot (3i)^{2} = -18$。\n\n检验：$u_t = -18u$，而 $2u_{xx} = 2 \\cdot (-9)u = -18u$。\n\n> **注意。** $(ik)^{2} = -k^{2}$：正是因子 $i^{2} = -1$ 使正向的变化率为负。",
      ],
      (rng) =>
        until(() => {
          const [D, k] = [rng.int(1, 5), rng.int(2, 6)];
          const backward = rng.bool();
          const answer = (backward ? 1 : -1) * D * k * k;
          const misses: Miss[] = [
            [-answer, "That has the sign wrong: $(ik)^2 = -k^2$.", "那符号错了：$(ik)^2 = -k^2$。"],
            [(backward ? 1 : -1) * D * k, "That forgets to square $k$.", "那忘了把 $k$ 平方。"],
            [D + k * k, "That adds $D$ and $k^2$; they are multiplied.", "那把 $D$ 与 $k^2$ 相加了；它们应相乘。"],
            [(backward ? 1 : -1) * k * k, "That drops the coefficient $D$.", "那漏掉了系数 $D$。"],
          ];
          const coefficient = backward ? -D : D;
          return worked(
            [
              `For $u_t = ${backward ? "-" : ""}${times(D, "u_{xx}")}$, a solution has the form $e^{${k}ix + rt}$. What is $r$?`,
              `对 $u_t = ${backward ? "-" : ""}${times(D, "u_{xx}")}$，解的形式是 $e^{${k}ix + rt}$。$r$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Differentiate in x", "对 x 求导"],
                [`Two $x$ derivatives give the factor $(${k}i)^2 = -${k * k}$.`, `两次对 $x$ 求导得因子 $(${k}i)^2 = -${k * k}$。`],
              ],
              [
                ["Multiply by the coefficient", "乘以系数"],
                [`$r = ${coefficient} \\cdot (-${k * k}) = ${answer}$.`, `$r = ${coefficient} \\cdot (-${k * k}) = ${answer}$。`],
              ],
            ],
            [
              `$u_t = ${answer}u$, and $${backward ? "-" : ""}${times(D, "u_{xx}")} = ${coefficient} \\cdot (-${k * k})u = ${answer}u$, so the two sides agree; the mode ${answer < 0 ? "decays" : "grows"}.`,
              `$u_t = ${answer}u$，而 $${backward ? "-" : ""}${times(D, "u_{xx}")} = ${coefficient} \\cdot (-${k * k})u = ${answer}u$，两边相等；这个模态${answer < 0 ? "衰减" : "增长"}。`,
            ],
          );
        }),
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
          "Poisson's equation is $\\Delta u = f$. For a constant $f$ on a disc of radius $R$ with $u = 0$ on the circle, try the radial function $u = \\frac{f}{4} (x^2 + y^2 - R^2)$. It vanishes on the circle, and its Laplacian is $\\frac{f}{4} \\cdot 4 = f$, so it is the solution. In the drawing, $f = 4$ and $R = 2$, so $u = x^{2} + y^{2} - 4$, which along a diameter is $x^{2} - 4$: zero at the rim $x = \\pm 2$ and $-4$ at the center.\n\nCheck: $u_{xx} + u_{yy} = 2 + 2 = 4 = f$, and $u(0, 0) = \\frac{4}{4}(0 - 4) = -4$.\n\n> **Watch out.** A positive source makes the center value negative: $u$ dips below its boundary value $0$.",
          "泊松方程是 $\\Delta u = f$。对半径为 $R$ 的圆盘，$f$ 为常数，圆周上 $u = 0$，试取径向函数 $u = \\frac{f}{4} (x^2 + y^2 - R^2)$。它在圆周上为零，拉普拉斯算子作用后是 $\\frac{f}{4} \\cdot 4 = f$，所以它就是解。图中 $f = 4$，$R = 2$，所以 $u = x^{2} + y^{2} - 4$，沿直径是 $x^{2} - 4$：在边界 $x = \\pm 2$ 处为零，在中心为 $-4$。\n\n检验：$u_{xx} + u_{yy} = 2 + 2 = 4 = f$，而 $u(0, 0) = \\frac{4}{4}(0 - 4) = -4$。\n\n> **注意。** 正的源项使中心的值为负：$u$ 下降到边界值 $0$ 以下。",
        ],
        (rng) =>
          until(() => {
            const f = rng.int(1, 9);
            const R = rng.int(2, 6);
            const answer = Q.of(-f * R * R, 4);
            const misses: Miss[] = [
              [
                Q.of(f * R * R, 4),
                "That has the sign wrong: a positive source pulls the center below the boundary value.",
                "那符号错了：正的源项使中心低于边界值。",
              ],
              [
                Q.of(-f * R * R, 2),
                "That uses $\\frac{f}{2}$; in two dimensions the Laplacian of $x^2 + y^2$ is $4$.",
                "那用了 $\\frac{f}{2}$；二维中 $x^2 + y^2$ 的拉普拉斯是 $4$。",
              ],
              [Q.of(-f * R, 4), "That uses $R$ instead of $R^2$.", "那用了 $R$ 而不是 $R^2$。"],
              [Q.of(-f), "That takes the source itself as the value at the center.", "那把源项本身当成了圆心处的值。"],
            ];
            return worked(
              [
                `Let $\\Delta u = ${f}$ on the disc $x^2 + y^2 < ${R * R}$, with $u = 0$ on the boundary. What is $u$ at the center?`,
                `设在圆盘 $x^2 + y^2 < ${R * R}$ 上 $\\Delta u = ${f}$，边界上 $u = 0$。圆心处 $u$ 是多少？`,
              ],
              answer,
              misses,
              [
                [
                  ["Write the solution", "写出解"],
                  [
                    `$u = \\frac{${f}}{4} (x^2 + y^2 - ${R * R})$, which vanishes on the circle.`,
                    `$u = \\frac{${f}}{4} (x^2 + y^2 - ${R * R})$，它在圆周上为零。`,
                  ],
                ],
                [
                  ["Evaluate at the center", "求圆心处的值"],
                  [
                    `$\\frac{${f}}{4} \\cdot (-${R * R}) = ${answer.toLatex()}$.`,
                    `$\\frac{${f}}{4} \\cdot (-${R * R}) = ${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `The Laplacian of $\\frac{${f}}{4}(x^2 + y^2)$ is $\\frac{${f}}{4}(2 + 2) = ${f}$, as required, and the value at the center lies below the boundary value $0$.`,
                `$\\frac{${f}}{4}(x^2 + y^2)$ 的拉普拉斯是 $\\frac{${f}}{4}(2 + 2) = ${f}$，符合要求，而圆心处的值低于边界值 $0$。`,
              ],
            );
          }),
      ),
      figure: pdeDrawings1["poissons-equation#a-value-at-the-center-of-a-disc"],
    },
    point(
      "when-an-insulated-problem-has-a-solution",
      ["When an insulated problem has a solution", "绝热问题何时有解"],
      [
        "Integrating $u'' = f$ across an interval gives $u'(L) - u'(0) = \\int_0^L f \\, dx$, so the fluxes given at the ends must match the total source. If they do not, no steady state exists. If they do, solutions exist but differ by a constant, which the data does not fix. For example, $u'' = 2$ on $[0, 3]$ with $u'(0) = 1$ needs $u'(3) = 1 + 2 \\cdot 3 = 7$.\n\nCheck: $u = x^{2} + x$ has $u'' = 2$, $u'(0) = 1$ and $u'(3) = 7$, and so does $u + 5$.\n\n> **Watch out.** The change in $u'$ is the total source $fL$, not $f$ alone.",
        "把 $u'' = f$ 在区间上积分，得 $u'(L) - u'(0) = \\int_0^L f \\, dx$，所以端点给定的通量必须与源项总量相符。如果不符，就没有稳态解。如果相符，解存在，但彼此相差一个常数，数据不能确定它。例如，$[0, 3]$ 上 $u'' = 2$，$u'(0) = 1$，需要 $u'(3) = 1 + 2 \\cdot 3 = 7$。\n\n检验：$u = x^{2} + x$ 满足 $u'' = 2$，$u'(0) = 1$，$u'(3) = 7$，$u + 5$ 也满足。\n\n> **注意。** $u'$ 的变化是源项总量 $fL$，而不只是 $f$。",
      ],
      (rng) =>
        until(() => {
          const [f, L] = [rng.int(1, 6), rng.int(2, 6)];
          const p = rng.int(-4, 4);
          const answer = p + f * L;
          const misses: Miss[] = [
            [p - f * L, "That subtracts the source; $u'$ grows by the total source.", "那减去了源项；$u'$ 增加的是源项总量。"],
            [f * L, "That forgets the starting slope $u'(0)$.", "那忘了起始斜率 $u'(0)$。"],
            [p + f, "That adds $f$ alone; the total source over the interval is $fL$.", "那只加了 $f$；区间上的源项总量是 $fL$。"],
            [p, "That keeps the slope unchanged, as if there were no source.", "那让斜率保持不变，好像没有源项。"],
          ];
          return worked(
            [
              `Let $u'' = ${f}$ on $[0, ${L}]$ with $u'(0) = ${p}$. What value of $u'(${L})$ makes a solution possible?`,
              `设在 $[0, ${L}]$ 上 $u'' = ${f}$，$u'(0) = ${p}$。$u'(${L})$ 取什么值时才可能有解？`,
            ],
            answer,
            misses,
            [
              [
                ["Integrate the equation", "对方程积分"],
                [
                  `$u'(${L}) - u'(0) = \\int_0^{${L}} ${f} \\, dx = ${f * L}$.`,
                  `$u'(${L}) - u'(0) = \\int_0^{${L}} ${f} \\, dx = ${f * L}$。`,
                ],
              ],
              [
                ["Solve", "求解"],
                [`$u'(${L}) = ${p} + ${f * L} = ${answer}$.`, `$u'(${L}) = ${p} + ${f * L} = ${answer}$。`],
              ],
            ],
            [
              `$u' = ${f === 1 ? "" : f}x ${p === 0 ? "" : p < 0 ? `- ${-p}` : `+ ${p}`}$ has $u'' = ${f}$ and $u'(0) = ${p}$, and at $x = ${L}$ it gives $${f * L} ${p === 0 ? "" : p < 0 ? `- ${-p}` : `+ ${p}`} = ${answer}$.`,
              `$u' = ${f === 1 ? "" : f}x ${p === 0 ? "" : p < 0 ? `- ${-p}` : `+ ${p}`}$ 满足 $u'' = ${f}$，$u'(0) = ${p}$，在 $x = ${L}$ 处给出 $${f * L} ${p === 0 ? "" : p < 0 ? `- ${-p}` : `+ ${p}`} = ${answer}$。`,
            ],
          );
        }),
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
        "A square membrane of side $L$, fixed at its edge, has modes $\\sin \\frac{m \\pi x}{L} \\sin \\frac{n \\pi y}{L}$ with angular frequency $\\omega = \\frac{c \\pi}{L} \\sqrt{m^2 + n^2}$. Unlike a string, these frequencies are not whole multiples of the lowest one, which is why a drum has no clear pitch. For example, a drum of side $2$ with $c = 1$ has, for the mode $(3, 4)$, $\\omega = \\frac{\\pi}{2}\\sqrt{9 + 16} = \\frac{5\\pi}{2}$.\n\nCheck: $\\omega^{2} = \\frac{\\pi^{2}}{4} \\cdot 25 = \\frac{25\\pi^{2}}{4}$, which is $\\left(\\frac{5\\pi}{2}\\right)^{2}$.\n\n> **Watch out.** The mode numbers combine as $\\sqrt{m^{2} + n^{2}}$, not as $m + n$.",
        "边长为 $L$、边缘固定的方形膜，模态是 $\\sin \\frac{m \\pi x}{L} \\sin \\frac{n \\pi y}{L}$，角频率是 $\\omega = \\frac{c \\pi}{L} \\sqrt{m^2 + n^2}$。与弦不同，这些频率不是最低频率的整数倍，所以鼓没有清晰的音高。例如，边长为 $2$、$c = 1$ 的鼓，模态 $(3, 4)$ 的 $\\omega = \\frac{\\pi}{2}\\sqrt{9 + 16} = \\frac{5\\pi}{2}$。\n\n检验：$\\omega^{2} = \\frac{\\pi^{2}}{4} \\cdot 25 = \\frac{25\\pi^{2}}{4}$，正是 $\\left(\\frac{5\\pi}{2}\\right)^{2}$。\n\n> **注意。** 模态编号按 $\\sqrt{m^{2} + n^{2}}$ 组合，而不是 $m + n$。",
      ],
      (rng) =>
        until(() => {
          const [m, n, root] = rng.pick(PYTHAGOREAN);
          const c = rng.int(1, 6);
          const L = rng.int(2, 5);
          const answer = Q.of(c * root, L);
          const misses: Miss[] = [
            [
              Q.of(c * (m + n), L),
              "That adds the mode numbers; they combine as $\\sqrt{m^2 + n^2}$.",
              "那把模态编号相加了；它们按 $\\sqrt{m^2 + n^2}$ 组合。",
            ],
            [Q.of(root, L), `That drops the wave speed $${c}$.`, `那漏掉了波速 $${c}$。`],
            [
              Q.of(c * root, L * L),
              "That divides by $L^2$; the frequency has $L$ to the first power.",
              "那除以了 $L^2$；频率中 $L$ 是一次方。",
            ],
            [Q.of(c * root), "That drops the side length $L$.", "那漏掉了边长 $L$。"],
          ];
          return worked(
            [
              `A square membrane of side ${L} has wave speed ${c}. Its mode $(m, n) = (${m}, ${n})$ has frequency $\\omega = k \\pi$. What is $k$?`,
              `边长为 ${L} 的方形膜波速为 ${c}。它的模态 $(m, n) = (${m}, ${n})$ 的频率是 $\\omega = k \\pi$。$k$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Combine the mode numbers", "组合模态编号"],
                [
                  `$\\sqrt{${m}^2 + ${n}^2} = \\sqrt{${m * m + n * n}} = ${root}$.`,
                  `$\\sqrt{${m}^2 + ${n}^2} = \\sqrt{${m * m + n * n}} = ${root}$。`,
                ],
              ],
              [
                ["Multiply", "相乘"],
                [
                  `$\\omega = \\frac{${times(c, "\\pi")}}{${L}} \\cdot ${root}$, so $k = ${answer.toLatex()}$.`,
                  `$\\omega = \\frac{${times(c, "\\pi")}}{${L}} \\cdot ${root}$，所以 $k = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `Squaring, $k^2 = \\frac{${c * c} \\cdot ${m * m + n * n}}{${L * L}} = ${answer.mul(answer).toLatex()}$, which is $\\left(${answer.toLatex()}\\right)^2$.`,
              `平方后 $k^2 = \\frac{${c * c} \\cdot ${m * m + n * n}}{${L * L}} = ${answer.mul(answer).toLatex()}$，正是 $\\left(${answer.toLatex()}\\right)^2$。`,
            ],
          );
        }),
    ),
    point(
      "modes-that-share-a-frequency",
      ["Modes that share a frequency", "频率相同的模态"],
      [
        "On a square drum, the modes $(m, n)$ with the same value of $m^2 + n^2$ share a frequency. The pairs $(m, n)$ and $(n, m)$ are always such partners when $m \\ne n$, and some numbers such as 50 have more than one way to be written as a sum of two squares. For example, $50 = 1 + 49 = 25 + 25 = 49 + 1$ gives the three modes $(1, 7)$, $(5, 5)$ and $(7, 1)$.\n\nCheck: swapping $m$ and $n$ maps the list to itself: $(1, 7)$ and $(7, 1)$ form a couple, and $(5, 5)$ is its own partner, so $2 + 1 = 3$.\n\n> **Watch out.** Order counts, so $(1, 7)$ and $(7, 1)$ are two modes; but $(5, 5)$ is only one, and $m$ and $n$ must be positive.",
        "方形鼓上，$m^2 + n^2$ 相同的模态 $(m, n)$ 频率相同。当 $m \\ne n$ 时，$(m, n)$ 和 $(n, m)$ 总是这样的一对，而有些数（如 50）不止一种方法写成两个平方数之和。例如，$50 = 1 + 49 = 25 + 25 = 49 + 1$ 给出三个模态 $(1, 7)$、$(5, 5)$ 和 $(7, 1)$。\n\n检验：交换 $m$ 与 $n$ 把这个列表映到自身：$(1, 7)$ 与 $(7, 1)$ 成对，$(5, 5)$ 与自身配对，所以共 $2 + 1 = 3$ 个。\n\n> **注意。** 顺序要区分，所以 $(1, 7)$ 和 $(7, 1)$ 是两个模态；但 $(5, 5)$ 只有一个，而且 $m$、$n$ 必须是正数。",
      ],
      (rng) =>
        until(() => {
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
          const diagonal = found.filter(([m, n]) => m === n).length;
          const root = Math.round(Math.sqrt(value));
          const square = root * root === value;
          const misses: Miss[] = [
            [
              Math.ceil(count / 2),
              "That counts $(m, n)$ and $(n, m)$ once; here order counts.",
              "那把 $(m, n)$ 与 $(n, m)$ 只算了一次；这里要区分顺序。",
            ],
            [2 * count, "That counts each ordered pair twice.", "那把每个有序对都算了两次。"],
            [
              square ? count + 2 : -1,
              `That allows a zero, as in $(0, ${root})$; a mode number of zero gives no vibration.`,
              `那允许了零，如 $(0, ${root})$；模态编号为零就没有振动。`,
            ],
            [
              count - 1,
              "That leaves out a pair; check every $m$ with $m^2$ below the value.",
              "那漏掉了一对；要检查每个使 $m^2$ 小于该值的 $m$。",
            ],
          ];
          return worked(
            [
              `On a square drum, how many modes $(m, n)$, with $m$ and $n$ positive whole numbers and order counted, have $m^2 + n^2 = ${value}$?`,
              `方形鼓上，有多少个模态 $(m, n)$ 满足 $m^2 + n^2 = ${value}$？这里 $m$、$n$ 是正整数，并区分顺序。`,
            ],
            count,
            misses.filter(([v]) => v !== -1),
            [
              [
                ["Try each m", "逐个试 m"],
                [
                  `Try $m = 1, 2, \\ldots$ while $m^2 < ${value}$, and keep each $m$ for which $${value} - m^2$ is a square.`,
                  `依次试 $m = 1, 2, \\ldots$（$m^2 < ${value}$），保留使 $${value} - m^2$ 为平方数的 $m$。`,
                ],
              ],
              [
                ["Count", "计数"],
                [`That gives $${list}$, which makes ${count}.`, `得到 $${list}$，共 ${count} 个。`],
              ],
            ],
            [
              `Swapping $m$ and $n$ maps the list to itself: ${count - diagonal === 0 ? "no pair has" : `${(count - diagonal) / 2} ${(count - diagonal) / 2 === 1 ? "couple has" : "couples have"}`} $m \\ne n$ and ${diagonal} ${diagonal === 1 ? "pair has" : "pairs have"} $m = n$, so $${count - diagonal} + ${diagonal} = ${count}$.`,
              `交换 $m$ 与 $n$ 把这个列表映到自身：$m \\ne n$ 的有 ${(count - diagonal) / 2} 对，$m = n$ 的有 ${diagonal} 个，所以共 $${count - diagonal} + ${diagonal} = ${count}$ 个。`,
            ],
          );
        }),
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
        "A Dirichlet condition gives the value of $u$ at the boundary, and a Neumann condition gives its derivative. A Robin condition gives a combination of both, such as $u_x + h u = g$. Physically, Newton's law of cooling is a Robin condition: heat leaves an end at a rate proportional to its excess temperature. For example, $u_x(0, t) + 2u(0, t) = 5$ involves both $u$ and $u_x$ at the end, so it is a Robin condition.\n\nCheck: setting the coefficient $2$ to zero would leave $u_x(0, t) = 5$, a Neumann condition, so the $u$ term is what makes it Robin.\n\n> **Watch out.** A condition on $u_x$ alone is Neumann even when its right side is not zero.",
        "狄利克雷条件给出边界上 $u$ 的值，诺伊曼条件给出它的导数。罗宾条件给出二者的组合，如 $u_x + h u = g$。从物理上说，牛顿冷却定律就是罗宾条件：端点散热的速率与它高出环境的温度成正比。例如，$u_x(0, t) + 2u(0, t) = 5$ 在端点同时含有 $u$ 和 $u_x$，所以是罗宾条件。\n\n检验：如果把系数 $2$ 改为零，就只剩 $u_x(0, t) = 5$，是诺伊曼条件，所以正是 $u$ 项使它成为罗宾条件。\n\n> **注意。** 只关于 $u_x$ 的条件是诺伊曼条件，即使右边不是零。",
      ],
      (rng) => {
        const kind = rng.int(0, 2);
        const [a, h] = [rng.int(1, 12), rng.int(2, 9)];
        const body = kind === 0 ? `u(0, t) = ${a}` : kind === 1 ? `u_x(0, t) = ${a}` : `u_x(0, t) + ${h} u(0, t) = ${a}`;
        const names: Slip[] = [
          [["Dirichlet", "狄利克雷条件"], "A Dirichlet condition gives the value of $u$ alone.", "狄利克雷条件只给出 $u$ 的值。"],
          [["Neumann", "诺伊曼条件"], "A Neumann condition gives the derivative $u_x$ alone.", "诺伊曼条件只给出导数 $u_x$。"],
          [["Robin", "罗宾条件"], "A Robin condition combines $u$ and $u_x$ in one equation.", "罗宾条件在一个等式中组合 $u$ 和 $u_x$。"],
        ];
        const correct = (names[kind] as Slip)[0];
        const periodic: Slip = [
          ["Periodic", "周期条件"],
          "A periodic condition links the two ends, such as $u(0, t) = u(L, t)$; this one involves only one end.",
          "周期条件联系两个端点，如 $u(0, t) = u(L, t)$；这里只涉及一个端点。",
        ];
        const reason: Pair =
          kind === 0
            ? ["It gives the value of $u$ itself, so it is a Dirichlet condition.", "它给出 $u$ 本身的值，所以是狄利克雷条件。"]
            : kind === 1
              ? ["It gives only the derivative of $u$, so it is a Neumann condition.", "它只给出 $u$ 的导数，所以是诺伊曼条件。"]
              : [
                  "It combines the value and the derivative of $u$, so it is a Robin condition.",
                  "它把 $u$ 的值和导数组合在一起，所以是罗宾条件。",
                ];
        return chosen(
          rng,
          [`What kind of boundary condition is $${body}$?`, `$${body}$ 是哪种边界条件？`],
          correct,
          [...names.filter((_, i) => i !== kind), periodic],
          [
            [
              ["See what appears", "看出现了什么"],
              kind === 0
                ? ["Only $u(0, t)$ appears, with no derivative.", "只出现 $u(0, t)$，没有导数。"]
                : kind === 1
                  ? ["Only $u_x(0, t)$ appears, with no value of $u$.", "只出现 $u_x(0, t)$，没有 $u$ 的值。"]
                  : ["Both $u_x(0, t)$ and $u(0, t)$ appear.", "$u_x(0, t)$ 和 $u(0, t)$ 都出现了。"],
            ],
            [["Name it", "命名"], reason],
          ],
          kind === 2
            ? [
                `Dropping the term $${h} u(0, t)$ would leave a Neumann condition, and dropping $u_x(0, t)$ a Dirichlet one; it has both, so it is Robin.`,
                `去掉 $${h} u(0, t)$ 项会剩下诺伊曼条件，去掉 $u_x(0, t)$ 会剩下狄利克雷条件；它两者都有，所以是罗宾条件。`,
              ]
            : [
                `A Robin condition would need both $u$ and $u_x$; this one has only ${kind === 0 ? "$u$" : "$u_x$"}, and it involves a single end, so it is not periodic either.`,
                `罗宾条件需要同时有 $u$ 和 $u_x$；这里只有 ${kind === 0 ? "$u$" : "$u_x$"}，而且只涉及一个端点，所以也不是周期条件。`,
              ],
        );
      },
    ),
    point(
      "the-end-of-a-cooling-rod",
      ["The end of a cooling rod", "散热杆的端点"],
      [
        "A steady state in a rod is a straight line, $u = T + s x$. If one end is held at $T$ and the other at $x = L$ cools by $u_x = -h (u - E)$ into surroundings at $E$, substitute the line to find the slope: $s (1 + h L) = -h (T - E)$. The end lies between $T$ and $E$. For example, with $T = 4$, $E = 0$, $h = 1$ and $L = 1$, the slope is $s = \\frac{-4}{2} = -2$, so $u(1) = 4 - 2 = 2$.\n\nCheck: at $x = 1$ the slope $-2$ equals $-1 \\cdot (2 - 0)$, as the cooling law requires.\n\n> **Watch out.** The cooled end does not reach the temperature of the surroundings; it stops between $T$ and $E$.",
        "杆的稳态是一条直线 $u = T + s x$。如果一端保持 $T$，另一端 $x = L$ 按 $u_x = -h (u - E)$ 向温度为 $E$ 的环境散热，代入直线可求斜率：$s (1 + h L) = -h (T - E)$。端点温度在 $T$ 和 $E$ 之间。例如，$T = 4$，$E = 0$，$h = 1$，$L = 1$，斜率 $s = \\frac{-4}{2} = -2$，所以 $u(1) = 4 - 2 = 2$。\n\n检验：在 $x = 1$ 处斜率 $-2$ 等于 $-1 \\cdot (2 - 0)$，符合冷却定律。\n\n> **注意。** 散热端不会达到环境温度；它停在 $T$ 与 $E$ 之间。",
      ],
      (rng) =>
        until(() => {
          const [h, L] = [rng.int(1, 4), rng.int(1, 4)];
          const E = rng.int(0, 6);
          const T = E + (1 + h * L) * rng.int(1, 5);
          const slope = Q.of(-h * (T - E), 1 + h * L);
          const answer = slope.mul(Q.of(L)).add(Q.of(T));
          const hh = h === 1 ? "" : `${h}`;
          const misses: Miss[] = [
            [
              Q.of(E),
              "That takes the end all the way to the surroundings; it only gets part of the way.",
              "那让端点一直降到环境温度；它只降一部分。",
            ],
            [
              Q.of(T),
              "That treats the end as insulated; it loses heat, so the line slopes down.",
              "那把端点当成绝热的；它在散热，所以直线向下倾斜。",
            ],
            [Q.of(T + E, 2), "That averages $T$ and $E$; the split depends on $hL$.", "那对 $T$ 和 $E$ 取平均；分配取决于 $hL$。"],
            [slope, "That is the slope of the line, not the temperature at the end.", "那是直线的斜率，不是端点的温度。"],
          ];
          return worked(
            [
              `A rod on $[0, ${L}]$ is steady, with $u(0) = ${T}$ and $u_x(${L}) = -${hh} (u(${L}) - ${E})$. What is $u(${L})$?`,
              `$[0, ${L}]$ 上的杆处于稳态，$u(0) = ${T}$，$u_x(${L}) = -${hh} (u(${L}) - ${E})$。$u(${L})$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Find the slope", "求斜率"],
                [
                  `Put $u = ${T} + s x$. Then $s = -${hh} (${T} + ${times(L, "s")} - ${E})$, so $${1 + h * L} s = ${-h * (T - E)}$ and $s = ${slope.toLatex()}$.`,
                  `令 $u = ${T} + s x$。则 $s = -${hh} (${T} + ${times(L, "s")} - ${E})$，所以 $${1 + h * L} s = ${-h * (T - E)}$，$s = ${slope.toLatex()}$。`,
                ],
              ],
              [
                ["Evaluate at the end", "求端点的值"],
                [
                  `$u(${L}) = ${T} + ${L} \\cdot (${slope.toLatex()}) = ${answer.toLatex()}$.`,
                  `$u(${L}) = ${T} + ${L} \\cdot (${slope.toLatex()}) = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `At $x = ${L}$ the slope $${slope.toLatex()}$ equals $-${hh}(${answer.toLatex()} - ${E})$, as the cooling law requires, and $${answer.toLatex()}$ lies between $${E}$ and $${T}$.`,
              `在 $x = ${L}$ 处斜率 $${slope.toLatex()}$ 等于 $-${hh}(${answer.toLatex()} - ${E})$，符合冷却定律，而 $${answer.toLatex()}$ 介于 $${E}$ 与 $${T}$ 之间。`,
            ],
          );
        }),
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
        "In $u_{tt} + 2b u_t = c^2 u_{xx}$, each mode has a time factor solving $T'' + 2b T' + \\omega^2 T = 0$, where $\\omega$ is the frequency without damping. When $b < \\omega$, it oscillates at the lower frequency $\\sqrt{\\omega^2 - b^2}$ inside an envelope $e^{-bt}$ that is the same for all modes. For example, $T'' + 6T' + 25T = 0$ has $b = 3$ and $\\omega = 5$, so it oscillates at $\\sqrt{25 - 9} = 4$ inside $e^{-3t}$.\n\nCheck: the characteristic roots are $-3 \\pm 4i$, whose sum is $-6$ and whose product is $9 + 16 = 25$, matching the coefficients.\n\n> **Watch out.** The coefficient of $T'$ is $2b$, so the rate $b$ is half of it.",
        "在 $u_{tt} + 2b u_t = c^2 u_{xx}$ 中，每个模态的时间因子满足 $T'' + 2b T' + \\omega^2 T = 0$，其中 $\\omega$ 是无阻尼时的频率。当 $b < \\omega$ 时，它以较低的频率 $\\sqrt{\\omega^2 - b^2}$ 振荡，包络 $e^{-bt}$ 对所有模态相同。例如，$T'' + 6T' + 25T = 0$ 中 $b = 3$，$\\omega = 5$，所以它在 $e^{-3t}$ 之内以 $\\sqrt{25 - 9} = 4$ 振荡。\n\n检验：特征根是 $-3 \\pm 4i$，和为 $-6$，积为 $9 + 16 = 25$，与系数相符。\n\n> **注意。** $T'$ 的系数是 $2b$，所以衰减率 $b$ 是它的一半。",
      ],
      (rng) =>
        until(() => {
          const [b, nu, w] = rng.pick(PYTHAGOREAN);
          const scale = rng.int(1, 4);
          const [B, N, W] = [b * scale, nu * scale, w * scale];
          const askRate = rng.bool();
          const answer = askRate ? B : N;
          const misses: Miss[] = askRate
            ? [
                [2 * B, `That is the coefficient $2b = ${2 * B}$; the rate is half of it.`, `那是系数 $2b = ${2 * B}$；衰减率是它的一半。`],
                [N, "That is the frequency of the oscillation, not the rate of the envelope.", "那是振荡的频率，不是包络的衰减率。"],
                [W, "That is the undamped frequency $\\omega$.", "那是无阻尼频率 $\\omega$。"],
              ]
            : [
                [W, "That is the undamped frequency; damping lowers it.", "那是无阻尼频率；阻尼使它降低。"],
                [B, "That is the rate of the envelope, not the frequency.", "那是包络的衰减率，不是频率。"],
                [W - B, "That subtracts the frequencies; it is their squares that are subtracted.", "那是频率相减；应当是它们的平方相减。"],
              ];
          return worked(
            [
              `A mode of a damped string satisfies $T'' + ${2 * B} T' + ${W * W} T = 0$. What is ${askRate ? "the rate $r$ in its envelope $e^{-rt}$" : "the frequency of its oscillation"}?`,
              `阻尼弦的一个模态满足 $T'' + ${2 * B} T' + ${W * W} T = 0$。${askRate ? "它的包络 $e^{-rt}$ 中的 $r$" : "它的振荡频率"}是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Read b and omega", "读出 b 和 ω"],
                [
                  `$2b = ${2 * B}$ gives $b = ${B}$, and $\\omega^2 = ${W * W}$ gives $\\omega = ${W}$.`,
                  `$2b = ${2 * B}$ 给出 $b = ${B}$，$\\omega^2 = ${W * W}$ 给出 $\\omega = ${W}$。`,
                ],
              ],
              [
                [askRate ? "Read the envelope" : "Find the frequency", askRate ? "读出包络" : "求频率"],
                askRate
                  ? [`The envelope is $e^{-bt}$, so $r = ${B}$.`, `包络是 $e^{-bt}$，所以 $r = ${B}$。`]
                  : [
                      `$\\sqrt{${W * W} - ${B * B}} = \\sqrt{${N * N}} = ${N}$.`,
                      `$\\sqrt{${W * W} - ${B * B}} = \\sqrt{${N * N}} = ${N}$。`,
                    ],
              ],
            ],
            [
              `The characteristic roots are $-${B} \\pm ${N}i$: their sum $-${2 * B}$ and product $${B * B} + ${N * N} = ${W * W}$ match the coefficients.`,
              `特征根是 $-${B} \\pm ${N}i$：和 $-${2 * B}$ 与积 $${B * B} + ${N * N} = ${W * W}$ 都与系数相符。`,
            ],
          );
        }),
    ),
    point(
      "modes-that-do-not-oscillate",
      ["Modes that do not oscillate", "不振荡的模态"],
      [
        "On a string of length $\\pi$ with fixed ends, mode $n$ has undamped frequency $\\omega_n = n c$. Strong damping affects only the low modes: those with $n c \\le b$ decay without oscillating, while all the higher modes still vibrate. So only finitely many modes stop oscillating, however large $b$ may be. For example, $u_{tt} + 10u_t = 4u_{xx}$ has $b = 5$ and $c = 2$, so the modes with $2n \\le 5$, namely $n = 1$ and $n = 2$, do not oscillate.\n\nCheck: mode $3$ has $\\omega_3 = 6 > 5$ and oscillates at $\\sqrt{36 - 25} = \\sqrt{11}$.\n\n> **Watch out.** Halve the coefficient of $u_t$ to get $b$, and take the square root of the coefficient of $u_{xx}$ to get $c$.",
        "长度为 $\\pi$、两端固定的弦，第 $n$ 模态的无阻尼频率是 $\\omega_n = n c$。强阻尼只影响低模态：满足 $n c \\le b$ 的模态衰减而不振荡，其余较高的模态仍然振动。所以无论 $b$ 多大，不振荡的模态都只有有限个。例如，$u_{tt} + 10u_t = 4u_{xx}$ 中 $b = 5$，$c = 2$，所以满足 $2n \\le 5$ 的模态，即 $n = 1$ 和 $n = 2$，不振荡。\n\n检验：第 $3$ 模态的 $\\omega_3 = 6 > 5$，以 $\\sqrt{36 - 25} = \\sqrt{11}$ 振荡。\n\n> **注意。** 把 $u_t$ 的系数减半得 $b$，把 $u_{xx}$ 的系数开平方得 $c$。",
      ],
      (rng) =>
        until(() => {
          const c = rng.int(1, 5);
          const b = rng.int(c, 30);
          const answer = Math.floor(b / c);
          const misses: Miss[] = [
            [
              answer + 1,
              `That counts one too many: mode ${answer + 1} has $\\omega = ${c * (answer + 1)} > ${b}$ and oscillates.`,
              `那多算了一个：第 ${answer + 1} 模态的 $\\omega = ${c * (answer + 1)} > ${b}$，会振荡。`,
            ],
            [
              Math.floor((2 * b) / c),
              `That uses the coefficient $${2 * b}$ as $b$; it is $2b$.`,
              `那把系数 $${2 * b}$ 当成了 $b$；它是 $2b$。`,
            ],
            [
              Math.floor(b / (c * c)),
              `That uses $${c * c}$ as the speed; the speed is its square root.`,
              `那把 $${c * c}$ 当成了速度；速度是它的平方根。`,
            ],
            [b, "That ignores the speed $c$ in $\\omega_n = nc$.", "那忽略了 $\\omega_n = nc$ 中的速度 $c$。"],
          ];
          const speed = c * c === 1 ? "" : `${c * c}`;
          return worked(
            [
              `For $u_{tt} + ${2 * b} u_t = ${speed} u_{xx}$ on $[0, \\pi]$ with fixed ends, how many modes do not oscillate?`,
              `对 $[0, \\pi]$ 上两端固定的 $u_{tt} + ${2 * b} u_t = ${speed} u_{xx}$，有多少个模态不振荡？`,
            ],
            answer,
            misses,
            [
              [
                ["Read b and c", "读出 b 和 c"],
                [
                  `$2b = ${2 * b}$ gives $b = ${b}$, and $c = \\sqrt{${c * c}} = ${c}$.`,
                  `$2b = ${2 * b}$ 给出 $b = ${b}$，$c = \\sqrt{${c * c}} = ${c}$。`,
                ],
              ],
              [
                ["Count the modes", "数模态"],
                [
                  `A mode fails to oscillate when $${times(c, "n")} \\le ${b}$, that is, for $n$ up to ${answer}.`,
                  `当 $${times(c, "n")} \\le ${b}$ 时模态不振荡，即 $n$ 不超过 ${answer}。`,
                ],
              ],
            ],
            [
              `Mode ${answer} has $\\omega = ${c * answer} \\le ${b}$, while mode ${answer + 1} has $\\omega = ${c * (answer + 1)} > ${b}$, so the count stops at ${answer}.`,
              `第 ${answer} 模态的 $\\omega = ${c * answer} \\le ${b}$，而第 ${answer + 1} 模态的 $\\omega = ${c * (answer + 1)} > ${b}$，所以数到 ${answer} 为止。`,
            ],
          );
        }),
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
        "An equation with $k$ time derivatives needs $k$ initial conditions: the heat equation needs one, the initial temperature, and the wave equation needs two, the initial shape and velocity. Laplace's equation has no time and takes boundary conditions all around instead, so the number of initial conditions is zero. For example, $u_{tt} = 4u_{xx}$ needs $u(x, 0)$ and $u_t(x, 0)$, which are two conditions.\n\nCheck: d'Alembert's formula uses exactly these two functions, the shape $f$ and the velocity $g$.\n\n> **Watch out.** Only the order in time counts; the derivatives in $x$ decide the boundary conditions, not the initial ones.",
        "含 $k$ 阶时间导数的方程需要 $k$ 个初始条件：热方程需要一个，即初始温度；波动方程需要两个，即初始形状和速度。拉普拉斯方程没有时间，改为在四周给边界条件，所以初始条件的个数是零。例如，$u_{tt} = 4u_{xx}$ 需要 $u(x, 0)$ 和 $u_t(x, 0)$，共两个条件。\n\n检验：达朗贝尔公式恰好用到这两个函数：形状 $f$ 和速度 $g$。\n\n> **注意。** 只有时间的阶数起作用；对 $x$ 的导数决定的是边界条件，而不是初始条件。",
      ],
      (rng) =>
        until(() => {
          const [a, b] = [rng.int(2, 9), rng.int(2, 9)];
          const [body, answer, space] = rng.pick([
            [`u_t = ${a} u_{xx}`, 1, 2],
            [`u_t + ${a} u_x = ${b}`, 1, 1],
            [`u_{tt} = ${a} u_{xx}`, 2, 2],
            [`u_{tt} + ${b} u_t = ${a} u_{xx}`, 2, 2],
            [`u_{tt} = -${a} u_{xxxx}`, 2, 4],
            [`u_{ttt} = ${a} u_{x}`, 3, 1],
          ] as const);
          const data = ["u(x, 0)", "u_t(x, 0)", "u_{tt}(x, 0)"].slice(0, answer);
          const misses: Miss[] = [
            [space, "That counts the derivatives in $x$; only the time derivatives count.", "那数的是对 $x$ 的导数；只有时间导数才算。"],
            [answer + 1, "That is one more than the order in time.", "那比时间的阶数多一。"],
            answer === 1
              ? [0, "That treats it like Laplace's equation; there is a time derivative.", "那把它当成拉普拉斯方程；这里有时间导数。"]
              : [
                  answer - 1,
                  `That is one too few: order ${answer} in time needs $u$ and its first ${answer - 1} time ${answer - 1 === 1 ? "derivative" : "derivatives"}.`,
                  `那少了一个：时间 ${answer} 阶需要 $u$ 及其前 ${answer - 1} 阶时间导数。`,
                ],
          ];
          return worked(
            [`How many initial conditions at $t = 0$ does $${body}$ need?`, `$${body}$ 在 $t = 0$ 时需要几个初始条件？`],
            answer,
            misses,
            [
              [
                ["Find the order in time", "找时间的阶数"],
                [
                  `The highest time derivative has order ${answer}; the derivatives in $x$ do not count.`,
                  `最高阶时间导数是 ${answer} 阶；对 $x$ 的导数不算。`,
                ],
              ],
              [
                ["Count the conditions", "数条件"],
                [
                  `So ${answer === 1 ? "one initial condition is" : `${answer} initial conditions are`} needed.`,
                  `所以需要 ${answer} 个初始条件。`,
                ],
              ],
            ],
            [
              `The data are $${data.join("$, $")}$, which is ${answer} ${answer === 1 ? "function" : "functions"}: $u$ and each lower time derivative.`,
              `数据是 $${data.join("$、$")}$，共 ${answer} 个函数：$u$ 及每个较低阶的时间导数。`,
            ],
          );
        }),
    ),
    point(
      "spotting-the-ill-posed-problem",
      ["Spotting the ill-posed problem", "识别不适定问题"],
      [
        "A problem is well posed when a solution exists, is unique, and depends continuously on the data. The usual failures are running the heat equation backward in time and giving Laplace's equation initial data as if it were a wave equation. In both, tiny high-frequency changes in the data grow enormously. For example, running $u_t = u_{xx}$ backward for time $1$ multiplies a ripple $\\varepsilon \\sin 10x$ in the data by $e^{100}$.\n\nCheck: the mode $e^{-k^{2}t}\\sin kx$ with $k = 10$ and $t = -1$ gives the factor $e^{100}$, while forward, at $t = 1$, it gives $e^{-100}$.\n\n> **Watch out.** Laplace's equation with $u$ and $u_y$ on a line is ill posed, even though the wave equation with the same kind of data is fine.",
        "问题适定是指解存在、唯一，并且连续依赖于数据。常见的失败情形是把热方程倒着时间求解，以及把拉普拉斯方程当成波动方程来给初始数据。在这两种情形下，数据中微小的高频变化都会急剧增大。例如，把 $u_t = u_{xx}$ 倒着求解时间 $1$，数据中的波纹 $\\varepsilon \\sin 10x$ 会乘以 $e^{100}$。\n\n检验：模态 $e^{-k^{2}t}\\sin kx$ 取 $k = 10$，$t = -1$，得因子 $e^{100}$；而正向 $t = 1$ 时因子是 $e^{-100}$。\n\n> **注意。** 在一条线上给定 $u$ 和 $u_y$ 的拉普拉斯方程是不适定的，尽管波动方程配同类数据没有问题。",
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
        const slips: Slip[] = [
          [
            [`$u_t = ${a} u_{xx}$ for $t > 0$, given $u$ at $t = 0$`, `$u_t = ${a} u_{xx}$，$t > 0$，给定 $t = 0$ 时的 $u$`],
            "Running heat forward damps every mode, so small changes in the data stay small: this is well posed.",
            "正向求解热方程使每个模态衰减，所以数据的小变化保持很小：这是适定的。",
          ],
          [
            [
              `$u_{tt} = ${b} u_{xx}$ for $t > 0$, given $u$ and $u_t$ at $t = 0$`,
              `$u_{tt} = ${b} u_{xx}$，$t > 0$，给定 $t = 0$ 时的 $u$ 和 $u_t$`,
            ],
            "D'Alembert's formula solves the wave equation from a shape and a velocity, and changes in them stay bounded: this is well posed.",
            "达朗贝尔公式由形状和速度求解波动方程，它们的变化保持有界：这是适定的。",
          ],
          [
            [
              "$u_{xx} + u_{yy} = 0$ in a square, given $u$ on the whole boundary",
              "$u_{xx} + u_{yy} = 0$ 在正方形内，给定整个边界上的 $u$",
            ],
            "Laplace's equation with values all around the boundary is the Dirichlet problem, which the maximum principle makes well posed.",
            "边界上处处给定值的拉普拉斯方程是狄利克雷问题，极大值原理保证它是适定的。",
          ],
        ];
        return chosen(
          rng,
          ["Which of these problems is ill posed?", "下面哪个问题是不适定的？"],
          bad,
          slips,
          [
            [
              ["Test with a ripple", "用波纹检验"],
              backward
                ? [
                    `A mode $\\sin kx$ of the heat equation carries $e^{-${a}k^2 t}$, which for $t < 0$ grows like $e^{${a}k^2 |t|}$.`,
                    `热方程的模态 $\\sin kx$ 带有 $e^{-${a}k^2 t}$，当 $t < 0$ 时按 $e^{${a}k^2 |t|}$ 增长。`,
                  ]
                : [
                    "Data $u = 0$, $u_y = \\frac{1}{k}\\sin kx$ give the solution $\\frac{1}{k^2}\\sin kx \\sinh ky$.",
                    "数据 $u = 0$，$u_y = \\frac{1}{k}\\sin kx$ 给出解 $\\frac{1}{k^2}\\sin kx \\sinh ky$。",
                  ],
            ],
            [
              ["Judge", "判断"],
              [
                "Tiny data with large $k$ give enormous solutions, so the solution does not depend continuously on the data.",
                "大 $k$ 的微小数据给出巨大的解，所以解不连续依赖于数据。",
              ],
            ],
          ],
          backward
            ? [
                `With $k = 10$ and $t = -1$ the factor is $e^{${100 * a}}$, while the same ripple run forward to $t = 1$ shrinks by $e^{-${100 * a}}$.`,
                `取 $k = 10$，$t = -1$，因子是 $e^{${100 * a}}$；而同一波纹正向求解到 $t = 1$ 会缩小为 $e^{-${100 * a}}$ 倍。`,
              ]
            : [
                "At $y = 1$ the solution has size about $\\frac{e^{k}}{2k^2}$, which grows without bound as $k$ increases, while the data shrink like $\\frac{1}{k}$.",
                "在 $y = 1$ 处解的大小约为 $\\frac{e^{k}}{2k^2}$，随 $k$ 增大而无界增长，而数据按 $\\frac{1}{k}$ 缩小。",
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
        "The standard scheme for the wave equation is stable when the Courant number $c \\, \\Delta t / \\Delta x$ is at most 1. The reason is physical: a grid value can only learn from its neighbors, so the numerical signal must be able to keep up with the true wave. Finer grids therefore need proportionally smaller steps. For example, with $c = 2$ and $\\Delta x = \\frac{1}{10}$ the largest step is $\\Delta t = \\frac{1}{2 \\cdot 10} = \\frac{1}{20}$.\n\nCheck: the Courant number is $\\frac{2 \\cdot \\frac{1}{20}}{\\frac{1}{10}} = 1$, exactly at the limit.\n\n> **Watch out.** For waves the limit is proportional to $\\Delta x$, not to $\\Delta x^{2}$ as for heat, and there is no factor $\\frac{1}{2}$.",
        "波动方程的标准格式在库朗数 $c \\, \\Delta t / \\Delta x$ 不超过 1 时稳定。原因来自物理：格点的值只能从相邻格点获得信息，所以数值信号必须跟得上真实的波。因此网格越细，时间步长要按比例越小。例如，$c = 2$，$\\Delta x = \\frac{1}{10}$，最大步长是 $\\Delta t = \\frac{1}{2 \\cdot 10} = \\frac{1}{20}$。\n\n检验：库朗数是 $\\frac{2 \\cdot \\frac{1}{20}}{\\frac{1}{10}} = 1$，恰好在极限上。\n\n> **注意。** 对波动方程，极限与 $\\Delta x$ 成正比，而不像热方程那样与 $\\Delta x^{2}$ 成正比，也没有因子 $\\frac{1}{2}$。",
      ],
      (rng) =>
        until(() => {
          const c = rng.int(2, 9);
          const parts = rng.int(2, 12);
          const answer = Q.of(1, c * parts);
          const misses: Miss[] = [
            [Q.of(c, parts), "That multiplies by the speed; a faster wave needs a smaller step.", "那乘以了速度；波越快，步长要越小。"],
            [
              Q.of(1, 2 * c * parts),
              "That uses the heat limit $\\frac{1}{2}$; for waves the Courant number may reach $1$.",
              "那用了热方程的极限 $\\frac{1}{2}$；对波动方程库朗数可以达到 $1$。",
            ],
            [
              Q.of(1, c * parts * parts),
              "That squares $\\Delta x$, as for heat; for waves it enters to the first power.",
              "那把 $\\Delta x$ 平方了，像热方程那样；对波动方程它是一次方。",
            ],
            [Q.of(1, parts), "That drops the speed $c$.", "那漏掉了速度 $c$。"],
          ];
          return worked(
            [
              `For a wave with speed ${c} on a grid with $\\Delta x = \\frac{1}{${parts}}$, what is the largest stable $\\Delta t$?`,
              `波速为 ${c}，网格 $\\Delta x = \\frac{1}{${parts}}$。稳定的最大 $\\Delta t$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["State the condition", "写出条件"],
                [
                  `Stability needs $\\frac{${c} \\, \\Delta t}{\\Delta x} \\le 1$, that is $${c} \\, \\Delta t \\le \\frac{1}{${parts}}$.`,
                  `稳定性要求 $\\frac{${c} \\, \\Delta t}{\\Delta x} \\le 1$，即 $${c} \\, \\Delta t \\le \\frac{1}{${parts}}$。`,
                ],
              ],
              [
                ["Solve", "求解"],
                [
                  `$\\Delta t \\le \\frac{1}{${c} \\cdot ${parts}} = ${answer.toLatex()}$.`,
                  `$\\Delta t \\le \\frac{1}{${c} \\cdot ${parts}} = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `With $\\Delta t = ${answer.toLatex()}$, the Courant number is $${c} \\cdot ${answer.toLatex()} \\cdot ${parts} = 1$, exactly at the limit.`,
              `取 $\\Delta t = ${answer.toLatex()}$，库朗数是 $${c} \\cdot ${answer.toLatex()} \\cdot ${parts} = 1$，恰好在极限上。`,
            ],
          );
        }),
    ),
    point(
      "one-step-of-the-leapfrog-scheme",
      ["One step of the leapfrog scheme", "蛙跳格式的一步"],
      [
        "The leapfrog scheme uses two earlier time levels: $u_i^{n+1} = 2 u_i^n - u_i^{n-1} + r^2 (u_{i+1}^n - 2 u_i^n + u_{i-1}^n)$, where $r$ is the Courant number. It needs two starting levels because the wave equation needs both an initial shape and an initial velocity. For example, with $r^{2} = \\frac{1}{4}$, neighbours $2$ and $8$, middle value $4$ and older value $3$: the second difference is $2 - 8 + 8 = 2$, so $u_i^{n+1} = 8 - 3 + \\frac{1}{4} \\cdot 2 = \\frac{11}{2}$.\n\nCheck: as weights, $\\frac{1}{4} \\cdot 2 + \\frac{3}{2} \\cdot 4 + \\frac{1}{4} \\cdot 8 - 3 = \\frac{1}{2} + 6 + 2 - 3 = \\frac{11}{2}$.\n\n> **Watch out.** The older level $u_i^{n-1}$ is subtracted, and the current middle value counts twice.",
        "蛙跳格式用到前两个时间层：$u_i^{n+1} = 2 u_i^n - u_i^{n-1} + r^2 (u_{i+1}^n - 2 u_i^n + u_{i-1}^n)$，其中 $r$ 是库朗数。它需要两个起始层，因为波动方程既需要初始形状，又需要初始速度。例如，$r^{2} = \\frac{1}{4}$，相邻值 $2$ 和 $8$，中间值 $4$，更早的值 $3$：二阶差分是 $2 - 8 + 8 = 2$，所以 $u_i^{n+1} = 8 - 3 + \\frac{1}{4} \\cdot 2 = \\frac{11}{2}$。\n\n检验：写成加权形式，$\\frac{1}{4} \\cdot 2 + \\frac{3}{2} \\cdot 4 + \\frac{1}{4} \\cdot 8 - 3 = \\frac{1}{2} + 6 + 2 - 3 = \\frac{11}{2}$。\n\n> **注意。** 更早的一层 $u_i^{n-1}$ 要减去，而当前的中间值要算两次。",
      ],
      (rng) =>
        until(() => {
          const r2 = rng.pick([Q.of(1), Q.of(1, 4), Q.of(1, 2)]);
          const [left, mid, right, last] = [rng.int(0, 9), rng.int(1, 9), rng.int(0, 9), rng.int(0, 9)];
          const curvature = left - 2 * mid + right;
          const change = r2.mul(Q.of(curvature));
          const answer = Q.of(2 * mid - last).add(change);
          const centre = Q.of(2).sub(r2.mul(Q.of(2)));
          const misses: Miss[] = [
            [Q.of(2 * mid + last).add(change), "That adds the older value; it is subtracted.", "那加上了更早的值；应当减去它。"],
            [
              Q.of(mid).add(change),
              "That uses the current value once and forgets the older level.",
              "那只用了一次当前值，又忘了更早的一层。",
            ],
            [Q.of(2 * mid - last), "That leaves out the second difference.", "那漏掉了二阶差分。"],
            [
              Q.of(2 * mid - last).add(Q.of(curvature)),
              `That leaves out the factor $r^2 = ${r2.toLatex()}$.`,
              `那漏掉了因子 $r^2 = ${r2.toLatex()}$。`,
            ],
          ];
          return worked(
            [
              `With $r^2 = ${r2.toLatex()}$, a leapfrog step has neighbors $u_{i-1}^n = ${left}$ and $u_{i+1}^n = ${right}$, with $u_i^n = ${mid}$ and $u_i^{n-1} = ${last}$. What is $u_i^{n+1}$?`,
              `$r^2 = ${r2.toLatex()}$，蛙跳的一步中相邻值 $u_{i-1}^n = ${left}$，$u_{i+1}^n = ${right}$，并且 $u_i^n = ${mid}$，$u_i^{n-1} = ${last}$。$u_i^{n+1}$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Form the second difference", "求二阶差分"],
                [`$${left} - 2 \\cdot ${mid} + ${right} = ${curvature}$.`, `$${left} - 2 \\cdot ${mid} + ${right} = ${curvature}$。`],
              ],
              [
                ["Step", "推进一步"],
                [
                  `$2 \\cdot ${mid} - ${last} + ${r2.toLatex()} \\cdot ${wrap(curvature)} = ${answer.toLatex()}$.`,
                  `$2 \\cdot ${mid} - ${last} + ${r2.toLatex()} \\cdot ${wrap(curvature)} = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `As weights, $${r2.toLatex()} \\cdot ${left} + ${centre.toLatex()} \\cdot ${mid} + ${r2.toLatex()} \\cdot ${right} - ${last} = ${answer.toLatex()}$.`,
              `写成加权形式，$${r2.toLatex()} \\cdot ${left} + ${centre.toLatex()} \\cdot ${mid} + ${r2.toLatex()} \\cdot ${right} - ${last} = ${answer.toLatex()}$。`,
            ],
          );
        }),
    ),
  ],
);

/** partialDifferentialEquationsMoreTopics holds the later topics of the Partial Differential Equations course. */
export const partialDifferentialEquationsMoreTopics: readonly TopicDef[] = [
  lesson(
    shocks,
    [
      "For $u_t + uu_x = 0$, a characteristic from $x = 0$ carrying $u = 5$ and one from $x = 4$ carrying $u = 3$ close their gap of $4$ at the rate $2$, so they cross at $t = 2$, and a shock forms.",
      "对 $u_t + uu_x = 0$，从 $x = 0$ 出发、携带 $u = 5$ 的特征线和从 $x = 4$ 出发、携带 $u = 3$ 的特征线，相距 $4$，以 $2$ 的速率靠近，所以在 $t = 2$ 相交，形成激波。",
    ],
    [
      "at $t = 2$ both lines are at $x = 10$, since $0 + 5 \\cdot 2 = 4 + 3 \\cdot 2$; and a shock between $5$ and $3$ would move at their average, $4$.",
      "$t = 2$ 时两条线都在 $x = 10$，因为 $0 + 5 \\cdot 2 = 4 + 3 \\cdot 2$；而 $5$ 与 $3$ 之间的激波以它们的平均值 $4$ 移动。",
    ],
    [
      "follow characteristics whose speed is the solution itself, find when two of them cross, and find the speed of the shock that follows",
      "跟踪速度就是解本身的特征线，求两条特征线何时相交，并求随后激波的速度",
    ],
  ),
  lesson(
    dependence,
    [
      "For $u_{tt} = 9u_{xx}$ the speed is $3$, so the value at $x = 2$, $t = 1$ depends only on the initial data on $[-1, 5]$.",
      "对 $u_{tt} = 9u_{xx}$，速度是 $3$，所以 $x = 2$，$t = 1$ 处的值只依赖 $[-1, 5]$ 上的初始数据。",
    ],
    [
      "the interval is centred at $x = 2$ with half-width $3 \\cdot 1 = 3$, the distance a signal covers in time $1$.",
      "这个区间以 $x = 2$ 为中心，半宽 $3 \\cdot 1 = 3$，正是信号在时间 $1$ 内走过的距离。",
    ],
    [
      "find the interval of initial data that decides a value, and the times at which a disturbance arrives and passes",
      "求决定一个值的初始数据区间，以及扰动到达和经过的时刻",
    ],
  ),
  lesson(
    reflection,
    [
      "On a string of length $6$, a pulse at $x = 4$ moving right at speed $1$ reaches the fixed end at $6$ after time $2$ and comes back upside down, so at time $5$ it is at $x = 3$, inverted.",
      "在长为 $6$ 的弦上，$x = 4$ 处以速度 $1$ 向右运动的脉冲，经过时间 $2$ 到达固定端 $6$，倒过来返回，所以在时刻 $5$ 位于 $x = 3$，是倒置的。",
    ],
    [
      "unfolding the string, the pulse is at $4 + 5 = 9$, and $12 - 9 = 3$; one fixed-end reflection gives one change of sign.",
      "把弦展开，脉冲在 $4 + 5 = 9$，而 $12 - 9 = 3$；一次固定端反射改变一次符号。",
    ],
    [
      "use images to see how fixed and free ends reflect a pulse, and find where a pulse is later",
      "用镜像法看固定端和自由端如何反射脉冲，并求脉冲之后的位置",
    ],
  ),
  lesson(
    energy,
    [
      "A string released from rest as $2\\sin x + \\sin 3x$ has energy $1^{2} \\cdot 2^{2} + 3^{2} \\cdot 1^{2} = 13$ in units where mode $n$ with amplitude $A$ has $n^{2}A^{2}$, and it keeps this energy forever.",
      "从静止释放、形状为 $2\\sin x + \\sin 3x$ 的弦，在编号 $n$、振幅 $A$ 的模态能量为 $n^{2}A^{2}$ 的单位下，能量是 $1^{2} \\cdot 2^{2} + 3^{2} \\cdot 1^{2} = 13$，并永远保持这个能量。",
    ],
    [
      "the two shares are $(1 \\cdot 2)^{2} = 4$ and $(3 \\cdot 1)^{2} = 9$, and different modes exchange no energy.",
      "两份分别是 $(1 \\cdot 2)^{2} = 4$ 和 $(3 \\cdot 1)^{2} = 9$，不同模态之间不交换能量。",
    ],
    [
      "compare the energies of two modes and use conservation to find the total energy at any time",
      "比较两个模态的能量，并利用守恒求任意时刻的总能量",
    ],
  ),
  lesson(
    kernel,
    [
      "Heat from a point source with peak $6$ at time $1$ has peak $\\frac{6}{3} = 2$ at time $9$, while its width grows by the factor $\\sqrt{9} = 3$ and its total stays the same.",
      "点热源在时刻 $1$ 峰值为 $6$，在时刻 $9$ 峰值为 $\\frac{6}{3} = 2$，而宽度增大为 $\\sqrt{9} = 3$ 倍，总量不变。",
    ],
    [
      "height times width stays fixed, since $6 \\cdot 1 = 2 \\cdot 3$, which is what keeps the area constant.",
      "高度乘宽度保持不变，因为 $6 \\cdot 1 = 2 \\cdot 3$，这正使面积保持不变。",
    ],
    [
      "see how the peak of the heat kernel falls, how its width grows, and why the total heat never changes",
      "看热核的峰值如何下降、宽度如何增长，以及总热量为何不变",
    ],
  ),
  lesson(
    heatMaximum,
    [
      "A rod with initial temperature at most $7$ and ends held at $4$ and $9$ stays at most $9$, the largest of the three data values.",
      "初始温度最高为 $7$、两端保持 $4$ 和 $9$ 的杆，温度始终不超过三个数据值中最大的 $9$。",
    ],
    [
      "an interior maximum would curve downward, giving $u_t = u_{xx} < 0$, so the point would have been hotter a moment earlier.",
      "内部的最大值处曲线向下弯，$u_t = u_{xx} < 0$，所以那一点片刻之前会更热。",
    ],
    [
      "bound a temperature by its initial and end values, and show that nearby data give nearby solutions",
      "用初始值和端点值估计温度，并说明相近的数据给出相近的解",
    ],
  ),
  lesson(
    dispersion,
    [
      "For $u_{tt} = 4u_{xx} - 64u$, the plane wave with $k = 3$ has $\\omega^{2} = 4 \\cdot 9 + 64 = 100$, so $\\omega = 10$.",
      "对 $u_{tt} = 4u_{xx} - 64u$，$k = 3$ 的平面波满足 $\\omega^{2} = 4 \\cdot 9 + 64 = 100$，所以 $\\omega = 10$。",
    ],
    [
      "substituting, $u_{tt} = -100u$ and $4u_{xx} - 64u = -36u - 64u = -100u$.",
      "代入后，$u_{tt} = -100u$，而 $4u_{xx} - 64u = -36u - 64u = -100u$。",
    ],
    [
      "find the frequency of a plane wave, its phase and group speeds, and the rate at which a heat mode fades",
      "求平面波的频率、相速度和群速度，以及热模态衰减的速率",
    ],
  ),
  lesson(
    poisson,
    [
      "On the disc of radius $2$ with $\\Delta u = 4$ and $u = 0$ on the edge, the solution is $u = x^{2} + y^{2} - 4$, so the center value is $-4$.",
      "在半径为 $2$ 的圆盘上，$\\Delta u = 4$，边界上 $u = 0$，解是 $u = x^{2} + y^{2} - 4$，所以圆心的值是 $-4$。",
    ],
    [
      "$u_{xx} + u_{yy} = 2 + 2 = 4$, and on the edge $x^{2} + y^{2} = 4$ gives $u = 0$.",
      "$u_{xx} + u_{yy} = 2 + 2 = 4$，而在边界上 $x^{2} + y^{2} = 4$，给出 $u = 0$。",
    ],
    [
      "solve Poisson's equation on a disc, and find when a problem with given fluxes at both ends can be solved",
      "求解圆盘上的泊松方程，并判断两端给定通量的问题何时有解",
    ],
  ),
  lesson(
    membrane,
    [
      "A square drum of side $2$ with $c = 1$ has, for the mode $(3, 4)$, the frequency $\\frac{\\pi}{2}\\sqrt{9 + 16} = \\frac{5\\pi}{2}$; the mode $(4, 3)$ shares it.",
      "边长为 $2$、$c = 1$ 的方形鼓，模态 $(3, 4)$ 的频率是 $\\frac{\\pi}{2}\\sqrt{9 + 16} = \\frac{5\\pi}{2}$；模态 $(4, 3)$ 与它频率相同。",
    ],
    [
      "both modes have $m^{2} + n^{2} = 25$, and the frequency depends only on that sum.",
      "两个模态都有 $m^{2} + n^{2} = 25$，而频率只取决于这个和。",
    ],
    ["find the frequencies of a square drum and count the modes that share a frequency", "求方形鼓的频率，并数出频率相同的模态"],
  ),
  lesson(
    robin,
    [
      "A rod held at $4$ at $x = 0$ and cooling by $u_x = -(u - 0)$ at $x = 1$ has the steady line $u = 4 - 2x$, so its cooled end sits at $2$.",
      "在 $x = 0$ 处保持 $4$、在 $x = 1$ 处按 $u_x = -(u - 0)$ 散热的杆，稳态直线是 $u = 4 - 2x$，所以散热端的温度是 $2$。",
    ],
    [
      "at $x = 1$ the slope $-2$ equals $-(2 - 0)$, and $2$ lies between the held value $4$ and the surroundings $0$.",
      "在 $x = 1$ 处斜率 $-2$ 等于 $-(2 - 0)$，而 $2$ 介于保持的值 $4$ 与环境温度 $0$ 之间。",
    ],
    [
      "name Dirichlet, Neumann and Robin conditions, and find the temperature of an end that cools into its surroundings",
      "辨认狄利克雷、诺伊曼和罗宾条件，并求向周围散热的端点的温度",
    ],
  ),
  lesson(
    damped,
    [
      "A damped mode with $T'' + 6T' + 25T = 0$ has $b = 3$ and $\\omega = 5$, so it oscillates at $\\sqrt{25 - 9} = 4$ inside the envelope $e^{-3t}$.",
      "满足 $T'' + 6T' + 25T = 0$ 的阻尼模态，$b = 3$，$\\omega = 5$，所以它在包络 $e^{-3t}$ 之内以 $\\sqrt{25 - 9} = 4$ 振荡。",
    ],
    [
      "the roots $-3 \\pm 4i$ have sum $-6$ and product $9 + 16 = 25$, matching the coefficients.",
      "根 $-3 \\pm 4i$ 的和为 $-6$，积为 $9 + 16 = 25$，与系数相符。",
    ],
    [
      "find the frequency and decay rate of a damped mode, and count the modes that are too damped to oscillate",
      "求阻尼模态的频率和衰减率，并数出阻尼太强而不振荡的模态",
    ],
  ),
  lesson(
    wellPosed,
    [
      "The wave equation $u_{tt} = 4u_{xx}$ needs two initial conditions, $u(x, 0)$ and $u_t(x, 0)$, while running $u_t = u_{xx}$ backward multiplies a ripple $\\sin 10x$ by $e^{100}$ in time $1$.",
      "波动方程 $u_{tt} = 4u_{xx}$ 需要两个初始条件 $u(x, 0)$ 和 $u_t(x, 0)$；而把 $u_t = u_{xx}$ 倒着求解时间 $1$，会把波纹 $\\sin 10x$ 乘以 $e^{100}$。",
    ],
    [
      "the mode $e^{-k^{2}t}\\sin kx$ with $k = 10$ at $t = -1$ gives the factor $e^{100}$, so tiny data blow up.",
      "模态 $e^{-k^{2}t}\\sin kx$ 取 $k = 10$，$t = -1$，得因子 $e^{100}$，所以微小的数据会爆炸。",
    ],
    [
      "count the initial conditions an equation needs and spot the problems that are ill posed",
      "数出方程需要的初始条件，并识别不适定的问题",
    ],
  ),
  lesson(
    leapfrog,
    [
      "With speed $2$ and $\\Delta x = \\frac{1}{10}$, the leapfrog scheme is stable for $\\Delta t$ up to $\\frac{1}{20}$, and one step from neighbours $2$, $8$, middle $4$ and older value $3$ with $r^{2} = \\frac{1}{4}$ gives $\\frac{11}{2}$.",
      "速度为 $2$、$\\Delta x = \\frac{1}{10}$ 时，蛙跳格式在 $\\Delta t$ 不超过 $\\frac{1}{20}$ 时稳定；取 $r^{2} = \\frac{1}{4}$，由相邻值 $2$、$8$，中间值 $4$ 和更早的值 $3$ 推进一步，得 $\\frac{11}{2}$。",
    ],
    [
      "the Courant number $2 \\cdot \\frac{1}{20} \\cdot 10 = 1$ is at the limit, and $8 - 3 + \\frac{1}{4} \\cdot 2 = \\frac{11}{2}$.",
      "库朗数 $2 \\cdot \\frac{1}{20} \\cdot 10 = 1$ 恰在极限上，而 $8 - 3 + \\frac{1}{4} \\cdot 2 = \\frac{11}{2}$。",
    ],
    [
      "choose the largest stable time step for the wave equation and take one step of the leapfrog scheme",
      "为波动方程选择最大的稳定时间步长，并进行蛙跳格式的一步计算",
    ],
  ),
];
