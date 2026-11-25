import type { Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";

import { numberProblem, why, yesNo } from "../problems.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";
import { oneOf } from "./calculus-common.ts";
import { walked } from "./calculus-i-differentiation.ts";
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

/** distinct keeps the first mistake for each wrong value. */
function distinct<T extends { readonly value: unknown }>(ms: readonly T[]): T[] {
  return ms.filter((m, i) => ms.findIndex((o) => String(o.value) === String(m.value)) === i);
}

/** directProof proves implications by assuming the hypothesis. */
export const directProof: TopicDef = {
  id: "direct-proof",
  title: t("Direct Proof", "直接证明"),
  summary: t(
    "A direct proof of 'if P then Q' assumes P and deduces Q through a chain of valid steps.",
    "“若 P 则 Q”的直接证明假设 P 成立，然后通过一串有效的推理得出 Q。",
  ),
  intro: t(
    "Claim: for every real $x$, if $x > 3$ then $2x + 1 > 7$. Take any real $x$ with $x > 3$. Doubling both sides gives $2x > 6$, and adding $1$ gives $2x + 1 > 7$, which is the conclusion. Nothing was assumed about $x$ except the hypothesis, so the claim holds for every such $x$.\n\nCheck: $x = 4$ satisfies $x > 3$, and $2 \\cdot 4 + 1 = 9$, which is greater than $7$, as the proof says.\n\nIn this lesson we begin a direct proof by assuming the hypothesis, and carry it to the conclusion one valid step at a time.",
    "命题：对每个实数 $x$，若 $x > 3$，则 $2x + 1 > 7$。任取满足 $x > 3$ 的实数 $x$。两边乘以 $2$ 得 $2x > 6$，再加 $1$ 得 $2x + 1 > 7$，这就是结论。除了前提，我们对 $x$ 没有作任何假设，所以命题对每个这样的 $x$ 都成立。\n\n检验：$x = 4$ 满足 $x > 3$，而 $2 \\cdot 4 + 1 = 9$ 大于 $7$，与证明一致。\n\n本课我们学习直接证明：先假设前提，再一步一步有效地推到结论。",
  ),
  prerequisites: ["implication-elimination-and-denying-the-consequent", "universal-and-existential-quantifiers"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-structure-of-a-direct-proof",
      title: t("The structure of a direct proof", "直接证明的结构"),
      explanation: t(
        'To prove $\\forall x\\,(P(x) \\Rightarrow Q(x))$ directly, let $x$ be arbitrary, **assume** $P(x)$, and deduce $Q(x)$. To prove "if $x > 3$ then $2x + 1 > 7$": assume $x > 3$; then $2x > 6$, so $2x + 1 > 7$.\n\n> **Watch out.** Never begin with the conclusion: assuming $Q(x)$ proves nothing about it. Beginning with "not $Q(x)$" is a different method, proof by contrapositive.',
        "直接证明 $\\forall x\\,(P(x) \\Rightarrow Q(x))$：任取 $x$，**假设** $P(x)$，推出 $Q(x)$。证明“若 $x > 3$，则 $2x + 1 > 7$”：假设 $x > 3$，则 $2x > 6$，所以 $2x + 1 > 7$。\n\n> **注意。** 不要从结论开始：假设 $Q(x)$ 对证明它毫无帮助。从“非 $Q(x)$”开始是另一种方法，即逆否证法。",
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
        const x = a + 1;
        return reasoned(
          oneOf(
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
            walked(
              [
                [
                  ["Name the parts", "找出两部分"],
                  t(`The hypothesis is $${P}$ and the conclusion is $${Q}$.`, `前提是 $${P}$，结论是 $${Q}$。`),
                ],
                [
                  ["Assume the hypothesis", "假设前提"],
                  t(
                    `A direct proof takes an arbitrary real $x$ with $${P}$ and works toward $${Q}$.`,
                    `直接证明任取满足 $${P}$ 的实数 $x$，再向 $${Q}$ 推进。`,
                  ),
                ],
              ],
              t(
                `The opening line covers $x = ${x}$, and there the conclusion holds: $${m} \\cdot ${x < 0 ? `(${x})` : x}${signed(b)} = ${m * x + b}$, which is greater than $${m * a + b}$.`,
                `开头一句适用于 $x = ${x}$，而此时结论成立：$${m} \\cdot ${x < 0 ? `(${x})` : x}${signed(b)} = ${m * x + b}$，大于 $${m * a + b}$。`,
              ),
            ),
          ),
          [
            [
              `Let $x$ be a real number with $${Q}$.`,
              "This assumes the conclusion, which is what must be shown.",
              "这里假设了结论，而结论正是要证明的。",
            ],
            [
              `Let $x$ be a real number with $${notQ}$.`,
              "This assumes the negated conclusion, which is how a proof by contrapositive begins.",
              "这里假设了结论的否定，那是逆否证法的开头。",
            ],
            [
              `Let $x$ be a real number with $${notP}$.`,
              "This assumes the negated hypothesis, and the statement says nothing about those $x$.",
              "这里假设了前提的否定，而命题对这样的 $x$ 什么也没说。",
            ],
          ],
        );
      },
    },
    {
      id: "steps-of-a-direct-proof",
      title: t("Steps of a direct proof", "直接证明的步骤"),
      explanation: t(
        "Each step must follow from the previous ones. Multiplying an inequality by a negative number reverses it: from $x > 2$ we get $-3x < -6$, so $5 - 3x < -1$.\n\n> **Watch out.** Whatever is done to one side is done to the other: adding $5$ to the left side adds $5$ to the right side too. And the order matters: multiplying first and adding second is not the same as adding first.",
        "每一步都必须由前面的结论推出。不等式两边乘以负数要变号：由 $x > 2$ 得 $-3x < -6$，所以 $5 - 3x < -1$。\n\n> **注意。** 对一边做的运算也要对另一边做：左边加 $5$，右边也要加 $5$。顺序也很重要：先乘后加与先加后乘不同。",
      ),
      generate(rng) {
        const a = rng.int(-9, 9);
        const m = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
        const b = rng.int(-9, 9);
        const lhs = `${b === 0 ? "" : `${b}`}${b === 0 ? term(m, "x") : plus(m, "x")}`;
        const rel = m > 0 ? ">" : "<";
        const flip = m > 0 ? "<" : ">";
        const c = m * a + b;
        const x = a + 1;
        const value = m * x + b;
        const turn: [string, string] =
          m > 0
            ? [
                `This reverses the inequality, but multiplying by the positive number $${m}$ keeps its direction.`,
                `这里不等号反向了，但乘以正数 $${m}$ 不改变方向。`,
              ]
            : [
                `This keeps the direction of $>$, but multiplying by the negative number $${m}$ reverses it.`,
                `这里保持了 $>$ 的方向，但乘以负数 $${m}$ 要变号。`,
              ];
        return reasoned(
          oneOf(
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
            walked(
              [
                [
                  [`Multiply by ${m}`, `乘以 ${m}`],
                  t(
                    `$${m}x ${rel} ${m * a}$${m < 0 ? ", since multiplying by a negative number reverses the inequality" : ""}.`,
                    `$${m}x ${rel} ${m * a}$${m < 0 ? "，因为乘以负数时不等号反向" : ""}。`,
                  ),
                ],
                [
                  [`Add ${b}`, `加 ${b}`],
                  t(`Both sides change by $${b}$: $${lhs} ${rel} ${c}$.`, `两边同时加 $${b}$：$${lhs} ${rel} ${c}$。`),
                ],
              ],
              t(
                `$x = ${x}$ satisfies $x > ${a}$ and gives $${lhs} = ${value}$, which is ${m > 0 ? "greater" : "less"} than $${c}$.`,
                `$x = ${x}$ 满足 $x > ${a}$，此时 $${lhs} = ${value}$，${m > 0 ? "大于" : "小于"} $${c}$。`,
              ),
            ),
          ),
          [
            [`$${lhs} ${flip} ${c}$`, turn[0], turn[1]],
            [`$${lhs} ${rel} ${m * a}$`, `The left side gained $${b}$, but the right side did not.`, `左边加了 $${b}$，右边却没有加。`],
            [
              `$${lhs} ${rel} ${m * (a + b)}$`,
              `This adds $${b}$ before multiplying, so $${b}$ was multiplied by $${m}$ as well.`,
              `这是先加 $${b}$ 再乘，所以 $${b}$ 也被乘了 $${m}$。`,
            ],
            [
              `$${lhs} ${flip} ${m * a}$`,
              `Two slips: the direction of the inequality is wrong, and $${b}$ was added to only one side.`,
              `两处错误：不等号方向不对，而且 $${b}$ 只加在了一边。`,
            ],
          ],
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
    s,
    q,
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
  intro: t(
    "Take an odd number $m = 2j + 1$ and an even number $n = 2k$, where $j$ and $k$ are integers. Then $m + n = 2j + 2k + 1 = 2(j + k) + 1$. Since $j + k$ is an integer, $m + n$ has the form $2 \\cdot (\\text{integer}) + 1$, so it is odd, whatever $m$ and $n$ are.\n\nCheck: $m = 7$ and $n = 4$ give $m + n = 11$, which is odd; here $j = 3$, $k = 2$ and $2(3 + 2) + 1 = 11$.\n\nIn this lesson we write expressions in the forms $2k$ and $2k + 1$ to prove that they are even or odd.",
    "取奇数 $m = 2j + 1$ 和偶数 $n = 2k$，其中 $j$、$k$ 是整数。则 $m + n = 2j + 2k + 1 = 2(j + k) + 1$。因为 $j + k$ 是整数，$m + n$ 具有 $2 \\cdot (\\text{整数}) + 1$ 的形式，所以无论 $m$、$n$ 是多少，它都是奇数。\n\n检验：$m = 7$，$n = 4$ 时 $m + n = 11$，是奇数；此时 $j = 3$，$k = 2$，而 $2(3 + 2) + 1 = 11$。\n\n本课我们把表达式写成 $2k$ 或 $2k + 1$ 的形式，以证明它是偶数或奇数。",
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
        "Write an odd $m$ as $2j + 1$ and an even $n$ as $2k$. Then $3m + n + 4 = 6j + 3 + 2k + 4 = 2(3j + k + 3) + 1$, which is odd because $3j + k + 3$ is an integer.\n\n> **Watch out.** Add up the constants first, then halve them: $3 + 4 = 7 = 2 \\cdot 3 + 1$, so $3$ goes inside the bracket and $+ 1$ stays outside. A constant written inside the bracket gets doubled.",
        "把奇数 $m$ 写成 $2j + 1$，偶数 $n$ 写成 $2k$。则 $3m + n + 4 = 6j + 3 + 2k + 4 = 2(3j + k + 3) + 1$，因为 $3j + k + 3$ 是整数，所以它是奇数。\n\n> **注意。** 先把常数加起来，再折半：$3 + 4 = 7 = 2 \\cdot 3 + 1$，所以 $3$ 放进括号，$+ 1$ 留在外面。写进括号的常数会被乘以 $2$。",
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
        const times = (k: number, e: number, v: string) => (k === 1 ? forms(e, v) : `${k}(${forms(e, v)})`);
        const [w1, w2, w3, w4] = g.wrong as [string, string, string, string];
        return reasoned(
          oneOf(
            rng,
            t(
              `Let $m = ${forms(e1, "j")}$ and $n = ${forms(e2, "k")}$ for integers $j, k$. Which correctly rewrites $${expr}$?`,
              `设 $m = ${forms(e1, "j")}$，$n = ${forms(e2, "k")}$，其中 $j, k$ 为整数。哪一个是 $${expr}$ 的正确改写？`,
            ),
            math(g.right),
            [...g.wrong.map(math), math(f.right)],
            walked(
              [
                [
                  ["Substitute", "代入"],
                  t(
                    `$${expr} = ${times(a, e1, "j")} + ${times(b, e2, "k")} + ${c}$.`,
                    `$${expr} = ${times(a, e1, "j")} + ${times(b, e2, "k")} + ${c}$。`,
                  ),
                ],
                [
                  ["Collect the constants", "合并常数"],
                  t(
                    `This is $${term(2 * a, "j")}${plus(2 * b, "k")} + ${g.s}$.`,
                    `它等于 $${term(2 * a, "j")}${plus(2 * b, "k")} + ${g.s}$。`,
                  ),
                ],
                [
                  ["Factor out 2", "提出 2"],
                  t(
                    `$${g.s} = 2 \\cdot ${g.q}${g.r === 1 ? " + 1" : ""}$, so the expression is $${g.right}$, which is ${parityName(g.r).en}.`,
                    `$${g.s} = 2 \\cdot ${g.q}${g.r === 1 ? " + 1" : ""}$，所以表达式等于 $${g.right}$，是${parityName(g.r)["zh-CN"]}。`,
                  ),
                ],
              ],
              t(
                `Take $j = k = 0$, so $m = ${e1}$ and $n = ${e2}$: the expression is $${g.s}$, and $2 \\cdot ${g.q}${g.r === 1 ? " + 1" : ""} = ${g.s}$ too.`,
                `取 $j = k = 0$，则 $m = ${e1}$，$n = ${e2}$：表达式等于 $${g.s}$，而 $2 \\cdot ${g.q}${g.r === 1 ? " + 1" : ""}$ 也等于 $${g.s}$。`,
              ),
            ),
          ),
          [
            [
              `$${w1}$`,
              `The bracket holds $${g.q + 1}$ as its constant, which makes the constant part $${2 * (g.q + 1) + g.r}$ instead of $${g.s}$.`,
              `括号中的常数是 $${g.q + 1}$，这使常数部分变成 $${2 * (g.q + 1) + g.r}$，而不是 $${g.s}$。`,
            ],
            [
              `$${w2}$`,
              `The part outside the bracket is wrong: the constants add up to $${g.s}$, and halving it leaves ${g.r === 1 ? "a remainder of $1$" : "no remainder"}.`,
              `括号外的部分不对：常数之和是 $${g.s}$，折半后${g.r === 1 ? "余 $1$" : "没有余数"}。`,
            ],
            [
              `$${w3}$`,
              `The whole constant $${g.s}$ went inside the bracket, where it is doubled; only half of it belongs there.`,
              `整个常数 $${g.s}$ 都放进了括号，在那里会被乘以 $2$；括号里只应放它的一半。`,
            ],
            [
              `$${w4}$`,
              `The constant $${c}$ went inside the bracket without being halved; add all the constants first, then halve.`,
              `常数 $${c}$ 没有折半就放进了括号；应先把所有常数加起来，再折半。`,
            ],
            [
              `$${f.right}$`,
              `The bracket holds $${term(2 * a, "j")}$; factoring $2$ out of $${term(2 * a, "j")}$ leaves $${term(a, "j")}$.`,
              `括号中是 $${term(2 * a, "j")}$；从 $${term(2 * a, "j")}$ 中提出 $2$ 后剩 $${term(a, "j")}$。`,
            ],
          ],
        );
      },
    },
    {
      id: "parity-of-expressions",
      title: t("Parity of expressions", "表达式的奇偶性"),
      explanation: t(
        "Sums and products of integers have predictable parity: odd + odd is even, odd · odd is odd, and anything times an even number is even. If $m$ and $n$ are odd, $mn + m = m(n + 1)$ is even.\n\n> **Watch out.** Odd + odd is even, not odd, and a product is odd only when every factor is odd. Since only parities matter, $0$ can stand for any even number and $1$ for any odd one.",
        "整数的和与积的奇偶性是可以确定的：奇 + 奇 = 偶，奇 · 奇 = 奇，任何整数乘偶数都是偶数。若 $m$、$n$ 都是奇数，则 $mn + m = m(n + 1)$ 是偶数。\n\n> **注意。** 奇 + 奇是偶数，不是奇数；乘积只有在每个因数都是奇数时才是奇数。因为只有奇偶性起作用，可以用 $0$ 代表任意偶数，用 $1$ 代表任意奇数。",
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
        const other = 1 - r;
        return reasoned(
          oneOf(
            rng,
            t(
              `If $m$ is ${word(e1).en} and $n$ is ${word(e2).en}, is $${expr}$ even or odd?`,
              `若 $m$ 是${word(e1)["zh-CN"]}，$n$ 是${word(e2)["zh-CN"]}，$${expr}$ 是偶数还是奇数？`,
            ),
            options[r] as Text,
            [options[other] as Text, options[2] as Text],
            walked(
              [
                [
                  ["Choose representatives", "选代表"],
                  t(
                    `Parity depends only on the parities of $m$ and $n$, so take $m = ${e1}$ and $n = ${e2}$.`,
                    `奇偶性只依赖于 $m$、$n$ 的奇偶性，所以取 $m = ${e1}$，$n = ${e2}$。`,
                  ),
                ],
                [
                  ["Evaluate", "求值"],
                  t(
                    `$${expr}$ becomes $${f(e1, e2)}$, which is ${parityName(r).en}.`,
                    `$${expr}$ 变为 $${f(e1, e2)}$，是${parityName(r)["zh-CN"]}。`,
                  ),
                ],
              ],
              t(
                `Other representatives agree: $m = ${e1 + 2}$ and $n = ${e2 + 2}$ give $${f(e1 + 2, e2 + 2)}$, also ${parityName(r).en}.`,
                `换别的代表也一致：$m = ${e1 + 2}$，$n = ${e2 + 2}$ 时得 $${f(e1 + 2, e2 + 2)}$，同样是${parityName(r)["zh-CN"]}。`,
              ),
            ),
          ),
          [
            [
              (options[other] as Text).en,
              `Work out one case to test this: $m = ${e1}$ and $n = ${e2}$ make $${expr}$ equal to $${f(e1, e2)}$, which is not ${parityName(other).en}.`,
              `用一个情形检验：$m = ${e1}$，$n = ${e2}$ 时 $${expr}$ 等于 $${f(e1, e2)}$，它不是${parityName(other)["zh-CN"]}。`,
            ],
            [
              (options[2] as Text).en,
              "The parity of a sum or a product depends only on the parities of its parts, and those are fixed here, so the result is fixed too.",
              "和与积的奇偶性只依赖于各部分的奇偶性，而这里它们是确定的，所以结果也是确定的。",
            ],
          ],
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
  intro: t(
    "Claim: if $3 \\mid m$ and $3 \\mid n$, then $3 \\mid m + n$. Since $3 \\mid m$, there is an integer $j$ with $m = 3j$, and likewise $n = 3k$ for an integer $k$. Then $m + n = 3j + 3k = 3(j + k)$, and $j + k$ is an integer, so $m + n$ is a multiple of $3$.\n\nCheck: $m = 6$ and $n = 15$ give $m + n = 21 = 3 \\cdot 7$, and indeed $j + k = 2 + 5 = 7$.\n\nIn this lesson we prove divisibility by writing a number as the divisor times an integer, and find which divisors are guaranteed.",
    "命题：若 $3 \\mid m$ 且 $3 \\mid n$，则 $3 \\mid m + n$。因为 $3 \\mid m$，存在整数 $j$ 使 $m = 3j$；同理 $n = 3k$，$k$ 为整数。则 $m + n = 3j + 3k = 3(j + k)$，而 $j + k$ 是整数，所以 $m + n$ 是 $3$ 的倍数。\n\n检验：$m = 6$，$n = 15$ 时 $m + n = 21 = 3 \\cdot 7$，确实 $j + k = 2 + 5 = 7$。\n\n本课我们把一个数写成除数乘以整数来证明整除性，并找出必然成立的因数。",
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
        "If a number divides two integers, writing each as a multiple of it shows that it also divides any combination of them with integer coefficients. If $a \\mid m$ and $a \\mid n$, write $m = aj$ and $n = ak$. Then $3m - 2n = 3aj - 2ak = a(3j - 2k)$, and $3j - 2k$ is an integer, so $a \\mid 3m - 2n$.\n\n> **Watch out.** Use two different letters, $m = aj$ and $n = ak$: writing both as $ak$ would force $m = n$. Only one factor $a$ comes out of each term, and the coefficients stay inside the bracket.",
        "如果一个数整除两个整数，把它们都写成这个数的倍数，就能看出它也整除它们的任何整系数组合。若 $a \\mid m$ 且 $a \\mid n$，写 $m = aj$，$n = ak$。则 $3m - 2n = 3aj - 2ak = a(3j - 2k)$，而 $3j - 2k$ 是整数，所以 $a \\mid 3m - 2n$。\n\n> **注意。** 要用两个不同的字母，$m = aj$，$n = ak$：都写成 $ak$ 就等于规定了 $m = n$。每一项只能提出一个因数 $a$，系数要留在括号里。",
      ),
      generate(rng) {
        const d = rng.int(2, 9);
        const p = rng.pick([1, 2, 3, 4, 5, 6, 7]);
        const q = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const expr = `${term(p, "m")}${plus(q, "n")}`;
        const inner = `${term(p, "j")}${plus(q, "k")}`;
        return reasoned(
          oneOf(
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
            walked(
              [
                [
                  ["Substitute", "代入"],
                  t(`$${expr} = ${term(p * d, "j")}${plus(q * d, "k")}$.`, `$${expr} = ${term(p * d, "j")}${plus(q * d, "k")}$。`),
                ],
                [
                  [`Factor out ${d}`, `提出 ${d}`],
                  t(
                    `$${expr} = ${d}(${inner})$, and $${inner}$ is an integer, so $${d} \\mid ${expr}$.`,
                    `$${expr} = ${d}(${inner})$，而 $${inner}$ 是整数，所以 $${d} \\mid ${expr}$。`,
                  ),
                ],
              ],
              t(
                `With $j = k = 1$, $m = n = ${d}$ and $${expr} = ${(p + q) * d}$, which is $${d} \\cdot ${p + q}$, matching $${d}(${p} ${q < 0 ? "-" : "+"} ${Math.abs(q)})$.`,
                `取 $j = k = 1$，则 $m = n = ${d}$，$${expr} = ${(p + q) * d}$，即 $${d} \\cdot ${p + q}$，与 $${d}(${p} ${q < 0 ? "-" : "+"} ${Math.abs(q)})$ 一致。`,
              ),
            ),
          ),
          [
            [
              `$${expr} = ${d}(j${plus(1, "k")})$`,
              "The coefficients were dropped: they stay inside the bracket after the common factor comes out.",
              "系数被丢掉了：提出公因数后，系数要留在括号里。",
            ],
            [
              `$${expr} = ${d * d}(${inner})$`,
              `Each term carries only one factor $${d}$, so only $${d}$ comes out, not $${d * d}$.`,
              `每一项只含一个因数 $${d}$，所以只能提出 $${d}$，不能提出 $${d * d}$。`,
            ],
            [
              `$${expr} = ${d}(${inner}) + ${d}$`,
              `The extra $+ ${d}$ has no source: expanding the substitution gives no constant term.`,
              `多出的 $+ ${d}$ 没有来源：代入展开后没有常数项。`,
            ],
            [
              `$${expr} = ${p * d}(j${plus(q, "k")})$`,
              `This takes $${p * d}$ out of both terms, but the $n$ term carries only the factor $${d}$ for certain.`,
              `这是从两项中都提出 $${p * d}$，但 $n$ 那一项只能确定含有因数 $${d}$。`,
            ],
          ],
        );
      },
    },
    {
      id: "guaranteed-divisors",
      title: t("Guaranteed divisors", "必然的因数"),
      explanation: t(
        "Writing each number as a multiple of its known divisor shows exactly which factors are forced in a product or a sum. If $4 \\mid m$ and $6 \\mid n$, then $m = 4j$ and $n = 6k$, so $mn = 24jk$: $24 \\mid mn$. But $m + n = 4j + 6k = 2(2j + 3k)$ is only guaranteed to be divisible by $2$ (try $m = 4$, $n = 6$).\n\n> **Watch out.** A product multiplies the known divisors, but a sum keeps only the factors that the two terms share. To rule out a larger divisor, one example is enough.",
        "把每个数写成它已知因数的倍数，就能准确看出乘积或和中必然含有哪些因数。若 $4 \\mid m$ 且 $6 \\mid n$，则 $m = 4j$，$n = 6k$，所以 $mn = 24jk$：$24 \\mid mn$。但 $m + n = 4j + 6k = 2(2j + 3k)$ 只能保证被 $2$ 整除（试 $m = 4$，$n = 6$）。\n\n> **注意。** 乘积会把已知因数相乘，而和只保留两项共有的因数。要排除更大的因数，一个例子就够了。",
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
        const mistakes = product
          ? [
              why(
                g,
                `That is the greatest common divisor, which is all a sum keeps; in the product $mn$ the known factors multiply.`,
                `这是最大公因数，是和所能保留的；在乘积 $mn$ 中，已知因数要相乘。`,
              ),
              why(a + b, "In a product the known divisors multiply; they do not add.", "在乘积中已知因数要相乘，而不是相加。"),
              why(
                Math.max(a, b),
                `$mn$ carries both factors $${a}$ and $${b}$, so it is divisible by more than the larger one.`,
                `$mn$ 同时含有因数 $${a}$ 和 $${b}$，所以必然整除它的数比 $${Math.max(a, b)}$ 更大。`,
              ),
              why(
                (a * b) / g,
                `That is the least common multiple; $mn = ${a}j \\cdot ${b}k$ keeps every factor of both.`,
                `这是最小公倍数；$mn = ${a}j \\cdot ${b}k$ 保留了两者的全部因数。`,
              ),
            ]
          : [
              why(
                a * b,
                "That is what the product $mn$ is guaranteed; a sum keeps only the factors common to both terms.",
                "这是乘积 $mn$ 必然含有的因数；和只保留两项共有的因数。",
              ),
              why(
                a + b,
                `Adding the divisors gives nothing: $${a}j + ${b}k$ is divisible only by factors that both terms share.`,
                `把因数相加没有意义：$${a}j + ${b}k$ 只能被两项共有的因数整除。`,
              ),
              why(
                Math.max(a, b),
                `$${Math.max(a, b)}$ need not divide the other term, so it need not divide the sum.`,
                `$${Math.max(a, b)}$ 不一定整除另一项，所以不一定整除和。`,
              ),
              why(
                (a * b) / g,
                "The least common multiple is a multiple of both divisors, but a sum keeps only their common factors.",
                "最小公倍数是两个因数的公倍数，但和只保留它们的公因数。",
              ),
            ];
        return numberProblem({
          prompt: t(
            `Suppose $${a} \\mid m$ and $${b} \\mid n$. What is the largest integer that must divide $${product ? "mn" : "m + n"}$?`,
            `设 $${a} \\mid m$，$${b} \\mid n$。一定能整除 $${product ? "mn" : "m + n"}$ 的最大整数是多少？`,
          ),
          answer,
          mistakes: distinct(mistakes),
          solution: product
            ? walked(
                [
                  [
                    ["Write the multiples", "写成倍数"],
                    t(`$m = ${a}j$ and $n = ${b}k$ for integers $j, k$.`, `$m = ${a}j$，$n = ${b}k$，$j, k$ 为整数。`),
                  ],
                  [
                    ["Multiply", "相乘"],
                    t(
                      `$mn = ${a}j \\cdot ${b}k = ${a * b}jk$, so $${a * b} \\mid mn$.`,
                      `$mn = ${a}j \\cdot ${b}k = ${a * b}jk$，所以 $${a * b} \\mid mn$。`,
                    ),
                  ],
                ],
                t(
                  `$m = ${a}$ and $n = ${b}$ give $mn = ${a * b}$ exactly, so no larger integer must divide $mn$.`,
                  `$m = ${a}$，$n = ${b}$ 时 $mn$ 恰好等于 $${a * b}$，所以不存在更大的必然因数。`,
                ),
              )
            : walked(
                [
                  [
                    ["Write the multiples", "写成倍数"],
                    t(`$m = ${a}j$ and $n = ${b}k$ for integers $j, k$.`, `$m = ${a}j$，$n = ${b}k$，$j, k$ 为整数。`),
                  ],
                  [
                    ["Add", "相加"],
                    t(
                      `$m + n = ${a}j + ${b}k${g === 1 ? "" : ` = ${g}(${term(a / g, "j")} + ${term(b / g, "k")})`}$, so $${g} \\mid m + n$.`,
                      `$m + n = ${a}j + ${b}k${g === 1 ? "" : ` = ${g}(${term(a / g, "j")} + ${term(b / g, "k")})`}$，所以 $${g} \\mid m + n$。`,
                    ),
                  ],
                ],
                t(
                  `$m = ${a * wj}$ and $n = ${b * wk}$ satisfy the conditions and give $m + n = ${g}$, so no larger integer must divide $m + n$.`,
                  `$m = ${a * wj}$，$n = ${b * wk}$ 满足条件，且 $m + n = ${g}$，所以不存在更大的必然因数。`,
                ),
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
  intro: t(
    "Claim: $n^2 + n$ is even for every integer $n$. Every integer is even or odd, so two cases cover them all. If $n = 2k$, then $n^2 + n = 4k^2 + 2k = 2(2k^2 + k)$. If $n = 2k + 1$, then $n^2 + n = 4k^2 + 4k + 1 + 2k + 1 = 2(2k^2 + 3k + 1)$. Both cases give an even number, so the claim holds.\n\nCheck: $n = 4$ gives $16 + 4 = 20$ and $n = 3$ gives $9 + 3 = 12$, both even.\n\nIn this lesson we split a proof into cases that cover every possibility, and decide parity case by case.",
    "命题：对每个整数 $n$，$n^2 + n$ 都是偶数。每个整数不是偶数就是奇数，所以两种情形就能覆盖全部。若 $n = 2k$，则 $n^2 + n = 4k^2 + 2k = 2(2k^2 + k)$。若 $n = 2k + 1$，则 $n^2 + n = 4k^2 + 4k + 1 + 2k + 1 = 2(2k^2 + 3k + 1)$。两种情形都得到偶数，所以命题成立。\n\n检验：$n = 4$ 时 $16 + 4 = 20$，$n = 3$ 时 $9 + 3 = 12$，都是偶数。\n\n本课我们把证明分成覆盖所有可能的若干情形，并逐个情形判断奇偶性。",
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
        "To prove $n^2 + 3n$ is even for every integer $n$, split into cases. If $n = 2k$: $4k^2 + 6k = 2(2k^2 + 3k)$. If $n = 2k + 1$: $4k^2 + 4k + 1 + 6k + 3 = 2(2k^2 + 5k + 2)$. Both are even.\n\n> **Watch out.** Square all of $2k + 1$: $(2k + 1)^2 = 4k^2 + 4k + 1$, not $4k^2 + 1$. And prove every case: the case $n = 2k$ alone says nothing about odd $n$.",
        "证明对每个整数 $n$，$n^2 + 3n$ 都是偶数，可以分情形。若 $n = 2k$：$4k^2 + 6k = 2(2k^2 + 3k)$。若 $n = 2k + 1$：$4k^2 + 4k + 1 + 6k + 3 = 2(2k^2 + 5k + 2)$。两者都是偶数。\n\n> **注意。** 要把整个 $2k + 1$ 平方：$(2k + 1)^2 = 4k^2 + 4k + 1$，而不是 $4k^2 + 1$。每种情形都要证明：只证 $n = 2k$ 对奇数 $n$ 什么也没说明。",
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
        const whyNot: readonly string[][] = odd
          ? [
              [
                "The $k$ terms are short: the middle term $4k$ of $(2k + 1)^2 = 4k^2 + 4k + 1$ was left out.",
                "$k$ 的项少了：$(2k + 1)^2 = 4k^2 + 4k + 1$ 的中间项 $4k$ 被漏掉了。",
              ],
              ["The constant was not halved when $2$ was factored out.", "提出 $2$ 时常数没有折半。"],
              ["$(2k + 1)^2$ begins with $4k^2$, not $2k^2$.", "$(2k + 1)^2$ 的首项是 $4k^2$，不是 $2k^2$。"],
              [
                `The constants add up to $${a + b}$, which is even, so they belong inside the bracket; nothing is left over as $+ 1$.`,
                `常数之和是 $${a + b}$，是偶数，应放进括号里；没有剩下 $+ 1$。`,
              ],
            ]
          : [
              ["$(2k)^2 = 4k^2$, not $2k^2$.", "$(2k)^2 = 4k^2$，不是 $2k^2$。"],
              [`Factoring $2$ out of $${2 * b}k$ leaves $${term(b, "k")}$.`, `从 $${2 * b}k$ 中提出 $2$ 后剩 $${term(b, "k")}$。`],
              [
                "There is no constant term: with $n = 2k$, every term carries a factor $k$.",
                "没有常数项：$n = 2k$ 时每一项都含有因数 $k$。",
              ],
            ];
        const nForm = odd ? "2k + 1" : "2k";
        const sub = `${a === 1 ? "" : a}(${nForm})^2${b === 0 ? "" : ` + ${b === 1 ? "" : b}(${nForm})`}`;
        const expanded = odd
          ? `${term(4 * a, "k^2")}${plus(4 * a + 2 * b, "k")}${signed(a + b)}`
          : `${term(4 * a, "k^2")}${plus(2 * b, "k")}`;
        const n = odd ? 3 : 2;
        const value = a * n * n + b * n;
        return reasoned(
          oneOf(
            rng,
            t(
              `To prove $${expr}$ is even for every integer $n$, consider the case $n = ${nForm}$. Which is $${expr}$ in this case?`,
              `证明对每个整数 $n$，$${expr}$ 都是偶数。考虑 $n = ${nForm}$ 的情形，此时 $${expr}$ 等于哪一个？`,
            ),
            math(right),
            wrong.map(math),
            walked(
              [
                [["Substitute", "代入"], t(`$${expr} = ${sub}$.`, `$${expr} = ${sub}$。`)],
                [["Expand", "展开"], t(`This is $${expanded}$.`, `它等于 $${expanded}$。`)],
                [
                  ["Factor out 2", "提出 2"],
                  t(`Every coefficient is even, so it equals $${right}$.`, `每个系数都是偶数，所以它等于 $${right}$。`),
                ],
              ],
              t(
                `At $k = 1$, $n = ${n}$ and $${expr} = ${value}$, and the factored form gives $2 \\cdot ${value / 2} = ${value}$ too.`,
                `$k = 1$ 时，$n = ${n}$，$${expr} = ${value}$，而因式分解后的形式也得 $2 \\cdot ${value / 2} = ${value}$。`,
              ),
            ),
          ),
          wrong.map((w, i): Reason => [`$${w}$`, whyNot[i]?.[0] ?? "", whyNot[i]?.[1] ?? ""]),
        );
      },
    },
    {
      id: "deciding-parity-by-cases",
      title: t("Deciding parity by cases", "分情形判断奇偶性"),
      explanation: t(
        "Checking the two cases tells whether an expression has fixed parity. For $n^2 + n + 1$: if $n$ is even it is even + even + 1, odd; if $n$ is odd it is odd + odd + 1, odd. So it is always odd.\n\n> **Watch out.** Both cases are needed. One case alone cannot show that the parity is fixed, and when the two cases disagree, the parity depends on $n$.",
        "检验两种情形就能判断表达式的奇偶性是否固定。对 $n^2 + n + 1$：若 $n$ 为偶数，它是偶 + 偶 + 1，为奇数；若 $n$ 为奇数，它是奇 + 奇 + 1，也为奇数。所以它总是奇数。\n\n> **注意。** 两种情形都要看。只看一种情形无法说明奇偶性固定；两种情形结果不同时，奇偶性就取决于 $n$。",
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
        const reasons: Reason[] =
          even === odd
            ? [
                [
                  (options[1 - even] as Text).en,
                  `Test the two cases: $n = 0$ gives $${c}$ and $n = 1$ gives $${a + b + c}$, and neither is ${parityName(1 - even).en}.`,
                  `检验两种情形：$n = 0$ 时得 $${c}$，$n = 1$ 时得 $${a + b + c}$，两者都不是${parityName(1 - even)["zh-CN"]}。`,
                ],
                [
                  (options[2] as Text).en,
                  "The even case and the odd case give the same parity, so it does not change with $n$.",
                  "偶数情形与奇数情形得到相同的奇偶性，所以它不随 $n$ 改变。",
                ],
              ]
            : [0, 1].map(
                (p): Reason => [
                  (options[p] as Text).en,
                  `This holds in only one case: $n = 0$ gives $${c}$ and $n = 1$ gives $${a + b + c}$, which have different parities.`,
                  `这只在一种情形下成立：$n = 0$ 时得 $${c}$，$n = 1$ 时得 $${a + b + c}$，两者奇偶性不同。`,
                ],
              );
        return reasoned(
          oneOf(
            rng,
            t(
              `For integers $n$, is $${expr}$ always even, always odd, or does it depend on $n$?`,
              `对整数 $n$，$${expr}$ 总是偶数、总是奇数，还是取决于 $n$？`,
            ),
            right,
            options.filter((o) => o !== right),
            walked(
              [
                [
                  ["Take n even", "取 n 为偶数"],
                  t(
                    `Then $n^2$ and $n$ are even, so $${expr}$ has the parity of $${c}$: ${parityName(even).en}.`,
                    `此时 $n^2$ 与 $n$ 都是偶数，所以 $${expr}$ 与 $${c}$ 同奇偶：${parityName(even)["zh-CN"]}。`,
                  ),
                ],
                [
                  ["Take n odd", "取 n 为奇数"],
                  t(
                    `Then $n^2$ and $n$ are odd, so it has the parity of $${a} + ${b} + ${c} = ${a + b + c}$: ${parityName(odd).en}.`,
                    `此时 $n^2$ 与 $n$ 都是奇数，所以它与 $${a} + ${b} + ${c} = ${a + b + c}$ 同奇偶：${parityName(odd)["zh-CN"]}。`,
                  ),
                ],
                [
                  ["Compare the cases", "比较两种情形"],
                  even === odd
                    ? t(
                        `Both cases give ${parityName(even).en}, so it is always ${parityName(even).en}.`,
                        `两种情形都是${parityName(even)["zh-CN"]}，所以它总是${parityName(even)["zh-CN"]}。`,
                      )
                    : t("The cases disagree, so the parity depends on $n$.", "两种情形结果不同，所以奇偶性取决于 $n$。"),
                ],
              ],
              t(
                `$n = 2$ gives $${4 * a + 2 * b + c}$ and $n = 3$ gives $${9 * a + 3 * b + c}$: ${parityName(even).en} and ${parityName(odd).en}, as the two cases say.`,
                `$n = 2$ 时得 $${4 * a + 2 * b + c}$，$n = 3$ 时得 $${9 * a + 3 * b + c}$：分别是${parityName(even)["zh-CN"]}和${parityName(odd)["zh-CN"]}，与两种情形一致。`,
              ),
            ),
          ),
          reasons,
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
  intro: t(
    "Claim: $n^2 + n + 41$ is prime for every positive integer $n$. It gives primes for $n = 1, 2, 3$ and on, far past $30$. But at $n = 41$ every term is a multiple of $41$: $41^2 + 41 + 41 = 41 \\cdot 43$, which is not prime. That one value disproves the claim, however many values agree with it.\n\nCheck: $41 \\cdot 43 = 1763$, and $41^2 + 41 + 41 = 1681 + 82 = 1763$.\n\nIn this lesson we disprove statements about every element with one counterexample, and say exactly what a disproof must show.",
    "命题：对每个正整数 $n$，$n^2 + n + 41$ 都是质数。$n = 1, 2, 3$ 直到远超 $30$ 都得到质数。但在 $n = 41$ 处，每一项都是 $41$ 的倍数：$41^2 + 41 + 41 = 41 \\cdot 43$，不是质数。无论有多少值与命题相符，这一个值就否定了命题。\n\n检验：$41 \\cdot 43 = 1763$，而 $41^2 + 41 + 41 = 1681 + 82 = 1763$。\n\n本课我们用一个反例否定关于每个元素的命题，并说清否定到底需要证明什么。",
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
        '"$n^2 + n + 11$ is prime for every positive integer $n$" looks plausible for small $n$, but $n = 10$ gives $121 = 11^2$. One counterexample is enough; checking many cases that work proves nothing.\n\n> **Watch out.** A counterexample must make the statement false. A value where the statement holds is not a counterexample, and neither is a value outside the domain, such as $n = 0$ when $n$ must be positive.',
        "“对每个正整数 $n$，$n^2 + n + 11$ 都是质数”对较小的 $n$ 看似成立，但 $n = 10$ 时得 $121 = 11^2$。一个反例就足够；验证再多成立的情形也证明不了什么。\n\n> **注意。** 反例必须使命题为假。使命题成立的值不是反例，论域之外的值也不是，例如要求 $n$ 为正数时的 $n = 0$。",
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
          return reasoned(
            oneOf(
              rng,
              t(
                `Claim: "$${expr}$ is prime for every positive integer $n$." Which value of $n$ is a counterexample?`,
                `命题：“对每个正整数 $n$，$${expr}$ 都是质数。”哪个 $n$ 是反例？`,
              ),
              math(`n = ${n}`),
              rng.shuffle(good).map((g) => math(`n = ${g}`)),
              walked(
                [
                  [
                    ["Evaluate", "求值"],
                    t(
                      `At $n = ${n}$, $${expr} = ${n * n}${b === 0 ? "" : ` + ${b * n}`} + ${c} = ${v}$.`,
                      `$n = ${n}$ 时，$${expr} = ${n * n}${b === 0 ? "" : ` + ${b * n}`} + ${c} = ${v}$。`,
                    ),
                  ],
                  [
                    ["Factor", "分解"],
                    t(
                      `$${v} = ${d} \\cdot ${v / d}$, so it is not prime, and $n = ${n}$ makes the claim false.`,
                      `$${v} = ${d} \\cdot ${v / d}$，不是质数，所以 $n = ${n}$ 使命题为假。`,
                    ),
                  ],
                ],
                t(
                  `$${d} \\cdot ${v / d} = ${v}$, and each of the other choices gives a prime, as the claim says.`,
                  `$${d} \\cdot ${v / d} = ${v}$；其余每个选项都得到质数，正如命题所说。`,
                ),
              ),
            ),
            good.map(
              (g): Reason => [
                math(`n = ${g}`).en,
                `At $n = ${g}$ the value is $${f(g)}$, which is prime, so it agrees with the claim.`,
                `在 $n = ${g}$ 处，值为 $${f(g)}$，是质数，与命题一致。`,
              ],
            ),
          );
        }
      },
    },
    {
      id: "what-a-disproof-shows",
      title: t("What a disproof shows", "否定需要证明什么"),
      explanation: t(
        'A statement about every element is false exactly when some element fails it, so a single counterexample is a complete disproof. $\\neg \\forall x\\, P(x) \\equiv \\exists x\\, \\neg P(x)$. To disprove "for every real $x$, $x^2 \\ge x$", show there is a real $x$ with $x^2 < x$, such as $x = \\tfrac{1}{2}$.\n\n> **Watch out.** The negation of "for every $x$" is "for some $x$", not "for no $x$". A disproof needs one $x$, and that $x$ must make the statement false.',
        "关于每个元素的命题为假，当且仅当有某个元素不满足它，所以一个反例就是完整的反驳。$\\neg \\forall x\\, P(x) \\equiv \\exists x\\, \\neg P(x)$。要否定“对每个实数 $x$，$x^2 \\ge x$”，只需说明存在实数 $x$ 使 $x^2 < x$，例如 $x = \\tfrac{1}{2}$。\n\n> **注意。** “对每个 $x$”的否定是“对某个 $x$”，而不是“对任何 $x$ 都不”。否定只需要一个 $x$，而且这个 $x$ 必须使命题为假。",
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
        return reasoned(
          oneOf(
            rng,
            t(`To disprove "for every real $x$, $${p}$", what must be shown?`, `要否定“对每个实数 $x$，$${p}$”，需要证明什么？`),
            s(`There is a real $x$ with $${notP}$.`, `存在实数 $x$ 使 $${notP}$。`),
            [
              s(`For every real $x$, $${notP}$.`, `对每个实数 $x$，$${notP}$。`),
              s(`There is a real $x$ with $${p}$.`, `存在实数 $x$ 使 $${p}$。`),
              s(`For many values of $x$, $${p}$.`, `对许多 $x$ 的取值，$${p}$。`),
            ],
            walked(
              [
                [
                  ["Negate the quantifier", "否定量词"],
                  t(
                    "$\\neg \\forall x\\, P(x) \\equiv \\exists x\\, \\neg P(x)$: the claim fails if one $x$ fails it.",
                    "$\\neg \\forall x\\, P(x) \\equiv \\exists x\\, \\neg P(x)$：只要有一个 $x$ 不满足，命题就不成立。",
                  ),
                ],
                [
                  ["Negate the statement", "否定命题"],
                  t(
                    `The negation of $${p}$ is $${notP}$, so we must show there is a real $x$ with $${notP}$.`,
                    `$${p}$ 的否定是 $${notP}$，所以要证明存在实数 $x$ 使 $${notP}$。`,
                  ),
                ],
              ],
              t(
                `Negating again gives back the claim: $\\neg \\exists x\\, \\neg P(x) \\equiv \\forall x\\, P(x)$, and the negation of $${notP}$ is $${p}$.`,
                `再否定一次就回到原命题：$\\neg \\exists x\\, \\neg P(x) \\equiv \\forall x\\, P(x)$，而 $${notP}$ 的否定是 $${p}$。`,
              ),
            ),
          ),
          [
            [
              `For every real $x$, $${notP}$.`,
              "This claims the failure for every $x$, far more than needed: one $x$ that fails is enough.",
              "这声称每个 $x$ 都不满足，远多于所需：只要一个不满足的 $x$ 就够了。",
            ],
            [
              `There is a real $x$ with $${p}$.`,
              "This is an example where the statement holds, which cannot contradict it.",
              "这是一个使命题成立的例子，不可能推翻它。",
            ],
            [
              `For many values of $x$, $${p}$.`,
              "Values where the statement holds never disprove it, however many there are.",
              "使命题成立的值无论有多少，都不能否定它。",
            ],
          ],
        );
      },
    },
  ],
};

/** listOf writes the elements of a list, or "none". */
const listOf = (xs: readonly number[]): Text => (xs.length === 0 ? t("none", "没有") : t(`$${xs.join(", ")}$`, `$${xs.join(", ")}$`));

/** disprovingImplications refutes universal conditionals. */
export const disprovingImplications: TopicDef = {
  id: "disproving-implications",
  title: t("Disproving Implications", "否定蕴含式"),
  summary: t(
    "∀x (P(x) ⇒ Q(x)) is false when some x makes P(x) true and Q(x) false.",
    "当存在 x 使 P(x) 为真而 Q(x) 为假时，∀x (P(x) ⇒ Q(x)) 为假。",
  ),
  intro: t(
    "Claim: for every positive integer $x$, if $x$ is prime, then $x$ is odd. A counterexample must make the hypothesis true and the conclusion false. $x = 2$ is prime and even, so it disproves the claim. $x = 9$ does not: it is odd, but it is not prime, so the hypothesis fails and the implication is not contradicted. $x = 7$ does not either: it is prime and odd.\n\nCheck: the only positive divisors of $2$ are $1$ and $2$, so $2$ is prime, and $2 = 2 \\cdot 1$ is even.\n\nIn this lesson we find counterexamples to implications and count them over a finite domain.",
    "命题：对每个正整数 $x$，若 $x$ 是质数，则 $x$ 是奇数。反例必须使前提为真而结论为假。$x = 2$ 是质数且是偶数，所以它否定了命题。$x = 9$ 不行：它是奇数，但不是质数，前提不成立，蕴含式没有被推翻。$x = 7$ 也不行：它是质数，也是奇数。\n\n检验：$2$ 的正因数只有 $1$ 和 $2$，所以 $2$ 是质数，而 $2 = 2 \\cdot 1$ 是偶数。\n\n本课我们寻找蕴含式的反例，并在有限论域上统计反例的个数。",
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
        'A counterexample to "if $P(x)$ then $Q(x)$" must satisfy the hypothesis and fail the conclusion. For "if $x$ is prime then $x$ is odd", $x = 2$ is a counterexample; $x = 9$ is not, because $9$ is not prime.\n\n> **Watch out.** A value that fails the hypothesis is never a counterexample: an implication with a false hypothesis is true. A value that meets both parts is not one either.',
        "“若 $P(x)$ 则 $Q(x)$”的反例必须满足前提而不满足结论。对“若 $x$ 是质数，则 $x$ 是奇数”，$x = 2$ 是反例；$x = 9$ 不是，因为 $9$ 不是质数。\n\n> **注意。** 不满足前提的值永远不是反例：前提为假的蕴含式为真。两部分都满足的值也不是反例。",
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
          return reasoned(
            oneOf(
              rng,
              t(
                `Claim: "for every $x \\in ${domainTex(n)}$, if ${P.text.en}, then ${Q.text.en}." Which value is a counterexample?`,
                `命题：“对每个 $x \\in ${domainTex(n)}$，若${P.text["zh-CN"]}，则${Q.text["zh-CN"]}。”哪个值是反例？`,
              ),
              math(`x = ${x}`),
              others.map((o) => math(`x = ${rng.pick(o)}`)),
              walked(
                [
                  [
                    ["Say what a counterexample needs", "说明反例的条件"],
                    t(
                      `It must make "${P.text.en}" true and "${Q.text.en}" false.`,
                      `它必须使“${P.text["zh-CN"]}”为真，使“${Q.text["zh-CN"]}”为假。`,
                    ),
                  ],
                  [
                    ["Test the value", "检验取值"],
                    t(
                      `At $x = ${x}$, "${P.text.en}" is true and "${Q.text.en}" is false, so $x = ${x}$ is a counterexample.`,
                      `在 $x = ${x}$ 处，“${P.text["zh-CN"]}”为真，“${Q.text["zh-CN"]}”为假，所以 $x = ${x}$ 是反例。`,
                    ),
                  ],
                ],
                t(
                  "Each of the other choices either fails the hypothesis or meets the conclusion, so the implication is true there.",
                  "其余每个选项要么不满足前提，要么满足结论，所以蕴含式在那里为真。",
                ),
              ),
            ),
            xs.map(
              (y): Reason => [
                math(`x = ${y}`).en,
                P.holds(y)
                  ? `At $x = ${y}$ the conclusion also holds, so the implication is true there.`
                  : `At $x = ${y}$ the hypothesis fails, and an implication with a false hypothesis is not contradicted.`,
                P.holds(y)
                  ? `在 $x = ${y}$ 处结论也成立，所以蕴含在这里为真。`
                  : `在 $x = ${y}$ 处假设不成立，而假设为假的蕴含不会被推翻。`,
              ],
            ),
          );
        }
      },
    },
    {
      id: "counting-counterexamples",
      title: t("Counting counterexamples", "统计反例个数"),
      explanation: t(
        'Over a finite domain, the counterexamples to "if $P(x)$ then $Q(x)$" are the elements of the truth set of $P(x) \\wedge \\neg Q(x)$. Elements where $P(x)$ is false are never counterexamples.\n\n> **Watch out.** Count only the elements where the hypothesis holds and the conclusion fails. Do not count every element where the conclusion fails: some of them fail the hypothesis too.',
        "在有限论域上，“若 $P(x)$ 则 $Q(x)$”的反例就是 $P(x) \\wedge \\neg Q(x)$ 的真值集中的元素。使 $P(x)$ 为假的元素永远不是反例。\n\n> **注意。** 只数前提成立而结论不成立的元素。不要把结论不成立的元素全数进去：其中有些前提也不成立。",
      ),
      generate(rng) {
        const n = rng.int(10, 20);
        const [P, Q] = twoPredicates(rng, n);
        const xs = range(1, n);
        const ps = xs.filter((x) => P.holds(x));
        const ce = ps.filter((x) => !Q.holds(x));
        const kept = ps.filter((x) => Q.holds(x));
        return numberProblem({
          prompt: t(
            `How many counterexamples in $${domainTex(n)}$ are there to "if ${P.text.en}, then ${Q.text.en}"?`,
            `在 $${domainTex(n)}$ 中，“若${P.text["zh-CN"]}，则${Q.text["zh-CN"]}”有多少个反例？`,
          ),
          answer: ce.length,
          mistakes: distinct([
            why(
              xs.filter((x) => !Q.holds(x)).length,
              "That counts every element where the conclusion fails, including those where the hypothesis fails too.",
              "这数的是所有结论不成立的元素，其中包括前提也不成立的元素。",
            ),
            why(
              xs.filter((x) => !P.holds(x) && Q.holds(x)).length,
              "That counts where the hypothesis fails and the conclusion holds, the reverse of a counterexample.",
              "这数的是前提不成立而结论成立的元素，恰好与反例相反。",
            ),
            why(
              xs.filter((x) => !P.holds(x) || !Q.holds(x)).length,
              "That counts where either part fails; a counterexample needs the hypothesis to hold.",
              "这数的是任一部分不成立的元素；反例要求前提成立。",
            ),
          ]),
          solution: walked(
            [
              [
                ["List where the hypothesis holds", "列出前提成立的元素"],
                t(`"${P.text.en}" holds for ${listOf(ps).en}.`, `“${P.text["zh-CN"]}”对 ${listOf(ps)["zh-CN"]} 成立。`),
              ],
              [
                ["Keep the failures of the conclusion", "留下结论不成立的元素"],
                t(
                  `Of these, "${Q.text.en}" fails for ${listOf(ce).en}, so there ${ce.length === 1 ? "is" : "are"} $${ce.length}$ counterexample${ce.length === 1 ? "" : "s"}.`,
                  `其中“${Q.text["zh-CN"]}”对 ${listOf(ce)["zh-CN"]} 不成立，所以反例有 $${ce.length}$ 个。`,
                ),
              ],
            ],
            t(
              `The rest of the hypothesis set, ${listOf(kept).en}, all satisfy "${Q.text.en}", and $${ce.length} + ${kept.length} = ${ps.length}$ accounts for every element where the hypothesis holds.`,
              `前提成立的其余元素 ${listOf(kept)["zh-CN"]} 都满足“${Q.text["zh-CN"]}”，而 $${ce.length} + ${kept.length} = ${ps.length}$ 正好是前提成立的全部元素。`,
            ),
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

/** witness finds a small integer that satisfies a test, for the clauses above. */
const witness = (test: (x: number) => boolean): number =>
  range(0, 30)
    .flatMap((i) => (i === 0 ? [0] : [i, -i]))
    .find(test) ?? 0;

/** signs is the reason a never clause has no solution and an always clause has no exception. */
const signs = t("squares and absolute values are never negative", "平方和绝对值都不会是负数");

/** trivialAndVacuousProofs proves implications whose hypothesis is false or conclusion is true. */
export const trivialAndVacuousProofs: TopicDef = {
  id: "trivial-and-vacuous-proofs",
  title: t("Trivial and Vacuous Proofs", "平凡证明与空真证明"),
  summary: t(
    "If P(x) is never true, P(x) ⇒ Q(x) holds vacuously; if Q(x) is always true, it holds trivially.",
    "若 P(x) 永远不成立，则 P(x) ⇒ Q(x) 空真；若 Q(x) 总成立，则它平凡地成立。",
  ),
  intro: t(
    'Take "for every real $x$, if $x^2 < 0$, then $x = 5$". No real number has a negative square, so no $x$ makes the hypothesis true, and so no $x$ can make the implication fail: it is **vacuously** true. Now take "if $x > 2$, then $x^2 + 1 > 0$". The conclusion holds for every real $x$, so the implication can never end in a false conclusion: it is **trivially** true.\n\nCheck: an implication is false only when its hypothesis is true and its conclusion false. The first never has a true hypothesis, and the second never has a false conclusion.\n\nIn this lesson we recognize vacuous and trivial implications and decide whether such statements are true.',
    "看“对每个实数 $x$，若 $x^2 < 0$，则 $x = 5$”。没有实数的平方是负数，所以没有 $x$ 使前提为真，也就没有 $x$ 能使蕴含式不成立：它是**空真**的。再看“若 $x > 2$，则 $x^2 + 1 > 0$”。结论对每个实数 $x$ 都成立，所以蕴含式不会以假结论告终：它是**平凡**成立的。\n\n检验：蕴含式只有在前提为真、结论为假时才为假。第一个永远没有真的前提，第二个永远没有假的结论。\n\n本课我们识别空真与平凡的蕴含式，并判断这类命题是否为真。",
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
        '"If $x^2 < 0$ then $x = 5$" is **vacuously** true: no real $x$ satisfies the hypothesis. "If $x > 2$ then $x^2 + 1 > 0$" is **trivially** true: the conclusion holds for every $x$, whatever the hypothesis.\n\n> **Watch out.** Vacuous is about the hypothesis, trivial about the conclusion. A hypothesis that is only sometimes false, or a conclusion that is only sometimes true, gives neither shortcut.',
        "“若 $x^2 < 0$，则 $x = 5$”是**空真**的：没有实数满足前提。“若 $x > 2$，则 $x^2 + 1 > 0$”是**平凡**成立的：无论前提如何，结论对每个 $x$ 都成立。\n\n> **注意。** 空真看前提，平凡看结论。前提只是有时为假，或结论只是有时为真，都不能用这两种捷径。",
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
        const xp = witness(P.holds);
        const xq = witness((x) => !Q.holds(x));
        const reasons: Reason[] = [
          [
            (options[0] as Text).en,
            `At $x = ${xp}$, $${P.tex}$ is true, so the hypothesis is sometimes true.`,
            `$x = ${xp}$ 满足 $${P.tex}$，所以前提有时为真。`,
          ],
          [
            (options[1] as Text).en,
            `At $x = ${xq}$, $${Q.tex}$ is false, so the conclusion is not always true.`,
            `在 $x = ${xq}$ 处 $${Q.tex}$ 不成立，所以结论并非总成立。`,
          ],
          kind === 0
            ? [
                (options[2] as Text).en,
                `No real $x$ satisfies $${P.tex}$, since ${signs.en}; that is one of the two shortcuts.`,
                `没有实数满足 $${P.tex}$，因为${signs["zh-CN"]}；这正是两种捷径之一。`,
              ]
            : [
                (options[2] as Text).en,
                `$${Q.tex}$ holds for every real $x$, since ${signs.en}; that is one of the two shortcuts.`,
                `$${Q.tex}$ 对每个实数都成立，因为${signs["zh-CN"]}；这正是两种捷径之一。`,
              ],
        ];
        return reasoned(
          oneOf(
            rng,
            t(
              `For real $x$, how would you classify "if $${P.tex}$, then $${Q.tex}$"?`,
              `对实数 $x$，如何归类“若 $${P.tex}$，则 $${Q.tex}$”？`,
            ),
            options[kind]!,
            options.filter((_, i) => i !== kind),
            walked(
              [
                [
                  ["Test the hypothesis", "检验前提"],
                  kind === 0
                    ? t(`No real $x$ satisfies $${P.tex}$, because ${signs.en}.`, `没有实数满足 $${P.tex}$，因为${signs["zh-CN"]}。`)
                    : t(
                        `At $x = ${xp}$, $${P.tex}$ is true, so the hypothesis can be true.`,
                        `$x = ${xp}$ 满足 $${P.tex}$，所以前提可以为真。`,
                      ),
                ],
                [
                  ["Test the conclusion", "检验结论"],
                  kind === 1
                    ? t(`$${Q.tex}$ holds for every real $x$, because ${signs.en}.`, `$${Q.tex}$ 对每个实数都成立，因为${signs["zh-CN"]}。`)
                    : t(
                        `At $x = ${xq}$, $${Q.tex}$ is false, so the conclusion can be false.`,
                        `在 $x = ${xq}$ 处 $${Q.tex}$ 不成立，所以结论可以为假。`,
                      ),
                ],
                [
                  ["Classify", "归类"],
                  kind === 0
                    ? t("The hypothesis is never true, so the implication is vacuously true.", "前提永远不成立，所以蕴含式空真。")
                    : kind === 1
                      ? t("The conclusion is always true, so the implication is trivially true.", "结论总成立，所以蕴含式平凡成立。")
                      : t("Neither shortcut applies.", "两种捷径都不适用。"),
                ],
              ],
              kind === 2
                ? t(
                    "An implication is false only when its hypothesis is true and its conclusion false. Here both can happen, so its truth has to be settled by checking the $x$ that satisfy the hypothesis.",
                    "蕴含式只有在前提为真、结论为假时才为假。这里两者都可能发生，所以它的真假要逐个检验满足前提的 $x$ 才能确定。",
                  )
                : t(
                    `An implication is false only when its hypothesis is true and its conclusion false, and here ${kind === 0 ? "the hypothesis is never true" : "the conclusion is never false"}.`,
                    `蕴含式只有在前提为真、结论为假时才为假，而这里${kind === 0 ? "前提从不为真" : "结论从不为假"}。`,
                  ),
            ),
          ),
          reasons,
        );
      },
    },
    {
      id: "truth-of-vacuous-implications",
      title: t("Truth of vacuous implications", "空真蕴含式的真值"),
      explanation: t(
        'An implication with a false hypothesis is true, whatever the conclusion says. So "for every integer $n$, if $n^2 < 0$ then $n = 7$" is true, even though $n = 7$ is false for most $n$.\n\n> **Watch out.** A false hypothesis makes an implication true, not false and not meaningless. When no $x$ meets the hypothesis, it does not matter how often the conclusion fails.',
        "前提为假的蕴含式总是真的，无论结论是什么。所以“对每个整数 $n$，若 $n^2 < 0$，则 $n = 7$”为真，尽管对大多数 $n$ 来说 $n = 7$ 并不成立。\n\n> **注意。** 前提为假使蕴含式为真，既不是假，也不是没有意义。没有 $x$ 满足前提时，结论有多少次不成立都无关紧要。",
      ),
      generate(rng) {
        const vacuous = rng.bool();
        const P = clause(rng, vacuous ? "never" : "sometimes");
        const Q = clause(rng, "sometimes");
        const value = implies(P, Q);
        const xp = witness(P.holds);
        const bad = range(-120, 120)
          .map((i) => i / 4)
          .sort((u, w) => Number(!Number.isInteger(u)) - Number(!Number.isInteger(w)) || Math.abs(u) - Math.abs(w))
          .find((x) => P.holds(x) && !Q.holds(x));
        const [right, wrong] = value ? [yesNo[0]!, yesNo[1]!] : [yesNo[1]!, yesNo[0]!];
        const reason: Reason = value
          ? [
              wrong.en,
              `A "no" needs an $x$ with $${P.tex}$ true and $${Q.tex}$ false, and there is no such $x$.`,
              `要回答“不是”，需要有 $x$ 使 $${P.tex}$ 为真而 $${Q.tex}$ 为假，但没有这样的 $x$。`,
            ]
          : [
              wrong.en,
              `$x = ${bad}$ satisfies $${P.tex}$ but not $${Q.tex}$, so the statement fails there.`,
              `$x = ${bad}$ 满足 $${P.tex}$ 但不满足 $${Q.tex}$，所以命题在这里不成立。`,
            ];
        return reasoned(
          oneOf(
            rng,
            t(
              `Is the statement "for every real $x$, if $${P.tex}$, then $${Q.tex}$" true?`,
              `命题“对每个实数 $x$，若 $${P.tex}$，则 $${Q.tex}$”为真吗？`,
            ),
            right,
            [wrong],
            walked(
              [
                [
                  ["Look at the hypothesis", "看前提"],
                  vacuous
                    ? t(`No real $x$ satisfies $${P.tex}$, because ${signs.en}.`, `没有实数满足 $${P.tex}$，因为${signs["zh-CN"]}。`)
                    : t(`$${P.tex}$ holds for some $x$, such as $x = ${xp}$.`, `$${P.tex}$ 对某些 $x$ 成立，例如 $x = ${xp}$。`),
                ],
                [
                  ["Look for a failure", "找反例"],
                  vacuous
                    ? t(
                        "So no $x$ has a true hypothesis and a false conclusion: the statement is true, vacuously.",
                        "所以没有 $x$ 使前提为真而结论为假：命题为真，而且是空真。",
                      )
                    : value
                      ? t(
                          `Every $x$ with $${P.tex}$ also satisfies $${Q.tex}$, so the statement is true.`,
                          `每个满足 $${P.tex}$ 的 $x$ 也满足 $${Q.tex}$，所以命题为真。`,
                        )
                      : t(
                          `At $x = ${bad}$, $${P.tex}$ is true and $${Q.tex}$ is false, so the statement is false.`,
                          `在 $x = ${bad}$ 处，$${P.tex}$ 为真而 $${Q.tex}$ 为假，所以命题为假。`,
                        ),
                ],
              ],
              vacuous
                ? t(
                    "An implication fails only with a true hypothesis, and that never happens here, so nothing can make it fail.",
                    "蕴含式只有在前提为真时才可能不成立，而这里前提从不为真，所以没有什么能使它不成立。",
                  )
                : value
                  ? t(`At $x = ${xp}$ the hypothesis holds, and so does $${Q.tex}$.`, `在 $x = ${xp}$ 处前提成立，$${Q.tex}$ 也成立。`)
                  : t(
                      `Substitute $x = ${bad}$ into both parts: the first is true and the second false, as a counterexample needs.`,
                      `把 $x = ${bad}$ 代入两部分：前者为真，后者为假，正是反例所需。`,
                    ),
            ),
          ),
          [reason],
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
  intro: t(
    "Claim: for integers $n$, $n$ is even if and only if $n + 1$ is odd. That is two implications. If $n$ is even, then $n = 2k$ and $n + 1 = 2k + 1$ is odd. If $n + 1$ is odd, then $n + 1 = 2k + 1$, so $n = 2k$ is even. Both directions hold, so the biconditional holds.\n\nCheck: $n = 6$ is even and $7$ is odd; going the other way, $n + 1 = 9$ is odd and comes from $n = 8$, which is even.\n\nIn this lesson we prove a biconditional as two implications, and test each direction for a counterexample.",
    "命题：对整数 $n$，$n$ 是偶数当且仅当 $n + 1$ 是奇数。这是两个蕴含式。若 $n$ 是偶数，则 $n = 2k$，$n + 1 = 2k + 1$ 是奇数。若 $n + 1$ 是奇数，则 $n + 1 = 2k + 1$，所以 $n = 2k$ 是偶数。两个方向都成立，所以双条件命题成立。\n\n检验：$n = 6$ 是偶数，$7$ 是奇数；反过来，$n + 1 = 9$ 是奇数，它来自 $n = 8$，是偶数。\n\n本课我们把双条件命题当作两个蕴含式来证明，并检验每个方向是否有反例。",
  ),
  prerequisites: ["direct-proof"],
  encompasses: [{ topic: "biconditional-statements", weight: 0.2 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-two-directions",
      title: t("The two directions", "两个方向"),
      explanation: t(
        "$P \\Leftrightarrow Q$ is equivalent to $(P \\Rightarrow Q) \\wedge (Q \\Rightarrow P)$, so a proof has two parts. Proving $P \\Rightarrow Q$ and its contrapositive $\\neg Q \\Rightarrow \\neg P$ proves only one direction twice.\n\n> **Watch out.** A contrapositive is the same direction in disguise. The second part must be the converse $Q \\Rightarrow P$, or its own contrapositive $\\neg P \\Rightarrow \\neg Q$.",
        "$P \\Leftrightarrow Q$ 等价于 $(P \\Rightarrow Q) \\wedge (Q \\Rightarrow P)$，所以证明分两部分。证明 $P \\Rightarrow Q$ 及其逆否命题 $\\neg Q \\Rightarrow \\neg P$ 只是把同一个方向证了两遍。\n\n> **注意。** 逆否命题只是同一个方向换了说法。第二部分必须是逆命题 $Q \\Rightarrow P$，或者它的逆否命题 $\\neg P \\Rightarrow \\neg Q$。",
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
        const twice = both(s(L, R), s(nR, nL));
        const back = both(s(R, L), s(nL, nR));
        const only = t(`${s(L, R).en} only.`, `只需${s(L, R)["zh-CN"]}。`);
        return reasoned(
          oneOf(
            rng,
            t(`What must be proved to show $${L} \\Leftrightarrow ${R}$?`, `要证明 $${L} \\Leftrightarrow ${R}$，需要证明什么？`),
            both(s(L, R), s(R, L)),
            [twice, back, only],
            walked(
              [
                [
                  ["Split the biconditional", "拆开双条件"],
                  t(
                    `$${L} \\Leftrightarrow ${R}$ means $(${L} \\Rightarrow ${R}) \\wedge (${R} \\Rightarrow ${L})$.`,
                    `$${L} \\Leftrightarrow ${R}$ 表示 $(${L} \\Rightarrow ${R}) \\wedge (${R} \\Rightarrow ${L})$。`,
                  ),
                ],
                [
                  ["Name the two parts", "写出两部分"],
                  t(`Prove "if $${L}$ then $${R}$" and "if $${R}$ then $${L}$".`, `证明“若 $${L}$ 则 $${R}$”以及“若 $${R}$ 则 $${L}$”。`),
                ],
              ],
              t(
                `Both parts hold here: $x = ${x0}$ gives $${a} \\cdot ${x0 < 0 ? `(${x0})` : x0}${signed(b)} = ${c}$, and solving $${P}$ gives only $x = ${x0}$.`,
                `这里两部分都成立：$x = ${x0}$ 时 $${a} \\cdot ${x0 < 0 ? `(${x0})` : x0}${signed(b)} = ${c}$，而解 $${P}$ 只得 $x = ${x0}$。`,
              ),
            ),
          ),
          [
            [
              twice.en,
              `The second part is the contrapositive of the first, so it proves $${L} \\Rightarrow ${R}$ again; $${R} \\Rightarrow ${L}$ is missing.`,
              `第二部分是第一部分的逆否命题，所以又证了一遍 $${L} \\Rightarrow ${R}$；缺少 $${R} \\Rightarrow ${L}$。`,
            ],
            [
              back.en,
              `The second part is the contrapositive of the first, so only $${R} \\Rightarrow ${L}$ is proved; $${L} \\Rightarrow ${R}$ is missing.`,
              `第二部分是第一部分的逆否命题，所以只证了 $${R} \\Rightarrow ${L}$；缺少 $${L} \\Rightarrow ${R}$。`,
            ],
            [only.en, "That is one direction; a biconditional also needs its converse.", "这只是一个方向；双条件命题还需要它的逆命题。"],
          ],
        );
      },
    },
    {
      id: "checking-both-directions",
      title: t("Checking both directions", "检验两个方向"),
      explanation: t(
        'A biconditional fails if either direction fails. "$x^2 = 9 \\Leftrightarrow x = 3$" is false: $x = 3 \\Rightarrow x^2 = 9$ holds, but $x = -3$ breaks the other direction. "$x^3 = 8 \\Leftrightarrow x = 2$" is true.\n\n> **Watch out.** One direction holding is not enough. Test the harder direction for a counterexample, such as a negative number under an even power.',
        "只要有一个方向不成立，双条件命题就不成立。“$x^2 = 9 \\Leftrightarrow x = 3$”为假：$x = 3 \\Rightarrow x^2 = 9$ 成立，但 $x = -3$ 使另一个方向不成立。“$x^3 = 8 \\Leftrightarrow x = 2$”为真。\n\n> **注意。** 只有一个方向成立是不够的。要在较难的那个方向上找反例，例如偶次幂下的负数。",
      ),
      generate(rng) {
        const kind = rng.int(0, 3);
        let claim: string;
        let value: boolean;
        let lr: Text;
        let rl: Text;
        let check: Text;
        let against: Text;
        if (kind === 0) {
          const k = rng.int(2, 12);
          const m = rng.int(2, 12);
          const g = gcd(k, m);
          claim = `${k} \\mid n \\Leftrightarrow ${k} \\mid ${m}n`;
          value = g === 1;
          lr = t(
            `If $n = ${k}j$, then $${m}n = ${k}(${m}j)$, so $${k} \\mid ${m}n$.`,
            `若 $n = ${k}j$，则 $${m}n = ${k}(${m}j)$，所以 $${k} \\mid ${m}n$。`,
          );
          rl = value
            ? t(
                `If $${k} \\mid ${m}n$: $${k}$ and $${m}$ share no factor, so every factor of $${k}$ must come from $n$, and $${k} \\mid n$.`,
                `若 $${k} \\mid ${m}n$：$${k}$ 与 $${m}$ 没有公因数，所以 $${k}$ 的每个因数都来自 $n$，即 $${k} \\mid n$。`,
              )
            : t(
                `This fails: $n = ${k / g}$ gives $${m}n = ${(m * k) / g} = ${k} \\cdot ${m / g}$, but $${k} \\nmid ${k / g}$.`,
                `这个方向不成立：$n = ${k / g}$ 时 $${m}n = ${(m * k) / g} = ${k} \\cdot ${m / g}$，但 $${k} \\nmid ${k / g}$。`,
              );
          check = value
            ? t(
                `$n = 1$ makes both sides false, since $${k} \\nmid 1$ and $${k} \\nmid ${m}$; $n = ${k}$ makes both true.`,
                `$n = 1$ 使两边都为假，因为 $${k} \\nmid 1$ 且 $${k} \\nmid ${m}$；$n = ${k}$ 使两边都为真。`,
              )
            : t(
                `$${k} \\cdot ${m / g} = ${(m * k) / g}$, and $0 < ${k / g} < ${k}$, so $${k / g}$ is not a multiple of $${k}$.`,
                `$${k} \\cdot ${m / g} = ${(m * k) / g}$，而 $0 < ${k / g} < ${k}$，所以 $${k / g}$ 不是 $${k}$ 的倍数。`,
              );
          against = value
            ? t(
                `$${k}$ and $${m}$ share no factor, so $${k} \\mid ${m}n$ does force $${k} \\mid n$; neither direction fails.`,
                `$${k}$ 与 $${m}$ 没有公因数，所以 $${k} \\mid ${m}n$ 确实推出 $${k} \\mid n$；两个方向都不会不成立。`,
              )
            : t(
                `$n = ${k / g}$ satisfies $${k} \\mid ${m}n$ but not $${k} \\mid n$, so one direction fails.`,
                `$n = ${k / g}$ 满足 $${k} \\mid ${m}n$，但不满足 $${k} \\mid n$，所以有一个方向不成立。`,
              );
        } else if (kind === 1) {
          const a = rng.int(1, 12);
          const e = rng.pick([2, 3, 4, 5]);
          claim = `x^{${e}} = ${a ** e} \\Leftrightarrow x = ${a}`;
          value = e % 2 === 1;
          lr = value
            ? t(
                `$x^{${e}}$ is increasing because $${e}$ is odd, so only $x = ${a}$ gives $${a ** e}$.`,
                `因为 $${e}$ 是奇数，$x^{${e}}$ 单调递增，所以只有 $x = ${a}$ 得到 $${a ** e}$。`,
              )
            : t(`This fails: $x = -${a}$ also gives $x^{${e}} = ${a ** e}$.`, `这个方向不成立：$x = -${a}$ 也使 $x^{${e}} = ${a ** e}$。`);
          rl = t(`If $x = ${a}$, then $x^{${e}} = ${a ** e}$.`, `若 $x = ${a}$，则 $x^{${e}} = ${a ** e}$。`);
          check = value
            ? t(
                `$(-${a})^{${e}} = -${a ** e}$, not $${a ** e}$, so the negative value does not slip in.`,
                `$(-${a})^{${e}} = -${a ** e}$，不等于 $${a ** e}$，所以负值混不进来。`,
              )
            : t(
                `$(-${a})^{${e}} = ${a ** e}$, because an even power removes the sign.`,
                `$(-${a})^{${e}} = ${a ** e}$，因为偶次幂会消去符号。`,
              );
          against = value
            ? t(
                `For odd $${e}$, $x^{${e}}$ is increasing, so $x = ${a}$ is the only solution; neither direction fails.`,
                `$${e}$ 为奇数时 $x^{${e}}$ 单调递增，所以 $x = ${a}$ 是唯一解；两个方向都不会不成立。`,
              )
            : t(
                `$x = -${a}$ satisfies $x^{${e}} = ${a ** e}$ but not $x = ${a}$, so one direction fails.`,
                `$x = -${a}$ 满足 $x^{${e}} = ${a ** e}$，但不满足 $x = ${a}$，所以有一个方向不成立。`,
              );
        } else if (kind === 2) {
          const a = rng.int(1, 9);
          claim = `x^2 > ${a * a} \\Leftrightarrow x > ${a}`;
          value = false;
          lr = t(
            `This fails: $x = -${a + 1}$ gives $x^2 = ${(a + 1) ** 2} > ${a * a}$, but $-${a + 1}$ is not greater than $${a}$.`,
            `这个方向不成立：$x = -${a + 1}$ 时 $x^2 = ${(a + 1) ** 2} > ${a * a}$，但 $-${a + 1}$ 不大于 $${a}$。`,
          );
          rl = t(`If $x > ${a}$, then $x$ is positive and $x^2 > ${a * a}$.`, `若 $x > ${a}$，则 $x$ 为正，且 $x^2 > ${a * a}$。`);
          check = t(
            `$(-${a + 1})^2 = ${(a + 1) ** 2}$, which is more than $${a * a}$.`,
            `$(-${a + 1})^2 = ${(a + 1) ** 2}$，大于 $${a * a}$。`,
          );
          against = t(
            `$x = -${a + 1}$ satisfies $x^2 > ${a * a}$ but not $x > ${a}$, so one direction fails.`,
            `$x = -${a + 1}$ 满足 $x^2 > ${a * a}$，但不满足 $x > ${a}$，所以有一个方向不成立。`,
          );
        } else {
          const a = rng.int(2, 9);
          const b = rng.int(-9, 9);
          const c = rng.int(-20, 20);
          const neg = rng.bool();
          const k = neg ? -a : a;
          claim = `${neg ? "-" : ""}${a}x${signed(b)} > ${c} \\Leftrightarrow x ${neg ? "<" : ">"} ${neg ? `${b - c}/${a}` : `${c - b}/${a}`}`;
          value = true;
          const xt = neg ? Math.floor((b - c) / a) - 1 : Math.floor((c - b) / a) + 1;
          lr = t(
            `Subtracting $${b}$ and dividing by $${k}$${neg ? ", which reverses the inequality," : ""} gives the right side.`,
            `减去 $${b}$ 再除以 $${k}$${neg ? "（不等号反向）" : ""}，得到右边。`,
          );
          rl = t(
            `Each step can be undone: multiplying by $${k}$${neg ? ", which reverses the inequality again," : ""} and adding $${b}$ gives back the left side.`,
            `每一步都可以逆回去：乘以 $${k}$${neg ? "（不等号再次反向）" : ""}再加 $${b}$，就回到左边。`,
          );
          check = t(
            `$x = ${xt}$ satisfies the right side and gives $${k * xt + b}$ on the left, which is greater than $${c}$.`,
            `$x = ${xt}$ 满足右边，代入左边得 $${k * xt + b}$，大于 $${c}$。`,
          );
          against = t(
            "Every step of solving the inequality can be undone, so neither direction fails.",
            "解不等式的每一步都可以逆回去，所以两个方向都不会不成立。",
          );
        }
        const [right, wrong] = value ? [yesNo[0]!, yesNo[1]!] : [yesNo[1]!, yesNo[0]!];
        return reasoned(
          oneOf(
            rng,
            kind === 0
              ? t(`For integers $n$, is $${claim}$ true?`, `对整数 $n$，$${claim}$ 成立吗？`)
              : t(`For real $x$, is $${claim}$ true?`, `对实数 $x$，$${claim}$ 成立吗？`),
            right,
            [wrong],
            walked(
              [
                [["From left to right", "从左到右"], lr],
                [["From right to left", "从右到左"], rl],
                [
                  ["Combine", "合起来"],
                  value
                    ? t("Both directions hold, so the biconditional is true.", "两个方向都成立，所以双条件命题为真。")
                    : t("One direction fails, so the biconditional is false.", "有一个方向不成立，所以双条件命题为假。"),
                ],
              ],
              check,
            ),
          ),
          [[wrong.en, against.en, against["zh-CN"]]],
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
  intro: t(
    "Claim: for integers $n$, if $n^2$ is even, then $n$ is even. Starting from $n^2$ is awkward, so prove the contrapositive instead: if $n$ is odd, then $n^2$ is odd. With $n = 2k + 1$, $n^2 = 4k^2 + 4k + 1 = 2(2k^2 + 2k) + 1$, which is odd. The contrapositive is equivalent to the claim, so the claim is proved.\n\nCheck: $n = 7$ is odd and $n^2 = 49$ is odd; $n^2 = 36$ is even and $n = 6$ is even.\n\nIn this lesson we set up proofs by contrapositive and use them to find the best threshold in a claim.",
    "命题：对整数 $n$，若 $n^2$ 是偶数，则 $n$ 是偶数。从 $n^2$ 出发不好下手，所以改证逆否命题：若 $n$ 是奇数，则 $n^2$ 是奇数。设 $n = 2k + 1$，则 $n^2 = 4k^2 + 4k + 1 = 2(2k^2 + 2k) + 1$，是奇数。逆否命题与原命题等价，所以原命题得证。\n\n检验：$n = 7$ 是奇数，$n^2 = 49$ 是奇数；$n^2 = 36$ 是偶数，$n = 6$ 是偶数。\n\n本课我们构建逆否证明，并用它找出命题中最好的阈值。",
  ),
  prerequisites: ["direct-proof"],
  encompasses: [{ topic: "converse-inverse-and-contrapositive", weight: 0.2 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "setting-up-a-contrapositive-proof",
      title: t("Setting up the proof", "构建证明框架"),
      explanation: t(
        'To prove "if $P$ then $Q$" by contrapositive, assume $\\neg Q$ and prove $\\neg P$. For "if $x^2$ is even then $x$ is even", assume $x$ is odd and show $x^2$ is odd.\n\n> **Watch out.** Negate both parts and swap them. Assuming $\\neg P$ and showing $\\neg Q$ proves the inverse, which is not equivalent to the claim.',
        "用逆否证明“若 $P$ 则 $Q$”：假设 $\\neg Q$，证明 $\\neg P$。对“若 $x^2$ 是偶数，则 $x$ 是偶数”，假设 $x$ 是奇数，证明 $x^2$ 是奇数。\n\n> **注意。** 两部分都要否定，并且交换位置。假设 $\\neg P$ 去证 $\\neg Q$ 证的是否命题，它与原命题不等价。",
      ),
      generate(rng) {
        const n = rng.int(10, 30);
        // The claim to be proved must be true, and not vacuously.
        const domain = range(1, n);
        let [P, Q] = twoPredicates(rng, n);
        while (!domain.some(P.holds) || domain.some((x) => P.holds(x) && !Q.holds(x))) [P, Q] = twoPredicates(rng, n);
        const plan = (a: Text, b: Text) => t(`Assume ${a.en}; show ${b.en}.`, `假设${a["zh-CN"]}；证明${b["zh-CN"]}。`);
        const inverse = plan(P.negation, Q.negation);
        const converse = plan(Q.text, P.text);
        const direct = plan(P.text, Q.text);
        return reasoned(
          oneOf(
            rng,
            t(
              `To prove "for $x \\in ${domainTex(n)}$, if ${P.text.en}, then ${Q.text.en}" by contrapositive, what is the plan?`,
              `用逆否证明“对 $x \\in ${domainTex(n)}$，若${P.text["zh-CN"]}，则${Q.text["zh-CN"]}”，证明思路是什么？`,
            ),
            plan(Q.negation, P.negation),
            [inverse, converse, direct],
            walked(
              [
                [
                  ["Write the contrapositive", "写出逆否命题"],
                  t(
                    `The contrapositive of "if ${P.text.en}, then ${Q.text.en}" is "if ${Q.negation.en}, then ${P.negation.en}".`,
                    `“若${P.text["zh-CN"]}，则${Q.text["zh-CN"]}”的逆否命题是“若${Q.negation["zh-CN"]}，则${P.negation["zh-CN"]}”。`,
                  ),
                ],
                [
                  ["Plan the proof", "确定思路"],
                  t(
                    `So assume ${Q.negation.en} and show ${P.negation.en}.`,
                    `所以假设${Q.negation["zh-CN"]}，证明${P.negation["zh-CN"]}。`,
                  ),
                ],
              ],
              t(
                `Negating and swapping again returns "if ${P.text.en}, then ${Q.text.en}", so the plan proves the original claim.`,
                `再否定并交换一次就回到“若${P.text["zh-CN"]}，则${Q.text["zh-CN"]}”，所以这个思路证明的正是原命题。`,
              ),
            ),
          ),
          [
            [inverse.en, "This proves the inverse, which is not equivalent to the claim.", "这证明的是否命题，它与原命题不等价。"],
            [converse.en, "This proves the converse, which is not equivalent to the claim.", "这证明的是逆命题，它与原命题不等价。"],
            [direct.en, "This is a direct proof, not a proof by contrapositive.", "这是直接证明，不是逆否证明。"],
          ],
        );
      },
    },
    {
      id: "thresholds-by-contrapositive",
      title: t("Thresholds by contrapositive", "用逆否求阈值"),
      explanation: t(
        '"If $a + b \\ge 9$ then $a \\ge 5$ or $b \\ge 5$" for integers is proved by contrapositive: if $a \\le 4$ and $b \\le 4$, then $a + b \\le 8 < 9$. The threshold $9$ is the smallest that works, since $a = b = 4$ gives $8$.\n\n> **Watch out.** The best threshold is one more than the largest value reached when every conclusion fails. That extreme case is also what shows that no smaller threshold works.',
        "对整数，“若 $a + b \\ge 9$，则 $a \\ge 5$ 或 $b \\ge 5$”可用逆否证明：若 $a \\le 4$ 且 $b \\le 4$，则 $a + b \\le 8 < 9$。阈值 $9$ 是可行的最小值，因为 $a = b = 4$ 时和为 $8$。\n\n> **注意。** 最好的阈值比所有结论都不成立时能达到的最大值大 $1$。这个极端情形也正说明更小的阈值不行。",
      ),
      generate(rng) {
        const s = rng.int(2, 20);
        const r = rng.int(2, 20);
        const product = rng.bool() && s <= 12 && r <= 12;
        const top = product ? (s - 1) * (r - 1) : s + r - 2;
        const answer = top + 1;
        const op = product ? "ab" : "a + b";
        const larger = t(
          `That threshold works, but a smaller one does too; find the largest value of $${op}$ when $a \\le ${s - 1}$ and $b \\le ${r - 1}$.`,
          `这个阈值可行，但更小的也可行；求 $a \\le ${s - 1}$ 且 $b \\le ${r - 1}$ 时 $${op}$ 的最大值。`,
        );
        const reached = t(
          `$a = ${s - 1}$ and $b = ${r - 1}$ make $${op} = ${top}$, which reaches this threshold, yet $a < ${s}$ and $b < ${r}$.`,
          `$a = ${s - 1}$，$b = ${r - 1}$ 时 $${op} = ${top}$，达到了这个阈值，但 $a < ${s}$ 且 $b < ${r}$。`,
        );
        return numberProblem({
          prompt: t(
            `Find the smallest integer $S$ such that, for all ${product ? "positive " : ""}integers $a$ and $b$, if $${op} \\ge S$ then $a \\ge ${s}$ or $b \\ge ${r}$.`,
            `求最小的整数 $S$，使得对所有${product ? "正" : ""}整数 $a$、$b$，若 $${op} \\ge S$，则 $a \\ge ${s}$ 或 $b \\ge ${r}$。`,
          ),
          answer,
          mistakes: distinct(
            product
              ? [why(s * r, larger.en, larger["zh-CN"]), why(top, reached.en, reached["zh-CN"]), why(s * r - 1, larger.en, larger["zh-CN"])]
              : [
                  why(s + r, larger.en, larger["zh-CN"]),
                  why(top, reached.en, reached["zh-CN"]),
                  why(Math.max(s, r), reached.en, reached["zh-CN"]),
                ],
          ),
          solution: walked(
            [
              [
                ["Take the contrapositive", "取逆否命题"],
                t(
                  `If $a \\le ${s - 1}$ and $b \\le ${r - 1}$${product ? " for positive $a$ and $b$" : ""}, then $${op} \\le ${top}$.`,
                  `若${product ? "正整数 " : " "}$a \\le ${s - 1}$ 且 $b \\le ${r - 1}$，则 $${op} \\le ${top}$。`,
                ),
              ],
              [
                ["Read off S", "读出 S"],
                t(
                  `So whenever $${op} \\ge ${answer}$, one of the conclusions must hold, and $S = ${answer}$ works.`,
                  `所以只要 $${op} \\ge ${answer}$，就必有一个结论成立，$S = ${answer}$ 可行。`,
                ),
              ],
            ],
            t(
              `$a = ${s - 1}$ and $b = ${r - 1}$ give $${op} = ${top}$ with neither conclusion true, so $S = ${top}$ fails and $${answer}$ is the smallest.`,
              `$a = ${s - 1}$，$b = ${r - 1}$ 时 $${op} = ${top}$，两个结论都不成立，所以 $S = ${top}$ 不行，$${answer}$ 是最小的。`,
            ),
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
  intro: t(
    "Claim: for integers $n$, if $n^2 + 3$ is even, then $n$ is odd. The hypothesis is about $n^2 + 3$, which is hard to start from. The contrapositive is: if $n$ is even, then $n^2 + 3$ is odd. With $n = 2k$, $n^2 + 3 = 4k^2 + 3 = 2(2k^2 + 1) + 1$, which is odd. The contrapositive is proved, so the claim holds.\n\nCheck: $n = 4$ is even and $n^2 + 3 = 19$ is odd; $n = 5$ gives $28$, which is even, and $5$ is odd, as the claim says.\n\nIn this lesson we write the contrapositive of a parity claim and carry out the computation it calls for.",
    "命题：对整数 $n$，若 $n^2 + 3$ 是偶数，则 $n$ 是奇数。前提是关于 $n^2 + 3$ 的，不好下手。逆否命题是：若 $n$ 是偶数，则 $n^2 + 3$ 是奇数。设 $n = 2k$，则 $n^2 + 3 = 4k^2 + 3 = 2(2k^2 + 1) + 1$，是奇数。逆否命题得证，所以原命题成立。\n\n检验：$n = 4$ 是偶数，$n^2 + 3 = 19$ 是奇数；$n = 5$ 时得 $28$，是偶数，而 $5$ 是奇数，与命题一致。\n\n本课我们写出奇偶性命题的逆否命题，并完成它所需的计算。",
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
        'A hypothesis about an expression in $n$ is hard to use directly, but a hypothesis about $n$ is easy. The contrapositive of "if $3n + 5$ is even then $n$ is odd" is "if $n$ is even then $3n + 5$ is odd", proved by $3(2k) + 5 = 2(3k + 2) + 1$.\n\n> **Watch out.** Negate both parts and swap them. Negating without swapping gives the inverse, and swapping without negating gives the converse; neither is equivalent to the claim.',
        "关于 $n$ 的表达式的前提不好直接用，而关于 $n$ 本身的前提很好用。“若 $3n + 5$ 是偶数，则 $n$ 是奇数”的逆否命题是“若 $n$ 是偶数，则 $3n + 5$ 是奇数”，由 $3(2k) + 5 = 2(3k + 2) + 1$ 得证。\n\n> **注意。** 两部分都要否定，并且交换位置。只否定不交换得到否命题，只交换不否定得到逆命题；两者都与原命题不等价。",
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
        const converse = imp(n, N, X, E);
        const half = imp(n, nN, X, E);
        const inverse = imp(X, nE, n, nN);
        const n0 = 3 - nParity;
        const value = a * n0 ** k + c;
        return reasoned(
          oneOf(
            rng,
            t(
              `Claim: "if $${expr}$ is ${E.en}, then $n$ is ${N.en}." Which statement does a proof by contrapositive prove?`,
              `命题：“若 $${expr}$ 是${E["zh-CN"]}，则 $n$ 是${N["zh-CN"]}。”逆否证明要证明的是哪个命题？`,
            ),
            imp(n, nN, X, nE),
            [converse, half, inverse],
            walked(
              [
                [
                  ["Negate both parts", "否定两部分"],
                  t(
                    `"$${expr}$ is ${E.en}" becomes "$${expr}$ is ${nE.en}", and "$n$ is ${N.en}" becomes "$n$ is ${nN.en}".`,
                    `“$${expr}$ 是${E["zh-CN"]}”变为“$${expr}$ 是${nE["zh-CN"]}”，“$n$ 是${N["zh-CN"]}”变为“$n$ 是${nN["zh-CN"]}”。`,
                  ),
                ],
                [
                  ["Swap them", "交换位置"],
                  t(`If $n$ is ${nN.en}, then $${expr}$ is ${nE.en}.`, `若 $n$ 是${nN["zh-CN"]}，则 $${expr}$ 是${nE["zh-CN"]}。`),
                ],
              ],
              t(
                `Take $n = ${n0}$, which is ${nN.en}: then $${expr}$ equals $${value}$, which is ${nE.en}, as the contrapositive says.`,
                `取 $n = ${n0}$，它是${nN["zh-CN"]}：此时 $${expr}$ 等于 $${value}$，是${nE["zh-CN"]}，与逆否命题一致。`,
              ),
            ),
          ),
          [
            [converse.en, "This is the converse: the parts are swapped but not negated.", "这是逆命题：两部分交换了，但没有否定。"],
            [
              half.en,
              `Both parts must be negated, but the part about $${expr}$ kept its parity.`,
              `两部分都要否定，但关于 $${expr}$ 的部分保留了原来的奇偶性。`,
            ],
            [inverse.en, "This is the inverse: the parts are negated but not swapped.", "这是否命题：两部分否定了，但没有交换。"],
          ],
        );
      },
    },
    {
      id: "completing-a-parity-contrapositive",
      title: t("Completing the proof", "完成证明"),
      explanation: t(
        'After assuming the negated conclusion, substitute and simplify. To show "if $n^2 + 4$ is odd then $n$ is odd": assume $n = 2k$; then $n^2 + 4 = 4k^2 + 4 = 2(2k^2 + 2)$ is even.\n\n> **Watch out.** Square all of $n$: $(2k)^2 = 4k^2$ and $(2k + 1)^2 = 4k^2 + 4k + 1$. Then add up the constants and halve the total before it goes in the bracket.',
        "假设结论的否定后，代入并化简。证明“若 $n^2 + 4$ 是奇数，则 $n$ 是奇数”：假设 $n = 2k$，则 $n^2 + 4 = 4k^2 + 4 = 2(2k^2 + 2)$ 是偶数。\n\n> **注意。** 要把整个 $n$ 平方：$(2k)^2 = 4k^2$，$(2k + 1)^2 = 4k^2 + 4k + 1$。然后把常数加起来，折半后再放进括号。",
      ),
      generate(rng) {
        const a = rng.int(1, 6);
        const c = rng.int(1, 12);
        const even = rng.bool();
        const expr = `${term(a, "n^2")} + ${c}`;
        const total = even ? c : a + c;
        const q = Math.floor(total / 2);
        const r = total % 2;
        const inner = (x: number, y: number, z: number) => `${term(x, "k^2")}${plus(y, "k")}${signed(z)}`;
        const form = (x: number, y: number, z: number, w: number) => `2(${inner(x, y, z)})${w === 0 ? "" : " + 1"}`;
        const right = even ? form(2 * a, 0, q, r) : form(2 * a, 2 * a, q, r);
        const square: [string, string] = even
          ? ["$(2k)^2 = 4k^2$, not $2k^2$.", "$(2k)^2 = 4k^2$，不是 $2k^2$。"]
          : [
              "$(2k + 1)^2 = 4k^2 + 4k + 1$, so its leading term is $4k^2$, not $2k^2$.",
              "$(2k + 1)^2 = 4k^2 + 4k + 1$，首项是 $4k^2$，不是 $2k^2$。",
            ];
        const unhalved: [string, string] = [
          `The constants add up to $${total}$, which was not halved before going into the bracket.`,
          `常数之和是 $${total}$，放进括号前没有折半。`,
        ];
        const remainder: [string, string] = [
          `The constants add up to $${total}$, which is ${parityName(r).en}, so the form ${r === 1 ? "ends in $+ 1$" : "has no $+ 1$"}.`,
          `常数之和是 $${total}$，是${parityName(r)["zh-CN"]}，所以这个形式${r === 1 ? "末尾有 $+ 1$" : "没有 $+ 1$"}。`,
        ];
        const pairs: [string, [string, string]][] = even
          ? [
              [form(a, 0, q, r), square],
              [form(2 * a, 0, total, 0), unhalved],
              [form(2 * a, 0, q, 1 - r), remainder],
            ]
          : [
              [
                form(2 * a, a, q, r),
                [
                  "The $k$ terms are short: $(2k + 1)^2$ contributes $4k$, not $2k$.",
                  "$k$ 的项少了：$(2k + 1)^2$ 贡献的是 $4k$，不是 $2k$。",
                ],
              ],
              [form(2 * a, 2 * a, total, 0), unhalved],
              [form(2 * a, 2 * a, q, 1 - r), remainder],
              [form(a, a, q, r), square],
            ];
        const n = even ? 2 : 3;
        const value = a * n * n + c;
        return reasoned(
          oneOf(
            rng,
            t(
              `In a contrapositive proof, assume $n = ${even ? "2k" : "2k + 1"}$. Which is $${expr}$?`,
              `在逆否证明中，假设 $n = ${even ? "2k" : "2k + 1"}$。$${expr}$ 等于哪一个？`,
            ),
            math(right),
            pairs.map(([w]) => math(w)),
            walked(
              [
                [
                  ["Substitute", "代入"],
                  t(
                    `$${expr} = ${a === 1 ? "" : a}(${even ? "2k" : "2k + 1"})^2 + ${c}$.`,
                    `$${expr} = ${a === 1 ? "" : a}(${even ? "2k" : "2k + 1"})^2 + ${c}$。`,
                  ),
                ],
                [
                  ["Expand", "展开"],
                  t(
                    `This is $${term(4 * a, "k^2")}${even ? "" : plus(4 * a, "k")} + ${total}$.`,
                    `它等于 $${term(4 * a, "k^2")}${even ? "" : plus(4 * a, "k")} + ${total}$。`,
                  ),
                ],
                [
                  ["Factor out 2", "提出 2"],
                  t(
                    `$${total} = 2 \\cdot ${q}${r === 1 ? " + 1" : ""}$, so $${expr} = ${right}$, which is ${parityName(r).en}.`,
                    `$${total} = 2 \\cdot ${q}${r === 1 ? " + 1" : ""}$，所以 $${expr} = ${right}$，是${parityName(r)["zh-CN"]}。`,
                  ),
                ],
              ],
              t(
                `At $k = 1$, $n = ${n}$ and $${expr} = ${value}$; the form gives $2 \\cdot ${(value - r) / 2}${r === 1 ? " + 1" : ""} = ${value}$ too.`,
                `$k = 1$ 时，$n = ${n}$，$${expr} = ${value}$；这个形式也得 $2 \\cdot ${(value - r) / 2}${r === 1 ? " + 1" : ""} = ${value}$。`,
              ),
            ),
          ),
          pairs.map(([w, [en, zh]]): Reason => [`$${w}$`, en, zh]),
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
  intro: t(
    "Claim: for integers $n$, if $3 \\nmid n^2 + 6n$, then $3 \\nmid n$. The hypothesis says what is not true, which gives nothing to compute with. The contrapositive is: if $3 \\mid n$, then $3 \\mid n^2 + 6n$. With $n = 3j$, $n^2 + 6n = 9j^2 + 18j = 3(3j^2 + 6j)$, a multiple of $3$. The contrapositive is proved, so the claim holds.\n\nCheck: $n = 6$ gives $36 + 36 = 72 = 3 \\cdot 24$, and indeed $3j^2 + 6j = 12 + 12 = 24$ for $j = 2$.\n\nIn this lesson we turn claims about non-divisibility into their contrapositives and finish them by substitution.",
    "命题：对整数 $n$，若 $3 \\nmid n^2 + 6n$，则 $3 \\nmid n$。前提说的是什么不成立，没有可以计算的东西。逆否命题是：若 $3 \\mid n$，则 $3 \\mid n^2 + 6n$。设 $n = 3j$，则 $n^2 + 6n = 9j^2 + 18j = 3(3j^2 + 6j)$，是 $3$ 的倍数。逆否命题得证，所以原命题成立。\n\n检验：$n = 6$ 时 $36 + 36 = 72 = 3 \\cdot 24$，而 $j = 2$ 时确实 $3j^2 + 6j = 12 + 12 = 24$。\n\n本课我们把关于不整除的命题化为逆否命题，再通过代入完成证明。",
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
        'The contrapositive swaps the hypothesis and conclusion and negates both, and it is often easier because the new hypothesis gives an equation to work with. "If $5 \\nmid n^2 + 10n$ then $5 \\nmid n$" has contrapositive "if $5 \\mid n$ then $5 \\mid n^2 + 10n$". Negating $\\nmid$ gives $\\mid$.\n\n> **Watch out.** Both changes are needed: every $\\nmid$ becomes $\\mid$, and the two parts change places. Keeping a $\\nmid$, or keeping the order, gives a statement that is not equivalent.',
        "逆否命题交换假设和结论并把两者都否定，它常常更容易证明，因为新的假设提供了一个可以使用的等式。“若 $5 \\nmid n^2 + 10n$，则 $5 \\nmid n$”的逆否命题是“若 $5 \\mid n$，则 $5 \\mid n^2 + 10n$”。$\\nmid$ 的否定是 $\\mid$。\n\n> **注意。** 两处改变都要做：每个 $\\nmid$ 都变成 $\\mid$，两部分交换位置。保留 $\\nmid$ 或保留原顺序，得到的命题都不等价。",
      ),
      generate(rng) {
        const d = rng.int(2, 9);
        const a = rng.pick(range(1, 6).filter((x) => x % d !== 0));
        const b = rng.int(1, 5) * d;
        const expr = `${term(a, "n^2")} + ${term(b, "n")}`;
        const z = (x: string, y: string) => t(`$\\text{if } ${x} \\text{ then } ${y}$`, `$\\text{若 } ${x} \\text{，则 } ${y}$`);
        const right = z(`${d} \\mid n`, `${d} \\mid ${expr}`);
        const converse = z(`${d} \\nmid n`, `${d} \\nmid ${expr}`);
        const inverse = z(`${d} \\mid ${expr}`, `${d} \\mid n`);
        const half = z(`${d} \\mid n`, `${d} \\nmid ${expr}`);
        return reasoned(
          oneOf(
            rng,
            t(
              `What is the contrapositive of "if $${d} \\nmid ${expr}$, then $${d} \\nmid n$"?`,
              `“若 $${d} \\nmid ${expr}$，则 $${d} \\nmid n$”的逆否命题是什么？`,
            ),
            right,
            [converse, inverse, half],
            walked(
              [
                [
                  ["Negate both parts", "否定两部分"],
                  t(
                    `$${d} \\nmid ${expr}$ becomes $${d} \\mid ${expr}$, and $${d} \\nmid n$ becomes $${d} \\mid n$.`,
                    `$${d} \\nmid ${expr}$ 变为 $${d} \\mid ${expr}$，$${d} \\nmid n$ 变为 $${d} \\mid n$。`,
                  ),
                ],
                [
                  ["Swap them", "交换位置"],
                  t(
                    `The contrapositive is "if $${d} \\mid n$, then $${d} \\mid ${expr}$".`,
                    `逆否命题是“若 $${d} \\mid n$，则 $${d} \\mid ${expr}$”。`,
                  ),
                ],
              ],
              t(
                `It is true, as it must be if the claim is: $${expr} = n(${term(a, "n")} + ${b})$ is a multiple of $n$, so $${d} \\mid n$ gives $${d} \\mid ${expr}$.`,
                `它成立，原命题成立时它也必然成立：$${expr} = n(${term(a, "n")} + ${b})$ 是 $n$ 的倍数，所以由 $${d} \\mid n$ 得 $${d} \\mid ${expr}$。`,
              ),
            ),
          ),
          [
            [converse.en, "This is the converse: the parts are swapped but not negated.", "这是逆命题：两部分交换了，但没有否定。"],
            [inverse.en, "This is the inverse: the parts are negated but not swapped.", "这是否命题：两部分否定了，但没有交换。"],
            [
              half.en,
              "Only one part was negated: the negation of $\\nmid$ is $\\mid$, in the conclusion as well.",
              "只否定了一部分：$\\nmid$ 的否定是 $\\mid$，结论中也一样。",
            ],
          ],
        );
      },
    },
    {
      id: "completing-a-divisibility-contrapositive",
      title: t("Completing the proof", "完成证明"),
      explanation: t(
        "Once the divisibility is assumed, write the number as a multiple, substitute it into the expression, and factor out the divisor. Assume $d \\mid n$ and write $n = dj$. Then substitute: for $n^2 + 3n$ with $d = 4$, $16j^2 + 12j = 4(4j^2 + 3j)$, so $4 \\mid n^2 + 3n$.\n\n> **Watch out.** $(dj)^2 = d^2 j^2$, so the squared term carries $d$ twice, while the $j$ term carries it once. Factor out only what every term shares.",
        "一旦假设了整除关系，就把这个数写成倍数，代入表达式，再提出这个因数。假设 $d \\mid n$，写 $n = dj$，然后代入：对 $n^2 + 3n$ 和 $d = 4$，$16j^2 + 12j = 4(4j^2 + 3j)$，所以 $4 \\mid n^2 + 3n$。\n\n> **注意。** $(dj)^2 = d^2 j^2$，所以平方项含两个 $d$，而 $j$ 项只含一个。只能提出每一项共有的因数。",
      ),
      generate(rng) {
        const d = rng.int(2, 9);
        const a = rng.int(1, 5);
        const b = rng.int(1, 9);
        const expr = `${term(a, "n^2")} + ${term(b, "n")}`;
        const inner = (x: number, y: number) => `${term(x, "j^2")}${plus(y, "j")}`;
        const right = `${d}(${inner(a * d, b)})`;
        return reasoned(
          oneOf(
            rng,
            t(
              `To show "if $${d} \\nmid ${expr}$ then $${d} \\nmid n$" by contrapositive, assume $n = ${d}j$. Which is $${expr}$?`,
              `用逆否证明“若 $${d} \\nmid ${expr}$，则 $${d} \\nmid n$”，假设 $n = ${d}j$。$${expr}$ 等于哪一个？`,
            ),
            math(right),
            [
              math(`${d}(${inner(a, b)})`),
              math(`${d}(${inner(a * d, b * d)})`),
              math(`${d * d}(${inner(a, b)})`),
              math(`${d}(${inner(a * d, b)}) + ${b}`),
            ],
            walked(
              [
                [
                  ["Substitute", "代入"],
                  t(
                    `$${expr} = ${a === 1 ? "" : a}(${d}j)^2 + ${b === 1 ? "" : b}(${d}j)$.`,
                    `$${expr} = ${a === 1 ? "" : a}(${d}j)^2 + ${b === 1 ? "" : b}(${d}j)$。`,
                  ),
                ],
                [["Expand", "展开"], t(`This is $${a * d * d}j^2 + ${b * d}j$.`, `它等于 $${a * d * d}j^2 + ${b * d}j$。`)],
                [
                  [`Factor out ${d}`, `提出 ${d}`],
                  t(`$${expr} = ${right}$, so $${d} \\mid ${expr}$.`, `$${expr} = ${right}$，所以 $${d} \\mid ${expr}$。`),
                ],
              ],
              t(
                `At $j = 1$, $n = ${d}$ and $${expr} = ${a * d * d + b * d} = ${d} \\cdot ${a * d + b}$, and $${inner(a * d, b)}$ is $${a * d + b}$ there.`,
                `$j = 1$ 时，$n = ${d}$，$${expr} = ${a * d * d + b * d} = ${d} \\cdot ${a * d + b}$，而此时 $${inner(a * d, b)}$ 等于 $${a * d + b}$。`,
              ),
            ),
          ),
          [
            [
              `$${d}(${inner(a, b)})$`,
              `$n^2 = ${d * d}j^2$, so after one factor $${d}$ comes out, the $j^2$ term still carries a $${d}$.`,
              `$n^2 = ${d * d}j^2$，所以提出一个因数 $${d}$ 后，$j^2$ 项仍含有一个 $${d}$。`,
            ],
            [
              `$${d}(${inner(a * d, b * d)})$`,
              `The $j$ term carries only one factor $${d}$, and it has already come out.`,
              `$j$ 项只含一个因数 $${d}$，它已经被提出来了。`,
            ],
            [
              `$${d * d}(${inner(a, b)})$`,
              `Only the $j^2$ term carries $${d * d}$; the $j$ term has a single $${d}$, so only $${d}$ comes out of both.`,
              `只有 $j^2$ 项含有 $${d * d}$；$j$ 项只有一个 $${d}$，所以两项只能共同提出 $${d}$。`,
            ],
            [
              `$${d}(${inner(a * d, b)}) + ${b}$`,
              "There is no constant term: every term of the substitution carries a factor $j$.",
              "没有常数项：代入后每一项都含有因数 $j$。",
            ],
          ],
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
  intro: t(
    "Claim: there are no integers $m, n$ with $6m + 9n = 4$. Suppose the claim is false: some integers $m, n$ satisfy $6m + 9n = 4$. The left side is $3(2m + 3n)$, a multiple of $3$, but $4$ is not a multiple of $3$. The supposition leads to something impossible, so it is false, and the claim is true.\n\nCheck: small values of $6m + 9n$ are $0, \\pm 3, \\pm 6, \\pm 9, \\pm 12, \\ldots$, all multiples of $3$; $4$ never appears.\n\nIn this lesson we set up a proof by contradiction by assuming the negation, and find the contradiction it leads to.",
    "命题：不存在整数 $m, n$ 使 $6m + 9n = 4$。假设命题不成立：存在整数 $m, n$ 满足 $6m + 9n = 4$。左边是 $3(2m + 3n)$，是 $3$ 的倍数，而 $4$ 不是 $3$ 的倍数。这个假设导出了不可能的结论，所以它是假的，命题为真。\n\n检验：$6m + 9n$ 的较小取值是 $0, \\pm 3, \\pm 6, \\pm 9, \\pm 12, \\ldots$，都是 $3$ 的倍数；$4$ 从不出现。\n\n本课我们通过假设命题的否定来建立反证法，并找出它导致的矛盾。",
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
        'A proof by contradiction of $P$ begins by assuming $\\neg P$. To prove "there are no integers $m, n$ with $4m + 6n = 7$", assume there are integers $m, n$ with $4m + 6n = 7$.\n\n> **Watch out.** "There are no $m, n$ with $\\ldots = 7$" is negated by "there are $m, n$ with $\\ldots = 7$": the equation stays as it is. Only the quantifier changes, and one pair is enough.',
        "用反证法证明 $P$，从假设 $\\neg P$ 开始。要证明“不存在整数 $m, n$ 使 $4m + 6n = 7$”，先假设存在整数 $m, n$ 使 $4m + 6n = 7$。\n\n> **注意。**“不存在 $m, n$ 使 $\\ldots = 7$”的否定是“存在 $m, n$ 使 $\\ldots = 7$”：等式保持不变。只有量词改变，而且一对就够了。",
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
          const right = t(`There are integers $m, n$ with $${eq}$.`, `存在整数 $m, n$ 使 $${eq}$。`);
          const restated = t(`For all integers $m, n$, $${ne}$.`, `对所有整数 $m, n$，$${ne}$。`);
          const tooStrong = t(`For all integers $m, n$, $${eq}$.`, `对所有整数 $m, n$，$${eq}$。`);
          const both = t(`There are integers $m, n$ with $${ne}$.`, `存在整数 $m, n$ 使 $${ne}$。`);
          return reasoned(
            oneOf(
              rng,
              t(
                `To prove "there are no integers $m, n$ with $${eq}$" by contradiction, what do you assume?`,
                `用反证法证明“不存在整数 $m, n$ 使 $${eq}$”，应当假设什么？`,
              ),
              right,
              [restated, tooStrong, both],
              walked(
                [
                  [
                    ["Restate the claim", "改写命题"],
                    t(`The claim says: for all integers $m, n$, $${ne}$.`, `命题是说：对所有整数 $m, n$，$${ne}$。`),
                  ],
                  [
                    ["Negate it", "否定它"],
                    t(
                      `"For all" becomes "there are", and $\\ne$ becomes $=$: there are integers $m, n$ with $${eq}$.`,
                      `“对所有”变为“存在”，$\\ne$ 变为 $=$：存在整数 $m, n$ 使 $${eq}$。`,
                    ),
                  ],
                ],
                t(
                  `The assumption leads to a contradiction, as it should: $${g}$ divides $${a}m + ${b}n$ but not $${c}$.`,
                  `这个假设如预期导出矛盾：$${g}$ 整除 $${a}m + ${b}n$，但不整除 $${c}$。`,
                ),
              ),
            ),
            [
              [
                restated.en,
                "This is the claim itself, not its negation; assuming it proves nothing.",
                "这就是命题本身，而不是它的否定；假设它什么也证明不了。",
              ],
              [
                tooStrong.en,
                "The negation only needs one pair $m, n$, not every pair.",
                "否定只需要存在一对 $m, n$，而不是所有的 $m, n$。",
              ],
              [
                both.en,
                "Here the equation was negated as well as the quantifier; the negation keeps the equation.",
                "这里除了量词，等式也被否定了；否定时等式应保持不变。",
              ],
            ],
          );
        }
      },
    },
    {
      id: "reaching-the-contradiction",
      title: t("Reaching the contradiction", "推出矛盾"),
      explanation: t(
        "In $4m + 6n = 7$, the left side is $2(2m + 3n)$, which is even, but $7$ is odd. The contradiction comes from a common divisor of the coefficients that does not divide the right side.\n\n> **Watch out.** The divisor has to divide both terms, whatever $m$ and $n$ are, so it is the greatest common divisor of the coefficients, not one coefficient or their product.",
        "在 $4m + 6n = 7$ 中，左边是 $2(2m + 3n)$，为偶数，而 $7$ 是奇数。矛盾来自系数的一个公因数不整除右边。\n\n> **注意。** 这个因数必须在 $m, n$ 任意取值时都整除两项，所以它是系数的最大公因数，而不是其中一个系数或它们的乘积。",
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
            mistakes: distinct([
              why(a, `$${a}$ divides $${a}m$, but not $${b}n$ for every $n$.`, `$${a}$ 整除 $${a}m$，但不是对每个 $n$ 都整除 $${b}n$。`),
              why(b, `$${b}$ divides $${b}n$, but not $${a}m$ for every $m$.`, `$${b}$ 整除 $${b}n$，但不是对每个 $m$ 都整除 $${a}m$。`),
              why(
                a * b,
                `At $m = 1, n = 0$ the left side is $${a}$, which $${a * b}$ does not divide.`,
                `$m = 1, n = 0$ 时左边是 $${a}$，$${a * b}$ 不整除它。`,
              ),
              why(
                c,
                `$${c}$ is the right side; the divisor must divide the left side for every $m, n$.`,
                `$${c}$ 是右边；这个因数要对任意 $m, n$ 都整除左边。`,
              ),
            ]),
            solution: walked(
              [
                [["Find the common divisor", "找公因数"], t(`$\\gcd(${a}, ${b}) = ${g}$.`, `$\\gcd(${a}, ${b}) = ${g}$。`)],
                [
                  ["Factor the left side", "左边因式分解"],
                  t(
                    `$${a}m + ${b}n = ${g}(${term(a / g, "m")} + ${term(b / g, "n")})$, a multiple of $${g}$.`,
                    `$${a}m + ${b}n = ${g}(${term(a / g, "m")} + ${term(b / g, "n")})$，是 $${g}$ 的倍数。`,
                  ),
                ],
                [
                  ["Compare with the right side", "与右边比较"],
                  t(
                    `$${c} = ${g} \\cdot ${Math.floor(c / g)} + ${c % g}$, so $${g} \\nmid ${c}$: a contradiction.`,
                    `$${c} = ${g} \\cdot ${Math.floor(c / g)} + ${c % g}$，所以 $${g} \\nmid ${c}$：矛盾。`,
                  ),
                ],
              ],
              t(
                `Nothing larger works: at $m = 1, n = 0$ the left side is $${a}$, and at $m = 0, n = 1$ it is $${b}$; the largest integer dividing both is $${g}$.`,
                `更大的数都不行：$m = 1, n = 0$ 时左边是 $${a}$，$m = 0, n = 1$ 时是 $${b}$；同时整除两者的最大整数是 $${g}$。`,
              ),
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
  intro: t(
    "Claim: $\\sqrt{3}$ is irrational. Suppose instead $\\sqrt{3} = a/b$ with integers $a, b$ sharing no factor. Squaring gives $a^2 = 3b^2$, so $3 \\mid a^2$, and since $3$ is prime, $3 \\mid a$. Write $a = 3c$: then $9c^2 = 3b^2$, so $b^2 = 3c^2$ and $3 \\mid b$. Now $3$ divides both $a$ and $b$, which share no factor: a contradiction.\n\nCheck: the step $3 \\mid a^2 \\Rightarrow 3 \\mid a$ is sound: if $3 \\nmid a$, then $a = 3q \\pm 1$ and $a^2 = 9q^2 \\pm 6q + 1$ leaves remainder $1$.\n\nIn this lesson we clear the root from an assumed fraction and decide which roots of integers are rational.",
    "命题：$\\sqrt{3}$ 是无理数。反过来假设 $\\sqrt{3} = a/b$，其中整数 $a, b$ 没有公因数。平方得 $a^2 = 3b^2$，所以 $3 \\mid a^2$，又因为 $3$ 是质数，$3 \\mid a$。写 $a = 3c$：则 $9c^2 = 3b^2$，所以 $b^2 = 3c^2$，$3 \\mid b$。于是 $3$ 同时整除没有公因数的 $a$ 和 $b$：矛盾。\n\n检验：$3 \\mid a^2 \\Rightarrow 3 \\mid a$ 这一步是成立的：若 $3 \\nmid a$，则 $a = 3q \\pm 1$，$a^2 = 9q^2 \\pm 6q + 1$ 除以 $3$ 余 $1$。\n\n本课我们从假设的分数中去掉根号，并判断整数的哪些根是有理数。",
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
        "Assume $\\sqrt{2} = a/b$ with integers $a, b$ sharing no factor. Squaring gives $a^2 = 2b^2$, so $a^2$ is even and so $a$ is even. Writing $a = 2c$ gives $b^2 = 2c^2$, so $b$ is even too: a contradiction.\n\n> **Watch out.** Raise both whole sides to the power: $(a/b)^2 = a^2/b^2$, while $(\\sqrt{2})^2 = 2$, not $2^2$.",
        "假设 $\\sqrt{2} = a/b$，其中整数 $a, b$ 没有公因数。平方得 $a^2 = 2b^2$，所以 $a^2$ 是偶数，从而 $a$ 是偶数。写 $a = 2c$，得 $b^2 = 2c^2$，所以 $b$ 也是偶数：矛盾。\n\n> **注意。** 要把两边整体乘方：$(a/b)^2 = a^2/b^2$，而 $(\\sqrt{2})^2 = 2$，不是 $2^2$。",
      ),
      generate(rng) {
        const root = rng.pick([2, 3]);
        let n: number;
        do n = rng.int(2, 60);
        while (root === 2 ? isSquare(n) : Number.isInteger(Math.cbrt(n)));
        const r = root === 2 ? `\\sqrt{${n}}` : `\\sqrt[3]{${n}}`;
        const e = root;
        const power = e === 2 ? t("square", "平方") : t("cube", "立方");
        return reasoned(
          oneOf(
            rng,
            t(
              `Assume $${r} = a/b$ for integers $a, b$ with $b \\ne 0$. Which equation follows?`,
              `假设 $${r} = a/b$，其中 $a, b$ 为整数且 $b \\ne 0$。可以推出哪个等式？`,
            ),
            math(`a^{${e}} = ${n}b^{${e}}`),
            [math(`a = ${n}b`), math(`a^{${e}} = ${n}b`), math(`a = ${n}b^{${e}}`), math(`a^{${e}} = ${n ** e}b^{${e}}`)],
            walked(
              [
                [["Clear the fraction", "去分母"], t(`Multiply by $b$: $${r} \\cdot b = a$.`, `两边乘以 $b$：$${r} \\cdot b = a$。`)],
                [
                  [`${power.en[0]!.toUpperCase()}${power.en.slice(1)} both sides`, `两边${power["zh-CN"]}`],
                  t(`$(${r})^{${e}} = ${n}$, so $a^{${e}} = ${n}b^{${e}}$.`, `$(${r})^{${e}} = ${n}$，所以 $a^{${e}} = ${n}b^{${e}}$。`),
                ],
              ],
              t(
                `Dividing by $b^{${e}}$ gives $(a/b)^{${e}} = ${n}$, and taking the ${e === 2 ? "square" : "cube"} root returns $a/b = ${r}$.`,
                `两边除以 $b^{${e}}$ 得 $(a/b)^{${e}} = ${n}$，再开${e === 2 ? "平" : "立"}方就回到 $a/b = ${r}$。`,
              ),
            ),
          ),
          [
            [`$a = ${n}b$`, "Neither side was raised to a power; the root is still there.", "两边都没有乘方；根号还在。"],
            [`$a^{${e}} = ${n}b$`, `Only $a$ was raised to the power; $b$ must be raised too.`, `只有 $a$ 乘方了；$b$ 也要乘方。`],
            [`$a = ${n}b^{${e}}$`, `Only $b$ was raised to the power; $a$ must be raised too.`, `只有 $b$ 乘方了；$a$ 也要乘方。`],
            [
              `$a^{${e}} = ${n ** e}b^{${e}}$`,
              `$(${r})^{${e}} = ${n}$, not $${n}^{${e}}$: the power undoes the root.`,
              `$(${r})^{${e}} = ${n}$，不是 $${n}^{${e}}$：乘方抵消了根号。`,
            ],
          ],
        );
      },
    },
    {
      id: "which-roots-are-rational",
      title: t("Which roots are rational", "哪些根是有理数"),
      explanation: t(
        "For a positive integer $n$, $\\sqrt{n}$ is rational exactly when $n$ is a perfect square, and $\\sqrt[3]{n}$ exactly when $n$ is a perfect cube. So $\\sqrt{49} = 7$ is rational and $\\sqrt{50}$ is irrational.\n\n> **Watch out.** Check the right kind of power: $8 = 2^3$ is a perfect cube, so $\\sqrt[3]{8}$ is rational, but $8$ is not a perfect square, so $\\sqrt{8}$ is irrational.",
        "对正整数 $n$，$\\sqrt{n}$ 是有理数当且仅当 $n$ 是完全平方数；$\\sqrt[3]{n}$ 是有理数当且仅当 $n$ 是完全立方数。所以 $\\sqrt{49} = 7$ 是有理数，而 $\\sqrt{50}$ 是无理数。\n\n> **注意。** 要看对应的乘方：$8 = 2^3$ 是完全立方数，所以 $\\sqrt[3]{8}$ 是有理数；但 $8$ 不是完全平方数，所以 $\\sqrt{8}$ 是无理数。",
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
        const p = cube ? 3 : 2;
        const r = cube ? `\\sqrt[3]{${n}}` : `\\sqrt{${n}}`;
        const k = Math.round(cube ? Math.cbrt(n) : Math.sqrt(n));
        const lo = range(1, 15)
          .filter((x) => x ** p <= n)
          .pop()!;
        const kind = cube ? t("cube", "立方") : t("square", "平方");
        const right = yesNo[perfect ? 0 : 1]!;
        const wrong = yesNo[perfect ? 1 : 0]!;
        return reasoned(
          oneOf(
            rng,
            t(`Is $${r}$ rational?`, `$${r}$ 是有理数吗？`),
            right,
            [wrong],
            walked(
              [
                [
                  [`Compare with perfect ${kind.en}s`, `与完全${kind["zh-CN"]}数比较`],
                  perfect
                    ? t(`$${k}^{${p}} = ${n}$.`, `$${k}^{${p}} = ${n}$。`)
                    : t(
                        `$${lo}^{${p}} = ${lo ** p}$ and $${lo + 1}^{${p}} = ${(lo + 1) ** p}$, so $${n}$ lies strictly between two perfect ${kind.en}s.`,
                        `$${lo}^{${p}} = ${lo ** p}$，$${lo + 1}^{${p}} = ${(lo + 1) ** p}$，所以 $${n}$ 严格介于两个完全${kind["zh-CN"]}数之间。`,
                      ),
                ],
                [
                  ["Conclude", "得出结论"],
                  perfect
                    ? t(`$${r} = ${k}$, an integer, so it is rational.`, `$${r} = ${k}$ 是整数，所以是有理数。`)
                    : t(
                        `$${n}$ is not a perfect ${kind.en}, so $${r}$ is irrational.`,
                        `$${n}$ 不是完全${kind["zh-CN"]}数，所以 $${r}$ 是无理数。`,
                      ),
                ],
              ],
              perfect
                ? t(
                    `$${k} \\times ${k}${cube ? ` \\times ${k}` : ""} = ${n}$.`,
                    `$${k} \\times ${k}${cube ? ` \\times ${k}` : ""} = ${n}$。`,
                  )
                : t(
                    `$${r} \\approx ${(cube ? Math.cbrt(n) : Math.sqrt(n)).toFixed(3)}$, between $${lo}$ and $${lo + 1}$ and not a whole number.`,
                    `$${r} \\approx ${(cube ? Math.cbrt(n) : Math.sqrt(n)).toFixed(3)}$，介于 $${lo}$ 和 $${lo + 1}$ 之间，不是整数。`,
                  ),
            ),
          ),
          [
            perfect
              ? [wrong.en, `$${n} = ${k}^{${p}}$, so the root is the integer $${k}$.`, `$${n} = ${k}^{${p}}$，所以根是整数 $${k}$。`]
              : [
                  wrong.en,
                  `$${n}$ is not a perfect ${kind.en}, and the root of an integer that is not a perfect ${kind.en} is irrational.`,
                  `$${n}$ 不是完全${kind["zh-CN"]}数，而不是完全${kind["zh-CN"]}数的整数的根是无理数。`,
                ],
          ],
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
  intro: t(
    "Claim: $2 + \\sqrt{5}$ is irrational. Suppose instead $2 + \\sqrt{5} = m/n$ with integers $m, n$ and $n \\ne 0$. Then $\\sqrt{5} = \\dfrac{m}{n} - 2 = \\dfrac{m - 2n}{n}$, a ratio of integers, so $\\sqrt{5}$ would be rational. It is not, so the supposition is false and $2 + \\sqrt{5}$ is irrational.\n\nCheck: substituting back, $2 + \\dfrac{m - 2n}{n} = \\dfrac{2n + m - 2n}{n} = \\dfrac{m}{n}$, so the rearrangement was right.\n\nIn this lesson we isolate the irrational number in such a proof and decide whether sums and products involving roots are rational.",
    "命题：$2 + \\sqrt{5}$ 是无理数。反过来假设 $2 + \\sqrt{5} = m/n$，其中 $m, n$ 为整数且 $n \\ne 0$。则 $\\sqrt{5} = \\dfrac{m}{n} - 2 = \\dfrac{m - 2n}{n}$ 是整数之比，$\\sqrt{5}$ 就成了有理数。但它不是，所以假设为假，$2 + \\sqrt{5}$ 是无理数。\n\n检验：代回得 $2 + \\dfrac{m - 2n}{n} = \\dfrac{2n + m - 2n}{n} = \\dfrac{m}{n}$，所以变形是对的。\n\n本课我们在这类证明中分离出无理数，并判断含根式的和与积是否为有理数。",
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
        "To prove $3 + 2\\sqrt{5}$ is irrational, assume $3 + 2\\sqrt{5} = m/n$ with integers $m, n$. Then $\\sqrt{5} = \\dfrac{m - 3n}{2n}$, a ratio of integers, contradicting the irrationality of $\\sqrt{5}$.\n\n> **Watch out.** Move the constant first, writing it over $n$ so that it becomes a multiple of $n$ in the numerator; only then divide by the coefficient of the root.",
        "要证明 $3 + 2\\sqrt{5}$ 是无理数，假设 $3 + 2\\sqrt{5} = m/n$，$m, n$ 为整数。则 $\\sqrt{5} = \\dfrac{m - 3n}{2n}$ 是整数之比，与 $\\sqrt{5}$ 是无理数矛盾。\n\n> **注意。** 先移走常数，并把它写成以 $n$ 为分母的分数，使它在分子中成为 $n$ 的倍数；然后再除以根式的系数。",
      ),
      generate(rng) {
        const p = rng.pick([2, 3, 5, 6, 7, 10, 11, 13]);
        const a = rng.int(-9, 9);
        const b = rng.int(a === 0 ? 2 : 1, 7);
        const lhs = `${a === 0 ? "" : `${a} + `}${b === 1 ? "" : b}\\sqrt{${p}}`;
        const num = a === 0 ? "m" : `m ${a > 0 ? "-" : "+"} ${term(Math.abs(a), "n")}`;
        const den = b === 1 ? "n" : `${b}n`;
        const right = `\\dfrac{${num}}{${den}}`;
        const pairs: [string, string, string][] = [];
        if (a !== 0) {
          pairs.push([
            `\\dfrac{m ${a > 0 ? "+" : "-"} ${term(Math.abs(a), "n")}}{${den}}`,
            `The constant $${a}$ changes sign when it moves to the other side.`,
            `常数 $${a}$ 移到另一边时要变号。`,
          ]);
          pairs.push([
            `\\dfrac{m ${a > 0 ? "-" : "+"} ${Math.abs(a)}}{${den}}`,
            `Over a common denominator, $${a} = \\dfrac{${a}n}{n}$, so the numerator gets $${term(Math.abs(a), "n")}$, not $${Math.abs(a)}$.`,
            `通分后 $${a} = \\dfrac{${a}n}{n}$，所以分子中是 $${term(Math.abs(a), "n")}$，不是 $${Math.abs(a)}$。`,
          ]);
          pairs.push(
            b === 1
              ? [`\\dfrac{n}{${num}}`, "The fraction is upside down: $m$ stays in the numerator.", "分数上下颠倒了：$m$ 应留在分子。"]
              : [
                  `\\dfrac{${b}m}{n} ${a > 0 ? "-" : "+"} ${Math.abs(a)}`,
                  `$\\sqrt{${p}}$ is still multiplied by $${b}$; divide by $${b}$ rather than multiplying.`,
                  `$\\sqrt{${p}}$ 还乘着 $${b}$；应当除以 $${b}$ 而不是乘以它。`,
                ],
          );
        } else {
          pairs.push([
            `\\dfrac{m - n}{${den}}`,
            "There is no constant term to move; nothing is subtracted.",
            "没有常数项需要移动；不用减去任何东西。",
          ]);
          pairs.push([
            `\\dfrac{${b}m}{n}`,
            `$\\sqrt{${p}}$ is multiplied by $${b}$; divide by $${b}$ rather than multiplying.`,
            `$\\sqrt{${p}}$ 乘着 $${b}$；应当除以 $${b}$ 而不是乘以它。`,
          ]);
        }
        if (b !== 1)
          pairs.push([
            `\\dfrac{${num}}{n}`,
            `$\\sqrt{${p}}$ still has the coefficient $${b}$; divide by it as well.`,
            `$\\sqrt{${p}}$ 还有系数 $${b}$；也要除以它。`,
          ]);
        const times = b === 1 ? "" : `${b} \\cdot `;
        return reasoned(
          oneOf(
            rng,
            t(
              `To prove $${lhs}$ is irrational, assume $${lhs} = \\dfrac{m}{n}$ for integers $m, n$ with $n \\ne 0$. Then $\\sqrt{${p}}$ equals what?`,
              `要证明 $${lhs}$ 是无理数，假设 $${lhs} = \\dfrac{m}{n}$，$m, n$ 为整数且 $n \\ne 0$。则 $\\sqrt{${p}}$ 等于什么？`,
            ),
            math(right),
            pairs.map(([w]) => math(w)),
            walked(
              [
                ...(a === 0
                  ? []
                  : ([
                      [
                        ["Move the constant", "移走常数"],
                        t(
                          `$${b === 1 ? "" : b}\\sqrt{${p}} = \\dfrac{m}{n} ${a > 0 ? "-" : "+"} ${Math.abs(a)} = \\dfrac{${num}}{n}$.`,
                          `$${b === 1 ? "" : b}\\sqrt{${p}} = \\dfrac{m}{n} ${a > 0 ? "-" : "+"} ${Math.abs(a)} = \\dfrac{${num}}{n}$。`,
                        ),
                      ],
                    ] as const)),
                ...(b === 1
                  ? []
                  : ([
                      [["Divide by the coefficient", "除以系数"], t(`$\\sqrt{${p}} = ${right}$.`, `$\\sqrt{${p}} = ${right}$。`)],
                    ] as const)),
                [
                  ["Conclude", "得出结论"],
                  t(
                    `$${right}$ is a ratio of integers, so $\\sqrt{${p}}$ would be rational: a contradiction.`,
                    `$${right}$ 是整数之比，$\\sqrt{${p}}$ 就成了有理数：矛盾。`,
                  ),
                ],
              ],
              b === 1
                ? t(
                    `Adding $${a} = \\dfrac{${a}n}{n}$ to $${right}$ gives $\\dfrac{m}{n}$, as assumed.`,
                    `$${right}$ 加上 $${a} = \\dfrac{${a}n}{n}$ 得 $\\dfrac{m}{n}$，与假设一致。`,
                  )
                : t(
                    `$${times}${right} = \\dfrac{${num}}{n}$${a === 0 ? "" : `, and adding $${a} = \\dfrac{${a}n}{n}$ gives $\\dfrac{m}{n}$`}, as assumed.`,
                    `$${times}${right} = \\dfrac{${num}}{n}$${a === 0 ? "" : `，再加上 $${a} = \\dfrac{${a}n}{n}$ 得 $\\dfrac{m}{n}$`}，与假设一致。`,
                  ),
            ),
          ),
          pairs.map(([w, en, zh]): Reason => [`$${w}$`, en, zh]),
        );
      },
    },
    {
      id: "rational-or-irrational",
      title: t("Rational or irrational?", "有理数还是无理数？"),
      explanation: t(
        "A nonzero rational times an irrational is irrational, and a rational plus an irrational is irrational. Two irrationals can combine to a rational: $\\sqrt{2} \\cdot \\sqrt{8} = 4$ and $(1 + \\sqrt{3}) + (1 - \\sqrt{3}) = 2$.\n\n> **Watch out.** There is no rule for two irrationals: their sum or product may be rational or irrational, so simplify it first and then decide.",
        "非零有理数乘无理数是无理数，有理数加无理数也是无理数。两个无理数相结合可能得到有理数：$\\sqrt{2} \\cdot \\sqrt{8} = 4$，$(1 + \\sqrt{3}) + (1 - \\sqrt{3}) = 2$。\n\n> **注意。** 两个无理数的和或积没有固定规律，可能是有理数也可能是无理数，所以要先化简再判断。",
      ),
      generate(rng) {
        const p = rng.pick([2, 3, 5, 6, 7, 10]);
        const a = rng.int(1, 9);
        const kind = rng.int(0, 3);
        let expr: string;
        let rational: boolean;
        let simplify: Text;
        let check: Text;
        let mistake: [string, string];
        if (kind === 0) {
          const zero = rng.int(0, 3) === 0;
          const b = zero ? 0 : rng.int(1, 6);
          expr = `${a} + ${b}\\sqrt{${p}}`;
          rational = zero;
          simplify = zero
            ? t(`$0 \\cdot \\sqrt{${p}} = 0$, so the number is $${a}$.`, `$0 \\cdot \\sqrt{${p}} = 0$，所以该数为 $${a}$。`)
            : t(
                `$${b}\\sqrt{${p}}$ is a nonzero rational times an irrational, so it is irrational; adding the rational $${a}$ keeps it irrational.`,
                `$${b}\\sqrt{${p}}$ 是非零有理数乘无理数，所以是无理数；再加上有理数 $${a}$ 仍是无理数。`,
              );
          check = zero
            ? t(`$${a} + 0 = ${a} = \\dfrac{${a}}{1}$.`, `$${a} + 0 = ${a} = \\dfrac{${a}}{1}$。`)
            : t(
                `If it equalled a rational $q$, then $\\sqrt{${p}} = \\dfrac{q - ${a}}{${b}}$ would be rational too.`,
                `如果它等于有理数 $q$，那么 $\\sqrt{${p}} = \\dfrac{q - ${a}}{${b}}$ 也是有理数。`,
              );
          mistake = zero
            ? ["The root is multiplied by $0$, so nothing irrational is left.", "根式乘的是 $0$，所以不剩下任何无理数。"]
            : [
                `$${b}\\sqrt{${p}}$ is irrational, and adding a rational cannot cancel it.`,
                `$${b}\\sqrt{${p}}$ 是无理数，加上有理数无法把它抵消。`,
              ];
        } else if (kind === 1) {
          const q = rng.pick([2, 3, 5, 6, 7, 8, 10, 12, 18, 20, 24, 27, 45, 50]);
          expr = `\\sqrt{${p}} \\cdot \\sqrt{${q}}`;
          rational = isSquare(p * q);
          simplify = t(`$\\sqrt{${p}} \\cdot \\sqrt{${q}} = \\sqrt{${p * q}}$.`, `$\\sqrt{${p}} \\cdot \\sqrt{${q}} = \\sqrt{${p * q}}$。`);
          check = rational
            ? t(`$${Math.sqrt(p * q)}^2 = ${p * q}$.`, `$${Math.sqrt(p * q)}^2 = ${p * q}$。`)
            : t(
                `$${Math.floor(Math.sqrt(p * q))}^2 = ${Math.floor(Math.sqrt(p * q)) ** 2}$ and $${Math.floor(Math.sqrt(p * q)) + 1}^2 = ${(Math.floor(Math.sqrt(p * q)) + 1) ** 2}$, and $${p * q}$ lies strictly between.`,
                `$${Math.floor(Math.sqrt(p * q))}^2 = ${Math.floor(Math.sqrt(p * q)) ** 2}$，$${Math.floor(Math.sqrt(p * q)) + 1}^2 = ${(Math.floor(Math.sqrt(p * q)) + 1) ** 2}$，而 $${p * q}$ 严格介于两者之间。`,
              );
          mistake = rational
            ? [
                `Two irrationals can multiply to a rational: here $${p * q}$ is a perfect square.`,
                `两个无理数的积可以是有理数：这里 $${p * q}$ 是完全平方数。`,
              ]
            : [
                `The product is $\\sqrt{${p * q}}$, and $${p * q}$ is not a perfect square.`,
                `积是 $\\sqrt{${p * q}}$，而 $${p * q}$ 不是完全平方数。`,
              ];
        } else if (kind === 2) {
          const b = rng.int(1, 6);
          const same = rng.bool();
          expr = `(${a} + ${b}\\sqrt{${p}}) + (${a} ${same ? "-" : "+"} ${b}\\sqrt{${p}})`;
          rational = same;
          simplify = same
            ? t(`The root terms cancel: the sum is $${2 * a}$.`, `根式项抵消：和为 $${2 * a}$。`)
            : t(`The sum is $${2 * a} + ${2 * b}\\sqrt{${p}}$.`, `和为 $${2 * a} + ${2 * b}\\sqrt{${p}}$。`);
          check = same
            ? t(
                `$${b}\\sqrt{${p}} - ${b}\\sqrt{${p}} = 0$ and $${a} + ${a} = ${2 * a}$.`,
                `$${b}\\sqrt{${p}} - ${b}\\sqrt{${p}} = 0$，$${a} + ${a} = ${2 * a}$。`,
              )
            : t(
                `$${b}\\sqrt{${p}} + ${b}\\sqrt{${p}} = ${2 * b}\\sqrt{${p}} \\ne 0$.`,
                `$${b}\\sqrt{${p}} + ${b}\\sqrt{${p}} = ${2 * b}\\sqrt{${p}} \\ne 0$。`,
              );
          mistake = same
            ? ["The root terms have opposite signs and cancel.", "根式项符号相反，互相抵消。"]
            : ["The root terms have the same sign, so they add up instead of cancelling.", "根式项符号相同，相加而不是抵消。"];
        } else {
          const b = rng.int(2, 9);
          expr = `\\dfrac{${b}}{\\sqrt{${p}}}`;
          rational = false;
          const g = gcd(b, p);
          const c = p / g === 1 ? `${b / g}` : `\\dfrac{${b / g}}{${p / g}}`;
          simplify = t(
            `Multiply top and bottom by $\\sqrt{${p}}$: $\\dfrac{${b}}{\\sqrt{${p}}} = \\dfrac{${b}\\sqrt{${p}}}{${p}} = ${c}\\sqrt{${p}}$.`,
            `分子分母同乘 $\\sqrt{${p}}$：$\\dfrac{${b}}{\\sqrt{${p}}} = \\dfrac{${b}\\sqrt{${p}}}{${p}} = ${c}\\sqrt{${p}}$。`,
          );
          check = t(
            `$${c}\\sqrt{${p}} \\cdot \\sqrt{${p}} = ${c} \\cdot ${p} = ${b}$, so the rewriting is right.`,
            `$${c}\\sqrt{${p}} \\cdot \\sqrt{${p}} = ${c} \\cdot ${p} = ${b}$，所以改写是对的。`,
          );
          mistake = [
            `It equals $${c}\\sqrt{${p}}$, a nonzero rational times an irrational.`,
            `它等于 $${c}\\sqrt{${p}}$，是非零有理数乘无理数。`,
          ];
        }
        const options = [t("Rational", "有理数"), t("Irrational", "无理数")];
        const right = options[rational ? 0 : 1]!;
        const wrong = options[rational ? 1 : 0]!;
        return reasoned(
          oneOf(
            rng,
            t(`Is $${expr}$ rational or irrational?`, `$${expr}$ 是有理数还是无理数？`),
            right,
            [wrong],
            walked(
              [
                [["Simplify", "化简"], simplify],
                [["Decide", "判断"], t(`So $${expr}$ is ${right.en.toLowerCase()}.`, `所以 $${expr}$ 是${right["zh-CN"]}。`)],
              ],
              check,
            ),
          ),
          [[wrong.en, mistake[0], mistake[1]]],
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
  intro: t(
    "Claim: if $5 \\mid m$ and $5 \\nmid n$, then $5 \\nmid m + n$. Suppose instead $5 \\mid m + n$. Then $n = (m + n) - m$ is a difference of two multiples of $5$, so $5 \\mid n$, which contradicts $5 \\nmid n$. So $5 \\nmid m + n$.\n\nCheck: $m = 10$, $n = 3$ gives $m + n = 13$, which is not a multiple of $5$, as the claim says.\n\nIn this lesson we isolate the part that is not divisible to reach the contradiction, and use this to spot expressions that are never or always divisible.",
    "命题：若 $5 \\mid m$ 且 $5 \\nmid n$，则 $5 \\nmid m + n$。反过来假设 $5 \\mid m + n$。则 $n = (m + n) - m$ 是两个 $5$ 的倍数之差，所以 $5 \\mid n$，与 $5 \\nmid n$ 矛盾。所以 $5 \\nmid m + n$。\n\n检验：$m = 10$，$n = 3$ 时 $m + n = 13$，不是 $5$ 的倍数，与命题一致。\n\n本课我们分离出不可整除的部分来导出矛盾，并据此判断哪些表达式永远不能或总能被整除。",
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
        "To prove that if $3 \\mid m$ and $3 \\nmid n$ then $3 \\nmid 2m + n$, assume $3 \\mid 2m + n$. Then $n = (2m + n) - 2m$ is a difference of multiples of $3$, so $3 \\mid n$: a contradiction.\n\n> **Watch out.** A contradiction must clash with something given. Concluding $3 \\mid 2m$ clashes with nothing, since it already follows from $3 \\mid m$; isolate the part that is given as not divisible.",
        "要证明若 $3 \\mid m$ 且 $3 \\nmid n$，则 $3 \\nmid 2m + n$：假设 $3 \\mid 2m + n$。则 $n = (2m + n) - 2m$ 是 $3$ 的倍数之差，所以 $3 \\mid n$：矛盾。\n\n> **注意。** 矛盾必须与已知条件冲突。推出 $3 \\mid 2m$ 不与任何条件冲突，因为由 $3 \\mid m$ 本来就能得到它；要分离出已知不可整除的那一部分。",
      ),
      generate(rng) {
        const d = rng.int(2, 11);
        const a = rng.int(1, 9);
        const b = rng.pick(range(1, 5).filter((x) => x % d !== 0));
        const expr = `${term(a, "m")} + ${term(b, "n")}`;
        const am = term(a, "m");
        const bn = term(b, "n");
        const right = t(`$${bn} = (${expr}) - ${am}$, so $${d} \\mid ${bn}$.`, `$${bn} = (${expr}) - ${am}$，所以 $${d} \\mid ${bn}$。`);
        const w1 = t(
          `$${expr} = ${d}k$ for some integer $k$, so $${d} \\mid m$.`,
          `存在整数 $k$ 使 $${expr} = ${d}k$，所以 $${d} \\mid m$。`,
        );
        const w2 = t(`$${am} = (${expr}) - ${bn}$, so $${d} \\mid ${am}$.`, `$${am} = (${expr}) - ${bn}$，所以 $${d} \\mid ${am}$。`);
        const w3 = t(`$${bn} = (${expr}) + ${am}$, so $${d} \\nmid ${bn}$.`, `$${bn} = (${expr}) + ${am}$，所以 $${d} \\nmid ${bn}$。`);
        const v = a * d + b;
        return reasoned(
          oneOf(
            rng,
            t(
              `Suppose $${d} \\mid m$ and $${d} \\nmid ${bn}$. To show $${d} \\nmid ${expr}$, assume $${d} \\mid ${expr}$. Which step gives the contradiction?`,
              `设 $${d} \\mid m$ 且 $${d} \\nmid ${bn}$。要证明 $${d} \\nmid ${expr}$，假设 $${d} \\mid ${expr}$。哪一步导出矛盾？`,
            ),
            right,
            [w1, w2, w3],
            walked(
              [
                [
                  ["Isolate the term not divisible", "分离出不可整除的项"],
                  t(`$${bn} = (${expr}) - ${am}$.`, `$${bn} = (${expr}) - ${am}$。`),
                ],
                [
                  ["Use what is known", "利用已知"],
                  t(
                    `$${d} \\mid ${expr}$ by assumption and $${d} \\mid ${am}$ ${a === 1 ? "is given" : `because $${d} \\mid m$`}, so $${d}$ divides their difference $${bn}$.`,
                    `由假设 $${d} \\mid ${expr}$，${a === 1 ? "又已知" : `又因 $${d} \\mid m$ 得`} $${d} \\mid ${am}$，所以 $${d}$ 整除它们的差 $${bn}$。`,
                  ),
                ],
                [["Find the clash", "找出冲突"], t(`This contradicts $${d} \\nmid ${bn}$.`, `这与 $${d} \\nmid ${bn}$ 矛盾。`)],
              ],
              t(
                `With $m = ${d}$ and $n = 1$, the hypotheses hold and $${expr} = ${v} = ${d} \\cdot ${Math.floor(v / d)} + ${v % d}$, not a multiple of $${d}$, as the claim says.`,
                `取 $m = ${d}$，$n = 1$，前提成立，而 $${expr} = ${v} = ${d} \\cdot ${Math.floor(v / d)} + ${v % d}$，不是 $${d}$ 的倍数，与命题一致。`,
              ),
            ),
          ),
          [
            [w1.en, `$${d} \\mid m$ is given, so reaching it contradicts nothing.`, `$${d} \\mid m$ 是已知条件，推出它不构成矛盾。`],
            [
              w2.en,
              `$${d} \\mid ${am}$ ${a === 1 ? "is given" : `already follows from $${d} \\mid m$`}, so it contradicts nothing; the step also uses $${d} \\mid ${bn}$, which is not known.`,
              `$${d} \\mid ${am}$ ${a === 1 ? "是已知条件" : `本来就可由 $${d} \\mid m$ 得到`}，不构成矛盾；而且这一步用到了未知的 $${d} \\mid ${bn}$。`,
            ],
            [
              w3.en,
              `$(${expr}) + ${am}$ is not $${bn}$, and $${d} \\nmid ${bn}$ is the hypothesis itself, not a contradiction.`,
              `$(${expr}) + ${am}$ 不等于 $${bn}$，而且 $${d} \\nmid ${bn}$ 就是前提本身，不是矛盾。`,
            ],
          ],
        );
      },
    },
    {
      id: "never-divisible-expressions",
      title: t("Never divisible", "永远不能整除"),
      explanation: t(
        "If a divisor already divides one part of a sum, it divides the whole sum exactly when it divides the remaining part. If $d \\mid m$, then $d \\mid am + c$ exactly when $d \\mid c$. So when $7 \\mid m$, $3m + 14$ is always divisible by $7$, while $3m + 10$ never is.\n\n> **Watch out.** Only the constant decides. The coefficient of the variable does not matter, because $d$ divides that term whatever the coefficient is.",
        "如果一个因数已经整除和的一部分，那么它整除整个和，当且仅当它整除剩下的部分。若 $d \\mid m$，则 $d \\mid am + c$ 当且仅当 $d \\mid c$。所以当 $7 \\mid m$ 时，$3m + 14$ 总能被 $7$ 整除，而 $3m + 10$ 永远不能。\n\n> **注意。** 只有常数起决定作用。变量的系数无关紧要，因为不论系数是多少，$d$ 都整除那一项。",
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
        const tex = (a: number, k: number) => `${term(a, v)} + ${k}`;
        const k0 = never ? c : mults[0]!;
        const a0 = coeffs[0]!;
        const restK = never ? mults : [c, ...[1, 2].map(() => (c + rng.int(1, d - 1)) % d || 1)].map((k, i) => k + d * i);
        const rest = restK.map((k, i) => [tex(coeffs[i + 1]!, k), k] as const);
        const value = a0 * d + k0;
        return reasoned(
          oneOf(
            rng,
            t(
              `Suppose $${d} \\mid ${v}$. Which expression is ${never ? "never" : "always"} divisible by $${d}$?`,
              `设 $${d} \\mid ${v}$。哪个表达式${never ? "永远不能" : "总能"}被 $${d}$ 整除？`,
            ),
            math(tex(a0, k0)),
            rest.map(([s]) => math(s)),
            walked(
              [
                [
                  ["The variable term", "变量项"],
                  t(
                    `Since $${d} \\mid ${v}$, $${d}$ divides $a${v}$ for every coefficient $a$, so $${d}$ divides $a${v} + c$ exactly when $${d} \\mid c$.`,
                    `因为 $${d} \\mid ${v}$，不论系数 $a$ 是多少，$${d}$ 都整除 $a${v}$，所以 $${d}$ 整除 $a${v} + c$ 当且仅当 $${d} \\mid c$。`,
                  ),
                ],
                [
                  ["The constants", "常数"],
                  never
                    ? t(
                        `Only $${k0}$ is not a multiple of $${d}$, so $${tex(a0, k0)}$ is never divisible by $${d}$: if it were, $${d}$ would divide $${k0} = (${tex(a0, k0)}) - ${term(a0, v)}$.`,
                        `只有 $${k0}$ 不是 $${d}$ 的倍数，所以 $${tex(a0, k0)}$ 永远不能被 $${d}$ 整除：否则 $${d}$ 将整除 $${k0} = (${tex(a0, k0)}) - ${term(a0, v)}$。`,
                      )
                    : t(
                        `Only $${k0}$ is a multiple of $${d}$, so $${tex(a0, k0)}$ is always divisible by $${d}$.`,
                        `只有 $${k0}$ 是 $${d}$ 的倍数，所以 $${tex(a0, k0)}$ 总能被 $${d}$ 整除。`,
                      ),
                ],
              ],
              t(
                `At $${v} = ${d}$, $${tex(a0, k0)} = ${value} = ${d} \\cdot ${Math.floor(value / d)}${value % d === 0 ? "" : ` + ${value % d}`}$.`,
                `$${v} = ${d}$ 时，$${tex(a0, k0)} = ${value} = ${d} \\cdot ${Math.floor(value / d)}${value % d === 0 ? "" : ` + ${value % d}`}$。`,
              ),
            ),
          ),
          rest.map(
            ([s, k]): Reason =>
              never
                ? [
                    `$${s}$`,
                    `$${k}$ is a multiple of $${d}$, so this one is always divisible by $${d}$.`,
                    `$${k}$ 是 $${d}$ 的倍数，所以这个表达式总能被 $${d}$ 整除。`,
                  ]
                : [
                    `$${s}$`,
                    `$${k}$ leaves remainder $${k % d}$ on division by $${d}$, so this one is never divisible by $${d}$.`,
                    `$${k}$ 除以 $${d}$ 余 $${k % d}$，所以这个表达式永远不能被 $${d}$ 整除。`,
                  ],
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
