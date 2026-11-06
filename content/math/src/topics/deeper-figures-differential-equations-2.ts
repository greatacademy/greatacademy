// More knowledge points of Differential Equations that ask the learner to read a drawing: graphs of the right side,
// solution curves of growth and circuit models, oscillators, solution pairs, straight-line solutions and the
// trace-determinant plane. See `deeperFiguresDifferentialEquations2Points`.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { t } from "@ga/content";
import type { PlaneMark, Point } from "@ga/subject-math";
import { Q } from "@ga/subject-math";
import { calculusDrawings5 } from "../explanation-drawings-calculus-5.ts";

import { ask, choose, type Pair, point, same } from "../university-kit.ts";
import { chart, curvePath, intTicks, type Scale } from "./figure-charts.ts";
import { drawn } from "./figure-reading-more.ts";

/** figureOf pairs a drawing with its description in both languages. */
const figureOf = (svg: string, [en, zh]: Pair) => ({ svg, alt: t(en, zh) });

/** mark draws a dot at a point of a chart. */
const mark = (x: Scale, y: Scale, a: number, b: number) => `<circle cx="${x(a)}" cy="${y(b)}" r="3" fill="currentColor" stroke="none"/>`;

/** guide draws a dashed straight line between two points of a chart. */
const guide = (x: Scale, y: Scale, a: Point, b: Point) =>
  `<line stroke="currentColor" stroke-dasharray="5 4" x1="${x(a[0])}" y1="${y(a[1])}" x2="${x(b[0])}" y2="${y(b[1])}"/>`;

const dashed = 'stroke="currentColor" stroke-dasharray="5 4"';

/** rightSide chooses a graph of f in y' = f(y) with whole-number roots and draws it. */
function rightSide(rng: Rng, count: number) {
  const r1 = rng.int(-5, -1);
  const roots = count === 3 ? [r1, r1 + rng.int(2, 3), r1 + 5 + rng.int(0, 1)] : [r1, r1 + rng.int(2, 6)];
  const s = rng.bool() ? 1 : -1;
  const f = (y: number) => s * roots.reduce((p, r) => p * (y - r), 1);
  const top = Math.max(Math.abs(f(-7)), Math.abs(f(7)));
  // The heights are compressed so that the small bumps between the roots stay visible; only the signs and roots are read.
  const g = (y: number) => {
    const v = f(y);
    return 9 * Math.sign(v) * (Math.abs(v) / top) ** 0.4;
  };
  const figure = figureOf(
    chart([-7, 7], [-10, 10], intTicks(-7, 7), [], (x, y) => guide(x, y, [-7, 0], [7, 0]) + curvePath(g, -7, 7, x, y)),
    [
      `A graph of the right side f(y) against y, crossing the dashed zero line at ${roots.join(", ")}. It is ${s > 0 ? "positive" : "negative"} to the right of the last crossing.`,
      `右端 f(y) 对 y 的图像，在 ${roots.join("、")} 处穿过虚线零线。在最后一个交点右侧，它为${s > 0 ? "正" : "负"}。`,
    ],
  );
  return { roots, f, figure };
}

const longRunFromRightSide = {
  ...point(
    "the-long-run-from-a-graph-of-the-right-side",
    ["The long run from a graph of the right side", "由右端的图像判断长期行为"],
    [
      "For $y' = f(y)$, the solution rises where the graph of $f$ is above zero and falls where it is below. It moves until it meets the next root in that direction, or runs off without bound if there is none.",
      "对 $y' = f(y)$，在 $f$ 的图像位于零线上方时解上升，位于下方时解下降。解一直运动到该方向的下一个根；如果没有根，就无限远离。",
    ],
    (rng) => {
      const { roots, f, figure } = rightSide(rng, 3);
      const starts: number[] = [];
      for (let v = -7; v <= 7; v++) if (!roots.includes(v)) starts.push(v);
      const y0 = rng.pick(starts);
      const rising = f(y0) > 0;
      const above = roots.filter((r) => r > y0);
      const below = roots.filter((r) => r < y0);
      const target = rising ? (above[0] ?? null) : (below[below.length - 1] ?? null);
      const name = (r: number | null): Pair =>
        r === null ? (rising ? same("y \\to \\infty") : same("y \\to -\\infty")) : same(`y \\to ${r}`);
      const others = roots.filter((r) => r !== target).map((r) => same(`y \\to ${r}`));
      return choose(
        rng,
        [
          `The graph shows $f(y)$ for the equation $y' = f(y)$. What happens to the solution with $y(0) = ${y0}$ as $t$ grows?`,
          `图中是方程 $y' = f(y)$ 的 $f(y)$。当 $t$ 增大时，满足 $y(0) = ${y0}$ 的解如何变化？`,
        ],
        name(target),
        [...others, target === null ? same(`y \\to ${y0}`) : rising ? same("y \\to \\infty") : same("y \\to -\\infty")],
        [
          `At $y = ${y0}$ the graph is ${rising ? "above" : "below"} zero, so $y$ ${rising ? "rises" : "falls"}, and ${target === null ? "no root stops it" : `the first root it meets is $${target}$`}.`,
          `在 $y = ${y0}$ 处图像在零线${rising ? "上方" : "下方"}，所以 $y$ ${rising ? "上升" : "下降"}，${target === null ? "没有根能阻止它" : `它遇到的第一个根是 $${target}$`}。`,
        ],
        figure,
      );
    },
  ),
  figure: calculusDrawings5["qualitative-analysis-of-first-order-odes#the-long-run-from-a-graph-of-the-right-side"],
};

const stableRoot = {
  ...point(
    "the-stable-equilibrium-from-a-graph-of-the-right-side",
    ["The stable equilibrium from a graph of the right side", "由右端的图像找稳定平衡"],
    [
      "A root of $f$ is a stable equilibrium of $y' = f(y)$ when $f$ crosses from positive to negative there as $y$ increases, since solutions on both sides then move toward it.",
      "当 $y$ 增大时 $f$ 在根处由正变负，这个根就是 $y' = f(y)$ 的稳定平衡，因为两侧的解都向它移动。",
    ],
    (rng) => {
      const { roots, f, figure } = rightSide(rng, 2);
      const [a, b] = roots as [number, number];
      const stable = f((a + b) / 2) < 0 ? a : b;
      const other = stable === a ? b : a;
      return choose(
        rng,
        [
          "The graph shows $f(y)$ for the equation $y' = f(y)$. Which equilibrium is stable?",
          "图中是方程 $y' = f(y)$ 的 $f(y)$。哪个平衡是稳定的？",
        ],
        same(`y = ${stable}`),
        [same(`y = ${other}`), ["Both of them", "两个都是"], ["Neither of them", "两个都不是"]],
        [
          `At $y = ${stable}$ the graph goes from above zero to below zero as $y$ increases, so nearby solutions move toward it. At $y = ${other}$ the signs are the other way round.`,
          `在 $y = ${stable}$ 处，随 $y$ 增大图像由零线上方变到下方，所以附近的解向它移动。在 $y = ${other}$ 处符号相反。`,
        ],
        figure,
      );
    },
  ),
  figure: calculusDrawings5["equilibrium-solutions-of-first-order-odes#the-stable-equilibrium-from-a-graph-of-the-right-side"],
};

const growthPoints = point(
  "a-later-value-from-a-drawn-doubling-curve",
  ["A later value from a drawn doubling curve", "由所画的倍增曲线求后来的值"],
  [
    "Solutions of $y' = ky$ with $k > 0$ double in equal times. Read the doubling time from two marked points, then count how many doublings fit into the time you want.",
    "$k > 0$ 时 $y' = ky$ 的解每隔相等的时间翻倍。由两个标记点读出倍增时间，再数所求时间内翻了几倍。",
  ],
  (rng) => {
    const A = rng.int(1, 5);
    const T = rng.int(1, 4);
    const k = rng.int(2, 5);
    const f = (v: number) => A * 2 ** (v / T);
    const answer = A * 2 ** k;
    const span = 2 * T + 1;
    const svg = chart(
      [0, span],
      [0, f(span) * 1.1],
      intTicks(0, span),
      intTicks(0, 4 * A, A),
      (x, y) => curvePath(f, 0, span, x, y) + mark(x, y, 0, A) + mark(x, y, T, 2 * A),
    );
    return ask(
      [
        `The curve solves $y' = ky$ and passes through the marked points. Find $y(${k * T})$.`,
        `这条曲线是 $y' = ky$ 的解，并过标记点。求 $y(${k * T})$。`,
      ],
      answer,
      [2 * k * A, A * k * T, answer / 2, 2 * answer],
      [
        `The curve goes from $${A}$ to $${2 * A}$ in time $${T}$, so it doubles every $${T}$. By $t = ${k * T}$ it has doubled $${k}$ times, which gives $${A} \\cdot 2^{${k}} = ${answer}$.`,
        `曲线在时间 $${T}$ 内从 $${A}$ 变到 $${2 * A}$，所以每隔 $${T}$ 翻倍。到 $t = ${k * T}$ 时翻倍 $${k}$ 次，得 $${A} \\cdot 2^{${k}} = ${answer}$。`,
      ],
      figureOf(svg, [
        `An increasing exponential curve through (0, ${A}) and (${T}, ${2 * A}).`,
        `递增的指数曲线，过 (0, ${A}) 和 (${T}, ${2 * A})。`,
      ]),
    );
  },
);

const decayTime = point(
  "the-time-to-reach-a-value-on-a-drawn-decay-curve",
  ["The time to reach a value on a drawn decay curve", "在所画衰减曲线上求达到某值的时间"],
  [
    "Solutions of $y' = -ky$ halve in equal times. Read the half-life from two marked points, then count how many halvings lead to the value you want.",
    "$y' = -ky$ 的解每隔相等的时间减半。由两个标记点读出半衰期，再数减半多少次到达所求的值。",
  ],
  (rng) => {
    const A = rng.pick([16, 32, 64, 48, 80]);
    const h = rng.int(1, 5);
    const k = rng.int(2, 4);
    const f = (v: number) => A * 0.5 ** (v / h);
    const span = 3 * h;
    const target = A / 2 ** k;
    const answer = k * h;
    const svg = chart(
      [0, span],
      [0, A * 1.1],
      intTicks(0, span, h),
      [
        [A, String(A)],
        [A / 2, String(A / 2)],
      ],
      (x, y) => curvePath(f, 0, span, x, y) + mark(x, y, 0, A) + mark(x, y, h, A / 2),
    );
    return ask(
      [
        `The curve solves $y' = -ky$ and passes through the marked points. At what time does $y$ equal $${target}$?`,
        `这条曲线是 $y' = -ky$ 的解，并过标记点。$y$ 何时等于 $${target}$？`,
      ],
      answer,
      [h, k, 2 * k * h, Q.of(A, target * h)],
      [
        `The curve falls from $${A}$ to $${A / 2}$ in time $${h}$, so the half-life is $${h}$. Going from $${A}$ to $${target}$ takes $${k}$ halvings, which is time $${k} \\cdot ${h} = ${answer}$.`,
        `曲线在时间 $${h}$ 内从 $${A}$ 降到 $${A / 2}$，所以半衰期为 $${h}$。从 $${A}$ 到 $${target}$ 需要减半 $${k}$ 次，时间为 $${k} \\cdot ${h} = ${answer}$。`,
      ],
      figureOf(svg, [
        `A decreasing exponential curve through (0, ${A}) and (${h}, ${A / 2}).`,
        `递减的指数曲线，过 (0, ${A}) 和 (${h}, ${A / 2})。`,
      ]),
    );
  },
);

const logisticPeak = point(
  "the-fastest-growth-on-a-drawn-logistic-curve",
  ["The fastest growth on a drawn logistic curve", "所画逻辑斯蒂曲线上的最快增长"],
  [
    "For $y' = ry\\left(1 - \\frac{y}{K}\\right)$, the curve levels off at the carrying capacity $K$. Growth is fastest at $y = \\frac{K}{2}$, where the rate is $\\frac{rK}{4}$.",
    "对 $y' = ry\\left(1 - \\frac{y}{K}\\right)$，曲线趋于环境容量 $K$。在 $y = \\frac{K}{2}$ 处增长最快，此时速率为 $\\frac{rK}{4}$。",
  ],
  (rng) => {
    const K = rng.pick([4, 6, 8, 10, 12, 16, 20, 24]);
    const [rn, rd] = rng.pick<[number, number]>([
      [1, 2],
      [1, 1],
      [3, 2],
      [2, 1],
    ]);
    const r = rn / rd;
    const y0 = K / 8;
    const f = (v: number) => K / (1 + ((K - y0) / y0) * Math.exp(-r * v));
    const span = Math.ceil(10 / r);
    const kind = rng.pick(["rate", "half"] as const);
    const rate = Q.of(rn * K, rd * 4);
    const svg = chart(
      [0, span],
      [0, K * 1.2],
      intTicks(0, span, Math.ceil(span / 10)),
      [
        [K / 2, String(K / 2)],
        [K, String(K)],
      ],
      (x, y) => curvePath(f, 0, span, x, y) + guide(x, y, [0, K], [span, K]),
    );
    const rText = Q.of(rn, rd).toLatex();
    return ask(
      kind === "rate"
        ? [
            `The curve solves $y' = ${rText}\\,y\\left(1 - \\frac{y}{K}\\right)$, and the dashed line is its limit. Find the largest value of $y'$.`,
            `这条曲线是 $y' = ${rText}\\,y\\left(1 - \\frac{y}{K}\\right)$ 的解，虚线是它的极限。求 $y'$ 的最大值。`,
          ]
        : [
            `The curve solves $y' = ${rText}\\,y\\left(1 - \\frac{y}{K}\\right)$, and the dashed line is its limit. At what value of $y$ is the growth fastest?`,
            `这条曲线是 $y' = ${rText}\\,y\\left(1 - \\frac{y}{K}\\right)$ 的解，虚线是它的极限。$y$ 为何值时增长最快？`,
          ],
      kind === "rate" ? rate : Q.of(K, 2),
      kind === "rate" ? [Q.of(rn * K, rd * 2), Q.of(rn * K, rd), Q.of(K, 4), Q.of(rn * K, rd * 8)] : [K, Q.of(K, 4), Q.of(3 * K, 4), rate],
      [
        `The curve levels off at $K = ${K}$. Growth is fastest at $y = ${K / 2}$${kind === "rate" ? `, where $y' = \\frac{rK}{4} = ${rate.toLatex()}$` : ""}.`,
        `曲线趋于 $K = ${K}$。在 $y = ${K / 2}$ 处增长最快${kind === "rate" ? `，此时 $y' = \\frac{rK}{4} = ${rate.toLatex()}$` : ""}。`,
      ],
      figureOf(svg, [`An S-shaped curve that levels off at the dashed line y = ${K}.`, `S 形曲线，趋于虚线 y = ${K}。`]),
    );
  },
);

/** approach draws a curve that moves from y0 to a limit, with the dashed limit and the tangent at the start. */
function approach(y0: number, limit: number, tau: number, span: number, top: number, ticks: readonly [number, string][]) {
  const f = (v: number) => limit + (y0 - limit) * Math.exp(-v / tau);
  return chart(
    [0, span],
    [0, top],
    intTicks(0, span, Math.max(1, Math.round(span / 12))),
    ticks,
    (x, y) => curvePath(f, 0, span, x, y) + guide(x, y, [0, limit], [span, limit]) + guide(x, y, [0, y0], [tau, limit]),
  );
}

const inhibitedRate = point(
  "the-constant-of-a-drawn-inhibited-growth-curve",
  ["The constant of a drawn inhibited growth curve", "所画受限增长曲线的常数"],
  [
    "For $y' = k(L - y)$, the curve approaches the limit $L$. The tangent at $t = 0$ has slope $k(L - y(0))$, so it reaches the level $L$ at exactly $t = \\frac{1}{k}$.",
    "对 $y' = k(L - y)$，曲线趋于极限 $L$。$t = 0$ 处切线的斜率为 $k(L - y(0))$，所以它恰好在 $t = \\frac{1}{k}$ 时到达水平 $L$。",
  ],
  (rng) => {
    const y0 = rng.int(0, 3);
    const L = y0 + rng.int(2, 9) * 2;
    const tau = rng.int(1, 5);
    const kind = rng.pick(["k", "start"] as const);
    const start = Q.of(L - y0, tau);
    const svg = approach(y0, L, tau, 5 * tau, L * 1.2, [
      [y0, String(y0)],
      [L, String(L)],
    ]);
    return ask(
      kind === "k"
        ? [
            `The curve solves $y' = k(L - y)$. The horizontal dashed line is its limit, and the slanted dashed line is its tangent at $t = 0$. Find $k$.`,
            `这条曲线是 $y' = k(L - y)$ 的解。水平虚线是它的极限，斜虚线是它在 $t = 0$ 处的切线。求 $k$。`,
          ]
        : [
            `The curve solves $y' = k(L - y)$. The horizontal dashed line is its limit, and the slanted dashed line is its tangent at $t = 0$. Find $y'(0)$.`,
            `这条曲线是 $y' = k(L - y)$ 的解。水平虚线是它的极限，斜虚线是它在 $t = 0$ 处的切线。求 $y'(0)$。`,
          ],
      kind === "k" ? Q.of(1, tau) : start,
      kind === "k" ? [tau, Q.of(L - y0, tau), Q.of(1, L), Q.of(y0 + 1, tau)] : [Q.of(1, tau), L - y0, Q.of(L, tau), Q.of(tau, L - y0)],
      [
        `The tangent climbs from $${y0}$ to $${L}$ in time $${tau}$, so $y'(0) = \\frac{${L - y0}}{${tau}}$ and $k = \\frac{1}{${tau}}$.`,
        `切线在时间 $${tau}$ 内从 $${y0}$ 升到 $${L}$，所以 $y'(0) = \\frac{${L - y0}}{${tau}}$，$k = \\frac{1}{${tau}}$。`,
      ],
      figureOf(svg, [
        `A curve rising from ${y0} toward the dashed limit ${L}, with a tangent at t = 0 that reaches the limit at t = ${tau}.`,
        `从 ${y0} 上升并趋于虚线极限 ${L} 的曲线，t = 0 处的切线在 t = ${tau} 时到达极限。`,
      ]),
    );
  },
);

const coolingLimit = point(
  "the-surroundings-of-a-drawn-cooling-curve",
  ["The surroundings of a drawn cooling curve", "所画冷却曲线的环境"],
  [
    "Inhibited decay $y' = -k(y - L)$ falls toward the limit $L$, the temperature of the surroundings. At any time, the rate of change is $-k$ times the distance above the limit.",
    "受限衰减 $y' = -k(y - L)$ 下降并趋于极限 $L$，即环境温度。任何时刻的变化率都是 $-k$ 乘以高出极限的距离。",
  ],
  (rng) => {
    const L = rng.pick([10, 20, 30]);
    const y0 = L + rng.pick([20, 30, 40, 50, 60]);
    const tau = rng.int(2, 6);
    const now = rng.pick([L + 5, L + 10, L + 15]);
    const f = (v: number) => L + (y0 - L) * Math.exp(-v / tau);
    const svg = chart(
      [0, 5 * tau],
      [0, y0 * 1.1],
      intTicks(0, 5 * tau, tau),
      [
        [L, String(L)],
        [y0, String(y0)],
      ],
      (x, y) => curvePath(f, 0, 5 * tau, x, y) + guide(x, y, [0, L], [5 * tau, L]),
    );
    const answer = Q.of(-(now - L), tau);
    return ask(
      [
        `The curve shows a temperature with $y' = -k(y - L)$ and $k = \\frac{1}{${tau}}$. The dashed line is its limit. Find $y'$ at the moment when $y = ${now}$.`,
        `曲线表示温度，满足 $y' = -k(y - L)$，$k = \\frac{1}{${tau}}$。虚线是它的极限。求 $y = ${now}$ 时的 $y'$。`,
      ],
      answer,
      [Q.of(now - L, tau), Q.of(-now, tau), Q.of(-(y0 - L), tau), Q.of(-(now - L), 1)],
      [
        `The dashed line gives $L = ${L}$, so $y' = -\\frac{1}{${tau}}(${now} - ${L}) = ${answer.toLatex()}$.`,
        `由虚线得 $L = ${L}$，所以 $y' = -\\frac{1}{${tau}}(${now} - ${L}) = ${answer.toLatex()}$。`,
      ],
      figureOf(svg, [`A curve falling from ${y0} toward the dashed limit ${L}.`, `从 ${y0} 下降并趋于虚线极限 ${L} 的曲线。`]),
    );
  },
);

const terminalDrag = point(
  "linear-drag-from-a-drawn-velocity-curve",
  ["Linear drag from a drawn velocity curve", "由所画的速度曲线求线性阻力"],
  [
    "With linear drag, $v' = g - cv$. The velocity levels off when $v' = 0$, at the terminal velocity $v_T = \\frac{g}{c}$, so reading $v_T$ gives $c$.",
    "线性阻力下 $v' = g - cv$。速度在 $v' = 0$ 时趋于稳定，终端速度为 $v_T = \\frac{g}{c}$，所以读出 $v_T$ 就得到 $c$。",
  ],
  (rng) => {
    const g = 10;
    const vT = rng.pick([5, 10, 15, 20, 25, 30, 40, 50]);
    const m = rng.int(1, 8);
    const kind = rng.pick(["c", "force"] as const);
    const f = (v: number) => vT * (1 - Math.exp(-(g / vT) * v));
    const span = Math.ceil((5 * vT) / g);
    const svg = chart(
      [0, span],
      [0, vT * 1.25],
      intTicks(0, span, Math.max(1, Math.round(span / 10))),
      [[vT, String(vT)]],
      (x, y) => curvePath(f, 0, span, x, y) + guide(x, y, [0, vT], [span, vT]),
    );
    const c = Q.of(g, vT);
    const answer = kind === "c" ? c : Q.of(m * g, vT);
    return ask(
      kind === "c"
        ? [
            `An object falls from rest with $v' = 10 - cv$, and the curve shows $v$ with its dashed limit. Find $c$.`,
            `物体从静止下落，$v' = 10 - cv$，曲线表示 $v$，虚线是它的极限。求 $c$。`,
          ]
        : [
            `An object of mass $${m}$ falls from rest with force $mv' = 10m - bv$, and the curve shows $v$ with its dashed limit. Find $b$.`,
            `质量为 $${m}$ 的物体从静止下落，$mv' = 10m - bv$，曲线表示 $v$，虚线是它的极限。求 $b$。`,
          ],
      answer,
      kind === "c" ? [vT, Q.of(vT, g), Q.of(1, vT), Q.of(g, 2 * vT)] : [Q.of(g, vT), Q.of(m, vT), Q.of(vT, m * g), m * g],
      [
        `The limit is $v_T = ${vT}$, where $v' = 0$. ${kind === "c" ? `So $10 = c(${vT})$ and $c = ${c.toLatex()}$.` : `So $10(${m}) = b(${vT})$ and $b = ${answer.toLatex()}$.`}`,
        `极限为 $v_T = ${vT}$，此时 $v' = 0$。${kind === "c" ? `所以 $10 = c(${vT})$，$c = ${c.toLatex()}$。` : `所以 $10(${m}) = b(${vT})$，$b = ${answer.toLatex()}$。`}`,
      ],
      figureOf(svg, [`A velocity curve from 0 rising toward the dashed limit ${vT}.`, `从 0 上升并趋于虚线极限 ${vT} 的速度曲线。`]),
    );
  },
);

const rcCircuit = point(
  "an-rc-circuit-from-a-drawn-charging-curve",
  ["An RC circuit from a drawn charging curve", "由所画充电曲线求 RC 电路"],
  [
    "A charging capacitor has $RQ' + \\frac{Q}{C} = V$, so $Q$ approaches $CV$ with time constant $\\tau = RC$. The tangent at $t = 0$ reaches the limit at $t = \\tau$.",
    "充电电容满足 $RQ' + \\frac{Q}{C} = V$，所以 $Q$ 趋于 $CV$，时间常数 $\\tau = RC$。$t = 0$ 处的切线在 $t = \\tau$ 时到达极限。",
  ],
  (rng) => {
    const tau = rng.int(1, 6);
    const R = rng.int(1, 6);
    const V = rng.pick([2, 3, 4, 5, 6, 10]);
    const C = Q.of(tau, R);
    const limit = (V * tau) / R;
    const svg = approach(0, limit, tau, 5 * tau, limit * 1.2, [
      [
        limit,
        Number.isInteger(limit)
          ? String(limit)
          : C.mul(Q.of(V, 1))
              .toLatex()
              .replace(/\\frac\{(\d+)\}\{(\d+)\}/, "$1/$2"),
      ],
    ]);
    return ask(
      [
        `The curve shows the charge on a capacitor in an RC circuit with $R = ${R}$, charged from zero. The horizontal dashed line is the limit, and the slanted dashed line is the tangent at $t = 0$. Find $C$.`,
        `曲线表示电阻 $R = ${R}$ 的 RC 电路中从零开始充电的电容电荷。水平虚线是极限，斜虚线是 $t = 0$ 处的切线。求 $C$。`,
      ],
      C,
      [tau, R * tau, Q.of(R, tau), Q.of(1, tau)],
      [
        `The tangent reaches the limit at $t = ${tau}$, so $\\tau = RC = ${tau}$ and $C = \\frac{${tau}}{${R}} = ${C.toLatex()}$.`,
        `切线在 $t = ${tau}$ 时到达极限，所以 $\\tau = RC = ${tau}$，$C = \\frac{${tau}}{${R}} = ${C.toLatex()}$。`,
      ],
      figureOf(svg, [
        `A curve rising from 0 toward a dashed limit, with a tangent at t = 0 that reaches the limit at t = ${tau}.`,
        `从 0 上升并趋于虚线极限的曲线，t = 0 处的切线在 t = ${tau} 时到达极限。`,
      ]),
    );
  },
);

const rlCircuit = point(
  "an-rl-circuit-from-a-drawn-current-curve",
  ["An RL circuit from a drawn current curve", "由所画电流曲线求 RL 电路"],
  [
    "An RL circuit has $LI' + RI = V$. The current levels off when $I' = 0$, at $I = \\frac{V}{R}$, and the time constant is $\\tau = \\frac{L}{R}$.",
    "RL 电路满足 $LI' + RI = V$。电流在 $I' = 0$ 时趋于稳定，$I = \\frac{V}{R}$，时间常数 $\\tau = \\frac{L}{R}$。",
  ],
  (rng) => {
    const limit = rng.int(1, 8);
    const R = rng.int(1, 6);
    const tau = rng.int(1, 5);
    const V = limit * R;
    const svg = approach(0, limit, tau, 5 * tau, limit * 1.2, [[limit, String(limit)]]);
    const kind = rng.pick(["R", "L"] as const);
    const answer = kind === "R" ? R : R * tau;
    return ask(
      kind === "R"
        ? [
            `The curve shows the current in an RL circuit with constant voltage $V = ${V}$, with its dashed limit. Find $R$.`,
            `曲线表示恒定电压 $V = ${V}$ 的 RL 电路中的电流，虚线是它的极限。求 $R$。`,
          ]
        : [
            `The curve shows the current in an RL circuit with $R = ${R}$, starting from zero. The horizontal dashed line is the limit, and the slanted dashed line is the tangent at $t = 0$. Find $L$.`,
            `曲线表示 $R = ${R}$ 的 RL 电路中从零开始的电流。水平虚线是极限，斜虚线是 $t = 0$ 处的切线。求 $L$。`,
          ],
      answer,
      kind === "R" ? [V, limit, V + limit, V * limit] : [R, tau, R + tau, limit * tau],
      kind === "R"
        ? [
            `The current levels off at $${limit} = \\frac{${V}}{R}$, so $R = ${R}$.`,
            `电流趋于 $${limit} = \\frac{${V}}{R}$，所以 $R = ${R}$。`,
          ]
        : [
            `The tangent reaches the limit at $t = ${tau}$, so $\\frac{L}{${R}} = ${tau}$ and $L = ${answer}$.`,
            `切线在 $t = ${tau}$ 时到达极限，所以 $\\frac{L}{${R}} = ${tau}$，$L = ${answer}$。`,
          ],
      figureOf(svg, [
        `A curve rising from 0 toward the dashed limit ${limit}, with a tangent at t = 0 that reaches the limit at t = ${tau}.`,
        `从 0 上升并趋于虚线极限 ${limit} 的曲线，t = 0 处的切线在 t = ${tau} 时到达极限。`,
      ]),
    );
  },
);

const repeatedRoot = point(
  "constants-of-a-repeated-root-solution-from-a-drawing",
  ["Constants of a repeated root solution, from a drawing", "由图求重根解的常数"],
  [
    "With a repeated root $-r$, the solutions are $y = (A + Bt)e^{-rt}$. Then $y(0) = A$ and $y'(0) = B - rA$, so the height and the slope of the curve at $t = 0$ fix both constants.",
    "重根为 $-r$ 时，解为 $y = (A + Bt)e^{-rt}$。于是 $y(0) = A$，$y'(0) = B - rA$，所以曲线在 $t = 0$ 处的高度和斜率确定两个常数。",
  ],
  (rng) => {
    const r = rng.int(1, 3);
    const A = rng.int(1, 4);
    const slope = rng.pick([-3, -2, -1, 1, 2, 3]);
    const B = slope + r * A;
    const f = (v: number) => (A + B * v) * Math.exp(-r * v);
    const tip = 1;
    const svg = chart([0, 4], [-4, 7], intTicks(0, 4), intTicks(-4, 7), (x, y) => {
      const clipped = (v: number) => Math.max(-4, Math.min(7, f(v)));
      return (
        guide(x, y, [0, 0], [4, 0]) +
        curvePath(clipped, 0, 4, x, y) +
        guide(x, y, [0, A], [tip, A + slope]) +
        mark(x, y, 0, A) +
        mark(x, y, tip, A + slope)
      );
    });
    const coefficient = r === 1 ? "" : r;
    const tri = `y'' + ${2 * r === 1 ? "" : 2 * r}y' + ${r * r}y = 0`;
    return ask(
      [
        `The curve solves $${tri}$, and the short dashed segment is its tangent at $t = 0$. Write the solution as $y = (A + Bt)e^{-${coefficient}t}$ and find $B$.`,
        `这条曲线是 $${tri}$ 的解，短虚线段是它在 $t = 0$ 处的切线。把解写成 $y = (A + Bt)e^{-${coefficient}t}$，求 $B$。`,
      ],
      B,
      [slope, slope - r * A, A, B + 1, -B],
      [
        `The curve starts at $A = ${A}$ with slope $${slope}$. Since $y'(0) = B - ${r}A$, we get $B = ${slope} + ${r}(${A}) = ${B}$.`,
        `曲线从 $A = ${A}$ 出发，斜率为 $${slope}$。由 $y'(0) = B - ${r}A$ 得 $B = ${slope} + ${r}(${A}) = ${B}$。`,
      ],
      figureOf(svg, [
        `A curve starting at (0, ${A}), whose tangent there also passes through (1, ${A + slope}).`,
        `从 (0, ${A}) 出发的曲线，那里的切线还过 (1, ${A + slope})。`,
      ]),
    );
  },
);

const oscillatorFrequency = point(
  "an-oscillator-from-its-drawn-graph",
  ["An oscillator from its drawn graph", "由图读振子"],
  [
    "A simple harmonic oscillator $my'' + ky = 0$ moves as $y = R\\cos(\\omega t - \\phi)$ with $\\omega = \\sqrt{\\frac{k}{m}}$. The amplitude $R$ is half the distance from top to bottom, the period is $T = \\frac{2\\pi}{\\omega}$, and the largest speed is $R\\omega$.",
    "简谐振子 $my'' + ky = 0$ 的运动为 $y = R\\cos(\\omega t - \\phi)$，$\\omega = \\sqrt{\\frac{k}{m}}$。振幅 $R$ 是从最高到最低距离的一半，周期 $T = \\frac{2\\pi}{\\omega}$，最大速率为 $R\\omega$。",
  ],
  (rng) => {
    const R = rng.int(1, 5);
    const T = rng.int(2, 8);
    const f = (v: number) => R * Math.cos((2 * Math.PI * v) / T);
    const span = 2 * T;
    const svg = chart(
      [0, span],
      [-R - 1, R + 1],
      intTicks(0, span, T > 4 ? 2 : 1),
      intTicks(-R, R, R),
      (x, y) => guide(x, y, [0, 0], [span, 0]) + curvePath(f, 0, span, x, y),
    );
    const kind = rng.pick(["omega", "amplitude"] as const);
    const omega = (n: number, d: number) => {
      const text = Q.of(n, d).toLatex();
      return text === "1" ? "\\pi" : text.startsWith("\\frac{1}") ? `\\frac{\\pi}${text.slice(8)}` : `${text}\\pi`;
    };
    const figure = figureOf(svg, [`A cosine wave with amplitude ${R} and period ${T}.`, `振幅为 ${R}、周期为 ${T} 的余弦波。`]);
    if (kind === "amplitude") {
      const speed = Q.of(2 * R, T);
      return ask(
        [
          "The graph shows $y(t)$ for a simple harmonic oscillator. Find its largest speed divided by $\\pi$.",
          "图中是简谐振子的 $y(t)$。求它的最大速率除以 $\\pi$。",
        ],
        speed,
        [Q.of(R, T), Q.of(4 * R, T), Q.of(2 * R, 1), Q.of(2, T), Q.of(2 * T, R)],
        [
          `The amplitude is $${R}$ and the period is $${T}$, so $\\omega = \\frac{2\\pi}{${T}}$. The largest speed is $R\\omega = ${speed.toLatex()}\\pi$.`,
          `振幅为 $${R}$，周期为 $${T}$，所以 $\\omega = \\frac{2\\pi}{${T}}$。最大速率为 $R\\omega = ${speed.toLatex()}\\pi$。`,
        ],
        figure,
      );
    }
    return choose(
      rng,
      [
        "The graph shows $y(t)$ for a simple harmonic oscillator. What is its angular frequency $\\omega$?",
        "图中是简谐振子的 $y(t)$。它的角频率 $\\omega$ 是多少？",
      ],
      same(`\\omega = ${omega(2, T)}`),
      [same(`\\omega = ${omega(1, T)}`), same(`\\omega = ${omega(T, 2)}`), same(`\\omega = ${omega(4, T)}`), same(`\\omega = ${T}`)],
      [
        `One full wave takes time $T = ${T}$, so $\\omega = \\frac{2\\pi}{${T}} = ${omega(2, T)}$.`,
        `一个完整波形用时 $T = ${T}$，所以 $\\omega = \\frac{2\\pi}{${T}} = ${omega(2, T)}$。`,
      ],
      figure,
    );
  },
);

const dampingKind = point(
  "the-kind-of-damping-from-a-drawn-graph",
  ["The kind of damping from a drawn graph", "由图判断阻尼类型"],
  [
    "For $my'' + cy' + ky = 0$, the discriminant $c^2 - 4mk$ decides the motion. Negative: oscillation with shrinking waves. Zero or positive: decay with at most one crossing of zero. No damping: waves of constant size.",
    "对 $my'' + cy' + ky = 0$，判别式 $c^2 - 4mk$ 决定运动。为负：振幅递减的振荡。为零或正：衰减，至多穿过零一次。无阻尼：振幅不变的波。",
  ],
  (rng) => {
    const kind = rng.pick(["under", "over", "none", "negative"] as const);
    const R = rng.int(2, 5);
    const w = rng.pick([1.5, 2, 2.5, 3]);
    const decay = rng.pick([0.2, 0.3, 0.4]);
    const f = (v: number) => {
      if (kind === "under") return R * Math.exp(-decay * v) * Math.cos(w * v);
      if (kind === "none") return R * Math.cos(w * v);
      if (kind === "negative") return ((R / 2) * Math.exp(0.6 * decay * v) * Math.cos(w * v)) as number;
      return R * (1 + 0.8 * v) * Math.exp(-decay * 3 * v);
    };
    const top = kind === "negative" ? R * 3 : R + 1;
    const clip = (v: number) => Math.max(-top, Math.min(top, f(v)));
    const svg = chart(
      [0, 10],
      [-top, top],
      intTicks(0, 10),
      intTicks(-R, R, R),
      (x, y) => guide(x, y, [0, 0], [10, 0]) + curvePath(clip, 0, 10, x, y),
    );
    const names: Record<typeof kind, Pair> = {
      under: ["Underdamped: $0 < c^2 < 4mk$", "欠阻尼：$0 < c^2 < 4mk$"],
      over: ["Critically damped or overdamped: $c^2 \\ge 4mk$", "临界阻尼或过阻尼：$c^2 \\ge 4mk$"],
      none: ["Undamped: $c = 0$", "无阻尼：$c = 0$"],
      negative: ["Energy is being added: $c < 0$", "能量在增加：$c < 0$"],
    };
    const why: Record<typeof kind, Pair> = {
      under: ["The curve keeps crossing zero while its waves shrink.", "曲线不断穿过零，波幅不断缩小。"],
      over: ["The curve decays to zero without oscillating.", "曲线衰减到零而不振荡。"],
      none: ["The waves keep the same size.", "波幅保持不变。"],
      negative: ["The waves grow over time, so energy is being added.", "波幅随时间不断增大，所以能量在增加。"],
    };
    const alts: Record<typeof kind, Pair> = {
      under: ["A wave whose peaks shrink over time.", "峰值随时间缩小的波。"],
      over: ["A curve that decays to zero without crossing it.", "衰减到零且不穿过零的曲线。"],
      none: ["A wave whose peaks keep the same height.", "峰值高度不变的波。"],
      negative: ["A wave whose peaks grow over time.", "峰值随时间增大的波。"],
    };
    return choose(
      rng,
      [
        "The graph shows a solution of $my'' + cy' + ky = 0$ with $m, k > 0$. Which description fits it?",
        "图中是 $my'' + cy' + ky = 0$（$m, k > 0$）的一个解。哪个描述符合它？",
      ],
      names[kind],
      (["under", "over", "none", "negative"] as const).filter((x) => x !== kind).map((x) => names[x]),
      why[kind],
      figureOf(svg, alts[kind]),
    );
  },
);

const resonance = point(
  "the-forcing-that-causes-a-drawn-resonance",
  ["The forcing that causes a drawn resonance", "造成所画共振的外力"],
  [
    "For $y'' + \\omega_0^2 y = F\\cos(\\omega t)$, a forcing at the natural frequency, $\\omega = \\omega_0$, gives waves that grow without bound, $y = \\frac{F}{2\\omega_0}t\\sin(\\omega_0 t)$. Any other frequency gives bounded motion.",
    "对 $y'' + \\omega_0^2 y = F\\cos(\\omega t)$，频率等于固有频率（$\\omega = \\omega_0$）的外力产生无界增长的波，$y = \\frac{F}{2\\omega_0}t\\sin(\\omega_0 t)$。其他频率的运动都有界。",
  ],
  (rng) => {
    const w0 = rng.int(1, 5);
    const F = rng.int(1, 8);
    const a = F / (2 * w0);
    const f = (v: number) => a * v * Math.sin(w0 * v);
    const top = a * 10 * 1.1;
    const svg = chart([0, 10], [-top, top], intTicks(0, 10), [], (x, y) => guide(x, y, [0, 0], [10, 0]) + curvePath(f, 0, 10, x, y));
    const eq = `y'' + ${w0 * w0 === 1 ? "" : w0 * w0}y = ${F === 1 ? "" : F}\\cos(\\omega t)`;
    const near = [w0 + 1, w0 + 2, w0 * w0 === w0 ? w0 + 3 : w0 * w0, w0 > 1 ? w0 - 1 : w0 + 3];
    return choose(
      rng,
      [
        `The graph shows a solution of $${eq}$ starting from rest. Which value of $\\omega$ produces it?`,
        `图中是 $${eq}$ 从静止开始的一个解。哪个 $\\omega$ 产生了它？`,
      ],
      same(`\\omega = ${w0}`),
      near.map((v) => same(`\\omega = ${v}`)),
      [
        `The waves grow without bound, so this is resonance, where $\\omega$ equals the natural frequency $\\sqrt{${w0 * w0}} = ${w0}$.`,
        `波无界增长，所以这是共振，此时 $\\omega$ 等于固有频率 $\\sqrt{${w0 * w0}} = ${w0}$。`,
      ],
      figureOf(svg, ["A wave whose peaks grow in a straight line over time.", "峰值随时间直线增长的波。"]),
    );
  },
);

/** waves lists the shapes of solutions drawn for superposition and independence, each with a whole-number value at t = 2. */
const shapeOf = (kind: number, v2: number) => {
  const base = [
    (v: number) => Math.cos(((v - 2) * Math.PI) / 4),
    (v: number) => Math.exp((v - 2) / 3),
    (v: number) => Math.exp(-(v - 2) / 2),
    (v: number) => 1 + ((v - 2) * Math.sin(v)) / 3,
  ][kind] as (v: number) => number;
  return (v: number) => v2 * base(v);
};

const superposition = point(
  "a-combination-of-two-drawn-solutions",
  ["A combination of two drawn solutions", "两个所画解的组合"],
  [
    "If $y_1$ and $y_2$ solve a homogeneous linear equation, so does $c_1 y_1 + c_2 y_2$. Its value at any time is the same combination of the values of $y_1$ and $y_2$ at that time.",
    "若 $y_1$ 和 $y_2$ 是齐次线性方程的解，则 $c_1 y_1 + c_2 y_2$ 也是。它在任何时刻的值都是 $y_1$ 和 $y_2$ 在该时刻的值的同一组合。",
  ],
  (rng) => {
    const v1 = rng.pick([-3, -2, -1, 1, 2, 3, 4]);
    const v2 = rng.pick([-3, -2, -1, 1, 2, 3, 4].filter((v) => v !== v1));
    const [k1, k2] = rng.sample([0, 1, 2, 3], 2) as [number, number];
    const c1 = rng.pick([-3, -2, -1, 2, 3]);
    const c2 = rng.pick([-3, -2, -1, 2, 3]);
    const f1 = shapeOf(k1, v1);
    const f2 = shapeOf(k2, v2);
    const clip = (f: (v: number) => number) => (v: number) => Math.max(-6, Math.min(6, f(v)));
    const svg = chart(
      [0, 4],
      [-6, 6],
      intTicks(0, 4),
      intTicks(-6, 6, 2),
      (x, y) =>
        guide(x, y, [0, 0], [4, 0]) +
        curvePath(clip(f1), 0, 4, x, y) +
        curvePath(clip(f2), 0, 4, x, y, dashed) +
        mark(x, y, 2, v1) +
        mark(x, y, 2, v2),
    );
    const answer = c1 * v1 + c2 * v2;
    const combo = `${c1 === -1 ? "-" : c1}y_1 ${c2 < 0 ? "-" : "+"} ${Math.abs(c2) === 1 ? "" : Math.abs(c2)}y_2`;
    return ask(
      [
        `The solid curve is $y_1$ and the dashed curve is $y_2$, both solutions of a homogeneous linear equation. The solution $y = ${combo}$ is also a solution. Find $y(2)$.`,
        `实线是 $y_1$，虚线是 $y_2$，都是齐次线性方程的解。$y = ${combo}$ 也是解。求 $y(2)$。`,
      ],
      answer,
      [c1 * v2 + c2 * v1, v1 + v2, c1 * v1 - c2 * v2, c1 + c2],
      [
        `At $t = 2$ the curves are at $y_1 = ${v1}$ and $y_2 = ${v2}$, so $y(2) = ${c1}(${v1}) + ${c2 < 0 ? `(${c2})` : c2}(${v2}) = ${answer}$.`,
        `在 $t = 2$ 处曲线位于 $y_1 = ${v1}$，$y_2 = ${v2}$，所以 $y(2) = ${c1}(${v1}) + ${c2 < 0 ? `(${c2})` : c2}(${v2}) = ${answer}$。`,
      ],
      figureOf(svg, [
        `A solid curve through (2, ${v1}) and a dashed curve through (2, ${v2}).`,
        `实线曲线过 (2, ${v1})，虚线曲线过 (2, ${v2})。`,
      ]),
    );
  },
);

const independentPair = point(
  "are-two-drawn-solutions-independent",
  ["Are two drawn solutions independent?", "两个所画的解线性无关吗？"],
  [
    "Two solutions are linearly dependent exactly when one is a constant multiple of the other, so their ratio does not change with time. In that case their Wronskian is zero at every time.",
    "两个解线性相关当且仅当一个是另一个的常数倍，也就是它们的比值不随时间变化。此时它们的朗斯基行列式处处为零。",
  ],
  (rng) => {
    const dependent = rng.bool();
    const shape = rng.int(0, 3);
    const v1 = rng.pick([1, 2, 3]);
    const factor = rng.pick([-2, -1, 2, 3]);
    const otherShape = (shape + rng.int(1, 3)) % 4;
    const f1 = shapeOf(shape, v1);
    const f2 = dependent ? (v: number) => factor * f1(v) : shapeOf(otherShape, v1 * factor);
    const clip = (f: (v: number) => number) => (v: number) => Math.max(-8, Math.min(8, f(v)));
    const svg = chart(
      [0, 4],
      [-8, 8],
      intTicks(0, 4),
      intTicks(-8, 8, 2),
      (x, y) => guide(x, y, [0, 0], [4, 0]) + curvePath(clip(f1), 0, 4, x, y) + curvePath(clip(f2), 0, 4, x, y, dashed),
    );
    const yes: Pair = ["Dependent: the Wronskian is zero at every time", "线性相关：朗斯基行列式处处为零"];
    const no: Pair = ["Independent: the Wronskian is not zero", "线性无关：朗斯基行列式不为零"];
    return choose(
      rng,
      [
        "The curves are two solutions of a second-order homogeneous linear equation. Which statement is true?",
        "两条曲线是二阶齐次线性方程的两个解。哪个说法正确？",
      ],
      dependent ? yes : no,
      [
        dependent ? no : yes,
        ["Dependent, because the curves have the same value at $t = 2$", "线性相关，因为曲线在 $t = 2$ 处的值相同"],
        ["Independent, because the curves are not the same curve", "线性无关，因为两条曲线不是同一条"],
      ],
      dependent
        ? [
            `The dashed curve is $${factor}$ times the solid curve at every time, so one is a constant multiple of the other.`,
            `在每个时刻，虚线都是实线的 $${factor}$ 倍，所以一个是另一个的常数倍。`,
          ]
        : [
            `The ratio of the two curves changes with time, so neither is a constant multiple of the other.`,
            `两条曲线的比值随时间变化，所以任何一个都不是另一个的常数倍。`,
          ],
      figureOf(
        svg,
        dependent
          ? [
              `A solid curve, and a dashed curve equal to ${factor} times it at every time.`,
              `实线曲线，以及处处等于它的 ${factor} 倍的虚线曲线。`,
            ]
          : ["Two curves whose ratio changes with time.", "比值随时间变化的两条曲线。"],
      ),
    );
  },
);

const straightLine = point(
  "the-eigenvalue-of-a-drawn-straight-line-solution",
  ["The eigenvalue of a drawn straight-line solution", "所画直线解的特征值"],
  [
    "If the direction $v$ of a straight line through the origin is an eigenvector of $A$, solutions of $x' = Ax$ that start on the line stay on it, and they are $x = ce^{\\lambda t}v$ with $Av = \\lambda v$. Read $v$ from the drawing and compute $Av$.",
    "若过原点直线的方向 $v$ 是 $A$ 的特征向量，$x' = Ax$ 从直线上出发的解就留在直线上，形如 $x = ce^{\\lambda t}v$，其中 $Av = \\lambda v$。从图中读出 $v$，再计算 $Av$。",
  ],
  (rng) => {
    const [v1, v2] = rng.pick<[Point, Point]>([
      [
        [1, 1],
        [1, 2],
      ],
      [
        [1, 2],
        [1, 3],
      ],
      [
        [1, 0],
        [1, 1],
      ],
      [
        [0, 1],
        [1, 1],
      ],
      [
        [1, -1],
        [1, -2],
      ],
      [
        [1, 1],
        [2, 1],
      ],
      [
        [1, 0],
        [2, 1],
      ],
      [
        [2, 1],
        [1, 1],
      ],
    ]);
    const det = v1[0] * v2[1] - v1[1] * v2[0];
    const [l1, l2] = rng.sample([-3, -2, -1, 1, 2, 3, 4], 2) as [number, number];
    // A = P diag(l1, l2) P^-1, with det P = ±1 so that the entries are whole numbers.
    const a = (l1 * v1[0] * v2[1] - l2 * v2[0] * v1[1]) / det;
    const b = (-l1 * v1[0] * v2[0] + l2 * v2[0] * v1[0]) / det;
    const c = (l1 * v1[1] * v2[1] - l2 * v2[1] * v1[1]) / det;
    const d = (-l1 * v1[1] * v2[0] + l2 * v2[1] * v1[0]) / det;
    const A = `\\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}`;
    const marks: PlaneMark[] = [
      { kind: "line", a: [0, 0], b: v1, accent: true },
      { kind: "point", at: [2 * v1[0], 2 * v1[1]] },
      { kind: "line", a: [0, 0], b: v2, dashed: true },
    ];
    return ask(
      [
        `The solid line and the dashed line carry the straight-line solutions of $x' = ${A}x$. Find the eigenvalue that belongs to the solid line.`,
        `实线和虚线上是 $x' = ${A}x$ 的直线解。求属于实线的特征值。`,
      ],
      l1,
      [l2, a + d, a * d - b * c, -l1],
      [
        `The solid line has direction $v = (${v1[0]}, ${v1[1]})$, and $Av = (${l1 * v1[0]}, ${l1 * v1[1]}) = ${l1}v$.`,
        `实线方向为 $v = (${v1[0]}, ${v1[1]})$，而 $Av = (${l1 * v1[0]}, ${l1 * v1[1]}) = ${l1}v$。`,
      ],
      drawn(
        { xMin: -6, xMax: 6, yMin: -6, yMax: 6 },
        marks,
        t(
          `Two lines through the origin: a solid one through (${2 * v1[0]}, ${2 * v1[1]}) and a dashed one with direction (${v2[0]}, ${v2[1]}).`,
          `两条过原点的直线：实线过 (${2 * v1[0]}, ${2 * v1[1]})，虚线方向为 (${v2[0]}, ${v2[1]})。`,
        ),
      ),
    );
  },
);

const traceDeterminant = point(
  "the-type-of-equilibrium-from-the-trace-determinant-plane",
  ["The type of equilibrium from the trace-determinant plane", "由迹-行列式平面判断平衡点类型"],
  [
    "For $x' = Ax$ with trace $T$ and determinant $D$: $D < 0$ is a saddle. If $D > 0$, the sign of $T$ decides stable or unstable, and the parabola $D = \\frac{T^2}{4}$ separates nodes, below it, from spirals, above it. $T = 0$ with $D > 0$ is a center.",
    "对迹为 $T$、行列式为 $D$ 的 $x' = Ax$：$D < 0$ 是鞍点。若 $D > 0$，$T$ 的符号决定稳定或不稳定，抛物线 $D = \\frac{T^2}{4}$ 把结点（下方）和螺旋点（上方）分开。$T = 0$ 且 $D > 0$ 是中心。",
  ],
  (rng) => {
    const T0 = rng.int(-6, 6);
    const D0 = rng.int(-4, 8);
    const pick = (T: number, D: number) => {
      if (D === 0) return null;
      if (D < 0) return "saddle" as const;
      if (T === 0) return "center" as const;
      if (T * T === 4 * D) return null;
      const spiral = T * T < 4 * D;
      return (T < 0 ? (spiral ? "stable-spiral" : "stable-node") : spiral ? "unstable-spiral" : "unstable-node") as
        | "stable-spiral"
        | "stable-node"
        | "unstable-spiral"
        | "unstable-node";
    };
    const T = T0;
    const D = pick(T0, D0) === null ? D0 + 1 : D0;
    const kind = pick(T, D) ?? "saddle";
    const names: Record<NonNullable<ReturnType<typeof pick>>, Pair> = {
      saddle: ["Saddle", "鞍点"],
      center: ["Center", "中心"],
      "stable-spiral": ["Stable spiral", "稳定螺旋点"],
      "stable-node": ["Stable node", "稳定结点"],
      "unstable-spiral": ["Unstable spiral", "不稳定螺旋点"],
      "unstable-node": ["Unstable node", "不稳定结点"],
    };
    const all = Object.keys(names) as (keyof typeof names)[];
    const wrong = rng.sample(
      all.filter((k) => k !== kind),
      3,
    );
    const marks: PlaneMark[] = [
      { kind: "curve", f: (v) => (v * v) / 4, dashed: true },
      { kind: "point", at: [T, D], label: "A", dir: "ne", accent: true },
    ];
    return choose(
      rng,
      [
        "In the plane of trace $T$ and determinant $D$, the point $A$ shows a matrix, and the dashed curve is $D = \\frac{T^2}{4}$. What type of equilibrium does $x' = Ax$ have at the origin?",
        "在迹 $T$ 和行列式 $D$ 的平面上，点 $A$ 表示一个矩阵，虚线是 $D = \\frac{T^2}{4}$。$x' = Ax$ 在原点的平衡点是什么类型？",
      ],
      names[kind],
      wrong.map((k) => names[k]),
      [
        `$A$ has $T = ${T}$ and $D = ${D}$. ${D < 0 ? "A negative determinant means a saddle." : T === 0 ? "Zero trace with a positive determinant means a center." : `The determinant is positive, $T$ is ${T < 0 ? "negative, so it is stable" : "positive, so it is unstable"}, and $A$ lies ${T * T < 4 * D ? "above the parabola, which means a spiral" : "below the parabola, which means a node"}.`}`,
        `$A$ 的 $T = ${T}$，$D = ${D}$。${D < 0 ? "行列式为负表示鞍点。" : T === 0 ? "迹为零且行列式为正表示中心。" : `行列式为正，$T$ ${T < 0 ? "为负，所以稳定" : "为正，所以不稳定"}，$A$ 在抛物线${T * T < 4 * D ? "上方，表示螺旋点" : "下方，表示结点"}。`}`,
      ],
      drawn(
        { xMin: -7, xMax: 7, yMin: -6, yMax: 10, xName: "T", yName: "D" },
        marks,
        t(`A dashed parabola D = T²/4 and the point A at T = ${T}, D = ${D}.`, `虚线抛物线 D = T²/4，点 A 位于 T = ${T}，D = ${D}。`),
      ),
    );
  },
);

const orthogonalFamily = point(
  "orthogonal-trajectories-of-a-drawn-family",
  ["Orthogonal trajectories of a drawn family", "所画曲线族的正交轨线"],
  [
    "For the family $y = cx^n$, eliminating $c$ gives $y' = \\frac{ny}{x}$. The orthogonal trajectories have the negative reciprocal slope, $y' = -\\frac{x}{ny}$, and separating variables gives $x^2 + ny^2 = K$.",
    "对曲线族 $y = cx^n$，消去 $c$ 得 $y' = \\frac{ny}{x}$。正交轨线的斜率为负倒数，$y' = -\\frac{x}{ny}$，分离变量得 $x^2 + ny^2 = K$。",
  ],
  (rng) => {
    const n = rng.int(1, 3);
    const cs = rng.sample([-2, -1, -0.5, -0.25, 0.25, 0.5, 1, 2], 4);
    const marks: PlaneMark[] = cs.map((c): PlaneMark => ({ kind: "curve", f: (v) => c * v ** n, accent: true }));
    const form = (k: number) => same(`x^2 + ${k === 1 ? "" : k}y^2 = K`);
    const name = n === 1 ? "y = cx" : `y = cx^${n}`;
    return choose(
      rng,
      [
        "The curves are members of the family $y = cx^n$, where $n$ is $1$, $2$ or $3$. Lines have $n = 1$, parabolas $n = 2$ and cubics $n = 3$. Which equation gives the orthogonal trajectories of the family?",
        "这些曲线属于曲线族 $y = cx^n$，$n$ 是 $1$、$2$ 或 $3$。直线对应 $n = 1$，抛物线对应 $n = 2$，三次曲线对应 $n = 3$。哪个方程给出该曲线族的正交轨线？",
      ],
      form(n),
      [...[1, 2, 3, 4].filter((k) => k !== n).map((k) => form(k)), same(`x^2 - ${n === 1 ? "" : n}y^2 = K`)].slice(0, 4),
      [
        `The curves are $${name}$, so $y' = ${n === 1 ? "\\frac{y}{x}" : `\\frac{${n}y}{x}`}$. The trajectories have $y' = -\\frac{x}{${n === 1 ? "" : n}y}$, and separating variables gives $x^2 + ${n === 1 ? "" : n}y^2 = K$.`,
        `曲线为 $${name}$，所以 $y' = ${n === 1 ? "\\frac{y}{x}" : `\\frac{${n}y}{x}`}$。正交轨线满足 $y' = -\\frac{x}{${n === 1 ? "" : n}y}$，分离变量得 $x^2 + ${n === 1 ? "" : n}y^2 = K$。`,
      ],
      drawn(
        { xMin: -4, xMax: 4, yMin: -4, yMax: 4 },
        marks,
        t(
          `Four ${["lines", "parabolas", "cubics"][n - 1]} through the origin, with c = ${cs.join(", ")}.`,
          `四条过原点的${["直线", "抛物线", "三次曲线"][n - 1]}，c = ${cs.join("、")}。`,
        ),
      ),
    );
  },
);

/** deeperFiguresDifferentialEquations2Points adds more knowledge points of Differential Equations that are answered by reading a drawing. */
export const deeperFiguresDifferentialEquations2Points: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "qualitative-analysis-of-first-order-odes": [longRunFromRightSide],
  "equilibrium-solutions-of-first-order-odes": [stableRoot],
  "exponential-growth-and-decay-models-with-first-order-odes": [growthPoints],
  "exponential-growth-and-decay-models-with-first-order-odes-calculating-unknown-times-and-initial-values": [decayTime],
  "logistic-growth-models-with-first-order-odes": [logisticPeak],
  "inhibited-growth-models-with-first-order-odes": [inhibitedRate],
  "inhibited-decay-models-with-first-order-odes": [coolingLimit],
  "falling-body-problems-with-linear-drag": [terminalDrag],
  "modeling-rc-circuits-with-first-order-odes": [rcCircuit],
  "modeling-rl-circuits-with-first-order-odes": [rlCircuit],
  "second-order-homogeneous-odes-characteristic-equations-with-repeated-roots": [repeatedRoot],
  "simple-harmonic-oscillators": [oscillatorFrequency],
  "damped-oscillators": [dampingKind],
  "resonance-in-vibrating-systems": [resonance],
  "the-superposition-principle": [superposition],
  "linear-independence-of-solutions-to-homogeneous-odes": [independentPair],
  "solving-homogeneous-systems-of-odes-with-distinct-eigenvalues": [straightLine],
  "equilibrium-points-and-stability-for-systems-of-odes": [traceDeterminant],
  "orthogonal-trajectories": [orthogonalFamily],
};
