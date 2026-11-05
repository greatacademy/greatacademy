// Knowledge points of Partial Differential Equations that ask the learner to read a drawing: characteristics, wave
// profiles and grids. See `deeperFiguresPartialDifferentialEquationsPoints`.

import type { KnowledgePointDef } from "@ga/content";
import { t } from "@ga/content";
import type { PlaneMark, PlaneView, Point } from "@ga/subject-math";
import { Q, svgDocument } from "@ga/subject-math";

import { ask, choose, type Pair, point, same } from "../university-kit.ts";
import { drawn, label, node } from "./figure-reading-more.ts";

/** fig wraps marks in a figure with its description in both languages. */
const fig = (v: PlaneView, marks: readonly PlaneMark[], [en, zh]: Pair) => drawn(v, marks, t(en, zh));

/** tent is a triangular pulse with its tip at c. */
const tent = (c: number, w: number, h: number) => (x: number) => h * Math.max(0, 1 - Math.abs(x - c) / w);

/** text writes a number on a line in a label. */
const text = (v: number) => String(v).replace("-", "−");

const transportSpeed = point(
  "the-speed-from-two-drawn-profiles",
  ["The speed from two drawn profiles", "由两个图形读速度"],
  [
    "The transport equation $u_t + c u_x = 0$ moves any initial profile at constant speed $c$ without changing its shape. So comparing two profiles gives $c$ as the displacement divided by the elapsed time. A profile that moved to the left corresponds to a negative value of $c$, and the time matters as much as the distance does.",
    "输运方程 $u_t + c u_x = 0$ 使任何初始形状以常速度 $c$ 移动，形状不变。所以比较两个形状，$c$ 等于位移除以经过的时间。形状向左移动对应负的 $c$，时间和距离同样重要。",
  ],
  (rng) => {
    const c0 = rng.int(-6, 6);
    const shift = rng.nonZero(-8, 8);
    const c1 = c0 + shift > 7 || c0 + shift < -7 ? c0 - shift : c0 + shift;
    const moved = c1 - c0;
    const T = rng.pick([1, 2, 3, 4]);
    const speed = Q.of(moved, T);
    const h = rng.int(2, 4);
    return ask(
      [
        `The solid graph is a solution of $u_t + c u_x = 0$ at time $t = 0$, and the dashed graph is the same solution at $t = ${T}$. What is $c$?`,
        `实线是 $u_t + c u_x = 0$ 的解在 $t = 0$ 时的图，虚线是同一个解在 $t = ${T}$ 时的图。$c$ 是多少？`,
      ],
      speed,
      [speed.neg(), Q.of(moved, 1).eq(speed) ? speed.add(Q.of(1, 1)) : Q.of(moved, 1), Q.of(T, moved), speed.add(Q.of(1, T))],
      [
        `The tip moves from $x = ${c0}$ to $x = ${c1}$, a displacement of $${moved}$, in time $${T}$. Dividing gives the speed $${speed.toLatex()}$.`,
        `尖端从 $x = ${c0}$ 移到 $x = ${c1}$，位移为 $${moved}$，时间为 $${T}$。相除得速度 $${speed.toLatex()}$。`,
      ],
      fig(
        { xMin: -9, xMax: 9, yMin: -1, yMax: 6, xName: "x", yName: "u" },
        [
          { kind: "curve", f: tent(c0, 2, h), accent: true },
          { kind: "curve", f: tent(c1, 2, h), dashed: true },
        ],
        [
          `A solid pulse with its tip at x = ${c0} and a dashed pulse of the same shape with its tip at x = ${c1}.`,
          `实线脉冲尖端在 x = ${c0}，形状相同的虚线脉冲尖端在 x = ${c1}。`,
        ],
      ),
    );
  },
);

const valueAlongCharacteristic = point(
  "a-value-carried-along-a-characteristic",
  ["A value carried along a characteristic", "沿特征线携带的值"],
  [
    "For a first-order linear equation, the solution keeps its value along each characteristic line. So to find $u$ at a point of the $xt$-plane, follow the characteristic through that point back to the $x$-axis and read where it lands. The value at the point equals the initial value at the foot of the line.",
    "对一阶线性方程，解沿每条特征线保持不变。所以要求 $xt$ 平面上一点的 $u$，就沿经过该点的特征线回到 $x$ 轴，读出落点。该点的值等于这条线的底部处的初值。",
  ],
  (rng) => {
    const speed = rng.pick([-2, -1, 1, 2]);
    const foot = rng.int(-3, 3);
    const time = rng.int(1, 3);
    const P: Point = [foot + speed * time, time];
    const a = rng.nonZero(-3, 3);
    const b = rng.int(-3, 3);
    const g = (x: number) => a * x + b;
    const part = a === 1 ? "x" : a === -1 ? "-x" : `${a}x`;
    const gTex = b === 0 ? part : `${part} ${b < 0 ? "-" : "+"} ${Math.abs(b)}`;
    const lines: PlaneMark[] = [];
    for (let f = -10; f <= 10; f += 2) {
      const start = foot + f;
      lines.push({ kind: "segment", a: [start, 0], b: [start + speed * 5, 5], dashed: f !== 0, accent: f === 0 });
    }
    return ask(
      [
        `The lines are the characteristics of a linear transport equation, and $u(x, 0) = ${gTex}$. What is $u$ at the marked point $P$?`,
        `这些直线是某线性输运方程的特征线，$u(x, 0) = ${gTex}$。$u$ 在所标点 $P$ 处的值是多少？`,
      ],
      g(foot),
      [g(P[0]), g(foot + 1), g(foot - 1), g(time)],
      [
        `The characteristic through $P$ lands on the axis at $x = ${foot}$, and the solution is constant along it. So $u(P) = u(${foot}, 0) = ${g(foot)}$.`,
        `经过 $P$ 的特征线落在轴上的 $x = ${foot}$ 处，解沿它不变。所以 $u(P) = u(${foot}, 0) = ${g(foot)}$。`,
      ],
      fig(
        { xMin: -10, xMax: 10, yMin: -1, yMax: 6, labelEvery: 2, xName: "x", yName: "t" },
        [...lines, { kind: "point", at: P, label: "P", dir: "e" }],
        [
          `Parallel characteristic lines of slope dx/dt = ${speed}, with P at (${P[0]}, ${P[1]}).`,
          `平行的特征线，dx/dt = ${speed}，P 在 (${P[0]}, ${P[1]})。`,
        ],
      ),
    );
  },
);

const burgersPicture = point(
  "shock-or-fan-from-the-characteristics",
  ["Shock or fan from the characteristics", "由特征线判断激波或稀疏波"],
  [
    "For Burgers' equation, a characteristic starting where $u$ has a given value moves with speed equal to that value. Faster characteristics behind slower ones collide, which forms a shock whose speed is the average of the two states. Faster characteristics ahead of slower ones spread apart, and the gap fills with a rarefaction fan.",
    "对伯格斯方程，从 $u$ 取某值之处出发的特征线以等于该值的速度移动。慢的特征线在前、快的在后时会相撞，形成激波，其速度是两个状态的平均。快的在前、慢的在后时特征线散开，空隙由稀疏扇填满。",
  ],
  (rng) => {
    const [a, b] = rng.pick<Point>([
      [2, 0],
      [3, 1],
      [2, -1],
      [1, -1],
      [3, -1],
      [1, 0],
      [0, 2],
      [1, 3],
      [-1, 2],
      [-1, 1],
      [-1, 3],
      [0, 1],
    ]);
    const shock = a > b;
    const jump = rng.int(-2, 2);
    const speed = Q.of(a + b, 2);
    const lines: PlaneMark[] = [];
    for (const f of [-8, -6, -4, -2]) lines.push({ kind: "segment", a: [jump + f, 0], b: [jump + f + a * 2, 2], accent: true });
    for (const f of [2, 4, 6, 8]) lines.push({ kind: "segment", a: [jump + f, 0], b: [jump + f + b * 2, 2], dashed: true, accent: true });
    const right: Pair = shock
      ? [`A shock moving with speed $${speed.toLatex()}$`, `以速度 $${speed.toLatex()}$ 移动的激波`]
      : ["A rarefaction fan from the jump", "从跳跃处发出的稀疏扇"];
    return choose(
      rng,
      [
        "The solid and dashed lines are the characteristics of Burgers' equation $u_t + u u_x = 0$ with one jump in the initial data, each line having $dx/dt$ equal to the state it carries. What develops at the jump for $t > 0$?",
        "实线和虚线是伯格斯方程 $u_t + u u_x = 0$ 在初始数据有一个跳跃时的特征线，每条线的 $dx/dt$ 等于它携带的状态。$t > 0$ 时在跳跃处形成什么？",
      ],
      right,
      shock
        ? [
            ["A rarefaction fan from the jump", "从跳跃处发出的稀疏扇"],
            [`A shock moving with speed $${Q.of(a - b, 2).toLatex()}$`, `以速度 $${Q.of(a - b, 2).toLatex()}$ 移动的激波`],
            [`A shock moving with speed $${a}$`, `以速度 $${a}$ 移动的激波`],
            [`A shock moving with speed $${b}$`, `以速度 $${b}$ 移动的激波`],
          ]
        : [
            [`A shock moving with speed $${speed.toLatex()}$`, `以速度 $${speed.toLatex()}$ 移动的激波`],
            [`A shock moving with speed $${b}$`, `以速度 $${b}$ 移动的激波`],
            [`A shock moving with speed $${a}$`, `以速度 $${a}$ 移动的激波`],
            ["A stationary jump", "静止的跳跃"],
          ],
      shock
        ? [
            `The left state is $${a}$ and the right state is $${b}$, read from the slopes. The left lines are faster, so they run into the right lines and form a shock, whose speed is the average, $${speed.toLatex()}$.`,
            `由斜率读出左状态为 $${a}$，右状态为 $${b}$。左边的线更快，所以撞上右边的线形成激波，速度是平均值 $${speed.toLatex()}$。`,
          ]
        : [
            `The left state is $${a}$ and the right state is $${b}$, read from the slopes. The right lines are faster, so the lines spread apart near the jump and the gap fills with a fan.`,
            `由斜率读出左状态为 $${a}$，右状态为 $${b}$。右边的线更快，所以线在跳跃附近散开，空隙由稀疏扇填满。`,
          ],
      fig({ xMin: -11, xMax: 11, yMin: -1, yMax: 4, labelEvery: 2, xName: "x", yName: "t" }, lines, [
        `Solid lines on the left with dx/dt = ${a} and dashed lines on the right with dx/dt = ${b}.`,
        `左边实线的 dx/dt = ${a}，右边虚线的 dx/dt = ${b}。`,
      ]),
    );
  },
);

const dAlembertValue = point(
  "dalembert-from-a-drawn-initial-shape",
  ["d'Alembert from a drawn initial shape", "由图中初始形状用达朗贝尔公式"],
  [
    "With zero initial velocity, d'Alembert's formula splits the initial shape into two halves, moving left and right at speed $c$: $u(x, t) = \\frac{1}{2}[f(x - ct) + f(x + ct)]$. To evaluate it from a graph, read the heights of $f$ at the two points $x - ct$ and $x + ct$, and average them.",
    "初速度为零时，达朗贝尔公式把初始形状分成两半，以速度 $c$ 分别向左和向右移动：$u(x, t) = \\frac{1}{2}[f(x - ct) + f(x + ct)]$。要从图上求值，就读出 $f$ 在 $x - ct$ 和 $x + ct$ 两点的高度，再取平均。",
  ],
  (rng) => {
    const breaks = rng.sample([-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5], 4).sort((a, b) => a - b);
    const top = breaks.map(() => rng.int(1, 5));
    const points: Point[] = [[-6, 0], ...breaks.map((b, i): Point => [b, top[i] as number]), [6, 0]];
    const f = (x: number) => {
      for (let i = 0; i + 1 < points.length; i++) {
        const [p, q] = [points[i] as Point, points[i + 1] as Point];
        if (x >= p[0] && x <= q[0]) return p[1] + ((q[1] - p[1]) * (x - p[0])) / (q[0] - p[0]);
      }
      return 0;
    };
    const [i, j] = rng.sample(breaks, 2).sort((a, b) => a - b) as [number, number];
    const x0Doubled = i + j;
    const ct = (j - i) / 2;
    const c = ct % 1 === 0 ? ct : 2 * ct;
    const time = ct % 1 === 0 ? 1 : Q.of(1, 2);
    const timeTex = typeof time === "number" ? "1" : time.toLatex();
    const fl = f(i);
    const fr = f(j);
    const answer = Q.of(fl + fr, 2);
    const x0 = Q.of(x0Doubled, 2);
    return ask(
      [
        `The graph shows the initial shape $f$ of a string, released from rest, with wave speed $c = ${c}$. What is $u(${x0.toLatex()}, ${timeTex})$?`,
        `图中是从静止释放的弦的初始形状 $f$，波速 $c = ${c}$。$u(${x0.toLatex()}, ${timeTex})$ 是多少？`,
      ],
      answer,
      [
        Q.of(fl + fr, 1),
        Q.of(fl, 1).eq(answer) ? Q.of(fl + 1, 1) : Q.of(fl, 1),
        Q.of(fr, 1).eq(answer) ? Q.of(fr + 2, 1) : Q.of(fr, 1),
        Q.of(Math.round(f(x0.toNumber())) + 1, 1),
      ],
      [
        `Here $ct = ${ct === Math.floor(ct) ? ct : Q.of(2 * ct, 2).toLatex()}$, so the two points to read are $x = ${i}$ and $x = ${j}$. The graph has heights $${fl}$ and $${fr}$ there, and their average is $${answer.toLatex()}$.`,
        `这里 $ct = ${ct === Math.floor(ct) ? ct : Q.of(2 * ct, 2).toLatex()}$，所以要读的两点是 $x = ${i}$ 和 $x = ${j}$。图在那里的高度是 $${fl}$ 和 $${fr}$，平均值是 $${answer.toLatex()}$。`,
      ],
      fig(
        { xMin: -7, xMax: 7, yMin: -1, yMax: 6, xName: "x", yName: "f" },
        [{ kind: "path", points, accent: true }],
        [
          `Straight pieces through ${points.map((p) => `(${p[0]}, ${p[1]})`).join(", ")}.`,
          `经过 ${points.map((p) => `(${p[0]}, ${p[1]})`).join("，")} 的直线段。`,
        ],
      ),
    );
  },
);

const domainFromPoint = point(
  "the-domain-of-dependence-of-a-marked-point",
  ["The domain of dependence of a marked point", "所标点的依赖域"],
  [
    "The value of a wave at a point $(x_0, t_0)$ depends only on the initial data on the interval from $x_0 - c t_0$ to $x_0 + c t_0$. In the $xt$-plane this is the base of a triangle with its top at the point, whose sides have slopes matching the wave speed. Data outside this interval has not had time to arrive.",
    "波在点 $(x_0, t_0)$ 处的值只取决于从 $x_0 - c t_0$ 到 $x_0 + c t_0$ 区间上的初始数据。在 $xt$ 平面中，这是以该点为顶点的三角形的底，它的边的斜率与波速相符。这个区间之外的数据还来不及到达。",
  ],
  (rng) => {
    const c = rng.int(1, 3);
    const x0 = rng.int(-3, 3);
    const t0 = rng.int(1, 3);
    const [lo, hi] = [x0 - c * t0, x0 + c * t0];
    const iv = (u: number, v: number) => same(`[${u}, ${v}]`);
    return choose(
      rng,
      [
        `For the wave equation with speed $c = ${c}$, on what interval of initial data does the value at the marked point $P$ depend?`,
        `对波速 $c = ${c}$ 的波动方程，所标点 $P$ 处的值依赖于哪个区间上的初始数据？`,
      ],
      iv(lo, hi),
      [iv(x0 - t0, x0 + t0), iv(x0 - 2 * c * t0, x0 + 2 * c * t0), iv(x0, hi), iv(lo, x0), iv(x0 - c, x0 + c)],
      [
        `The point is $(${x0}, ${t0})$. Going back along the two lines with speed $${c}$ for time $${t0}$ moves $${c * t0}$ each way, which reaches $${lo}$ and $${hi}$.`,
        `这个点是 $(${x0}, ${t0})$。沿速度为 $${c}$ 的两条线倒退时间 $${t0}$，各走 $${c * t0}$，到达 $${lo}$ 和 $${hi}$。`,
      ],
      fig(
        { xMin: -13, xMax: 13, yMin: -1, yMax: 5, labelEvery: 2, xName: "x", yName: "t" },
        [{ kind: "point", at: [x0, t0], label: "P", dir: "ne" }],
        [`The point P at (${x0}, ${t0}) in the xt-plane.`, `xt 平面上的点 P，坐标为 (${x0}, ${t0})。`],
      ),
    );
  },
);

const reflectedPulse = point(
  "a-pulse-after-a-drawn-reflection",
  ["A pulse after a drawn reflection", "图中脉冲反射之后"],
  [
    "A pulse travelling toward the end of a string reflects there. At a fixed end, the reflected pulse is upside down, and at a free end, it stays upright. In both cases it moves away at the same speed. Its position after a given time comes from the total distance travelled, including the part back from the end.",
    "向弦的端点传播的脉冲在那里反射。在固定端，反射脉冲倒过来；在自由端，它保持正立。两种情况下它都以相同的速度离开。一段时间后的位置由走过的总路程决定，包括从端点返回的部分。",
  ],
  (rng) => {
    const start = rng.int(2, 6);
    const c = rng.int(1, 2);
    const after = rng.int(1, 4);
    const time = (start + after) / c;
    const timeText = Number.isInteger(time) ? String(time) : Q.of(start + after, c).toLatex();
    const fixed = rng.bool();
    const h = rng.int(1, 3);
    const end: Pair = fixed ? ["fixed", "固定"] : ["free", "自由"];
    const option = (at: number, up: boolean): Pair => [
      `At $x = ${at}$, ${up ? "upright" : "upside down"}`,
      `在 $x = ${at}$，${up ? "正立" : "倒立"}`,
    ];
    return choose(
      rng,
      [
        `The pulse moves left at speed $c = ${c}$ along a string with a ${end[0]} end at $x = 0$. Where is the tip of the pulse at time $t = ${timeText}$, and which way up is it?`,
        `脉冲沿弦以速度 $c = ${c}$ 向左移动，弦在 $x = 0$ 处是${end[1]}端。在 $t = ${timeText}$ 时脉冲的尖端在哪里，方向如何？`,
      ],
      option(after, !fixed),
      [option(after, fixed), option(start + after, !fixed), option(after + 1, !fixed), option(start, !fixed)],
      [
        `The tip starts at $x = ${start}$ and travels $${start + after}$ in that time. It reaches the end after $${start}$ and comes back $${after}$. A ${end[0]} end leaves it ${fixed ? "upside down" : "upright"}.`,
        `尖端从 $x = ${start}$ 出发，在这段时间内走 $${start + after}$。走 $${start}$ 到达端点，再返回 $${after}$。${end[1]}端使它${fixed ? "倒立" : "正立"}。`,
      ],
      fig(
        { xMin: -1, xMax: 9, yMin: -4, yMax: 4, xName: "x" },
        [
          { kind: "curve", f: tent(start, 1, h), from: 0, to: 9, accent: true },
          { kind: "segment", a: [0, -4], b: [0, 4] },
          { kind: "arrow", from: [start, h + 0.5], to: [start - 1.5, h + 0.5], accent: true },
        ],
        [
          `A pulse of height ${h} with its tip at x = ${start}, moving left toward the end of the string at x = 0.`,
          `高度为 ${h} 的脉冲，尖端在 x = ${start}，向左朝 x = 0 处的弦端移动。`,
        ],
      ),
    );
  },
);

const modeFrequency = point(
  "the-frequency-of-a-drawn-mode",
  ["The frequency of a drawn mode", "图中模态的频率"],
  [
    "A string of length $L$ fixed at both ends vibrates in modes $\\sin(n\\pi x / L)$, each with angular frequency $n \\pi c / L$. In a drawing, $n$ is the number of half waves between the ends, which is one more than the number of interior points that stay still. Read $L$ and $n$ from the picture before using the formula.",
    "长度为 $L$、两端固定的弦以模态 $\\sin(n\\pi x / L)$ 振动，每个模态的角频率为 $n \\pi c / L$。在图中，$n$ 是两端之间半波的个数，比保持不动的内部点数多一。用公式之前先从图中读出 $L$ 和 $n$。",
  ],
  (rng) => {
    const n = rng.int(1, 5);
    const L = rng.int(2, 8);
    const c = rng.int(1, 3);
    const amp = rng.pick([1, 1.5, 2]);
    const omega = (m: number, length: number) => {
      const q = Q.of(m * c, length);
      const top = q.isInteger() ? q.toLatex() : "";
      return top !== "" ? (top === "1" ? "\\pi" : `${top}\\pi`) : `${q.toLatex()}\\pi`;
    };
    const right = omega(n, L);
    const others = [omega(n + 1, L), omega(n, 2 * L), omega(n === 1 ? 3 : n - 1, L), omega(2 * n, L), omega(n + 2, L)].filter(
      (o) => o !== right,
    );
    return choose(
      rng,
      [
        `The graph shows one mode of a string fixed at both ends, with wave speed $c = ${c}$. What is the angular frequency of this mode?`,
        `图中是两端固定的弦的一个模态，波速 $c = ${c}$。这个模态的角频率是多少？`,
      ],
      same(right),
      [...new Set(others)].map((o) => same(o)),
      [
        `The string runs from $0$ to $L = ${L}$ and shows $n = ${n}$ half waves. So the angular frequency is $n \\pi c / L$, which equals $${right}$.`,
        `弦从 $0$ 到 $L = ${L}$，有 $n = ${n}$ 个半波。所以角频率是 $n \\pi c / L$，等于 $${right}$。`,
      ],
      fig(
        { xMin: -1, xMax: 9, yMin: -3, yMax: 3, xName: "x" },
        [{ kind: "curve", f: (x) => amp * Math.sin((n * Math.PI * x) / L), from: 0, to: L, accent: true }],
        [`A sine shape from 0 to ${L} with ${n} half waves.`, `从 0 到 ${L} 的正弦形状，有 ${n} 个半波。`],
      ),
    );
  },
);

const heatCurves = point(
  "times-from-drawn-heat-kernels",
  ["Times from drawn heat kernels", "由图中热核读时间"],
  [
    "The heat kernel spreads a unit of heat over time. Its graph stays a bell shape with the same total area, so as time grows the peak gets lower and the curve gets wider. Comparing curves of the same mass therefore orders them by time: the tallest and narrowest is the earliest, and the lowest and widest is the latest.",
    "热核使一单位热量随时间扩散。它的图保持钟形，总面积不变，所以随时间增大，峰变低、曲线变宽。因此比较质量相同的曲线，就能按时间排序：最高最窄的最早，最低最宽的最晚。",
  ],
  (rng) => {
    const times = rng.pick([
      [0.15, 0.6, 2],
      [0.2, 0.8, 2.5],
      [0.1, 0.5, 1.5],
      [0.25, 1, 3],
    ]) as readonly [number, number, number];
    const center = rng.int(-3, 3);
    const names = rng.shuffle(["A", "B", "C"]);
    const latest = rng.bool();
    const curve = (s: number) => (x: number) => (5 * Math.exp(-((x - center) ** 2) / (4 * s))) / Math.sqrt(4 * Math.PI * s);
    const marks: PlaneMark[] = times.map((s, i): PlaneMark => ({ kind: "curve", f: curve(s), accent: i === 1, dashed: i === 2 }));
    times.forEach((s, i) => {
      const x = center + Math.sqrt(2 * s);
      marks.push({ kind: "label", at: [x, curve(s)(x)], text: names[i] as string, dir: "ne" });
    });
    const answer = (latest ? names[2] : names[0]) as string;
    return choose(
      rng,
      [
        `The curves show the same heat kernel at three times. Which curve is the ${latest ? "latest" : "earliest"}?`,
        `这些曲线表示同一个热核在三个时刻的图。哪条曲线是${latest ? "最晚" : "最早"}的？`,
      ],
      same(answer),
      names
        .filter((n) => n !== answer)
        .map((n): Pair => same(n))
        .concat([["They are all at the same time", "它们在同一时刻"]]),
      [
        `Heat spreads as time passes, so the peak falls and the curve widens. The curve $${answer}$ is the ${latest ? "lowest and widest" : "tallest and narrowest"}, which makes it the ${latest ? "latest" : "earliest"}.`,
        `热量随时间扩散，所以峰下降、曲线变宽。曲线 $${answer}$ 是${latest ? "最低最宽" : "最高最窄"}的，所以它是${latest ? "最晚" : "最早"}的。`,
      ],
      fig({ xMin: -7, xMax: 7, yMin: -1, yMax: 6 }, marks, [
        `Three bell curves centered at x = ${center}, from tallest to lowest: ${names.join(", ")}.`,
        `以 x = ${center} 为中心的三条钟形曲线，从最高到最低：${names.join("，")}。`,
      ]),
    );
  },
);

const heatMaximum = point(
  "a-heat-bound-from-the-initial-profile",
  ["A heat bound from the initial profile", "由初始温度分布给热方程定界"],
  [
    "The maximum principle for the heat equation says that the largest value on a bar over time occurs at the initial moment or at the ends. So with both ends kept at zero, a temperature later on can never exceed the highest initial temperature. Likewise, it can never fall below the lowest initial temperature, if that lowest value is negative.",
    "热方程的最大值原理说，杆上随时间的最大值出现在初始时刻或端点处。所以两端保持为零时，之后的温度决不会超过最高的初始温度。同样，如果最低初始温度为负，温度也决不会低于它。",
  ],
  (rng) => {
    const n = rng.int(5, 8);
    const h = [0, ...Array.from({ length: n - 1 }, () => rng.int(-3, 5)), 0];
    if (Math.max(...h) === 0) h[1] = 2;
    if (Math.min(...h) === 0) h[2] = -1;
    const upper = rng.bool();
    const value = upper ? Math.max(...h) : Math.min(...h);
    const other = upper ? Math.min(...h) : Math.max(...h);
    const sum = h.reduce((a, b) => a + b, 0);
    return ask(
      [
        upper
          ? "The graph shows the initial temperature of a bar whose ends stay at $0$. What is the smallest upper bound that the maximum principle gives for its temperature at later times?"
          : "The graph shows the initial temperature of a bar whose ends stay at $0$. What is the largest lower bound that the maximum principle gives for its temperature at later times?",
        upper
          ? "图中是两端保持为 $0$ 的杆的初始温度。最大值原理给出的之后温度的最小上界是多少？"
          : "图中是两端保持为 $0$ 的杆的初始温度。最大值原理给出的之后温度的最大下界是多少？",
      ],
      value,
      [other, sum === value ? value + 1 : sum, 0 === value ? value + 2 : 0],
      [
        `On the initial graph, the ${upper ? "highest" : "lowest"} point has height $${value}$, and the ends are at $0$. The principle says that the extreme values occur there, so the bound is $${value}$.`,
        `在初始图上，${upper ? "最高" : "最低"}点的高度是 $${value}$，两端为 $0$。原理说极值出现在那里，所以界是 $${value}$。`,
      ],
      fig(
        { xMin: -1, xMax: 9, yMin: -4, yMax: 6, xName: "x", yName: "u" },
        [{ kind: "path", points: h.map((v, i): Point => [i, v]), accent: true }],
        [`Straight pieces through the heights ${h.join(", ")}.`, `经过高度 ${h.join("，")} 的直线段。`],
      ),
    );
  },
);

/** squareFigure draws a square with a number written against each side. */
function squareFigure(top: number, right: number, bottom: number, left: number, inner = ""): string {
  const body = `<rect x="90" y="40" width="140" height="140" fill="none"/>${label(160, 28, text(top))}${label(250, 114, text(right))}${label(160, 202, text(bottom))}${label(66, 114, text(left))}${inner}`;
  return svgDocument(220, body);
}

const squareCenter = point(
  "the-center-of-a-drawn-square-plate",
  ["The center of a drawn square plate", "图中方板的中心"],
  [
    "A steady temperature on a square solves Laplace's equation. By superposition and symmetry, the center of a square whose sides are held at constant values has a temperature equal to the average of the four values. This follows because each side alone contributes one quarter of its own value at the center, whatever happens on the others.",
    "方板上的稳态温度满足拉普拉斯方程。由叠加和对称性，四边保持常值的方板，中心温度等于四个值的平均。这是因为每条边单独对中心的贡献都是它自身值的四分之一，与其他边无关。",
  ],
  (rng) => {
    const v = [rng.int(-20, 80), rng.int(-20, 80), rng.int(-20, 80), rng.int(-20, 80)].map((a) => a * 5) as [
      number,
      number,
      number,
      number,
    ];
    const sum = v[0] + v[1] + v[2] + v[3];
    const answer = Q.of(sum, 4);
    const diag = Q.of(v[0] + v[2], 2);
    return ask(
      [
        "The sides of the square plate are held at the temperatures shown, and the temperature inside is steady, so it solves Laplace's equation. What is the temperature at the center?",
        "方板各边保持图中所示的温度，内部温度是稳态的，所以满足拉普拉斯方程。中心温度是多少？",
      ],
      answer,
      [
        Q.of(sum, 1),
        diag.eq(answer) ? answer.add(Q.of(5, 1)) : diag,
        Q.of(Math.max(...v), 1).eq(answer) ? answer.add(Q.of(10, 1)) : Q.of(Math.max(...v), 1),
      ],
      [
        `By symmetry, each side contributes one quarter of its value at the center. The values shown add up to $${sum}$, so the center is at $${answer.toLatex()}$.`,
        `由对称性，每条边对中心的贡献是它的值的四分之一。图中的值之和为 $${sum}$，所以中心温度是 $${answer.toLatex()}$。`,
      ],
      {
        svg: squareFigure(...v),
        alt: t(
          `A square plate with side temperatures ${v.join(", ")}, from the top and going clockwise.`,
          `方板各边温度为 ${v.join("，")}，从上边开始按顺时针排列。`,
        ),
      },
    );
  },
);

const harmonicBound = point(
  "bounds-for-a-harmonic-function-on-a-drawn-disc",
  ["Bounds for a harmonic function on a drawn disc", "图中圆盘上调和函数的界"],
  [
    "The maximum principle says that a harmonic function on a bounded region takes its largest and smallest values on the boundary. So the boundary data alone bound the whole interior, and the size or the shape of the region does not matter. An interior value lies strictly between these bounds unless the function is constant.",
    "最大值原理说，有界区域上的调和函数在边界上取到最大值和最小值。所以仅凭边界数据就能界定整个内部，区域的大小和形状都无关紧要。除非函数是常数，内部的值严格位于这些界之间。",
  ],
  (rng) => {
    const n = rng.int(3, 6);
    const v = rng.sample(
      Array.from({ length: 19 }, (_, i) => i - 9),
      n,
    );
    const upper = rng.bool();
    const value = upper ? Math.max(...v) : Math.min(...v);
    const other = upper ? Math.min(...v) : Math.max(...v);
    const mean = v.reduce((a, b) => a + b, 0);
    const edge = (i: number) => (2 * Math.PI * i) / n - Math.PI / 2;
    const r = 80;
    let body = `<circle cx="160" cy="110" r="${r}" fill="none"/>`;
    v.forEach((value2, i) => {
      const [a, mid] = [edge(i), edge(i + 0.5)];
      body += `<line x1="${Math.round(160 + (r - 7) * Math.cos(a))}" y1="${Math.round(110 + (r - 7) * Math.sin(a))}" x2="${Math.round(160 + (r + 7) * Math.cos(a))}" y2="${Math.round(110 + (r + 7) * Math.sin(a))}"/>`;
      body += label(Math.round(160 + (r + 20) * Math.cos(mid)), Math.round(114 + (r + 20) * Math.sin(mid)), text(value2));
    });
    return ask(
      [
        upper
          ? "A function harmonic on the disc is continuous up to the boundary except at the ticks, which cut it into arcs held at the constant values shown. What is the smallest upper bound on its values?"
          : "A function harmonic on the disc is continuous up to the boundary except at the ticks, which cut it into arcs held at the constant values shown. What is the largest lower bound on its values?",
        upper
          ? "圆盘上的调和函数除刻度处外连续到边界，刻度把边界分成若干弧，各弧保持图中所示的常值。它的值的最小上界是多少？"
          : "圆盘上的调和函数除刻度处外连续到边界，刻度把边界分成若干弧，各弧保持图中所示的常值。它的值的最大下界是多少？",
      ],
      value,
      [other, mean === value ? value + 1 : mean, value + (upper ? 1 : -1)],
      [
        `Reading the boundary, the ${upper ? "largest" : "smallest"} value is $${value}$. The maximum principle says that no interior value goes past the boundary values, so this is the best bound.`,
        `读边界值，${upper ? "最大" : "最小"}的是 $${value}$。最大值原理说内部的值不会超出边界值，所以这是最好的界。`,
      ],
      {
        svg: svgDocument(220, body),
        alt: t(`A disc whose boundary arcs carry the values ${v.join(", ")}.`, `圆盘边界上各弧的值为 ${v.join("，")}。`),
      },
    );
  },
);

const stencilLaplace = point(
  "a-center-value-on-a-drawn-five-point-stencil",
  ["A center value on a drawn five-point stencil", "图中五点格式的中心值"],
  [
    "The finite difference form of Laplace's equation on a square grid sets each interior value to the average of its four neighbors. So the unknown value at a grid point can be computed directly from the neighbors shown. The corners of the grid do not enter the formula, because only the points directly above, below, left and right count.",
    "方形网格上拉普拉斯方程的有限差分形式把每个内部值设为四个邻点的平均。所以网格点上未知的值可以直接由图中的邻点算出。网格的角点不进入公式，因为只有正上、正下、正左和正右的点才算。",
  ],
  (rng) => {
    const grid = Array.from({ length: 9 }, () => rng.int(0, 30));
    const near = [grid[1] as number, grid[3] as number, grid[5] as number, grid[7] as number];
    const sum = near.reduce((a, b) => a + b, 0);
    const answer = Q.of(sum, 4);
    const all = Q.of(grid.reduce((a, b) => a + b, 0) - (grid[4] as number), 8);
    let body = "";
    grid.forEach((v, i) => {
      const [x, y] = [100 + 60 * (i % 3), 50 + 60 * Math.floor(i / 3)];
      if (i % 3 < 2) body += `<line x1="${x + 12}" y1="${y}" x2="${x + 48}" y2="${y}"/>`;
      if (i < 6) body += `<line x1="${x}" y1="${y + 12}" x2="${x}" y2="${y + 48}"/>`;
      body += node([x, y], i === 4 ? "?" : String(v));
    });
    return ask(
      [
        "The grid shows values of a discrete harmonic function, which satisfies the five-point stencil. What value belongs at the center?",
        "网格显示离散调和函数的值，它满足五点格式。中心应该是什么值？",
      ],
      answer,
      [
        all.eq(answer) ? answer.add(Q.of(1, 1)) : all,
        Q.of(sum, 1),
        Q.of(sum, 2),
        Q.of((grid[0] as number) + (grid[2] as number) + (grid[6] as number) + (grid[8] as number) + 1, 4),
      ],
      [
        `The four neighbors directly above, below, left and right are $${near.join(", ")}$, and they add up to $${sum}$. Dividing by four gives $${answer.toLatex()}$, and the corners play no part.`,
        `正上、正左、正右和正下的四个邻点是 $${near.join(", ")}$，和为 $${sum}$。除以四得 $${answer.toLatex()}$，角点不起作用。`,
      ],
      {
        svg: svgDocument(220, body),
        alt: t(
          `A 3 by 3 grid with rows ${grid[0]}, ${grid[1]}, ${grid[2]}; ${grid[3]}, ?, ${grid[5]}; ${grid[6]}, ${grid[7]}, ${grid[8]}.`,
          `3 乘 3 网格，各行为 ${grid[0]}，${grid[1]}，${grid[2]}；${grid[3]}，?，${grid[5]}；${grid[6]}，${grid[7]}，${grid[8]}。`,
        ),
      },
    );
  },
);

const explicitHeat = point(
  "one-step-of-the-heat-scheme-on-a-drawn-grid",
  ["One step of the heat scheme on a drawn grid", "在图中网格上走一步热方程格式"],
  [
    "The explicit scheme for the heat equation updates a point from three values in the row below it: the point itself and its neighbors on the left and right. The rule is $u_j^{n+1} = u_j^n + r(u_{j-1}^n - 2u_j^n + u_{j+1}^n)$, where $r$ is the mesh ratio. Other values in that row and in other rows do not enter.",
    "热方程的显式格式由下面一行的三个值更新一点：该点自身和它左右的邻点。规则是 $u_j^{n+1} = u_j^n + r(u_{j-1}^n - 2u_j^n + u_{j+1}^n)$，其中 $r$ 是网格比。那一行的其他值和其他行的值都不进入。",
  ],
  (rng) => {
    const row = Array.from({ length: 5 }, () => rng.int(0, 20));
    const j = rng.int(1, 3);
    const [den, numer] = rng.pick<Point>([
      [4, 1],
      [2, 1],
      [5, 1],
      [5, 2],
    ]);
    const r = Q.of(numer, den);
    const [l, m, u] = [row[j - 1] as number, row[j] as number, row[j + 1] as number];
    const answer = Q.of(m, 1).add(r.mul(Q.of(l - 2 * m + u, 1)));
    const x = (i: number) => 40 + 60 * i;
    let body = `<line x1="20" y1="150" x2="300" y2="150"/><line x1="20" y1="70" x2="300" y2="70"/>`;
    row.forEach((v, i) => {
      body += `<line x1="${x(i)}" y1="50" x2="${x(i)}" y2="170"/>${label(x(i) + 14, 142, String(v))}<circle cx="${x(i)}" cy="150" r="3" fill="currentColor"/><circle cx="${x(i)}" cy="70" r="3" fill="currentColor"/>`;
    });
    body += `<circle class="accent" cx="${x(j)}" cy="70" r="10" fill="none" stroke="currentColor" stroke-width="2.5"/>${label(x(j) + 16, 60, "?")}`;
    return ask(
      [
        `The lower row holds the values at the current time, and the circled point is in the next row. With mesh ratio $r = ${r.toLatex()}$, what value does the explicit scheme give there?`,
        `下面一行是当前时刻的值，圈出的点在下一行。网格比 $r = ${r.toLatex()}$ 时，显式格式在那里给出什么值？`,
      ],
      answer,
      [
        Q.of(m, 1).eq(answer) ? answer.add(Q.of(1, 1)) : Q.of(m, 1),
        Q.of(l + u, 2).eq(answer) ? answer.add(Q.of(2, 1)) : Q.of(l + u, 2),
        Q.of(m, 1).add(r.mul(Q.of(l + m + u, 1))),
        r.mul(Q.of(l - 2 * m + u, 1)).eq(answer) ? answer.add(Q.of(3, 1)) : r.mul(Q.of(l - 2 * m + u, 1)),
      ],
      [
        `The point below the circle has value $${m}$, with neighbors $${l}$ and $${u}$. So the new value is $${m} + ${r.toLatex()}(${l} - ${2 * m} + ${u}) = ${answer.toLatex()}$.`,
        `圈下方的点值为 $${m}$，邻点为 $${l}$ 和 $${u}$。所以新值为 $${m} + ${r.toLatex()}(${l} - ${2 * m} + ${u}) = ${answer.toLatex()}$。`,
      ],
      {
        svg: svgDocument(190, body),
        alt: t(
          `A row of values ${row.join(", ")} at the current time, with the point above position ${j + 1} circled.`,
          `当前时刻的一行值 ${row.join("，")}，第 ${j + 1} 个位置上方的点被圈出。`,
        ),
      },
    );
  },
);

const imageSource = point(
  "the-image-of-a-drawn-source",
  ["The image of a drawn source", "图中源的镜像"],
  [
    "The method of images replaces a wall by an extra source on the other side, placed at the mirror image of the real one. For a zero temperature on the wall, known as a Dirichlet condition, the image has the opposite sign. For an insulated wall, known as a Neumann condition, it has the same sign. Together they satisfy the wall condition.",
    "镜像法用墙另一侧的一个附加源代替墙，放在真实源的镜像位置。对于墙上温度为零，即狄利克雷条件，镜像符号相反。对于绝热墙，即诺伊曼条件，它符号相同。二者一起满足墙上的条件。",
  ],
  (rng) => {
    const w = rng.int(-2, 3);
    const vertical = rng.bool();
    const d = rng.nonZero(-4, 4);
    const other = rng.int(-4, 4);
    const dirichlet = rng.bool();
    const source: Point = vertical ? [w + d, other] : [other, w + d];
    const image: Point = vertical ? [w - d, other] : [other, w - d];
    const swapped: Point = vertical ? [w + d, -other === other ? other + 1 : -other] : [-other === other ? other + 1 : -other, w + d];
    const away: Point = vertical ? [w - 2 * d, other] : [other, w - 2 * d];
    const opt = (p: Point, positive: boolean): Pair => [
      `A ${positive ? "positive" : "negative"} source at $(${p[0]}, ${p[1]})$`,
      `位于 $(${p[0]}, ${p[1]})$ 的${positive ? "正" : "负"}源`,
    ];
    const kind: Pair = dirichlet ? ["held at zero", "温度保持为零"] : ["insulated", "绝热"];
    return choose(
      rng,
      [
        `A positive heat source is marked by $S$, and the thick line is a wall that is ${kind[0]}. What image source makes the wall condition hold?`,
        `$S$ 标出一个正热源，粗线是一堵墙，墙${kind[1]}。什么样的镜像源使墙上的条件成立？`,
      ],
      opt(image, !dirichlet),
      [opt(image, dirichlet), opt(swapped, !dirichlet), opt(away, !dirichlet), opt(source, dirichlet)],
      [
        `The image lies at the mirror position, $(${image[0]}, ${image[1]})$. A wall ${kind[0]} requires the image to have ${dirichlet ? "the opposite sign, so the two cancel on the wall" : "the same sign, so there is no flow across the wall"}.`,
        `镜像位于镜像位置 $(${image[0]}, ${image[1]})$。墙${kind[1]}要求镜像${dirichlet ? "符号相反，使二者在墙上抵消" : "符号相同，使没有热量穿过墙"}。`,
      ],
      fig(
        { xMin: -8, xMax: 8, yMin: -8, yMax: 8 },
        [
          vertical ? { kind: "segment", a: [w, -8], b: [w, 8], accent: true } : { kind: "segment", a: [-8, w], b: [8, w], accent: true },
          { kind: "point", at: source, label: "S", dir: "ne" },
        ],
        [
          `A wall along ${vertical ? "x" : "y"} = ${w} and a source S at (${source[0]}, ${source[1]}).`,
          `墙沿 ${vertical ? "x" : "y"} = ${w}，源 S 在 (${source[0]}, ${source[1]})。`,
        ],
      ),
    );
  },
);

/** deeperFiguresPartialDifferentialEquationsPoints adds knowledge points of Partial Differential Equations that are answered by reading a drawing. */
export const deeperFiguresPartialDifferentialEquationsPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "the-transport-equation": [transportSpeed],
  "the-method-of-characteristics": [valueAlongCharacteristic],
  "nonlinear-transport-and-shocks": [burgersPicture],
  "dalemberts-formula": [dAlembertValue],
  "domains-of-dependence": [domainFromPoint],
  "reflection-at-a-boundary": [reflectedPulse],
  "the-wave-equation-on-a-finite-string": [modeFrequency],
  "the-heat-kernel": [heatCurves],
  "the-maximum-principle-for-heat": [heatMaximum],
  "laplaces-equation-in-a-rectangle-and-a-disc": [squareCenter],
  "the-maximum-principle-for-harmonic-functions": [harmonicBound],
  "finite-differences-for-laplaces-equation": [stencilLaplace],
  "finite-differences-for-the-heat-equation": [explicitHeat],
  "the-method-of-images": [imageSource],
};
