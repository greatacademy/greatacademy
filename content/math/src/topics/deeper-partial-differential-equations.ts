// Further knowledge points for topics of Partial Differential Equations, each a skill the topic's own
// points leave out. See `deeperPartialDifferentialEquationsPoints`.

import type { KnowledgePointDef } from "@ga/content";
import { Q } from "@ga/subject-math";
import { pdeDrawings1 } from "../explanation-drawings-partial-differential-equations-1.ts";

import { type Pair, point } from "../university-kit.ts";
import { chosen, type Miss, type Slip, until, worked } from "./number-theory-course.ts";

/** coef writes a coefficient before a symbol, leaving out 1. */
const coef = (c: number, symbol: string) => (c === 1 ? symbol : c === -1 ? `-${symbol}` : `${c}${symbol}`);
/** wrap puts a negative number in parentheses, so that it can follow an operation sign. */
const wrap = (n: number): string => (n < 0 ? `(${n})` : `${n}`);
/** plus writes a signed number as a term that follows another, as in "+ 3" or "- 3". */
const plus = (n: number): string => (n < 0 ? `- ${-n}` : `+ ${n}`);
/** settle writes p over q, followed by its value in lowest terms when that reads differently. */
const settle = (p: number, q: number, value: Q): string => {
  const raw = p < 0 ? `-\\frac{${-p}}{${q}}` : `\\frac{${p}}{${q}}`;
  return raw === value.toLatex() ? raw : `${raw} = ${value.toLatex()}`;
};
/** piOver writes p pi over q in lowest terms, leaving out a coefficient or a denominator of one. */
const piOver = (p: number, q: number): string => {
  const r = Q.of(p, q);
  const top = r.n === 1n ? "\\pi" : `${r.n}\\pi`;
  return r.d === 1n ? top : `\\frac{${top}}{${r.d}}`;
};

const superposition = point(
  "combining-solutions-by-superposition",
  ["Combining solutions by superposition", "用叠加法合并解"],
  [
    "A linear homogeneous equation has the property that any combination $c_1 u_1 + c_2 u_2$ of solutions is again a solution. This is the principle of superposition, and every series solution relies on it. At a given point, the value of the combination comes straight from the two values there. For example, if $u_1 = 4$ and $u_2 = -1$ at a point, then $2u_1 + 3u_2 = 8 - 3 = 5$ there.\n\nCheck: the operator is linear, so applied to $2u_1 + 3u_2$ it gives $2 \\cdot 0 + 3 \\cdot 0 = 0$, and the combination is again a solution.\n\n> **Watch out.** Multiply each value by its own coefficient before adding, and keep the sign of a negative coefficient.",
    "线性齐次方程有这样的性质：解的任何组合 $c_1 u_1 + c_2 u_2$ 仍是解。这就是叠加原理，所有级数解都依赖于它。在给定的点，组合的值直接由那里的两个值得出。例如，若在某点 $u_1 = 4$，$u_2 = -1$，那么那里 $2u_1 + 3u_2 = 8 - 3 = 5$。\n\n检验：算子是线性的，作用在 $2u_1 + 3u_2$ 上得 $2 \\cdot 0 + 3 \\cdot 0 = 0$，所以组合仍是解。\n\n> **注意。** 每个值要先乘自己的系数再相加，负系数要保留符号。",
  ],
  (rng) =>
    until(() => {
      const [c1, c2] = [rng.int(2, 6), rng.pick([-4, -3, -2, 2, 3, 5])];
      const [v, w] = [rng.int(-9, 9), rng.int(-9, 9)];
      if (v === 0 || w === 0) return undefined;
      const answer = c1 * v + c2 * w;
      const combo = `${c1} u_1 ${c2 < 0 ? "-" : "+"} ${Math.abs(c2)} u_2`;
      const misses: Miss[] = [
        [v + w, "That adds the values without their coefficients.", "那把值直接相加，没有乘系数。"],
        [c1 * v - c2 * w, "That flips the sign of the second term.", "那把第二项的符号弄反了。"],
        [c1 * w + c2 * v, "That swaps the coefficients of the two solutions.", "那把两个解的系数交换了。"],
        [c1 + c2, "That adds the coefficients and forgets the values.", "那把系数相加，忘了值。"],
      ];
      return worked(
        [
          `$u_1$ and $u_2$ solve the heat equation, with $u_1 = ${v}$ and $u_2 = ${w}$ at some point. What is the value there of the solution $${combo}$?`,
          `$u_1$ 和 $u_2$ 是热方程的解，在某点 $u_1 = ${v}$，$u_2 = ${w}$。解 $${combo}$ 在那一点的值是多少？`,
        ],
        answer,
        misses,
        [
          [
            ["Scale each value", "各值乘系数"],
            [
              `$${c1} \\cdot ${wrap(v)} = ${c1 * v}$ and $${c2} \\cdot ${wrap(w)} = ${c2 * w}$.`,
              `$${c1} \\cdot ${wrap(v)} = ${c1 * v}$，$${c2} \\cdot ${wrap(w)} = ${c2 * w}$。`,
            ],
          ],
          [
            ["Add", "相加"],
            [`$${c1 * v} ${plus(c2 * w)} = ${answer}$.`, `$${c1 * v} ${plus(c2 * w)} = ${answer}$。`],
          ],
        ],
        [
          `Taking away the first part, $${answer} ${plus(-c1 * v)} = ${c2 * w}$, and $${c2 * w} \\div ${wrap(c2)} = ${w}$, the value of $u_2$.`,
          `减去第一部分，$${answer} ${plus(-c1 * v)} = ${c2 * w}$，而 $${c2 * w} \\div ${wrap(c2)} = ${w}$，正是 $u_2$ 的值。`,
        ],
      );
    }),
);

const typeAtAPoint = point(
  "a-type-that-depends-on-the-point",
  ["A type that depends on the point", "随点变化的类型"],
  [
    "With variable coefficients, the type of a second-order equation can change from point to point. For $u_{xx} + k y u_{yy} = 0$ with $k > 0$, the discriminant has the sign of $-y$. So the equation is elliptic above the $x$-axis, hyperbolic below it, and parabolic on it, as in the study of transonic flow. For example, $u_{xx} + y u_{yy} = 0$ has the discriminant $0^{2} - 4 \\cdot 1 \\cdot y = -4y$, which is $-8$ at $(0, 2)$, so elliptic there, and $8$ at $(0, -2)$, so hyperbolic there.\n\nCheck: at $(0, 2)$ the equation reads $u_{xx} + 2u_{yy} = 0$, whose two coefficients have the same sign, as for Laplace's equation.\n\n> **Watch out.** A positive $y$ makes the discriminant negative, which means elliptic, not hyperbolic; only the sign of $y$ matters, not $x$.",
    "系数可变时，二阶方程的类型可能随点变化。对 $u_{xx} + k y u_{yy} = 0$（$k > 0$），判别式的符号与 $-y$ 相同。所以方程在 $x$ 轴上方是椭圆型，下方是双曲型，轴上是抛物型，跨音速流的研究中就有这种情形。例如，$u_{xx} + y u_{yy} = 0$ 的判别式是 $0^{2} - 4 \\cdot 1 \\cdot y = -4y$，在 $(0, 2)$ 处为 $-8$，所以是椭圆型；在 $(0, -2)$ 处为 $8$，所以是双曲型。\n\n检验：在 $(0, 2)$ 处方程是 $u_{xx} + 2u_{yy} = 0$，两个系数同号，与拉普拉斯方程一样。\n\n> **注意。** $y$ 为正时判别式为负，意味着椭圆型，而不是双曲型；只有 $y$ 的符号起作用，$x$ 不起作用。",
  ],
  (rng) => {
    const k = rng.int(1, 9);
    const x = rng.int(-5, 5);
    const y = rng.pick([-6, -4, -3, -2, -1, 0, 1, 2, 3, 5, 7]);
    const d = -4 * k * y;
    const elliptic: Pair = ["Elliptic", "椭圆型"];
    const hyperbolic: Pair = ["Hyperbolic", "双曲型"];
    const parabolic: Pair = ["Parabolic", "抛物型"];
    const kind = y > 0 ? elliptic : y < 0 ? hyperbolic : parabolic;
    const sign: Pair = d < 0 ? ["negative", "负"] : d > 0 ? ["positive", "正"] : ["zero", "零"];
    const slips: Slip[] = [
      ...(y > 0 ? [] : [[elliptic, "Elliptic needs a negative discriminant.", "椭圆型需要判别式为负。"] as Slip]),
      ...(y < 0 ? [] : [[hyperbolic, "Hyperbolic needs a positive discriminant.", "双曲型需要判别式为正。"] as Slip]),
      ...(y === 0
        ? []
        : [
            [
              parabolic,
              "Parabolic needs a zero discriminant, which happens only on the $x$-axis.",
              "抛物型需要判别式为零，只在 $x$ 轴上出现。",
            ] as Slip,
          ]),
    ];
    const here = k * y;
    const term = here === 1 ? "+ u_{yy}" : here === -1 ? "- u_{yy}" : `${plus(here)} u_{yy}`;
    return chosen(
      rng,
      [
        `What type is $u_{xx} + ${coef(k, "y")} u_{yy} = 0$ at the point $(${x}, ${y})$?`,
        `$u_{xx} + ${coef(k, "y")} u_{yy} = 0$ 在点 $(${x}, ${y})$ 处是什么类型？`,
      ],
      kind,
      slips,
      [
        [
          ["Compute the discriminant", "计算判别式"],
          [
            `With $A = 1$, $B = 0$ and $C = ${coef(k, "y")}$, the discriminant is $B^{2} - 4AC = -4 \\cdot ${k} \\cdot ${wrap(y)} = ${d}$ at $y = ${y}$.`,
            `$A = 1$，$B = 0$，$C = ${coef(k, "y")}$，判别式 $B^{2} - 4AC = -4 \\cdot ${k} \\cdot ${wrap(y)} = ${d}$（$y = ${y}$）。`,
          ],
        ],
        [
          ["Read the sign", "看符号"],
          [
            `The discriminant is ${sign[0]}, so the equation is ${kind[0].toLowerCase()} there.`,
            `判别式为${sign[1]}，所以方程在那里是${kind[1]}。`,
          ],
        ],
      ],
      y === 0
        ? [
            "At this point the equation reads $u_{xx} = 0$: the term in $u_{yy}$ drops out, as for the heat equation, which is parabolic.",
            "在这一点方程变为 $u_{xx} = 0$：$u_{yy}$ 项消失，与抛物型的热方程一样。",
          ]
        : [
            `At this point the equation reads $u_{xx} ${term} = 0$, whose coefficients have ${y > 0 ? "the same sign, as for Laplace's equation" : "opposite signs, as for the wave equation"}.`,
            `在这一点方程变为 $u_{xx} ${term} = 0$，系数${y > 0 ? "同号，与拉普拉斯方程一样" : "异号，与波动方程一样"}。`,
          ],
    );
  },
);

const nodes = point(
  "the-nodes-of-a-mode",
  ["The nodes of a mode", "模态的节点"],
  [
    "The mode $\\sin \\frac{n \\pi x}{L}$ is zero at the ends and also at $n - 1$ points inside the interval. These points, called nodes, stay at rest for a standing wave. So a mode with a higher index has more oscillation in space, and it pairs with a higher eigenvalue. For example, $\\sin \\frac{3 \\pi x}{2}$ on $[0, 2]$ vanishes at the multiples of $\\frac{2}{3}$, so its first zero after $0$ is $\\frac{2}{3}$, and it has the $2$ nodes $\\frac{2}{3}$ and $\\frac{4}{3}$ inside.\n\nCheck: at $x = \\frac{2}{3}$ the angle is $\\frac{3\\pi}{2} \\cdot \\frac{2}{3} = \\pi$, where the sine is zero.\n\n> **Watch out.** Count only the zeros strictly inside: there are $n - 1$ of them, not $n$ or $n + 1$, since the two ends are not nodes inside.",
    "模态 $\\sin \\frac{n \\pi x}{L}$ 在两端为零，在区间内部还有 $n - 1$ 个零点。这些点称为节点，在驻波中保持静止。所以下标越大的模态在空间上振荡越多，对应的特征值也越大。例如，$[0, 2]$ 上的 $\\sin \\frac{3 \\pi x}{2}$ 在 $\\frac{2}{3}$ 的倍数处为零，所以 $0$ 之后第一个零点是 $\\frac{2}{3}$，内部有 $\\frac{2}{3}$ 和 $\\frac{4}{3}$ 这 $2$ 个节点。\n\n检验：在 $x = \\frac{2}{3}$ 处角度是 $\\frac{3\\pi}{2} \\cdot \\frac{2}{3} = \\pi$，正弦为零。\n\n> **注意。** 只数严格在内部的零点：共有 $n - 1$ 个，不是 $n$ 或 $n + 1$ 个，因为两端不算内部的节点。",
  ],
  (rng) =>
    until(() => {
      const n = rng.int(2, 12);
      const L = rng.pick([1, 2, 3, 4, 5]);
      const askFirst = rng.bool();
      const first = Q.of(L, n);
      const answer = askFirst ? first : Q.of(n - 1, 1);
      const mode = L === 1 ? `\\sin ${n} \\pi x` : `\\sin \\frac{${n} \\pi x}{${L}}`;
      const misses: Miss[] = askFirst
        ? [
            [Q.of(1, n), `That forgets the length ${L} of the interval.`, `那忘了区间长度 ${L}。`],
            [
              Q.of(2 * L, n),
              "That waits for the angle $2\\pi$; the sine is already zero at $\\pi$.",
              "那等到角度 $2\\pi$；正弦在 $\\pi$ 时就已为零。",
            ],
            [
              Q.of(L, 2 * n),
              "That is the first crest, where the angle is $\\frac{\\pi}{2}$.",
              "那是第一个波峰，角度为 $\\frac{\\pi}{2}$。",
            ],
            [Q.of(L, n + 1), "That splits the interval into $n + 1$ pieces; there are $n$.", "那把区间分成 $n + 1$ 段；应该是 $n$ 段。"],
          ]
        : [
            [Q.of(n, 1), "That counts one of the ends as well.", "那把一个端点也算进去了。"],
            [Q.of(n + 1, 1), "That counts both ends; they are not inside.", "那把两端都算进去了；它们不在内部。"],
            [Q.of(2 * n, 1), "That counts crests as well as zeros.", "那把波峰也和零点一起数了。"],
          ];
      return worked(
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
        misses,
        [
          [
            ["Find where the sine vanishes", "找正弦的零点"],
            [
              `The sine is zero when its angle $${piOver(n, L)}x$ is a multiple of $\\pi$, that is at the multiples of $${first.toLatex()}$.`,
              `当角度 $${piOver(n, L)}x$ 是 $\\pi$ 的倍数时正弦为零，即在 $${first.toLatex()}$ 的倍数处。`,
            ],
          ],
          askFirst
            ? [
                ["Take the first one", "取第一个"],
                [`The first multiple after $0$ is $x = ${first.toLatex()}$.`, `$0$ 之后第一个倍数是 $x = ${first.toLatex()}$。`],
              ]
            : [
                ["Count the inside ones", "数内部的"],
                [
                  `The zeros are $k \\cdot ${first.toLatex()}$ for $k = 0, 1, \\ldots, ${n}$; leaving out the two ends leaves $${n} - 1 = ${n - 1}$.`,
                  `零点是 $k \\cdot ${first.toLatex()}$，$k = 0, 1, \\ldots, ${n}$；去掉两端剩下 $${n} - 1 = ${n - 1}$ 个。`,
                ],
              ],
        ],
        askFirst
          ? [
              `At $x = ${first.toLatex()}$ the angle is $${piOver(n, L)} \\cdot ${first.toLatex()} = \\pi$, where the sine is zero, and no smaller positive $x$ gives a multiple of $\\pi$.`,
              `在 $x = ${first.toLatex()}$ 处角度是 $${piOver(n, L)} \\cdot ${first.toLatex()} = \\pi$，正弦为零，没有更小的正 $x$ 给出 $\\pi$ 的倍数。`,
            ]
          : [
              `The zeros cut $[0, ${L}]$ into ${n} equal pieces of length $${first.toLatex()}$, and ${n} pieces in a row share $${n - 1}$ inner endpoints.`,
              `零点把 $[0, ${L}]$ 分成 ${n} 段长为 $${first.toLatex()}$ 的等长小段，${n} 段相连共有 $${n - 1}$ 个内部端点。`,
            ],
      );
    }),
);

const parseval = point(
  "the-integral-of-a-squared-sum-of-modes",
  ["The integral of a squared sum of modes", "模态和平方的积分"],
  [
    "Sine modes on $[0, L]$ are orthogonal, and each has $\\int_0^L \\sin^2 \\frac{n \\pi x}{L} \\, dx = \\frac{L}{2}$. So when a sum of modes is squared and integrated, every cross term vanishes. What remains is $\\frac{L}{2}$ times the sum of the squared coefficients, which measures the size of the data. For example, $\\int_0^2 \\left( 3\\sin \\frac{\\pi x}{2} + 4\\sin \\frac{2 \\pi x}{2} \\right)^2 dx = (9 + 16) \\cdot \\frac{2}{2} = 25$.\n\nCheck: keeping the cross term would add $2 \\cdot 3 \\cdot 4 \\int_0^2 \\sin \\frac{\\pi x}{2} \\sin \\frac{2 \\pi x}{2} \\, dx = 24 \\cdot 0 = 0$, so nothing changes.\n\n> **Watch out.** Square the coefficients separately, $a^{2} + b^{2}$, not $(a + b)^{2}$; the $2ab$ term integrates to zero.",
    "$[0, L]$ 上的正弦模态相互正交，每个都有 $\\int_0^L \\sin^2 \\frac{n \\pi x}{L} \\, dx = \\frac{L}{2}$。所以模态和平方后积分，所有交叉项都消失。剩下的是 $\\frac{L}{2}$ 乘系数的平方和，它衡量数据的大小。例如，$\\int_0^2 \\left( 3\\sin \\frac{\\pi x}{2} + 4\\sin \\frac{2 \\pi x}{2} \\right)^2 dx = (9 + 16) \\cdot \\frac{2}{2} = 25$。\n\n检验：保留交叉项会加上 $2 \\cdot 3 \\cdot 4 \\int_0^2 \\sin \\frac{\\pi x}{2} \\sin \\frac{2 \\pi x}{2} \\, dx = 24 \\cdot 0 = 0$，所以结果不变。\n\n> **注意。** 系数要分别平方，$a^{2} + b^{2}$，而不是 $(a + b)^{2}$；$2ab$ 项积分为零。",
  ],
  (rng) =>
    until(() => {
      const [a, b] = [rng.int(1, 6), rng.int(1, 6)];
      const L = rng.int(1, 6);
      const [m, n] = rng.sample([1, 2, 3, 4, 5], 2).sort((x, y) => x - y) as [number, number];
      const answer = Q.of((a * a + b * b) * L, 2);
      const half = Q.of(L, 2);
      const mode = (k: number) => (L === 1 ? `\\sin ${k === 1 ? "" : k} \\pi x` : `\\sin \\frac{${k === 1 ? "" : k} \\pi x}{${L}}`);
      const top = L === 1 ? "1" : `{${L}}`;
      const misses: Miss[] = [
        [Q.of((a + b) * (a + b) * L, 2), "That keeps the cross term; distinct modes are orthogonal.", "那保留了交叉项；不同的模态正交。"],
        [Q.of(a * a + b * b, 2), "That forgets the length of the interval in $\\frac{L}{2}$.", "那忘了 $\\frac{L}{2}$ 中区间的长度。"],
        [
          Q.of((a * a + b * b) * L, 1),
          "That forgets the $\\frac{1}{2}$: each squared sine averages $\\frac{1}{2}$.",
          "那忘了 $\\frac{1}{2}$：每个正弦平方的平均是 $\\frac{1}{2}$。",
        ],
        [Q.of((a + b) * L, 2), "That forgets to square the coefficients.", "那忘了把系数平方。"],
      ];
      return worked(
        [
          `What is $\\int_0^${top} \\left( ${coef(a, mode(m))} + ${coef(b, mode(n))} \\right)^2 dx$?`,
          `$\\int_0^${top} \\left( ${coef(a, mode(m))} + ${coef(b, mode(n))} \\right)^2 dx$ 是多少？`,
        ],
        answer,
        misses,
        [
          [
            ["Drop the cross term", "去掉交叉项"],
            [
              `Modes ${m} and ${n} are orthogonal, so the term $${2 * a * b}${mode(m)}${mode(n)}$ integrates to $0$.`,
              `模态 ${m} 和 ${n} 正交，所以 $${2 * a * b}${mode(m)}${mode(n)}$ 项积分为 $0$。`,
            ],
          ],
          [
            ["Integrate the squares", "积分平方项"],
            [
              `Each squared mode integrates to $\\frac{L}{2} = ${half.toLatex()}$, so the integral is $(${a * a} + ${b * b}) \\cdot ${half.toLatex()} = ${answer.toLatex()}$.`,
              `每个模态的平方积分为 $\\frac{L}{2} = ${half.toLatex()}$，所以积分是 $(${a * a} + ${b * b}) \\cdot ${half.toLatex()} = ${answer.toLatex()}$。`,
            ],
          ],
        ],
        [
          `If the two modes were the same, the integral would be $(${a} + ${b})^{2} \\cdot ${half.toLatex()} = ${Q.of((a + b) * (a + b) * L, 2).toLatex()}$; orthogonality removes exactly $2 \\cdot ${a} \\cdot ${b} \\cdot ${half.toLatex()} = ${Q.of(a * b * L, 1).toLatex()}$.`,
          `若两个模态相同，积分会是 $(${a} + ${b})^{2} \\cdot ${half.toLatex()} = ${Q.of((a + b) * (a + b) * L, 2).toLatex()}$；正交性恰好去掉 $2 \\cdot ${a} \\cdot ${b} \\cdot ${half.toLatex()} = ${Q.of(a * b * L, 1).toLatex()}$。`,
        ],
      );
    }),
);

const insulatedAverage = point(
  "the-final-temperature-of-an-insulated-rod",
  ["The final temperature of an insulated rod", "绝热杆的最终温度"],
  [
    "With both ends of a rod insulated, no heat escapes, so the total heat stays constant in time. As the differences smooth out, the temperature tends to a constant value. That value must be the average of the initial temperature over the rod, weighted by the length of each part. For example, a rod of length $4$ with $1$ unit at $80$ and $3$ units at $40$ approaches $\\frac{80 \\cdot 1 + 40 \\cdot 3}{4} = 50$.\n\nCheck: the total heat is the same at the start and at the end, $80 + 120 = 200 = 50 \\cdot 4$.\n\n> **Watch out.** Weight each temperature by the length of its part; the plain average $\\frac{80 + 40}{2} = 60$ is right only when the parts are equal.",
    "杆的两端绝热时，热量不会散失，所以总热量不随时间变化。随着差异被抹平，温度趋于常数。这个值一定是初始温度在杆上的平均值，按每段的长度加权。例如，长度为 $4$ 的杆，$1$ 个单位长为 $80$，$3$ 个单位长为 $40$，趋于 $\\frac{80 \\cdot 1 + 40 \\cdot 3}{4} = 50$。\n\n检验：开始和最后的总热量相同，$80 + 120 = 200 = 50 \\cdot 4$。\n\n> **注意。** 每个温度要按它那段的长度加权；直接平均 $\\frac{80 + 40}{2} = 60$ 只在两段等长时才对。",
  ],
  (rng) =>
    until(() => {
      const L = rng.pick([2, 3, 4, 5, 6, 8, 10]);
      const cut = rng.int(1, L - 1);
      const [a, b] = [rng.int(10, 90), rng.int(10, 90)];
      if (a === b) return undefined;
      const heat = a * cut + b * (L - cut);
      const answer = Q.of(heat, L);
      const misses: Miss[] = [
        [Q.of(a + b, 2), "That takes the plain average; the parts have different lengths.", "那直接取平均；两段长度不同。"],
        [0, "No heat escapes through insulated ends, so the rod does not cool to $0$.", "绝热的端点不散热，所以杆不会冷却到 $0$。"],
        [Q.of(a * (L - cut) + b * cut, L), "That swaps the lengths of the two parts.", "那把两段的长度交换了。"],
        [Math.max(a, b), "That keeps the hotter temperature; the parts share their heat.", "那保留了较高的温度；两段会分享热量。"],
      ];
      return worked(
        [
          `An insulated rod of length ${L} starts with a part of length ${cut} at temperature ${a} and the rest at temperature ${b}. What temperature does it approach?`,
          `长度为 ${L} 的绝热杆，开始时长度为 ${cut} 的一段温度是 ${a}，其余部分是 ${b}。它趋于什么温度？`,
        ],
        answer,
        misses,
        [
          [
            ["Add up the heat", "求总热量"],
            [
              `The total is $${a} \\cdot ${cut} + ${b} \\cdot ${L - cut} = ${a * cut} + ${b * (L - cut)} = ${heat}$.`,
              `总量是 $${a} \\cdot ${cut} + ${b} \\cdot ${L - cut} = ${a * cut} + ${b * (L - cut)} = ${heat}$。`,
            ],
          ],
          [
            ["Spread it over the rod", "分摊到整根杆"],
            [`$${settle(heat, L, answer)}$.`, `$${settle(heat, L, answer)}$。`],
          ],
        ],
        [
          `The final heat is $${answer.toLatex()} \\cdot ${L} = ${heat}$, the same as at the start, and $${answer.toLatex()}$ lies between ${Math.min(a, b)} and ${Math.max(a, b)}.`,
          `最后的总热量是 $${answer.toLatex()} \\cdot ${L} = ${heat}$，与开始相同，而 $${answer.toLatex()}$ 介于 ${Math.min(a, b)} 和 ${Math.max(a, b)} 之间。`,
        ],
      );
    }),
);

const dAlembert = point(
  "dalemberts-formula-at-a-point",
  ["D'Alembert's formula at a point", "某点处的达朗贝尔公式"],
  [
    "On the whole line, with initial position $f$ and zero initial velocity, the wave equation has the solution $u(x, t) = \\frac{1}{2} \\left( f(x - c t) + f(x + c t) \\right)$. So the initial shape splits into two halves that travel in opposite directions, and the value at any point can be computed directly. For example, for $u_{tt} = 4u_{xx}$ with $f(x) = x^{2}$, the speed is $2$, so $u(1, 1) = \\frac{1}{2}\\left( f(-1) + f(3) \\right) = \\frac{1 + 9}{2} = 5$.\n\nCheck: for $f = x^{2}$ the formula simplifies to $u = x^{2} + c^{2}t^{2}$, and $1 + 4 \\cdot 1 = 5$.\n\n> **Watch out.** Use the points $x \\pm ct$, with the speed $c = \\sqrt{4} = 2$ rather than the coefficient $4$, and keep the factor $\\frac{1}{2}$.",
    "在整条直线上，初始位置为 $f$、初速度为零时，波动方程的解是 $u(x, t) = \\frac{1}{2} \\left( f(x - c t) + f(x + c t) \\right)$。所以初始形状分成两半，朝相反方向传播，任意一点的值都能直接算出。例如，对 $u_{tt} = 4u_{xx}$、$f(x) = x^{2}$，波速是 $2$，所以 $u(1, 1) = \\frac{1}{2}\\left( f(-1) + f(3) \\right) = \\frac{1 + 9}{2} = 5$。\n\n检验：对 $f = x^{2}$，公式化简为 $u = x^{2} + c^{2}t^{2}$，而 $1 + 4 \\cdot 1 = 5$。\n\n> **注意。** 要用点 $x \\pm ct$，其中速度是 $c = \\sqrt{4} = 2$，而不是系数 $4$；还要保留因子 $\\frac{1}{2}$。",
  ],
  (rng) =>
    until(() => {
      const [c, t, x] = [rng.int(2, 4), rng.int(1, 3), rng.int(-5, 5)];
      const m = rng.int(1, 3);
      const [left, right] = [x - c * t, x + c * t];
      const [fl, fr] = [m * left * left, m * right * right];
      const answer = Q.of(fl + fr, 2);
      const misses: Miss[] = [
        [m * x * x, "That is the initial value at $x$; the shape has moved by time $t$.", "那是 $x$ 处的初始值；到时间 $t$ 形状已经移动。"],
        [fl + fr, "That forgets the factor $\\frac{1}{2}$.", "那忘了因子 $\\frac{1}{2}$。"],
        [fr, "That follows only one of the two traveling halves.", "那只跟踪了两个传播的半波之一。"],
        [m * (x * x + t * t), "That uses $x \\pm t$; the points are $x \\pm ct$.", "那用了 $x \\pm t$；应该是 $x \\pm ct$。"],
        [
          m * (x * x + c ** 4 * t * t),
          `That uses $x \\pm ${c * c}t$, with the coefficient in place of the speed $${c}$.`,
          `那用了 $x \\pm ${c * c}t$，把系数当成速度 $${c}$。`,
        ],
      ];
      return worked(
        [
          `For $u_{tt} = ${c * c} u_{xx}$ on the line with $u(x, 0) = ${coef(m, "x^2")}$ and zero initial velocity, what is $u(${x}, ${t})$?`,
          `直线上的 $u_{tt} = ${c * c} u_{xx}$，$u(x, 0) = ${coef(m, "x^2")}$，初速度为零，$u(${x}, ${t})$ 是多少？`,
        ],
        answer,
        misses,
        [
          [
            ["Find the two points", "求两个点"],
            [
              `The speed is $c = \\sqrt{${c * c}} = ${c}$, so the points are $${x} - ${c * t} = ${left}$ and $${x} + ${c * t} = ${right}$.`,
              `波速是 $c = \\sqrt{${c * c}} = ${c}$，所以两个点是 $${x} - ${c * t} = ${left}$ 和 $${x} + ${c * t} = ${right}$。`,
            ],
          ],
          [
            ["Average the values", "取值的平均"],
            [
              `$f(${left}) = ${fl}$ and $f(${right}) = ${fr}$, so $u = \\frac{1}{2}(${fl} + ${fr}) = ${answer.toLatex()}$.`,
              `$f(${left}) = ${fl}$，$f(${right}) = ${fr}$，所以 $u = \\frac{1}{2}(${fl} + ${fr}) = ${answer.toLatex()}$。`,
            ],
          ],
        ],
        [
          `For $f = ${coef(m, "x^2")}$ the formula simplifies to $u = ${m === 1 ? "" : m}(x^{2} + c^{2}t^{2})$, and $${m === 1 ? "" : `${m} \\cdot `}(${x * x} + ${c * c} \\cdot ${t * t}) = ${answer.toLatex()}$.`,
          `对 $f = ${coef(m, "x^2")}$，公式化简为 $u = ${m === 1 ? "" : m}(x^{2} + c^{2}t^{2})$，而 $${m === 1 ? "" : `${m} \\cdot `}(${x * x} + ${c * c} \\cdot ${t * t}) = ${answer.toLatex()}$。`,
        ],
      );
    }),
);

const stringSpeed = point(
  "the-speed-from-tension-and-density",
  ["The speed from tension and density", "由张力和密度求波速"],
  [
    "For a string with tension $T$ and linear density $\\rho$, Newton's law gives the wave equation with $c^2 = \\frac{T}{\\rho}$. So tightening a string raises its speed and its pitch, and a heavier string lowers them. The units confirm this, as the ratio has the dimensions of a squared velocity. For example, a string with tension $50$ and density $2$ has $c^{2} = \\frac{50}{2} = 25$, so $c = 5$.\n\nCheck: $c^{2}\\rho = 25 \\cdot 2 = 50$, the tension.\n\n> **Watch out.** $\\frac{T}{\\rho}$ is the square of the speed; take its square root, and divide by the density rather than multiplying.",
    "对张力为 $T$、线密度为 $\\rho$ 的弦，牛顿定律给出波动方程，其中 $c^2 = \\frac{T}{\\rho}$。所以绷紧弦会提高波速和音高，而更重的弦会降低它们。量纲也证实了这一点，这个比值的量纲是速度的平方。例如，张力为 $50$、密度为 $2$ 的弦有 $c^{2} = \\frac{50}{2} = 25$，所以 $c = 5$。\n\n检验：$c^{2}\\rho = 25 \\cdot 2 = 50$，正是张力。\n\n> **注意。** $\\frac{T}{\\rho}$ 是速度的平方；要开平方，并且要除以密度而不是乘。",
  ],
  (rng) =>
    until(() => {
      const c = rng.int(2, 12);
      const rho = rng.pick([2, 3, 4, 5, 6, 8, 10]);
      const T = c * c * rho;
      const misses: Miss[] = [
        [c * c, "That is $c^{2}$; take the square root.", "那是 $c^{2}$；还要开平方。"],
        [T, "That leaves out the density.", "那漏掉了密度。"],
        [T * rho, "That multiplies by the density; divide by it.", "那乘了密度；应该除以它。"],
        [
          c * rho,
          "That takes the root of $T\\rho$; the speed comes from $\\frac{T}{\\rho}$.",
          "那对 $T\\rho$ 开平方；速度来自 $\\frac{T}{\\rho}$。",
        ],
      ];
      return worked(
        [
          `A string has tension ${T} and linear density ${rho}, in consistent units. What is its wave speed?`,
          `弦的张力是 ${T}，线密度是 ${rho}，单位一致。它的波速是多少？`,
        ],
        c,
        misses,
        [
          [
            ["Divide", "相除"],
            [`$c^2 = \\frac{${T}}{${rho}} = ${c * c}$.`, `$c^2 = \\frac{${T}}{${rho}} = ${c * c}$。`],
          ],
          [
            ["Take the root", "开平方"],
            [`$c = \\sqrt{${c * c}} = ${c}$.`, `$c = \\sqrt{${c * c}} = ${c}$。`],
          ],
        ],
        [`$c^{2}\\rho = ${c * c} \\cdot ${rho} = ${T}$, the tension.`, `$c^{2}\\rho = ${c * c} \\cdot ${rho} = ${T}$，正是张力。`],
      );
    }),
);

const meanValue = {
  ...point(
    "the-mean-value-property",
    ["The mean value property", "平均值性质"],
    [
      "A harmonic function equals the average of its values on any circle centered at a point, as long as the closed disc lies in its domain. So the average over a circle can be found with no integration, by evaluating at the center. The maximum principle follows from this property. For example, in the figure $u = 5 + x^{2} - y^{2}$ on the circle of radius $1$ about the origin takes the values $6$, $4$, $6$ and $4$ at the four marked points, and these average to $5$, the value at the center.\n\nCheck: $\\Delta u = 2 - 2 = 0$, so $u$ is harmonic, and $u(0, 0) = 5 + 0 - 0 = 5$.\n\n> **Watch out.** The average does not depend on the radius; do not add $r$ or $r^{2}$ to the value at the center.",
      "调和函数等于它在以某点为心的任何圆上的平均值，只要闭圆盘在定义域内。所以圆上的平均值不用积分，只需在圆心求值就能得到。最大值原理正是由这个性质得出的。例如，图中 $u = 5 + x^{2} - y^{2}$ 在以原点为心、半径为 $1$ 的圆上四个标出的点处取值 $6$、$4$、$6$、$4$，平均为 $5$，正是圆心的值。\n\n检验：$\\Delta u = 2 - 2 = 0$，所以 $u$ 调和，且 $u(0, 0) = 5 + 0 - 0 = 5$。\n\n> **注意。** 平均值与半径无关；不要在圆心的值上加 $r$ 或 $r^{2}$。",
    ],
    (rng) =>
      until(() => {
        const [a, b, c] = [rng.int(1, 5), rng.int(1, 5), rng.int(-9, 9)];
        const [p, q] = [rng.int(-4, 4), rng.int(-4, 4)];
        const r = rng.int(1, 9);
        const u = (x: number, y: number) => a * (x * x - y * y) + b * x * y + c;
        const answer = u(p, q);
        const tail = c === 0 ? "" : ` ${plus(c)}`;
        const f = `${coef(a, "(x^2 - y^2)")} + ${coef(b, "x y")}${tail}`;
        const four = [u(p + r, q), u(p - r, q), u(p, q + r), u(p, q - r)] as const;
        const misses: Miss[] = [
          [answer + r, "That adds the radius; the average does not depend on it.", "那加上了半径；平均值与半径无关。"],
          [answer + r * r, "That adds $r^{2}$; the average does not depend on the radius.", "那加上了 $r^{2}$；平均值与半径无关。"],
          [
            a * (p * p + q * q) + b * p * q + c,
            "That uses $x^{2} + y^{2}$ in place of $x^{2} - y^{2}$.",
            "那用 $x^{2} + y^{2}$ 代替了 $x^{2} - y^{2}$。",
          ],
          [c, "That is the value at the origin, not at the center of this circle.", "那是原点的值，不是这个圆的圆心的值。"],
        ];
        return worked(
          [
            `What is the average of the harmonic function $${f}$ on the circle of radius ${r} centered at $(${p}, ${q})$?`,
            `调和函数 $${f}$ 在以 $(${p}, ${q})$ 为心、半径为 ${r} 的圆上的平均值是多少？`,
          ],
          answer,
          misses,
          [
            [
              ["Use the mean value property", "利用平均值性质"],
              ["The average over the circle equals the value at its center.", "圆上的平均值等于圆心的值。"],
            ],
            [
              ["Evaluate at the center", "在圆心求值"],
              [
                `$${a === 1 ? "" : a}(${p * p} - ${q * q}) + ${b} \\cdot ${wrap(p)} \\cdot ${wrap(q)}${tail} = ${answer}$.`,
                `$${a === 1 ? "" : a}(${p * p} - ${q * q}) + ${b} \\cdot ${wrap(p)} \\cdot ${wrap(q)}${tail} = ${answer}$。`,
              ],
            ],
          ],
          [
            `At the four points $(${p} \\pm ${r}, ${q})$ and $(${p}, ${q} \\pm ${r})$ of the circle the values are $${four.join(", ")}$, and their average is $${settle(four[0] + four[1] + four[2] + four[3], 4, Q.of(answer))}$.`,
            `在圆上的四个点 $(${p} \\pm ${r}, ${q})$ 和 $(${p}, ${q} \\pm ${r})$ 处，值为 $${four.join(", ")}$，平均为 $${settle(four[0] + four[1] + four[2] + four[3], 4, Q.of(answer))}$。`,
          ],
        );
      }),
  ),
  figure: pdeDrawings1["laplaces-equation-in-a-rectangle-and-a-disc#the-mean-value-property"],
};

const radialPoisson = {
  ...point(
    "a-radial-solution-of-poissons-equation",
    ["A radial solution of Poisson's equation", "泊松方程的径向解"],
    [
      "On the disc of radius $R$, the problem $\\Delta u = -f$ with constant $f$ and $u = 0$ on the circle has the solution $u = \\frac{f}{4} (R^2 - r^2)$. Check it directly: $x^2 + y^2$ has laplacian 4. It describes a loaded membrane, deepest at the center and level with the rim at the boundary. For example, in the figure $f = 2$ and $R = 2$, so $u = \\frac{4 - r^{2}}{2}$, which is $2$ at the center and $\\frac{3}{2}$ at $r = 1$.\n\nCheck: $u = 2 - \\frac{x^{2} + y^{2}}{2}$ has $\\Delta u = -\\frac{4}{2} = -2$, and $u = 0$ at $r = 2$.\n\n> **Watch out.** In the plane the factor is $\\frac{f}{4}$, not $\\frac{f}{2}$ as on an interval, because $x^{2} + y^{2}$ has Laplacian $4$; and $r$ enters squared.",
      "在半径为 $R$ 的圆盘上，常数 $f$ 的问题 $\\Delta u = -f$，圆周上 $u = 0$，其解是 $u = \\frac{f}{4} (R^2 - r^2)$。可以直接验证：$x^2 + y^2$ 的拉普拉斯值是 4。它描述受载的薄膜，中心最深，边界与圆周齐平。例如，图中 $f = 2$，$R = 2$，所以 $u = \\frac{4 - r^{2}}{2}$，中心为 $2$，$r = 1$ 处为 $\\frac{3}{2}$。\n\n检验：$u = 2 - \\frac{x^{2} + y^{2}}{2}$ 满足 $\\Delta u = -\\frac{4}{2} = -2$，且 $r = 2$ 时 $u = 0$。\n\n> **注意。** 在平面上因子是 $\\frac{f}{4}$，而不是区间上的 $\\frac{f}{2}$，因为 $x^{2} + y^{2}$ 的拉普拉斯值是 $4$；而且 $r$ 要平方。",
    ],
    (rng) =>
      until(() => {
        const R = rng.int(2, 9);
        const r = rng.int(1, R - 1);
        const f = rng.int(1, 9);
        const quarter = Q.of(f, 4);
        const lead = quarter.eq(Q.one) ? "" : quarter.toLatex();
        const answer = Q.of(f * (R * R - r * r), 4);
        const misses: Miss[] = [
          [Q.of(f * R * R, 4), "That is the value at the center.", "那是圆心的值。"],
          [
            Q.of(f * (R * R - r * r), 2),
            "That uses $\\frac{f}{2}$, the factor on an interval; in the plane it is $\\frac{f}{4}$.",
            "那用了区间上的因子 $\\frac{f}{2}$；平面上是 $\\frac{f}{4}$。",
          ],
          [Q.of(f * (R - r), 4), "That forgets to square the radii.", "那忘了把半径平方。"],
          [Q.of(R * R - r * r, 4), "That leaves out the load $f$.", "那漏掉了载荷 $f$。"],
        ];
        return worked(
          [
            `On the disc of radius ${R}, $\\Delta u = -${f}$ with $u = 0$ on the circle. What is $u$ at distance ${r} from the center?`,
            `在半径为 ${R} 的圆盘上，$\\Delta u = -${f}$，圆周上 $u = 0$。距圆心 ${r} 处的 $u$ 是多少？`,
          ],
          answer,
          misses,
          [
            [
              ["Write the solution", "写出解"],
              [
                `$u = \\frac{f}{4}(R^{2} - r^{2}) = ${lead}(${R * R} - r^{2})$.`,
                `$u = \\frac{f}{4}(R^{2} - r^{2}) = ${lead}(${R * R} - r^{2})$。`,
              ],
            ],
            [
              ["Evaluate", "求值"],
              [
                `At $r = ${r}$, $u = ${quarter.toLatex()} \\cdot ${R * R - r * r} = ${answer.toLatex()}$.`,
                `在 $r = ${r}$ 处，$u = ${quarter.toLatex()} \\cdot ${R * R - r * r} = ${answer.toLatex()}$。`,
              ],
            ],
          ],
          [
            `$${lead}(${R * R} - x^{2} - y^{2})$ has $\\Delta u = -${quarter.toLatex()} \\cdot 4 = -${f}$, and at $r = ${R}$ it gives $${quarter.toLatex()} \\cdot 0 = 0$.`,
            `$${lead}(${R * R} - x^{2} - y^{2})$ 满足 $\\Delta u = -${quarter.toLatex()} \\cdot 4 = -${f}$，在 $r = ${R}$ 处给出 $${quarter.toLatex()} \\cdot 0 = 0$。`,
          ],
        );
      }),
  ),
  figure: pdeDrawings1["poissons-equation#a-radial-solution-of-poissons-equation"],
};

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
