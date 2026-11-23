// Third knowledge points for thin topics of Calculus I, from hyperbolic graphs to
// related rates: the reverse question, a harder case or a common trap. See
// `deeperCalculusIThirdPoints`.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { t } from "@ga/content";
import { dec, linear, paren, poly, Q, union } from "@ga/subject-math";
import { calculusDrawings1 } from "../explanation-drawings-calculus-1.ts";
import { calculusDrawings2 } from "../explanation-drawings-calculus-2.ts";

import { explainedChoice, functionProblem, intervalProblem, numberProblem, solutionsProblem, why } from "../problems.ts";
import { stepLabel } from "../solution-kit.ts";
import { ask, choose, type Pair, point } from "../university-kit.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";
import { infL, table } from "./calculus-common.ts";

/** nz picks a nonzero integer from -r to r. */
const nz = (rng: Rng, r: number) => rng.pick([...Array(2 * r + 1).keys()].map((i) => i - r).filter((i) => i !== 0));
/** minus writes x - a with the sign tidied: "x + 3" for a = -3 and "x" for a = 0. */
const minus = (a: number) => linear(1, -a);
/** tail writes a constant term after other terms: " + 3", " - 3", or nothing for 0. */
const tail = (m: number) => (m === 0 ? "" : m < 0 ? ` - ${-m}` : ` + ${m}`);
/** same2 writes one formula as a pair for both languages. */
const same2 = (latex: string): Pair => [`$${latex}$`, `$${latex}$`];

/** walk writes a solution as labelled steps, each a title and what it says in both languages, followed by a check that takes a second route. */
function walk(parts: readonly (readonly [en: string, zh: string, sayEn: string, sayZh: string])[], check: Pair): Pair {
  const write = (zh: boolean) =>
    `${parts.map(([en, z, se, sz], i) => `${stepLabel(i + 1, en, z)[zh ? "zh-CN" : "en"]} ${zh ? sz : se}`).join("\n\n")}\n\n${zh ? `**检验。** ${check[1]}` : `**Check.** ${check[0]}`}`;
  return [write(false), write(true)];
}

/** num writes a value rounded to three decimal places, without trailing zeros. */
const num = (v: number) => dec(Q.of(Math.round(v * 1000) || 0, 1000));

/** approx writes " ≈ 0.833" after a fraction that is not a whole number, and nothing after a whole number. */
const approx = (q: Q) => (q.isInteger() ? "" : ` \\approx ${num(q.toNumber())}`);

/** around gives a − 0.01, a − 0.001, a + 0.001 and a + 0.01, rounded to three decimal places. */
const around = (a: number) => [-0.01, -0.001, 0.001, 0.01].map((d) => Math.round((a + d) * 1000) / 1000);

/** valueTable tabulates functions at some x-values to three decimal places; each row is a name in LaTeX and a function, and labels name the x-values when they are not written as decimals. */
function valueTable(
  xs: readonly number[],
  rows: readonly (readonly [string, (x: number) => number])[],
  labels: readonly string[] = xs.map(String),
): string {
  return table(["$x$", ...labels.map((x) => `$${x}$`)], ...rows.map(([name, f]) => [`$${name}$`, ...xs.map((x) => `$${num(f(x))}$`)]));
}

/** hyperbolicCount counts the solutions of base(x) = v for cosh, sinh and tanh with integer v. */
const hyperbolicCount = (kind: "cosh" | "sinh" | "tanh", v: number) =>
  kind === "cosh" ? (v > 1 ? 2 : v === 1 ? 1 : 0) : kind === "sinh" ? 1 : Math.abs(v) < 1 ? 1 : 0;

/** reciprocalCount counts the solutions of base(x) = v for sech, csch and coth with integer v. */
const reciprocalCount = (kind: "sech" | "csch" | "coth", v: number) =>
  kind === "sech" ? (v === 1 ? 1 : 0) : kind === "csch" ? (v === 0 ? 0 : 1) : Math.abs(v) > 1 ? 1 : 0;

/** rootsCount tallies which roots of a factored rational function give vertical asymptotes. */
const rootsCount = (top: readonly number[], bottom: readonly number[]) => bottom.filter((m, i) => m > top[i]!).length;

/** factors writes a product of powers of (x - r), or 1 when every power is zero. */
const factors = (roots: readonly number[], powers: readonly number[]) => {
  const out = roots.map((r, i) => (powers[i] === 0 ? "" : `(${minus(r)})${powers[i] === 1 ? "" : `^{${powers[i]}}`}`)).join("");
  return out === "" ? "1" : out;
};

const levelLineOfHyperbolicGraph = {
  ...point(
    "how-many-times-a-level-line-meets-a-hyperbolic-graph",
    ["How many times a level line meets the graph", "水平直线与图像的交点个数"],
    [
      "The shape of the graph decides how many solutions an equation has. $\\cosh$ has a minimum value of $1$, so a level above it is met twice; $\\sinh$ takes every value exactly once; $\\tanh$ stays strictly between $-1$ and $1$. Undo the stretch and shift first, then compare with the range.\n\nFor example, $y = 2\\cosh(x - 1) + 3$ and the line $y = 9$ give $\\cosh(x - 1) = 3$. That is above $1$, so they meet twice.\n\nCheck: $x - 1 = \\pm\\operatorname{arcosh} 3 \\approx \\pm 1.763$, so $x \\approx -0.763$ and $x \\approx 2.763$.\n\n> **Watch out.** Undo the stretch and shift before comparing with the range. $\\cosh$ is even, so it takes each value above its minimum twice, but $\\sinh$ and $\\tanh$ take each value at most once.",
      "图像的形状决定方程有几个解。$\\cosh$ 的最小值是 $1$，所以高于它的水平线与图像交于两点；$\\sinh$ 每个值恰好取一次；$\\tanh$ 严格介于 $-1$ 和 $1$ 之间。先还原伸缩和平移，再与值域比较。\n\n例如 $y = 2\\cosh(x - 1) + 3$ 与直线 $y = 9$ 给出 $\\cosh(x - 1) = 3$。它大于 $1$，所以有两个交点。\n\n检验：$x - 1 = \\pm\\operatorname{arcosh} 3 \\approx \\pm 1.763$，所以 $x \\approx -0.763$ 和 $x \\approx 2.763$。\n\n> **注意。** 先还原伸缩和平移，再与值域比较。$\\cosh$ 是偶函数，大于最小值的每个值取两次；而 $\\sinh$ 和 $\\tanh$ 每个值至多取一次。",
    ],
    (rng) => {
      const kind = rng.pick(["cosh", "cosh", "sinh", "tanh", "tanh"] as const);
      const a = nz(rng, 4);
      const h = rng.int(-4, 4);
      const k = rng.int(-6, 6);
      const v = rng.int(-2, 3);
      const m = k + a * v;
      const answer = hyperbolicCount(kind, v);
      const y = poly([a, `\\${kind}(${minus(h)})`], [k, ""]);
      const u = minus(h);
      const range: Pair =
        kind === "cosh"
          ? [
              "$\\cosh$ takes values above $1$ twice, the value $1$ once and nothing below $1$",
              "$\\cosh$ 大于 $1$ 的值取两次，$1$ 取一次，小于 $1$ 的值取不到",
            ]
          : kind === "sinh"
            ? ["$\\sinh$ is increasing and takes every real value exactly once", "$\\sinh$ 递增，每个实数值恰好取一次"]
            : [
                "$\\tanh$ takes each value strictly between $-1$ and $1$ exactly once and no other value",
                "$\\tanh$ 严格介于 $-1$ 与 $1$ 之间的值各取一次，其他值取不到",
              ];
      const check: Pair =
        kind === "cosh"
          ? v > 1
            ? [
                `Solving directly, $${u} = \\pm\\operatorname{arcosh} ${v} \\approx \\pm ${num(Math.acosh(v))}$, so $x \\approx ${num(h - Math.acosh(v))}$ and $x \\approx ${num(h + Math.acosh(v))}$: two points.`,
                `直接求解，$${u} = \\pm\\operatorname{arcosh} ${v} \\approx \\pm ${num(Math.acosh(v))}$，所以 $x \\approx ${num(h - Math.acosh(v))}$ 和 $x \\approx ${num(h + Math.acosh(v))}$：两个点。`,
              ]
            : v === 1
              ? [
                  `$\\cosh(${u}) = 1$ only when $${u} = 0$, that is at $x = ${h}$: one point.`,
                  `只有 $${u} = 0$ 即 $x = ${h}$ 时 $\\cosh(${u}) = 1$：一个点。`,
                ]
              : [
                  `$\\operatorname{arcosh} ${paren(v)}$ does not exist, because $${v} < 1$: there is no point.`,
                  `因为 $${v} < 1$，$\\operatorname{arcosh} ${paren(v)}$ 不存在：没有交点。`,
                ]
          : kind === "sinh"
            ? [
                `Solving directly, $${u} = \\operatorname{arsinh} ${paren(v)} \\approx ${num(Math.asinh(v))}$, so $x \\approx ${num(h + Math.asinh(v))}$: one point.`,
                `直接求解，$${u} = \\operatorname{arsinh} ${paren(v)} \\approx ${num(Math.asinh(v))}$，所以 $x \\approx ${num(h + Math.asinh(v))}$：一个点。`,
              ]
            : v === 0
              ? [
                  `$${u} = \\operatorname{artanh} 0 = 0$, so $x = ${h}$: one point.`,
                  `$${u} = \\operatorname{artanh} 0 = 0$，所以 $x = ${h}$：一个点。`,
                ]
              : [
                  `$\\operatorname{artanh} ${paren(v)}$ does not exist, because $|${v}| \\ge 1$: there is no point.`,
                  `因为 $|${v}| \\ge 1$，$\\operatorname{artanh} ${paren(v)}$ 不存在：没有交点。`,
                ];
      const reason = (w: number): Pair => {
        if (kind === "cosh") {
          if (answer === 2)
            return w === 1
              ? [
                  `$\\cosh$ is even, so the value $${v}$ is taken at two points, one on each side of $x = ${h}$.`,
                  `$\\cosh$ 是偶函数，值 $${v}$ 在 $x = ${h}$ 两侧各取一次，共两个点。`,
                ]
              : [`$${v}$ is above the minimum $1$ of $\\cosh$, so it is reached.`, `$${v}$ 大于 $\\cosh$ 的最小值 $1$，所以能取到。`];
          if (answer === 1)
            return w === 2
              ? [
                  `$1$ is the minimum of $\\cosh$, reached only at the vertex $x = ${h}$.`,
                  `$1$ 是 $\\cosh$ 的最小值，只在顶点 $x = ${h}$ 处取到。`,
                ]
              : [`$\\cosh$ does reach $1$, at its vertex $x = ${h}$.`, `$\\cosh$ 能取到 $1$，就在顶点 $x = ${h}$ 处。`];
          return [`$\\cosh$ is never below $1$, and $${v} < 1$.`, `$\\cosh$ 从不小于 $1$，而 $${v} < 1$。`];
        }
        if (kind === "sinh")
          return w === 0
            ? [`$\\sinh$ takes every real value, $${v}$ included.`, `$\\sinh$ 取遍所有实数值，包括 $${v}$。`]
            : ["$\\sinh$ is increasing, so it cannot take a value twice.", "$\\sinh$ 递增，不可能两次取同一个值。"];
        if (answer === 1)
          return w === 0
            ? ["$0$ lies strictly between $-1$ and $1$, so $\\tanh$ takes it.", "$0$ 严格介于 $-1$ 与 $1$ 之间，所以 $\\tanh$ 能取到。"]
            : ["$\\tanh$ is increasing, so it cannot take a value twice.", "$\\tanh$ 递增，不可能两次取同一个值。"];
        return Math.abs(v) === 1
          ? [
              `$\\tanh$ only approaches $${v}$: the line $y = ${m}$ is an asymptote and is never reached.`,
              `$\\tanh$ 只是趋近 $${v}$：直线 $y = ${m}$ 是渐近线，取不到。`,
            ]
          : [
              `$\\tanh$ stays strictly between $-1$ and $1$, and $${v}$ is outside.`,
              `$\\tanh$ 严格介于 $-1$ 与 $1$ 之间，而 $${v}$ 在这个范围之外。`,
            ];
      };
      const [solutionEn, solutionZh] = walk(
        [
          [
            "Solve for the function",
            "解出函数值",
            `Undo the shift and the stretch: $\\${kind}(${u}) = \\frac{${m}${tail(-k)}}{${a}} = ${v}$.`,
            `还原平移和伸缩：$\\${kind}(${u}) = \\frac{${m}${tail(-k)}}{${a}} = ${v}$。`,
          ],
          [
            "Compare with the range",
            "与值域比较",
            `${range[0]}, so the number of common points is $${answer}$.`,
            `${range[1]}，所以公共点的个数是 $${answer}$。`,
          ],
        ],
        check,
      );
      return numberProblem({
        prompt: t(
          `How many points do the graph of $y = ${y}$ and the line $y = ${m}$ have in common?`,
          `$y = ${y}$ 的图像与直线 $y = ${m}$ 有多少个公共点？`,
        ),
        answer,
        mistakes: [0, 1, 2].filter((w) => w !== answer).map((w) => why(w, ...reason(w))),
        solution: t(solutionEn, solutionZh),
      });
    },
  ),
  figure: calculusDrawings1["graphs-of-the-hyperbolic-functions#how-many-times-a-level-line-meets-a-hyperbolic-graph"],
};

const levelLineOfReciprocalGraph = {
  ...point(
    "how-many-times-a-level-line-meets-a-reciprocal-hyperbolic-graph",
    ["How many times a level line meets a reciprocal graph", "水平直线与倒数双曲图像的交点个数"],
    [
      "The ranges tell the number of solutions. $\\operatorname{sech}$ takes values in $(0, 1]$, with the value $1$ only at its peak; $\\operatorname{csch}$ takes every value except $0$, each once; $\\coth$ takes each value with absolute value above $1$ once, and nothing between $-1$ and $1$.\n\nFor example, $y = 3\\coth(x + 2) - 1$ and the line $y = 2$ give $\\coth(x + 2) = 1$, a value $\\coth$ never takes, so they do not meet.\n\nCheck: $\\coth u = 1$ would need $\\tanh u = \\frac{1}{1} = 1$, and $\\tanh$ only approaches $1$.\n\n> **Watch out.** A value at the edge of the range may be an asymptote rather than a value: $\\coth$ never equals $\\pm 1$ and $\\operatorname{csch}$ never equals $0$, while $\\operatorname{sech}$ does reach $1$, at its peak.",
      "值域决定解的个数。$\\operatorname{sech}$ 的值域是 $(0, 1]$，$1$ 只在峰顶取到；$\\operatorname{csch}$ 取除 $0$ 以外的所有值，各取一次；$\\coth$ 绝对值大于 $1$ 的值各取一次，$-1$ 与 $1$ 之间的值取不到。\n\n例如 $y = 3\\coth(x + 2) - 1$ 与直线 $y = 2$ 给出 $\\coth(x + 2) = 1$，这是 $\\coth$ 取不到的值，所以没有交点。\n\n检验：$\\coth u = 1$ 需要 $\\tanh u = \\frac{1}{1} = 1$，而 $\\tanh$ 只是趋近 $1$。\n\n> **注意。** 值域边界上的值可能是渐近线而不是函数值：$\\coth$ 取不到 $\\pm 1$，$\\operatorname{csch}$ 取不到 $0$，而 $\\operatorname{sech}$ 在峰顶能取到 $1$。",
    ],
    (rng) => {
      const kind = rng.pick(["sech", "csch", "coth"] as const);
      const a = nz(rng, 4);
      const h = rng.int(-4, 4);
      const k = rng.int(-6, 6);
      const v = rng.int(-2, 2);
      const m = k + a * v;
      const answer = reciprocalCount(kind, v);
      const fn = kind === "coth" ? "\\coth" : `\\operatorname{${kind}}`;
      const y = poly([a, `${fn}(${minus(h)})`], [k, ""]);
      const u = minus(h);
      const range: Pair =
        kind === "sech"
          ? [
              "$\\operatorname{sech}$ takes values only in $(0, 1]$, and it reaches $1$ only at its peak",
              "$\\operatorname{sech}$ 的值只在 $(0, 1]$ 中，并且只在峰顶取到 $1$",
            ]
          : kind === "csch"
            ? [
                "$\\operatorname{csch}$ takes each nonzero value once and never takes $0$",
                "$\\operatorname{csch}$ 每个非零值取一次，取不到 $0$",
              ]
            : [
                "$\\coth$ takes each value with $|y| > 1$ once and misses the band $-1 \\le y \\le 1$",
                "$\\coth$ 满足 $|y| > 1$ 的值各取一次，取不到 $-1 \\le y \\le 1$ 这一带",
              ];
      const base = kind === "sech" ? "\\cosh" : kind === "csch" ? "\\sinh" : "\\tanh";
      const check: Pair =
        v === 0
          ? [
              `$${fn}(${u}) = 0$ would need $${base}(${u}) = \\frac{1}{0}$, which no number is: there is no point.`,
              `$${fn}(${u}) = 0$ 需要 $${base}(${u}) = \\frac{1}{0}$，这样的数不存在：没有交点。`,
            ]
          : kind === "sech"
            ? v === 1
              ? [
                  `$\\operatorname{sech}(${u}) = 1$ means $\\cosh(${u}) = 1$, which happens only at $x = ${h}$: one point.`,
                  `$\\operatorname{sech}(${u}) = 1$ 即 $\\cosh(${u}) = 1$，只在 $x = ${h}$ 处成立：一个点。`,
                ]
              : [
                  `$\\operatorname{sech}(${u}) = ${v}$ means $\\cosh(${u}) = \\frac{1}{${v}}$, which is below $1$, and $\\cosh$ never is: there is no point.`,
                  `$\\operatorname{sech}(${u}) = ${v}$ 即 $\\cosh(${u}) = \\frac{1}{${v}}$，它小于 $1$，而 $\\cosh$ 取不到：没有交点。`,
                ]
            : kind === "csch"
              ? [
                  `$\\operatorname{csch}(${u}) = ${v}$ means $\\sinh(${u}) = \\frac{1}{${v}}$, so $${u} = \\operatorname{arsinh}\\frac{1}{${v}} \\approx ${num(Math.asinh(1 / v))}$: one point.`,
                  `$\\operatorname{csch}(${u}) = ${v}$ 即 $\\sinh(${u}) = \\frac{1}{${v}}$，所以 $${u} = \\operatorname{arsinh}\\frac{1}{${v}} \\approx ${num(Math.asinh(1 / v))}$：一个点。`,
                ]
              : Math.abs(v) > 1
                ? [
                    `$\\coth(${u}) = ${v}$ means $\\tanh(${u}) = \\frac{1}{${v}}$, so $${u} = \\operatorname{artanh}\\frac{1}{${v}} \\approx ${num(Math.atanh(1 / v))}$: one point.`,
                    `$\\coth(${u}) = ${v}$ 即 $\\tanh(${u}) = \\frac{1}{${v}}$，所以 $${u} = \\operatorname{artanh}\\frac{1}{${v}} \\approx ${num(Math.atanh(1 / v))}$：一个点。`,
                  ]
                : [
                    `$\\coth(${u}) = ${v}$ would need $\\tanh(${u}) = ${v}$, which $\\tanh$ only approaches: there is no point.`,
                    `$\\coth(${u}) = ${v}$ 需要 $\\tanh(${u}) = ${v}$，而 $\\tanh$ 只是趋近它：没有交点。`,
                  ];
      const reason = (w: number): Pair => {
        if (kind === "sech") {
          if (answer === 1)
            return w === 2
              ? [
                  `$1$ is the peak of $\\operatorname{sech}$, reached only at $x = ${h}$.`,
                  `$1$ 是 $\\operatorname{sech}$ 的峰值，只在 $x = ${h}$ 处取到。`,
                ]
              : ["$\\operatorname{sech}$ does reach $1$, at its peak.", "$\\operatorname{sech}$ 在峰顶能取到 $1$。"];
          return v <= 0
            ? [`$\\operatorname{sech}$ is always positive, and $${v}$ is not.`, `$\\operatorname{sech}$ 恒为正，而 $${v}$ 不是正数。`]
            : [`$\\operatorname{sech}$ never exceeds $1$, and $${v} > 1$.`, `$\\operatorname{sech}$ 从不超过 $1$，而 $${v} > 1$。`];
        }
        if (kind === "csch") {
          if (answer === 0)
            return [
              `$\\operatorname{csch}$ never equals $0$: the line $y = ${m}$ is its asymptote.`,
              `$\\operatorname{csch}$ 取不到 $0$：直线 $y = ${m}$ 是它的渐近线。`,
            ];
          return w === 0
            ? [`$\\operatorname{csch}$ takes every nonzero value, $${v}$ included.`, `$\\operatorname{csch}$ 取遍所有非零值，包括 $${v}$。`]
            : [
                "$\\operatorname{csch}$ is positive on one side of its vertical asymptote and negative on the other, and decreasing on each side, so it takes each value once.",
                "$\\operatorname{csch}$ 在竖直渐近线一侧为正、另一侧为负，并且在每一侧都递减，所以每个值只取一次。",
              ];
        }
        if (answer === 1)
          return w === 0
            ? [`$\\coth$ takes every value with $|y| > 1$, $${v}$ included.`, `$\\coth$ 取遍所有满足 $|y| > 1$ 的值，包括 $${v}$。`]
            : [
                "$\\coth$ takes values above $1$ only on one side of its vertical asymptote and values below $-1$ only on the other, once each.",
                "$\\coth$ 大于 $1$ 的值只在竖直渐近线的一侧取到，小于 $-1$ 的值只在另一侧取到，各取一次。",
              ];
        return Math.abs(v) === 1
          ? [
              `$\\coth$ only approaches $${v}$: the line $y = ${m}$ is an asymptote and is never reached.`,
              `$\\coth$ 只是趋近 $${v}$：直线 $y = ${m}$ 是渐近线，取不到。`,
            ]
          : ["$\\coth$ never takes values between $-1$ and $1$.", "$\\coth$ 取不到 $-1$ 与 $1$ 之间的值。"];
      };
      const [solutionEn, solutionZh] = walk(
        [
          [
            "Solve for the function",
            "解出函数值",
            `Undo the shift and the stretch: $${fn}(${u}) = \\frac{${m}${tail(-k)}}{${a}} = ${v}$.`,
            `还原平移和伸缩：$${fn}(${u}) = \\frac{${m}${tail(-k)}}{${a}} = ${v}$。`,
          ],
          [
            "Compare with the range",
            "与值域比较",
            `${range[0]}, so the number of common points is $${answer}$.`,
            `${range[1]}，所以公共点的个数是 $${answer}$。`,
          ],
        ],
        check,
      );
      return numberProblem({
        prompt: t(
          `How many points do the graph of $y = ${y}$ and the line $y = ${m}$ have in common?`,
          `$y = ${y}$ 的图像与直线 $y = ${m}$ 有多少个公共点？`,
        ),
        answer,
        mistakes: [0, 1, 2].filter((w) => w !== answer).map((w) => why(w, ...reason(w))),
        solution: t(solutionEn, solutionZh),
      });
    },
  ),
  figure:
    calculusDrawings1["graphs-of-the-reciprocal-hyperbolic-functions#how-many-times-a-level-line-meets-a-reciprocal-hyperbolic-graph"],
};

const oneSidedAbsoluteValue = point(
  "one-sided-limits-of-an-absolute-value-quotient",
  ["One-sided limits of an absolute value quotient", "绝对值商的单侧极限"],
  [
    "The quotient $\\frac{|x - a|}{x - a}$ is $1$ to the right of $a$ and $-1$ to the left, however close $x$ comes to $a$. So each one-sided limit is found by replacing the quotient with its constant value on that side.\n\nFor example, $\\lim_{x \\to 2^{+}} \\left(3 + 4\\frac{|x - 2|}{x - 2}\\right) = 3 + 4 = 7$, while from the left the limit is $3 - 4 = -1$.\n\nCheck: at $x = 2.1$ the quotient is $\\frac{0.1}{0.1} = 1$, and at $x = 1.9$ it is $\\frac{0.1}{-0.1} = -1$.\n\n> **Watch out.** The quotient has no value at $x = a$, and its two sides differ, so only one-sided limits exist. Use the sign of the side the limit comes from.",
    "商 $\\frac{|x - a|}{x - a}$ 在 $a$ 的右侧等于 $1$，在左侧等于 $-1$，无论 $x$ 多么接近 $a$。所以每个单侧极限都可以把这个商换成它在那一侧的常数值来求。\n\n例如 $\\lim_{x \\to 2^{+}} \\left(3 + 4\\frac{|x - 2|}{x - 2}\\right) = 3 + 4 = 7$，而左极限是 $3 - 4 = -1$。\n\n检验：$x = 2.1$ 时这个商是 $\\frac{0.1}{0.1} = 1$，$x = 1.9$ 时是 $\\frac{0.1}{-0.1} = -1$。\n\n> **注意。** 这个商在 $x = a$ 处没有定义，两侧的值也不同，所以只有单侧极限。要用极限所来自那一侧的符号。",
  ],
  (rng) => {
    const a = rng.int(-6, 6);
    const b = nz(rng, 9);
    const c = nz(rng, 9);
    const right = rng.bool();
    const answer = c + (right ? b : -b);
    const q = `\\frac{|${minus(a)}|}{${minus(a)}}`;
    const expression = poly([c, ""], [b, q]);
    const xs = [0.1, 0.01, 0.001].map((d) => Math.round((a + (right ? d : -d)) * 1000) / 1000);
    const table = valueTable(xs, [["f(x)", (x) => c + (b * Math.abs(x - a)) / (x - a)]]);
    return ask(
      [
        `Find $\\lim_{x \\to ${a}^{${right ? "+" : "-"}}} \\left(${expression}\\right)$.`,
        `求 $\\lim_{x \\to ${a}^{${right ? "+" : "-"}}} \\left(${expression}\\right)$。`,
      ],
      answer,
      [c + (right ? -b : b), b, c],
      walk(
        [
          [
            "Find the sign on that side",
            "确定那一侧的符号",
            right
              ? `To the right of $${a}$, $${minus(a)} > 0$, so $|${minus(a)}| = ${minus(a)}$ and the quotient is $1$.`
              : `To the left of $${a}$, $${minus(a)} < 0$, so $|${minus(a)}| = -(${minus(a)})$ and the quotient is $-1$.`,
            right
              ? `在 $${a}$ 的右侧 $${minus(a)} > 0$，所以 $|${minus(a)}| = ${minus(a)}$，这个商是 $1$。`
              : `在 $${a}$ 的左侧 $${minus(a)} < 0$，所以 $|${minus(a)}| = -(${minus(a)})$，这个商是 $-1$。`,
          ],
          [
            "Replace the quotient",
            "替换这个商",
            `There the expression is the constant $${poly([c, ""], [right ? b : -b, ""])} = ${answer}$, so the limit is $${answer}$.`,
            `此时表达式就是常数 $${poly([c, ""], [right ? b : -b, ""])} = ${answer}$，所以极限是 $${answer}$。`,
          ],
        ],
        [
          `Write $f(x)$ for the expression and evaluate it closer and closer to $x = ${a}$ from the ${right ? "right" : "left"}:\n\n${table}\n\nEvery value is exactly $${answer}$. From the other side the quotient would be $${right ? -1 : 1}$, and the values would be $${c + (right ? -b : b)}$ instead.`,
          `从${right ? "右" : "左"}侧越来越接近 $x = ${a}$，计算表达式 $f(x)$ 的值：\n\n${table}\n\n每个值都恰好是 $${answer}$。从另一侧，这个商是 $${right ? -1 : 1}$，值会变成 $${c + (right ? -b : b)}$。`,
        ],
      ),
    );
  },
);

const limitAcrossTwoFormulas = point(
  "a-limit-across-two-formulas-and-a-stray-value",
  ["A limit across two formulas and a stray value", "跨两个表达式且有孤立函数值的极限"],
  [
    "Two different formulas on the two sides do not stop a limit from existing, and a separate value at the point does not matter either. Only the one-sided limits count: the limit exists exactly when they agree.\n\nFor $f(x) = 2x + 1$ when $x < 1$, $f(1) = 7$ and $f(x) = 4x - 1$ when $x > 1$, both one-sided limits are $3$, so the limit is $3$ although $f(1) = 7$.\n\nCheck: $f(0.99) = 2.98$ and $f(1.01) = 3.04$, both close to $3$.\n\n> **Watch out.** Neither the change of formula nor the stray value decides the question. Compare the two one-sided limits and nothing else.",
    "两侧用不同的表达式并不妨碍极限存在，该点处单独规定的函数值也没有影响。只有单侧极限才起作用：两者相等时极限存在，否则不存在。\n\n对于 $x < 1$ 时 $f(x) = 2x + 1$、$f(1) = 7$、$x > 1$ 时 $f(x) = 4x - 1$，两个单侧极限都是 $3$，所以极限是 $3$，尽管 $f(1) = 7$。\n\n检验：$f(0.99) = 2.98$，$f(1.01) = 3.04$，都接近 $3$。\n\n> **注意。** 换表达式和孤立的函数值都不能决定极限是否存在。只比较两个单侧极限。",
  ],
  (rng) => {
    const a = rng.int(-4, 4);
    const p = nz(rng, 5);
    const q = rng.int(-6, 6);
    const r = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].filter((x) => x !== p));
    const L = p * a + q;
    const holds = rng.bool();
    const R = holds ? L : L + nz(rng, 4);
    const s = R - r * a;
    const v = L + rng.pick([-3, -2, 2, 3]);
    const f = `\\begin{cases} ${linear(p, q)} & x < ${a} \\\\ ${v} & x = ${a} \\\\ ${linear(r, s)} & x > ${a} \\end{cases}`;
    const table = valueTable(around(a), [["f(x)", (x) => (x < a ? p * x + q : r * x + s)]]);
    const gap = (zh: string) => (zh.startsWith("$") ? " " : "");
    const yes = (en: string, zh: string) => t(`Yes, because ${en}`, `是，因为${gap(zh)}${zh}`);
    const no = (en: string, zh: string) => t(`No, because ${en}`, `否，因为${gap(zh)}${zh}`);
    const agree = yes(`the left and right limits are both $${L}$`, `左极限和右极限都是 $${L}$`);
    const differ = no(`the left limit is $${L}$ and the right limit is $${R}$`, `左极限是 $${L}$，右极限是 $${R}$`);
    const stray = no(`$f(${a}) = ${v}$ differs from the values $f$ approaches`, `$f(${a}) = ${v}$ 与 $f$ 趋近的值不同`);
    return explainedChoice(rng, {
      prompt: t(`Let $f(x) = ${f}$. Does $\\lim_{x \\to ${a}} f(x)$ exist?`, `设 $f(x) = ${f}$。$\\lim_{x \\to ${a}} f(x)$ 存在吗？`),
      correct: holds ? agree : differ,
      wrong: [
        holds
          ? {
              option: stray,
              why: t(
                `The value $f(${a})$ plays no part in a limit. Only the one-sided limits count, and both are $${L}$.`,
                `函数值 $f(${a})$ 与极限无关。只有单侧极限起作用，而两者都是 $${L}$。`,
              ),
            }
          : {
              option: agree,
              why: t(
                `Only the left limit is $${L}$; the right limit is $${R}$, so the two sides do not agree.`,
                `只有左极限是 $${L}$；右极限是 $${R}$，两侧不一致。`,
              ),
            },
        {
          option: yes(`$f(${a})$ is defined and equals $${v}$`, `$f(${a})$ 有定义，等于 $${v}$`),
          why: holds
            ? t(
                `The verdict is right, but a value at the point never decides a limit; the limit exists because both sides give $${L}$.`,
                `结论对了，但该点的函数值从不决定极限；极限存在，是因为两侧都给出 $${L}$。`,
              )
            : t(
                `A value at the point never decides a limit, and here the one-sided limits $${L}$ and $${R}$ differ.`,
                `该点的函数值从不决定极限，而这里单侧极限 $${L}$ 和 $${R}$ 不相等。`,
              ),
        },
        {
          option: no(`$f$ is given by different formulas on the two sides`, `$f$ 在两侧由不同的表达式给出`),
          why: holds
            ? t(
                `Different formulas do not stop a limit from existing; here both give $${L}$ at $x = ${a}$.`,
                `不同的表达式并不妨碍极限存在；这里两者在 $x = ${a}$ 处都给出 $${L}$。`,
              )
            : t(
                `The verdict is right, but different formulas alone do not settle it; what settles it is that the one-sided limits differ.`,
                `结论对了，但仅凭表达式不同不能下结论；真正的原因是单侧极限不相等。`,
              ),
        },
      ],
      solution: t(
        ...walk(
          [
            [
              "Find the left limit",
              "求左极限",
              `For $x < ${a}$, $f(x) = ${linear(p, q)}$. Substituting $x = ${a}$ gives the left limit $${L}$.`,
              `当 $x < ${a}$ 时，$f(x) = ${linear(p, q)}$。代入 $x = ${a}$，得左极限 $${L}$。`,
            ],
            [
              "Find the right limit",
              "求右极限",
              `For $x > ${a}$, $f(x) = ${linear(r, s)}$. Substituting $x = ${a}$ gives the right limit $${R}$.`,
              `当 $x > ${a}$ 时，$f(x) = ${linear(r, s)}$。代入 $x = ${a}$，得右极限 $${R}$。`,
            ],
            [
              "Compare",
              "比较",
              holds
                ? `They agree, so the limit is $${L}$. The stray value $f(${a}) = ${v}$ plays no part.`
                : `They differ, so the limit does not exist, whatever the value $f(${a})$ is.`,
              holds
                ? `两者相等，所以极限是 $${L}$。孤立的函数值 $f(${a}) = ${v}$ 不起作用。`
                : `两者不相等，所以极限不存在，与 $f(${a})$ 的值无关。`,
            ],
          ],
          [
            `Evaluate $f$ on both sides of $x = ${a}$:\n\n${table}\n\n${holds ? `Both sides close in on $${L}$, not on $${v}$.` : `The left values close in on $${L}$ and the right values on $${R}$, so no single number is approached.`}`,
            `计算 $f$ 在 $x = ${a}$ 两侧的值：\n\n${table}\n\n${holds ? `两侧都逼近 $${L}$，而不是 $${v}$。` : `左侧的值逼近 $${L}$，右侧的值逼近 $${R}$，没有一个数能从两侧同时趋近。`}`,
          ],
        ),
      ),
    });
  },
);

const crossingAnAsymptote = {
  ...point(
    "a-graph-may-cross-its-horizontal-asymptote",
    ["A graph may cross its horizontal asymptote", "图像可以穿过水平渐近线"],
    [
      "A horizontal asymptote only describes what happens far out: the values must get close to the line and stay close. The graph may cross the line, even infinitely often, as long as the swings around it shrink to zero.\n\nFor example, $f(x) = 2 + \\frac{\\sin x}{x}$ crosses $y = 2$ at $x = \\pi, 2\\pi, 3\\pi, \\ldots$, yet $f(x) \\to 2$ as $x \\to \\infty$, because the swings are at most $\\frac{1}{x}$.\n\nCheck: $f(10) \\approx 1.946$ and $f(100) \\approx 1.995$, closer and closer to $2$.\n\n> **Watch out.** An asymptote is not a line the graph never touches. What matters is only that the distance to the line shrinks to zero.",
      "水平渐近线只描述远处的情况：函数值必须接近这条直线并保持接近。图像可以穿过这条直线，甚至穿过无穷多次，只要围绕它的摆动趋于零。\n\n例如 $f(x) = 2 + \\frac{\\sin x}{x}$ 在 $x = \\pi, 2\\pi, 3\\pi, \\ldots$ 处穿过 $y = 2$，但当 $x \\to \\infty$ 时 $f(x) \\to 2$，因为摆动不超过 $\\frac{1}{x}$。\n\n检验：$f(10) \\approx 1.946$，$f(100) \\approx 1.995$，越来越接近 $2$。\n\n> **注意。** 渐近线并不是图像永远碰不到的直线。重要的只是到这条直线的距离趋于零。",
    ],
    (rng) => {
      const L = rng.int(-9, 9);
      const c = nz(rng, 7);
      const f = poly([L, ""], [c, "\\frac{\\sin x}{x}"]);
      const term = poly([c, "\\frac{\\sin x}{x}"]);
      const bound = `\\frac{${Math.abs(c)}}{x}`;
      const crossing: Pair = [`It does not exist, because the graph keeps crossing $y = ${L}$`, `不存在，因为图像不断穿过 $y = ${L}$`];
      const one: Pair = [`$${L + c}$, because $\\frac{\\sin x}{x}$ tends to $1$`, `$${L + c}$，因为 $\\frac{\\sin x}{x}$ 趋于 $1$`];
      const sine: Pair = ["It does not exist, because $\\sin x$ has no limit", "不存在，因为 $\\sin x$ 没有极限"];
      const table = valueTable([10, 100, 1000], [["f(x)", (x) => L + (c * Math.sin(x)) / x]]);
      return reasoned(
        choose(
          rng,
          [
            `The graph of $f(x) = ${f}$ crosses the line $y = ${L}$ at every multiple of $\\pi$. What is $\\lim_{x \\to \\infty} f(x)$?`,
            `$f(x) = ${f}$ 的图像在 $\\pi$ 的每个倍数处都穿过直线 $y = ${L}$。$\\lim_{x \\to \\infty} f(x)$ 是多少？`,
          ],
          [`$${L}$, because the swings around $y = ${L}$ shrink to zero`, `$${L}$，因为围绕 $y = ${L}$ 的摆动趋于零`],
          [crossing, one, sine],
          walk(
            [
              [
                "Bound the swing",
                "估计摆动",
                `Since $|\\sin x| \\le 1$, for $x > 0$ the term $${term}$ has size at most $${bound}$.`,
                `因为 $|\\sin x| \\le 1$，当 $x > 0$ 时，项 $${term}$ 的绝对值不超过 $${bound}$。`,
              ],
              [
                "Let $x$ grow",
                "让 $x$ 增大",
                `As $x \\to \\infty$, $${bound} \\to 0$, so the term tends to $0$ and the limit is $${L}$. The graph crosses $y = ${L}$ again and again, yet $y = ${L}$ is a horizontal asymptote.`,
                `当 $x \\to \\infty$ 时 $${bound} \\to 0$，所以这一项趋于 $0$，极限是 $${L}$。图像一次又一次穿过 $y = ${L}$，但 $y = ${L}$ 仍是水平渐近线。`,
              ],
            ],
            [
              `Evaluate $f$ farther and farther out:\n\n${table}\n\nThe values may fall on either side of $${L}$, but each lies within $${bound}$ of it, and that bound shrinks to $0$.`,
              `在越来越远处计算 $f$ 的值：\n\n${table}\n\n这些值可能落在 $${L}$ 的任一侧，但都与它相差不超过 $${bound}$，而这个界趋于 $0$。`,
            ],
          ),
        ),
        [
          [
            crossing[0],
            `Crossing is allowed. The distance from $y = ${L}$ is at most $${bound}$, which shrinks to $0$, so the limit exists.`,
            `穿过是允许的。到 $y = ${L}$ 的距离不超过 $${bound}$，它趋于 $0$，所以极限存在。`,
          ],
          [
            one[0],
            "$\\frac{\\sin x}{x}$ tends to $1$ as $x \\to 0$, not as $x \\to \\infty$; far out it tends to $0$.",
            "$\\frac{\\sin x}{x}$ 是在 $x \\to 0$ 时趋于 $1$，而不是 $x \\to \\infty$ 时；在远处它趋于 $0$。",
          ],
          [
            sine[0],
            "$\\sin x$ alone has no limit, but here it is divided by $x$, which grows; a bounded factor over $x$ tends to $0$.",
            "单独的 $\\sin x$ 没有极限，但这里它除以不断增大的 $x$；有界的量除以 $x$ 趋于 $0$。",
          ],
        ],
      );
    },
  ),
  figure: calculusDrawings1["limits-at-infinity-from-graphs#a-graph-may-cross-its-horizontal-asymptote"],
};

const formulaFromInfiniteLimits = {
  ...point(
    "the-formula-from-the-behavior-at-an-asymptote",
    ["The formula from the behavior at an asymptote", "由渐近线处的行为确定表达式"],
    [
      "Near $x = a$, an odd power of $x - a$ in the denominator changes sign across $a$, so the two sides go to opposite infinities; an even power keeps its sign, so both sides go the same way. The sign of the numerator then decides which way.\n\nFor example, $\\frac{1}{x - 2}$ goes to $-\\infty$ from the left and $\\infty$ from the right, while $\\frac{-3}{(x - 2)^{2}}$ goes to $-\\infty$ from both sides.\n\nCheck: $\\frac{1}{1.99 - 2} = -100$ and $\\frac{1}{2.01 - 2} = 100$; $\\frac{-3}{(0.01)^{2}} = -30000$ on both sides.\n\n> **Watch out.** Changing the sign of the numerator flips both sides at once. It cannot turn opposite infinities into the same one; only the power can.",
      "在 $x = a$ 附近，分母中 $x - a$ 的奇次幂在 $a$ 两侧变号，所以两侧趋于相反的无穷；偶次幂不变号，所以两侧趋于同一方向。分子的符号再决定具体方向。\n\n例如 $\\frac{1}{x - 2}$ 从左侧趋于 $-\\infty$，从右侧趋于 $\\infty$；而 $\\frac{-3}{(x - 2)^{2}}$ 从两侧都趋于 $-\\infty$。\n\n检验：$\\frac{1}{1.99 - 2} = -100$，$\\frac{1}{2.01 - 2} = 100$；$\\frac{-3}{(0.01)^{2}} = -30000$，两侧相同。\n\n> **注意。** 改变分子的符号会同时翻转两侧，不能把相反的无穷变成同一个；只有幂次能做到。",
    ],
    (rng) => {
      const a = nz(rng, 6);
      const c = rng.int(1, 9);
      const even = rng.bool();
      const sign = rng.pick([1, -1]);
      const form = (s: number, e: boolean) => `\\frac{${s * c}}{${e ? `(${minus(a)})^{2}` : minus(a)}}`;
      const left = even ? sign : -sign;
      const option = (s: number, e: boolean) => same2(`f(x) = ${form(s, e)}`);
      const wrong = [
        [-sign, even],
        [sign, !even],
        [-sign, !even],
      ] as const;
      const table = valueTable(
        [a - 0.1, a - 0.01, a + 0.01, a + 0.1].map((x) => Math.round(x * 1000) / 1000),
        [["f(x)", (x) => (sign * c) / (even ? (x - a) ** 2 : x - a)]],
      );
      const word = (s: number) => (s > 0 ? ["positive", "正"] : ["negative", "负"]);
      return reasoned(
        choose(
          rng,
          [
            `Which function has $\\lim_{x \\to ${a}^{-}} f(x) = ${infL(left)}$ and $\\lim_{x \\to ${a}^{+}} f(x) = ${infL(sign)}$?`,
            `哪个函数满足 $\\lim_{x \\to ${a}^{-}} f(x) = ${infL(left)}$ 且 $\\lim_{x \\to ${a}^{+}} f(x) = ${infL(sign)}$？`,
          ],
          option(sign, even),
          wrong.map(([s, e]) => option(s, e)),
          walk(
            [
              [
                "Read the power",
                "判断幂次",
                even
                  ? `Both sides go to the same infinity, so the power of $${minus(a)}$ is even.`
                  : `The sides go to opposite infinities, so the power of $${minus(a)}$ is odd.`,
                even ? `两侧趋于同一个无穷，所以 $${minus(a)}$ 的幂次是偶数。` : `两侧趋于相反的无穷，所以 $${minus(a)}$ 的幂次是奇数。`,
              ],
              [
                "Read the sign",
                "判断符号",
                `To the right of $${a}$ the denominator is positive, so the numerator has the sign of the right limit $${infL(sign)}$. So $f(x) = ${form(sign, even)}$.`,
                `在 $${a}$ 的右侧分母为正，所以分子与右极限 $${infL(sign)}$ 同号。所以 $f(x) = ${form(sign, even)}$。`,
              ],
            ],
            [
              `Evaluate $f(x) = ${form(sign, even)}$ on both sides of $x = ${a}$:\n\n${table}\n\nThe left values are large and ${word(left)[0]}, and the right values large and ${word(sign)[0]}, as required.`,
              `计算 $f(x) = ${form(sign, even)}$ 在 $x = ${a}$ 两侧的值：\n\n${table}\n\n左侧的值很大且为${word(left)[1]}，右侧的值很大且为${word(sign)[1]}，符合要求。`,
            ],
          ),
        ),
        wrong.map(([s, e]): Reason => {
          const l = e ? s : -s;
          const miss =
            l !== left && s !== sign
              ? ["neither side matches", "两侧都不符合"]
              : l !== left
                ? ["the left side does not match", "左侧不符合"]
                : ["the right side does not match", "右侧不符合"];
          return [
            option(s, e)[0],
            `This function goes to $${infL(l)}$ from the left and $${infL(s)}$ from the right, so ${miss[0]}.`,
            `这个函数从左侧趋于 $${infL(l)}$，从右侧趋于 $${infL(s)}$，所以${miss[1]}。`,
          ];
        }),
      );
    },
  ),
  figure: calculusDrawings1["infinite-limits-from-graphs#the-formula-from-the-behavior-at-an-asymptote"],
};

const coefficientFromPowerLimit = point(
  "the-coefficient-from-the-value-of-a-limit",
  ["The coefficient from the value of a limit", "由极限值求系数"],
  [
    "A limit of a power function is found by substitution, so a known limit gives an equation for an unknown coefficient: if $\\lim_{x \\to a} cx^{n} = L$, then $ca^{n} = L$ and $c = \\frac{L}{a^{n}}$.\n\nFor example, if $\\lim_{x \\to 2} cx^{3} = 24$, then $8c = 24$ and $c = 3$.\n\nCheck: $3 \\cdot 2.01^{3} \\approx 24.36$ and $3 \\cdot 1.99^{3} \\approx 23.64$, both close to $24$.\n\n> **Watch out.** Divide by $a^{n}$, not by $a$ or by $n$, and keep the sign: a negative $a$ raised to an odd power is negative.",
    "幂函数的极限可以代入求得，所以已知极限就得到未知系数的方程：若 $\\lim_{x \\to a} cx^{n} = L$，则 $ca^{n} = L$，$c = \\frac{L}{a^{n}}$。\n\n例如，若 $\\lim_{x \\to 2} cx^{3} = 24$，则 $8c = 24$，$c = 3$。\n\n检验：$3 \\cdot 2.01^{3} \\approx 24.36$，$3 \\cdot 1.99^{3} \\approx 23.64$，都接近 $24$。\n\n> **注意。** 要除以 $a^{n}$，而不是 $a$ 或 $n$，并注意符号：负数 $a$ 的奇次幂是负的。",
  ],
  (rng) => {
    const a = rng.pick([-3, -2, 2, 3]);
    const n = rng.int(2, 4);
    const c = Q.of(nz(rng, 9), rng.pick([1, 1, 2]));
    const L = c.mul(Q.of(a ** n));
    const value = c.toNumber();
    const table = valueTable(around(a), [[`${c.toLatex()} \\cdot x^{${n}}`, (x) => value * x ** n]]);
    return ask(
      [
        `The constant $c$ satisfies $\\lim_{x \\to ${a}} cx^{${n}} = ${L.toLatex()}$. Find $c$.`,
        `常数 $c$ 满足 $\\lim_{x \\to ${a}} cx^{${n}} = ${L.toLatex()}$。求 $c$。`,
      ],
      c,
      [L.mul(Q.of(a ** n)), L.div(Q.of(a)), L.div(Q.of(Math.abs(a) ** n))],
      walk(
        [
          [
            "Substitute",
            "代入",
            `A power function is continuous, so the limit is its value at $x = ${a}$:\n\n$$c \\cdot ${paren(a)}^{${n}} = ${a ** n}c = ${L.toLatex()}$$`,
            `幂函数连续，所以极限就是它在 $x = ${a}$ 处的值：\n\n$$c \\cdot ${paren(a)}^{${n}} = ${a ** n}c = ${L.toLatex()}$$`,
          ],
          [
            "Divide",
            "相除",
            `Dividing both sides by $${a ** n}$:\n\n$$c = \\frac{${L.toLatex()}}{${a ** n}} = ${c.toLatex()}$$`,
            `两边同除以 $${a ** n}$：\n\n$$c = \\frac{${L.toLatex()}}{${a ** n}} = ${c.toLatex()}$$`,
          ],
        ],
        [
          `Put $c = ${c.toLatex()}$ back and evaluate near $x = ${a}$:\n\n${table}\n\nThe values close in on $${L.toLatex()}${approx(L)}$, the given limit.`,
          `代回 $c = ${c.toLatex()}$，在 $x = ${a}$ 附近计算：\n\n${table}\n\n函数值逼近已知的极限 $${L.toLatex()}${approx(L)}$。`,
        ],
      ),
    );
  },
);

const twoSidedReciprocal = {
  ...point(
    "two-sided-limits-at-an-asymptote",
    ["Two-sided limits at an asymptote", "渐近线处的双侧极限"],
    [
      "A two-sided infinite limit needs both sides to go the same way. With an even power of $x - a$ in the denominator they do; with an odd power the sides go to opposite infinities, and the two-sided limit does not exist even as an infinite limit.\n\nFor example, $\\lim_{x \\to 1} \\frac{1}{(x - 1)^{2}} = \\infty$, while $\\lim_{x \\to 1} \\frac{1}{x - 1}$ does not exist.\n\nCheck: $\\frac{1}{(x - 1)^{2}}$ is $10000$ at both $x = 0.99$ and $x = 1.01$, while $\\frac{1}{x - 1}$ is $-100$ and $100$ there.\n\n> **Watch out.** A constant added to the fraction changes nothing near the asymptote, and a large value on one side does not make a two-sided limit.",
      "双侧无穷极限要求两侧趋于同一方向。分母中 $x - a$ 是偶次幂时确实如此；是奇次幂时两侧趋于相反的无穷，即使作为无穷极限，双侧极限也不存在。\n\n例如 $\\lim_{x \\to 1} \\frac{1}{(x - 1)^{2}} = \\infty$，而 $\\lim_{x \\to 1} \\frac{1}{x - 1}$ 不存在。\n\n检验：$\\frac{1}{(x - 1)^{2}}$ 在 $x = 0.99$ 和 $x = 1.01$ 处都是 $10000$，而 $\\frac{1}{x - 1}$ 在这两处分别是 $-100$ 和 $100$。\n\n> **注意。** 分式加上一个常数，在渐近线附近不改变什么；只有一侧取很大的值，不构成双侧极限。",
    ],
    (rng) => {
      const a = rng.int(-6, 6);
      const c = nz(rng, 7);
      const n = rng.int(1, 4);
      const b = rng.int(-4, 4);
      const base = a === 0 ? "x" : `(${minus(a)})`;
      const den = n === 1 ? minus(a) : `${base}^{${n}}`;
      const f = poly([1, `\\frac{${c}}{${den}}`], [b, ""]);
      const pos: Pair = ["$\\infty$", "$\\infty$"];
      const neg: Pair = ["$-\\infty$", "$-\\infty$"];
      const none: Pair = ["It does not exist, as the sides go to opposite infinities", "不存在，因为两侧趋于相反的无穷"];
      const finite: Pair = [`$${b}$`, `$${b}$`];
      const even = n % 2 === 0;
      const table = valueTable(
        [a - 0.1, a - 0.01, a + 0.01, a + 0.1].map((x) => Math.round(x * 1000) / 1000),
        [["f(x)", (x) => c / (x - a) ** n + b]],
      );
      const word = (s: number) => (s > 0 ? ["positive", "正"] : ["negative", "负"]);
      const up = c > 0 ? ["right", "右"] : ["left", "左"];
      const down = c > 0 ? ["left", "左"] : ["right", "右"];
      const reasons: Reason[] = [
        [
          finite[0],
          `The constant $${b}$ is only added on; the fraction grows without bound near $x = ${a}$, so the limit is not finite.`,
          `常数 $${b}$ 只是加在后面；分式在 $x = ${a}$ 附近无界增大，所以极限不是有限数。`,
        ],
        ...(even
          ? ([
              [
                (c > 0 ? neg : pos)[0],
                `The denominator is positive on both sides, so the fraction has the sign of $${c}$ and goes to $${infL(c)}$, not $${infL(-c)}$.`,
                `分母在两侧都为正，所以分式与 $${c}$ 同号，趋于 $${infL(c)}$，而不是 $${infL(-c)}$。`,
              ],
              [
                none[0],
                `With the even power $${n}$ both sides go the same way, to $${infL(c)}$, so the two-sided limit is $${infL(c)}$.`,
                `幂次 $${n}$ 是偶数，两侧趋于同一方向 $${infL(c)}$，所以双侧极限是 $${infL(c)}$。`,
              ],
            ] as Reason[])
          : ([
              [
                pos[0],
                `Only the ${up[0]} side goes to $\\infty$; the other side goes to $-\\infty$.`,
                `只有${up[1]}侧趋于 $\\infty$；另一侧趋于 $-\\infty$。`,
              ],
              [
                neg[0],
                `Only the ${down[0]} side goes to $-\\infty$; the other side goes to $\\infty$.`,
                `只有${down[1]}侧趋于 $-\\infty$；另一侧趋于 $\\infty$。`,
              ],
            ] as Reason[])),
      ];
      return reasoned(
        choose(
          rng,
          [`Find $\\lim_{x \\to ${a}} \\left(${f}\\right)$.`, `求 $\\lim_{x \\to ${a}} \\left(${f}\\right)$。`],
          even ? (c > 0 ? pos : neg) : none,
          even ? [c > 0 ? neg : pos, none, finite] : [pos, neg, finite],
          walk(
            [
              [
                "Find the sign of the denominator",
                "确定分母的符号",
                even
                  ? `The power $${n}$ is even, so $${den}$ is positive on both sides of $${a}$ and tends to $0$.`
                  : `The power $${n}$ is odd, so $${den}$ is negative to the left of $${a}$, positive to the right, and tends to $0$.`,
                even
                  ? `幂次 $${n}$ 是偶数，所以 $${den}$ 在 $${a}$ 两侧都为正，并趋于 $0$。`
                  : `幂次 $${n}$ 是奇数，所以 $${den}$ 在 $${a}$ 左侧为负、右侧为正，并趋于 $0$。`,
              ],
              [
                "Follow each side",
                "分别看两侧",
                even
                  ? `The fraction has the sign of $${c}$ on both sides and grows without bound, so both sides go to $${infL(c)}$. Adding $${b}$ changes nothing, and the limit is $${infL(c)}$.`
                  : `The fraction goes to $${infL(-c)}$ from the left and $${infL(c)}$ from the right. The sides disagree, so the limit does not exist.`,
                even
                  ? `分式在两侧都与 $${c}$ 同号且无界增大，所以两侧都趋于 $${infL(c)}$。加上 $${b}$ 不改变什么，极限是 $${infL(c)}$。`
                  : `分式从左侧趋于 $${infL(-c)}$，从右侧趋于 $${infL(c)}$。两侧不一致，所以极限不存在。`,
              ],
            ],
            [
              `Evaluate the function on both sides of $x = ${a}$:\n\n${table}\n\n${even ? `Both sides are large and ${word(c)[0]}.` : `The left values are large and ${word(-c)[0]}, the right values large and ${word(c)[0]}.`}`,
              `计算函数在 $x = ${a}$ 两侧的值：\n\n${table}\n\n${even ? `两侧的值都很大且为${word(c)[1]}。` : `左侧的值很大且为${word(-c)[1]}，右侧的值很大且为${word(c)[1]}。`}`,
            ],
          ),
        ),
        reasons,
      );
    },
  ),
  figure: calculusDrawings1["limits-of-reciprocal-functions#two-sided-limits-at-an-asymptote"],
};

const trigAtMultiplesOfPi = point(
  "trigonometric-limits-at-any-multiple-of-pi",
  ["Trigonometric limits at any multiple of pi", "在 $\\pi$ 的任意整数倍处的三角极限"],
  [
    "Sine and cosine are continuous, so a limit is a value, and periodicity gives the value at any multiple of $\\pi$: $\\sin k\\pi = 0$ and $\\cos k\\pi = (-1)^{k}$. An odd multiple gives $-1$ and an even one gives $1$, also for negative $k$.\n\nFor example, $\\lim_{x \\to 3\\pi} (2\\sin x + 5\\cos x) = 2 \\cdot 0 + 5 \\cdot (-1) = -5$.\n\nCheck: at $x = 3\\pi + 0.01$ the expression is about $-5.020$, and at $x = 3\\pi - 0.01$ about $-4.980$.\n\n> **Watch out.** $\\cos k\\pi$ depends only on whether $k$ is even or odd; it is never $k$ itself, and $\\cos(-3\\pi) = -1$ like $\\cos 3\\pi$.",
    "正弦和余弦连续，所以极限就是函数值，周期性给出 $\\pi$ 任意整数倍处的值：$\\sin k\\pi = 0$，$\\cos k\\pi = (-1)^{k}$。奇数倍得 $-1$，偶数倍得 $1$，$k$ 为负时也一样。\n\n例如 $\\lim_{x \\to 3\\pi} (2\\sin x + 5\\cos x) = 2 \\cdot 0 + 5 \\cdot (-1) = -5$。\n\n检验：$x = 3\\pi + 0.01$ 时表达式约为 $-5.020$，$x = 3\\pi - 0.01$ 时约为 $-4.980$。\n\n> **注意。** $\\cos k\\pi$ 只取决于 $k$ 的奇偶，而不是 $k$ 本身；$\\cos(-3\\pi) = -1$，与 $\\cos 3\\pi$ 一样。",
  ],
  (rng) => {
    const k = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5, 6, 7]);
    const a = nz(rng, 9);
    const b = nz(rng, 9);
    const c = rng.int(-6, 6);
    const f = poly([a, "\\sin x"], [b, "\\cos x"], [c, ""]);
    const cos = k % 2 === 0 ? 1 : -1;
    const answer = b * cos + c;
    const shifts = [-0.1, -0.01, 0.01, 0.1];
    const table = valueTable(
      shifts.map((d) => k * Math.PI + d),
      [["f(x)", (x) => a * Math.sin(x) + b * Math.cos(x) + c]],
      shifts.map((d) => `${k}\\pi ${d < 0 ? "-" : "+"} ${Math.abs(d)}`),
    );
    return ask(
      [`Find $\\lim_{x \\to ${k}\\pi} \\left(${f}\\right)$.`, `求 $\\lim_{x \\to ${k}\\pi} \\left(${f}\\right)$。`],
      answer,
      [-b * cos + c, a + c, a * cos + c, a + b + c],
      walk(
        [
          [
            "Find the values at the point",
            "求该点处的值",
            `$\\sin(${k}\\pi) = 0$ and, since $${k}$ is ${cos > 0 ? "even" : "odd"}, $\\cos(${k}\\pi) = ${cos}$.`,
            `$\\sin(${k}\\pi) = 0$；$${k}$ 是${cos > 0 ? "偶数" : "奇数"}，所以 $\\cos(${k}\\pi) = ${cos}$。`,
          ],
          [
            "Substitute",
            "代入",
            `Sine and cosine are continuous, so the limit is the value:\n\n$$${paren(a)} \\cdot 0 + ${paren(b)} \\cdot ${paren(cos)} + ${paren(c)} = ${answer}$$`,
            `正弦和余弦连续，所以极限就是函数值：\n\n$$${paren(a)} \\cdot 0 + ${paren(b)} \\cdot ${paren(cos)} + ${paren(c)} = ${answer}$$`,
          ],
        ],
        [
          `Write $f(x)$ for the expression and evaluate it near $x = ${k}\\pi$:\n\n${table}\n\nThe values close in on $${answer}$ from both sides.`,
          `记这个表达式为 $f(x)$，在 $x = ${k}\\pi$ 附近计算它的值：\n\n${table}\n\n函数值从两侧逼近 $${answer}$。`,
        ],
      ),
    );
  },
);

const reciprocalTrigFarOut = {
  ...point(
    "reciprocal-trigonometric-limits-away-from-the-first-period",
    ["Reciprocal limits away from the first period", "第一个周期以外的倒数三角极限"],
    [
      "Away from its asymptotes a reciprocal trigonometric function is continuous, so its limit is its value, which comes from the sine or cosine it is built on: $\\sec k\\pi = (-1)^{k}$, $\\csc\\left(\\frac{\\pi}{2} + k\\pi\\right) = (-1)^{k}$, and $\\cot\\left(\\frac{\\pi}{2} + k\\pi\\right) = 0$.\n\nFor example, $\\cos 3\\pi = -1$, so $\\lim_{x \\to 3\\pi} (2\\sec x + 1) = 2 \\cdot (-1) + 1 = -1$.\n\nCheck: at $x = 3\\pi + 0.01$, $\\sec x \\approx -1.00005$, and the expression is about $-1.000$.\n\n> **Watch out.** At $\\frac{\\pi}{2} + k\\pi$ the cotangent is $0$, since its numerator $\\cos x$ is $0$ there; the asymptotes of $\\cot x$ are where $\\sin x = 0$.",
      "在渐近线以外，倒数三角函数连续，所以极限就是函数值，它由相应的正弦或余弦决定：$\\sec k\\pi = (-1)^{k}$，$\\csc\\left(\\frac{\\pi}{2} + k\\pi\\right) = (-1)^{k}$，$\\cot\\left(\\frac{\\pi}{2} + k\\pi\\right) = 0$。\n\n例如 $\\cos 3\\pi = -1$，所以 $\\lim_{x \\to 3\\pi} (2\\sec x + 1) = 2 \\cdot (-1) + 1 = -1$。\n\n检验：$x = 3\\pi + 0.01$ 时 $\\sec x \\approx -1.00005$，表达式约为 $-1.000$。\n\n> **注意。** 在 $\\frac{\\pi}{2} + k\\pi$ 处余切是 $0$，因为它的分子 $\\cos x$ 在那里是 $0$；$\\cot x$ 的渐近线在 $\\sin x = 0$ 的地方。",
    ],
    (rng) => {
      const k = rng.pick([1, 2, 3, 4, 5, -1, -2, -3]);
      const a = nz(rng, 9);
      const c = rng.int(-6, 6);
      const kind = rng.pick(["sec", "csc", "cot"] as const);
      const sign = k % 2 === 0 ? 1 : -1;
      const piText = k === 1 ? "\\pi" : k === -1 ? "-\\pi" : `${k}\\pi`;
      const half = Math.abs(2 * k + 1);
      const at = kind === "sec" ? piText : `${k < 0 ? "-" : ""}\\frac{${half}\\pi}{2}`;
      const x0 = kind === "sec" ? k * Math.PI : ((2 * k + 1) * Math.PI) / 2;
      const value = kind === "cot" ? 0 : sign;
      const answer = a * value + c;
      const where = kind === "sec" ? `\\cos\\left(${at}\\right)` : `\\sin\\left(${at}\\right)`;
      const also = kind === "cot" ? ` and $\\cos\\left(${at}\\right) = 0$` : "";
      const alsoZh = kind === "cot" ? `，$\\cos\\left(${at}\\right) = 0$` : "";
      const top = kind === "cot" ? "0" : "1";
      const f = poly([a, `\\${kind} x`], [c, ""]);
      const g = (x: number) => a * (kind === "sec" ? 1 / Math.cos(x) : kind === "csc" ? 1 / Math.sin(x) : Math.cos(x) / Math.sin(x)) + c;
      const shifts = [-0.1, -0.01, 0.01, 0.1];
      const table = valueTable(
        shifts.map((d) => x0 + d),
        [["f(x)", g]],
        shifts.map((d) => `${at} ${d < 0 ? "-" : "+"} ${Math.abs(d)}`),
      );
      return ask(
        [`Find $\\lim_{x \\to ${at}} \\left(${f}\\right)$.`, `求 $\\lim_{x \\to ${at}} \\left(${f}\\right)$。`],
        answer,
        [a + c, -a + c, c - a * value, a * sign * -1 + c, c],
        walk(
          [
            [
              `Find the ${kind === "sec" ? "cosine" : "sine"}`,
              kind === "sec" ? "求余弦" : "求正弦",
              `At $x = ${at}$, $${where} = ${sign}$${also}.`,
              `在 $x = ${at}$ 处，$${where} = ${sign}$${alsoZh}。`,
            ],
            [
              "Find the reciprocal function",
              "求倒数三角函数的值",
              `So $\\${kind}\\left(${at}\\right) = \\frac{${top}}{${sign}} = ${value}$.`,
              `所以 $\\${kind}\\left(${at}\\right) = \\frac{${top}}{${sign}} = ${value}$。`,
            ],
            [
              "Substitute",
              "代入",
              `The function is continuous there, so the limit is\n\n$$${paren(a)} \\cdot ${paren(value)} + ${paren(c)} = ${answer}$$`,
              `函数在该点连续，所以极限是\n\n$$${paren(a)} \\cdot ${paren(value)} + ${paren(c)} = ${answer}$$`,
            ],
          ],
          [
            `Write $f(x)$ for the expression and evaluate it near $x = ${at}$:\n\n${table}\n\nThe values close in on $${answer}$ from both sides.`,
            `记这个表达式为 $f(x)$，在 $x = ${at}$ 附近计算它的值：\n\n${table}\n\n函数值从两侧逼近 $${answer}$。`,
          ],
        ),
      );
    },
  ),
  figure: calculusDrawings1["limits-of-reciprocal-trigonometric-functions#reciprocal-trigonometric-limits-away-from-the-first-period"],
};

const sameBaseExponentials = point(
  "dominant-exponentials-with-the-same-base",
  ["Dominant exponentials with the same base", "底相同的主导指数项"],
  [
    "In a quotient at infinity, only the fastest-growing term of the numerator and of the denominator matter. An exponential with the largest base beats every power and every smaller base. When both sides share that base, it cancels and the limit is the ratio of the coefficients.\n\nFor $\\frac{2 \\cdot 3^{x} + x^{5}}{4 \\cdot 3^{x} + 2^{x}}$, divide top and bottom by $3^{x}$: $\\frac{x^{5}}{3^{x}} \\to 0$ and $\\frac{2^{x}}{3^{x}} \\to 0$, so the limit is $\\frac{2}{4} = \\frac{1}{2}$.\n\nCheck: at $x = 20$ the quotient is about $0.5002$, and at $x = 30$ about $0.5000$.\n\n> **Watch out.** A high power such as $x^{9}$ can be larger than $3^{x}$ for small $x$, but the exponential wins in the end. The smaller exponential tends to $0$ after dividing, so it adds nothing to the bottom's coefficient.",
    "在无穷远处的商中，只有分子和分母里增长最快的项起作用。底最大的指数项胜过任何幂函数和任何底更小的指数项。如果分子分母都以这个底为主导，它就约去了，极限等于系数之比。\n\n对于 $\\frac{2 \\cdot 3^{x} + x^{5}}{4 \\cdot 3^{x} + 2^{x}}$，分子分母同除以 $3^{x}$：$\\frac{x^{5}}{3^{x}} \\to 0$，$\\frac{2^{x}}{3^{x}} \\to 0$，所以极限是 $\\frac{2}{4} = \\frac{1}{2}$。\n\n检验：$x = 20$ 时商约为 $0.5002$，$x = 30$ 时约为 $0.5000$。\n\n> **注意。** 像 $x^{9}$ 这样的高次幂在 $x$ 较小时可能比 $3^{x}$ 大，但最终指数函数胜出。底更小的指数项除以主导项后趋于 $0$，不会给分母的系数增加任何东西。",
  ],
  (rng) => {
    const b = rng.int(3, 7);
    const e = rng.int(2, b - 1);
    const c = nz(rng, 9);
    const d = rng.int(2, 9);
    const n = rng.int(3, 9);
    const m = rng.int(2, 9);
    const answer = Q.of(c, d);
    const top = poly([c, `\\cdot ${b}^{x}`], [m, `x^{${n}}`]).replace(/^(-?)\\cdot /, "$1");
    const bottom = `${d} \\cdot ${b}^{x} + ${e}^{x}`;
    const f = (x: number) => (c * b ** x + m * x ** n) / (d * b ** x + e ** x);
    const values = table(["$x$", "$50$", "$100$", "$200$"], ["$f(x)$", ...[50, 100, 200].map((x) => `$${num(f(x))}$`)]);
    const seen = new Set([answer.toString()]);
    const mistakes = [
      why(
        0,
        `The top grows like $${b}^{x}$ too, as fast as the bottom, so the limit is not $0$.`,
        `分子也像 $${b}^{x}$ 那样增长，与分母一样快，所以极限不是 $0$。`,
      ),
      why(
        Q.of(m, d),
        `This uses the coefficient $${m}$ of $x^{${n}}$. Divided by $${b}^{x}$, that term tends to $0$.`,
        `这用了 $x^{${n}}$ 的系数 $${m}$。除以 $${b}^{x}$ 后这一项趋于 $0$。`,
      ),
      why(
        Q.of(c, d + 1),
        `This counts $${e}^{x}$ as if it grew like $${b}^{x}$. Divided by $${b}^{x}$, it tends to $0$.`,
        `这把 $${e}^{x}$ 当成了与 $${b}^{x}$ 增长得一样快。除以 $${b}^{x}$ 后它趋于 $0$。`,
      ),
      why(Q.of(d, c), "This turns the ratio upside down.", "这把比颠倒了。"),
    ].filter((w) => {
      const key = (typeof w.value === "number" ? Q.of(w.value) : w.value).toString();
      return !seen.has(key) && Boolean(seen.add(key));
    });
    const [solutionEn, solutionZh] = walk(
      [
        [
          "Find the dominant term",
          "找出主导项",
          `$${b}^{x}$ grows faster than $x^{${n}}$ and than $${e}^{x}$, and it appears both above and below.`,
          `$${b}^{x}$ 比 $x^{${n}}$ 和 $${e}^{x}$ 增长得都快，并且分子分母中都有它。`,
        ],
        [
          "Divide by it",
          "同除以它",
          `Divide top and bottom by $${b}^{x}$; the other terms tend to $0$:\n\n$$\\frac{${c} + 0}{${d} + 0} = ${answer.toLatex()}$$`,
          `分子分母同除以 $${b}^{x}$，其余各项趋于 $0$：\n\n$$\\frac{${c} + 0}{${d} + 0} = ${answer.toLatex()}$$`,
        ],
      ],
      [
        `Evaluate the quotient farther and farther out:\n\n${values}\n\nThe values close in on $${answer.toLatex()}${approx(answer)}$.`,
        `计算越来越远处商的值：\n\n${values}\n\n这些值逼近 $${answer.toLatex()}${approx(answer)}$。`,
      ],
    );
    return numberProblem({
      prompt: t(`Find $\\lim_{x \\to \\infty} \\frac{${top}}{${bottom}}$.`, `求 $\\lim_{x \\to \\infty} \\frac{${top}}{${bottom}}$。`),
      answer,
      mistakes,
      solution: t(solutionEn, solutionZh),
    });
  },
);

const whichConditionFails = point(
  "which-condition-of-continuity-fails",
  ["Which condition of continuity fails", "连续性的哪一条不满足"],
  [
    "Continuity at $a$ asks three things in order: $f(a)$ is defined, $\\lim_{x \\to a} f(x)$ exists, and the two are equal. Naming the first condition that fails also tells the kind of discontinuity: a missing value or a moved point can be repaired, a jump cannot.\n\nFor example, if both one-sided limits at $2$ are $5$ but $f(2) = 1$, the value is defined and the limit exists, so the third condition is the one that fails.\n\nCheck: a function with these facts, such as $f(x) = x + 3$ for $x \\ne 2$ with $f(2) = 1$, gives $f(1.99) = 4.99$ and $f(2.01) = 5.01$, close to $5$ rather than to $1$.\n\n> **Watch out.** Test the conditions in order. When $f(a)$ is not defined, the first condition already fails, whatever the limit does.",
    "在 $a$ 处连续依次要求三件事：$f(a)$ 有定义，$\\lim_{x \\to a} f(x)$ 存在，二者相等。说出第一条不满足的条件，也就知道了间断的类型：缺失的值或移动的点可以修补，跳跃则不能。\n\n例如，若在 $2$ 处两个单侧极限都是 $5$，而 $f(2) = 1$，那么函数值有定义，极限也存在，不满足的是第三条。\n\n检验：满足这些条件的一个函数，例如 $x \\ne 2$ 时 $f(x) = x + 3$、$f(2) = 1$，有 $f(1.99) = 4.99$，$f(2.01) = 5.01$，接近 $5$ 而不是 $1$。\n\n> **注意。** 要按顺序检验这几条。$f(a)$ 没有定义时，第一条就已经不满足，与极限如何无关。",
  ],
  (rng) => {
    const a = rng.int(-5, 5);
    const L = rng.int(-8, 8);
    const kind = rng.int(0, 3);
    const R = kind === 1 ? L + nz(rng, 5) : L;
    const v = kind === 2 ? L + nz(rng, 5) : L;
    const given = kind === 0 ? [`$f(${a})$ is not defined`, `$f(${a})$ 没有定义`] : [`$f(${a}) = ${v}$`, `$f(${a}) = ${v}$`];
    const options: Pair[] = [
      [`$f(${a})$ is not defined`, `$f(${a})$ 没有定义`],
      [`The limit at $${a}$ does not exist`, `在 $${a}$ 处的极限不存在`],
      [`The limit exists but differs from $f(${a})$`, `极限存在，但不等于 $f(${a})$`],
      [`None fails: $f$ is continuous at $${a}$`, `没有不满足的：$f$ 在 $${a}$ 处连续`],
    ];
    const answer = kind;
    const whyEn = [
      "There is no value to compare with the limit, so the first condition fails.",
      "The one-sided limits differ, so the limit does not exist.",
      `The limit is $${L}$ but the value is $${v}$.`,
      `The limit is $${L}$ and it equals the value, so all three conditions hold.`,
    ][answer]!;
    const whyZh = [
      "没有函数值可与极限比较，所以第一条不满足。",
      "两个单侧极限不相等，所以极限不存在。",
      `极限是 $${L}$，函数值却是 $${v}$。`,
      `极限是 $${L}$，等于函数值，所以三条都满足。`,
    ][answer]!;
    const reasons: Reason[] = [
      [options[0]![0], `$f(${a}) = ${v}$ is given, so the value is defined.`, `题目给出了 $f(${a}) = ${v}$，所以函数值有定义。`],
      [
        options[1]![0],
        `Both one-sided limits are $${L}$, so the limit exists and equals $${L}$.`,
        `两个单侧极限都是 $${L}$，所以极限存在，等于 $${L}$。`,
      ],
      kind === 0
        ? [
            options[2]![0],
            "There is no value $f(a)$ for the limit to differ from; the first condition already fails.",
            "没有函数值 $f(a)$ 可供比较；第一条就已经不满足。",
          ]
        : kind === 1
          ? [
              options[2]![0],
              `The one-sided limits $${L}$ and $${R}$ differ, so there is no limit to compare with $f(${a})$.`,
              `单侧极限 $${L}$ 与 $${R}$ 不相等，所以没有极限可与 $f(${a})$ 比较。`,
            ]
          : [options[2]![0], `The limit $${L}$ equals $f(${a}) = ${v}$.`, `极限 $${L}$ 等于 $f(${a}) = ${v}$。`],
      kind === 0
        ? [
            options[3]![0],
            `$f(${a})$ is not defined, so $f$ cannot be continuous at $${a}$.`,
            `$f(${a})$ 没有定义，所以 $f$ 在 $${a}$ 处不可能连续。`,
          ]
        : kind === 1
          ? [
              options[3]![0],
              `The one-sided limits $${L}$ and $${R}$ differ, so the limit does not exist.`,
              `单侧极限 $${L}$ 与 $${R}$ 不相等，所以极限不存在。`,
            ]
          : [options[3]![0], `The limit $${L}$ differs from the value $${v}$.`, `极限 $${L}$ 与函数值 $${v}$ 不相等。`],
    ];
    const g = (x: number) => (x < a ? x - a + L : x - a + R);
    const rows = valueTable(around(a), [["g(x)", g]]);
    const valueEn = kind === 0 ? "It is not defined" : `It is $${v}$`;
    const valueZh = kind === 0 ? "它没有定义" : `它是 $${v}$`;
    return reasoned(
      choose(
        rng,
        [
          `A function has $\\lim_{x \\to ${a}^{-}} f(x) = ${L}$ and $\\lim_{x \\to ${a}^{+}} f(x) = ${R}$, and ${given[0]}. What can be said about continuity at $x = ${a}$?`,
          `函数满足 $\\lim_{x \\to ${a}^{-}} f(x) = ${L}$，$\\lim_{x \\to ${a}^{+}} f(x) = ${R}$，并且 ${given[1]}。关于它在 $x = ${a}$ 处的连续性可以说什么？`,
        ],
        options[answer]!,
        options.filter((_, i) => i !== answer),
        walk(
          [
            ["Look at the value", "看函数值", `${valueEn}.`, `${valueZh}。`],
            [
              "Compare the one-sided limits",
              "比较单侧极限",
              kind === 1 ? `They are $${L}$ and $${R}$, which differ.` : `Both are $${L}$, so the limit is $${L}$.`,
              kind === 1 ? `它们是 $${L}$ 和 $${R}$，不相等。` : `两者都是 $${L}$，所以极限是 $${L}$。`,
            ],
            ["Name the first failure", "找出第一条不满足的条件", whyEn, whyZh],
          ],
          [
            `A function with these one-sided limits is $g(x) = x${tail(L - a)}$ for $x < ${a}$ and $g(x) = x${tail(R - a)}$ for $x > ${a}$. Its values beside $x = ${a}$ are:\n\n${rows}\n\n${kind === 1 ? `The left values approach $${L}$ and the right values $${R}$, so no single limit exists.` : `Both sides approach $${L}$, which ${kind === 0 ? "has no value of $f$ to match" : kind === 2 ? `does not match $f(${a}) = ${v}$` : `matches $f(${a}) = ${v}$`}.`}`,
            `具有这些单侧极限的一个函数是：$x < ${a}$ 时 $g(x) = x${tail(L - a)}$，$x > ${a}$ 时 $g(x) = x${tail(R - a)}$。它在 $x = ${a}$ 两旁的值是：\n\n${rows}\n\n${kind === 1 ? `左侧的值趋近 $${L}$，右侧的值趋近 $${R}$，所以极限不存在。` : `两侧都趋近 $${L}$，${kind === 0 ? "没有 $f$ 的值与之比较" : kind === 2 ? `与 $f(${a}) = ${v}$ 不等` : `与 $f(${a}) = ${v}$ 相等`}。`}`,
          ],
        ),
      ),
      reasons.filter((_, i) => i !== answer),
    );
  },
);

const valueForOneSidedContinuity = point(
  "the-value-that-gives-one-sided-continuity",
  ["The value that gives one-sided continuity", "使函数单侧连续的取值"],
  [
    "At a jump the function cannot be continuous from both sides, but the value $f(a)$ can be chosen to match one side. Continuity from the left needs $f(a)$ to equal the left limit, and continuity from the right needs it to equal the right limit.\n\nFor example, let $f(x) = x + 1$ for $x < 2$, $f(2) = k$ and $f(x) = 3x$ for $x > 2$. The left limit is $3$ and the right limit is $6$, so $k = 3$ gives continuity from the left and $k = 6$ from the right.\n\nCheck: $f(1.99) = 2.99$, close to $3$, and $f(2.01) = 6.03$, close to $6$.\n\n> **Watch out.** Continuity from the left uses the formula for $x < a$, the side the values come from. Using the other piece gives the value for the other side.",
    "在跳跃处，函数不可能在两侧都连续，但可以选择 $f(a)$ 与某一侧相符。左连续要求 $f(a)$ 等于左极限，右连续要求 $f(a)$ 等于右极限。\n\n例如，设 $x < 2$ 时 $f(x) = x + 1$，$f(2) = k$，$x > 2$ 时 $f(x) = 3x$。左极限是 $3$，右极限是 $6$，所以 $k = 3$ 时左连续，$k = 6$ 时右连续。\n\n检验：$f(1.99) = 2.99$，接近 $3$；$f(2.01) = 6.03$，接近 $6$。\n\n> **注意。** 左连续用的是 $x < a$ 时的表达式，即函数值所来自的那一侧。用另一段得到的是另一侧所需的值。",
  ],
  (rng) => {
    const a = rng.int(-4, 4);
    const p = nz(rng, 5);
    const q = rng.int(-6, 6);
    const r = nz(rng, 5);
    const L = p * a + q;
    const R = L + nz(rng, 6);
    const s = R - r * a;
    const fromLeft = rng.bool();
    const f = `\\begin{cases} ${linear(p, q)} & x < ${a} \\\\ k & x = ${a} \\\\ ${linear(r, s)} & x > ${a} \\end{cases}`;
    const answer = fromLeft ? L : R;
    const piece = fromLeft ? linear(p, q) : linear(r, s);
    const rows = valueTable(around(a), [["f(x)", (x) => (x < a ? p * x + q : r * x + s)]]);
    return ask(
      [
        `Let $f(x) = ${f}$. Find the value of $k$ that makes $f$ continuous from the ${fromLeft ? "left" : "right"} at $x = ${a}$.`,
        `设 $f(x) = ${f}$。求使 $f$ 在 $x = ${a}$ 处${fromLeft ? "左" : "右"}连续的 $k$ 值。`,
      ],
      answer,
      [fromLeft ? R : L, Q.of(L + R, 2)],
      walk(
        [
          [
            "Pick the side",
            "确定哪一侧",
            `Continuity from the ${fromLeft ? "left" : "right"} needs $f(${a})$ to equal the ${fromLeft ? "left" : "right"} limit, which comes from $${piece}$, the formula for $x ${fromLeft ? "<" : ">"} ${a}$.`,
            `${fromLeft ? "左" : "右"}连续要求 $f(${a})$ 等于${fromLeft ? "左" : "右"}极限，它由 $x ${fromLeft ? "<" : ">"} ${a}$ 时的表达式 $${piece}$ 给出。`,
          ],
          [
            "Substitute",
            "代入",
            `Substituting $x = ${a}$ into $${piece}$ gives $${answer}$, so $k = ${answer}$.`,
            `把 $x = ${a}$ 代入 $${piece}$ 得 $${answer}$，所以 $k = ${answer}$。`,
          ],
        ],
        [
          `Evaluate $f$ beside $x = ${a}$:\n\n${rows}\n\nThe values on the left approach $${L}$ and those on the right approach $${R}$. The ${fromLeft ? "left" : "right"} side is the one that must meet $f(${a})$, so $k = ${answer}$.`,
          `计算 $f$ 在 $x = ${a}$ 两旁的值：\n\n${rows}\n\n左侧的值趋近 $${L}$，右侧的值趋近 $${R}$。必须与 $f(${a})$ 相接的是${fromLeft ? "左" : "右"}侧，所以 $k = ${answer}$。`,
        ],
      ),
    );
  },
);

const twoValuesOfK = point(
  "two-values-of-a-constant-that-make-a-function-continuous",
  ["Two values of a constant that make a function continuous", "使函数连续的常数有两个取值"],
  [
    "When the constant appears squared, matching the two pieces at the break gives a quadratic equation in the constant. Both roots make the pieces meet, so both must be reported and each can be checked by substituting back.\n\nFor example, for $f(x) = k^{2}x + 1$ when $x < 1$ and $f(x) = 3kx - 1$ when $x \\ge 1$, matching at $x = 1$ gives $k^{2} + 1 = 3k - 1$, so $k^{2} - 3k + 2 = 0$ and $k = 1$ or $k = 2$.\n\nCheck: with $k = 2$ the pieces give $4 + 1 = 5$ and $6 - 1 = 5$; with $k = 1$ they give $2$ and $2$.\n\n> **Watch out.** Substitute the break point for $x$ in both pieces before solving. Leaving out the factor $x$ changes the quadratic and its roots.",
    "当常数以平方形式出现时，令两段在分段点处相等，会得到关于这个常数的二次方程。两个根都能使两段相接，所以都要写出，并且可以分别代回检验。\n\n例如，对于 $x < 1$ 时 $f(x) = k^{2}x + 1$、$x \\ge 1$ 时 $f(x) = 3kx - 1$，在 $x = 1$ 处相等得 $k^{2} + 1 = 3k - 1$，即 $k^{2} - 3k + 2 = 0$，所以 $k = 1$ 或 $k = 2$。\n\n检验：$k = 2$ 时两段给出 $4 + 1 = 5$ 和 $6 - 1 = 5$；$k = 1$ 时都给出 $2$。\n\n> **注意。** 求解之前要把分段点代入两段中的 $x$。漏掉因子 $x$ 会改变二次方程和它的根。",
  ],
  (rng) => {
    const c = rng.pick([1, 2, 3, -1, -2]);
    const r1 = nz(rng, 6);
    const r2 = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6].filter((x) => x !== r1 && x !== -r1));
    const s = r1 + r2;
    const right = rng.int(-6, 6);
    const p = c * r1 * r2 + right;
    const f = `\\begin{cases} ${poly([1, "k^{2}x"], [p, ""])} & x < ${c} \\\\ ${poly([s, "kx"], [right, ""])} & x \\ge ${c} \\end{cases}`;
    const eq = `${poly([c, "k^{2}"], [-c * s, "k"], [c * r1 * r2, ""])} = 0`;
    const lead = c === 1 ? "" : c === -1 ? "-" : String(c);
    const rows = table(
      ["$k$", `left piece at $x = ${c}$`, `right piece at $x = ${c}$`],
      ...[r1, r2].map((k) => [`$${k}$`, `$${c * k * k + p}$`, `$${s * k * c + right}$`]),
    );
    const rowsZh = table(
      ["$k$", `左段在 $x = ${c}$ 处`, `右段在 $x = ${c}$ 处`],
      ...[r1, r2].map((k) => [`$${k}$`, `$${c * k * k + p}$`, `$${s * k * c + right}$`]),
    );
    return solutionsProblem({
      prompt: t(
        `Let $f(x) = ${f}$. Find every value of $k$ that makes $f$ continuous everywhere.`,
        `设 $f(x) = ${f}$。求使 $f$ 处处连续的所有 $k$ 值。`,
      ),
      variable: "k",
      values: [String(r1), String(r2)],
      wrong: [[String(r1)], [String(r2)], [String(-r1), String(-r2)]],
      solution: t(
        ...walk(
          [
            [
              "Set the pieces equal",
              "令两段相等",
              `Both pieces are continuous, so only $x = ${c}$ matters. Substituting it into both and setting them equal gives $${eq}$.`,
              `两段各自连续，所以只需考虑 $x = ${c}$。代入两段并令其相等，得 $${eq}$。`,
            ],
            [
              "Factor",
              "因式分解",
              `The equation factors as $${lead}(${linear(1, -r1, "k")})(${linear(1, -r2, "k")}) = 0$, so $k = ${r1}$ or $k = ${r2}$.`,
              `方程分解为 $${lead}(${linear(1, -r1, "k")})(${linear(1, -r2, "k")}) = 0$，所以 $k = ${r1}$ 或 $k = ${r2}$。`,
            ],
          ],
          [
            `Substitute each value of $k$ into both pieces at $x = ${c}$:\n\n${rows}\n\nFor each value the two pieces give the same height, so both values close the gap.`,
            `把每个 $k$ 值代入两段，计算 $x = ${c}$ 处的值：\n\n${rowsZh}\n\n每个值都使两段给出相同的高度，所以两个值都能使两段相接。`,
          ],
        ),
      ),
    });
  },
);

const constantFromHole = point(
  "the-constant-from-the-location-of-a-hole",
  ["The constant from the location of a hole", "由洞的位置求常数"],
  [
    "A hole at $x = a$ means that $x - a$ is a factor of the numerator and cancels. If the quotient simplifies to $x + e$, the height of the hole is $a + e$, and multiplying $(x - a)(x + e)$ back out recovers the numerator.\n\nFor example, a hole of $\\frac{x^{2} + kx - 6}{x - 2}$ at $(2, 5)$ needs $2 + e = 5$, so $e = 3$. The numerator is $(x - 2)(x + 3) = x^{2} + x - 6$, and $k = 1$.\n\nCheck: with $k = 1$, the quotient at $x = 2.01$ is $\\frac{0.0501}{0.01} = 5.01$, close to $5$.\n\n> **Watch out.** The height of the hole is the value of the simplified quotient, not of the numerator, which is $0$ at $x = a$.",
    "在 $x = a$ 处有洞，说明 $x - a$ 是分子的因式并被约去。如果商化简为 $x + e$，洞的高度就是 $a + e$，把 $(x - a)(x + e)$ 展开就得到分子。\n\n例如，$\\frac{x^{2} + kx - 6}{x - 2}$ 在 $(2, 5)$ 处有洞，要求 $2 + e = 5$，所以 $e = 3$。分子是 $(x - 2)(x + 3) = x^{2} + x - 6$，所以 $k = 1$。\n\n检验：取 $k = 1$，商在 $x = 2.01$ 处为 $\\frac{0.0501}{0.01} = 5.01$，接近 $5$。\n\n> **注意。** 洞的高度是化简后的商的值，而不是分子的值，分子在 $x = a$ 处是 $0$。",
  ],
  (rng) => {
    const a = nz(rng, 6);
    const h = rng.int(-8, 8);
    const e = h - a;
    const k = e - a;
    const m = -a * e;
    const askK = rng.bool();
    const numerator = poly([1, "x^{2}"], [k, "x"], [m, ""]);
    const rows = valueTable(around(a), [["f(x)", (x) => (x * x + k * x + m) / (x - a)]]);
    return ask(
      askK
        ? [
            `The graph of $f(x) = \\frac{x^{2} + kx${tail(m)}}{${minus(a)}}$ has a hole at $(${a}, ${h})$. Find $k$.`,
            `$f(x) = \\frac{x^{2} + kx${tail(m)}}{${minus(a)}}$ 的图像在 $(${a}, ${h})$ 处有洞。求 $k$。`,
          ]
        : [
            `The graph of $f(x) = \\frac{${poly([1, "x^{2}"], [k, "x"])} + m}{${minus(a)}}$ has a hole at $(${a}, ${h})$. Find $m$.`,
            `$f(x) = \\frac{${poly([1, "x^{2}"], [k, "x"])} + m}{${minus(a)}}$ 的图像在 $(${a}, ${h})$ 处有洞。求 $m$。`,
          ],
      askK ? k : m,
      askK ? [h, h + 2 * a, -k] : [-m, h, a * h],
      walk(
        [
          [
            "Use the height",
            "利用高度",
            `The numerator must be $(${minus(a)})(x + e)$, and after cancelling, the height of the hole is $${a} + e = ${h}$, so $e = ${e}$.`,
            `分子必为 $(${minus(a)})(x + e)$，约分后洞的高度是 $${a} + e = ${h}$，所以 $e = ${e}$。`,
          ],
          [
            "Expand",
            "展开",
            `Expanding $(${minus(a)})(${minus(-e)})$ gives $${numerator}$, so ${askK ? `$k = ${k}$` : `$m = ${m}$`}.`,
            `展开 $(${minus(a)})(${minus(-e)})$ 得 $${numerator}$，所以${askK ? `$k = ${k}$` : `$m = ${m}$`}。`,
          ],
        ],
        [
          `With ${askK ? `$k = ${k}$` : `$m = ${m}$`}, evaluate $f$ beside $x = ${a}$:\n\n${rows}\n\nThe values close in on $${h}$ from both sides, so the hole is at height $${h}$ as required.`,
          `取${askK ? `$k = ${k}$` : `$m = ${m}$`}，计算 $f$ 在 $x = ${a}$ 两旁的值：\n\n${rows}\n\n这些值从两侧逼近 $${h}$，所以洞的高度正是 $${h}$。`,
        ],
      ),
    );
  },
);

const countingAsymptotes = {
  ...point(
    "counting-vertical-asymptotes-after-cancelling",
    ["Counting vertical asymptotes after cancelling", "约分后数垂直渐近线"],
    [
      "A zero of the denominator gives a vertical asymptote only if a factor of it survives cancelling. Compare the power of each factor on top and bottom: more on the bottom gives an asymptote, otherwise the point is a hole.\n\nFor example, $\\frac{x - 1}{(x - 1)^{2}(x + 2)}$ keeps one factor $x - 1$ and the factor $x + 2$ on the bottom after cancelling, so it has two vertical asymptotes, $x = 1$ and $x = -2$.\n\nCheck: $f(1.01) \\approx 33.2$ and $f(1.001) \\approx 333.2$, growing tenfold each time $x$ comes ten times closer to $1$.\n\n> **Watch out.** A shared factor does not always cancel completely. $\\frac{x - 1}{(x - 1)^{2}}$ still leaves $x - 1$ on the bottom, so $x = 1$ is an asymptote, not a hole.",
      "分母的零点只有在对应因式约分后仍然留在分母时，才给出垂直渐近线。比较每个因式在分子和分母中的次数：分母次数更高就是渐近线，否则那一点是洞。\n\n例如，$\\frac{x - 1}{(x - 1)^{2}(x + 2)}$ 约分后分母仍留有一个因式 $x - 1$ 和因式 $x + 2$，所以它有两条垂直渐近线 $x = 1$ 和 $x = -2$。\n\n检验：$f(1.01) \\approx 33.2$，$f(1.001) \\approx 333.2$，$x$ 每向 $1$ 靠近十倍，函数值就增大约十倍。\n\n> **注意。** 公共因式不一定能完全约去。$\\frac{x - 1}{(x - 1)^{2}}$ 约分后分母仍留有 $x - 1$，所以 $x = 1$ 是渐近线而不是洞。",
    ],
    (rng) => {
      const roots = rng.sample([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6], 3);
      const bottom = roots.map(() => rng.int(1, 2));
      const top = roots.map(() => rng.int(0, 2));
      const answer = rootsCount(top, bottom);
      const f = `\\frac{${factors(roots, top)}}{${factors(roots, bottom)}}`;
      const lines = roots.map((r, i) => `$x = ${r}$: ${top[i]} / ${bottom[i]}`).join("; ");
      const linesZh = roots.map((r, i) => `$x = ${r}$：${top[i]} / ${bottom[i]}`).join("；");
      const fx = (x: number) => roots.reduce((acc, r, i) => acc * (x - r) ** (top[i]! - bottom[i]!), 1);
      const xs = roots.flatMap((r) => [r + 0.01, r + 0.001].map((x) => Math.round(x * 1000) / 1000));
      const rows = valueTable(xs, [["f(x)", fx]]);
      const left = roots.filter((_, i) => bottom[i]! > top[i]!);
      const list = left.length === 0 ? "" : left.map((r) => `$x = ${r}$`).join(", ");
      return ask(
        [`How many vertical asymptotes does the graph of $f(x) = ${f}$ have?`, `$f(x) = ${f}$ 的图像有多少条垂直渐近线？`],
        answer,
        [3, 0, 1, 2],
        walk(
          [
            [
              "Compare the powers",
              "比较次数",
              `For each zero of the denominator, compare the power on top with the power on the bottom: ${lines}.`,
              `对分母的每个零点，比较分子与分母中的次数：${linesZh}。`,
            ],
            [
              "Count",
              "计数",
              answer === 0
                ? "No factor has a larger power on the bottom, so every zero cancels and there is no vertical asymptote."
                : `A factor survives on the bottom only at ${list}, so the number of vertical asymptotes is $${answer}$.`,
              answer === 0
                ? "没有哪个因式在分母中的次数更高，所以每个零点都被约去，没有垂直渐近线。"
                : `只有在 ${list} 处有因式留在分母，所以垂直渐近线有 $${answer}$ 条。`,
            ],
          ],
          [
            `Evaluate $f$ at $0.01$ and then $0.001$ to the right of each zero:\n\n${rows}\n\nWhere a factor survives on the bottom, the value grows about tenfold or more as $x$ comes ten times closer; at the other zeros it settles or shrinks. That happens at exactly $${answer}$ of the zeros.`,
            `在每个零点右侧 $0.01$ 和 $0.001$ 处计算 $f$ 的值：\n\n${rows}\n\n有因式留在分母的地方，$x$ 靠近十倍，函数值增大约十倍或更多；在其他零点处，函数值趋于稳定或变小。这样的零点恰好有 $${answer}$ 个。`,
          ],
        ),
      );
    },
  ),
  figure: calculusDrawings1["discontinuities-due-to-vertical-asymptotes#counting-vertical-asymptotes-after-cancelling"],
};

const continuityOfLogOverLinear = point(
  "continuity-of-a-quotient-with-a-logarithm-or-root",
  ["Continuity of a quotient with a logarithm or root", "含对数或根式的商的连续性"],
  [
    "An elementary function is continuous wherever it is defined, so combine the conditions: the argument of a logarithm is positive, the inside of a square root is nonnegative, and the denominator is not zero. A zero of the denominator outside the other condition removes nothing.\n\nFor example, $\\frac{\\ln(x - 1)}{x - 3}$ needs $x > 1$ and $x \\ne 3$, so it is continuous on $(1, 3) \\cup (3, \\infty)$.\n\nCheck: at $x = 2$ the quotient is $\\frac{\\ln 1}{-1} = 0$, defined, while at $x = 3$ the denominator is $0$.\n\n> **Watch out.** A zero of the denominator that is outside the domain of the numerator removes nothing. For $\\frac{\\sqrt{x - 2}}{x}$, the point $x = 0$ is already excluded, so the answer is $[2, \\infty)$.",
    "初等函数在其定义的地方都连续，所以把各条件合起来：对数的真数为正，平方根下非负，分母不为零。如果分母的零点不满足其他条件，那它并不会再去掉什么。\n\n例如，$\\frac{\\ln(x - 1)}{x - 3}$ 要求 $x > 1$ 且 $x \\ne 3$，所以它在 $(1, 3) \\cup (3, \\infty)$ 上连续。\n\n检验：$x = 2$ 时商为 $\\frac{\\ln 1}{-1} = 0$，有定义；而 $x = 3$ 时分母为 $0$。\n\n> **注意。** 分母的零点若不在分子的定义域内，就不会再去掉什么。对于 $\\frac{\\sqrt{x - 2}}{x}$，$x = 0$ 本来就被排除了，所以答案是 $[2, \\infty)$。",
  ],
  (rng) => {
    const a = rng.int(-5, 5);
    const b = rng.pick([-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].filter((x) => x !== a));
    const log = rng.bool();
    const top = log ? `\\ln(${minus(a)})` : `\\sqrt{${minus(a)}}`;
    const f = `\\frac{${top}}{${minus(b)}}`;
    const start = (closed: boolean) => ({ lo: Q.of(a), loClosed: closed, hiClosed: false });
    const closed = !log;
    const inside = b > a;
    const set = inside
      ? union({ lo: Q.of(a), hi: Q.of(b), loClosed: closed, hiClosed: false }, { lo: Q.of(b), loClosed: false, hiClosed: false })
      : union(start(closed));
    const fx = (x: number) => (log ? Math.log(x - a) : Math.sqrt(x - a)) / (x - b);
    const xs = (inside ? [a + 0.01, b - 0.01, b + 0.01] : [a + 0.01, a + 1, a + 5]).map((x) => Math.round(x * 100) / 100);
    const rows = valueTable(xs, [["f(x)", fx]]);
    return intervalProblem({
      prompt: t(`On what set is $f(x) = ${f}$ continuous? Answer in interval notation.`, `$f(x) = ${f}$ 在什么集合上连续？用区间表示。`),
      form: "interval",
      set,
      wrong: [
        union(start(!closed)),
        union(start(closed)),
        union({ hi: Q.of(b), loClosed: false, hiClosed: false }, { lo: Q.of(b), loClosed: false, hiClosed: false }),
      ],
      solution: t(
        ...walk(
          [
            [
              "The numerator",
              "分子",
              `${log ? "The logarithm needs a positive argument" : "The square root needs a nonnegative inside"}, so $x ${log ? ">" : "\\ge"} ${a}$.`,
              `${log ? "对数要求真数为正" : "平方根要求根号下非负"}，所以 $x ${log ? ">" : "\\ge"} ${a}$。`,
            ],
            [
              "The denominator",
              "分母",
              `The denominator needs $x \\ne ${b}$. ${inside ? `The point $${b}$ lies in that range, so it is removed.` : `The point $${b}$ lies outside that range, so it removes nothing.`}`,
              `分母要求 $x \\ne ${b}$。${inside ? `$${b}$ 在这个范围内，所以要去掉。` : `$${b}$ 不在这个范围内，所以不用再去掉什么。`}`,
            ],
          ],
          [
            `Evaluate $f$ at some points of the answer:\n\n${rows}\n\nEach value is defined. For $x < ${a}$ the ${log ? "logarithm" : "square root"} has no real value, ${inside ? `and at $x = ${b}$ the denominator is $0$, so these are the only points left out.` : `and the denominator is never $0$ for $x \\ge ${a}$, so nothing else is left out.`}`,
            `在答案中的一些点计算 $f$：\n\n${rows}\n\n每个值都有定义。当 $x < ${a}$ 时${log ? "对数" : "平方根"}没有实数值，${inside ? `而 $x = ${b}$ 时分母为 $0$，所以只有这些点被排除。` : `而当 $x \\ge ${a}$ 时分母从不为 $0$，所以没有别的点被排除。`}`,
          ],
        ),
      ),
    });
  },
);

const notEveryGapRemovable = {
  ...point(
    "not-every-gap-can-be-removed",
    ["Not every gap can be removed", "并非每个缺口都可去"],
    [
      "A quotient undefined at $a$ can be repaired by a value of $f(a)$ only if its limit at $a$ exists. Check the numerator first: if it is zero at $a$, factor and cancel to find the limit; if it is not zero, the graph has a vertical asymptote and no value helps.\n\nFor example, $\\frac{x^{2} - x - 2}{x - 2} = x + 1$ for $x \\ne 2$, so $f(2) = 3$ repairs it. But $\\frac{x^{2} - x - 1}{x - 2}$ has numerator $1$ at $x = 2$, so no value works.\n\nCheck: the first quotient at $x = 2.01$ is $3.01$, while the second is $\\frac{1.0301}{0.01} = 103.01$.\n\n> **Watch out.** Test the numerator before cancelling. The factor $x - a$ cancels only when the numerator is $0$ at $x = a$.",
      "在 $a$ 处无定义的商，只有在 $a$ 处极限存在时才能通过规定 $f(a)$ 来修补。先检查分子：若分子在 $a$ 处为零，就因式分解并约分求极限；若不为零，图像有垂直渐近线，取什么值都没有用。\n\n例如，当 $x \\ne 2$ 时 $\\frac{x^{2} - x - 2}{x - 2} = x + 1$，所以令 $f(2) = 3$ 就修补好了。但 $\\frac{x^{2} - x - 1}{x - 2}$ 的分子在 $x = 2$ 处是 $1$，所以取什么值都不行。\n\n检验：第一个商在 $x = 2.01$ 处为 $3.01$，而第二个是 $\\frac{1.0301}{0.01} = 103.01$。\n\n> **注意。** 先检验分子再约分。只有分子在 $x = a$ 处为 $0$ 时，因式 $x - a$ 才能约去。",
    ],
    (rng) => {
      const a = nz(rng, 6);
      const e = rng.int(-6, 6);
      const holds = rng.bool();
      const b = e - a;
      const c = holds ? -a * e : -a * e + nz(rng, 5);
      const limit = a + e;
      const f = `\\frac{${poly([1, "x^{2}"], [b, "x"], [c, ""])}}{${minus(a)}}`;
      const at = a * a + b * a + c;
      const no: Pair = [
        `No value works, because the graph has a vertical asymptote at $x = ${a}$`,
        `没有这样的值，因为图像在 $x = ${a}$ 处有垂直渐近线`,
      ];
      const set = (v: number): Pair => [`$f(${a}) = ${v}$`, `$f(${a}) = ${v}$`];
      const rows = valueTable(around(a), [["f(x)", (x) => (x * x + b * x + c) / (x - a)]]);
      const reasons: Reason[] = holds
        ? [
            [
              no[0],
              `The numerator is $0$ at $x = ${a}$, so $${minus(a)}$ cancels and the limit $${limit}$ exists.`,
              `分子在 $x = ${a}$ 处为 $0$，所以 $${minus(a)}$ 能约去，极限 $${limit}$ 存在。`,
            ],
            [
              set(e)[0],
              `$${e}$ is the constant of the factor $${linear(1, e)}$; the simplified quotient must be evaluated at $x = ${a}$, giving $${limit}$.`,
              `$${e}$ 是因式 $${linear(1, e)}$ 的常数项；要把化简后的商在 $x = ${a}$ 处求值，得 $${limit}$。`,
            ],
            [
              set(0)[0],
              `$0$ is the value of the numerator at $x = ${a}$, not of the quotient; the limit is $${limit}$.`,
              `$0$ 是分子在 $x = ${a}$ 处的值，而不是商的值；极限是 $${limit}$。`,
            ],
          ]
        : [
            [
              set(limit)[0],
              `Cancelling $${minus(a)}$ needs the numerator to be $0$ at $x = ${a}$, but it is $${at}$.`,
              `约去 $${minus(a)}$ 要求分子在 $x = ${a}$ 处为 $0$，但它是 $${at}$。`,
            ],
            [
              set(e)[0],
              `The quotient is unbounded near $x = ${a}$, so no value, $${e}$ included, makes it continuous.`,
              `商在 $x = ${a}$ 附近无界，所以任何值（包括 $${e}$）都不能使它连续。`,
            ],
            [
              set(0)[0],
              `The numerator at $x = ${a}$ is $${at}$, not $0$, and the quotient is unbounded there; no value works.`,
              `分子在 $x = ${a}$ 处是 $${at}$，不是 $0$，商在那里无界；取什么值都不行。`,
            ],
          ];
      return reasoned(
        choose(
          rng,
          [
            `Let $f(x) = ${f}$ for $x \\ne ${a}$. What value of $f(${a})$ makes $f$ continuous at $x = ${a}$?`,
            `对 $x \\ne ${a}$，设 $f(x) = ${f}$。$f(${a})$ 取什么值时 $f$ 在 $x = ${a}$ 处连续？`,
          ],
          holds ? set(limit) : no,
          holds ? [no, set(e), set(0)] : [set(limit), set(e), set(0)],
          walk(
            [
              [
                "Test the numerator",
                "检验分子",
                `At $x = ${a}$ the numerator is $${at}$${holds ? `, so $${minus(a)}$ is a factor of it.` : ", not zero, while the denominator tends to $0$."}`,
                `在 $x = ${a}$ 处分子是 $${at}$${holds ? `，所以 $${minus(a)}$ 是它的因式。` : "，不为零，而分母趋于 $0$。"}`,
              ],
              holds
                ? [
                    "Cancel and substitute",
                    "约分并代入",
                    `The numerator is $(${minus(a)})(${linear(1, e)})$. After cancelling, the limit is $${a} + ${paren(e)} = ${limit}$, so $f(${a}) = ${limit}$.`,
                    `分子是 $(${minus(a)})(${linear(1, e)})$。约分后极限是 $${a} + ${paren(e)} = ${limit}$，所以 $f(${a}) = ${limit}$。`,
                  ]
                : [
                    "Conclude",
                    "下结论",
                    `The quotient is unbounded near $x = ${a}$, so the limit does not exist and no value of $f(${a})$ repairs it.`,
                    `商在 $x = ${a}$ 附近无界，所以极限不存在，$f(${a})$ 取什么值都修补不了。`,
                  ],
            ],
            [
              `Evaluate the quotient beside $x = ${a}$:\n\n${rows}\n\n${holds ? `The values close in on $${limit}$ from both sides, the value that fills the gap.` : "The values grow without bound and change sign across the point, the mark of a vertical asymptote."}`,
              `计算商在 $x = ${a}$ 两旁的值：\n\n${rows}\n\n${holds ? `这些值从两侧逼近 $${limit}$，正是填补缺口所需的值。` : "这些值无界增大，并在该点两侧变号，这是垂直渐近线的特征。"}`,
            ],
          ),
        ),
        reasons,
      );
    },
  ),
  figure: calculusDrawings1["removing-point-discontinuities#not-every-gap-can-be-removed"],
};

const jumpSize = point(
  "the-shift-that-closes-a-jump",
  ["The shift that closes a jump", "消除跳跃所需的平移"],
  [
    "Changing the single value $f(a)$ cannot remove a jump, since the two one-sided limits stay different. To close it, one whole piece must move: adding a constant to the right-hand formula shifts its limit at $a$, and the needed constant is the left limit minus the right limit.\n\nFor example, for $f(x) = x^{2}$ when $x < 1$ and $f(x) = 2x + 3$ when $x \\ge 1$, the left limit is $1$ and the right limit is $5$. Adding $1 - 5 = -4$ turns the right piece into $2x - 1$, which starts at $1$.\n\nCheck: after the shift, $f(0.99) = 0.9801$ and $f(1.01) = 1.02$, both close to $1$.\n\n> **Watch out.** The constant is the left limit minus the right limit. Adding the right limit minus the left limit doubles the jump instead of closing it.",
    "只改变 $f(a)$ 这一个值无法消除跳跃，因为两个单侧极限仍然不同。要消除它，必须移动整段：给右边的表达式加一个常数会平移它在 $a$ 处的极限，所需的常数等于左极限减右极限。\n\n例如，对于 $x < 1$ 时 $f(x) = x^{2}$、$x \\ge 1$ 时 $f(x) = 2x + 3$，左极限是 $1$，右极限是 $5$。加上 $1 - 5 = -4$，右段变为 $2x - 1$，它从 $1$ 开始。\n\n检验：平移后 $f(0.99) = 0.9801$，$f(1.01) = 1.02$，都接近 $1$。\n\n> **注意。** 常数等于左极限减右极限。加上右极限减左极限会使跳跃加倍，而不是消除它。",
  ],
  (rng) => {
    const a = rng.int(-4, 4);
    const p = rng.int(1, 3);
    const q = rng.int(-6, 6);
    const r = nz(rng, 5);
    const L = a * a * p + q;
    const R = L + nz(rng, 9);
    const s = R - r * a;
    const answer = L - R;
    const f = `\\begin{cases} ${poly([p, "x^{2}"], [q, ""])} & x < ${a} \\\\ ${linear(r, s)} & x \\ge ${a} \\end{cases}`;
    const rows = valueTable(around(a), [["f(x)", (x) => (x < a ? p * x * x + q : r * x + s + answer)]]);
    return ask(
      [
        `Let $f(x) = ${f}$. What constant must be added to the formula for $x \\ge ${a}$ so that $f$ becomes continuous?`,
        `设 $f(x) = ${f}$。给 $x \\ge ${a}$ 时的表达式加上什么常数，才能使 $f$ 连续？`,
      ],
      answer,
      [-answer, L, R],
      walk(
        [
          [
            "Find the one-sided limits",
            "求单侧极限",
            `Substituting $x = ${a}$ into each piece gives the left limit $${L}$ and the right limit $${R}$.`,
            `把 $x = ${a}$ 代入两段，得左极限 $${L}$，右极限 $${R}$。`,
          ],
          [
            "Find the shift",
            "求平移量",
            `The right piece must move from $${R}$ to $${L}$, a shift of $${L} - ${paren(R)} = ${answer}$.`,
            `右段要从 $${R}$ 移到 $${L}$，平移量是 $${L} - ${paren(R)} = ${answer}$。`,
          ],
        ],
        [
          `After adding $${answer}$, the right piece is $${linear(r, s + answer)}$. Evaluate the new $f$ beside $x = ${a}$:\n\n${rows}\n\nBoth sides now close in on $${L}$, so the jump is gone.`,
          `加上 $${answer}$ 后，右段为 $${linear(r, s + answer)}$。计算新的 $f$ 在 $x = ${a}$ 两旁的值：\n\n${rows}\n\n现在两侧都逼近 $${L}$，跳跃消失了。`,
        ],
      ),
    );
  },
);

const coefficientMakingHole = point(
  "the-coefficient-that-makes-a-discontinuity-removable",
  ["The coefficient that makes a discontinuity removable", "使间断点可去的系数"],
  [
    "A zero of the denominator is removable only when the numerator vanishes there too, since otherwise the quotient blows up. So substitute the point into the numerator, set the result to zero, and solve for the unknown coefficient.\n\nFor example, for $\\frac{x^{2} + kx + 6}{(x - 2)(x - 5)}$ at $x = 2$, the numerator gives $4 + 2k + 6 = 0$, so $k = -5$, and the numerator becomes $(x - 2)(x - 3)$.\n\nCheck: with $k = -5$, the quotient at $x = 2.01$ is $\\frac{-0.99}{-2.99} \\approx 0.331$, close to $\\frac{1}{3}$ rather than large.\n\n> **Watch out.** Substitute only the point asked about. Making the numerator vanish at the other zero of the denominator gives a different $k$.",
    "分母的零点只有在分子也为零时才可去，否则商会趋于无穷。所以把该点代入分子，令结果为零，再解出未知系数。\n\n例如，对于 $\\frac{x^{2} + kx + 6}{(x - 2)(x - 5)}$ 在 $x = 2$ 处，分子给出 $4 + 2k + 6 = 0$，所以 $k = -5$，分子变为 $(x - 2)(x - 3)$。\n\n检验：取 $k = -5$，商在 $x = 2.01$ 处为 $\\frac{-0.99}{-2.99} \\approx 0.331$，接近 $\\frac{1}{3}$，而不是很大。\n\n> **注意。** 只代入题目所问的那个点。令分子在分母的另一个零点处为零，会得到另一个 $k$。",
  ],
  (rng) => {
    const a = nz(rng, 5);
    const b = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6].filter((x) => x !== a));
    const m = nz(rng, 12);
    const answer = Q.of(-(a * a + m), a);
    const k = answer.toNumber();
    const limit = (a - m / a) / (a - b);
    const rows = valueTable(around(a), [["f(x)", (x) => (x * x + k * x + m) / ((x - a) * (x - b))]]);
    return ask(
      [
        `For which $k$ is the discontinuity of $f(x) = \\frac{x^{2} + kx${tail(m)}}{(${minus(a)})(${minus(b)})}$ at $x = ${a}$ removable?`,
        `$k$ 取何值时，$f(x) = \\frac{x^{2} + kx${tail(m)}}{(${minus(a)})(${minus(b)})}$ 在 $x = ${a}$ 处的间断点可去？`,
      ],
      answer,
      [Q.of(a * a + m, a), Q.of(-m, a), Q.of(-(b * b + m), b), Q.of(-(a * a - m), a)],
      walk(
        [
          [
            "Make the numerator vanish",
            "令分子为零",
            `The discontinuity is removable only if the numerator is $0$ at $x = ${a}$: $${poly([a * a, ""], [a, "k"], [m, ""])} = 0$.`,
            `只有分子在 $x = ${a}$ 处为 $0$ 时间断点才可去：$${poly([a * a, ""], [a, "k"], [m, ""])} = 0$。`,
          ],
          ["Solve", "求解", `Solving for $k$ gives $k = ${answer.toLatex()}$.`, `解得 $k = ${answer.toLatex()}$。`],
        ],
        [
          `With $k = ${answer.toLatex()}$, evaluate $f$ beside $x = ${a}$:\n\n${rows}\n\nThe values settle near $${num(limit)}$ instead of growing without bound, so the discontinuity at $x = ${a}$ is a hole that can be removed.`,
          `取 $k = ${answer.toLatex()}$，计算 $f$ 在 $x = ${a}$ 两旁的值：\n\n${rows}\n\n这些值稳定在 $${num(limit)}$ 附近，而不是无界增大，所以 $x = ${a}$ 处的间断点是可以消除的洞。`,
        ],
      ),
    );
  },
);

const hyperbolicSlopeAtZero = {
  ...point(
    "the-slope-of-a-hyperbolic-combination-at-zero",
    ["The slope of a hyperbolic combination at zero", "双曲函数组合在零处的斜率"],
    [
      "At $x = 0$, $\\sinh 0 = 0$, $\\cosh 0 = \\operatorname{sech} 0 = 1$ and $\\tanh 0 = 0$. So the derivatives there are $\\cosh 0 = 1$ for $\\sinh$, $\\operatorname{sech}^{2} 0 = 1$ for $\\tanh$, and $0$ for both $\\cosh$ and $\\operatorname{sech}$, whose graphs have a horizontal tangent at $0$.\n\nFor example, $f(x) = 2\\operatorname{sech} x + 3\\tanh x - \\sinh x + 4\\cosh x$ has $f'(0) = 3 - 1 = 2$.\n\nCheck: $\\frac{f(0.01) - f(0)}{0.01} \\approx 2.010$ and $\\frac{f(-0.01) - f(0)}{-0.01} \\approx 1.990$, whose average is $2$.\n\n> **Watch out.** $\\cosh 0$ and $\\operatorname{sech} 0$ are $1$, but their slopes at $0$ are $0$. Do not confuse the value of a function with its slope.",
      "在 $x = 0$ 处，$\\sinh 0 = 0$，$\\cosh 0 = \\operatorname{sech} 0 = 1$，$\\tanh 0 = 0$。所以此处 $\\sinh$ 的导数是 $\\cosh 0 = 1$，$\\tanh$ 的导数是 $\\operatorname{sech}^{2} 0 = 1$，而 $\\cosh$ 和 $\\operatorname{sech}$ 的导数都是 $0$，它们的图像在 $0$ 处有水平切线。\n\n例如 $f(x) = 2\\operatorname{sech} x + 3\\tanh x - \\sinh x + 4\\cosh x$ 有 $f'(0) = 3 - 1 = 2$。\n\n检验：$\\frac{f(0.01) - f(0)}{0.01} \\approx 2.010$，$\\frac{f(-0.01) - f(0)}{-0.01} \\approx 1.990$，平均值为 $2$。\n\n> **注意。** $\\cosh 0$ 和 $\\operatorname{sech} 0$ 的值是 $1$，但它们在 $0$ 处的斜率是 $0$。不要把函数值和斜率混为一谈。",
    ],
    (rng) => {
      const a = nz(rng, 9);
      const b = nz(rng, 9);
      const c = nz(rng, 9);
      const d = nz(rng, 9);
      const f = poly([a, "\\operatorname{sech} x"], [b, "\\tanh x"], [c, "\\sinh x"], [d, "\\cosh x"]);
      const answer = b + c;
      const value = (x: number) => a / Math.cosh(x) + b * Math.tanh(x) + c * Math.sinh(x) + d * Math.cosh(x);
      const dq = (s: number) => (value(s) - value(0)) / s;
      const quotients = table(["$h$", "$0.01$", "$-0.01$"], ["$\\frac{f(h) - f(0)}{h}$", `$${num(dq(0.01))}$`, `$${num(dq(-0.01))}$`]);
      const derivative = poly([-a, "\\operatorname{sech} x\\tanh x"], [b, "\\operatorname{sech}^{2}x"], [c, "\\cosh x"], [d, "\\sinh x"]);
      return ask(
        [`Let $f(x) = ${f}$. Find $f'(0)$.`, `设 $f(x) = ${f}$。求 $f'(0)$。`],
        answer,
        [a + d, a + b + c + d, b + c - a, b - c],
        walk(
          [
            ["Differentiate", "求导", `Term by term,\n\n$$f'(x) = ${derivative}.$$`, `逐项求导，\n\n$$f'(x) = ${derivative}.$$`],
            [
              "Substitute x = 0",
              "代入 x = 0",
              `At $0$, $\\tanh 0 = \\sinh 0 = 0$ and $\\operatorname{sech} 0 = \\cosh 0 = 1$. The first and last terms vanish, which leaves $${paren(b)} + ${paren(c)} = ${answer}$.`,
              `在 $0$ 处 $\\tanh 0 = \\sinh 0 = 0$，$\\operatorname{sech} 0 = \\cosh 0 = 1$。第一项和最后一项为零，剩下 $${paren(b)} + ${paren(c)} = ${answer}$。`,
            ],
          ],
          [
            `Compute difference quotients of $f$ at $0$, with $h = 0.01$ on each side:\n\n${quotients}\n\nTheir average is $${num((dq(0.01) + dq(-0.01)) / 2)}$, which matches $${answer}$.`,
            `计算 $f$ 在 $0$ 处的差商，两侧各取 $h = 0.01$：\n\n${quotients}\n\n它们的平均值是 $${num((dq(0.01) + dq(-0.01)) / 2)}$，与 $${answer}$ 相符。`,
          ],
        ),
      );
    },
  ),
  figure: calculusDrawings2["differentiating-reciprocal-hyperbolic-functions#the-slope-of-a-hyperbolic-combination-at-zero"],
};

const quotientFromSegment = point(
  "derivatives-of-quotients-from-a-segment",
  ["Derivatives of quotients from a segment", "由线段求商的导数"],
  [
    "On a line segment the slope gives $f'$, and the point on the segment gives $f$. Those two values go into the quotient rule, where the order in the numerator matters:\n\n$$\\left(\\frac{f}{g}\\right)' = \\frac{f'g - fg'}{g^{2}}.$$\n\nFor example, if near $x = 2$ the graph of $f$ is a segment of slope $3$ through $(2, 1)$, then $h(x) = \\frac{f(x)}{x}$ has $h'(2) = \\frac{3 \\cdot 2 - 1 \\cdot 1}{4}$, which is $\\frac{5}{4}$.\n\nCheck: near $2$, $f(x) = 1 + 3(x - 2)$, and $\\frac{h(2.01) - h(2)}{0.01} \\approx 1.244$, close to $1.25$.\n\n> **Watch out.** The numerator is $f'g - fg'$, in that order. For $g(x) = x$, $g' = 1$ and $g(a) = a$.",
    "在线段上，斜率给出 $f'$，线段上的点给出 $f$。把这两个值代入商法则，分子的顺序不能颠倒：\n\n$$\\left(\\frac{f}{g}\\right)' = \\frac{f'g - fg'}{g^{2}}.$$\n\n例如，若在 $x = 2$ 附近 $f$ 的图像是过 $(2, 1)$、斜率为 $3$ 的线段，则 $h(x) = \\frac{f(x)}{x}$ 有 $h'(2) = \\frac{3 \\cdot 2 - 1 \\cdot 1}{4}$，即 $\\frac{5}{4}$。\n\n检验：在 $2$ 附近 $f(x) = 1 + 3(x - 2)$，而 $\\frac{h(2.01) - h(2)}{0.01} \\approx 1.244$，接近 $1.25$。\n\n> **注意。** 分子是 $f'g - fg'$，顺序不能变。对 $g(x) = x$，$g' = 1$，$g(a) = a$。",
  ],
  (rng) => {
    const a = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
    const m = nz(rng, 4);
    const v = rng.int(-6, 6);
    const answer = Q.of(m * a - v, a * a);
    const H = (x: number) => (v + m * (x - a)) / x;
    const dq = (s: number) => (H(a + s) - H(a)) / s;
    const quotients = table(
      ["$s$", "$0.01$", "$-0.01$"],
      [`$\\frac{H(${a} + s) - H(${a})}{s}$`, `$${num(dq(0.01))}$`, `$${num(dq(-0.01))}$`],
    );
    return ask(
      [
        `Near $x = ${a}$, the graph of $f$ is the line segment from $(${a - 1}, ${v - m})$ to $(${a + 1}, ${v + m})$. Let $h(x) = \\frac{f(x)}{x}$. Find $h'(${a})$.`,
        `在 $x = ${a}$ 附近，$f$ 的图像是从 $(${a - 1}, ${v - m})$ 到 $(${a + 1}, ${v + m})$ 的线段。设 $h(x) = \\frac{f(x)}{x}$。求 $h'(${a})$。`,
      ],
      answer,
      [Q.of(v - m * a, a * a), Q.of(m, 1), Q.of(m * a + v, a * a)],
      walk(
        [
          [
            "Read the segment",
            "读线段",
            `The slope gives $f'(${a}) = \\frac{${v + m} - ${paren(v - m)}}{2} = ${m}$, and the midpoint gives $f(${a}) = ${v}$.`,
            `斜率给出 $f'(${a}) = \\frac{${v + m} - ${paren(v - m)}}{2} = ${m}$，中点给出 $f(${a}) = ${v}$。`,
          ],
          [
            "Apply the quotient rule",
            "使用商法则",
            `With $g(x) = x$,\n\n$$h'(${a}) = \\frac{${paren(m)} \\cdot ${paren(a)} - ${paren(v)} \\cdot 1}{${paren(a)}^{2}} = ${answer.toLatex()}.$$`,
            `取 $g(x) = x$，\n\n$$h'(${a}) = \\frac{${paren(m)} \\cdot ${paren(a)} - ${paren(v)} \\cdot 1}{${paren(a)}^{2}} = ${answer.toLatex()}.$$`,
          ],
        ],
        [
          `Near $x = ${a}$, $f$ is the line $${poly([v, ""], [m, `(x ${a < 0 ? "+" : "-"} ${Math.abs(a)})`]) || "0"}$, so $H(x)$, that line divided by $x$, equals $h$ there. Its difference quotients:\n\n${quotients}\n\nTheir average is $${num((dq(0.01) + dq(-0.01)) / 2)}$, close to $${answer.toLatex()}${approx(answer)}$.`,
          `在 $x = ${a}$ 附近，$f$ 就是直线 $${poly([v, ""], [m, `(x ${a < 0 ? "+" : "-"} ${Math.abs(a)})`]) || "0"}$，所以这条直线除以 $x$ 得到的 $H(x)$ 在那里等于 $h$。它的差商：\n\n${quotients}\n\n它们的平均值是 $${num((dq(0.01) + dq(-0.01)) / 2)}$，接近 $${answer.toLatex()}${approx(answer)}$。`,
        ],
      ),
    );
  },
);

const composeFromTable = point(
  "a-composition-of-two-functions-from-a-table",
  ["A composition of two functions from a table", "由表格求两个函数的复合"],
  [
    "For $h(x) = f(g(x))$, $h'(a) = f'(g(a)) \\cdot g'(a)$. The outer derivative is read at the inner value $g(a)$, which is usually in a different row of the table. The inner derivative is read at $a$ itself.\n\nFor example, if $g(0) = 3$, $g'(0) = 2$ and $f'(3) = -1$, then $h'(0) = f'(3) \\cdot g'(0) = (-1) \\cdot 2 = -2$.\n\nCheck: $g(x) = 2x + 3$ and $f(x) = -x$ have these values, and $f(g(x)) = -2x - 3$, whose slope is $-2$.\n\n> **Watch out.** Do not read $f'$ in the row of $a$. Go to the row of $g(a)$ for $f'$, and use the slope $f'$ there, not the value $f$.",
    "对 $h(x) = f(g(x))$，有 $h'(a) = f'(g(a)) \\cdot g'(a)$。外层导数要在内层的值 $g(a)$ 处读取，它通常在表格的另一行。内层导数则在 $a$ 处读取。\n\n例如，若 $g(0) = 3$，$g'(0) = 2$，$f'(3) = -1$，则 $h'(0) = f'(3) \\cdot g'(0) = (-1) \\cdot 2 = -2$。\n\n检验：$g(x) = 2x + 3$ 和 $f(x) = -x$ 符合这些值，而 $f(g(x)) = -2x - 3$，斜率是 $-2$。\n\n> **注意。** 不要在 $a$ 那一行读 $f'$。要到 $g(a)$ 那一行去读 $f'$，并且用那里的斜率 $f'$，不是函数值 $f$。",
  ],
  (rng) => {
    const a = rng.int(0, 3);
    const inner = rng.pick([0, 1, 2, 3, 4, 5].filter((x) => x !== a));
    const fpa = nz(rng, 6);
    const fpi = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6].filter((x) => x !== fpa));
    const gpa = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
    const gi = rng.int(-5, 5);
    const gpi = nz(rng, 5);
    const fa = rng.int(-5, 5);
    const fi = rng.int(-5, 5);
    const answer = fpi * gpa;
    const swap = rng.bool();
    const rows = swap ? [inner, a] : [a, inner];
    const rowOf = (x: number) =>
      x === a ? `| $${x}$ | $${fa}$ | $${fpa}$ | $${inner}$ | $${gpa}$ |` : `| $${x}$ | $${fi}$ | $${fpi}$ | $${gi}$ | $${gpi}$ |`;
    const table = `| $x$ | $f(x)$ | $f'(x)$ | $g(x)$ | $g'(x)$ |\n| :---: | :---: | :---: | :---: | :---: |\n${rows.map(rowOf).join("\n")}`;
    const seen = new Set<number>([answer]);
    const mistakes = [
      why(
        fpa * gpa,
        `This reads $f'$ in the row $x = ${a}$. The outer derivative belongs at $g(${a}) = ${inner}$.`,
        `这是在 $x = ${a}$ 那一行读的 $f'$。外层导数应在 $g(${a}) = ${inner}$ 处读取。`,
      ),
      why(
        fpi,
        `This is $f'(${inner})$ alone; it leaves out the factor $g'(${a}) = ${gpa}$.`,
        `这只是 $f'(${inner})$；漏掉了因子 $g'(${a}) = ${gpa}$。`,
      ),
      why(
        fpi * gi,
        `This multiplies by $g(${inner}) = ${gi}$ from the row $x = ${inner}$. The inner factor is the slope $g'(${a}) = ${gpa}$.`,
        `这乘的是 $x = ${inner}$ 那一行的 $g(${inner}) = ${gi}$。内层的因子是斜率 $g'(${a}) = ${gpa}$。`,
      ),
      why(
        fi * gpa,
        `This uses the value $f(${inner}) = ${fi}$ instead of the slope $f'(${inner}) = ${fpi}$.`,
        `这用的是函数值 $f(${inner}) = ${fi}$，而不是斜率 $f'(${inner}) = ${fpi}$。`,
      ),
    ].filter((w) => {
      const v = Number(w.value);
      return !seen.has(v) && Boolean(seen.add(v));
    });
    const [solutionEn, solutionZh] = walk(
      [
        [
          "Find the inner value",
          "求内层的值",
          `In the row $x = ${a}$, $g(${a}) = ${inner}$ and $g'(${a}) = ${gpa}$.`,
          `在 $x = ${a}$ 那一行，$g(${a}) = ${inner}$，$g'(${a}) = ${gpa}$。`,
        ],
        [
          "Read the outer derivative there",
          "在该处读外层导数",
          `In the row $x = ${inner}$, $f'(${inner}) = ${fpi}$.`,
          `在 $x = ${inner}$ 那一行，$f'(${inner}) = ${fpi}$。`,
        ],
        [
          "Multiply",
          "相乘",
          `$h'(${a}) = f'(${inner}) \\cdot g'(${a}) = ${paren(fpi)} \\cdot ${paren(gpa)} = ${answer}$.`,
          `$h'(${a}) = f'(${inner}) \\cdot g'(${a}) = ${paren(fpi)} \\cdot ${paren(gpa)} = ${answer}$。`,
        ],
      ],
      [
        `Follow a small step. When $x$ moves from $${a}$ by $0.01$, $g$ moves from $${inner}$ by about $${paren(gpa)} \\cdot 0.01 = ${num(gpa * 0.01)}$, and then $f$ moves by about $${fpi}$ times that, $${num(answer * 0.01)}$. Dividing by $0.01$ gives $${answer}$ again.`,
        `跟着一小步走。当 $x$ 从 $${a}$ 移动 $0.01$ 时，$g$ 从 $${inner}$ 大约移动 $${paren(gpa)} \\cdot 0.01 = ${num(gpa * 0.01)}$，$f$ 再大约移动它的 $${fpi}$ 倍，即 $${num(answer * 0.01)}$。除以 $0.01$，又得到 $${answer}$。`,
      ],
    );
    return numberProblem({
      prompt: t(
        `The table gives values of $f$, $g$ and their derivatives.\n\n${table}\n\nLet $h(x) = f(g(x))$. Find $h'(${a})$.`,
        `表中给出 $f$、$g$ 及其导数的值。\n\n${table}\n\n设 $h(x) = f(g(x))$。求 $h'(${a})$。`,
      ),
      answer,
      mistakes,
      solution: t(solutionEn, solutionZh),
    });
  },
);

const inverseReciprocalTrigInner = point(
  "inverse-reciprocal-trigonometric-functions-of-a-multiple-of-x",
  ["Inverse reciprocal functions of a multiple of $x$", "$x$ 的倍数的反倒数三角函数"],
  [
    "With the chain rule, the inner $k$ multiplies the outer derivative. For $\\operatorname{arcsec}(kx)$ with $x > 0$ it cancels against the $k$ in front of the root, and for $\\operatorname{arccot}(kx)$ it stays:\n\n$$\\frac{d}{dx}\\operatorname{arcsec}(kx) = \\frac{k}{kx\\sqrt{k^{2}x^{2} - 1}} = \\frac{1}{x\\sqrt{k^{2}x^{2} - 1}}, \\qquad \\frac{d}{dx}\\operatorname{arccot}(kx) = -\\frac{k}{1 + k^{2}x^{2}}.$$\n\nFor example, the slope of $\\operatorname{arcsec}(2x)$ at $x = 1$ is $\\frac{1}{\\sqrt{3}}$, about $0.577$.\n\nCheck: $\\operatorname{arcsec}(2x) = \\arccos\\frac{1}{2x}$, and its difference quotients at $1$ with $h = 0.01$ and $h = -0.01$ are about $0.571$ and $0.584$, on either side of $0.577$.\n\n> **Watch out.** In $\\operatorname{arcsec}(kx)$ the factor $k$ appears twice, once from the chain rule and once in $|kx|$, so it cancels. Multiplying by $k$ without cancelling gives an answer $k$ times too big.",
    "用链式法则时，内层的 $k$ 要乘到外层导数上。对 $x > 0$ 时的 $\\operatorname{arcsec}(kx)$，它与根号前的 $k$ 约去；对 $\\operatorname{arccot}(kx)$，它留在分子：\n\n$$\\frac{d}{dx}\\operatorname{arcsec}(kx) = \\frac{k}{kx\\sqrt{k^{2}x^{2} - 1}} = \\frac{1}{x\\sqrt{k^{2}x^{2} - 1}}, \\qquad \\frac{d}{dx}\\operatorname{arccot}(kx) = -\\frac{k}{1 + k^{2}x^{2}}.$$\n\n例如 $\\operatorname{arcsec}(2x)$ 在 $x = 1$ 处的斜率是 $\\frac{1}{\\sqrt{3}}$，约为 $0.577$。\n\n检验：$\\operatorname{arcsec}(2x) = \\arccos\\frac{1}{2x}$，它在 $1$ 处取 $h = 0.01$ 和 $h = -0.01$ 的差商约为 $0.571$ 和 $0.584$，位于 $0.577$ 的两侧。\n\n> **注意。** 在 $\\operatorname{arcsec}(kx)$ 中，因子 $k$ 出现两次，一次来自链式法则，一次在 $|kx|$ 中，所以会约去。乘了 $k$ 却不约分，答案就大了 $k$ 倍。",
  ],
  (rng) => {
    const k = rng.int(2, 4);
    const c = rng.pick([1, 2, 3, 4, 5, 6, 7, 8, 9, -1, -2, -3]);
    const kind = rng.pick(["arcsec", "arccsc", "arccot"] as const);
    const sign = kind === "arcsec" ? c : -c;
    const root = `\\sqrt{${k * k}x^{2} - 1}`;
    const answer = kind === "arccot" ? `\\frac{${-c * k}}{1 + ${k * k}x^{2}}` : `\\frac{${sign}}{x${root}}`;
    const f = poly([c, `\\operatorname{${kind}}(${k}x)`]);
    const wrong =
      kind === "arccot"
        ? [`\\frac{${-c}}{1 + ${k * k}x^{2}}`, `\\frac{${c * k}}{1 + ${k * k}x^{2}}`, `\\frac{${-c * k}}{1 + ${k}x^{2}}`]
        : [`\\frac{${sign * k}}{x${root}}`, `\\frac{${-sign}}{x${root}}`, `\\frac{${sign}}{x\\sqrt{${k}x^{2} - 1}}`];
    const outer = (u: number) => (kind === "arcsec" ? Math.acos(1 / u) : kind === "arccsc" ? Math.asin(1 / u) : Math.PI / 2 - Math.atan(u));
    const F = (x: number) => c * outer(k * x);
    const quotient = (F(1.001) - F(0.999)) / 0.002;
    const at1 = kind === "arccot" ? (-c * k) / (1 + k * k) : sign / Math.sqrt(k * k - 1);
    const chain =
      kind === "arccot"
        ? `f'(x) = ${c} \\cdot \\frac{-1}{1 + (${k}x)^{2}} \\cdot ${k} = ${answer}`
        : `f'(x) = ${c} \\cdot \\frac{${kind === "arcsec" ? 1 : -1}}{${k}x\\sqrt{(${k}x)^{2} - 1}} \\cdot ${k} = ${answer}`;
    return functionProblem({
      prompt: t(
        `Find $f'(x)$ for $f(x) = ${f}$, with $x > ${Q.of(1, k).toLatex()}$.`,
        `设 $f(x) = ${f}$，其中 $x > ${Q.of(1, k).toLatex()}$。求 $f'(x)$。`,
      ),
      answer,
      positive: true,
      prefix: "f'(x) =",
      wrong,
      solution: t(
        ...walk(
          [
            [
              "Name the inner function",
              "找出内层函数",
              `The outer function is $\\operatorname{${kind}} u$ with $u = ${k}x$, so $u' = ${k}$${kind === "arccot" ? "" : `, and $|u| = ${k}x$ because $x > 0$`}.`,
              `外层函数是 $\\operatorname{${kind}} u$，其中 $u = ${k}x$，所以 $u' = ${k}$${kind === "arccot" ? "" : `；由于 $x > 0$，$|u| = ${k}x$`}。`,
            ],
            [
              "Apply the chain rule",
              "用链式法则",
              kind === "arccot"
                ? `Multiply the outer derivative by $${k}$, which stays in the numerator:\n\n$$${chain}.$$`
                : `Multiply the outer derivative by $${k}$; the factor $${k}$ cancels against the $${k}x$ in front of the root:\n\n$$${chain}.$$`,
              kind === "arccot"
                ? `把外层导数乘以 $${k}$，它留在分子：\n\n$$${chain}.$$`
                : `把外层导数乘以 $${k}$；因子 $${k}$ 与根号前的 $${k}x$ 约去：\n\n$$${chain}.$$`,
            ],
          ],
          [
            `At $x = 1$ the answer is about $${num(at1)}$, and the difference quotient of $f$ from $x = 0.999$ to $x = 1.001$ is about $${num(quotient)}$.`,
            `在 $x = 1$ 处，答案约为 $${num(at1)}$，而 $f$ 从 $x = 0.999$ 到 $x = 1.001$ 的差商约为 $${num(quotient)}$。`,
          ],
        ),
      ),
    });
  },
);

const inverseHyperbolicValues = point(
  "exact-values-of-inverse-hyperbolic-derivatives",
  ["Exact values of inverse hyperbolic derivatives", "反双曲函数导数的精确值"],
  [
    "The three formulas look alike, so keep the signs inside apart:\n\n$$\\operatorname{arsinh}'(x) = \\frac{1}{\\sqrt{x^{2} + 1}}, \\quad \\operatorname{arcosh}'(x) = \\frac{1}{\\sqrt{x^{2} - 1}} \\ (x > 1), \\quad \\operatorname{artanh}'(x) = \\frac{1}{1 - x^{2}} \\ (|x| < 1).$$\n\nFractions from Pythagorean triples give exact values. For example, at $x = \\frac{3}{4}$ the root $\\sqrt{\\frac{9}{16} + 1}$ is $\\frac{5}{4}$, so $\\operatorname{arsinh}'\\left(\\frac{3}{4}\\right)$ is $\\frac{4}{5}$.\n\nCheck: the difference quotients of $\\operatorname{arsinh} x$ at $0.75$ with $h = 0.01$ and $h = -0.01$ are about $0.798$ and $0.802$, on either side of $0.8$.\n\n> **Watch out.** $\\operatorname{arsinh}$ has $x^{2} + 1$ under the root and $\\operatorname{arcosh}$ has $x^{2} - 1$, while $\\operatorname{artanh}$ has $1 - x^{2}$ and no root at all.",
    "三个公式很相似，要分清其中的符号：\n\n$$\\operatorname{arsinh}'(x) = \\frac{1}{\\sqrt{x^{2} + 1}}, \\quad \\operatorname{arcosh}'(x) = \\frac{1}{\\sqrt{x^{2} - 1}} \\ (x > 1), \\quad \\operatorname{artanh}'(x) = \\frac{1}{1 - x^{2}} \\ (|x| < 1).$$\n\n由勾股数构成的分数能给出精确值。例如在 $x = \\frac{3}{4}$ 处，根式 $\\sqrt{\\frac{9}{16} + 1}$ 等于 $\\frac{5}{4}$，所以 $\\operatorname{arsinh}'\\left(\\frac{3}{4}\\right)$ 等于 $\\frac{4}{5}$。\n\n检验：$\\operatorname{arsinh} x$ 在 $0.75$ 处取 $h = 0.01$ 和 $h = -0.01$ 的差商约为 $0.798$ 和 $0.802$，位于 $0.8$ 的两侧。\n\n> **注意。** $\\operatorname{arsinh}$ 的根号内是 $x^{2} + 1$，$\\operatorname{arcosh}$ 的是 $x^{2} - 1$，而 $\\operatorname{artanh}$ 是 $1 - x^{2}$，根本没有根号。",
  ],
  (rng) => {
    const [p, q, h] = rng.pick([
      [3, 4, 5],
      [4, 3, 5],
      [5, 12, 13],
      [12, 5, 13],
      [8, 15, 17],
      [15, 8, 17],
      [7, 24, 25],
    ] as const);
    const c = nz(rng, 6);
    const kind = rng.pick(["arsinh", "arcosh", "artanh"] as const);
    const x = kind === "arsinh" ? Q.of(p, q) : kind === "arcosh" ? Q.of(h, q) : Q.of(p, h);
    const x2 = x.mul(x);
    const root = kind === "arsinh" ? Q.of(h, q) : kind === "arcosh" ? Q.of(p, q) : undefined;
    const value = root ? Q.one.div(root) : Q.one.div(Q.one.sub(x2));
    const answer = value.mul(Q.of(c));
    const other = kind === "arsinh" ? Q.one.div(Q.one.add(x2)) : kind === "arcosh" ? Q.one.div(x2.sub(Q.one)) : Q.one.div(Q.one.add(x2));
    const v = x.toLatex();
    const formula =
      kind === "arsinh"
        ? `\\frac{1}{\\sqrt{${v}^{2} + 1}}`
        : kind === "arcosh"
          ? `\\frac{1}{\\sqrt{${v}^{2} - 1}}`
          : `\\frac{1}{1 - ${v}^{2}}`;
    const display = formula.replace(`${v}^{2}`, `\\left(${v}\\right)^{2}`);
    const general =
      kind === "arsinh" ? "\\frac{1}{\\sqrt{x^{2} + 1}}" : kind === "arcosh" ? "\\frac{1}{\\sqrt{x^{2} - 1}}" : "\\frac{1}{1 - x^{2}}";
    const domain: Pair =
      kind === "arsinh"
        ? ["defined for every $x$", "对所有 $x$ 都有定义"]
        : kind === "arcosh"
          ? [`defined here since $${v} > 1$`, `由于 $${v} > 1$，在这里有定义`]
          : [`defined here since $${v} < 1$`, `由于 $${v} < 1$，在这里有定义`];
    const F = (t: number) => c * (kind === "arsinh" ? Math.asinh(t) : kind === "arcosh" ? Math.acosh(t) : Math.atanh(t));
    const x0 = x.toNumber();
    const quotient = (F(x0 + 0.001) - F(x0 - 0.001)) / 0.002;
    return ask(
      [
        `Let $f(x) = ${poly([c, `\\operatorname{${kind}} x`])}$. Find $f'\\left(${v}\\right)$.`,
        `设 $f(x) = ${poly([c, `\\operatorname{${kind}} x`])}$。求 $f'\\left(${v}\\right)$。`,
      ],
      answer,
      [other.mul(Q.of(c)), value, answer.neg(), Q.one.div(x).mul(Q.of(c))],
      walk(
        [
          [
            "Write the derivative",
            "写出导数",
            `The derivative of $\\operatorname{${kind}} x$ is $${general}$, ${domain[0]}, so $f'(x)$ is $${c}$ times it.`,
            `$\\operatorname{${kind}} x$ 的导数是 $${general}$，${domain[1]}，所以 $f'(x)$ 是它的 $${c}$ 倍。`,
          ],
          [
            "Substitute and simplify",
            "代入并化简",
            `At $x = ${v}$ the Pythagorean triple $${p}, ${q}, ${h}$ makes the value exact:\n\n$$\\operatorname{${kind}}'\\left(${v}\\right) = ${display} = ${value.toLatex()}.$$\n\nMultiplying by $${c}$ gives $${answer.toLatex()}$.`,
            `在 $x = ${v}$ 处，勾股数 $${p}, ${q}, ${h}$ 使数值精确：\n\n$$\\operatorname{${kind}}'\\left(${v}\\right) = ${display} = ${value.toLatex()}.$$\n\n乘以 $${c}$ 得 $${answer.toLatex()}$。`,
          ],
        ],
        [
          `The difference quotient of $f$ over $x = ${v} \\pm 0.001$ is about $${num(quotient)}$, which agrees with $${answer.toLatex()}${approx(answer)}$.`,
          `$f$ 在 $x = ${v} \\pm 0.001$ 之间的差商约为 $${num(quotient)}$，与 $${answer.toLatex()}${approx(answer)}$ 相符。`,
        ],
      ),
    );
  },
);

const reciprocalHyperbolicInner = point(
  "inverse-reciprocal-hyperbolic-functions-of-a-scaled-variable",
  ["Inverse reciprocal hyperbolic functions of a scaled variable", "缩放变量的反倒数双曲函数"],
  [
    "With the chain rule, a scale inside changes the result. For $x > 0$ the $k$ cancels in $\\operatorname{arcsch}(kx)$, while $\\operatorname{arcoth}(kx)$ keeps it:\n\n$$\\frac{d}{dx}\\operatorname{arcsch}(kx) = -\\frac{1}{x\\sqrt{1 + k^{2}x^{2}}}, \\qquad \\frac{d}{dx}\\operatorname{arcoth}(kx) = \\frac{k}{1 - k^{2}x^{2}}, \\qquad \\frac{d}{dx}\\operatorname{arsech}\\frac{x}{k} = -\\frac{k}{x\\sqrt{k^{2} - x^{2}}}.$$\n\nFor example, the slope of $\\operatorname{arcsch}(2x)$ at $x = 1$ is $-\\frac{1}{\\sqrt{5}}$, about $-0.447$.\n\nCheck: $\\operatorname{arcsch}(2x) = \\operatorname{arsinh}\\frac{1}{2x}$, and its difference quotients at $1$ with $h = 0.01$ and $h = -0.01$ are about $-0.443$ and $-0.451$, on either side of $-0.447$.\n\n> **Watch out.** Multiply by the inner derivative and then simplify: in $\\operatorname{arcsch}(kx)$ the $k$ from the chain rule cancels the $k$ in $|kx|$, but in $\\operatorname{arcoth}(kx)$ nothing cancels it.",
    "用链式法则时，内部的缩放会改变结果。对 $x > 0$，$\\operatorname{arcsch}(kx)$ 中的 $k$ 约去了，而 $\\operatorname{arcoth}(kx)$ 保留 $k$：\n\n$$\\frac{d}{dx}\\operatorname{arcsch}(kx) = -\\frac{1}{x\\sqrt{1 + k^{2}x^{2}}}, \\qquad \\frac{d}{dx}\\operatorname{arcoth}(kx) = \\frac{k}{1 - k^{2}x^{2}}, \\qquad \\frac{d}{dx}\\operatorname{arsech}\\frac{x}{k} = -\\frac{k}{x\\sqrt{k^{2} - x^{2}}}.$$\n\n例如 $\\operatorname{arcsch}(2x)$ 在 $x = 1$ 处的斜率是 $-\\frac{1}{\\sqrt{5}}$，约为 $-0.447$。\n\n检验：$\\operatorname{arcsch}(2x) = \\operatorname{arsinh}\\frac{1}{2x}$，它在 $1$ 处取 $h = 0.01$ 和 $h = -0.01$ 的差商约为 $-0.443$ 和 $-0.451$，位于 $-0.447$ 的两侧。\n\n> **注意。** 先乘以内层的导数再化简：在 $\\operatorname{arcsch}(kx)$ 中，链式法则带来的 $k$ 与 $|kx|$ 中的 $k$ 约去，而在 $\\operatorname{arcoth}(kx)$ 中没有东西能约去它。",
  ],
  (rng) => {
    const kind = rng.pick(["arsech", "arcsch", "arcoth"] as const);
    const c = rng.pick([1, 2, 3, 4, 5, 6, 7, -1, -2, -3, -4]);
    const k = kind === "arsech" ? rng.int(4, 7) : rng.int(2, 6);
    const inner = kind === "arsech" ? `\\frac{x}{${k}}` : `${k}x`;
    const f = poly([c, `\\operatorname{${kind}}\\left(${inner}\\right)`]);
    const answer =
      kind === "arsech"
        ? `\\frac{${-c * k}}{x\\sqrt{${k * k} - x^{2}}}`
        : kind === "arcsch"
          ? `\\frac{${-c}}{x\\sqrt{1 + ${k * k}x^{2}}}`
          : `\\frac{${c * k}}{1 - ${k * k}x^{2}}`;
    const wrong =
      kind === "arsech"
        ? [`\\frac{${c * k}}{x\\sqrt{${k * k} - x^{2}}}`, `\\frac{${-c}}{x\\sqrt{${k * k} - x^{2}}}`]
        : kind === "arcsch"
          ? [`\\frac{${c}}{x\\sqrt{1 + ${k * k}x^{2}}}`, `\\frac{${-c * k}}{x\\sqrt{1 + ${k * k}x^{2}}}`]
          : [`\\frac{${c}}{1 - ${k * k}x^{2}}`, `\\frac{${c * k}}{${k * k}x^{2} + 1}`];
    const range = kind === "arsech" ? `0 < x < ${k}` : kind === "arcsch" ? "x > 0" : `x > ${Q.of(1, k).toLatex()}`;
    const du = kind === "arsech" ? `\\frac{1}{${k}}` : `${k}`;
    const rule =
      kind === "arsech"
        ? "-\\frac{1}{u\\sqrt{1 - u^{2}}}"
        : kind === "arcsch"
          ? "-\\frac{1}{|u|\\sqrt{1 + u^{2}}}"
          : "\\frac{1}{1 - u^{2}}";
    const chain =
      kind === "arsech"
        ? `${c} \\cdot \\frac{-1}{\\frac{x}{${k}}\\sqrt{1 - \\frac{x^{2}}{${k * k}}}} \\cdot \\frac{1}{${k}} = ${answer}`
        : kind === "arcsch"
          ? `${c} \\cdot \\frac{-1}{${k}x\\sqrt{1 + ${k * k}x^{2}}} \\cdot ${k} = ${answer}`
          : `${c} \\cdot \\frac{1}{1 - ${k * k}x^{2}} \\cdot ${k} = ${answer}`;
    const outer = (u: number) => (kind === "arsech" ? Math.acosh(1 / u) : kind === "arcsch" ? Math.asinh(1 / u) : Math.atanh(1 / u));
    const F = (x: number) => c * outer(kind === "arsech" ? x / k : k * x);
    const quotient = (F(1.001) - F(0.999)) / 0.002;
    const at1 = kind === "arsech" ? (-c * k) / Math.sqrt(k * k - 1) : kind === "arcsch" ? -c / Math.sqrt(1 + k * k) : (c * k) / (1 - k * k);
    return functionProblem({
      prompt: t(`Find $f'(x)$ for $f(x) = ${f}$, with $${range}$.`, `设 $f(x) = ${f}$，其中 $${range}$。求 $f'(x)$。`),
      answer,
      positive: true,
      prefix: "f'(x) =",
      wrong,
      solution: t(
        ...walk(
          [
            [
              "Name the inner function",
              "找出内层函数",
              `The derivative of $\\operatorname{${kind}} u$ is $${rule}$, with $u = ${inner}$ and $u' = ${du}$.`,
              `$\\operatorname{${kind}} u$ 的导数是 $${rule}$，其中 $u = ${inner}$，$u' = ${du}$。`,
            ],
            [
              "Apply the chain rule and simplify",
              "用链式法则并化简",
              `Put $u$ into the formula, multiply by $u'$ and simplify:\n\n$$f'(x) = ${chain}.$$`,
              `把 $u$ 代入公式，乘以 $u'$ 并化简：\n\n$$f'(x) = ${chain}.$$`,
            ],
          ],
          [
            `At $x = 1$ the answer is about $${num(at1)}$, and the difference quotient of $f$ from $x = 0.999$ to $x = 1.001$ is about $${num(quotient)}$.`,
            `在 $x = 1$ 处，答案约为 $${num(at1)}$，而 $f$ 从 $x = 0.999$ 到 $x = 1.001$ 的差商约为 $${num(quotient)}$。`,
          ],
        ),
      ),
    });
  },
);

/** rateContexts are quantities with units, for estimating from a derivative. */
const rateContexts: readonly { en: string; zh: string; unit: string; unitZh: string; time: string; timeZh: string; falls: boolean }[] = [
  {
    en: "$V(t)$ is the volume of water in a tank",
    zh: "$V(t)$ 是水箱中水的体积",
    unit: "liters",
    unitZh: "升",
    time: "minutes",
    timeZh: "分钟",
    falls: true,
  },
  {
    en: "$P(t)$ is the population of a town",
    zh: "$P(t)$ 是一个城镇的人口",
    unit: "people",
    unitZh: "人",
    time: "years",
    timeZh: "年",
    falls: true,
  },
  {
    en: "$D(t)$ is the distance a train has traveled",
    zh: "$D(t)$ 是火车行驶的路程",
    unit: "kilometers",
    unitZh: "千米",
    time: "hours",
    timeZh: "小时",
    falls: false,
  },
  {
    en: "$S(t)$ is the number of songs a service has sold",
    zh: "$S(t)$ 是一个平台售出的歌曲数",
    unit: "songs",
    unitZh: "首",
    time: "days",
    timeZh: "天",
    falls: false,
  },
];

/** distinctWhys keeps the first reason for each wrong value. */
const distinctWhys = (ms: readonly ReturnType<typeof why>[]) =>
  ms.filter((m, i) => ms.findIndex((n) => toQv(n.value).eq(toQv(m.value))) === i);

/** toQv turns a wrong value into a rational number. */
const toQv = (v: ReturnType<typeof why>["value"]) => (v instanceof Q ? v : Q.of(Number(v)));

const estimateFromDerivative = point(
  "estimating-a-later-value-from-the-derivative",
  ["Estimating a later value from the derivative", "用导数估计之后的值"],
  [
    "A derivative value is a rate, so over a short time it predicts the change: the change in $f$ is about $f'(a) \\cdot h$. To estimate the value at $a + h$, add that change to $f(a)$. The result is an estimate, because the rate may not stay constant.\n\nFor example, if a tank holds $V(3) = 500$ liters and $V'(3) = 40$ liters per minute, then two minutes later it holds about $500 + 40 \\cdot 2 = 580$ liters.\n\nCheck: going from $500$ to $580$ liters in $2$ minutes is an average of $\\frac{80}{2} = 40$ liters per minute, the rate we assumed.\n\n> **Watch out.** Multiply the rate by the time step $h$, not by the time $a$ since the start. A negative rate lowers the value.",
    "导数值是变化率，所以在短时间内可以预测变化量：$f$ 的变化约为 $f'(a) \\cdot h$。要估计 $a + h$ 处的值，把这个变化量加到 $f(a)$ 上。结果只是估计值，因为变化率不一定保持不变。\n\n例如水箱中有 $V(3) = 500$ 升水，$V'(3) = 40$ 升每分钟，则两分钟后约有 $500 + 40 \\cdot 2 = 580$ 升。\n\n检验：$2$ 分钟内从 $500$ 升变为 $580$ 升，平均每分钟 $\\frac{80}{2} = 40$ 升，正是所设的变化率。\n\n> **注意。** 用变化率乘以时间步长 $h$，不是乘以从开始算起的时间 $a$。变化率为负时函数值减小。",
  ],
  (rng) => {
    const c = rng.pick(rateContexts);
    const a = rng.int(2, 12);
    const v = rng.int(20, 90) * 10;
    const r = c.falls ? nz(rng, 25) : rng.int(2, 25);
    const h = rng.int(2, 5);
    const name = c.en.charAt(1);
    const answer = v + r * h;
    return numberProblem({
      prompt: t(
        `${c.en}, in ${c.unit}, $t$ ${c.time} after a measurement starts. If $${name}(${a}) = ${v}$ and $${name}'(${a}) = ${r}$, estimate $${name}(${a + h})$.`,
        `${c.zh}（单位：${c.unitZh}），$t$ 是测量开始后的${c.timeZh}数。已知 $${name}(${a}) = ${v}$，$${name}'(${a}) = ${r}$。估计 $${name}(${a + h})$。`,
      ),
      answer,
      mistakes: distinctWhys([
        why(
          v + r,
          `This adds the change over one unit of time; from $t = ${a}$ to $t = ${a + h}$ is $${h}$ units.`,
          `这只加了一个单位时间的变化量；从 $t = ${a}$ 到 $t = ${a + h}$ 是 $${h}$ 个单位。`,
        ),
        why(
          v - r * h,
          "This subtracts the change. The rate's sign already says whether the value rises or falls.",
          "这是减去了变化量。变化率的符号已经说明了函数值是增大还是减小。",
        ),
        why(
          r * h,
          `This is only the change. Add it to the value $${v}$ at $t = ${a}$.`,
          `这只是变化量。还要把它加到 $t = ${a}$ 时的值 $${v}$ 上。`,
        ),
        why(
          v + r * a,
          `This multiplies the rate by the time $${a}$ since the start; the step is $h = ${h}$.`,
          `这是用变化率乘以从开始算起的时间 $${a}$；步长是 $h = ${h}$。`,
        ),
      ]),
      solution: t(
        ...walk(
          [
            [
              "Estimate the change",
              "估计变化量",
              `The time step is $h = ${a + h} - ${a} = ${h}$, so the change is about $${paren(r)} \\cdot ${h} = ${r * h}$.`,
              `时间步长是 $h = ${a + h} - ${a} = ${h}$，所以变化量约为 $${paren(r)} \\cdot ${h} = ${r * h}$。`,
            ],
            [
              "Add it to the current value",
              "加到当前的值上",
              `$${name}(${a + h}) \\approx ${v} + ${paren(r * h)} = ${answer}$.`,
              `$${name}(${a + h}) \\approx ${v} + ${paren(r * h)} = ${answer}$。`,
            ],
          ],
          [
            `Going from $${v}$ to $${answer}$ in $${h}$ ${c.time} is an average rate of $\\frac{${answer} - ${v}}{${h}} = ${r}$, the given derivative, as the estimate assumes.`,
            `在 $${h}$ ${c.timeZh}内从 $${v}$ 变为 $${answer}$，平均变化率为 $\\frac{${answer} - ${v}}{${h}} = ${r}$，正是给定的导数值，与估计的假设一致。`,
          ],
        ),
      ),
    });
  },
);

const whenRateReachesValue = point(
  "when-a-rate-reaches-a-given-value",
  ["When a rate reaches a given value", "变化率何时达到给定值"],
  [
    "The reverse question gives the rate and asks for the time or quantity. Differentiate the model, set the derivative equal to the given rate, and solve. The value of the model itself is not used, and the constant term plays no part.\n\nFor example, if $h(t) = -5t^{2} + 30t + 2$, the velocity is $h'(t) = -10t + 30$, and it equals $10$ when $t = 2$.\n\nCheck: $h(2.01) = 42.0995$ and $h(1.99) = 41.8995$, so the height changes by $0.2$ over $0.02$ seconds, a velocity of $10$.\n\n> **Watch out.** Set the derivative, not the model, equal to the given rate. When solving, move the constant of the derivative to the other side with its sign changed.",
    "反过来的问题是给出变化率，求时间或数量。对模型求导，令导数等于给定的变化率，然后求解。这里用不到模型本身的值，常数项也不起作用。\n\n例如 $h(t) = -5t^{2} + 30t + 2$，速度为 $h'(t) = -10t + 30$，当 $t = 2$ 时它等于 $10$。\n\n检验：$h(2.01) = 42.0995$，$h(1.99) = 41.8995$，高度在 $0.02$ 秒内变化 $0.2$，速度为 $10$。\n\n> **注意。** 令导数而不是模型本身等于给定的变化率。求解时，把导数中的常数移到另一边要变号。",
  ],
  (rng) => {
    if (rng.bool()) {
      const v = rng.int(20, 60);
      const c = rng.int(1, 40);
      const w = rng.pick([-1, 1]) * rng.int(1, 3) * 5;
      const answer = Q.of(v - w, 10);
      const T = answer.toNumber();
      const height = (s: number) => -5 * s * s + v * s + c;
      return numberProblem({
        prompt: t(
          `A ball's height after $t$ seconds is $h(t) = ${poly([-5, "t^{2}"], [v, "t"], [c, ""])}$ meters. At what time is its velocity $${w}$ m/s?`,
          `一个球 $t$ 秒后的高度是 $h(t) = ${poly([-5, "t^{2}"], [v, "t"], [c, ""])}$ 米。什么时候它的速度是 $${w}$ 米/秒？`,
        ),
        answer,
        mistakes: distinctWhys([
          why(
            Q.of(v + w, 10),
            `This solves $-10t + ${v} = ${-w}$: the sign of the velocity $${w}$ was changed.`,
            `这是在解 $-10t + ${v} = ${-w}$：速度 $${w}$ 的符号被改变了。`,
          ),
          why(
            Q.of(v - w, 5),
            "This differentiates $-5t^{2}$ to $-5t$; the power rule gives $-10t$.",
            "这把 $-5t^{2}$ 的导数算成了 $-5t$；幂法则给出 $-10t$。",
          ),
          why(
            Q.of(v, 10),
            "This is when the velocity is $0$, at the top, not when it equals the given value.",
            "这是速度为 $0$ 的时刻，即最高点，不是速度等于给定值的时刻。",
          ),
        ]),
        solution: t(
          ...walk(
            [
              [
                "Differentiate",
                "求导",
                `The velocity is $h'(t) = ${poly([-10, "t"], [v, ""])}$.`,
                `速度是 $h'(t) = ${poly([-10, "t"], [v, ""])}$。`,
              ],
              [
                "Set it equal to the rate",
                "令它等于给定的变化率",
                `$${poly([-10, "t"], [v, ""])} = ${w}$ gives $t = \\frac{${v} - ${paren(w)}}{10} = ${answer.toLatex()}$.`,
                `由 $${poly([-10, "t"], [v, ""])} = ${w}$ 得 $t = \\frac{${v} - ${paren(w)}}{10} = ${answer.toLatex()}$。`,
              ],
            ],
            [
              `$h(${num(T + 0.01)}) \\approx ${num(height(T + 0.01))}$ and $h(${num(T - 0.01)}) \\approx ${num(height(T - 0.01))}$, so over those $0.02$ seconds the height changes at about $${num((height(T + 0.01) - height(T - 0.01)) / 0.02)}$ m/s, the given velocity.`,
              `$h(${num(T + 0.01)}) \\approx ${num(height(T + 0.01))}$，$h(${num(T - 0.01)}) \\approx ${num(height(T - 0.01))}$，所以在这 $0.02$ 秒内高度的变化率约为 $${num((height(T + 0.01) - height(T - 0.01)) / 0.02)}$ 米/秒，正是给定的速度。`,
            ],
          ),
        ),
      });
    }
    const a = rng.int(1, 5);
    const b = rng.int(2, 30);
    const c = rng.int(50, 900);
    const q = rng.int(5, 40);
    const m = 2 * a * q + b;
    const cost = (x: number) => a * x * x + b * x + c;
    return numberProblem({
      prompt: t(
        `The cost of producing $q$ items is $C(q) = ${poly([a, "q^{2}"], [b, "q"], [c, ""])}$ dollars. At what output is the marginal cost $${m}$ dollars per item?`,
        `生产 $q$ 件产品的成本是 $C(q) = ${poly([a, "q^{2}"], [b, "q"], [c, ""])}$ 美元。产量为多少时边际成本是每件 $${m}$ 美元？`,
      ),
      answer: q,
      mistakes: distinctWhys([
        why(
          Q.of(m, 2 * a),
          `This leaves out the $${b}$ in $C'(q) = ${poly([2 * a, "q"], [b, ""])}$.`,
          `这漏掉了 $C'(q) = ${poly([2 * a, "q"], [b, ""])}$ 中的 $${b}$。`,
        ),
        why(
          Q.of(m - b, a),
          `This differentiates $${a === 1 ? "" : a}q^{2}$ to $${a === 1 ? "" : a}q$; the power rule doubles the coefficient.`,
          `这把 $${a === 1 ? "" : a}q^{2}$ 的导数算成了 $${a === 1 ? "" : a}q$；幂法则会使系数加倍。`,
        ),
        why(Q.of(m + b, 2 * a), `This adds $${b}$ to $${m}$ instead of subtracting it.`, `这是把 $${b}$ 加到 $${m}$ 上，而应该减去。`),
      ]),
      solution: t(
        ...walk(
          [
            [
              "Differentiate",
              "求导",
              `The marginal cost is $C'(q) = ${poly([2 * a, "q"], [b, ""])}$.`,
              `边际成本是 $C'(q) = ${poly([2 * a, "q"], [b, ""])}$。`,
            ],
            [
              "Set it equal to the rate",
              "令它等于给定的变化率",
              `$${poly([2 * a, "q"], [b, ""])} = ${m}$ gives $${2 * a}q = ${m - b}$, so $q = ${q}$.`,
              `由 $${poly([2 * a, "q"], [b, ""])} = ${m}$ 得 $${2 * a}q = ${m - b}$，所以 $q = ${q}$。`,
            ],
          ],
          [
            `Raising output from $${q} - 0.5$ to $${q} + 0.5$ items costs $C(${q + 0.5}) - C(${q - 0.5}) = ${num(cost(q + 0.5))} - ${num(cost(q - 0.5))} = ${num(cost(q + 0.5) - cost(q - 0.5))}$ dollars for one item, as the marginal cost says.`,
            `产量从 $${q} - 0.5$ 增加到 $${q} + 0.5$ 件，成本增加 $C(${q + 0.5}) - C(${q - 0.5}) = ${num(cost(q + 0.5))} - ${num(cost(q - 0.5))} = ${num(cost(q + 0.5) - cost(q - 0.5))}$ 美元，即一件的成本，与边际成本一致。`,
          ],
        ),
      ),
    });
  },
);

const forwardError = point(
  "the-exact-error-of-a-forward-difference",
  ["The exact error of a forward difference", "向前差商的精确误差"],
  [
    "For a quadratic $f(x) = Ax^{2} + Bx + C$, the forward difference quotient is exactly $f'(a) + Ah$. So its error is $Ah$: it does not depend on $a$, it shrinks in proportion to $h$, and its sign shows that a concave-up function is overestimated.\n\nFor example, $f(x) = 3x^{2} + x$ at $a = 1$ with $h = 0.1$: $\\frac{f(1.1) - f(1)}{0.1} = \\frac{4.73 - 4}{0.1} = 7.3$, while $f'(1) = 7$. The error is $0.3 = 3 \\cdot 0.1$.\n\nCheck: $Ah = 3(0.1) = 0.3$, the same as $7.3 - 7$.\n\n> **Watch out.** The error is $Ah$ with $A$ the coefficient of $x^{2}$, not the second derivative $2A$. It is positive when $A > 0$: the forward quotient is too high.",
    "对二次函数 $f(x) = Ax^{2} + Bx + C$，向前差商恰好等于 $f'(a) + Ah$。所以误差是 $Ah$：它与 $a$ 无关，与 $h$ 成比例地缩小，它的符号说明上凹函数的导数被高估。\n\n例如 $f(x) = 3x^{2} + x$，在 $a = 1$ 处取 $h = 0.1$：$\\frac{f(1.1) - f(1)}{0.1} = \\frac{4.73 - 4}{0.1} = 7.3$，而 $f'(1) = 7$。误差是 $0.3 = 3 \\cdot 0.1$。\n\n检验：$Ah = 3(0.1) = 0.3$，与 $7.3 - 7$ 相同。\n\n> **注意。** 误差是 $Ah$，$A$ 是 $x^{2}$ 的系数，不是二阶导数 $2A$。$A > 0$ 时误差为正：向前差商偏高。",
  ],
  (rng) => {
    const A = nz(rng, 6);
    const B = rng.int(-6, 6);
    const C = rng.int(-6, 6);
    const a = rng.int(-4, 4);
    const h = rng.pick([Q.of(1, 2), Q.of(1, 4), Q.of(1, 5), Q.of(1, 10)]);
    const answer = h.mul(Q.of(A));
    const f = (x: Q) => Q.of(A).mul(x).mul(x).add(Q.of(B).mul(x)).add(Q.of(C));
    const ah = Q.of(a).add(h);
    const quotient = f(ah)
      .sub(f(Q.of(a)))
      .div(h);
    const exact = 2 * A * a + B;
    return numberProblem({
      prompt: t(
        `Let $f(x) = ${poly([A, "x^{2}"], [B, "x"], [C, ""])}$. By how much does the forward difference quotient at $a = ${a}$ with $h = ${h.toLatex()}$ exceed the true value of $f'(${a})$? (The answer is negative if the estimate is too low.)`,
        `设 $f(x) = ${poly([A, "x^{2}"], [B, "x"], [C, ""])}$。在 $a = ${a}$ 处取 $h = ${h.toLatex()}$ 的向前差商比 $f'(${a})$ 的真实值大多少？（估计值偏低时答案为负。）`,
      ),
      answer,
      mistakes: distinctWhys([
        why(
          answer.neg(),
          `This is the error of the backward quotient, $-Ah$. The forward quotient is too ${A > 0 ? "high" : "low"} here because $A = ${A}$.`,
          `这是向后差商的误差 $-Ah$。这里 $A = ${A}$，所以向前差商偏${A > 0 ? "高" : "低"}。`,
        ),
        why(answer.mul(Q.of(2)), "This uses the second derivative $2A$ in place of $A$.", "这用二阶导数 $2A$ 代替了 $A$。"),
        why(h, `This is $h$ alone; the error is $Ah$ with $A = ${A}$.`, `这只是 $h$；误差是 $Ah$，其中 $A = ${A}$。`),
        why(
          exact,
          `This is $f'(${a})$ itself, not the amount by which the estimate exceeds it.`,
          `这是 $f'(${a})$ 本身，不是估计值比它大的量。`,
        ),
      ]),
      solution: t(
        ...walk(
          [
            [
              "Expand the quotient",
              "展开差商",
              `Write $f(x) = Ax^{2} + Bx + C$ with $A = ${A}$, $B = ${B}$ and $C = ${C}$. Then $f(a + h) - f(a) = 2Aah + Ah^{2} + Bh$, so $\\frac{f(a + h) - f(a)}{h} = 2Aa + B + Ah$.`,
              `把 $f(x)$ 写成 $Ax^{2} + Bx + C$，其中 $A = ${A}$，$B = ${B}$，$C = ${C}$。于是 $f(a + h) - f(a) = 2Aah + Ah^{2} + Bh$，所以 $\\frac{f(a + h) - f(a)}{h} = 2Aa + B + Ah$。`,
            ],
            [
              "Subtract the derivative",
              "减去导数",
              `$f'(a) = 2Aa + B$, so the excess is $Ah = ${paren(A)} \\cdot ${h.toLatex()} = ${answer.toLatex()}$.`,
              `$f'(a) = 2Aa + B$，所以多出的量是 $Ah = ${paren(A)} \\cdot ${h.toLatex()} = ${answer.toLatex()}$。`,
            ],
          ],
          [
            `Directly: $f\\left(${ah.toLatex()}\\right) = ${f(ah).toLatex()}$ and $f(${a}) = ${f(Q.of(a)).toLatex()}$, so the quotient is $${quotient.toLatex()}$, while $f'(${a}) = ${exact}$. The difference is $${quotient.toLatex()} - ${paren(exact)} = ${quotient.sub(Q.of(exact)).toLatex()}$.`,
            `直接计算：$f\\left(${ah.toLatex()}\\right) = ${f(ah).toLatex()}$，以及 $f(${a}) = ${f(Q.of(a)).toLatex()}$，所以差商是 $${quotient.toLatex()}$，而 $f'(${a}) = ${exact}$。二者之差是 $${quotient.toLatex()} - ${paren(exact)} = ${quotient.sub(Q.of(exact)).toLatex()}$。`,
          ],
        ),
      ),
    });
  },
);

const centralFromBoth = point(
  "averaging-backward-and-forward-estimates",
  ["Averaging backward and forward estimates", "对向后和向前估计取平均"],
  [
    "The average of the backward and forward quotients at $a$ is the central difference quotient, $\\frac{f(a + h) - f(a - h)}{2h}$, in which the value $f(a)$ cancels. It is usually a much better estimate than either one alone.\n\nFor example, if $f(1) = 4$, $f(2) = 7$ and $f(3) = 12$, then at $a = 2$ with $h = 1$ the backward quotient is $3$ and the forward quotient is $5$; their average is $4$.\n\nCheck: the central quotient gives $\\frac{12 - 4}{2} = 4$ directly.\n\n> **Watch out.** The two outer inputs are $2h$ apart, so the denominator is $2h$, not $h$.",
    "$a$ 处向后差商和向前差商的平均就是中心差商 $\\frac{f(a + h) - f(a - h)}{2h}$，其中 $f(a)$ 被抵消了。它通常比两者中任何一个都准确得多。\n\n例如 $f(1) = 4$，$f(2) = 7$，$f(3) = 12$，则在 $a = 2$ 处取 $h = 1$，向后差商是 $3$，向前差商是 $5$，平均为 $4$。\n\n检验：直接用中心差商，$\\frac{12 - 4}{2} = 4$。\n\n> **注意。** 两端的输入值相距 $2h$，所以分母是 $2h$，不是 $h$。",
  ],
  (rng) => {
    const h = rng.pick([1, 2]);
    const a = rng.int(2, 6) * h;
    const vm = rng.int(-20, 20);
    const v0 = vm + rng.int(-9, 9);
    const vp = v0 + rng.int(-9, 12);
    const xs = [a - h, a, a + h];
    const table = `| $x$ | ${xs.map((x) => `$${x}$`).join(" | ")} |\n| :---: | :---: | :---: | :---: |\n| $f(x)$ | $${vm}$ | $${v0}$ | $${vp}$ |`;
    const answer = Q.of(vp - vm, 2 * h);
    const back = Q.of(v0 - vm, h);
    const fore = Q.of(vp - v0, h);
    return numberProblem({
      prompt: t(
        `The table gives values of a differentiable function $f$.\n\n${table}\n\nFind the average of the backward and forward difference estimates of $f'(${a})$, using $h = ${h}$.`,
        `表中给出可导函数 $f$ 的值。\n\n${table}\n\n取 $h = ${h}$，求 $f'(${a})$ 的向后差商估计与向前差商估计的平均值。`,
      ),
      answer,
      mistakes: distinctWhys([
        why(
          Q.of(vp - vm, h),
          `This divides by $h = ${h}$, but $${a - h}$ and $${a + h}$ are $${2 * h}$ apart.`,
          `这是除以 $h = ${h}$，但 $${a - h}$ 和 $${a + h}$ 相距 $${2 * h}$。`,
        ),
        why(back, "This is the backward estimate alone; average it with the forward one.", "这只是向后估计；还要与向前估计取平均。"),
        why(fore, "This is the forward estimate alone; average it with the backward one.", "这只是向前估计；还要与向后估计取平均。"),
        why(Q.of(vp + vm, 2 * h), "This adds the two outer values; the quotient subtracts them.", "这是把两端的值相加；差商要把它们相减。"),
      ]),
      solution: t(
        ...walk(
          [
            [
              "Find both estimates",
              "求两个估计值",
              `Backward: $\\frac{${paren(v0)} - ${paren(vm)}}{${h}} = ${back.toLatex()}$; forward: $\\frac{${paren(vp)} - ${paren(v0)}}{${h}} = ${fore.toLatex()}$.`,
              `向后：$\\frac{${paren(v0)} - ${paren(vm)}}{${h}} = ${back.toLatex()}$；向前：$\\frac{${paren(vp)} - ${paren(v0)}}{${h}} = ${fore.toLatex()}$。`,
            ],
            [
              "Average them",
              "取平均",
              `$\\frac{1}{2}\\left(${back.toLatex()} + ${paren(fore)}\\right) = ${answer.toLatex()}$.`,
              `$\\frac{1}{2}\\left(${back.toLatex()} + ${paren(fore)}\\right) = ${answer.toLatex()}$。`,
            ],
          ],
          [
            `The central quotient gives it in one step, without the middle value: $\\frac{${paren(vp)} - ${paren(vm)}}{${2 * h}} = ${answer.toLatex()}$.`,
            `中心差商一步就能得到，不需要中间的值：$\\frac{${paren(vp)} - ${paren(vm)}}{${2 * h}} = ${answer.toLatex()}$。`,
          ],
        ),
      ),
    });
  },
);

const whereRatesCompare = point(
  "where-one-rate-is-a-multiple-of-the-other",
  ["Where one rate is a multiple of the other", "一个变化率是另一个的倍数之处"],
  [
    "The chain rule says $\\frac{dy}{dt} = f'(x)\\frac{dx}{dt}$, so the ratio of the two rates is $f'(x)$. To find where $y$ changes $k$ times as fast as $x$, solve $f'(x) = k$. The actual speed of $x$ does not matter.\n\nFor example, with $y = x^{2} + 3x$, $\\frac{dy}{dt} = (2x + 3)\\frac{dx}{dt}$, so $y$ changes $7$ times as fast as $x$ where $2x + 3 = 7$, at $x = 2$.\n\nCheck: $y(2.01) - y(1.99) = 10.0701 - 9.9301 = 0.14$, which is $7$ times the change $0.02$ in $x$.\n\n> **Watch out.** Solve $f'(x) = k$, not $f(x) = k$. Cancel $\\frac{dx}{dt}$, which is not zero.",
    "链式法则给出 $\\frac{dy}{dt} = f'(x)\\frac{dx}{dt}$，所以两个变化率之比就是 $f'(x)$。要找 $y$ 的变化率是 $x$ 的 $k$ 倍的位置，只需解 $f'(x) = k$。$x$ 的实际变化速度无关紧要。\n\n例如 $y = x^{2} + 3x$，$\\frac{dy}{dt} = (2x + 3)\\frac{dx}{dt}$，所以 $y$ 的变化率是 $x$ 的 $7$ 倍之处满足 $2x + 3 = 7$，即 $x = 2$。\n\n检验：$y(2.01) - y(1.99) = 10.0701 - 9.9301 = 0.14$，是 $x$ 的变化量 $0.02$ 的 $7$ 倍。\n\n> **注意。** 解的是 $f'(x) = k$，不是 $f(x) = k$。约去不为零的 $\\frac{dx}{dt}$。",
  ],
  (rng) => {
    const a = nz(rng, 5);
    const b = rng.int(-9, 9);
    const c = rng.int(-9, 9);
    const k = rng.pick([-12, -8, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 8, 12]);
    const answer = Q.of(k - b, 2 * a);
    const X = answer.toNumber();
    const y = (x: number) => a * x * x + b * x + c;
    const change = y(X + 0.01) - y(X - 0.01);
    return numberProblem({
      prompt: t(
        `$x$ and $y$ are functions of $t$ with $y = ${poly([a, "x^{2}"], [b, "x"], [c, ""])}$, and $\\frac{dx}{dt} \\ne 0$. For which $x$ is $\\frac{dy}{dt} = ${k}\\frac{dx}{dt}$?`,
        `$x$ 和 $y$ 都是 $t$ 的函数，$y = ${poly([a, "x^{2}"], [b, "x"], [c, ""])}$，且 $\\frac{dx}{dt} \\ne 0$。$x$ 为何值时 $\\frac{dy}{dt} = ${k}\\frac{dx}{dt}$？`,
      ),
      answer,
      mistakes: distinctWhys([
        why(
          Q.of(k + b, 2 * a),
          `This adds $${paren(b)}$ to $${k}$ instead of subtracting it.`,
          `这是把 $${paren(b)}$ 加到 $${k}$ 上，而应该减去。`,
        ),
        why(
          Q.of(k - b, a),
          `This differentiates $${poly([a, "x^{2}"])}$ to $${poly([a, "x"])}$; the power rule doubles the coefficient.`,
          `这把 $${poly([a, "x^{2}"])}$ 的导数算成了 $${poly([a, "x"])}$；幂法则会使系数加倍。`,
        ),
        why(Q.of(k, 2 * a), `This leaves out the term $${paren(b)}$ of the derivative.`, `这漏掉了导数中的 $${paren(b)}$ 项。`),
        why(Q.of(b - k, 2 * a), "This has the sign reversed when solving for $x$.", "这在解 $x$ 时符号弄反了。"),
      ]),
      solution: t(
        ...walk(
          [
            [
              "Differentiate with the chain rule",
              "用链式法则求导",
              `$\\frac{dy}{dt} = (${linear(2 * a, b)})\\frac{dx}{dt}$.`,
              `$\\frac{dy}{dt} = (${linear(2 * a, b)})\\frac{dx}{dt}$。`,
            ],
            [
              "Solve for the ratio",
              "按比值求解",
              `Cancelling $\\frac{dx}{dt}$ gives $${linear(2 * a, b)} = ${k}$, so $x = ${answer.toLatex()}$.`,
              `约去 $\\frac{dx}{dt}$，得 $${linear(2 * a, b)} = ${k}$，所以 $x = ${answer.toLatex()}$。`,
            ],
          ],
          [
            `Move $x$ from $${num(X - 0.01)}$ to $${num(X + 0.01)}$: $y$ changes by $${num(change)}$, which is $${num(change / 0.02)}$ times the change $0.02$ in $x$.`,
            `让 $x$ 从 $${num(X - 0.01)}$ 变到 $${num(X + 0.01)}$：$y$ 变化了 $${num(change)}$，是 $x$ 的变化量 $0.02$ 的 $${num(change / 0.02)}$ 倍。`,
          ],
        ),
      ),
    });
  },
);

const distanceRate = point(
  "the-rate-of-change-of-the-distance-from-the-origin",
  ["The rate of change of the distance from the origin", "到原点距离的变化率"],
  [
    "If $D$ is the distance from the origin to a moving point, then $D^{2} = x^{2} + y^{2}$. Differentiating implicitly gives $D\\frac{dD}{dt} = x\\frac{dx}{dt} + y\\frac{dy}{dt}$, so the rate depends on the position as well as on the two velocities.\n\nFor example, at $(3, 4)$ with $\\frac{dx}{dt} = 2$ and $\\frac{dy}{dt} = -1$: $D = 5$ and $5\\frac{dD}{dt} = 6 - 4 = 2$, so $\\frac{dD}{dt} = 0.4$.\n\nCheck: $0.01$ later the point is near $(3.02, 3.99)$, at distance $\\sqrt{25.0405} \\approx 5.00405$, an increase of $0.00405$ in $0.01$, about $0.4$.\n\n> **Watch out.** Divide by $D$ at the end, and keep the signs of the coordinates: a point with negative $x$ moving left moves away from the origin.",
    "设 $D$ 是从原点到动点的距离，则 $D^{2} = x^{2} + y^{2}$。隐函数求导得 $D\\frac{dD}{dt} = x\\frac{dx}{dt} + y\\frac{dy}{dt}$，所以这个变化率既取决于两个速度，也取决于位置。\n\n例如在 $(3, 4)$ 处，$\\frac{dx}{dt} = 2$，$\\frac{dy}{dt} = -1$：$D = 5$，$5\\frac{dD}{dt} = 6 - 4 = 2$，所以 $\\frac{dD}{dt} = 0.4$。\n\n检验：经过 $0.01$，点约在 $(3.02, 3.99)$，距离为 $\\sqrt{25.0405} \\approx 5.00405$，在 $0.01$ 内增加 $0.00405$，约为 $0.4$。\n\n> **注意。** 最后要除以 $D$，并保留坐标的符号：$x$ 为负的点向左运动时，是在远离原点。",
  ],
  (rng) => {
    const [p, q, d] = rng.pick([
      [3, 4, 5],
      [4, 3, 5],
      [5, 12, 13],
      [12, 5, 13],
      [6, 8, 10],
      [8, 6, 10],
      [8, 15, 17],
    ] as const);
    const x = rng.pick([1, -1]) * p;
    const y = rng.pick([1, -1]) * q;
    const u = nz(rng, 9);
    const v = nz(rng, 9);
    const top = x * u + y * v;
    const answer = Q.of(top, d);
    const e = 0.001;
    const later = Math.hypot(x + e * u, y + e * v);
    return numberProblem({
      prompt: t(
        `A point moves in the plane. When it is at $(${x}, ${y})$, $\\frac{dx}{dt} = ${u}$ and $\\frac{dy}{dt} = ${v}$. Find the rate of change of its distance $D$ from the origin at that moment.`,
        `一个点在平面上运动。当它位于 $(${x}, ${y})$ 时，$\\frac{dx}{dt} = ${u}$，$\\frac{dy}{dt} = ${v}$。求此刻它到原点的距离 $D$ 的变化率。`,
      ),
      answer,
      mistakes: distinctWhys([
        why(top, `This leaves out the division by $D = ${d}$.`, `这漏掉了除以 $D = ${d}$。`),
        why(
          u + v,
          "This adds the two velocities; each must be weighted by its coordinate.",
          "这是把两个速度相加；每个速度都要乘以对应的坐标。",
        ),
        why(
          Q.of(2 * top, d),
          "This keeps a $2$ on one side only; the $2$s from $D^{2}$, $x^{2}$ and $y^{2}$ all cancel.",
          "这只在一边保留了 $2$；$D^{2}$、$x^{2}$、$y^{2}$ 求导得到的 $2$ 都会约掉。",
        ),
        why(
          Q.of(x * v + y * u, d),
          "This pairs $x$ with $\\frac{dy}{dt}$ and $y$ with $\\frac{dx}{dt}$.",
          "这是把 $x$ 与 $\\frac{dy}{dt}$、$y$ 与 $\\frac{dx}{dt}$ 配在了一起。",
        ),
      ]),
      solution: t(
        ...walk(
          [
            [
              "Find the distance",
              "求距离",
              `$D = \\sqrt{${paren(x)}^{2} + ${paren(y)}^{2}} = ${d}$.`,
              `$D = \\sqrt{${paren(x)}^{2} + ${paren(y)}^{2}} = ${d}$。`,
            ],
            [
              "Differentiate and substitute",
              "求导并代入",
              `$${d}\\frac{dD}{dt} = ${paren(x)} \\cdot ${paren(u)} + ${paren(y)} \\cdot ${paren(v)} = ${top}$, so $\\frac{dD}{dt} = ${answer.toLatex()}$.`,
              `$${d}\\frac{dD}{dt} = ${paren(x)} \\cdot ${paren(u)} + ${paren(y)} \\cdot ${paren(v)} = ${top}$，所以 $\\frac{dD}{dt} = ${answer.toLatex()}$。`,
            ],
          ],
          [
            `$0.001$ later the point is near $(${num(x + e * u)}, ${num(y + e * v)})$, at distance about $${later.toFixed(5)}$. The change divided by $0.001$ is about $${num((later - d) / e)}$, close to $${answer.toLatex()}${approx(answer)}$.`,
            `经过 $0.001$，点约在 $(${num(x + e * u)}, ${num(y + e * v)})$，距离约为 $${later.toFixed(5)}$。变化量除以 $0.001$ 约为 $${num((later - d) / e)}$，接近 $${answer.toLatex()}${approx(answer)}$。`,
          ],
        ),
      ),
    });
  },
);

/** deeperCalculusIThirdPoints maps topics of Calculus I, up to related rates, to a third knowledge point. */
export const deeperCalculusIThirdPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "graphs-of-the-hyperbolic-functions": [levelLineOfHyperbolicGraph],
  "graphs-of-the-reciprocal-hyperbolic-functions": [levelLineOfReciprocalGraph],
  "the-left-and-right-sided-limits-of-a-function": [oneSidedAbsoluteValue],
  "finding-the-existence-of-a-limit-using-one-sided-limits": [limitAcrossTwoFormulas],
  "limits-at-infinity-from-graphs": [crossingAnAsymptote],
  "infinite-limits-from-graphs": [formulaFromInfiniteLimits],
  "limits-of-power-functions-and-the-constant-rule-for-limits": [coefficientFromPowerLimit],
  "limits-of-reciprocal-functions": [twoSidedReciprocal],
  "limits-of-trigonometric-functions": [trigAtMultiplesOfPi],
  "limits-of-reciprocal-trigonometric-functions": [reciprocalTrigFarOut],
  "evaluating-limits-at-infinity-by-comparing-relative-magnitudes-of-functions": [sameBaseExponentials],
  "determining-continuity-from-graphs": [whichConditionFails],
  "left-and-right-continuity": [valueForOneSidedContinuity],
  "further-continuity-of-piecewise-functions": [twoValuesOfK],
  "point-discontinuities": [constantFromHole],
  "discontinuities-due-to-vertical-asymptotes": [countingAsymptotes],
  "continuity-of-functions": [continuityOfLogOverLinear],
  "removing-point-discontinuities": [notEveryGapRemovable],
  "removing-jump-discontinuities": [jumpSize],
  "removing-discontinuities-from-rational-functions": [coefficientMakingHole],
  "differentiating-reciprocal-hyperbolic-functions": [hyperbolicSlopeAtZero],
  "calculating-derivatives-from-graphs": [quotientFromSegment],
  "calculating-derivatives-from-graphs-using-the-chain-rule": [composeFromTable],
  "differentiating-inverse-reciprocal-trigonometric-functions": [inverseReciprocalTrigInner],
  "differentiating-inverse-hyperbolic-functions": [inverseHyperbolicValues],
  "differentiating-inverse-reciprocal-hyperbolic-functions": [reciprocalHyperbolicInner],
  "interpreting-the-meaning-of-the-derivative-in-context": [estimateFromDerivative],
  "rates-of-change-in-applied-contexts": [whenRateReachesValue],
  "estimating-derivatives-using-a-forward-difference-quotient": [forwardError],
  "estimating-derivatives-using-a-backward-difference-quotient": [centralFromBoth],
  "introduction-to-related-rates": [whereRatesCompare],
  "related-rates-with-implicit-functions": [distanceRate],
};
