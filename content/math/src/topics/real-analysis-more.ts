// More of Real Analysis: the Archimedean property, the algebra of limits, rearrangements and Cauchy products,
// discontinuities, bisection, Rolle and Darboux, Taylor's remainder, the integral in theory, limit interchange,
// sets of measure zero, complete metric spaces and open covers.

import { type TopicDef, t } from "@ga/content";
import { Q } from "@ga/subject-math";

import { why } from "../problems.ts";
import { choose, type Pair, point, same, topic } from "../university-kit.ts";
import { reasoned } from "../wrong-reasons.ts";
import { asPair, reason, solution, solved } from "./real-analysis.ts";

/** times writes a coefficient before a symbol, leaving out a coefficient of one. */
const times = (c: number, symbol: string): string => (c === 1 ? symbol : `${c} ${symbol}`);

/** factorial returns n! for a small n. */
const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1));

const archimedean = {
  ...topic(
    "the-archimedean-property",
    ["The Archimedean Property", "阿基米德性质"],
    ["Use whole numbers to outrun any real number, and find rationals in any gap.", "用整数超过任何实数，并在任何间隙中找到有理数。"],
    ["supremum-and-infimum"],
    [],
    [
      point(
        "a-multiple-that-passes-a-number",
        ["A multiple that passes a number", "超过一个数的倍数"],
        [
          "The Archimedean property says that for positive $x$ and any $y$, some whole number $n$ has $n x > y$. It follows from completeness: if the multiples of $x$ were bounded, they would have a least upper bound, and subtracting $x$ from it would give a smaller bound, which is impossible.\n\nFor $x = \\frac{3}{4}$ and $y = 10$, the condition is $n > 10 \\div \\frac{3}{4} = \\frac{40}{3} \\approx 13.33$, so the smallest $n$ is $14$.\n\nCheck: $13 \\cdot \\frac{3}{4} = 9.75$, which is not more than $10$, while $14 \\cdot \\frac{3}{4} = 10.5 > 10$.\n\n> **Watch out.** The inequality is strict. When $y \\div x$ is a whole number, that number gives $n x = y$ exactly, so the smallest $n$ is one more.",
          "阿基米德性质说：对正数 $x$ 和任何 $y$，存在正整数 $n$ 使 $n x > y$。它由完备性推出：如果 $x$ 的倍数有界，就有最小上界，从中减去 $x$ 又得到一个更小的上界，这不可能。\n\n对 $x = \\frac{3}{4}$ 和 $y = 10$，条件是 $n > 10 \\div \\frac{3}{4} = \\frac{40}{3} \\approx 13.33$，所以最小的 $n$ 是 $14$。\n\n检验：$13 \\cdot \\frac{3}{4} = 9.75$，不大于 $10$；而 $14 \\cdot \\frac{3}{4} = 10.5 > 10$。\n\n> **注意。** 不等号是严格的。当 $y \\div x$ 是整数时，这个整数给出 $n x = y$，所以最小的 $n$ 要再加一。",
        ],
        (rng) => {
          const denominator = rng.int(2, 9);
          const numerator = rng.int(1, denominator * 2);
          const x = Q.of(numerator, denominator);
          const y = rng.int(3, 40);
          let n = 1;
          while (x.mul(Q.of(n, 1)).toNumber() <= y) n++;
          const quotient = Q.of(y, 1).div(x).toLatex();
          const at = (m: number) => x.mul(Q.of(m, 1)).toLatex();
          return solved(
            [
              `What is the smallest whole number $n$ with $n \\cdot ${x.toLatex()} > ${y}$?`,
              `使 $n \\cdot ${x.toLatex()} > ${y}$ 的最小正整数 $n$ 是多少？`,
            ],
            n,
            [
              why(
                n - 1,
                `That is one too small; it gives $${at(n - 1)}$, which is not more than $${y}$.`,
                `这小了一；它给出 $${at(n - 1)}$，并不大于 $${y}$。`,
              ),
              why(
                n + 1,
                `That works, but it is not the smallest; $${n}$ already gives $${at(n)} > ${y}$.`,
                `这也满足，但不是最小的；$${n}$ 已经给出 $${at(n)} > ${y}$。`,
              ),
              why(
                y,
                `That is $${y}$ itself; $n$ only has to exceed $${y} \\div ${x.toLatex()} = ${quotient}$.`,
                `这是 $${y}$ 本身；$n$ 只需大于 $${y} \\div ${x.toLatex()} = ${quotient}$。`,
              ),
              why(
                n + 2,
                "That is two more than needed; the question asks for the smallest whole number.",
                "这比所需多二；题目要的是最小的正整数。",
              ),
            ],
            solution(
              [
                [
                  ["Divide by the step", "除以步长"],
                  [
                    `$n$ copies of $${x.toLatex()}$ pass $${y}$ exactly when $n > ${y} \\div ${x.toLatex()} = ${quotient}$.`,
                    `$n$ 个 $${x.toLatex()}$ 超过 $${y}$，当且仅当 $n > ${y} \\div ${x.toLatex()} = ${quotient}$。`,
                  ],
                ],
                [
                  ["Take the next whole number", "取下一个整数"],
                  [`The first whole number greater than $${quotient}$ is $${n}$.`, `大于 $${quotient}$ 的第一个整数是 $${n}$。`],
                ],
              ],
              [
                `$${n - 1}$ gives $${at(n - 1)} \\le ${y}$, while $${n}$ gives $${at(n)} > ${y}$.`,
                `$${n - 1}$ 给出 $${at(n - 1)} \\le ${y}$，而 $${n}$ 给出 $${at(n)} > ${y}$。`,
              ],
            ),
          );
        },
      ),
      point(
        "building-a-rational-in-a-gap",
        ["Building a rational in a gap", "在间隙中构造有理数"],
        [
          "To find a rational between $a$ and $b$, take $n$ with $\\frac{1}{n} < b - a$, so that steps of size $\\frac{1}{n}$ cannot jump over the gap. Then take the smallest whole number $k$ with $\\frac{k}{n} > a$. This fraction lies between $a$ and $b$, which shows the rationals are dense.\n\nFor $a = \\frac{2}{3}$ and steps of $\\frac{1}{5}$, the condition $\\frac{k}{5} > \\frac{2}{3}$ means $k > \\frac{10}{3} \\approx 3.33$, so $k = 4$ and the fraction is $\\frac{4}{5}$.\n\nCheck: $\\frac{3}{5} = 0.6$ is below $\\frac{2}{3} \\approx 0.667$, and $\\frac{4}{5} = 0.8$ is above it, one step further on.\n\n> **Watch out.** Multiply $a$ by $n$ before rounding up. Rounding $a$ first and then scaling skips over the fractions that lie closest to $a$.",
          "要在 $a$ 和 $b$ 之间找有理数，取 $n$ 使 $\\frac{1}{n} < b - a$，这样步长 $\\frac{1}{n}$ 跨不过这个间隙。再取满足 $\\frac{k}{n} > a$ 的最小整数 $k$。这个分数就在 $a$ 和 $b$ 之间，这说明有理数是稠密的。\n\n对 $a = \\frac{2}{3}$ 和步长 $\\frac{1}{5}$，条件 $\\frac{k}{5} > \\frac{2}{3}$ 就是 $k > \\frac{10}{3} \\approx 3.33$，所以 $k = 4$，分数是 $\\frac{4}{5}$。\n\n检验：$\\frac{3}{5} = 0.6$ 小于 $\\frac{2}{3} \\approx 0.667$，而 $\\frac{4}{5} = 0.8$ 大于它，正好多走一步。\n\n> **注意。** 先把 $a$ 乘以 $n$ 再向上取整。先对 $a$ 取整再放大，会跳过最接近 $a$ 的那些分数。",
        ],
        (rng) => {
          const q = rng.int(2, 9);
          const p = rng.int(1, 3 * q);
          const a = Q.of(p, q);
          const n = rng.int(4, 15);
          let k = 0;
          while (Q.of(k, n).toNumber() <= a.toNumber()) k++;
          const scaled = a.mul(Q.of(n, 1)).toLatex();
          return solved(
            [
              `Take steps of size $\\frac{1}{${n}}$. What is the smallest whole number $k$ with $\\frac{k}{${n}} > ${a.toLatex()}$?`,
              `取步长 $\\frac{1}{${n}}$。使 $\\frac{k}{${n}} > ${a.toLatex()}$ 的最小整数 $k$ 是多少？`,
            ],
            k,
            [
              why(
                k - 1,
                `That is one step short; $\\frac{${k - 1}}{${n}}$ is not more than $${a.toLatex()}$.`,
                `这少了一步；$\\frac{${k - 1}}{${n}}$ 并不大于 $${a.toLatex()}$。`,
              ),
              why(
                k + 1,
                `That works, but it is not the smallest; $\\frac{${k}}{${n}}$ already passes $${a.toLatex()}$.`,
                `这也满足，但不是最小的；$\\frac{${k}}{${n}}$ 已经超过 $${a.toLatex()}$。`,
              ),
              why(
                n,
                `That is the number of steps in one unit, not the number needed to pass $${a.toLatex()}$.`,
                `这是一个单位中的步数，而不是超过 $${a.toLatex()}$ 所需的步数。`,
              ),
              why(
                k + n,
                "That goes a whole unit too far; the smallest whole number is wanted.",
                "这多走了整整一个单位；题目要的是最小的整数。",
              ),
            ],
            solution(
              [
                [
                  ["Multiply by the number of steps", "乘以步数"],
                  [
                    `Multiplying $\\frac{k}{${n}} > ${a.toLatex()}$ by $${n}$ gives $k > ${scaled}$.`,
                    `把 $\\frac{k}{${n}} > ${a.toLatex()}$ 两边乘以 $${n}$，得 $k > ${scaled}$。`,
                  ],
                ],
                [
                  ["Take the next whole number", "取下一个整数"],
                  [`The first whole number greater than $${scaled}$ is $${k}$.`, `大于 $${scaled}$ 的第一个整数是 $${k}$。`],
                ],
              ],
              [
                `$\\frac{${k - 1}}{${n}} \\le ${a.toLatex()} < \\frac{${k}}{${n}}$, so $${k}$ is the first step past $${a.toLatex()}$.`,
                `$\\frac{${k - 1}}{${n}} \\le ${a.toLatex()} < \\frac{${k}}{${n}}$，所以 $${k}$ 是超过 $${a.toLatex()}$ 的第一步。`,
              ],
            ),
          );
        },
      ),
    ],
  ),
  intro: t(
    "Take $x = \\frac{2}{5}$ and $y = 7$. The multiples $n \\cdot \\frac{2}{5}$ pass $7$ once $n > 7 \\div \\frac{2}{5} = 17.5$, so the smallest such $n$ is $18$.\n\nCheck: $17 \\cdot \\frac{2}{5} = 6.8$ is still below $7$, and $18 \\cdot \\frac{2}{5} = 7.2$ is above it.\n\nIn this lesson we find a whole number whose multiple outruns a given number, and use steps of size $\\frac{1}{n}$ to place a rational number in any gap.",
    "取 $x = \\frac{2}{5}$，$y = 7$。当 $n > 7 \\div \\frac{2}{5} = 17.5$ 时，倍数 $n \\cdot \\frac{2}{5}$ 超过 $7$，所以最小的 $n$ 是 $18$。\n\n检验：$17 \\cdot \\frac{2}{5} = 6.8$ 仍小于 $7$，而 $18 \\cdot \\frac{2}{5} = 7.2$ 大于它。\n\n本课我们求倍数能超过给定数的整数，并用步长 $\\frac{1}{n}$ 在任何间隙中放进一个有理数。",
  ),
};

const algebraOfLimits = {
  ...topic(
    "the-algebra-of-limits",
    ["The Algebra of Limits", "极限的运算法则"],
    [
      "Combine known limits by the limit laws, and trap a sequence between two others.",
      "用极限法则组合已知极限，并把数列夹在另外两个数列之间。",
    ],
    ["the-epsilon-definition-for-sequences"],
    [],
    [
      point(
        "a-limit-of-a-combination",
        ["A limit of a combination", "组合的极限"],
        [
          "If $a_n \\to A$ and $b_n \\to B$, then sums, products and scalar multiples converge to the matching combination of $A$ and $B$, and $a_n / b_n \\to A / B$ when $B \\ne 0$. Each law is proved with the epsilon definition, using that a convergent sequence is bounded.\n\nIf $a_n \\to 2$ and $b_n \\to 3$, then $\\frac{a_n b_n + 1}{b_n} \\to \\frac{6 + 1}{3} = \\frac{7}{3}$.\n\nCheck: the fraction equals $a_n + \\frac{1}{b_n}$, which tends to $2 + \\frac{1}{3} = \\frac{7}{3}$.\n\n> **Watch out.** The quotient law needs the limit of the denominator to be nonzero. Check $B \\ne 0$ before dividing limits.",
          "如果 $a_n \\to A$，$b_n \\to B$，那么和、积、数乘都收敛到 $A$、$B$ 相应的组合；当 $B \\ne 0$ 时 $a_n / b_n \\to A / B$。每条法则都用 epsilon 定义证明，其中用到收敛数列有界。\n\n若 $a_n \\to 2$，$b_n \\to 3$，则 $\\frac{a_n b_n + 1}{b_n} \\to \\frac{6 + 1}{3} = \\frac{7}{3}$。\n\n检验：这个分式等于 $a_n + \\frac{1}{b_n}$，它趋于 $2 + \\frac{1}{3} = \\frac{7}{3}$。\n\n> **注意。** 商的法则要求分母的极限不为零。除以极限之前，先检查 $B \\ne 0$。",
        ],
        (rng) => {
          const A = rng.int(-6, 6);
          const B = rng.int(1, 6);
          const p = rng.int(1, 9);
          const answer = Q.of(A * B + p, B);
          return solved(
            [
              `Given $a_n \\to ${A}$ and $b_n \\to ${B}$, what is $\\lim_{n \\to \\infty} \\frac{a_n b_n + ${p}}{b_n}$?`,
              `已知 $a_n \\to ${A}$，$b_n \\to ${B}$，$\\lim_{n \\to \\infty} \\frac{a_n b_n + ${p}}{b_n}$ 是多少？`,
            ],
            answer,
            [
              why(
                A * B + p,
                `That is the limit of the numerator alone; divide it by the limit $${B}$ of $b_n$.`,
                `这只是分子的极限；还要除以 $b_n$ 的极限 $${B}$。`,
              ),
              why(
                Q.of(A + p, B),
                `That replaces $a_n b_n$ by $a_n$; the product tends to $${A * B}$.`,
                `这把 $a_n b_n$ 换成了 $a_n$；乘积趋于 $${A * B}$。`,
              ),
              why(
                A,
                `That drops $\\frac{${p}}{b_n}$, which tends to $${Q.of(p, B).toLatex()}$, not to 0.`,
                `这丢掉了 $\\frac{${p}}{b_n}$，它趋于 $${Q.of(p, B).toLatex()}$，而不是 0。`,
              ),
              why(A + p, "That ignores the denominator $b_n$ altogether.", "这完全忽略了分母 $b_n$。"),
            ],
            solution(
              [
                [
                  ["Check the denominator", "检查分母"],
                  [`$b_n \\to ${B}$, which is not 0, so the quotient law applies.`, `$b_n \\to ${B}$，不为 0，所以可以用商的法则。`],
                ],
                [
                  ["Apply the laws", "用法则"],
                  [
                    `$a_n b_n \\to ${A * B}$, so the numerator tends to $${A * B} + ${p} = ${A * B + p}$, and the quotient tends to $\\frac{${A * B + p}}{${B}} = ${answer.toLatex()}$.`,
                    `$a_n b_n \\to ${A * B}$，所以分子趋于 $${A * B} + ${p} = ${A * B + p}$，商趋于 $\\frac{${A * B + p}}{${B}} = ${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `The fraction equals $a_n + \\frac{${p}}{b_n}$, which tends to $${A} + ${Q.of(p, B).toLatex()} = ${answer.toLatex()}$.`,
                `这个分式等于 $a_n + \\frac{${p}}{b_n}$，它趋于 $${A} + ${Q.of(p, B).toLatex()} = ${answer.toLatex()}$。`,
              ],
            ),
          );
        },
      ),
      point(
        "trapping-a-sequence",
        ["Trapping a sequence", "夹逼数列"],
        [
          "If $l_n \\le x_n \\le u_n$ and both $l_n$ and $u_n$ tend to the same limit, then $x_n$ tends to it too. This squeeze theorem handles oscillating terms. Since $\\sin n$ stays between $-1$ and 1, a term like $\\frac{\\sin n}{n}$ is trapped between $-\\frac{1}{n}$ and $\\frac{1}{n}$ and tends to zero.\n\nFor $\\frac{2n + \\sin n}{n} = 2 + \\frac{\\sin n}{n}$, the second part is trapped between $-\\frac{1}{n}$ and $\\frac{1}{n}$, so the limit is $2$.\n\nCheck: at $n = 100$, $\\sin 100 \\approx -0.506$, so the value is about $1.99494$, close to $2$.\n\n> **Watch out.** $\\sin n$ itself has no limit; it is only bounded. The squeeze works because it is divided by something that grows.",
          "如果 $l_n \\le x_n \\le u_n$，且 $l_n$、$u_n$ 趋于同一极限，那么 $x_n$ 也趋于它。这个夹逼定理能处理振荡项。因为 $\\sin n$ 在 $-1$ 和 1 之间，所以 $\\frac{\\sin n}{n}$ 被夹在 $-\\frac{1}{n}$ 和 $\\frac{1}{n}$ 之间，趋于零。\n\n对 $\\frac{2n + \\sin n}{n} = 2 + \\frac{\\sin n}{n}$，第二部分被夹在 $-\\frac{1}{n}$ 和 $\\frac{1}{n}$ 之间，所以极限是 $2$。\n\n检验：$n = 100$ 时 $\\sin 100 \\approx -0.506$，所以值约为 $1.99494$，接近 $2$。\n\n> **注意。** $\\sin n$ 本身没有极限，它只是有界。夹逼之所以成立，是因为它除以了一个不断增大的量。",
        ],
        (rng) => {
          const [a, b] = [rng.int(1, 9), rng.int(2, 9)];
          const [c, d] = [rng.int(1, 5), rng.int(1, 5)];
          const answer = Q.of(a, b);
          const big = 1000;
          const value = (a * big + c * Math.sin(big)) / (b * big + d * Math.cos(big));
          return solved(
            [
              `What is $\\lim_{n \\to \\infty} \\frac{${times(a, "n")} + ${times(c, "\\sin n")}}{${b} n + ${times(d, "\\cos n")}}$?`,
              `$\\lim_{n \\to \\infty} \\frac{${times(a, "n")} + ${times(c, "\\sin n")}}{${b} n + ${times(d, "\\cos n")}}$ 是多少？`,
            ],
            answer,
            [
              why(
                Q.of(a + c, b + d),
                "That treats $\\sin n$ and $\\cos n$ as 1; they keep oscillating, and after dividing by $n$ they vanish.",
                "这把 $\\sin n$ 和 $\\cos n$ 当作 1；它们一直振荡，除以 $n$ 后趋于零。",
              ),
              why(
                Q.of(c, d),
                "That keeps only the oscillating terms; they are the parts that vanish, not the parts that stay.",
                "这只保留了振荡项；它们恰恰是趋于零的部分，而不是留下的部分。",
              ),
              why(
                0,
                `That squeezes the whole fraction to 0; only the oscillating parts vanish, and $\\frac{${times(a, "n")}}{${b} n}$ stays $${answer.toLatex()}$.`,
                `这把整个分式都夹逼到 0；只有振荡部分趋于零，$\\frac{${times(a, "n")}}{${b} n}$ 保持为 $${answer.toLatex()}$。`,
              ),
              why(
                Q.of(a + c, b),
                "That treats $\\sin n$ as 1 in the numerator and drops $\\cos n$; both oscillating terms vanish.",
                "这在分子中把 $\\sin n$ 当作 1，又丢掉了 $\\cos n$；两个振荡项都趋于零。",
              ),
            ],
            solution(
              [
                [
                  ["Divide by n", "同除以 n"],
                  [
                    `Dividing above and below by $n$ gives $\\frac{${a} + \\frac{${times(c, "\\sin n")}}{n}}{${b} + \\frac{${times(d, "\\cos n")}}{n}}$.`,
                    `分子分母同除以 $n$，得 $\\frac{${a} + \\frac{${times(c, "\\sin n")}}{n}}{${b} + \\frac{${times(d, "\\cos n")}}{n}}$。`,
                  ],
                ],
                [
                  ["Squeeze the oscillating terms", "夹逼振荡项"],
                  [
                    `$\\left|\\frac{${times(c, "\\sin n")}}{n}\\right| \\le \\frac{${c}}{n}$ and $\\left|\\frac{${times(d, "\\cos n")}}{n}\\right| \\le \\frac{${d}}{n}$, so both tend to 0 and the limit is $${answer.toLatex()}$.`,
                    `$\\left|\\frac{${times(c, "\\sin n")}}{n}\\right| \\le \\frac{${c}}{n}$，$\\left|\\frac{${times(d, "\\cos n")}}{n}\\right| \\le \\frac{${d}}{n}$，所以两者都趋于 0，极限是 $${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `At $n = ${big}$ the value is about $${value.toFixed(4)}$, close to $${answer.toLatex()} \\approx ${answer.toNumber().toFixed(4)}$.`,
                `$n = ${big}$ 时值约为 $${value.toFixed(4)}$，接近 $${answer.toLatex()} \\approx ${answer.toNumber().toFixed(4)}$。`,
              ],
            ),
          );
        },
      ),
    ],
  ),
  intro: t(
    "Let $a_n = 3 + \\frac{1}{n}$ and $b_n = 2 - \\frac{1}{n}$. Then $a_n \\to 3$ and $b_n \\to 2$, so by the product law $a_n b_n \\to 3 \\cdot 2 = 6$.\n\nCheck: at $n = 100$, $a_n b_n = (3.01)(1.99) = 5.9899$, close to $6$.\n\nIn this lesson we combine known limits with the limit laws, and trap a sequence between two others with the same limit.",
    "设 $a_n = 3 + \\frac{1}{n}$，$b_n = 2 - \\frac{1}{n}$。则 $a_n \\to 3$，$b_n \\to 2$，由乘积法则 $a_n b_n \\to 3 \\cdot 2 = 6$。\n\n检验：$n = 100$ 时 $a_n b_n = (3.01)(1.99) = 5.9899$，接近 $6$。\n\n本课我们用极限法则组合已知极限，并把数列夹在两个极限相同的数列之间。",
  ),
};

const rearrangements = {
  ...topic(
    "rearrangements-of-series",
    ["Rearrangements of Series", "级数的重排"],
    ["See why order matters only for conditionally convergent series.", "了解为什么只有条件收敛的级数才受顺序影响。"],
    ["absolute-and-conditional-convergence-of-series"],
    [],
    [
      point(
        "when-order-can-change-the-sum",
        ["When order can change the sum", "顺序何时会改变和"],
        [
          "Every rearrangement of an absolutely convergent series has the same sum. A conditionally convergent series is very different: Riemann's theorem says its terms can be reordered to reach any real number, or to diverge, because its positive terms and its negative terms each sum to infinity on their own.\n\nFor $\\sum_{n \\ge 1} \\frac{(-1)^n}{n^2}$ the absolute values $\\frac{1}{n^2}$ have a finite sum, so every rearrangement gives the same sum. For $\\sum_{n \\ge 1} \\frac{(-1)^n}{n}$ the absolute values form the harmonic series, which diverges, so the series converges only conditionally and can be reordered to reach any real number.\n\nCheck: the positive terms of $\\sum_{n \\ge 1} \\frac{(-1)^n}{n}$ are $\\frac{1}{2} + \\frac{1}{4} + \\frac{1}{6} + \\cdots$, half the harmonic series, so they alone add up to infinity.\n\n> **Watch out.** Convergence of the series itself does not protect the sum. What protects it is convergence of the series of absolute values.",
          "绝对收敛级数的每个重排都有相同的和。条件收敛级数就大不相同：黎曼定理说，它的项可以重排为趋于任何实数，也可以发散，因为它的正项和负项各自的和都是无穷。\n\n对 $\\sum_{n \\ge 1} \\frac{(-1)^n}{n^2}$，绝对值 $\\frac{1}{n^2}$ 的和有限，所以每个重排的和都相同。对 $\\sum_{n \\ge 1} \\frac{(-1)^n}{n}$，绝对值构成发散的调和级数，所以级数只是条件收敛，可以重排为趋于任何实数。\n\n检验：$\\sum_{n \\ge 1} \\frac{(-1)^n}{n}$ 的正项是 $\\frac{1}{2} + \\frac{1}{4} + \\frac{1}{6} + \\cdots$，是调和级数的一半，所以单是它们的和就是无穷。\n\n> **注意。** 级数本身收敛并不能保住和。能保住和的是绝对值级数的收敛。",
        ],
        (rng) => {
          const exponent = rng.pick([Q.of(1, 2), Q.of(1, 3), Q.of(2, 3), Q.of(1, 1), Q.of(3, 2), Q.of(2, 1), Q.of(3, 1), Q.of(4, 1)]);
          const c = rng.int(1, 9);
          const absolute = exponent.toNumber() > 1;
          const power = exponent.eq(Q.of(1, 1)) ? "n" : `n^{${exponent.toLatex()}}`;
          const body = `\\sum_{n \\ge 1} \\frac{(-1)^n ${c === 1 ? "" : c}}{${power}}`;
          const keep: Pair = ["Every rearrangement has the same sum", "每个重排的和都相同"];
          const change: Pair = ["Rearranging can give any real number", "重排可以得到任何实数"];
          const size = `\\frac{${c}}{${power}}`;
          return reasoned(
            choose(
              rng,
              [`What is true of the rearrangements of $${body}$?`, `关于 $${body}$ 的重排，哪个说法正确？`],
              absolute ? keep : change,
              [
                keep,
                change,
                ["No rearrangement converges", "没有一个重排收敛"],
                ["Rearranging can change the sum only by a finite amount", "重排只能使和改变有限的量"],
              ],
              asPair(
                solution(
                  [
                    [
                      ["Take absolute values", "取绝对值"],
                      [
                        `The absolute values of the terms are $${size}$, a $p$-series with exponent $${exponent.toLatex()}$.`,
                        `各项的绝对值是 $${size}$，这是指数为 $${exponent.toLatex()}$ 的 $p$ 级数。`,
                      ],
                    ],
                    [
                      ["Decide the kind of convergence", "判断收敛的类型"],
                      absolute
                        ? [
                            `The exponent $${exponent.toLatex()}$ exceeds 1, so the series converges absolutely, and every rearrangement has the same sum.`,
                            `指数 $${exponent.toLatex()}$ 大于 1，所以级数绝对收敛，每个重排的和都相同。`,
                          ]
                        : [
                            `The exponent $${exponent.toLatex()}$ is at most 1, so the absolute values diverge, while the alternating series converges because its terms decrease to 0. It converges only conditionally, and Riemann's theorem applies.`,
                            `指数 $${exponent.toLatex()}$ 不超过 1，所以绝对值级数发散；而交错级数的项递减趋于 0，所以它收敛。它只是条件收敛，黎曼定理适用。`,
                          ],
                    ],
                  ],
                  absolute
                    ? [
                        "The absolute values have a finite sum, so the tail beyond any point is small whatever order the terms come in, which is why the sum cannot move.",
                        "绝对值的和有限，所以无论各项按什么顺序出现，足够远之后的尾部都很小，这就是和不会改变的原因。",
                      ]
                    : [
                        "The positive terms, those with even $n$, add up to infinity on their own, and so do the negative ones, which is what Riemann's construction needs.",
                        "正项，即 $n$ 为偶数的项，单独加起来是无穷，负项也是如此，这正是黎曼的构造所需要的。",
                      ],
                ),
              ),
            ),
            [
              [
                keep[0],
                "That holds only for absolute convergence; here the absolute values diverge, so the order can change the sum.",
                "这只对绝对收敛成立；这里绝对值级数发散，所以顺序可以改变和。",
              ],
              [
                change[0],
                "Riemann's theorem needs conditional convergence; this series converges absolutely, so the sum cannot move.",
                "黎曼定理要求条件收敛；这个级数绝对收敛，所以和不会变。",
              ],
              [
                "No rearrangement converges",
                "The series in its own order converges, and that is itself a rearrangement.",
                "级数按原来的顺序就收敛，而这本身就是一个重排。",
              ],
              [
                "Rearranging can change the sum only by a finite amount",
                "No such middle case exists: the sum either never changes or can be moved to any real number at all.",
                "不存在这种中间情形：和要么永远不变，要么可以移到任何实数。",
              ],
            ],
          );
        },
      ),
      point(
        "chasing-a-target",
        ["Chasing a target", "追赶目标"],
        [
          "Riemann's proof is a greedy procedure. To reach a target, add positive terms in order until the partial sum passes the target, then add negative terms until it falls below, and repeat. Since the terms tend to zero, the overshoots shrink, and the rearranged series converges to the target.\n\nTo chase the target $1$ with $1 - \\frac{1}{2} + \\frac{1}{3} - \\cdots$, the first positive term gives $1$, which does not pass the target, so add $\\frac{1}{3}$ to reach about $1.333$. Then add the negative term $-\\frac{1}{2}$ to fall to about $0.833$, below the target.\n\nCheck: $1 + \\frac{1}{3} - \\frac{1}{2} = \\frac{5}{6} \\approx 0.833$, which is below $1$, so the next stage adds positive terms again.\n\n> **Watch out.** Passing the target means going strictly above it. A partial sum equal to the target has not passed it, so keep adding.",
          "黎曼的证明是一个贪心过程。要达到目标，就依次加正项，直到部分和超过目标；再加负项，直到它低于目标；如此重复。因为各项趋于零，超出的量越来越小，重排后的级数收敛到目标。\n\n用 $1 - \\frac{1}{2} + \\frac{1}{3} - \\cdots$ 追赶目标 $1$：第一个正项给出 $1$，没有超过目标，所以再加 $\\frac{1}{3}$，约为 $1.333$。然后加负项 $-\\frac{1}{2}$，降到约 $0.833$，低于目标。\n\n检验：$1 + \\frac{1}{3} - \\frac{1}{2} = \\frac{5}{6} \\approx 0.833$，低于 $1$，所以下一阶段又加正项。\n\n> **注意。** 超过目标是指严格大于它。部分和等于目标时还没有超过，要继续加。",
        ],
        (rng) => {
          const q = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 12]);
          const p = rng.int(q + 1, 2 * q);
          const target = Q.of(p, q);
          let sum = 0;
          let count = 0;
          while (sum <= target.toNumber()) {
            sum += 1 / (2 * count + 1);
            count++;
          }
          const before = sum - 1 / (2 * count - 1);
          const goal = target.toNumber().toFixed(3);
          const terms = Array.from({ length: count }, (_, i) => (i === 0 ? "1" : `\\frac{1}{${2 * i + 1}}`)).join(" + ");
          const tooMany = (): [string, string] => [
            `That is more than needed; the sum already passes $${target.toLatex()}$ after ${count} terms.`,
            `这比所需的多；加 ${count} 项时和已经超过 $${target.toLatex()}$。`,
          ];
          const tooFew = (v: number): [string, string] => [
            `That is too few; ${v} ${v === 1 ? "term gives" : "terms give"} at most about ${before.toFixed(3)}, which has not passed $${target.toLatex()} \\approx ${goal}$.`,
            `这太少了；加 ${v} 项时和最多约为 ${before.toFixed(3)}，还没有超过 $${target.toLatex()} \\approx ${goal}$。`,
          ];
          const say = (v: number) => {
            const [en, zh] = v > count ? tooMany() : tooFew(v);
            return why(v, en, zh);
          };
          return solved(
            [
              `To rearrange $1 - \\frac{1}{2} + \\frac{1}{3} - \\cdots$ toward the target $${target.toLatex()}$, you first add $1 + \\frac{1}{3} + \\frac{1}{5} + \\cdots$ until the sum passes the target. How many terms does this take?`,
              `要把 $1 - \\frac{1}{2} + \\frac{1}{3} - \\cdots$ 重排为趋于目标 $${target.toLatex()}$，先加 $1 + \\frac{1}{3} + \\frac{1}{5} + \\cdots$，直到和超过目标。这需要多少项？`,
            ],
            count,
            [count - 1, count + 1, count + 2, count === 2 ? 5 : 2].filter((v) => v > 0).map(say),
            solution(
              [
                [
                  ["Write the target as a decimal", "把目标写成小数"],
                  [`$${target.toLatex()} \\approx ${goal}$.`, `$${target.toLatex()} \\approx ${goal}$。`],
                ],
                [
                  ["Add the positive terms", "依次加正项"],
                  [
                    `$${terms} \\approx ${sum.toFixed(3)}$, and this is the first partial sum above $${goal}$.`,
                    `$${terms} \\approx ${sum.toFixed(3)}$，这是第一个大于 $${goal}$ 的部分和。`,
                  ],
                ],
              ],
              [
                `With ${count - 1} ${count === 2 ? "term" : "terms"} the sum is about ${before.toFixed(3)}, not past the target, and with ${count} it is about ${sum.toFixed(3)}.`,
                `加 ${count - 1} 项时和约为 ${before.toFixed(3)}，没有超过目标；加 ${count} 项时约为 ${sum.toFixed(3)}。`,
              ],
            ),
          );
        },
      ),
    ],
  ),
  intro: t(
    "The series $1 - \\frac{1}{2} + \\frac{1}{3} - \\frac{1}{4} + \\cdots$ sums to $\\ln 2 \\approx 0.693$. Taking two positive terms for each negative one, $1 + \\frac{1}{3} - \\frac{1}{2} + \\frac{1}{5} + \\frac{1}{7} - \\frac{1}{4} + \\cdots$, uses the same terms but sums to $\\frac{3}{2} \\ln 2 \\approx 1.040$.\n\nCheck: the first block already gives $1 + \\frac{1}{3} - \\frac{1}{2} = \\frac{5}{6} \\approx 0.833$, above $0.693$, and every later block adds a little more.\n\nIn this lesson we see why reordering can change the sum of a conditionally convergent series but never of an absolutely convergent one, and run the greedy procedure that reaches a chosen target.",
    "级数 $1 - \\frac{1}{2} + \\frac{1}{3} - \\frac{1}{4} + \\cdots$ 的和是 $\\ln 2 \\approx 0.693$。每取一个负项就取两个正项，$1 + \\frac{1}{3} - \\frac{1}{2} + \\frac{1}{5} + \\frac{1}{7} - \\frac{1}{4} + \\cdots$，用的是同样的项，和却是 $\\frac{3}{2} \\ln 2 \\approx 1.040$。\n\n检验：第一组已经给出 $1 + \\frac{1}{3} - \\frac{1}{2} = \\frac{5}{6} \\approx 0.833$，大于 $0.693$，之后每一组都再加一点。\n\n本课我们了解为什么重排能改变条件收敛级数的和，却改变不了绝对收敛级数的和，并用贪心过程达到选定的目标。",
  ),
};

const cauchyProducts = {
  ...topic(
    "cauchy-products-of-series",
    ["Cauchy Products of Series", "级数的柯西乘积"],
    ["Multiply two series the way polynomials are multiplied.", "像多项式相乘那样把两个级数相乘。"],
    ["absolute-and-conditional-convergence-of-series"],
    [],
    [
      point(
        "a-term-of-the-product",
        ["A term of the product", "乘积的一项"],
        [
          "The Cauchy product of $\\sum a_n$ and $\\sum b_n$ has terms $c_n = a_0 b_n + a_1 b_{n-1} + \\cdots + a_n b_0$, collecting all pairs of indices that add up to $n$. This is exactly how the coefficient of $x^n$ arises when two power series are multiplied.\n\nIf $a_0, a_1, a_2 = 2, 3, 5$ and $b_0, b_1, b_2 = 4, 6, 7$, then $c_2 = a_0 b_2 + a_1 b_1 + a_2 b_0 = 14 + 18 + 20 = 52$.\n\nCheck: in $(2 + 3x + 5x^2)(4 + 6x + 7x^2)$ the terms in $x^2$ are $14x^2$, $18x^2$ and $20x^2$, which add up to $52x^2$.\n\n> **Watch out.** $c_n$ has $n + 1$ products, from $a_0 b_n$ to $a_n b_0$. Do not pair equal indices, and do not stop after the first product.",
          "$\\sum a_n$ 和 $\\sum b_n$ 的柯西乘积，其项为 $c_n = a_0 b_n + a_1 b_{n-1} + \\cdots + a_n b_0$，也就是把下标之和为 $n$ 的所有对加起来。两个幂级数相乘时，$x^n$ 的系数正是这样产生的。\n\n若 $a_0, a_1, a_2 = 2, 3, 5$，$b_0, b_1, b_2 = 4, 6, 7$，则 $c_2 = a_0 b_2 + a_1 b_1 + a_2 b_0 = 14 + 18 + 20 = 52$。\n\n检验：在 $(2 + 3x + 5x^2)(4 + 6x + 7x^2)$ 中，含 $x^2$ 的项是 $14x^2$、$18x^2$ 和 $20x^2$，加起来是 $52x^2$。\n\n> **注意。** $c_n$ 有 $n + 1$ 个乘积，从 $a_0 b_n$ 到 $a_n b_0$。不要把相同下标配对，也不要只算第一个乘积。",
        ],
        (rng) => {
          const a = Array.from({ length: 4 }, () => rng.int(1, 6));
          const b = Array.from({ length: 4 }, () => rng.int(1, 6));
          const n = rng.int(2, 3);
          const parts = a.slice(0, n + 1).map((v, i) => v * (b[n - i] as number));
          const answer = parts.reduce((x, y) => x + y, 0);
          const indices = a
            .slice(0, n + 1)
            .map((_, i) => `a_{${i}} b_{${n - i}}`)
            .join(" + ");
          const products = a
            .slice(0, n + 1)
            .map((v, i) => `${v} \\times ${b[n - i]}`)
            .join(" + ");
          const equal = a.slice(0, n + 1).reduce((x, y, i) => x + y * (b[i] as number), 0);
          return solved(
            [
              `Two series begin with $a_0, a_1, a_2, a_3 = ${a.join(", ")}$ and $b_0, b_1, b_2, b_3 = ${b.join(", ")}$. What is the term $c_{${n}}$ of their Cauchy product?`,
              `两个级数开头是 $a_0, a_1, a_2, a_3 = ${a.join(", ")}$ 和 $b_0, b_1, b_2, b_3 = ${b.join(", ")}$。它们的柯西乘积中 $c_{${n}}$ 是多少？`,
            ],
            answer,
            [
              why(
                (a[n] as number) * (b[n] as number),
                `That is $a_{${n}} b_{${n}}$ alone; $c_{${n}}$ adds every product whose indices add up to ${n}.`,
                `这只是 $a_{${n}} b_{${n}}$；$c_{${n}}$ 要把下标之和为 ${n} 的所有乘积加起来。`,
              ),
              why(
                parts[0] as number,
                `That is only the first product $a_0 b_{${n}}$; the other ${n} products are missing.`,
                `这只是第一个乘积 $a_0 b_{${n}}$；还缺另外 ${n} 个乘积。`,
              ),
              why(answer + 1, "That is one more than the sum of the products; add them again.", "这比乘积之和多一；请重新相加。"),
              why(
                equal,
                `That pairs equal indices, $a_i b_i$; the indices must add up to ${n}, so $a_i$ goes with $b_{${n} - i}$.`,
                `这把相同下标配对成 $a_i b_i$；下标之和必须是 ${n}，所以 $a_i$ 要配 $b_{${n} - i}$。`,
              ),
            ],
            solution(
              [
                [
                  ["List the pairs of indices", "列出下标对"],
                  [`The pairs adding up to ${n} give $c_{${n}} = ${indices}$.`, `下标之和为 ${n} 的对给出 $c_{${n}} = ${indices}$。`],
                ],
                [
                  ["Multiply and add", "相乘再相加"],
                  [
                    `$c_{${n}} = ${products} = ${parts.join(" + ")} = ${answer}$.`,
                    `$c_{${n}} = ${products} = ${parts.join(" + ")} = ${answer}$。`,
                  ],
                ],
              ],
              [
                `Adding the products in the reverse order, $${[...parts].reverse().join(" + ")} = ${answer}$, gives the same total.`,
                `按相反顺序相加，$${[...parts].reverse().join(" + ")} = ${answer}$，结果相同。`,
              ],
            ),
          );
        },
      ),
      point(
        "the-sum-of-a-product",
        ["The sum of a product", "乘积的和"],
        [
          "Mertens' theorem says that if one series converges absolutely and the other converges, their Cauchy product converges to the product of the two sums. If neither converges absolutely, the product may diverge. For two geometric series the sums are easy, and the product of the sums gives the total immediately.\n\nFor $\\sum_{n \\ge 0} \\frac{1}{2^n}$ with itself, each sum is $\\frac{1}{1 - \\frac{1}{2}} = 2$, so the Cauchy product sums to $2 \\cdot 2 = 4$.\n\nCheck: here $c_n = \\frac{n + 1}{2^n}$, and $1 + 1 + \\frac{3}{4} + \\frac{1}{2} + \\frac{5}{16} + \\cdots$ has partial sums $2.75$, $3.25$, $3.5625$ climbing toward $4$.\n\n> **Watch out.** The Cauchy product is not the series $\\sum a_n b_n$ of products with equal indices. That series has a different sum.",
          "默滕斯定理说：如果一个级数绝对收敛，另一个收敛，那么它们的柯西乘积收敛到两个和的乘积。如果两个都不绝对收敛，乘积可能发散。对两个几何级数，和很容易求，它们的乘积直接给出总和。\n\n把 $\\sum_{n \\ge 0} \\frac{1}{2^n}$ 和它自己相乘，每个和都是 $\\frac{1}{1 - \\frac{1}{2}} = 2$，所以柯西乘积的和是 $2 \\cdot 2 = 4$。\n\n检验：这里 $c_n = \\frac{n + 1}{2^n}$，$1 + 1 + \\frac{3}{4} + \\frac{1}{2} + \\frac{5}{16} + \\cdots$ 的部分和 $2.75$、$3.25$、$3.5625$ 逐渐接近 $4$。\n\n> **注意。** 柯西乘积不是下标相同的乘积构成的级数 $\\sum a_n b_n$。那个级数的和不同。",
        ],
        (rng) => {
          const [p, q] = [rng.int(2, 9), rng.int(2, 9)];
          const answer = Q.of(p, p - 1).mul(Q.of(q, q - 1));
          const [sp, sq] = [Q.of(p, p - 1), Q.of(q, q - 1)];
          let partial = 0;
          for (let k = 0; k < 20; k++) for (let i = 0; i <= k; i++) partial += 1 / (p ** i * q ** (k - i));
          return solved(
            [
              `What is the sum of the Cauchy product of $\\sum_{n \\ge 0} \\frac{1}{${p}^n}$ and $\\sum_{n \\ge 0} \\frac{1}{${q}^n}$?`,
              `$\\sum_{n \\ge 0} \\frac{1}{${p}^n}$ 和 $\\sum_{n \\ge 0} \\frac{1}{${q}^n}$ 的柯西乘积的和是多少？`,
            ],
            answer,
            [
              why(
                sp.add(sq),
                "That adds the two sums; the Cauchy product converges to their product.",
                "这把两个和相加了；柯西乘积收敛到它们的乘积。",
              ),
              why(
                Q.of(p * q, p * q - 1),
                `That is the sum of $\\sum \\frac{1}{${p * q}^n}$, the products with equal indices, not the Cauchy product.`,
                `这是下标相同的乘积构成的 $\\sum \\frac{1}{${p * q}^n}$ 的和，不是柯西乘积。`,
              ),
              why(
                Q.of(1, (p - 1) * (q - 1)),
                "That multiplies the sums from $n = 1$; both series start at $n = 0$, with first term 1.",
                "这把从 $n = 1$ 起的和相乘了；两个级数都从 $n = 0$ 开始，首项是 1。",
              ),
              why(
                1,
                "That is only the first term $c_0 = 1$ of the product; the later terms add more.",
                "这只是乘积的首项 $c_0 = 1$；后面的项还要加上去。",
              ),
            ],
            solution(
              [
                [
                  ["Sum each series", "分别求和"],
                  [
                    `The geometric sums are $\\frac{1}{1 - \\frac{1}{${p}}} = ${sp.toLatex()}$ and $\\frac{1}{1 - \\frac{1}{${q}}} = ${sq.toLatex()}$.`,
                    `几何级数的和分别是 $\\frac{1}{1 - \\frac{1}{${p}}} = ${sp.toLatex()}$ 和 $\\frac{1}{1 - \\frac{1}{${q}}} = ${sq.toLatex()}$。`,
                  ],
                ],
                [
                  ["Apply Mertens' theorem", "用默滕斯定理"],
                  [
                    `Both series have positive terms and converge, so they converge absolutely, and the Cauchy product sums to $${sp.toLatex()} \\cdot ${sq.toLatex()} = ${answer.toLatex()}$.`,
                    `两个级数的项都为正且收敛，所以绝对收敛，柯西乘积的和是 $${sp.toLatex()} \\cdot ${sq.toLatex()} = ${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `The first 20 terms of the product add up to about $${partial.toFixed(4)}$, close to $${answer.toLatex()} \\approx ${answer.toNumber().toFixed(4)}$.`,
                `乘积的前 20 项之和约为 $${partial.toFixed(4)}$，接近 $${answer.toLatex()} \\approx ${answer.toNumber().toFixed(4)}$。`,
              ],
            ),
          );
        },
      ),
    ],
  ),
  intro: t(
    "Multiply $1 + x + x^2 + \\cdots$ by itself. The coefficient of $x^2$ collects three products, $1$ with $x^2$, $x$ with $x$, and $x^2$ with $1$, so it is 3, and in general the coefficient of $x^n$ is $n + 1$.\n\nCheck: $\\frac{1}{(1 - x)^2} = 1 + 2x + 3x^2 + \\cdots$, the derivative of $\\frac{1}{1 - x}$, has $3$ as its coefficient of $x^2$.\n\nIn this lesson we form the terms of the Cauchy product of two series, and find its sum from the two sums when Mertens' theorem applies.",
    "把 $1 + x + x^2 + \\cdots$ 和它自己相乘。$x^2$ 的系数收集了三个乘积：$1$ 乘 $x^2$、$x$ 乘 $x$、$x^2$ 乘 $1$，所以是 3；一般地，$x^n$ 的系数是 $n + 1$。\n\n检验：$\\frac{1}{(1 - x)^2} = 1 + 2x + 3x^2 + \\cdots$ 是 $\\frac{1}{1 - x}$ 的导数，其 $x^2$ 的系数是 $3$。\n\n本课我们写出两个级数的柯西乘积的各项，并在默滕斯定理适用时由两个和求出它的和。",
  ),
};

const discontinuities = {
  ...topic(
    "kinds-of-discontinuities",
    ["Kinds of Discontinuities", "间断点的类型"],
    [
      "Sort discontinuities by their one-sided limits, and count the jumps of monotone functions.",
      "按单侧极限给间断点分类，并数单调函数的跳跃。",
    ],
    ["defining-continuity-at-a-point"],
    [],
    [
      point(
        "naming-a-discontinuity",
        ["Naming a discontinuity", "辨认间断点"],
        [
          "A discontinuity is removable when the two one-sided limits agree but differ from the value, and a jump when both limits exist but disagree. In the remaining kind, called essential, some one-sided limit does not exist, as with $\\sin \\frac{1}{x}$ at 0, which oscillates endlessly.\n\nThe floor function $\\lfloor x \\rfloor$ at $x = 2$ has left limit 1 and right limit 2. Both exist and they differ, so this is a jump.\n\nCheck: no value at 2 could repair it, since a continuous function would need its left and right limits to agree.\n\n> **Watch out.** First ask whether both one-sided limits exist. Only then compare them with each other, and then with the value.",
          "如果两个单侧极限相等但不等于函数值，间断点是可去的；如果两个极限都存在但不相等，就是跳跃间断点。其余的称为本性间断点，至少一个单侧极限不存在，如 $\\sin \\frac{1}{x}$ 在 0 处无休止地振荡。\n\n取整函数 $\\lfloor x \\rfloor$ 在 $x = 2$ 处左极限是 1，右极限是 2。两者都存在但不相等，所以是跳跃间断点。\n\n检验：在 2 处取什么值都修复不了，因为连续函数的左右极限必须相等。\n\n> **注意。** 先问两个单侧极限是否都存在。然后才把它们相互比较，再与函数值比较。",
        ],
        (rng) => {
          const kind = rng.int(0, 2);
          const [left, right, value] = rng.sample([-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8], 3) as [number, number, number];
          const c = rng.int(1, 9);
          const names: Pair[] = [
            ["Removable", "可去间断点"],
            ["A jump", "跳跃间断点"],
            ["Essential", "本性间断点"],
          ];
          const prompt: Pair =
            kind === 0
              ? [
                  `At $x = ${c}$, both one-sided limits of $f$ equal ${left}, and $f(${c}) = ${value}$. What kind of discontinuity is this?`,
                  `在 $x = ${c}$ 处，$f$ 的两个单侧极限都等于 ${left}，而 $f(${c}) = ${value}$。这是哪种间断点？`,
                ]
              : kind === 1
                ? [
                    `At $x = ${c}$, the left limit of $f$ is ${left}, the right limit is ${right}, and $f(${c}) = ${value}$. What kind of discontinuity is this?`,
                    `在 $x = ${c}$ 处，$f$ 的左极限是 ${left}，右极限是 ${right}，而 $f(${c}) = ${value}$。这是哪种间断点？`,
                  ]
                : [
                    `Let $f(x) = \\sin \\frac{${c}}{x - ${c}}$ for $x \\ne ${c}$, and $f(${c}) = ${value}$. What kind of discontinuity is at $x = ${c}$?`,
                    `设 $x \\ne ${c}$ 时 $f(x) = \\sin \\frac{${c}}{x - ${c}}$，且 $f(${c}) = ${value}$。$x = ${c}$ 处是哪种间断点？`,
                  ];
          const limits: Pair =
            kind === 0
              ? [`Both one-sided limits exist and equal ${left}.`, `两个单侧极限都存在，都等于 ${left}。`]
              : kind === 1
                ? [
                    `Both one-sided limits exist: ${left} from the left and ${right} from the right.`,
                    `两个单侧极限都存在：左边是 ${left}，右边是 ${right}。`,
                  ]
                : [
                    `As $x \\to ${c}$, $\\frac{${c}}{x - ${c}}$ runs off to infinity, so $\\sin$ of it swings between $-1$ and 1 forever, and neither one-sided limit exists.`,
                    `当 $x \\to ${c}$ 时，$\\frac{${c}}{x - ${c}}$ 趋于无穷，于是它的正弦在 $-1$ 和 1 之间不停摆动，两个单侧极限都不存在。`,
                  ];
          const verdict: Pair =
            kind === 0
              ? [
                  `The limits agree, but the value ${value} differs from ${left}, so the discontinuity is removable.`,
                  `极限相等，但函数值 ${value} 不等于 ${left}，所以是可去间断点。`,
                ]
              : kind === 1
                ? [
                    "The two limits differ, so the discontinuity is a jump, whatever the value.",
                    "两个极限不相等，所以无论函数值是多少，都是跳跃间断点。",
                  ]
                : ["A one-sided limit fails to exist, so the discontinuity is essential.", "有单侧极限不存在，所以是本性间断点。"];
          const check: Pair =
            kind === 0
              ? [
                  `Redefining $f(${c}) = ${left}$ makes $f$ continuous at ${c}, which is what removable means.`,
                  `把 $f(${c})$ 改为 ${left}，$f$ 就在 ${c} 处连续，这正是可去的含义。`,
                ]
              : kind === 1
                ? [
                    `No single value can equal both ${left} and ${right}, so no change of $f(${c})$ makes $f$ continuous.`,
                    `没有一个值能同时等于 ${left} 和 ${right}，所以改变 $f(${c})$ 不能使 $f$ 连续。`,
                  ]
                : [
                    `Points where $\\frac{${c}}{x - ${c}} = 2k\\pi + \\frac{\\pi}{2}$ give $f = 1$ and points where it is $2k\\pi - \\frac{\\pi}{2}$ give $f = -1$, and both crowd in on ${c}.`,
                    `使 $\\frac{${c}}{x - ${c}} = 2k\\pi + \\frac{\\pi}{2}$ 的点给出 $f = 1$，使它等于 $2k\\pi - \\frac{\\pi}{2}$ 的点给出 $f = -1$，两类点都向 ${c} 聚集。`,
                  ];
          const reasons: [string, string, string][] = [
            [
              "Removable",
              kind === 1
                ? `Removable needs the two one-sided limits to agree; here they are ${left} and ${right}.`
                : "Removable needs the limit to exist; here the function oscillates and has none.",
              kind === 1
                ? `可去间断点要求两个单侧极限相等；这里它们是 ${left} 和 ${right}。`
                : "可去间断点要求极限存在；这里函数振荡，没有极限。",
            ],
            [
              "A jump",
              kind === 0
                ? `A jump needs the two one-sided limits to differ; here both are ${left}.`
                : "A jump needs both one-sided limits to exist; here neither does.",
              kind === 0 ? `跳跃间断点要求两个单侧极限不相等；这里都是 ${left}。` : "跳跃间断点要求两个单侧极限都存在；这里都不存在。",
            ],
            [
              "Essential",
              "Both one-sided limits exist here, so the discontinuity is not essential.",
              "这里两个单侧极限都存在，所以不是本性间断点。",
            ],
            [
              "There is no discontinuity",
              kind === 0
                ? `The value ${value} differs from the limit ${left}, so $f$ is not continuous at ${c}.`
                : kind === 1
                  ? "The one-sided limits differ, so $f$ has no limit there and cannot be continuous."
                  : `$f$ has no limit at ${c}, so it cannot be continuous there.`,
              kind === 0
                ? `函数值 ${value} 不等于极限 ${left}，所以 $f$ 在 ${c} 处不连续。`
                : kind === 1
                  ? "两个单侧极限不相等，所以 $f$ 在那里没有极限，不可能连续。"
                  : `$f$ 在 ${c} 处没有极限，所以不可能在那里连续。`,
            ],
          ];
          return reasoned(
            choose(
              rng,
              prompt,
              names[kind] as Pair,
              [...names, ["There is no discontinuity", "没有间断"]],
              asPair(
                solution(
                  [
                    [["Find the one-sided limits", "求单侧极限"], limits],
                    [["Classify", "分类"], verdict],
                  ],
                  check,
                ),
              ),
            ),
            reasons,
          );
        },
      ),
      point(
        "counting-big-jumps",
        ["Counting big jumps", "数较大的跳跃"],
        [
          "An increasing function has one-sided limits everywhere, so its only discontinuities are jumps. The jumps together cannot rise more than $f(b) - f(a)$, which limits the number of jumps above any given size. Taking the sizes $\\frac{1}{m}$ for each $m$ shows that the set of all jumps is countable.\n\nIf $f$ rises from 0 to 5, then $k$ jumps each greater than 2 rise by more than $2k$ in all, so $2k < 5$ and $k$ is at most 2.\n\nCheck: two jumps of 2.1 rise by 4.2, which fits within 5, while three jumps each greater than 2 would rise by more than 6.\n\n> **Watch out.** The sizes are strictly greater than the given size. If the rise divided by the size is a whole number, that number of jumps is already too many.",
          "递增函数处处有单侧极限，所以它的间断点只能是跳跃。所有跳跃加起来不能超过 $f(b) - f(a)$，这就限制了超过某一大小的跳跃个数。对每个 $m$ 取大小 $\\frac{1}{m}$，就说明全部跳跃的集合是可数的。\n\n若 $f$ 从 0 升到 5，那么 $k$ 个都大于 2 的跳跃总共上升超过 $2k$，所以 $2k < 5$，$k$ 至多是 2。\n\n检验：两个大小为 2.1 的跳跃上升 4.2，不超过 5；而三个都大于 2 的跳跃会上升超过 6。\n\n> **注意。** 跳跃的大小严格大于给定的大小。如果总上升量除以这个大小是整数，那么这么多个跳跃已经太多了。",
        ],
        (rng) => {
          const rise = rng.int(3, 20);
          const size = rng.pick([Q.of(1, 4), Q.of(1, 2), Q.of(1, 1), Q.of(2, 1), Q.of(3, 1)]);
          const ratio = rise / size.toNumber();
          const answer = Math.ceil(ratio) - 1;
          const quotient = Q.of(rise, 1).div(size).toLatex();
          const total = (k: number) => size.mul(Q.of(k, 1)).toLatex();
          const say = (v: number) =>
            v > answer
              ? why(
                  v,
                  `That is too many; ${v} jumps each greater than $${size.toLatex()}$ rise by more than $${total(v)}$, which is at least ${rise}.`,
                  `这太多了；${v} 个都大于 $${size.toLatex()}$ 的跳跃上升超过 $${total(v)}$，至少是 ${rise}。`,
                )
              : why(
                  v,
                  `That is not the most; ${answer} jumps just over $${size.toLatex()}$ rise by just over $${total(answer)}$, which still fits within ${rise}.`,
                  `这不是最多的；${answer} 个略大于 $${size.toLatex()}$ 的跳跃上升略超过 $${total(answer)}$，仍不超过 ${rise}。`,
                );
          return solved(
            [
              `An increasing function on $[0, 1]$ has $f(0) = 0$ and $f(1) = ${rise}$. What is the largest possible number of jumps of size greater than $${size.toLatex()}$?`,
              `$[0, 1]$ 上的递增函数满足 $f(0) = 0$，$f(1) = ${rise}$。大小超过 $${size.toLatex()}$ 的跳跃最多有多少个？`,
            ],
            answer,
            [
              say(answer + 1),
              say(answer + 2),
              why(
                rise,
                `That is the total rise, not a number of jumps; divide it by the size $${size.toLatex()}$.`,
                `这是总上升量，不是跳跃个数；要除以大小 $${size.toLatex()}$。`,
              ),
              say(Math.max(answer - 1, 1) === answer ? answer + 3 : Math.max(answer - 1, 1)),
            ],
            solution(
              [
                [
                  ["Bound the total rise", "估计总上升量"],
                  [
                    `$k$ jumps each greater than $${size.toLatex()}$ rise by more than $k$ times $${size.toLatex()}$, and the whole rise is only ${rise}.`,
                    `$k$ 个都大于 $${size.toLatex()}$ 的跳跃，上升量超过 $${size.toLatex()}$ 的 $k$ 倍，而总上升量只有 ${rise}。`,
                  ],
                ],
                [
                  ["Solve for the count", "解出个数"],
                  [
                    `So $k$ must be less than $${rise} \\div ${size.toLatex()} = ${quotient}$, and the largest such whole number is ${answer}.`,
                    `所以 $k$ 必须小于 $${rise} \\div ${size.toLatex()} = ${quotient}$，满足的最大整数是 ${answer}。`,
                  ],
                ],
              ],
              [
                `${answer} jumps just over $${size.toLatex()}$ rise by just over $${total(answer)}$, within ${rise}, while ${answer + 1} would rise by more than $${total(answer + 1)}$, which is at least ${rise}.`,
                `${answer} 个略大于 $${size.toLatex()}$ 的跳跃上升略超过 $${total(answer)}$，不超过 ${rise}；而 ${answer + 1} 个会上升超过 $${total(answer + 1)}$，至少是 ${rise}。`,
              ],
            ),
          );
        },
      ),
    ],
  ),
  intro: t(
    "Look at three functions at $x = 0$. $\\frac{\\sin x}{x}$ with value 5 at 0 has limit 1 from both sides, so changing one value repairs it. The sign function has limits $-1$ and 1, a jump. $\\sin \\frac{1}{x}$ has no one-sided limits at all.\n\nCheck: $\\frac{\\sin 0.01}{0.01} \\approx 0.99998$, close to 1 and far from 5.\n\nIn this lesson we name a discontinuity from its one-sided limits, and bound how many large jumps an increasing function can have.",
    "看三个函数在 $x = 0$ 处的情形。在 0 处取值 5 的 $\\frac{\\sin x}{x}$，两侧极限都是 1，改变一个值就能修复。符号函数的两侧极限是 $-1$ 和 1，是跳跃。$\\sin \\frac{1}{x}$ 根本没有单侧极限。\n\n检验：$\\frac{\\sin 0.01}{0.01} \\approx 0.99998$，接近 1，远离 5。\n\n本课我们由单侧极限辨认间断点，并估计递增函数最多能有多少个较大的跳跃。",
  ),
};

const bisection = {
  ...topic(
    "the-bisection-proof",
    ["The Bisection Proof", "二分法证明"],
    ["Prove the intermediate value theorem by halving an interval again and again.", "反复把区间减半，证明介值定理。"],
    ["the-sequential-criterion-for-continuity"],
    [],
    [
      point(
        "the-next-interval",
        ["The next interval", "下一个区间"],
        [
          "Bisection starts with an interval where $f$ changes sign. Test the midpoint and keep the half on which the sign still changes. The nested intervals close down on a single point by completeness, and continuity then forces $f$ to be zero there. This proves the intermediate value theorem.\n\nTo solve $x^2 = 5$ on $[0, 4]$, use $f(x) = x^2 - 5$. The midpoint 2 gives $f(2) = -1$, which is negative like $f(0) = -5$, so the sign changes on $[2, 4]$, and that half is kept.\n\nCheck: $f(4) = 11$ is positive and $f(2) = -1$ is negative, so a root lies in $[2, 4]$, and indeed $\\sqrt{5} \\approx 2.236$.\n\n> **Watch out.** Keep the half whose two ends give opposite signs. The half where the signs agree may contain no root at all.",
          "二分法从 $f$ 变号的区间开始。检验中点，保留仍然变号的那一半。由完备性，这些嵌套区间收缩到一点；再由连续性，$f$ 在该点必为零。这就证明了介值定理。\n\n要在 $[0, 4]$ 上解 $x^2 = 5$，取 $f(x) = x^2 - 5$。中点 2 给出 $f(2) = -1$，与 $f(0) = -5$ 同为负，所以在 $[2, 4]$ 上变号，保留这一半。\n\n检验：$f(4) = 11$ 为正，$f(2) = -1$ 为负，所以 $[2, 4]$ 中有根，事实上 $\\sqrt{5} \\approx 2.236$。\n\n> **注意。** 保留两端符号相反的那一半。两端符号相同的那一半可能根本没有根。",
        ],
        (rng) => {
          const a = rng.int(0, 5);
          const b = a + rng.pick([2, 4, 6]);
          const mid = (a + b) / 2;
          const c = rng.int(a * a + 1, b * b - 1 === mid * mid ? b * b - 2 : b * b - 1);
          const value = c === mid * mid ? c + 1 : c;
          const goesLeft = mid * mid > value;
          const interval = (x: number, y: number): Pair => same(`[${x}, ${y}]`);
          const f = (x: number) => x * x - value;
          return reasoned(
            choose(
              rng,
              [
                `To solve $x^2 = ${value}$, bisection starts on $[${a}, ${b}]$. Which interval is kept after one step?`,
                `要解 $x^2 = ${value}$，二分法从 $[${a}, ${b}]$ 开始。一步之后保留哪个区间？`,
              ],
              goesLeft ? interval(a, mid) : interval(mid, b),
              [interval(a, mid), interval(mid, b), interval(a, b), interval(mid - 1, mid + 1)],
              asPair(
                solution(
                  [
                    [
                      ["Find the signs at the ends", "求两端的符号"],
                      [
                        `Let $f(x) = x^2 - ${value}$. Then $f(${a}) = ${f(a)}$ is negative and $f(${b}) = ${f(b)}$ is positive.`,
                        `设 $f(x) = x^2 - ${value}$。则 $f(${a}) = ${f(a)}$ 为负，$f(${b}) = ${f(b)}$ 为正。`,
                      ],
                    ],
                    [
                      ["Test the midpoint", "检验中点"],
                      [
                        `The midpoint is ${mid}, and $f(${mid}) = ${mid * mid} - ${value} = ${f(mid)}$ is ${goesLeft ? "positive" : "negative"}, so the sign changes on $[${goesLeft ? `${a}, ${mid}` : `${mid}, ${b}`}]$.`,
                        `中点是 ${mid}，$f(${mid}) = ${mid * mid} - ${value} = ${f(mid)}$ 为${goesLeft ? "正" : "负"}，所以在 $[${goesLeft ? `${a}, ${mid}` : `${mid}, ${b}`}]$ 上变号。`,
                      ],
                    ],
                  ],
                  [
                    `The root $\\sqrt{${value}} \\approx ${Math.sqrt(value).toFixed(3)}$ does lie in $[${goesLeft ? `${a}, ${mid}` : `${mid}, ${b}`}]$.`,
                    `根 $\\sqrt{${value}} \\approx ${Math.sqrt(value).toFixed(3)}$ 确实在 $[${goesLeft ? `${a}, ${mid}` : `${mid}, ${b}`}]$ 中。`,
                  ],
                ),
              ),
            ),
            [
              reason(
                `[${a}, ${mid}]`,
                `Both ends give negative values, $f(${a}) = ${f(a)}$ and $f(${mid}) = ${f(mid)}$, so the sign does not change there.`,
                `两端的值都为负，$f(${a}) = ${f(a)}$，$f(${mid}) = ${f(mid)}$，所以那里不变号。`,
              ),
              reason(
                `[${mid}, ${b}]`,
                `Both ends give positive values, $f(${mid}) = ${f(mid)}$ and $f(${b}) = ${f(b)}$, so the sign does not change there.`,
                `两端的值都为正，$f(${mid}) = ${f(mid)}$，$f(${b}) = ${f(b)}$，所以那里不变号。`,
              ),
              reason(
                `[${a}, ${b}]`,
                "That is the starting interval; one step keeps only one of its halves.",
                "这是起始区间；一步之后只保留它的一半。",
              ),
              reason(
                `[${mid - 1}, ${mid + 1}]`,
                `That is centred on the midpoint; bisection keeps one half, with ${mid} as an end.`,
                `这是以中点为中心的区间；二分法保留的是以 ${mid} 为一端的一半。`,
              ),
            ],
          );
        },
      ),
      point(
        "how-many-halvings",
        ["How many halvings", "减半多少次"],
        [
          "Each step of bisection halves the interval, so after $n$ steps an interval of length $L$ has length $L / 2^n$. The midpoint of that interval lies within half of this length of the root. So the number of steps needed for a given accuracy grows only with the logarithm of the accuracy.\n\nFrom length 3, a length below $\\frac{1}{100}$ needs $\\frac{3}{2^n} < \\frac{1}{100}$, that is $2^n > 300$. Since $2^8 = 256$ and $2^9 = 512$, nine steps are needed.\n\nCheck: $\\frac{3}{512} \\approx 0.0059$ is below $0.01$, while $\\frac{3}{256} \\approx 0.0117$ is not.\n\n> **Watch out.** Multiply the starting length by the denominator before comparing with powers of 2. Comparing $2^n$ with the denominator alone ignores the starting length.",
          "二分法每一步把区间减半，所以长度为 $L$ 的区间经过 $n$ 步后长度是 $L / 2^n$。这个区间的中点与根的距离不超过这一长度的一半。所以达到给定精度所需的步数只随精度的对数增长。\n\n从长度 3 开始，要使长度小于 $\\frac{1}{100}$，需要 $\\frac{3}{2^n} < \\frac{1}{100}$，即 $2^n > 300$。因为 $2^8 = 256$，$2^9 = 512$，所以需要九步。\n\n检验：$\\frac{3}{512} \\approx 0.0059$ 小于 $0.01$，而 $\\frac{3}{256} \\approx 0.0117$ 不小于。\n\n> **注意。** 先把起始长度乘以分母，再与 2 的幂比较。只拿 $2^n$ 和分母比较，就忽略了起始长度。",
        ],
        (rng) => {
          const length = rng.int(1, 12);
          const m = rng.pick([10, 20, 50, 100, 200, 500, 1000, 5000, 10000]);
          let n = 0;
          while (length / 2 ** n >= 1 / m) n++;
          const at = (k: number) => Q.of(length, 2 ** k).toLatex();
          return solved(
            [
              `Bisection starts with an interval of length ${length}. What is the smallest number of steps that makes the length less than $\\frac{1}{${m}}$?`,
              `二分法从长度为 ${length} 的区间开始。最少多少步能使长度小于 $\\frac{1}{${m}}$？`,
            ],
            n,
            [
              why(
                n - 1,
                `That is one step short; after ${n - 1} steps the length is $${at(n - 1)}$, which is not less than $\\frac{1}{${m}}$.`,
                `这少了一步；${n - 1} 步后长度是 $${at(n - 1)}$，并不小于 $\\frac{1}{${m}}$。`,
              ),
              why(
                n + 1,
                `That works, but it is not the smallest; ${n} steps already give $${at(n)}$.`,
                `这也满足，但不是最少的；${n} 步已经给出 $${at(n)}$。`,
              ),
              why(
                n + 2,
                `That is two steps more than needed; ${n} steps already give $${at(n)}$.`,
                `这比所需多两步；${n} 步已经给出 $${at(n)}$。`,
              ),
              why(
                length * m,
                "That is the number $2^n$ has to exceed, not the number of steps $n$.",
                "这是 $2^n$ 必须超过的数，不是步数 $n$。",
              ),
            ],
            solution(
              [
                [
                  ["Write the condition", "写出条件"],
                  [
                    `After $n$ steps the length is $\\frac{${length}}{2^n}$, and $\\frac{${length}}{2^n} < \\frac{1}{${m}}$ means $2^n > ${length * m}$.`,
                    `$n$ 步后长度是 $\\frac{${length}}{2^n}$，$\\frac{${length}}{2^n} < \\frac{1}{${m}}$ 就是 $2^n > ${length * m}$。`,
                  ],
                ],
                [
                  ["Find the first power", "找第一个满足的幂"],
                  [
                    `$2^{${n - 1}} = ${2 ** (n - 1)}$ is not more than $${length * m}$, but $2^{${n}} = ${2 ** n}$ is, so $n = ${n}$.`,
                    `$2^{${n - 1}} = ${2 ** (n - 1)}$ 不大于 $${length * m}$，而 $2^{${n}} = ${2 ** n}$ 大于它，所以 $n = ${n}$。`,
                  ],
                ],
              ],
              [
                `$${at(n)} \\approx ${(length / 2 ** n).toPrecision(3)}$ is below $\\frac{1}{${m}} = ${1 / m}$, while $${at(n - 1)} \\approx ${(length / 2 ** (n - 1)).toPrecision(3)}$ is not.`,
                `$${at(n)} \\approx ${(length / 2 ** n).toPrecision(3)}$ 小于 $\\frac{1}{${m}} = ${1 / m}$，而 $${at(n - 1)} \\approx ${(length / 2 ** (n - 1)).toPrecision(3)}$ 不小于。`,
              ],
            ),
          );
        },
      ),
    ],
  ),
  intro: t(
    "To find $\\sqrt{2}$, start with $[1, 2]$, where $x^2 - 2$ goes from $-1$ to 2. The midpoint $1.5$ gives $0.25$, positive, so keep $[1, 1.5]$; then $1.25$ gives $-0.4375$, negative, so keep $[1.25, 1.5]$.\n\nCheck: $\\sqrt{2} \\approx 1.414$ lies in $[1.25, 1.5]$, an interval a quarter as long as the first.\n\nIn this lesson we take bisection steps, see how they prove the intermediate value theorem, and count the halvings needed for a given accuracy.",
    "要求 $\\sqrt{2}$，从 $[1, 2]$ 开始，$x^2 - 2$ 从 $-1$ 变到 2。中点 $1.5$ 给出 $0.25$，为正，所以保留 $[1, 1.5]$；再取 $1.25$，给出 $-0.4375$，为负，所以保留 $[1.25, 1.5]$。\n\n检验：$\\sqrt{2} \\approx 1.414$ 在 $[1.25, 1.5]$ 中，这个区间的长度是起始区间的四分之一。\n\n本课我们进行二分法的步骤，看它如何证明介值定理，并计算达到给定精度所需的减半次数。",
  ),
};

const rolle = {
  ...topic(
    "rolles-theorem-and-counting-zeros",
    ["Rolle's Theorem and Counting Zeros", "罗尔定理和零点计数"],
    ["Use zeros of a function to find zeros of its derivative, and the reverse.", "由函数的零点找导数的零点，反之亦然。"],
    ["the-mean-value-theorem"],
    [],
    [
      point(
        "zeros-of-a-derivative",
        ["Zeros of a derivative", "导数的零点"],
        [
          "Rolle's theorem says that between two zeros of a differentiable function lies a zero of its derivative. So a function with $k$ distinct real zeros has a derivative with at least $k - 1$, and each further derivative guarantees at least one fewer. The count cannot be improved in general by this argument alone.\n\nIf $f$ has 5 distinct real zeros, they leave 4 gaps, each holding a zero of $f'$. Those 4 zeros of $f'$ leave 3 gaps, so $f''$ has at least 3 zeros.\n\nCheck: $f(x) = x(x^2 - 1)(x^2 - 4)$ has the 5 zeros $0, \\pm 1, \\pm 2$, and its second derivative $20x^3 - 30x$ has the 3 zeros $0$ and $\\pm \\sqrt{1.5}$.\n\n> **Watch out.** The zeros must be distinct. A repeated zero counts once for $f$, and the zero it gives $f'$ sits at the same point rather than in a gap.",
          "罗尔定理说：可导函数的两个零点之间有一个导数的零点。所以有 $k$ 个不同实零点的函数，其导数至少有 $k - 1$ 个零点，每多求一次导数，保证的个数至少少一个。仅靠这个论证，一般不能得到更好的结果。\n\n若 $f$ 有 5 个不同的实零点，它们之间有 4 个间隙，每个间隙中有 $f'$ 的一个零点。$f'$ 的这 4 个零点之间有 3 个间隙，所以 $f''$ 至少有 3 个零点。\n\n检验：$f(x) = x(x^2 - 1)(x^2 - 4)$ 有 5 个零点 $0, \\pm 1, \\pm 2$，它的二阶导数 $20x^3 - 30x$ 有 3 个零点 $0$ 和 $\\pm \\sqrt{1.5}$。\n\n> **注意。** 零点必须互不相同。重零点对 $f$ 只算一次，它给 $f'$ 的零点就在同一点，而不在间隙中。",
        ],
        (rng) => {
          const k = rng.int(3, 9);
          const j = rng.int(1, k - 1);
          const answer = k - j;
          const name = j === 1 ? "f'" : j === 2 ? "f''" : `f^{(${j})}`;
          const countdown = Array.from({ length: j + 1 }, (_, i) => k - i).join(", ");
          return solved(
            [
              `A smooth function $f$ has ${k} distinct real zeros. How many real zeros does Rolle's theorem guarantee for $${name}$?`,
              `光滑函数 $f$ 有 ${k} 个不同的实零点。罗尔定理保证 $${name}$ 至少有多少个实零点？`,
            ],
            answer,
            [
              why(
                answer + 1,
                `That loses only ${j - 1} ${j - 1 === 1 ? "zero" : "zeros"}; each of the ${j} derivatives loses one.`,
                `这只少了 ${j - 1} 个零点；求导 ${j} 次，每次都少一个。`,
              ),
              why(
                answer - 1 >= 1 ? answer - 1 : answer + 2,
                answer - 1 >= 1
                  ? "That loses one zero too many; $m$ zeros leave $m - 1$ gaps, and each gap holds a zero of the next derivative."
                  : `That is more than is guaranteed; ${j} derivatives leave only $${k} - ${j} = ${answer}$.`,
                answer - 1 >= 1
                  ? "这多少了一个零点；$m$ 个零点之间有 $m - 1$ 个间隙，每个间隙中有下一阶导数的一个零点。"
                  : `这超过了能保证的个数；求导 ${j} 次后只剩 $${k} - ${j} = ${answer}$ 个。`,
              ),
              why(
                k,
                "That is the number of zeros of $f$ itself; each derivative may lose one.",
                "这是 $f$ 本身的零点个数；每求一次导数可能少一个。",
              ),
              why(j, "That is the number of derivatives taken, not the number of zeros left.", "这是求导的次数，不是剩下的零点个数。"),
            ],
            solution(
              [
                [
                  ["Take one derivative", "求一次导数"],
                  [
                    `The ${k} zeros of $f$ leave ${k - 1} gaps, and Rolle's theorem puts a zero of $f'$ in each, so $f'$ has at least ${k - 1}.`,
                    `$f$ 的 ${k} 个零点之间有 ${k - 1} 个间隙，罗尔定理在每个间隙中给出 $f'$ 的一个零点，所以 $f'$ 至少有 ${k - 1} 个。`,
                  ],
                ],
                [
                  ["Repeat", "重复"],
                  [
                    `Each further derivative guarantees one fewer, so $${name}$ has at least $${k} - ${j} = ${answer}$.`,
                    `每多求一次导数，保证的个数少一个，所以 $${name}$ 至少有 $${k} - ${j} = ${answer}$ 个。`,
                  ],
                ],
              ],
              [
                `Counting down one per derivative gives ${countdown}, ending at ${answer} after ${j} ${j === 1 ? "step" : "steps"}.`,
                `每求一次导数减一：${countdown}，${j} 步后得到 ${answer}。`,
              ],
            ),
          );
        },
      ),
      point(
        "at-most-how-many-zeros",
        ["At most how many zeros", "最多有多少个零点"],
        [
          "Reading Rolle's theorem backward bounds zeros from above: if $f'$ has $m$ real zeros, then $f$ has at most $m + 1$. For example, a function with a positive derivative everywhere is strictly increasing, so it can cross zero at most once. This often settles a count that formulas cannot.\n\nFor $x^3 + x + 1$ the derivative $3x^2 + 1$ is always positive, so the function has at most one real zero.\n\nCheck: $f(-1) = -1$ and $f(0) = 1$, so there is exactly one zero, between $-1$ and 0.\n\n> **Watch out.** Reading Rolle backward gives an upper bound only. It says how many zeros there can be, not how many there are.",
          "把罗尔定理反过来读就得到零点的上界：如果 $f'$ 有 $m$ 个实零点，那么 $f$ 至多有 $m + 1$ 个。例如，导数处处为正的函数严格递增，所以至多穿过零一次。公式解决不了的计数问题，这样常常能解决。\n\n对 $x^3 + x + 1$，导数 $3x^2 + 1$ 恒为正，所以函数至多有一个实零点。\n\n检验：$f(-1) = -1$，$f(0) = 1$，所以恰有一个零点，在 $-1$ 和 0 之间。\n\n> **注意。** 反过来读罗尔定理只得到上界。它说明零点最多能有几个，而不是实际有几个。",
        ],
        (rng) => {
          const k = rng.int(1, 6);
          const [a, b] = [rng.int(1, 9), rng.int(1, 9)];
          const odd = rng.bool();
          const degree = odd ? 2 * k + 1 : 2 * k;
          const answer = odd ? 1 : 2;
          const body = `x^{${degree}} + ${times(a, "x")} + ${b}`;
          const derivative = odd ? `${degree} x^{${2 * k}} + ${a}` : `${degree} ${degree === 2 ? "x" : `x^{${degree - 1}}`} + ${a}`;
          const zeros = odd ? 0 : 1;
          return solved(
            [
              `What is the largest number of real zeros that Rolle's theorem allows for $${body}$?`,
              `罗尔定理允许 $${body}$ 最多有多少个实零点？`,
            ],
            answer,
            [
              why(
                degree,
                `That is the bound from the degree alone; the derivative has only ${zeros} real ${zeros === 1 ? "zero" : "zeros"}, which gives a sharper bound.`,
                `这只是由次数得到的界；导数只有 ${zeros} 个实零点，给出更好的界。`,
              ),
              why(
                answer + 1,
                `That is one more than allowed; $f'$ has ${zeros} real ${zeros === 1 ? "zero" : "zeros"}, so $f$ has at most ${answer}.`,
                `这比允许的多一；$f'$ 有 ${zeros} 个实零点，所以 $f$ 至多有 ${answer} 个。`,
              ),
              why(
                0,
                "Rolle's theorem gives an upper bound and does not rule zeros out; the question asks for the largest number it allows.",
                "罗尔定理给出的是上界，并不排除零点；题目问的是它允许的最大个数。",
              ),
              why(
                degree + 1,
                "A polynomial never has more real zeros than its degree, and here Rolle allows fewer still.",
                "多项式的实零点个数从不超过它的次数，而这里罗尔定理允许的更少。",
              ),
            ],
            solution(
              [
                [
                  ["Differentiate", "求导"],
                  [`The derivative is $f'(x) = ${derivative}$.`, `导数是 $f'(x) = ${derivative}$。`],
                ],
                [
                  ["Count the zeros of the derivative", "数导数的零点"],
                  odd
                    ? [
                        `$x^{${2 * k}} \\ge 0$, so $f'(x) \\ge ${a} > 0$ everywhere, and $f'$ has no real zeros.`,
                        `$x^{${2 * k}} \\ge 0$，所以处处有 $f'(x) \\ge ${a} > 0$，$f'$ 没有实零点。`,
                      ]
                    : [
                        `$${degree === 2 ? "x" : `x^{${degree - 1}}`}$ is an odd power, so $f'$ is strictly increasing from $-\\infty$ to $\\infty$ and has exactly one real zero.`,
                        `$${degree === 2 ? "x" : `x^{${degree - 1}}`}$ 是奇次幂，所以 $f'$ 从 $-\\infty$ 严格递增到 $\\infty$，恰有一个实零点。`,
                      ],
                ],
                [
                  ["Read Rolle backward", "反过来用罗尔定理"],
                  [
                    `If $f$ had ${answer + 1} zeros, $f'$ would have at least ${answer}. So $f$ has at most ${answer}.`,
                    `如果 $f$ 有 ${answer + 1} 个零点，$f'$ 至少有 ${answer} 个。所以 $f$ 至多有 ${answer} 个。`,
                  ],
                ],
              ],
              odd
                ? [
                    "$f$ is strictly increasing, so its graph crosses the axis at most once.",
                    "$f$ 严格递增，所以它的图像至多穿过坐标轴一次。",
                  ]
                : [
                    "$f$ decreases until the zero of $f'$ and increases after it, so its graph crosses the axis at most twice.",
                    "$f$ 在 $f'$ 的零点之前递减，之后递增，所以它的图像至多穿过坐标轴两次。",
                  ],
            ),
          );
        },
      ),
    ],
  ),
  intro: t(
    "The function $x^2 - 4$ has zeros at $-2$ and 2, so Rolle's theorem promises a zero of its derivative $2x$ between them, and that zero is $x = 0$.\n\nCheck: $0$ lies between $-2$ and 2, and $2 \\cdot 0 = 0$.\n\nIn this lesson we use the zeros of a function to guarantee zeros of its derivatives, and read the theorem backward to bound how many zeros a function can have.",
    "函数 $x^2 - 4$ 的零点是 $-2$ 和 2，所以罗尔定理保证它的导数 $2x$ 在两者之间有零点，这个零点是 $x = 0$。\n\n检验：$0$ 在 $-2$ 和 2 之间，并且 $2 \\cdot 0 = 0$。\n\n本课我们由函数的零点保证其导数的零点，并把定理反过来读，估计函数最多能有多少个零点。",
  ),
};

const darboux = {
  ...topic(
    "darbouxs-theorem",
    ["Darboux's Theorem", "达布定理"],
    ["See why a derivative, even a discontinuous one, cannot skip values.", "了解为什么导数即使不连续，也不能跳过中间值。"],
    ["the-mean-value-theorem"],
    [],
    [
      point(
        "a-value-a-derivative-must-take",
        ["A value a derivative must take", "导数必取的值"],
        [
          "Darboux's theorem says that derivatives have the intermediate value property, even when they are not continuous. If $f$ is differentiable on $[a, b]$ and a number lies between $f'(a)$ and $f'(b)$, then $f'$ takes that value somewhere between $a$ and $b$. No continuity of $f'$ is needed.\n\nIf $f'(0) = -2$ and $f'(1) = 3$, then 0 lies between them, so $f'$ vanishes somewhere in $(0, 1)$ and $f$ has a critical point there.\n\nCheck: $f(x) = 2.5x^2 - 2x$ has $f'(x) = 5x - 2$, with $f'(0) = -2$, $f'(1) = 3$, and $f'(0.4) = 0$.\n\n> **Watch out.** Values outside the range between $f'(a)$ and $f'(b)$ are not promised. The derivative may or may not reach them.",
          "达布定理说：导数具有介值性质，即使它不连续。如果 $f$ 在 $[a, b]$ 上可导，某个数在 $f'(a)$ 和 $f'(b)$ 之间，那么 $f'$ 在 $a$ 和 $b$ 之间的某处取到这个值。不需要 $f'$ 连续。\n\n若 $f'(0) = -2$，$f'(1) = 3$，则 0 在两者之间，所以 $f'$ 在 $(0, 1)$ 中某处为零，$f$ 在那里有临界点。\n\n检验：$f(x) = 2.5x^2 - 2x$ 的导数是 $f'(x) = 5x - 2$，$f'(0) = -2$，$f'(1) = 3$，并且 $f'(0.4) = 0$。\n\n> **注意。** $f'(a)$ 与 $f'(b)$ 之间范围以外的值没有保证。导数可能取到，也可能取不到。",
        ],
        (rng) => {
          const low = rng.int(-6, 4);
          const high = low + rng.int(3, 9);
          const inside = rng.int(low + 1, high - 1);
          const flip = rng.bool();
          const [a, b] = flip ? [high, low] : [low, high];
          const outside = (v: number) =>
            reason(
              String(v),
              `${v} is ${v < low ? "below" : "above"} both $f'(0)$ and $f'(1)$; Darboux's theorem promises only the values between ${low} and ${high}.`,
              `${v} ${v < low ? "小于" : "大于"} $f'(0)$ 和 $f'(1)$；达布定理只保证 ${low} 和 ${high} 之间的值。`,
            );
          return reasoned(
            choose(
              rng,
              [
                `A function is differentiable on $[0, 1]$, with $f'(0) = ${a}$ and $f'(1) = ${b}$. Which value must $f'$ take?`,
                `函数在 $[0, 1]$ 上可导，$f'(0) = ${a}$，$f'(1) = ${b}$。$f'$ 一定取到哪个值？`,
              ],
              same(String(inside)),
              [same(String(low - 1)), same(String(high + 1)), same(String(high + 2)), same(String(low - 2))],
              asPair(
                solution(
                  [
                    [
                      ["Find the range between the ends", "求两端之间的范围"],
                      [
                        `The two derivative values are ${a} and ${b}, so the values between them run from ${low} to ${high}.`,
                        `两个导数值是 ${a} 和 ${b}，所以它们之间的值从 ${low} 到 ${high}。`,
                      ],
                    ],
                    [
                      ["Apply Darboux's theorem", "用达布定理"],
                      [
                        `${inside} lies strictly between ${low} and ${high}, so $f'(c) = ${inside}$ for some $c$ in $(0, 1)$.`,
                        `${inside} 严格在 ${low} 和 ${high} 之间，所以对 $(0, 1)$ 中某个 $c$ 有 $f'(c) = ${inside}$。`,
                      ],
                    ],
                  ],
                  [
                    `$${low} < ${inside} < ${high}$, while every other option lies outside this range, where nothing is promised.`,
                    `$${low} < ${inside} < ${high}$，而其他选项都在这个范围之外，那里没有任何保证。`,
                  ],
                ),
              ),
            ),
            [outside(low - 1), outside(high + 1), outside(high + 2), outside(low - 2)],
          );
        },
      ),
      point(
        "what-cannot-be-a-derivative",
        ["What cannot be a derivative", "什么不能是导数"],
        [
          "A function with a jump discontinuity cannot be the derivative of anything, because it skips the values inside the jump. So the sign function and the floor function have no antiderivative on an interval containing a jump, although they are integrable. Discontinuities of a derivative must be of the oscillating kind.\n\nSuppose $\\operatorname{sgn} x = F'(x)$ on $[-1, 1]$. Then $F'(-1) = -1$ and $F'(1) = 1$, so Darboux's theorem would force $F'$ to take the value $\\frac{1}{2}$ somewhere. But the sign function takes only $-1$, 0 and 1.\n\nCheck: the integral of $\\operatorname{sgn} x$ from 0 is $|x|$, which has no derivative at 0, as expected.\n\n> **Watch out.** Being integrable is not the same as having an antiderivative. A function with a jump is integrable, but its integral fails to be differentiable at the jump.",
          "有跳跃间断的函数不可能是任何函数的导数，因为它跳过了跳跃之内的值。所以符号函数和取整函数在含跳跃点的区间上没有原函数，尽管它们可积。导数的间断只能是振荡型的。\n\n假设在 $[-1, 1]$ 上 $\\operatorname{sgn} x = F'(x)$。则 $F'(-1) = -1$，$F'(1) = 1$，达布定理会迫使 $F'$ 在某处取到 $\\frac{1}{2}$。但符号函数只取 $-1$、0 和 1。\n\n检验：$\\operatorname{sgn} x$ 从 0 开始的积分是 $|x|$，它在 0 处不可导，与预期一致。\n\n> **注意。** 可积和有原函数不是一回事。有跳跃的函数可积，但它的积分在跳跃点不可导。",
        ],
        (rng) => {
          const [a, b] = [rng.int(2, 9), rng.int(2, 9)];
          const jump = rng.pick<Pair>([
            [`$f(x) = ${a}$ for $x < 0$ and $f(x) = ${a + b}$ for $x \\ge 0$`, `$x < 0$ 时 $f(x) = ${a}$，$x \\ge 0$ 时 $f(x) = ${a + b}$`],
            [`$f(x) = ${a} \\lfloor x \\rfloor$`, `$f(x) = ${a} \\lfloor x \\rfloor$`],
            [`$f(x) = ${a} \\operatorname{sgn} x + ${b}$`, `$f(x) = ${a} \\operatorname{sgn} x + ${b}$`],
          ]);
          const skipped: Pair = jump[0].includes("lfloor")
            ? [
                `At $x = 1$ it jumps from 0 to ${a}, so it never takes the values strictly between 0 and ${a}.`,
                `在 $x = 1$ 处它从 0 跳到 ${a}，所以从不取 0 和 ${a} 之间的值。`,
              ]
            : jump[0].includes("sgn")
              ? [
                  `At $x = 0$ it jumps from ${b - a} to ${a + b}, taking only the value ${b} in between.`,
                  `在 $x = 0$ 处它从 ${b - a} 跳到 ${a + b}，其间只取 ${b} 这一个值。`,
                ]
              : [
                  `At $x = 0$ it jumps from ${a} to ${a + b}, so it never takes the values strictly between them.`,
                  `在 $x = 0$ 处它从 ${a} 跳到 ${a + b}，所以从不取两者之间的值。`,
                ];
          const continuous: [string, string] = [
            "It is continuous, so its integral from 0 to $x$ is an antiderivative.",
            "它连续，所以它从 0 到 $x$ 的积分就是原函数。",
          ];
          return reasoned(
            choose(
              rng,
              [
                "On an interval containing 0 and 1, which function cannot be the derivative of a differentiable function?",
                "在包含 0 和 1 的区间上，哪个函数不可能是可导函数的导数？",
              ],
              jump,
              [same(`f(x) = ${a} x^2 + ${b}`), same(`f(x) = ${a} |x|`), same(`f(x) = ${a} \\cos ${b} x`)],
              asPair(
                solution(
                  [
                    [["Look for a jump", "找跳跃"], skipped],
                    [
                      ["Apply Darboux's theorem", "用达布定理"],
                      [
                        "A derivative takes every value between any two of its values, so a function that skips values cannot be a derivative.",
                        "导数取遍它任意两个值之间的所有值，所以跳过某些值的函数不可能是导数。",
                      ],
                    ],
                  ],
                  [
                    "Each of the other three is continuous, and every continuous function on an interval is the derivative of its integral.",
                    "其他三个都连续，而区间上的每个连续函数都是它的积分的导数。",
                  ],
                ),
              ),
            ),
            [
              reason(`f(x) = ${a} x^2 + ${b}`, continuous[0], continuous[1]),
              reason(
                `f(x) = ${a} |x|`,
                `It has a corner at 0 but no jump. ${continuous[0]}`,
                `它在 0 处有尖角，但没有跳跃。${continuous[1]}`,
              ),
              reason(`f(x) = ${a} \\cos ${b} x`, continuous[0], continuous[1]),
            ],
          );
        },
      ),
    ],
  ),
  intro: t(
    "Let $f(x) = x^2 \\sin \\frac{1}{x}$ with $f(0) = 0$. Its derivative exists everywhere but oscillates near 0 and is not continuous there. Even so, Darboux's theorem says $f'$ cannot jump over any value.\n\nCheck: $f'(0) = \\lim_{h \\to 0} h \\sin \\frac{1}{h} = 0$, since $|h \\sin \\frac{1}{h}| \\le |h|$.\n\nIn this lesson we find values a derivative must take, and use this to rule out functions with jumps as derivatives.",
    "设 $f(x) = x^2 \\sin \\frac{1}{x}$，$f(0) = 0$。它的导数处处存在，但在 0 附近振荡，在那里不连续。即便如此，达布定理说 $f'$ 不能跳过任何值。\n\n检验：$f'(0) = \\lim_{h \\to 0} h \\sin \\frac{1}{h} = 0$，因为 $|h \\sin \\frac{1}{h}| \\le |h|$。\n\n本课我们求导数必取的值，并用它排除有跳跃的函数作为导数。",
  ),
};

const lagrange = {
  ...topic(
    "taylors-theorem-with-remainder",
    ["Taylor's Theorem with Remainder", "带余项的泰勒定理"],
    ["Bound the error of a Taylor polynomial using the next derivative.", "用下一阶导数估计泰勒多项式的误差。"],
    ["bounds-from-the-mean-value-theorem"],
    [],
    [
      point(
        "the-lagrange-bound",
        ["The Lagrange bound", "拉格朗日余项的界"],
        [
          "Taylor's theorem says that the error of the degree $n$ polynomial at $a$ is $\\frac{f^{(n+1)}(c)}{(n+1)!} (x - a)^{n+1}$ for some $c$ between $a$ and $x$. If the next derivative has size at most $M$, then the error is at most $\\frac{M |x - a|^{n+1}}{(n+1)!}$. The mean value theorem is the case $n = 0$.\n\nFor $\\sin x$ at 0 with degree 3 and $x = \\frac{1}{2}$, all derivatives are at most 1, so the error is at most $\\frac{(\\frac{1}{2})^4}{4!} = \\frac{1}{16 \\cdot 24} = \\frac{1}{384}$.\n\nCheck: the polynomial gives $0.5 - \\frac{0.125}{6} \\approx 0.479167$, while $\\sin 0.5 \\approx 0.479426$, an error of about $0.00026$, below $\\frac{1}{384} \\approx 0.0026$.\n\n> **Watch out.** The power and the factorial both use $n + 1$, one more than the degree of the polynomial.",
          "泰勒定理说：在 $a$ 处的 $n$ 次多项式，误差是 $\\frac{f^{(n+1)}(c)}{(n+1)!} (x - a)^{n+1}$，其中 $c$ 在 $a$ 和 $x$ 之间。如果下一阶导数的模不超过 $M$，误差就不超过 $\\frac{M |x - a|^{n+1}}{(n+1)!}$。中值定理就是 $n = 0$ 的情形。\n\n对 $\\sin x$ 在 0 处的 3 次多项式，取 $x = \\frac{1}{2}$，各阶导数的模都不超过 1，所以误差不超过 $\\frac{(\\frac{1}{2})^4}{4!} = \\frac{1}{16 \\cdot 24} = \\frac{1}{384}$。\n\n检验：多项式给出 $0.5 - \\frac{0.125}{6} \\approx 0.479167$，而 $\\sin 0.5 \\approx 0.479426$，误差约为 $0.00026$，小于 $\\frac{1}{384} \\approx 0.0026$。\n\n> **注意。** 幂次和阶乘都用 $n + 1$，比多项式的次数多一。",
        ],
        (rng) => {
          const n = rng.int(1, 4);
          const q = rng.int(2, 6);
          const M = rng.int(1, 5);
          const trig = rng.pick(["\\sin x", "\\cos x"]);
          const name = `${M === 1 ? "" : `${M} `}${trig}`;
          const answer = Q.of(M, q ** (n + 1) * factorial(n + 1));
          const x = 1 / q;
          const at0 = trig === "\\sin x" ? [0, 1, 0, -1] : [1, 0, -1, 0];
          let poly = 0;
          for (let k = 0; k <= n; k++) poly += (M * (at0[k % 4] as number) * x ** k) / factorial(k);
          const exact = M * (trig === "\\sin x" ? Math.sin(x) : Math.cos(x));
          const error = Math.abs(exact - poly);
          const sci = (v: number) => {
            const [mantissa, power] = v.toExponential(2).split("e");
            return Number(power) === 0 ? `${mantissa}` : `${mantissa} \\times 10^{${Number(power)}}`;
          };
          return solved(
            [
              `Using all derivatives bounded by ${M}, what bound does Taylor's theorem give for the error at $x = \\frac{1}{${q}}$ of the degree ${n} polynomial of $${name}$ at 0?`,
              `利用所有导数的模都不超过 ${M}，泰勒定理对 $${name}$ 在 0 处的 ${n} 次多项式，在 $x = \\frac{1}{${q}}$ 处的误差给出什么界？`,
            ],
            answer,
            [
              why(
                Q.of(M, q ** n * factorial(n)),
                `That uses the power ${n} and $${n}!$; the remainder of the degree ${n} polynomial uses $${n + 1}$ and $(${n + 1})!$.`,
                `这用了 ${n} 次幂和 $${n}!$；${n} 次多项式的余项要用 $${n + 1}$ 次幂和 $(${n + 1})!$。`,
              ),
              why(
                Q.of(M, q ** (n + 1)),
                `That leaves out the factorial $${n + 1}! = ${factorial(n + 1)}$.`,
                `这漏掉了阶乘 $${n + 1}! = ${factorial(n + 1)}$。`,
              ),
              why(
                Q.of(M, q ** (n + 1) * (n + 1)),
                `That divides by $${n + 1}$ instead of $${n + 1}! = ${factorial(n + 1)}$.`,
                `这除以了 $${n + 1}$，而不是 $${n + 1}! = ${factorial(n + 1)}$。`,
              ),
              why(
                Q.of(M, q ** (n + 2) * factorial(n + 2)),
                `That goes two past the degree; the remainder of the degree ${n} polynomial uses the derivative of order ${n + 1}.`,
                `这比次数多了二；${n} 次多项式的余项用的是 ${n + 1} 阶导数。`,
              ),
            ],
            solution(
              [
                [
                  ["Write the bound", "写出界"],
                  [
                    `With $M = ${M}$ and degree ${n}, the error is at most $\\frac{${times(M, `|x|^{${n + 1}}`)}}{${n + 1}!}$.`,
                    `取 $M = ${M}$，次数为 ${n}，误差不超过 $\\frac{${times(M, `|x|^{${n + 1}}`)}}{${n + 1}!}$。`,
                  ],
                ],
                [
                  ["Put in the point", "代入这一点"],
                  [
                    `At $x = \\frac{1}{${q}}$, $|x|^{${n + 1}} = \\frac{1}{${q ** (n + 1)}}$ and $${n + 1}! = ${factorial(n + 1)}$, so the bound is $\\frac{${M}}{${q ** (n + 1)} \\times ${factorial(n + 1)}} = ${answer.toLatex()}$.`,
                    `在 $x = \\frac{1}{${q}}$ 处，$|x|^{${n + 1}} = \\frac{1}{${q ** (n + 1)}}$，$${n + 1}! = ${factorial(n + 1)}$，所以界是 $\\frac{${M}}{${q ** (n + 1)} \\times ${factorial(n + 1)}} = ${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `The actual error is about $${sci(error)}$, which is indeed at most $${answer.toLatex()} \\approx ${sci(answer.toNumber())}$.`,
                `实际误差约为 $${sci(error)}$，确实不超过 $${answer.toLatex()} \\approx ${sci(answer.toNumber())}$。`,
              ],
            ),
          );
        },
      ),
      point(
        "the-degree-needed",
        ["The degree needed", "所需的次数"],
        [
          "To reach a required accuracy, increase $n$ until the bound falls below the tolerance. Since $(n + 1)!$ grows faster than any power, the remainder for functions like $\\sin x$ and $e^x$ tends to zero at every $x$. This is why their Taylor series converge to them on the whole line.\n\nFor $\\sin x$ at $x = 1$ with tolerance $\\frac{1}{100}$, the bound $\\frac{1}{(n + 1)!}$ must be below $\\frac{1}{100}$, so $(n + 1)!$ must exceed 100. Since $4! = 24$ and $5! = 120$, the degree is $n = 4$.\n\nCheck: at $n = 4$ the bound is $\\frac{1}{120} \\approx 0.0083 < 0.01$, while at $n = 3$ it is $\\frac{1}{24} \\approx 0.042$, which is too big.\n\n> **Watch out.** The degree $n$ polynomial has the bound with $(n + 1)!$, so the answer is one less than the factorial that first beats the tolerance.",
          "要达到所需的精度，就增大 $n$，直到界低于容许误差。由于 $(n + 1)!$ 比任何幂增长得都快，$\\sin x$、$e^x$ 这类函数的余项在每个 $x$ 处都趋于零。所以它们的泰勒级数在整条实轴上收敛到它们本身。\n\n对 $\\sin x$ 在 $x = 1$ 处，容许误差 $\\frac{1}{100}$，界 $\\frac{1}{(n + 1)!}$ 必须小于 $\\frac{1}{100}$，所以 $(n + 1)!$ 必须超过 100。因为 $4! = 24$，$5! = 120$，所以次数是 $n = 4$。\n\n检验：$n = 4$ 时界是 $\\frac{1}{120} \\approx 0.0083 < 0.01$，而 $n = 3$ 时是 $\\frac{1}{24} \\approx 0.042$，太大了。\n\n> **注意。** $n$ 次多项式的界用的是 $(n + 1)!$，所以答案比首次满足精度的阶乘的阶数少一。",
        ],
        (rng) => {
          const x = rng.int(1, 4);
          const m = rng.pick([10, 20, 50, 100, 200, 500, 1000, 2000, 5000]);
          let n = 0;
          while (x ** (n + 1) / factorial(n + 1) >= 1 / m) n++;
          const bound = (k: number) => `\\frac{${x ** (k + 1)}}{${factorial(k + 1)}}`;
          const size = (k: number) => (x ** (k + 1) / factorial(k + 1)).toPrecision(3);
          return solved(
            [
              `For $\\sin x$ at 0, with all derivatives bounded by 1, what is the smallest degree $n$ whose bound $\\frac{${x}^{n+1}}{(n+1)!}$ at $x = ${x}$ is less than $\\frac{1}{${m}}$?`,
              `对 $\\sin x$ 在 0 处展开，所有导数的模不超过 1。在 $x = ${x}$ 处，使界 $\\frac{${x}^{n+1}}{(n+1)!}$ 小于 $\\frac{1}{${m}}$ 的最小次数 $n$ 是多少？`,
            ],
            n,
            [
              n - 1 >= 0
                ? why(
                    n - 1,
                    `That is one too small; at $n = ${n - 1}$ the bound is $${bound(n - 1)} \\approx ${size(n - 1)}$, not below $\\frac{1}{${m}}$.`,
                    `这小了一；$n = ${n - 1}$ 时界是 $${bound(n - 1)} \\approx ${size(n - 1)}$，不小于 $\\frac{1}{${m}}$。`,
                  )
                : why(n + 3, "That is far more than needed; a smaller degree already works.", "这远远超过所需；更小的次数已经满足。"),
              why(
                n + 1,
                `That works, but it is not the smallest; $n = ${n}$ already gives $${bound(n)}$.`,
                `这也满足，但不是最小的；$n = ${n}$ 已经给出 $${bound(n)}$。`,
              ),
              why(
                n + 2,
                `That is two more than needed; $n = ${n}$ already gives $${bound(n)}$.`,
                `这比所需多二；$n = ${n}$ 已经给出 $${bound(n)}$。`,
              ),
              why(m, "That is the denominator of the tolerance, not a degree.", "这是容许误差的分母，不是次数。"),
            ],
            solution(
              [
                [
                  ["Write the condition", "写出条件"],
                  [
                    `The degree $n$ bound at $x = ${x}$ is $\\frac{${x}^{n+1}}{(n+1)!}$, and it must be below $\\frac{1}{${m}} = ${1 / m}$.`,
                    `在 $x = ${x}$ 处，$n$ 次的界是 $\\frac{${x}^{n+1}}{(n+1)!}$，它必须小于 $\\frac{1}{${m}} = ${1 / m}$。`,
                  ],
                ],
                [
                  ["Try degrees in turn", "依次试次数"],
                  [
                    `At $n = ${n - 1}$ the bound is $${bound(n - 1)} \\approx ${size(n - 1)}$, too big, and at $n = ${n}$ it is $${bound(n)} \\approx ${size(n)}$, below $${1 / m}$.`,
                    `$n = ${n - 1}$ 时界是 $${bound(n - 1)} \\approx ${size(n - 1)}$，太大；$n = ${n}$ 时是 $${bound(n)} \\approx ${size(n)}$，小于 $${1 / m}$。`,
                  ],
                ],
              ],
              [
                `$${size(n)} < ${1 / m} \\le ${size(n - 1)}$, so $n = ${n}$ is the first degree that is accurate enough.`,
                `$${size(n)} < ${1 / m} \\le ${size(n - 1)}$，所以 $n = ${n}$ 是第一个足够精确的次数。`,
              ],
            ),
          );
        },
      ),
    ],
  ),
  intro: t(
    "The degree 1 polynomial of $\\sin x$ at 0 is $x$. At $x = 0.1$, every derivative of $\\sin$ is at most 1, so the error is at most $\\frac{0.1^2}{2!} = 0.005$.\n\nCheck: $\\sin 0.1 \\approx 0.0998334$, which differs from $0.1$ by about $0.00017$, well within $0.005$.\n\nIn this lesson we bound the error of a Taylor polynomial by the next derivative, and find the degree needed for a given accuracy.",
    "$\\sin x$ 在 0 处的 1 次多项式是 $x$。在 $x = 0.1$ 处，$\\sin$ 的各阶导数的模都不超过 1，所以误差不超过 $\\frac{0.1^2}{2!} = 0.005$。\n\n检验：$\\sin 0.1 \\approx 0.0998334$，与 $0.1$ 相差约 $0.00017$，远在 $0.005$ 之内。\n\n本课我们用下一阶导数估计泰勒多项式的误差，并求达到给定精度所需的次数。",
  ),
};

const integralBounds = {
  ...topic(
    "bounds-and-means-of-integrals",
    ["Bounds and Means of Integrals", "积分的界和平均值"],
    [
      "Estimate an integral from the size of its integrand, and find the value guaranteed in the mean.",
      "由被积函数的大小估计积分，并求平均值定理保证的值。",
    ],
    ["riemann-integrability"],
    [],
    [
      point(
        "an-estimate-from-bounds",
        ["An estimate from bounds", "由界得到的估计"],
        [
          "If $m \\le f \\le M$ on $[a, b]$, then every upper and lower sum lies between $m (b - a)$ and $M (b - a)$, and so does the integral. The inequality needs only integrability, and it gives a quick estimate of integrals that have no simple formula.\n\nOn $[0, 1]$ the function $e^{-x^2}$ lies between $e^{-1} \\approx 0.368$ and 1, so $\\int_0^1 e^{-x^2} \\, dx$ lies between $0.368$ and 1.\n\nCheck: the integral is about $0.747$, which is indeed between the two bounds.\n\n> **Watch out.** Find the largest and smallest values over the whole interval. For a function that is not monotone they need not be at the ends.",
          "如果在 $[a, b]$ 上 $m \\le f \\le M$，那么每个上和、下和都在 $m (b - a)$ 和 $M (b - a)$ 之间，积分也一样。这个不等式只需要可积，它能快速估计没有简单公式的积分。\n\n在 $[0, 1]$ 上，函数 $e^{-x^2}$ 在 $e^{-1} \\approx 0.368$ 和 1 之间，所以 $\\int_0^1 e^{-x^2} \\, dx$ 在 $0.368$ 和 1 之间。\n\n检验：这个积分约为 $0.747$，确实在两个界之间。\n\n> **注意。** 要找整个区间上的最大值和最小值。对不单调的函数，它们不一定在端点处。",
        ],
        (rng) => {
          const a = rng.int(0, 5);
          const b = a + rng.int(1, 6);
          const c = rng.int(1, 9);
          const upper = rng.bool();
          const value = upper ? (b * b + c) * (b - a) : (a * a + c) * (b - a);
          const name = upper ? "upper" : "lower";
          const zh = upper ? "上" : "下";
          const body = `x^2 + ${c}`;
          const height = upper ? b * b + c : a * a + c;
          const other = upper ? (a * a + c) * (b - a) : (b * b + c) * (b - a);
          const exact = Q.of(b ** 3 - a ** 3, 3).add(Q.of(c * (b - a), 1));
          const [low, high] = upper ? [other, value] : [value, other];
          return solved(
            [
              `Using the largest and smallest values of $${body}$ on the interval, what is the ${name} bound this gives for $\\int_{${a}}^{${b}} (${body}) \\, dx$?`,
              `利用 $${body}$ 在区间上的最大值和最小值，$\\int_{${a}}^{${b}} (${body}) \\, dx$ 的${zh}界是多少？`,
            ],
            value,
            [
              why(
                other,
                `That is the ${upper ? "lower" : "upper"} bound, from the ${upper ? "smallest" : "largest"} value of the function.`,
                `这是${upper ? "下" : "上"}界，用的是函数的${upper ? "最小" : "最大"}值。`,
              ),
              why(
                height,
                `That is the ${upper ? "largest" : "smallest"} value alone; multiply it by the length ${b - a}.`,
                `这只是${upper ? "最大" : "最小"}值；还要乘长度 ${b - a}。`,
              ),
              why(
                value + b - a,
                `That uses the height ${height + 1}; the ${upper ? "largest" : "smallest"} value is ${height}.`,
                `这用了高度 ${height + 1}；${upper ? "最大" : "最小"}值是 ${height}。`,
              ),
              why(
                (a * a + b * b + c) * (b - a),
                `That puts both end values $${a}^2$ and $${b}^2$ into the height; use only the ${upper ? "largest" : "smallest"} value, ${height}.`,
                `这把两端的 $${a}^2$ 和 $${b}^2$ 都放进了高度；只能用${upper ? "最大" : "最小"}值 ${height}。`,
              ),
            ],
            solution(
              [
                [
                  [`Find the ${upper ? "largest" : "smallest"} value`, `求${upper ? "最大" : "最小"}值`],
                  [
                    `Since $${a} \\ge 0$, $${body}$ is increasing on $[${a}, ${b}]$, so its ${upper ? "largest" : "smallest"} value is at $x = ${upper ? b : a}$: $${upper ? b : a}^2 + ${c} = ${height}$.`,
                    `因为 $${a} \\ge 0$，$${body}$ 在 $[${a}, ${b}]$ 上递增，所以${upper ? "最大" : "最小"}值在 $x = ${upper ? b : a}$ 处：$${upper ? b : a}^2 + ${c} = ${height}$。`,
                  ],
                ],
                [
                  ["Multiply by the length", "乘以长度"],
                  [
                    `The interval has length ${b - a}, and the height ${height} times the length ${b - a} gives ${value}.`,
                    `区间长度是 ${b - a}，高度 ${height} 乘长度 ${b - a} 得 ${value}。`,
                  ],
                ],
              ],
              [
                `The exact integral is $${exact.toLatex()} \\approx ${exact.toNumber().toFixed(2)}$, which lies between ${low} and ${high}.`,
                `精确的积分是 $${exact.toLatex()} \\approx ${exact.toNumber().toFixed(2)}$，在 ${low} 和 ${high} 之间。`,
              ],
            ),
          );
        },
      ),
      point(
        "the-value-guaranteed-in-the-mean",
        ["The value guaranteed in the mean", "平均值定理保证的值"],
        [
          "A continuous function on $[a, b]$ takes its average value somewhere: there is a $c$ with $f(c) = \\frac{1}{b - a} \\int_a^b f$. The average lies between the minimum and maximum, and the intermediate value theorem provides the point. Continuity is essential, since a step function can jump over its average.\n\nFor $f(x) = x^2$ on $[0, 3]$ the integral is 9 and the length is 3, so the average is 3, and $f(c) = 3$ at $c = \\sqrt{3} \\approx 1.732$.\n\nCheck: $\\sqrt{3}$ lies in $[0, 3]$, and $(\\sqrt{3})^2 = 3$.\n\n> **Watch out.** Divide the integral by the length of the interval, not by 2 or by the sum of the ends.",
          "$[a, b]$ 上的连续函数在某处取到它的平均值：存在 $c$ 使 $f(c) = \\frac{1}{b - a} \\int_a^b f$。平均值在最小值和最大值之间，介值定理给出这一点。连续性是必需的，因为阶梯函数可以跳过它的平均值。\n\n对 $[0, 3]$ 上的 $f(x) = x^2$，积分是 9，长度是 3，所以平均值是 3，在 $c = \\sqrt{3} \\approx 1.732$ 处 $f(c) = 3$。\n\n检验：$\\sqrt{3}$ 在 $[0, 3]$ 中，并且 $(\\sqrt{3})^2 = 3$。\n\n> **注意。** 用积分除以区间的长度，而不是除以 2 或两端之和。",
        ],
        (rng) => {
          const a = rng.int(-3, 4);
          const b = a + rng.int(2, 8);
          const integral = rng.int(5, 60);
          const answer = Q.of(integral, b - a);
          const length = b - a;
          const minus = `${b} - ${a < 0 ? `(${a})` : a}`;
          return solved(
            [
              `A continuous function has $\\int_{${a}}^{${b}} f(x) \\, dx = ${integral}$. What value must $f$ take on the interval?`,
              `连续函数满足 $\\int_{${a}}^{${b}} f(x) \\, dx = ${integral}$。$f$ 在区间上一定取到什么值？`,
            ],
            answer,
            [
              why(integral, `That is the integral itself; divide it by the length ${length}.`, `这是积分本身；还要除以长度 ${length}。`),
              why(
                Q.of(integral, b + a === 0 ? 1 : Math.abs(b + a)),
                `That divides by the sum of the ends; the length is $${minus} = ${length}$.`,
                `这除以了两端之和；长度是 $${minus} = ${length}$。`,
              ),
              why(
                Q.of(integral, 2),
                `That divides by 2, as for the average of two numbers; divide by the length ${length}.`,
                `这除以了 2，像求两个数的平均；要除以长度 ${length}。`,
              ),
              why(
                Q.of(b - a, integral),
                "That is upside down; the average is the integral divided by the length.",
                "这颠倒了；平均值是积分除以长度。",
              ),
            ],
            solution(
              [
                [
                  ["Find the length", "求长度"],
                  [`The interval has length $${minus} = ${length}$.`, `区间长度是 $${minus} = ${length}$。`],
                ],
                [
                  ["Divide", "相除"],
                  [
                    `The mean value theorem for integrals gives $f(c) = \\frac{${integral}}{${length}} = ${answer.toLatex()}$ for some $c$ in the interval.`,
                    `积分中值定理给出区间内某个 $c$ 使 $f(c) = \\frac{${integral}}{${length}} = ${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `A constant function equal to $${answer.toLatex()}$ on an interval of length ${length} has integral $${answer.toLatex()} \\times ${length} = ${integral}$, as required.`,
                `在长度为 ${length} 的区间上恒等于 $${answer.toLatex()}$ 的函数，积分是 $${answer.toLatex()} \\times ${length} = ${integral}$，符合要求。`,
              ],
            ),
          );
        },
      ),
    ],
  ),
  intro: t(
    "On $[1, 2]$ the function $\\frac{1}{x}$ lies between $\\frac{1}{2}$ and 1, and the interval has length 1, so $\\int_1^2 \\frac{1}{x} \\, dx$ lies between $\\frac{1}{2}$ and 1.\n\nCheck: the integral is $\\ln 2 \\approx 0.693$, which is between $0.5$ and 1.\n\nIn this lesson we bound an integral by the largest and smallest values of its integrand, and find the value that a continuous function must take in the mean.",
    "在 $[1, 2]$ 上，函数 $\\frac{1}{x}$ 在 $\\frac{1}{2}$ 和 1 之间，区间长度是 1，所以 $\\int_1^2 \\frac{1}{x} \\, dx$ 在 $\\frac{1}{2}$ 和 1 之间。\n\n检验：这个积分是 $\\ln 2 \\approx 0.693$，在 $0.5$ 和 1 之间。\n\n本课我们用被积函数的最大值和最小值估计积分，并求连续函数在平均意义下必取的值。",
  ),
};

/** slope writes a rate times a symbol, leaving out a rate of one and writing a rate of minus one as a sign. */
const slope = (c: number, symbol: string): string => (c === 1 ? symbol : c === -1 ? `-${symbol}` : `${c} ${symbol}`);

const ftc = {
  ...topic(
    "the-fundamental-theorem-in-analysis",
    ["The Fundamental Theorem in Analysis", "分析中的微积分基本定理"],
    ["See exactly where an accumulation function is differentiable.", "准确了解累积函数在哪里可导。"],
    ["riemann-integrability"],
    [],
    [
      point(
        "an-accumulation-function-from-a-step",
        ["An accumulation function from a step", "由阶梯函数得到的累积函数"],
        [
          "Even when $f$ is merely integrable, $F(x) = \\int_a^x f$ is continuous. Where $f$ is continuous, the proof of the fundamental theorem shows $F' = f$. So for a step function, $F$ is built from straight pieces whose slopes are the heights of the steps, and they meet with no gaps.\n\nLet $f = 2$ on $[0, 1)$ and $f = 5$ from 1 on. Then $F(3)$ adds the area 2 of the first piece and the area 10 of the second, so $F(3) = 12$, and $F'(3) = 5$.\n\nCheck: from $x = 1$ on, $F$ starts at $F(1) = 2$ and rises 5 per unit, so two units later it is $2 + 10 = 12$.\n\n> **Watch out.** $F' = f$ holds where $f$ is continuous. At the jump itself $F$ has a corner and no derivative.",
          "即使 $f$ 只是可积，$F(x) = \\int_a^x f$ 也是连续的。在 $f$ 连续的地方，微积分基本定理的证明给出 $F' = f$。所以对阶梯函数，$F$ 由若干直线段组成，斜率就是阶梯的高度，它们无缝相接。\n\n设 $[0, 1)$ 上 $f = 2$，从 1 起 $f = 5$。则 $F(3)$ 把第一段的面积 2 和第二段的面积 10 相加，所以 $F(3) = 12$，$F'(3) = 5$。\n\n检验：从 $x = 1$ 起，$F$ 从 $F(1) = 2$ 出发，每单位上升 5，所以两个单位后是 $2 + 10 = 12$。\n\n> **注意。** $F' = f$ 在 $f$ 连续的地方成立。在跳跃点本身，$F$ 有尖角，没有导数。",
        ],
        (rng) => {
          const [p, q] = rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 2) as [number, number];
          const c = rng.int(1, 5);
          const x = c + rng.int(1, 5);
          const askSlope = rng.bool();
          const answer = askSlope ? q : p * c + q * (x - c);
          const value = p * c + q * (x - c);
          const mistakes = askSlope
            ? [
                why(
                  p,
                  `That is the slope on the first piece $[0, ${c})$; the point ${x} lies past ${c}.`,
                  `这是第一段 $[0, ${c})$ 上的斜率；点 ${x} 在 ${c} 之后。`,
                ),
                why(
                  q - p,
                  `That is the jump of $f$ at ${c}, not the slope of $F$ at ${x}.`,
                  `这是 $f$ 在 ${c} 处的跳跃，不是 $F$ 在 ${x} 处的斜率。`,
                ),
                why(value, `That is the value $F(${x})$, not its derivative.`, `这是函数值 $F(${x})$，不是它的导数。`),
                why(
                  q * x,
                  `That is the area under height ${q} from 0 to ${x}, not a slope.`,
                  `这是从 0 到 ${x} 高为 ${q} 的面积，不是斜率。`,
                ),
              ]
            : [
                why(
                  q * x,
                  `That uses the height ${q} all the way from 0; on $[0, ${c})$ the height is ${p}.`,
                  `这从 0 起一直用高度 ${q}；在 $[0, ${c})$ 上高度是 ${p}。`,
                ),
                why(
                  p * x,
                  `That uses the height ${p} all the way; from ${c} on the height is ${q}.`,
                  `这一直用高度 ${p}；从 ${c} 起高度是 ${q}。`,
                ),
                why(q, `That is the slope $F'(${x})$, not the value $F(${x})$.`, `这是斜率 $F'(${x})$，不是函数值 $F(${x})$。`),
                why(
                  p * c,
                  `That is only the area of the first piece; add the second, ${q * (x - c)}.`,
                  `这只是第一段的面积；还要加第二段的 ${q * (x - c)}。`,
                ),
              ];
          const worked = askSlope
            ? solution(
                [
                  [
                    ["Locate the point", "确定点的位置"],
                    [
                      `${x} is greater than ${c}, so it lies inside the second piece, where $f = ${q}$ and $f$ is continuous.`,
                      `${x} 大于 ${c}，所以在第二段内部，那里 $f = ${q}$ 且连续。`,
                    ],
                  ],
                  [
                    ["Apply the fundamental theorem", "用微积分基本定理"],
                    [
                      `At a point of continuity $F' = f$, so $F'(${x}) = f(${x}) = ${q}$.`,
                      `在连续点处 $F' = f$，所以 $F'(${x}) = f(${x}) = ${q}$。`,
                    ],
                  ],
                ],
                [
                  `For $t \\ge ${c}$, $F(t) = ${p * c} + ${slope(q, `(t - ${c})`)}$, a straight line with slope ${q}.`,
                  `当 $t \\ge ${c}$ 时，$F(t) = ${p * c} + ${slope(q, `(t - ${c})`)}$，是斜率为 ${q} 的直线。`,
                ],
              )
            : solution(
                [
                  [
                    ["Area of the first piece", "第一段的面积"],
                    [
                      `On $[0, ${c})$ the height is ${p}, so the area is $${p} \\times ${c} = ${p * c}$.`,
                      `在 $[0, ${c})$ 上高度是 ${p}，面积是 $${p} \\times ${c} = ${p * c}$。`,
                    ],
                  ],
                  [
                    ["Area of the second piece", "第二段的面积"],
                    [
                      `On $[${c}, ${x}]$ the height is ${q}, so the area is $${q} \\times ${x - c} = ${q * (x - c)}$, and $F(${x}) = ${p * c} + ${q * (x - c)} = ${value}$.`,
                      `在 $[${c}, ${x}]$ 上高度是 ${q}，面积是 $${q} \\times ${x - c} = ${q * (x - c)}$，所以 $F(${x}) = ${p * c} + ${q * (x - c)} = ${value}$。`,
                    ],
                  ],
                ],
                [
                  `The average height $\\frac{${value}}{${x}} \\approx ${(value / x).toFixed(2)}$ lies between ${Math.min(p, q)} and ${Math.max(p, q)}, as an average of the two heights must.`,
                  `平均高度 $\\frac{${value}}{${x}} \\approx ${(value / x).toFixed(2)}$ 在 ${Math.min(p, q)} 和 ${Math.max(p, q)} 之间，两个高度的平均值必然如此。`,
                ],
              );
          return solved(
            [
              `Let $f = ${p}$ on $[0, ${c})$ and $f = ${q}$ on $[${c}, \\infty)$, and $F(x) = \\int_0^x f$. What is ${askSlope ? `$F'(${x})$` : `$F(${x})$`}?`,
              `设 $[0, ${c})$ 上 $f = ${p}$，$[${c}, \\infty)$ 上 $f = ${q}$，$F(x) = \\int_0^x f$。${askSlope ? `$F'(${x})$` : `$F(${x})$`} 是多少？`,
            ],
            answer,
            mistakes,
            worked,
          );
        },
      ),
      point(
        "a-corner-at-a-jump",
        ["A corner at a jump", "跳跃处的尖角"],
        [
          "At a jump of $f$, the accumulation function has one-sided derivatives equal to the one-sided limits of $f$, and they differ. So $F$ has a corner there and is not differentiable, although it is still continuous. Integrating improves a function by one step: jumps become corners, and corners become smooth curves.\n\nIf $f = 1$ for $x < 2$ and $f = 3$ for $x \\ge 2$, then $F$ rises with slope 1 up to $x = 2$ and with slope 3 after it, so the right derivative minus the left derivative at 2 is 2.\n\nCheck: $F(2) = 2$ and $F(3) = 2 + 3 = 5$, while $F(1) = 1$, so the slopes on the two sides are $5 - 2 = 3$ and $2 - 1 = 1$.\n\n> **Watch out.** $F$ is still continuous at the jump. The jump of $f$ shows up as a change in the slope of $F$, not as a gap in its values.",
          "在 $f$ 的跳跃处，累积函数的单侧导数等于 $f$ 的单侧极限，二者不同。所以 $F$ 在那里有尖角，不可导，但仍然连续。积分使函数变好一步：跳跃变成尖角，尖角变成光滑曲线。\n\n若 $x < 2$ 时 $f = 1$，$x \\ge 2$ 时 $f = 3$，则 $F$ 在 $x = 2$ 之前以斜率 1 上升，之后以斜率 3 上升，所以在 2 处右导数减左导数是 2。\n\n检验：$F(2) = 2$，$F(3) = 2 + 3 = 5$，$F(1) = 1$，所以两侧的斜率是 $5 - 2 = 3$ 和 $2 - 1 = 1$。\n\n> **注意。** $F$ 在跳跃点仍然连续。$f$ 的跳跃表现为 $F$ 斜率的变化，而不是函数值的断开。",
        ],
        (rng) => {
          const [p, q] = rng.sample([-3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8], 2) as [number, number];
          const c = rng.int(1, 6);
          const answer = q - p;
          const wrongs = [p - q, p + q, q, p].filter((v) => v !== answer);
          const reasons: Record<string, [string, string]> = {
            [String(p - q)]: [
              "That is the left derivative minus the right one; the question asks for right minus left.",
              "这是左导数减右导数；题目问的是右减左。",
            ],
            [String(p + q)]: [
              "That adds the two one-sided derivatives; subtract the left one from the right one.",
              "这把两个单侧导数相加了；要用右导数减左导数。",
            ],
            [String(q)]: [
              `That is only the right derivative ${q}; subtract the left derivative ${p}.`,
              `这只是右导数 ${q}；还要减去左导数 ${p}。`,
            ],
            [String(p)]: [
              `That is only the left derivative ${p}; the question asks for the right one minus it.`,
              `这只是左导数 ${p}；题目问的是右导数减去它。`,
            ],
          };
          return solved(
            [
              `Let $f = ${p}$ for $x < ${c}$ and $f = ${q}$ for $x \\ge ${c}$, and $F(x) = \\int_0^x f$. What is the right derivative of $F$ at ${c} minus the left derivative?`,
              `设 $x < ${c}$ 时 $f = ${p}$，$x \\ge ${c}$ 时 $f = ${q}$，$F(x) = \\int_0^x f$。$F$ 在 ${c} 处的右导数减左导数是多少？`,
            ],
            answer,
            wrongs.map((v) => {
              const [en, zh] = reasons[String(v)] as [string, string];
              return why(v, en, zh);
            }),
            solution(
              [
                [
                  ["The left derivative", "左导数"],
                  [
                    `Just left of ${c}, $f = ${p}$, so $F$ changes at the rate ${p}, and the left derivative is ${p}.`,
                    `在 ${c} 左侧 $f = ${p}$，所以 $F$ 的变化率是 ${p}，左导数是 ${p}。`,
                  ],
                ],
                [
                  ["The right derivative", "右导数"],
                  [`Just right of ${c}, $f = ${q}$, so the right derivative is ${q}.`, `在 ${c} 右侧 $f = ${q}$，所以右导数是 ${q}。`],
                ],
                [
                  ["Subtract", "相减"],
                  [`$${q} - ${p < 0 ? `(${p})` : p} = ${answer}$.`, `$${q} - ${p < 0 ? `(${p})` : p} = ${answer}$。`],
                ],
              ],
              [
                `For small $h > 0$, $F(${c} + h) - F(${c}) = ${slope(q, "h")}$ and $F(${c}) - F(${c} - h) = ${slope(p, "h")}$, so the difference quotients on the two sides are ${q} and ${p}.`,
                `对很小的 $h > 0$，$F(${c} + h) - F(${c}) = ${slope(q, "h")}$，$F(${c}) - F(${c} - h) = ${slope(p, "h")}$，所以两侧的差商分别是 ${q} 和 ${p}。`,
              ],
            ),
          );
        },
      ),
    ],
  ),
  intro: t(
    "Let $f = 3$ on $[0, 2)$ and $f = 1$ from 2 on, and $F(x) = \\int_0^x f$. Then $F(4) = 6 + 2 = 8$, and at $x = 4$, where $f$ is continuous, $F'(4) = 1$.\n\nCheck: from $x = 2$ on, $F$ starts at $F(2) = 6$ and rises 1 per unit, so $F(4) = 8$.\n\nIn this lesson we build an accumulation function from a step function, find its slope where the integrand is continuous, and see the corner it has at a jump.",
    "设 $[0, 2)$ 上 $f = 3$，从 2 起 $f = 1$，$F(x) = \\int_0^x f$。则 $F(4) = 6 + 2 = 8$；在 $f$ 连续的 $x = 4$ 处，$F'(4) = 1$。\n\n检验：从 $x = 2$ 起，$F$ 从 $F(2) = 6$ 出发，每单位上升 1，所以 $F(4) = 8$。\n\n本课我们由阶梯函数构造累积函数，求被积函数连续处的斜率，并观察跳跃处的尖角。",
  ),
};

const interchange = {
  ...topic(
    "exchanging-limits-and-integrals",
    ["Exchanging Limits and Integrals", "交换极限与积分"],
    ["Find when the limit of integrals is the integral of the limit.", "判断积分的极限何时等于极限的积分。"],
    ["pointwise-and-uniform-convergence"],
    [],
    [
      point(
        "a-bump-that-keeps-its-area",
        ["A bump that keeps its area", "面积不变的凸起"],
        [
          "Pointwise convergence is not enough to move a limit inside an integral. The function equal to $a n$ on $(0, \\frac{b}{n})$ and 0 elsewhere tends to 0 at every point, yet its integral stays $ab$. The bump grows taller as it narrows, so its area never leaves even though each point eventually sees zero.\n\nFor $f_n = n$ on $(0, \\frac{1}{n})$ and 0 elsewhere, every integral is $n \\cdot \\frac{1}{n} = 1$, so the limit of the integrals is 1, while the integral of the pointwise limit 0 is 0.\n\nCheck: at $x = 0.01$, $f_n(0.01) = 0$ as soon as $\\frac{1}{n} \\le 0.01$, that is from $n = 100$ on.\n\n> **Watch out.** Compute the two orders separately. Pointwise convergence alone never justifies swapping them.",
          "逐点收敛不足以把极限移到积分号内。在 $(0, \\frac{b}{n})$ 上等于 $a n$、其他地方为 0 的函数在每一点都趋于 0，但积分始终是 $ab$。凸起变窄的同时变高，所以面积没有消失，尽管每一点最终都为零。\n\n对在 $(0, \\frac{1}{n})$ 上 $f_n = n$、其他地方为 0 的函数，每个积分都是 $n \\cdot \\frac{1}{n} = 1$，所以积分的极限是 1，而逐点极限 0 的积分是 0。\n\n检验：在 $x = 0.01$ 处，只要 $\\frac{1}{n} \\le 0.01$，即从 $n = 100$ 起，就有 $f_n(0.01) = 0$。\n\n> **注意。** 两种顺序要分别计算。仅凭逐点收敛，永远不能交换它们。",
        ],
        (rng) => {
          const [a, b] = [rng.int(1, 9), rng.int(1, 9)];
          const answer = a * b;
          return solved(
            [
              `Let $f_n = ${times(a, "n")}$ on $(0, \\frac{${b}}{n})$ and 0 elsewhere on $[0, ${b}]$. What is $\\lim_{n \\to \\infty} \\int f_n$ minus $\\int \\lim_{n \\to \\infty} f_n$?`,
              `设 $[0, ${b}]$ 上，在 $(0, \\frac{${b}}{n})$ 上 $f_n = ${times(a, "n")}$，其他地方为 0。$\\lim_{n \\to \\infty} \\int f_n$ 减 $\\int \\lim_{n \\to \\infty} f_n$ 是多少？`,
            ],
            answer,
            [
              why(
                0,
                "That assumes the two orders agree; pointwise convergence does not allow moving the limit inside.",
                "这假定了两种顺序结果相同；逐点收敛不允许把极限移进积分号。",
              ),
              why(
                a,
                `That is the height factor ${a} alone; the area is the height times the width $\\frac{${b}}{n}$.`,
                `这只是高度的系数 ${a}；面积是高度乘宽度 $\\frac{${b}}{n}$。`,
              ),
              why(
                b,
                `That is the width factor ${b} alone; the area is the width times the height $${times(a, "n")}$.`,
                `这只是宽度的系数 ${b}；面积是宽度乘高度 $${times(a, "n")}$。`,
              ),
              why(a + b, "That adds the height and width factors; an area multiplies them.", "这把高度和宽度的系数相加了；面积要相乘。"),
            ],
            solution(
              [
                [
                  ["Integrate each function", "求每个函数的积分"],
                  [
                    `Each integral is the height times the width, $${times(a, "n")} \\cdot \\frac{${b}}{n} = ${answer}$, so the limit of the integrals is ${answer}.`,
                    `每个积分都是高乘宽，$${times(a, "n")} \\cdot \\frac{${b}}{n} = ${answer}$，所以积分的极限是 ${answer}。`,
                  ],
                ],
                [
                  ["Take the pointwise limit", "求逐点极限"],
                  [
                    `For each $x > 0$, $f_n(x) = 0$ once $\\frac{${b}}{n} \\le x$, and $f_n(0) = 0$ always, so the pointwise limit is 0 and its integral is 0. The difference is ${answer}.`,
                    `对每个 $x > 0$，一旦 $\\frac{${b}}{n} \\le x$ 就有 $f_n(x) = 0$，并且总有 $f_n(0) = 0$，所以逐点极限是 0，积分也是 0。差是 ${answer}。`,
                  ],
                ],
              ],
              [
                `At $n = 10$ the bump has height ${10 * a} and width $\\frac{${b}}{10}$, and its area is still ${answer}.`,
                `$n = 10$ 时凸起高 ${10 * a}，宽 $\\frac{${b}}{10}$，面积仍是 ${answer}。`,
              ],
            ),
          );
        },
      ),
      point(
        "a-limit-under-uniform-convergence",
        ["A limit under uniform convergence", "一致收敛下的极限"],
        [
          "If $f_n \\to f$ uniformly on $[a, b]$, then the integrals converge to the integral of $f$, because the error is at most $(b - a) \\sup |f_n - f|$. So when the sup distance tends to zero, as for a term like $\\frac{\\sin nx}{n}$, the limit can simply be taken first.\n\nFor $f_n(x) = x + \\frac{\\sin nx}{n}$ on $[0, 1]$, the extra term is at most $\\frac{1}{n}$ everywhere, so the integrals tend to $\\int_0^1 x \\, dx = \\frac{1}{2}$.\n\nCheck: the integral of the extra term is at most $\\frac{1}{n}$, so at $n = 100$ the integral of $f_{100}$ is within $0.01$ of $\\frac{1}{2}$.\n\n> **Watch out.** The bound on $|f_n - f|$ must not depend on $x$. A bound like $\\frac{1}{n}$ is uniform; one that grows near some point may not be.",
          "如果在 $[a, b]$ 上 $f_n \\to f$ 一致收敛，那么积分收敛到 $f$ 的积分，因为误差不超过 $(b - a) \\sup |f_n - f|$。所以当上确界距离趋于零时（如 $\\frac{\\sin nx}{n}$ 这样的项），可以先取极限。\n\n对 $[0, 1]$ 上的 $f_n(x) = x + \\frac{\\sin nx}{n}$，多出的项处处不超过 $\\frac{1}{n}$，所以积分趋于 $\\int_0^1 x \\, dx = \\frac{1}{2}$。\n\n检验：多出的项的积分不超过 $\\frac{1}{n}$，所以 $n = 100$ 时 $f_{100}$ 的积分与 $\\frac{1}{2}$ 相差不超过 $0.01$。\n\n> **注意。** $|f_n - f|$ 的界不能依赖于 $x$。像 $\\frac{1}{n}$ 这样的界是一致的；在某点附近变大的界就未必是。",
        ],
        (rng) => {
          const [a, b] = [rng.int(1, 9), rng.int(1, 6)];
          const c = rng.int(1, 5);
          const answer = Q.of(a * b * b, 2);
          const top = a === 1 ? `${b}^2` : `${a} \\times ${b}^2`;
          return solved(
            [
              `Let $f_n(x) = ${times(a, "x")} + \\frac{${c === 1 ? "" : c} \\sin nx}{n}$. What is $\\lim_{n \\to \\infty} \\int_0^{${b}} f_n(x) \\, dx$?`,
              `设 $f_n(x) = ${times(a, "x")} + \\frac{${c === 1 ? "" : c} \\sin nx}{n}$。$\\lim_{n \\to \\infty} \\int_0^{${b}} f_n(x) \\, dx$ 是多少？`,
            ],
            answer,
            [
              why(
                a * b * b,
                `That forgets the $\\frac{1}{2}$ from integrating $x$; $\\int_0^${b} x \\, dx = \\frac{${b}^2}{2}$.`,
                `这漏掉了对 $x$ 积分产生的 $\\frac{1}{2}$；$\\int_0^${b} x \\, dx = \\frac{${b}^2}{2}$。`,
              ),
              why(
                Q.of(a * b, 2),
                `That uses ${b} where $${b}^2$ belongs; the integral of $x$ up to ${b} is $\\frac{${b}^2}{2}$.`,
                `这在该用 $${b}^2$ 的地方用了 ${b}；$x$ 从 0 到 ${b} 的积分是 $\\frac{${b}^2}{2}$。`,
              ),
              why(
                answer.add(Q.of(c, 1)),
                `That counts the extra term as ${c}; it is at most $\\frac{${c}}{n}$, which tends to 0, so it adds nothing in the limit.`,
                `这把多出的项算作 ${c}；它不超过 $\\frac{${c}}{n}$，趋于 0，所以在极限中没有贡献。`,
              ),
              why(
                a * b,
                `That is the height of $${times(a, "x")}$ at $x = ${b}$, not the area under it.`,
                `这是 $${times(a, "x")}$ 在 $x = ${b}$ 处的高度，不是它下方的面积。`,
              ),
            ],
            solution(
              [
                [
                  ["Bound the extra term", "估计多出的项"],
                  [
                    `$\\left| \\frac{${c === 1 ? "" : c} \\sin nx}{n} \\right| \\le \\frac{${c}}{n}$ for every $x$, so $f_n \\to ${times(a, "x")}$ uniformly.`,
                    `对每个 $x$ 都有 $\\left| \\frac{${c === 1 ? "" : c} \\sin nx}{n} \\right| \\le \\frac{${c}}{n}$，所以 $f_n \\to ${times(a, "x")}$ 一致收敛。`,
                  ],
                ],
                [
                  ["Take the limit first", "先取极限"],
                  [
                    `Uniform convergence lets the limit pass inside: $\\int_0^${b} ${times(a, "x")} \\, dx = \\frac{${top}}{2} = ${answer.toLatex()}$.`,
                    `一致收敛允许极限移进积分号：$\\int_0^${b} ${times(a, "x")} \\, dx = \\frac{${top}}{2} = ${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `The extra term changes each integral by at most $\\frac{${b * c}}{n}$, which is $${(b * c) / 100}$ at $n = 100$ and tends to 0.`,
                `多出的项使每个积分的变化不超过 $\\frac{${b * c}}{n}$，$n = 100$ 时是 $${(b * c) / 100}$，并且趋于 0。`,
              ],
            ),
          );
        },
      ),
    ],
  ),
  intro: t(
    "Let $f_n = n$ on $(0, \\frac{1}{n})$ and 0 elsewhere on $[0, 1]$. Every $f_n$ has integral 1, yet $f_n(x) \\to 0$ at every point, so the integral of the limit is 0.\n\nCheck: $f_5$ has height 5 on a width of $\\frac{1}{5}$, so its area is $5 \\cdot \\frac{1}{5} = 1$, while $f_5(0.5) = 0$.\n\nIn this lesson we see how pointwise convergence can lose area, and use uniform convergence to take a limit inside an integral safely.",
    "设 $[0, 1]$ 上，在 $(0, \\frac{1}{n})$ 上 $f_n = n$，其他地方为 0。每个 $f_n$ 的积分都是 1，但每一点都有 $f_n(x) \\to 0$，所以极限的积分是 0。\n\n检验：$f_5$ 在宽 $\\frac{1}{5}$ 的区间上高为 5，面积是 $5 \\cdot \\frac{1}{5} = 1$，而 $f_5(0.5) = 0$。\n\n本课我们看到逐点收敛会丢失面积，并利用一致收敛安全地把极限移进积分号。",
  ),
};

const measureZero = {
  ...topic(
    "sets-of-measure-zero",
    ["Sets of Measure Zero", "零测集"],
    ["Cover a set with intervals of tiny total length, and meet the Cantor set.", "用总长度极小的区间覆盖集合，并认识康托尔集。"],
    ["riemann-integrability"],
    [],
    [
      point(
        "covering-a-countable-set",
        ["Covering a countable set", "覆盖可数集"],
        [
          "A set has measure zero if it can be covered by intervals of total length as small as you wish. A countable set always can: give the $k$th point an interval of length $\\frac{\\varepsilon}{2^k}$, and the lengths add up to at most $\\varepsilon$. By Lebesgue's criterion, a bounded function is integrable when its discontinuities have measure zero.\n\nWith $\\varepsilon = 1$, the first three intervals have lengths $\\frac{1}{2}$, $\\frac{1}{4}$ and $\\frac{1}{8}$, which add up to $\\frac{7}{8}$.\n\nCheck: $1 - \\frac{1}{2^3} = 1 - \\frac{1}{8} = \\frac{7}{8}$, and every later interval keeps the total below 1.\n\n> **Watch out.** The first interval has $k = 1$, so its length is $\\frac{\\varepsilon}{2}$, not $\\varepsilon$.",
          "如果一个集合能被总长度任意小的区间覆盖，它就是零测集。可数集总是如此：给第 $k$ 个点长度为 $\\frac{\\varepsilon}{2^k}$ 的区间，总长度不超过 $\\varepsilon$。按勒贝格判别法，有界函数的间断点集为零测集时可积。\n\n取 $\\varepsilon = 1$，前三个区间的长度是 $\\frac{1}{2}$、$\\frac{1}{4}$ 和 $\\frac{1}{8}$，加起来是 $\\frac{7}{8}$。\n\n检验：$1 - \\frac{1}{2^3} = 1 - \\frac{1}{8} = \\frac{7}{8}$，之后的每个区间都使总和保持在 1 以下。\n\n> **注意。** 第一个区间对应 $k = 1$，所以长度是 $\\frac{\\varepsilon}{2}$，而不是 $\\varepsilon$。",
        ],
        (rng) => {
          const denominator = rng.pick([2, 3, 4, 5, 8, 10, 20, 100]);
          const N = rng.int(2, 6);
          const answer = Q.of(1, denominator).mul(Q.of(2 ** N - 1, 2 ** N));
          const share = Q.of(2 ** N - 1, 2 ** N).toLatex();
          const terms = Array.from({ length: N }, (_, i) => `\\frac{1}{${denominator * 2 ** (i + 1)}}`).join(" + ");
          return solved(
            [
              `The $k$th point of a set gets an interval of length $\\frac{1}{${denominator} \\cdot 2^k}$. What total length do the first ${N} intervals have?`,
              `集合的第 $k$ 个点配一个长度为 $\\frac{1}{${denominator} \\cdot 2^k}$ 的区间。前 ${N} 个区间的总长度是多少？`,
            ],
            answer,
            [
              why(
                Q.of(1, denominator),
                `That is the total of all infinitely many intervals; the first ${N} fall short of it by $\\frac{1}{${denominator * 2 ** N}}$.`,
                `这是全部无穷多个区间的总长度；前 ${N} 个比它少 $\\frac{1}{${denominator * 2 ** N}}$。`,
              ),
              why(
                Q.of(N, denominator * 2 ** N),
                `That gives every interval the length of the ${N}th; the earlier ones are longer.`,
                `这让每个区间都和第 ${N} 个一样长；前面的区间更长。`,
              ),
              why(Q.of(1, denominator * 2 ** N), `That is the length of the ${N}th interval alone.`, `这只是第 ${N} 个区间的长度。`),
              why(
                Q.of(N, denominator),
                `That gives each interval the length $\\frac{1}{${denominator}}$; the $k$th has only $\\frac{1}{${denominator} \\cdot 2^k}$.`,
                `这让每个区间长 $\\frac{1}{${denominator}}$；第 $k$ 个只有 $\\frac{1}{${denominator} \\cdot 2^k}$。`,
              ),
            ],
            solution(
              [
                [
                  ["Factor out the common part", "提出公因子"],
                  [
                    `The total is $\\frac{1}{${denominator}} \\left( \\frac{1}{2} + \\cdots + \\frac{1}{2^{${N}}} \\right)$.`,
                    `总长度是 $\\frac{1}{${denominator}} \\left( \\frac{1}{2} + \\cdots + \\frac{1}{2^{${N}}} \\right)$。`,
                  ],
                ],
                [
                  ["Sum the geometric part", "求几何级数部分"],
                  [
                    `$\\frac{1}{2} + \\cdots + \\frac{1}{2^{${N}}} = 1 - \\frac{1}{2^{${N}}} = ${share}$, so the total is $\\frac{1}{${denominator}} \\cdot ${share} = ${answer.toLatex()}$.`,
                    `$\\frac{1}{2} + \\cdots + \\frac{1}{2^{${N}}} = 1 - \\frac{1}{2^{${N}}} = ${share}$，所以总长度是 $\\frac{1}{${denominator}} \\cdot ${share} = ${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [`Adding the lengths directly, $${terms} = ${answer.toLatex()}$.`, `直接把长度相加，$${terms} = ${answer.toLatex()}$。`],
            ),
          );
        },
      ),
      point(
        "building-the-cantor-set",
        ["Building the Cantor set", "构造康托尔集"],
        [
          "Start with $[0, 1]$ and repeatedly remove the open middle third of each piece. After $n$ steps, $2^n$ pieces of length $\\frac{1}{3^n}$ remain, with total length $(\\frac{2}{3})^n$. What survives forever is the Cantor set. It has measure zero and yet is uncountable, so measure zero does not mean small in number.\n\nAfter two steps from $[0, 1]$ the pieces are $[0, \\frac{1}{9}]$, $[\\frac{2}{9}, \\frac{1}{3}]$, $[\\frac{2}{3}, \\frac{7}{9}]$ and $[\\frac{8}{9}, 1]$: four pieces of length $\\frac{1}{9}$, with total length $\\frac{4}{9}$.\n\nCheck: the removed parts have length $\\frac{1}{3} + \\frac{2}{9} = \\frac{5}{9}$, and $\\frac{4}{9} + \\frac{5}{9} = 1$.\n\n> **Watch out.** Each step doubles the number of pieces but divides the length of each by 3, so the total length is multiplied by $\\frac{2}{3}$.",
          "从 $[0, 1]$ 开始，反复去掉每一段中间的开三分之一。$n$ 步后剩下 $2^n$ 段，每段长 $\\frac{1}{3^n}$，总长度 $(\\frac{2}{3})^n$。永远留下的就是康托尔集。它是零测集却不可数，所以零测不等于个数少。\n\n从 $[0, 1]$ 开始两步后，各段是 $[0, \\frac{1}{9}]$、$[\\frac{2}{9}, \\frac{1}{3}]$、$[\\frac{2}{3}, \\frac{7}{9}]$ 和 $[\\frac{8}{9}, 1]$：四段，每段长 $\\frac{1}{9}$，总长度 $\\frac{4}{9}$。\n\n检验：去掉的部分长 $\\frac{1}{3} + \\frac{2}{9} = \\frac{5}{9}$，并且 $\\frac{4}{9} + \\frac{5}{9} = 1$。\n\n> **注意。** 每一步段数加倍，而每段的长度除以 3，所以总长度乘以 $\\frac{2}{3}$。",
        ],
        (rng) => {
          const n = rng.int(1, 6);
          const k = rng.int(0, 3);
          const scale = rng.int(1, 9);
          const [en, zh, answer] = [
            ["the number of pieces left", "剩下的段数", 2 ** n],
            ["the length of each piece", "每段的长度", Q.of(scale, 3 ** n)],
            ["the total length left", "剩下的总长度", Q.of(scale * 2 ** n, 3 ** n)],
            ["the total length removed", "去掉的总长度", Q.of(scale * (3 ** n - 2 ** n), 3 ** n)],
          ][k] as [string, string, number | Q];
          const interval = k === 0 ? "[0, 1]" : `[0, ${scale}]`;
          const start = k === 0 ? 1 : scale;
          const piece = Q.of(start, 3 ** n);
          const left = Q.of(start * 2 ** n, 3 ** n);
          const removed = Q.of(start * (3 ** n - 2 ** n), 3 ** n);
          const steps = n === 1 ? "1 step" : `${n} steps`;
          const mistakes =
            k === 0
              ? [
                  why(
                    3 ** n,
                    `That counts all ${3 ** n} thirds of length $\\frac{1}{${3 ** n}}$; only 2 of every 3 are kept at each step.`,
                    `这数了全部 ${3 ** n} 个长 $\\frac{1}{${3 ** n}}$ 的小段；每一步每 3 段只留 2 段。`,
                  ),
                  why(
                    2 * n,
                    "That adds 2 pieces per step; each step doubles the number of pieces.",
                    "这每一步加 2 段；其实每一步段数加倍。",
                  ),
                  why(2 ** (n + 1), "That is the count one step later; it doubles once too often.", "这是再多一步后的段数；多加倍了一次。"),
                ]
              : [
                  why(
                    Q.of(scale * 2 ** n, 3 ** n),
                    "That is the total length left, all the pieces together.",
                    "这是剩下的总长度，即所有段加在一起。",
                  ),
                  why(Q.of(scale, 3 ** n), "That is the length of a single piece.", "这是单独一段的长度。"),
                  why(
                    Q.of(scale, 2 ** n),
                    "That halves the length at each step; each piece is a third of the piece before it.",
                    "这每一步把长度减半；其实每段是上一段的三分之一。",
                  ),
                  why(Q.of(scale, 3 ** (n + 1)), "That is the length of a piece one step later.", "这是再多一步后每段的长度。"),
                  why(
                    Q.of(scale * 2 ** (n + 1), 3 ** (n + 1)),
                    "That is the total length left one step later.",
                    "这是再多一步后剩下的总长度。",
                  ),
                ];
          const last: Pair =
            k === 0
              ? [`So ${2 ** n} pieces are left.`, `所以剩下 ${2 ** n} 段。`]
              : k === 1
                ? [`So each piece has length $${piece.toLatex()}$.`, `所以每段长 $${piece.toLatex()}$。`]
                : k === 2
                  ? [
                      `The total length left is $${2 ** n} \\times ${piece.toLatex()} = ${left.toLatex()}$.`,
                      `剩下的总长度是 $${2 ** n} \\times ${piece.toLatex()} = ${left.toLatex()}$。`,
                    ]
                  : [
                      `The length left is $${2 ** n} \\times ${piece.toLatex()} = ${left.toLatex()}$, so the length removed is $${scale} - ${left.toLatex()} = ${removed.toLatex()}$.`,
                      `剩下的长度是 $${2 ** n} \\times ${piece.toLatex()} = ${left.toLatex()}$，所以去掉的长度是 $${scale} - ${left.toLatex()} = ${removed.toLatex()}$。`,
                    ];
          const check: Pair =
            k === 0
              ? [
                  `Doubling at each step gives ${Array.from({ length: n + 1 }, (_, i) => 2 ** i).join(", ")}, ending at ${2 ** n}.`,
                  `每一步加倍：${Array.from({ length: n + 1 }, (_, i) => 2 ** i).join(", ")}，最后是 ${2 ** n}。`,
                ]
              : k === 1
                ? [
                    `$${3 ** n}$ pieces of this length would fill $[0, ${scale}]$ exactly, since $${3 ** n} \\times ${piece.toLatex()} = ${scale}$, and ${2 ** n} of them are kept.`,
                    `$${3 ** n}$ 段这样长的小段正好填满 $[0, ${scale}]$，因为 $${3 ** n} \\times ${piece.toLatex()} = ${scale}$，其中留下 ${2 ** n} 段。`,
                  ]
                : [
                    `The length left and the length removed add up to the whole: $${left.toLatex()} + ${removed.toLatex()} = ${scale}$.`,
                    `剩下的长度和去掉的长度加起来是全长：$${left.toLatex()} + ${removed.toLatex()} = ${scale}$。`,
                  ];
          return solved(
            [
              `Build the middle-thirds set starting from $${interval}$. After ${steps}, what is ${en}?`,
              `从 $${interval}$ 开始，构造去掉中间三分之一的集合。${n} 步后，${zh}是多少？`,
            ],
            answer,
            mistakes,
            solution(
              [
                [
                  ["Count the pieces and their length", "数段数和每段长度"],
                  [
                    `Each step doubles the pieces and divides their length by 3, so after ${steps} there are ${2 ** n} pieces, each of length $${piece.toLatex()}$.`,
                    `每一步段数加倍，每段长度除以 3，所以 ${n} 步后有 ${2 ** n} 段，每段长 $${piece.toLatex()}$。`,
                  ],
                ],
                [[`Find ${en}`, `求${zh}`], last],
              ],
              check,
            ),
          );
        },
      ),
    ],
  ),
  intro: t(
    "The points $1, \\frac{1}{2}, \\frac{1}{3}, \\ldots$ can be covered by intervals of lengths $\\frac{1}{100}, \\frac{1}{200}, \\frac{1}{400}, \\ldots$, whose total is $\\frac{1}{50}$. Halving every length again would halve the total, so it can be made as small as we like.\n\nCheck: $\\frac{1}{100} \\left( 1 + \\frac{1}{2} + \\frac{1}{4} + \\cdots \\right) = \\frac{1}{100} \\cdot 2 = \\frac{1}{50}$.\n\nIn this lesson we cover countable sets by intervals of tiny total length, and build the Cantor set, an uncountable set of measure zero.",
    "点 $1, \\frac{1}{2}, \\frac{1}{3}, \\ldots$ 可以被长度为 $\\frac{1}{100}, \\frac{1}{200}, \\frac{1}{400}, \\ldots$ 的区间覆盖，总长度是 $\\frac{1}{50}$。把每个长度再减半，总长度也减半，所以它可以任意小。\n\n检验：$\\frac{1}{100} \\left( 1 + \\frac{1}{2} + \\frac{1}{4} + \\cdots \\right) = \\frac{1}{100} \\cdot 2 = \\frac{1}{50}$。\n\n本课我们用总长度极小的区间覆盖可数集，并构造康托尔集，一个不可数的零测集。",
  ),
};

const complete = {
  ...topic(
    "complete-metric-spaces",
    ["Complete Metric Spaces", "完备度量空间"],
    ["Decide which spaces contain the limits of their Cauchy sequences.", "判断哪些空间包含其柯西序列的极限。"],
    ["cauchy-sequences", "distances-in-metric-spaces"],
    [],
    [
      point(
        "is-the-space-complete",
        ["Is the space complete", "这个空间完备吗"],
        [
          "A metric space is complete when every Cauchy sequence converges to a point of the space. A closed subset of the real line is complete, while a set with a missing limit point is not, since a sequence can approach the gap without any limit inside the space.\n\nIn $(0, 1]$ the sequence $\\frac{1}{n}$ is Cauchy, since its terms crowd together, but its limit 0 is not in the set. So $(0, 1]$ is not complete, while $[0, 1]$ is.\n\nCheck: for $m, n \\ge N$ the terms satisfy $|\\frac{1}{m} - \\frac{1}{n}| < \\frac{1}{N}$, which is as small as we like.\n\n> **Watch out.** Completeness depends on the space, not on the sequence. One Cauchy sequence without a limit in the space is enough to show it is not complete.",
          "如果度量空间中每个柯西序列都收敛到空间内的一点，它就是完备的。实数轴的闭子集是完备的；缺少某个极限点的集合则不完备，因为序列可以逼近那个缺口，而空间内没有极限。\n\n在 $(0, 1]$ 中，序列 $\\frac{1}{n}$ 是柯西序列，因为它的项越来越密集，但它的极限 0 不在集合中。所以 $(0, 1]$ 不完备，而 $[0, 1]$ 完备。\n\n检验：当 $m, n \\ge N$ 时，$|\\frac{1}{m} - \\frac{1}{n}| < \\frac{1}{N}$，可以任意小。\n\n> **注意。** 完备性取决于空间，而不取决于序列。只要有一个柯西序列在空间内没有极限，就说明空间不完备。",
        ],
        (rng) => {
          const [a, b] = [rng.int(-5, 3), rng.int(4, 9)];
          const [en, zh, yes, witness] = rng.pick<[string, string, boolean, Pair]>([
            [
              `the closed interval $[${a}, ${b}]$`,
              `闭区间 $[${a}, ${b}]$`,
              true,
              [
                `A Cauchy sequence in $[${a}, ${b}]$ converges in the real line, and since every term satisfies $${a} \\le x_n \\le ${b}$, so does the limit.`,
                `$[${a}, ${b}]$ 中的柯西序列在实数轴上收敛，因为每一项都满足 $${a} \\le x_n \\le ${b}$，极限也满足。`,
              ],
            ],
            [
              `the open interval $(${a}, ${b})$`,
              `开区间 $(${a}, ${b})$`,
              false,
              [
                `The terms $${a} + \\frac{1}{n}$ lie in $(${a}, ${b})$ and form a Cauchy sequence, but its limit ${a} is not in the interval.`,
                `项 $${a} + \\frac{1}{n}$ 在 $(${a}, ${b})$ 中，构成柯西序列，但它的极限 ${a} 不在区间中。`,
              ],
            ],
            [
              `the half-open interval $[${a}, ${b})$`,
              `半开区间 $[${a}, ${b})$`,
              false,
              [
                `The terms $${b} - \\frac{1}{n}$ lie in $[${a}, ${b})$ and form a Cauchy sequence, but its limit ${b} is not in the interval.`,
                `项 $${b} - \\frac{1}{n}$ 在 $[${a}, ${b})$ 中，构成柯西序列，但它的极限 ${b} 不在区间中。`,
              ],
            ],
            [
              `the ray $[${a}, \\infty)$`,
              `射线 $[${a}, \\infty)$`,
              true,
              [
                `A Cauchy sequence in the ray converges in the real line, and since every term is at least ${a}, so is the limit.`,
                `射线中的柯西序列在实数轴上收敛，因为每一项都至少是 ${a}，极限也是。`,
              ],
            ],
            [
              `the integers greater than ${a}`,
              `大于 ${a} 的整数`,
              true,
              [
                "Terms of a Cauchy sequence of integers are eventually less than 1 apart, so they are eventually all equal, and the sequence converges to that integer.",
                "整数柯西序列的项最终彼此相差小于 1，所以最终全都相等，序列收敛到这个整数。",
              ],
            ],
            [
              `the rationals in $[${a}, ${b}]$`,
              `$[${a}, ${b}]$ 中的有理数`,
              false,
              [
                `The decimal truncations of $${a} + \\frac{\\sqrt{2}}{2}$ are rationals in $[${a}, ${b}]$ forming a Cauchy sequence, but their limit is irrational.`,
                `$${a} + \\frac{\\sqrt{2}}{2}$ 的小数截断是 $[${a}, ${b}]$ 中的有理数，构成柯西序列，但它们的极限是无理数。`,
              ],
            ],
            [
              `the numbers $${b} + \\frac{1}{n}$ for positive integers $n$`,
              `$${b} + \\frac{1}{n}$（$n$ 为正整数）构成的集合`,
              false,
              [
                `The points $${b} + \\frac{1}{n}$ themselves form a Cauchy sequence, but its limit ${b} is not one of them.`,
                `点 $${b} + \\frac{1}{n}$ 本身构成柯西序列，但它的极限 ${b} 不在其中。`,
              ],
            ],
          ]);
          const complete: Pair = ["Complete", "完备"];
          const notComplete: Pair = ["Not complete", "不完备"];
          return reasoned(
            choose(
              rng,
              [`Consider ${en} with the usual distance. Is this metric space complete?`, `考虑带通常距离的${zh}。这个度量空间完备吗？`],
              yes ? complete : notComplete,
              [complete, notComplete, ["It depends on the sequence", "取决于序列"]],
              asPair(
                solution(
                  [
                    [yes ? ["Follow a Cauchy sequence", "跟踪柯西序列"] : ["Look for a missing limit", "寻找缺失的极限"], witness],
                    [
                      ["Decide", "判断"],
                      yes
                        ? [
                            "Every Cauchy sequence in the set converges to a point of the set, so the space is complete.",
                            "集合中每个柯西序列都收敛到集合中的点，所以空间完备。",
                          ]
                        : [
                            "One Cauchy sequence has no limit in the set, so the space is not complete.",
                            "有一个柯西序列在集合中没有极限，所以空间不完备。",
                          ],
                    ],
                  ],
                  yes
                    ? [
                        "The set is closed in the real line, which is complete, and a closed subset of a complete space is complete.",
                        "这个集合是实数轴的闭集，实数轴完备，而完备空间的闭子集是完备的。",
                      ]
                    : [
                        "The missing limit is a limit point of the set that the set leaves out, so the set is not closed in the real line.",
                        "缺失的极限是集合的极限点却不属于集合，所以集合不是实数轴的闭集。",
                      ],
                ),
              ),
            ),
            [
              ["Complete", witness[0], witness[1]],
              ["Not complete", witness[0], witness[1]],
              [
                "It depends on the sequence",
                "Completeness is a property of the space: it asks whether every Cauchy sequence converges in it, so it cannot depend on one sequence.",
                "完备性是空间的性质：它问的是每个柯西序列是否都在其中收敛，所以不能取决于某一个序列。",
              ],
            ],
          );
        },
      ),
      point(
        "a-cauchy-sequence-of-rationals",
        ["A Cauchy sequence of rationals", "有理数的柯西序列"],
        [
          "The rule $x_{n+1} = \\frac{1}{2} (x_n + \\frac{c}{x_n})$ turns rationals into rationals, and its terms form a Cauchy sequence that approaches $\\sqrt{c}$. When $c$ is not a perfect square, this limit is irrational, so the sequence has no limit in $\\mathbb{Q}$. That is exactly how $\\mathbb{Q}$ fails to be complete.\n\nFor $c = 2$ and $x_0 = 1$, the rule gives $x_1 = \\frac{1}{2} (1 + 2) = \\frac{3}{2}$ and then $x_2 = \\frac{1}{2} (\\frac{3}{2} + \\frac{4}{3}) = \\frac{17}{12} \\approx 1.4167$.\n\nCheck: $(\\frac{17}{12})^2 = \\frac{289}{144} \\approx 2.0069$, already close to 2, and $\\sqrt{2} \\approx 1.4142$.\n\n> **Watch out.** Divide $c$ by $x_n$ before adding, and halve the sum at the end. Every term is rational even though the limit is not.",
          "规则 $x_{n+1} = \\frac{1}{2} (x_n + \\frac{c}{x_n})$ 把有理数变成有理数，各项构成趋于 $\\sqrt{c}$ 的柯西序列。当 $c$ 不是完全平方数时，这个极限是无理数，所以序列在 $\\mathbb{Q}$ 中没有极限。这正是 $\\mathbb{Q}$ 不完备的表现。\n\n对 $c = 2$，$x_0 = 1$，规则给出 $x_1 = \\frac{1}{2} (1 + 2) = \\frac{3}{2}$，然后 $x_2 = \\frac{1}{2} (\\frac{3}{2} + \\frac{4}{3}) = \\frac{17}{12} \\approx 1.4167$。\n\n检验：$(\\frac{17}{12})^2 = \\frac{289}{144} \\approx 2.0069$，已经接近 2，而 $\\sqrt{2} \\approx 1.4142$。\n\n> **注意。** 先用 $c$ 除以 $x_n$ 再相加，最后把和减半。每一项都是有理数，尽管极限不是。",
        ],
        (rng) => {
          const c = rng.pick([2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15]);
          const x = rng.int(1, 4);
          const answer = Q.of(x * x + c, 2 * x);
          const ratio = Q.of(c, x);
          const sum = ratio.add(Q.of(x, 1));
          return solved(
            [
              `With $x_{n+1} = \\frac{1}{2} \\left( x_n + \\frac{${c}}{x_n} \\right)$ and $x_0 = ${x}$, what is the rational number $x_1$?`,
              `$x_{n+1} = \\frac{1}{2} \\left( x_n + \\frac{${c}}{x_n} \\right)$，$x_0 = ${x}$，有理数 $x_1$ 是多少？`,
            ],
            answer,
            [
              why(
                Q.of(x + c, 2),
                `That adds ${c} instead of $\\frac{${c}}{${x}}$; divide ${c} by $x_0$ first.`,
                `这加的是 ${c}，而不是 $\\frac{${c}}{${x}}$；要先用 ${c} 除以 $x_0$。`,
              ),
              why(Q.of(x * x + c, x), "That forgets to halve; the rule takes half of the sum.", "这忘了减半；规则取的是和的一半。"),
              why(
                Q.of(c, x),
                `That is only $\\frac{${c}}{x_0}$; add $x_0$ and halve the sum.`,
                `这只是 $\\frac{${c}}{x_0}$；还要加上 $x_0$ 再减半。`,
              ),
              why(
                Q.of(x * x + c, 2),
                `That halves $x_0^2 + ${c}$; the rule halves $x_0 + \\frac{${c}}{x_0}$.`,
                `这把 $x_0^2 + ${c}$ 减半了；规则是把 $x_0 + \\frac{${c}}{x_0}$ 减半。`,
              ),
            ],
            solution(
              [
                [
                  ["Divide and add", "相除再相加"],
                  [
                    `$\\frac{${c}}{${x}} = ${ratio.toLatex()}$, so $x_0 + \\frac{${c}}{x_0} = ${x} + ${ratio.toLatex()} = ${sum.toLatex()}$.`,
                    `$\\frac{${c}}{${x}} = ${ratio.toLatex()}$，所以 $x_0 + \\frac{${c}}{x_0} = ${x} + ${ratio.toLatex()} = ${sum.toLatex()}$。`,
                  ],
                ],
                [
                  ["Halve", "减半"],
                  [
                    `$x_1 = \\frac{1}{2} \\cdot ${sum.toLatex()} = ${answer.toLatex()}$.`,
                    `$x_1 = \\frac{1}{2} \\cdot ${sum.toLatex()} = ${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `$x_1^2 \\approx ${(answer.toNumber() ** 2).toFixed(3)}$, nearer to ${c} than $x_0^2 = ${x * x}$, as the terms close in on $\\sqrt{${c}} \\approx ${Math.sqrt(c).toFixed(3)}$.`,
                `$x_1^2 \\approx ${(answer.toNumber() ** 2).toFixed(3)}$，比 $x_0^2 = ${x * x}$ 更接近 ${c}，各项正逐渐逼近 $\\sqrt{${c}} \\approx ${Math.sqrt(c).toFixed(3)}$。`,
              ],
            ),
          );
        },
      ),
    ],
  ),
  intro: t(
    "The decimals $1, 1.4, 1.41, 1.414, \\ldots$ of $\\sqrt{2}$ are all rational, and after the $n$th term they stay within $10^{-n}$ of each other, so they form a Cauchy sequence. Its limit $\\sqrt{2}$ is irrational, so in $\\mathbb{Q}$ the sequence has no limit.\n\nCheck: $1.414^2 = 1.999396$ and $1.415^2 = 2.002225$, so $\\sqrt{2}$ lies between them.\n\nIn this lesson we decide which spaces are complete, and follow a Cauchy sequence of rationals whose limit lies outside $\\mathbb{Q}$.",
    "$\\sqrt{2}$ 的小数 $1, 1.4, 1.41, 1.414, \\ldots$ 都是有理数，从第 $n$ 项起彼此相差不超过 $10^{-n}$，所以构成柯西序列。它的极限 $\\sqrt{2}$ 是无理数，所以这个序列在 $\\mathbb{Q}$ 中没有极限。\n\n检验：$1.414^2 = 1.999396$，$1.415^2 = 2.002225$，所以 $\\sqrt{2}$ 在两者之间。\n\n本课我们判断哪些空间完备，并跟踪一个极限在 $\\mathbb{Q}$ 之外的有理数柯西序列。",
  ),
};

const openCovers = {
  ...topic(
    "open-covers",
    ["Open Covers", "开覆盖"],
    ["Extract finite covers from infinite ones, and see where this fails.", "从无限覆盖中取出有限覆盖，并看看它在哪里失败。"],
    ["compactness-on-the-real-line"],
    [],
    [
      point(
        "the-fewest-intervals-that-cover",
        ["The fewest intervals that cover", "覆盖所需的最少区间数"],
        [
          "The Heine-Borel theorem says that every open cover of a closed bounded interval has a finite subcover. To count how many intervals of a fixed length are needed, note that open intervals must overlap slightly, or the point between them is missed. So covering $[0, L]$ needs more than $L$ divided by the length.\n\nTo cover $[0, 3]$ with open intervals of length 1, the number must exceed $3 \\div 1 = 3$, so 4 are needed, for example $(-0.1, 0.9)$, $(0.8, 1.8)$, $(1.7, 2.7)$ and $(2.6, 3.6)$.\n\nCheck: each of these overlaps the next, the first contains 0 and the last contains 3, while three open intervals of total length 3 cannot cover a closed interval of length 3.\n\n> **Watch out.** When $L$ divided by the length is a whole number, that many intervals are still too few; one more is needed.",
          "海涅–博雷尔定理说：闭有界区间的每个开覆盖都有有限子覆盖。要数需要多少个定长的区间，注意开区间之间必须稍有重叠，否则会漏掉它们之间的点。所以覆盖 $[0, L]$ 需要的个数要大于 $L$ 除以长度。\n\n用长度为 1 的开区间覆盖 $[0, 3]$，个数必须大于 $3 \\div 1 = 3$，所以需要 4 个，例如 $(-0.1, 0.9)$、$(0.8, 1.8)$、$(1.7, 2.7)$ 和 $(2.6, 3.6)$。\n\n检验：每个区间都与下一个重叠，第一个包含 0，最后一个包含 3；而总长度为 3 的三个开区间覆盖不了长度为 3 的闭区间。\n\n> **注意。** 当 $L$ 除以长度是整数时，这么多个区间仍然不够，还要再加一个。",
        ],
        (rng) => {
          const L = rng.int(2, 30);
          const size = rng.pick([Q.of(1, 2), Q.of(1, 1), Q.of(2, 1), Q.of(3, 1), Q.of(5, 2), Q.of(4, 1)]);
          const answer = Math.floor(L / size.toNumber()) + 1;
          const quotient = Q.of(L, 1).div(size).toLatex();
          const total = (k: number) => size.mul(Q.of(k, 1)).toLatex();
          const say = (v: number) =>
            v < answer
              ? why(
                  v,
                  `That is too few; ${v} open ${v === 1 ? "interval has" : "intervals have"} total length $${total(v)}$, which is not more than ${L}.`,
                  `这太少了；${v} 个开区间的总长度是 $${total(v)}$，不大于 ${L}。`,
                )
              : why(
                  v,
                  `That works, but it is not the fewest; ${answer} intervals already have total length $${total(answer)} > ${L}$.`,
                  `这也可以，但不是最少的；${answer} 个区间的总长度已经是 $${total(answer)} > ${L}$。`,
                );
          return solved(
            [
              `What is the smallest number of open intervals of length $${size.toLatex()}$ that can cover $[0, ${L}]$?`,
              `长度为 $${size.toLatex()}$ 的开区间，覆盖 $[0, ${L}]$ 最少需要多少个？`,
            ],
            answer,
            [answer - 1 > 0 ? answer - 1 : answer + 2, answer + 1, L, L + 1].filter((v) => v !== answer).map(say),
            solution(
              [
                [
                  ["Compare the total length", "比较总长度"],
                  [
                    `Open intervals covering the closed interval $[0, ${L}]$ must overlap and stick out past both ends, so their total length must be more than ${L}.`,
                    `覆盖闭区间 $[0, ${L}]$ 的开区间必须相互重叠，并伸出两端，所以总长度必须大于 ${L}。`,
                  ],
                ],
                [
                  ["Solve for the count", "解出个数"],
                  [
                    `So the number must exceed $${L} \\div ${size.toLatex()} = ${quotient}$, and the first whole number that does is ${answer}.`,
                    `所以个数必须大于 $${L} \\div ${size.toLatex()} = ${quotient}$，第一个满足的整数是 ${answer}。`,
                  ],
                ],
              ],
              [
                `${answer} intervals have total length $${total(answer)}$, more than ${L}, so they can overlap a little, while ${answer - 1} would have only $${total(answer - 1)}$.`,
                `${answer} 个区间的总长度是 $${total(answer)}$，大于 ${L}，可以稍有重叠；而 ${answer - 1} 个只有 $${total(answer - 1)}$。`,
              ],
            ),
          );
        },
      ),
      point(
        "a-cover-with-no-finite-subcover",
        ["A cover with no finite subcover", "没有有限子覆盖的覆盖"],
        [
          "The intervals $(\\frac{1}{n}, 2)$ for $n \\ge 2$ cover $(0, 1]$, yet no finite collection of them does, because the one with the largest $n$ misses points close to 0. So $(0, 1]$ is not compact. For any closed piece $[\\frac{1}{m}, 1]$, however, a single interval from the family is enough.\n\nTo cover $[\\frac{1}{5}, 1]$, the interval $(\\frac{1}{n}, 2)$ must contain $\\frac{1}{5}$, so $\\frac{1}{n} < \\frac{1}{5}$, which needs $n > 5$. The smallest choice is $n = 6$.\n\nCheck: $\\frac{1}{6} \\approx 0.167$ is less than $\\frac{1}{5} = 0.2$, so $(\\frac{1}{6}, 2)$ contains all of $[\\frac{1}{5}, 1]$.\n\n> **Watch out.** The intervals are open. $(\\frac{1}{5}, 2)$ leaves out its own end $\\frac{1}{5}$, so $n = 5$ does not work.",
          "区间 $(\\frac{1}{n}, 2)$（$n \\ge 2$）覆盖 $(0, 1]$，但其中任何有限个都不行，因为 $n$ 最大的那个漏掉了靠近 0 的点。所以 $(0, 1]$ 不是紧集。不过对任何闭的部分 $[\\frac{1}{m}, 1]$，这族中一个区间就够了。\n\n要覆盖 $[\\frac{1}{5}, 1]$，区间 $(\\frac{1}{n}, 2)$ 必须包含 $\\frac{1}{5}$，所以 $\\frac{1}{n} < \\frac{1}{5}$，即 $n > 5$。最小的选择是 $n = 6$。\n\n检验：$\\frac{1}{6} \\approx 0.167$ 小于 $\\frac{1}{5} = 0.2$，所以 $(\\frac{1}{6}, 2)$ 包含整个 $[\\frac{1}{5}, 1]$。\n\n> **注意。** 这些区间是开的。$(\\frac{1}{5}, 2)$ 不包含它自己的端点 $\\frac{1}{5}$，所以 $n = 5$ 不行。",
        ],
        (rng) => {
          const m = rng.int(2, 40);
          const answer = m + 1;
          return solved(
            [
              `Among the intervals $(\\frac{1}{n}, 2)$, what is the smallest $n$ whose interval contains all of $[\\frac{1}{${m}}, 1]$?`,
              `在区间 $(\\frac{1}{n}, 2)$ 中，包含整个 $[\\frac{1}{${m}}, 1]$ 的最小 $n$ 是多少？`,
            ],
            answer,
            [
              why(
                m,
                `$(\\frac{1}{${m}}, 2)$ is open and leaves out its end $\\frac{1}{${m}}$, which belongs to $[\\frac{1}{${m}}, 1]$.`,
                `$(\\frac{1}{${m}}, 2)$ 是开区间，不包含端点 $\\frac{1}{${m}}$，而它属于 $[\\frac{1}{${m}}, 1]$。`,
              ),
              why(
                m + 2,
                `That works, but it is not the smallest; $n = ${answer}$ already does.`,
                `这也可以，但不是最小的；$n = ${answer}$ 已经满足。`,
              ),
              why(
                m - 1,
                `$\\frac{1}{${m - 1}}$ is greater than $\\frac{1}{${m}}$, so that interval misses $\\frac{1}{${m}}$ and the points just above it.`,
                `$\\frac{1}{${m - 1}}$ 大于 $\\frac{1}{${m}}$，所以那个区间漏掉了 $\\frac{1}{${m}}$ 和略大于它的点。`,
              ),
              why(
                2 * m,
                `That works, but it is far from the smallest; $n = ${answer}$ already does.`,
                `这也可以，但远不是最小的；$n = ${answer}$ 已经满足。`,
              ),
            ],
            solution(
              [
                [
                  ["Write the condition", "写出条件"],
                  [
                    `Every interval reaches past 1, so $(\\frac{1}{n}, 2)$ contains $[\\frac{1}{${m}}, 1]$ exactly when it contains $\\frac{1}{${m}}$, that is when $\\frac{1}{n} < \\frac{1}{${m}}$.`,
                    `每个区间都越过 1，所以 $(\\frac{1}{n}, 2)$ 包含 $[\\frac{1}{${m}}, 1]$，当且仅当它包含 $\\frac{1}{${m}}$，即 $\\frac{1}{n} < \\frac{1}{${m}}$。`,
                  ],
                ],
                [
                  ["Solve for the index", "解出下标"],
                  [
                    `$\\frac{1}{n} < \\frac{1}{${m}}$ means $n > ${m}$, and the smallest such whole number is $${answer}$.`,
                    `$\\frac{1}{n} < \\frac{1}{${m}}$ 就是 $n > ${m}$，满足的最小整数是 $${answer}$。`,
                  ],
                ],
              ],
              [
                `$\\frac{1}{${answer}} \\approx ${(1 / answer).toFixed(4)}$ is below $\\frac{1}{${m}} \\approx ${(1 / m).toFixed(4)}$, while $n = ${m}$ gives an interval that starts exactly at $\\frac{1}{${m}}$ and leaves it out.`,
                `$\\frac{1}{${answer}} \\approx ${(1 / answer).toFixed(4)}$ 小于 $\\frac{1}{${m}} \\approx ${(1 / m).toFixed(4)}$，而 $n = ${m}$ 给出的区间正好从 $\\frac{1}{${m}}$ 开始，不包含它。`,
              ],
            ),
          );
        },
      ),
    ],
  ),
  intro: t(
    "The open intervals $(-1, 1)$, $(0, 2)$ and $(1, 3)$ cover $[0, 2.5]$: every point lies in at least one, and the overlaps leave no gaps. A finite cover like this is what compactness promises from any open cover of a closed bounded interval.\n\nCheck: 0 lies in $(-1, 1)$, 1 lies in $(0, 2)$, and 2.5 lies in $(1, 3)$.\n\nIn this lesson we count the fewest intervals of a given length that cover an interval, and meet an open cover of $(0, 1]$ that has no finite subcover.",
    "开区间 $(-1, 1)$、$(0, 2)$ 和 $(1, 3)$ 覆盖 $[0, 2.5]$：每一点至少在其中一个里，重叠处不留空隙。紧性保证的正是：闭有界区间的任何开覆盖都能取出这样的有限覆盖。\n\n检验：0 在 $(-1, 1)$ 中，1 在 $(0, 2)$ 中，2.5 在 $(1, 3)$ 中。\n\n本课我们数覆盖一个区间所需的定长区间的最少个数，并认识 $(0, 1]$ 的一个没有有限子覆盖的开覆盖。",
  ),
};

/** realAnalysisMoreTopics holds the later topics of the Real Analysis course. */
export const realAnalysisMoreTopics: readonly TopicDef[] = [
  archimedean,
  algebraOfLimits,
  rearrangements,
  cauchyProducts,
  discontinuities,
  bisection,
  rolle,
  darboux,
  lagrange,
  integralBounds,
  ftc,
  interchange,
  measureZero,
  complete,
  openCovers,
];
