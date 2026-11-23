// Third knowledge points for thin topics of Calculus I, from extrema to integrals:
// the reverse question, a harder case or a common trap. See
// `deeperCalculusIThird2Points`.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { t } from "@ga/content";
import { dec, linear, paren, poly, Q } from "@ga/subject-math";
import { calculusDrawings2 } from "../explanation-drawings-calculus-2.ts";
import { calculusDrawings3 } from "../explanation-drawings-calculus-3.ts";

import { functionProblem, numberProblem, why } from "../problems.ts";
import { stepLabel } from "../solution-kit.ts";
import { ask, choose, type Pair, point } from "../university-kit.ts";
import { reasoned } from "../wrong-reasons.ts";
import { table as markTable } from "./calculus-common.ts";

/** nz picks a nonzero integer from -r to r. */
const nz = (rng: Rng, r: number) => rng.pick([...Array(2 * r + 1).keys()].map((i) => i - r).filter((i) => i !== 0));
/** minus writes x - a with the sign tidied. */
const minus = (a: number) => linear(1, -a);
/** power writes (x - a) raised to n, without brackets when a is 0. */
const power = (a: number, n: number) => (a === 0 ? `x^{${n}}` : `(${minus(a)})^{${n}}`);
/** same2 writes one formula as a pair for both languages. */
const same2 = (latex: string): Pair => [`$${latex}$`, `$${latex}$`];

/** walkPair writes a solution as labelled steps, each a title and what it says in both languages, followed by a check that takes a second route. */
function walkPair(parts: readonly (readonly [en: string, zh: string, sayEn: string, sayZh: string])[], check: Pair): Pair {
  const write = (zh: boolean) =>
    `${parts.map(([en, z, se, sz], i) => `${stepLabel(i + 1, en, z)[zh ? "zh-CN" : "en"]} ${zh ? sz : se}`).join("\n\n")}\n\n${zh ? `**检验。** ${check[1]}` : `**Check.** ${check[0]}`}`;
  return [write(false), write(true)];
}

/** round3 writes a value rounded to three decimal places, without trailing zeros. */
const round3 = (v: number) => dec(Q.of(Math.round(v * 1000) || 0, 1000));

/** signTable tabulates a function, named in LaTeX, at some x-values to three decimal places. */
const signTable = (xs: readonly number[], name: string, f: (x: number) => number) =>
  markTable(["$x$", ...xs.map((x) => `$${round3(x)}$`)], [`$${name}$`, ...xs.map((x) => `$${round3(f(x))}$`)]);

const criticalNotExtreme = point(
  "critical-points-that-are-not-extrema",
  ["Critical points that are not extrema", "不是极值点的临界点"],
  [
    "A critical point is only a candidate. There is a local extremum only where $f'$ changes sign. A squared factor in $f'$ gives a critical point where $f'$ keeps its sign, so $f$ has no extremum there. For $f'(x) = (x - 1)^{2}(x + 2)$, the critical points are $1$ and $-2$, but only $-2$ is an extremum: there $f'$ goes from negative to positive, a local minimum.\n\nCheck: $f'(0.9) = 0.01 \\cdot 2.9 > 0$ and $f'(1.1) = 0.01 \\cdot 3.1 > 0$ have the same sign, while $f'(-2.1) = 9.61 \\cdot (-0.1) < 0$ and $f'(-1.9) = 8.41 \\cdot 0.1 > 0$ do not.\n\n> **Watch out.** $f'(1) = 0$ does not make $x = 1$ an extremum. Check the sign on both sides before calling a critical point a maximum or minimum.",
    "临界点只是候选点。只有在 $f'$ 变号的地方才有局部极值。$f'$ 中的平方因式给出的临界点处 $f'$ 不变号，所以 $f$ 在那里没有极值。对 $f'(x) = (x - 1)^{2}(x + 2)$，临界点是 $1$ 和 $-2$，但只有 $-2$ 是极值点：$f'$ 在那里由负变正，是局部极小值。\n\n检验：$f'(0.9) = 0.01 \\cdot 2.9 > 0$，$f'(1.1) = 0.01 \\cdot 3.1 > 0$，符号相同；而 $f'(-2.1) = 9.61 \\cdot (-0.1) < 0$，$f'(-1.9) = 8.41 \\cdot 0.1 > 0$，符号不同。\n\n> **注意。** $f'(1) = 0$ 并不使 $x = 1$ 成为极值点。把临界点称为极大值或极小值之前，先检查两侧的符号。",
  ],
  (rng) => {
    const a = rng.int(-6, 6);
    const b = rng.pick([-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].filter((x) => x !== a));
    const k = rng.pick([-3, -2, -1, 1, 2, 3, 4]);
    const d = poly([k, b === 0 ? `x(${minus(a)})^{2}` : `${power(a, 2)}(${minus(b)})`]);
    const fd = (x: number) => k * (x - a) ** 2 * (x - b);
    return ask(
      [
        `$f'(x) = ${d}$, so $f$ has critical points at $x = ${Math.min(a, b)}$ and $x = ${Math.max(a, b)}$ but only one local extremum. At which $x$ is it?`,
        `$f'(x) = ${d}$，所以 $f$ 的临界点是 $x = ${Math.min(a, b)}$ 和 $x = ${Math.max(a, b)}$，但只有一个局部极值。它在哪个 $x$ 处？`,
      ],
      b,
      [a, a + b, -b],
      walkPair(
        [
          [
            `Look at x = ${a}`,
            `看 x = ${a}`,
            `$${power(a, 2)}$ is a square, positive on both sides of $x = ${a}$, so $f'$ keeps its sign there and there is no extremum.`,
            `$${power(a, 2)}$ 是平方，在 $x = ${a}$ 两侧都为正，所以 $f'$ 在那里符号不变，没有极值。`,
          ],
          [
            `Look at x = ${b}`,
            `看 x = ${b}`,
            `$${minus(b)}$ changes sign at $x = ${b}$, and the other factors do not, so $f'$ changes sign there: the extremum is at $x = ${b}$.`,
            `$${minus(b)}$ 在 $x = ${b}$ 处变号，而其他因式不变号，所以 $f'$ 在那里变号：极值在 $x = ${b}$ 处。`,
          ],
        ],
        [
          `Evaluate $f'$ half a unit on each side of both points:\n\n${signTable([a - 0.5, a + 0.5, b - 0.5, b + 0.5], "f'(x)", fd)}\n\nThe sign is the same around $${a}$ and changes around $${b}$.`,
          `计算 $f'$ 在两点各自两侧半个单位处的值：\n\n${signTable([a - 0.5, a + 0.5, b - 0.5, b + 0.5], "f'(x)", fd)}\n\n在 $${a}$ 两侧符号相同，在 $${b}$ 两侧符号改变。`,
        ],
      ),
    );
  },
);

const openEndpoints = point(
  "extrema-on-an-interval-that-is-not-closed",
  ["Extrema on an interval that is not closed", "非闭区间上的最值"],
  [
    "The extreme value theorem needs a closed interval. Without it an extremum may still exist, but must be checked: an interior minimum is still attained, while values rising toward an excluded endpoint have no maximum, since no point reaches the bound. For $x^2$ on $[-1, 2)$, the minimum $0$ is attained at $x = 0$, but the values rise toward $4$ as $x$ approaches the excluded endpoint $2$, so there is no maximum.\n\nCheck: $f(1.9) = 3.61$, $f(1.99) = 3.9601$ and $f(1.999) = 3.996001$ keep growing toward $4$, and no point of the interval gives $4$.\n\n> **Watch out.** An interval that is not closed does not rule out extrema: the theorem no longer promises them, but each one must be checked directly.",
    "极值定理要求闭区间。没有这个条件时最值仍可能存在，但必须逐一检查：区间内部的最小值仍能取到；而函数值趋向被排除的端点时不断增大，就没有最大值，因为没有哪个点能达到那个上界。对 $[-1, 2)$ 上的 $x^2$，最小值 $0$ 在 $x = 0$ 处取到，但当 $x$ 趋向被排除的端点 $2$ 时函数值增大并趋于 $4$，所以没有最大值。\n\n检验：$f(1.9) = 3.61$，$f(1.99) = 3.9601$，$f(1.999) = 3.996001$ 不断增大并趋于 $4$，而区间内没有哪个点使函数值等于 $4$。\n\n> **注意。** 区间不闭并不排除最值：定理不再保证它们存在，但每一个都要直接检查。",
  ],
  (rng) => {
    const a = rng.int(1, 6);
    const b = rng.pick([1, 2, 3, 4, 5, 6, 7].filter((x) => x !== a));
    const k = rng.int(-9, 9);
    const closedLeft = rng.bool();
    const closedRight = closedLeft ? false : rng.bool();
    const leftFar = a > b;
    const attained = leftFar ? closedLeft : closedRight;
    const top = Math.max(a, b) ** 2 + k;
    const far = leftFar ? -a : b;
    const inward = leftFar ? 1 : -1;
    const set = `${closedLeft ? "[" : "("}${-a}, ${b}${closedRight ? "]" : ")"}`;
    const f = poly([1, "x^{2}"], [k, ""]);
    const withMax: Pair = [`Minimum $${k}$ and maximum $${top}$`, `最小值 $${k}$，最大值 $${top}$`];
    const noMax: Pair = [`Minimum $${k}$ and no maximum`, `最小值 $${k}$，没有最大值`];
    const neither: Pair = [`No minimum and no maximum, because the interval is not closed`, `没有最小值也没有最大值，因为区间不是闭区间`];
    const onlyMax: Pair = [`No minimum and maximum $${top}$`, `没有最小值，最大值 $${top}$`];
    const near = [0.1, 0.01, 0.001].map((h) => far + inward * h);
    return reasoned(
      choose(
        rng,
        [`Which describes the extreme values of $f(x) = ${f}$ on $${set}$?`, `$f(x) = ${f}$ 在 $${set}$ 上的最值情况是哪一项？`],
        attained ? withMax : noMax,
        [attained ? noMax : withMax, neither, onlyMax],
        walkPair(
          [
            [
              "Find the minimum",
              "找最小值",
              `$x^{2} \\ge 0$, so $f(x) \\ge ${k}$, with equality at the interior point $x = 0$. The minimum $${k}$ is attained.`,
              `$x^{2} \\ge 0$，所以 $f(x) \\ge ${k}$，在内部点 $x = 0$ 处取等号。最小值 $${k}$ 能取到。`,
            ],
            [
              "Look at the farther endpoint",
              "看较远的端点",
              `The largest values are near the farther endpoint, $x = ${far}$, where they approach $${top}$. That endpoint is ${attained ? `included, so $${top}$ is the maximum` : `excluded, so $${top}$ is never reached and there is no maximum`}.`,
              `最大的函数值出现在较远的端点 $x = ${far}$ 附近，趋于 $${top}$。这个端点${attained ? `包含在区间内，所以 $${top}$ 是最大值` : `不在区间内，所以 $${top}$ 取不到，没有最大值`}。`,
            ],
          ],
          [
            `Values approaching $x = ${far}$ from inside:\n\n${signTable(near, "f(x)", (x) => x * x + k)}\n\nThey rise toward $${top}$ without reaching it, so everything turns on whether $x = ${far}$ itself belongs to the interval.`,
            `从区间内部趋向 $x = ${far}$ 时的值：\n\n${signTable(near, "f(x)", (x) => x * x + k)}\n\n它们增大并趋于 $${top}$ 却达不到，所以关键在于 $x = ${far}$ 本身是否属于区间。`,
          ],
        ),
      ),
      [
        attained
          ? [
              noMax[0],
              `$x = ${far}$ is included, so $f(${far}) = ${top}$ is attained and is the maximum.`,
              `$x = ${far}$ 包含在区间内，所以 $f(${far}) = ${top}$ 能取到，是最大值。`,
            ]
          : [
              withMax[0],
              `$x = ${far}$ is excluded, so the value $${top}$ is approached but never reached.`,
              `$x = ${far}$ 不在区间内，所以 $${top}$ 只能接近，永远取不到。`,
            ],
        [
          neither[0],
          `The theorem not applying does not rule extrema out: the minimum $${k}$ is attained at $x = 0$, inside the interval.`,
          `定理不适用并不排除最值：最小值 $${k}$ 在区间内的 $x = 0$ 处取到。`,
        ],
        [
          onlyMax[0],
          `$f(0) = ${k}$ is a value of $f$ on the interval and no value is smaller, so there is a minimum.`,
          `$f(0) = ${k}$ 是 $f$ 在区间上的值，且没有更小的值，所以有最小值。`,
        ],
      ],
    );
  },
);

const coefficientFromInflection = point(
  "a-coefficient-from-the-location-of-an-inflection-point",
  ["A coefficient from the location of an inflection point", "由拐点位置求系数"],
  [
    "The reverse of finding an inflection point: for a cubic, $f''$ is linear and changes sign at its zero, so requiring $f''(c) = 0$ gives an equation for an unknown coefficient. The linear and constant terms of $f$ do not matter. For $f(x) = 2x^{3} + kx^{2} + x$ with its inflection point at $x = 1$, $f''(x) = 12x + 2k$, and $f''(1) = 12 + 2k = 0$ gives $k = -6$.\n\nCheck: with $k = -6$, $f''(x) = 12x - 12$, so $f''(0) = -12 < 0$ and $f''(2) = 12 > 0$: the sign does change at $1$.\n\n> **Watch out.** Differentiating $kx^{2}$ twice gives $2k$, not $k$. Forgetting the $2$ doubles the answer.",
    "这是求拐点的逆问题：三次函数的 $f''$ 是一次函数，在其零点处变号，所以令 $f''(c) = 0$ 就得到未知系数的方程。$f$ 的一次项和常数项不起作用。对拐点在 $x = 1$ 的 $f(x) = 2x^{3} + kx^{2} + x$，$f''(x) = 12x + 2k$，由 $f''(1) = 12 + 2k = 0$ 得 $k = -6$。\n\n检验：取 $k = -6$，$f''(x) = 12x - 12$，所以 $f''(0) = -12 < 0$，$f''(2) = 12 > 0$：符号确实在 $1$ 处改变。\n\n> **注意。** $kx^{2}$ 求两次导数得 $2k$，不是 $k$。漏掉 $2$ 会使答案变成两倍。",
  ],
  (rng) => {
    const a = nz(rng, 4);
    const c = nz(rng, 6);
    const m = rng.int(-9, 9);
    const n = rng.int(-9, 9);
    const answer = -3 * a * c;
    const f = poly([a, "x^{3}"], [1, "kx^{2}"], [m, "x"], [n, ""]);
    const f2 = poly([6 * a, "x"], [2 * answer, ""]);
    return ask(
      [
        `The graph of $f(x) = ${f}$ has its point of inflection at $x = ${c}$. Find $k$.`,
        `$f(x) = ${f}$ 的图像在 $x = ${c}$ 处有拐点。求 $k$。`,
      ],
      answer,
      [-answer, -6 * a * c, -a * c],
      walkPair(
        [
          [
            "Differentiate twice",
            "求两次导数",
            `$f''(x) = ${poly([6 * a, "x"])} + 2k$, since the linear and constant terms vanish after two derivatives.`,
            `$f''(x) = ${poly([6 * a, "x"])} + 2k$，因为一次项和常数项求两次导数后都消失了。`,
          ],
          [
            "Set f''(c) = 0",
            "令 f''(c) = 0",
            `$f''(${c}) = ${6 * a * c} + 2k = 0$, so $k = ${answer}$.`,
            `$f''(${c}) = ${6 * a * c} + 2k = 0$，所以 $k = ${answer}$。`,
          ],
        ],
        [
          `With $k = ${answer}$, $f''(x) = ${f2}$. Then $f''(${c - 1}) = ${-6 * a}$ and $f''(${c + 1}) = ${6 * a}$ have opposite signs, so the concavity really changes at $x = ${c}$.`,
          `取 $k = ${answer}$，$f''(x) = ${f2}$。于是 $f''(${c - 1}) = ${-6 * a}$ 与 $f''(${c + 1}) = ${6 * a}$ 异号，所以凹凸性确实在 $x = ${c}$ 处改变。`,
        ],
      ),
    );
  },
);

const cornerOfSegments = {
  ...point(
    "the-derivative-at-a-corner",
    ["The derivative at a corner", "折点处的导数"],
    [
      "On a piecewise-linear graph each segment has its own slope. At the point where two segments meet, the derivative exists only if the slopes agree; at a true corner the one-sided slopes differ and the derivative does not exist, even though $f$ is continuous there. For segments from $(-1, -1)$ to $(0, 1)$ and from $(0, 1)$ to $(2, 0)$, the slopes are $2$ and $-0.5$, so $f'(0)$ does not exist.\n\nCheck: on the right, $f(0.1) = 0.95$, so the difference quotient with $h = 0.1$ is $-0.5$; on the left, $f(-0.1) = 0.8$, so the quotient with $h = -0.1$ is $2$. They disagree.\n\n> **Watch out.** Averaging the two slopes does not give a derivative. At a corner there is no single tangent line, so $f'$ does not exist there.",
      "在折线图像上，每条线段有自己的斜率。在两条线段的交点处，只有斜率相同时导数才存在；在真正的折点处，两侧斜率不同，导数不存在，尽管 $f$ 在那里连续。对从 $(-1, -1)$ 到 $(0, 1)$、再从 $(0, 1)$ 到 $(2, 0)$ 的线段，斜率分别是 $2$ 和 $-0.5$，所以 $f'(0)$ 不存在。\n\n检验：在右侧 $f(0.1) = 0.95$，所以 $h = 0.1$ 的差商是 $-0.5$；在左侧 $f(-0.1) = 0.8$，所以 $h = -0.1$ 的差商是 $2$。两者不一致。\n\n> **注意。** 把两侧斜率取平均并不能得到导数。折点处没有唯一的切线，所以 $f'$ 在那里不存在。",
    ],
    (rng) => {
      const x1 = rng.int(-3, 3);
      const w1 = rng.int(1, 3);
      const w2 = rng.int(1, 3);
      const m1 = nz(rng, 4);
      const m2 = rng.bool(0.25) ? m1 : rng.pick([-4, -3, -2, -1, 1, 2, 3, 4].filter((x) => x !== m1));
      const y1 = rng.int(-5, 5);
      const [y0, y2] = [y1 - m1 * w1, y1 + m2 * w2];
      const path = `$(${x1 - w1}, ${y0})$, $(${x1}, ${y1})$, $(${x1 + w2}, ${y2})$`;
      const none: Pair = [`It does not exist`, `不存在`];
      const num = (v: Q | number): Pair => same2(v instanceof Q ? v.toLatex() : String(v));
      const avg = Q.of(m1 + m2, 2);
      const tenth = Q.of(1, 10);
      const [right, left] = [Q.of(y1).add(tenth.mul(Q.of(m2))), Q.of(y1).sub(tenth.mul(Q.of(m1)))];
      const agree = m1 === m2;
      const wrong = agree ? [none, num(m1 + 1), num(-m1)] : [num(m1), num(m2), num(avg)];
      const reasons: (readonly [string, string, string])[] = agree
        ? [
            [
              none[0],
              "The slopes on the two sides agree, so the segments form one straight line and the derivative exists.",
              "两侧斜率相同，所以两条线段构成一条直线，导数存在。",
            ],
            [num(m1 + 1)[0], "This is not the slope of either segment.", "这不是任何一条线段的斜率。"],
            [
              num(-m1)[0],
              `This has the wrong sign: the graph ${m1 > 0 ? "rises" : "falls"} through the point.`,
              `符号反了：图像经过该点时在${m1 > 0 ? "上升" : "下降"}。`,
            ],
          ]
        : [
            [num(m1)[0], `This is only the slope on the left. On the right it is $${m2}$.`, `这只是左侧的斜率。右侧斜率是 $${m2}$。`],
            [num(m2)[0], `This is only the slope on the right. On the left it is $${m1}$.`, `这只是右侧的斜率。左侧斜率是 $${m1}$。`],
            [
              num(avg)[0],
              "Averaging the slopes does not give a derivative: at a corner there is none.",
              "把斜率取平均得不到导数：折点处没有导数。",
            ],
          ];
      return reasoned(
        choose(
          rng,
          [
            `The graph of $f$ is made of line segments joining ${path}, in that order. Find $f'(${x1})$.`,
            `$f$ 的图像由依次连接 ${path} 的线段组成。求 $f'(${x1})$。`,
          ],
          agree ? num(m1) : none,
          wrong,
          walkPair(
            [
              [
                "Find the slope on the left",
                "求左侧的斜率",
                `From $(${x1 - w1}, ${y0})$ to $(${x1}, ${y1})$ the height changes by $${y1 - y0}$ over $${w1}$, so the slope is $${m1}$.`,
                `从 $(${x1 - w1}, ${y0})$ 到 $(${x1}, ${y1})$，图像在 $${w1}$ 的宽度改变 $${y1 - y0}$，所以斜率是 $${m1}$。`,
              ],
              [
                "Find the slope on the right",
                "求右侧的斜率",
                `From $(${x1}, ${y1})$ to $(${x1 + w2}, ${y2})$ the height changes by $${y2 - y1}$ over $${w2}$, so the slope is $${m2}$. ${agree ? `The slopes agree, so the two segments form one line and $f'(${x1}) = ${m1}$.` : "The slopes differ, so the graph has a corner and the derivative does not exist."}`,
                `从 $(${x1}, ${y1})$ 到 $(${x1 + w2}, ${y2})$，图像在 $${w2}$ 的宽度改变 $${y2 - y1}$，所以斜率是 $${m2}$。${agree ? `两侧斜率相同，所以两条线段构成一条直线，$f'(${x1}) = ${m1}$。` : "两侧斜率不同，所以图像有折点，导数不存在。"}`,
              ],
            ],
            [
              `Take difference quotients at $x = ${x1}$. On the right, $f(${dec(Q.of(x1).add(tenth))}) = ${dec(right)}$, so the quotient with $h = 0.1$ is $${m2}$. On the left, $f(${dec(Q.of(x1).sub(tenth))}) = ${dec(left)}$, so the quotient with $h = -0.1$ is $${m1}$. ${agree ? "They agree." : "They disagree."}`,
              `在 $x = ${x1}$ 处求差商。右侧 $f(${dec(Q.of(x1).add(tenth))}) = ${dec(right)}$，所以 $h = 0.1$ 的差商是 $${m2}$。左侧 $f(${dec(Q.of(x1).sub(tenth))}) = ${dec(left)}$，所以 $h = -0.1$ 的差商是 $${m1}$。${agree ? "两者一致。" : "两者不一致。"}`,
            ],
          ),
        ),
        reasons,
      );
    },
  ),
  figure: calculusDrawings2["sketching-the-derivative-of-a-function-from-the-functions-graph#the-derivative-at-a-corner"],
};

const peakOfDerivative = {
  ...point(
    "a-peak-of-the-derivative-is-not-a-peak-of-the-function",
    ["A peak of the derivative is not a peak of the function", "导数的峰值不是函数的峰值"],
    [
      "It is easy to read the graph of $f'$ as if it were $f$. The height of $f'$ gives the slope of $f$: its sign shows whether $f$ rises or falls. A local maximum or minimum of $f'$ is where the slope is most extreme, which is an inflection point of $f$, not an extremum. If $f'(x) = 4 - x^{2}$, its graph has a peak at $(0, 4)$. There $f'(0) = 4 > 0$, so $f$ is rising, not at a peak, and $f$ changes from concave up to concave down: a point of inflection.\n\nCheck: $f''(x) = -2x$ is positive for $x < 0$ and negative for $x > 0$, so the concavity of $f$ does change at $0$.\n\n> **Watch out.** The extrema of $f$ are where the graph of $f'$ crosses the axis, not where it peaks. A peak of $f'$ above the axis is where $f$ climbs fastest.",
      "很容易把 $f'$ 的图像误读成 $f$ 的图像。$f'$ 的高度给出 $f$ 的斜率：它的符号说明 $f$ 上升还是下降。$f'$ 的局部极大或极小值是斜率最极端的地方，那是 $f$ 的拐点，而不是极值点。若 $f'(x) = 4 - x^{2}$，它的图像在 $(0, 4)$ 处有峰。那里 $f'(0) = 4 > 0$，所以 $f$ 在上升，并不在峰顶，而 $f$ 由上凹变为下凹：这是拐点。\n\n检验：$f''(x) = -2x$ 当 $x < 0$ 时为正，当 $x > 0$ 时为负，所以 $f$ 的凹凸性确实在 $0$ 处改变。\n\n> **注意。** $f$ 的极值在 $f'$ 的图像穿过 $x$ 轴的地方，而不是在它的峰处。$f'$ 在 $x$ 轴上方的峰是 $f$ 上升最快的地方。",
    ],
    (rng) => {
      const c = rng.int(-6, 6);
      const v = nz(rng, 9);
      const peak = rng.bool();
      const dir: Pair = v > 0 ? ["increasing", "递增"] : ["decreasing", "递减"];
      const sign: Pair = v > 0 ? ["positive", "正"] : ["negative", "负"];
      const shift = c === 0 ? "x" : `(${minus(c)})`;
      const model = `${v} ${peak ? "-" : "+"} ${power(c, 2)}`;
      const second = `${peak ? "-2" : "2"}${shift}`;
      const extremum: Pair = [`$f$ has a local ${peak ? "maximum" : "minimum"}`, `$f$ 有局部${peak ? "极大值" : "极小值"}`];
      const height: Pair = [`$f$ has the value $${v}$ and a horizontal tangent`, `$f$ 的值是 $${v}$，并且有水平切线`];
      const opposite: Pair = [
        `$f$ is ${v > 0 ? "decreasing" : "increasing"} and has a point of inflection`,
        `$f$ ${v > 0 ? "递减" : "递增"}，并且有拐点`,
      ];
      return reasoned(
        choose(
          rng,
          [
            `The graph of $f'$ has a local ${peak ? "maximum" : "minimum"} at $(${c}, ${v})$. Which is true of $f$ at $x = ${c}$?`,
            `$f'$ 的图像在 $(${c}, ${v})$ 处有局部${peak ? "极大值" : "极小值"}。关于 $f$ 在 $x = ${c}$ 处，哪项正确？`,
          ],
          [`$f$ is ${dir[0]} and has a point of inflection`, `$f$ ${dir[1]}，并且有拐点`],
          [extremum, height, opposite],
          walkPair(
            [
              [
                "Read the sign of f'",
                "读 f' 的符号",
                `$f'(${c}) = ${v}$, which is ${sign[0]}, so $f$ is ${dir[0]} at $x = ${c}$ and has no extremum there.`,
                `$f'(${c}) = ${v}$ 为${sign[1]}，所以 $f$ 在 $x = ${c}$ 处${dir[1]}，那里没有极值。`,
              ],
              [
                "Read the turn of f'",
                "读 f' 的转向",
                `$f'$ has a local ${peak ? "maximum" : "minimum"} at $x = ${c}$, so it changes from ${peak ? "increasing to decreasing" : "decreasing to increasing"} there. So $f$ changes from concave ${peak ? "up to concave down" : "down to concave up"}: a point of inflection.`,
                `$f'$ 在 $x = ${c}$ 处有局部${peak ? "极大值" : "极小值"}，所以它在那里${peak ? "由递增变为递减" : "由递减变为递增"}。于是 $f$ ${peak ? "由上凹变为下凹" : "由下凹变为上凹"}：这是拐点。`,
              ],
            ],
            [
              `Take $f'(x) = ${model}$, which has this ${peak ? "peak" : "valley"}. Then $f''(x) = ${second}$ changes sign at $x = ${c}$, while $f'$ stays ${sign[0]} near $x = ${c}$.`,
              `取 $f'(x) = ${model}$，它有这样的${peak ? "峰" : "谷"}。于是 $f''(x) = ${second}$ 在 $x = ${c}$ 处变号，而 $f'$ 在 $x = ${c}$ 附近保持为${sign[1]}。`,
            ],
          ),
        ),
        [
          [
            extremum[0],
            `That would need $f'$ to change sign at $x = ${c}$, but $f'(${c}) = ${v}$ is not zero.`,
            `那需要 $f'$ 在 $x = ${c}$ 处变号，但 $f'(${c}) = ${v}$ 不为零。`,
          ],
          [
            height[0],
            `$${v}$ is the slope of $f$ at $x = ${c}$, not its value, and the tangent is horizontal only where $f' = 0$.`,
            `$${v}$ 是 $f$ 在 $x = ${c}$ 处的斜率，不是函数值；只有 $f' = 0$ 的地方切线才水平。`,
          ],
          [
            opposite[0],
            `$f'(${c}) = ${v}$ is ${sign[0]}, so $f$ is ${dir[0]} there.`,
            `$f'(${c}) = ${v}$ 为${sign[1]}，所以 $f$ 在那里${dir[1]}。`,
          ],
        ],
      );
    },
  ),
  figure: calculusDrawings2["interpreting-the-graph-of-a-functions-derivative#a-peak-of-the-derivative-is-not-a-peak-of-the-function"],
};

const shapeFromDerivativeValues = point(
  "the-shape-from-values-of-the-derivative",
  ["The shape from values of the derivative", "由导数值判断形状"],
  [
    "Two separate readings: the sign of $f'$ says whether $f$ rises or falls, and whether $f'$ goes up or down says the concavity. So negative values of $f'$ moving toward zero mean $f$ falls, more and more slowly, and is concave up.\n\nCheck: $f(x) = x^{2}$ on $[-3, -1]$ has $f'(x) = 2x$, with values $-6$, $-4$ and $-2$ at $x = -3, -2, -1$: negative and increasing. Its graph falls and is concave up there, as the two readings say.\n\n> **Watch out.** Do not read the size of the values as the direction of $f$. Values of $f'$ that shrink toward zero from below still mean that $f$ is falling.",
    "这是两个独立的判断：$f'$ 的符号说明 $f$ 上升还是下降，$f'$ 的增减说明凹凸性。所以 $f'$ 的负值逐渐接近零，意味着 $f$ 在下降且越降越慢，图像上凹。\n\n检验：$f(x) = x^{2}$ 在 $[-3, -1]$ 上有 $f'(x) = 2x$，在 $x = -3, -2, -1$ 处的值为 $-6$、$-4$、$-2$：为负且在增大。它的图像在那里下降且上凹，与两个判断一致。\n\n> **注意。** 不要把数值的大小当成 $f$ 的方向。$f'$ 的值从下方向零靠近，仍然意味着 $f$ 在下降。",
  ],
  (rng) => {
    const x0 = rng.int(-6, 3);
    const w = rng.int(1, 2);
    const positive = rng.bool();
    const up = rng.bool();
    const steps = [rng.int(1, 5), rng.int(1, 5)];
    const lo = rng.int(1, 6);
    const mags = [lo, lo + steps[0]!, lo + steps[0]! + steps[1]!];
    const rising = positive ? up : !up;
    const ordered = rising ? mags : [...mags].reverse();
    const vals = ordered.map((m) => (positive ? m : -m));
    const xs = [x0, x0 + w, x0 + 2 * w];
    const table = `| $x$ | ${xs.map((x) => `$${x}$`).join(" | ")} |\n| :---: | :---: | :---: | :---: |\n| $f'(x)$ | ${vals.map((v) => `$${v}$`).join(" | ")} |`;
    const text = (inc: boolean, cup: boolean): Pair => [
      `$f$ is ${inc ? "increasing" : "decreasing"} and concave ${cup ? "up" : "down"}`,
      `$f$ ${inc ? "递增" : "递减"}且${cup ? "上凹" : "下凹"}`,
    ];
    const [d1, d2] = [vals[1]! - vals[0]!, vals[2]! - vals[1]!];
    const rates = [Q.of(d1, w), Q.of(d2, w)].map((q) => q.toLatex());
    return reasoned(
      choose(
        rng,
        [
          `The derivative $f'$ is monotonic on $[${xs[0]}, ${xs[2]}]$, keeps its sign there, and has these values.\n\n${table}\n\nWhich describes $f$ on this interval?`,
          `导数 $f'$ 在 $[${xs[0]}, ${xs[2]}]$ 上单调且不变号，取值如下。\n\n${table}\n\n$f$ 在这个区间上的情况是哪一项？`,
        ],
        text(positive, up),
        [text(!positive, up), text(positive, !up), text(!positive, !up)],
        walkPair(
          [
            [
              "Read the sign",
              "读符号",
              `The values of $f'$ are ${positive ? "positive, so $f$ is increasing" : "negative, so $f$ is decreasing"}.`,
              `$f'$ 的值${positive ? "为正，所以 $f$ 递增" : "为负，所以 $f$ 递减"}。`,
            ],
            [
              "Read the trend",
              "读增减",
              `From left to right the values ${up ? "increase, so $f'$ is increasing and $f$ is concave up" : "decrease, so $f'$ is decreasing and $f$ is concave down"}.`,
              `从左到右这些值${up ? "在增大，所以 $f'$ 递增，$f$ 上凹" : "在减小，所以 $f'$ 递减，$f$ 下凹"}。`,
            ],
          ],
          [
            `The average rates of change of $f'$ over the two steps are $${rates[0]}$ and $${rates[1]}$. Both are ${up ? "positive" : "negative"}, so $f''$ is ${up ? "positive" : "negative"} on average, which again gives concave ${up ? "up" : "down"}.`,
            `$f'$ 在两步上的平均变化率分别是 $${rates[0]}$ 和 $${rates[1]}$。两者都${up ? "为正" : "为负"}，所以 $f''$ 平均${up ? "为正" : "为负"}，同样得出${up ? "上凹" : "下凹"}。`,
          ],
        ),
      ),
      [
        [
          text(!positive, up)[0],
          `The values of $f'$ are ${positive ? "positive" : "negative"}, so $f$ is ${positive ? "increasing" : "decreasing"}.`,
          `$f'$ 的值${positive ? "为正" : "为负"}，所以 $f$ ${positive ? "递增" : "递减"}。`,
        ],
        [
          text(positive, !up)[0],
          `The values of $f'$ ${up ? "increase" : "decrease"}, so $f$ is concave ${up ? "up" : "down"}.`,
          `$f'$ 的值在${up ? "增大" : "减小"}，所以 $f$ ${up ? "上凹" : "下凹"}。`,
        ],
        [
          text(!positive, !up)[0],
          "Both readings are reversed: check the sign of $f'$ and whether its values go up or down.",
          "两个判断都反了：要看 $f'$ 的符号，以及它的值是增大还是减小。",
        ],
      ],
    );
  },
);

const areaUnderSlopedDerivative = {
  ...point(
    "values-from-a-sloped-segment-of-the-derivative",
    ["Values from a sloped segment of the derivative", "由导数的斜线段求函数值"],
    [
      "The change in $f$ over an interval is the signed area under the graph of $f'$. When $f'$ is a sloped segment that area is a trapezoid, so the change is the average of the two end values of $f'$ times the width. If $f'$ goes from $2$ at $x = 0$ to $6$ at $x = 3$, the change in $f$ over $[0, 3]$ is\n\n$$\\frac{2 + 6}{2} \\cdot 3 = 12.$$\n\nCheck: this segment is $f'(x) = 2 + \\frac{4}{3}x$, and $f(x) = 2x + \\frac{2}{3}x^{2}$ has it as derivative, with $f(3) - f(0) = 6 + 6 = 12$.\n\n> **Watch out.** Use the average of the two end values. Multiplying the width by just one end value counts a rectangle instead of the trapezoid.",
      "$f$ 在区间上的变化量等于 $f'$ 图像下的有向面积。当 $f'$ 是斜线段时，这个面积是梯形，所以变化量等于 $f'$ 两端值的平均数乘以宽度。若 $f'$ 从 $x = 0$ 处的 $2$ 变到 $x = 3$ 处的 $6$，则 $f$ 在 $[0, 3]$ 上的变化量为\n\n$$\\frac{2 + 6}{2} \\cdot 3 = 12.$$\n\n检验：这条线段是 $f'(x) = 2 + \\frac{4}{3}x$，而 $f(x) = 2x + \\frac{2}{3}x^{2}$ 以它为导数，$f(3) - f(0) = 6 + 6 = 12$。\n\n> **注意。** 要用两端值的平均数。只用一端的值乘以宽度，算的是矩形而不是梯形。",
    ],
    (rng) => {
      const a = rng.int(-6, 2);
      const w = rng.int(2, 5);
      const b = a + w;
      const u = rng.int(-6, 6);
      const v = rng.pick([-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].filter((x) => x !== u));
      const start = rng.int(-8, 8);
      const change = Q.of((u + v) * w, 2);
      const answer = change.add(Q.of(start));
      const pr = (q: Q) => (q.sign() < 0 ? `\\left(${q.toLatex()}\\right)` : q.toLatex());
      const triangle = Q.of((v - u) * w, 2);
      return ask(
        [
          `The graph of $f'$ on $[${a}, ${b}]$ is the line segment from $(${a}, ${u})$ to $(${b}, ${v})$, and $f(${a}) = ${start}$. Find $f(${b})$.`,
          `$f'$ 在 $[${a}, ${b}]$ 上的图像是从 $(${a}, ${u})$ 到 $(${b}, ${v})$ 的线段，且 $f(${a}) = ${start}$。求 $f(${b})$。`,
        ],
        answer,
        [Q.of(start + v * w), Q.of(start + u * w), Q.of(start + v - u), change],
        walkPair(
          [
            [
              "Find the signed area",
              "求有向面积",
              `The area under the segment is a trapezoid of width $${w}$:\n\n$$\\frac{${paren(u)} + ${paren(v)}}{2} \\cdot ${w} = ${change.toLatex()}$$`,
              `线段下方的面积是宽为 $${w}$ 的梯形：\n\n$$\\frac{${paren(u)} + ${paren(v)}}{2} \\cdot ${w} = ${change.toLatex()}$$`,
            ],
            [
              "Add it to the starting value",
              "加到起始值上",
              `This is the change in $f$, so\n\n$$f(${b}) = ${start} + ${pr(change)} = ${answer.toLatex()}$$`,
              `这就是 $f$ 的变化量，所以\n\n$$f(${b}) = ${start} + ${pr(change)} = ${answer.toLatex()}$$`,
            ],
          ],
          [
            `Split the trapezoid into a rectangle of height $${u}$ and a triangle of height $${v - u}$:\n\n$$${paren(u)} \\cdot ${w} + \\frac{${paren(v - u)} \\cdot ${w}}{2} = ${u * w} + ${pr(triangle)} = ${change.toLatex()}$$\n\nThis is the same change.`,
            `把梯形分成高为 $${u}$ 的矩形和高为 $${v - u}$ 的三角形：\n\n$$${paren(u)} \\cdot ${w} + \\frac{${paren(v - u)} \\cdot ${w}}{2} = ${u * w} + ${pr(triangle)} = ${change.toLatex()}$$\n\n得到同样的变化量。`,
          ],
        ),
      );
    },
  ),
  figure: calculusDrawings2["sketching-a-function-from-the-graph-of-its-derivative#values-from-a-sloped-segment-of-the-derivative"],
};

const secondTestSilent = point(
  "when-the-second-derivative-test-says-nothing",
  ["When the second derivative test says nothing", "二阶导数判别法失效时"],
  [
    "If $f'(a) = 0$ and $f''(a) = 0$, the second derivative test gives no information: $f$ may have a minimum, a maximum or neither. Look at the sign of $f'$ on each side instead. For $k(x - a)^{n}$ this depends on whether $n$ is even or odd. For $f(x) = x^{4}$ at $0$, $f'(0) = 0$ and $f''(0) = 0$, yet $f$ has a minimum there, while $x^{3}$ has neither.\n\nCheck: $f'(x) = 4x^{3}$ is negative for $x < 0$ and positive for $x > 0$, so $x^{4}$ falls and then rises.\n\n> **Watch out.** $f''(a) = 0$ does not mean there is no extremum, or that nothing can be said. It only means the second derivative test is silent; the first derivative test can still decide.",
    "如果 $f'(a) = 0$ 且 $f''(a) = 0$，二阶导数判别法不提供任何信息：$f$ 可能有极小值、极大值或都没有。这时要看 $f'$ 在两侧的符号。对 $k(x - a)^{n}$，结果取决于 $n$ 的奇偶。对 $0$ 处的 $f(x) = x^{4}$，$f'(0) = 0$，$f''(0) = 0$，但 $f$ 在那里有极小值，而 $x^{3}$ 既没有极大值也没有极小值。\n\n检验：$f'(x) = 4x^{3}$ 当 $x < 0$ 时为负，当 $x > 0$ 时为正，所以 $x^{4}$ 先降后升。\n\n> **注意。** $f''(a) = 0$ 既不意味着没有极值，也不意味着无法判断。它只说明二阶导数判别法失效；一阶导数判别法仍然可以判断。",
  ],
  (rng) => {
    const a = rng.int(-6, 6);
    const k = nz(rng, 5);
    const n = rng.int(3, 6);
    const b = rng.int(-6, 6);
    const f = poly([k, power(a, n)], [b, ""]);
    const even = n % 2 === 0;
    const min: Pair = ["A local minimum", "局部极小值"];
    const max: Pair = ["A local maximum", "局部极大值"];
    const neither: Pair = ["Neither a maximum nor a minimum", "既没有极大值也没有极小值"];
    const cannot: Pair = ["It cannot be decided, because $f''$ is zero there", "无法判断，因为 $f''$ 在该点为零"];
    const correct = even ? (k > 0 ? min : max) : neither;
    const tenth = Q.of(1, 10);
    const at = (h: Q) => {
      let p = Q.one;
      for (let i = 0; i < n; i++) p = p.mul(h);
      return dec(Q.of(k).mul(p).add(Q.of(b)));
    };
    const left = even ? (k > 0 ? -1 : 1) : k > 0 ? 1 : -1;
    const right = k > 0 ? 1 : -1;
    const word = (s: number): Pair => (s > 0 ? ["positive", "正"] : ["negative", "负"]);
    const odd = `An odd power changes sign at the point, so $f$ is above $f(${a})$ on one side and below it on the other.`;
    const oddZh = `奇数次幂在该点变号，所以 $f$ 在一侧大于 $f(${a})$，在另一侧小于它。`;
    return reasoned(
      choose(
        rng,
        [
          `$f(x) = ${f}$ has $f'(${a}) = 0$ and $f''(${a}) = 0$. What does $f$ have at $x = ${a}$?`,
          `$f(x) = ${f}$ 满足 $f'(${a}) = 0$ 且 $f''(${a}) = 0$。$f$ 在 $x = ${a}$ 处有什么？`,
        ],
        correct,
        [min, max, neither, cannot].filter((o) => o !== correct),
        walkPair(
          [
            [
              "Differentiate",
              "求导",
              `$f'(x) = ${poly([k * n, power(a, n - 1)])}$, with the ${even ? "odd" : "even"} power $${n - 1}$.`,
              `$f'(x) = ${poly([k * n, power(a, n - 1)])}$，指数 $${n - 1}$ 是${even ? "奇数" : "偶数"}。`,
            ],
            [
              "Read the sign of f' on each side",
              "读 f' 在两侧的符号",
              `Just left of $x = ${a}$, $f'$ is ${word(left)[0]}, and just right of it, $f'$ is ${word(right)[0]}. ${even ? `So $f$ ${left < 0 ? "falls and then rises: a local minimum" : "rises and then falls: a local maximum"}.` : "$f'$ keeps its sign, so there is no extremum."}`,
              `在 $x = ${a}$ 左侧 $f'$ 为${word(left)[1]}，右侧为${word(right)[1]}。${even ? `所以 $f$ ${left < 0 ? "先降后升：局部极小值" : "先升后降：局部极大值"}。` : "$f'$ 不变号，所以没有极值。"}`,
            ],
          ],
          [
            `Compare values: $f(${dec(Q.of(a).sub(tenth))}) = ${at(tenth.neg())}$, $f(${a}) = ${b}$ and $f(${dec(Q.of(a).add(tenth))}) = ${at(tenth)}$. ${even ? `Both neighbours are ${k > 0 ? "above" : "below"} $f(${a})$.` : `One neighbour is above $f(${a})$ and the other below.`}`,
            `比较函数值：$f(${dec(Q.of(a).sub(tenth))}) = ${at(tenth.neg())}$，$f(${a}) = ${b}$，$f(${dec(Q.of(a).add(tenth))}) = ${at(tenth)}$。${even ? `两侧的值都${k > 0 ? "大于" : "小于"} $f(${a})$。` : `一侧大于 $f(${a})$，另一侧小于它。`}`,
          ],
        ),
      ),
      [
        [
          min[0],
          even ? `The coefficient $${k}$ is negative, so $f$ is below $f(${a})$ on both sides.` : odd,
          even ? `系数 $${k}$ 为负，所以 $f$ 在两侧都小于 $f(${a})$。` : oddZh,
        ],
        [
          max[0],
          even ? `The coefficient $${k}$ is positive, so $f$ is above $f(${a})$ on both sides.` : odd,
          even ? `系数 $${k}$ 为正，所以 $f$ 在两侧都大于 $f(${a})$。` : oddZh,
        ],
        [
          neither[0],
          `The power $${n}$ is even, so $f - f(${a})$ has the same sign on both sides: there is an extremum.`,
          `指数 $${n}$ 是偶数，所以 $f - f(${a})$ 在两侧同号：有极值。`,
        ],
        [
          cannot[0],
          "The second derivative test is silent, but the sign of $f'$ on each side still decides.",
          "二阶导数判别法失效，但 $f'$ 在两侧的符号仍然可以判断。",
        ],
      ],
    );
  },
);

const overOrUnderTrig = {
  ...point(
    "whether-a-trigonometric-linearization-is-too-high-or-too-low",
    ["Whether a linearization is too high or too low", "线性近似偏高还是偏低"],
    [
      "A tangent line lies above a concave-down graph and below a concave-up one. So the sign of $f''$ on the side of the point decides whether the linearization overestimates or underestimates. Sine and tangent change concavity at $0$, so the side matters. For $\\sin x$ at $x = 0.1$, $f''(x) = -\\sin x$ is negative between $0$ and $0.1$, so $L(0.1) = 0.1$ is too high.\n\nCheck: a calculator gives $\\sin 0.1 \\approx 0.0998$, just below $0.1$.\n\n> **Watch out.** For sine and tangent the answer changes with the side of $0$. At $x = -0.1$, $\\sin x$ is concave up, and $L(-0.1) = -0.1$ is too low.",
      "切线位于下凹图像的上方、上凹图像的下方。所以该点那一侧 $f''$ 的符号决定线性近似是偏高还是偏低。正弦和正切在 $0$ 处改变凹凸性，所以哪一侧很重要。对 $x = 0.1$ 处的 $\\sin x$，$f''(x) = -\\sin x$ 在 $0$ 与 $0.1$ 之间为负，所以 $L(0.1) = 0.1$ 偏高。\n\n检验：计算器给出 $\\sin 0.1 \\approx 0.0998$，略小于 $0.1$。\n\n> **注意。** 对正弦和正切，结论随 $0$ 的哪一侧而变。在 $x = -0.1$ 处 $\\sin x$ 上凹，$L(-0.1) = -0.1$ 偏低。",
    ],
    (rng) => {
      const kind = rng.pick(["sin", "tan", "cos"] as const);
      const k = nz(rng, 5);
      const i = rng.pick([-1, 1]) * rng.int(2, 20);
      const x = Q.of(i, 100);
      const positive = i > 0;
      const f2 = kind === "sin" ? (positive ? -k : k) : kind === "tan" ? (positive ? k : -k) : -k;
      const under = f2 > 0;
      const f = poly([k, `\\${kind} x`]);
      const L = kind === "cos" ? `${k}` : poly([k, "x"]);
      const second = kind === "sin" ? poly([-k, "\\sin x"]) : kind === "tan" ? poly([2 * k, "\\sec^{2} x \\tan x"]) : poly([-k, "\\cos x"]);
      const xv = x.toNumber();
      const value = k * (kind === "sin" ? Math.sin(xv) : kind === "tan" ? Math.tan(xv) : Math.cos(xv));
      const line = kind === "cos" ? Q.of(k) : Q.of(k).mul(x);
      const eight = dec(Q.of(Math.round(value * 1e8), 1e8));
      const over: Pair = ["An overestimate", "偏高"];
      const low: Pair = ["An underestimate", "偏低"];
      const exact: Pair = ["Exactly right, since $x$ is so small", "完全准确，因为 $x$ 很小"];
      return reasoned(
        choose(
          rng,
          [
            `Near $0$, the linearization of $f(x) = ${f}$ is $L(x) = ${L}$. What is $L(${dec(x)})$ compared with $f(${dec(x)})$?`,
            `在 $0$ 附近，$f(x) = ${f}$ 的线性近似是 $L(x) = ${L}$。$L(${dec(x)})$ 与 $f(${dec(x)})$ 相比如何？`,
          ],
          under ? low : over,
          [under ? over : low, exact],
          walkPair(
            [
              [
                "Find the sign of f''",
                "求 f'' 的符号",
                `$f''(x) = ${second}$. Between $0$ and $${dec(x)}$ it is ${under ? "positive" : "negative"}.`,
                `$f''(x) = ${second}$。在 $0$ 与 $${dec(x)}$ 之间它${under ? "为正" : "为负"}。`,
              ],
              [
                "Compare with the tangent",
                "与切线比较",
                `So the graph is concave ${under ? "up and lies above" : "down and lies below"} its tangent there, and the linearization is ${under ? "too low" : "too high"}.`,
                `所以图像在那里${under ? "上凹，位于切线上方" : "下凹，位于切线下方"}，线性近似${under ? "偏低" : "偏高"}。`,
              ],
            ],
            [
              `With a calculator, $f(${dec(x)}) \\approx ${eight}$, while $L(${dec(x)}) = ${dec(line)}$. The linearization is ${under ? "smaller" : "larger"}.`,
              `用计算器算，$f(${dec(x)}) \\approx ${eight}$，而 $L(${dec(x)}) = ${dec(line)}$。线性近似${under ? "更小" : "更大"}。`,
            ],
          ),
        ),
        [
          [over[0], "The graph lies above its tangent here, so the line is too low.", "这里图像在切线上方，所以直线偏低。"],
          [low[0], "The graph lies below its tangent here, so the line is too high.", "这里图像在切线下方，所以直线偏高。"],
          [
            exact[0],
            "A linearization is exact only where the graph is straight. Here $f'' \\ne 0$, so there is an error, however small $x$ is.",
            "只有图像是直线时线性近似才精确。这里 $f'' \\ne 0$，所以无论 $x$ 多小都有误差。",
          ],
        ],
      );
    },
  ),
  figure:
    calculusDrawings2[
      "approximating-trigonometric-functions-using-local-linearity#whether-a-trigonometric-linearization-is-too-high-or-too-low"
    ],
};

const leastPerimeterSector = {
  ...point(
    "the-least-perimeter-for-a-given-area",
    ["The least perimeter for a given area", "给定面积时的最小周长"],
    [
      "This is the reverse of the largest area for a given perimeter. With area $A$ and radius $r$, the arc is $\\frac{2A}{r}$, so the perimeter is $P = 2r + \\frac{2A}{r}$. Then $P'(r) = 0$ gives $r = \\sqrt{A}$ and $P = 4\\sqrt{A}$, and the central angle is $2$ radians, as before.\n\nFor example, with area $25$, $P(r) = 2r + \\frac{50}{r}$ and $P'(r) = 2 - \\frac{50}{r^{2}} = 0$ at $r = 5$. The arc is $10$ and the perimeter is $5 + 5 + 10 = 20$.\n\nCheck: $P(4) = 8 + 12.5 = 20.5$ and $P(6) = 12 + \\frac{50}{6} \\approx 20.33$, both more than $20$.\n\n> **Watch out.** The perimeter counts both radii as well as the arc, and the arc comes from the sector's area $\\frac{1}{2}rs$, not from $\\pi r^{2}$.",
      "这是给定周长求最大面积的逆问题。面积为 $A$、半径为 $r$ 时，弧长是 $\\frac{2A}{r}$，所以周长 $P = 2r + \\frac{2A}{r}$。由 $P'(r) = 0$ 得 $r = \\sqrt{A}$，$P = 4\\sqrt{A}$，圆心角同样是 $2$ 弧度。\n\n例如面积为 $25$ 时，$P(r) = 2r + \\frac{50}{r}$，$P'(r) = 2 - \\frac{50}{r^{2}}$ 在 $r = 5$ 处为零。弧长是 $10$，周长是 $5 + 5 + 10 = 20$。\n\n检验：$P(4) = 8 + 12.5 = 20.5$，$P(6) = 12 + \\frac{50}{6} \\approx 20.33$，都大于 $20$。\n\n> **注意。** 周长包括两条半径和弧；弧长由扇形面积 $\\frac{1}{2}rs$ 求得，而不是由 $\\pi r^{2}$。",
    ],
    (rng) => {
      const m = rng.int(2, 40);
      const A = m * m;
      const unit = rng.pick([
        ["cm", "厘米"],
        ["m", "米"],
      ] as const);
      return numberProblem({
        prompt: t(
          `A sector of a circle has area $${A}$ ${unit[0]}². Find the least possible perimeter, in ${unit[0]}, including both radii and the arc.`,
          `一个扇形的面积是 $${A}$ 平方${unit[1]}。求它的最小周长（包括两条半径和弧），单位是${unit[1]}。`,
        ),
        answer: 4 * m,
        mistakes: distinctWhys([
          why(
            2 * m,
            `This is the arc alone, $${2 * m}$ ${unit[0]}; the perimeter adds the two radii.`,
            `这只是弧长 $${2 * m}$ ${unit[1]}；周长还要加上两条半径。`,
          ),
          why(m, "This is the best radius, not the perimeter.", "这是最佳半径，不是周长。"),
          why(3 * m, "This counts only one radius; the perimeter is $r + r + s$.", "这只算了一条半径；周长是 $r + r + s$。"),
        ]),
        solution: t(
          ...walkPair(
            [
              [
                "Write the arc in terms of $r$",
                "用 $r$ 表示弧长",
                `The area is $\\frac{1}{2}rs = ${A}$, so the arc is $s = \\frac{${2 * A}}{r}$.`,
                `面积 $\\frac{1}{2}rs = ${A}$，所以弧长 $s = \\frac{${2 * A}}{r}$。`,
              ],
              [
                "Minimize the perimeter",
                "求周长的最小值",
                `$P(r) = 2r + \\frac{${2 * A}}{r}$, and $P'(r) = 2 - \\frac{${2 * A}}{r^{2}} = 0$ gives $r^{2} = ${A}$, so $r = ${m}$.`,
                `$P(r) = 2r + \\frac{${2 * A}}{r}$，由 $P'(r) = 2 - \\frac{${2 * A}}{r^{2}} = 0$ 得 $r^{2} = ${A}$，所以 $r = ${m}$。`,
              ],
              [
                "Find the perimeter",
                "求周长",
                `The arc is $\\frac{${2 * A}}{${m}} = ${2 * m}$, so $P = ${m} + ${m} + ${2 * m} = ${4 * m}$ ${unit[0]}.`,
                `弧长是 $\\frac{${2 * A}}{${m}} = ${2 * m}$，所以 $P = ${m} + ${m} + ${2 * m} = ${4 * m}$ ${unit[1]}。`,
              ],
            ],
            [
              `$P(r) - ${4 * m} = \\frac{2r^{2} - ${4 * m}r + ${2 * A}}{r} = \\frac{2(r - ${m})^{2}}{r}$, which is never negative and is zero only at $r = ${m}$. So $${4 * m}$ is the least perimeter.`,
              `$P(r) - ${4 * m} = \\frac{2r^{2} - ${4 * m}r + ${2 * A}}{r} = \\frac{2(r - ${m})^{2}}{r}$，它不会为负，只在 $r = ${m}$ 时为零。所以 $${4 * m}$ 是最小周长。`,
            ],
          ),
        ),
      });
    },
  ),
  figure: calculusDrawings3["optimization-problems-involving-sectors-of-circles#the-least-perimeter-for-a-given-area"],
};

/** sheets are rectangular sheets whose best tray has a rational height: the two sides and that height, for scale 1. */
const sheets = [
  { w: 5, l: 8, x: Q.of(1), other: Q.of(10, 3) },
  { w: 8, l: 15, x: Q.of(5, 3), other: Q.of(6) },
  { w: 16, l: 21, x: Q.of(3), other: Q.of(28, 3) },
] as const;

const trayFromRectangle = point(
  "trays-folded-from-rectangular-sheets",
  ["Trays folded from rectangular sheets", "用长方形纸板折成的盘子"],
  [
    "With unequal sides $w$ and $l$, the volume is $V(x) = x(w - 2x)(l - 2x)$, and $V'(x) = 0$ is a quadratic with two roots. Only a root with $0 < x < \\frac{w}{2}$ makes a tray, and the shortcut $x = \\frac{w}{6}$ for a square sheet no longer applies.\n\nFor example, for a $5$ by $8$ sheet, $V(x) = x(5 - 2x)(8 - 2x) = 4x^{3} - 26x^{2} + 40x$ and $V'(x) = 12x^{2} - 52x + 40 = 4(3x - 10)(x - 1)$. The root $\\frac{10}{3}$ is more than $2.5$, so $x = 1$ and $V = 1 \\cdot 3 \\cdot 6 = 18$.\n\nCheck: $V(0.9) = 0.9 \\cdot 3.2 \\cdot 6.2 \\approx 17.86$ and $V(1.1) = 1.1 \\cdot 2.8 \\cdot 5.8 \\approx 17.86$, both less than $18$.\n\n> **Watch out.** Discard a root of $V'$ above $\\frac{w}{2}$, and do not use $\\frac{w}{6}$: here it gives $V\\left(\\frac{5}{6}\\right) \\approx 17.59$, less than $18$.",
    "两边 $w$ 和 $l$ 不相等时，容积是 $V(x) = x(w - 2x)(l - 2x)$，$V'(x) = 0$ 是有两个根的二次方程。只有满足 $0 < x < \\frac{w}{2}$ 的根才能折成盘子，而且正方形纸板的简便结论 $x = \\frac{w}{6}$ 不再适用。\n\n例如 $5$ 乘 $8$ 的纸板，$V(x) = x(5 - 2x)(8 - 2x) = 4x^{3} - 26x^{2} + 40x$，$V'(x) = 12x^{2} - 52x + 40 = 4(3x - 10)(x - 1)$。根 $\\frac{10}{3}$ 超过 $2.5$，所以 $x = 1$，$V = 1 \\cdot 3 \\cdot 6 = 18$。\n\n检验：$V(0.9) = 0.9 \\cdot 3.2 \\cdot 6.2 \\approx 17.86$，$V(1.1) = 1.1 \\cdot 2.8 \\cdot 5.8 \\approx 17.86$，都小于 $18$。\n\n> **注意。** 舍去大于 $\\frac{w}{2}$ 的根，也不要用 $\\frac{w}{6}$：这里它给出 $V\\left(\\frac{5}{6}\\right) \\approx 17.59$，小于 $18$。",
  ],
  (rng) => {
    const s = rng.pick(sheets);
    const k = rng.int(1, 10);
    const w = s.w * k;
    const l = s.l * k;
    const x = s.x.mul(Q.of(k));
    const other = s.other.mul(Q.of(k));
    const vol = (h: Q) => h.mul(Q.of(w).sub(h.mul(Q.of(2)))).mul(Q.of(l).sub(h.mul(Q.of(2))));
    const six = Q.of(w, 6);
    const long = Q.of(l, 6);
    const askVolume = rng.bool();
    const setup: Pair = [
      `An open tray is made from a $${w}$ cm by $${l}$ cm sheet by cutting equal squares from the corners and folding up the sides.`,
      `把一张 $${w}$ 厘米乘 $${l}$ 厘米的纸板四角各剪去相同的正方形，折起四边做成无盖盘子。`,
    ];
    const cubic = poly([4, "x^{3}"], [-2 * (w + l), "x^{2}"], [w * l, "x"]);
    const quad = poly([12, "x^{2}"], [-4 * (w + l), "x"], [w * l, ""]);
    const base = [Q.of(w).sub(x.mul(Q.of(2))), Q.of(l).sub(x.mul(Q.of(2)))];
    const steps: [string, string, string, string][] = [
      [
        "Write the volume",
        "写出容积",
        `Cutting squares of side $x$ leaves a base $${w} - 2x$ by $${l} - 2x$, so $V(x) = x(${w} - 2x)(${l} - 2x) = ${cubic}$.`,
        `剪去边长为 $x$ 的正方形后，底面是 $${w} - 2x$ 乘 $${l} - 2x$，所以 $V(x) = x(${w} - 2x)(${l} - 2x) = ${cubic}$。`,
      ],
      [
        "Differentiate",
        "求导",
        `$V'(x) = ${quad} = 0$ has the roots $x = ${x.toLatex()}$ and $x = ${other.toLatex()}$.`,
        `$V'(x) = ${quad} = 0$ 的根是 $x = ${x.toLatex()}$ 和 $x = ${other.toLatex()}$。`,
      ],
      [
        "Keep the root that makes a tray",
        "保留能折成盘子的根",
        `$${other.toLatex()}$ is more than half of $${w}$ and would leave no base, so the height is $${x.toLatex()}$ cm.`,
        `$${other.toLatex()}$ 超过 $${w}$ 的一半，会使底面不存在，所以高是 $${x.toLatex()}$ 厘米。`,
      ],
    ];
    if (askVolume)
      steps.push([
        "Find the volume",
        "求容积",
        `$V\\left(${x.toLatex()}\\right) = ${x.toLatex()} \\cdot ${base[0]!.toLatex()} \\cdot ${base[1]!.toLatex()} = ${vol(x).toLatex()}$ cm³.`,
        `$V\\left(${x.toLatex()}\\right) = ${x.toLatex()} \\cdot ${base[0]!.toLatex()} \\cdot ${base[1]!.toLatex()} = ${vol(x).toLatex()}$ 立方厘米。`,
      ]);
    const solution = t(
      ...walkPair(steps, [
        `$V'(x) = 12\\left(x - ${x.toLatex()}\\right)\\left(x - ${other.toLatex()}\\right)$ is positive for $0 < x < ${x.toLatex()}$ and negative for $${x.toLatex()} < x < ${Q.of(w, 2).toLatex()}$. So $V$ rises and then falls, and $x = ${x.toLatex()}$ gives the largest volume.`,
        `$V'(x) = 12\\left(x - ${x.toLatex()}\\right)\\left(x - ${other.toLatex()}\\right)$ 在 $0 < x < ${x.toLatex()}$ 时为正，在 $${x.toLatex()} < x < ${Q.of(w, 2).toLatex()}$ 时为负。所以 $V$ 先增后减，$x = ${x.toLatex()}$ 时容积最大。`,
      ]),
    );
    return askVolume
      ? numberProblem({
          prompt: t(`${setup[0]} Find the largest possible volume, in cm³.`, `${setup[1]}求最大容积，单位是立方厘米。`),
          answer: vol(x),
          mistakes: distinctWhys([
            why(
              vol(six),
              `This uses the square-sheet height $\\frac{${w}}{6}$, which does not give the largest volume when the sides differ.`,
              `这用了正方形纸板的高 $\\frac{${w}}{6}$，两边不等时它给不出最大容积。`,
            ),
            why(
              Q.of(w * l).mul(x),
              `This multiplies the whole sheet by the height; cutting the corners shrinks the base to $(${w} - 2x)(${l} - 2x)$.`,
              `这是用整张纸板的面积乘以高；剪去四角后底面缩小为 $(${w} - 2x)(${l} - 2x)$。`,
            ),
            why(
              vol(long),
              `This uses the height $\\frac{${l}}{6}$, the square-sheet shortcut applied to the long side.`,
              `这用了高 $\\frac{${l}}{6}$，即把正方形纸板的简便结论用在长边上。`,
            ),
            why(
              vol(other),
              `This uses the other root $${other.toLatex()}$, which makes $${w} - 2x$ negative.`,
              `这用了另一个根 $${other.toLatex()}$，它使 $${w} - 2x$ 为负。`,
            ),
          ]),
          solution,
        })
      : numberProblem({
          prompt: t(`${setup[0]} Find the height, in cm, that gives the largest volume.`, `${setup[1]}求使容积最大的高，单位是厘米。`),
          answer: x,
          mistakes: distinctWhys([
            why(
              six,
              `This is the square-sheet shortcut $\\frac{${w}}{6}$, which does not apply when the sides differ.`,
              `这是正方形纸板的简便结论 $\\frac{${w}}{6}$，两边不等时不适用。`,
            ),
            why(
              other,
              `This is the other root of $V'(x) = 0$; it is more than half of $${w}$, so there would be no base.`,
              `这是 $V'(x) = 0$ 的另一个根；它超过 $${w}$ 的一半，底面就不存在了。`,
            ),
            why(
              long,
              `This is $\\frac{${l}}{6}$, the square-sheet shortcut applied to the long side.`,
              `这是 $\\frac{${l}}{6}$，即把正方形纸板的简便结论用在长边上。`,
            ),
          ]),
          solution,
        });
  },
);

const leastDistanceSquared = {
  ...point(
    "the-least-distance-and-an-endpoint-trap",
    ["The least distance and an endpoint trap", "最短距离与端点陷阱"],
    [
      "To minimize distance, minimize its square. For $y = \\sqrt{kx}$ and the point $(a, 0)$, $D^{2} = (x - a)^{2} + kx$, a parabola in $x$ with vertex at $x = a - \\frac{k}{2}$. But the curve only has $x \\ge 0$: if the vertex is negative, the closest point is the endpoint $(0, 0)$.\n\nFor example, for $y = \\sqrt{2x}$ and the point $(3, 0)$, $D^{2} = (x - 3)^{2} + 2x = x^{2} - 4x + 9$, with vertex $x = 2$ and $D^{2} = 5$. For $y = \\sqrt{4x}$ and $(1, 0)$ the vertex is $x = -1$, off the curve, so the closest point is $(0, 0)$ with $D^{2} = 1$.\n\nCheck: on $y = \\sqrt{2x}$, $x = 1$ and $x = 3$ both give $D^{2} = 6$, more than $5$.\n\n> **Watch out.** Check that the vertex has $x \\ge 0$ before using it; otherwise the endpoint gives the least distance.",
      "要使距离最小，就使它的平方最小。对 $y = \\sqrt{kx}$ 和点 $(a, 0)$，$D^{2} = (x - a)^{2} + kx$ 是关于 $x$ 的抛物线，顶点在 $x = a - \\frac{k}{2}$。但曲线只有 $x \\ge 0$ 的部分：如果顶点为负，最近的点就是端点 $(0, 0)$。\n\n例如对 $y = \\sqrt{2x}$ 和点 $(3, 0)$，$D^{2} = (x - 3)^{2} + 2x = x^{2} - 4x + 9$，顶点 $x = 2$，$D^{2} = 5$。对 $y = \\sqrt{4x}$ 和点 $(1, 0)$，顶点 $x = -1$ 不在曲线上，所以最近点是 $(0, 0)$，$D^{2} = 1$。\n\n检验：在 $y = \\sqrt{2x}$ 上，$x = 1$ 和 $x = 3$ 都给出 $D^{2} = 6$，大于 $5$。\n\n> **注意。** 用顶点之前先检查它是否满足 $x \\ge 0$；否则最短距离在端点取到。",
    ],
    (rng) => {
      const k = rng.int(1, 8);
      const a = rng.int(1, 9);
      const vertex = Q.of(2 * a - k, 2);
      const inside = vertex.sign() > 0;
      const formula = Q.of(k * a).sub(Q.of(k * k, 4));
      const answer = inside ? formula : Q.of(a * a);
      const f = k === 1 ? "\\sqrt{x}" : `\\sqrt{${k}x}`;
      const v = vertex.toLatex();
      const d2 = poly([1, "x^{2}"], [k - 2 * a, "x"], [a * a, ""]);
      const rest = formula.isZero() ? "" : ` ${formula.sign() < 0 ? "-" : "+"} ${formula.abs().toLatex()}`;
      const square = `${vertex.isZero() ? "x^{2}" : `\\left(${poly([1, "x"], [vertex.neg(), ""])}\\right)^{2}`}${rest}`;
      const last: [string, string, string, string] = inside
        ? [
            "Evaluate at the vertex",
            "在顶点处求值",
            `$x = ${v}$ is on the curve, so the least value is $D^{2} = ${answer.toLatex()}$.`,
            `$x = ${v}$ 在曲线上，所以最小值是 $D^{2} = ${answer.toLatex()}$。`,
          ]
        : [
            "Use the endpoint",
            "取端点",
            vertex.isZero()
              ? `The vertex is the endpoint $x = 0$, so the least value is $D^{2} = ${a * a}$.`
              : `$x = ${v}$ is not on the curve, and $D^{2}$ increases for $x \\ge 0$, so the least value is at $x = 0$, where $D^{2} = ${a * a}$.`,
            vertex.isZero()
              ? `顶点就是端点 $x = 0$，所以最小值是 $D^{2} = ${a * a}$。`
              : `$x = ${v}$ 不在曲线上，而 $D^{2}$ 在 $x \\ge 0$ 上递增，所以最小值在 $x = 0$ 处，$D^{2} = ${a * a}$。`,
          ];
      return numberProblem({
        prompt: t(
          `Find the square of the least distance from the point $(${a}, 0)$ to the curve $y = ${f}$.`,
          `求点 $(${a}, 0)$ 到曲线 $y = ${f}$ 的最短距离的平方。`,
        ),
        answer,
        mistakes: distinctWhys([
          inside
            ? why(
                a * a,
                `This is $D^{2}$ at the endpoint $(0, 0)$; the vertex $x = ${v}$ is on the curve and gives less.`,
                `这是端点 $(0, 0)$ 处的 $D^{2}$；顶点 $x = ${v}$ 在曲线上，给出的值更小。`,
              )
            : why(
                formula,
                `This uses the vertex $x = ${v}$, which is negative, so it is not on the curve.`,
                `这用了顶点 $x = ${v}$，它是负的，不在曲线上。`,
              ),
          why(
            vertex,
            `This is the $x$-coordinate ${inside ? "of the closest point" : "of the vertex"}, not a squared distance.`,
            `这是${inside ? "最近点" : "顶点"}的 $x$ 坐标，不是距离的平方。`,
          ),
          why(
            k * a,
            `This is $D^{2}$ at $x = ${a}$, the point of the curve straight above $(${a}, 0)$; ${inside ? "the closest point is further left" : "the endpoint is closer"}.`,
            `这是 $x = ${a}$ 处，即 $(${a}, 0)$ 正上方那一点的 $D^{2}$；${inside ? "最近点在它左边" : "端点更近"}。`,
          ),
        ]),
        solution: t(
          ...walkPair(
            [
              [
                "Write the squared distance",
                "写出距离的平方",
                `For $x \\ge 0$ a point of the curve is $(x, ${f})$, so $D^{2} = (x - ${a})^{2} + ${poly([k, "x"])} = ${d2}$.`,
                `当 $x \\ge 0$ 时，曲线上的点是 $(x, ${f})$，所以 $D^{2} = (x - ${a})^{2} + ${poly([k, "x"])} = ${d2}$。`,
              ],
              [
                "Find the vertex",
                "求顶点",
                `$\\frac{d}{dx}D^{2} = 2(x - ${a}) + ${k}$ is zero at $x = ${v}$.`,
                `$\\frac{d}{dx}D^{2} = 2(x - ${a}) + ${k}$ 在 $x = ${v}$ 处为零。`,
              ],
              last,
            ],
            inside
              ? [
                  `Completing the square, $D^{2} = ${square}$. The square is $0$ at $x = ${v}$, so the least value is $${formula.toLatex()}$.`,
                  `配方得 $D^{2} = ${square}$。平方项在 $x = ${v}$ 处为 $0$，所以最小值是 $${formula.toLatex()}$。`,
                ]
              : [
                  `Completing the square, $D^{2} = ${square}$. For $x \\ge 0$ the square is smallest at $x = 0$, which gives $D^{2} = ${a * a}$ again.`,
                  `配方得 $D^{2} = ${square}$。在 $x \\ge 0$ 上，平方项在 $x = 0$ 处最小，同样得 $D^{2} = ${a * a}$。`,
                ],
          ),
        ),
      });
    },
  ),
  figure: calculusDrawings3["optimizing-distances-to-curves#the-least-distance-and-an-endpoint-trap"],
};

const newtonOnQuadratic = {
  ...point(
    "one-newton-step-on-a-quadratic",
    ["One Newton step on a quadratic", "二次函数上的一步牛顿法"],
    [
      "For optimization, Newton's method uses $x_{1} = x_{0} - \\frac{f'(x_{0})}{f''(x_{0})}$, which is not the root-finding step $x_{0} - \\frac{f(x_{0})}{f'(x_{0})}$. On a quadratic, $f'$ is linear, so one step lands exactly on the vertex from any start: a useful check.\n\nFor example, for $f(x) = 2x^{2} - 8x + 3$ from $x_{0} = 5$, $f'(5) = 12$ and $f'' = 4$, so $x_{1} = 5 - \\frac{12}{4} = 2$, the vertex.\n\nCheck: $f'(2) = 4 \\cdot 2 - 8 = 0$, so $x_{1}$ is the stationary point.\n\n> **Watch out.** Divide $f'$ by $f''$, not $f$ by $f'$: the root-finding step would give $5 - \\frac{13}{12} = \\frac{47}{12}$ here.",
      "用于最优化时，牛顿法的迭代是 $x_{1} = x_{0} - \\frac{f'(x_{0})}{f''(x_{0})}$，而不是求根的迭代 $x_{0} - \\frac{f(x_{0})}{f'(x_{0})}$。对二次函数，$f'$ 是一次函数，所以从任何起点出发一步就恰好到达顶点：这是一个有用的检验。\n\n例如对 $f(x) = 2x^{2} - 8x + 3$，从 $x_{0} = 5$ 出发，$f'(5) = 12$，$f'' = 4$，所以 $x_{1} = 5 - \\frac{12}{4} = 2$，正是顶点。\n\n检验：$f'(2) = 4 \\cdot 2 - 8 = 0$，所以 $x_{1}$ 是驻点。\n\n> **注意。** 是用 $f'$ 除以 $f''$，不是用 $f$ 除以 $f'$：这里求根的迭代会给出 $5 - \\frac{13}{12} = \\frac{47}{12}$。",
    ],
    (rng) => {
      const a = nz(rng, 5);
      const b = nz(rng, 9);
      const c = rng.int(-9, 9);
      const vertex = Q.of(-b, 2 * a);
      const pick = rng.int(-6, 6);
      const x0 = 2 * a * pick + b === 0 ? pick + 1 : pick;
      const f0 = a * x0 * x0 + b * x0 + c;
      const d0 = 2 * a * x0 + b;
      const f = poly([a, "x^{2}"], [b, "x"], [c, ""]);
      const tall = vertex.sign() < 0 ? `\\left(${vertex.toLatex()}\\right)` : vertex.toLatex();
      return numberProblem({
        prompt: t(
          `Apply one step of Newton's method for optimization to $f(x) = ${f}$, with $x_{0} = ${x0}$. Find $x_{1}$.`,
          `对 $f(x) = ${f}$ 用牛顿法做一步最优化迭代，取 $x_{0} = ${x0}$。求 $x_{1}$。`,
        ),
        answer: vertex,
        mistakes: distinctWhys([
          why(
            Q.of(x0).sub(Q.of(f0, d0)),
            "This is the root-finding step $x_{0} - \\frac{f(x_{0})}{f'(x_{0})}$; optimization uses $\\frac{f'(x_{0})}{f''(x_{0})}$.",
            "这是求根的迭代 $x_{0} - \\frac{f(x_{0})}{f'(x_{0})}$；最优化用的是 $\\frac{f'(x_{0})}{f''(x_{0})}$。",
          ),
          why(
            Q.of(x0).add(Q.of(d0, 2 * a)),
            "This adds $\\frac{f'(x_{0})}{f''(x_{0})}$; subtract it.",
            "这加上了 $\\frac{f'(x_{0})}{f''(x_{0})}$；应该减去。",
          ),
          why(
            Q.of(x0 - d0),
            `This subtracts $f'(x_{0})$ without dividing by $f''(x_{0}) = ${2 * a}$.`,
            `这减去了 $f'(x_{0})$，却没有除以 $f''(x_{0}) = ${2 * a}$。`,
          ),
          why(
            Q.of(x0).sub(Q.of(d0, a)),
            `This divides by $${a}$, the coefficient of $x^{2}$, instead of $f'' = ${2 * a}$.`,
            `这除以的是 $x^{2}$ 的系数 $${a}$，而不是 $f'' = ${2 * a}$。`,
          ),
        ]),
        solution: t(
          ...walkPair(
            [
              [
                "Differentiate twice",
                "求两次导数",
                `$f'(x) = ${poly([2 * a, "x"], [b, ""])}$ and $f''(x) = ${2 * a}$.`,
                `$f'(x) = ${poly([2 * a, "x"], [b, ""])}$，$f''(x) = ${2 * a}$。`,
              ],
              ["Evaluate at $x_{0}$", "在 $x_{0}$ 处求值", `$f'(${x0}) = ${d0}$.`, `$f'(${x0}) = ${d0}$。`],
              [
                "Take the step",
                "迭代一步",
                `$x_{1} = ${x0} - \\frac{${d0}}{${2 * a}} = ${vertex.toLatex()}$.`,
                `$x_{1} = ${x0} - \\frac{${d0}}{${2 * a}} = ${vertex.toLatex()}$。`,
              ],
            ],
            [
              `$f'\\left(${vertex.toLatex()}\\right) = ${2 * a} \\cdot ${tall} + ${paren(b)} = 0$, so $x_{1}$ is the vertex of the parabola, as one step on a quadratic always gives.`,
              `$f'\\left(${vertex.toLatex()}\\right) = ${2 * a} \\cdot ${tall} + ${paren(b)} = 0$，所以 $x_{1}$ 是抛物线的顶点，对二次函数一步迭代总是如此。`,
            ],
          ),
        ),
      });
    },
  ),
  figure: calculusDrawings3["newtons-method-for-optimizing-single-variable-functions#one-newton-step-on-a-quadratic"],
};

const speedingUp = point(
  "speeding-up-or-slowing-down",
  ["Speeding up or slowing down", "加速还是减速"],
  [
    "A particle speeds up when its velocity and acceleration have the same sign and slows down when they have opposite signs. A positive acceleration alone does not mean speeding up: if the particle is moving in the negative direction, it is slowing down.\n\nFor example, $s(t) = t^{3} - 6t^{2}$ has $v(t) = 3t^{2} - 12t$ and $a(t) = 6t - 12$. At $t = 1$, $v = -9$ and $a = -6$ have the same sign, so it is speeding up. At $t = 3$, $v = -9$ and $a = 6$ have opposite signs, so it is slowing down.\n\nCheck: just after $t = 1$ the speed is $|v(1.1)| = 9.57$, more than $9$, and just after $t = 3$ it is $|v(3.1)| = 8.37$, less than $9$.\n\n> **Watch out.** A positive acceleration alone does not mean speeding up: compare its sign with the sign of the velocity.",
    "速度和加速度同号时质点加速，异号时质点减速。只看加速度为正并不能说明在加速：如果质点正沿负方向运动，它其实在减速。\n\n例如 $s(t) = t^{3} - 6t^{2}$，$v(t) = 3t^{2} - 12t$，$a(t) = 6t - 12$。$t = 1$ 时 $v = -9$，$a = -6$，同号，所以在加速。$t = 3$ 时 $v = -9$，$a = 6$，异号，所以在减速。\n\n检验：$t = 1$ 之后不久速率 $|v(1.1)| = 9.57$，大于 $9$；$t = 3$ 之后不久速率 $|v(3.1)| = 8.37$，小于 $9$。\n\n> **注意。** 只看加速度为正并不能说明在加速：要把它的符号和速度的符号比较。",
  ],
  (rng) => {
    const T = rng.int(1, 5);
    let b = rng.int(-9, 9);
    if (6 * T + 2 * b === 0) b += 1;
    let c = rng.int(-20, 20);
    if (3 * T * T + 2 * b * T + c === 0) c += 1;
    const v = 3 * T * T + 2 * b * T + c;
    const acc = 6 * T + 2 * b;
    const same = v > 0 === acc > 0;
    const up: Pair = [`Speeding up, because $v$ and $a$ have the same sign`, `加速，因为 $v$ 和 $a$ 同号`];
    const down: Pair = [`Slowing down, because $v$ and $a$ have opposite signs`, `减速，因为 $v$ 和 $a$ 异号`];
    const neither: Pair = [`Neither, since its speed is constant at that moment`, `都不是，此刻速率不变`];
    const trap: Pair =
      acc > 0
        ? v < 0
          ? [`Speeding up, because $a$ is positive`, `加速，因为 $a$ 为正`]
          : [`Slowing down, because $a$ is small compared with $v$`, `减速，因为 $a$ 比 $v$ 小`]
        : v < 0
          ? [`Slowing down, because $a$ is negative`, `减速，因为 $a$ 为负`]
          : [`Speeding up, because $v$ is positive`, `加速，因为 $v$ 为正`];
    const trapWhy: Pair =
      acc > 0
        ? v < 0
          ? [
              `A positive acceleration slows a particle moving in the negative direction, and $v(${T}) = ${v}$ is negative.`,
              `正的加速度会使沿负方向运动的质点减速，而 $v(${T}) = ${v}$ 为负。`,
            ]
          : [
              "How large $a$ is compared with $v$ does not matter, only the signs, and both are positive.",
              "$a$ 与 $v$ 的大小比较无关紧要，要看的是符号，而二者都为正。",
            ]
        : v < 0
          ? [
              `A negative acceleration speeds up a particle moving in the negative direction, and $v(${T}) = ${v}$ is negative.`,
              `负的加速度会使沿负方向运动的质点加速，而 $v(${T}) = ${v}$ 为负。`,
            ]
          : [
              `A positive velocity gives the direction of motion, not whether the speed grows; $a(${T}) = ${acc}$ is negative, so the particle slows down.`,
              `速度为正只说明运动方向，不说明速率是否增大；$a(${T}) = ${acc}$ 为负，所以质点在减速。`,
            ];
    const nearby = (h: number) => Q.of(10000 * v + 100 * acc * h + 3, 10000).abs();
    const s = poly([1, "t^{3}"], [b, "t^{2}"], [c, "t"]);
    const signs: Pair = same
      ? [
          `$v(${T}) = ${v}$ and $a(${T}) = ${acc}$ have the same sign, so the speed is growing.`,
          `$v(${T}) = ${v}$ 与 $a(${T}) = ${acc}$ 同号，所以速率在增大。`,
        ]
      : [
          `$v(${T}) = ${v}$ and $a(${T}) = ${acc}$ have opposite signs, so the speed is shrinking.`,
          `$v(${T}) = ${v}$ 与 $a(${T}) = ${acc}$ 异号，所以速率在减小。`,
        ];
    const before = dec(Q.of(100 * T - 1, 100));
    const after = dec(Q.of(100 * T + 1, 100));
    return reasoned(
      choose(
        rng,
        [
          `A particle has position $s(t) = ${s}$ metres after $t$ seconds. What is happening to its speed at $t = ${T}$?`,
          `质点 $t$ 秒时的位置是 $s(t) = ${s}$ 米。在 $t = ${T}$ 时它的速率如何变化？`,
        ],
        same ? up : down,
        [same ? down : up, trap, neither],
        walkPair(
          [
            [
              "Find the velocity",
              "求速度",
              `$v(t) = ${poly([3, "t^{2}"], [2 * b, "t"], [c, ""])}$, so $v(${T}) = ${v}$.`,
              `$v(t) = ${poly([3, "t^{2}"], [2 * b, "t"], [c, ""])}$，所以 $v(${T}) = ${v}$。`,
            ],
            [
              "Find the acceleration",
              "求加速度",
              `$a(t) = ${poly([6, "t"], [2 * b, ""])}$, so $a(${T}) = ${acc}$.`,
              `$a(t) = ${poly([6, "t"], [2 * b, ""])}$，所以 $a(${T}) = ${acc}$。`,
            ],
            [
              "Compare the signs",
              "比较符号",
              same
                ? "They have the same sign, so the particle is speeding up."
                : "They have opposite signs, so the particle is slowing down.",
              same ? "二者同号，所以质点在加速。" : "二者异号，所以质点在减速。",
            ],
          ],
          [
            `The speed $|v|$ is $${dec(nearby(-1))}$ at $t = ${before}$ and $${dec(nearby(1))}$ at $t = ${after}$, so it is ${same ? "rising" : "falling"}.`,
            `速率 $|v|$ 在 $t = ${before}$ 时为 $${dec(nearby(-1))}$，在 $t = ${after}$ 时为 $${dec(nearby(1))}$，所以它在${same ? "增大" : "减小"}。`,
          ],
        ),
      ),
      [
        [(same ? down : up)[0], ...signs],
        [trap[0], ...trapWhy],
        [
          neither[0],
          `The speed would be steady at that moment only if $a(${T})$ were $0$, but it is $${acc}$.`,
          `只有 $a(${T})$ 为 $0$ 时此刻速率才不变，但它是 $${acc}$。`,
        ],
      ],
    );
  },
);

const coefficientFromAntiderivative = point(
  "the-constant-multiple-from-its-antiderivative",
  ["The constant multiple from its antiderivative", "由原函数求常数倍数"],
  [
    "The reverse question gives the antiderivative and asks for the constant in the integrand. Since differentiating undoes integrating, differentiate the answer: the power rule brings the exponent down, so the constant is the coefficient times the exponent, not the coefficient divided by it. For example, if $\\int kx^{3} \\, dx = 2x^{4} + C$, differentiating gives $8x^{3}$, so $k = 8$.\n\nCheck: by the power rule, $\\int 8x^{3} \\, dx$ is $8 \\cdot \\frac{x^{4}}{4} + C$, which is $2x^{4} + C$.\n\n> **Watch out.** Multiply the coefficient by the new exponent, do not divide: here $k$ is $2 \\cdot 4$, not $2 \\div 4$.",
    "反过来的问题是给出原函数，求被积函数中的常数。因为求导抵消积分，所以对结果求导：幂法则把指数乘到前面，所以这个常数等于系数乘以指数，而不是系数除以指数。例如，若 $\\int kx^{3} \\, dx = 2x^{4} + C$，求导得 $8x^{3}$，所以 $k = 8$。\n\n检验：由幂法则，$\\int 8x^{3} \\, dx$ 是 $8 \\cdot \\frac{x^{4}}{4} + C$，即 $2x^{4} + C$。\n\n> **注意。** 系数要乘以新的指数，不是除以它：这里 $k$ 是 $2 \\cdot 4$，不是 $2 \\div 4$。",
  ],
  (rng) => {
    const n = rng.int(2, 7);
    const a = nz(rng, 9);
    const answer = a * (n + 1);
    const F = poly([a, `x^{${n + 1}}`]);
    const back = poly([answer, `x^{${n}}`]);
    return ask(
      [`$\\int kx^{${n}} \\, dx = ${F} + C$. Find $k$.`, `$\\int kx^{${n}} \\, dx = ${F} + C$。求 $k$。`],
      answer,
      [Q.of(a, n + 1), a * n, a],
      walkPair(
        [
          [
            "Differentiate the right side",
            "对右边求导",
            `Differentiating undoes integrating, so $kx^{${n}}$ is the derivative of $${F}$. The power rule brings the exponent $${n + 1}$ down:\n\n$$\\frac{d}{dx}\\left(${F}\\right) = ${paren(a)} \\cdot ${n + 1}x^{${n}} = ${back}$$`,
            `求导抵消积分，所以 $kx^{${n}}$ 是 $${F}$ 的导数。幂法则把指数 $${n + 1}$ 乘到前面：\n\n$$\\frac{d}{dx}\\left(${F}\\right) = ${paren(a)} \\cdot ${n + 1}x^{${n}} = ${back}$$`,
          ],
          [
            "Compare coefficients",
            "比较系数",
            `So $kx^{${n}} = ${back}$, and $k = ${answer}$.`,
            `所以 $kx^{${n}} = ${back}$，$k = ${answer}$。`,
          ],
        ],
        [
          `Integrate $${back}$ with the power rule: the exponent becomes $${n + 1}$, and $${answer} \\div ${n + 1} = ${a}$, so the result is $${F} + C$, as given.`,
          `用幂法则积分 $${back}$：指数变为 $${n + 1}$，且 $${answer} \\div ${n + 1} = ${a}$，所以结果是 $${F} + C$，与已知相同。`,
        ],
      ),
    );
  },
);

const noProductRule = point(
  "there-is-no-product-rule-for-integrals",
  ["There is no product rule for integrals", "积分没有乘法法则"],
  [
    "The integral of a sum is the sum of the integrals, but the integral of a product is not the product of the integrals. So multiply out first and then use the sum rule. For example,\n\n$$\\int x(x + 1) \\, dx = \\int (x^{2} + x) \\, dx = \\frac{x^{3}}{3} + \\frac{x^{2}}{2} + C.$$\n\nCheck: differentiating $\\frac{x^{3}}{3} + \\frac{x^{2}}{2}$ gives $x^{2} + x$, which is $x(x + 1)$.\n\n> **Watch out.** $\\int x \\, dx$ times $\\int (x + 1) \\, dx$ is not the answer. By the product rule, the derivative of $\\frac{x^{2}}{2}\\left(\\frac{x^{2}}{2} + x\\right)$ is not $x(x + 1)$.",
    "和的积分等于积分的和，但积的积分不等于积分的积。所以要先展开，再用和的法则。例如\n\n$$\\int x(x + 1) \\, dx = \\int (x^{2} + x) \\, dx = \\frac{x^{3}}{3} + \\frac{x^{2}}{2} + C$$\n\n检验：对 $\\frac{x^{3}}{3} + \\frac{x^{2}}{2}$ 求导得 $x^{2} + x$，即 $x(x + 1)$。\n\n> **注意。** $\\int x \\, dx$ 乘以 $\\int (x + 1) \\, dx$ 不是答案。由乘法法则，$\\frac{x^{2}}{2}\\left(\\frac{x^{2}}{2} + x\\right)$ 的导数不是 $x(x + 1)$。",
  ],
  (rng) => {
    const a = nz(rng, 7);
    const b = rng.pick([-7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7]);
    const F = poly([Q.of(1, 3), "x^{3}"], [Q.of(a + b, 2), "x^{2}"], [a * b, "x"]);
    const answer = poly([Q.of(1, 3), "x^{3}"], [Q.of(a + b, 2), "x^{2}"], [a * b, "x"], [1, "C"]);
    const half = (c: number) => poly([Q.of(1, 2), "x^{2}"], [c, "x"]);
    const wrongOne = `\\left(${half(a)}\\right)\\left(${half(b)}\\right) + C`;
    const product = `(${linear(1, a)})(${linear(1, b)})`;
    const expanded = poly([1, "x^{2}"], [a + b, "x"], [a * b, ""]);
    const [en, zh] = walkPair(
      [
        [
          "Expand",
          "展开",
          `There is no product rule for integrals, so multiply out first:\n\n$$${product} = ${expanded}$$`,
          `积分没有乘法法则，所以先乘开：\n\n$$${product} = ${expanded}$$`,
        ],
        [
          "Integrate term by term",
          "逐项积分",
          `Use the power rule on each term, with one constant:\n\n$$\\int (${expanded}) \\, dx = ${answer}$$`,
          `对每一项用幂法则，只写一个常数：\n\n$$\\int (${expanded}) \\, dx = ${answer}$$`,
        ],
      ],
      [
        `Differentiate the answer:\n\n$$\\frac{d}{dx}\\left(${F}\\right) = ${expanded}$$\n\nThis is the expanded product.`,
        `对答案求导：\n\n$$\\frac{d}{dx}\\left(${F}\\right) = ${expanded}$$\n\n这正是展开后的乘积。`,
      ],
    );
    return functionProblem({
      prompt: t(`Find $\\int ${product} \\, dx$.`, `求 $\\int ${product} \\, dx$。`),
      answer,
      antiderivative: true,
      wrong: [
        wrongOne,
        poly([Q.of(1, 3), "x^{3}"], [a + b, "x^{2}"], [a * b, "x"], [1, "C"]),
        poly([Q.of(1, 3), "x^{3}"], [Q.of(a + b, 2), "x^{2}"], [1, "C"]),
      ],
      solution: t(en, zh),
    });
  },
);

const hyperbolicIdentityIntegral = point(
  "integrating-with-a-hyperbolic-identity",
  ["Integrating with a hyperbolic identity", "用双曲恒等式求积分"],
  [
    "Powers such as $\\tanh^{2}x$ have no direct formula, but identities turn them into known integrals: $\\tanh^{2}x = 1 - \\operatorname{sech}^{2}x$, $\\coth^{2}x = 1 + \\operatorname{csch}^{2}x$, and $\\cosh^{2}x - \\sinh^{2}x = 1$. For example, $\\int \\tanh^{2}x \\, dx = \\int (1 - \\operatorname{sech}^{2}x) \\, dx = x - \\tanh x + C$.\n\nCheck: differentiating $x - \\tanh x$ gives $1 - \\operatorname{sech}^{2}x$, which is $\\tanh^{2}x$.\n\n> **Watch out.** The signs differ from the circular identities: $\\tanh^{2}x = 1 - \\operatorname{sech}^{2}x$, while $\\tan^{2}x = \\sec^{2}x - 1$.",
    "$\\tanh^{2}x$ 这样的幂没有直接的公式，但恒等式能把它们化成已知积分：$\\tanh^{2}x = 1 - \\operatorname{sech}^{2}x$，$\\coth^{2}x = 1 + \\operatorname{csch}^{2}x$，$\\cosh^{2}x - \\sinh^{2}x = 1$。例如，$\\int \\tanh^{2}x \\, dx = \\int (1 - \\operatorname{sech}^{2}x) \\, dx = x - \\tanh x + C$。\n\n检验：对 $x - \\tanh x$ 求导得 $1 - \\operatorname{sech}^{2}x$，即 $\\tanh^{2}x$。\n\n> **注意。** 这些符号与三角恒等式不同：$\\tanh^{2}x = 1 - \\operatorname{sech}^{2}x$，而 $\\tan^{2}x = \\sec^{2}x - 1$。",
  ],
  (rng) => {
    const k = nz(rng, 9);
    const kind = rng.pick(["tanh", "coth", "unit"] as const);
    const integrand =
      kind === "tanh"
        ? poly([k, "\\tanh^{2}x"])
        : kind === "coth"
          ? poly([k, "\\coth^{2}x"])
          : `${k === 1 ? "" : k === -1 ? "-" : k}\\left(\\cosh^{2}x - \\sinh^{2}x\\right)`;
    const F = kind === "unit" ? poly([k, "x"]) : poly([k, "x"], [-k, `\\${kind} x`]);
    const answer = `${F} + C`;
    const wrong =
      kind === "unit"
        ? [poly([k, "\\sinh x"], [-k, "\\cosh x"], [1, "C"]), poly([-k, "x"], [1, "C"])]
        : [poly([k, "x"], [k, `\\${kind} x`], [1, "C"]), poly([k, `\\${kind} x`], [1, "C"])];
    const identity =
      kind === "tanh"
        ? "\\tanh^{2}x = 1 - \\operatorname{sech}^{2}x"
        : kind === "coth"
          ? "\\coth^{2}x = 1 + \\operatorname{csch}^{2}x"
          : "\\cosh^{2}x - \\sinh^{2}x = 1";
    const rewritten =
      kind === "tanh"
        ? poly([k, ""], [-k, "\\operatorname{sech}^{2}x"])
        : kind === "coth"
          ? poly([k, ""], [k, "\\operatorname{csch}^{2}x"])
          : `${k}`;
    const [en, zh] = walkPair(
      [
        [
          "Rewrite with an identity",
          "用恒等式改写",
          `Use $${identity}$:\n\n$$${integrand} = ${rewritten}$$`,
          `用 $${identity}$：\n\n$$${integrand} = ${rewritten}$$`,
        ],
        [
          kind === "unit" ? "Integrate the constant" : "Integrate term by term",
          kind === "unit" ? "对常数积分" : "逐项积分",
          kind === "unit"
            ? `The integrand is the constant $${k}$, which integrates to a multiple of $x$:\n\n$$\\int ${integrand} \\, dx = ${answer}$$`
            : `The constant integrates to a multiple of $x$, and the integral of $\\operatorname{${kind === "tanh" ? "sech" : "csch"}}^{2}x$ is $${kind === "tanh" ? "\\tanh x" : "-\\coth x"}$:\n\n$$\\int ${integrand} \\, dx = ${answer}$$`,
          kind === "unit"
            ? `被积函数是常数 $${k}$，积分后是 $x$ 的倍数：\n\n$$\\int ${integrand} \\, dx = ${answer}$$`
            : `常数积分后是 $x$ 的倍数，而 $\\operatorname{${kind === "tanh" ? "sech" : "csch"}}^{2}x$ 的积分是 $${kind === "tanh" ? "\\tanh x" : "-\\coth x"}$：\n\n$$\\int ${integrand} \\, dx = ${answer}$$`,
        ],
      ],
      [
        `Differentiate the answer:\n\n$$\\frac{d}{dx}\\left(${F}\\right) = ${rewritten}$$\n\nBy the identity, this is $${integrand}$.`,
        `对答案求导：\n\n$$\\frac{d}{dx}\\left(${F}\\right) = ${rewritten}$$\n\n由恒等式，这正是 $${integrand}$。`,
      ],
    );
    return functionProblem({
      prompt: t(`Find $\\int ${integrand} \\, dx$.`, `求 $\\int ${integrand} \\, dx$。`),
      answer,
      antiderivative: true,
      wrong,
      solution: t(en, zh),
    });
  },
);

const arsinhScaled = point(
  "integrating-to-arsinh-with-a-coefficient-inside",
  ["Integrating to arsinh with a coefficient inside", "根号内有系数时积分为 arsinh"],
  [
    "When $x^{2}$ has a coefficient under the root, write it as a square and use a linear substitution:\n\n$$\\int \\frac{dx}{\\sqrt{k^{2}x^{2} + b^{2}}} = \\frac{1}{k}\\operatorname{arsinh}\\frac{kx}{b} + C$$\n\nThe factor $\\frac{1}{k}$ is what the chain rule requires. For example, an antiderivative of $\\frac{1}{\\sqrt{4x^{2} + 9}}$ is $\\frac{1}{2}\\operatorname{arsinh}\\frac{2x}{3}$.\n\nCheck: by the chain rule, the derivative of $\\frac{1}{2}\\operatorname{arsinh}\\frac{2x}{3}$ is $\\frac{1}{2} \\cdot \\frac{2}{3} \\cdot \\frac{1}{\\sqrt{1 + 4x^{2}/9}}$, and multiplying the root by $3$ turns this into $\\frac{1}{\\sqrt{4x^{2} + 9}}$.\n\n> **Watch out.** The factor $\\frac{1}{k}$ is easy to lose. Without it, the derivative of the answer is $k$ times the integrand.",
    "根号下 $x^{2}$ 带系数时，把它写成平方并作线性换元：\n\n$$\\int \\frac{dx}{\\sqrt{k^{2}x^{2} + b^{2}}} = \\frac{1}{k}\\operatorname{arsinh}\\frac{kx}{b} + C$$\n\n因子 $\\frac{1}{k}$ 是链式法则所要求的。例如，$\\frac{1}{\\sqrt{4x^{2} + 9}}$ 的一个原函数是 $\\frac{1}{2}\\operatorname{arsinh}\\frac{2x}{3}$。\n\n检验：由链式法则，$\\frac{1}{2}\\operatorname{arsinh}\\frac{2x}{3}$ 的导数是 $\\frac{1}{2} \\cdot \\frac{2}{3} \\cdot \\frac{1}{\\sqrt{1 + 4x^{2}/9}}$，把根式乘以 $3$，就化成 $\\frac{1}{\\sqrt{4x^{2} + 9}}$。\n\n> **注意。** 因子 $\\frac{1}{k}$ 很容易漏掉。漏掉它，答案的导数就是被积函数的 $k$ 倍。",
  ],
  (rng) => {
    const [k, b] = rng.pick([
      [2, 1],
      [2, 3],
      [2, 5],
      [3, 1],
      [3, 2],
      [3, 4],
      [3, 5],
      [4, 1],
      [4, 3],
      [4, 5],
      [5, 1],
      [5, 2],
      [5, 3],
    ] as const);
    const c = rng.pick([1, 2, 3, 4, 5, 6, 8, 10, 12, -1, -2, -3, -4, -6]);
    const inner = b === 1 ? `${k}x` : `\\frac{${k}x}{${b}}`;
    const fn = `\\operatorname{arsinh}\\left(${inner}\\right)`;
    const F = poly([Q.of(c, k), fn]);
    const answer = `${F} + C`;
    const root = `\\sqrt{${k * k}x^{2} + ${b * b}}`;
    const integrand = `${c < 0 ? "-" : ""}\\frac{${Math.abs(c)}}{${root}}`;
    const squares = `(${k}x)^{2} + ${b === 1 ? "1" : `${b}^{2}`}`;
    const slope = b === 1 ? `${k}` : `\\frac{${k}}{${b}}`;
    const [en, zh] = walkPair(
      [
        [
          "Write the root with a square",
          "把根式写成平方",
          `The coefficient $${k * k}$ is $${k}^{2}$, so\n\n$$${root} = \\sqrt{${squares}}$$\n\nThe rule applies with $${k}x$ in place of $x$ and $b = ${b}$.`,
          `系数 $${k * k}$ 是 $${k}^{2}$，所以\n\n$$${root} = \\sqrt{${squares}}$$\n\n用 $${k}x$ 代替 $x$，并取 $b = ${b}$，就可以用公式。`,
        ],
        [
          "Apply the rule and divide by the coefficient",
          "用公式并除以系数",
          `The chain rule's factor $${k}$ means dividing by $${k}$:\n\n$$\\int ${integrand} \\, dx = ${answer}$$`,
          `链式法则的因子 $${k}$ 意味着要除以 $${k}$：\n\n$$\\int ${integrand} \\, dx = ${answer}$$`,
        ],
      ],
      [
        `Differentiate the arsinh term with the chain rule:\n\n$$\\frac{d}{dx}${fn} = ${slope} \\cdot \\frac{1}{\\sqrt{1 + \\left(${inner}\\right)^{2}}} = \\frac{${k}}{${root}}$$\n\nSo the derivative of the answer is $${Q.of(c, k).toLatex()} \\cdot \\frac{${k}}{${root}}$, which is the integrand.`,
        `用链式法则对 arsinh 项求导：\n\n$$\\frac{d}{dx}${fn} = ${slope} \\cdot \\frac{1}{\\sqrt{1 + \\left(${inner}\\right)^{2}}} = \\frac{${k}}{${root}}$$\n\n所以答案的导数是 $${Q.of(c, k).toLatex()} \\cdot \\frac{${k}}{${root}}$，正是被积函数。`,
      ],
    );
    return functionProblem({
      prompt: t(`Find $\\int ${integrand} \\, dx$.`, `求 $\\int ${integrand} \\, dx$。`),
      answer,
      antiderivative: true,
      wrong: [poly([c, fn], [1, "C"]), poly([Q.of(c * k), fn], [1, "C"]), poly([Q.of(c, b), fn], [1, "C"])],
      solution: t(en, zh),
    });
  },
);

const artanhOrArcoth = point(
  "artanh-or-arcoth-by-the-domain",
  ["Artanh or arcoth by the domain", "由定义域选择 artanh 或 arcoth"],
  [
    "$\\frac{1}{a^{2} - x^{2}}$ has two antiderivatives of the same form, and the domain chooses: $\\frac{1}{a}\\operatorname{artanh}\\frac{x}{a}$ for $|x| < a$ and $\\frac{1}{a}\\operatorname{arcoth}\\frac{x}{a}$ for $|x| > a$. For example, for $\\frac{1}{4 - x^{2}}$ with $|x| > 2$, an antiderivative is $\\frac{1}{2}\\operatorname{arcoth}\\frac{x}{2}$.\n\nCheck: by the chain rule, its derivative is $\\frac{1}{2} \\cdot \\frac{1}{2} \\cdot \\frac{1}{1 - x^{2}/4}$, which is $\\frac{1}{4 - x^{2}}$. The derivatives of artanh and arcoth have the same formula, so only the domain tells them apart.\n\n> **Watch out.** Read the domain before choosing. Artanh is defined only between $-1$ and $1$, and arcoth only outside that interval, so neither function is defined on the other's interval.",
    "$\\frac{1}{a^{2} - x^{2}}$ 有两个形式相同的原函数，由定义域决定选哪个：$|x| < a$ 时是 $\\frac{1}{a}\\operatorname{artanh}\\frac{x}{a}$，$|x| > a$ 时是 $\\frac{1}{a}\\operatorname{arcoth}\\frac{x}{a}$。例如，$|x| > 2$ 时，$\\frac{1}{4 - x^{2}}$ 的一个原函数是 $\\frac{1}{2}\\operatorname{arcoth}\\frac{x}{2}$。\n\n检验：由链式法则，它的导数是 $\\frac{1}{2} \\cdot \\frac{1}{2} \\cdot \\frac{1}{1 - x^{2}/4}$，即 $\\frac{1}{4 - x^{2}}$。artanh 和 arcoth 的导数公式相同，只有定义域能区分它们。\n\n> **注意。** 先看定义域再选择。artanh 只在 $-1$ 和 $1$ 之间有定义，arcoth 只在这个区间之外有定义，所以两个函数都在对方的区间上没有定义。",
  ],
  (rng) => {
    const a = rng.int(2, 9);
    const c = nz(rng, 9);
    const inside = rng.bool();
    const rel = inside ? "<" : ">";
    const coef = Q.of(c, a);
    const fn = (name: string, co: Q) => `${poly([co, `\\operatorname{${name}}\\frac{x}{${a}}`])} + C`;
    const right = inside ? "artanh" : "arcoth";
    const other = inside ? "arcoth" : "artanh";
    const integrand = `${c < 0 ? "-" : ""}\\frac{${Math.abs(c)}}{${a * a} - x^{2}}`;
    const F = poly([coef, `\\operatorname{${right}}\\frac{x}{${a}}`]);
    const [en, zh] = walkPair(
      [
        [
          "Read the domain",
          "看定义域",
          `Here $a = ${a}$ and $|x| ${rel} ${a}$, so $\\frac{x}{${a}}$ lies ${inside ? "between $-1$ and $1$" : "outside the interval from $-1$ to $1$"}, where $\\operatorname{${right}}$ is defined.`,
          `这里 $a = ${a}$，$|x| ${rel} ${a}$，所以 $\\frac{x}{${a}}$ 在 ${inside ? "$-1$ 和 $1$ 之间" : "$-1$ 到 $1$ 的区间之外"}，$\\operatorname{${right}}$ 在那里有定义。`,
        ],
        [
          "Apply the rule",
          "用公式",
          `The rule gives the factor $\\frac{1}{${a}}$:\n\n$$\\int ${integrand} \\, dx = ${fn(right, coef)}$$`,
          `公式给出因子 $\\frac{1}{${a}}$：\n\n$$\\int ${integrand} \\, dx = ${fn(right, coef)}$$`,
        ],
      ],
      [
        `Differentiate with the chain rule:\n\n$$\\frac{d}{dx}\\left(${F}\\right) = ${coef.toLatex()} \\cdot \\frac{1}{${a}} \\cdot \\frac{1}{1 - \\frac{x^{2}}{${a * a}}} = ${integrand}$$\n\nThis is the integrand.`,
        `用链式法则求导：\n\n$$\\frac{d}{dx}\\left(${F}\\right) = ${coef.toLatex()} \\cdot \\frac{1}{${a}} \\cdot \\frac{1}{1 - \\frac{x^{2}}{${a * a}}} = ${integrand}$$\n\n这正是被积函数。`,
      ],
    );
    const domainEn = `$\\operatorname{${other}}\\frac{x}{${a}}$ is not defined for $|x| ${rel} ${a}$`;
    const domainZh = `$|x| ${rel} ${a}$ 时 $\\operatorname{${other}}\\frac{x}{${a}}$ 没有定义`;
    const factorEn = `the factor $\\frac{1}{${a}}$ from the chain rule is missing, so the derivative is $${a}$ times the integrand`;
    const factorZh = `漏掉了链式法则的因子 $\\frac{1}{${a}}$，导数是被积函数的 $${a}$ 倍`;
    return reasoned(
      choose(
        rng,
        [`Find $\\int ${integrand} \\, dx$ for $|x| ${rel} ${a}$.`, `当 $|x| ${rel} ${a}$ 时，求 $\\int ${integrand} \\, dx$。`],
        same2(fn(right, coef)),
        [same2(fn(other, coef)), same2(fn(right, Q.of(c))), same2(fn(other, Q.of(c)))],
        [en, zh],
      ),
      [
        [`$${fn(other, coef)}$`, `The wrong function: ${domainEn}.`, `函数选错了：${domainZh}。`],
        [`$${fn(right, Q.of(c))}$`, `The right function, but ${factorEn}.`, `函数对了，但${factorZh}。`],
        [`$${fn(other, Q.of(c))}$`, `Two slips: ${domainEn}, and ${factorEn}.`, `两处错误：${domainZh}，而且${factorZh}。`],
      ],
    );
  },
);

/** gridWidth picks a subinterval width for a sum with values at equally spaced points. */
const gridWidth = (rng: Rng) => rng.pick([Q.of(1, 2), Q.of(1), Q.of(2), Q.of(1, 4), Q.of(3, 2)]);

const rightFromLeft = point(
  "the-right-sum-from-the-left-sum",
  ["The right sum from the left sum", "由左和求右和"],
  [
    "Left and right sums share all sample points except one at each end: the left uses $f(a)$ and the right uses $f(b)$. So $R_{n} = L_{n} + \\Delta x\\,(f(b) - f(a))$, without adding up everything again.\n\nFor $f(x) = x^{2} + 1$ on $[0, 2]$ with $4$ subintervals, $\\Delta x = \\frac{1}{2}$ and $L_{4} = \\frac{1}{2}(1 + 1.25 + 2 + 3.25) = 3.75$. With $f(0) = 1$ and $f(2) = 5$, $R_{4} = 3.75 + \\frac{1}{2}(5 - 1) = 5.75$.\n\nCheck: adding directly, $R_{4} = \\frac{1}{2}(1.25 + 2 + 3.25 + 5) = 5.75$.\n\n> **Watch out.** The change is $\\Delta x$ times $f(b) - f(a)$, not $f(b) - f(a)$ itself; and when $f(b) < f(a)$ the right sum is the smaller one.",
    "左和与右和除两端各一点外，取样点都相同：左和用 $f(a)$，右和用 $f(b)$。所以 $R_{n} = L_{n} + \\Delta x\\,(f(b) - f(a))$，不必再把所有项加一遍。\n\n对 $[0, 2]$ 上的 $f(x) = x^{2} + 1$ 取 $4$ 个子区间，$\\Delta x = \\frac{1}{2}$，$L_{4} = \\frac{1}{2}(1 + 1.25 + 2 + 3.25) = 3.75$。由 $f(0) = 1$，$f(2) = 5$，得 $R_{4} = 3.75 + \\frac{1}{2}(5 - 1) = 5.75$。\n\n检验：直接相加，$R_{4} = \\frac{1}{2}(1.25 + 2 + 3.25 + 5) = 5.75$。\n\n> **注意。** 变化量是 $\\Delta x$ 乘以 $f(b) - f(a)$，而不是 $f(b) - f(a)$ 本身；当 $f(b) < f(a)$ 时，右和反而较小。",
  ],
  (rng) => {
    const w = gridWidth(rng);
    const L = rng.int(10, 90);
    const fa = rng.int(-9, 9);
    const fb0 = rng.int(-9, 9);
    const fb = fb0 === fa ? (fa < 9 ? fa + 1 : fa - 1) : fb0;
    const gap = Q.of(fb - fa);
    const answer = Q.of(L).add(w.mul(gap));
    const n = rng.int(4, 12);
    const a = rng.int(-4, 4);
    const b = Q.of(a).add(w.mul(Q.of(n)));
    const diff = answer.sub(Q.of(L));
    return numberProblem({
      prompt: t(
        `A left Riemann sum for $f$ on $[${a}, ${b.toLatex()}]$ with $${n}$ equal subintervals is $${L}$, and $f(${a}) = ${fa}$, $f\\left(${b.toLatex()}\\right) = ${fb}$. Find the right Riemann sum.`,
        `$f$ 在 $[${a}, ${b.toLatex()}]$ 上分成 $${n}$ 个等宽子区间的左黎曼和是 $${L}$，且 $f(${a}) = ${fa}$，$f\\left(${b.toLatex()}\\right) = ${fb}$。求右黎曼和。`,
      ),
      answer,
      mistakes: distinctWhys([
        why(
          Q.of(L).sub(w.mul(gap)),
          `This subtracts $\\Delta x\\,(f(b) - f(a))$; the right sum gains $f(b)\\Delta x$ and loses $f(a)\\Delta x$, so it is added.`,
          `这里减去了 $\\Delta x\\,(f(b) - f(a))$；右和加上 $f(b)\\Delta x$、去掉 $f(a)\\Delta x$，所以应该加上它。`,
        ),
        why(
          Q.of(L).add(gap),
          `This adds $f(b) - f(a)$ without multiplying by the width $\\Delta x = ${w.toLatex()}$.`,
          `这里加上了 $f(b) - f(a)$，却没有乘以宽度 $\\Delta x = ${w.toLatex()}$。`,
        ),
        why(
          Q.of(L + fb),
          `This adds $f(b)$ but neither removes $f(a)$ nor multiplies by $\\Delta x = ${w.toLatex()}$.`,
          `这里加上了 $f(b)$，却既没有去掉 $f(a)$，也没有乘以 $\\Delta x = ${w.toLatex()}$。`,
        ),
        why(
          Q.of(L).add(w.mul(Q.of(fb + fa))),
          "This adds $f(a)\\Delta x$ as well as $f(b)\\Delta x$; the right sum does not use $f(a)$, so its term is taken away.",
          "这里把 $f(a)\\Delta x$ 和 $f(b)\\Delta x$ 都加上了；右和不用 $f(a)$，所以它那一项应该去掉。",
        ),
      ]),
      solution: t(
        ...walkPair(
          [
            [
              "Compare the two sums",
              "比较两个和",
              `Here $\\Delta x = ${w.toLatex()}$. The right sum uses the same heights as the left sum, except that it drops $f(${a})$ and gains $f\\left(${b.toLatex()}\\right)$.`,
              `这里 $\\Delta x = ${w.toLatex()}$。右和所用的高与左和相同，只是去掉了 $f(${a})$，加上了 $f\\left(${b.toLatex()}\\right)$。`,
            ],
            [
              "Adjust the left sum",
              "调整左和",
              `$$R = ${L} + ${w.toLatex()} \\cdot \\left(${paren(fb)} - ${paren(fa)}\\right) = ${answer.toLatex()}$$`,
              `$$R = ${L} + ${w.toLatex()} \\cdot \\left(${paren(fb)} - ${paren(fa)}\\right) = ${answer.toLatex()}$$`,
            ],
          ],
          [
            `Work backwards. The right sum minus the left sum is $${answer.toLatex()} - ${L} = ${diff.toLatex()}$, and dividing by $\\Delta x$ gives $${diff.toLatex()} \\div ${w.toLatex()} = ${gap.toLatex()}$, which is $f(b) - f(a) = ${fb} - ${paren(fa)}$.`,
            `反过来验算。右和减左和为 $${answer.toLatex()} - ${L} = ${diff.toLatex()}$，除以 $\\Delta x$ 得 $${diff.toLatex()} \\div ${w.toLatex()} = ${gap.toLatex()}$，正是 $f(b) - f(a) = ${fb} - ${paren(fa)}$。`,
          ],
        ),
      ),
    });
  },
);

const midpointOfLine = {
  ...point(
    "midpoint-sums-of-linear-functions-are-exact",
    ["Midpoint sums of linear functions are exact", "一次函数的中点和是精确的"],
    [
      "On each subinterval, the midpoint rectangle of a line has the same area as the true trapezoid, since the errors on the two halves cancel. So for a linear function, the midpoint sum equals the exact area for any number of subintervals, and no long addition is needed.\n\nFor $f(x) = 2x + 1$ on $[0, 4]$ with $100$ subintervals, the midpoint sum is the area, which is the length times the height at the middle: $4 \\cdot f(2) = 20$.\n\nCheck: $\\int_{0}^{4} (2x + 1) \\, dx = \\Big[x^{2} + x\\Big]_{0}^{4} = 20$.\n\n> **Watch out.** This works only for a straight line. For a curved graph the midpoint sum is an approximation, too large or too small depending on the concavity.",
      "在每个子区间上，直线的中点矩形与真实的梯形面积相同，因为两半的误差相互抵消。所以对一次函数，无论分成多少个子区间，中点和都等于精确面积，不需要长长的加法。\n\n对 $[0, 4]$ 上的 $f(x) = 2x + 1$ 取 $100$ 个子区间，中点和就是面积，即区间长度乘以中点处的高：$4 \\cdot f(2) = 20$。\n\n检验：$\\int_{0}^{4} (2x + 1) \\, dx = \\Big[x^{2} + x\\Big]_{0}^{4} = 20$。\n\n> **注意。** 这只对直线成立。对弯曲的图像，中点和只是近似值，偏大还是偏小取决于凹凸性。",
    ],
    (rng) => {
      const m = nz(rng, 6);
      const c = rng.int(-9, 9);
      const a = rng.int(-4, 4);
      const b = a + rng.int(2, 8);
      const n = rng.pick([50, 100, 200, 500]);
      const exact = Q.of(m * (b * b - a * a), 2).add(Q.of(c * (b - a)));
      const width = Q.of(b - a, n);
      const left = exact.sub(
        Q.of(m)
          .mul(width)
          .mul(Q.of(b - a))
          .div(Q.of(2)),
      );
      const f = linear(m, c);
      const mid = Q.of(a + b, 2);
      const fMid = Q.of(m).mul(mid).add(Q.of(c));
      const F = (x: number) => Q.of(m * x * x, 2).add(Q.of(c * x));
      const big = (q: Q) => (q.sign() < 0 ? `\\left(${q.toLatex()}\\right)` : q.toLatex());
      return numberProblem({
        prompt: t(
          `Find the midpoint Riemann sum of $f(x) = ${f}$ on $[${a}, ${b}]$ with $${n}$ subintervals of equal width.`,
          `求 $f(x) = ${f}$ 在 $[${a}, ${b}]$ 上分成 $${n}$ 个等宽子区间的中点黎曼和。`,
        ),
        answer: exact,
        mistakes: distinctWhys([
          why(
            left,
            `This is the left Riemann sum with the same subintervals. On a line with slope $${m}$ the left ends give heights that are all too ${m > 0 ? "low" : "high"}; the midpoints balance out exactly.`,
            `这是相同子区间上的左黎曼和。在斜率为 $${m}$ 的直线上，左端点给出的高都${m > 0 ? "偏低" : "偏高"}；中点则恰好平衡。`,
          ),
          why(
            Q.of(m * a + c).mul(Q.of(b - a)),
            `This uses the height $f(${a}) = ${m * a + c}$ at the left end across the whole interval.`,
            `这是把左端的高 $f(${a}) = ${m * a + c}$ 用于整个区间。`,
          ),
          why(
            Q.of(m * b + c).mul(Q.of(b - a)),
            `This uses the height $f(${b}) = ${m * b + c}$ at the right end across the whole interval.`,
            `这是把右端的高 $f(${b}) = ${m * b + c}$ 用于整个区间。`,
          ),
        ]),
        solution: t(
          ...walkPair(
            [
              [
                "Use the shape",
                "利用图像的形状",
                `$f$ is linear, so its midpoint sum equals the exact area under it for every number of subintervals, $${n}$ included.`,
                `$f$ 是一次函数，所以无论分成多少个子区间（包括 $${n}$ 个），中点和都等于它下方的精确面积。`,
              ],
              [
                "Find the area",
                "求面积",
                `The area under a line is the length times the height at the middle, $x = ${mid.toLatex()}$:\n\n$$${b - a} \\cdot f\\left(${mid.toLatex()}\\right) = ${b - a} \\cdot ${big(fMid)} = ${exact.toLatex()}$$`,
                `直线下方的面积等于区间长度乘以中点 $x = ${mid.toLatex()}$ 处的高：\n\n$$${b - a} \\cdot f\\left(${mid.toLatex()}\\right) = ${b - a} \\cdot ${big(fMid)} = ${exact.toLatex()}$$`,
              ],
            ],
            [
              `Integrate with an antiderivative instead: $F(x) = ${poly([Q.of(m, 2), "x^{2}"], [c, "x"])}$, and $F(${b}) - F(${a}) = ${F(b).toLatex()} - ${big(F(a))} = ${exact.toLatex()}$.`,
              `改用原函数积分：$F(x) = ${poly([Q.of(m, 2), "x^{2}"], [c, "x"])}$，$F(${b}) - F(${a}) = ${F(b).toLatex()} - ${big(F(a))} = ${exact.toLatex()}$。`,
            ],
          ),
        ),
      });
    },
  ),
  figure: calculusDrawings3["approximating-areas-with-the-midpoint-riemann-sum#midpoint-sums-of-linear-functions-are-exact"],
};

const trapezoidFromLeft = {
  ...point(
    "the-trapezoidal-rule-from-the-left-sum",
    ["The trapezoidal rule from the left sum", "由左和求梯形法则的值"],
    [
      "The trapezoidal approximation is the average of the left and right sums, $T_{n} = \\frac{L_{n} + R_{n}}{2}$. Since $R_{n}$ differs from $L_{n}$ only at the ends, $T_{n} = L_{n} + \\frac{\\Delta x}{2}(f(b) - f(a))$.\n\nFor $f(x) = x^{2} + 1$ on $[0, 2]$ with $\\Delta x = \\frac{1}{2}$: $L_{4} = 3.75$, $f(0) = 1$ and $f(2) = 5$, so $T_{4} = 3.75 + \\frac{1}{4}(5 - 1) = 4.75$.\n\nCheck: $R_{4} = 5.75$, and $\\frac{3.75 + 5.75}{2} = 4.75$.\n\n> **Watch out.** The factor is $\\frac{\\Delta x}{2}$, half the width: the full width $\\Delta x$ would give the right sum instead.",
      "梯形近似是左和与右和的平均：$T_{n} = \\frac{L_{n} + R_{n}}{2}$。因为 $R_{n}$ 与 $L_{n}$ 只在两端不同，所以 $T_{n} = L_{n} + \\frac{\\Delta x}{2}(f(b) - f(a))$。\n\n对 $[0, 2]$ 上的 $f(x) = x^{2} + 1$ 取 $\\Delta x = \\frac{1}{2}$：$L_{4} = 3.75$，$f(0) = 1$，$f(2) = 5$，所以 $T_{4} = 3.75 + \\frac{1}{4}(5 - 1) = 4.75$。\n\n检验：$R_{4} = 5.75$，而 $\\frac{3.75 + 5.75}{2} = 4.75$。\n\n> **注意。** 因子是半个宽度 $\\frac{\\Delta x}{2}$：用整个宽度 $\\Delta x$ 得到的是右和。",
    ],
    (rng) => {
      const w = gridWidth(rng);
      const L = rng.int(10, 90);
      const fa = rng.int(-9, 9);
      const fb0 = rng.int(-9, 9);
      const fb = fb0 === fa ? (fa < 9 ? fa + 1 : fa - 1) : fb0;
      const gap = Q.of(fb - fa);
      const half = w.div(Q.of(2));
      const answer = Q.of(L).add(half.mul(gap));
      const R = Q.of(L).add(w.mul(gap));
      return numberProblem({
        prompt: t(
          `For a function $f$ and a partition with width $\\Delta x = ${w.toLatex()}$ on $[a, b]$, the left sum is $${L}$, $f(a) = ${fa}$ and $f(b) = ${fb}$. Find the trapezoidal approximation.`,
          `对函数 $f$ 和 $[a, b]$ 上宽度 $\\Delta x = ${w.toLatex()}$ 的分割，左和是 $${L}$，$f(a) = ${fa}$，$f(b) = ${fb}$。求梯形近似值。`,
        ),
        answer,
        mistakes: distinctWhys([
          why(
            R,
            "This is the right sum $L + \\Delta x\\,(f(b) - f(a))$; the trapezoidal rule is the average of the left and right sums, halfway between them.",
            "这是右和 $L + \\Delta x\\,(f(b) - f(a))$；梯形法则是左和与右和的平均值，在两者正中间。",
          ),
          why(
            Q.of(L).add(gap.div(Q.of(2))),
            `This uses the factor $\\frac{1}{2}$ instead of $\\frac{\\Delta x}{2} = ${half.toLatex()}$.`,
            `这里用了因子 $\\frac{1}{2}$，而不是 $\\frac{\\Delta x}{2} = ${half.toLatex()}$。`,
          ),
          why(
            Q.of(L).sub(half.mul(gap)),
            "This subtracts $\\frac{\\Delta x}{2}(f(b) - f(a))$; going from the left sum toward the right sum adds it.",
            "这里减去了 $\\frac{\\Delta x}{2}(f(b) - f(a))$；从左和向右和靠拢应该加上它。",
          ),
        ]),
        solution: t(
          ...walkPair(
            [
              [
                "Average the two sums",
                "取两个和的平均",
                "$T = \\frac{L + R}{2}$, and $R = L + \\Delta x\\,(f(b) - f(a))$, so $T = L + \\frac{\\Delta x}{2}(f(b) - f(a))$.",
                "$T = \\frac{L + R}{2}$，而 $R = L + \\Delta x\\,(f(b) - f(a))$，所以 $T = L + \\frac{\\Delta x}{2}(f(b) - f(a))$。",
              ],
              [
                "Substitute",
                "代入",
                `$$T = ${L} + ${half.toLatex()} \\cdot \\left(${paren(fb)} - ${paren(fa)}\\right) = ${answer.toLatex()}$$`,
                `$$T = ${L} + ${half.toLatex()} \\cdot \\left(${paren(fb)} - ${paren(fa)}\\right) = ${answer.toLatex()}$$`,
              ],
            ],
            [
              `Find the right sum first: $R = ${L} + ${w.toLatex()} \\cdot \\left(${paren(fb)} - ${paren(fa)}\\right) = ${R.toLatex()}$. The average is $\\frac{${L} + ${paren(R)}}{2} = ${answer.toLatex()}$.`,
              `先求右和：$R = ${L} + ${w.toLatex()} \\cdot \\left(${paren(fb)} - ${paren(fa)}\\right) = ${R.toLatex()}$。平均值为 $\\frac{${L} + ${paren(R)}}{2} = ${answer.toLatex()}$。`,
            ],
          ),
        ),
      });
    },
  ),
  figure: calculusDrawings3["approximating-areas-with-the-trapezoidal-rule#the-trapezoidal-rule-from-the-left-sum"],
};

const intervalOffSum = point(
  "reading-the-interval-off-a-sum",
  ["Reading the interval off a sum", "从和式读出区间"],
  [
    "In a right Riemann sum $\\sum_{i=1}^{n} f(a + i\\Delta x)\\Delta x$, the term with $i = 0$ would be at $a$, and the last term is at $b = a + n\\Delta x$. Reading the constant and the coefficient of $i$ gives the interval and the integrand.\n\nFor $\\sum_{i=1}^{8} \\left(2 + \\frac{1}{4}i\\right)^{2} \\cdot \\frac{1}{4}$: $a = 2$ and $\\Delta x = \\frac{1}{4}$, so the length is $8 \\cdot \\frac{1}{4} = 2$ and $b = 4$. The sum is a right sum for $x^{2}$ on $[2, 4]$.\n\nCheck: the last term, $i = 8$, samples at $2 + \\frac{8}{4} = 4$, the right end.\n\n> **Watch out.** $b$ is $a + n\\Delta x$: neither the length $n\\Delta x$ nor $a + n$.",
    "在右黎曼和 $\\sum_{i=1}^{n} f(a + i\\Delta x)\\Delta x$ 中，$i = 0$ 对应 $a$，最后一项对应 $b = a + n\\Delta x$。读出常数项和 $i$ 的系数，就得到区间和被积函数。\n\n对 $\\sum_{i=1}^{8} \\left(2 + \\frac{1}{4}i\\right)^{2} \\cdot \\frac{1}{4}$：$a = 2$，$\\Delta x = \\frac{1}{4}$，所以区间长度是 $8 \\cdot \\frac{1}{4} = 2$，$b = 4$。这是 $x^{2}$ 在 $[2, 4]$ 上的右和。\n\n检验：最后一项 $i = 8$ 的取样点是 $2 + \\frac{8}{4} = 4$，正是右端点。\n\n> **注意。** $b$ 等于 $a + n\\Delta x$：既不是长度 $n\\Delta x$，也不是 $a + n$。",
  ],
  (rng) => {
    const a = rng.int(1, 6);
    const n = rng.pick([4, 6, 8, 10, 12, 20]);
    const w = rng.int(1, 6);
    const d = Q.of(w, n);
    const arg = poly([a, ""], [d, "i"]);
    const body = rng.pick([`\\left(${arg}\\right)^{2}`, `\\sqrt{${arg}}`, `\\frac{1}{${arg}}`, `\\ln\\left(${arg}\\right)`]);
    const b = a + w;
    return numberProblem({
      prompt: t(
        `The sum $\\sum_{i=1}^{${n}} ${body} \\cdot ${d.toLatex()}$ is a right Riemann sum for a function on $[${a}, b]$. Find $b$.`,
        `和式 $\\sum_{i=1}^{${n}} ${body} \\cdot ${d.toLatex()}$ 是某函数在 $[${a}, b]$ 上的右黎曼和。求 $b$。`,
      ),
      answer: b,
      mistakes: distinctWhys([
        why(
          w,
          `This is the length $n\\Delta x = ${w}$; $b$ is $${a}$ plus the length.`,
          `这是区间长度 $n\\Delta x = ${w}$；$b$ 等于 $${a}$ 加上长度。`,
        ),
        why(
          a + n,
          `This adds the number of terms, $${n}$, instead of the length $${n} \\cdot ${d.toLatex()} = ${w}$.`,
          `这里加上的是项数 $${n}$，而不是长度 $${n} \\cdot ${d.toLatex()} = ${w}$。`,
        ),
        why(
          Q.of(a).add(d),
          "This is the sample point of the first term, $i = 1$; $b$ is the sample point of the last term.",
          "这是第一项 $i = 1$ 的取样点；$b$ 是最后一项的取样点。",
        ),
        why(n, "This is the number of subintervals, not an endpoint.", "这是子区间的个数，不是端点。"),
      ]),
      solution: t(
        ...walkPair(
          [
            [
              "Read the width",
              "读出宽度",
              `The factor after the function is $\\Delta x = ${d.toLatex()}$, and the constant in the argument is $a = ${a}$.`,
              `函数后面的因子是 $\\Delta x = ${d.toLatex()}$，自变量中的常数是 $a = ${a}$。`,
            ],
            [
              "Find the length",
              "求区间长度",
              `There are $${n}$ subintervals, so the length is $${n} \\cdot ${d.toLatex()} = ${w}$.`,
              `共有 $${n}$ 个子区间，所以区间长度是 $${n} \\cdot ${d.toLatex()} = ${w}$。`,
            ],
            ["Find b", "求 b", `$b = ${a} + ${w} = ${b}$.`, `$b = ${a} + ${w} = ${b}$。`],
          ],
          [
            `The last term, $i = ${n}$, samples at $${a} + ${d.toLatex()} \\cdot ${n} = ${b}$, and a right sum's last sample point is $b$.`,
            `最后一项 $i = ${n}$ 的取样点是 $${a} + ${d.toLatex()} \\cdot ${n} = ${b}$，而右和最后一个取样点就是 $b$。`,
          ],
        ),
      ),
    });
  },
);

const samplePoint = point(
  "the-sample-point-of-one-term",
  ["The sample point of one term", "某一项的取样点"],
  [
    "The term with index $i$ of a midpoint sum samples the middle of the $i$th subinterval, which runs from $a + (i - 1)\\Delta x$ to $a + i\\Delta x$. So its sample point is $a + \\left(i - \\frac{1}{2}\\right)\\Delta x$, not $a + i\\Delta x$.\n\nOn $[0, 3]$ with $6$ subintervals, $\\Delta x = \\frac{1}{2}$, and the term with $i = 4$ samples at $0 + 3.5 \\cdot \\frac{1}{2} = 1.75$.\n\nCheck: subinterval $4$ runs from $1.5$ to $2$, and its middle is $\\frac{1.5 + 2}{2} = 1.75$.\n\n> **Watch out.** Subtract half a width, $\\frac{1}{2}\\Delta x$, from the right end $a + i\\Delta x$; halving the index instead gives a point in the wrong subinterval.",
    "中点和第 $i$ 项的取样点是第 $i$ 个子区间的中点，这个子区间从 $a + (i - 1)\\Delta x$ 到 $a + i\\Delta x$。所以取样点是 $a + \\left(i - \\frac{1}{2}\\right)\\Delta x$，而不是 $a + i\\Delta x$。\n\n在 $[0, 3]$ 上取 $6$ 个子区间，$\\Delta x = \\frac{1}{2}$，$i = 4$ 这一项的取样点是 $0 + 3.5 \\cdot \\frac{1}{2} = 1.75$。\n\n检验：第 $4$ 个子区间从 $1.5$ 到 $2$，中点是 $\\frac{1.5 + 2}{2} = 1.75$。\n\n> **注意。** 从右端点 $a + i\\Delta x$ 减去半个宽度 $\\frac{1}{2}\\Delta x$；若把下标减半，得到的点会落在别的子区间里。",
  ],
  (rng) => {
    const a = rng.int(-5, 5);
    const n = rng.pick([4, 5, 6, 8, 10, 12]);
    const len = rng.int(1, 8);
    const b = a + len;
    const d = Q.of(len, n);
    const i = rng.int(2, n);
    const answer = Q.of(a).add(d.mul(Q.of(2 * i - 1, 2)));
    const lo = Q.of(a).add(d.mul(Q.of(i - 1)));
    const hi = Q.of(a).add(d.mul(Q.of(i)));
    return numberProblem({
      prompt: t(
        `A midpoint Riemann sum for $f$ on $[${a}, ${b}]$ has $${n}$ subintervals of equal width. At which $x$ is $f$ evaluated in the term with $i = ${i}$?`,
        `$f$ 在 $[${a}, ${b}]$ 上的中点黎曼和有 $${n}$ 个等宽子区间。$i = ${i}$ 这一项在哪个 $x$ 处计算 $f$？`,
      ),
      answer,
      mistakes: distinctWhys([
        why(hi, `This is $a + i\\Delta x$, the right end of subinterval $${i}$.`, `这是 $a + i\\Delta x$，即第 $${i}$ 个子区间的右端点。`),
        why(
          lo,
          `This is $a + (i - 1)\\Delta x$, the left end of subinterval $${i}$.`,
          `这是 $a + (i - 1)\\Delta x$，即第 $${i}$ 个子区间的左端点。`,
        ),
        why(
          Q.of(a).add(d.mul(Q.of(i, 2))),
          "This halves $i\\Delta x$; the midpoint is half a width before the right end, $a + i\\Delta x - \\frac{1}{2}\\Delta x$.",
          "这里把 $i\\Delta x$ 减半了；中点在右端点之前半个宽度处，即 $a + i\\Delta x - \\frac{1}{2}\\Delta x$。",
        ),
      ]),
      solution: t(
        ...walkPair(
          [
            [
              "Find the width",
              "求宽度",
              `$\\Delta x = \\frac{${b} - ${paren(a)}}{${n}} = ${d.toLatex()}$.`,
              `$\\Delta x = \\frac{${b} - ${paren(a)}}{${n}} = ${d.toLatex()}$。`,
            ],
            [
              `Find subinterval ${i}`,
              `找第 ${i} 个子区间`,
              `It runs from $a + ${i - 1 === 1 ? "" : i - 1}\\Delta x = ${lo.toLatex()}$ to $a + ${i}\\Delta x = ${hi.toLatex()}$.`,
              `它从 $a + ${i - 1 === 1 ? "" : i - 1}\\Delta x = ${lo.toLatex()}$ 到 $a + ${i}\\Delta x = ${hi.toLatex()}$。`,
            ],
            [
              "Take its midpoint",
              "取它的中点",
              `$$${a} + \\left(${i} - \\frac{1}{2}\\right) \\cdot ${d.toLatex()} = ${answer.toLatex()}$$`,
              `$$${a} + \\left(${i} - \\frac{1}{2}\\right) \\cdot ${d.toLatex()} = ${answer.toLatex()}$$`,
            ],
          ],
          [
            `Average the two ends: $\\frac{1}{2}\\left(${lo.toLatex()} + ${paren(hi)}\\right) = ${answer.toLatex()}$.`,
            `取两端的平均：$\\frac{1}{2}\\left(${lo.toLatex()} + ${paren(hi)}\\right) = ${answer.toLatex()}$。`,
          ],
        ),
      ),
    });
  },
);

/** shapes are functions with a known concavity on positive x, with their values, for ordering approximations. */
const shapes: readonly { f: string; up: boolean; at: (x: number) => number }[] = [
  { f: "e^{x}", up: true, at: (x) => Math.exp(x) },
  { f: "\\frac{1}{x + 1}", up: true, at: (x) => 1 / (x + 1) },
  { f: "x^{2} + 1", up: true, at: (x) => x * x + 1 },
  { f: "\\ln(x + 1)", up: false, at: (x) => Math.log(x + 1) },
  { f: "\\sqrt{x + 1}", up: false, at: (x) => Math.sqrt(x + 1) },
  { f: "6x - x^{2}", up: false, at: (x) => 6 * x - x * x },
];

const orderingEstimates = {
  ...point(
    "ordering-the-midpoint-and-trapezoidal-estimates",
    ["Ordering the midpoint and trapezoidal estimates", "比较中点估计与梯形估计"],
    [
      "Concavity orders the two estimates around the exact area. On a concave-up graph, chords lie above the curve and tangents below, so $M_{n} < \\int f < T_{n}$. On a concave-down graph the order reverses. Monotonicity plays no part here.\n\nFor $e^{x}$ on $[0, 1]$ with one subinterval, $M_{1} = e^{0.5} \\approx 1.6487$ and $T_{1} = \\frac{1 + e}{2} \\approx 1.8591$, so $M_{1} < \\int_{0}^{1} e^{x} \\, dx < T_{1}$.\n\nCheck: the exact value is $e - 1 \\approx 1.7183$, between the two.\n\n> **Watch out.** The two estimates always lie on opposite sides of the integral, so it is never above or below both; and only concavity decides which is which.",
      "凹凸性决定了两个估计值与精确面积的大小顺序。在上凹图像上，弦在曲线上方，切线在曲线下方，所以 $M_{n} < \\int f < T_{n}$。在下凹图像上顺序相反。这里单调性不起作用。\n\n对 $[0, 1]$ 上的 $e^{x}$ 取一个子区间，$M_{1} = e^{0.5} \\approx 1.6487$，$T_{1} = \\frac{1 + e}{2} \\approx 1.8591$，所以 $M_{1} < \\int_{0}^{1} e^{x} \\, dx < T_{1}$。\n\n检验：精确值 $e - 1 \\approx 1.7183$，在两者之间。\n\n> **注意。** 两个估计值总在积分的两侧，积分不会同时大于或小于两者；哪个大哪个小只由凹凸性决定。",
    ],
    (rng) => {
      const s = rng.pick(shapes);
      const p = rng.int(0, 4);
      const q = p + rng.int(1, 2);
      const n = rng.pick([4, 6, 8, 10]);
      const I = `\\int_{${p}}^{${q}} f`;
      const a = `M_{${n}} < ${I} < T_{${n}}`;
      const b = `T_{${n}} < ${I} < M_{${n}}`;
      const above = `${I} < M_{${n}} < T_{${n}}`;
      const below = `M_{${n}} < T_{${n}} < ${I}`;
      const m1 = (q - p) * s.at((p + q) / 2);
      const t1 = ((q - p) * (s.at(p) + s.at(q))) / 2;
      const near = (v: number) => (Math.abs(v - Math.round(v)) < 1e-9 ? `= ${Math.round(v)}` : `\\approx ${round3(v)}`);
      const curve = s.up ? "concave up" : "concave down";
      const curveZh = s.up ? "上凹" : "下凹";
      const tangents = (side: string) =>
        `the tangent lines at the midpoints, whose areas the midpoint rectangles share, lie ${side} the curve`;
      const tangentsZh = (side: string) => `中点处的切线在曲线${side}，而中点矩形的面积等于切线下方的面积`;
      const lowSide = s.up ? tangents("below") : `the chords of the trapezoids lie below the curve`;
      const lowSideZh = s.up ? tangentsZh("下方") : "梯形的弦在曲线下方";
      const highSide = s.up ? `the chords of the trapezoids lie above the curve` : tangents("above");
      const highSideZh = s.up ? "梯形的弦在曲线上方" : tangentsZh("上方");
      const low = s.up ? `M_{${n}}` : `T_{${n}}`;
      const high = s.up ? `T_{${n}}` : `M_{${n}}`;
      const belowBoth = `This makes the integral smaller than both estimates. But on a ${curve} graph ${lowSide}, so the integral is larger than $${low}$.`;
      const belowBothZh = `这使积分比两个估计值都小。但在${curveZh}的图像上，${lowSideZh}，所以积分大于 $${low}$。`;
      const aboveBoth = `This makes the integral larger than both estimates. But on a ${curve} graph ${highSide}, so the integral is smaller than $${high}$.`;
      const aboveBothZh = `这使积分比两个估计值都大。但在${curveZh}的图像上，${highSideZh}，所以积分小于 $${high}$。`;
      return reasoned(
        choose(
          rng,
          [
            `Let $f(x) = ${s.f}$ on $[${p}, ${q}]$, with midpoint and trapezoidal approximations $M_{${n}}$ and $T_{${n}}$. Which is true?`,
            `设 $[${p}, ${q}]$ 上的 $f(x) = ${s.f}$，中点近似和梯形近似分别是 $M_{${n}}$ 和 $T_{${n}}$。哪项正确？`,
          ],
          same2(s.up ? a : b),
          [same2(s.up ? b : a), same2(above), same2(below)],
          walkPair(
            [
              [
                "Find the concavity",
                "判断凹凸性",
                `$f''$ is ${s.up ? "positive" : "negative"} on $[${p}, ${q}]$, so $f$ is concave ${s.up ? "up" : "down"}.`,
                `$f''$ 在 $[${p}, ${q}]$ 上${s.up ? "为正" : "为负"}，所以 $f$ ${s.up ? "上凹" : "下凹"}。`,
              ],
              [
                "Place the trapezoids",
                "确定梯形的位置",
                `Each chord lies ${s.up ? "above" : "below"} the graph, so $T_{${n}}$ is ${s.up ? "larger" : "smaller"} than the integral.`,
                `每条弦都在图像${s.up ? "上方" : "下方"}，所以 $T_{${n}}$ ${s.up ? "大于" : "小于"}积分。`,
              ],
              [
                "Place the midpoint rectangles",
                "确定中点矩形的位置",
                `Each midpoint rectangle has the same area as the region under the tangent line at its midpoint, which lies ${s.up ? "below" : "above"} the graph. So $M_{${n}}$ is ${s.up ? "smaller" : "larger"}, and $${s.up ? a : b}$.`,
                `每个中点矩形的面积等于中点处切线下方的面积，而切线在图像${s.up ? "下方" : "上方"}。所以 $M_{${n}}$ ${s.up ? "较小" : "较大"}，$${s.up ? a : b}$。`,
              ],
            ],
            [
              `With a single subinterval, $M_{1} = ${q - p} \\cdot f\\left(${(p + q) / 2}\\right) ${near(m1)}$ and $T_{1} = ${q - p} \\cdot \\frac{f(${p}) + f(${q})}{2} ${near(t1)}$, so already $M_{1} ${s.up ? "<" : ">"} T_{1}$, the same order.`,
              `只取一个子区间时，$M_{1} = ${q - p} \\cdot f\\left(${(p + q) / 2}\\right) ${near(m1)}$，$T_{1} = ${q - p} \\cdot \\frac{f(${p}) + f(${q})}{2} ${near(t1)}$，已经有 $M_{1} ${s.up ? "<" : ">"} T_{1}$，顺序相同。`,
            ],
          ),
        ),
        [
          [
            `$${s.up ? b : a}$`,
            `That is the order for a concave-${s.up ? "down" : "up"} graph; this one is concave ${s.up ? "up" : "down"}.`,
            `那是${s.up ? "下凹" : "上凹"}图像的顺序；这个图像${s.up ? "上凹" : "下凹"}。`,
          ],
          [`$${above}$`, belowBoth, belowBothZh],
          [`$${below}$`, aboveBoth, aboveBothZh],
        ],
      );
    },
  ),
  figure: calculusDrawings3["approximating-areas-under-graphs-of-composite-functions#ordering-the-midpoint-and-trapezoidal-estimates"],
};

/** UnitIntegral is an integrand with limits whose exact value is a whole number, with the values of its antiderivative and typical slips. */
interface UnitIntegral {
  readonly f: string;
  readonly lo: string;
  readonly hi: string;
  readonly value: number;
  readonly anti: string;
  readonly atHi: string;
  readonly atLo: string;
  readonly g: (x: number) => number;
  readonly from: number;
  readonly to: number;
  readonly slips: readonly (readonly [value: number, en: string, zh: string])[];
}

/** unitIntegrals are integrands and limits whose exact value is a whole number. */
const unitIntegrals: readonly UnitIntegral[] = [
  {
    f: "\\sec^{2}x",
    lo: "0",
    hi: "\\frac{\\pi}{4}",
    value: 1,
    anti: "\\tan x",
    atHi: "\\tan\\frac{\\pi}{4} = 1",
    atLo: "\\tan 0 = 0",
    g: (x) => 1 / Math.cos(x) ** 2,
    from: 0,
    to: Math.PI / 4,
    slips: [
      [
        2,
        "This evaluates the integrand, $\\sec^{2}\\frac{\\pi}{4} = 2$; the theorem uses an antiderivative, $\\tan x$.",
        "这是在求被积函数的值 $\\sec^{2}\\frac{\\pi}{4} = 2$；基本定理用的是原函数 $\\tan x$。",
      ],
    ],
  },
  {
    f: "\\csc^{2}x",
    lo: "\\frac{\\pi}{4}",
    hi: "\\frac{\\pi}{2}",
    value: 1,
    anti: "-\\cot x",
    atHi: "-\\cot\\frac{\\pi}{2} = 0",
    atLo: "-\\cot\\frac{\\pi}{4} = -1",
    g: (x) => 1 / Math.sin(x) ** 2,
    from: Math.PI / 4,
    to: Math.PI / 2,
    slips: [
      [-1, "This drops the minus sign of the antiderivative $-\\cot x$.", "这里丢掉了原函数 $-\\cot x$ 的负号。"],
      [
        0,
        "This is the antiderivative at the upper limit alone; its value $-1$ at the lower limit must be subtracted.",
        "这只是原函数在上限处的值；还要减去它在下限处的值 $-1$。",
      ],
    ],
  },
  {
    f: "\\sec x\\tan x",
    lo: "0",
    hi: "\\frac{\\pi}{3}",
    value: 1,
    anti: "\\sec x",
    atHi: "\\sec\\frac{\\pi}{3} = 2",
    atLo: "\\sec 0 = 1",
    g: (x) => Math.tan(x) / Math.cos(x),
    from: 0,
    to: Math.PI / 3,
    slips: [
      [2, "This leaves out the value $\\sec 0 = 1$ at the lower limit.", "这里漏掉了下限处的值 $\\sec 0 = 1$。"],
      [3, "This adds $\\sec 0 = 1$ instead of subtracting it.", "这里把 $\\sec 0 = 1$ 加上了，应该减去。"],
    ],
  },
  {
    f: "\\csc x\\cot x",
    lo: "\\frac{\\pi}{6}",
    hi: "\\frac{\\pi}{2}",
    value: 1,
    anti: "-\\csc x",
    atHi: "-\\csc\\frac{\\pi}{2} = -1",
    atLo: "-\\csc\\frac{\\pi}{6} = -2",
    g: (x) => 1 / (Math.sin(x) * Math.tan(x)),
    from: Math.PI / 6,
    to: Math.PI / 2,
    slips: [
      [-1, "This drops the minus sign of the antiderivative $-\\csc x$.", "这里丢掉了原函数 $-\\csc x$ 的负号。"],
      [-3, "This adds the value $-2$ at the lower limit instead of subtracting it.", "这里把下限处的值 $-2$ 加上了，应该减去。"],
    ],
  },
  {
    f: "\\sec^{2}x",
    lo: "-\\frac{\\pi}{4}",
    hi: "\\frac{\\pi}{4}",
    value: 2,
    anti: "\\tan x",
    atHi: "\\tan\\frac{\\pi}{4} = 1",
    atLo: "\\tan\\left(-\\frac{\\pi}{4}\\right) = -1",
    g: (x) => 1 / Math.cos(x) ** 2,
    from: -Math.PI / 4,
    to: Math.PI / 4,
    slips: [
      [0, "This adds the value $-1$ at the lower limit instead of subtracting it.", "这里把下限处的值 $-1$ 加上了，应该减去。"],
      [1, "This leaves out the value $-1$ at the lower limit.", "这里漏掉了下限处的值 $-1$。"],
    ],
  },
  {
    f: "\\frac{1}{x}",
    lo: "1",
    hi: "e^{2}",
    value: 2,
    anti: "\\ln x",
    atHi: "\\ln e^{2} = 2",
    atLo: "\\ln 1 = 0",
    g: (x) => 1 / x,
    from: 1,
    to: Math.E ** 2,
    slips: [
      [
        1,
        "This takes $\\ln 1$ as $1$; $\\ln 1 = 0$, since $e^{0} = 1$.",
        "这里把 $\\ln 1$ 当成了 $1$；因为 $e^{0} = 1$，所以 $\\ln 1 = 0$。",
      ],
    ],
  },
  {
    f: "\\frac{1}{x}",
    lo: "e",
    hi: "e^{3}",
    value: 2,
    anti: "\\ln x",
    atHi: "\\ln e^{3} = 3",
    atLo: "\\ln e = 1",
    g: (x) => 1 / x,
    from: Math.E,
    to: Math.E ** 3,
    slips: [
      [3, "This leaves out the value $\\ln e = 1$ at the lower limit.", "这里漏掉了下限处的值 $\\ln e = 1$。"],
      [4, "This adds $\\ln e = 1$ instead of subtracting it.", "这里把 $\\ln e = 1$ 加上了，应该减去。"],
    ],
  },
  {
    f: "e^{x}",
    lo: "0",
    hi: "\\ln 4",
    value: 3,
    anti: "e^{x}",
    atHi: "e^{\\ln 4} = 4",
    atLo: "e^{0} = 1",
    g: (x) => Math.exp(x),
    from: 0,
    to: Math.log(4),
    slips: [
      [4, "This leaves out the value $e^{0} = 1$ at the lower limit.", "这里漏掉了下限处的值 $e^{0} = 1$。"],
      [5, "This adds $e^{0} = 1$ instead of subtracting it.", "这里把 $e^{0} = 1$ 加上了，应该减去。"],
    ],
  },
  {
    f: "e^{x}",
    lo: "\\ln 2",
    hi: "\\ln 7",
    value: 5,
    anti: "e^{x}",
    atHi: "e^{\\ln 7} = 7",
    atLo: "e^{\\ln 2} = 2",
    g: (x) => Math.exp(x),
    from: Math.log(2),
    to: Math.log(7),
    slips: [
      [7, "This leaves out the value $e^{\\ln 2} = 2$ at the lower limit.", "这里漏掉了下限处的值 $e^{\\ln 2} = 2$。"],
      [9, "This adds $e^{\\ln 2} = 2$ instead of subtracting it.", "这里把 $e^{\\ln 2} = 2$ 加上了，应该减去。"],
    ],
  },
];

const wholeNumberIntegrals = point(
  "other-trigonometric-and-exponential-antiderivatives",
  ["Other trigonometric and exponential antiderivatives", "其他三角与指数原函数"],
  [
    "The fundamental theorem works for any known antiderivative, including $\\tan x$ for $\\sec^{2}x$, $-\\cot x$ for $\\csc^{2}x$ and $\\sec x$ for $\\sec x\\tan x$. The minus signs in $-\\cot x$ and $-\\csc x$, and subtracting the value at the lower limit, are the usual sources of error.\n\nFor example, $\\int_{0}^{\\frac{\\pi}{4}} \\sec^{2}x \\, dx = \\tan\\frac{\\pi}{4} - \\tan 0 = 1$.\n\nCheck: the midpoint sum with $2$ subintervals is $\\frac{\\pi}{8}\\left(\\sec^{2}\\frac{\\pi}{16} + \\sec^{2}\\frac{3\\pi}{16}\\right) \\approx 0.976$, close to $1$.\n\n> **Watch out.** $\\int \\csc^{2}x \\, dx = -\\cot x + C$ and $\\int \\csc x\\cot x \\, dx = -\\csc x + C$ carry minus signs; and the value at the lower limit, such as $\\sec 0 = 1$ or $e^{0} = 1$, is not zero.",
    "微积分基本定理适用于任何已知的原函数，包括 $\\sec^{2}x$ 的原函数 $\\tan x$、$\\csc^{2}x$ 的原函数 $-\\cot x$ 和 $\\sec x\\tan x$ 的原函数 $\\sec x$。$-\\cot x$ 和 $-\\csc x$ 中的负号，以及减去下限处的值，是常见的出错之处。\n\n例如 $\\int_{0}^{\\frac{\\pi}{4}} \\sec^{2}x \\, dx = \\tan\\frac{\\pi}{4} - \\tan 0 = 1$。\n\n检验：取 $2$ 个子区间，中点和为 $\\frac{\\pi}{8}\\left(\\sec^{2}\\frac{\\pi}{16} + \\sec^{2}\\frac{3\\pi}{16}\\right) \\approx 0.976$，与 $1$ 很接近。\n\n> **注意。** $\\int \\csc^{2}x \\, dx = -\\cot x + C$ 和 $\\int \\csc x\\cot x \\, dx = -\\csc x + C$ 都带负号；下限处的值，比如 $\\sec 0 = 1$ 或 $e^{0} = 1$，并不是零。",
  ],
  (rng) => {
    const u = rng.pick(unitIntegrals);
    const c = nz(rng, 12);
    const answer = c * u.value;
    const integrand = u.f === "\\frac{1}{x}" ? `\\frac{${c}}{x}` : poly([c, u.f]);
    const h = (u.to - u.from) / 4;
    const m4 = c * h * [0.5, 1.5, 2.5, 3.5].reduce((s, j) => s + u.g(u.from + j * h), 0);
    const endValue = (s: string) => s.slice(s.lastIndexOf("= ") + 2);
    const hiV = endValue(u.atHi);
    const loV = endValue(u.atLo).startsWith("-") ? `(${endValue(u.atLo)})` : endValue(u.atLo);
    return numberProblem({
      prompt: t(`Evaluate $\\int_{${u.lo}}^{${u.hi}} ${integrand} \\, dx$.`, `计算 $\\int_{${u.lo}}^{${u.hi}} ${integrand} \\, dx$。`),
      answer,
      mistakes: distinctWhys([
        ...u.slips.map(([v, en, zh]) =>
          why(
            c * v,
            c === 1 ? en : `${en} That gives $${v}$, and multiplying by $${c}$ gives $${c * v}$.`,
            c === 1 ? zh : `${zh}这样得 $${v}$，再乘以 $${c}$ 得 $${c * v}$。`,
          ),
        ),
        why(
          -answer,
          c === 1
            ? "This subtracts in the wrong order: the value at the upper limit comes first."
            : `This subtracts in the wrong order, giving $${-u.value}$, and multiplying by $${c}$ gives $${-answer}$; the value at the upper limit comes first.`,
          c === 1
            ? "这里减的顺序反了：应该用上限处的值减去下限处的值。"
            : `这里减的顺序反了，得 $${-u.value}$，再乘以 $${c}$ 得 $${-answer}$；应该用上限处的值减去下限处的值。`,
        ),
      ]),
      solution: t(
        ...walkPair(
          [
            [
              "Find an antiderivative",
              "求原函数",
              `An antiderivative of $${u.f}$ is $${u.anti}$.`,
              `$${u.f}$ 的一个原函数是 $${u.anti}$。`,
            ],
            [
              "Evaluate at the limits",
              "在上下限处求值",
              `$${u.atHi}$ and $${u.atLo}$, so $\\int_{${u.lo}}^{${u.hi}} ${u.f} \\, dx = ${hiV} - ${loV} = ${u.value}$.`,
              `$${u.atHi}$，$${u.atLo}$，所以 $\\int_{${u.lo}}^{${u.hi}} ${u.f} \\, dx = ${hiV} - ${loV} = ${u.value}$。`,
            ],
            [
              "Multiply by the constant",
              "乘以常数",
              `$${paren(c)} \\cdot ${u.value} = ${answer}$.`,
              `$${paren(c)} \\cdot ${u.value} = ${answer}$。`,
            ],
          ],
          [
            `The midpoint sum with $4$ subintervals is $\\approx ${round3(m4)}$, close to $${answer}$.`,
            `取 $4$ 个子区间，中点和 $\\approx ${round3(m4)}$，与 $${answer}$ 很接近。`,
          ],
        ),
      ),
    });
  },
);

const unknownFromCombination = point(
  "an-integral-from-a-known-combination",
  ["An integral from a known combination", "由已知组合求积分"],
  [
    "The sum and constant multiple rules turn a statement about $\\int (pf + qg)$ into a linear equation in the two integrals. If one is known, solve for the other, dividing by its coefficient at the end.\n\nFor example, if $\\int_{0}^{1} \\left[2f(x) + 3g(x)\\right] dx = 13$ and $\\int_{0}^{1} f(x) \\, dx = 2$, then $2 \\cdot 2 + 3G = 13$, so $3G = 9$ and $\\int_{0}^{1} g(x) \\, dx = 3$.\n\nCheck: $2 \\cdot 2 + 3 \\cdot 3 = 13$.\n\n> **Watch out.** Subtract $p$ times the known integral, not the integral itself, and divide by $q$ at the end.",
    "和与常数倍法则把关于 $\\int (pf + qg)$ 的条件变成两个积分的一次方程。如果其中一个已知，就解出另一个，最后除以它的系数。\n\n例如，若 $\\int_{0}^{1} \\left[2f(x) + 3g(x)\\right] dx = 13$，$\\int_{0}^{1} f(x) \\, dx = 2$，则 $2 \\cdot 2 + 3G = 13$，所以 $3G = 9$，$\\int_{0}^{1} g(x) \\, dx = 3$。\n\n检验：$2 \\cdot 2 + 3 \\cdot 3 = 13$。\n\n> **注意。** 要减去已知积分的 $p$ 倍，而不是积分本身；最后除以 $q$。",
  ],
  (rng) => {
    const a = rng.int(-4, 2);
    const b = a + rng.int(1, 6);
    const p = nz(rng, 6);
    const q = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
    const F = nz(rng, 9);
    const G = rng.int(-9, 9);
    const S = p * F + q * G;
    const integrand = poly([p, "f(x)"], [q, "g(x)"]);
    return numberProblem({
      prompt: t(
        `Given $\\int_{${a}}^{${b}} \\left[${integrand}\\right] dx = ${S}$ and $\\int_{${a}}^{${b}} f(x) \\, dx = ${F}$, find $\\int_{${a}}^{${b}} g(x) \\, dx$.`,
        `已知 $\\int_{${a}}^{${b}} \\left[${integrand}\\right] dx = ${S}$，$\\int_{${a}}^{${b}} f(x) \\, dx = ${F}$，求 $\\int_{${a}}^{${b}} g(x) \\, dx$。`,
      ),
      answer: G,
      mistakes: distinctWhys([
        why(
          Q.of(S - F, q),
          `This subtracts $${F}$ itself; the known part is $${paren(p)} \\cdot ${paren(F)} = ${p * F}$.`,
          `这里减去的是 $${F}$ 本身；已知部分是 $${paren(p)} \\cdot ${paren(F)} = ${p * F}$。`,
        ),
        why(
          Q.of(S + p * F, q),
          `This adds $${p * F}$ to $${S}$; moving the known part to the other side subtracts it.`,
          `这里把 $${p * F}$ 加到了 $${S}$ 上；把已知部分移到等号另一边应该减去它。`,
        ),
        why(S - p * F, `This is $${q}G$; divide by $${q}$ to find $G$.`, `这是 $${q}G$；还要除以 $${q}$ 才得到 $G$。`),
      ]),
      solution: t(
        ...walkPair(
          [
            [
              "Split the integral",
              "拆开积分",
              `With $G = \\int_{${a}}^{${b}} g(x) \\, dx$, the sum and constant multiple rules give $${paren(p)} \\cdot ${paren(F)} + ${paren(q)}G = ${S}$.`,
              `设 $G = \\int_{${a}}^{${b}} g(x) \\, dx$，由和法则与常数倍法则得 $${paren(p)} \\cdot ${paren(F)} + ${paren(q)}G = ${S}$。`,
            ],
            [
              "Solve for G",
              "解出 G",
              `$${q}G = ${S} - ${paren(p * F)} = ${S - p * F}$, so $G = ${G}$.`,
              `$${q}G = ${S} - ${paren(p * F)} = ${S - p * F}$，所以 $G = ${G}$。`,
            ],
          ],
          [
            `Substitute back: $${paren(p)} \\cdot ${paren(F)} + ${paren(q)} \\cdot ${paren(G)} = ${p * F} + ${paren(q * G)} = ${S}$, the given value.`,
            `代回原式：$${paren(p)} \\cdot ${paren(F)} + ${paren(q)} \\cdot ${paren(G)} = ${p * F} + ${paren(q * G)} = ${S}$，正是已知值。`,
          ],
        ),
      ),
    });
  },
);

const whereSignedCancels = {
  ...point(
    "where-signed-areas-cancel",
    ["Where signed areas cancel", "有向面积相互抵消之处"],
    [
      "A line crosses the $x$-axis at $r$, and the triangles on either side have opposite signs. The signed integral from $a$ to $c$ is zero when the two triangles are congruent, which happens when $r$ is the midpoint of $a$ and $c$. The total area is not zero there.\n\nFor $f(x) = x - 2$ starting at $a = 0$, the root is $2$, so $c = 2 \\cdot 2 - 0$, which is $4$.\n\nCheck: $\\int_{0}^{4} (x - 2) \\, dx$ is $\\Big[\\frac{x^{2}}{2} - 2x\\Big]_{0}^{4}$, which is $8 - 8 - 0$, or $0$.\n\n> **Watch out.** The answer is not the root itself. Stopping at $c = r$ leaves one whole triangle uncancelled.",
      "直线在 $r$ 处穿过 $x$ 轴，两侧的三角形符号相反。从 $a$ 到 $c$ 的有向积分为零，当且仅当两个三角形全等，也就是 $r$ 是 $a$ 和 $c$ 的中点。这时总面积并不为零。\n\n对 $f(x) = x - 2$，从 $a = 0$ 开始，根是 $2$，所以 $c = 2 \\cdot 2 - 0$，即 $4$。\n\n检验：$\\int_{0}^{4} (x - 2) \\, dx$ 等于 $\\Big[\\frac{x^{2}}{2} - 2x\\Big]_{0}^{4}$，即 $8 - 8 - 0$，等于 $0$。\n\n> **注意。** 答案不是根本身。停在 $c = r$ 处，会留下一整个没有抵消的三角形。",
    ],
    (rng) => {
      const m = nz(rng, 5);
      const r = rng.int(-5, 5);
      const a = r - rng.int(1, 7);
      const c = 2 * r - a;
      const f = linear(m, -m * r);
      const half = Q.of(m, 2);
      const coef = half.eq(Q.of(1)) ? "" : half.eq(Q.of(-1)) ? "-" : half.toLatex();
      return ask(
        [
          `Find the value $c > ${a}$ for which $\\int_{${a}}^{c} (${f}) \\, dx = 0$.`,
          `求满足 $\\int_{${a}}^{c} (${f}) \\, dx = 0$ 且 $c > ${a}$ 的 $c$。`,
        ],
        c,
        [r, 2 * r + a, r - a],
        walkPair(
          [
            [
              "Find the root",
              "求根",
              `$${f} = 0$ at $x = ${r}$, so the line is on one side of the axis from $${a}$ to $${r}$ and on the other side after $${r}$.`,
              `$${f} = 0$ 的解为 $x = ${r}$，所以直线从 $${a}$ 到 $${r}$ 在轴的一侧，过了 $${r}$ 之后在另一侧。`,
            ],
            [
              "Make the triangles congruent",
              "使两个三角形全等",
              `The signed areas cancel when $${r}$ is the midpoint of $${a}$ and $c$, so $c = 2 \\cdot ${paren(r)} - ${paren(a)} = ${c}$.`,
              `当 $${r}$ 是 $${a}$ 和 $c$ 的中点时有向面积抵消，所以 $c = 2 \\cdot ${paren(r)} - ${paren(a)} = ${c}$。`,
            ],
          ],
          [
            `Integrate directly. An antiderivative of $${f}$ is $${coef}${power(r, 2)}$, and\n\n$$\\int_{${a}}^{${c}} (${f}) \\, dx = ${coef === "" ? "" : coef === "-" ? "-" : `${coef} \\cdot `}\\left(${(c - r) ** 2} - ${(a - r) ** 2}\\right) = 0$$`,
            `直接积分。$${f}$ 的一个原函数是 $${coef}${power(r, 2)}$，且\n\n$$\\int_{${a}}^{${c}} (${f}) \\, dx = ${coef === "" ? "" : coef === "-" ? "-" : `${coef} \\cdot `}\\left(${(c - r) ** 2} - ${(a - r) ** 2}\\right) = 0$$`,
          ],
        ),
      );
    },
  ),
  figure: calculusDrawings3["finding-the-area-between-a-curve-and-the-x-axis-when-they-intersect#where-signed-areas-cancel"],
};

const symmetryIntegrals = {
  ...point(
    "definite-integrals-from-symmetry",
    ["Definite integrals from symmetry", "由对称性求定积分"],
    [
      "Symmetry of the graph gives integrals without a formula. If $f$ is even, the areas on the two sides of the $y$-axis are equal with the same sign. If $f$ is odd, they are equal with opposite signs, so the integral over $[-a, a]$ is $0$.\n\nIf $\\int_{0}^{3} f(x) \\, dx = 9$, then $\\int_{-3}^{3} f(x) \\, dx$ is $18$ for an even $f$ and $0$ for an odd $f$, and $\\int_{-3}^{0} f(x) \\, dx$ is $9$ or $-9$.\n\nCheck: $f(x) = x^{2}$ is even with $\\int_{0}^{3} x^{2} \\, dx = 9$, and $\\int_{-3}^{3} x^{2} \\, dx$ is $9 - (-9)$, which is $18$.\n\n> **Watch out.** For an odd $f$, the integral over $[-a, 0]$ is the negative of the one over $[0, a]$, not the same value.",
      "图像的对称性不用公式就能给出积分。若 $f$ 是偶函数，$y$ 轴两侧的面积相等，符号相同。若 $f$ 是奇函数，两侧面积相等，符号相反，所以在 $[-a, a]$ 上的积分是 $0$。\n\n若 $\\int_{0}^{3} f(x) \\, dx = 9$，则偶函数的 $\\int_{-3}^{3} f(x) \\, dx$ 为 $18$，奇函数的为 $0$；而 $\\int_{-3}^{0} f(x) \\, dx$ 分别为 $9$ 和 $-9$。\n\n检验：$f(x) = x^{2}$ 是偶函数，$\\int_{0}^{3} x^{2} \\, dx = 9$，而 $\\int_{-3}^{3} x^{2} \\, dx$ 等于 $9 - (-9)$，即 $18$。\n\n> **注意。** 对奇函数，$[-a, 0]$ 上的积分是 $[0, a]$ 上积分的相反数，不是同一个值。",
    ],
    (rng) => {
      const a = rng.int(1, 9);
      const v = nz(rng, 12);
      const even = rng.bool();
      const whole = rng.bool();
      const answer = whole ? (even ? 2 * v : 0) : even ? v : -v;
      const upper = whole ? a : 0;
      const left = even ? v : -v;
      const height = Q.of(v, a);
      const slope = Q.of(2 * v, a * a);
      const check: Pair = even
        ? [
            `Try the constant function $f(x) = ${height.toLatex()}$, which is even and has $\\int_{0}^{${a}} f(x) \\, dx = ${v}$. Over $[${-a}, ${upper}]$ it gives a rectangle of width $${upper + a}$, with signed area $${height.toLatex()} \\cdot ${upper + a}$, which is $${answer}$.`,
            `取常数函数 $f(x) = ${height.toLatex()}$，它是偶函数，且 $\\int_{0}^{${a}} f(x) \\, dx = ${v}$。在 $[${-a}, ${upper}]$ 上它是宽为 $${upper + a}$ 的矩形，有向面积为 $${height.toLatex()} \\cdot ${upper + a}$，即 $${answer}$。`,
          ]
        : [
            `Try the line $f(x) = ${poly([slope, "x"])}$, which is odd and has $\\int_{0}^{${a}} f(x) \\, dx = ${v}$, a triangle. On $[${-a}, 0]$ it makes the same triangle on the other side of the axis, with signed area $${-v}$${whole ? `, and $${-v} + ${paren(v)}$ is $0$` : ""}.`,
            `取直线 $f(x) = ${poly([slope, "x"])}$，它是奇函数，且 $\\int_{0}^{${a}} f(x) \\, dx = ${v}$，是一个三角形。在 $[${-a}, 0]$ 上它在轴的另一侧形成同样的三角形，有向面积为 $${-v}$${whole ? `，而 $${-v} + ${paren(v)}$ 等于 $0$` : ""}。`,
          ];
      return ask(
        [
          `$f$ is ${even ? "even" : "odd"} and $\\int_{0}^{${a}} f(x) \\, dx = ${v}$. Find $\\int_{${-a}}^{${upper}} f(x) \\, dx$.`,
          `$f$ 是${even ? "偶" : "奇"}函数，且 $\\int_{0}^{${a}} f(x) \\, dx = ${v}$。求 $\\int_{${-a}}^{${upper}} f(x) \\, dx$。`,
        ],
        answer,
        [2 * v, 0, v, -v],
        walkPair(
          [
            [
              "Use the symmetry",
              "利用对称性",
              `The graph on $[${-a}, 0]$ is the ${even ? "mirror image" : "point reflection"} of the graph on $[0, ${a}]$, so $\\int_{${-a}}^{0} f(x) \\, dx = ${left}$.`,
              `$[${-a}, 0]$ 上的图像是 $[0, ${a}]$ 上图像的${even ? "镜像" : "中心对称图形"}，所以 $\\int_{${-a}}^{0} f(x) \\, dx = ${left}$。`,
            ],
            whole
              ? [
                  "Add the two halves",
                  "把两半相加",
                  `$\\int_{${-a}}^{${a}} f(x) \\, dx = ${left} + ${paren(v)} = ${answer}$.`,
                  `$\\int_{${-a}}^{${a}} f(x) \\, dx = ${left} + ${paren(v)} = ${answer}$。`,
                ]
              : [
                  "Read off the answer",
                  "读出答案",
                  `The integral asked for is this half, $${answer}$.`,
                  `所求的积分就是这一半，即 $${answer}$。`,
                ],
          ],
          check,
        ),
      );
    },
  ),
  figure: calculusDrawings3["calculating-the-definite-integral-of-a-function-given-its-graph#definite-integrals-from-symmetry"],
};

const valueFromNetChange = {
  ...point(
    "a-value-of-the-function-from-its-net-change",
    ["A value of the function from its net change", "由净变化求函数值"],
    [
      "The fundamental theorem says $\\int_{a}^{b} f'(x) \\, dx = f(b) - f(a)$, so knowing the integral and one value gives the other. Keep the order of the limits in mind: when the known value is at the upper limit, the unknown one is found by subtracting.\n\nIf $\\int_{1}^{4} f'(x) \\, dx = 6$ and $f(4) = 2$, then $f(1) = 2 - 6$, which is $-4$.\n\nCheck: $f(4) - f(1)$ is $2 - (-4)$, which is $6$, the given integral.\n\n> **Watch out.** Adding the integral to the value at the upper limit gives $f(4) + 6$, which is not $f(1)$. The integral is the change from the lower limit to the upper one.",
      "微积分基本定理给出 $\\int_{a}^{b} f'(x) \\, dx = f(b) - f(a)$，所以知道积分和一个函数值，就能求出另一个。注意上下限的顺序：已知的值在上限时，未知的值要用减法求得。\n\n若 $\\int_{1}^{4} f'(x) \\, dx = 6$，$f(4) = 2$，则 $f(1) = 2 - 6$，即 $-4$。\n\n检验：$f(4) - f(1)$ 等于 $2 - (-4)$，即 $6$，正是所给的积分。\n\n> **注意。** 把积分加到上限处的值上得 $f(4) + 6$，这不是 $f(1)$。积分是从下限到上限的变化量。",
    ],
    (rng) => {
      const a = rng.int(-6, 3);
      const b = a + rng.int(1, 7);
      const I = nz(rng, 15);
      const known = rng.int(-12, 12);
      const findLower = rng.bool();
      const answer = findLower ? known - I : known + I;
      const [fa, fb] = findLower ? [answer, known] : [known, answer];
      return ask(
        findLower
          ? [
              `$\\int_{${a}}^{${b}} f'(x) \\, dx = ${I}$ and $f(${b}) = ${known}$. Find $f(${a})$.`,
              `$\\int_{${a}}^{${b}} f'(x) \\, dx = ${I}$，$f(${b}) = ${known}$。求 $f(${a})$。`,
            ]
          : [
              `$\\int_{${a}}^{${b}} f'(x) \\, dx = ${I}$ and $f(${a}) = ${known}$. Find $f(${b})$.`,
              `$\\int_{${a}}^{${b}} f'(x) \\, dx = ${I}$，$f(${a}) = ${known}$。求 $f(${b})$。`,
            ],
        answer,
        [findLower ? known + I : known - I, I, I - known],
        walkPair(
          [
            [
              "Use the fundamental theorem",
              "用基本定理",
              `$f$ is an antiderivative of $f'$, so $f(${b}) - f(${a}) = ${I}$.`,
              `$f$ 是 $f'$ 的一个原函数，所以 $f(${b}) - f(${a}) = ${I}$。`,
            ],
            findLower
              ? [
                  "Solve for the lower value",
                  "解出下限处的值",
                  `The known value is at the upper limit, so subtract: $f(${a}) = f(${b}) - ${paren(I)} = ${known} - ${paren(I)} = ${answer}$.`,
                  `已知的值在上限处，所以用减法：$f(${a}) = f(${b}) - ${paren(I)} = ${known} - ${paren(I)} = ${answer}$。`,
                ]
              : [
                  "Solve for the upper value",
                  "解出上限处的值",
                  `The known value is at the lower limit, so add: $f(${b}) = f(${a}) + ${paren(I)} = ${known} + ${paren(I)} = ${answer}$.`,
                  `已知的值在下限处，所以用加法：$f(${b}) = f(${a}) + ${paren(I)} = ${known} + ${paren(I)} = ${answer}$。`,
                ],
          ],
          [
            `Put both values back: $f(${b}) - f(${a})$ is $${fb} - ${paren(fa)}$, which is $${fb - fa}$, the given integral.`,
            `把两个值代回去：$f(${b}) - f(${a})$ 等于 $${fb} - ${paren(fa)}$，即 $${fb - fa}$，正是所给的积分。`,
          ],
        ),
      );
    },
  ),
  figure:
    calculusDrawings3[
      "calculating-the-definite-integral-of-a-functions-derivative-given-its-graph#a-value-of-the-function-from-its-net-change"
    ],
};

/** areaStory draws four increasing points and three different areas for a derivative that is positive, negative, then positive. */
const areaStory = (rng: Rng) => {
  const x0 = rng.int(-8, -3);
  const x1 = x0 + rng.int(1, 4);
  const x2 = x1 + rng.int(1, 4);
  const x3 = x2 + rng.int(1, 4);
  const A1 = rng.int(2, 9);
  const A2 = rng.pick([2, 3, 4, 5, 6, 7, 8, 9].filter((x) => x !== A1));
  const A3 = rng.pick([2, 3, 4, 5, 6, 7, 8, 9].filter((x) => x !== A2));
  const prose: Pair = [
    `$f'$ is positive on $(${x0}, ${x1})$, negative on $(${x1}, ${x2})$ and positive on $(${x2}, ${x3})$, and the areas between its graph and the $x$-axis on these intervals are $${A1}$, $${A2}$ and $${A3}$.`,
    `$f'$ 在 $(${x0}, ${x1})$ 上为正，在 $(${x1}, ${x2})$ 上为负，在 $(${x2}, ${x3})$ 上为正，它的图像与 $x$ 轴在这些区间上围成的面积依次是 $${A1}$、$${A2}$ 和 $${A3}$。`,
  ];
  return { x0, x1, x2, x3, A1, A2, A3, prose };
};

const maximumFromAreas = {
  ...point(
    "the-absolute-maximum-from-areas-under-the-derivative",
    ["The absolute maximum from areas under the derivative", "由导数下的面积确定绝对最大值"],
    [
      "The absolute maximum is at a point where $f'$ changes from positive to negative or at an endpoint. Compare these candidates by net area: the right endpoint beats the interior peak only if the area gained after the dip is more than the area lost in it.\n\nSuppose $f'$ is positive on $(-4, -1)$, negative on $(-1, 2)$ and positive on $(2, 5)$, with areas $5$, $3$ and $4$. Relative to $f(-4)$, the peak at $x = -1$ is $5$ higher and the right endpoint is $5 - 3 + 4$, which is $6$, higher. The maximum is at $x = 5$.\n\nCheck: from $x = -1$ to $x = 5$, $f$ loses $3$ and gains $4$, a net gain of $1$, so $f(5)$ is above $f(-1)$.\n\n> **Watch out.** A peak inside the interval is only a local maximum. Compare it with the right endpoint before calling it the absolute maximum.",
      "绝对最大值出现在 $f'$ 由正变负的点或端点处。用净面积比较这些候选点：只有低谷之后增加的面积大于低谷中失去的面积时，右端点才超过内部的峰值。\n\n设 $f'$ 在 $(-4, -1)$ 上为正，在 $(-1, 2)$ 上为负，在 $(2, 5)$ 上为正，面积依次为 $5$、$3$、$4$。相对于 $f(-4)$，$x = -1$ 处的峰高出 $5$，右端点高出 $5 - 3 + 4$，即 $6$。最大值在 $x = 5$ 处。\n\n检验：从 $x = -1$ 到 $x = 5$，$f$ 先减少 $3$ 再增加 $4$，净增 $1$，所以 $f(5)$ 高于 $f(-1)$。\n\n> **注意。** 区间内部的峰只是局部最大值。称它为绝对最大值之前，先和右端点比较。",
    ],
    (rng) => {
      const s = areaStory(rng);
      const answer = s.A2 > s.A3 ? s.x1 : s.x3;
      const net = s.A3 - s.A2;
      return ask(
        [
          `${s.prose[0]} At which $x$ does $f$ attain its absolute maximum on $[${s.x0}, ${s.x3}]$?`,
          `${s.prose[1]}$f$ 在 $[${s.x0}, ${s.x3}]$ 上的绝对最大值在哪个 $x$ 处取到？`,
        ],
        answer,
        [s.A2 > s.A3 ? s.x3 : s.x1, s.x2, s.x0],
        walkPair(
          [
            [
              "List the candidates",
              "列出候选点",
              `$f'$ changes from positive to negative only at $x = ${s.x1}$, so the candidates are $x = ${s.x1}$ and the endpoints $x = ${s.x0}$ and $x = ${s.x3}$.`,
              `$f'$ 只在 $x = ${s.x1}$ 处由正变负，所以候选点为 $x = ${s.x1}$ 以及端点 $x = ${s.x0}$、$x = ${s.x3}$。`,
            ],
            [
              "Compare by net area",
              "用净面积比较",
              `Relative to $f(${s.x0})$:\n\n$$f(${s.x1}) - f(${s.x0}) = ${s.A1}$$\n\n$$f(${s.x3}) - f(${s.x0}) = ${s.A1} - ${s.A2} + ${s.A3} = ${s.A1 - s.A2 + s.A3}$$`,
              `相对于 $f(${s.x0})$：\n\n$$f(${s.x1}) - f(${s.x0}) = ${s.A1}$$\n\n$$f(${s.x3}) - f(${s.x0}) = ${s.A1} - ${s.A2} + ${s.A3} = ${s.A1 - s.A2 + s.A3}$$`,
            ],
            [
              "Choose the largest",
              "选出最大的",
              `Both are positive, so the start is not the maximum, and the larger is at $x = ${answer}$.`,
              `两者都是正数，所以起点不是最大值点，较大的在 $x = ${answer}$ 处。`,
            ],
          ],
          [
            `Compare the two leaders directly. From $x = ${s.x1}$ to $x = ${s.x3}$, $f$ loses $${s.A2}$ and then gains $${s.A3}$, a net change of $${net}$. ${net > 0 ? `That is positive, so $f(${s.x3})$ is higher.` : `That is negative, so $f(${s.x1})$ is higher.`}`,
            `直接比较领先的两点。从 $x = ${s.x1}$ 到 $x = ${s.x3}$，$f$ 先减少 $${s.A2}$ 再增加 $${s.A3}$，净变化为 $${net}$。${net > 0 ? `它是正的，所以 $f(${s.x3})$ 更高。` : `它是负的，所以 $f(${s.x1})$ 更高。`}`,
          ],
        ),
      );
    },
  ),
  figure: calculusDrawings3["maximizing-a-function-using-the-graph-of-its-derivative#the-absolute-maximum-from-areas-under-the-derivative"],
};

const minimumFromAreas = point(
  "the-absolute-minimum-from-areas-under-the-derivative",
  ["The absolute minimum from areas under the derivative", "由导数下的面积确定绝对最小值"],
  [
    "The absolute minimum is at a point where $f'$ changes from negative to positive or at an endpoint. Here the left endpoint is a real candidate: the interior dip is lower than the start only if the area lost is more than the area first gained.\n\nSuppose $f'$ is positive on $(-4, -1)$, negative on $(-1, 2)$ and positive on $(2, 5)$, with areas $5$, $3$ and $4$. Relative to $f(-4)$, the dip at $x = 2$ is $5 - 3$, which is $2$, higher, so the minimum is at the left endpoint $x = -4$.\n\nCheck: every other point is above the start. $f$ rises by $5$ first, falls by only $3$, and then rises again.\n\n> **Watch out.** A dip inside the interval is only a local minimum. If $f'$ starts out positive, the left endpoint can be lower.",
    "绝对最小值出现在 $f'$ 由负变正的点或端点处。这里左端点是真正的候选点：只有失去的面积大于最初增加的面积时，内部的低谷才低于起点。\n\n设 $f'$ 在 $(-4, -1)$ 上为正，在 $(-1, 2)$ 上为负，在 $(2, 5)$ 上为正，面积依次为 $5$、$3$、$4$。相对于 $f(-4)$，$x = 2$ 处的低谷高出 $5 - 3$，即 $2$，所以最小值在左端点 $x = -4$ 处。\n\n检验：其他每个点都高于起点。$f$ 先升高 $5$，只降低 $3$，然后又升高。\n\n> **注意。** 区间内部的低谷只是局部最小值。若 $f'$ 一开始为正，左端点可能更低。",
  ],
  (rng) => {
    const s = areaStory(rng);
    const answer = s.A1 > s.A2 ? s.x0 : s.x2;
    const dip = s.A1 - s.A2;
    return ask(
      [
        `${s.prose[0]} At which $x$ does $f$ attain its absolute minimum on $[${s.x0}, ${s.x3}]$?`,
        `${s.prose[1]}$f$ 在 $[${s.x0}, ${s.x3}]$ 上的绝对最小值在哪个 $x$ 处取到？`,
      ],
      answer,
      [s.A1 > s.A2 ? s.x2 : s.x0, s.x1, s.x3],
      walkPair(
        [
          [
            "List the candidates",
            "列出候选点",
            `$f'$ changes from negative to positive only at $x = ${s.x2}$, so the candidates are $x = ${s.x2}$ and the endpoints $x = ${s.x0}$ and $x = ${s.x3}$. The right endpoint is above the dip, since $f$ gains $${s.A3}$ after it.`,
            `$f'$ 只在 $x = ${s.x2}$ 处由负变正，所以候选点为 $x = ${s.x2}$ 以及端点 $x = ${s.x0}$、$x = ${s.x3}$。右端点高于低谷，因为过了低谷 $f$ 又增加了 $${s.A3}$。`,
          ],
          [
            "Compare the dip with the start",
            "比较低谷和起点",
            `Relative to $f(${s.x0})$, the dip is at $f(${s.x2}) - f(${s.x0}) = ${s.A1} - ${s.A2} = ${dip}$. ${dip > 0 ? `That is positive, so the start at $x = ${s.x0}$ is lowest.` : `That is negative, so $x = ${s.x2}$ is lower than the start.`}`,
            `相对于 $f(${s.x0})$，低谷处 $f(${s.x2}) - f(${s.x0}) = ${s.A1} - ${s.A2} = ${dip}$。${dip > 0 ? `它是正的，所以起点 $x = ${s.x0}$ 最低。` : `它是负的，所以 $x = ${s.x2}$ 比起点更低。`}`,
          ],
        ],
        [
          `Measure every point from $x = ${answer}$ instead. ${
            dip > 0
              ? `From the start, $f$ is $${s.A1}$ higher at $x = ${s.x1}$, $${dip}$ higher at $x = ${s.x2}$ and $${dip + s.A3}$ higher at $x = ${s.x3}$: all above.`
              : `From the dip, $f$ is $${-dip}$ higher at $x = ${s.x0}$, $${s.A2}$ higher at $x = ${s.x1}$ and $${s.A3}$ higher at $x = ${s.x3}$: all above.`
          }`,
          `换一种方法，从 $x = ${answer}$ 出发衡量每个点。${
            dip > 0
              ? `从起点看，$f$ 在 $x = ${s.x1}$ 处高 $${s.A1}$，在 $x = ${s.x2}$ 处高 $${dip}$，在 $x = ${s.x3}$ 处高 $${dip + s.A3}$：都更高。`
              : `从低谷看，$f$ 在 $x = ${s.x0}$ 处高 $${-dip}$，在 $x = ${s.x1}$ 处高 $${s.A2}$，在 $x = ${s.x3}$ 处高 $${s.A3}$：都更高。`
          }`,
        ],
      ),
    );
  },
);

const criticalOutsideInterval = point(
  "a-critical-point-outside-the-interval",
  ["A critical point outside the interval", "区间外的临界点"],
  [
    "Solving $f'(x) = 0$ is not the whole search: the critical point may lie outside the interval, and on a closed interval the endpoints are always candidates. If $f'$ has one sign throughout, the maximum is at an endpoint.\n\nFor $f'(x) = -(x - 5)$ on $[0, 3]$, the critical point $x = 5$ is outside the interval. On $[0, 3]$, $f'$ is positive, so $f$ is increasing and its maximum is at $x = 3$.\n\nCheck: one function with this derivative is $f(x) = -\\frac{(x - 5)^{2}}{2}$. It gives $f(0) = -\\frac{25}{2}$ and $f(3) = -2$, and $-2$ is the larger.\n\n> **Watch out.** $x = 5$ cannot be the answer, though $f'(5) = 0$: it is not in the interval.",
    "解 $f'(x) = 0$ 并不是全部工作：临界点可能在区间之外，而闭区间的端点总是候选点。如果 $f'$ 在整个区间上符号不变，最大值就在端点处。\n\n对 $[0, 3]$ 上的 $f'(x) = -(x - 5)$，临界点 $x = 5$ 在区间之外。在 $[0, 3]$ 上 $f'$ 为正，所以 $f$ 递增，最大值在 $x = 3$ 处。\n\n检验：导数为它的一个函数是 $f(x) = -\\frac{(x - 5)^{2}}{2}$。它给出 $f(0) = -\\frac{25}{2}$，$f(3) = -2$，而 $-2$ 较大。\n\n> **注意。** 虽然 $f'(5) = 0$，但 $x = 5$ 不可能是答案：它不在区间内。",
  ],
  (rng) => {
    const a = rng.int(-6, 2);
    const b = a + rng.int(3, 8);
    let r = rng.int(a - 4, b + 4);
    if (2 * r === a + b) r += 1;
    const k = nz(rng, 4);
    const down = k < 0;
    const answer = down ? Math.min(b, Math.max(a, r)) : Math.abs(r - a) > Math.abs(b - r) ? a : b;
    const d = poly([k, r === 0 ? "x" : `(${minus(r)})`]);
    const inside = r > a && r < b;
    const where: Pair = inside
      ? [`$x = ${r}$, inside $[${a}, ${b}]$`, `$x = ${r}$，在 $[${a}, ${b}]$ 内`]
      : [`$x = ${r}$, outside $[${a}, ${b}]$`, `$x = ${r}$，在 $[${a}, ${b}]$ 外`];
    const why: Pair = down
      ? inside
        ? [
            `$f'$ changes from positive to negative at $x = ${r}$, so $f$ rises to it and falls after it, and the maximum is there`,
            `$f'$ 在 $x = ${r}$ 处由正变负，所以 $f$ 先升到这里再下降，最大值就在这里`,
          ]
        : [
            `$f'$ has one sign on the interval, so $f$ is monotonic and the maximum is at the endpoint nearer to $${r}$`,
            `$f'$ 在区间上符号不变，所以 $f$ 单调，最大值在离 $${r}$ 较近的端点处`,
          ]
      : [
          `$f'$ goes from negative to positive at $x = ${r}$, so $f$ is a parabola opening upward with its lowest point there, and the maximum is at the endpoint farther from $${r}$`,
          `$f'$ 在 $x = ${r}$ 处由负变正，所以 $f$ 是开口向上、最低点在那里的抛物线，最大值在离 $${r}$ 较远的端点处`,
        ];
    const half = Q.of(k, 2);
    const F = (x: number) => half.mul(Q.of((x - r) ** 2));
    const coef = half.eq(Q.of(1)) ? "" : half.eq(Q.of(-1)) ? "-" : half.toLatex();
    const values = [a, ...(inside ? [r] : []), b].map((x) => `f(${x}) = ${F(x).toLatex()}`);
    const shown = `\n\n${values.map((v) => `$$${v}$$`).join("\n\n")}\n\n`;
    return ask(
      [
        `$f'(x) = ${d}$. At which $x$ does $f$ attain its greatest value on $[${a}, ${b}]$?`,
        `$f'(x) = ${d}$。$f$ 在 $[${a}, ${b}]$ 上的最大值在哪个 $x$ 处取到？`,
      ],
      answer,
      [r, a, b],
      walkPair(
        [
          ["Find the critical point", "求临界点", `$f'(x) = 0$ at ${where[0]}.`, `$f'(x) = 0$ 的解为 ${where[1]}。`],
          ["Read the sign of f′", "看 f′ 的符号", `Here ${why[0]}, which gives $x = ${answer}$.`, `这里${why[1]}，所以 $x = ${answer}$。`],
        ],
        [
          `Take one function with this derivative, $f(x) = ${coef}${power(r, 2)}$; adding a constant would not change the comparison. Then${shown}The greatest of these is at $x = ${answer}$.`,
          `取导数为它的一个函数 $f(x) = ${coef}${power(r, 2)}$；加上常数不影响比较。于是${shown}其中最大的在 $x = ${answer}$ 处。`,
        ],
      ),
    );
  },
);

/** toQv reads the value of a mistake as an exact number. */
const toQv = (v: ReturnType<typeof why>["value"]) => (v instanceof Q ? v : Q.of(Number(v)));
/** distinctWhys keeps the first mistake for each value, so that one wrong answer gets one reason. */
const distinctWhys = (ms: readonly ReturnType<typeof why>[]) =>
  ms.filter((m, i) => ms.findIndex((n) => toQv(n.value).eq(toQv(m.value))) === i);

const unknownFromLimit = point(
  "an-unknown-derivative-from-the-limit",
  ["An unknown derivative from the limit", "由极限求未知的导数"],
  [
    "L'Hopital's rule also runs backwards. When $f(a) = g(a) = 0$ and the derivatives are continuous with $g'(a) \\ne 0$, the limit of $\\frac{f}{g}$ is $\\frac{f'(a)}{g'(a)}$, so knowing the limit and one derivative gives the other.\n\nFor example, if $f(1) = g(1) = 0$, $g'(1) = 4$ and $\\lim_{x \\to 1} \\frac{f(x)}{g(x)} = \\frac{3}{2}$, then $\\frac{f'(1)}{4} = \\frac{3}{2}$, so $f'(1) = 6$.\n\nCheck: near $x = 1$, $f(x) \\approx 6(x - 1)$ and $g(x) \\approx 4(x - 1)$, so the ratio is close to $\\frac{6}{4} = \\frac{3}{2}$, the given limit.\n\n> **Watch out.** Both functions must vanish at $a$ first. If the form is not $\\frac{0}{0}$, the limit is simply $\\frac{f(a)}{g(a)}$ and tells you nothing about the derivatives.",
    "洛必达法则也可以反过来用。当 $f(a) = g(a) = 0$，导数连续且 $g'(a) \\ne 0$ 时，$\\frac{f}{g}$ 的极限是 $\\frac{f'(a)}{g'(a)}$，所以知道极限和其中一个导数，就能求出另一个。\n\n例如，若 $f(1) = g(1) = 0$，$g'(1) = 4$，且 $\\lim_{x \\to 1} \\frac{f(x)}{g(x)} = \\frac{3}{2}$，则 $\\frac{f'(1)}{4} = \\frac{3}{2}$，所以 $f'(1) = 6$。\n\n检验：在 $x = 1$ 附近，$f(x) \\approx 6(x - 1)$，$g(x) \\approx 4(x - 1)$，所以比值接近 $\\frac{6}{4} = \\frac{3}{2}$，正是给定的极限。\n\n> **注意。** 前提是两个函数在 $a$ 处都为零。如果不是 $\\frac{0}{0}$ 型，极限就是 $\\frac{f(a)}{g(a)}$，对导数什么也说明不了。",
  ],
  (rng) => {
    const a = rng.int(-6, 6);
    const fp = nz(rng, 12);
    const gp = nz(rng, 9);
    const L = Q.of(fp, gp);
    const findTop = rng.bool();
    const answer = findTop ? fp : gp;
    const table = `| $x$ | $f(x)$ | $g(x)$ | $f'(x)$ | $g'(x)$ |\n| :---: | :---: | :---: | :---: | :---: |\n| $${a}$ | $0$ | $0$ | $${findTop ? "p" : fp}$ | $${findTop ? gp : "p"}$ |`;
    const limit = `\\lim_{x \\to ${a}} \\frac{f(x)}{g(x)} = ${L.toLatex()}`;
    const ratio = findTop ? `\\frac{p}{${gp}}` : `\\frac{${fp}}{p}`;
    const near = (c: number) => `${c}${a === 0 ? "x" : `(${minus(a)})`}`;
    const raw = `\\frac{${fp}}{${gp}}`;
    const quotient = raw === L.toLatex() ? raw : `${raw} = ${L.toLatex()}`;
    const solve: Pair = findTop
      ? [
          `Multiply both sides by $${gp}$: $p = ${L.toLatex()} \\cdot ${paren(gp)} = ${answer}$.`,
          `两边乘以 $${gp}$：$p = ${L.toLatex()} \\cdot ${paren(gp)} = ${answer}$。`,
        ]
      : [`Cross-multiply: $p = ${fp} \\div ${paren(L)} = ${answer}$.`, `交叉相乘：$p = ${fp} \\div ${paren(L)} = ${answer}$。`];
    const mistakes = findTop
      ? [
          why(
            Q.of(gp).div(L),
            `This solves $\\frac{${gp}}{p} = ${L.toLatex()}$: the ratio is upside down. The limit is $\\frac{f'}{g'}$, top over bottom.`,
            `这是在解 $\\frac{${gp}}{p} = ${L.toLatex()}$：比值上下颠倒了。极限是 $\\frac{f'}{g'}$，分子的导数比分母的导数。`,
          ),
          why(
            L.div(Q.of(gp)),
            `This divides the limit by $g'(${a}) = ${gp}$; to undo the division by $${gp}$, multiply.`,
            `这是用极限除以 $g'(${a}) = ${gp}$；要抵消除以 $${gp}$，应该乘。`,
          ),
          why(
            L,
            "This is the limit itself. The limit is the ratio of the derivatives, not $f'(a)$.",
            "这是极限本身。极限是两个导数的比，不是 $f'(a)$。",
          ),
        ]
      : [
          why(
            L.mul(Q.of(fp)),
            `This solves $\\frac{p}{${fp}} = ${L.toLatex()}$: the ratio is upside down. $g'$ is in the denominator.`,
            `这是在解 $\\frac{p}{${fp}} = ${L.toLatex()}$：比值上下颠倒了。$g'$ 在分母上。`,
          ),
          why(
            fp,
            `This is $f'(${a})$; $p$ is $g'(${a})$, which differs unless the limit is $1$.`,
            `这是 $f'(${a})$；$p$ 是 $g'(${a})$，除非极限是 $1$，两者不同。`,
          ),
          why(
            L,
            "This is the limit itself. The limit is the ratio of the derivatives, not $g'(a)$.",
            "这是极限本身。极限是两个导数的比，不是 $g'(a)$。",
          ),
        ];
    return numberProblem({
      prompt: t(
        `$f$ and $g$ have continuous derivatives, with these values, and $${limit}$. Find $p$.\n\n${table}`,
        `$f$ 和 $g$ 的导数连续，取值如下，且 $${limit}$。求 $p$。\n\n${table}`,
      ),
      answer,
      mistakes: distinctWhys(mistakes),
      solution: t(
        ...walkPair(
          [
            [
              "Check the form",
              "检查类型",
              `$f(${a}) = g(${a}) = 0$, so the limit has the form $\\frac{0}{0}$, and with $g'(${a}) \\ne 0$ it equals $\\frac{f'(${a})}{g'(${a})}$.`,
              `$f(${a}) = g(${a}) = 0$，所以极限是 $\\frac{0}{0}$ 型，又 $g'(${a}) \\ne 0$，它等于 $\\frac{f'(${a})}{g'(${a})}$。`,
            ],
            ["Set up the equation", "列方程", `$${ratio} = ${L.toLatex()}$.`, `$${ratio} = ${L.toLatex()}$。`],
            ["Solve for $p$", "解出 $p$", solve[0], solve[1]],
          ],
          [
            `Near $x = ${a}$, $f(x) \\approx ${near(fp)}$ and $g(x) \\approx ${near(gp)}$, so $\\frac{f(x)}{g(x)} \\approx ${quotient}$, the given limit.`,
            `在 $x = ${a}$ 附近，$f(x) \\approx ${near(fp)}$，$g(x) \\approx ${near(gp)}$，所以 $\\frac{f(x)}{g(x)} \\approx ${quotient}$，正是给定的极限。`,
          ],
        ),
      ),
    });
  },
);

/** deeperCalculusIThird2Points maps topics of Calculus I, from extrema to integrals, to a third knowledge point. */
export const deeperCalculusIThird2Points: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "lhopitals-rule-applied-to-tables": [unknownFromLimit],
  "global-vs-local-extrema-and-critical-points": [criticalNotExtreme],
  "the-extreme-value-theorem": [openEndpoints],
  "intervals-of-concavity": [coefficientFromInflection],
  "sketching-the-derivative-of-a-function-from-the-functions-graph": [cornerOfSegments],
  "interpreting-the-graph-of-a-functions-derivative": [peakOfDerivative],
  "interpreting-the-graph-of-a-functions-derivative-concavity-and-points-of-inflection": [shapeFromDerivativeValues],
  "sketching-a-function-from-the-graph-of-its-derivative": [areaUnderSlopedDerivative],
  "sketching-a-function-given-some-derivative-properties": [secondTestSilent],
  "approximating-trigonometric-functions-using-local-linearity": [overOrUnderTrig],
  "optimization-problems-involving-sectors-of-circles": [leastPerimeterSector],
  "optimization-problems-involving-boxes-and-trays": [trayFromRectangle],
  "optimizing-distances-to-curves": [leastDistanceSquared],
  "newtons-method-for-optimizing-single-variable-functions": [newtonOnQuadratic],
  "calculating-acceleration-for-straight-line-motion-using-differentiation": [speedingUp],
  "the-constant-multiple-rule-for-indefinite-integrals": [coefficientFromAntiderivative],
  "the-sum-rule-for-indefinite-integrals": [noProductRule],
  "integrating-hyperbolic-functions": [hyperbolicIdentityIntegral],
  "integration-using-inverse-hyperbolic-functions": [arsinhScaled],
  "integration-using-inverse-reciprocal-hyperbolic-functions": [artanhOrArcoth],
  "approximating-areas-with-the-left-riemann-sum": [rightFromLeft],
  "approximating-areas-with-the-midpoint-riemann-sum": [midpointOfLine],
  "approximating-areas-with-the-trapezoidal-rule": [trapezoidFromLeft],
  "left-and-right-riemann-sums-in-sigma-notation": [intervalOffSum],
  "midpoint-and-trapezoidal-rules-in-sigma-notation": [samplePoint],
  "approximating-areas-under-graphs-of-composite-functions": [orderingEstimates],
  "applying-the-fundamental-theorem-of-calculus-to-exponential-and-trigonometric-functions": [wholeNumberIntegrals],
  "the-sum-and-constant-multiple-rules-for-definite-integrals": [unknownFromCombination],
  "finding-the-area-between-a-curve-and-the-x-axis-when-they-intersect": [whereSignedCancels],
  "calculating-the-definite-integral-of-a-function-given-its-graph": [symmetryIntegrals],
  "calculating-the-definite-integral-of-a-functions-derivative-given-its-graph": [valueFromNetChange],
  "maximizing-a-function-using-the-graph-of-its-derivative": [maximumFromAreas],
  "minimizing-a-function-using-the-graph-of-its-derivative": [minimumFromAreas],
  "further-optimizing-functions-using-graphs-of-derivatives": [criticalOutsideInterval],
};
