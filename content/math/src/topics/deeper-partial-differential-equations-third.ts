// Third knowledge points for thin topics of Partial Differential Equations: the reverse question,
// a harder case or a common trap. See `deeperPartialDifferentialEquationsThirdPoints`.

import type { KnowledgePointDef } from "@ga/content";
import { Q } from "@ga/subject-math";
import { pdeDrawings1 } from "../explanation-drawings-partial-differential-equations-1.ts";

import { point } from "../university-kit.ts";
import { type Miss, until, worked } from "./number-theory-course.ts";

/** over writes p over q as a fraction, or p alone when q is one. */
const over = (p: string | number, q: number): string => (q === 1 ? `${p}` : `\\frac{${p}}{${q}}`);
/** settle writes p over q, followed by its value in lowest terms when that reads differently. */
const settle = (p: number, q: number, value: Q): string => {
  const raw = q === 1 ? `${p}` : p < 0 ? `-\\frac{${-p}}{${q}}` : `\\frac{${p}}{${q}}`;
  return raw === value.toLatex() ? raw : `${raw} = ${value.toLatex()}`;
};
/** coef writes a coefficient before a symbol, leaving out 1. */
const coef = (c: number, symbol: string) => (c === 1 ? symbol : `${c}${symbol}`);

const decayRate = point(
  "the-decay-rate-of-a-matched-mode",
  ["The decay rate of a matched mode", "匹配模态的衰减率"],
  [
    "Once the initial data is matched by a sine series, each mode evolves separately. For $u_t = k u_{xx}$ on $[0, L]$, the mode $\\sin\\frac{n\\pi x}{L}$ decays like $e^{-\\lambda t}$ with $\\lambda = k \\frac{n^{2}\\pi^{2}}{L^{2}}$, so higher modes die out much faster. For example, for $u_t = 2u_{xx}$ on $[0, 3]$, the mode $\\sin\\frac{2\\pi x}{3}$ has $\\lambda = 2 \\cdot \\frac{4\\pi^{2}}{9} = \\frac{8\\pi^{2}}{9}$.\n\nCheck: the mode $\\sin\\frac{\\pi x}{3}$ has $\\lambda = \\frac{2\\pi^{2}}{9}$, a quarter of that, since the rate grows like $n^{2}$.\n\n> **Watch out.** Square both the mode number and the length, and keep the factor $k$; the amplitude of the mode plays no part in its rate.",
    "初始数据用正弦级数匹配之后，每个模态各自演化。对 $[0, L]$ 上的 $u_t = k u_{xx}$，模态 $\\sin\\frac{n\\pi x}{L}$ 按 $e^{-\\lambda t}$ 衰减，其中 $\\lambda = k \\frac{n^{2}\\pi^{2}}{L^{2}}$，所以高阶模态衰减得快得多。例如，对 $[0, 3]$ 上的 $u_t = 2u_{xx}$，模态 $\\sin\\frac{2\\pi x}{3}$ 有 $\\lambda = 2 \\cdot \\frac{4\\pi^{2}}{9} = \\frac{8\\pi^{2}}{9}$。\n\n检验：模态 $\\sin\\frac{\\pi x}{3}$ 有 $\\lambda = \\frac{2\\pi^{2}}{9}$，是它的四分之一，因为速率按 $n^{2}$ 增长。\n\n> **注意。** 模态数和长度都要平方，还要保留因子 $k$；模态的振幅与它的衰减率无关。",
  ],
  (rng) =>
    until(() => {
      const k = rng.int(1, 6);
      const n = rng.int(2, 5);
      const L = rng.pick([1, 2, 3, 4, 5, 6].filter((v) => ![2, 3, 5].some((p) => n % p === 0 && v % p === 0)));
      const b = rng.int(2, 9);
      const answer = Q.of(k * n * n, L * L);
      const mode = L === 1 ? `${n}\\pi x` : `\\frac{${n}\\pi x}{${L}}`;
      const equation = k === 1 ? "u_t = u_{xx}" : `u_t = ${k} u_{xx}`;
      const wave = over(`${n * n}\\pi^{2}`, L * L);
      const misses: Miss[] = [
        [Q.of(k * n, L), "That forgets to square the mode number and the length.", "那忘了把模态数和长度平方。"],
        [Q.of(k * n * n, L), "That forgets to square the length.", "那忘了把长度平方。"],
        [Q.of(n * n, L * L), "That leaves out the factor $k$ of the equation.", "那漏掉了方程中的因子 $k$。"],
        [
          Q.of(b * k * n * n, L * L),
          "That multiplies by the amplitude, which does not change the rate.",
          "那乘了振幅，而振幅不改变衰减率。",
        ],
      ];
      return worked(
        [
          `For $${equation}$ on $[0, ${L}]$ with zero ends and $u(x, 0) = ${b}\\sin\\left(${mode}\\right)$, the solution is $${b}e^{-\\lambda t}\\sin\\left(${mode}\\right)$ with $\\lambda = K\\pi^{2}$. What is $K$?`,
          `对 $[0, ${L}]$ 上的 $${equation}$，两端为零，$u(x, 0) = ${b}\\sin\\left(${mode}\\right)$，解是 $${b}e^{-\\lambda t}\\sin\\left(${mode}\\right)$，其中 $\\lambda = K\\pi^{2}$。$K$ 是多少？`,
        ],
        answer,
        misses,
        [
          [
            ["Differentiate the mode", "对模态求导"],
            [
              `Differentiating twice in $x$ multiplies $\\sin\\left(${mode}\\right)$ by $-${wave}$, and differentiating in $t$ multiplies $e^{-\\lambda t}$ by $-\\lambda$.`,
              `对 $x$ 求两次导数，使 $\\sin\\left(${mode}\\right)$ 乘以 $-${wave}$；对 $t$ 求导，使 $e^{-\\lambda t}$ 乘以 $-\\lambda$。`,
            ],
          ],
          [
            ["Match the two sides", "比较两边"],
            [
              k === 1
                ? `So $\\lambda = ${wave}$, and $K = ${settle(n * n, L * L, answer)}$.`
                : `So $\\lambda = ${k} \\cdot ${wave}$, and $K = ${settle(k * n * n, L * L, answer)}$.`,
              k === 1
                ? `所以 $\\lambda = ${wave}$，$K = ${settle(n * n, L * L, answer)}$。`
                : `所以 $\\lambda = ${k} \\cdot ${wave}$，$K = ${settle(k * n * n, L * L, answer)}$。`,
            ],
          ],
        ],
        [
          `Multiplying back by the squared length, $${answer.toLatex()} \\cdot ${L * L} = ${k * n * n} = ${k === 1 ? "" : `${k} \\cdot `}${n}^{2}$, the factor $k$ times the square of the mode number, as the rate requires.`,
          `乘回长度的平方，$${answer.toLatex()} \\cdot ${L * L} = ${k * n * n} = ${k === 1 ? "" : `${k} \\cdot `}${n}^{2}$，正是因子 $k$ 乘模态数的平方，符合衰减率的要求。`,
        ],
      );
    }),
);

const sourceBreaksMaximum = point(
  "a-source-breaks-the-maximum-principle",
  ["A source breaks the maximum principle", "热源破坏最大值原理"],
  [
    "The maximum principle says that the largest temperature occurs initially or at the ends, but only for the equation without a source. With a heat source, the interior can grow hotter than all the initial and boundary data, and the steady state shows how much hotter. For example, $u_t = u_{xx} + 8$ on $[0, 2]$ with zero data settles to $u = 4x(2 - x)$, whose maximum $4$ at $x = 1$ exceeds all the data, which are $0$.\n\nCheck: $u = 8x - 4x^{2}$ has $u'' = -8$, so $u'' + 8 = 0$, and $u = 0$ at $x = 0$ and $x = 2$.\n\n> **Watch out.** At the middle $x(L - x)$ equals $\\frac{L^{2}}{4}$, not $L^{2}$, so the peak is $\\frac{qL^{2}}{8k}$; and the maximum principle cannot be used here, because of the source.",
    "最大值原理说最高温度出现在初始时刻或两端，但这只对无热源的方程成立。有热源时，内部可以比所有初始和边界数据都热，稳态说明了热多少。例如，$[0, 2]$ 上的 $u_t = u_{xx} + 8$ 在零数据下趋于 $u = 4x(2 - x)$，它在 $x = 1$ 处的最大值 $4$ 超过了全部数据，数据都是 $0$。\n\n检验：$u = 8x - 4x^{2}$ 有 $u'' = -8$，所以 $u'' + 8 = 0$，且在 $x = 0$ 和 $x = 2$ 处 $u = 0$。\n\n> **注意。** 在中点 $x(L - x)$ 等于 $\\frac{L^{2}}{4}$，而不是 $L^{2}$，所以峰值是 $\\frac{qL^{2}}{8k}$；而且因为有热源，这里不能用最大值原理。",
  ],
  (rng) =>
    until(() => {
      const k = rng.int(1, 6);
      const q = rng.int(1, 12);
      const L = rng.int(1, 6);
      const answer = Q.of(q * L * L, 8 * k);
      const equation = k === 1 ? `u_t = u_{xx} + ${q}` : `u_t = ${k} u_{xx} + ${q}`;
      const lead = Q.of(q, 2 * k);
      const shape = `${lead.eq(Q.one) ? "" : `${lead.toLatex()} `}x(${L} - x)`;
      const half = Q.of(L, 2).toLatex();
      const misses: Miss[] = [
        [
          Q.of(q * L * L, 2 * k),
          "That takes $x(L - x)$ as $L^{2}$ at the middle; it is $\\frac{L^{2}}{4}$.",
          "那把中点处的 $x(L - x)$ 当成了 $L^{2}$；它是 $\\frac{L^{2}}{4}$。",
        ],
        [Q.of(q * L, 8 * k), "That uses $L$ where $L^{2}$ belongs.", "那在应为 $L^{2}$ 的地方用了 $L$。"],
        [0, "That applies the maximum principle, which fails with a source.", "那用了最大值原理，而有热源时它不成立。"],
        [Q.of(q * L * L, 8), "That forgets to divide by $k$.", "那忘了除以 $k$。"],
      ];
      return worked(
        [
          `A rod on $[0, ${L}]$ has $${equation}$, with $u = 0$ at both ends and at $t = 0$. In the long run, what is the highest temperature in the rod?`,
          `$[0, ${L}]$ 上的杆满足 $${equation}$，两端和 $t = 0$ 时都有 $u = 0$。长时间后，杆上的最高温度是多少？`,
        ],
        answer,
        misses,
        [
          [
            ["Find the steady state", "求稳态"],
            [
              `The steady state solves $${coef(k, "u''")} + ${q} = 0$ with zero ends, so $u = ${shape}$.`,
              `稳态满足 $${coef(k, "u''")} + ${q} = 0$，两端为零，所以 $u = ${shape}$。`,
            ],
          ],
          [
            ["Evaluate at the middle", "在中点求值"],
            [
              `The parabola peaks at $x = ${half}$, where $x(${L} - x) = ${Q.of(L * L, 4).toLatex()}$, so the highest temperature is $${answer.toLatex()}$.`,
              `抛物线在 $x = ${half}$ 处达到峰值，那里 $x(${L} - x) = ${Q.of(L * L, 4).toLatex()}$，所以最高温度是 $${answer.toLatex()}$。`,
            ],
          ],
        ],
        [
          `The value $${answer.toLatex()}$ is above $0$, the largest initial and boundary value, so the source has made the interior hotter than all the data, as the maximum principle would forbid without it.`,
          `值 $${answer.toLatex()}$ 大于 $0$，即最大的初始值和边界值，所以热源使内部比所有数据都热，没有热源时最大值原理不允许这样。`,
        ],
      );
    }),
);

const insulatedSource = point(
  "a-steady-state-with-an-insulated-end",
  ["A steady state with an insulated end", "一端绝热的稳态"],
  [
    "When one end of a rod with a source is insulated, the steady state is no longer symmetric. Integrating $u'' = -\\frac{q}{k}$ twice and applying $u_x(L) = 0$ gives $u = \\frac{q}{k}\\left(Lx - \\frac{x^{2}}{2}\\right)$, which is largest at the insulated end. For example, with $\\frac{q}{k} = 2$ and $L = 3$, $u = 2\\left(3x - \\frac{x^{2}}{2}\\right) = 6x - x^{2}$, which is largest, $9$, at the insulated end $x = 3$.\n\nCheck: $u' = 6 - 2x$ vanishes at $x = 3$, as the insulated end requires, and $u(0) = 0$.\n\n> **Watch out.** The steady state $\\frac{q}{2k}x(L - x)$ belongs to a rod with two cold ends; with an insulated end the peak moves to that end.",
    "当有热源的杆的一端绝热时，稳态不再对称。对 $u'' = -\\frac{q}{k}$ 积分两次，并利用 $u_x(L) = 0$，得 $u = \\frac{q}{k}\\left(Lx - \\frac{x^{2}}{2}\\right)$，它在绝热端最大。例如，$\\frac{q}{k} = 2$，$L = 3$ 时，$u = 2\\left(3x - \\frac{x^{2}}{2}\\right) = 6x - x^{2}$，它在绝热端 $x = 3$ 处最大，为 $9$。\n\n检验：$u' = 6 - 2x$ 在 $x = 3$ 处为零，符合绝热端的要求，而且 $u(0) = 0$。\n\n> **注意。** 稳态 $\\frac{q}{2k}x(L - x)$ 属于两端都冷的杆；一端绝热时，峰值移到那一端。",
  ],
  (rng) =>
    until(() => {
      const k = rng.int(2, 6);
      const q = rng.int(1, 12);
      const L = rng.int(2, 6);
      const x = rng.int(1, L);
      const answer = Q.of(q * (2 * L * x - x * x), 2 * k);
      const equation = `u_t = ${k} u_{xx} + ${q}`;
      const misses: Miss[] = [
        [Q.of(q * x * (L - x), 2 * k), "That uses the steady state of a rod with two cold ends.", "那用了两端都冷的杆的稳态。"],
        [Q.of(q * L * x, k), "That drops the term $-\\frac{x^{2}}{2}$.", "那漏掉了 $-\\frac{x^{2}}{2}$ 项。"],
        [Q.of(q * x * x, 2 * k), "That keeps only the term $\\frac{x^{2}}{2}$.", "那只保留了 $\\frac{x^{2}}{2}$ 项。"],
        [Q.of(q * (2 * L * x - x * x), 2), "That forgets to divide by $k$.", "那忘了除以 $k$。"],
      ];
      return worked(
        [
          `Find the steady state of $${equation}$ on $[0, ${L}]$ with $u(0) = 0$ and $u_x(${L}) = 0$. What is its value at $x = ${x}$?`,
          `求 $[0, ${L}]$ 上 $${equation}$ 在 $u(0) = 0$，$u_x(${L}) = 0$ 下的稳态。它在 $x = ${x}$ 处的值是多少？`,
        ],
        answer,
        misses,
        [
          [
            ["Integrate twice", "积分两次"],
            [
              `The steady state has $u'' = -\\frac{${q}}{${k}}$. Integrating once and using $u_x(${L}) = 0$ gives $u' = \\frac{${q}}{${k}}(${L} - x)$; integrating again and using $u(0) = 0$ gives $u = \\frac{${q}}{${k}}\\left(${L}x - \\frac{x^{2}}{2}\\right)$.`,
              `稳态满足 $u'' = -\\frac{${q}}{${k}}$。积分一次并利用 $u_x(${L}) = 0$，得 $u' = \\frac{${q}}{${k}}(${L} - x)$；再积分并利用 $u(0) = 0$，得 $u = \\frac{${q}}{${k}}\\left(${L}x - \\frac{x^{2}}{2}\\right)$。`,
            ],
          ],
          [
            ["Evaluate", "求值"],
            [
              `At $x = ${x}$, the bracket is $${L * x} - ${Q.of(x * x, 2).toLatex()} = ${Q.of(2 * L * x - x * x, 2).toLatex()}$, so $u = ${answer.toLatex()}$.`,
              `在 $x = ${x}$ 处，括号等于 $${L * x} - ${Q.of(x * x, 2).toLatex()} = ${Q.of(2 * L * x - x * x, 2).toLatex()}$，所以 $u = ${answer.toLatex()}$。`,
            ],
          ],
        ],
        [
          `At the insulated end the steady state is $\\frac{${q}}{${k}} \\cdot ${Q.of(L * L, 2).toLatex()} = ${Q.of(q * L * L, 2 * k).toLatex()}$, which is at least $${answer.toLatex()}$, as it must be, since the temperature rises all the way to that end.`,
          `在绝热端稳态等于 $\\frac{${q}}{${k}} \\cdot ${Q.of(L * L, 2).toLatex()} = ${Q.of(q * L * L, 2 * k).toLatex()}$，不小于 $${answer.toLatex()}$，理应如此，因为温度一直升到那一端。`,
        ],
      );
    }),
);

const robinBothEnds = point(
  "the-slope-with-robin-conditions-at-both-ends",
  ["The slope with Robin conditions at both ends", "两端都是罗宾条件时的斜率"],
  [
    "A steady rod has a straight-line temperature $u = u(0) + mx$. With Robin conditions at both ends, the unknowns $u(0)$ and $m$ satisfy two linear equations. The heat flow through the rod is limited by both end transfers, so the slope is below $\\frac{T_2 - T_1}{L}$. For example, with $h = 1$, $L = 2$, $T_1 = 10$ and $T_2 = 22$, the conditions give $u(0) = 10 + m$ and $m = -(u(0) + 2m - 22)$, so $4m = 12$ and $m = 3$, below $\\frac{12}{2} = 6$.\n\nCheck: then $u(0) = 13$ and $u(2) = 19$, and $22 - 19 = 3$ is the slope, as the right end requires.\n\n> **Watch out.** The right condition carries a minus sign, because heat leaves through that end in the direction of increasing $x$; dropping it gives the wrong equation for $m$.",
    "稳态杆的温度是直线 $u = u(0) + mx$。两端都是罗宾条件时，未知数 $u(0)$ 和 $m$ 满足两个线性方程。通过杆的热流受两端传热的限制，所以斜率小于 $\\frac{T_2 - T_1}{L}$。例如，$h = 1$，$L = 2$，$T_1 = 10$，$T_2 = 22$ 时，两个条件给出 $u(0) = 10 + m$ 和 $m = -(u(0) + 2m - 22)$，所以 $4m = 12$，$m = 3$，小于 $\\frac{12}{2} = 6$。\n\n检验：这时 $u(0) = 13$，$u(2) = 19$，而 $22 - 19 = 3$ 正是斜率，符合右端的条件。\n\n> **注意。** 右端条件带负号，因为热量沿 $x$ 增大的方向从那一端离开；漏掉它会得到错误的 $m$ 的方程。",
  ],
  (rng) =>
    until(() => {
      const h = rng.int(1, 5);
      const L = rng.int(1, 6);
      const T1 = rng.int(5, 40);
      const T2 = T1 + rng.int(3, 40);
      const gap = T2 - T1;
      const answer = Q.of(h * gap, 2 + h * L);
      const factor = h === 1 ? "" : `${h}`;
      const start = Q.of(T1).add(answer.div(Q.of(h)));
      const end = start.add(answer.mul(Q.of(L)));
      const misses: Miss[] = [
        [
          Q.of(gap, L),
          "That ignores the transfer at the ends, as if they were held at $T_1$ and $T_2$.",
          "那忽略了两端的传热，好像两端保持在 $T_1$ 和 $T_2$。",
        ],
        [Q.of(h * gap, 1 + h * L), "That counts the transfer at only one end.", "那只算了一端的传热。"],
        [Q.of(h * gap, 2 + L), "That forgets to multiply $L$ by $h$.", "那忘了把 $L$ 乘以 $h$。"],
        [Q.of(h * gap, h * L), "That drops the $2$ that the two ends contribute.", "那漏掉了两端贡献的 $2$。"],
      ];
      return worked(
        [
          `A rod on $[0, ${L}]$ is steady, with $u_x(0) = ${factor}(u(0) - ${T1})$ and $u_x(${L}) = -${factor}(u(${L}) - ${T2})$. What is the slope of its temperature?`,
          `$[0, ${L}]$ 上的杆处于稳态，且 $u_x(0) = ${factor}(u(0) - ${T1})$，$u_x(${L}) = -${factor}(u(${L}) - ${T2})$。它的温度的斜率是多少？`,
        ],
        answer,
        misses,
        [
          [
            ["Use the left end", "用左端"],
            [
              `Let the slope be $m$, so $u = u(0) + mx$. The left condition gives $m = ${factor}(u(0) - ${T1})$, so $u(0) = ${T1} + ${over("m", h)}$.`,
              `设斜率为 $m$，则 $u = u(0) + mx$。左端条件给出 $m = ${factor}(u(0) - ${T1})$，所以 $u(0) = ${T1} + ${over("m", h)}$。`,
            ],
          ],
          [
            ["Use the right end", "用右端"],
            [
              `The right condition gives $m = -${factor}\\left(u(0) + ${coef(L, "m")} - ${T2}\\right)$. Substituting $u(0)$ gives $${2 + h * L}m = ${h * gap}$, so $m = ${settle(h * gap, 2 + h * L, answer)}$.`,
              `右端条件给出 $m = -${factor}\\left(u(0) + ${coef(L, "m")} - ${T2}\\right)$。代入 $u(0)$，得 $${2 + h * L}m = ${h * gap}$，所以 $m = ${settle(h * gap, 2 + h * L, answer)}$。`,
            ],
          ],
        ],
        [
          `Then $u(0) = ${start.toLatex()}$ and $u(${L}) = ${end.toLatex()}$, and $${factor}\\left(${T2} - ${end.toLatex()}\\right) = ${answer.toLatex()}$, the slope, as the right condition requires.`,
          `这时 $u(0) = ${start.toLatex()}$，$u(${L}) = ${end.toLatex()}$，而 $${factor}\\left(${T2} - ${end.toLatex()}\\right) = ${answer.toLatex()}$ 正是斜率，符合右端条件。`,
        ],
      );
    }),
);

const velocityDependence = point(
  "a-value-from-an-initial-velocity",
  ["A value from an initial velocity", "由初速度求值"],
  [
    "With zero displacement, d'Alembert's formula gives $u(x, t) = \\frac{1}{2c}\\int_{x - ct}^{x + ct} g$. So only the initial velocity inside the domain of dependence counts, and for a constant velocity on an interval, the value is proportional to the overlap of this interval with the domain. For example, with $c = 1$, $t = 2$ and velocity $4$ on $[0, 3]$, the point $x = 4$ has the domain $[2, 6]$, which overlaps $[0, 3]$ in $[2, 3]$, of length $1$, so $u = \\frac{4 \\cdot 1}{2} = 2$.\n\nCheck: the whole interval would give at most $\\frac{4 \\cdot 3}{2} = 6$, and the overlap is a third of the interval, so $2$ is a third of $6$.\n\n> **Watch out.** Use the overlap with $[x - ct, x + ct]$, not the whole interval of velocity, and divide by $2c$, not by $c$.",
    "初始位移为零时，达朗贝尔公式给出 $u(x, t) = \\frac{1}{2c}\\int_{x - ct}^{x + ct} g$。所以只有依赖域内的初速度起作用，对区间上的常数初速度，值与这个区间和依赖域的重叠长度成正比。例如，$c = 1$，$t = 2$，初速度在 $[0, 3]$ 上为 $4$ 时，点 $x = 4$ 的依赖域是 $[2, 6]$，它与 $[0, 3]$ 重叠于 $[2, 3]$，长度为 $1$，所以 $u = \\frac{4 \\cdot 1}{2} = 2$。\n\n检验：整个区间最多给出 $\\frac{4 \\cdot 3}{2} = 6$，而重叠部分是区间的三分之一，所以 $2$ 是 $6$ 的三分之一。\n\n> **注意。** 要用与 $[x - ct, x + ct]$ 的重叠部分，而不是整个初速度区间；还要除以 $2c$，而不是 $c$。",
  ],
  (rng) =>
    until(() => {
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
      const whole = Q.of(v * (b - a), 2 * c);
      const misses: Miss[] = [
        [Q.of(v * overlap, c), "That divides by $c$ instead of $2c$.", "那除以了 $c$，而不是 $2c$。"],
        [Q.of(v * overlap), "That forgets the factor $\\frac{1}{2c}$.", "那忘了因子 $\\frac{1}{2c}$。"],
        [
          whole,
          "That uses the whole interval of velocity, not its overlap with the domain of dependence.",
          "那用了整个初速度区间，而不是它与依赖域的重叠部分。",
        ],
        [
          Q.of(v * t),
          "That integrates over the whole domain of dependence, as if the velocity were nonzero throughout it.",
          "那在整个依赖域上积分，好像初速度处处不为零。",
        ],
      ];
      return worked(
        [
          `A string with wave speed $${c}$ starts with zero displacement. Its initial velocity is $${v}$ on $[${a}, ${b}]$ and $0$ elsewhere. What is $u(${x}, ${t})$?`,
          `波速为 $${c}$ 的弦初始位移为零。初速度在 $[${a}, ${b}]$ 上为 $${v}$，其他地方为 $0$。$u(${x}, ${t})$ 是多少？`,
        ],
        answer,
        misses,
        [
          [
            ["Find the overlap", "求重叠部分"],
            [
              `The domain of dependence is $[${x - c * t}, ${x + c * t}]$. It overlaps $[${a}, ${b}]$ in $[${lo}, ${hi}]$, of length $${overlap}$.`,
              `依赖域是 $[${x - c * t}, ${x + c * t}]$。它与 $[${a}, ${b}]$ 重叠于 $[${lo}, ${hi}]$，长度为 $${overlap}$。`,
            ],
          ],
          [
            ["Integrate", "积分"],
            [
              `The integral of the velocity over the overlap is $${v} \\cdot ${overlap} = ${v * overlap}$, so $u = ${settle(v * overlap, 2 * c, answer)}$.`,
              `初速度在重叠部分上的积分是 $${v} \\cdot ${overlap} = ${v * overlap}$，所以 $u = ${settle(v * overlap, 2 * c, answer)}$。`,
            ],
          ],
        ],
        overlap === b - a
          ? [
              `The domain covers the whole interval, so the value is the largest one the interval can give, $\\frac{1}{${2 * c}}$ times the total $${v * overlap}$ of the velocity.`,
              `依赖域覆盖了整个区间，所以这个值是这个区间能给出的最大值，即初速度总量 $${v * overlap}$ 的 $\\frac{1}{${2 * c}}$。`,
            ]
          : [
              `The whole interval would give $${settle(v * (b - a), 2 * c, whole)}$, and $${answer.toLatex()}$ is the share $${Q.of(overlap, b - a).toLatex()}$ of it, the share of the interval that the domain covers.`,
              `整个区间会给出 $${settle(v * (b - a), 2 * c, whole)}$，而 $${answer.toLatex()}$ 是它的 $${Q.of(overlap, b - a).toLatex()}$，正是依赖域覆盖的那部分区间所占的比例。`,
            ],
      );
    }),
);

const mixedEndPeriod = point(
  "the-period-with-one-fixed-and-one-free-end",
  ["The period with one fixed and one free end", "一端固定一端自由时的周期"],
  [
    "A pulse flips sign at a fixed end but not at a free end. On a string with one of each, one round trip of length $2L$ returns the pulse with the opposite sign, so it takes two round trips, a time $\\frac{4L}{c}$, to return to its original state. For example, with $L = 3$ and $c = 2$, one round trip takes $\\frac{6}{2} = 3$ and returns the pulse upside down, so the period is $\\frac{12}{2} = 6$.\n\nCheck: the modes $\\sin\\frac{(2n - 1)\\pi x}{6}$ have frequencies that are odd multiples of $\\frac{2\\pi}{6} = \\frac{\\pi}{3}$, and the lowest has the period $2\\pi \\div \\frac{\\pi}{3} = 6$.\n\n> **Watch out.** One round trip is not enough: the pulse comes back with the opposite sign, so the period is $\\frac{4L}{c}$, twice that of a string with two fixed ends.",
    "脉冲在固定端翻转符号，在自由端不翻转。在一端固定一端自由的弦上，长度为 $2L$ 的一次往返使脉冲以相反的符号返回，所以需要两次往返，即时间 $\\frac{4L}{c}$，才能回到原来的状态。例如，$L = 3$，$c = 2$ 时，一次往返用时 $\\frac{6}{2} = 3$，脉冲倒着回来，所以周期是 $\\frac{12}{2} = 6$。\n\n检验：模态 $\\sin\\frac{(2n - 1)\\pi x}{6}$ 的频率是 $\\frac{2\\pi}{6} = \\frac{\\pi}{3}$ 的奇数倍，最低的那个周期是 $2\\pi \\div \\frac{\\pi}{3} = 6$。\n\n> **注意。** 一次往返不够：脉冲以相反的符号回来，所以周期是 $\\frac{4L}{c}$，是两端固定的弦的两倍。",
  ],
  (rng) =>
    until(() => {
      const L = rng.int(1, 12);
      const c = rng.int(2, 9);
      const answer = Q.of(4 * L, c);
      const lowest = Q.of(c, 2 * L);
      const frequency = `${lowest.n === 1n ? "" : lowest.n}\\pi`;
      const omega = lowest.d === 1n ? frequency : `\\frac{${frequency}}{${lowest.d}}`;
      const misses: Miss[] = [
        [
          Q.of(2 * L, c),
          "That stops after one round trip, when the pulse has the opposite sign.",
          "那在一次往返后就停了，这时脉冲符号相反。",
        ],
        [Q.of(L, c), "That counts a one-way trip.", "那只算了单程。"],
        [Q.of(8 * L, c), "That takes four round trips; two already restore the pulse.", "那用了四次往返；两次就使脉冲恢复了。"],
        [Q.of(4 * L * c), "That multiplies by the speed instead of dividing.", "那乘了波速，而不是除以波速。"],
      ];
      return worked(
        [
          `A string of length $${L}$ has one fixed end and one free end, with wave speed $${c}$. After what smallest time does every pulse return to its starting position, direction and sign?`,
          `长度为 $${L}$ 的弦一端固定，一端自由，波速为 $${c}$。经过多长的最短时间，每个脉冲都回到原来的位置、方向和符号？`,
        ],
        answer,
        misses,
        [
          [
            ["One round trip", "一次往返"],
            [
              `A round trip covers $${2 * L}$ and takes $${settle(2 * L, c, Q.of(2 * L, c))}$. It meets the fixed end once, so the pulse returns with the opposite sign.`,
              `一次往返走过 $${2 * L}$，用时 $${settle(2 * L, c, Q.of(2 * L, c))}$。它遇到固定端一次，所以脉冲以相反的符号返回。`,
            ],
          ],
          [
            ["Two round trips", "两次往返"],
            [
              `A second round trip flips the sign back, so the smallest time is $${settle(4 * L, c, answer)}$.`,
              `第二次往返把符号翻回来，所以最短时间是 $${settle(4 * L, c, answer)}$。`,
            ],
          ],
        ],
        [
          `The lowest mode $\\sin\\frac{\\pi x}{${2 * L}}$ has frequency $${omega}$, and its period $2\\pi \\div ${omega} = ${answer.toLatex()}$ agrees.`,
          `最低模态 $\\sin\\frac{\\pi x}{${2 * L}}$ 的频率是 $${omega}$，它的周期 $2\\pi \\div ${omega} = ${answer.toLatex()}$，结果一致。`,
        ],
      );
    }),
);

const equalEnergy = point(
  "the-amplitude-that-matches-an-energy",
  ["The amplitude that matches an energy", "匹配能量的振幅"],
  [
    "In suitable units, mode $n$ with amplitude $A$ has energy $n^{2}A^{2}$. So a higher mode carries more energy at the same amplitude. To carry the same energy as another mode, its amplitude must be smaller by the ratio of the mode numbers, not by the ratio of their squares. For example, mode $1$ with amplitude $6$ has energy $36$, and mode $3$ carries the same energy with amplitude $2$, since $9 \\cdot 4 = 36$.\n\nCheck: the products of mode number and amplitude agree, $1 \\cdot 6 = 6 = 3 \\cdot 2$.\n\n> **Watch out.** Divide by the ratio of the mode numbers, not of their squares; the energy goes with the square of $nA$, so the product $nA$ is what stays the same.",
    "在适当的单位下，振幅为 $A$ 的模态 $n$ 的能量是 $n^{2}A^{2}$。所以振幅相同时，高阶模态携带更多能量。要携带与另一模态相同的能量，它的振幅要按模态数之比缩小，而不是按平方之比缩小。例如，振幅为 $6$ 的模态 $1$ 的能量是 $36$，模态 $3$ 用振幅 $2$ 就携带相同的能量，因为 $9 \\cdot 4 = 36$。\n\n检验：模态数与振幅的乘积相同，$1 \\cdot 6 = 6 = 3 \\cdot 2$。\n\n> **注意。** 要除以模态数之比，而不是平方之比；能量与 $nA$ 的平方成正比，所以保持不变的是乘积 $nA$。",
  ],
  (rng) =>
    until(() => {
      const [m, n] = rng.sample([1, 2, 3, 4, 5, 6, 7, 8], 2) as [number, number];
      const A = rng.int(1, 9);
      const answer = Q.of(m * A, n);
      const energy = m * m * A * A;
      const square = settle(energy, n * n, Q.of(energy, n * n));
      const misses: Miss[] = [
        [Q.of(n * A, m), "That uses the ratio of the mode numbers upside down.", "那把模态数之比用倒了。"],
        [Q.of(m * m * A, n * n), "That uses the ratio of the squares of the mode numbers.", "那用了模态数平方之比。"],
        [Q.of(A), "That keeps the amplitude, which gives a different energy.", "那保留了原振幅，能量就不同了。"],
        [
          Q.of(m * m * A * A, n * n),
          "That gives the square of the amplitude and forgets the square root.",
          "那给出的是振幅的平方，忘了开方。",
        ],
      ];
      return worked(
        [
          `In units where mode $n$ with amplitude $A$ has energy $n^{2}A^{2}$, mode $${m}$ has amplitude $${A}$. What amplitude must mode $${n}$ have to carry the same energy?`,
          `在模态 $n$ 振幅为 $A$ 时能量为 $n^{2}A^{2}$ 的单位下，模态 $${m}$ 的振幅是 $${A}$。模态 $${n}$ 的振幅应为多少才能携带相同的能量？`,
        ],
        answer,
        misses,
        [
          [
            ["Find the energy", "求能量"],
            [
              `Mode $${m}$ has energy $${m}^{2} \\cdot ${A}^{2} = ${energy}$.`,
              `模态 $${m}$ 的能量是 $${m}^{2} \\cdot ${A}^{2} = ${energy}$。`,
            ],
          ],
          [
            ["Solve for the amplitude", "求振幅"],
            [
              `Setting $${n}^{2}B^{2} = ${energy}$ gives $B^{2} = ${square}$, so $B = ${answer.toLatex()}$.`,
              `令 $${n}^{2}B^{2} = ${energy}$，得 $B^{2} = ${square}$，所以 $B = ${answer.toLatex()}$。`,
            ],
          ],
        ],
        [
          `The product of mode number and amplitude stays the same: $${n} \\cdot ${answer.d === 1n ? answer.toLatex() : `\\left(${answer.toLatex()}\\right)`} = ${m * A}$, and $${m} \\cdot ${A} = ${m * A}$.`,
          `模态数与振幅的乘积不变：$${n} \\cdot ${answer.d === 1n ? answer.toLatex() : `\\left(${answer.toLatex()}\\right)`} = ${m * A}$，而 $${m} \\cdot ${A} = ${m * A}$。`,
        ],
      );
    }),
);

const slowestDecay = point(
  "the-slow-rate-of-an-overdamped-mode",
  ["The slow rate of an overdamped mode", "过阻尼模态的慢速率"],
  [
    "A mode of a damped string that does not oscillate satisfies an equation with two real negative roots, and so it is a sum of two decaying exponentials. In the long run the smaller rate wins, because the term with the larger rate dies out first. For example, $T'' + 5T' + 4T = 0$ has the characteristic roots $-1$ and $-4$, so $T = Ae^{-t} + Be^{-4t}$, which in the long run behaves like $Ae^{-t}$.\n\nCheck: $(-1)^{2} + 5 \\cdot (-1) + 4 = 0$ and $(-4)^{2} + 5 \\cdot (-4) + 4 = 0$, so both roots are right.\n\n> **Watch out.** The term that lasts is the one with the smaller rate; the larger rate, the coefficient of $T'$ and the average of the rates are all wrong answers.",
    "阻尼弦中不振荡的模态满足一个有两个负实根的方程，所以它是两个衰减指数的和。长时间后，较小的速率起决定作用，因为速率较大的项先消失。例如，$T'' + 5T' + 4T = 0$ 的特征根是 $-1$ 和 $-4$，所以 $T = Ae^{-t} + Be^{-4t}$，长时间后它的行为类似 $Ae^{-t}$。\n\n检验：$(-1)^{2} + 5 \\cdot (-1) + 4 = 0$，$(-4)^{2} + 5 \\cdot (-4) + 4 = 0$，所以两个根都对。\n\n> **注意。** 留下来的是速率较小的项；较大的速率、$T'$ 的系数和两个速率的平均值都是错的。",
  ],
  (rng) =>
    until(() => {
      const r = rng.int(1, 12);
      const s = r + rng.int(1, 12);
      const misses: Miss[] = [
        [s, "That keeps the larger rate, whose term dies out first.", "那取了较大的速率，而它的项先消失。"],
        [r + s, "That takes the coefficient of $T'$ as the rate.", "那把 $T'$ 的系数当成了速率。"],
        [Q.of(r + s, 2), "That averages the two rates.", "那取了两个速率的平均值。"],
        [r * s, "That takes the constant coefficient as the rate.", "那把常数项系数当成了速率。"],
      ];
      return worked(
        [
          `A mode of a damped string satisfies $T'' + ${r + s} T' + ${r * s} T = 0$. In the long run, $T$ behaves like a constant times $e^{-\\rho t}$. What is $\\rho$?`,
          `阻尼弦的一个模态满足 $T'' + ${r + s} T' + ${r * s} T = 0$。长时间后，$T$ 的行为类似常数乘 $e^{-\\rho t}$。$\\rho$ 是多少？`,
        ],
        r,
        misses,
        [
          [
            ["Factor", "因式分解"],
            [
              `The characteristic equation is $\\lambda^{2} + ${r + s}\\lambda + ${r * s} = (\\lambda + ${r})(\\lambda + ${s}) = 0$, with the roots $-${r}$ and $-${s}$.`,
              `特征方程是 $\\lambda^{2} + ${r + s}\\lambda + ${r * s} = (\\lambda + ${r})(\\lambda + ${s}) = 0$，根是 $-${r}$ 和 $-${s}$。`,
            ],
          ],
          [
            ["Keep the slow term", "保留慢的项"],
            [
              `So $T = Ae^{${r === 1 ? "-t" : `-${r}t`}} + Be^{-${s}t}$. The second term dies out first, so $\\rho = ${r}$.`,
              `所以 $T = Ae^{${r === 1 ? "-t" : `-${r}t`}} + Be^{-${s}t}$。第二项先消失，所以 $\\rho = ${r}$。`,
            ],
          ],
        ],
        [
          `Substituting the root: $(-${r})^{2} + ${r + s} \\cdot (-${r}) + ${r * s} = ${r * r} - ${r * (r + s)} + ${r * s} = 0$.`,
          `代入根：$(-${r})^{2} + ${r + s} \\cdot (-${r}) + ${r * s} = ${r * r} - ${r * (r + s)} + ${r * s} = 0$。`,
        ],
      );
    }),
);

const rectangularDrum = {
  ...point(
    "a-frequency-of-a-rectangular-drum",
    ["A frequency of a rectangular drum", "矩形鼓的频率"],
    [
      "On a rectangle with sides $a$ and $b$, the mode $(m, n)$ has frequency $\\omega = c\\pi\\sqrt{\\frac{m^{2}}{a^{2}} + \\frac{n^{2}}{b^{2}}}$. Each mode number is divided by its own side, so the two directions no longer play the same role as they do on a square. For example, the drum in the figure has sides $a = 3$ and $b = 2$, and its mode $(3, 2)$ has $\\omega = c\\pi\\sqrt{\\frac{9}{9} + \\frac{4}{4}} = c\\pi\\sqrt{2}$.\n\nCheck: the figure shows $3$ cells along the side $3$ and $2$ along the side $2$, so every cell is a unit square, whose lowest mode has the same frequency $c\\pi\\sqrt{2}$.\n\n> **Watch out.** Pair each mode number with its own side; swapping them here would give $\\frac{9}{4} + \\frac{4}{9}$ and a different frequency.",
      "在边长为 $a$ 和 $b$ 的矩形上，模态 $(m, n)$ 的频率是 $\\omega = c\\pi\\sqrt{\\frac{m^{2}}{a^{2}} + \\frac{n^{2}}{b^{2}}}$。每个模态数除以各自的边长，所以两个方向不再像正方形上那样地位相同。例如，图中的鼓边长 $a = 3$，$b = 2$，它的模态 $(3, 2)$ 有 $\\omega = c\\pi\\sqrt{\\frac{9}{9} + \\frac{4}{4}} = c\\pi\\sqrt{2}$。\n\n检验：图中沿边长 $3$ 有 $3$ 格，沿边长 $2$ 有 $2$ 格，所以每格都是单位正方形，单位正方形的最低模态的频率同样是 $c\\pi\\sqrt{2}$。\n\n> **注意。** 每个模态数要与自己的边配对；这里交换它们会得到 $\\frac{9}{4} + \\frac{4}{9}$，频率就不同了。",
    ],
    (rng) =>
      until(() => {
        const [a, b] = rng.sample([2, 3, 4, 5, 6], 2) as [number, number];
        const c = rng.int(1, 5);
        const m = rng.int(1, 4);
        const n = rng.int(1, 4);
        const first = Q.of(m * m, a * a);
        const second = Q.of(n * n, b * b);
        const inner = first.add(second);
        const answer = inner.mul(Q.of(c * c));
        const misses: Miss[] = [
          [inner.mul(Q.of(c)), "That forgets to square the wave speed.", "那忘了把波速平方。"],
          [
            Q.of(m * m, b * b)
              .add(Q.of(n * n, a * a))
              .mul(Q.of(c * c)),
            "That pairs each mode number with the wrong side.",
            "那把模态数与错误的边配对了。",
          ],
          [
            Q.of(c * c * (m * m + n * n), a * b),
            "That divides both squares by the product of the sides.",
            "那把两个平方都除以了两边之积。",
          ],
          [inner, "That leaves out the wave speed.", "那漏掉了波速。"],
        ];
        return worked(
          [
            `A rectangular membrane has sides $${a}$ and $${b}$ and wave speed $${c}$. Its mode $(m, n) = (${m}, ${n})$ has frequency $\\omega$, with $m$ belonging to the side $${a}$. What is $\\frac{\\omega^{2}}{\\pi^{2}}$?`,
            `矩形膜的边长为 $${a}$ 和 $${b}$，波速为 $${c}$。它的模态 $(m, n) = (${m}, ${n})$ 的频率为 $\\omega$，其中 $m$ 对应边长 $${a}$。$\\frac{\\omega^{2}}{\\pi^{2}}$ 是多少？`,
          ],
          answer,
          misses,
          [
            [
              ["Divide by the sides", "除以边长"],
              [
                `Each mode number goes with its own side: $\\frac{${m * m}}{${a * a}} + \\frac{${n * n}}{${b * b}} = ${inner.toLatex()}$.`,
                `每个模态数与自己的边配对：$\\frac{${m * m}}{${a * a}} + \\frac{${n * n}}{${b * b}} = ${inner.toLatex()}$。`,
              ],
            ],
            [
              ["Multiply by the speed squared", "乘以波速的平方"],
              [
                c === 1
                  ? `With $c = 1$, $\\frac{\\omega^{2}}{\\pi^{2}} = ${answer.toLatex()}$.`
                  : `$\\frac{\\omega^{2}}{\\pi^{2}} = ${c}^{2} \\cdot ${inner.toLatex()} = ${answer.toLatex()}$.`,
                c === 1
                  ? `$c = 1$，所以 $\\frac{\\omega^{2}}{\\pi^{2}} = ${answer.toLatex()}$。`
                  : `$\\frac{\\omega^{2}}{\\pi^{2}} = ${c}^{2} \\cdot ${inner.toLatex()} = ${answer.toLatex()}$。`,
              ],
            ],
          ],
          [
            `Each term is the square of a mode number over its side: $\\left(${Q.of(m, a).toLatex()}\\right)^{2} = ${first.toLatex()}$ and $\\left(${Q.of(n, b).toLatex()}\\right)^{2} = ${second.toLatex()}$, which add to $${inner.toLatex()}$.`,
            `每一项是模态数与边长之比的平方：$\\left(${Q.of(m, a).toLatex()}\\right)^{2} = ${first.toLatex()}$，$\\left(${Q.of(n, b).toLatex()}\\right)^{2} = ${second.toLatex()}$，相加得 $${inner.toLatex()}$。`,
          ],
        );
      }),
  ),
  figure: pdeDrawings1["the-vibrating-membrane#a-frequency-of-a-rectangular-drum"],
};

const stepCount = point(
  "the-work-of-a-stable-wave-computation",
  ["The work of a stable wave computation", "稳定波动计算的工作量"],
  [
    "Stability of the leapfrog scheme requires $\\Delta t \\le \\frac{\\Delta x}{c}$. So refining the grid also forces smaller time steps, in proportion to $\\Delta x$. This differs from the explicit heat scheme, where the time step must shrink like $\\Delta x^{2}$. For example, with $c = 2$ and $\\Delta x = \\frac{1}{10}$, the largest stable step is $\\frac{1}{20}$, so reaching $t = 1$ takes $20$ steps.\n\nCheck: halving $\\Delta x$ to $\\frac{1}{20}$ halves the step to $\\frac{1}{40}$ and doubles the count to $40$, while for the explicit heat scheme it would quadruple the count.\n\n> **Watch out.** The step is $\\frac{\\Delta x}{c}$, so the count is $\\frac{cT}{\\Delta x}$; squaring $\\Delta x$ belongs to the heat scheme, not to the wave equation.",
    "蛙跳格式的稳定性要求 $\\Delta t \\le \\frac{\\Delta x}{c}$。所以加密网格也迫使时间步按 $\\Delta x$ 的比例缩小。这与显式热方程格式不同，那里时间步必须按 $\\Delta x^{2}$ 缩小。例如，$c = 2$，$\\Delta x = \\frac{1}{10}$ 时，最大的稳定步长是 $\\frac{1}{20}$，所以到达 $t = 1$ 需要 $20$ 步。\n\n检验：把 $\\Delta x$ 减半为 $\\frac{1}{20}$，步长减半为 $\\frac{1}{40}$，步数加倍为 $40$；而对显式热方程格式，步数会变为四倍。\n\n> **注意。** 步长是 $\\frac{\\Delta x}{c}$，所以步数是 $\\frac{cT}{\\Delta x}$；把 $\\Delta x$ 平方属于热方程格式，不属于波动方程。",
  ],
  (rng) =>
    until(() => {
      const c = rng.int(2, 9);
      const k = rng.int(2, 20);
      const T = rng.int(1, 9);
      const answer = T * c * k;
      const misses: Miss[] = [
        [T * c * k * k, "That squares $\\Delta x$, as for the heat scheme.", "那把 $\\Delta x$ 平方了，像热方程格式那样。"],
        [T * k, "That forgets the wave speed.", "那忘了波速。"],
        [T * c, "That forgets the grid spacing.", "那忘了网格间距。"],
        [Q.of(T * k, c), "That divides by the wave speed instead of multiplying.", "那除以了波速，而不是乘以波速。"],
      ];
      return worked(
        [
          `A leapfrog computation has wave speed $${c}$ and $\\Delta x = \\frac{1}{${k}}$. What is the smallest number of stable time steps needed to reach $t = ${T}$?`,
          `蛙跳计算的波速为 $${c}$，$\\Delta x = \\frac{1}{${k}}$。到达 $t = ${T}$ 至少需要多少个稳定的时间步？`,
        ],
        answer,
        misses,
        [
          [
            ["Find the largest step", "求最大步长"],
            [
              `Stability needs $\\Delta t \\le \\frac{\\Delta x}{c} = \\frac{1}{${k}} \\div ${c} = \\frac{1}{${c * k}}$.`,
              `稳定性要求 $\\Delta t \\le \\frac{\\Delta x}{c} = \\frac{1}{${k}} \\div ${c} = \\frac{1}{${c * k}}$。`,
            ],
          ],
          [
            ["Count the steps", "数步数"],
            [
              T === 1
                ? `Reaching $t = 1$ takes $${answer}$ steps of this size.`
                : `Reaching $t = ${T}$ takes $${T} \\cdot ${c * k} = ${answer}$ steps of this size.`,
              T === 1
                ? `到达 $t = 1$ 需要 $${answer}$ 个这样的步长。`
                : `到达 $t = ${T}$ 需要 $${T} \\cdot ${c * k} = ${answer}$ 个这样的步长。`,
            ],
          ],
        ],
        [
          `$${answer}$ steps of $\\frac{1}{${c * k}}$ cover $\\frac{${answer}}{${c * k}} = ${T}$, exactly the time required, and one step fewer would fall short.`,
          `$${answer}$ 个 $\\frac{1}{${c * k}}$ 的步长覆盖 $\\frac{${answer}}{${c * k}} = ${T}$，正是所需的时间，少一步就不够。`,
        ],
      );
    }),
);

const backwardHeat = point(
  "how-fast-the-backward-heat-equation-amplifies",
  ["How fast the backward heat equation amplifies", "逆向热方程的放大速度"],
  [
    "The backward heat equation $u_t = -k u_{xx}$ is ill posed because its modes grow instead of decay, and the growth rate $k n^{2}$ is unbounded as $n$ increases. So even a tiny high-frequency change in the data can cause an enormous change later, and continuous dependence on the data fails. For example, for $u_t = -u_{xx}$ the data $\\varepsilon \\sin 10x$ grows like $\\varepsilon e^{100t}\\sin 10x$, so by $t = 1$ it has been multiplied by $e^{100}$, more than $10^{43}$.\n\nCheck: $u = \\varepsilon e^{100t}\\sin 10x$ has $u_t = 100u$ and $u_{xx} = -100u$, so $u_t = -u_{xx}$ holds.\n\n> **Watch out.** The modes grow, so the exponent is positive, not negative as for the forward heat equation; and the rate goes with $n^{2}$, not with $n$.",
    "逆向热方程 $u_t = -k u_{xx}$ 是不适定的，因为它的模态增长而不是衰减，而且增长率 $k n^{2}$ 随 $n$ 增大而无界。所以数据中即使极小的高频变化也可能在之后引起巨大的变化，对数据的连续依赖性不成立。例如，对 $u_t = -u_{xx}$，数据 $\\varepsilon \\sin 10x$ 按 $\\varepsilon e^{100t}\\sin 10x$ 增长，所以到 $t = 1$ 时它乘了 $e^{100}$，超过 $10^{43}$。\n\n检验：$u = \\varepsilon e^{100t}\\sin 10x$ 有 $u_t = 100u$，$u_{xx} = -100u$，所以 $u_t = -u_{xx}$ 成立。\n\n> **注意。** 模态是增长的，所以指数为正，而不像正向热方程那样为负；而且增长率与 $n^{2}$ 成正比，而不是与 $n$ 成正比。",
  ],
  (rng) =>
    until(() => {
      const k = rng.int(1, 5);
      const n = rng.int(2, 12);
      const T = rng.int(1, 5);
      const rate = k * n * n;
      const answer = rate * T;
      const equation = k === 1 ? "u_t = -u_{xx}" : `u_t = -${k} u_{xx}`;
      const misses: Miss[] = [
        [-answer, "That gives the sign of the forward heat equation, where the mode decays.", "那用了正向热方程的符号，那里模态衰减。"],
        [k * n * T, "That forgets to square the mode number.", "那忘了把模态数平方。"],
        [n * n * T, "That leaves out the factor $k$.", "那漏掉了因子 $k$。"],
        [rate, "That gives the rate and forgets to multiply by the time.", "那给出的是增长率，忘了乘以时间。"],
      ];
      return worked(
        [
          `For $${equation}$ on $[0, \\pi]$ with zero ends, the data $\\varepsilon \\sin ${n}x$ grows by the factor $e^{K}$ by time $t = ${T}$. What is $K$?`,
          `对 $[0, \\pi]$ 上的 $${equation}$，两端为零，数据 $\\varepsilon \\sin ${n}x$ 到时刻 $t = ${T}$ 增长了 $e^{K}$ 倍。$K$ 是多少？`,
        ],
        answer,
        misses,
        [
          [
            ["Find the rate", "求增长率"],
            [
              `Substituting $u = \\varepsilon e^{\\lambda t}\\sin ${n}x$ gives $\\lambda = ${k === 1 ? `${n}^{2}` : `${k} \\cdot ${n}^{2}`} = ${rate}$.`,
              `代入 $u = \\varepsilon e^{\\lambda t}\\sin ${n}x$，得 $\\lambda = ${k === 1 ? `${n}^{2}` : `${k} \\cdot ${n}^{2}`} = ${rate}$。`,
            ],
          ],
          [
            ["Multiply by the time", "乘以时间"],
            [
              T === 1
                ? `By $t = 1$ the factor is $e^{${rate}}$, so $K = ${answer}$.`
                : `By $t = ${T}$ the factor is $e^{${rate} \\cdot ${T}}$, so $K = ${answer}$.`,
              T === 1
                ? `到 $t = 1$ 时因子是 $e^{${rate}}$，所以 $K = ${answer}$。`
                : `到 $t = ${T}$ 时因子是 $e^{${rate} \\cdot ${T}}$，所以 $K = ${answer}$。`,
            ],
          ],
        ],
        [
          `$u = \\varepsilon e^{${rate}t}\\sin ${n}x$ has $u_t = ${rate}u$ and $u_{xx} = -${n * n}u$, so $${k === 1 ? "-u_{xx}" : `-${k} u_{xx}`} = ${rate}u = u_t$, as the equation requires.`,
          `$u = \\varepsilon e^{${rate}t}\\sin ${n}x$ 有 $u_t = ${rate}u$，$u_{xx} = -${n * n}u$，所以 $${k === 1 ? "-u_{xx}" : `-${k} u_{xx}`} = ${rate}u = u_t$，符合方程。`,
        ],
      );
    }),
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
