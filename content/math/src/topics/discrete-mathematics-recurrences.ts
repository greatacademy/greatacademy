import type { Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { poly, Q } from "@ga/subject-math";

import { numberProblem } from "../problems.ts";
import { range } from "./methods-of-proof-common.ts";

// Discrete Mathematics unit 6: recurrence relations and generating functions.

/** term writes a signed multiple of a symbol, the first one without a leading plus. */
const term = (c: number | Q, sym: string, first = false) => {
  const q = typeof c === "number" ? Q.of(c) : c;
  if (q.isZero()) return "";
  const neg = q.sign() < 0;
  const abs = q.abs();
  const body = sym === "" ? abs.toLatex() : abs.eq(Q.of(1)) ? sym.replace(/^\\cdot /, "") : `${abs.toLatex()}${sym}`;
  return first ? `${neg ? "-" : ""}${body}` : ` ${neg ? "-" : "+"} ${body}`;
};

/** lin writes c₁s₁ + c₂s₂ + ⋯, skipping zero terms. */
const lin = (pairs: readonly (readonly [number | Q, string])[]) => {
  const nz = pairs.filter(([c]) => !(typeof c === "number" ? c === 0 : c.isZero()));
  return nz.length === 0 ? "0" : nz.map(([c, s], i) => term(c, s, i === 0)).join("");
};

/** pn writes an integer, in parentheses when negative. */
const pn = (n: number) => (n < 0 ? `(${n})` : `${n}`);

/** pq writes a rational, in parentheses when negative. */
const pq = (q: Q) => (q.sign() < 0 ? `\\left(${q.toLatex()}\\right)` : q.toLatex());

/** iterate computes a_N of a_n = p a_{n−1} + q a_{n−2} + f(n) from a₀ and a₁. */
const iterate = (a0: Q, a1: Q, p: number, q: number, f: (n: number) => Q, N: number) => {
  const a = [a0, a1];
  for (let n = 2; n <= N; n++)
    a.push(
      Q.of(p)
        .mul(a[n - 1]!)
        .add(Q.of(q).mul(a[n - 2]!))
        .add(f(n)),
    );
  return a;
};

/** iterate1 computes a₀, …, a_N of a_n = r a_{n−1} + f(n). */
const iterate1 = (a0: Q, r: number | Q, f: (n: number) => Q, N: number) => {
  const a = [a0];
  const rq = typeof r === "number" ? Q.of(r) : r;
  for (let n = 1; n <= N; n++) a.push(rq.mul(a[n - 1]!).add(f(n)));
  return a;
};

/** zero is the zero forcing term. */
const zero = () => Q.of(0);

/** RATIOS are nonzero integer ratios other than 1. */
const RATIOS = [-3, -2, -1, 2, 3, 4, 5] as const;

/** introductionToRecurrenceRelations computes terms of recurrences and reads their order. */
export const introductionToRecurrenceRelations: TopicDef = {
  id: "introduction-to-recurrence-relations",
  title: t("Introduction to Recurrence Relations", "递推关系简介"),
  summary: t(
    "A recurrence relation defines each term from earlier ones; its order is how far back it reaches. With enough initial terms, it determines the whole sequence.",
    "递推关系由前面的项确定每一项；它的阶是向前追溯的最远距离。给定足够的初始项，它就确定了整个数列。",
  ),
  prerequisites: ["strong-induction-and-recurrence-relations"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "computing-terms-from-a-recurrence-relation",
      title: t("Computing terms", "计算各项"),
      explanation: t(
        "A recurrence gives each term from the ones before it, so start from the given initial terms and apply the rule one step at a time. If $a_n = 2a_{n-1} - a_{n-2} + 3$ with $a_0 = 1$, $a_1 = 2$, then $a_2 = 4 - 1 + 3 = 6$, $a_3 = 12 - 2 + 3 = 13$, $a_4 = 26 - 6 + 3 = 23$.",
        "递推关系由前面的项给出每一项，所以从给定的初始项开始，一步一步地应用这个规则。若 $a_n = 2a_{n-1} - a_{n-2} + 3$，$a_0 = 1$，$a_1 = 2$，则 $a_2 = 4 - 1 + 3 = 6$，$a_3 = 12 - 2 + 3 = 13$，$a_4 = 26 - 6 + 3 = 23$。",
      ),
      generate(rng) {
        const p = rng.nonZero(-3, 3);
        const q = rng.nonZero(-3, 3);
        const c = rng.int(-4, 4);
        const a0 = rng.int(-3, 4);
        const a1 = rng.int(-3, 4);
        const N = rng.int(4, 5);
        const a = iterate(Q.of(a0), Q.of(a1), p, q, () => Q.of(c), N);
        const rec = lin([
          [p, "a_{n-1}"],
          [q, "a_{n-2}"],
          [c, ""],
        ]);
        const steps = range(2, N)
          .map((n) => `a_{${n}} = ${a[n]!.toLatex()}`)
          .join(",\\ ");
        return numberProblem({
          prompt: t(
            `A sequence satisfies $a_n = ${rec}$ for $n \\ge 2$, with $a_0 = ${a0}$ and $a_1 = ${a1}$. Find $a_{${N}}$.`,
            `数列满足 $a_n = ${rec}$（$n \\ge 2$），且 $a_0 = ${a0}$，$a_1 = ${a1}$。求 $a_{${N}}$。`,
          ),
          answer: a[N]!,
          wrong: [
            a[N - 1]!,
            iterate(Q.of(a0), Q.of(a1), p, q, () => Q.of(c), N + 1)[N + 1]!,
            iterate(Q.of(a1), Q.of(a0), p, q, () => Q.of(c), N)[N]!,
          ],
          solution: t(`Step by step: $${steps}$.`, `逐项计算：$${steps}$。`),
        });
      },
    },
    {
      id: "the-order-of-a-recurrence-relation",
      title: t("The order of a recurrence", "递推关系的阶"),
      explanation: t(
        "$a_n = a_{n-1} + 5a_{n-3}$ has order $3$: it reaches back three steps, so it needs three initial terms $a_0, a_1, a_2$. Count back to the earliest term, not the number of terms.",
        "$a_n = a_{n-1} + 5a_{n-3}$ 是 $3$ 阶的：它向前追溯三步，所以需要三个初始项 $a_0, a_1, a_2$。要看最远追溯到哪一项，而不是项的个数。",
      ),
      generate(rng) {
        const order = rng.int(1, 5);
        const others = rng.sample(range(1, order - 1), rng.int(0, Math.min(2, order - 1)));
        const lags = [...others, order].sort((a, b) => a - b);
        const cs = lags.map(() => rng.nonZero(-4, 4));
        const c = rng.int(-3, 6);
        const rec = lin([...lags.map((l, i) => [cs[i]!, `a_{n-${l}}`] as const), [c, rng.bool() ? "" : "n"]]);
        const askInitial = rng.bool();
        return numberProblem({
          prompt: askInitial
            ? t(
                `How many initial terms are needed to determine every term of a sequence satisfying $a_n = ${rec}$?`,
                `满足 $a_n = ${rec}$ 的数列需要多少个初始项才能确定所有项？`,
              )
            : t(`What is the order of the recurrence relation $a_n = ${rec}$?`, `递推关系 $a_n = ${rec}$ 的阶是多少？`),
          answer: order,
          wrong: [lags.length, order + 1, order - 1, lags.length + (c === 0 ? 0 : 1)],
          solution: t(
            `The earliest term used is $a_{n-${order}}$, so the order is $${order}$${askInitial ? `, and $${order}$ initial terms are needed` : ""}.`,
            `用到的最早一项是 $a_{n-${order}}$，所以阶为 $${order}$${askInitial ? `，需要 $${order}$ 个初始项` : ""}。`,
          ),
        });
      },
    },
  ],
};

/** firstOrderRecurrenceRelations solves aₙ = r aₙ₋₁ + d. */
export const firstOrderRecurrenceRelations: TopicDef = {
  id: "first-order-recurrence-relations",
  title: t("First-Order Recurrence Relations", "一阶递推关系"),
  summary: t(
    "aₙ = r aₙ₋₁ has solution aₙ = a₀rⁿ. For aₙ = r aₙ₋₁ + d with r ≠ 1, the constant p = d/(1 − r) is a fixed point and aₙ = (a₀ − p)rⁿ + p.",
    "aₙ = r aₙ₋₁ 的解为 aₙ = a₀rⁿ。对 aₙ = r aₙ₋₁ + d（r ≠ 1），常数 p = d/(1 − r) 是不动点，且 aₙ = (a₀ − p)rⁿ + p。",
  ),
  prerequisites: ["introduction-to-recurrence-relations", "recursive-formulas-for-geometric-sequences"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "solving-homogeneous-first-order-recurrences",
      title: t("$a_n = r a_{n-1}$", "$a_n = r a_{n-1}$"),
      explanation: t(
        "Multiplying by the same ratio at each step makes the sequence geometric, so the term is the initial value times a power of the ratio. $a_n = 3a_{n-1}$ with $a_0 = 2$ multiplies by $3$ each step: $a_n = 2 \\cdot 3^n$, so $a_6 = 1458$.",
        "每一步都乘以相同的比，序列就是等比数列，所以通项是初值乘以比的幂。$a_n = 3a_{n-1}$，$a_0 = 2$，每一步乘以 $3$：$a_n = 2 \\cdot 3^n$，所以 $a_6 = 1458$。",
      ),
      generate(rng) {
        const r = rng.pick(RATIOS);
        const a0 = rng.nonZero(-5, 5);
        const start = rng.int(0, 1);
        const N = rng.int(5, 9);
        const value = Q.of(a0).mul(Q.of(r).pow(N - start));
        return numberProblem({
          prompt: t(
            `$a_n = ${r}a_{n-1}$ for $n \\ge ${start + 1}$, and $a_{${start}} = ${a0}$. Find $a_{${N}}$.`,
            `$a_n = ${r}a_{n-1}$（$n \\ge ${start + 1}$），且 $a_{${start}} = ${a0}$。求 $a_{${N}}$。`,
          ),
          answer: value,
          wrong: [
            Q.of(a0).mul(Q.of(r).pow(N - start + 1)),
            Q.of(a0).mul(Q.of(r).pow(N - start - 1)),
            Q.of(a0 * r * (N - start)),
            value.neg(),
          ],
          solution: t(
            `$a_n = ${pn(a0)} \\cdot ${pn(r)}^{n${start === 0 ? "" : " - 1"}}$, so $a_{${N}} = ${pn(a0)} \\cdot ${pn(r)}^{${N - start}} = ${value.toLatex()}$.`,
            `$a_n = ${pn(a0)} \\cdot ${pn(r)}^{n${start === 0 ? "" : " - 1"}}$，所以 $a_{${N}} = ${pn(a0)} \\cdot ${pn(r)}^{${N - start}} = ${value.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "solving-first-order-recurrences-with-a-constant",
      title: t("$a_n = r a_{n-1} + d$", "$a_n = r a_{n-1} + d$"),
      explanation: t(
        "Shifting the sequence by its fixed point removes the constant, so the shifted sequence is geometric and easy to solve. For $a_n = 3a_{n-1} - 4$, $a_0 = 5$: the fixed point solves $p = 3p - 4$, so $p = 2$. Then $a_n - 2 = 3(a_{n-1} - 2)$, giving $a_n = 3 \\cdot 3^n + 2$.",
        "把序列减去它的不动点就去掉了常数项，于是平移后的序列是等比的，容易求解。对 $a_n = 3a_{n-1} - 4$，$a_0 = 5$：不动点满足 $p = 3p - 4$，所以 $p = 2$。于是 $a_n - 2 = 3(a_{n-1} - 2)$，得 $a_n = 3 \\cdot 3^n + 2$。",
      ),
      generate(rng) {
        const r = rng.pick(RATIOS.filter((x) => x !== -1));
        const p = rng.int(-6, 6);
        const d = p * (1 - r);
        const A = rng.nonZero(-4, 4);
        const a0 = A + p;
        const askB = rng.bool();
        const rec = lin([
          [r, "a_{n-1}"],
          [d, ""],
        ]);
        return numberProblem({
          prompt: t(
            `$a_n = ${rec}$ for $n \\ge 1$, with $a_0 = ${a0}$. The solution has the form $a_n = A \\cdot ${pn(r)}^n + B$. Find $${askB ? "B" : "A"}$.`,
            `$a_n = ${rec}$（$n \\ge 1$），$a_0 = ${a0}$。解的形式为 $a_n = A \\cdot ${pn(r)}^n + B$。求 $${askB ? "B" : "A"}$。`,
          ),
          answer: askB ? p : A,
          wrong: askB ? [d, -p, a0, A] : [a0, a0 + p, p, -A],
          solution: t(
            `$B$ is the fixed point: $B = ${r}B ${d < 0 ? "-" : "+"} ${Math.abs(d)}$ gives $B = ${p}$. Then $A = a_0 - B = ${a0} - ${pn(p)} = ${A}$.`,
            `$B$ 是不动点：$B = ${r}B ${d < 0 ? "-" : "+"} ${Math.abs(d)}$ 得 $B = ${p}$。于是 $A = a_0 - B = ${a0} - ${pn(p)} = ${A}$。`,
          ),
        });
      },
    },
  ],
};

/** firstOrderRecurrenceRelationsWithPolynomialForcing solves aₙ = r aₙ₋₁ + f(n) with f polynomial. */
export const firstOrderRecurrenceRelationsWithPolynomialForcing: TopicDef = {
  id: "first-order-recurrence-relations-with-polynomial-forcing",
  title: t("First-Order Recurrence Relations With Polynomial Forcing", "多项式强迫项的一阶递推关系"),
  summary: t(
    "For aₙ = r aₙ₋₁ + f(n) with f a polynomial and r ≠ 1, try a particular solution that is a polynomial of the same degree; the general solution adds Arⁿ. If r = 1, then aₙ = a₀ + Σₖ₌₁ⁿ f(k).",
    "对 aₙ = r aₙ₋₁ + f(n)（f 为多项式，r ≠ 1），设一个同次多项式作为特解；通解再加上 Arⁿ。若 r = 1，则 aₙ = a₀ + Σₖ₌₁ⁿ f(k)。",
  ),
  prerequisites: ["first-order-recurrence-relations", "finite-linear-series"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "polynomial-particular-solutions",
      title: t("Polynomial particular solutions", "多项式特解"),
      explanation: t(
        "When the forcing term is a polynomial, try a polynomial of the same degree and match the coefficients of each power of the index. For $a_n = 3a_{n-1} + 4n$, try $cn + e$: $cn + e = 3c(n - 1) + 3e + 4n$. Matching $n$: $c = 3c + 4$, so $c = -2$; matching constants: $e = -3c + 3e$, so $e = -3$.",
        "当强迫项是多项式时，尝试同次数的多项式，再比较下标各次幂的系数。对 $a_n = 3a_{n-1} + 4n$，设 $cn + e$：$cn + e = 3c(n - 1) + 3e + 4n$。比较 $n$ 的系数：$c = 3c + 4$，所以 $c = -2$；比较常数项：$e = -3c + 3e$，所以 $e = -3$。",
      ),
      generate(rng) {
        const r = rng.pick([-3, -2, -1, 2, 3, 4]);
        const alpha = rng.nonZero(-6, 6);
        const beta = rng.int(-6, 6);
        const c = Q.of(alpha, 1 - r);
        const e = Q.of(beta)
          .sub(c.mul(Q.of(r)))
          .div(Q.of(1 - r));
        const askE = rng.bool();
        const rec = lin([
          [r, "a_{n-1}"],
          [alpha, "n"],
          [beta, ""],
        ]);
        return numberProblem({
          prompt: t(
            `$a_n = ${rec}$ has a particular solution of the form $a_n = cn + e$. Find $${askE ? "e" : "c"}$.`,
            `$a_n = ${rec}$ 有形如 $a_n = cn + e$ 的特解。求 $${askE ? "e" : "c"}$。`,
          ),
          answer: askE ? e : c,
          wrong: askE
            ? [
                Q.of(beta, 1 - r),
                Q.of(beta)
                  .add(c.mul(Q.of(r)))
                  .div(Q.of(1 - r)),
                e.neg(),
              ]
            : [Q.of(alpha, r - 1), Q.of(alpha).mul(Q.of(1 - r)), Q.of(alpha)],
          solution: t(
            `Substituting: $cn + e = ${r}(c(n - 1) + e)${term(alpha, "n")}${term(beta, "")}$. The $n$ terms give $c = ${r}c${term(alpha, "")}$, so $c = ${c.toLatex()}$; the constants give $e = ${-r}c + ${pn(r)}e${term(beta, "")}$, so $e = ${e.toLatex()}$.`,
            `代入：$cn + e = ${r}(c(n - 1) + e)${term(alpha, "n")}${term(beta, "")}$。比较 $n$ 的系数得 $c = ${r}c${term(alpha, "")}$，所以 $c = ${c.toLatex()}$；比较常数项得 $e = ${-r}c + ${pn(r)}e${term(beta, "")}$，所以 $e = ${e.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "summing-a-polynomial-forcing-term",
      title: t("The case r = 1", "r = 1 的情形"),
      explanation: t(
        "When the ratio is one, each step just adds the forcing term, so the solution is the initial value plus the sum of those terms. $a_n = a_{n-1} + 2n + 1$ with $a_0 = 3$ adds $2k + 1$ at step $k$: $a_n = 3 + \\sum_{k=1}^{n}(2k + 1) = 3 + n(n + 1) + n$, so $a_{10} = 123$.",
        "当比为 1 时，每一步只是加上强迫项，所以解就是初值加上这些项之和。$a_n = a_{n-1} + 2n + 1$，$a_0 = 3$，第 $k$ 步加 $2k + 1$：$a_n = 3 + \\sum_{k=1}^{n}(2k + 1) = 3 + n(n + 1) + n$，所以 $a_{10} = 123$。",
      ),
      generate(rng) {
        const alpha = rng.nonZero(-4, 5);
        const beta = rng.int(-5, 5);
        const a0 = rng.int(-9, 9);
        const N = rng.int(10, 40);
        const value = a0 + (alpha * N * (N + 1)) / 2 + beta * N;
        const rec = lin([
          [1, "a_{n-1}"],
          [alpha, "n"],
          [beta, ""],
        ]);
        return numberProblem({
          prompt: t(
            `$a_n = ${rec}$ for $n \\ge 1$, with $a_0 = ${a0}$. Find $a_{${N}}$.`,
            `$a_n = ${rec}$（$n \\ge 1$），$a_0 = ${a0}$。求 $a_{${N}}$。`,
          ),
          answer: value,
          wrong: [value - a0, a0 + (alpha * N * (N - 1)) / 2 + beta * N, a0 + alpha * N * N + beta * N, value + alpha * (N + 1)],
          solution: t(
            `$a_{${N}} = ${a0} + \\sum_{k=1}^{${N}} (${lin([
              [alpha, "k"],
              [beta, ""],
            ])}) = ${a0} + ${pn(alpha)} \\cdot \\frac{${N} \\cdot ${N + 1}}{2} + ${pn(beta)} \\cdot ${N} = ${value}$.`,
            `$a_{${N}} = ${a0} + \\sum_{k=1}^{${N}} (${lin([
              [alpha, "k"],
              [beta, ""],
            ])}) = ${a0} + ${pn(alpha)} \\cdot \\frac{${N} \\cdot ${N + 1}}{2} + ${pn(beta)} \\cdot ${N} = ${value}$。`,
          ),
        });
      },
    },
  ],
};

/** firstOrderRecurrenceRelationsWithExponentialForcing solves aₙ = r aₙ₋₁ + c sⁿ. */
export const firstOrderRecurrenceRelationsWithExponentialForcing: TopicDef = {
  id: "first-order-recurrence-relations-with-exponential-forcing",
  title: t("First-Order Recurrence Relations With Exponential Forcing", "指数强迫项的一阶递推关系"),
  summary: t(
    "For aₙ = r aₙ₋₁ + c sⁿ with s ≠ r, a particular solution is K sⁿ with K = cs/(s − r). If s = r, try K n rⁿ instead, which gives K = c.",
    "对 aₙ = r aₙ₋₁ + c sⁿ（s ≠ r），特解为 K sⁿ，K = cs/(s − r)。若 s = r，则改设 K n rⁿ，得 K = c。",
  ),
  prerequisites: ["first-order-recurrence-relations"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "exponential-particular-solutions",
      title: t("Exponential particular solutions", "指数特解"),
      explanation: t(
        "When the forcing term is an exponential, try a constant times the same exponential and solve for the constant. For $a_n = 2a_{n-1} + 3 \\cdot 5^n$, try $K \\cdot 5^n$: $K \\cdot 5^n = 2K \\cdot 5^{n-1} + 3 \\cdot 5^n$. Dividing by $5^{n-1}$: $5K = 2K + 15$, so $K = 5$.",
        "当强迫项是指数函数时，尝试同一指数函数的常数倍，再解出这个常数。对 $a_n = 2a_{n-1} + 3 \\cdot 5^n$，设 $K \\cdot 5^n$：$K \\cdot 5^n = 2K \\cdot 5^{n-1} + 3 \\cdot 5^n$。两边除以 $5^{n-1}$：$5K = 2K + 15$，所以 $K = 5$。",
      ),
      generate(rng) {
        const r = rng.pick([-3, -2, 2, 3, 4]);
        let s: number;
        do s = rng.pick([-3, -2, 2, 3, 4, 5]);
        while (s === r);
        const c = rng.nonZero(-5, 5);
        const value = Q.of(c * s, s - r);
        const rec = `${r}a_{n-1}${term(c, `\\cdot ${pn(s)}^n`)}`;
        return numberProblem({
          prompt: t(
            `$a_n = ${rec}$ has a particular solution of the form $K \\cdot ${pn(s)}^n$. Find $K$.`,
            `$a_n = ${rec}$ 有形如 $K \\cdot ${pn(s)}^n$ 的特解。求 $K$。`,
          ),
          answer: value,
          wrong: [Q.of(c, s - r), Q.of(c * r, s - r), Q.of(c * s, r - s), Q.of(c)],
          solution: t(
            `Dividing $K \\cdot ${pn(s)}^n = ${r}K \\cdot ${pn(s)}^{n-1}${term(c, `\\cdot ${pn(s)}^n`)}$ by $${pn(s)}^{n-1}$: $${s}K = ${r}K ${c * s < 0 ? "-" : "+"} ${Math.abs(c * s)}$, so $K = ${value.toLatex()}$.`,
            `把 $K \\cdot ${pn(s)}^n = ${r}K \\cdot ${pn(s)}^{n-1}${term(c, `\\cdot ${pn(s)}^n`)}$ 两边除以 $${pn(s)}^{n-1}$：$${s}K = ${r}K ${c * s < 0 ? "-" : "+"} ${Math.abs(c * s)}$，所以 $K = ${value.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "resonant-exponential-forcing",
      title: t("Forcing at the same base", "底数相同的强迫项"),
      explanation: t(
        "If the exponential already solves the homogeneous part, multiply the guess by the index to get a form that can match the forcing. For $a_n = 2a_{n-1} + 3 \\cdot 2^n$, $K \\cdot 2^n$ fails because it solves the homogeneous part. Try $Kn2^n$: $Kn = K(n - 1) + 3$, so $K = 3$ and $a_n = (a_0 + 3n)2^n$.",
        "如果这个指数函数已经是齐次部分的解，就把猜测乘以下标，得到能与强迫项匹配的形式。对 $a_n = 2a_{n-1} + 3 \\cdot 2^n$，$K \\cdot 2^n$ 不行，因为它满足齐次部分。设 $Kn2^n$：$Kn = K(n - 1) + 3$，所以 $K = 3$，$a_n = (a_0 + 3n)2^n$。",
      ),
      generate(rng) {
        const r = rng.pick([-3, -2, 2, 3]);
        const c = rng.nonZero(-4, 4);
        const a0 = rng.int(-5, 5);
        const N = rng.int(3, 7);
        const value = Q.of(a0 + c * N).mul(Q.of(r).pow(N));
        const rec = `${r}a_{n-1}${term(c, `\\cdot ${pn(r)}^n`)}`;
        return numberProblem({
          prompt: t(
            `$a_n = ${rec}$ for $n \\ge 1$, with $a_0 = ${a0}$. Use the solution $a_n = (a_0 + Kn)${pn(r)}^n$ to find $a_{${N}}$.`,
            `$a_n = ${rec}$（$n \\ge 1$），$a_0 = ${a0}$。利用解 $a_n = (a_0 + Kn)${pn(r)}^n$ 求 $a_{${N}}$。`,
          ),
          answer: value,
          wrong: [
            Q.of(a0 + c).mul(Q.of(r).pow(N)),
            Q.of(a0).mul(Q.of(r).pow(N)),
            Q.of(a0 + c * (N - 1)).mul(Q.of(r).pow(N)),
            Q.of(a0 + c * N).mul(Q.of(r).pow(N - 1)),
          ],
          solution: t(
            `Here $K = ${c}$, so $a_{${N}} = (${a0}${term(c, "")} \\cdot ${N}) \\cdot ${pn(r)}^{${N}} = ${value.toLatex()}$.`,
            `这里 $K = ${c}$，所以 $a_{${N}} = (${a0}${term(c, "")} \\cdot ${N}) \\cdot ${pn(r)}^{${N}} = ${value.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** Roots are two distinct nonzero integer roots, larger first. */
interface Roots {
  readonly r1: number;
  readonly r2: number;
  readonly p: number;
  readonly q: number;
}

/** randomRoots picks distinct integer roots and the recurrence aₙ = p aₙ₋₁ + q aₙ₋₂ they solve. */
function randomRoots(rng: Rng): Roots {
  let x: number;
  let y: number;
  do [x, y] = rng.sample([-3, -2, -1, 2, 3, 4, 5], 2) as [number, number];
  while (x + y === 0);
  const r1 = Math.max(x!, y!);
  const r2 = Math.min(x!, y!);
  return { r1, r2, p: r1 + r2, q: -r1 * r2 };
}

/** rec2 writes p aₙ₋₁ + q aₙ₋₂. */
const rec2 = (p: number, q: number) =>
  lin([
    [p, "a_{n-1}"],
    [q, "a_{n-2}"],
  ]);

/** charTex writes x² − px − q. */
const charTex = (p: number, q: number) =>
  lin([
    [1, "x^2"],
    [-p, "x"],
    [-q, ""],
  ]);

/** secondOrderHomogeneousRecurrenceRelationsWithDistinctRealRoots solves aₙ = p aₙ₋₁ + q aₙ₋₂ when x² = px + q has distinct real roots. */
export const secondOrderHomogeneousRecurrenceRelationsWithDistinctRealRoots: TopicDef = {
  id: "second-order-homogeneous-recurrence-relations-with-distinct-real-roots",
  title: t(
    "Second-Order Homogeneous Recurrence Relations: Characteristic Equations With Distinct Real Roots",
    "二阶齐次递推关系：特征方程有两个不同实根",
  ),
  summary: t(
    "Trying aₙ = xⁿ in aₙ = p aₙ₋₁ + q aₙ₋₂ gives the characteristic equation x² = px + q. With distinct roots r₁, r₂, the solution is aₙ = A r₁ⁿ + B r₂ⁿ, with A and B fixed by a₀ and a₁.",
    "把 aₙ = xⁿ 代入 aₙ = p aₙ₋₁ + q aₙ₋₂ 得特征方程 x² = px + q。若有两个不同的根 r₁、r₂，则解为 aₙ = A r₁ⁿ + B r₂ⁿ，A 与 B 由 a₀ 和 a₁ 确定。",
  ),
  prerequisites: ["first-order-recurrence-relations", "the-quadratic-formula"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "characteristic-roots-of-a-recurrence",
      title: t("The characteristic roots", "特征根"),
      explanation: t(
        "Trying a power of an unknown number turns the recurrence into a polynomial equation whose roots give the basic solutions. For $a_n = a_{n-1} + 6a_{n-2}$, the characteristic equation is $x^2 - x - 6 = 0$, that is, $(x - 3)(x + 2) = 0$: roots $3$ and $-2$. So $a_n = A \\cdot 3^n + B(-2)^n$.",
        "尝试一个未知数的幂，就把递推关系变成一个多项式方程，它的根给出基本解。对 $a_n = a_{n-1} + 6a_{n-2}$，特征方程为 $x^2 - x - 6 = 0$，即 $(x - 3)(x + 2) = 0$：根为 $3$ 和 $-2$。所以 $a_n = A \\cdot 3^n + B(-2)^n$。",
      ),
      generate(rng) {
        const { r1, r2, p, q } = randomRoots(rng);
        const askLarger = rng.bool();
        const value = askLarger ? r1 : r2;
        return numberProblem({
          prompt: t(
            `Find the ${askLarger ? "larger" : "smaller"} root of the characteristic equation of $a_n = ${rec2(p, q)}$.`,
            `求 $a_n = ${rec2(p, q)}$ 的特征方程的${askLarger ? "较大" : "较小"}根。`,
          ),
          answer: value,
          wrong: [askLarger ? r2 : r1, -value, -(askLarger ? r2 : r1), p],
          solution: t(
            `$${charTex(p, q)} = (x ${r1 < 0 ? "+" : "-"} ${Math.abs(r1)})(x ${r2 < 0 ? "+" : "-"} ${Math.abs(r2)}) = 0$, so the roots are $${r1}$ and $${r2}$.`,
            `$${charTex(p, q)} = (x ${r1 < 0 ? "+" : "-"} ${Math.abs(r1)})(x ${r2 < 0 ? "+" : "-"} ${Math.abs(r2)}) = 0$，所以根为 $${r1}$ 和 $${r2}$。`,
          ),
        });
      },
    },
    {
      id: "solving-with-initial-conditions",
      title: t("Using the initial conditions", "利用初始条件"),
      explanation: t(
        "The general solution has one constant for each root, and the initial terms give a system of equations that fixes them. For $a_n = a_{n-1} + 6a_{n-2}$ with $a_0 = 3$, $a_1 = 4$: $A + B = 3$ and $3A - 2B = 4$, so $A = 2$, $B = 1$, and $a_n = 2 \\cdot 3^n + (-2)^n$.",
        "通解中每个根对应一个常数，初始项给出一个方程组来确定这些常数。对 $a_n = a_{n-1} + 6a_{n-2}$，$a_0 = 3$，$a_1 = 4$：$A + B = 3$，$3A - 2B = 4$，所以 $A = 2$，$B = 1$，$a_n = 2 \\cdot 3^n + (-2)^n$。",
      ),
      generate(rng) {
        const { r1, r2, p, q } = randomRoots(rng);
        const A = rng.nonZero(-4, 4);
        const B = rng.nonZero(-4, 4);
        const a0 = A + B;
        const a1 = A * r1 + B * r2;
        const kind = rng.int(0, 2);
        const N = rng.int(6, 10);
        const aN = A * r1 ** N + B * r2 ** N;
        return numberProblem({
          prompt:
            kind === 2
              ? t(
                  `$a_n = ${rec2(p, q)}$ with $a_0 = ${a0}$ and $a_1 = ${a1}$. Find $a_{${N}}$ using the closed form.`,
                  `$a_n = ${rec2(p, q)}$，$a_0 = ${a0}$，$a_1 = ${a1}$。用通项公式求 $a_{${N}}$。`,
                )
              : t(
                  `$a_n = ${rec2(p, q)}$ with $a_0 = ${a0}$ and $a_1 = ${a1}$ has solution $a_n = A \\cdot ${pn(r1)}^n + B \\cdot ${pn(r2)}^n$. Find $${kind === 0 ? "A" : "B"}$.`,
                  `$a_n = ${rec2(p, q)}$，$a_0 = ${a0}$，$a_1 = ${a1}$ 的解为 $a_n = A \\cdot ${pn(r1)}^n + B \\cdot ${pn(r2)}^n$。求 $${kind === 0 ? "A" : "B"}$。`,
                ),
          answer: kind === 0 ? A : kind === 1 ? B : aN,
          wrong:
            kind === 2
              ? [A * r1 ** (N - 1) + B * r2 ** (N - 1), A * r1 ** N - B * r2 ** N, B * r1 ** N + A * r2 ** N]
              : [kind === 0 ? B : A, a0, -A, a1],
          solution: t(
            `$A + B = ${a0}$ and $${pn(r1)}A + ${pn(r2)}B = ${a1}$ give $A = ${A}$, $B = ${B}$${kind === 2 ? `, so $a_{${N}} = ${pn(A)} \\cdot ${pn(r1)}^{${N}} + ${pn(B)} \\cdot ${pn(r2)}^{${N}} = ${aN}$` : ""}.`,
            `$A + B = ${a0}$，$${pn(r1)}A + ${pn(r2)}B = ${a1}$，得 $A = ${A}$，$B = ${B}$${kind === 2 ? `，所以 $a_{${N}} = ${pn(A)} \\cdot ${pn(r1)}^{${N}} + ${pn(B)} \\cdot ${pn(r2)}^{${N}} = ${aN}$` : ""}。`,
          ),
        });
      },
    },
  ],
};

/** secondOrderHomogeneousRecurrenceRelationsWithRepeatedRoots solves the case of a double characteristic root. */
export const secondOrderHomogeneousRecurrenceRelationsWithRepeatedRoots: TopicDef = {
  id: "second-order-homogeneous-recurrence-relations-with-repeated-roots",
  title: t(
    "Second-Order Homogeneous Recurrence Relations: Characteristic Equations With Repeated Roots",
    "二阶齐次递推关系：特征方程有重根",
  ),
  summary: t(
    "If the characteristic equation has a double root r, then rⁿ and nrⁿ both solve the recurrence, and aₙ = (A + Bn)rⁿ.",
    "若特征方程有二重根 r，则 rⁿ 与 nrⁿ 都是递推关系的解，aₙ = (A + Bn)rⁿ。",
  ),
  prerequisites: ["second-order-homogeneous-recurrence-relations-with-distinct-real-roots"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "constants-for-a-repeated-root",
      title: t("Finding the constants", "求常数"),
      explanation: t(
        "A repeated root gives the solutions the power and the index times the power, and the initial terms determine the two constants. $a_n = 4a_{n-1} - 4a_{n-2}$ has characteristic equation $(x - 2)^2 = 0$. With $a_0 = 1$, $a_1 = 6$: $A = 1$ and $(A + B) \\cdot 2 = 6$, so $B = 2$ and $a_n = (1 + 2n)2^n$.",
        "重根给出该幂以及下标乘以该幂两个解，初始项确定这两个常数。$a_n = 4a_{n-1} - 4a_{n-2}$ 的特征方程为 $(x - 2)^2 = 0$。由 $a_0 = 1$，$a_1 = 6$：$A = 1$，$(A + B) \\cdot 2 = 6$，所以 $B = 2$，$a_n = (1 + 2n)2^n$。",
      ),
      generate(rng) {
        const r = rng.pick([-3, -2, -1, 2, 3, 4]);
        const A = rng.int(-4, 4);
        const B = rng.nonZero(-4, 4);
        const a0 = A;
        const a1 = (A + B) * r;
        return numberProblem({
          prompt: t(
            `$a_n = ${rec2(2 * r, -r * r)}$ with $a_0 = ${a0}$ and $a_1 = ${a1}$ has solution $a_n = (A + Bn)${pn(r)}^n$. Find $B$.`,
            `$a_n = ${rec2(2 * r, -r * r)}$，$a_0 = ${a0}$，$a_1 = ${a1}$ 的解为 $a_n = (A + Bn)${pn(r)}^n$。求 $B$。`,
          ),
          answer: B,
          wrong: [a1 / r, a1 - A, A, a1 - A * r],
          solution: t(
            `$a_0 = A = ${A}$ and $a_1 = (A + B) \\cdot ${pn(r)} = ${a1}$, so $A + B = ${A + B}$ and $B = ${B}$.`,
            `$a_0 = A = ${A}$，$a_1 = (A + B) \\cdot ${pn(r)} = ${a1}$，所以 $A + B = ${A + B}$，$B = ${B}$。`,
          ),
        });
      },
    },
    {
      id: "terms-from-a-repeated-root-solution",
      title: t("Finding a term", "求某一项"),
      explanation: t(
        "Substitute the index into the closed form; the extra factor of the index makes the terms grow a little faster than the power alone. With $a_n = (1 + 2n)2^n$: $a_8 = 17 \\cdot 256 = 4352$. The factor $n$ makes the terms grow faster than $2^n$.",
        "把下标代入封闭形式；额外的下标因子使各项比单纯的幂增长得稍快。由 $a_n = (1 + 2n)2^n$：$a_8 = 17 \\cdot 256 = 4352$。因子 $n$ 使各项比 $2^n$ 增长得更快。",
      ),
      generate(rng) {
        const r = rng.pick([-3, -2, 2, 3]);
        const A = rng.int(-4, 4);
        const B = rng.nonZero(-4, 4);
        const N = rng.int(4, 8);
        const a1 = (A + B) * r;
        const value = (A + B * N) * r ** N;
        return numberProblem({
          prompt: t(
            `$a_n = ${rec2(2 * r, -r * r)}$ with $a_0 = ${A}$ and $a_1 = ${a1}$. Find $a_{${N}}$.`,
            `$a_n = ${rec2(2 * r, -r * r)}$，$a_0 = ${A}$，$a_1 = ${a1}$。求 $a_{${N}}$。`,
          ),
          answer: value,
          wrong: [(A + B) * r ** N, A * r ** N + B * r ** (N - 1), (A + B * (N - 1)) * r ** N, (A * N + B) * r ** N],
          solution: t(
            `The characteristic equation is $(x ${r < 0 ? "+" : "-"} ${Math.abs(r)})^2 = 0$, so $a_n = (A + Bn)${pn(r)}^n$ with $A = ${A}$ and $B = ${B}$. Then $a_{${N}} = (${A}${term(B * N, "")}) \\cdot ${pn(r)}^{${N}} = ${value}$.`,
            `特征方程为 $(x ${r < 0 ? "+" : "-"} ${Math.abs(r)})^2 = 0$，所以 $a_n = (A + Bn)${pn(r)}^n$，$A = ${A}$，$B = ${B}$。于是 $a_{${N}} = (${A}${term(B * N, "")}) \\cdot ${pn(r)}^{${N}} = ${value}$。`,
          ),
        });
      },
    },
  ],
};

/** ComplexRoots are characteristic roots m(u ± vi) with a standard argument. */
interface ComplexRoots {
  readonly p: number;
  readonly q: number;
  readonly mu: number;
  readonly theta: number;
  readonly rho: string;
  readonly rhoSq: number;
  readonly rootTex: string;
}

/** randomComplexRoots picks roots m(u ± vi) whose argument is a multiple of 30° or 45°. */
function randomComplexRoots(rng: Rng): ComplexRoots {
  const m = rng.int(1, 3);
  const [u, v2, theta] = rng.pick([
    [1, 1, 45],
    [-1, 1, 135],
    [0, 1, 90],
    [1, 3, 60],
    [-1, 3, 120],
  ] as const);
  const rhoSq = m * m * (u * u + v2);
  const rho = v2 === 3 ? `${2 * m}` : u === 0 ? `${m}` : `${m === 1 ? "" : m}\\sqrt{2}`;
  const vTex = v2 === 3 ? `${m === 1 ? "" : m}\\sqrt{3}` : `${m === 1 ? "" : m}`;
  const rootTex = `${u === 0 ? "" : `${u * m} `}\\pm ${vTex}i`;
  return { p: 2 * m * u, q: -rhoSq, mu: m * u, theta, rho, rhoSq, rootTex };
}

/** secondOrderHomogeneousRecurrenceRelationsWithComplexRoots solves the case of complex conjugate characteristic roots. */
export const secondOrderHomogeneousRecurrenceRelationsWithComplexRoots: TopicDef = {
  id: "second-order-homogeneous-recurrence-relations-with-complex-roots",
  title: t(
    "Second-Order Homogeneous Recurrence Relations: Characteristic Equations With Complex Roots",
    "二阶齐次递推关系：特征方程有复根",
  ),
  summary: t(
    "If the characteristic roots are ρ(cos θ ± i sin θ), then by De Moivre's theorem the real solutions are aₙ = ρⁿ(A cos nθ + B sin nθ).",
    "若特征根为 ρ(cos θ ± i sin θ)，则由 De Moivre 定理，实数解为 aₙ = ρⁿ(A cos nθ + B sin nθ)。",
  ),
  prerequisites: [
    "second-order-homogeneous-recurrence-relations-with-distinct-real-roots",
    "de-moivres-theorem",
    "solving-quadratic-equations-with-complex-roots",
  ],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "modulus-and-argument-of-characteristic-roots",
      title: t("Modulus and argument", "模与辐角"),
      explanation: t(
        "Complex characteristic roots come in conjugate pairs, and writing them in polar form shows how fast the terms grow and how they oscillate. $a_n = 2a_{n-1} - 2a_{n-2}$ has characteristic equation $x^2 - 2x + 2 = 0$, with roots $1 \\pm i = \\sqrt{2}(\\cos 45^\\circ \\pm i \\sin 45^\\circ)$. So $\\rho = \\sqrt{2}$, $\\theta = 45^\\circ$, and $a_n = (\\sqrt{2})^n(A \\cos 45n^\\circ + B \\sin 45n^\\circ)$.",
        "复特征根成共轭对出现，把它们写成极坐标形式，就能看出各项增长多快以及如何振荡。$a_n = 2a_{n-1} - 2a_{n-2}$ 的特征方程为 $x^2 - 2x + 2 = 0$，根为 $1 \\pm i = \\sqrt{2}(\\cos 45^\\circ \\pm i \\sin 45^\\circ)$。所以 $\\rho = \\sqrt{2}$，$\\theta = 45^\\circ$，$a_n = (\\sqrt{2})^n(A \\cos 45n^\\circ + B \\sin 45n^\\circ)$。",
      ),
      generate(rng) {
        const c = randomComplexRoots(rng);
        const askRho = rng.bool();
        return numberProblem({
          prompt: askRho
            ? t(
                `The characteristic roots of $a_n = ${rec2(c.p, c.q)}$ are $\\rho(\\cos \\theta \\pm i \\sin \\theta)$. Find $\\rho^2$.`,
                `$a_n = ${rec2(c.p, c.q)}$ 的特征根为 $\\rho(\\cos \\theta \\pm i \\sin \\theta)$。求 $\\rho^2$。`,
              )
            : t(
                `The characteristic roots of $a_n = ${rec2(c.p, c.q)}$ are $\\rho(\\cos \\theta \\pm i \\sin \\theta)$ with $0^\\circ < \\theta < 180^\\circ$. Find $\\theta$ in degrees.`,
                `$a_n = ${rec2(c.p, c.q)}$ 的特征根为 $\\rho(\\cos \\theta \\pm i \\sin \\theta)$，$0^\\circ < \\theta < 180^\\circ$。求 $\\theta$（以度为单位）。`,
              ),
          answer: askRho ? c.rhoSq : c.theta,
          wrong: askRho ? [c.p, c.p * c.p, -c.q * 2, Math.abs(c.mu)] : [180 - c.theta, 90 - (c.theta % 90 || 45), 360 - c.theta],
          solution: t(
            `$${charTex(c.p, c.q)} = 0$ has roots $${c.rootTex} = ${c.rho}(\\cos ${c.theta}^\\circ \\pm i \\sin ${c.theta}^\\circ)$, so $\\rho^2 = ${c.rhoSq}$ and $\\theta = ${c.theta}^\\circ$.`,
            `$${charTex(c.p, c.q)} = 0$ 的根为 $${c.rootTex} = ${c.rho}(\\cos ${c.theta}^\\circ \\pm i \\sin ${c.theta}^\\circ)$，所以 $\\rho^2 = ${c.rhoSq}$，$\\theta = ${c.theta}^\\circ$。`,
          ),
        });
      },
    },
    {
      id: "terms-from-a-complex-root-solution",
      title: t("Finding a term", "求某一项"),
      explanation: t(
        "With complex roots the real solution is a power of the modulus times a combination of cosines and sines of multiples of the argument. For $a_n = 2a_{n-1} - 2a_{n-2}$ with $a_0 = 1$, $a_1 = 1$: $A = 1$ and $\\sqrt{2}(\\cos 45^\\circ + B \\sin 45^\\circ) = 1$ gives $B = 0$. So $a_n = (\\sqrt{2})^n \\cos 45n^\\circ$ and $a_{8} = 16 \\cos 360^\\circ = 16$.",
        "对于复根，实数解是模的幂乘以辐角倍数的余弦和正弦的组合。对 $a_n = 2a_{n-1} - 2a_{n-2}$，$a_0 = 1$，$a_1 = 1$：$A = 1$，由 $\\sqrt{2}(\\cos 45^\\circ + B \\sin 45^\\circ) = 1$ 得 $B = 0$。所以 $a_n = (\\sqrt{2})^n \\cos 45n^\\circ$，$a_{8} = 16 \\cos 360^\\circ = 16$。",
      ),
      generate(rng) {
        const c = randomComplexRoots(rng);
        const k = rng.nonZero(-3, 3);
        const N = rng.int(4, 12);
        const a = iterate(Q.of(k), Q.of(k * c.mu), c.p, c.q, zero, N);
        const value = a[N]!;
        return numberProblem({
          prompt: t(
            `$a_n = ${rec2(c.p, c.q)}$ with $a_0 = ${k}$ and $a_1 = ${k * c.mu}$. Find $a_{${N}}$.`,
            `$a_n = ${rec2(c.p, c.q)}$，$a_0 = ${k}$，$a_1 = ${k * c.mu}$。求 $a_{${N}}$。`,
          ),
          answer: value,
          wrong: [value.neg(), a[N - 1]!, Q.of(k).mul(Q.of(c.rhoSq).pow(Math.floor(N / 2)))],
          solution: t(
            `The roots are $${c.rho}(\\cos ${c.theta}^\\circ \\pm i \\sin ${c.theta}^\\circ)$. From $a_0$ and $a_1$, $A = ${k}$ and $B = 0$, so $a_n = ${k === 1 ? "" : k === -1 ? "-" : k}(${c.rho})^n \\cos ${c.theta}n^\\circ$ and $a_{${N}} = ${k === 1 ? "" : k === -1 ? "-" : k}(${c.rho})^{${N}} \\cos ${c.theta * N}^\\circ = ${value.toLatex()}$.`,
            `特征根为 $${c.rho}(\\cos ${c.theta}^\\circ \\pm i \\sin ${c.theta}^\\circ)$。由 $a_0$ 和 $a_1$ 得 $A = ${k}$，$B = 0$，所以 $a_n = ${k === 1 ? "" : k === -1 ? "-" : k}(${c.rho})^n \\cos ${c.theta}n^\\circ$，$a_{${N}} = ${k === 1 ? "" : k === -1 ? "-" : k}(${c.rho})^{${N}} \\cos ${c.theta * N}^\\circ = ${value.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** secondOrderRecurrenceRelationsWithPolynomialForcing finds polynomial particular solutions of second-order recurrences. */
export const secondOrderRecurrenceRelationsWithPolynomialForcing: TopicDef = {
  id: "second-order-recurrence-relations-with-polynomial-forcing",
  title: t("Second-Order Recurrence Relations With Polynomial Forcing", "多项式强迫项的二阶递推关系"),
  summary: t(
    "For aₙ = p aₙ₋₁ + q aₙ₋₂ + f(n) with f linear, try cn + e unless 1 is a characteristic root; if 1 is a simple root, a constant forcing term needs cn instead.",
    "对 aₙ = p aₙ₋₁ + q aₙ₋₂ + f(n)（f 为一次式），除非 1 是特征根，否则设 cn + e；若 1 是单特征根，常数强迫项需改设 cn。",
  ),
  prerequisites: [
    "second-order-homogeneous-recurrence-relations-with-distinct-real-roots",
    "first-order-recurrence-relations-with-polynomial-forcing",
  ],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "linear-particular-solutions-of-second-order-recurrences",
      title: t("Linear particular solutions", "一次特解"),
      explanation: t(
        "Try a linear expression in the index and match the coefficient of the index and the constant on both sides. For $a_n = a_{n-1} + 2a_{n-2} + 4n$, try $cn + e$. The $n$ terms: $c = c + 2c + 4$, so $c = -2$. The constants: $e = (e - c) + 2(e - 2c)$, so $e = 5$.",
        "尝试关于下标的一次式，再比较两边下标的系数和常数项。对 $a_n = a_{n-1} + 2a_{n-2} + 4n$，设 $cn + e$。比较 $n$ 的系数：$c = c + 2c + 4$，所以 $c = -2$。比较常数项：$e = (e - c) + 2(e - 2c)$，所以 $e = 5$。",
      ),
      generate(rng) {
        let p: number;
        let q: number;
        do {
          p = rng.int(-3, 4);
          q = rng.nonZero(-4, 4);
        } while (1 - p - q === 0);
        const alpha = rng.nonZero(-6, 6);
        const beta = rng.int(-6, 6);
        const D = 1 - p - q;
        const c = Q.of(alpha, D);
        const e = Q.of(beta)
          .sub(c.mul(Q.of(p + 2 * q)))
          .div(Q.of(D));
        const askE = rng.bool();
        const rec = `${rec2(p, q)}${term(alpha, "n")}${term(beta, "")}`;
        const substituted = `${poly([p, "(c(n - 1) + e)"], [q, "(c(n - 2) + e)"])}${term(alpha, "n")}${term(beta, "")}`;
        const constants = `${poly([D, "e"])} = ${poly([beta, ""], [-(p + 2 * q), "c"])}`;
        return numberProblem({
          prompt: t(
            `$a_n = ${rec}$ has a particular solution of the form $a_n = cn + e$. Find $${askE ? "e" : "c"}$.`,
            `$a_n = ${rec}$ 有形如 $a_n = cn + e$ 的特解。求 $${askE ? "e" : "c"}$。`,
          ),
          answer: askE ? e : c,
          wrong: askE
            ? [
                Q.of(beta, D),
                Q.of(beta)
                  .add(c.mul(Q.of(p + 2 * q)))
                  .div(Q.of(D)),
                e.neg(),
              ]
            : [Q.of(-alpha, D), Q.of(alpha).mul(Q.of(D)), Q.of(alpha)],
          solution: t(
            `Substitute $cn + e$: $cn + e = ${substituted}$. The $n$ terms give $${poly([D, "c"])} = ${alpha}$, so $c = ${c.toLatex()}$. The constants give $${constants}$, so $e = ${e.toLatex()}$.`,
            `代入 $cn + e$：$cn + e = ${substituted}$。比较 $n$ 的系数得 $${poly([D, "c"])} = ${alpha}$，所以 $c = ${c.toLatex()}$。比较常数项得 $${constants}$，所以 $e = ${e.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "constant-forcing-when-one-is-a-root",
      title: t("When 1 is a characteristic root", "当 1 是特征根时"),
      explanation: t(
        "When one is a characteristic root, constants solve the homogeneous part, so multiply the guess by the index. $a_n = 3a_{n-1} - 2a_{n-2} + 5$ has characteristic roots $1$ and $2$, so a constant particular solution fails. Try $cn$: $cn = 3c(n - 1) - 2c(n - 2) + 5$, so $0 = c + 5$ and $c = -5$.",
        "当 1 是特征根时，常数是齐次部分的解，所以要把猜测乘以下标。$a_n = 3a_{n-1} - 2a_{n-2} + 5$ 的特征根为 $1$ 和 $2$，所以常数特解不行。设 $cn$：$cn = 3c(n - 1) - 2c(n - 2) + 5$，所以 $0 = c + 5$，$c = -5$。",
      ),
      generate(rng) {
        const s = rng.pick([-3, -2, -1, 2, 3, 4]);
        const p = 1 + s;
        const q = -s;
        const k = rng.nonZero(-8, 8);
        const value = Q.of(k, p + 2 * q);
        return numberProblem({
          prompt: t(
            `The characteristic roots of $a_n = ${rec2(p, q)}${term(k, "")}$ are $1$ and $${s}$. It has a particular solution of the form $a_n = cn$. Find $c$.`,
            `$a_n = ${rec2(p, q)}${term(k, "")}$ 的特征根为 $1$ 和 $${s}$。它有形如 $a_n = cn$ 的特解。求 $c$。`,
          ),
          answer: value,
          wrong: [Q.of(k * s, 1 - s), Q.of(-k, p + 2 * q), Q.of(k, s), Q.of(k)],
          solution: t(
            `$cn = ${p === 0 ? "" : `${pn(p)}c(n - 1) + `}${pn(q)}c(n - 2)${term(k, "")}$. The $n$ terms cancel because $1$ is a root, leaving $0 = ${pn(-(p + 2 * q))}c${term(k, "")}$, so $c = ${value.toLatex()}$.`,
            `$cn = ${p === 0 ? "" : `${pn(p)}c(n - 1) + `}${pn(q)}c(n - 2)${term(k, "")}$。因为 $1$ 是特征根，$n$ 的项相互抵消，剩下 $0 = ${pn(-(p + 2 * q))}c${term(k, "")}$，所以 $c = ${value.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** secondOrderRecurrenceRelationsWithExponentialForcing finds exponential particular solutions of second-order recurrences. */
export const secondOrderRecurrenceRelationsWithExponentialForcing: TopicDef = {
  id: "second-order-recurrence-relations-with-exponential-forcing",
  title: t("Second-Order Recurrence Relations With Exponential Forcing", "指数强迫项的二阶递推关系"),
  summary: t(
    "For aₙ = p aₙ₋₁ + q aₙ₋₂ + k sⁿ, try K sⁿ, giving K = ks²/(s² − ps − q), unless s is a characteristic root; if s is a simple root, try Knsⁿ.",
    "对 aₙ = p aₙ₋₁ + q aₙ₋₂ + k sⁿ，设 K sⁿ，得 K = ks²/(s² − ps − q)，除非 s 是特征根；若 s 是单特征根，则设 Knsⁿ。",
  ),
  prerequisites: [
    "second-order-homogeneous-recurrence-relations-with-distinct-real-roots",
    "first-order-recurrence-relations-with-exponential-forcing",
  ],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "exponential-particular-solutions-of-second-order-recurrences",
      title: t("Exponential particular solutions", "指数特解"),
      explanation: t(
        "Try a constant times the forcing exponential and divide through by its lowest power to get a simple equation for the constant. For $a_n = a_{n-1} + 6a_{n-2} + 4^n$, try $K \\cdot 4^n$ and divide by $4^{n-2}$: $16K = 4K + 6K + 16$, so $K = \\frac{8}{3}$.",
        "尝试强迫指数函数的常数倍，再除以它的最低次幂，得到关于常数的简单方程。对 $a_n = a_{n-1} + 6a_{n-2} + 4^n$，设 $K \\cdot 4^n$，两边除以 $4^{n-2}$：$16K = 4K + 6K + 16$，所以 $K = \\frac{8}{3}$。",
      ),
      generate(rng) {
        const { p, q, r1, r2 } = randomRoots(rng);
        let s: number;
        do s = rng.pick([-3, -2, 2, 3, 4, 5]);
        while (s === r1 || s === r2);
        const k = rng.nonZero(-4, 4);
        const value = Q.of(k * s * s, s * s - p * s - q);
        return numberProblem({
          prompt: t(
            `$a_n = ${rec2(p, q)}${term(k, `\\cdot ${pn(s)}^n`)}$ has a particular solution of the form $K \\cdot ${pn(s)}^n$. Find $K$.`,
            `$a_n = ${rec2(p, q)}${term(k, `\\cdot ${pn(s)}^n`)}$ 有形如 $K \\cdot ${pn(s)}^n$ 的特解。求 $K$。`,
          ),
          answer: value,
          wrong: [Q.of(k, s * s - p * s - q), Q.of(k * s * s, s * s - p * s - q).neg(), Q.of(k * s, s * s - p * s - q), Q.of(k)],
          solution: t(
            `Divide by $${pn(s)}^{n-2}$: $${s * s}K = ${pn(p * s)}K + ${pn(q)}K${term(k * s * s, "")}$, so $${s * s - p * s - q}K = ${k * s * s}$ and $K = ${value.toLatex()}$.`,
            `两边除以 $${pn(s)}^{n-2}$：$${s * s}K = ${pn(p * s)}K + ${pn(q)}K${term(k * s * s, "")}$，所以 $${s * s - p * s - q}K = ${k * s * s}$，$K = ${value.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "exponential-forcing-at-a-characteristic-root",
      title: t("Forcing at a characteristic root", "强迫项的底数是特征根"),
      explanation: t(
        "When the forcing base is a characteristic root, multiply the guess by the index, and the terms containing the index cancel out. $a_n = a_{n-1} + 6a_{n-2} + 3^n$ has root $3$, so try $Kn3^n$. Dividing by $3^{n-2}$: $9Kn = 3K(n - 1) + 6K(n - 2) + 9$; the $n$ terms cancel and $15K = 9$, so $K = \\frac{3}{5}$.",
        "当强迫项的底数是特征根时，把猜测乘以下标，含下标的项会相互抵消。$a_n = a_{n-1} + 6a_{n-2} + 3^n$ 有特征根 $3$，所以设 $Kn3^n$。两边除以 $3^{n-2}$：$9Kn = 3K(n - 1) + 6K(n - 2) + 9$；$n$ 的项抵消，$15K = 9$，所以 $K = \\frac{3}{5}$。",
      ),
      generate(rng) {
        let roots: Roots;
        do roots = randomRoots(rng);
        while (Math.abs(roots.r1) < 2 && Math.abs(roots.r2) < 2);
        const { p, q, r1, r2 } = roots;
        const s = Math.abs(r1) < 2 ? r2 : Math.abs(r2) < 2 ? r1 : rng.bool() ? r1 : r2;
        const other = s === r1 ? r2 : r1;
        const k = rng.nonZero(-4, 4);
        const value = Q.of(k * s, s - other);
        return numberProblem({
          prompt: t(
            `The characteristic roots of $a_n = ${rec2(p, q)}${term(k, `\\cdot ${pn(s)}^n`)}$ are $${r1}$ and $${r2}$. It has a particular solution of the form $Kn \\cdot ${pn(s)}^n$. Find $K$.`,
            `$a_n = ${rec2(p, q)}${term(k, `\\cdot ${pn(s)}^n`)}$ 的特征根为 $${r1}$ 和 $${r2}$。它有形如 $Kn \\cdot ${pn(s)}^n$ 的特解。求 $K$。`,
          ),
          answer: value,
          wrong: [Q.of(k, s - other), Q.of(k * s, other - s), Q.of(k * s * s, s - other), Q.of(k)],
          solution: t(
            `Divide by $${pn(s)}^{n-2}$: $${s * s}Kn = ${pn(p * s)}K(n - 1) + ${pn(q)}K(n - 2)${term(k * s * s, "")}$. The $n$ terms cancel, leaving $${p * s + 2 * q}K = ${k * s * s}$, so $K = ${value.toLatex()}$.`,
            `两边除以 $${pn(s)}^{n-2}$：$${s * s}Kn = ${pn(p * s)}K(n - 1) + ${pn(q)}K(n - 2)${term(k * s * s, "")}$。$n$ 的项抵消，剩下 $${p * s + 2 * q}K = ${k * s * s}$，所以 $K = ${value.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** oneMinus writes 1 − rx. */
const oneMinus = (r: number) => `1 ${r < 0 ? "+" : "-"} ${Math.abs(r) === 1 ? "" : Math.abs(r)}x`;

/** generatingFunctions reads coefficients of generating functions built from geometric series. */
export const generatingFunctions: TopicDef = {
  id: "generating-functions",
  title: t("Generating Functions", "生成函数"),
  summary: t(
    "The generating function of a₀, a₁, a₂, … is G(x) = Σ aₙxⁿ. Since 1/(1 − rx) = Σ rⁿxⁿ, the sequence c·rⁿ has generating function c/(1 − rx), and (n + 1)rⁿ has 1/(1 − rx)².",
    "数列 a₀, a₁, a₂, … 的生成函数为 G(x) = Σ aₙxⁿ。由 1/(1 − rx) = Σ rⁿxⁿ，数列 c·rⁿ 的生成函数为 c/(1 − rx)，(n + 1)rⁿ 的为 1/(1 − rx)²。",
  ),
  prerequisites: ["introduction-to-recurrence-relations", "representing-functions-as-power-series"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "coefficients-of-geometric-generating-functions",
      title: t("Coefficients of c/(1 − rx)", "c/(1 − rx) 的系数"),
      explanation: t(
        "A constant over one minus a multiple of the variable is a geometric series, so its coefficients are that constant times powers of the multiple. $\\frac{5}{1 + 2x} = 5\\sum (-2)^n x^n$, so the coefficient of $x^4$ is $5 \\cdot 16 = 80$.",
        "常数除以一减去变量的倍数是一个几何级数，所以它的系数是该常数乘以那个倍数的幂。$\\frac{5}{1 + 2x} = 5\\sum (-2)^n x^n$，所以 $x^4$ 的系数为 $5 \\cdot 16 = 80$。",
      ),
      generate(rng) {
        const r = rng.pick(RATIOS);
        const c = rng.nonZero(-6, 6);
        const n = rng.int(2, 7);
        const value = c * r ** n;
        return numberProblem({
          prompt: t(
            `$G(x) = \\frac{${c}}{${oneMinus(r)}}$ is the generating function of $a_0, a_1, a_2, \\dots$. Find $a_{${n}}$.`,
            `$G(x) = \\frac{${c}}{${oneMinus(r)}}$ 是数列 $a_0, a_1, a_2, \\dots$ 的生成函数。求 $a_{${n}}$。`,
          ),
          answer: value,
          wrong: [c * (-r) ** n, c * r ** (n + 1), c * r ** (n - 1), c * r * n],
          solution: t(
            `$\\frac{${c}}{${oneMinus(r)}} = ${c}\\sum ${pn(r)}^n x^n$, so $a_{${n}} = ${c} \\cdot ${pn(r)}^{${n}} = ${value}$.`,
            `$\\frac{${c}}{${oneMinus(r)}} = ${c}\\sum ${pn(r)}^n x^n$，所以 $a_{${n}} = ${c} \\cdot ${pn(r)}^{${n}} = ${value}$。`,
          ),
        });
      },
    },
    {
      id: "coefficients-of-squared-geometric-generating-functions",
      title: t("Coefficients of $1/(1 - rx)^2$", "$1/(1 - rx)^2$ 的系数"),
      explanation: t(
        "Differentiating the geometric series gives the coefficients of its square, which grow linearly in the index times the powers. Differentiating $\\frac{1}{1 - x} = \\sum x^n$ gives $\\frac{1}{(1 - x)^2} = \\sum (n + 1)x^n$; replacing $x$ by $rx$, $\\frac{1}{(1 - 3x)^2}$ has $x^4$ coefficient $5 \\cdot 3^4 = 405$.",
        "对几何级数求导就得到它的平方的系数，这些系数是下标的一次式乘以相应的幂。对 $\\frac{1}{1 - x} = \\sum x^n$ 求导得 $\\frac{1}{(1 - x)^2} = \\sum (n + 1)x^n$；把 $x$ 换成 $rx$，$\\frac{1}{(1 - 3x)^2}$ 中 $x^4$ 的系数为 $5 \\cdot 3^4 = 405$。",
      ),
      generate(rng) {
        const r = rng.pick(RATIOS);
        const c = rng.nonZero(-3, 3);
        const n = rng.int(2, 6);
        const shift = rng.bool();
        const value = shift ? c * n * r ** (n - 1) : c * (n + 1) * r ** n;
        const num = shift ? (c === 1 ? "x" : c === -1 ? "-x" : `${c}x`) : `${c}`;
        return numberProblem({
          prompt: t(
            `$G(x) = \\frac{${num}}{(${oneMinus(r)})^2}$ is the generating function of $a_0, a_1, a_2, \\dots$. Find $a_{${n}}$.`,
            `$G(x) = \\frac{${num}}{(${oneMinus(r)})^2}$ 是数列 $a_0, a_1, a_2, \\dots$ 的生成函数。求 $a_{${n}}$。`,
          ),
          answer: value,
          wrong: [c * r ** n, c * n * r ** n, c * (n + 1) * r ** (n - 1), c * (n + 1) * (n + 1) * r ** n],
          solution: shift
            ? t(
                `$\\frac{1}{(${oneMinus(r)})^2} = \\sum (m + 1)${pn(r)}^m x^m$; multiplying by $${num}$ shifts it, so $a_{${n}} = ${c} \\cdot ${n} \\cdot ${pn(r)}^{${n - 1}} = ${value}$.`,
                `$\\frac{1}{(${oneMinus(r)})^2} = \\sum (m + 1)${pn(r)}^m x^m$；乘以 $${num}$ 使其平移，所以 $a_{${n}} = ${c} \\cdot ${n} \\cdot ${pn(r)}^{${n - 1}} = ${value}$。`,
              )
            : t(
                `$\\frac{1}{(${oneMinus(r)})^2} = \\sum (n + 1)${pn(r)}^n x^n$, so $a_{${n}} = ${c} \\cdot ${n + 1} \\cdot ${pn(r)}^{${n}} = ${value}$.`,
                `$\\frac{1}{(${oneMinus(r)})^2} = \\sum (n + 1)${pn(r)}^n x^n$，所以 $a_{${n}} = ${c} \\cdot ${n + 1} \\cdot ${pn(r)}^{${n}} = ${value}$。`,
              ),
        });
      },
    },
  ],
};

/** generatingFunctionsOfHomogeneousRecurrenceRelations turns recurrences into rational generating functions. */
export const generatingFunctionsOfHomogeneousRecurrenceRelations: TopicDef = {
  id: "generating-functions-of-homogeneous-recurrence-relations",
  title: t("Generating Functions of Homogeneous Recurrence Relations", "齐次递推关系的生成函数"),
  summary: t(
    "Multiplying aₙ = p aₙ₋₁ + q aₙ₋₂ by xⁿ and summing gives G(x)(1 − px − qx²) = a₀ + (a₁ − pa₀)x, so G(x) = (a₀ + (a₁ − pa₀)x)/(1 − px − qx²).",
    "把 aₙ = p aₙ₋₁ + q aₙ₋₂ 乘以 xⁿ 再求和，得 G(x)(1 − px − qx²) = a₀ + (a₁ − pa₀)x，所以 G(x) = (a₀ + (a₁ − pa₀)x)/(1 − px − qx²)。",
  ),
  prerequisites: ["generating-functions", "second-order-homogeneous-recurrence-relations-with-distinct-real-roots"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "generating-functions-of-first-order-recurrences",
      title: t("First-order recurrences", "一阶递推关系"),
      explanation: t(
        "Multiplying the recurrence by powers of the variable and summing turns it into an equation for the generating function. If $a_n = 3a_{n-1}$ and $a_0 = 2$, then $G(x) - 3xG(x) = 2$, so $G(x) = \\frac{2}{1 - 3x}$ and $G\\left(\\frac{1}{5}\\right) = \\frac{2}{2/5} = 5$.",
        "把递推式乘以变量的幂再求和，就把它变成关于生成函数的方程。若 $a_n = 3a_{n-1}$，$a_0 = 2$，则 $G(x) - 3xG(x) = 2$，所以 $G(x) = \\frac{2}{1 - 3x}$，$G\\left(\\frac{1}{5}\\right) = \\frac{2}{2/5} = 5$。",
      ),
      generate(rng) {
        const r = rng.pick(RATIOS);
        const a0 = rng.nonZero(-6, 6);
        let m: number;
        do m = rng.int(2, 12);
        while (Math.abs(r) >= m);
        const x = Q.of(1, m);
        const value = Q.of(a0).div(Q.of(1).sub(Q.of(r).mul(x)));
        return numberProblem({
          prompt: t(
            `$a_n = ${r}a_{n-1}$ for $n \\ge 1$, with $a_0 = ${a0}$. Its generating function is $G(x) = \\sum a_n x^n$. Find $G\\left(\\frac{1}{${m}}\\right)$.`,
            `$a_n = ${r}a_{n-1}$（$n \\ge 1$），$a_0 = ${a0}$。其生成函数为 $G(x) = \\sum a_n x^n$。求 $G\\left(\\frac{1}{${m}}\\right)$。`,
          ),
          answer: value,
          wrong: [
            Q.of(a0).div(Q.of(1).add(Q.of(r).mul(x))),
            Q.of(1).div(Q.of(1).sub(Q.of(r).mul(x))),
            Q.of(a0).mul(Q.of(1).sub(Q.of(r).mul(x))),
          ],
          solution: t(
            `$G(x) - ${pn(r)}xG(x) = ${a0}$, so $G(x) = \\frac{${a0}}{${oneMinus(r)}}$ and $G\\left(\\frac{1}{${m}}\\right) = \\frac{${a0}}{${Q.of(1).sub(Q.of(r).mul(x)).toLatex()}} = ${value.toLatex()}$.`,
            `$G(x) - ${pn(r)}xG(x) = ${a0}$，所以 $G(x) = \\frac{${a0}}{${oneMinus(r)}}$，$G\\left(\\frac{1}{${m}}\\right) = \\frac{${a0}}{${Q.of(1).sub(Q.of(r).mul(x)).toLatex()}} = ${value.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "generating-functions-of-second-order-recurrences",
      title: t("Second-order recurrences", "二阶递推关系"),
      explanation: t(
        "For $a_n = 2a_{n-1} + 3a_{n-2}$ with $a_0 = 1$, $a_1 = 5$: $G(x)(1 - 2x - 3x^2) = 1 + (5 - 2)x$, so $G(x) = \\frac{1 + 3x}{1 - 2x - 3x^2}$. The early terms that the recurrence does not cover go into the numerator.",
        "对 $a_n = 2a_{n-1} + 3a_{n-2}$，$a_0 = 1$，$a_1 = 5$：$G(x)(1 - 2x - 3x^2) = 1 + (5 - 2)x$，所以 $G(x) = \\frac{1 + 3x}{1 - 2x - 3x^2}$。递推关系未覆盖的前几项进入分子。",
      ),
      generate(rng) {
        const p = rng.nonZero(-4, 4);
        const q = rng.nonZero(-4, 4);
        const a0 = rng.int(-5, 5);
        const a1 = rng.int(-5, 5);
        const value = a1 - p * a0;
        const den = lin([
          [1, ""],
          [-p, "x"],
          [-q, "x^2"],
        ]);
        return numberProblem({
          prompt: t(
            `$a_n = ${rec2(p, q)}$ for $n \\ge 2$, with $a_0 = ${a0}$ and $a_1 = ${a1}$. Its generating function is $G(x) = \\frac{${a0} + bx}{${den}}$. Find $b$.`,
            `$a_n = ${rec2(p, q)}$（$n \\ge 2$），$a_0 = ${a0}$，$a_1 = ${a1}$。其生成函数为 $G(x) = \\frac{${a0} + bx}{${den}}$。求 $b$。`,
          ),
          answer: value,
          wrong: [a1, a1 + p * a0, a1 - q * a0, a1 - p * a0 - q],
          solution: t(
            `Multiplying by $x^n$ and summing from $n = 2$: $G(x)(${den}) = a_0 + (a_1 - ${pn(p)}a_0)x$, so $b = ${a1} - ${pn(p)} \\cdot ${pn(a0)} = ${value}$.`,
            `乘以 $x^n$ 并从 $n = 2$ 求和：$G(x)(${den}) = a_0 + (a_1 - ${pn(p)}a_0)x$，所以 $b = ${a1} - ${pn(p)} \\cdot ${pn(a0)} = ${value}$。`,
          ),
        });
      },
    },
  ],
};

/** PartialFractions is a generating function A/(1 − r₁x) + B/(1 − r₂x) with its combined form. */
interface PartialFractions {
  readonly r1: number;
  readonly r2: number;
  readonly A: number;
  readonly B: number;
  readonly tex: string;
}

/** randomPartialFractions builds (A + B − (Ar₂ + Br₁)x)/((1 − r₁x)(1 − r₂x)). */
function randomPartialFractions(rng: Rng): PartialFractions {
  const { r1, r2 } = randomRoots(rng);
  const A = rng.nonZero(-4, 4);
  const B = rng.nonZero(-4, 4);
  const num = lin([
    [A + B, ""],
    [-(A * r2 + B * r1), "x"],
  ]);
  return { r1, r2, A, B, tex: `\\frac{${num}}{(${oneMinus(r1)})(${oneMinus(r2)})}` };
}

/** determiningTheGeneralTermOfASequenceFromItsGeneratingFunction uses partial fractions to read off aₙ. */
export const determiningTheGeneralTermOfASequenceFromItsGeneratingFunction: TopicDef = {
  id: "determining-the-general-term-of-a-sequence-from-its-generating-function",
  title: t("Determining the General Term of a Sequence Given Its Generating Function", "由生成函数确定数列的通项"),
  summary: t(
    "Split G(x) = N(x)/((1 − r₁x)(1 − r₂x)) into partial fractions A/(1 − r₁x) + B/(1 − r₂x); then aₙ = A r₁ⁿ + B r₂ⁿ.",
    "把 G(x) = N(x)/((1 − r₁x)(1 − r₂x)) 拆成部分分式 A/(1 − r₁x) + B/(1 − r₂x)；于是 aₙ = A r₁ⁿ + B r₂ⁿ。",
  ),
  prerequisites: ["generating-functions", "expressing-rational-functions-as-sums-of-partial-fractions"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "partial-fractions-of-generating-functions",
      title: t("Partial fractions", "部分分式"),
      explanation: t(
        "Partial fractions split a rational generating function into geometric pieces, each of which has easy coefficients. $\\frac{3 - 5x}{(1 - 2x)(1 - x)} = \\frac{A}{1 - 2x} + \\frac{B}{1 - x}$ means $3 - 5x = A(1 - x) + B(1 - 2x)$. Putting $x = 1$: $-2 = -B$, so $B = 2$; putting $x = \\frac{1}{2}$: $\\frac{1}{2} = \\frac{A}{2}$, so $A = 1$. Then $a_n = 2^n + 2$.",
        "部分分式把有理生成函数拆成若干几何部分，每一部分的系数都很容易求。$\\frac{3 - 5x}{(1 - 2x)(1 - x)} = \\frac{A}{1 - 2x} + \\frac{B}{1 - x}$ 意味着 $3 - 5x = A(1 - x) + B(1 - 2x)$。令 $x = 1$：$-2 = -B$，所以 $B = 2$；令 $x = \\frac{1}{2}$：$\\frac{1}{2} = \\frac{A}{2}$，所以 $A = 1$。于是 $a_n = 2^n + 2$。",
      ),
      generate(rng) {
        const f = randomPartialFractions(rng);
        const askA = rng.bool();
        return numberProblem({
          prompt: t(
            `$G(x) = ${f.tex}$ is the generating function of $a_n = A \\cdot ${pn(f.r1)}^n + B \\cdot ${pn(f.r2)}^n$. Find $${askA ? "A" : "B"}$.`,
            `$G(x) = ${f.tex}$ 是 $a_n = A \\cdot ${pn(f.r1)}^n + B \\cdot ${pn(f.r2)}^n$ 的生成函数。求 $${askA ? "A" : "B"}$。`,
          ),
          answer: askA ? f.A : f.B,
          wrong: [askA ? f.B : f.A, f.A + f.B, askA ? -f.A : -f.B],
          solution: t(
            `Writing $G(x) = \\frac{A}{${oneMinus(f.r1)}} + \\frac{B}{${oneMinus(f.r2)}}$ and comparing numerators: $A + B = ${f.A + f.B}$ and $${pn(f.r2)}A + ${pn(f.r1)}B = ${f.A * f.r2 + f.B * f.r1}$, so $A = ${f.A}$ and $B = ${f.B}$.`,
            `设 $G(x) = \\frac{A}{${oneMinus(f.r1)}} + \\frac{B}{${oneMinus(f.r2)}}$ 并比较分子：$A + B = ${f.A + f.B}$，$${pn(f.r2)}A + ${pn(f.r1)}B = ${f.A * f.r2 + f.B * f.r1}$，所以 $A = ${f.A}$，$B = ${f.B}$。`,
          ),
        });
      },
    },
    {
      id: "terms-from-a-rational-generating-function",
      title: t("Finding a term", "求某一项"),
      explanation: t(
        "Once the generating function is a sum of geometric pieces, each term is the sum of the matching coefficients, with no long expansion needed. If $G(x) = \\frac{1}{1 - 2x} + \\frac{2}{1 - x}$, then $a_n = 2^n + 2$ and $a_{10} = 1026$, without expanding the power series term by term.",
        "一旦生成函数写成几何部分之和，每一项就是相应系数之和，不需要冗长的展开。若 $G(x) = \\frac{1}{1 - 2x} + \\frac{2}{1 - x}$，则 $a_n = 2^n + 2$，$a_{10} = 1026$，无需逐项展开幂级数。",
      ),
      generate(rng) {
        const f = randomPartialFractions(rng);
        const N = rng.int(5, 10);
        const value = f.A * f.r1 ** N + f.B * f.r2 ** N;
        return numberProblem({
          prompt: t(
            `$G(x) = ${f.tex}$ is the generating function of $a_0, a_1, a_2, \\dots$. Find $a_{${N}}$.`,
            `$G(x) = ${f.tex}$ 是数列 $a_0, a_1, a_2, \\dots$ 的生成函数。求 $a_{${N}}$。`,
          ),
          answer: value,
          wrong: [f.B * f.r1 ** N + f.A * f.r2 ** N, f.A * f.r1 ** (N - 1) + f.B * f.r2 ** (N - 1), (f.A + f.B) * f.r1 ** N],
          solution: t(
            `Partial fractions give $\\frac{${f.A}}{${oneMinus(f.r1)}} + \\frac{${f.B}}{${oneMinus(f.r2)}}$, so $a_{${N}} = ${pn(f.A)} \\cdot ${pn(f.r1)}^{${N}} + ${pn(f.B)} \\cdot ${pn(f.r2)}^{${N}} = ${value}$.`,
            `部分分式得 $\\frac{${f.A}}{${oneMinus(f.r1)}} + \\frac{${f.B}}{${oneMinus(f.r2)}}$，所以 $a_{${N}} = ${pn(f.A)} \\cdot ${pn(f.r1)}^{${N}} + ${pn(f.B)} \\cdot ${pn(f.r2)}^{${N}} = ${value}$。`,
          ),
        });
      },
    },
  ],
};

/** solvingHomogeneousRecurrenceRelationsUsingGeneratingFunctions combines the two previous steps. */
export const solvingHomogeneousRecurrenceRelationsUsingGeneratingFunctions: TopicDef = {
  id: "solving-homogeneous-recurrence-relations-using-generating-functions",
  title: t("Solving Homogeneous Recurrence Relations Using Generating Functions", "用生成函数解齐次递推关系"),
  summary: t(
    "Write the generating function of the recurrence, factor its denominator 1 − px − qx² = (1 − r₁x)(1 − r₂x), split into partial fractions and read off aₙ = A r₁ⁿ + B r₂ⁿ.",
    "写出递推关系的生成函数，把分母分解为 1 − px − qx² = (1 − r₁x)(1 − r₂x)，拆成部分分式，读出 aₙ = A r₁ⁿ + B r₂ⁿ。",
  ),
  prerequisites: [
    "generating-functions-of-homogeneous-recurrence-relations",
    "determining-the-general-term-of-a-sequence-from-its-generating-function",
  ],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "factoring-the-denominator",
      title: t("Factoring the denominator", "分解分母"),
      explanation: t(
        "$1 - x - 6x^2 = (1 - 3x)(1 + 2x)$. The numbers $3$ and $-2$ are the roots of $x^2 - x - 6$: the denominator is the characteristic polynomial with its coefficients reversed.",
        "$1 - x - 6x^2 = (1 - 3x)(1 + 2x)$。数 $3$ 和 $-2$ 正是 $x^2 - x - 6$ 的根：分母就是系数倒序排列的特征多项式。",
      ),
      generate(rng) {
        const { r1, r2, p, q } = randomRoots(rng);
        const den = lin([
          [1, ""],
          [-p, "x"],
          [-q, "x^2"],
        ]);
        const askLarger = rng.bool();
        return numberProblem({
          prompt: t(
            `The generating function of $a_n = ${rec2(p, q)}$ has denominator $${den} = (1 - r_1x)(1 - r_2x)$ with $r_1 > r_2$. Find $${askLarger ? "r_1" : "r_2"}$.`,
            `$a_n = ${rec2(p, q)}$ 的生成函数分母为 $${den} = (1 - r_1x)(1 - r_2x)$，$r_1 > r_2$。求 $${askLarger ? "r_1" : "r_2"}$。`,
          ),
          answer: askLarger ? r1 : r2,
          wrong: [askLarger ? r2 : r1, askLarger ? -r2 : -r1, askLarger ? -r1 : -r2],
          solution: t(
            `$r_1 + r_2 = ${p}$ and $r_1r_2 = ${-q}$, so $r_1 = ${r1}$, $r_2 = ${r2}$: $${den} = (${oneMinus(r1)})(${oneMinus(r2)})$.`,
            `$r_1 + r_2 = ${p}$，$r_1r_2 = ${-q}$，所以 $r_1 = ${r1}$，$r_2 = ${r2}$：$${den} = (${oneMinus(r1)})(${oneMinus(r2)})$。`,
          ),
        });
      },
    },
    {
      id: "solving-a-recurrence-with-generating-functions",
      title: t("Solving a recurrence", "解递推关系"),
      explanation: t(
        "Find the generating function from the recurrence, split it by partial fractions, and read off a closed form for the terms. For $a_n = a_{n-1} + 6a_{n-2}$, $a_0 = 3$, $a_1 = 4$: $G(x) = \\frac{3 + x}{(1 - 3x)(1 + 2x)} = \\frac{2}{1 - 3x} + \\frac{1}{1 + 2x}$, so $a_n = 2 \\cdot 3^n + (-2)^n$.",
        "由递推式求出生成函数，用部分分式拆开，再读出通项的封闭形式。对 $a_n = a_{n-1} + 6a_{n-2}$，$a_0 = 3$，$a_1 = 4$：$G(x) = \\frac{3 + x}{(1 - 3x)(1 + 2x)} = \\frac{2}{1 - 3x} + \\frac{1}{1 + 2x}$，所以 $a_n = 2 \\cdot 3^n + (-2)^n$。",
      ),
      generate(rng) {
        const { r1, r2, p, q } = randomRoots(rng);
        const A = rng.nonZero(-4, 4);
        const B = rng.nonZero(-4, 4);
        const a0 = A + B;
        const a1 = A * r1 + B * r2;
        const N = rng.int(5, 9);
        const value = A * r1 ** N + B * r2 ** N;
        const num = lin([
          [a0, ""],
          [a1 - p * a0, "x"],
        ]);
        return numberProblem({
          prompt: t(
            `Use generating functions to solve $a_n = ${rec2(p, q)}$ with $a_0 = ${a0}$ and $a_1 = ${a1}$, and find $a_{${N}}$.`,
            `用生成函数解 $a_n = ${rec2(p, q)}$，$a_0 = ${a0}$，$a_1 = ${a1}$，并求 $a_{${N}}$。`,
          ),
          answer: value,
          wrong: [B * r1 ** N + A * r2 ** N, A * r1 ** (N - 1) + B * r2 ** (N - 1), a0 * r1 ** N],
          solution: t(
            `$G(x) = \\frac{${num}}{(${oneMinus(r1)})(${oneMinus(r2)})} = \\frac{${A}}{${oneMinus(r1)}} + \\frac{${B}}{${oneMinus(r2)}}$, so $a_{${N}} = ${pn(A)} \\cdot ${pn(r1)}^{${N}} + ${pn(B)} \\cdot ${pn(r2)}^{${N}} = ${value}$.`,
            `$G(x) = \\frac{${num}}{(${oneMinus(r1)})(${oneMinus(r2)})} = \\frac{${A}}{${oneMinus(r1)}} + \\frac{${B}}{${oneMinus(r2)}}$，所以 $a_{${N}} = ${pn(A)} \\cdot ${pn(r1)}^{${N}} + ${pn(B)} \\cdot ${pn(r2)}^{${N}} = ${value}$。`,
          ),
        });
      },
    },
  ],
};

/** generatingFunctionsForInhomogeneousRecurrenceRelations handles forcing terms with generating functions. */
export const generatingFunctionsForInhomogeneousRecurrenceRelations: TopicDef = {
  id: "generating-functions-for-inhomogeneous-recurrence-relations",
  title: t("Generating Functions for Inhomogeneous Recurrence Relations", "非齐次递推关系的生成函数"),
  summary: t(
    "A forcing term contributes its own generating function: for aₙ = r aₙ₋₁ + c, (1 − rx)G(x) = a₀ + cx/(1 − x); for aₙ = r aₙ₋₁ + sⁿ, (1 − rx)G(x) = a₀ + sx/(1 − sx). Partial fractions then give aₙ.",
    "强迫项贡献它自己的生成函数：对 aₙ = r aₙ₋₁ + c，(1 − rx)G(x) = a₀ + cx/(1 − x)；对 aₙ = r aₙ₋₁ + sⁿ，(1 − rx)G(x) = a₀ + sx/(1 − sx)。再用部分分式求出 aₙ。",
  ),
  prerequisites: [
    "solving-homogeneous-recurrence-relations-using-generating-functions",
    "first-order-recurrence-relations-with-exponential-forcing",
  ],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "generating-functions-with-a-constant-forcing-term",
      title: t("A constant forcing term", "常数强迫项"),
      explanation: t(
        "A constant forcing term contributes a geometric series to the equation, which adds a factor to the denominator of the generating function. For $a_n = 2a_{n-1} + 3$, $a_0 = 1$: $(1 - 2x)G(x) = 1 + \\frac{3x}{1 - x}$, so $G(x) = \\frac{1 + 2x}{(1 - x)(1 - 2x)}$.",
        "常数强迫项在方程中贡献一个几何级数，这会给生成函数的分母增加一个因子。对 $a_n = 2a_{n-1} + 3$，$a_0 = 1$：$(1 - 2x)G(x) = 1 + \\frac{3x}{1 - x}$，所以 $G(x) = \\frac{1 + 2x}{(1 - x)(1 - 2x)}$。",
      ),
      generate(rng) {
        const r = rng.pick(RATIOS);
        const c = rng.nonZero(-6, 6);
        const a0 = rng.int(-5, 5);
        const value = c - a0;
        return numberProblem({
          prompt: t(
            `$a_n = ${r}a_{n-1}${term(c, "")}$ for $n \\ge 1$, with $a_0 = ${a0}$. Its generating function is $G(x) = \\frac{${a0} + bx}{(1 - x)(${oneMinus(r)})}$. Find $b$.`,
            `$a_n = ${r}a_{n-1}${term(c, "")}$（$n \\ge 1$），$a_0 = ${a0}$。其生成函数为 $G(x) = \\frac{${a0} + bx}{(1 - x)(${oneMinus(r)})}$。求 $b$。`,
          ),
          answer: value,
          wrong: [c, c + a0, a0 - c, c - r * a0],
          solution: t(
            `$(${oneMinus(r)})G(x) = ${a0} + \\frac{${poly([c, "x"])}}{1 - x}$, so $G(x) = \\frac{${poly([a0, "(1 - x)"], [c, "x"])}}{(1 - x)(${oneMinus(r)})}$ and $b = ${c} - ${pn(a0)} = ${value}$.`,
            `$(${oneMinus(r)})G(x) = ${a0} + \\frac{${poly([c, "x"])}}{1 - x}$，所以 $G(x) = \\frac{${poly([a0, "(1 - x)"], [c, "x"])}}{(1 - x)(${oneMinus(r)})}$，$b = ${c} - ${pn(a0)} = ${value}$。`,
          ),
        });
      },
    },
    {
      id: "solving-exponentially-forced-recurrences-with-generating-functions",
      title: t("An exponential forcing term", "指数强迫项"),
      explanation: t(
        "An exponential forcing term adds its own geometric factor, so partial fractions produce a term with that base in the solution. For $a_n = 2a_{n-1} + 3^n$, $a_0 = 1$: $G(x) = \\frac{1}{(1 - 2x)(1 - 3x)} = \\frac{-2}{1 - 2x} + \\frac{3}{1 - 3x}$, so $a_n = 3^{n+1} - 2^{n+1}$.",
        "指数强迫项会增加它自己的几何因子，所以部分分式会在解中产生以该底数为底的项。对 $a_n = 2a_{n-1} + 3^n$，$a_0 = 1$：$G(x) = \\frac{1}{(1 - 2x)(1 - 3x)} = \\frac{-2}{1 - 2x} + \\frac{3}{1 - 3x}$，所以 $a_n = 3^{n+1} - 2^{n+1}$。",
      ),
      generate(rng) {
        const r = rng.pick([-2, 2, 3]);
        let s: number;
        do s = rng.pick([-2, 2, 3, 4]);
        while (s === r);
        const a0 = rng.int(-3, 4);
        const N = rng.int(4, 8);
        const a = iterate1(Q.of(a0), r, (n) => Q.of(s).pow(n), N);
        const B = Q.of(s, s - r);
        const A = Q.of(a0).sub(B);
        return numberProblem({
          prompt: t(
            `Use generating functions to solve $a_n = ${r}a_{n-1} + ${pn(s)}^n$ with $a_0 = ${a0}$, and find $a_{${N}}$.`,
            `用生成函数解 $a_n = ${r}a_{n-1} + ${pn(s)}^n$，$a_0 = ${a0}$，并求 $a_{${N}}$。`,
          ),
          answer: a[N]!,
          wrong: [a[N - 1]!, Q.of(a0).mul(Q.of(r).pow(N)).add(Q.of(s).pow(N)), A.mul(Q.of(s).pow(N)).add(B.mul(Q.of(r).pow(N)))],
          solution: t(
            `$(${oneMinus(r)})G(x) = ${a0} + \\frac{${s}x}{${oneMinus(s)}}$, and partial fractions give $G(x) = \\frac{${A.toLatex()}}{${oneMinus(r)}} + \\frac{${B.toLatex()}}{${oneMinus(s)}}$. So $a_{${N}} = ${pq(A)} \\cdot ${pn(r)}^{${N}} + ${pq(B)} \\cdot ${pn(s)}^{${N}} = ${a[N]!.toLatex()}$.`,
            `$(${oneMinus(r)})G(x) = ${a0} + \\frac{${s}x}{${oneMinus(s)}}$，部分分式得 $G(x) = \\frac{${A.toLatex()}}{${oneMinus(r)}} + \\frac{${B.toLatex()}}{${oneMinus(s)}}$。所以 $a_{${N}} = ${pq(A)} \\cdot ${pn(r)}^{${N}} + ${pq(B)} \\cdot ${pn(s)}^{${N}} = ${a[N]!.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** discreteMathematicsRecurrenceTopics are the new topics of Discrete Mathematics unit 6. */
export const discreteMathematicsRecurrenceTopics: readonly TopicDef[] = [
  introductionToRecurrenceRelations,
  firstOrderRecurrenceRelations,
  firstOrderRecurrenceRelationsWithPolynomialForcing,
  firstOrderRecurrenceRelationsWithExponentialForcing,
  secondOrderHomogeneousRecurrenceRelationsWithDistinctRealRoots,
  secondOrderHomogeneousRecurrenceRelationsWithRepeatedRoots,
  secondOrderHomogeneousRecurrenceRelationsWithComplexRoots,
  secondOrderRecurrenceRelationsWithPolynomialForcing,
  secondOrderRecurrenceRelationsWithExponentialForcing,
  generatingFunctions,
  generatingFunctionsOfHomogeneousRecurrenceRelations,
  determiningTheGeneralTermOfASequenceFromItsGeneratingFunction,
  solvingHomogeneousRecurrenceRelationsUsingGeneratingFunctions,
  generatingFunctionsForInhomogeneousRecurrenceRelations,
];
