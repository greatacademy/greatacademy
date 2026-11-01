import type { Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, Q } from "@ga/subject-math";

import { numberProblem } from "../problems.ts";
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

/** finiteLinearSeries sums linear expressions with Σk = n(n + 1)/2. */
export const finiteLinearSeries: TopicDef = {
  id: "finite-linear-series",
  title: t("Finite Linear Series", "有限线性级数"),
  summary: t(
    "1 + 2 + ⋯ + n = n(n + 1)/2, so Σₖ₌₁ⁿ (ak + b) = a·n(n + 1)/2 + bn; a sum starting at m is the sum to n minus the sum to m − 1.",
    "1 + 2 + ⋯ + n = n(n + 1)/2，所以 Σₖ₌₁ⁿ (ak + b) = a·n(n + 1)/2 + bn；从 m 开始的和等于到 n 的和减去到 m − 1 的和。",
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
        "$\\sum_{k=1}^{20} (3k - 2) = 3\\sum_{k=1}^{20} k - 2 \\cdot 20 = 3 \\cdot \\frac{20 \\cdot 21}{2} - 40 = 590$. The constant is added $n$ times, not once.",
        "$\\sum_{k=1}^{20} (3k - 2) = 3\\sum_{k=1}^{20} k - 2 \\cdot 20 = 3 \\cdot \\frac{20 \\cdot 21}{2} - 40 = 590$。常数要加 $n$ 次，而不是一次。",
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
        return numberProblem({
          prompt: t(`Evaluate $${sumTex(1, n, body)}$.`, `计算 $${sumTex(1, n, body)}$。`),
          answer: value,
          wrong: [a * s1(n) + b, a * s1(n - 1) + b * n, a * n * n + b * n, (a * n * (n - 1)) / 2 + b * n],
          solution: t(
            `$${a}\\sum k ${b < 0 ? "-" : "+"} ${Math.abs(b)} \\cdot ${n} = ${a} \\cdot \\frac{${n} \\cdot ${n + 1}}{2} ${b < 0 ? "-" : "+"} ${Math.abs(b * n)} = ${value}$.`,
            `$${a}\\sum k ${b < 0 ? "-" : "+"} ${Math.abs(b)} \\cdot ${n} = ${a} \\cdot \\frac{${n} \\cdot ${n + 1}}{2} ${b < 0 ? "-" : "+"} ${Math.abs(b * n)} = ${value}$。`,
          ),
        });
      },
    },
    {
      id: "linear-sums-with-a-shifted-start",
      title: t("Sums not starting at 1", "不从 1 开始的和"),
      explanation: t(
        "$\\sum_{k=11}^{30} k = \\sum_{k=1}^{30} k - \\sum_{k=1}^{10} k = 465 - 55 = 410$. Subtract up to $m - 1$, not up to $m$.",
        "$\\sum_{k=11}^{30} k = \\sum_{k=1}^{30} k - \\sum_{k=1}^{10} k = 465 - 55 = 410$。减去到 $m - 1$ 的和，而不是到 $m$ 的和。",
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
          wrong: [brute(m + 1, n, f), brute(1, n, f), brute(m, n - 1, f), value + b],
          solution: t(
            `There are $${n - m + 1}$ terms: $${sumTex(1, n, body)} - ${sumTex(1, m - 1, body)} = ${brute(1, n, f)} - ${brute(1, m - 1, f)} = ${value}$.`,
            `共有 $${n - m + 1}$ 项：$${sumTex(1, n, body)} - ${sumTex(1, m - 1, body)} = ${brute(1, n, f)} - ${brute(1, m - 1, f)} = ${value}$。`,
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
  prerequisites: ["finite-linear-series"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "sums-of-quadratic-expressions",
      title: t("Sums of quadratic expressions", "二次式的和"),
      explanation: t(
        "$\\sum_{k=1}^{10} (k^2 + 2k) = \\frac{10 \\cdot 11 \\cdot 21}{6} + 2 \\cdot \\frac{10 \\cdot 11}{2} = 385 + 110 = 495$.",
        "$\\sum_{k=1}^{10} (k^2 + 2k) = \\frac{10 \\cdot 11 \\cdot 21}{6} + 2 \\cdot \\frac{10 \\cdot 11}{2} = 385 + 110 = 495$。",
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
        return numberProblem({
          prompt: t(`Evaluate $${sumTex(1, n, body)}$.`, `计算 $${sumTex(1, n, body)}$。`),
          answer: value,
          wrong: [
            a * s1(n) ** 2 + b * s1(n) + c * n,
            a * s2(n) + b * s1(n) + c,
            a * n * n + b * n + c,
            a * ((n * (n + 1) * (n + 2)) / 6) + b * s1(n) + c * n,
          ],
          solution: t(
            `$\\sum k^2 = \\frac{${n} \\cdot ${n + 1} \\cdot ${2 * n + 1}}{6} = ${s2(n)}$ and $\\sum k = ${s1(n)}$, so the sum is $${a} \\cdot ${s2(n)} + ${pn(b)} \\cdot ${s1(n)} + ${pn(c)} \\cdot ${n} = ${value}$.`,
            `$\\sum k^2 = \\frac{${n} \\cdot ${n + 1} \\cdot ${2 * n + 1}}{6} = ${s2(n)}$，$\\sum k = ${s1(n)}$，所以和为 $${a} \\cdot ${s2(n)} + ${pn(b)} \\cdot ${s1(n)} + ${pn(c)} \\cdot ${n} = ${value}$。`,
          ),
        });
      },
    },
    {
      id: "sums-of-squares-in-a-range",
      title: t("Sums of squares in a range", "某范围内的平方和"),
      explanation: t(
        "$11^2 + 12^2 + \\cdots + 20^2 = \\sum_{k=1}^{20} k^2 - \\sum_{k=1}^{10} k^2 = 2870 - 385 = 2485$.",
        "$11^2 + 12^2 + \\cdots + 20^2 = \\sum_{k=1}^{20} k^2 - \\sum_{k=1}^{10} k^2 = 2870 - 385 = 2485$。",
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
            wrong: [Math.round(s2(2 * N - 1) / 2), s2(2 * N - 1) - s2(N), 4 * s2(N) - s1(N) + N],
            solution: t(
              `$\\sum_{k=1}^{${N}} (2k - 1)^2 = 4\\sum k^2 - 4\\sum k + ${N} = 4 \\cdot ${s2(N)} - 4 \\cdot ${s1(N)} + ${N} = ${v}$.`,
              `$\\sum_{k=1}^{${N}} (2k - 1)^2 = 4\\sum k^2 - 4\\sum k + ${N} = 4 \\cdot ${s2(N)} - 4 \\cdot ${s1(N)} + ${N} = ${v}$。`,
            ),
          });
        }
        return numberProblem({
          prompt: t(`Evaluate $${sumTex(m, n, "k^2")}$.`, `计算 $${sumTex(m, n, "k^2")}$。`),
          answer: value,
          wrong: [s2(n) - s2(m), s2(n - m + 1), s2(n), (s1(n) - s1(m - 1)) ** 2],
          solution: t(
            `$${sumTex(1, n, "k^2")} - ${sumTex(1, m - 1, "k^2")} = ${s2(n)} - ${s2(m - 1)} = ${value}$.`,
            `$${sumTex(1, n, "k^2")} - ${sumTex(1, m - 1, "k^2")} = ${s2(n)} - ${s2(m - 1)} = ${value}$。`,
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
  prerequisites: ["finite-quadratic-series"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "sums-of-cubes",
      title: t("Sums of cubes", "立方和"),
      explanation: t(
        "$\\sum_{k=1}^{10} k^3 = \\left(\\frac{10 \\cdot 11}{2}\\right)^2 = 55^2 = 3025$, and $\\sum_{k=6}^{10} k^3 = 3025 - 15^2 = 2800$.",
        "$\\sum_{k=1}^{10} k^3 = \\left(\\frac{10 \\cdot 11}{2}\\right)^2 = 55^2 = 3025$，$\\sum_{k=6}^{10} k^3 = 3025 - 15^2 = 2800$。",
      ),
      generate(rng) {
        const m = rng.bool() ? 1 : rng.int(3, 12);
        const n = m + rng.int(4, 20);
        const value = s3(n) - s3(m - 1);
        return numberProblem({
          prompt: t(`Evaluate $${sumTex(m, n, "k^3")}$.`, `计算 $${sumTex(m, n, "k^3")}$。`),
          answer: value,
          wrong: [s3(n) - s3(m), s1(n) ** 3, s2(n) * s1(n), m === 1 ? s1(n) * (n + 1) : s3(n)],
          solution:
            m === 1
              ? t(
                  `$${sumTex(1, n, "k^3")} = \\left(\\frac{${n} \\cdot ${n + 1}}{2}\\right)^2 = ${s1(n)}^2 = ${value}$.`,
                  `$${sumTex(1, n, "k^3")} = \\left(\\frac{${n} \\cdot ${n + 1}}{2}\\right)^2 = ${s1(n)}^2 = ${value}$。`,
                )
              : t(
                  `$${sumTex(1, n, "k^3")} - ${sumTex(1, m - 1, "k^3")} = ${s1(n)}^2 - ${s1(m - 1)}^2 = ${value}$.`,
                  `$${sumTex(1, n, "k^3")} - ${sumTex(1, m - 1, "k^3")} = ${s1(n)}^2 - ${s1(m - 1)}^2 = ${value}$。`,
                ),
        });
      },
    },
    {
      id: "sums-of-cubic-expressions",
      title: t("Sums of cubic expressions", "三次式的和"),
      explanation: t(
        "Expand first: $\\sum_{k=1}^{n} k(k + 1)^2 = \\sum (k^3 + 2k^2 + k)$. For $n = 5$: $225 + 2 \\cdot 55 + 15 = 350$.",
        "先展开：$\\sum_{k=1}^{n} k(k + 1)^2 = \\sum (k^3 + 2k^2 + k)$。$n = 5$ 时：$225 + 2 \\cdot 55 + 15 = 350$。",
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
        return numberProblem({
          prompt: t(`Evaluate $${sumTex(1, n, body)}$.`, `计算 $${sumTex(1, n, body)}$。`),
          answer: value,
          wrong: [s3(n) + coeffs[1]! * s2(n), s1(n) * f(n), s3(n), value - coeffs[2]! * s1(n) + coeffs[2]!],
          solution: t(
            `$${body} = ${expanded}$, so the sum is $${s3(n)} + ${coeffs[1]! < 0 ? `(${coeffs[1]})` : coeffs[1]} \\cdot ${s2(n)} + ${coeffs[2]} \\cdot ${s1(n)} = ${value}$.`,
            `$${body} = ${expanded}$，所以和为 $${s3(n)} + ${coeffs[1]! < 0 ? `(${coeffs[1]})` : coeffs[1]} \\cdot ${s2(n)} + ${coeffs[2]} \\cdot ${s1(n)} = ${value}$。`,
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

/** theGeneralizedBinomialTheorem expands (1 + x)ʳ for any rational r. */
export const theGeneralizedBinomialTheorem: TopicDef = {
  id: "the-generalized-binomial-theorem",
  title: t("The Generalized Binomial Theorem", "广义二项式定理"),
  summary: t(
    "For any real r and |x| < 1, (1 + x)ʳ = Σₖ C(r, k) xᵏ, where C(r, k) = r(r − 1)⋯(r − k + 1)/k!. Unless r is a natural number, the series never ends.",
    "对任意实数 r 和 |x| < 1，(1 + x)ʳ = Σₖ C(r, k) xᵏ，其中 C(r, k) = r(r − 1)⋯(r − k + 1)/k!。除非 r 是自然数，否则级数不会终止。",
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
        "$\\binom{-1/2}{3} = \\frac{(-\\frac{1}{2})(-\\frac{3}{2})(-\\frac{5}{2})}{3!} = \\frac{-15/8}{6} = -\\frac{5}{16}$: multiply $k$ factors, each one less than the last, and divide by $k!$.",
        "$\\binom{-1/2}{3} = \\frac{(-\\frac{1}{2})(-\\frac{3}{2})(-\\frac{5}{2})}{3!} = \\frac{-15/8}{6} = -\\frac{5}{16}$：把 $k$ 个依次减一的因子相乘，再除以 $k!$。",
      ),
      generate(rng) {
        const r = rng.pick(EXPONENTS);
        const k = rng.int(2, 4);
        const value = genChoose(r, k);
        return numberProblem({
          prompt: t(
            `Evaluate the generalized binomial coefficient $\\binom{${r.toLatex()}}{${k}}$.`,
            `计算广义二项式系数 $\\binom{${r.toLatex()}}{${k}}$。`,
          ),
          answer: value,
          wrong: [
            value.neg(),
            value.mul(Q.of(fact(k))),
            genChoose(r, k - 1),
            range(0, k - 1)
              .reduce((s, i) => s.mul(r.add(Q.of(i))), Q.of(1))
              .div(Q.of(fact(k))),
          ],
          solution: t(
            `$\\binom{${r.toLatex()}}{${k}} = \\frac{${factorsTex(r, k)}}{${k}!} = ${value.toLatex()}$.`,
            `$\\binom{${r.toLatex()}}{${k}} = \\frac{${factorsTex(r, k)}}{${k}!} = ${value.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "coefficients-in-generalized-expansions",
      title: t("Coefficients of (1 + cx)ʳ", "(1 + cx)ʳ 的系数"),
      explanation: t(
        "In $(1 - 2x)^{-3}$, the $x^2$ term is $\\binom{-3}{2}(-2x)^2 = 6 \\cdot 4x^2 = 24x^2$. Raise $c$, sign included, to the power $k$.",
        "在 $(1 - 2x)^{-3}$ 中，$x^2$ 项为 $\\binom{-3}{2}(-2x)^2 = 6 \\cdot 4x^2 = 24x^2$。要把 $c$ 连同符号一起取 $k$ 次方。",
      ),
      generate(rng) {
        const r = rng.pick(EXPONENTS);
        const c = rng.pick([-4, -3, -2, -1, 2, 3, 4]);
        const k = rng.int(1, 3);
        const value = genChoose(r, k).mul(Q.of(c).pow(k));
        const inner = `1 ${c < 0 ? "-" : "+"} ${Math.abs(c) === 1 ? "" : Math.abs(c)}x`;
        return numberProblem({
          prompt: t(
            `Find the coefficient of $${xk(k)}$ in the expansion of $(${inner})^${rTex(r)}$.`,
            `求 $(${inner})^${rTex(r)}$ 展开式中 $${xk(k)}$ 的系数。`,
          ),
          answer: value,
          wrong: [
            genChoose(r, k).mul(Q.of(c)),
            genChoose(r, k),
            genChoose(r, k).mul(Q.of(-c).pow(k)),
            genChoose(r, k)
              .mul(Q.of(c).pow(k))
              .mul(Q.of(fact(k))),
          ],
          solution: t(
            `The $${xk(k)}$ term is $\\binom{${r.toLatex()}}{${k}}(${c}x)^{${k}} = ${genChoose(r, k).toLatex()} \\cdot ${pq(Q.of(c).pow(k))}${xk(k)}$, so the coefficient is $${value.toLatex()}$.`,
            `$${xk(k)}$ 项为 $\\binom{${r.toLatex()}}{${k}}(${c}x)^{${k}} = ${genChoose(r, k).toLatex()} \\cdot ${pq(Q.of(c).pow(k))}${xk(k)}$，所以系数为 $${value.toLatex()}$。`,
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
  prerequisites: ["the-generalized-binomial-theorem"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "expanding-a-plus-bx-to-a-power",
      title: t("Expanding (a + bx)ʳ", "展开 (a + bx)ʳ"),
      explanation: t(
        "$\\sqrt{4 + x} = 2\\left(1 + \\frac{x}{4}\\right)^{1/2} = 2\\left(1 + \\frac{x}{8} - \\frac{x^2}{128} + \\cdots\\right)$, so the $x^2$ coefficient is $-\\frac{1}{64}$. Forgetting the factor $a^r$ is the usual slip.",
        "$\\sqrt{4 + x} = 2\\left(1 + \\frac{x}{4}\\right)^{1/2} = 2\\left(1 + \\frac{x}{8} - \\frac{x^2}{128} + \\cdots\\right)$，所以 $x^2$ 的系数为 $-\\frac{1}{64}$。常见错误是漏掉因子 $a^r$。",
      ),
      generate(rng) {
        const { a, r, ar } = randomBase(rng);
        const b = rng.pick([-3, -2, -1, 1, 2, 3]);
        const k = rng.int(1, 2);
        const ratio = Q.of(b, a);
        const value = ar.mul(genChoose(r, k)).mul(ratio.pow(k));
        const inner = `${a} ${b < 0 ? "-" : "+"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}x`;
        return numberProblem({
          prompt: t(
            `Find the coefficient of $${xk(k)}$ in the expansion of $(${inner})^${rTex(r)}$.`,
            `求 $(${inner})^${rTex(r)}$ 展开式中 $${xk(k)}$ 的系数。`,
          ),
          answer: value,
          wrong: [
            genChoose(r, k).mul(ratio.pow(k)),
            ar.mul(genChoose(r, k)).mul(Q.of(b).pow(k)),
            ar.mul(genChoose(r, k)).mul(ratio),
            Q.of(a).mul(genChoose(r, k)).mul(ratio.pow(k)),
          ],
          solution: t(
            `$(${inner})^${rTex(r)} = ${ar.toLatex()}\\left(1 ${ratio.sign() < 0 ? "-" : "+"} ${qx(ratio.abs())}\\right)^${rTex(r)}$, so the coefficient is $${ar.toLatex()} \\cdot ${pq(genChoose(r, k))} \\cdot \\left(${ratio.toLatex()}\\right)^{${k}} = ${value.toLatex()}$.`,
            `$(${inner})^${rTex(r)} = ${ar.toLatex()}\\left(1 ${ratio.sign() < 0 ? "-" : "+"} ${qx(ratio.abs())}\\right)^${rTex(r)}$，所以系数为 $${ar.toLatex()} \\cdot ${pq(genChoose(r, k))} \\cdot \\left(${ratio.toLatex()}\\right)^{${k}} = ${value.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "products-with-generalized-expansions",
      title: t("Products with expansions", "与展开式相乘"),
      explanation: t(
        "In $(2 + x)(1 - x)^{-1} = (2 + x)(1 + x + x^2 + \\cdots)$, the $x^2$ coefficient is $2 \\cdot 1 + 1 \\cdot 1 = 3$: pair $2$ with the $x^2$ term and $x$ with the $x$ term.",
        "在 $(2 + x)(1 - x)^{-1} = (2 + x)(1 + x + x^2 + \\cdots)$ 中，$x^2$ 的系数为 $2 \\cdot 1 + 1 \\cdot 1 = 3$：$2$ 配 $x^2$ 项，$x$ 配 $x$ 项。",
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
        return numberProblem({
          prompt: t(
            `Find the coefficient of $${xk(k)}$ in the expansion of $(${lin})(${inner})^${rTex(r)}$.`,
            `求 $(${lin})(${inner})^${rTex(r)}$ 展开式中 $${xk(k)}$ 的系数。`,
          ),
          answer: value,
          wrong: [
            Q.of(p).mul(term(k)),
            Q.of(q).mul(term(k - 1)),
            Q.of(p + q).mul(term(k)),
            Q.of(p)
              .mul(term(k - 1))
              .add(Q.of(q).mul(term(k))),
          ],
          solution: t(
            `The expansion has $${xk(k - 1)}$ coefficient $${term(k - 1).toLatex()}$ and $${xk(k)}$ coefficient $${term(k).toLatex()}$, so the answer is $${p} \\cdot ${pq(term(k))} + ${pn(q)} \\cdot ${pq(term(k - 1))} = ${value.toLatex()}$.`,
            `展开式中 $${xk(k - 1)}$ 的系数为 $${term(k - 1).toLatex()}$，$${xk(k)}$ 的系数为 $${term(k).toLatex()}$，所以答案为 $${p} \\cdot ${pq(term(k))} + ${pn(q)} \\cdot ${pq(term(k - 1))} = ${value.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** determiningRangesOfValidityForGeneralizedBinomialExpansions finds where expansions converge. */
export const determiningRangesOfValidityForGeneralizedBinomialExpansions: TopicDef = {
  id: "determining-ranges-of-validity-for-generalized-binomial-expansions",
  title: t("Determining Ranges of Validity for Generalized Binomial Expansions", "确定广义二项式展开的有效范围"),
  summary: t(
    "(1 + u)ʳ = Σ C(r, k)uᵏ holds for |u| < 1, so (a + bx)ʳ expands for |bx/a| < 1, that is, |x| < |a/b|. A product of expansions is valid where both are.",
    "(1 + u)ʳ = Σ C(r, k)uᵏ 在 |u| < 1 时成立，所以 (a + bx)ʳ 在 |bx/a| < 1，即 |x| < |a/b| 时可以展开。展开式之积在两者都有效处有效。",
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
        "$(9 - 2x)^{1/2} = 3\\left(1 - \\frac{2x}{9}\\right)^{1/2}$ is valid for $\\left|\\frac{2x}{9}\\right| < 1$, that is, $|x| < \\frac{9}{2}$.",
        "$(9 - 2x)^{1/2} = 3\\left(1 - \\frac{2x}{9}\\right)^{1/2}$ 在 $\\left|\\frac{2x}{9}\\right| < 1$，即 $|x| < \\frac{9}{2}$ 时有效。",
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
        if (answer === undefined) {
          const s = Q.of(a * a, Math.abs(b));
          const inner2 = `${a * a} ${b < 0 ? "-" : "+"} ${Math.abs(b)}x^2`;
          return numberProblem({
            prompt: t(
              `The expansion of $(${inner2})^${rTex(r)}$ in powers of $x$ is valid for $x^2 < c$. Find $c$.`,
              `$(${inner2})^${rTex(r)}$ 按 $x$ 的幂展开，在 $x^2 < c$ 时有效。求 $c$。`,
            ),
            answer: s,
            wrong: [Q.of(Math.abs(b), a * a), Q.of(a, Math.abs(b)), Q.of(1)],
            solution: t(
              `We need $\\left|\\frac{${Math.abs(b)}x^2}{${a * a}}\\right| < 1$, so $x^2 < ${s.toLatex()}$.`,
              `需要 $\\left|\\frac{${Math.abs(b)}x^2}{${a * a}}\\right| < 1$，所以 $x^2 < ${s.toLatex()}$。`,
            ),
          });
        }
        return numberProblem({
          prompt: t(
            `The expansion of $(${inner})^${rTex(r)}$ in powers of $x$ is valid for $|x| < c$. Find $c$.`,
            `$(${inner})^${rTex(r)}$ 按 $x$ 的幂展开，在 $|x| < c$ 时有效。求 $c$。`,
          ),
          answer,
          wrong: [Q.of(Math.abs(b), a), Q.of(1), Q.of(a), Q.of(1, Math.abs(b))],
          solution: t(
            `$(${inner})^${rTex(r)} = ${a}^${rTex(r)}\\left(1 ${b < 0 ? "-" : "+"} ${qx(Q.of(Math.abs(b), a))}\\right)^${rTex(r)}$ is valid for $\\left|\\frac{${Math.abs(b)}x}{${a}}\\right| < 1$, that is, $|x| < ${value.toLatex()}$.`,
            `$(${inner})^${rTex(r)} = ${a}^${rTex(r)}\\left(1 ${b < 0 ? "-" : "+"} ${qx(Q.of(Math.abs(b), a))}\\right)^${rTex(r)}$ 在 $\\left|\\frac{${Math.abs(b)}x}{${a}}\\right| < 1$，即 $|x| < ${value.toLatex()}$ 时有效。`,
          ),
        });
      },
    },
    {
      id: "range-of-validity-of-a-product",
      title: t("Products of expansions", "展开式之积"),
      explanation: t(
        "$(1 + 2x)^{-1}$ needs $|x| < \\frac{1}{2}$ and $(3 - x)^{1/2}$ needs $|x| < 3$. Their product's expansion needs both: $|x| < \\frac{1}{2}$.",
        "$(1 + 2x)^{-1}$ 需要 $|x| < \\frac{1}{2}$，$(3 - x)^{1/2}$ 需要 $|x| < 3$。乘积的展开需要两者同时成立：$|x| < \\frac{1}{2}$。",
      ),
      generate(rng) {
        const [a1, a2] = [rng.int(1, 9), rng.int(1, 9)];
        const [b1, b2] = [rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]), rng.pick([-4, -3, -2, -1, 1, 2, 3, 4])];
        const [r1, r2] = rng.sample(EXPONENTS, 2);
        const c1 = Q.of(a1, Math.abs(b1));
        const c2 = Q.of(a2, Math.abs(b2));
        if (c1.eq(c2)) return determiningRangesOfValidityForGeneralizedBinomialExpansions.knowledgePoints[1]!.generate(rng);
        const value = c1.cmp(c2) < 0 ? c1 : c2;
        const f = (a: number, b: number) => `${a} ${b < 0 ? "-" : "+"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}x`;
        return numberProblem({
          prompt: t(
            `The expansion of $(${f(a1, b1)})^${rTex(r1!)}(${f(a2, b2)})^${rTex(r2!)}$ in powers of $x$ is valid for $|x| < c$. Find the largest such $c$.`,
            `$(${f(a1, b1)})^${rTex(r1!)}(${f(a2, b2)})^${rTex(r2!)}$ 按 $x$ 的幂展开，在 $|x| < c$ 时有效。求最大的 $c$。`,
          ),
          answer: value,
          wrong: [c1.cmp(c2) < 0 ? c2 : c1, c1.mul(c2), Q.of(1)],
          solution: t(
            `The factors need $|x| < ${c1.toLatex()}$ and $|x| < ${c2.toLatex()}$; both hold for $|x| < ${value.toLatex()}$.`,
            `两个因子分别需要 $|x| < ${c1.toLatex()}$ 和 $|x| < ${c2.toLatex()}$；两者同时成立需 $|x| < ${value.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** APPROX are exponents whose coefficients have power-of-two denominators, so approximations terminate. */
const APPROX: readonly Q[] = [Q.of(1, 2), Q.of(-1, 2), Q.of(-1), Q.of(-2), Q.of(3, 2), Q.of(1, 4)];

/** approximatingValuesUsingTheGeneralizedBinomialTheorem truncates generalized expansions. */
export const approximatingValuesUsingTheGeneralizedBinomialTheorem: TopicDef = {
  id: "approximating-values-using-the-generalized-binomial-theorem",
  title: t("Approximating Values Using the Generalized Binomial Theorem", "用广义二项式定理求近似值"),
  summary: t(
    "For small u, (1 + u)ʳ ≈ 1 + ru + C(r, 2)u²; numbers like √102 = 10(1 + 0.02)^(1/2) can be approximated this way.",
    "当 u 很小时，(1 + u)ʳ ≈ 1 + ru + C(r, 2)u²；像 √102 = 10(1 + 0.02)^(1/2) 这样的数可以这样近似。",
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
        "$\\sqrt{1.04} = (1 + 0.04)^{1/2} \\approx 1 + \\frac{1}{2}(0.04) - \\frac{1}{8}(0.04)^2 = 1.0198$; the true value is $1.01980\\ldots$",
        "$\\sqrt{1.04} = (1 + 0.04)^{1/2} \\approx 1 + \\frac{1}{2}(0.04) - \\frac{1}{8}(0.04)^2 = 1.0198$；真实值为 $1.01980\\ldots$",
      ),
      generate(rng) {
        const r = rng.pick(APPROX);
        const u = Q.of(rng.nonZero(-5, 5) * 2, 100);
        const value = Q.of(1)
          .add(r.mul(u))
          .add(genChoose(r, 2).mul(u.pow(2)));
        const base = Q.of(1).add(u);
        return numberProblem({
          prompt: t(
            `Use the first three terms of the expansion of $(1 + x)^${rTex(r)}$ to approximate $${dec(base)}^${rTex(r)}$.`,
            `用 $(1 + x)^${rTex(r)}$ 展开式的前三项近似计算 $${dec(base)}^${rTex(r)}$。`,
          ),
          answer: value,
          form: "decimal",
          wrong: [
            Q.of(1).add(r.mul(u)),
            Q.of(1)
              .add(r.mul(u))
              .sub(genChoose(r, 2).mul(u.pow(2))),
            Q.of(1)
              .add(r.mul(u))
              .add(r.mul(r.sub(Q.of(1))).mul(u.pow(2))),
          ],
          solution: t(
            `With $x = ${dec(u)}$: $1 + ${pq(r)}(${dec(u)}) + ${pq(genChoose(r, 2))}(${dec(u)})^2 = ${dec(value)}$.`,
            `取 $x = ${dec(u)}$：$1 + ${pq(r)}(${dec(u)}) + ${pq(genChoose(r, 2))}(${dec(u)})^2 = ${dec(value)}$。`,
          ),
        });
      },
    },
    {
      id: "approximating-roots-by-factoring",
      title: t("Approximating roots", "近似计算方根"),
      explanation: t(
        "$\\sqrt{102} = 10\\left(1 + 0.02\\right)^{1/2} \\approx 10\\left(1 + 0.01 - 0.00005\\right) = 10.0995$. Factor out the nearest perfect square so that $u$ is small.",
        "$\\sqrt{102} = 10\\left(1 + 0.02\\right)^{1/2} \\approx 10\\left(1 + 0.01 - 0.00005\\right) = 10.0995$。提出最接近的完全平方数，使 $u$ 很小。",
      ),
      generate(rng) {
        const s = rng.pick([5, 10, 20, 30]);
        const d = rng.nonZero(-4, 4) * (s === 5 ? 1 : s === 10 ? 2 : s === 20 ? 8 : 9);
        const N = s * s + d;
        const u = Q.of(d, s * s);
        const r = Q.of(1, 2);
        const value = Q.of(s).mul(
          Q.of(1)
            .add(r.mul(u))
            .add(genChoose(r, 2).mul(u.pow(2))),
        );
        return numberProblem({
          prompt: t(
            `Write $\\sqrt{${N}} = ${s}\\left(1 + x\\right)^{1/2}$ and use the first three terms of the binomial expansion to approximate $\\sqrt{${N}}$.`,
            `把 $\\sqrt{${N}}$ 写成 $${s}\\left(1 + x\\right)^{1/2}$，用二项式展开的前三项近似计算 $\\sqrt{${N}}$。`,
          ),
          answer: value,
          form: "decimal",
          wrong: [
            Q.of(s).mul(Q.of(1).add(r.mul(u))),
            Q.of(1)
              .add(r.mul(u))
              .add(genChoose(r, 2).mul(u.pow(2))),
            Q.of(s).mul(
              Q.of(1)
                .add(r.mul(u))
                .sub(genChoose(r, 2).mul(u.pow(2))),
            ),
          ],
          solution: t(
            `$x = ${u.toLatex()} = ${dec(u)}$, so $\\sqrt{${N}} \\approx ${s}\\left(1 + \\frac{1}{2}(${dec(u)}) - \\frac{1}{8}(${dec(u)})^2\\right) = ${dec(value)}$.`,
            `$x = ${u.toLatex()} = ${dec(u)}$，所以 $\\sqrt{${N}} \\approx ${s}\\left(1 + \\frac{1}{2}(${dec(u)}) - \\frac{1}{8}(${dec(u)})^2\\right) = ${dec(value)}$。`,
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
    "(x₁ + ⋯ + xₘ)ⁿ = Σ n!/(k₁! ⋯ kₘ!) x₁^k₁ ⋯ xₘ^kₘ over all k₁ + ⋯ + kₘ = n: the coefficient counts arrangements of the factors.",
    "(x₁ + ⋯ + xₘ)ⁿ = Σ n!/(k₁! ⋯ kₘ!) x₁^k₁ ⋯ xₘ^kₘ，对所有 k₁ + ⋯ + kₘ = n 求和：系数计数各因子的排列方式。",
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
        "In $(x + y + z)^6$, the coefficient of $x^3y^2z$ is the number of ways to choose which of the $6$ factors give $x$, $y$ or $z$: $\\frac{6!}{3! \\, 2! \\, 1!} = 60$.",
        "在 $(x + y + z)^6$ 中，$x^3y^2z$ 的系数是选择 $6$ 个因子中哪些给出 $x$、$y$、$z$ 的方法数：$\\frac{6!}{3! \\, 2! \\, 1!} = 60$。",
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
        return numberProblem({
          prompt: t(
            `Find the coefficient of $${monoTex(ks)}$ in the expansion of $(${sum})^{${n}}$.`,
            `求 $(${sum})^{${n}}$ 展开式中 $${monoTex(ks)}$ 的系数。`,
          ),
          answer: value,
          wrong: [fact(n), choose(n, Math.max(...ks)), ks.reduce((a, b) => a * (b || 1), 1), Math.round(value / Math.max(...ks))],
          solution: t(
            `$\\frac{${n}!}{${ks.map((k) => `${k}!`).join(" \\, ")}} = ${value}$.`,
            `$\\frac{${n}!}{${ks.map((k) => `${k}!`).join(" \\, ")}} = ${value}$。`,
          ),
        });
      },
    },
    {
      id: "multinomial-coefficients-with-constants",
      title: t("Terms with coefficients", "带系数的项"),
      explanation: t(
        "In $(2x - y + z)^4$, the $x^2yz$ term is $\\frac{4!}{2! \\, 1! \\, 1!}(2x)^2(-y)(z) = 12 \\cdot 4 \\cdot (-1)x^2yz = -48x^2yz$.",
        "在 $(2x - y + z)^4$ 中，$x^2yz$ 项为 $\\frac{4!}{2! \\, 1! \\, 1!}(2x)^2(-y)(z) = 12 \\cdot 4 \\cdot (-1)x^2yz = -48x^2yz$。",
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
        return numberProblem({
          prompt: t(
            `Find the coefficient of $${monoTex(ks)}$ in the expansion of $(${sum})^{${n}}$.`,
            `求 $(${sum})^{${n}}$ 展开式中 $${monoTex(ks)}$ 的系数。`,
          ),
          answer: value,
          wrong: [m, -value, ks.reduce((s, k, i) => s * cs[i]! * (k > 0 ? k : 1), m), ks.reduce((s, k, i) => s * Math.abs(cs[i]!) ** k, m)],
          solution: t(
            `$\\frac{${n}!}{${ks.map((k) => `${k}!`).join(" \\, ")}} ${cs.map((c, i) => `(${c})^{${ks[i]}}`).join("")} = ${m} \\cdot ${value / m} = ${value}$.`,
            `$\\frac{${n}!}{${ks.map((k) => `${k}!`).join(" \\, ")}} ${cs.map((c, i) => `(${c})^{${ks[i]}}`).join("")} = ${m} \\cdot ${value / m} = ${value}$。`,
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
  prerequisites: ["the-multinomial-theorem", "counting-integer-solutions-of-a-constrained-equation"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "number-of-terms-in-an-expansion",
      title: t("The number of terms", "项数"),
      explanation: t(
        "The terms of $(x + y + z)^4$ are $x^ay^bz^c$ with $a + b + c = 4$: $\\binom{4 + 2}{2} = 15$ terms.",
        "$(x + y + z)^4$ 的项是满足 $a + b + c = 4$ 的 $x^ay^bz^c$：共 $\\binom{4 + 2}{2} = 15$ 项。",
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
          wrong: [m ** n, n + 1, choose(n + m, m - 1), choose(n + m - 1, m)],
          solution: t(
            `Count the exponent lists $k_1 + \\cdots + k_{${m}} = ${n}$: $\\binom{${n} + ${m - 1}}{${m - 1}} = ${value}$.`,
            `计数满足 $k_1 + \\cdots + k_{${m}} = ${n}$ 的指数组：$\\binom{${n} + ${m - 1}}{${m - 1}} = ${value}$。`,
          ),
        });
      },
    },
    {
      id: "terms-containing-a-given-variable",
      title: t("Terms containing a variable", "含某变量的项"),
      explanation: t(
        "Of the $15$ terms of $(x + y + z)^4$, those without $x$ are the $5$ terms of $(y + z)^4$, so $10$ terms contain $x$.",
        "在 $(x + y + z)^4$ 的 $15$ 项中，不含 $x$ 的是 $(y + z)^4$ 的 $5$ 项，所以含 $x$ 的有 $10$ 项。",
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
          wrong: [all, without, Math.round(all / m), n],
          solution: t(
            `All terms: $\\binom{${n + m - 1}}{${m - 1}} = ${all}$. Terms without $${v}$ come from a sum of $${m - 1}$ variables: $\\binom{${n + m - 2}}{${m - 2}} = ${without}$. So $${all} - ${without} = ${value}$.`,
            `全部项：$\\binom{${n + m - 1}}{${m - 1}} = ${all}$。不含 $${v}$ 的项来自 $${m - 1}$ 个变量之和：$\\binom{${n + m - 2}}{${m - 2}} = ${without}$。所以 $${all} - ${without} = ${value}$。`,
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
