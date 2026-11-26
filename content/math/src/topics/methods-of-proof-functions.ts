import type { Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { proofDrawings1 } from "../explanation-drawings-methods-of-proof-1.ts";

import { numberProblem, why, yesNo } from "../problems.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";
import { oneOf } from "./calculus-common.ts";
import { walked } from "./calculus-i-differentiation.ts";
import { range, setProblem, setTex } from "./methods-of-proof-common.ts";
import { gcd, mod } from "./methods-of-proof-number-theory.ts";

// Methods of Proof unit 5: limits of sequences, injections and surjections, and cardinality.

/** math wraps LaTeX as an option. */
const math = (s: string) => t(`$${s}$`, `$${s}$`);

/** signed writes "+ 3" or "- 3" after a term, or nothing for 0. */
const signed = (c: number) => (c === 0 ? "" : c > 0 ? ` + ${c}` : ` - ${-c}`);

/** coef writes a coefficient before a variable: "", "-", "3". */
const coef = (a: number) => (a === 1 ? "" : a === -1 ? "-" : `${a}`);

/** firstN finds the least N ≥ 1 such that test holds for every n from N to a large bound, assuming test eventually holds for good. */
function firstN(test: (n: number) => boolean, bound = 100000): number {
  let N = bound;
  while (N > 1 && test(N - 1)) N--;
  return N;
}

/** NullSeq is a sequence tending to 0, with its LaTeX and values. */
interface NullSeq {
  readonly tex: string;
  readonly at: (n: number) => number;
  /** c is the size of the numerator. */
  readonly c: number;
  /** den is the LaTeX of the denominator. */
  readonly den: string;
  /** denAt is the value of the denominator. */
  readonly denAt: (n: number) => number;
}

/** nullSeq picks a sequence that tends to 0. */
function nullSeq(rng: Rng): NullSeq {
  const c = rng.int(1, 9);
  const k = rng.int(0, 9);
  const kind = rng.int(0, 2);
  const linear = { c, den: `n${signed(k)}`, denAt: (n: number) => n + k, at: (n: number) => c / (n + k) };
  if (kind === 0) return { ...linear, tex: `\\dfrac{${c}}{n${signed(k)}}` };
  if (kind === 1)
    return { c, tex: `\\dfrac{${c}}{n^2${signed(k)}}`, den: `n^2${signed(k)}`, denAt: (n) => n * n + k, at: (n) => c / (n * n + k) };
  return { ...linear, tex: `\\dfrac{(-1)^n \\cdot ${c}}{n${signed(k)}}` };
}

/** theLimitOfANullSequence defines convergence to 0 with ε and N. */
export const theLimitOfANullSequence: TopicDef = {
  id: "the-limit-of-a-null-sequence",
  title: t("The Limit of a Null Sequence", "零数列的极限"),
  summary: t(
    "aₙ → 0 means: for every ε > 0 there is an N such that |aₙ| < ε for all n ≥ N.",
    "aₙ → 0 的意思是：对每个 ε > 0，存在 N，使得对所有 n ≥ N 都有 |aₙ| < ε。",
  ),
  intro: t(
    "Take $a_n = \\dfrac{4}{n}$ and the tolerance $\\varepsilon = \\dfrac{1}{10}$. Then $\\dfrac{4}{n} < \\dfrac{1}{10}$ exactly when $n > 40$, so from $N = 41$ on every term is within $\\dfrac{1}{10}$ of $0$. The sequence tends to $0$ because such an $N$ exists for every tolerance, however small.\n\nCheck: $a_{41} = \\dfrac{4}{41}$ is less than $\\dfrac{4}{40} = \\dfrac{1}{10}$, while $a_{40} = \\dfrac{1}{10}$ is not less than the tolerance, so $N = 40$ would be too early.\n\nIn this lesson we find $N$ for a given tolerance and read the definition of a null sequence, with its quantifiers in the right order.",
    "取 $a_n = \\dfrac{4}{n}$，容差 $\\varepsilon = \\dfrac{1}{10}$。$\\dfrac{4}{n} < \\dfrac{1}{10}$ 当且仅当 $n > 40$，所以从 $N = 41$ 起每一项与 $0$ 的距离都小于 $\\dfrac{1}{10}$。这个数列趋于 $0$，是因为无论容差多小，这样的 $N$ 都存在。\n\n检验：$a_{41} = \\dfrac{4}{41}$ 小于 $\\dfrac{4}{40} = \\dfrac{1}{10}$，而 $a_{40} = \\dfrac{1}{10}$ 并不小于容差，所以 $N = 40$ 太早了。\n\n本课我们对给定的容差求 $N$，并按正确的量词顺序理解零数列的定义。",
  ),
  prerequisites: ["limits-of-sequences", "nested-quantifiers"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "finding-n-for-a-given-epsilon",
      title: t("Finding $N$ for a given $\\varepsilon$", "对给定的 $\\varepsilon$ 求 $N$"),
      explanation: t(
        "For a particular tolerance, solve the inequality for the index to find how far along the sequence you must go. For $a_n = \\dfrac{3}{n}$ and $\\varepsilon = \\dfrac{1}{10}$: $\\dfrac{3}{n} < \\dfrac{1}{10}$ exactly when $n > 30$, so the smallest $N$ that works is $31$.\n\n> **Watch out.** The inequality is strict. A term exactly equal to $\\varepsilon$ is not within the tolerance, so $N$ is the first index past the boundary, not the boundary itself.",
        "对于一个具体的容差，解关于下标的不等式，就知道需要沿着序列走多远。对 $a_n = \\dfrac{3}{n}$ 与 $\\varepsilon = \\dfrac{1}{10}$：$\\dfrac{3}{n} < \\dfrac{1}{10}$ 当且仅当 $n > 30$，所以可行的最小 $N$ 是 $31$。\n\n> **注意。** 不等式是严格的。恰好等于 $\\varepsilon$ 的项不在容差之内，所以 $N$ 是越过边界后的第一个下标，而不是边界本身。",
      ),
      generate(rng) {
        const s = nullSeq(rng);
        const m = rng.pick([10, 20, 50, 100, 200, 1000]);
        const N = firstN((n) => Math.abs(s.at(n)) * m < 1 - 1e-12);
        const bound = s.c * m;
        return numberProblem({
          prompt: t(
            `Let $a_n = ${s.tex}$ and $\\varepsilon = \\dfrac{1}{${m}}$. Find the smallest positive integer $N$ such that $|a_n| < \\varepsilon$ for all $n \\ge N$.`,
            `设 $a_n = ${s.tex}$，$\\varepsilon = \\dfrac{1}{${m}}$。求最小的正整数 $N$，使得对所有 $n \\ge N$ 都有 $|a_n| < \\varepsilon$。`,
          ),
          answer: N,
          wrong: [N + 1],
          mistakes: [
            ...(N > 1
              ? [
                  why(
                    N - 1,
                    `At that index $|a_n| \\ge \\varepsilon$, so that term is not yet within the tolerance.`,
                    `在这个下标处 $|a_n| \\ge \\varepsilon$，这一项还不在容差之内。`,
                  ),
                ]
              : []),
            ...(m !== N && m !== N - 1
              ? [
                  why(
                    m,
                    "That is the reciprocal of $\\varepsilon$; the index depends on the terms too.",
                    "这是 $\\varepsilon$ 的倒数；下标还取决于各项本身。",
                  ),
                ]
              : []),
          ],
          solution: walked(
            [
              [
                ["Write the size of the terms", "写出各项的大小"],
                t(
                  `$|a_n| = \\dfrac{${s.c}}{${s.den}}$, which decreases as $n$ grows.`,
                  `$|a_n| = \\dfrac{${s.c}}{${s.den}}$，它随 $n$ 增大而减小。`,
                ),
              ],
              [
                ["Solve the inequality", "解不等式"],
                t(
                  `$\\dfrac{${s.c}}{${s.den}} < \\dfrac{1}{${m}} \\iff ${s.den} > ${bound}$. The first index where this holds is $n = ${N}$, since $${s.denAt(N)} > ${bound}$${N > 1 ? ` while $${s.denAt(N - 1)} \\le ${bound}$` : ""}.`,
                  `$\\dfrac{${s.c}}{${s.den}} < \\dfrac{1}{${m}} \\iff ${s.den} > ${bound}$。第一个满足它的下标是 $n = ${N}$，因为 $${s.denAt(N)} > ${bound}$${N > 1 ? `，而 $${s.denAt(N - 1)} \\le ${bound}$` : ""}。`,
                ),
              ],
            ],
            N > 1
              ? t(
                  `$|a_{${N}}| = \\dfrac{${s.c}}{${s.denAt(N)}} < \\dfrac{1}{${m}}$, while $|a_{${N - 1}}| = \\dfrac{${s.c}}{${s.denAt(N - 1)}} \\ge \\dfrac{1}{${m}}$, so $N = ${N - 1}$ would be too early.`,
                  `$|a_{${N}}| = \\dfrac{${s.c}}{${s.denAt(N)}} < \\dfrac{1}{${m}}$，而 $|a_{${N - 1}}| = \\dfrac{${s.c}}{${s.denAt(N - 1)}} \\ge \\dfrac{1}{${m}}$，所以 $N = ${N - 1}$ 太早了。`,
                )
              : t(
                  `Already $|a_1| = \\dfrac{${s.c}}{${s.denAt(1)}} < \\dfrac{1}{${m}}$, and the terms only get smaller.`,
                  `已经有 $|a_1| = \\dfrac{${s.c}}{${s.denAt(1)}} < \\dfrac{1}{${m}}$，之后各项只会更小。`,
                ),
          ),
        });
      },
    },
    {
      id: "the-definition-of-a-null-sequence",
      title: t("The definition", "定义"),
      explanation: t(
        'The order of quantifiers matters: $\\forall \\varepsilon > 0\\ \\exists N\\ \\forall n \\ge N: |a_n| < \\varepsilon$. $N$ may depend on $\\varepsilon$. Swapping to $\\exists N\\ \\forall \\varepsilon$ would force $a_n = 0$ from some point on.\n\n> **Watch out.** "For every $\\varepsilon$" must come first and "all $n \\ge N$" last. Asking for only one $\\varepsilon$, or for just one small term past each point, says much less than convergence.',
        "量词顺序很重要：$\\forall \\varepsilon > 0\\ \\exists N\\ \\forall n \\ge N: |a_n| < \\varepsilon$。$N$ 可以依赖于 $\\varepsilon$。若换成 $\\exists N\\ \\forall \\varepsilon$，就会迫使 $a_n$ 从某项起全为 $0$。\n\n> **注意。** “对每个 $\\varepsilon$”必须放在最前，“所有 $n \\ge N$”放在最后。只要求一个 $\\varepsilon$，或者只要求每个位置之后有一项很小，都远弱于收敛。",
      ),
      generate(rng) {
        const s = nullSeq(rng);
        const a = `\\left|${s.tex}\\right|`;
        const pick = rng.int(0, 1);
        const right =
          pick === 0
            ? `\\forall \\varepsilon > 0\\ \\exists N\\ \\forall n \\ge N:\\ ${a} < \\varepsilon`
            : `\\forall \\varepsilon > 0\\ \\exists N\\ \\forall n > N:\\ ${a} < \\varepsilon`;
        const swapped = `\\exists N\\ \\forall \\varepsilon > 0\\ \\forall n \\ge N:\\ ${a} < \\varepsilon`;
        const some = `\\forall \\varepsilon > 0\\ \\forall N\\ \\exists n \\ge N:\\ ${a} < \\varepsilon`;
        const one = `\\exists \\varepsilon > 0\\ \\exists N\\ \\forall n \\ge N:\\ ${a} < \\varepsilon`;
        const N10 = firstN((n) => Math.abs(s.at(n)) * 10 < 1 - 1e-12);
        return reasoned(
          oneOf(
            rng,
            t(`Which statement says that $${s.tex} \\to 0$?`, `哪个命题表示 $${s.tex} \\to 0$？`),
            math(right),
            [math(swapped), math(some), math(one)],
            walked(
              [
                [
                  ["Read the quantifiers in order", "按顺序读量词"],
                  t(
                    "First every tolerance $\\varepsilon > 0$ is given; then a starting index $N$ is chosen, which may depend on $\\varepsilon$; then the condition must hold for every later $n$.",
                    "先给定任意容差 $\\varepsilon > 0$；再选出一个起始下标 $N$，它可以依赖于 $\\varepsilon$；然后条件要对之后的每个 $n$ 都成立。",
                  ),
                ],
                [
                  ["Match the statement", "对照命题"],
                  t(
                    `Only $${right}$ has the order "for every $\\varepsilon$, some $N$, all later $n$".`,
                    `只有 $${right}$ 的顺序是“对每个 $\\varepsilon$，存在 $N$，之后所有 $n$”。`,
                  ),
                ],
              ],
              t(
                `For $\\varepsilon = \\dfrac{1}{10}$ the statement asks for some $N$, and $N = ${N10}$ works: $|a_n| < \\dfrac{1}{10}$ for every $n \\ge ${N10}$.`,
                `对 $\\varepsilon = \\dfrac{1}{10}$，命题要求存在某个 $N$，而 $N = ${N10}$ 可行：对每个 $n \\ge ${N10}$ 都有 $|a_n| < \\dfrac{1}{10}$。`,
              ),
            ),
          ),
          [
            [
              `$${swapped}$`,
              "One $N$ would have to work for every $\\varepsilon$ at once, which forces $a_n = 0$ from $N$ on; these terms are never $0$.",
              "一个 $N$ 要同时适用于所有 $\\varepsilon$，这会迫使从 $N$ 起 $a_n = 0$；而这些项都不为 $0$。",
            ],
            [
              `$${some}$`,
              "That only asks for one small term beyond each point, not for all terms from some point on.",
              "这只要求每个位置之后有一项很小，而不是从某处起所有项都很小。",
            ],
            [
              `$${one}$`,
              "That asks for a single tolerance; a large one such as $\\varepsilon = 100$ is met by any bounded sequence.",
              "这只要求一个容差；像 $\\varepsilon = 100$ 这样大的容差，任何有界数列都能满足。",
            ],
          ],
        );
      },
    },
  ],
};

/** provingTheLimitOfANullSequence writes ε–N proofs for null sequences. */
export const provingTheLimitOfANullSequence: TopicDef = {
  id: "proving-the-limit-of-a-null-sequence",
  title: t("Proving the Limit of a Null Sequence", "证明零数列的极限"),
  summary: t(
    "Given ε > 0, solve |aₙ| < ε for n (often after bounding |aₙ| by something simpler) to choose N.",
    "给定 ε > 0，解关于 n 的不等式 |aₙ| < ε（常先把 |aₙ| 放大为更简单的式子），从而选出 N。",
  ),
  intro: t(
    "To prove $\\dfrac{6}{n + 1} \\to 0$, let $\\varepsilon > 0$ be arbitrary. Then $\\dfrac{6}{n + 1} < \\varepsilon \\iff n + 1 > \\dfrac{6}{\\varepsilon} \\iff n > \\dfrac{6}{\\varepsilon} - 1$. So choose an integer $N > \\dfrac{6}{\\varepsilon} - 1$: every $n \\ge N$ then gives $\\left|\\dfrac{6}{n + 1}\\right| < \\varepsilon$.\n\nCheck: for $\\varepsilon = \\dfrac{1}{2}$ the rule asks for $N > 11$. With $N = 12$, $a_{12} = \\dfrac{6}{13} < \\dfrac{1}{2}$, while $a_{11} = \\dfrac{6}{12} = \\dfrac{1}{2}$ is not below the tolerance.\n\nIn this lesson we choose $N$ as a formula in $\\varepsilon$, and bound awkward terms by simpler ones first.",
    "要证明 $\\dfrac{6}{n + 1} \\to 0$，任取 $\\varepsilon > 0$。$\\dfrac{6}{n + 1} < \\varepsilon \\iff n + 1 > \\dfrac{6}{\\varepsilon} \\iff n > \\dfrac{6}{\\varepsilon} - 1$。所以取整数 $N > \\dfrac{6}{\\varepsilon} - 1$：于是每个 $n \\ge N$ 都满足 $\\left|\\dfrac{6}{n + 1}\\right| < \\varepsilon$。\n\n检验：对 $\\varepsilon = \\dfrac{1}{2}$，规则要求 $N > 11$。取 $N = 12$，$a_{12} = \\dfrac{6}{13} < \\dfrac{1}{2}$，而 $a_{11} = \\dfrac{6}{12} = \\dfrac{1}{2}$ 并不小于容差。\n\n本课我们把 $N$ 选成关于 $\\varepsilon$ 的公式，并先用更简单的式子放大难处理的项。",
  ),
  prerequisites: ["the-limit-of-a-null-sequence"],
  encompasses: [{ topic: "the-limit-of-a-null-sequence", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "choosing-n-in-terms-of-epsilon",
      title: t("Choosing $N$ in terms of $\\varepsilon$", "用 $\\varepsilon$ 表示 $N$"),
      explanation: t(
        "A convergence proof must work for every tolerance, so solve the inequality symbolically and choose the index as a formula in the tolerance. To prove $\\dfrac{5}{n + 2} \\to 0$: given $\\varepsilon > 0$, $\\dfrac{5}{n + 2} < \\varepsilon \\iff n > \\dfrac{5}{\\varepsilon} - 2$. So choose any integer $N > \\dfrac{5}{\\varepsilon} - 2$.\n\n> **Watch out.** Solving $\\dfrac{c}{n + k} < \\varepsilon$ puts $\\varepsilon$ in a denominator: $n + k > \\dfrac{c}{\\varepsilon}$. Multiplying $c$ by $\\varepsilon$ instead gives a bound that shrinks as the tolerance shrinks, which cannot be right.",
        "收敛性证明必须对每个容差都成立，所以要符号化地解不等式，把下标选成关于容差的公式。证明 $\\dfrac{5}{n + 2} \\to 0$：给定 $\\varepsilon > 0$，$\\dfrac{5}{n + 2} < \\varepsilon \\iff n > \\dfrac{5}{\\varepsilon} - 2$。所以取任意整数 $N > \\dfrac{5}{\\varepsilon} - 2$。\n\n> **注意。** 解 $\\dfrac{c}{n + k} < \\varepsilon$ 时，$\\varepsilon$ 会到分母上：$n + k > \\dfrac{c}{\\varepsilon}$。若把 $c$ 乘以 $\\varepsilon$，得到的界会随容差变小而变小，这不可能对。",
      ),
      generate(rng) {
        const c = rng.int(2, 9);
        const k = rng.int(1, 9);
        const square = rng.bool();
        const den = square ? `n^2 + ${k}` : `n + ${k}`;
        const tex = `\\dfrac{${c}}{${den}}`;
        const right = square ? `\\sqrt{\\dfrac{${c}}{\\varepsilon} - ${k}}` : `\\dfrac{${c}}{\\varepsilon} - ${k}`;
        const wrong: [string, string, string][] = square
          ? [
              [`\\sqrt{\\dfrac{1}{\\varepsilon} - ${k}}`, `That drops the numerator $${c}$.`, `这丢掉了分子 $${c}$。`],
              [
                `\\sqrt{${c}\\varepsilon - ${k}}`,
                `Solving puts $\\varepsilon$ in a denominator: $n^2 + ${k} > \\dfrac{${c}}{\\varepsilon}$, not $${c}\\varepsilon$.`,
                `求解后 $\\varepsilon$ 在分母上：$n^2 + ${k} > \\dfrac{${c}}{\\varepsilon}$，而不是 $${c}\\varepsilon$。`,
              ],
              [
                `\\sqrt{\\dfrac{${c}}{\\varepsilon}} - ${k}`,
                `$${k}$ is added to $n^2$, so subtract it before taking the square root.`,
                `$${k}$ 是加在 $n^2$ 上的，所以要在开方之前减去它。`,
              ],
            ]
          : [
              [
                `${c}\\varepsilon - ${k}`,
                `Solving puts $\\varepsilon$ in a denominator: $n + ${k} > \\dfrac{${c}}{\\varepsilon}$, not $${c}\\varepsilon$.`,
                `求解后 $\\varepsilon$ 在分母上：$n + ${k} > \\dfrac{${c}}{\\varepsilon}$，而不是 $${c}\\varepsilon$。`,
              ],
              [
                `\\dfrac{\\varepsilon}{${c}} - ${k}`,
                `That flips the wrong fraction: taking reciprocals of $\\dfrac{${c}}{n + ${k}} < \\varepsilon$ gives $\\dfrac{n + ${k}}{${c}} > \\dfrac{1}{\\varepsilon}$.`,
                `这把分数倒错了：对 $\\dfrac{${c}}{n + ${k}} < \\varepsilon$ 取倒数得 $\\dfrac{n + ${k}}{${c}} > \\dfrac{1}{\\varepsilon}$。`,
              ],
              [`\\dfrac{1}{\\varepsilon} - ${k}`, `That drops the numerator $${c}$.`, `这丢掉了分子 $${c}$。`],
            ];
        const threshold = 10 * c - k;
        const n0 = square ? Math.floor(Math.sqrt(threshold)) + 1 : threshold + 1;
        const d0 = square ? n0 * n0 + k : n0 + k;
        return reasoned(
          oneOf(
            rng,
            t(
              `To prove $${tex} \\to 0$, given $\\varepsilon > 0$${square ? " (small enough that the expressions are defined)" : ""}, which condition on $N$ works?`,
              `为证明 $${tex} \\to 0$，给定 $\\varepsilon > 0$${square ? "（足够小，使表达式有意义）" : ""}，对 $N$ 的哪个条件可行？`,
            ),
            math(`N > ${right}`),
            wrong.map(([w]) => math(`N > ${w}`)),
            walked(
              [
                [
                  ["Set up the inequality", "列出不等式"],
                  t(
                    `The terms are positive, so the condition is $${tex} < \\varepsilon$.`,
                    `各项为正，所以条件是 $${tex} < \\varepsilon$。`,
                  ),
                ],
                [
                  ["Solve for $n$", "解出 $n$"],
                  t(
                    `Taking reciprocals reverses the inequality: $${den} > \\dfrac{${c}}{\\varepsilon}$, so ${square ? `$n^2 > \\dfrac{${c}}{\\varepsilon} - ${k}$ and ` : ""}$n > ${right}$.`,
                    `取倒数后不等号反向：$${den} > \\dfrac{${c}}{\\varepsilon}$，所以${square ? `$n^2 > \\dfrac{${c}}{\\varepsilon} - ${k}$，` : ""}$n > ${right}$。`,
                  ),
                ],
              ],
              t(
                `For $\\varepsilon = \\dfrac{1}{10}$ the condition asks for $N > ${square ? `\\sqrt{${threshold}}` : threshold}$. At $n = ${n0}$, $${den} = ${d0} > ${10 * c}$, so the term $\\dfrac{${c}}{${d0}}$ is below $\\dfrac{1}{10}$.`,
                `对 $\\varepsilon = \\dfrac{1}{10}$，条件要求 $N > ${square ? `\\sqrt{${threshold}}` : threshold}$。在 $n = ${n0}$ 处 $${den} = ${d0} > ${10 * c}$，所以这一项 $\\dfrac{${c}}{${d0}}$ 小于 $\\dfrac{1}{10}$。`,
              ),
            ),
          ),
          wrong.map(([w, en, zh]): Reason => [`$N > ${w}$`, en, zh]),
        );
      },
    },
    {
      id: "bounding-the-terms",
      title: t("Bounding the terms", "放大各项"),
      explanation: t(
        "When $|a_n|$ is hard to solve, bound it: $\\left|\\dfrac{\\sin n}{n^2 + 3}\\right| \\le \\dfrac{1}{n^2 + 3} < \\dfrac{1}{n^2}$. Then $\\dfrac{1}{n^2} < \\varepsilon$ is easy to solve, and any $N$ that works for the bound works for $a_n$.\n\n> **Watch out.** An upper bound must be at least as large as every term. Making the denominator smaller makes a fraction larger, which is allowed; making it larger, or shrinking faster than the terms, gives something below them.",
        "当 $|a_n|$ 不好直接求解时，先放大：$\\left|\\dfrac{\\sin n}{n^2 + 3}\\right| \\le \\dfrac{1}{n^2 + 3} < \\dfrac{1}{n^2}$。$\\dfrac{1}{n^2} < \\varepsilon$ 很好解，对上界可行的 $N$ 对 $a_n$ 也可行。\n\n> **注意。** 上界必须不小于每一项。把分母变小会使分数变大，这是允许的；把分母变大，或者用比各项衰减更快的式子，得到的都会低于某些项。",
      ),
      generate(rng) {
        const c = rng.int(2, 9);
        const k = rng.int(1, 9);
        const p = rng.int(1, 3);
        const top = rng.pick([`\\sin n`, `\\cos n`, `(-1)^n`]);
        const pw = p === 1 ? "n" : `n^{${p}}`;
        const tex = `\\dfrac{${c}${top === "(-1)^n" ? " \\cdot " : ""}${top}}{${pw} + ${k}}`;
        const bigger = `\\dfrac{${c}}{${pw} + ${k + 1}}`;
        const noC = `\\dfrac{1}{${pw} + ${k}}`;
        const faster = `\\dfrac{${c}}{n^{${p + 1}}}`;
        return reasoned(
          oneOf(
            rng,
            t(
              `Which is a valid bound for $\\left|${tex}\\right|$ when $n \\ge 1$?`,
              `当 $n \\ge 1$ 时，哪个是 $\\left|${tex}\\right|$ 的正确上界？`,
            ),
            math(`\\dfrac{${c}}{${pw}}`),
            [math(bigger), math(noC), math(faster)],
            walked(
              [
                [
                  ["Bound the numerator", "放大分子"],
                  t(
                    `$|${top}| \\le 1$, so $\\left|${tex}\\right| \\le \\dfrac{${c}}{${pw} + ${k}}$.`,
                    `$|${top}| \\le 1$，所以 $\\left|${tex}\\right| \\le \\dfrac{${c}}{${pw} + ${k}}$。`,
                  ),
                ],
                [
                  ["Shrink the denominator", "缩小分母"],
                  t(
                    `$${pw} + ${k} > ${pw}$, and a smaller denominator gives a larger fraction: $\\dfrac{${c}}{${pw} + ${k}} < \\dfrac{${c}}{${pw}}$.`,
                    `$${pw} + ${k} > ${pw}$，分母变小，分数变大：$\\dfrac{${c}}{${pw} + ${k}} < \\dfrac{${c}}{${pw}}$。`,
                  ),
                ],
              ],
              t(
                `At $n = 1$ the term has size at most $\\dfrac{${c}}{${1 + k}}$, which is below the bound's value $\\dfrac{${c}}{1} = ${c}$.`,
                `在 $n = 1$ 处，这一项的大小至多为 $\\dfrac{${c}}{${1 + k}}$，小于上界的值 $\\dfrac{${c}}{1} = ${c}$。`,
              ),
            ),
          ),
          [
            [
              `$${bigger}$`,
              `A larger denominator gives a smaller fraction, so this falls below the terms where $|${top}|$ is close to $1$.`,
              `分母更大，分数更小，所以在 $|${top}|$ 接近 $1$ 的地方它低于这些项。`,
            ],
            [
              `$${noC}$`,
              `That drops the factor $${c}$, so it falls below the terms where $|${top}|$ is close to $1$.`,
              `这丢掉了因子 $${c}$，所以在 $|${top}|$ 接近 $1$ 的地方它低于这些项。`,
            ],
            [
              `$${faster}$`,
              "That shrinks faster than the terms do, so for large $n$ it falls below them.",
              "它比各项衰减得更快，所以 $n$ 很大时会低于这些项。",
            ],
          ],
        );
      },
    },
  ],
};

/** provingTheFiniteLimitOfASequence proves aₙ → L by showing |aₙ − L| → 0. */
export const provingTheFiniteLimitOfASequence: TopicDef = {
  id: "proving-the-finite-limit-of-a-sequence",
  title: t("Proving the Finite Limit of a Sequence", "证明数列的有限极限"),
  summary: t(
    "aₙ → L means |aₙ − L| → 0; simplify |aₙ − L| and find N for each ε.",
    "aₙ → L 意味着 |aₙ − L| → 0；化简 |aₙ − L|，再对每个 ε 求出 N。",
  ),
  intro: t(
    "To prove $\\dfrac{3n + 2}{n + 1} \\to 3$, measure the distance to $3$: $\\dfrac{3n + 2}{n + 1} - 3 = \\dfrac{3n + 2 - 3(n + 1)}{n + 1} = \\dfrac{-1}{n + 1}$, so the distance is $\\dfrac{1}{n + 1}$. Given $\\varepsilon > 0$, $\\dfrac{1}{n + 1} < \\varepsilon$ once $n > \\dfrac{1}{\\varepsilon} - 1$, so choose an integer $N$ above that.\n\nCheck: for $\\varepsilon = \\dfrac{1}{10}$ the rule asks for $N > 9$. With $N = 10$, $a_{10} = \\dfrac{32}{11}$ and $3 - \\dfrac{32}{11} = \\dfrac{1}{11} < \\dfrac{1}{10}$.\n\nIn this lesson we simplify the distance $|a_n - L|$ and find $N$ from it.",
    "要证明 $\\dfrac{3n + 2}{n + 1} \\to 3$，先度量到 $3$ 的距离：$\\dfrac{3n + 2}{n + 1} - 3 = \\dfrac{3n + 2 - 3(n + 1)}{n + 1} = \\dfrac{-1}{n + 1}$，所以距离是 $\\dfrac{1}{n + 1}$。给定 $\\varepsilon > 0$，当 $n > \\dfrac{1}{\\varepsilon} - 1$ 时 $\\dfrac{1}{n + 1} < \\varepsilon$，所以取大于它的整数 $N$。\n\n检验：对 $\\varepsilon = \\dfrac{1}{10}$，规则要求 $N > 9$。取 $N = 10$，$a_{10} = \\dfrac{32}{11}$，而 $3 - \\dfrac{32}{11} = \\dfrac{1}{11} < \\dfrac{1}{10}$。\n\n本课我们化简距离 $|a_n - L|$，并由它求出 $N$。",
  ),
  prerequisites: ["proving-the-limit-of-a-null-sequence"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "simplifying-the-distance-to-the-limit",
      title: t("Simplifying $|a_n - L|$", "化简 $|a_n - L|$"),
      explanation: t(
        "Combining the term and the limit over a common denominator gives a simple expression for the distance, which is easier to bound. For $a_n = \\dfrac{2n + 1}{n + 3}$ and $L = 2$: $a_n - 2 = \\dfrac{2n + 1 - 2(n + 3)}{n + 3} = \\dfrac{-5}{n + 3}$, so $|a_n - 2| = \\dfrac{5}{n + 3}$.\n\n> **Watch out.** The limit multiplies the whole denominator: subtract $L(n + s)$, not $Ln + s$. Then the absolute value drops the sign of the numerator at the end.",
        "把项和极限通分合并，就得到距离的简单表达式，它更容易估计上界。对 $a_n = \\dfrac{2n + 1}{n + 3}$ 与 $L = 2$：$a_n - 2 = \\dfrac{2n + 1 - 2(n + 3)}{n + 3} = \\dfrac{-5}{n + 3}$，所以 $|a_n - 2| = \\dfrac{5}{n + 3}$。\n\n> **注意。** 极限要乘以整个分母：减去的是 $L(n + s)$，不是 $Ln + s$。最后再用绝对值去掉分子的符号。",
      ),
      generate(rng) {
        let p: number;
        let q: number;
        let s: number;
        do {
          p = rng.int(1, 9);
          q = rng.int(-9, 9);
          s = rng.int(1, 9);
        } while (q === p * s);
        const num = Math.abs(q - p * s);
        const tex = `\\dfrac{${coef(p)}n${signed(q)}}{n + ${s}}`;
        const added = `\\dfrac{${Math.abs(q + p * s)}}{n + ${s}}`;
        const onlyS = `\\dfrac{${Math.abs(q - s)}}{n + ${s}}`;
        const extra = `\\dfrac{${num}}{${p}(n + ${s})}`;
        const constOnly = `\\dfrac{${Math.abs(q)}}{n + ${s}}`;
        return reasoned(
          oneOf(
            rng,
            t(
              `Let $a_n = ${tex}$, which tends to $${p}$. What is $|a_n - ${p}|$ for $n \\ge 1$?`,
              `设 $a_n = ${tex}$，它趋于 $${p}$。当 $n \\ge 1$ 时，$|a_n - ${p}|$ 等于什么？`,
            ),
            math(`\\dfrac{${num}}{n + ${s}}`),
            [math(added), math(onlyS), math(extra), math(constOnly)],
            walked(
              [
                [
                  ["Write over one denominator", "通分"],
                  t(
                    `$a_n - ${p} = \\dfrac{${coef(p)}n${signed(q)} - ${p}(n + ${s})}{n + ${s}}$.`,
                    `$a_n - ${p} = \\dfrac{${coef(p)}n${signed(q)} - ${p}(n + ${s})}{n + ${s}}$。`,
                  ),
                ],
                [
                  ["Simplify the numerator", "化简分子"],
                  t(
                    `The $n$ terms cancel, leaving $\\dfrac{${q - p * s}}{n + ${s}}$, so $|a_n - ${p}| = \\dfrac{${num}}{n + ${s}}$.`,
                    `含 $n$ 的项相消，剩下 $\\dfrac{${q - p * s}}{n + ${s}}$，所以 $|a_n - ${p}| = \\dfrac{${num}}{n + ${s}}$。`,
                  ),
                ],
              ],
              t(
                `At $n = 1$: $a_1 = \\dfrac{${p + q}}{${1 + s}}$, and $\\dfrac{${p + q}}{${1 + s}} - ${p} = \\dfrac{${p + q - p * (1 + s)}}{${1 + s}}$, whose size is $\\dfrac{${num}}{${1 + s}}$, as the formula gives.`,
                `在 $n = 1$ 处：$a_1 = \\dfrac{${p + q}}{${1 + s}}$，$\\dfrac{${p + q}}{${1 + s}} - ${p} = \\dfrac{${p + q - p * (1 + s)}}{${1 + s}}$，其绝对值为 $\\dfrac{${num}}{${1 + s}}$，与公式一致。`,
              ),
            ),
          ),
          [
            [`$${added}$`, `That adds $${p}(n + ${s})$ instead of subtracting it.`, `这把 $${p}(n + ${s})$ 加上了，而不是减去。`],
            [
              `$${onlyS}$`,
              `That subtracts $${s}$ instead of $${p} \\cdot ${s}$: the limit multiplies the whole denominator.`,
              `这减去的是 $${s}$ 而不是 $${p} \\cdot ${s}$：极限要乘以整个分母。`,
            ],
            [
              `$${extra}$`,
              `The common denominator is $n + ${s}$; there is no extra factor $${p}$ below.`,
              `公分母是 $n + ${s}$；分母上没有多余的因子 $${p}$。`,
            ],
            [
              `$${constOnly}$`,
              `That keeps only the constant $${q}$ of the numerator; $${p}(n + ${s})$ must be subtracted too.`,
              `这只保留了分子的常数 $${q}$；还要减去 $${p}(n + ${s})$。`,
            ],
          ],
        );
      },
    },
    {
      id: "finding-n-for-a-finite-limit",
      title: t("Finding N", "求 N"),
      explanation: t(
        "Once the distance to the limit is a simple expression, solving the inequality for the index gives the required starting point. With $|a_n - 2| = \\dfrac{5}{n + 3}$ and $\\varepsilon = \\dfrac{1}{20}$: $\\dfrac{5}{n + 3} < \\dfrac{1}{20} \\iff n + 3 > 100 \\iff n > 97$, so the smallest $N$ is $98$.\n\n> **Watch out.** Solve for $n$, not for the denominator: after $n + s > \\dots$, subtract $s$. And the inequality is strict, so $N$ is one more than the boundary.",
        "一旦到极限的距离是一个简单表达式，解关于下标的不等式就得到所需的起点。由 $|a_n - 2| = \\dfrac{5}{n + 3}$ 与 $\\varepsilon = \\dfrac{1}{20}$：$\\dfrac{5}{n + 3} < \\dfrac{1}{20} \\iff n + 3 > 100 \\iff n > 97$，所以最小的 $N$ 是 $98$。\n\n> **注意。** 要解出的是 $n$，不是分母：得到 $n + s > \\dots$ 之后还要减去 $s$。而且不等式是严格的，所以 $N$ 比边界大 $1$。",
      ),
      generate(rng) {
        let p: number;
        let q: number;
        let s: number;
        do {
          p = rng.int(1, 9);
          q = rng.int(-9, 9);
          s = rng.int(1, 9);
        } while (q === p * s);
        const num = Math.abs(q - p * s);
        const m = rng.pick([10, 20, 50, 100]);
        const N = Math.max(1, num * m - s + 1);
        const candidates = [
          why(
            num * m - s,
            "At that index the distance equals $\\varepsilon$; it must be strictly less.",
            "在这个下标处距离恰好等于 $\\varepsilon$；必须严格小于它。",
          ),
          why(
            num * m,
            `That solves for $n + ${s}$; subtract $${s}$ to get the condition on $n$.`,
            `这解出的是 $n + ${s}$；减去 $${s}$ 才得到关于 $n$ 的条件。`,
          ),
          why(num * m + 1, `That is the first value of $n + ${s}$, not of $n$.`, `这是 $n + ${s}$ 的第一个值，不是 $n$ 的。`),
        ];
        const seen = new Set([N]);
        const mistakes = candidates.filter((c) => {
          if (seen.has(c.value as number) || (c.value as number) < 1) return false;
          seen.add(c.value as number);
          return true;
        });
        return numberProblem({
          prompt: t(
            `Let $a_n = \\dfrac{${coef(p)}n${signed(q)}}{n + ${s}}$ and $\\varepsilon = \\dfrac{1}{${m}}$. Find the smallest positive integer $N$ with $|a_n - ${p}| < \\varepsilon$ for all $n \\ge N$.`,
            `设 $a_n = \\dfrac{${coef(p)}n${signed(q)}}{n + ${s}}$，$\\varepsilon = \\dfrac{1}{${m}}$。求最小的正整数 $N$，使得对所有 $n \\ge N$ 有 $|a_n - ${p}| < \\varepsilon$。`,
          ),
          answer: N,
          wrong: [N + 1],
          mistakes,
          solution: walked(
            [
              [
                ["Simplify the distance", "化简距离"],
                t(
                  `$a_n - ${p} = \\dfrac{${coef(p)}n${signed(q)} - ${p}(n + ${s})}{n + ${s}} = \\dfrac{${q - p * s}}{n + ${s}}$, so $|a_n - ${p}| = \\dfrac{${num}}{n + ${s}}$.`,
                  `$a_n - ${p} = \\dfrac{${coef(p)}n${signed(q)} - ${p}(n + ${s})}{n + ${s}} = \\dfrac{${q - p * s}}{n + ${s}}$，所以 $|a_n - ${p}| = \\dfrac{${num}}{n + ${s}}$。`,
                ),
              ],
              [
                ["Solve for $n$", "解出 $n$"],
                t(
                  `$\\dfrac{${num}}{n + ${s}} < \\dfrac{1}{${m}} \\iff n + ${s} > ${num * m} \\iff n > ${num * m - s}$, so $N = ${N}$.`,
                  `$\\dfrac{${num}}{n + ${s}} < \\dfrac{1}{${m}} \\iff n + ${s} > ${num * m} \\iff n > ${num * m - s}$，所以 $N = ${N}$。`,
                ),
              ],
            ],
            N > 1
              ? t(
                  `At $n = ${N}$ the distance is $\\dfrac{${num}}{${N + s}}$, below $\\dfrac{1}{${m}} = \\dfrac{${num}}{${num * m}}$; at $n = ${N - 1}$ it is $\\dfrac{${num}}{${num * m}}$, exactly $\\varepsilon$.`,
                  `在 $n = ${N}$ 处距离为 $\\dfrac{${num}}{${N + s}}$，小于 $\\dfrac{1}{${m}} = \\dfrac{${num}}{${num * m}}$；在 $n = ${N - 1}$ 处距离为 $\\dfrac{${num}}{${num * m}}$，恰好等于 $\\varepsilon$。`,
                )
              : t(
                  `Already at $n = 1$ the distance $\\dfrac{${num}}{${1 + s}}$ is below $\\dfrac{1}{${m}}$.`,
                  `在 $n = 1$ 处距离 $\\dfrac{${num}}{${1 + s}}$ 已经小于 $\\dfrac{1}{${m}}$。`,
                ),
          ),
        });
      },
    },
  ],
};

/** infiniteLimitsOfSequences defines aₙ → ∞. */
export const infiniteLimitsOfSequences: TopicDef = {
  id: "infinite-limits-of-sequences",
  title: t("Infinite Limits of Sequences", "数列的无穷极限"),
  summary: t(
    "aₙ → ∞ means: for every M there is an N such that aₙ > M for all n ≥ N.",
    "aₙ → ∞ 的意思是：对每个 M，存在 N，使得对所有 n ≥ N 都有 aₙ > M。",
  ),
  intro: t(
    "Take $a_n = 2n - 5$ and the bound $M = 100$. Then $2n - 5 > 100 \\iff n > 52.5$, so from $N = 53$ on every term is above $100$. A sequence tends to $\\infty$ when such an $N$ exists for every bound $M$, however large.\n\nCheck: $a_{53} = 101 > 100$, while $a_{52} = 99$ is not above $100$.\n\nIn this lesson we find $N$ for a given bound, and classify sequences as tending to a number, to $\\infty$, to $-\\infty$, or to nothing.",
    "取 $a_n = 2n - 5$，界 $M = 100$。$2n - 5 > 100 \\iff n > 52.5$，所以从 $N = 53$ 起每一项都大于 $100$。如果无论界 $M$ 多大，这样的 $N$ 都存在，数列就趋于 $\\infty$。\n\n检验：$a_{53} = 101 > 100$，而 $a_{52} = 99$ 不大于 $100$。\n\n本课我们对给定的界求 $N$，并判断数列是趋于一个数、趋于 $\\infty$、趋于 $-\\infty$，还是没有极限。",
  ),
  prerequisites: ["the-limit-of-a-null-sequence"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "finding-n-for-a-given-m",
      title: t("Finding N for a given M", "对给定的 M 求 N"),
      explanation: t(
        "For a sequence tending to infinity, each bound must eventually be exceeded, so solve for the index past which the terms stay above it. For $a_n = 3n - 7$ and $M = 50$: $3n - 7 > 50 \\iff n > 19$, so the smallest $N$ with $a_n > 50$ for all $n \\ge N$ is $20$.\n\n> **Watch out.** A term equal to $M$ is not above it. $N$ is the first index whose term exceeds $M$, so the term just before it is at most $M$.",
        "对于趋于无穷的序列，每个界最终都会被超过，所以要解出一个下标，使得此后各项都保持在界之上。对 $a_n = 3n - 7$ 与 $M = 50$：$3n - 7 > 50 \\iff n > 19$，所以使所有 $n \\ge N$ 都满足 $a_n > 50$ 的最小 $N$ 是 $20$。\n\n> **注意。** 等于 $M$ 的项并不大于 $M$。$N$ 是第一个项超过 $M$ 的下标，所以它前面一项至多为 $M$。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const p = rng.int(2, 9);
        const q = rng.int(-20, 20);
        const M = rng.int(2, 40) * 10;
        const [tex, f]: [string, (n: number) => number] =
          kind === 0
            ? [`${p}n${signed(q)}`, (n) => p * n + q]
            : kind === 1
              ? [`n^2${signed(q)}`, (n) => n * n + q]
              : [`${p}\\sqrt{n}${signed(q)}`, (n) => p * Math.sqrt(n) + q];
        const N = firstN((n) => f(n) > M, 100000);
        const r = M - q;
        const solve =
          kind === 0
            ? t(
                `$${tex} > ${M} \\iff ${p}n > ${r} \\iff n > \\dfrac{${r}}{${p}} \\approx ${+(r / p).toFixed(2)}$.`,
                `$${tex} > ${M} \\iff ${p}n > ${r} \\iff n > \\dfrac{${r}}{${p}} \\approx ${+(r / p).toFixed(2)}$。`,
              )
            : kind === 1
              ? t(
                  `$${tex} > ${M} \\iff n^2 > ${r} \\iff n > \\sqrt{${r}} \\approx ${+Math.sqrt(r).toFixed(2)}$.`,
                  `$${tex} > ${M} \\iff n^2 > ${r} \\iff n > \\sqrt{${r}} \\approx ${+Math.sqrt(r).toFixed(2)}$。`,
                )
              : t(
                  `$${tex} > ${M} \\iff \\sqrt{n} > \\dfrac{${r}}{${p}} \\iff n > \\left(\\dfrac{${r}}{${p}}\\right)^2 \\approx ${+((r / p) ** 2).toFixed(2)}$.`,
                  `$${tex} > ${M} \\iff \\sqrt{n} > \\dfrac{${r}}{${p}} \\iff n > \\left(\\dfrac{${r}}{${p}}\\right)^2 \\approx ${+((r / p) ** 2).toFixed(2)}$。`,
                );
        return numberProblem({
          prompt: t(
            `Let $a_n = ${tex}$ and $M = ${M}$. Find the smallest positive integer $N$ such that $a_n > M$ for all $n \\ge N$.`,
            `设 $a_n = ${tex}$，$M = ${M}$。求最小的正整数 $N$，使得对所有 $n \\ge N$ 都有 $a_n > M$。`,
          ),
          answer: N,
          wrong: [N + 1],
          mistakes: [
            ...(N > 1 ? [why(N - 1, "At that index the term is not yet above $M$.", "在这个下标处，这一项还没有超过 $M$。")] : []),
            ...(M !== N && M !== N - 1 && M !== N + 1
              ? [why(M, "That is the bound itself, not the index where the terms pass it.", "这是界本身，而不是各项超过它的下标。")]
              : []),
          ],
          solution: walked(
            [
              [["Solve the inequality", "解不等式"], solve],
              [
                ["Take the first index above it", "取它之后的第一个下标"],
                t(
                  `The terms increase, so the smallest positive integer $n$ satisfying this is $N = ${N}$.`,
                  `各项递增，所以满足它的最小正整数 $n$ 是 $N = ${N}$。`,
                ),
              ],
            ],
            t(
              `$a_{${N}} = ${+f(N).toFixed(2)} > ${M}$${N > 1 ? `, while $a_{${N - 1}} = ${+f(N - 1).toFixed(2)} \\le ${M}$` : ""}.`,
              `$a_{${N}} = ${+f(N).toFixed(2)} > ${M}$${N > 1 ? `，而 $a_{${N - 1}} = ${+f(N - 1).toFixed(2)} \\le ${M}$` : ""}。`,
            ),
          ),
        });
      },
    },
    {
      id: "classifying-limits-of-sequences",
      title: t("Classifying limits", "极限的分类"),
      explanation: t(
        "A sequence may tend to a number, to $\\infty$, to $-\\infty$, or have no limit. $n^2 - 10n \\to \\infty$; $\\dfrac{3 - n^2}{n + 1} \\to -\\infty$; $(-1)^n n$ has no limit, since its terms alternate between large positive and large negative values.\n\n> **Watch out.** Terms that grow in size do not always tend to $\\infty$. If their signs keep alternating, as in $(-1)^n n$, they tend to nothing at all.",
        "数列可能趋于一个数、趋于 $\\infty$、趋于 $-\\infty$，或没有极限。$n^2 - 10n \\to \\infty$；$\\dfrac{3 - n^2}{n + 1} \\to -\\infty$；$(-1)^n n$ 没有极限，因为它的项在很大的正数与很大的负数之间交替。\n\n> **注意。** 绝对值增大的项不一定趋于 $\\infty$。如果符号不断交替，比如 $(-1)^n n$，它就没有极限。",
      ),
      generate(rng) {
        const a = rng.int(1, 9);
        const b = rng.int(1, 20);
        const r = (x: number) => +x.toFixed(4);
        const forms: [string, number, Text, Text][] = [
          [
            `n^2 - ${b}n`,
            0,
            t(
              `$n^2 - ${b}n = n(n - ${b})$, and both factors grow once $n > ${b}$.`,
              `$n^2 - ${b}n = n(n - ${b})$，当 $n > ${b}$ 时两个因子都在增大。`,
            ),
            t(`$a_{${10 * b}} = ${90 * b * b}$, and the terms keep growing.`, `$a_{${10 * b}} = ${90 * b * b}$，而且各项还在继续增大。`),
          ],
          [
            `\\dfrac{${b} - n^2}{n + ${a}}`,
            1,
            t(
              `Dividing top and bottom by $n$ gives $\\dfrac{${b}/n - n}{1 + ${a}/n}$, which behaves like $-n$.`,
              `分子分母同除以 $n$，得 $\\dfrac{${b}/n - n}{1 + ${a}/n}$，它的表现像 $-n$。`,
            ),
            t(
              `$a_{100} \\approx ${r((b - 10000) / (100 + a))}$, already far below $0$.`,
              `$a_{100} \\approx ${r((b - 10000) / (100 + a))}$，已经远小于 $0$。`,
            ),
          ],
          [
            `(-1)^n \\cdot ${a}n`,
            3,
            t(
              `Even terms are $${a}n$ and odd terms are $-${a}n$: the sign alternates while the size grows.`,
              `偶数项是 $${a}n$，奇数项是 $-${a}n$：符号交替，而绝对值增大。`,
            ),
            t(`$a_{10} = ${10 * a}$ and $a_{11} = -${11 * a}$.`, `$a_{10} = ${10 * a}$，$a_{11} = -${11 * a}$。`),
          ],
          [
            `\\dfrac{${a}n^2 + ${b}}{n^2 + 1}`,
            2,
            t(
              `Dividing top and bottom by $n^2$ gives $\\dfrac{${a} + ${b}/n^2}{1 + 1/n^2}$, which tends to $${a}$.`,
              `分子分母同除以 $n^2$，得 $\\dfrac{${a} + ${b}/n^2}{1 + 1/n^2}$，它趋于 $${a}$。`,
            ),
            t(
              `$a_{100} \\approx ${r((a * 10000 + b) / 10001)}$, close to $${a}$.`,
              `$a_{100} \\approx ${r((a * 10000 + b) / 10001)}$，接近 $${a}$。`,
            ),
          ],
          [
            `${b} - ${a}\\sqrt{n}`,
            1,
            t(
              `$${a}\\sqrt{n}$ grows without bound, so $${b}$ minus it falls without bound.`,
              `$${a}\\sqrt{n}$ 无界增长，所以 $${b}$ 减去它就无界减小。`,
            ),
            t(`$a_{10000} = ${b} - ${100 * a} = ${b - 100 * a}$.`, `$a_{10000} = ${b} - ${100 * a} = ${b - 100 * a}$。`),
          ],
          [
            `\\dfrac{n^3}{${a}n^2 + ${b}}`,
            0,
            t(
              `Dividing top and bottom by $n^2$ gives $\\dfrac{n}{${a} + ${b}/n^2}$, which behaves like $\\dfrac{n}{${a}}$.`,
              `分子分母同除以 $n^2$，得 $\\dfrac{n}{${a} + ${b}/n^2}$，它的表现像 $\\dfrac{n}{${a}}$。`,
            ),
            t(
              `$a_{100} \\approx ${r(1e6 / (a * 1e4 + b))}$, and the terms keep growing.`,
              `$a_{100} \\approx ${r(1e6 / (a * 1e4 + b))}$，而且各项还在继续增大。`,
            ),
          ],
          [
            `${a} + \\dfrac{(-1)^n}{n}`,
            2,
            t(
              `$\\left|\\dfrac{(-1)^n}{n}\\right| = \\dfrac{1}{n} \\to 0$, so the terms settle at $${a}$.`,
              `$\\left|\\dfrac{(-1)^n}{n}\\right| = \\dfrac{1}{n} \\to 0$，所以各项趋近于 $${a}$。`,
            ),
            t(
              `$a_{100} = ${a + 0.01}$ and $a_{101} \\approx ${r(a - 1 / 101)}$, both close to $${a}$.`,
              `$a_{100} = ${a + 0.01}$，$a_{101} \\approx ${r(a - 1 / 101)}$，都接近 $${a}$。`,
            ),
          ],
          [
            `(-${a + 1})^n`,
            3,
            t(`The sign alternates, and the size $${a + 1}^n$ grows.`, `符号交替，而绝对值 $${a + 1}^n$ 增大。`),
            t(`$a_2 = ${(a + 1) ** 2}$ and $a_3 = -${(a + 1) ** 3}$.`, `$a_2 = ${(a + 1) ** 2}$，$a_3 = -${(a + 1) ** 3}$。`),
          ],
        ];
        const [tex, kind, step, check] = rng.pick(forms);
        const options = [math("\\infty"), math("-\\infty"), t("A finite number", "一个有限数"), t("No limit", "没有极限")];
        return reasoned(
          oneOf(
            rng,
            t(`What is the limit of $a_n = ${tex}$?`, `$a_n = ${tex}$ 的极限是什么？`),
            options[kind]!,
            options.filter((_, i) => i !== kind),
            walked(
              [
                [["Find what the terms do", "看各项的变化"], step],
                [
                  ["Decide", "判断"],
                  [
                    t("The terms grow without bound, so $a_n \\to \\infty$.", "各项无界增大，所以 $a_n \\to \\infty$。"),
                    t("The terms fall without bound, so $a_n \\to -\\infty$.", "各项无界减小，所以 $a_n \\to -\\infty$。"),
                    t("The terms settle near a single number, so the limit is finite.", "各项趋近于一个确定的数，所以极限有限。"),
                    t(
                      "The terms alternate in sign while their size grows, so there is no limit.",
                      "各项符号交替且绝对值增大，所以没有极限。",
                    ),
                  ][kind]!,
                ],
              ],
              check,
            ),
          ),
          [
            ...options.map(
              (o, i) =>
                [
                  o.en,
                  `${["$\\infty$ needs the terms to grow without bound", "$-\\infty$ needs the terms to fall without bound", "A finite limit needs the terms to settle near one number", "Having no limit needs the terms neither to settle nor to run off in one direction"][i]!}, but ${["these terms grow without bound", "these terms fall without bound", "these terms settle near one number", "these terms keep switching between positive and negative values"][kind]!}.`,
                  `${["$\\infty$ 要求各项无限增大", "$-\\infty$ 要求各项无限减小", "有限极限要求各项趋近于一个数", "没有极限要求各项既不趋近于一个数，也不朝一个方向无限发展"][i]!}，但${["这些项无限增大", "这些项无限减小", "这些项趋近于一个数", "这些项不断在正负之间切换"][kind]!}。`,
                ] as const,
            ),
          ],
        );
      },
    },
  ],
};

/** provingASequenceHasAnInfiniteLimit writes M–N proofs. */
export const provingASequenceHasAnInfiniteLimit: TopicDef = {
  id: "proving-a-sequence-has-an-infinite-limit",
  title: t("Proving a Sequence Has an Infinite Limit", "证明数列有无穷极限"),
  summary: t(
    "Given M, solve aₙ > M for n (or for a simpler lower bound of aₙ) to choose N.",
    "给定 M，解关于 n 的不等式 aₙ > M（或解 aₙ 的一个更简单的下界），从而选出 N。",
  ),
  intro: t(
    "To prove $3n - 4 \\to \\infty$, let $M$ be any number. Then $3n - 4 > M \\iff n > \\dfrac{M + 4}{3}$, so choose an integer $N > \\dfrac{M + 4}{3}$: every $n \\ge N$ gives $3n - 4 > M$.\n\nCheck: for $M = 50$ the rule asks for $N > 18$. With $N = 19$, $a_{19} = 53 > 50$, while $a_{18} = 50$ is not above $50$.\n\nIn this lesson we choose $N$ as a formula in $M$, and use simpler lower bounds when the inequality is hard to solve.",
    "要证明 $3n - 4 \\to \\infty$，任取一个数 $M$。$3n - 4 > M \\iff n > \\dfrac{M + 4}{3}$，所以取整数 $N > \\dfrac{M + 4}{3}$：每个 $n \\ge N$ 都有 $3n - 4 > M$。\n\n检验：对 $M = 50$，规则要求 $N > 18$。取 $N = 19$，$a_{19} = 53 > 50$，而 $a_{18} = 50$ 不大于 $50$。\n\n本课我们把 $N$ 选成关于 $M$ 的公式，并在不等式难解时改用更简单的下界。",
  ),
  prerequisites: ["infinite-limits-of-sequences", "proving-the-limit-of-a-null-sequence"],
  encompasses: [{ topic: "infinite-limits-of-sequences", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "choosing-n-in-terms-of-m",
      title: t("Choosing N in terms of M", "用 M 表示 N"),
      explanation: t(
        "To prove divergence to infinity, solve the inequality for a general bound and choose the index as a formula in that bound. To prove $4\\sqrt{n} - 3 \\to \\infty$: given $M$, $4\\sqrt{n} - 3 > M \\iff n > \\left(\\dfrac{M + 3}{4}\\right)^2$ (for $M > -3$). Choose any integer $N$ larger than this.\n\n> **Watch out.** Undo the operations in reverse order: move the constant first, then divide by the coefficient, and square last when $n$ sits under a square root. Dividing before moving the constant gives $\\dfrac{M}{p} - q$ instead of $\\dfrac{M - q}{p}$.",
        "要证明发散到无穷，就对一般的界解不等式，把下标选成关于这个界的公式。证明 $4\\sqrt{n} - 3 \\to \\infty$：给定 $M$，$4\\sqrt{n} - 3 > M \\iff n > \\left(\\dfrac{M + 3}{4}\\right)^2$（当 $M > -3$ 时）。取任意大于它的整数 $N$。\n\n> **注意。** 按相反的顺序撤销运算：先移常数，再除以系数，$n$ 在根号下时最后平方。先除后移常数，得到的是 $\\dfrac{M}{p} - q$ 而不是 $\\dfrac{M - q}{p}$。",
      ),
      generate(rng) {
        const p = rng.int(2, 9);
        const q = rng.int(-9, 9) || 1;
        const root = rng.bool();
        const tex = root ? `${p}\\sqrt{n}${signed(q)}` : `${p}n${signed(q)}`;
        const mq = `M${signed(-q)}`;
        const mqWrong = `M${signed(q)}`;
        const wrap = (x: string) => (root ? `\\left(${x}\\right)^2` : x);
        const right = `N > ${wrap(`\\dfrac{${mq}}{${p}}`)}`;
        // Each of these falls short for large M; a larger bound than the right one would also work.
        const w1 = `N > ${wrap(q > 0 ? `\\dfrac{M}{${p}} - ${q}` : `\\dfrac{${mqWrong}}{${p}}`)}`;
        const w2 = `N > ${wrap(`\\dfrac{${p}}{${mq}}`)}`;
        const w3 = `N > ${root ? `\\dfrac{${mq}}{${p}}` : `\\sqrt{\\dfrac{${mq}}{${p}}}`}`;
        const M0 = q + 10 * p;
        const steps: [[string, string], Text][] = [
          [
            ["Move the constant", "移常数"],
            t(
              `$${tex} > M \\iff ${p}${root ? "\\sqrt{n}" : "n"} > ${mq}$.`,
              `$${tex} > M \\iff ${p}${root ? "\\sqrt{n}" : "n"} > ${mq}$。`,
            ),
          ],
          [
            [`Divide by $${p}$`, `除以 $${p}$`],
            t(`$${root ? "\\sqrt{n}" : "n"} > \\dfrac{${mq}}{${p}}$.`, `$${root ? "\\sqrt{n}" : "n"} > \\dfrac{${mq}}{${p}}$。`),
          ],
        ];
        if (root)
          steps.push([
            ["Square both sides", "两边平方"],
            t(
              `Both sides are positive because $M > ${q}$, so $n > ${wrap(`\\dfrac{${mq}}{${p}}`)}$.`,
              `因为 $M > ${q}$，两边都为正，所以 $n > ${wrap(`\\dfrac{${mq}}{${p}}`)}$。`,
            ),
          ]);
        return reasoned(
          oneOf(
            rng,
            t(
              `To prove $${tex} \\to \\infty$, given $M > ${q}$, which condition on $N$ works?`,
              `为证明 $${tex} \\to \\infty$，给定 $M > ${q}$，对 $N$ 的哪个条件可行？`,
            ),
            math(right),
            [math(w1), math(w2), math(w3)],
            walked(
              steps,
              root
                ? t(
                    `Take $M = ${M0}$: the condition asks for $N > 100$. With $n = 101$, $\\sqrt{101} > 10$, so $a_{101} > ${p} \\cdot 10${signed(q)} = ${M0}$.`,
                    `取 $M = ${M0}$：条件要求 $N > 100$。取 $n = 101$，$\\sqrt{101} > 10$，所以 $a_{101} > ${p} \\cdot 10${signed(q)} = ${M0}$。`,
                  )
                : t(
                    `Take $M = ${M0}$: the condition asks for $N > 10$. With $n = 11$, $a_{11} = ${11 * p + q} > ${M0}$.`,
                    `取 $M = ${M0}$：条件要求 $N > 10$。取 $n = 11$，$a_{11} = ${11 * p + q} > ${M0}$。`,
                  ),
            ),
          ),
          [
            q > 0
              ? [
                  `$${w1}$`,
                  `The constant must be moved before dividing: $\\dfrac{${mq}}{${p}}$, not $\\dfrac{M}{${p}} - ${q}$.`,
                  `要先移常数再除：是 $\\dfrac{${mq}}{${p}}$，不是 $\\dfrac{M}{${p}} - ${q}$。`,
                ]
              : [
                  `$${w1}$`,
                  `Moving $${q}$ across changes its sign: the result is $${mq}$, not $${mqWrong}$.`,
                  `把 $${q}$ 移到另一边要变号：结果是 $${mq}$，不是 $${mqWrong}$。`,
                ],
            [
              `$${w2}$`,
              "That inverts the fraction; it shrinks as $M$ grows, so it falls short for large $M$.",
              "这把分数倒过来了；它随 $M$ 增大而减小，所以 $M$ 很大时不够。",
            ],
            root
              ? [
                  `$${w3}$`,
                  "That bounds $\\sqrt{n}$, not $n$; square it to get the condition on $n$.",
                  "这限制的是 $\\sqrt{n}$ 而不是 $n$；平方后才是关于 $n$ 的条件。",
                ]
              : [`$${w3}$`, "There is no square root to undo: $n$ appears to the first power.", "这里没有根号需要撤销：$n$ 是一次的。"],
          ],
        );
      },
    },
    {
      id: "lower-bounds-for-divergent-sequences",
      title: t("Lower bounds", "下界"),
      explanation: t(
        "When the inequality is hard to solve exactly, replace the term by a simpler expression below it that still grows without bound. To show $\\dfrac{n^2 + 5}{n + 1} \\to \\infty$, find a simpler lower bound: for $n \\ge 1$, $\\dfrac{n^2 + 5}{n + 1} > \\dfrac{n^2}{n + n} = \\dfrac{n}{2}$, and $\\dfrac{n}{2} > M$ once $n > 2M$.\n\n> **Watch out.** A lower bound may only make the expression smaller: drop positive terms from the numerator and enlarge the denominator. Shrinking the denominator or keeping extra terms on top gives something above the terms.",
        "当不等式难以精确求解时，用一个比该项小、但仍然无界增长的简单表达式代替它。要证明 $\\dfrac{n^2 + 5}{n + 1} \\to \\infty$，先找一个更简单的下界：当 $n \\ge 1$ 时，$\\dfrac{n^2 + 5}{n + 1} > \\dfrac{n^2}{n + n} = \\dfrac{n}{2}$，而当 $n > 2M$ 时 $\\dfrac{n}{2} > M$。\n\n> **注意。** 下界只能把式子变小：去掉分子中的正项，把分母变大。把分母变小或在分子上保留多余的项，得到的会高于这些项。",
      ),
      generate(rng) {
        const a = rng.int(1, 9);
        const b = rng.int(1, 9);
        const c = rng.int(1, 5);
        const tex = `\\dfrac{${coef(c)}n^2 + ${a}}{n + ${b}}`;
        const g = gcd(c, b + 1);
        const bound = g === b + 1 ? `${coef(c / g)}n` : `\\dfrac{${coef(c / g)}n}{${(b + 1) / g}}`;
        const w1 = `${coef(c)}n`;
        const w2 = `\\dfrac{${coef(c)}n^2}{${b}}`;
        const w3 = `${coef(c)}n + ${a}`;
        return reasoned(
          oneOf(
            rng,
            t(`Which is a valid lower bound for $${tex}$ when $n \\ge 1$?`, `当 $n \\ge 1$ 时，哪个是 $${tex}$ 的正确下界？`),
            math(bound),
            [math(w1), math(w2), math(w3)],
            walked(
              [
                [
                  ["Shrink the numerator", "缩小分子"],
                  t(`Drop $${a}$: $${coef(c)}n^2 + ${a} > ${coef(c)}n^2$.`, `去掉 $${a}$：$${coef(c)}n^2 + ${a} > ${coef(c)}n^2$。`),
                ],
                [
                  ["Enlarge the denominator", "放大分母"],
                  t(`For $n \\ge 1$, $n + ${b} \\le n + ${b}n = ${b + 1}n$.`, `当 $n \\ge 1$ 时，$n + ${b} \\le n + ${b}n = ${b + 1}n$。`),
                ],
                [
                  ["Combine", "合并"],
                  t(
                    `$${tex} > \\dfrac{${coef(c)}n^2}{${b + 1}n} = ${bound}$.`,
                    `$${tex} > \\dfrac{${coef(c)}n^2}{${b + 1}n} = ${bound}$。`,
                  ),
                ],
              ],
              t(
                `At $n = 1$ the term is $\\dfrac{${c + a}}{${1 + b}}$ and the bound is $\\dfrac{${c}}{${b + 1}}$, which is smaller.`,
                `在 $n = 1$ 处，这一项是 $\\dfrac{${c + a}}{${1 + b}}$，下界是 $\\dfrac{${c}}{${b + 1}}$，后者更小。`,
              ),
            ),
          ),
          [
            [
              `$${w1}$`,
              `That is above the terms for large $n$: $${coef(c)}n(n + ${b})$ exceeds $${coef(c)}n^2 + ${a}$ once $n$ is large.`,
              `$n$ 很大时它高于这些项：$${coef(c)}n(n + ${b})$ 会超过 $${coef(c)}n^2 + ${a}$。`,
            ],
            [
              `$${w2}$`,
              `Replacing $n + ${b}$ by $${b}$ makes the denominator smaller, so this is above the terms.`,
              `把 $n + ${b}$ 换成 $${b}$ 使分母变小，所以它高于这些项。`,
            ],
            [
              `$${w3}$`,
              "That is above the terms for large $n$; a lower bound must stay below every term.",
              "$n$ 很大时它高于这些项；下界必须低于每一项。",
            ],
          ],
        );
      },
    },
  ],
};

/** FiniteMap is a function between small finite sets, given by its values. */
interface FiniteMap {
  readonly domain: readonly string[];
  readonly codomain: readonly string[];
  readonly values: readonly string[];
}

/** finiteMap picks a function from {1..m} to letters with a chosen property. */
function finiteMap(rng: Rng, m: number, n: number, injective: boolean, onto: boolean): FiniteMap {
  const domain = range(1, m).map(String);
  const codomain = ["a", "b", "c", "d", "e", "g"].slice(0, n);
  for (;;) {
    const values = domain.map(() => rng.pick(codomain));
    const inj = new Set(values).size === m;
    const sur = new Set(values).size === n;
    if (inj === injective && sur === onto) return { domain, codomain, values };
  }
}

/** mapTex writes a finite function as a set of pairs. */
const mapTex = (f: FiniteMap) => `\\{${f.domain.map((x, i) => `(${x}, ${f.values[i]})`).join(", ")}\\}`;

/** valuesTex lists the values of a finite function: "f(1) = a, f(2) = c". */
const valuesTex = (f: FiniteMap) => f.domain.map((x, i) => `$f(${x}) = ${f.values[i]}$`);

/** Mistake is a wrong numeric answer with what to say about it. */
type Mistake = ReturnType<typeof why>;

/** apart keeps the mistakes whose values differ from the answer and from each other. */
function apart(answer: number, list: readonly Mistake[]): Mistake[] {
  const seen = new Set<unknown>([answer]);
  const out: Mistake[] = [];
  for (const m of list)
    if (!seen.has(m.value)) {
      seen.add(m.value);
      out.push(m);
    }
  return out;
}

/** poly writes a sum of terms with signs: [[3, "ab"], [-6, "a"], [2, ""]] gives "3ab - 6a + 2". */
function poly(terms: readonly (readonly [number, string])[]): string {
  const kept = terms.filter(([c]) => c !== 0);
  if (kept.length === 0) return "0";
  return kept
    .map(([c, v], i) => {
      const size = Math.abs(c) === 1 && v !== "" ? v : `${Math.abs(c)}${v}`;
      return i === 0 ? (c < 0 ? `-${size}` : size) : `${c < 0 ? " - " : " + "}${size}`;
    })
    .join("");
}

/** injections defines one-to-one functions between sets. */
export const injections: TopicDef = {
  id: "injections",
  title: t("Injections", "单射"),
  summary: t(
    "f: A → B is injective when distinct inputs give distinct outputs: f(a₁) = f(a₂) implies a₁ = a₂.",
    "若不同的输入给出不同的输出，即 f(a₁) = f(a₂) 推出 a₁ = a₂，则 f: A → B 是单射。",
  ),
  intro: t(
    "Let $f: \\{1, 2, 3\\} \\to \\{a, b, c, d\\}$ be $\\{(1, b), (2, d), (3, a)\\}$. The outputs $b$, $d$, $a$ are all different, so no two inputs share an output: $f$ is injective. Changing $f(3)$ to $b$ would break this, since then $f(1) = f(3)$.\n\nCheck: three inputs with no repeated output use exactly three different outputs, here $a$, $b$ and $d$. The unused $c$ does not matter.\n\nIn this lesson we recognize injections between finite sets and count them.",
    "设 $f: \\{1, 2, 3\\} \\to \\{a, b, c, d\\}$ 为 $\\{(1, b), (2, d), (3, a)\\}$。输出 $b$、$d$、$a$ 互不相同，所以没有两个输入共用一个输出：$f$ 是单射。若把 $f(3)$ 改成 $b$，就不再是单射，因为那时 $f(1) = f(3)$。\n\n检验：三个输入的输出不重复，恰好用到三个不同的输出，这里是 $a$、$b$、$d$。没有用到的 $c$ 不影响结论。\n\n本课我们识别有限集之间的单射，并统计单射的个数。",
  ),
  prerequisites: ["sets-and-functions", "one-to-one-functions"],
  encompasses: [{ topic: "one-to-one-functions", weight: 0.2 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-injections",
      title: t("Recognizing injections", "识别单射"),
      explanation: t(
        "A function between finite sets is injective when no output is repeated. $\\{(1, a), (2, c), (3, b)\\}$ is injective; $\\{(1, a), (2, c), (3, a)\\}$ is not, since $f(1) = f(3)$.\n\n> **Watch out.** Injectivity is about repeated outputs, not missed ones. An element of the codomain that is never used does not stop $f$ from being injective.",
        "有限集之间的函数是单射，当且仅当没有输出重复。$\\{(1, a), (2, c), (3, b)\\}$ 是单射；$\\{(1, a), (2, c), (3, a)\\}$ 不是，因为 $f(1) = f(3)$。\n\n> **注意。** 单射看的是输出有没有重复，而不是有没有漏掉。陪域中有元素没被用到，并不妨碍 $f$ 是单射。",
      ),
      generate(rng) {
        const m = rng.int(3, 5);
        const n = rng.int(m, 6);
        const value = rng.bool();
        const f = finiteMap(rng, m, n, value, value && m === n);
        const repeat = f.domain.findIndex((_, i) => f.values.indexOf(f.values[i]!) !== i);
        const first = repeat < 0 ? 0 : f.values.indexOf(f.values[repeat]!);
        const used = new Set(f.values).size;
        const unused = f.codomain.filter((c) => !f.values.includes(c));
        return reasoned(
          oneOf(
            rng,
            t(
              `Let $f: ${setTex(range(1, m))} \\to \\{${f.codomain.join(", ")}\\}$ be $${mapTex(f)}$. Is $f$ injective?`,
              `设 $f: ${setTex(range(1, m))} \\to \\{${f.codomain.join(", ")}\\}$ 为 $${mapTex(f)}$。$f$ 是单射吗？`,
            ),
            yesNo[value ? 0 : 1]!,
            [yesNo[value ? 1 : 0]!],
            walked(
              [
                [["List the outputs", "列出输出"], t(`${valuesTex(f).join(", ")}.`, `${valuesTex(f).join("，")}。`)],
                [
                  ["Look for a repeat", "找重复"],
                  value
                    ? t("No output appears twice, so $f$ is injective.", "没有输出出现两次，所以 $f$ 是单射。")
                    : t(
                        `$f(${first + 1}) = f(${repeat + 1}) = ${f.values[repeat]}$ with $${first + 1} \\ne ${repeat + 1}$, so $f$ is not injective.`,
                        `$f(${first + 1}) = f(${repeat + 1}) = ${f.values[repeat]}$，而 $${first + 1} \\ne ${repeat + 1}$，所以 $f$ 不是单射。`,
                      ),
                ],
              ],
              value
                ? t(
                    `The $${m}$ inputs use $${used}$ different outputs, one each${unused.length > 0 ? `; the unused $${unused.join(", ")}$ does not matter` : ""}.`,
                    `$${m}$ 个输入用到了 $${used}$ 个不同的输出，每个输入一个${unused.length > 0 ? `；没用到的 $${unused.join(", ")}$ 不影响结论` : ""}。`,
                  )
                : t(
                    `The $${m}$ inputs use only $${used}$ different outputs, so at least two of them must share one.`,
                    `$${m}$ 个输入只用到了 $${used}$ 个不同的输出，所以至少有两个输入共用一个输出。`,
                  ),
            ),
          ),
          [
            value
              ? [
                  "No",
                  "No output appears twice here; an element of the codomain that is never used does not matter for injectivity.",
                  "这里没有输出出现两次；陪域中没被用到的元素与单射无关。",
                ]
              : [
                  "Yes",
                  `$f(${first + 1}) = f(${repeat + 1})$ with $${first + 1} \\ne ${repeat + 1}$: two inputs share an output.`,
                  `$f(${first + 1}) = f(${repeat + 1})$，而 $${first + 1} \\ne ${repeat + 1}$：两个输入共用一个输出。`,
                ],
          ],
        );
      },
    },
    {
      id: "counting-injections",
      title: t("Counting injections", "统计单射个数"),
      explanation: t(
        "An injection from an $m$-element set to an $n$-element set chooses distinct values one input at a time: $n(n - 1) \\cdots (n - m + 1)$ ways. There are $5 \\cdot 4 \\cdot 3 = 60$ injections from a $3$-element set to a $5$-element set, and none if $m > n$.\n\n> **Watch out.** The count is a falling product of $m$ factors starting at $n$. The power $n^m$ counts all functions, repeated outputs included.",
        "从 $m$ 元集到 $n$ 元集的单射，逐个为输入选择互不相同的值：共 $n(n - 1) \\cdots (n - m + 1)$ 种。从 $3$ 元集到 $5$ 元集有 $5 \\cdot 4 \\cdot 3 = 60$ 个单射；若 $m > n$ 则没有。\n\n> **注意。** 个数是从 $n$ 开始依次减小的 $m$ 个因数之积。幂 $n^m$ 数的是所有函数，包括输出重复的。",
      ),
      generate(rng) {
        const m = rng.int(1, 6);
        const n = rng.int(Math.max(1, m - 1), 9);
        const count = m > n ? 0 : range(n - m + 1, n).reduce((x, y) => x * y, 1);
        const factors = range(n - m + 1, n).reverse();
        const choose = m > n ? 0 : count / factorial(m);
        const els = (k: number) => `$${k}$ element${k === 1 ? "" : "s"}`;
        return numberProblem({
          prompt: t(
            `How many injective functions are there from a set with ${els(m)} to a set with ${els(n)}?`,
            `从含 $${m}$ 个元素的集合到含 $${n}$ 个元素的集合，有多少个单射？`,
          ),
          answer: count,
          wrong: [count + 1],
          mistakes: apart(count, [
            why(n ** m, "That counts every function, including those that repeat an output.", "这数的是所有函数，包括输出重复的。"),
            why(
              m ** n,
              "That swaps the roles of the sets: each input picks an output, so the outputs give the choices.",
              "这把两个集合的角色弄反了：每个输入挑一个输出，可选的是输出。",
            ),
            ...(m > 1 && count > 0
              ? [
                  why(
                    choose,
                    "That counts which outputs are used, but the same outputs can go to the inputs in different orders.",
                    "这数的是用到哪些输出，但同一组输出可以按不同顺序分给各输入。",
                  ),
                ]
              : []),
          ]),
          solution:
            m > n
              ? walked(
                  [
                    [
                      ["Compare the sizes", "比较大小"],
                      t(`There are $${m}$ inputs but only $${n}$ outputs.`, `有 $${m}$ 个输入，但只有 $${n}$ 个输出。`),
                    ],
                    [
                      ["Apply the pigeonhole principle", "用抽屉原理"],
                      t(
                        "Two inputs must share an output, so no function is injective: $0$.",
                        "必有两个输入共用一个输出，所以没有函数是单射：$0$ 个。",
                      ),
                    ],
                  ],
                  t(
                    `Choosing outputs one input at a time, after $${n}$ inputs every output is used, and input $${n + 1}$ has no choice left.`,
                    `逐个为输入选输出，选完 $${n}$ 个输入后所有输出都已用过，第 $${n + 1}$ 个输入无可选。`,
                  ),
                )
              : walked(
                  [
                    [
                      ["Choose the outputs in turn", "依次选输出"],
                      t(
                        `The first input has $${n}$ choices${m > 1 ? `, the next $${n - 1}$${m > 2 ? `, and so on down to $${n - m + 1}$` : ""}` : ""}, since outputs may not repeat.`,
                        `第一个输入有 $${n}$ 种选择${m > 1 ? `，下一个有 $${n - 1}$ 种${m > 2 ? `，依此类推直到 $${n - m + 1}$ 种` : ""}` : ""}，因为输出不能重复。`,
                      ),
                    ],
                    [["Multiply", "相乘"], t(`$${factors.join(" \\cdot ")} = ${count}$.`, `$${factors.join(" \\cdot ")} = ${count}$。`)],
                  ],
                  t(
                    `Count another way: choose which $${m}$ outputs are used, $\\binom{${n}}{${m}} = ${choose}$ ways, then arrange them among the inputs, $${m}! = ${factorial(m)}$ ways: $${choose} \\cdot ${factorial(m)} = ${count}$.`,
                    `换一种数法：先选用哪 $${m}$ 个输出，$\\binom{${n}}{${m}} = ${choose}$ 种，再把它们排给各输入，$${m}! = ${factorial(m)}$ 种：$${choose} \\cdot ${factorial(m)} = ${count}$。`,
                  ),
                ),
        });
      },
    },
  ],
};

/** provingInjectivity proves functions injective or finds collisions. */
export const provingInjectivity: TopicDef = {
  id: "proving-injectivity",
  title: t("Proving Injectivity", "证明单射"),
  summary: t(
    "Assume f(a) = f(b) and deduce a = b; to disprove, find a ≠ b with f(a) = f(b).",
    "假设 f(a) = f(b) 并推出 a = b；要否定，找出 a ≠ b 使 f(a) = f(b)。",
  ),
  intro: t(
    "To prove $f(x) = 5x - 2$ is injective on $\\mathbb{R}$, suppose $f(a) = f(b)$. Then $5a - 2 = 5b - 2$; adding $2$ gives $5a = 5b$, and dividing by $5$ gives $a = b$. Equal outputs force equal inputs, which is what injective means.\n\nCheck: the same argument fails for $g(x) = x^2$. From $a^2 = b^2$ only $a = \\pm b$ follows, and indeed $g(-3) = g(3) = 9$ with $-3 \\ne 3$.\n\nIn this lesson we write the key step of an injectivity proof, and decide injectivity on a restricted domain.",
    "要证明 $f(x) = 5x - 2$ 在 $\\mathbb{R}$ 上是单射，假设 $f(a) = f(b)$。则 $5a - 2 = 5b - 2$；两边加 $2$ 得 $5a = 5b$，再除以 $5$ 得 $a = b$。输出相等迫使输入相等，这正是单射的含义。\n\n检验：同样的论证对 $g(x) = x^2$ 行不通。由 $a^2 = b^2$ 只能得到 $a = \\pm b$，事实上 $g(-3) = g(3) = 9$，而 $-3 \\ne 3$。\n\n本课我们写出单射证明的关键一步，并判断限制定义域后的单射性。",
  ),
  prerequisites: ["injections", "direct-proof"],
  encompasses: [{ topic: "injections", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-key-step-of-an-injectivity-proof",
      title: t("The key step", "关键一步"),
      explanation: t(
        "To prove injectivity, assume two inputs give the same output and use algebra to show the inputs must be equal. For $f(x) = \\dfrac{2x + 1}{x - 3}$ on $x \\ne 3$: if $f(a) = f(b)$, cross-multiplying gives $(2a + 1)(b - 3) = (2b + 1)(a - 3)$, which simplifies to $-7a = -7b$, so $a = b$.\n\n> **Watch out.** Every step must follow from the one before. A step such as $a^2 = b^2 \\Rightarrow a = b$ is false, since $a = -b$ also works; and an operation must be done to both sides.",
        "要证明单射，就假设两个输入给出相同的输出，再用代数证明这两个输入必然相等。对 $x \\ne 3$ 上的 $f(x) = \\dfrac{2x + 1}{x - 3}$：若 $f(a) = f(b)$，交叉相乘得 $(2a + 1)(b - 3) = (2b + 1)(a - 3)$，化简得 $-7a = -7b$，所以 $a = b$。\n\n> **注意。** 每一步都必须由前一步推出。像 $a^2 = b^2 \\Rightarrow a = b$ 这样的步骤是错的，因为 $a = -b$ 也满足；而且每个运算都要对两边同时做。",
      ),
      generate(rng) {
        const p = rng.int(2, 9);
        const q = rng.int(-9, 9) || 1;
        const kind = rng.int(0, 2);
        const oneSide = (en: string, zh: string): [string, string] => [en, zh];
        if (kind === 0) {
          const w = [`a${signed(q)} = b${signed(q)}`, `${p}a = ${p}b${signed(q)}`, `a = ${p}b`];
          const say = [
            oneSide(
              `That divides only the $a$ and $b$ terms by $${p}$, not the constants.`,
              `这只把含 $a$、$b$ 的项除以 $${p}$，常数没有除。`,
            ),
            oneSide(`That removes $${q}$ from one side only.`, `这只从一边去掉了 $${q}$。`),
            oneSide(`That divides one side by $${p}$ but not the other.`, `这只把一边除以 $${p}$，另一边没有除。`),
          ];
          return reasoned(
            oneOf(
              rng,
              t(
                `To prove $f(x) = ${p}x${signed(q)}$ is injective, assume $f(a) = f(b)$. Which step follows?`,
                `证明 $f(x) = ${p}x${signed(q)}$ 是单射：假设 $f(a) = f(b)$。接下来是哪一步？`,
              ),
              math(`${p}a = ${p}b`),
              w.map(math),
              walked(
                [
                  [
                    ["Write the equal outputs", "写出相等的输出"],
                    t(`$${p}a${signed(q)} = ${p}b${signed(q)}$.`, `$${p}a${signed(q)} = ${p}b${signed(q)}$。`),
                  ],
                  [
                    [`Remove $${q}$ from both sides`, `两边去掉 $${q}$`],
                    t(`$${p}a = ${p}b$, and dividing by $${p}$ gives $a = b$.`, `$${p}a = ${p}b$，再除以 $${p}$ 得 $a = b$。`),
                  ],
                ],
                t(
                  `Different inputs do give different outputs, for example $f(1) = ${p + q}$ and $f(2) = ${2 * p + q}$.`,
                  `不同的输入确实给出不同的输出，例如 $f(1) = ${p + q}$，$f(2) = ${2 * p + q}$。`,
                ),
              ),
            ),
            w.map((x, i): Reason => [`$${x}$`, say[i]![0], say[i]![1]]),
          );
        }
        if (kind === 1) {
          const w = [`a^2 = b^2, \\text{ so } a = b`, `a^3 = b^3${signed(q)}`, `a^3 = b^3, \\text{ so } a = \\pm b`];
          const say = [
            oneSide(
              `Removing $${q}$ leaves cubes, not squares, and $a^2 = b^2$ would not give $a = b$ anyway.`,
              `去掉 $${q}$ 后剩下的是立方而不是平方，况且 $a^2 = b^2$ 也推不出 $a = b$。`,
            ),
            oneSide(`That removes $${q}$ from one side only.`, `这只从一边去掉了 $${q}$。`),
            oneSide(
              "Only even powers lose the sign; a real number has exactly one real cube root, so $a = b$.",
              "只有偶次幂会丢掉符号；实数恰有一个实立方根，所以 $a = b$。",
            ),
          ];
          return reasoned(
            oneOf(
              rng,
              t(
                `To prove $f(x) = x^3${signed(q)}$ is injective on $\\mathbb{R}$, assume $f(a) = f(b)$. Which step follows?`,
                `证明 $f(x) = x^3${signed(q)}$ 在 $\\mathbb{R}$ 上是单射：假设 $f(a) = f(b)$。接下来是哪一步？`,
              ),
              math(`a^3 = b^3, \\text{ so } a = b`),
              w.map(math),
              walked(
                [
                  [
                    ["Write the equal outputs", "写出相等的输出"],
                    t(`$a^3${signed(q)} = b^3${signed(q)}$.`, `$a^3${signed(q)} = b^3${signed(q)}$。`),
                  ],
                  [[`Remove $${q}$ from both sides`, `两边去掉 $${q}$`], t("$a^3 = b^3$.", "$a^3 = b^3$。")],
                  [
                    ["Take the cube root", "开立方"],
                    t("A real number has exactly one real cube root, so $a = b$.", "实数恰有一个实立方根，所以 $a = b$。"),
                  ],
                ],
                t(
                  "$-2$ is the only real number whose cube is $-8$, while both $2$ and $-2$ square to $4$: that is why cubes keep the sign and squares do not.",
                  "立方等于 $-8$ 的实数只有 $-2$，而 $2$ 和 $-2$ 的平方都是 $4$：所以立方保留符号，平方不保留。",
                ),
              ),
            ),
            w.map((x, i): Reason => [`$${x}$`, say[i]![0], say[i]![1]]),
          );
        }
        const c = rng.int(1, 9);
        const q2 = q === -p * c ? q + 1 : q;
        const det = -p * c - q2;
        const tex = `\\dfrac{${p}x${signed(q2)}}{x - ${c}}`;
        const left = poly([
          [p, "ab"],
          [-p * c, "a"],
          [q2, "b"],
          [-q2 * c, ""],
        ]);
        const rightSide = poly([
          [p, "ab"],
          [-p * c, "b"],
          [q2, "a"],
          [-q2 * c, ""],
        ]);
        const L = q2 * (1 - c);
        const R = (p + q2) * -c;
        const w = [`${p}a = ${p}b`, `${-det}a = ${det}b`, `${p * c}a = ${q2}b`];
        const say = [
          oneSide("That ignores the denominators: cross-multiplying brings in more terms.", "这忽略了分母：交叉相乘会带来更多的项。"),
          oneSide(
            "The two sides are mirror images in $a$ and $b$, so they end with the same coefficient.",
            "两边关于 $a$ 和 $b$ 对称，所以最后系数相同。",
          ),
          oneSide(
            "That mixes coefficients from the two sides; collect the $a$ terms and the $b$ terms separately.",
            "这把两边的系数混在一起了；要分别合并含 $a$ 的项和含 $b$ 的项。",
          ),
        ];
        return reasoned(
          oneOf(
            rng,
            t(
              `To prove $f(x) = ${tex}$ is injective on $x \\ne ${c}$, assume $f(a) = f(b)$ and cross-multiply. What does the equation simplify to?`,
              `证明 $f(x) = ${tex}$ 在 $x \\ne ${c}$ 上是单射：假设 $f(a) = f(b)$ 并交叉相乘。方程化简为什么？`,
            ),
            math(`${det}a = ${det}b`),
            w.map(math),
            walked(
              [
                [
                  ["Cross-multiply", "交叉相乘"],
                  t(
                    `$(${p}a${signed(q2)})(b - ${c}) = (${p}b${signed(q2)})(a - ${c})$.`,
                    `$(${p}a${signed(q2)})(b - ${c}) = (${p}b${signed(q2)})(a - ${c})$。`,
                  ),
                ],
                [["Expand", "展开"], t(`$${left} = ${rightSide}$.`, `$${left} = ${rightSide}$。`)],
                [
                  ["Cancel and collect", "消去并合并"],
                  t(
                    `The $ab$ terms and the constants cancel. Moving the $a$ terms to the left and the $b$ terms to the right gives $${det}a = ${det}b$, so $a = b$ because $${det} \\ne 0$.`,
                    `$ab$ 项与常数项相消。把含 $a$ 的项移到左边、含 $b$ 的项移到右边，得 $${det}a = ${det}b$，因为 $${det} \\ne 0$，所以 $a = b$。`,
                  ),
                ],
              ],
              t(
                `Test $a = 0$, $b = 1$ in the cross-multiplied equation: the sides are $${L}$ and $${R}$, which differ, just as $${det} \\cdot 0 \\ne ${det} \\cdot 1$.`,
                `在交叉相乘后的方程中取 $a = 0$，$b = 1$：两边分别为 $${L}$ 和 $${R}$，不相等，正如 $${det} \\cdot 0 \\ne ${det} \\cdot 1$。`,
              ),
            ),
          ),
          w.map((x, i): Reason => [`$${x}$`, say[i]![0], say[i]![1]]),
        );
      },
    },
    {
      id: "injectivity-on-a-restricted-domain",
      figure: proofDrawings1["proving-injectivity#injectivity-on-a-restricted-domain"],
      title: t("Injectivity on a restricted domain", "限制定义域后的单射性"),
      explanation: t(
        "$f(x) = x^2 - 6x$ is not injective on $\\mathbb{R}$: $f(0) = f(6)$. On $[3, \\infty)$, to the right of the vertex, it is injective. In general a quadratic is injective on an interval exactly when the interval does not contain points on both sides of the vertex.\n\n> **Watch out.** The vertex itself may be an endpoint: $x^2 - 6x$ is still injective on $[3, \\infty)$. Injectivity fails only when the interval reaches past the vertex on both sides.",
        "$f(x) = x^2 - 6x$ 在 $\\mathbb{R}$ 上不是单射：$f(0) = f(6)$。在顶点右侧的 $[3, \\infty)$ 上它是单射。一般地，二次函数在一个区间上是单射，当且仅当该区间不包含顶点两侧的点。\n\n> **注意。** 顶点本身可以是端点：$x^2 - 6x$ 在 $[3, \\infty)$ 上仍是单射。只有区间越过顶点、两侧都有点时，单射才不成立。",
      ),
      generate(rng) {
        const h = rng.int(-6, 6);
        const a = rng.int(-9, 9);
        const right = rng.bool();
        const value = right ? a >= h : a <= h;
        const dom = right ? `[${a}, \\infty)` : `(-\\infty, ${a}]`;
        const tex = `x^2${h === 0 ? "" : signed(-2 * h).replace(/(\d+)$/, "$1x")}`;
        const f = (x: number) => x * x - 2 * h * x;
        const x1 = right ? Math.max(a, h) + 1 : Math.min(a, h) - 1;
        const x2 = 2 * h - x1;
        const side = right ? t("right", "右") : t("left", "左");
        return reasoned(
          oneOf(
            rng,
            t(`Is $f(x) = ${tex}$ injective on $${dom}$?`, `$f(x) = ${tex}$ 在 $${dom}$ 上是单射吗？`),
            yesNo[value ? 0 : 1]!,
            [yesNo[value ? 1 : 0]!],
            walked(
              [
                [
                  ["Find the vertex", "找顶点"],
                  t(
                    `$f(x) = ${tex}$ has its vertex at $x = ${h}$; points at the same distance from $${h}$ share a value.`,
                    `$f(x) = ${tex}$ 的顶点在 $x = ${h}$；与 $${h}$ 距离相同的点函数值相同。`,
                  ),
                ],
                [
                  ["Compare with the interval", "与区间比较"],
                  value
                    ? t(
                        `$${dom}$ lies on the ${side.en} of $x = ${h}$, where $f$ is strictly monotonic, so $f$ is injective there.`,
                        `$${dom}$ 位于 $x = ${h}$ 的${side["zh-CN"]}侧，$f$ 在其上严格单调，所以是单射。`,
                      )
                    : t(
                        `$${dom}$ contains the vertex $x = ${h}$ with points on both sides of it, so $f$ is not injective there.`,
                        `$${dom}$ 包含顶点 $x = ${h}$，且两侧都有点，所以 $f$ 在其上不是单射。`,
                      ),
                ],
              ],
              value
                ? t(
                    `Moving away from the vertex only raises $f$: $f(${a}) = ${f(a)}$ and $f(${right ? a + 1 : a - 1}) = ${f(right ? a + 1 : a - 1)}$, and the values keep growing further out.`,
                    `离顶点越远 $f$ 越大：$f(${a}) = ${f(a)}$，$f(${right ? a + 1 : a - 1}) = ${f(right ? a + 1 : a - 1)}$，再往外函数值继续增大。`,
                  )
                : t(
                    `$f(${x1}) = ${f(x1)}$ and $f(${x2}) = ${f(x2)}$, and both $${x1}$ and $${x2}$ lie in $${dom}$.`,
                    `$f(${x1}) = ${f(x1)}$，$f(${x2}) = ${f(x2)}$，而 $${x1}$ 和 $${x2}$ 都在 $${dom}$ 中。`,
                  ),
            ),
          ),
          [
            value
              ? [
                  "No",
                  `Two inputs share a value only when they sit on opposite sides of $x = ${h}$, and $${dom}$ has points on one side only.`,
                  `两个输入只有位于 $x = ${h}$ 两侧时才可能函数值相同，而 $${dom}$ 只在一侧有点。`,
                ]
              : ["Yes", `$f(${x1}) = f(${x2})$ with both inputs in $${dom}$.`, `$f(${x1}) = f(${x2})$，且两个输入都在 $${dom}$ 中。`],
          ],
        );
      },
    },
  ],
};

/** surjections defines onto functions. */
export const surjections: TopicDef = {
  id: "surjections",
  title: t("Surjections", "满射"),
  summary: t(
    "f: A → B is surjective when every b ∈ B equals f(a) for some a ∈ A, that is, the range is all of B.",
    "若每个 b ∈ B 都等于某个 a ∈ A 的 f(a)，即值域就是整个 B，则 f: A → B 是满射。",
  ),
  intro: t(
    "Let $f: \\{1, 2, 3, 4\\} \\to \\{a, b, c\\}$ be $\\{(1, c), (2, a), (3, c), (4, b)\\}$. Every element of the codomain is an output: $a = f(2)$, $b = f(4)$ and $c = f(1)$. So $f$ is surjective, even though $c$ is used twice.\n\nCheck: with the codomain $\\{a, b, c, d\\}$, the same pairs would not be surjective, since $d$ is never an output.\n\nIn this lesson we recognize surjections between finite sets and count them by inclusion–exclusion.",
    "设 $f: \\{1, 2, 3, 4\\} \\to \\{a, b, c\\}$ 为 $\\{(1, c), (2, a), (3, c), (4, b)\\}$。陪域中每个元素都是输出：$a = f(2)$，$b = f(4)$，$c = f(1)$。所以 $f$ 是满射，尽管 $c$ 被用了两次。\n\n检验：若陪域是 $\\{a, b, c, d\\}$，同样的序对就不是满射，因为 $d$ 从来不是输出。\n\n本课我们识别有限集之间的满射，并用容斥原理统计满射的个数。",
  ),
  prerequisites: ["sets-and-functions"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-surjections",
      title: t("Recognizing surjections", "识别满射"),
      explanation: t(
        "A function between finite sets is surjective when every element of the codomain appears as an output. $\\{(1, b), (2, a), (3, b)\\}$ is onto $\\{a, b\\}$ but not onto $\\{a, b, c\\}$.\n\n> **Watch out.** Surjectivity asks whether every element of the codomain is hit; repeated outputs do not matter. It depends on the codomain, not only on the pairs.",
        "有限集之间的函数是满射，当且仅当陪域中每个元素都作为输出出现。$\\{(1, b), (2, a), (3, b)\\}$ 是到 $\\{a, b\\}$ 的满射，但不是到 $\\{a, b, c\\}$ 的满射。\n\n> **注意。** 满射问的是陪域中每个元素是否都被取到；输出重复不要紧。它取决于陪域，而不只是序对本身。",
      ),
      generate(rng) {
        const n = rng.int(2, 4);
        const m = rng.int(n, 6);
        const value = rng.bool();
        const f = finiteMap(rng, m, n, m === n ? value : false, value);
        const missing = f.codomain.filter((c) => !f.values.includes(c));
        const outputs = f.codomain.filter((c) => f.values.includes(c));
        const preimage = (c: string) => `${c} = f(${f.values.indexOf(c) + 1})`;
        return reasoned(
          oneOf(
            rng,
            t(
              `Let $f: ${setTex(range(1, m))} \\to \\{${f.codomain.join(", ")}\\}$ be $${mapTex(f)}$. Is $f$ surjective?`,
              `设 $f: ${setTex(range(1, m))} \\to \\{${f.codomain.join(", ")}\\}$ 为 $${mapTex(f)}$。$f$ 是满射吗？`,
            ),
            yesNo[value ? 0 : 1]!,
            [yesNo[value ? 1 : 0]!],
            walked(
              [
                [
                  ["Collect the outputs", "收集输出"],
                  t(`The outputs are $\\{${outputs.join(", ")}\\}$.`, `输出组成的集合是 $\\{${outputs.join(", ")}\\}$。`),
                ],
                [
                  ["Compare with the codomain", "与陪域比较"],
                  value
                    ? t(
                        `That is the whole codomain $\\{${f.codomain.join(", ")}\\}$, so $f$ is surjective.`,
                        `这就是整个陪域 $\\{${f.codomain.join(", ")}\\}$，所以 $f$ 是满射。`,
                      )
                    : t(`$${missing[0]}$ is missing, so $f$ is not surjective.`, `缺少 $${missing[0]}$，所以 $f$ 不是满射。`),
                ],
              ],
              value
                ? t(
                    `Each element has an input: ${f.codomain.map((c) => `$${preimage(c)}$`).join(", ")}.`,
                    `每个元素都有输入：${f.codomain.map((c) => `$${preimage(c)}$`).join("，")}。`,
                  )
                : t(
                    `Going through ${valuesTex(f).join(", ")}, none of them is $${missing[0]}$.`,
                    `逐一查看 ${valuesTex(f).join("，")}，没有一个等于 $${missing[0]}$。`,
                  ),
            ),
          ),
          [
            value
              ? [
                  "No",
                  "Every element of the codomain is an output; repeated outputs do not matter.",
                  "陪域中每个元素都是输出；输出重复不要紧。",
                ]
              : ["Yes", `$${missing[0]}$ is in the codomain but is never an output.`, `$${missing[0]}$ 在陪域中，但从来不是输出。`],
          ],
        );
      },
    },
    {
      id: "counting-surjections",
      title: t("Counting surjections", "统计满射个数"),
      explanation: t(
        "Count all functions and subtract those that miss an output. From $m$ elements onto $2$: $2^m - 2$. Onto $3$: $3^m - 3 \\cdot 2^m + 3$. Onto $4$: $4^m - 4 \\cdot 3^m + 6 \\cdot 2^m - 4$, by inclusion–exclusion.\n\n> **Watch out.** Subtracting the functions that miss each single output removes the ones that miss two outputs more than once, so they must be added back. That is why the signs alternate.",
        "先数所有函数，再减去漏掉某个输出的函数。从 $m$ 个元素到 $2$ 个元素的满射有 $2^m - 2$ 个；到 $3$ 个元素有 $3^m - 3 \\cdot 2^m + 3$ 个；到 $4$ 个元素有 $4^m - 4 \\cdot 3^m + 6 \\cdot 2^m - 4$ 个（容斥原理）。\n\n> **注意。** 对每个输出减去漏掉它的函数时，漏掉两个输出的函数被减了不止一次，所以要加回来。这就是符号交替的原因。",
      ),
      generate(rng) {
        const n = rng.int(2, 4);
        const m = rng.int(n, 7);
        const count = [0, 0, 2 ** m - 2, 3 ** m - 3 * 2 ** m + 3, 4 ** m - 4 * 3 ** m + 6 * 2 ** m - 4][n]!;
        const missing = rng.bool();
        const formula = [
          "",
          "",
          `2^{${m}} - 2`,
          `3^{${m}} - 3 \\cdot 2^{${m}} + 3`,
          `4^{${m}} - 4 \\cdot 3^{${m}} + 6 \\cdot 2^{${m}} - 4`,
        ][n]!;
        const s = stirling2(m, n);
        const answer = missing ? n ** m - count : count;
        const steps: [[string, string], Text][] = [
          [
            ["Count all functions", "数所有函数"],
            t(
              `Each of the $${m}$ inputs has $${n}$ choices: $${n}^{${m}} = ${n ** m}$.`,
              `$${m}$ 个输入各有 $${n}$ 种选择：$${n}^{${m}} = ${n ** m}$。`,
            ),
          ],
          [
            ["Remove those that miss an output", "去掉漏掉输出的函数"],
            t(
              `By inclusion–exclusion over the $${n}$ outputs, the surjections number $${formula} = ${count}$.`,
              `对 $${n}$ 个输出用容斥原理，满射有 $${formula} = ${count}$ 个。`,
            ),
          ],
        ];
        if (missing)
          steps.push([
            ["Take the rest", "取其余部分"],
            t(`$${n ** m} - ${count} = ${answer}$ functions are not onto.`, `有 $${n ** m} - ${count} = ${answer}$ 个函数不是满射。`),
          ]);
        return numberProblem({
          prompt: missing
            ? t(
                `How many functions from a set with $${m}$ elements to a set with $${n}$ elements are not surjective?`,
                `从含 $${m}$ 个元素的集合到含 $${n}$ 个元素的集合的函数中，有多少个不是满射？`,
              )
            : t(
                `How many surjective functions are there from a set with $${m}$ elements onto a set with $${n}$ elements?`,
                `从含 $${m}$ 个元素的集合到含 $${n}$ 个元素的集合，有多少个满射？`,
              ),
          answer,
          wrong: [answer + 1],
          mistakes: apart(
            answer,
            missing
              ? [
                  why(
                    count,
                    "That counts the surjections; the question asks for the other functions.",
                    "这数的是满射；题目问的是其余的函数。",
                  ),
                  why(
                    n,
                    "That counts only the constant functions; functions that miss just one output are not onto either.",
                    "这只数了常值函数；只漏掉一个输出的函数也不是满射。",
                  ),
                ]
              : [
                  why(n ** m, "That counts every function, including those that miss an output.", "这数的是所有函数，包括漏掉输出的。"),
                  why(
                    n ** m - n,
                    "That removes only the constant functions; functions that miss just one output are still included.",
                    "这只去掉了常值函数；只漏掉一个输出的函数仍被算在内。",
                  ),
                  why(
                    m ** n,
                    `That swaps the roles: each of the $${m}$ inputs picks one of $${n}$ outputs.`,
                    `这把角色弄反了：$${m}$ 个输入各从 $${n}$ 个输出中挑一个。`,
                  ),
                ],
          ),
          solution: walked(
            steps,
            t(
              `Count the surjections another way: grouping the inputs by their output splits the $${m}$ inputs into $${n}$ nonempty blocks, in $${s}$ ways, and the blocks can receive the $${n}$ outputs in $${n}! = ${factorial(n)}$ ways: $${s} \\cdot ${factorial(n)} = ${count}$.`,
              `换一种方法数满射：按输出把输入分组，就把 $${m}$ 个输入分成 $${n}$ 个非空组，共 $${s}$ 种分法，再把 $${n}$ 个输出分给各组，有 $${n}! = ${factorial(n)}$ 种：$${s} \\cdot ${factorial(n)} = ${count}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** stirling2 counts the ways to split m things into n nonempty blocks. */
function stirling2(m: number, n: number): number {
  if (m === 0 && n === 0) return 1;
  if (m === 0 || n === 0) return 0;
  return n * stirling2(m - 1, n) + stirling2(m - 1, n - 1);
}

/** lower lowercases the first letter of a sentence so that it can follow "Yes:" or "No:". */
const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/** intoFunctions studies functions whose range is a proper subset of the codomain. */
export const intoFunctions: TopicDef = {
  id: "into-functions",
  title: t("Into Functions", "非满射函数"),
  summary: t(
    "An into function is one that is not onto: some element of the codomain is never an output.",
    "非满射函数（into function）是指陪域中有元素不是任何输入的输出的函数。",
  ),
  intro: t(
    "Let $f: \\mathbb{Z} \\to \\mathbb{Z}$, $f(n) = 2n + 1$. Every output is odd, so $4$ is never reached: $2n + 1 = 4$ would need $n = \\dfrac{3}{2}$, which is not an integer. One missed value is enough, so $f$ is into, not onto.\n\nCheck: $f(1) = 3$ and $f(2) = 5$, and no integer lies strictly between $1$ and $2$, so $4$ is skipped.\n\nIn this lesson we find values outside the range, and decide, for a given codomain, whether a function is into or onto.",
    "设 $f: \\mathbb{Z} \\to \\mathbb{Z}$，$f(n) = 2n + 1$。每个输出都是奇数，所以取不到 $4$：$2n + 1 = 4$ 需要 $n = \\dfrac{3}{2}$，它不是整数。只要漏掉一个值就够了，所以 $f$ 是非满射。\n\n检验：$f(1) = 3$，$f(2) = 5$，而 $1$ 与 $2$ 之间没有整数，所以 $4$ 被跳过了。\n\n本课我们找出值域之外的值，并对给定的陪域判断函数是否为满射。",
  ),
  prerequisites: ["surjections"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "values-outside-the-range",
      title: t("Values outside the range", "值域之外的值"),
      explanation: t(
        "A function fails to be onto when some value of the codomain is never an output, so one such value is enough to show it. $f: \\mathbb{Z} \\to \\mathbb{Z}$, $f(n) = 3n + 1$ has range $\\{\\dots, -2, 1, 4, 7, \\dots\\}$, so $f$ is into: $5$ is not an output, since $3n + 1 = 5$ has no integer solution.\n\n> **Watch out.** Test a value by solving $f(n) = y$ and asking whether the solution lies in the domain. A solution that is not an integer does not count when the domain is $\\mathbb{Z}$.",
        "如果陪域中有某个值从来不是输出，函数就不是满射，所以找到一个这样的值就足以说明。$f: \\mathbb{Z} \\to \\mathbb{Z}$，$f(n) = 3n + 1$ 的值域是 $\\{\\dots, -2, 1, 4, 7, \\dots\\}$，所以 $f$ 不是满射：$5$ 不是输出，因为 $3n + 1 = 5$ 没有整数解。\n\n> **注意。** 检验一个值时，解 $f(n) = y$，再看解是否在定义域内。定义域是 $\\mathbb{Z}$ 时，非整数解不算。",
      ),
      generate(rng) {
        const k = rng.int(2, 7);
        const c = rng.int(-9, 9);
        const ins = rng
          .shuffle(range(-6, 6))
          .slice(0, 3)
          .map((n) => k * n + c);
        let out: number;
        do out = rng.int(-30, 30);
        while ((((out - c) % k) + k) % k === 0);
        const rem = (v: number) => mod(v, k);
        const at = (v: number) => (v - c) / k;
        return reasoned(
          oneOf(
            rng,
            t(
              `For $f: \\mathbb{Z} \\to \\mathbb{Z}$, $f(n) = ${k}n${signed(c)}$, which integer is not in the range?`,
              `对 $f: \\mathbb{Z} \\to \\mathbb{Z}$，$f(n) = ${k}n${signed(c)}$，哪个整数不在值域中？`,
            ),
            math(`${out}`),
            ins.map((v) => math(`${v}`)),
            walked(
              [
                [
                  ["Solve for $n$", "解出 $n$"],
                  t(
                    `$${k}n${signed(c)} = ${out}$ gives $n = \\dfrac{${out - c}}{${k}}$, which is not an integer.`,
                    `$${k}n${signed(c)} = ${out}$ 得 $n = \\dfrac{${out - c}}{${k}}$，不是整数。`,
                  ),
                ],
                [
                  ["Check the others", "检查其余选项"],
                  t(
                    `${ins.map((v) => `$${v} = f(${at(v)})$`).join(", ")}, so they are in the range.`,
                    `${ins.map((v) => `$${v} = f(${at(v)})$`).join("，")}，所以它们在值域中。`,
                  ),
                ],
              ],
              t(
                `Every output leaves remainder $${rem(c)}$ on division by $${k}$, while $${out}$ leaves remainder $${rem(out)}$.`,
                `每个输出除以 $${k}$ 的余数都是 $${rem(c)}$，而 $${out}$ 除以 $${k}$ 的余数是 $${rem(out)}$。`,
              ),
            ),
          ),
          ins.map((v): Reason => [`$${v}$`, `$${v} = f(${at(v)})$, so it is in the range.`, `$${v} = f(${at(v)})$，所以它在值域中。`]),
        );
      },
    },
    {
      id: "deciding-whether-a-function-is-into",
      title: t("Into or onto?", "满射与否"),
      explanation: t(
        "The answer depends on the codomain. $f(x) = x^2$ is into as a function $\\mathbb{R} \\to \\mathbb{R}$ (no output is negative) but onto as a function $\\mathbb{R} \\to [0, \\infty)$.\n\n> **Watch out.** The same formula can be into or onto. Compare the set of outputs with the codomain stated in the question, not with $\\mathbb{R}$ by habit.",
        "答案取决于陪域。$f(x) = x^2$ 作为 $\\mathbb{R} \\to \\mathbb{R}$ 的函数不是满射（没有负的输出），但作为 $\\mathbb{R} \\to [0, \\infty)$ 的函数是满射。\n\n> **注意。** 同一个式子可能是满射，也可能不是。要把输出的集合与题目给出的陪域比较，而不是习惯性地与 $\\mathbb{R}$ 比较。",
      ),
      generate(rng) {
        const a = rng.int(1, 9);
        const forms: [string, string, boolean, Text, Text][] = [
          [
            `x^2 + ${a}`,
            "\\mathbb{R}",
            true,
            t(`Outputs are at least $${a}$.`, `输出至少为 $${a}$。`),
            t(
              `$x^2 + ${a} = ${a - 1}$ would need $x^2 = -1$, so $${a - 1}$ is missed.`,
              `$x^2 + ${a} = ${a - 1}$ 需要 $x^2 = -1$，所以取不到 $${a - 1}$。`,
            ),
          ],
          [
            `x^2 + ${a}`,
            `[${a}, \\infty)`,
            false,
            t(`Every $y \\ge ${a}$ is $f(\\sqrt{y - ${a}})$.`, `每个 $y \\ge ${a}$ 都等于 $f(\\sqrt{y - ${a}})$。`),
            t(
              `For $y = ${a + 4}$: $f(\\sqrt{4}) = f(2) = 4 + ${a} = ${a + 4}$.`,
              `对 $y = ${a + 4}$：$f(\\sqrt{4}) = f(2) = 4 + ${a} = ${a + 4}$。`,
            ),
          ],
          [
            `e^x${signed(a)}`,
            "\\mathbb{R}",
            true,
            t(`Outputs exceed $${a}$.`, `输出都大于 $${a}$。`),
            t(
              `$e^x + ${a} = ${a}$ would need $e^x = 0$, which never happens, so $${a}$ is missed.`,
              `$e^x + ${a} = ${a}$ 需要 $e^x = 0$，这不可能，所以取不到 $${a}$。`,
            ),
          ],
          [
            `x^3${signed(-a)}`,
            "\\mathbb{R}",
            false,
            t(`Every $y$ is $f(\\sqrt[3]{y + ${a}})$.`, `每个 $y$ 都等于 $f(\\sqrt[3]{y + ${a}})$。`),
            t(
              `For $y = ${8 - a}$: $f(\\sqrt[3]{8}) = f(2) = 8 - ${a} = ${8 - a}$.`,
              `对 $y = ${8 - a}$：$f(\\sqrt[3]{8}) = f(2) = 8 - ${a} = ${8 - a}$。`,
            ),
          ],
          [
            `${a}\\sin x`,
            "\\mathbb{R}",
            true,
            t(`Outputs lie in $[-${a}, ${a}]$.`, `输出位于 $[-${a}, ${a}]$ 中。`),
            t(`$|${a}\\sin x| \\le ${a}$, so $${a + 1}$ is missed.`, `$|${a}\\sin x| \\le ${a}$，所以取不到 $${a + 1}$。`),
          ],
          [
            `${a}\\sin x`,
            `[-${a}, ${a}]`,
            false,
            t(`$${a}\\sin x$ takes every value between $-${a}$ and $${a}$.`, `$${a}\\sin x$ 取遍 $-${a}$ 与 $${a}$ 之间的每个值。`),
            t(
              `$f\\left(\\frac{\\pi}{2}\\right) = ${a}$, $f(0) = 0$ and $f\\left(-\\frac{\\pi}{2}\\right) = -${a}$, and $f$ is continuous, so nothing in between is skipped.`,
              `$f\\left(\\frac{\\pi}{2}\\right) = ${a}$，$f(0) = 0$，$f\\left(-\\frac{\\pi}{2}\\right) = -${a}$，且 $f$ 连续，所以中间的值都取得到。`,
            ),
          ],
          [
            `${a + 1}x - ${a}`,
            "\\mathbb{R}",
            false,
            t(
              `Every $y$ is $f\\left(\\frac{y + ${a}}{${a + 1}}\\right)$.`,
              `每个 $y$ 都等于 $f\\left(\\frac{y + ${a}}{${a + 1}}\\right)$。`,
            ),
            t(
              `For $y = 1$: $\\frac{1 + ${a}}{${a + 1}} = 1$ and $f(1) = ${a + 1} - ${a} = 1$.`,
              `对 $y = 1$：$\\frac{1 + ${a}}{${a + 1}} = 1$，$f(1) = ${a + 1} - ${a} = 1$。`,
            ),
          ],
          [
            `|x| - ${a}`,
            "\\mathbb{R}",
            true,
            t(`Outputs are at least $-${a}$.`, `输出至少为 $-${a}$。`),
            t(
              `$|x| - ${a} = -${a + 1}$ would need $|x| = -1$, so $-${a + 1}$ is missed.`,
              `$|x| - ${a} = -${a + 1}$ 需要 $|x| = -1$，所以取不到 $-${a + 1}$。`,
            ),
          ],
        ];
        const [f, cod, into, why1, check] = rng.pick(forms);
        return reasoned(
          oneOf(
            rng,
            t(
              `Is $f: \\mathbb{R} \\to ${cod}$, $f(x) = ${f}$, an into function (not onto)?`,
              `$f: \\mathbb{R} \\to ${cod}$，$f(x) = ${f}$ 是非满射函数吗？`,
            ),
            yesNo[into ? 0 : 1]!,
            [yesNo[into ? 1 : 0]!],
            walked(
              [
                [["Find the outputs", "找出输出"], why1],
                [
                  ["Compare with the codomain", "与陪域比较"],
                  into
                    ? t(
                        `So some values of the codomain $${cod}$ are never reached, and $f$ is into.`,
                        `所以陪域 $${cod}$ 中有的值取不到，$f$ 是非满射。`,
                      )
                    : t(
                        `So every value of the codomain $${cod}$ is reached, and $f$ is onto.`,
                        `所以陪域 $${cod}$ 中的每个值都能取到，$f$ 是满射。`,
                      ),
                ],
              ],
              check,
            ),
          ),
          [
            into
              ? ["No", `${why1.en} So not every value of $${cod}$ is reached.`, `${why1["zh-CN"]}所以 $${cod}$ 中并非每个值都能取到。`]
              : ["Yes", `${why1.en} So every value of $${cod}$ is reached.`, `${why1["zh-CN"]}所以 $${cod}$ 中每个值都能取到。`],
          ],
        );
      },
    },
  ],
};

/** egcd finds x and y with ax + by = gcd(a, b). */
function egcd(a: number, b: number): [number, number] {
  if (b === 0) return [1, 0];
  const [x, y] = egcd(b, a % b);
  return [y, x - Math.floor(a / b) * y];
}

/** provingSurjectivity proves functions onto by solving f(x) = y. */
export const provingSurjectivity: TopicDef = {
  id: "proving-surjectivity",
  title: t("Proving Surjectivity", "证明满射"),
  summary: t(
    "Given an arbitrary y in the codomain, produce an x in the domain with f(x) = y.",
    "任取陪域中的 y，构造定义域中的 x 使 f(x) = y。",
  ),
  intro: t(
    "To prove $f: \\mathbb{R} \\to \\mathbb{R}$, $f(x) = 3x + 6$ is onto, take any $y$ and solve $3x + 6 = y$: $x = \\dfrac{y - 6}{3}$. This $x$ is a real number, and $f\\left(\\dfrac{y - 6}{3}\\right) = (y - 6) + 6 = y$, so every $y$ is an output.\n\nCheck: for $y = 0$ the formula gives $x = -2$, and $f(-2) = -6 + 6 = 0$.\n\nIn this lesson we find preimages to prove surjectivity, and decide surjectivity for functions on the integers.",
    "要证明 $f: \\mathbb{R} \\to \\mathbb{R}$，$f(x) = 3x + 6$ 是满射，任取 $y$，解 $3x + 6 = y$：$x = \\dfrac{y - 6}{3}$。这个 $x$ 是实数，且 $f\\left(\\dfrac{y - 6}{3}\\right) = (y - 6) + 6 = y$，所以每个 $y$ 都是输出。\n\n检验：对 $y = 0$，公式给出 $x = -2$，而 $f(-2) = -6 + 6 = 0$。\n\n本课我们通过求原像来证明满射，并判断整数上的函数是否为满射。",
  ),
  prerequisites: ["surjections", "direct-proof"],
  encompasses: [{ topic: "surjections", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "finding-a-preimage",
      title: t("Finding a preimage", "求原像"),
      explanation: t(
        "To show $f(x) = \\dfrac{x}{x - 1}$ maps $\\mathbb{R} \\setminus \\{1\\}$ onto $\\mathbb{R} \\setminus \\{1\\}$: given $y \\ne 1$, solve $\\dfrac{x}{x - 1} = y$ to get $x = \\dfrac{y}{y - 1}$, which is in the domain, and check $f(x) = y$.\n\n> **Watch out.** Solving is only half the proof: the $x$ you find must lie in the domain, and substituting it back must give $y$. Dividing by $y - 1$ is where the excluded value $y = 1$ matters.",
        "要证明 $f(x) = \\dfrac{x}{x - 1}$ 把 $\\mathbb{R} \\setminus \\{1\\}$ 映满 $\\mathbb{R} \\setminus \\{1\\}$：给定 $y \\ne 1$，解 $\\dfrac{x}{x - 1} = y$ 得 $x = \\dfrac{y}{y - 1}$，它在定义域内，再验证 $f(x) = y$。\n\n> **注意。** 解出 $x$ 只完成了一半：求得的 $x$ 必须在定义域内，代回去还必须得到 $y$。除以 $y - 1$ 这一步正是被排除的值 $y = 1$ 起作用的地方。",
      ),
      generate(rng) {
        const p = rng.int(2, 9);
        const q = rng.int(-9, 9) || 1;
        if (rng.bool()) {
          const w: [string, string, string][] = [
            [
              `x = \\dfrac{y${signed(q)}}{${p}}`,
              "That moves the constant across without changing its sign.",
              "这把常数移到另一边时没有变号。",
            ],
            [`x = ${p}y${signed(-q)}`, `That multiplies by $${p}$ instead of dividing by it.`, `这是乘以 $${p}$，而应该除以 $${p}$。`],
            [
              `x = \\dfrac{y}{${p}}${signed(-q)}`,
              "That divides before moving the constant, so the constant is not divided.",
              "这是先除后移常数，常数没有被除。",
            ],
          ];
          const y0 = 3 * p + q;
          return reasoned(
            oneOf(
              rng,
              t(
                `To prove $f: \\mathbb{R} \\to \\mathbb{R}$, $f(x) = ${p}x${signed(q)}$ is onto, given $y$, which $x$ satisfies $f(x) = y$?`,
                `证明 $f: \\mathbb{R} \\to \\mathbb{R}$，$f(x) = ${p}x${signed(q)}$ 是满射：给定 $y$，哪个 $x$ 满足 $f(x) = y$？`,
              ),
              math(`x = \\dfrac{y${signed(-q)}}{${p}}`),
              w.map(([x]) => math(x)),
              walked(
                [
                  [
                    ["Solve $f(x) = y$", "解 $f(x) = y$"],
                    t(
                      `$${p}x${signed(q)} = y \\iff ${p}x = y${signed(-q)} \\iff x = \\dfrac{y${signed(-q)}}{${p}}$.`,
                      `$${p}x${signed(q)} = y \\iff ${p}x = y${signed(-q)} \\iff x = \\dfrac{y${signed(-q)}}{${p}}$。`,
                    ),
                  ],
                  [
                    ["Substitute back", "代回验证"],
                    t(
                      `$f\\left(\\dfrac{y${signed(-q)}}{${p}}\\right) = (y${signed(-q)})${signed(q)} = y$, and the $x$ found is a real number.`,
                      `$f\\left(\\dfrac{y${signed(-q)}}{${p}}\\right) = (y${signed(-q)})${signed(q)} = y$，且求得的 $x$ 是实数。`,
                    ),
                  ],
                ],
                t(
                  `For $y = ${y0}$ the formula gives $x = \\dfrac{${3 * p}}{${p}} = 3$, and $f(3) = ${3 * p}${signed(q)} = ${y0}$.`,
                  `对 $y = ${y0}$，公式给出 $x = \\dfrac{${3 * p}}{${p}} = 3$，而 $f(3) = ${3 * p}${signed(q)} = ${y0}$。`,
                ),
              ),
            ),
            w.map(([x, en, zh]): Reason => [`$${x}$`, en, zh]),
          );
        }
        const c = rng.int(1, 9);
        const cy = `${c === 1 ? "" : c}y`;
        const tex = `\\dfrac{${p}x}{x - ${c}}`;
        const w: [string, string, string][] = [
          [`x = \\dfrac{${p}y}{y - ${c}}`, `That swaps the roles of $${p}$ and $${c}$.`, `这把 $${p}$ 和 $${c}$ 的角色弄反了。`],
          [
            `x = \\dfrac{${cy}}{${p} - y}`,
            `A sign slip when collecting the $x$ terms: $${p}x - xy = -${cy}$ gives $x(y - ${p}) = ${cy}$.`,
            `合并含 $x$ 的项时符号出错：$${p}x - xy = -${cy}$ 给出 $x(y - ${p}) = ${cy}$。`,
          ],
          [`x = \\dfrac{y - ${p}}{${cy}}`, "That inverts the fraction.", "这把分数倒过来了。"],
        ];
        return reasoned(
          oneOf(
            rng,
            t(
              `$f(x) = ${tex}$ maps $\\mathbb{R} \\setminus \\{${c}\\}$ onto $\\mathbb{R} \\setminus \\{${p}\\}$. Given $y \\ne ${p}$, which $x$ satisfies $f(x) = y$?`,
              `$f(x) = ${tex}$ 把 $\\mathbb{R} \\setminus \\{${c}\\}$ 映满 $\\mathbb{R} \\setminus \\{${p}\\}$。给定 $y \\ne ${p}$，哪个 $x$ 满足 $f(x) = y$？`,
            ),
            math(`x = \\dfrac{${cy}}{y - ${p}}`),
            w.map(([x]) => math(x)),
            walked(
              [
                [["Clear the denominator", "去分母"], t(`$${p}x = y(x - ${c}) = xy - ${cy}$.`, `$${p}x = y(x - ${c}) = xy - ${cy}$。`)],
                [
                  ["Collect the $x$ terms", "合并含 $x$ 的项"],
                  t(`$${cy} = xy - ${p}x = x(y - ${p})$.`, `$${cy} = xy - ${p}x = x(y - ${p})$。`),
                ],
                [
                  [`Divide by $y - ${p}$`, `除以 $y - ${p}$`],
                  t(
                    `$x = \\dfrac{${cy}}{y - ${p}}$, allowed because $y \\ne ${p}$.`,
                    `$x = \\dfrac{${cy}}{y - ${p}}$，因为 $y \\ne ${p}$，所以可以除。`,
                  ),
                ],
              ],
              t(
                `For $y = ${2 * p}$ the formula gives $x = \\dfrac{${2 * c * p}}{${p}} = ${2 * c}$, and $f(${2 * c}) = \\dfrac{${2 * c * p}}{${c}} = ${2 * p}$.`,
                `对 $y = ${2 * p}$，公式给出 $x = \\dfrac{${2 * c * p}}{${p}} = ${2 * c}$，而 $f(${2 * c}) = \\dfrac{${2 * c * p}}{${c}} = ${2 * p}$。`,
              ),
            ),
          ),
          w.map(([x, en, zh]): Reason => [`$${x}$`, en, zh]),
        );
      },
    },
    {
      id: "surjectivity-on-the-integers",
      title: t("Surjectivity on the integers", "整数上的满射"),
      explanation: t(
        "$f: \\mathbb{Z} \\to \\mathbb{Z}$, $f(n) = n + 4$ is onto, but $f(n) = 2n$ is not. $g: \\mathbb{Z} \\times \\mathbb{Z} \\to \\mathbb{Z}$, $g(m, n) = 4m + 6n$ is not onto (its outputs are even), while $g(m, n) = 3m + 5n$ is onto, since $\\gcd(3, 5) = 1$.\n\n> **Watch out.** Over $\\mathbb{Z}$, solving is not enough. $2n = y$ has the solution $n = \\dfrac{y}{2}$, but for odd $y$ it is not an integer, so $f(n) = 2n$ misses every odd number.",
        "$f: \\mathbb{Z} \\to \\mathbb{Z}$，$f(n) = n + 4$ 是满射，而 $f(n) = 2n$ 不是。$g: \\mathbb{Z} \\times \\mathbb{Z} \\to \\mathbb{Z}$，$g(m, n) = 4m + 6n$ 不是满射（输出都是偶数），而 $g(m, n) = 3m + 5n$ 是满射，因为 $\\gcd(3, 5) = 1$。\n\n> **注意。** 在 $\\mathbb{Z}$ 上，能解出来还不够。$2n = y$ 的解是 $n = \\dfrac{y}{2}$，但 $y$ 为奇数时它不是整数，所以 $f(n) = 2n$ 取不到任何奇数。",
      ),
      generate(rng) {
        if (rng.bool()) {
          const k = rng.pick([-3, -2, -1, 1, 2, 3]);
          const c = rng.int(-9, 9) || 2;
          const value = Math.abs(k) === 1;
          const n0 = -c * k;
          const pre = k === 1 ? `m${signed(-c)}` : `-m${signed(c)}`;
          const solved = Math.abs(k) === 1 ? pre : k > 0 ? `\\dfrac{m${signed(-c)}}{${k}}` : `\\dfrac{${c} - m}{${-k}}`;
          const unit = k > 0 ? `\\dfrac{1}{${k}}` : `-\\dfrac{1}{${-k}}`;
          return reasoned(
            oneOf(
              rng,
              t(
                `Is $f: \\mathbb{Z} \\to \\mathbb{Z}$, $f(n) = ${coef(k)}n${signed(c)}$, onto?`,
                `$f: \\mathbb{Z} \\to \\mathbb{Z}$，$f(n) = ${coef(k)}n${signed(c)}$ 是满射吗？`,
              ),
              yesNo[value ? 0 : 1]!,
              [yesNo[value ? 1 : 0]!],
              walked(
                [
                  [
                    ["Solve $f(n) = m$", "解 $f(n) = m$"],
                    t(`$${coef(k)}n${signed(c)} = m$ gives $n = ${solved}$.`, `$${coef(k)}n${signed(c)} = m$ 得 $n = ${solved}$。`),
                  ],
                  [
                    ["Ask whether $n$ is an integer", "看 $n$ 是否为整数"],
                    value
                      ? t(
                          `$${pre}$ is an integer whenever $m$ is, so every $m$ has a preimage.`,
                          `只要 $m$ 是整数，$${pre}$ 就是整数，所以每个 $m$ 都有原像。`,
                        )
                      : t(
                          `For $m = ${c + 1}$, $n = ${unit}$ is not an integer, so $${c + 1}$ is missed.`,
                          `对 $m = ${c + 1}$，$n = ${unit}$ 不是整数，所以取不到 $${c + 1}$。`,
                        ),
                  ],
                ],
                value
                  ? t(
                      `For $m = 0$: $n = ${n0}$, and $f(${n0}) = ${k * n0}${signed(c)} = 0$.`,
                      `对 $m = 0$：$n = ${n0}$，而 $f(${n0}) = ${k * n0}${signed(c)} = 0$。`,
                    )
                  : t(
                      `Outputs differ from $f(0) = ${c}$ by multiples of $${Math.abs(k)}$: $f(1) = ${k + c}$ and $f(-1) = ${-k + c}$ already jump past $${c + 1}$.`,
                      `输出与 $f(0) = ${c}$ 相差 $${Math.abs(k)}$ 的倍数：$f(1) = ${k + c}$，$f(-1) = ${-k + c}$，已经跳过了 $${c + 1}$。`,
                    ),
              ),
            ),
            [
              value
                ? ["No", `Every $m$ is $f(${pre})$, with an integer input.`, `每个 $m$ 都等于 $f(${pre})$，输入是整数。`]
                : [
                    "Yes",
                    `$${coef(k)}n${signed(c)} = ${c + 1}$ needs $n = ${unit}$, which is not an integer.`,
                    `$${coef(k)}n${signed(c)} = ${c + 1}$ 需要 $n = ${unit}$，它不是整数。`,
                  ],
            ],
          );
        }
        const a = rng.int(2, 12);
        const b = rng.int(2, 12);
        const g = gcd(a, b);
        const value = g === 1;
        const [x0, y0] = egcd(a, b);
        return reasoned(
          oneOf(
            rng,
            t(
              `Is $g: \\mathbb{Z} \\times \\mathbb{Z} \\to \\mathbb{Z}$, $g(m, n) = ${a}m + ${b}n$, onto?`,
              `$g: \\mathbb{Z} \\times \\mathbb{Z} \\to \\mathbb{Z}$，$g(m, n) = ${a}m + ${b}n$ 是满射吗？`,
            ),
            yesNo[value ? 0 : 1]!,
            [yesNo[value ? 1 : 0]!],
            walked(
              [
                [
                  ["Find what every output shares", "找出所有输出的共同点"],
                  t(
                    `$\\gcd(${a}, ${b}) = ${g}$, so every output $${a}m + ${b}n$ is a multiple of $${g}$.`,
                    `$\\gcd(${a}, ${b}) = ${g}$，所以每个输出 $${a}m + ${b}n$ 都是 $${g}$ 的倍数。`,
                  ),
                ],
                [
                  ["Decide", "判断"],
                  value
                    ? t(
                        `Since the gcd is $1$, some $${a}m_0 + ${b}n_0 = 1$, and then $g(km_0, kn_0) = k$ for every integer $k$: $g$ is onto.`,
                        `因为最大公约数是 $1$，存在 $${a}m_0 + ${b}n_0 = 1$，于是对每个整数 $k$，$g(km_0, kn_0) = k$：$g$ 是满射。`,
                      )
                    : t(
                        `$1$ is not a multiple of $${g}$, so $1$ is missed: $g$ is not onto.`,
                        `$1$ 不是 $${g}$ 的倍数，所以取不到 $1$：$g$ 不是满射。`,
                      ),
                ],
              ],
              value
                ? t(
                    `$m_0 = ${x0}$ and $n_0 = ${y0}$ work: $${a} \\cdot ${x0 < 0 ? `(${x0})` : x0} + ${b} \\cdot ${y0 < 0 ? `(${y0})` : y0} = ${a * x0} ${signed(b * y0).trim()} = 1$.`,
                    `$m_0 = ${x0}$，$n_0 = ${y0}$ 可行：$${a} \\cdot ${x0 < 0 ? `(${x0})` : x0} + ${b} \\cdot ${y0 < 0 ? `(${y0})` : y0} = ${a * x0} ${signed(b * y0).trim()} = 1$。`,
                  )
                : t(
                    `$${a} = ${g} \\cdot ${a / g}$ and $${b} = ${g} \\cdot ${b / g}$, so $${a}m + ${b}n = ${g}(${coef(a / g)}m + ${coef(b / g)}n)$.`,
                    `$${a} = ${g} \\cdot ${a / g}$，$${b} = ${g} \\cdot ${b / g}$，所以 $${a}m + ${b}n = ${g}(${coef(a / g)}m + ${coef(b / g)}n)$。`,
                  ),
            ),
          ),
          [
            value
              ? [
                  "No",
                  `$\\gcd(${a}, ${b}) = 1$, so $1$ is an output, and so is every multiple of it.`,
                  `$\\gcd(${a}, ${b}) = 1$，所以 $1$ 是输出，它的每个倍数也是。`,
                ]
              : ["Yes", `Every output is a multiple of $${g}$, so $1$ is never reached.`, `每个输出都是 $${g}$ 的倍数，所以取不到 $1$。`],
          ],
        );
      },
    },
  ],
};

/** factorial computes n! for small n. */
const factorial = (n: number) => range(1, n).reduce((x, y) => x * y, 1);

/** ClassifiedForm is a function on ℝ with its kind and the reasons for it. */
type ClassifiedForm = readonly [tex: string, kind: number, inj: Text, sur: Text, check: Text];

/** bijections combines injectivity and surjectivity. */
export const bijections: TopicDef = {
  id: "bijections",
  title: t("Bijections", "双射"),
  summary: t(
    "A bijection is a function that is both injective and surjective; it pairs the elements of two sets exactly and has an inverse.",
    "双射是既单又满的函数；它把两个集合的元素一一配对，并且有反函数。",
  ),
  intro: t(
    "The function $f: \\mathbb{R} \\to \\mathbb{R}$, $f(x) = 2x - 3$ is injective, since $2a - 3 = 2b - 3$ forces $a = b$, and surjective, since $f\\left(\\dfrac{y + 3}{2}\\right) = y$ for every $y$. So it is a bijection, and its inverse is $f^{-1}(y) = \\dfrac{y + 3}{2}$.\n\nCheck: $f(5) = 7$ and $f^{-1}(7) = \\dfrac{10}{2} = 5$, so the inverse undoes $f$.\n\nIn this lesson we classify functions as injective, surjective, both or neither, and count the bijections between finite sets.",
    "函数 $f: \\mathbb{R} \\to \\mathbb{R}$，$f(x) = 2x - 3$ 是单射，因为 $2a - 3 = 2b - 3$ 迫使 $a = b$；也是满射，因为对每个 $y$ 有 $f\\left(\\dfrac{y + 3}{2}\\right) = y$。所以它是双射，反函数是 $f^{-1}(y) = \\dfrac{y + 3}{2}$。\n\n检验：$f(5) = 7$，$f^{-1}(7) = \\dfrac{10}{2} = 5$，反函数确实撤销了 $f$。\n\n本课我们把函数分为单射、满射、双射或都不是，并统计有限集之间双射的个数。",
  ),
  prerequisites: ["proving-injectivity", "proving-surjectivity"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "classifying-functions",
      title: t("Classifying functions", "函数的分类"),
      explanation: t(
        "On $\\mathbb{R} \\to \\mathbb{R}$: $x^3$ is a bijection; $e^x$ is injective but not surjective; $x^3 - x$ is surjective but not injective; $x^2$ is neither.\n\n> **Watch out.** Decide the two properties separately. Being increasing gives injectivity but says nothing about reaching every value, and reaching every value says nothing about repeats.",
        "在 $\\mathbb{R} \\to \\mathbb{R}$ 上：$x^3$ 是双射；$e^x$ 是单射但不是满射；$x^3 - x$ 是满射但不是单射；$x^2$ 两者都不是。\n\n> **注意。** 两个性质要分别判断。递增保证单射，但不说明能取遍所有值；能取遍所有值，也不说明没有重复。",
      ),
      generate(rng) {
        const a = rng.int(1, 9);
        const b = rng.int(2, 9);
        const inc = t(
          "$f$ is strictly increasing, so different inputs give different outputs.",
          "$f$ 严格递增，所以不同的输入给出不同的输出。",
        );
        const forms: ClassifiedForm[] = [
          [
            `x^3${signed(a)}`,
            0,
            inc,
            t(`Every $y$ is $f(\\sqrt[3]{y - ${a}})$.`, `每个 $y$ 都等于 $f(\\sqrt[3]{y - ${a}})$。`),
            t(
              `$f(2) = ${8 + a}$, and $\\sqrt[3]{${8 + a} - ${a}} = 2$ leads back to it.`,
              `$f(2) = ${8 + a}$，而 $\\sqrt[3]{${8 + a} - ${a}} = 2$ 又回到了它。`,
            ),
          ],
          [
            `${b}x - ${a}`,
            0,
            inc,
            t(`Every $y$ is $f\\left(\\frac{y + ${a}}{${b}}\\right)$.`, `每个 $y$ 都等于 $f\\left(\\frac{y + ${a}}{${b}}\\right)$。`),
            t(
              `$f(1) = ${b - a}$, and $\\frac{${b - a} + ${a}}{${b}} = 1$ leads back to it.`,
              `$f(1) = ${b - a}$，而 $\\frac{${b - a} + ${a}}{${b}} = 1$ 又回到了它。`,
            ),
          ],
          [
            `e^x${signed(-a)}`,
            1,
            inc,
            t(`Outputs stay above $-${a}$, so $-${a}$ itself is missed.`, `输出都大于 $-${a}$，所以 $-${a}$ 本身取不到。`),
            t(`$e^x - ${a} = -${a}$ would need $e^x = 0$, which never happens.`, `$e^x - ${a} = -${a}$ 需要 $e^x = 0$，这不可能。`),
          ],
          [
            `\\arctan x`,
            1,
            inc,
            t(
              "Outputs lie strictly between $-\\frac{\\pi}{2}$ and $\\frac{\\pi}{2}$, so $2$ is missed.",
              "输出严格介于 $-\\frac{\\pi}{2}$ 与 $\\frac{\\pi}{2}$ 之间，所以取不到 $2$。",
            ),
            t(
              "$\\frac{\\pi}{2} \\approx 1.57 < 2$, so no input reaches $2$.",
              "$\\frac{\\pi}{2} \\approx 1.57 < 2$，所以没有输入能得到 $2$。",
            ),
          ],
          [
            `x^3 - ${a}x`,
            2,
            t(
              `$x^3 - ${a}x = x(x^2 - ${a})$ is $0$ at $x = 0$ and at $x = \\sqrt{${a}}$.`,
              `$x^3 - ${a}x = x(x^2 - ${a})$ 在 $x = 0$ 和 $x = \\sqrt{${a}}$ 处都为 $0$。`,
            ),
            t(
              "It is continuous and runs from $-\\infty$ to $\\infty$, so it takes every real value.",
              "它连续，且从 $-\\infty$ 变到 $\\infty$，所以取遍所有实数。",
            ),
            t(
              `$f(0) = 0$ and $f(\\sqrt{${a}}) = ${a}\\sqrt{${a}} - ${a}\\sqrt{${a}} = 0$.`,
              `$f(0) = 0$，$f(\\sqrt{${a}}) = ${a}\\sqrt{${a}} - ${a}\\sqrt{${a}} = 0$。`,
            ),
          ],
          [
            `x^2${signed(-a)}`,
            3,
            t("$f(-1) = f(1)$, so it is not injective.", "$f(-1) = f(1)$，所以不是单射。"),
            t(`Outputs are at least $-${a}$, so $-${a + 1}$ is missed.`, `输出至少为 $-${a}$，所以取不到 $-${a + 1}$。`),
            t(
              `$f(-1) = f(1) = ${1 - a}$, and $x^2 - ${a} = -${a + 1}$ would need $x^2 = -1$.`,
              `$f(-1) = f(1) = ${1 - a}$，而 $x^2 - ${a} = -${a + 1}$ 需要 $x^2 = -1$。`,
            ),
          ],
          [
            `|x - ${a}|`,
            3,
            t(`$f(${a - 1}) = f(${a + 1}) = 1$, so it is not injective.`, `$f(${a - 1}) = f(${a + 1}) = 1$，所以不是单射。`),
            t("Outputs are never negative, so $-1$ is missed.", "输出从不为负，所以取不到 $-1$。"),
            t(
              `$|${a - 1} - ${a}| = |${a + 1} - ${a}| = 1$, and an absolute value cannot equal $-1$.`,
              `$|${a - 1} - ${a}| = |${a + 1} - ${a}| = 1$，而绝对值不可能等于 $-1$。`,
            ),
          ],
          [
            `${b}^{x}`,
            1,
            inc,
            t("Outputs are positive, so $0$ is missed.", "输出都为正，所以取不到 $0$。"),
            t(
              `$${b}^x > 0$ for every $x$, for example $${b}^{-1} = \\frac{1}{${b}}$.`,
              `对每个 $x$ 都有 $${b}^x > 0$，例如 $${b}^{-1} = \\frac{1}{${b}}$。`,
            ),
          ],
          [
            `x^5 - ${a}x^3`,
            2,
            t(
              `$x^5 - ${a}x^3 = x^3(x^2 - ${a})$ is $0$ at $x = 0$ and at $x = \\sqrt{${a}}$.`,
              `$x^5 - ${a}x^3 = x^3(x^2 - ${a})$ 在 $x = 0$ 和 $x = \\sqrt{${a}}$ 处都为 $0$。`,
            ),
            t(
              "It is continuous and runs from $-\\infty$ to $\\infty$, so it takes every real value.",
              "它连续，且从 $-\\infty$ 变到 $\\infty$，所以取遍所有实数。",
            ),
            t(
              `$f(0) = 0$, and at $x = \\sqrt{${a}}$ the factor $x^2 - ${a}$ is $0$.`,
              `$f(0) = 0$，而在 $x = \\sqrt{${a}}$ 处因子 $x^2 - ${a}$ 为 $0$。`,
            ),
          ],
          [
            `\\cos x`,
            3,
            t("$\\cos 0 = \\cos 2\\pi = 1$, so it is not injective.", "$\\cos 0 = \\cos 2\\pi = 1$，所以不是单射。"),
            t("Outputs lie in $[-1, 1]$, so $2$ is missed.", "输出位于 $[-1, 1]$ 中，所以取不到 $2$。"),
            t(
              "$|\\cos x| \\le 1$ for every $x$, while $0 \\ne 2\\pi$ give the same value $1$.",
              "对每个 $x$ 都有 $|\\cos x| \\le 1$，而 $0 \\ne 2\\pi$ 给出相同的值 $1$。",
            ),
          ],
        ];
        const [f, kind, inj, sur, check] = rng.pick(forms);
        const options = [
          t("Bijective", "双射"),
          t("Injective but not surjective", "单射但非满射"),
          t("Surjective but not injective", "满射但非单射"),
          t("Neither injective nor surjective", "既非单射也非满射"),
        ];
        const isInj = kind < 2;
        const isSur = kind === 0 || kind === 2;
        return reasoned(
          oneOf(
            rng,
            t(
              `Classify $f: \\mathbb{R} \\to \\mathbb{R}$, $f(x) = ${f}$.`,
              `对 $f: \\mathbb{R} \\to \\mathbb{R}$，$f(x) = ${f}$ 进行分类。`,
            ),
            options[kind]!,
            options.filter((_, i) => i !== kind),
            walked(
              [
                [["Test injectivity", "判断是否为单射"], inj],
                [["Test surjectivity", "判断是否为满射"], sur],
                [["Combine", "合并"], t(`So $f$ is ${lower(options[kind]!.en)}.`, `所以 $f$ 是${options[kind]!["zh-CN"]}。`)],
              ],
              check,
            ),
          ),
          [0, 1, 2, 3]
            .filter((i) => i !== kind)
            .map((i): Reason => {
              const saysInj = i < 2;
              return saysInj !== isInj
                ? [
                    options[i]!.en,
                    isInj
                      ? "Different inputs always give different outputs here, so the function is injective."
                      : "Some output comes from two different inputs, so the function is not injective.",
                    isInj ? "这里不同的输入总给出不同的输出，所以函数是单射。" : "有的输出来自两个不同的输入，所以函数不是单射。",
                  ]
                : [
                    options[i]!.en,
                    isSur
                      ? "Every real number is reached as an output, so the function is surjective."
                      : "Some real numbers are never reached as outputs, so the function is not surjective.",
                    isSur ? "每个实数都能取到，所以函数是满射。" : "有些实数取不到，所以函数不是满射。",
                  ];
            }),
        );
      },
    },
    {
      id: "counting-bijections",
      title: t("Counting bijections", "统计双射个数"),
      explanation: t(
        "A bijection between two $n$-element sets is an arrangement of the outputs: $n!$ of them. If $k$ of the inputs have prescribed outputs, the rest can be paired in $(n - k)!$ ways.\n\n> **Watch out.** A fixed value uses up an input and an output at once, so the rest pair $n - k$ inputs with $n - k$ outputs. Powers such as $(n - k)^{n - k}$ allow repeated outputs and overcount.",
        "两个 $n$ 元集之间的双射就是输出的一个排列：共 $n!$ 个。若有 $k$ 个输入的输出已指定，其余部分有 $(n - k)!$ 种配对方式。\n\n> **注意。** 一个固定的值同时用掉一个输入和一个输出，所以剩下的是 $n - k$ 个输入与 $n - k$ 个输出配对。像 $(n - k)^{n - k}$ 这样的幂允许输出重复，会多算。",
      ),
      generate(rng) {
        const n = rng.int(3, 9);
        const k = rng.int(0, 3);
        const count = factorial(n - k);
        const falling = range(n - k + 1, n).reverse();
        const fallingValue = falling.reduce((x, y) => x * y, 1);
        return numberProblem({
          prompt:
            k === 0
              ? t(
                  `How many bijections are there from $\\{1, \\dots, ${n}\\}$ to itself?`,
                  `从 $\\{1, \\dots, ${n}\\}$ 到自身有多少个双射？`,
                )
              : t(
                  `How many bijections $f$ from $\\{1, \\dots, ${n}\\}$ to itself satisfy ${range(1, k)
                    .map((i) => `$f(${i}) = ${n + 1 - i}$`)
                    .join(k === 2 ? " and " : ", ")}?`,
                  `从 $\\{1, \\dots, ${n}\\}$ 到自身满足 ${range(1, k)
                    .map((i) => `$f(${i}) = ${n + 1 - i}$`)
                    .join("、")} 的双射 $f$ 有多少个？`,
                ),
          answer: count,
          wrong: [count + 1],
          mistakes: apart(count, [
            ...(k > 0 ? [why(factorial(n), "That ignores the fixed values.", "这忽略了已固定的值。")] : []),
            why(n ** (n - k), "That allows repeated outputs; a bijection uses each output once.", "这允许输出重复；双射每个输出只用一次。"),
            why((n - k) ** (n - k), "That allows repeated outputs among the remaining ones.", "这允许剩下的输出重复。"),
            why((n - k) ** 2, "That squares instead of taking a factorial.", "这是平方，而应该取阶乘。"),
          ]),
          solution: walked(
            [
              [
                k === 0 ? ["Choose the outputs in turn", "依次选输出"] : ["Remove the fixed pairs", "去掉固定的配对"],
                k === 0
                  ? t(
                      `$f(1)$ has $${n}$ choices, $f(2)$ then $${n - 1}$, and so on, since outputs may not repeat.`,
                      `$f(1)$ 有 $${n}$ 种选择，接着 $f(2)$ 有 $${n - 1}$ 种，依此类推，因为输出不能重复。`,
                    )
                  : t(
                      `The fixed values use up $${k}$ inputs and $${k}$ outputs, leaving $${n - k}$ inputs to pair with $${n - k}$ outputs.`,
                      `固定的值用掉了 $${k}$ 个输入和 $${k}$ 个输出，剩下 $${n - k}$ 个输入与 $${n - k}$ 个输出配对。`,
                    ),
              ],
              [["Count the arrangements", "数排列"], t(`$${n - k}! = ${count}$.`, `$${n - k}! = ${count}$。`)],
            ],
            k === 0
              ? t(
                  `$${n}! = ${n} \\cdot ${n - 1}!$: the image of $1$ has $${n}$ choices, and each leaves $${n - 1}! = ${factorial(n - 1)}$ bijections of the rest, $${n} \\cdot ${factorial(n - 1)} = ${count}$.`,
                  `$${n}! = ${n} \\cdot ${n - 1}!$：$1$ 的像有 $${n}$ 种选择，每种选择后其余部分有 $${n - 1}! = ${factorial(n - 1)}$ 个双射，$${n} \\cdot ${factorial(n - 1)} = ${count}$。`,
                )
              : t(
                  `Among all $${n}! = ${factorial(n)}$ bijections, the values of $${range(1, k).join(", ")}$ can be chosen in $${falling.join(" \\cdot ")} = ${fallingValue}$ equally common ways, and $\\dfrac{${factorial(n)}}{${fallingValue}} = ${count}$.`,
                  `在全部 $${n}! = ${factorial(n)}$ 个双射中，$${range(1, k).join(", ")}$ 的值有 $${falling.join(" \\cdot ")} = ${fallingValue}$ 种同样常见的选法，而 $\\dfrac{${factorial(n)}}{${fallingValue}} = ${count}$。`,
                ),
          ),
        });
      },
    },
  ],
};

/** theFloorAndCeilingFunctions rounds real numbers down and up. */
export const theFloorAndCeilingFunctions: TopicDef = {
  id: "the-floor-and-ceiling-functions",
  title: t("The Floor and Ceiling Functions", "取整函数"),
  summary: t("⌊x⌋ is the greatest integer ≤ x and ⌈x⌉ the least integer ≥ x.", "⌊x⌋ 是不超过 x 的最大整数，⌈x⌉ 是不小于 x 的最小整数。"),
  intro: t(
    "$\\lfloor x \\rfloor$ is the greatest integer at most $x$, and $\\lceil x \\rceil$ the least integer at least $x$. So $\\lfloor 4.6 \\rfloor = 4$ and $\\lceil 4.6 \\rceil = 5$, while $\\lfloor -1.2 \\rfloor = -2$, because $-2$ is the greatest integer below $-1.2$, and $\\lceil -1.2 \\rceil = -1$.\n\nCheck: each value is on the correct side of $x$ and less than $1$ away: $-2 \\le -1.2 < -1$, and $-2 < -1.2 \\le -1$.\n\nIn this lesson we evaluate floors and ceilings, and solve equations that involve them.",
    "$\\lfloor x \\rfloor$ 是不超过 $x$ 的最大整数，$\\lceil x \\rceil$ 是不小于 $x$ 的最小整数。所以 $\\lfloor 4.6 \\rfloor = 4$，$\\lceil 4.6 \\rceil = 5$；而 $\\lfloor -1.2 \\rfloor = -2$，因为 $-2$ 是小于 $-1.2$ 的最大整数，$\\lceil -1.2 \\rceil = -1$。\n\n检验：每个值都在 $x$ 的正确一侧，且距离小于 $1$：$-2 \\le -1.2 < -1$，$-2 < -1.2 \\le -1$。\n\n本课我们计算下取整与上取整，并解含有它们的方程。",
  ),
  prerequisites: ["introduction-to-functions"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "evaluating-floor-and-ceiling",
      title: t("Evaluating floor and ceiling", "计算取整"),
      explanation: t(
        "The floor rounds down to the nearest integer and the ceiling rounds up, so for negative numbers the floor moves further from zero. $\\lfloor 3.7 \\rfloor = 3$, $\\lceil 3.2 \\rceil = 4$, $\\lfloor -2.5 \\rfloor = -3$ and $\\lceil -2.5 \\rceil = -2$. For an integer $n$, $\\lfloor n \\rfloor = \\lceil n \\rceil = n$.\n\n> **Watch out.** The floor is not truncation. For a negative number, dropping the decimals rounds toward $0$, which is up: $\\lfloor -2.5 \\rfloor = -3$, not $-2$.",
        "下取整向下取到最近的整数，上取整向上取，所以对于负数，下取整会离零更远。$\\lfloor 3.7 \\rfloor = 3$，$\\lceil 3.2 \\rceil = 4$，$\\lfloor -2.5 \\rfloor = -3$，$\\lceil -2.5 \\rceil = -2$。对整数 $n$，$\\lfloor n \\rfloor = \\lceil n \\rceil = n$。\n\n> **注意。** 下取整不是截尾。对负数而言，去掉小数部分是向 $0$ 取，也就是向上取：$\\lfloor -2.5 \\rfloor = -3$，不是 $-2$。",
      ),
      generate(rng) {
        const a0 = rng.int(-40, 40);
        const b = rng.int(2, 9);
        const c0 = rng.int(-40, 40);
        const d = rng.int(2, 9);
        // Neither fraction is a whole number, so that the rounding matters.
        const a = a0 % b === 0 ? a0 + 1 : a0;
        const c = c0 % d === 0 ? c0 + 1 : c0;
        const fl = Math.floor(a / b);
        const ce = Math.ceil(c / d);
        const value = fl + ce;
        return numberProblem({
          prompt: t(
            `Compute $\\left\\lfloor \\dfrac{${a}}{${b}} \\right\\rfloor + \\left\\lceil \\dfrac{${c}}{${d}} \\right\\rceil$.`,
            `计算 $\\left\\lfloor \\dfrac{${a}}{${b}} \\right\\rfloor + \\left\\lceil \\dfrac{${c}}{${d}} \\right\\rceil$。`,
          ),
          answer: value,
          wrong: [value + 1],
          mistakes: apart(value, [
            why(
              Math.trunc(a / b) + Math.trunc(c / d),
              "That drops the decimals; for a negative number the floor rounds down and for a positive one the ceiling rounds up.",
              "这是直接去掉小数；负数的下取整要向下取，正数的上取整要向上取。",
            ),
            why(Math.ceil(a / b) + Math.floor(c / d), "That swaps floor and ceiling.", "这把下取整和上取整弄反了。"),
            why(
              Math.round(a / b + c / d),
              "That rounds to the nearest integer; floor and ceiling each round in a fixed direction.",
              "这是四舍五入；下取整和上取整各自朝固定方向取。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Locate the first fraction", "确定第一个分数的位置"],
                t(
                  `$\\dfrac{${a}}{${b}} \\approx ${+(a / b).toFixed(3)}$ lies between $${fl}$ and $${fl + 1}$, so its floor is $${fl}$.`,
                  `$\\dfrac{${a}}{${b}} \\approx ${+(a / b).toFixed(3)}$ 位于 $${fl}$ 与 $${fl + 1}$ 之间，所以下取整是 $${fl}$。`,
                ),
              ],
              [
                ["Locate the second fraction", "确定第二个分数的位置"],
                t(
                  `$\\dfrac{${c}}{${d}} \\approx ${+(c / d).toFixed(3)}$ lies between $${ce - 1}$ and $${ce}$, so its ceiling is $${ce}$.`,
                  `$\\dfrac{${c}}{${d}} \\approx ${+(c / d).toFixed(3)}$ 位于 $${ce - 1}$ 与 $${ce}$ 之间，所以上取整是 $${ce}$。`,
                ),
              ],
              [
                ["Add", "相加"],
                t(`$${fl} ${signed(ce).trim() || "+ 0"} = ${value}$.`, `$${fl} ${signed(ce).trim() || "+ 0"} = ${value}$。`),
              ],
            ],
            t(
              `Multiplying out: $${b} \\cdot ${fl < 0 ? `(${fl})` : fl} = ${b * fl} \\le ${a} < ${b * (fl + 1)}$, and $${d} \\cdot ${ce - 1 < 0 ? `(${ce - 1})` : ce - 1} = ${d * (ce - 1)} < ${c} \\le ${d * ce}$.`,
              `乘回去验证：$${b} \\cdot ${fl < 0 ? `(${fl})` : fl} = ${b * fl} \\le ${a} < ${b * (fl + 1)}$，$${d} \\cdot ${ce - 1 < 0 ? `(${ce - 1})` : ce - 1} = ${d * (ce - 1)} < ${c} \\le ${d * ce}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "solving-floor-equations",
      title: t("Solving floor equations", "解取整方程"),
      explanation: t(
        "Saying that the floor of a number is an integer means the number lies in a half open interval starting at that integer, which turns the equation into inequalities. $\\lfloor x \\rfloor = m$ means $m \\le x < m + 1$. So $\\left\\lfloor \\dfrac{n}{4} \\right\\rfloor = 5$ means $20 \\le n < 24$: four integers. $\\lfloor \\sqrt{n} \\rfloor = 3$ means $9 \\le n < 16$: seven integers. Likewise, $\\lceil x \\rceil = m$ means $m - 1 < x \\le m$.\n\n> **Watch out.** $\\lfloor x \\rfloor = m$ includes $x = m$ but excludes $x = m + 1$. Closing the wrong end gains or loses one integer.",
        "说一个数的下取整等于某个整数，就是说这个数位于从该整数开始的半开区间内，这把方程化为不等式。$\\lfloor x \\rfloor = m$ 表示 $m \\le x < m + 1$。所以 $\\left\\lfloor \\dfrac{n}{4} \\right\\rfloor = 5$ 表示 $20 \\le n < 24$：四个整数。$\\lfloor \\sqrt{n} \\rfloor = 3$ 表示 $9 \\le n < 16$：七个整数。同样，$\\lceil x \\rceil = m$ 表示 $m - 1 < x \\le m$。\n\n> **注意。** $\\lfloor x \\rfloor = m$ 包含 $x = m$，但不包含 $x = m + 1$。端点开闭弄错，就会多一个或少一个整数。",
      ),
      generate(rng) {
        const m = rng.int(2, 12);
        const kind = rng.int(0, 2);
        const k = rng.int(2, 9);
        const c = rng.int(1, 9);
        let tex: string;
        let means: string;
        let solve: Text;
        let lo: number;
        let hi: number;
        if (kind === 0) {
          tex = `\\left\\lfloor \\dfrac{n${signed(c)}}{${k}} \\right\\rfloor = ${m}`;
          means = `${m} \\le \\dfrac{n${signed(c)}}{${k}} < ${m + 1}`;
          lo = m * k - c;
          hi = (m + 1) * k - c - 1;
          solve = t(
            `Multiply by $${k}$: $${m * k} \\le n + ${c} < ${(m + 1) * k}$, so $${lo} \\le n < ${hi + 1}$.`,
            `乘以 $${k}$：$${m * k} \\le n + ${c} < ${(m + 1) * k}$，所以 $${lo} \\le n < ${hi + 1}$。`,
          );
        } else if (kind === 1) {
          tex = `\\lfloor \\sqrt{n} \\rfloor = ${m}`;
          means = `${m} \\le \\sqrt{n} < ${m + 1}`;
          lo = m * m;
          hi = (m + 1) ** 2 - 1;
          solve = t(`Square: $${lo} \\le n < ${hi + 1}$.`, `平方：$${lo} \\le n < ${hi + 1}$。`);
        } else {
          tex = `\\left\\lceil \\dfrac{n}{${k}} \\right\\rceil = ${m}`;
          means = `${m - 1} < \\dfrac{n}{${k}} \\le ${m}`;
          lo = (m - 1) * k + 1;
          hi = m * k;
          solve = t(
            `Multiply by $${k}$: $${(m - 1) * k} < n \\le ${hi}$, so $${lo} \\le n \\le ${hi}$.`,
            `乘以 $${k}$：$${(m - 1) * k} < n \\le ${hi}$，所以 $${lo} \\le n \\le ${hi}$。`,
          );
        }
        const count = hi - lo + 1;
        const first: [[string, string], Text] = [
          ["Turn the equation into inequalities", "把方程化为不等式"],
          t(`$${means}$.`, `$${means}$。`),
        ];
        const second: [[string, string], Text] = [["Solve for $n$", "解出 $n$"], solve];
        // With a linear fraction the count is always the denominator, so those ask for an end of the range.
        if (kind === 1)
          return numberProblem({
            prompt: t(`How many integers $n$ satisfy $${tex}$?`, `有多少个整数 $n$ 满足 $${tex}$？`),
            answer: count,
            wrong: [m],
            mistakes: apart(count, [
              why(
                count + 1,
                `That counts $n = ${hi + 1}$ too, but there $\\sqrt{n} = ${m + 1}$.`,
                `这把 $n = ${hi + 1}$ 也算进去了，但那里 $\\sqrt{n} = ${m + 1}$。`,
              ),
              why(
                count - 1,
                `That leaves out $n = ${lo}$, where $\\sqrt{n} = ${m}$ exactly, which counts.`,
                `这漏掉了 $n = ${lo}$，那里 $\\sqrt{n}$ 恰好等于 $${m}$，应当计入。`,
              ),
            ]),
            solution: walked(
              [
                first,
                second,
                [
                  ["Count", "计数"],
                  t(
                    `From $${lo}$ to $${hi}$ there are $${hi} - ${lo} + 1 = ${count}$ integers.`,
                    `从 $${lo}$ 到 $${hi}$ 共有 $${hi} - ${lo} + 1 = ${count}$ 个整数。`,
                  ),
                ],
              ],
              t(
                `$\\sqrt{${lo}} = ${m}$ and $\\sqrt{${hi}} \\approx ${+Math.sqrt(hi).toFixed(3)}$ both have floor $${m}$, while $\\sqrt{${hi + 1}} = ${m + 1}$ and $\\sqrt{${lo - 1}} \\approx ${+Math.sqrt(lo - 1).toFixed(3)}$ do not.`,
                `$\\sqrt{${lo}} = ${m}$ 与 $\\sqrt{${hi}} \\approx ${+Math.sqrt(hi).toFixed(3)}$ 的下取整都是 $${m}$，而 $\\sqrt{${hi + 1}} = ${m + 1}$ 与 $\\sqrt{${lo - 1}} \\approx ${+Math.sqrt(lo - 1).toFixed(3)}$ 不是。`,
              ),
            ),
          });
        const largest = kind === 0;
        const answer = largest ? hi : lo;
        return numberProblem({
          prompt: largest
            ? t(`What is the largest integer $n$ that satisfies $${tex}$?`, `满足 $${tex}$ 的最大整数 $n$ 是多少？`)
            : t(`What is the smallest integer $n$ that satisfies $${tex}$?`, `满足 $${tex}$ 的最小整数 $n$ 是多少？`),
          answer,
          wrong: largest ? [hi - 1] : [lo + 1],
          mistakes: apart(
            answer,
            largest
              ? [
                  why(
                    hi + 1,
                    `At $n = ${hi + 1}$ the fraction is exactly $${m + 1}$, so the floor is already $${m + 1}$.`,
                    `在 $n = ${hi + 1}$ 处分数恰好等于 $${m + 1}$，下取整已经是 $${m + 1}$。`,
                  ),
                  why(lo, "That is the smallest solution, not the largest.", "这是最小的解，不是最大的。"),
                  why(
                    (m + 1) * k,
                    `That is the excluded bound for $n + ${c}$, not the largest $n$.`,
                    `这是 $n + ${c}$ 被排除的界，不是最大的 $n$。`,
                  ),
                ]
              : [
                  why(
                    lo - 1,
                    `At $n = ${lo - 1}$ the fraction is exactly $${m - 1}$, so the ceiling is $${m - 1}$.`,
                    `在 $n = ${lo - 1}$ 处分数恰好等于 $${m - 1}$，上取整是 $${m - 1}$。`,
                  ),
                  why(hi, "That is the largest solution, not the smallest.", "这是最大的解，不是最小的。"),
                ],
          ),
          solution: walked(
            [
              first,
              second,
              [
                [largest ? "Take the largest" : "Take the smallest", largest ? "取最大值" : "取最小值"],
                t(`$n = ${answer}$.`, `$n = ${answer}$。`),
              ],
            ],
            largest
              ? t(
                  `$\\dfrac{${hi} + ${c}}{${k}} = \\dfrac{${hi + c}}{${k}} \\approx ${+((hi + c) / k).toFixed(3)}$ has floor $${m}$, while $\\dfrac{${hi + 1 + c}}{${k}} = ${m + 1}$.`,
                  `$\\dfrac{${hi} + ${c}}{${k}} = \\dfrac{${hi + c}}{${k}} \\approx ${+((hi + c) / k).toFixed(3)}$ 的下取整是 $${m}$，而 $\\dfrac{${hi + 1 + c}}{${k}} = ${m + 1}$。`,
                )
              : t(
                  `$\\dfrac{${lo}}{${k}} \\approx ${+(lo / k).toFixed(3)}$ has ceiling $${m}$, while $\\dfrac{${lo - 1}}{${k}} = ${m - 1}$.`,
                  `$\\dfrac{${lo}}{${k}} \\approx ${+(lo / k).toFixed(3)}$ 的上取整是 $${m}$，而 $\\dfrac{${lo - 1}}{${k}} = ${m - 1}$。`,
                ),
          ),
        });
      },
    },
  ],
};

/** fracTex writes p/q in lowest terms, as an integer when it is one. */
function fracTex(p: number, q: number): string {
  const g = gcd(Math.abs(p), Math.abs(q));
  const [a, b] = [p / g, q / g];
  return b === 1 ? `${a}` : `${a < 0 ? "-" : ""}\\tfrac{${Math.abs(a)}}{${b}}`;
}

/** discreteInfiniteSetsWithEqualCardinality builds bijections between countable sets. */
export const discreteInfiniteSetsWithEqualCardinality: TopicDef = {
  id: "discrete-infinite-sets-with-equal-cardinality",
  title: t("Discrete Infinite Sets with Equal Cardinality", "等势的离散无限集"),
  summary: t(
    "Sets have equal cardinality when a bijection exists between them; ℕ, the even numbers and ℤ all have the same cardinality.",
    "两个集合之间存在双射时它们等势；ℕ、偶数集与 ℤ 的基数都相同。",
  ),
  intro: t(
    "The function $f(n) = 2n$ pairs each natural number $n = 0, 1, 2, \\dots$ with the even number $2n$. Different $n$ give different even numbers, and every even number $2m$ is $f(m)$, so $f$ is a bijection. The even numbers therefore have the same cardinality as $\\mathbb{N}$, although they are a proper subset of it.\n\nCheck: $f(7) = 14$, and the even number $14$ comes back from $n = \\dfrac{14}{2} = 7$ and from no other $n$.\n\nIn this lesson we build bijections from $\\mathbb{N}$ onto arithmetic progressions and onto $\\mathbb{Z}$.",
    "函数 $f(n) = 2n$ 把每个自然数 $n = 0, 1, 2, \\dots$ 与偶数 $2n$ 配对。不同的 $n$ 给出不同的偶数，而每个偶数 $2m$ 都等于 $f(m)$，所以 $f$ 是双射。因此偶数集与 $\\mathbb{N}$ 等势，尽管它是 $\\mathbb{N}$ 的真子集。\n\n检验：$f(7) = 14$，而偶数 $14$ 只由 $n = \\dfrac{14}{2} = 7$ 得到，没有别的 $n$。\n\n本课我们构造从 $\\mathbb{N}$ 到等差数列以及到 $\\mathbb{Z}$ 的双射。",
  ),
  prerequisites: ["bijections", "cardinality-of-finite-sets"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "bijections-onto-arithmetic-progressions",
      title: t("Bijections onto progressions", "到等差数列的双射"),
      explanation: t(
        "A linear function matches the natural numbers one to one with an arithmetic progression, showing an infinite set can match a proper subset. $f(n) = 3n + 2$ is a bijection from $\\mathbb{N} = \\{0, 1, 2, \\dots\\}$ onto $\\{2, 5, 8, \\dots\\}$, so this proper subset of $\\mathbb{N}$ has the same cardinality as $\\mathbb{N}$.\n\n> **Watch out.** Match the starting value as well as the step. A function with the right step whose $f(0)$ lies past the first element never reaches that element, so it is injective but not onto.",
        "一个线性函数把自然数与一个等差数列一一对应起来，这表明无限集可以与它的真子集一一对应。$f(n) = 3n + 2$ 是从 $\\mathbb{N} = \\{0, 1, 2, \\dots\\}$ 到 $\\{2, 5, 8, \\dots\\}$ 的双射，所以 $\\mathbb{N}$ 的这个真子集与 $\\mathbb{N}$ 等势。\n\n> **注意。** 既要对齐公差，也要对齐首项。公差正确、但 $f(0)$ 落在第一个元素之后的函数永远取不到那个元素，所以它是单射而不是满射。",
      ),
      generate(rng) {
        const k = rng.int(2, 9);
        const c = rng.int(0, 12);
        const set = `\\{${c}, ${c + k}, ${c + 2 * k}, \\dots\\}`;
        const late = math(`f(n) = ${k}n${signed(c + k)}`);
        const step = math(`f(n) = ${k + 1}n${signed(c)}`);
        const square = math(`f(n) = ${k}n^2${signed(c)}`);
        return reasoned(
          oneOf(
            rng,
            t(
              `Which function is a bijection from $\\mathbb{N} = \\{0, 1, 2, \\dots\\}$ onto $${set}$?`,
              `哪个函数是从 $\\mathbb{N} = \\{0, 1, 2, \\dots\\}$ 到 $${set}$ 的双射？`,
            ),
            math(`f(n) = ${k}n${signed(c)}`),
            [late, step, square],
            walked(
              [
                [
                  ["Match the start", "对齐首项"],
                  t(`$f(0) = ${c}$, the first element of the set.`, `$f(0) = ${c}$，正是集合的第一个元素。`),
                ],
                [
                  ["Match the step", "对齐公差"],
                  t(
                    `$f(n + 1) - f(n) = ${k}$, the gap between neighbouring elements, so the outputs run through $${c}, ${c + k}, ${c + 2 * k}, \\dots$ in order, each element exactly once.`,
                    `$f(n + 1) - f(n) = ${k}$，等于相邻元素之差，所以输出依次取遍 $${c}, ${c + k}, ${c + 2 * k}, \\dots$，每个元素恰好一次。`,
                  ),
                ],
              ],
              t(
                `The element $${c + 3 * k}$ comes back from $n = \\dfrac{${c + 3 * k} - ${c}}{${k}} = 3$, and $f(3) = ${3 * k} + ${c} = ${c + 3 * k}$.`,
                `元素 $${c + 3 * k}$ 由 $n = \\dfrac{${c + 3 * k} - ${c}}{${k}} = 3$ 得到，而 $f(3) = ${3 * k} + ${c} = ${c + 3 * k}$。`,
              ),
            ),
          ),
          [
            [
              late.en,
              `Here $f(0) = ${c + k}$, so the first element $${c}$ is never reached.`,
              `这里 $f(0) = ${c + k}$，所以取不到第一个元素 $${c}$。`,
            ],
            [
              step.en,
              `Consecutive outputs here differ by $${k + 1}$, but the elements of the set differ by $${k}$, so $${c + k}$ is skipped.`,
              `这里相邻输出相差 $${k + 1}$，而集合中相邻元素相差 $${k}$，所以跳过了 $${c + k}$。`,
            ],
            [
              square.en,
              `The squares skip elements: $${c + 2 * k}$ is in the set, but no $n$ gives it.`,
              `平方会跳过元素：$${c + 2 * k}$ 在集合中，却没有 $n$ 能得到它。`,
            ],
          ],
        );
      },
    },
    {
      id: "a-bijection-from-naturals-to-integers",
      title: t("$\\mathbb{N}$ and $\\mathbb{Z}$", "$\\mathbb{N}$ 与 $\\mathbb{Z}$"),
      explanation: t(
        "Listing the integers alternately on each side of zero pairs every natural number with exactly one integer, so both sets have the same size. List $\\mathbb{Z}$ as $0, -1, 1, -2, 2, \\dots$: $f(n) = \\dfrac{n}{2}$ for even $n$ and $f(n) = -\\dfrac{n + 1}{2}$ for odd $n$ is a bijection $\\mathbb{N} \\to \\mathbb{Z}$. For example $f(7) = -4$ and $f(8) = 4$.\n\n> **Watch out.** Even inputs give the integers $\\ge 0$ and odd inputs the negative ones. Going back, a positive $z$ comes from the even input $2z$, and a negative $z$ from the odd input $-2z - 1$, not from $2|z|$.",
        "把整数在零的两侧交替列出，就把每个自然数与恰好一个整数配对，所以这两个集合大小相同。把 $\\mathbb{Z}$ 排成 $0, -1, 1, -2, 2, \\dots$：$n$ 为偶数时 $f(n) = \\dfrac{n}{2}$，$n$ 为奇数时 $f(n) = -\\dfrac{n + 1}{2}$，这是 $\\mathbb{N} \\to \\mathbb{Z}$ 的双射。例如 $f(7) = -4$，$f(8) = 4$。\n\n> **注意。** 偶数输入给出 $\\ge 0$ 的整数，奇数输入给出负整数。反过来，正的 $z$ 来自偶数输入 $2z$，负的 $z$ 来自奇数输入 $-2z - 1$，而不是 $2|z|$。",
      ),
      generate(rng) {
        const inverse = rng.bool();
        const def = "f(n) = \\begin{cases} n/2 & n \\text{ even} \\\\ -(n + 1)/2 & n \\text{ odd} \\end{cases}";
        if (!inverse) {
          const n = rng.int(1, 99);
          const even = n % 2 === 0;
          const v = even ? n / 2 : -(n + 1) / 2;
          return numberProblem({
            prompt: t(
              `Let $${def}$ on $\\mathbb{N} = \\{0, 1, 2, \\dots\\}$. Find $f(${n})$.`,
              `设 $\\mathbb{N} = \\{0, 1, 2, \\dots\\}$ 上的 $${def}$。求 $f(${n})$。`,
            ),
            answer: v,
            wrong: [v + 1],
            mistakes: apart(v, [
              even
                ? why(-v, "That uses the odd rule, but the input is even.", "这用了奇数的规则，但输入是偶数。")
                : why(-v, "That drops the minus sign: odd inputs go to negative integers.", "这丢了负号：奇数输入对应负整数。"),
              ...(even
                ? []
                : [why(-(n - 1) / 2, "That uses $n - 1$ where the rule has $n + 1$.", "这里用了 $n - 1$，而规则中是 $n + 1$。")]),
              why(n, "That is the input itself; apply the rule for its parity.", "这是输入本身；要按奇偶性使用规则。"),
            ]),
            solution: walked(
              [
                [
                  ["Find the parity", "判断奇偶"],
                  t(
                    `$${n}$ is ${even ? "even, so $f(n) = n/2$" : "odd, so $f(n) = -(n + 1)/2$"} applies.`,
                    `$${n}$ 是${even ? "偶数，所以用 $f(n) = n/2$" : "奇数，所以用 $f(n) = -(n + 1)/2$"}。`,
                  ),
                ],
                [
                  ["Apply the rule", "代入规则"],
                  t(
                    even ? `$f(${n}) = \\dfrac{${n}}{2} = ${v}$.` : `$f(${n}) = -\\dfrac{${n} + 1}{2} = ${v}$.`,
                    even ? `$f(${n}) = \\dfrac{${n}}{2} = ${v}$。` : `$f(${n}) = -\\dfrac{${n} + 1}{2} = ${v}$。`,
                  ),
                ],
              ],
              even
                ? t(
                    `Going back, the value $${v} > 0$ comes from the even input $2 \\cdot ${v} = ${n}$.`,
                    `反过来，值 $${v} > 0$ 来自偶数输入 $2 \\cdot ${v} = ${n}$。`,
                  )
                : t(
                    `Going back, the negative value $${v}$ comes from the odd input $-2 \\cdot (${v}) - 1 = ${n}$.`,
                    `反过来，负值 $${v}$ 来自奇数输入 $-2 \\cdot (${v}) - 1 = ${n}$。`,
                  ),
            ),
          });
        }
        const z = rng.int(1, 50) * (rng.bool() ? 1 : -1);
        const n = z > 0 ? 2 * z : -2 * z - 1;
        return numberProblem({
          prompt: t(
            `Let $${def}$ on $\\mathbb{N} = \\{0, 1, 2, \\dots\\}$. Find the $n$ with $f(n) = ${z}$.`,
            `设 $\\mathbb{N} = \\{0, 1, 2, \\dots\\}$ 上的 $${def}$。求满足 $f(n) = ${z}$ 的 $n$。`,
          ),
          answer: n,
          wrong: [n + 2],
          mistakes: apart(
            n,
            z > 0
              ? [
                  why(
                    2 * z + 1,
                    "An odd input gives a negative value; a positive value comes from an even input.",
                    "奇数输入给出负值；正值来自偶数输入。",
                  ),
                  why(
                    2 * z - 1,
                    "An odd input gives a negative value; a positive value comes from an even input.",
                    "奇数输入给出负值；正值来自偶数输入。",
                  ),
                  why(
                    z,
                    "The list alternates between the two sides of zero, so the input is about twice the size of the value.",
                    "列表在零的两侧交替，所以输入大约是值的两倍。",
                  ),
                ]
              : [
                  why(
                    -2 * z,
                    "An even input gives a value $\\ge 0$; a negative value comes from an odd input.",
                    "偶数输入给出 $\\ge 0$ 的值；负值来自奇数输入。",
                  ),
                  why(
                    -2 * z + 1,
                    "Solve $-\\dfrac{n + 1}{2} = z$ carefully: the $+1$ moves across as $-1$.",
                    "仔细解 $-\\dfrac{n + 1}{2} = z$：$+1$ 移项后变成 $-1$。",
                  ),
                  why(
                    -z,
                    "The list alternates between the two sides of zero, so the input is about twice the size of the value.",
                    "列表在零的两侧交替，所以输入大约是值的两倍。",
                  ),
                ],
          ),
          solution: walked(
            [
              [
                ["Pick the rule", "选择规则"],
                z > 0
                  ? t(
                      `$${z}$ is positive, so it comes from an even $n$ with $\\dfrac{n}{2} = ${z}$.`,
                      `$${z}$ 是正数，所以来自满足 $\\dfrac{n}{2} = ${z}$ 的偶数 $n$。`,
                    )
                  : t(
                      `$${z}$ is negative, so it comes from an odd $n$ with $-\\dfrac{n + 1}{2} = ${z}$.`,
                      `$${z}$ 是负数，所以来自满足 $-\\dfrac{n + 1}{2} = ${z}$ 的奇数 $n$。`,
                    ),
              ],
              [
                ["Solve", "求解"],
                z > 0
                  ? t(`$n = 2 \\cdot ${z} = ${n}$.`, `$n = 2 \\cdot ${z} = ${n}$。`)
                  : t(`$n + 1 = ${-2 * z}$, so $n = ${n}$.`, `$n + 1 = ${-2 * z}$，所以 $n = ${n}$。`),
              ],
            ],
            z > 0
              ? t(`$${n}$ is even and $\\dfrac{${n}}{2} = ${z}$.`, `$${n}$ 是偶数，且 $\\dfrac{${n}}{2} = ${z}$。`)
              : t(`$${n}$ is odd and $-\\dfrac{${n} + 1}{2} = ${z}$.`, `$${n}$ 是奇数，且 $-\\dfrac{${n} + 1}{2} = ${z}$。`),
          ),
        });
      },
    },
  ],
};

/** continuousInfiniteSetsWithEqualCardinality builds bijections between intervals. */
export const continuousInfiniteSetsWithEqualCardinality: TopicDef = {
  id: "continuous-infinite-sets-with-equal-cardinality",
  title: t("Continuous Infinite Sets with Equal Cardinality", "等势的连续无限集"),
  summary: t(
    "Any two open intervals have equal cardinality via a linear map, and an open interval has the cardinality of ℝ.",
    "任意两个开区间通过线性映射等势，开区间与 ℝ 等势。",
  ),
  intro: t(
    "To match $(0, 1)$ with $(2, 8)$, stretch by the ratio of the lengths, $\\dfrac{8 - 2}{1 - 0} = 6$, and shift so that $0 \\mapsto 2$: $f(x) = 2 + 6x$. It is increasing, sends $0 \\mapsto 2$ and $1 \\mapsto 8$, and every $y$ in $(2, 8)$ comes from $x = \\dfrac{y - 2}{6}$ in $(0, 1)$. So the two intervals have the same cardinality, although one is six times as long.\n\nCheck: the midpoint $x = \\tfrac{1}{2}$ goes to $2 + 3 = 5$, the midpoint of $(2, 8)$.\n\nIn this lesson we build linear bijections between intervals, and bijections from bounded intervals onto unbounded sets.",
    "要把 $(0, 1)$ 与 $(2, 8)$ 配对，按长度之比 $\\dfrac{8 - 2}{1 - 0} = 6$ 伸缩，再平移使 $0 \\mapsto 2$：$f(x) = 2 + 6x$。它递增，$0 \\mapsto 2$，$1 \\mapsto 8$，而 $(2, 8)$ 中每个 $y$ 都来自 $(0, 1)$ 中的 $x = \\dfrac{y - 2}{6}$。所以这两个区间等势，尽管一个的长度是另一个的六倍。\n\n检验：中点 $x = \\tfrac{1}{2}$ 映到 $2 + 3 = 5$，正是 $(2, 8)$ 的中点。\n\n本课我们构造区间之间的线性双射，以及从有界区间到无界集合的双射。",
  ),
  prerequisites: ["bijections", "interval-notation"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "linear-bijections-between-intervals",
      title: t("Linear bijections between intervals", "区间之间的线性双射"),
      explanation: t(
        "A straight line through the matching endpoints stretches and shifts one interval onto another, so any two open intervals have the same size. $f(x) = c + \\dfrac{d - c}{b - a}(x - a)$ maps $(a, b)$ bijectively onto $(c, d)$: it is linear, sends $a \\mapsto c$ and $b \\mapsto d$. From $(0, 2)$ onto $(3, 9)$: $f(x) = 3 + 3x$.\n\n> **Watch out.** The slope multiplies $x - a$, the distance from the left end, not $x$ itself. Writing $c + \\dfrac{d - c}{b - a}x$ only works when $a = 0$.",
        "经过对应端点的直线把一个区间伸缩、平移到另一个区间上，所以任意两个开区间大小相同。$f(x) = c + \\dfrac{d - c}{b - a}(x - a)$ 把 $(a, b)$ 双射到 $(c, d)$ 上：它是线性的，且 $a \\mapsto c$，$b \\mapsto d$。从 $(0, 2)$ 到 $(3, 9)$：$f(x) = 3 + 3x$。\n\n> **注意。** 斜率乘的是 $x - a$，即到左端点的距离，而不是 $x$ 本身。写成 $c + \\dfrac{d - c}{b - a}x$ 只在 $a = 0$ 时成立。",
      ),
      generate(rng) {
        const a = rng.int(-5, 5);
        const len = rng.int(1, 4);
        const b = a + len;
        const c = rng.int(-10, 10);
        const slope = rng.int(2, 5);
        const d = c + slope * len;
        const j = rng.int(1, slope * len - 1);
        const num = a * slope + j;
        const x0 = fracTex(num, slope);
        const y0 = c + j;
        const map = a === 0 ? `${c} + ${slope}x` : `${c} + ${slope}(x${signed(-a)})`;
        return numberProblem({
          prompt: t(
            `The increasing linear bijection $f$ from $(${a}, ${b})$ onto $(${c}, ${d})$ sends $x = ${x0}$ to what?`,
            `从 $(${a}, ${b})$ 到 $(${c}, ${d})$ 的递增线性双射 $f$ 把 $x = ${x0}$ 映到哪里？`,
          ),
          answer: y0,
          wrong: [y0 + 1, y0 - 1],
          mistakes: apart(y0, [
            why(
              d - j,
              "That is the decreasing bijection, which sends the left end to the right end.",
              "这是递减的双射，它把左端点映到右端点。",
            ),
            why(
              c + num,
              "That multiplies $x$ by the slope instead of $x$ minus the left end.",
              "这是用斜率乘 $x$，而应该乘 $x$ 减去左端点。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the slope", "求斜率"],
                t(
                  `The lengths are $${len}$ and $${slope * len}$, so the slope is $\\dfrac{${slope * len}}{${len}} = ${slope}$.`,
                  `两段长度是 $${len}$ 与 $${slope * len}$，所以斜率为 $\\dfrac{${slope * len}}{${len}} = ${slope}$。`,
                ),
              ],
              [
                ["Write the map", "写出映射"],
                t(`Sending $${a} \\mapsto ${c}$: $f(x) = ${map}$.`, `使 $${a} \\mapsto ${c}$：$f(x) = ${map}$。`),
              ],
              [
                ["Evaluate", "代入"],
                t(
                  `$x - (${a}) = ${fracTex(j, slope)}$, so $f(${x0}) = ${c} + ${slope} \\cdot ${fracTex(j, slope)} = ${c} + ${j} = ${y0}$.`,
                  `$x - (${a}) = ${fracTex(j, slope)}$，所以 $f(${x0}) = ${c} + ${slope} \\cdot ${fracTex(j, slope)} = ${c} + ${j} = ${y0}$。`,
                ),
              ],
            ],
            t(
              `$f(${b}) = ${c} + ${slope} \\cdot ${len} = ${d}$, the right end, and $${y0}$ lies between $${c}$ and $${d}$.`,
              `$f(${b}) = ${c} + ${slope} \\cdot ${len} = ${d}$，正是右端点，而 $${y0}$ 位于 $${c}$ 与 $${d}$ 之间。`,
            ),
          ),
        });
      },
    },
    {
      id: "intervals-and-unbounded-sets",
      title: t("Intervals and unbounded sets", "区间与无界集"),
      explanation: t(
        "A bounded interval can have the same cardinality as an unbounded one. $f(x) = \\dfrac{x}{1 - x}$ is a bijection from $(0, 1)$ onto $(0, \\infty)$, and $\\tan x$ maps $(-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2})$ onto $\\mathbb{R}$.\n\n> **Watch out.** To reach arbitrarily large values, the function must blow up at an end of the interval. A function that stays bounded, or tends to the same value at both ends, cannot take every value of an unbounded set exactly once.",
        "有界区间可以与无界集合等势。$f(x) = \\dfrac{x}{1 - x}$ 是从 $(0, 1)$ 到 $(0, \\infty)$ 的双射，$\\tan x$ 把 $(-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2})$ 映满 $\\mathbb{R}$。\n\n> **注意。** 要取到任意大的值，函数必须在区间的某一端趋于无穷。有界的函数，或在两端趋于同一个值的函数，都不可能恰好一次地取遍一个无界集合的每个值。",
      ),
      generate(rng) {
        const a = rng.int(-6, 6);
        const b = a + rng.int(1, 6);
        const xa = `x${signed(-a)}`;
        const bx = b === 0 ? "-x" : `${b} - x`;
        const mid = fracTex(a + b, 2);
        const half = fracTex(b - a, 2);
        const product = math(`f(x) = (${xa})(${bx})`);
        const scaled = math(`f(x) = \\dfrac{${xa}}{${b - a}}`);
        const shifted = math(`f(x) = \\dfrac{1}{${xa}} + 1`);
        return reasoned(
          oneOf(
            rng,
            t(
              `Which function is a bijection from $(${a}, ${b})$ onto $(0, \\infty)$?`,
              `哪个函数是从 $(${a}, ${b})$ 到 $(0, \\infty)$ 的双射？`,
            ),
            math(`f(x) = \\dfrac{${xa}}{${bx}}`),
            [product, scaled, shifted],
            walked(
              [
                [
                  ["Check the ends", "看两端"],
                  t(
                    `As $x \\to ${a}^{+}$ the numerator tends to $0$ and the denominator to $${b - a}$, so $f \\to 0$; as $x \\to ${b}^{-}$ the denominator tends to $0^{+}$, so $f \\to \\infty$.`,
                    `$x \\to ${a}^{+}$ 时分子趋于 $0$，分母趋于 $${b - a}$，所以 $f \\to 0$；$x \\to ${b}^{-}$ 时分母趋于 $0^{+}$，所以 $f \\to \\infty$。`,
                  ),
                ],
                [
                  ["Check it is increasing", "看单调性"],
                  t(
                    "As $x$ grows the numerator grows and the positive denominator shrinks, so $f$ is increasing. Being continuous, it takes every positive value exactly once.",
                    "$x$ 增大时分子增大，正的分母减小，所以 $f$ 递增。它又是连续的，所以恰好一次地取遍每个正数。",
                  ),
                ],
              ],
              t(
                `At the midpoint $x = ${mid}$ the numerator and denominator are both $${half}$, so $f = 1$.`,
                `在中点 $x = ${mid}$ 处分子与分母都等于 $${half}$，所以 $f = 1$。`,
              ),
            ),
          ),
          [
            [
              product.en,
              "This product tends to $0$ at both ends, so it is bounded and takes some values twice.",
              "这个积在两端都趋于 $0$，所以它有界，而且有的值取到两次。",
            ],
            [
              scaled.en,
              "This only stretches the interval onto $(0, 1)$, so values $\\ge 1$ are never reached.",
              "这只是把区间变成 $(0, 1)$，取不到 $\\ge 1$ 的值。",
            ],
            [
              shifted.en,
              "Every value here is greater than $1$, so values near $0$ are never reached.",
              "这里的值都大于 $1$，所以取不到接近 $0$ 的值。",
            ],
          ],
        );
      },
    },
  ],
};

/** CountableCase is a set, whether it is countable, the reason, and a check of the reason. */
type CountableCase = readonly [set: Text, countable: boolean, reason: Text, check: Text];

/** cardinalityOfTheNaturalNumbersIntegersAndRationals shows ℕ, ℤ and ℚ are countable. */
export const cardinalityOfTheNaturalNumbersIntegersAndRationals: TopicDef = {
  id: "cardinality-of-the-natural-numbers-integers-and-rationals",
  title: t("Cardinality of the Natural Numbers, Integers and Rationals", "自然数、整数与有理数的基数"),
  summary: t(
    "ℕ, ℤ, ℕ × ℕ and ℚ are countably infinite: each can be listed as a sequence.",
    "ℕ、ℤ、ℕ × ℕ 与 ℚ 都是可数无限集：每个都可以排成一个数列。",
  ),
  intro: t(
    "List the pairs $(m, n)$ of natural numbers diagonal by diagonal, by the sum $m + n$: first $(0, 0)$, then $(1, 0), (0, 1)$, then $(2, 0), (1, 1), (0, 2)$, and so on. Each diagonal is finite, so every pair turns up at some finite position, and $\\mathbb{N} \\times \\mathbb{N}$ is countable. Writing each positive rational as $\\dfrac{p}{q}$ in lowest terms and listing the pairs $(p, q)$ the same way lists the rationals too.\n\nCheck: $(1, 1)$ is the fifth pair, position $4$ counting from $0$, and the formula $\\dfrac{(m + n)(m + n + 1)}{2} + n$ gives $\\dfrac{2 \\cdot 3}{2} + 1 = 4$.\n\nIn this lesson we compute positions in the diagonal listing and sort sets into countable and uncountable.",
    "按对角线、也就是按和 $m + n$ 依次列出自然数对 $(m, n)$：先是 $(0, 0)$，然后 $(1, 0), (0, 1)$，再然后 $(2, 0), (1, 1), (0, 2)$，依此类推。每条对角线都是有限的，所以每个数对都出现在某个有限位置上，$\\mathbb{N} \\times \\mathbb{N}$ 可数。把每个正有理数写成最简分数 $\\dfrac{p}{q}$，再用同样的方法列出数对 $(p, q)$，就把有理数也列出来了。\n\n检验：$(1, 1)$ 是第五个数对，从 $0$ 开始计是位置 $4$，而公式 $\\dfrac{(m + n)(m + n + 1)}{2} + n$ 给出 $\\dfrac{2 \\cdot 3}{2} + 1 = 4$。\n\n本课我们计算对角线排列中的位置，并把集合分成可数与不可数两类。",
  ),
  prerequisites: ["discrete-infinite-sets-with-equal-cardinality"],
  encompasses: [{ topic: "discrete-infinite-sets-with-equal-cardinality", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-cantor-pairing-function",
      title: t("Listing ℕ × ℕ", "排列 ℕ × ℕ"),
      explanation: t(
        "List pairs $(m, n)$ of $\\mathbb{N} = \\{0, 1, 2, \\dots\\}$ diagonal by diagonal: $(0, 0), (1, 0), (0, 1), (2, 0), (1, 1), (0, 2), \\dots$. The pair $(m, n)$ gets position $\\pi(m, n) = \\dfrac{(m + n)(m + n + 1)}{2} + n$, counting from $0$, which is a bijection $\\mathbb{N} \\times \\mathbb{N} \\to \\mathbb{N}$.\n\n> **Watch out.** The triangular number $\\dfrac{s(s + 1)}{2}$, with $s = m + n$, counts the pairs on the earlier diagonals. Along the diagonal the position grows with $n$, the second entry, not with $m$.",
        "按对角线依次排列 $\\mathbb{N} = \\{0, 1, 2, \\dots\\}$ 中的数对 $(m, n)$：$(0, 0), (1, 0), (0, 1), (2, 0), (1, 1), (0, 2), \\dots$。数对 $(m, n)$ 的位置（从 $0$ 开始计）是 $\\pi(m, n) = \\dfrac{(m + n)(m + n + 1)}{2} + n$，这是 $\\mathbb{N} \\times \\mathbb{N} \\to \\mathbb{N}$ 的双射。\n\n> **注意。** 三角形数 $\\dfrac{s(s + 1)}{2}$（其中 $s = m + n$）数的是前面各条对角线上的数对。沿着对角线，位置随第二个分量 $n$ 增大，而不是随 $m$。",
      ),
      generate(rng) {
        const m = rng.int(0, 12);
        const n = rng.int(0, 12);
        const s = m + n;
        const before = (s * (s + 1)) / 2;
        const v = before + n;
        return numberProblem({
          prompt: t(
            `Using $\\pi(m, n) = \\dfrac{(m + n)(m + n + 1)}{2} + n$, find $\\pi(${m}, ${n})$.`,
            `利用 $\\pi(m, n) = \\dfrac{(m + n)(m + n + 1)}{2} + n$，求 $\\pi(${m}, ${n})$。`,
          ),
          answer: v,
          wrong: [v + 2],
          mistakes: apart(v, [
            why(
              before + m,
              "That moves along the diagonal by $m$; the position grows with $n$.",
              "这是沿对角线按 $m$ 移动；位置随 $n$ 增大。",
            ),
            why(
              before,
              "That is where the diagonal starts; add $n$ for the position along it.",
              "这是对角线的起点；还要加上 $n$ 才是沿对角线的位置。",
            ),
            why(
              ((s + 1) * (s + 2)) / 2 + n,
              "That uses the next triangular number; the earlier diagonals hold $\\frac{s(s + 1)}{2}$ pairs.",
              "这用了下一个三角形数；前面各条对角线共有 $\\frac{s(s + 1)}{2}$ 个数对。",
            ),
            why(v + 1, "That counts from $1$; positions here start at $0$.", "这是从 $1$ 开始计；这里的位置从 $0$ 开始。"),
          ]),
          solution: walked(
            [
              [
                ["Find the diagonal", "找对角线"],
                t(
                  `$s = ${m} + ${n} = ${s}$, and the diagonals before it hold $\\dfrac{${s} \\cdot ${s + 1}}{2} = ${before}$ pairs.`,
                  `$s = ${m} + ${n} = ${s}$，它前面的各条对角线共有 $\\dfrac{${s} \\cdot ${s + 1}}{2} = ${before}$ 个数对。`,
                ),
              ],
              [
                ["Move along it", "沿对角线移动"],
                t(`Add $n = ${n}$: $${before} + ${n} = ${v}$.`, `加上 $n = ${n}$：$${before} + ${n} = ${v}$。`),
              ],
            ],
            t(
              `The diagonal $m + n = ${s}$ runs from $(${s}, 0)$ at position $${before}$ to $(0, ${s})$ at position $${before + s}$, and $${v}$ lies in that range.`,
              `对角线 $m + n = ${s}$ 从位置 $${before}$ 的 $(${s}, 0)$ 到位置 $${before + s}$ 的 $(0, ${s})$，而 $${v}$ 在这个范围内。`,
            ),
          ),
        });
      },
    },
    {
      id: "countable-or-uncountable",
      title: t("Countable or uncountable?", "可数还是不可数？"),
      explanation: t(
        "Countable: finite sets, $\\mathbb{N}$, $\\mathbb{Z}$, $\\mathbb{Q}$, $\\mathbb{Z}^k$, finite subsets of $\\mathbb{N}$, and countable unions of countable sets. Uncountable: $\\mathbb{R}$, every interval $(a, b)$ with $a < b$, the irrationals and $\\mathcal{P}(\\mathbb{N})$.\n\n> **Watch out.** Infinite does not mean uncountable. A set is countable when its elements can be listed, so $\\mathbb{Q}$ and $\\mathbb{Z}^k$ are countable although they are infinite and $\\mathbb{Q}$ is dense; any set containing an interval of reals is uncountable.",
        "可数：有限集、$\\mathbb{N}$、$\\mathbb{Z}$、$\\mathbb{Q}$、$\\mathbb{Z}^k$、$\\mathbb{N}$ 的有限子集族，以及可数个可数集的并。不可数：$\\mathbb{R}$、每个 $a < b$ 的区间 $(a, b)$、无理数集与 $\\mathcal{P}(\\mathbb{N})$。\n\n> **注意。** 无限不等于不可数。只要元素能排成一列，集合就是可数的，所以 $\\mathbb{Q}$ 与 $\\mathbb{Z}^k$ 虽然无限、$\\mathbb{Q}$ 还处处稠密，却都可数；而包含一个实数区间的集合不可数。",
      ),
      generate(rng) {
        const a = rng.int(-9, 9);
        const b = a + rng.int(1, 9);
        const k = rng.int(2, 6);
        const p = k + 5;
        const stretch = a === 0 ? `${coef(b - a)}x` : `${a} + ${coef(b - a)}x`;
        const sets: CountableCase[] = [
          [
            t(`$\\mathbb{Z}^{${k}}$`, `$\\mathbb{Z}^{${k}}$`),
            true,
            t(
              `List the points by the largest absolute value of their $${k}$ coordinates: each stage is finite, so every point appears.`,
              `按 $${k}$ 个坐标绝对值的最大值分批列出各点：每一批都有限，所以每个点都会出现。`,
            ),
            t(
              `The first stages are finite: $${3 ** k}$ points have all coordinates in $\\{-1, 0, 1\\}$.`,
              `前几批都有限：坐标都在 $\\{-1, 0, 1\\}$ 中的点有 $${3 ** k}$ 个。`,
            ),
          ],
          [
            t(`$\\mathbb{Q} \\cap (${a}, ${b})$`, `$\\mathbb{Q} \\cap (${a}, ${b})$`),
            true,
            t(
              "It is a subset of $\\mathbb{Q}$, which is countable, and a subset of a countable set is countable.",
              "它是可数集 $\\mathbb{Q}$ 的子集，而可数集的子集可数。",
            ),
            t(
              `For each denominator $q$, only finitely many fractions $\\frac{p}{q}$ lie in $(${a}, ${b})$, so listing by $q$ reaches all of them.`,
              `对每个分母 $q$，落在 $(${a}, ${b})$ 中的分数 $\\frac{p}{q}$ 只有有限个，所以按 $q$ 列出就能取遍。`,
            ),
          ],
          [
            t(`$(${a}, ${b})$`, `$(${a}, ${b})$`),
            false,
            t(
              "It is an interval of reals, with the cardinality of $(0, 1)$, which the diagonal argument shows is uncountable.",
              "它是实数区间，与 $(0, 1)$ 等势，而对角线论证说明 $(0, 1)$ 不可数。",
            ),
            t(`$x \\mapsto ${stretch}$ maps $(0, 1)$ onto $(${a}, ${b})$.`, `$x \\mapsto ${stretch}$ 把 $(0, 1)$ 映满 $(${a}, ${b})$。`),
          ],
          [
            t(`$\\{x \\in \\mathbb{R} : x > ${a}\\}$`, `$\\{x \\in \\mathbb{R} : x > ${a}\\}$`),
            false,
            t(`It contains the interval $(${a}, ${a + 1})$, which is uncountable.`, `它包含不可数的区间 $(${a}, ${a + 1})$。`),
            t(
              `$x \\mapsto ${a} + e^x$ even maps all of $\\mathbb{R}$ onto it.`,
              `$x \\mapsto ${a} + e^x$ 甚至把整个 $\\mathbb{R}$ 映满它。`,
            ),
          ],
          [
            t(`$\\{${k}n + ${b - a} : n \\in \\mathbb{Z}\\}$`, `$\\{${k}n + ${b - a} : n \\in \\mathbb{Z}\\}$`),
            true,
            t(
              `$n \\mapsto ${k}n + ${b - a}$ lists it in the same order as $\\mathbb{Z}$, which is countable.`,
              `$n \\mapsto ${k}n + ${b - a}$ 按 $\\mathbb{Z}$ 的顺序把它列出，而 $\\mathbb{Z}$ 可数。`,
            ),
            t(
              `Different $n$ give values that differ by a nonzero multiple of $${k}$, so the listing has no repeats.`,
              `不同的 $n$ 给出的值相差 $${k}$ 的非零倍数，所以列表中没有重复。`,
            ),
          ],
          [
            t(`the set of irrational numbers in $(${a}, ${b})$`, `$(${a}, ${b})$ 中的无理数`),
            false,
            t(
              `If they were countable, together with the countable rationals they would make $(${a}, ${b})$ countable.`,
              `如果它们可数，那么连同可数的有理数，$(${a}, ${b})$ 也将可数。`,
            ),
            t(
              `$(${a}, ${b})$ is the union of its rationals and its irrationals, and a union of two countable sets is countable.`,
              `$(${a}, ${b})$ 是其中有理数与无理数的并，而两个可数集的并可数。`,
            ),
          ],
          [
            t(`$\\mathcal{P}(\\{1, \\dots, ${p}\\})$`, `$\\mathcal{P}(\\{1, \\dots, ${p}\\})$`),
            true,
            t(`It is finite, with $2^{${p}} = ${2 ** p}$ elements.`, `它是有限集，有 $2^{${p}} = ${2 ** p}$ 个元素。`),
            t(
              `Each of the $${p}$ elements is in or out of a subset, giving $2^{${p}}$ choices.`,
              `$${p}$ 个元素中每个都可以在或不在子集中，共 $2^{${p}}$ 种选择。`,
            ),
          ],
          [
            t("$\\mathcal{P}(\\mathbb{N})$", "$\\mathcal{P}(\\mathbb{N})$"),
            false,
            t(
              "Subsets of $\\mathbb{N}$ match infinite binary sequences, which the diagonal argument shows cannot be listed.",
              "$\\mathbb{N}$ 的子集与无限二进制序列一一对应，而对角线论证说明后者无法排成一列。",
            ),
            t(
              "Cantor's theorem gives the same: $|\\mathbb{N}| < |\\mathcal{P}(\\mathbb{N})|$.",
              "康托尔定理也给出同样的结论：$|\\mathbb{N}| < |\\mathcal{P}(\\mathbb{N})|$。",
            ),
          ],
          [
            t(`the set of finite strings over a ${k}-letter alphabet`, `${k} 个字母组成的字母表上的有限字符串`),
            true,
            t(
              `List the strings by length: there are $${k}^\\ell$ strings of length $\\ell$, finitely many at each length.`,
              `按长度列出字符串：长度为 $\\ell$ 的字符串有 $${k}^\\ell$ 个，每种长度都只有有限个。`,
            ),
            t(
              `There are $${k}^2 = ${k * k}$ strings of length $2$, all listed before any string of length $3$.`,
              `长度为 $2$ 的字符串有 $${k}^2 = ${k * k}$ 个，它们都排在长度为 $3$ 的字符串之前。`,
            ),
          ],
          [
            t(`the set of infinite sequences of digits $0$ to $${k - 1}$`, `由数字 $0$ 到 $${k - 1}$ 组成的无限序列`),
            false,
            t(
              "The diagonal argument applies: changing digit $n$ of sequence $n$ builds a sequence missing from any list.",
              "对角线论证适用：改变第 $n$ 个序列的第 $n$ 位，就得到任何列表都缺少的序列。",
            ),
            t(
              `With $${k}$ digits available, each diagonal digit can always be replaced by a different one.`,
              `可用的数字有 $${k}$ 个，所以对角线上的每个数字总能换成另一个。`,
            ),
          ],
          [
            t("$\\{\\sqrt{n} : n \\in \\mathbb{N}\\}$", "$\\{\\sqrt{n} : n \\in \\mathbb{N}\\}$"),
            true,
            t(
              "It is the image of $\\mathbb{N}$ under $n \\mapsto \\sqrt{n}$, so it can be listed.",
              "它是 $\\mathbb{N}$ 在 $n \\mapsto \\sqrt{n}$ 下的像，所以可以排成一列。",
            ),
            t(
              "$\\sqrt{0}, \\sqrt{1}, \\sqrt{2}, \\dots$ lists every element, with no repeats since $\\sqrt{\\ }$ is increasing.",
              "$\\sqrt{0}, \\sqrt{1}, \\sqrt{2}, \\dots$ 列出了每个元素，而且 $\\sqrt{\\ }$ 递增，所以没有重复。",
            ),
          ],
        ];
        const [set, countable, reason, check] = rng.pick(sets);
        const options = [t("Countable", "可数"), t("Uncountable", "不可数")];
        const right = options[countable ? 0 : 1]!;
        const wrong = options[countable ? 1 : 0]!;
        return reasoned(
          oneOf(
            rng,
            t(`Is ${set.en} countable or uncountable?`, `${set["zh-CN"]} 是可数的还是不可数的？`),
            right,
            [wrong],
            walked(
              [
                [countable ? ["Find a listing", "找出一种排列"] : ["Rule out a listing", "排除任何排列"], reason],
                [["Conclude", "得出结论"], t(`So the set is ${lower(right.en)}.`, `所以这个集合是${right["zh-CN"]}的。`)],
              ],
              check,
            ),
          ),
          [
            countable
              ? [
                  wrong.en,
                  "Every element of this set appears in a list $a_1, a_2, \\dots$, so it is countable.",
                  "这个集合的每个元素都出现在某个列表 $a_1, a_2, \\dots$ 中，所以它可数。",
                ]
              : [
                  wrong.en,
                  "Any list of elements of this set misses some of them, so it is not countable.",
                  "这个集合的任何列表都会漏掉一些元素，所以它不可数。",
                ],
          ],
        );
      },
    },
  ],
};

/** cantorsDiagonalArgument shows ℝ is uncountable. */
export const cantorsDiagonalArgument: TopicDef = {
  id: "cantors-diagonal-argument",
  title: t("Cantor's Diagonal Argument", "康托尔对角线论证"),
  summary: t(
    "Given any list of infinite sequences, change the nth digit of the nth sequence to build a sequence missing from the list; so (0, 1) is uncountable.",
    "对任意一列无限序列，改变第 n 个序列的第 n 位，就构造出不在列表中的序列；所以 (0, 1) 不可数。",
  ),
  intro: t(
    "Suppose a list of binary sequences begins $s_1 = 1010\\dots$, $s_2 = 0011\\dots$, $s_3 = 1100\\dots$. Take digit $1$ of $s_1$, digit $2$ of $s_2$ and digit $3$ of $s_3$: $1, 0, 0$. Flip each to get $t = 011\\dots$. Then $t$ differs from $s_1$ in digit $1$, from $s_2$ in digit $2$ and from $s_3$ in digit $3$, and continuing down the list it differs from every $s_k$ in digit $k$. So no list contains every binary sequence.\n\nCheck: digit $2$ of $s_2 = 0011\\dots$ is $0$ while digit $2$ of $t$ is $1$, so $t \\ne s_2$.\n\nIn this lesson we build the diagonal sequence of a list, and use the decimal version to show that $(0, 1)$ is uncountable.",
    "设一列二进制序列开头为 $s_1 = 1010\\dots$，$s_2 = 0011\\dots$，$s_3 = 1100\\dots$。取 $s_1$ 的第 $1$ 位、$s_2$ 的第 $2$ 位、$s_3$ 的第 $3$ 位：$1, 0, 0$。逐位翻转得 $t = 011\\dots$。于是 $t$ 与 $s_1$ 在第 $1$ 位不同，与 $s_2$ 在第 $2$ 位不同，与 $s_3$ 在第 $3$ 位不同；沿列表继续下去，它与每个 $s_k$ 在第 $k$ 位不同。所以没有哪个列表包含所有二进制序列。\n\n检验：$s_2 = 0011\\dots$ 的第 $2$ 位是 $0$，而 $t$ 的第 $2$ 位是 $1$，所以 $t \\ne s_2$。\n\n本课我们构造一个列表的对角线序列，并用十进制版本说明 $(0, 1)$ 不可数。",
  ),
  prerequisites: ["cardinality-of-the-natural-numbers-integers-and-rationals", "proof-by-contradiction"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "flipping-the-diagonal",
      title: t("Flipping the diagonal", "翻转对角线"),
      explanation: t(
        "If the list of binary sequences begins $s_1 = 0110\\dots$, $s_2 = 1011\\dots$, $s_3 = 0001\\dots$, $s_4 = 1110\\dots$, the diagonal digits are $0, 0, 0, 0$; flipping each gives $1111\\dots$, which differs from $s_n$ in digit $n$.\n\n> **Watch out.** Digit $k$ of the new sequence comes from position $k$ of sequence $k$, and it must be flipped. Keeping a diagonal digit, or reading a row or the other diagonal, can give a sequence that is already on the list.",
        "若二进制序列列表开头是 $s_1 = 0110\\dots$，$s_2 = 1011\\dots$，$s_3 = 0001\\dots$，$s_4 = 1110\\dots$，对角线数字为 $0, 0, 0, 0$；逐位翻转得 $1111\\dots$，它与 $s_n$ 在第 $n$ 位不同。\n\n> **注意。** 新序列的第 $k$ 位取自序列 $k$ 的第 $k$ 位，而且必须翻转。保留对角线数字，或者读某一行、读另一条对角线，都可能得到已经在列表中的序列。",
      ),
      generate(rng) {
        const n = rng.int(4, 5);
        const rows = range(1, n).map(() =>
          range(1, n)
            .map(() => rng.int(0, 1))
            .join(""),
        );
        const flipAll = (s: string) =>
          s
            .split("")
            .map((c) => (c === "0" ? "1" : "0"))
            .join("");
        const diag = rows.map((r, i) => r[i]!).join("");
        const flip = flipAll(diag);
        const opt = (s: string) => math(`${s}\\dots`);
        const kept = opt(diag);
        const firstRow = opt(flipAll(rows[0]!));
        const anti = opt(flipAll(rows.map((r, i) => r[n - 1 - i]!).join("")));
        return reasoned(
          oneOf(
            rng,
            t(
              `A list of binary sequences begins ${rows.map((r, i) => `$s_{${i + 1}} = ${r}\\dots$`).join(", ")}. Which sequence does the diagonal argument build (first ${n} digits)?`,
              `一列二进制序列开头为 ${rows.map((r, i) => `$s_{${i + 1}} = ${r}\\dots$`).join("，")}。对角线论证构造出的序列是哪一个（前 ${n} 位）？`,
            ),
            opt(flip),
            [kept, firstRow, anti],
            walked(
              [
                [
                  ["Read the diagonal", "读对角线"],
                  t(
                    `Digit $k$ of $s_k$, for $k = 1, \\dots, ${n}$: $${diag.split("").join(", ")}$.`,
                    `$s_k$ 的第 $k$ 位，$k = 1, \\dots, ${n}$：$${diag.split("").join(", ")}$。`,
                  ),
                ],
                [
                  ["Flip each digit", "逐位翻转"],
                  t(
                    `$${flip.split("").join(", ")}$, so the new sequence begins $${flip}\\dots$.`,
                    `$${flip.split("").join(", ")}$，所以新序列开头为 $${flip}\\dots$。`,
                  ),
                ],
              ],
              t(
                `The first digit of $s_1$ is $${diag[0]}$ while the new sequence starts with $${flip[0]}$, and digit $${n}$ of $s_{${n}}$ is $${diag[n - 1]}$ against $${flip[n - 1]}$: each $s_k$ fails at digit $k$.`,
                `$s_1$ 的第一位是 $${diag[0]}$，而新序列以 $${flip[0]}$ 开头；$s_{${n}}$ 的第 $${n}$ 位是 $${diag[n - 1]}$，新序列是 $${flip[n - 1]}$：每个 $s_k$ 都在第 $k$ 位不同。`,
              ),
            ),
          ),
          [
            [
              kept.en,
              "This keeps the diagonal digits as they are, so it agrees with every sequence on the diagonal: each digit must be flipped.",
              "这里保留了对角线上的数字，于是在对角线上与每个序列都相同：每个数字都要翻转。",
            ],
            [
              firstRow.en,
              "This flips the digits of the first sequence only, and the diagonal takes one digit from each sequence.",
              "这里只翻转了第一个序列的数字，而对角线是从每个序列各取一个数字。",
            ],
            [
              anti.en,
              "This flips the other diagonal, whose digit $k$ does not come from position $k$ of sequence $k$.",
              "这里翻转的是另一条对角线，它的第 $k$ 位不是取自序列 $k$ 的第 $k$ 位。",
            ],
          ],
        );
      },
    },
    {
      id: "the-decimal-diagonal",
      title: t("The decimal diagonal", "十进制对角线"),
      explanation: t(
        "For decimals in $(0, 1)$, set digit $n$ of the new number to $5$ if digit $n$ of $x_n$ is not $5$, and to $4$ if it is. Using only $4$ and $5$ avoids numbers with two decimal expansions, such as $0.0999\\dots = 0.1$.\n\n> **Watch out.** The rule looks only at digit $n$ of $x_n$: a $5$ becomes $4$, and every other digit becomes $5$. Copying the diagonal digits, or swapping the roles of $4$ and $5$, can rebuild a number already on the list.",
        "对 $(0, 1)$ 中的小数：若 $x_n$ 的第 $n$ 位不是 $5$，令新数的第 $n$ 位为 $5$；若是 $5$，则令其为 $4$。只用 $4$ 和 $5$ 可以避免有两种小数表示的数，例如 $0.0999\\dots = 0.1$。\n\n> **注意。** 规则只看 $x_n$ 的第 $n$ 位：$5$ 变成 $4$，其他数字都变成 $5$。照抄对角线数字，或把 $4$ 和 $5$ 的作用弄反，都可能重新得到列表中已有的数。",
      ),
      generate(rng) {
        const n = 4;
        const rows = range(1, n).map(() =>
          range(1, 6)
            .map(() => (rng.int(0, 2) === 0 ? 5 : rng.int(0, 9)))
            .join(""),
        );
        const diag = rows.map((r, i) => r[i]!);
        const digits = diag.map((c) => (c === "5" ? "4" : "5")).join("");
        const value = Number(digits);
        return numberProblem({
          prompt: t(
            `A list of numbers in $(0, 1)$ begins ${rows.map((r, i) => `$x_{${i + 1}} = 0.${r}\\dots$`).join(", ")}. Build $y$ by making digit $n$ equal to $5$ if digit $n$ of $x_n$ is not $5$, and $4$ otherwise. Write the first four digits of $y$ as a four-digit integer.`,
            `$(0, 1)$ 中的一列数开头为 ${rows.map((r, i) => `$x_{${i + 1}} = 0.${r}\\dots$`).join("，")}。构造 $y$：若 $x_n$ 的第 $n$ 位不是 $5$，则 $y$ 的第 $n$ 位为 $5$，否则为 $4$。把 $y$ 的前四位写成一个四位整数。`,
          ),
          answer: value,
          wrong: [value + 1],
          mistakes: apart(value, [
            why(
              Number(diag.join("")) || 1,
              "That copies the diagonal digits; each one must be changed.",
              "这是照抄对角线数字；每一位都必须改变。",
            ),
            why(
              5555,
              "That ignores the diagonal digits equal to $5$, which must become $4$.",
              "这忽略了等于 $5$ 的对角线数字，它们必须变成 $4$。",
            ),
            why(
              Number(diag.map((c) => (c === "5" ? "5" : "4")).join("")),
              "That swaps the rule: a digit other than $5$ becomes $5$, and a $5$ becomes $4$.",
              "这把规则弄反了：不是 $5$ 的数字变成 $5$，$5$ 变成 $4$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Read the diagonal", "读对角线"],
                t(
                  `Digit $n$ of $x_n$: ${diag.map((c) => `$${c}$`).join(", ")}.`,
                  `$x_n$ 的第 $n$ 位：${diag.map((c) => `$${c}$`).join("、")}。`,
                ),
              ],
              [
                ["Apply the rule", "应用规则"],
                t(
                  `Each $5$ becomes $4$ and every other digit becomes $5$, so $y = 0.${digits}\\dots$ and the answer is $${digits}$.`,
                  `每个 $5$ 变成 $4$，其他数字都变成 $5$，所以 $y = 0.${digits}\\dots$，答案是 $${digits}$。`,
                ),
              ],
            ],
            t(
              `Digit $1$ of $x_1$ is $${diag[0]}$ and digit $1$ of $y$ is $${digits[0]}$, so $y \\ne x_1$; in the same way $y$ differs from each $x_n$ at digit $n$.`,
              `$x_1$ 的第 $1$ 位是 $${diag[0]}$，$y$ 的第 $1$ 位是 $${digits[0]}$，所以 $y \\ne x_1$；同理 $y$ 与每个 $x_n$ 在第 $n$ 位不同。`,
            ),
          ),
        });
      },
    },
  ],
};

/** theCantorBernsteinSchroderTheorem proves equal cardinality from two injections. */
export const theCantorBernsteinSchroderTheorem: TopicDef = {
  id: "the-cantor-bernstein-schroder-theorem",
  title: t("The Cantor–Bernstein–Schröder Theorem", "康托尔–伯恩斯坦–施罗德定理"),
  summary: t(
    "If there are injections A → B and B → A, then there is a bijection A → B, so |A| = |B|.",
    "若存在单射 A → B 与 B → A，则存在双射 A → B，因此 |A| = |B|。",
  ),
  intro: t(
    "To compare $[0, 1]$ with $(0, 1)$ without building a bijection, find injections in both directions. The inclusion $x \\mapsto x$ sends $(0, 1)$ into $[0, 1]$. The map $g(x) = \\dfrac{x + 1}{3}$ is increasing, so injective, and sends $[0, 1]$ into $[\\tfrac{1}{3}, \\tfrac{2}{3}]$, inside $(0, 1)$. By the Cantor–Bernstein–Schröder theorem, $|[0, 1]| = |(0, 1)|$.\n\nCheck: the endpoints go to $g(0) = \\tfrac{1}{3}$ and $g(1) = \\tfrac{2}{3}$, both strictly between $0$ and $1$.\n\nIn this lesson we build injections into open intervals, and decide what two injections, or only one, prove about cardinality.",
    "要比较 $[0, 1]$ 与 $(0, 1)$ 而不直接构造双射，就找两个方向的单射。包含映射 $x \\mapsto x$ 把 $(0, 1)$ 送入 $[0, 1]$。映射 $g(x) = \\dfrac{x + 1}{3}$ 递增，因而是单射，它把 $[0, 1]$ 送入 $(0, 1)$ 内的 $[\\tfrac{1}{3}, \\tfrac{2}{3}]$。由康托尔–伯恩斯坦–施罗德定理，$|[0, 1]| = |(0, 1)|$。\n\n检验：端点映到 $g(0) = \\tfrac{1}{3}$ 与 $g(1) = \\tfrac{2}{3}$，都严格介于 $0$ 与 $1$ 之间。\n\n本课我们构造到开区间的单射，并判断两个单射或只有一个单射能证明什么样的基数关系。",
  ),
  prerequisites: ["continuous-infinite-sets-with-equal-cardinality", "cardinality-of-the-natural-numbers-integers-and-rationals"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "injections-into-open-intervals",
      title: t("Injections into open intervals", "到开区间的单射"),
      explanation: t(
        "The Schröder–Bernstein theorem says injections in both directions guarantee a bijection, which avoids building one directly. To show $|[0, 1]| = |(0, 1)|$, use two injections: the inclusion $(0, 1) \\to [0, 1]$, and $x \\mapsto \\dfrac{x + 1}{3}$, which maps $[0, 1]$ into $[\\tfrac{1}{3}, \\tfrac{2}{3}] \\subset (0, 1)$.\n\n> **Watch out.** The closed endpoints must land strictly inside the open interval. A map that only rescales the length sends an endpoint onto an end of the open interval, which the interval does not contain.",
        "施罗德–伯恩斯坦定理说，两个方向的单射保证存在双射，这样就不必直接构造双射。要证明 $|[0, 1]| = |(0, 1)|$，用两个单射：包含映射 $(0, 1) \\to [0, 1]$，以及 $x \\mapsto \\dfrac{x + 1}{3}$，它把 $[0, 1]$ 映入 $[\\tfrac{1}{3}, \\tfrac{2}{3}] \\subset (0, 1)$。\n\n> **注意。** 闭区间的端点必须落在开区间的严格内部。只按长度伸缩的映射会把端点送到开区间的端点上，而开区间不包含它们。",
      ),
      generate(rng) {
        const a = rng.int(1, 9);
        const b = rng.int(1, 9);
        const f = (num: string, den: number) => math(den === 1 ? `f(x) = ${num}` : `f(x) = \\dfrac{${num}}{${den}}`);
        const bx = b === 1 ? "x" : `${b}x`;
        const shift = b === 1 ? `x + ${a}` : `${b}(x + ${a})`;
        const rescaled = f(bx, a);
        const halfShift = f(shift, 2 * a);
        const halfScale = f(bx, 2 * a);
        return reasoned(
          oneOf(
            rng,
            t(`Which function is an injection from $[0, ${a}]$ into $(0, ${b})$?`, `哪个函数是从 $[0, ${a}]$ 到 $(0, ${b})$ 的单射？`),
            f(shift, 3 * a),
            [rescaled, halfShift, halfScale],
            walked(
              [
                [
                  ["Check it is injective", "检验是单射"],
                  t(
                    "It is linear with a positive slope, so it is increasing and different inputs give different outputs.",
                    "它是斜率为正的线性函数，所以递增，不同的输入给出不同的输出。",
                  ),
                ],
                [
                  ["Check the endpoints", "检验端点"],
                  t(
                    `$f(0) = ${fracTex(b, 3)}$ and $f(${a}) = ${fracTex(2 * b, 3)}$, both strictly between $0$ and $${b}$, so all of $[0, ${a}]$ lands inside $(0, ${b})$.`,
                    `$f(0) = ${fracTex(b, 3)}$，$f(${a}) = ${fracTex(2 * b, 3)}$，都严格介于 $0$ 与 $${b}$ 之间，所以整个 $[0, ${a}]$ 都落在 $(0, ${b})$ 内。`,
                  ),
                ],
              ],
              t(
                `The midpoint $x = ${fracTex(a, 2)}$ goes to $${fracTex(b, 2)}$, the midpoint of $(0, ${b})$.`,
                `中点 $x = ${fracTex(a, 2)}$ 映到 $${fracTex(b, 2)}$，正是 $(0, ${b})$ 的中点。`,
              ),
            ),
          ),
          [
            [
              rescaled.en,
              `This sends $0 \\mapsto 0$ and $${a} \\mapsto ${b}$, and neither lies in the open interval.`,
              `它把 $0 \\mapsto 0$，$${a} \\mapsto ${b}$，两者都不在开区间中。`,
            ],
            [
              halfShift.en,
              `This sends $${a} \\mapsto ${b}$, which the open interval does not contain.`,
              `它把 $${a} \\mapsto ${b}$，而开区间不包含 $${b}$。`,
            ],
            [
              halfScale.en,
              "This sends $0 \\mapsto 0$, which the open interval does not contain.",
              "它把 $0 \\mapsto 0$，而开区间不包含 $0$。",
            ],
          ],
        );
      },
    },
    {
      id: "applying-cantor-bernstein-schroder",
      title: t("Applying the theorem", "应用定理"),
      explanation: t(
        "The theorem needs injections in **both** directions. Injections $\\mathbb{N} \\to \\mathbb{N} \\times \\mathbb{N}$, $n \\mapsto (n, 0)$, and $\\mathbb{N} \\times \\mathbb{N} \\to \\mathbb{N}$, $(m, n) \\mapsto 2^m 3^n$, show $|\\mathbb{N} \\times \\mathbb{N}| = |\\mathbb{N}|$. One injection alone only gives $\\le$.\n\n> **Watch out.** An injection $A \\to B$ gives only $|A| \\le |B|$, even when the sets happen to be equal in size; it never shows $<$. Equality needs an injection in each direction, and neither has to be onto.",
        "定理需要**两个方向**的单射。单射 $\\mathbb{N} \\to \\mathbb{N} \\times \\mathbb{N}$，$n \\mapsto (n, 0)$，与 $\\mathbb{N} \\times \\mathbb{N} \\to \\mathbb{N}$，$(m, n) \\mapsto 2^m 3^n$，说明 $|\\mathbb{N} \\times \\mathbb{N}| = |\\mathbb{N}|$。只有一个单射只能得到 $\\le$。\n\n> **注意。** 单射 $A \\to B$ 只给出 $|A| \\le |B|$，即使两个集合恰好等势也是如此；它永远不能说明 $<$。要得到相等，需要两个方向各有一个单射，而它们都不必是满射。",
      ),
      generate(rng) {
        const p = rng.pick([2, 3, 5, 7]);
        const q = rng.pick([3, 5, 7, 11].filter((x) => x > p));
        const c = rng.int(0, 9);
        const pairs: [string, string, string, string, Text][] = [
          [
            "\\mathbb{N}",
            "\\mathbb{N} \\times \\mathbb{N}",
            `n \\mapsto (n, ${c})`,
            `(m, n) \\mapsto ${p}^m ${q}^n`,
            t(
              `$n \\mapsto (n, ${c})$ sends different $n$ to pairs with different first entries, such as $(3, ${c})$ and $(4, ${c})$.`,
              `$n \\mapsto (n, ${c})$ 把不同的 $n$ 送到第一个分量不同的数对，例如 $(3, ${c})$ 与 $(4, ${c})$。`,
            ),
          ],
          [
            "\\mathbb{Z}",
            "\\mathbb{N}",
            "n \\mapsto \\begin{cases} 2n & n \\ge 0 \\\\ -2n - 1 & n < 0 \\end{cases}",
            `n \\mapsto n${signed(c)}`,
            t(
              "The first map sends $1 \\mapsto 2$ and $-1 \\mapsto 1$: integers $\\ge 0$ go to even numbers and negative ones to odd numbers, so no two collide.",
              "第一个映射把 $1 \\mapsto 2$，$-1 \\mapsto 1$：$\\ge 0$ 的整数映到偶数，负整数映到奇数，所以不会撞在一起。",
            ),
          ],
          [
            "[0, 1]",
            "(0, 1)",
            `x \\mapsto \\dfrac{x + ${c + 1}}{${2 * c + 3}}`,
            "x \\mapsto x",
            t(
              `The first map sends $0 \\mapsto \\tfrac{${c + 1}}{${2 * c + 3}}$ and $1 \\mapsto \\tfrac{${c + 2}}{${2 * c + 3}}$, both strictly inside $(0, 1)$.`,
              `第一个映射把 $0 \\mapsto \\tfrac{${c + 1}}{${2 * c + 3}}$，$1 \\mapsto \\tfrac{${c + 2}}{${2 * c + 3}}$，都严格位于 $(0, 1)$ 内。`,
            ),
          ],
        ];
        const [A, B, f, g, check] = rng.pick(pairs);
        const both = rng.bool();
        const s = (x: string) => t(`$${x}$`, `$${x}$`);
        const eq = s(`|${A}| = |${B}|`);
        const le = s(`|${A}| \\le |${B}|`);
        const lt = s(`|${A}| < |${B}|`);
        const leOnly = t(`$|${A}| \\le |${B}|$ only`, `只有 $|${A}| \\le |${B}|$`);
        const gt = s(`|${B}| < |${A}|`);
        const back = s(`|${B}| \\le |${A}|`);
        return reasoned(
          oneOf(
            rng,
            both
              ? t(
                  `Injections $${A} \\to ${B}$, $${f}$, and $${B} \\to ${A}$, $${g}$, are given. What follows?`,
                  `已知单射 $${A} \\to ${B}$，$${f}$，以及 $${B} \\to ${A}$，$${g}$。可以得出什么？`,
                )
              : t(
                  `Only an injection $${A} \\to ${B}$, $${f}$, is given. What follows?`,
                  `只知道一个单射 $${A} \\to ${B}$，$${f}$。可以得出什么？`,
                ),
            both ? eq : le,
            both ? [lt, leOnly, gt] : [eq, lt, back],
            walked(
              both
                ? [
                    [
                      ["Read the injections", "读出单射"],
                      t(
                        `$${A} \\to ${B}$ gives $|${A}| \\le |${B}|$, and $${B} \\to ${A}$ gives $|${B}| \\le |${A}|$.`,
                        `$${A} \\to ${B}$ 给出 $|${A}| \\le |${B}|$，$${B} \\to ${A}$ 给出 $|${B}| \\le |${A}|$。`,
                      ),
                    ],
                    [
                      ["Apply the theorem", "应用定理"],
                      t(
                        `The Cantor–Bernstein–Schröder theorem turns the two injections into a bijection, so $|${A}| = |${B}|$.`,
                        `康托尔–伯恩斯坦–施罗德定理由这两个单射得到一个双射，所以 $|${A}| = |${B}|$。`,
                      ),
                    ],
                  ]
                : [
                    [
                      ["Read the injection", "读出单射"],
                      t(`$${A} \\to ${B}$ gives $|${A}| \\le |${B}|$.`, `$${A} \\to ${B}$ 给出 $|${A}| \\le |${B}|$。`),
                    ],
                    [
                      ["Look for the other direction", "找另一个方向"],
                      t(
                        `No injection $${B} \\to ${A}$ is given, so the theorem does not apply, and only $|${A}| \\le |${B}|$ follows.`,
                        `没有给出单射 $${B} \\to ${A}$，所以定理不适用，只能得出 $|${A}| \\le |${B}|$。`,
                      ),
                    ],
                  ],
              check,
            ),
          ),
          both
            ? [
                [
                  lt.en,
                  `The injection back, $${B} \\to ${A}$, rules out $${A}$ being strictly smaller.`,
                  `反方向的单射 $${B} \\to ${A}$ 排除了 $${A}$ 严格更小的可能。`,
                ],
                [
                  leOnly.en,
                  `The injection back gives $|${B}| \\le |${A}|$ as well, and the two together give equality.`,
                  `反方向的单射还给出 $|${B}| \\le |${A}|$，两者合起来就是相等。`,
                ],
                [
                  gt.en,
                  `The injection $${A} \\to ${B}$ rules out $${B}$ being strictly smaller.`,
                  `单射 $${A} \\to ${B}$ 排除了 $${B}$ 严格更小的可能。`,
                ],
              ]
            : [
                [
                  eq.en,
                  `Equality needs an injection $${B} \\to ${A}$ as well, and none is given.`,
                  `要得到相等还需要单射 $${B} \\to ${A}$，但题中没有给出。`,
                ],
                [
                  lt.en,
                  "An injection does not rule out a bijection, so it cannot show a strict inequality.",
                  "单射并不排除双射的存在，所以不能说明严格不等。",
                ],
                [
                  back.en,
                  `That would need an injection $${B} \\to ${A}$; the given one goes from $${A}$ to $${B}$.`,
                  `那需要单射 $${B} \\to ${A}$；已知的单射是从 $${A}$ 到 $${B}$。`,
                ],
              ],
        );
      },
    },
  ],
};

/** theCardinalityOfThePowerSetOfNaturalNumbers matches subsets of ℕ with binary sequences. */
export const theCardinalityOfThePowerSetOfNaturalNumbers: TopicDef = {
  id: "the-cardinality-of-the-power-set-of-natural-numbers",
  title: t("The Cardinality of the Power Set of Natural Numbers", "自然数幂集的基数"),
  summary: t(
    "Subsets of ℕ correspond to infinite binary sequences, so 𝒫(ℕ) is uncountable and has the cardinality of ℝ; the finite subsets alone are countable.",
    "ℕ 的子集与无限二进制序列一一对应，所以 𝒫(ℕ) 不可数，且与 ℝ 等势；而仅有限子集构成的集合是可数的。",
  ),
  intro: t(
    "Match each subset $S$ of $\\{1, 2, 3, \\dots\\}$ with the binary sequence whose digit $n$ is $1$ when $n \\in S$ and $0$ otherwise. The odd numbers give $1010\\dots$, and $\\{2, 3\\}$ gives $0110000\\dots$. Every binary sequence comes from exactly one subset, so $\\mathcal{P}(\\mathbb{N})$ has as many elements as the infinite binary sequences, which the diagonal argument shows is uncountably many. The finite subsets alone, by contrast, can be listed.\n\nCheck: $0110000\\dots$ has its $1$s exactly in places $2$ and $3$, so it leads back to $\\{2, 3\\}$.\n\nIn this lesson we turn subsets into binary sequences, and count the finite subsets with binary numbers.",
    "把 $\\{1, 2, 3, \\dots\\}$ 的每个子集 $S$ 与这样的二进制序列对应：$n \\in S$ 时第 $n$ 位为 $1$，否则为 $0$。奇数集对应 $1010\\dots$，$\\{2, 3\\}$ 对应 $0110000\\dots$。每个二进制序列恰好来自一个子集，所以 $\\mathcal{P}(\\mathbb{N})$ 与无限二进制序列一样多，而对角线论证说明后者不可数。相比之下，仅有限子集构成的集合可以排成一列。\n\n检验：$0110000\\dots$ 的 $1$ 恰好在第 $2$ 位和第 $3$ 位，所以它对应回 $\\{2, 3\\}$。\n\n本课我们把子集转换成二进制序列，并用二进制数给有限子集编号。",
  ),
  prerequisites: ["cantors-diagonal-argument", "power-sets"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "subsets-as-binary-sequences",
      title: t("Subsets as binary sequences", "把子集看作二进制序列"),
      explanation: t(
        "A subset $S \\subseteq \\{1, 2, 3, \\dots\\}$ corresponds to the sequence whose $n$th digit is $1$ if $n \\in S$ and $0$ otherwise. The even numbers give $0101\\dots$ and the primes give $0110101\\dots$.\n\n> **Watch out.** Digit $n$ records whether $n$ itself is in the set, starting from $n = 1$. Shifting the digits by one place, or swapping $0$s and $1$s, describes a different subset.",
        "子集 $S \\subseteq \\{1, 2, 3, \\dots\\}$ 对应这样的序列：若 $n \\in S$，第 $n$ 位为 $1$，否则为 $0$。偶数集对应 $0101\\dots$，素数集对应 $0110101\\dots$。\n\n> **注意。** 第 $n$ 位记录的是 $n$ 本身是否在集合中，从 $n = 1$ 开始。把数字错开一位，或把 $0$ 与 $1$ 对调，描述的就是另一个子集。",
      ),
      generate(rng) {
        const k = rng.int(2, 5);
        const m = rng.int(1, 6);
        const r = m % k;
        const kind = rng.int(0, 4);
        const [en, zh, test] = (
          [
            [`the multiples of $${k}$`, `$${k}$ 的倍数`, (n: number) => n % k === 0],
            [`$\\{n : n > ${m}\\}$`, `$\\{n : n > ${m}\\}$`, (n: number) => n > m],
            [`the numbers leaving remainder $${r}$ on division by $${k}$`, `除以 $${k}$ 余 $${r}$ 的数`, (n: number) => n % k === r],
            ["the perfect squares", "完全平方数", (n: number) => Number.isInteger(Math.sqrt(n))],
            [`$\\{n : n \\le ${m}\\}$`, `$\\{n : n \\le ${m}\\}$`, (n: number) => n <= m],
          ] as [string, string, (n: number) => boolean][]
        )[kind]!;
        const bits = (f: (n: number) => boolean) =>
          range(1, 8)
            .map((n) => (f(n) ? "1" : "0"))
            .join("");
        const right = bits(test);
        const members = range(1, 8).filter(test);
        const opt = (s: string) => math(`${s}\\dots`);
        const wrong: [string, string, string][] = [
          [
            bits((n) => !test(n)),
            "This marks the numbers outside the set; digit $n$ is $1$ when $n$ is in it.",
            "这标出的是集合外的数；$n$ 在集合中时第 $n$ 位才是 $1$。",
          ],
          [
            bits((n) => test(n + 1)),
            "This is shifted one place: its digit $n$ records $n + 1$.",
            "这错开了一位：它的第 $n$ 位记录的是 $n + 1$。",
          ],
          [
            bits((n) => test(n - 1)),
            "This is shifted one place: its digit $n$ records $n - 1$.",
            "这错开了一位：它的第 $n$ 位记录的是 $n - 1$。",
          ],
          [
            bits((n) => test(n) !== (n === 1)),
            "Digit $1$ is wrong here: check whether $1$ is in the set.",
            "这里第 $1$ 位错了：检查 $1$ 是否在集合中。",
          ],
          [
            bits((n) => test(n) !== (n === 8)),
            "Digit $8$ is wrong here: check whether $8$ is in the set.",
            "这里第 $8$ 位错了：检查 $8$ 是否在集合中。",
          ],
        ];
        return reasoned(
          oneOf(
            rng,
            t(
              `Under the correspondence between subsets of $\\{1, 2, 3, \\dots\\}$ and binary sequences, what are the first eight digits for ${en}?`,
              `在 $\\{1, 2, 3, \\dots\\}$ 的子集与二进制序列的对应下，${zh}对应序列的前八位是什么？`,
            ),
            opt(right),
            wrong.map(([s]) => opt(s)),
            walked(
              [
                [
                  ["Test each number", "逐个检验"],
                  t(
                    `Of $1, \\dots, 8$, the set contains $${members.join(", ")}$.`,
                    `在 $1, \\dots, 8$ 中，集合包含 $${members.join(", ")}$。`,
                  ),
                ],
                [
                  ["Write the digits", "写出数字"],
                  t(`Put $1$ in those places and $0$ elsewhere: $${right}\\dots$.`, `在这些位置写 $1$，其余写 $0$：$${right}\\dots$。`),
                ],
              ],
              t(
                `The digits contain $${members.length}$ ones, one for each of the $${members.length}$ members found, and digit $${members[0]}$ is $1$ because $${members[0]}$ is in the set.`,
                `这些数字中有 $${members.length}$ 个 $1$，与找到的 $${members.length}$ 个成员一一对应；第 $${members[0]}$ 位是 $1$，因为 $${members[0]}$ 在集合中。`,
              ),
            ),
          ),
          wrong.map(([s, wen, wzh]): Reason => [opt(s).en, wen, wzh]),
        );
      },
    },
    {
      id: "finite-subsets-are-countable",
      title: t("Finite subsets are countable", "有限子集是可数的"),
      explanation: t(
        "The map $S \\mapsto \\sum_{n \\in S} 2^{n - 1}$ is a bijection from the finite subsets of $\\{1, 2, 3, \\dots\\}$ to $\\{0, 1, 2, \\dots\\}$ (binary notation), so the finite subsets are countable. All subsets together are uncountable.\n\n> **Watch out.** Element $n$ contributes $2^{n - 1}$, not $2^n$ or $n$: element $1$ fills the units place. Only a finite subset gives a finite sum, which is why this listing does not reach the infinite subsets.",
        "映射 $S \\mapsto \\sum_{n \\in S} 2^{n - 1}$ 是从 $\\{1, 2, 3, \\dots\\}$ 的有限子集到 $\\{0, 1, 2, \\dots\\}$ 的双射（二进制表示），所以有限子集构成的集合可数。而全部子集构成的集合不可数。\n\n> **注意。** 元素 $n$ 贡献 $2^{n - 1}$，而不是 $2^n$ 或 $n$：元素 $1$ 占个位。只有有限子集的和才是有限的，所以这种排列取不到无限子集。",
      ),
      generate(rng) {
        if (rng.bool()) {
          const S = range(1, 9).filter(() => rng.bool());
          if (S.length === 0) S.push(rng.int(1, 9));
          const v = S.reduce((s, n) => s + 2 ** (n - 1), 0);
          const powers = S.map((n) => `2^{${n - 1}}`).join(" + ");
          return numberProblem({
            prompt: t(
              `Under $S \\mapsto \\sum_{n \\in S} 2^{n - 1}$, what number corresponds to $S = ${setTex(S)}$?`,
              `在映射 $S \\mapsto \\sum_{n \\in S} 2^{n - 1}$ 下，$S = ${setTex(S)}$ 对应哪个数？`,
            ),
            answer: v,
            wrong: [v + 1],
            mistakes: apart(v, [
              why(
                S.reduce((s, n) => s + 2 ** n, 0),
                "That uses $2^n$; element $n$ contributes $2^{n - 1}$.",
                "这用了 $2^n$；元素 $n$ 贡献的是 $2^{n - 1}$。",
              ),
              why(
                S.reduce((s, n) => s + n, 0),
                "That adds the elements; each element $n$ contributes the power $2^{n - 1}$.",
                "这是把元素相加；每个元素 $n$ 贡献的是幂 $2^{n - 1}$。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Write the powers", "写出各次幂"],
                  t(`Each element $n$ of $S$ contributes $2^{n - 1}$: $${powers}$.`, `$S$ 的每个元素 $n$ 贡献 $2^{n - 1}$：$${powers}$。`),
                ],
                [["Add", "相加"], t(`$${powers} = ${v}$.`, `$${powers} = ${v}$。`)],
              ],
              t(
                `$${v}$ in binary is $${v.toString(2)}$; reading from the right, its $1$s sit in places $${S.join(", ")}$, the elements of $S$.`,
                `$${v}$ 的二进制是 $${v.toString(2)}$；从右往左数，$1$ 在第 $${S.join(", ")}$ 位，正是 $S$ 的元素。`,
              ),
            ),
          });
        }
        const v = rng.int(1, 511);
        const S = range(1, 9).filter((n) => (v >> (n - 1)) & 1);
        const powers = S.map((n) => `2^{${n - 1}}`).join(" + ");
        return setProblem({
          prompt: t(
            `Under $S \\mapsto \\sum_{n \\in S} 2^{n - 1}$, which finite set corresponds to $${v}$?`,
            `在映射 $S \\mapsto \\sum_{n \\in S} 2^{n - 1}$ 下，哪个有限集对应 $${v}$？`,
          ),
          values: S,
          wrong: [S.map((n) => n - 1), S.map((n) => n + 1)],
          mistakes: [
            [
              S.map((n) => n - 1),
              "Those are the exponents; the power $2^{k}$ comes from element $k + 1$.",
              "这些是指数；幂 $2^{k}$ 来自元素 $k + 1$。",
            ],
            [S.map((n) => n + 1), "Each element is one more than its exponent, not two more.", "每个元素比它的指数大一，而不是大二。"],
          ],
          solution: walked(
            [
              [
                ["Write in binary", "写成二进制"],
                t(`$${v} = ${v.toString(2)}_2 = ${powers}$.`, `$${v} = ${v.toString(2)}_2 = ${powers}$。`),
              ],
              [
                ["Read off the elements", "读出元素"],
                t(
                  `Each power $2^{k}$ comes from element $k + 1$, so $S = ${setTex(S)}$.`,
                  `每个幂 $2^{k}$ 来自元素 $k + 1$，所以 $S = ${setTex(S)}$。`,
                ),
              ],
            ],
            t(`$${powers} = ${v}$.`, `$${powers} = ${v}$。`),
          ),
        });
      },
    },
  ],
};

/** CantorClaim is a statement about A and 𝒫(A), whether it is true, why, and what is wrong with the other answer. */
type CantorClaim = readonly [claim: Text, value: boolean, why: Text, other: readonly [string, string]];

/** cantorsTheorem proves |A| < |𝒫(A)|. */
export const cantorsTheorem: TopicDef = {
  id: "cantors-theorem",
  title: t("Cantor's Theorem", "康托尔定理"),
  summary: t(
    "For every set A, no function A → 𝒫(A) is onto: the set D = {a ∈ A : a ∉ f(a)} is never an output. So |A| < |𝒫(A)|.",
    "对每个集合 A，任何函数 A → 𝒫(A) 都不是满射：集合 D = {a ∈ A : a ∉ f(a)} 永远不是输出。所以 |A| < |𝒫(A)|。",
  ),
  intro: t(
    "Take $A = \\{1, 2, 3\\}$ with $f(1) = \\{2\\}$, $f(2) = \\{1, 2, 3\\}$ and $f(3) = \\{1\\}$. Collect the elements that are not in their own image: $1 \\notin f(1)$ and $3 \\notin f(3)$, but $2 \\in f(2)$, so $D = \\{1, 3\\}$. Then $D$ disagrees with $f(1)$ about $1$, with $f(2)$ about $2$ and with $f(3)$ about $3$, so $D$ is not an output of $f$. The same construction defeats every $f: A \\to \\mathcal{P}(A)$, for every set $A$.\n\nCheck: $1 \\in D$ but $1 \\notin f(1)$, so $D \\ne f(1)$; $2 \\notin D$ but $2 \\in f(2)$, so $D \\ne f(2)$.\n\nIn this lesson we build the diagonal set of a function into a power set, and draw the consequences of Cantor's theorem.",
    "取 $A = \\{1, 2, 3\\}$，$f(1) = \\{2\\}$，$f(2) = \\{1, 2, 3\\}$，$f(3) = \\{1\\}$。把不在自己像中的元素收集起来：$1 \\notin f(1)$，$3 \\notin f(3)$，但 $2 \\in f(2)$，所以 $D = \\{1, 3\\}$。于是 $D$ 在 $1$ 上与 $f(1)$ 不同，在 $2$ 上与 $f(2)$ 不同，在 $3$ 上与 $f(3)$ 不同，所以 $D$ 不是 $f$ 的输出。同样的构造对每个集合 $A$ 的每个 $f: A \\to \\mathcal{P}(A)$ 都有效。\n\n检验：$1 \\in D$ 但 $1 \\notin f(1)$，所以 $D \\ne f(1)$；$2 \\notin D$ 但 $2 \\in f(2)$，所以 $D \\ne f(2)$。\n\n本课我们构造到幂集的函数的对角集，并推出康托尔定理的推论。",
  ),
  prerequisites: ["the-cardinality-of-the-power-set-of-natural-numbers", "the-cantor-bernstein-schroder-theorem"],
  encompasses: [{ topic: "cantors-diagonal-argument", weight: 0.2 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-diagonal-set",
      title: t("The diagonal set", "对角集"),
      explanation: t(
        "The diagonal set differs from every image set at one element, so no function from a set onto its power set can exist. For $f: A \\to \\mathcal{P}(A)$, let $D = \\{a \\in A : a \\notin f(a)\\}$. If $D = f(d)$, then $d \\in D \\iff d \\notin f(d) = D$, a contradiction. With $f(1) = \\{1, 2\\}$, $f(2) = \\{3\\}$, $f(3) = \\varnothing$: $D = \\{2, 3\\}$, which is not $f(1)$, $f(2)$ or $f(3)$.\n\n> **Watch out.** Each $a$ is tested against its own image $f(a)$ only. $D$ collects the $a$ with $a \\notin f(a)$; the elements that lie in no image at all form a different set.",
        "对角集合与每个像集合都在某个元素上不同，所以不存在从一个集合到它的幂集的满射。对 $f: A \\to \\mathcal{P}(A)$，令 $D = \\{a \\in A : a \\notin f(a)\\}$。若 $D = f(d)$，则 $d \\in D \\iff d \\notin f(d) = D$，矛盾。若 $f(1) = \\{1, 2\\}$，$f(2) = \\{3\\}$，$f(3) = \\varnothing$，则 $D = \\{2, 3\\}$，它不等于 $f(1)$、$f(2)$、$f(3)$ 中的任何一个。\n\n> **注意。** 每个 $a$ 只和它自己的像 $f(a)$ 比较。$D$ 收集满足 $a \\notin f(a)$ 的 $a$；不在任何像中的元素构成的是另一个集合。",
      ),
      generate(rng) {
        const n = rng.int(3, 5);
        const A = range(1, n);
        const f = A.map(() => A.filter(() => rng.bool()));
        const own = (a: number) => f[a - 1]!.includes(a);
        const D = A.filter((a) => !own(a));
        const inOwn = A.filter(own);
        const inNone = A.filter((a) => !f.some((s) => s.includes(a)));
        return setProblem({
          prompt: t(
            `Let $A = ${setTex(A)}$ and $f: A \\to \\mathcal{P}(A)$ with ${f.map((s, i) => `$f(${i + 1}) = ${setTex(s)}$`).join(", ")}. Find $D = \\{a \\in A : a \\notin f(a)\\}$.`,
            `设 $A = ${setTex(A)}$，$f: A \\to \\mathcal{P}(A)$，其中 ${f.map((s, i) => `$f(${i + 1}) = ${setTex(s)}$`).join("，")}。求 $D = \\{a \\in A : a \\notin f(a)\\}$。`,
          ),
          values: D,
          wrong: [inOwn, inNone],
          mistakes: [
            [
              inOwn,
              "Those are the $a$ with $a \\in f(a)$; $D$ takes the ones not in their own image.",
              "这些是满足 $a \\in f(a)$ 的 $a$；$D$ 取的是不在自己像中的元素。",
            ],
            [
              inNone,
              "Those are the elements in no image at all; each $a$ is tested against $f(a)$ only.",
              "这些是不在任何像中的元素；每个 $a$ 只和 $f(a)$ 比较。",
            ],
          ],
          solution: walked(
            [
              [
                ["Test each element", "逐个检验"],
                t(
                  `${A.map((a) => `$${a} ${own(a) ? "\\in" : "\\notin"} f(${a})$`).join(", ")}.`,
                  `${A.map((a) => `$${a} ${own(a) ? "\\in" : "\\notin"} f(${a})$`).join("，")}。`,
                ),
              ],
              [
                ["Collect", "收集"],
                t(`The elements not in their own image give $D = ${setTex(D)}$.`, `不在自己像中的元素组成 $D = ${setTex(D)}$。`),
              ],
            ],
            t(
              `$D$ disagrees with each $f(a)$ about $a$ itself: ${A.map((a) => (own(a) ? `$${a} \\in f(${a})$ but $${a} \\notin D$` : `$${a} \\in D$ but $${a} \\notin f(${a})$`)).join("; ")}.`,
              `$D$ 与每个 $f(a)$ 在 $a$ 本身上不同：${A.map((a) => (own(a) ? `$${a} \\in f(${a})$ 但 $${a} \\notin D$` : `$${a} \\in D$ 但 $${a} \\notin f(${a})$`)).join("；")}。`,
            ),
          ),
        });
      },
    },
    {
      id: "consequences-of-cantors-theorem",
      title: t("Consequences", "推论"),
      explanation: t(
        "$a \\mapsto \\{a\\}$ injects $A$ into $\\mathcal{P}(A)$, and Cantor's theorem rules out a surjection, so $|A| < |\\mathcal{P}(A)|$. Hence $|\\mathbb{N}| < |\\mathcal{P}(\\mathbb{N})| < |\\mathcal{P}(\\mathcal{P}(\\mathbb{N}))| < \\cdots$: there is no largest cardinality.\n\n> **Watch out.** Cantor's theorem rules out a surjection $A \\to \\mathcal{P}(A)$, not an injection. So $|A| \\le |\\mathcal{P}(A)|$ holds, equality fails, and the inequality is strict for every set, infinite ones included.",
        "$a \\mapsto \\{a\\}$ 把 $A$ 单射到 $\\mathcal{P}(A)$ 中，而康托尔定理排除了满射，所以 $|A| < |\\mathcal{P}(A)|$。因此 $|\\mathbb{N}| < |\\mathcal{P}(\\mathbb{N})| < |\\mathcal{P}(\\mathcal{P}(\\mathbb{N}))| < \\cdots$：没有最大的基数。\n\n> **注意。** 康托尔定理排除的是满射 $A \\to \\mathcal{P}(A)$，而不是单射。所以 $|A| \\le |\\mathcal{P}(A)|$ 成立，相等不成立，而且对每个集合（包括无限集）这个不等式都是严格的。",
      ),
      generate(rng) {
        const sets = ["\\mathbb{N}", "\\mathbb{Z}", "\\mathbb{Q}", "\\mathbb{R}", "\\mathcal{P}(\\mathbb{R})", "\\mathbb{R}^2"];
        const A = rng.pick(sets);
        const claims: CantorClaim[] = [
          [
            t(`There is a surjection from $${A}$ onto $\\mathcal{P}(${A})$.`, `存在从 $${A}$ 到 $\\mathcal{P}(${A})$ 的满射。`),
            false,
            t(
              "Cantor's theorem: no function $A \\to \\mathcal{P}(A)$ is onto.",
              "康托尔定理：任何函数 $A \\to \\mathcal{P}(A)$ 都不是满射。",
            ),
            [
              "The diagonal set $\\{a : a \\notin f(a)\\}$ is never an output of any $f: A \\to \\mathcal{P}(A)$.",
              "对角集 $\\{a : a \\notin f(a)\\}$ 永远不是任何 $f: A \\to \\mathcal{P}(A)$ 的输出。",
            ],
          ],
          [
            t(`There is an injection from $${A}$ into $\\mathcal{P}(${A})$.`, `存在从 $${A}$ 到 $\\mathcal{P}(${A})$ 的单射。`),
            true,
            t("The map $a \\mapsto \\{a\\}$ is such an injection.", "映射 $a \\mapsto \\{a\\}$ 就是这样的单射。"),
            [
              "Sending each element to its own one-element set never sends two elements to the same set.",
              "把每个元素送到只含它自己的单元素集，不会把两个元素送到同一个集合。",
            ],
          ],
          [
            t(`$|${A}| = |\\mathcal{P}(${A})|$.`, `$|${A}| = |\\mathcal{P}(${A})|$。`),
            false,
            t("The inequality is strict, which rules out equality.", "不等式是严格的，排除了相等。"),
            [
              "Equal cardinality needs a bijection, and Cantor's theorem rules out even a surjection.",
              "等势需要双射，而康托尔定理连满射都排除了。",
            ],
          ],
          [
            t(
              `$|\\mathcal{P}(${A})| < |\\mathcal{P}(\\mathcal{P}(${A}))|$.`,
              `$|\\mathcal{P}(${A})| < |\\mathcal{P}(\\mathcal{P}(${A}))|$。`,
            ),
            true,
            t("Apply the theorem with $\\mathcal{P}(A)$ in place of $A$.", "把定理中的 $A$ 换成 $\\mathcal{P}(A)$。"),
            ["Cantor's theorem holds for every set, including a power set.", "康托尔定理对每个集合都成立，幂集也不例外。"],
          ],
          [
            t(
              `Some set has cardinality larger than every other set, including $\\mathcal{P}(${A})$.`,
              `存在一个集合，其基数大于包括 $\\mathcal{P}(${A})$ 在内的所有其他集合。`,
            ),
            false,
            t(
              "For any set $S$, $\\mathcal{P}(S)$ is strictly larger, so no set is largest.",
              "对任何集合 $S$，$\\mathcal{P}(S)$ 都严格更大，所以没有最大的集合。",
            ),
            [
              "Whatever set is proposed as the largest, its power set is strictly larger.",
              "无论把哪个集合当作最大的，它的幂集都严格更大。",
            ],
          ],
        ];
        const [claim, value, reason, [wen, wzh]] = rng.pick(claims);
        const options = [t("True", "真"), t("False", "假")];
        const right = options[value ? 0 : 1]!;
        const wrong = options[value ? 1 : 0]!;
        return reasoned(
          oneOf(
            rng,
            t(`True or false? ${claim.en}`, `判断真假：${claim["zh-CN"]}`),
            right,
            [wrong],
            walked(
              [
                [
                  ["Recall the theorem", "回顾定理"],
                  t(
                    "No $f: A \\to \\mathcal{P}(A)$ is onto, while $a \\mapsto \\{a\\}$ is one-to-one, so $|A| < |\\mathcal{P}(A)|$ for every set $A$.",
                    "任何 $f: A \\to \\mathcal{P}(A)$ 都不是满射，而 $a \\mapsto \\{a\\}$ 是单射，所以对每个集合 $A$ 都有 $|A| < |\\mathcal{P}(A)|$。",
                  ),
                ],
                [
                  ["Apply it", "应用定理"],
                  t(
                    `${reason.en} So the statement is ${value ? "true" : "false"}.`,
                    `${reason["zh-CN"]}所以这个命题为${value ? "真" : "假"}。`,
                  ),
                ],
              ],
              t(
                "For a finite set with $3$ elements, the power set has $2^3 = 8$ elements, and $3 < 8$, in line with $|A| < |\\mathcal{P}(A)|$.",
                "对有 $3$ 个元素的有限集，幂集有 $2^3 = 8$ 个元素，而 $3 < 8$，与 $|A| < |\\mathcal{P}(A)|$ 一致。",
              ),
            ),
          ),
          [[wrong.en, wen, wzh]],
        );
      },
    },
  ],
};

/** methodsOfProofFunctionTopics are the new topics of Methods of Proof unit 5. */
export const methodsOfProofFunctionTopics: readonly TopicDef[] = [
  theLimitOfANullSequence,
  provingTheLimitOfANullSequence,
  provingTheFiniteLimitOfASequence,
  infiniteLimitsOfSequences,
  provingASequenceHasAnInfiniteLimit,
  injections,
  provingInjectivity,
  surjections,
  intoFunctions,
  provingSurjectivity,
  bijections,
  theFloorAndCeilingFunctions,
  discreteInfiniteSetsWithEqualCardinality,
  continuousInfiniteSetsWithEqualCardinality,
  cardinalityOfTheNaturalNumbersIntegersAndRationals,
  cantorsDiagonalArgument,
  theCantorBernsteinSchroderTheorem,
  theCardinalityOfThePowerSetOfNaturalNumbers,
  cantorsTheorem,
];
