// Knowledge points of Partial Differential Equations that ask the learner to read a drawing: characteristics, wave
// profiles and grids. See `deeperFiguresPartialDifferentialEquationsPoints`.

import type { KnowledgePointDef } from "@ga/content";
import { t } from "@ga/content";
import type { PlaneMark, PlaneView, Point } from "@ga/subject-math";
import { Q, svgDocument } from "@ga/subject-math";
import { pdeDrawings1 } from "../explanation-drawings-partial-differential-equations-1.ts";

import { type Pair, point, same } from "../university-kit.ts";
import { drawn, label, node } from "./figure-reading-more.ts";
import { chosen, type Miss, type Slip, until, worked } from "./number-theory-course.ts";

/** wrap puts a negative number in parentheses, so that it can follow an operation sign. */
const wrap = (n: number): string => (n < 0 ? `(${n})` : `${n}`);
/** plus writes a signed number as a term that follows another, as in "+ 3" or "- 3". */
const plus = (n: number): string => (n < 0 ? `- ${-n}` : `+ ${n}`);
/** paren writes a rational, in parentheses unless it is a whole number that is not negative. */
const paren = (q: Q): string => (q.d === 1n && q.cmp(Q.zero) >= 0 ? q.toLatex() : `\\left(${q.toLatex()}\\right)`);
/** settle writes p over q, followed by its value in lowest terms when that reads differently. */
const settle = (p: number, q: number, value: Q): string => {
  const raw = q === 1 ? `${p}` : p < 0 ? `-\\frac{${-p}}{${q}}` : `\\frac{${p}}{${q}}`;
  return raw === value.toLatex() ? raw : `${raw} = ${value.toLatex()}`;
};
/** keep drops the slips whose option repeats the right one or an earlier slip. */
const keep = (right: Pair, slips: readonly Slip[]): Slip[] => {
  const seen = new Set([right[0]]);
  return slips.filter(([option]) => !seen.has(option[0]) && Boolean(seen.add(option[0])));
};

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
    "The transport equation $u_t + c u_x = 0$ moves any initial profile at constant speed $c$ without changing its shape. So comparing two profiles gives $c$ as the displacement divided by the elapsed time. A profile that moved to the left corresponds to a negative value of $c$, and the time matters as much as the distance does. For example, if the tip moves from $x = -2$ at $t = 0$ to $x = 4$ at $t = 3$, then $c = \\frac{4 - (-2)}{3} = 2$.\n\nCheck: the solution is $u = f(x - 2t)$, whose tip sits where $x - 2t = -2$, which at $t = 3$ is $x = 4$.\n\n> **Watch out.** Divide the displacement by the elapsed time and keep its sign; a profile that moved to the left has a negative $c$.",
    "输运方程 $u_t + c u_x = 0$ 使任何初始形状以常速度 $c$ 移动，形状不变。所以比较两个形状，$c$ 等于位移除以经过的时间。形状向左移动对应负的 $c$，时间和距离同样重要。例如，若尖端在 $t = 0$ 时位于 $x = -2$，在 $t = 3$ 时位于 $x = 4$，则 $c = \\frac{4 - (-2)}{3} = 2$。\n\n检验：解是 $u = f(x - 2t)$，尖端位于 $x - 2t = -2$ 处，在 $t = 3$ 时即 $x = 4$。\n\n> **注意。** 位移要除以经过的时间，并保留符号；向左移动的形状对应负的 $c$。",
  ],
  (rng) =>
    until(() => {
      const c0 = rng.int(-6, 6);
      const shift = rng.nonZero(-8, 8);
      const c1 = c0 + shift > 7 || c0 + shift < -7 ? c0 - shift : c0 + shift;
      const moved = c1 - c0;
      const T = rng.pick([1, 2, 3, 4]);
      const speed = Q.of(moved, T);
      const h = rng.int(2, 4);
      const misses: Miss[] = [
        [speed.neg(), "That has the wrong sign; read which way the dashed graph moved.", "那符号反了；要看虚线向哪边移动。"],
        [Q.of(moved), "That forgets to divide by the time.", "那忘了除以时间。"],
        [Q.of(T, moved), "That divides the time by the displacement.", "那用时间除以位移。"],
        [Q.of(moved * T), "That multiplies the displacement by the time.", "那把位移乘以时间。"],
      ];
      return worked(
        [
          `The solid graph is a solution of $u_t + c u_x = 0$ at time $t = 0$, and the dashed graph is the same solution at $t = ${T}$. What is $c$?`,
          `实线是 $u_t + c u_x = 0$ 的解在 $t = 0$ 时的图，虚线是同一个解在 $t = ${T}$ 时的图。$c$ 是多少？`,
        ],
        speed,
        misses,
        [
          [
            ["Read the tips", "读尖端"],
            [
              `The tip moves from $x = ${c0}$ to $x = ${c1}$, a displacement of $${c1} - ${wrap(c0)} = ${moved}$.`,
              `尖端从 $x = ${c0}$ 移到 $x = ${c1}$，位移为 $${c1} - ${wrap(c0)} = ${moved}$。`,
            ],
          ],
          [
            ["Divide by the time", "除以时间"],
            [`So $c = ${settle(moved, T, speed)}$.`, `所以 $c = ${settle(moved, T, speed)}$。`],
          ],
        ],
        [
          `With this $c$, the tip moves to $${c0} + ${paren(speed)} \\cdot ${T} = ${c1}$ by $t = ${T}$, where the dashed graph has it.`,
          `用这个 $c$，到 $t = ${T}$ 时尖端移到 $${c0} + ${paren(speed)} \\cdot ${T} = ${c1}$，正是虚线尖端的位置。`,
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
    }),
);

const valueAlongCharacteristic = point(
  "a-value-carried-along-a-characteristic",
  ["A value carried along a characteristic", "沿特征线携带的值"],
  [
    "For a first-order linear equation, the solution keeps its value along each characteristic line. So to find $u$ at a point of the $xt$-plane, follow the characteristic through that point back to the $x$-axis and read where it lands. The value at the point equals the initial value at the foot of the line. For example, if the characteristic through $P = (5, 2)$ lands at $x = 1$ and $u(x, 0) = 3x - 2$, then $u(P) = 3 \\cdot 1 - 2 = 1$.\n\nCheck: the line from $(1, 0)$ to $(5, 2)$ moves $4$ in $x$ over $2$ in $t$, the drift $2$ of the equation $u_t + 2u_x = 0$, so it is indeed a characteristic.\n\n> **Watch out.** Put the foot of the line into the initial data, not the $x$-coordinate of the point itself; here $3 \\cdot 5 - 2 = 13$ would be wrong.",
    "对一阶线性方程，解沿每条特征线保持不变。所以要求 $xt$ 平面上一点的 $u$，就沿经过该点的特征线回到 $x$ 轴，读出落点。该点的值等于这条线的底部处的初值。例如，若经过 $P = (5, 2)$ 的特征线落在 $x = 1$，且 $u(x, 0) = 3x - 2$，则 $u(P) = 3 \\cdot 1 - 2 = 1$。\n\n检验：从 $(1, 0)$ 到 $(5, 2)$ 的线在 $t$ 方向走 $2$ 时 $x$ 方向走 $4$，正是方程 $u_t + 2u_x = 0$ 的漂移速度 $2$，所以它确实是特征线。\n\n> **注意。** 代入初始数据的是线的底部，而不是该点自身的 $x$ 坐标；这里 $3 \\cdot 5 - 2 = 13$ 是错的。",
  ],
  (rng) =>
    until(() => {
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
      const misses: Miss[] = [
        [
          g(P[0]),
          "That puts the $x$-coordinate of $P$ into the data, not the foot of its line.",
          "那把 $P$ 的 $x$ 坐标代入数据，而不是它的线的底部。",
        ],
        [g(foot + 1), "That reads the foot one unit too far to the right.", "那把底部读得向右偏了一格。"],
        [g(foot - 1), "That reads the foot one unit too far to the left.", "那把底部读得向左偏了一格。"],
        [g(time), "That puts the time into the data instead of a position.", "那把时间代入数据，而不是位置。"],
      ];
      return worked(
        [
          `The lines are the characteristics of a linear transport equation, and $u(x, 0) = ${gTex}$. What is $u$ at the marked point $P$?`,
          `这些直线是某线性输运方程的特征线，$u(x, 0) = ${gTex}$。$u$ 在所标点 $P$ 处的值是多少？`,
        ],
        g(foot),
        misses,
        [
          [
            ["Follow the line back", "沿线回溯"],
            [
              `The highlighted line through $P = (${P[0]}, ${P[1]})$ meets the $x$-axis at $x = ${foot}$, and the solution is constant along it.`,
              `经过 $P = (${P[0]}, ${P[1]})$ 的突出显示的线与 $x$ 轴交于 $x = ${foot}$，解沿它不变。`,
            ],
          ],
          [
            ["Read the initial value", "读初值"],
            [
              `So $u(P) = u(${foot}, 0) = ${a} \\cdot ${wrap(foot)}${b === 0 ? "" : ` ${plus(b)}`} = ${g(foot)}$.`,
              `所以 $u(P) = u(${foot}, 0) = ${a} \\cdot ${wrap(foot)}${b === 0 ? "" : ` ${plus(b)}`} = ${g(foot)}$。`,
            ],
          ],
        ],
        [
          `From $(${foot}, 0)$ to $P$ the line moves $${P[0] - foot}$ in $x$ over $${time}$ in $t$, the same drift $${speed}$ per unit of time as every other line in the picture, so it is the characteristic through $P$.`,
          `从 $(${foot}, 0)$ 到 $P$，这条线在 $t$ 方向走 $${time}$ 时 $x$ 方向走 $${P[0] - foot}$，与图中其他每条线一样，每单位时间漂移 $${speed}$，所以它就是经过 $P$ 的特征线。`,
        ],
        fig(
          { xMin: -10, xMax: 10, yMin: -1, yMax: 6, labelEvery: 2, xName: "x", yName: "t" },
          [...lines, { kind: "point", at: P, label: "P", dir: "e" }],
          [
            `Parallel characteristic lines in the xt-plane, with P at (${P[0]}, ${P[1]}).`,
            `xt 平面上平行的特征线，P 在 (${P[0]}, ${P[1]})。`,
          ],
        ),
      );
    }),
);

const burgersPicture = point(
  "shock-or-fan-from-the-characteristics",
  ["Shock or fan from the characteristics", "由特征线判断激波或稀疏波"],
  [
    "For Burgers' equation, a characteristic starting where $u$ has a given value moves with speed equal to that value. Faster characteristics behind slower ones collide, which forms a shock whose speed is the average of the two states. Faster characteristics ahead of slower ones spread apart, and the gap fills with a rarefaction fan. For example, with $u = 2$ on the left and $u = 0$ on the right, the left lines have $\\frac{dx}{dt} = 2$ and run into the vertical right lines, forming a shock of speed $\\frac{2 + 0}{2} = 1$.\n\nCheck: the jump condition for the flux $\\frac{u^{2}}{2}$ gives the speed $\\frac{2 - 0}{2 - 0} = 1$, the same.\n\n> **Watch out.** A shock needs the faster lines behind, on the left; when the lines on the right are faster, they spread apart into a fan, and no shock forms.",
    "对伯格斯方程，从 $u$ 取某值之处出发的特征线以等于该值的速度移动。慢的特征线在前、快的在后时会相撞，形成激波，其速度是两个状态的平均。快的在前、慢的在后时特征线散开，空隙由稀疏扇填满。例如，左边 $u = 2$，右边 $u = 0$ 时，左边的线有 $\\frac{dx}{dt} = 2$，撞上右边竖直的线，形成速度为 $\\frac{2 + 0}{2} = 1$ 的激波。\n\n检验：对通量 $\\frac{u^{2}}{2}$，跳跃条件给出速度 $\\frac{2 - 0}{2 - 0} = 1$，结果相同。\n\n> **注意。** 激波需要快的线在后面，即在左边；右边的线更快时，它们散开成稀疏扇，不形成激波。",
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
    const shockAt = (v: Q | number): Pair => {
      const s = typeof v === "number" ? `${v}` : v.toLatex();
      return [`A shock moving with speed $${s}$`, `以速度 $${s}$ 移动的激波`];
    };
    const fan: Pair = ["A rarefaction fan from the jump", "从跳跃处发出的稀疏扇"];
    const slips: Slip[] = shock
      ? [
          [fan, "The left lines are faster, so they collide instead of spreading apart.", "左边的线更快，所以它们相撞，而不是散开。"],
          [
            shockAt(Q.of(a - b, 2)),
            "That halves the difference of the states; the speed is their average.",
            "那取了两个状态之差的一半；速度是它们的平均。",
          ],
          [shockAt(a), "That is the left state alone; the shock moves at the average of both.", "那只是左状态；激波以两者的平均速度移动。"],
          [
            shockAt(b),
            "That is the right state alone; the shock moves at the average of both.",
            "那只是右状态；激波以两者的平均速度移动。",
          ],
        ]
      : [
          [shockAt(speed), "The right lines are faster, so they move away and nothing collides.", "右边的线更快，所以它们远离，没有相撞。"],
          [shockAt(b), "No shock forms, because the faster lines are ahead.", "不会形成激波，因为快的线在前面。"],
          [shockAt(a), "No shock forms, because the faster lines are ahead.", "不会形成激波，因为快的线在前面。"],
          [
            ["A stationary jump", "静止的跳跃"],
            "A jump stays put only when the lines meet it from both sides with opposite speeds; here they spread apart.",
            "跳跃只有在两侧的线以相反速度汇向它时才保持不动；这里线是散开的。",
          ],
        ];
    return chosen(
      rng,
      [
        "The solid and dashed lines are the characteristics of Burgers' equation $u_t + u u_x = 0$ with one jump in the initial data, each line having $dx/dt$ equal to the state it carries. What develops at the jump for $t > 0$?",
        "实线和虚线是伯格斯方程 $u_t + u u_x = 0$ 在初始数据有一个跳跃时的特征线，每条线的 $dx/dt$ 等于它携带的状态。$t > 0$ 时在跳跃处形成什么？",
      ],
      right,
      keep(right, slips),
      [
        [
          ["Read the states", "读状态"],
          [
            `Each line moves with $\\frac{dx}{dt}$ equal to its state: the solid lines on the left move $${a * 2}$ in time $2$, so the left state is $${a}$, and the dashed lines on the right move $${b * 2}$, so the right state is $${b}$.`,
            `每条线的 $\\frac{dx}{dt}$ 等于它的状态：左边的实线在时间 $2$ 内走 $${a * 2}$，所以左状态是 $${a}$；右边的虚线走 $${b * 2}$，所以右状态是 $${b}$。`,
          ],
        ],
        [
          ["Compare the speeds", "比较速度"],
          shock
            ? [
                `The left lines are faster, so they run into the right lines and form a shock, whose speed is the average, $\\frac{${a} + ${wrap(b)}}{2} = ${speed.toLatex()}$.`,
                `左边的线更快，所以撞上右边的线形成激波，速度是平均值 $\\frac{${a} + ${wrap(b)}}{2} = ${speed.toLatex()}$。`,
              ]
            : [
                "The right lines are faster, so the lines spread apart near the jump and the gap between them fills with a fan.",
                "右边的线更快，所以线在跳跃附近散开，它们之间的空隙由稀疏扇填满。",
              ],
        ],
      ],
      shock
        ? [
            `The jump condition for the flux $\\frac{u^{2}}{2}$ gives the speed $\\frac{${Q.of(a * a, 2).toLatex()} - ${Q.of(b * b, 2).toLatex()}}{${a} - ${wrap(b)}} = ${speed.toLatex()}$, the same.`,
            `对通量 $\\frac{u^{2}}{2}$，跳跃条件给出速度 $\\frac{${Q.of(a * a, 2).toLatex()} - ${Q.of(b * b, 2).toLatex()}}{${a} - ${wrap(b)}} = ${speed.toLatex()}$，结果相同。`,
          ]
        : [
            `The fan's lines leave the jump with every speed from $${a}$ to $${b}$, so they fill the wedge between the two families exactly, leaving no gap and no crossing.`,
            `稀疏扇的线以从 $${a}$ 到 $${b}$ 的每个速度离开跳跃处，恰好填满两族线之间的楔形区域，既无空隙也不交叉。`,
          ],
      fig({ xMin: -11, xMax: 11, yMin: -1, yMax: 4, labelEvery: 2, xName: "x", yName: "t" }, lines, [
        "Solid characteristic lines to the left of the jump and dashed ones to the right of it.",
        "跳跃左边是实线的特征线，右边是虚线的特征线。",
      ]),
    );
  },
);

const dAlembertValue = {
  ...point(
    "dalembert-from-a-drawn-initial-shape",
    ["d'Alembert from a drawn initial shape", "由图中初始形状用达朗贝尔公式"],
    [
      "With zero initial velocity, d'Alembert's formula splits the initial shape into two halves, moving left and right at speed $c$: $u(x, t) = \\frac{1}{2}[f(x - ct) + f(x + ct)]$. To evaluate it from a graph, read the heights of $f$ at the two points $x - ct$ and $x + ct$, and average them. For example, in the figure an initial tent of height $2$ on $[-1, 1]$ with $c = 1$ gives $u(2, 2) = \\frac{f(0) + f(4)}{2} = \\frac{2 + 0}{2} = 1$.\n\nCheck: at $t = 2$ the figure shows two halves of height $1$ centered at $-2$ and $2$, so the height at $x = 2$ is indeed $1$.\n\n> **Watch out.** Average the two heights rather than adding them, and read $f$ at $x - ct$ and $x + ct$, not at $x$ itself.",
      "初速度为零时，达朗贝尔公式把初始形状分成两半，以速度 $c$ 分别向左和向右移动：$u(x, t) = \\frac{1}{2}[f(x - ct) + f(x + ct)]$。要从图上求值，就读出 $f$ 在 $x - ct$ 和 $x + ct$ 两点的高度，再取平均。例如，图中 $[-1, 1]$ 上高为 $2$ 的初始帐篷形，$c = 1$，得 $u(2, 2) = \\frac{f(0) + f(4)}{2} = \\frac{2 + 0}{2} = 1$。\n\n检验：图中 $t = 2$ 时有两个高为 $1$ 的半形，中心在 $-2$ 和 $2$，所以 $x = 2$ 处的高度确实是 $1$。\n\n> **注意。** 两个高度要取平均，而不是相加；而且要在 $x - ct$ 和 $x + ct$ 处读 $f$，而不是在 $x$ 处。",
    ],
    (rng) =>
      until(() => {
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
        const ctTex = Q.of(j - i, 2).toLatex();
        const middle = 2 * f(x0.toNumber());
        const misses: Miss[] = [
          [Q.of(fl + fr), "That adds the two heights instead of averaging them.", "那把两个高度相加，而不是取平均。"],
          [Q.of(fl), "That reads only the height at $x - ct$.", "那只读了 $x - ct$ 处的高度。"],
          [Q.of(fr), "That reads only the height at $x + ct$.", "那只读了 $x + ct$ 处的高度。"],
          ...(Number.isInteger(middle)
            ? [
                [
                  Q.of(middle, 2),
                  "That reads $f$ at $x$ itself, as if the shape had not moved.",
                  "那在 $x$ 处读 $f$，好像形状没有移动。",
                ] as Miss,
              ]
            : []),
        ];
        return worked(
          [
            `The graph shows the initial shape $f$ of a string, released from rest, with wave speed $c = ${c}$. What is $u(${x0.toLatex()}, ${timeTex})$?`,
            `图中是从静止释放的弦的初始形状 $f$，波速 $c = ${c}$。$u(${x0.toLatex()}, ${timeTex})$ 是多少？`,
          ],
          answer,
          misses,
          [
            [
              ["Find the two points", "找两点"],
              [
                `Here $ct = ${ctTex}$, so the points to read are $${x0.toLatex()} - ${ctTex} = ${i}$ and $${x0.toLatex()} + ${ctTex} = ${j}$.`,
                `这里 $ct = ${ctTex}$，所以要读的点是 $${x0.toLatex()} - ${ctTex} = ${i}$ 和 $${x0.toLatex()} + ${ctTex} = ${j}$。`,
              ],
            ],
            [
              ["Read and average", "读值并平均"],
              [
                `The graph has heights $f(${i}) = ${fl}$ and $f(${j}) = ${fr}$, so $u = \\frac{${fl} + ${fr}}{2} = ${answer.toLatex()}$.`,
                `图在那里的高度是 $f(${i}) = ${fl}$ 和 $f(${j}) = ${fr}$，所以 $u = \\frac{${fl} + ${fr}}{2} = ${answer.toLatex()}$。`,
              ],
            ],
          ],
          fl === fr
            ? [
                `Both points are corners of the graph at the same height $${fl}$, so their average is that height, $${answer.toLatex()}$.`,
                `两点都是图的拐角，高度都是 $${fl}$，所以平均值就是这个高度 $${answer.toLatex()}$。`,
              ]
            : [
                `Both points are corners of the graph, so their heights are exact, and $${answer.toLatex()}$ lies between $${Math.min(fl, fr)}$ and $${Math.max(fl, fr)}$, as an average must.`,
                `两点都是图的拐角，所以高度是精确的，而 $${answer.toLatex()}$ 位于 $${Math.min(fl, fr)}$ 和 $${Math.max(fl, fr)}$ 之间，平均值理应如此。`,
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
      }),
  ),
  figure: pdeDrawings1["dalemberts-formula#dalembert-from-a-drawn-initial-shape"],
};

const domainFromPoint = {
  ...point(
    "the-domain-of-dependence-of-a-marked-point",
    ["The domain of dependence of a marked point", "所标点的依赖域"],
    [
      "The value of a wave at a point $(x_0, t_0)$ depends only on the initial data on the interval from $x_0 - c t_0$ to $x_0 + c t_0$. In the $xt$-plane this is the base of a triangle with its top at the point, whose sides have slopes matching the wave speed. Data outside this interval has not had time to arrive. For example, in the figure $c = 1$ and the point is $(3, 2)$, so its value depends only on the data from $3 - 2 = 1$ to $3 + 2 = 5$, the base of the shaded triangle.\n\nCheck: the sides of the triangle run from $(1, 0)$ and $(5, 0)$ up to $(3, 2)$, each moving $2$ in $x$ over $2$ in $t$, which is the speed $c = 1$.\n\n> **Watch out.** Multiply the time by $c$ before going left and right; with $c = 2$ the interval would be twice as wide.",
      "波在点 $(x_0, t_0)$ 处的值只取决于从 $x_0 - c t_0$ 到 $x_0 + c t_0$ 区间上的初始数据。在 $xt$ 平面中，这是以该点为顶点的三角形的底，它的边的斜率与波速相符。这个区间之外的数据还来不及到达。例如，图中 $c = 1$，点是 $(3, 2)$，所以它的值只依赖从 $3 - 2 = 1$ 到 $3 + 2 = 5$ 的数据，即阴影三角形的底。\n\n检验：三角形的两边从 $(1, 0)$ 和 $(5, 0)$ 升到 $(3, 2)$，在 $t$ 方向走 $2$ 时 $x$ 方向各走 $2$，正是速度 $c = 1$。\n\n> **注意。** 时间要先乘 $c$，再向左右延伸；$c = 2$ 时区间会宽一倍。",
    ],
    (rng) => {
      const c = rng.int(1, 3);
      const x0 = rng.int(-3, 3);
      const t0 = rng.int(1, 3);
      const [lo, hi] = [x0 - c * t0, x0 + c * t0];
      const iv = (u: number, v: number) => same(`[${u}, ${v}]`);
      const right = iv(lo, hi);
      const slips: Slip[] = [
        [iv(x0 - t0, x0 + t0), "That forgets to multiply the time by $c$.", "那忘了把时间乘以 $c$。"],
        [
          iv(x0 - 2 * c * t0, x0 + 2 * c * t0),
          "That goes $2ct$ each way; each side moves only $ct$.",
          "那向两边各走了 $2ct$；每边只走 $ct$。",
        ],
        [iv(x0, hi), "That keeps only the right half; data from both sides arrives.", "那只保留了右半部分；两边的数据都会到达。"],
        [iv(lo, x0), "That keeps only the left half; data from both sides arrives.", "那只保留了左半部分；两边的数据都会到达。"],
        [iv(x0 - c, x0 + c), "That uses $c$ without multiplying by the time.", "那用了 $c$，没有乘以时间。"],
      ];
      return chosen(
        rng,
        [
          `For the wave equation with speed $c = ${c}$, on what interval of initial data does the value at the marked point $P$ depend?`,
          `对波速 $c = ${c}$ 的波动方程，所标点 $P$ 处的值依赖于哪个区间上的初始数据？`,
        ],
        right,
        keep(right, slips),
        [
          [
            ["Read the point", "读点"],
            [
              `The point is $(${x0}, ${t0})$, so going back to $t = 0$ takes time $${t0}$, in which each characteristic moves $${c} \\cdot ${t0} = ${c * t0}$.`,
              `这个点是 $(${x0}, ${t0})$，所以回到 $t = 0$ 要经过时间 $${t0}$，每条特征线在这段时间内移动 $${c} \\cdot ${t0} = ${c * t0}$。`,
            ],
          ],
          [
            ["Go left and right", "向左右延伸"],
            [
              `The two characteristics reach $${x0} - ${c * t0} = ${lo}$ and $${x0} + ${c * t0} = ${hi}$, so the interval is $[${lo}, ${hi}]$.`,
              `两条特征线到达 $${x0} - ${c * t0} = ${lo}$ 和 $${x0} + ${c * t0} = ${hi}$，所以区间是 $[${lo}, ${hi}]$。`,
            ],
          ],
        ],
        [
          `The interval has length $${hi - lo} = 2 \\cdot ${c * t0}$ and is centered at $${x0}$, right below $P$, as the base of the triangle under $P$ must be.`,
          `区间长 $${hi - lo} = 2 \\cdot ${c * t0}$，中心在 $${x0}$，正好在 $P$ 的下方，$P$ 下方三角形的底理应如此。`,
        ],
        fig(
          { xMin: -13, xMax: 13, yMin: -1, yMax: 5, labelEvery: 2, xName: "x", yName: "t" },
          [{ kind: "point", at: [x0, t0], label: "P", dir: "ne" }],
          [`The point P at (${x0}, ${t0}) in the xt-plane.`, `xt 平面上的点 P，坐标为 (${x0}, ${t0})。`],
        ),
      );
    },
  ),
  figure: pdeDrawings1["domains-of-dependence#the-domain-of-dependence-of-a-marked-point"],
};

const reflectedPulse = {
  ...point(
    "a-pulse-after-a-drawn-reflection",
    ["A pulse after a drawn reflection", "图中脉冲反射之后"],
    [
      "A pulse travelling toward the end of a string reflects there. At a fixed end, the reflected pulse is upside down, and at a free end, it stays upright. In both cases it moves away at the same speed. Its position after a given time comes from the total distance travelled, including the part back from the end. For example, in the figure a pulse centered at $x = 4$ moves right at speed $1$ toward a fixed end at $x = 6$. In time $5$ it travels $5$: $2$ to reach the end and $3$ back, so it is centered at $x = 3$, upside down.\n\nCheck: the total distance $2 + 3 = 5$ equals the speed times the time, $1 \\cdot 5$.\n\n> **Watch out.** Count the distance back from the end, not past it; and only a fixed end turns the pulse over, a free end keeps it upright.",
      "向弦的端点传播的脉冲在那里反射。在固定端，反射脉冲倒过来；在自由端，它保持正立。两种情况下它都以相同的速度离开。一段时间后的位置由走过的总路程决定，包括从端点返回的部分。例如，图中中心在 $x = 4$ 的脉冲以速度 $1$ 向右朝 $x = 6$ 处的固定端移动。在时间 $5$ 内它走 $5$：走 $2$ 到达端点，再返回 $3$，所以中心在 $x = 3$，倒立。\n\n检验：总路程 $2 + 3 = 5$ 等于速度乘时间 $1 \\cdot 5$。\n\n> **注意。** 要从端点往回算距离，而不是越过端点；只有固定端使脉冲翻转，自由端使它保持正立。",
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
      const right = option(after, !fixed);
      const slips: Slip[] = [
        [
          option(after, fixed),
          fixed ? "A fixed end turns the pulse upside down." : "A free end keeps the pulse upright.",
          fixed ? "固定端使脉冲倒过来。" : "自由端使脉冲保持正立。",
        ],
        [
          option(start + after, !fixed),
          "That gives the total distance travelled, not the position.",
          "那给出的是走过的总路程，而不是位置。",
        ],
        [option(after + 1, !fixed), "That counts one unit too many on the way back.", "那在返回时多算了一格。"],
        [option(start, !fixed), "That is where the pulse started.", "那是脉冲出发的位置。"],
      ];
      return chosen(
        rng,
        [
          `The pulse moves left at speed $c = ${c}$ along a string with a ${end[0]} end at $x = 0$. Where is the tip of the pulse at time $t = ${timeText}$, and which way up is it?`,
          `脉冲沿弦以速度 $c = ${c}$ 向左移动，弦在 $x = 0$ 处是${end[1]}端。在 $t = ${timeText}$ 时脉冲的尖端在哪里，方向如何？`,
        ],
        right,
        keep(right, slips),
        [
          [
            ["Find the distance", "求路程"],
            [
              `The tip starts at $x = ${start}$ and travels $${c} \\cdot ${timeText} = ${start + after}$ in that time.`,
              `尖端从 $x = ${start}$ 出发，在这段时间内走 $${c} \\cdot ${timeText} = ${start + after}$。`,
            ],
          ],
          [
            ["Reflect at the end", "在端点反射"],
            [
              `It reaches the end after $${start}$ and comes back $${start + after} - ${start} = ${after}$, to $x = ${after}$. A ${end[0]} end leaves it ${fixed ? "upside down" : "upright"}.`,
              `它走 $${start}$ 到达端点，再返回 $${start + after} - ${start} = ${after}$，到 $x = ${after}$。${end[1]}端使它${fixed ? "倒立" : "正立"}。`,
            ],
          ],
        ],
        [
          `The distance to the end and back, $${start} + ${after} = ${start + after}$, equals the speed $${c}$ times the time $${timeText}$.`,
          `到端点再返回的路程 $${start} + ${after} = ${start + after}$，等于速度 $${c}$ 乘时间 $${timeText}$。`,
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
  ),
  figure: pdeDrawings1["reflection-at-a-boundary#a-pulse-after-a-drawn-reflection"],
};

const modeFrequency = point(
  "the-frequency-of-a-drawn-mode",
  ["The frequency of a drawn mode", "图中模态的频率"],
  [
    "A string of length $L$ fixed at both ends vibrates in modes $\\sin(n\\pi x / L)$, each with angular frequency $n \\pi c / L$. In a drawing, $n$ is the number of half waves between the ends, which is one more than the number of interior points that stay still. Read $L$ and $n$ from the picture before using the formula. For example, a string of length $4$ showing $2$ half waves, with $c = 3$, has $\\omega = \\frac{2 \\cdot 3\\pi}{4} = \\frac{3\\pi}{2}$.\n\nCheck: that picture has $1$ interior point at rest, at $x = 2$, one fewer than the $2$ half waves.\n\n> **Watch out.** Count half waves, not full waves, and read $L$ from where the string ends, not from the width of the axis.",
    "长度为 $L$、两端固定的弦以模态 $\\sin(n\\pi x / L)$ 振动，每个模态的角频率为 $n \\pi c / L$。在图中，$n$ 是两端之间半波的个数，比保持不动的内部点数多一。用公式之前先从图中读出 $L$ 和 $n$。例如，长为 $4$、有 $2$ 个半波的弦，$c = 3$，有 $\\omega = \\frac{2 \\cdot 3\\pi}{4} = \\frac{3\\pi}{2}$。\n\n检验：那张图有 $1$ 个保持不动的内部点，在 $x = 2$，比 $2$ 个半波少一。\n\n> **注意。** 要数半波而不是整波，而且 $L$ 要从弦的终点读出，而不是从坐标轴的宽度读出。",
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
    const right = same(omega(n, L));
    const slips: Slip[] = [
      [same(omega(n + 1, L)), "That counts one half wave too many.", "那多数了一个半波。"],
      [same(omega(n, 2 * L)), "That doubles the length of the string.", "那把弦长加倍了。"],
      n === 1
        ? [same(omega(3, L)), "That reads the single hump as three half waves.", "那把一个拱读成了三个半波。"]
        : [
            same(omega(n - 1, L)),
            "That counts the interior points at rest instead of the half waves.",
            "那数的是保持不动的内部点，而不是半波。",
          ],
      [same(omega(2 * n, L)), "That counts each half wave twice.", "那把每个半波数了两次。"],
      [same(omega(n + 2, L)), "That counts two half waves too many.", "那多数了两个半波。"],
    ];
    const rest = Array.from({ length: n - 1 }, (_, k) => Q.of(L * (k + 1), n).toLatex());
    return chosen(
      rng,
      [
        `The graph shows one mode of a string fixed at both ends, with wave speed $c = ${c}$. What is the angular frequency of this mode?`,
        `图中是两端固定的弦的一个模态，波速 $c = ${c}$。这个模态的角频率是多少？`,
      ],
      right,
      keep(right, slips),
      [
        [
          ["Read the picture", "读图"],
          [
            `The string runs from $0$ to $L = ${L}$ and shows $n = ${n}$ half ${n === 1 ? "wave" : "waves"}.`,
            `弦从 $0$ 到 $L = ${L}$，有 $n = ${n}$ 个半波。`,
          ],
        ],
        [
          ["Use the formula", "用公式"],
          [
            `The angular frequency is $\\frac{n\\pi c}{L} = \\frac{${n} \\cdot ${c === 1 ? "" : c}\\pi}{${L}} = ${omega(n, L)}$.`,
            `角频率是 $\\frac{n\\pi c}{L} = \\frac{${n} \\cdot ${c === 1 ? "" : c}\\pi}{${L}} = ${omega(n, L)}$。`,
          ],
        ],
      ],
      n === 1
        ? [
            "With one half wave, the string is at rest only at its two ends, as the picture shows.",
            "只有一个半波时，弦只在两端保持不动，与图一致。",
          ]
        : [
            `With $${n}$ half waves, the string is at rest at $x = ${rest.join(", ")}$ between its ends, $${n - 1}$ ${n === 2 ? "point" : "points"}, one fewer than $n$, as the picture shows.`,
            `有 $${n}$ 个半波时，弦在两端之间的 $x = ${rest.join(", ")}$ 处保持不动，共 $${n - 1}$ 个点，比 $n$ 少一，与图一致。`,
          ],
      fig(
        { xMin: -1, xMax: 9, yMin: -3, yMax: 3, xName: "x" },
        [{ kind: "curve", f: (x) => amp * Math.sin((n * Math.PI * x) / L), from: 0, to: L, accent: true }],
        [`A sine shape from 0 to ${L} with ${n} half waves.`, `从 0 到 ${L} 的正弦形状，有 ${n} 个半波。`],
      ),
    );
  },
);

const heatCurves = {
  ...point(
    "times-from-drawn-heat-kernels",
    ["Times from drawn heat kernels", "由图中热核读时间"],
    [
      "The heat kernel spreads a unit of heat over time. Its graph stays a bell shape with the same total area, so as time grows the peak gets lower and the curve gets wider. Comparing curves of the same mass therefore orders them by time: the tallest and narrowest is the earliest, and the lowest and widest is the latest. For example, the figure shows the kernel at $t = \\frac{1}{4}$, $1$ and $4$, with peaks of about $0.56$, $0.28$ and $0.14$, so each fourfold increase in time halves the peak.\n\nCheck: the peak is $\\frac{1}{\\sqrt{4\\pi t}}$, which at $t = 1$ is $\\frac{1}{\\sqrt{4\\pi}} \\approx 0.28$, as drawn.\n\n> **Watch out.** The tallest curve is the earliest, not the latest; heat only spreads out, so the peak can only fall as time goes on.",
      "热核使一单位热量随时间扩散。它的图保持钟形，总面积不变，所以随时间增大，峰变低、曲线变宽。因此比较质量相同的曲线，就能按时间排序：最高最窄的最早，最低最宽的最晚。例如，图中是 $t = \\frac{1}{4}$、$1$、$4$ 时的热核，峰高约为 $0.56$、$0.28$、$0.14$，所以时间每变为四倍，峰高减半。\n\n检验：峰高是 $\\frac{1}{\\sqrt{4\\pi t}}$，在 $t = 1$ 时为 $\\frac{1}{\\sqrt{4\\pi}} \\approx 0.28$，与图一致。\n\n> **注意。** 最高的曲线是最早的，而不是最晚的；热量只会扩散，所以峰高只会随时间下降。",
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
      const opposite = (latest ? names[0] : names[2]) as string;
      const middle = names[1] as string;
      const slips: Slip[] = [
        [
          same(opposite),
          latest ? "That is the tallest curve, which is the earliest." : "That is the lowest curve, which is the latest.",
          latest ? "那是最高的曲线，它是最早的。" : "那是最低的曲线，它是最晚的。",
        ],
        [same(middle), "That is the middle curve, neither the tallest nor the lowest.", "那是中间的曲线，既不是最高的也不是最低的。"],
        [
          ["They are all at the same time", "它们在同一时刻"],
          "The same kernel at one time gives one curve; different heights mean different times.",
          "同一热核在同一时刻只有一条曲线；高度不同说明时刻不同。",
        ],
      ];
      return chosen(
        rng,
        [
          `The curves show the same heat kernel at three times. Which curve is the ${latest ? "latest" : "earliest"}?`,
          `这些曲线表示同一个热核在三个时刻的图。哪条曲线是${latest ? "最晚" : "最早"}的？`,
        ],
        same(answer),
        slips,
        [
          [
            ["Compare the peaks", "比较峰"],
            [
              `From tallest and narrowest to lowest and widest, the curves are $${names[0]}$, $${middle}$ and $${names[2]}$.`,
              `从最高最窄到最低最宽，曲线依次是 $${names[0]}$、$${middle}$、$${names[2]}$。`,
            ],
          ],
          [
            ["Order them in time", "按时间排序"],
            [
              `Heat spreads as time passes, so the peak falls and the curve widens. The curve $${answer}$ is the ${latest ? "lowest and widest" : "tallest and narrowest"}, which makes it the ${latest ? "latest" : "earliest"}.`,
              `热量随时间扩散，所以峰下降、曲线变宽。曲线 $${answer}$ 是${latest ? "最低最宽" : "最高最窄"}的，所以它是${latest ? "最晚" : "最早"}的。`,
            ],
          ],
        ],
        [
          "The peak is proportional to $\\frac{1}{\\sqrt{t}}$ and the width to $\\sqrt{t}$, so height and width put the curves in the same order, and the area under each stays the same.",
          "峰高与 $\\frac{1}{\\sqrt{t}}$ 成正比，宽度与 $\\sqrt{t}$ 成正比，所以按高度和按宽度排出的顺序相同，而每条曲线下的面积不变。",
        ],
        fig({ xMin: -7, xMax: 7, yMin: -1, yMax: 6 }, marks, [
          `Three bell curves centered at x = ${center}, labelled ${[...names].sort().join(", ")}.`,
          `以 x = ${center} 为中心的三条钟形曲线，标为 ${[...names].sort().join("，")}。`,
        ]),
      );
    },
  ),
  figure: pdeDrawings1["the-heat-kernel#times-from-drawn-heat-kernels"],
};

const heatMaximum = point(
  "a-heat-bound-from-the-initial-profile",
  ["A heat bound from the initial profile", "由初始温度分布给热方程定界"],
  [
    "The maximum principle for the heat equation says that the largest value on a bar over time occurs at the initial moment or at the ends. So with both ends kept at zero, a temperature later on can never exceed the highest initial temperature. Likewise, it can never fall below the lowest initial temperature, if that lowest value is negative. For example, a bar with initial temperatures $0, 4, -2, 1, 0$ along its length stays between $-2$ and $4$ at all later times.\n\nCheck: the ends stay at $0$, and $-2 \\le 0 \\le 4$, so the ends add no value beyond the initial extremes.\n\n> **Watch out.** The bound is the extreme initial value itself; the sum of the values, or the extreme on the other side, is no bound at all.",
    "热方程的最大值原理说，杆上随时间的最大值出现在初始时刻或端点处。所以两端保持为零时，之后的温度决不会超过最高的初始温度。同样，如果最低初始温度为负，温度也决不会低于它。例如，初始温度沿杆为 $0, 4, -2, 1, 0$ 的杆，之后任何时刻都在 $-2$ 和 $4$ 之间。\n\n检验：两端保持为 $0$，而 $-2 \\le 0 \\le 4$，所以端点不会带来超出初始极值的值。\n\n> **注意。** 界就是初始极值本身；各值之和或另一侧的极值都不是界。",
  ],
  (rng) =>
    until(() => {
      const n = rng.int(5, 8);
      const h = [0, ...Array.from({ length: n - 1 }, () => rng.int(-3, 5)), 0];
      if (Math.max(...h) === 0) h[1] = 2;
      if (Math.min(...h) === 0) h[2] = -1;
      const upper = rng.bool();
      const value = upper ? Math.max(...h) : Math.min(...h);
      const other = upper ? Math.min(...h) : Math.max(...h);
      const sum = h.reduce((a, b) => a + b, 0);
      const [low, high] = [Math.min(...h), Math.max(...h)];
      const misses: Miss[] = [
        [other, "That is the extreme on the other side.", "那是另一侧的极值。"],
        [sum, "That adds the heights; the bound is a single extreme value.", "那把高度相加了；界是单个极值。"],
        [0, "That uses only the ends, which are not the extreme values here.", "那只用了端点，而这里端点不是极值。"],
        [
          value + (upper ? 1 : -1),
          "That is a bound, but not the best one; the initial temperature already reaches the extreme.",
          "那是一个界，但不是最好的；初始温度已经达到极值。",
        ],
      ];
      return worked(
        [
          upper
            ? "The graph shows the initial temperature of a bar whose ends stay at $0$. What is the smallest upper bound that the maximum principle gives for its temperature at later times?"
            : "The graph shows the initial temperature of a bar whose ends stay at $0$. What is the largest lower bound that the maximum principle gives for its temperature at later times?",
          upper
            ? "图中是两端保持为 $0$ 的杆的初始温度。最大值原理给出的之后温度的最小上界是多少？"
            : "图中是两端保持为 $0$ 的杆的初始温度。最大值原理给出的之后温度的最大下界是多少？",
        ],
        value,
        misses,
        [
          [
            ["Read the graph", "读图"],
            [
              `On the initial graph, the highest point has height $${high}$ and the lowest $${low}$, and the ends are at $0$.`,
              `在初始图上，最高点的高度是 $${high}$，最低点是 $${low}$，两端为 $0$。`,
            ],
          ],
          [
            ["Apply the principle", "用最大值原理"],
            [
              `The ${upper ? "largest" : "smallest"} value over time occurs initially or at the ends, so the bound is $${value}$.`,
              `随时间的${upper ? "最大" : "最小"}值出现在初始时刻或端点处，所以界是 $${value}$。`,
            ],
          ],
        ],
        [
          `Since $${low} \\le 0 \\le ${high}$, the ends never go past the initial extremes, so the bound comes from the initial graph alone, and it is reached at $t = 0$.`,
          `因为 $${low} \\le 0 \\le ${high}$，端点不会超出初始极值，所以界只由初始图决定，并且在 $t = 0$ 时达到。`,
        ],
        fig(
          { xMin: -1, xMax: 9, yMin: -4, yMax: 6, xName: "x", yName: "u" },
          [{ kind: "path", points: h.map((v, i): Point => [i, v]), accent: true }],
          [`Straight pieces through the heights ${h.join(", ")}.`, `经过高度 ${h.join("，")} 的直线段。`],
        ),
      );
    }),
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
    "A steady temperature on a square solves Laplace's equation. By superposition and symmetry, the center of a square whose sides are held at constant values has a temperature equal to the average of the four values. This follows because each side alone contributes one quarter of its own value at the center, whatever happens on the others. For example, sides held at $100$, $0$, $0$ and $0$ give the center $\\frac{100}{4} = 25$.\n\nCheck: rotating that plate four times and adding gives a plate held at $100$ on every side, which is at $100$ everywhere, and each of the four rotations contributes the same $25$ at the center.\n\n> **Watch out.** Divide the sum of all four sides by four; averaging only two opposite sides, or taking the hottest side, gives the wrong center.",
    "方板上的稳态温度满足拉普拉斯方程。由叠加和对称性，四边保持常值的方板，中心温度等于四个值的平均。这是因为每条边单独对中心的贡献都是它自身值的四分之一，与其他边无关。例如，四边保持 $100$、$0$、$0$、$0$ 时，中心温度是 $\\frac{100}{4} = 25$。\n\n检验：把这块板旋转四次再相加，得到四边都是 $100$ 的板，它处处为 $100$，而四次旋转在中心的贡献都是 $25$。\n\n> **注意。** 要把四条边的值之和除以四；只平均两条对边，或取最热的边，都会得到错误的中心值。",
  ],
  (rng) =>
    until(() => {
      const v = [rng.int(-20, 80), rng.int(-20, 80), rng.int(-20, 80), rng.int(-20, 80)].map((a) => a * 5) as [
        number,
        number,
        number,
        number,
      ];
      const sum = v[0] + v[1] + v[2] + v[3];
      const answer = Q.of(sum, 4);
      const misses: Miss[] = [
        [Q.of(sum), "That forgets to divide by four.", "那忘了除以四。"],
        [Q.of(v[0] + v[2], 2), "That averages only the top and bottom sides.", "那只平均了上下两边。"],
        [Q.of(v[1] + v[3], 2), "That averages only the left and right sides.", "那只平均了左右两边。"],
        [Q.of(Math.max(...v)), "That takes the hottest side; every side counts equally.", "那取了最热的边；每条边作用相同。"],
      ];
      const gaps = v.map((x) => Q.of(x).sub(answer));
      return worked(
        [
          "The sides of the square plate are held at the temperatures shown, and the temperature inside is steady, so it solves Laplace's equation. What is the temperature at the center?",
          "方板各边保持图中所示的温度，内部温度是稳态的，所以满足拉普拉斯方程。中心温度是多少？",
        ],
        answer,
        misses,
        [
          [
            ["Add the sides", "把各边相加"],
            [
              `The four values add up to $${v[0]} ${plus(v[1])} ${plus(v[2])} ${plus(v[3])} = ${sum}$.`,
              `四个值之和为 $${v[0]} ${plus(v[1])} ${plus(v[2])} ${plus(v[3])} = ${sum}$。`,
            ],
          ],
          [
            ["Divide by four", "除以四"],
            [
              `By symmetry each side contributes a quarter of its value at the center, so the center is at $${settle(sum, 4, answer)}$.`,
              `由对称性，每条边对中心的贡献是它的值的四分之一，所以中心温度是 $${settle(sum, 4, answer)}$。`,
            ],
          ],
        ],
        [
          `The sides differ from $${answer.toLatex()}$ by $${gaps.map((g) => g.toLatex()).join(", ")}$, which add up to $0$, as the differences from an average must.`,
          `各边与 $${answer.toLatex()}$ 之差为 $${gaps.map((g) => g.toLatex()).join(", ")}$，和为 $0$，与平均值之差理应如此。`,
        ],
        {
          svg: squareFigure(...v),
          alt: t(
            `A square plate with side temperatures ${v.join(", ")}, from the top and going clockwise.`,
            `方板各边温度为 ${v.join("，")}，从上边开始按顺时针排列。`,
          ),
        },
      );
    }),
);

const harmonicBound = point(
  "bounds-for-a-harmonic-function-on-a-drawn-disc",
  ["Bounds for a harmonic function on a drawn disc", "图中圆盘上调和函数的界"],
  [
    "The maximum principle says that a harmonic function on a bounded region takes its largest and smallest values on the boundary. So the boundary data alone bound the whole interior, and the size or the shape of the region does not matter. An interior value lies strictly between these bounds unless the function is constant. For example, if three equal arcs of a disc carry $-3$, $5$ and $1$, every interior value lies strictly between $-3$ and $5$.\n\nCheck: the value at the center is the average over the circle, $\\frac{-3 + 5 + 1}{3} = 1$, which does lie between $-3$ and $5$.\n\n> **Watch out.** The bounds are the extreme boundary values, not their average or their sum, and they hold however large the disc is.",
    "最大值原理说，有界区域上的调和函数在边界上取到最大值和最小值。所以仅凭边界数据就能界定整个内部，区域的大小和形状都无关紧要。除非函数是常数，内部的值严格位于这些界之间。例如，若圆盘边界的三段等长弧上的值为 $-3$、$5$、$1$，则每个内部值都严格位于 $-3$ 和 $5$ 之间。\n\n检验：圆心处的值是圆周上的平均值 $\\frac{-3 + 5 + 1}{3} = 1$，确实位于 $-3$ 和 $5$ 之间。\n\n> **注意。** 界是边界值的极值，而不是它们的平均值或和；而且无论圆盘多大，这些界都成立。",
  ],
  (rng) =>
    until(() => {
      const n = rng.int(3, 6);
      const v = rng.sample(
        Array.from({ length: 19 }, (_, i) => i - 9),
        n,
      );
      const upper = rng.bool();
      const value = upper ? Math.max(...v) : Math.min(...v);
      const other = upper ? Math.min(...v) : Math.max(...v);
      const total = v.reduce((a, b) => a + b, 0);
      const mean = Q.of(total, n);
      const misses: Miss[] = [
        [other, "That is the bound on the other side.", "那是另一侧的界。"],
        [mean, "That averages the arcs, which gives the value at the center, not a bound.", "那把各弧平均，得到的是圆心的值，不是界。"],
        [total, "That adds the values of the arcs.", "那把各弧的值相加了。"],
        [
          value + (upper ? 1 : -1),
          `That is a bound, but not the best one; the values come as close to $${value}$ as you like near that arc.`,
          `那是一个界，但不是最好的；在那段弧附近，值可以任意接近 $${value}$。`,
        ],
      ];
      const edge = (i: number) => (2 * Math.PI * i) / n - Math.PI / 2;
      const r = 80;
      let body = `<circle cx="160" cy="110" r="${r}" fill="none"/>`;
      v.forEach((value2, i) => {
        const [a, mid] = [edge(i), edge(i + 0.5)];
        body += `<line x1="${Math.round(160 + (r - 7) * Math.cos(a))}" y1="${Math.round(110 + (r - 7) * Math.sin(a))}" x2="${Math.round(160 + (r + 7) * Math.cos(a))}" y2="${Math.round(110 + (r + 7) * Math.sin(a))}"/>`;
        body += label(Math.round(160 + (r + 20) * Math.cos(mid)), Math.round(114 + (r + 20) * Math.sin(mid)), text(value2));
      });
      return worked(
        [
          upper
            ? "A function harmonic on the disc is continuous up to the boundary except at the ticks, which cut it into arcs held at the constant values shown. What is the smallest upper bound on its values?"
            : "A function harmonic on the disc is continuous up to the boundary except at the ticks, which cut it into arcs held at the constant values shown. What is the largest lower bound on its values?",
          upper
            ? "圆盘上的调和函数除刻度处外连续到边界，刻度把边界分成若干弧，各弧保持图中所示的常值。它的值的最小上界是多少？"
            : "圆盘上的调和函数除刻度处外连续到边界，刻度把边界分成若干弧，各弧保持图中所示的常值。它的值的最大下界是多少？",
        ],
        value,
        misses,
        [
          [
            ["Read the arcs", "读各弧"],
            [
              `The arcs carry $${v.join(", ")}$, so the ${upper ? "largest" : "smallest"} boundary value is $${value}$.`,
              `各弧的值为 $${v.join(", ")}$，所以边界上${upper ? "最大" : "最小"}的值是 $${value}$。`,
            ],
          ],
          [
            ["Apply the principle", "用最大值原理"],
            [
              `No interior value goes past the boundary values, and near that arc the values come as close to $${value}$ as you like, so the best bound is $${value}$.`,
              `内部的值不会超出边界值，而在那段弧附近值可以任意接近 $${value}$，所以最好的界是 $${value}$。`,
            ],
          ],
        ],
        [
          `The arcs are equal, so the value at the center is their average, $${mean.toLatex()}$, which lies between $${Math.min(...v)}$ and $${Math.max(...v)}$, as the principle requires.`,
          `各弧等长，所以圆心处的值是它们的平均值 $${mean.toLatex()}$，位于 $${Math.min(...v)}$ 和 $${Math.max(...v)}$ 之间，符合最大值原理。`,
        ],
        {
          svg: svgDocument(220, body),
          alt: t(`A disc whose boundary arcs carry the values ${v.join(", ")}.`, `圆盘边界上各弧的值为 ${v.join("，")}。`),
        },
      );
    }),
);

const stencilLaplace = point(
  "a-center-value-on-a-drawn-five-point-stencil",
  ["A center value on a drawn five-point stencil", "图中五点格式的中心值"],
  [
    "The finite difference form of Laplace's equation on a square grid sets each interior value to the average of its four neighbors. So the unknown value at a grid point can be computed directly from the neighbors shown. The corners of the grid do not enter the formula, because only the points directly above, below, left and right count. For example, neighbors $10$, $20$, $30$ and $0$ give the center $\\frac{10 + 20 + 30 + 0}{4} = 15$.\n\nCheck: $4 \\cdot 15 - 10 - 20 - 30 - 0 = 0$, so the five-point Laplacian vanishes at the center.\n\n> **Watch out.** Use only the four points directly above, below, left and right, and divide by four; the corners do not count.",
    "方形网格上拉普拉斯方程的有限差分形式把每个内部值设为四个邻点的平均。所以网格点上未知的值可以直接由图中的邻点算出。网格的角点不进入公式，因为只有正上、正下、正左和正右的点才算。例如，邻点为 $10$、$20$、$30$、$0$ 时，中心值是 $\\frac{10 + 20 + 30 + 0}{4} = 15$。\n\n检验：$4 \\cdot 15 - 10 - 20 - 30 - 0 = 0$，所以五点拉普拉斯算子在中心为零。\n\n> **注意。** 只用正上、正下、正左和正右的四个点，并除以四；角点不算。",
  ],
  (rng) =>
    until(() => {
      const grid = Array.from({ length: 9 }, () => rng.int(0, 30));
      const near = [grid[1] as number, grid[3] as number, grid[5] as number, grid[7] as number];
      const sum = near.reduce((a, b) => a + b, 0);
      const answer = Q.of(sum, 4);
      const all = Q.of(grid.reduce((a, b) => a + b, 0) - (grid[4] as number), 8);
      const corners = (grid[0] as number) + (grid[2] as number) + (grid[6] as number) + (grid[8] as number);
      let body = "";
      grid.forEach((v, i) => {
        const [x, y] = [100 + 60 * (i % 3), 50 + 60 * Math.floor(i / 3)];
        if (i % 3 < 2) body += `<line x1="${x + 12}" y1="${y}" x2="${x + 48}" y2="${y}"/>`;
        if (i < 6) body += `<line x1="${x}" y1="${y + 12}" x2="${x}" y2="${y + 48}"/>`;
        body += node([x, y], i === 4 ? "?" : String(v));
      });
      const misses: Miss[] = [
        [all, "That averages all eight surrounding points; the corners do not count.", "那平均了周围全部八个点；角点不算。"],
        [Q.of(sum), "That forgets to divide by four.", "那忘了除以四。"],
        [Q.of(sum, 2), "That divides by two instead of four.", "那除以了二，而不是四。"],
        [Q.of(corners, 4), "That averages the corners instead of the four neighbors.", "那平均的是角点，而不是四个邻点。"],
      ];
      return worked(
        [
          "The grid shows values of a discrete harmonic function, which satisfies the five-point stencil. What value belongs at the center?",
          "网格显示离散调和函数的值，它满足五点格式。中心应该是什么值？",
        ],
        answer,
        misses,
        [
          [
            ["Pick the neighbors", "选邻点"],
            [
              `The four neighbors directly above, left, right and below are $${near.join(", ")}$; the corners play no part.`,
              `正上、正左、正右和正下的四个邻点是 $${near.join(", ")}$；角点不起作用。`,
            ],
          ],
          [
            ["Average them", "取平均"],
            [
              `They add up to $${sum}$, so the center is $${settle(sum, 4, answer)}$.`,
              `它们的和为 $${sum}$，所以中心值是 $${settle(sum, 4, answer)}$。`,
            ],
          ],
        ],
        [
          `$4 \\cdot ${paren(answer)} - ${sum} = 0$, so the five-point Laplacian vanishes at the center.`,
          `$4 \\cdot ${paren(answer)} - ${sum} = 0$，所以五点拉普拉斯算子在中心为零。`,
        ],
        {
          svg: svgDocument(220, body),
          alt: t(
            `A 3 by 3 grid with rows ${grid[0]}, ${grid[1]}, ${grid[2]}; ${grid[3]}, ?, ${grid[5]}; ${grid[6]}, ${grid[7]}, ${grid[8]}.`,
            `3 乘 3 网格，各行为 ${grid[0]}，${grid[1]}，${grid[2]}；${grid[3]}，?，${grid[5]}；${grid[6]}，${grid[7]}，${grid[8]}。`,
          ),
        },
      );
    }),
);

const explicitHeat = point(
  "one-step-of-the-heat-scheme-on-a-drawn-grid",
  ["One step of the heat scheme on a drawn grid", "在图中网格上走一步热方程格式"],
  [
    "The explicit scheme for the heat equation updates a point from three values in the row below it: the point itself and its neighbors on the left and right. The rule is $u_j^{n+1} = u_j^n + r(u_{j-1}^n - 2u_j^n + u_{j+1}^n)$, where $r$ is the mesh ratio. Other values in that row and in other rows do not enter. For example, with $r = \\frac{1}{4}$, the value $4$ at the point and the neighbors $8$ on the left and $12$ on the right, the new value is $4 + \\frac{1}{4}(8 - 8 + 12) = 7$.\n\nCheck: the same rule reads $\\frac{1}{4} \\cdot 8 + \\frac{1}{2} \\cdot 4 + \\frac{1}{4} \\cdot 12 = 2 + 2 + 3 = 7$, a weighted average of the three values.\n\n> **Watch out.** The middle value enters with $-2u_j^n$ inside the bracket and again as $u_j^n$ in front; leaving out either one gives the wrong update.",
    "热方程的显式格式由下面一行的三个值更新一点：该点自身和它左右的邻点。规则是 $u_j^{n+1} = u_j^n + r(u_{j-1}^n - 2u_j^n + u_{j+1}^n)$，其中 $r$ 是网格比。那一行的其他值和其他行的值都不进入。例如，$r = \\frac{1}{4}$，该点的值为 $4$，左邻点为 $8$，右邻点为 $12$ 时，新值为 $4 + \\frac{1}{4}(8 - 8 + 12) = 7$。\n\n检验：同一规则可写成 $\\frac{1}{4} \\cdot 8 + \\frac{1}{2} \\cdot 4 + \\frac{1}{4} \\cdot 12 = 2 + 2 + 3 = 7$，是三个值的加权平均。\n\n> **注意。** 中间的值在括号里以 $-2u_j^n$ 出现，在前面又以 $u_j^n$ 出现；漏掉任何一处都会得到错误的更新。",
  ],
  (rng) =>
    until(() => {
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
      const bracket = l - 2 * m + u;
      const answer = Q.of(m).add(r.mul(Q.of(bracket)));
      const x = (i: number) => 40 + 60 * i;
      let body = `<line x1="20" y1="150" x2="300" y2="150"/><line x1="20" y1="70" x2="300" y2="70"/>`;
      row.forEach((v, i) => {
        body += `<line x1="${x(i)}" y1="50" x2="${x(i)}" y2="170"/>${label(x(i) + 14, 142, String(v))}<circle cx="${x(i)}" cy="150" r="3" fill="currentColor"/><circle cx="${x(i)}" cy="70" r="3" fill="currentColor"/>`;
      });
      body += `<circle class="accent" cx="${x(j)}" cy="70" r="10" fill="none" stroke="currentColor" stroke-width="2.5"/>${label(x(j) + 16, 60, "?")}`;
      const misses: Miss[] = [
        [Q.of(m), "That leaves the value unchanged; the scheme adds $r$ times the bracket.", "那让值保持不变；格式要加上 $r$ 乘括号。"],
        [Q.of(l + u, 2), "That averages the two neighbors and ignores the point itself.", "那平均了两个邻点，忽略了该点自身。"],
        [
          Q.of(m).add(r.mul(Q.of(l + m + u))),
          "That adds the middle value in the bracket instead of subtracting twice it.",
          "那在括号里加上了中间的值，而不是减去它的两倍。",
        ],
        [r.mul(Q.of(bracket)), "That forgets to add the current value $u_j^n$.", "那忘了加上当前值 $u_j^n$。"],
      ];
      const centre = Q.one.sub(r.mul(Q.of(2)));
      const [low, high] = [Math.min(l, m, u), Math.max(l, m, u)];
      return worked(
        [
          `The lower row holds the values at the current time, and the circled point is in the next row. With mesh ratio $r = ${r.toLatex()}$, what value does the explicit scheme give there?`,
          `下面一行是当前时刻的值，圈出的点在下一行。网格比 $r = ${r.toLatex()}$ 时，显式格式在那里给出什么值？`,
        ],
        answer,
        misses,
        [
          [
            ["Read the three values", "读三个值"],
            [
              `The point below the circle has value $${m}$, with neighbors $${l}$ and $${u}$, so the bracket is $${l} - ${2 * m} + ${u} = ${bracket}$.`,
              `圈下方的点值为 $${m}$，邻点为 $${l}$ 和 $${u}$，所以括号等于 $${l} - ${2 * m} + ${u} = ${bracket}$。`,
            ],
          ],
          [
            ["Apply the rule", "用规则"],
            [
              `The new value is $${m} + ${r.toLatex()} \\cdot ${wrap(bracket)} = ${answer.toLatex()}$.`,
              `新值为 $${m} + ${r.toLatex()} \\cdot ${wrap(bracket)} = ${answer.toLatex()}$。`,
            ],
          ],
        ],
        [
          `The same rule reads $${r.toLatex()} \\cdot ${l} + ${centre.toLatex()} \\cdot ${m} + ${r.toLatex()} \\cdot ${u} = ${answer.toLatex()}$, a weighted average since $r \\le \\frac{1}{2}$, and it lies between $${low}$ and $${high}$.`,
          `同一规则可写成 $${r.toLatex()} \\cdot ${l} + ${centre.toLatex()} \\cdot ${m} + ${r.toLatex()} \\cdot ${u} = ${answer.toLatex()}$，因为 $r \\le \\frac{1}{2}$，这是加权平均，它位于 $${low}$ 和 $${high}$ 之间。`,
        ],
        {
          svg: svgDocument(190, body),
          alt: t(
            `A row of values ${row.join(", ")} at the current time, with the point above position ${j + 1} circled.`,
            `当前时刻的一行值 ${row.join("，")}，第 ${j + 1} 个位置上方的点被圈出。`,
          ),
        },
      );
    }),
);

const imageSource = point(
  "the-image-of-a-drawn-source",
  ["The image of a drawn source", "图中源的镜像"],
  [
    "The method of images replaces a wall by an extra source on the other side, placed at the mirror image of the real one. For a zero temperature on the wall, known as a Dirichlet condition, the image has the opposite sign. For an insulated wall, known as a Neumann condition, it has the same sign. Together they satisfy the wall condition. For example, a positive source at $(3, 1)$ with a wall along $x = 1$ held at zero needs a negative image at $(-1, 1)$.\n\nCheck: every point $(1, y)$ of the wall is equally far from $(3, 1)$ and from $(-1, 1)$, so the two sources cancel there.\n\n> **Watch out.** Reflect only the coordinate across the wall and keep the other one; and the sign flips only for a wall held at zero, not for an insulated one.",
    "镜像法用墙另一侧的一个附加源代替墙，放在真实源的镜像位置。对于墙上温度为零，即狄利克雷条件，镜像符号相反。对于绝热墙，即诺伊曼条件，它符号相同。二者一起满足墙上的条件。例如，$(3, 1)$ 处的正源，墙沿 $x = 1$ 且温度保持为零，需要 $(-1, 1)$ 处的负镜像。\n\n检验：墙上每一点 $(1, y)$ 到 $(3, 1)$ 和 $(-1, 1)$ 的距离相等，所以两个源在那里抵消。\n\n> **注意。** 只反射垂直于墙的那个坐标，另一个坐标不变；只有温度保持为零的墙才使符号翻转，绝热墙不会。",
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
    const right = opt(image, !dirichlet);
    const slips: Slip[] = [
      [
        opt(image, dirichlet),
        dirichlet ? "A wall held at zero needs the opposite sign." : "An insulated wall needs the same sign.",
        dirichlet ? "温度保持为零的墙需要相反的符号。" : "绝热墙需要相同的符号。",
      ],
      [
        opt(swapped, !dirichlet),
        "That reflects the wrong coordinate; only the one across the wall changes.",
        "那反射了错误的坐标；只有垂直于墙的坐标改变。",
      ],
      [opt(away, !dirichlet), "That puts the image twice as far from the wall as the source.", "那把镜像放在离墙两倍远的地方。"],
      [opt(source, dirichlet), "That puts the image on top of the source, not across the wall.", "那把镜像放在源上，而不是墙的另一侧。"],
    ];
    const across = vertical ? "x" : "y";
    const [s, m] = [source[vertical ? 0 : 1], image[vertical ? 0 : 1]];
    return chosen(
      rng,
      [
        `A positive heat source is marked by $S$, and the thick line is a wall that is ${kind[0]}. What image source makes the wall condition hold?`,
        `$S$ 标出一个正热源，粗线是一堵墙，墙${kind[1]}。什么样的镜像源使墙上的条件成立？`,
      ],
      right,
      keep(right, slips),
      [
        [
          ["Reflect across the wall", "关于墙反射"],
          [
            `The wall is $${across} = ${w}$ and $S$ has $${across} = ${s}$, a distance $${Math.abs(d)}$ away, so the mirror position is $(${image[0]}, ${image[1]})$.`,
            `墙是 $${across} = ${w}$，$S$ 的 $${across} = ${s}$，距离为 $${Math.abs(d)}$，所以镜像位置是 $(${image[0]}, ${image[1]})$。`,
          ],
        ],
        [
          ["Choose the sign", "定符号"],
          [
            `A wall ${kind[0]} requires the image to have ${dirichlet ? "the opposite sign, so the two cancel on the wall" : "the same sign, so there is no flow across the wall"}.`,
            `墙${kind[1]}要求镜像${dirichlet ? "符号相反，使二者在墙上抵消" : "符号相同，使没有热量穿过墙"}。`,
          ],
        ],
      ],
      [
        `The wall lies halfway between the two: $\\frac{${s} + ${wrap(m)}}{2} = ${w}$, so every point of the wall is equally far from $S$ and from its image.`,
        `墙位于两者正中：$\\frac{${s} + ${wrap(m)}}{2} = ${w}$，所以墙上每一点到 $S$ 和到镜像的距离相等。`,
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
