// More of Real Analysis: the Archimedean property, the algebra of limits, rearrangements and Cauchy products,
// discontinuities, bisection, Rolle and Darboux, Taylor's remainder, the integral in theory, limit interchange,
// sets of measure zero, complete metric spaces and open covers.

import type { TopicDef } from "@ga/content";
import { Q } from "@ga/subject-math";

import { ask, choose, type Pair, point, same, topic } from "../university-kit.ts";

/** times writes a coefficient before a symbol, leaving out a coefficient of one. */
const times = (c: number, symbol: string): string => (c === 1 ? symbol : `${c} ${symbol}`);

/** factorial returns n! for a small n. */
const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1));

const archimedean = topic(
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
        "The Archimedean property says that for positive $x$ and any $y$, some whole number $n$ has $n x > y$. It follows from completeness: if the multiples of $x$ were bounded, they would have a least upper bound, and subtracting $x$ from it would give a smaller bound, which is impossible.",
        "阿基米德性质说：对正数 $x$ 和任何 $y$，存在正整数 $n$ 使 $n x > y$。它由完备性推出：如果 $x$ 的倍数有界，就有最小上界，从中减去 $x$ 又得到一个更小的上界，这不可能。",
      ],
      (rng) => {
        const denominator = rng.int(2, 9);
        const numerator = rng.int(1, denominator * 2);
        const x = Q.of(numerator, denominator);
        const y = rng.int(3, 40);
        let n = 1;
        while (x.mul(Q.of(n, 1)).toNumber() <= y) n++;
        return ask(
          [
            `What is the smallest whole number $n$ with $n \\cdot ${x.toLatex()} > ${y}$?`,
            `使 $n \\cdot ${x.toLatex()} > ${y}$ 的最小正整数 $n$ 是多少？`,
          ],
          n,
          [n - 1, n + 1, y, n + 2],
          [
            `$n$ must exceed $${y} \\div ${x.toLatex()} = ${Q.of(y, 1).div(x).toLatex()}$, and the first whole number that does is ${n}.`,
            `$n$ 必须大于 $${y} \\div ${x.toLatex()} = ${Q.of(y, 1).div(x).toLatex()}$，第一个满足的正整数是 ${n}。`,
          ],
        );
      },
    ),
    point(
      "building-a-rational-in-a-gap",
      ["Building a rational in a gap", "在间隙中构造有理数"],
      [
        "To find a rational between $a$ and $b$, take $n$ with $\\frac{1}{n} < b - a$, so that steps of size $\\frac{1}{n}$ cannot jump over the gap. Then take the smallest whole number $k$ with $\\frac{k}{n} > a$. This fraction lies between $a$ and $b$, which shows the rationals are dense.",
        "要在 $a$ 和 $b$ 之间找有理数，取 $n$ 使 $\\frac{1}{n} < b - a$，这样步长 $\\frac{1}{n}$ 跨不过这个间隙。再取满足 $\\frac{k}{n} > a$ 的最小整数 $k$。这个分数就在 $a$ 和 $b$ 之间，这说明有理数是稠密的。",
      ],
      (rng) => {
        const q = rng.int(2, 9);
        const p = rng.int(1, 3 * q);
        const a = Q.of(p, q);
        const n = rng.int(4, 15);
        let k = 0;
        while (Q.of(k, n).toNumber() <= a.toNumber()) k++;
        return ask(
          [
            `Take steps of size $\\frac{1}{${n}}$. What is the smallest whole number $k$ with $\\frac{k}{${n}} > ${a.toLatex()}$?`,
            `取步长 $\\frac{1}{${n}}$。使 $\\frac{k}{${n}} > ${a.toLatex()}$ 的最小整数 $k$ 是多少？`,
          ],
          k,
          [k - 1, k + 1, n, k + n],
          [
            `$k$ must exceed $${n} \\cdot ${a.toLatex()} = ${a.mul(Q.of(n, 1)).toLatex()}$, and the first whole number that does is ${k}.`,
            `$k$ 必须大于 $${n} \\cdot ${a.toLatex()} = ${a.mul(Q.of(n, 1)).toLatex()}$，第一个满足的整数是 ${k}。`,
          ],
        );
      },
    ),
  ],
);

const algebraOfLimits = topic(
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
        "If $a_n \\to A$ and $b_n \\to B$, then sums, products and scalar multiples converge to the matching combination of $A$ and $B$, and $a_n / b_n \\to A / B$ when $B \\ne 0$. Each law is proved with the epsilon definition, using that a convergent sequence is bounded.",
        "如果 $a_n \\to A$，$b_n \\to B$，那么和、积、数乘都收敛到 $A$、$B$ 相应的组合；当 $B \\ne 0$ 时 $a_n / b_n \\to A / B$。每条法则都用 epsilon 定义证明，其中用到收敛数列有界。",
      ],
      (rng) => {
        const A = rng.int(-6, 6);
        const B = rng.int(1, 6);
        const p = rng.int(1, 9);
        const answer = Q.of(A * B + p, B);
        return ask(
          [
            `Given $a_n \\to ${A}$ and $b_n \\to ${B}$, what is $\\lim_{n \\to \\infty} \\frac{a_n b_n + ${p}}{b_n}$?`,
            `已知 $a_n \\to ${A}$，$b_n \\to ${B}$，$\\lim_{n \\to \\infty} \\frac{a_n b_n + ${p}}{b_n}$ 是多少？`,
          ],
          answer,
          [Q.of(A * B + p, 1), Q.of(A + p, B), A, Q.of(A + p, 1)],
          [
            `The denominator's limit is not 0, so the laws apply: $\\frac{${A < 0 ? `(${A})` : A} \\cdot ${B} + ${p}}{${B}} = ${answer.toLatex()}$.`,
            `分母的极限不为 0，所以可以用法则：$\\frac{${A < 0 ? `(${A})` : A} \\cdot ${B} + ${p}}{${B}} = ${answer.toLatex()}$。`,
          ],
        );
      },
    ),
    point(
      "trapping-a-sequence",
      ["Trapping a sequence", "夹逼数列"],
      [
        "If $l_n \\le x_n \\le u_n$ and both $l_n$ and $u_n$ tend to the same limit, then $x_n$ tends to it too. This squeeze theorem handles oscillating terms. Since $\\sin n$ stays between $-1$ and 1, a term like $\\frac{\\sin n}{n}$ is trapped between $-\\frac{1}{n}$ and $\\frac{1}{n}$ and tends to zero.",
        "如果 $l_n \\le x_n \\le u_n$，且 $l_n$、$u_n$ 趋于同一极限，那么 $x_n$ 也趋于它。这个夹逼定理能处理振荡项。因为 $\\sin n$ 在 $-1$ 和 1 之间，所以 $\\frac{\\sin n}{n}$ 被夹在 $-\\frac{1}{n}$ 和 $\\frac{1}{n}$ 之间，趋于零。",
      ],
      (rng) => {
        const [a, b] = [rng.int(1, 9), rng.int(2, 9)];
        const [c, d] = [rng.int(1, 5), rng.int(1, 5)];
        const answer = Q.of(a, b);
        return ask(
          [
            `What is $\\lim_{n \\to \\infty} \\frac{${times(a, "n")} + ${times(c, "\\sin n")}}{${b} n + ${times(d, "\\cos n")}}$?`,
            `$\\lim_{n \\to \\infty} \\frac{${times(a, "n")} + ${times(c, "\\sin n")}}{${b} n + ${times(d, "\\cos n")}}$ 是多少？`,
          ],
          answer,
          [Q.of(a + c, b + d), Q.of(c, d), 0, Q.of(a + c, b)],
          [
            `Divide above and below by $n$. The terms $\\frac{${times(c, "\\sin n")}}{n}$ and $\\frac{${times(d, "\\cos n")}}{n}$ are squeezed to 0, which leaves $${answer.toLatex()}$.`,
            `分子分母同除以 $n$。$\\frac{${times(c, "\\sin n")}}{n}$ 和 $\\frac{${times(d, "\\cos n")}}{n}$ 被夹逼到 0，剩下 $${answer.toLatex()}$。`,
          ],
        );
      },
    ),
  ],
);

const rearrangements = topic(
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
        "Every rearrangement of an absolutely convergent series has the same sum. A conditionally convergent series is very different: Riemann's theorem says its terms can be reordered to reach any real number, or to diverge, because its positive terms and its negative terms each sum to infinity on their own.",
        "绝对收敛级数的每个重排都有相同的和。条件收敛级数就大不相同：黎曼定理说，它的项可以重排为趋于任何实数，也可以发散，因为它的正项和负项各自的和都是无穷。",
      ],
      (rng) => {
        const exponent = rng.pick([Q.of(1, 2), Q.of(1, 3), Q.of(2, 3), Q.of(1, 1), Q.of(3, 2), Q.of(2, 1), Q.of(3, 1), Q.of(4, 1)]);
        const c = rng.int(1, 9);
        const absolute = exponent.toNumber() > 1;
        const power = exponent.eq(Q.of(1, 1)) ? "n" : `n^{${exponent.toLatex()}}`;
        const body = `\\sum_{n \\ge 1} \\frac{(-1)^n ${c === 1 ? "" : c}}{${power}}`;
        const keep: Pair = ["Every rearrangement has the same sum", "每个重排的和都相同"];
        const change: Pair = ["Rearranging can give any real number", "重排可以得到任何实数"];
        return choose(
          rng,
          [`What is true of the rearrangements of $${body}$?`, `关于 $${body}$ 的重排，哪个说法正确？`],
          absolute ? keep : change,
          [
            keep,
            change,
            ["No rearrangement converges", "没有一个重排收敛"],
            ["Rearranging can change the sum only by a finite amount", "重排只能使和改变有限的量"],
          ],
          [
            absolute
              ? `The exponent $${exponent.toLatex()}$ exceeds 1, so the series converges absolutely, and order does not matter.`
              : `The exponent $${exponent.toLatex()}$ is at most 1, so the series converges only conditionally, and Riemann's theorem applies.`,
            absolute
              ? `指数 $${exponent.toLatex()}$ 大于 1，所以级数绝对收敛，顺序没有影响。`
              : `指数 $${exponent.toLatex()}$ 不超过 1，所以级数只是条件收敛，黎曼定理适用。`,
          ],
        );
      },
    ),
    point(
      "chasing-a-target",
      ["Chasing a target", "追赶目标"],
      [
        "Riemann's proof is a greedy procedure. To reach a target, add positive terms in order until the partial sum passes the target, then add negative terms until it falls below, and repeat. Since the terms tend to zero, the overshoots shrink, and the rearranged series converges to the target.",
        "黎曼的证明是一个贪心过程。要达到目标，就依次加正项，直到部分和超过目标；再加负项，直到它低于目标；如此重复。因为各项趋于零，超出的量越来越小，重排后的级数收敛到目标。",
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
        return ask(
          [
            `To rearrange $1 - \\frac{1}{2} + \\frac{1}{3} - \\cdots$ toward the target $${target.toLatex()}$, you first add $1 + \\frac{1}{3} + \\frac{1}{5} + \\cdots$ until the sum passes the target. How many terms does this take?`,
            `要把 $1 - \\frac{1}{2} + \\frac{1}{3} - \\cdots$ 重排为趋于目标 $${target.toLatex()}$，先加 $1 + \\frac{1}{3} + \\frac{1}{5} + \\cdots$，直到和超过目标。这需要多少项？`,
          ],
          count,
          [count - 1, count + 1, count + 2, count === 2 ? 5 : 2].filter((v) => v > 0),
          [
            `With ${count - 1} ${count === 2 ? "term" : "terms"} the sum is about ${(sum - 1 / (2 * count - 1)).toFixed(3)}, and with ${count} it is about ${sum.toFixed(3)}, which first passes $${target.toLatex()}$.`,
            `加 ${count - 1} 项时和约为 ${(sum - 1 / (2 * count - 1)).toFixed(3)}，加 ${count} 项时约为 ${sum.toFixed(3)}，首次超过 $${target.toLatex()}$。`,
          ],
        );
      },
    ),
  ],
);

const cauchyProducts = topic(
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
        "The Cauchy product of $\\sum a_n$ and $\\sum b_n$ has terms $c_n = a_0 b_n + a_1 b_{n-1} + \\cdots + a_n b_0$, collecting all pairs of indices that add up to $n$. This is exactly how the coefficient of $x^n$ arises when two power series are multiplied.",
        "$\\sum a_n$ 和 $\\sum b_n$ 的柯西乘积，其项为 $c_n = a_0 b_n + a_1 b_{n-1} + \\cdots + a_n b_0$，也就是把下标之和为 $n$ 的所有对加起来。两个幂级数相乘时，$x^n$ 的系数正是这样产生的。",
      ],
      (rng) => {
        const a = Array.from({ length: 4 }, () => rng.int(1, 6));
        const b = Array.from({ length: 4 }, () => rng.int(1, 6));
        const n = rng.int(2, 3);
        const parts = a.slice(0, n + 1).map((v, i) => v * (b[n - i] as number));
        const answer = parts.reduce((x, y) => x + y, 0);
        return ask(
          [
            `Two series begin with $a_0, a_1, a_2, a_3 = ${a.join(", ")}$ and $b_0, b_1, b_2, b_3 = ${b.join(", ")}$. What is the term $c_${n}$ of their Cauchy product?`,
            `两个级数开头是 $a_0, a_1, a_2, a_3 = ${a.join(", ")}$ 和 $b_0, b_1, b_2, b_3 = ${b.join(", ")}$。它们的柯西乘积中 $c_${n}$ 是多少？`,
          ],
          answer,
          [
            (a[n] as number) * (b[n] as number),
            parts[0] as number,
            answer + 1,
            a.slice(0, n + 1).reduce((x, y, i) => x + y * (b[i] as number), 0),
          ],
          [
            `Pairs of indices adding up to ${n} give $${a
              .slice(0, n + 1)
              .map((v, i) => `${v} \\cdot ${b[n - i]}`)
              .join(" + ")} = ${answer}$.`,
            `下标之和为 ${n} 的对给出 $${a
              .slice(0, n + 1)
              .map((v, i) => `${v} \\cdot ${b[n - i]}`)
              .join(" + ")} = ${answer}$。`,
          ],
        );
      },
    ),
    point(
      "the-sum-of-a-product",
      ["The sum of a product", "乘积的和"],
      [
        "Mertens' theorem says that if one series converges absolutely and the other converges, their Cauchy product converges to the product of the two sums. If neither converges absolutely, the product may diverge. For two geometric series the sums are easy, and the product of the sums gives the total immediately.",
        "默滕斯定理说：如果一个级数绝对收敛，另一个收敛，那么它们的柯西乘积收敛到两个和的乘积。如果两个都不绝对收敛，乘积可能发散。对两个几何级数，和很容易求，它们的乘积直接给出总和。",
      ],
      (rng) => {
        const [p, q] = [rng.int(2, 9), rng.int(2, 9)];
        const answer = Q.of(p, p - 1).mul(Q.of(q, q - 1));
        return ask(
          [
            `What is the sum of the Cauchy product of $\\sum_{n \\ge 0} \\frac{1}{${p}^n}$ and $\\sum_{n \\ge 0} \\frac{1}{${q}^n}$?`,
            `$\\sum_{n \\ge 0} \\frac{1}{${p}^n}$ 和 $\\sum_{n \\ge 0} \\frac{1}{${q}^n}$ 的柯西乘积的和是多少？`,
          ],
          answer,
          [Q.of(p, p - 1).add(Q.of(q, q - 1)), Q.of(p * q, p * q - 1), Q.of(1, (p - 1) * (q - 1)), 1],
          [
            `Both series converge absolutely, with sums $${Q.of(p, p - 1).toLatex()}$ and $${Q.of(q, q - 1).toLatex()}$. Their product is $${answer.toLatex()}$.`,
            `两个级数都绝对收敛，和分别是 $${Q.of(p, p - 1).toLatex()}$ 和 $${Q.of(q, q - 1).toLatex()}$。它们的乘积是 $${answer.toLatex()}$。`,
          ],
        );
      },
    ),
  ],
);

const discontinuities = topic(
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
        "A discontinuity is removable when the two one-sided limits agree but differ from the value, and a jump when both limits exist but disagree. In the remaining kind, called essential, some one-sided limit does not exist, as with $\\sin \\frac{1}{x}$ at 0, which oscillates endlessly.",
        "如果两个单侧极限相等但不等于函数值，间断点是可去的；如果两个极限都存在但不相等，就是跳跃间断点。其余的称为本性间断点，至少一个单侧极限不存在，如 $\\sin \\frac{1}{x}$ 在 0 处无休止地振荡。",
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
        return choose(
          rng,
          prompt,
          names[kind] as Pair,
          [...names, ["There is no discontinuity", "没有间断"]],
          [
            kind === 0
              ? "The limit exists but differs from the value, so changing one value would repair the function."
              : kind === 1
                ? "Both one-sided limits exist but they differ, and no choice of value can repair this."
                : "The function oscillates near the point, so the one-sided limits do not exist.",
            kind === 0
              ? "极限存在但不等于函数值，所以改变一个值就能修复函数。"
              : kind === 1
                ? "两个单侧极限都存在但不相等，无论函数值取什么都修复不了。"
                : "函数在这一点附近振荡，所以单侧极限不存在。",
          ],
        );
      },
    ),
    point(
      "counting-big-jumps",
      ["Counting big jumps", "数较大的跳跃"],
      [
        "An increasing function has one-sided limits everywhere, so its only discontinuities are jumps. The jumps together cannot rise more than $f(b) - f(a)$, which limits the number of jumps above any given size. Taking the sizes $\\frac{1}{m}$ for each $m$ shows that the set of all jumps is countable.",
        "递增函数处处有单侧极限，所以它的间断点只能是跳跃。所有跳跃加起来不能超过 $f(b) - f(a)$，这就限制了超过某一大小的跳跃个数。对每个 $m$ 取大小 $\\frac{1}{m}$，就说明全部跳跃的集合是可数的。",
      ],
      (rng) => {
        const rise = rng.int(3, 20);
        const size = rng.pick([Q.of(1, 4), Q.of(1, 2), Q.of(1, 1), Q.of(2, 1), Q.of(3, 1)]);
        const ratio = rise / size.toNumber();
        const answer = Math.ceil(ratio) - 1;
        return ask(
          [
            `An increasing function on $[0, 1]$ has $f(0) = 0$ and $f(1) = ${rise}$. What is the largest possible number of jumps of size greater than $${size.toLatex()}$?`,
            `$[0, 1]$ 上的递增函数满足 $f(0) = 0$，$f(1) = ${rise}$。大小超过 $${size.toLatex()}$ 的跳跃最多有多少个？`,
          ],
          answer,
          [answer + 1, answer + 2, rise, Math.max(answer - 1, 1) === answer ? answer + 3 : Math.max(answer - 1, 1)],
          [
            `$k$ such jumps rise by more than $k \\cdot ${size.toLatex()}$, which must stay at most ${rise}. So $k$ must be less than $${Q.of(rise, 1).div(size).toLatex()}$, and the largest such whole number is ${answer}.`,
            `$k$ 个这样的跳跃上升量超过 $k \\cdot ${size.toLatex()}$，而总上升量不超过 ${rise}。所以 $k$ 小于 $${Q.of(rise, 1).div(size).toLatex()}$，最大的整数是 ${answer}。`,
          ],
        );
      },
    ),
  ],
);

const bisection = topic(
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
        "Bisection starts with an interval where $f$ changes sign. Test the midpoint and keep the half on which the sign still changes. The nested intervals close down on a single point by completeness, and continuity then forces $f$ to be zero there. This proves the intermediate value theorem.",
        "二分法从 $f$ 变号的区间开始。检验中点，保留仍然变号的那一半。由完备性，这些嵌套区间收缩到一点；再由连续性，$f$ 在该点必为零。这就证明了介值定理。",
      ],
      (rng) => {
        const a = rng.int(0, 5);
        const b = a + rng.pick([2, 4, 6]);
        const mid = (a + b) / 2;
        const c = rng.int(a * a + 1, b * b - 1 === mid * mid ? b * b - 2 : b * b - 1);
        const value = c === mid * mid ? c + 1 : c;
        const goesLeft = mid * mid > value;
        const interval = (x: number, y: number): Pair => same(`[${x}, ${y}]`);
        return choose(
          rng,
          [
            `To solve $x^2 = ${value}$, bisection starts on $[${a}, ${b}]$. Which interval is kept after one step?`,
            `要解 $x^2 = ${value}$，二分法从 $[${a}, ${b}]$ 开始。一步之后保留哪个区间？`,
          ],
          goesLeft ? interval(a, mid) : interval(mid, b),
          [interval(a, mid), interval(mid, b), interval(a, b), interval(mid - 1, mid + 1)],
          [
            `At the midpoint, $${mid}^2 = ${mid * mid}$ is ${goesLeft ? "above" : "below"} ${value}, so the root lies ${goesLeft ? "to the left" : "to the right"} of ${mid}.`,
            `在中点处，$${mid}^2 = ${mid * mid}$ ${goesLeft ? "大于" : "小于"} ${value}，所以根在 ${mid} 的${goesLeft ? "左" : "右"}边。`,
          ],
        );
      },
    ),
    point(
      "how-many-halvings",
      ["How many halvings", "减半多少次"],
      [
        "Each step of bisection halves the interval, so after $n$ steps an interval of length $L$ has length $L / 2^n$. The midpoint of that interval lies within half of this length of the root. So the number of steps needed for a given accuracy grows only with the logarithm of the accuracy.",
        "二分法每一步把区间减半，所以长度为 $L$ 的区间经过 $n$ 步后长度是 $L / 2^n$。这个区间的中点与根的距离不超过这一长度的一半。所以达到给定精度所需的步数只随精度的对数增长。",
      ],
      (rng) => {
        const length = rng.int(1, 12);
        const m = rng.pick([10, 20, 50, 100, 200, 500, 1000, 5000, 10000]);
        let n = 0;
        while (length / 2 ** n >= 1 / m) n++;
        return ask(
          [
            `Bisection starts with an interval of length ${length}. What is the smallest number of steps that makes the length less than $\\frac{1}{${m}}$?`,
            `二分法从长度为 ${length} 的区间开始。最少多少步能使长度小于 $\\frac{1}{${m}}$？`,
          ],
          n,
          [n - 1, n + 1, n + 2, length * m],
          [
            `The length after $n$ steps is $\\frac{${length}}{2^n}$, so $2^n$ must exceed $${length * m}$. Since $2^{${n}} = ${2 ** n}$ is the first power that does, $n = ${n}$.`,
            `$n$ 步后长度是 $\\frac{${length}}{2^n}$，所以 $2^n$ 必须大于 $${length * m}$。第一个满足的是 $2^{${n}} = ${2 ** n}$，所以 $n = ${n}$。`,
          ],
        );
      },
    ),
  ],
);

const rolle = topic(
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
        "Rolle's theorem says that between two zeros of a differentiable function lies a zero of its derivative. So a function with $k$ distinct real zeros has a derivative with at least $k - 1$, and each further derivative guarantees at least one fewer. The count cannot be improved in general by this argument alone.",
        "罗尔定理说：可导函数的两个零点之间有一个导数的零点。所以有 $k$ 个不同实零点的函数，其导数至少有 $k - 1$ 个零点，每多求一次导数，保证的个数至少少一个。仅靠这个论证，一般不能得到更好的结果。",
      ],
      (rng) => {
        const k = rng.int(3, 9);
        const j = rng.int(1, k - 1);
        const answer = k - j;
        const name = j === 1 ? "f'" : j === 2 ? "f''" : `f^{(${j})}`;
        return ask(
          [
            `A smooth function $f$ has ${k} distinct real zeros. How many real zeros does Rolle's theorem guarantee for $${name}$?`,
            `光滑函数 $f$ 有 ${k} 个不同的实零点。罗尔定理保证 $${name}$ 至少有多少个实零点？`,
          ],
          answer,
          [answer + 1, answer - 1 >= 1 ? answer - 1 : answer + 2, k, j],
          [
            `Each derivative guarantees one fewer zero, so ${j} ${j === 1 ? "derivative leaves" : "derivatives leave"} $${k} - ${j} = ${answer}$.`,
            `每求一次导数，保证的零点少一个，所以求导 ${j} 次后剩下 $${k} - ${j} = ${answer}$ 个。`,
          ],
        );
      },
    ),
    point(
      "at-most-how-many-zeros",
      ["At most how many zeros", "最多有多少个零点"],
      [
        "Reading Rolle's theorem backward bounds zeros from above: if $f'$ has $m$ real zeros, then $f$ has at most $m + 1$. For example, a function with a positive derivative everywhere is strictly increasing, so it can cross zero at most once. This often settles a count that formulas cannot.",
        "把罗尔定理反过来读就得到零点的上界：如果 $f'$ 有 $m$ 个实零点，那么 $f$ 至多有 $m + 1$ 个。例如，导数处处为正的函数严格递增，所以至多穿过零一次。公式解决不了的计数问题，这样常常能解决。",
      ],
      (rng) => {
        const k = rng.int(1, 6);
        const [a, b] = [rng.int(1, 9), rng.int(1, 9)];
        const odd = rng.bool();
        const degree = odd ? 2 * k + 1 : 2 * k;
        const answer = odd ? 1 : 2;
        const body = `x^{${degree}} + ${times(a, "x")} + ${b}`;
        return ask(
          [
            `What is the largest number of real zeros that Rolle's theorem allows for $${body}$?`,
            `罗尔定理允许 $${body}$ 最多有多少个实零点？`,
          ],
          answer,
          [degree, answer + 1, 0, degree + 1],
          [
            odd
              ? `The derivative $${degree} x^{${2 * k}} + ${a}$ is always positive, so it has no zeros, and the function has at most 1.`
              : `The derivative $${degree} ${degree === 2 ? "x" : `x^{${degree - 1}}`} + ${a}$ is increasing, so it has exactly one zero, and the function has at most 2.`,
            odd
              ? `导数 $${degree} x^{${2 * k}} + ${a}$ 恒为正，没有零点，所以函数至多有 1 个零点。`
              : `导数 $${degree} ${degree === 2 ? "x" : `x^{${degree - 1}}`} + ${a}$ 递增，恰有一个零点，所以函数至多有 2 个零点。`,
          ],
        );
      },
    ),
  ],
);

const darboux = topic(
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
        "Darboux's theorem says that derivatives have the intermediate value property, even when they are not continuous. If $f$ is differentiable on $[a, b]$ and a number lies between $f'(a)$ and $f'(b)$, then $f'$ takes that value somewhere between $a$ and $b$. No continuity of $f'$ is needed.",
        "达布定理说：导数具有介值性质，即使它不连续。如果 $f$ 在 $[a, b]$ 上可导，某个数在 $f'(a)$ 和 $f'(b)$ 之间，那么 $f'$ 在 $a$ 和 $b$ 之间的某处取到这个值。不需要 $f'$ 连续。",
      ],
      (rng) => {
        const low = rng.int(-6, 4);
        const high = low + rng.int(3, 9);
        const inside = rng.int(low + 1, high - 1);
        const flip = rng.bool();
        const [a, b] = flip ? [high, low] : [low, high];
        return choose(
          rng,
          [
            `A function is differentiable on $[0, 1]$, with $f'(0) = ${a}$ and $f'(1) = ${b}$. Which value must $f'$ take?`,
            `函数在 $[0, 1]$ 上可导，$f'(0) = ${a}$，$f'(1) = ${b}$。$f'$ 一定取到哪个值？`,
          ],
          same(String(inside)),
          [same(String(low - 1)), same(String(high + 1)), same(String(high + 2)), same(String(low - 2))],
          [
            `${inside} lies between ${low} and ${high}, so Darboux's theorem applies. The numbers outside that range may not be taken.`,
            `${inside} 在 ${low} 和 ${high} 之间，所以达布定理适用。这个范围之外的数可能取不到。`,
          ],
        );
      },
    ),
    point(
      "what-cannot-be-a-derivative",
      ["What cannot be a derivative", "什么不能是导数"],
      [
        "A function with a jump discontinuity cannot be the derivative of anything, because it skips the values inside the jump. So the sign function and the floor function have no antiderivative on an interval containing a jump, although they are integrable. Discontinuities of a derivative must be of the oscillating kind.",
        "有跳跃间断的函数不可能是任何函数的导数，因为它跳过了跳跃之内的值。所以符号函数和取整函数在含跳跃点的区间上没有原函数，尽管它们可积。导数的间断只能是振荡型的。",
      ],
      (rng) => {
        const [a, b] = [rng.int(2, 9), rng.int(2, 9)];
        const jump = rng.pick<Pair>([
          [`$f(x) = ${a}$ for $x < 0$ and $f(x) = ${a + b}$ for $x \\ge 0$`, `$x < 0$ 时 $f(x) = ${a}$，$x \\ge 0$ 时 $f(x) = ${a + b}$`],
          [`$f(x) = ${a} \\lfloor x \\rfloor$`, `$f(x) = ${a} \\lfloor x \\rfloor$`],
          [`$f(x) = ${a} \\operatorname{sgn} x + ${b}$`, `$f(x) = ${a} \\operatorname{sgn} x + ${b}$`],
        ]);
        return choose(
          rng,
          [
            "On an interval around 0 and 1, which function cannot be the derivative of a differentiable function?",
            "在包含 0 和 1 的区间上，哪个函数不可能是可导函数的导数？",
          ],
          jump,
          [same(`f(x) = ${a} x^2 + ${b}`), same(`f(x) = ${a} |x|`), same(`f(x) = ${a} \\cos ${b} x`)],
          [
            "That function has a jump, so it skips values and violates Darboux's theorem. Each of the others is continuous, and so has an antiderivative.",
            "这个函数有跳跃，跳过了一些值，违反达布定理。其他几个都连续，所以都有原函数。",
          ],
        );
      },
    ),
  ],
);

const lagrange = topic(
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
        "Taylor's theorem says that the error of the degree $n$ polynomial at $a$ is $\\frac{f^{(n+1)}(c)}{(n+1)!} (x - a)^{n+1}$ for some $c$ between $a$ and $x$. If the next derivative has size at most $M$, then the error is at most $\\frac{M |x - a|^{n+1}}{(n+1)!}$. The mean value theorem is the case $n = 0$.",
        "泰勒定理说：在 $a$ 处的 $n$ 次多项式，误差是 $\\frac{f^{(n+1)}(c)}{(n+1)!} (x - a)^{n+1}$，其中 $c$ 在 $a$ 和 $x$ 之间。如果下一阶导数的模不超过 $M$，误差就不超过 $\\frac{M |x - a|^{n+1}}{(n+1)!}$。中值定理就是 $n = 0$ 的情形。",
      ],
      (rng) => {
        const n = rng.int(1, 4);
        const q = rng.int(2, 6);
        const M = rng.int(1, 5);
        const name = `${M === 1 ? "" : `${M} `}${rng.pick(["\\sin x", "\\cos x"])}`;
        const answer = Q.of(M, q ** (n + 1) * factorial(n + 1));
        return ask(
          [
            `Using all derivatives bounded by ${M}, what bound does Taylor's theorem give for the error at $x = \\frac{1}{${q}}$ of the degree ${n} polynomial of $${name}$ at 0?`,
            `利用所有导数的模都不超过 ${M}，泰勒定理对 $${name}$ 在 0 处的 ${n} 次多项式，在 $x = \\frac{1}{${q}}$ 处的误差给出什么界？`,
          ],
          answer,
          [
            Q.of(M, q ** n * factorial(n)),
            Q.of(M, q ** (n + 1)),
            Q.of(M, q ** (n + 1) * (n + 1)),
            Q.of(M, q ** (n + 2) * factorial(n + 2)),
          ],
          [
            `The bound is $\\frac{${M}}{${n + 1}!} \\left( \\frac{1}{${q}} \\right)^{${n + 1}} = ${answer.toLatex()}$.`,
            `界是 $\\frac{${M}}{${n + 1}!} \\left( \\frac{1}{${q}} \\right)^{${n + 1}} = ${answer.toLatex()}$。`,
          ],
        );
      },
    ),
    point(
      "the-degree-needed",
      ["The degree needed", "所需的次数"],
      [
        "To reach a required accuracy, increase $n$ until the bound falls below the tolerance. Since $(n + 1)!$ grows faster than any power, the remainder for functions like $\\sin x$ and $e^x$ tends to zero at every $x$. This is why their Taylor series converge to them on the whole line.",
        "要达到所需的精度，就增大 $n$，直到界低于容许误差。由于 $(n + 1)!$ 比任何幂增长得都快，$\\sin x$、$e^x$ 这类函数的余项在每个 $x$ 处都趋于零。所以它们的泰勒级数在整条实轴上收敛到它们本身。",
      ],
      (rng) => {
        const x = rng.int(1, 4);
        const m = rng.pick([10, 20, 50, 100, 200, 500, 1000, 2000, 5000]);
        let n = 0;
        while (x ** (n + 1) / factorial(n + 1) >= 1 / m) n++;
        return ask(
          [
            `For $\\sin x$ at 0, with all derivatives bounded by 1, what is the smallest degree $n$ whose bound $\\frac{${x}^{n+1}}{(n+1)!}$ at $x = ${x}$ is less than $\\frac{1}{${m}}$?`,
            `对 $\\sin x$ 在 0 处展开，所有导数的模不超过 1。在 $x = ${x}$ 处，使界 $\\frac{${x}^{n+1}}{(n+1)!}$ 小于 $\\frac{1}{${m}}$ 的最小次数 $n$ 是多少？`,
          ],
          n,
          [n - 1 >= 0 ? n - 1 : n + 3, n + 1, n + 2, m],
          [
            `At $n = ${n}$ the bound is $\\frac{${x ** (n + 1)}}{${factorial(n + 1)}}$, which is below $\\frac{1}{${m}}$${n === 0 ? "" : `, while at $n = ${n - 1}$ it is $\\frac{${x ** n}}{${factorial(n)}}$, which is not`}.`,
            `$n = ${n}$ 时界是 $\\frac{${x ** (n + 1)}}{${factorial(n + 1)}}$，小于 $\\frac{1}{${m}}$${n === 0 ? "" : `；而 $n = ${n - 1}$ 时界是 $\\frac{${x ** n}}{${factorial(n)}}$，不小于它`}。`,
          ],
        );
      },
    ),
  ],
);

const integralBounds = topic(
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
        "If $m \\le f \\le M$ on $[a, b]$, then every upper and lower sum lies between $m (b - a)$ and $M (b - a)$, and so does the integral. The inequality needs only integrability, and it gives a quick estimate of integrals that have no simple formula.",
        "如果在 $[a, b]$ 上 $m \\le f \\le M$，那么每个上和、下和都在 $m (b - a)$ 和 $M (b - a)$ 之间，积分也一样。这个不等式只需要可积，它能快速估计没有简单公式的积分。",
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
        return ask(
          [
            `Using the largest and smallest values of $${body}$ on the interval, what is the ${name} bound this gives for $\\int_{${a}}^{${b}} (${body}) \\, dx$?`,
            `利用 $${body}$ 在区间上的最大值和最小值，$\\int_{${a}}^{${b}} (${body}) \\, dx$ 的${zh}界是多少？`,
          ],
          value,
          [
            upper ? (a * a + c) * (b - a) : (b * b + c) * (b - a),
            upper ? b * b + c : a * a + c,
            value + b - a,
            (a * a + b * b + c) * (b - a),
          ].filter((v) => v !== value),
          [
            `The function is increasing on the interval, so its ${upper ? "largest" : "smallest"} value is $${upper ? b * b + c : a * a + c}$. Multiplying by the length ${b - a} gives ${value}.`,
            `函数在区间上递增，所以${upper ? "最大" : "最小"}值是 $${upper ? b * b + c : a * a + c}$。乘长度 ${b - a} 得 ${value}。`,
          ],
        );
      },
    ),
    point(
      "the-value-guaranteed-in-the-mean",
      ["The value guaranteed in the mean", "平均值定理保证的值"],
      [
        "A continuous function on $[a, b]$ takes its average value somewhere: there is a $c$ with $f(c) = \\frac{1}{b - a} \\int_a^b f$. The average lies between the minimum and maximum, and the intermediate value theorem provides the point. Continuity is essential, since a step function can jump over its average.",
        "$[a, b]$ 上的连续函数在某处取到它的平均值：存在 $c$ 使 $f(c) = \\frac{1}{b - a} \\int_a^b f$。平均值在最小值和最大值之间，介值定理给出这一点。连续性是必需的，因为阶梯函数可以跳过它的平均值。",
      ],
      (rng) => {
        const a = rng.int(-3, 4);
        const b = a + rng.int(2, 8);
        const integral = rng.int(5, 60);
        const answer = Q.of(integral, b - a);
        return ask(
          [
            `A continuous function has $\\int_{${a}}^{${b}} f(x) \\, dx = ${integral}$. What value must $f$ take on the interval?`,
            `连续函数满足 $\\int_{${a}}^{${b}} f(x) \\, dx = ${integral}$。$f$ 在区间上一定取到什么值？`,
          ],
          answer,
          [integral, Q.of(integral, b + a === 0 ? 1 : Math.abs(b + a)), Q.of(integral, 2), Q.of(b - a, integral)],
          [
            `The mean value theorem for integrals gives $f(c) = \\frac{${integral}}{${b - a}} = ${answer.toLatex()}$ for some $c$ in the interval.`,
            `积分中值定理给出区间内某个 $c$ 使 $f(c) = \\frac{${integral}}{${b - a}} = ${answer.toLatex()}$。`,
          ],
        );
      },
    ),
  ],
);

const ftc = topic(
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
        "Even when $f$ is merely integrable, $F(x) = \\int_a^x f$ is continuous. Where $f$ is continuous, the proof of the fundamental theorem shows $F' = f$. So for a step function, $F$ is built from straight pieces whose slopes are the heights of the steps, and they meet with no gaps.",
        "即使 $f$ 只是可积，$F(x) = \\int_a^x f$ 也是连续的。在 $f$ 连续的地方，微积分基本定理的证明给出 $F' = f$。所以对阶梯函数，$F$ 由若干直线段组成，斜率就是阶梯的高度，它们无缝相接。",
      ],
      (rng) => {
        const [p, q] = rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 2) as [number, number];
        const c = rng.int(1, 5);
        const x = c + rng.int(1, 5);
        const askSlope = rng.bool();
        const answer = askSlope ? q : p * c + q * (x - c);
        return ask(
          [
            `Let $f = ${p}$ on $[0, ${c})$ and $f = ${q}$ on $[${c}, \\infty)$, and $F(x) = \\int_0^x f$. What is ${askSlope ? `$F'(${x})$` : `$F(${x})$`}?`,
            `设 $[0, ${c})$ 上 $f = ${p}$，$[${c}, \\infty)$ 上 $f = ${q}$，$F(x) = \\int_0^x f$。${askSlope ? `$F'(${x})$` : `$F(${x})$`} 是多少？`,
          ],
          answer,
          askSlope ? [p, q - p, p * c + q * (x - c), q * x] : [q * x, p * x, q, p * c],
          [
            askSlope
              ? `The point ${x} lies inside the second piece, where $f$ is continuous, so $F'(${x}) = f(${x}) = ${q}$.`
              : `Add the areas of the two pieces: $${p} \\cdot ${c} + ${q} \\cdot ${x - c} = ${answer}$.`,
            askSlope
              ? `点 ${x} 在第二段内部，$f$ 在那里连续，所以 $F'(${x}) = f(${x}) = ${q}$。`
              : `把两段的面积相加：$${p} \\cdot ${c} + ${q} \\cdot ${x - c} = ${answer}$。`,
          ],
        );
      },
    ),
    point(
      "a-corner-at-a-jump",
      ["A corner at a jump", "跳跃处的尖角"],
      [
        "At a jump of $f$, the accumulation function has one-sided derivatives equal to the one-sided limits of $f$, and they differ. So $F$ has a corner there and is not differentiable, although it is still continuous. Integrating improves a function by one step: jumps become corners, and corners become smooth curves.",
        "在 $f$ 的跳跃处，累积函数的单侧导数等于 $f$ 的单侧极限，二者不同。所以 $F$ 在那里有尖角，不可导，但仍然连续。积分使函数变好一步：跳跃变成尖角，尖角变成光滑曲线。",
      ],
      (rng) => {
        const [p, q] = rng.sample([-3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8], 2) as [number, number];
        const c = rng.int(1, 6);
        const answer = q - p;
        const wrongs = [p - q, p + q, q, p].filter((v) => v !== answer);
        return ask(
          [
            `Let $f = ${p}$ for $x < ${c}$ and $f = ${q}$ for $x \\ge ${c}$, and $F(x) = \\int_0^x f$. What is the right derivative of $F$ at ${c} minus the left derivative?`,
            `设 $x < ${c}$ 时 $f = ${p}$，$x \\ge ${c}$ 时 $f = ${q}$，$F(x) = \\int_0^x f$。$F$ 在 ${c} 处的右导数减左导数是多少？`,
          ],
          answer,
          wrongs,
          [
            `The one-sided derivatives are the one-sided values of $f$: ${q} on the right and ${p} on the left. Their difference is ${answer}, the signed size of the jump.`,
            `单侧导数就是 $f$ 的单侧值：右侧 ${q}，左侧 ${p}。它们的差是 ${answer}，也就是带符号的跳跃大小。`,
          ],
        );
      },
    ),
  ],
);

const interchange = topic(
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
        "Pointwise convergence is not enough to move a limit inside an integral. The function equal to $a n$ on $(0, \\frac{b}{n})$ and 0 elsewhere tends to 0 at every point, yet its integral stays $ab$. The bump grows taller as it narrows, so its area never leaves even though each point eventually sees zero.",
        "逐点收敛不足以把极限移到积分号内。在 $(0, \\frac{b}{n})$ 上等于 $a n$、其他地方为 0 的函数在每一点都趋于 0，但积分始终是 $ab$。凸起变窄的同时变高，所以面积没有消失，尽管每一点最终都为零。",
      ],
      (rng) => {
        const [a, b] = [rng.int(1, 9), rng.int(1, 9)];
        const answer = a * b;
        return ask(
          [
            `Let $f_n = ${times(a, "n")}$ on $(0, \\frac{${b}}{n})$ and 0 elsewhere on $[0, ${b}]$. What is $\\lim_{n \\to \\infty} \\int f_n$ minus $\\int \\lim_{n \\to \\infty} f_n$?`,
            `设 $[0, ${b}]$ 上，在 $(0, \\frac{${b}}{n})$ 上 $f_n = ${times(a, "n")}$，其他地方为 0。$\\lim_{n \\to \\infty} \\int f_n$ 减 $\\int \\lim_{n \\to \\infty} f_n$ 是多少？`,
          ],
          answer,
          [0, a, b, a + b],
          [
            `Each integral equals the height times the width, $${times(a, "n")} \\cdot \\frac{${b}}{n} = ${answer}$. The pointwise limit is 0 on the whole interval, so its integral is 0, and the difference is ${answer}.`,
            `每个积分等于高乘宽，$${times(a, "n")} \\cdot \\frac{${b}}{n} = ${answer}$。逐点极限在整个区间上为 0，积分也为 0，所以差是 ${answer}。`,
          ],
        );
      },
    ),
    point(
      "a-limit-under-uniform-convergence",
      ["A limit under uniform convergence", "一致收敛下的极限"],
      [
        "If $f_n \\to f$ uniformly on $[a, b]$, then the integrals converge to the integral of $f$, because the error is at most $(b - a) \\sup |f_n - f|$. So when the sup distance tends to zero, as for a term like $\\frac{\\sin nx}{n}$, the limit can simply be taken first.",
        "如果在 $[a, b]$ 上 $f_n \\to f$ 一致收敛，那么积分收敛到 $f$ 的积分，因为误差不超过 $(b - a) \\sup |f_n - f|$。所以当上确界距离趋于零时（如 $\\frac{\\sin nx}{n}$ 这样的项），可以先取极限。",
      ],
      (rng) => {
        const [a, b] = [rng.int(1, 9), rng.int(1, 6)];
        const c = rng.int(1, 5);
        const answer = Q.of(a * b * b, 2);
        return ask(
          [
            `Let $f_n(x) = ${times(a, "x")} + \\frac{${c === 1 ? "" : c} \\sin nx}{n}$. What is $\\lim_{n \\to \\infty} \\int_0^{${b}} f_n(x) \\, dx$?`,
            `设 $f_n(x) = ${times(a, "x")} + \\frac{${c === 1 ? "" : c} \\sin nx}{n}$。$\\lim_{n \\to \\infty} \\int_0^{${b}} f_n(x) \\, dx$ 是多少？`,
          ],
          answer,
          [a * b * b, Q.of(a * b, 2), Q.of(a * b * b, 2).add(Q.of(c, 1)), a * b],
          [
            `The extra term has size at most $\\frac{${c}}{n}$, so the convergence is uniform. The limit is $\\int_0^{${b}} ${times(a, "x")} \\, dx = ${answer.toLatex()}$.`,
            `多出的项不超过 $\\frac{${c}}{n}$，所以收敛是一致的。极限是 $\\int_0^{${b}} ${times(a, "x")} \\, dx = ${answer.toLatex()}$。`,
          ],
        );
      },
    ),
  ],
);

const measureZero = topic(
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
        "A set has measure zero if it can be covered by intervals of total length as small as you wish. A countable set always can: give the $k$th point an interval of length $\\frac{\\varepsilon}{2^k}$, and the lengths add up to at most $\\varepsilon$. By Lebesgue's criterion, a bounded function is integrable when its discontinuities have measure zero.",
        "如果一个集合能被总长度任意小的区间覆盖，它就是零测集。可数集总是如此：给第 $k$ 个点长度为 $\\frac{\\varepsilon}{2^k}$ 的区间，总长度不超过 $\\varepsilon$。按勒贝格判别法，有界函数的间断点集为零测集时可积。",
      ],
      (rng) => {
        const denominator = rng.pick([2, 3, 4, 5, 8, 10, 20, 100]);
        const N = rng.int(2, 6);
        const answer = Q.of(1, denominator).mul(Q.of(2 ** N - 1, 2 ** N));
        return ask(
          [
            `The $k$th point of a set gets an interval of length $\\frac{1}{${denominator} \\cdot 2^k}$. What total length do the first ${N} intervals have?`,
            `集合的第 $k$ 个点配一个长度为 $\\frac{1}{${denominator} \\cdot 2^k}$ 的区间。前 ${N} 个区间的总长度是多少？`,
          ],
          answer,
          [Q.of(1, denominator), Q.of(N, denominator * 2 ** N), Q.of(1, denominator * 2 ** N), Q.of(N, denominator)],
          [
            `$\\frac{1}{2} + \\cdots + \\frac{1}{2^{${N}}} = 1 - \\frac{1}{2^{${N}}} = ${Q.of(2 ** N - 1, 2 ** N).toLatex()}$. Multiplying by $\\frac{1}{${denominator}}$ gives $${answer.toLatex()}$.`,
            `$\\frac{1}{2} + \\cdots + \\frac{1}{2^{${N}}} = 1 - \\frac{1}{2^{${N}}} = ${Q.of(2 ** N - 1, 2 ** N).toLatex()}$。乘 $\\frac{1}{${denominator}}$ 得 $${answer.toLatex()}$。`,
          ],
        );
      },
    ),
    point(
      "building-the-cantor-set",
      ["Building the Cantor set", "构造康托尔集"],
      [
        "Start with $[0, 1]$ and repeatedly remove the open middle third of each piece. After $n$ steps, $2^n$ pieces of length $\\frac{1}{3^n}$ remain, with total length $(\\frac{2}{3})^n$. What survives forever is the Cantor set. It has measure zero and yet is uncountable, so measure zero does not mean small in number.",
        "从 $[0, 1]$ 开始，反复去掉每一段中间的开三分之一。$n$ 步后剩下 $2^n$ 段，每段长 $\\frac{1}{3^n}$，总长度 $(\\frac{2}{3})^n$。永远留下的就是康托尔集。它是零测集却不可数，所以零测不等于个数少。",
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
        const wrong =
          k === 0
            ? [3 ** n, 2 * n, 2 ** (n + 1)]
            : [
                Q.of(scale, 2 ** n),
                Q.of(scale, 3 ** (n + 1)),
                Q.of(scale * 2 ** (n + 1), 3 ** (n + 1)),
                Q.of(scale * 2 ** n, 3 ** n),
                Q.of(scale, 3 ** n),
              ];
        return ask(
          [
            `Build the middle-thirds set starting from $${interval}$. After ${n === 1 ? "1 step" : `${n} steps`}, what is ${en}?`,
            `从 $${interval}$ 开始，构造去掉中间三分之一的集合。${n} 步后，${zh}是多少？`,
          ],
          answer,
          wrong,
          [
            `After $n$ steps there are $2^n$ pieces, each $\\frac{1}{3^n}$ of the starting length, so here the answer is $${typeof answer === "number" ? answer : answer.toLatex()}$.`,
            `$n$ 步后有 $2^n$ 段，每段是原长度的 $\\frac{1}{3^n}$，所以这里的答案是 $${typeof answer === "number" ? answer : answer.toLatex()}$。`,
          ],
        );
      },
    ),
  ],
);

const complete = topic(
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
        "A metric space is complete when every Cauchy sequence converges to a point of the space. A closed subset of the real line is complete, while a set with a missing limit point is not, since a sequence can approach the gap without any limit inside the space.",
        "如果度量空间中每个柯西序列都收敛到空间内的一点，它就是完备的。实数轴的闭子集是完备的；缺少某个极限点的集合则不完备，因为序列可以逼近那个缺口，而空间内没有极限。",
      ],
      (rng) => {
        const [a, b] = [rng.int(-5, 3), rng.int(4, 9)];
        const [en, zh, yes] = rng.pick<[string, string, boolean]>([
          [`the closed interval $[${a}, ${b}]$`, `闭区间 $[${a}, ${b}]$`, true],
          [`the open interval $(${a}, ${b})$`, `开区间 $(${a}, ${b})$`, false],
          [`the half-open interval $[${a}, ${b})$`, `半开区间 $[${a}, ${b})$`, false],
          [`the ray $[${a}, \\infty)$`, `射线 $[${a}, \\infty)$`, true],
          [`the integers greater than ${a}`, `大于 ${a} 的整数`, true],
          [`the rationals in $[${a}, ${b}]$`, `$[${a}, ${b}]$ 中的有理数`, false],
          [`the numbers $${b} + \\frac{1}{n}$ for positive integers $n$`, `$${b} + \\frac{1}{n}$（$n$ 为正整数）构成的集合`, false],
        ]);
        const complete: Pair = ["Complete", "完备"];
        const notComplete: Pair = ["Not complete", "不完备"];
        return choose(
          rng,
          [`With the usual distance, is ${en} complete?`, `在通常距离下，${zh}完备吗？`],
          yes ? complete : notComplete,
          [complete, notComplete, ["It depends on the sequence", "取决于序列"]],
          [
            yes
              ? "The set is closed in the real line, so the limit of any Cauchy sequence in it stays inside."
              : "A sequence in the set can converge to a real number outside it, and such a sequence is Cauchy with no limit in the set.",
            yes
              ? "这个集合是实数轴的闭集，所以其中任何柯西序列的极限都留在集合内。"
              : "集合中的序列可以收敛到集合外的实数，这样的序列是柯西序列，但在集合内没有极限。",
          ],
        );
      },
    ),
    point(
      "a-cauchy-sequence-of-rationals",
      ["A Cauchy sequence of rationals", "有理数的柯西序列"],
      [
        "The rule $x_{n+1} = \\frac{1}{2} (x_n + \\frac{c}{x_n})$ turns rationals into rationals, and its terms form a Cauchy sequence that approaches $\\sqrt{c}$. When $c$ is not a perfect square, this limit is irrational, so the sequence has no limit in $\\mathbb{Q}$. That is exactly how $\\mathbb{Q}$ fails to be complete.",
        "规则 $x_{n+1} = \\frac{1}{2} (x_n + \\frac{c}{x_n})$ 把有理数变成有理数，各项构成趋于 $\\sqrt{c}$ 的柯西序列。当 $c$ 不是完全平方数时，这个极限是无理数，所以序列在 $\\mathbb{Q}$ 中没有极限。这正是 $\\mathbb{Q}$ 不完备的表现。",
      ],
      (rng) => {
        const c = rng.pick([2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15]);
        const x = rng.int(1, 4);
        const answer = Q.of(x * x + c, 2 * x);
        return ask(
          [
            `With $x_{n+1} = \\frac{1}{2} \\left( x_n + \\frac{${c}}{x_n} \\right)$ and $x_0 = ${x}$, what is the rational number $x_1$?`,
            `$x_{n+1} = \\frac{1}{2} \\left( x_n + \\frac{${c}}{x_n} \\right)$，$x_0 = ${x}$，有理数 $x_1$ 是多少？`,
          ],
          answer,
          [Q.of(x + c, 2), Q.of(x * x + c, x), Q.of(c, x), Q.of(x * x + c, 2)],
          [
            `$\\frac{1}{2} \\left( ${x} + \\frac{${c}}{${x}} \\right) = ${answer.toLatex()}$. The terms that follow are rational too, but their limit $\\sqrt{${c}}$ is not.`,
            `$\\frac{1}{2} \\left( ${x} + \\frac{${c}}{${x}} \\right) = ${answer.toLatex()}$。之后各项也是有理数，但它们的极限 $\\sqrt{${c}}$ 不是。`,
          ],
        );
      },
    ),
  ],
);

const openCovers = topic(
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
        "The Heine-Borel theorem says that every open cover of a closed bounded interval has a finite subcover. To count how many intervals of a fixed length are needed, note that open intervals must overlap slightly, or the point between them is missed. So covering $[0, L]$ needs more than $L$ divided by the length.",
        "海涅–博雷尔定理说：闭有界区间的每个开覆盖都有有限子覆盖。要数需要多少个定长的区间，注意开区间之间必须稍有重叠，否则会漏掉它们之间的点。所以覆盖 $[0, L]$ 需要的个数要大于 $L$ 除以长度。",
      ],
      (rng) => {
        const L = rng.int(2, 30);
        const size = rng.pick([Q.of(1, 2), Q.of(1, 1), Q.of(2, 1), Q.of(3, 1), Q.of(5, 2), Q.of(4, 1)]);
        const answer = Math.floor(L / size.toNumber()) + 1;
        return ask(
          [
            `What is the smallest number of open intervals of length $${size.toLatex()}$ that can cover $[0, ${L}]$?`,
            `长度为 $${size.toLatex()}$ 的开区间，覆盖 $[0, ${L}]$ 最少需要多少个？`,
          ],
          answer,
          [answer - 1 > 0 ? answer - 1 : answer + 2, answer + 1, L, L + 1].filter((v) => v !== answer),
          [
            `The total length must exceed ${L}, since open intervals must overlap to leave no point out. So the number must exceed $${Q.of(L, 1).div(size).toLatex()}$, and the first whole number that does is ${answer}.`,
            `总长度必须大于 ${L}，因为开区间必须重叠才不漏点。所以个数必须大于 $${Q.of(L, 1).div(size).toLatex()}$，第一个满足的整数是 ${answer}。`,
          ],
        );
      },
    ),
    point(
      "a-cover-with-no-finite-subcover",
      ["A cover with no finite subcover", "没有有限子覆盖的覆盖"],
      [
        "The intervals $(\\frac{1}{n}, 2)$ for $n \\ge 2$ cover $(0, 1]$, yet no finite collection of them does, because the one with the largest $n$ misses points close to 0. So $(0, 1]$ is not compact. For any closed piece $[\\frac{1}{m}, 1]$, however, a single interval from the family is enough.",
        "区间 $(\\frac{1}{n}, 2)$（$n \\ge 2$）覆盖 $(0, 1]$，但其中任何有限个都不行，因为 $n$ 最大的那个漏掉了靠近 0 的点。所以 $(0, 1]$ 不是紧集。不过对任何闭的部分 $[\\frac{1}{m}, 1]$，这族中一个区间就够了。",
      ],
      (rng) => {
        const m = rng.int(2, 40);
        const answer = m + 1;
        return ask(
          [
            `Among the intervals $(\\frac{1}{n}, 2)$, what is the smallest $n$ whose interval contains all of $[\\frac{1}{${m}}, 1]$?`,
            `在区间 $(\\frac{1}{n}, 2)$ 中，包含整个 $[\\frac{1}{${m}}, 1]$ 的最小 $n$ 是多少？`,
          ],
          answer,
          [m, m + 2, m - 1, 2 * m],
          [
            `The interval must contain $\\frac{1}{${m}}$, so $\\frac{1}{n} < \\frac{1}{${m}}$. This needs $n > ${m}$, and $n = ${answer}$ is the first such number.`,
            `区间必须包含 $\\frac{1}{${m}}$，所以 $\\frac{1}{n} < \\frac{1}{${m}}$。这要求 $n > ${m}$，第一个这样的数是 $n = ${answer}$。`,
          ],
        );
      },
    ),
  ],
);

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
