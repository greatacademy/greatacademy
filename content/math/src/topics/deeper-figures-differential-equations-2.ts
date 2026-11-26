// More knowledge points of Differential Equations that ask the learner to read a drawing: graphs of the right side,
// solution curves of growth and circuit models, oscillators, solution pairs, straight-line solutions and the
// trace-determinant plane. See `deeperFiguresDifferentialEquations2Points`.

import type { Figure, KnowledgePointDef, Rng } from "@ga/content";
import { t } from "@ga/content";
import type { PlaneMark, Point } from "@ga/subject-math";
import { Q } from "@ga/subject-math";
import { calculusDrawings5 } from "../explanation-drawings-calculus-5.ts";
import { differentialEquationsDrawings1 } from "../explanation-drawings-differential-equations-1.ts";
import { explainedChoice, numberProblem } from "../problems.ts";

import { type Pair, point, same } from "../university-kit.ts";
import { type Step, walked } from "./calculus-i-differentiation.ts";
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

/** Because is a wrong value or option with its reason in English and Chinese. */
type Because<T> = readonly [wrong: T, en: string, zh: string];

/** stepOf is a labelled step of a worked solution with what it says and its displayed lines. */
const stepOf = (title: Pair, said: Pair, ...lines: string[]): Step => [title, t(...said), lines];

/** figureNumber asks for a number read from a drawing, explained in labelled steps with a check, keeping the first reason for each wrong value. */
function figureNumber(
  prompt: Pair,
  answer: number | Q,
  parts: readonly Step[],
  check: Pair,
  reasons: readonly Because<number | Q>[],
  figure: Figure,
) {
  const q = (v: number | Q) => (typeof v === "number" ? Q.of(v) : v);
  const right = q(answer);
  const kept = reasons.filter((r, i) => !q(r[0]).eq(right) && reasons.findIndex((s) => q(s[0]).eq(q(r[0]))) === i);
  const problem = numberProblem({
    prompt: t(...prompt),
    answer: right,
    mistakes: kept.map(([value, en, zh]) => ({ value: q(value), why: t(en, zh) })),
    solution: walked(parts, t(...check)),
  });
  return { ...problem, figure };
}

/** figureChoice asks a choice about a drawing whose wrong options each have a reason, explained in labelled steps with a check. */
function figureChoice(
  rng: Rng,
  prompt: Pair,
  correct: Pair,
  wrong: readonly Because<Pair>[],
  parts: readonly Step[],
  check: Pair,
  figure: Figure,
) {
  return explainedChoice(rng, {
    prompt: t(...prompt),
    correct: t(...correct),
    wrong: wrong.map(([option, en, zh]) => ({ option: t(...option), why: t(en, zh) })),
    solution: walked(parts, t(...check)),
    figure,
  });
}

const longRunFromRightSide = {
  ...point(
    "the-long-run-from-a-graph-of-the-right-side",
    ["The long run from a graph of the right side", "由右端的图像判断长期行为"],
    [
      "For $y' = f(y)$, the solution rises where the graph of $f$ is above zero and falls where it is below. It moves until it meets the next root in that direction, or runs off without bound if there is none. For example, if $f$ has roots $-2$, $1$ and $4$ and is positive between $-2$ and $1$, the solution with $y(0) = 0$ rises to $1$.\n\nCheck: $f(1) = 0$, so the constant $y = 1$ is a solution, and the rising solution cannot cross it.\n\n> **Watch out.** A root on the far side of the start is never reached: from $y(0) = 0$ the solution moves away from $-2$.",
      "对 $y' = f(y)$，在 $f$ 的图像位于零线上方时解上升，位于下方时解下降。解一直运动到该方向的下一个根；如果没有根，就无限远离。例如 $f$ 的根是 $-2$、$1$ 和 $4$，且在 $-2$ 与 $1$ 之间为正，那么满足 $y(0) = 0$ 的解上升到 $1$。\n\n检验：$f(1) = 0$，所以常数 $y = 1$ 是解，上升的解无法越过它。\n\n> **注意。** 起点另一侧的根永远到不了：从 $y(0) = 0$ 出发，解远离 $-2$。",
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
      const away = rising ? "\\infty" : "-\\infty";
      const name = (r: number | null): Pair => (r === null ? same(`y \\to ${away}`) : same(`y \\to ${r}`));
      const wrong: Because<Pair>[] = roots
        .filter((r) => r !== target)
        .map(
          (r): Because<Pair> =>
            (rising ? r < y0 : r > y0)
              ? [
                  same(`y \\to ${r}`),
                  `The graph is ${rising ? "above" : "below"} zero at $y = ${y0}$, so $y$ ${rising ? "rises" : "falls"}, away from $${r}$`,
                  `在 $y = ${y0}$ 处图像在零线${rising ? "上方" : "下方"}，所以 $y$ ${rising ? "上升" : "下降"}，远离 $${r}$`,
                ]
              : [
                  same(`y \\to ${r}`),
                  `To reach $${r}$ the solution would have to cross the root $${target}$, an equilibrium it cannot cross`,
                  `要到达 $${r}$，解必须越过根 $${target}$，而平衡解是无法越过的`,
                ],
        );
      wrong.push(
        target === null
          ? [same(`y \\to ${y0}`), `$f(${y0}) \\ne 0$, so the solution does not stay at its start`, `$f(${y0}) \\ne 0$，所以解不会停在起点`]
          : [
              same(`y \\to ${away}`),
              `The root $${target}$ stops it: the solution cannot cross an equilibrium`,
              `根 $${target}$ 挡住了它：解无法越过平衡解`,
            ],
      );
      return figureChoice(
        rng,
        [
          `The graph shows $f(y)$ for the equation $y' = f(y)$. What happens to the solution with $y(0) = ${y0}$ as $t$ grows?`,
          `图中是方程 $y' = f(y)$ 的 $f(y)$。当 $t$ 增大时，满足 $y(0) = ${y0}$ 的解如何变化？`,
        ],
        name(target),
        wrong,
        [
          stepOf(
            ["Read the sign at the start", "看起点处的符号"],
            [
              `At $y = ${y0}$ the graph is ${rising ? "above" : "below"} zero, so $y' ${rising ? ">" : "<"} 0$ and $y$ ${rising ? "rises" : "falls"}.`,
              `在 $y = ${y0}$ 处图像在零线${rising ? "上方" : "下方"}，所以 $y' ${rising ? ">" : "<"} 0$，$y$ ${rising ? "上升" : "下降"}。`,
            ],
          ),
          stepOf(
            ["Find the first root in that direction", "找这个方向上的第一个根"],
            target === null
              ? [
                  `The roots are $${roots.join(", ")}$, and none lies ${rising ? "above" : "below"} $${y0}$, so $y$ grows without bound.`,
                  `根是 ${roots.map((r) => `$${r}$`).join("、")}，没有一个在 $${y0}$ ${rising ? "上方" : "下方"}，所以 $y$ 无限远离。`,
                ]
              : [
                  `The roots are $${roots.join(", ")}$; the first one ${rising ? "above" : "below"} $${y0}$ is $${target}$, so $y \\to ${target}$.`,
                  `根是 ${roots.map((r) => `$${r}$`).join("、")}；$${y0}$ ${rising ? "上方" : "下方"}的第一个根是 $${target}$，所以 $y \\to ${target}$。`,
                ],
          ),
        ],
        target === null
          ? [
              `Beyond the last root the graph keeps its sign, so $y'$ stays ${rising ? "positive" : "negative"} along the whole way and nothing stops the solution.`,
              `越过最后一个根后图像不再变号，所以一路上 $y'$ 始终${rising ? "为正" : "为负"}，没有什么能挡住这个解。`,
            ]
          : [
              `$f(${target}) = 0$, so the constant $y = ${target}$ is a solution, which the moving solution cannot cross; between $${y0}$ and $${target}$ the graph has no root, so $y$ keeps ${rising ? "rising" : "falling"} toward it.`,
              `$f(${target}) = 0$，所以常数 $y = ${target}$ 是解，运动的解无法越过它；在 $${y0}$ 与 $${target}$ 之间图像没有根，所以 $y$ 一直${rising ? "上升" : "下降"}趋于它。`,
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
      "A root of $f$ is a stable equilibrium of $y' = f(y)$ when $f$ crosses from positive to negative there as $y$ increases, since solutions on both sides then move toward it. For example, if $f$ is positive between the roots $-1$ and $3$ and negative outside them, it crosses from positive to negative at $3$, so $y = 3$ is stable.\n\nCheck: from $y(0) = 2$ the slope is positive and from $y(0) = 4$ it is negative, so both solutions move toward $3$.\n\n> **Watch out.** Look at the direction of the crossing, not at which root is larger or where the graph is highest.",
      "当 $y$ 增大时 $f$ 在根处由正变负，这个根就是 $y' = f(y)$ 的稳定平衡，因为两侧的解都向它移动。例如 $f$ 在根 $-1$ 与 $3$ 之间为正、在两侧之外为负，它在 $3$ 处由正变负，所以 $y = 3$ 是稳定的。\n\n检验：从 $y(0) = 2$ 出发斜率为正，从 $y(0) = 4$ 出发斜率为负，所以两个解都向 $3$ 移动。\n\n> **注意。** 要看穿过零线的方向，而不是看哪个根更大，也不是看图像哪里最高。",
    ],
    (rng) => {
      const { roots, f, figure } = rightSide(rng, 2);
      const [a, b] = roots as [number, number];
      const stable = f((a + b) / 2) < 0 ? a : b;
      const other = stable === a ? b : a;
      const middle = f((a + b) / 2) > 0;
      return figureChoice(
        rng,
        [
          "The graph shows $f(y)$ for the equation $y' = f(y)$. Which equilibrium is stable?",
          "图中是方程 $y' = f(y)$ 的 $f(y)$。哪个平衡是稳定的？",
        ],
        same(`y = ${stable}`),
        [
          [
            same(`y = ${other}`),
            `At $y = ${other}$ the graph goes from below zero to above zero as $y$ increases, so nearby solutions move away from it`,
            `在 $y = ${other}$ 处，随 $y$ 增大图像由零线下方变到上方，所以附近的解远离它`,
          ],
          [
            ["Both of them", "两个都是"],
            `Only the crossing at $${stable}$ goes from positive to negative`,
            `只有 $${stable}$ 处是由正变负`,
          ],
          [
            ["Neither of them", "两个都不是"],
            `At $${stable}$ the graph crosses from positive to negative, so solutions on both sides move toward it`,
            `在 $${stable}$ 处图像由正变负，所以两侧的解都向它移动`,
          ],
        ],
        [
          stepOf(
            ["Read the signs", "看符号"],
            [
              `Between $${a}$ and $${b}$ the graph is ${middle ? "above" : "below"} zero, and outside them it is ${middle ? "below" : "above"}.`,
              `在 $${a}$ 与 $${b}$ 之间图像在零线${middle ? "上方" : "下方"}，在它们之外在${middle ? "下方" : "上方"}。`,
            ],
          ),
          stepOf(
            ["Find the crossing from positive to negative", "找由正变负的根"],
            [
              `As $y$ increases the graph crosses from positive to negative at $y = ${stable}$, so that equilibrium is stable; at $y = ${other}$ it crosses the other way.`,
              `随 $y$ 增大，图像在 $y = ${stable}$ 处由正变负，所以这个平衡是稳定的；在 $y = ${other}$ 处方向相反。`,
            ],
          ),
        ],
        [
          `Try a start on each side: from $y(0) = ${stable - 1}$ the graph is above zero, so $y$ rises toward $${stable}$, and from $y(0) = ${stable + 1}$ it is below zero, so $y$ falls toward $${stable}$.`,
          `在两侧各取一个起点：从 $y(0) = ${stable - 1}$ 出发图像在零线上方，$y$ 上升趋于 $${stable}$；从 $y(0) = ${stable + 1}$ 出发图像在零线下方，$y$ 下降趋于 $${stable}$。`,
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
    "Solutions of $y' = ky$ with $k > 0$ double in equal times. Read the doubling time from two marked points, then count how many doublings fit into the time you want. For example, a curve through $(0, 3)$ and $(2, 6)$ doubles every $2$, so by $t = 8$ it has doubled $4$ times: $y(8) = 3 \\cdot 2^{4} = 48$.\n\nCheck: $3 \\to 6 \\to 12 \\to 24 \\to 48$ at $t = 0, 2, 4, 6, 8$.\n\n> **Watch out.** The exponent is the number of doublings, $\\frac{8}{2} = 4$, not the time $8$.",
    "$k > 0$ 时 $y' = ky$ 的解每隔相等的时间翻倍。由两个标记点读出倍增时间，再数所求时间内翻了几倍。例如曲线过 $(0, 3)$ 和 $(2, 6)$，每隔 $2$ 翻倍，到 $t = 8$ 时翻倍 $4$ 次：$y(8) = 3 \\cdot 2^{4} = 48$。\n\n检验：在 $t = 0, 2, 4, 6, 8$ 时依次为 $3 \\to 6 \\to 12 \\to 24 \\to 48$。\n\n> **注意。** 指数是翻倍的次数 $\\frac{8}{2} = 4$，而不是时间 $8$。",
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
    const chain = Array.from({ length: k + 1 }, (_, i) => `${A * 2 ** i}`).join(" \\to ");
    const times = Array.from({ length: k + 1 }, (_, i) => `${i * T}`).join(", ");
    return figureNumber(
      [
        `The curve solves $y' = ky$ and passes through the marked points. Find $y(${k * T})$.`,
        `这条曲线是 $y' = ky$ 的解，并过标记点。求 $y(${k * T})$。`,
      ],
      answer,
      [
        stepOf(
          ["Read the doubling time", "读出倍增时间"],
          [
            `The curve goes from $${A}$ at $t = 0$ to $${2 * A}$ at $t = ${T}$, so it doubles every $${T}$.`,
            `曲线从 $t = 0$ 时的 $${A}$ 变到 $t = ${T}$ 时的 $${2 * A}$，所以每隔 $${T}$ 翻倍。`,
          ],
        ),
        stepOf(
          ["Count the doublings", "数翻倍的次数"],
          [
            `By $t = ${k * T}$ it has doubled $\\frac{${k * T}}{${T}} = ${k}$ times:`,
            `到 $t = ${k * T}$ 时翻倍了 $\\frac{${k * T}}{${T}} = ${k}$ 次：`,
          ],
          `y(${k * T}) = ${A} \\cdot 2^{${k}} = ${answer}`,
        ),
      ],
      [`Double step by step: $${chain}$ at $t = ${times}$.`, `逐次翻倍：在 $t = ${times}$ 时依次为 $${chain}$。`],
      [
        [
          2 * k * A,
          `This multiplies by $2 \\cdot ${k}$; doubling $${k}$ times multiplies by $2^{${k}}$`,
          `这里乘了 $2 \\cdot ${k}$；翻倍 $${k}$ 次应乘以 $2^{${k}}$`,
        ],
        [
          A * k * T,
          `This multiplies $${A}$ by the time $${k * T}$; the curve doubles every $${T}$ instead`,
          `这里用 $${A}$ 乘以时间 $${k * T}$；曲线其实是每隔 $${T}$ 翻倍`,
        ],
        [
          answer / 2,
          `One doubling too few: starting from $${A}$ at $t = 0$, there are $${k}$ doublings by $t = ${k * T}$`,
          `少翻了一倍：从 $t = 0$ 时的 $${A}$ 开始，到 $t = ${k * T}$ 共翻倍 $${k}$ 次`,
        ],
        [
          2 * answer,
          `One doubling too many: there are $${k}$ doublings by $t = ${k * T}$, not $${k + 1}$`,
          `多翻了一倍：到 $t = ${k * T}$ 共翻倍 $${k}$ 次，而不是 $${k + 1}$ 次`,
        ],
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
    "Solutions of $y' = -ky$ halve in equal times. Read the half-life from two marked points, then count how many halvings lead to the value you want. For example, a curve through $(0, 64)$ and $(3, 32)$ has half-life $3$, and $64$ falls to $8$ in $3$ halvings, so it reaches $8$ at $t = 9$.\n\nCheck: $64 \\to 32 \\to 16 \\to 8$ at $t = 0, 3, 6, 9$.\n\n> **Watch out.** Multiply the half-life by the number of halvings, $3$, not by the ratio $8$.",
    "$y' = -ky$ 的解每隔相等的时间减半。由两个标记点读出半衰期，再数减半多少次到达所求的值。例如曲线过 $(0, 64)$ 和 $(3, 32)$，半衰期为 $3$；$64$ 减半 $3$ 次降到 $8$，所以在 $t = 9$ 时到达 $8$。\n\n检验：在 $t = 0, 3, 6, 9$ 时依次为 $64 \\to 32 \\to 16 \\to 8$。\n\n> **注意。** 要用半衰期乘以减半的次数 $3$，而不是乘以比值 $8$。",
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
    const chain = Array.from({ length: k + 1 }, (_, i) => `${A / 2 ** i}`).join(" \\to ");
    const times = Array.from({ length: k + 1 }, (_, i) => `${i * h}`).join(", ");
    return figureNumber(
      [
        `The curve solves $y' = -ky$ and passes through the marked points. At what time does $y$ equal $${target}$?`,
        `这条曲线是 $y' = -ky$ 的解，并过标记点。$y$ 何时等于 $${target}$？`,
      ],
      answer,
      [
        stepOf(
          ["Read the half-life", "读出半衰期"],
          [
            `The curve falls from $${A}$ at $t = 0$ to $${A / 2}$ at $t = ${h}$, so the half-life is $${h}$.`,
            `曲线从 $t = 0$ 时的 $${A}$ 降到 $t = ${h}$ 时的 $${A / 2}$，所以半衰期为 $${h}$。`,
          ],
        ),
        stepOf(
          ["Count the halvings", "数减半的次数"],
          [
            `From $${A}$ to $${target}$ is a factor of $${2 ** k} = 2^{${k}}$, so $${k}$ halvings:`,
            `从 $${A}$ 到 $${target}$ 缩小为 $\\frac{1}{${2 ** k}} = \\frac{1}{2^{${k}}}$，即减半 $${k}$ 次：`,
          ],
          `t = ${k} \\cdot ${h} = ${answer}`,
        ),
      ],
      [`Halve step by step: $${chain}$ at $t = ${times}$.`, `逐次减半：在 $t = ${times}$ 时依次为 $${chain}$。`],
      [
        [
          h,
          `$${h}$ is the time for one halving; reaching $${target}$ takes $${k}$ halvings`,
          `$${h}$ 是减半一次的时间；到达 $${target}$ 需要减半 $${k}$ 次`,
        ],
        [k, `$${k}$ is the number of halvings; multiply it by the half-life $${h}$`, `$${k}$ 是减半的次数；还要乘以半衰期 $${h}$`],
        [
          2 ** k * h,
          `This multiplies the half-life by the ratio $${2 ** k}$; multiply by the number of halvings, $${k}$`,
          `这里用半衰期乘以比值 $${2 ** k}$；应当乘以减半的次数 $${k}$`,
        ],
        [
          (k + 1) * h,
          `One halving too many: $${k}$ halvings take $${A}$ down to $${target}$`,
          `多减半了一次：减半 $${k}$ 次就从 $${A}$ 降到 $${target}$`,
        ],
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
    "For $y' = ry\\left(1 - \\frac{y}{K}\\right)$, the curve levels off at the carrying capacity $K$. Growth is fastest at $y = \\frac{K}{2}$, where the rate is $\\frac{rK}{4}$. For example, for $y' = 2y\\left(1 - \\frac{y}{10}\\right)$ the curve levels off at $10$, and growth is fastest at $y = 5$, with rate $2 \\cdot 5 \\cdot \\frac{1}{2} = 5$.\n\nCheck: $2y\\left(1 - \\frac{y}{10}\\right) = 5 - \\frac{1}{5}(y - 5)^{2}$, which is at most $5$.\n\n> **Watch out.** Growth is fastest at half the capacity, not at the capacity, where it has stopped.",
    "对 $y' = ry\\left(1 - \\frac{y}{K}\\right)$，曲线趋于环境容量 $K$。在 $y = \\frac{K}{2}$ 处增长最快，此时速率为 $\\frac{rK}{4}$。例如对 $y' = 2y\\left(1 - \\frac{y}{10}\\right)$，曲线趋于 $10$，在 $y = 5$ 处增长最快，速率为 $2 \\cdot 5 \\cdot \\frac{1}{2} = 5$。\n\n检验：$2y\\left(1 - \\frac{y}{10}\\right) = 5 - \\frac{1}{5}(y - 5)^{2}$，最大为 $5$。\n\n> **注意。** 增长最快是在环境容量的一半处，而不是在环境容量处，那里增长已经停止。",
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
    const rCo = rn === rd ? "" : `${rText}`;
    const figure = figureOf(svg, [`An S-shaped curve that levels off at the dashed line y = ${K}.`, `S 形曲线，趋于虚线 y = ${K}。`]);
    const capacity = stepOf(
      ["Read the capacity", "读出环境容量"],
      [`The curve levels off at the dashed line, so $K = ${K}$.`, `曲线趋于虚线，所以 $K = ${K}$。`],
    );
    if (kind === "rate") {
      return figureNumber(
        [
          `The curve solves $y' = ${rText}\\,y\\left(1 - \\frac{y}{K}\\right)$, and the dashed line is its limit. Find the largest value of $y'$.`,
          `这条曲线是 $y' = ${rText}\\,y\\left(1 - \\frac{y}{K}\\right)$ 的解，虚线是它的极限。求 $y'$ 的最大值。`,
        ],
        rate,
        [
          capacity,
          stepOf(
            ["Evaluate at half the capacity", "在环境容量的一半处求值"],
            [
              `The growth rate is a parabola in $y$ with zeros $0$ and $${K}$, largest at $y = ${K / 2}$:`,
              `增长率是 $y$ 的抛物线，零点为 $0$ 和 $${K}$，在 $y = ${K / 2}$ 处最大：`,
            ],
            `${rCo} \\cdot ${K / 2}\\left(1 - \\frac{${K / 2}}{${K}}\\right) = ${rate.toLatex()}`.replace(/^ \\cdot /, ""),
          ),
        ],
        [
          `Complete the square: $${rCo}y\\left(1 - \\frac{y}{${K}}\\right) = ${rate.toLatex()} - ${Q.of(rn, rd * K).toLatex()}\\left(y - ${K / 2}\\right)^{2}$, which is never more than $${rate.toLatex()}$ and equals it at $y = ${K / 2}$.`,
          `配方：$${rCo}y\\left(1 - \\frac{y}{${K}}\\right) = ${rate.toLatex()} - ${Q.of(rn, rd * K).toLatex()}\\left(y - ${K / 2}\\right)^{2}$，它从不超过 $${rate.toLatex()}$，在 $y = ${K / 2}$ 处取到。`,
        ],
        [
          [
            Q.of(rn * K, rd * 2),
            "This leaves out the factor $1 - \\frac{y}{K} = \\frac{1}{2}$ at the peak",
            "这里漏掉了峰值处的因子 $1 - \\frac{y}{K} = \\frac{1}{2}$",
          ],
          [
            Q.of(rn * K, rd),
            "This is $rK$, as if growth stayed exponential up to the capacity; it is zero there",
            "这是 $rK$，好像增长一直是指数式的直到环境容量；其实那里增长为零",
          ],
          [Q.of(K, 4), `This leaves out the rate $r = ${rText}$`, `这里漏掉了速率 $r = ${rText}$`],
          [
            Q.of(K, 2),
            `$${K / 2}$ is the value of $y$ where growth is fastest, not the largest $y'$`,
            `$${K / 2}$ 是增长最快时 $y$ 的值，不是 $y'$ 的最大值`,
          ],
        ],
        figure,
      );
    }
    return figureNumber(
      [
        `The curve solves $y' = ${rText}\\,y\\left(1 - \\frac{y}{K}\\right)$, and the dashed line is its limit. At what value of $y$ is the growth fastest?`,
        `这条曲线是 $y' = ${rText}\\,y\\left(1 - \\frac{y}{K}\\right)$ 的解，虚线是它的极限。$y$ 为何值时增长最快？`,
      ],
      Q.of(K, 2),
      [
        capacity,
        stepOf(
          ["Take half the capacity", "取环境容量的一半"],
          [
            `The growth rate is a parabola in $y$ with zeros $0$ and $${K}$, so it is largest halfway, at $y = ${K / 2}$.`,
            `增长率是 $y$ 的抛物线，零点为 $0$ 和 $${K}$，所以在正中间 $y = ${K / 2}$ 处最大。`,
          ],
        ),
      ],
      [
        `Differentiate the equation: $y'' = ${rCo}y'\\left(1 - \\frac{2y}{${K}}\\right)$, which is zero at $y = ${K / 2}$. That is the curve's point of inflection, where its slope stops increasing.`,
        `对方程求导：$y'' = ${rCo}y'\\left(1 - \\frac{2y}{${K}}\\right)$，在 $y = ${K / 2}$ 处为零。这是曲线的拐点，斜率在那里停止增大。`,
      ],
      [
        [K, "At the capacity growth has stopped: $y' = 0$ there", "在环境容量处增长已经停止：那里 $y' = 0$"],
        [
          Q.of(K, 4),
          `At $y = ${Q.of(K, 4).toLatex()}$ growth is still speeding up: $y'' > 0$ there`,
          `在 $y = ${Q.of(K, 4).toLatex()}$ 处增长仍在加快：那里 $y'' > 0$`,
        ],
        [
          Q.of(3 * K, 4),
          `At $y = ${Q.of(3 * K, 4).toLatex()}$ the curve is past its inflection, and growth is slowing`,
          `在 $y = ${Q.of(3 * K, 4).toLatex()}$ 处曲线已过拐点，增长在变慢`,
        ],
        [
          rate,
          `$${rate.toLatex()}$ is the largest value of $y'$, not the value of $y$ where it happens`,
          `$${rate.toLatex()}$ 是 $y'$ 的最大值，不是取到它时 $y$ 的值`,
        ],
      ],
      figure,
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
    "For $y' = k(L - y)$, the curve approaches the limit $L$. The tangent at $t = 0$ has slope $k(L - y(0))$, so it reaches the level $L$ at exactly $t = \\frac{1}{k}$.\n\n> **Watch out.** The time where the tangent meets the limit is $\\frac{1}{k}$, not $k$. A tangent that reaches the limit at $t = 4$ means $k = \\frac{1}{4}$.",
    "对 $y' = k(L - y)$，曲线趋于极限 $L$。$t = 0$ 处切线的斜率为 $k(L - y(0))$，所以它恰好在 $t = \\frac{1}{k}$ 时到达水平 $L$。\n\n> **注意。** 切线与极限相交的时刻是 $\\frac{1}{k}$，不是 $k$。切线在 $t = 4$ 时到达极限，说明 $k = \\frac{1}{4}$。",
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
    const k = Q.of(1, tau);
    return figureNumber(
      kind === "k"
        ? [
            `The curve solves $y' = k(L - y)$. The horizontal dashed line is its limit, and the slanted dashed line is its tangent at $t = 0$. Find $k$.`,
            `这条曲线是 $y' = k(L - y)$ 的解。水平虚线是它的极限，斜虚线是它在 $t = 0$ 处的切线。求 $k$。`,
          ]
        : [
            `The curve solves $y' = k(L - y)$. The horizontal dashed line is its limit, and the slanted dashed line is its tangent at $t = 0$. Find $y'(0)$.`,
            `这条曲线是 $y' = k(L - y)$ 的解。水平虚线是它的极限，斜虚线是它在 $t = 0$ 处的切线。求 $y'(0)$。`,
          ],
      kind === "k" ? k : start,
      [
        stepOf(
          ["Read the tangent", "读出切线"],
          [`The tangent climbs from $${y0}$ to the limit $${L}$ in time $${tau}$.`, `切线在时间 $${tau}$ 内从 $${y0}$ 升到极限 $${L}$。`],
          `y'(0) = (${L} - ${y0}) \\div ${tau} = ${start.toLatex()}`,
        ),
        stepOf(
          ["Divide by the gap", "除以差距"],
          ["Since $y'(0) = k(L - y(0))$:", "由于 $y'(0) = k(L - y(0))$："],
          `k = ${start.toLatex()} \\div ${L - y0} = ${k.toLatex()}`,
        ),
      ],
      [
        `With $k = ${k.toLatex()}$ the tangent reaches the limit at $t = \\frac{1}{k} = ${tau}$, where the drawing shows it.`,
        `取 $k = ${k.toLatex()}$，切线在 $t = \\frac{1}{k} = ${tau}$ 时到达极限，与图一致。`,
      ],
      kind === "k"
        ? [
            [
              tau,
              "That is the time $\\frac{1}{k}$ where the tangent meets the limit; take its reciprocal.",
              "这是切线与极限相交的时刻 $\\frac{1}{k}$；要取倒数。",
            ],
            [start, "That is the starting slope $y'(0)$; divide it by $L - y(0)$.", "这是初始斜率 $y'(0)$；还要除以 $L - y(0)$。"],
            [
              Q.of(1, L),
              "That divides by the limit instead of reading the time where the tangent meets it.",
              "这除以了极限值，而应读出切线与它相交的时刻。",
            ],
          ]
        : [
            [k, "That is $k$; the slope is $k$ times the gap $L - y(0)$.", "这是 $k$；斜率是 $k$ 乘以差距 $L - y(0)$。"],
            [L - y0, "That is the rise of the tangent; divide by the time it takes.", "这是切线升高的量；还要除以所用时间。"],
            [Q.of(L, tau), "That measures the rise from $0$ instead of from $y(0)$.", "这从 $0$ 而不是从 $y(0)$ 量升高。"],
            [Q.of(tau, L - y0), "That divides the run by the rise, upside down.", "这用水平距离除以升高，颠倒了。"],
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
    "Inhibited decay $y' = -k(y - L)$ falls toward the limit $L$, the temperature of the surroundings. At any time, the rate of change is $-k$ times the distance above the limit.\n\n> **Watch out.** Measure from the dashed limit, not from zero. With $L = 20$, $k = \\frac{1}{5}$ and $y = 30$, $y' = -\\frac{1}{5} \\cdot 10 = -2$, not $-\\frac{1}{5} \\cdot 30 = -6$.",
    "受限衰减 $y' = -k(y - L)$ 下降并趋于极限 $L$，即环境温度。任何时刻的变化率都是 $-k$ 乘以高出极限的距离。\n\n> **注意。** 要从虚线极限量起，而不是从零。若 $L = 20$，$k = \\frac{1}{5}$，$y = 30$，则 $y' = -\\frac{1}{5} \\cdot 10 = -2$，不是 $-\\frac{1}{5} \\cdot 30 = -6$。",
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
    return figureNumber(
      [
        `The curve shows a temperature with $y' = -k(y - L)$ and $k = \\frac{1}{${tau}}$. The dashed line is its limit. Find $y'$ at the moment when $y = ${now}$.`,
        `曲线表示温度，满足 $y' = -k(y - L)$，$k = \\frac{1}{${tau}}$。虚线是它的极限。求 $y = ${now}$ 时的 $y'$。`,
      ],
      answer,
      [
        stepOf(
          ["Read the limit", "读出极限"],
          ["The dashed line is the temperature of the surroundings.", "虚线是环境温度。"],
          `L = ${L}, \\qquad y - L = ${now} - ${L} = ${now - L}`,
        ),
        stepOf(["Apply the law", "代入定律"], ["", ""], `y' = -\\frac{1}{${tau}} \\cdot ${now - L} = ${answer.toLatex()}`),
      ],
      [
        `The rate is negative because $y = ${now}$ is above the limit $${L}$, so the temperature is still falling, and it is smaller in size than the starting rate $\\frac{${y0 - L}}{${tau}}$.`,
        `变化率为负，因为 $y = ${now}$ 高于极限 $${L}$，温度仍在下降；它的大小也小于初始速率 $\\frac{${y0 - L}}{${tau}}$。`,
      ],
      [
        [Q.of(now - L, tau), "The sign is lost: above the limit the temperature falls.", "丢了负号：高于极限时温度下降。"],
        [Q.of(-now, tau), "That measures from zero instead of from the limit $L$.", "这从零量起，而应从极限 $L$ 量起。"],
        [Q.of(-(y0 - L), tau), `That uses the starting temperature instead of $y = ${now}$.`, `这用了初始温度，而不是 $y = ${now}$。`],
        [Q.of(-(now - L), 1), "That forgets to multiply by $k$.", "这忘了乘以 $k$。"],
      ],
      figureOf(svg, [`A curve falling from ${y0} toward the dashed limit ${L}.`, `从 ${y0} 下降并趋于虚线极限 ${L} 的曲线。`]),
    );
  },
);

const terminalDrag = point(
  "linear-drag-from-a-drawn-velocity-curve",
  ["Linear drag from a drawn velocity curve", "由所画的速度曲线求线性阻力"],
  [
    "With linear drag, $v' = g - cv$. The velocity levels off when $v' = 0$, at the terminal velocity $v_T = \\frac{g}{c}$, so reading $v_T$ gives $c$.\n\n> **Watch out.** Solve $g = cv_T$ for $c$: it is $\\frac{g}{v_T}$, not $\\frac{v_T}{g}$. A curve levelling off at $20$ with $g = 10$ gives $c = \\frac{1}{2}$, not $2$.",
    "线性阻力下 $v' = g - cv$。速度在 $v' = 0$ 时趋于稳定，终端速度为 $v_T = \\frac{g}{c}$，所以读出 $v_T$ 就得到 $c$。\n\n> **注意。** 由 $g = cv_T$ 解出 $c$：它是 $\\frac{g}{v_T}$，不是 $\\frac{v_T}{g}$。曲线趋于 $20$、$g = 10$ 时，$c = \\frac{1}{2}$，不是 $2$。",
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
    return figureNumber(
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
      [
        stepOf(["Read the limit", "读出极限"], ["The velocity levels off where $v' = 0$.", "速度在 $v' = 0$ 处趋于稳定。"], `v_T = ${vT}`),
        kind === "c"
          ? stepOf(["Solve for c", "解出 c"], ["", ""], `10 - c \\cdot ${vT} = 0, \\qquad c = 10 \\div ${vT} = ${c.toLatex()}`)
          : stepOf(
              ["Solve for b", "解出 b"],
              ["", ""],
              `10 \\cdot ${m} - b \\cdot ${vT} = 0, \\qquad b = ${10 * m} \\div ${vT} = ${answer.toLatex()}`,
            ),
      ],
      kind === "c"
        ? [
            `At $v = ${vT}$, $v' = 10 - ${c.toLatex()} \\cdot ${vT} = 0$, so the curve is level there.`,
            `在 $v = ${vT}$ 处，$v' = 10 - ${c.toLatex()} \\cdot ${vT} = 0$，所以曲线在那里是水平的。`,
          ]
        : [
            `At $v = ${vT}$ the drag is $${answer.toLatex()} \\cdot ${vT} = ${10 * m}$, the weight, so $v' = 0$ there.`,
            `在 $v = ${vT}$ 处阻力为 $${answer.toLatex()} \\cdot ${vT} = ${10 * m}$，等于重力，所以那里 $v' = 0$。`,
          ],
      kind === "c"
        ? [
            [vT, "That is the terminal velocity itself; $c$ comes from $10 = cv_T$.", "这是终端速度本身；$c$ 要由 $10 = cv_T$ 求出。"],
            [Q.of(vT, g), "That divides $v_T$ by $g$, the wrong way round.", "这用 $v_T$ 除以 $g$，颠倒了。"],
            [Q.of(1, vT), "That leaves out $g = 10$.", "这漏了 $g = 10$。"],
          ]
        : [
            [Q.of(g, vT), "That is $c = \\frac{b}{m}$; multiply by the mass for $b$.", "这是 $c = \\frac{b}{m}$；乘以质量才得 $b$。"],
            [Q.of(m, vT), "That leaves out $g = 10$ in the weight $10m$.", "这在重力 $10m$ 中漏了 $g = 10$。"],
            [Q.of(vT, m * g), "That divides $v_T$ by the weight, the wrong way round.", "这用 $v_T$ 除以重力，颠倒了。"],
            [m * g, "That is the weight $10m$; divide it by $v_T$.", "这是重力 $10m$；还要除以 $v_T$。"],
          ],
      figureOf(svg, [`A velocity curve from 0 rising toward the dashed limit ${vT}.`, `从 0 上升并趋于虚线极限 ${vT} 的速度曲线。`]),
    );
  },
);

const rcCircuit = point(
  "an-rc-circuit-from-a-drawn-charging-curve",
  ["An RC circuit from a drawn charging curve", "由所画充电曲线求 RC 电路"],
  [
    "A charging capacitor has $RQ' + \\frac{Q}{C} = V$, so $Q$ approaches $CV$ with time constant $\\tau = RC$. The tangent at $t = 0$ reaches the limit at $t = \\tau$.\n\n> **Watch out.** The drawing gives $\\tau = RC$, so divide by $R$ to get $C$. A tangent meeting the limit at $t = 6$ with $R = 3$ means $C = 2$, not $6$.",
    "充电电容满足 $RQ' + \\frac{Q}{C} = V$，所以 $Q$ 趋于 $CV$，时间常数 $\\tau = RC$。$t = 0$ 处的切线在 $t = \\tau$ 时到达极限。\n\n> **注意。** 图给出的是 $\\tau = RC$，所以要除以 $R$ 才得 $C$。切线在 $t = 6$ 时到达极限且 $R = 3$，则 $C = 2$，不是 $6$。",
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
    return figureNumber(
      [
        `The curve shows the charge on a capacitor in an RC circuit with $R = ${R}$, charged from zero. The horizontal dashed line is the limit, and the slanted dashed line is the tangent at $t = 0$. Find $C$.`,
        `曲线表示电阻 $R = ${R}$ 的 RC 电路中从零开始充电的电容电荷。水平虚线是极限，斜虚线是 $t = 0$ 处的切线。求 $C$。`,
      ],
      C,
      [
        stepOf(
          ["Read the time constant", "读出时间常数"],
          ["The tangent at $t = 0$ reaches the limit at $t = \\tau$.", "$t = 0$ 处的切线在 $t = \\tau$ 时到达极限。"],
          `\\tau = RC = ${tau}`,
        ),
        stepOf(["Divide by R", "除以 R"], ["", ""], `C = ${tau} \\div ${R} = ${C.toLatex()}`),
      ],
      [
        `Then $RC = ${R} \\cdot ${C.toLatex()} = ${tau}$, the time where the drawn tangent meets the limit.`,
        `于是 $RC = ${R} \\cdot ${C.toLatex()} = ${tau}$，正是所画切线与极限相交的时刻。`,
      ],
      [
        [tau, "That is the time constant $RC$; divide it by $R$.", "这是时间常数 $RC$；还要除以 $R$。"],
        [R * tau, "That multiplies by $R$ instead of dividing.", "这乘以了 $R$，而应相除。"],
        [Q.of(R, tau), "That divides $R$ by the time constant, the wrong way round.", "这用 $R$ 除以时间常数，颠倒了。"],
        [Q.of(tau, V), "That divides by the voltage instead of the resistance.", "这除以了电压，而应除以电阻。"],
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
    "An RL circuit has $LI' + RI = V$. The current levels off when $I' = 0$, at $I = \\frac{V}{R}$, and the time constant is $\\tau = \\frac{L}{R}$.\n\n> **Watch out.** The time constant is $\\frac{L}{R}$, so $L = R\\tau$. A tangent meeting the limit at $t = 2$ with $R = 5$ means $L = 10$, not $2$.",
    "RL 电路满足 $LI' + RI = V$。电流在 $I' = 0$ 时趋于稳定，$I = \\frac{V}{R}$，时间常数 $\\tau = \\frac{L}{R}$。\n\n> **注意。** 时间常数是 $\\frac{L}{R}$，所以 $L = R\\tau$。切线在 $t = 2$ 时到达极限且 $R = 5$，则 $L = 10$，不是 $2$。",
  ],
  (rng) => {
    const limit = rng.int(1, 8);
    const R = rng.int(2, 6);
    const tau = rng.int(1, 5);
    const V = limit * R;
    const svg = approach(0, limit, tau, 5 * tau, limit * 1.2, [[limit, String(limit)]]);
    const kind = rng.pick(["R", "L"] as const);
    const answer = kind === "R" ? R : R * tau;
    return figureNumber(
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
      kind === "R"
        ? [
            stepOf(
              ["Read the limit", "读出极限"],
              ["The current levels off where $I' = 0$.", "电流在 $I' = 0$ 处趋于稳定。"],
              `I_\\infty = ${limit}`,
            ),
            stepOf(["Solve for R", "解出 R"], ["", ""], `R \\cdot ${limit} = ${V}, \\qquad R = ${V} \\div ${limit} = ${R}`),
          ]
        : [
            stepOf(
              ["Read the time constant", "读出时间常数"],
              ["The tangent at $t = 0$ reaches the limit at $t = \\tau$.", "$t = 0$ 处的切线在 $t = \\tau$ 时到达极限。"],
              `\\tau = \\frac{L}{${R}} = ${tau}`,
            ),
            stepOf(["Solve for L", "解出 L"], ["", ""], `L = ${R} \\cdot ${tau} = ${answer}`),
          ],
      kind === "R"
        ? [
            `With $R = ${R}$ the steady current is $${V} \\div ${R} = ${limit}$, the dashed level.`,
            `取 $R = ${R}$，稳态电流为 $${V} \\div ${R} = ${limit}$，正是虚线的高度。`,
          ]
        : [
            `Then $\\frac{L}{R} = ${answer} \\div ${R} = ${tau}$, the time where the drawn tangent meets the limit.`,
            `于是 $\\frac{L}{R} = ${answer} \\div ${R} = ${tau}$，正是所画切线与极限相交的时刻。`,
          ],
      kind === "R"
        ? [
            [V, "That is the voltage; divide it by the steady current.", "这是电压；还要除以稳态电流。"],
            [limit, "That is the steady current read from the drawing, not the resistance.", "这是从图中读出的稳态电流，不是电阻。"],
            [V * limit, "That multiplies the voltage by the current; Ohm's law divides.", "这把电压乘以电流；欧姆定律是相除。"],
            [Q.of(limit, V), "That divides the current by the voltage, the wrong way round.", "这用电流除以电压，颠倒了。"],
          ]
        : [
            [tau, "That is the time constant $\\frac{L}{R}$; multiply by $R$.", "这是时间常数 $\\frac{L}{R}$；还要乘以 $R$。"],
            [R, "That is the resistance, not the inductance.", "这是电阻，不是电感。"],
            [Q.of(tau, R), "That divides the time constant by $R$ instead of multiplying.", "这把时间常数除以 $R$，而应相乘。"],
            [limit * tau, "That multiplies by the steady current instead of the resistance.", "这乘以了稳态电流，而应乘以电阻。"],
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
    "With a repeated root $-r$, the solutions are $y = (A + Bt)e^{-rt}$. Then $y(0) = A$ and $y'(0) = B - rA$, so the height and the slope of the curve at $t = 0$ fix both constants. For $r = 2$, a curve starting at height $1$ with slope $-1$ has $B = -1 + 2 \\cdot 1 = 1$.\n\n> **Watch out.** The drawn slope is $B - rA$, not $B$: the decaying factor pulls the slope down by $rA$, so add $rA$ back.",
    "重根为 $-r$ 时，解为 $y = (A + Bt)e^{-rt}$。于是 $y(0) = A$，$y'(0) = B - rA$，所以曲线在 $t = 0$ 处的高度和斜率确定两个常数。当 $r = 2$ 时，从高度 $1$、斜率 $-1$ 出发的曲线有 $B = -1 + 2 \\cdot 1 = 1$。\n\n> **注意。** 图中的斜率是 $B - rA$，而不是 $B$：衰减因子使斜率减小了 $rA$，所以要把 $rA$ 加回去。",
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
    const tri = `y'' + ${2 * r}y' + ${r * r === 1 ? "" : r * r}y = 0`;
    const rA = r === 1 ? "A" : `${r}A`;
    return figureNumber(
      [
        `The curve solves $${tri}$, and the short dashed segment is its tangent at $t = 0$. Write the solution as $y = (A + Bt)e^{-${coefficient}t}$ and find $B$.`,
        `这条曲线是 $${tri}$ 的解，短虚线段是它在 $t = 0$ 处的切线。把解写成 $y = (A + Bt)e^{-${coefficient}t}$，求 $B$。`,
      ],
      B,
      [
        stepOf(
          ["Read the drawing", "读图"],
          [
            `The curve starts at height $${A}$, and the tangent changes by $${slope}$ from $t = 0$ to $t = 1$.`,
            `曲线从高度 $${A}$ 出发，切线从 $t = 0$ 到 $t = 1$ 变化了 $${slope}$。`,
          ],
          `A = y(0) = ${A}`,
          `y'(0) = ${slope}`,
        ),
        stepOf(
          ["Use the derivative at 0", "用 0 处的导数"],
          [`Differentiating, $y'(0) = B - ${rA}$:`, `求导得 $y'(0) = B - ${rA}$：`],
          `B = ${slope} + ${r} \\cdot ${A} = ${B}`,
        ),
      ],
      [
        `$y = ${B === 0 ? `${A}` : `(${A} ${B < 0 ? "-" : "+"} ${Math.abs(B) === 1 ? "" : Math.abs(B)}t)`}e^{-${coefficient}t}$ has $y(0) = ${A}$ and $y'(0) = ${B} - ${r} \\cdot ${A} = ${slope}$, matching the tangent.`,
        `$y = ${B === 0 ? `${A}` : `(${A} ${B < 0 ? "-" : "+"} ${Math.abs(B) === 1 ? "" : Math.abs(B)}t)`}e^{-${coefficient}t}$ 满足 $y(0) = ${A}$，$y'(0) = ${B} - ${r} \\cdot ${A} = ${slope}$，与切线一致。`,
      ],
      [
        [slope, `That takes $B$ as the drawn slope; the slope is $B - ${rA}$.`, `这是把 $B$ 当成图中的斜率；斜率是 $B - ${rA}$。`],
        [slope - r * A, `That subtracts $${rA}$ again; it has to be added back.`, `这是又减去了 $${rA}$；应当把它加回去。`],
        [A, "That is $A$, the starting height.", "这是起始高度 $A$。"],
        [-B, "The sign is flipped; recheck $y'(0) = B - rA$.", "符号反了；重新检查 $y'(0) = B - rA$。"],
      ],
      figureOf(svg, [
        `A curve starting at (0, ${A}), whose tangent there also passes through (1, ${A + slope}).`,
        `从 (0, ${A}) 出发的曲线，那里的切线还过 (1, ${A + slope})。`,
      ]),
    );
  },
);

const oscillatorFrequency = {
  ...point(
    "an-oscillator-from-its-drawn-graph",
    ["An oscillator from its drawn graph", "由图读振子"],
    [
      "A simple harmonic oscillator $my'' + ky = 0$ moves as $y = R\\cos(\\omega t - \\phi)$ with $\\omega = \\sqrt{\\frac{k}{m}}$. The amplitude $R$ is half the distance from top to bottom, the period is $T = \\frac{2\\pi}{\\omega}$, and the largest speed is $R\\omega$. A wave from $-3$ to $3$ that repeats every $4$ has $R = 3$, $\\omega = \\frac{2\\pi}{4} = \\frac{\\pi}{2}$ and largest speed $\\frac{3\\pi}{2}$.\n\n> **Watch out.** Read the period from one peak to the next, not from a peak to the following trough; and the amplitude is half the height from bottom to top.",
      "简谐振子 $my'' + ky = 0$ 的运动为 $y = R\\cos(\\omega t - \\phi)$，$\\omega = \\sqrt{\\frac{k}{m}}$。振幅 $R$ 是从最高到最低距离的一半，周期 $T = \\frac{2\\pi}{\\omega}$，最大速率为 $R\\omega$。在 $-3$ 与 $3$ 之间、每 $4$ 个单位重复一次的波，$R = 3$，$\\omega = \\frac{2\\pi}{4} = \\frac{\\pi}{2}$，最大速率为 $\\frac{3\\pi}{2}$。\n\n> **注意。** 周期要从一个波峰量到下一个波峰，而不是从波峰量到随后的波谷；振幅是从最低到最高高度的一半。",
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
        return figureNumber(
          [
            "The graph shows $y(t)$ for a simple harmonic oscillator. Find its largest speed divided by $\\pi$.",
            "图中是简谐振子的 $y(t)$。求它的最大速率除以 $\\pi$。",
          ],
          speed,
          [
            stepOf(
              ["Read the graph", "读图"],
              ["The wave runs between its peaks and troughs and repeats:", "波在波峰与波谷之间往复并重复："],
              `R = ${R}, \\qquad T = ${T}`,
            ),
            stepOf(
              ["Find the largest speed", "求最大速率"],
              ["", ""],
              `\\omega = \\frac{2\\pi}{${T}} = ${omega(2, T)}`,
              `R\\omega = ${R} \\cdot ${omega(2, T)} = ${speed.toLatex() === "1" ? "" : speed.toLatex()}\\pi`,
            ),
          ],
          [
            `$y = ${R === 1 ? "" : R}\\cos(${omega(2, T)} t)$ has $y' = -${R === 1 ? "" : `${R} \\cdot `}${omega(2, T)}\\sin(${omega(2, T)} t)$, whose largest size is $${speed.toLatex()}\\pi$ where the sine is $\\pm 1$.`,
            `$y = ${R === 1 ? "" : R}\\cos(${omega(2, T)} t)$ 的导数 $y' = -${R === 1 ? "" : `${R} \\cdot `}${omega(2, T)}\\sin(${omega(2, T)} t)$，在正弦为 $\\pm 1$ 处取最大值 $${speed.toLatex()}\\pi$。`,
          ],
          [
            [
              Q.of(R, T),
              "That uses $\\omega = \\frac{\\pi}{T}$; a full turn is $2\\pi$.",
              "这是用了 $\\omega = \\frac{\\pi}{T}$；一整圈是 $2\\pi$。",
            ],
            [Q.of(4 * R, T), "That uses the full height $2R$ in place of the amplitude.", "这是用整个高度 $2R$ 代替了振幅。"],
            [2 * R, "That takes $\\omega = 2\\pi$ and leaves out the period.", "这是取 $\\omega = 2\\pi$，漏掉了周期。"],
            [Q.of(2, T), "That is $\\frac{\\omega}{\\pi}$; multiply by the amplitude.", "这是 $\\frac{\\omega}{\\pi}$；还要乘以振幅。"],
            [Q.of(2 * T, R), "That divides the period by the amplitude, upside down.", "这是用周期除以振幅，倒过来了。"],
          ],
          figure,
        );
      }
      const right = same(`\\omega = ${omega(2, T)}`);
      const wrong: Because<Pair>[] = [
        [
          same(`\\omega = ${omega(1, T)}`),
          "That divides $\\pi$ by the period; a full turn is $2\\pi$.",
          "这是用 $\\pi$ 除以周期；一整圈是 $2\\pi$。",
        ],
        [
          same(`\\omega = ${omega(T, 2)}`),
          "That is $\\frac{T}{2}$ times $\\pi$, the formula upside down.",
          "这是 $\\frac{T}{2}$ 乘以 $\\pi$，公式倒过来了。",
        ],
        [
          same(`\\omega = ${omega(4, T)}`),
          "That reads the period from a peak to the next trough, which is half a wave.",
          "这是从波峰量到随后的波谷，那只是半个波。",
        ],
        [same(`\\omega = ${T}`), "That is the period itself, not the angular frequency.", "这是周期本身，而不是角频率。"],
      ];
      return figureChoice(
        rng,
        [
          "The graph shows $y(t)$ for a simple harmonic oscillator. What is its angular frequency $\\omega$?",
          "图中是简谐振子的 $y(t)$。它的角频率 $\\omega$ 是多少？",
        ],
        right,
        wrong.filter(([o], i) => o[0] !== right[0] && wrong.findIndex(([p]) => p[0] === o[0]) === i),
        [
          stepOf(["Read the period", "读出周期"], ["One full wave, peak to peak, takes", "一个完整波形（波峰到波峰）用时"], `T = ${T}`),
          stepOf(["Convert", "换算"], ["", ""], `\\omega = \\frac{2\\pi}{${T}} = ${omega(2, T)}`),
        ],
        [`$${omega(2, T)} \\cdot ${T} = 2\\pi$, one full turn per wave.`, `$${omega(2, T)} \\cdot ${T} = 2\\pi$，每个波正好转一整圈。`],
        figure,
      );
    },
  ),
  figure: differentialEquationsDrawings1["simple-harmonic-oscillators#an-oscillator-from-its-drawn-graph"],
};

const dampingKind = {
  ...point(
    "the-kind-of-damping-from-a-drawn-graph",
    ["The kind of damping from a drawn graph", "由图判断阻尼类型"],
    [
      "For $my'' + cy' + ky = 0$, the discriminant $c^2 - 4mk$ decides the motion. Negative: oscillation with shrinking waves. Zero or positive: decay with at most one crossing of zero. No damping: waves of constant size. For $y'' + 2y' + 10y = 0$, $4 - 40 < 0$, so the graph is a wave whose peaks shrink like $e^{-t}$.\n\n> **Watch out.** Count the crossings of zero: a curve that crosses once and then settles is critically or overdamped, not underdamped; and growing waves mean $c < 0$, energy being added.",
      "对 $my'' + cy' + ky = 0$，判别式 $c^2 - 4mk$ 决定运动。为负：振幅递减的振荡。为零或正：衰减，至多穿过零一次。无阻尼：振幅不变的波。对 $y'' + 2y' + 10y = 0$，$4 - 40 < 0$，所以图像是峰值按 $e^{-t}$ 缩小的波。\n\n> **注意。** 数一数穿过零的次数：只穿过一次就趋于静止的曲线是临界阻尼或过阻尼，而不是欠阻尼；波幅增大说明 $c < 0$，能量在增加。",
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
      const needs: Record<typeof kind, Pair> = {
        under: ["Underdamping gives waves that keep crossing zero while they shrink.", "欠阻尼给出不断穿过零且逐渐缩小的波。"],
        over: ["Critical damping or overdamping decays with at most one crossing of zero.", "临界阻尼或过阻尼衰减时至多穿过零一次。"],
        none: ["With no damping the waves keep the same size.", "没有阻尼时波幅保持不变。"],
        negative: ["A negative $c$ adds energy and makes the waves grow.", "负的 $c$ 增加能量，使波幅增大。"],
      };
      const roots: Record<typeof kind, Pair> = {
        under: [
          "The roots $\\frac{-c \\pm \\sqrt{c^2 - 4mk}}{2m}$ are complex with negative real part $-\\frac{c}{2m}$, which shrinks the waves.",
          "特征根 $\\frac{-c \\pm \\sqrt{c^2 - 4mk}}{2m}$ 是复数，实部 $-\\frac{c}{2m}$ 为负，使波幅缩小。",
        ],
        over: [
          "The roots $\\frac{-c \\pm \\sqrt{c^2 - 4mk}}{2m}$ are real and negative, so the solution decays without oscillating.",
          "特征根 $\\frac{-c \\pm \\sqrt{c^2 - 4mk}}{2m}$ 是负实数，所以解衰减而不振荡。",
        ],
        none: [
          "With $c = 0$ the roots are $\\pm i\\sqrt{\\frac{k}{m}}$, purely imaginary, so the waves keep their size.",
          "$c = 0$ 时特征根是纯虚数 $\\pm i\\sqrt{\\frac{k}{m}}$，所以波幅不变。",
        ],
        negative: [
          "With $c < 0$ the real part $-\\frac{c}{2m}$ of the roots is positive, which makes the waves grow.",
          "$c < 0$ 时特征根的实部 $-\\frac{c}{2m}$ 为正，使波幅增大。",
        ],
      };
      return figureChoice(
        rng,
        [
          "The graph shows a solution of $my'' + cy' + ky = 0$ with $m, k > 0$. Which description fits it?",
          "图中是 $my'' + cy' + ky = 0$（$m, k > 0$）的一个解。哪个描述符合它？",
        ],
        names[kind],
        (["under", "over", "none", "negative"] as const)
          .filter((x) => x !== kind)
          .map(
            (x): Because<Pair> => [
              names[x],
              `${needs[x][0]} This graph does not match. ${why[kind][0]}`,
              `${needs[x][1]}这幅图不符合。${why[kind][1]}`,
            ],
          ),
        [stepOf(["Read the graph", "读图"], why[kind]), stepOf(["Match the roots", "对应特征根"], roots[kind])],
        [`${needs[kind][0]} No other description gives this shape.`, `${needs[kind][1]}其他描述都不会给出这种形状。`],
        figureOf(svg, alts[kind]),
      );
    },
  ),
  figure: differentialEquationsDrawings1["damped-oscillators#the-kind-of-damping-from-a-drawn-graph"],
};

const resonance = point(
  "the-forcing-that-causes-a-drawn-resonance",
  ["The forcing that causes a drawn resonance", "造成所画共振的外力"],
  [
    "For $y'' + \\omega_0^2 y = F\\cos(\\omega t)$, a forcing at the natural frequency, $\\omega = \\omega_0$, gives waves that grow without bound, $y = \\frac{F}{2\\omega_0}t\\sin(\\omega_0 t)$. Any other frequency gives bounded motion. For $y'' + 9y = 6\\cos(\\omega t)$ the waves grow only for $\\omega = 3$, as $y = t\\sin 3t$.\n\n> **Watch out.** The natural frequency is the square root of the coefficient of $y$: for $y'' + 9y$ it is $3$, not $9$.",
    "对 $y'' + \\omega_0^2 y = F\\cos(\\omega t)$，频率等于固有频率（$\\omega = \\omega_0$）的外力产生无界增长的波，$y = \\frac{F}{2\\omega_0}t\\sin(\\omega_0 t)$。其他频率的运动都有界。对 $y'' + 9y = 6\\cos(\\omega t)$，只有 $\\omega = 3$ 时波才增长，$y = t\\sin 3t$。\n\n> **注意。** 固有频率是 $y$ 的系数的平方根：对 $y'' + 9y$，它是 $3$ 而不是 $9$。",
  ],
  (rng) => {
    const w0 = rng.int(1, 5);
    const F = rng.int(1, 8);
    const a = F / (2 * w0);
    const f = (v: number) => a * v * Math.sin(w0 * v);
    const top = a * 10 * 1.1;
    const svg = chart([0, 10], [-top, top], intTicks(0, 10), [], (x, y) => guide(x, y, [0, 0], [10, 0]) + curvePath(f, 0, 10, x, y));
    const eq = `y'' + ${w0 * w0 === 1 ? "" : w0 * w0}y = ${F === 1 ? "" : F}\\cos(\\omega t)`;
    const near = [w0 + 1, w0 + 2, w0 * w0 === w0 ? w0 + 3 : w0 * w0, w0 > 1 ? w0 - 1 : w0 + 3].filter((v, i, all) => all.indexOf(v) === i);
    const rate = Q.of(F, 2 * w0);
    const rateText = rate.toLatex() === "1" ? "" : rate.toLatex();
    const sinText = `\\sin ${w0 === 1 ? "" : w0}t`;
    return figureChoice(
      rng,
      [
        `The graph shows a solution of $${eq}$ starting from rest. Which value of $\\omega$ produces it?`,
        `图中是 $${eq}$ 从静止开始的一个解。哪个 $\\omega$ 产生了它？`,
      ],
      same(`\\omega = ${w0}`),
      near.map(
        (v): Because<Pair> =>
          v === w0 * w0
            ? [
                same(`\\omega = ${v}`),
                `That is $\\omega_0^2$, the coefficient of $y$; the natural frequency is its square root, $${w0}$.`,
                `这是 $y$ 的系数 $\\omega_0^2$；固有频率是它的平方根 $${w0}$。`,
              ]
            : [
                same(`\\omega = ${v}`),
                `With $\\omega = ${v}$, away from the natural frequency $${w0}$, the motion stays bounded; the drawn peaks keep growing.`,
                `$\\omega = ${v}$ 偏离固有频率 $${w0}$，运动保持有界；而图中的峰值一直增大。`,
              ],
      ),
      [
        stepOf(
          ["Read the graph", "读图"],
          ["The peaks grow in a straight line, so the forcing is at resonance.", "峰值沿直线增长，所以外力处于共振。"],
        ),
        stepOf(
          ["Find the natural frequency", "求固有频率"],
          ["Resonance needs $\\omega$ equal to", "共振要求 $\\omega$ 等于"],
          `\\omega_0 = \\sqrt{${w0 * w0}} = ${w0}`,
        ),
      ],
      [
        `$y = ${rateText}t${sinText}$ has $y'' + ${w0 * w0 === 1 ? "" : w0 * w0}y = ${rateText === "" ? "" : `${rateText} \\cdot `}${2 * w0}\\cos ${w0 === 1 ? "" : w0}t = ${F === 1 ? "" : F}\\cos ${w0 === 1 ? "" : w0}t$, with peaks growing like $${rateText === "" ? "" : rateText}t$.`,
        `$y = ${rateText}t${sinText}$ 满足 $y'' + ${w0 * w0 === 1 ? "" : w0 * w0}y = ${rateText === "" ? "" : `${rateText} \\cdot `}${2 * w0}\\cos ${w0 === 1 ? "" : w0}t = ${F === 1 ? "" : F}\\cos ${w0 === 1 ? "" : w0}t$，峰值按 $${rateText === "" ? "" : rateText}t$ 增长。`,
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
    "If $y_1$ and $y_2$ solve a homogeneous linear equation, so does $c_1 y_1 + c_2 y_2$. Its value at any time is the same combination of the values of $y_1$ and $y_2$ at that time. For example, if $y_1(2) = 3$ and $y_2(2) = -1$, then $y = 2y_1 - 3y_2$ has $y(2) = 2 \\cdot 3 - 3 \\cdot (-1) = 9$.\n\n> **Watch out.** Each constant multiplies its own curve: $c_1$ goes with the solid curve and $c_2$ with the dashed one, and a minus sign in front of $c_2$ stays with it.",
    "若 $y_1$ 和 $y_2$ 是齐次线性方程的解，则 $c_1 y_1 + c_2 y_2$ 也是。它在任何时刻的值都是 $y_1$ 和 $y_2$ 在该时刻的值的同一组合。例如，若 $y_1(2) = 3$，$y_2(2) = -1$，则 $y = 2y_1 - 3y_2$ 满足 $y(2) = 2 \\cdot 3 - 3 \\cdot (-1) = 9$。\n\n> **注意。** 每个常数只乘它自己的曲线：$c_1$ 对应实线，$c_2$ 对应虚线，$c_2$ 前面的负号也跟着它。",
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
    const inParens = (n: number) => (n < 0 ? `(${n})` : `${n}`);
    const product = `${c1} \\cdot ${inParens(v1)} + ${inParens(c2)} \\cdot ${inParens(v2)}`;
    return figureNumber(
      [
        `The solid curve is $y_1$ and the dashed curve is $y_2$, both solutions of a homogeneous linear equation. The solution $y = ${combo}$ is also a solution. Find $y(2)$.`,
        `实线是 $y_1$，虚线是 $y_2$，都是齐次线性方程的解。$y = ${combo}$ 也是解。求 $y(2)$。`,
      ],
      answer,
      [
        stepOf(
          ["Read the drawing", "读图"],
          ["At $t = 2$ the marked points give the two values.", "在 $t = 2$ 处，标出的点给出两个值。"],
          `y_1(2) = ${v1}`,
          `y_2(2) = ${v2}`,
        ),
        stepOf(
          ["Combine the values", "组合这两个值"],
          ["Apply the same constants to the values:", "把同样的常数用在这两个值上："],
          `y(2) = ${product} = ${answer}`,
        ),
      ],
      [
        `The two products are $${c1 * v1}$ and $${c2 * v2}$, and $${c1 * v1} ${c2 * v2 < 0 ? "-" : "+"} ${Math.abs(c2 * v2)} = ${answer}$.`,
        `两个乘积分别是 $${c1 * v1}$ 和 $${c2 * v2}$，而 $${c1 * v1} ${c2 * v2 < 0 ? "-" : "+"} ${Math.abs(c2 * v2)} = ${answer}$。`,
      ],
      [
        [c1 * v2 + c2 * v1, "The constants are swapped: $c_1$ goes with the solid curve.", "常数配反了：$c_1$ 对应实线。"],
        [v1 + v2, "That adds the curves and leaves out the constants.", "这是把两条曲线直接相加，漏掉了常数。"],
        [c1 * v1 - c2 * v2, "The sign of the second term is flipped.", "第二项的符号反了。"],
        [c1 + c2, "That adds the constants and leaves out the values read from the drawing.", "这是把常数相加，漏掉了从图中读出的值。"],
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
    "Two solutions are linearly dependent exactly when one is a constant multiple of the other, so their ratio does not change with time. In that case their Wronskian is zero at every time. For example, $e^{t}$ and $3e^{t}$ have ratio $3$ everywhere and are dependent, while $e^{t}$ and $e^{-t}$ have ratio $e^{2t}$, which changes, so they are independent.\n\n> **Watch out.** Meeting at one point proves nothing: compare the ratio at two or more times, not the values at one time.",
    "两个解线性相关当且仅当一个是另一个的常数倍，也就是它们的比值不随时间变化。此时它们的朗斯基行列式处处为零。例如 $e^{t}$ 与 $3e^{t}$ 的比值处处为 $3$，线性相关；而 $e^{t}$ 与 $e^{-t}$ 的比值为 $e^{2t}$，会变化，所以线性无关。\n\n> **注意。** 在某一点相交说明不了什么：要比较两个或更多时刻的比值，而不是某一时刻的值。",
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
    const fy = factor === -1 ? "-" : `${factor}`;
    return figureChoice(
      rng,
      [
        "The curves are two solutions of a second-order homogeneous linear equation. Which statement is true?",
        "两条曲线是二阶齐次线性方程的两个解。哪个说法正确？",
      ],
      dependent ? yes : no,
      [
        dependent
          ? [
              no,
              "The dashed curve is a fixed multiple of the solid one, so the Wronskian is zero.",
              "虚线是实线的固定倍数，所以朗斯基行列式为零。",
            ]
          : [
              yes,
              "The ratio of the curves changes, so neither is a multiple of the other.",
              "两条曲线的比值在变化，所以谁也不是谁的倍数。",
            ],
        [
          ["Dependent, because the curves have the same value at $t = 2$", "线性相关，因为曲线在 $t = 2$ 处的值相同"],
          "Values at one time do not decide dependence; the ratio must stay fixed at every time.",
          "某一时刻的值不能决定是否相关；比值必须在每个时刻都不变。",
        ],
        [
          ["Independent, because the curves are not the same curve", "线性无关，因为两条曲线不是同一条"],
          "Different curves can still be multiples of each other, like $y$ and $2y$.",
          "不同的曲线仍可能互为倍数，例如 $y$ 和 $2y$。",
        ],
      ],
      [
        stepOf(
          ["Compare the ratio", "比较比值"],
          dependent
            ? [
                `At every time the dashed curve is $${factor}$ times the solid curve, so the ratio stays at $${factor}$.`,
                `在每个时刻，虚线都是实线的 $${factor}$ 倍，所以比值一直是 $${factor}$。`,
              ]
            : ["The ratio of the dashed curve to the solid curve is different at different times.", "虚线与实线的比值在不同时刻不同。"],
          dependent ? `\\frac{y_2}{y_1} = ${factor}` : `\\frac{y_2}{y_1} \\ne \\text{constant}`,
        ),
        stepOf(
          ["Decide", "判断"],
          dependent
            ? ["One is a constant multiple of the other, so they are dependent.", "一个是另一个的常数倍，所以线性相关。"]
            : ["Neither is a constant multiple of the other, so they are independent.", "谁都不是另一个的常数倍，所以线性无关。"],
          dependent ? "W(y_1, y_2) = 0" : "W(y_1, y_2) \\ne 0",
        ),
      ],
      dependent
        ? [
            `With $y_2 = ${fy}y_1$, $W = y_1 \\cdot (${fy}y_1') - (${fy}y_1) \\cdot y_1' = 0$ at every time.`,
            `由 $y_2 = ${fy}y_1$，得 $W = y_1 \\cdot (${fy}y_1') - (${fy}y_1) \\cdot y_1' = 0$ 处处成立。`,
          ]
        : [
            "If the ratio were a constant $c$, the dashed curve would be $c$ times the solid one at every time, and the drawing shows it is not.",
            "如果比值是常数 $c$，虚线就会处处是实线的 $c$ 倍，而图中并非如此。",
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
    "If the direction $v$ of a straight line through the origin is an eigenvector of $A$, solutions of $x' = Ax$ that start on the line stay on it, and they are $x = ce^{\\lambda t}v$ with $Av = \\lambda v$. Read $v$ from the drawing and compute $Av$. For $A = \\begin{pmatrix} 1 & 2 \\\\ 2 & 1 \\end{pmatrix}$ and the line through $(1, 1)$: $Av = (3, 3) = 3v$, so $\\lambda = 3$.\n\n> **Watch out.** Use the direction of the solid line, not the dashed one; and $\\lambda$ is the factor in $Av = \\lambda v$, not the trace or the determinant of $A$.",
    "若过原点直线的方向 $v$ 是 $A$ 的特征向量，$x' = Ax$ 从直线上出发的解就留在直线上，形如 $x = ce^{\\lambda t}v$，其中 $Av = \\lambda v$。从图中读出 $v$，再计算 $Av$。对 $A = \\begin{pmatrix} 1 & 2 \\\\ 2 & 1 \\end{pmatrix}$ 和过 $(1, 1)$ 的直线：$Av = (3, 3) = 3v$，所以 $\\lambda = 3$。\n\n> **注意。** 要用实线的方向，而不是虚线；$\\lambda$ 是 $Av = \\lambda v$ 中的倍数，不是 $A$ 的迹或行列式。",
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
    const times = (k: number, v: string) => `${k === 1 ? "" : k === -1 ? "-" : k}${v}`;
    return figureNumber(
      [
        `The solid line and the dashed line carry the straight-line solutions of $x' = ${A}x$. Find the eigenvalue that belongs to the solid line.`,
        `实线和虚线上是 $x' = ${A}x$ 的直线解。求属于实线的特征值。`,
      ],
      l1,
      [
        stepOf(
          ["Read the direction", "读出方向"],
          ["The solid line passes through the origin and the marked point:", "实线经过原点和标出的点："],
          `v = (${v1[0]}, ${v1[1]})`,
        ),
        stepOf(
          ["Multiply by A", "乘以 A"],
          ["", ""],
          `Av = ${A}\\begin{pmatrix} ${v1[0]} \\\\ ${v1[1]} \\end{pmatrix} = \\begin{pmatrix} ${l1 * v1[0]} \\\\ ${l1 * v1[1]} \\end{pmatrix} = ${times(l1, "v")}`,
          `\\lambda = ${l1}`,
        ),
      ],
      [
        `The dashed direction $(${v2[0]}, ${v2[1]})$ gives the other eigenvalue $${l2}$, and $${l1} + ${l2 < 0 ? `(${l2})` : l2} = ${a + d}$, the trace of the matrix.`,
        `虚线方向 $(${v2[0]}, ${v2[1]})$ 给出另一个特征值 $${l2}$，且 $${l1} + ${l2 < 0 ? `(${l2})` : l2} = ${a + d}$，正是矩阵的迹。`,
      ],
      [
        [l2, "That belongs to the dashed line.", "这是属于虚线的特征值。"],
        [a + d, "That is the trace, the sum of both eigenvalues.", "这是迹，即两个特征值之和。"],
        [a * d - b * c, "That is the determinant, the product of both eigenvalues.", "这是行列式，即两个特征值之积。"],
        [-l1, "The sign is flipped: compare $Av$ with $v$ entry by entry.", "符号反了：要逐个分量比较 $Av$ 与 $v$。"],
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

const traceDeterminant = {
  ...point(
    "the-type-of-equilibrium-from-the-trace-determinant-plane",
    ["The type of equilibrium from the trace-determinant plane", "由迹-行列式平面判断平衡点类型"],
    [
      "For $x' = Ax$ with trace $T$ and determinant $D$: $D < 0$ is a saddle. If $D > 0$, the sign of $T$ decides stable or unstable, and the parabola $D = \\frac{T^2}{4}$ separates nodes, below it, from spirals, above it. $T = 0$ with $D > 0$ is a center. For $T = -2$ and $D = 5$: $D > 0$, $T < 0$ and $T^2 = 4 < 20 = 4D$, so the origin is a stable spiral.\n\n> **Watch out.** Check the sign of $D$ first: a point with $D < 0$ is a saddle whatever the sign of $T$. Above the parabola means $T^2 < 4D$, which gives spirals, not nodes.",
      "对迹为 $T$、行列式为 $D$ 的 $x' = Ax$：$D < 0$ 是鞍点。若 $D > 0$，$T$ 的符号决定稳定或不稳定，抛物线 $D = \\frac{T^2}{4}$ 把结点（下方）和螺旋点（上方）分开。$T = 0$ 且 $D > 0$ 是中心。对 $T = -2$，$D = 5$：$D > 0$，$T < 0$，且 $T^2 = 4 < 20 = 4D$，所以原点是稳定螺旋点。\n\n> **注意。** 先看 $D$ 的符号：$D < 0$ 的点无论 $T$ 的符号如何都是鞍点。在抛物线上方意味着 $T^2 < 4D$，对应螺旋点而不是结点。",
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
      const because = (k: keyof typeof names): Because<Pair> => {
        const [en, zh] = ((): Pair => {
          if (k === "saddle") return [`A saddle needs $D < 0$, but here $D = ${D}$.`, `鞍点要求 $D < 0$，而这里 $D = ${D}$。`];
          if (k === "center")
            return T !== 0
              ? [`A center needs $T = 0$, but here $T = ${T}$.`, `中心要求 $T = 0$，而这里 $T = ${T}$。`]
              : [`A center needs $D > 0$, but here $D = ${D}$.`, `中心要求 $D > 0$，而这里 $D = ${D}$。`];
          if (D < 0) return [`Nodes and spirals need $D > 0$, but here $D = ${D}$.`, `结点和螺旋点要求 $D > 0$，而这里 $D = ${D}$。`];
          if (T === 0)
            return [
              "With $T = 0$ the eigenvalues have zero real part, so solutions neither grow nor decay.",
              "$T = 0$ 时特征值的实部为零，解既不增长也不衰减。",
            ];
          const stableKind = k.startsWith("stable");
          if (stableKind && T > 0) return [`Stable types need $T < 0$, but here $T = ${T}$.`, `稳定类型要求 $T < 0$，而这里 $T = ${T}$。`];
          if (!stableKind && T < 0)
            return [`Unstable types need $T > 0$, but here $T = ${T}$.`, `不稳定类型要求 $T > 0$，而这里 $T = ${T}$。`];
          return k.endsWith("spiral")
            ? [
                `A spiral lies above the parabola, with $T^2 < 4D$, but here $T^2 = ${T * T}$ and $4D = ${4 * D}$.`,
                `螺旋点在抛物线上方，满足 $T^2 < 4D$，而这里 $T^2 = ${T * T}$，$4D = ${4 * D}$。`,
              ]
            : [
                `A node lies below the parabola, with $T^2 > 4D$, but here $T^2 = ${T * T}$ and $4D = ${4 * D}$.`,
                `结点在抛物线下方，满足 $T^2 > 4D$，而这里 $T^2 = ${T * T}$，$4D = ${4 * D}$。`,
              ];
        })();
        return [names[k], en, zh];
      };
      const linear = T === 0 ? "" : ` ${T > 0 ? "-" : "+"} ${Math.abs(T) === 1 ? "" : Math.abs(T)}\\lambda`;
      const quadratic = `\\lambda^2${linear} ${D < 0 ? "-" : "+"} ${Math.abs(D)}`;
      return figureChoice(
        rng,
        [
          "In the plane of trace $T$ and determinant $D$, the point $A$ shows a matrix, and the dashed curve is $D = \\frac{T^2}{4}$. What type of equilibrium does $x' = Ax$ have at the origin?",
          "在迹 $T$ 和行列式 $D$ 的平面上，点 $A$ 表示一个矩阵，虚线是 $D = \\frac{T^2}{4}$。$x' = Ax$ 在原点的平衡点是什么类型？",
        ],
        names[kind],
        wrong.map(because),
        [
          stepOf(["Read the point", "读出该点"], ["", ""], `T = ${T}, \\qquad D = ${D}`),
          stepOf(
            ["Apply the tests", "应用判别条件"],
            D < 0
              ? ["A negative determinant means a saddle.", "行列式为负表示鞍点。"]
              : T === 0
                ? ["Zero trace with a positive determinant means a center.", "迹为零且行列式为正表示中心。"]
                : [
                    `The determinant is positive, $T$ is ${T < 0 ? "negative, so it is stable" : "positive, so it is unstable"}, and $A$ lies ${T * T < 4 * D ? "above the parabola, which means a spiral" : "below the parabola, which means a node"}.`,
                    `行列式为正，$T$ ${T < 0 ? "为负，所以稳定" : "为正，所以不稳定"}，$A$ 在抛物线${T * T < 4 * D ? "上方，表示螺旋点" : "下方，表示结点"}。`,
                  ],
          ),
        ],
        [
          `The eigenvalues solve $${quadratic} = 0$, whose discriminant is $T^2 - 4D = ${T * T - 4 * D}$: ${T * T - 4 * D < 0 ? "they are complex with real part $\\frac{T}{2}$" : D < 0 ? "they are real with product $D < 0$, so of opposite signs" : "they are real with the sign of $T$"}.`,
          `特征值满足 $${quadratic} = 0$，判别式为 $T^2 - 4D = ${T * T - 4 * D}$：${T * T - 4 * D < 0 ? "它们是复数，实部为 $\\frac{T}{2}$" : D < 0 ? "它们是实数，积为 $D < 0$，所以异号" : "它们是实数，符号与 $T$ 相同"}。`,
        ],
        drawn(
          { xMin: -7, xMax: 7, yMin: -6, yMax: 10, xName: "T", yName: "D" },
          marks,
          t(`A dashed parabola D = T²/4 and the point A at T = ${T}, D = ${D}.`, `虚线抛物线 D = T²/4，点 A 位于 T = ${T}，D = ${D}。`),
        ),
      );
    },
  ),
  figure:
    differentialEquationsDrawings1[
      "equilibrium-points-and-stability-for-systems-of-odes#the-type-of-equilibrium-from-the-trace-determinant-plane"
    ],
};

const orthogonalFamily = point(
  "orthogonal-trajectories-of-a-drawn-family",
  ["Orthogonal trajectories of a drawn family", "所画曲线族的正交轨线"],
  [
    "For the family $y = cx^n$, eliminating $c$ gives $y' = \\frac{ny}{x}$. The orthogonal trajectories have the negative reciprocal slope, $y' = -\\frac{x}{ny}$, and separating variables gives $x^2 + ny^2 = K$.\n\n> **Watch out.** Read $n$ from the shape of the curves, and keep the plus sign. For parabolas $y = cx^2$ the trajectories are the ellipses $x^2 + 2y^2 = K$, not the hyperbolas $x^2 - 2y^2 = K$.",
    "对曲线族 $y = cx^n$，消去 $c$ 得 $y' = \\frac{ny}{x}$。正交轨线的斜率为负倒数，$y' = -\\frac{x}{ny}$，分离变量得 $x^2 + ny^2 = K$。\n\n> **注意。** 从曲线的形状读出 $n$，并保留加号。对抛物线 $y = cx^2$，正交轨线是椭圆 $x^2 + 2y^2 = K$，不是双曲线 $x^2 - 2y^2 = K$。",
  ],
  (rng) => {
    const n = rng.int(1, 3);
    const cs = rng.sample([-2, -1, -0.5, -0.25, 0.25, 0.5, 1, 2], 4);
    const marks: PlaneMark[] = cs.map((c): PlaneMark => ({ kind: "curve", f: (v) => c * v ** n, accent: true }));
    const form = (k: number) => same(`x^2 + ${k === 1 ? "" : k}y^2 = K`);
    const name = n === 1 ? "y = cx" : `y = cx^${n}`;
    const shape = (k: number): Pair => (k === 1 ? ["lines $y = cx$", "直线 $y = cx$"] : [`curves $y = cx^{${k}}$`, `曲线 $y = cx^{${k}}$`]);
    const others: Because<Pair>[] = [1, 2, 3, 4]
      .filter((k) => k !== n)
      .map((k) => [
        form(k),
        `That belongs to the ${shape(k)[0]}; the drawn curves are ${["lines", "parabolas", "cubics"][n - 1]}, so $n = ${n}$.`,
        `这属于${shape(k)[1]}；所画的是${["直线", "抛物线", "三次曲线"][n - 1]}，所以 $n = ${n}$。`,
      ]);
    return figureChoice(
      rng,
      [
        "The curves are members of the family $y = cx^n$, where $n$ is $1$, $2$ or $3$. Lines have $n = 1$, parabolas $n = 2$ and cubics $n = 3$. Which equation gives the orthogonal trajectories of the family?",
        "这些曲线属于曲线族 $y = cx^n$，$n$ 是 $1$、$2$ 或 $3$。直线对应 $n = 1$，抛物线对应 $n = 2$，三次曲线对应 $n = 3$。哪个方程给出该曲线族的正交轨线？",
      ],
      form(n),
      [
        ...others,
        [
          same(`x^2 - ${n === 1 ? "" : n}y^2 = K`),
          "That keeps the family's slope sign; the trajectories need the negative reciprocal, which gives a plus sign.",
          "这保留了曲线族斜率的符号；正交轨线要取负倒数，得到的是加号。",
        ],
      ],
      [
        stepOf(
          ["Read the family", "读出曲线族"],
          [
            `The drawn curves are ${["lines", "parabolas", "cubics"][n - 1]}, so they are $${name}$.`,
            `所画的是${["直线", "抛物线", "三次曲线"][n - 1]}，所以是 $${name}$。`,
          ],
          `y' = ${n === 1 ? "\\frac{y}{x}" : `\\frac{${n}y}{x}`}`,
        ),
        stepOf(
          ["Take the negative reciprocal", "取负倒数"],
          ["Then separate the variables.", "再分离变量。"],
          `y' = -\\frac{x}{${n === 1 ? "" : n}y}, \\qquad ${n === 1 ? "" : n}y\\,dy = -x\\,dx, \\qquad x^2 + ${n === 1 ? "" : n}y^2 = K`,
        ),
      ],
      [
        `The product of the slopes is $${n === 1 ? "\\frac{y}{x}" : `\\frac{${n}y}{x}`} \\cdot \\left(-\\frac{x}{${n === 1 ? "" : n}y}\\right) = -1$, so the curves cross at right angles.`,
        `两斜率之积为 $${n === 1 ? "\\frac{y}{x}" : `\\frac{${n}y}{x}`} \\cdot \\left(-\\frac{x}{${n === 1 ? "" : n}y}\\right) = -1$，所以曲线垂直相交。`,
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
