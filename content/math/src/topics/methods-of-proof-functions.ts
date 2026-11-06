import type { Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { proofDrawings1 } from "../explanation-drawings-methods-of-proof-1.ts";

import { numberProblem, yesNo } from "../problems.ts";
import { reasoned } from "../wrong-reasons.ts";
import { oneOf } from "./calculus-common.ts";
import { range, setProblem, setTex } from "./methods-of-proof-common.ts";
import { gcd } from "./methods-of-proof-number-theory.ts";

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
}

/** nullSeq picks a sequence that tends to 0. */
function nullSeq(rng: Rng): NullSeq {
  const c = rng.int(1, 9);
  const k = rng.int(0, 9);
  const kind = rng.int(0, 2);
  if (kind === 0) return { tex: `\\dfrac{${c}}{n${signed(k)}}`, at: (n) => c / (n + k) };
  if (kind === 1) return { tex: `\\dfrac{${c}}{n^2${signed(k)}}`, at: (n) => c / (n * n + k) };
  return { tex: `\\dfrac{(-1)^n \\cdot ${c}}{n${signed(k)}}`, at: (n) => c / (n + k) };
}

/** theLimitOfANullSequence defines convergence to 0 with ε and N. */
export const theLimitOfANullSequence: TopicDef = {
  id: "the-limit-of-a-null-sequence",
  title: t("The Limit of a Null Sequence", "零数列的极限"),
  summary: t(
    "aₙ → 0 means: for every ε > 0 there is an N such that |aₙ| < ε for all n ≥ N.",
    "aₙ → 0 的意思是：对每个 ε > 0，存在 N，使得对所有 n ≥ N 都有 |aₙ| < ε。",
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
        "For a particular tolerance, solve the inequality for the index to find how far along the sequence you must go. For $a_n = \\dfrac{3}{n}$ and $\\varepsilon = \\dfrac{1}{10}$: $\\dfrac{3}{n} < \\dfrac{1}{10}$ exactly when $n > 30$, so the smallest $N$ that works is $31$.",
        "对于一个具体的容差，解关于下标的不等式，就知道需要沿着序列走多远。对 $a_n = \\dfrac{3}{n}$ 与 $\\varepsilon = \\dfrac{1}{10}$：$\\dfrac{3}{n} < \\dfrac{1}{10}$ 当且仅当 $n > 30$，所以可行的最小 $N$ 是 $31$。",
      ),
      generate(rng) {
        const s = nullSeq(rng);
        const m = rng.pick([10, 20, 50, 100, 200, 1000]);
        const N = firstN((n) => Math.abs(s.at(n)) * m < 1 - 1e-12);
        return numberProblem({
          prompt: t(
            `Let $a_n = ${s.tex}$ and $\\varepsilon = \\dfrac{1}{${m}}$. Find the smallest positive integer $N$ such that $|a_n| < \\varepsilon$ for all $n \\ge N$.`,
            `设 $a_n = ${s.tex}$，$\\varepsilon = \\dfrac{1}{${m}}$。求最小的正整数 $N$，使得对所有 $n \\ge N$ 都有 $|a_n| < \\varepsilon$。`,
          ),
          answer: N,
          wrong: [N - 1, N + 1, m],
          solution: t(
            `$|a_n|$ decreases, and $|a_{${N}}| < \\dfrac{1}{${m}} \\le |a_{${N - 1}}|$, so $N = ${N}$.`,
            `$|a_n|$ 递减，且 $|a_{${N}}| < \\dfrac{1}{${m}} \\le |a_{${N - 1}}|$，所以 $N = ${N}$。`,
          ),
        });
      },
    },
    {
      id: "the-definition-of-a-null-sequence",
      title: t("The definition", "定义"),
      explanation: t(
        "The order of quantifiers matters: $\\forall \\varepsilon > 0\\ \\exists N\\ \\forall n \\ge N: |a_n| < \\varepsilon$. $N$ may depend on $\\varepsilon$. Swapping to $\\exists N\\ \\forall \\varepsilon$ would force $a_n = 0$ from some point on.",
        "量词顺序很重要：$\\forall \\varepsilon > 0\\ \\exists N\\ \\forall n \\ge N: |a_n| < \\varepsilon$。$N$ 可以依赖于 $\\varepsilon$。若换成 $\\exists N\\ \\forall \\varepsilon$，就会迫使 $a_n$ 从某项起全为 $0$。",
      ),
      generate(rng) {
        const s = nullSeq(rng);
        const a = `\\left|${s.tex}\\right|`;
        const pick = rng.int(0, 1);
        const right =
          pick === 0
            ? `\\forall \\varepsilon > 0\\ \\exists N\\ \\forall n \\ge N:\\ ${a} < \\varepsilon`
            : `\\forall \\varepsilon > 0\\ \\exists N\\ \\forall n > N:\\ ${a} < \\varepsilon`;
        return oneOf(
          rng,
          t(`Which statement says that $${s.tex} \\to 0$?`, `哪个命题表示 $${s.tex} \\to 0$？`),
          math(right),
          [
            math(`\\exists N\\ \\forall \\varepsilon > 0\\ \\forall n \\ge N:\\ ${a} < \\varepsilon`),
            math(`\\forall \\varepsilon > 0\\ \\forall N\\ \\exists n \\ge N:\\ ${a} < \\varepsilon`),
            math(`\\exists \\varepsilon > 0\\ \\exists N\\ \\forall n \\ge N:\\ ${a} < \\varepsilon`),
          ],
          t(
            "Every tolerance $\\varepsilon$ must be met by all terms from some point $N$ on, and $N$ is chosen after $\\varepsilon$.",
            "每个容差 $\\varepsilon$ 都必须从某个 $N$ 起被所有项满足，而 $N$ 是在 $\\varepsilon$ 之后选取的。",
          ),
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
  prerequisites: ["the-limit-of-a-null-sequence"],
  encompasses: [{ topic: "the-limit-of-a-null-sequence", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "choosing-n-in-terms-of-epsilon",
      title: t("Choosing $N$ in terms of $\\varepsilon$", "用 $\\varepsilon$ 表示 $N$"),
      explanation: t(
        "A convergence proof must work for every tolerance, so solve the inequality symbolically and choose the index as a formula in the tolerance. To prove $\\dfrac{5}{n + 2} \\to 0$: given $\\varepsilon > 0$, $\\dfrac{5}{n + 2} < \\varepsilon \\iff n > \\dfrac{5}{\\varepsilon} - 2$. So choose any integer $N > \\dfrac{5}{\\varepsilon} - 2$.",
        "收敛性证明必须对每个容差都成立，所以要符号化地解不等式，把下标选成关于容差的公式。证明 $\\dfrac{5}{n + 2} \\to 0$：给定 $\\varepsilon > 0$，$\\dfrac{5}{n + 2} < \\varepsilon \\iff n > \\dfrac{5}{\\varepsilon} - 2$。所以取任意整数 $N > \\dfrac{5}{\\varepsilon} - 2$。",
      ),
      generate(rng) {
        const c = rng.int(2, 9);
        const k = rng.int(1, 9);
        const square = rng.bool();
        const tex = square ? `\\dfrac{${c}}{n^2 + ${k}}` : `\\dfrac{${c}}{n + ${k}}`;
        const right = square ? `\\sqrt{\\dfrac{${c}}{\\varepsilon} - ${k}}` : `\\dfrac{${c}}{\\varepsilon} - ${k}`;
        const wrong = square
          ? [`\\sqrt{\\dfrac{1}{\\varepsilon} - ${k}}`, `\\sqrt{${c}\\varepsilon - ${k}}`, `\\sqrt{\\dfrac{${c}}{\\varepsilon}} - ${k}`]
          : [`${c}\\varepsilon - ${k}`, `\\dfrac{\\varepsilon}{${c}} - ${k}`, `\\dfrac{1}{\\varepsilon} - ${k}`];
        return oneOf(
          rng,
          t(
            `To prove $${tex} \\to 0$, given $\\varepsilon > 0$${square ? " (small enough that the expressions are defined)" : ""}, which condition on $N$ works?`,
            `为证明 $${tex} \\to 0$，给定 $\\varepsilon > 0$${square ? "（足够小，使表达式有意义）" : ""}，对 $N$ 的哪个条件可行？`,
          ),
          math(`N > ${right}`),
          wrong.map((w) => math(`N > ${w}`)),
          t(
            `$${tex} < \\varepsilon \\iff ${square ? "n^2" : "n"} + ${k} > \\dfrac{${c}}{\\varepsilon} \\iff n > ${right}$.`,
            `$${tex} < \\varepsilon \\iff ${square ? "n^2" : "n"} + ${k} > \\dfrac{${c}}{\\varepsilon} \\iff n > ${right}$。`,
          ),
        );
      },
    },
    {
      id: "bounding-the-terms",
      title: t("Bounding the terms", "放大各项"),
      explanation: t(
        "When $|a_n|$ is hard to solve, bound it: $\\left|\\dfrac{\\sin n}{n^2 + 3}\\right| \\le \\dfrac{1}{n^2 + 3} < \\dfrac{1}{n^2}$. Then $\\dfrac{1}{n^2} < \\varepsilon$ is easy to solve, and any $N$ that works for the bound works for $a_n$.",
        "当 $|a_n|$ 不好直接求解时，先放大：$\\left|\\dfrac{\\sin n}{n^2 + 3}\\right| \\le \\dfrac{1}{n^2 + 3} < \\dfrac{1}{n^2}$。$\\dfrac{1}{n^2} < \\varepsilon$ 很好解，对上界可行的 $N$ 对 $a_n$ 也可行。",
      ),
      generate(rng) {
        const c = rng.int(1, 9);
        const k = rng.int(1, 9);
        const p = rng.int(1, 3);
        const top = rng.pick([`\\sin n`, `\\cos n`, `(-1)^n`]);
        const pw = p === 1 ? "n" : `n^{${p}}`;
        const tex = `\\dfrac{${c}${top === "(-1)^n" ? " \\cdot " : ""}${top}}{${pw} + ${k}}`;
        return oneOf(
          rng,
          t(
            `Which is a valid bound for $\\left|${tex}\\right|$ when $n \\ge 1$?`,
            `当 $n \\ge 1$ 时，哪个是 $\\left|${tex}\\right|$ 的正确上界？`,
          ),
          math(`\\dfrac{${c}}{${pw}}`),
          [
            math(`\\dfrac{${c}}{${pw} + ${k + 1}}`),
            math(`\\dfrac{1}{${pw} + ${k}}`),
            math(`\\dfrac{${c}}{${p === 1 ? `${k + 1}` : `n^{${p + 1}}`}}`),
          ],
          t(
            `$|${top}| \\le 1$ and $${pw} + ${k} > ${pw}$, so $\\left|${tex}\\right| \\le \\dfrac{${c}}{${pw} + ${k}} < \\dfrac{${c}}{${pw}}$.`,
            `$|${top}| \\le 1$ 且 $${pw} + ${k} > ${pw}$，所以 $\\left|${tex}\\right| \\le \\dfrac{${c}}{${pw} + ${k}} < \\dfrac{${c}}{${pw}}$。`,
          ),
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
  prerequisites: ["proving-the-limit-of-a-null-sequence"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "simplifying-the-distance-to-the-limit",
      title: t("Simplifying $|a_n - L|$", "化简 $|a_n - L|$"),
      explanation: t(
        "Combining the term and the limit over a common denominator gives a simple expression for the distance, which is easier to bound. For $a_n = \\dfrac{2n + 1}{n + 3}$ and $L = 2$: $a_n - 2 = \\dfrac{2n + 1 - 2(n + 3)}{n + 3} = \\dfrac{-5}{n + 3}$, so $|a_n - 2| = \\dfrac{5}{n + 3}$.",
        "把项和极限通分合并，就得到距离的简单表达式，它更容易估计上界。对 $a_n = \\dfrac{2n + 1}{n + 3}$ 与 $L = 2$：$a_n - 2 = \\dfrac{2n + 1 - 2(n + 3)}{n + 3} = \\dfrac{-5}{n + 3}$，所以 $|a_n - 2| = \\dfrac{5}{n + 3}$。",
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
        return oneOf(
          rng,
          t(
            `Let $a_n = ${tex}$, which tends to $${p}$. What is $|a_n - ${p}|$ for $n \\ge 1$?`,
            `设 $a_n = ${tex}$，它趋于 $${p}$。当 $n \\ge 1$ 时，$|a_n - ${p}|$ 等于什么？`,
          ),
          math(`\\dfrac{${num}}{n + ${s}}`),
          [
            math(`\\dfrac{${Math.abs(q + p * s)}}{n + ${s}}`),
            math(`\\dfrac{${Math.abs(q - s)}}{n + ${s}}`),
            math(`\\dfrac{${num}}{${p}(n + ${s})}`),
            math(`\\dfrac{${Math.abs(q)}}{n + ${s}}`),
          ],
          t(
            `$a_n - ${p} = \\dfrac{${coef(p)}n${signed(q)} - ${p}(n + ${s})}{n + ${s}} = \\dfrac{${q - p * s}}{n + ${s}}$.`,
            `$a_n - ${p} = \\dfrac{${coef(p)}n${signed(q)} - ${p}(n + ${s})}{n + ${s}} = \\dfrac{${q - p * s}}{n + ${s}}$。`,
          ),
        );
      },
    },
    {
      id: "finding-n-for-a-finite-limit",
      title: t("Finding N", "求 N"),
      explanation: t(
        "Once the distance to the limit is a simple expression, solving the inequality for the index gives the required starting point. With $|a_n - 2| = \\dfrac{5}{n + 3}$ and $\\varepsilon = \\dfrac{1}{20}$: $\\dfrac{5}{n + 3} < \\dfrac{1}{20} \\iff n + 3 > 100 \\iff n > 97$, so the smallest $N$ is $98$.",
        "一旦到极限的距离是一个简单表达式，解关于下标的不等式就得到所需的起点。由 $|a_n - 2| = \\dfrac{5}{n + 3}$ 与 $\\varepsilon = \\dfrac{1}{20}$：$\\dfrac{5}{n + 3} < \\dfrac{1}{20} \\iff n + 3 > 100 \\iff n > 97$，所以最小的 $N$ 是 $98$。",
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
        return numberProblem({
          prompt: t(
            `Let $a_n = \\dfrac{${coef(p)}n${signed(q)}}{n + ${s}}$ and $\\varepsilon = \\dfrac{1}{${m}}$. Find the smallest positive integer $N$ with $|a_n - ${p}| < \\varepsilon$ for all $n \\ge N$.`,
            `设 $a_n = \\dfrac{${coef(p)}n${signed(q)}}{n + ${s}}$，$\\varepsilon = \\dfrac{1}{${m}}$。求最小的正整数 $N$，使得对所有 $n \\ge N$ 有 $|a_n - ${p}| < \\varepsilon$。`,
          ),
          answer: N,
          wrong: [num * m - s, num * m, N + s],
          solution: t(
            `$|a_n - ${p}| = \\dfrac{${num}}{n + ${s}} < \\dfrac{1}{${m}} \\iff n + ${s} > ${num * m} \\iff n > ${num * m - s}$, so $N = ${N}$.`,
            `$|a_n - ${p}| = \\dfrac{${num}}{n + ${s}} < \\dfrac{1}{${m}} \\iff n + ${s} > ${num * m} \\iff n > ${num * m - s}$，所以 $N = ${N}$。`,
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
  prerequisites: ["the-limit-of-a-null-sequence"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "finding-n-for-a-given-m",
      title: t("Finding N for a given M", "对给定的 M 求 N"),
      explanation: t(
        "For a sequence tending to infinity, each bound must eventually be exceeded, so solve for the index past which the terms stay above it. For $a_n = 3n - 7$ and $M = 50$: $3n - 7 > 50 \\iff n > 19$, so the smallest $N$ with $a_n > 50$ for all $n \\ge N$ is $20$.",
        "对于趋于无穷的序列，每个界最终都会被超过，所以要解出一个下标，使得此后各项都保持在界之上。对 $a_n = 3n - 7$ 与 $M = 50$：$3n - 7 > 50 \\iff n > 19$，所以使所有 $n \\ge N$ 都满足 $a_n > 50$ 的最小 $N$ 是 $20$。",
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
        return numberProblem({
          prompt: t(
            `Let $a_n = ${tex}$ and $M = ${M}$. Find the smallest positive integer $N$ such that $a_n > M$ for all $n \\ge N$.`,
            `设 $a_n = ${tex}$，$M = ${M}$。求最小的正整数 $N$，使得对所有 $n \\ge N$ 都有 $a_n > M$。`,
          ),
          answer: N,
          wrong: [N - 1, N + 1, M],
          solution: t(
            `$a_n$ is increasing, $a_{${N}} = ${+f(N).toFixed(2)} > ${M}$${N > 1 ? ` and $a_{${N - 1}} = ${+f(N - 1).toFixed(2)} \\le ${M}$` : ""}.`,
            `$a_n$ 递增，$a_{${N}} = ${+f(N).toFixed(2)} > ${M}$${N > 1 ? `，而 $a_{${N - 1}} = ${+f(N - 1).toFixed(2)} \\le ${M}$` : ""}。`,
          ),
        });
      },
    },
    {
      id: "classifying-limits-of-sequences",
      title: t("Classifying limits", "极限的分类"),
      explanation: t(
        "A sequence may tend to a number, to $\\infty$, to $-\\infty$, or have no limit. $n^2 - 10n \\to \\infty$; $\\dfrac{3 - n^2}{n + 1} \\to -\\infty$; $(-1)^n n$ has no limit, since its terms alternate between large positive and large negative values.",
        "数列可能趋于一个数、趋于 $\\infty$、趋于 $-\\infty$，或没有极限。$n^2 - 10n \\to \\infty$；$\\dfrac{3 - n^2}{n + 1} \\to -\\infty$；$(-1)^n n$ 没有极限，因为它的项在很大的正数与很大的负数之间交替。",
      ),
      generate(rng) {
        const a = rng.int(1, 9);
        const b = rng.int(1, 20);
        const forms: [string, number][] = [
          [`n^2 - ${b}n`, 0],
          [`\\dfrac{${b} - n^2}{n + ${a}}`, 1],
          [`(-1)^n \\cdot ${a}n`, 3],
          [`\\dfrac{${a}n^2 + ${b}}{n^2 + 1}`, 2],
          [`${b} - ${a}\\sqrt{n}`, 1],
          [`\\dfrac{n^3}{${a}n^2 + ${b}}`, 0],
          [`${a} + \\dfrac{(-1)^n}{n}`, 2],
          [`(-${a})^n`, 3],
        ];
        const [tex, kind] = rng.pick(forms);
        const options = [math("\\infty"), math("-\\infty"), t("A finite number", "一个有限数"), t("No limit", "没有极限")];
        return reasoned(
          oneOf(
            rng,
            t(`What is the limit of $a_n = ${tex}$?`, `$a_n = ${tex}$ 的极限是什么？`),
            options[kind]!,
            options.filter((_, i) => i !== kind),
            [
              t("The dominant term is positive and unbounded, so $a_n \\to \\infty$.", "主导项为正且无界，所以 $a_n \\to \\infty$。"),
              t("The dominant term is negative and unbounded, so $a_n \\to -\\infty$.", "主导项为负且无界，所以 $a_n \\to -\\infty$。"),
              t("The terms settle near a single number, so the limit is finite.", "各项趋近于一个确定的数，所以极限有限。"),
              t("The terms alternate in sign while their size grows, so there is no limit.", "各项符号交替且绝对值增大，所以没有极限。"),
            ][kind]!,
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
  prerequisites: ["infinite-limits-of-sequences", "proving-the-limit-of-a-null-sequence"],
  encompasses: [{ topic: "infinite-limits-of-sequences", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "choosing-n-in-terms-of-m",
      title: t("Choosing N in terms of M", "用 M 表示 N"),
      explanation: t(
        "To prove divergence to infinity, solve the inequality for a general bound and choose the index as a formula in that bound. To prove $4\\sqrt{n} - 3 \\to \\infty$: given $M$, $4\\sqrt{n} - 3 > M \\iff n > \\left(\\dfrac{M + 3}{4}\\right)^2$ (for $M > -3$). Choose any integer $N$ larger than this.",
        "要证明发散到无穷，就对一般的界解不等式，把下标选成关于这个界的公式。证明 $4\\sqrt{n} - 3 \\to \\infty$：给定 $M$，$4\\sqrt{n} - 3 > M \\iff n > \\left(\\dfrac{M + 3}{4}\\right)^2$（当 $M > -3$ 时）。取任意大于它的整数 $N$。",
      ),
      generate(rng) {
        const p = rng.int(2, 9);
        const q = rng.int(-9, 9) || 1;
        const root = rng.bool();
        const tex = root ? `${p}\\sqrt{n}${signed(q)}` : `${p}n${signed(q)}`;
        const mq = `M${signed(-q)}`;
        const mqWrong = `M${signed(q)}`;
        const wrap = (x: string) => (root ? `\\left(${x}\\right)^2` : x);
        return oneOf(
          rng,
          t(
            `To prove $${tex} \\to \\infty$, given $M > ${q}$, which condition on $N$ works?`,
            `为证明 $${tex} \\to \\infty$，给定 $M > ${q}$，对 $N$ 的哪个条件可行？`,
          ),
          math(`N > ${wrap(`\\dfrac{${mq}}{${p}}`)}`),
          [
            // Each of these falls short for large M; a larger bound than the right one would also work.
            math(`N > ${wrap(q > 0 ? `\\dfrac{M}{${p}} - ${q}` : `\\dfrac{${mqWrong}}{${p}}`)}`),
            math(`N > ${wrap(`\\dfrac{${p}}{${mq}}`)}`),
            math(`N > ${root ? `\\dfrac{${mq}}{${p}}` : `\\sqrt{\\dfrac{${mq}}{${p}}}`}`),
          ],
          t(
            `$${tex} > M \\iff ${root ? "\\sqrt{n}" : "n"} > \\dfrac{${mq}}{${p}}${root ? ` \\iff n > ${wrap(`\\dfrac{${mq}}{${p}}`)}` : ""}$.`,
            `$${tex} > M \\iff ${root ? "\\sqrt{n}" : "n"} > \\dfrac{${mq}}{${p}}${root ? ` \\iff n > ${wrap(`\\dfrac{${mq}}{${p}}`)}` : ""}$。`,
          ),
        );
      },
    },
    {
      id: "lower-bounds-for-divergent-sequences",
      title: t("Lower bounds", "下界"),
      explanation: t(
        "When the inequality is hard to solve exactly, replace the term by a simpler expression below it that still grows without bound. To show $\\dfrac{n^2 + 5}{n + 1} \\to \\infty$, find a simpler lower bound: for $n \\ge 1$, $\\dfrac{n^2 + 5}{n + 1} > \\dfrac{n^2}{n + n} = \\dfrac{n}{2}$, and $\\dfrac{n}{2} > M$ once $n > 2M$.",
        "当不等式难以精确求解时，用一个比该项小、但仍然无界增长的简单表达式代替它。要证明 $\\dfrac{n^2 + 5}{n + 1} \\to \\infty$，先找一个更简单的下界：当 $n \\ge 1$ 时，$\\dfrac{n^2 + 5}{n + 1} > \\dfrac{n^2}{n + n} = \\dfrac{n}{2}$，而当 $n > 2M$ 时 $\\dfrac{n}{2} > M$。",
      ),
      generate(rng) {
        const a = rng.int(1, 9);
        const b = rng.int(1, 9);
        const c = rng.int(1, 5);
        const tex = `\\dfrac{${coef(c)}n^2 + ${a}}{n + ${b}}`;
        const g = gcd(c, b + 1);
        const bound = g === b + 1 ? `${coef(c / g)}n` : `\\dfrac{${coef(c / g)}n}{${(b + 1) / g}}`;
        return oneOf(
          rng,
          t(`Which is a valid lower bound for $${tex}$ when $n \\ge 1$?`, `当 $n \\ge 1$ 时，哪个是 $${tex}$ 的正确下界？`),
          math(bound),
          [math(`${coef(c)}n`), math(`\\dfrac{${coef(c)}n^2}{${b}}`), math(`${coef(c)}n + ${a}`)],
          t(
            `Drop $${a}$ from the numerator and use $n + ${b} \\le ${b + 1}n$: $${tex} > \\dfrac{${coef(c)}n^2}{${b + 1}n} = ${bound}$.`,
            `去掉分子中的 $${a}$，并利用 $n + ${b} \\le ${b + 1}n$：$${tex} > \\dfrac{${coef(c)}n^2}{${b + 1}n} = ${bound}$。`,
          ),
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

/** injections defines one-to-one functions between sets. */
export const injections: TopicDef = {
  id: "injections",
  title: t("Injections", "单射"),
  summary: t(
    "f: A → B is injective when distinct inputs give distinct outputs: f(a₁) = f(a₂) implies a₁ = a₂.",
    "若不同的输入给出不同的输出，即 f(a₁) = f(a₂) 推出 a₁ = a₂，则 f: A → B 是单射。",
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
        "A function between finite sets is injective when no output is repeated. $\\{(1, a), (2, c), (3, b)\\}$ is injective; $\\{(1, a), (2, c), (3, a)\\}$ is not, since $f(1) = f(3)$.",
        "有限集之间的函数是单射，当且仅当没有输出重复。$\\{(1, a), (2, c), (3, b)\\}$ 是单射；$\\{(1, a), (2, c), (3, a)\\}$ 不是，因为 $f(1) = f(3)$。",
      ),
      generate(rng) {
        const m = rng.int(3, 5);
        const n = rng.int(m, 6);
        const value = rng.bool();
        const f = finiteMap(rng, m, n, value, value && m === n);
        const repeat = f.domain.findIndex((_, i) => f.values.indexOf(f.values[i]!) !== i);
        return oneOf(
          rng,
          t(
            `Let $f: ${setTex(range(1, m))} \\to \\{${f.codomain.join(", ")}\\}$ be $${mapTex(f)}$. Is $f$ injective?`,
            `设 $f: ${setTex(range(1, m))} \\to \\{${f.codomain.join(", ")}\\}$ 为 $${mapTex(f)}$。$f$ 是单射吗？`,
          ),
          yesNo[value ? 0 : 1]!,
          [yesNo[value ? 1 : 0]!],
          value
            ? t(
                "Yes: the outputs are all different, so no two inputs share an output.",
                "是：所有输出都不同，所以没有两个输入对应同一个输出。",
              )
            : t(
                `No: two different inputs share an output, $f(${f.values.indexOf(f.values[repeat]!) + 1}) = f(${repeat + 1}) = ${f.values[repeat]}$.`,
                `不是：两个不同的输入对应同一个输出，$f(${f.values.indexOf(f.values[repeat]!) + 1}) = f(${repeat + 1}) = ${f.values[repeat]}$。`,
              ),
        );
      },
    },
    {
      id: "counting-injections",
      title: t("Counting injections", "统计单射个数"),
      explanation: t(
        "An injection from an $m$-element set to an $n$-element set chooses distinct values one input at a time: $n(n - 1) \\cdots (n - m + 1)$ ways. There are $5 \\cdot 4 \\cdot 3 = 60$ injections from a $3$-element set to a $5$-element set, and none if $m > n$.",
        "从 $m$ 元集到 $n$ 元集的单射，逐个为输入选择互不相同的值：共 $n(n - 1) \\cdots (n - m + 1)$ 种。从 $3$ 元集到 $5$ 元集有 $5 \\cdot 4 \\cdot 3 = 60$ 个单射；若 $m > n$ 则没有。",
      ),
      generate(rng) {
        const m = rng.int(1, 6);
        const n = rng.int(Math.max(1, m - 1), 9);
        const count = m > n ? 0 : range(n - m + 1, n).reduce((x, y) => x * y, 1);
        return numberProblem({
          prompt: t(
            `How many injective functions are there from a set with $${m}$ element${m === 1 ? "" : "s"} to a set with $${n}$ element${n === 1 ? "" : "s"}?`,
            `从含 $${m}$ 个元素的集合到含 $${n}$ 个元素的集合，有多少个单射？`,
          ),
          answer: count,
          wrong: [
            n ** m,
            m ** n,
            count === 0
              ? 1
              : count /
                Math.max(
                  1,
                  range(1, m).reduce((x, y) => x * y, 1),
                ),
          ],
          solution:
            m > n
              ? t(
                  `There are more inputs than outputs, so two inputs must share a value: $0$.`,
                  `输入比输出多，必有两个输入取相同的值：$0$ 个。`,
                )
              : t(
                  `The first input has $${n}$ choices of output, the next $${n - 1}$, and so on, since outputs may not repeat: $${range(
                    n - m + 1,
                    n,
                  )
                    .reverse()
                    .join(" \\cdot ")} = ${count}$.`,
                  `第一个输入有 $${n}$ 种输出可选，下一个有 $${n - 1}$ 种，依此类推，因为输出不能重复：$${range(n - m + 1, n)
                    .reverse()
                    .join(" \\cdot ")} = ${count}$。`,
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
  prerequisites: ["injections", "direct-proof"],
  encompasses: [{ topic: "injections", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-key-step-of-an-injectivity-proof",
      title: t("The key step", "关键一步"),
      explanation: t(
        "To prove injectivity, assume two inputs give the same output and use algebra to show the inputs must be equal. For $f(x) = \\dfrac{2x + 1}{x - 3}$ on $x \\ne 3$: if $f(a) = f(b)$, cross-multiplying gives $(2a + 1)(b - 3) = (2b + 1)(a - 3)$, which simplifies to $-7a = -7b$, so $a = b$.",
        "要证明单射，就假设两个输入给出相同的输出，再用代数证明这两个输入必然相等。对 $x \\ne 3$ 上的 $f(x) = \\dfrac{2x + 1}{x - 3}$：若 $f(a) = f(b)$，交叉相乘得 $(2a + 1)(b - 3) = (2b + 1)(a - 3)$，化简得 $-7a = -7b$，所以 $a = b$。",
      ),
      generate(rng) {
        const p = rng.int(2, 9);
        const q = rng.int(-9, 9) || 1;
        const kind = rng.int(0, 2);
        if (kind === 0) {
          return oneOf(
            rng,
            t(
              `To prove $f(x) = ${p}x${signed(q)}$ is injective, assume $f(a) = f(b)$. Which step follows?`,
              `证明 $f(x) = ${p}x${signed(q)}$ 是单射：假设 $f(a) = f(b)$。接下来是哪一步？`,
            ),
            math(`${p}a = ${p}b`),
            [math(`a${signed(q)} = b${signed(q)}`), math(`${p}a = ${p}b${signed(q)}`), math(`a = ${p}b`)],
            t(
              `$${p}a${signed(q)} = ${p}b${signed(q)}$; subtract $${q}$ to get $${p}a = ${p}b$, then divide by $${p}$.`,
              `$${p}a${signed(q)} = ${p}b${signed(q)}$；两边减 $${q}$ 得 $${p}a = ${p}b$，再除以 $${p}$。`,
            ),
          );
        }
        if (kind === 1) {
          return oneOf(
            rng,
            t(
              `To prove $f(x) = x^3${signed(q)}$ is injective on $\\mathbb{R}$, assume $f(a) = f(b)$. Which step follows?`,
              `证明 $f(x) = x^3${signed(q)}$ 在 $\\mathbb{R}$ 上是单射：假设 $f(a) = f(b)$。接下来是哪一步？`,
            ),
            math(`a^3 = b^3, \\text{ so } a = b`),
            [math(`a^2 = b^2, \\text{ so } a = b`), math(`a^3 = b^3${signed(q)}`), math(`a^3 = b^3, \\text{ so } a = \\pm b`)],
            t(
              `Subtract $${q}$: $a^3 = b^3$, and the real cube root is unique, so $a = b$.`,
              `两边减 $${q}$：$a^3 = b^3$，实数立方根唯一，所以 $a = b$。`,
            ),
          );
        }
        const c = rng.int(1, 9);
        const q2 = q === -p * c ? q + 1 : q;
        const det = -p * c - q2;
        const tex = `\\dfrac{${p}x${signed(q2)}}{x - ${c}}`;
        return oneOf(
          rng,
          t(
            `To prove $f(x) = ${tex}$ is injective on $x \\ne ${c}$, assume $f(a) = f(b)$ and cross-multiply. What does the equation simplify to?`,
            `证明 $f(x) = ${tex}$ 在 $x \\ne ${c}$ 上是单射：假设 $f(a) = f(b)$ 并交叉相乘。方程化简为什么？`,
          ),
          math(`${det}a = ${det}b`),
          [math(`${p}a = ${p}b`), math(`${-det}a = ${det}b`), math(`${p * c}a = ${q2}b`)],
          t(
            `$(${p}a${signed(q2)})(b - ${c}) = (${p}b${signed(q2)})(a - ${c})$. The $ab$ and constant terms cancel, leaving $${det}a = ${det}b$, so $a = b$.`,
            `$(${p}a${signed(q2)})(b - ${c}) = (${p}b${signed(q2)})(a - ${c})$。$ab$ 项与常数项相消，剩下 $${det}a = ${det}b$，所以 $a = b$。`,
          ),
        );
      },
    },
    {
      id: "injectivity-on-a-restricted-domain",
      figure: proofDrawings1["proving-injectivity#injectivity-on-a-restricted-domain"],
      title: t("Injectivity on a restricted domain", "限制定义域后的单射性"),
      explanation: t(
        "$f(x) = x^2 - 6x$ is not injective on $\\mathbb{R}$: $f(0) = f(6)$. On $[3, \\infty)$, to the right of the vertex, it is injective. In general a quadratic is injective on an interval exactly when the interval does not contain points on both sides of the vertex.",
        "$f(x) = x^2 - 6x$ 在 $\\mathbb{R}$ 上不是单射：$f(0) = f(6)$。在顶点右侧的 $[3, \\infty)$ 上它是单射。一般地，二次函数在一个区间上是单射，当且仅当该区间不包含顶点两侧的点。",
      ),
      generate(rng) {
        const h = rng.int(-6, 6);
        const a = rng.int(-9, 9);
        const right = rng.bool();
        const value = right ? a >= h : a <= h;
        const dom = right ? `[${a}, \\infty)` : `(-\\infty, ${a}]`;
        const tex = `x^2${h === 0 ? "" : signed(-2 * h).replace(/(\d+)$/, "$1x")}`;
        const x1 = right ? Math.max(a, h) + 1 : Math.min(a, h) - 1;
        const x2 = 2 * h - x1;
        return oneOf(
          rng,
          t(`Is $f(x) = ${tex}$ injective on $${dom}$?`, `$f(x) = ${tex}$ 在 $${dom}$ 上是单射吗？`),
          yesNo[value ? 0 : 1]!,
          [yesNo[value ? 1 : 0]!],
          value
            ? t(
                `The vertex is at $x = ${h}$, and $${dom}$ lies on one side of it, where $f$ is strictly monotonic.`,
                `顶点在 $x = ${h}$，$${dom}$ 位于顶点一侧，$f$ 在其上严格单调。`,
              )
            : t(
                `The vertex $x = ${h}$ is inside, and $f(${x1}) = f(${x2})$ with both points in the domain.`,
                `顶点 $x = ${h}$ 在区间内部，$f(${x1}) = f(${x2})$，且两点都在定义域内。`,
              ),
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
  prerequisites: ["sets-and-functions"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-surjections",
      title: t("Recognizing surjections", "识别满射"),
      explanation: t(
        "A function between finite sets is surjective when every element of the codomain appears as an output. $\\{(1, b), (2, a), (3, b)\\}$ is onto $\\{a, b\\}$ but not onto $\\{a, b, c\\}$.",
        "有限集之间的函数是满射，当且仅当陪域中每个元素都作为输出出现。$\\{(1, b), (2, a), (3, b)\\}$ 是到 $\\{a, b\\}$ 的满射，但不是到 $\\{a, b, c\\}$ 的满射。",
      ),
      generate(rng) {
        const n = rng.int(2, 4);
        const m = rng.int(n, 6);
        const value = rng.bool();
        const f = finiteMap(rng, m, n, m === n ? value : false, value);
        const missing = f.codomain.filter((c) => !f.values.includes(c));
        return oneOf(
          rng,
          t(
            `Let $f: ${setTex(range(1, m))} \\to \\{${f.codomain.join(", ")}\\}$ be $${mapTex(f)}$. Is $f$ surjective?`,
            `设 $f: ${setTex(range(1, m))} \\to \\{${f.codomain.join(", ")}\\}$ 为 $${mapTex(f)}$。$f$ 是满射吗？`,
          ),
          yesNo[value ? 0 : 1]!,
          [yesNo[value ? 1 : 0]!],
          value
            ? t("Yes: every element of the codomain is an output.", "是：陪域中的每个元素都是输出。")
            : t(`No: $${missing[0]}$ is not an output.`, `不是：$${missing[0]}$ 不是任何输入的输出。`),
        );
      },
    },
    {
      id: "counting-surjections",
      title: t("Counting surjections", "统计满射个数"),
      explanation: t(
        "Count all functions and subtract those that miss an output. From $m$ elements onto $2$: $2^m - 2$. Onto $3$: $3^m - 3 \\cdot 2^m + 3$. Onto $4$: $4^m - 4 \\cdot 3^m + 6 \\cdot 2^m - 4$, by inclusion–exclusion.",
        "先数所有函数，再减去漏掉某个输出的函数。从 $m$ 个元素到 $2$ 个元素的满射有 $2^m - 2$ 个；到 $3$ 个元素有 $3^m - 3 \\cdot 2^m + 3$ 个；到 $4$ 个元素有 $4^m - 4 \\cdot 3^m + 6 \\cdot 2^m - 4$ 个（容斥原理）。",
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
          answer: missing ? n ** m - count : count,
          wrong: missing ? [count, n, n ** m - n] : [n ** m, n ** m - n, m ** n],
          solution: missing
            ? t(
                `There are $${n}^{${m}} = ${n ** m}$ functions and $${formula} = ${count}$ surjections, so $${n ** m - count}$ are not onto.`,
                `共有 $${n}^{${m}} = ${n ** m}$ 个函数，其中满射有 $${formula} = ${count}$ 个，所以非满射有 $${n ** m - count}$ 个。`,
              )
            : t(
                `By inclusion–exclusion, subtract from all $${n}^{${m}}$ functions those that miss at least one of the $${n}$ outputs: $${formula} = ${count}$.`,
                `由容斥原理，从全部 $${n}^{${m}}$ 个函数中去掉至少漏掉 $${n}$ 个输出之一的函数：$${formula} = ${count}$。`,
              ),
        });
      },
    },
  ],
};

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
  prerequisites: ["surjections"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "values-outside-the-range",
      title: t("Values outside the range", "值域之外的值"),
      explanation: t(
        "A function fails to be onto when some value of the codomain is never an output, so one such value is enough to show it. $f: \\mathbb{Z} \\to \\mathbb{Z}$, $f(n) = 3n + 1$ has range $\\{\\dots, -2, 1, 4, 7, \\dots\\}$, so $f$ is into: $5$ is not an output, since $3n + 1 = 5$ has no integer solution.",
        "如果陪域中有某个值从来不是输出，函数就不是满射，所以找到一个这样的值就足以说明。$f: \\mathbb{Z} \\to \\mathbb{Z}$，$f(n) = 3n + 1$ 的值域是 $\\{\\dots, -2, 1, 4, 7, \\dots\\}$，所以 $f$ 不是满射：$5$ 不是输出，因为 $3n + 1 = 5$ 没有整数解。",
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
        return oneOf(
          rng,
          t(
            `For $f: \\mathbb{Z} \\to \\mathbb{Z}$, $f(n) = ${k}n${signed(c)}$, which integer is not in the range?`,
            `对 $f: \\mathbb{Z} \\to \\mathbb{Z}$，$f(n) = ${k}n${signed(c)}$，哪个整数不在值域中？`,
          ),
          math(`${out}`),
          ins.map((v) => math(`${v}`)),
          t(
            `$${k}n${signed(c)} = ${out}$ gives $n = ${out - c}/${k}$, not an integer. The others are $f(${(ins[0]! - c) / k})$, $f(${(ins[1]! - c) / k})$, $f(${(ins[2]! - c) / k})$.`,
            `$${k}n${signed(c)} = ${out}$ 得 $n = ${out - c}/${k}$，不是整数。其余分别是 $f(${(ins[0]! - c) / k})$、$f(${(ins[1]! - c) / k})$、$f(${(ins[2]! - c) / k})$。`,
          ),
        );
      },
    },
    {
      id: "deciding-whether-a-function-is-into",
      title: t("Into or onto?", "满射与否"),
      explanation: t(
        "The answer depends on the codomain. $f(x) = x^2$ is into as a function $\\mathbb{R} \\to \\mathbb{R}$ (no output is negative) but onto as a function $\\mathbb{R} \\to [0, \\infty)$.",
        "答案取决于陪域。$f(x) = x^2$ 作为 $\\mathbb{R} \\to \\mathbb{R}$ 的函数不是满射（没有负的输出），但作为 $\\mathbb{R} \\to [0, \\infty)$ 的函数是满射。",
      ),
      generate(rng) {
        const a = rng.int(1, 9);
        const forms: [string, string, boolean, Text][] = [
          [`x^2 + ${a}`, "\\mathbb{R}", true, t(`Outputs are at least $${a}$.`, `输出至少为 $${a}$。`)],
          [
            `x^2 + ${a}`,
            `[${a}, \\infty)`,
            false,
            t(`Every $y \\ge ${a}$ is $f(\\sqrt{y - ${a}})$.`, `每个 $y \\ge ${a}$ 都等于 $f(\\sqrt{y - ${a}})$。`),
          ],
          [`e^x${signed(a)}`, "\\mathbb{R}", true, t(`Outputs exceed $${a}$.`, `输出都大于 $${a}$。`)],
          [
            `x^3${signed(-a)}`,
            "\\mathbb{R}",
            false,
            t(`Every $y$ is $f(\\sqrt[3]{y + ${a}})$.`, `每个 $y$ 都等于 $f(\\sqrt[3]{y + ${a}})$。`),
          ],
          [`${a}\\sin x`, "\\mathbb{R}", true, t(`Outputs lie in $[-${a}, ${a}]$.`, `输出位于 $[-${a}, ${a}]$ 中。`)],
          [
            `${a}\\sin x`,
            `[-${a}, ${a}]`,
            false,
            t(`$${a}\\sin x$ takes every value between $-${a}$ and $${a}$.`, `$${a}\\sin x$ 取遍 $-${a}$ 与 $${a}$ 之间的每个值。`),
          ],
          [
            `${a + 1}x - ${a}`,
            "\\mathbb{R}",
            false,
            t(
              `Every $y$ is $f\\left(\\frac{y + ${a}}{${a + 1}}\\right)$.`,
              `每个 $y$ 都等于 $f\\left(\\frac{y + ${a}}{${a + 1}}\\right)$。`,
            ),
          ],
          [`|x| - ${a}`, "\\mathbb{R}", true, t(`Outputs are at least $-${a}$.`, `输出至少为 $-${a}$。`)],
        ];
        const [f, cod, into, why] = rng.pick(forms);
        return oneOf(
          rng,
          t(
            `Is $f: \\mathbb{R} \\to ${cod}$, $f(x) = ${f}$, an into function (not onto)?`,
            `$f: \\mathbb{R} \\to ${cod}$，$f(x) = ${f}$ 是非满射函数吗？`,
          ),
          yesNo[into ? 0 : 1]!,
          [yesNo[into ? 1 : 0]!],
          into
            ? t(
                `Yes: ${lower(why.en)} So some values of the codomain $${cod}$ are never reached, and $f$ is into.`,
                `是：${why["zh-CN"]}所以陪域 $${cod}$ 中有的值取不到，$f$ 是非满射。`,
              )
            : t(
                `No: ${lower(why.en)} So every value of the codomain $${cod}$ is reached, and $f$ is onto.`,
                `不是：${why["zh-CN"]}所以陪域 $${cod}$ 中的每个值都能取到，$f$ 是满射。`,
              ),
        );
      },
    },
  ],
};

/** provingSurjectivity proves functions onto by solving f(x) = y. */
export const provingSurjectivity: TopicDef = {
  id: "proving-surjectivity",
  title: t("Proving Surjectivity", "证明满射"),
  summary: t(
    "Given an arbitrary y in the codomain, produce an x in the domain with f(x) = y.",
    "任取陪域中的 y，构造定义域中的 x 使 f(x) = y。",
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
        "To show $f(x) = \\dfrac{x}{x - 1}$ maps $\\mathbb{R} \\setminus \\{1\\}$ onto $\\mathbb{R} \\setminus \\{1\\}$: given $y \\ne 1$, solve $\\dfrac{x}{x - 1} = y$ to get $x = \\dfrac{y}{y - 1}$, which is in the domain, and check $f(x) = y$.",
        "要证明 $f(x) = \\dfrac{x}{x - 1}$ 把 $\\mathbb{R} \\setminus \\{1\\}$ 映满 $\\mathbb{R} \\setminus \\{1\\}$：给定 $y \\ne 1$，解 $\\dfrac{x}{x - 1} = y$ 得 $x = \\dfrac{y}{y - 1}$，它在定义域内，再验证 $f(x) = y$。",
      ),
      generate(rng) {
        const p = rng.int(2, 9);
        const q = rng.int(-9, 9) || 1;
        if (rng.bool()) {
          return oneOf(
            rng,
            t(
              `To prove $f: \\mathbb{R} \\to \\mathbb{R}$, $f(x) = ${p}x${signed(q)}$ is onto, given $y$, which $x$ satisfies $f(x) = y$?`,
              `证明 $f: \\mathbb{R} \\to \\mathbb{R}$，$f(x) = ${p}x${signed(q)}$ 是满射：给定 $y$，哪个 $x$ 满足 $f(x) = y$？`,
            ),
            math(`x = \\dfrac{y${signed(-q)}}{${p}}`),
            [math(`x = \\dfrac{y${signed(q)}}{${p}}`), math(`x = ${p}y${signed(-q)}`), math(`x = \\dfrac{y}{${p}}${signed(-q)}`)],
            t(
              `$${p}x${signed(q)} = y \\iff x = \\dfrac{y${signed(-q)}}{${p}}$.`,
              `$${p}x${signed(q)} = y \\iff x = \\dfrac{y${signed(-q)}}{${p}}$。`,
            ),
          );
        }
        const c = rng.int(1, 9);
        const tex = `\\dfrac{${p}x}{x - ${c}}`;
        return oneOf(
          rng,
          t(
            `$f(x) = ${tex}$ maps $\\mathbb{R} \\setminus \\{${c}\\}$ onto $\\mathbb{R} \\setminus \\{${p}\\}$. Given $y \\ne ${p}$, which $x$ satisfies $f(x) = y$?`,
            `$f(x) = ${tex}$ 把 $\\mathbb{R} \\setminus \\{${c}\\}$ 映满 $\\mathbb{R} \\setminus \\{${p}\\}$。给定 $y \\ne ${p}$，哪个 $x$ 满足 $f(x) = y$？`,
          ),
          math(`x = \\dfrac{${c === 1 ? "" : c}y}{y - ${p}}`),
          [
            math(`x = \\dfrac{${p}y}{y - ${c}}`),
            math(`x = \\dfrac{${c === 1 ? "" : c}y}{${p} - y}`),
            math(`x = \\dfrac{y - ${p}}{${c === 1 ? "" : c}y}`),
          ],
          t(
            `$${p}x = y(x - ${c}) \\iff x(y - ${p}) = ${c === 1 ? "" : c}y \\iff x = \\dfrac{${c === 1 ? "" : c}y}{y - ${p}}$, defined because $y \\ne ${p}$.`,
            `$${p}x = y(x - ${c}) \\iff x(y - ${p}) = ${c === 1 ? "" : c}y \\iff x = \\dfrac{${c === 1 ? "" : c}y}{y - ${p}}$，因为 $y \\ne ${p}$，所以有意义。`,
          ),
        );
      },
    },
    {
      id: "surjectivity-on-the-integers",
      title: t("Surjectivity on the integers", "整数上的满射"),
      explanation: t(
        "$f: \\mathbb{Z} \\to \\mathbb{Z}$, $f(n) = n + 4$ is onto, but $f(n) = 2n$ is not. $g: \\mathbb{Z} \\times \\mathbb{Z} \\to \\mathbb{Z}$, $g(m, n) = 4m + 6n$ is not onto (its outputs are even), while $g(m, n) = 3m + 5n$ is onto, since $\\gcd(3, 5) = 1$.",
        "$f: \\mathbb{Z} \\to \\mathbb{Z}$，$f(n) = n + 4$ 是满射，而 $f(n) = 2n$ 不是。$g: \\mathbb{Z} \\times \\mathbb{Z} \\to \\mathbb{Z}$，$g(m, n) = 4m + 6n$ 不是满射（输出都是偶数），而 $g(m, n) = 3m + 5n$ 是满射，因为 $\\gcd(3, 5) = 1$。",
      ),
      generate(rng) {
        if (rng.bool()) {
          const k = rng.pick([-3, -2, -1, 1, 2, 3]);
          const c = rng.int(-9, 9);
          const value = Math.abs(k) === 1;
          return oneOf(
            rng,
            t(
              `Is $f: \\mathbb{Z} \\to \\mathbb{Z}$, $f(n) = ${coef(k)}n${signed(c)}$, onto?`,
              `$f: \\mathbb{Z} \\to \\mathbb{Z}$，$f(n) = ${coef(k)}n${signed(c)}$ 是满射吗？`,
            ),
            yesNo[value ? 0 : 1]!,
            [yesNo[value ? 1 : 0]!],
            value
              ? t(`Given $m$, $n = ${k}(m${signed(-c)})$ gives $f(n) = m$.`, `给定 $m$，取 $n = ${k}(m${signed(-c)})$ 得 $f(n) = m$。`)
              : t(
                  `Outputs differ from $${c}$ by multiples of $${Math.abs(k)}$, so $${c + 1}$ is missed.`,
                  `输出与 $${c}$ 相差 $${Math.abs(k)}$ 的倍数，所以取不到 $${c + 1}$。`,
                ),
          );
        }
        const a = rng.int(2, 12);
        const b = rng.int(2, 12);
        const g = gcd(a, b);
        const value = g === 1;
        return oneOf(
          rng,
          t(
            `Is $g: \\mathbb{Z} \\times \\mathbb{Z} \\to \\mathbb{Z}$, $g(m, n) = ${a}m + ${b}n$, onto?`,
            `$g: \\mathbb{Z} \\times \\mathbb{Z} \\to \\mathbb{Z}$，$g(m, n) = ${a}m + ${b}n$ 是满射吗？`,
          ),
          yesNo[value ? 0 : 1]!,
          [yesNo[value ? 1 : 0]!],
          value
            ? t(
                `$\\gcd(${a}, ${b}) = 1$, so some $${a}m_0 + ${b}n_0 = 1$, and $g(km_0, kn_0) = k$ for every integer $k$.`,
                `$\\gcd(${a}, ${b}) = 1$，所以存在 $${a}m_0 + ${b}n_0 = 1$，于是对每个整数 $k$，$g(km_0, kn_0) = k$。`,
              )
            : t(`Every output is a multiple of $${g}$, so $1$ is missed.`, `每个输出都是 $${g}$ 的倍数，所以取不到 $1$。`),
        );
      },
    },
  ],
};

/** factorial computes n! for small n. */
const factorial = (n: number) => range(1, n).reduce((x, y) => x * y, 1);

/** bijections combines injectivity and surjectivity. */
export const bijections: TopicDef = {
  id: "bijections",
  title: t("Bijections", "双射"),
  summary: t(
    "A bijection is a function that is both injective and surjective; it pairs the elements of two sets exactly and has an inverse.",
    "双射是既单又满的函数；它把两个集合的元素一一配对，并且有反函数。",
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
        "On $\\mathbb{R} \\to \\mathbb{R}$: $x^3$ is a bijection; $e^x$ is injective but not surjective; $x^3 - x$ is surjective but not injective; $x^2$ is neither.",
        "在 $\\mathbb{R} \\to \\mathbb{R}$ 上：$x^3$ 是双射；$e^x$ 是单射但不是满射；$x^3 - x$ 是满射但不是单射；$x^2$ 两者都不是。",
      ),
      generate(rng) {
        const a = rng.int(1, 9);
        const b = rng.int(2, 9);
        const forms: [string, number][] = [
          [`x^3${signed(a)}`, 0],
          [`${b}x - ${a}`, 0],
          [`e^x${signed(-a)}`, 1],
          [`\\arctan x`, 1],
          [`x^3 - ${a}x`, 2],
          [`x^2${signed(-a)}`, 3],
          [`|x - ${a}|`, 3],
          [`${b}^{x}`, 1],
          [`x^5 - ${a}x^3`, 2],
          [`\\cos x`, 3],
        ];
        const [f, kind] = rng.pick(forms);
        const options = [
          t("Bijective", "双射"),
          t("Injective but not surjective", "单射但非满射"),
          t("Surjective but not injective", "满射但非单射"),
          t("Neither injective nor surjective", "既非单射也非满射"),
        ];
        return reasoned(
          oneOf(
            rng,
            t(
              `Classify $f: \\mathbb{R} \\to \\mathbb{R}$, $f(x) = ${f}$.`,
              `对 $f: \\mathbb{R} \\to \\mathbb{R}$，$f(x) = ${f}$ 进行分类。`,
            ),
            options[kind]!,
            options.filter((_, i) => i !== kind),
            [
              t("$f$ is strictly increasing and takes every real value.", "$f$ 严格递增且取遍所有实数。"),
              t("$f$ is strictly increasing but its range is bounded on one side.", "$f$ 严格递增，但值域在一侧有界。"),
              t("$f$ takes every real value but turns around, so some values repeat.", "$f$ 取遍所有实数，但会折返，所以有些值重复出现。"),
              t("$f$ repeats values and its range is not all of $\\mathbb{R}$.", "$f$ 有重复的值，并且值域不是整个 $\\mathbb{R}$。"),
            ][kind]!,
          ),
          [
            ...[0, 1, 2, 3].map((i) => {
              const [isInj, isSur] = [kind < 2, kind === 0 || kind === 2];
              const [saysInj, saysSur] = [i < 2, i === 0 || i === 2];
              return (
                saysInj !== isInj
                  ? [
                      options[i]!.en,
                      isInj
                        ? "Different inputs always give different outputs here, so the function is injective."
                        : "Some output comes from two different inputs, so the function is not injective.",
                      isInj ? "这里不同的输入总给出不同的输出，所以函数是单射。" : "有的输出来自两个不同的输入，所以函数不是单射。",
                    ]
                  : saysSur !== isSur
                    ? [
                        options[i]!.en,
                        isSur
                          ? "Every real number is reached as an output, so the function is surjective."
                          : "Some real numbers are never reached as outputs, so the function is not surjective.",
                        isSur ? "每个实数都能取到，所以函数是满射。" : "有些实数取不到，所以函数不是满射。",
                      ]
                    : [options[i]!.en, "", ""]
              ) as readonly [string, string, string];
            }),
          ],
        );
      },
    },
    {
      id: "counting-bijections",
      title: t("Counting bijections", "统计双射个数"),
      explanation: t(
        "A bijection between two $n$-element sets is an arrangement of the outputs: $n!$ of them. If $k$ of the inputs have prescribed outputs, the rest can be paired in $(n - k)!$ ways.",
        "两个 $n$ 元集之间的双射就是输出的一个排列：共 $n!$ 个。若有 $k$ 个输入的输出已指定，其余部分有 $(n - k)!$ 种配对方式。",
      ),
      generate(rng) {
        const n = rng.int(3, 9);
        const k = rng.int(0, 3);
        const count = factorial(n - k);
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
          wrong: [factorial(n), n ** (n - k), (n - k) ** 2],
          solution: t(
            `${k === 0 ? "" : k === 1 ? "With one value fixed, " : `With $${k}$ values fixed, `}the remaining $${n - k}$ inputs are paired with the remaining $${n - k}$ outputs in $${n - k}! = ${count}$ ways.`,
            `${k === 0 ? "" : `固定 $${k}$ 个值后，`}剩下的 $${n - k}$ 个输入与剩下的 $${n - k}$ 个输出配对，共 $${n - k}! = ${count}$ 种。`,
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
  prerequisites: ["sets-and-functions", "the-division-algorithm"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "evaluating-floor-and-ceiling",
      title: t("Evaluating floor and ceiling", "计算取整"),
      explanation: t(
        "The floor rounds down to the nearest integer and the ceiling rounds up, so for negative numbers the floor moves further from zero. $\\lfloor 3.7 \\rfloor = 3$, $\\lceil 3.2 \\rceil = 4$, $\\lfloor -2.5 \\rfloor = -3$ and $\\lceil -2.5 \\rceil = -2$. For an integer $n$, $\\lfloor n \\rfloor = \\lceil n \\rceil = n$.",
        "下取整向下取到最近的整数，上取整向上取，所以对于负数，下取整会离零更远。$\\lfloor 3.7 \\rfloor = 3$，$\\lceil 3.2 \\rceil = 4$，$\\lfloor -2.5 \\rfloor = -3$，$\\lceil -2.5 \\rceil = -2$。对整数 $n$，$\\lfloor n \\rfloor = \\lceil n \\rceil = n$。",
      ),
      generate(rng) {
        const a0 = rng.int(-40, 40);
        const b = rng.int(2, 9);
        const c0 = rng.int(-40, 40);
        const d = rng.int(2, 9);
        // Neither fraction is a whole number, so that the rounding matters.
        const a = a0 % b === 0 ? a0 + 1 : a0;
        const c = c0 % d === 0 ? c0 + 1 : c0;
        const value = Math.floor(a / b) + Math.ceil(c / d);
        return numberProblem({
          prompt: t(
            `Compute $\\left\\lfloor \\dfrac{${a}}{${b}} \\right\\rfloor + \\left\\lceil \\dfrac{${c}}{${d}} \\right\\rceil$.`,
            `计算 $\\left\\lfloor \\dfrac{${a}}{${b}} \\right\\rfloor + \\left\\lceil \\dfrac{${c}}{${d}} \\right\\rceil$。`,
          ),
          answer: value,
          wrong: [Math.trunc(a / b) + Math.trunc(c / d), Math.ceil(a / b) + Math.floor(c / d), Math.round(a / b + c / d)],
          solution: t(
            `$\\lfloor ${a}/${b} \\rfloor = ${Math.floor(a / b)}$ and $\\lceil ${c}/${d} \\rceil = ${Math.ceil(c / d)}$, so the sum is $${value}$.`,
            `$\\lfloor ${a}/${b} \\rfloor = ${Math.floor(a / b)}$，$\\lceil ${c}/${d} \\rceil = ${Math.ceil(c / d)}$，所以和为 $${value}$。`,
          ),
        });
      },
    },
    {
      id: "solving-floor-equations",
      title: t("Solving floor equations", "解取整方程"),
      explanation: t(
        "Saying that the floor of a number is an integer means the number lies in a half open interval starting at that integer, which turns the equation into inequalities. $\\lfloor x \\rfloor = m$ means $m \\le x < m + 1$. So $\\left\\lfloor \\dfrac{n}{4} \\right\\rfloor = 5$ means $20 \\le n < 24$: four integers. $\\lfloor \\sqrt{n} \\rfloor = 3$ means $9 \\le n < 16$: seven integers. Likewise, $\\lceil x \\rceil = m$ means $m - 1 < x \\le m$.",
        "说一个数的下取整等于某个整数，就是说这个数位于从该整数开始的半开区间内，这把方程化为不等式。$\\lfloor x \\rfloor = m$ 表示 $m \\le x < m + 1$。所以 $\\left\\lfloor \\dfrac{n}{4} \\right\\rfloor = 5$ 表示 $20 \\le n < 24$：四个整数。$\\lfloor \\sqrt{n} \\rfloor = 3$ 表示 $9 \\le n < 16$：七个整数。同样，$\\lceil x \\rceil = m$ 表示 $m - 1 < x \\le m$。",
      ),
      generate(rng) {
        const m = rng.int(2, 12);
        const kind = rng.int(0, 2);
        const k = rng.int(2, 9);
        const c = rng.int(1, 9);
        let tex: string;
        let means: string;
        let lo: number;
        let hi: number;
        if (kind === 0) {
          tex = `\\left\\lfloor \\dfrac{n${signed(c)}}{${k}} \\right\\rfloor = ${m}`;
          means = `${m} \\le \\dfrac{n${signed(c)}}{${k}} < ${m + 1}`;
          lo = m * k - c;
          hi = (m + 1) * k - c - 1;
        } else if (kind === 1) {
          tex = `\\lfloor \\sqrt{n} \\rfloor = ${m}`;
          means = `${m} \\le \\sqrt{n} < ${m + 1}`;
          lo = m * m;
          hi = (m + 1) ** 2 - 1;
        } else {
          tex = `\\left\\lceil \\dfrac{n}{${k}} \\right\\rceil = ${m}`;
          means = `${m - 1} < \\dfrac{n}{${k}} \\le ${m}`;
          lo = (m - 1) * k + 1;
          hi = m * k;
        }
        const count = hi - lo + 1;
        const solved = t(
          `The equation means $${means}$, so $${lo} \\le n \\le ${hi}$`,
          `方程表示 $${means}$，所以 $${lo} \\le n \\le ${hi}$`,
        );
        // With a linear fraction the count is always the denominator, so those ask for an end of the range.
        if (kind === 1)
          return numberProblem({
            prompt: t(`How many integers $n$ satisfy $${tex}$?`, `有多少个整数 $n$ 满足 $${tex}$？`),
            answer: count,
            wrong: [count + 1, count - 1, m],
            solution: t(`${solved.en}: $${count}$ integers.`, `${solved["zh-CN"]}：共 $${count}$ 个整数。`),
          });
        const largest = kind === 0;
        const answer = largest ? hi : lo;
        return numberProblem({
          prompt: largest
            ? t(`What is the largest integer $n$ that satisfies $${tex}$?`, `满足 $${tex}$ 的最大整数 $n$ 是多少？`)
            : t(`What is the smallest integer $n$ that satisfies $${tex}$?`, `满足 $${tex}$ 的最小整数 $n$ 是多少？`),
          answer,
          wrong: largest ? [hi + 1, lo, (m + 1) * k] : [lo - 1, hi, (m - 1) * k],
          solution: largest
            ? t(`${solved.en}. The largest is $${answer}$.`, `${solved["zh-CN"]}。最大的是 $${answer}$。`)
            : t(`${solved.en}. The smallest is $${answer}$.`, `${solved["zh-CN"]}。最小的是 $${answer}$。`),
        });
      },
    },
  ],
};

/** discreteInfiniteSetsWithEqualCardinality builds bijections between countable sets. */
export const discreteInfiniteSetsWithEqualCardinality: TopicDef = {
  id: "discrete-infinite-sets-with-equal-cardinality",
  title: t("Discrete Infinite Sets with Equal Cardinality", "等势的离散无限集"),
  summary: t(
    "Sets have equal cardinality when a bijection exists between them; ℕ, the even numbers and ℤ all have the same cardinality.",
    "两个集合之间存在双射时它们等势；ℕ、偶数集与 ℤ 的基数都相同。",
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
        "A linear function matches the natural numbers one to one with an arithmetic progression, showing an infinite set can match a proper subset. $f(n) = 3n + 2$ is a bijection from $\\mathbb{N} = \\{0, 1, 2, \\dots\\}$ onto $\\{2, 5, 8, \\dots\\}$, so this proper subset of $\\mathbb{N}$ has the same cardinality as $\\mathbb{N}$.",
        "一个线性函数把自然数与一个等差数列一一对应起来，这表明无限集可以与它的真子集一一对应。$f(n) = 3n + 2$ 是从 $\\mathbb{N} = \\{0, 1, 2, \\dots\\}$ 到 $\\{2, 5, 8, \\dots\\}$ 的双射，所以 $\\mathbb{N}$ 的这个真子集与 $\\mathbb{N}$ 等势。",
      ),
      generate(rng) {
        const k = rng.int(2, 9);
        const c = rng.int(0, 12);
        const set = `\\{${c}, ${c + k}, ${c + 2 * k}, \\dots\\}`;
        return reasoned(
          oneOf(
            rng,
            t(
              `Which function is a bijection from $\\mathbb{N} = \\{0, 1, 2, \\dots\\}$ onto $${set}$?`,
              `哪个函数是从 $\\mathbb{N} = \\{0, 1, 2, \\dots\\}$ 到 $${set}$ 的双射？`,
            ),
            math(`f(n) = ${k}n${signed(c)}`),
            [math(`f(n) = ${k}n${signed(c + k)}`), math(`f(n) = ${c === 0 ? 1 : c}n + ${k}`), math(`f(n) = ${k}n^2${signed(c)}`)],
            t(
              `$f(0) = ${c}$ and each step adds $${k}$, so $f$ hits every element exactly once.`,
              `$f(0) = ${c}$，每步加 $${k}$，所以 $f$ 恰好取到每个元素一次。`,
            ),
          ),
          [
            [
              math(`f(n) = ${k}n${signed(c + k)}`).en,
              `Here $f(0) = ${c + k}$, so the first element $${c}$ is never reached.`,
              `这里 $f(0) = ${c + k}$，所以取不到第一个元素 $${c}$。`,
            ],
            [
              math(`f(n) = ${c === 0 ? 1 : c}n + ${k}`).en,
              `Consecutive outputs here differ by $${c === 0 ? 1 : c}$, but the elements of the set differ by $${k}$.`,
              `这里相邻输出相差 $${c === 0 ? 1 : c}$，而集合中相邻元素相差 $${k}$。`,
            ],
            [
              math(`f(n) = ${k}n^2${signed(c)}`).en,
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
        "Listing the integers alternately on each side of zero pairs every natural number with exactly one integer, so both sets have the same size. List $\\mathbb{Z}$ as $0, -1, 1, -2, 2, \\dots$: $f(n) = \\dfrac{n}{2}$ for even $n$ and $f(n) = -\\dfrac{n + 1}{2}$ for odd $n$ is a bijection $\\mathbb{N} \\to \\mathbb{Z}$. For example $f(7) = -4$ and $f(8) = 4$.",
        "把整数在零的两侧交替列出，就把每个自然数与恰好一个整数配对，所以这两个集合大小相同。把 $\\mathbb{Z}$ 排成 $0, -1, 1, -2, 2, \\dots$：$n$ 为偶数时 $f(n) = \\dfrac{n}{2}$，$n$ 为奇数时 $f(n) = -\\dfrac{n + 1}{2}$，这是 $\\mathbb{N} \\to \\mathbb{Z}$ 的双射。例如 $f(7) = -4$，$f(8) = 4$。",
      ),
      generate(rng) {
        const inverse = rng.bool();
        const def = "f(n) = \\begin{cases} n/2 & n \\text{ even} \\\\ -(n + 1)/2 & n \\text{ odd} \\end{cases}";
        if (!inverse) {
          const n = rng.int(1, 99);
          const v = n % 2 === 0 ? n / 2 : -(n + 1) / 2;
          return numberProblem({
            prompt: t(
              `Let $${def}$ on $\\mathbb{N} = \\{0, 1, 2, \\dots\\}$. Find $f(${n})$.`,
              `设 $\\mathbb{N} = \\{0, 1, 2, \\dots\\}$ 上的 $${def}$。求 $f(${n})$。`,
            ),
            answer: v,
            wrong: [-v, n % 2 === 0 ? v + 1 : (n - 1) / 2, n],
            solution: t(
              `$${n}$ is ${n % 2 === 0 ? "even" : "odd"}, so $f(${n}) = ${v}$.`,
              `$${n}$ 是${n % 2 === 0 ? "偶数" : "奇数"}，所以 $f(${n}) = ${v}$。`,
            ),
          });
        }
        const z = rng.int(-50, 50);
        const n = z > 0 ? 2 * z : z === 0 ? 0 : -2 * z - 1;
        return numberProblem({
          prompt: t(
            `Let $${def}$ on $\\mathbb{N} = \\{0, 1, 2, \\dots\\}$. Find the $n$ with $f(n) = ${z}$.`,
            `设 $\\mathbb{N} = \\{0, 1, 2, \\dots\\}$ 上的 $${def}$。求满足 $f(n) = ${z}$ 的 $n$。`,
          ),
          answer: n,
          wrong: [2 * Math.abs(z), Math.abs(2 * z + 1), Math.abs(z)],
          solution: t(
            z > 0
              ? `Positive values come from even $n$: $n = 2 \\cdot ${z} = ${n}$.`
              : z === 0
                ? "$f(0) = 0$."
                : `Negative values come from odd $n$: $-(n + 1)/2 = ${z}$ gives $n = ${n}$.`,
            z > 0
              ? `正值来自偶数 $n$：$n = 2 \\cdot ${z} = ${n}$。`
              : z === 0
                ? "$f(0) = 0$。"
                : `负值来自奇数 $n$：$-(n + 1)/2 = ${z}$ 得 $n = ${n}$。`,
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
  prerequisites: ["bijections", "interval-notation"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "linear-bijections-between-intervals",
      title: t("Linear bijections between intervals", "区间之间的线性双射"),
      explanation: t(
        "A straight line through the matching endpoints stretches and shifts one interval onto another, so any two open intervals have the same size. $f(x) = c + \\dfrac{d - c}{b - a}(x - a)$ maps $(a, b)$ bijectively onto $(c, d)$: it is linear, sends $a \\mapsto c$ and $b \\mapsto d$. From $(0, 2)$ onto $(3, 9)$: $f(x) = 3 + 3x$.",
        "经过对应端点的直线把一个区间伸缩、平移到另一个区间上，所以任意两个开区间大小相同。$f(x) = c + \\dfrac{d - c}{b - a}(x - a)$ 把 $(a, b)$ 双射到 $(c, d)$ 上：它是线性的，且 $a \\mapsto c$，$b \\mapsto d$。从 $(0, 2)$ 到 $(3, 9)$：$f(x) = 3 + 3x$。",
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
        const g = gcd(Math.abs(num), slope);
        const x0 = slope / g === 1 ? `${num / g}` : `${num < 0 ? "-" : ""}\\tfrac{${Math.abs(num) / g}}{${slope / g}}`;
        const y0 = c + j;
        return numberProblem({
          prompt: t(
            `The increasing linear bijection $f$ from $(${a}, ${b})$ onto $(${c}, ${d})$ sends $x = ${x0}$ to what?`,
            `从 $(${a}, ${b})$ 到 $(${c}, ${d})$ 的递增线性双射 $f$ 把 $x = ${x0}$ 映到哪里？`,
          ),
          answer: y0,
          wrong: [d - j, y0 + 1, y0 - 1],
          solution: t(
            `$f(x) = ${c} + ${slope}(x ${a < 0 ? "+" : "-"} ${Math.abs(a)})$, so $f(${x0}) = ${c} + ${j} = ${y0}$.`,
            `$f(x) = ${c} + ${slope}(x ${a < 0 ? "+" : "-"} ${Math.abs(a)})$，所以 $f(${x0}) = ${c} + ${j} = ${y0}$。`,
          ),
        });
      },
    },
    {
      id: "intervals-and-unbounded-sets",
      title: t("Intervals and unbounded sets", "区间与无界集"),
      explanation: t(
        "A bounded interval can have the same cardinality as an unbounded one. $f(x) = \\dfrac{x}{1 - x}$ is a bijection from $(0, 1)$ onto $(0, \\infty)$, and $\\tan x$ maps $(-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2})$ onto $\\mathbb{R}$.",
        "有界区间可以与无界集合等势。$f(x) = \\dfrac{x}{1 - x}$ 是从 $(0, 1)$ 到 $(0, \\infty)$ 的双射，$\\tan x$ 把 $(-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2})$ 映满 $\\mathbb{R}$。",
      ),
      generate(rng) {
        const a = rng.int(-6, 6);
        const b = a + rng.int(1, 6);
        const xa = `x${signed(-a)}`;
        const bx = `${b} - x`;
        return reasoned(
          oneOf(
            rng,
            t(
              `Which function is a bijection from $(${a}, ${b})$ onto $(0, \\infty)$?`,
              `哪个函数是从 $(${a}, ${b})$ 到 $(0, \\infty)$ 的双射？`,
            ),
            math(`f(x) = \\dfrac{${xa}}{${bx}}`),
            [math(`f(x) = (${xa})(${bx})`), math(`f(x) = \\dfrac{${xa}}{${b - a}}`), math(`f(x) = \\dfrac{1}{${xa}} + 1`)],
            t(
              `$\\dfrac{${xa}}{${bx}}$ is increasing, tends to $0$ as $x \\to ${a}^{+}$ and to $\\infty$ as $x \\to ${b}^{-}$, so it takes every positive value exactly once.`,
              `$\\dfrac{${xa}}{${bx}}$ 递增，$x \\to ${a}^{+}$ 时趋于 $0$，$x \\to ${b}^{-}$ 时趋于 $\\infty$，所以恰好取到每个正数一次。`,
            ),
          ),
          [
            [
              math(`f(x) = (${xa})(${bx})`).en,
              "This product tends to $0$ at both ends, so it is bounded and takes values twice.",
              "这个积在两端都趋于 $0$，所以它有界，而且有的值取到两次。",
            ],
            [
              math(`f(x) = \\dfrac{${xa}}{${b - a}}`).en,
              "This only stretches the interval onto $(0, 1)$, so large values are never reached.",
              "这只是把区间变成 $(0, 1)$，取不到大的值。",
            ],
            [
              math(`f(x) = \\dfrac{1}{${xa}} + 1`).en,
              "Every value here is greater than $1$, so values near $0$ are never reached.",
              "这里的值都大于 $1$，所以取不到接近 $0$ 的值。",
            ],
          ],
        );
      },
    },
  ],
};

/** cardinalityOfTheNaturalNumbersIntegersAndRationals shows ℕ, ℤ and ℚ are countable. */
export const cardinalityOfTheNaturalNumbersIntegersAndRationals: TopicDef = {
  id: "cardinality-of-the-natural-numbers-integers-and-rationals",
  title: t("Cardinality of the Natural Numbers, Integers and Rationals", "自然数、整数与有理数的基数"),
  summary: t(
    "ℕ, ℤ, ℕ × ℕ and ℚ are countably infinite: each can be listed as a sequence.",
    "ℕ、ℤ、ℕ × ℕ 与 ℚ 都是可数无限集：每个都可以排成一个数列。",
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
        "List pairs $(m, n)$ of $\\mathbb{N} = \\{0, 1, 2, \\dots\\}$ diagonal by diagonal: $(0, 0), (1, 0), (0, 1), (2, 0), (1, 1), (0, 2), \\dots$. The pair $(m, n)$ gets position $\\pi(m, n) = \\dfrac{(m + n)(m + n + 1)}{2} + n$, counting from $0$, which is a bijection $\\mathbb{N} \\times \\mathbb{N} \\to \\mathbb{N}$.",
        "按对角线依次排列 $\\mathbb{N} = \\{0, 1, 2, \\dots\\}$ 中的数对 $(m, n)$：$(0, 0), (1, 0), (0, 1), (2, 0), (1, 1), (0, 2), \\dots$。数对 $(m, n)$ 的位置（从 $0$ 开始计）是 $\\pi(m, n) = \\dfrac{(m + n)(m + n + 1)}{2} + n$，这是 $\\mathbb{N} \\times \\mathbb{N} \\to \\mathbb{N}$ 的双射。",
      ),
      generate(rng) {
        const m = rng.int(0, 12);
        const n = rng.int(0, 12);
        const s = m + n;
        const v = (s * (s + 1)) / 2 + n;
        return numberProblem({
          prompt: t(
            `Using $\\pi(m, n) = \\dfrac{(m + n)(m + n + 1)}{2} + n$, find $\\pi(${m}, ${n})$.`,
            `利用 $\\pi(m, n) = \\dfrac{(m + n)(m + n + 1)}{2} + n$，求 $\\pi(${m}, ${n})$。`,
          ),
          answer: v,
          wrong: [(s * (s + 1)) / 2 + m, (s * (s + 1)) / 2, v + 1],
          solution: t(`$\\dfrac{${s} \\cdot ${s + 1}}{2} + ${n} = ${v}$.`, `$\\dfrac{${s} \\cdot ${s + 1}}{2} + ${n} = ${v}$。`),
        });
      },
    },
    {
      id: "countable-or-uncountable",
      title: t("Countable or uncountable?", "可数还是不可数？"),
      explanation: t(
        "Countable: finite sets, $\\mathbb{N}$, $\\mathbb{Z}$, $\\mathbb{Q}$, $\\mathbb{Z}^k$, finite subsets of $\\mathbb{N}$, and countable unions of countable sets. Uncountable: $\\mathbb{R}$, every interval $(a, b)$ with $a < b$, the irrationals and $\\mathcal{P}(\\mathbb{N})$.",
        "可数：有限集、$\\mathbb{N}$、$\\mathbb{Z}$、$\\mathbb{Q}$、$\\mathbb{Z}^k$、$\\mathbb{N}$ 的有限子集族，以及可数个可数集的并。不可数：$\\mathbb{R}$、每个 $a < b$ 的区间 $(a, b)$、无理数集与 $\\mathcal{P}(\\mathbb{N})$。",
      ),
      generate(rng) {
        const a = rng.int(-9, 9);
        const b = a + rng.int(1, 9);
        const k = rng.int(2, 6);
        const sets: [Text, boolean][] = [
          [t(`$\\mathbb{Z}^{${k}}$`, `$\\mathbb{Z}^{${k}}$`), true],
          [t(`$\\mathbb{Q} \\cap (${a}, ${b})$`, `$\\mathbb{Q} \\cap (${a}, ${b})$`), true],
          [t(`$(${a}, ${b})$`, `$(${a}, ${b})$`), false],
          [t(`$\\{x \\in \\mathbb{R} : x > ${a}\\}$`, `$\\{x \\in \\mathbb{R} : x > ${a}\\}$`), false],
          [t(`$\\{${k}n + ${b - a} : n \\in \\mathbb{Z}\\}$`, `$\\{${k}n + ${b - a} : n \\in \\mathbb{Z}\\}$`), true],
          [t(`the set of irrational numbers in $(${a}, ${b})$`, `$(${a}, ${b})$ 中的无理数`), false],
          [t(`$\\mathcal{P}(\\{1, \\dots, ${k + 5}\\})$`, `$\\mathcal{P}(\\{1, \\dots, ${k + 5}\\})$`), true],
          [t("$\\mathcal{P}(\\mathbb{N})$", "$\\mathcal{P}(\\mathbb{N})$"), false],
          [t(`the set of finite strings over a ${k}-letter alphabet`, `${k} 个字母组成的字母表上的有限字符串`), true],
          [t(`the set of infinite sequences of digits $0$ to $${k - 1}$`, `由数字 $0$ 到 $${k - 1}$ 组成的无限序列`), false],
          [t(`$\\{\\sqrt{n} : n \\in \\mathbb{N}\\}$`, `$\\{\\sqrt{n} : n \\in \\mathbb{N}\\}$`), true],
        ];
        const [set, countable] = rng.pick(sets);
        const options = [t("Countable", "可数"), t("Uncountable", "不可数")];
        return oneOf(
          rng,
          t(`Is ${set.en} countable or uncountable?`, `${set["zh-CN"]} 是可数的还是不可数的？`),
          options[countable ? 0 : 1]!,
          [options[countable ? 1 : 0]!],
          countable
            ? t(
                "It can be listed as a sequence (it is finite, or injects into a countable set such as $\\mathbb{Z}^k$ or $\\mathbb{Q}$).",
                "它可以排成数列（它是有限的，或能单射到 $\\mathbb{Z}^k$、$\\mathbb{Q}$ 等可数集中）。",
              )
            : t(
                "It has the cardinality of $\\mathbb{R}$ (or contains an interval), so no list can contain all of it.",
                "它与 $\\mathbb{R}$ 等势（或包含一个区间），所以任何列表都无法包含它的全部元素。",
              ),
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
  prerequisites: ["cardinality-of-the-natural-numbers-integers-and-rationals", "proof-by-contradiction"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "flipping-the-diagonal",
      title: t("Flipping the diagonal", "翻转对角线"),
      explanation: t(
        "If the list of binary sequences begins $s_1 = 0110\\dots$, $s_2 = 1011\\dots$, $s_3 = 0001\\dots$, $s_4 = 1110\\dots$, the diagonal digits are $0, 0, 0, 0$; flipping each gives $1111\\dots$, which differs from $s_n$ in digit $n$.",
        "若二进制序列列表开头是 $s_1 = 0110\\dots$，$s_2 = 1011\\dots$，$s_3 = 0001\\dots$，$s_4 = 1110\\dots$，对角线数字为 $0, 0, 0, 0$；逐位翻转得 $1111\\dots$，它与 $s_n$ 在第 $n$ 位不同。",
      ),
      generate(rng) {
        const n = rng.int(4, 5);
        const rows = range(1, n).map(() =>
          range(1, n)
            .map(() => rng.int(0, 1))
            .join(""),
        );
        const diag = rows.map((r, i) => r[i]!).join("");
        const flip = diag
          .split("")
          .map((c) => (c === "0" ? "1" : "0"))
          .join("");
        const opt = (s: string) => math(`${s}\\dots`);
        return reasoned(
          oneOf(
            rng,
            t(
              `A list of binary sequences begins ${rows.map((r, i) => `$s_{${i + 1}} = ${r}\\dots$`).join(", ")}. Which sequence does the diagonal argument build (first ${n} digits)?`,
              `一列二进制序列开头为 ${rows.map((r, i) => `$s_{${i + 1}} = ${r}\\dots$`).join("，")}。对角线论证构造出的序列是哪一个（前 ${n} 位）？`,
            ),
            opt(flip),
            [
              opt(diag),
              opt(
                rows[0]!
                  .split("")
                  .map((c) => (c === "0" ? "1" : "0"))
                  .join(""),
              ),
              opt(
                rows
                  .map((r, i) => r[n - 1 - i]!)
                  .map((c) => (c === "0" ? "1" : "0"))
                  .join(""),
              ),
            ],
            t(
              `The diagonal digits are $${diag}$; flipping each gives $${flip}\\dots$, which differs from every $s_k$ in digit $k$.`,
              `对角线数字为 $${diag}$；逐位翻转得 $${flip}\\dots$，它与每个 $s_k$ 在第 $k$ 位不同。`,
            ),
          ),
          [
            [
              opt(diag).en,
              "This keeps the diagonal digits as they are, so it can agree with every sequence on the diagonal: each digit must be flipped.",
              "这里保留了对角线上的数字，于是在对角线上可能与每个序列都相同：每个数字都要翻转。",
            ],
            [
              opt(
                rows[0]!
                  .split("")
                  .map((c) => (c === "0" ? "1" : "0"))
                  .join(""),
              ).en,
              "This flips the digits of the first sequence only, and the diagonal takes one digit from each sequence.",
              "这里只翻转了第一个序列的数字，而对角线是从每个序列各取一个数字。",
            ],
            [
              opt(
                rows
                  .map((r, i) => r[n - 1 - i]!)
                  .map((c) => (c === "0" ? "1" : "0"))
                  .join(""),
              ).en,
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
        "For decimals in $(0, 1)$, set digit $n$ of the new number to $5$ if digit $n$ of $x_n$ is not $5$, and to $4$ if it is. Using only $4$ and $5$ avoids numbers with two decimal expansions, such as $0.0999\\dots = 0.1$.",
        "对 $(0, 1)$ 中的小数：若 $x_n$ 的第 $n$ 位不是 $5$，令新数的第 $n$ 位为 $5$；若是 $5$，则令其为 $4$。只用 $4$ 和 $5$ 可以避免有两种小数表示的数，例如 $0.0999\\dots = 0.1$。",
      ),
      generate(rng) {
        const n = 4;
        const rows = range(1, n).map(() =>
          range(1, 6)
            .map(() => (rng.int(0, 2) === 0 ? 5 : rng.int(0, 9)))
            .join(""),
        );
        const digits = rows.map((r, i) => (r[i] === "5" ? "4" : "5")).join("");
        return numberProblem({
          prompt: t(
            `A list of numbers in $(0, 1)$ begins ${rows.map((r, i) => `$x_{${i + 1}} = 0.${r}\\dots$`).join(", ")}. Build $y$ by making digit $n$ equal to $5$ if digit $n$ of $x_n$ is not $5$, and $4$ otherwise. Write the first four digits of $y$ as a four-digit integer.`,
            `$(0, 1)$ 中的一列数开头为 ${rows.map((r, i) => `$x_{${i + 1}} = 0.${r}\\dots$`).join("，")}。构造 $y$：若 $x_n$ 的第 $n$ 位不是 $5$，则 $y$ 的第 $n$ 位为 $5$，否则为 $4$。把 $y$ 的前四位写成一个四位整数。`,
          ),
          answer: Number(digits),
          wrong: [
            Number(rows.map((r, i) => r[i]!).join("")) || 1,
            5555,
            Number(
              digits
                .split("")
                .map((c) => (c === "5" ? "4" : "5"))
                .join(""),
            ),
          ],
          solution: t(
            `The diagonal digits are ${rows.map((r, i) => `$${r[i]}$`).join(", ")}, so $y = 0.${digits}\\dots$.`,
            `对角线数字为 ${rows.map((r, i) => `$${r[i]}$`).join("、")}，所以 $y = 0.${digits}\\dots$。`,
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
  prerequisites: ["continuous-infinite-sets-with-equal-cardinality", "cardinality-of-the-natural-numbers-integers-and-rationals"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "injections-into-open-intervals",
      title: t("Injections into open intervals", "到开区间的单射"),
      explanation: t(
        "The Schröder–Bernstein theorem says injections in both directions guarantee a bijection, which avoids building one directly. To show $|[0, 1]| = |(0, 1)|$, use two injections: the inclusion $(0, 1) \\to [0, 1]$, and $x \\mapsto \\dfrac{x + 1}{3}$, which maps $[0, 1]$ into $[\\tfrac{1}{3}, \\tfrac{2}{3}] \\subset (0, 1)$.",
        "施罗德–伯恩斯坦定理说，两个方向的单射保证存在双射，这样就不必直接构造双射。要证明 $|[0, 1]| = |(0, 1)|$，用两个单射：包含映射 $(0, 1) \\to [0, 1]$，以及 $x \\mapsto \\dfrac{x + 1}{3}$，它把 $[0, 1]$ 映入 $[\\tfrac{1}{3}, \\tfrac{2}{3}] \\subset (0, 1)$。",
      ),
      generate(rng) {
        const a = rng.int(1, 9);
        const b = rng.int(1, 9);
        const f = (num: string, den: string) => math(`f(x) = \\dfrac{${num}}{${den}}`);
        return oneOf(
          rng,
          t(`Which function is an injection from $[0, ${a}]$ into $(0, ${b})$?`, `哪个函数是从 $[0, ${a}]$ 到 $(0, ${b})$ 的单射？`),
          f(`${b}(x + ${a})`, `${3 * a}`),
          [f(`${b}x`, `${a}`), f(`${b}(x + ${a})`, `${2 * a}`), f(`${b}x`, `${2 * a}`)],
          t(
            `$\\dfrac{${b}(x + ${a})}{${3 * a}}$ is increasing and maps $[0, ${a}]$ onto $\\left[\\tfrac{${b}}{3}, \\tfrac{${2 * b}}{3}\\right] \\subset (0, ${b})$. The others send an endpoint to $0$ or $${b}$.`,
            `$\\dfrac{${b}(x + ${a})}{${3 * a}}$ 递增，把 $[0, ${a}]$ 映到 $\\left[\\tfrac{${b}}{3}, \\tfrac{${2 * b}}{3}\\right] \\subset (0, ${b})$ 中。其余函数都把某个端点映到 $0$ 或 $${b}$。`,
          ),
        );
      },
    },
    {
      id: "applying-cantor-bernstein-schroder",
      title: t("Applying the theorem", "应用定理"),
      explanation: t(
        "The theorem needs injections in **both** directions. Injections $\\mathbb{N} \\to \\mathbb{N} \\times \\mathbb{N}$, $n \\mapsto (n, 0)$, and $\\mathbb{N} \\times \\mathbb{N} \\to \\mathbb{N}$, $(m, n) \\mapsto 2^m 3^n$, show $|\\mathbb{N} \\times \\mathbb{N}| = |\\mathbb{N}|$. One injection alone only gives $\\le$.",
        "定理需要**两个方向**的单射。单射 $\\mathbb{N} \\to \\mathbb{N} \\times \\mathbb{N}$，$n \\mapsto (n, 0)$，与 $\\mathbb{N} \\times \\mathbb{N} \\to \\mathbb{N}$，$(m, n) \\mapsto 2^m 3^n$，说明 $|\\mathbb{N} \\times \\mathbb{N}| = |\\mathbb{N}|$。只有一个单射只能得到 $\\le$。",
      ),
      generate(rng) {
        const p = rng.pick([2, 3, 5, 7]);
        const q = rng.pick([3, 5, 7, 11].filter((x) => x > p));
        const c = rng.int(0, 9);
        const pairs: [string, string, string, string][] = [
          ["\\mathbb{N}", "\\mathbb{N} \\times \\mathbb{N}", `n \\mapsto (n, ${c})`, `(m, n) \\mapsto ${p}^m ${q}^n`],
          [
            "\\mathbb{Z}",
            "\\mathbb{N}",
            "n \\mapsto \\begin{cases} 2n & n \\ge 0 \\\\ -2n - 1 & n < 0 \\end{cases}",
            `n \\mapsto n${signed(c)}`,
          ],
          ["[0, 1]", "(0, 1)", `x \\mapsto \\dfrac{x + ${c + 1}}{${2 * c + 3}}`, "x \\mapsto x"],
        ];
        const [A, B, f, g] = rng.pick(pairs);
        const both = rng.bool();
        const s = (en: string, zh: string) => t(en, zh);
        return oneOf(
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
          both ? s(`$|${A}| = |${B}|$`, `$|${A}| = |${B}|$`) : s(`$|${A}| \\le |${B}|$`, `$|${A}| \\le |${B}|$`),
          both
            ? [
                s(`$|${A}| < |${B}|$`, `$|${A}| < |${B}|$`),
                s(`$|${A}| \\le |${B}|$ only`, `只有 $|${A}| \\le |${B}|$`),
                s(`$|${B}| < |${A}|$`, `$|${B}| < |${A}|$`),
              ]
            : [
                s(`$|${A}| = |${B}|$`, `$|${A}| = |${B}|$`),
                s(`$|${A}| < |${B}|$`, `$|${A}| < |${B}|$`),
                s(`$|${B}| \\le |${A}|$`, `$|${B}| \\le |${A}|$`),
              ],
          both
            ? t(
                "Injections in both directions give a bijection by the Cantor–Bernstein–Schröder theorem.",
                "由康托尔–伯恩斯坦–施罗德定理，两个方向的单射给出一个双射。",
              )
            : t(
                "An injection $A \\to B$ shows only $|A| \\le |B|$; equality needs an injection back as well.",
                "单射 $A \\to B$ 只能说明 $|A| \\le |B|$；要得到相等还需要反方向的单射。",
              ),
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
  prerequisites: ["cantors-diagonal-argument", "power-sets"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "subsets-as-binary-sequences",
      title: t("Subsets as binary sequences", "把子集看作二进制序列"),
      explanation: t(
        "A subset $S \\subseteq \\{1, 2, 3, \\dots\\}$ corresponds to the sequence whose $n$th digit is $1$ if $n \\in S$ and $0$ otherwise. The even numbers give $0101\\dots$ and the primes give $0110101\\dots$.",
        "子集 $S \\subseteq \\{1, 2, 3, \\dots\\}$ 对应这样的序列：若 $n \\in S$，第 $n$ 位为 $1$，否则为 $0$。偶数集对应 $0101\\dots$，素数集对应 $0110101\\dots$。",
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
        const opt = (s: string) => math(`${s}\\dots`);
        return oneOf(
          rng,
          t(
            `Under the correspondence between subsets of $\\{1, 2, 3, \\dots\\}$ and binary sequences, what are the first eight digits for ${en}?`,
            `在 $\\{1, 2, 3, \\dots\\}$ 的子集与二进制序列的对应下，${zh}对应序列的前八位是什么？`,
          ),
          opt(right),
          [
            bits((n) => !test(n)),
            bits((n) => test(n + 1)),
            bits((n) => test(n - 1)),
            bits((n) => test(n) !== (n === 1)),
            bits((n) => test(n) !== (n === 8)),
          ].map(opt),
          t(
            `Digit $n$ is $1$ exactly when $n$ is in the set: $${right}\\dots$.`,
            `当且仅当 $n$ 在集合中时第 $n$ 位为 $1$：$${right}\\dots$。`,
          ),
        );
      },
    },
    {
      id: "finite-subsets-are-countable",
      title: t("Finite subsets are countable", "有限子集是可数的"),
      explanation: t(
        "The map $S \\mapsto \\sum_{n \\in S} 2^{n - 1}$ is a bijection from the finite subsets of $\\{1, 2, 3, \\dots\\}$ to $\\{0, 1, 2, \\dots\\}$ (binary notation), so the finite subsets are countable. All subsets together are uncountable.",
        "映射 $S \\mapsto \\sum_{n \\in S} 2^{n - 1}$ 是从 $\\{1, 2, 3, \\dots\\}$ 的有限子集到 $\\{0, 1, 2, \\dots\\}$ 的双射（二进制表示），所以有限子集构成的集合可数。而全部子集构成的集合不可数。",
      ),
      generate(rng) {
        if (rng.bool()) {
          const S = range(1, 9).filter(() => rng.bool());
          const v = S.reduce((s, n) => s + 2 ** (n - 1), 0);
          return numberProblem({
            prompt: t(
              `Under $S \\mapsto \\sum_{n \\in S} 2^{n - 1}$, what number corresponds to $S = ${setTex(S)}$?`,
              `在映射 $S \\mapsto \\sum_{n \\in S} 2^{n - 1}$ 下，$S = ${setTex(S)}$ 对应哪个数？`,
            ),
            answer: v,
            wrong: [S.reduce((s, n) => s + 2 ** n, 0), S.reduce((s, n) => s + n, 0), v + 1],
            solution: t(
              `Each element $n$ of $S$ contributes $2^{n - 1}$: $${S.length === 0 ? "0" : S.map((n) => `2^{${n - 1}}`).join(" + ")} = ${v}$.`,
              `$S$ 的每个元素 $n$ 贡献 $2^{n - 1}$：$${S.length === 0 ? "0" : S.map((n) => `2^{${n - 1}}`).join(" + ")} = ${v}$。`,
            ),
          });
        }
        const v = rng.int(1, 511);
        const S = range(1, 9).filter((n) => (v >> (n - 1)) & 1);
        return setProblem({
          prompt: t(
            `Under $S \\mapsto \\sum_{n \\in S} 2^{n - 1}$, which finite set corresponds to $${v}$?`,
            `在映射 $S \\mapsto \\sum_{n \\in S} 2^{n - 1}$ 下，哪个有限集对应 $${v}$？`,
          ),
          values: S,
          wrong: [S.map((n) => n - 1), S.map((n) => n + 1)],
          solution: t(
            `$${v}$ in binary has $1$s in the places $2^{${S.map((n) => n - 1).join("}, 2^{")}}$, so $S = ${setTex(S)}$.`,
            `$${v}$ 的二进制在 $2^{${S.map((n) => n - 1).join("}, 2^{")}}$ 位上为 $1$，所以 $S = ${setTex(S)}$。`,
          ),
        });
      },
    },
  ],
};

/** cantorsTheorem proves |A| < |𝒫(A)|. */
export const cantorsTheorem: TopicDef = {
  id: "cantors-theorem",
  title: t("Cantor's Theorem", "康托尔定理"),
  summary: t(
    "For every set A, no function A → 𝒫(A) is onto: the set D = {a ∈ A : a ∉ f(a)} is never an output. So |A| < |𝒫(A)|.",
    "对每个集合 A，任何函数 A → 𝒫(A) 都不是满射：集合 D = {a ∈ A : a ∉ f(a)} 永远不是输出。所以 |A| < |𝒫(A)|。",
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
        "The diagonal set differs from every image set at one element, so no function from a set onto its power set can exist. For $f: A \\to \\mathcal{P}(A)$, let $D = \\{a \\in A : a \\notin f(a)\\}$. If $D = f(d)$, then $d \\in D \\iff d \\notin f(d) = D$, a contradiction. With $f(1) = \\{1, 2\\}$, $f(2) = \\{3\\}$, $f(3) = \\varnothing$: $D = \\{2, 3\\}$, which is not $f(1)$, $f(2)$ or $f(3)$.",
        "对角集合与每个像集合都在某个元素上不同，所以不存在从一个集合到它的幂集的满射。对 $f: A \\to \\mathcal{P}(A)$，令 $D = \\{a \\in A : a \\notin f(a)\\}$。若 $D = f(d)$，则 $d \\in D \\iff d \\notin f(d) = D$，矛盾。若 $f(1) = \\{1, 2\\}$，$f(2) = \\{3\\}$，$f(3) = \\varnothing$，则 $D = \\{2, 3\\}$，它不等于 $f(1)$、$f(2)$、$f(3)$ 中的任何一个。",
      ),
      generate(rng) {
        const n = rng.int(3, 5);
        const A = range(1, n);
        const f = A.map(() => A.filter(() => rng.bool()));
        const D = A.filter((a, i) => !f[i]!.includes(a));
        return setProblem({
          prompt: t(
            `Let $A = ${setTex(A)}$ and $f: A \\to \\mathcal{P}(A)$ with ${f.map((s, i) => `$f(${i + 1}) = ${setTex(s)}$`).join(", ")}. Find $D = \\{a \\in A : a \\notin f(a)\\}$.`,
            `设 $A = ${setTex(A)}$，$f: A \\to \\mathcal{P}(A)$，其中 ${f.map((s, i) => `$f(${i + 1}) = ${setTex(s)}$`).join("，")}。求 $D = \\{a \\in A : a \\notin f(a)\\}$。`,
          ),
          values: D,
          wrong: [A.filter((a, i) => f[i]!.includes(a)), A.filter((a) => !f.some((s) => s.includes(a)))],
          solution: t(
            `Check each $a$: ${A.map((a, i) => `$${a} ${f[i]!.includes(a) ? "\\in" : "\\notin"} f(${a})$`).join(", ")}. So $D = ${setTex(D)}$, which differs from every $f(a)$.`,
            `逐个检验：${A.map((a, i) => `$${a} ${f[i]!.includes(a) ? "\\in" : "\\notin"} f(${a})$`).join("，")}。所以 $D = ${setTex(D)}$，它与每个 $f(a)$ 都不同。`,
          ),
        });
      },
    },
    {
      id: "consequences-of-cantors-theorem",
      title: t("Consequences", "推论"),
      explanation: t(
        "$a \\mapsto \\{a\\}$ injects $A$ into $\\mathcal{P}(A)$, and Cantor's theorem rules out a surjection, so $|A| < |\\mathcal{P}(A)|$. Hence $|\\mathbb{N}| < |\\mathcal{P}(\\mathbb{N})| < |\\mathcal{P}(\\mathcal{P}(\\mathbb{N}))| < \\cdots$: there is no largest cardinality.",
        "$a \\mapsto \\{a\\}$ 把 $A$ 单射到 $\\mathcal{P}(A)$ 中，而康托尔定理排除了满射，所以 $|A| < |\\mathcal{P}(A)|$。因此 $|\\mathbb{N}| < |\\mathcal{P}(\\mathbb{N})| < |\\mathcal{P}(\\mathcal{P}(\\mathbb{N}))| < \\cdots$：没有最大的基数。",
      ),
      generate(rng) {
        const sets = ["\\mathbb{N}", "\\mathbb{Z}", "\\mathbb{Q}", "\\mathbb{R}", "\\mathcal{P}(\\mathbb{R})", "\\mathbb{R}^2"];
        const A = rng.pick(sets);
        const claims: [Text, boolean, Text][] = [
          [
            t(`There is a surjection from $${A}$ onto $\\mathcal{P}(${A})$.`, `存在从 $${A}$ 到 $\\mathcal{P}(${A})$ 的满射。`),
            false,
            t(
              "Cantor's theorem: no function $A \\to \\mathcal{P}(A)$ is onto.",
              "康托尔定理：任何函数 $A \\to \\mathcal{P}(A)$ 都不是满射。",
            ),
          ],
          [
            t(`There is an injection from $${A}$ into $\\mathcal{P}(${A})$.`, `存在从 $${A}$ 到 $\\mathcal{P}(${A})$ 的单射。`),
            true,
            t("$a \\mapsto \\{a\\}$ is one.", "$a \\mapsto \\{a\\}$ 就是一个。"),
          ],
          [
            t(`$|${A}| = |\\mathcal{P}(${A})|$.`, `$|${A}| = |\\mathcal{P}(${A})|$。`),
            false,
            t("$|A| < |\\mathcal{P}(A)|$ for every set $A$.", "对每个集合 $A$，$|A| < |\\mathcal{P}(A)|$。"),
          ],
          [
            t(
              `$|\\mathcal{P}(${A})| < |\\mathcal{P}(\\mathcal{P}(${A}))|$.`,
              `$|\\mathcal{P}(${A})| < |\\mathcal{P}(\\mathcal{P}(${A}))|$。`,
            ),
            true,
            t("Apply Cantor's theorem to $\\mathcal{P}(A)$.", "对 $\\mathcal{P}(A)$ 应用康托尔定理。"),
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
          ],
        ];
        const [claim, value, why] = rng.pick(claims);
        return oneOf(
          rng,
          t(`True or false? ${claim.en}`, `判断真假：${claim["zh-CN"]}`),
          [t("True", "真"), t("False", "假")][value ? 0 : 1]!,
          [[t("True", "真"), t("False", "假")][value ? 1 : 0]!],
          why,
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
