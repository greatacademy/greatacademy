// Real Analysis: the rigorous treatment of sequences, series, limits, continuity,
// differentiation, integration and sequences of functions.

import type { Rng, TopicDef } from "@ga/content";
import { gcd, Q } from "@ga/subject-math";
import { analysisDrawings1 } from "../explanation-drawings-real-analysis-1.ts";

import { ask, choose, type Pair, point, same, topic } from "../university-kit.ts";

/** frac writes a reduced fraction in LaTeX. */
const frac = (a: number, b: number) => Q.of(a, b).toLatex();

/** eps draws a tolerance of the form one over k. */
const eps = (rng: Rng) => {
  const k = rng.int(2, 40);
  return { k, tex: `\\frac{1}{${k}}` };
};

/** signed writes a term with an explicit sign after another term, or nothing for zero. */
const signed = (v: number) => (v === 0 ? "" : v > 0 ? ` + ${v}` : ` - ${-v}`);

/** distance writes the distance of a variable from a number. */
const distance = (v: string, a: number) => (a === 0 ? `|${v}|` : a < 0 ? `|${v} + ${-a}|` : `|${v} - ${a}|`);

/** times writes a coefficient before a symbol, leaving out a coefficient of one. */
const times = (c: number, symbol: string) => (c === 1 ? symbol : c === -1 ? `-${symbol}` : `${c}${symbol}`);

const epsilonForSequences = topic(
  "the-epsilon-definition-for-sequences",
  ["The Epsilon Definition for Sequences", "数列极限的 ε 定义"],
  ["Find how far along a sequence stays within a given tolerance of its limit.", "求数列从第几项起与极限的距离保持在给定误差之内。"],
  ["proving-the-finite-limit-of-a-sequence"],
  [["proving-the-finite-limit-of-a-sequence", 0.5]],
  [
    point(
      "finding-n-for-a-reciprocal-sequence",
      ["Finding N for a reciprocal sequence", "求倒数型数列的 N"],
      [
        "A sequence converges to $L$ when, for every tolerance $\\varepsilon$, all terms from some index $N$ onward lie within $\\varepsilon$ of $L$. For a sequence of the form $L + \\frac{c}{n}$, the distance is $\\frac{c}{n}$, so the condition becomes $n > \\frac{c}{\\varepsilon}$. The strict inequality matters when that quotient is a whole number, since the index itself then just fails.",
        "数列收敛于 $L$，是指对每个误差 $\\varepsilon$，从某个下标 $N$ 起的所有项都在 $L$ 的 $\\varepsilon$ 范围之内。对形如 $L + \\frac{c}{n}$ 的数列，距离是 $\\frac{c}{n}$，所以条件变成 $n > \\frac{c}{\\varepsilon}$。当这个商是整数时，严格不等号很重要，因为这个下标本身恰好不满足。",
      ],
      (rng) => {
        const L = rng.int(-6, 9);
        const c = rng.int(2, 12);
        const { k, tex } = eps(rng);
        const answer = c * k + 1;
        return ask(
          [
            `Let $a_n = ${L === 0 ? "" : `${L} + `}\\frac{${c}}{n}$. What is the smallest $N$ with $${distance("a_n", L)} < ${tex}$ for all $n \\ge N$?`,
            `设 $a_n = ${L === 0 ? "" : `${L} + `}\\frac{${c}}{n}$。使所有 $n \\ge N$ 都满足 $${distance("a_n", L)} < ${tex}$ 的最小 $N$ 是多少？`,
          ],
          answer,
          [c * k, c + k, k + 1, 2 * c * k],
          [
            `The distance is $\\frac{${c}}{n}$, and it is below $${tex}$ exactly when $n > ${c * k}$, so the first such index is ${answer}.`,
            `距离是 $\\frac{${c}}{n}$，它小于 $${tex}$ 当且仅当 $n > ${c * k}$，所以第一个这样的下标是 ${answer}。`,
          ],
        );
      },
    ),
    point(
      "finding-n-for-a-geometric-sequence",
      ["Finding N for a geometric sequence", "求几何型数列的 N"],
      [
        "For a sequence $\\frac{1}{r^n}$ with $r > 1$, the distance from zero falls by a constant factor at every step, so the index needed grows only like $\\log \\frac{1}{\\varepsilon}$. Comparing with powers of $r$ gives the answer directly: the condition is $r^n > \\frac{1}{\\varepsilon}$, and $N$ is the exponent of the first power to satisfy it.",
        "对形如 $\\frac{1}{r^n}$ 且 $r > 1$ 的数列，它与零的距离每一步按固定比例减小，所以所需下标只像 $\\log \\frac{1}{\\varepsilon}$ 那样增长。与 $r$ 的幂比较就能直接得到答案：条件是 $r^n > \\frac{1}{\\varepsilon}$，第一个满足它的幂的指数就是 $N$。",
      ],
      (rng) => {
        const r = rng.int(2, 6);
        const k = rng.int(5, 900);
        let answer = 1;
        while (r ** answer <= k) answer++;
        return ask(
          [
            `Let $a_n = \\frac{1}{${r}^n}$. What is the smallest $N$ with $a_n < \\frac{1}{${k}}$ for all $n \\ge N$?`,
            `设 $a_n = \\frac{1}{${r}^n}$。使所有 $n \\ge N$ 都满足 $a_n < \\frac{1}{${k}}$ 的最小 $N$ 是多少？`,
          ],
          answer,
          [answer - 1 > 0 ? answer - 1 : answer + 2, answer + 1, k, Math.ceil(k / r)],
          [
            `We need $${r}^n > ${k}$. Here $${r}^{${answer - 1}} = ${r ** (answer - 1)}$ is not enough and $${r}^{${answer}} = ${r ** answer}$ is.`,
            `需要 $${r}^n > ${k}$。这里 $${r}^{${answer - 1}} = ${r ** (answer - 1)}$ 不够，而 $${r}^{${answer}} = ${r ** answer}$ 够了。`,
          ],
        );
      },
    ),
  ],
);

const suprema = topic(
  "suprema-of-sets-of-reals",
  ["Suprema of Sets of Reals", "实数集的上确界"],
  [
    "Find suprema and infima of sets defined by a sequence, and see when they are attained.",
    "求由数列定义的集合的上下确界，并判断是否取到。",
  ],
  ["supremum-and-infimum"],
  [["supremum-and-infimum", 0.5]],
  [
    point(
      "bounds-of-a-sequence-set",
      ["Bounds of a sequence set", "数列集合的界"],
      [
        "The set of values $a + \\frac{b}{n}$, for $b$ positive, falls towards $a$ as $n$ grows, so its largest element is at $n = 1$ and its infimum is $a$, which no term reaches. The set of values $a - \\frac{b}{n}$ rises instead, and the roles swap. Drawing a few terms settles which bound is an actual element and which is only a limit.",
        "当 $b$ 为正时，$a + \\frac{b}{n}$ 这些值随 $n$ 增大而下降趋向 $a$，所以最大元素在 $n = 1$ 处，下确界是 $a$，而没有一项能达到它。$a - \\frac{b}{n}$ 这些值则上升，两者的角色互换。画出几项，就能看清哪个界是真正的元素，哪个只是极限。",
      ],
      (rng) => {
        const a = rng.int(-6, 9);
        const b = rng.int(2, 12);
        const plus = rng.bool();
        const sup = rng.bool();
        const answer = plus ? (sup ? a + b : a) : sup ? a : a - b;
        const set = `\\{${a} ${plus ? "+" : "-"} \\frac{${b}}{n} : n \\ge 1\\}`;
        return ask(
          [`What is the ${sup ? "supremum" : "infimum"} of $${set}$?`, `$${set}$ 的${sup ? "上确界" : "下确界"}是多少？`],
          answer,
          [plus ? (sup ? a : a + b) : sup ? a - b : a, a + b / 2 === Math.floor(a + b / 2) ? a + b / 2 : a + 1, b, answer + 1],
          [
            plus
              ? `The values fall from ${a + b} towards ${a}, so the supremum is ${a + b} and the infimum is ${a}.`
              : `The values rise from ${a - b} towards ${a}, so the infimum is ${a - b} and the supremum is ${a}.`,
            plus
              ? `这些值从 ${a + b} 下降趋向 ${a}，所以上确界是 ${a + b}，下确界是 ${a}。`
              : `这些值从 ${a - b} 上升趋向 ${a}，所以下确界是 ${a - b}，上确界是 ${a}。`,
          ],
        );
      },
    ),
    point(
      "when-the-supremum-is-attained",
      ["When the supremum is attained", "上确界何时取到"],
      [
        "A supremum is the least upper bound, and it need not belong to the set. The set contains it exactly when the set has a largest element, which is then called the maximum. An interval that is open at its right end has a supremum but no maximum, however close its members come. This distinction is the reason why the completeness axiom speaks of suprema.",
        "上确界是最小上界，它不一定属于这个集合。集合包含它，当且仅当集合有最大元素，这时称之为最大值。右端开的区间有上确界但没有最大值，不管其中的元素多么接近它。正因为这一区别，完备性公理谈的是上确界。",
      ],
      (rng) => {
        const a = rng.int(-9, 6);
        const b = a + rng.int(2, 9);
        return choose(
          rng,
          ["Which of these sets contains its supremum?", "下列哪个集合包含它的上确界？"],
          same(`(${a}, ${b}]`),
          [same(`(${a}, ${b})`), same(`[${a}, ${b})`), same(`\\{${b} - \\frac{1}{n} : n \\ge 1\\}`)],
          [
            `All four have supremum ${b}, and only $(${a}, ${b}]$ contains it. The others come arbitrarily close without reaching it.`,
            `四个集合的上确界都是 ${b}，只有 $(${a}, ${b}]$ 包含它。其他集合可以任意接近它但达不到。`,
          ],
        );
      },
    ),
  ],
);

const monotoneConvergence = topic(
  "the-monotone-convergence-theorem",
  ["The Monotone Convergence Theorem", "单调收敛定理"],
  ["Use boundedness and monotonicity to find the limit of a recursive sequence.", "利用有界性和单调性求递推数列的极限。"],
  ["monotonic-sequences", "suprema-of-sets-of-reals"],
  [["monotonic-sequences", 0.5]],
  [
    point(
      "the-limit-of-a-linear-recursion",
      ["The limit of a linear recursion", "线性递推的极限"],
      [
        "A bounded monotone sequence converges, by the completeness of the real numbers. That guarantees a limit exists without naming it. Once the limit is known to exist, taking limits on both sides of the recursion gives an equation for it, because the shifted sequence has the same limit. Solving that equation before establishing convergence is a common logical slip, since a divergent recursion has fixed points too.",
        "由实数的完备性，有界单调数列收敛。这保证极限存在，但没有给出它的值。知道极限存在后，对递推式两边取极限，就得到关于它的方程，因为错后一项的数列有相同的极限。在证明收敛之前就解这个方程，是常见的逻辑错误，因为发散的递推也有不动点。",
      ],
      (rng) => {
        const k = rng.int(2, 9);
        const c = rng.int(1, 20);
        const answer = Q.of(c, k - 1);
        return ask(
          [
            `The sequence $a_{n+1} = \\frac{a_n + ${c}}{${k}}$ with $a_1 = 0$ is monotone and bounded. What is its limit?`,
            `数列 $a_{n+1} = \\frac{a_n + ${c}}{${k}}$，$a_1 = 0$，单调且有界。它的极限是多少？`,
          ],
          answer,
          [Q.of(c, k), Q.of(c), Q.of(c, k + 1), Q.of(k, c)],
          [
            `The limit $L$ satisfies $L = \\frac{L + ${c}}{${k}}$, so $${times(k - 1, "L")} = ${c}$ and $L = ${answer.toLatex()}$.`,
            `极限 $L$ 满足 $L = \\frac{L + ${c}}{${k}}$，所以 $${times(k - 1, "L")} = ${c}$，$L = ${answer.toLatex()}$。`,
          ],
        );
      },
    ),
    point(
      "the-limit-of-a-root-recursion",
      ["The limit of a root recursion", "根式递推的极限"],
      [
        "A recursion with a square root leads to a quadratic equation for the limit, and only one of its roots can be right. Every term of the sequence is positive, so the limit cannot be negative, and that discards the other root. Checking the sign in this way is the step that the equation alone does not provide, and it needs the fact that limits preserve weak inequalities.",
        "带平方根的递推得到关于极限的二次方程，而它的根中只有一个可能正确。数列的每一项都是正的，所以极限不可能是负数，这就排除了另一个根。这样检查符号，是方程本身提供不了的一步，它用到了极限保持非严格不等式这一事实。",
      ],
      (rng) => {
        const L = rng.int(2, 14);
        const b = rng.int(1, L - 1);
        const c = L * L - b * L;
        const other = b - L;
        return ask(
          [
            `The sequence $a_{n+1} = \\sqrt{${c} + ${times(b, "a_n")}}$ with $a_1 = 1$ converges. What is its limit?`,
            `数列 $a_{n+1} = \\sqrt{${c} + ${times(b, "a_n")}}$，$a_1 = 1$，收敛。它的极限是多少？`,
          ],
          L,
          [other, c, Math.floor(Math.sqrt(c)) === L ? L + 1 : Math.floor(Math.sqrt(c)), L + b],
          [
            `The limit satisfies $L^2 = ${c} + ${times(b, "L")}$, with roots ${L} and ${other}. The terms are positive, so the limit is ${L}.`,
            `极限满足 $L^2 = ${c} + ${times(b, "L")}$，两根是 ${L} 和 ${other}。各项都是正数，所以极限是 ${L}。`,
          ],
        );
      },
    ),
  ],
);

const subsequences = topic(
  "subsequences-and-the-bolzano-weierstrass-theorem",
  ["Subsequences and the Bolzano–Weierstrass Theorem", "子列与波尔查诺–魏尔斯特拉斯定理"],
  ["Find the limits of subsequences, and count the limit points of a sequence.", "求子列的极限，并数出数列的极限点个数。"],
  ["the-epsilon-definition-for-sequences"],
  [],
  [
    point(
      "the-limit-of-a-subsequence",
      ["The limit of a subsequence", "子列的极限"],
      [
        "A subsequence keeps some terms of a sequence, in order. If a sequence converges, all its subsequences share the limit. If it does not, different subsequences may have different limits, and two such limits prove divergence. The Bolzano–Weierstrass theorem adds that every bounded sequence has at least one convergent subsequence, even when the sequence itself oscillates for ever without settling down.",
        "子列按顺序保留数列的一些项。如果数列收敛，它的所有子列有相同的极限。如果不收敛，不同的子列可能有不同的极限，两个这样的极限就证明了发散。波尔查诺–魏尔斯特拉斯定理补充说，每个有界数列至少有一个收敛子列，即使数列本身永远振荡而不稳定下来。",
      ],
      (rng) => {
        const p = rng.int(2, 13);
        const q = rng.int(1, 12);
        const even = rng.bool();
        const answer = even ? p : -p;
        const seq = `a_n = (-1)^n \\cdot ${p} + \\frac{${q}}{n}`;
        return ask(
          [
            `Let $${seq}$. What is the limit of the subsequence of ${even ? "even" : "odd"}-indexed terms?`,
            `设 $${seq}$。下标为${even ? "偶数" : "奇数"}的子列的极限是多少？`,
          ],
          answer,
          [-answer, answer + q, 0, q],
          [
            `On ${even ? "even" : "odd"} indices the first term is ${answer} and the second tends to 0, so the limit is ${answer}.`,
            `在${even ? "偶数" : "奇数"}下标上，第一项是 ${answer}，第二项趋向 0，所以极限是 ${answer}。`,
          ],
        );
      },
    ),
    point(
      "counting-limit-points",
      ["Counting limit points", "数极限点"],
      [
        "A limit point of a sequence is a value that some subsequence converges to. For a periodic pattern plus a term that vanishes, each repeating value is approached along its own subsequence, so the limit points are exactly the values in the pattern. Adding the vanishing term changes each term but no limit point, and a convergent sequence has a single limit point.",
        "数列的极限点是某个子列收敛到的值。对周期模式加上一个趋于零的项，每个重复的值都沿着自己的子列被逼近，所以极限点恰好是模式中的那些值。加上趋于零的项改变了每一项，但不改变极限点；收敛数列只有一个极限点。",
      ],
      (rng) => {
        const m = rng.int(2, 34);
        return ask(
          [
            `Let $a_n = (n \\bmod ${m}) + \\frac{1}{n}$. How many limit points does this sequence have?`,
            `设 $a_n = (n \\bmod ${m}) + \\frac{1}{n}$。这个数列有多少个极限点？`,
          ],
          m,
          [m - 1, m + 1, 1, 2 * m],
          [
            `The remainders 0 to ${m - 1} each occur infinitely often, and the term $\\frac{1}{n}$ vanishes, so there are ${m} limit points.`,
            `余数 0 到 ${m - 1} 都无限次出现，而 $\\frac{1}{n}$ 趋向 0，所以有 ${m} 个极限点。`,
          ],
        );
      },
    ),
  ],
);

const cauchySequences = topic(
  "cauchy-sequences",
  ["Cauchy Sequences", "柯西数列"],
  ["Apply the Cauchy criterion without knowing the limit.", "在不知道极限的情况下应用柯西准则。"],
  ["subsequences-and-the-bolzano-weierstrass-theorem"],
  [["the-epsilon-definition-for-sequences", 0.3]],
  [
    point(
      "a-cauchy-index",
      ["Finding a Cauchy index", "求柯西下标"],
      [
        "A sequence is Cauchy when its terms eventually stay close to one another, whatever their indices. This makes no mention of a limit, which is the point: in the real numbers, completeness makes Cauchy sequences converge, so convergence can be shown without knowing the limit. For $\\frac{c}{n}$, terms with indices at least $N$ differ by less than $\\frac{c}{N}$, and this bound is the best one.",
        "如果数列的项最终彼此保持接近，不论下标是多少，这个数列就是柯西数列。这里完全没有提到极限，这正是关键：在实数中，完备性使柯西数列收敛，所以可以在不知道极限的情况下证明收敛。对 $\\frac{c}{n}$，下标不小于 $N$ 的项相差小于 $\\frac{c}{N}$，这个界是最好的。",
      ],
      (rng) => {
        const c = rng.int(2, 12);
        const { k, tex } = eps(rng);
        const answer = c * k;
        return ask(
          [
            `Let $a_n = \\frac{${c}}{n}$. What is the smallest $N$ with $|a_m - a_n| < ${tex}$ for all $m, n \\ge N$?`,
            `设 $a_n = \\frac{${c}}{n}$。使所有 $m, n \\ge N$ 都满足 $|a_m - a_n| < ${tex}$ 的最小 $N$ 是多少？`,
          ],
          answer,
          [answer + 1, c + k, 2 * answer, k],
          [
            `With $n = N$ and $m$ very large, the difference comes as close as we like to $\\frac{${c}}{N}$ without reaching it. So we need $\\frac{${c}}{N} \\le ${tex}$, which means $N \\ge ${answer}$.`,
            `取 $n = N$ 且 $m$ 很大时，差可以任意接近 $\\frac{${c}}{N}$ 但达不到。所以需要 $\\frac{${c}}{N} \\le ${tex}$，也就是 $N \\ge ${answer}$。`,
          ],
        );
      },
    ),
    point(
      "recognizing-a-sequence-that-is-not-cauchy",
      ["Recognizing what is not Cauchy", "识别非柯西数列"],
      [
        "Consecutive terms getting closer is not enough for a sequence to be Cauchy. The partial sums of the harmonic series have consecutive differences that vanish, yet the block $\\frac{1}{n} + \\cdots + \\frac{1}{2n}$ always adds to at least $\\frac{1}{2}$, so they are not Cauchy. Sums of terms like $\\frac{1}{k^2}$ or a geometric series have small tails, which is what the criterion actually requires.",
        "相邻项越来越接近，并不足以使数列成为柯西数列。调和级数的部分和相邻差趋于零，但 $\\frac{1}{n} + \\cdots + \\frac{1}{2n}$ 这一段的和总不小于 $\\frac{1}{2}$，所以它不是柯西数列。像 $\\frac{1}{k^2}$ 这样的项之和或几何级数的尾部很小，这才是这个准则真正要求的。",
      ],
      (rng) => {
        const c = rng.int(2, 19);
        const r = rng.int(2, 19);
        return choose(
          rng,
          ["Which of these sequences is not Cauchy?", "下列哪个数列不是柯西数列？"],
          same(`s_n = \\sum_{k=1}^{n} \\frac{${c}}{k}`),
          [
            same(`s_n = \\sum_{k=1}^{n} \\frac{${c}}{k^2}`),
            same(`s_n = \\sum_{k=1}^{n} \\frac{1}{${r}^k}`),
            same(`s_n = ${c} + \\frac{${r}}{n}`),
          ],
          [
            `$\\sum \\frac{${c}}{k}$ is a multiple of the harmonic series, whose blocks from $n$ to $2n$ never get small. The other three converge, so they are Cauchy.`,
            `$\\sum \\frac{${c}}{k}$ 是调和级数的倍数，它从 $n$ 到 $2n$ 的各段不会变小。另外三个收敛，所以是柯西数列。`,
          ],
        );
      },
    ),
  ],
);

const limsup = topic(
  "limit-superior-and-limit-inferior",
  ["Limit Superior and Limit Inferior", "上极限和下极限"],
  ["Compute the limits of the tail bounds of a sequence.", "计算数列尾部界的极限。"],
  ["subsequences-and-the-bolzano-weierstrass-theorem", "suprema-of-sets-of-reals"],
  [],
  [
    point(
      "limsup-and-liminf-of-an-oscillating-sequence",
      ["Oscillating sequences", "振荡数列"],
      [
        "The limit superior is the largest limit point of a bounded sequence, and the limit inferior is the smallest. Both always exist for a bounded sequence, unlike the limit, and they coincide exactly when the sequence converges. Terms that vanish do not affect either one. So for an oscillation around a centre, these two values are the centre plus or minus the size of the swing.",
        "上极限是有界数列最大的极限点，下极限是最小的。对有界数列，它们总是存在，这一点与极限不同，而且它们相等当且仅当数列收敛。趋于零的项对两者都没有影响。所以对围绕中心的振荡，这两个值就是中心加减振幅。",
      ],
      (rng) => {
        const p = rng.int(2, 10);
        const q = rng.int(-8, 8);
        const s = rng.int(1, 9);
        const upper = rng.bool();
        const answer = upper ? q + p : q - p;
        const seq = `a_n = (-1)^n \\cdot ${p}${signed(q)} + \\frac{${s}}{n}`;
        return ask(
          [
            `Let $${seq}$. What is $\\${upper ? "limsup" : "liminf"}_{n \\to \\infty} a_n$?`,
            `设 $${seq}$。$\\${upper ? "limsup" : "liminf"}_{n \\to \\infty} a_n$ 是多少？`,
          ],
          answer,
          [upper ? q - p : q + p, q, answer + s, p],
          [
            `The even terms tend to ${q + p} and the odd terms tend to ${q - p}, so the limit superior is ${q + p} and the limit inferior is ${q - p}.`,
            `偶数项趋向 ${q + p}，奇数项趋向 ${q - p}，所以上极限是 ${q + p}，下极限是 ${q - p}。`,
          ],
        );
      },
    ),
    point(
      "the-supremum-of-a-tail",
      ["The supremum of a tail", "尾部的上确界"],
      [
        "The limit superior is defined through tails: take the supremum of the terms from index n onward, then let n grow. As n grows, fewer terms remain, so these suprema form a falling sequence, which has a limit. For a sequence that decreases, the supremum of each tail is simply its first term. Computing one of these suprema helps to make the definition concrete.",
        "上极限通过尾部定义：取从下标 n 开始各项的上确界，再让 n 增大。n 增大时，剩下的项变少，所以这些上确界构成递减数列，它有极限。对递减数列，每个尾部的上确界就是它的第一项。算出其中一个上确界，有助于把定义具体化。",
      ],
      (rng) => {
        const c = rng.int(1, 9);
        const d = rng.int(1, 9);
        const n = rng.int(2, 12);
        const answer = Q.of(c).add(Q.of(d, n));
        return ask(
          [
            `Let $a_k = ${c} + \\frac{${d}}{k}$. What is $\\sup_{k \\ge ${n}} a_k$?`,
            `设 $a_k = ${c} + \\frac{${d}}{k}$。$\\sup_{k \\ge ${n}} a_k$ 是多少？`,
          ],
          answer,
          [Q.of(c), Q.of(c).add(Q.of(d, n + 1)), Q.of(d, n), Q.of(c + d)],
          [
            `The terms decrease, so the supremum of the tail is its first term, $${c} + \\frac{${d}}{${n}} = ${answer.toLatex()}$.`,
            `各项递减，所以尾部的上确界是它的第一项，$${c} + \\frac{${d}}{${n}} = ${answer.toLatex()}$。`,
          ],
        );
      },
    ),
  ],
);

const absoluteConvergence = topic(
  "absolute-and-conditional-convergence-of-series",
  ["Alternating Series: Convergence Type and Error", "交错级数的收敛类型和误差"],
  ["Classify an alternating series and bound its error.", "判断交错级数的收敛类型并估计误差。"],
  ["harmonic-series-and-p-series", "cauchy-sequences"],
  [["harmonic-series-and-p-series", 0.4]],
  [
    point(
      "classifying-an-alternating-p-series",
      ["Classifying an alternating series", "判断交错级数"],
      [
        "A series converges absolutely when the series of absolute values converges, and this implies convergence. It converges conditionally when it converges but the absolute values do not sum. For the alternating series $\\sum (-1)^{k} \\frac{1}{k^p}$, this gives three cases: absolute when $p > 1$, conditional when $0 < p \\le 1$, and divergence when $p \\le 0$, since the terms then fail to vanish.",
        "如果绝对值组成的级数收敛，原级数就绝对收敛，这蕴含着收敛。如果级数收敛但绝对值之和不收敛，就是条件收敛。对交错级数 $\\sum (-1)^{k} \\frac{1}{k^p}$，有三种情况：$p > 1$ 时绝对收敛；$0 < p \\le 1$ 时条件收敛；$p \\le 0$ 时发散，因为这时项不趋于零。",
      ],
      (rng) => {
        const b = rng.int(2, 7);
        const a = rng.pick([-1, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((v) => gcd(Math.abs(v), b) === 1));
        const p = a / b;
        const words: Record<string, Pair> = {
          absolute: ["It converges absolutely", "绝对收敛"],
          conditional: ["It converges conditionally", "条件收敛"],
          diverges: ["It diverges", "发散"],
        };
        const kind = p > 1 ? "absolute" : p > 0 ? "conditional" : "diverges";
        const shown = frac(a, b);
        const rest = Object.entries(words)
          .filter(([k]) => k !== kind)
          .map(([, w]) => w);
        return choose(
          rng,
          [
            `What does $\\sum_{k=1}^{\\infty} \\frac{(-1)^k}{k^{${shown}}}$ do?`,
            `$\\sum_{k=1}^{\\infty} \\frac{(-1)^k}{k^{${shown}}}$ 的敛散性如何？`,
          ],
          words[kind] as Pair,
          [...rest, ["It converges to zero", "收敛于零"]],
          [
            kind === "absolute"
              ? `The exponent $${shown}$ is above 1, so the absolute values form a convergent $p$-series.`
              : kind === "conditional"
                ? `The exponent $${shown}$ lies above 0 and not above 1. The terms fall to 0, so the series converges, but the absolute values diverge.`
                : `The exponent $${shown}$ is negative, so the terms grow and the series diverges.`,
            kind === "absolute"
              ? `指数 $${shown}$ 大于 1，所以绝对值构成收敛的 $p$ 级数。`
              : kind === "conditional"
                ? `指数 $${shown}$ 大于 0 且不超过 1。各项降到 0，所以级数收敛，但绝对值之和发散。`
                : `指数 $${shown}$ 是负数，所以各项增大，级数发散。`,
          ],
        );
      },
    ),
    point(
      "the-alternating-series-error",
      ["The alternating series error", "交错级数的误差"],
      [
        "For an alternating series whose terms fall steadily to zero, the partial sums swing around the limit, so the error of a partial sum is at most the size of the first term left out. This gives a usable guarantee that is rare among series. To reach a tolerance, find the first omitted term below it, and the partial sum that comes just before.",
        "对各项稳步降到零的交错级数，部分和围绕极限摆动，所以部分和的误差不超过第一个被略去的项。这样的保证在级数中很少见，而且很实用。要达到给定误差，找到第一个小于它的被略去的项，取它之前的部分和。",
      ],
      (rng) => {
        const p = rng.int(1, 3);
        const q = rng.int(5, 900);
        let answer = 1;
        while ((answer + 1) ** p <= q) answer++;
        const term = p === 1 ? "k" : `k^{${p}}`;
        const next = p === 1 ? "N + 1" : `(N + 1)^{${p}}`;
        return ask(
          [
            `For $\\sum_{k=1}^{\\infty} \\frac{(-1)^{k+1}}{${term}}$, what is the smallest $N$ for which the bound on the error of the partial sum $s_N$ is below $\\frac{1}{${q}}$?`,
            `对 $\\sum_{k=1}^{\\infty} \\frac{(-1)^{k+1}}{${term}}$，部分和 $s_N$ 的误差界小于 $\\frac{1}{${q}}$ 的最小 $N$ 是多少？`,
          ],
          answer,
          [answer + 1, answer > 1 ? answer - 1 : answer + 2, q, q + 1],
          [
            `The bound is the first omitted term, $\\frac{1}{${next}}$, so we need $${next} > ${q}$, which first holds for $N = ${answer}$.`,
            `误差界是第一个被略去的项 $\\frac{1}{${next}}$，所以需要 $${next} > ${q}$，它在 $N = ${answer}$ 时第一次成立。`,
          ],
        );
      },
    ),
  ],
);

const epsilonDelta = topic(
  "epsilon-delta-proofs-of-limits",
  ["Epsilon–Delta Proofs of Limits", "极限的 ε–δ 证明"],
  ["Find a delta that works for a given tolerance.", "对给定的误差求出合适的 δ。"],
  ["defining-continuity-at-a-point"],
  [],
  [
    point(
      "delta-for-a-linear-function",
      ["Delta for a linear function", "线性函数的 δ"],
      [
        "A limit statement says that for every tolerance $\\varepsilon$ on the output, there is a tolerance $\\delta$ on the input that guarantees it. For a linear function, the output distance equals the slope times the input distance exactly, so the largest $\\delta$ that works is $\\varepsilon$ divided by the size of the slope. The direction of the slope makes no difference, as only distances appear.",
        "极限命题是说，对输出上的每个误差 $\\varepsilon$，都有输入上的误差 $\\delta$ 能保证它。对线性函数，输出距离恰好等于斜率乘输入距离，所以可行的最大 $\\delta$ 是 $\\varepsilon$ 除以斜率的大小。斜率的方向没有影响，因为只涉及距离。",
      ],
      (rng) => {
        const m = rng.pick([-9, -7, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]);
        const c = rng.int(-8, 8);
        const a = rng.int(-5, 5);
        const { k, tex } = eps(rng);
        const answer = Q.of(1, k * Math.abs(m));
        return ask(
          [
            `Let $f(x) = ${m}x${signed(c)}$. What is the largest $\\delta$ such that $${distance("x", a)} < \\delta$ guarantees $|f(x) - f(${a})| < ${tex}$?`,
            `设 $f(x) = ${m}x${signed(c)}$。使 $${distance("x", a)} < \\delta$ 保证 $|f(x) - f(${a})| < ${tex}$ 的最大 $\\delta$ 是多少？`,
          ],
          answer,
          [Q.of(1, k), Q.of(Math.abs(m), k), Q.of(1, k + Math.abs(m)), Q.of(1, 2 * k * Math.abs(m))],
          [
            `$|f(x) - f(${a})|$ is exactly $${Math.abs(m)}$ times the input distance, so $\\delta = \\frac{1}{${Math.abs(m)}} \\cdot ${tex} = ${answer.toLatex()}$.`,
            `$|f(x) - f(${a})|$ 恰好是输入距离的 $${Math.abs(m)}$ 倍，所以 $\\delta = \\frac{1}{${Math.abs(m)}} \\cdot ${tex} = ${answer.toLatex()}$。`,
          ],
        );
      },
    ),
    point(
      "delta-for-a-square",
      ["Delta for the square function", "平方函数的 δ"],
      [
        "For a nonlinear function the slope changes, so a proof first restricts the input to a bounded region. For the square function near $a$, the difference of squares factors as the input distance times $x + a$, and restricting $x$ to within $1$ of $a$ bounds that factor by $2a + 1$. Then $\\delta$ is the smaller of $1$ and $\\varepsilon$ over that bound.",
        "对非线性函数，斜率会变化，所以证明时先把输入限制在有界区域内。对 $a$ 附近的平方函数，平方差分解成输入距离乘 $x + a$，把 $x$ 限制在距 $a$ 不超过 $1$ 的范围内后，这个因子不超过 $2a + 1$。于是 $\\delta$ 取 $1$ 和 $\\varepsilon$ 除以这个界中较小的那个。",
      ],
      (rng) => {
        const a = rng.int(1, 12);
        const { k, tex } = eps(rng);
        const bound = 2 * a + 1;
        const answer = Q.of(1, k * bound);
        return ask(
          [
            `To prove $\\lim_{x \\to ${a}} x^2 = ${a * a}$ for $\\varepsilon = ${tex}$, first take $|x - ${a}| \\le 1$. What value of $\\delta$ does the standard bound give?`,
            `要对 $\\varepsilon = ${tex}$ 证明 $\\lim_{x \\to ${a}} x^2 = ${a * a}$，先取 $|x - ${a}| \\le 1$。标准的估计给出的 $\\delta$ 是多少？`,
          ],
          answer,
          [Q.of(1, k), Q.of(1, 2 * a * k), Q.of(1, k * (a + 1)), Q.of(1)],
          [
            `With $|x - ${a}| \\le 1$ we have $|x + ${a}| \\le ${bound}$, so $|x^2 - ${a * a}| \\le ${bound}|x - ${a}|$. Thus $\\delta = \\frac{1}{${bound}} \\cdot ${tex} = ${answer.toLatex()}$, which is below 1.`,
            `由 $|x - ${a}| \\le 1$ 得 $|x + ${a}| \\le ${bound}$，所以 $|x^2 - ${a * a}| \\le ${bound}|x - ${a}|$。于是 $\\delta = \\frac{1}{${bound}} \\cdot ${tex} = ${answer.toLatex()}$，它小于 1。`,
          ],
        );
      },
    ),
  ],
);

const sequentialContinuity = topic(
  "the-sequential-criterion-for-continuity",
  ["The Sequential Criterion for Continuity", "连续性的序列准则"],
  ["Use sequences to evaluate limits and to detect jumps.", "用序列求极限并发现跳跃。"],
  ["epsilon-delta-proofs-of-limits", "the-epsilon-definition-for-sequences"],
  [],
  [
    point(
      "applying-a-continuous-function-to-a-sequence",
      ["Applying a continuous function", "作用连续函数"],
      [
        "A function is continuous at a point exactly when it sends every sequence converging to that point to a sequence converging to the value there. So a continuous function may be moved inside a limit of a sequence. This turns a limit that looks awkward into a single evaluation, once the limit of the inner sequence is known, and it fails at any jump in the function.",
        "函数在一点连续，当且仅当它把每个收敛到这一点的序列送到收敛到该点函数值的序列。所以连续函数可以移到序列极限的里面。这样，只要知道里面序列的极限，看起来麻烦的极限就变成了一次求值，而在函数的跳跃点这样做是不行的。",
      ],
      (rng) => {
        const a = rng.int(-5, 6);
        const b = rng.int(1, 9);
        const p = rng.int(1, 5);
        const c = rng.int(-6, 6);
        const answer = a * a + p * a + c;
        return ask(
          [
            `Let $f(x) = x^2 + ${times(p, "x")}${signed(c)}$ and $x_n = ${a} + \\frac{${b}}{n}$. What is $\\lim_{n \\to \\infty} f(x_n)$?`,
            `设 $f(x) = x^2 + ${times(p, "x")}${signed(c)}$，$x_n = ${a} + \\frac{${b}}{n}$。$\\lim_{n \\to \\infty} f(x_n)$ 是多少？`,
          ],
          answer,
          [a, answer + b, a * a + c, answer + p],
          [
            `$x_n$ tends to ${a} and $f$ is continuous, so the limit is $f(${a}) = ${answer}$.`,
            `$x_n$ 趋向 ${a}，而 $f$ 连续，所以极限是 $f(${a}) = ${answer}$。`,
          ],
        );
      },
    ),
    point(
      "two-sequences-reveal-a-jump",
      ["Two sequences reveal a jump", "两个序列揭示跳跃"],
      [
        "To prove that a function is not continuous, it is enough to find two sequences approaching the same point whose images approach different values. Sequences from the left and from the right do this at a jump, and their limits differ by the size of the jump. A single sequence that behaves well proves nothing, because continuity requires every sequence to behave.",
        "要证明函数不连续，只需找到两个趋于同一点的序列，它们的像趋于不同的值。在跳跃点，来自左边和右边的序列就能做到这一点，它们的极限之差就是跳跃的大小。一个表现良好的序列什么也证明不了，因为连续性要求每个序列都表现良好。",
      ],
      (rng) => {
        const p = rng.int(-9, 9);
        const q = p + rng.pick([-8, -5, -3, -2, 2, 3, 4, 6, 7, 9]);
        const a = rng.int(-4, 6);
        const r = rng.int(1, 4);
        const answer = Math.abs(q - p);
        return ask(
          [
            `Let $f(x) = ${p}$ for $x \\le ${a}$ and $f(x) = ${q}$ for $x > ${a}$. With $x_n = ${a} + \\frac{${r}}{n}$ and $y_n = ${a} - \\frac{${r}}{n}$, what is the absolute difference of $\\lim f(x_n)$ and $\\lim f(y_n)$?`,
            `设 $x \\le ${a}$ 时 $f(x) = ${p}$，$x > ${a}$ 时 $f(x) = ${q}$。取 $x_n = ${a} + \\frac{${r}}{n}$，$y_n = ${a} - \\frac{${r}}{n}$，$\\lim f(x_n)$ 和 $\\lim f(y_n)$ 之差的绝对值是多少？`,
          ],
          answer,
          [0, Math.abs(p) + Math.abs(q) === answer ? answer + 1 : Math.abs(p) + Math.abs(q), r, answer + 2 * r],
          [
            `$x_n$ stays to the right, so $f(x_n) \\to ${q}$. $y_n$ stays to the left, so $f(y_n) \\to ${p}$. The difference is ${answer}, so $f$ is not continuous at ${a}.`,
            `$x_n$ 留在右边，所以 $f(x_n) \\to ${q}$。$y_n$ 留在左边，所以 $f(y_n) \\to ${p}$。差是 ${answer}，所以 $f$ 在 ${a} 处不连续。`,
          ],
        );
      },
    ),
  ],
);

const metricSpaces = topic(
  "distances-in-metric-spaces",
  ["Distances in Metric Spaces", "度量空间中的距离"],
  [
    "Compute Euclidean, taxicab and maximum distances, and test membership of a ball.",
    "计算欧几里得距离、出租车距离和最大值距离，并判断点是否在球内。",
  ],
  ["suprema-of-sets-of-reals"],
  [],
  [
    {
      ...point(
        "three-distances-in-the-plane",
        ["Three distances in the plane", "平面上的三种距离"],
        [
          "A metric is any distance function that is positive apart from equal points, symmetric, and satisfies the triangle inequality. The plane has several natural ones: the Euclidean distance, the taxicab distance that adds the coordinate differences, and the maximum distance that takes the larger of them. They disagree on values, but they agree on which sequences converge, so they describe the same open sets.",
          "度量是这样的距离函数：不同点之间的距离为正，具有对称性，并满足三角不等式。平面上有几种自然的度量：欧几里得距离，把坐标差相加的出租车距离，以及取其中较大者的最大值距离。它们的值不同，但在哪些序列收敛上是一致的，所以描述的是相同的开集。",
        ],
        (rng) => {
          const s = rng.int(1, 6);
          const [u, v] = rng.pick([
            [3, 4],
            [4, 3],
            [5, 12],
            [12, 5],
            [8, 15],
            [15, 8],
          ]) as [number, number];
          const x = rng.int(-6, 6);
          const y = rng.int(-6, 6);
          const [dx, dy] = [s * u, s * v];
          const kind = rng.int(0, 2);
          const euclid = s * Math.round(Math.hypot(u, v));
          const answer = [euclid, dx + dy, Math.max(dx, dy)][kind] as number;
          const names: Pair[] = [
            ["Euclidean", "欧几里得"],
            ["taxicab", "出租车"],
            ["maximum", "最大值"],
          ];
          const name = names[kind] as Pair;
          const point2 = `(${x + dx}, ${y + dy})`;
          return ask(
            [
              `What is the ${name[0]} distance between $(${x}, ${y})$ and $${point2}$?`,
              `$(${x}, ${y})$ 和 $${point2}$ 之间的${name[1]}距离是多少？`,
            ],
            answer,
            [euclid, dx + dy, Math.max(dx, dy), Math.min(dx, dy)],
            [
              `The coordinate differences are ${dx} and ${dy}. The Euclidean distance is ${euclid}, the taxicab distance is ${dx + dy}, and the maximum distance is ${Math.max(dx, dy)}.`,
              `坐标差是 ${dx} 和 ${dy}。欧几里得距离是 ${euclid}，出租车距离是 ${dx + dy}，最大值距离是 ${Math.max(dx, dy)}。`,
            ],
          );
        },
      ),
      figure: analysisDrawings1["distances-in-metric-spaces#three-distances-in-the-plane"],
    },
    point(
      "membership-of-a-taxicab-ball",
      ["Membership of a taxicab ball", "出租车度量下的球"],
      [
        "An open ball is the set of points at distance less than the radius from the centre, and its shape depends on the metric. For the taxicab metric, a ball in the plane is a diamond, so a point can lie inside a Euclidean disc and outside the diamond of the same radius. To test a point, compute its distance in the given metric and compare, without relying on a picture of a round ball.",
        "开球是到中心的距离小于半径的点的集合，它的形状取决于度量。在出租车度量下，平面上的球是菱形，所以一个点可以在同半径的欧几里得圆内而在菱形外。要检验一个点，就用给定的度量算出距离再比较，不要依赖圆球的印象。",
      ],
      (rng) => {
        const r = rng.int(4, 12);
        const a = rng.int(1, r - 2);
        const b = rng.int(0, r - a - 1);
        const h = rng.int(-5, 5);
        const v = rng.int(-5, 5);
        const at = (x: number, y: number) => same(`(${x + h}, ${y + v})`);
        const centre = `(${h}, ${v})`;
        return choose(
          rng,
          [
            `Which of these points lies in the open taxicab ball of radius $${r}$ about $${centre}$?`,
            `下列哪个点在以 $${centre}$ 为中心、半径为 $${r}$ 的出租车度量开球内？`,
          ],
          at(a, b),
          [at(r, 1), at(r - 1, 2), at(r - 2, 3)],
          [
            `The taxicab distance of the point $(${a + h}, ${b + v})$ from the centre is ${a + b}, which is below ${r}. Each of the others has distance ${r + 1}.`,
            `点 $(${a + h}, ${b + v})$ 到中心的出租车距离是 ${a + b}，小于 ${r}。其他几个点的距离都是 ${r + 1}。`,
          ],
        );
      },
    ),
  ],
);

const openClosed = topic(
  "open-and-closed-sets-of-reals",
  ["Open and Closed Sets of Reals", "实数的开集和闭集"],
  ["Classify subsets of the line, and find limit points.", "判断直线上子集的类型，并求极限点。"],
  ["distances-in-metric-spaces"],
  [],
  [
    point(
      "classifying-a-subset-of-the-line",
      ["Classifying a subset of the line", "判断直线上的子集"],
      [
        "A set is open when each of its points has a small interval around it inside the set, and closed when it contains all its limit points. These are not opposites. A half-open interval is neither, since its included endpoint has no surrounding interval and its excluded endpoint is a limit point. The whole line and the empty set are both, and a finite set of points is closed.",
        "如果集合的每个点周围都有一个小区间在集合内，集合就是开的；如果它包含所有极限点，就是闭的。这两者并不对立。半开区间两者都不是，因为包含的端点周围没有区间，而不包含的端点是极限点。整条直线和空集既开又闭，有限点集是闭的。",
      ],
      (rng) => {
        const a = rng.int(-9, 6);
        const b = a + rng.int(1, 9);
        const cases: { tex: string; kind: "open" | "closed" | "neither" | "both" }[] = [
          { tex: `(${a}, ${b})`, kind: "open" },
          { tex: `[${a}, ${b}]`, kind: "closed" },
          { tex: `[${a}, ${b})`, kind: "neither" },
          { tex: `(${a}, ${b}]`, kind: "neither" },
          { tex: `(${a}, \\infty)`, kind: "open" },
          { tex: `(-\\infty, ${b}]`, kind: "closed" },
          { tex: `\\{${a}, ${b}\\}`, kind: "closed" },
          { tex: `\\{\\frac{1}{n} : n \\ge 1\\} \\cup (${b + 2}, ${b + 3})`, kind: "neither" },
        ];
        const pickCase = rng.pick(cases);
        const words: Record<string, Pair> = {
          open: ["Open and not closed", "开集但不是闭集"],
          closed: ["Closed and not open", "闭集但不是开集"],
          neither: ["Neither open nor closed", "既不开也不闭"],
          both: ["Both open and closed", "既开又闭"],
        };
        const reason: Record<string, Pair> = {
          open: [
            "Each point has a small interval around it in the set, and an endpoint outside the set is a limit point.",
            "每个点周围都有小区间在集合内，而集合外的端点是极限点。",
          ],
          closed: [
            "The set contains all its limit points, and some of its points have no surrounding interval in the set.",
            "集合包含所有极限点，而它的有些点周围没有区间在集合内。",
          ],
          neither: [
            "Some point of the set has no surrounding interval in the set, and some limit point is missing from the set.",
            "集合中有的点周围没有区间在集合内，也有的极限点不在集合中。",
          ],
          both: ["", ""],
        };
        return choose(
          rng,
          [`What kind of set is $${pickCase.tex}$?`, `$${pickCase.tex}$ 是哪种集合？`],
          words[pickCase.kind] as Pair,
          Object.entries(words)
            .filter(([k]) => k !== pickCase.kind)
            .map(([, w]) => w),
          reason[pickCase.kind] as Pair,
        );
      },
    ),
    point(
      "finding-a-limit-point",
      ["Finding a limit point", "求极限点"],
      [
        "A limit point of a set is a number with members of the set, other than itself, arbitrarily close to it. It need not belong to the set. The terms of a convergent sequence that take distinct values form a set whose only limit point is the limit, and each individual term is isolated, with a gap around it that contains no other member of the set.",
        "集合的极限点是这样的数：集合中有不同于它的元素任意接近它。它不一定属于这个集合。收敛数列中互不相同的项构成的集合，唯一的极限点就是数列的极限；每一项都是孤立的，周围有一段空隙，其中没有集合的其他元素。",
      ],
      (rng) => {
        const a = rng.int(-9, 12);
        const b = rng.int(2, 12);
        const half = Q.of(a).add(Q.of(b, 2));
        return choose(
          rng,
          [
            `Which number is a limit point of $\\{${a} + \\frac{${b}}{n} : n \\ge 1\\}$?`,
            `哪个数是 $\\{${a} + \\frac{${b}}{n} : n \\ge 1\\}$ 的极限点？`,
          ],
          same(`${a}`),
          [same(`${a + b}`), same(half.toLatex()), same(`${a - b}`)],
          [
            `The terms tend to ${a}, so members of the set come arbitrarily close to it. ${a + b} and $${half.toLatex()}$ are isolated members, and ${a - b} lies below the whole set.`,
            `各项趋向 ${a}，所以集合的元素可以任意接近它。${a + b} 和 $${half.toLatex()}$ 是孤立的元素，而 ${a - b} 在整个集合的下方。`,
          ],
        );
      },
    ),
  ],
);

const compactness = topic(
  "compactness-on-the-real-line",
  ["Compactness on the Real Line", "直线上的紧性"],
  ["Recognize compact sets, and use the extreme value theorem on them.", "识别紧集，并在其上使用最值定理。"],
  ["open-and-closed-sets-of-reals", "subsequences-and-the-bolzano-weierstrass-theorem"],
  [["open-and-closed-sets-of-reals", 0.4]],
  [
    point(
      "recognizing-a-compact-set",
      ["Recognizing a compact set", "识别紧集"],
      [
        "A set is compact when every open cover has a finite subcover. On the real line, the Heine–Borel theorem makes this concrete: a set is compact exactly when it is closed and bounded. So an unbounded closed set such as the integers fails, and a bounded open interval fails too, because its open cover by shrinking subintervals has no finite subcover. Both conditions are needed.",
        "如果每个开覆盖都有有限子覆盖，集合就是紧的。在实数直线上，海涅–博雷尔定理使之具体化：集合是紧的，当且仅当它是有界闭集。所以像整数集这样无界的闭集不是紧的，有界开区间也不是，因为用不断缩小的子区间作的开覆盖没有有限子覆盖。两个条件都是必需的。",
      ],
      (rng) => {
        const a = rng.int(-9, 6);
        const b = a + rng.int(1, 9);
        return choose(
          rng,
          ["Which of these sets is compact?", "下列哪个集合是紧的？"],
          same(`[${a}, ${b}]`),
          [same(`(${a}, ${b}]`), same(`[${a}, \\infty)`), same(`[${a}, ${b})`)],
          [
            `$[${a}, ${b}]$ is closed and bounded. The half-open intervals are not closed, and $[${a}, \\infty)$ is not bounded.`,
            `$[${a}, ${b}]$ 是有界闭集。半开区间不是闭的，而 $[${a}, \\infty)$ 无界。`,
          ],
        );
      },
    ),
    {
      ...point(
        "extreme-values-on-a-compact-interval",
        ["Extreme values on a compact interval", "紧区间上的最值"],
        [
          "A continuous function on a compact set attains a maximum and a minimum. This can fail on a set that is not compact, as with $\\frac{1}{x}$ on an open interval near zero. For a quadratic on a closed interval, the extreme values lie at the vertex, when it is inside the interval, or at the endpoints, so comparing those few values finds both of them.",
          "紧集上的连续函数能取到最大值和最小值。在非紧集上这可能不成立，比如 $\\frac{1}{x}$ 在靠近零的开区间上。对闭区间上的二次函数，最值在顶点（当它在区间内时）或端点取到，所以比较这几个值就能找到它们。",
        ],
        (rng) => {
          const c = rng.int(-5, 6);
          const d = rng.int(-6, 6);
          const a = rng.int(-7, 5);
          const b = a + rng.int(2, 9);
          const f = (x: number) => (x - c) * (x - c) + d;
          const max = rng.bool();
          const low = c >= a && c <= b ? d : Math.min(f(a), f(b));
          const high = Math.max(f(a), f(b));
          const answer = max ? high : low;
          const shift = c === 0 ? "x^2" : `(x ${c > 0 ? "-" : "+"} ${Math.abs(c)})^2`;
          return ask(
            [
              `What is the ${max ? "maximum" : "minimum"} of $f(x) = ${shift}${signed(d)}$ on $[${a}, ${b}]$?`,
              `$f(x) = ${shift}${signed(d)}$ 在 $[${a}, ${b}]$ 上的${max ? "最大值" : "最小值"}是多少？`,
            ],
            answer,
            [max ? low : high, f(a) === answer ? f(b) : f(a), d === answer ? d + 1 : d, answer + 1],
            [
              `The endpoints give ${f(a)} and ${f(b)}${c >= a && c <= b ? `, and the vertex at ${c} gives ${d}` : `, and the vertex at ${c} is outside the interval`}. So the ${max ? "maximum" : "minimum"} is ${answer}.`,
              `端点给出 ${f(a)} 和 ${f(b)}${c >= a && c <= b ? `，顶点 ${c} 处给出 ${d}` : `，顶点 ${c} 在区间外`}。所以${max ? "最大值" : "最小值"}是 ${answer}。`,
            ],
          );
        },
      ),
      figure: analysisDrawings1["compactness-on-the-real-line#extreme-values-on-a-compact-interval"],
    },
  ],
);

const uniformContinuity = topic(
  "uniform-continuity",
  ["Uniform Continuity", "一致连续"],
  ["Find one delta that works everywhere, and recognize when none exists.", "求处处适用的 δ，并识别不存在的情况。"],
  ["compactness-on-the-real-line", "epsilon-delta-proofs-of-limits"],
  [["epsilon-delta-proofs-of-limits", 0.5]],
  [
    point(
      "a-uniform-delta",
      ["A uniform delta", "一致的 δ"],
      [
        "Continuity allows $\\delta$ to depend on the point, whereas uniform continuity asks for a single $\\delta$ that works at every point of the domain. A bound on the slope gives one directly. If $|f(x) - f(y)| \\le L|x - y|$, then $\\delta = \\frac{\\varepsilon}{L}$ works everywhere. For the square function on a bounded interval, the steepest slope lies at the far end.",
        "连续性允许 $\\delta$ 依赖于点，而一致连续要求单个 $\\delta$ 在定义域的每一点都适用。斜率的界能直接给出它。如果 $|f(x) - f(y)| \\le L|x - y|$，那么 $\\delta = \\frac{\\varepsilon}{L}$ 处处适用。对有界区间上的平方函数，最陡的斜率在远端。",
      ],
      (rng) => {
        const B = rng.int(2, 20);
        const { k, tex } = eps(rng);
        const answer = Q.of(1, 2 * B * k);
        return ask(
          [
            `On $[0, ${B}]$, the bound $|x^2 - y^2| \\le ${2 * B}|x - y|$ holds. What $\\delta$ does it give for $\\varepsilon = ${tex}$?`,
            `在 $[0, ${B}]$ 上，$|x^2 - y^2| \\le ${2 * B}|x - y|$ 成立。对 $\\varepsilon = ${tex}$，它给出的 $\\delta$ 是多少？`,
          ],
          answer,
          [Q.of(1, k), Q.of(1, B * k), Q.of(2 * B, k), Q.of(1, 2 * B + k)],
          [
            `Dividing the tolerance by the constant gives $\\delta = \\frac{1}{${2 * B}} \\cdot ${tex} = ${answer.toLatex()}$, which works at every point of the interval.`,
            `用误差除以这个常数，得 $\\delta = \\frac{1}{${2 * B}} \\cdot ${tex} = ${answer.toLatex()}$，它在区间的每一点都适用。`,
          ],
        );
      },
    ),
    point(
      "what-fails-to-be-uniformly-continuous",
      ["What fails to be uniformly continuous", "什么不是一致连续的"],
      [
        "By the Heine–Cantor theorem, a continuous function on a compact set is uniformly continuous, so a failure needs a domain that is not compact. Even there, failure needs a growing slope. So $\\frac{1}{x}$ on an open interval at zero fails, and the square function on the whole line fails, whereas a bounded slope, as for a sine or a line, keeps uniform continuity on an unbounded domain.",
        "由海涅–康托尔定理，紧集上的连续函数是一致连续的，所以不一致连续只能发生在非紧的定义域上。即使在那里，也还需要斜率不断增大。所以开区间上靠近零的 $\\frac{1}{x}$ 不是一致连续的，整条直线上的平方函数也不是；而斜率有界时，比如正弦或直线，在无界定义域上仍是一致连续的。",
      ],
      (rng) => {
        const k = rng.int(2, 9);
        const B = rng.int(2, 9);
        const c = rng.int(1, 9);
        return choose(
          rng,
          ["Which of these functions is not uniformly continuous on the given domain?", "下列哪个函数在给定定义域上不是一致连续的？"],
          same(`${k}x^2 \\text{ on } \\mathbb{R}`),
          [
            same(`${k}x^2 \\text{ on } [0, ${B}]`),
            same(`\\sin(${k}x) \\text{ on } \\mathbb{R}`),
            same(`${k}x + ${c} \\text{ on } \\mathbb{R}`),
          ],
          [
            `On the whole line the slope of $${k}x^2$ grows without bound, so no single $\\delta$ works. The closed interval is compact, and the other two have bounded slopes.`,
            `在整条直线上，$${k}x^2$ 的斜率无限增大，所以没有单个 $\\delta$ 适用。闭区间是紧的，另外两个的斜率有界。`,
          ],
        );
      },
    ),
  ],
);

const differentiability = topic(
  "differentiability-in-analysis",
  ["Differentiability From the Definition", "由定义判断可导性"],
  ["Compare one-sided derivatives, and glue functions so that the result is differentiable.", "比较单侧导数，并拼接函数使结果可导。"],
  ["the-sequential-criterion-for-continuity"],
  [],
  [
    point(
      "one-sided-derivatives",
      ["One-sided derivatives", "单侧导数"],
      [
        "The derivative is a limit, so it exists only when the limits from the right and from the left agree. At the corner of an absolute value function, the difference quotient equals the slope on one side and its negative on the other. So both one-sided derivatives exist, and the function is continuous there, yet it has no derivative, which shows that continuity does not imply differentiability.",
        "导数是极限，所以只有当右极限和左极限一致时才存在。在绝对值函数的尖角处，差商在一侧等于斜率，在另一侧等于其相反数。所以两个单侧导数都存在，函数在那里也连续，但没有导数，这说明连续并不蕴含可导。",
      ],
      (rng) => {
        const p = rng.int(2, 12);
        const a = rng.int(-6, 8);
        const c = rng.int(-5, 5);
        const right = rng.bool();
        const answer = right ? p : -p;
        const inner = a < 0 ? `x + ${-a}` : a === 0 ? "x" : `x - ${a}`;
        return ask(
          [
            `Let $f(x) = ${p}|${inner}|${signed(c)}$. What is the ${right ? "right" : "left"}-hand derivative of $f$ at $x = ${a}$?`,
            `设 $f(x) = ${p}|${inner}|${signed(c)}$。$f$ 在 $x = ${a}$ 处的${right ? "右" : "左"}导数是多少？`,
          ],
          answer,
          [-answer, 0, c === answer ? answer + 1 : c, 2 * p],
          [
            `On the ${right ? "right" : "left"} of ${a}, the function is a line of slope ${answer}, so the difference quotient is constantly ${answer}.`,
            `在 ${a} 的${right ? "右" : "左"}边，函数是斜率为 ${answer} 的直线，所以差商恒为 ${answer}。`,
          ],
        );
      },
    ),
    {
      ...point(
        "gluing-two-pieces",
        ["Gluing two pieces", "拼接两段"],
        [
          "A piecewise function is differentiable at the joint when two conditions hold: the pieces meet, and they have the same slope there. The first gives continuity, which is necessary, and the second makes the one-sided derivatives agree. Matching only the slopes leaves a jump. For a line attached to a parabola, the conditions fix the line completely, as the tangent line to the parabola at the joint.",
          "分段函数在接点处可导，需要两个条件：两段相接，并且在那里斜率相同。前者给出连续性，这是必要的；后者使单侧导数一致。只让斜率相等会留下跳跃。对接在抛物线上的直线，这两个条件完全确定了这条直线，它就是抛物线在接点处的切线。",
        ],
        (rng) => {
          const a = rng.int(-6, 9);
          const b = rng.int(-5, 6);
          const asksSlope = rng.bool();
          const m = 2 * a + b;
          const c = -a * a;
          const parabola = `x^2${b === 0 ? "" : ` ${b > 0 ? "+" : "-"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}x`}`;
          return ask(
            [
              `Let $f(x) = ${parabola}$ for $x \\le ${a}$ and $f(x) = mx + c$ for $x > ${a}$. If $f$ is differentiable at ${a}, what is $${asksSlope ? "m" : "c"}$?`,
              `设 $x \\le ${a}$ 时 $f(x) = ${parabola}$，$x > ${a}$ 时 $f(x) = mx + c$。如果 $f$ 在 ${a} 处可导，$${asksSlope ? "m" : "c"}$ 是多少？`,
            ],
            asksSlope ? m : c,
            asksSlope ? [a + b, 2 * a, a * a + b * a, m + 1] : [a * a, m, a * a + b * a, c - 1],
            [
              `The slopes must match, so $m = 2(${a}) ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${m}$. The values must match too, so $c = ${a * a + b * a} - ${m < 0 ? `(${m})` : m} \\cdot ${a < 0 ? `(${a})` : a} = ${c}$.`,
              `斜率必须相等，所以 $m = 2(${a}) ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${m}$。值也必须相等，所以 $c = ${a * a + b * a} - ${m < 0 ? `(${m})` : m} \\cdot ${a < 0 ? `(${a})` : a} = ${c}$。`,
            ],
          );
        },
      ),
      figure: analysisDrawings1["differentiability-in-analysis#gluing-two-pieces"],
    },
  ],
);

const meanValueBounds = topic(
  "bounds-from-the-mean-value-theorem",
  ["Bounds From the Mean Value Theorem", "由中值定理得到的界"],
  ["Turn a bound on a derivative into a bound on a function's change.", "把导数的界转化为函数变化量的界。"],
  ["the-mean-value-theorem", "differentiability-in-analysis"],
  [["the-mean-value-theorem", 0.5]],
  [
    point(
      "the-largest-possible-value",
      ["The largest possible value", "可能的最大值"],
      [
        "The mean value theorem says that the change in a function over an interval equals its derivative at some interior point times the length. So a bound M on the derivative limits the change to M times the length. This is how analysis passes from information about slopes to information about values, and it holds even when the formula for the function is not known.",
        "中值定理说，函数在区间上的变化量等于它在某个内点的导数乘区间长度。所以导数的界 M 把变化量限制在 M 乘长度之内。分析学正是这样由斜率的信息得到值的信息，即使不知道函数的公式，这一点也成立。",
      ],
      (rng) => {
        const M = rng.int(2, 12);
        const a = rng.int(-5, 6);
        const b = a + rng.int(1, 9);
        const v = rng.int(-9, 9);
        const high = rng.bool();
        const answer = high ? v + M * (b - a) : v - M * (b - a);
        return ask(
          [
            `Suppose $f(${a}) = ${v}$ and $|f'(x)| \\le ${M}$ on $[${a}, ${b}]$. What is the ${high ? "largest" : "smallest"} possible value of $f(${b})$?`,
            `设 $f(${a}) = ${v}$，在 $[${a}, ${b}]$ 上 $|f'(x)| \\le ${M}$。$f(${b})$ 可能的${high ? "最大值" : "最小值"}是多少？`,
          ],
          answer,
          [high ? v - M * (b - a) : v + M * (b - a), v + (high ? M : -M), M * (b - a), v],
          [
            `The change is at most $${M} \\times ${b - a} = ${M * (b - a)}$ in size, so the ${high ? "largest" : "smallest"} value is ${answer}.`,
            `变化量的大小至多是 $${M} \\times ${b - a} = ${M * (b - a)}$，所以${high ? "最大值" : "最小值"}是 ${answer}。`,
          ],
        );
      },
    ),
    point(
      "the-best-lipschitz-constant",
      ["The best Lipschitz constant", "最佳利普希茨常数"],
      [
        "A function is Lipschitz with constant $L$ when $|f(x) - f(y)| \\le L|x - y|$ for all $x, y$. By the mean value theorem, the smallest such constant on an interval is the largest value of $|f'|$ there. For a power of $x$ on an interval that starts at zero, the derivative grows with x, so the largest slope occurs at the right end.",
        "如果对所有 $x, y$ 都有 $|f(x) - f(y)| \\le L|x - y|$，函数就是常数为 $L$ 的利普希茨函数。由中值定理，区间上最小的这种常数就是那里 $|f'|$ 的最大值。对从零开始的区间上的 $x$ 的幂，导数随 x 增大，所以最大斜率在右端取到。",
      ],
      (rng) => {
        const k = rng.int(2, 4);
        const B = rng.int(2, 12);
        const answer = k * B ** (k - 1);
        return ask(
          [
            `What is the smallest Lipschitz constant of $x^{${k}}$ on $[0, ${B}]$?`,
            `$x^{${k}}$ 在 $[0, ${B}]$ 上的最小利普希茨常数是多少？`,
          ],
          answer,
          [B ** k, B ** (k - 1), k * B, answer + k],
          [
            `The derivative $${k === 2 ? "2x" : `${k}x^{${k - 1}}`}$ is largest at $x = ${B}$, where it equals ${answer}.`,
            `导数 $${k === 2 ? "2x" : `${k}x^{${k - 1}}`}$ 在 $x = ${B}$ 处最大，等于 ${answer}。`,
          ],
        );
      },
    ),
  ],
);

const upperLowerSums = topic(
  "upper-and-lower-darboux-sums",
  ["Upper and Lower Darboux Sums", "达布上和与下和"],
  ["Compute upper and lower sums, and how fine a partition must be.", "计算上和与下和，以及分割要多细。"],
  ["defining-definite-integrals-using-left-and-right-riemann-sums", "suprema-of-sets-of-reals"],
  [],
  [
    point(
      "an-upper-sum-for-a-line",
      ["A sum for a line", "直线的和"],
      [
        "For a partition of an interval, the upper sum adds each width times the supremum of the function on that piece, and the lower sum uses the infimum. For an increasing function, the supremum lies at the right end of each piece and the infimum at the left end, so these sums are the right and left Riemann sums. Each refinement lowers the upper sum and raises the lower.",
        "对区间的一个分割，上和把每段的宽度乘函数在该段的上确界后相加，下和用下确界。对递增函数，上确界在每段的右端，下确界在左端，所以这些和就是右黎曼和与左黎曼和。每次加细都使上和减小、下和增大。",
      ],
      (rng) => {
        const m = rng.int(1, 6);
        const b = rng.int(2, 8);
        const n = rng.int(2, 10);
        const upper = rng.bool();
        const hits = upper ? (n * (n + 1)) / 2 : (n * (n - 1)) / 2;
        const answer = Q.of(m * b * b * hits, n * n);
        const other = Q.of(m * b * b * (upper ? (n * (n - 1)) / 2 : (n * (n + 1)) / 2), n * n);
        return ask(
          [
            `What is the ${upper ? "upper" : "lower"} sum of $f(x) = ${times(m, "x")}$ on $[0, ${b}]$ for the partition into ${n} equal parts?`,
            `$f(x) = ${times(m, "x")}$ 在 $[0, ${b}]$ 上，把区间分成 ${n} 等份，${upper ? "上和" : "下和"}是多少？`,
          ],
          answer,
          [other, Q.of(m * b * b, 2), answer.add(Q.of(1)), Q.of(m * b * b, n)],
          [
            `Each width is $${frac(b, n)}$, and $f$ increases, so the sum takes the ${upper ? "right" : "left"} ends: $\\frac{${m * b * b}}{${n * n}} \\times ${hits} = ${answer.toLatex()}$.`,
            `每段宽度是 $${frac(b, n)}$，$f$ 递增，所以取${upper ? "右" : "左"}端点：$\\frac{${m * b * b}}{${n * n}} \\times ${hits} = ${answer.toLatex()}$。`,
          ],
        );
      },
    ),
    point(
      "how-fine-a-partition-must-be",
      ["How fine a partition must be", "分割要多细"],
      [
        "For an increasing function on $[a, b]$ and $n$ equal parts, the difference between upper and lower sums telescopes to $(f(b) - f(a)) \\frac{b - a}{n}$. This shows at once that a monotone function is integrable, since the difference falls below any tolerance when $n$ is large. It also gives an exact count of parts needed for a tolerance $\\varepsilon$: $n > \\frac{(f(b) - f(a))(b - a)}{\\varepsilon}$.",
        "对 $[a, b]$ 上的递增函数和 $n$ 等分，上和与下和之差经过相消，等于 $(f(b) - f(a)) \\frac{b - a}{n}$。这立刻说明单调函数是可积的，因为 $n$ 很大时，这个差小于任何误差。它也准确给出误差 $\\varepsilon$ 所需的段数：$n > \\frac{(f(b) - f(a))(b - a)}{\\varepsilon}$。",
      ],
      (rng) => {
        const rise = rng.int(2, 15);
        const length = rng.int(1, 8);
        const { k, tex } = eps(rng);
        const answer = rise * length * k + 1;
        return ask(
          [
            `An increasing $f$ on an interval of length ${length} rises by ${rise} in total. What is the smallest number of equal parts that makes the upper and lower sums differ by less than ${`$${tex}$`}?`,
            `长度为 ${length} 的区间上的递增函数 $f$ 总共上升了 ${rise}。使上和与下和之差小于 ${`$${tex}$`} 的最少等份数是多少？`,
          ],
          answer,
          [answer - 1, rise * k + 1, length * k + 1, rise + length + k],
          [
            `The difference is $\\frac{${rise * length}}{n}$, and this is below ${`$${tex}$`} when $n > ${rise * length * k}$.`,
            `差是 $\\frac{${rise * length}}{n}$，当 $n > ${rise * length * k}$ 时它小于 ${`$${tex}$`}。`,
          ],
        );
      },
    ),
  ],
);

const integrability = topic(
  "riemann-integrability",
  ["Riemann Integrability", "黎曼可积性"],
  ["See that changing a point leaves an integral alone, and meet a function that fails.", "了解改变一点不影响积分，并认识不可积的函数。"],
  ["upper-and-lower-darboux-sums"],
  [["upper-and-lower-darboux-sums", 0.6]],
  [
    point(
      "a-step-function-with-a-changed-value",
      ["A step function with a changed value", "改变一个值的阶梯函数"],
      [
        "A function is integrable when its upper and lower integrals agree. A bounded function with finitely many discontinuities passes this test, because the bad points can be enclosed in pieces of tiny total width. So a jump does no harm, and changing the value of a function at a single point leaves the integral as it was, however large the new value may be.",
        "如果上积分和下积分相等，函数就是可积的。有有限个不连续点的有界函数能通过这个检验，因为这些坏点可以用总宽度极小的小段包起来。所以跳跃没有害处，改变函数在一点的值也不改变积分，不管新的值有多大。",
      ],
      (rng) => {
        const a = rng.int(0, 4);
        const m = a + rng.int(1, 4);
        const b = m + rng.int(1, 4);
        const p = rng.int(1, 9);
        const q = p === 9 ? 2 : p + rng.int(1, 9 - p);
        const big = rng.int(50, 99);
        const answer = p * (m - a) + q * (b - m);
        return ask(
          [
            `Let $f(x) = ${p}$ on $[${a}, ${m})$ and $f(x) = ${q}$ on $(${m}, ${b}]$, with $f(${m}) = ${big}$. What is $\\int_{${a}}^{${b}} f(x)\\,dx$?`,
            `设 $f(x)$ 在 $[${a}, ${m})$ 上等于 ${p}，在 $(${m}, ${b}]$ 上等于 ${q}，且 $f(${m}) = ${big}$。$\\int_{${a}}^{${b}} f(x)\\,dx$ 是多少？`,
          ],
          answer,
          [answer + big, p * (b - a), q * (b - a), p + q],
          [
            `A single point has no effect on the integral, so it is $${p} \\times ${m - a} + ${q} \\times ${b - m} = ${answer}$.`,
            `单独一点对积分没有影响，所以它是 $${p} \\times ${m - a} + ${q} \\times ${b - m} = ${answer}$。`,
          ],
        );
      },
    ),
    point(
      "upper-and-lower-integrals-that-disagree",
      ["Upper and lower integrals that disagree", "不相等的上下积分"],
      [
        "A function can fail to be integrable. Let it equal one value at rational numbers and another at irrational numbers. Both kinds of number occur in every piece of every partition, so each upper sum uses the larger value and each lower sum uses the smaller, whatever the partition. The two integrals therefore differ, and the Riemann integral does not exist, which motivated the Lebesgue integral.",
        "函数可能不可积。让它在有理数处取一个值，在无理数处取另一个值。这两种数在每个分割的每一段都出现，所以不管怎样分割，每个上和都用较大的值，每个下和都用较小的值。于是两个积分不相等，黎曼积分不存在，这正是勒贝格积分的动机之一。",
      ],
      (rng) => {
        const p = rng.int(0, 9);
        let q = rng.int(0, 9);
        if (q === p) q = p + 2;
        const a = rng.int(-3, 4);
        const b = a + rng.int(1, 6);
        const upper = rng.bool();
        const answer = (upper ? Math.max(p, q) : Math.min(p, q)) * (b - a);
        return ask(
          [
            `Let $f(x) = ${p}$ for rational $x$ and $f(x) = ${q}$ for irrational $x$. What is the ${upper ? "upper" : "lower"} integral of $f$ on $[${a}, ${b}]$?`,
            `设有理数 $x$ 处 $f(x) = ${p}$，无理数 $x$ 处 $f(x) = ${q}$。$f$ 在 $[${a}, ${b}]$ 上的${upper ? "上积分" : "下积分"}是多少？`,
          ],
          answer,
          [(upper ? Math.min(p, q) : Math.max(p, q)) * (b - a), (p + q) * (b - a), upper ? Math.max(p, q) : Math.min(p, q), answer + 1],
          [
            `Both kinds of number occur in every piece, so each ${upper ? "upper" : "lower"} sum uses the value ${upper ? Math.max(p, q) : Math.min(p, q)} throughout, which gives ${answer} over a length of ${b - a}.`,
            `两种数在每一段都出现，所以每个${upper ? "上和" : "下和"}都用 ${upper ? Math.max(p, q) : Math.min(p, q)} 这个值，长度为 ${b - a}，得 ${answer}。`,
          ],
        );
      },
    ),
  ],
);

const uniformConvergence = topic(
  "pointwise-and-uniform-convergence",
  ["Pointwise and Uniform Convergence", "逐点收敛和一致收敛"],
  ["Find a pointwise limit, and measure uniform convergence through the supremum.", "求逐点极限，并用上确界衡量一致收敛。"],
  ["uniform-continuity"],
  [],
  [
    point(
      "a-pointwise-limit",
      ["A pointwise limit", "逐点极限"],
      [
        "A sequence of functions converges pointwise when the values converge at each fixed $x$. This can break continuity: $x^n$ on the unit interval is continuous for every $n$, yet its limit is $0$ for $x < 1$ and $1$ at $x = 1$. Pointwise convergence lets the speed vary from point to point, and near $1$ here the convergence becomes slower and slower.",
        "如果在每个固定的 $x$ 处函数值都收敛，函数列就逐点收敛。这可能破坏连续性：单位区间上的 $x^n$ 对每个 $n$ 都连续，但它的极限在 $x < 1$ 时是 $0$，在 $x = 1$ 时是 $1$。逐点收敛允许速度随点而变，这里在 $1$ 附近，收敛越来越慢。",
      ],
      (rng) => {
        const c = rng.int(-8, 9);
        const d = rng.int(2, 9);
        const atOne = rng.bool();
        const numerator = rng.int(1, d - 1);
        const x = atOne ? "1" : frac(numerator, d);
        const answer = atOne ? 1 + c : c;
        return ask(
          [
            `Let $f_n(x) = x^n${signed(c)}$ on $[0, 1]$. What is $\\lim_{n \\to \\infty} f_n(${x})$?`,
            `设 $[0, 1]$ 上 $f_n(x) = x^n${signed(c)}$。$\\lim_{n \\to \\infty} f_n(${x})$ 是多少？`,
          ],
          answer,
          [atOne ? c : 1 + c, c + 2, 0 === answer ? 2 : 0, d],
          [
            atOne
              ? `At $x = 1$ every power equals 1, so the limit is ${answer}.`
              : `For $0 \\le x < 1$ the powers of $x$ tend to 0, so the limit is ${answer}.`,
            atOne
              ? `在 $x = 1$ 处，每个幂都等于 1，所以极限是 ${answer}。`
              : `当 $0 \\le x < 1$ 时，$x$ 的幂趋向 0，所以极限是 ${answer}。`,
          ],
        );
      },
    ),
    point(
      "uniform-convergence-through-the-supremum",
      ["Convergence through the supremum", "用上确界判断一致收敛"],
      [
        "Convergence is uniform when the supremum of the difference from the limit tends to zero, so that one index works for all points at once. Uniform limits of continuous functions are continuous, and this explains why $x^n$ cannot converge uniformly on the closed unit interval. To find an index, compute the supremum of the difference on the domain as a function of $n$ and solve the inequality.",
        "如果与极限之差的上确界趋于零，收敛就是一致的，这时一个下标同时适用于所有点。连续函数的一致极限是连续的，这解释了为什么 $x^n$ 在闭单位区间上不能一致收敛。要求下标，就把定义域上差的上确界写成 $n$ 的函数，再解不等式。",
      ],
      (rng) => {
        const b = rng.int(2, 15);
        const { k, tex } = eps(rng);
        const answer = b * k + 1;
        return ask(
          [
            `Let $f_n(x) = \\frac{x}{n}$ on $[0, ${b}]$, with limit 0. What is the smallest $N$ with $\\sup |f_n| < ${tex}$ for all $n \\ge N$?`,
            `设 $[0, ${b}]$ 上 $f_n(x) = \\frac{x}{n}$，极限是 0。使所有 $n \\ge N$ 都满足 $\\sup |f_n| < ${tex}$ 的最小 $N$ 是多少？`,
          ],
          answer,
          [b * k, k + 1, b + k, 2 * b * k],
          [
            `The supremum is at $x = ${b}$, and it equals $\\frac{${b}}{n}$. It is below $${tex}$ when $n > ${b * k}$, so $N = ${answer}$.`,
            `上确界在 $x = ${b}$ 处取到，等于 $\\frac{${b}}{n}$。当 $n > ${b * k}$ 时它小于 $${tex}$，所以 $N = ${answer}$。`,
          ],
        );
      },
    ),
  ],
);

const weierstrassTest = topic(
  "the-weierstrass-m-test",
  ["The Weierstrass M-Test", "魏尔斯特拉斯 M 判别法"],
  ["Bound a series of functions by a series of numbers, and estimate its tail.", "用数项级数控制函数项级数，并估计它的尾部。"],
  ["pointwise-and-uniform-convergence", "absolute-and-conditional-convergence-of-series"],
  [],
  [
    point(
      "a-bound-for-a-series-of-functions",
      ["A bound for a series of functions", "函数项级数的界"],
      [
        "The Weierstrass M-test says that if each function in a series is bounded in size by a number, and those numbers have a convergent sum, then the series converges uniformly. Each bound must hold on the whole domain. The sum of the bounds also limits the value of the series at every point, so the same step gives the convergence and a size estimate for the sum.",
        "魏尔斯特拉斯 M 判别法说，如果级数中每个函数的大小都被一个数控制，而这些数的和收敛，那么级数一致收敛。每个界都必须在整个定义域上成立。这些界的和也限制了级数在每一点的值，所以同一步既给出收敛性，也给出和的大小估计。",
      ],
      (rng) => {
        const c = rng.int(1, 9);
        const r = rng.int(2, 9);
        const answer = Q.of(c, r - 1);
        const coefficient = c === 1 ? "" : `${c}`;
        return ask(
          [
            `Using $M_k = \\frac{${c}}{${r}^k}$, what upper bound does the M-test give for $\\left|\\sum_{k=1}^{\\infty} \\frac{${coefficient}\\sin(kx)}{${r}^k}\\right|$?`,
            `取 $M_k = \\frac{${c}}{${r}^k}$，M 判别法给出的 $\\left|\\sum_{k=1}^{\\infty} \\frac{${coefficient}\\sin(kx)}{${r}^k}\\right|$ 的上界是多少？`,
          ],
          answer,
          [Q.of(c, r), Q.of(c), Q.of(c * r, r - 1), Q.of(1, r - 1).add(Q.of(c))],
          [
            `The size of $\\sin(kx)$ is at most 1, so the bound is the geometric sum $\\frac{${c}}{${r}} \\cdot \\frac{1}{1 - \\frac{1}{${r}}} = ${answer.toLatex()}$.`,
            `$\\sin(kx)$ 的大小至多是 1，所以界是几何级数的和 $\\frac{${c}}{${r}} \\cdot \\frac{1}{1 - \\frac{1}{${r}}} = ${answer.toLatex()}$。`,
          ],
        );
      },
    ),
    point(
      "the-tail-of-a-power-series",
      ["The tail of a power series", "幂级数的尾部"],
      [
        "A power series converges uniformly on any closed interval inside its interval of convergence, and the M-test shows it. On the interval where $|x| \\le \\frac{1}{r}$, each power is at most the matching power of $\\frac{1}{r}$. So the tail after $N$ terms is at most a geometric sum, and this bound does not depend on $x$, which is what uniformity means.",
        "幂级数在收敛区间内部的任何闭区间上一致收敛，M 判别法能说明这一点。在 $|x| \\le \\frac{1}{r}$ 的区间上，每个幂不超过 $\\frac{1}{r}$ 对应的幂。所以 $N$ 项之后的尾部不超过一个几何级数的和，而这个界与 $x$ 无关，这正是一致性的含义。",
      ],
      (rng) => {
        const r = rng.int(2, 6);
        const N = rng.int(1, 6);
        const answer = Q.of(1, r ** N * (r - 1));
        return ask(
          [
            `For $|x| \\le \\frac{1}{${r}}$, what does the M-test give as the bound on $\\left|\\sum_{k=${N + 1}}^{\\infty} x^k\\right|$?`,
            `当 $|x| \\le \\frac{1}{${r}}$ 时，M 判别法给出的 $\\left|\\sum_{k=${N + 1}}^{\\infty} x^k\\right|$ 的界是多少？`,
          ],
          answer,
          [Q.of(1, r ** (N + 1)), Q.of(1, r ** N), Q.of(1, r ** (N + 1) * (r - 1)), Q.of(1, r - 1)],
          [
            `The tail is at most $\\sum_{k=${N + 1}}^{\\infty} \\frac{1}{${r}^k}$, a geometric sum with first term $\\frac{1}{${r}^{${N + 1}}}$, and this equals $${answer.toLatex()}$.`,
            `尾部至多是 $\\sum_{k=${N + 1}}^{\\infty} \\frac{1}{${r}^k}$，这是首项为 $\\frac{1}{${r}^{${N + 1}}}$ 的几何级数，和是 $${answer.toLatex()}$。`,
          ],
        );
      },
    ),
  ],
);

const contractions = topic(
  "the-contraction-mapping-principle",
  ["The Contraction Mapping Principle", "压缩映射原理"],
  ["Find the fixed point of a contraction, and bound the error of iterating.", "求压缩映射的不动点，并估计迭代的误差。"],
  ["distances-in-metric-spaces", "cauchy-sequences"],
  [],
  [
    point(
      "the-fixed-point-of-a-contraction",
      ["The fixed point of a contraction", "压缩映射的不动点"],
      [
        "A contraction shrinks all distances by a constant factor below one. On a complete metric space it has exactly one fixed point, and iterating from any starting point converges to it, as the iterates form a Cauchy sequence. Completeness is essential, because otherwise the limit could be missing from the space. For a linear map, the fixed point comes straight from solving $x = f(x)$.",
        "压缩映射把所有距离按小于 1 的固定比例缩小。在完备度量空间上，它恰有一个不动点，从任何起点迭代都收敛到它，因为迭代序列是柯西数列。完备性至关重要，否则极限可能不在这个空间里。对线性映射，不动点可以直接由解 $x = f(x)$ 得到。",
      ],
      (rng) => {
        const q = rng.int(2, 9);
        const p = rng.pick(Array.from({ length: q - 1 }, (_, i) => i + 1).filter((v) => gcd(v, q) === 1));
        const c = rng.int(1, 12);
        const answer = Q.of(c * q, q - p);
        return ask(
          [
            `What is the fixed point of the contraction $f(x) = ${frac(p, q)}x + ${c}$?`,
            `压缩映射 $f(x) = ${frac(p, q)}x + ${c}$ 的不动点是多少？`,
          ],
          answer,
          [Q.of(c), Q.of(c * q, q + p), Q.of(c * p, q), Q.of(c * q, p)],
          [
            `Solving $x = ${frac(p, q)}x + ${c}$ gives $${frac(q - p, q)}x = ${c}$, so $x = ${answer.toLatex()}$.`,
            `解 $x = ${frac(p, q)}x + ${c}$，得 $${frac(q - p, q)}x = ${c}$，所以 $x = ${answer.toLatex()}$。`,
          ],
        );
      },
    ),
    point(
      "the-error-after-iterating",
      ["The error after iterating", "迭代后的误差"],
      [
        "Each application of a contraction with factor $L$ multiplies the distance to the fixed point by at most $L$. So after $n$ steps, the distance is at most $L^n$ times the first distance. The error therefore shrinks geometrically, and this is what makes fixed-point iteration practical. The smaller the factor, the fewer steps are needed, and the rate does not depend on the starting point.",
        "每应用一次比例为 $L$ 的压缩映射，到不动点的距离至多乘以 $L$。所以 $n$ 步之后，距离至多是最初距离的 $L^n$ 倍。因此误差按几何级数缩小，这正是不动点迭代实用的原因。比例越小，需要的步数越少，而这个速度与起点无关。",
      ],
      (rng) => {
        const q = rng.int(2, 6);
        const n = rng.int(2, 5);
        const d = rng.int(1, 12);
        const answer = Q.of(d, q ** n);
        return ask(
          [
            `A contraction has factor $\\frac{1}{${q}}$, and the starting point is at distance ${d} from the fixed point. What bound on the distance holds after ${n} steps?`,
            `压缩映射的比例是 $\\frac{1}{${q}}$，起点到不动点的距离是 ${d}。${n} 步之后，距离的界是多少？`,
          ],
          answer,
          [Q.of(d, q * n), Q.of(d, q), Q.of(d * n, q), Q.of(d, q ** (n + 1))],
          [
            `Each step multiplies the distance by at most $\\frac{1}{${q}}$, so after ${n} steps the bound is $${d} \\cdot \\frac{1}{${q}^{${n}}} = ${answer.toLatex()}$.`,
            `每步距离至多乘以 $\\frac{1}{${q}}$，所以 ${n} 步之后的界是 $${d} \\cdot \\frac{1}{${q}^{${n}}} = ${answer.toLatex()}$。`,
          ],
        );
      },
    ),
  ],
);

/** realAnalysisTopics holds the topics written for the Real Analysis course. */
export const realAnalysisTopics: readonly TopicDef[] = [
  epsilonForSequences,
  suprema,
  monotoneConvergence,
  subsequences,
  cauchySequences,
  limsup,
  absoluteConvergence,
  epsilonDelta,
  sequentialContinuity,
  metricSpaces,
  openClosed,
  compactness,
  uniformContinuity,
  differentiability,
  meanValueBounds,
  upperLowerSums,
  integrability,
  uniformConvergence,
  weierstrassTest,
  contractions,
];
