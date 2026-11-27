// The rest of a first course in Real Analysis: order and absolute value, nested intervals, limit points, the
// Cantor set, connectedness, monotone functions, bounded variation, the Stieltjes integral, tests for series,
// uniform limits, approximation, equicontinuity, metric compactness, and a first look at measure.

import { type TopicDef, t } from "@ga/content";
import { Q } from "@ga/subject-math";
import { analysisDrawings1 } from "../explanation-drawings-real-analysis-1.ts";
import { why } from "../problems.ts";
import { choose, point, same, topic } from "../university-kit.ts";
import { reasoned } from "../wrong-reasons.ts";
import { asPair, reason, solution, solved } from "./real-analysis.ts";

/** interval writes a closed interval in LaTeX. */
const interval = (a: number, b: number) => `[${a}, ${b}]`;

/** binomial returns n choose k for small numbers. */
const binomial = (n: number, k: number): number => (k === 0 ? 1 : (binomial(n, k - 1) * (n - k + 1)) / k);

/** plus writes a constant term after another term, with its sign, and nothing for zero. */
const plus = (v: number) => (v === 0 ? "" : v > 0 ? ` + ${v}` : ` - ${-v}`);

/** minus writes "a - b" for a number b, with parentheses only around a negative b. */
const minus = (a: number | string, b: number) => (b < 0 ? `${a} - (${b})` : `${a} - ${b}`);

const orderedField = {
  ...topic(
    "the-real-numbers-as-an-ordered-field",
    ["The Real Numbers as an Ordered Field", "作为有序域的实数"],
    ["Use the order rules and absolute values that every proof in analysis relies on.", "使用分析证明都要依靠的序规则和绝对值。"],
    ["supremum-and-infimum"],
    [],
    [
      point(
        "multiplying-an-inequality-by-a-negative",
        ["Multiplying an inequality by a negative", "不等式乘负数"],
        [
          "An ordered field allows multiplying an inequality by a positive number, while a negative multiplier reverses the direction. So the largest value of a decreasing expression comes from the smallest allowed input.\n\nIf $-2 \\le x \\le 5$, multiplying by $-3$ gives $-15 \\le -3x \\le 6$, so $1 - 3x$ lies between $-14$ and $7$, and its largest value is $7$, at $x = -2$.\n\nCheck: at $x = 0$ the expression is $1$ and at $x = 5$ it is $-14$, both smaller than $7$.\n\n> **Watch out.** After multiplying by a negative number, the old upper bound becomes the new lower bound. Swap the ends, not just the signs.",
          "有序域允许不等式乘正数，而乘负数时方向相反。所以递减式子的最大值来自允许的最小输入。\n\n若 $-2 \\le x \\le 5$，乘以 $-3$ 得 $-15 \\le -3x \\le 6$，所以 $1 - 3x$ 在 $-14$ 和 $7$ 之间，最大值是 $7$，在 $x = -2$ 处取到。\n\n检验：在 $x = 0$ 处式子等于 $1$，在 $x = 5$ 处等于 $-14$，都小于 $7$。\n\n> **注意。** 乘负数之后，原来的上界变成新的下界。要交换两端，而不只是改符号。",
        ],
        (rng) => {
          const a = rng.int(1, 20);
          const b = rng.int(1, 20);
          const m = rng.int(2, 9);
          const c = rng.int(-20, 20);
          const answer = c + m * a;
          return solved(
            [
              `If $-${a} \\le x \\le ${b}$, what is the largest possible value of $${c} - ${m}x$?`,
              `若 $-${a} \\le x \\le ${b}$，$${c} - ${m}x$ 的最大可能值是多少？`,
            ],
            answer,
            [
              why(c - m * b, `That is the smallest value, from $x = ${b}$.`, `这是最小值，来自 $x = ${b}$。`),
              why(
                c + m * b,
                `That uses $${b}$ with the wrong sign; the largest value comes from $x = -${a}$.`,
                `这把 $${b}$ 的符号用错了；最大值来自 $x = -${a}$。`,
              ),
              why(
                c - m * a,
                `That drops the minus sign of $x = -${a}$; $-${m} \\times (-${a}) = ${m * a}$.`,
                `这丢掉了 $x = -${a}$ 的负号；$-${m} \\times (-${a}) = ${m * a}$。`,
              ),
            ],
            solution(
              [
                [
                  ["Multiply by the negative", "乘以负数"],
                  [
                    `Multiplying $-${a} \\le x \\le ${b}$ by $-${m}$ reverses it: $-${m * b} \\le -${m}x \\le ${m * a}$.`,
                    `把 $-${a} \\le x \\le ${b}$ 乘以 $-${m}$，不等号反向：$-${m * b} \\le -${m}x \\le ${m * a}$。`,
                  ],
                ],
                [
                  ["Add the constant", "加上常数"],
                  [
                    `Adding $${c}$ gives $${c - m * b} \\le ${c} - ${m}x \\le ${answer}$, so the largest value is $${answer}$.`,
                    `加上 $${c}$ 得 $${c - m * b} \\le ${c} - ${m}x \\le ${answer}$，所以最大值是 $${answer}$。`,
                  ],
                ],
              ],
              [
                `At $x = -${a}$ the expression is $${c} + ${m * a} = ${answer}$, and at $x = ${b}$ it is only $${c - m * b}$.`,
                `在 $x = -${a}$ 处式子等于 $${c} + ${m * a} = ${answer}$，而在 $x = ${b}$ 处只有 $${c - m * b}$。`,
              ],
            ),
          );
        },
      ),
      {
        ...point(
          "the-reverse-triangle-inequality",
          ["The reverse triangle inequality", "反向三角不等式"],
          [
            "The triangle inequality also gives a lower bound: $|x| \\ge |a| - |x - a|$. Analysis uses this to keep a quantity away from zero.\n\nIf $|x - 7| < 3$, then $|x| \\ge 7 - |x - 7| > 7 - 3 = 4$. Indeed $x$ lies in $(4, 10)$, so $|x| > 4$.\n\nCheck: $x = 4.01$ satisfies $|x - 7| < 3$ and has $|x| = 4.01$, so no bound larger than $4$ is sure.\n\n> **Watch out.** Use $|a|$, not $a$. If $|x - (-7)| < 3$, then $x$ lies in $(-10, -4)$, and the bound is again $7 - 3 = 4$.",
            "三角不等式也给出下界：$|x| \\ge |a| - |x - a|$。分析中用它使某个量远离零。\n\n若 $|x - 7| < 3$，则 $|x| \\ge 7 - |x - 7| > 7 - 3 = 4$。确实 $x$ 在 $(4, 10)$ 中，所以 $|x| > 4$。\n\n检验：$x = 4.01$ 满足 $|x - 7| < 3$，且 $|x| = 4.01$，所以比 $4$ 大的界都不一定成立。\n\n> **注意。** 要用 $|a|$，不是 $a$。若 $|x - (-7)| < 3$，则 $x$ 在 $(-10, -4)$ 中，界仍是 $7 - 3 = 4$。",
          ],
          (rng) => {
            const d = rng.int(1, 12);
            const a = (d + rng.int(1, 25)) * (rng.bool() ? 1 : -1);
            const answer = Math.abs(a) - d;
            return solved(
              [
                `If $|x - (${a})| < ${d}$, what is the greatest number that is sure to be a lower bound of $|x|$?`,
                `若 $|x - (${a})| < ${d}$，一定是 $|x|$ 的下界的最大数是多少？`,
              ],
              answer,
              [
                why(
                  Math.abs(a) + d,
                  "That is an upper bound of $|x|$, from the far end of the interval.",
                  "这是 $|x|$ 的上界，来自区间较远的一端。",
                ),
                why(d, "That is the radius of the interval, not a bound for $|x|$.", "这是区间的半径，不是 $|x|$ 的界。"),
                why(
                  Math.abs(a),
                  `That is $|x|$ at the center; $x$ may be up to $${d}$ closer to $0$.`,
                  `这是中心处的 $|x|$；$x$ 可以比它离 $0$ 近至多 $${d}$。`,
                ),
              ],
              solution(
                [
                  [
                    ["Apply the reverse triangle inequality", "应用反向三角不等式"],
                    [
                      `$|x| \\ge |${a}| - |x - (${a})| > ${Math.abs(a)} - ${d} = ${answer}$.`,
                      `$|x| \\ge |${a}| - |x - (${a})| > ${Math.abs(a)} - ${d} = ${answer}$。`,
                    ],
                  ],
                  [
                    ["Check that it is the greatest", "检查它是最大的"],
                    [
                      `$x$ ranges over $(${a - d}, ${a + d})$, and the end nearer to $0$ has absolute value $${answer}$, so $x$ can come as close to it as we like.`,
                      `$x$ 取遍 $(${a - d}, ${a + d})$，离 $0$ 较近的端点的绝对值是 $${answer}$，所以 $x$ 可以任意接近它。`,
                    ],
                  ],
                ],
                [
                  `The ends of $(${a - d}, ${a + d})$ have absolute values $${Math.abs(a - d)}$ and $${Math.abs(a + d)}$, and the smaller one is $${answer}$.`,
                  `$(${a - d}, ${a + d})$ 两端的绝对值是 $${Math.abs(a - d)}$ 和 $${Math.abs(a + d)}$，较小的是 $${answer}$。`,
                ],
              ),
            );
          },
        ),
        figure: analysisDrawings1["the-real-numbers-as-an-ordered-field#the-reverse-triangle-inequality"],
      },
      point(
        "a-bound-for-a-reciprocal",
        ["A bound for a reciprocal", "倒数的界"],
        [
          "Proofs about limits of quotients need the denominator to stay away from zero. Once a lower bound for the size of $x$ is known, flipping it gives an upper bound for the reciprocal.\n\nIf $|x - 5| < 2$, then $x$ lies in $(3, 7)$, so $|x| > 3$ and $\\frac{1}{|x|} < \\frac{1}{3}$.\n\nCheck: at $x = 3.01$, $\\frac{1}{|x|} = \\frac{1}{3.01}$ is just below $\\frac{1}{3}$, so no smaller bound is sure.\n\n> **Watch out.** The smallest $|x|$ gives the largest reciprocal. Use the near end $a - d$, not the far end $a + d$.",
          "关于商的极限的证明需要分母远离零。一旦知道 $x$ 绝对值的下界，取倒数就得到倒数的上界。\n\n若 $|x - 5| < 2$，则 $x$ 在 $(3, 7)$ 中，所以 $|x| > 3$，$\\frac{1}{|x|} < \\frac{1}{3}$。\n\n检验：在 $x = 3.01$ 处，$\\frac{1}{|x|} = \\frac{1}{3.01}$ 略小于 $\\frac{1}{3}$，所以更小的界都不一定成立。\n\n> **注意。** 最小的 $|x|$ 给出最大的倒数。要用近端 $a - d$，而不是远端 $a + d$。",
        ],
        (rng) => {
          const d = rng.int(1, 12);
          const a = d + rng.int(1, 25);
          const answer = Q.of(1, a - d);
          return solved(
            [
              `If $|x - ${a}| < ${d}$, what is the smallest number that is sure to be an upper bound of $\\frac{1}{|x|}$?`,
              `若 $|x - ${a}| < ${d}$，一定是 $\\frac{1}{|x|}$ 的上界的最小数是多少？`,
            ],
            answer,
            [
              why(
                Q.of(1, a + d),
                `That comes from the far end $${a + d}$; near $${a - d}$ the reciprocal is larger.`,
                `这来自远端 $${a + d}$；在 $${a - d}$ 附近倒数更大。`,
              ),
              why(
                Q.of(1, a),
                `That is the reciprocal at the center, which values nearer $${a - d}$ exceed.`,
                `这是中心处的倒数，靠近 $${a - d}$ 的值会超过它。`,
              ),
              why(Q.of(1, d), "That uses the radius in place of a bound for $|x|$.", "这把半径当成了 $|x|$ 的界。"),
            ],
            solution(
              [
                [
                  ["Bound the size from below", "从下方界住大小"],
                  [
                    `$|x - ${a}| < ${d}$ puts $x$ in $(${a - d}, ${a + d})$, so $|x| > ${a - d}$.`,
                    `$|x - ${a}| < ${d}$ 使 $x$ 在 $(${a - d}, ${a + d})$ 中，所以 $|x| > ${a - d}$。`,
                  ],
                ],
                [
                  ["Take reciprocals", "取倒数"],
                  [
                    `Taking reciprocals of positive numbers reverses the order, so $\\frac{1}{|x|} < ${answer.toLatex()}$.`,
                    `正数取倒数时不等号反向，所以 $\\frac{1}{|x|} < ${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `As $x$ approaches $${a - d}$ from above, $\\frac{1}{|x|}$ approaches $${answer.toLatex()}$, so no smaller number bounds it.`,
                `当 $x$ 从上方趋近 $${a - d}$ 时，$\\frac{1}{|x|}$ 趋近 $${answer.toLatex()}$，所以更小的数都界不住它。`,
              ],
            ),
          );
        },
      ),
    ],
  ),
  intro: t(
    "Suppose $1 \\le x \\le 4$. Multiplying by $-2$ reverses the order, $-8 \\le -2x \\le -2$, so $5 - 2x$ lies between $-3$ and $3$, and its largest value is $3$, at $x = 1$.\n\nCheck: at $x = 4$ the expression is $5 - 8 = -3$, the smallest value.\n\nIn this lesson we multiply inequalities by negative numbers, keep $|x|$ away from zero with the reverse triangle inequality, and turn that into a bound for $\\frac{1}{|x|}$.",
    "设 $1 \\le x \\le 4$。乘以 $-2$ 使不等号反向，$-8 \\le -2x \\le -2$，所以 $5 - 2x$ 在 $-3$ 和 $3$ 之间，最大值是 $3$，在 $x = 1$ 处取到。\n\n检验：在 $x = 4$ 处式子等于 $5 - 8 = -3$，是最小值。\n\n本课我们把不等式乘以负数，用反向三角不等式使 $|x|$ 远离零，并由此得到 $\\frac{1}{|x|}$ 的界。",
  ),
};

const nestedIntervals = {
  ...topic(
    "the-nested-interval-property",
    ["The Nested Interval Property", "闭区间套性质"],
    ["Trap a real number inside shrinking closed intervals.", "用不断缩小的闭区间夹住一个实数。"],
    ["the-monotone-convergence-theorem"],
    [],
    [
      point(
        "the-intersection-of-closed-intervals",
        ["The intersection of closed intervals", "闭区间的交"],
        [
          "Nested closed bounded intervals always have a common point, and the intersection is the interval from the supremum of the left ends to the infimum of the right ends. Its length is the limit of the lengths.\n\nFor $I_n = \\left[1 - \\frac{2}{n}, 4 + \\frac{2}{n}\\right]$, the left ends rise to $1$ and the right ends fall to $4$, so the intersection is $[1, 4]$, of length $3$.\n\nCheck: the lengths are $3 + \\frac{4}{n}$, which tend to $3$.\n\n> **Watch out.** The length of the intersection is the limit of the lengths, not the length of $I_1$ or of any single $I_n$.",
          "闭有界区间套总有公共点，它们的交是从左端点的上确界到右端点的下确界的区间。交的长度是长度的极限。\n\n对 $I_n = \\left[1 - \\frac{2}{n}, 4 + \\frac{2}{n}\\right]$，左端点上升到 $1$，右端点下降到 $4$，所以交是 $[1, 4]$，长度为 $3$。\n\n检验：长度是 $3 + \\frac{4}{n}$，趋于 $3$。\n\n> **注意。** 交的长度是长度的极限，不是 $I_1$ 或任何单个 $I_n$ 的长度。",
        ],
        (rng) => {
          const p = rng.int(-20, 20);
          const q = p + rng.int(1, 25);
          const k = rng.int(1, 9);
          return solved(
            [
              `For $n \\ge 1$, let $I_n = \\left[${p === 0 ? "" : `${p} `}- \\frac{${k}}{n}, ${q === 0 ? "" : `${q} + `}\\frac{${k}}{n}\\right]$. What is the length of $\\bigcap_{n \\ge 1} I_n$?`,
              `对 $n \\ge 1$，设 $I_n = \\left[${p === 0 ? "" : `${p} `}- \\frac{${k}}{n}, ${q === 0 ? "" : `${q} + `}\\frac{${k}}{n}\\right]$。$\\bigcap_{n \\ge 1} I_n$ 的长度是多少？`,
            ],
            q - p,
            [
              why(q - p + 2 * k, "That is the length of $I_1$; the intervals keep shrinking.", "这是 $I_1$ 的长度；区间还在不断缩小。"),
              why(
                q - p + k,
                `That keeps $\\frac{${k}}{n}$ at one end; both ends move in as $n$ grows.`,
                `这在一端保留了 $\\frac{${k}}{n}$；随着 $n$ 增大，两端都向内移动。`,
              ),
              why(q, `That is the right end of the intersection, not its length.`, `这是交的右端点，不是它的长度。`),
            ],
            solution(
              [
                [
                  ["Find the limits of the ends", "求端点的极限"],
                  [
                    `The left ends rise to $${p}$ and the right ends fall to $${q}$, because $\\frac{${k}}{n} \\to 0$.`,
                    `因为 $\\frac{${k}}{n} \\to 0$，左端点上升到 $${p}$，右端点下降到 $${q}$。`,
                  ],
                ],
                [
                  ["Intersect", "求交"],
                  [
                    `So $\\bigcap_{n \\ge 1} I_n = ${interval(p, q)}$, of length $${q - p}$.`,
                    `所以 $\\bigcap_{n \\ge 1} I_n = ${interval(p, q)}$，长度为 $${q - p}$。`,
                  ],
                ],
              ],
              [
                `The length of $I_n$ is $${q - p} + \\frac{${2 * k}}{n}$, which tends to $${q - p}$.`,
                `$I_n$ 的长度是 $${q - p} + \\frac{${2 * k}}{n}$，趋于 $${q - p}$。`,
              ],
            ),
          );
        },
      ),
      point(
        "bisecting-until-the-interval-is-small",
        ["Bisecting until the interval is small", "二分直到区间足够小"],
        [
          "Each bisection halves the length, so after $n$ steps an interval of length $L$ has length $L$ over $2^{n}$. Comparing this with the target shows how many steps a nested interval proof needs.\n\nFor length $3$ and the target $\\frac{1}{10}$, we need $\\frac{3}{2^{n}} < \\frac{1}{10}$, that is $2^{n} > 30$. The first such power is $2^{5} = 32$, so $5$ bisections are needed.\n\nCheck: after $4$ steps the length is $\\frac{3}{16} > \\frac{1}{10}$, and after $5$ it is $\\frac{3}{32} < \\frac{1}{10}$.\n\n> **Watch out.** The length must be strictly below the target. If $L$ times the denominator is a power of $2$, that power is not enough, and one more step is needed.",
          "每次二分使长度减半，所以 $n$ 步后长度为 $L$ 的区间长度变成 $L$ 除以 $2^{n}$。把它与目标比较，就知道区间套证明需要多少步。\n\n对长度 $3$ 和目标 $\\frac{1}{10}$，需要 $\\frac{3}{2^{n}} < \\frac{1}{10}$，即 $2^{n} > 30$。第一个这样的幂是 $2^{5} = 32$，所以需要二分 $5$ 次。\n\n检验：$4$ 步后长度是 $\\frac{3}{16} > \\frac{1}{10}$，$5$ 步后是 $\\frac{3}{32} < \\frac{1}{10}$。\n\n> **注意。** 长度必须严格小于目标。如果 $L$ 乘分母恰好是 $2$ 的幂，这个幂还不够，需要再多一步。",
        ],
        (rng) => {
          const l = rng.int(1, 30);
          const m = rng.int(5, 200);
          let n = 0;
          for (let v = l; v * m >= 1 && n < 30; v /= 2) n++;
          return solved(
            [
              `An interval of length ${l} is bisected repeatedly. What is the fewest bisections after which the length is below $\\frac{1}{${m}}$?`,
              `长度为 ${l} 的区间反复二分。至少二分多少次后长度小于 $\\frac{1}{${m}}$？`,
            ],
            n,
            [
              why(
                n - 1,
                `That is one step short; the length is then $${Q.of(l, 2 ** (n - 1)).toLatex()}$, not below $\\frac{1}{${m}}$.`,
                `这少了一步；那时长度是 $${Q.of(l, 2 ** (n - 1)).toLatex()}$，并不小于 $\\frac{1}{${m}}$。`,
              ),
              why(n + 1, `That works, but $${n}$ steps already suffice.`, `这也满足，但 $${n}$ 步已经够了。`),
              why(l * m, `That is the number $2^{n}$ must exceed, not the number of steps.`, `这是 $2^{n}$ 必须超过的数，不是步数。`),
            ],
            solution(
              [
                [
                  ["Write the condition", "写出条件"],
                  [
                    `After $n$ steps the length is $\\frac{${l}}{2^{n}}$, and $\\frac{${l}}{2^{n}} < \\frac{1}{${m}}$ means $2^{n} > ${l * m}$.`,
                    `$n$ 步后长度是 $\\frac{${l}}{2^{n}}$，而 $\\frac{${l}}{2^{n}} < \\frac{1}{${m}}$ 就是 $2^{n} > ${l * m}$。`,
                  ],
                ],
                [
                  ["Find the power of two", "找出二的幂"],
                  [
                    `$${2 ** (n - 1)} \\le ${l * m} < ${2 ** n}$, so the fewest steps is $${n}$.`,
                    `$${2 ** (n - 1)} \\le ${l * m} < ${2 ** n}$，所以最少需要 $${n}$ 步。`,
                  ],
                ],
              ],
              [
                `After $${n - 1}$ steps the length is $${Q.of(l, 2 ** (n - 1)).toLatex()} \\ge \\frac{1}{${m}}$, and after $${n}$ it is $${Q.of(l, 2 ** n).toLatex()} < \\frac{1}{${m}}$.`,
                `$${n - 1}$ 步后长度是 $${Q.of(l, 2 ** (n - 1)).toLatex()} \\ge \\frac{1}{${m}}$，$${n}$ 步后是 $${Q.of(l, 2 ** n).toLatex()} < \\frac{1}{${m}}$。`,
              ],
            ),
          );
        },
      ),
      point(
        "why-the-intervals-must-be-closed",
        ["Why the intervals must be closed", "为什么区间必须是闭的"],
        [
          "The property needs closed and bounded intervals. Open intervals can shrink toward an end point that none of them contains, and unbounded closed intervals can run away to infinity, leaving nothing in common.\n\nThe open intervals $\\left(0, \\frac{1}{n}\\right)$ are nested, but any $x > 0$ drops out once $\\frac{1}{n} < x$, and $0$ is in none of them. So their intersection is empty.\n\nCheck: the closed intervals $\\left[0, \\frac{1}{n}\\right]$ all contain $0$, so their intersection is $\\{0\\}$.\n\n> **Watch out.** Shrinking toward a point is not enough. The point must belong to every interval, and an open end never does.",
          "这个性质需要闭且有界的区间。开区间可以缩向一个都不包含的端点，无界闭区间可以跑向无穷，都没有公共点。\n\n开区间 $\\left(0, \\frac{1}{n}\\right)$ 是套，但任何 $x > 0$ 在 $\\frac{1}{n} < x$ 时都被排除，而 $0$ 不在其中任何一个里。所以它们的交是空集。\n\n检验：闭区间 $\\left[0, \\frac{1}{n}\\right]$ 都包含 $0$，所以它们的交是 $\\{0\\}$。\n\n> **注意。** 缩向一个点还不够。这个点必须属于每个区间，而开的端点永远不属于。",
        ],
        (rng) => {
          const k = rng.int(1, 40);
          const a = rng.int(-30, 30);
          const open = `\\left(${a}, ${a} + \\frac{${k}}{n}\\right)`;
          const closed = `\\left[${a}, ${a} + \\frac{${k}}{n}\\right]`;
          const both = `\\left[${a} - \\frac{${k}}{n}, ${a} + \\frac{${k}}{n}\\right]`;
          const around = `\\left(${a} - \\frac{${k}}{n}, ${a} + \\frac{${k}}{n}\\right)`;
          const contains = (latex: string) =>
            reason(
              latex,
              `Every interval of this family contains $${a}$, so the intersection is $\\{${a}\\}$.`,
              `这一族的每个区间都包含 $${a}$，所以交是 $\\{${a}\\}$。`,
            );
          return reasoned(
            choose(
              rng,
              [
                `Each family below is nested, with $n \\ge 1$. Which family has an empty intersection?`,
                `下面每一族都是套，$n \\ge 1$。哪一族的交是空集？`,
              ],
              same(open),
              [same(closed), same(both), same(around)],
              asPair(
                solution(
                  [
                    [
                      ["Look for a common point", "寻找公共点"],
                      [
                        `The three families other than $${open}$ all contain $${a}$ in every interval.`,
                        `除 $${open}$ 以外的三族，每个区间都包含 $${a}$。`,
                      ],
                    ],
                    [
                      ["Test the open family", "检验开区间族"],
                      [
                        `In $${open}$, the point $${a}$ is never included, and any $x > ${a}$ drops out once $${a} + \\frac{${k}}{n} < x$. So nothing is common to all.`,
                        `在 $${open}$ 中，$${a}$ 从不被包含，而任何 $x > ${a}$ 在 $${a} + \\frac{${k}}{n} < x$ 时都被排除。所以没有公共点。`,
                      ],
                    ],
                  ],
                  [
                    `Points below $${a}$ lie in no interval of the open family either, so its intersection is empty, while the closed family $${closed}$ keeps $${a}$.`,
                    `小于 $${a}$ 的点也不在开区间族的任何区间里，所以它的交是空集，而闭区间族 $${closed}$ 保留了 $${a}$。`,
                  ],
                ),
              ),
            ),
            [contains(closed), contains(both), contains(around)],
          );
        },
      ),
    ],
  ),
  intro: t(
    "Take $I_n = \\left[-\\frac{1}{n}, 2 + \\frac{1}{n}\\right]$. Each interval lies inside the one before, the left ends rise to $0$ and the right ends fall to $2$, so the intervals trap exactly $[0, 2]$.\n\nCheck: the lengths $2 + \\frac{2}{n}$ tend to $2$, the length of $[0, 2]$.\n\nIn this lesson we find the intersection of nested closed intervals, count the bisections that make an interval short, and see why the intervals must be closed.",
    "取 $I_n = \\left[-\\frac{1}{n}, 2 + \\frac{1}{n}\\right]$。每个区间都在前一个之内，左端点上升到 $0$，右端点下降到 $2$，所以这些区间恰好夹住 $[0, 2]$。\n\n检验：长度 $2 + \\frac{2}{n}$ 趋于 $2$，正是 $[0, 2]$ 的长度。\n\n本课我们求闭区间套的交，数出使区间变短所需的二分次数，并看清为什么区间必须是闭的。",
  ),
};

const limitPoints = {
  ...topic(
    "limit-points-and-closures",
    ["Limit Points and Closures", "极限点与闭包"],
    ["Find the limit points, isolated points and boundary of a set of reals.", "求实数集的极限点、孤立点和边界。"],
    ["open-and-closed-sets-of-reals"],
    [],
    [
      point(
        "counting-limit-points",
        ["Counting limit points", "数极限点"],
        [
          "A limit point of a set is a point that every small interval around it meets in another point of the set. A sequence converging to a value makes that value a limit point, even if it is outside the set.\n\nFor $\\left\\{ k + \\frac{1}{n} : k = 0, 1,\\ n \\ge 1 \\right\\}$, the points $\\frac{1}{n}$ pile up at $0$ and the points $1 + \\frac{1}{n}$ pile up at $1$. So the set has $2$ limit points.\n\nCheck: the largest point, $2$, has no other point of the set closer than $\\frac{1}{2}$, so it is not a limit point.\n\n> **Watch out.** A point of the set need not be a limit point, and a limit point need not belong to the set: here $0$ is a limit point outside the set.",
          "集合的极限点是这样的点：它周围每个小区间都含有集合中的另一点。收敛到某值的数列使这个值成为极限点，即使它不在集合中。\n\n对 $\\left\\{ k + \\frac{1}{n} : k = 0, 1,\\ n \\ge 1 \\right\\}$，点 $\\frac{1}{n}$ 聚集在 $0$，点 $1 + \\frac{1}{n}$ 聚集在 $1$。所以这个集合有 $2$ 个极限点。\n\n检验：最大的点 $2$ 周围，集合的其他点都离它至少 $\\frac{1}{2}$，所以它不是极限点。\n\n> **注意。** 集合的点不一定是极限点，极限点也不一定属于集合：这里 $0$ 是不在集合中的极限点。",
        ],
        (rng) => {
          const m = rng.int(2, 30);
          const s = rng.int(-20, 20);
          return solved(
            [
              `How many limit points does the set $\\left\\{ k + \\frac{1}{n} : k = ${s}, ${s + 1}, \\dots, ${s + m - 1},\\ n \\ge 1 \\right\\}$ have?`,
              `集合 $\\left\\{ k + \\frac{1}{n} : k = ${s}, ${s + 1}, \\dots, ${s + m - 1},\\ n \\ge 1 \\right\\}$ 有多少个极限点？`,
            ],
            m,
            [
              why(
                0,
                "The points $k + \\frac{1}{n}$ pile up at each value of $k$, so the set does have limit points.",
                "点 $k + \\frac{1}{n}$ 聚集在 $k$ 的每个值处，所以这个集合确实有极限点。",
              ),
              why(
                m + 1,
                `That counts $${s + m}$, the largest point; nothing else in the set comes within $\\frac{1}{2}$ of it.`,
                `这多数了最大的点 $${s + m}$；集合中没有别的点离它小于 $\\frac{1}{2}$。`,
              ),
              why(
                2 * m,
                "That counts $k + 1$ as well as $k$; the points $k + 1$ are among the values of $k$ or isolated.",
                "这在数 $k$ 的同时又数了 $k + 1$；点 $k + 1$ 要么是 $k$ 的某个值，要么是孤立点。",
              ),
            ],
            solution(
              [
                [
                  ["Find where the points pile up", "找出点聚集的地方"],
                  [
                    `For each of the $${m}$ values of $k$, the points $k + \\frac{1}{n}$ tend to $k$, so each $k$ is a limit point.`,
                    `对 $k$ 的 $${m}$ 个值中的每一个，点 $k + \\frac{1}{n}$ 趋于 $k$，所以每个 $k$ 都是极限点。`,
                  ],
                ],
                [
                  ["Rule out the rest", "排除其余的点"],
                  [
                    `Any other real number has a small interval around it with at most one point of the set, so there are $${m}$ limit points.`,
                    `任何其他实数周围都有一个小区间，其中至多有集合的一个点，所以共有 $${m}$ 个极限点。`,
                  ],
                ],
              ],
              [
                `The limit points are $${s}, ${s + 1}, \\dots, ${s + m - 1}$, and from $${s}$ to $${s + m - 1}$ there are $${s + m - 1} - (${s}) + 1 = ${m}$ integers.`,
                `极限点是 $${s}, ${s + 1}, \\dots, ${s + m - 1}$，从 $${s}$ 到 $${s + m - 1}$ 共有 $${s + m - 1} - (${s}) + 1 = ${m}$ 个整数。`,
              ],
            ),
          );
        },
      ),
      point(
        "counting-isolated-points",
        ["Counting isolated points", "数孤立点"],
        [
          "An isolated point belongs to the set, but some small interval around it holds no other point of the set. A point added inside an interval is not isolated, while a point added outside its closure is.\n\nIn $(0, 5) \\cup \\{2, 5, 7, 8\\}$, the point $2$ lies inside the interval and $5$ is its end, which points of $(0, 5)$ approach. Only $7$ and $8$ are isolated, so there are $2$.\n\nCheck: the interval $(6.5, 7.5)$ contains $7$ and no other point of the set, and $(7.5, 8.5)$ does the same for $8$.\n\n> **Watch out.** An end point of an interval is not isolated, even when it is added to the set separately: the interval runs right up to it.",
          "孤立点属于集合，但它周围某个小区间不含集合的其他点。加在区间内的点不是孤立点，而加在闭包之外的点是孤立点。\n\n在 $(0, 5) \\cup \\{2, 5, 7, 8\\}$ 中，点 $2$ 在区间内，$5$ 是区间的端点，$(0, 5)$ 中的点趋近它。只有 $7$ 和 $8$ 是孤立点，所以有 $2$ 个。\n\n检验：区间 $(6.5, 7.5)$ 含有 $7$，不含集合的其他点；$(7.5, 8.5)$ 对 $8$ 也一样。\n\n> **注意。** 区间的端点不是孤立点，即使它被单独加进集合：区间一直延伸到它跟前。",
        ],
        (rng) => {
          const a = rng.int(-10, 10);
          const b = a + rng.int(4, 12);
          const outside = rng.int(1, 6);
          const inside = rng.int(1, 3);
          const points = [
            ...Array.from({ length: outside }, (_, i) => b + 2 + i),
            ...Array.from({ length: inside }, (_, i) => a + 1 + i),
            b,
          ].sort((x, y) => x - y);
          return solved(
            [
              `How many isolated points does the set $(${a}, ${b}) \\cup \\{${points.join(", ")}\\}$ have?`,
              `集合 $(${a}, ${b}) \\cup \\{${points.join(", ")}\\}$ 有多少个孤立点？`,
            ],
            outside,
            [
              why(
                outside + inside,
                `That counts the points inside $(${a}, ${b})$, which have points of the interval all around them.`,
                `这数了 $(${a}, ${b})$ 内部的点，而它们周围全是区间中的点。`,
              ),
              why(
                outside + inside + 1,
                "That counts every listed point; only those apart from the interval are isolated.",
                "这把列出的点都数了；只有离开区间的点才是孤立点。",
              ),
              why(
                outside + 1,
                `That counts the end $${b}$, which points of $(${a}, ${b})$ approach.`,
                `这数了端点 $${b}$，而 $(${a}, ${b})$ 中的点趋近它。`,
              ),
            ],
            solution(
              [
                [
                  ["Sort the listed points", "把列出的点分类"],
                  [
                    `$${inside}$ of them lie inside $(${a}, ${b})$, one is the end $${b}$, and $${outside}$ lie above $${b + 1}$.`,
                    `其中 $${inside}$ 个在 $(${a}, ${b})$ 内部，一个是端点 $${b}$，$${outside}$ 个大于 $${b + 1}$。`,
                  ],
                ],
                [
                  ["Test each kind", "逐类检验"],
                  [
                    `Points inside the interval and its end are approached by the interval, while the $${outside}$ points above $${b + 1}$ stand apart. So there are $${outside}$ isolated points.`,
                    `区间内部的点和端点都被区间中的点趋近，而大于 $${b + 1}$ 的 $${outside}$ 个点是分开的。所以有 $${outside}$ 个孤立点。`,
                  ],
                ],
              ],
              [
                `Each point from $${b + 2}$ on is at distance at least $1$ from every other point of the set, so an interval of radius $\\frac{1}{2}$ around it holds no other point.`,
                `从 $${b + 2}$ 起的每个点与集合中其他点的距离至少是 $1$，所以它周围半径为 $\\frac{1}{2}$ 的区间不含其他点。`,
              ],
            ),
          );
        },
      ),
      point(
        "counting-boundary-points",
        ["Counting boundary points", "数边界点"],
        [
          "A boundary point has both points of the set and points outside it in every small interval around it. For a union of open intervals, the boundary is the set of end points, each counted once when intervals touch.\n\nThe set $(0, 1) \\cup (1, 3) \\cup (4, 5)$ has the ends $0, 1, 1, 3, 4, 5$. The end $1$ is shared, so the boundary is $\\{0, 1, 3, 4, 5\\}$, with $5$ points.\n\nCheck: $1$ is not in the set, but every interval around it meets $(0, 1)$, so it is a boundary point; a point such as $2$ has a whole interval inside the set and is not.\n\n> **Watch out.** A shared end counts once. It is still a boundary point, although it is missing from the set.",
          "边界点周围每个小区间既有集合内的点，也有集合外的点。对开区间的并，边界就是端点的集合，相接的端点只算一次。\n\n集合 $(0, 1) \\cup (1, 3) \\cup (4, 5)$ 的端点是 $0, 1, 1, 3, 4, 5$。端点 $1$ 是共用的，所以边界是 $\\{0, 1, 3, 4, 5\\}$，有 $5$ 个点。\n\n检验：$1$ 不在集合中，但它周围每个区间都与 $(0, 1)$ 相交，所以它是边界点；而像 $2$ 这样的点周围有整个区间都在集合内，不是边界点。\n\n> **注意。** 共用的端点只算一次。它虽然不在集合中，仍是边界点。",
        ],
        (rng) => {
          const m = rng.int(2, 7);
          const touching = rng.int(0, m - 1);
          const parts: string[] = [];
          let at = rng.int(-20, 5);
          for (let i = 0; i < m; i++) {
            const end = at + rng.int(1, 4);
            parts.push(`(${at}, ${end})`);
            at = end + (i < touching ? 0 : rng.int(1, 3));
          }
          const answer = 2 * m - touching;
          return solved(
            [`How many boundary points does $${parts.join(" \\cup ")}$ have?`, `$${parts.join(" \\cup ")}$ 有多少个边界点？`],
            answer,
            [
              why(2 * m, "That counts each shared end twice.", "这把每个共用的端点数了两次。"),
              why(m + 1, "That counts the pieces plus one, not the ends.", "这数的是段数加一，不是端点。"),
              why(
                2 * m + touching,
                "That adds the shared ends again instead of counting them once.",
                "这把共用的端点又加了一次，而不是只算一次。",
              ),
            ],
            solution(
              [
                [
                  ["Count the ends", "数端点"],
                  [
                    `The $${m}$ intervals have $${2 * m}$ ends, and $${touching}$ of them are shared by two touching intervals.`,
                    `这 $${m}$ 个区间共有 $${2 * m}$ 个端点，其中 $${touching}$ 个被两个相接的区间共用。`,
                  ],
                ],
                [
                  ["Count each point once", "每个点只算一次"],
                  [
                    `So the boundary has $${2 * m} - ${touching} = ${answer}$ points.`,
                    `所以边界有 $${2 * m} - ${touching} = ${answer}$ 个点。`,
                  ],
                ],
              ],
              [
                "Each end is missing from the open intervals but has points of the set beside it, so it is a boundary point; points inside an interval or away from all of them are not.",
                "每个端点都不在开区间中，但旁边有集合的点，所以是边界点；区间内部的点和远离所有区间的点都不是。",
              ],
            ),
          );
        },
      ),
    ],
  ),
  intro: t(
    "The set $\\left\\{ \\frac{1}{n} : n \\ge 1 \\right\\}$ has the single limit point $0$, which it does not contain, while each of its own points is isolated: no other point of the set lies in $\\left(\\frac{2}{5}, \\frac{3}{5}\\right)$ around $\\frac{1}{2}$.\n\nCheck: the points $\\frac{1}{n}$ come within any distance of $0$, so every interval around $0$ meets the set.\n\nIn this lesson we count the limit points, isolated points and boundary points of sets of reals.",
    "集合 $\\left\\{ \\frac{1}{n} : n \\ge 1 \\right\\}$ 只有一个极限点 $0$，它不在集合中；而集合自身的每个点都是孤立点：在 $\\frac{1}{2}$ 周围的 $\\left(\\frac{2}{5}, \\frac{3}{5}\\right)$ 中没有集合的其他点。\n\n检验：点 $\\frac{1}{n}$ 与 $0$ 的距离可以任意小，所以 $0$ 周围每个区间都与集合相交。\n\n本课我们数实数集的极限点、孤立点和边界点。",
  ),
};

const cantorSet = {
  ...topic(
    "the-cantor-set",
    ["The Cantor Set", "康托尔集"],
    ["Remove middle thirds forever, and measure and test what remains.", "不断去掉中间三分之一，测量并检验剩下的部分。"],
    ["limit-points-and-closures"],
    [],
    [
      point(
        "the-length-left-after-n-steps",
        ["The length left after n steps", "第 n 步后剩下的长度"],
        [
          "Each step removes the open middle third of every remaining interval, so the number of intervals doubles and the total length is multiplied by two thirds. The total length therefore tends to zero.\n\nStarting from $[0, 1]$, two steps leave the four intervals $\\left[0, \\frac{1}{9}\\right]$, $\\left[\\frac{2}{9}, \\frac{1}{3}\\right]$, $\\left[\\frac{2}{3}, \\frac{7}{9}\\right]$ and $\\left[\\frac{8}{9}, 1\\right]$, of total length $\\left(\\frac{2}{3}\\right)^{2} = \\frac{4}{9}$.\n\nCheck: the removed lengths are $\\frac{1}{3}$ and $\\frac{2}{9}$, and $1 - \\frac{1}{3} - \\frac{2}{9} = \\frac{4}{9}$.\n\n> **Watch out.** Multiply by $\\frac{2}{3}$ at each step, the part kept, not by $\\frac{1}{3}$, the part removed.",
          "每一步去掉每个剩余区间中间的开三分之一，所以区间数加倍，总长度乘三分之二。因此总长度趋于零。\n\n从 $[0, 1]$ 开始，两步后剩下四个区间 $\\left[0, \\frac{1}{9}\\right]$、$\\left[\\frac{2}{9}, \\frac{1}{3}\\right]$、$\\left[\\frac{2}{3}, \\frac{7}{9}\\right]$ 和 $\\left[\\frac{8}{9}, 1\\right]$，总长度是 $\\left(\\frac{2}{3}\\right)^{2} = \\frac{4}{9}$。\n\n检验：去掉的长度是 $\\frac{1}{3}$ 和 $\\frac{2}{9}$，而 $1 - \\frac{1}{3} - \\frac{2}{9} = \\frac{4}{9}$。\n\n> **注意。** 每一步乘的是保留的 $\\frac{2}{3}$，不是去掉的 $\\frac{1}{3}$。",
        ],
        (rng) => {
          const n = rng.int(1, 8);
          const l = rng.pick([1, 3, 9, 27, 81, 243]);
          const answer = Q.of(l * 2 ** n, 3 ** n);
          return solved(
            [
              `The middle thirds are removed ${n} ${n === 1 ? "time" : "times"}, starting from $[0, ${l}]$. What total length remains?`,
              `从 $[0, ${l}]$ 开始去掉中间三分之一，共 ${n} 次。剩下的总长度是多少？`,
            ],
            answer,
            [
              why(
                Q.of(l, 3 ** n),
                "That is the length of one remaining interval; there are $2^{n}$ of them.",
                "这是一个剩余区间的长度；这样的区间有 $2^{n}$ 个。",
              ),
              why(
                Q.of(l * 2 ** (n - 1), 3 ** n),
                "That counts only half the remaining intervals; their number doubles at every step.",
                "这只数了一半的剩余区间；区间数每一步都加倍。",
              ),
              why(
                Q.of(l * (3 ** n - 2 ** n), 3 ** n),
                "That is the length removed, not the length that remains.",
                "这是去掉的长度，不是剩下的长度。",
              ),
            ],
            solution(
              [
                [
                  ["Follow one step", "看一步"],
                  [
                    "Each step keeps two thirds of every interval, so it multiplies the total length by $\\frac{2}{3}$.",
                    "每一步保留每个区间的三分之二，所以总长度乘 $\\frac{2}{3}$。",
                  ],
                ],
                [
                  ["Repeat the steps", "重复各步"],
                  [
                    `After ${n} ${n === 1 ? "step" : "steps"} the length is $${l} \\times \\frac{${2 ** n}}{${3 ** n}} = ${answer.toLatex()}$.`,
                    `${n} 步后长度是 $${l} \\times \\frac{${2 ** n}}{${3 ** n}} = ${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `There are $${2 ** n}$ intervals left, each of length $${Q.of(l, 3 ** n).toLatex()}$, and $${2 ** n} \\times ${Q.of(l, 3 ** n).toLatex()} = ${answer.toLatex()}$.`,
                `剩下 $${2 ** n}$ 个区间，每个长 $${Q.of(l, 3 ** n).toLatex()}$，而 $${2 ** n} \\times ${Q.of(l, 3 ** n).toLatex()} = ${answer.toLatex()}$。`,
              ],
            ),
          );
        },
      ),
      point(
        "the-length-removed-at-one-step",
        ["The length removed at one step", "某一步去掉的长度"],
        [
          "Before step $n$ there are $2^{n-1}$ intervals, each of length $3^{-(n-1)}$. The step removes one third of each, and adding all of these removed lengths gives a total of 1 on the unit interval.\n\nAt step $2$ there are $2$ intervals of length $\\frac{1}{3}$, and the step removes $2$ gaps of length $\\frac{1}{9}$, so it removes $\\frac{2}{9}$. The first two steps remove $1 + 2 = 3$ open intervals.\n\nCheck: the removed lengths $\\frac{1}{3}, \\frac{2}{9}, \\frac{4}{27}, \\dots$ form a geometric series with sum $\\frac{1/3}{1 - 2/3} = 1$.\n\n> **Watch out.** Before step $n$ there are $2^{n-1}$ intervals, not $2^{n}$: the count doubles only after the step.",
          "第 $n$ 步之前有 $2^{n-1}$ 个区间，每个长 $3^{-(n-1)}$。这一步去掉每个的三分之一，在单位区间上所有去掉的长度之和是 1。\n\n第 $2$ 步时有 $2$ 个长为 $\\frac{1}{3}$ 的区间，这一步去掉 $2$ 个长为 $\\frac{1}{9}$ 的空隙，所以去掉 $\\frac{2}{9}$。前两步共去掉 $1 + 2 = 3$ 个开区间。\n\n检验：去掉的长度 $\\frac{1}{3}, \\frac{2}{9}, \\frac{4}{27}, \\dots$ 构成几何级数，和为 $\\frac{1/3}{1 - 2/3} = 1$。\n\n> **注意。** 第 $n$ 步之前有 $2^{n-1}$ 个区间，不是 $2^{n}$ 个：区间数要在这一步之后才加倍。",
        ],
        (rng) => {
          const n = rng.int(1, 14);
          const part = rng.bool();
          if (part) {
            const answer = Q.of(2 ** (n - 1), 3 ** n);
            const before = Q.of(1, 3 ** (n - 1)).toLatex();
            const gap = Q.of(1, 3 ** n).toLatex();
            return solved(
              [
                `What length is removed from $[0, 1]$ at step ${n} of the Cantor construction?`,
                `康托尔构造的第 ${n} 步从 $[0, 1]$ 中去掉多少长度？`,
              ],
              answer,
              [
                why(
                  Q.of(2 ** n, 3 ** n),
                  "That is the length left after the step, not the length removed.",
                  "这是这一步之后剩下的长度，不是去掉的长度。",
                ),
                why(
                  Q.of(1, 3 ** n),
                  "That is one gap; the step removes one gap from every interval.",
                  "这是一个空隙；这一步从每个区间各去掉一个空隙。",
                ),
                why(
                  Q.of(2 ** (n - 1), 3 ** (n - 1)),
                  "That is the total length before the step; only a third of it is removed.",
                  "这是这一步之前的总长度；只去掉其中的三分之一。",
                ),
              ],
              solution(
                [
                  [
                    ["Count the intervals", "数区间"],
                    [
                      `Before step ${n} there are $${2 ** (n - 1)}$ intervals, each of length $${before}$.`,
                      `第 ${n} 步之前有 $${2 ** (n - 1)}$ 个区间，每个长 $${before}$。`,
                    ],
                  ],
                  [
                    ["Remove the middle thirds", "去掉中间三分之一"],
                    [
                      `Each loses a gap of length $${gap}$, so the step removes $${2 ** (n - 1)} \\times ${gap} = ${answer.toLatex()}$.`,
                      `每个区间去掉长为 $${gap}$ 的空隙，所以这一步去掉 $${2 ** (n - 1)} \\times ${gap} = ${answer.toLatex()}$。`,
                    ],
                  ],
                ],
                [
                  `The length before the step is $${Q.of(2 ** (n - 1), 3 ** (n - 1)).toLatex()}$, and a third of it is $${answer.toLatex()}$.`,
                  `这一步之前的长度是 $${Q.of(2 ** (n - 1), 3 ** (n - 1)).toLatex()}$，它的三分之一是 $${answer.toLatex()}$。`,
                ],
              ),
            );
          }
          const counts = n <= 4 ? Array.from({ length: n }, (_, i) => 2 ** i).join(" + ") : `1 + 2 + 4 + \\dots + ${2 ** (n - 1)}`;
          return solved(
            [
              `How many open intervals are removed in total during the first ${n} steps of the Cantor construction?`,
              `康托尔构造的前 ${n} 步共去掉多少个开区间？`,
            ],
            2 ** n - 1,
            [
              why(
                2 ** n,
                "That is the number of closed intervals left, one more than the gaps between them.",
                "这是剩下的闭区间个数，比它们之间的空隙多一个。",
              ),
              why(2 ** (n - 1), "That is only the number removed at the last step.", "这只是最后一步去掉的个数。"),
              why(
                3 ** n - 1,
                "That treats each interval as splitting into three kept pieces; only two are kept.",
                "这把每个区间当成分成三段都保留；实际只保留两段。",
              ),
            ],
            solution(
              [
                [
                  ["Count each step", "逐步计数"],
                  [
                    `Step $j$ removes one gap from each of the $2^{j-1}$ intervals, so the steps remove $${counts}$ intervals.`,
                    `第 $j$ 步从 $2^{j-1}$ 个区间中各去掉一个空隙，所以各步去掉 $${counts}$ 个区间。`,
                  ],
                ],
                [
                  ["Add them", "相加"],
                  [`The sum of these powers of two is $${2 ** n - 1}$.`, `这些二的幂之和是 $${2 ** n - 1}$。`],
                ],
              ],
              [
                `After ${n} ${n === 1 ? "step" : "steps"} there are $${2 ** n}$ closed intervals in a row, and each removed gap lies between two neighbours, so there are $${2 ** n} - 1 = ${2 ** n - 1}$ gaps.`,
                `${n} 步后有 $${2 ** n}$ 个闭区间排成一列，每个去掉的空隙都在两个相邻区间之间，所以有 $${2 ** n} - 1 = ${2 ** n - 1}$ 个空隙。`,
              ],
            ),
          );
        },
      ),
      point(
        "membership-from-ternary-digits",
        ["Membership from ternary digits", "由三进制数字判断属于"],
        [
          "A number lies in the Cantor set exactly when it has a base three expansion using only the digits 0 and 2. A digit 1 followed by later nonzero digits places the number inside a removed gap.\n\nIn base three, $\\frac{2}{9} = 0.02$ uses only $0$ and $2$, so it is in the set, while $\\frac{4}{9} = 0.11$ is not: it lies in $\\left(\\frac{1}{3}, \\frac{2}{3}\\right)$, the first gap removed.\n\nCheck: $\\frac{1}{3} = 0.1 = 0.0222\\ldots$ can be rewritten without a $1$, and indeed it is an end point that is never removed.\n\n> **Watch out.** A final digit $1$ can be rewritten as $0222\\ldots$, but a $1$ followed by a later nonzero digit cannot.",
          "一个数属于康托尔集，当且仅当它有只用数字 0 和 2 的三进制展开。数字 1 后面还有非零数字时，这个数落在被去掉的空隙里。\n\n在三进制中，$\\frac{2}{9} = 0.02$ 只用 $0$ 和 $2$，所以属于康托尔集；而 $\\frac{4}{9} = 0.11$ 不属于：它在第一个被去掉的空隙 $\\left(\\frac{1}{3}, \\frac{2}{3}\\right)$ 中。\n\n检验：$\\frac{1}{3} = 0.1 = 0.0222\\ldots$ 可以改写成没有 $1$ 的形式，它确实是一个永远不被去掉的端点。\n\n> **注意。** 最后一位的 $1$ 可以改写成 $0222\\ldots$，但后面还有非零数字的 $1$ 不能改写。",
        ],
        (rng) => {
          const k = rng.int(3, 5);
          const digits = () => Array.from({ length: k - 1 }, () => rng.pick([0, 2]));
          const value = (d: number[]) => d.reduce((s, x) => 3 * s + x, 0);
          const good = [...digits(), 2];
          const bad = () => {
            const d = [...digits(), 2];
            d[rng.int(0, k - 2)] = 1;
            return Q.of(value(d), 3 ** k);
          };
          const a = bad();
          let b = bad();
          let c = bad();
          for (let i = 0; i < 12 && (b.eq(a) || c.eq(a) || b.eq(c)); i++) {
            b = bad();
            c = bad();
          }
          const pair = (q: Q) => same(q.toLatex());
          const ternary = (q: Q) => {
            let v = Math.round(q.toNumber() * 3 ** k);
            const out: number[] = [];
            for (let i = 0; i < k; i++) {
              out.unshift(v % 3);
              v = Math.floor(v / 3);
            }
            return out.join("");
          };
          const answer = Q.of(value(good), 3 ** k);
          const removed = (q: Q) =>
            reason(
              q.toLatex(),
              `In base three it is $0.${ternary(q)}$, with a $1$ followed by a later $2$, so it lies in a removed gap.`,
              `它的三进制是 $0.${ternary(q)}$，有一个 $1$ 后面还跟着 $2$，所以落在被去掉的空隙里。`,
            );
          return reasoned(
            choose(
              rng,
              [`Which number belongs to the Cantor set in $[0, 1]$?`, `哪个数属于 $[0, 1]$ 中的康托尔集？`],
              pair(answer),
              [pair(a), pair(b), pair(c)],
              asPair(
                solution(
                  [
                    [
                      ["Write the numbers in base three", "写成三进制"],
                      [
                        `With denominator $${3 ** k}$, the options are $0.${ternary(answer)}$, $0.${ternary(a)}$, $0.${ternary(b)}$ and $0.${ternary(c)}$ in base three.`,
                        `以 $${3 ** k}$ 为分母，各选项的三进制是 $0.${ternary(answer)}$、$0.${ternary(a)}$、$0.${ternary(b)}$ 和 $0.${ternary(c)}$。`,
                      ],
                    ],
                    [
                      ["Look for the digit one", "找数字一"],
                      [
                        `Only $${answer.toLatex()} = 0.${good.join("")}$ uses no digit $1$, so it is the one in the Cantor set.`,
                        `只有 $${answer.toLatex()} = 0.${good.join("")}$ 不用数字 $1$，所以它属于康托尔集。`,
                      ],
                    ],
                  ],
                  [
                    `Each digit of $0.${good.join("")}$ picks the left third (digit $0$) or the right third (digit $2$) of the current interval, so the number is never in a removed middle third.`,
                    `$0.${good.join("")}$ 的每一位都选当前区间的左三分之一（数字 $0$）或右三分之一（数字 $2$），所以这个数永远不在被去掉的中间三分之一里。`,
                  ],
                ),
              ),
            ),
            [removed(a), removed(b), removed(c)],
          );
        },
      ),
    ],
  ),
  intro: t(
    "Start with $[0, 1]$ and remove the open middle third $\\left(\\frac{1}{3}, \\frac{2}{3}\\right)$. Two intervals of length $\\frac{1}{3}$ remain, and removing their middle thirds leaves four intervals of length $\\frac{1}{9}$, of total length $\\frac{4}{9}$.\n\nCheck: $4 \\times \\frac{1}{9} = \\frac{4}{9} = \\left(\\frac{2}{3}\\right)^{2}$.\n\nIn this lesson we measure what the middle-thirds construction leaves and removes, and test membership in the Cantor set by base three digits.",
    "从 $[0, 1]$ 开始，去掉中间的开三分之一 $\\left(\\frac{1}{3}, \\frac{2}{3}\\right)$。剩下两个长为 $\\frac{1}{3}$ 的区间，再去掉它们中间的三分之一，剩下四个长为 $\\frac{1}{9}$ 的区间，总长度是 $\\frac{4}{9}$。\n\n检验：$4 \\times \\frac{1}{9} = \\frac{4}{9} = \\left(\\frac{2}{3}\\right)^{2}$。\n\n本课我们测量去掉中间三分之一的构造剩下和去掉的长度，并用三进制数字检验一个数是否属于康托尔集。",
  ),
};

const connected = {
  ...topic(
    "connected-sets-of-reals",
    ["Connected Sets of Reals", "实数的连通集"],
    [
      "Recognize that connected sets of reals are exactly the intervals, and use that continuity keeps them connected.",
      "认识实数的连通集恰好是区间，并利用连续性保持连通。",
    ],
    ["open-and-closed-sets-of-reals"],
    [],
    [
      point(
        "which-set-is-connected",
        ["Which set is connected", "哪个集合连通"],
        [
          "A set of reals is connected exactly when it contains every number between any two of its points. So a single missing point splits an interval, and the rationals are as far from connected as possible.\n\nThe set $[0, 2) \\cup [2, 5]$ is the interval $[0, 5]$, so it is connected. The set $[0, 2) \\cup (2, 5]$ misses $2$, which lies between $1$ and $3$, so it is not.\n\nCheck: $[0, 5] \\cap \\mathbb{Q}$ contains $1$ and $2$ but misses $\\sqrt{2}$, which lies between them, so it is not connected either.\n\n> **Watch out.** At a joint, look at which piece contains the meeting point. If neither does, the set has a gap of a single point.",
          "实数集连通，当且仅当它包含其任意两点之间的每个数。所以缺一个点就把区间分开，而有理数远不连通。\n\n集合 $[0, 2) \\cup [2, 5]$ 就是区间 $[0, 5]$，所以连通。集合 $[0, 2) \\cup (2, 5]$ 缺了 $2$，而 $2$ 在 $1$ 和 $3$ 之间，所以不连通。\n\n检验：$[0, 5] \\cap \\mathbb{Q}$ 含有 $1$ 和 $2$，却缺了它们之间的 $\\sqrt{2}$，所以也不连通。\n\n> **注意。** 在接合处要看哪一段含有那个交点。如果两段都不含，集合就有一个单点的空隙。",
        ],
        (rng) => {
          const a = rng.int(-20, 15);
          const b = a + rng.int(3, 15);
          const c = rng.int(a + 1, b - 1);
          const right = `[${a}, ${c}) \\cup [${c}, ${b}]`;
          const hole = `[${a}, ${c}) \\cup (${c}, ${b}]`;
          const rational = `[${a}, ${b}] \\cap \\mathbb{Q}`;
          const apart = `[${a}, ${c}) \\cup [${b}, ${b + 3}]`;
          return reasoned(
            choose(
              rng,
              [`Which of these sets is connected?`, `下面哪个集合是连通的？`],
              same(right),
              [same(hole), same(rational), same(apart)],
              asPair(
                solution(
                  [
                    [
                      ["Join the pieces", "把各段接起来"],
                      [
                        `$[${a}, ${c})$ and $[${c}, ${b}]$ meet at $${c}$ with no gap, so their union is the interval $[${a}, ${b}]$.`,
                        `$[${a}, ${c})$ 和 $[${c}, ${b}]$ 在 $${c}$ 处无缝相接，所以它们的并是区间 $[${a}, ${b}]$。`,
                      ],
                    ],
                    [
                      ["Find the gaps in the others", "找出其他集合的空隙"],
                      [
                        `The second set misses $${c}$, the third misses every irrational number, and the fourth misses $[${c}, ${b})$.`,
                        `第二个集合缺了 $${c}$，第三个缺了所有无理数，第四个缺了 $[${c}, ${b})$。`,
                      ],
                    ],
                  ],
                  [
                    `An interval contains everything between any two of its points, and $[${a}, ${b}]$ is an interval, so the answer is connected.`,
                    `区间包含其任意两点之间的一切，而 $[${a}, ${b}]$ 是区间，所以答案是连通的。`,
                  ],
                ),
              ),
            ),
            [
              reason(
                hole,
                `It misses $${c}$, which lies between $${a}$ and $${b}$.`,
                `它缺了 $${c}$，而 $${c}$ 在 $${a}$ 和 $${b}$ 之间。`,
              ),
              reason(
                rational,
                `It misses the irrational $${a} + \\frac{\\sqrt{2}}{2}$, which lies between two of its points.`,
                `它缺了无理数 $${a} + \\frac{\\sqrt{2}}{2}$，而这个数在它的两点之间。`,
              ),
              reason(apart, `It misses everything from $${c}$ up to $${b}$.`, `它缺了从 $${c}$ 到 $${b}$ 之间的一切。`),
            ],
          );
        },
      ),
      point(
        "counting-connected-components",
        ["Counting connected components", "数连通分支"],
        [
          "Removing a point from inside an interval splits one piece into two, while removing a point outside it does nothing. So count how many of the removed points lie strictly inside and add one.\n\nFrom $[0, 10]$ remove $\\{0, 3, 7, 12\\}$. Only $3$ and $7$ lie strictly inside, so there are $2 + 1 = 3$ components: $(0, 3)$, $(3, 7)$ and $(7, 10]$.\n\nCheck: removing $0$ only opens the left end, and $12$ is not in $[0, 10]$ at all.\n\n> **Watch out.** Removing an end point shortens a piece but does not split it, and a point outside the interval changes nothing.",
          "从区间内部去掉一点，把一段分成两段；去掉区间外的点则没有影响。所以数出严格在内部的被去点数，再加一。\n\n从 $[0, 10]$ 中去掉 $\\{0, 3, 7, 12\\}$。只有 $3$ 和 $7$ 严格在内部，所以有 $2 + 1 = 3$ 个分支：$(0, 3)$、$(3, 7)$ 和 $(7, 10]$。\n\n检验：去掉 $0$ 只是使左端变开，而 $12$ 根本不在 $[0, 10]$ 中。\n\n> **注意。** 去掉端点只会缩短一段，不会把它分开；区间外的点什么也不改变。",
        ],
        (rng) => {
          const a = rng.int(-10, 5);
          const b = a + rng.int(10, 20);
          const inner = rng.int(1, 6);
          const pts = rng.sample(
            Array.from({ length: b - a - 1 }, (_, i) => a + 1 + i),
            inner,
          );
          const outer = rng.int(0, 3);
          const list = [...pts, ...Array.from({ length: outer }, (_, i) => b + 1 + i), a].sort((x, y) => x - y);
          const cuts = [...pts].sort((x, y) => x - y);
          const ends = [a, ...cuts, b];
          const pieces = ends
            .slice(0, -1)
            .map((from, i) => `(${from}, ${ends[i + 1]}${i === cuts.length ? "]" : ")"}`)
            .join(", ");
          return solved(
            [
              `How many connected components does $[${a}, ${b}] \\setminus \\{${list.join(", ")}\\}$ have?`,
              `$[${a}, ${b}] \\setminus \\{${list.join(", ")}\\}$ 有多少个连通分支？`,
            ],
            inner + 1,
            [
              why(
                list.length + 1,
                `That counts every removed point as a cut, but the end $${a}$ and points beyond $${b}$ split nothing.`,
                `这把每个去掉的点都当成切点，但端点 $${a}$ 和大于 $${b}$ 的点不分割任何部分。`,
              ),
              why(inner, "That counts the cuts but forgets the piece before the first one.", "这数了切点，却忘了第一个切点之前的那一段。"),
              why(
                inner + 2,
                `That treats removing the end $${a}$ as a cut; it only opens the left end.`,
                `这把去掉端点 $${a}$ 当成切点；它只是使左端变开。`,
              ),
            ],
            solution(
              [
                [
                  ["Sort the removed points", "把去掉的点分类"],
                  [
                    `$${inner}$ of them lie strictly inside $[${a}, ${b}]$, $${a}$ is an end, and the rest lie beyond $${b}$.`,
                    `其中 $${inner}$ 个严格在 $[${a}, ${b}]$ 内部，$${a}$ 是端点，其余的大于 $${b}$。`,
                  ],
                ],
                [
                  ["Count the pieces", "数段数"],
                  [
                    `Each inner point splits one piece into two, so there are $${inner} + 1 = ${inner + 1}$ components.`,
                    `每个内部点把一段分成两段，所以有 $${inner} + 1 = ${inner + 1}$ 个分支。`,
                  ],
                ],
              ],
              [`The components are $${pieces}$.`, `这些分支是 $${pieces}$。`],
            ),
          );
        },
      ),
      point(
        "values-forced-by-connectedness",
        ["Values forced by connectedness", "连通性迫使取到的值"],
        [
          "A continuous function sends a connected set to a connected set, so the image of an interval is an interval. This is the general form of the intermediate value theorem, and it forces all values between two outputs.\n\nIf $f$ is continuous on $[0, 3]$ with $f(0) = 2$ and $f(3) = -3$, the image contains $[-3, 2]$, so the integers $-3, -2, -1, 0, 1, 2$ are all values: $2 - (-3) + 1 = 6$ of them.\n\nCheck: the two end values $-3$ and $2$ are values themselves, and the four integers between them are forced.\n\n> **Watch out.** Count both end values. And the length of the domain does not matter; only the two outputs do.",
          "连续函数把连通集映成连通集，所以区间的像是区间。这是介值定理的一般形式，它迫使函数取到两个输出之间的所有值。\n\n若 $f$ 在 $[0, 3]$ 上连续，$f(0) = 2$，$f(3) = -3$，则像包含 $[-3, 2]$，所以整数 $-3, -2, -1, 0, 1, 2$ 都是函数值：共 $2 - (-3) + 1 = 6$ 个。\n\n检验：两个端点值 $-3$ 和 $2$ 本身就是函数值，它们之间的四个整数是被迫取到的。\n\n> **注意。** 两个端点值都要算。定义域的长度无关紧要，只看两个输出。",
        ],
        (rng) => {
          const a = rng.int(-30, 10);
          const b = a + rng.int(2, 20);
          const p = rng.int(-30, 30);
          const q = p + rng.int(2, 40) * (rng.bool() ? 1 : -1);
          const low = Math.min(p, q);
          const high = Math.max(p, q);
          const answer = high - low + 1;
          return solved(
            [
              `$f$ is continuous on $[${a}, ${b}]$, with $f(${a}) = ${p}$ and $f(${b}) = ${q}$. How many integers must be values of $f$?`,
              `$f$ 在 $[${a}, ${b}]$ 上连续，$f(${a}) = ${p}$，$f(${b}) = ${q}$。一定有多少个整数是 $f$ 的值？`,
            ],
            answer,
            [
              why(high - low, "That leaves out one of the two end values.", "这漏掉了两个端点值中的一个。"),
              why(
                high - low - 1,
                "That counts only the integers strictly between, but the end values are taken too.",
                "这只数了严格在中间的整数，但端点值也被取到。",
              ),
              why(
                b - a + 1,
                "That counts integers in the domain; the question is about values of $f$.",
                "这数的是定义域中的整数；题目问的是 $f$ 的值。",
              ),
            ],
            solution(
              [
                [
                  ["Use connectedness", "利用连通性"],
                  [
                    `$f$ is continuous on the connected set $[${a}, ${b}]$, so its image is an interval containing $${p}$ and $${q}$, and hence all of $[${low}, ${high}]$.`,
                    `$f$ 在连通集 $[${a}, ${b}]$ 上连续，所以它的像是包含 $${p}$ 和 $${q}$ 的区间，从而包含整个 $[${low}, ${high}]$。`,
                  ],
                ],
                [
                  ["Count the integers", "数整数"],
                  [
                    `The integers from $${low}$ to $${high}$ number $${high} - (${low}) + 1 = ${answer}$.`,
                    `从 $${low}$ 到 $${high}$ 的整数共有 $${high} - (${low}) + 1 = ${answer}$ 个。`,
                  ],
                ],
              ],
              [
                `A function could take only the values in $[${low}, ${high}]$, for example a straight line from $(${a}, ${p})$ to $(${b}, ${q})$, so no more integers are forced.`,
                `函数可以只取 $[${low}, ${high}]$ 中的值，例如从 $(${a}, ${p})$ 到 $(${b}, ${q})$ 的直线，所以不会迫使更多的整数。`,
              ],
            ),
          );
        },
      ),
    ],
  ),
  intro: t(
    "Remove the points $1$ and $2$ from $[0, 3]$. What is left falls into three pieces, $[0, 1)$, $(1, 2)$ and $(2, 3]$, each of them an interval.\n\nCheck: a continuous $f$ with $f(0) = 1$ and $f(3) = 4$ must take each of the values $1, 2, 3, 4$, because the image of $[0, 3]$ is an interval.\n\nIn this lesson we recognize connected sets of reals as intervals, count the components of a set, and find the values that continuity forces.",
    "从 $[0, 3]$ 中去掉点 $1$ 和 $2$。剩下的部分分成三段：$[0, 1)$、$(1, 2)$ 和 $(2, 3]$，每段都是区间。\n\n检验：满足 $f(0) = 1$、$f(3) = 4$ 的连续函数 $f$ 必须取到 $1, 2, 3, 4$ 中的每个值，因为 $[0, 3]$ 的像是区间。\n\n本课我们认识实数的连通集就是区间，数出集合的分支个数，并求出连续性迫使取到的值。",
  ),
};

const compactImages = {
  ...topic(
    "continuous-images-of-compact-sets",
    ["Continuous Images of Compact Sets", "紧集的连续像"],
    [
      "See why continuity on a compact set gives a bounded function that attains its extremes.",
      "理解为什么紧集上的连续函数有界并取到最值。",
    ],
    ["compactness-on-the-real-line", "connected-sets-of-reals"],
    [],
    [
      point(
        "the-image-of-a-closed-interval",
        ["The image of a closed interval", "闭区间的像"],
        [
          "A continuous image of a closed bounded interval is again a closed bounded interval, because compactness and connectedness are both preserved. To find it, locate the least and greatest values, which are attained.\n\nFor $f(x) = x^{2}$ on $[-2, 3]$, the least value is $0$, at $x = 0$ inside the interval, and the greatest is $9$, at $x = 3$. So the image is $[0, 9]$, of length $9$.\n\nCheck: the other end gives $f(-2) = 4$, which lies inside $[0, 9]$.\n\n> **Watch out.** The extremes need not be at the ends. Here the least value is attained inside, at $x = 0$, so the image does not run from $f(-2)$ to $f(3)$.",
          "闭有界区间的连续像仍是闭有界区间，因为紧性和连通性都被保持。要求出它，就找到能取到的最小值和最大值。\n\n对 $[-2, 3]$ 上的 $f(x) = x^{2}$，最小值是 $0$，在区间内的 $x = 0$ 处取到；最大值是 $9$，在 $x = 3$ 处取到。所以像是 $[0, 9]$，长度为 $9$。\n\n检验：另一端给出 $f(-2) = 4$，它在 $[0, 9]$ 之内。\n\n> **注意。** 最值不一定在端点取到。这里最小值在内部的 $x = 0$ 处取到，所以像不是从 $f(-2)$ 到 $f(3)$。",
        ],
        (rng) => {
          const a = rng.int(1, 12);
          const b = rng.int(1, 12);
          const top = Math.max(a, b);
          const answer = top ** 2;
          return solved(
            [
              `What is the length of the image of $[-${a}, ${b}]$ under $f(x) = x^{2}$?`,
              `$[-${a}, ${b}]$ 在 $f(x) = x^{2}$ 下的像的长度是多少？`,
            ],
            answer,
            [
              b * b - a * a === 0
                ? why(a + b, "That is the length of the interval, not of its image.", "这是区间的长度，不是像的长度。")
                : why(
                    Math.abs(b * b - a * a),
                    "That runs from one end value to the other, missing the least value $0$ inside.",
                    "这是从一个端点值到另一个端点值，漏掉了内部的最小值 $0$。",
                  ),
              why(
                a * a + b * b,
                "That adds the two end values; the image runs from $0$ to the larger one.",
                "这把两个端点值相加；像是从 $0$ 到较大的那个。",
              ),
              why(a + b, "That is the length of the interval, not of its image.", "这是区间的长度，不是像的长度。"),
            ],
            solution(
              [
                [
                  ["Find the least value", "求最小值"],
                  [
                    `$x^{2} \\ge 0$, and $x = 0$ lies in $[-${a}, ${b}]$, so the least value is $0$.`,
                    `$x^{2} \\ge 0$，而 $x = 0$ 在 $[-${a}, ${b}]$ 中，所以最小值是 $0$。`,
                  ],
                ],
                [
                  ["Find the greatest value", "求最大值"],
                  [
                    `The end farther from $0$ is at distance $${top}$, so the greatest value is $${answer}$ and the image is $[0, ${answer}]$, of length $${answer}$.`,
                    `离 $0$ 较远的端点距离为 $${top}$，所以最大值是 $${answer}$，像是 $[0, ${answer}]$，长度为 $${answer}$。`,
                  ],
                ],
              ],
              [
                `The end values $f(-${a}) = ${a * a}$ and $f(${b}) = ${b * b}$ both lie in $[0, ${answer}]$, and one of them is its right end.`,
                `端点值 $f(-${a}) = ${a * a}$ 和 $f(${b}) = ${b * b}$ 都在 $[0, ${answer}]$ 中，其中一个是右端点。`,
              ],
            ),
          );
        },
      ),
      {
        ...point(
          "where-the-maximum-is-attained",
          ["Where the maximum is attained", "最大值在哪里取到"],
          [
            "The maximum of a continuous function on a closed interval is attained, either at a critical point inside or at an end point. A parabola opening down peaks at its vertex only if the vertex lies in the interval.\n\nFor $f(x) = 5 - (x - 4)^{2}$ on $[0, 2]$, the vertex $x = 4$ lies outside, and $f$ is increasing on $[0, 2]$. So the maximum is at the nearer end: $f(2) = 5 - 4 = 1$.\n\nCheck: the other end gives $f(0) = 5 - 16 = -11$, which is smaller.\n\n> **Watch out.** Check where the vertex lies before using its value. If it is outside the interval, the vertex value is never reached there.",
            "闭区间上连续函数的最大值能够取到，要么在内部的临界点，要么在端点。开口向下的抛物线只有在顶点属于区间时才在顶点达到峰值。\n\n对 $[0, 2]$ 上的 $f(x) = 5 - (x - 4)^{2}$，顶点 $x = 4$ 在区间外，$f$ 在 $[0, 2]$ 上递增。所以最大值在较近的端点：$f(2) = 5 - 4 = 1$。\n\n检验：另一端给出 $f(0) = 5 - 16 = -11$，更小。\n\n> **注意。** 用顶点的值之前，先看顶点在哪里。如果它在区间外，在区间上就取不到顶点的值。",
          ],
          (rng) => {
            const h = rng.int(-10, 10);
            const k = rng.nonZero(-20, 20);
            const square = h === 0 ? "x^{2}" : `(x${plus(-h)})^{2}`;
            const a = rng.int(-12, 8);
            const b = a + rng.int(1, 8);
            const at = (x: number) => k - (x - h) * (x - h);
            const inside = h >= a && h <= b;
            const best = inside ? k : Math.max(at(a), at(b));
            return solved(
              [
                `What is the maximum value of $f(x) = ${k} - ${square}$ on $[${a}, ${b}]$?`,
                `$f(x) = ${k} - ${square}$ 在 $[${a}, ${b}]$ 上的最大值是多少？`,
              ],
              best,
              [
                k === best
                  ? why(
                      k + 1,
                      `That is above the vertex value $${k}$, the largest value $f$ ever takes.`,
                      `这比顶点的值 $${k}$ 还大，而 $${k}$ 是 $f$ 能取到的最大值。`,
                    )
                  : why(
                      k,
                      `That is the vertex value, but the vertex $x = ${h}$ lies outside $[${a}, ${b}]$.`,
                      `这是顶点的值，但顶点 $x = ${h}$ 不在 $[${a}, ${b}]$ 中。`,
                    ),
                why(
                  Math.min(at(a), at(b)),
                  "That is the smaller of the two end values, not the largest value.",
                  "这是两个端点值中较小的那个，不是最大值。",
                ),
                why(
                  at(a) + at(b),
                  "That adds the two end values; the maximum is a single value of $f$.",
                  "这把两个端点值相加；最大值是 $f$ 的一个值。",
                ),
              ],
              solution(
                [
                  [
                    ["Locate the vertex", "确定顶点"],
                    inside
                      ? [`The vertex is at $x = ${h}$, which lies in $[${a}, ${b}]$.`, `顶点在 $x = ${h}$ 处，它在 $[${a}, ${b}]$ 中。`]
                      : [
                          `The vertex is at $x = ${h}$, outside $[${a}, ${b}]$, so $f$ is monotone on the interval.`,
                          `顶点在 $x = ${h}$ 处，不在 $[${a}, ${b}]$ 中，所以 $f$ 在区间上单调。`,
                        ],
                  ],
                  [
                    ["Compare the candidates", "比较候选值"],
                    inside
                      ? [
                          `The squared term is $0$ at the vertex and positive elsewhere, so the maximum is $f(${h}) = ${k}$.`,
                          `平方项在顶点处为 $0$，在别处为正，所以最大值是 $f(${h}) = ${k}$。`,
                        ]
                      : [
                          `$f(${a}) = ${at(a)}$ and $f(${b}) = ${at(b)}$, so the maximum is $${best}$, at the end nearer the vertex.`,
                          `$f(${a}) = ${at(a)}$，$f(${b}) = ${at(b)}$，所以最大值是 $${best}$，在离顶点较近的端点取到。`,
                        ],
                  ],
                ],
                [
                  `The end values $${at(a)}$ and $${at(b)}$ are both at most $${best}$, and $${best}$ is attained.`,
                  `端点值 $${at(a)}$ 和 $${at(b)}$ 都不超过 $${best}$，而 $${best}$ 能取到。`,
                ],
              ),
            );
          },
        ),
        figure: analysisDrawings1["continuous-images-of-compact-sets#where-the-maximum-is-attained"],
      },
      point(
        "when-the-conclusion-fails",
        ["When the conclusion fails", "结论何时不成立"],
        [
          "Both hypotheses matter. On a set that is not closed a continuous function can blow up near a missing point, and on a set that is not bounded it can grow forever or approach a value it never reaches.\n\nOn $(0, 1]$, $f(x) = \\frac{1}{x}$ takes the value $10$ at $\\frac{1}{10}$ and $1000$ at $\\frac{1}{1000}$, so it has no maximum. On the closed interval $[1, 2]$, the same function attains its maximum $1$ at $x = 1$.\n\nCheck: on $[0, 1)$, $f(x) = x$ approaches $1$ but never reaches it, so it has no maximum either.\n\n> **Watch out.** A missing end point causes trouble only when the function grows or climbs toward it. Check what happens near the missing point.",
          "两个条件都很重要。在不闭的集合上，连续函数可能在缺失点附近爆炸；在无界的集合上，它可能无限增长，或趋近一个永远取不到的值。\n\n在 $(0, 1]$ 上，$f(x) = \\frac{1}{x}$ 在 $\\frac{1}{10}$ 处取值 $10$，在 $\\frac{1}{1000}$ 处取值 $1000$，所以没有最大值。在闭区间 $[1, 2]$ 上，同一个函数在 $x = 1$ 处取到最大值 $1$。\n\n检验：在 $[0, 1)$ 上，$f(x) = x$ 趋近 $1$ 但永远取不到，所以也没有最大值。\n\n> **注意。** 缺失的端点只有在函数朝它增长或攀升时才造成麻烦。要看缺失点附近发生什么。",
        ],
        (rng) => {
          const a = rng.int(1, 20);
          const b = a + rng.int(1, 20);
          const blowUp = `f(x) = \\frac{1}{x - ${a}} \\text{ on } (${a}, ${b}]`;
          const recip = `f(x) = \\frac{1}{x} \\text{ on } [${a}, ${b}]`;
          const square = `f(x) = x^{2} \\text{ on } [${a}, ${b}]`;
          const fall = `f(x) = ${b} - x \\text{ on } [${a}, ${b}]`;
          return reasoned(
            choose(
              rng,
              [`Which function fails to attain a maximum on the given set?`, `哪个函数在给定集合上取不到最大值？`],
              same(blowUp),
              [same(recip), same(square), same(fall)],
              asPair(
                solution(
                  [
                    [
                      ["Check the hypotheses", "检查条件"],
                      [
                        `Three of the functions are continuous on the closed bounded interval $[${a}, ${b}]$, so each attains a maximum.`,
                        `其中三个函数在闭有界区间 $[${a}, ${b}]$ 上连续，所以都能取到最大值。`,
                      ],
                    ],
                    [
                      ["Look at the missing point", "看缺失的点"],
                      [
                        `On $(${a}, ${b}]$ the point $${a}$ is missing, and $\\frac{1}{x - ${a}}$ grows without bound as $x$ approaches it, so there is no maximum.`,
                        `在 $(${a}, ${b}]$ 上缺少点 $${a}$，当 $x$ 趋近它时 $\\frac{1}{x - ${a}}$ 无界增大，所以没有最大值。`,
                      ],
                    ],
                  ],
                  [
                    `At $x = ${a} + \\frac{1}{1000}$ the value is $1000$, and at $x = ${a} + \\frac{1}{10^{6}}$ it is $10^{6}$, so no value is the largest.`,
                    `在 $x = ${a} + \\frac{1}{1000}$ 处函数值是 $1000$，在 $x = ${a} + \\frac{1}{10^{6}}$ 处是 $10^{6}$，所以没有最大的值。`,
                  ],
                ),
              ),
            ),
            [
              reason(
                recip,
                `It is continuous on a closed bounded interval and attains its maximum $${Q.of(1, a).toLatex()}$ at $x = ${a}$.`,
                `它在闭有界区间上连续，在 $x = ${a}$ 处取到最大值 $${Q.of(1, a).toLatex()}$。`,
              ),
              reason(square, `It attains its maximum $${b * b}$ at $x = ${b}$.`, `它在 $x = ${b}$ 处取到最大值 $${b * b}$。`),
              reason(fall, `It attains its maximum $${b - a}$ at $x = ${a}$.`, `它在 $x = ${a}$ 处取到最大值 $${b - a}$。`),
            ],
          );
        },
      ),
    ],
  ),
  intro: t(
    "Take $f(x) = x^{2}$ on the closed interval $[-1, 2]$. Its least value is $0$, at $x = 0$, and its greatest is $4$, at $x = 2$, so the image is the closed interval $[0, 4]$.\n\nCheck: the other end gives $f(-1) = 1$, which lies inside $[0, 4]$.\n\nIn this lesson we find the image of a closed interval, locate where a maximum is attained, and see how the conclusion fails on sets that are not closed or not bounded.",
    "取闭区间 $[-1, 2]$ 上的 $f(x) = x^{2}$。它的最小值是 $0$，在 $x = 0$ 处取到；最大值是 $4$，在 $x = 2$ 处取到，所以像是闭区间 $[0, 4]$。\n\n检验：另一端给出 $f(-1) = 1$，它在 $[0, 4]$ 之内。\n\n本课我们求闭区间的像，确定最大值在哪里取到，并看清在不闭或无界的集合上结论如何不成立。",
  ),
};

const monotoneJumps = {
  ...topic(
    "monotone-functions-and-their-jumps",
    ["Monotone Functions and Their Jumps", "单调函数及其跳跃"],
    ["Show that monotone functions can only jump, and bound how many jumps there are.", "说明单调函数只能发生跳跃，并估计跳跃的个数。"],
    ["kinds-of-discontinuities"],
    [],
    [
      point(
        "the-size-of-a-jump",
        ["The size of a jump", "跳跃的大小"],
        [
          "A monotone function has one-sided limits at every point, so its only possible discontinuities are jumps. The size of a jump is the difference between the limit from the right and the limit from the left.\n\nLet $f(x) = 2x + 1$ for $x < 3$ and $f(x) = 2x + 5$ for $x \\ge 3$. The limit from the left at $3$ is $7$ and the limit from the right is $11$, so the jump is $11 - 7 = 4$.\n\nCheck: the two pieces have the same slope, so the jump is the difference of their constants, $5 - 1 = 4$.\n\n> **Watch out.** The size of a jump is a difference of one-sided limits, not the value of $f$ at the point.",
          "单调函数在每点都有单侧极限，所以它唯一可能的间断是跳跃。跳跃的大小是右极限与左极限之差。\n\n设 $x < 3$ 时 $f(x) = 2x + 1$，$x \\ge 3$ 时 $f(x) = 2x + 5$。在 $3$ 处左极限是 $7$，右极限是 $11$，所以跳跃是 $11 - 7 = 4$。\n\n检验：两段的斜率相同，所以跳跃就是常数项之差 $5 - 1 = 4$。\n\n> **注意。** 跳跃的大小是单侧极限之差，不是 $f$ 在该点的值。",
        ],
        (rng) => {
          const m = rng.int(2, 9);
          const c = rng.int(-20, 20);
          const j = rng.int(1, 25);
          const p = rng.int(-8, 8);
          const left = m * p + c;
          const shown = p < 0 ? `(${p})` : `${p}`;
          return solved(
            [
              `$f(x) = ${m}x${plus(c)}$ for $x < ${p}$, and $f(x) = ${m}x${plus(c + j)}$ for $x \\ge ${p}$. What is the size of the jump of $f$ at ${p}?`,
              `当 $x < ${p}$ 时 $f(x) = ${m}x${plus(c)}$，当 $x \\ge ${p}$ 时 $f(x) = ${m}x${plus(c + j)}$。$f$ 在 ${p} 处的跳跃是多少？`,
            ],
            j,
            [
              why(
                c + j,
                "That is the constant of the right piece, not the difference of the limits.",
                "这是右边一段的常数项，不是两个极限之差。",
              ),
              why(
                m * p + c + j,
                `That is the value $f(${p})$, the limit from the right, not the size of the jump.`,
                `这是函数值 $f(${p})$，即右极限，不是跳跃的大小。`,
              ),
              why(
                j + m,
                "That adds the slope; both pieces have the same slope, which cancels.",
                "这加上了斜率；两段斜率相同，相减时抵消。",
              ),
            ],
            solution(
              [
                [
                  ["Find the one-sided limits", "求单侧极限"],
                  [
                    `From the left the limit is $${m} \\times ${shown}${plus(c)} = ${left}$, and from the right it is $${m} \\times ${shown}${plus(c + j)} = ${left + j}$.`,
                    `左极限是 $${m} \\times ${shown}${plus(c)} = ${left}$，右极限是 $${m} \\times ${shown}${plus(c + j)} = ${left + j}$。`,
                  ],
                ],
                [
                  ["Subtract", "相减"],
                  [`The jump is $${minus(left + j, left)} = ${j}$.`, `跳跃是 $${minus(left + j, left)} = ${j}$。`],
                ],
              ],
              [
                `The slopes agree, so the jump is also the difference of the constants, $${minus(c + j, c)} = ${j}$.`,
                `两段斜率相同，所以跳跃也等于常数项之差 $${minus(c + j, c)} = ${j}$。`,
              ],
            ),
          );
        },
      ),
      point(
        "how-many-large-jumps",
        ["How many large jumps", "有多少个大跳跃"],
        [
          "The jumps of an increasing function all fit inside its total rise. So at most the rise divided by the size can be that large, and this counting is what proves that the discontinuities are countable.\n\nIf an increasing function rises by $20$ in all, it has at most $3$ jumps of size at least $6$, because $4$ such jumps would already rise by $24$.\n\nCheck: $3$ jumps of size $6$ rise by $18 \\le 20$, so $3$ is possible.\n\n> **Watch out.** Round the quotient down. A part of a jump does not count as a jump.",
          "增函数的所有跳跃都包含在它的总增量内。所以这样大的跳跃至多有总增量除以大小那么多个，这个计数证明了间断点可数。\n\n如果一个增函数总共上升 $20$，它大小至少为 $6$ 的跳跃至多有 $3$ 个，因为 $4$ 个这样的跳跃就已经上升 $24$。\n\n检验：$3$ 个大小为 $6$ 的跳跃上升 $18 \\le 20$，所以 $3$ 个是可能的。\n\n> **注意。** 商要向下取整。跳跃的一部分不算一个跳跃。",
        ],
        (rng) => {
          const s = rng.int(2, 9);
          const rise = rng.int(10, 200);
          const m = rng.int(1, 3);
          const answer = Math.floor(rise / s);
          const over = Math.ceil(rise / s) === answer ? rise / s + 1 : Math.ceil(rise / s);
          return solved(
            [
              `$f$ is increasing on $[0, ${m}]$, with $f(${m}) - f(0) = ${rise}$. What is the greatest possible number of jumps of size at least ${s}?`,
              `$f$ 在 $[0, ${m}]$ 上递增，$f(${m}) - f(0) = ${rise}$。大小至少为 ${s} 的跳跃最多有多少个？`,
            ],
            answer,
            [
              why(
                over,
                `That many jumps of size ${s} would rise by $${over * s}$, more than $${rise}$.`,
                `这么多个大小为 ${s} 的跳跃会上升 $${over * s}$，超过 $${rise}$。`,
              ),
              why(rise, "That is the total rise, not a number of jumps.", "这是总增量，不是跳跃的个数。"),
              why(s, "That is the size of each jump, not how many there can be.", "这是每个跳跃的大小，不是跳跃能有多少个。"),
            ],
            solution(
              [
                [
                  ["Compare with the rise", "与总增量比较"],
                  [
                    `$N$ jumps of size at least ${s} rise by at least $${s}N$, and this cannot exceed $${rise}$, so $N \\le \\frac{${rise}}{${s}}$.`,
                    `$N$ 个大小至少为 ${s} 的跳跃至少上升 $${s}N$，它不能超过 $${rise}$，所以 $N \\le \\frac{${rise}}{${s}}$。`,
                  ],
                ],
                [
                  ["Round down", "向下取整"],
                  [`$N$ is a whole number, so $N \\le ${answer}$.`, `$N$ 是整数，所以 $N \\le ${answer}$。`],
                ],
              ],
              [
                `$${answer}$ jumps of size ${s} rise by $${answer * s} \\le ${rise}$, so this many is possible, while $${answer + 1}$ would need $${(answer + 1) * s}$.`,
                `$${answer}$ 个大小为 ${s} 的跳跃上升 $${answer * s} \\le ${rise}$，所以这么多个是可能的，而 $${answer + 1}$ 个需要 $${(answer + 1) * s}$。`,
              ],
            ),
          );
        },
      ),
      point(
        "jumps-of-a-floor-function",
        ["Jumps of a floor function", "取整函数的跳跃"],
        [
          "The function that rounds $kx$ down to a whole number is increasing, and it jumps by 1 whenever $kx$ reaches an integer. So on an interval, count the multiples of $\\frac{1}{k}$ that lie inside it.\n\nFor $\\lfloor 3x \\rfloor$ on $(0, 2)$, the jumps are at $\\frac{1}{3}, \\frac{2}{3}, 1, \\frac{4}{3}, \\frac{5}{3}$, that is $3 \\times 2 - 1 = 5$ points.\n\nCheck: the next multiple, $\\frac{6}{3} = 2$, is the right end, which the open interval leaves out.\n\n> **Watch out.** The open interval leaves out both ends, so neither $0$ nor $n$ is counted.",
          "把 $kx$ 向下取整的函数是递增的，每当 $kx$ 到达整数时跳 1。所以在一个区间上，数其中 $\\frac{1}{k}$ 的倍数有多少。\n\n对 $(0, 2)$ 上的 $\\lfloor 3x \\rfloor$，跳跃在 $\\frac{1}{3}, \\frac{2}{3}, 1, \\frac{4}{3}, \\frac{5}{3}$ 处，即 $3 \\times 2 - 1 = 5$ 个点。\n\n检验：下一个倍数 $\\frac{6}{3} = 2$ 是右端点，开区间不含它。\n\n> **注意。** 开区间不含两个端点，所以 $0$ 和 $n$ 都不计入。",
        ],
        (rng) => {
          const k = rng.int(2, 12);
          const n = rng.int(1, 12);
          return solved(
            [
              `At how many points of the open interval $(0, ${n})$ is $f(x) = \\lfloor ${k}x \\rfloor$ discontinuous?`,
              `$f(x) = \\lfloor ${k}x \\rfloor$ 在开区间 $(0, ${n})$ 中有多少个间断点？`,
            ],
            k * n - 1,
            [
              why(
                k * n,
                `That counts $x = ${n}$, the right end, which the open interval leaves out.`,
                `这数了右端点 $x = ${n}$，而开区间不含它。`,
              ),
              why(
                k * n + 1,
                `That counts both ends, $0$ and $${n}$, which the open interval leaves out.`,
                `这数了两个端点 $0$ 和 $${n}$，而开区间不含它们。`,
              ),
              why(
                n,
                `That counts only the integers; the function also jumps at the multiples of $\\frac{1}{${k}}$.`,
                `这只数了整数；函数在 $\\frac{1}{${k}}$ 的倍数处都跳跃。`,
              ),
            ],
            solution(
              [
                [
                  ["Find the jumps", "找出跳跃"],
                  [
                    `$\\lfloor ${k}x \\rfloor$ jumps exactly where $${k}x$ is an integer $j$, that is at $x = \\frac{j}{${k}}$.`,
                    `$\\lfloor ${k}x \\rfloor$ 恰在 $${k}x$ 为整数 $j$ 时跳跃，即在 $x = \\frac{j}{${k}}$ 处。`,
                  ],
                ],
                [
                  ["Count those inside", "数内部的"],
                  [
                    `$0 < \\frac{j}{${k}} < ${n}$ means $1 \\le j \\le ${k * n - 1}$, which gives $${k * n - 1}$ points.`,
                    `$0 < \\frac{j}{${k}} < ${n}$ 即 $1 \\le j \\le ${k * n - 1}$，共 $${k * n - 1}$ 个点。`,
                  ],
                ],
              ],
              [
                `$j = 0$ gives $x = 0$ and $j = ${k * n}$ gives $x = ${n}$, the two ends left out, so $${k * n + 1} - 2 = ${k * n - 1}$.`,
                `$j = 0$ 给出 $x = 0$，$j = ${k * n}$ 给出 $x = ${n}$，这两个端点不算，所以是 $${k * n + 1} - 2 = ${k * n - 1}$。`,
              ],
            ),
          );
        },
      ),
    ],
  ),
  intro: t(
    "The floor function $\\lfloor x \\rfloor$ is increasing on $[0, 3]$. It is continuous except at $1$, $2$ and $3$, where it jumps by $1$ each time, from the limit on the left to the limit on the right.\n\nCheck: the jumps add up to $3$, which is the total rise $\\lfloor 3 \\rfloor - \\lfloor 0 \\rfloor = 3$.\n\nIn this lesson we measure a jump by its one-sided limits, bound how many large jumps a monotone function can have, and count the jumps of a floor function.",
    "取整函数 $\\lfloor x \\rfloor$ 在 $[0, 3]$ 上递增。它除了在 $1$、$2$、$3$ 处以外都连续，在这些点处每次从左极限跳到右极限，跳 $1$。\n\n检验：跳跃之和是 $3$，正是总增量 $\\lfloor 3 \\rfloor - \\lfloor 0 \\rfloor = 3$。\n\n本课我们用单侧极限度量跳跃，估计单调函数大跳跃的个数，并数出取整函数的跳跃。",
  ),
};

const boundedVariation = {
  ...topic(
    "functions-of-bounded-variation",
    ["Functions of Bounded Variation", "有界变差函数"],
    ["Measure the total up and down movement of a function.", "测量函数上下运动的总量。"],
    ["monotone-functions-and-their-jumps"],
    [],
    [
      point(
        "variation-over-a-partition",
        ["Variation over a partition", "分割上的变差"],
        [
          "The variation over a partition adds the sizes of the changes between neighboring points, so a fall counts as much as a rise. Finer partitions can only increase this sum, and its supremum is the total variation.\n\nIf a function takes the values $1, 4, -2, 3$ at successive points, the changes are $3, -6, 5$, and their sizes add to $3 + 6 + 5 = 14$.\n\nCheck: the net change is only $3 - 1 = 2$, because the fall of $6$ cancels most of the rises; the variation counts it instead.\n\n> **Watch out.** Add the sizes of the changes, not the changes themselves and not the values.",
          "分割上的变差把相邻点之间变化的绝对值相加，所以下降和上升一样计入。分割越细，和只会增大，它的上确界就是全变差。\n\n如果函数在相继各点取值 $1, 4, -2, 3$，变化是 $3, -6, 5$，它们的绝对值之和是 $3 + 6 + 5 = 14$。\n\n检验：净变化只有 $3 - 1 = 2$，因为下降的 $6$ 抵消了大部分上升；变差则把它计入。\n\n> **注意。** 要把变化的绝对值相加，而不是变化本身，也不是函数值。",
        ],
        (rng) => {
          const n = rng.int(4, 6);
          const values = Array.from({ length: n }, () => rng.int(-15, 15));
          const v = values.slice(1).reduce((s, x, i) => s + Math.abs(x - (values[i] as number)), 0);
          const net = (values[n - 1] as number) - (values[0] as number);
          const changes = values.slice(1).map((x, i) => x - (values[i] as number));
          return solved(
            [
              `A function takes the values $${values.join(", ")}$ at the successive points of a partition. What is its variation over this partition?`,
              `函数在分割的相继各点上取值 $${values.join(", ")}$。它在这个分割上的变差是多少？`,
            ],
            v,
            [
              why(
                Math.abs(net),
                "That is only the size of the net change; rises and falls in between cancel there.",
                "这只是净变化的绝对值；中间的上升和下降在那里相互抵消。",
              ),
              why(v + 1, "That is one too many; recheck the size of each change.", "这多了一；重新检查每次变化的绝对值。"),
              why(
                values.reduce((s, x) => s + Math.abs(x), 0),
                "That adds the sizes of the values, not of the changes between them.",
                "这把函数值的绝对值相加，而不是它们之间变化的绝对值。",
              ),
            ],
            solution(
              [
                [
                  ["List the changes", "列出变化"],
                  [`The ${n - 1} changes are $${changes.join(", ")}$.`, `${n - 1} 次变化是 $${changes.join(", ")}$。`],
                ],
                [
                  ["Add their sizes", "把绝对值相加"],
                  [`$${changes.map((x) => Math.abs(x)).join(" + ")} = ${v}$.`, `$${changes.map((x) => Math.abs(x)).join(" + ")} = ${v}$。`],
                ],
              ],
              [
                `The variation $${v}$ is at least the size of the net change, $${Math.abs(net)}$, and it equals it only when the values move in one direction.`,
                `变差 $${v}$ 至少是净变化的绝对值 $${Math.abs(net)}$，只有当函数值朝一个方向变化时两者才相等。`,
              ],
            ),
          );
        },
      ),
      {
        ...point(
          "total-variation-of-a-piecewise-monotone-function",
          ["Total variation of a piecewise monotone function", "分段单调函数的全变差"],
          [
            "On a piece where a function is monotone, the variation is just the size of the net change. So split the interval at each turning point, and add the sizes of the changes over the pieces.\n\nFor $f(x) = x^{2}$ on $[-1, 2]$, the function falls from $1$ to $0$ on $[-1, 0]$ and rises from $0$ to $4$ on $[0, 2]$. The total variation is $1 + 4 = 5$.\n\nCheck: the net change is $4 - 1 = 3$, less than $5$, because the fall is counted too.\n\n> **Watch out.** Split at the turning point. Using only the two end values gives the net change, which misses the fall.",
            "在函数单调的一段上，变差就是净变化的绝对值。所以在每个转折点分割区间，再把各段变化的绝对值相加。\n\n对 $[-1, 2]$ 上的 $f(x) = x^{2}$，函数在 $[-1, 0]$ 上从 $1$ 降到 $0$，在 $[0, 2]$ 上从 $0$ 升到 $4$。全变差是 $1 + 4 = 5$。\n\n检验：净变化是 $4 - 1 = 3$，小于 $5$，因为下降也被计入了。\n\n> **注意。** 要在转折点处分开。只用两个端点值得到的是净变化，它漏掉了下降。",
          ],
          (rng) => {
            const a = rng.int(1, 12);
            const b = rng.int(1, 12);
            const answer = a * a + b * b;
            return solved(
              [`What is the total variation of $f(x) = x^{2}$ on $[-${a}, ${b}]$?`, `$f(x) = x^{2}$ 在 $[-${a}, ${b}]$ 上的全变差是多少？`],
              answer,
              [
                why(
                  Math.abs(b * b - a * a) + 1,
                  "That is close to the net change between the ends, which ignores the fall to $0$ before the rise.",
                  "这接近两端之间的净变化，忽略了上升之前降到 $0$ 的那一段。",
                ),
                why(
                  (a + b) ** 2,
                  "That squares the length of the interval; the variation adds the fall and the rise.",
                  "这是把区间长度平方；变差是下降与上升之和。",
                ),
                why(a + b, "That is the length of the interval, not the movement of $f$.", "这是区间的长度，不是 $f$ 的运动量。"),
              ],
              solution(
                [
                  [
                    ["Split at the turning point", "在转折点分开"],
                    [
                      `$x^{2}$ decreases on $[-${a}, 0]$, from $${a * a}$ to $0$, and increases on $[0, ${b}]$, from $0$ to $${b * b}$.`,
                      `$x^{2}$ 在 $[-${a}, 0]$ 上从 $${a * a}$ 减到 $0$，在 $[0, ${b}]$ 上从 $0$ 增到 $${b * b}$。`,
                    ],
                  ],
                  [
                    ["Add the pieces", "各段相加"],
                    [`The total variation is $${a * a} + ${b * b} = ${answer}$.`, `全变差是 $${a * a} + ${b * b} = ${answer}$。`],
                  ],
                ],
                [
                  `The partition $-${a}, 0, ${b}$ already gives $${a * a} + ${b * b} = ${answer}$, and refining a monotone piece adds nothing more.`,
                  `分割 $-${a}, 0, ${b}$ 已经给出 $${a * a} + ${b * b} = ${answer}$，而细分单调的一段不会再增加什么。`,
                ],
              ),
            );
          },
        ),
        figure: analysisDrawings1["functions-of-bounded-variation#total-variation-of-a-piecewise-monotone-function"],
      },
      point(
        "variation-of-an-oscillating-function",
        ["Variation of an oscillating function", "振荡函数的变差"],
        [
          "A sine wave of amplitude $A$ moves up or down by $A$ between its zeros and peaks, so every half period contributes $2A$. A function that oscillates ever faster with fixed amplitude has infinite variation.\n\nFor $3 \\sin x$ on $[0, 2\\pi]$, the function rises by $3$, falls by $6$ and rises by $3$, a total of $12 = 2 \\times 3 \\times 2$.\n\nCheck: the net change is $3 \\sin 2\\pi - 3 \\sin 0 = 0$, while the variation counts every rise and fall.\n\n> **Watch out.** $[0, k\\pi]$ holds $k$ half periods, and each one goes up $A$ and back down $A$, giving $2A$, not $A$ and not $4A$.",
          "振幅为 $A$ 的正弦波在零点和峰值之间上下移动 $A$，所以每半个周期贡献 $2A$。振幅固定而振荡越来越快的函数，全变差是无穷。\n\n对 $[0, 2\\pi]$ 上的 $3 \\sin x$，函数上升 $3$，下降 $6$，再上升 $3$，共 $12 = 2 \\times 3 \\times 2$。\n\n检验：净变化是 $3 \\sin 2\\pi - 3 \\sin 0 = 0$，而变差把每次上升和下降都计入。\n\n> **注意。** $[0, k\\pi]$ 含有 $k$ 个半周期，每个半周期上升 $A$ 再下降 $A$，贡献 $2A$，不是 $A$，也不是 $4A$。",
        ],
        (rng) => {
          const amp = rng.int(1, 12);
          const k = rng.int(1, 15);
          const answer = 2 * amp * k;
          return solved(
            [
              `What is the total variation of $f(x) = ${amp === 1 ? "" : amp}\\sin x$ on $[0, ${k === 1 ? "" : k}\\pi]$?`,
              `$f(x) = ${amp === 1 ? "" : amp}\\sin x$ 在 $[0, ${k === 1 ? "" : k}\\pi]$ 上的全变差是多少？`,
            ],
            answer,
            [
              why(
                amp * k,
                "That counts only the amplitude for each half period; each goes up and back down.",
                "这每半个周期只算了一个振幅；每半个周期都上去再下来。",
              ),
              why(0, "That is the net change; the variation counts every rise and fall.", "这是净变化；变差把每次上升和下降都计入。"),
              why(4 * amp * k, "That counts a full period's movement for each half period.", "这把一个整周期的运动量算给了每半个周期。"),
            ],
            solution(
              [
                [
                  ["Split into half periods", "分成半周期"],
                  [
                    `$[0, ${k === 1 ? "" : k}\\pi]$ splits into $${k}$ half periods, and on each one the function moves $${amp}$ away from $0$ and $${amp}$ back.`,
                    `$[0, ${k === 1 ? "" : k}\\pi]$ 分成 $${k}$ 个半周期，在每个上函数离开 $0$ 移动 $${amp}$，再移回 $${amp}$。`,
                  ],
                ],
                [
                  ["Add the movements", "把运动量相加"],
                  [
                    `Each half period gives $2 \\times ${amp} = ${2 * amp}$, so the total is $${2 * amp} \\times ${k} = ${answer}$.`,
                    `每半个周期贡献 $2 \\times ${amp} = ${2 * amp}$，所以总量是 $${2 * amp} \\times ${k} = ${answer}$。`,
                  ],
                ],
              ],
              [
                `On $[0, \\pi]$ the function goes from $0$ up to $${amp}$ and back to $0$, a variation of $${2 * amp}$, and the other half periods repeat this.`,
                `在 $[0, \\pi]$ 上函数从 $0$ 升到 $${amp}$ 再回到 $0$，变差为 $${2 * amp}$，其余各半周期重复这一过程。`,
              ],
            ),
          );
        },
      ),
    ],
  ),
  intro: t(
    "A function takes the values $0, 3, 1$ at three successive points. It rises by $3$ and then falls by $2$, so its variation over these points is $3 + 2 = 5$, although its net change is only $1$.\n\nCheck: $|3 - 0| + |1 - 3| = 3 + 2 = 5$.\n\nIn this lesson we add the sizes of changes over a partition, split a function at its turning points, and find the variation of a sine wave.",
    "函数在三个相继的点取值 $0, 3, 1$。它先上升 $3$，再下降 $2$，所以在这些点上的变差是 $3 + 2 = 5$，虽然净变化只有 $1$。\n\n检验：$|3 - 0| + |1 - 3| = 3 + 2 = 5$。\n\n本课我们把分割上变化的绝对值相加，在转折点处分开函数，并求正弦波的变差。",
  ),
};

const stieltjes = {
  ...topic(
    "riemann-stieltjes-integrals",
    ["Riemann-Stieltjes Integrals", "黎曼-斯蒂尔杰斯积分"],
    [
      "Integrate one function against another, so that sums and integrals become one idea.",
      "把一个函数对另一个函数积分，使求和与积分成为同一个概念。",
    ],
    ["riemann-integrability", "functions-of-bounded-variation"],
    [],
    [
      point(
        "integrating-against-a-step",
        ["Integrating against a step", "对阶梯函数积分"],
        [
          "If the integrator is constant except for jumps, only the jumps contribute. So a continuous integrand is evaluated at each jump point and multiplied by the size of that jump, turning the integral into a sum.\n\nIf $\\alpha$ jumps by $2$ at $1$ and by $3$ at $2$ and is constant otherwise, then $\\int_{0}^{4} x^{2}\\, d\\alpha = 2 \\times 1 + 3 \\times 4 = 14$.\n\nCheck: on any piece without a jump, $\\alpha$ does not change, so those pieces add $0$ to every Riemann-Stieltjes sum.\n\n> **Watch out.** Pair each value with its own jump: $f(1)$ with the jump at $1$ and $f(2)$ with the jump at $2$.",
          "如果积分函数除跳跃外是常数，那么只有跳跃有贡献。所以把连续的被积函数在每个跳跃点取值，再乘跳跃大小，积分就变成求和。\n\n若 $\\alpha$ 在 $1$ 处跳 $2$，在 $2$ 处跳 $3$，其余处为常数，则 $\\int_{0}^{4} x^{2}\\, d\\alpha = 2 \\times 1 + 3 \\times 4 = 14$。\n\n检验：在没有跳跃的段上 $\\alpha$ 不变，所以这些段对每个黎曼-斯蒂尔杰斯和的贡献都是 $0$。\n\n> **注意。** 每个值要配上它自己的跳跃：$f(1)$ 配 $1$ 处的跳跃，$f(2)$ 配 $2$ 处的跳跃。",
        ],
        (rng) => {
          const c = rng.int(1, 4);
          const d = c + rng.int(1, 3);
          const j1 = rng.int(1, 9);
          const j2 = rng.int(1, 9);
          const k = rng.int(-9, 9);
          const f = (x: number) => x * x + k;
          const answer = j1 * f(c) + j2 * f(d);
          const par = (v: number) => (v < 0 ? `(${v})` : `${v}`);
          return solved(
            [
              `$\\alpha$ is constant on $[0, 8]$ except for a jump of ${j1} at ${c} and a jump of ${j2} at ${d}. Evaluate $\\int_{0}^{8} (x^{2}${plus(k)})\\, d\\alpha$.`,
              `$\\alpha$ 在 $[0, 8]$ 上除在 ${c} 处跳 ${j1}、在 ${d} 处跳 ${j2} 外都是常数。计算 $\\int_{0}^{8} (x^{2}${plus(k)})\\, d\\alpha$。`,
            ],
            answer,
            [
              why(f(c) + f(d), "That adds the two values but leaves out the sizes of the jumps.", "这把两个值相加，却漏掉了跳跃的大小。"),
              why(j1 * f(d) + j2 * f(c), "That pairs each value with the other point's jump.", "这把每个值配上了另一个点的跳跃。"),
              why(
                (j1 + j2) * f(8),
                "That evaluates the integrand at the right end, where $\\alpha$ does not jump.",
                "这在右端点处求被积函数的值，而 $\\alpha$ 在那里不跳跃。",
              ),
            ],
            solution(
              [
                [
                  ["Keep only the jumps", "只保留跳跃"],
                  [
                    `$\\alpha$ changes only at ${c} and ${d}, so the integral is ${j1} times $f(${c})$ plus ${j2} times $f(${d})$.`,
                    `$\\alpha$ 只在 ${c} 和 ${d} 处变化，所以积分等于 ${j1} 乘 $f(${c})$ 加 ${j2} 乘 $f(${d})$。`,
                  ],
                ],
                [
                  ["Evaluate", "求值"],
                  [
                    `$f(${c}) = ${f(c)}$ and $f(${d}) = ${f(d)}$, so the integral is $${j1} \\times ${par(f(c))} + ${j2} \\times ${par(f(d))} = ${answer}$.`,
                    `$f(${c}) = ${f(c)}$，$f(${d}) = ${f(d)}$，所以积分是 $${j1} \\times ${par(f(c))} + ${j2} \\times ${par(f(d))} = ${answer}$。`,
                  ],
                ],
              ],
              [
                `In a fine Riemann-Stieltjes sum every piece away from ${c} and ${d} has $\\Delta \\alpha = 0$, and the two pieces with jumps give values close to $${j1 * f(c)}$ and $${j2 * f(d)}$, which add to $${answer}$.`,
                `在很细的黎曼-斯蒂尔杰斯和中，远离 ${c} 和 ${d} 的每一段都有 $\\Delta \\alpha = 0$，含跳跃的两段给出接近 $${j1 * f(c)}$ 和 $${j2 * f(d)}$ 的值，相加得 $${answer}$。`,
              ],
            ),
          );
        },
      ),
      point(
        "integrating-against-a-smooth-function",
        ["Integrating against a smooth function", "对光滑函数积分"],
        [
          "If the integrator has a continuous derivative, then $d\\alpha$ can be replaced by the derivative times $dx$. This turns the problem into an ordinary integral, computed with the usual antiderivative.\n\nFor $\\int_{0}^{1} x\\, d(x^{2})$, replace $d(x^{2})$ by $2x\\, dx$: the integral becomes $\\int_{0}^{1} 2x^{2}\\, dx = \\frac{2}{3}$.\n\nCheck: the antiderivative $\\frac{2x^{3}}{3}$ has derivative $2x^{2}$, which is the integrand $x$ times $2x$.\n\n> **Watch out.** The factor $2x$ does two things: it doubles the integrand and raises its power by one. Keep both.",
          "如果积分函数有连续导数，就可以把 $d\\alpha$ 换成导数乘 $dx$。这样问题变成普通积分，用通常的原函数计算。\n\n对 $\\int_{0}^{1} x\\, d(x^{2})$，把 $d(x^{2})$ 换成 $2x\\, dx$：积分变成 $\\int_{0}^{1} 2x^{2}\\, dx = \\frac{2}{3}$。\n\n检验：原函数 $\\frac{2x^{3}}{3}$ 的导数是 $2x^{2}$，正是被积函数 $x$ 乘 $2x$。\n\n> **注意。** 因子 $2x$ 起两个作用：把被积函数加倍，并把它的幂次升高一。两者都要保留。",
        ],
        (rng) => {
          const b = rng.int(1, 6);
          const m = rng.int(1, 5);
          const answer = Q.of(2 * b ** (m + 2), m + 2);
          return solved(
            [`Evaluate $\\int_{0}^{${b}} x^{${m}}\\, d(x^{2})$.`, `计算 $\\int_{0}^{${b}} x^{${m}}\\, d(x^{2})$。`],
            answer,
            [
              why(
                Q.of(b ** (m + 1), m + 1),
                "That integrates against $dx$, ignoring the integrator $x^{2}$.",
                "这是对 $dx$ 积分，忽略了积分函数 $x^{2}$。",
              ),
              why(
                Q.of(b ** (m + 2), m + 2),
                "That drops the factor $2$ in $d(x^{2}) = 2x\\, dx$.",
                "这丢掉了 $d(x^{2}) = 2x\\, dx$ 中的因子 $2$。",
              ),
              why(
                Q.of(2 * b ** (m + 1), m + 1),
                "That keeps the $2$ but forgets that the factor $x$ raises the power by one.",
                "这保留了 $2$，却忘了因子 $x$ 把幂次升高一。",
              ),
            ],
            solution(
              [
                [
                  ["Replace the integrator", "替换积分函数"],
                  [
                    `$x^{2}$ has the continuous derivative $2x$, so the integral is $\\int_{0}^{${b}} 2x^{${m + 1}}\\, dx$.`,
                    `$x^{2}$ 有连续导数 $2x$，所以积分是 $\\int_{0}^{${b}} 2x^{${m + 1}}\\, dx$。`,
                  ],
                ],
                [
                  ["Integrate", "积分"],
                  [
                    `An antiderivative is $\\frac{2x^{${m + 2}}}{${m + 2}}$, so the value is $\\frac{2 \\times ${b}^{${m + 2}}}{${m + 2}} = ${answer.toLatex()}$.`,
                    `一个原函数是 $\\frac{2x^{${m + 2}}}{${m + 2}}$，所以值是 $\\frac{2 \\times ${b}^{${m + 2}}}{${m + 2}} = ${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `The derivative of $\\frac{2x^{${m + 2}}}{${m + 2}}$ is $2x^{${m + 1}}$, which is the integrand times $2x$, as required.`,
                `$\\frac{2x^{${m + 2}}}{${m + 2}}$ 的导数是 $2x^{${m + 1}}$，正是被积函数乘 $2x$，符合要求。`,
              ],
            ),
          );
        },
      ),
      point(
        "a-sum-as-a-stieltjes-integral",
        ["A sum as a Stieltjes integral", "把和写成斯蒂尔杰斯积分"],
        [
          "The floor function jumps by 1 at each whole number, so integrating against it adds the values of the integrand at those whole numbers. This is why a single theory can cover both sums and integrals.\n\nFor $\\int_{0}^{3 + \\frac{1}{2}} (2x + 1)\\, d\\lfloor x \\rfloor$, the jumps are at $1, 2, 3$, so the integral is $3 + 5 + 7 = 15$.\n\nCheck: the values $3, 5, 7$ go up evenly, so their sum is $3 \\times \\frac{3 + 7}{2} = 15$.\n\n> **Watch out.** The jump at the last whole number lies inside the interval and counts, while the left end $0$ brings no jump.",
          "取整函数在每个整数处跳 1，所以对它积分就是把被积函数在这些整数处的值相加。这正是一个理论能同时包含求和与积分的原因。\n\n对 $\\int_{0}^{3 + \\frac{1}{2}} (2x + 1)\\, d\\lfloor x \\rfloor$，跳跃在 $1, 2, 3$ 处，所以积分是 $3 + 5 + 7 = 15$。\n\n检验：值 $3, 5, 7$ 均匀增加，所以它们的和是 $3 \\times \\frac{3 + 7}{2} = 15$。\n\n> **注意。** 最后一个整数处的跳跃在区间内，要计入；而左端点 $0$ 不带来跳跃。",
        ],
        (rng) => {
          const n = rng.int(2, 12);
          const a = rng.int(2, 9);
          const b = rng.int(-9, 9);
          const sum = (a * n * (n + 1)) / 2 + b * n;
          return solved(
            [
              `Evaluate $\\int_{0}^{${n} + \\frac{1}{2}} (${a}x${plus(b)})\\, d\\lfloor x \\rfloor$.`,
              `计算 $\\int_{0}^{${n} + \\frac{1}{2}} (${a}x${plus(b)})\\, d\\lfloor x \\rfloor$。`,
            ],
            sum,
            [
              why(
                sum + b,
                "That adds a value at $0$, where the floor function does not jump inside the interval.",
                "这加上了 $0$ 处的值，而取整函数在区间内的 $0$ 处没有跳跃。",
              ),
              why(
                (a * n * (n - 1)) / 2 + b * n,
                `That misses the jump at ${n}, which lies inside the interval.`,
                `这漏掉了 ${n} 处的跳跃，而它在区间内。`,
              ),
              why(
                Math.floor((a * n * n) / 2) + b * n,
                "That is close to the ordinary integral against $dx$, not the sum over the jumps.",
                "这接近对 $dx$ 的普通积分，而不是对跳跃求和。",
              ),
            ],
            solution(
              [
                [
                  ["Find the jumps", "找出跳跃"],
                  [
                    `$\\lfloor x \\rfloor$ jumps by $1$ at $1, 2, \\dots, ${n}$ inside the interval, so the integral is the sum of $${a}k${plus(b)}$ for $k = 1$ to ${n}.`,
                    `$\\lfloor x \\rfloor$ 在区间内的 $1, 2, \\dots, ${n}$ 处各跳 $1$，所以积分是 $k = 1$ 到 ${n} 时 $${a}k${plus(b)}$ 的和。`,
                  ],
                ],
                [
                  ["Add the values", "把值相加"],
                  [
                    `$1 + 2 + \\dots + ${n} = ${(n * (n + 1)) / 2}$, so the sum is $${a} \\times ${(n * (n + 1)) / 2}${plus(b * n)} = ${sum}$.`,
                    `$1 + 2 + \\dots + ${n} = ${(n * (n + 1)) / 2}$，所以和是 $${a} \\times ${(n * (n + 1)) / 2}${plus(b * n)} = ${sum}$。`,
                  ],
                ],
              ],
              [
                `The values go up evenly from $${a + b}$ to $${a * n + b}$, so their sum is $${n}$ times their average, $\\frac{${n} \\times ${(2 * sum) / n}}{2} = ${sum}$.`,
                `这些值从 $${a + b}$ 均匀增加到 $${a * n + b}$，所以它们的和是 $${n}$ 乘平均值，$\\frac{${n} \\times ${(2 * sum) / n}}{2} = ${sum}$。`,
              ],
            ),
          );
        },
      ),
    ],
  ),
  intro: t(
    "Let $\\alpha$ be $0$ before $2$ and $5$ from $2$ on. Against this $\\alpha$, the integral of a continuous $f$ is $5 f(2)$, so $\\int_{0}^{3} x^{2}\\, d\\alpha = 5 \\times 4 = 20$.\n\nCheck: the only change in $\\alpha$ is the jump of $5$ at $2$, where $x^{2} = 4$.\n\nIn this lesson we integrate against a step function, against a smooth function, and against the floor function, which turns a sum into an integral.",
    "设 $\\alpha$ 在 $2$ 之前为 $0$，从 $2$ 起为 $5$。对这个 $\\alpha$，连续函数 $f$ 的积分是 $5 f(2)$，所以 $\\int_{0}^{3} x^{2}\\, d\\alpha = 5 \\times 4 = 20$。\n\n检验：$\\alpha$ 唯一的变化是 $2$ 处的跳跃 $5$，而那里 $x^{2} = 4$。\n\n本课我们对阶梯函数、光滑函数和取整函数积分，最后一种把求和变成积分。",
  ),
};

const improperAnalysis = {
  ...topic(
    "convergence-of-improper-integrals",
    ["Convergence of Improper Integrals", "反常积分的收敛"],
    ["Decide convergence by comparison, without finding an antiderivative.", "不求原函数，用比较判断收敛。"],
    ["riemann-integrability", "improper-integrals-of-the-second-kind"],
    [],
    [
      point(
        "the-value-of-a-p-integral",
        ["The value of a p-integral", "p 积分的值"],
        [
          "The integral of $x^{-p}$ from 1 to infinity converges exactly when $p$ exceeds 1, and its value is then $\\frac{1}{p - 1}$. These integrals are the standard against which others are compared.\n\nFor $p = \\frac{3}{2}$, $p - 1 = \\frac{1}{2}$, so $\\int_{1}^{\\infty} x^{-3/2}\\, dx = 2$.\n\nCheck: $\\int_{1}^{N} x^{-3/2}\\, dx = 2 - \\frac{2}{\\sqrt{N}}$, which tends to $2$.\n\n> **Watch out.** The value is the reciprocal of $p - 1$, not $p - 1$ itself and not $\\frac{p}{p - 1}$.",
          "$x^{-p}$ 从 1 到无穷的积分当且仅当 $p$ 大于 1 时收敛，这时它的值是 $\\frac{1}{p - 1}$。这些积分是用来比较的标准。\n\n对 $p = \\frac{3}{2}$，$p - 1 = \\frac{1}{2}$，所以 $\\int_{1}^{\\infty} x^{-3/2}\\, dx = 2$。\n\n检验：$\\int_{1}^{N} x^{-3/2}\\, dx = 2 - \\frac{2}{\\sqrt{N}}$，它趋于 $2$。\n\n> **注意。** 值是 $p - 1$ 的倒数，不是 $p - 1$ 本身，也不是 $\\frac{p}{p - 1}$。",
        ],
        (rng) => {
          const q = rng.int(2, 9);
          const r = rng.int(1, 12);
          const p = Q.of(q + r, q);
          const answer = Q.of(q, r);
          return solved(
            [`Evaluate $\\int_{1}^{\\infty} x^{-${p.toLatex()}}\\, dx$.`, `计算 $\\int_{1}^{\\infty} x^{-${p.toLatex()}}\\, dx$。`],
            answer,
            [
              why(Q.of(r, q), "That is $p - 1$ itself; the value is its reciprocal.", "这是 $p - 1$ 本身；值是它的倒数。"),
              why(
                Q.of(q + r, r),
                "That is $\\frac{p}{p - 1}$; the factor $p$ does not belong.",
                "这是 $\\frac{p}{p - 1}$；不应有因子 $p$。",
              ),
              why(Q.of(q + r, q), "That is the exponent $p$, not the value of the integral.", "这是指数 $p$，不是积分的值。"),
            ],
            solution(
              [
                [
                  ["Integrate up to a finite end", "积到有限的端点"],
                  [
                    "$\\int_{1}^{N} x^{-p}\\, dx = \\frac{1 - N^{1 - p}}{p - 1}$, and $N^{1 - p} \\to 0$ because $p > 1$.",
                    "$\\int_{1}^{N} x^{-p}\\, dx = \\frac{1 - N^{1 - p}}{p - 1}$，因为 $p > 1$，所以 $N^{1 - p} \\to 0$。",
                  ],
                ],
                [
                  ["Take the reciprocal", "取倒数"],
                  [
                    `Here $p - 1 = ${Q.of(r, q).toLatex()}$, so the integral is $${answer.toLatex()}$.`,
                    `这里 $p - 1 = ${Q.of(r, q).toLatex()}$，所以积分是 $${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `Multiplying $${answer.toLatex()}$ by $p - 1 = ${Q.of(r, q).toLatex()}$ gives $1$, as $\\frac{1}{p - 1}$ should.`,
                `把 $${answer.toLatex()}$ 乘以 $p - 1 = ${Q.of(r, q).toLatex()}$ 得 $1$，与 $\\frac{1}{p - 1}$ 相符。`,
              ],
            ),
          );
        },
      ),
      point(
        "comparing-with-a-p-integral",
        ["Comparing with a p-integral", "与 p 积分比较"],
        [
          "For large $x$ a rational function behaves like its leading terms. So compare the integrand with a power of $x$, and it converges at infinity exactly when the overall power is less than $-1$.\n\nThe integrand $\\frac{x}{x^{3} + 1}$ behaves like $x^{-2}$, so its integral over $[1, \\infty)$ converges, while $\\frac{x}{x^{2} + 1}$ behaves like $x^{-1}$, and its integral diverges.\n\nCheck: $\\frac{x}{x^{3} + 1} \\le \\frac{x}{x^{3}} = \\frac{1}{x^{2}}$, and $\\int_{1}^{\\infty} \\frac{1}{x^{2}}\\, dx = 1$.\n\n> **Watch out.** The overall power is the top power minus the bottom power, and it must be strictly less than $-1$: the power $-1$ itself diverges.",
          "当 $x$ 很大时，有理函数的行为像它的首项。所以把被积函数与 $x$ 的幂比较，当总幂次小于 $-1$ 时它在无穷处才收敛。\n\n被积函数 $\\frac{x}{x^{3} + 1}$ 的行为像 $x^{-2}$，所以它在 $[1, \\infty)$ 上的积分收敛；而 $\\frac{x}{x^{2} + 1}$ 的行为像 $x^{-1}$，积分发散。\n\n检验：$\\frac{x}{x^{3} + 1} \\le \\frac{x}{x^{3}} = \\frac{1}{x^{2}}$，而 $\\int_{1}^{\\infty} \\frac{1}{x^{2}}\\, dx = 1$。\n\n> **注意。** 总幂次是分子幂次减分母幂次，它必须严格小于 $-1$：幂次 $-1$ 本身发散。",
        ],
        (rng) => {
          const k = rng.int(1, 6);
          const c = rng.int(1, 30);
          const f = (top: number, bottom: number) => `\\frac{x^{${top}}}{x^{${bottom}} + ${c}}`;
          const good = `\\int_{1}^{\\infty} ${f(k, k + 2)}\\, dx`;
          const harmonic = `\\int_{1}^{\\infty} ${f(k, k + 1)}\\, dx`;
          const flat = `\\int_{1}^{\\infty} ${f(k + 1, k + 1)}\\, dx`;
          const growing = `\\int_{1}^{\\infty} ${f(k + 2, k + 1)}\\, dx`;
          return reasoned(
            choose(
              rng,
              [`Which of these integrals over $[1, \\infty)$ converges?`, `下面哪个在 $[1, \\infty)$ 上的积分收敛？`],
              same(good),
              [same(harmonic), same(flat), same(growing)],
              asPair(
                solution(
                  [
                    [
                      ["Find each overall power", "求各自的总幂次"],
                      [
                        "For large $x$ the four integrands behave like $x^{-2}$, $x^{-1}$, $1$ and $x$, the top power minus the bottom power.",
                        "当 $x$ 很大时，四个被积函数的行为分别像 $x^{-2}$、$x^{-1}$、$1$ 和 $x$，即分子幂次减分母幂次。",
                      ],
                    ],
                    [
                      ["Compare with p-integrals", "与幂积分比较"],
                      [
                        "Only the power $-2$ is less than $-1$, so only the integrand that behaves like $x^{-2}$ has a convergent integral.",
                        "只有幂次 $-2$ 小于 $-1$，所以只有行为像 $x^{-2}$ 的被积函数积分收敛。",
                      ],
                    ],
                  ],
                  [
                    `The convergent integrand is at most its top over its leading bottom term, which is $\\frac{1}{x^{2}}$, and $\\int_{1}^{\\infty} \\frac{1}{x^{2}}\\, dx = 1$.`,
                    `收敛的被积函数不超过分子除以分母首项，即 $\\frac{1}{x^{2}}$，而 $\\int_{1}^{\\infty} \\frac{1}{x^{2}}\\, dx = 1$。`,
                  ],
                ),
              ),
            ),
            [
              reason(
                harmonic,
                "It behaves like $x^{-1}$, and the integral of $x^{-1}$ diverges.",
                "它的行为像 $x^{-1}$，而 $x^{-1}$ 的积分发散。",
              ),
              reason(flat, "It tends to $1$, so the area under it grows without bound.", "它趋于 $1$，所以它下方的面积无限增长。"),
              reason(growing, "It grows like $x$, so its integral diverges.", "它像 $x$ 一样增长，所以积分发散。"),
            ],
          );
        },
      ),
      point(
        "a-singularity-at-zero",
        ["A singularity at zero", "零处的奇点"],
        [
          "Near zero the comparison goes the other way: the integral of $x^{-p}$ from 0 to 1 converges exactly when $p$ is less than 1. Its value is then $\\frac{1}{1 - p}$.\n\nFor $p = \\frac{1}{2}$, $\\int_{0}^{1} x^{-1/2}\\, dx = \\frac{1}{1 - 1/2} = 2$.\n\nCheck: an antiderivative is $2\\sqrt{x}$, which goes from $0$ at $x = 0$ to $2$ at $x = 1$.\n\n> **Watch out.** Near zero the condition is $p < 1$, the opposite of the condition at infinity, and the value is the reciprocal of $1 - p$.",
          "在零附近比较方向相反：$x^{-p}$ 从 0 到 1 的积分当且仅当 $p$ 小于 1 时收敛。这时它的值是 $\\frac{1}{1 - p}$。\n\n对 $p = \\frac{1}{2}$，$\\int_{0}^{1} x^{-1/2}\\, dx = \\frac{1}{1 - 1/2} = 2$。\n\n检验：一个原函数是 $2\\sqrt{x}$，它在 $x = 0$ 处为 $0$，在 $x = 1$ 处为 $2$。\n\n> **注意。** 在零附近条件是 $p < 1$，与无穷处的条件相反；值是 $1 - p$ 的倒数。",
        ],
        (rng) => {
          const q = rng.int(2, 15);
          const r = rng.int(1, q - 1);
          const b = rng.int(1, 3);
          const p = Q.of(r, q);
          const answer = Q.of(b * q, q - r);
          const times = b === 1 ? "" : `${b} \\times `;
          return solved(
            [
              `Evaluate $${b === 1 ? "" : b}\\int_{0}^{1} x^{-${Q.of(r, q).toLatex()}}\\, dx$.`,
              `计算 $${b === 1 ? "" : b}\\int_{0}^{1} x^{-${Q.of(r, q).toLatex()}}\\, dx$。`,
            ],
            answer,
            [
              why(Q.of(b * q, r), "That divides by $p$ instead of by $1 - p$.", "这是除以 $p$，而不是除以 $1 - p$。"),
              why(Q.of(b * (q - r), q), "That multiplies by $1 - p$ instead of dividing by it.", "这是乘以 $1 - p$，而不是除以它。"),
              why(
                Q.of(b * r, q),
                "That multiplies by the exponent $p$; the value comes from $\\frac{1}{1 - p}$.",
                "这是乘以指数 $p$；值来自 $\\frac{1}{1 - p}$。",
              ),
            ],
            solution(
              [
                [
                  ["Find an antiderivative", "求原函数"],
                  [
                    `With $p = ${p.toLatex()}$, an antiderivative of $x^{-p}$ is $\\frac{x^{1 - p}}{1 - p}$, and $x^{1 - p} \\to 0$ as $x \\to 0$ because $p < 1$.`,
                    `取 $p = ${p.toLatex()}$，$x^{-p}$ 的一个原函数是 $\\frac{x^{1 - p}}{1 - p}$，因为 $p < 1$，当 $x \\to 0$ 时 $x^{1 - p} \\to 0$。`,
                  ],
                ],
                [
                  ["Evaluate", "求值"],
                  [
                    `$1 - p = ${Q.of(q - r, q).toLatex()}$, so the value is $${times}${Q.of(q, q - r).toLatex()} = ${answer.toLatex()}$.`,
                    `$1 - p = ${Q.of(q - r, q).toLatex()}$，所以值是 $${times}${Q.of(q, q - r).toLatex()} = ${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `Multiplying $${answer.toLatex()}$ by $1 - p = ${Q.of(q - r, q).toLatex()}$ gives back $${b}$, the constant in front.`,
                `把 $${answer.toLatex()}$ 乘以 $1 - p = ${Q.of(q - r, q).toLatex()}$，又得到前面的常数 $${b}$。`,
              ],
            ),
          );
        },
      ),
    ],
  ),
  intro: t(
    "The integral $\\int_{1}^{\\infty} x^{-2}\\, dx$ converges, because $\\int_{1}^{N} x^{-2}\\, dx = 1 - \\frac{1}{N}$ tends to $1$. Near zero the roles swap: $\\int_{0}^{1} x^{-1/2}\\, dx = 2$ converges, while $\\int_{0}^{1} x^{-2}\\, dx$ does not.\n\nCheck: $\\int_{\\varepsilon}^{1} x^{-2}\\, dx = \\frac{1}{\\varepsilon} - 1$, which grows without bound as $\\varepsilon \\to 0$.\n\nIn this lesson we evaluate p-integrals at infinity and at zero, and decide convergence by comparing with them.",
    "积分 $\\int_{1}^{\\infty} x^{-2}\\, dx$ 收敛，因为 $\\int_{1}^{N} x^{-2}\\, dx = 1 - \\frac{1}{N}$ 趋于 $1$。在零附近情形相反：$\\int_{0}^{1} x^{-1/2}\\, dx = 2$ 收敛，而 $\\int_{0}^{1} x^{-2}\\, dx$ 不收敛。\n\n检验：$\\int_{\\varepsilon}^{1} x^{-2}\\, dx = \\frac{1}{\\varepsilon} - 1$，当 $\\varepsilon \\to 0$ 时无界增大。\n\n本课我们计算无穷处和零处的幂积分，并通过与它们比较判断收敛。",
  ),
};

const dirichletAbel = {
  ...topic(
    "the-dirichlet-and-abel-tests",
    ["The Dirichlet and Abel Tests", "狄利克雷判别法和阿贝尔判别法"],
    ["Handle series that converge through cancellation by summing by parts.", "用分部求和处理靠抵消而收敛的级数。"],
    ["absolute-and-conditional-convergence-of-series"],
    [],
    [
      point(
        "bounded-partial-sums",
        ["Bounded partial sums", "有界的部分和"],
        [
          "The Dirichlet test needs the partial sums of one factor to be bounded. A repeating pattern whose values add up to zero has bounded partial sums, and the bound is found by following a single period.\n\nIf $a_k$ repeats $2, 3, -5$, the partial sums are $2, 5, 0, 2, 5, 0, \\dots$, so their largest value is $5$.\n\nCheck: each full period adds $2 + 3 - 5 = 0$, so the partial sums return to $0$ and never grow.\n\n> **Watch out.** The largest partial sum is reached after the positive run, $2 + 3$, not at a single term and not over two periods.",
          "狄利克雷判别法要求一个因子的部分和有界。各项之和为零的循环模式，部分和有界，只要跟踪一个周期就能求出这个界。\n\n若 $a_k$ 不断重复 $2, 3, -5$，部分和是 $2, 5, 0, 2, 5, 0, \\dots$，所以最大值是 $5$。\n\n检验：每个完整周期加上 $2 + 3 - 5 = 0$，所以部分和回到 $0$，永不增长。\n\n> **注意。** 最大的部分和出现在正项连续段之后，即 $2 + 3$，不是某一项，也不是两个周期之和。",
        ],
        (rng) => {
          const p = rng.int(1, 15);
          const q = rng.int(1, 15);
          return solved(
            [
              `The sequence $a_k$ repeats ${p}, ${q}, $${-(p + q)}$ forever. What is the largest value of the partial sums $a_1 + \\dots + a_n$?`,
              `数列 $a_k$ 不断重复 ${p}、${q}、$${-(p + q)}$。部分和 $a_1 + \\dots + a_n$ 的最大值是多少？`,
            ],
            p + q,
            [
              why(p, "That is only the first partial sum; the second term adds more.", "这只是第一个部分和；第二项还会加上去。"),
              why(q, "That is a single term, not a partial sum.", "这是单独一项，不是部分和。"),
              why(
                2 * (p + q),
                "That adds two periods, but each period returns the sum to $0$.",
                "这加了两个周期，但每个周期都使和回到 $0$。",
              ),
            ],
            solution(
              [
                [
                  ["Follow one period", "跟踪一个周期"],
                  [
                    `The partial sums are $${p}$, then $${p} + ${q} = ${p + q}$, then $${p + q} - ${p + q} = 0$.`,
                    `部分和依次是 $${p}$，然后 $${p} + ${q} = ${p + q}$，然后 $${p + q} - ${p + q} = 0$。`,
                  ],
                ],
                [
                  ["Repeat", "重复"],
                  [
                    `Every period repeats these three values, so the largest is $${p + q}$.`,
                    `每个周期都重复这三个值，所以最大值是 $${p + q}$。`,
                  ],
                ],
              ],
              [
                `$${p + q}$ is larger than $${p}$ and $0$, and a whole period adds $${p} + ${q} - ${p + q} = 0$, so no later partial sum is larger.`,
                `$${p + q}$ 大于 $${p}$ 和 $0$，而一整个周期加上 $${p} + ${q} - ${p + q} = 0$，所以后面的部分和都不会更大。`,
              ],
            ),
          );
        },
      ),
      point(
        "the-bound-from-summing-by-parts",
        ["The bound from summing by parts", "分部求和给出的界"],
        [
          "If the partial sums of $a_k$ stay within $M$ in size and $b_k$ decreases to zero, then summing by parts bounds a block from $m$ on by $2M b_m$. This bound tends to zero, which gives the Cauchy criterion.\n\nWith $M = 3$, $b_k = \\frac{1}{k}$ and a block starting at $m = 10$, the bound is $2 \\times 3 \\times \\frac{1}{10} = \\frac{3}{5}$.\n\nCheck: starting the block at $m = 100$ instead gives $\\frac{6}{100}$, and the bound tends to $0$ as $m$ grows.\n\n> **Watch out.** The factor $2$ comes from subtracting two partial sums, each at most $M$ in size, and the bound uses $b_m$, the first factor of the block.",
          "如果 $a_k$ 的部分和绝对值不超过 $M$，且 $b_k$ 递减趋于零，那么分部求和给出从 $m$ 开始的一段不超过 $2M b_m$。这个界趋于零，从而满足柯西准则。\n\n取 $M = 3$，$b_k = \\frac{1}{k}$，从 $m = 10$ 开始的一段，界是 $2 \\times 3 \\times \\frac{1}{10} = \\frac{3}{5}$。\n\n检验：改从 $m = 100$ 开始，界是 $\\frac{6}{100}$；随着 $m$ 增大，界趋于 $0$。\n\n> **注意。** 因子 $2$ 来自两个部分和相减，每个的绝对值至多是 $M$；界用的是这一段的第一个因子 $b_m$。",
        ],
        (rng) => {
          const big = rng.int(1, 20);
          const m = rng.int(2, 40);
          const answer = Q.of(2 * big, m);
          return solved(
            [
              `The partial sums of $a_k$ stay within ${big} in size, and $b_k = \\frac{1}{k}$. What bound does summing by parts give for $\\left|\\sum_{k=${m}}^{n} a_k b_k\\right|$?`,
              `$a_k$ 的部分和绝对值不超过 ${big}，$b_k = \\frac{1}{k}$。分部求和给出 $\\left|\\sum_{k=${m}}^{n} a_k b_k\\right|$ 的什么界？`,
            ],
            answer,
            [
              why(Q.of(big, m), "That drops the factor $2$ from subtracting two partial sums.", "这丢掉了两个部分和相减带来的因子 $2$。"),
              why(
                Q.of(2 * big, m + 1),
                `That uses $b_{${m + 1}}$; the block starts at $k = ${m}$.`,
                `这用了 $b_{${m + 1}}$；这一段从 $k = ${m}$ 开始。`,
              ),
              why(Q.of(4 * big, m), "That doubles the bound once too often.", "这把界多加倍了一次。"),
            ],
            solution(
              [
                [
                  ["Bound the partial sums of the block", "界住这一段的部分和"],
                  [
                    `Each sum $a_{${m}} + \\dots + a_k$ is a difference of two partial sums, so its size is at most $2 \\times ${big} = ${2 * big}$.`,
                    `每个和 $a_{${m}} + \\dots + a_k$ 都是两个部分和之差，所以它的绝对值至多是 $2 \\times ${big} = ${2 * big}$。`,
                  ],
                ],
                [
                  ["Sum by parts", "分部求和"],
                  [
                    `Since $b_k$ decreases, summing by parts gives at most $${2 * big} \\times b_{${m}} = ${2 * big} \\times \\frac{1}{${m}} = ${answer.toLatex()}$.`,
                    `因为 $b_k$ 递减，分部求和给出至多 $${2 * big} \\times b_{${m}} = ${2 * big} \\times \\frac{1}{${m}} = ${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `The bound $\\frac{${2 * big}}{m}$ tends to $0$ as the block starts later, which is what the Cauchy criterion needs.`,
                `当这一段开始得越晚，界 $\\frac{${2 * big}}{m}$ 越趋于 $0$，这正是柯西准则所需要的。`,
              ],
            ),
          );
        },
      ),
      point(
        "which-test-applies",
        ["Which test applies", "用哪个判别法"],
        [
          "The Dirichlet test pairs bounded partial sums with a factor decreasing to zero. Abel's test pairs a convergent series with a bounded monotone factor. Telling these apart decides which proof is available for a given series.\n\nFor $\\sum \\frac{(-1)^{n}}{n}$, the partial sums of $(-1)^{n}$ are bounded and $\\frac{1}{n}$ decreases to $0$, so the Dirichlet test applies. For $\\sum \\frac{(-1)^{n}}{n} \\left(1 + \\frac{1}{n}\\right)$, the series $\\sum \\frac{(-1)^{n}}{n}$ converges and $1 + \\frac{1}{n}$ is bounded and monotone, so Abel's test applies.\n\nCheck: in the second series the factor tends to $1$, not $0$, which is why the Dirichlet test would not do there.\n\n> **Watch out.** The Dirichlet test needs a factor that tends to $0$; Abel's test needs the other factor's series to converge, not merely to have bounded partial sums.",
          "狄利克雷判别法把有界的部分和与递减趋于零的因子配对。阿贝尔判别法把收敛级数与有界单调因子配对。区分它们决定了一个级数可以用哪种证明。\n\n对 $\\sum \\frac{(-1)^{n}}{n}$，$(-1)^{n}$ 的部分和有界，$\\frac{1}{n}$ 递减趋于 $0$，所以狄利克雷判别法适用。对 $\\sum \\frac{(-1)^{n}}{n} \\left(1 + \\frac{1}{n}\\right)$，级数 $\\sum \\frac{(-1)^{n}}{n}$ 收敛，$1 + \\frac{1}{n}$ 有界且单调，所以阿贝尔判别法适用。\n\n检验：第二个级数中的因子趋于 $1$ 而不是 $0$，这就是那里不能用狄利克雷判别法的原因。\n\n> **注意。** 狄利克雷判别法需要一个趋于 $0$ 的因子；阿贝尔判别法需要另一个因子的级数收敛，而不只是部分和有界。",
        ],
        (rng) => {
          const k = rng.int(1, 30);
          const s = rng.int(2, 9);
          const useAbel = rng.bool();
          const dirichlet: [string, string] = ["The Dirichlet test", "狄利克雷判别法"];
          const abel: [string, string] = ["Abel's test", "阿贝尔判别法"];
          const comparison: [string, string] = ["The comparison test", "比较判别法"];
          const ratio: [string, string] = ["The ratio test", "比值判别法"];
          return reasoned(
            choose(
              rng,
              useAbel
                ? [
                    `Suppose $\\sum a_n$ converges, possibly only conditionally. Which test proves that $\\sum a_n \\left(1 + \\frac{${k}}{n}\\right)$ converges?`,
                    `设 $\\sum a_n$ 收敛，可能只是条件收敛。哪个判别法能证明 $\\sum a_n \\left(1 + \\frac{${k}}{n}\\right)$ 收敛？`,
                  ]
                : [
                    `Which test proves that $\\sum \\frac{\\sin(${s}n)}{n + ${k}}$ converges?`,
                    `哪个判别法能证明 $\\sum \\frac{\\sin(${s}n)}{n + ${k}}$ 收敛？`,
                  ],
              useAbel ? abel : dirichlet,
              [useAbel ? dirichlet : abel, comparison, ratio],
              asPair(
                solution(
                  [
                    [
                      ["Identify the factors", "识别两个因子"],
                      useAbel
                        ? [
                            `The series is $\\sum a_n b_n$ with $b_n = 1 + \\frac{${k}}{n}$, which is bounded and decreasing, and $\\sum a_n$ converges.`,
                            `这个级数是 $\\sum a_n b_n$，其中 $b_n = 1 + \\frac{${k}}{n}$ 有界且递减，而 $\\sum a_n$ 收敛。`,
                          ]
                        : [
                            `The series is $\\sum a_n b_n$ with $a_n = \\sin(${s}n)$, whose partial sums are bounded, and $b_n = \\frac{1}{n + ${k}}$, which decreases to $0$.`,
                            `这个级数是 $\\sum a_n b_n$，其中 $a_n = \\sin(${s}n)$ 的部分和有界，$b_n = \\frac{1}{n + ${k}}$ 递减趋于 $0$。`,
                          ],
                    ],
                    [
                      ["Match the test", "对应判别法"],
                      useAbel
                        ? [
                            "A convergent series times a bounded monotone factor is exactly the setting of Abel's test.",
                            "收敛级数乘有界单调因子，正是阿贝尔判别法的情形。",
                          ]
                        : [
                            "Bounded partial sums times a factor decreasing to $0$ is exactly the setting of the Dirichlet test.",
                            "有界的部分和乘递减趋于 $0$ 的因子，正是狄利克雷判别法的情形。",
                          ],
                    ],
                  ],
                  useAbel
                    ? [
                        `The factor tends to $1$, not $0$, so the Dirichlet test does not fit, while Abel's test needs only boundedness and monotonicity.`,
                        `因子趋于 $1$ 而不是 $0$，所以狄利克雷判别法不适合，而阿贝尔判别法只需要有界和单调。`,
                      ]
                    : [
                        `$\\sum \\sin(${s}n)$ itself diverges, because its terms do not tend to $0$, so Abel's test does not fit, while the Dirichlet test needs only bounded partial sums.`,
                        `$\\sum \\sin(${s}n)$ 本身发散，因为它的项不趋于 $0$，所以阿贝尔判别法不适合，而狄利克雷判别法只需要部分和有界。`,
                      ],
                ),
              ),
            ),
            useAbel
              ? [
                  [
                    dirichlet[0],
                    `The factor $1 + \\frac{${k}}{n}$ tends to $1$, not $0$, so the Dirichlet test does not apply.`,
                    `因子 $1 + \\frac{${k}}{n}$ 趋于 $1$ 而不是 $0$，所以狄利克雷判别法不适用。`,
                  ],
                  [
                    comparison[0],
                    "The terms $a_n$ may change sign and converge only conditionally, so there is no positive series to compare with.",
                    "$a_n$ 可能变号，只是条件收敛，所以没有可以比较的正项级数。",
                  ],
                  [
                    ratio[0],
                    "Nothing is known about the ratios of the $a_n$, and a conditionally convergent series fails the ratio test.",
                    "对 $a_n$ 的比值一无所知，而条件收敛的级数通不过比值判别法。",
                  ],
                ]
              : [
                  [
                    abel[0],
                    `Abel's test needs $\\sum \\sin(${s}n)$ to converge, but its terms do not tend to $0$.`,
                    `阿贝尔判别法需要 $\\sum \\sin(${s}n)$ 收敛，但它的项不趋于 $0$。`,
                  ],
                  [
                    comparison[0],
                    `The series of absolute values behaves like $\\sum \\frac{1}{n}$ on average and diverges, so comparison cannot prove convergence.`,
                    `绝对值级数平均起来像 $\\sum \\frac{1}{n}$，是发散的，所以比较判别法无法证明收敛。`,
                  ],
                  [
                    ratio[0],
                    "The ratios of consecutive terms do not settle below $1$, and the terms change sign.",
                    "相邻项之比不会稳定在 $1$ 以下，而且项会变号。",
                  ],
                ],
          );
        },
      ),
    ],
  ),
  intro: t(
    "The series $1 - \\frac{1}{2} + \\frac{1}{3} - \\frac{1}{4} + \\dots$ converges, although $\\sum \\frac{1}{n}$ diverges. The signs $1, -1, 1, -1, \\dots$ have partial sums $1, 0, 1, 0, \\dots$, which stay bounded, and $\\frac{1}{n}$ decreases to $0$.\n\nCheck: the partial sums of the series, $1, \\frac{1}{2}, \\frac{5}{6}, \\frac{7}{12}, \\dots$, close in from both sides on one value.\n\nIn this lesson we bound partial sums of repeating patterns, use summing by parts to bound a block of a series, and choose between the Dirichlet and Abel tests.",
    "级数 $1 - \\frac{1}{2} + \\frac{1}{3} - \\frac{1}{4} + \\dots$ 收敛，尽管 $\\sum \\frac{1}{n}$ 发散。符号 $1, -1, 1, -1, \\dots$ 的部分和是 $1, 0, 1, 0, \\dots$，保持有界，而 $\\frac{1}{n}$ 递减趋于 $0$。\n\n检验：级数的部分和 $1, \\frac{1}{2}, \\frac{5}{6}, \\frac{7}{12}, \\dots$ 从两侧逼近同一个值。\n\n本课我们求循环模式部分和的界，用分部求和界住级数的一段，并在狄利克雷判别法和阿贝尔判别法之间作出选择。",
  ),
};

const tails = {
  ...topic(
    "tails-of-convergent-series",
    ["Tails of Convergent Series", "收敛级数的余项"],
    [
      "Estimate what is left after $n$ terms, and find how far to go for a given accuracy.",
      "估计 $n$ 项之后剩下的部分，并求达到给定精度要走多远。",
    ],
    ["harmonic-series-and-p-series"],
    [],
    [
      point(
        "the-tail-of-a-geometric-series",
        ["The tail of a geometric series", "几何级数的余项"],
        [
          "The tail of a geometric series is itself geometric. It starts with the first omitted term, so its sum is that term divided by one minus the ratio.\n\nFor $\\sum_{k=3}^{\\infty} \\left(\\frac{1}{2}\\right)^{k}$, the first term is $\\frac{1}{8}$ and $1 - \\frac{1}{2} = \\frac{1}{2}$, so the tail is $\\frac{1}{4}$.\n\nCheck: the whole series from $k = 1$ is $1$, and the first two terms are $\\frac{1}{2} + \\frac{1}{4} = \\frac{3}{4}$, which leaves $\\frac{1}{4}$.\n\n> **Watch out.** The tail after $n$ terms starts at $k = n + 1$. Starting at $k = n$ adds one term too many.",
          "几何级数的余项本身也是几何级数。它从第一个被略去的项开始，所以它的和是这一项除以一减公比。\n\n对 $\\sum_{k=3}^{\\infty} \\left(\\frac{1}{2}\\right)^{k}$，首项是 $\\frac{1}{8}$，$1 - \\frac{1}{2} = \\frac{1}{2}$，所以余项是 $\\frac{1}{4}$。\n\n检验：从 $k = 1$ 开始的整个级数是 $1$，前两项是 $\\frac{1}{2} + \\frac{1}{4} = \\frac{3}{4}$，剩下 $\\frac{1}{4}$。\n\n> **注意。** $n$ 项之后的余项从 $k = n + 1$ 开始。从 $k = n$ 开始会多加一项。",
        ],
        (rng) => {
          const q = rng.int(2, 9);
          const p = rng.int(1, q - 1);
          const n = rng.int(1, 4);
          const r = Q.of(p, q).toLatex();
          const answer = Q.of(p ** (n + 1), q ** n * (q - p));
          const whole = Q.of(p, q - p);
          const head = whole.add(answer.neg());
          return solved(
            [
              `What is $\\sum_{k=${n + 1}}^{\\infty} \\left(${Q.of(p, q).toLatex()}\\right)^{k}$?`,
              `$\\sum_{k=${n + 1}}^{\\infty} \\left(${Q.of(p, q).toLatex()}\\right)^{k}$ 是多少？`,
            ],
            answer,
            [
              why(
                Q.of(p ** n, q ** (n - 1) * (q - p)),
                `That starts the tail at $k = ${n}$, one term too early.`,
                `这让余项从 $k = ${n}$ 开始，早了一项。`,
              ),
              why(whole, "That is the whole series from $k = 1$, not the tail.", "这是从 $k = 1$ 开始的整个级数，不是余项。"),
              why(Q.of(p ** (n + 1), q ** (n + 1)), "That is only the first term of the tail.", "这只是余项的首项。"),
            ],
            solution(
              [
                [
                  ["Find the first term", "求首项"],
                  [
                    `The tail starts at $k = ${n + 1}$, with $\\left(${r}\\right)^{${n + 1}} = ${Q.of(p ** (n + 1), q ** (n + 1)).toLatex()}$.`,
                    `余项从 $k = ${n + 1}$ 开始，首项是 $\\left(${r}\\right)^{${n + 1}} = ${Q.of(p ** (n + 1), q ** (n + 1)).toLatex()}$。`,
                  ],
                ],
                [
                  ["Divide by one minus the ratio", "除以一减公比"],
                  [
                    `$1 - ${r} = ${Q.of(q - p, q).toLatex()}$, so the tail is $${answer.toLatex()}$.`,
                    `$1 - ${r} = ${Q.of(q - p, q).toLatex()}$，所以余项是 $${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `The whole series from $k = 1$ is $${whole.toLatex()}$, and its first ${n} ${n === 1 ? "term adds" : "terms add"} to $${head.toLatex()}$, which leaves $${answer.toLatex()}$.`,
                `从 $k = 1$ 开始的整个级数是 $${whole.toLatex()}$，前 ${n} 项之和是 $${head.toLatex()}$，剩下 $${answer.toLatex()}$。`,
              ],
            ),
          );
        },
      ),
      point(
        "how-far-to-go-with-a-telescoping-tail",
        ["How far to go with a telescoping tail", "裂项余项要走多远"],
        [
          "Terms of the form $\\frac{1}{k(k+1)}$ telescope, so the tail after $n$ terms is exactly $\\frac{1}{n+1}$. Then the Cauchy criterion becomes a direct question about how large $n$ must be.\n\nFor a tail below $\\frac{1}{10}$, we need $\\frac{1}{n + 1} < \\frac{1}{10}$, that is $n + 1 > 10$, so the smallest $n$ is $10$, with tail $\\frac{1}{11}$.\n\nCheck: $n = 9$ leaves the tail $\\frac{1}{10}$, which is not below $\\frac{1}{10}$.\n\n> **Watch out.** The inequality is strict, and the tail is $\\frac{1}{n + 1}$, not $\\frac{1}{n}$.",
          "形如 $\\frac{1}{k(k+1)}$ 的项可以裂项，所以 $n$ 项之后的余项恰好是 $\\frac{1}{n+1}$。于是柯西准则变成关于 $n$ 必须多大的直接问题。\n\n要使余项小于 $\\frac{1}{10}$，需要 $\\frac{1}{n + 1} < \\frac{1}{10}$，即 $n + 1 > 10$，所以最小的 $n$ 是 $10$，余项为 $\\frac{1}{11}$。\n\n检验：$n = 9$ 时余项是 $\\frac{1}{10}$，并不小于 $\\frac{1}{10}$。\n\n> **注意。** 不等号是严格的，而且余项是 $\\frac{1}{n + 1}$，不是 $\\frac{1}{n}$。",
        ],
        (rng) => {
          const m = rng.int(5, 900);
          return solved(
            [
              `What is the smallest $n$ with $\\sum_{k=n+1}^{\\infty} \\frac{1}{k(k+1)} < \\frac{1}{${m}}$?`,
              `使 $\\sum_{k=n+1}^{\\infty} \\frac{1}{k(k+1)} < \\frac{1}{${m}}$ 的最小 $n$ 是多少？`,
            ],
            m,
            [
              why(
                m - 1,
                `That leaves the tail $\\frac{1}{${m}}$, which is not below $\\frac{1}{${m}}$.`,
                `这留下的余项是 $\\frac{1}{${m}}$，并不小于 $\\frac{1}{${m}}$。`,
              ),
              why(
                m + 1,
                `That works, but $${m}$ already leaves the tail $\\frac{1}{${m + 1}}$.`,
                `这也满足，但 $${m}$ 已经使余项为 $\\frac{1}{${m + 1}}$。`,
              ),
              why(
                m * m,
                "That squares the target; the tail is $\\frac{1}{n + 1}$, not a square.",
                "这把目标平方了；余项是 $\\frac{1}{n + 1}$，不是平方。",
              ),
            ],
            solution(
              [
                [
                  ["Telescope the tail", "裂项求余项"],
                  [
                    "$\\frac{1}{k(k+1)} = \\frac{1}{k} - \\frac{1}{k+1}$, so the tail from $k = n + 1$ is $\\frac{1}{n + 1}$.",
                    "$\\frac{1}{k(k+1)} = \\frac{1}{k} - \\frac{1}{k+1}$，所以从 $k = n + 1$ 开始的余项是 $\\frac{1}{n + 1}$。",
                  ],
                ],
                [
                  ["Solve the inequality", "解不等式"],
                  [
                    `$\\frac{1}{n + 1} < \\frac{1}{${m}}$ means $n + 1 > ${m}$, so the smallest $n$ is $${m}$.`,
                    `$\\frac{1}{n + 1} < \\frac{1}{${m}}$ 即 $n + 1 > ${m}$，所以最小的 $n$ 是 $${m}$。`,
                  ],
                ],
              ],
              [
                `$n = ${m}$ leaves $\\frac{1}{${m + 1}} < \\frac{1}{${m}}$, while $n = ${m - 1}$ leaves exactly $\\frac{1}{${m}}$.`,
                `$n = ${m}$ 留下 $\\frac{1}{${m + 1}} < \\frac{1}{${m}}$，而 $n = ${m - 1}$ 恰好留下 $\\frac{1}{${m}}$。`,
              ],
            ),
          );
        },
      ),
      point(
        "a-tail-bound-from-an-integral",
        ["A tail bound from an integral", "由积分得到的余项界"],
        [
          "For a decreasing positive function, the tail of the series lies below the integral starting from the last term kept. For the reciprocal squares this gives a bound of $\\frac{1}{n}$ after $n$ terms.\n\nFor $\\sum \\frac{1}{k^{2}}$ and the accuracy $\\frac{1}{100}$, the bound after $n$ terms is $\\frac{1}{n}$, and $\\frac{1}{n} < \\frac{1}{100}$ needs $n > 100$, so $n = 101$.\n\nCheck: $n = 100$ gives the bound $\\frac{1}{100}$ exactly, which is not below $\\frac{1}{100}$.\n\n> **Watch out.** The integral starts at $n$, the last term kept, so the bound is $\\frac{c}{n}$, and the constant $c$ multiplies it.",
          "对递减的正函数，级数的余项小于从保留的最后一项开始的积分。对平方倒数，这给出 $n$ 项之后的界 $\\frac{1}{n}$。\n\n对 $\\sum \\frac{1}{k^{2}}$ 和精度 $\\frac{1}{100}$，$n$ 项之后的界是 $\\frac{1}{n}$，而 $\\frac{1}{n} < \\frac{1}{100}$ 需要 $n > 100$，所以 $n = 101$。\n\n检验：$n = 100$ 时界恰好是 $\\frac{1}{100}$，并不小于 $\\frac{1}{100}$。\n\n> **注意。** 积分从保留的最后一项 $n$ 开始，所以界是 $\\frac{c}{n}$，常数 $c$ 要乘上去。",
        ],
        (rng) => {
          const m = rng.int(5, 900);
          const c = rng.int(1, 6);
          return solved(
            [
              `Using the integral bound for the tail, what is the smallest $n$ for which the bound guarantees that the first $n$ terms of $\\sum \\frac{${c}}{k^{2}}$ leave a tail below $\\frac{1}{${m}}$?`,
              `用余项的积分界，使这个界能保证 $\\sum \\frac{${c}}{k^{2}}$ 的前 $n$ 项留下的余项小于 $\\frac{1}{${m}}$ 的最小 $n$ 是多少？`,
            ],
            c * m + 1,
            [
              why(
                c * m,
                `That makes the bound $\\frac{${c}}{${c * m}} = \\frac{1}{${m}}$ exactly, which is not below it.`,
                `这使界恰好是 $\\frac{${c}}{${c * m}} = \\frac{1}{${m}}$，并不小于它。`,
              ),
              why(m + 1, `That forgets the constant ${c} in the terms.`, `这忘了项中的常数 ${c}。`),
              why(
                c * m * m,
                "That squares the target; the bound $\\frac{c}{n}$ has no square in it.",
                "这把目标平方了；界 $\\frac{c}{n}$ 中没有平方。",
              ),
            ],
            solution(
              [
                [
                  ["Bound the tail", "界住余项"],
                  [
                    `The tail after $n$ terms is below $\\int_{n}^{\\infty} \\frac{${c}}{x^{2}} \\, dx = \\frac{${c}}{n}$.`,
                    `$n$ 项之后的余项小于 $\\int_{n}^{\\infty} \\frac{${c}}{x^{2}} \\, dx = \\frac{${c}}{n}$。`,
                  ],
                ],
                [
                  ["Solve for n", "解出项数"],
                  [
                    `$\\frac{${c}}{n} < \\frac{1}{${m}}$ means $n > ${c * m}$, so the smallest $n$ is $${c * m + 1}$.`,
                    `$\\frac{${c}}{n} < \\frac{1}{${m}}$ 即 $n > ${c * m}$，所以最小的 $n$ 是 $${c * m + 1}$。`,
                  ],
                ],
              ],
              [
                `At $n = ${c * m + 1}$ the bound is $\\frac{${c}}{${c * m + 1}}$, just below $\\frac{1}{${m}}$, while at $n = ${c * m}$ it equals $\\frac{1}{${m}}$.`,
                `在 $n = ${c * m + 1}$ 时界是 $\\frac{${c}}{${c * m + 1}}$，略小于 $\\frac{1}{${m}}$；而在 $n = ${c * m}$ 时它等于 $\\frac{1}{${m}}$。`,
              ],
            ),
          );
        },
      ),
    ],
  ),
  intro: t(
    "The series $\\sum_{k=1}^{\\infty} \\frac{1}{2^{k}}$ adds up to $1$. After the first three terms, $\\frac{1}{2} + \\frac{1}{4} + \\frac{1}{8} = \\frac{7}{8}$, what is left is the tail $\\frac{1}{16} + \\frac{1}{32} + \\dots = \\frac{1}{8}$.\n\nCheck: $\\frac{7}{8} + \\frac{1}{8} = 1$.\n\nIn this lesson we sum the tail of a geometric series, find how far a telescoping series must go, and bound a tail by an integral.",
    "级数 $\\sum_{k=1}^{\\infty} \\frac{1}{2^{k}}$ 的和是 $1$。前三项之和是 $\\frac{1}{2} + \\frac{1}{4} + \\frac{1}{8} = \\frac{7}{8}$，剩下的余项是 $\\frac{1}{16} + \\frac{1}{32} + \\dots = \\frac{1}{8}$。\n\n检验：$\\frac{7}{8} + \\frac{1}{8} = 1$。\n\n本课我们求几何级数的余项，求裂项级数要走多远，并用积分界住余项。",
  ),
};

const uniformLimits = {
  ...topic(
    "uniform-limits-and-continuity",
    ["Uniform Limits and Continuity", "一致极限与连续性"],
    ["Measure uniform convergence with the supremum, and see that it preserves continuity.", "用上确界衡量一致收敛，并看到它保持连续性。"],
    ["pointwise-and-uniform-convergence"],
    [],
    [
      point(
        "how-large-n-must-be",
        ["How large n must be", "n 必须多大"],
        [
          "Uniform convergence asks for one $n$ that works at every point, which means the supremum of the difference must be small. On a bounded interval, $\\frac{x}{n}$ has its largest difference at the far end.\n\nOn $[0, 3]$ the supremum of $\\frac{x}{n}$ is $\\frac{3}{n}$, so a supremum below $\\frac{1}{10}$ needs $n > 30$, and the smallest such $n$ is $31$.\n\nCheck: at $n = 30$ the supremum is $\\frac{3}{30} = \\frac{1}{10}$, which is not below $\\frac{1}{10}$.\n\n> **Watch out.** The supremum is taken at the far end $x = 3$, not at $x = 1$, so the length of the interval enters the answer.",
          "一致收敛要求有一个 $n$ 对每一点都成立，也就是差的上确界要小。在有界区间上，$\\frac{x}{n}$ 的最大差在最远的端点。\n\n在 $[0, 3]$ 上 $\\frac{x}{n}$ 的上确界是 $\\frac{3}{n}$，所以上确界小于 $\\frac{1}{10}$ 需要 $n > 30$，最小的这样的 $n$ 是 $31$。\n\n检验：$n = 30$ 时上确界是 $\\frac{3}{30} = \\frac{1}{10}$，并不小于 $\\frac{1}{10}$。\n\n> **注意。** 上确界在最远端 $x = 3$ 处取到，而不是在 $x = 1$ 处，所以区间的长度会进入答案。",
        ],
        (rng) => {
          const b = rng.int(2, 30);
          const m = rng.int(2, 50);
          return solved(
            [
              `For $f_n(x) = \\frac{x}{n}$ on $[0, ${b}]$, what is the smallest $n$ with $\\sup |f_n| < \\frac{1}{${m}}$?`,
              `对 $[0, ${b}]$ 上的 $f_n(x) = \\frac{x}{n}$，使 $\\sup |f_n| < \\frac{1}{${m}}$ 的最小 $n$ 是多少？`,
            ],
            b * m + 1,
            [
              why(
                b * m,
                `That makes the supremum exactly $\\frac{1}{${m}}$, which is not below it.`,
                `这使上确界恰好是 $\\frac{1}{${m}}$，并不小于它。`,
              ),
              why(
                m + 1,
                `That ignores the far end: at $x = ${b}$ the difference is $\\frac{${b}}{n}$.`,
                `这忽略了最远端：在 $x = ${b}$ 处差是 $\\frac{${b}}{n}$。`,
              ),
              why(
                b + m,
                `That adds ${b} and ${m}; the condition $\\frac{${b}}{n} < \\frac{1}{${m}}$ multiplies them.`,
                `这把 ${b} 和 ${m} 相加；条件 $\\frac{${b}}{n} < \\frac{1}{${m}}$ 要求相乘。`,
              ),
            ],
            solution(
              [
                [
                  ["Find the supremum", "求上确界"],
                  [
                    `$\\frac{x}{n}$ increases in $x$, so its supremum on $[0, ${b}]$ is $\\frac{${b}}{n}$, taken at $x = ${b}$.`,
                    `$\\frac{x}{n}$ 关于 $x$ 递增，所以它在 $[0, ${b}]$ 上的上确界是 $\\frac{${b}}{n}$，在 $x = ${b}$ 处取到。`,
                  ],
                ],
                [
                  ["Solve the inequality", "解不等式"],
                  [
                    `$\\frac{${b}}{n} < \\frac{1}{${m}}$ means $n > ${b * m}$, so the smallest $n$ is $${b * m + 1}$.`,
                    `$\\frac{${b}}{n} < \\frac{1}{${m}}$ 即 $n > ${b * m}$，所以最小的 $n$ 是 $${b * m + 1}$。`,
                  ],
                ],
              ],
              [
                `At $n = ${b * m + 1}$ the supremum is $\\frac{${b}}{${b * m + 1}}$, just below $\\frac{1}{${m}}$, while at $n = ${b * m}$ it equals $\\frac{1}{${m}}$.`,
                `在 $n = ${b * m + 1}$ 时上确界是 $\\frac{${b}}{${b * m + 1}}$，略小于 $\\frac{1}{${m}}$；而在 $n = ${b * m}$ 时它等于 $\\frac{1}{${m}}$。`,
              ],
            ),
          );
        },
      ),
      point(
        "a-supremum-inside-the-interval",
        ["A supremum inside the interval", "区间内部的上确界"],
        [
          "The largest difference is not always at an end point, so use calculus to locate it. For $\\frac{x}{1 + n x^{2}}$, the derivative vanishes at $x = \\frac{1}{\\sqrt{n}}$, and this point gives the supremum.\n\nFor $\\frac{x}{1 + 9x^{2}}$ the derivative vanishes at $x = \\frac{1}{3}$, where the value is $\\frac{1/3}{1 + 1} = \\frac{1}{6}$.\n\nCheck: $1 + 9x^{2} \\ge 6x$ because $(3x - 1)^{2} \\ge 0$, so $\\frac{x}{1 + 9x^{2}} \\le \\frac{1}{6}$ for every $x > 0$.\n\n> **Watch out.** The question asks for the largest value, not for the point where it is taken: at $x = \\frac{1}{3}$ the denominator is $2$, which halves the value.",
          "最大差不一定在端点，所以要用微积分找到它。对 $\\frac{x}{1 + n x^{2}}$，导数在 $x = \\frac{1}{\\sqrt{n}}$ 处为零，这一点给出上确界。\n\n对 $\\frac{x}{1 + 9x^{2}}$，导数在 $x = \\frac{1}{3}$ 处为零，那里的值是 $\\frac{1/3}{1 + 1} = \\frac{1}{6}$。\n\n检验：因为 $(3x - 1)^{2} \\ge 0$，有 $1 + 9x^{2} \\ge 6x$，所以对每个 $x > 0$，$\\frac{x}{1 + 9x^{2}} \\le \\frac{1}{6}$。\n\n> **注意。** 问的是最大值，而不是取到最大值的点：在 $x = \\frac{1}{3}$ 处分母是 $2$，值要减半。",
        ],
        (rng) => {
          const k = rng.int(2, 30);
          const answer = Q.of(1, 2 * k);
          return solved(
            [
              `For $x \\ge 0$, what is the supremum of $\\frac{x}{1 + ${k * k} x^{2}}$?`,
              `当 $x \\ge 0$ 时，$\\frac{x}{1 + ${k * k} x^{2}}$ 的上确界是多少？`,
            ],
            answer,
            [
              why(
                Q.of(1, k),
                `That is the point $x = \\frac{1}{${k}}$ where the maximum is taken, not the maximum itself.`,
                `这是取到最大值的点 $x = \\frac{1}{${k}}$，而不是最大值本身。`,
              ),
              why(
                Q.of(1, k * k),
                `That divides by the coefficient ${k * k}, instead of evaluating at the critical point.`,
                `这是除以系数 ${k * k}，而不是在临界点求值。`,
              ),
              why(
                Q.of(1, 2 * k * k),
                `That divides by $2 \\times ${k * k}$; the value at the critical point is $\\frac{1}{${k}} \\div 2$.`,
                `这是除以 $2 \\times ${k * k}$；临界点处的值是 $\\frac{1}{${k}} \\div 2$。`,
              ),
            ],
            solution(
              [
                [
                  ["Find the critical point", "求临界点"],
                  [
                    `The derivative is $\\frac{1 - ${k * k} x^{2}}{(1 + ${k * k} x^{2})^{2}}$, which vanishes at $x = \\frac{1}{${k}}$.`,
                    `导数是 $\\frac{1 - ${k * k} x^{2}}{(1 + ${k * k} x^{2})^{2}}$，它在 $x = \\frac{1}{${k}}$ 处为零。`,
                  ],
                ],
                [
                  ["Evaluate there", "在那里求值"],
                  [
                    `At $x = \\frac{1}{${k}}$ the denominator is $1 + 1 = 2$, so the value is $\\frac{1}{${k}} \\div 2 = ${answer.toLatex()}$.`,
                    `在 $x = \\frac{1}{${k}}$ 处分母是 $1 + 1 = 2$，所以值是 $\\frac{1}{${k}} \\div 2 = ${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `$(${k}x - 1)^{2} \\ge 0$ gives $1 + ${k * k} x^{2} \\ge ${2 * k} x$, so the function never exceeds $${answer.toLatex()}$.`,
                `由 $(${k}x - 1)^{2} \\ge 0$ 得 $1 + ${k * k} x^{2} \\ge ${2 * k} x$，所以函数永不超过 $${answer.toLatex()}$。`,
              ],
            ),
          );
        },
      ),
      point(
        "continuity-rules-out-uniform-convergence",
        ["Continuity rules out uniform convergence", "连续性排除一致收敛"],
        [
          "A uniform limit of continuous functions is continuous. So if continuous functions converge to a discontinuous limit, the convergence cannot be uniform, and this is the fastest way to rule it out.\n\nOn $[0, 1]$ the functions $x^{n}$ tend to $0$ for $x < 1$ and to $1$ at $x = 1$. That limit jumps at $1$, so $x^{n}$ does not converge uniformly on $[0, 1]$.\n\nCheck: for every $n$ there are points just below $1$ where $x^{n} > \\frac{1}{2}$, so the supremum of the difference never drops below $\\frac{1}{2}$.\n\n> **Watch out.** On an interval that stays away from $1$, such as $\\left[0, \\frac{1}{2}\\right]$, the same functions do converge uniformly, because the supremum $\\left(\\frac{1}{2}\\right)^{n}$ tends to $0$.",
          "连续函数的一致极限是连续的。所以如果连续函数收敛到不连续的极限，收敛就不可能是一致的，这是排除一致收敛最快的办法。\n\n在 $[0, 1]$ 上，函数 $x^{n}$ 当 $x < 1$ 时趋于 $0$，在 $x = 1$ 处趋于 $1$。这个极限在 $1$ 处跳跃，所以 $x^{n}$ 在 $[0, 1]$ 上不一致收敛。\n\n检验：对每个 $n$，在略小于 $1$ 的点处 $x^{n} > \\frac{1}{2}$，所以差的上确界永远不会低于 $\\frac{1}{2}$。\n\n> **注意。** 在远离 $1$ 的区间上，例如 $\\left[0, \\frac{1}{2}\\right]$，同样的函数是一致收敛的，因为上确界 $\\left(\\frac{1}{2}\\right)^{n}$ 趋于 $0$。",
        ],
        (rng) => {
          const q = rng.int(2, 25);
          const p = rng.int(1, q - 1);
          const c = rng.int(1, 30);
          const r = Q.of(p, q).toLatex();
          const near = `x^{n} \\text{ on } \\left[0, ${r}\\right]`;
          const slow = `\\frac{x}{n} \\text{ on } [0, ${c}]`;
          const wave = `\\frac{\\sin(nx)}{n} \\text{ on } [0, ${c}]`;
          return reasoned(
            choose(
              rng,
              [`Which sequence does not converge uniformly on the given interval?`, `哪个数列在给定区间上不一致收敛？`],
              same(`x^{n} \\text{ on } [${r}, 1]`),
              [same(near), same(slow), same(wave)],
              asPair(
                solution(
                  [
                    [
                      ["Find the limit", "求极限"],
                      [
                        `On $[${r}, 1]$, $x^{n}$ tends to $0$ for $x < 1$ and to $1$ at $x = 1$.`,
                        `在 $[${r}, 1]$ 上，$x^{n}$ 当 $x < 1$ 时趋于 $0$，在 $x = 1$ 处趋于 $1$。`,
                      ],
                    ],
                    [
                      ["Use continuity", "利用连续性"],
                      [
                        "The limit jumps from $0$ to $1$ at $x = 1$, but a uniform limit of continuous functions is continuous, so this convergence is not uniform.",
                        "极限在 $x = 1$ 处从 $0$ 跳到 $1$，而连续函数的一致极限是连续的，所以这个收敛不是一致的。",
                      ],
                    ],
                  ],
                  [
                    `For every $n$, points just below $1$ give $x^{n} > \\frac{1}{2}$, so the supremum of $|x^{n} - 0|$ on $[${r}, 1)$ stays at least $\\frac{1}{2}$.`,
                    `对每个 $n$，略小于 $1$ 的点使 $x^{n} > \\frac{1}{2}$，所以 $|x^{n} - 0|$ 在 $[${r}, 1)$ 上的上确界始终至少是 $\\frac{1}{2}$。`,
                  ],
                ),
              ),
            ),
            [
              reason(
                near,
                `The supremum is $\\left(${r}\\right)^{n}$, which tends to $0$, so the convergence is uniform.`,
                `上确界是 $\\left(${r}\\right)^{n}$，它趋于 $0$，所以收敛是一致的。`,
              ),
              reason(
                slow,
                `The supremum is $\\frac{${c}}{n}$, which tends to $0$, so the convergence is uniform.`,
                `上确界是 $\\frac{${c}}{n}$，它趋于 $0$，所以收敛是一致的。`,
              ),
              reason(
                wave,
                "The supremum is at most $\\frac{1}{n}$, which tends to $0$, so the convergence is uniform.",
                "上确界至多是 $\\frac{1}{n}$，它趋于 $0$，所以收敛是一致的。",
              ),
            ],
          );
        },
      ),
    ],
  ),
  intro: t(
    "On $[0, 1]$ the functions $f_n(x) = \\frac{x}{n}$ tend to $0$, and the largest difference is $\\sup |f_n| = \\frac{1}{n}$. So $n = 101$ makes $|f_n(x)| < \\frac{1}{100}$ at every point at once.\n\nCheck: at $x = 1$, the worst point, $f_{101}(1) = \\frac{1}{101} < \\frac{1}{100}$.\n\nIn this lesson we find how large $n$ must be for a uniform bound, locate a supremum inside an interval, and use continuity to rule out uniform convergence.",
    "在 $[0, 1]$ 上，函数 $f_n(x) = \\frac{x}{n}$ 趋于 $0$，最大差是 $\\sup |f_n| = \\frac{1}{n}$。所以 $n = 101$ 使 $|f_n(x)| < \\frac{1}{100}$ 在每一点同时成立。\n\n检验：在最差的点 $x = 1$ 处，$f_{101}(1) = \\frac{1}{101} < \\frac{1}{100}$。\n\n本课我们求一致界需要多大的 $n$，在区间内部找到上确界，并用连续性排除一致收敛。",
  ),
};

const differentiatingSequences = {
  ...topic(
    "differentiating-sequences-of-functions",
    ["Differentiating Sequences of Functions", "函数列的求导"],
    [
      "See why derivatives need more than uniform convergence, and differentiate series term by term.",
      "理解为什么求导需要比一致收敛更多的条件，并逐项求导。",
    ],
    ["uniform-limits-and-continuity"],
    [],
    [
      point(
        "uniform-convergence-does-not-control-slopes",
        ["Uniform convergence does not control slopes", "一致收敛控制不了斜率"],
        [
          "Functions can be uniformly small while wiggling steeply. The sequence $\\frac{\\sin(nx)}{n}$ tends to zero uniformly, yet its derivative at zero stays fixed, so the limit of the derivatives is not the derivative of the limit.\n\nFor $f_n(x) = \\frac{3 \\sin(nx)}{n}$, the chain rule gives $f_n'(x) = 3 \\cos(nx)$, so $f_n'(0) = 3$ for every $n$, while $|f_n| \\le \\frac{3}{n}$.\n\nCheck: the limit function is $0$, whose derivative at $0$ is $0$, not $3$.\n\n> **Watch out.** The factor $n$ from the chain rule cancels the $\\frac{1}{n}$, so the derivatives do not shrink at all.",
          "函数可以一致地小，同时陡峭地摆动。数列 $\\frac{\\sin(nx)}{n}$ 一致趋于零，但它在零处的导数保持不变，所以导数的极限不是极限的导数。\n\n对 $f_n(x) = \\frac{3 \\sin(nx)}{n}$，链式法则给出 $f_n'(x) = 3 \\cos(nx)$，所以对每个 $n$ 都有 $f_n'(0) = 3$，而 $|f_n| \\le \\frac{3}{n}$。\n\n检验：极限函数是 $0$，它在 $0$ 处的导数是 $0$，而不是 $3$。\n\n> **注意。** 链式法则带来的因子 $n$ 抵消了 $\\frac{1}{n}$，所以导数根本不会变小。",
        ],
        (rng) => {
          const a = rng.int(2, 40);
          return solved(
            [
              `Let $f_n(x) = \\frac{${a} \\sin(nx)}{n}$. What is $\\lim_{n \\to \\infty} f_n'(0)$?`,
              `设 $f_n(x) = \\frac{${a} \\sin(nx)}{n}$。$\\lim_{n \\to \\infty} f_n'(0)$ 是多少？`,
            ],
            a,
            [
              why(
                0,
                "That is the derivative of the limit function $0$, not the limit of the derivatives.",
                "这是极限函数 $0$ 的导数，而不是导数的极限。",
              ),
              why(1, `That drops the constant ${a} in front of the sine.`, `这丢掉了正弦前面的常数 ${a}。`),
              why(
                2 * a,
                "That doubles the derivative; the chain rule brings the factor $n$ only once.",
                "这把导数加倍了；链式法则只带来一次因子 $n$。",
              ),
            ],
            solution(
              [
                [
                  ["Differentiate", "求导"],
                  [
                    `The chain rule gives $f_n'(x) = \\frac{${a} \\times n \\cos(nx)}{n} = ${a} \\cos(nx)$.`,
                    `链式法则给出 $f_n'(x) = \\frac{${a} \\times n \\cos(nx)}{n} = ${a} \\cos(nx)$。`,
                  ],
                ],
                [
                  ["Evaluate at zero", "在零处求值"],
                  [
                    `$\\cos 0 = 1$, so $f_n'(0) = ${a}$ for every $n$, and the limit is $${a}$.`,
                    `$\\cos 0 = 1$，所以对每个 $n$ 都有 $f_n'(0) = ${a}$，极限是 $${a}$。`,
                  ],
                ],
              ],
              [
                `$|f_n(x)| \\le \\frac{${a}}{n}$, so $f_n$ tends to $0$ uniformly, yet $f_n'(0)$ stays at $${a}$ instead of tending to $0$.`,
                `$|f_n(x)| \\le \\frac{${a}}{n}$，所以 $f_n$ 一致趋于 $0$，但 $f_n'(0)$ 始终是 $${a}$，并不趋于 $0$。`,
              ],
            ),
          );
        },
      ),
      point(
        "differentiating-a-series-term-by-term",
        ["Differentiating a series term by term", "逐项求导"],
        [
          "If the series of derivatives converges uniformly, and the original series converges at one point, then the sum may be differentiated term by term. Power series satisfy this on closed intervals inside the radius of convergence.\n\nFor $f(x) = \\sum_{k=1}^{\\infty} \\frac{x^{k}}{k}$, differentiating each term gives $x^{k-1}$, so $f'(x) = 1 + x + x^{2} + \\dots = \\frac{1}{1 - x}$, and $f'\\left(\\frac{1}{2}\\right) = 2$.\n\nCheck: $f(x) = -\\ln(1 - x)$, whose derivative is $\\frac{1}{1 - x}$.\n\n> **Watch out.** The derivative of $\\frac{x^{k}}{k}$ is $x^{k-1}$, so the new series starts at $1$, not at $x$.",
          "如果导数级数一致收敛，且原级数在一点收敛，那么和可以逐项求导。幂级数在收敛半径内的闭区间上满足这一点。\n\n对 $f(x) = \\sum_{k=1}^{\\infty} \\frac{x^{k}}{k}$，逐项求导得 $x^{k-1}$，所以 $f'(x) = 1 + x + x^{2} + \\dots = \\frac{1}{1 - x}$，$f'\\left(\\frac{1}{2}\\right) = 2$。\n\n检验：$f(x) = -\\ln(1 - x)$，它的导数是 $\\frac{1}{1 - x}$。\n\n> **注意。** $\\frac{x^{k}}{k}$ 的导数是 $x^{k-1}$，所以新级数从 $1$ 开始，而不是从 $x$ 开始。",
        ],
        (rng) => {
          const q = rng.int(2, 15);
          const p = rng.int(1, q - 1);
          const r = Q.of(p, q);
          const answer = Q.of(q, q - p);
          return solved(
            [
              `Let $f(x) = \\sum_{k=1}^{\\infty} \\frac{x^{k}}{k}$ for $|x| < 1$. What is $f'\\left(${r.toLatex()}\\right)$?`,
              `对 $|x| < 1$，设 $f(x) = \\sum_{k=1}^{\\infty} \\frac{x^{k}}{k}$。$f'\\left(${r.toLatex()}\\right)$ 是多少？`,
            ],
            answer,
            [
              why(
                Q.of(p, q - p),
                "That is $\\frac{x}{1 - x}$, a series starting at $x$; the derivative series starts at $1$.",
                "这是 $\\frac{x}{1 - x}$，从 $x$ 开始的级数；导数级数从 $1$ 开始。",
              ),
              why(
                Q.of(q * q, (q - p) * (q - p)),
                "That is $\\frac{1}{(1 - x)^{2}}$, which differentiates once too often.",
                "这是 $\\frac{1}{(1 - x)^{2}}$，多求了一次导。",
              ),
              why(Q.of(q - p, q), "That is $1 - x$ instead of its reciprocal.", "这是 $1 - x$，而不是它的倒数。"),
            ],
            solution(
              [
                [
                  ["Differentiate term by term", "逐项求导"],
                  [
                    "Inside the radius $1$ term-by-term differentiation is allowed, and it gives $f'(x) = \\sum_{k=1}^{\\infty} x^{k-1} = \\frac{1}{1 - x}$.",
                    "在半径 $1$ 内可以逐项求导，得到 $f'(x) = \\sum_{k=1}^{\\infty} x^{k-1} = \\frac{1}{1 - x}$。",
                  ],
                ],
                [
                  ["Evaluate", "求值"],
                  [
                    `$1 - ${r.toLatex()} = ${Q.of(q - p, q).toLatex()}$, so $f'\\left(${r.toLatex()}\\right) = ${answer.toLatex()}$.`,
                    `$1 - ${r.toLatex()} = ${Q.of(q - p, q).toLatex()}$，所以 $f'\\left(${r.toLatex()}\\right) = ${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `$f(x) = -\\ln(1 - x)$ has derivative $\\frac{1}{1 - x}$, and multiplying $${answer.toLatex()}$ by $${Q.of(q - p, q).toLatex()}$ gives $1$.`,
                `$f(x) = -\\ln(1 - x)$ 的导数是 $\\frac{1}{1 - x}$，而 $${answer.toLatex()}$ 乘 $${Q.of(q - p, q).toLatex()}$ 得 $1$。`,
              ],
            ),
          );
        },
      ),
      point(
        "a-sum-found-by-differentiating",
        ["A sum found by differentiating", "通过求导求和"],
        [
          "Differentiating the geometric series gives $\\sum k x^{k-1} = \\frac{1}{(1 - x)^{2}}$. Multiplying by $x$ then gives the sum of $k x^{k}$, which evaluates many series that are not geometric.\n\nAt $x = \\frac{1}{2}$, $\\sum k \\left(\\frac{1}{2}\\right)^{k} = \\frac{1/2}{(1/2)^{2}} = 2$.\n\nCheck: the first terms are $\\frac{1}{2} + \\frac{2}{4} + \\frac{3}{8} + \\frac{4}{16} = \\frac{13}{8}$, and the rest add the remaining $\\frac{3}{8}$.\n\n> **Watch out.** Differentiating gives $k x^{k-1}$; multiply by $x$ to get $k x^{k}$, or the answer is off by a factor of $x$.",
          "对几何级数求导，得到 $\\sum k x^{k-1} = \\frac{1}{(1 - x)^{2}}$。再乘 $x$，得到 $k x^{k}$ 的和，这可以求出许多不是几何级数的和。\n\n在 $x = \\frac{1}{2}$ 处，$\\sum k \\left(\\frac{1}{2}\\right)^{k} = \\frac{1/2}{(1/2)^{2}} = 2$。\n\n检验：前几项是 $\\frac{1}{2} + \\frac{2}{4} + \\frac{3}{8} + \\frac{4}{16} = \\frac{13}{8}$，其余各项补上剩下的 $\\frac{3}{8}$。\n\n> **注意。** 求导得到的是 $k x^{k-1}$；要乘 $x$ 才得到 $k x^{k}$，否则答案差一个因子 $x$。",
        ],
        (rng) => {
          const q = rng.int(2, 15);
          const p = rng.int(1, q - 1);
          const r = Q.of(p, q);
          const answer = Q.of(p * q, (q - p) * (q - p));
          return solved(
            [
              `Evaluate $\\sum_{k=1}^{\\infty} k \\left(${r.toLatex()}\\right)^{k}$.`,
              `计算 $\\sum_{k=1}^{\\infty} k \\left(${r.toLatex()}\\right)^{k}$。`,
            ],
            answer,
            [
              why(Q.of(p, q - p), "That is $\\sum x^{k}$ without the factor $k$.", "这是没有因子 $k$ 的 $\\sum x^{k}$。"),
              why(
                Q.of(q * q, (q - p) * (q - p)),
                "That is $\\frac{1}{(1 - x)^{2}}$, the sum of $k x^{k-1}$; it still needs the factor $x$.",
                "这是 $\\frac{1}{(1 - x)^{2}}$，即 $k x^{k-1}$ 的和；还要乘因子 $x$。",
              ),
              why(Q.of(q, q - p), "That is $\\frac{1}{1 - x}$, the geometric series itself.", "这是 $\\frac{1}{1 - x}$，即几何级数本身。"),
            ],
            solution(
              [
                [
                  ["Differentiate the geometric series", "对几何级数求导"],
                  [
                    "$\\sum_{k=0}^{\\infty} x^{k} = \\frac{1}{1 - x}$, and differentiating term by term gives $\\sum_{k=1}^{\\infty} k x^{k-1} = \\frac{1}{(1 - x)^{2}}$.",
                    "$\\sum_{k=0}^{\\infty} x^{k} = \\frac{1}{1 - x}$，逐项求导得 $\\sum_{k=1}^{\\infty} k x^{k-1} = \\frac{1}{(1 - x)^{2}}$。",
                  ],
                ],
                [
                  ["Multiply by x and evaluate", "乘以自变量并求值"],
                  [
                    `So $\\sum k x^{k} = \\frac{x}{(1 - x)^{2}}$, and with $1 - ${r.toLatex()} = ${Q.of(q - p, q).toLatex()}$ the sum is $${answer.toLatex()}$.`,
                    `所以 $\\sum k x^{k} = \\frac{x}{(1 - x)^{2}}$，由 $1 - ${r.toLatex()} = ${Q.of(q - p, q).toLatex()}$ 得和为 $${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `Multiplying $${answer.toLatex()}$ by $(1 - x)^{2} = ${Q.of((q - p) * (q - p), q * q).toLatex()}$ gives back $x = ${r.toLatex()}$.`,
                `把 $${answer.toLatex()}$ 乘以 $(1 - x)^{2} = ${Q.of((q - p) * (q - p), q * q).toLatex()}$，又得到 $x = ${r.toLatex()}$。`,
              ],
            ),
          );
        },
      ),
    ],
  ),
  intro: t(
    "The functions $f_n(x) = \\frac{\\sin(nx)}{n}$ are never larger than $\\frac{1}{n}$, so they tend to $0$ uniformly. Yet $f_n'(x) = \\cos(nx)$, and $f_n'(0) = 1$ for every $n$.\n\nCheck: the limit $0$ has derivative $0$ at $0$, so the limit of the derivatives, $1$, is not the derivative of the limit.\n\nIn this lesson we see why uniform convergence does not control slopes, differentiate power series term by term, and use this to sum series that are not geometric.",
    "函数 $f_n(x) = \\frac{\\sin(nx)}{n}$ 永远不超过 $\\frac{1}{n}$，所以一致趋于 $0$。但 $f_n'(x) = \\cos(nx)$，对每个 $n$ 都有 $f_n'(0) = 1$。\n\n检验：极限 $0$ 在 $0$ 处的导数是 $0$，所以导数的极限 $1$ 不是极限的导数。\n\n本课我们看到一致收敛为什么控制不了斜率，对幂级数逐项求导，并用它求不是几何级数的和。",
  ),
};

const powerUniform = {
  ...topic(
    "power-series-and-uniform-convergence",
    ["Power Series and Uniform Convergence", "幂级数与一致收敛"],
    ["See where a power series converges uniformly, and what happens at the end points.", "看幂级数在哪里一致收敛，以及在端点发生什么。"],
    ["the-weierstrass-m-test", "radius-of-convergence-of-power-series"],
    [],
    [
      point(
        "a-bound-from-the-m-test",
        ["A bound from the M-test", "M 判别法给出的界"],
        [
          "On a closed interval inside the radius, every term of a power series is dominated by a term of a geometric series. So the Weierstrass test gives uniform convergence there, and the geometric sum bounds the function.\n\nOn $[-1, 1]$ the terms of $\\sum \\left(\\frac{x}{4}\\right)^{k}$ are at most $\\left(\\frac{1}{4}\\right)^{k}$, whose sum is $\\frac{1}{1 - 1/4} = \\frac{4}{3}$.\n\nCheck: at $x = 1$ the series is exactly $\\sum \\left(\\frac{1}{4}\\right)^{k} = \\frac{4}{3}$, so the bound is reached there.\n\n> **Watch out.** The sum starts at $k = 0$, so it includes the term $1$: the sum is $\\frac{1}{1 - \\text{ratio}}$, not $\\frac{\\text{ratio}}{1 - \\text{ratio}}$.",
          "在收敛半径内的闭区间上，幂级数的每一项都被几何级数的项控制。所以魏尔斯特拉斯判别法给出那里的一致收敛，几何级数的和给出函数的界。\n\n在 $[-1, 1]$ 上，$\\sum \\left(\\frac{x}{4}\\right)^{k}$ 的项至多是 $\\left(\\frac{1}{4}\\right)^{k}$，它们的和是 $\\frac{1}{1 - 1/4} = \\frac{4}{3}$。\n\n检验：在 $x = 1$ 处级数恰好是 $\\sum \\left(\\frac{1}{4}\\right)^{k} = \\frac{4}{3}$，所以界在那里取到。\n\n> **注意。** 和从 $k = 0$ 开始，所以包含项 $1$：和是 $\\frac{1}{1 - \\text{公比}}$，而不是 $\\frac{\\text{公比}}{1 - \\text{公比}}$。",
        ],
        (rng) => {
          const big = rng.int(2, 20);
          const r = rng.int(1, big - 1);
          const ratio = Q.of(r, big).toLatex();
          const answer = Q.of(big, big - r);
          return solved(
            [
              `On $[-${r}, ${r}]$, the terms of $\\sum_{k=0}^{\\infty} \\left(\\frac{x}{${big}}\\right)^{k}$ are dominated by $M_k = \\left(${Q.of(r, big).toLatex()}\\right)^{k}$. What is $\\sum_{k=0}^{\\infty} M_k$?`,
              `在 $[-${r}, ${r}]$ 上，$\\sum_{k=0}^{\\infty} \\left(\\frac{x}{${big}}\\right)^{k}$ 的项被 $M_k = \\left(${Q.of(r, big).toLatex()}\\right)^{k}$ 控制。$\\sum_{k=0}^{\\infty} M_k$ 是多少？`,
            ],
            answer,
            [
              why(
                Q.of(r, big - r),
                "That is $\\frac{\\text{ratio}}{1 - \\text{ratio}}$, which leaves out the term $M_0 = 1$.",
                "这是 $\\frac{\\text{公比}}{1 - \\text{公比}}$，漏掉了项 $M_0 = 1$。",
              ),
              why(Q.of(big, r), "That is the reciprocal of the ratio, not the geometric sum.", "这是公比的倒数，不是几何级数的和。"),
              why(
                Q.of(big - r, big),
                "That is $1 - \\text{ratio}$ instead of its reciprocal.",
                "这是 $1 - \\text{公比}$，而不是它的倒数。",
              ),
            ],
            solution(
              [
                [
                  ["Find the ratio", "求公比"],
                  [
                    `The ratio is $${ratio}$, which is less than $1$, so the series of $M_k$ converges.`,
                    `公比是 $${ratio}$，小于 $1$，所以 $M_k$ 的级数收敛。`,
                  ],
                ],
                [
                  ["Sum the geometric series", "求几何级数的和"],
                  [
                    `$\\frac{1}{1 - ${ratio}} = \\frac{1}{${Q.of(big - r, big).toLatex()}} = ${answer.toLatex()}$.`,
                    `$\\frac{1}{1 - ${ratio}} = \\frac{1}{${Q.of(big - r, big).toLatex()}} = ${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `At $x = ${r}$ the series is exactly $\\sum M_k$, and multiplying $${answer.toLatex()}$ by $1 - ${ratio}$ gives $1$.`,
                `在 $x = ${r}$ 处级数恰好是 $\\sum M_k$，而 $${answer.toLatex()}$ 乘 $1 - ${ratio}$ 得 $1$。`,
              ],
            ),
          );
        },
      ),
      point(
        "the-radius-after-differentiating",
        ["The radius after differentiating", "求导后的半径"],
        [
          "Differentiating a power series multiplies the coefficients by a factor that grows only polynomially, and such a factor has an $n$th root tending to 1. So the derivative series has exactly the same radius of convergence.\n\nThe series $\\sum \\frac{x^{k}}{3^{k}}$ has radius $3$. Its derivative $\\sum \\frac{k x^{k-1}}{3^{k}}$ also has radius $3$, because $\\sqrt[k]{k} \\to 1$.\n\nCheck: at $x = 3$ the derivative series has terms $\\frac{k}{3}$, which do not tend to $0$, so it diverges there, just as the original does.\n\n> **Watch out.** Differentiating does not shrink or grow the radius, however many times it is done; only the end points can change.",
          "对幂级数求导，系数只乘多项式增长的因子，这种因子的 $n$ 次方根趋于 1。所以导数级数的收敛半径完全相同。\n\n级数 $\\sum \\frac{x^{k}}{3^{k}}$ 的半径是 $3$。它的导数 $\\sum \\frac{k x^{k-1}}{3^{k}}$ 的半径也是 $3$，因为 $\\sqrt[k]{k} \\to 1$。\n\n检验：在 $x = 3$ 处导数级数的项是 $\\frac{k}{3}$，不趋于 $0$，所以在那里发散，与原级数一样。\n\n> **注意。** 无论求导多少次，半径都不会缩小或扩大；可能改变的只有端点。",
        ],
        (rng) => {
          const a = rng.int(2, 30);
          const m = rng.int(1, 5);
          const times = rng.int(1, 4);
          return solved(
            [
              `The series $\\sum_{k=1}^{\\infty} \\frac{k^{${m}} x^{k}}{${a}^{k}}$ is differentiated ${times} ${times === 1 ? "time" : "times"} term by term. What is the radius of convergence of the result?`,
              `对级数 $\\sum_{k=1}^{\\infty} \\frac{k^{${m}} x^{k}}{${a}^{k}}$ 逐项求导 ${times} 次。结果的收敛半径是多少？`,
            ],
            a,
            [
              why(
                a - times,
                "That takes one off the radius for each derivative, but differentiating does not change the radius.",
                "这每求一次导就把半径减一，但求导不改变半径。",
              ),
              why(
                a + m,
                "That adds the power of $k$ to the radius, but polynomial factors leave the radius unchanged.",
                "这把 $k$ 的幂次加到半径上，但多项式因子不改变半径。",
              ),
              why(
                a * m,
                "That multiplies the radius by the power of $k$, but polynomial factors leave the radius unchanged.",
                "这把半径乘以 $k$ 的幂次，但多项式因子不改变半径。",
              ),
            ],
            solution(
              [
                [
                  ["Find the original radius", "求原来的半径"],
                  [
                    `The $k$th root of a fixed power of $k$ tends to $1$, so the $k$th root of the coefficient tends to $\\frac{1}{${a}}$, and the radius is $${a}$.`,
                    `$k$ 的固定次幂的 $k$ 次方根趋于 $1$，所以系数的 $k$ 次方根趋于 $\\frac{1}{${a}}$，半径是 $${a}$。`,
                  ],
                ],
                [
                  ["Differentiate", "求导"],
                  [
                    `Each derivative multiplies the coefficients by a factor at most $k$, so after ${times} ${times === 1 ? "derivative" : "derivatives"} the extra factor is still a polynomial in $k$, and the radius stays $${a}$.`,
                    `每次求导系数至多乘因子 $k$，所以求导 ${times} 次后多出的因子仍是 $k$ 的多项式，半径仍是 $${a}$。`,
                  ],
                ],
              ],
              [
                `At $|x| = ${a}$ the terms do not tend to $0$, so the result diverges there, while for $|x| < ${a}$ the terms shrink geometrically.`,
                `在 $|x| = ${a}$ 处各项不趋于 $0$，所以结果在那里发散；而当 $|x| < ${a}$ 时各项按几何速度缩小。`,
              ],
            ),
          );
        },
      ),
      point(
        "behavior-at-the-end-points",
        ["Behavior at the end points", "端点处的行为"],
        [
          "The radius says nothing about the end points, which must be tested on their own. When a series converges at an end point, Abel's theorem says that its sum is continuous up to and including that point.\n\nThe series $\\sum \\frac{x^{k}}{k}$ has radius $1$. At $x = 1$ it is the harmonic series, which diverges, and at $x = -1$ it is the alternating harmonic series, which converges, so it converges exactly on $[-1, 1)$.\n\nCheck: by Abel's theorem its sum $-\\ln(1 - x)$ is continuous up to $x = -1$, where it equals $-\\ln 2$.\n\n> **Watch out.** The two end points can behave differently, so test each one separately.",
          "收敛半径不说明端点的情况，端点必须单独检验。当级数在端点收敛时，阿贝尔定理说明它的和直到该端点都是连续的。\n\n级数 $\\sum \\frac{x^{k}}{k}$ 的半径是 $1$。在 $x = 1$ 处它是调和级数，发散；在 $x = -1$ 处它是交错调和级数，收敛。所以它恰好在 $[-1, 1)$ 上收敛。\n\n检验：由阿贝尔定理，它的和 $-\\ln(1 - x)$ 直到 $x = -1$ 都连续，在那里等于 $-\\ln 2$。\n\n> **注意。** 两个端点的行为可能不同，所以要分别检验。",
        ],
        (rng) => {
          const a = rng.int(2, 40);
          const open = `(-${a}, ${a})`;
          const right = `(-${a}, ${a}]`;
          const closed = `[-${a}, ${a}]`;
          return reasoned(
            choose(
              rng,
              [
                `Where does $\\sum_{k=1}^{\\infty} \\frac{x^{k}}{k \\cdot ${a}^{k}}$ converge?`,
                `$\\sum_{k=1}^{\\infty} \\frac{x^{k}}{k \\cdot ${a}^{k}}$ 在哪里收敛？`,
              ],
              same(`[-${a}, ${a})`),
              [same(open), same(right), same(closed)],
              asPair(
                solution(
                  [
                    [
                      ["Find the radius", "求半径"],
                      [
                        `The $k$th root of $\\frac{1}{k \\cdot ${a}^{k}}$ tends to $\\frac{1}{${a}}$, so the radius is $${a}$.`,
                        `$\\frac{1}{k \\cdot ${a}^{k}}$ 的 $k$ 次方根趋于 $\\frac{1}{${a}}$，所以半径是 $${a}$。`,
                      ],
                    ],
                    [
                      ["Test the end points", "检验端点"],
                      [
                        `At $x = ${a}$ the series is $\\sum \\frac{1}{k}$, which diverges; at $x = -${a}$ it is $\\sum \\frac{(-1)^{k}}{k}$, which converges.`,
                        `在 $x = ${a}$ 处级数是 $\\sum \\frac{1}{k}$，发散；在 $x = -${a}$ 处是 $\\sum \\frac{(-1)^{k}}{k}$，收敛。`,
                      ],
                    ],
                  ],
                  [
                    `At $x = -${a}$ the terms alternate in sign and shrink to $0$ in size, so the alternating series test applies, while at $x = ${a}$ the partial sums grow like $\\ln n$.`,
                    `在 $x = -${a}$ 处各项符号交替且绝对值缩小到 $0$，所以交错级数判别法适用；而在 $x = ${a}$ 处部分和像 $\\ln n$ 一样增长。`,
                  ],
                ),
              ),
            ),
            [
              reason(
                open,
                `It leaves out $-${a}$, where the alternating harmonic series converges.`,
                `它漏掉了 $-${a}$，而在那里交错调和级数收敛。`,
              ),
              reason(
                right,
                `It has the end points swapped: the series diverges at $${a}$ and converges at $-${a}$.`,
                `它把端点弄反了：级数在 $${a}$ 处发散，在 $-${a}$ 处收敛。`,
              ),
              reason(
                closed,
                `It includes $${a}$, where the series is the harmonic series and diverges.`,
                `它包含 $${a}$，而在那里级数是调和级数，发散。`,
              ),
            ],
          );
        },
      ),
    ],
  ),
  intro: t(
    "On $\\left[-\\frac{1}{2}, \\frac{1}{2}\\right]$ every term of $\\sum x^{k}$ satisfies $|x^{k}| \\le \\left(\\frac{1}{2}\\right)^{k}$, and these bounds add up to $2$. So the series converges uniformly there, and its sum is at most $2$ in size.\n\nCheck: at $x = \\frac{1}{2}$ the sum is $\\frac{1}{1 - 1/2} = 2$, exactly the bound.\n\nIn this lesson we bound a power series with the M-test, see that differentiating keeps the radius, and test the end points one by one.",
    "在 $\\left[-\\frac{1}{2}, \\frac{1}{2}\\right]$ 上，$\\sum x^{k}$ 的每一项都满足 $|x^{k}| \\le \\left(\\frac{1}{2}\\right)^{k}$，这些界的和是 $2$。所以级数在那里一致收敛，和的绝对值至多是 $2$。\n\n检验：在 $x = \\frac{1}{2}$ 处和是 $\\frac{1}{1 - 1/2} = 2$，恰好等于这个界。\n\n本课我们用 M 判别法界住幂级数，看到求导保持半径不变，并逐个检验端点。",
  ),
};

const bernstein = {
  ...topic(
    "the-weierstrass-approximation-theorem",
    ["The Weierstrass Approximation Theorem", "魏尔斯特拉斯逼近定理"],
    [
      "Approximate any continuous function uniformly by polynomials, through Bernstein polynomials.",
      "通过伯恩斯坦多项式用多项式一致逼近任何连续函数。",
    ],
    ["uniform-limits-and-continuity"],
    [],
    [
      point(
        "evaluating-a-bernstein-polynomial",
        ["Evaluating a Bernstein polynomial", "计算伯恩斯坦多项式"],
        [
          "The Bernstein polynomial of degree $n$ averages the values of $f$ at $\\frac{k}{n}$, with weights from the binomial distribution. At $x = \\frac{1}{2}$ these weights are simply the binomial coefficients over $2^{n}$.\n\nWith $n = 2$ and $f(0) = 4$, $f\\left(\\frac{1}{2}\\right) = 2$, $f(1) = 8$, the weights are $\\frac{1}{4}, \\frac{2}{4}, \\frac{1}{4}$, so the value is $\\frac{4 + 2 \\times 2 + 8}{4} = 4$.\n\nCheck: the weights add to $\\frac{1 + 2 + 1}{4} = 1$, as the weights of an average must.\n\n> **Watch out.** The weights are not equal: the middle values count more, so this is not the plain average of the values.",
          "$n$ 次伯恩斯坦多项式用二项分布作权，对 $f$ 在 $\\frac{k}{n}$ 处的值求平均。在 $x = \\frac{1}{2}$ 处，这些权就是二项式系数除以 $2^{n}$。\n\n取 $n = 2$，$f(0) = 4$，$f\\left(\\frac{1}{2}\\right) = 2$，$f(1) = 8$，权是 $\\frac{1}{4}, \\frac{2}{4}, \\frac{1}{4}$，所以值是 $\\frac{4 + 2 \\times 2 + 8}{4} = 4$。\n\n检验：权的和是 $\\frac{1 + 2 + 1}{4} = 1$，正如平均的权应满足的那样。\n\n> **注意。** 权并不相等：中间的值占的比重更大，所以这不是这些值的简单平均。",
        ],
        (rng) => {
          const n = rng.int(2, 3);
          const values = Array.from({ length: n + 1 }, () => rng.int(-9, 15));
          const top = values.reduce((s, v, k) => s + v * binomial(n, k), 0);
          const label = values.map((v, k) => `f\\left(${Q.of(k, n).toLatex()}\\right) = ${v}`).join(",\\ ");
          const par = (v: number) => (v < 0 ? `(${v})` : `${v}`);
          const weights = values.map((_, k) => binomial(n, k)).join(", ");
          const terms = values.map((v, k) => (binomial(n, k) === 1 ? par(v) : `${binomial(n, k)} \\times ${par(v)}`)).join(" + ");
          const answer = Q.of(top, 2 ** n);
          return solved(
            [
              `Given $${label}$, what is the degree ${n} Bernstein polynomial of $f$ at $x = \\frac{1}{2}$?`,
              `已知 $${label}$，$f$ 的 ${n} 次伯恩斯坦多项式在 $x = \\frac{1}{2}$ 处的值是多少？`,
            ],
            answer,
            [
              why(
                Q.of(
                  values.reduce((s, v) => s + v, 0),
                  n + 1,
                ),
                "That is the plain average of the values, with equal weights.",
                "这是等权的简单平均。",
              ),
              why(
                Q.of(top, 2 ** n + 1),
                `That divides by $${2 ** n + 1}$; the weights are over $2^{${n}} = ${2 ** n}$.`,
                `这是除以 $${2 ** n + 1}$；权的分母是 $2^{${n}} = ${2 ** n}$。`,
              ),
              why(Q.of(top + 1, 2 ** n), `That adds one too many to the weighted sum $${top}$.`, `这让加权和 $${top}$ 多了一。`),
            ],
            solution(
              [
                [
                  ["Find the weights", "求权"],
                  [
                    `At $x = \\frac{1}{2}$ the weights are the binomial coefficients $${weights}$ over $2^{${n}} = ${2 ** n}$.`,
                    `在 $x = \\frac{1}{2}$ 处，权是二项式系数 $${weights}$ 除以 $2^{${n}} = ${2 ** n}$。`,
                  ],
                ],
                [
                  ["Take the weighted average", "求加权平均"],
                  [
                    `$\\frac{${terms}}{${2 ** n}} = \\frac{${top}}{${2 ** n}} = ${answer.toLatex()}$.`,
                    `$\\frac{${terms}}{${2 ** n}} = \\frac{${top}}{${2 ** n}} = ${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `The coefficients $${weights}$ add to $${2 ** n}$, so the weights add to $1$ and the result lies between the smallest and largest values.`,
                `系数 $${weights}$ 的和是 $${2 ** n}$，所以权的和是 $1$，结果介于最小值与最大值之间。`,
              ],
            ),
          );
        },
      ),
      point(
        "the-bernstein-polynomial-of-a-square",
        ["The Bernstein polynomial of a square", "平方函数的伯恩斯坦多项式"],
        [
          "For $f(x) = x^{2}$ the Bernstein polynomial is $x^{2} + \\frac{x(1 - x)}{n}$. The extra term is the variance of a binomial proportion, and it shows the error shrinking as $n$ grows.\n\nWith $n = 4$ at $x = \\frac{1}{2}$, the value is $\\frac{1}{4} + \\frac{1/4}{4} = \\frac{5}{16}$.\n\nCheck: the error $\\frac{5}{16} - \\frac{1}{4} = \\frac{1}{16}$ is the variance $\\frac{x(1 - x)}{n}$, and doubling $n$ would halve it.\n\n> **Watch out.** The extra term is added, never subtracted: the Bernstein polynomial of $x^{2}$ always lies above $x^{2}$ inside the interval.",
          "对 $f(x) = x^{2}$，伯恩斯坦多项式是 $x^{2} + \\frac{x(1 - x)}{n}$。多出的一项是二项比例的方差，它说明误差随 $n$ 增大而缩小。\n\n取 $n = 4$，在 $x = \\frac{1}{2}$ 处，值是 $\\frac{1}{4} + \\frac{1/4}{4} = \\frac{5}{16}$。\n\n检验：误差 $\\frac{5}{16} - \\frac{1}{4} = \\frac{1}{16}$ 正是方差 $\\frac{x(1 - x)}{n}$，把 $n$ 加倍会使它减半。\n\n> **注意。** 多出的一项是加上去的，从不减去：在区间内部，$x^{2}$ 的伯恩斯坦多项式总在 $x^{2}$ 上方。",
        ],
        (rng) => {
          const q = rng.int(2, 9);
          const p = rng.int(1, q - 1);
          const n = rng.int(2, 15);
          const x = Q.of(p, q);
          const square = Q.of(p * p, q * q);
          const extra = Q.of(p * (q - p), q * q * n);
          const answer = Q.of(p * p * n + p * (q - p), q * q * n);
          return solved(
            [
              `What is the degree ${n} Bernstein polynomial of $x^{2}$, evaluated at $x = ${x.toLatex()}$?`,
              `$x^{2}$ 的 ${n} 次伯恩斯坦多项式在 $x = ${x.toLatex()}$ 处的值是多少？`,
            ],
            answer,
            [
              why(square, "That is $x^{2}$ itself, without the extra term.", "这是 $x^{2}$ 本身，没有多出的一项。"),
              why(extra, "That is only the extra term, without $x^{2}$.", "这只是多出的一项，没有 $x^{2}$。"),
              why(
                Q.of(p * p * n - p * (q - p), q * q * n),
                "That subtracts the extra term instead of adding it.",
                "这把多出的一项减去了，而不是加上。",
              ),
            ],
            solution(
              [
                [
                  ["Compute each part", "分别计算"],
                  [
                    `$x^{2} = ${square.toLatex()}$ and $\\frac{x(1 - x)}{${n}} = ${extra.toLatex()}$.`,
                    `$x^{2} = ${square.toLatex()}$，$\\frac{x(1 - x)}{${n}} = ${extra.toLatex()}$。`,
                  ],
                ],
                [
                  ["Add", "相加"],
                  [
                    `$${square.toLatex()} + ${extra.toLatex()} = ${answer.toLatex()}$.`,
                    `$${square.toLatex()} + ${extra.toLatex()} = ${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `The value $${answer.toLatex()}$ is above $x^{2} = ${square.toLatex()}$ by exactly $${extra.toLatex()}$, which shrinks as the degree grows.`,
                `值 $${answer.toLatex()}$ 比 $x^{2} = ${square.toLatex()}$ 恰好大 $${extra.toLatex()}$，它随次数增大而缩小。`,
              ],
            ),
          );
        },
      ),
      point(
        "the-degree-needed-for-an-accuracy",
        ["The degree needed for an accuracy", "达到精度所需的次数"],
        [
          "For $x^{2}$ the error $\\frac{x(1 - x)}{n}$ is greatest at $x = \\frac{1}{2}$, where it equals $\\frac{1}{4n}$. So the required degree comes from one inequality, and it applies uniformly on the whole interval.\n\nFor an error below $\\frac{1}{100}$ everywhere, we need $\\frac{1}{4n} < \\frac{1}{100}$, that is $n > 25$, so the smallest degree is $26$.\n\nCheck: at $n = 25$ the largest error is $\\frac{1}{100}$ exactly, which is not below $\\frac{1}{100}$.\n\n> **Watch out.** The largest error is $\\frac{1}{4n}$, not $\\frac{1}{n}$, because $x(1 - x)$ is at most $\\frac{1}{4}$.",
          "对 $x^{2}$，误差 $\\frac{x(1 - x)}{n}$ 在 $x = \\frac{1}{2}$ 处最大，等于 $\\frac{1}{4n}$。所以所需次数由一个不等式得出，它在整个区间上一致成立。\n\n要使误差处处小于 $\\frac{1}{100}$，需要 $\\frac{1}{4n} < \\frac{1}{100}$，即 $n > 25$，所以最小次数是 $26$。\n\n检验：$n = 25$ 时最大误差恰好是 $\\frac{1}{100}$，并不小于 $\\frac{1}{100}$。\n\n> **注意。** 最大误差是 $\\frac{1}{4n}$ 而不是 $\\frac{1}{n}$，因为 $x(1 - x)$ 至多是 $\\frac{1}{4}$。",
        ],
        (rng) => {
          const m = rng.int(5, 900);
          const answer = Math.floor(m / 4) + 1;
          return solved(
            [
              `What is the smallest $n$ for which the degree $n$ Bernstein polynomial of $x^{2}$ differs from $x^{2}$ by less than $\\frac{1}{${m}}$ everywhere on $[0, 1]$?`,
              `使 $x^{2}$ 的 $n$ 次伯恩斯坦多项式在整个 $[0, 1]$ 上与 $x^{2}$ 的误差严格小于 $\\frac{1}{${m}}$ 的最小 $n$ 是多少？`,
            ],
            answer,
            [
              why(
                m,
                "That uses $\\frac{1}{n}$ as the largest error, forgetting that $x(1 - x)$ is at most $\\frac{1}{4}$.",
                "这把 $\\frac{1}{n}$ 当作最大误差，忘了 $x(1 - x)$ 至多是 $\\frac{1}{4}$。",
              ),
              why(
                Math.ceil(m / 2),
                "That uses $\\frac{1}{2n}$ as the largest error; at $x = \\frac{1}{2}$ it is $\\frac{1}{4n}$.",
                "这把 $\\frac{1}{2n}$ 当作最大误差；在 $x = \\frac{1}{2}$ 处它是 $\\frac{1}{4n}$。",
              ),
              why(
                Math.floor(m / 4) + 2,
                `That works, but $${answer}$ already gives an error below $\\frac{1}{${m}}$.`,
                `这也满足，但 $${answer}$ 已经使误差小于 $\\frac{1}{${m}}$。`,
              ),
            ],
            solution(
              [
                [
                  ["Find the largest error", "求最大误差"],
                  [
                    "The error $\\frac{x(1 - x)}{n}$ is largest at $x = \\frac{1}{2}$, where it equals $\\frac{1}{4n}$.",
                    "误差 $\\frac{x(1 - x)}{n}$ 在 $x = \\frac{1}{2}$ 处最大，等于 $\\frac{1}{4n}$。",
                  ],
                ],
                [
                  ["Solve the inequality", "解不等式"],
                  [
                    `$\\frac{1}{4n} < \\frac{1}{${m}}$ means $4n > ${m}$, so the smallest $n$ is $${answer}$.`,
                    `$\\frac{1}{4n} < \\frac{1}{${m}}$ 即 $4n > ${m}$，所以最小的 $n$ 是 $${answer}$。`,
                  ],
                ],
              ],
              [
                `$4 \\times ${answer} = ${4 * answer} > ${m}$, while $4 \\times ${answer - 1} = ${4 * (answer - 1)}$ is not more than $${m}$.`,
                `$4 \\times ${answer} = ${4 * answer} > ${m}$，而 $4 \\times ${answer - 1} = ${4 * (answer - 1)}$ 不大于 $${m}$。`,
              ],
            ),
          );
        },
      ),
    ],
  ),
  intro: t(
    "The degree $2$ Bernstein polynomial of $x^{2}$ at $x = \\frac{1}{2}$ averages $0, \\frac{1}{4}, 1$ with weights $\\frac{1}{4}, \\frac{1}{2}, \\frac{1}{4}$, which gives $0 + \\frac{1}{8} + \\frac{1}{4} = \\frac{3}{8}$. The true value is $\\frac{1}{4}$, so the error is $\\frac{1}{8}$.\n\nCheck: the formula $x^{2} + \\frac{x(1 - x)}{n}$ gives $\\frac{1}{4} + \\frac{1/4}{2} = \\frac{3}{8}$ as well.\n\nIn this lesson we evaluate Bernstein polynomials, find the Bernstein polynomial of a square, and find the degree that guarantees a given accuracy.",
    "$x^{2}$ 的 $2$ 次伯恩斯坦多项式在 $x = \\frac{1}{2}$ 处，以权 $\\frac{1}{4}, \\frac{1}{2}, \\frac{1}{4}$ 对 $0, \\frac{1}{4}, 1$ 求平均，得 $0 + \\frac{1}{8} + \\frac{1}{4} = \\frac{3}{8}$。真实值是 $\\frac{1}{4}$，所以误差是 $\\frac{1}{8}$。\n\n检验：公式 $x^{2} + \\frac{x(1 - x)}{n}$ 同样给出 $\\frac{1}{4} + \\frac{1/4}{2} = \\frac{3}{8}$。\n\n本课我们计算伯恩斯坦多项式，求平方函数的伯恩斯坦多项式，并求保证给定精度的次数。",
  ),
};

const arzela = {
  ...topic(
    "equicontinuity-and-the-arzela-ascoli-theorem",
    ["Equicontinuity and the Arzelà-Ascoli Theorem", "等度连续与阿尔泽拉-阿斯科利定理"],
    ["Find when a family of functions has a uniformly convergent subsequence.", "判断函数族何时有一致收敛的子列。"],
    ["uniform-limits-and-continuity"],
    [],
    [
      point(
        "one-delta-for-a-whole-family",
        ["One delta for a whole family", "整族共用一个 delta"],
        [
          "A family is equicontinuous when a single $\\delta$ works for every function and every point. A common bound $L$ on the derivatives gives this, because then $\\delta = \\frac{\\varepsilon}{L}$ works for all of them.\n\nIf every $|f'| \\le 4$ and $\\varepsilon = \\frac{1}{10}$, then $\\delta = \\frac{1}{10} \\div 4 = \\frac{1}{40}$.\n\nCheck: by the mean value theorem, $|x - y| < \\frac{1}{40}$ gives $|f(x) - f(y)| \\le 4|x - y| < \\frac{4}{40} = \\frac{1}{10}$ for every function at once.\n\n> **Watch out.** Divide $\\varepsilon$ by the bound $L$; multiplying by it gives a $\\delta$ that is far too large.",
          "函数族等度连续，是指一个 $\\delta$ 对每个函数和每一点都适用。导数的公共界 $L$ 能保证这一点，因为这时 $\\delta = \\frac{\\varepsilon}{L}$ 对它们都成立。\n\n若每个 $|f'| \\le 4$，且 $\\varepsilon = \\frac{1}{10}$，则 $\\delta = \\frac{1}{10} \\div 4 = \\frac{1}{40}$。\n\n检验：由中值定理，$|x - y| < \\frac{1}{40}$ 对每个函数同时给出 $|f(x) - f(y)| \\le 4|x - y| < \\frac{4}{40} = \\frac{1}{10}$。\n\n> **注意。** 要用界 $L$ 去除 $\\varepsilon$；乘以它得到的 $\\delta$ 太大了。",
        ],
        (rng) => {
          const big = rng.int(2, 20);
          const m = rng.int(2, 50);
          const answer = Q.of(1, big * m);
          return solved(
            [
              `Every function in a family has $|f'(x)| \\le ${big}$. What $\\delta$ does the bound give for $\\varepsilon = \\frac{1}{${m}}$?`,
              `函数族中每个函数都满足 $|f'(x)| \\le ${big}$。对 $\\varepsilon = \\frac{1}{${m}}$，这个界给出什么 $\\delta$？`,
            ],
            answer,
            [
              why(
                Q.of(big, m),
                `That multiplies $\\varepsilon$ by ${big} instead of dividing by it.`,
                `这是把 $\\varepsilon$ 乘以 ${big}，而不是除以它。`,
              ),
              why(
                Q.of(1, m),
                `That is $\\varepsilon$ itself; the slopes up to ${big} stretch distances.`,
                `这是 $\\varepsilon$ 本身；不超过 ${big} 的斜率会把距离拉长。`,
              ),
              why(Q.of(m, big), "That inverts $\\varepsilon$ before dividing.", "这在相除之前把 $\\varepsilon$ 取了倒数。"),
            ],
            solution(
              [
                [
                  ["Use the mean value theorem", "用中值定理"],
                  [
                    `For every function in the family, $|f(x) - f(y)| \\le ${big}|x - y|$.`,
                    `对族中每个函数，$|f(x) - f(y)| \\le ${big}|x - y|$。`,
                  ],
                ],
                [
                  ["Choose delta", "选取 delta"],
                  [
                    `To keep this below $\\frac{1}{${m}}$, take $\\delta = \\frac{1}{${m}} \\div ${big} = ${answer.toLatex()}$.`,
                    `为使它小于 $\\frac{1}{${m}}$，取 $\\delta = \\frac{1}{${m}} \\div ${big} = ${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `$${big} \\times ${answer.toLatex()} = \\frac{1}{${m}}$, so $|x - y| < \\delta$ keeps every $|f(x) - f(y)|$ below $\\frac{1}{${m}}$.`,
                `$${big} \\times ${answer.toLatex()} = \\frac{1}{${m}}$，所以 $|x - y| < \\delta$ 使每个 $|f(x) - f(y)|$ 都小于 $\\frac{1}{${m}}$。`,
              ],
            ),
          );
        },
      ),
      point(
        "which-family-is-equicontinuous",
        ["Which family is equicontinuous", "哪一族等度连续"],
        [
          "Each function in a family may be continuous while the family is not equicontinuous, if steeper and steeper members appear. So check whether the slopes stay bounded across the family on the given interval.\n\nThe family $\\cos(x + n)$ has derivatives $-\\sin(x + n)$, which are at most $1$ in size for every $n$, so it is equicontinuous. The family $\\cos(nx)$ has derivatives $-n \\sin(nx)$, which grow with $n$.\n\nCheck: $\\cos(nx)$ goes from $1$ at $x = 0$ to $-1$ at $x = \\frac{\\pi}{n}$, so no single $\\delta$ keeps all of its members within $1$.\n\n> **Watch out.** Shifting the input by $n$ does not steepen a function, while multiplying the input by $n$ does.",
          "即使每个函数都连续，如果出现越来越陡的成员，这一族也不等度连续。所以要检查在给定区间上整族的斜率是否有界。\n\n函数族 $\\cos(x + n)$ 的导数是 $-\\sin(x + n)$，对每个 $n$ 其绝对值都至多是 $1$，所以它等度连续。函数族 $\\cos(nx)$ 的导数是 $-n \\sin(nx)$，随 $n$ 增大。\n\n检验：$\\cos(nx)$ 从 $x = 0$ 处的 $1$ 变到 $x = \\frac{\\pi}{n}$ 处的 $-1$，所以没有一个 $\\delta$ 能使它的所有成员的变化都小于 $1$。\n\n> **注意。** 把自变量平移 $n$ 不会使函数变陡，而把自变量乘以 $n$ 会。",
        ],
        (rng) => {
          const a = rng.int(2, 30);
          const b = rng.int(2, 9);
          const wave = `f_n(x) = ${a} \\sin(nx)`;
          const power = `f_n(x) = x^{n} + ${b}`;
          const line = `f_n(x) = ${b} n x`;
          return reasoned(
            choose(
              rng,
              [
                `With $n = 1, 2, 3, \\dots$, which family is equicontinuous on $[0, 1]$?`,
                `$n = 1, 2, 3, \\dots$，哪一族在 $[0, 1]$ 上等度连续？`,
              ],
              same(`f_n(x) = ${a} \\sin(x + n)`),
              [same(wave), same(power), same(line)],
              asPair(
                solution(
                  [
                    [
                      ["Differentiate each family", "对每一族求导"],
                      [
                        `The derivatives are $${a} \\cos(x + n)$, $${a} n \\cos(nx)$, $n x^{n-1}$ and $${b} n$.`,
                        `导数分别是 $${a} \\cos(x + n)$、$${a} n \\cos(nx)$、$n x^{n-1}$ 和 $${b} n$。`,
                      ],
                    ],
                    [
                      ["Look for a common bound", "寻找公共界"],
                      [
                        `Only $${a} \\cos(x + n)$ is bounded by one number, ${a}, for every $n$, so only $${a} \\sin(x + n)$ is equicontinuous.`,
                        `只有 $${a} \\cos(x + n)$ 对每个 $n$ 都被同一个数 ${a} 界住，所以只有 $${a} \\sin(x + n)$ 等度连续。`,
                      ],
                    ],
                  ],
                  [
                    `With the slope bound ${a}, the choice $\\delta = \\frac{\\varepsilon}{${a}}$ works for every member of that family at once.`,
                    `有了斜率界 ${a}，取 $\\delta = \\frac{\\varepsilon}{${a}}$ 对这一族的每个成员同时成立。`,
                  ],
                ),
              ),
            ),
            [
              reason(wave, `Its slope at $0$ is $${a} n$, which grows without bound.`, `它在 $0$ 处的斜率是 $${a} n$，无界增大。`),
              reason(
                power,
                "Its slope at $1$ is $n$, so the members near $x = 1$ get steeper without bound.",
                "它在 $1$ 处的斜率是 $n$，所以 $x = 1$ 附近的成员越来越陡。",
              ),
              reason(line, `Its slope is $${b} n$, which grows without bound.`, `它的斜率是 $${b} n$，无界增大。`),
            ],
          );
        },
      ),
      point(
        "a-uniform-bound-for-the-family",
        ["A uniform bound for the family", "函数族的一致界"],
        [
          "The theorem needs two things: the family is pointwise bounded and equicontinuous. Then every sequence in it has a uniformly convergent subsequence. Finding a common bound checks the first condition.\n\nFor $f_n(x) = 3 + \\frac{2 \\cos(nx)}{n}$, the cosine term is at most $\\frac{2}{n} \\le 2$ in size, so $|f_n(x)| \\le 3 + 2 = 5$, and $f_1(0) = 5$ reaches it.\n\nCheck: for $n \\ge 2$ the cosine term is at most $1$ in size, so only $n = 1$ reaches the bound $5$.\n\n> **Watch out.** The two parts add at the worst point: the smallest common bound is the constant's size plus the largest size of the other term.",
          "定理需要两个条件：函数族逐点有界且等度连续。这时其中每个序列都有一致收敛的子列。求出公共界就验证了第一个条件。\n\n对 $f_n(x) = 3 + \\frac{2 \\cos(nx)}{n}$，余弦项的绝对值至多是 $\\frac{2}{n} \\le 2$，所以 $|f_n(x)| \\le 3 + 2 = 5$，而 $f_1(0) = 5$ 取到这个界。\n\n检验：当 $n \\ge 2$ 时余弦项的绝对值至多是 $1$，所以只有 $n = 1$ 取到界 $5$。\n\n> **注意。** 两部分在最坏的点处相加：最小公共界是常数的绝对值加上另一项的最大绝对值。",
        ],
        (rng) => {
          const c = rng.nonZero(-20, 20);
          const d = rng.int(1, 20);
          const size = Math.abs(c);
          const answer = size + d;
          const at = c > 0 ? "\\frac{\\pi}{2}" : "-\\frac{\\pi}{2}";
          return solved(
            [
              `For $n \\ge 1$, let $f_n(x) = ${c} + \\frac{${d} \\sin(nx)}{n}$. What is the smallest common bound for $|f_n(x)|$ over all $x$ and all $n$?`,
              `对 $n \\ge 1$，设 $f_n(x) = ${c} + \\frac{${d} \\sin(nx)}{n}$。对所有 $x$ 和 $n$，$|f_n(x)|$ 的最小公共界是多少？`,
            ],
            answer,
            [
              why(size, "That keeps only the constant and leaves out the sine term.", "这只保留常数，漏掉了正弦项。"),
              why(d, "That keeps only the sine term and leaves out the constant.", "这只保留正弦项，漏掉了常数。"),
              why(
                Math.abs(size - d) + 1,
                "That lets the sine term work against the constant, but at the worst point the two add.",
                "这让正弦项与常数相互抵消，但在最坏的点处两者相加。",
              ),
            ],
            solution(
              [
                [
                  ["Bound each part", "分别求界"],
                  [
                    `The constant has size ${size}, and the sine term has size at most $\\frac{${d}}{n} \\le ${d}$, so $|f_n(x)| \\le ${size} + ${d} = ${answer}$.`,
                    `常数的绝对值是 ${size}，正弦项的绝对值至多是 $\\frac{${d}}{n} \\le ${d}$，所以 $|f_n(x)| \\le ${size} + ${d} = ${answer}$。`,
                  ],
                ],
                [
                  ["Reach the bound", "取到界"],
                  [
                    `At $n = 1$ and $x = ${at}$ the sine is $${c > 0 ? 1 : -1}$, with the same sign as ${c}, so $|f_1(x)| = ${answer}$.`,
                    `在 $n = 1$、$x = ${at}$ 处正弦值是 $${c > 0 ? 1 : -1}$，与 ${c} 同号，所以 $|f_1(x)| = ${answer}$。`,
                  ],
                ],
              ],
              [
                `No smaller number works, because $f_1$ reaches size ${answer}, and no member goes beyond it, because neither part can exceed its own bound.`,
                `更小的数都不行，因为 $f_1$ 取到绝对值 ${answer}；也没有成员超过它，因为两部分都不会超过各自的界。`,
              ],
            ),
          );
        },
      ),
    ],
  ),
  intro: t(
    "The functions $f_n(x) = \\sin(x + n)$ all have slopes at most $1$ in size, so $|x - y| < \\frac{1}{10}$ makes $|f_n(x) - f_n(y)| < \\frac{1}{10}$ for every $n$ at once. They are also all at most $1$ in size.\n\nCheck: the slopes of $\\sin(nx)$ reach $n$ at $x = 0$, so no single $\\delta$ works for that family.\n\nIn this lesson we find one $\\delta$ for a whole family, decide which families are equicontinuous, and find a common bound, the two conditions of the Arzelà-Ascoli theorem.",
    "函数 $f_n(x) = \\sin(x + n)$ 的斜率绝对值都至多是 $1$，所以 $|x - y| < \\frac{1}{10}$ 对每个 $n$ 同时使 $|f_n(x) - f_n(y)| < \\frac{1}{10}$。它们的绝对值也都至多是 $1$。\n\n检验：$\\sin(nx)$ 在 $x = 0$ 处的斜率达到 $n$，所以对那一族没有一个 $\\delta$ 能同时适用。\n\n本课我们为整族求一个 $\\delta$，判断哪些函数族等度连续，并求公共界，这正是阿尔泽拉-阿斯科利定理的两个条件。",
  ),
};

const metricCompactness = {
  ...topic(
    "compactness-in-metric-spaces",
    ["Compactness in Metric Spaces", "度量空间中的紧性"],
    ["Use finite nets of balls, and see why closed and bounded is no longer enough.", "使用球的有限网，并理解为什么闭且有界不再足够。"],
    ["complete-metric-spaces", "open-covers"],
    [],
    [
      {
        ...point(
          "a-net-for-an-interval",
          ["A net for an interval", "区间的网"],
          [
            "A set is totally bounded when finitely many balls of any given radius cover it. On a line, a ball of radius $\\varepsilon$ is an interval of length $2\\varepsilon$, so the count is the length divided by that, rounded up.\n\nTo cover $[0, 5]$ with balls of radius $\\frac{1}{2}$, each ball covers length $1$, so $5$ balls are needed, centred at $\\frac{1}{2}, \\frac{3}{2}, \\dots, \\frac{9}{2}$.\n\nCheck: $4$ balls cover a total length of only $4$, which is less than $5$.\n\n> **Watch out.** A ball of radius $\\varepsilon$ covers length $2\\varepsilon$, twice the radius, so divide the length by the diameter.",
            "集合完全有界，是指对任意给定半径，有限个球就能覆盖它。在直线上，半径为 $\\varepsilon$ 的球是长度为 $2\\varepsilon$ 的区间，所以个数是长度除以它再向上取整。\n\n用半径 $\\frac{1}{2}$ 的球覆盖 $[0, 5]$，每个球覆盖长度 $1$，所以需要 $5$ 个球，球心在 $\\frac{1}{2}, \\frac{3}{2}, \\dots, \\frac{9}{2}$。\n\n检验：$4$ 个球覆盖的总长度只有 $4$，小于 $5$。\n\n> **注意。** 半径为 $\\varepsilon$ 的球覆盖长度 $2\\varepsilon$，是半径的两倍，所以要用长度除以直径。",
          ],
          (rng) => {
            const l = rng.int(3, 60);
            const m = rng.int(2, 9);
            const n = Math.ceil((l * m) / 2);
            return solved(
              [
                `What is the fewest closed balls of radius $\\frac{1}{${m}}$ needed to cover $[0, ${l}]$?`,
                `覆盖 $[0, ${l}]$ 至少需要多少个半径为 $\\frac{1}{${m}}$ 的闭球？`,
              ],
              n,
              [
                why(
                  l * m,
                  `That divides by the radius $\\frac{1}{${m}}$; each ball covers twice that length.`,
                  `这是除以半径 $\\frac{1}{${m}}$；每个球覆盖的长度是它的两倍。`,
                ),
                why(n + 1, `That works, but ${n} balls already cover the interval.`, `这也可以，但 ${n} 个球已经能覆盖这个区间。`),
                why(
                  n - 1,
                  `That many balls cover a total length of only $${Q.of(2 * (n - 1), m).toLatex()}$, less than ${l}.`,
                  `这么多球覆盖的总长度只有 $${Q.of(2 * (n - 1), m).toLatex()}$，小于 ${l}。`,
                ),
              ],
              solution(
                [
                  [
                    ["Find the length of one ball", "求一个球的长度"],
                    [
                      `A closed ball of radius $\\frac{1}{${m}}$ is an interval of length $\\frac{2}{${m}}$.`,
                      `半径为 $\\frac{1}{${m}}$ 的闭球是长度为 $\\frac{2}{${m}}$ 的区间。`,
                    ],
                  ],
                  [
                    ["Divide and round up", "相除并向上取整"],
                    [
                      `$${l} \\div \\frac{2}{${m}} = ${Q.of(l * m, 2).toLatex()}$, which rounds up to ${n}.`,
                      `$${l} \\div \\frac{2}{${m}} = ${Q.of(l * m, 2).toLatex()}$，向上取整是 ${n}。`,
                    ],
                  ],
                ],
                [
                  `${n} balls placed end to end cover length $${Q.of(2 * n, m).toLatex()} \\ge ${l}$, while ${n - 1} cover only $${Q.of(2 * (n - 1), m).toLatex()} < ${l}$.`,
                  `${n} 个球首尾相接覆盖长度 $${Q.of(2 * n, m).toLatex()} \\ge ${l}$，而 ${n - 1} 个只覆盖 $${Q.of(2 * (n - 1), m).toLatex()} < ${l}$。`,
                ],
              ),
            );
          },
        ),
        figure: analysisDrawings1["compactness-in-metric-spaces#a-net-for-an-interval"],
      },
      {
        ...point(
          "a-net-for-a-square",
          ["A net for a square", "正方形的网"],
          [
            "With the maximum metric on the plane, balls are squares. So a square region is covered by a grid of balls, whose count is the square of the number needed along one side.\n\nFor $[0, 3]^{2}$ and radius $\\frac{1}{2}$, each ball is a square of side $1$, so each side needs $3$ balls and the grid has $3^{2} = 9$.\n\nCheck: the $9$ unit squares of the grid fill the area $9$ of $[0, 3]^{2}$ exactly.\n\n> **Watch out.** The count along one side is squared, not doubled: every row of the grid needs its own balls.",
            "在平面的最大值度量下，球是正方形。所以正方形区域可以用球的网格覆盖，个数是一条边上所需个数的平方。\n\n对 $[0, 3]^{2}$ 和半径 $\\frac{1}{2}$，每个球是边长 $1$ 的正方形，所以每条边需要 $3$ 个球，网格共有 $3^{2} = 9$ 个。\n\n检验：网格的 $9$ 个单位正方形恰好填满 $[0, 3]^{2}$ 的面积 $9$。\n\n> **注意。** 一条边上的个数要平方，而不是加倍：网格的每一行都需要自己的球。",
          ],
          (rng) => {
            const m = rng.int(2, 7);
            const l = rng.int(2, 20);
            const side = Math.ceil((l * m) / 2);
            return solved(
              [
                `With the metric $d = \\max(|x_1 - x_2|, |y_1 - y_2|)$, how many closed balls of radius $\\frac{1}{${m}}$ does a grid use to cover $[0, ${l}]^{2}$ with as few as possible?`,
                `在度量 $d = \\max(|x_1 - x_2|, |y_1 - y_2|)$ 下，用网格覆盖 $[0, ${l}]^{2}$，半径为 $\\frac{1}{${m}}$ 的闭球最少用多少个？`,
              ],
              side * side,
              [
                why(2 * side, "That doubles the count along one side; a grid squares it.", "这把一条边上的个数加倍了；网格要求平方。"),
                why(side, "That covers only one row of the square.", "这只覆盖了正方形的一行。"),
                why(
                  (l * m) ** 2,
                  `That uses squares of side $\\frac{1}{${m}}$, the radius; each ball has side $\\frac{2}{${m}}$.`,
                  `这用的是边长为半径 $\\frac{1}{${m}}$ 的正方形；每个球的边长是 $\\frac{2}{${m}}$。`,
                ),
              ],
              solution(
                [
                  [
                    ["Count along one side", "沿一条边计数"],
                    [
                      `Each ball is a square of side $\\frac{2}{${m}}$, and $${l} \\div \\frac{2}{${m}} = ${Q.of(l * m, 2).toLatex()}$ rounds up to ${side}.`,
                      `每个球是边长 $\\frac{2}{${m}}$ 的正方形，$${l} \\div \\frac{2}{${m}} = ${Q.of(l * m, 2).toLatex()}$ 向上取整是 ${side}。`,
                    ],
                  ],
                  [
                    ["Square the count", "把个数平方"],
                    [
                      `The grid has ${side} rows of ${side} balls, so it uses $${side}^{2} = ${side * side}$ balls.`,
                      `网格有 ${side} 行，每行 ${side} 个球，所以共用 $${side}^{2} = ${side * side}$ 个球。`,
                    ],
                  ],
                ],
                [
                  `Each row of ${side} squares spans length $${Q.of(2 * side, m).toLatex()} \\ge ${l}$, and ${side} rows stacked cover the same height.`,
                  `每行 ${side} 个正方形跨过长度 $${Q.of(2 * side, m).toLatex()} \\ge ${l}$，${side} 行叠起来覆盖同样的高度。`,
                ],
              ),
            );
          },
        ),
        figure: analysisDrawings1["compactness-in-metric-spaces#a-net-for-a-square"],
      },
      point(
        "closed-and-bounded-is-not-enough",
        ["Closed and bounded is not enough", "闭且有界不够"],
        [
          "In general metric spaces, compact means complete and totally bounded. An infinite set with the discrete metric is closed and bounded but not compact, and the same happens for the unit ball of an infinite dimensional space.\n\nIn the space of bounded sequences, the sequences with $1$ in place $k$ and $0$ elsewhere all lie in the closed unit ball, and any two of them are at distance $1$. So no subsequence of them converges, and the ball is not compact.\n\nCheck: balls of radius $\\frac{1}{3}$ each contain at most one of these sequences, so finitely many such balls cannot cover the unit ball.\n\n> **Watch out.** The rule that closed and bounded means compact holds in $\\mathbb{R}^{n}$ only; elsewhere, check total boundedness.",
          "在一般度量空间中，紧等于完备且完全有界。带离散度量的无限集闭且有界但不紧，无限维空间的单位球也是这样。\n\n在有界数列空间中，第 $k$ 位为 $1$、其余为 $0$ 的数列都在闭单位球中，任意两个的距离都是 $1$。所以它们没有收敛的子列，这个球不紧。\n\n检验：半径为 $\\frac{1}{3}$ 的球各自至多含这些数列中的一个，所以有限个这样的球覆盖不了单位球。\n\n> **注意。** 闭且有界推出紧，只在 $\\mathbb{R}^{n}$ 中成立；在别处要检验完全有界性。",
        ],
        (rng) => {
          const a = rng.int(1, 30);
          const n = rng.int(2, 9);
          const open: [string, string] = [
            `The open ball of radius ${a} in $\\mathbb{R}^{${n}}$`,
            `$\\mathbb{R}^{${n}}$ 中半径为 ${a} 的开球`,
          ];
          const sequences: [string, string] = [
            `The closed ball of radius ${a} in the space of bounded sequences`,
            `有界数列空间中半径为 ${a} 的闭球`,
          ];
          const discrete: [string, string] = [
            `The integers with the discrete metric, a set of diameter 1`,
            `带离散度量的整数集，其直径为 1`,
          ];
          return reasoned(
            choose(
              rng,
              [`Which of these metric spaces is compact?`, `下面哪个度量空间是紧的？`],
              [`The closed ball of radius ${a} in $\\mathbb{R}^{${n}}$`, `$\\mathbb{R}^{${n}}$ 中半径为 ${a} 的闭球`],
              [open, sequences, discrete],
              asPair(
                solution(
                  [
                    [
                      ["Use the rule in finite dimensions", "用有限维中的规则"],
                      [
                        `In $\\mathbb{R}^{${n}}$ closed and bounded sets are compact, so the closed ball of radius ${a} is compact.`,
                        `在 $\\mathbb{R}^{${n}}$ 中闭且有界的集合是紧的，所以半径为 ${a} 的闭球是紧的。`,
                      ],
                    ],
                    [
                      ["Rule out the others", "排除其他选项"],
                      [
                        "The open ball is not closed, and the other two contain infinitely many points at a fixed distance from each other, so they are not totally bounded.",
                        "开球不是闭的；另外两个含有无穷多个彼此距离固定的点，所以不完全有界。",
                      ],
                    ],
                  ],
                  [
                    `In the open ball, points moving out towards the boundary sphere have no limit inside the ball, which is exactly what compactness forbids.`,
                    `在开球中，向边界球面移动的点在球内没有极限，而这正是紧性所不允许的。`,
                  ],
                ),
              ),
            ),
            [
              [
                open[0],
                "It is not closed: points approaching the boundary have no limit inside it.",
                "它不是闭的：趋向边界的点在其中没有极限。",
              ],
              [
                sequences[0],
                `The sequences with ${a} in one place and $0$ elsewhere lie in it, and any two are at distance ${a}, so no subsequence converges.`,
                `某一位为 ${a}、其余为 $0$ 的数列都在其中，任意两个的距离都是 ${a}，所以没有子列收敛。`,
              ],
              [
                discrete[0],
                "Its infinitely many points are all at distance 1 from each other, so no sequence of different points converges.",
                "它的无穷多个点彼此距离都是 1，所以由不同点组成的序列都不收敛。",
              ],
            ],
          );
        },
      ),
    ],
  ),
  intro: t(
    "The interval $[0, 2]$ is covered by $2$ balls of radius $\\frac{1}{2}$, centred at $\\frac{1}{2}$ and $\\frac{3}{2}$, and by $4$ balls of radius $\\frac{1}{4}$. For every radius, finitely many balls suffice, so $[0, 2]$ is totally bounded.\n\nCheck: $4$ balls of radius $\\frac{1}{4}$ cover a total length of $4 \\times \\frac{1}{2} = 2$, exactly the length of the interval.\n\nIn this lesson we count the balls in a net for an interval and for a square, and see why closed and bounded is not enough for compactness in general.",
    "区间 $[0, 2]$ 可以用 $2$ 个半径为 $\\frac{1}{2}$ 的球覆盖，球心在 $\\frac{1}{2}$ 和 $\\frac{3}{2}$；也可以用 $4$ 个半径为 $\\frac{1}{4}$ 的球覆盖。对每个半径，有限个球都足够，所以 $[0, 2]$ 完全有界。\n\n检验：$4$ 个半径为 $\\frac{1}{4}$ 的球覆盖的总长度是 $4 \\times \\frac{1}{2} = 2$，恰好是区间的长度。\n\n本课我们计算区间和正方形的网中球的个数，并理解为什么一般情况下闭且有界不足以推出紧。",
  ),
};

const metricContinuity = {
  ...topic(
    "continuity-in-metric-spaces",
    ["Continuity in Metric Spaces", "度量空间中的连续性"],
    ["Compute distances between functions, and describe continuity through open sets.", "计算函数之间的距离，并用开集描述连续性。"],
    ["distances-in-metric-spaces", "defining-continuity-at-a-point"],
    [],
    [
      point(
        "two-distances-between-functions",
        ["Two distances between functions", "函数之间的两种距离"],
        [
          "Functions can be measured by the largest gap between them or by the area between them. These two metrics give different numbers, and a sequence can converge in the area metric but not in the largest gap metric.\n\nFor $f(x) = 2x$ and $g(x) = 6x$ on $[0, 1]$, the gap is $4x$. Its largest value is $d_\\infty = 4$, at $x = 1$, and its area is $d_1 = \\int_0^1 4x\\, dx = 2$.\n\nCheck: the area under the gap is a triangle with base $1$ and height $4$, whose area is $\\frac{1 \\times 4}{2} = 2$.\n\n> **Watch out.** The area metric integrates the gap, and the integral of $x$ over $[0, 1]$ is $\\frac{1}{2}$, so $d_1$ is half of $d_\\infty$ here.",
          "函数之间可以用最大差距或它们之间的面积来度量。这两个度量给出不同的数，数列可能按面积度量收敛而不按最大差距度量收敛。\n\n对 $[0, 1]$ 上的 $f(x) = 2x$ 和 $g(x) = 6x$，差距是 $4x$。它的最大值是 $d_\\infty = 4$，在 $x = 1$ 处取到；它的面积是 $d_1 = \\int_0^1 4x\\, dx = 2$。\n\n检验：差距下方的面积是底为 $1$、高为 $4$ 的三角形，面积是 $\\frac{1 \\times 4}{2} = 2$。\n\n> **注意。** 面积度量是对差距积分，而 $x$ 在 $[0, 1]$ 上的积分是 $\\frac{1}{2}$，所以这里 $d_1$ 是 $d_\\infty$ 的一半。",
        ],
        (rng) => {
          const a = rng.pick([-1, 1]) * rng.int(2, 15);
          const b = a > 0 ? a + rng.int(1, 20) : rng.int(2, 20);
          const area = rng.bool();
          const g = b - a;
          const gap = `${g === 1 ? "" : g}x`;
          const answer = area ? Q.of(g, 2) : Q.of(g, 1);
          return solved(
            area
              ? [
                  `On $[0, 1]$, find $d_1(f, g) = \\int_0^1 |f - g|\\, dx$ for $f(x) = ${a}x$ and $g(x) = ${b}x$.`,
                  `在 $[0, 1]$ 上，对 $f(x) = ${a}x$ 和 $g(x) = ${b}x$，求 $d_1(f, g) = \\int_0^1 |f - g|\\, dx$。`,
                ]
              : [
                  `On $[0, 1]$, find $d_\\infty(f, g) = \\sup |f - g|$ for $f(x) = ${a}x$ and $g(x) = ${b}x$.`,
                  `在 $[0, 1]$ 上，对 $f(x) = ${a}x$ 和 $g(x) = ${b}x$，求 $d_\\infty(f, g) = \\sup |f - g|$。`,
                ],
            area ? Q.of(b - a, 2) : b - a,
            area
              ? [
                  why(
                    g,
                    "That is the largest gap $d_\\infty$, not the area between the graphs.",
                    "这是最大差距 $d_\\infty$，不是两图像之间的面积。",
                  ),
                  why(
                    Q.of(g, 3),
                    `That integrates a gap growing like $x^{2}$; the gap $${gap}$ grows like $x$ and integrates to half of ${g}.`,
                    `这是对像 $x^{2}$ 那样增长的差距积分；差距 $${gap}$ 像 $x$ 那样增长，积分是 ${g} 的一半。`,
                  ),
                  why(Q.of(g, 4), "That halves the area once too often.", "这把面积多减半了一次。"),
                ]
              : [
                  why(Q.of(g, 2), "That is the area metric $d_1$, not the largest gap.", "这是面积度量 $d_1$，不是最大差距。"),
                  why(
                    Q.of(g, 3),
                    "That is not where the gap is largest; it grows all the way to $x = 1$.",
                    "差距并不在那里最大；它一直增大到 $x = 1$。",
                  ),
                  why(a + b, "That adds the two slopes instead of subtracting them.", "这把两个斜率相加了，而不是相减。"),
                ],
            solution(
              [
                [
                  ["Find the gap", "求差距"],
                  [
                    `$g(x) - f(x) = ${gap}$, which is at least $0$ on $[0, 1]$, so $|f - g| = ${gap}$.`,
                    `$g(x) - f(x) = ${gap}$，它在 $[0, 1]$ 上不小于 $0$，所以 $|f - g| = ${gap}$。`,
                  ],
                ],
                area
                  ? [
                      ["Integrate the gap", "对差距积分"],
                      [`$\\int_0^1 ${gap}\\, dx = ${answer.toLatex()}$.`, `$\\int_0^1 ${gap}\\, dx = ${answer.toLatex()}$。`],
                    ]
                  : [
                      ["Take the largest value", "取最大值"],
                      [
                        `The gap increases, so its largest value on $[0, 1]$ is at $x = 1$, which gives $${g}$.`,
                        `差距递增，所以它在 $[0, 1]$ 上的最大值在 $x = 1$ 处，得 $${g}$。`,
                      ],
                    ],
              ],
              area
                ? [
                    `The region under the gap is a triangle with base $1$ and height ${g}, whose area is $${answer.toLatex()}$.`,
                    `差距下方的区域是底为 $1$、高为 ${g} 的三角形，面积是 $${answer.toLatex()}$。`,
                  ]
                : [
                    `At $x = 1$, $|f(1) - g(1)| = |${a} - ${b}| = ${g}$, and at every smaller $x$ the gap is smaller.`,
                    `在 $x = 1$ 处，$|f(1) - g(1)| = |${a} - ${b}| = ${g}$，在每个更小的 $x$ 处差距都更小。`,
                  ],
            ),
          );
        },
      ),
      point(
        "the-preimage-of-an-open-set",
        ["The preimage of an open set", "开集的原像"],
        [
          "A function between metric spaces is continuous exactly when the preimage of every open set is open. For a linear function on the line, the preimage of an open interval is an open interval that can be computed directly.\n\nFor $f(x) = 2x + 1$ and the interval $(3, 9)$, solving $3 < 2x + 1 < 9$ gives $1 < x < 4$, so the preimage is $(1, 4)$, of length $3$.\n\nCheck: $f(1) = 3$ and $f(4) = 9$, so $f$ maps the ends of $(1, 4)$ to the ends of $(3, 9)$.\n\n> **Watch out.** The shift moves the preimage but does not change its length; only the slope does, dividing the length by the slope.",
          "度量空间之间的函数连续，当且仅当每个开集的原像都是开集。对直线上的线性函数，开区间的原像是可以直接算出的开区间。\n\n对 $f(x) = 2x + 1$ 和区间 $(3, 9)$，解 $3 < 2x + 1 < 9$ 得 $1 < x < 4$，所以原像是 $(1, 4)$，长度为 $3$。\n\n检验：$f(1) = 3$，$f(4) = 9$，所以 $f$ 把 $(1, 4)$ 的端点映到 $(3, 9)$ 的端点。\n\n> **注意。** 平移只移动原像，不改变它的长度；只有斜率会改变长度，使长度除以斜率。",
        ],
        (rng) => {
          const m = rng.int(2, 12);
          const c = rng.int(-20, 20);
          const p = rng.int(-30, 30);
          const q = p + rng.int(1, 40);
          const answer = Q.of(q - p, m);
          const shift = (v: number) => (c === 0 ? `${v}` : minus(v, c));
          return solved(
            [
              `What is the length of the preimage of $(${p}, ${q})$ under $f(x) = ${m}x${plus(c)}$?`,
              `$(${p}, ${q})$ 在 $f(x) = ${m}x${plus(c)}$ 下的原像的长度是多少？`,
            ],
            answer,
            [
              why(
                q - p,
                `That is the length of $(${p}, ${q})$ itself; the slope ${m} shrinks the preimage.`,
                `这是 $(${p}, ${q})$ 本身的长度；斜率 ${m} 使原像变短。`,
              ),
              why(m * (q - p), `That multiplies by the slope ${m} instead of dividing by it.`, `这是乘以斜率 ${m}，而不是除以它。`),
              why(
                Q.of(q - p + c, m),
                "That lets the shift change the length, but a shift only moves the interval.",
                "这让平移改变了长度，但平移只移动区间。",
              ),
            ],
            solution(
              [
                [
                  ["Solve for x", "解出自变量"],
                  [
                    `$${p} < ${m}x${plus(c)} < ${q}$ means $\\frac{${shift(p)}}{${m}} < x < \\frac{${shift(q)}}{${m}}$.`,
                    `$${p} < ${m}x${plus(c)} < ${q}$ 即 $\\frac{${shift(p)}}{${m}} < x < \\frac{${shift(q)}}{${m}}$。`,
                  ],
                ],
                [
                  ["Subtract the ends", "端点相减"],
                  [
                    `The length is $\\frac{${q - c} - (${p - c})}{${m}} = \\frac{${q - p}}{${m}} = ${answer.toLatex()}$.`,
                    `长度是 $\\frac{${q - c} - (${p - c})}{${m}} = \\frac{${q - p}}{${m}} = ${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `$f$ stretches lengths by the factor ${m}, so the preimage of an interval of length ${q - p} has length $${answer.toLatex()}$, and $${m} \\times ${answer.toLatex()} = ${q - p}$.`,
                `$f$ 把长度拉长 ${m} 倍，所以长度为 ${q - p} 的区间的原像长度是 $${answer.toLatex()}$，而 $${m} \\times ${answer.toLatex()} = ${q - p}$。`,
              ],
            ),
          );
        },
      ),
      point(
        "balls-in-the-discrete-metric",
        ["Balls in the discrete metric", "离散度量中的球"],
        [
          "In the discrete metric every two different points are at distance 1. So a ball of radius at most 1 holds only its center, and a ball of radius greater than 1 holds the whole space. Every set is open here.\n\nIn a set of $5$ points, the open ball of radius $\\frac{1}{2}$ around a point holds $1$ point, and the open ball of radius $2$ holds all $5$.\n\nCheck: the open ball of radius exactly $1$ also holds only its center, because the other points are at distance $1$, which is not less than $1$.\n\n> **Watch out.** All other points are at the same distance $1$, so they are all inside or all outside together.",
          "在离散度量中，任意两个不同的点距离都是 1。所以半径不超过 1 的开球只含球心，半径大于 1 的开球含整个空间。这里每个集合都是开集。\n\n在一个 $5$ 点集合中，以一点为中心、半径为 $\\frac{1}{2}$ 的开球含 $1$ 个点，半径为 $2$ 的开球含全部 $5$ 个点。\n\n检验：半径恰为 $1$ 的开球也只含球心，因为其他点的距离是 $1$，并不小于 $1$。\n\n> **注意。** 其他所有点的距离都是同一个数 $1$，所以它们要么全在球内，要么全在球外。",
        ],
        (rng) => {
          const n = rng.int(3, 60);
          const small = rng.bool();
          const q = rng.int(2, 9);
          const r = small ? Q.of(1, q) : Q.of(q + 1, q);
          return solved(
            [
              `A set of ${n} points has the discrete metric. How many points lie in the open ball of radius $${r.toLatex()}$ around one of them?`,
              `一个 ${n} 点的集合带离散度量。以其中一点为中心、半径为 $${r.toLatex()}$ 的开球中有多少个点？`,
            ],
            small ? 1 : n,
            small
              ? [
                  why(
                    n,
                    "That counts the whole space, but the other points are at distance 1, beyond the radius.",
                    "这数了整个空间，但其他点的距离是 1，超出了半径。",
                  ),
                  why(
                    n - 1,
                    "That counts the other points, but they are outside and only the center is inside.",
                    "这数的是其他点，但它们在球外，只有球心在球内。",
                  ),
                  why(
                    2,
                    "That adds one neighbour, but every other point is at the same distance 1.",
                    "这多加了一个邻点，但其他每个点的距离都同样是 1。",
                  ),
                ]
              : [
                  why(
                    1,
                    "That counts only the center, but the radius is above 1, so the other points are inside too.",
                    "这只数了球心，但半径大于 1，所以其他点也在球内。",
                  ),
                  why(n - 1, "That leaves out the center, which is at distance 0.", "这漏掉了球心，它的距离是 0。"),
                  why(
                    2,
                    "That counts one neighbour, but every other point is at the same distance 1.",
                    "这只数了一个邻点，但其他每个点的距离都同样是 1。",
                  ),
                ],
            solution(
              [
                [
                  ["List the distances", "列出距离"],
                  [
                    `The center is at distance $0$ from itself, and the other ${n - 1} points are all at distance $1$.`,
                    `球心到自身的距离是 $0$，其他 ${n - 1} 个点的距离都是 $1$。`,
                  ],
                ],
                [
                  ["Compare with the radius", "与半径比较"],
                  small
                    ? [
                        `$${r.toLatex()} < 1$, so only the center lies inside, and the ball holds $1$ point.`,
                        `$${r.toLatex()} < 1$，所以只有球心在里面，球中有 $1$ 个点。`,
                      ]
                    : [
                        `$${r.toLatex()} > 1$, so every point lies inside, and the ball holds all ${n} points.`,
                        `$${r.toLatex()} > 1$，所以每个点都在里面，球中有全部 ${n} 个点。`,
                      ],
                ],
              ],
              small
                ? [
                    `A point other than the center is at distance $1$, and $1$ is not less than $${r.toLatex()}$, so it is outside.`,
                    `球心以外的点距离是 $1$，而 $1$ 不小于 $${r.toLatex()}$，所以它在球外。`,
                  ]
                : [
                    `Every distance is $0$ or $1$, both less than $${r.toLatex()}$, so nothing is left out.`,
                    `每个距离都是 $0$ 或 $1$，都小于 $${r.toLatex()}$，所以没有点被漏掉。`,
                  ],
            ),
          );
        },
      ),
    ],
  ),
  intro: t(
    "For $f(x) = 0$ and $g(x) = 2x$ on $[0, 1]$, the largest gap is $d_\\infty(f, g) = 2$, at $x = 1$, while the area between them is $d_1(f, g) = 1$. The same pair of functions has different distances in the two metrics.\n\nCheck: the area between the graphs is a triangle with base $1$ and height $2$, so it is $1$.\n\nIn this lesson we compute two distances between functions, find the preimage of an open set, and describe the balls of the discrete metric.",
    "对 $[0, 1]$ 上的 $f(x) = 0$ 和 $g(x) = 2x$，最大差距是 $d_\\infty(f, g) = 2$，在 $x = 1$ 处取到；而它们之间的面积是 $d_1(f, g) = 1$。同一对函数在两个度量下距离不同。\n\n检验：两图像之间的区域是底为 $1$、高为 $2$ 的三角形，面积是 $1$。\n\n本课我们计算函数之间的两种距离，求开集的原像，并描述离散度量中的球。",
  ),
};

const outerMeasure = {
  ...topic(
    "outer-measure-on-the-line",
    ["Outer Measure on the Line", "直线上的外测度"],
    ["Extend length to more sets through covers by intervals.", "通过区间覆盖把长度推广到更多集合。"],
    ["sets-of-measure-zero"],
    [],
    [
      point(
        "the-measure-of-overlapping-intervals",
        ["The measure of overlapping intervals", "重叠区间的测度"],
        [
          "The outer measure of a union of intervals is the length of what is actually covered, so overlaps count once. In general outer measure is only subadditive: the measure of a union is at most the sum.\n\nThe union $[0, 5] \\cup [3, 8]$ is $[0, 8]$, so its outer measure is $8$, while the two lengths add to $5 + 5 = 10$.\n\nCheck: the overlap $[3, 5]$ has length $2$, and $10 - 2 = 8$.\n\n> **Watch out.** Adding the two lengths counts the overlap twice; that sum is only an upper bound.",
          "区间并的外测度是实际覆盖的长度，所以重叠部分只算一次。一般来说外测度只有次可加性：并的测度不超过各部分之和。\n\n并集 $[0, 5] \\cup [3, 8]$ 就是 $[0, 8]$，所以外测度是 $8$，而两段长度之和是 $5 + 5 = 10$。\n\n检验：重叠部分 $[3, 5]$ 的长度是 $2$，而 $10 - 2 = 8$。\n\n> **注意。** 把两段长度相加会把重叠部分算两次；这个和只是一个上界。",
        ],
        (rng) => {
          const a = rng.int(-20, 10);
          const b = a + rng.int(3, 15);
          const c = rng.int(a + 1, b - 1);
          const d = b + rng.int(1, 12);
          const span = a === 0 ? `${d}` : minus(d, a);
          return solved(
            [`What is the outer measure of $[${a}, ${b}] \\cup [${c}, ${d}]$?`, `$[${a}, ${b}] \\cup [${c}, ${d}]$ 的外测度是多少？`],
            d - a,
            [
              why(
                b - a + (d - c),
                `That adds the two lengths, counting the overlap $[${c}, ${b}]$ twice.`,
                `这把两段长度相加，重叠部分 $[${c}, ${b}]$ 算了两次。`,
              ),
              why(d - c, "That is the length of the second interval only.", "这只是第二个区间的长度。"),
              why(
                b - c,
                `That is the length of the overlap $[${c}, ${b}]$, not of the union.`,
                `这是重叠部分 $[${c}, ${b}]$ 的长度，不是并集的长度。`,
              ),
            ],
            solution(
              [
                [
                  ["Join the intervals", "合并区间"],
                  [
                    `$${c}$ lies in $[${a}, ${b}]$, so the intervals overlap and their union is the single interval $[${a}, ${d}]$.`,
                    `$${c}$ 在 $[${a}, ${b}]$ 内，所以两个区间有重叠，它们的并是一个区间 $[${a}, ${d}]$。`,
                  ],
                ],
                [
                  ["Take the length", "取长度"],
                  [`The outer measure of an interval is its length: $${span} = ${d - a}$.`, `区间的外测度就是长度：$${span} = ${d - a}$。`],
                ],
              ],
              [
                `The two lengths add to $${b - a + (d - c)}$, and removing the overlap of length ${b - c} once gives $${d - a}$.`,
                `两段长度之和是 $${b - a + (d - c)}$，去掉一次长度为 ${b - c} 的重叠部分得 $${d - a}$。`,
              ],
            ),
          );
        },
      ),
      point(
        "covering-a-countable-set-cheaply",
        ["Covering a countable set cheaply", "廉价地覆盖可数集"],
        [
          "To show a countable set has measure zero, give the $k$th point an interval of length $\\frac{\\varepsilon}{2^{k}}$. The total length is then at most $\\varepsilon$, however small $\\varepsilon$ is chosen.\n\nWith $\\varepsilon = \\frac{1}{10}$, the first three points get lengths $\\frac{1}{20}, \\frac{1}{40}, \\frac{1}{80}$, which add to $\\frac{7}{80}$.\n\nCheck: $\\frac{7}{80} = \\frac{1}{10}\\left(1 - \\frac{1}{8}\\right)$, just below $\\varepsilon$.\n\n> **Watch out.** Finitely many of the intervals add to less than $\\varepsilon$; only the whole infinite list adds to $\\varepsilon$ itself.",
          "要证明可数集测度为零，就给第 $k$ 个点一个长度为 $\\frac{\\varepsilon}{2^{k}}$ 的区间。这样总长度不超过 $\\varepsilon$，不管 $\\varepsilon$ 取得多小。\n\n取 $\\varepsilon = \\frac{1}{10}$，前三个点得到的长度是 $\\frac{1}{20}, \\frac{1}{40}, \\frac{1}{80}$，和为 $\\frac{7}{80}$。\n\n检验：$\\frac{7}{80} = \\frac{1}{10}\\left(1 - \\frac{1}{8}\\right)$，略小于 $\\varepsilon$。\n\n> **注意。** 有限个区间的长度之和小于 $\\varepsilon$；只有整个无穷列表的和才等于 $\\varepsilon$ 本身。",
        ],
        (rng) => {
          const n = rng.int(2, 9);
          const m = rng.int(2, 30);
          const answer = Q.of(2 ** n - 1, m * 2 ** n);
          return solved(
            [
              `Points 1 through ${n} of a list get intervals of length $\\frac{\\varepsilon}{2^{k}}$, with $\\varepsilon = \\frac{1}{${m}}$. What is the total length of these ${n} intervals?`,
              `列表中第 1 到第 ${n} 个点得到长度为 $\\frac{\\varepsilon}{2^{k}}$ 的区间，$\\varepsilon = \\frac{1}{${m}}$。这 ${n} 个区间的总长度是多少？`,
            ],
            answer,
            [
              why(
                Q.of(1, m),
                `That is $\\varepsilon$, the total of the whole infinite list, not of the first ${n}.`,
                `这是 $\\varepsilon$，即整个无穷列表的总长度，而不是前 ${n} 个的。`,
              ),
              why(
                Q.of(1, m * 2 ** n),
                `That is only the last interval, the one for point ${n}.`,
                `这只是最后一个区间，即第 ${n} 个点的区间。`,
              ),
              why(
                Q.of(2 ** n + 1, m * 2 ** n),
                `That adds $\\frac{\\varepsilon}{2^{${n}}}$ instead of subtracting it from $\\varepsilon$.`,
                `这是加上 $\\frac{\\varepsilon}{2^{${n}}}$，而不是从 $\\varepsilon$ 中减去它。`,
              ),
            ],
            solution(
              [
                [
                  ["Sum the fractions", "求分数之和"],
                  [
                    `$\\frac{1}{2} + \\frac{1}{4} + \\dots + \\frac{1}{2^{${n}}} = 1 - \\frac{1}{2^{${n}}} = ${Q.of(2 ** n - 1, 2 ** n).toLatex()}$.`,
                    `$\\frac{1}{2} + \\frac{1}{4} + \\dots + \\frac{1}{2^{${n}}} = 1 - \\frac{1}{2^{${n}}} = ${Q.of(2 ** n - 1, 2 ** n).toLatex()}$。`,
                  ],
                ],
                [
                  ["Multiply by epsilon", "乘以精度"],
                  [
                    `$\\frac{1}{${m}} \\times ${Q.of(2 ** n - 1, 2 ** n).toLatex()} = ${answer.toLatex()}$.`,
                    `$\\frac{1}{${m}} \\times ${Q.of(2 ** n - 1, 2 ** n).toLatex()} = ${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `The total falls short of $\\varepsilon = \\frac{1}{${m}}$ by exactly the last length $${Q.of(1, m * 2 ** n).toLatex()}$, as it should.`,
                `总长度比 $\\varepsilon = \\frac{1}{${m}}$ 恰好少最后一段的长度 $${Q.of(1, m * 2 ** n).toLatex()}$，符合预期。`,
              ],
            ),
          );
        },
      ),
      point(
        "removing-a-null-set",
        ["Removing a null set", "去掉零测集"],
        [
          "Removing a set of measure zero does not change the measure. So an interval and the same interval with its rationals removed have the same length, even though one looks far thinner than the other.\n\nThe set $([0, 2] \\cup [5, 6]) \\setminus \\mathbb{Q}$ has measure $2 + 1 = 3$, the same as $[0, 2] \\cup [5, 6]$.\n\nCheck: the measure of the union is the measure of the irrational part plus the measure of the rationals in it, and the second is $0$.\n\n> **Watch out.** The gap between the two intervals is not part of the set, so measure the two pieces separately and add them.",
          "去掉测度为零的集合不改变测度。所以一个区间与去掉其中有理数后的区间长度相同，尽管后者看起来薄得多。\n\n集合 $([0, 2] \\cup [5, 6]) \\setminus \\mathbb{Q}$ 的测度是 $2 + 1 = 3$，与 $[0, 2] \\cup [5, 6]$ 相同。\n\n检验：并集的测度等于无理部分的测度加上其中有理数的测度，而后者是 $0$。\n\n> **注意。** 两个区间之间的空隙不属于这个集合，所以要分别量出两段再相加。",
        ],
        (rng) => {
          const a = rng.int(-20, 20);
          const b = a + rng.int(1, 25);
          const c = b + rng.int(1, 8);
          const d = c + rng.int(1, 25);
          const answer = b - a + d - c;
          return solved(
            [
              `What is the Lebesgue measure of $([${a}, ${b}] \\cup [${c}, ${d}]) \\setminus \\mathbb{Q}$?`,
              `$([${a}, ${b}] \\cup [${c}, ${d}]) \\setminus \\mathbb{Q}$ 的勒贝格测度是多少？`,
            ],
            answer,
            [
              why(
                0,
                "That treats removing the rationals as removing everything, but the rationals have measure zero.",
                "这把去掉有理数当成去掉了一切，但有理数的测度为零。",
              ),
              why(
                d - a,
                `That includes the gap $(${b}, ${c})$, which is not in the set.`,
                `这把空隙 $(${b}, ${c})$ 也算进去了，而它不在集合中。`,
              ),
              why(b - a, "That measures only the first interval.", "这只量了第一个区间。"),
            ],
            solution(
              [
                [
                  ["Remove the rationals", "去掉有理数"],
                  [
                    "The rationals are countable, so they have measure zero, and removing them leaves the measure unchanged.",
                    "有理数可数，所以测度为零，去掉它们不改变测度。",
                  ],
                ],
                [
                  ["Add the two lengths", "两段长度相加"],
                  [
                    `The intervals are disjoint because $${b} < ${c}$, so the measure is $${b - a} + ${d - c} = ${answer}$.`,
                    `因为 $${b} < ${c}$，两个区间不相交，所以测度是 $${b - a} + ${d - c} = ${answer}$。`,
                  ],
                ],
              ],
              [
                `The union has measure ${answer}, which is the irrational part plus the rationals in it, and the rationals add $0$.`,
                `并集的测度是 ${answer}，等于无理部分加上其中的有理数，而有理数贡献 $0$。`,
              ],
            ),
          );
        },
      ),
    ],
  ),
  intro: t(
    "The intervals $[0, 2]$ and $[1, 4]$ together cover $[0, 4]$, so the outer measure of their union is $4$, not $2 + 3 = 5$.\n\nCheck: the overlap $[1, 2]$ has length $1$, and $5 - 1 = 4$.\n\nIn this lesson we measure overlapping intervals, cover a countable set by intervals of tiny total length, and see that removing a null set leaves the measure unchanged.",
    "区间 $[0, 2]$ 和 $[1, 4]$ 合起来覆盖 $[0, 4]$，所以它们的并的外测度是 $4$，而不是 $2 + 3 = 5$。\n\n检验：重叠部分 $[1, 2]$ 的长度是 $1$，而 $5 - 1 = 4$。\n\n本课我们量重叠区间的测度，用总长度很小的区间覆盖可数集，并看到去掉零测集不改变测度。",
  ),
};

const lebesgue = {
  ...topic(
    "the-lebesgue-integral-of-simple-functions",
    ["The Lebesgue Integral of Simple Functions", "简单函数的勒贝格积分"],
    [
      "Integrate by slicing the range, and meet functions that the Riemann integral cannot handle.",
      "通过切分值域积分，认识黎曼积分处理不了的函数。",
    ],
    ["outer-measure-on-the-line"],
    [],
    [
      point(
        "adding-value-times-measure",
        ["Adding value times measure", "值乘测度相加"],
        [
          "A simple function takes finitely many values, each on a measurable set. Its integral adds each value times the measure of the set where it is taken, with no requirement that those sets be intervals.\n\nA function equal to $4$ on a set of measure $2$ and to $-3$ on a disjoint set of measure $5$ has integral $4 \\times 2 + (-3) \\times 5 = -7$.\n\nCheck: if the sets were the intervals $[0, 2]$ and $[2, 7]$, the area above the axis would be $8$ and the area below it $15$, and $8 - 15 = -7$.\n\n> **Watch out.** Each value is weighted by its own measure; adding the values or adding the measures alone gives no integral.",
          "简单函数只取有限个值，每个值在一个可测集上取到。它的积分把每个值乘取到该值的集合的测度再相加，不要求这些集合是区间。\n\n一个函数在测度为 $2$ 的集合上等于 $4$，在另一个不相交的测度为 $5$ 的集合上等于 $-3$，它的积分是 $4 \\times 2 + (-3) \\times 5 = -7$。\n\n检验：如果这些集合是区间 $[0, 2]$ 和 $[2, 7]$，轴上方的面积是 $8$，轴下方的面积是 $15$，而 $8 - 15 = -7$。\n\n> **注意。** 每个值要用它自己的测度加权；只把值相加或只把测度相加都得不到积分。",
        ],
        (rng) => {
          const [c1, c2, c3] = [rng.int(-9, 12), rng.int(-9, 12), rng.int(-9, 12)];
          const [m1, m2, m3] = [rng.int(1, 9), rng.int(1, 9), rng.int(1, 9)];
          const answer = c1 * m1 + c2 * m2 + c3 * m3;
          const par = (v: number) => (v < 0 ? `(${v})` : `${v}`);
          const two = c1 * m1 + c2 * m2;
          return solved(
            [
              `A simple function takes the value ${c1} on a set of measure ${m1}, ${c2} on a set of measure ${m2} and ${c3} on a set of measure ${m3}, these sets being disjoint. What is its integral?`,
              `简单函数在测度为 ${m1} 的集合上取 ${c1}，在测度为 ${m2} 的集合上取 ${c2}，在测度为 ${m3} 的集合上取 ${c3}，这些集合互不相交。它的积分是多少？`,
            ],
            answer,
            [
              why(c1 + c2 + c3, "That adds the values without weighting them by their measures.", "这把值相加，却没有用测度加权。"),
              why(
                m1 + m2 + m3,
                "That adds the measures, which gives the total measure, not the integral.",
                "这把测度相加，得到的是总测度，不是积分。",
              ),
              why(two, "That leaves out the third set.", "这漏掉了第三个集合。"),
            ],
            solution(
              [
                [
                  ["Multiply each value by its measure", "每个值乘它的测度"],
                  [
                    `The products are $${c1 * m1}$, $${c2 * m2}$ and $${c3 * m3}$.`,
                    `乘积分别是 $${c1 * m1}$、$${c2 * m2}$ 和 $${c3 * m3}$。`,
                  ],
                ],
                [
                  ["Add the products", "把乘积相加"],
                  [
                    `$${par(c1 * m1)} + ${par(c2 * m2)} + ${par(c3 * m3)} = ${answer}$.`,
                    `$${par(c1 * m1)} + ${par(c2 * m2)} + ${par(c3 * m3)} = ${answer}$。`,
                  ],
                ],
              ],
              [
                `The first two sets contribute $${two}$ together, and the third adds $${c3 * m3}$, which gives $${answer}$ again.`,
                `前两个集合共贡献 $${two}$，第三个再加 $${c3 * m3}$，同样得 $${answer}$。`,
              ],
            ),
          );
        },
      ),
      point(
        "a-function-that-riemann-cannot-integrate",
        ["A function that Riemann cannot integrate", "黎曼积分处理不了的函数"],
        [
          "A function equal to one constant on the rationals and another on the irrationals has no Riemann integral, since upper and lower sums disagree. The Lebesgue integral exists, and the rationals contribute nothing because their measure is zero.\n\nOn $[0, 3]$, let $f = 7$ on the rationals and $f = 2$ on the irrationals. The integral is $7 \\times 0 + 2 \\times 3 = 6$.\n\nCheck: every Riemann upper sum is $7 \\times 3 = 21$ and every lower sum is $2 \\times 3 = 6$, so the Riemann integral does not exist, while the Lebesgue value is $6$.\n\n> **Watch out.** The rationals are dense, but density does not give them measure: their value is weighted by $0$.",
          "在有理数上取一个常数、在无理数上取另一个常数的函数没有黎曼积分，因为上和与下和不相等。勒贝格积分存在，有理数因测度为零而没有贡献。\n\n在 $[0, 3]$ 上，设 $f$ 在有理数上等于 $7$，在无理数上等于 $2$。积分是 $7 \\times 0 + 2 \\times 3 = 6$。\n\n检验：每个黎曼上和都是 $7 \\times 3 = 21$，每个下和都是 $2 \\times 3 = 6$，所以黎曼积分不存在，而勒贝格积分的值是 $6$。\n\n> **注意。** 有理数稠密，但稠密不等于有测度：它们的值的权是 $0$。",
        ],
        (rng) => {
          const c = rng.int(1, 15);
          const d = c + rng.int(1, 15);
          const a = rng.int(-9, 9);
          const b = a + rng.int(1, 12);
          const len = b - a;
          const span = a === 0 ? `${b}` : minus(b, a);
          return solved(
            [
              `On $[${a}, ${b}]$, $f(x) = ${d}$ for rational $x$ and $f(x) = ${c}$ for irrational $x$. What is the Lebesgue integral of $f$?`,
              `在 $[${a}, ${b}]$ 上，当 $x$ 是有理数时 $f(x) = ${d}$，当 $x$ 是无理数时 $f(x) = ${c}$。$f$ 的勒贝格积分是多少？`,
            ],
            c * len,
            [
              why(
                d * len,
                `That uses the value ${d} on the rationals, but the rationals have measure zero.`,
                `这用了有理数上的值 ${d}，但有理数的测度为零。`,
              ),
              why(
                (c + d) * len,
                "That counts both values over the whole interval, but each holds on its own set.",
                "这把两个值都算在整个区间上，但每个值只在自己的集合上成立。",
              ),
              why(
                0,
                "That treats the function as having no integral, but the Lebesgue integral exists.",
                "这把函数当成没有积分，但勒贝格积分是存在的。",
              ),
            ],
            solution(
              [
                [
                  ["Measure the two sets", "量两个集合"],
                  [
                    `The rationals in $[${a}, ${b}]$ have measure $0$, so the irrationals have measure $${span} = ${len}$.`,
                    `$[${a}, ${b}]$ 中的有理数测度为 $0$，所以无理数的测度是 $${span} = ${len}$。`,
                  ],
                ],
                [
                  ["Add value times measure", "值乘测度相加"],
                  [
                    `The integral is $${d} \\times 0 + ${c} \\times ${len} = ${c * len}$.`,
                    `积分是 $${d} \\times 0 + ${c} \\times ${len} = ${c * len}$。`,
                  ],
                ],
              ],
              [
                `$f$ equals the constant ${c} except on a set of measure zero, and the constant ${c} integrates to $${c * len}$ over an interval of length ${len}.`,
                `$f$ 除一个零测集外都等于常数 ${c}，而常数 ${c} 在长度为 ${len} 的区间上的积分是 $${c * len}$。`,
              ],
            ),
          );
        },
      ),
      point(
        "when-a-limit-escapes-the-integral",
        ["When a limit escapes the integral", "极限逃出积分"],
        [
          "A limit cannot always pass inside an integral. Tall thin spikes can tend to zero at every point while keeping a fixed area, and the dominated convergence theorem excludes this by requiring one integrable upper bound.\n\nLet $f_n = n$ on $\\left(0, \\frac{1}{n}\\right)$ and $0$ elsewhere. Each $\\int f_n\\, dx = n \\times \\frac{1}{n} = 1$, but $f_n(x) \\to 0$ at every $x$, so $\\int \\lim f_n\\, dx = 0$.\n\nCheck: at $x = \\frac{1}{10}$, $f_n(x) = 0$ as soon as $n \\ge 10$, because the spike then ends before $\\frac{1}{10}$.\n\n> **Watch out.** The limit of the integrals and the integral of the limit are different questions here, so read which order the problem asks for.",
          "极限不总能移到积分号内。高而窄的尖峰可以在每点趋于零，同时保持固定面积；控制收敛定理通过要求一个可积的上界排除这种情况。\n\n设 $f_n$ 在 $\\left(0, \\frac{1}{n}\\right)$ 上等于 $n$，其他地方为 $0$。每个 $\\int f_n\\, dx = n \\times \\frac{1}{n} = 1$，但 $f_n(x)$ 在每个 $x$ 处都趋于 $0$，所以 $\\int \\lim f_n\\, dx = 0$。\n\n检验：在 $x = \\frac{1}{10}$ 处，只要 $n \\ge 10$ 就有 $f_n(x) = 0$，因为尖峰在 $\\frac{1}{10}$ 之前就结束了。\n\n> **注意。** 这里积分的极限与极限的积分是两个不同的问题，所以要看清题目问的是哪种顺序。",
        ],
        (rng) => {
          const a = rng.int(2, 30);
          const b = rng.int(2, 9);
          const inner = rng.bool();
          return solved(
            inner
              ? [
                  `Let $f_n = ${a} n$ on $\\left(0, \\frac{${b}}{n}\\right)$ and 0 elsewhere. What is $\\int \\lim_{n \\to \\infty} f_n\\, dx$?`,
                  `设 $f_n$ 在 $\\left(0, \\frac{${b}}{n}\\right)$ 上等于 $${a} n$，其他地方为 0。$\\int \\lim_{n \\to \\infty} f_n\\, dx$ 是多少？`,
                ]
              : [
                  `Let $f_n = ${a} n$ on $\\left(0, \\frac{${b}}{n}\\right)$ and 0 elsewhere. What is $\\lim_{n \\to \\infty} \\int f_n\\, dx$?`,
                  `设 $f_n$ 在 $\\left(0, \\frac{${b}}{n}\\right)$ 上等于 $${a} n$，其他地方为 0。$\\lim_{n \\to \\infty} \\int f_n\\, dx$ 是多少？`,
                ],
            inner ? 0 : a * b,
            inner
              ? [
                  why(
                    a * b,
                    "That is the limit of the integrals; the question asks for the integral of the limit.",
                    "这是积分的极限；题目问的是极限的积分。",
                  ),
                  why(
                    a,
                    `That is the height factor ${a}, but every point eventually lies outside the spike.`,
                    `这是高度因子 ${a}，但每一点最终都在尖峰之外。`,
                  ),
                  why(
                    b,
                    `That is the width factor ${b}, but every point eventually lies outside the spike.`,
                    `这是宽度因子 ${b}，但每一点最终都在尖峰之外。`,
                  ),
                ]
              : [
                  why(
                    0,
                    "That is the integral of the limit; the question asks for the limit of the integrals.",
                    "这是极限的积分；题目问的是积分的极限。",
                  ),
                  why(a, `That uses the height factor ${a} alone and leaves out the width.`, `这只用了高度因子 ${a}，漏掉了宽度。`),
                  why(b, `That uses the width factor ${b} alone and leaves out the height.`, `这只用了宽度因子 ${b}，漏掉了高度。`),
                ],
            solution(
              inner
                ? [
                    [
                      ["Find the limit at each point", "求每一点的极限"],
                      [
                        `For $x > 0$, once $n > \\frac{${b}}{x}$ the spike ends before $x$, so $f_n(x) = 0$; for $x \\le 0$, $f_n(x) = 0$ always.`,
                        `对 $x > 0$，一旦 $n > \\frac{${b}}{x}$，尖峰就在 $x$ 之前结束，所以 $f_n(x) = 0$；对 $x \\le 0$，总有 $f_n(x) = 0$。`,
                      ],
                    ],
                    [
                      ["Integrate the limit", "对极限积分"],
                      ["The limit function is $0$ everywhere, so its integral is $0$.", "极限函数处处为 $0$，所以它的积分是 $0$。"],
                    ],
                  ]
                : [
                    [
                      ["Integrate each spike", "对每个尖峰积分"],
                      [
                        `$\\int f_n\\, dx = ${a} n \\times \\frac{${b}}{n} = ${a * b}$ for every $n$.`,
                        `对每个 $n$，$\\int f_n\\, dx = ${a} n \\times \\frac{${b}}{n} = ${a * b}$。`,
                      ],
                    ],
                    [
                      ["Take the limit", "取极限"],
                      [
                        `The integrals are all $${a * b}$, so their limit is $${a * b}$.`,
                        `这些积分都是 $${a * b}$，所以它们的极限是 $${a * b}$。`,
                      ],
                    ],
                  ],
              [
                `The two orders give $${a * b}$ and $0$; they differ because no single integrable function lies above every $f_n$, so dominated convergence does not apply.`,
                `两种顺序分别给出 $${a * b}$ 和 $0$；它们不同，是因为没有一个可积函数位于每个 $f_n$ 之上，所以控制收敛定理不适用。`,
              ],
            ),
          );
        },
      ),
    ],
  ),
  intro: t(
    "A simple function equal to $3$ on a set of measure $2$ and to $5$ on a disjoint set of measure $1$ has integral $3 \\times 2 + 5 \\times 1 = 11$. The sets may be scattered, and only their measures matter.\n\nCheck: if the sets are the intervals $[0, 2]$ and $[2, 3]$, the area under the graph is $6 + 5 = 11$ as well.\n\nIn this lesson we add value times measure, integrate a function that the Riemann integral cannot handle, and see a limit that cannot pass inside the integral.",
    "一个简单函数在测度为 $2$ 的集合上等于 $3$，在另一个不相交的测度为 $1$ 的集合上等于 $5$，它的积分是 $3 \\times 2 + 5 \\times 1 = 11$。这些集合可以是分散的，只有它们的测度起作用。\n\n检验：如果这些集合是区间 $[0, 2]$ 和 $[2, 3]$，图像下方的面积同样是 $6 + 5 = 11$。\n\n本课我们把值乘测度相加，积分一个黎曼积分处理不了的函数，并看到一个不能移到积分号内的极限。",
  ),
};

const baire = {
  ...topic(
    "nowhere-dense-sets-and-the-baire-category-theorem",
    ["Nowhere Dense Sets and the Baire Category Theorem", "无处稠密集与贝尔纲定理"],
    [
      "Tell thin sets from large ones by category, and use that a complete space is not a countable union of thin sets.",
      "用纲区分稀疏集合和大集合，并利用完备空间不是可数个稀疏集合的并。",
    ],
    ["limit-points-and-closures", "complete-metric-spaces"],
    [],
    [
      point(
        "which-set-is-nowhere-dense",
        ["Which set is nowhere dense", "哪个集合无处稠密"],
        [
          "A set is nowhere dense when its closure contains no interval. So the integers and the Cantor set are nowhere dense, while the rationals are not, since their closure is the entire line.\n\nThe set $\\left\\{ \\frac{1}{n} : n \\ge 1 \\right\\}$ has closure $\\left\\{ \\frac{1}{n} : n \\ge 1 \\right\\} \\cup \\{0\\}$, a list of points with one limit, so it is nowhere dense.\n\nCheck: the interval $\\left(\\frac{1}{3}, \\frac{1}{2}\\right)$ contains no point of that closure, and every interval contains such a gap.\n\n> **Watch out.** Take the closure first: the rationals in an interval contain no interval themselves, but their closure is the whole interval.",
          "集合无处稠密，是指它的闭包不含区间。所以整数集和康托尔集无处稠密，而有理数不是，因为它们的闭包是整条直线。\n\n集合 $\\left\\{ \\frac{1}{n} : n \\ge 1 \\right\\}$ 的闭包是 $\\left\\{ \\frac{1}{n} : n \\ge 1 \\right\\} \\cup \\{0\\}$，即一列只有一个极限的点，所以它无处稠密。\n\n检验：区间 $\\left(\\frac{1}{3}, \\frac{1}{2}\\right)$ 不含这个闭包的任何点，而每个区间都含有这样的空隙。\n\n> **注意。** 要先取闭包：区间中的有理数本身不含区间，但它们的闭包是整个区间。",
        ],
        (rng) => {
          const a = rng.int(-20, 20);
          const b = a + rng.int(1, 20);
          const k = rng.int(2, 30);
          const dense = `\\mathbb{Q} \\cap [${a}, ${b}]`;
          const open = `(${a}, ${b})`;
          const irrational = `[${a}, ${b}] \\setminus \\mathbb{Q}`;
          return reasoned(
            choose(
              rng,
              [`Which set is nowhere dense in $\\mathbb{R}$?`, `哪个集合在 $\\mathbb{R}$ 中无处稠密？`],
              same(`\\left\\{ ${a === 0 ? "" : `${a} + `}\\frac{${k}}{n} : n \\ge 1 \\right\\}`),
              [same(dense), same(open), same(irrational)],
              asPair(
                solution(
                  [
                    [
                      ["Take each closure", "求各自的闭包"],
                      [
                        `The points $${a === 0 ? "" : `${a} + `}\\frac{${k}}{n}$ approach only $${a}$, so their closure adds just that point. The other three sets all have closure $[${a}, ${b}]$.`,
                        `点 $${a === 0 ? "" : `${a} + `}\\frac{${k}}{n}$ 只趋近 $${a}$，所以它们的闭包只增加这一点。另外三个集合的闭包都是 $[${a}, ${b}]$。`,
                      ],
                    ],
                    [
                      ["Look for an interval", "寻找区间"],
                      [
                        `$[${a}, ${b}]$ contains an interval, while a sequence of points with one limit contains none, so only the first set is nowhere dense.`,
                        `$[${a}, ${b}]$ 含有区间，而只有一个极限的点列不含任何区间，所以只有第一个集合无处稠密。`,
                      ],
                    ],
                  ],
                  [
                    `Between two neighbouring points $${a === 0 ? "" : `${a} + `}\\frac{${k}}{n + 1}$ and $${a === 0 ? "" : `${a} + `}\\frac{${k}}{n}$ there is a gap with no point of the closure, so no interval fits inside it.`,
                    `在相邻两点 $${a === 0 ? "" : `${a} + `}\\frac{${k}}{n + 1}$ 和 $${a === 0 ? "" : `${a} + `}\\frac{${k}}{n}$ 之间有一段不含闭包中任何点的空隙，所以闭包里放不下任何区间。`,
                  ],
                ),
              ),
            ),
            [
              reason(dense, `Its closure is the whole interval $[${a}, ${b}]$.`, `它的闭包是整个区间 $[${a}, ${b}]$。`),
              reason(open, "It is itself an interval, so its closure contains one.", "它本身就是区间，所以它的闭包含有区间。"),
              reason(
                irrational,
                `The irrationals are dense, so its closure is the whole interval $[${a}, ${b}]$.`,
                `无理数稠密，所以它的闭包是整个区间 $[${a}, ${b}]$。`,
              ),
            ],
          );
        },
      ),
      point(
        "the-interior-of-a-closure",
        ["The interior of a closure", "闭包的内部"],
        [
          "To test a set, take its closure first and then look for an interval inside. A dense part of an interval has that whole interval as its closure, so the length of the interior of the closure can be large.\n\nFor $S = (\\mathbb{Q} \\cap [0, 4]) \\cup \\{6\\}$, the closure is $[0, 4] \\cup \\{6\\}$, whose interior is $(0, 4)$, of length $4$.\n\nCheck: the point $6$ is isolated, and a single point has no interior, so it adds nothing to the length.\n\n> **Watch out.** Isolated points stay in the closure but add no length, and the gap before them is not filled in.",
          "检验集合时，先取闭包，再看里面有没有区间。区间中稠密的部分以整个区间为闭包，所以闭包内部的长度可能很大。\n\n对 $S = (\\mathbb{Q} \\cap [0, 4]) \\cup \\{6\\}$，闭包是 $[0, 4] \\cup \\{6\\}$，它的内部是 $(0, 4)$，长度为 $4$。\n\n检验：点 $6$ 是孤立点，单点没有内部，所以它不增加长度。\n\n> **注意。** 孤立点留在闭包中，但不增加长度，它们之前的空隙也不会被填满。",
        ],
        (rng) => {
          const a = rng.int(-20, 10);
          const b = a + rng.int(1, 15);
          const c = b + rng.int(1, 6);
          const n = rng.int(1, 5);
          const list = Array.from({ length: n }, (_, i) => c + i);
          return solved(
            [
              `Let $S = (\\mathbb{Q} \\cap [${a}, ${b}]) \\cup \\{${list.join(", ")}\\}$. What is the length of the interior of the closure of $S$?`,
              `设 $S = (\\mathbb{Q} \\cap [${a}, ${b}]) \\cup \\{${list.join(", ")}\\}$。$S$ 的闭包的内部长度是多少？`,
            ],
            b - a,
            [
              why(
                0,
                "That looks at the rationals themselves, but their closure is the whole interval.",
                "这看的是有理数本身，但它们的闭包是整个区间。",
              ),
              why(
                b - a + n,
                "That gives each isolated point length 1, but a point has no length.",
                "这给每个孤立点算了长度 1，但点没有长度。",
              ),
              why(
                c - a,
                `That fills in the gap $(${b}, ${c})$, which holds no point of $S$.`,
                `这把空隙 $(${b}, ${c})$ 填满了，而那里没有 $S$ 的点。`,
              ),
            ],
            solution(
              [
                [
                  ["Take the closure", "求闭包"],
                  [
                    `The rationals are dense in $[${a}, ${b}]$, so the closure of $S$ is $[${a}, ${b}]$ together with the isolated ${n === 1 ? "point" : "points"} $${list.join(", ")}$.`,
                    `有理数在 $[${a}, ${b}]$ 中稠密，所以 $S$ 的闭包是 $[${a}, ${b}]$ 加上孤立点 $${list.join(", ")}$。`,
                  ],
                ],
                [
                  ["Take the interior", "求内部"],
                  [
                    `The interior is $(${a}, ${b})$, since isolated points have no interior, so its length is $${b - a}$.`,
                    `内部是 $(${a}, ${b})$，因为孤立点没有内部，所以长度是 $${b - a}$。`,
                  ],
                ],
              ],
              [
                `Every small interval around ${c} contains points outside the closure, so ${c} is not interior, and the length stays $${b - a}$.`,
                `${c} 附近的每个小区间都含有闭包外的点，所以 ${c} 不是内点，长度仍是 $${b - a}$。`,
              ],
            ),
          );
        },
      ),
      point(
        "using-the-category-theorem",
        ["Using the category theorem", "使用纲定理"],
        [
          "The Baire theorem says a complete metric space is not a countable union of nowhere dense sets. So on the line, the complement of such a union is dense and even uncountable in every interval.\n\nThe rationals are a countable union of single points, each nowhere dense, so $[0, 1] \\setminus \\mathbb{Q}$ is dense in $[0, 1]$, which is true: the irrationals are dense.\n\nCheck: if some subinterval held no irrational, it would be a countable union of points, and the theorem says a closed interval is never that.\n\n> **Watch out.** The theorem is about category, not measure: the complement must be dense, but its measure can be smaller than the length of the interval.",
          "贝尔定理说，完备度量空间不是可数个无处稠密集的并。所以在直线上，这种并的补集是稠密的，并且在每个区间中都不可数。\n\n有理数是可数个单点的并，每个单点都无处稠密，所以 $[0, 1] \\setminus \\mathbb{Q}$ 在 $[0, 1]$ 中稠密，这是对的：无理数是稠密的。\n\n检验：如果某个子区间不含无理数，它就是可数个点的并，而定理说闭区间永远不是这样。\n\n> **注意。** 这个定理讲的是纲，不是测度：补集必须稠密，但它的测度可以小于区间的长度。",
        ],
        (rng) => {
          const a = rng.int(-30, 20);
          const b = a + rng.int(1, 20);
          const empty: [string, string] = [`It is empty`, `它是空集`];
          const full: [string, string] = [`It has measure ${b - a}`, `它的测度是 ${b - a}`];
          const finite: [string, string] = [`It is finite`, `它是有限集`];
          return reasoned(
            choose(
              rng,
              [
                `$S$ is a countable union of nowhere dense subsets of $\\mathbb{R}$. What must be true of $[${a}, ${b}] \\setminus S$?`,
                `$S$ 是 $\\mathbb{R}$ 的可数个无处稠密子集的并。$[${a}, ${b}] \\setminus S$ 一定满足什么？`,
              ],
              [`It is not empty, and in fact it is dense in $[${a}, ${b}]$`, `它不是空集，而且在 $[${a}, ${b}]$ 中稠密`],
              [empty, full, finite],
              asPair(
                solution(
                  [
                    [
                      ["Suppose an interval is missed", "假设漏掉一个区间"],
                      [
                        `If some closed subinterval of $[${a}, ${b}]$ contained no point of $[${a}, ${b}] \\setminus S$, it would lie inside $S$.`,
                        `如果 $[${a}, ${b}]$ 的某个闭子区间不含 $[${a}, ${b}] \\setminus S$ 的点，它就落在 $S$ 之内。`,
                      ],
                    ],
                    [
                      ["Apply the theorem", "应用定理"],
                      [
                        "That closed interval is a complete metric space, and it would be a countable union of nowhere dense sets, which the Baire category theorem forbids.",
                        "这个闭区间是完备度量空间，它就成了可数个无处稠密集的并，而贝尔纲定理禁止这种情况。",
                      ],
                    ],
                  ],
                  [
                    `So every subinterval of $[${a}, ${b}]$ meets the complement of $S$, which is what dense means; with $S = \\mathbb{Q}$, the complement is the irrationals, which are indeed dense.`,
                    `所以 $[${a}, ${b}]$ 的每个子区间都与 $S$ 的补集相交，这正是稠密的含义；取 $S = \\mathbb{Q}$，补集是无理数，它们确实稠密。`,
                  ],
                ),
              ),
            ),
            [
              [
                empty[0],
                `Then $[${a}, ${b}]$ would lie inside $S$, a countable union of nowhere dense sets, which the theorem forbids.`,
                `那样 $[${a}, ${b}]$ 就落在 $S$ 之内，成为可数个无处稠密集的并，而定理禁止这种情况。`,
              ],
              [
                full[0],
                "Category says nothing about measure: a countable union of nowhere dense sets can have positive measure.",
                "纲与测度无关：可数个无处稠密集的并可以有正测度。",
              ],
              [
                finite[0],
                "A finite set is not dense in an interval, but the complement must be dense.",
                "有限集在区间中不稠密，而补集必须稠密。",
              ],
            ],
          );
        },
      ),
    ],
  ),
  intro: t(
    "The integers are nowhere dense in $\\mathbb{R}$: they are already closed, and the interval $\\left(\\frac{1}{4}, \\frac{3}{4}\\right)$ contains none of them. The rationals are not nowhere dense, because their closure is the whole line.\n\nCheck: every interval, however short, contains a rational, so no interval misses the closure of the rationals.\n\nIn this lesson we decide which sets are nowhere dense, find the interior of a closure, and use the Baire category theorem to show a complement is dense.",
    "整数集在 $\\mathbb{R}$ 中无处稠密：它本身已是闭集，而区间 $\\left(\\frac{1}{4}, \\frac{3}{4}\\right)$ 不含任何整数。有理数不是无处稠密的，因为它们的闭包是整条直线。\n\n检验：每个区间无论多短都含有有理数，所以没有区间能避开有理数的闭包。\n\n本课我们判断哪些集合无处稠密，求闭包的内部，并用贝尔纲定理证明补集稠密。",
  ),
};

/** realAnalysisExtraTopics holds the topics that complete the Real Analysis course. */
export const realAnalysisExtraTopics: readonly TopicDef[] = [
  orderedField,
  nestedIntervals,
  limitPoints,
  cantorSet,
  connected,
  compactImages,
  monotoneJumps,
  boundedVariation,
  stieltjes,
  improperAnalysis,
  dirichletAbel,
  tails,
  uniformLimits,
  differentiatingSequences,
  powerUniform,
  bernstein,
  arzela,
  metricCompactness,
  metricContinuity,
  outerMeasure,
  lebesgue,
  baire,
];
