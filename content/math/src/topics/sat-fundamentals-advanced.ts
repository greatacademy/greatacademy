import type { KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { linear, num, paren, poly, Q, radical } from "@ga/subject-math";

import { expressionProblem, factoredProblem, inequalityProblem, numberProblem, solutionsProblem, steps } from "../problems.ts";
import { pickChoice } from "./grade-4-fractions.ts";

// SAT Math Fundamentals, advanced math: factoring with surds and hidden factors, quadratic equations and functions
// reasoned about through their forms, nonlinear systems, polynomial outputs, exponential expressions and models,
// rational expressions and equations in several variables.

/** topic builds a TopicDef with the common fields filled in. */
function topic(
  id: string,
  title: Text,
  summary: Text,
  prerequisites: string[],
  standards: string[],
  knowledgePoints: KnowledgePointDef[],
): TopicDef {
  return {
    id,
    title,
    summary,
    prerequisites,
    encompasses: [],
    xp: 10,
    standards: standards.map((s) => `CCSS.${s}`),
    knowledgePoints,
  };
}

/** kp builds a KnowledgePointDef. */
function kp(id: string, title: Text, explanation: Text, generate: (rng: Rng) => Problem): KnowledgePointDef {
  return { id, title, explanation, generate };
}

/** lf writes a linear factor in parentheses: lf(1, -3) is "(x - 3)". */
function lf(a: number, b: number, v = "x"): string {
  return `(${linear(a, b, v)})`;
}

/** squareFreePart splits n into k²m with m square-free. */
function squareFreePart(n: number): [number, number] {
  let k = 1;
  let m = n;
  for (let f = 2; f * f <= m; f++) {
    while (m % (f * f) === 0) {
      m /= f * f;
      k *= f;
    }
  }
  return [k, m];
}

/** gcd is the greatest common divisor of two integers. */
function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

/** frac writes p/q in lowest terms, with a variable part in the numerator: frac(4, 6, "x") is "\frac{2x}{3}". */
function frac(p: number, q: number, v = ""): string {
  const g = gcd(p, q) * Math.sign(q);
  const [a, b] = [p / g, q / g];
  const top = v === "" ? String(Math.abs(a)) : `${Math.abs(a) === 1 ? "" : Math.abs(a)}${v}`;
  const body = b === 1 ? top : `\\frac{${top}}{${b}}`;
  return a < 0 ? `-${body}` : body;
}

// ---------------------------------------------------------------------------
// Factoring polynomials

/** factoringDifferencesOfSquaresUsingSurds factors x² − n over the reals when n is not a perfect square. */
export const factoringDifferencesOfSquaresUsingSurds = topic(
  "factoring-differences-of-squares-using-surds",
  t("Factoring Differences of Squares Using Surds", "用根式分解平方差"),
  t(
    "Factor $a^2x^2 - n$ as a difference of squares even when $n$ is not a perfect square, by writing $n$ as $(\\sqrt{n})^2$.",
    "把 $n$ 写成 $(\\sqrt{n})^2$，即使 $n$ 不是完全平方数，也能把 $a^2x^2 - n$ 当作平方差分解。",
  ),
  ["factoring-differences-of-squares", "surds"],
  ["HSA.SSE.A.2", "HSN.RN.A.2"],
  [
    kp(
      "factoring-with-a-surd",
      t("Factoring with a surd", "用根式分解"),
      t(
        "Every positive number is a square: $7 = (\\sqrt{7})^2$. So $x^2 - 7$ is a difference of squares and factors as $(x - \\sqrt{7})(x + \\sqrt{7})$. Write the surd in simplest form, so $x^2 - 12 = (x - 2\\sqrt{3})(x + 2\\sqrt{3})$.",
        "每个正数都是某个数的平方：$7 = (\\sqrt{7})^2$。所以 $x^2 - 7$ 是平方差，可以分解为 $(x - \\sqrt{7})(x + \\sqrt{7})$。根式要写成最简形式，所以 $x^2 - 12 = (x - 2\\sqrt{3})(x + 2\\sqrt{3})$。",
      ),
      (rng) => {
        let n = 0;
        let k = 1;
        let m = 1;
        do {
          n = rng.int(2, 99);
          [k, m] = squareFreePart(n);
        } while (m === 1);
        const a = rng.pick([1, 1, 2, 3, 5]);
        const ax = a === 1 ? "x" : `${a}x`;
        const s = radical(k, m);
        const opt = (e: string) => t(`$${e}$`, `$${e}$`);
        return pickChoice(
          rng,
          t(
            `Which expression is equal to $${a * a === 1 ? "" : a * a}x^2 - ${n}$?`,
            `下列哪个式子等于 $${a * a === 1 ? "" : a * a}x^2 - ${n}$？`,
          ),
          opt(`(${ax} - ${s})(${ax} + ${s})`),
          [
            opt(`(${ax} - ${s})^2`),
            opt(`(${ax} - ${Q.of(n, 2).toLatex()})(${ax} + ${Q.of(n, 2).toLatex()})`),
            opt(`(${ax} - ${radical(k, m === 2 ? 3 : 2)})(${ax} + ${radical(k, m === 2 ? 3 : 2)})`),
          ],
          t(
            `Write $${n}$ as $(${s})^2$. Then the expression is a difference of squares:${steps(`${a * a === 1 ? "" : a * a}x^2 - ${n} = (${ax})^2 - (${s})^2 = (${ax} - ${s})(${ax} + ${s})`)}`,
            `把 $${n}$ 写成 $(${s})^2$，这个式子就是平方差：${steps(`${a * a === 1 ? "" : a * a}x^2 - ${n} = (${ax})^2 - (${s})^2 = (${ax} - ${s})(${ax} + ${s})`)}`,
          ),
        );
      },
    ),
    kp(
      "solving-with-surd-factors",
      t("Solving with surd factors", "用根式因式解方程"),
      t(
        "Once $a^2x^2 - n$ is factored as $(ax - \\sqrt{n})(ax + \\sqrt{n})$, the zero product rule gives $ax = \\pm\\sqrt{n}$, so $x = \\pm\\frac{\\sqrt{n}}{a}$. Simplify the surd and write each solution in simplest form.",
        "把 $a^2x^2 - n$ 分解为 $(ax - \\sqrt{n})(ax + \\sqrt{n})$ 后，由零乘积法则得 $ax = \\pm\\sqrt{n}$，所以 $x = \\pm\\frac{\\sqrt{n}}{a}$。化简根式，把每个解写成最简形式。",
      ),
      (rng) => {
        let n = 0;
        let k = 1;
        let m = 1;
        do {
          n = rng.int(2, 75);
          [k, m] = squareFreePart(n);
        } while (m === 1);
        const a = rng.int(1, 6);
        const r = radical(Q.of(k, a), m);
        return solutionsProblem({
          prompt: t(
            `Solve $${a * a === 1 ? "" : a * a}x^2 - ${n} = 0$ by factoring.`,
            `用因式分解法解方程 $${a * a === 1 ? "" : a * a}x^2 - ${n} = 0$。`,
          ),
          values: [r, `-${r}`],
          wrong: [[r], [radical(Q.of(k, a * a), m), `-${radical(Q.of(k, a * a), m)}`], [num(Q.of(n, a * a)), num(Q.of(-n, a * a))]],
          solution: t(
            `Factor as $(${a === 1 ? "" : a}x - ${radical(k, m)})(${a === 1 ? "" : a}x + ${radical(k, m)}) = 0$, so $${a === 1 ? "" : a}x = \\pm ${radical(k, m)}$ and $x = \\pm ${r}$.`,
            `分解为 $(${a === 1 ? "" : a}x - ${radical(k, m)})(${a === 1 ? "" : a}x + ${radical(k, m)}) = 0$，所以 $${a === 1 ? "" : a}x = \\pm ${radical(k, m)}$，$x = \\pm ${r}$。`,
          ),
        });
      },
    ),
  ],
);

/** factoringExpressionsContainingBinomials factors expressions in which a binomial plays the role of the variable. */
export const factoringExpressionsContainingBinomials = topic(
  "factoring-expressions-containing-binomials",
  t("Factoring Expressions Containing Binomials", "分解含二项式的式子"),
  t(
    "Factor expressions such as $(x + 2)^2 - 9$ or $(x + 2)^2 - 3(x + 2) - 10$ by treating the binomial as a single quantity.",
    "把二项式看成一个整体，分解 $(x + 2)^2 - 9$ 或 $(x + 2)^2 - 3(x + 2) - 10$ 这样的式子。",
  ),
  ["factoring-trinomials", "factoring-differences-of-squares"],
  ["HSA.SSE.A.2"],
  [
    kp(
      "a-difference-of-squares-of-a-binomial",
      t("A difference of squares with a binomial", "含二项式的平方差"),
      t(
        "In $(x + p)^2 - b^2$ the first square is the square of the whole binomial. Let $u = x + p$: then $u^2 - b^2 = (u - b)(u + b)$, and substituting back gives $(x + p - b)(x + p + b)$. Combine the constants inside each factor.",
        "在 $(x + p)^2 - b^2$ 中，第一个平方是整个二项式的平方。令 $u = x + p$，则 $u^2 - b^2 = (u - b)(u + b)$，代回得 $(x + p - b)(x + p + b)$。再合并每个因式中的常数。",
      ),
      (rng) => {
        let p = 0;
        let b = 0;
        do {
          p = rng.nonZero(-9, 9);
          b = rng.int(1, 9);
        } while (p === b || p === -b);
        const answer = `${lf(1, p - b)}${lf(1, p + b)}`;
        return factoredProblem({
          prompt: t(`Factor $${lf(1, p)}^2 - ${b * b}$ completely.`, `把 $${lf(1, p)}^2 - ${b * b}$ 分解彻底。`),
          answer,
          wrong: [`${lf(1, p - b)}^2`, `${lf(1, p)}${lf(1, -b)}${lf(1, b)}`, `${lf(1, -p - b)}${lf(1, -p + b)}`],
          solution: t(
            `Let $u = ${linear(1, p)}$. Then${steps(`u^2 - ${b}^2 = (u - ${b})(u + ${b}) = ${answer}`)}`,
            `令 $u = ${linear(1, p)}$，则${steps(`u^2 - ${b}^2 = (u - ${b})(u + ${b}) = ${answer}`)}`,
          ),
        });
      },
    ),
    kp(
      "a-trinomial-in-a-binomial",
      t("A trinomial in a binomial", "以二项式为元的三项式"),
      t(
        "An expression such as $(x + 2)^2 - 3(x + 2) - 10$ is a trinomial in $u = x + 2$: $u^2 - 3u - 10 = (u - 5)(u + 2)$. Substituting back gives $(x - 3)(x + 4)$. Expanding everything first also works, but treating the binomial as one quantity is quicker.",
        "像 $(x + 2)^2 - 3(x + 2) - 10$ 这样的式子是关于 $u = x + 2$ 的三项式：$u^2 - 3u - 10 = (u - 5)(u + 2)$。代回得 $(x - 3)(x + 4)$。先全部展开也可以，但把二项式看作整体更快。",
      ),
      (rng) => {
        let p = 0;
        let m = 0;
        let n = 0;
        do {
          p = rng.nonZero(-6, 6);
          m = rng.nonZero(-7, 7);
          n = rng.nonZero(-7, 7);
        } while (p + m === 0 || p + n === 0 || m === n || m + n === 0);
        const u = lf(1, p);
        const prompt = `${u}^2 ${m + n < 0 ? "-" : "+"} ${Math.abs(m + n) === 1 ? "" : Math.abs(m + n)}${u} ${m * n < 0 ? "-" : "+"} ${Math.abs(m * n)}`;
        const answer = `${lf(1, p + m)}${lf(1, p + n)}`;
        return factoredProblem({
          prompt: t(`Factor $${prompt}$ completely.`, `把 $${prompt}$ 分解彻底。`),
          answer,
          wrong: [`${lf(1, m)}${lf(1, n)}`, `${lf(1, p - m)}${lf(1, p - n)}`, `${lf(1, p + m)}${lf(1, n)}`],
          solution: t(
            `Let $u = ${linear(1, p)}$. Then${steps(`u^2 ${m + n < 0 ? "-" : "+"} ${Math.abs(m + n) === 1 ? "" : Math.abs(m + n)}u ${m * n < 0 ? "-" : "+"} ${Math.abs(m * n)} = ${lf(1, m, "u")}${lf(1, n, "u")}`, `= ${answer}`)}`,
            `令 $u = ${linear(1, p)}$，则${steps(`u^2 ${m + n < 0 ? "-" : "+"} ${Math.abs(m + n) === 1 ? "" : Math.abs(m + n)}u ${m * n < 0 ? "-" : "+"} ${Math.abs(m * n)} = ${lf(1, m, "u")}${lf(1, n, "u")}`, `= ${answer}`)}`,
          ),
        });
      },
    ),
  ],
);

/** factoringExpressionsContainingHiddenFactors takes out a common factor and then factors what remains. */
export const factoringExpressionsContainingHiddenFactors = topic(
  "factoring-expressions-containing-hidden-factors",
  t("Factoring Expressions Containing Hidden Factors", "分解含隐藏因式的式子"),
  t(
    "Take out a common factor first and recognize the difference of squares or trinomial left inside.",
    "先提取公因式，再识别剩下的平方差或三项式。",
  ),
  ["factoring-trinomials-using-common-factors", "factoring-differences-of-squares"],
  ["HSA.SSE.A.2"],
  [
    kp(
      "common-factor-then-difference-of-squares",
      t("A common factor, then a difference of squares", "先提公因式，再用平方差"),
      t(
        "An expression like $3x^3 - 75x$ hides a difference of squares behind a common factor. Take out $3x$ to get $3x(x^2 - 25)$, then factor the difference of squares: $3x(x - 5)(x + 5)$. The factorization is complete only when no factor can be split further.",
        "像 $3x^3 - 75x$ 这样的式子，公因式后面藏着平方差。提取 $3x$ 得 $3x(x^2 - 25)$，再分解平方差：$3x(x - 5)(x + 5)$。只有当每个因式都不能再分解时，才算分解彻底。",
      ),
      (rng) => {
        const a = rng.int(2, 7);
        const b = rng.int(1, 9);
        const withX = rng.bool();
        const expr = withX ? `${a}x^3 - ${a * b * b}x` : `${a}x^2 - ${a * b * b}`;
        const front = withX ? `${a}x` : `${a}`;
        const answer = `${front}${lf(1, -b)}${lf(1, b)}`;
        return factoredProblem({
          prompt: t(`Factor $${expr}$ completely.`, `把 $${expr}$ 分解彻底。`),
          answer,
          wrong: [
            `${front}(x^2 - ${b * b})`,
            `${front}${lf(1, -b)}^2`,
            `${lf(a, -a * b)}${lf(1, b)}${withX ? "x" : ""}`.replace(/^(.*)x$/, "x$1"),
          ],
          solution: t(
            `Take out $${front}$, then factor the difference of squares:${steps(`${expr} = ${front}(x^2 - ${b * b}) = ${answer}`)}`,
            `提取 $${front}$，再分解平方差：${steps(`${expr} = ${front}(x^2 - ${b * b}) = ${answer}`)}`,
          ),
        });
      },
    ),
    kp(
      "common-factor-then-trinomial",
      t("A common factor, then a trinomial", "先提公因式，再分解三项式"),
      t(
        "When every coefficient of a trinomial shares a factor, take it out before looking for the two numbers. In $2x^2 - 6x - 20 = 2(x^2 - 3x - 10)$ the trinomial inside has small coefficients and factors as $(x - 5)(x + 2)$, so the answer is $2(x - 5)(x + 2)$.",
        "当三项式的每个系数都有公因数时，先提取它，再找两个数。$2x^2 - 6x - 20 = 2(x^2 - 3x - 10)$，括号里的三项式系数较小，可分解为 $(x - 5)(x + 2)$，所以结果是 $2(x - 5)(x + 2)$。",
      ),
      (rng) => {
        const a = rng.pick([2, 3, 4, 5, -2, -3]);
        let m = 0;
        let n = 0;
        do {
          m = rng.nonZero(-8, 8);
          n = rng.nonZero(-8, 8);
        } while (m === n || m + n === 0);
        const expr = poly([a, "x^2"], [a * (m + n), "x"], [a * m * n, ""]);
        const answer = `${a === -1 ? "-" : a}${lf(1, m)}${lf(1, n)}`;
        return factoredProblem({
          prompt: t(`Factor $${expr}$ completely.`, `把 $${expr}$ 分解彻底。`),
          answer,
          wrong: [`${a}(${poly([1, "x^2"], [m + n, "x"], [m * n, ""])})`, `${a}${lf(1, -m)}${lf(1, -n)}`, `${lf(a, a * m)}${lf(a, n)}`],
          solution: t(
            `Take out $${a}$:${steps(`${expr} = ${a}(${poly([1, "x^2"], [m + n, "x"], [m * n, ""])})`)}The numbers $${m}$ and $${n}$ multiply to $${m * n}$ and add to $${m + n}$, so the answer is $${answer}$.`,
            `提取 $${a}$：${steps(`${expr} = ${a}(${poly([1, "x^2"], [m + n, "x"], [m * n, ""])})`)}$${m}$ 和 $${n}$ 的积为 $${m * n}$，和为 $${m + n}$，所以结果是 $${answer}$。`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Quadratic equations

/** perfectSquareQuadraticEquationsWithOneOrNoSolutions counts the solutions of (ax + b)² = c. */
export const perfectSquareQuadraticEquationsWithOneOrNoSolutions = topic(
  "perfect-square-quadratic-equations-with-one-or-no-solutions",
  t("Perfect Square Quadratic Equations with One or No Solutions", "只有一个解或无解的完全平方二次方程"),
  t(
    "Decide how many real solutions an equation $(ax + b)^2 = c$ has from the sign of $c$, and choose constants that give exactly one solution.",
    "根据 $c$ 的符号判断方程 $(ax + b)^2 = c$ 有几个实数解，并选取常数使方程恰有一个解。",
  ),
  ["solving-perfect-square-quadratic-equations", "factoring-perfect-square-trinomials"],
  ["HSA.REI.B.4"],
  [
    kp(
      "counting-solutions-of-a-square",
      t("Counting solutions of a square equation", "平方方程解的个数"),
      t(
        "A square is never negative. So $(ax + b)^2 = c$ has two real solutions when $c > 0$, exactly one when $c = 0$ (then $ax + b = 0$), and none when $c < 0$. Rewrite a perfect square trinomial as a square first to see this.",
        "平方永远不会是负数。所以 $(ax + b)^2 = c$ 在 $c > 0$ 时有两个实数解，在 $c = 0$ 时恰有一个解（此时 $ax + b = 0$），在 $c < 0$ 时无解。如果是完全平方三项式，先把它写成平方的形式。",
      ),
      (rng) => {
        const h = rng.nonZero(-9, 9);
        const c = rng.pick([-1, 0, 1]) * rng.int(1, 30);
        const k = rng.nonZero(-20, 20);
        const trinomial = rng.bool();
        // (x + h)^2 + k = k + c
        const lhs = trinomial ? poly([1, "x^2"], [2 * h, "x"], [h * h + k, ""]) : `${lf(1, h)}^2 ${k < 0 ? "-" : "+"} ${Math.abs(k)}`;
        const rhs = k + c;
        const count = c > 0 ? 2 : c === 0 ? 1 : 0;
        const label = (n: number) =>
          t(
            n === 0 ? "No real solutions" : n === 1 ? "Exactly one real solution" : "Two real solutions",
            n === 0 ? "没有实数解" : n === 1 ? "恰有一个实数解" : "两个实数解",
          );
        return pickChoice(
          rng,
          t(`How many real solutions does $${lhs} = ${rhs}$ have?`, `方程 $${lhs} = ${rhs}$ 有几个实数解？`),
          label(count),
          [0, 1, 2].filter((n) => n !== count).map(label),
          t(
            `${trinomial ? `The left side is $${lf(1, h)}^2 + ${paren(k)}$. ` : ""}Moving the constant $${k}$ to the right side gives $${lf(1, h)}^2 = ${c}$. ${count === 2 ? "A positive number has two square roots, so there are two solutions." : count === 1 ? `Only $${linear(1, h)} = 0$ works, so there is exactly one solution.` : "A square cannot be negative, so there are no real solutions."}`,
            `${trinomial ? `左边是 $${lf(1, h)}^2 + ${paren(k)}$。` : ""}把常数 $${k}$ 移到右边得 $${lf(1, h)}^2 = ${c}$。${count === 2 ? "正数有两个平方根，所以有两个解。" : count === 1 ? `只有 $${linear(1, h)} = 0$ 成立，所以恰有一个解。` : "平方不可能是负数，所以没有实数解。"}`,
          ),
        );
      },
    ),
    kp(
      "making-exactly-one-solution",
      t("Choosing a constant for exactly one solution", "选取常数使方程恰有一个解"),
      t(
        "$x^2 + bx + c = 0$ has exactly one solution when the left side is a perfect square, $\\left(x + \\frac{b}{2}\\right)^2$. That happens when $c = \\left(\\frac{b}{2}\\right)^2$. For $x^2 - 10x + c = 0$, half of $-10$ is $-5$, so $c = 25$.",
        "当左边是完全平方 $\\left(x + \\frac{b}{2}\\right)^2$ 时，$x^2 + bx + c = 0$ 恰有一个解，即 $c = \\left(\\frac{b}{2}\\right)^2$。对于 $x^2 - 10x + c = 0$，$-10$ 的一半是 $-5$，所以 $c = 25$。",
      ),
      (rng) => {
        const h = rng.nonZero(-15, 15);
        const d = rng.int(-9, 9);
        const lhs = `${poly([1, "x^2"], [2 * h, "x"])} + c`;
        const value = h * h + d;
        return numberProblem({
          prompt: t(
            `For what value of $c$ does $${lhs} = ${d}$ have exactly one real solution?`,
            `当 $c$ 取何值时，方程 $${lhs} = ${d}$ 恰有一个实数解？`,
          ),
          answer: value,
          wrong: [h * h, 2 * h + d, 4 * h * h + d, h * h - d],
          solution: t(
            `Move $${d}$ to the left: $${poly([1, "x^2"], [2 * h, "x"])} + (c ${d < 0 ? "+" : "-"} ${Math.abs(d)}) = 0$. This has one solution when it is a perfect square, so $c ${d < 0 ? "+" : "-"} ${Math.abs(d)} = ${paren(h)}^2 = ${h * h}$ and $c = ${value}$.`,
            `把 $${d}$ 移到左边：$${poly([1, "x^2"], [2 * h, "x"])} + (c ${d < 0 ? "+" : "-"} ${Math.abs(d)}) = 0$。当它是完全平方时恰有一个解，所以 $c ${d < 0 ? "+" : "-"} ${Math.abs(d)} = ${paren(h)}^2 = ${h * h}$，$c = ${value}$。`,
          ),
        });
      },
    ),
  ],
);

/** theZeroProductRuleForSolvingPolynomialEquations solves polynomial equations given or put in factored form. */
export const theZeroProductRuleForSolvingPolynomialEquations = topic(
  "the-zero-product-rule-for-solving-polynomial-equations",
  t("The Zero Product Rule for Solving Polynomial Equations", "用零乘积法则解多项式方程"),
  t(
    "Solve polynomial equations of degree three or more by setting each factor equal to zero.",
    "令每个因式等于零，解三次及以上的多项式方程。",
  ),
  ["solving-polynomial-equations-using-the-gcf"],
  ["HSA.APR.B.3", "HSA.REI.B.4"],
  [
    kp(
      "solving-a-factored-polynomial-equation",
      t("Solving a factored polynomial equation", "解已分解的多项式方程"),
      t(
        "A product is zero exactly when one of its factors is zero. So $(x - 2)(3x + 1)(x + 5) = 0$ has one solution from each factor: $x = 2$, $x = -\\frac{1}{3}$ and $x = -5$. A constant factor such as $4$ is never zero and gives no solution.",
        "乘积为零当且仅当其中某个因式为零。所以 $(x - 2)(3x + 1)(x + 5) = 0$ 的每个因式各给出一个解：$x = 2$，$x = -\\frac{1}{3}$，$x = -5$。像 $4$ 这样的常数因式永远不为零，不给出解。",
      ),
      (rng) => {
        let r = 0;
        let s = 0;
        let a = 1;
        let b = 0;
        do {
          r = rng.nonZero(-9, 9);
          s = rng.nonZero(-9, 9);
          a = rng.int(2, 5);
          b = rng.nonZero(-9, 9);
        } while (r === s || gcd(a, b) !== 1);
        const c = rng.int(2, 6);
        const eq = `${c}${lf(1, -r)}${lf(a, b)}${lf(1, -s)} = 0`;
        return solutionsProblem({
          prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
          values: [String(r), num(Q.of(-b, a)), String(s)],
          wrong: [
            [String(-r), num(Q.of(b, a)), String(-s)],
            [String(r), String(s)],
            [String(r), num(Q.of(-b, a)), String(s), String(c)],
            [String(r), String(-b), String(s)],
          ],
          solution: t(
            `Set each non-constant factor equal to zero: $${linear(1, -r)} = 0$ gives $x = ${r}$, $${linear(a, b)} = 0$ gives $x = ${num(Q.of(-b, a))}$, and $${linear(1, -s)} = 0$ gives $x = ${s}$.`,
            `令每个非常数因式为零：$${linear(1, -r)} = 0$ 得 $x = ${r}$，$${linear(a, b)} = 0$ 得 $x = ${num(Q.of(-b, a))}$，$${linear(1, -s)} = 0$ 得 $x = ${s}$。`,
          ),
        });
      },
    ),
    kp(
      "factoring-before-solving",
      t("Factoring before solving", "先分解再求解"),
      t(
        "To use the zero product rule, the equation must be a product equal to zero. For $x^3 = 16x$, move everything to one side, $x^3 - 16x = 0$, and factor: $x(x - 4)(x + 4) = 0$, so $x = 0, 4, -4$. Dividing both sides by $x$ instead would lose the solution $x = 0$.",
        "要用零乘积法则，方程必须是乘积等于零的形式。对于 $x^3 = 16x$，先把所有项移到一边得 $x^3 - 16x = 0$，再分解：$x(x - 4)(x + 4) = 0$，所以 $x = 0, 4, -4$。如果两边直接除以 $x$，就会丢掉解 $x = 0$。",
      ),
      (rng) => {
        const kind = rng.pick(["square", "trinomial"] as const);
        let m = 0;
        let n = 0;
        do {
          m = rng.nonZero(-8, 8);
          n = rng.nonZero(-8, 8);
        } while (m === n);
        const [r, s] = kind === "square" ? [m, -m] : [m, n];
        // x(x - r)(x - s) = x^3 - (r + s)x^2 + rs x
        const lhs = kind === "square" ? "x^3" : poly([1, "x^3"], [-(r + s), "x^2"]);
        const rhs = poly([-r * s, "x"]);
        if (kind === "square" && r < 0) return theZeroProductRuleForSolvingPolynomialEquations.knowledgePoints[1]!.generate(rng);
        const values = ["0", String(r), String(s)];
        return solutionsProblem({
          prompt: t(`Solve $${lhs} = ${rhs}$.`, `解方程 $${lhs} = ${rhs}$。`),
          values,
          wrong: [[String(r), String(s)], ["0", String(-r), String(-s)], kind === "square" ? [String(r)] : ["0", String(r)]],
          solution: t(
            `Move every term to the left and factor:${steps(`${poly([1, "x^3"], [-(r + s), "x^2"], [r * s, "x"])} = 0`, `x${lf(1, -r)}${lf(1, -s)} = 0`)}So $x = 0$, $x = ${r}$ or $x = ${s}$.`,
            `把所有项移到左边再分解：${steps(`${poly([1, "x^3"], [-(r + s), "x^2"], [r * s, "x"])} = 0`, `x${lf(1, -r)}${lf(1, -s)} = 0`)}所以 $x = 0$，$x = ${r}$ 或 $x = ${s}$。`,
          ),
        });
      },
    ),
  ],
);

/** reasoningAboutCoefficientsOfQuadraticsUsingStandardAndFactoredForms connects the coefficients of the two forms. */
export const reasoningAboutCoefficientsOfQuadraticsUsingStandardAndFactoredForms = topic(
  "reasoning-about-coefficients-of-quadratics-using-standard-and-factored-forms",
  t("Reasoning About Coefficients of Quadratics Using Standard and Factored Forms", "利用一般式与交点式推理二次函数的系数"),
  t(
    "Relate the coefficients of $ax^2 + bx + c$ to the factored form $a(x - r)(x - s)$: $b = -a(r + s)$ and $c = ars$.",
    "建立 $ax^2 + bx + c$ 的系数与交点式 $a(x - r)(x - s)$ 的联系：$b = -a(r + s)$，$c = ars$。",
  ),
  ["roots-of-quadratic-functions", "multiplying-polynomials"],
  ["HSA.SSE.A.1", "HSA.APR.B.3"],
  [
    kp(
      "coefficients-from-factored-form",
      t("Coefficients from the factored form", "由交点式求系数"),
      t(
        "Expanding $a(x - r)(x - s)$ gives $ax^2 - a(r + s)x + ars$. So the coefficient of $x$ is $b = -a(r + s)$ and the constant is $c = ars$. Use these to read a coefficient without writing out the whole expansion.",
        "展开 $a(x - r)(x - s)$ 得 $ax^2 - a(r + s)x + ars$。所以 $x$ 的系数为 $b = -a(r + s)$，常数项为 $c = ars$。用这两个式子可以不必完整展开就读出系数。",
      ),
      (rng) => {
        const a = rng.nonZero(-4, 5);
        const r = rng.nonZero(-9, 9);
        const s = rng.nonZero(-9, 9);
        const ask = rng.pick(["b", "c"] as const);
        const value = ask === "b" ? -a * (r + s) : a * r * s;
        const f = `${a === 1 ? "" : a === -1 ? "-" : a}${lf(1, -r)}${lf(1, -s)}`;
        return numberProblem({
          prompt: t(
            `The function $f(x) = ${f}$ is written in the form $f(x) = ax^2 + bx + c$. What is the value of $${ask}$?`,
            `把函数 $f(x) = ${f}$ 写成 $f(x) = ax^2 + bx + c$ 的形式。$${ask}$ 的值是多少？`,
          ),
          answer: value,
          wrong: ask === "b" ? [a * (r + s), -(r + s), -a * (r - s)] : [r * s, -a * r * s, a * (r + s)],
          solution: t(
            `Expanding $a(x - r)(x - s)$ gives $${ask === "b" ? "b = -a(r + s)" : "c = ars"}$. Here $a = ${a}$ and the zeros are $${r}$ and $${s}$, so $${ask} = ${ask === "b" ? `-${paren(a)}(${r} + ${paren(s)})` : `${a} \\cdot ${paren(r)} \\cdot ${paren(s)}`} = ${value}$.`,
            `展开 $a(x - r)(x - s)$ 得 $${ask === "b" ? "b = -a(r + s)" : "c = ars"}$。这里 $a = ${a}$，零点为 $${r}$ 和 $${s}$，所以 $${ask} = ${ask === "b" ? `-${paren(a)}(${r} + ${paren(s)})` : `${a} \\cdot ${paren(r)} \\cdot ${paren(s)}`} = ${value}$。`,
          ),
        });
      },
    ),
    kp(
      "leading-coefficient-from-intercepts",
      t("The leading coefficient from the intercepts", "由截距求二次项系数"),
      t(
        "If the graph of a quadratic crosses the $x$-axis at $r$ and $s$, it is $f(x) = a(x - r)(x - s)$ for some $a$. The $y$-intercept fixes $a$: $f(0) = a \\cdot rs$, so $a = \\frac{f(0)}{rs}$.",
        "如果二次函数的图像与 $x$ 轴交于 $r$ 和 $s$，那么它可以写成 $f(x) = a(x - r)(x - s)$。$y$ 轴截距确定 $a$：$f(0) = a \\cdot rs$，所以 $a = \\frac{f(0)}{rs}$。",
      ),
      (rng) => {
        const a = rng.nonZero(-5, 5);
        const r = rng.nonZero(-8, 8);
        let s = rng.nonZero(-8, 8);
        if (s === r) s = -r === r ? r + 1 : -r;
        const y0 = a * r * s;
        const ask = rng.pick(["a", "b"] as const);
        const value = ask === "a" ? a : -a * (r + s);
        return numberProblem({
          prompt: t(
            `The graph of $f(x) = ax^2 + bx + c$ crosses the $x$-axis at $x = ${r}$ and $x = ${s}$ and crosses the $y$-axis at $y = ${y0}$. What is the value of $${ask}$?`,
            `$f(x) = ax^2 + bx + c$ 的图像与 $x$ 轴交于 $x = ${r}$ 和 $x = ${s}$，与 $y$ 轴交于 $y = ${y0}$。$${ask}$ 的值是多少？`,
          ),
          answer: value,
          wrong: ask === "a" ? [-a, y0, Q.of(y0, r + s || 1)] : [a * (r + s), -(r + s), y0],
          solution: t(
            `$f(x) = a${lf(1, -r)}${lf(1, -s)}$ and $f(0) = a \\cdot ${paren(r)} \\cdot ${paren(s)} = ${r * s}a = ${y0}$, so $a = ${a}$.${ask === "b" ? ` Then $b = -a(r + s) = -${paren(a)} \\cdot ${paren(r + s)} = ${value}$.` : ""}`,
            `$f(x) = a${lf(1, -r)}${lf(1, -s)}$，$f(0) = a \\cdot ${paren(r)} \\cdot ${paren(s)} = ${r * s}a = ${y0}$，所以 $a = ${a}$。${ask === "b" ? `于是 $b = -a(r + s) = -${paren(a)} \\cdot ${paren(r + s)} = ${value}$。` : ""}`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Quadratic functions

/** fittingQuadraticFunctionsToDataUsingVertexForm finds a quadratic through a vertex and another data point. */
export const fittingQuadraticFunctionsToDataUsingVertexForm = topic(
  "fitting-quadratic-functions-to-data-using-vertex-form",
  t("Fitting Quadratic Functions to Data Using Vertex Form", "用顶点式拟合二次函数"),
  t(
    "Find the quadratic $a(x - h)^2 + k$ with a given vertex that passes through another data point, and use it to predict values.",
    "求以给定点为顶点、并经过另一个数据点的二次函数 $a(x - h)^2 + k$，再用它进行预测。",
  ),
  ["writing-the-equation-of-a-parabola-in-vertex-form"],
  ["HSF.BF.A.1", "HSS.ID.B.6"],
  [
    kp(
      "the-leading-coefficient-from-a-point",
      t("The leading coefficient from a point", "由一个点求二次项系数"),
      t(
        "If the vertex is $(h, k)$, the function is $f(x) = a(x - h)^2 + k$ and only $a$ is unknown. Substitute the other point $(x_1, y_1)$: $y_1 = a(x_1 - h)^2 + k$, so $a = \\frac{y_1 - k}{(x_1 - h)^2}$.",
        "如果顶点是 $(h, k)$，函数就是 $f(x) = a(x - h)^2 + k$，只有 $a$ 未知。代入另一个点 $(x_1, y_1)$：$y_1 = a(x_1 - h)^2 + k$，所以 $a = \\frac{y_1 - k}{(x_1 - h)^2}$。",
      ),
      (rng) => {
        const h = rng.int(0, 10);
        const k = rng.int(-20, 60);
        const a = rng.pick([Q.of(-2), Q.of(-1), Q.of(-1, 2), Q.of(1, 2), Q.of(1), Q.of(2), Q.of(3), Q.of(-3)]);
        let d = rng.nonZero(-4, 4);
        if (a.d === 2n && d % 2 !== 0) d *= 2;
        const x1 = h + d;
        const y1 = a.mul(Q.of(d * d)).add(Q.of(k));
        return numberProblem({
          prompt: t(
            `A quadratic model $f(x) = a(x - h)^2 + k$ has its vertex at $(${h}, ${k})$ and passes through the data point $(${x1}, ${y1.toLatex()})$. What is $a$?`,
            `二次模型 $f(x) = a(x - h)^2 + k$ 的顶点为 $(${h}, ${k})$，并经过数据点 $(${x1}, ${y1.toLatex()})$。$a$ 是多少？`,
          ),
          answer: a,
          wrong: [y1.sub(Q.of(k)).div(Q.of(d)), y1.sub(Q.of(k)), y1.div(Q.of(d * d))],
          solution: t(
            `Substitute the point into $f(x) = a(x - ${h})^2 + ${paren(k)}$:${steps(`${y1.toLatex()} = a(${x1} - ${h})^2 + ${paren(k)} = ${d * d}a + ${paren(k)}`, `a = \\frac{${y1.toLatex()} - ${paren(k)}}{${d * d}} = ${a.toLatex()}`)}`,
            `把这个点代入 $f(x) = a(x - ${h})^2 + ${paren(k)}$：${steps(`${y1.toLatex()} = a(${x1} - ${h})^2 + ${paren(k)} = ${d * d}a + ${paren(k)}`, `a = \\frac{${y1.toLatex()} - ${paren(k)}}{${d * d}} = ${a.toLatex()}`)}`,
          ),
        });
      },
    ),
    kp(
      "predicting-with-a-vertex-form-model",
      t("Predicting with the model", "用模型进行预测"),
      t(
        "Once $a$ is known, the model predicts the output at any input. The vertex is the highest or lowest point, and points at equal distances on either side of it have equal outputs, which is a quick check on a prediction.",
        "求出 $a$ 后，模型就能预测任何输入对应的输出。顶点是最高点或最低点，与顶点等距的两侧的点输出相等，这可以用来快速检验预测。",
      ),
      (rng) => {
        const h = rng.int(1, 8);
        const k = rng.int(20, 90);
        const a = -rng.int(1, 4);
        const d = rng.nonZero(-3, 3);
        const y1 = a * d * d + k;
        const e = rng.nonZero(-5, 5);
        const value = a * e * e + k;
        return numberProblem({
          prompt: t(
            `The height of a ball, in feet, is modeled by a quadratic function of time $t$ in seconds. The greatest height, $${k}$ feet, is reached at $t = ${h}$, and at $t = ${h + d}$ the height is $${y1}$ feet. According to the model, what is the height at $t = ${h + e}$?`,
            `一个球的高度（英尺）用时间 $t$（秒）的二次函数来建模。在 $t = ${h}$ 时达到最大高度 $${k}$ 英尺，在 $t = ${h + d}$ 时高度为 $${y1}$ 英尺。根据该模型，$t = ${h + e}$ 时的高度是多少？`,
          ),
          answer: value,
          wrong: [a * e + k, -a * e * e + k, y1 + (e - d) * a],
          solution: t(
            `The model is $h(t) = a(t - ${h})^2 + ${k}$. From the second point, $${y1} = ${d * d}a + ${k}$, so $a = ${a}$. Then $h(${h + e}) = ${a}(${e})^2 + ${k} = ${value}$.`,
            `模型为 $h(t) = a(t - ${h})^2 + ${k}$。由第二个点，$${y1} = ${d * d}a + ${k}$，所以 $a = ${a}$。于是 $h(${h + e}) = ${a}(${e})^2 + ${k} = ${value}$。`,
          ),
        });
      },
    ),
  ],
);

/** reasoningAboutCoefficientsOfQuadraticsUsingSymmetry uses equal outputs to locate the axis of symmetry. */
export const reasoningAboutCoefficientsOfQuadraticsUsingSymmetry = topic(
  "reasoning-about-coefficients-of-quadratics-using-symmetry",
  t("Reasoning About Coefficients of Quadratics Using Symmetry", "利用对称性推理二次函数的系数"),
  t(
    "Use two inputs with equal outputs to find the axis of symmetry of a parabola, and from it the coefficient $b$.",
    "利用输出相等的两个输入求抛物线的对称轴，再由对称轴求系数 $b$。",
  ),
  ["the-axis-of-symmetry-of-a-parabola"],
  ["HSF.IF.C.7", "HSF.IF.B.4"],
  [
    kp(
      "the-axis-from-equal-outputs",
      t("The axis from equal outputs", "由相等的输出求对称轴"),
      t(
        "A parabola is symmetric about its axis, so two inputs with the same output lie at equal distances on either side of it. If $f(p) = f(q)$ with $p \\ne q$, the axis is the vertical line halfway between them, $x = \\frac{p + q}{2}$, and the vertex has that $x$-coordinate.",
        "抛物线关于对称轴对称，所以输出相同的两个输入位于对称轴两侧、到它的距离相等。若 $f(p) = f(q)$ 且 $p \\ne q$，对称轴就是它们正中间的竖直线 $x = \\frac{p + q}{2}$，顶点的 $x$ 坐标也是它。",
      ),
      (rng) => {
        const h = Q.of(rng.int(-16, 16), 2);
        const d = Q.of(rng.int(1, 9), 2);
        const p = h.sub(d);
        const q = h.add(d);
        if (!p.isInteger() || !q.isInteger()) return reasoningAboutCoefficientsOfQuadraticsUsingSymmetry.knowledgePoints[0]!.generate(rng);
        const y = rng.int(-20, 20);
        return numberProblem({
          prompt: t(
            `For a quadratic function $f$, $f(${p.toLatex()}) = ${y}$ and $f(${q.toLatex()}) = ${y}$. What is the $x$-coordinate of the vertex of the graph of $f$?`,
            `对于二次函数 $f$，$f(${p.toLatex()}) = ${y}$，$f(${q.toLatex()}) = ${y}$。$f$ 的图像的顶点的 $x$ 坐标是多少？`,
          ),
          answer: h,
          wrong: [q.sub(p), p.add(q), Q.of(y), d],
          solution: t(
            `The two inputs have equal outputs, so the axis of symmetry is halfway between them: $x = \\frac{${p.toLatex()} + ${paren(q)}}{2} = ${h.toLatex()}$.`,
            `两个输入的输出相等，所以对称轴在它们正中间：$x = \\frac{${p.toLatex()} + ${paren(q)}}{2} = ${h.toLatex()}$。`,
          ),
        });
      },
    ),
    kp(
      "b-from-the-axis",
      t("The coefficient $b$ from the axis", "由对称轴求系数 $b$"),
      t(
        "For $f(x) = ax^2 + bx + c$ the axis of symmetry is $x = -\\frac{b}{2a}$. So if symmetry places the axis at $x = h$, then $b = -2ah$. The constant $c$ does not affect the axis, because it only moves the graph up or down.",
        "对于 $f(x) = ax^2 + bx + c$，对称轴为 $x = -\\frac{b}{2a}$。所以如果由对称性得到对称轴在 $x = h$，那么 $b = -2ah$。常数 $c$ 不影响对称轴，因为它只让图像上下移动。",
      ),
      (rng) => {
        const a = rng.nonZero(-4, 4);
        const h = rng.nonZero(-8, 8);
        const d = rng.int(1, 6);
        const c = rng.int(-15, 15);
        const value = -2 * a * h;
        return numberProblem({
          prompt: t(
            `The function $f(x) = ${a === 1 ? "" : a === -1 ? "-" : a}x^2 + bx ${c < 0 ? "-" : "+"} ${Math.abs(c)}$ satisfies $f(${h - d}) = f(${h + d})$. What is the value of $b$?`,
            `函数 $f(x) = ${a === 1 ? "" : a === -1 ? "-" : a}x^2 + bx ${c < 0 ? "-" : "+"} ${Math.abs(c)}$ 满足 $f(${h - d}) = f(${h + d})$。$b$ 的值是多少？`,
          ),
          answer: value,
          wrong: [2 * a * h, -a * h, h, -2 * h],
          solution: t(
            `The axis of symmetry is halfway between $${h - d}$ and $${h + d}$, at $x = ${h}$. Since the axis is $x = -\\frac{b}{2a}$, $b = -2 \\cdot ${paren(a)} \\cdot ${paren(h)} = ${value}$.`,
            `对称轴在 $${h - d}$ 与 $${h + d}$ 的正中间，即 $x = ${h}$。由于对称轴为 $x = -\\frac{b}{2a}$，$b = -2 \\cdot ${paren(a)} \\cdot ${paren(h)} = ${value}$。`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Nonlinear systems

/** solvingSystemsOfNonlinearEquationsByIdentifyingStructure combines nonlinear equations without solving for each variable. */
export const solvingSystemsOfNonlinearEquationsByIdentifyingStructure = topic(
  "solving-systems-of-nonlinear-equations-by-identifying-structure",
  t("Solving Systems of Nonlinear Equations by Identifying Structure", "通过识别结构解非线性方程组"),
  t(
    "Add or subtract whole equations, or use identities such as $(x + y)^2 = x^2 + 2xy + y^2$, to find a requested quantity directly.",
    "通过整体相加减方程，或利用 $(x + y)^2 = x^2 + 2xy + y^2$ 这样的恒等式，直接求出所要的量。",
  ),
  ["solving-systems-of-nonlinear-equations", "solving-systems-of-linear-equations-by-identifying-structure"],
  ["HSA.REI.C.7", "HSA.SSE.A.2"],
  [
    kp(
      "eliminating-squares",
      t("Eliminating squares", "消去平方项"),
      t(
        "In a system such as $x^2 + y^2 = 41$ and $x^2 - y^2 = 9$, treat $x^2$ and $y^2$ as the unknowns. Adding the equations eliminates $y^2$: $2x^2 = 50$, so $x^2 = 25$. Often the question asks only for $x^2$ or $y^2$, and no square root is needed.",
        "在 $x^2 + y^2 = 41$、$x^2 - y^2 = 9$ 这样的方程组中，把 $x^2$ 和 $y^2$ 看作未知量。两式相加消去 $y^2$：$2x^2 = 50$，所以 $x^2 = 25$。问题常常只问 $x^2$ 或 $y^2$，不需要开平方。",
      ),
      (rng) => {
        const X = rng.int(1, 12);
        const Y = rng.int(1, 12);
        const p = rng.int(1, 3);
        const ask = rng.pick(["x^2", "y^2"] as const);
        const eq1 = `${p === 1 ? "" : p}x^2 + y^2 = ${p * X * X + Y * Y}`;
        const eq2 = `${p === 1 ? "" : p}x^2 - y^2 = ${p * X * X - Y * Y}`;
        const value = ask === "x^2" ? X * X : Y * Y;
        return numberProblem({
          prompt: t(`If $${eq1}$ and $${eq2}$, what is the value of $${ask}$?`, `若 $${eq1}$，$${eq2}$，则 $${ask}$ 的值是多少？`),
          answer: value,
          wrong: ask === "x^2" ? [X, p * X * X, 2 * p * X * X] : [Y, 2 * Y * Y, p * X * X],
          solution: t(
            ask === "x^2"
              ? `Add the equations: $${2 * p}x^2 = ${2 * p * X * X}$, so $x^2 = ${X * X}$.`
              : `Subtract the second equation from the first: $2y^2 = ${2 * Y * Y}$, so $y^2 = ${Y * Y}$.`,
            ask === "x^2"
              ? `两式相加：$${2 * p}x^2 = ${2 * p * X * X}$，所以 $x^2 = ${X * X}$。`
              : `第一个方程减去第二个：$2y^2 = ${2 * Y * Y}$，所以 $y^2 = ${Y * Y}$。`,
          ),
        });
      },
    ),
    kp(
      "using-the-square-of-a-sum",
      t("Using the square of a sum", "利用和的平方"),
      t(
        "When a system gives $x + y$ and $xy$, the identity $(x + y)^2 = x^2 + 2xy + y^2$ gives $x^2 + y^2 = (x + y)^2 - 2xy$ without finding $x$ and $y$. Likewise $(x - y)^2 = (x + y)^2 - 4xy$. Look for these identities whenever the question asks for a symmetric combination of the variables rather than the variables themselves.",
        "当方程组给出 $x + y$ 与 $xy$ 时，利用恒等式 $(x + y)^2 = x^2 + 2xy + y^2$ 可得 $x^2 + y^2 = (x + y)^2 - 2xy$，而不必求出 $x$ 和 $y$。同理 $(x - y)^2 = (x + y)^2 - 4xy$。当题目问的是变量的对称组合而不是变量本身时，就要想到这些恒等式。",
      ),
      (rng) => {
        const S = rng.nonZero(-12, 12);
        const P = rng.int(-30, 30);
        const ask = rng.pick(["x^2 + y^2", "(x - y)^2"] as const);
        const value = ask === "x^2 + y^2" ? S * S - 2 * P : S * S - 4 * P;
        if (value < 0) return solvingSystemsOfNonlinearEquationsByIdentifyingStructure.knowledgePoints[1]!.generate(rng);
        return numberProblem({
          prompt: t(
            `If $x + y = ${S}$ and $xy = ${P}$, what is the value of $${ask}$?`,
            `若 $x + y = ${S}$，$xy = ${P}$，则 $${ask}$ 的值是多少？`,
          ),
          answer: value,
          wrong: ask === "x^2 + y^2" ? [S * S, S * S + 2 * P, S * S - P] : [S * S - 2 * P, S * S, S * S + 4 * P],
          solution: t(
            ask === "x^2 + y^2"
              ? `$x^2 + y^2 = (x + y)^2 - 2xy = ${paren(S)}^2 - 2 \\cdot ${paren(P)} = ${value}$.`
              : `$(x - y)^2 = (x + y)^2 - 4xy = ${paren(S)}^2 - 4 \\cdot ${paren(P)} = ${value}$.`,
            ask === "x^2 + y^2"
              ? `$x^2 + y^2 = (x + y)^2 - 2xy = ${paren(S)}^2 - 2 \\cdot ${paren(P)} = ${value}$。`
              : `$(x - y)^2 = (x + y)^2 - 4xy = ${paren(S)}^2 - 4 \\cdot ${paren(P)} = ${value}$。`,
          ),
        });
      },
    ),
  ],
);

/** determiningUnknownParametersInQuadraticSystemsWithOneIntersectionPoint makes a line tangent to a parabola. */
export const determiningUnknownParametersInQuadraticSystemsWithOneIntersectionPoint = topic(
  "determining-unknown-parameters-in-quadratic-systems-with-one-intersection-point",
  t("Determining Unknown Parameters in Quadratic Systems With One Intersection Point", "确定恰有一个交点的二次方程组中的未知参数"),
  t(
    "Find the parameter for which a line meets a parabola at exactly one point, by setting the discriminant of the combined equation to zero.",
    "令合并后方程的判别式为零，求使直线与抛物线恰有一个交点的参数。",
  ),
  ["finding-intersections-of-lines-and-quadratic-functions"],
  ["HSA.REI.C.7", "HSA.REI.B.4"],
  [
    kp(
      "a-horizontal-line-through-the-vertex",
      t("A horizontal line meeting a parabola once", "与抛物线只交于一点的水平直线"),
      t(
        "A horizontal line $y = k$ meets a parabola exactly once only at the vertex. So for $y = x^2 + bx + c$, complete the square, $y = \\left(x + \\frac{b}{2}\\right)^2 + c - \\frac{b^2}{4}$, and the line must be $y = c - \\frac{b^2}{4}$.",
        "水平直线 $y = k$ 只有经过顶点时才与抛物线恰交于一点。所以对于 $y = x^2 + bx + c$，配方得 $y = \\left(x + \\frac{b}{2}\\right)^2 + c - \\frac{b^2}{4}$，直线必须是 $y = c - \\frac{b^2}{4}$。",
      ),
      (rng) => {
        const a = rng.pick([1, 1, -1, 2, -2]);
        const h = rng.nonZero(-8, 8);
        const k = rng.int(-30, 30);
        // y = a(x - h)^2 + k
        const f = poly([a, "x^2"], [-2 * a * h, "x"], [a * h * h + k, ""]);
        return numberProblem({
          prompt: t(
            `In the system $y = ${f}$ and $y = k$, $k$ is a constant. For what value of $k$ does the system have exactly one solution?`,
            `在方程组 $y = ${f}$ 与 $y = k$ 中，$k$ 是常数。当 $k$ 取何值时方程组恰有一个解？`,
          ),
          answer: k,
          wrong: [a * h * h + k, k + h * h * (a > 0 ? -1 : 1), h, -k],
          solution: t(
            `Complete the square: $y = ${a === 1 ? "" : a === -1 ? "-" : a}${lf(1, -h)}^2 ${k < 0 ? "-" : "+"} ${Math.abs(k)}$. The vertex is $(${h}, ${k})$, and the horizontal line through it, $y = ${k}$, is the only one meeting the parabola once.`,
            `配方：$y = ${a === 1 ? "" : a === -1 ? "-" : a}${lf(1, -h)}^2 ${k < 0 ? "-" : "+"} ${Math.abs(k)}$。顶点为 $(${h}, ${k})$，经过它的水平直线 $y = ${k}$ 是唯一与抛物线只交于一点的水平直线。`,
          ),
        });
      },
    ),
    kp(
      "a-tangent-line",
      t("A line tangent to a parabola", "与抛物线相切的直线"),
      t(
        "Substituting a line $y = mx + k$ into a parabola gives one quadratic equation in $x$; each solution is an intersection. Exactly one intersection means the discriminant $b^2 - 4ac$ of that equation is zero, which is an equation for the unknown parameter.",
        "把直线 $y = mx + k$ 代入抛物线方程，得到一个关于 $x$ 的二次方程，它的每个解对应一个交点。恰有一个交点意味着这个方程的判别式 $b^2 - 4ac$ 为零，由此得到关于未知参数的方程。",
      ),
      (rng) => {
        const m = 2 * rng.nonZero(-6, 6);
        const c = rng.int(-10, 10);
        // x^2 + c = m x + k -> x^2 - m x + (c - k) = 0, disc m^2 - 4(c - k) = 0 -> k = c - m^2/4
        const k = c - (m * m) / 4;
        return numberProblem({
          prompt: t(
            `The line $y = ${linear(m, 0)} + k$ intersects the parabola $y = x^2 ${c < 0 ? "-" : "+"} ${Math.abs(c)}$ at exactly one point. What is the value of $k$?`,
            `直线 $y = ${linear(m, 0)} + k$ 与抛物线 $y = x^2 ${c < 0 ? "-" : "+"} ${Math.abs(c)}$ 恰交于一点。$k$ 的值是多少？`,
          ),
          answer: k,
          wrong: [c + (m * m) / 4, c - m * m, -(m * m) / 4],
          solution: t(
            `Set the expressions equal: $x^2 ${c < 0 ? "-" : "+"} ${Math.abs(c)} = ${linear(m, 0)} + k$, so $x^2 ${m > 0 ? "-" : "+"} ${Math.abs(m)}x + (${c} - k) = 0$. One solution means the discriminant is zero:${steps(`${paren(m)}^2 - 4(${c} - k) = 0`, `${m * m} - ${4 * c < 0 ? `(${4 * c})` : 4 * c} + 4k = 0`, `k = ${k}`)}`,
            `令两式相等：$x^2 ${c < 0 ? "-" : "+"} ${Math.abs(c)} = ${linear(m, 0)} + k$，即 $x^2 ${m > 0 ? "-" : "+"} ${Math.abs(m)}x + (${c} - k) = 0$。恰有一个解意味着判别式为零：${steps(`${paren(m)}^2 - 4(${c} - k) = 0`, `${m * m} - ${4 * c < 0 ? `(${4 * c})` : 4 * c} + 4k = 0`, `k = ${k}`)}`,
          ),
        });
      },
    ),
  ],
);

/** determiningUnknownParametersInQuadraticSystemsWithZeroOrTwoIntersectionPoints finds parameters giving none or two intersections. */
export const determiningUnknownParametersInQuadraticSystemsWithZeroOrTwoIntersectionPoints = topic(
  "determining-unknown-parameters-in-quadratic-systems-with-zero-or-two-intersection-points",
  t(
    "Determining Unknown Parameters in Quadratic Systems With Zero or Two Intersection Points",
    "确定无交点或有两个交点的二次方程组中的未知参数",
  ),
  t(
    "Use the sign of the discriminant, or the vertex, to find the parameter values for which a line and a parabola meet twice or not at all.",
    "利用判别式的符号或顶点，求使直线与抛物线有两个交点或没有交点的参数取值。",
  ),
  ["determining-unknown-parameters-in-quadratic-systems-with-one-intersection-point"],
  ["HSA.REI.C.7", "HSA.REI.B.4"],
  [
    kp(
      "counting-intersections",
      t("Counting intersections", "交点的个数"),
      t(
        "Setting a parabola and a line equal gives a quadratic equation. Its discriminant counts the intersections: positive means two, zero means one and negative means none. Simplify the equation to $ax^2 + bx + c = 0$ before computing $b^2 - 4ac$.",
        "令抛物线与直线的表达式相等，得到一个二次方程。它的判别式决定交点个数：正数表示两个，零表示一个，负数表示没有。计算 $b^2 - 4ac$ 之前先把方程化成 $ax^2 + bx + c = 0$。",
      ),
      (rng) => {
        const p = rng.nonZero(-6, 6);
        const q = rng.int(-10, 10);
        const m = rng.nonZero(-6, 6);
        const k = rng.int(-10, 10);
        // x^2 + p x + q = m x + k -> x^2 + (p - m)x + (q - k) = 0
        const B = p - m;
        const C = q - k;
        const D = B * B - 4 * C;
        const count = D > 0 ? 2 : D === 0 ? 1 : 0;
        const label = (n: number) =>
          t(n === 0 ? "None" : n === 1 ? "Exactly one" : "Two", n === 0 ? "没有" : n === 1 ? "恰有一个" : "两个");
        return pickChoice(
          rng,
          t(
            `How many points of intersection do the graphs of $y = ${poly([1, "x^2"], [p, "x"], [q, ""])}$ and $y = ${linear(m, k)}$ have?`,
            `$y = ${poly([1, "x^2"], [p, "x"], [q, ""])}$ 与 $y = ${linear(m, k)}$ 的图像有几个交点？`,
          ),
          label(count),
          [0, 1, 2].filter((n) => n !== count).map(label),
          t(
            `Set them equal and simplify: $${poly([1, "x^2"], [B, "x"], [C, ""])} = 0$. The discriminant is $${paren(B)}^2 - 4 \\cdot ${paren(C)} = ${D}$, which is ${D > 0 ? "positive, so there are two intersections" : D === 0 ? "zero, so there is exactly one intersection" : "negative, so there are no intersections"}.`,
            `令两式相等并化简：$${poly([1, "x^2"], [B, "x"], [C, ""])} = 0$。判别式为 $${paren(B)}^2 - 4 \\cdot ${paren(C)} = ${D}$，${D > 0 ? "为正，所以有两个交点" : D === 0 ? "为零，所以恰有一个交点" : "为负，所以没有交点"}。`,
          ),
        );
      },
    ),
    kp(
      "parameter-range-for-two-intersections",
      t("The parameter range for two intersections", "有两个交点时参数的范围"),
      t(
        "A horizontal line $y = k$ meets an upward parabola twice when it lies above the vertex and not at all when it lies below. So for $y = (x - h)^2 + v$ there are two intersections when $k > v$ and none when $k < v$; for a downward parabola the inequalities reverse.",
        "水平直线 $y = k$ 在开口向上的抛物线顶点上方时与之交于两点，在顶点下方时没有交点。所以对 $y = (x - h)^2 + v$，$k > v$ 时有两个交点，$k < v$ 时没有交点；开口向下时不等号方向相反。",
      ),
      (rng) => {
        const a = rng.pick([1, -1, 2, -2]);
        const h = rng.nonZero(-7, 7);
        const v = rng.int(-25, 25);
        const two = rng.bool();
        const f = poly([a, "x^2"], [-2 * a * h, "x"], [a * h * h + v, ""]);
        const op = a > 0 === two ? ">" : "<";
        return inequalityProblem({
          prompt: t(
            `For which values of $k$ does the system $y = ${f}$ and $y = k$ have ${two ? "two solutions" : "no solutions"}? Write your answer as an inequality in $k$.`,
            `当 $k$ 取哪些值时，方程组 $y = ${f}$ 与 $y = k$ ${two ? "有两个解" : "无解"}？用关于 $k$ 的不等式作答。`,
          ),
          variable: "k",
          op,
          value: v,
          wrong: [
            [op === ">" ? "<" : ">", v],
            [op, a * h * h + v],
            [op === ">" ? ">=" : "<=", v],
          ],
          solution: t(
            `Complete the square: $y = ${a === 1 ? "" : a === -1 ? "-" : a}${lf(1, -h)}^2 ${v < 0 ? "-" : "+"} ${Math.abs(v)}$. The parabola opens ${a > 0 ? "up" : "down"} with vertex $(${h}, ${v})$, so a horizontal line ${two ? "meets it twice" : "misses it"} exactly when it is ${op === ">" ? "above" : "below"} the vertex: $k ${op} ${v}$.`,
            `配方：$y = ${a === 1 ? "" : a === -1 ? "-" : a}${lf(1, -h)}^2 ${v < 0 ? "-" : "+"} ${Math.abs(v)}$。抛物线开口向${a > 0 ? "上" : "下"}，顶点为 $(${h}, ${v})$，所以水平直线${two ? "与它交于两点" : "与它不相交"}当且仅当直线在顶点${op === ">" ? "上方" : "下方"}：$k ${op} ${v}$。`,
          ),
        });
      },
    ),
  ],
);

/** modelingUsingSystemsOfNonLinearEquations sets up and solves nonlinear systems from word problems. */
export const modelingUsingSystemsOfNonLinearEquations = topic(
  "modeling-using-systems-of-non-linear-equations",
  t("Modeling Using Systems of Non-Linear Equations", "用非线性方程组建模"),
  t(
    "Write a system with a nonlinear equation for a word problem, such as a rectangle's area and perimeter, and solve it by substitution.",
    "为应用题列出含非线性方程的方程组，比如长方形的面积和周长，再用代入法求解。",
  ),
  ["solving-systems-of-nonlinear-equations", "modeling-with-quadratic-equations"],
  ["HSA.CED.A.3", "HSA.REI.C.7"],
  [
    kp(
      "area-and-perimeter",
      t("Area and perimeter", "面积与周长"),
      t(
        "For a rectangle with area $A$ and perimeter $P$, the sides satisfy $lw = A$ and $2l + 2w = P$. Solve the linear equation for one side, $l = \\frac{P}{2} - w$, and substitute into the area equation to get a quadratic in $w$. Its two solutions are the two sides.",
        "对于面积为 $A$、周长为 $P$ 的长方形，两边满足 $lw = A$ 和 $2l + 2w = P$。由线性方程解出一条边 $l = \\frac{P}{2} - w$，代入面积方程，得到关于 $w$ 的二次方程。它的两个解就是两条边。",
      ),
      (rng) => {
        const w = rng.int(2, 15);
        const l = w + rng.int(1, 12);
        const longer = rng.bool();
        return numberProblem({
          prompt: t(
            `A rectangular garden has an area of $${l * w}$ square meters and a perimeter of $${2 * (l + w)}$ meters. What is the length of its ${longer ? "longer" : "shorter"} side, in meters?`,
            `一个长方形花园的面积为 $${l * w}$ 平方米，周长为 $${2 * (l + w)}$ 米。它的${longer ? "长边" : "短边"}长多少米？`,
          ),
          answer: longer ? l : w,
          wrong: [longer ? w : l, l + w, Q.of(l * w, l + w)],
          solution: t(
            `Let the sides be $l$ and $w$, so $lw = ${l * w}$ and $l + w = ${l + w}$. Substituting $l = ${l + w} - w$:${steps(`w(${l + w} - w) = ${l * w}`, `w^2 - ${l + w}w + ${l * w} = 0`, `(w - ${w})(w - ${l}) = 0`)}The sides are $${w}$ m and $${l}$ m, so the ${longer ? "longer" : "shorter"} side is $${longer ? l : w}$ m.`,
            `设两边为 $l$ 和 $w$，则 $lw = ${l * w}$，$l + w = ${l + w}$。代入 $l = ${l + w} - w$：${steps(`w(${l + w} - w) = ${l * w}`, `w^2 - ${l + w}w + ${l * w} = 0`, `(w - ${w})(w - ${l}) = 0`)}两边分别为 $${w}$ m 和 $${l}$ m，所以${longer ? "长边" : "短边"}为 $${longer ? l : w}$ m。`,
          ),
        });
      },
    ),
    kp(
      "a-curve-meeting-a-line-in-context",
      t("A curved path meeting a straight one", "曲线路径与直线路径相遇"),
      t(
        "When one quantity follows a quadratic and another a linear model, they are equal where the two equations have a common solution. Set the expressions equal, collect terms on one side and solve; keep only solutions that make sense in the context, such as positive times.",
        "当一个量服从二次模型、另一个量服从线性模型时，两者相等的时刻就是两个方程的公共解。令两个表达式相等，把各项移到一边求解；只保留在实际情境中有意义的解，比如正的时间。",
      ),
      (rng) => {
        const T = rng.int(2, 8);
        const u = rng.int(1, 6);
        const m = rng.int(2, 9);
        const n = rng.int(0, 20);
        // -5t^2 + b t + c = m t + n  <=>  -5(t - T)(t + u) = 0
        const b = m + 5 * (T - u);
        const c = n + 5 * T * u;
        return numberProblem({
          prompt: t(
            `A ball is thrown from a balcony, and its height after $t$ seconds is $h = ${poly([-5, "t^2"], [b, "t"], [c, ""])}$ meters. At the same moment a drone starts rising, and its height is $d = ${linear(m, n, "t")}$ meters. After how many seconds are the ball and the drone at the same height?`,
            `从阳台抛出一个球，$t$ 秒后它的高度为 $h = ${poly([-5, "t^2"], [b, "t"], [c, ""])}$ 米。同一时刻一架无人机开始上升，它的高度为 $d = ${linear(m, n, "t")}$ 米。多少秒后球和无人机的高度相同？`,
          ),
          answer: T,
          wrong: [-u, u, T + u],
          solution: t(
            `Set the heights equal and collect terms:${steps(`${poly([-5, "t^2"], [b, "t"], [c, ""])} = ${linear(m, n, "t")}`, `${poly([-5, "t^2"], [b - m, "t"], [c - n, ""])} = 0`, `-5(t - ${T})(t + ${u}) = 0`)}The solution $t = -${u}$ is before the throw, so they meet after $${T}$ seconds.`,
            `令两个高度相等并整理：${steps(`${poly([-5, "t^2"], [b, "t"], [c, ""])} = ${linear(m, n, "t")}`, `${poly([-5, "t^2"], [b - m, "t"], [c - n, ""])} = 0`, `-5(t - ${T})(t + ${u}) = 0`)}解 $t = -${u}$ 在抛出之前，所以它们在 $${T}$ 秒后高度相同。`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Polynomials

/** reasoningAboutCoefficientsInQuadraticEquationsUsingTheFactorTheorem finds coefficients from a known factor. */
export const reasoningAboutCoefficientsInQuadraticEquationsUsingTheFactorTheorem = topic(
  "reasoning-about-coefficients-in-quadratic-equations-using-the-factor-theorem",
  t("Reasoning About Coefficients in Quadratic Equations Using the Factor Theorem", "用因式定理推理二次方程的系数"),
  t(
    "Use the factor theorem, $x - r$ is a factor exactly when $p(r) = 0$, to find unknown coefficients and the other zero of a quadratic.",
    "利用因式定理（$x - r$ 是因式当且仅当 $p(r) = 0$）求二次式的未知系数和另一个零点。",
  ),
  ["the-factor-theorem", "reasoning-about-coefficients-of-quadratics-using-standard-and-factored-forms"],
  ["HSA.APR.B.2"],
  [
    kp(
      "an-unknown-coefficient-from-a-factor",
      t("An unknown coefficient from a factor", "由因式求未知系数"),
      t(
        "If $x - r$ is a factor of $p(x)$, then $p(r) = 0$. Substitute $r$ into the polynomial, keeping the unknown coefficient as a letter, and solve the resulting linear equation for it. For a factor $x + 3$, substitute $r = -3$.",
        "若 $x - r$ 是 $p(x)$ 的因式，则 $p(r) = 0$。把 $r$ 代入多项式，未知系数保留为字母，再解得到的一次方程。对于因式 $x + 3$，代入 $r = -3$。",
      ),
      (rng) => {
        const a = rng.int(1, 4);
        const r = rng.nonZero(-6, 6);
        const s = rng.nonZero(-9, 9);
        // a(x - r)(x - s) = a x^2 - a(r+s) x + a r s
        const b = -a * (r + s);
        const c = a * r * s;
        const askB = rng.bool();
        const p = askB ? `${poly([a, "x^2"])} + bx ${c < 0 ? "-" : "+"} ${Math.abs(c)}` : `${poly([a, "x^2"], [b, "x"])} + c`;
        return numberProblem({
          prompt: t(
            `If $${linear(1, -r)}$ is a factor of $${p}$, what is the value of $${askB ? "b" : "c"}$?`,
            `若 $${linear(1, -r)}$ 是 $${p}$ 的因式，则 $${askB ? "b" : "c"}$ 的值是多少？`,
          ),
          answer: askB ? b : c,
          wrong: askB ? [-b, Q.of(-(a * r * r + c), -r), r + s] : [-c, r * s, a * r * r + b * r],
          solution: t(
            `By the factor theorem the polynomial is zero at $x = ${r}$:${steps(askB ? `${a === 1 ? "" : a}${paren(r)}^2 + b \\cdot ${paren(r)} ${c < 0 ? "-" : "+"} ${Math.abs(c)} = 0` : `${a === 1 ? "" : a}${paren(r)}^2 ${b < 0 ? "-" : "+"} ${Math.abs(b)} \\cdot ${paren(r)} + c = 0`, askB ? `${a * r * r + c} ${r < 0 ? "-" : "+"} ${Math.abs(r)}b = 0` : `${a * r * r + b * r} + c = 0`, `${askB ? "b" : "c"} = ${askB ? b : c}`)}`,
            `由因式定理，多项式在 $x = ${r}$ 处为零：${steps(askB ? `${a === 1 ? "" : a}${paren(r)}^2 + b \\cdot ${paren(r)} ${c < 0 ? "-" : "+"} ${Math.abs(c)} = 0` : `${a === 1 ? "" : a}${paren(r)}^2 ${b < 0 ? "-" : "+"} ${Math.abs(b)} \\cdot ${paren(r)} + c = 0`, askB ? `${a * r * r + c} ${r < 0 ? "-" : "+"} ${Math.abs(r)}b = 0` : `${a * r * r + b * r} + c = 0`, `${askB ? "b" : "c"} = ${askB ? b : c}`)}`,
          ),
        });
      },
    ),
    kp(
      "the-other-zero",
      t("The other zero", "另一个零点"),
      t(
        "If $x - r$ is a factor of $ax^2 + bx + c$, the other factor is $a(x - s)$, and comparing constants gives $ars = c$. So the other zero is $s = \\frac{c}{ar}$, found without dividing the polynomials.",
        "若 $x - r$ 是 $ax^2 + bx + c$ 的因式，另一个因式是 $a(x - s)$，比较常数项得 $ars = c$。所以另一个零点是 $s = \\frac{c}{ar}$，不必做多项式除法。",
      ),
      (rng) => {
        const a = rng.int(1, 5);
        const r = rng.nonZero(-7, 7);
        let s = Q.of(rng.nonZero(-9, 9), rng.pick([1, 1, a]));
        if (s.eq(Q.of(r))) s = s.add(Q.one);
        const b = Q.of(-a).mul(Q.of(r).add(s));
        const c = Q.of(a * r).mul(s);
        if (!b.isInteger() || !c.isInteger() || c.isZero())
          return reasoningAboutCoefficientsInQuadraticEquationsUsingTheFactorTheorem.knowledgePoints[1]!.generate(rng);
        const p = poly([a, "x^2"], [b, "x"], [c, ""]);
        return numberProblem({
          prompt: t(
            `$${linear(1, -r)}$ is a factor of $p(x) = ${p}$. What is the other zero of $p$?`,
            `$${linear(1, -r)}$ 是 $p(x) = ${p}$ 的因式。$p$ 的另一个零点是多少？`,
          ),
          answer: s,
          wrong: [c.div(Q.of(r)), s.neg(), c.div(Q.of(a)), Q.of(-r)],
          solution: t(
            `Write $p(x) = ${a === 1 ? "" : a}${lf(1, -r)}(x - s)$. The constant term is $${a} \\cdot ${paren(-r)} \\cdot (-s) = ${a * r}s$, so $${a * r}s = ${c.toLatex()}$ and $s = ${s.toLatex()}$.`,
            `设 $p(x) = ${a === 1 ? "" : a}${lf(1, -r)}(x - s)$。常数项为 $${a} \\cdot ${paren(-r)} \\cdot (-s) = ${a * r}s$，所以 $${a * r}s = ${c.toLatex()}$，$s = ${s.toLatex()}$。`,
          ),
        });
      },
    ),
  ],
);

/** identifyingValidOutputsOfFactoredPolynomials finds the sign of a factored polynomial between and beyond its zeros. */
export const identifyingValidOutputsOfFactoredPolynomials = topic(
  "identifying-valid-outputs-of-factored-polynomials",
  t("Identifying Valid Outputs of Factored Polynomials", "判断已分解多项式的可能输出"),
  t(
    "Determine whether a factored polynomial is positive, negative or zero at an input, and on which intervals it is negative.",
    "判断已分解的多项式在某个输入处是正、负还是零，以及在哪些区间上为负。",
  ),
  ["multiplicities-of-the-roots-of-polynomials"],
  ["HSA.APR.B.3", "HSF.IF.B.4"],
  [
    kp(
      "the-sign-at-an-input",
      t("The sign at an input", "某个输入处的符号"),
      t(
        "To find the sign of a factored polynomial at an input, find the sign of each factor there and multiply the signs. A squared factor is never negative, and any factor equal to zero makes the whole output zero.",
        "要判断已分解多项式在某个输入处的符号，先求每个因式在该处的符号，再把这些符号相乘。平方因式永远不为负，任何一个因式为零都会使整个输出为零。",
      ),
      (rng) => {
        const roots = rng.sample([-7, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6], 3).sort((x, y) => x - y);
        const sq = rng.int(0, 2);
        const lead = rng.pick([1, -1, 2, -3]);
        const x0 = rng.int(0, 5) === 0 ? roots[rng.int(0, 2)]! : rng.int(-8, 8);
        const f = `${lead === 1 ? "" : lead === -1 ? "-" : lead}${roots.map((r, i) => `${lf(1, -r)}${i === sq ? "^2" : ""}`).join("")}`;
        const value = lead * roots.reduce((p, r, i) => p * (x0 - r) ** (i === sq ? 2 : 1), 1);
        const sign = Math.sign(value);
        const label = (n: number) => t(n > 0 ? "Positive" : n < 0 ? "Negative" : "Zero", n > 0 ? "正数" : n < 0 ? "负数" : "零");
        return pickChoice(
          rng,
          t(`Is $f(${x0})$ positive, negative or zero for $f(x) = ${f}$?`, `对于 $f(x) = ${f}$，$f(${x0})$ 是正数、负数还是零？`),
          label(sign),
          [1, -1, 0].filter((n) => n !== sign).map(label),
          t(
            sign === 0
              ? `One factor is zero at $x = ${x0}$, so $f(${x0}) = 0$.`
              : `At $x = ${x0}$ the factors are ${roots.map((r, i) => `$${paren(x0 - r)}${i === sq ? "^2" : ""}$`).join(", ")}, with the constant $${lead}$ in front. Their product is $${value}$, which is ${sign > 0 ? "positive" : "negative"}.`,
            sign === 0
              ? `在 $x = ${x0}$ 处有一个因式为零，所以 $f(${x0}) = 0$。`
              : `在 $x = ${x0}$ 处各因式为 ${roots.map((r, i) => `$${paren(x0 - r)}${i === sq ? "^2" : ""}$`).join("、")}，前面的常数为 $${lead}$。它们的积为 $${value}$，是${sign > 0 ? "正数" : "负数"}。`,
          ),
        );
      },
    ),
    kp(
      "where-the-polynomial-is-negative",
      t("Where the polynomial is negative", "多项式为负的区间"),
      t(
        "The zeros of a factored polynomial split the number line into intervals, and on each interval the sign stays the same. Test one input in each interval. For distinct linear factors and a positive leading coefficient, the sign is positive to the right of every zero and changes at each one.",
        "已分解多项式的零点把数轴分成若干区间，在每个区间上符号保持不变。在每个区间取一个输入检验即可。对于互不相同的一次因式且首项系数为正的情形，在所有零点右侧符号为正，每经过一个零点符号就改变一次。",
      ),
      (rng) => {
        const [r1, r2, r3] = rng.sample([-8, -6, -5, -3, -2, -1, 0, 1, 2, 4, 5, 7], 3).sort((x, y) => x - y) as [number, number, number];
        const lead = rng.pick([1, -1]);
        const f = `${lead === -1 ? "-" : ""}${[r1, r2, r3].map((r) => (r === 0 ? "x" : lf(1, -r))).join("")}`;
        const intervals = [`x < ${r1}`, `${r1} < x < ${r2}`, `${r2} < x < ${r3}`, `x > ${r3}`];
        // sign on interval i (0..3) for lead 1: -, +, -, +
        const negative = lead === 1 ? [0, 2] : [1, 3];
        const pick = rng.pick(negative);
        const others = [0, 1, 2, 3].filter((i) => !negative.includes(i));
        const opt = (i: number) => t(`$${intervals[i]}$`, `$${intervals[i]}$`);
        return pickChoice(
          rng,
          t(`On which interval is $f(x) = ${f}$ negative?`, `$f(x) = ${f}$ 在哪个区间上为负？`),
          opt(pick),
          [...others.map(opt), t(`$x > ${r1}$`, `$x > ${r1}$`)],
          t(
            `The zeros $${r1}$, $${r2}$ and $${r3}$ split the line into four intervals. For large $x$ every factor is positive, so $f$ is ${lead === 1 ? "positive" : "negative"} for $x > ${r3}$, and the sign changes at each zero. So $f$ is negative on $${intervals[negative[0]!]}$ and $${intervals[negative[1]!]}$.`,
            `零点 $${r1}$、$${r2}$、$${r3}$ 把数轴分成四个区间。当 $x$ 很大时每个因式都为正，所以 $x > ${r3}$ 时 $f$ 为${lead === 1 ? "正" : "负"}，每经过一个零点符号改变一次。所以 $f$ 在 $${intervals[negative[0]!]}$ 和 $${intervals[negative[1]!]}$ 上为负。`,
          ),
        );
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Exponential expressions and functions

/** rewritingRadicalExpressionsUsingTheLawsOfExponents turns roots into rational exponents and combines them. */
export const rewritingRadicalExpressionsUsingTheLawsOfExponents = topic(
  "rewriting-radical-expressions-using-the-laws-of-exponents",
  t("Rewriting Radical Expressions Using the Laws of Exponents", "用指数运算法则改写根式"),
  t(
    "Rewrite products and quotients of roots of $x$ as a single power of $x$ with a rational exponent.",
    "把 $x$ 的根式的积与商改写成 $x$ 的一个有理数指数幂。",
  ),
  ["writing-radicals-using-fractional-exponents", "combining-the-rules-of-exponents"],
  ["HSN.RN.A.2"],
  [
    kp(
      "a-root-times-a-power",
      t("A root times a power", "根式乘以幂"),
      t(
        "A root is a power with a fractional exponent: $\\sqrt[n]{x^m} = x^{\\frac{m}{n}}$. After rewriting each root this way, multiply powers of $x$ by adding exponents, so $x^2\\sqrt[3]{x} = x^{2 + \\frac{1}{3}} = x^{\\frac{7}{3}}$.",
        "根式就是分数指数幂：$\\sqrt[n]{x^m} = x^{\\frac{m}{n}}$。把每个根式这样改写后，同底数幂相乘指数相加，所以 $x^2\\sqrt[3]{x} = x^{2 + \\frac{1}{3}} = x^{\\frac{7}{3}}$。",
      ),
      (rng) => {
        const n = rng.int(2, 5);
        let m = rng.int(1, 7);
        if (m % n === 0) m += 1;
        const p = rng.int(-3, 4);
        const k = Q.of(m, n).add(Q.of(p));
        const root = `${n === 2 ? "\\sqrt" : `\\sqrt[${n}]`}{x${m === 1 ? "" : `^{${m}}`}}`;
        const front = p === 0 ? "" : p === 1 ? "x" : `x^{${p}}`;
        return numberProblem({
          prompt: t(
            `For $x > 0$, the expression $${front}${front ? " \\cdot " : ""}${root}$ is equal to $x^k$. What is $k$?`,
            `当 $x > 0$ 时，式子 $${front}${front ? " \\cdot " : ""}${root}$ 等于 $x^k$。$k$ 是多少？`,
          ),
          answer: k,
          wrong: [Q.of(n, m).add(Q.of(p)), Q.of(m * p, n), Q.of(m + p, n), Q.of(m * n + p)],
          solution: t(
            `$${root} = x^{${Q.of(m, n).toLatex()}}$, so the expression is $x^{${paren(p)} + ${Q.of(m, n).toLatex()}} = x^{${k.toLatex()}}$ and $k = ${k.toLatex()}$.`,
            `$${root} = x^{${Q.of(m, n).toLatex()}}$，所以这个式子等于 $x^{${paren(p)} + ${Q.of(m, n).toLatex()}} = x^{${k.toLatex()}}$，$k = ${k.toLatex()}$。`,
          ),
        });
      },
    ),
    kp(
      "a-quotient-of-roots",
      t("A quotient of roots", "根式的商"),
      t(
        "To divide one root of $x$ by another, write both as powers with fractional exponents and subtract the exponents. For example $\\frac{\\sqrt{x^3}}{\\sqrt[3]{x}} = x^{\\frac{3}{2} - \\frac{1}{3}} = x^{\\frac{7}{6}}$; use a common denominator for the subtraction.",
        "一个 $x$ 的根式除以另一个时，把两者都写成分数指数幂，再把指数相减。例如 $\\frac{\\sqrt{x^3}}{\\sqrt[3]{x}} = x^{\\frac{3}{2} - \\frac{1}{3}} = x^{\\frac{7}{6}}$；相减时要通分。",
      ),
      (rng) => {
        const n1 = rng.int(2, 4);
        const n2 = rng.int(2, 5);
        const m1 = rng.int(1, 7);
        const m2 = rng.int(1, 5);
        const k = Q.of(m1, n1).sub(Q.of(m2, n2));
        const r = (n: number, m: number) => `${n === 2 ? "\\sqrt" : `\\sqrt[${n}]`}{x${m === 1 ? "" : `^{${m}}`}}`;
        return numberProblem({
          prompt: t(
            `For $x > 0$, $\\frac{${r(n1, m1)}}{${r(n2, m2)}} = x^k$. What is $k$?`,
            `当 $x > 0$ 时，$\\frac{${r(n1, m1)}}{${r(n2, m2)}} = x^k$。$k$ 是多少？`,
          ),
          answer: k,
          wrong: [Q.of(m1, n1).div(Q.of(m2, n2)), Q.of(m1 - m2, n1 - n2 || 1), Q.of(m1, n1).add(Q.of(m2, n2))],
          solution: t(
            `Write each root as a power and subtract the exponents:${steps(`x^{${Q.of(m1, n1).toLatex()} - ${Q.of(m2, n2).toLatex()}} = x^{${k.toLatex()}}`)}`,
            `把每个根式写成幂，再把指数相减：${steps(`x^{${Q.of(m1, n1).toLatex()} - ${Q.of(m2, n2).toLatex()}} = x^{${k.toLatex()}}`)}`,
          ),
        });
      },
    ),
  ],
);

/** applyingTheDistributiveLawToExponentialExpressions distributes and factors powers. */
export const applyingTheDistributiveLawToExponentialExpressions = topic(
  "applying-the-distributive-law-to-exponential-expressions",
  t("Applying the Distributive Law to Exponential Expressions", "对指数式应用分配律"),
  t(
    "Distribute a power over a sum of powers, and factor a common power out of a sum such as $2^{n+3} + 2^n$.",
    "把一个幂分配到幂的和上，并从 $2^{n+3} + 2^n$ 这样的和中提取公共的幂。",
  ),
  ["combining-rules-of-exponents-with-algebraic-expressions", "distributive-law-for-polynomials"],
  ["HSA.SSE.A.2", "HSN.RN.A.2"],
  [
    kp(
      "distributing-a-power",
      t("Distributing a power", "分配一个幂"),
      t(
        "Multiplying a sum by a power multiplies each term, and multiplying powers of the same base adds exponents. So $x^3(x^4 - 2x^{-1}) = x^7 - 2x^2$. Negative exponents follow the same rule.",
        "用一个幂乘一个和，就是乘以和的每一项，而同底数幂相乘指数相加。所以 $x^3(x^4 - 2x^{-1}) = x^7 - 2x^2$。负指数遵循同样的规则。",
      ),
      (rng) => {
        const a = rng.int(1, 6);
        const b = rng.int(-3, 6);
        const c = rng.int(-4, 5);
        const k = rng.nonZero(-7, 7);
        if (b === c || a + b < 1 || a + c < 1) return applyingTheDistributiveLawToExponentialExpressions.knowledgePoints[0]!.generate(rng);
        const pw = (e: number) => (e === 0 ? "" : e === 1 ? "x" : `x^{${e}}`);
        const inner = poly([1, pw(b) || "1"], [k, pw(c)]).replace(/^1$/, "1");
        const answer = poly([1, pw(a + b) || ""], [k, pw(a + c)]);
        return expressionProblem({
          prompt: t(
            `For $x \\ne 0$, expand $${pw(a)}(${inner})$ and write each term as a single power of $x$.`,
            `当 $x \\ne 0$ 时，展开 $${pw(a)}(${inner})$，并把每一项写成 $x$ 的一个幂。`,
          ),
          answer: answer === "" ? "1" : answer,
          simplified: true,
          wrong: [
            poly([1, pw(a * b) || ""], [k, pw(a * c)]),
            poly([1, pw(a + b) || ""], [k, pw(c)]),
            poly([1, pw(b) || ""], [k, pw(a + c)]),
          ],
          solution: t(
            `Multiply each term by $${pw(a)}$ and add exponents:${steps(`${pw(a)} \\cdot ${pw(b) || "1"} ${k < 0 ? "-" : "+"} ${Math.abs(k) === 1 ? "" : Math.abs(k)}${pw(a)} \\cdot ${pw(c) || "1"} = ${answer}`)}`,
            `用 $${pw(a)}$ 乘以每一项，指数相加：${steps(`${pw(a)} \\cdot ${pw(b) || "1"} ${k < 0 ? "-" : "+"} ${Math.abs(k) === 1 ? "" : Math.abs(k)}${pw(a)} \\cdot ${pw(c) || "1"} = ${answer}`)}`,
          ),
        });
      },
    ),
    kp(
      "factoring-out-a-power",
      t("Factoring out a power", "提取公共的幂"),
      t(
        "Since $2^{n+3} = 2^3 \\cdot 2^n$, a sum such as $2^{n+3} + 2^n$ has the common factor $2^n$: it equals $2^n(2^3 + 1) = 9 \\cdot 2^n$. Factor out the smallest power and evaluate what is left in the parentheses.",
        "由于 $2^{n+3} = 2^3 \\cdot 2^n$，像 $2^{n+3} + 2^n$ 这样的和有公因式 $2^n$：它等于 $2^n(2^3 + 1) = 9 \\cdot 2^n$。提取最小的幂，再计算括号里剩下的部分。",
      ),
      (rng) => {
        const base = rng.pick([2, 3, 5]);
        const e = rng.int(1, base === 2 ? 5 : 3);
        const sign = rng.pick([1, -1]);
        const c = rng.int(1, 4);
        const value = base ** e + sign * c;
        const term = c === 1 ? `${base}^n` : `${c} \\cdot ${base}^n`;
        return numberProblem({
          prompt: t(
            `The expression $${base}^{n + ${e}} ${sign > 0 ? "+" : "-"} ${term}$ is equal to $k \\cdot ${base}^n$ for every $n$. What is $k$?`,
            `对任意 $n$，式子 $${base}^{n + ${e}} ${sign > 0 ? "+" : "-"} ${term}$ 都等于 $k \\cdot ${base}^n$。$k$ 是多少？`,
          ),
          answer: value,
          wrong: [e + sign * c, base * e + sign * c, base ** e, base ** (e + 1) + sign * c],
          solution: t(
            `Write $${base}^{n + ${e}} = ${base}^${e} \\cdot ${base}^n$ and factor out $${base}^n$:${steps(`${base}^n(${base ** e} ${sign > 0 ? "+" : "-"} ${c}) = ${value} \\cdot ${base}^n`)}`,
            `把 $${base}^{n + ${e}}$ 写成 $${base}^${e} \\cdot ${base}^n$，提取 $${base}^n$：${steps(`${base}^n(${base ** e} ${sign > 0 ? "+" : "-"} ${c}) = ${value} \\cdot ${base}^n`)}`,
          ),
        });
      },
    ),
  ],
);

/** combiningExponentialExpressions rewrites powers of different bases as powers of one base. */
export const combiningExponentialExpressions = topic(
  "combining-exponential-expressions",
  t("Combining Exponential Expressions", "合并指数式"),
  t(
    "Rewrite products and quotients of powers such as $4^x \\cdot 8^y$ as one power of a common base, and evaluate them from a given relation between the exponents.",
    "把 $4^x \\cdot 8^y$ 这样的幂的积与商改写成同一个底数的幂，并由指数之间的已知关系求值。",
  ),
  ["combining-the-rules-of-exponents"],
  ["HSA.SSE.A.2", "HSF.IF.C.8"],
  [
    kp(
      "a-common-base",
      t("Rewriting with a common base", "化为同底数"),
      t(
        "Powers of $4$ and $8$ are powers of $2$: $4^x = (2^2)^x = 2^{2x}$ and $8^y = 2^{3y}$. Rewrite every factor with the common base, then add exponents for a product and subtract for a quotient, so $\\frac{4^x}{8^y} = 2^{2x - 3y}$.",
        "$4$ 和 $8$ 的幂都是 $2$ 的幂：$4^x = (2^2)^x = 2^{2x}$，$8^y = 2^{3y}$。把每个因式都化为同一底数，积就把指数相加，商就把指数相减，所以 $\\frac{4^x}{8^y} = 2^{2x - 3y}$。",
      ),
      (rng) => {
        const [b, powers] = rng.pick([
          [2, [2, 4, 8, 16, 32]],
          [3, [3, 9, 27, 81]],
          [5, [5, 25, 125]],
        ] as const);
        const [p, q] = rng.sample([...powers], 2);
        const e1 = Math.round(Math.log(p!) / Math.log(b));
        const e2 = Math.round(Math.log(q!) / Math.log(b));
        const quotient = rng.bool();
        const answer = poly([e1, "x"], [quotient ? -e2 : e2, "y"]);
        return expressionProblem({
          prompt: t(
            quotient
              ? `The expression $\\frac{${p}^x}{${q}^y}$ can be written as $${b}^{E}$. Write $E$ in terms of $x$ and $y$.`
              : `The expression $${p}^x \\cdot ${q}^y$ can be written as $${b}^{E}$. Write $E$ in terms of $x$ and $y$.`,
            quotient
              ? `式子 $\\frac{${p}^x}{${q}^y}$ 可以写成 $${b}^{E}$。用 $x$ 和 $y$ 表示 $E$。`
              : `式子 $${p}^x \\cdot ${q}^y$ 可以写成 $${b}^{E}$。用 $x$ 和 $y$ 表示 $E$。`,
          ),
          answer,
          prefix: "E =",
          wrong: [poly([p!, "x"], [quotient ? -q! : q!, "y"]), poly([e1, "x"], [quotient ? e2 : -e2, "y"]), `${e1 * e2}xy`],
          solution: t(
            `$${p} = ${b}^{${e1}}$ and $${q} = ${b}^{${e2}}$, so the expression is $${b}^{${e1 === 1 ? "" : e1}x}${quotient ? " \\div " : " \\cdot "}${b}^{${e2 === 1 ? "" : e2}y} = ${b}^{${answer}}$.`,
            `$${p} = ${b}^{${e1}}$，$${q} = ${b}^{${e2}}$，所以这个式子等于 $${b}^{${e1 === 1 ? "" : e1}x}${quotient ? " \\div " : " \\cdot "}${b}^{${e2 === 1 ? "" : e2}y} = ${b}^{${answer}}$。`,
          ),
        });
      },
    ),
    kp(
      "evaluating-from-a-relation",
      t("Evaluating from a relation between exponents", "由指数关系求值"),
      t(
        "If the exponents are tied by an equation such as $2x + 3y = 7$, rewrite the expression as a single power whose exponent is that combination: $4^x \\cdot 8^y = 2^{2x + 3y} = 2^7 = 128$. The values of $x$ and $y$ themselves are never needed.",
        "如果指数之间满足 $2x + 3y = 7$ 这样的方程，就把式子改写成一个幂，使它的指数正好是这个组合：$4^x \\cdot 8^y = 2^{2x + 3y} = 2^7 = 128$。根本不需要求出 $x$ 和 $y$ 本身。",
      ),
      (rng) => {
        const [b, p, q] = rng.pick([
          [2, 4, 8],
          [2, 2, 4],
          [2, 4, 2],
          [3, 9, 3],
          [3, 3, 27],
          [2, 8, 4],
          [3, 9, 27],
          [5, 25, 5],
        ] as const);
        const e1 = Math.round(Math.log(p) / Math.log(b));
        const e2 = Math.round(Math.log(q) / Math.log(b));
        const quotient = rng.bool();
        const n = rng.int(-2, b === 2 ? 8 : 4);
        const rel = poly([e1, "x"], [quotient ? -e2 : e2, "y"]);
        const value = Q.of(b).pow(n);
        return numberProblem({
          prompt: t(
            `If $${rel} = ${n}$, what is the value of $${quotient ? `\\frac{${p}^x}{${q}^y}` : `${p}^x \\cdot ${q}^y`}$?`,
            `若 $${rel} = ${n}$，则 $${quotient ? `\\frac{${p}^x}{${q}^y}` : `${p}^x \\cdot ${q}^y`}$ 的值是多少？`,
          ),
          answer: value,
          wrong: [Q.of(n), Q.of(b * n), Q.of(p * q).pow(Math.max(n, 0)), Q.of(b).pow(-n)].filter((w) => !w.eq(value)),
          solution: t(
            `Rewrite with base $${b}$: the expression is $${b}^{${rel}} = ${b}^{${n}} = ${value.toLatex()}$.`,
            `化为以 $${b}$ 为底：这个式子等于 $${b}^{${rel}} = ${b}^{${n}} = ${value.toLatex()}$。`,
          ),
        });
      },
    ),
  ],
);

/** timeShiftingExponentialModels rewrites exponential models for a new starting time or time unit. */
export const timeShiftingExponentialModels = topic(
  "time-shifting-exponential-models",
  t("Time-Shifting Exponential Models", "指数模型的时间平移"),
  t(
    "Rewrite an exponential model for a later starting time, and change the time unit by raising the growth factor to a power.",
    "把指数模型改写为从较晚的时刻开始计时，并通过把增长因子乘方来改变时间单位。",
  ),
  ["modeling-exponential-growth-with-functions", "horizontal-translations-of-functions"],
  ["HSF.IF.C.8", "HSF.LE.B.5"],
  [
    kp(
      "a-later-starting-time",
      t("A later starting time", "较晚的起始时刻"),
      t(
        "If $P(t) = A \\cdot b^t$ counts $t$ from one year and we want to count $s$ from $k$ years later, substitute $t = s + k$: $P = A \\cdot b^{s + k} = (A b^k) \\cdot b^s$. The growth factor stays the same and the new initial value is $A b^k$.",
        "如果 $P(t) = A \\cdot b^t$ 中 $t$ 从某一年开始计算，而我们想让 $s$ 从 $k$ 年后开始计算，就代入 $t = s + k$：$P = A \\cdot b^{s + k} = (A b^k) \\cdot b^s$。增长因子不变，新的初始值为 $A b^k$。",
      ),
      (rng) => {
        const b = rng.pick([Q.of(2), Q.of(3), Q.of(1, 2), Q.of(3, 2), Q.of(1, 3)]);
        const k = rng.int(1, 4);
        const A = b.d === 1n ? rng.int(1, 30) * 10 : Number(b.d) ** k * rng.int(1, 12);
        const y0 = rng.pick([2000, 2005, 2010, 2015, 2020]);
        const value = Q.of(A).mul(b.pow(k));
        return numberProblem({
          prompt: t(
            `A population is modeled by $P(t) = ${A}(${b.toLatex()})^t$, where $t$ is the number of years since ${y0}. The same model is written as $P = C(${b.toLatex()})^s$, where $s$ is the number of years since ${y0 + k}. What is $C$?`,
            `一个种群用 $P(t) = ${A}(${b.toLatex()})^t$ 建模，其中 $t$ 是自 ${y0} 年起的年数。把同一模型写成 $P = C(${b.toLatex()})^s$，其中 $s$ 是自 ${y0 + k} 年起的年数。$C$ 是多少？`,
          ),
          answer: value,
          wrong: [Q.of(A).div(b.pow(k)), Q.of(A).mul(b).mul(Q.of(k)), Q.of(A)],
          solution: t(
            `${y0 + k} is $${k}$ years after ${y0}, so $t = s + ${k}$ and $P = ${A}(${b.toLatex()})^{s + ${k}} = ${A}(${b.toLatex()})^{${k}} (${b.toLatex()})^s$. So $C = ${A} \\cdot (${b.toLatex()})^{${k}} = ${value.toLatex()}$.`,
            `${y0 + k} 年是 ${y0} 年之后 $${k}$ 年，所以 $t = s + ${k}$，$P = ${A}(${b.toLatex()})^{s + ${k}} = ${A}(${b.toLatex()})^{${k}} (${b.toLatex()})^s$。所以 $C = ${A} \\cdot (${b.toLatex()})^{${k}} = ${value.toLatex()}$。`,
          ),
        });
      },
    ),
    kp(
      "a-new-time-unit",
      t("A new time unit", "新的时间单位"),
      t(
        "If a quantity is multiplied by $b$ every year, then every $n$ years it is multiplied by $b^n$, because $b^{t} = (b^n)^{t/n}$. So a model in years can be rewritten in decades, or in two-year periods, by raising the growth factor to the matching power.",
        "如果一个量每年乘以 $b$，那么每 $n$ 年就乘以 $b^n$，因为 $b^{t} = (b^n)^{t/n}$。所以以年为单位的模型可以改写为以十年或两年为单位，只要把增长因子乘上相应的次方。",
      ),
      (rng) => {
        const b = rng.pick([Q.of(2), Q.of(3), Q.of(1, 2), Q.of(3, 2), Q.of(2, 3), Q.of(5, 4), Q.of(4)]);
        const n = rng.int(2, 3);
        const A = rng.int(2, 60) * 10;
        const unit = rng.pick([
          ["hours", "小时"],
          ["years", "年"],
          ["days", "天"],
        ] as const);
        const value = b.pow(n);
        return numberProblem({
          prompt: t(
            `A quantity is modeled by $Q = ${A}(${b.toLatex()})^t$, where $t$ is measured in ${unit[0]}. Written in terms of $p$, the number of ${n}-${unit[0].slice(0, -1)} periods, the model is $Q = ${A} \\cdot c^p$. What is $c$?`,
            `一个量用 $Q = ${A}(${b.toLatex()})^t$ 建模，其中 $t$ 以${unit[1]}为单位。如果改用 $p$ 表示经过了多少个 ${n} ${unit[1]}的时段，模型就是 $Q = ${A} \\cdot c^p$。$c$ 是多少？`,
          ),
          answer: value,
          wrong: [b.mul(Q.of(n)), b.div(Q.of(n)), b.pow(n + 1)],
          solution: t(
            `Each period is $${n}$ ${unit[0]}, so $t = ${n}p$ and $Q = ${A}(${b.toLatex()})^{${n}p} = ${A}\\left((${b.toLatex()})^{${n}}\\right)^p$. So $c = (${b.toLatex()})^{${n}} = ${value.toLatex()}$.`,
            `每个时段是 $${n}$ ${unit[1]}，所以 $t = ${n}p$，$Q = ${A}(${b.toLatex()})^{${n}p} = ${A}\\left((${b.toLatex()})^{${n}}\\right)^p$。所以 $c = (${b.toLatex()})^{${n}} = ${value.toLatex()}$。`,
          ),
        });
      },
    ),
  ],
);

/** extremaOfExponentialFunctions finds the greatest and least values of exponential functions on closed intervals. */
export const extremaOfExponentialFunctions = topic(
  "extrema-of-exponential-functions",
  t("Extrema of Exponential Functions", "指数函数的最值"),
  t(
    "Find the greatest and least values of $f(x) = a \\cdot b^x + c$ on a closed interval from whether it is increasing or decreasing.",
    "根据 $f(x) = a \\cdot b^x + c$ 是增函数还是减函数，求它在闭区间上的最大值和最小值。",
  ),
  ["graphing-exponential-decay-functions", "vertical-translations-of-exponential-growth-functions"],
  ["HSF.IF.B.4", "HSF.IF.C.7"],
  [
    kp(
      "greatest-value-on-an-interval",
      t("The greatest value on an interval", "区间上的最大值"),
      t(
        "$f(x) = a \\cdot b^x + c$ is monotonic: it only increases or only decreases. It increases when $a > 0$ and $b > 1$, or $a < 0$ and $0 < b < 1$, and decreases otherwise. So on a closed interval the extreme values occur at the endpoints, and the direction says which endpoint gives which.",
        "$f(x) = a \\cdot b^x + c$ 是单调的：要么一直增大，要么一直减小。当 $a > 0$ 且 $b > 1$，或 $a < 0$ 且 $0 < b < 1$ 时它递增，否则递减。所以在闭区间上最值出现在端点，单调方向决定哪个端点给出哪个最值。",
      ),
      (rng) => {
        const a = rng.pick([1, 2, 3, 5, -1, -2, -4]);
        const b = rng.pick([Q.of(2), Q.of(3), Q.of(1, 2), Q.of(1, 3)]);
        const c = rng.int(-20, 20);
        const p = rng.int(-3, 1);
        const q = p + rng.int(1, 4);
        const f = (x: number) => Q.of(a).mul(b.pow(x)).add(Q.of(c));
        const max = rng.bool();
        const [fp, fq] = [f(p), f(q)];
        const value = max ? (fp.sub(fq).sign() > 0 ? fp : fq) : fp.sub(fq).sign() < 0 ? fp : fq;
        const other = value.eq(fp) ? fq : fp;
        const fl = `${a === 1 ? "" : a === -1 ? "-" : a}${b.d === 1n ? b.toLatex() : `\\left(${b.toLatex()}\\right)`}^x ${c < 0 ? "-" : "+"} ${Math.abs(c)}`;
        const increasing = a > 0 === b.sub(Q.one).sign() > 0;
        return numberProblem({
          prompt: t(
            `What is the ${max ? "greatest" : "least"} value of $f(x) = ${fl}$ for $${p} \\le x \\le ${q}$?`,
            `当 $${p} \\le x \\le ${q}$ 时，$f(x) = ${fl}$ 的${max ? "最大" : "最小"}值是多少？`,
          ),
          answer: value,
          wrong: [other, Q.of(c), f(0)].filter((w) => !w.eq(value)),
          solution: t(
            `With $a = ${a}$ and base $${b.toLatex()}$, $f$ is ${increasing ? "increasing" : "decreasing"}, so its ${max ? "greatest" : "least"} value is at $x = ${value.eq(fq) ? q : p}$: $f(${value.eq(fq) ? q : p}) = ${value.toLatex()}$.`,
            `$a = ${a}$，底数为 $${b.toLatex()}$，所以 $f$ ${increasing ? "递增" : "递减"}，${max ? "最大" : "最小"}值在 $x = ${value.eq(fq) ? q : p}$ 处取得：$f(${value.eq(fq) ? q : p}) = ${value.toLatex()}$。`,
          ),
        });
      },
    ),
    kp(
      "bounds-from-the-asymptote",
      t("Bounds from the asymptote", "由渐近线得到的界"),
      t(
        "Since $b^x$ is always positive, $a \\cdot b^x + c$ is always greater than $c$ when $a > 0$ and always less than $c$ when $a < 0$. The horizontal asymptote $y = c$ is a bound the function approaches but never reaches, so the function has no greatest or least value on that side.",
        "由于 $b^x$ 总是正数，当 $a > 0$ 时 $a \\cdot b^x + c$ 总大于 $c$，当 $a < 0$ 时总小于 $c$。水平渐近线 $y = c$ 是函数无限接近却永远达不到的界，所以函数在那一侧没有最大值或最小值。",
      ),
      (rng) => {
        const a = rng.pick([1, 2, 3, 6, -1, -2, -5]);
        const b = rng.pick([2, 3, 4, 5, 10]);
        const c = rng.int(-25, 25);
        const fl = `${a === 1 ? "" : a === -1 ? "-" : a} \\cdot ${b}^x ${c < 0 ? "-" : "+"} ${Math.abs(c)}`
          .replace(/^ \\cdot /, "")
          .replace(/^- \\cdot /, "-");
        const op = a > 0 ? ">" : "<";
        return inequalityProblem({
          prompt: t(
            `Every output of $f(x) = ${fl}$ satisfies an inequality $y > m$ or $y < m$, with $m$ as close as possible to the outputs. Write that inequality.`,
            `$f(x) = ${fl}$ 的每个输出都满足形如 $y > m$ 或 $y < m$ 的不等式，其中 $m$ 尽可能接近这些输出。写出这个不等式。`,
          ),
          variable: "y",
          op,
          value: c,
          wrong: [
            [op === ">" ? "<" : ">", c],
            [op, a + c],
            [op === ">" ? ">=" : "<=", c],
          ],
          solution: t(
            `$${b}^x$ is always positive, so $${a} \\cdot ${b}^x$ is always ${a > 0 ? "positive" : "negative"} and $f(x)$ is always ${a > 0 ? "greater" : "less"} than $${c}$. It gets as close to $${c}$ as we like but never equals it, so $y ${op} ${c}$.`,
            `$${b}^x$ 总是正数，所以 $${a} \\cdot ${b}^x$ 总是${a > 0 ? "正数" : "负数"}，$f(x)$ 总${a > 0 ? "大于" : "小于"} $${c}$。它可以任意接近 $${c}$ 但永远不等于它，所以 $y ${op} ${c}$。`,
          ),
        });
      },
    ),
  ],
);

/** determiningUnknownParametersInExponentialFunctions finds a and b in a·bˣ + c from points and the asymptote. */
export const determiningUnknownParametersInExponentialFunctions = topic(
  "determining-unknown-parameters-in-exponential-functions",
  t("Determining Unknown Parameters in Exponential Functions", "确定指数函数中的未知参数"),
  t(
    "Find the constants of $f(x) = a \\cdot b^x$ or $a \\cdot b^x + c$ from points on its graph and its asymptote.",
    "由图像上的点和渐近线求 $f(x) = a \\cdot b^x$ 或 $a \\cdot b^x + c$ 中的常数。",
  ),
  ["vertical-translations-of-exponential-growth-functions"],
  ["HSF.LE.A.2"],
  [
    kp(
      "base-from-two-points",
      t("The base from two points", "由两点求底数"),
      t(
        "For $f(x) = a \\cdot b^x$, dividing two outputs cancels $a$: $\\frac{f(x_2)}{f(x_1)} = b^{x_2 - x_1}$. With $f(0) = 5$ and $f(2) = 45$, $b^2 = 9$ and, since $b > 0$, $b = 3$. Then $a = f(0)$. The ratio of outputs depends only on how far apart the inputs are, not on where they start.",
        "对于 $f(x) = a \\cdot b^x$，两个输出相除可以消去 $a$：$\\frac{f(x_2)}{f(x_1)} = b^{x_2 - x_1}$。若 $f(0) = 5$，$f(2) = 45$，则 $b^2 = 9$，又因 $b > 0$，所以 $b = 3$。再由 $a = f(0)$ 求出 $a$。输出之比只取决于两个输入相差多少，而与从哪里开始无关。",
      ),
      (rng) => {
        const b = rng.pick([Q.of(2), Q.of(3), Q.of(4), Q.of(5), Q.of(1, 2), Q.of(1, 3), Q.of(3, 2)]);
        const gap = rng.int(1, 3);
        const x1 = rng.int(0, 2);
        const base = b.d === 1n ? 1 : Number(b.d) ** (x1 + gap);
        const a = rng.int(1, 9) * base;
        const y1 = Q.of(a).mul(b.pow(x1));
        const y2 = Q.of(a).mul(b.pow(x1 + gap));
        return numberProblem({
          prompt: t(
            `The graph of $f(x) = a \\cdot b^x$, with $b > 0$, passes through $(${x1}, ${y1.toLatex()})$ and $(${x1 + gap}, ${y2.toLatex()})$. What is $b$?`,
            `$f(x) = a \\cdot b^x$（$b > 0$）的图像经过 $(${x1}, ${y1.toLatex()})$ 和 $(${x1 + gap}, ${y2.toLatex()})$。$b$ 是多少？`,
          ),
          answer: b,
          wrong: [y2.div(y1), y2.sub(y1).div(Q.of(gap)), Q.of(a)].filter((w) => !w.eq(b)),
          solution: t(
            `Divide the outputs: $b^{${gap}} = \\frac{${y2.toLatex()}}{${y1.toLatex()}} = ${y2.div(y1).toLatex()}$, so $b = ${b.toLatex()}$.`,
            `两个输出相除：$b^{${gap}} = \\frac{${y2.toLatex()}}{${y1.toLatex()}} = ${y2.div(y1).toLatex()}$，所以 $b = ${b.toLatex()}$。`,
          ),
        });
      },
    ),
    kp(
      "parameters-with-an-asymptote",
      t("Parameters with an asymptote", "有渐近线时的参数"),
      t(
        "For $f(x) = a \\cdot b^x + c$, the horizontal asymptote is $y = c$, and $f(0) = a + c$ because $b^0 = 1$. So the asymptote gives $c$, the $y$-intercept gives $a = f(0) - c$, and one more point gives $b$.",
        "对于 $f(x) = a \\cdot b^x + c$，水平渐近线为 $y = c$，并且由于 $b^0 = 1$，$f(0) = a + c$。所以渐近线给出 $c$，$y$ 轴截距给出 $a = f(0) - c$，再用一个点求出 $b$。",
      ),
      (rng) => {
        const a = rng.nonZero(-8, 9);
        const b = rng.int(2, 5);
        const c = rng.int(-15, 15);
        const ask = rng.pick(["a", "b"] as const);
        const f1 = a * b + c;
        return numberProblem({
          prompt: t(
            `The graph of $f(x) = a \\cdot b^x + c$ has the horizontal asymptote $y = ${c}$, crosses the $y$-axis at $y = ${a + c}$ and passes through $(1, ${f1})$. What is $${ask}$?`,
            `$f(x) = a \\cdot b^x + c$ 的图像有水平渐近线 $y = ${c}$，与 $y$ 轴交于 $y = ${a + c}$，并经过 $(1, ${f1})$。$${ask}$ 是多少？`,
          ),
          answer: ask === "a" ? a : b,
          wrong: ask === "a" ? [a + c, a + 2 * c, -a] : [Q.of(f1, a + c || 1), Q.of(f1 - c), Q.of(b + 1)].filter((w) => !w.eq(Q.of(b))),
          solution: t(
            `The asymptote gives $c = ${c}$. Then $f(0) = a + c = ${a + c}$, so $a = ${a}$.${ask === "b" ? ` Finally $f(1) = ${a}b ${c < 0 ? "-" : "+"} ${Math.abs(c)} = ${f1}$, so $b = ${b}$.` : ""}`,
            `由渐近线得 $c = ${c}$。于是 $f(0) = a + c = ${a + c}$，所以 $a = ${a}$。${ask === "b" ? `最后 $f(1) = ${a}b ${c < 0 ? "-" : "+"} ${Math.abs(c)} = ${f1}$，所以 $b = ${b}$。` : ""}`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Rational expressions and many-variable equations

/** addingRationalExpressionsUsingPolynomialFactorization adds rational expressions after factoring their denominators. */
export const addingRationalExpressionsUsingPolynomialFactorization = topic(
  "adding-rational-expressions-using-polynomial-factorization",
  t("Adding Rational Expressions Using Polynomial Factorization", "通过多项式因式分解加减分式"),
  t(
    "Factor the denominators of rational expressions to find their least common denominator, then add and simplify.",
    "把分式的分母分解因式以求最简公分母，再相加并化简。",
  ),
  ["adding-rational-expressions-with-unlike-denominators", "simplifying-rational-expressions-using-polynomial-factorization"],
  ["HSA.APR.D.6"],
  [
    kp(
      "a-factored-common-denominator",
      t("A denominator that contains the other", "包含另一个分母的分母"),
      t(
        "Factor each denominator before adding. In $\\frac{1}{x - 3} + \\frac{5}{x^2 - 9}$ the second denominator is $(x - 3)(x + 3)$, which already contains $x - 3$, so it is the least common denominator. Multiply the first fraction by $\\frac{x + 3}{x + 3}$ and add the numerators.",
        "相加之前先把每个分母分解因式。在 $\\frac{1}{x - 3} + \\frac{5}{x^2 - 9}$ 中，第二个分母是 $(x - 3)(x + 3)$，它已经包含 $x - 3$，所以就是最简公分母。把第一个分式乘以 $\\frac{x + 3}{x + 3}$，再把分子相加。",
      ),
      (rng) => {
        const a = rng.int(1, 9);
        const sign = rng.pick([1, -1]);
        let c = rng.nonZero(-12, 12);
        if (sign * a + c === a || sign * a + c === -a) c += 1;
        if (c === 0) c = 1;
        // 1/(x - sa) + c/(x^2 - a^2) = (x + sa + c)/(x^2 - a^2)
        const s = sign * a;
        const numer = linear(1, s + c);
        const answer = `\\frac{${numer}}{x^2 - ${a * a}}`;
        return expressionProblem({
          prompt: t(
            `Write $\\frac{1}{${linear(1, -s)}} ${c < 0 ? "-" : "+"} \\frac{${Math.abs(c)}}{x^2 - ${a * a}}$ as a single fraction in lowest terms.`,
            `把 $\\frac{1}{${linear(1, -s)}} ${c < 0 ? "-" : "+"} \\frac{${Math.abs(c)}}{x^2 - ${a * a}}$ 写成一个最简分式。`,
          ),
          answer,
          lowest: true,
          wrong: [`\\frac{${1 + c}}{x^2 - ${a * a}}`, `\\frac{${linear(1, c - s)}}{x^2 - ${a * a}}`, `\\frac{${1 + c}}{${linear(1, -s)}}`],
          solution: t(
            `Since $x^2 - ${a * a} = ${lf(1, -s)}${lf(1, s)}$, multiply the first fraction by $\\frac{${linear(1, s)}}{${linear(1, s)}}$:${steps(`\\frac{${linear(1, s)}}{x^2 - ${a * a}} ${c < 0 ? "-" : "+"} \\frac{${Math.abs(c)}}{x^2 - ${a * a}} = ${answer}`)}`,
            `由于 $x^2 - ${a * a} = ${lf(1, -s)}${lf(1, s)}$，把第一个分式乘以 $\\frac{${linear(1, s)}}{${linear(1, s)}}$：${steps(`\\frac{${linear(1, s)}}{x^2 - ${a * a}} ${c < 0 ? "-" : "+"} \\frac{${Math.abs(c)}}{x^2 - ${a * a}} = ${answer}`)}`,
          ),
        });
      },
    ),
    kp(
      "two-trinomial-denominators",
      t("Two trinomial denominators", "两个三项式分母"),
      t(
        "When both denominators are trinomials, factor them and look for a shared factor. For $\\frac{1}{(x + m)(x + n)}$ and $\\frac{1}{(x + m)(x + k)}$ the least common denominator is $(x + m)(x + n)(x + k)$: the shared factor appears once, not twice.",
        "当两个分母都是三项式时，先分解因式，再找公共因式。对于 $\\frac{1}{(x + m)(x + n)}$ 和 $\\frac{1}{(x + m)(x + k)}$，最简公分母是 $(x + m)(x + n)(x + k)$：公共因式只出现一次，而不是两次。",
      ),
      (rng) => {
        let m = 0;
        let n = 0;
        let k = 0;
        do {
          [m, n, k] = rng.sample([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6], 3) as [number, number, number];
        } while (n + k === 2 * m);
        const d1 = poly([1, "x^2"], [m + n, "x"], [m * n, ""]);
        const d2 = poly([1, "x^2"], [m + k, "x"], [m * k, ""]);
        const answer = `\\frac{${linear(2, n + k)}}{${lf(1, m)}${lf(1, n)}${lf(1, k)}}`;
        return expressionProblem({
          prompt: t(
            `Write $\\frac{1}{${d1}} + \\frac{1}{${d2}}$ as a single fraction in lowest terms.`,
            `把 $\\frac{1}{${d1}} + \\frac{1}{${d2}}$ 写成一个最简分式。`,
          ),
          answer,
          lowest: true,
          wrong: [
            `\\frac{2}{${lf(1, m)}${lf(1, n)}${lf(1, k)}}`,
            `\\frac{${linear(2, n + k)}}{${lf(1, m)}^2${lf(1, n)}${lf(1, k)}}`,
            `\\frac{2}{${d1} + ${d2}}`,
          ],
          solution: t(
            `Factor: $${d1} = ${lf(1, m)}${lf(1, n)}$ and $${d2} = ${lf(1, m)}${lf(1, k)}$. With the common denominator $${lf(1, m)}${lf(1, n)}${lf(1, k)}$ the numerators are $${linear(1, k)}$ and $${linear(1, n)}$, which add to $${linear(2, n + k)}$. So the sum is $${answer}$.`,
            `分解：$${d1} = ${lf(1, m)}${lf(1, n)}$，$${d2} = ${lf(1, m)}${lf(1, k)}$。以 $${lf(1, m)}${lf(1, n)}${lf(1, k)}$ 为公分母，分子分别为 $${linear(1, k)}$ 和 $${linear(1, n)}$，相加得 $${linear(2, n + k)}$。所以和为 $${answer}$。`,
          ),
        });
      },
    ),
  ],
);

/** fractionsOfFractionsWithAlgebraicExpressions simplifies complex fractions with variables. */
export const fractionsOfFractionsWithAlgebraicExpressions = topic(
  "fractions-of-fractions-with-algebraic-expressions",
  t("Fractions of Fractions With Algebraic Expressions", "含代数式的繁分式"),
  t(
    "Simplify fractions whose numerator and denominator contain fractions, by multiplying both by a common denominator.",
    "通过把分子分母同乘一个公分母，化简分子分母中含有分式的繁分式。",
  ),
  ["dividing-rational-expressions", "simplifying-rational-expressions-using-polynomial-factorization"],
  ["HSA.APR.D.6"],
  [
    kp(
      "dividing-monomial-fractions",
      t("A fraction over a fraction", "分式除以分式"),
      t(
        "A fraction of fractions is a division: $\\frac{\\frac{p}{x}}{\\frac{q}{x^2}} = \\frac{p}{x} \\cdot \\frac{x^2}{q} = \\frac{px}{q}$. Multiply by the reciprocal of the denominator, then cancel common factors of the numbers and of $x$.",
        "繁分式就是除法：$\\frac{\\frac{p}{x}}{\\frac{q}{x^2}} = \\frac{p}{x} \\cdot \\frac{x^2}{q} = \\frac{px}{q}$。乘以分母的倒数，再约去数字和 $x$ 的公因式。",
      ),
      (rng) => {
        const p = rng.int(1, 12);
        const q = rng.int(2, 12);
        const e1 = rng.int(1, 3);
        const e2 = rng.int(e1 + 1, e1 + 3);
        const d = e2 - e1;
        const xv = d === 1 ? "x" : `x^${d}`;
        const answer = frac(p, q, xv);
        const pw = (e: number) => (e === 1 ? "x" : `x^${e}`);
        return expressionProblem({
          prompt: t(
            `For $x \\ne 0$, simplify $\\frac{\\frac{${p}}{${pw(e1)}}}{\\frac{${q}}{${pw(e2)}}}$.`,
            `当 $x \\ne 0$ 时，化简 $\\frac{\\frac{${p}}{${pw(e1)}}}{\\frac{${q}}{${pw(e2)}}}$。`,
          ),
          answer,
          lowest: true,
          wrong: [frac(q, p, xv), `\\frac{${p}}{${q}${xv}}`, frac(p, q, pw(e1 + e2))],
          solution: t(
            `Multiply by the reciprocal of the denominator:${steps(`\\frac{${p}}{${pw(e1)}} \\cdot \\frac{${pw(e2)}}{${q}} = \\frac{${p}${pw(e2)}}{${q}${pw(e1)}} = ${answer}`)}`,
            `乘以分母的倒数：${steps(`\\frac{${p}}{${pw(e1)}} \\cdot \\frac{${pw(e2)}}{${q}} = \\frac{${p}${pw(e2)}}{${q}${pw(e1)}} = ${answer}`)}`,
          ),
        });
      },
    ),
    kp(
      "clearing-inner-denominators",
      t("Clearing the inner denominators", "消去内层分母"),
      t(
        "When the numerator and denominator are sums containing fractions, multiply both by the least common denominator of all the small fractions. For $\\frac{1 + \\frac{a}{x}}{1 - \\frac{a^2}{x^2}}$ multiply by $x^2$ to get $\\frac{x^2 + ax}{x^2 - a^2} = \\frac{x(x + a)}{(x - a)(x + a)} = \\frac{x}{x - a}$.",
        "当分子和分母是含分式的和时，把两者都乘以所有小分式的最简公分母。对于 $\\frac{1 + \\frac{a}{x}}{1 - \\frac{a^2}{x^2}}$，乘以 $x^2$ 得 $\\frac{x^2 + ax}{x^2 - a^2} = \\frac{x(x + a)}{(x - a)(x + a)} = \\frac{x}{x - a}$。",
      ),
      (rng) => {
        const a = rng.nonZero(-12, 12);
        const kind = rng.bool();
        const ab = Math.abs(a);
        const plus = a > 0 ? "+" : "-";
        if (kind) {
          const answer = `\\frac{x}{${linear(1, -a)}}`;
          return expressionProblem({
            prompt: t(
              `Simplify $\\frac{1 ${plus} \\frac{${ab}}{x}}{1 - \\frac{${a * a}}{x^2}}$.`,
              `化简 $\\frac{1 ${plus} \\frac{${ab}}{x}}{1 - \\frac{${a * a}}{x^2}}$。`,
            ),
            answer,
            lowest: true,
            wrong: [`\\frac{x}{${linear(1, a)}}`, `\\frac{1}{${linear(1, -a)}}`, `\\frac{${linear(1, a)}}{${linear(1, -a)}}`],
            solution: t(
              `Multiply the numerator and denominator by $x^2$:${steps(`\\frac{x^2 ${plus} ${ab}x}{x^2 - ${a * a}} = \\frac{x${lf(1, a)}}{${lf(1, -a)}${lf(1, a)}} = ${answer}`)}`,
              `分子分母同乘 $x^2$：${steps(`\\frac{x^2 ${plus} ${ab}x}{x^2 - ${a * a}} = \\frac{x${lf(1, a)}}{${lf(1, -a)}${lf(1, a)}} = ${answer}`)}`,
            ),
          });
        }
        // (1/x + 1/a) / (1/x^2 - 1/a^2) = ax/(a - x)
        const answer = `\\frac{${a}x}{${poly([a, ""], [-1, "x"])}}`;
        return expressionProblem({
          prompt: t(
            `Simplify $\\frac{\\frac{1}{x} ${plus} \\frac{1}{${ab}}}{\\frac{1}{x^2} - \\frac{1}{${a * a}}}$.`,
            `化简 $\\frac{\\frac{1}{x} ${plus} \\frac{1}{${ab}}}{\\frac{1}{x^2} - \\frac{1}{${a * a}}}$。`,
          ),
          answer,
          lowest: true,
          wrong: [
            `\\frac{${a}x}{${poly([a, ""], [1, "x"])}}`,
            `\\frac{${a * a}x^2}{${poly([a, ""], [-1, "x"])}}`,
            `\\frac{1}{${poly([a, ""], [-1, "x"])}}`,
          ],
          solution: t(
            `Multiply the numerator and denominator by $${a * a}x^2$:${steps(`\\frac{${a * a}x ${plus} ${ab}x^2}{${a * a} - x^2} = \\frac{${a}x(${poly([a, ""], [1, "x"])})}{(${poly([a, ""], [-1, "x"])})(${poly([a, ""], [1, "x"])})} = ${answer}`)}`,
            `分子分母同乘 $${a * a}x^2$：${steps(`\\frac{${a * a}x ${plus} ${ab}x^2}{${a * a} - x^2} = \\frac{${a}x(${poly([a, ""], [1, "x"])})}{(${poly([a, ""], [-1, "x"])})(${poly([a, ""], [1, "x"])})} = ${answer}`)}`,
          ),
        });
      },
    ),
  ],
);

/** solvingManyVariableRationalEquations solves rational equations in several variables for one of them. */
export const solvingManyVariableRationalEquations = topic(
  "solving-many-variable-rational-equations",
  t("Solving Many-Variable Rational Equations", "解多元分式方程"),
  t(
    "Solve an equation with fractions in several variables for one variable, by clearing denominators and isolating it.",
    "通过去分母并分离变量，解出多元分式方程中的某一个变量。",
  ),
  ["rearranging-formulas", "solving-linear-equations-by-clearing-a-rational-expression"],
  ["HSA.CED.A.4"],
  [
    kp(
      "isolating-a-reciprocal",
      t("Isolating a reciprocal", "分离倒数项"),
      t(
        "To solve $\\frac{p}{x} + \\frac{q}{y} = r$ for $x$, first isolate the term containing $x$: $\\frac{p}{x} = r - \\frac{q}{y} = \\frac{ry - q}{y}$. Then take reciprocals of both sides and multiply by $p$: $x = \\frac{py}{ry - q}$.",
        "要从 $\\frac{p}{x} + \\frac{q}{y} = r$ 中解出 $x$，先分离含 $x$ 的项：$\\frac{p}{x} = r - \\frac{q}{y} = \\frac{ry - q}{y}$。再两边取倒数并乘以 $p$：$x = \\frac{py}{ry - q}$。",
      ),
      (rng) => {
        const p = rng.int(1, 9);
        const q = rng.int(1, 9);
        const r = rng.int(1, 6);
        const answer = `\\frac{${p === 1 ? "" : p}y}{${linear(r, -q, "y")}}`;
        return expressionProblem({
          prompt: t(
            `Solve $\\frac{${p}}{x} + \\frac{${q}}{y} = ${r}$ for $x$.`,
            `从 $\\frac{${p}}{x} + \\frac{${q}}{y} = ${r}$ 中解出 $x$。`,
          ),
          answer,
          prefix: "x =",
          wrong: [
            `\\frac{${linear(r, -q, "y")}}{${p === 1 ? "" : p}y}`,
            `\\frac{${p}}{${r} - ${q}y}`,
            `\\frac{${p === 1 ? "" : p}y}{${linear(r, q, "y")}}`,
          ],
          solution: t(
            `Isolate the term with $x$, then take reciprocals:${steps(`\\frac{${p}}{x} = ${r} - \\frac{${q}}{y} = \\frac{${linear(r, -q, "y")}}{y}`, `x = ${answer}`)}`,
            `分离含 $x$ 的项，再取倒数：${steps(`\\frac{${p}}{x} = ${r} - \\frac{${q}}{y} = \\frac{${linear(r, -q, "y")}}{y}`, `x = ${answer}`)}`,
          ),
        });
      },
    ),
    kp(
      "clearing-all-denominators",
      t("Clearing all the denominators", "去掉所有分母"),
      t(
        "Another way is to multiply both sides by the product of all the variable denominators. For $\\frac{a}{x} - \\frac{b}{z} = \\frac{c}{y}$, multiplying by $xyz$ gives $ayz - bxy = cxz$; factor out $y$ on the left and divide to get $y = \\frac{cxz}{az - bx}$.",
        "另一种方法是两边同乘所有含变量分母的乘积。对于 $\\frac{a}{x} - \\frac{b}{z} = \\frac{c}{y}$，乘以 $xyz$ 得 $ayz - bxy = cxz$；左边提取 $y$，再相除得 $y = \\frac{cxz}{az - bx}$。",
      ),
      (rng) => {
        const a = rng.int(1, 9);
        const b = rng.int(1, 9);
        const c = rng.int(2, 9);
        const answer = `\\frac{${c}xz}{${a === 1 ? "" : a}z - ${b === 1 ? "" : b}x}`;
        return expressionProblem({
          prompt: t(
            `Solve $\\frac{${a}}{x} - \\frac{${b}}{z} = \\frac{${c}}{y}$ for $y$.`,
            `从 $\\frac{${a}}{x} - \\frac{${b}}{z} = \\frac{${c}}{y}$ 中解出 $y$。`,
          ),
          answer,
          prefix: "y =",
          wrong: [
            `\\frac{${a === 1 ? "" : a}z - ${b === 1 ? "" : b}x}{${c}xz}`,
            `\\frac{${c}xz}{${a === 1 ? "" : a}x - ${b === 1 ? "" : b}z}`,
            `\\frac{${c}}{${a - b}}`,
          ],
          solution: t(
            `Multiply both sides by $xyz$, then factor out $y$:${steps(`${a === 1 ? "" : a}yz - ${b === 1 ? "" : b}xy = ${c}xz`, `y(${a === 1 ? "" : a}z - ${b === 1 ? "" : b}x) = ${c}xz`, `y = ${answer}`)}`,
            `两边同乘 $xyz$，再提取 $y$：${steps(`${a === 1 ? "" : a}yz - ${b === 1 ? "" : b}xy = ${c}xz`, `y(${a === 1 ? "" : a}z - ${b === 1 ? "" : b}x) = ${c}xz`, `y = ${answer}`)}`,
          ),
        });
      },
    ),
  ],
);

/** solvingManyVariableNonlinearEquations solves formulas with squares and square roots for one variable. */
export const solvingManyVariableNonlinearEquations = topic(
  "solving-many-variable-nonlinear-equations",
  t("Solving Many-Variable Nonlinear Equations", "解多元非线性方程"),
  t(
    "Solve formulas containing squares or square roots for one variable, undoing the operations in reverse order.",
    "按相反顺序撤销运算，从含平方或平方根的公式中解出某一个变量。",
  ),
  ["rearranging-formulas", "solving-radical-equations"],
  ["HSA.CED.A.4"],
  [
    kp(
      "solving-for-a-squared-variable",
      t("Solving for a squared variable", "解出被平方的变量"),
      t(
        "To solve $y = \\frac{kx^2}{z}$ for a positive $x$, undo the operations on $x$ in reverse order: multiply by $z$, divide by $k$, then take the square root: $x = \\sqrt{\\frac{yz}{k}}$. Only the positive root is kept when the variable is known to be positive.",
        "要从 $y = \\frac{kx^2}{z}$ 中解出正数 $x$，按相反顺序撤销对 $x$ 的运算：乘以 $z$，除以 $k$，再开平方：$x = \\sqrt{\\frac{yz}{k}}$。当已知变量为正时，只保留正的平方根。",
      ),
      (rng) => {
        const k = rng.int(2, 16);
        const form = rng.pick(["over-z", "times-z"] as const);
        const eq = form === "over-z" ? `y = \\frac{${k}x^2}{z}` : `y = ${k}x^2z`;
        const answer = form === "over-z" ? `\\sqrt{\\frac{yz}{${k}}}` : `\\sqrt{\\frac{y}{${k}z}}`;
        const wrong =
          form === "over-z"
            ? [`\\frac{yz}{${k}}`, `\\sqrt{\\frac{y}{${k}z}}`, `\\frac{\\sqrt{yz}}{${k}}`]
            : [`\\frac{y}{${k}z}`, `\\sqrt{\\frac{yz}{${k}}}`, `\\frac{\\sqrt{y}}{${k}z}`];
        return expressionProblem({
          prompt: t(
            `The positive variables $x$, $y$ and $z$ satisfy $${eq}$. Solve for $x$.`,
            `正数变量 $x$、$y$、$z$ 满足 $${eq}$。解出 $x$。`,
          ),
          answer,
          positive: true,
          prefix: "x =",
          wrong,
          solution: t(
            `Isolate $x^2$, then take the positive square root:${steps(form === "over-z" ? `x^2 = \\frac{yz}{${k}}` : `x^2 = \\frac{y}{${k}z}`, `x = ${answer}`)}`,
            `先分离 $x^2$，再取正的平方根：${steps(form === "over-z" ? `x^2 = \\frac{yz}{${k}}` : `x^2 = \\frac{y}{${k}z}`, `x = ${answer}`)}`,
          ),
        });
      },
    ),
    kp(
      "solving-for-a-variable-under-a-root",
      t("Solving for a variable under a root", "解出根号下的变量"),
      t(
        "When the variable is under a square root, isolate the root and square both sides. From $T = k\\sqrt{\\frac{L}{g}}$, divide by $k$ to get $\\frac{T}{k} = \\sqrt{\\frac{L}{g}}$, square to get $\\frac{T^2}{k^2} = \\frac{L}{g}$, and multiply by $g$: $L = \\frac{gT^2}{k^2}$.",
        "当变量在平方根下时，先分离根式，再两边平方。由 $T = k\\sqrt{\\frac{L}{g}}$，除以 $k$ 得 $\\frac{T}{k} = \\sqrt{\\frac{L}{g}}$，平方得 $\\frac{T^2}{k^2} = \\frac{L}{g}$，再乘以 $g$：$L = \\frac{gT^2}{k^2}$。",
      ),
      (rng) => {
        const k = rng.int(2, 16);
        const under = rng.pick(["top", "bottom"] as const);
        const eq = under === "top" ? `y = ${k}\\sqrt{\\frac{x}{z}}` : `y = ${k}\\sqrt{\\frac{z}{x}}`;
        const answer = under === "top" ? `\\frac{y^2z}{${k * k}}` : `\\frac{${k * k}z}{y^2}`;
        const wrong =
          under === "top"
            ? [`\\frac{y^2z}{${k}}`, `\\frac{y^2}{${k * k}z}`, `\\frac{yz}{${k}}`]
            : [`\\frac{${k}z}{y^2}`, `\\frac{y^2z}{${k * k}}`, `\\frac{${k * k}}{y^2z}`];
        return expressionProblem({
          prompt: t(
            `The positive variables $x$, $y$ and $z$ satisfy $${eq}$. Solve for $x$.`,
            `正数变量 $x$、$y$、$z$ 满足 $${eq}$。解出 $x$。`,
          ),
          answer,
          positive: true,
          prefix: "x =",
          wrong,
          solution: t(
            `Divide by $${k}$ and square both sides:${steps(under === "top" ? `\\frac{y^2}{${k * k}} = \\frac{x}{z}` : `\\frac{y^2}{${k * k}} = \\frac{z}{x}`, `x = ${answer}`)}`,
            `除以 $${k}$，再两边平方：${steps(under === "top" ? `\\frac{y^2}{${k * k}} = \\frac{x}{z}` : `\\frac{y^2}{${k * k}} = \\frac{z}{x}`, `x = ${answer}`)}`,
          ),
        });
      },
    ),
  ],
);

/** satFundamentalsAdvancedTopics are the advanced math topics written for SAT Math Fundamentals. */
export const satFundamentalsAdvancedTopics: readonly TopicDef[] = [
  factoringDifferencesOfSquaresUsingSurds,
  factoringExpressionsContainingBinomials,
  factoringExpressionsContainingHiddenFactors,
  perfectSquareQuadraticEquationsWithOneOrNoSolutions,
  theZeroProductRuleForSolvingPolynomialEquations,
  reasoningAboutCoefficientsOfQuadraticsUsingStandardAndFactoredForms,
  fittingQuadraticFunctionsToDataUsingVertexForm,
  reasoningAboutCoefficientsOfQuadraticsUsingSymmetry,
  solvingSystemsOfNonlinearEquationsByIdentifyingStructure,
  determiningUnknownParametersInQuadraticSystemsWithOneIntersectionPoint,
  determiningUnknownParametersInQuadraticSystemsWithZeroOrTwoIntersectionPoints,
  modelingUsingSystemsOfNonLinearEquations,
  reasoningAboutCoefficientsInQuadraticEquationsUsingTheFactorTheorem,
  identifyingValidOutputsOfFactoredPolynomials,
  rewritingRadicalExpressionsUsingTheLawsOfExponents,
  applyingTheDistributiveLawToExponentialExpressions,
  combiningExponentialExpressions,
  timeShiftingExponentialModels,
  extremaOfExponentialFunctions,
  determiningUnknownParametersInExponentialFunctions,
  addingRationalExpressionsUsingPolynomialFactorization,
  fractionsOfFractionsWithAlgebraicExpressions,
  solvingManyVariableRationalEquations,
  solvingManyVariableNonlinearEquations,
];
