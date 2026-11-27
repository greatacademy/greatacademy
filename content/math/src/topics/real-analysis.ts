// Real Analysis: the rigorous treatment of sequences, series, limits, continuity,
// differentiation, integration and sequences of functions.

import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { gcd, Q } from "@ga/subject-math";
import { analysisDrawings1 } from "../explanation-drawings-real-analysis-1.ts";

import { numberProblem, why } from "../problems.ts";
import { choose, type Pair, point, same, topic } from "../university-kit.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";
import { type Step, walked } from "./calculus-i-differentiation.ts";

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

/** paren writes a number, in brackets when it is negative. */
const paren = (v: number) => (v < 0 ? `(${v})` : `${v}`);

/** Mistake is a value that a typical mistake produces, with what to say about it. */
export type Mistake = ReturnType<typeof why>;

/** Said is a step of a worked solution: its title and what it says, each in English and Chinese. */
export type Said = readonly [title: Pair, said: Pair];

/** solution writes worked steps followed by a check, in English and Chinese. */
export const solution = (parts: readonly Said[], check: Pair): Text =>
  walked(
    parts.map(([title, said]): Step => [title, t(said[0], said[1])]),
    t(check[0], check[1]),
  );

/** asPair turns a text back into an [English, Chinese] pair, for the helpers that take pairs. */
export const asPair = (x: Text): Pair => [x.en, x["zh-CN"]];

/** solved builds a number problem with a worked solution and what to say about its typical wrong answers. */
export function solved(prompt: Pair, answer: number | Q, mistakes: readonly Mistake[], worked: Text, figure?: Figure): Problem {
  const key = (v: number | Q) => (typeof v === "number" ? Q.of(v) : v).toLatex();
  const seen = new Set([key(answer)]);
  const kept = mistakes.filter((m) => !seen.has(key(m.value)) && Boolean(seen.add(key(m.value))));
  const problem = numberProblem({ prompt: t(prompt[0], prompt[1]), answer, mistakes: kept, solution: worked });
  return figure ? { ...problem, figure } : problem;
}

/** reason names a wrong option written as a formula, and says what is wrong with it. */
export const reason = (latex: string, en: string, zh: string): Reason => [`$${latex}$`, en, zh];

const epsilonForSequences = {
  ...topic(
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
          "A sequence converges to $L$ when, for every tolerance $\\varepsilon$, all terms from some index $N$ onward lie within $\\varepsilon$ of $L$. For a sequence of the form $L + \\frac{c}{n}$, the distance is $\\frac{c}{n}$, so the condition becomes $n > \\frac{c}{\\varepsilon}$. The strict inequality matters when that quotient is a whole number, since the index itself then just fails.\n\nFor $a_n = 5 + \\frac{3}{n}$ and $\\varepsilon = \\frac{1}{4}$, the condition $\\frac{3}{n} < \\frac{1}{4}$ means $n > 12$, so $N = 13$.\n\nCheck: $\\frac{3}{13} < \\frac{3}{12} = \\frac{1}{4}$, while at $n = 12$ the distance is exactly $\\frac{1}{4}$.\n\n> **Watch out.** The inequality is strict. When $\\frac{c}{\\varepsilon}$ is a whole number, that index gives a distance equal to $\\varepsilon$, which is not less than it, so $N$ is one more.",
          "数列收敛于 $L$，是指对每个误差 $\\varepsilon$，从某个下标 $N$ 起的所有项都在 $L$ 的 $\\varepsilon$ 范围之内。对形如 $L + \\frac{c}{n}$ 的数列，距离是 $\\frac{c}{n}$，所以条件变成 $n > \\frac{c}{\\varepsilon}$。当这个商是整数时，严格不等号很重要，因为这个下标本身恰好不满足。\n\n对 $a_n = 5 + \\frac{3}{n}$ 和 $\\varepsilon = \\frac{1}{4}$，条件 $\\frac{3}{n} < \\frac{1}{4}$ 就是 $n > 12$，所以 $N = 13$。\n\n检验：$\\frac{3}{13} < \\frac{3}{12} = \\frac{1}{4}$，而 $n = 12$ 时距离恰好是 $\\frac{1}{4}$。\n\n> **注意。** 不等号是严格的。当 $\\frac{c}{\\varepsilon}$ 是整数时，这个下标给出的距离等于 $\\varepsilon$，并不小于它，所以 $N$ 要再加一。",
        ],
        (rng) => {
          const L = rng.int(-6, 9);
          const c = rng.int(2, 12);
          const { k, tex } = eps(rng);
          const answer = c * k + 1;
          return solved(
            [
              `Let $a_n = ${L === 0 ? "" : `${L} + `}\\frac{${c}}{n}$. What is the smallest $N$ with $${distance("a_n", L)} < ${tex}$ for all $n \\ge N$?`,
              `设 $a_n = ${L === 0 ? "" : `${L} + `}\\frac{${c}}{n}$。使所有 $n \\ge N$ 都满足 $${distance("a_n", L)} < ${tex}$ 的最小 $N$ 是多少？`,
            ],
            answer,
            [
              why(
                c * k,
                `At $n = ${c * k}$ the distance is exactly $${tex}$, which is not less than $${tex}$.`,
                `$n = ${c * k}$ 时距离恰好是 $${tex}$，并不小于 $${tex}$。`,
              ),
              why(
                c + k,
                `That adds $${c}$ and $${k}$; the condition $\\frac{${c}}{n} < ${tex}$ means $n > ${c} \\times ${k}$.`,
                `这是把 $${c}$ 和 $${k}$ 相加；条件 $\\frac{${c}}{n} < ${tex}$ 是 $n > ${c} \\times ${k}$。`,
              ),
              why(
                k + 1,
                `That treats the distance as $\\frac{1}{n}$; it is $\\frac{${c}}{n}$.`,
                `这是把距离当成了 $\\frac{1}{n}$；它是 $\\frac{${c}}{n}$。`,
              ),
              why(
                2 * c * k,
                `That index works, but it is not the smallest: every $n > ${c * k}$ already works.`,
                `这个下标可行，但不是最小的：每个 $n > ${c * k}$ 都已经可行。`,
              ),
            ],
            solution(
              [
                [
                  ["Write the distance", "写出距离"],
                  [`$${distance("a_n", L)} = \\frac{${c}}{n}$.`, `$${distance("a_n", L)} = \\frac{${c}}{n}$。`],
                ],
                [
                  ["Solve the inequality", "解不等式"],
                  [
                    `$\\frac{${c}}{n} < ${tex}$ exactly when $n > ${c} \\times ${k} = ${c * k}$, so the smallest index is $N = ${answer}$.`,
                    `$\\frac{${c}}{n} < ${tex}$ 当且仅当 $n > ${c} \\times ${k} = ${c * k}$，所以最小的下标是 $N = ${answer}$。`,
                  ],
                ],
              ],
              [
                `At $n = ${answer}$ the distance is $\\frac{${c}}{${answer}} < \\frac{${c}}{${c * k}} = ${tex}$, while at $n = ${c * k}$ it equals $${tex}$.`,
                `$n = ${answer}$ 时距离是 $\\frac{${c}}{${answer}} < \\frac{${c}}{${c * k}} = ${tex}$，而 $n = ${c * k}$ 时它等于 $${tex}$。`,
              ],
            ),
          );
        },
      ),
      point(
        "finding-n-for-a-geometric-sequence",
        ["Finding N for a geometric sequence", "求几何型数列的 N"],
        [
          "For a sequence $\\frac{1}{r^n}$ with $r > 1$, the distance from zero falls by a constant factor at every step, so the index needed grows only like $\\log \\frac{1}{\\varepsilon}$. Comparing with powers of $r$ gives the answer directly: the condition is $r^n > \\frac{1}{\\varepsilon}$, and $N$ is the exponent of the first power to satisfy it.\n\nFor $a_n = \\frac{1}{3^n}$ and the tolerance $\\frac{1}{50}$: $3^3 = 27$ is not above $50$, and $3^4 = 81$ is, so $N = 4$.\n\nCheck: $\\frac{1}{81} < \\frac{1}{50}$, while $\\frac{1}{27} > \\frac{1}{50}$.\n\n> **Watch out.** $N$ is the exponent, not the power: here $N = 4$, not $81$. And the comparison is strict, so a power equal to $\\frac{1}{\\varepsilon}$ is not enough.",
          "对形如 $\\frac{1}{r^n}$ 且 $r > 1$ 的数列，它与零的距离每一步按固定比例减小，所以所需下标只像 $\\log \\frac{1}{\\varepsilon}$ 那样增长。与 $r$ 的幂比较就能直接得到答案：条件是 $r^n > \\frac{1}{\\varepsilon}$，第一个满足它的幂的指数就是 $N$。\n\n对 $a_n = \\frac{1}{3^n}$ 和误差 $\\frac{1}{50}$：$3^3 = 27$ 不大于 $50$，而 $3^4 = 81$ 大于它，所以 $N = 4$。\n\n检验：$\\frac{1}{81} < \\frac{1}{50}$，而 $\\frac{1}{27} > \\frac{1}{50}$。\n\n> **注意。** $N$ 是指数，不是幂：这里 $N = 4$，而不是 $81$。而且比较是严格的，等于 $\\frac{1}{\\varepsilon}$ 的幂还不够。",
        ],
        (rng) => {
          const r = rng.int(2, 6);
          const k = rng.int(5, 900);
          let answer = 1;
          while (r ** answer <= k) answer++;
          const power = (e: number) => (e === 1 ? `${r}` : `${r}^{${e}} = ${r ** e}`);
          return solved(
            [
              `Let $a_n = \\frac{1}{${r}^n}$. What is the smallest $N$ with $a_n < \\frac{1}{${k}}$ for all $n \\ge N$?`,
              `设 $a_n = \\frac{1}{${r}^n}$。使所有 $n \\ge N$ 都满足 $a_n < \\frac{1}{${k}}$ 的最小 $N$ 是多少？`,
            ],
            answer,
            [
              answer > 1
                ? why(
                    answer - 1,
                    `At $n = ${answer - 1}$ the term is $\\frac{1}{${r ** (answer - 1)}}$, which is not below $\\frac{1}{${k}}$.`,
                    `$n = ${answer - 1}$ 时这一项是 $\\frac{1}{${r ** (answer - 1)}}$，不小于 $\\frac{1}{${k}}$。`,
                  )
                : why(answer + 2, "That index works, but it is not the smallest.", "这个下标可行，但不是最小的。"),
              why(
                answer + 1,
                `That index works, but $N = ${answer}$ already does: $\\frac{1}{${r ** answer}} < \\frac{1}{${k}}$.`,
                `这个下标可行，但 $N = ${answer}$ 已经可行：$\\frac{1}{${r ** answer}} < \\frac{1}{${k}}$。`,
              ),
              why(
                k,
                `That is the reciprocal of the tolerance, not an index; the terms shrink by a factor of $${r}$ at every step, so far fewer are needed.`,
                `这是误差的倒数，而不是下标；各项每一步缩小为原来的 $\\frac{1}{${r}}$，所需的项少得多。`,
              ),
              why(
                Math.ceil(k / r),
                `That divides $${k}$ by $${r}$; the condition $${r}^n > ${k}$ compares powers of $${r}$.`,
                `这是用 $${k}$ 除以 $${r}$；条件 $${r}^n > ${k}$ 比较的是 $${r}$ 的幂。`,
              ),
            ],
            solution(
              [
                [
                  ["Turn the condition into powers", "把条件化成幂"],
                  [
                    `$\\frac{1}{${r}^n} < \\frac{1}{${k}}$ exactly when $${r}^n > ${k}$.`,
                    `$\\frac{1}{${r}^n} < \\frac{1}{${k}}$ 当且仅当 $${r}^n > ${k}$。`,
                  ],
                ],
                [
                  ["Compare the powers", "比较各次幂"],
                  [
                    `$${power(answer)}$ is the first power above $${k}$${answer > 1 ? `, since $${power(answer - 1)}$ is not` : ""}, so $N = ${answer}$.`,
                    `$${power(answer)}$ 是第一个大于 $${k}$ 的幂${answer > 1 ? `，因为 $${power(answer - 1)}$ 不大于它` : ""}，所以 $N = ${answer}$。`,
                  ],
                ],
              ],
              [
                `The terms only shrink as $n$ grows, so every $n \\ge ${answer}$ has $a_n \\le \\frac{1}{${r ** answer}} < \\frac{1}{${k}}$.`,
                `各项随 $n$ 增大而减小，所以每个 $n \\ge ${answer}$ 都有 $a_n \\le \\frac{1}{${r ** answer}} < \\frac{1}{${k}}$。`,
              ],
            ),
          );
        },
      ),
    ],
  ),
  intro: t(
    "Let $a_n = 3 + \\frac{2}{n}$ and $\\varepsilon = \\frac{1}{10}$. The distance from the limit $3$ is $\\frac{2}{n}$, and $\\frac{2}{n} < \\frac{1}{10}$ exactly when $n > 20$, so every term from $N = 21$ on lies within $\\varepsilon$ of $3$.\n\nCheck: $\\frac{2}{21} < \\frac{2}{20} = \\frac{1}{10}$, while $a_{20}$ is exactly $\\frac{1}{10}$ away from $3$.\n\nIn this lesson we find, for a given tolerance, the index from which a sequence stays within it of its limit.",
    "设 $a_n = 3 + \\frac{2}{n}$，$\\varepsilon = \\frac{1}{10}$。到极限 $3$ 的距离是 $\\frac{2}{n}$，而 $\\frac{2}{n} < \\frac{1}{10}$ 当且仅当 $n > 20$，所以从 $N = 21$ 起的每一项都在 $3$ 的 $\\varepsilon$ 范围之内。\n\n检验：$\\frac{2}{21} < \\frac{2}{20} = \\frac{1}{10}$，而 $a_{20}$ 与 $3$ 的距离恰好是 $\\frac{1}{10}$。\n\n本课我们对给定的误差，求数列从第几项起与极限的距离保持在误差之内。",
  ),
};

const suprema = {
  ...topic(
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
          "The set of values $a + \\frac{b}{n}$, for $b$ positive, falls towards $a$ as $n$ grows, so its largest element is at $n = 1$ and its infimum is $a$, which no term reaches. The set of values $a - \\frac{b}{n}$ rises instead, and the roles swap. Drawing a few terms settles which bound is an actual element and which is only a limit.\n\nFor $\\{4 - \\frac{6}{n} : n \\ge 1\\}$ the terms are $-2, 1, 2, \\dots$, rising towards $4$. The infimum is the first term $-2$, and the supremum is $4$, which no term reaches.\n\nCheck: every term is below $4$, and $4 - \\frac{6}{n} > 4 - \\varepsilon$ once $n > \\frac{6}{\\varepsilon}$, so no number below $4$ is an upper bound.\n\n> **Watch out.** The bound at $n = 1$ is $a + b$ or $a - b$, not $b$ alone. The other bound is $a$, the limit of the terms, even though no term equals it.",
          "当 $b$ 为正时，$a + \\frac{b}{n}$ 这些值随 $n$ 增大而下降趋向 $a$，所以最大元素在 $n = 1$ 处，下确界是 $a$，而没有一项能达到它。$a - \\frac{b}{n}$ 这些值则上升，两者的角色互换。画出几项，就能看清哪个界是真正的元素，哪个只是极限。\n\n对 $\\{4 - \\frac{6}{n} : n \\ge 1\\}$，各项是 $-2, 1, 2, \\dots$，上升趋向 $4$。下确界是第一项 $-2$，上确界是 $4$，没有一项能达到它。\n\n检验：每一项都小于 $4$，而当 $n > \\frac{6}{\\varepsilon}$ 时 $4 - \\frac{6}{n} > 4 - \\varepsilon$，所以小于 $4$ 的数都不是上界。\n\n> **注意。** $n = 1$ 处的界是 $a + b$ 或 $a - b$，而不是 $b$。另一个界是各项的极限 $a$，尽管没有一项等于它。",
        ],
        (rng) => {
          const a = rng.int(-6, 9);
          const b = rng.int(2, 12);
          const plus = rng.bool();
          const sup = rng.bool();
          const answer = plus ? (sup ? a + b : a) : sup ? a : a - b;
          const set = `\\{${a} ${plus ? "+" : "-"} \\frac{${b}}{n} : n \\ge 1\\}`;
          const other = plus ? (sup ? a : a + b) : sup ? a - b : a;
          const middle = a + b / 2 === Math.floor(a + b / 2) ? a + b / 2 : a + 1;
          const term = (n: number) =>
            Q.of(a)
              .add(Q.of(plus ? b : -b, n))
              .toLatex();
          const first = plus ? a + b : a - b;
          return solved(
            [`What is the ${sup ? "supremum" : "infimum"} of $${set}$?`, `$${set}$ 的${sup ? "上确界" : "下确界"}是多少？`],
            answer,
            [
              why(
                other,
                `That is the ${sup ? "infimum" : "supremum"}, the other bound of the set.`,
                `这是${sup ? "下确界" : "上确界"}，即集合的另一个界。`,
              ),
              why(
                middle,
                plus
                  ? `$${middle}$ lies between the infimum $${a}$ and the supremum $${a + b}$, so it is neither bound.`
                  : `$${middle}$ is above every term, so it is ${sup ? `an upper bound, but not the least one` : "not a lower bound"}.`,
                plus
                  ? `$${middle}$ 在下确界 $${a}$ 和上确界 $${a + b}$ 之间，所以两个界都不是。`
                  : `$${middle}$ 比每一项都大，所以它${sup ? "是上界，但不是最小上界" : "不是下界"}。`,
              ),
              why(
                b,
                `That is the numerator $${b}$ alone; the bounds of the set are $${a}$ and $${first}$.`,
                `这只是分子 $${b}$；集合的界是 $${a}$ 和 $${first}$。`,
              ),
              why(
                answer + 1,
                sup
                  ? `$${answer + 1}$ is an upper bound, but the smaller number $${answer}$ is one too.`
                  : `$${answer + 1}$ is not a lower bound: some terms lie below it.`,
                sup ? `$${answer + 1}$ 是上界，但更小的 $${answer}$ 也是上界。` : `$${answer + 1}$ 不是下界：有些项比它小。`,
              ),
            ],
            solution(
              [
                [
                  ["List the first terms", "列出前几项"],
                  [
                    `$n = 1, 2, 3$ give $${term(1)}, ${term(2)}, ${term(3)}$, ${plus ? "falling" : "rising"} towards $${a}$.`,
                    `$n = 1, 2, 3$ 给出 $${term(1)}, ${term(2)}, ${term(3)}$，${plus ? "下降" : "上升"}趋向 $${a}$。`,
                  ],
                ],
                [
                  ["Read off the bounds", "读出界"],
                  [
                    `The first term $${first}$ is the ${plus ? "largest" : "smallest"}, so the ${plus ? "supremum" : "infimum"} is $${first}$. The terms come arbitrarily close to $${a}$ without reaching it, so the ${plus ? "infimum" : "supremum"} is $${a}$. The ${sup ? "supremum" : "infimum"} is $${answer}$.`,
                    `第一项 $${first}$ 是${plus ? "最大" : "最小"}的，所以${plus ? "上确界" : "下确界"}是 $${first}$。各项任意接近 $${a}$ 但达不到它，所以${plus ? "下确界" : "上确界"}是 $${a}$。所求的${sup ? "上确界" : "下确界"}是 $${answer}$。`,
                  ],
                ],
              ],
              [
                `Every term $${a} ${plus ? "+" : "-"} \\frac{${b}}{n}$ lies in $${plus ? `(${a}, ${a + b}]` : `[${a - b}, ${a})`}$, and $\\frac{${b}}{n}$ falls below any positive number as $n$ grows.`,
                `每一项 $${a} ${plus ? "+" : "-"} \\frac{${b}}{n}$ 都在 $${plus ? `(${a}, ${a + b}]` : `[${a - b}, ${a})`}$ 中，而随着 $n$ 增大，$\\frac{${b}}{n}$ 小于任何正数。`,
              ],
            ),
          );
        },
      ),
      point(
        "when-the-supremum-is-attained",
        ["When the supremum is attained", "上确界何时取到"],
        [
          "A supremum is the least upper bound, and it need not belong to the set. The set contains it exactly when the set has a largest element, which is then called the maximum. An interval that is open at its right end has a supremum but no maximum, however close its members come. This distinction is the reason why the completeness axiom speaks of suprema.\n\nThe set $[0, 1) \\cup \\{2\\}$ has supremum $2$, and $2$ belongs to it, so $2$ is its maximum.\n\nCheck: $2$ is an upper bound that lies in the set, so no smaller number can be an upper bound.\n\n> **Watch out.** Including the left end does not help. $[a, b)$ contains its infimum $a$, but not its supremum $b$.",
          "上确界是最小上界，它不一定属于这个集合。集合包含它，当且仅当集合有最大元素，这时称之为最大值。右端开的区间有上确界但没有最大值，不管其中的元素多么接近它。正因为这一区别，完备性公理谈的是上确界。\n\n集合 $[0, 1) \\cup \\{2\\}$ 的上确界是 $2$，而 $2$ 属于它，所以 $2$ 是它的最大值。\n\n检验：$2$ 是属于集合的上界，所以比它小的数都不可能是上界。\n\n> **注意。** 包含左端点没有帮助。$[a, b)$ 包含它的下确界 $a$，但不包含上确界 $b$。",
        ],
        (rng) => {
          const a = rng.int(-9, 6);
          const b = a + rng.int(2, 9);
          return reasoned(
            choose(
              rng,
              ["Which of these sets contains its supremum?", "下列哪个集合包含它的上确界？"],
              same(`(${a}, ${b}]`),
              [same(`(${a}, ${b})`), same(`[${a}, ${b})`), same(`\\{${b} - \\frac{1}{n} : n \\ge 1\\}`)],
              asPair(
                solution(
                  [
                    [
                      ["Find the supremum", "求上确界"],
                      [
                        `Each set has supremum $${b}$: its members are at most $${b}$ and come arbitrarily close to it.`,
                        `每个集合的上确界都是 $${b}$：其元素都不超过 $${b}$，并且任意接近它。`,
                      ],
                    ],
                    [
                      ["Check membership", "检验是否属于集合"],
                      [
                        `Only $(${a}, ${b}]$ includes its right end $${b}$. The two other intervals exclude it, and $${b} - \\frac{1}{n} < ${b}$ for every $n$.`,
                        `只有 $(${a}, ${b}]$ 包含右端点 $${b}$。另外两个区间不包含它，而对每个 $n$ 都有 $${b} - \\frac{1}{n} < ${b}$。`,
                      ],
                    ],
                  ],
                  [
                    `$${b}$ is the largest element of $(${a}, ${b}]$, its maximum, which is what attaining the supremum means.`,
                    `$${b}$ 是 $(${a}, ${b}]$ 的最大元素，即最大值，这正是取到上确界的含义。`,
                  ],
                ),
              ),
            ),
            [
              reason(`(${a}, ${b})`, `Its supremum $${b}$ is the excluded right end.`, `它的上确界 $${b}$ 是不包含的右端点。`),
              reason(
                `[${a}, ${b})`,
                `It contains its infimum $${a}$, but its supremum $${b}$ is excluded.`,
                `它包含下确界 $${a}$，但不包含上确界 $${b}$。`,
              ),
              reason(
                `\\{${b} - \\frac{1}{n} : n \\ge 1\\}`,
                `Every member is below $${b}$, so its supremum $${b}$ is not a member.`,
                `每个元素都小于 $${b}$，所以上确界 $${b}$ 不是它的元素。`,
              ),
            ],
          );
        },
      ),
    ],
  ),
  intro: t(
    "The set $\\{2 + \\frac{3}{n} : n \\ge 1\\}$ has terms $5, \\frac{7}{2}, 3, \\dots$, falling towards $2$. Its supremum is the first term $5$, which belongs to the set, and its infimum is $2$, which no term reaches.\n\nCheck: every term is above $2$, and $2 + \\frac{3}{n} < 2 + \\varepsilon$ once $n > \\frac{3}{\\varepsilon}$, so no number above $2$ is a lower bound.\n\nIn this lesson we find suprema and infima of sets given by sequences, and decide when they are attained.",
    "集合 $\\{2 + \\frac{3}{n} : n \\ge 1\\}$ 的各项是 $5, \\frac{7}{2}, 3, \\dots$，下降趋向 $2$。它的上确界是第一项 $5$，属于集合；下确界是 $2$，没有一项能达到它。\n\n检验：每一项都大于 $2$，而当 $n > \\frac{3}{\\varepsilon}$ 时 $2 + \\frac{3}{n} < 2 + \\varepsilon$，所以大于 $2$ 的数都不是下界。\n\n本课我们求由数列给出的集合的上下确界，并判断它们是否取到。",
  ),
};

const monotoneConvergence = {
  ...topic(
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
          "A bounded monotone sequence converges, by the completeness of the real numbers. That guarantees a limit exists without naming it. Once the limit is known to exist, taking limits on both sides of the recursion gives an equation for it, because the shifted sequence has the same limit. Solving that equation before establishing convergence is a common logical slip, since a divergent recursion has fixed points too.\n\nFor $a_{n+1} = \\frac{a_n + 10}{5}$ with $a_1 = 0$, the limit satisfies $L = \\frac{L + 10}{5}$, so $5L = L + 10$, $4L = 10$ and $L = \\frac{5}{2}$.\n\nCheck: $\\frac{5}{2} + 10 = \\frac{25}{2}$, and dividing by $5$ gives $\\frac{5}{2}$ again.\n\n> **Watch out.** Both $a_n$ and $a_{n+1}$ tend to $L$, so $L$ appears on both sides. Putting the first term in place of $a_n$ gives $a_2$, not the limit.",
          "由实数的完备性，有界单调数列收敛。这保证极限存在，但没有给出它的值。知道极限存在后，对递推式两边取极限，就得到关于它的方程，因为错后一项的数列有相同的极限。在证明收敛之前就解这个方程，是常见的逻辑错误，因为发散的递推也有不动点。\n\n对 $a_{n+1} = \\frac{a_n + 10}{5}$，$a_1 = 0$，极限满足 $L = \\frac{L + 10}{5}$，所以 $5L = L + 10$，$4L = 10$，$L = \\frac{5}{2}$。\n\n检验：$\\frac{5}{2} + 10 = \\frac{25}{2}$，再除以 $5$ 又得到 $\\frac{5}{2}$。\n\n> **注意。** $a_n$ 和 $a_{n+1}$ 都趋向 $L$，所以 $L$ 出现在两边。把第一项代入 $a_n$ 得到的是 $a_2$，而不是极限。",
        ],
        (rng) => {
          const k = rng.int(2, 9);
          const c = rng.int(1, 20);
          const answer = Q.of(c, k - 1);
          return solved(
            [
              `The sequence $a_{n+1} = \\frac{a_n + ${c}}{${k}}$ with $a_1 = 0$ is monotone and bounded. What is its limit?`,
              `数列 $a_{n+1} = \\frac{a_n + ${c}}{${k}}$，$a_1 = 0$，单调且有界。它的极限是多少？`,
            ],
            answer,
            [
              why(
                Q.of(c, k),
                `That is $a_2$, the term after $a_1 = 0$; the limit has $L$ on both sides of the recursion.`,
                `这是 $a_1 = 0$ 之后的 $a_2$；极限在递推式两边都是 $L$。`,
              ),
              why(
                Q.of(c),
                `Substituting $${c}$ gives $\\frac{${c} + ${c}}{${k}} = ${frac(2 * c, k)}$, not $${c}$, so it is not a fixed point.`,
                `代入 $${c}$ 得 $\\frac{${c} + ${c}}{${k}} = ${frac(2 * c, k)}$，不等于 $${c}$，所以它不是不动点。`,
              ),
              why(
                Q.of(c, k + 1),
                `That solves $${k}L + L = ${c}$; moving $L$ to the left subtracts it, giving $${times(k - 1, "L")} = ${c}$.`,
                `这是解 $${k}L + L = ${c}$；把 $L$ 移到左边要减去它，得 $${times(k - 1, "L")} = ${c}$。`,
              ),
              why(
                Q.of(k, c),
                `That turns the fraction upside down; $${times(k - 1, "L")} = ${c}$ gives $L = ${answer.toLatex()}$.`,
                `这是把分数颠倒了；$${times(k - 1, "L")} = ${c}$ 给出 $L = ${answer.toLatex()}$。`,
              ),
            ],
            solution(
              [
                [
                  ["Take limits in the recursion", "在递推式中取极限"],
                  [
                    `The sequence converges, so $a_n$ and $a_{n+1}$ both tend to $L$, and $L = \\frac{L + ${c}}{${k}}$.`,
                    `数列收敛，所以 $a_n$ 和 $a_{n+1}$ 都趋向 $L$，于是 $L = \\frac{L + ${c}}{${k}}$。`,
                  ],
                ],
                [
                  ["Solve for the limit", "解出极限"],
                  [
                    `Multiplying by $${k}$ gives $${k}L = L + ${c}$, so $${times(k - 1, "L")} = ${c}$ and $L = ${answer.toLatex()}$.`,
                    `两边乘 $${k}$ 得 $${k}L = L + ${c}$，所以 $${times(k - 1, "L")} = ${c}$，$L = ${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `$${answer.toLatex()} + ${c} = ${answer.add(Q.of(c)).toLatex()}$, and dividing by $${k}$ gives $${answer.toLatex()}$ again.`,
                `$${answer.toLatex()} + ${c} = ${answer.add(Q.of(c)).toLatex()}$，再除以 $${k}$ 又得到 $${answer.toLatex()}$。`,
              ],
            ),
          );
        },
      ),
      point(
        "the-limit-of-a-root-recursion",
        ["The limit of a root recursion", "根式递推的极限"],
        [
          "A recursion with a square root leads to a quadratic equation for the limit, and only one of its roots can be right. Every term of the sequence is positive, so the limit cannot be negative, and that discards the other root. Checking the sign in this way is the step that the equation alone does not provide, and it needs the fact that limits preserve weak inequalities.\n\nFor $a_{n+1} = \\sqrt{6 + a_n}$, the limit satisfies $L^2 = 6 + L$, so $(L - 3)(L + 2) = 0$. The terms are square roots, so the limit is $3$, not $-2$.\n\nCheck: $\\sqrt{6 + 3} = \\sqrt{9} = 3$.\n\n> **Watch out.** Do not keep the negative root. Every term is a square root and so is at least $0$, and a limit of such terms is at least $0$ too.",
          "带平方根的递推得到关于极限的二次方程，而它的根中只有一个可能正确。数列的每一项都是正的，所以极限不可能是负数，这就排除了另一个根。这样检查符号，是方程本身提供不了的一步，它用到了极限保持非严格不等式这一事实。\n\n对 $a_{n+1} = \\sqrt{6 + a_n}$，极限满足 $L^2 = 6 + L$，所以 $(L - 3)(L + 2) = 0$。各项都是平方根，所以极限是 $3$，而不是 $-2$。\n\n检验：$\\sqrt{6 + 3} = \\sqrt{9} = 3$。\n\n> **注意。** 不要保留负根。每一项都是平方根，因而不小于 $0$，这样的项的极限也不小于 $0$。",
        ],
        (rng) => {
          const L = rng.int(2, 14);
          const b = rng.int(1, L - 1);
          const c = L * L - b * L;
          const other = b - L;
          const root = Math.floor(Math.sqrt(c)) === L ? L + 1 : Math.floor(Math.sqrt(c));
          const notRoot = (v: number) =>
            why(
              v,
              `$${v}$ does not solve $L^2 = ${c} + ${times(b, "L")}$: the left side is $${v * v}$ and the right side is $${c + b * v}$.`,
              `$${v}$ 不满足 $L^2 = ${c} + ${times(b, "L")}$：左边是 $${v * v}$，右边是 $${c + b * v}$。`,
            );
          return solved(
            [
              `The sequence $a_{n+1} = \\sqrt{${c} + ${times(b, "a_n")}}$ with $a_1 = 1$ converges. What is its limit?`,
              `数列 $a_{n+1} = \\sqrt{${c} + ${times(b, "a_n")}}$，$a_1 = 1$，收敛。它的极限是多少？`,
            ],
            L,
            [
              why(
                other,
                `That root is negative, but every term is a square root and so is at least $0$; a limit of such terms is at least $0$.`,
                `这个根是负数，但每一项都是平方根，不小于 $0$；这样的项的极限也不小于 $0$。`,
              ),
              why(
                c,
                `That is the constant under the root; the limit solves $L^2 = ${c} + ${times(b, "L")}$.`,
                `这是根号下的常数；极限满足 $L^2 = ${c} + ${times(b, "L")}$。`,
              ),
              notRoot(root),
              notRoot(L + b),
            ],
            solution(
              [
                [
                  ["Take limits", "取极限"],
                  [
                    `If $a_n \\to L$, then $L = \\sqrt{${c} + ${times(b, "L")}}$, so $L^2 = ${c} + ${times(b, "L")}$.`,
                    `若 $a_n \\to L$，则 $L = \\sqrt{${c} + ${times(b, "L")}}$，所以 $L^2 = ${c} + ${times(b, "L")}$。`,
                  ],
                ],
                [
                  ["Solve the quadratic", "解二次方程"],
                  [
                    `$L^2 - ${times(b, "L")} - ${c} = 0$ factors as $(L - ${L})(L + ${L - b}) = 0$, with roots $${L}$ and $${other}$.`,
                    `$L^2 - ${times(b, "L")} - ${c} = 0$ 分解为 $(L - ${L})(L + ${L - b}) = 0$，两根是 $${L}$ 和 $${other}$。`,
                  ],
                ],
                [
                  ["Discard the negative root", "舍去负根"],
                  [
                    `Every term is a square root, so $a_n \\ge 0$ and $L \\ge 0$. The limit is $${L}$.`,
                    `每一项都是平方根，所以 $a_n \\ge 0$，$L \\ge 0$。极限是 $${L}$。`,
                  ],
                ],
              ],
              [`$\\sqrt{${c} + ${b * L}} = \\sqrt{${L * L}} = ${L}$.`, `$\\sqrt{${c} + ${b * L}} = \\sqrt{${L * L}} = ${L}$。`],
            ),
          );
        },
      ),
    ],
  ),
  intro: t(
    "The sequence $a_1 = 0$, $a_{n+1} = \\frac{a_n + 6}{3}$ rises, $0, 2, \\frac{8}{3}, \\dots$, and stays below $3$, so it converges. Its limit satisfies $L = \\frac{L + 6}{3}$, so $3L = L + 6$ and $L = 3$.\n\nCheck: $\\frac{3 + 6}{3} = 3$, so $3$ is a fixed point of the recursion, and $a_3 = \\frac{8}{3}$ is already close to it.\n\nIn this lesson we use monotonicity and boundedness to show that a recursive sequence converges, and then find its limit from the recursion.",
    "数列 $a_1 = 0$，$a_{n+1} = \\frac{a_n + 6}{3}$ 递增：$0, 2, \\frac{8}{3}, \\dots$，并且一直小于 $3$，所以收敛。它的极限满足 $L = \\frac{L + 6}{3}$，所以 $3L = L + 6$，$L = 3$。\n\n检验：$\\frac{3 + 6}{3} = 3$，所以 $3$ 是递推的不动点，而 $a_3 = \\frac{8}{3}$ 已经很接近它了。\n\n本课我们用单调性和有界性证明递推数列收敛，再由递推式求出它的极限。",
  ),
};

const subsequences = {
  ...topic(
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
          "A subsequence keeps some terms of a sequence, in order. If a sequence converges, all its subsequences share the limit. If it does not, different subsequences may have different limits, and two such limits prove divergence. The Bolzano–Weierstrass theorem adds that every bounded sequence has at least one convergent subsequence, even when the sequence itself oscillates for ever without settling down.\n\nFor $a_n = (-1)^n \\cdot 3 + \\frac{4}{n}$, the odd-indexed terms are $-3 + \\frac{4}{n}$, which tend to $-3$.\n\nCheck: $a_1 = 1$, $a_3 = -\\frac{5}{3}$ and $a_5 = -\\frac{11}{5}$ move towards $-3$.\n\n> **Watch out.** On odd indices $(-1)^n = -1$, not $1$. And the vanishing term $\\frac{4}{n}$ adds nothing to the limit, however large it is at the start.",
          "子列按顺序保留数列的一些项。如果数列收敛，它的所有子列有相同的极限。如果不收敛，不同的子列可能有不同的极限，两个这样的极限就证明了发散。波尔查诺–魏尔斯特拉斯定理补充说，每个有界数列至少有一个收敛子列，即使数列本身永远振荡而不稳定下来。\n\n对 $a_n = (-1)^n \\cdot 3 + \\frac{4}{n}$，下标为奇数的项是 $-3 + \\frac{4}{n}$，它们趋向 $-3$。\n\n检验：$a_1 = 1$，$a_3 = -\\frac{5}{3}$，$a_5 = -\\frac{11}{5}$，逐渐接近 $-3$。\n\n> **注意。** 下标为奇数时 $(-1)^n = -1$，而不是 $1$。趋于零的项 $\\frac{4}{n}$ 对极限没有贡献，不管它开始时有多大。",
        ],
        (rng) => {
          const p = rng.int(2, 13);
          const q = rng.int(1, 12);
          const even = rng.bool();
          const answer = even ? p : -p;
          const seq = `a_n = (-1)^n \\cdot ${p} + \\frac{${q}}{n}`;
          const n0 = even ? 100 : 101;
          return solved(
            [
              `Let $${seq}$. What is the limit of the subsequence of ${even ? "even" : "odd"}-indexed terms?`,
              `设 $${seq}$。下标为${even ? "偶数" : "奇数"}的子列的极限是多少？`,
            ],
            answer,
            [
              why(
                -answer,
                `That is the limit along the ${even ? "odd" : "even"} indices; on ${even ? "even" : "odd"} indices $(-1)^n = ${even ? 1 : -1}$.`,
                `这是沿${even ? "奇数" : "偶数"}下标的极限；在${even ? "偶数" : "奇数"}下标上 $(-1)^n = ${even ? 1 : -1}$。`,
              ),
              why(
                answer + q,
                `That keeps $\\frac{${q}}{n}$ at its value for $n = 1$; it tends to $0$.`,
                `这是让 $\\frac{${q}}{n}$ 保持 $n = 1$ 时的值；它趋向 $0$。`,
              ),
              why(
                0,
                `That is the limit of $\\frac{${q}}{n}$ alone; the first part stays at $${answer}$.`,
                `这只是 $\\frac{${q}}{n}$ 的极限；第一部分一直是 $${answer}$。`,
              ),
              why(q, `That is the numerator of the vanishing term, which tends to $0$.`, `这是趋于零的那一项的分子，那一项趋向 $0$。`),
            ],
            solution(
              [
                [
                  ["Fix the sign", "确定符号"],
                  [
                    `For ${even ? "even" : "odd"} $n$, $(-1)^n = ${even ? 1 : -1}$, so these terms are $${answer} + \\frac{${q}}{n}$.`,
                    `对${even ? "偶数" : "奇数"} $n$，$(-1)^n = ${even ? 1 : -1}$，所以这些项是 $${answer} + \\frac{${q}}{n}$。`,
                  ],
                ],
                [
                  ["Let the index grow", "让下标增大"],
                  [
                    `$\\frac{${q}}{n} \\to 0$, so the subsequence tends to $${answer}$.`,
                    `$\\frac{${q}}{n} \\to 0$，所以这个子列趋向 $${answer}$。`,
                  ],
                ],
              ],
              [
                `$a_{${n0}} = ${answer} + \\frac{${q}}{${n0}}$ is already within $\\frac{${q}}{${n0}}$ of $${answer}$.`,
                `$a_{${n0}} = ${answer} + \\frac{${q}}{${n0}}$ 与 $${answer}$ 的距离已经只有 $\\frac{${q}}{${n0}}$。`,
              ],
            ),
          );
        },
      ),
      point(
        "counting-limit-points",
        ["Counting limit points", "数极限点"],
        [
          "A limit point of a sequence is a value that some subsequence converges to. For a periodic pattern plus a term that vanishes, each repeating value is approached along its own subsequence, so the limit points are exactly the values in the pattern. Adding the vanishing term changes each term but no limit point, and a convergent sequence has a single limit point.\n\nFor $a_n = (n \\bmod 3) + \\frac{1}{n}$, the terms with $n = 3j$, $3j + 1$ and $3j + 2$ tend to $0$, $1$ and $2$, so there are $3$ limit points.\n\nCheck: the remainders on division by $3$ are $0, 1, 2$, one for each limit point, and each occurs infinitely often.\n\n> **Watch out.** The remainders run from $0$ to $m - 1$, which is $m$ values, not $m - 1$. The term $\\frac{1}{n}$ moves each term a little but creates no new limit point.",
          "数列的极限点是某个子列收敛到的值。对周期模式加上一个趋于零的项，每个重复的值都沿着自己的子列被逼近，所以极限点恰好是模式中的那些值。加上趋于零的项改变了每一项，但不改变极限点；收敛数列只有一个极限点。\n\n对 $a_n = (n \\bmod 3) + \\frac{1}{n}$，$n = 3j$、$3j + 1$、$3j + 2$ 的项分别趋向 $0$、$1$、$2$，所以有 $3$ 个极限点。\n\n检验：除以 $3$ 的余数是 $0, 1, 2$，每个对应一个极限点，而且每个都无限次出现。\n\n> **注意。** 余数从 $0$ 到 $m - 1$，共 $m$ 个值，而不是 $m - 1$ 个。$\\frac{1}{n}$ 只让每一项稍有移动，不会产生新的极限点。",
        ],
        (rng) => {
          const m = rng.int(2, 34);
          return solved(
            [
              `Let $a_n = (n \\bmod ${m}) + \\frac{1}{n}$. How many limit points does this sequence have?`,
              `设 $a_n = (n \\bmod ${m}) + \\frac{1}{n}$。这个数列有多少个极限点？`,
            ],
            m,
            [
              why(
                m - 1,
                `That leaves out one remainder: $0, 1, \\dots, ${m - 1}$ are $${m}$ values.`,
                `这漏掉了一个余数：$0, 1, \\dots, ${m - 1}$ 共 $${m}$ 个值。`,
              ),
              why(
                m + 1,
                `That counts $${m}$ as a remainder too; remainders on division by $${m}$ stop at $${m - 1}$.`,
                `这把 $${m}$ 也算作余数；除以 $${m}$ 的余数最大是 $${m - 1}$。`,
              ),
              why(
                1,
                "A sequence with a single limit point here would converge, but this one keeps returning near every remainder.",
                "这里只有一个极限点的话数列就收敛了，但它不断回到每个余数附近。",
              ),
              why(
                2 * m,
                `The term $\\frac{1}{n}$ creates no new limit points; it only moves each term slightly.`,
                `$\\frac{1}{n}$ 这一项不产生新的极限点；它只让每一项稍有移动。`,
              ),
            ],
            solution(
              [
                [
                  ["Split into subsequences", "分成子列"],
                  [
                    `For each remainder $r$ from $0$ to $${m - 1}$, the terms with $n \\bmod ${m} = r$ are $r + \\frac{1}{n}$, and they tend to $r$.`,
                    `对从 $0$ 到 $${m - 1}$ 的每个余数 $r$，满足 $n \\bmod ${m} = r$ 的项是 $r + \\frac{1}{n}$，它们趋向 $r$。`,
                  ],
                ],
                [
                  ["Count the limits", "数出极限"],
                  [
                    `Every term lies near one of these remainders, so the limit points are exactly $0$ to $${m - 1}$: there are $${m}$ of them.`,
                    `每一项都在某个余数附近，所以极限点恰好是 $0$ 到 $${m - 1}$，共 $${m}$ 个。`,
                  ],
                ],
              ],
              [
                `Each remainder $r$ is taken by the infinitely many indices $n = ${m}j + r$, so each is reached by its own subsequence.`,
                `每个余数 $r$ 都由无限多个下标 $n = ${m}j + r$ 取到，所以每个都有自己的子列逼近它。`,
              ],
            ),
          );
        },
      ),
    ],
  ),
  intro: t(
    "Let $a_n = (-1)^n + \\frac{1}{n}$. The even-indexed terms $\\frac{3}{2}, \\frac{5}{4}, \\dots$ tend to $1$, and the odd-indexed terms $0, -\\frac{2}{3}, \\dots$ tend to $-1$.\n\nCheck: two subsequences with different limits, $1$ and $-1$, show that $(a_n)$ itself diverges, as its terms keep swinging between the two.\n\nIn this lesson we find the limits of subsequences and count the limit points of a sequence.",
    "设 $a_n = (-1)^n + \\frac{1}{n}$。下标为偶数的项 $\\frac{3}{2}, \\frac{5}{4}, \\dots$ 趋向 $1$，下标为奇数的项 $0, -\\frac{2}{3}, \\dots$ 趋向 $-1$。\n\n检验：两个子列的极限不同，分别是 $1$ 和 $-1$，这说明 $(a_n)$ 本身发散，它的项在两者之间来回摆动。\n\n本课我们求子列的极限，并数出数列的极限点个数。",
  ),
};

const cauchySequences = {
  ...topic(
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
          "A sequence is Cauchy when its terms eventually stay close to one another, whatever their indices. This makes no mention of a limit, which is the point: in the real numbers, completeness makes Cauchy sequences converge, so convergence can be shown without knowing the limit. For $\\frac{c}{n}$, terms with indices at least $N$ differ by less than $\\frac{c}{N}$, and this bound is the best one.\n\nFor $a_n = \\frac{3}{n}$ and $\\varepsilon = \\frac{1}{2}$: terms from $N$ on lie in $(0, \\frac{3}{N}]$, so we need $\\frac{3}{N} \\le \\frac{1}{2}$, that is $N \\ge 6$, and $N = 6$.\n\nCheck: with $N = 5$, $n = 5$ and a huge $m$ differ by nearly $\\frac{3}{5}$, which is more than $\\frac{1}{2}$.\n\n> **Watch out.** The differences stay strictly below $\\frac{c}{N}$, so $\\frac{c}{N}$ may equal $\\varepsilon$ and $N = ck$ works. Adding one, as for the distance to a limit, gives a valid index but not the smallest.",
          "如果数列的项最终彼此保持接近，不论下标是多少，这个数列就是柯西数列。这里完全没有提到极限，这正是关键：在实数中，完备性使柯西数列收敛，所以可以在不知道极限的情况下证明收敛。对 $\\frac{c}{n}$，下标不小于 $N$ 的项相差小于 $\\frac{c}{N}$，这个界是最好的。\n\n对 $a_n = \\frac{3}{n}$ 和 $\\varepsilon = \\frac{1}{2}$：从 $N$ 起的项都在 $(0, \\frac{3}{N}]$ 中，所以需要 $\\frac{3}{N} \\le \\frac{1}{2}$，即 $N \\ge 6$，取 $N = 6$。\n\n检验：若 $N = 5$，$n = 5$ 与很大的 $m$ 相差接近 $\\frac{3}{5}$，大于 $\\frac{1}{2}$。\n\n> **注意。** 差严格小于 $\\frac{c}{N}$，所以 $\\frac{c}{N}$ 可以等于 $\\varepsilon$，$N = ck$ 就可行。像求到极限的距离那样再加一，得到的下标可行但不是最小的。",
        ],
        (rng) => {
          const c = rng.int(2, 12);
          const { k, tex } = eps(rng);
          const answer = c * k;
          return solved(
            [
              `Let $a_n = \\frac{${c}}{n}$. What is the smallest $N$ with $|a_m - a_n| < ${tex}$ for all $m, n \\ge N$?`,
              `设 $a_n = \\frac{${c}}{n}$。使所有 $m, n \\ge N$ 都满足 $|a_m - a_n| < ${tex}$ 的最小 $N$ 是多少？`,
            ],
            answer,
            [
              why(
                answer + 1,
                `That index works, but so does $N = ${answer}$: the differences stay strictly below $\\frac{${c}}{N}$, which may equal $${tex}$.`,
                `这个下标可行，但 $N = ${answer}$ 也可行：差严格小于 $\\frac{${c}}{N}$，而它可以等于 $${tex}$。`,
              ),
              why(
                c + k,
                `That adds $${c}$ and $${k}$; the condition $\\frac{${c}}{N} \\le ${tex}$ multiplies them.`,
                `这是把 $${c}$ 和 $${k}$ 相加；条件 $\\frac{${c}}{N} \\le ${tex}$ 要把它们相乘。`,
              ),
              why(
                2 * answer,
                `That index works, but it is not the smallest: $N = ${answer}$ already does.`,
                `这个下标可行，但不是最小的：$N = ${answer}$ 已经可行。`,
              ),
              why(
                k,
                `That treats the terms as $\\frac{1}{n}$; they are $\\frac{${c}}{n}$, so the index is $${c}$ times larger.`,
                `这是把各项当成了 $\\frac{1}{n}$；它们是 $\\frac{${c}}{n}$，所以下标要大 $${c}$ 倍。`,
              ),
            ],
            solution(
              [
                [
                  ["Bound the differences", "估计差"],
                  [
                    `For $m, n \\ge N$ both terms lie in $(0, \\frac{${c}}{N}]$, so $|a_m - a_n| < \\frac{${c}}{N}$, and with $n = N$ and $m$ large the difference comes as close to $\\frac{${c}}{N}$ as we like.`,
                    `当 $m, n \\ge N$ 时两项都在 $(0, \\frac{${c}}{N}]$ 中，所以 $|a_m - a_n| < \\frac{${c}}{N}$；取 $n = N$、$m$ 很大时，差可以任意接近 $\\frac{${c}}{N}$。`,
                  ],
                ],
                [
                  ["Solve for the index", "解出下标"],
                  [
                    `We need $\\frac{${c}}{N} \\le ${tex}$, that is $N \\ge ${c} \\times ${k} = ${answer}$.`,
                    `需要 $\\frac{${c}}{N} \\le ${tex}$，即 $N \\ge ${c} \\times ${k} = ${answer}$。`,
                  ],
                ],
              ],
              [
                `With $N = ${answer - 1}$, the terms $a_{${answer - 1}}$ and $a_m$ for a large $m$ differ by nearly $\\frac{${c}}{${answer - 1}} > ${tex}$, so a smaller index fails.`,
                `若 $N = ${answer - 1}$，$a_{${answer - 1}}$ 与很大的 $m$ 对应的 $a_m$ 相差接近 $\\frac{${c}}{${answer - 1}} > ${tex}$，所以更小的下标不行。`,
              ],
            ),
          );
        },
      ),
      point(
        "recognizing-a-sequence-that-is-not-cauchy",
        ["Recognizing what is not Cauchy", "识别非柯西数列"],
        [
          "Consecutive terms getting closer is not enough for a sequence to be Cauchy. The partial sums of the harmonic series have consecutive differences that vanish, yet the block $\\frac{1}{n} + \\cdots + \\frac{1}{2n}$ always adds to at least $\\frac{1}{2}$, so they are not Cauchy. Sums of terms like $\\frac{1}{k^2}$ or a geometric series have small tails, which is what the criterion actually requires.\n\nThe partial sums $s_n = \\sum_{k=1}^{n} \\frac{1}{\\sqrt{k}}$ are not Cauchy either: the $n$ terms from $k = n + 1$ to $2n$ are each at least $\\frac{1}{\\sqrt{2n}}$, so $s_{2n} - s_n \\ge \\frac{n}{\\sqrt{2n}} = \\sqrt{\\frac{n}{2}}$, which grows.\n\nCheck: for $n = 8$, the $8$ terms from $k = 9$ to $16$ are each at least $\\frac{1}{4}$, so they add to at least $2$.\n\n> **Watch out.** $s_{n+1} - s_n \\to 0$ does not make a sequence Cauchy. The criterion needs $|s_m - s_n|$ small for all large $m$ and $n$ at once, not only for neighbours.",
          "相邻项越来越接近，并不足以使数列成为柯西数列。调和级数的部分和相邻差趋于零，但 $\\frac{1}{n} + \\cdots + \\frac{1}{2n}$ 这一段的和总不小于 $\\frac{1}{2}$，所以它不是柯西数列。像 $\\frac{1}{k^2}$ 这样的项之和或几何级数的尾部很小，这才是这个准则真正要求的。\n\n部分和 $s_n = \\sum_{k=1}^{n} \\frac{1}{\\sqrt{k}}$ 也不是柯西数列：从 $k = n + 1$ 到 $2n$ 的 $n$ 项每项至少是 $\\frac{1}{\\sqrt{2n}}$，所以 $s_{2n} - s_n \\ge \\frac{n}{\\sqrt{2n}} = \\sqrt{\\frac{n}{2}}$，它不断增大。\n\n检验：$n = 8$ 时，从 $k = 9$ 到 $16$ 的 $8$ 项每项至少是 $\\frac{1}{4}$，所以和至少是 $2$。\n\n> **注意。** $s_{n+1} - s_n \\to 0$ 并不能使数列成为柯西数列。准则要求对所有足够大的 $m$ 和 $n$，$|s_m - s_n|$ 都很小，而不只是相邻的项。",
        ],
        (rng) => {
          const c = rng.int(2, 19);
          const r = rng.int(2, 19);
          return reasoned(
            choose(
              rng,
              ["Which of these sequences is not Cauchy?", "下列哪个数列不是柯西数列？"],
              same(`s_n = \\sum_{k=1}^{n} \\frac{${c}}{k}`),
              [
                same(`s_n = \\sum_{k=1}^{n} \\frac{${c}}{k^2}`),
                same(`s_n = \\sum_{k=1}^{n} \\frac{1}{${r}^k}`),
                same(`s_n = ${c} + \\frac{${r}}{n}`),
              ],
              asPair(
                solution(
                  [
                    [
                      ["Look at a block of terms", "看一段项"],
                      [
                        `For $s_n = \\sum_{k=1}^{n} \\frac{${c}}{k}$, each of the $n$ terms from $k = n + 1$ to $2n$ is at least $\\frac{${c}}{2n}$, so $s_{2n} - s_n \\ge \\frac{${c}}{2}$.`,
                        `对 $s_n = \\sum_{k=1}^{n} \\frac{${c}}{k}$，从 $k = n + 1$ 到 $2n$ 的 $n$ 项每项至少是 $\\frac{${c}}{2n}$，所以 $s_{2n} - s_n \\ge \\frac{${c}}{2}$。`,
                      ],
                    ],
                    [
                      ["Compare with the criterion", "对照准则"],
                      [
                        `For $\\varepsilon = \\frac{${c}}{2}$ no $N$ works, since $m = 2n$ and $n \\ge N$ always differ by at least that. So this sequence is not Cauchy.`,
                        `对 $\\varepsilon = \\frac{${c}}{2}$，没有 $N$ 可行，因为 $m = 2n$ 与 $n \\ge N$ 总相差至少这么多。所以这个数列不是柯西数列。`,
                      ],
                    ],
                  ],
                  [
                    `The other three converge, to a finite sum, to the sum of a geometric series and to $${c}$, and every convergent sequence is Cauchy.`,
                    `另外三个都收敛：分别收敛到一个有限的和、一个几何级数的和以及 $${c}$，而每个收敛数列都是柯西数列。`,
                  ],
                ),
              ),
            ),
            [
              reason(
                `s_n = \\sum_{k=1}^{n} \\frac{${c}}{k^2}`,
                `Its tails $\\sum_{k > n} \\frac{${c}}{k^2}$ shrink to $0$, so it converges and is Cauchy.`,
                `它的尾部 $\\sum_{k > n} \\frac{${c}}{k^2}$ 趋于 $0$，所以它收敛，是柯西数列。`,
              ),
              reason(
                `s_n = \\sum_{k=1}^{n} \\frac{1}{${r}^k}`,
                `A geometric series with ratio $\\frac{1}{${r}}$ converges, so its partial sums are Cauchy.`,
                `公比为 $\\frac{1}{${r}}$ 的几何级数收敛，所以它的部分和是柯西数列。`,
              ),
              reason(
                `s_n = ${c} + \\frac{${r}}{n}`,
                `It converges to $${c}$, and convergent sequences are Cauchy.`,
                `它收敛于 $${c}$，而收敛数列都是柯西数列。`,
              ),
            ],
          );
        },
      ),
    ],
  ),
  intro: t(
    "For $a_n = \\frac{1}{n}$ and $m, n \\ge N$, both terms lie in $(0, \\frac{1}{N}]$, so $|a_m - a_n| < \\frac{1}{N}$. To make every such difference less than $\\frac{1}{10}$, $N = 10$ is enough.\n\nCheck: with $N = 9$, the terms $a_9$ and $a_m$ for a huge $m$ differ by nearly $\\frac{1}{9}$, which is more than $\\frac{1}{10}$, so $9$ is too small.\n\nIn this lesson we apply the Cauchy criterion, which tests convergence without naming the limit.",
    "对 $a_n = \\frac{1}{n}$ 和 $m, n \\ge N$，两项都在 $(0, \\frac{1}{N}]$ 中，所以 $|a_m - a_n| < \\frac{1}{N}$。要使所有这样的差都小于 $\\frac{1}{10}$，取 $N = 10$ 就够了。\n\n检验：若 $N = 9$，$a_9$ 与很大的 $m$ 对应的 $a_m$ 相差接近 $\\frac{1}{9}$，大于 $\\frac{1}{10}$，所以 $9$ 太小。\n\n本课我们应用柯西准则，它不必说出极限就能判断收敛。",
  ),
};

const limsup = {
  ...topic(
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
          "The limit superior is the largest limit point of a bounded sequence, and the limit inferior is the smallest. Both always exist for a bounded sequence, unlike the limit, and they coincide exactly when the sequence converges. Terms that vanish do not affect either one. So for an oscillation around a centre, these two values are the centre plus or minus the size of the swing.\n\nFor $a_n = (-1)^n \\cdot 3 + 1 + \\frac{2}{n}$, the even terms tend to $4$ and the odd terms to $-2$, so $\\limsup a_n = 4$ and $\\liminf a_n = -2$.\n\nCheck: the centre is $1$ and the swing is $3$, and $1 + 3 = 4$, $1 - 3 = -2$.\n\n> **Watch out.** The vanishing term $\\frac{2}{n}$ shifts neither value. And the limit superior comes from the even terms here, because $(-1)^n = 1$ for even $n$.",
          "上极限是有界数列最大的极限点，下极限是最小的。对有界数列，它们总是存在，这一点与极限不同，而且它们相等当且仅当数列收敛。趋于零的项对两者都没有影响。所以对围绕中心的振荡，这两个值就是中心加减振幅。\n\n对 $a_n = (-1)^n \\cdot 3 + 1 + \\frac{2}{n}$，偶数项趋向 $4$，奇数项趋向 $-2$，所以 $\\limsup a_n = 4$，$\\liminf a_n = -2$。\n\n检验：中心是 $1$，振幅是 $3$，而 $1 + 3 = 4$，$1 - 3 = -2$。\n\n> **注意。** 趋于零的项 $\\frac{2}{n}$ 不改变这两个值。这里上极限来自偶数项，因为 $n$ 为偶数时 $(-1)^n = 1$。",
        ],
        (rng) => {
          const p = rng.int(2, 10);
          const q = rng.int(-8, 8);
          const s = rng.int(1, 9);
          const upper = rng.bool();
          const answer = upper ? q + p : q - p;
          const seq = `a_n = (-1)^n \\cdot ${p}${signed(q)} + \\frac{${s}}{n}`;
          return solved(
            [
              `Let $${seq}$. What is $\\${upper ? "limsup" : "liminf"}_{n \\to \\infty} a_n$?`,
              `设 $${seq}$。$\\${upper ? "limsup" : "liminf"}_{n \\to \\infty} a_n$ 是多少？`,
            ],
            answer,
            [
              why(
                upper ? q - p : q + p,
                `That is the limit ${upper ? "inferior, along the odd" : "superior, along the even"} terms.`,
                `这是沿${upper ? "奇数项的下极限" : "偶数项的上极限"}。`,
              ),
              why(
                q,
                `That is the centre of the oscillation; the ${upper ? "largest" : "smallest"} limit point is $${answer}$.`,
                `这是振荡的中心；${upper ? "最大" : "最小"}的极限点是 $${answer}$。`,
              ),
              why(
                answer + s,
                `That keeps $\\frac{${s}}{n}$ at its value for $n = 1$; it tends to $0$.`,
                `这是让 $\\frac{${s}}{n}$ 保持 $n = 1$ 时的值；它趋向 $0$。`,
              ),
              why(
                p,
                `That is the size of the swing alone; it must be ${upper ? "added to" : "taken from"} the centre $${q}$.`,
                `这只是振幅；还要${upper ? "加上" : "从"}中心 $${q}$${upper ? "" : "中减去它"}。`,
              ),
            ],
            solution(
              [
                [
                  ["Split by parity", "按奇偶分开"],
                  [
                    `Even terms are $${q + p} + \\frac{${s}}{n} \\to ${q + p}$, and odd terms are $${q - p} + \\frac{${s}}{n} \\to ${q - p}$.`,
                    `偶数项是 $${q + p} + \\frac{${s}}{n} \\to ${q + p}$，奇数项是 $${q - p} + \\frac{${s}}{n} \\to ${q - p}$。`,
                  ],
                ],
                [
                  [upper ? "Take the larger limit" : "Take the smaller limit", upper ? "取较大的极限" : "取较小的极限"],
                  [
                    `These are the only limit points, so the limit ${upper ? "superior is the larger" : "inferior is the smaller"}, $${answer}$.`,
                    `这是仅有的两个极限点，所以${upper ? "上极限是较大的" : "下极限是较小的"} $${answer}$。`,
                  ],
                ],
              ],
              [
                `The centre is $${q}$ and the swing is $${p}$, and $${q} ${upper ? "+" : "-"} ${p} = ${answer}$.`,
                `中心是 $${q}$，振幅是 $${p}$，而 $${q} ${upper ? "+" : "-"} ${p} = ${answer}$。`,
              ],
            ),
          );
        },
      ),
      point(
        "the-supremum-of-a-tail",
        ["The supremum of a tail", "尾部的上确界"],
        [
          "The limit superior is defined through tails: take the supremum of the terms from index n onward, then let n grow. As n grows, fewer terms remain, so these suprema form a falling sequence, which has a limit. For a sequence that decreases, the supremum of each tail is simply its first term. Computing one of these suprema helps to make the definition concrete.\n\nFor $a_k = 2 + \\frac{6}{k}$, the tail from $k = 3$ has supremum $a_3 = 2 + 2 = 4$.\n\nCheck: $a_4 = \\frac{7}{2}$ and every later term is smaller still, so $4$ is the largest term of that tail.\n\n> **Watch out.** The tail starts at $k = n$, so its first term is $a_n$, not $a_1$ and not $a_{n+1}$. Its supremum is that first term, not the limit $2$, which is where these suprema are heading.",
          "上极限通过尾部定义：取从下标 n 开始各项的上确界，再让 n 增大。n 增大时，剩下的项变少，所以这些上确界构成递减数列，它有极限。对递减数列，每个尾部的上确界就是它的第一项。算出其中一个上确界，有助于把定义具体化。\n\n对 $a_k = 2 + \\frac{6}{k}$，从 $k = 3$ 起的尾部的上确界是 $a_3 = 2 + 2 = 4$。\n\n检验：$a_4 = \\frac{7}{2}$，以后各项更小，所以 $4$ 是这个尾部最大的项。\n\n> **注意。** 尾部从 $k = n$ 开始，所以它的第一项是 $a_n$，而不是 $a_1$，也不是 $a_{n+1}$。它的上确界是这第一项，而不是极限 $2$，后者是这些上确界趋向的值。",
        ],
        (rng) => {
          const c = rng.int(1, 9);
          const d = rng.int(1, 9);
          const n = rng.int(2, 12);
          const answer = Q.of(c).add(Q.of(d, n));
          return solved(
            [
              `Let $a_k = ${c} + \\frac{${d}}{k}$. What is $\\sup_{k \\ge ${n}} a_k$?`,
              `设 $a_k = ${c} + \\frac{${d}}{k}$。$\\sup_{k \\ge ${n}} a_k$ 是多少？`,
            ],
            answer,
            [
              why(
                Q.of(c),
                `That is the limit of the tail suprema, the limit superior; this one tail has its first term as supremum.`,
                `这是各尾部上确界的极限，即上极限；这一个尾部的上确界是它的第一项。`,
              ),
              why(
                Q.of(c).add(Q.of(d, n + 1)),
                `That starts the tail at $k = ${n + 1}$; it includes $k = ${n}$.`,
                `这是让尾部从 $k = ${n + 1}$ 开始；它包含 $k = ${n}$。`,
              ),
              why(Q.of(d, n), `That leaves out the constant $${c}$.`, `这漏掉了常数 $${c}$。`),
              why(
                Q.of(c + d),
                `That is $a_1$, the first term of the whole sequence, which is not in this tail.`,
                `这是整个数列的第一项 $a_1$，它不在这个尾部中。`,
              ),
            ],
            solution(
              [
                [
                  ["See that the terms decrease", "看出各项递减"],
                  [
                    `$\\frac{${d}}{k}$ falls as $k$ grows, so $a_{${n}} > a_{${n + 1}} > \\cdots$.`,
                    `$\\frac{${d}}{k}$ 随 $k$ 增大而减小，所以 $a_{${n}} > a_{${n + 1}} > \\cdots$。`,
                  ],
                ],
                [
                  ["Take the first term", "取第一项"],
                  [
                    `The supremum of the tail is its first term, $a_{${n}} = ${c} + \\frac{${d}}{${n}} = ${answer.toLatex()}$.`,
                    `尾部的上确界是它的第一项，$a_{${n}} = ${c} + \\frac{${d}}{${n}} = ${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `$a_{${n}}$ belongs to the tail and every later term is smaller, so no number below $${answer.toLatex()}$ is an upper bound of it.`,
                `$a_{${n}}$ 属于这个尾部，以后各项都更小，所以小于 $${answer.toLatex()}$ 的数都不是它的上界。`,
              ],
            ),
          );
        },
      ),
    ],
  ),
  intro: t(
    "For $a_n = (-1)^n \\cdot 2 + \\frac{1}{n}$, the even terms tend to $2$ and the odd terms tend to $-2$. So $\\limsup a_n = 2$ and $\\liminf a_n = -2$, although the sequence has no limit.\n\nCheck: the supremum of each tail is an even term $2 + \\frac{1}{k}$, and these suprema fall towards $2$, as the definition through tails requires.\n\nIn this lesson we compute the limit superior and limit inferior of a sequence, from its subsequences and from its tails.",
    "对 $a_n = (-1)^n \\cdot 2 + \\frac{1}{n}$，偶数项趋向 $2$，奇数项趋向 $-2$。所以 $\\limsup a_n = 2$，$\\liminf a_n = -2$，尽管数列没有极限。\n\n检验：每个尾部的上确界是某个偶数项 $2 + \\frac{1}{k}$，这些上确界下降趋向 $2$，与用尾部给出的定义一致。\n\n本课我们由子列和尾部来计算数列的上极限和下极限。",
  ),
};

const absoluteConvergence = {
  ...topic(
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
          "A series converges absolutely when the series of absolute values converges, and this implies convergence. It converges conditionally when it converges but the absolute values do not sum. For the alternating series $\\sum (-1)^{k} \\frac{1}{k^p}$, this gives three cases: absolute when $p > 1$, conditional when $0 < p \\le 1$, and divergence when $p \\le 0$, since the terms then fail to vanish.\n\nFor $\\sum \\frac{(-1)^k}{k^{3/2}}$, the absolute values form the $p$-series with $p = \\frac{3}{2} > 1$, which converges, so the series converges absolutely.\n\nCheck: $\\frac{3}{2}$ lies above $1$, which is the absolute case of the three.\n\n> **Watch out.** Do not stop at the alternating series test. It shows that the series converges, but whether the convergence is absolute depends on $\\sum \\frac{1}{k^p}$, which converges only when $p > 1$.",
          "如果绝对值组成的级数收敛，原级数就绝对收敛，这蕴含着收敛。如果级数收敛但绝对值之和不收敛，就是条件收敛。对交错级数 $\\sum (-1)^{k} \\frac{1}{k^p}$，有三种情况：$p > 1$ 时绝对收敛；$0 < p \\le 1$ 时条件收敛；$p \\le 0$ 时发散，因为这时项不趋于零。\n\n对 $\\sum \\frac{(-1)^k}{k^{3/2}}$，绝对值构成 $p = \\frac{3}{2} > 1$ 的 $p$ 级数，它收敛，所以原级数绝对收敛。\n\n检验：$\\frac{3}{2}$ 大于 $1$，属于三种情况中的绝对收敛。\n\n> **注意。** 不要停在交错级数判别法上。它说明级数收敛，但是否绝对收敛取决于 $\\sum \\frac{1}{k^p}$，而它只在 $p > 1$ 时收敛。",
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
          const reasons: Reason[] = [
            kind === "conditional"
              ? [
                  "It converges absolutely",
                  `The absolute values form the $p$-series with $p = ${shown} \\le 1$, which diverges.`,
                  `绝对值构成 $p = ${shown} \\le 1$ 的 $p$ 级数，它发散。`,
                ]
              : [
                  "It converges absolutely",
                  "The terms do not tend to $0$, so the series does not converge at all.",
                  "各项不趋于 $0$，所以级数根本不收敛。",
                ],
            kind === "absolute"
              ? [
                  "It converges conditionally",
                  "It does converge, but the absolute values converge too, which makes the convergence absolute.",
                  "它确实收敛，但绝对值之和也收敛，所以是绝对收敛。",
                ]
              : [
                  "It converges conditionally",
                  "Conditional convergence still needs terms that tend to $0$, and these grow.",
                  "条件收敛仍然要求各项趋于 $0$，而这些项在增大。",
                ],
            kind === "absolute"
              ? [
                  "It diverges",
                  "The absolute values form a convergent $p$-series, so the series converges.",
                  "绝对值构成收敛的 $p$ 级数，所以级数收敛。",
                ]
              : [
                  "It diverges",
                  "The terms fall to $0$ in size and alternate in sign, so the alternating series test gives convergence.",
                  "各项的大小降到 $0$ 且符号交错，所以由交错级数判别法，它收敛。",
                ],
            kind === "diverges"
              ? ["It converges to zero", "The series diverges, so it has no sum at all.", "级数发散，根本没有和。"]
              : [
                  "It converges to zero",
                  `The sum lies between the partial sums $s_1 = -1$ and $s_2 = -1 + \\frac{1}{2^{${shown}}}$, which are both negative, so it is not $0$.`,
                  `和在部分和 $s_1 = -1$ 与 $s_2 = -1 + \\frac{1}{2^{${shown}}}$ 之间，两者都是负数，所以和不是 $0$。`,
                ],
          ];
          return reasoned(
            choose(
              rng,
              [
                `What does $\\sum_{k=1}^{\\infty} \\frac{(-1)^k}{k^{${shown}}}$ do?`,
                `$\\sum_{k=1}^{\\infty} \\frac{(-1)^k}{k^{${shown}}}$ 的敛散性如何？`,
              ],
              words[kind] as Pair,
              [...rest, ["It converges to zero", "收敛于零"]],
              asPair(
                solution(
                  [
                    [
                      ["Test the absolute values", "检验绝对值"],
                      kind === "absolute"
                        ? [
                            `$\\sum \\frac{1}{k^{${shown}}}$ is a $p$-series with $p = ${shown} > 1$, so it converges.`,
                            `$\\sum \\frac{1}{k^{${shown}}}$ 是 $p = ${shown} > 1$ 的 $p$ 级数，所以收敛。`,
                          ]
                        : kind === "conditional"
                          ? [
                              `$\\sum \\frac{1}{k^{${shown}}}$ is a $p$-series with $p = ${shown} \\le 1$, so it diverges.`,
                              `$\\sum \\frac{1}{k^{${shown}}}$ 是 $p = ${shown} \\le 1$ 的 $p$ 级数，所以发散。`,
                            ]
                          : [
                              `$\\frac{1}{k^{${shown}}} = k^{${frac(-a, b)}}$ grows with $k$, so the absolute values cannot have a finite sum.`,
                              `$\\frac{1}{k^{${shown}}} = k^{${frac(-a, b)}}$ 随 $k$ 增大，所以绝对值之和不可能有限。`,
                            ],
                    ],
                    [
                      ["Test the series itself", "检验级数本身"],
                      kind === "absolute"
                        ? [
                            "Absolute convergence implies convergence, so the series converges absolutely.",
                            "绝对收敛蕴含收敛，所以级数绝对收敛。",
                          ]
                        : kind === "conditional"
                          ? [
                              `The terms $\\frac{1}{k^{${shown}}}$ fall to $0$ and the signs alternate, so the alternating series test gives convergence. The convergence is conditional.`,
                              `各项 $\\frac{1}{k^{${shown}}}$ 降到 $0$ 且符号交错，所以由交错级数判别法，级数收敛。这是条件收敛。`,
                            ]
                          : ["The terms do not tend to $0$, so the series diverges.", "各项不趋于 $0$，所以级数发散。"],
                    ],
                  ],
                  [
                    `Comparing $p = ${shown}$ with $0$ and $1$ gives $${kind === "absolute" ? `${shown} > 1` : kind === "conditional" ? `0 < ${shown} \\le 1` : `${shown} < 0`}$, which is the ${kind === "absolute" ? "absolute" : kind === "conditional" ? "conditional" : "divergent"} case.`,
                    `把 $p = ${shown}$ 与 $0$ 和 $1$ 比较，得 $${kind === "absolute" ? `${shown} > 1` : kind === "conditional" ? `0 < ${shown} \\le 1` : `${shown} < 0`}$，属于${kind === "absolute" ? "绝对收敛" : kind === "conditional" ? "条件收敛" : "发散"}的情况。`,
                  ],
                ),
              ),
            ),
            reasons,
          );
        },
      ),
      point(
        "the-alternating-series-error",
        ["The alternating series error", "交错级数的误差"],
        [
          "For an alternating series whose terms fall steadily to zero, the partial sums swing around the limit, so the error of a partial sum is at most the size of the first term left out. This gives a usable guarantee that is rare among series. To reach a tolerance, find the first omitted term below it, and the partial sum that comes just before.\n\nFor $\\sum \\frac{(-1)^{k+1}}{k^2}$ and the tolerance $\\frac{1}{50}$: we need $(N + 1)^2 > 50$. $7^2 = 49$ is not enough and $8^2 = 64$ is, so $N + 1 = 8$ and $N = 7$.\n\nCheck: the error of $s_7$ is at most $\\frac{1}{64} < \\frac{1}{50}$, while for $s_6$ the bound $\\frac{1}{49}$ is above $\\frac{1}{50}$.\n\n> **Watch out.** The bound is the first omitted term $a_{N+1}$, not the last term kept. Solve for $N + 1$ and then subtract one.",
          "对各项稳步降到零的交错级数，部分和围绕极限摆动，所以部分和的误差不超过第一个被略去的项。这样的保证在级数中很少见，而且很实用。要达到给定误差，找到第一个小于它的被略去的项，取它之前的部分和。\n\n对 $\\sum \\frac{(-1)^{k+1}}{k^2}$ 和误差 $\\frac{1}{50}$：需要 $(N + 1)^2 > 50$。$7^2 = 49$ 不够，$8^2 = 64$ 够了，所以 $N + 1 = 8$，$N = 7$。\n\n检验：$s_7$ 的误差至多是 $\\frac{1}{64} < \\frac{1}{50}$，而 $s_6$ 的误差界 $\\frac{1}{49}$ 大于 $\\frac{1}{50}$。\n\n> **注意。** 误差界是第一个被略去的项 $a_{N+1}$，而不是保留的最后一项。先解出 $N + 1$，再减去一。",
        ],
        (rng) => {
          const p = rng.int(1, 3);
          const q = rng.int(5, 900);
          let answer = 1;
          while ((answer + 1) ** p <= q) answer++;
          const term = p === 1 ? "k" : `k^{${p}}`;
          const next = p === 1 ? "N + 1" : `(N + 1)^{${p}}`;
          const power = (v: number) => (p === 1 ? `${v}` : `${v}^{${p}} = ${v ** p}`);
          return solved(
            [
              `For $\\sum_{k=1}^{\\infty} \\frac{(-1)^{k+1}}{${term}}$, what is the smallest $N$ for which the bound on the error of the partial sum $s_N$ is below $\\frac{1}{${q}}$?`,
              `对 $\\sum_{k=1}^{\\infty} \\frac{(-1)^{k+1}}{${term}}$，部分和 $s_N$ 的误差界小于 $\\frac{1}{${q}}$ 的最小 $N$ 是多少？`,
            ],
            answer,
            [
              why(
                answer + 1,
                `That makes the last term kept small; the bound is the first omitted term, so $N = ${answer}$ already works.`,
                `这是让保留的最后一项变小；误差界是第一个被略去的项，所以 $N = ${answer}$ 已经可行。`,
              ),
              answer > 1
                ? why(
                    answer - 1,
                    `With $N = ${answer - 1}$ the first omitted term is $\\frac{1}{${answer ** p}}$, which is not below $\\frac{1}{${q}}$.`,
                    `若 $N = ${answer - 1}$，第一个被略去的项是 $\\frac{1}{${answer ** p}}$，不小于 $\\frac{1}{${q}}$。`,
                  )
                : why(answer + 2, "That index works, but it is not the smallest.", "这个下标可行，但不是最小的。"),
              why(
                q,
                `That ignores the power: the terms are $\\frac{1}{${term}}$, which shrink much faster than $\\frac{1}{k}$.`,
                `这忽略了幂：各项是 $\\frac{1}{${term}}$，比 $\\frac{1}{k}$ 缩小得快得多。`,
              ),
              why(q + 1, `That ignores the power and also takes one index too many.`, `这忽略了幂，而且多取了一个下标。`),
            ],
            solution(
              [
                [
                  ["Name the error bound", "写出误差界"],
                  [
                    `The terms fall steadily to $0$, so the error of $s_N$ is at most the first omitted term, $\\frac{1}{${next}}$.`,
                    `各项稳步降到 $0$，所以 $s_N$ 的误差至多是第一个被略去的项 $\\frac{1}{${next}}$。`,
                  ],
                ],
                [
                  ["Solve for the index", "解出下标"],
                  [
                    `We need $${next} > ${q}$. $${power(answer)}$ is not above $${q}$, but $${power(answer + 1)}$ is, so $N + 1 = ${answer + 1}$ and $N = ${answer}$.`,
                    `需要 $${next} > ${q}$。$${power(answer)}$ 不大于 $${q}$，而 $${power(answer + 1)}$ 大于它，所以 $N + 1 = ${answer + 1}$，$N = ${answer}$。`,
                  ],
                ],
              ],
              [
                `The bound for $s_{${answer}}$ is $\\frac{1}{${(answer + 1) ** p}} < \\frac{1}{${q}}$${answer > 1 ? `, while for $s_{${answer - 1}}$ it is $\\frac{1}{${answer ** p}}$, which is not below $\\frac{1}{${q}}$` : ""}.`,
                `$s_{${answer}}$ 的误差界是 $\\frac{1}{${(answer + 1) ** p}} < \\frac{1}{${q}}$${answer > 1 ? `，而 $s_{${answer - 1}}$ 的误差界是 $\\frac{1}{${answer ** p}}$，不小于 $\\frac{1}{${q}}$` : ""}。`,
              ],
            ),
          );
        },
      ),
    ],
  ),
  intro: t(
    "Consider $\\sum \\frac{(-1)^k}{\\sqrt{k}}$. The terms fall to $0$ in size and alternate in sign, so the alternating series test makes it converge. But $\\sum \\frac{1}{\\sqrt{k}}$ is the $p$-series with $p = \\frac{1}{2} \\le 1$, which diverges, so the convergence is conditional.\n\nCheck: by contrast $\\sum \\frac{(-1)^k}{k^2}$ converges absolutely, since $\\sum \\frac{1}{k^2}$ has $p = 2 > 1$.\n\nIn this lesson we classify alternating series as absolutely or conditionally convergent, and bound the error of a partial sum.",
    "看 $\\sum \\frac{(-1)^k}{\\sqrt{k}}$。各项的大小降到 $0$ 且符号交错，所以由交错级数判别法，它收敛。但 $\\sum \\frac{1}{\\sqrt{k}}$ 是 $p = \\frac{1}{2} \\le 1$ 的 $p$ 级数，它发散，所以这是条件收敛。\n\n检验：相比之下，$\\sum \\frac{(-1)^k}{k^2}$ 绝对收敛，因为 $\\sum \\frac{1}{k^2}$ 的 $p = 2 > 1$。\n\n本课我们判断交错级数是绝对收敛还是条件收敛，并估计部分和的误差。",
  ),
};

const epsilonDelta = {
  ...topic(
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
          "A limit statement says that for every tolerance $\\varepsilon$ on the output, there is a tolerance $\\delta$ on the input that guarantees it. For a linear function, the output distance equals the slope times the input distance exactly, so the largest $\\delta$ that works is $\\varepsilon$ divided by the size of the slope. The direction of the slope makes no difference, as only distances appear.\n\nFor $f(x) = -4x + 1$ at $a = 3$ and $\\varepsilon = \\frac{1}{5}$: $|f(x) - f(3)| = 4|x - 3|$, so $\\delta = \\frac{1}{4} \\cdot \\frac{1}{5} = \\frac{1}{20}$.\n\nCheck: at $x = 3 + \\frac{1}{20}$ the output distance is $4 \\cdot \\frac{1}{20} = \\frac{1}{5}$ exactly, so no larger $\\delta$ works.\n\n> **Watch out.** Divide $\\varepsilon$ by the size of the slope; do not multiply. And use $|m|$: a negative slope does not give a negative $\\delta$.",
          "极限命题是说，对输出上的每个误差 $\\varepsilon$，都有输入上的误差 $\\delta$ 能保证它。对线性函数，输出距离恰好等于斜率乘输入距离，所以可行的最大 $\\delta$ 是 $\\varepsilon$ 除以斜率的大小。斜率的方向没有影响，因为只涉及距离。\n\n对 $f(x) = -4x + 1$，$a = 3$，$\\varepsilon = \\frac{1}{5}$：$|f(x) - f(3)| = 4|x - 3|$，所以 $\\delta = \\frac{1}{4} \\cdot \\frac{1}{5} = \\frac{1}{20}$。\n\n检验：在 $x = 3 + \\frac{1}{20}$ 处，输出距离恰好是 $4 \\cdot \\frac{1}{20} = \\frac{1}{5}$，所以更大的 $\\delta$ 不行。\n\n> **注意。** 要用 $\\varepsilon$ 除以斜率的大小，而不是乘。要用 $|m|$：负的斜率不会给出负的 $\\delta$。",
        ],
        (rng) => {
          const m = rng.pick([-9, -7, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]);
          const c = rng.int(-8, 8);
          const a = rng.int(-5, 5);
          const { k, tex } = eps(rng);
          const answer = Q.of(1, k * Math.abs(m));
          const M = Math.abs(m);
          return solved(
            [
              `Let $f(x) = ${m}x${signed(c)}$. What is the largest $\\delta$ such that $${distance("x", a)} < \\delta$ guarantees $|f(x) - f(${a})| < ${tex}$?`,
              `设 $f(x) = ${m}x${signed(c)}$。使 $${distance("x", a)} < \\delta$ 保证 $|f(x) - f(${a})| < ${tex}$ 的最大 $\\delta$ 是多少？`,
            ],
            answer,
            [
              why(
                Q.of(1, k),
                `That takes $\\delta = \\varepsilon$; the output moves $${M}$ times as far as the input.`,
                `这是取 $\\delta = \\varepsilon$；输出移动的距离是输入的 $${M}$ 倍。`,
              ),
              why(Q.of(M, k), `That multiplies $\\varepsilon$ by $${M}$; it must be divided.`, `这是用 $${M}$ 乘 $\\varepsilon$；应该除。`),
              why(
                Q.of(1, k + M),
                `That adds the slope to $${k}$; dividing $${tex}$ by $${M}$ multiplies the denominators.`,
                `这是把斜率加到 $${k}$ 上；用 $${M}$ 除 $${tex}$ 要把分母相乘。`,
              ),
              why(
                Q.of(1, 2 * k * M),
                "That $\\delta$ works, but it is only half of the largest one.",
                "这个 $\\delta$ 可行，但只是最大值的一半。",
              ),
            ],
            solution(
              [
                [
                  ["Measure the output distance", "度量输出距离"],
                  [
                    `$f$ changes by $${m}$ for each unit of input, so $|f(x) - f(${a})| = ${M}${distance("x", a)}$.`,
                    `输入每变化一个单位，$f$ 变化 $${m}$，所以 $|f(x) - f(${a})| = ${M}${distance("x", a)}$。`,
                  ],
                ],
                [
                  ["Divide the tolerance", "用误差除以斜率"],
                  [
                    `$${M}${distance("x", a)} < ${tex}$ exactly when $${distance("x", a)} < \\frac{1}{${M}} \\cdot ${tex} = ${answer.toLatex()}$, so $\\delta = ${answer.toLatex()}$.`,
                    `$${M}${distance("x", a)} < ${tex}$ 当且仅当 $${distance("x", a)} < \\frac{1}{${M}} \\cdot ${tex} = ${answer.toLatex()}$，所以 $\\delta = ${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `At $x = ${a === 0 ? "" : `${a} + `}${answer.toLatex()}$ the output distance is $${M} \\cdot ${answer.toLatex()} = ${tex}$ exactly, so any larger $\\delta$ lets it reach $${tex}$.`,
                `在 $x = ${a === 0 ? "" : `${a} + `}${answer.toLatex()}$ 处，输出距离恰好是 $${M} \\cdot ${answer.toLatex()} = ${tex}$，所以更大的 $\\delta$ 会让它达到 $${tex}$。`,
              ],
            ),
          );
        },
      ),
      point(
        "delta-for-a-square",
        ["Delta for the square function", "平方函数的 δ"],
        [
          "For a nonlinear function the slope changes, so a proof first restricts the input to a bounded region. For the square function near $a$, the difference of squares factors as the input distance times $x + a$, and restricting $x$ to within $1$ of $a$ bounds that factor by $2a + 1$. Then $\\delta$ is the smaller of $1$ and $\\varepsilon$ over that bound.\n\nFor $a = 3$ and $\\varepsilon = \\frac{1}{2}$: with $|x - 3| \\le 1$ we have $|x + 3| \\le 7$, so $\\delta = \\min(1, \\frac{1}{14}) = \\frac{1}{14}$.\n\nCheck: if $|x - 3| < \\frac{1}{14}$, then $|x^2 - 9| < 7 \\cdot \\frac{1}{14} = \\frac{1}{2}$.\n\n> **Watch out.** Bound the factor $|x + a|$ before dividing. Its value $2a$ at $x = a$ is too small, since $x$ may be a little larger than $a$.",
          "对非线性函数，斜率会变化，所以证明时先把输入限制在有界区域内。对 $a$ 附近的平方函数，平方差分解成输入距离乘 $x + a$，把 $x$ 限制在距 $a$ 不超过 $1$ 的范围内后，这个因子不超过 $2a + 1$。于是 $\\delta$ 取 $1$ 和 $\\varepsilon$ 除以这个界中较小的那个。\n\n对 $a = 3$ 和 $\\varepsilon = \\frac{1}{2}$：由 $|x - 3| \\le 1$ 得 $|x + 3| \\le 7$，所以 $\\delta = \\min(1, \\frac{1}{14}) = \\frac{1}{14}$。\n\n检验：若 $|x - 3| < \\frac{1}{14}$，则 $|x^2 - 9| < 7 \\cdot \\frac{1}{14} = \\frac{1}{2}$。\n\n> **注意。** 要先估计因子 $|x + a|$ 再除。它在 $x = a$ 处的值 $2a$ 太小，因为 $x$ 可能比 $a$ 稍大。",
        ],
        (rng) => {
          const a = rng.int(1, 12);
          const { k, tex } = eps(rng);
          const bound = 2 * a + 1;
          const answer = Q.of(1, k * bound);
          return solved(
            [
              `To prove $\\lim_{x \\to ${a}} x^2 = ${a * a}$ for $\\varepsilon = ${tex}$, first take $|x - ${a}| \\le 1$. What value of $\\delta$ does the standard bound give?`,
              `要对 $\\varepsilon = ${tex}$ 证明 $\\lim_{x \\to ${a}} x^2 = ${a * a}$，先取 $|x - ${a}| \\le 1$。标准的估计给出的 $\\delta$ 是多少？`,
            ],
            answer,
            [
              why(
                Q.of(1, k),
                `That ignores the factor $|x + ${a}|$; the output moves up to $${bound}$ times as far as the input.`,
                `这忽略了因子 $|x + ${a}|$；输出移动的距离可达输入的 $${bound}$ 倍。`,
              ),
              why(
                Q.of(1, 2 * a * k),
                `That bounds $|x + ${a}|$ by $${2 * a}$, its value at $x = ${a}$; nearby $x$ make it as large as $${bound}$.`,
                `这是用 $${2 * a}$，即 $x = ${a}$ 处的值，来估计 $|x + ${a}|$；附近的 $x$ 能使它达到 $${bound}$。`,
              ),
              why(
                Q.of(1, k * (a + 1)),
                `That bounds $|x + ${a}|$ by $${a + 1}$, which only bounds $|x|$; adding $${a}$ gives $${bound}$.`,
                `这是用 $${a + 1}$ 估计 $|x + ${a}|$，但它只是 $|x|$ 的界；再加 $${a}$ 得 $${bound}$。`,
              ),
              why(
                Q.of(1),
                `That is only the first restriction $|x - ${a}| \\le 1$; $\\delta$ must also be at most $\\frac{1}{${bound}} \\cdot ${tex}$.`,
                `这只是第一个限制 $|x - ${a}| \\le 1$；$\\delta$ 还必须不超过 $\\frac{1}{${bound}} \\cdot ${tex}$。`,
              ),
            ],
            solution(
              [
                [
                  ["Factor the difference", "分解差"],
                  [`$|x^2 - ${a * a}| = |x - ${a}|\\,|x + ${a}|$.`, `$|x^2 - ${a * a}| = |x - ${a}|\\,|x + ${a}|$。`],
                ],
                [
                  ["Bound the second factor", "估计第二个因子"],
                  [
                    `With $|x - ${a}| \\le 1$ we have $x \\le ${a + 1}$, so $|x + ${a}| \\le ${bound}$.`,
                    `由 $|x - ${a}| \\le 1$ 得 $x \\le ${a + 1}$，所以 $|x + ${a}| \\le ${bound}$。`,
                  ],
                ],
                [
                  ["Choose the input tolerance", "选取输入的误差"],
                  [
                    `$\\delta = \\min(1, \\frac{1}{${bound}} \\cdot ${tex}) = ${answer.toLatex()}$, which is below $1$.`,
                    `$\\delta = \\min(1, \\frac{1}{${bound}} \\cdot ${tex}) = ${answer.toLatex()}$，它小于 $1$。`,
                  ],
                ],
              ],
              [
                `If $|x - ${a}| < ${answer.toLatex()}$, then $|x^2 - ${a * a}| < ${bound} \\cdot ${answer.toLatex()} = ${tex}$.`,
                `若 $|x - ${a}| < ${answer.toLatex()}$，则 $|x^2 - ${a * a}| < ${bound} \\cdot ${answer.toLatex()} = ${tex}$。`,
              ],
            ),
          );
        },
      ),
    ],
  ),
  intro: t(
    "To prove $\\lim_{x \\to 2} 3x = 6$ with $\\varepsilon = \\frac{1}{10}$: $|3x - 6| = 3|x - 2|$, so $|x - 2| < \\frac{1}{30}$ gives $|3x - 6| < \\frac{1}{10}$, and $\\delta = \\frac{1}{30}$ works.\n\nCheck: at $x = 2 + \\frac{1}{30}$, $3x - 6 = \\frac{1}{10}$ exactly, so no larger $\\delta$ works.\n\nIn this lesson we find a $\\delta$ for a given $\\varepsilon$, first for linear functions and then for the square function.",
    "要对 $\\varepsilon = \\frac{1}{10}$ 证明 $\\lim_{x \\to 2} 3x = 6$：$|3x - 6| = 3|x - 2|$，所以 $|x - 2| < \\frac{1}{30}$ 给出 $|3x - 6| < \\frac{1}{10}$，$\\delta = \\frac{1}{30}$ 可行。\n\n检验：在 $x = 2 + \\frac{1}{30}$ 处，$3x - 6$ 恰好等于 $\\frac{1}{10}$，所以更大的 $\\delta$ 不行。\n\n本课我们对给定的 $\\varepsilon$ 求出 $\\delta$，先对线性函数，再对平方函数。",
  ),
};

const sequentialContinuity = {
  ...topic(
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
          "A function is continuous at a point exactly when it sends every sequence converging to that point to a sequence converging to the value there. So a continuous function may be moved inside a limit of a sequence. This turns a limit that looks awkward into a single evaluation, once the limit of the inner sequence is known, and it fails at any jump in the function.\n\nFor $f(x) = x^2 + 3x$ and $x_n = -1 + \\frac{2}{n}$: $x_n \\to -1$, so $f(x_n) \\to f(-1) = 1 - 3 = -2$.\n\nCheck: expanding, $f(x_n) = -2 + \\frac{2}{n} + \\frac{4}{n^2}$, which tends to $-2$.\n\n> **Watch out.** Put the limit of $x_n$ into $f$, not its first term $x_1$. And the answer is $f(\\lim x_n)$, not $\\lim x_n$ itself.",
          "函数在一点连续，当且仅当它把每个收敛到这一点的序列送到收敛到该点函数值的序列。所以连续函数可以移到序列极限的里面。这样，只要知道里面序列的极限，看起来麻烦的极限就变成了一次求值，而在函数的跳跃点这样做是不行的。\n\n对 $f(x) = x^2 + 3x$ 和 $x_n = -1 + \\frac{2}{n}$：$x_n \\to -1$，所以 $f(x_n) \\to f(-1) = 1 - 3 = -2$。\n\n检验：展开得 $f(x_n) = -2 + \\frac{2}{n} + \\frac{4}{n^2}$，它趋向 $-2$。\n\n> **注意。** 要把 $x_n$ 的极限代入 $f$，而不是它的第一项 $x_1$。答案是 $f(\\lim x_n)$，而不是 $\\lim x_n$ 本身。",
        ],
        (rng) => {
          const a = rng.int(-5, 6);
          const b = rng.int(1, 9);
          const p = rng.int(1, 5);
          const c = rng.int(-6, 6);
          const answer = a * a + p * a + c;
          const value = a === 0 ? `f(0) = ${c}` : `f(${a}) = ${a * a}${signed(p * a)}${signed(c)} = ${answer}`;
          return solved(
            [
              `Let $f(x) = x^2 + ${times(p, "x")}${signed(c)}$ and $x_n = ${a} + \\frac{${b}}{n}$. What is $\\lim_{n \\to \\infty} f(x_n)$?`,
              `设 $f(x) = x^2 + ${times(p, "x")}${signed(c)}$，$x_n = ${a} + \\frac{${b}}{n}$。$\\lim_{n \\to \\infty} f(x_n)$ 是多少？`,
            ],
            answer,
            [
              why(
                a,
                `That is the limit of $x_n$; the question asks for the limit of $f(x_n)$.`,
                `这是 $x_n$ 的极限；题目问的是 $f(x_n)$ 的极限。`,
              ),
              why(
                answer + b,
                `That adds $${b}$, but the shift $\\frac{${b}}{n}$ in $x_n$ tends to $0$ and changes nothing in the limit.`,
                `这加上了 $${b}$，但 $x_n$ 中的 $\\frac{${b}}{n}$ 趋向 $0$，对极限没有影响。`,
              ),
              why(
                a * a + c,
                `That leaves out the term $${times(p, "x")}$ when evaluating $f(${a})$.`,
                `这是在计算 $f(${a})$ 时漏掉了 $${times(p, "x")}$ 这一项。`,
              ),
              why(answer + p, `That adds an extra $${p}$; evaluate $f(${a})$ term by term.`, `这多加了 $${p}$；要逐项计算 $f(${a})$。`),
            ],
            solution(
              [
                [
                  ["Find the limit of the inputs", "求输入的极限"],
                  [`$x_n = ${a} + \\frac{${b}}{n} \\to ${a}$.`, `$x_n = ${a} + \\frac{${b}}{n} \\to ${a}$。`],
                ],
                [
                  ["Use continuity", "利用连续性"],
                  [
                    `$f$ is a polynomial, hence continuous, so $\\lim f(x_n) = ${value}$.`,
                    `$f$ 是多项式，因而连续，所以 $\\lim f(x_n) = ${value}$。`,
                  ],
                ],
              ],
              [
                `$f(x_n) - f(${a})$ factors as $\\frac{${b}}{n}(x_n${signed(a + p)})$, and the second factor stays bounded, so the difference tends to $0$.`,
                `$f(x_n) - f(${a})$ 可分解为 $\\frac{${b}}{n}(x_n${signed(a + p)})$，第二个因子有界，所以差趋向 $0$。`,
              ],
            ),
          );
        },
      ),
      point(
        "two-sequences-reveal-a-jump",
        ["Two sequences reveal a jump", "两个序列揭示跳跃"],
        [
          "To prove that a function is not continuous, it is enough to find two sequences approaching the same point whose images approach different values. Sequences from the left and from the right do this at a jump, and their limits differ by the size of the jump. A single sequence that behaves well proves nothing, because continuity requires every sequence to behave.\n\nLet $f(x) = 1$ for $x \\le 0$ and $f(x) = 4$ for $x > 0$. Then $x_n = \\frac{1}{n}$ gives $f(x_n) = 4$, and $y_n = -\\frac{1}{n}$ gives $f(y_n) = 1$, so the images tend to values $3$ apart.\n\nCheck: $f(0) = 1$ matches the limit from the left but not the one from the right, so $f$ is not continuous at $0$.\n\n> **Watch out.** $x_n = a + \\frac{r}{n}$ stays to the right of $a$, where $f$ takes its right-hand value, even as it approaches $a$. Do not use $f(a)$ for it.",
          "要证明函数不连续，只需找到两个趋于同一点的序列，它们的像趋于不同的值。在跳跃点，来自左边和右边的序列就能做到这一点，它们的极限之差就是跳跃的大小。一个表现良好的序列什么也证明不了，因为连续性要求每个序列都表现良好。\n\n设 $x \\le 0$ 时 $f(x) = 1$，$x > 0$ 时 $f(x) = 4$。则 $x_n = \\frac{1}{n}$ 给出 $f(x_n) = 4$，$y_n = -\\frac{1}{n}$ 给出 $f(y_n) = 1$，两个像趋向的值相差 $3$。\n\n检验：$f(0) = 1$ 与左极限一致，但与右极限不一致，所以 $f$ 在 $0$ 处不连续。\n\n> **注意。** $x_n = a + \\frac{r}{n}$ 一直在 $a$ 的右边，即使它趋近 $a$，$f$ 在它上面取的也是右边的值。不要用 $f(a)$ 代替。",
        ],
        (rng) => {
          const p = rng.int(-9, 9);
          const q = p + rng.pick([-8, -5, -3, -2, 2, 3, 4, 6, 7, 9]);
          const a = rng.int(-4, 6);
          const r = rng.int(1, 4);
          const answer = Math.abs(q - p);
          return solved(
            [
              `Let $f(x) = ${p}$ for $x \\le ${a}$ and $f(x) = ${q}$ for $x > ${a}$. With $x_n = ${a} + \\frac{${r}}{n}$ and $y_n = ${a} - \\frac{${r}}{n}$, what is the absolute difference of $\\lim f(x_n)$ and $\\lim f(y_n)$?`,
              `设 $x \\le ${a}$ 时 $f(x) = ${p}$，$x > ${a}$ 时 $f(x) = ${q}$。取 $x_n = ${a} + \\frac{${r}}{n}$，$y_n = ${a} - \\frac{${r}}{n}$，$\\lim f(x_n)$ 和 $\\lim f(y_n)$ 之差的绝对值是多少？`,
            ],
            answer,
            [
              why(
                0,
                `Both sequences tend to $${a}$, but their images tend to $${q}$ and $${p}$, which differ.`,
                `两个序列都趋向 $${a}$，但它们的像趋向 $${q}$ 和 $${p}$，两者不同。`,
              ),
              why(
                Math.abs(p) + Math.abs(q) === answer ? answer + 1 : Math.abs(p) + Math.abs(q),
                `The images tend to $${q}$ and $${p}$, which differ by $|${q} - ${paren(p)}| = ${answer}$.`,
                `两个像趋向 $${q}$ 和 $${p}$，相差 $|${q} - ${paren(p)}| = ${answer}$。`,
              ),
              why(
                r,
                `That is the offset $${r}$ of the sequences; the images depend only on the side of $${a}$ each sequence is on.`,
                `这是序列的偏移量 $${r}$；像只取决于序列在 $${a}$ 的哪一边。`,
              ),
              why(
                answer + 2 * r,
                `That adds the distance between $x_1$ and $y_1$; only the values of $f$ matter.`,
                `这加上了 $x_1$ 与 $y_1$ 之间的距离；只有 $f$ 的值才相关。`,
              ),
            ],
            solution(
              [
                [
                  ["Follow each sequence", "跟踪每个序列"],
                  [
                    `$x_n > ${a}$, so $f(x_n) = ${q}$ for every $n$. $y_n < ${a}$, so $f(y_n) = ${p}$.`,
                    `$x_n > ${a}$，所以对每个 $n$ 都有 $f(x_n) = ${q}$。$y_n < ${a}$，所以 $f(y_n) = ${p}$。`,
                  ],
                ],
                [
                  ["Compare the limits", "比较极限"],
                  [
                    `$\\lim f(x_n) = ${q}$ and $\\lim f(y_n) = ${p}$ differ by $|${q} - ${paren(p)}| = ${answer}$.`,
                    `$\\lim f(x_n) = ${q}$ 与 $\\lim f(y_n) = ${p}$ 相差 $|${q} - ${paren(p)}| = ${answer}$。`,
                  ],
                ],
              ],
              [
                `Both $x_n$ and $y_n$ tend to $${a}$, so a continuous $f$ would send them to the same limit. The gap of $${answer}$ shows that $f$ jumps at $${a}$.`,
                `$x_n$ 和 $y_n$ 都趋向 $${a}$，连续的 $f$ 会把它们送到同一个极限。相差 $${answer}$ 说明 $f$ 在 $${a}$ 处跳跃。`,
              ],
            ),
          );
        },
      ),
    ],
  ),
  intro: t(
    "Let $f(x) = x^2 + 1$ and $x_n = 2 + \\frac{1}{n}$. Since $x_n \\to 2$ and $f$ is continuous, $f(x_n) \\to f(2) = 5$.\n\nCheck: $f(x_n) = 4 + \\frac{4}{n} + \\frac{1}{n^2} + 1 = 5 + \\frac{4}{n} + \\frac{1}{n^2}$, which tends to $5$.\n\nIn this lesson we use sequences to evaluate limits of continuous functions and to detect jumps.",
    "设 $f(x) = x^2 + 1$，$x_n = 2 + \\frac{1}{n}$。因为 $x_n \\to 2$ 且 $f$ 连续，所以 $f(x_n) \\to f(2) = 5$。\n\n检验：$f(x_n) = 4 + \\frac{4}{n} + \\frac{1}{n^2} + 1 = 5 + \\frac{4}{n} + \\frac{1}{n^2}$，它趋向 $5$。\n\n本课我们用序列求连续函数的极限，并发现函数的跳跃。",
  ),
};

const metricSpaces = {
  ...topic(
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
            "A metric is any distance function that is positive apart from equal points, symmetric, and satisfies the triangle inequality. The plane has several natural ones: the Euclidean distance, the taxicab distance that adds the coordinate differences, and the maximum distance that takes the larger of them. They disagree on values, but they agree on which sequences converge, so they describe the same open sets.\n\nFrom $(0, 0)$ to $(5, 12)$ the Euclidean distance is $\\sqrt{25 + 144} = 13$, the taxicab distance is $5 + 12 = 17$, and the maximum distance is $12$.\n\nCheck: $12 \\le 13 \\le 17$: the maximum distance never exceeds the Euclidean one, which never exceeds the taxicab one.\n\n> **Watch out.** Read which metric is asked for. The taxicab distance adds the two differences, and the maximum distance keeps only the larger one, not the smaller.",
            "度量是这样的距离函数：不同点之间的距离为正，具有对称性，并满足三角不等式。平面上有几种自然的度量：欧几里得距离，把坐标差相加的出租车距离，以及取其中较大者的最大值距离。它们的值不同，但在哪些序列收敛上是一致的，所以描述的是相同的开集。\n\n从 $(0, 0)$ 到 $(5, 12)$，欧几里得距离是 $\\sqrt{25 + 144} = 13$，出租车距离是 $5 + 12 = 17$，最大值距离是 $12$。\n\n检验：$12 \\le 13 \\le 17$：最大值距离从不超过欧几里得距离，后者从不超过出租车距离。\n\n> **注意。** 看清问的是哪种度量。出租车距离把两个差相加，最大值距离只保留较大的那个，而不是较小的。",
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
            const applied: Pair[] = [
              [
                `$\\sqrt{${dx}^2 + ${dy}^2} = \\sqrt{${dx * dx + dy * dy}} = ${euclid}$.`,
                `$\\sqrt{${dx}^2 + ${dy}^2} = \\sqrt{${dx * dx + dy * dy}} = ${euclid}$。`,
              ],
              [`$${dx} + ${dy} = ${dx + dy}$.`, `$${dx} + ${dy} = ${dx + dy}$。`],
              [`$\\max(${dx}, ${dy}) = ${Math.max(dx, dy)}$.`, `$\\max(${dx}, ${dy}) = ${Math.max(dx, dy)}$。`],
            ];
            return solved(
              [
                `What is the ${name[0]} distance between $(${x}, ${y})$ and $${point2}$?`,
                `$(${x}, ${y})$ 和 $${point2}$ 之间的${name[1]}距离是多少？`,
              ],
              answer,
              [
                why(
                  euclid,
                  `That is the Euclidean distance, $\\sqrt{${dx}^2 + ${dy}^2}$.`,
                  `这是欧几里得距离 $\\sqrt{${dx}^2 + ${dy}^2}$。`,
                ),
                why(dx + dy, "That is the taxicab distance, the sum of the differences.", "这是出租车距离，即两个差之和。"),
                why(
                  Math.max(dx, dy),
                  "That is the maximum distance, the larger of the differences.",
                  "这是最大值距离，即两个差中较大的那个。",
                ),
                why(
                  Math.min(dx, dy),
                  "That is the smaller coordinate difference, which none of these metrics uses on its own.",
                  "这是较小的坐标差，这几种度量都不单独用它。",
                ),
              ],
              solution(
                [
                  [
                    ["Find the coordinate differences", "求坐标差"],
                    [
                      `$|${x + dx} - ${paren(x)}| = ${dx}$ and $|${y + dy} - ${paren(y)}| = ${dy}$.`,
                      `$|${x + dx} - ${paren(x)}| = ${dx}$，$|${y + dy} - ${paren(y)}| = ${dy}$。`,
                    ],
                  ],
                  [["Apply the metric", "套用度量"], applied[kind] as Pair],
                ],
                [
                  `The maximum, Euclidean and taxicab distances are $${Math.max(dx, dy)} \\le ${euclid} \\le ${dx + dy}$, in the order they always come.`,
                  `最大值距离、欧几里得距离和出租车距离依次是 $${Math.max(dx, dy)} \\le ${euclid} \\le ${dx + dy}$，总是这样的顺序。`,
                ],
              ),
            );
          },
        ),
        figure: analysisDrawings1["distances-in-metric-spaces#three-distances-in-the-plane"],
      },
      point(
        "membership-of-a-taxicab-ball",
        ["Membership of a taxicab ball", "出租车度量下的球"],
        [
          "An open ball is the set of points at distance less than the radius from the centre, and its shape depends on the metric. For the taxicab metric, a ball in the plane is a diamond, so a point can lie inside a Euclidean disc and outside the diamond of the same radius. To test a point, compute its distance in the given metric and compare, without relying on a picture of a round ball.\n\nFor the taxicab ball of radius $5$ about $(0, 0)$: the point $(2, 2)$ has distance $2 + 2 = 4 < 5$, so it lies inside, but $(3, 3)$ has distance $6$, so it lies outside.\n\nCheck: $(3, 3)$ is only $\\sqrt{18} < 5$ from the centre in the Euclidean sense, which shows how the two balls differ.\n\n> **Watch out.** Do not judge by the Euclidean distance or a round picture. Add the two coordinate differences and compare the sum with the radius.",
          "开球是到中心的距离小于半径的点的集合，它的形状取决于度量。在出租车度量下，平面上的球是菱形，所以一个点可以在同半径的欧几里得圆内而在菱形外。要检验一个点，就用给定的度量算出距离再比较，不要依赖圆球的印象。\n\n对以 $(0, 0)$ 为中心、半径为 $5$ 的出租车度量球：点 $(2, 2)$ 的距离是 $2 + 2 = 4 < 5$，所以在球内；而 $(3, 3)$ 的距离是 $6$，所以在球外。\n\n检验：按欧几里得距离，$(3, 3)$ 到中心只有 $\\sqrt{18} < 5$，这说明两种球是不同的。\n\n> **注意。** 不要按欧几里得距离或圆形的图来判断。要把两个坐标差相加，再把和与半径比较。",
        ],
        (rng) => {
          const r = rng.int(4, 12);
          const a = rng.int(1, r - 2);
          const b = rng.int(0, r - a - 1);
          const h = rng.int(-5, 5);
          const v = rng.int(-5, 5);
          const at = (x: number, y: number) => same(`(${x + h}, ${y + v})`);
          const centre = `(${h}, ${v})`;
          const outside = (x: number, y: number): Reason =>
            reason(
              `(${x + h}, ${y + v})`,
              `Its taxicab distance from the centre is $${x} + ${y} = ${r + 1}$, which is not below $${r}$.`,
              `它到中心的出租车距离是 $${x} + ${y} = ${r + 1}$，不小于 $${r}$。`,
            );
          return reasoned(
            choose(
              rng,
              [
                `Which of these points lies in the open taxicab ball of radius $${r}$ about $${centre}$?`,
                `下列哪个点在以 $${centre}$ 为中心、半径为 $${r}$ 的出租车度量开球内？`,
              ],
              at(a, b),
              [at(r, 1), at(r - 1, 2), at(r - 2, 3)],
              asPair(
                solution(
                  [
                    [
                      ["Measure from the centre", "从中心量起"],
                      [
                        `The coordinate differences of $(${a + h}, ${b + v})$ from $${centre}$ are $${a}$ and $${b}$, so its taxicab distance is $${a} + ${b} = ${a + b}$.`,
                        `$(${a + h}, ${b + v})$ 与 $${centre}$ 的坐标差是 $${a}$ 和 $${b}$，所以它的出租车距离是 $${a} + ${b} = ${a + b}$。`,
                      ],
                    ],
                    [
                      ["Compare with the radius", "与半径比较"],
                      [
                        `$${a + b} < ${r}$, so the point lies in the ball. Each of the other points is at distance $${r + 1}$.`,
                        `$${a + b} < ${r}$，所以这个点在球内。其他几个点的距离都是 $${r + 1}$。`,
                      ],
                    ],
                  ],
                  [
                    `$(${a + h}, ${b + v})$ satisfies $${distance("x", h)} + ${distance("y", v)} < ${r}$, the diamond that this ball is.`,
                    `$(${a + h}, ${b + v})$ 满足 $${distance("x", h)} + ${distance("y", v)} < ${r}$，这个菱形正是这个球。`,
                  ],
                ),
              ),
            ),
            [outside(r, 1), outside(r - 1, 2), outside(r - 2, 3)],
          );
        },
      ),
    ],
  ),
  intro: t(
    "From $(1, 2)$ to $(4, 6)$ the coordinate differences are $3$ and $4$. The Euclidean distance is $\\sqrt{9 + 16} = 5$, the taxicab distance is $3 + 4 = 7$, and the maximum distance is $4$.\n\nCheck: $4 \\le 5 \\le 7$, the order in which these three distances always come.\n\nIn this lesson we compute distances in three metrics on the plane, and test whether a point lies in a ball.",
    "从 $(1, 2)$ 到 $(4, 6)$，坐标差是 $3$ 和 $4$。欧几里得距离是 $\\sqrt{9 + 16} = 5$，出租车距离是 $3 + 4 = 7$，最大值距离是 $4$。\n\n检验：$4 \\le 5 \\le 7$，这三种距离总是这样的顺序。\n\n本课我们计算平面上三种度量下的距离，并判断点是否在球内。",
  ),
};

const openClosed = {
  ...topic(
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
          "A set is open when each of its points has a small interval around it inside the set, and closed when it contains all its limit points. These are not opposites. A half-open interval is neither, since its included endpoint has no surrounding interval and its excluded endpoint is a limit point. The whole line and the empty set are both, and a finite set of points is closed.\n\nTake $[0, 1)$. The point $0$ belongs to it, but every interval around $0$ contains negative numbers, so the set is not open. The point $1$ is a limit point, approached by $1 - \\frac{1}{n}$, but it is missing, so the set is not closed either.\n\nCheck: the complement $(-\\infty, 0) \\cup [1, \\infty)$ is not open at $1$, which agrees: a set is closed exactly when its complement is open.\n\n> **Watch out.** Not open does not mean closed. Test each property on its own: look for a point of the set with no interval around it, and for a limit point missing from the set.",
          "如果集合的每个点周围都有一个小区间在集合内，集合就是开的；如果它包含所有极限点，就是闭的。这两者并不对立。半开区间两者都不是，因为包含的端点周围没有区间，而不包含的端点是极限点。整条直线和空集既开又闭，有限点集是闭的。\n\n看 $[0, 1)$。点 $0$ 属于它，但 $0$ 周围的每个区间都含有负数，所以这个集合不是开的。点 $1$ 是极限点，$1 - \\frac{1}{n}$ 趋近它，但它不在集合中，所以集合也不是闭的。\n\n检验：补集 $(-\\infty, 0) \\cup [1, \\infty)$ 在 $1$ 处不是开的，这与结论一致：集合是闭的，当且仅当它的补集是开的。\n\n> **注意。** 不是开集并不意味着是闭集。要分别检验两个性质：找集合中周围没有区间的点，再找不在集合中的极限点。",
        ],
        (rng) => {
          const a = rng.int(-9, 6);
          const b = a + rng.int(1, 9);
          type Case = {
            tex: string;
            kind: "open" | "closed" | "neither" | "both";
            open: Pair;
            closed: Pair;
            complement: Pair;
          };
          const inside: Pair = [
            "Every point of it has a small interval around it inside the set, so it is open.",
            "它的每个点周围都有小区间在集合内，所以它是开的。",
          ];
          const noInterval = (p: number): Pair => [
            `$${p}$ belongs to the set, but every interval around $${p}$ reaches outside it, so it is not open.`,
            `$${p}$ 属于这个集合，但 $${p}$ 周围的每个区间都伸到集合外，所以它不是开的。`,
          ];
          const missing = (p: number): Pair => [
            `$${p}$ is a limit point of the set that does not belong to it, so it is not closed.`,
            `$${p}$ 是集合的极限点，但不属于它，所以它不是闭的。`,
          ];
          const allLimits: Pair = ["Every limit point of it belongs to it, so it is closed.", "它的每个极限点都属于它，所以它是闭的。"];
          const complementOpen = (tex: string): Pair => [
            `The complement $${tex}$ is open, which agrees: the set is closed.`,
            `补集 $${tex}$ 是开的，这与结论一致：集合是闭的。`,
          ];
          const complementNot = (tex: string, p: string): Pair => [
            `The complement $${tex}$ is not open at $${p}$, which agrees: the set is not closed.`,
            `补集 $${tex}$ 在 $${p}$ 处不是开的，这与结论一致：集合不是闭的。`,
          ];
          const cases: Case[] = [
            {
              tex: `(${a}, ${b})`,
              kind: "open",
              open: inside,
              closed: missing(a),
              complement: complementNot(`(-\\infty, ${a}] \\cup [${b}, \\infty)`, `${a}`),
            },
            {
              tex: `[${a}, ${b}]`,
              kind: "closed",
              open: noInterval(a),
              closed: allLimits,
              complement: complementOpen(`(-\\infty, ${a}) \\cup (${b}, \\infty)`),
            },
            {
              tex: `[${a}, ${b})`,
              kind: "neither",
              open: noInterval(a),
              closed: missing(b),
              complement: complementNot(`(-\\infty, ${a}) \\cup [${b}, \\infty)`, `${b}`),
            },
            {
              tex: `(${a}, ${b}]`,
              kind: "neither",
              open: noInterval(b),
              closed: missing(a),
              complement: complementNot(`(-\\infty, ${a}] \\cup (${b}, \\infty)`, `${a}`),
            },
            {
              tex: `(${a}, \\infty)`,
              kind: "open",
              open: inside,
              closed: missing(a),
              complement: complementNot(`(-\\infty, ${a}]`, `${a}`),
            },
            {
              tex: `(-\\infty, ${b}]`,
              kind: "closed",
              open: noInterval(b),
              closed: allLimits,
              complement: complementOpen(`(${b}, \\infty)`),
            },
            {
              tex: `\\{${a}, ${b}\\}`,
              kind: "closed",
              open: noInterval(a),
              closed: [
                "A finite set has no limit points at all, so it contains all of them and is closed.",
                "有限集根本没有极限点，所以它包含所有极限点，是闭的。",
              ],
              complement: complementOpen(`(-\\infty, ${a}) \\cup (${a}, ${b}) \\cup (${b}, \\infty)`),
            },
            {
              tex: `\\{\\frac{1}{n} : n \\ge 1\\} \\cup (${b + 2}, ${b + 3})`,
              kind: "neither",
              open: noInterval(1),
              closed: [
                "$0$ is a limit point, approached by $\\frac{1}{n}$, but it does not belong to the set, so it is not closed.",
                "$0$ 是极限点，$\\frac{1}{n}$ 趋近它，但它不属于这个集合，所以集合不是闭的。",
              ],
              complement: [
                "The complement contains $0$, and every interval around $0$ contains some $\\frac{1}{n}$, so the complement is not open, which agrees: the set is not closed.",
                "补集含有 $0$，而 $0$ 周围的每个区间都含有某个 $\\frac{1}{n}$，所以补集不是开的，这与结论一致：集合不是闭的。",
              ],
            },
          ];
          const pickCase = rng.pick(cases);
          const words: Record<string, Pair> = {
            open: ["Open and not closed", "开集但不是闭集"],
            closed: ["Closed and not open", "闭集但不是开集"],
            neither: ["Neither open nor closed", "既不开也不闭"],
            both: ["Both open and closed", "既开又闭"],
          };
          const isOpen = pickCase.kind === "open";
          const claims: Record<string, boolean> = {
            open: true,
            closed: false,
            neither: false,
          };
          const reasons: Reason[] = Object.entries(claims).map(([k, o]) => {
            const fact = o !== isOpen ? pickCase.open : pickCase.closed;
            return [(words[k] as Pair)[0], fact[0], fact[1]];
          });
          reasons.push([
            "Both open and closed",
            "Only the whole line and the empty set are both open and closed, and this set is neither of them.",
            "只有整条直线和空集既开又闭，而这个集合两者都不是。",
          ]);
          return reasoned(
            choose(
              rng,
              [`What kind of set is $${pickCase.tex}$?`, `$${pickCase.tex}$ 是哪种集合？`],
              words[pickCase.kind] as Pair,
              Object.entries(words)
                .filter(([k]) => k !== pickCase.kind)
                .map(([, w]) => w),
              asPair(
                solution(
                  [
                    [["Test whether it is open", "检验是否为开集"], pickCase.open],
                    [["Test whether it is closed", "检验是否为闭集"], pickCase.closed],
                  ],
                  pickCase.complement,
                ),
              ),
            ),
            reasons,
          );
        },
      ),
      point(
        "finding-a-limit-point",
        ["Finding a limit point", "求极限点"],
        [
          "A limit point of a set is a number with members of the set, other than itself, arbitrarily close to it. It need not belong to the set. The terms of a convergent sequence that take distinct values form a set whose only limit point is the limit, and each individual term is isolated, with a gap around it that contains no other member of the set.\n\nFor $\\{2 + \\frac{3}{n} : n \\ge 1\\}$, the members tend to $2$, so $2$ is its only limit point, although $2$ is not a member. The member $5$, for $n = 1$, is isolated: the next member, $\\frac{7}{2}$, is $\\frac{3}{2}$ away.\n\nCheck: the member $2 + \\frac{3}{300} = 2 + \\frac{1}{100}$ lies within $\\frac{1}{100}$ of $2$, and later members come closer still.\n\n> **Watch out.** A member of the set is not automatically a limit point. Each term here has a gap around it, and the limit point is the number the terms approach.",
          "集合的极限点是这样的数：集合中有不同于它的元素任意接近它。它不一定属于这个集合。收敛数列中互不相同的项构成的集合，唯一的极限点就是数列的极限；每一项都是孤立的，周围有一段空隙，其中没有集合的其他元素。\n\n对 $\\{2 + \\frac{3}{n} : n \\ge 1\\}$，元素趋向 $2$，所以 $2$ 是它唯一的极限点，尽管 $2$ 不是它的元素。$n = 1$ 时的元素 $5$ 是孤立的：下一个元素 $\\frac{7}{2}$ 与它相距 $\\frac{3}{2}$。\n\n检验：元素 $2 + \\frac{3}{300} = 2 + \\frac{1}{100}$ 与 $2$ 相距 $\\frac{1}{100}$，以后的元素更近。\n\n> **注意。** 集合的元素不一定是极限点。这里每一项周围都有空隙，极限点是各项趋近的那个数。",
        ],
        (rng) => {
          const a = rng.int(-9, 12);
          const b = rng.int(2, 12);
          const half = Q.of(a).add(Q.of(b, 2));
          const third = Q.of(a).add(Q.of(b, 3));
          return reasoned(
            choose(
              rng,
              [
                `Which number is a limit point of $\\{${a} + \\frac{${b}}{n} : n \\ge 1\\}$?`,
                `哪个数是 $\\{${a} + \\frac{${b}}{n} : n \\ge 1\\}$ 的极限点？`,
              ],
              same(`${a}`),
              [same(`${a + b}`), same(half.toLatex()), same(`${a - b}`)],
              asPair(
                solution(
                  [
                    [
                      ["Find where the members go", "看元素趋向哪里"],
                      [
                        `The members $${a} + \\frac{${b}}{n}$ tend to $${a}$ and never equal it.`,
                        `元素 $${a} + \\frac{${b}}{n}$ 趋向 $${a}$，但从不等于它。`,
                      ],
                    ],
                    [
                      ["Get arbitrarily close", "任意接近"],
                      [
                        `For any gap, the members with $n$ large enough lie within that gap of $${a}$, so $${a}$ is a limit point.`,
                        `对任何间距，$n$ 足够大的元素都在 $${a}$ 的这个间距之内，所以 $${a}$ 是极限点。`,
                      ],
                    ],
                  ],
                  [
                    `The member for $n = ${100 * b}$ is $${a} + \\frac{1}{100}$, which lies within $\\frac{1}{100}$ of $${a}$.`,
                    `$n = ${100 * b}$ 时的元素是 $${a} + \\frac{1}{100}$，它与 $${a}$ 相距 $\\frac{1}{100}$。`,
                  ],
                ),
              ),
            ),
            [
              reason(
                `${a + b}`,
                `That is the member for $n = 1$. The nearest other member is $${half.toLatex()}$, so there is a gap around it.`,
                `这是 $n = 1$ 时的元素。离它最近的其他元素是 $${half.toLatex()}$，所以它周围有空隙。`,
              ),
              reason(
                half.toLatex(),
                `That is the member for $n = 2$. Its neighbours $${a + b}$ and $${third.toLatex()}$ leave a gap around it.`,
                `这是 $n = 2$ 时的元素。它的邻居 $${a + b}$ 和 $${third.toLatex()}$ 在它周围留下了空隙。`,
              ),
              reason(
                `${a - b}`,
                `Every member is above $${a}$, so no member comes within $${b}$ of $${a - b}$.`,
                `每个元素都大于 $${a}$，所以没有元素与 $${a - b}$ 的距离小于 $${b}$。`,
              ),
            ],
          );
        },
      ),
    ],
  ),
  intro: t(
    "The interval $(0, 1)$ is open: a point $x$ in it has the interval of radius $\\min(x, 1 - x)$ around it inside the set. It is not closed, since $1$ is a limit point, approached by $1 - \\frac{1}{n}$, that is missing from it.\n\nCheck: the complement $(-\\infty, 0] \\cup [1, \\infty)$ is not open at $0$, which agrees: a set is closed exactly when its complement is open.\n\nIn this lesson we classify subsets of the line as open, closed, both or neither, and find their limit points.",
    "区间 $(0, 1)$ 是开的：其中的点 $x$ 周围有半径为 $\\min(x, 1 - x)$ 的区间在集合内。它不是闭的，因为 $1$ 是极限点，$1 - \\frac{1}{n}$ 趋近它，但它不在集合中。\n\n检验：补集 $(-\\infty, 0] \\cup [1, \\infty)$ 在 $0$ 处不是开的，这与结论一致：集合是闭的，当且仅当它的补集是开的。\n\n本课我们判断直线上的子集是开集、闭集、既开又闭还是两者都不是，并求它们的极限点。",
  ),
};

const compactness = {
  ...topic(
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
          "A set is compact when every open cover has a finite subcover. On the real line, the Heine–Borel theorem makes this concrete: a set is compact exactly when it is closed and bounded. So an unbounded closed set such as the integers fails, and a bounded open interval fails too, because its open cover by shrinking subintervals has no finite subcover. Both conditions are needed.\n\nThe set $\\{0\\} \\cup \\{\\frac{1}{n} : n \\ge 1\\}$ is bounded, by $0$ and $1$, and closed, since its only limit point $0$ belongs to it. So it is compact.\n\nCheck: removing $0$ breaks closedness, and then the open cover by the intervals $(\\frac{1}{n}, 2)$ has no finite subcover.\n\n> **Watch out.** Check both conditions. $[0, \\infty)$ is closed but unbounded, and $(0, 1]$ is bounded but not closed, so neither is compact.",
          "如果每个开覆盖都有有限子覆盖，集合就是紧的。在实数直线上，海涅–博雷尔定理使之具体化：集合是紧的，当且仅当它是有界闭集。所以像整数集这样无界的闭集不是紧的，有界开区间也不是，因为用不断缩小的子区间作的开覆盖没有有限子覆盖。两个条件都是必需的。\n\n集合 $\\{0\\} \\cup \\{\\frac{1}{n} : n \\ge 1\\}$ 有界，夹在 $0$ 和 $1$ 之间；它也是闭的，因为它唯一的极限点 $0$ 属于它。所以它是紧的。\n\n检验：去掉 $0$ 就不再是闭集，这时由区间 $(\\frac{1}{n}, 2)$ 组成的开覆盖没有有限子覆盖。\n\n> **注意。** 两个条件都要检查。$[0, \\infty)$ 是闭的但无界，$(0, 1]$ 有界但不是闭的，所以都不是紧的。",
        ],
        (rng) => {
          const a = rng.int(-9, 6);
          const b = a + rng.int(1, 9);
          return reasoned(
            choose(
              rng,
              ["Which of these sets is compact?", "下列哪个集合是紧的？"],
              same(`[${a}, ${b}]`),
              [same(`(${a}, ${b}]`), same(`[${a}, \\infty)`), same(`[${a}, ${b})`)],
              asPair(
                solution(
                  [
                    [
                      ["Check that it is bounded", "检验有界"],
                      [
                        `Every point of $[${a}, ${b}]$ lies between $${a}$ and $${b}$, so it is bounded.`,
                        `$[${a}, ${b}]$ 的每个点都在 $${a}$ 和 $${b}$ 之间，所以它有界。`,
                      ],
                    ],
                    [
                      ["Check that it is closed", "检验是闭集"],
                      [
                        `It contains both endpoints, which are its only limit points outside the open interval, so it is closed. By Heine–Borel it is compact.`,
                        `它包含两个端点，而开区间之外的极限点只有这两个端点，所以它是闭的。由海涅–博雷尔定理，它是紧的。`,
                      ],
                    ],
                  ],
                  [
                    `The continuous function $x$ attains its maximum $${b}$ and minimum $${a}$ on $[${a}, ${b}]$, as it must on a compact set.`,
                    `连续函数 $x$ 在 $[${a}, ${b}]$ 上取到最大值 $${b}$ 和最小值 $${a}$，紧集上必然如此。`,
                  ],
                ),
              ),
            ),
            [
              reason(
                `(${a}, ${b}]`,
                `It is bounded, but $${a}$ is a limit point missing from it, so it is not closed.`,
                `它有界，但 $${a}$ 是它缺少的极限点，所以它不是闭的。`,
              ),
              reason(`[${a}, \\infty)`, "It is closed, but it is not bounded.", "它是闭的，但无界。"),
              reason(
                `[${a}, ${b})`,
                `It is bounded, but $${b}$ is a limit point missing from it, so it is not closed.`,
                `它有界，但 $${b}$ 是它缺少的极限点，所以它不是闭的。`,
              ),
            ],
          );
        },
      ),
      {
        ...point(
          "extreme-values-on-a-compact-interval",
          ["Extreme values on a compact interval", "紧区间上的最值"],
          [
            "A continuous function on a compact set attains a maximum and a minimum. This can fail on a set that is not compact, as with $\\frac{1}{x}$ on an open interval near zero. For a quadratic on a closed interval, the extreme values lie at the vertex, when it is inside the interval, or at the endpoints, so comparing those few values finds both of them.\n\nFor $f(x) = (x - 1)^2 + 2$ on $[-2, 3]$: the endpoints give $f(-2) = 11$ and $f(3) = 6$, and the vertex at $1$ is inside and gives $2$. So the maximum is $11$ and the minimum is $2$.\n\nCheck: $-2$ is the point of the interval farthest from the vertex, $3$ away, and $3^2 + 2 = 11$.\n\n> **Watch out.** Use the vertex only when it lies inside the interval. If it lies outside, both extremes are at the endpoints.",
            "紧集上的连续函数能取到最大值和最小值。在非紧集上这可能不成立，比如 $\\frac{1}{x}$ 在靠近零的开区间上。对闭区间上的二次函数，最值在顶点（当它在区间内时）或端点取到，所以比较这几个值就能找到它们。\n\n对 $[-2, 3]$ 上的 $f(x) = (x - 1)^2 + 2$：端点给出 $f(-2) = 11$ 和 $f(3) = 6$，顶点 $1$ 在区间内，给出 $2$。所以最大值是 $11$，最小值是 $2$。\n\n检验：$-2$ 是区间中离顶点最远的点，相距 $3$，而 $3^2 + 2 = 11$。\n\n> **注意。** 只有顶点在区间内时才用它。如果顶点在区间外，两个最值都在端点取到。",
          ],
          (rng) => {
            const c = rng.int(-5, 6);
            const d = rng.int(-6, 6);
            const a = rng.int(-7, 5);
            const b = a + rng.int(2, 9);
            const f = (x: number) => (x - c) * (x - c) + d;
            const max = rng.bool();
            const inside = c >= a && c <= b;
            const low = inside ? d : Math.min(f(a), f(b));
            const high = Math.max(f(a), f(b));
            const answer = max ? high : low;
            const shift = c === 0 ? "x^2" : `(x ${c > 0 ? "-" : "+"} ${Math.abs(c)})^2`;
            const far = Math.abs(a - c) >= Math.abs(b - c) ? a : b;
            const near = Math.abs(a - c) <= Math.abs(b - c) ? a : b;
            const endpoint = f(a) === answer ? b : a;
            const check: Pair = max
              ? [
                  `$${far}$ is the point of $[${a}, ${b}]$ farthest from the vertex $${c}$, $${Math.abs(far - c)}$ away, and $${Math.abs(far - c)}^2${signed(d)} = ${answer}$.`,
                  `$${far}$ 是 $[${a}, ${b}]$ 中离顶点 $${c}$ 最远的点，相距 $${Math.abs(far - c)}$，而 $${Math.abs(far - c)}^2${signed(d)} = ${answer}$。`,
                ]
              : inside
                ? [
                    `$f(x)${signed(-d)} = ${shift} \\ge 0$, so no value of $f$ is below $${d}$.`,
                    `$f(x)${signed(-d)} = ${shift} \\ge 0$，所以 $f$ 的值都不小于 $${d}$。`,
                  ]
                : [
                    `The vertex is outside, so $f$ is monotone on $[${a}, ${b}]$ and its minimum is at $${near}$, the endpoint nearer to $${c}$.`,
                    `顶点在区间外，所以 $f$ 在 $[${a}, ${b}]$ 上单调，最小值在离 $${c}$ 较近的端点 $${near}$ 处取到。`,
                  ];
            return solved(
              [
                `What is the ${max ? "maximum" : "minimum"} of $f(x) = ${shift}${signed(d)}$ on $[${a}, ${b}]$?`,
                `$f(x) = ${shift}${signed(d)}$ 在 $[${a}, ${b}]$ 上的${max ? "最大值" : "最小值"}是多少？`,
              ],
              answer,
              [
                why(
                  max ? low : high,
                  `That is the ${max ? "minimum" : "maximum"}, the other extreme value.`,
                  `这是${max ? "最小值" : "最大值"}，另一个最值。`,
                ),
                why(
                  f(endpoint),
                  `That is $f(${endpoint})$, the value at an endpoint, which is not the ${max ? "largest" : "smallest"} of the candidates.`,
                  `这是端点处的值 $f(${endpoint})$，它不是候选值中${max ? "最大" : "最小"}的。`,
                ),
                d === answer
                  ? why(d + 1, `That is one more than the vertex value $${d}$.`, `这比顶点处的值 $${d}$ 多一。`)
                  : why(
                      d,
                      inside
                        ? `That is the value at the vertex, which is the minimum; the maximum is at an endpoint.`
                        : `That is the value at the vertex $x = ${c}$, which lies outside $[${a}, ${b}]$.`,
                      inside
                        ? `这是顶点处的值，它是最小值；最大值在端点处取到。`
                        : `这是顶点 $x = ${c}$ 处的值，而顶点在 $[${a}, ${b}]$ 之外。`,
                    ),
                why(
                  answer + 1,
                  `That is one more than the ${max ? "maximum" : "minimum"}; recompute the value of $f$ at the point where it occurs.`,
                  `这比${max ? "最大值" : "最小值"}多一；重新计算取到它的那一点的函数值。`,
                ),
              ],
              solution(
                [
                  [
                    ["Evaluate at the endpoints", "计算端点处的值"],
                    [`$f(${a}) = ${f(a)}$ and $f(${b}) = ${f(b)}$.`, `$f(${a}) = ${f(a)}$，$f(${b}) = ${f(b)}$。`],
                  ],
                  [
                    ["Locate the vertex", "确定顶点"],
                    inside
                      ? [
                          `The vertex at $${c}$ lies in $[${a}, ${b}]$ and gives $f(${c}) = ${d}$.`,
                          `顶点 $${c}$ 在 $[${a}, ${b}]$ 内，给出 $f(${c}) = ${d}$。`,
                        ]
                      : [
                          `The vertex at $${c}$ lies outside $[${a}, ${b}]$, so only the endpoints count.`,
                          `顶点 $${c}$ 在 $[${a}, ${b}]$ 之外，所以只考虑端点。`,
                        ],
                  ],
                  [
                    ["Compare the candidates", "比较候选值"],
                    [
                      `The ${max ? "largest" : "smallest"} of these values is $${answer}$.`,
                      `这些值中${max ? "最大" : "最小"}的是 $${answer}$。`,
                    ],
                  ],
                ],
                check,
              ),
            );
          },
        ),
        figure: analysisDrawings1["compactness-on-the-real-line#extreme-values-on-a-compact-interval"],
      },
    ],
  ),
  intro: t(
    "The interval $[0, 2]$ is closed and bounded, so by the Heine–Borel theorem it is compact. On it, $f(x) = x^2 - 2x$ attains its extremes: the endpoints give $f(0) = 0$ and $f(2) = 0$, and the vertex at $1$ gives $-1$, so the minimum is $-1$ and the maximum is $0$.\n\nCheck: $x^2 - 2x = (x - 1)^2 - 1 \\ge -1$, with equality at $x = 1$.\n\nIn this lesson we recognize compact sets of reals and find the extreme values of continuous functions on them.",
    "区间 $[0, 2]$ 是有界闭集，由海涅–博雷尔定理，它是紧的。在它上面，$f(x) = x^2 - 2x$ 能取到最值：端点给出 $f(0) = 0$ 和 $f(2) = 0$，顶点 $1$ 给出 $-1$，所以最小值是 $-1$，最大值是 $0$。\n\n检验：$x^2 - 2x = (x - 1)^2 - 1 \\ge -1$，在 $x = 1$ 处取等号。\n\n本课我们识别实数的紧集，并求连续函数在其上的最值。",
  ),
};

const uniformContinuity = {
  ...topic(
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
          "Continuity allows $\\delta$ to depend on the point, whereas uniform continuity asks for a single $\\delta$ that works at every point of the domain. A bound on the slope gives one directly. If $|f(x) - f(y)| \\le L|x - y|$, then $\\delta = \\frac{\\varepsilon}{L}$ works everywhere. For the square function on a bounded interval, the steepest slope lies at the far end.\n\nOn $[0, 5]$, $|x^2 - y^2| = |x - y|\\,|x + y| \\le 10|x - y|$. For $\\varepsilon = \\frac{1}{2}$ this gives $\\delta = \\frac{1}{10} \\cdot \\frac{1}{2} = \\frac{1}{20}$.\n\nCheck: if $|x - y| < \\frac{1}{20}$, then $|x^2 - y^2| < 10 \\cdot \\frac{1}{20} = \\frac{1}{2}$, at every point of the interval.\n\n> **Watch out.** The constant is $2B$, from $|x + y| \\le B + B$, not $B$. And divide $\\varepsilon$ by it; multiplying gives a $\\delta$ that is far too large.",
          "连续性允许 $\\delta$ 依赖于点，而一致连续要求单个 $\\delta$ 在定义域的每一点都适用。斜率的界能直接给出它。如果 $|f(x) - f(y)| \\le L|x - y|$，那么 $\\delta = \\frac{\\varepsilon}{L}$ 处处适用。对有界区间上的平方函数，最陡的斜率在远端。\n\n在 $[0, 5]$ 上，$|x^2 - y^2| = |x - y|\\,|x + y| \\le 10|x - y|$。对 $\\varepsilon = \\frac{1}{2}$，得 $\\delta = \\frac{1}{10} \\cdot \\frac{1}{2} = \\frac{1}{20}$。\n\n检验：若 $|x - y| < \\frac{1}{20}$，则 $|x^2 - y^2| < 10 \\cdot \\frac{1}{20} = \\frac{1}{2}$，在区间的每一点都成立。\n\n> **注意。** 常数是 $2B$，来自 $|x + y| \\le B + B$，而不是 $B$。要用它除 $\\varepsilon$；乘的话得到的 $\\delta$ 大得多。",
        ],
        (rng) => {
          const B = rng.int(2, 20);
          const { k, tex } = eps(rng);
          const answer = Q.of(1, 2 * B * k);
          return solved(
            [
              `On $[0, ${B}]$, the bound $|x^2 - y^2| \\le ${2 * B}|x - y|$ holds. What $\\delta$ does it give for $\\varepsilon = ${tex}$?`,
              `在 $[0, ${B}]$ 上，$|x^2 - y^2| \\le ${2 * B}|x - y|$ 成立。对 $\\varepsilon = ${tex}$，它给出的 $\\delta$ 是多少？`,
            ],
            answer,
            [
              why(
                Q.of(1, k),
                `That takes $\\delta = \\varepsilon$ and ignores the constant $${2 * B}$.`,
                `这是取 $\\delta = \\varepsilon$，忽略了常数 $${2 * B}$。`,
              ),
              why(
                Q.of(1, B * k),
                `That divides by $${B}$; the constant in the bound is $${2 * B}$.`,
                `这是除以 $${B}$；界中的常数是 $${2 * B}$。`,
              ),
              why(
                Q.of(2 * B, k),
                `That multiplies $\\varepsilon$ by $${2 * B}$; it must be divided.`,
                `这是用 $${2 * B}$ 乘 $\\varepsilon$；应该除。`,
              ),
              why(
                Q.of(1, 2 * B + k),
                `That adds $${2 * B}$ to $${k}$; dividing $${tex}$ by $${2 * B}$ multiplies the denominators.`,
                `这是把 $${2 * B}$ 加到 $${k}$ 上；用 $${2 * B}$ 除 $${tex}$ 要把分母相乘。`,
              ),
            ],
            solution(
              [
                [
                  ["Use the bound", "利用这个界"],
                  [
                    `$|x^2 - y^2| \\le ${2 * B}|x - y|$, so it suffices that $${2 * B}|x - y| < ${tex}$.`,
                    `$|x^2 - y^2| \\le ${2 * B}|x - y|$，所以只需 $${2 * B}|x - y| < ${tex}$。`,
                  ],
                ],
                [
                  ["Divide the tolerance", "用常数除误差"],
                  [
                    `$\\delta = \\frac{1}{${2 * B}} \\cdot ${tex} = ${answer.toLatex()}$, the same at every point of the interval.`,
                    `$\\delta = \\frac{1}{${2 * B}} \\cdot ${tex} = ${answer.toLatex()}$，在区间的每一点都相同。`,
                  ],
                ],
              ],
              [
                `If $|x - y| < ${answer.toLatex()}$, then $|x^2 - y^2| < ${2 * B} \\cdot ${answer.toLatex()} = ${tex}$.`,
                `若 $|x - y| < ${answer.toLatex()}$，则 $|x^2 - y^2| < ${2 * B} \\cdot ${answer.toLatex()} = ${tex}$。`,
              ],
            ),
          );
        },
      ),
      point(
        "what-fails-to-be-uniformly-continuous",
        ["What fails to be uniformly continuous", "什么不是一致连续的"],
        [
          "By the Heine–Cantor theorem, a continuous function on a compact set is uniformly continuous, so a failure needs a domain that is not compact. Even there, failure needs a growing slope. So $\\frac{1}{x}$ on an open interval at zero fails, and the square function on the whole line fails, whereas a bounded slope, as for a sine or a line, keeps uniform continuity on an unbounded domain.\n\nFor $x^2$ on $\\mathbb{R}$ and $\\varepsilon = 1$, any $\\delta$ fails: take $x = \\frac{1}{\\delta}$ and $y = x + \\frac{\\delta}{2}$. Then $|x - y| < \\delta$, but $y^2 - x^2 = \\delta x + \\frac{\\delta^2}{4} = 1 + \\frac{\\delta^2}{4} > 1$.\n\nCheck: on $[0, 3]$ instead, $|x^2 - y^2| \\le 6|x - y|$, so $\\delta = \\frac{1}{6}$ works for $\\varepsilon = 1$.\n\n> **Watch out.** An unbounded domain alone is not enough. $\\sin x$ and $3x + 1$ are uniformly continuous on all of $\\mathbb{R}$, because their slopes stay bounded.",
          "由海涅–康托尔定理，紧集上的连续函数是一致连续的，所以不一致连续只能发生在非紧的定义域上。即使在那里，也还需要斜率不断增大。所以开区间上靠近零的 $\\frac{1}{x}$ 不是一致连续的，整条直线上的平方函数也不是；而斜率有界时，比如正弦或直线，在无界定义域上仍是一致连续的。\n\n对 $\\mathbb{R}$ 上的 $x^2$ 和 $\\varepsilon = 1$，任何 $\\delta$ 都不行：取 $x = \\frac{1}{\\delta}$，$y = x + \\frac{\\delta}{2}$。则 $|x - y| < \\delta$，但 $y^2 - x^2 = \\delta x + \\frac{\\delta^2}{4} = 1 + \\frac{\\delta^2}{4} > 1$。\n\n检验：换成 $[0, 3]$，$|x^2 - y^2| \\le 6|x - y|$，所以对 $\\varepsilon = 1$，$\\delta = \\frac{1}{6}$ 可行。\n\n> **注意。** 仅仅定义域无界是不够的。$\\sin x$ 和 $3x + 1$ 在整个 $\\mathbb{R}$ 上一致连续，因为它们的斜率有界。",
        ],
        (rng) => {
          const k = rng.int(2, 9);
          const B = rng.int(2, 9);
          const c = rng.int(1, 9);
          return reasoned(
            choose(
              rng,
              ["Which of these functions is not uniformly continuous on the given domain?", "下列哪个函数在给定定义域上不是一致连续的？"],
              same(`${k}x^2 \\text{ on } \\mathbb{R}`),
              [
                same(`${k}x^2 \\text{ on } [0, ${B}]`),
                same(`\\sin(${k}x) \\text{ on } \\mathbb{R}`),
                same(`${k}x + ${c} \\text{ on } \\mathbb{R}`),
              ],
              asPair(
                solution(
                  [
                    [
                      ["Look at the slope", "看斜率"],
                      [
                        `The derivative of $${k}x^2$ is $${2 * k}x$, which grows without bound on $\\mathbb{R}$.`,
                        `$${k}x^2$ 的导数是 $${2 * k}x$，它在 $\\mathbb{R}$ 上无限增大。`,
                      ],
                    ],
                    [
                      ["Show that every delta fails", "说明每个 δ 都不行"],
                      [
                        `For $\\varepsilon = 1$ and any $\\delta$, take $x = \\frac{1}{${k}\\delta}$ and $y = x + \\frac{\\delta}{2}$. Then $|x - y| < \\delta$, but $${k}(y^2 - x^2) = ${k}\\delta x + \\frac{${k}\\delta^2}{4} > 1$.`,
                        `对 $\\varepsilon = 1$ 和任何 $\\delta$，取 $x = \\frac{1}{${k}\\delta}$，$y = x + \\frac{\\delta}{2}$。则 $|x - y| < \\delta$，但 $${k}(y^2 - x^2) = ${k}\\delta x + \\frac{${k}\\delta^2}{4} > 1$。`,
                      ],
                    ],
                  ],
                  [
                    `$${k}\\delta x = ${k}\\delta \\cdot \\frac{1}{${k}\\delta} = 1$, so the difference is $1 + \\frac{${k}\\delta^2}{4}$, which exceeds $1$ for every $\\delta > 0$.`,
                    `$${k}\\delta x = ${k}\\delta \\cdot \\frac{1}{${k}\\delta} = 1$，所以差是 $1 + \\frac{${k}\\delta^2}{4}$，对每个 $\\delta > 0$ 都大于 $1$。`,
                  ],
                ),
              ),
            ),
            [
              reason(
                `${k}x^2 \\text{ on } [0, ${B}]`,
                `$[0, ${B}]$ is compact, so by Heine–Cantor the function is uniformly continuous there; the bound $${2 * k * B}|x - y|$ gives one $\\delta$.`,
                `$[0, ${B}]$ 是紧的，由海涅–康托尔定理，函数在那里一致连续；界 $${2 * k * B}|x - y|$ 给出单个 $\\delta$。`,
              ),
              reason(
                `\\sin(${k}x) \\text{ on } \\mathbb{R}`,
                `Its slope $${k}\\cos(${k}x)$ is at most $${k}$ in size, so $\\delta = \\frac{\\varepsilon}{${k}}$ works everywhere.`,
                `它的斜率 $${k}\\cos(${k}x)$ 的大小至多是 $${k}$，所以 $\\delta = \\frac{\\varepsilon}{${k}}$ 处处适用。`,
              ),
              reason(
                `${k}x + ${c} \\text{ on } \\mathbb{R}`,
                `Its slope is the constant $${k}$, so $\\delta = \\frac{\\varepsilon}{${k}}$ works everywhere.`,
                `它的斜率是常数 $${k}$，所以 $\\delta = \\frac{\\varepsilon}{${k}}$ 处处适用。`,
              ),
            ],
          );
        },
      ),
    ],
  ),
  intro: t(
    "On $[0, 4]$, $|x^2 - y^2| = |x - y|\\,|x + y| \\le 8|x - y|$. So for $\\varepsilon = \\frac{1}{10}$, the single choice $\\delta = \\frac{1}{80}$ works at every point of the interval at once.\n\nCheck: if $|x - y| < \\frac{1}{80}$, then $|x^2 - y^2| < 8 \\cdot \\frac{1}{80} = \\frac{1}{10}$.\n\nIn this lesson we find a $\\delta$ that works on a whole domain, and recognize functions for which no such $\\delta$ exists.",
    "在 $[0, 4]$ 上，$|x^2 - y^2| = |x - y|\\,|x + y| \\le 8|x - y|$。所以对 $\\varepsilon = \\frac{1}{10}$，单个选择 $\\delta = \\frac{1}{80}$ 同时在区间的每一点都适用。\n\n检验：若 $|x - y| < \\frac{1}{80}$，则 $|x^2 - y^2| < 8 \\cdot \\frac{1}{80} = \\frac{1}{10}$。\n\n本课我们求在整个定义域上适用的 $\\delta$，并识别不存在这种 $\\delta$ 的函数。",
  ),
};

const differentiability = {
  ...topic(
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
          "The derivative is a limit, so it exists only when the limits from the right and from the left agree. At the corner of an absolute value function, the difference quotient equals the slope on one side and its negative on the other. So both one-sided derivatives exist, and the function is continuous there, yet it has no derivative, which shows that continuity does not imply differentiability.\n\nFor $f(x) = 3|x - 2|$ at $x = 2$: the quotient is $\\frac{3|h|}{h}$, which is $3$ for $h > 0$ and $-3$ for $h < 0$. So the right-hand derivative is $3$ and the left-hand derivative is $-3$.\n\nCheck: at $h = 1$ the quotient is $\\frac{f(3) - f(2)}{1} = 3$, and at $h = -1$ it is $\\frac{f(1) - f(2)}{-1} = -3$.\n\n> **Watch out.** On the left $h$ is negative, so $|h| = -h$ and the quotient is $-3$. The value $f(2)$ is not a slope at all.",
          "导数是极限，所以只有当右极限和左极限一致时才存在。在绝对值函数的尖角处，差商在一侧等于斜率，在另一侧等于其相反数。所以两个单侧导数都存在，函数在那里也连续，但没有导数，这说明连续并不蕴含可导。\n\n对 $f(x) = 3|x - 2|$ 在 $x = 2$ 处：差商是 $\\frac{3|h|}{h}$，$h > 0$ 时为 $3$，$h < 0$ 时为 $-3$。所以右导数是 $3$，左导数是 $-3$。\n\n检验：$h = 1$ 时差商是 $\\frac{f(3) - f(2)}{1} = 3$，$h = -1$ 时是 $\\frac{f(1) - f(2)}{-1} = -3$。\n\n> **注意。** 在左边 $h$ 是负的，所以 $|h| = -h$，差商是 $-3$。$f(2)$ 这个值根本不是斜率。",
        ],
        (rng) => {
          const p = rng.int(2, 12);
          const a = rng.int(-6, 8);
          const c = rng.int(-5, 5);
          const right = rng.bool();
          const answer = right ? p : -p;
          const inner = a < 0 ? `x + ${-a}` : a === 0 ? "x" : `x - ${a}`;
          const h = right ? 1 : -1;
          return solved(
            [
              `Let $f(x) = ${p}|${inner}|${signed(c)}$. What is the ${right ? "right" : "left"}-hand derivative of $f$ at $x = ${a}$?`,
              `设 $f(x) = ${p}|${inner}|${signed(c)}$。$f$ 在 $x = ${a}$ 处的${right ? "右" : "左"}导数是多少？`,
            ],
            answer,
            [
              why(
                -answer,
                `That is the ${right ? "left" : "right"}-hand derivative, from the other side of the corner.`,
                `这是${right ? "左" : "右"}导数，来自尖角的另一侧。`,
              ),
              why(
                0,
                `The corner is not a flat point: on the ${right ? "right" : "left"} the quotient is constantly $${answer}$.`,
                `尖角不是平坦的点：在${right ? "右" : "左"}边差商恒为 $${answer}$。`,
              ),
              c === answer
                ? why(answer + 1, `That is one more than the slope $${answer}$.`, `这比斜率 $${answer}$ 多一。`)
                : why(c, `That is the value $f(${a}) = ${c}$, not a slope.`, `这是函数值 $f(${a}) = ${c}$，不是斜率。`),
              why(
                2 * p,
                `That is the difference between the two one-sided derivatives, $${p} - (${-p})$.`,
                `这是两个单侧导数之差 $${p} - (${-p})$。`,
              ),
            ],
            solution(
              [
                [
                  ["Write the difference quotient", "写出差商"],
                  [
                    `$f(${a} + h) - f(${a}) = ${p}|h|$, so the quotient is $\\frac{${p}|h|}{h}$.`,
                    `$f(${a} + h) - f(${a}) = ${p}|h|$，所以差商是 $\\frac{${p}|h|}{h}$。`,
                  ],
                ],
                [
                  [
                    right ? "Let h fall to zero from above" : "Let h rise to zero from below",
                    right ? "让增量从正的一侧趋于零" : "让增量从负的一侧趋于零",
                  ],
                  right
                    ? [
                        `For $h > 0$, $|h| = h$ and the quotient is $${p}$, so the right-hand derivative is $${answer}$.`,
                        `$h > 0$ 时 $|h| = h$，差商是 $${p}$，所以右导数是 $${answer}$。`,
                      ]
                    : [
                        `For $h < 0$, $|h| = -h$ and the quotient is $${answer}$, so the left-hand derivative is $${answer}$.`,
                        `$h < 0$ 时 $|h| = -h$，差商是 $${answer}$，所以左导数是 $${answer}$。`,
                      ],
                ],
              ],
              [
                `At $h = ${h}$ the quotient is $\\frac{f(${a + h}) - f(${a})}{${h}} = \\frac{${p}}{${h}} = ${answer}$.`,
                `$h = ${h}$ 时差商是 $\\frac{f(${a + h}) - f(${a})}{${h}} = \\frac{${p}}{${h}} = ${answer}$。`,
              ],
            ),
          );
        },
      ),
      {
        ...point(
          "gluing-two-pieces",
          ["Gluing two pieces", "拼接两段"],
          [
            "A piecewise function is differentiable at the joint when two conditions hold: the pieces meet, and they have the same slope there. The first gives continuity, which is necessary, and the second makes the one-sided derivatives agree. Matching only the slopes leaves a jump. For a line attached to a parabola, the conditions fix the line completely, as the tangent line to the parabola at the joint.\n\nGlue $mx + c$ to $x^2$ at $x = 3$. The slopes match when $m = 2 \\cdot 3 = 6$, and the values match when $6 \\cdot 3 + c = 9$, so $c = -9$. The line is $6x - 9$.\n\nCheck: $6x - 9$ is the tangent line to $x^2$ at $3$, since $x^2 - (6x - 9) = (x - 3)^2$ touches zero only there.\n\n> **Watch out.** Match the values as well as the slopes, and use the slope of the parabola at the joint, $2a + b$, not at $x = 0$.",
            "分段函数在接点处可导，需要两个条件：两段相接，并且在那里斜率相同。前者给出连续性，这是必要的；后者使单侧导数一致。只让斜率相等会留下跳跃。对接在抛物线上的直线，这两个条件完全确定了这条直线，它就是抛物线在接点处的切线。\n\n在 $x = 3$ 处把 $mx + c$ 接到 $x^2$ 上。斜率相等要求 $m = 2 \\cdot 3 = 6$，值相等要求 $6 \\cdot 3 + c = 9$，所以 $c = -9$。直线是 $6x - 9$。\n\n检验：$6x - 9$ 是 $x^2$ 在 $3$ 处的切线，因为 $x^2 - (6x - 9) = (x - 3)^2$ 只在那里为零。\n\n> **注意。** 值和斜率都要相等，而且要用抛物线在接点处的斜率 $2a + b$，而不是在 $x = 0$ 处的。",
          ],
          (rng) => {
            const a = rng.int(-6, 9);
            const b = rng.int(-5, 6);
            const asksSlope = rng.bool();
            const m = 2 * a + b;
            const c = -a * a;
            const parabola = `x^2${b === 0 ? "" : ` ${b > 0 ? "+" : "-"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}x`}`;
            const value = a * a + b * a;
            const slope = b === 0 ? `2(${a}) = ${m}` : `2(${a})${signed(b)} = ${m}`;
            const mA = a === 1 ? "m" : `m \\cdot ${paren(a)}`;
            const ma = m === 1 ? paren(a) : a === 1 ? paren(m) : `${paren(m)} \\cdot ${paren(a)}`;
            const mistakes = asksSlope
              ? [
                  why(a + b, `That differentiates $x^2$ as $x$; its derivative is $2x$.`, `这是把 $x^2$ 的导数当成 $x$；它的导数是 $2x$。`),
                  why(
                    2 * a,
                    `That leaves out the $${b}$ from the derivative $2x${signed(b)}$.`,
                    `这漏掉了导数 $2x${signed(b)}$ 中的 $${b}$。`,
                  ),
                  why(value, `That is the value $f(${a})$, not the slope there.`, `这是函数值 $f(${a})$，不是那里的斜率。`),
                  why(m + 1, `That is one more than the slope $2(${a})${signed(b)}$.`, `这比斜率 $2(${a})${signed(b)}$ 多一。`),
                ]
              : [
                  why(
                    a * a,
                    `That has the sign of $c$ reversed: $c = f(${a}) - ${mA} = -${paren(a)}^2$.`,
                    `这把 $c$ 的符号弄反了：$c = f(${a}) - ${mA} = -${paren(a)}^2$。`,
                  ),
                  why(m, `That is the slope $m$, not the intercept $c$.`, `这是斜率 $m$，不是截距 $c$。`),
                  why(
                    value,
                    `That is $f(${a})$; the intercept is $f(${a})$ minus $m$ times $${a}$.`,
                    `这是 $f(${a})$；截距是 $f(${a})$ 减去 $m$ 乘 $${a}$。`,
                  ),
                  why(
                    c - 1,
                    `That is one less than the intercept; recompute $f(${a})$ and $${mA}$.`,
                    `这比截距少一；重新计算 $f(${a})$ 和 $${mA}$。`,
                  ),
                ];
            return solved(
              [
                `Let $f(x) = ${parabola}$ for $x \\le ${a}$ and $f(x) = mx + c$ for $x > ${a}$. If $f$ is differentiable at ${a}, what is $${asksSlope ? "m" : "c"}$?`,
                `设 $x \\le ${a}$ 时 $f(x) = ${parabola}$，$x > ${a}$ 时 $f(x) = mx + c$。如果 $f$ 在 ${a} 处可导，$${asksSlope ? "m" : "c"}$ 是多少？`,
              ],
              asksSlope ? m : c,
              mistakes,
              solution(
                [
                  [
                    ["Match the slopes", "使斜率相等"],
                    [
                      `The parabola has derivative $2x${signed(b)}$, so $m = ${slope}$.`,
                      `抛物线的导数是 $2x${signed(b)}$，所以 $m = ${slope}$。`,
                    ],
                  ],
                  [
                    ["Match the values", "使值相等"],
                    [
                      `$f(${a}) = ${value}$, so $c = ${value} - ${ma} = ${c}$.`,
                      `$f(${a}) = ${value}$，所以 $c = ${value} - ${ma} = ${c}$。`,
                    ],
                  ],
                ],
                [
                  `At $x = ${a}$ the line gives $${m * a + 0}${signed(c)} = ${value}$, the value of the parabola, and both pieces have slope $${m}$.`,
                  `在 $x = ${a}$ 处，直线给出 $${m * a + 0}${signed(c)} = ${value}$，正是抛物线的值，而两段的斜率都是 $${m}$。`,
                ],
              ),
            );
          },
        ),
        figure: analysisDrawings1["differentiability-in-analysis#gluing-two-pieces"],
      },
    ],
  ),
  intro: t(
    "For $f(x) = |x|$ at $0$, the difference quotient is $\\frac{|h|}{h}$: it equals $1$ for $h > 0$ and $-1$ for $h < 0$. The two one-sided derivatives disagree, so $f$ has no derivative at $0$, although it is continuous there.\n\nCheck: at $h = \\frac{1}{100}$ the quotient is $1$, and at $h = -\\frac{1}{100}$ it is $-1$, however small $h$ becomes.\n\nIn this lesson we compute one-sided derivatives from the definition, and glue two pieces so that the result is differentiable.",
    "对 $f(x) = |x|$ 在 $0$ 处，差商是 $\\frac{|h|}{h}$：$h > 0$ 时等于 $1$，$h < 0$ 时等于 $-1$。两个单侧导数不一致，所以 $f$ 在 $0$ 处没有导数，尽管它在那里连续。\n\n检验：$h = \\frac{1}{100}$ 时差商是 $1$，$h = -\\frac{1}{100}$ 时是 $-1$，不管 $h$ 多小都是这样。\n\n本课我们由定义计算单侧导数，并拼接两段使结果可导。",
  ),
};

const meanValueBounds = {
  ...topic(
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
          "The mean value theorem says that the change in a function over an interval equals its derivative at some interior point times the length. So a bound M on the derivative limits the change to M times the length. This is how analysis passes from information about slopes to information about values, and it holds even when the formula for the function is not known.\n\nIf $f(1) = 4$ and $|f'(x)| \\le 3$ on $[1, 5]$, then $|f(5) - 4| \\le 3 \\cdot 4 = 12$, so $f(5)$ lies between $-8$ and $16$.\n\nCheck: $f(x) = 4 + 3(x - 1)$ has $|f'| = 3$ and reaches $f(5) = 16$, so the bound cannot be improved.\n\n> **Watch out.** Multiply the bound by the length of the interval, $b - a$, and then add the change to $f(a)$ or subtract it.",
          "中值定理说，函数在区间上的变化量等于它在某个内点的导数乘区间长度。所以导数的界 M 把变化量限制在 M 乘长度之内。分析学正是这样由斜率的信息得到值的信息，即使不知道函数的公式，这一点也成立。\n\n如果 $f(1) = 4$，并且在 $[1, 5]$ 上 $|f'(x)| \\le 3$，那么 $|f(5) - 4| \\le 3 \\cdot 4 = 12$，所以 $f(5)$ 在 $-8$ 和 $16$ 之间。\n\n检验：$f(x) = 4 + 3(x - 1)$ 满足 $|f'| = 3$，且 $f(5) = 16$，所以这个界不能再改进。\n\n> **注意。** 要用导数的界乘区间长度 $b - a$，再把这个变化量加到 $f(a)$ 上，或从中减去。",
        ],
        (rng) => {
          const M = rng.int(2, 12);
          const a = rng.int(-5, 6);
          const b = a + rng.int(1, 9);
          const v = rng.int(-9, 9);
          const high = rng.bool();
          const L = b - a;
          const answer = high ? v + M * L : v - M * L;
          return solved(
            [
              `Suppose $f(${a}) = ${v}$ and $|f'(x)| \\le ${M}$ on $[${a}, ${b}]$. What is the ${high ? "largest" : "smallest"} possible value of $f(${b})$?`,
              `设 $f(${a}) = ${v}$，在 $[${a}, ${b}]$ 上 $|f'(x)| \\le ${M}$。$f(${b})$ 可能的${high ? "最大值" : "最小值"}是多少？`,
            ],
            answer,
            [
              why(
                high ? v - M * L : v + M * L,
                `That is the ${high ? "smallest" : "largest"} possible value; the change goes the other way.`,
                `这是可能的${high ? "最小值" : "最大值"}；变化的方向反了。`,
              ),
              why(
                v + (high ? M : -M),
                `That uses a change of $${M}$, as if the interval had length $1$; its length is $${L}$.`,
                `这是用 $${M}$ 作变化量，好像区间长度是 $1$；它的长度是 $${L}$。`,
              ),
              why(
                M * L,
                `That is the largest change alone; it must be ${high ? "added to" : "taken from"} $f(${a}) = ${v}$.`,
                `这只是最大的变化量；还要${high ? "加到" : "从"} $f(${a}) = ${v}$ ${high ? "上" : "中减去"}。`,
              ),
              why(v, `That is $f(${a})$, which assumes that $f$ does not change.`, `这是 $f(${a})$，相当于假设 $f$ 不变。`),
            ],
            solution(
              [
                [
                  ["Apply the mean value theorem", "应用中值定理"],
                  [
                    `$f(${b}) - f(${a}) = f'(\\xi)(${b} - ${paren(a)})$ for some $\\xi$, so $|f(${b}) - ${paren(v)}| \\le ${L === 1 ? M : `${M} \\cdot ${L}`} = ${M * L}$.`,
                    `对某个 $\\xi$ 有 $f(${b}) - f(${a}) = f'(\\xi)(${b} - ${paren(a)})$，所以 $|f(${b}) - ${paren(v)}| \\le ${L === 1 ? M : `${M} \\cdot ${L}`} = ${M * L}$。`,
                  ],
                ],
                [
                  [high ? "Take the upper end" : "Take the lower end", high ? "取上端" : "取下端"],
                  [
                    `So $f(${b}) ${high ? "\\le" : "\\ge"} ${v} ${high ? "+" : "-"} ${M * L} = ${answer}$.`,
                    `所以 $f(${b}) ${high ? "\\le" : "\\ge"} ${v} ${high ? "+" : "-"} ${M * L} = ${answer}$。`,
                  ],
                ],
              ],
              [
                `The line $f(x) = ${v} ${high ? "+" : "-"} ${a === 0 ? `${M}x` : `${M}(${distance("x", a).slice(1, -1)})`}$ has $|f'| = ${M}$ and reaches $f(${b}) = ${answer}$, so the bound is attained.`,
                `直线 $f(x) = ${v} ${high ? "+" : "-"} ${a === 0 ? `${M}x` : `${M}(${distance("x", a).slice(1, -1)})`}$ 满足 $|f'| = ${M}$，且 $f(${b}) = ${answer}$，所以这个界能取到。`,
              ],
            ),
          );
        },
      ),
      point(
        "the-best-lipschitz-constant",
        ["The best Lipschitz constant", "最佳利普希茨常数"],
        [
          "A function is Lipschitz with constant $L$ when $|f(x) - f(y)| \\le L|x - y|$ for all $x, y$. By the mean value theorem, the smallest such constant on an interval is the largest value of $|f'|$ there. For a power of $x$ on an interval that starts at zero, the derivative grows with x, so the largest slope occurs at the right end.\n\nFor $x^3$ on $[0, 2]$, the derivative $3x^2$ is largest at $x = 2$, where it is $12$. So the best Lipschitz constant is $12$.\n\nCheck: the chord from $1.9$ to $2$ has slope $\\frac{8 - 6.859}{0.1} = 11.41$, close to $12$, so no smaller constant will do.\n\n> **Watch out.** The constant is the largest value of the derivative, not the largest value of the function, $2^3 = 8$, and not the average slope $\\frac{8}{2} = 4$.",
          "如果对所有 $x, y$ 都有 $|f(x) - f(y)| \\le L|x - y|$，函数就是常数为 $L$ 的利普希茨函数。由中值定理，区间上最小的这种常数就是那里 $|f'|$ 的最大值。对从零开始的区间上的 $x$ 的幂，导数随 x 增大，所以最大斜率在右端取到。\n\n对 $[0, 2]$ 上的 $x^3$，导数 $3x^2$ 在 $x = 2$ 处最大，等于 $12$。所以最佳利普希茨常数是 $12$。\n\n检验：从 $1.9$ 到 $2$ 的弦的斜率是 $\\frac{8 - 6.859}{0.1} = 11.41$，接近 $12$，所以更小的常数不行。\n\n> **注意。** 常数是导数的最大值，而不是函数的最大值 $2^3 = 8$，也不是平均斜率 $\\frac{8}{2} = 4$。",
        ],
        (rng) => {
          const k = rng.int(2, 4);
          const B = rng.int(2, 12);
          const answer = k * B ** (k - 1);
          const derivative = k === 2 ? "2x" : `${k}x^{${k - 1}}`;
          const atB = k === 2 ? `2 \\cdot ${B}` : `${k} \\cdot ${B}^{${k - 1}}`;
          return solved(
            [
              `What is the smallest Lipschitz constant of $x^{${k}}$ on $[0, ${B}]$?`,
              `$x^{${k}}$ 在 $[0, ${B}]$ 上的最小利普希茨常数是多少？`,
            ],
            answer,
            [
              why(
                B ** k,
                `That is the largest value of the function, $${B}^{${k}}$, not of its slope.`,
                `这是函数的最大值 $${B}^{${k}}$，而不是斜率的最大值。`,
              ),
              why(
                B ** (k - 1),
                `That is the average slope $\\frac{${B}^{${k}}}{${B}}$; the slope at the right end is $${k}$ times as large.`,
                `这是平均斜率 $\\frac{${B}^{${k}}}{${B}}$；右端的斜率是它的 $${k}$ 倍。`,
              ),
              why(
                k * B,
                `That takes the derivative to be $${k}x$; it is $${derivative}$.`,
                `这是把导数当成 $${k}x$；它是 $${derivative}$。`,
              ),
              why(answer + k, `That is $${k}$ more than the largest slope $${answer}$.`, `这比最大斜率 $${answer}$ 多 $${k}$。`),
            ],
            solution(
              [
                [
                  ["Differentiate", "求导"],
                  [
                    `The derivative of $x^{${k}}$ is $${derivative}$, which grows on $[0, ${B}]$.`,
                    `$x^{${k}}$ 的导数是 $${derivative}$，它在 $[0, ${B}]$ 上递增。`,
                  ],
                ],
                [
                  ["Take the largest slope", "取最大斜率"],
                  [
                    `By the mean value theorem the best constant is the largest $|f'|$, at $x = ${B}$: $${atB} = ${answer}$.`,
                    `由中值定理，最佳常数是 $|f'|$ 的最大值，在 $x = ${B}$ 处：$${atB} = ${answer}$。`,
                  ],
                ],
              ],
              [
                `As $y$ approaches $${B}$, the chord slope $\\frac{${B}^{${k}} - y^{${k}}}{${B} - y}$ tends to $${answer}$, so no smaller constant works.`,
                `当 $y$ 趋近 $${B}$ 时，弦的斜率 $\\frac{${B}^{${k}} - y^{${k}}}{${B} - y}$ 趋向 $${answer}$，所以更小的常数不行。`,
              ],
            ),
          );
        },
      ),
    ],
  ),
  intro: t(
    "Suppose $f(0) = 2$ and $|f'(x)| \\le 5$ on $[0, 3]$. By the mean value theorem, $|f(3) - 2| \\le 5 \\cdot 3 = 15$, so $f(3)$ is at most $17$ and at least $-13$, whatever $f$ is.\n\nCheck: $f(x) = 2 + 5x$ satisfies the hypothesis and reaches $f(3) = 17$.\n\nIn this lesson we turn a bound on a derivative into a bound on a function's change, and find the best Lipschitz constant.",
    "设 $f(0) = 2$，在 $[0, 3]$ 上 $|f'(x)| \\le 5$。由中值定理，$|f(3) - 2| \\le 5 \\cdot 3 = 15$，所以不管 $f$ 是什么，$f(3)$ 至多是 $17$，至少是 $-13$。\n\n检验：$f(x) = 2 + 5x$ 满足条件，且 $f(3) = 17$。\n\n本课我们把导数的界转化为函数变化量的界，并求最佳利普希茨常数。",
  ),
};

const upperLowerSums = {
  ...topic(
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
          "For a partition of an interval, the upper sum adds each width times the supremum of the function on that piece, and the lower sum uses the infimum. For an increasing function, the supremum lies at the right end of each piece and the infimum at the left end, so these sums are the right and left Riemann sums. Each refinement lowers the upper sum and raises the lower.\n\nFor $f(x) = 2x$ on $[0, 2]$ with $4$ equal parts, each width is $\\frac{1}{2}$ and the right ends are $\\frac{1}{2}, 1, \\frac{3}{2}, 2$. The upper sum is $\\frac{1}{2}(1 + 2 + 3 + 4) = 5$, and the lower sum, from the left ends, is $\\frac{1}{2}(0 + 1 + 2 + 3) = 3$.\n\nCheck: the integral is $4$, which lies between $3$ and $5$, and the difference $2$ is the width $\\frac{1}{2}$ times $f(2) - f(0) = 4$.\n\n> **Watch out.** For an increasing function the upper sum uses the right ends. The lower sum starts at the left end $0$, so it has one term $f(0) = 0$ and leaves out $f(b)$.",
          "对区间的一个分割，上和把每段的宽度乘函数在该段的上确界后相加，下和用下确界。对递增函数，上确界在每段的右端，下确界在左端，所以这些和就是右黎曼和与左黎曼和。每次加细都使上和减小、下和增大。\n\n对 $[0, 2]$ 上的 $f(x) = 2x$ 和 $4$ 等分，每段宽度是 $\\frac{1}{2}$，右端点是 $\\frac{1}{2}, 1, \\frac{3}{2}, 2$。上和是 $\\frac{1}{2}(1 + 2 + 3 + 4) = 5$，用左端点的下和是 $\\frac{1}{2}(0 + 1 + 2 + 3) = 3$。\n\n检验：积分是 $4$，在 $3$ 和 $5$ 之间；差 $2$ 等于宽度 $\\frac{1}{2}$ 乘 $f(2) - f(0) = 4$。\n\n> **注意。** 对递增函数，上和用右端点。下和从左端点 $0$ 开始，所以它有一项 $f(0) = 0$，并且不含 $f(b)$。",
        ],
        (rng) => {
          const m = rng.int(1, 6);
          const b = rng.int(2, 8);
          const n = rng.int(2, 10);
          const upper = rng.bool();
          const hits = upper ? (n * (n + 1)) / 2 : (n * (n - 1)) / 2;
          const answer = Q.of(m * b * b * hits, n * n);
          const other = Q.of(m * b * b * (upper ? (n * (n - 1)) / 2 : (n * (n + 1)) / 2), n * n);
          const [U, L] = upper ? [answer, other] : [other, answer];
          const from = upper ? 1 : 0;
          const indices =
            n <= 4 ? Array.from({ length: n }, (_, i) => i + from).join(" + ") : `${from} + ${from + 1} + \\cdots + ${n - 1 + from}`;
          return solved(
            [
              `What is the ${upper ? "upper" : "lower"} sum of $f(x) = ${times(m, "x")}$ on $[0, ${b}]$ for the partition into ${n} equal parts?`,
              `$f(x) = ${times(m, "x")}$ 在 $[0, ${b}]$ 上，把区间分成 ${n} 等份，${upper ? "上和" : "下和"}是多少？`,
            ],
            answer,
            [
              why(
                other,
                `That is the ${upper ? "lower" : "upper"} sum, from the ${upper ? "left" : "right"} ends of the pieces.`,
                `这是${upper ? "下和" : "上和"}，用的是各段的${upper ? "左" : "右"}端点。`,
              ),
              why(
                Q.of(m * b * b, 2),
                `That is the integral itself, which the ${upper ? "upper sum lies above" : "lower sum lies below"}.`,
                `这是积分本身，${upper ? "上和比它大" : "下和比它小"}。`,
              ),
              why(answer.add(Q.of(1)), `That is one more than the sum; add the terms again.`, `这比和多一；重新把各项相加。`),
              why(
                Q.of(m * b * b, n),
                `That is a single piece: the width $${frac(b, n)}$ times $f(${b}) = ${m * b}$.`,
                `这只是一段：宽度 $${frac(b, n)}$ 乘 $f(${b}) = ${m * b}$。`,
              ),
            ],
            solution(
              [
                [
                  ["Find the width and the ends", "求宽度和端点"],
                  [
                    `Each piece has width $${frac(b, n)}$. Since $f$ increases, the ${upper ? "supremum on each piece is at its right" : "infimum on each piece is at its left"} end.`,
                    `每段宽度是 $${frac(b, n)}$。因为 $f$ 递增，每段上的${upper ? "上确界在右" : "下确界在左"}端点取到。`,
                  ],
                ],
                [
                  ["Add the terms", "把各项相加"],
                  [
                    `The ends are $${frac(b, n)}$ times $${indices}$, so the sum is $\\frac{${m * b * b}}{${n * n}} \\times ${hits} = ${answer.toLatex()}$.`,
                    `端点是 $${frac(b, n)}$ 乘 $${indices}$，所以和是 $\\frac{${m * b * b}}{${n * n}} \\times ${hits} = ${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `The upper and lower sums are $${U.toLatex()}$ and $${L.toLatex()}$. They differ by $${U.sub(L).toLatex()}$, the width $${frac(b, n)}$ times $f(${b}) - f(0) = ${m * b}$.`,
                `上和与下和分别是 $${U.toLatex()}$ 和 $${L.toLatex()}$。它们相差 $${U.sub(L).toLatex()}$，等于宽度 $${frac(b, n)}$ 乘 $f(${b}) - f(0) = ${m * b}$。`,
              ],
            ),
          );
        },
      ),
      point(
        "how-fine-a-partition-must-be",
        ["How fine a partition must be", "分割要多细"],
        [
          "For an increasing function on $[a, b]$ and $n$ equal parts, the difference between upper and lower sums telescopes to $(f(b) - f(a)) \\frac{b - a}{n}$. This shows at once that a monotone function is integrable, since the difference falls below any tolerance when $n$ is large. It also gives an exact count of parts needed for a tolerance $\\varepsilon$: $n > \\frac{(f(b) - f(a))(b - a)}{\\varepsilon}$.\n\nIf $f$ rises by $3$ over an interval of length $2$ and $\\varepsilon = \\frac{1}{5}$, the difference is $\\frac{6}{n}$, which is below $\\frac{1}{5}$ when $n > 30$. So $31$ parts are needed.\n\nCheck: with $31$ parts the difference is $\\frac{6}{31} < \\frac{6}{30} = \\frac{1}{5}$, while with $30$ parts it equals $\\frac{1}{5}$.\n\n> **Watch out.** The inequality is strict, so $n = 30$ is not enough. And the rise and the length multiply; neither may be left out.",
          "对 $[a, b]$ 上的递增函数和 $n$ 等分，上和与下和之差经过相消，等于 $(f(b) - f(a)) \\frac{b - a}{n}$。这立刻说明单调函数是可积的，因为 $n$ 很大时，这个差小于任何误差。它也准确给出误差 $\\varepsilon$ 所需的段数：$n > \\frac{(f(b) - f(a))(b - a)}{\\varepsilon}$。\n\n如果 $f$ 在长度为 $2$ 的区间上升高了 $3$，$\\varepsilon = \\frac{1}{5}$，那么差是 $\\frac{6}{n}$，当 $n > 30$ 时它小于 $\\frac{1}{5}$。所以需要 $31$ 段。\n\n检验：$31$ 段时差是 $\\frac{6}{31} < \\frac{6}{30} = \\frac{1}{5}$，而 $30$ 段时差恰好等于 $\\frac{1}{5}$。\n\n> **注意。** 不等式是严格的，所以 $n = 30$ 不够。上升量和长度要相乘，哪个都不能漏掉。",
        ],
        (rng) => {
          const rise = rng.int(2, 15);
          const length = rng.int(1, 8);
          const { k, tex } = eps(rng);
          const answer = rise * length * k + 1;
          const product = rise * length;
          return solved(
            [
              `An increasing $f$ on an interval of length ${length} rises by ${rise} in total. What is the smallest number of equal parts that makes the upper and lower sums differ by less than ${`$${tex}$`}?`,
              `长度为 ${length} 的区间上的递增函数 $f$ 总共上升了 ${rise}。使上和与下和之差小于 ${`$${tex}$`} 的最少等份数是多少？`,
            ],
            answer,
            [
              why(
                answer - 1,
                `With $${answer - 1}$ parts the difference equals $${tex}$ exactly, which is not less than it.`,
                `$${answer - 1}$ 段时差恰好等于 $${tex}$，并不小于它。`,
              ),
              why(rise * k + 1, `That leaves out the length $${length}$ of the interval.`, `这漏掉了区间长度 $${length}$。`),
              why(length * k + 1, `That leaves out the rise $${rise}$ of the function.`, `这漏掉了函数的上升量 $${rise}$。`),
              why(
                rise + length + k,
                `That adds the numbers; the difference $\\frac{${product}}{n}$ comes from multiplying them.`,
                `这是把各数相加；差 $\\frac{${product}}{n}$ 来自把它们相乘。`,
              ),
            ],
            solution(
              [
                [
                  ["Write the difference", "写出差"],
                  [
                    `The difference is the rise times the width: $${rise} \\cdot \\frac{${length}}{n} = \\frac{${product}}{n}$.`,
                    `差是上升量乘宽度：$${rise} \\cdot \\frac{${length}}{n} = \\frac{${product}}{n}$。`,
                  ],
                ],
                [
                  ["Solve for the number of parts", "解出段数"],
                  [
                    `$\\frac{${product}}{n} < ${tex}$ exactly when $n > ${product * k}$, so the smallest $n$ is $${answer}$.`,
                    `$\\frac{${product}}{n} < ${tex}$ 当且仅当 $n > ${product * k}$，所以最小的 $n$ 是 $${answer}$。`,
                  ],
                ],
              ],
              [
                `With $${answer}$ parts the difference is $\\frac{${product}}{${answer}} < \\frac{${product}}{${product * k}} = ${tex}$.`,
                `$${answer}$ 段时差是 $\\frac{${product}}{${answer}} < \\frac{${product}}{${product * k}} = ${tex}$。`,
              ],
            ),
          );
        },
      ),
    ],
  ),
  intro: t(
    "For $f(x) = x$ on $[0, 1]$ with $2$ equal parts, the upper sum uses the right ends: $\\frac{1}{2}(\\frac{1}{2} + 1) = \\frac{3}{4}$. The lower sum uses the left ends: $\\frac{1}{2}(0 + \\frac{1}{2}) = \\frac{1}{4}$.\n\nCheck: the integral $\\frac{1}{2}$ lies between them, and their difference $\\frac{1}{2}$ is the width $\\frac{1}{2}$ times $f(1) - f(0) = 1$.\n\nIn this lesson we compute upper and lower sums, and find how fine a partition must be for them to come close.",
    "对 $[0, 1]$ 上的 $f(x) = x$ 和 $2$ 等分，上和用右端点：$\\frac{1}{2}(\\frac{1}{2} + 1) = \\frac{3}{4}$。下和用左端点：$\\frac{1}{2}(0 + \\frac{1}{2}) = \\frac{1}{4}$。\n\n检验：积分 $\\frac{1}{2}$ 在它们之间，它们的差 $\\frac{1}{2}$ 等于宽度 $\\frac{1}{2}$ 乘 $f(1) - f(0) = 1$。\n\n本课我们计算上和与下和，并求分割要多细才能使它们足够接近。",
  ),
};

const integrability = {
  ...topic(
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
          "A function is integrable when its upper and lower integrals agree. A bounded function with finitely many discontinuities passes this test, because the bad points can be enclosed in pieces of tiny total width. So a jump does no harm, and changing the value of a function at a single point leaves the integral as it was, however large the new value may be.\n\nLet $f = 2$ on $[0, 3)$ and $f = 5$ on $(3, 5]$, with $f(3) = 80$. The integral is $2 \\cdot 3 + 5 \\cdot 2 = 16$, and the value $80$ plays no part.\n\nCheck: a piece of width $\\delta$ around $3$ changes any sum by at most $80\\delta$, which can be made as small as we like.\n\n> **Watch out.** A single point has width zero, so its value adds no area. Each step contributes its own height times its own width.",
          "如果上积分和下积分相等，函数就是可积的。有有限个不连续点的有界函数能通过这个检验，因为这些坏点可以用总宽度极小的小段包起来。所以跳跃没有害处，改变函数在一点的值也不改变积分，不管新的值有多大。\n\n设 $f$ 在 $[0, 3)$ 上等于 $2$，在 $(3, 5]$ 上等于 $5$，且 $f(3) = 80$。积分是 $2 \\cdot 3 + 5 \\cdot 2 = 16$，值 $80$ 不起作用。\n\n检验：$3$ 周围宽度为 $\\delta$ 的一段至多使任何和改变 $80\\delta$，而它可以任意小。\n\n> **注意。** 单独一点的宽度是零，所以它的值不增加面积。每一级台阶贡献它自己的高度乘它自己的宽度。",
        ],
        (rng) => {
          const a = rng.int(0, 4);
          const m = a + rng.int(1, 4);
          const b = m + rng.int(1, 4);
          const p = rng.int(1, 9);
          const q = p === 9 ? 2 : p + rng.int(1, 9 - p);
          const big = rng.int(50, 99);
          const answer = p * (m - a) + q * (b - m);
          return solved(
            [
              `Let $f(x) = ${p}$ on $[${a}, ${m})$ and $f(x) = ${q}$ on $(${m}, ${b}]$, with $f(${m}) = ${big}$. What is $\\int_{${a}}^{${b}} f(x)\\,dx$?`,
              `设 $f(x)$ 在 $[${a}, ${m})$ 上等于 ${p}，在 $(${m}, ${b}]$ 上等于 ${q}，且 $f(${m}) = ${big}$。$\\int_{${a}}^{${b}} f(x)\\,dx$ 是多少？`,
            ],
            answer,
            [
              why(
                answer + big,
                `That counts the value $${big}$ at $${m}$ as area; a single point has width $0$.`,
                `这是把 $${m}$ 处的值 $${big}$ 算作面积；单独一点的宽度是 $0$。`,
              ),
              why(p * (b - a), `That uses the height $${p}$ on the whole interval.`, `这是在整个区间上都用高度 $${p}$。`),
              why(q * (b - a), `That uses the height $${q}$ on the whole interval.`, `这是在整个区间上都用高度 $${q}$。`),
              why(p + q, `That adds the heights without multiplying by the widths.`, `这是把高度相加，没有乘宽度。`),
            ],
            solution(
              [
                [
                  ["Set the single point aside", "撇开单独一点"],
                  [
                    `Changing $f$ at the one point $${m}$ does not change the integral, so the value $${big}$ can be ignored.`,
                    `改变 $f$ 在 $${m}$ 这一点的值不改变积分，所以可以不管 $${big}$ 这个值。`,
                  ],
                ],
                [
                  ["Add the two steps", "把两级台阶相加"],
                  [
                    `$${p} \\times ${m - a} + ${q} \\times ${b - m} = ${answer}$.`,
                    `$${p} \\times ${m - a} + ${q} \\times ${b - m} = ${answer}$。`,
                  ],
                ],
              ],
              [
                `A piece of width $\\delta$ around $${m}$ changes any upper or lower sum by at most $${big}\\delta$, which tends to $0$, so both integrals equal $${answer}$.`,
                `$${m}$ 周围宽度为 $\\delta$ 的一段至多使任何上和或下和改变 $${big}\\delta$，它趋于 $0$，所以两个积分都等于 $${answer}$。`,
              ],
            ),
          );
        },
      ),
      point(
        "upper-and-lower-integrals-that-disagree",
        ["Upper and lower integrals that disagree", "不相等的上下积分"],
        [
          "A function can fail to be integrable. Let it equal one value at rational numbers and another at irrational numbers. Both kinds of number occur in every piece of every partition, so each upper sum uses the larger value and each lower sum uses the smaller, whatever the partition. The two integrals therefore differ, and the Riemann integral does not exist, which motivated the Lebesgue integral.\n\nLet $f = 2$ at rational numbers and $f = 4$ at irrational numbers, on $[0, 3]$. Every upper sum is $4 \\cdot 3 = 12$ and every lower sum is $2 \\cdot 3 = 6$, so the upper integral is $12$ and the lower integral is $6$.\n\nCheck: the two integrals differ by $(4 - 2) \\cdot 3 = 6 \\ne 0$, so $f$ is not integrable.\n\n> **Watch out.** The upper integral uses the larger value, whichever kind of number carries it. Multiply that value by the length of the interval.",
          "函数可能不可积。让它在有理数处取一个值，在无理数处取另一个值。这两种数在每个分割的每一段都出现，所以不管怎样分割，每个上和都用较大的值，每个下和都用较小的值。于是两个积分不相等，黎曼积分不存在，这正是勒贝格积分的动机之一。\n\n在 $[0, 3]$ 上，设有理数处 $f = 2$，无理数处 $f = 4$。每个上和都是 $4 \\cdot 3 = 12$，每个下和都是 $2 \\cdot 3 = 6$，所以上积分是 $12$，下积分是 $6$。\n\n检验：两个积分相差 $(4 - 2) \\cdot 3 = 6 \\ne 0$，所以 $f$ 不可积。\n\n> **注意。** 上积分用较大的值，不管它属于哪种数。要用这个值乘区间长度。",
        ],
        (rng) => {
          const p = rng.int(0, 9);
          let q = rng.int(0, 9);
          if (q === p) q = p + 2;
          const a = rng.int(-3, 4);
          const b = a + rng.int(1, 6);
          const upper = rng.bool();
          const hi = Math.max(p, q);
          const lo = Math.min(p, q);
          const used = upper ? hi : lo;
          const L = b - a;
          const answer = used * L;
          return solved(
            [
              `Let $f(x) = ${p}$ for rational $x$ and $f(x) = ${q}$ for irrational $x$. What is the ${upper ? "upper" : "lower"} integral of $f$ on $[${a}, ${b}]$?`,
              `设有理数 $x$ 处 $f(x) = ${p}$，无理数 $x$ 处 $f(x) = ${q}$。$f$ 在 $[${a}, ${b}]$ 上的${upper ? "上积分" : "下积分"}是多少？`,
            ],
            answer,
            [
              why(
                (upper ? lo : hi) * L,
                `That is the ${upper ? "lower" : "upper"} integral, from the ${upper ? "smaller" : "larger"} value $${upper ? lo : hi}$.`,
                `这是${upper ? "下积分" : "上积分"}，来自${upper ? "较小" : "较大"}的值 $${upper ? lo : hi}$。`,
              ),
              why(
                (p + q) * L,
                "That adds the two values; each sum uses only one of them on every piece.",
                "这是把两个值相加；每个和在每一段上只用其中一个。",
              ),
              why(
                used,
                `That is the value $${used}$ alone; it must be multiplied by the length $${L}$.`,
                `这只是值 $${used}$；还要乘长度 $${L}$。`,
              ),
              why(
                answer + 1,
                `That is one more than the ${upper ? "upper" : "lower"} integral $${answer}$.`,
                `这比${upper ? "上积分" : "下积分"} $${answer}$ 多一。`,
              ),
            ],
            solution(
              [
                [
                  ["Look at any piece", "看任意一段"],
                  [
                    `Every piece contains rational and irrational numbers, so the ${upper ? "supremum of $f$ on it is" : "infimum of $f$ on it is"} $${used}$.`,
                    `每一段都含有有理数和无理数，所以 $f$ 在它上面的${upper ? "上确界" : "下确界"}是 $${used}$。`,
                  ],
                ],
                [
                  ["Add over the partition", "对分割求和"],
                  [
                    `Every ${upper ? "upper" : "lower"} sum is $${used}$ times the total width $${L}$, so the ${upper ? "upper" : "lower"} integral is $${answer}$.`,
                    `每个${upper ? "上和" : "下和"}都是 $${used}$ 乘总宽度 $${L}$，所以${upper ? "上积分" : "下积分"}是 $${answer}$。`,
                  ],
                ],
              ],
              [
                `The upper and lower integrals are $${hi * L}$ and $${lo * L}$, which differ by $${(hi - lo) * L} \\ne 0$, so $f$ is not integrable.`,
                `上积分和下积分分别是 $${hi * L}$ 和 $${lo * L}$，相差 $${(hi - lo) * L} \\ne 0$，所以 $f$ 不可积。`,
              ],
            ),
          );
        },
      ),
    ],
  ),
  intro: t(
    "Let $f = 3$ on $[0, 2]$, except $f(1) = 100$. Enclose $1$ in a piece of width $\\delta$: the upper and lower sums then differ by at most $97\\delta$, so both integrals equal $3 \\cdot 2 = 6$.\n\nCheck: the lower sum on such a partition is exactly $6$, and the upper sum is $6 + 97\\delta$, which tends to $6$.\n\nIn this lesson we see that changing a single value leaves an integral alone, and meet a function whose upper and lower integrals disagree.",
    "设 $[0, 2]$ 上 $f = 3$，只有 $f(1) = 100$。用宽度为 $\\delta$ 的一段包住 $1$：上和与下和至多相差 $97\\delta$，所以两个积分都等于 $3 \\cdot 2 = 6$。\n\n检验：这样的分割上，下和恰好是 $6$，上和是 $6 + 97\\delta$，它趋向 $6$。\n\n本课我们看到改变单独一个值不影响积分，并认识上积分与下积分不相等的函数。",
  ),
};

const uniformConvergence = {
  ...topic(
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
          "A sequence of functions converges pointwise when the values converge at each fixed $x$. This can break continuity: $x^n$ on the unit interval is continuous for every $n$, yet its limit is $0$ for $x < 1$ and $1$ at $x = 1$. Pointwise convergence lets the speed vary from point to point, and near $1$ here the convergence becomes slower and slower.\n\nFor $f_n(x) = x^n + 2$: at $x = \\frac{1}{3}$ the powers $\\frac{1}{3}, \\frac{1}{9}, \\frac{1}{27}, \\ldots$ tend to $0$, so $f_n(\\frac{1}{3}) \\to 2$. At $x = 1$ every power is $1$, so $f_n(1) = 3$ for every $n$.\n\nCheck: the limit function is $2$ on $[0, 1)$ and $3$ at $1$, so it jumps, although each $f_n$ is continuous.\n\n> **Watch out.** $1^n = 1$ for every $n$; it does not tend to $0$. And keep the constant, which appears in every $f_n$.",
          "如果在每个固定的 $x$ 处函数值都收敛，函数列就逐点收敛。这可能破坏连续性：单位区间上的 $x^n$ 对每个 $n$ 都连续，但它的极限在 $x < 1$ 时是 $0$，在 $x = 1$ 时是 $1$。逐点收敛允许速度随点而变，这里在 $1$ 附近，收敛越来越慢。\n\n对 $f_n(x) = x^n + 2$：在 $x = \\frac{1}{3}$ 处，幂 $\\frac{1}{3}, \\frac{1}{9}, \\frac{1}{27}, \\ldots$ 趋向 $0$，所以 $f_n(\\frac{1}{3}) \\to 2$。在 $x = 1$ 处每个幂都是 $1$，所以对每个 $n$ 都有 $f_n(1) = 3$。\n\n检验：极限函数在 $[0, 1)$ 上是 $2$，在 $1$ 处是 $3$，所以它跳跃，尽管每个 $f_n$ 都连续。\n\n> **注意。** 对每个 $n$ 都有 $1^n = 1$；它不趋于 $0$。还要保留常数，它出现在每个 $f_n$ 中。",
        ],
        (rng) => {
          const c = rng.int(-8, 9);
          const d = rng.int(2, 9);
          const atOne = rng.bool();
          const numerator = rng.int(1, d - 1);
          const x = atOne ? "1" : frac(numerator, d);
          const answer = atOne ? 1 + c : c;
          const power = atOne ? 1 : 0;
          const alt = 0 === answer ? 2 : 0;
          const lhs = c === 0 ? `f_n(${x})` : `f_n(${x})${signed(-c)}`;
          return solved(
            [
              `Let $f_n(x) = x^n${signed(c)}$ on $[0, 1]$. What is $\\lim_{n \\to \\infty} f_n(${x})$?`,
              `设 $[0, 1]$ 上 $f_n(x) = x^n${signed(c)}$。$\\lim_{n \\to \\infty} f_n(${x})$ 是多少？`,
            ],
            answer,
            [
              why(
                atOne ? c : 1 + c,
                atOne
                  ? "That lets $1^n$ tend to $0$, but $1^n = 1$ for every $n$."
                  : `That is the limit at $x = 1$; at $x = ${x}$ the powers tend to $0$.`,
                atOne ? "这是让 $1^n$ 趋于 $0$，但对每个 $n$ 都有 $1^n = 1$。" : `这是 $x = 1$ 处的极限；在 $x = ${x}$ 处，幂趋于 $0$。`,
              ),
              why(
                c + 2,
                `That adds $2$; the power tends to $${power}$, so only $${power}$ is added to $${c}$.`,
                `这是加上 $2$；幂趋向 $${power}$，所以只给 $${c}$ 加上 $${power}$。`,
              ),
              alt === 0
                ? why(0, `That drops the constant $${c}$, which appears in every $f_n$.`, `这漏掉了常数 $${c}$，它出现在每个 $f_n$ 中。`)
                : why(
                    2,
                    `The power tends to $${power}$, so the limit is $${answer}$, not $2$.`,
                    `幂趋向 $${power}$，所以极限是 $${answer}$，而不是 $2$。`,
                  ),
              why(d, `That is the denominator of $x$, which plays no part in the limit.`, `这是 $x$ 的分母，它与极限无关。`),
            ],
            solution(
              [
                [
                  ["Find the limit of the power", "求幂的极限"],
                  atOne
                    ? [`At $x = 1$, $1^n = 1$ for every $n$.`, `在 $x = 1$ 处，对每个 $n$ 都有 $1^n = 1$。`]
                    : [
                        `At $x = ${x}$, which lies in $[0, 1)$, the powers $(${x})^n$ tend to $0$.`,
                        `$x = ${x}$ 在 $[0, 1)$ 中，幂 $(${x})^n$ 趋向 $0$。`,
                      ],
                ],
                [
                  ["Add the constant", "加上常数"],
                  [`So $f_n(${x}) \\to ${power}${signed(c)} = ${answer}$.`, `所以 $f_n(${x}) \\to ${power}${signed(c)} = ${answer}$。`],
                ],
              ],
              atOne
                ? [
                    `$f_n(1) = 1${signed(c)} = ${answer}$ for every $n$, so the sequence is constant.`,
                    `对每个 $n$ 都有 $f_n(1) = 1${signed(c)} = ${answer}$，所以这个数列是常数。`,
                  ]
                : [
                    `$${lhs} = (${x})^n$, and multiplying by $${x} < 1$ at each step makes these powers fall to $0$.`,
                    `$${lhs} = (${x})^n$，每一步乘以 $${x} < 1$，使这些幂降到 $0$。`,
                  ],
            ),
          );
        },
      ),
      point(
        "uniform-convergence-through-the-supremum",
        ["Convergence through the supremum", "用上确界判断一致收敛"],
        [
          "Convergence is uniform when the supremum of the difference from the limit tends to zero, so that one index works for all points at once. Uniform limits of continuous functions are continuous, and this explains why $x^n$ cannot converge uniformly on the closed unit interval. To find an index, compute the supremum of the difference on the domain as a function of $n$ and solve the inequality.\n\nFor $f_n(x) = \\frac{x}{n}$ on $[0, 4]$, the supremum of $|f_n|$ is $\\frac{4}{n}$, at $x = 4$. It is below $\\frac{1}{10}$ when $n > 40$, so $N = 41$ works for every $x$ at once.\n\nCheck: $\\frac{4}{41} < \\frac{4}{40} = \\frac{1}{10}$, while $n = 40$ gives exactly $\\frac{1}{10}$.\n\n> **Watch out.** The supremum is at the far end $x = b$, not at $x = 1$. And the inequality is strict, so $n = bk$ is one too few.",
          "如果与极限之差的上确界趋于零，收敛就是一致的，这时一个下标同时适用于所有点。连续函数的一致极限是连续的，这解释了为什么 $x^n$ 在闭单位区间上不能一致收敛。要求下标，就把定义域上差的上确界写成 $n$ 的函数，再解不等式。\n\n对 $[0, 4]$ 上的 $f_n(x) = \\frac{x}{n}$，$|f_n|$ 的上确界是 $\\frac{4}{n}$，在 $x = 4$ 处取到。当 $n > 40$ 时它小于 $\\frac{1}{10}$，所以 $N = 41$ 同时适用于每个 $x$。\n\n检验：$\\frac{4}{41} < \\frac{4}{40} = \\frac{1}{10}$，而 $n = 40$ 时恰好等于 $\\frac{1}{10}$。\n\n> **注意。** 上确界在远端 $x = b$ 处取到，而不是在 $x = 1$ 处。不等式是严格的，所以 $n = bk$ 少了一个。",
        ],
        (rng) => {
          const b = rng.int(2, 15);
          const { k, tex } = eps(rng);
          const answer = b * k + 1;
          return solved(
            [
              `Let $f_n(x) = \\frac{x}{n}$ on $[0, ${b}]$, with limit 0. What is the smallest $N$ with $\\sup |f_n| < ${tex}$ for all $n \\ge N$?`,
              `设 $[0, ${b}]$ 上 $f_n(x) = \\frac{x}{n}$，极限是 0。使所有 $n \\ge N$ 都满足 $\\sup |f_n| < ${tex}$ 的最小 $N$ 是多少？`,
            ],
            answer,
            [
              why(
                b * k,
                `With $n = ${b * k}$ the supremum equals $${tex}$ exactly, which is not below it.`,
                `$n = ${b * k}$ 时上确界恰好等于 $${tex}$，并不小于它。`,
              ),
              why(k + 1, `That takes the supremum at $x = 1$; it is at $x = ${b}$.`, `这是在 $x = 1$ 处取上确界；它在 $x = ${b}$ 处取到。`),
              why(
                b + k,
                `That adds $${b}$ and $${k}$; solving $\\frac{${b}}{n} < ${tex}$ multiplies them.`,
                `这是把 $${b}$ 和 $${k}$ 相加；解 $\\frac{${b}}{n} < ${tex}$ 要把它们相乘。`,
              ),
              why(2 * b * k, "That index works, but it is not the smallest.", "这个下标可行，但不是最小的。"),
            ],
            solution(
              [
                [
                  ["Find the supremum", "求上确界"],
                  [
                    `$|f_n(x)| = \\frac{x}{n}$ is largest at $x = ${b}$, so $\\sup |f_n| = \\frac{${b}}{n}$.`,
                    `$|f_n(x)| = \\frac{x}{n}$ 在 $x = ${b}$ 处最大，所以 $\\sup |f_n| = \\frac{${b}}{n}$。`,
                  ],
                ],
                [
                  ["Solve the inequality", "解不等式"],
                  [
                    `$\\frac{${b}}{n} < ${tex}$ exactly when $n > ${b * k}$, and the supremum falls as $n$ grows, so $N = ${answer}$.`,
                    `$\\frac{${b}}{n} < ${tex}$ 当且仅当 $n > ${b * k}$，而上确界随 $n$ 增大而减小，所以 $N = ${answer}$。`,
                  ],
                ],
              ],
              [
                `$\\frac{${b}}{${answer}} < \\frac{${b}}{${b * k}} = ${tex}$, while $n = ${b * k}$ gives exactly $${tex}$.`,
                `$\\frac{${b}}{${answer}} < \\frac{${b}}{${b * k}} = ${tex}$，而 $n = ${b * k}$ 时恰好是 $${tex}$。`,
              ],
            ),
          );
        },
      ),
    ],
  ),
  intro: t(
    "On $[0, 1]$, $f_n(x) = \\frac{x}{n}$ tends to $0$ at each point. The largest difference from the limit is $\\frac{1}{n}$, at $x = 1$, and it tends to $0$, so the convergence is uniform. By contrast $x^n$ has a jump in its limit at $1$, and no single index works near $1$.\n\nCheck: for $n \\ge 101$, $\\frac{x}{n} \\le \\frac{1}{101} < \\frac{1}{100}$ at every $x$ in $[0, 1]$.\n\nIn this lesson we find pointwise limits of sequences of functions, and measure uniform convergence through the supremum.",
    "在 $[0, 1]$ 上，$f_n(x) = \\frac{x}{n}$ 在每一点都趋向 $0$。与极限的最大差是 $\\frac{1}{n}$，在 $x = 1$ 处取到，它趋向 $0$，所以收敛是一致的。相比之下，$x^n$ 的极限在 $1$ 处有跳跃，在 $1$ 附近没有单个下标适用。\n\n检验：$n \\ge 101$ 时，对 $[0, 1]$ 中每个 $x$ 都有 $\\frac{x}{n} \\le \\frac{1}{101} < \\frac{1}{100}$。\n\n本课我们求函数列的逐点极限，并用上确界衡量一致收敛。",
  ),
};

const weierstrassTest = {
  ...topic(
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
          "The Weierstrass M-test says that if each function in a series is bounded in size by a number, and those numbers have a convergent sum, then the series converges uniformly. Each bound must hold on the whole domain. The sum of the bounds also limits the value of the series at every point, so the same step gives the convergence and a size estimate for the sum.\n\nFor $\\sum_{k=1}^{\\infty} \\frac{\\cos(kx)}{3^k}$, each term is at most $\\frac{1}{3^k}$ in size, and $\\sum \\frac{1}{3^k} = \\frac{1}{3} \\cdot \\frac{1}{1 - \\frac{1}{3}} = \\frac{1}{2}$. So the series converges uniformly, and its value is at most $\\frac{1}{2}$ in size.\n\nCheck: $\\frac{1}{2} - \\frac{1}{3} = \\frac{1}{6}$, which is $\\frac{1}{3}$ of $\\frac{1}{2}$, as a geometric sum with ratio $\\frac{1}{3}$ requires.\n\n> **Watch out.** The sum starts at $k = 1$, so the first term is $\\frac{1}{3}$, not $1$. The bound is the whole geometric sum, not its first term.",
          "魏尔斯特拉斯 M 判别法说，如果级数中每个函数的大小都被一个数控制，而这些数的和收敛，那么级数一致收敛。每个界都必须在整个定义域上成立。这些界的和也限制了级数在每一点的值，所以同一步既给出收敛性，也给出和的大小估计。\n\n对 $\\sum_{k=1}^{\\infty} \\frac{\\cos(kx)}{3^k}$，每项的大小至多是 $\\frac{1}{3^k}$，而 $\\sum \\frac{1}{3^k} = \\frac{1}{3} \\cdot \\frac{1}{1 - \\frac{1}{3}} = \\frac{1}{2}$。所以级数一致收敛，它的值的大小至多是 $\\frac{1}{2}$。\n\n检验：$\\frac{1}{2} - \\frac{1}{3} = \\frac{1}{6}$，是 $\\frac{1}{2}$ 的 $\\frac{1}{3}$，与公比为 $\\frac{1}{3}$ 的几何级数相符。\n\n> **注意。** 求和从 $k = 1$ 开始，所以首项是 $\\frac{1}{3}$，而不是 $1$。界是整个几何级数的和，而不是它的首项。",
        ],
        (rng) => {
          const c = rng.int(1, 9);
          const r = rng.int(2, 9);
          const answer = Q.of(c, r - 1);
          const coefficient = c === 1 ? "" : `${c}`;
          const first = Q.of(c, r);
          const geo =
            first.toLatex() === "1" ? `\\frac{1}{1 - \\frac{1}{${r}}}` : `${first.toLatex()} \\cdot \\frac{1}{1 - \\frac{1}{${r}}}`;
          return solved(
            [
              `Using $M_k = \\frac{${c}}{${r}^k}$, what upper bound does the M-test give for $\\left|\\sum_{k=1}^{\\infty} \\frac{${coefficient}\\sin(kx)}{${r}^k}\\right|$?`,
              `取 $M_k = \\frac{${c}}{${r}^k}$，M 判别法给出的 $\\left|\\sum_{k=1}^{\\infty} \\frac{${coefficient}\\sin(kx)}{${r}^k}\\right|$ 的上界是多少？`,
            ],
            answer,
            [
              why(
                first,
                `That is the first bound $M_1$ alone; the bound is the sum of all the $M_k$.`,
                `这只是第一个界 $M_1$；界是所有 $M_k$ 之和。`,
              ),
              why(
                Q.of(c),
                `That is the numerator alone; the bounds shrink by the factor $${r}$ at each step and sum to $${answer.toLatex()}$.`,
                `这只是分子；各个界每一步缩小到 $\\frac{1}{${r}}$，和是 $${answer.toLatex()}$。`,
              ),
              why(
                Q.of(c * r, r - 1),
                `That starts the geometric sum at $k = 0$; the series starts at $k = 1$.`,
                `这是让几何级数从 $k = 0$ 开始；级数从 $k = 1$ 开始。`,
              ),
              why(
                Q.of(1, r - 1).add(Q.of(c)),
                `That adds $${c}$ to $\\frac{1}{${r - 1}}$; the coefficient $${c}$ multiplies the sum.`,
                `这是把 $${c}$ 加到 $\\frac{1}{${r - 1}}$ 上；系数 $${c}$ 应该乘到和上。`,
              ),
            ],
            solution(
              [
                [
                  ["Bound each term", "估计每一项"],
                  [
                    `$|\\sin(kx)| \\le 1$, so each term is at most $M_k = \\frac{${c}}{${r}^k}$ in size, at every $x$.`,
                    `$|\\sin(kx)| \\le 1$，所以在每个 $x$ 处，每一项的大小至多是 $M_k = \\frac{${c}}{${r}^k}$。`,
                  ],
                ],
                [
                  ["Sum the bounds", "把界相加"],
                  [
                    `$\\sum M_k$ is geometric with first term $${first.toLatex()}$ and ratio $\\frac{1}{${r}}$: $${geo} = ${answer.toLatex()}$.`,
                    `$\\sum M_k$ 是首项为 $${first.toLatex()}$、公比为 $\\frac{1}{${r}}$ 的几何级数：$${geo} = ${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `$${answer.toLatex()} - ${first.toLatex()} = ${answer.sub(first).toLatex()}$, which is $\\frac{1}{${r}}$ of $${answer.toLatex()}$, as a geometric sum with ratio $\\frac{1}{${r}}$ requires.`,
                `$${answer.toLatex()} - ${first.toLatex()} = ${answer.sub(first).toLatex()}$，是 $${answer.toLatex()}$ 的 $\\frac{1}{${r}}$，与公比为 $\\frac{1}{${r}}$ 的几何级数相符。`,
              ],
            ),
          );
        },
      ),
      point(
        "the-tail-of-a-power-series",
        ["The tail of a power series", "幂级数的尾部"],
        [
          "A power series converges uniformly on any closed interval inside its interval of convergence, and the M-test shows it. On the interval where $|x| \\le \\frac{1}{r}$, each power is at most the matching power of $\\frac{1}{r}$. So the tail after $N$ terms is at most a geometric sum, and this bound does not depend on $x$, which is what uniformity means.\n\nFor $|x| \\le \\frac{1}{2}$ and the tail $\\sum_{k=4}^{\\infty} x^k$, the bound is $\\sum_{k=4}^{\\infty} \\frac{1}{2^k} = \\frac{1}{16} \\cdot \\frac{1}{1 - \\frac{1}{2}} = \\frac{1}{8}$.\n\nCheck: at $x = \\frac{1}{2}$ the tail equals $\\frac{1}{8}$ exactly, so the bound cannot be improved.\n\n> **Watch out.** The tail starts at $k = N + 1$, so its first term is $\\frac{1}{r^{N+1}}$. Divide that first term by $1 - \\frac{1}{r}$, not by $r - 1$.",
          "幂级数在收敛区间内部的任何闭区间上一致收敛，M 判别法能说明这一点。在 $|x| \\le \\frac{1}{r}$ 的区间上，每个幂不超过 $\\frac{1}{r}$ 对应的幂。所以 $N$ 项之后的尾部不超过一个几何级数的和，而这个界与 $x$ 无关，这正是一致性的含义。\n\n对 $|x| \\le \\frac{1}{2}$ 和尾部 $\\sum_{k=4}^{\\infty} x^k$，界是 $\\sum_{k=4}^{\\infty} \\frac{1}{2^k} = \\frac{1}{16} \\cdot \\frac{1}{1 - \\frac{1}{2}} = \\frac{1}{8}$。\n\n检验：在 $x = \\frac{1}{2}$ 处，尾部恰好等于 $\\frac{1}{8}$，所以这个界不能再改进。\n\n> **注意。** 尾部从 $k = N + 1$ 开始，所以它的首项是 $\\frac{1}{r^{N+1}}$。要用首项除以 $1 - \\frac{1}{r}$，而不是除以 $r - 1$。",
        ],
        (rng) => {
          const r = rng.int(2, 6);
          const N = rng.int(1, 6);
          const answer = Q.of(1, r ** N * (r - 1));
          const firstTerm = r ** (N + 1);
          return solved(
            [
              `For $|x| \\le \\frac{1}{${r}}$, what does the M-test give as the bound on $\\left|\\sum_{k=${N + 1}}^{\\infty} x^k\\right|$?`,
              `当 $|x| \\le \\frac{1}{${r}}$ 时，M 判别法给出的 $\\left|\\sum_{k=${N + 1}}^{\\infty} x^k\\right|$ 的界是多少？`,
            ],
            answer,
            [
              why(
                Q.of(1, firstTerm),
                `That is the first term of the tail alone; the bound is the whole geometric sum.`,
                `这只是尾部的首项；界是整个几何级数的和。`,
              ),
              why(
                Q.of(1, r ** N),
                `That is $\\frac{1}{${r ** N}}$, the size of the last term kept, not the sum of the tail.`,
                `这是保留的最后一项的大小 $\\frac{1}{${r ** N}}$，不是尾部之和。`,
              ),
              why(
                Q.of(1, firstTerm * (r - 1)),
                `That divides the first term by $${r - 1}$; the sum is the first term divided by $1 - \\frac{1}{${r}}$.`,
                `这是用首项除以 $${r - 1}$；和是首项除以 $1 - \\frac{1}{${r}}$。`,
              ),
              why(
                Q.of(1, r - 1),
                `That is the bound for the whole series from $k = 1$, not for the tail.`,
                `这是从 $k = 1$ 开始的整个级数的界，不是尾部的界。`,
              ),
            ],
            solution(
              [
                [
                  ["Bound each power", "估计每个幂"],
                  [
                    `For $|x| \\le \\frac{1}{${r}}$, $|x^k| \\le \\frac{1}{${r}^k}$, a bound that does not depend on $x$.`,
                    `当 $|x| \\le \\frac{1}{${r}}$ 时，$|x^k| \\le \\frac{1}{${r}^k}$，这个界与 $x$ 无关。`,
                  ],
                ],
                [
                  ["Sum the geometric tail", "求几何级数的尾部之和"],
                  [
                    `$\\sum_{k=${N + 1}}^{\\infty} \\frac{1}{${r}^k}$ has first term $\\frac{1}{${firstTerm}}$ and ratio $\\frac{1}{${r}}$, so it is $\\frac{1}{${firstTerm}} \\cdot \\frac{1}{1 - \\frac{1}{${r}}} = ${answer.toLatex()}$.`,
                    `$\\sum_{k=${N + 1}}^{\\infty} \\frac{1}{${r}^k}$ 的首项是 $\\frac{1}{${firstTerm}}$，公比是 $\\frac{1}{${r}}$，所以和是 $\\frac{1}{${firstTerm}} \\cdot \\frac{1}{1 - \\frac{1}{${r}}} = ${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `At $x = \\frac{1}{${r}}$ every term meets its bound, so the tail equals $${answer.toLatex()}$ there and the bound cannot be improved.`,
                `在 $x = \\frac{1}{${r}}$ 处每一项都达到它的界，所以尾部在那里等于 $${answer.toLatex()}$，这个界不能再改进。`,
              ],
            ),
          );
        },
      ),
    ],
  ),
  intro: t(
    "Each term of $\\sum_{k=1}^{\\infty} \\frac{\\sin(kx)}{2^k}$ is at most $\\frac{1}{2^k}$ in size, at every $x$. Since $\\sum \\frac{1}{2^k} = 1$ converges, the M-test makes the series converge uniformly, with value at most $1$ in size.\n\nCheck: $\\frac{1}{2} + \\frac{1}{4} + \\frac{1}{8} + \\cdots$ has partial sums $1 - \\frac{1}{2^n}$, which rise to $1$.\n\nIn this lesson we bound a series of functions by a series of numbers, and estimate the tail of a power series.",
    "$\\sum_{k=1}^{\\infty} \\frac{\\sin(kx)}{2^k}$ 的每一项在每个 $x$ 处的大小都至多是 $\\frac{1}{2^k}$。因为 $\\sum \\frac{1}{2^k} = 1$ 收敛，由 M 判别法，级数一致收敛，值的大小至多是 $1$。\n\n检验：$\\frac{1}{2} + \\frac{1}{4} + \\frac{1}{8} + \\cdots$ 的部分和是 $1 - \\frac{1}{2^n}$，它上升趋向 $1$。\n\n本课我们用数项级数控制函数项级数，并估计幂级数的尾部。",
  ),
};

const contractions = {
  ...topic(
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
          "A contraction shrinks all distances by a constant factor below one. On a complete metric space it has exactly one fixed point, and iterating from any starting point converges to it, as the iterates form a Cauchy sequence. Completeness is essential, because otherwise the limit could be missing from the space. For a linear map, the fixed point comes straight from solving $x = f(x)$.\n\nFor $f(x) = \\frac{2}{3}x + 4$: $x = \\frac{2}{3}x + 4$ gives $\\frac{1}{3}x = 4$, so $x = 12$.\n\nCheck: $f(12) = 8 + 4 = 12$. Iterating from $0$ gives $4, \\frac{20}{3}, \\frac{76}{9}, \\ldots$, which climb towards $12$.\n\n> **Watch out.** Divide $c$ by $1 - \\frac{p}{q}$, not by $\\frac{p}{q}$. And $f(0) = c$ is only the first iterate, not the fixed point.",
          "压缩映射把所有距离按小于 1 的固定比例缩小。在完备度量空间上，它恰有一个不动点，从任何起点迭代都收敛到它，因为迭代序列是柯西数列。完备性至关重要，否则极限可能不在这个空间里。对线性映射，不动点可以直接由解 $x = f(x)$ 得到。\n\n对 $f(x) = \\frac{2}{3}x + 4$：由 $x = \\frac{2}{3}x + 4$ 得 $\\frac{1}{3}x = 4$，所以 $x = 12$。\n\n检验：$f(12) = 8 + 4 = 12$。从 $0$ 开始迭代得 $4, \\frac{20}{3}, \\frac{76}{9}, \\ldots$，它们逐渐上升趋向 $12$。\n\n> **注意。** 要用 $c$ 除以 $1 - \\frac{p}{q}$，而不是除以 $\\frac{p}{q}$。$f(0) = c$ 只是第一次迭代的结果，不是不动点。",
        ],
        (rng) => {
          const q = rng.int(2, 9);
          const p = rng.pick(Array.from({ length: q - 1 }, (_, i) => i + 1).filter((v) => gcd(v, q) === 1));
          const c = rng.int(1, 12);
          const answer = Q.of(c * q, q - p);
          const ratio = frac(p, q);
          const image = Q.of(p, q).mul(answer);
          return solved(
            [
              `What is the fixed point of the contraction $f(x) = ${ratio}x + ${c}$?`,
              `压缩映射 $f(x) = ${ratio}x + ${c}$ 的不动点是多少？`,
            ],
            answer,
            [
              why(
                Q.of(c),
                `That is $f(0)$, the first iterate from $0$, not the fixed point.`,
                `这是 $f(0)$，即从 $0$ 开始的第一次迭代，不是不动点。`,
              ),
              why(
                Q.of(c * q, q + p),
                `That solves $x = -${ratio}x + ${c}$; moving $${ratio}x$ across subtracts it.`,
                `这是在解 $x = -${ratio}x + ${c}$；把 $${ratio}x$ 移过去要减去它。`,
              ),
              why(
                Q.of(c * p, q),
                `That is $${ratio}$ times $${c}$, which is not a solution of $x = f(x)$.`,
                `这是 $${ratio}$ 乘 $${c}$，它不是 $x = f(x)$ 的解。`,
              ),
              why(
                Q.of(c * q, p),
                `That divides $${c}$ by $${ratio}$; it must be divided by $1 - ${ratio} = ${frac(q - p, q)}$.`,
                `这是用 $${ratio}$ 除 $${c}$；应该除以 $1 - ${ratio} = ${frac(q - p, q)}$。`,
              ),
            ],
            solution(
              [
                [
                  ["Set up the equation", "列出方程"],
                  [
                    `A fixed point satisfies $x = ${ratio}x + ${c}$, so $${frac(q - p, q)}x = ${c}$.`,
                    `不动点满足 $x = ${ratio}x + ${c}$，所以 $${frac(q - p, q)}x = ${c}$。`,
                  ],
                ],
                [
                  ["Solve it", "解方程"],
                  [
                    `$x = ${c} \\div ${frac(q - p, q)} = ${answer.toLatex()}$.`,
                    `$x = ${c} \\div ${frac(q - p, q)} = ${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `$f(${answer.toLatex()}) = ${image.toLatex()} + ${c} = ${answer.toLatex()}$, so the point is fixed.`,
                `$f(${answer.toLatex()}) = ${image.toLatex()} + ${c} = ${answer.toLatex()}$，所以这一点不动。`,
              ],
            ),
          );
        },
      ),
      point(
        "the-error-after-iterating",
        ["The error after iterating", "迭代后的误差"],
        [
          "Each application of a contraction with factor $L$ multiplies the distance to the fixed point by at most $L$. So after $n$ steps, the distance is at most $L^n$ times the first distance. The error therefore shrinks geometrically, and this is what makes fixed-point iteration practical. The smaller the factor, the fewer steps are needed, and the rate does not depend on the starting point.\n\nWith factor $\\frac{1}{3}$ and a starting distance of $9$, the bounds after each step are $3, 1, \\frac{1}{3}, \\frac{1}{9}, \\ldots$, so after $4$ steps the distance is at most $9 \\cdot \\frac{1}{3^4} = \\frac{1}{9}$.\n\nCheck: $9 \\cdot \\frac{1}{81} = \\frac{1}{9}$, and each step divides the previous bound by $3$.\n\n> **Watch out.** The factors multiply, giving $L^n$, not $nL$. Count the steps exactly: after $n$ steps there are $n$ factors.",
          "每应用一次比例为 $L$ 的压缩映射，到不动点的距离至多乘以 $L$。所以 $n$ 步之后，距离至多是最初距离的 $L^n$ 倍。因此误差按几何级数缩小，这正是不动点迭代实用的原因。比例越小，需要的步数越少，而这个速度与起点无关。\n\n比例为 $\\frac{1}{3}$，起始距离为 $9$，每步之后的界依次是 $3, 1, \\frac{1}{3}, \\frac{1}{9}, \\ldots$，所以 $4$ 步之后距离至多是 $9 \\cdot \\frac{1}{3^4} = \\frac{1}{9}$。\n\n检验：$9 \\cdot \\frac{1}{81} = \\frac{1}{9}$，每一步都把前一个界除以 $3$。\n\n> **注意。** 各个比例相乘，得到 $L^n$，而不是 $nL$。要准确数步数：$n$ 步之后有 $n$ 个因子。",
        ],
        (rng) => {
          const q = rng.int(2, 6);
          const n = rng.int(2, 5);
          const d = rng.int(1, 12);
          const answer = Q.of(d, q ** n);
          const scaled = d === 1 ? `\\frac{1}{${q}^{${n}}}` : `${d} \\cdot \\frac{1}{${q}^{${n}}}`;
          return solved(
            [
              `A contraction has factor $\\frac{1}{${q}}$, and the starting point is at distance ${d} from the fixed point. What bound on the distance holds after ${n} steps?`,
              `压缩映射的比例是 $\\frac{1}{${q}}$，起点到不动点的距离是 ${d}。${n} 步之后，距离的界是多少？`,
            ],
            answer,
            [
              why(
                Q.of(d, q * n),
                `That divides by $${q} \\cdot ${n}$; the factors multiply, giving $${q}^{${n}}$.`,
                `这是除以 $${q} \\cdot ${n}$；各个因子相乘，得 $${q}^{${n}}$。`,
              ),
              why(Q.of(d, q), `That is the bound after one step only.`, `这只是一步之后的界。`),
              why(
                Q.of(d * n, q),
                `That multiplies by $${n}$; each step divides the distance by $${q}$ again.`,
                `这是乘以 $${n}$；每一步都再把距离除以 $${q}$。`,
              ),
              why(
                Q.of(d, q ** (n + 1)),
                `That is the bound after $${n + 1}$ steps, one too many.`,
                `这是 $${n + 1}$ 步之后的界，多了一步。`,
              ),
            ],
            solution(
              [
                [
                  ["Follow one step", "看一步"],
                  [`Each step multiplies the distance by at most $\\frac{1}{${q}}$.`, `每一步距离至多乘以 $\\frac{1}{${q}}$。`],
                ],
                [
                  ["Repeat the step", "重复这一步"],
                  [
                    `After ${n} steps the bound is $${scaled} = ${answer.toLatex()}$.`,
                    `${n} 步之后的界是 $${scaled} = ${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `After $${n - 1}$ steps the bound is $${Q.of(d, q ** (n - 1)).toLatex()}$, and one more step divides it by $${q}$, giving $${answer.toLatex()}$.`,
                `$${n - 1}$ 步之后的界是 $${Q.of(d, q ** (n - 1)).toLatex()}$，再走一步把它除以 $${q}$，得 $${answer.toLatex()}$。`,
              ],
            ),
          );
        },
      ),
    ],
  ),
  intro: t(
    "The map $f(x) = \\frac{1}{2}x + 3$ halves every distance, so it is a contraction. Its fixed point solves $x = \\frac{1}{2}x + 3$, which gives $x = 6$. Starting at $0$, the iterates $3, \\frac{9}{2}, \\frac{21}{4}, \\ldots$ approach $6$, and their distance to $6$ halves at each step.\n\nCheck: $f(6) = 3 + 3 = 6$, and the distances $6, 3, \\frac{3}{2}, \\frac{3}{4}$ halve each time.\n\nIn this lesson we find the fixed point of a contraction, and bound the error after a number of iterations.",
    "映射 $f(x) = \\frac{1}{2}x + 3$ 把每个距离减半，所以它是压缩映射。它的不动点满足 $x = \\frac{1}{2}x + 3$，得 $x = 6$。从 $0$ 开始，迭代值 $3, \\frac{9}{2}, \\frac{21}{4}, \\ldots$ 趋近 $6$，它们到 $6$ 的距离每步减半。\n\n检验：$f(6) = 3 + 3 = 6$，距离 $6, 3, \\frac{3}{2}, \\frac{3}{4}$ 每次减半。\n\n本课我们求压缩映射的不动点，并估计若干次迭代之后的误差。",
  ),
};

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
