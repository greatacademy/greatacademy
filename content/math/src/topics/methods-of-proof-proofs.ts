import type { Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";

import { numberProblem, yesNo } from "../problems.ts";
import { oneOf } from "./calculus-common.ts";
import { domainTex, isPrimeNumber, range, twoPredicates } from "./methods-of-proof-common.ts";

// Methods of Proof unit 3: direct proof, proof by cases, counterexamples, contrapositive and contradiction.

/** gcd is the greatest common divisor of two integers. */
const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

/** signed writes "+ 3" or "- 3" after a term, or nothing for 0. */
const signed = (c: number) => (c === 0 ? "" : c > 0 ? ` + ${c}` : ` - ${-c}`);

/** coef writes a coefficient before a variable: "", "-", "3". */
const coef = (a: number) => (a === 1 ? "" : a === -1 ? "-" : `${a}`);

/** term writes a·x with a nonzero coefficient as a leading term. */
const term = (a: number, x: string) => `${coef(a)}${x}`;

/** plus writes "+ a·x" or "- a·x" after a term, or nothing for 0. */
const plus = (a: number, x: string) => (a === 0 ? "" : a > 0 ? ` + ${term(a, x)}` : ` - ${term(-a, x)}`);

/** math wraps LaTeX as an option. */
const math = (s: string) => t(`$${s}$`, `$${s}$`);

/** parityName names a parity: 0 even, 1 odd. */
const parityName = (r: number) => (r % 2 === 0 ? t("even", "偶数") : t("odd", "奇数"));

/** directProof proves implications by assuming the hypothesis. */
export const directProof: TopicDef = {
  id: "direct-proof",
  title: t("Direct Proof", "直接证明"),
  summary: t(
    "A direct proof of 'if P then Q' assumes P and deduces Q through a chain of valid steps.",
    "“若 P 则 Q”的直接证明假设 P 成立，然后通过一串有效的推理得出 Q。",
  ),
  prerequisites: ["implication-elimination-and-denying-the-consequent", "universal-and-existential-quantifiers"],
  encompasses: [{ topic: "implication-elimination-and-denying-the-consequent", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-structure-of-a-direct-proof",
      title: t("The structure of a direct proof", "直接证明的结构"),
      explanation: t(
        'To prove $\\forall x\\,(P(x) \\Rightarrow Q(x))$ directly, let $x$ be arbitrary, **assume** $P(x)$, and deduce $Q(x)$. To prove "if $x > 3$ then $2x + 1 > 7$": assume $x > 3$; then $2x > 6$, so $2x + 1 > 7$.',
        "直接证明 $\\forall x\\,(P(x) \\Rightarrow Q(x))$：任取 $x$，**假设** $P(x)$，推出 $Q(x)$。证明“若 $x > 3$，则 $2x + 1 > 7$”：假设 $x > 3$，则 $2x > 6$，所以 $2x + 1 > 7$。",
      ),
      generate(rng) {
        const a = rng.int(-9, 9);
        const m = rng.pick([2, 3, 4, 5, 6, 7]);
        const b = rng.int(-9, 9);
        const P = `x > ${a}`;
        const Q = `${m}x${signed(b)} > ${m * a + b}`;
        const notP = `x \\le ${a}`;
        const notQ = `${m}x${signed(b)} \\le ${m * a + b}`;
        const line = (en: string, zh: string) => t(en, zh);
        return oneOf(
          rng,
          t(
            `How does a direct proof of "for every real $x$, if $${P}$ then $${Q}$" begin?`,
            `“对每个实数 $x$，若 $${P}$，则 $${Q}$”的直接证明如何开始？`,
          ),
          line(`Let $x$ be a real number with $${P}$.`, `设 $x$ 是满足 $${P}$ 的实数。`),
          [
            line(`Let $x$ be a real number with $${Q}$.`, `设 $x$ 是满足 $${Q}$ 的实数。`),
            line(`Let $x$ be a real number with $${notQ}$.`, `设 $x$ 是满足 $${notQ}$ 的实数。`),
            line(`Let $x$ be a real number with $${notP}$.`, `设 $x$ 是满足 $${notP}$ 的实数。`),
          ],
          t(
            `A direct proof takes an arbitrary $x$, assumes the hypothesis $${P}$ and works toward the conclusion $${Q}$.`,
            `直接证明任取 $x$，假设前提 $${P}$，再向结论 $${Q}$ 推进。`,
          ),
        );
      },
    },
    {
      id: "steps-of-a-direct-proof",
      title: t("Steps of a direct proof", "直接证明的步骤"),
      explanation: t(
        "Each step must follow from the previous ones. Multiplying an inequality by a negative number reverses it: from $x > 2$ we get $-3x < -6$, so $5 - 3x < -1$.",
        "每一步都必须由前面的结论推出。不等式两边乘以负数要变号：由 $x > 2$ 得 $-3x < -6$，所以 $5 - 3x < -1$。",
      ),
      generate(rng) {
        const a = rng.int(-9, 9);
        const m = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
        const b = rng.int(-9, 9);
        const lhs = `${b === 0 ? "" : `${b}`}${b === 0 ? term(m, "x") : plus(m, "x")}`;
        const rel = m > 0 ? ">" : "<";
        const flip = m > 0 ? "<" : ">";
        const c = m * a + b;
        return oneOf(
          rng,
          t(
            `Assume $x > ${a}$. Multiplying by $${m}$ and adding $${b}$ gives which statement?`,
            `假设 $x > ${a}$。两边乘以 $${m}$ 再加 $${b}$，得到哪个命题？`,
          ),
          math(`${lhs} ${rel} ${c}`),
          [
            math(`${lhs} ${flip} ${c}`),
            math(`${lhs} ${rel} ${m * a}`),
            math(`${lhs} ${rel} ${m * (a + b)}`),
            math(`${lhs} ${flip} ${m * a}`),
          ],
          t(
            `$${m}x ${rel} ${m * a}$${m < 0 ? " (multiplying by a negative number reverses the inequality)" : ""}, so $${lhs} ${rel} ${c}$.`,
            `$${m}x ${rel} ${m * a}$${m < 0 ? "（乘以负数，不等号反向）" : ""}，所以 $${lhs} ${rel} ${c}$。`,
          ),
        );
      },
    },
  ],
};

/** parityForm writes a·m + b·n + c for integers m = 2j + e1 and n = 2k + e2 as 2(...) + r. */
function parityForm(a: number, b: number, c: number, e1: number, e2: number) {
  const s = a * e1 + b * e2 + c;
  const q = Math.floor(s / 2);
  const r = s - 2 * q;
  const inner = (qq: number) => `${term(a, "j")}${plus(b, "k")}${signed(qq)}`;
  const form = (qq: number, rr: number) => `2(${inner(qq)})${rr === 0 ? "" : ` + ${rr}`}`;
  return {
    r,
    right: form(q, r),
    wrong: [form(q + 1, r), form(q, 1 - r), form(s, 0), `2(${inner(c)})${a * e1 + b * e2 === 0 ? "" : ` + ${a * e1 + b * e2}`}`],
  };
}

/** provingParity proves facts about even and odd integers. */
export const provingParity: TopicDef = {
  id: "proving-parity",
  title: t("Proving Parity", "证明奇偶性"),
  summary: t(
    "An integer is even if it equals 2k and odd if it equals 2k + 1 for some integer k; parity proofs rewrite expressions in these forms.",
    "若整数等于 2k（k 为整数）则为偶数，等于 2k + 1 则为奇数；奇偶性证明就是把表达式改写成这些形式。",
  ),
  prerequisites: ["direct-proof"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "writing-expressions-as-even-or-odd",
      title: t("Writing expressions in parity form", "写成奇偶形式"),
      explanation: t(
        "Write an odd $m$ as $2j + 1$ and an even $n$ as $2k$. Then $3m + n + 4 = 6j + 3 + 2k + 4 = 2(3j + k + 3) + 1$, which is odd because $3j + k + 3$ is an integer.",
        "把奇数 $m$ 写成 $2j + 1$，偶数 $n$ 写成 $2k$。则 $3m + n + 4 = 6j + 3 + 2k + 4 = 2(3j + k + 3) + 1$，因为 $3j + k + 3$ 是整数，所以它是奇数。",
      ),
      generate(rng) {
        const e1 = rng.int(0, 1);
        const e2 = rng.int(0, 1);
        const a = rng.int(1, 7);
        const b = rng.int(1, 7);
        const c = rng.int(1, 9);
        const f = parityForm(2 * a, 2 * b, c, e1, e2);
        const g = parityForm(a, b, c, e1, e2);
        const forms = (e: number, v: string) => (e === 0 ? `2${v}` : `2${v} + 1`);
        const expr = `${term(a, "m")} + ${term(b, "n")} + ${c}`;
        return oneOf(
          rng,
          t(
            `Let $m = ${forms(e1, "j")}$ and $n = ${forms(e2, "k")}$ for integers $j, k$. Which correctly rewrites $${expr}$?`,
            `设 $m = ${forms(e1, "j")}$，$n = ${forms(e2, "k")}$，其中 $j, k$ 为整数。哪一个是 $${expr}$ 的正确改写？`,
          ),
          math(g.right),
          [...g.wrong.map(math), math(f.right)],
          t(
            `Substitute and collect: $${expr} = ${g.right}$, so it is ${parityName(g.r).en}.`,
            `代入并整理：$${expr} = ${g.right}$，所以它是${parityName(g.r)["zh-CN"]}。`,
          ),
        );
      },
    },
    {
      id: "parity-of-expressions",
      title: t("Parity of expressions", "表达式的奇偶性"),
      explanation: t(
        "Sums and products of integers have predictable parity: odd + odd is even, odd · odd is odd, and anything times an even number is even. If $m$ and $n$ are odd, $mn + m = m(n + 1)$ is even.",
        "整数的和与积的奇偶性是可以确定的：奇 + 奇 = 偶，奇 · 奇 = 奇，任何整数乘偶数都是偶数。若 $m$、$n$ 都是奇数，则 $mn + m = m(n + 1)$ 是偶数。",
      ),
      generate(rng) {
        const e1 = rng.int(0, 1);
        const e2 = rng.int(0, 1);
        const c = rng.int(1, 5);
        const forms: [string, (m: number, n: number) => number][] = [
          ["m + n", (m, n) => m + n],
          ["mn", (m, n) => m * n],
          [`m^2 + n`, (m, n) => m * m + n],
          [`m^2 + n^2`, (m, n) => m * m + n * n],
          [`mn + m`, (m, n) => m * n + m],
          [`m^2 n + ${c}`, (m, n) => m * m * n + c],
          [`${c}m + n`, (m, n) => c * m + n],
          [`m^2 - n^2 + ${c}`, (m, n) => m * m - n * n + c],
          [`(m + ${c})(n + 1)`, (m, n) => (m + c) * (n + 1)],
        ];
        const [expr, f] = rng.pick(forms);
        const r = Math.abs(f(e1, e2)) % 2;
        const options = [t("Always even", "总是偶数"), t("Always odd", "总是奇数"), t("Can be either", "两者都有可能")];
        const word = (e: number) => parityName(e);
        return oneOf(
          rng,
          t(
            `If $m$ is ${word(e1).en} and $n$ is ${word(e2).en}, is $${expr}$ even or odd?`,
            `若 $m$ 是${word(e1)["zh-CN"]}，$n$ 是${word(e2)["zh-CN"]}，$${expr}$ 是偶数还是奇数？`,
          ),
          options[r]!,
          [options[1 - r]!, options[2]!],
          t(
            `Parity depends only on the parities of $m$ and $n$, so substitute $m = ${e1}$ and $n = ${e2}$ as representatives: $${expr}$ becomes $${f(e1, e2)}$, which is ${parityName(r).en}.`,
            `奇偶性只依赖于 $m$、$n$ 的奇偶性，用 $m = ${e1}$、$n = ${e2}$ 作代表代入：$${expr}$ 变为 $${f(e1, e2)}$，是${parityName(r)["zh-CN"]}。`,
          ),
        );
      },
    },
  ],
};

/** provingDivisibility proves divisibility from the definition. */
export const provingDivisibility: TopicDef = {
  id: "proving-divisibility",
  title: t("Proving Divisibility", "证明整除性"),
  summary: t(
    "a | b means b = ak for some integer k; divisibility proofs exhibit that integer.",
    "a | b 表示存在整数 k 使 b = ak；整除性证明就是找出这个整数。",
  ),
  prerequisites: ["direct-proof", "connecting-factors-and-multiples"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "divisibility-of-linear-combinations",
      title: t("Divisibility of combinations", "线性组合的整除性"),
      explanation: t(
        "If $a \\mid m$ and $a \\mid n$, write $m = aj$ and $n = ak$. Then $3m - 2n = 3aj - 2ak = a(3j - 2k)$, and $3j - 2k$ is an integer, so $a \\mid 3m - 2n$.",
        "若 $a \\mid m$ 且 $a \\mid n$，写 $m = aj$，$n = ak$。则 $3m - 2n = 3aj - 2ak = a(3j - 2k)$，而 $3j - 2k$ 是整数，所以 $a \\mid 3m - 2n$。",
      ),
      generate(rng) {
        const d = rng.int(2, 9);
        const p = rng.pick([1, 2, 3, 4, 5, 6, 7]);
        const q = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const expr = `${term(p, "m")}${plus(q, "n")}`;
        const inner = `${term(p, "j")}${plus(q, "k")}`;
        return oneOf(
          rng,
          t(
            `Suppose $${d} \\mid m$ and $${d} \\mid n$, with $m = ${d}j$ and $n = ${d}k$. Which equation shows $${d} \\mid ${expr}$?`,
            `设 $${d} \\mid m$，$${d} \\mid n$，且 $m = ${d}j$，$n = ${d}k$。哪个等式说明 $${d} \\mid ${expr}$？`,
          ),
          math(`${expr} = ${d}(${inner})`),
          [
            math(`${expr} = ${d}(j${plus(1, "k")})`),
            math(`${expr} = ${d * d}(${inner})`),
            math(`${expr} = ${d}(${inner}) + ${d}`),
            math(`${expr} = ${p * d}(j${plus(q, "k")})`),
          ],
          t(
            `$${expr} = ${term(p * d, "j")}${plus(q * d, "k")} = ${d}(${inner})$, and $${inner}$ is an integer.`,
            `$${expr} = ${term(p * d, "j")}${plus(q * d, "k")} = ${d}(${inner})$，而 $${inner}$ 是整数。`,
          ),
        );
      },
    },
    {
      id: "guaranteed-divisors",
      title: t("Guaranteed divisors", "必然的因数"),
      explanation: t(
        "If $4 \\mid m$ and $6 \\mid n$, then $m = 4j$ and $n = 6k$, so $mn = 24jk$: $24 \\mid mn$. But $m + n = 4j + 6k = 2(2j + 3k)$ is only guaranteed to be divisible by $2$ (try $m = 4$, $n = 6$).",
        "若 $4 \\mid m$ 且 $6 \\mid n$，则 $m = 4j$，$n = 6k$，所以 $mn = 24jk$：$24 \\mid mn$。但 $m + n = 4j + 6k = 2(2j + 3k)$ 只能保证被 $2$ 整除（试 $m = 4$，$n = 6$）。",
      ),
      generate(rng) {
        const a = rng.int(2, 12);
        const b = rng.int(2, 12);
        const product = rng.bool();
        const g = gcd(a, b);
        const answer = product ? a * b : g;
        const [wj, wk] = range(-12, 12)
          .flatMap((j) => range(-12, 12).map((k) => [j, k] as const))
          .filter(([j, k]) => a * j + b * k === g)
          .sort((x, y) => Math.abs(x[0]) + Math.abs(x[1]) - Math.abs(y[0]) - Math.abs(y[1]))[0]!;
        return numberProblem({
          prompt: t(
            `Suppose $${a} \\mid m$ and $${b} \\mid n$. What is the largest integer that must divide $${product ? "mn" : "m + n"}$?`,
            `设 $${a} \\mid m$，$${b} \\mid n$。一定能整除 $${product ? "mn" : "m + n"}$ 的最大整数是多少？`,
          ),
          answer,
          wrong: [product ? g : a * b, a + b, Math.max(a, b), (a * b) / g],
          solution: product
            ? t(
                `$mn = ${a}j \\cdot ${b}k = ${a * b}jk$, and $m = ${a}$, $n = ${b}$ shows nothing larger is guaranteed.`,
                `$mn = ${a}j \\cdot ${b}k = ${a * b}jk$；而 $m = ${a}$，$n = ${b}$ 说明不能保证更大的因数。`,
              )
            : t(
                `$m + n = ${a}j + ${b}k${g === 1 ? "" : ` = ${g}(${term(a / g, "j")} + ${term(b / g, "k")})`}$, and $m = ${a * wj}$, $n = ${b * wk}$ give $m + n = ${g}$, so nothing larger is guaranteed.`,
                `$m + n = ${a}j + ${b}k${g === 1 ? "" : ` = ${g}(${term(a / g, "j")} + ${term(b / g, "k")})`}$；而 $m = ${a * wj}$，$n = ${b * wk}$ 时 $m + n = ${g}$，所以不能保证更大的因数。`,
              ),
        });
      },
    },
  ],
};

/** proofByCases splits a proof into exhaustive cases. */
export const proofByCases: TopicDef = {
  id: "proof-by-cases",
  title: t("Proof by Cases", "分情形证明"),
  summary: t(
    "When the hypothesis splits into cases that cover every possibility, prove the conclusion in each case.",
    "当前提可以分成覆盖所有可能的若干情形时，在每种情形下分别证明结论。",
  ),
  prerequisites: ["proving-parity"],
  encompasses: [{ topic: "proving-parity", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-even-and-odd-cases",
      title: t("Even and odd cases", "偶数与奇数两种情形"),
      explanation: t(
        "To prove $n^2 + 3n$ is even for every integer $n$, split into cases. If $n = 2k$: $4k^2 + 6k = 2(2k^2 + 3k)$. If $n = 2k + 1$: $4k^2 + 4k + 1 + 6k + 3 = 2(2k^2 + 5k + 2)$. Both are even.",
        "证明对每个整数 $n$，$n^2 + 3n$ 都是偶数，可以分情形。若 $n = 2k$：$4k^2 + 6k = 2(2k^2 + 3k)$。若 $n = 2k + 1$：$4k^2 + 4k + 1 + 6k + 3 = 2(2k^2 + 5k + 2)$。两者都是偶数。",
      ),
      generate(rng) {
        const a = rng.int(1, 5);
        const b = rng.int(0, 4) * 2 + (a % 2 === 0 ? 0 : 1);
        const odd = rng.bool();
        const expr = `${term(a, "n^2")}${plus(b, "n")}`;
        const quad = (x: number, y: number, z: number) => `2(${term(x, "k^2")}${plus(y, "k")}${signed(z)})`;
        const right = odd ? quad(2 * a, 2 * a + b, (a + b) / 2) : quad(2 * a, b, 0);
        const wrong = odd
          ? [
              quad(2 * a, a + b, (a + b) / 2),
              quad(2 * a, 2 * a + b, a + b),
              quad(a, 2 * a + b, (a + b) / 2),
              `${quad(2 * a, 2 * a + b, 0)} + 1`,
            ]
          : [quad(a, b, 0), quad(2 * a, 2 * b, 0), `${quad(2 * a, b, 0)} + 1`];
        return oneOf(
          rng,
          t(
            `To prove $${expr}$ is even for every integer $n$, consider the case $n = ${odd ? "2k + 1" : "2k"}$. Which is $${expr}$ in this case?`,
            `证明对每个整数 $n$，$${expr}$ 都是偶数。考虑 $n = ${odd ? "2k + 1" : "2k"}$ 的情形，此时 $${expr}$ 等于哪一个？`,
          ),
          math(right),
          wrong.map(math),
          t(
            `Substitute $n = ${odd ? "2k + 1" : "2k"}$, expand and factor out $2$: $${expr} = ${right}$.`,
            `代入 $n = ${odd ? "2k + 1" : "2k"}$，展开并提出 $2$：$${expr} = ${right}$。`,
          ),
        );
      },
    },
    {
      id: "deciding-parity-by-cases",
      title: t("Deciding parity by cases", "分情形判断奇偶性"),
      explanation: t(
        "Checking the two cases tells whether an expression has fixed parity. For $n^2 + n + 1$: if $n$ is even it is even + even + 1, odd; if $n$ is odd it is odd + odd + 1, odd. So it is always odd.",
        "检验两种情形就能判断表达式的奇偶性是否固定。对 $n^2 + n + 1$：若 $n$ 为偶数，它是偶 + 偶 + 1，为奇数；若 $n$ 为奇数，它是奇 + 奇 + 1，也为奇数。所以它总是奇数。",
      ),
      generate(rng) {
        const a = rng.int(1, 6);
        const b = rng.int(0, 7);
        const c = rng.int(0, 9);
        const expr = `${term(a, "n^2")}${plus(b, "n")}${signed(c)}`;
        const even = c % 2;
        const odd = (a + b + c) % 2;
        const options = [t("Always even", "总是偶数"), t("Always odd", "总是奇数"), t("Depends on $n$", "取决于 $n$")];
        const right = even === odd ? options[even]! : options[2]!;
        return oneOf(
          rng,
          t(
            `For integers $n$, is $${expr}$ always even, always odd, or does it depend on $n$?`,
            `对整数 $n$，$${expr}$ 总是偶数、总是奇数，还是取决于 $n$？`,
          ),
          right,
          options.filter((o) => o !== right),
          t(
            `If $n$ is even, $${expr}$ has the parity of $${c}$: ${parityName(even).en}. If $n$ is odd, it has the parity of $${a} + ${b} + ${c} = ${a + b + c}$: ${parityName(odd).en}.`,
            `若 $n$ 为偶数，$${expr}$ 与 $${c}$ 同奇偶：${parityName(even)["zh-CN"]}。若 $n$ 为奇数，它与 $${a} + ${b} + ${c} = ${a + b + c}$ 同奇偶：${parityName(odd)["zh-CN"]}。`,
          ),
        );
      },
    },
  ],
};

/** disprovingUniversalStatements refutes ∀ statements with counterexamples. */
export const disprovingUniversalStatements: TopicDef = {
  id: "disproving-universal-statements",
  title: t("Disproving Universal Statements", "否定全称命题"),
  summary: t(
    "A universal statement ∀x P(x) is false exactly when ∃x ¬P(x); one counterexample disproves it.",
    "全称命题 ∀x P(x) 为假，当且仅当 ∃x ¬P(x)；一个反例就能否定它。",
  ),
  prerequisites: ["negating-quantified-statements", "direct-proof"],
  encompasses: [{ topic: "negating-quantified-statements", weight: 0.2 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "finding-a-counterexample",
      title: t("Finding a counterexample", "寻找反例"),
      explanation: t(
        '"$n^2 + n + 11$ is prime for every positive integer $n$" looks plausible for small $n$, but $n = 10$ gives $121 = 11^2$. One counterexample is enough; checking many cases that work proves nothing.',
        "“对每个正整数 $n$，$n^2 + n + 11$ 都是质数”对较小的 $n$ 看似成立，但 $n = 10$ 时得 $121 = 11^2$。一个反例就足够；验证再多成立的情形也证明不了什么。",
      ),
      generate(rng) {
        for (;;) {
          const b = rng.int(0, 6);
          const c = rng.int(1, 41);
          const f = (n: number) => n * n + b * n + c;
          const ns = range(1, 12);
          const good = ns.filter((n) => isPrimeNumber(f(n)));
          const bad = ns.filter((n) => !isPrimeNumber(f(n)));
          if (good.length < 3 || bad.length === 0) continue;
          const n = rng.pick(bad);
          const expr = `n^2${plus(b, "n")} + ${c}`;
          const v = f(n);
          const d = range(2, v).find((x) => v % x === 0)!;
          return oneOf(
            rng,
            t(
              `Claim: "$${expr}$ is prime for every positive integer $n$." Which value of $n$ is a counterexample?`,
              `命题：“对每个正整数 $n$，$${expr}$ 都是质数。”哪个 $n$ 是反例？`,
            ),
            math(`n = ${n}`),
            rng.shuffle(good).map((g) => math(`n = ${g}`)),
            t(
              `At $n = ${n}$, $${expr} = ${v} = ${d} \\cdot ${v / d}$, which is not prime. The other values give primes.`,
              `$n = ${n}$ 时，$${expr} = ${v} = ${d} \\cdot ${v / d}$，不是质数。其余取值得到的都是质数。`,
            ),
          );
        }
      },
    },
    {
      id: "what-a-disproof-shows",
      title: t("What a disproof shows", "否定需要证明什么"),
      explanation: t(
        '$\\neg \\forall x\\, P(x) \\equiv \\exists x\\, \\neg P(x)$. To disprove "for every real $x$, $x^2 \\ge x$", show there is a real $x$ with $x^2 < x$, such as $x = \\tfrac{1}{2}$.',
        "$\\neg \\forall x\\, P(x) \\equiv \\exists x\\, \\neg P(x)$。要否定“对每个实数 $x$，$x^2 \\ge x$”，只需说明存在实数 $x$ 使 $x^2 < x$，例如 $x = \\tfrac{1}{2}$。",
      ),
      generate(rng) {
        const k = rng.int(1, 9);
        const c = rng.int(1, 20);
        const claims: [string, string][] = [
          [`x^2 \\ge ${k}x`, `x^2 < ${k}x`],
          [`x^2 + ${c} > ${k}x`, `x^2 + ${c} \\le ${k}x`],
          [`|x - ${k}| > 0`, `|x - ${k}| \\le 0`],
          [`x^3 \\ge x - ${k}`, `x^3 < x - ${k}`],
          [`${k}x \\ne ${c}`, `${k}x = ${c}`],
        ];
        const [p, notP] = rng.pick(claims);
        const s = (en: string, zh: string) => t(en, zh);
        return oneOf(
          rng,
          t(`To disprove "for every real $x$, $${p}$", what must be shown?`, `要否定“对每个实数 $x$，$${p}$”，需要证明什么？`),
          s(`There is a real $x$ with $${notP}$.`, `存在实数 $x$ 使 $${notP}$。`),
          [
            s(`For every real $x$, $${notP}$.`, `对每个实数 $x$，$${notP}$。`),
            s(`There is a real $x$ with $${p}$.`, `存在实数 $x$ 使 $${p}$。`),
            s(`For many values of $x$, $${p}$.`, `对许多 $x$ 的取值，$${p}$。`),
          ],
          t(
            `The negation of $\\forall x\\, P(x)$ is $\\exists x\\, \\neg P(x)$: one $x$ with $${notP}$ suffices.`,
            `$\\forall x\\, P(x)$ 的否定是 $\\exists x\\, \\neg P(x)$：只需一个满足 $${notP}$ 的 $x$。`,
          ),
        );
      },
    },
  ],
};

/** disprovingImplications refutes universal conditionals. */
export const disprovingImplications: TopicDef = {
  id: "disproving-implications",
  title: t("Disproving Implications", "否定蕴含式"),
  summary: t(
    "∀x (P(x) ⇒ Q(x)) is false when some x makes P(x) true and Q(x) false.",
    "当存在 x 使 P(x) 为真而 Q(x) 为假时，∀x (P(x) ⇒ Q(x)) 为假。",
  ),
  prerequisites: ["disproving-universal-statements", "conditional-statements-with-predicates"],
  encompasses: [{ topic: "disproving-universal-statements", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counterexamples-to-implications",
      title: t("Counterexamples to implications", "蕴含式的反例"),
      explanation: t(
        'A counterexample to "if $P(x)$ then $Q(x)$" must satisfy the hypothesis and fail the conclusion. For "if $x$ is prime then $x$ is odd", $x = 2$ is a counterexample; $x = 9$ is not, because $9$ is not prime.',
        "“若 $P(x)$ 则 $Q(x)$”的反例必须满足前提而不满足结论。对“若 $x$ 是质数，则 $x$ 是奇数”，$x = 2$ 是反例；$x = 9$ 不是，因为 $9$ 不是质数。",
      ),
      generate(rng) {
        for (;;) {
          const n = rng.int(10, 20);
          const [P, Q] = twoPredicates(rng, n);
          const xs = range(1, n);
          const pick = (p: boolean, q: boolean) => xs.filter((x) => P.holds(x) === p && Q.holds(x) === q);
          const ce = pick(true, false);
          const others = [pick(false, false), pick(true, true), pick(false, true)];
          if (ce.length === 0 || others.some((o) => o.length === 0)) continue;
          const x = rng.pick(ce);
          return oneOf(
            rng,
            t(
              `Claim: "for every $x \\in ${domainTex(n)}$, if ${P.text.en}, then ${Q.text.en}." Which value is a counterexample?`,
              `命题：“对每个 $x \\in ${domainTex(n)}$，若${P.text["zh-CN"]}，则${Q.text["zh-CN"]}。”哪个值是反例？`,
            ),
            math(`x = ${x}`),
            others.map((o) => math(`x = ${rng.pick(o)}`)),
            t(
              `A counterexample must make "${P.text.en}" true and "${Q.text.en}" false; only $x = ${x}$ does both.`,
              `反例必须使“${P.text["zh-CN"]}”为真且“${Q.text["zh-CN"]}”为假；只有 $x = ${x}$ 同时满足。`,
            ),
          );
        }
      },
    },
    {
      id: "counting-counterexamples",
      title: t("Counting counterexamples", "统计反例个数"),
      explanation: t(
        'Over a finite domain, the counterexamples to "if $P(x)$ then $Q(x)$" are the elements of the truth set of $P(x) \\wedge \\neg Q(x)$. Elements where $P(x)$ is false are never counterexamples.',
        "在有限论域上，“若 $P(x)$ 则 $Q(x)$”的反例就是 $P(x) \\wedge \\neg Q(x)$ 的真值集中的元素。使 $P(x)$ 为假的元素永远不是反例。",
      ),
      generate(rng) {
        const n = rng.int(10, 20);
        const [P, Q] = twoPredicates(rng, n);
        const xs = range(1, n);
        const ce = xs.filter((x) => P.holds(x) && !Q.holds(x));
        return numberProblem({
          prompt: t(
            `How many counterexamples in $${domainTex(n)}$ are there to "if ${P.text.en}, then ${Q.text.en}"?`,
            `在 $${domainTex(n)}$ 中，“若${P.text["zh-CN"]}，则${Q.text["zh-CN"]}”有多少个反例？`,
          ),
          answer: ce.length,
          wrong: [
            xs.filter((x) => !Q.holds(x)).length,
            xs.filter((x) => !P.holds(x) && Q.holds(x)).length,
            xs.filter((x) => !P.holds(x) || !Q.holds(x)).length,
          ],
          solution: t(
            `The counterexamples make "${P.text.en}" true and "${Q.text.en}" false: ${ce.length === 0 ? "there are none" : `$${ce.join(", ")}$`}, so there ${ce.length === 1 ? "is" : "are"} $${ce.length}$.`,
            `反例使“${P.text["zh-CN"]}”为真且“${Q.text["zh-CN"]}”为假：${ce.length === 0 ? "没有" : `$${ce.join(", ")}$`}，共 $${ce.length}$ 个。`,
          ),
        });
      },
    },
  ],
};

/** Clause is a statement about a real x, how often it holds, and a test of it. */
interface Clause {
  readonly tex: string;
  readonly kind: "never" | "always" | "sometimes";
  readonly holds: (x: number) => boolean;
}

/** clause picks a statement about a real number x. */
function clause(rng: Rng, kind: Clause["kind"]): Clause {
  const a = rng.int(1, 9);
  const b = rng.int(-9, 9);
  const options: Record<Clause["kind"], [string, (x: number) => boolean][]> = {
    never: [
      [`x^2 + ${a} < 0`, () => false],
      [`|x| < -${a}`, () => false],
      [`x^2 < -${a}`, () => false],
      [`x^2 + ${a} = 0`, () => false],
      [`|x - ${a}| < 0`, () => false],
    ],
    always: [
      [`x^2 + ${a} > 0`, () => true],
      [`|x| \\ge -${a}`, () => true],
      [`x^2 \\ge 0`, () => true],
      [`x^2 + ${a} \\ge ${a}`, () => true],
      [`|x${signed(b)}| \\ge 0`, () => true],
    ],
    sometimes: [
      [`x > ${b}`, (x) => x > b],
      [`x^2 > ${a * a}`, (x) => x * x > a * a],
      [`${a}x${signed(b)} < 0`, (x) => a * x + b < 0],
      [`x = ${b}`, (x) => x === b],
      [`|x| < ${a}`, (x) => Math.abs(x) < a],
    ],
  };
  const [tex, holds] = rng.pick(options[kind]);
  return { tex, kind, holds };
}

/** implies tests P ⇒ Q on a grid of real numbers wide enough for the clauses above. */
const implies = (P: Clause, Q: Clause) => range(-120, 120).every((i) => !P.holds(i / 4) || Q.holds(i / 4));

/** trivialAndVacuousProofs proves implications whose hypothesis is false or conclusion is true. */
export const trivialAndVacuousProofs: TopicDef = {
  id: "trivial-and-vacuous-proofs",
  title: t("Trivial and Vacuous Proofs", "平凡证明与空真证明"),
  summary: t(
    "If P(x) is never true, P(x) ⇒ Q(x) holds vacuously; if Q(x) is always true, it holds trivially.",
    "若 P(x) 永远不成立，则 P(x) ⇒ Q(x) 空真；若 Q(x) 总成立，则它平凡地成立。",
  ),
  prerequisites: ["direct-proof"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "classifying-trivial-and-vacuous-implications",
      title: t("Trivial or vacuous?", "平凡还是空真？"),
      explanation: t(
        '"If $x^2 < 0$ then $x = 5$" is **vacuously** true: no real $x$ satisfies the hypothesis. "If $x > 2$ then $x^2 + 1 > 0$" is **trivially** true: the conclusion holds for every $x$, whatever the hypothesis.',
        "“若 $x^2 < 0$，则 $x = 5$”是**空真**的：没有实数满足前提。“若 $x > 2$，则 $x^2 + 1 > 0$”是**平凡**成立的：无论前提如何，结论对每个 $x$ 都成立。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const P = clause(rng, kind === 0 ? "never" : "sometimes");
        const Q = clause(rng, kind === 1 ? "always" : "sometimes");
        const options = [
          t("Vacuously true: the hypothesis is never true", "空真：前提永远不成立"),
          t("Trivially true: the conclusion is always true", "平凡成立：结论总成立"),
          t("Neither", "都不是"),
        ];
        return oneOf(
          rng,
          t(
            `For real $x$, how would you classify "if $${P.tex}$, then $${Q.tex}$"?`,
            `对实数 $x$，如何归类“若 $${P.tex}$，则 $${Q.tex}$”？`,
          ),
          options[kind]!,
          options.filter((_, i) => i !== kind),
          kind === 0
            ? t(`No real $x$ satisfies $${P.tex}$, so the implication is vacuously true.`, `没有实数满足 $${P.tex}$，所以该蕴含式空真。`)
            : kind === 1
              ? t(
                  `$${Q.tex}$ holds for every real $x$, so the implication is trivially true.`,
                  `$${Q.tex}$ 对每个实数都成立，所以该蕴含式平凡成立。`,
                )
              : t(
                  `$${P.tex}$ holds for some $x$ and $${Q.tex}$ fails for some $x$, so neither shortcut applies.`,
                  `$${P.tex}$ 对某些 $x$ 成立，$${Q.tex}$ 对某些 $x$ 不成立，所以两种捷径都不适用。`,
                ),
        );
      },
    },
    {
      id: "truth-of-vacuous-implications",
      title: t("Truth of vacuous implications", "空真蕴含式的真值"),
      explanation: t(
        'An implication with a false hypothesis is true, whatever the conclusion says. So "for every integer $n$, if $n^2 < 0$ then $n = 7$" is true, even though $n = 7$ is false for most $n$.',
        "前提为假的蕴含式总是真的，无论结论是什么。所以“对每个整数 $n$，若 $n^2 < 0$，则 $n = 7$”为真，尽管对大多数 $n$ 来说 $n = 7$ 并不成立。",
      ),
      generate(rng) {
        const vacuous = rng.bool();
        const P = clause(rng, vacuous ? "never" : "sometimes");
        const Q = clause(rng, "sometimes");
        const value = implies(P, Q);
        return oneOf(
          rng,
          t(
            `Is the statement "for every real $x$, if $${P.tex}$, then $${Q.tex}$" true?`,
            `命题“对每个实数 $x$，若 $${P.tex}$，则 $${Q.tex}$”为真吗？`,
          ),
          yesNo[value ? 0 : 1]!,
          [yesNo[value ? 1 : 0]!],
          vacuous
            ? t(`Yes, vacuously: no real $x$ satisfies $${P.tex}$.`, `是，空真：没有实数满足 $${P.tex}$。`)
            : value
              ? t(`Yes: every $x$ with $${P.tex}$ also satisfies $${Q.tex}$.`, `是：每个满足 $${P.tex}$ 的 $x$ 也满足 $${Q.tex}$。`)
              : t(`No: some $x$ satisfies $${P.tex}$ but not $${Q.tex}$.`, `不是：存在 $x$ 满足 $${P.tex}$ 但不满足 $${Q.tex}$。`),
        );
      },
    },
  ],
};

/** provingBiconditionalStatements proves both directions of an equivalence. */
export const provingBiconditionalStatements: TopicDef = {
  id: "proving-biconditional-statements",
  title: t("Proving Biconditional Statements", "证明双条件命题"),
  summary: t("To prove P ⇔ Q, prove P ⇒ Q and Q ⇒ P.", "要证明 P ⇔ Q，需要证明 P ⇒ Q 与 Q ⇒ P。"),
  prerequisites: ["direct-proof"],
  encompasses: [{ topic: "biconditional-statements", weight: 0.2 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-two-directions",
      title: t("The two directions", "两个方向"),
      explanation: t(
        "$P \\Leftrightarrow Q$ is equivalent to $(P \\Rightarrow Q) \\wedge (Q \\Rightarrow P)$, so a proof has two parts. Proving $P \\Rightarrow Q$ and its contrapositive $\\neg Q \\Rightarrow \\neg P$ proves only one direction twice.",
        "$P \\Leftrightarrow Q$ 等价于 $(P \\Rightarrow Q) \\wedge (Q \\Rightarrow P)$，所以证明分两部分。证明 $P \\Rightarrow Q$ 及其逆否命题 $\\neg Q \\Rightarrow \\neg P$ 只是把同一个方向证了两遍。",
      ),
      generate(rng) {
        const a = rng.int(2, 9);
        const b = rng.int(-9, 9);
        const x0 = rng.int(-9, 9);
        const c = a * x0 + b;
        const P = `${a}x${signed(b)} = ${c}`;
        const Q = `x = ${x0}`;
        const notP = `${a}x${signed(b)} \\ne ${c}`;
        const notQ = `x \\ne ${x0}`;
        const [L, R, nL, nR] = rng.bool() ? [P, Q, notP, notQ] : [Q, P, notQ, notP];
        const s = (x: string, y: string) => t(`If $${x}$ then $${y}$`, `若 $${x}$ 则 $${y}$`);
        const both = (u: Text, w: Text) =>
          t(`${u.en}, and ${w.en.charAt(0).toLowerCase()}${w.en.slice(1)}.`, `${u["zh-CN"]}，并且${w["zh-CN"]}。`);
        return oneOf(
          rng,
          t(`What must be proved to show $${L} \\Leftrightarrow ${R}$?`, `要证明 $${L} \\Leftrightarrow ${R}$，需要证明什么？`),
          both(s(L, R), s(R, L)),
          [both(s(L, R), s(nR, nL)), both(s(R, L), s(nL, nR)), t(`${s(L, R).en} only.`, `只需${s(L, R)["zh-CN"]}。`)],
          t(
            `A biconditional is two implications: $${L} \\Rightarrow ${R}$ and $${R} \\Rightarrow ${L}$. A contrapositive repeats the direction it comes from.`,
            `双条件命题是两个蕴含式：$${L} \\Rightarrow ${R}$ 与 $${R} \\Rightarrow ${L}$。逆否命题只是重复它所对应的那个方向。`,
          ),
        );
      },
    },
    {
      id: "checking-both-directions",
      title: t("Checking both directions", "检验两个方向"),
      explanation: t(
        'A biconditional fails if either direction fails. "$x^2 = 9 \\Leftrightarrow x = 3$" is false: $x = 3 \\Rightarrow x^2 = 9$ holds, but $x = -3$ breaks the other direction. "$x^3 = 8 \\Leftrightarrow x = 2$" is true.',
        "只要有一个方向不成立，双条件命题就不成立。“$x^2 = 9 \\Leftrightarrow x = 3$”为假：$x = 3 \\Rightarrow x^2 = 9$ 成立，但 $x = -3$ 使另一个方向不成立。“$x^3 = 8 \\Leftrightarrow x = 2$”为真。",
      ),
      generate(rng) {
        const kind = rng.int(0, 3);
        let claim: string;
        let value: boolean;
        let why: Text;
        if (kind === 0) {
          const k = rng.int(2, 12);
          const m = rng.int(2, 12);
          const g = gcd(k, m);
          claim = `${k} \\mid n \\Leftrightarrow ${k} \\mid ${m}n`;
          value = g === 1;
          why = value
            ? t(
                `$${k}$ and $${m}$ share no factor, so $${k} \\mid ${m}n$ forces $${k} \\mid n$; the other direction is immediate.`,
                `$${k}$ 与 $${m}$ 没有公因数，所以 $${k} \\mid ${m}n$ 推出 $${k} \\mid n$；另一个方向是显然的。`,
              )
            : t(
                `$n = ${k / g}$ gives $${k} \\mid ${m * (k / g)}$ but $${k} \\nmid ${k / g}$.`,
                `$n = ${k / g}$ 时 $${k} \\mid ${m * (k / g)}$，但 $${k} \\nmid ${k / g}$。`,
              );
        } else if (kind === 1) {
          const a = rng.int(1, 12);
          const e = rng.pick([2, 3, 4, 5]);
          claim = `x^{${e}} = ${a ** e} \\Leftrightarrow x = ${a}`;
          value = e % 2 === 1;
          why = value
            ? t(
                `$x^{${e}}$ is increasing, so only $x = ${a}$ gives $${a ** e}$.`,
                `$x^{${e}}$ 单调递增，所以只有 $x = ${a}$ 得到 $${a ** e}$。`,
              )
            : t(`$x = -${a}$ also gives $x^{${e}} = ${a ** e}$.`, `$x = -${a}$ 也使 $x^{${e}} = ${a ** e}$。`);
        } else if (kind === 2) {
          const a = rng.int(1, 9);
          claim = `x^2 > ${a * a} \\Leftrightarrow x > ${a}`;
          value = false;
          why = t(
            `$x = -${a + 1}$ satisfies $x^2 > ${a * a}$ but not $x > ${a}$.`,
            `$x = -${a + 1}$ 满足 $x^2 > ${a * a}$，但不满足 $x > ${a}$。`,
          );
        } else {
          const a = rng.int(2, 9);
          const b = rng.int(-9, 9);
          const c = rng.int(-20, 20);
          const neg = rng.bool();
          claim = `${neg ? "-" : ""}${a}x${signed(b)} > ${c} \\Leftrightarrow x ${neg ? "<" : ">"} ${neg ? `${b - c}/${a}` : `${c - b}/${a}`}`;
          value = true;
          why = t(
            `Each step of solving the inequality is reversible, so both directions hold.`,
            `解不等式的每一步都是可逆的，所以两个方向都成立。`,
          );
        }
        return oneOf(
          rng,
          kind === 0
            ? t(`For integers $n$, is $${claim}$ true?`, `对整数 $n$，$${claim}$ 成立吗？`)
            : t(`For real $x$, is $${claim}$ true?`, `对实数 $x$，$${claim}$ 成立吗？`),
          yesNo[value ? 0 : 1]!,
          [yesNo[value ? 1 : 0]!],
          why,
        );
      },
    },
  ],
};

/** proofByContrapositive proves an implication through its contrapositive. */
export const proofByContrapositive: TopicDef = {
  id: "proof-by-contrapositive",
  title: t("Proof by Contrapositive", "逆否证明"),
  summary: t("P ⇒ Q is equivalent to ¬Q ⇒ ¬P, so assume ¬Q and deduce ¬P.", "P ⇒ Q 等价于 ¬Q ⇒ ¬P，所以可以假设 ¬Q 并推出 ¬P。"),
  prerequisites: ["direct-proof"],
  encompasses: [{ topic: "converse-inverse-and-contrapositive", weight: 0.2 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "setting-up-a-contrapositive-proof",
      title: t("Setting up the proof", "构建证明框架"),
      explanation: t(
        'To prove "if $P$ then $Q$" by contrapositive, assume $\\neg Q$ and prove $\\neg P$. For "if $x^2$ is even then $x$ is even", assume $x$ is odd and show $x^2$ is odd.',
        "用逆否证明“若 $P$ 则 $Q$”：假设 $\\neg Q$，证明 $\\neg P$。对“若 $x^2$ 是偶数，则 $x$ 是偶数”，假设 $x$ 是奇数，证明 $x^2$ 是奇数。",
      ),
      generate(rng) {
        const n = rng.int(10, 30);
        const [P, Q] = twoPredicates(rng, n);
        const plan = (a: Text, b: Text) => t(`Assume ${a.en}; show ${b.en}.`, `假设${a["zh-CN"]}；证明${b["zh-CN"]}。`);
        return oneOf(
          rng,
          t(
            `To prove "for $x \\in ${domainTex(n)}$, if ${P.text.en}, then ${Q.text.en}" by contrapositive, what is the plan?`,
            `用逆否证明“对 $x \\in ${domainTex(n)}$，若${P.text["zh-CN"]}，则${Q.text["zh-CN"]}”，证明思路是什么？`,
          ),
          plan(Q.negation, P.negation),
          [plan(P.negation, Q.negation), plan(Q.text, P.text), plan(P.text, Q.text)],
          t(
            `The contrapositive is "if ${Q.negation.en}, then ${P.negation.en}", so assume ${Q.negation.en} and show ${P.negation.en}.`,
            `逆否命题是“若${Q.negation["zh-CN"]}，则${P.negation["zh-CN"]}”，所以假设${Q.negation["zh-CN"]}，证明${P.negation["zh-CN"]}。`,
          ),
        );
      },
    },
    {
      id: "thresholds-by-contrapositive",
      title: t("Thresholds by contrapositive", "用逆否求阈值"),
      explanation: t(
        '"If $a + b \\ge 9$ then $a \\ge 5$ or $b \\ge 5$" for integers is proved by contrapositive: if $a \\le 4$ and $b \\le 4$, then $a + b \\le 8 < 9$. The threshold $9$ is the smallest that works, since $a = b = 4$ gives $8$.',
        "对整数，“若 $a + b \\ge 9$，则 $a \\ge 5$ 或 $b \\ge 5$”可用逆否证明：若 $a \\le 4$ 且 $b \\le 4$，则 $a + b \\le 8 < 9$。阈值 $9$ 是可行的最小值，因为 $a = b = 4$ 时和为 $8$。",
      ),
      generate(rng) {
        const s = rng.int(2, 20);
        const r = rng.int(2, 20);
        const product = rng.bool() && s <= 12 && r <= 12;
        const answer = product ? (s - 1) * (r - 1) + 1 : s + r - 1;
        const op = product ? "ab" : "a + b";
        return numberProblem({
          prompt: t(
            `Find the smallest integer $S$ such that, for all ${product ? "positive " : ""}integers $a$ and $b$, if $${op} \\ge S$ then $a \\ge ${s}$ or $b \\ge ${r}$.`,
            `求最小的整数 $S$，使得对所有${product ? "正" : ""}整数 $a$、$b$，若 $${op} \\ge S$，则 $a \\ge ${s}$ 或 $b \\ge ${r}$。`,
          ),
          answer,
          wrong: product ? [s * r, (s - 1) * (r - 1), s * r - 1] : [s + r, s + r - 2, Math.max(s, r)],
          solution: t(
            `Contrapositive: if $a \\le ${s - 1}$ and $b \\le ${r - 1}$, then $${op} \\le ${product ? (s - 1) * (r - 1) : s + r - 2}$. So $S = ${answer}$ works, and $a = ${s - 1}$, $b = ${r - 1}$ shows no smaller $S$ does.`,
            `逆否：若 $a \\le ${s - 1}$ 且 $b \\le ${r - 1}$，则 $${op} \\le ${product ? (s - 1) * (r - 1) : s + r - 2}$。所以 $S = ${answer}$ 可行，而 $a = ${s - 1}$，$b = ${r - 1}$ 说明更小的 $S$ 不行。`,
          ),
        });
      },
    },
  ],
};

/** provingParityByContrapositive proves parity claims through the contrapositive. */
export const provingParityByContrapositive: TopicDef = {
  id: "proving-parity-by-contrapositive",
  title: t("Proving Parity by Contrapositive", "用逆否证明奇偶性"),
  summary: t(
    "Claims like 'if n² + 3 is even then n is odd' are easier through the contrapositive: assume n is even and compute.",
    "像“若 n² + 3 是偶数，则 n 是奇数”这样的命题用逆否更容易：假设 n 是偶数再计算。",
  ),
  prerequisites: ["proof-by-contrapositive", "proving-parity"],
  encompasses: [{ topic: "proving-parity", weight: 0.2 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-contrapositive-of-a-parity-claim",
      title: t("The contrapositive of a parity claim", "奇偶性命题的逆否"),
      explanation: t(
        'A hypothesis about an expression in $n$ is hard to use directly, but a hypothesis about $n$ is easy. The contrapositive of "if $3n + 5$ is even then $n$ is odd" is "if $n$ is even then $3n + 5$ is odd", proved by $3(2k) + 5 = 2(3k + 2) + 1$.',
        "关于 $n$ 的表达式的前提不好直接用，而关于 $n$ 本身的前提很好用。“若 $3n + 5$ 是偶数，则 $n$ 是奇数”的逆否命题是“若 $n$ 是偶数，则 $3n + 5$ 是奇数”，由 $3(2k) + 5 = 2(3k + 2) + 1$ 得证。",
      ),
      generate(rng) {
        const a = rng.pick([1, 3, 5, 7, 9]);
        const k = rng.int(1, 4);
        const c = rng.int(1, 12);
        const expr = `${term(a, k === 1 ? "n" : `n^{${k}}`)} + ${c}`;
        const exprParity = rng.int(0, 1);
        const nParity = (exprParity + c) % 2;
        const E = parityName(exprParity);
        const N = parityName(nParity);
        const nE = parityName(1 - exprParity);
        const nN = parityName(1 - nParity);
        const imp = (x: Text, y: Text, z: Text, w: Text) =>
          t(`If ${x.en} is ${y.en}, then ${z.en} is ${w.en}.`, `若${x["zh-CN"]}是${y["zh-CN"]}，则${z["zh-CN"]}是${w["zh-CN"]}。`);
        const X = math(expr);
        const n = math("n");
        return oneOf(
          rng,
          t(
            `Claim: "if $${expr}$ is ${E.en}, then $n$ is ${N.en}." Which statement does a proof by contrapositive prove?`,
            `命题：“若 $${expr}$ 是${E["zh-CN"]}，则 $n$ 是${N["zh-CN"]}。”逆否证明要证明的是哪个命题？`,
          ),
          imp(n, nN, X, nE),
          [imp(n, N, X, E), imp(n, nN, X, E), imp(X, nE, n, nN)],
          t(
            `Negate both parts and swap them: if $n$ is ${nN.en}, then $${expr}$ is ${nE.en}.`,
            `把两部分都否定并交换：若 $n$ 是${nN["zh-CN"]}，则 $${expr}$ 是${nE["zh-CN"]}。`,
          ),
        );
      },
    },
    {
      id: "completing-a-parity-contrapositive",
      title: t("Completing the proof", "完成证明"),
      explanation: t(
        'After assuming the negated conclusion, substitute and simplify. To show "if $n^2 + 4$ is odd then $n$ is odd": assume $n = 2k$; then $n^2 + 4 = 4k^2 + 4 = 2(2k^2 + 2)$ is even.',
        "假设结论的否定后，代入并化简。证明“若 $n^2 + 4$ 是奇数，则 $n$ 是奇数”：假设 $n = 2k$，则 $n^2 + 4 = 4k^2 + 4 = 2(2k^2 + 2)$ 是偶数。",
      ),
      generate(rng) {
        const a = rng.int(1, 6);
        const c = rng.int(1, 12);
        const even = rng.bool();
        const expr = `${term(a, "n^2")} + ${c}`;
        const q = even ? Math.floor(c / 2) : Math.floor((a + c) / 2);
        const r = even ? c % 2 : (a + c) % 2;
        const inner = (x: number, y: number, z: number) => `${term(x, "k^2")}${plus(y, "k")}${signed(z)}`;
        const form = (x: number, y: number, z: number, w: number) => `2(${inner(x, y, z)})${w === 0 ? "" : " + 1"}`;
        const right = even ? form(2 * a, 0, q, r) : form(2 * a, 2 * a, q, r);
        const wrong = even
          ? [form(a, 0, q, r), form(2 * a, 0, c, 0), form(2 * a, 0, q, 1 - r)]
          : [form(2 * a, a, q, r), form(2 * a, 2 * a, c, 0), form(2 * a, 2 * a, q, 1 - r), form(a, a, q, r)];
        return oneOf(
          rng,
          t(
            `In a contrapositive proof, assume $n = ${even ? "2k" : "2k + 1"}$. Which is $${expr}$?`,
            `在逆否证明中，假设 $n = ${even ? "2k" : "2k + 1"}$。$${expr}$ 等于哪一个？`,
          ),
          math(right),
          wrong.map(math),
          t(
            `Substitute and factor out $2$: $${expr} = ${right}$, which is ${parityName(r).en}.`,
            `代入并提出 $2$：$${expr} = ${right}$，是${parityName(r)["zh-CN"]}。`,
          ),
        );
      },
    },
  ],
};

/** provingDivisibilityByContrapositive proves non-divisibility claims through the contrapositive. */
export const provingDivisibilityByContrapositive: TopicDef = {
  id: "proving-divisibility-by-contrapositive",
  title: t("Proving Divisibility by Contrapositive", "用逆否证明整除性"),
  summary: t(
    "A claim 'if d ∤ f(n) then d ∤ n' becomes 'if d | n then d | f(n)', which a direct computation proves.",
    "命题“若 d ∤ f(n)，则 d ∤ n”变为“若 d | n，则 d | f(n)”，直接计算即可证明。",
  ),
  prerequisites: ["proof-by-contrapositive", "proving-divisibility"],
  encompasses: [{ topic: "proving-divisibility", weight: 0.2 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-contrapositive-of-a-divisibility-claim",
      title: t("The contrapositive of a divisibility claim", "整除命题的逆否"),
      explanation: t(
        '"If $5 \\nmid n^2 + 10n$ then $5 \\nmid n$" has contrapositive "if $5 \\mid n$ then $5 \\mid n^2 + 10n$". Negating $\\nmid$ gives $\\mid$.',
        "“若 $5 \\nmid n^2 + 10n$，则 $5 \\nmid n$”的逆否命题是“若 $5 \\mid n$，则 $5 \\mid n^2 + 10n$”。$\\nmid$ 的否定是 $\\mid$。",
      ),
      generate(rng) {
        const d = rng.int(2, 9);
        const a = rng.pick(range(1, 6).filter((x) => x % d !== 0));
        const b = rng.int(1, 5) * d;
        const expr = `${term(a, "n^2")} + ${term(b, "n")}`;
        const z = (x: string, y: string) => t(`$\\text{if } ${x} \\text{ then } ${y}$`, `$\\text{若 } ${x} \\text{，则 } ${y}$`);
        const right = z(`${d} \\mid n`, `${d} \\mid ${expr}`);
        return oneOf(
          rng,
          t(
            `What is the contrapositive of "if $${d} \\nmid ${expr}$, then $${d} \\nmid n$"?`,
            `“若 $${d} \\nmid ${expr}$，则 $${d} \\nmid n$”的逆否命题是什么？`,
          ),
          right,
          [z(`${d} \\nmid n`, `${d} \\nmid ${expr}`), z(`${d} \\mid ${expr}`, `${d} \\mid n`), z(`${d} \\mid n`, `${d} \\nmid ${expr}`)],
          t(
            `Swap and negate: the contrapositive is "if $${d} \\mid n$ then $${d} \\mid ${expr}$", true since $${expr} = n(${term(a, "n")} + ${b})$.`,
            `交换并否定：逆否命题是“若 $${d} \\mid n$，则 $${d} \\mid ${expr}$”，它成立，因为 $${expr} = n(${term(a, "n")} + ${b})$。`,
          ),
        );
      },
    },
    {
      id: "completing-a-divisibility-contrapositive",
      title: t("Completing the proof", "完成证明"),
      explanation: t(
        "Assume $d \\mid n$ and write $n = dj$. Then substitute: for $n^2 + 3n$ with $d = 4$, $16j^2 + 12j = 4(4j^2 + 3j)$, so $4 \\mid n^2 + 3n$.",
        "假设 $d \\mid n$，写 $n = dj$，然后代入：对 $n^2 + 3n$ 和 $d = 4$，$16j^2 + 12j = 4(4j^2 + 3j)$，所以 $4 \\mid n^2 + 3n$。",
      ),
      generate(rng) {
        const d = rng.int(2, 9);
        const a = rng.int(1, 5);
        const b = rng.int(1, 9);
        const expr = `${term(a, "n^2")} + ${term(b, "n")}`;
        const inner = (x: number, y: number) => `${term(x, "j^2")}${plus(y, "j")}`;
        return oneOf(
          rng,
          t(
            `To show "if $${d} \\nmid ${expr}$ then $${d} \\nmid n$" by contrapositive, assume $n = ${d}j$. Which is $${expr}$?`,
            `用逆否证明“若 $${d} \\nmid ${expr}$，则 $${d} \\nmid n$”，假设 $n = ${d}j$。$${expr}$ 等于哪一个？`,
          ),
          math(`${d}(${inner(a * d, b)})`),
          [
            math(`${d}(${inner(a, b)})`),
            math(`${d}(${inner(a * d, b * d)})`),
            math(`${d * d}(${inner(a, b)})`),
            math(`${d}(${inner(a * d, b)}) + ${b}`),
          ],
          t(
            `$${expr} = ${a * d * d}j^2 + ${b * d}j = ${d}(${inner(a * d, b)})$, so $${d} \\mid ${expr}$.`,
            `$${expr} = ${a * d * d}j^2 + ${b * d}j = ${d}(${inner(a * d, b)})$，所以 $${d} \\mid ${expr}$。`,
          ),
        );
      },
    },
  ],
};

/** proofByContradiction proves a statement by refuting its negation. */
export const proofByContradiction: TopicDef = {
  id: "proof-by-contradiction",
  title: t("Proof by Contradiction", "反证法"),
  summary: t(
    "To prove P, assume ¬P and derive a contradiction; then ¬P is false, so P is true.",
    "要证明 P，假设 ¬P 并推出矛盾；于是 ¬P 为假，所以 P 为真。",
  ),
  prerequisites: ["proof-by-contrapositive", "additional-rules-of-logical-inference"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-opening-assumption",
      title: t("The opening assumption", "初始假设"),
      explanation: t(
        'A proof by contradiction of $P$ begins by assuming $\\neg P$. To prove "there are no integers $m, n$ with $4m + 6n = 7$", assume there are integers $m, n$ with $4m + 6n = 7$.',
        "用反证法证明 $P$，从假设 $\\neg P$ 开始。要证明“不存在整数 $m, n$ 使 $4m + 6n = 7$”，先假设存在整数 $m, n$ 使 $4m + 6n = 7$。",
      ),
      generate(rng) {
        for (;;) {
          const a = rng.int(2, 12);
          const b = rng.int(2, 12);
          const c = rng.int(1, 30);
          const g = gcd(a, b);
          if (g === 1 || c % g === 0) continue;
          const eq = `${a}m + ${b}n = ${c}`;
          const ne = `${a}m + ${b}n \\ne ${c}`;
          const s = (en: string, zh: string) => t(en, zh);
          return oneOf(
            rng,
            t(
              `To prove "there are no integers $m, n$ with $${eq}$" by contradiction, what do you assume?`,
              `用反证法证明“不存在整数 $m, n$ 使 $${eq}$”，应当假设什么？`,
            ),
            s(`There are integers $m, n$ with $${eq}$.`, `存在整数 $m, n$ 使 $${eq}$。`),
            [
              s(`For all integers $m, n$, $${ne}$.`, `对所有整数 $m, n$，$${ne}$。`),
              s(`For all integers $m, n$, $${eq}$.`, `对所有整数 $m, n$，$${eq}$。`),
              s(`There are integers $m, n$ with $${ne}$.`, `存在整数 $m, n$ 使 $${ne}$。`),
            ],
            t(
              `Assume the negation of the claim: some integers satisfy $${eq}$. Then $${g}$ divides the left side but not $${c}$, a contradiction.`,
              `假设命题的否定：存在整数满足 $${eq}$。于是 $${g}$ 整除左边但不整除 $${c}$，矛盾。`,
            ),
          );
        }
      },
    },
    {
      id: "reaching-the-contradiction",
      title: t("Reaching the contradiction", "推出矛盾"),
      explanation: t(
        "In $4m + 6n = 7$, the left side is $2(2m + 3n)$, which is even, but $7$ is odd. The contradiction comes from a common divisor of the coefficients that does not divide the right side.",
        "在 $4m + 6n = 7$ 中，左边是 $2(2m + 3n)$，为偶数，而 $7$ 是奇数。矛盾来自系数的一个公因数不整除右边。",
      ),
      generate(rng) {
        for (;;) {
          const a = rng.int(2, 15);
          const b = rng.int(2, 15);
          const c = rng.int(1, 40);
          const g = gcd(a, b);
          if (g === 1 || c % g === 0) continue;
          return numberProblem({
            prompt: t(
              `Assume integers $m, n$ satisfy $${a}m + ${b}n = ${c}$. What is the largest integer that divides the left side for every choice of $m, n$, giving a contradiction?`,
              `假设整数 $m, n$ 满足 $${a}m + ${b}n = ${c}$。对任意 $m, n$ 都能整除左边、从而导出矛盾的最大整数是多少？`,
            ),
            answer: g,
            wrong: [a, b, a * b, c],
            solution: t(
              `$${a}m + ${b}n = ${g}(${term(a / g, "m")} + ${term(b / g, "n")})$, so $${g}$ divides the left side, but $${g} \\nmid ${c}$.`,
              `$${a}m + ${b}n = ${g}(${term(a / g, "m")} + ${term(b / g, "n")})$，所以 $${g}$ 整除左边，但 $${g} \\nmid ${c}$。`,
            ),
          });
        }
      },
    },
  ],
};

/** isSquare tests whether n is a perfect square. */
const isSquare = (n: number) => Number.isInteger(Math.sqrt(n));

/** provingIrrationalityByContradiction proves square roots irrational. */
export const provingIrrationalityByContradiction: TopicDef = {
  id: "proving-irrationality-by-contradiction",
  title: t("Proving Irrationality by Contradiction", "用反证法证明无理性"),
  summary: t(
    "Assume √n = a/b in lowest terms; then a² = nb², and divisibility forces a and b to share a factor, a contradiction.",
    "假设 √n = a/b 且为最简分数，则 a² = nb²，由整除性可知 a、b 有公因数，矛盾。",
  ),
  prerequisites: ["proof-by-contradiction", "sums-and-products-of-rational-and-irrational-numbers"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-equation-from-a-rational-root",
      title: t("Clearing the root", "去掉根号"),
      explanation: t(
        "Assume $\\sqrt{2} = a/b$ with integers $a, b$ sharing no factor. Squaring gives $a^2 = 2b^2$, so $a^2$ is even and so $a$ is even. Writing $a = 2c$ gives $b^2 = 2c^2$, so $b$ is even too: a contradiction.",
        "假设 $\\sqrt{2} = a/b$，其中整数 $a, b$ 没有公因数。平方得 $a^2 = 2b^2$，所以 $a^2$ 是偶数，从而 $a$ 是偶数。写 $a = 2c$，得 $b^2 = 2c^2$，所以 $b$ 也是偶数：矛盾。",
      ),
      generate(rng) {
        const root = rng.pick([2, 3]);
        let n: number;
        do n = rng.int(2, 60);
        while (root === 2 ? isSquare(n) : Number.isInteger(Math.cbrt(n)));
        const r = root === 2 ? `\\sqrt{${n}}` : `\\sqrt[3]{${n}}`;
        const e = root;
        return oneOf(
          rng,
          t(
            `Assume $${r} = a/b$ for integers $a, b$ with $b \\ne 0$. Which equation follows?`,
            `假设 $${r} = a/b$，其中 $a, b$ 为整数且 $b \\ne 0$。可以推出哪个等式？`,
          ),
          math(`a^{${e}} = ${n}b^{${e}}`),
          [math(`a = ${n}b`), math(`a^{${e}} = ${n}b`), math(`a = ${n}b^{${e}}`), math(`a^{${e}} = ${n ** e}b^{${e}}`)],
          t(
            `Raise both sides to the power $${e}$: $a^{${e}}/b^{${e}} = ${n}$, so $a^{${e}} = ${n}b^{${e}}$.`,
            `两边同时取 $${e}$ 次方：$a^{${e}}/b^{${e}} = ${n}$，所以 $a^{${e}} = ${n}b^{${e}}$。`,
          ),
        );
      },
    },
    {
      id: "which-roots-are-rational",
      title: t("Which roots are rational", "哪些根是有理数"),
      explanation: t(
        "For a positive integer $n$, $\\sqrt{n}$ is rational exactly when $n$ is a perfect square, and $\\sqrt[3]{n}$ exactly when $n$ is a perfect cube. So $\\sqrt{49} = 7$ is rational and $\\sqrt{50}$ is irrational.",
        "对正整数 $n$，$\\sqrt{n}$ 是有理数当且仅当 $n$ 是完全平方数；$\\sqrt[3]{n}$ 是有理数当且仅当 $n$ 是完全立方数。所以 $\\sqrt{49} = 7$ 是有理数，而 $\\sqrt{50}$ 是无理数。",
      ),
      generate(rng) {
        const cube = rng.int(0, 3) === 0;
        const perfect = rng.bool();
        const n = cube
          ? perfect
            ? rng.int(1, 6) ** 3
            : rng.pick(range(2, 220).filter((x) => !Number.isInteger(Math.cbrt(x))))
          : perfect
            ? rng.int(1, 15) ** 2
            : rng.pick(range(2, 200).filter((x) => !isSquare(x)));
        const r = cube ? `\\sqrt[3]{${n}}` : `\\sqrt{${n}}`;
        const value = perfect;
        return oneOf(
          rng,
          t(`Is $${r}$ rational?`, `$${r}$ 是有理数吗？`),
          yesNo[value ? 0 : 1]!,
          [yesNo[value ? 1 : 0]!],
          value
            ? t(
                `$${r} = ${Math.round(cube ? Math.cbrt(n) : Math.sqrt(n))}$.`,
                `$${r} = ${Math.round(cube ? Math.cbrt(n) : Math.sqrt(n))}$。`,
              )
            : t(
                `$${n}$ is not a perfect ${cube ? "cube" : "square"}, so $${r}$ is irrational.`,
                `$${n}$ 不是完全${cube ? "立方" : "平方"}数，所以 $${r}$ 是无理数。`,
              ),
        );
      },
    },
  ],
};

/** provingPropertiesOfIrrationalsByContradiction proves sums and products with irrationals irrational. */
export const provingPropertiesOfIrrationalsByContradiction: TopicDef = {
  id: "proving-properties-of-irrationals-by-contradiction",
  title: t("Proving Properties of Irrationals by Contradiction", "用反证法证明无理数的性质"),
  summary: t(
    "If r is rational and x irrational, then r + x and (for r ≠ 0) rx are irrational: otherwise x would be rational.",
    "若 r 是有理数、x 是无理数，则 r + x 以及（r ≠ 0 时）rx 都是无理数：否则 x 就是有理数。",
  ),
  prerequisites: ["proving-irrationality-by-contradiction"],
  encompasses: [{ topic: "sums-and-products-of-rational-and-irrational-numbers", weight: 0.2 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "isolating-the-irrational",
      title: t("Isolating the irrational", "分离出无理数"),
      explanation: t(
        "To prove $3 + 2\\sqrt{5}$ is irrational, assume $3 + 2\\sqrt{5} = m/n$ with integers $m, n$. Then $\\sqrt{5} = \\dfrac{m - 3n}{2n}$, a ratio of integers, contradicting the irrationality of $\\sqrt{5}$.",
        "要证明 $3 + 2\\sqrt{5}$ 是无理数，假设 $3 + 2\\sqrt{5} = m/n$，$m, n$ 为整数。则 $\\sqrt{5} = \\dfrac{m - 3n}{2n}$ 是整数之比，与 $\\sqrt{5}$ 是无理数矛盾。",
      ),
      generate(rng) {
        const p = rng.pick([2, 3, 5, 6, 7, 10, 11, 13]);
        const a = rng.int(-9, 9);
        const b = rng.int(1, 7);
        const lhs = `${a === 0 ? "" : `${a} + `}${b === 1 ? "" : b}\\sqrt{${p}}`;
        const num = a === 0 ? "m" : `m ${a > 0 ? "-" : "+"} ${term(Math.abs(a), "n")}`;
        const den = b === 1 ? "n" : `${b}n`;
        const numBad = a === 0 ? `m - n` : `m ${a > 0 ? "+" : "-"} ${term(Math.abs(a), "n")}`;
        return oneOf(
          rng,
          t(
            `To prove $${lhs}$ is irrational, assume $${lhs} = \\dfrac{m}{n}$ for integers $m, n$ with $n \\ne 0$. Then $\\sqrt{${p}}$ equals what?`,
            `要证明 $${lhs}$ 是无理数，假设 $${lhs} = \\dfrac{m}{n}$，$m, n$ 为整数且 $n \\ne 0$。则 $\\sqrt{${p}}$ 等于什么？`,
          ),
          math(`\\dfrac{${num}}{${den}}`),
          [
            math(`\\dfrac{${numBad}}{${den}}`),
            math(`\\dfrac{${a === 0 ? "m" : `m ${a > 0 ? "-" : "+"} ${Math.abs(a)}`}}{${den}}`),
            math(`\\dfrac{${num}}{n}`),
            math(`\\dfrac{${b}m}{n}${a === 0 ? "" : ` ${a > 0 ? "-" : "+"} ${Math.abs(a)}`}`),
          ],
          t(
            `Multiply by $n$ and solve: $${b === 1 ? "" : b}\\sqrt{${p}}\\,n = ${num}$, so $\\sqrt{${p}} = \\dfrac{${num}}{${den}}$, which would be rational: a contradiction.`,
            `两边乘以 $n$ 再求解：$${b === 1 ? "" : b}\\sqrt{${p}}\\,n = ${num}$，所以 $\\sqrt{${p}} = \\dfrac{${num}}{${den}}$ 是有理数：矛盾。`,
          ),
        );
      },
    },
    {
      id: "rational-or-irrational",
      title: t("Rational or irrational?", "有理数还是无理数？"),
      explanation: t(
        "A nonzero rational times an irrational is irrational, and a rational plus an irrational is irrational. Two irrationals can combine to a rational: $\\sqrt{2} \\cdot \\sqrt{8} = 4$ and $(1 + \\sqrt{3}) + (1 - \\sqrt{3}) = 2$.",
        "非零有理数乘无理数是无理数，有理数加无理数也是无理数。两个无理数相结合可能得到有理数：$\\sqrt{2} \\cdot \\sqrt{8} = 4$，$(1 + \\sqrt{3}) + (1 - \\sqrt{3}) = 2$。",
      ),
      generate(rng) {
        const p = rng.pick([2, 3, 5, 6, 7, 10]);
        const a = rng.int(1, 9);
        const kind = rng.int(0, 3);
        let expr: string;
        let rational: boolean;
        let why: Text;
        if (kind === 0) {
          const zero = rng.int(0, 3) === 0;
          const b = zero ? 0 : rng.int(1, 6);
          expr = `${a} + ${b}\\sqrt{${p}}`;
          rational = zero;
          why = zero
            ? t(`$0 \\cdot \\sqrt{${p}} = 0$, so the number is $${a}$.`, `$0 \\cdot \\sqrt{${p}} = 0$，所以该数为 $${a}$。`)
            : t(
                `A rational plus a nonzero rational multiple of $\\sqrt{${p}}$ is irrational.`,
                `有理数加上 $\\sqrt{${p}}$ 的非零有理数倍是无理数。`,
              );
        } else if (kind === 1) {
          const q = rng.pick([2, 3, 5, 6, 7, 8, 10, 12, 18, 20, 24, 27, 45, 50]);
          expr = `\\sqrt{${p}} \\cdot \\sqrt{${q}}`;
          rational = isSquare(p * q);
          why = rational
            ? t(
                `$\\sqrt{${p}} \\cdot \\sqrt{${q}} = \\sqrt{${p * q}} = ${Math.sqrt(p * q)}$.`,
                `$\\sqrt{${p}} \\cdot \\sqrt{${q}} = \\sqrt{${p * q}} = ${Math.sqrt(p * q)}$。`,
              )
            : t(
                `$\\sqrt{${p}} \\cdot \\sqrt{${q}} = \\sqrt{${p * q}}$, and $${p * q}$ is not a perfect square.`,
                `$\\sqrt{${p}} \\cdot \\sqrt{${q}} = \\sqrt{${p * q}}$，而 $${p * q}$ 不是完全平方数。`,
              );
        } else if (kind === 2) {
          const b = rng.int(1, 6);
          const same = rng.bool();
          expr = `(${a} + ${b}\\sqrt{${p}}) + (${a} ${same ? "-" : "+"} ${b}\\sqrt{${p}})`;
          rational = same;
          why = same
            ? t(`The roots cancel: the sum is $${2 * a}$.`, `根式抵消：和为 $${2 * a}$。`)
            : t(`The sum is $${2 * a} + ${2 * b}\\sqrt{${p}}$, which is irrational.`, `和为 $${2 * a} + ${2 * b}\\sqrt{${p}}$，是无理数。`);
        } else {
          const b = rng.int(2, 9);
          expr = `\\dfrac{${b}}{\\sqrt{${p}}}`;
          rational = false;
          const g = gcd(b, p);
          const coef = p / g === 1 ? `${b / g}` : `\\dfrac{${b / g}}{${p / g}}`;
          why = t(
            `$\\dfrac{${b}}{\\sqrt{${p}}} = ${coef}\\sqrt{${p}}$, a nonzero rational times an irrational.`,
            `$\\dfrac{${b}}{\\sqrt{${p}}} = ${coef}\\sqrt{${p}}$，是非零有理数乘无理数。`,
          );
        }
        const options = [t("Rational", "有理数"), t("Irrational", "无理数")];
        return oneOf(
          rng,
          t(`Is $${expr}$ rational or irrational?`, `$${expr}$ 是有理数还是无理数？`),
          options[rational ? 0 : 1]!,
          [options[rational ? 1 : 0]!],
          why,
        );
      },
    },
  ],
};

/** provingDivisibilityByContradiction proves non-divisibility by contradiction. */
export const provingDivisibilityByContradiction: TopicDef = {
  id: "proving-divisibility-by-contradiction",
  title: t("Proving Divisibility by Contradiction", "用反证法证明整除性"),
  summary: t(
    "If d | m and d ∤ n, then d ∤ m + n: otherwise d would divide (m + n) − m = n.",
    "若 d | m 且 d ∤ n，则 d ∤ m + n：否则 d 将整除 (m + n) − m = n。",
  ),
  prerequisites: ["proof-by-contradiction", "proving-divisibility"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "isolating-the-non-divisible-part",
      title: t("Isolating the non-divisible part", "分离出不可整除的部分"),
      explanation: t(
        "To prove that if $3 \\mid m$ and $3 \\nmid n$ then $3 \\nmid 2m + n$, assume $3 \\mid 2m + n$. Then $n = (2m + n) - 2m$ is a difference of multiples of $3$, so $3 \\mid n$: a contradiction.",
        "要证明若 $3 \\mid m$ 且 $3 \\nmid n$，则 $3 \\nmid 2m + n$：假设 $3 \\mid 2m + n$。则 $n = (2m + n) - 2m$ 是 $3$ 的倍数之差，所以 $3 \\mid n$：矛盾。",
      ),
      generate(rng) {
        const d = rng.int(2, 11);
        const a = rng.int(1, 9);
        const b = rng.int(1, 5);
        const expr = `${term(a, "m")} + ${term(b, "n")}`;
        const s = (en: string, zh: string) => t(en, zh);
        return oneOf(
          rng,
          t(
            `Suppose $${d} \\mid m$ and $${d} \\nmid ${b === 1 ? "n" : `${b}n`}$. To show $${d} \\nmid ${expr}$, assume $${d} \\mid ${expr}$. Which step gives the contradiction?`,
            `设 $${d} \\mid m$ 且 $${d} \\nmid ${b === 1 ? "n" : `${b}n`}$。要证明 $${d} \\nmid ${expr}$，假设 $${d} \\mid ${expr}$。哪一步导出矛盾？`,
          ),
          s(
            `$${term(b, "n")} = (${expr}) - ${term(a, "m")}$, so $${d} \\mid ${term(b, "n")}$.`,
            `$${term(b, "n")} = (${expr}) - ${term(a, "m")}$，所以 $${d} \\mid ${term(b, "n")}$。`,
          ),
          [
            s(`$${expr} = ${d}k$ for some integer $k$, so $${d} \\mid m$.`, `存在整数 $k$ 使 $${expr} = ${d}k$，所以 $${d} \\mid m$。`),
            s(
              `$${term(a, "m")} = (${expr}) - ${term(b, "n")}$, so $${d} \\mid ${term(a, "m")}$.`,
              `$${term(a, "m")} = (${expr}) - ${term(b, "n")}$，所以 $${d} \\mid ${term(a, "m")}$。`,
            ),
            s(
              `$${term(b, "n")} = (${expr}) + ${term(a, "m")}$, so $${d} \\nmid ${term(b, "n")}$.`,
              `$${term(b, "n")} = (${expr}) + ${term(a, "m")}$，所以 $${d} \\nmid ${term(b, "n")}$。`,
            ),
          ],
          t(
            `Both $${expr}$ and $${term(a, "m")}$ are multiples of $${d}$, so their difference $${term(b, "n")}$ is too, contradicting $${d} \\nmid ${term(b, "n")}$.`,
            `$${expr}$ 与 $${term(a, "m")}$ 都是 $${d}$ 的倍数，所以它们的差 $${term(b, "n")}$ 也是，与 $${d} \\nmid ${term(b, "n")}$ 矛盾。`,
          ),
        );
      },
    },
    {
      id: "never-divisible-expressions",
      title: t("Never divisible", "永远不能整除"),
      explanation: t(
        "If $d \\mid m$, then $d \\mid am + c$ exactly when $d \\mid c$. So when $7 \\mid m$, $3m + 14$ is always divisible by $7$, while $3m + 10$ never is.",
        "若 $d \\mid m$，则 $d \\mid am + c$ 当且仅当 $d \\mid c$。所以当 $7 \\mid m$ 时，$3m + 14$ 总能被 $7$ 整除，而 $3m + 10$ 永远不能。",
      ),
      generate(rng) {
        const d = rng.int(3, 11);
        const coeffs = rng.shuffle(range(1, 9)).slice(0, 4);
        const mults = rng
          .shuffle(range(1, 6))
          .slice(0, 3)
          .map((k) => k * d);
        let c: number;
        do c = rng.int(1, 6 * d);
        while (c % d === 0);
        const v = rng.pick(["m", "n", "k", "x", "y"]);
        const never = rng.bool();
        const expr = (a: number, k: number) => math(`${term(a, v)} + ${k}`);
        const odd = never ? expr(coeffs[0]!, c) : expr(coeffs[0]!, mults[0]!);
        const rest = never
          ? mults.map((k, i) => expr(coeffs[i + 1]!, k))
          : [c, ...[1, 2].map(() => (c + rng.int(1, d - 1)) % d || 1)].map((k, i) => expr(coeffs[i + 1]!, k + d * i));
        return oneOf(
          rng,
          t(
            `Suppose $${d} \\mid ${v}$. Which expression is ${never ? "never" : "always"} divisible by $${d}$?`,
            `设 $${d} \\mid ${v}$。哪个表达式${never ? "永远不能" : "总能"}被 $${d}$ 整除？`,
          ),
          odd,
          rest,
          t(
            `Since $${d} \\mid ${v}$, $${d}$ divides $a${v} + c$ exactly when $${d} \\mid c$; if it divided the sum but not $c$, it would divide $c = (a${v} + c) - a${v}$, a contradiction.`,
            `因为 $${d} \\mid ${v}$，$${d}$ 整除 $a${v} + c$ 当且仅当 $${d} \\mid c$；若它整除和却不整除 $c$，则它整除 $c = (a${v} + c) - a${v}$，矛盾。`,
          ),
        );
      },
    },
  ],
};

/** methodsOfProofProofTopics are the new topics of Methods of Proof unit 3. */
export const methodsOfProofProofTopics: readonly TopicDef[] = [
  directProof,
  provingParity,
  provingDivisibility,
  proofByCases,
  disprovingUniversalStatements,
  disprovingImplications,
  trivialAndVacuousProofs,
  provingBiconditionalStatements,
  proofByContrapositive,
  provingParityByContrapositive,
  provingDivisibilityByContrapositive,
  proofByContradiction,
  provingIrrationalityByContradiction,
  provingPropertiesOfIrrationalsByContradiction,
  provingDivisibilityByContradiction,
];
