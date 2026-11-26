import type { Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, Q } from "@ga/subject-math";

import { numberProblem, why } from "../problems.ts";
import { walked } from "./calculus-i-differentiation.ts";
import { range } from "./methods-of-proof-common.ts";

// Discrete Mathematics unit 5: finite power sums, the generalized binomial theorem and the multinomial theorem.

/** fact is n factorial. */
const fact = (n: number): number => (n <= 1 ? 1 : n * fact(n - 1));

/** choose is the binomial coefficient n choose k. */
function choose(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return r;
}

/** asQ turns a number into a rational. */
const asQ = (v: number | Q): Q => (typeof v === "number" ? Q.of(v) : v);

/** distinct drops the mistakes whose value is the answer or repeats an earlier one. */
function distinct<M extends { readonly value: number | Q }>(answer: number | Q, mistakes: readonly M[]): M[] {
  return mistakes.filter((m, i, all) => !asQ(m.value).eq(asQ(answer)) && all.findIndex((x) => asQ(x.value).eq(asQ(m.value))) === i);
}

/** s1 is 1 + 2 + ⋯ + n. */
const s1 = (n: number) => (n * (n + 1)) / 2;

/** s2 is 1² + 2² + ⋯ + n². */
const s2 = (n: number) => (n * (n + 1) * (2 * n + 1)) / 6;

/** s3 is 1³ + 2³ + ⋯ + n³. */
const s3 = (n: number) => s1(n) ** 2;

/** brute sums f(k) for k from m to n. */
const brute = (m: number, n: number, f: (k: number) => number) => range(m, n).reduce((s, k) => s + f(k), 0);

/** coef writes a coefficient in front of a term: 1 and −1 lose the digit. */
const coef = (a: number, term: string, first: boolean) => {
  const sign = a < 0 ? (first ? "-" : " - ") : first ? "" : " + ";
  const abs = Math.abs(a);
  return `${sign}${abs === 1 && term ? "" : abs}${term}`;
};

/** poly writes a polynomial in k from (coefficient, term) pairs, skipping zeros. */
const poly = (pairs: readonly (readonly [number, string])[]) =>
  pairs
    .filter(([a]) => a !== 0)
    .map(([a, term], i) => coef(a, term, i === 0))
    .join("");

/** pq writes a rational, in parentheses when negative. */
const pq = (q: Q) => (q.sign() < 0 ? `\\left(${q.toLatex()}\\right)` : q.toLatex());

/** pn writes an integer, in parentheses when negative. */
const pn = (n: number) => (n < 0 ? `(${n})` : `${n}`);

/** qx writes q·x, dropping a coefficient of 1. */
const qx = (q: Q) => (q.eq(Q.of(1)) ? "x" : q.eq(Q.of(-1)) ? "-x" : `${q.toLatex()}x`);

/** xk writes xᵏ. */
const xk = (k: number) => (k === 1 ? "x" : `x^{${k}}`);

/** sumTex writes Σ from m to n of a summand. */
const sumTex = (m: number, n: number, body: string) => `\\sum_{k=${m}}^{${n}} ${body}`;

/** mul writes a times a factor, dropping a coefficient of 1 or −1 to a sign. */
const mul = (a: number, x: string | number) => (a === 1 ? `${x}` : a === -1 ? `-${x}` : `${a} \\cdot ${x}`);

/** combo writes a₁x₁ ± a₂x₂ ± ⋯ with products shown by mul, skipping zero coefficients. */
const combo = (pairs: readonly (readonly [number, string | number])[]) =>
  pairs
    .filter(([a]) => a !== 0)
    .map(([a, x], i) => (i === 0 ? mul(a, x) : ` ${a < 0 ? "-" : "+"} ${mul(Math.abs(a), x)}`))
    .join("");

/** finiteLinearSeries sums linear expressions with Σk = n(n + 1)/2. */
export const finiteLinearSeries: TopicDef = {
  id: "finite-linear-series",
  title: t("Finite Linear Series", "有限线性级数"),
  summary: t(
    "1 + 2 + ⋯ + n = n(n + 1)/2, so Σₖ₌₁ⁿ (ak + b) = a·n(n + 1)/2 + bn; a sum starting at m is the sum to n minus the sum to m − 1.",
    "1 + 2 + ⋯ + n = n(n + 1)/2，所以 Σₖ₌₁ⁿ (ak + b) = a·n(n + 1)/2 + bn；从 m 开始的和等于到 n 的和减去到 m − 1 的和。",
  ),
  intro: t(
    "$1 + 2 + \\cdots + 8 = \\frac{8 \\cdot 9}{2} = 36$: writing the sum forwards and backwards gives $8$ columns that each add to $9$, which is twice the sum.\n\nCheck: the pairs $1 + 8$, $2 + 7$, $3 + 6$ and $4 + 5$ each make $9$, and $4 \\cdot 9 = 36$.\n\nIn this lesson we use $\\sum_{k=1}^{n} k = \\frac{n(n + 1)}{2}$ to add up linear expressions, including sums that do not start at $1$.",
    "$1 + 2 + \\cdots + 8 = \\frac{8 \\cdot 9}{2} = 36$：把这个和正着写一遍、倒着写一遍，得到 $8$ 列，每列之和都是 $9$，合起来是和的两倍。\n\n检验：$1 + 8$、$2 + 7$、$3 + 6$ 和 $4 + 5$ 每对都是 $9$，而 $4 \\cdot 9 = 36$。\n\n本课我们用 $\\sum_{k=1}^{n} k = \\frac{n(n + 1)}{2}$ 求线性式之和，包括不从 $1$ 开始的和。",
  ),
  prerequisites: ["properties-of-finite-series"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "sums-of-linear-expressions",
      title: t("Sums of linear expressions", "线性式的和"),
      explanation: t(
        "Split the sum into a multiple of the sum of the first integers and a constant added once for every term. $\\sum_{k=1}^{100} (3k - 2) = 3\\sum_{k=1}^{100} k - 2 \\cdot 100 = 3 \\cdot \\frac{100 \\cdot 101}{2} - 200 = 14950$.\n\n> **Watch out.** The constant is added $n$ times, not once; and $\\sum_{k=1}^{n} k$ is $\\frac{n(n + 1)}{2}$, not $n^2$ or $\\frac{n(n - 1)}{2}$.",
        "把和拆成前若干个整数之和的倍数，加上每一项都加一次的常数。$\\sum_{k=1}^{100} (3k - 2) = 3\\sum_{k=1}^{100} k - 2 \\cdot 100 = 3 \\cdot \\frac{100 \\cdot 101}{2} - 200 = 14950$。\n\n> **注意。** 常数要加 $n$ 次，而不是一次；$\\sum_{k=1}^{n} k$ 是 $\\frac{n(n + 1)}{2}$，不是 $n^2$ 或 $\\frac{n(n - 1)}{2}$。",
      ),
      generate(rng) {
        const a = rng.nonZero(-6, 9);
        const b = rng.nonZero(-9, 9);
        const n = rng.int(10, 60);
        const value = a * s1(n) + b * n;
        const body = `(${poly([
          [a, "k"],
          [b, ""],
        ])})`;
        const first = a + b;
        const last = a * n + b;
        return numberProblem({
          prompt: t(`Evaluate $${sumTex(1, n, body)}$.`, `计算 $${sumTex(1, n, body)}$。`),
          answer: value,
          mistakes: distinct(value, [
            why(
              a * s1(n) + b,
              `That adds the constant once; it is added for each of the $${n}$ terms.`,
              `那是只加了一次常数；$${n}$ 项中每一项都要加。`,
            ),
            why(
              a * s1(n - 1) + b * n,
              "That uses $\\frac{n(n - 1)}{2}$ for $\\sum k$, which stops one term short.",
              "那是把 $\\sum k$ 当成 $\\frac{n(n - 1)}{2}$，少了一项。",
            ),
            why(
              a * n * n + b * n,
              "That uses $n^2$ for $\\sum k$; the sum of the first $n$ integers is $\\frac{n(n + 1)}{2}$.",
              "那是把 $\\sum k$ 当成 $n^2$；前 $n$ 个整数之和是 $\\frac{n(n + 1)}{2}$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Split the sum", "拆分和式"],
                t(
                  `$${sumTex(1, n, body)} = ${combo([
                    [a, "\\sum k"],
                    [b, n],
                  ])}$.`,
                  `$${sumTex(1, n, body)} = ${combo([
                    [a, "\\sum k"],
                    [b, n],
                  ])}$。`,
                ),
              ],
              [
                ["Use the formula", "用公式"],
                t(
                  `$\\sum k = \\frac{${n} \\cdot ${n + 1}}{2} = ${s1(n)}$, so the sum is $${combo([
                    [a, s1(n)],
                    [b, n],
                  ])} = ${value}$.`,
                  `$\\sum k = \\frac{${n} \\cdot ${n + 1}}{2} = ${s1(n)}$，所以和为 $${combo([
                    [a, s1(n)],
                    [b, n],
                  ])} = ${value}$。`,
                ),
              ],
            ],
            t(
              `The terms go up evenly from $${first}$ to $${last}$, so the sum is the number of terms times their average: $${n} \\cdot \\frac{${first} + ${pn(last)}}{2} = ${value}$.`,
              `各项从 $${first}$ 均匀变到 $${last}$，所以和等于项数乘以平均值：$${n} \\cdot \\frac{${first} + ${pn(last)}}{2} = ${value}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "linear-sums-with-a-shifted-start",
      title: t("Sums not starting at 1", "不从 1 开始的和"),
      explanation: t(
        "A sum that starts later is the full sum up to the end minus the full sum up to just before the start. $\\sum_{k=41}^{100} k = \\sum_{k=1}^{100} k - \\sum_{k=1}^{40} k = 5050 - 820 = 4230$.\n\n> **Watch out.** Subtract the sum up to $m - 1$, not up to $m$, or the first term is lost; and a sum from $m$ to $n$ has $n - m + 1$ terms.",
        "从较后位置开始的和，等于到末项的完整和减去到起点前一项的完整和。$\\sum_{k=41}^{100} k = \\sum_{k=1}^{100} k - \\sum_{k=1}^{40} k = 5050 - 820 = 4230$。\n\n> **注意。** 要减去到 $m - 1$ 的和，而不是到 $m$ 的和，否则会丢掉第一项；从 $m$ 到 $n$ 的和有 $n - m + 1$ 项。",
      ),
      generate(rng) {
        const m = rng.int(5, 30);
        const n = m + rng.int(5, 50);
        const a = rng.int(1, 5);
        const b = rng.int(-5, 5);
        const f = (k: number) => a * k + b;
        const value = brute(m, n, f);
        const body =
          b === 0 && a === 1
            ? "k"
            : `(${poly([
                [a, "k"],
                [b, ""],
              ])})`;
        return numberProblem({
          prompt: t(`Evaluate $${sumTex(m, n, body)}$.`, `计算 $${sumTex(m, n, body)}$。`),
          answer: value,
          mistakes: distinct(value, [
            why(
              brute(m + 1, n, f),
              `That subtracts the sum up to $${m}$, which removes the first term $k = ${m}$ as well.`,
              `那是减去了到 $${m}$ 的和，把第一项 $k = ${m}$ 也去掉了。`,
            ),
            why(
              brute(1, n, f),
              "That is the whole sum from $k = 1$; subtract the terms before the start.",
              "那是从 $k = 1$ 开始的全部和；还要减去起点之前的项。",
            ),
            why(
              brute(m, n - 1, f),
              "That stops one term early; the last term $k = n$ is included.",
              "那是提前一项停止了；最后一项 $k = n$ 也要算。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Write it as a difference", "写成差"],
                t(
                  `$${sumTex(m, n, body)} = ${sumTex(1, n, body)} - ${sumTex(1, m - 1, body)}$.`,
                  `$${sumTex(m, n, body)} = ${sumTex(1, n, body)} - ${sumTex(1, m - 1, body)}$。`,
                ),
              ],
              [
                ["Evaluate both", "分别计算"],
                t(
                  `$${brute(1, n, f)} - ${pn(brute(1, m - 1, f))} = ${value}$.`,
                  `$${brute(1, n, f)} - ${pn(brute(1, m - 1, f))} = ${value}$。`,
                ),
              ],
            ],
            t(
              `There are $${n - m + 1}$ terms, from $${f(m)}$ to $${f(n)}$, so the sum is $${n - m + 1} \\cdot \\frac{${f(m)} + ${f(n)}}{2} = ${value}$.`,
              `共有 $${n - m + 1}$ 项，从 $${f(m)}$ 到 $${f(n)}$，所以和为 $${n - m + 1} \\cdot \\frac{${f(m)} + ${f(n)}}{2} = ${value}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** finiteQuadraticSeries sums quadratics with Σk² = n(n + 1)(2n + 1)/6. */
export const finiteQuadraticSeries: TopicDef = {
  id: "finite-quadratic-series",
  title: t("Finite Quadratic Series", "有限二次级数"),
  summary: t(
    "1² + 2² + ⋯ + n² = n(n + 1)(2n + 1)/6; with linearity, this sums any quadratic in k.",
    "1² + 2² + ⋯ + n² = n(n + 1)(2n + 1)/6；结合线性性，可以求任意关于 k 的二次式之和。",
  ),
  intro: t(
    "$1^2 + 2^2 + 3^2 + 4^2 + 5^2 = \\frac{5 \\cdot 6 \\cdot 11}{6} = 55$, by the formula $\\sum_{k=1}^{n} k^2 = \\frac{n(n + 1)(2n + 1)}{6}$.\n\nCheck: $1 + 4 + 9 + 16 + 25 = 55$.\n\nIn this lesson we sum squares, and with linearity any quadratic expression in $k$, over a range of $k$.",
    "$1^2 + 2^2 + 3^2 + 4^2 + 5^2 = \\frac{5 \\cdot 6 \\cdot 11}{6} = 55$，用的是公式 $\\sum_{k=1}^{n} k^2 = \\frac{n(n + 1)(2n + 1)}{6}$。\n\n检验：$1 + 4 + 9 + 16 + 25 = 55$。\n\n本课我们求平方和，并借助线性性求任意关于 $k$ 的二次式在某个范围内的和。",
  ),
  prerequisites: ["finite-linear-series"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "sums-of-quadratic-expressions",
      title: t("Sums of quadratic expressions", "二次式的和"),
      explanation: t(
        "Split the expression into its square, linear and constant parts, and use the known formula for each kind of sum. $\\sum_{k=1}^{40} (k^2 + 2k) = \\frac{40 \\cdot 41 \\cdot 81}{6} + 2 \\cdot \\frac{40 \\cdot 41}{2} = 22140 + 1640 = 23780$.\n\n> **Watch out.** $\\sum k^2$ is not $\\left(\\sum k\\right)^2$, which is the sum of cubes; and a constant term is added $n$ times.",
        "把表达式拆成平方项、一次项和常数项，对每一类和使用已知公式。$\\sum_{k=1}^{40} (k^2 + 2k) = \\frac{40 \\cdot 41 \\cdot 81}{6} + 2 \\cdot \\frac{40 \\cdot 41}{2} = 22140 + 1640 = 23780$。\n\n> **注意。** $\\sum k^2$ 不是 $\\left(\\sum k\\right)^2$，后者是立方和；常数项要加 $n$ 次。",
      ),
      generate(rng) {
        const a = rng.nonZero(-3, 4);
        const b = rng.int(-6, 6);
        const c = rng.int(-9, 9);
        const n = rng.int(6, 30);
        const value = a * s2(n) + b * s1(n) + c * n;
        const body = `(${poly([
          [a, "k^2"],
          [b, "k"],
          [c, ""],
        ])})`;
        const third = (n * (n + 1) * (n + 2)) / 3;
        return numberProblem({
          prompt: t(`Evaluate $${sumTex(1, n, body)}$.`, `计算 $${sumTex(1, n, body)}$。`),
          answer: value,
          mistakes: distinct(value, [
            why(
              a * s1(n) ** 2 + b * s1(n) + c * n,
              "That uses $\\left(\\sum k\\right)^2$ for $\\sum k^2$; that square is the sum of cubes.",
              "那是把 $\\sum k^2$ 当成 $\\left(\\sum k\\right)^2$；后者是立方和。",
            ),
            why(
              a * s2(n) + b * s1(n) + c,
              `That adds the constant once; it is added for each of the $${n}$ terms.`,
              `那是只加了一次常数；$${n}$ 项中每一项都要加。`,
            ),
            why(a * n * n + b * n + c, "That is only the last term, not the sum.", "那只是最后一项，不是和。"),
            why(
              a * ((n * (n + 1) * (n + 2)) / 6) + b * s1(n) + c * n,
              "That uses $\\frac{n(n + 1)(n + 2)}{6}$ for $\\sum k^2$; the last factor is $2n + 1$.",
              "那是把 $\\sum k^2$ 当成 $\\frac{n(n + 1)(n + 2)}{6}$；最后一个因子是 $2n + 1$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Use the formulas", "用公式"],
                t(
                  `$\\sum k^2 = \\frac{${n} \\cdot ${n + 1} \\cdot ${2 * n + 1}}{6} = ${s2(n)}$ and $\\sum k = ${s1(n)}$.`,
                  `$\\sum k^2 = \\frac{${n} \\cdot ${n + 1} \\cdot ${2 * n + 1}}{6} = ${s2(n)}$，$\\sum k = ${s1(n)}$。`,
                ),
              ],
              [
                ["Combine", "合并"],
                t(
                  `$${combo([
                    [a, s2(n)],
                    [b, s1(n)],
                    [c, n],
                  ])} = ${value}$.`,
                  `$${combo([
                    [a, s2(n)],
                    [b, s1(n)],
                    [c, n],
                  ])} = ${value}$。`,
                ),
              ],
            ],
            t(
              `Since $k^2 = k(k + 1) - k$, $\\sum k^2 = \\frac{${n} \\cdot ${n + 1} \\cdot ${n + 2}}{3} - ${s1(n)} = ${third} - ${s1(n)} = ${s2(n)}$, as used.`,
              `由 $k^2 = k(k + 1) - k$，$\\sum k^2 = \\frac{${n} \\cdot ${n + 1} \\cdot ${n + 2}}{3} - ${s1(n)} = ${third} - ${s1(n)} = ${s2(n)}$，与所用的一致。`,
            ),
          ),
        });
      },
    },
    {
      id: "sums-of-squares-in-a-range",
      title: t("Sums of squares in a range", "某范围内的平方和"),
      explanation: t(
        "Subtract the sum of squares up to just before the start from the sum of squares up to the end. $31^2 + 32^2 + \\cdots + 40^2 = \\sum_{k=1}^{40} k^2 - \\sum_{k=1}^{30} k^2 = 22140 - 9455 = 12685$. For odd squares, expand $(2k - 1)^2 = 4k^2 - 4k + 1$ first.\n\n> **Watch out.** Subtract up to $m - 1$, not $m$; and the sum of the squares is not the square of the sum.",
        "用到末项的平方和减去到起点前一项的平方和。$31^2 + 32^2 + \\cdots + 40^2 = \\sum_{k=1}^{40} k^2 - \\sum_{k=1}^{30} k^2 = 22140 - 9455 = 12685$。求奇数的平方和时，先展开 $(2k - 1)^2 = 4k^2 - 4k + 1$。\n\n> **注意。** 要减去到 $m - 1$ 的和，而不是到 $m$ 的；平方和不是和的平方。",
      ),
      generate(rng) {
        const m = rng.int(3, 20);
        const n = m + rng.int(4, 25);
        const value = s2(n) - s2(m - 1);
        const odd = rng.bool(0.3);
        if (odd) {
          const N = rng.int(5, 25);
          const v = brute(1, N, (k) => (2 * k - 1) ** 2);
          return numberProblem({
            prompt: t(`Evaluate $1^2 + 3^2 + 5^2 + \\cdots + ${2 * N - 1}^2$.`, `计算 $1^2 + 3^2 + 5^2 + \\cdots + ${2 * N - 1}^2$。`),
            answer: v,
            mistakes: distinct(v, [
              why(
                Math.round(s2(2 * N - 1) / 2),
                "That takes half of all the squares, but the odd squares are not half of them.",
                "那是取了全部平方和的一半，但奇数的平方和并不是一半。",
              ),
              why(
                s2(2 * N - 1) - s2(N),
                "That subtracts the first squares; the squares to remove are the even ones.",
                "那是减去了前几个平方；要去掉的是偶数的平方。",
              ),
              why(
                4 * s2(N) - s1(N) + N,
                "That uses $-\\sum k$ for the middle part; $(2k - 1)^2$ has $-4k$.",
                "那是中间部分用了 $-\\sum k$；$(2k - 1)^2$ 中是 $-4k$。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Write the terms", "写出通项"],
                  t(
                    `The terms are $(2k - 1)^2 = 4k^2 - 4k + 1$ for $k = 1, \\dots, ${N}$.`,
                    `各项为 $(2k - 1)^2 = 4k^2 - 4k + 1$，$k = 1, \\dots, ${N}$。`,
                  ),
                ],
                [
                  ["Sum each part", "逐部分求和"],
                  t(`$4 \\cdot ${s2(N)} - 4 \\cdot ${s1(N)} + ${N} = ${v}$.`, `$4 \\cdot ${s2(N)} - 4 \\cdot ${s1(N)} + ${N} = ${v}$。`),
                ],
              ],
              t(
                `All squares up to $${2 * N}^2$ minus the even ones $4\\sum_{k=1}^{${N}} k^2$: $${s2(2 * N)} - 4 \\cdot ${s2(N)} = ${v}$.`,
                `到 $${2 * N}^2$ 的全部平方和减去偶数的平方和 $4\\sum_{k=1}^{${N}} k^2$：$${s2(2 * N)} - 4 \\cdot ${s2(N)} = ${v}$。`,
              ),
            ),
          });
        }
        const L = n - m;
        return numberProblem({
          prompt: t(`Evaluate $${sumTex(m, n, "k^2")}$.`, `计算 $${sumTex(m, n, "k^2")}$。`),
          answer: value,
          mistakes: distinct(value, [
            why(
              s2(n) - s2(m),
              `That subtracts the squares up to $${m}$, which removes $${m}^2$ as well.`,
              `那是减去了到 $${m}$ 的平方和，把 $${m}^2$ 也去掉了。`,
            ),
            why(
              s2(n - m + 1),
              "That sums the squares of $1$ to the number of terms, not of the actual values.",
              "那是对 $1$ 到项数求平方和，而不是对实际的数。",
            ),
            why(
              s2(n),
              "That is the whole sum from $k = 1$; subtract the squares before the start.",
              "那是从 $k = 1$ 开始的全部平方和；还要减去起点之前的平方。",
            ),
            why(
              (s1(n) - s1(m - 1)) ** 2,
              "That squares the sum of the numbers; the sum of squares is smaller.",
              "那是对这些数之和取平方；平方和比它小。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Write it as a difference", "写成差"],
                t(`$${sumTex(1, n, "k^2")} - ${sumTex(1, m - 1, "k^2")}$.`, `$${sumTex(1, n, "k^2")} - ${sumTex(1, m - 1, "k^2")}$。`),
              ],
              [["Evaluate both", "分别计算"], t(`$${s2(n)} - ${s2(m - 1)} = ${value}$.`, `$${s2(n)} - ${s2(m - 1)} = ${value}$。`)],
            ],
            t(
              `Writing $k = ${m} + j$ for $j = 0, \\dots, ${L}$: $\\sum (${m} + j)^2 = ${L + 1} \\cdot ${m * m} + ${2 * m} \\cdot ${s1(L)} + ${s2(L)} = ${value}$.`,
              `令 $k = ${m} + j$，$j = 0, \\dots, ${L}$：$\\sum (${m} + j)^2 = ${L + 1} \\cdot ${m * m} + ${2 * m} \\cdot ${s1(L)} + ${s2(L)} = ${value}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** finiteCubicSeries sums cubics with Σk³ = (n(n + 1)/2)². */
export const finiteCubicSeries: TopicDef = {
  id: "finite-cubic-series",
  title: t("Finite Cubic Series", "有限三次级数"),
  summary: t(
    "1³ + 2³ + ⋯ + n³ = (n(n + 1)/2)², the square of 1 + 2 + ⋯ + n; with Σk² and Σk, this sums any cubic in k.",
    "1³ + 2³ + ⋯ + n³ = (n(n + 1)/2)²，正是 1 + 2 + ⋯ + n 的平方；结合 Σk² 与 Σk，可以求任意关于 k 的三次式之和。",
  ),
  intro: t(
    "$1^3 + 2^3 + 3^3 + 4^3 = \\left(\\frac{4 \\cdot 5}{2}\\right)^2 = 10^2 = 100$: the sum of the first cubes is the square of the sum of the first integers.\n\nCheck: $1 + 8 + 27 + 64 = 100$.\n\nIn this lesson we sum cubes, and by expanding first, any cubic expression in $k$.",
    "$1^3 + 2^3 + 3^3 + 4^3 = \\left(\\frac{4 \\cdot 5}{2}\\right)^2 = 10^2 = 100$：前若干个立方数之和等于前若干个整数之和的平方。\n\n检验：$1 + 8 + 27 + 64 = 100$。\n\n本课我们求立方和，并通过先展开求任意关于 $k$ 的三次式之和。",
  ),
  prerequisites: ["finite-quadratic-series"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "sums-of-cubes",
      title: t("Sums of cubes", "立方和"),
      explanation: t(
        "The sum of the first cubes is the square of the sum of the first integers, a surprising and useful identity. $\\sum_{k=1}^{30} k^3 = \\left(\\frac{30 \\cdot 31}{2}\\right)^2 = 465^2 = 216225$, and $\\sum_{k=21}^{30} k^3 = 216225 - 210^2 = 172125$.\n\n> **Watch out.** The sum of cubes is the square of $\\sum k$, not its cube; and for a range, subtract up to $m - 1$, not $m$.",
        "前若干个立方数之和等于前若干个整数之和的平方，这是一个令人惊讶又很有用的恒等式。$\\sum_{k=1}^{30} k^3 = \\left(\\frac{30 \\cdot 31}{2}\\right)^2 = 465^2 = 216225$，$\\sum_{k=21}^{30} k^3 = 216225 - 210^2 = 172125$。\n\n> **注意。** 立方和是 $\\sum k$ 的平方，不是立方；求某范围内的和时，要减去到 $m - 1$ 的和，而不是到 $m$ 的。",
      ),
      generate(rng) {
        const m = rng.bool() ? 1 : rng.int(3, 12);
        const n = m + rng.int(4, 20);
        const value = s3(n) - s3(m - 1);
        return numberProblem({
          prompt: t(`Evaluate $${sumTex(m, n, "k^3")}$.`, `计算 $${sumTex(m, n, "k^3")}$。`),
          answer: value,
          mistakes: distinct(value, [
            why(
              s3(n) - s3(m),
              `That subtracts the cubes up to $${m}$, which removes $${m}^3$ as well.`,
              `那是减去了到 $${m}$ 的立方和，把 $${m}^3$ 也去掉了。`,
            ),
            why(s1(n) ** 3, "That cubes $\\sum k$; the sum of cubes is its square.", "那是对 $\\sum k$ 取立方；立方和是它的平方。"),
            why(
              s2(n) * s1(n),
              "That multiplies $\\sum k^2$ by $\\sum k$, which is not the sum of the products.",
              "那是把 $\\sum k^2$ 乘以 $\\sum k$，这不是乘积之和。",
            ),
            ...(m === 1
              ? []
              : [
                  why(
                    s3(n),
                    "That is the whole sum from $k = 1$; subtract the cubes before the start.",
                    "那是从 $k = 1$ 开始的全部立方和；还要减去起点之前的立方。",
                  ),
                ]),
          ]),
          solution:
            m === 1
              ? walked(
                  [
                    [
                      ["Sum the integers", "求整数和"],
                      t(`$\\frac{${n} \\cdot ${n + 1}}{2} = ${s1(n)}$.`, `$\\frac{${n} \\cdot ${n + 1}}{2} = ${s1(n)}$。`),
                    ],
                    [["Square it", "平方"], t(`$${s1(n)}^2 = ${value}$.`, `$${s1(n)}^2 = ${value}$。`)],
                  ],
                  t(
                    `Without the last term the sum is $${s1(n - 1)}^2 = ${s3(n - 1)}$, and adding $${n}^3 = ${n ** 3}$ gives $${value}$.`,
                    `去掉最后一项，和为 $${s1(n - 1)}^2 = ${s3(n - 1)}$，加上 $${n}^3 = ${n ** 3}$ 得 $${value}$。`,
                  ),
                )
              : walked(
                  [
                    [
                      ["Write it as a difference", "写成差"],
                      t(
                        `$${sumTex(1, n, "k^3")} - ${sumTex(1, m - 1, "k^3")}$.`,
                        `$${sumTex(1, n, "k^3")} - ${sumTex(1, m - 1, "k^3")}$。`,
                      ),
                    ],
                    [
                      ["Square the integer sums", "整数和平方"],
                      t(
                        `$${s1(n)}^2 - ${s1(m - 1)}^2 = ${s3(n)} - ${s3(m - 1)} = ${value}$.`,
                        `$${s1(n)}^2 - ${s1(m - 1)}^2 = ${s3(n)} - ${s3(m - 1)} = ${value}$。`,
                      ),
                    ],
                  ],
                  t(
                    `As a difference of squares, $(${s1(n)} - ${s1(m - 1)})(${s1(n)} + ${s1(m - 1)}) = ${s1(n) - s1(m - 1)} \\cdot ${s1(n) + s1(m - 1)} = ${value}$.`,
                    `用平方差公式，$(${s1(n)} - ${s1(m - 1)})(${s1(n)} + ${s1(m - 1)}) = ${s1(n) - s1(m - 1)} \\cdot ${s1(n) + s1(m - 1)} = ${value}$。`,
                  ),
                ),
        });
      },
    },
    {
      id: "sums-of-cubic-expressions",
      title: t("Sums of cubic expressions", "三次式的和"),
      explanation: t(
        "Expand the expression into powers of the index first, then apply the formulas for sums of cubes, squares and integers. Expand first: $\\sum_{k=1}^{n} k(k + 1)^2 = \\sum (k^3 + 2k^2 + k)$. For $n = 30$: $216225 + 2 \\cdot 9455 + 465 = 235600$.\n\n> **Watch out.** Expand before summing: the sum of a product is not the product of the sums; and keep every power, the linear part included.",
        "先把表达式展开成下标的各次幂，再分别用立方和、平方和与整数和的公式。先展开：$\\sum_{k=1}^{n} k(k + 1)^2 = \\sum (k^3 + 2k^2 + k)$。$n = 30$ 时：$216225 + 2 \\cdot 9455 + 465 = 235600$。\n\n> **注意。** 先展开再求和：乘积之和不等于和之积；每一次幂都要保留，包括一次项。",
      ),
      generate(rng) {
        const n = rng.int(5, 20);
        const kind = rng.int(0, 2);
        const c = rng.int(1, 4);
        const f = [(k: number) => k * (k + c) ** 2, (k: number) => k * k * (k - c), (k: number) => k * (k + 1) * (k + c)][kind]!;
        const body = [`k(k + ${c})^2`, `k^2(k - ${c})`, `k(k + 1)(k + ${c})`][kind]!;
        const expanded = [
          poly([
            [1, "k^3"],
            [2 * c, "k^2"],
            [c * c, "k"],
          ]),
          poly([
            [1, "k^3"],
            [-c, "k^2"],
          ]),
          poly([
            [1, "k^3"],
            [c + 1, "k^2"],
            [c, "k"],
          ]),
        ][kind]!;
        const coeffs = [
          [1, 2 * c, c * c],
          [1, -c, 0],
          [1, c + 1, c],
        ][kind]!;
        const value = brute(1, n, f);
        const small = brute(1, 3, f);
        return numberProblem({
          prompt: t(`Evaluate $${sumTex(1, n, body)}$.`, `计算 $${sumTex(1, n, body)}$。`),
          answer: value,
          mistakes: distinct(value, [
            why(s3(n) + coeffs[1]! * s2(n), "That drops the linear part of the expansion.", "那是丢掉了展开式中的一次项。"),
            why(
              s1(n) * f(n),
              "That multiplies $\\sum k$ by the last term; a sum of products is not found that way.",
              "那是把 $\\sum k$ 乘以最后一项；乘积之和不能这样求。",
            ),
            why(s3(n), "That keeps only the cubes and drops the other powers.", "那是只保留了立方项，丢掉了其他次幂。"),
            why(
              value - coeffs[2]! * s1(n) + coeffs[2]!,
              "That adds the coefficient of $k$ once instead of multiplying it by $\\sum k$.",
              "那是只加了一次 $k$ 的系数，而没有乘以 $\\sum k$。",
            ),
          ]),
          solution: walked(
            [
              [["Expand", "展开"], t(`$${body} = ${expanded}$.`, `$${body} = ${expanded}$。`)],
              [
                ["Sum each power", "逐次幂求和"],
                t(
                  `$\\sum k^3 = ${s3(n)}$, $\\sum k^2 = ${s2(n)}$, $\\sum k = ${s1(n)}$, so the sum is $${combo([
                    [1, s3(n)],
                    [coeffs[1]!, s2(n)],
                    [coeffs[2]!, s1(n)],
                  ])} = ${value}$.`,
                  `$\\sum k^3 = ${s3(n)}$，$\\sum k^2 = ${s2(n)}$，$\\sum k = ${s1(n)}$，所以和为 $${combo([
                    [1, s3(n)],
                    [coeffs[1]!, s2(n)],
                    [coeffs[2]!, s1(n)],
                  ])} = ${value}$。`,
                ),
              ],
            ],
            t(
              `The same method for $n = 3$ gives $${combo([
                [1, 36],
                [coeffs[1]!, 14],
                [coeffs[2]!, 6],
              ])} = ${small}$, which matches $${[1, 2, 3].map((k) => pn(f(k))).join(" + ")} = ${small}$.`,
              `同样的方法对 $n = 3$ 得 $${combo([
                [1, 36],
                [coeffs[1]!, 14],
                [coeffs[2]!, 6],
              ])} = ${small}$，与 $${[1, 2, 3].map((k) => pn(f(k))).join(" + ")} = ${small}$ 一致。`,
            ),
          ),
        });
      },
    },
  ],
};

/** genChoose is the generalized binomial coefficient r(r − 1)⋯(r − k + 1)/k!. */
const genChoose = (r: Q, k: number) =>
  range(0, k - 1)
    .reduce((s, i) => s.mul(r.sub(Q.of(i))), Q.of(1))
    .div(Q.of(fact(k)));

/** EXPONENTS are non-natural exponents for generalized expansions. */
const EXPONENTS: readonly Q[] = [
  Q.of(-1),
  Q.of(-2),
  Q.of(-3),
  Q.of(1, 2),
  Q.of(-1, 2),
  Q.of(3, 2),
  Q.of(1, 3),
  Q.of(-1, 3),
  Q.of(2, 3),
  Q.of(1, 4),
];

/** rTex writes an exponent. */
const rTex = (r: Q) => `{${r.toLatex()}}`;

/** factorsTex writes r(r − 1)⋯(r − k + 1) with each factor in parentheses. */
const factorsTex = (r: Q, k: number) =>
  range(0, k - 1)
    .map((i) => `\\left(${r.sub(Q.of(i)).toLatex()}\\right)`)
    .join("");

/** qmul writes the product of two rationals, dropping a factor of 1 or −1 to a sign. */
const qmul = (a: Q, b: Q) =>
  a.eq(Q.of(1))
    ? pq(b)
    : a.eq(Q.of(-1))
      ? `-${pq(b)}`
      : b.eq(Q.of(1))
        ? a.toLatex()
        : b.eq(Q.of(-1))
          ? `-${pq(a)}`
          : `${pq(a)} \\cdot ${pq(b)}`;

/** theGeneralizedBinomialTheorem expands (1 + x)ʳ for any rational r. */
export const theGeneralizedBinomialTheorem: TopicDef = {
  id: "the-generalized-binomial-theorem",
  title: t("The Generalized Binomial Theorem", "广义二项式定理"),
  summary: t(
    "For any real r and |x| < 1, (1 + x)ʳ = Σₖ C(r, k) xᵏ, where C(r, k) = r(r − 1)⋯(r − k + 1)/k!. Unless r is a natural number, the series never ends.",
    "对任意实数 r 和 |x| < 1，(1 + x)ʳ = Σₖ C(r, k) xᵏ，其中 C(r, k) = r(r − 1)⋯(r − k + 1)/k!。除非 r 是自然数，否则级数不会终止。",
  ),
  intro: t(
    "With $r = -4$, the coefficients are $\\binom{-4}{1} = -4$, $\\binom{-4}{2} = \\frac{(-4)(-5)}{2!} = 10$ and $\\binom{-4}{3} = \\frac{(-4)(-5)(-6)}{3!} = -20$, so $(1 + x)^{-4} = 1 - 4x + 10x^2 - 20x^3 + \\cdots$, a series that never ends.\n\nCheck: the sizes $1, 4, 10, 20$ are $\\binom{3}{3}, \\binom{4}{3}, \\binom{5}{3}, \\binom{6}{3}$, as the identity $\\binom{-4}{k} = (-1)^k\\binom{k + 3}{3}$ predicts.\n\nIn this lesson we compute generalized binomial coefficients and use them to find coefficients in expansions of $(1 + cx)^r$.",
    "取 $r = -4$，系数为 $\\binom{-4}{1} = -4$，$\\binom{-4}{2} = \\frac{(-4)(-5)}{2!} = 10$，$\\binom{-4}{3} = \\frac{(-4)(-5)(-6)}{3!} = -20$，所以 $(1 + x)^{-4} = 1 - 4x + 10x^2 - 20x^3 + \\cdots$，这个级数不会终止。\n\n检验：绝对值 $1, 4, 10, 20$ 正是 $\\binom{3}{3}, \\binom{4}{3}, \\binom{5}{3}, \\binom{6}{3}$，与恒等式 $\\binom{-4}{k} = (-1)^k\\binom{k + 3}{3}$ 一致。\n\n本课我们计算广义二项式系数，并用它们求 $(1 + cx)^r$ 展开式中的系数。",
  ),
  prerequisites: ["the-special-case-of-the-binomial-theorem", "convergent-and-divergent-infinite-series"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "generalized-binomial-coefficients",
      title: t("Generalized binomial coefficients", "广义二项式系数"),
      explanation: t(
        "The definition by a falling product makes sense for any exponent, including negative numbers and fractions, not just whole numbers. $\\binom{-5/2}{2} = \\frac{(-\\frac{5}{2})(-\\frac{7}{2})}{2!} = \\frac{35/4}{2} = \\frac{35}{8}$: multiply $k$ factors, each one less than the last, and divide by $k!$.\n\n> **Watch out.** Each factor is one less than the one before, so with a negative $r$ the factors move away from zero, not towards it; and do not forget to divide by $k!$.",
        "用下降乘积给出的定义对任何指数都有意义，包括负数和分数，而不只是整数。$\\binom{-5/2}{2} = \\frac{(-\\frac{5}{2})(-\\frac{7}{2})}{2!} = \\frac{35/4}{2} = \\frac{35}{8}$：把 $k$ 个依次减一的因子相乘，再除以 $k!$。\n\n> **注意。** 每个因子都比前一个小一，所以 $r$ 为负时因子离零越来越远，而不是靠近零；也不要忘了除以 $k!$。",
      ),
      generate(rng) {
        const r = rng.pick(EXPONENTS);
        const k = rng.int(2, 4);
        const value = genChoose(r, k);
        const prev = genChoose(r, k - 1);
        const ratio = r.sub(Q.of(k - 1)).div(Q.of(k));
        const product = value.mul(Q.of(fact(k)));
        return numberProblem({
          prompt: t(
            `Evaluate the generalized binomial coefficient $\\binom{${r.toLatex()}}{${k}}$.`,
            `计算广义二项式系数 $\\binom{${r.toLatex()}}{${k}}$。`,
          ),
          answer: value,
          mistakes: distinct(value, [
            why(
              value.neg(),
              "That has the wrong sign; count the negative factors in the product.",
              "那是符号错了；数一数乘积中负因子的个数。",
            ),
            why(product, `That forgets to divide by $${k}!$.`, `那是忘了除以 $${k}!$。`),
            why(
              prev,
              `That uses only $${k - 1}$ factors; $\\binom{r}{${k}}$ has $${k}$ of them.`,
              `那是只用了 $${k - 1}$ 个因子；$\\binom{r}{${k}}$ 有 $${k}$ 个。`,
            ),
            why(
              range(0, k - 1)
                .reduce((s, i) => s.mul(r.add(Q.of(i))), Q.of(1))
                .div(Q.of(fact(k))),
              "That increases each factor by one; the factors go down by one.",
              "那是让每个因子加一；因子应依次减一。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Multiply the factors", "因子相乘"],
                t(`$${factorsTex(r, k)} = ${product.toLatex()}$.`, `$${factorsTex(r, k)} = ${product.toLatex()}$。`),
              ],
              [
                ["Divide by the factorial", "除以阶乘"],
                t(
                  `$\\frac{${product.toLatex()}}{${fact(k)}} = ${value.toLatex()}$.`,
                  `$\\frac{${product.toLatex()}}{${fact(k)}} = ${value.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `$\\binom{${r.toLatex()}}{${k - 1}} = ${prev.toLatex()}$, and multiplying it by $\\frac{r - ${k - 1}}{${k}} = ${ratio.toLatex()}$ gives $${value.toLatex()}$.`,
              `$\\binom{${r.toLatex()}}{${k - 1}} = ${prev.toLatex()}$，乘以 $\\frac{r - ${k - 1}}{${k}} = ${ratio.toLatex()}$ 得 $${value.toLatex()}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "coefficients-in-generalized-expansions",
      title: t("Coefficients of (1 + cx)ʳ", "(1 + cx)ʳ 的系数"),
      explanation: t(
        "Each term of the expansion is a generalized binomial coefficient times a power of the whole term inside, including its coefficient and sign. In $(1 - 5x)^{-3}$, the $x^2$ term is $\\binom{-3}{2}(-5x)^2 = 6 \\cdot 25x^2 = 150x^2$.\n\n> **Watch out.** Raise $c$, sign included, to the power $k$, not just to the first power; and the sign of $c$ matters when $k$ is odd.",
        "展开式的每一项都是广义二项式系数乘以括号内整个项的幂，包括它的系数和符号。在 $(1 - 5x)^{-3}$ 中，$x^2$ 项为 $\\binom{-3}{2}(-5x)^2 = 6 \\cdot 25x^2 = 150x^2$。\n\n> **注意。** 要把 $c$ 连同符号一起取 $k$ 次方，而不只是一次方；$k$ 为奇数时，$c$ 的符号会影响结果。",
      ),
      generate(rng) {
        const r = rng.pick(EXPONENTS);
        const c = rng.pick([-4, -3, -2, -1, 2, 3, 4]);
        const k = rng.int(1, 3);
        const gc = genChoose(r, k);
        const ck = Q.of(c).pow(k);
        const value = gc.mul(ck);
        const inner = `1 ${c < 0 ? "-" : "+"} ${Math.abs(c) === 1 ? "" : Math.abs(c)}x`;
        const prev = genChoose(r, k - 1).mul(Q.of(c).pow(k - 1));
        const cpow = k === 1 ? `${c}` : `${pn(c)}^{${k}}`;
        const ratio = r
          .sub(Q.of(k - 1))
          .mul(Q.of(c))
          .div(Q.of(k));
        return numberProblem({
          prompt: t(
            `Find the coefficient of $${xk(k)}$ in the expansion of $(${inner})^{${rTex(r)}}$.`,
            `求 $(${inner})^{${rTex(r)}}$ 展开式中 $${xk(k)}$ 的系数。`,
          ),
          answer: value,
          mistakes: distinct(value, [
            why(
              gc.mul(Q.of(c)),
              `That raises $${c}$ only to the first power; it must be raised to the power $${k}$.`,
              `那是只把 $${c}$ 取了一次方；应取 $${k}$ 次方。`,
            ),
            why(gc, `That leaves out the factor $${cpow}$ from the term inside.`, `那是漏掉了括号内的因子 $${cpow}$。`),
            why(gc.mul(Q.of(-c).pow(k)), `That drops the sign of $${c}$.`, `那是丢掉了 $${c}$ 的符号。`),
            why(
              value.mul(Q.of(fact(k))),
              `That forgets to divide by $${k}!$ in the binomial coefficient.`,
              `那是在二项式系数中忘了除以 $${k}!$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the binomial coefficient", "求二项式系数"],
                t(`$\\binom{${r.toLatex()}}{${k}} = ${gc.toLatex()}$.`, `$\\binom{${r.toLatex()}}{${k}} = ${gc.toLatex()}$。`),
              ],
              ...(k > 1
                ? [
                    [
                      ["Raise the inner coefficient", "内层系数取幂"],
                      t(`$${pn(c)}^{${k}} = ${ck.toLatex()}$.`, `$${pn(c)}^{${k}} = ${ck.toLatex()}$。`),
                    ] as const,
                  ]
                : []),
              [["Multiply", "相乘"], t(`$${qmul(gc, ck)} = ${value.toLatex()}$.`, `$${qmul(gc, ck)} = ${value.toLatex()}$。`)],
            ],
            k === 1
              ? t(
                  `Starting from the constant term $1$, the ratio of the next term is $r \\cdot c = ${ratio.toLatex()}$, which is the coefficient $${value.toLatex()}$.`,
                  `从常数项 $1$ 开始，下一项与它之比为 $r \\cdot c = ${ratio.toLatex()}$，正是系数 $${value.toLatex()}$。`,
                )
              : t(
                  `The $${xk(k - 1)}$ coefficient is $${prev.toLatex()}$, and multiplying it by the ratio $\\frac{(r - ${k - 1})c}{${k}} = ${ratio.toLatex()}$ gives $${value.toLatex()}$.`,
                  `$${xk(k - 1)}$ 的系数为 $${prev.toLatex()}$，乘以比值 $\\frac{(r - ${k - 1})c}{${k}} = ${ratio.toLatex()}$ 得 $${value.toLatex()}$。`,
                ),
          ),
        });
      },
    },
  ],
};

/** Base is a constant a with exponent r for which aʳ is rational. */
interface Base {
  readonly a: number;
  readonly r: Q;
  readonly ar: Q;
}

/** randomBase picks a and r so that aʳ is rational. */
function randomBase(rng: Rng): Base {
  const kind = rng.int(0, 4);
  if (kind === 0) {
    const a = rng.pick([2, 3, 4, 5]);
    const n = rng.int(1, 3);
    return { a, r: Q.of(-n), ar: Q.of(1, a ** n) };
  }
  if (kind === 1 || kind === 2) {
    const s = rng.pick([2, 3, 4]);
    const sign = kind === 1 ? 1 : -1;
    return { a: s * s, r: Q.of(sign, 2), ar: sign === 1 ? Q.of(s) : Q.of(1, s) };
  }
  if (kind === 3) {
    const s = rng.pick([2, 3]);
    return { a: s ** 3, r: Q.of(1, 3), ar: Q.of(s) };
  }
  const s = rng.pick([2, 3]);
  return { a: s * s, r: Q.of(3, 2), ar: Q.of(s ** 3) };
}

/** workingWithTheGeneralizedBinomialTheorem factors out constants and multiplies expansions. */
export const workingWithTheGeneralizedBinomialTheorem: TopicDef = {
  id: "working-with-the-generalized-binomial-theorem",
  title: t("Working With the Generalized Binomial Theorem", "运用广义二项式定理"),
  summary: t(
    "To expand (a + bx)ʳ, factor out a: (a + bx)ʳ = aʳ(1 + (b/a)x)ʳ. Products like (p + qx)(1 + x)ʳ are expanded term by term.",
    "展开 (a + bx)ʳ 时先提出 a：(a + bx)ʳ = aʳ(1 + (b/a)x)ʳ。像 (p + qx)(1 + x)ʳ 这样的乘积逐项展开。",
  ),
  intro: t(
    "To expand $(10 + x)^{-1}$, factor out the $10$: $(10 + x)^{-1} = \\frac{1}{10}\\left(1 + \\frac{x}{10}\\right)^{-1} = \\frac{1}{10}\\left(1 - \\frac{x}{10} + \\frac{x^2}{100} - \\cdots\\right) = \\frac{1}{10} - \\frac{x}{100} + \\frac{x^2}{1000} - \\cdots$\n\nCheck: $(10 + x)\\left(\\frac{1}{10} - \\frac{x}{100} + \\frac{x^2}{1000}\\right) = 1 + \\frac{x^3}{1000}$, which is $1$ up to the first term left out.\n\nIn this lesson we expand $(a + bx)^r$ by factoring out $a^r$, and find coefficients in products such as $(p + qx)(1 + cx)^r$.",
    "要展开 $(10 + x)^{-1}$，先提出 $10$：$(10 + x)^{-1} = \\frac{1}{10}\\left(1 + \\frac{x}{10}\\right)^{-1} = \\frac{1}{10}\\left(1 - \\frac{x}{10} + \\frac{x^2}{100} - \\cdots\\right) = \\frac{1}{10} - \\frac{x}{100} + \\frac{x^2}{1000} - \\cdots$\n\n检验：$(10 + x)\\left(\\frac{1}{10} - \\frac{x}{100} + \\frac{x^2}{1000}\\right) = 1 + \\frac{x^3}{1000}$，除去被略掉的第一项外正是 $1$。\n\n本课我们通过提出 $a^r$ 来展开 $(a + bx)^r$，并求 $(p + qx)(1 + cx)^r$ 这类乘积中的系数。",
  ),
  prerequisites: ["the-generalized-binomial-theorem"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "expanding-a-plus-bx-to-a-power",
      title: t("Expanding (a + bx)ʳ", "展开 (a + bx)ʳ"),
      explanation: t(
        "Factor out the constant term so the bracket starts with one, then expand and multiply back by the power of the constant. $\\sqrt{25 + x} = 5\\left(1 + \\frac{x}{25}\\right)^{1/2} = 5\\left(1 + \\frac{x}{50} - \\frac{x^2}{5000} + \\cdots\\right)$, so the $x^2$ coefficient is $-\\frac{1}{1000}$.\n\n> **Watch out.** Multiply back by $a^r$, not by $a$; and inside the bracket the coefficient of $x$ is $\\frac{b}{a}$, which must be raised to the power $k$ along with $x$.",
        "先提出常数项使括号以 1 开头，再展开，最后乘回常数的幂。$\\sqrt{25 + x} = 5\\left(1 + \\frac{x}{25}\\right)^{1/2} = 5\\left(1 + \\frac{x}{50} - \\frac{x^2}{5000} + \\cdots\\right)$，所以 $x^2$ 的系数为 $-\\frac{1}{1000}$。\n\n> **注意。** 要乘回 $a^r$，而不是 $a$；括号内 $x$ 的系数是 $\\frac{b}{a}$，它要和 $x$ 一起取 $k$ 次方。",
      ),
      generate(rng) {
        const { a, r, ar } = randomBase(rng);
        const b = rng.pick([-3, -2, -1, 1, 2, 3]);
        const k = rng.int(1, 2);
        const ratio = Q.of(b, a);
        const gc = genChoose(r, k);
        const rk = ratio.pow(k);
        const bracket = gc.mul(rk);
        const value = ar.mul(bracket);
        const inner = `${a} ${b < 0 ? "-" : "+"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}x`;
        const rkTex = k === 1 ? `\\left(${ratio.toLatex()}\\right)` : `\\left(${ratio.toLatex()}\\right)^{${k}}`;
        const prev = k === 1 ? ar : ar.mul(r).mul(ratio);
        const step = (k === 1 ? r : r.sub(Q.of(1)).div(Q.of(2))).mul(ratio);
        return numberProblem({
          prompt: t(
            `Find the coefficient of $${xk(k)}$ in the expansion of $(${inner})^{${rTex(r)}}$.`,
            `求 $(${inner})^{${rTex(r)}}$ 展开式中 $${xk(k)}$ 的系数。`,
          ),
          answer: value,
          mistakes: distinct(value, [
            why(
              bracket,
              `That forgets to multiply back by $${a}^{${rTex(r)}} = ${ar.toLatex()}$.`,
              `那是忘了乘回 $${a}^{${rTex(r)}} = ${ar.toLatex()}$。`,
            ),
            why(
              ar.mul(gc).mul(Q.of(b).pow(k)),
              `That uses $${b}$ in place of $\\frac{b}{a} = ${ratio.toLatex()}$ inside the bracket.`,
              `那是在括号内用 $${b}$ 代替了 $\\frac{b}{a} = ${ratio.toLatex()}$。`,
            ),
            why(
              ar.mul(gc).mul(ratio),
              `That raises $${ratio.toLatex()}$ only to the first power, not to the power $${k}$.`,
              `那是只把 $${ratio.toLatex()}$ 取了一次方，而不是 $${k}$ 次方。`,
            ),
            why(
              Q.of(a).mul(bracket),
              `That multiplies back by $${a}$ instead of $${a}^{${rTex(r)}}$.`,
              `那是乘回了 $${a}$，而不是 $${a}^{${rTex(r)}}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Factor out the constant", "提出常数"],
                t(
                  `$(${inner})^{${rTex(r)}} = ${ar.toLatex()}\\left(1 ${ratio.sign() < 0 ? "-" : "+"} ${qx(ratio.abs())}\\right)^{${rTex(r)}}$.`,
                  `$(${inner})^{${rTex(r)}} = ${ar.toLatex()}\\left(1 ${ratio.sign() < 0 ? "-" : "+"} ${qx(ratio.abs())}\\right)^{${rTex(r)}}$。`,
                ),
              ],
              [
                ["Find the coefficient in the bracket", "求括号内的系数"],
                t(
                  `$\\binom{${r.toLatex()}}{${k}}${rkTex} = ${qmul(gc, rk)} = ${bracket.toLatex()}$.`,
                  `$\\binom{${r.toLatex()}}{${k}}${rkTex} = ${qmul(gc, rk)} = ${bracket.toLatex()}$。`,
                ),
              ],
              [
                ["Multiply back", "乘回常数"],
                t(`$${qmul(ar, bracket)} = ${value.toLatex()}$.`, `$${qmul(ar, bracket)} = ${value.toLatex()}$。`),
              ],
            ],
            k === 1
              ? t(
                  `The constant term is $${ar.toLatex()}$, and multiplying it by the term ratio $r \\cdot \\frac{b}{a} = ${step.toLatex()}$ gives $${value.toLatex()}$.`,
                  `常数项为 $${ar.toLatex()}$，乘以相邻项之比 $r \\cdot \\frac{b}{a} = ${step.toLatex()}$ 得 $${value.toLatex()}$。`,
                )
              : t(
                  `The $x$ coefficient is $${prev.toLatex()}$, and multiplying it by the term ratio $\\frac{r - 1}{2} \\cdot \\frac{b}{a} = ${step.toLatex()}$ gives $${value.toLatex()}$.`,
                  `$x$ 的系数为 $${prev.toLatex()}$，乘以相邻项之比 $\\frac{r - 1}{2} \\cdot \\frac{b}{a} = ${step.toLatex()}$ 得 $${value.toLatex()}$。`,
                ),
          ),
        });
      },
    },
    {
      id: "products-with-generalized-expansions",
      title: t("Products with expansions", "与展开式相乘"),
      explanation: t(
        "To find a coefficient in a product, pair each term of one factor with the term of the other that brings the power up to the one you want. In $(5 + x)(1 - x)^{-1} = (5 + x)(1 + x + x^2 + \\cdots)$, the $x^2$ coefficient is $5 + 1 = 6$: pair $5$ with the $x^2$ term and $x$ with the $x$ term.\n\n> **Watch out.** The $qx$ term pairs with the $x^{k-1}$ term of the expansion, not the $x^k$ term; and both pairs must be added, not just the one with the constant.",
        "要求乘积中的某个系数，把一个因子的每一项与另一个因子中能把次数补到所需次数的项配对。在 $(5 + x)(1 - x)^{-1} = (5 + x)(1 + x + x^2 + \\cdots)$ 中，$x^2$ 的系数为 $5 + 1 = 6$：$5$ 配 $x^2$ 项，$x$ 配 $x$ 项。\n\n> **注意。** $qx$ 项要配展开式的 $x^{k-1}$ 项，而不是 $x^k$ 项；两组配对都要相加，不能只算常数那一组。",
      ),
      generate(rng) {
        const r = rng.pick(EXPONENTS);
        const c = rng.pick([-2, -1, 1, 2]);
        const p = rng.nonZero(-4, 4);
        const q = rng.nonZero(-4, 4);
        const k = rng.int(2, 3);
        const term = (j: number) => genChoose(r, j).mul(Q.of(c).pow(j));
        const value = Q.of(p)
          .mul(term(k))
          .add(Q.of(q).mul(term(k - 1)));
        const inner = `1 ${c < 0 ? "-" : "+"} ${Math.abs(c) === 1 ? "" : Math.abs(c)}x`;
        const lin = poly([
          [p, ""],
          [q, "x"],
        ]);
        const ratio = r
          .sub(Q.of(k - 1))
          .mul(Q.of(c))
          .div(Q.of(k));
        const inside = Q.of(p).mul(ratio).add(Q.of(q));
        const low = term(k - 1);
        const lowUnit = low.abs().eq(Q.of(1));
        const lowSign = (lowUnit ? q * low.sign() : q) < 0 ? "-" : "+";
        const pair = `${qmul(Q.of(p), term(k))} ${lowSign} ${lowUnit ? Math.abs(q) : qmul(Q.of(Math.abs(q)), low)}`;
        return numberProblem({
          prompt: t(
            `Find the coefficient of $${xk(k)}$ in the expansion of $(${lin})(${inner})^{${rTex(r)}}$.`,
            `求 $(${lin})(${inner})^{${rTex(r)}}$ 展开式中 $${xk(k)}$ 的系数。`,
          ),
          answer: value,
          mistakes: distinct(value, [
            why(
              Q.of(p).mul(term(k)),
              `That keeps only the pair with $${p}$ and forgets the pair with the $x$ term.`,
              `那是只算了 $${p}$ 那一组，漏掉了 $x$ 项那一组。`,
            ),
            why(
              Q.of(q).mul(term(k - 1)),
              `That keeps only the pair with the $x$ term and forgets the pair with $${p}$.`,
              `那是只算了 $x$ 项那一组，漏掉了 $${p}$ 那一组。`,
            ),
            why(
              Q.of(p + q).mul(term(k)),
              `That pairs both terms with the $${xk(k)}$ term of the expansion.`,
              `那是把两项都配给了展开式的 $${xk(k)}$ 项。`,
            ),
            why(
              Q.of(p)
                .mul(term(k - 1))
                .add(Q.of(q).mul(term(k))),
              "That swaps the pairs: the constant goes with the higher power.",
              "那是把配对弄反了：常数应配较高次的项。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Expand the power", "展开幂"],
                t(
                  `In $(${inner})^{${rTex(r)}}$ the $${xk(k - 1)}$ coefficient is $${term(k - 1).toLatex()}$ and the $${xk(k)}$ coefficient is $${term(k).toLatex()}$.`,
                  `$(${inner})^{${rTex(r)}}$ 中 $${xk(k - 1)}$ 的系数为 $${term(k - 1).toLatex()}$，$${xk(k)}$ 的系数为 $${term(k).toLatex()}$。`,
                ),
              ],
              [
                ["Pair the terms", "配对相加"],
                t(
                  `$${p}$ pairs with $${xk(k)}$ and the $x$ term with $${xk(k - 1)}$: $${pair} = ${value.toLatex()}$.`,
                  `$${p}$ 配 $${xk(k)}$，$x$ 项配 $${xk(k - 1)}$：$${pair} = ${value.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The $${xk(k)}$ coefficient of the expansion is $${ratio.toLatex()}$ times the $${xk(k - 1)}$ one, so the answer is $${term(k - 1).toLatex()}$ times $${qmul(Q.of(p), ratio)} ${q < 0 ? "-" : "+"} ${Math.abs(q)} = ${inside.toLatex()}$, which is $${value.toLatex()}$.`,
              `展开式中 $${xk(k)}$ 的系数是 $${xk(k - 1)}$ 系数的 $${ratio.toLatex()}$ 倍，所以答案为 $${term(k - 1).toLatex()}$ 乘以 $${qmul(Q.of(p), ratio)} ${q < 0 ? "-" : "+"} ${Math.abs(q)} = ${inside.toLatex()}$，即 $${value.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** rangeTex writes a/|b| and its value, skipping repeats and a denominator of 1. */
const rangeTex = (a: number, b: number) => {
  const v = Q.of(a, Math.abs(b)).toLatex();
  const raw = Math.abs(b) === 1 ? `${a}` : `\\frac{${a}}{${Math.abs(b)}}`;
  return raw === v ? v : `${raw} = ${v}`;
};

/** determiningRangesOfValidityForGeneralizedBinomialExpansions finds where expansions converge. */
export const determiningRangesOfValidityForGeneralizedBinomialExpansions: TopicDef = {
  id: "determining-ranges-of-validity-for-generalized-binomial-expansions",
  title: t("Determining Ranges of Validity for Generalized Binomial Expansions", "确定广义二项式展开的有效范围"),
  summary: t(
    "(1 + u)ʳ = Σ C(r, k)uᵏ holds for |u| < 1, so (a + bx)ʳ expands for |bx/a| < 1, that is, |x| < |a/b|. A product of expansions is valid where both are.",
    "(1 + u)ʳ = Σ C(r, k)uᵏ 在 |u| < 1 时成立，所以 (a + bx)ʳ 在 |bx/a| < 1，即 |x| < |a/b| 时可以展开。展开式之积在两者都有效处有效。",
  ),
  intro: t(
    "The expansion $(1 + x)^{-1} = 1 - x + x^2 - x^3 + \\cdots$ is a geometric series with ratio $-x$, so it converges exactly when $|x| < 1$. At $x = 2$ the left side is $\\frac{1}{3}$, but the series $1 - 2 + 4 - \\cdots$ grows without bound.\n\nCheck: at $x = \\frac{1}{2}$, inside the range, the series $1 - \\frac{1}{2} + \\frac{1}{4} - \\cdots$ sums to $\\frac{1}{1 + 1/2} = \\frac{2}{3}$, which is $(1 + \\frac{1}{2})^{-1}$.\n\nIn this lesson we find the range of $x$ for which an expansion of $(a + bx)^r$, or of a product of such powers, is valid.",
    "展开式 $(1 + x)^{-1} = 1 - x + x^2 - x^3 + \\cdots$ 是公比为 $-x$ 的等比级数，所以恰在 $|x| < 1$ 时收敛。在 $x = 2$ 处左边等于 $\\frac{1}{3}$，而级数 $1 - 2 + 4 - \\cdots$ 无限增大。\n\n检验：在范围内的 $x = \\frac{1}{2}$ 处，级数 $1 - \\frac{1}{2} + \\frac{1}{4} - \\cdots$ 的和为 $\\frac{1}{1 + 1/2} = \\frac{2}{3}$，正是 $(1 + \\frac{1}{2})^{-1}$。\n\n本课我们求 $(a + bx)^r$ 或这类幂之积的展开式成立的 $x$ 的范围。",
  ),
  prerequisites: ["working-with-the-generalized-binomial-theorem"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "range-of-validity-of-one-expansion",
      title: t("One expansion", "单个展开式"),
      explanation: t(
        "The expansion of one plus a small quantity to a non-integer power converges only when that quantity has absolute value less than one. $(20 - 3x)^{1/2} = \\sqrt{20}\\left(1 - \\frac{3x}{20}\\right)^{1/2}$ is valid for $\\left|\\frac{3x}{20}\\right| < 1$, that is, $|x| < \\frac{20}{3}$.\n\n> **Watch out.** The bound is $\\frac{a}{|b|}$, not $\\frac{|b|}{a}$; and it is not always $|x| < 1$, because the bracket must start with $1$ before the rule $|u| < 1$ applies.",
        "一加一个小量的非整数次幂的展开式，只有在这个小量的绝对值小于 1 时才收敛。$(20 - 3x)^{1/2} = \\sqrt{20}\\left(1 - \\frac{3x}{20}\\right)^{1/2}$ 在 $\\left|\\frac{3x}{20}\\right| < 1$，即 $|x| < \\frac{20}{3}$ 时有效。\n\n> **注意。** 界是 $\\frac{a}{|b|}$，而不是 $\\frac{|b|}{a}$；它也不总是 $|x| < 1$，因为括号必须先化成以 $1$ 开头，才能用 $|u| < 1$ 的规则。",
      ),
      generate(rng) {
        const a = rng.int(1, 12);
        const b = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
        const r = rng.pick(EXPONENTS);
        const square = rng.bool(0.25);
        const value = Q.of(a, Math.abs(b));
        const xs = square ? "x^2" : "x";
        const answer = square ? undefined : value;
        const inner = `${a} ${b < 0 ? "-" : "+"} ${Math.abs(b)}${xs}`;
        const sg = b < 0 ? "-" : "+";
        if (answer === undefined) {
          const s = Q.of(a * a, Math.abs(b));
          const inner2 = `${a * a} ${sg} ${Math.abs(b)}x^2`;
          const u = a === 1 ? `${Math.abs(b)}x^2` : `\\frac{${Math.abs(b)}x^2}{${a * a}}`;
          return numberProblem({
            prompt: t(
              `The expansion of $(${inner2})^{${rTex(r)}}$ in powers of $x$ is valid for $x^2 < c$. Find $c$.`,
              `$(${inner2})^{${rTex(r)}}$ 按 $x$ 的幂展开，在 $x^2 < c$ 时有效。求 $c$。`,
            ),
            answer: s,
            mistakes: distinct(s, [
              why(
                Q.of(Math.abs(b), a * a),
                "That inverts the bound; solve the inequality for $x^2$.",
                "那是把界颠倒了；应对 $x^2$ 解不等式。",
              ),
              why(
                Q.of(a, Math.abs(b)),
                `That divides $${a}$ rather than the constant term $${a * a}$ by $${Math.abs(b)}$.`,
                `那是用 $${a}$ 而不是常数项 $${a * a}$ 除以 $${Math.abs(b)}$。`,
              ),
              why(
                Q.of(1),
                "That uses $x^2 < 1$ without first making the bracket start with $1$.",
                "那是没有先把括号化成以 $1$ 开头，就用了 $x^2 < 1$。",
              ),
            ]),
            solution: walked(
              [
                ...(a === 1
                  ? []
                  : [
                      [
                        ["Factor out the constant", "提出常数"],
                        t(
                          `$(${inner2})^{${rTex(r)}} = ${a * a}^{${rTex(r)}}\\left(1 ${sg} ${u}\\right)^{${rTex(r)}}$.`,
                          `$(${inner2})^{${rTex(r)}} = ${a * a}^{${rTex(r)}}\\left(1 ${sg} ${u}\\right)^{${rTex(r)}}$。`,
                        ),
                      ] as const,
                    ]),
                [["Require the small quantity below 1", "要求小量小于 1"], t(`$\\left|${u}\\right| < 1$.`, `$\\left|${u}\\right| < 1$。`)],
                [["Solve for $x^2$", "解出 $x^2$"], t(`$x^2 < ${rangeTex(a * a, b)}$.`, `$x^2 < ${rangeTex(a * a, b)}$。`)],
              ],
              t(
                `At $x^2 = ${s.toLatex()}$ the quantity $${Math.abs(b)}x^2$ equals the constant term $${a * a}$, so the bracket's small term reaches $1$ there, the edge of convergence.`,
                `在 $x^2 = ${s.toLatex()}$ 处，$${Math.abs(b)}x^2$ 正好等于常数项 $${a * a}$，括号内的小量在那里达到 $1$，正是收敛的边界。`,
              ),
            ),
          });
        }
        const u = a === 1 ? `${Math.abs(b)}x` : `\\frac{${Math.abs(b)}x}{${a}}`;
        return numberProblem({
          prompt: t(
            `The expansion of $(${inner})^{${rTex(r)}}$ in powers of $x$ is valid for $|x| < c$. Find $c$.`,
            `$(${inner})^{${rTex(r)}}$ 按 $x$ 的幂展开，在 $|x| < c$ 时有效。求 $c$。`,
          ),
          answer,
          mistakes: distinct(answer, [
            why(Q.of(Math.abs(b), a), "That inverts the bound; solve the inequality for $|x|$.", "那是把界颠倒了；应对 $|x|$ 解不等式。"),
            why(
              Q.of(1),
              "That uses $|x| < 1$ without first making the bracket start with $1$.",
              "那是没有先把括号化成以 $1$ 开头，就用了 $|x| < 1$。",
            ),
            why(Q.of(a), `That ignores the coefficient $${Math.abs(b)}$ of $x$.`, `那是忽略了 $x$ 的系数 $${Math.abs(b)}$。`),
            why(Q.of(1, Math.abs(b)), `That ignores the constant term $${a}$.`, `那是忽略了常数项 $${a}$。`),
          ]),
          solution: walked(
            [
              ...(a === 1
                ? []
                : [
                    [
                      ["Factor out the constant", "提出常数"],
                      t(
                        `$(${inner})^{${rTex(r)}} = ${a}^{${rTex(r)}}\\left(1 ${sg} ${u}\\right)^{${rTex(r)}}$.`,
                        `$(${inner})^{${rTex(r)}} = ${a}^{${rTex(r)}}\\left(1 ${sg} ${u}\\right)^{${rTex(r)}}$。`,
                      ),
                    ] as const,
                  ]),
              [["Require the small quantity below 1", "要求小量小于 1"], t(`$\\left|${u}\\right| < 1$.`, `$\\left|${u}\\right| < 1$。`)],
              [["Solve for $|x|$", "解出 $|x|$"], t(`$|x| < ${rangeTex(a, b)}$.`, `$|x| < ${rangeTex(a, b)}$。`)],
            ],
            t(
              `At $|x| = ${value.toLatex()}$ the quantity $${Math.abs(b)}|x|$ equals the constant term $${a}$, so the bracket's small term reaches $1$ there, the edge of convergence.`,
              `在 $|x| = ${value.toLatex()}$ 处，$${Math.abs(b)}|x|$ 正好等于常数项 $${a}$，括号内的小量在那里达到 $1$，正是收敛的边界。`,
            ),
          ),
        });
      },
    },
    {
      id: "range-of-validity-of-a-product",
      title: t("Products of expansions", "展开式之积"),
      explanation: t(
        "A product of expansions is valid only where every factor's expansion is valid, so take the narrowest of their ranges. $(1 + 5x)^{-1}$ needs $|x| < \\frac{1}{5}$ and $(3 - x)^{1/2}$ needs $|x| < 3$. Their product's expansion needs both: $|x| < \\frac{1}{5}$.\n\n> **Watch out.** Take the smaller range, not the larger one; and do not multiply or add the two bounds, since each is a separate condition that must hold at once.",
        "展开式的乘积只在每个因子的展开式都成立的地方成立，所以取它们范围中最窄的一个。$(1 + 5x)^{-1}$ 需要 $|x| < \\frac{1}{5}$，$(3 - x)^{1/2}$ 需要 $|x| < 3$。乘积的展开需要两者同时成立：$|x| < \\frac{1}{5}$。\n\n> **注意。** 要取较小的范围，而不是较大的；也不要把两个界相乘或相加，它们是必须同时成立的两个独立条件。",
      ),
      generate(rng) {
        const [a1, a2] = [rng.int(1, 9), rng.int(1, 9)];
        const [b1, b2] = [rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]), rng.pick([-4, -3, -2, -1, 1, 2, 3, 4])];
        const [r1, r2] = rng.sample(EXPONENTS, 2);
        const c1 = Q.of(a1, Math.abs(b1));
        const c2 = Q.of(a2, Math.abs(b2));
        if (c1.eq(c2)) return determiningRangesOfValidityForGeneralizedBinomialExpansions.knowledgePoints[1]!.generate(rng);
        const value = c1.cmp(c2) < 0 ? c1 : c2;
        const wider = c1.cmp(c2) < 0 ? c2 : c1;
        const f = (a: number, b: number) => `${a} ${b < 0 ? "-" : "+"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}x`;
        return numberProblem({
          prompt: t(
            `The expansion of $(${f(a1, b1)})^{${rTex(r1!)}}(${f(a2, b2)})^{${rTex(r2!)}}$ in powers of $x$ is valid for $|x| < c$. Find the largest such $c$.`,
            `$(${f(a1, b1)})^{${rTex(r1!)}}(${f(a2, b2)})^{${rTex(r2!)}}$ 按 $x$ 的幂展开，在 $|x| < c$ 时有效。求最大的 $c$。`,
          ),
          answer: value,
          mistakes: distinct(value, [
            why(
              wider,
              "That takes the wider range; the narrower factor's expansion fails beyond its own bound.",
              "那是取了较宽的范围；较窄那个因子的展开式在它的界外不成立。",
            ),
            why(
              c1.mul(c2),
              "That multiplies the two bounds; each bound is a separate condition.",
              "那是把两个界相乘；每个界都是独立的条件。",
            ),
            why(c1.add(c2), "That adds the two bounds; each bound is a separate condition.", "那是把两个界相加；每个界都是独立的条件。"),
            why(
              Q.of(1),
              "That uses $|x| < 1$ without making each bracket start with $1$.",
              "那是没有把每个括号化成以 $1$ 开头，就用了 $|x| < 1$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Range of the first factor", "第一个因子的范围"],
                t(
                  `$(${f(a1, b1)})^{${rTex(r1!)}}$ needs $|x| < ${rangeTex(a1, b1)}$.`,
                  `$(${f(a1, b1)})^{${rTex(r1!)}}$ 需要 $|x| < ${rangeTex(a1, b1)}$。`,
                ),
              ],
              [
                ["Range of the second factor", "第二个因子的范围"],
                t(
                  `$(${f(a2, b2)})^{${rTex(r2!)}}$ needs $|x| < ${rangeTex(a2, b2)}$.`,
                  `$(${f(a2, b2)})^{${rTex(r2!)}}$ 需要 $|x| < ${rangeTex(a2, b2)}$。`,
                ),
              ],
              [
                ["Take the narrower range", "取较窄的范围"],
                t(`Both hold when $|x| < ${value.toLatex()}$.`, `两者在 $|x| < ${value.toLatex()}$ 时同时成立。`),
              ],
            ],
            t(
              `Since $${value.toLatex()} < ${wider.toLatex()}$, every $x$ with $|x| < ${value.toLatex()}$ meets both conditions, while just beyond $${value.toLatex()}$ the narrower factor's expansion diverges.`,
              `因为 $${value.toLatex()} < ${wider.toLatex()}$，满足 $|x| < ${value.toLatex()}$ 的每个 $x$ 都同时满足两个条件，而稍超过 $${value.toLatex()}$ 时，较窄那个因子的展开式就发散了。`,
            ),
          ),
        });
      },
    },
  ],
};

/** APPROX are exponents whose coefficients have power-of-two denominators, so approximations terminate. */
const APPROX: readonly Q[] = [Q.of(1, 2), Q.of(-1, 2), Q.of(-1), Q.of(-2), Q.of(3, 2), Q.of(1, 4)];

/** pd writes a decimal, in parentheses when negative. */
const pd = (q: Q) => (q.sign() < 0 ? `(${dec(q)})` : dec(q));

/** dmul writes a rational times a decimal factor, dropping a coefficient of 1 or −1 to a sign. */
const dmul = (a: Q, x: string) => (a.eq(Q.of(1)) ? x : a.eq(Q.of(-1)) ? `-${x}` : `${a.toLatex()} \\cdot ${x}`);

/** sumDec writes 1 ± |t₁| ± |t₂| from signed decimal terms. */
const sumDec = (ts: readonly Q[]) => `1${ts.map((x) => ` ${x.sign() < 0 ? "-" : "+"} ${dec(x.abs())}`).join("")}`;

/** approximatingValuesUsingTheGeneralizedBinomialTheorem truncates generalized expansions. */
export const approximatingValuesUsingTheGeneralizedBinomialTheorem: TopicDef = {
  id: "approximating-values-using-the-generalized-binomial-theorem",
  title: t("Approximating Values Using the Generalized Binomial Theorem", "用广义二项式定理求近似值"),
  summary: t(
    "For small $u$, $(1 + u)^r \\approx 1 + ru + \\binom{r}{2}u^2$; numbers like $\\sqrt{102} = 10(1 + 0.02)^{1/2}$ can be approximated this way.",
    "当 $u$ 很小时，$(1 + u)^r \\approx 1 + ru + \\binom{r}{2}u^2$；像 $\\sqrt{102} = 10(1 + 0.02)^{1/2}$ 这样的数可以这样近似。",
  ),
  intro: t(
    "$1.03^{-1} = (1 + 0.03)^{-1} \\approx 1 - 0.03 + 0.03^2 = 1 - 0.03 + 0.0009 = 0.9709$, using the first three terms $1 - x + x^2$ of the expansion of $(1 + x)^{-1}$.\n\nCheck: $1.03 \\cdot 0.9709 = 1.000027$, which is $1$ to four decimal places, so $0.9709$ is very close to $\\frac{1}{1.03}$.\n\nIn this lesson we approximate powers of numbers near $1$, and roots of numbers near a perfect square, with the first terms of a generalized binomial expansion.",
    "$1.03^{-1} = (1 + 0.03)^{-1} \\approx 1 - 0.03 + 0.03^2 = 1 - 0.03 + 0.0009 = 0.9709$，这里用了 $(1 + x)^{-1}$ 展开式的前三项 $1 - x + x^2$。\n\n检验：$1.03 \\cdot 0.9709 = 1.000027$，精确到四位小数就是 $1$，所以 $0.9709$ 与 $\\frac{1}{1.03}$ 非常接近。\n\n本课我们用广义二项式展开的前几项，近似计算接近 $1$ 的数的乘方，以及接近完全平方数的数的方根。",
  ),
  prerequisites: ["working-with-the-generalized-binomial-theorem"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "approximating-powers-near-one",
      title: t("Powers near 1", "接近 1 的数的乘方"),
      explanation: t(
        "When the quantity added to one is small, its higher powers are tiny, so the first few terms of the expansion give an accurate value. $\\sqrt{1.01} = (1 + 0.01)^{1/2} \\approx 1 + \\frac{1}{2}(0.01) - \\frac{1}{8}(0.01)^2 = 1.0049875$; the true value is $1.00498756\\ldots$\n\n> **Watch out.** The third coefficient is $\\binom{r}{2} = \\frac{r(r - 1)}{2}$, not $r(r - 1)$; and its sign comes from $r(r - 1)$, so for $0 < r < 1$ the third term is subtracted.",
        "当加到 1 上的量很小时，它的高次幂非常小，所以展开式的前几项就能给出准确的值。$\\sqrt{1.01} = (1 + 0.01)^{1/2} \\approx 1 + \\frac{1}{2}(0.01) - \\frac{1}{8}(0.01)^2 = 1.0049875$；真实值为 $1.00498756\\ldots$\n\n> **注意。** 第三个系数是 $\\binom{r}{2} = \\frac{r(r - 1)}{2}$，而不是 $r(r - 1)$；它的符号由 $r(r - 1)$ 决定，所以 $0 < r < 1$ 时第三项是减去的。",
      ),
      generate(rng) {
        const r = rng.pick(APPROX);
        const u = Q.of(rng.nonZero(-5, 5) * 2, 100);
        const g2 = genChoose(r, 2);
        const t1 = r.mul(u);
        const t2 = g2.mul(u.pow(2));
        const value = Q.of(1).add(t1).add(t2);
        const base = Q.of(1).add(u);
        const t3 = genChoose(r, 3).mul(u.pow(3));
        return numberProblem({
          prompt: t(
            `Use the first three terms of the expansion of $(1 + x)^{${rTex(r)}}$ to approximate $${dec(base)}^{${rTex(r)}}$.`,
            `用 $(1 + x)^{${rTex(r)}}$ 展开式的前三项近似计算 $${dec(base)}^{${rTex(r)}}$。`,
          ),
          answer: value,
          form: "decimal",
          mistakes: distinct(value, [
            why(Q.of(1).add(t1), "That stops after two terms; the question asks for three.", "那是只用了两项；题目要求用三项。"),
            why(
              Q.of(1).add(t1).sub(t2),
              `That flips the sign of the third term; $\\binom{${r.toLatex()}}{2} = ${g2.toLatex()}$.`,
              `那是把第三项的符号弄反了；$\\binom{${r.toLatex()}}{2} = ${g2.toLatex()}$。`,
            ),
            why(
              Q.of(1)
                .add(t1)
                .add(r.mul(r.sub(Q.of(1))).mul(u.pow(2))),
              "That uses $r(r - 1)$ for the third coefficient without dividing by $2$.",
              "那是第三个系数用了 $r(r - 1)$，没有除以 $2$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Identify x and the coefficients", "确定 x 和系数"],
                t(
                  `$x = ${dec(u)}$, $r = ${r.toLatex()}$ and $\\binom{${r.toLatex()}}{2} = ${g2.toLatex()}$.`,
                  `$x = ${dec(u)}$，$r = ${r.toLatex()}$，$\\binom{${r.toLatex()}}{2} = ${g2.toLatex()}$。`,
                ),
              ],
              [
                ["Evaluate the terms", "计算各项"],
                t(
                  `$${dmul(r, pd(u))} = ${dec(t1)}$ and $${dmul(g2, `${pd(u)}^2`)} = ${dec(t2)}$.`,
                  `$${dmul(r, pd(u))} = ${dec(t1)}$，$${dmul(g2, `${pd(u)}^2`)} = ${dec(t2)}$。`,
                ),
              ],
              [["Add", "相加"], t(`$${sumDec([t1, t2])} = ${dec(value)}$.`, `$${sumDec([t1, t2])} = ${dec(value)}$。`)],
            ],
            t(
              `The next term, $\\binom{${r.toLatex()}}{3}x^3 = ${dec(t3)}$, is far smaller than the third term $${dec(t2)}$, so the three-term value is accurate.`,
              `下一项 $\\binom{${r.toLatex()}}{3}x^3 = ${dec(t3)}$ 远小于第三项 $${dec(t2)}$，所以三项的结果是准确的。`,
            ),
          ),
        });
      },
    },
    {
      id: "approximating-roots-by-factoring",
      title: t("Approximating roots", "近似计算方根"),
      explanation: t(
        "Factoring out the nearest perfect power leaves a bracket close to one, so the expansion converges fast and a few terms suffice. $\\sqrt{2501} = 50\\left(1 + 0.0004\\right)^{1/2} \\approx 50\\left(1 + 0.0002 - 0.00000002\\right) = 50.009999$.\n\n> **Watch out.** Multiply the bracket back by the square root $50$ that was factored out; and the third term of $(1 + x)^{1/2}$ is $-\\frac{1}{8}x^2$, which is subtracted.",
        "提出最接近的完全幂之后，括号里剩下的数接近 1，所以展开式收敛很快，几项就够了。$\\sqrt{2501} = 50\\left(1 + 0.0004\\right)^{1/2} \\approx 50\\left(1 + 0.0002 - 0.00000002\\right) = 50.009999$。\n\n> **注意。** 要把括号乘回提出来的平方根 $50$；$(1 + x)^{1/2}$ 的第三项是 $-\\frac{1}{8}x^2$，是减去的。",
      ),
      generate(rng) {
        const s = rng.pick([5, 10, 20, 30]);
        const d = rng.nonZero(-4, 4) * (s === 5 ? 1 : s === 10 ? 2 : s === 20 ? 8 : 9);
        const N = s * s + d;
        const u = Q.of(d, s * s);
        const r = Q.of(1, 2);
        const t1 = r.mul(u);
        const t2 = genChoose(r, 2).mul(u.pow(2));
        const bracket = Q.of(1).add(t1).add(t2);
        const value = Q.of(s).mul(bracket);
        const v = value.toNumber();
        return numberProblem({
          prompt: t(
            `Write $\\sqrt{${N}} = ${s}\\left(1 + x\\right)^{1/2}$ and use the first three terms of the binomial expansion to approximate $\\sqrt{${N}}$.`,
            `把 $\\sqrt{${N}}$ 写成 $${s}\\left(1 + x\\right)^{1/2}$，用二项式展开的前三项近似计算 $\\sqrt{${N}}$。`,
          ),
          answer: value,
          form: "decimal",
          mistakes: distinct(value, [
            why(
              Q.of(s).mul(Q.of(1).add(t1)),
              "That stops after two terms; the question asks for three.",
              "那是只用了两项；题目要求用三项。",
            ),
            why(bracket, `That forgets to multiply the bracket by $${s}$.`, `那是忘了把括号乘以 $${s}$。`),
            why(
              Q.of(s).mul(Q.of(1).add(t1).sub(t2)),
              "That adds the third term; for the exponent $\\frac{1}{2}$ it is $-\\frac{1}{8}x^2$.",
              "那是把第三项加上了；指数为 $\\frac{1}{2}$ 时它是 $-\\frac{1}{8}x^2$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Factor out the square", "提出平方数"],
                t(
                  `$${N} = ${s * s}\\left(1 + x\\right)$ with $x = ${u.toLatex()} = ${dec(u)}$.`,
                  `$${N} = ${s * s}\\left(1 + x\\right)$，其中 $x = ${u.toLatex()} = ${dec(u)}$。`,
                ),
              ],
              [
                ["Expand the bracket", "展开括号"],
                t(
                  `$1 + \\frac{1}{2}x - \\frac{1}{8}x^2 = ${sumDec([t1, t2])} = ${dec(bracket)}$.`,
                  `$1 + \\frac{1}{2}x - \\frac{1}{8}x^2 = ${sumDec([t1, t2])} = ${dec(bracket)}$。`,
                ),
              ],
              [
                ["Multiply back", "乘回"],
                t(`$${s} \\cdot ${dec(bracket)} = ${dec(value)}$.`, `$${s} \\cdot ${dec(bracket)} = ${dec(value)}$。`),
              ],
            ],
            t(
              `Squaring, $${dec(value)}^2 \\approx ${(v * v).toFixed(4)}$, which is very close to $${N}$.`,
              `平方得 $${dec(value)}^2 \\approx ${(v * v).toFixed(4)}$，与 $${N}$ 非常接近。`,
            ),
          ),
        });
      },
    },
  ],
};

/** multinomial is n!/(k₁! ⋯ kₘ!). */
const multinomial = (ks: readonly number[]) => ks.reduce((s, k) => s / fact(k), fact(ks.reduce((a, b) => a + b, 0)));

/** VARS are variable names for multinomial expansions. */
const VARS = ["x", "y", "z", "w"] as const;

/** monoTex writes x^a y^b z^c. */
const monoTex = (ks: readonly number[]) => ks.map((k, i) => (k === 0 ? "" : k === 1 ? VARS[i]! : `${VARS[i]}^{${k}}`)).join("") || "1";

/** theMultinomialTheorem gives coefficients in powers of sums of several terms. */
export const theMultinomialTheorem: TopicDef = {
  id: "the-multinomial-theorem",
  title: t("The Multinomial Theorem", "多项式定理"),
  summary: t(
    "$(x_1 + \\cdots + x_m)^n = \\sum \\frac{n!}{k_1! \\cdots k_m!} x_1^{k_1} \\cdots x_m^{k_m}$ over all $k_1 + \\cdots + k_m = n$: the coefficient counts arrangements of the factors.",
    "$(x_1 + \\cdots + x_m)^n = \\sum \\frac{n!}{k_1! \\cdots k_m!} x_1^{k_1} \\cdots x_m^{k_m}$，对所有 $k_1 + \\cdots + k_m = n$ 求和：系数计数各因子的排列方式。",
  ),
  intro: t(
    "In $(x + y + z)^3$, each term picks one variable from each of the three factors. The coefficient of $xyz$ is $\\frac{3!}{1! \\, 1! \\, 1!} = 6$, of $x^2y$ is $\\frac{3!}{2! \\, 1! \\, 0!} = 3$, and of $x^3$ is $1$.\n\nCheck: setting $x = y = z = 1$ gives $3^3 = 27$, and the coefficients add up to that: three cubes with $1$ each, six terms like $x^2y$ with $3$ each, and $xyz$ with $6$, so $3 + 18 + 6 = 27$.\n\nIn this lesson we compute multinomial coefficients, first in sums of plain variables and then in sums whose terms carry constants.",
    "在 $(x + y + z)^3$ 中，每一项从三个因子中各取一个变量。$xyz$ 的系数为 $\\frac{3!}{1! \\, 1! \\, 1!} = 6$，$x^2y$ 的系数为 $\\frac{3!}{2! \\, 1! \\, 0!} = 3$，$x^3$ 的系数为 $1$。\n\n检验：令 $x = y = z = 1$ 得 $3^3 = 27$，系数之和正是它：三个立方项各为 $1$，六个形如 $x^2y$ 的项各为 $3$，$xyz$ 为 $6$，所以 $3 + 18 + 6 = 27$。\n\n本课我们计算多项式系数，先在纯变量之和中，再在各项带常数的和中。",
  ),
  prerequisites: ["expanding-a-binomial-using-binomial-coefficients", "permutations-with-repetition"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "multinomial-coefficients",
      title: t("Multinomial coefficients", "多项式系数"),
      explanation: t(
        "In $(x + y + z)^{10}$, the coefficient of $x^5y^3z^2$ is the number of ways to choose which of the $10$ factors give $x$, $y$ or $z$: $\\frac{10!}{5! \\, 3! \\, 2!} = \\frac{3628800}{1440} = 2520$.\n\n> **Watch out.** Divide by the factorial of every exponent, not just the largest; a variable with exponent $0$ contributes $0! = 1$.",
        "在 $(x + y + z)^{10}$ 中，$x^5y^3z^2$ 的系数是选择 $10$ 个因子中哪些给出 $x$、$y$、$z$ 的方法数：$\\frac{10!}{5! \\, 3! \\, 2!} = \\frac{3628800}{1440} = 2520$。\n\n> **注意。** 要除以每个指数的阶乘，而不只是最大的那个；指数为 $0$ 的变量贡献 $0! = 1$。",
      ),
      generate(rng) {
        const m = rng.int(3, 4);
        const n = rng.int(4, 9);
        const cuts = range(1, m - 1)
          .map(() => rng.int(0, n))
          .sort((a, b) => a - b);
        const ks = [...cuts, n].map((c, i) => c - (i === 0 ? 0 : cuts[i - 1]!));
        const value = multinomial(ks);
        const sum = VARS.slice(0, m).join(" + ");
        const den = ks.reduce((s, k) => s * fact(k), 1);
        const tops = ks.slice(0, -1).map((k, i) => [n - ks.slice(0, i).reduce((a, b) => a + b, 0), k] as const);
        const largest = Math.max(...ks);
        return numberProblem({
          prompt: t(
            `Find the coefficient of $${monoTex(ks)}$ in the expansion of $(${sum})^{${n}}$.`,
            `求 $(${sum})^{${n}}$ 展开式中 $${monoTex(ks)}$ 的系数。`,
          ),
          answer: value,
          mistakes: distinct(value, [
            why(fact(n), `That forgets to divide by the factorials of the exponents.`, `那是忘了除以各指数的阶乘。`),
            why(
              choose(n, largest),
              `That only chooses the places of the variable with exponent $${largest}$, then stops.`,
              `那是只选了指数为 $${largest}$ 的变量的位置，就停下了。`,
            ),
            why(
              ks.reduce((a, b) => a * (b || 1), 1),
              "That multiplies the exponents; the coefficient counts arrangements of the factors.",
              "那是把指数相乘；系数计数的是因子的排列方式。",
            ),
            why(
              m ** n,
              `That counts all $${m}^{${n}}$ products together, not just those giving $${monoTex(ks)}$.`,
              `那是把全部 $${m}^{${n}}$ 个乘积一起计数了，而不只是给出 $${monoTex(ks)}$ 的那些。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Read off the exponents", "读出指数"],
                t(`The exponents are $${ks.join(", ")}$, which add up to $${n}$.`, `指数为 $${ks.join(", ")}$，它们的和为 $${n}$。`),
              ],
              [
                ["Apply the formula", "代入公式"],
                t(
                  `$\\frac{${n}!}{${ks.map((k) => `${k}!`).join(" \\, ")}} = \\frac{${fact(n)}}{${den}} = ${value}$.`,
                  `$\\frac{${n}!}{${ks.map((k) => `${k}!`).join(" \\, ")}} = \\frac{${fact(n)}}{${den}} = ${value}$。`,
                ),
              ],
            ],
            t(
              `Choosing the places of one variable at a time gives the same count: $${tops.map(([a, k]) => `\\binom{${a}}{${k}}`).join("")} = ${value}$.`,
              `逐个变量选择位置得到同样的计数：$${tops.map(([a, k]) => `\\binom{${a}}{${k}}`).join("")} = ${value}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "multinomial-coefficients-with-constants",
      title: t("Terms with coefficients", "带系数的项"),
      explanation: t(
        "The multinomial coefficient counts the arrangements, and each term inside, with its coefficient and sign, is raised to its own power. In $(3x + y - 2z)^5$, the $x^2yz^2$ term is $\\frac{5!}{2! \\, 1! \\, 2!}(3x)^2(y)(-2z)^2 = 30 \\cdot 9 \\cdot 4 \\, x^2yz^2 = 1080x^2yz^2$.\n\n> **Watch out.** Raise each constant to its exponent rather than multiplying by the exponent; and keep the signs, since a negative constant to an odd power leaves the coefficient negative.",
        "多项式系数计算排列的方法数，括号内的每一项连同其系数和符号都升到各自的幂。在 $(3x + y - 2z)^5$ 中，$x^2yz^2$ 项为 $\\frac{5!}{2! \\, 1! \\, 2!}(3x)^2(y)(-2z)^2 = 30 \\cdot 9 \\cdot 4 \\, x^2yz^2 = 1080x^2yz^2$。\n\n> **注意。** 要把每个常数取它的指数次幂，而不是乘以指数；还要保留符号，负常数的奇数次幂会使系数为负。",
      ),
      generate(rng) {
        const n = rng.int(3, 7);
        const cs = [rng.pick([2, 3, -2]), rng.pick([-1, 1, -3, 2]), rng.pick([1, -1, 2])];
        const a = rng.int(0, n);
        const b = rng.int(0, n - a);
        const ks = [a, b, n - a - b];
        const m = multinomial(ks);
        const value = ks.reduce((s, k, i) => s * cs[i]! ** k, m);
        const sum = cs.map((c, i) => coef(c, VARS[i]!, i === 0)).join("");
        const prod = value / m;
        const powers = cs.flatMap((c, i) => (ks[i]! === 0 || c === 1 ? [] : [ks[i] === 1 ? pn(c) : `${pn(c)}^{${ks[i]}}`]));
        const negPower = cs.reduce((s, c, i) => (c < 0 ? s + ks[i]! : s), 0);
        return numberProblem({
          prompt: t(
            `Find the coefficient of $${monoTex(ks)}$ in the expansion of $(${sum})^{${n}}$.`,
            `求 $(${sum})^{${n}}$ 展开式中 $${monoTex(ks)}$ 的系数。`,
          ),
          answer: value,
          mistakes: distinct(value, [
            why(m, "That leaves out the constants in front of the variables.", "那是漏掉了变量前面的常数。"),
            why(
              -value,
              "That has the wrong sign; count the negative constants raised to odd powers.",
              "那是符号错了；数一数取奇数次幂的负常数。",
            ),
            why(
              ks.reduce((s, k, i) => s * cs[i]! * (k > 0 ? k : 1), m),
              "That multiplies each constant by its exponent instead of raising it to that power.",
              "那是把每个常数乘以指数，而不是取指数次幂。",
            ),
            why(
              ks.reduce((s, k, i) => s * Math.abs(cs[i]!) ** k, m),
              "That drops the signs of the constants.",
              "那是丢掉了常数的符号。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the multinomial coefficient", "求多项式系数"],
                t(
                  `$\\frac{${n}!}{${ks.map((k) => `${k}!`).join(" \\, ")}} = ${m}$.`,
                  `$\\frac{${n}!}{${ks.map((k) => `${k}!`).join(" \\, ")}} = ${m}$。`,
                ),
              ],
              [
                ["Raise the constants", "常数取幂"],
                powers.length === 0
                  ? t(
                      "Every variable that appears has coefficient $1$, so the constants contribute $1$.",
                      "出现的每个变量的系数都是 $1$，所以常数部分为 $1$。",
                    )
                  : t(`$${powers.join(" \\cdot ")} = ${prod}$.`, `$${powers.join(" \\cdot ")} = ${prod}$。`),
              ],
              ...(m === 1 || prod === 1
                ? []
                : [[["Multiply", "相乘"], t(`$${m} \\cdot ${pn(prod)} = ${value}$.`, `$${m} \\cdot ${pn(prod)} = ${value}$。`)] as const]),
            ],
            t(
              `The negative constants are raised to a total power of $${negPower}$, which is ${negPower % 2 === 0 ? "even" : "odd"}, so the coefficient is ${value > 0 ? "positive" : "negative"}, as $${value}$ is.`,
              `负常数的指数之和为 $${negPower}$，是${negPower % 2 === 0 ? "偶数" : "奇数"}，所以系数为${value > 0 ? "正" : "负"}，与 $${value}$ 一致。`,
            ),
          ),
        });
      },
    },
  ],
};

/** countingTermsInMultinomialExpansions counts the distinct monomials of (x₁ + ⋯ + xₘ)ⁿ. */
export const countingTermsInMultinomialExpansions: TopicDef = {
  id: "counting-terms-in-multinomial-expansions",
  title: t("Counting Terms in Multinomial Expansions", "计数多项式展开式的项数"),
  summary: t(
    "After collecting like terms, (x₁ + ⋯ + xₘ)ⁿ has one term for each solution of k₁ + ⋯ + kₘ = n in nonnegative integers: C(n + m − 1, m − 1) terms.",
    "合并同类项后，(x₁ + ⋯ + xₘ)ⁿ 对 k₁ + ⋯ + kₘ = n 的每组非负整数解有一项：共 C(n + m − 1, m − 1) 项。",
  ),
  intro: t(
    "After collecting like terms, $(x + y)^5$ has the terms $x^5, x^4y, x^3y^2, x^2y^3, xy^4, y^5$: one for each way to split the exponent $5$ between $x$ and $y$, so $6$ terms, which is $\\binom{5 + 1}{1}$.\n\nCheck: the binomial theorem gives exactly the powers $x^{5-k}y^k$ for $k = 0, 1, \\ldots, 5$, which is $6$ values of $k$.\n\nIn this lesson we count the terms of $(x_1 + \\cdots + x_m)^n$ with stars and bars, and count the terms that contain a given variable.",
    "合并同类项后，$(x + y)^5$ 的项为 $x^5, x^4y, x^3y^2, x^2y^3, xy^4, y^5$：每一种把指数 $5$ 分给 $x$ 和 $y$ 的方式对应一项，共 $6$ 项，即 $\\binom{5 + 1}{1}$。\n\n检验：二项式定理恰好给出 $k = 0, 1, \\ldots, 5$ 时的幂 $x^{5-k}y^k$，共 $6$ 个 $k$ 值。\n\n本课我们用隔板法计数 $(x_1 + \\cdots + x_m)^n$ 的项数，并计数含某个变量的项。",
  ),
  prerequisites: ["the-multinomial-theorem", "counting-integer-solutions-of-a-constrained-equation"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "number-of-terms-in-an-expansion",
      title: t("The number of terms", "项数"),
      explanation: t(
        "Each term corresponds to a way of splitting the exponent among the variables, which is counted by stars and bars. The terms of $(x + y + z)^{15}$ are $x^ay^bz^c$ with $a + b + c = 15$: $\\binom{15 + 2}{2} = 136$ terms.\n\n> **Watch out.** Use $m - 1$ bars for $m$ variables, not $m$; and do not count $m^n$, which counts the products before like terms are collected.",
        "每一项对应把指数分配给各个变量的一种方式，可以用隔板法计数。$(x + y + z)^{15}$ 的项是满足 $a + b + c = 15$ 的 $x^ay^bz^c$：共 $\\binom{15 + 2}{2} = 136$ 项。\n\n> **注意。** $m$ 个变量要用 $m - 1$ 个隔板，而不是 $m$ 个；也不要算 $m^n$，那是合并同类项之前的乘积个数。",
      ),
      generate(rng) {
        const m = rng.int(3, 6);
        const n = rng.int(2, 12);
        const value = choose(n + m - 1, m - 1);
        const sum =
          m <= 4
            ? VARS.slice(0, m).join(" + ")
            : `${range(1, m)
                .map((i) => `x_{${i}}`)
                .join(" + ")}`;
        return numberProblem({
          prompt: t(
            `After like terms are collected, how many terms does the expansion of $(${sum})^{${n}}$ have?`,
            `合并同类项后，$(${sum})^{${n}}$ 的展开式有多少项？`,
          ),
          answer: value,
          mistakes: distinct(value, [
            why(
              m ** n,
              `That counts all $${m}^{${n}}$ products before like terms are collected.`,
              `那是合并同类项之前全部 $${m}^{${n}}$ 个乘积的个数。`,
            ),
            why(n + 1, "That is the count for two variables.", "那是两个变量时的项数。"),
            why(
              choose(n + m, m - 1),
              `That uses $${n + m}$ positions; $${n}$ stars and $${m - 1}$ bars fill $${n + m - 1}$.`,
              `那是用了 $${n + m}$ 个位置；$${n}$ 颗星和 $${m - 1}$ 个隔板只占 $${n + m - 1}$ 个。`,
            ),
            why(
              choose(n + m - 1, m),
              `That uses $${m}$ bars; $${m}$ variables need $${m - 1}$.`,
              `那是用了 $${m}$ 个隔板；$${m}$ 个变量只需 $${m - 1}$ 个。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Describe the terms", "描述各项"],
                t(
                  `Each term is fixed by its exponents $k_1 + \\cdots + k_{${m}} = ${n}$ in nonnegative integers.`,
                  `每一项由满足 $k_1 + \\cdots + k_{${m}} = ${n}$ 的非负整数指数确定。`,
                ),
              ],
              [
                ["Count with stars and bars", "用隔板法计数"],
                t(
                  `$${n}$ stars and $${m - 1}$ bars: $\\binom{${n} + ${m - 1}}{${m - 1}} = \\binom{${n + m - 1}}{${m - 1}} = ${value}$.`,
                  `$${n}$ 颗星和 $${m - 1}$ 个隔板：$\\binom{${n} + ${m - 1}}{${m - 1}} = \\binom{${n + m - 1}}{${m - 1}} = ${value}$。`,
                ),
              ],
            ],
            t(
              `Grouping the terms by the exponent $j$ of the first variable gives $\\sum_{j=0}^{${n}} \\binom{${n} - j + ${m - 2}}{${m - 2}}$, which the hockey-stick identity turns back into $\\binom{${n + m - 1}}{${m - 1}} = ${value}$.`,
              `按第一个变量的指数 $j$ 分组得 $\\sum_{j=0}^{${n}} \\binom{${n} - j + ${m - 2}}{${m - 2}}$，由曲棍球棒恒等式它又等于 $\\binom{${n + m - 1}}{${m - 1}} = ${value}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "terms-containing-a-given-variable",
      title: t("Terms containing a variable", "含某变量的项"),
      explanation: t(
        "Count the terms that leave the variable out, which form a smaller expansion, and subtract them from the total number of terms. Of the $120$ terms of $(x + y + z)^{14}$, those without $x$ are the $15$ terms of $(y + z)^{14}$, so $105$ terms contain $x$.\n\n> **Watch out.** Subtract the terms without the variable from all the terms; neither count alone is the answer, and the terms are not shared equally among the variables.",
        "数出不含这个变量的项，它们构成一个较小的展开式，再从总项数中减去。在 $(x + y + z)^{14}$ 的 $120$ 项中，不含 $x$ 的是 $(y + z)^{14}$ 的 $15$ 项，所以含 $x$ 的有 $105$ 项。\n\n> **注意。** 要从全部项数中减去不含该变量的项数；两个数单独都不是答案，各项也不是在变量之间平均分配的。",
      ),
      generate(rng) {
        const m = rng.int(3, 4);
        const n = rng.int(2, 12);
        const all = choose(n + m - 1, m - 1);
        const without = choose(n + m - 2, m - 2);
        const value = all - without;
        const v = rng.pick(VARS.slice(0, m));
        const sum = VARS.slice(0, m).join(" + ");
        return numberProblem({
          prompt: t(
            `After like terms are collected, how many terms of the expansion of $(${sum})^{${n}}$ contain $${v}$?`,
            `合并同类项后，$(${sum})^{${n}}$ 的展开式中有多少项含 $${v}$？`,
          ),
          answer: value,
          mistakes: distinct(value, [
            why(all, `That counts every term, including those without $${v}$.`, `那是数了全部项，包括不含 $${v}$ 的项。`),
            why(without, `That counts the terms without $${v}$.`, `那是数了不含 $${v}$ 的项。`),
            why(Math.round(all / m), "That assumes the terms are shared equally among the variables.", "那是假设各项在变量之间平均分配。"),
            why(
              n,
              `That counts only the powers of $${v}$ from $${v}$ to $${v}^{${n}}$, ignoring the other variables.`,
              `那是只数了 $${v}$ 到 $${v}^{${n}}$ 的幂，忽略了其他变量。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Count all terms", "数全部项"],
                t(`$\\binom{${n + m - 1}}{${m - 1}} = ${all}$.`, `$\\binom{${n + m - 1}}{${m - 1}} = ${all}$。`),
              ],
              [
                ["Count the terms without the variable", "数不含该变量的项"],
                t(
                  `They come from a sum of $${m - 1}$ variables: $\\binom{${n + m - 2}}{${m - 2}} = ${without}$.`,
                  `它们来自 $${m - 1}$ 个变量之和：$\\binom{${n + m - 2}}{${m - 2}} = ${without}$。`,
                ),
              ],
              [["Subtract", "相减"], t(`$${all} - ${without} = ${value}$.`, `$${all} - ${without} = ${value}$。`)],
            ],
            t(
              `A term containing $${v}$ is $${v}$ times a term of degree $${n - 1}$ in all $${m}$ variables, and there are $\\binom{${n - 1 + m - 1}}{${m - 1}} = ${value}$ of those.`,
              `含 $${v}$ 的项等于 $${v}$ 乘以 $${m}$ 个变量的一个 $${n - 1}$ 次项，这样的项有 $\\binom{${n - 1 + m - 1}}{${m - 1}} = ${value}$ 个。`,
            ),
          ),
        });
      },
    },
  ],
};

/** discreteMathematicsSeriesTopics are the new topics of Discrete Mathematics unit 5. */
export const discreteMathematicsSeriesTopics: readonly TopicDef[] = [
  finiteLinearSeries,
  finiteQuadraticSeries,
  finiteCubicSeries,
  theGeneralizedBinomialTheorem,
  workingWithTheGeneralizedBinomialTheorem,
  determiningRangesOfValidityForGeneralizedBinomialExpansions,
  approximatingValuesUsingTheGeneralizedBinomialTheorem,
  theMultinomialTheorem,
  countingTermsInMultinomialExpansions,
];
