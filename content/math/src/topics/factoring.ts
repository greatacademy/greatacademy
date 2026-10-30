import type { Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { gcd, linear, poly } from "@ga/subject-math";

import { choiceProblem, factoredProblem, steps, yesNo } from "../problems.ts";

/** pw writes a power of a variable: "", "x" or "x^{3}". */
const pw = (v: string, e: number) => (e === 0 ? "" : e === 1 ? v : `${v}^{${e}}`);

/** mono writes the monomial c·xᵃ·yᵇ. */
const mono = (c: number, x = 0, y = 0) => poly([c, `${pw("x", x)}${pw("y", y)}`]);

/** front writes a monomial factor before parentheses: "", "-", "3" or "-2x^{2}". */
const front = (c: number, x = 0, y = 0) => (x === 0 && y === 0 ? (c === 1 ? "" : c === -1 ? "-" : String(c)) : mono(c, x, y));

/** quad writes ax² + bx + c in the variable v. */
const quad = (a: number, b: number, c: number, v = "x") => poly([a, pw(v, 2)], [b, v], [c, ""]);

/** lf writes the factor (px + q). */
const lf = (p: number, q: number, v = "x") => `(${linear(p, q, v)})`;

/** lf2 writes the factor (px + qy). */
const lf2 = (p: number, q: number) => `(${poly([p, "x"], [q, "y"])})`;

/** isSquare tells whether n is the square of an integer. */
const isSquare = (n: number) => n >= 0 && Math.round(Math.sqrt(n)) ** 2 === n;

/** gcd3 is the greatest common divisor of three integers. */
const gcd3 = (a: number, b: number, c: number) => gcd(gcd(a, b), c);

/** factorPrompt asks to factor an expression completely. */
const factorPrompt = (expr: string): Text => t(`Factor $${expr}$ completely.`, `将 $${expr}$ 彻底分解因式。`);

/** factorPairs lists the pairs (d, c/d) of integers with product c, with |d| ≤ |c/d|. */
function factorPairs(c: number): [number, number][] {
  const out: [number, number][] = [];
  for (let d = 1; d * d <= Math.abs(c); d++) if (c % d === 0) out.push([d, c / d], [-d, -c / d]);
  return out;
}

/** gcfSteps writes the steps of factoring out a greatest common factor g: each term divided by g, then the factored form. */
function gcfSteps(
  g: string,
  terms: readonly string[],
  quotients: readonly string[],
  expr: string,
  answer: string,
  negative: boolean,
): Text {
  const lines = [...terms.map((m, i) => `\\frac{${m}}{${g}} = ${quotients[i]}`), `${expr} = ${answer}`];
  return t(
    `The greatest common factor of the terms is $${negative ? g.slice(1) : g}$${negative ? `; factor out $${g}$ so that the first term in parentheses is positive` : ""}. Divide each term by it and write the quotients in parentheses:${steps(...lines)}`,
    `各项的最大公因式是 $${negative ? g.slice(1) : g}$${negative ? `；提出 $${g}$，使括号内第一项为正` : ""}。用它去除每一项，把商写在括号里：${steps(...lines)}`,
  );
}

/** trinomialPairs writes, with write, up to two factorizations from the other factor pairs of m·n: the misreadings of x² + bx + mn. */
function trinomialPairs(m: number, n: number, write: (d: number, e: number) => string): string[] {
  return factorPairs(m * n)
    .filter(([d]) => d !== m && d !== n)
    .sort((x, y) => Math.abs(x[0] + x[1] - m - n) - Math.abs(y[0] + y[1] - m - n))
    .slice(0, 2)
    .map(([d, e]) => write(d, e));
}

export const factoringPolynomialsUsingGcfs: TopicDef = {
  id: "factoring-polynomials-using-gcfs",
  title: t("Factoring Polynomials Using GCFs", "提取公因式分解多项式"),
  summary: t(
    "Factor a polynomial by taking out the greatest common factor of its terms, or a common binomial factor.",
    "提取各项的最大公因式或公共二项式因式，分解多项式。",
  ),
  prerequisites: ["greatest-common-factor-of-monomials", "distributive-law-for-polynomials"],
  encompasses: [
    { topic: "greatest-common-factor-of-monomials", weight: 0.6 },
    { topic: "distributive-law-for-polynomials", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSA.SSE.A.2"],
  knowledgePoints: [
    {
      id: "binomials",
      title: t("Factoring out the GCF of a binomial", "提取二项式的最大公因式"),
      explanation: t(
        "**Factoring** undoes the distributive law: it writes a polynomial as a product. Find the greatest common factor (GCF) of the terms, divide each term by it, and write the quotients in parentheses after it:\n\n$$12x^{3} + 18x^{2} = 6x^{2} \\cdot 2x + 6x^{2} \\cdot 3 = 6x^{2}(2x + 3)$$\n\nCheck by distributing: $6x^{2}(2x + 3) = 12x^{3} + 18x^{2}$. If the first term is negative, factor out the negative of the GCF, so that the first term in parentheses is positive: $-4x^{2} + 10x = -2x(2x - 5)$.\n\nA polynomial is factored **completely** when no factor can be factored further. Taking out only part of the GCF, as in $3(4x^{3} + 6x^{2})$, is not complete.",
        "**因式分解**是分配律的逆过程：把多项式写成乘积的形式。先找出各项的最大公因式，用它去除每一项，再把商写在它后面的括号里：\n\n$$12x^{3} + 18x^{2} = 6x^{2} \\cdot 2x + 6x^{2} \\cdot 3 = 6x^{2}(2x + 3)$$\n\n用分配律检验：$6x^{2}(2x + 3) = 12x^{3} + 18x^{2}$。如果第一项是负的，就提出最大公因式的相反数，使括号内第一项为正：$-4x^{2} + 10x = -2x(2x - 5)$。\n\n当每个因式都不能再分解时，多项式才算**彻底**分解。只提出一部分公因式，例如 $3(4x^{3} + 6x^{2})$，没有分解彻底。",
      ),
      keyPrerequisites: ["greatest-common-factor-of-monomials"],
      generate(rng) {
        let g: number;
        let k: number;
        do {
          g = rng.int(1, 9);
          k = rng.int(0, 4);
        } while (g === 1 && k === 0);
        let p: number;
        let q: number;
        do {
          p = rng.int(1, 9);
          q = rng.nonZero(-9, 9);
        } while (gcd(p, q) !== 1);
        const e = q > 0 && rng.bool(0.3) ? 2 : 1;
        const s = rng.bool(0.2) ? -1 : 1;
        const t1 = mono(s * g * p, k + e);
        const t2 = mono(s * g * q, k);
        const expr = poly([s * g * p, pw("x", k + e)], [s * g * q, pw("x", k)]);
        const inner = poly([p, pw("x", e)], [q, ""]);
        const answer = `${front(s * g, k)}(${inner})`;
        return factoredProblem({
          prompt: factorPrompt(expr),
          answer,
          wrong: [
            ...(k >= 1 ? [`${front(s * g)}(${poly([p, pw("x", k + e)], [q, pw("x", k)])})`] : []),
            ...(g > 1 ? [`${front(s, k)}(${poly([g * p, pw("x", e)], [g * q, ""])})`] : []),
            `${front(s * g, k)}(${poly([p, pw("x", e)], [-q, ""])})`,
            `${front(s * g, k)}(${poly([p, pw("x", e + k)], [q, ""])})`,
          ],
          solution: gcfSteps(mono(s * g, k), [t1, t2], [mono(p, e), mono(q)], expr, answer, s < 0),
        });
      },
    },
    {
      id: "trinomials",
      title: t("Factoring out the GCF of a trinomial", "提取三项式的最大公因式"),
      explanation: t(
        "The GCF must divide **every** term. Take the greatest common factor of all the coefficients and the smallest power of $x$ among all the terms:\n\n$$6x^{4} - 9x^{3} + 15x^{2} = 3x^{2}(2x^{2} - 3x + 5)$$\n\nThe parentheses keep one term for each term of the original polynomial: here three. A term equal to the GCF leaves $1$ in the parentheses, not $0$: $2x^{2} + 6x + 2 = 2(x^{2} + 3x + 1)$.",
        "最大公因式必须能整除**每一**项。取所有系数的最大公因数，以及所有项中 $x$ 的最小次幂：\n\n$$6x^{4} - 9x^{3} + 15x^{2} = 3x^{2}(2x^{2} - 3x + 5)$$\n\n括号里的项数与原多项式相同：这里是三项。与公因式相等的项除完剩下 $1$，而不是 $0$：$2x^{2} + 6x + 2 = 2(x^{2} + 3x + 1)$。",
      ),
      generate(rng) {
        let g: number;
        let k: number;
        do {
          g = rng.int(1, 6);
          k = rng.int(0, 3);
        } while (g === 1 && k === 0);
        let a: number;
        let b: number;
        let c: number;
        do {
          a = rng.int(1, 5);
          b = rng.nonZero(-9, 9);
          c = rng.bool(0.15) ? rng.sign() : rng.nonZero(-9, 9);
        } while (gcd3(a, b, c) !== 1 || isSquare(b * b - 4 * a * c));
        const s = rng.bool(0.2) ? -1 : 1;
        const coefs = [s * g * a, s * g * b, s * g * c];
        const terms = coefs.map((m, i) => mono(m, k + 2 - i));
        const expr = poly(...coefs.map((m, i) => [m, pw("x", k + 2 - i)] as const));
        const inner = quad(a, b, c);
        const answer = `${front(s * g, k)}(${inner})`;
        return factoredProblem({
          prompt: factorPrompt(expr),
          answer,
          wrong: [
            ...(k >= 1 ? [`${front(s * g)}(${poly([a, pw("x", k + 2)], [b, pw("x", k + 1)], [c, pw("x", k)])})`] : []),
            ...(g > 1 ? [`${front(s, k)}(${quad(g * a, g * b, g * c)})`] : []),
            `${front(s * g, k)}(${poly([a, "x^{2}"], [b, "x"])})`,
            `${front(s * g, k)}(${quad(a, -b, c)})`,
          ],
          solution: gcfSteps(mono(s * g, k), terms, [mono(a, 2), mono(b, 1), mono(c)], expr, answer, s < 0),
        });
      },
    },
    {
      id: "two-variables",
      title: t("Polynomials in two variables", "含两个变量的多项式"),
      explanation: t(
        "With two variables, the GCF takes the smallest power of each variable that appears in every term:\n\n$$8x^{3}y^{2} - 12xy^{3} = 4xy^{2}(2x^{2} - 3y)$$\n\nCheck the quotients: $\\frac{8x^{3}y^{2}}{4xy^{2}} = 2x^{2}$ and $\\frac{-12xy^{3}}{4xy^{2}} = -3y$.",
        "含两个变量时，最大公因式对每个在所有项中都出现的变量取最小次幂：\n\n$$8x^{3}y^{2} - 12xy^{3} = 4xy^{2}(2x^{2} - 3y)$$\n\n检验商：$\\frac{8x^{3}y^{2}}{4xy^{2}} = 2x^{2}$，$\\frac{-12xy^{3}}{4xy^{2}} = -3y$。",
      ),
      generate(rng) {
        let g: number;
        let i: number;
        let j: number;
        do {
          g = rng.int(1, 8);
          i = rng.int(0, 3);
          j = rng.int(0, 3);
        } while (i + j === 0 || (g === 1 && (i === 0 || j === 0)));
        let p: number;
        let q: number;
        do {
          p = rng.int(1, 9);
          q = rng.nonZero(-9, 9);
        } while (gcd(p, q) !== 1);
        const [[a1, b1], [a2, b2]] = rng.pick([
          [
            [1, 0],
            [0, 1],
          ],
          [
            [2, 0],
            [0, 1],
          ],
          [
            [1, 0],
            [0, 2],
          ],
          [
            [1, 1],
            [0, 0],
          ],
          [
            [2, 1],
            [0, 0],
          ],
        ] as const);
        const m1 = [g * p, i + a1, j + b1] as const;
        const m2 = [g * q, i + a2, j + b2] as const;
        const expr = poly([m1[0], `${pw("x", m1[1])}${pw("y", m1[2])}`], [m2[0], `${pw("x", m2[1])}${pw("y", m2[2])}`]);
        const inner = poly([p, `${pw("x", a1)}${pw("y", b1)}`], [q, `${pw("x", a2)}${pw("y", b2)}`]);
        const answer = `${front(g, i, j)}(${inner})`;
        return factoredProblem({
          prompt: factorPrompt(expr),
          answer,
          wrong: [
            ...(j >= 1
              ? [`${front(g, i)}(${poly([p, `${pw("x", a1)}${pw("y", j + b1)}`], [q, `${pw("x", a2)}${pw("y", j + b2)}`])})`]
              : []),
            ...(i >= 1
              ? [`${front(g, 0, j)}(${poly([p, `${pw("x", i + a1)}${pw("y", b1)}`], [q, `${pw("x", i + a2)}${pw("y", b2)}`])})`]
              : []),
            `${front(g, i, j)}(${poly([p, `${pw("x", a1)}${pw("y", b1)}`], [-q, `${pw("x", a2)}${pw("y", b2)}`])})`,
            `${front(g, Math.max(m1[1], m2[1]), Math.max(m1[2], m2[2]))}(${inner})`,
          ],
          solution: gcfSteps(mono(g, i, j), [mono(...m1), mono(...m2)], [mono(p, a1, b1), mono(q, a2, b2)], expr, answer, false),
        });
      },
    },
    {
      id: "common-binomial-factor",
      title: t("A common binomial factor", "公共二项式因式"),
      explanation: t(
        "A common factor can be a whole binomial. In $3x(x - 4) + 5(x - 4)$ both terms contain the factor $(x - 4)$; factor it out like any other common factor, and the parentheses keep what is left of each term:\n\n$$3x(x - 4) + 5(x - 4) = (x - 4)(3x + 5)$$\n\nThe sign in front of a term belongs to what is left: $2x(x + 1) - 7(x + 1) = (x + 1)(2x - 7)$, and $x(x + 6) + (x + 6) = (x + 6)(x + 1)$, because the second term is $1 \\cdot (x + 6)$.",
        "公因式也可以是一个完整的二项式。在 $3x(x - 4) + 5(x - 4)$ 中，两项都含有因式 $(x - 4)$；像其他公因式一样把它提出来，括号里写每一项剩下的部分：\n\n$$3x(x - 4) + 5(x - 4) = (x - 4)(3x + 5)$$\n\n项前面的符号属于剩下的部分：$2x(x + 1) - 7(x + 1) = (x + 1)(2x - 7)$；$x(x + 6) + (x + 6) = (x + 6)(x + 1)$，因为第二项是 $1 \\cdot (x + 6)$。",
      ),
      generate(rng) {
        let p: number;
        let m: number;
        let a: number;
        let b: number;
        do {
          p = rng.bool(0.7) ? 1 : rng.int(2, 5);
          m = rng.nonZero(-9, 9);
          a = rng.int(1, 6);
          b = rng.nonZero(-9, 9);
        } while (gcd(p, m) !== 1 || gcd(a, b) !== 1 || (p === a && m === b));
        const binom = lf(p, m);
        const coef = (c: number) => (c === 1 ? "" : c === -1 ? "-" : String(c));
        const xTerm = `${coef(a)}x${binom}`;
        const cTerm = `${Math.abs(b) === 1 ? "" : Math.abs(b)}${binom}`;
        const expr = rng.bool(0.75) ? `${xTerm} ${b < 0 ? "-" : "+"} ${cTerm}` : `${b < 0 ? "-" : ""}${cTerm} + ${xTerm}`;
        const answer = `${binom}${lf(a, b)}`;
        return factoredProblem({
          prompt: factorPrompt(expr),
          answer,
          wrong: [`${binom}${lf(a, -b)}`, `${lf(p, -m)}${lf(a, b)}`, `${binom}${lf(a, 0)}`, `${binom}^{2}${lf(a, b)}`],
          solution: t(
            `Both terms contain the factor $${binom}$. Factor it out and keep what is left of each term, with its sign:${steps(`${expr} = ${answer}`)}`,
            `两项都含有因式 $${binom}$。把它提出来，括号里写每一项剩下的部分（连同符号）：${steps(`${expr} = ${answer}`)}`,
          ),
        });
      },
    },
  ],
};

/** pstSteps writes a² ± 2ab + b² = (a ± b)² for a perfect square trinomial with the given square roots of its outer terms. */
function pstSteps(expr: string, a: string, b: string, negative: boolean, answer: string): string {
  return steps(`${expr} = (${a})^{2} ${negative ? "-" : "+"} 2(${a})(${b}) + (${b})^{2} = ${answer}`);
}

export const factoringPerfectSquareTrinomials: TopicDef = {
  id: "factoring-perfect-square-trinomials",
  title: t("Factoring Perfect Square Trinomials", "完全平方三项式的因式分解"),
  summary: t(
    "Recognize trinomials of the form $a^{2} \\pm 2ab + b^{2}$ and factor them as $(a \\pm b)^{2}$.",
    "识别形如 $a^{2} \\pm 2ab + b^{2}$ 的三项式，并分解为 $(a \\pm b)^{2}$。",
  ),
  prerequisites: ["squaring-binomials", "factoring-polynomials-using-gcfs"],
  encompasses: [{ topic: "squaring-binomials", weight: 0.4 }],
  xp: 12,
  standards: ["CCSS.HSA.SSE.A.2"],
  knowledgePoints: [
    {
      id: "recognizing",
      title: t("Recognizing perfect square trinomials", "识别完全平方三项式"),
      explanation: t(
        "Read the square formulas backwards:\n\n$$a^{2} + 2ab + b^{2} = (a + b)^{2} \\qquad a^{2} - 2ab + b^{2} = (a - b)^{2}$$\n\nA trinomial $x^{2} + bx + c$ is a **perfect square trinomial** when its constant term is the square of half the coefficient of $x$: $c = \\left(\\frac{b}{2}\\right)^{2}$. So $x^{2} - 10x + 25$ is one, since $\\left(\\frac{-10}{2}\\right)^{2} = 25$, but $x^{2} + 5x + 25$ is not (the middle term would have to be $10x$), and neither is $x^{2} + 10x - 25$: the constant of a perfect square is never negative.",
        "把平方公式倒过来读：\n\n$$a^{2} + 2ab + b^{2} = (a + b)^{2} \\qquad a^{2} - 2ab + b^{2} = (a - b)^{2}$$\n\n当三项式 $x^{2} + bx + c$ 的常数项等于 $x$ 的系数一半的平方，即 $c = \\left(\\frac{b}{2}\\right)^{2}$ 时，它是**完全平方三项式**。所以 $x^{2} - 10x + 25$ 是，因为 $\\left(\\frac{-10}{2}\\right)^{2} = 25$；但 $x^{2} + 5x + 25$ 不是（中间项应为 $10x$），$x^{2} + 10x - 25$ 也不是：完全平方的常数项不可能是负数。",
      ),
      generate(rng) {
        const a = rng.int(1, 12);
        const s = rng.sign();
        const kind = rng.pick(["yes", "yes", "middle", "constant", "negative"] as const);
        const b = kind === "middle" ? s * a : 2 * s * a;
        const c = kind === "constant" ? a * a + rng.pick([-2, -1, 1, 2, 3]) * Math.max(1, a - 1) : kind === "negative" ? -a * a : a * a;
        const expr = quad(1, b, c);
        const yes = kind === "yes";
        const half = b / 2;
        const halfSq = Number.isInteger(half) ? String(half * half) : `\\frac{${b * b}}{4}`;
        return choiceProblem({
          prompt: t(`Is $${expr}$ a perfect square trinomial?`, `$${expr}$ 是完全平方三项式吗？`),
          options: yesNo,
          correct: yes ? 0 : 1,
          solution: yes
            ? t(
                `Half the coefficient of $x$ is $${half}$, and $(${half})^{2} = ${c}$ is the constant term. So yes: $${expr} = (${linear(1, half)})^{2}$.`,
                `$x$ 的系数的一半是 $${half}$，而 $(${half})^{2} = ${c}$ 正是常数项。所以是：$${expr} = (${linear(1, half)})^{2}$。`,
              )
            : t(
                `The square of half the coefficient of $x$ is $\\left(\\frac{${b}}{2}\\right)^{2} = ${halfSq}$, but the constant term is $${c}$. So no.`,
                `$x$ 的系数一半的平方是 $\\left(\\frac{${b}}{2}\\right)^{2} = ${halfSq}$，但常数项是 $${c}$。所以不是。`,
              ),
        });
      },
    },
    {
      id: "monic",
      title: t("Factoring $x^{2} \\pm 2ax + a^{2}$", "分解 $x^{2} \\pm 2ax + a^{2}$"),
      explanation: t(
        "To factor a perfect square trinomial, take the square roots of the first and last terms, and use the sign of the middle term:\n\n$$x^{2} - 14x + 49 = x^{2} - 2 \\cdot 7 \\cdot x + 7^{2} = (x - 7)^{2}$$\n\nCheck the middle term: twice the product of $x$ and $7$ is $14x$.",
        "分解完全平方三项式时，取首末两项的平方根，符号与中间项相同：\n\n$$x^{2} - 14x + 49 = x^{2} - 2 \\cdot 7 \\cdot x + 7^{2} = (x - 7)^{2}$$\n\n检验中间项：$x$ 与 $7$ 之积的两倍是 $14x$。",
      ),
      generate(rng) {
        const a = rng.int(1, 12);
        const s = rng.sign();
        const v = rng.pick(["x", "y", "t"]);
        const reversed = rng.bool(0.25);
        const expr = reversed ? poly([a * a, ""], [2 * s * a, v], [1, `${v}^{2}`]) : quad(1, 2 * s * a, a * a, v);
        const answer = `(${linear(1, s * a, v)})^{2}`;
        return factoredProblem({
          prompt: factorPrompt(expr),
          answer,
          wrong: [
            `${lf(1, s * a, v)}${lf(1, -s * a, v)}`,
            `(${linear(1, -s * a, v)})^{2}`,
            `(${linear(1, 2 * s * a, v)})^{2}`,
            `(${linear(1, s * a * a, v)})^{2}`,
          ],
          solution: t(
            `The outer terms are the squares of $${v}$ and $${a}$, and the middle term is $${s < 0 ? "-" : ""}2 \\cdot ${v} \\cdot ${a}$:${pstSteps(expr, v, String(a), s < 0, answer)}`,
            `首末两项分别是 $${v}$ 和 $${a}$ 的平方，中间项是 $${s < 0 ? "-" : ""}2 \\cdot ${v} \\cdot ${a}$：${pstSteps(expr, v, String(a), s < 0, answer)}`,
          ),
        });
      },
    },
    {
      id: "two-variables",
      title: t("Perfect squares in two variables", "含两个变量的完全平方"),
      explanation: t(
        "The same pattern works when the last term is a square of a variable term:\n\n$$a^{2} + 6ab + 9b^{2} = a^{2} + 2(a)(3b) + (3b)^{2} = (a + 3b)^{2}$$",
        "当最后一项是含变量的项的平方时，同样适用：\n\n$$a^{2} + 6ab + 9b^{2} = a^{2} + 2(a)(3b) + (3b)^{2} = (a + 3b)^{2}$$",
      ),
      generate(rng) {
        const k = rng.int(1, 9);
        const s = rng.sign();
        const [u, w] = rng.pick([
          ["x", "y"],
          ["a", "b"],
          ["m", "n"],
          ["p", "q"],
        ] as const);
        const expr = poly([1, `${u}^{2}`], [2 * s * k, `${u}${w}`], [k * k, `${w}^{2}`]);
        const inner = (c: number) => poly([1, u], [c, w]);
        const answer = `(${inner(s * k)})^{2}`;
        return factoredProblem({
          prompt: factorPrompt(expr),
          answer,
          wrong: [`(${inner(s * k)})(${inner(-s * k)})`, `(${inner(-s * k)})^{2}`, `(${inner(s * k * k)})^{2}`],
          solution: t(
            `The outer terms are the squares of $${u}$ and $${poly([k, w])}$:${pstSteps(expr, u, poly([k, w]), s < 0, answer)}`,
            `首末两项分别是 $${u}$ 和 $${poly([k, w])}$ 的平方：${pstSteps(expr, u, poly([k, w]), s < 0, answer)}`,
          ),
        });
      },
    },
  ],
};

export const factoringPerfectSquareTrinomialsWithLeadingCoefficients: TopicDef = {
  id: "factoring-perfect-square-trinomials-with-leading-coefficients",
  title: t("Factoring Perfect Square Trinomials With Leading Coefficients", "首项系数不为 1 的完全平方三项式"),
  summary: t(
    "Factor perfect square trinomials such as $9x^{2} - 12x + 4$, including those with a common factor.",
    "分解 $9x^{2} - 12x + 4$ 这类完全平方三项式，包括含公因式的情形。",
  ),
  prerequisites: ["factoring-perfect-square-trinomials"],
  encompasses: [{ topic: "factoring-perfect-square-trinomials", weight: 0.7 }],
  xp: 12,
  standards: ["CCSS.HSA.SSE.A.2"],
  knowledgePoints: [
    {
      id: "square-leading-coefficient",
      title: t("A square leading coefficient", "首项系数是平方数"),
      explanation: t(
        "When the first term is a square such as $9x^{2} = (3x)^{2}$, take its square root, coefficient included, and check the middle term:\n\n$$9x^{2} - 12x + 4 = (3x)^{2} - 2(3x)(2) + 2^{2} = (3x - 2)^{2}$$\n\nIf the middle term is not twice the product of the two roots, the trinomial is not a perfect square.",
        "当第一项是平方数，例如 $9x^{2} = (3x)^{2}$ 时，取它（连同系数）的平方根，再检验中间项：\n\n$$9x^{2} - 12x + 4 = (3x)^{2} - 2(3x)(2) + 2^{2} = (3x - 2)^{2}$$\n\n如果中间项不等于两个平方根之积的两倍，这个三项式就不是完全平方。",
      ),
      generate(rng) {
        let p: number;
        let q: number;
        do {
          p = rng.int(2, 6);
          q = rng.nonZero(-9, 9);
        } while (gcd(p, q) !== 1);
        const expr = quad(p * p, 2 * p * q, q * q);
        const answer = `(${linear(p, q)})^{2}`;
        return factoredProblem({
          prompt: factorPrompt(expr),
          answer,
          wrong: [`(${linear(p, -q)})^{2}`, `${lf(p, q)}${lf(p, -q)}`, `(${linear(p * p, q)})^{2}`, `(${linear(p, q * q)})^{2}`],
          solution: t(
            `The outer terms are the squares of $${mono(p, 1)}$ and $${Math.abs(q)}$:${pstSteps(expr, mono(p, 1), String(Math.abs(q)), q < 0, answer)}`,
            `首末两项分别是 $${mono(p, 1)}$ 和 $${Math.abs(q)}$ 的平方：${pstSteps(expr, mono(p, 1), String(Math.abs(q)), q < 0, answer)}`,
          ),
        });
      },
    },
    {
      id: "common-factor-first",
      title: t("Taking out a common factor first", "先提取公因式"),
      explanation: t(
        "Always look for a common factor first. $2x^{2} + 12x + 18$ is not a perfect square, but after taking out $2$ it contains one:\n\n$$2x^{2} + 12x + 18 = 2(x^{2} + 6x + 9) = 2(x + 3)^{2}$$\n\nWith a negative leading coefficient, take out a negative factor: $-4x^{2} + 4x - 1 = -(4x^{2} - 4x + 1) = -(2x - 1)^{2}$.",
        "总是先找公因式。$2x^{2} + 12x + 18$ 不是完全平方，但提出 $2$ 后括号内是完全平方：\n\n$$2x^{2} + 12x + 18 = 2(x^{2} + 6x + 9) = 2(x + 3)^{2}$$\n\n首项系数为负时，提出一个负因数：$-4x^{2} + 4x - 1 = -(4x^{2} - 4x + 1) = -(2x - 1)^{2}$。",
      ),
      keyPrerequisites: ["factoring-polynomials-using-gcfs"],
      generate(rng) {
        const k = rng.pick([2, 3, 4, 5, 6, -1, -2, -3]);
        let p: number;
        let q: number;
        do {
          p = rng.int(1, 4);
          q = rng.nonZero(-7, 7);
        } while (gcd(p, q) !== 1);
        const expr = quad(k * p * p, 2 * k * p * q, k * q * q);
        const answer = `${front(k)}(${linear(p, q)})^{2}`;
        const inner = quad(p * p, 2 * p * q, q * q);
        return factoredProblem({
          prompt: factorPrompt(expr),
          answer,
          wrong: [
            `${front(k)}(${inner})`,
            `${front(k)}${lf(p, q)}${lf(p, -q)}`,
            `${front(k)}(${linear(p, -q)})^{2}`,
            `${front(-k)}(${linear(p, q)})^{2}`,
          ],
          solution: t(
            `Take out the common factor $${k}$, then factor the perfect square in parentheses:${steps(`${expr} = ${front(k)}(${inner}) = ${answer}`)}`,
            `先提出公因数 $${k}$，再分解括号内的完全平方：${steps(`${expr} = ${front(k)}(${inner}) = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "two-variables",
      title: t("Two variables", "含两个变量"),
      explanation: t(
        "For a trinomial in $x$ and $y$, check that the first and last terms are squares and the middle term is twice the product of their roots:\n\n$$4x^{2} - 20xy + 25y^{2} = (2x)^{2} - 2(2x)(5y) + (5y)^{2} = (2x - 5y)^{2}$$",
        "对含 $x$ 和 $y$ 的三项式，检验首末两项是否为平方，中间项是否为两个平方根之积的两倍：\n\n$$4x^{2} - 20xy + 25y^{2} = (2x)^{2} - 2(2x)(5y) + (5y)^{2} = (2x - 5y)^{2}$$",
      ),
      generate(rng) {
        let p: number;
        let q: number;
        do {
          p = rng.int(1, 5);
          q = rng.nonZero(-7, 7);
        } while (gcd(p, q) !== 1 || (p === 1 && Math.abs(q) === 1));
        const expr = poly([p * p, "x^{2}"], [2 * p * q, "xy"], [q * q, "y^{2}"]);
        const answer = `${lf2(p, q)}^{2}`;
        return factoredProblem({
          prompt: factorPrompt(expr),
          answer,
          wrong: [`${lf2(p, -q)}^{2}`, `${lf2(p, q)}${lf2(p, -q)}`, `${lf2(p * p, q * q)}^{2}`],
          solution: t(
            `The outer terms are the squares of $${mono(p, 1)}$ and $${mono(Math.abs(q), 0, 1)}$:${pstSteps(expr, mono(p, 1), mono(Math.abs(q), 0, 1), q < 0, answer)}`,
            `首末两项分别是 $${mono(p, 1)}$ 和 $${mono(Math.abs(q), 0, 1)}$ 的平方：${pstSteps(expr, mono(p, 1), mono(Math.abs(q), 0, 1), q < 0, answer)}`,
          ),
        });
      },
    },
  ],
};

export const factoringDifferencesOfSquares: TopicDef = {
  id: "factoring-differences-of-squares",
  title: t("Factoring Differences of Squares", "平方差的因式分解"),
  summary: t("Factor $a^{2} - b^{2}$ as $(a + b)(a - b)$.", "把 $a^{2} - b^{2}$ 分解为 $(a + b)(a - b)$。"),
  prerequisites: ["difference-of-squares-formula", "factoring-polynomials-using-gcfs"],
  encompasses: [
    { topic: "difference-of-squares-formula", weight: 0.5 },
    { topic: "factoring-polynomials-using-gcfs", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSA.SSE.A.2"],
  knowledgePoints: [
    {
      id: "monic",
      title: t("Factoring $x^{2} - a^{2}$", "分解 $x^{2} - a^{2}$"),
      explanation: t(
        "Read the difference of squares formula backwards: a square minus a square factors as the sum times the difference of the square roots.\n\n$$a^{2} - b^{2} = (a + b)(a - b) \\qquad x^{2} - 49 = (x + 7)(x - 7)$$\n\nOrder matters in the second factor: $36 - x^{2} = (6 + x)(6 - x)$, which is not $(x + 6)(x - 6)$. A **sum** of squares such as $x^{2} + 49$ cannot be factored over the integers.",
        "把平方差公式倒过来读：一个平方数减去另一个平方数，等于两个平方根的和乘以它们的差。\n\n$$a^{2} - b^{2} = (a + b)(a - b) \\qquad x^{2} - 49 = (x + 7)(x - 7)$$\n\n第二个因式要注意顺序：$36 - x^{2} = (6 + x)(6 - x)$，不等于 $(x + 6)(x - 6)$。平方**和**，例如 $x^{2} + 49$，在整数范围内不能分解。",
      ),
      generate(rng) {
        const a = rng.int(1, 15);
        const v = rng.pick(["x", "y", "t"]);
        const reversed = rng.bool(0.3);
        const expr = reversed ? poly([a * a, ""], [-1, `${v}^{2}`]) : poly([1, `${v}^{2}`], [-a * a, ""]);
        const answer = reversed ? `(${a} + ${v})(${a} - ${v})` : `(${v} + ${a})(${v} - ${a})`;
        return factoredProblem({
          prompt: factorPrompt(expr),
          answer,
          wrong: [
            `(${v} - ${a})^{2}`,
            `(${v} + ${a})^{2}`,
            ...(reversed ? [`(${v} + ${a})(${v} - ${a})`] : []),
            `(${v} + ${a * a})(${v} - 1)`,
          ],
          solution: reversed
            ? t(
                `$${a * a} = ${a}^{2}$, so this is $${a}^{2} - ${v}^{2}$:${steps(`${expr} = (${a} + ${v})(${a} - ${v})`)}`,
                `$${a * a} = ${a}^{2}$，所以这是 $${a}^{2} - ${v}^{2}$：${steps(`${expr} = (${a} + ${v})(${a} - ${v})`)}`,
              )
            : t(
                `$${a * a} = ${a}^{2}$, so this is $${v}^{2} - ${a}^{2}$:${steps(`${expr} = (${v} + ${a})(${v} - ${a})`)}`,
                `$${a * a} = ${a}^{2}$，所以这是 $${v}^{2} - ${a}^{2}$：${steps(`${expr} = (${v} + ${a})(${v} - ${a})`)}`,
              ),
        });
      },
    },
    {
      id: "squares-of-terms",
      title: t("Squares of terms with coefficients", "带系数的项的平方"),
      explanation: t(
        "Each square may be a whole term, coefficient included: $9x^{2} = (3x)^{2}$ and $25y^{2} = (5y)^{2}$.\n\n$$9x^{2} - 25y^{2} = (3x)^{2} - (5y)^{2} = (3x + 5y)(3x - 5y)$$",
        "平方可以是一个完整的项（包括系数）：$9x^{2} = (3x)^{2}$，$25y^{2} = (5y)^{2}$。\n\n$$9x^{2} - 25y^{2} = (3x)^{2} - (5y)^{2} = (3x + 5y)(3x - 5y)$$",
      ),
      generate(rng) {
        let p: number;
        let q: number;
        do {
          p = rng.int(1, 7);
          q = rng.int(1, 11);
        } while (gcd(p, q) !== 1 || (p === 1 && rng.bool(0.7)));
        const withY = rng.bool(0.4);
        const yv = withY ? "y" : "";
        const expr = poly([p * p, "x^{2}"], [-q * q, withY ? "y^{2}" : ""]);
        const f = (s: number) => `(${poly([p, "x"], [s * q, yv])})`;
        const answer = `${f(1)}${f(-1)}`;
        const a = mono(p, 1);
        const b = withY ? mono(q, 0, 1) : String(q);
        return factoredProblem({
          prompt: factorPrompt(expr),
          answer,
          wrong: [`${f(-1)}^{2}`, `${f(1)}^{2}`, `(${poly([p * p, "x"], [q * q, yv])})(${poly([1, "x"], [-1, yv])})`],
          solution: t(
            `Write both terms as squares:${steps(`${expr} = (${a})^{2} - (${b})^{2} = ${answer}`)}`,
            `把两项都写成平方：${steps(`${expr} = (${a})^{2} - (${b})^{2} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "common-factor-first",
      title: t("Taking out a common factor first", "先提取公因式"),
      explanation: t(
        "Neither $3x^{2}$ nor $75$ is a square, but both are multiples of $3$. Take out the common factor first; a difference of squares may then appear:\n\n$$3x^{2} - 75 = 3(x^{2} - 25) = 3(x + 5)(x - 5) \\qquad 2x^{3} - 18x = 2x(x + 3)(x - 3)$$",
        "$3x^{2}$ 和 $75$ 都不是平方数，但都是 $3$ 的倍数。先提出公因式，括号内可能出现平方差：\n\n$$3x^{2} - 75 = 3(x^{2} - 25) = 3(x + 5)(x - 5) \\qquad 2x^{3} - 18x = 2x(x + 3)(x - 3)$$",
      ),
      generate(rng) {
        let p: number;
        let q: number;
        do {
          p = rng.int(1, 3);
          q = rng.int(1, 9);
        } while (gcd(p, q) !== 1);
        const e = rng.bool(0.35) ? 1 : 0;
        const k = e === 1 ? rng.int(1, 5) : rng.int(2, 6);
        const expr = poly([k * p * p, pw("x", 2 + e)], [-k * q * q, pw("x", e)]);
        const inner = poly([p * p, "x^{2}"], [-q * q, ""]);
        const answer = `${front(k, e)}${lf(p, q)}${lf(p, -q)}`;
        return factoredProblem({
          prompt: factorPrompt(expr),
          answer,
          wrong: [
            `${front(k, e)}(${inner})`,
            `${front(k, e)}(${linear(p, -q)})^{2}`,
            ...(k > 1 ? [`${front(1, e)}${lf(k * p, k * q)}${lf(p, -q)}`] : []),
            ...(e === 1 ? [`${front(k)}${lf(p, q)}${lf(p, -q)}`] : []),
          ],
          solution: t(
            `Take out the common factor $${mono(k, e)}$, then factor the difference of squares:${steps(`${expr} = ${front(k, e)}(${inner}) = ${answer}`)}`,
            `先提出公因式 $${mono(k, e)}$，再分解平方差：${steps(`${expr} = ${front(k, e)}(${inner}) = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "factoring-twice",
      title: t("Factoring twice", "两次分解"),
      explanation: t(
        "After one step, a factor may itself be a difference of squares. Keep going until no factor can be factored:\n\n$$x^{4} - 16 = (x^{2} + 4)(x^{2} - 4) = (x^{2} + 4)(x + 2)(x - 2)$$\n\nThe sum of squares $x^{2} + 4$ cannot be factored further.",
        "分解一次之后，某个因式本身可能还是平方差。继续分解，直到每个因式都不能再分解：\n\n$$x^{4} - 16 = (x^{2} + 4)(x^{2} - 4) = (x^{2} + 4)(x + 2)(x - 2)$$\n\n平方和 $x^{2} + 4$ 不能再分解。",
      ),
      generate(rng) {
        let p: number;
        let q: number;
        do {
          p = rng.int(1, 3);
          q = rng.int(1, 5);
        } while (gcd(p, q) !== 1);
        const withY = rng.bool(0.4);
        const k = rng.pick([1, 1, 1, 2, 3]);
        const yv = (e: number) => (withY ? pw("y", e) : "");
        const expr = poly([k * p ** 4, "x^{4}"], [-k * q ** 4, yv(4)]);
        const sum2 = `(${poly([p * p, "x^{2}"], [q * q, yv(2)])})`;
        const diff2 = `(${poly([p * p, "x^{2}"], [-q * q, yv(2)])})`;
        const f = (s: number) => `(${poly([p, "x"], [s * q, yv(1)])})`;
        const answer = `${front(k)}${sum2}${f(1)}${f(-1)}`;
        return factoredProblem({
          prompt: factorPrompt(expr),
          answer,
          wrong: [`${front(k)}${sum2}${diff2}`, `${front(k)}${sum2}${f(-1)}^{2}`, `${front(k)}${f(1)}^{2}${f(-1)}^{2}`],
          solution: t(
            `${k === 1 ? "" : `Take out $${k}$. `}Factor the difference of squares, then factor the difference of squares that remains:${steps(`${expr} = ${front(k)}${sum2}${diff2} = ${answer}`)}`,
            `${k === 1 ? "" : `先提出 $${k}$。`}分解平方差，再分解剩下的平方差：${steps(`${expr} = ${front(k)}${sum2}${diff2} = ${answer}`)}`,
          ),
        });
      },
    },
  ],
};

/** monicSolution explains x² + bx + c = (x + m)(x + n): two numbers with product c and sum b. */
function monicSolution(expr: string, m: number, n: number, answer: string, yv = ""): Text {
  return t(
    `Find two numbers whose product is $${m * n}$ and whose sum is $${m + n}$: they are $${m}$ and $${n}$. So${steps(`${expr} = ${answer}`)}${yv}`,
    `找两个数，它们的积是 $${m * n}$，和是 $${m + n}$：它们是 $${m}$ 和 $${n}$。所以${steps(`${expr} = ${answer}`)}${yv}`,
  );
}

/** drawMonic draws (x + m)(x + n) with m·n of the given sign, m ≠ n and m + n ≠ 0. */
function drawMonic(rng: Rng, positive: boolean): [number, number] {
  let m: number;
  let n: number;
  do {
    m = rng.int(1, 12);
    n = rng.int(1, 12);
    if (positive) {
      const s = rng.sign();
      m *= s;
      n *= s;
    } else n = -n;
  } while (m === n || m + n === 0);
  return m <= n ? [m, n] : [n, m];
}

export const factoringTrinomials: TopicDef = {
  id: "factoring-trinomials",
  title: t("Factoring Trinomials", "三项式的因式分解"),
  summary: t(
    "Factor $x^{2} + bx + c$ as $(x + m)(x + n)$ by finding two numbers with product $c$ and sum $b$.",
    "找出积为 $c$、和为 $b$ 的两个数，把 $x^{2} + bx + c$ 分解为 $(x + m)(x + n)$。",
  ),
  prerequisites: ["multiplying-binomials", "factoring-polynomials-using-gcfs"],
  encompasses: [{ topic: "multiplying-binomials", weight: 0.4 }],
  xp: 15,
  standards: ["CCSS.HSA.SSE.A.2"],
  knowledgePoints: [
    {
      id: "positive-constant",
      title: t("A positive constant term", "常数项为正"),
      explanation: t(
        "Multiplying out $(x + m)(x + n) = x^{2} + (m + n)x + mn$. So to factor $x^{2} + bx + c$, find two numbers $m$ and $n$ with **product** $c$ and **sum** $b$.\n\nFor $x^{2} + 7x + 12$: the pairs with product $12$ are $1, 12$; $2, 6$; $3, 4$; only $3 + 4 = 7$. So $x^{2} + 7x + 12 = (x + 3)(x + 4)$.\n\nWhen $c > 0$, both numbers have the same sign, the sign of $b$: $x^{2} - 7x + 12 = (x - 3)(x - 4)$.",
        "展开 $(x + m)(x + n) = x^{2} + (m + n)x + mn$。所以分解 $x^{2} + bx + c$，就是找两个数 $m$ 和 $n$，使它们的**积**为 $c$，**和**为 $b$。\n\n对 $x^{2} + 7x + 12$：积为 $12$ 的数对有 $1, 12$；$2, 6$；$3, 4$；只有 $3 + 4 = 7$。所以 $x^{2} + 7x + 12 = (x + 3)(x + 4)$。\n\n当 $c > 0$ 时，两个数同号，且与 $b$ 同号：$x^{2} - 7x + 12 = (x - 3)(x - 4)$。",
      ),
      keyPrerequisites: ["multiplying-binomials"],
      generate(rng) {
        const [m, n] = drawMonic(rng, true);
        const expr = quad(1, m + n, m * n);
        const answer = `${lf(1, m)}${lf(1, n)}`;
        return factoredProblem({
          prompt: factorPrompt(expr),
          answer,
          wrong: [`${lf(1, -m)}${lf(1, -n)}`, ...trinomialPairs(m, n, (d, e) => `${lf(1, d)}${lf(1, e)}`)],
          solution: monicSolution(expr, m, n, answer),
        });
      },
    },
    {
      id: "negative-constant",
      title: t("A negative constant term", "常数项为负"),
      explanation: t(
        "When $c < 0$, the two numbers have opposite signs, and the one with the larger absolute value has the sign of $b$.\n\nFor $x^{2} - 2x - 15$: the product is $-15$ and the sum is $-2$, so the numbers are $3$ and $-5$:\n\n$$x^{2} - 2x - 15 = (x + 3)(x - 5)$$\n\nSwapping the signs, $(x - 3)(x + 5)$, gives $x^{2} + 2x - 15$: always check the middle term.",
        "当 $c < 0$ 时，两个数异号，绝对值较大的那个与 $b$ 同号。\n\n对 $x^{2} - 2x - 15$：积是 $-15$，和是 $-2$，所以这两个数是 $3$ 和 $-5$：\n\n$$x^{2} - 2x - 15 = (x + 3)(x - 5)$$\n\n符号对调成 $(x - 3)(x + 5)$，得到的是 $x^{2} + 2x - 15$：一定要检验中间项。",
      ),
      generate(rng) {
        const [m, n] = drawMonic(rng, false);
        const v = rng.pick(["x", "x", "y", "t"]);
        const expr = quad(1, m + n, m * n, v);
        const answer = `${lf(1, m, v)}${lf(1, n, v)}`;
        return factoredProblem({
          prompt: factorPrompt(expr),
          answer,
          wrong: [`${lf(1, -m, v)}${lf(1, -n, v)}`, ...trinomialPairs(m, n, (d, e) => `${lf(1, d, v)}${lf(1, e, v)}`)],
          solution: monicSolution(expr, m, n, answer),
        });
      },
    },
    {
      id: "two-variables",
      title: t("Trinomials in two variables", "含两个变量的三项式"),
      explanation: t(
        "In $x^{2} + bxy + cy^{2}$ the same two numbers appear as coefficients of $y$:\n\n$$(x + my)(x + ny) = x^{2} + (m + n)xy + mny^{2}$$\n\nSo $x^{2} - xy - 12y^{2} = (x + 3y)(x - 4y)$, since $3 \\cdot (-4) = -12$ and $3 + (-4) = -1$.",
        "在 $x^{2} + bxy + cy^{2}$ 中，同样的两个数作为 $y$ 的系数出现：\n\n$$(x + my)(x + ny) = x^{2} + (m + n)xy + mny^{2}$$\n\n所以 $x^{2} - xy - 12y^{2} = (x + 3y)(x - 4y)$，因为 $3 \\cdot (-4) = -12$，$3 + (-4) = -1$。",
      ),
      generate(rng) {
        const [m, n] = drawMonic(rng, rng.bool());
        const expr = poly([1, "x^{2}"], [m + n, "xy"], [m * n, "y^{2}"]);
        const answer = `${lf2(1, m)}${lf2(1, n)}`;
        return factoredProblem({
          prompt: factorPrompt(expr),
          answer,
          wrong: [
            `${lf2(1, -m)}${lf2(1, -n)}`,
            `${lf(1, m)}${lf(1, n, "y")}`,
            ...trinomialPairs(m, n, (d, e) => `${lf2(1, d)}${lf2(1, e)}`),
          ],
          solution: monicSolution(expr, m, n, answer),
        });
      },
    },
  ],
};

export const factoringTrinomialsUsingCommonFactors: TopicDef = {
  id: "factoring-trinomials-using-common-factors",
  title: t("Factoring Trinomials Using Common Factors", "先提公因式再分解三项式"),
  summary: t(
    "Take out a common factor, including a negative one or a power of $x$, and then factor the trinomial left.",
    "先提出公因式（包括负数或 $x$ 的幂），再分解剩下的三项式。",
  ),
  prerequisites: ["factoring-trinomials"],
  encompasses: [
    { topic: "factoring-trinomials", weight: 0.7 },
    { topic: "factoring-polynomials-using-gcfs", weight: 0.4 },
  ],
  xp: 12,
  standards: ["CCSS.HSA.SSE.A.2"],
  knowledgePoints: [
    {
      id: "numeric-factor",
      title: t("A numerical common factor", "数字公因数"),
      explanation: t(
        "First take out the greatest common factor of the coefficients, then factor the trinomial in parentheses:\n\n$$3x^{2} - 6x - 24 = 3(x^{2} - 2x - 8) = 3(x + 2)(x - 4)$$\n\nThe factorization is complete only when the common factor is taken out: $(3x + 6)(x - 4)$ is equal, but its first factor still has the factor $3$.",
        "先提出各系数的最大公因数，再分解括号内的三项式：\n\n$$3x^{2} - 6x - 24 = 3(x^{2} - 2x - 8) = 3(x + 2)(x - 4)$$\n\n只有提出公因数后才算彻底分解：$(3x + 6)(x - 4)$ 虽然相等，但第一个因式里还含有因数 $3$。",
      ),
      generate(rng) {
        const k = rng.int(2, 6);
        const [m, n] = drawMonic(rng, rng.bool());
        const expr = quad(k, k * (m + n), k * m * n);
        const inner = quad(1, m + n, m * n);
        const answer = `${k}${lf(1, m)}${lf(1, n)}`;
        return factoredProblem({
          prompt: factorPrompt(expr),
          answer,
          wrong: [`${k}(${inner})`, `${lf(k, k * m)}${lf(1, n)}`, `${k}${lf(1, -m)}${lf(1, -n)}`, `${lf(1, m)}${lf(1, n)}`],
          solution: t(
            `Take out the common factor $${k}$, then factor the trinomial:${steps(`${expr} = ${k}(${inner}) = ${answer}`)}`,
            `先提出公因数 $${k}$，再分解三项式：${steps(`${expr} = ${k}(${inner}) = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "power-of-x",
      title: t("A common power of $x$", "公因式含 $x$ 的幂"),
      explanation: t(
        "When every term contains $x$, the common factor includes a power of $x$, and what is left is a trinomial of lower degree:\n\n$$2x^{3} + 10x^{2} + 12x = 2x(x^{2} + 5x + 6) = 2x(x + 2)(x + 3)$$",
        "当每一项都含有 $x$ 时，公因式包含 $x$ 的幂，剩下的是次数更低的三项式：\n\n$$2x^{3} + 10x^{2} + 12x = 2x(x^{2} + 5x + 6) = 2x(x + 2)(x + 3)$$",
      ),
      generate(rng) {
        const k = rng.int(1, 5);
        const e = rng.bool(0.7) ? 1 : 2;
        const [m, n] = drawMonic(rng, rng.bool());
        const expr = poly([k, pw("x", e + 2)], [k * (m + n), pw("x", e + 1)], [k * m * n, pw("x", e)]);
        const inner = quad(1, m + n, m * n);
        const g = front(k, e);
        const answer = `${g}${lf(1, m)}${lf(1, n)}`;
        return factoredProblem({
          prompt: factorPrompt(expr),
          answer,
          wrong: [`${g}(${inner})`, `${front(k, e - 1)}${lf(1, m)}${lf(1, n)}`, `${g}${lf(1, -m)}${lf(1, -n)}`],
          solution: t(
            `Take out the common factor $${mono(k, e)}$, then factor the trinomial:${steps(`${expr} = ${g}(${inner}) = ${answer}`)}`,
            `先提出公因式 $${mono(k, e)}$，再分解三项式：${steps(`${expr} = ${g}(${inner}) = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "negative-leading-coefficient",
      title: t("A negative leading coefficient", "首项系数为负"),
      explanation: t(
        "When the leading coefficient is negative, take out a negative factor, which changes the sign of every term inside:\n\n$$-x^{2} - 2x + 15 = -(x^{2} + 2x - 15) = -(x + 5)(x - 3)$$\n\nThen the trinomial in parentheses starts with $x^{2}$ and factors as before.",
        "首项系数为负时，提出一个负因数，括号内每一项都要变号：\n\n$$-x^{2} - 2x + 15 = -(x^{2} + 2x - 15) = -(x + 5)(x - 3)$$\n\n这样括号内的三项式以 $x^{2}$ 开头，可以照常分解。",
      ),
      generate(rng) {
        const k = rng.pick([-1, -1, -2, -3, -4, -5]);
        const [m, n] = drawMonic(rng, rng.bool());
        const expr = quad(k, k * (m + n), k * m * n);
        const inner = quad(1, m + n, m * n);
        const answer = `${front(k)}${lf(1, m)}${lf(1, n)}`;
        return factoredProblem({
          prompt: factorPrompt(expr),
          answer,
          wrong: [`${front(-k)}${lf(1, m)}${lf(1, n)}`, `${front(k)}${lf(1, -m)}${lf(1, -n)}`, `${front(k)}(${inner})`],
          solution: t(
            `Take out $${k}$, changing the sign of every term, then factor the trinomial:${steps(`${expr} = ${front(k)}(${inner}) = ${answer}`)}`,
            `提出 $${k}$，括号内每一项都变号，再分解三项式：${steps(`${expr} = ${front(k)}(${inner}) = ${answer}`)}`,
          ),
        });
      },
    },
  ],
};

/** drawBinomials draws (px + q)(rx + s) with each factor primitive, p·r ≥ 2 and a nonzero middle coefficient. */
function drawBinomials(rng: Rng, pMin: number, rMin: number, max = 9): [number, number, number, number] {
  let p: number;
  let q: number;
  let r: number;
  let s: number;
  do {
    p = rng.int(pMin, 5);
    r = rng.int(rMin, 5);
    q = rng.nonZero(-max, max);
    s = rng.nonZero(-max, max);
  } while (gcd(p, q) !== 1 || gcd(r, s) !== 1 || p * r < 2 || p * s + q * r === 0 || (p === r && q === s));
  return [p, q, r, s];
}

/** acSolution explains the ac method for (px + q)(rx + s): split the middle term and factor by grouping. */
function acSolution(expr: string, p: number, q: number, r: number, s: number, answer: string): Text {
  const a = p * r;
  const c = q * s;
  const split = poly([a, "x^{2}"], [p * s, "x"], [q * r, "x"], [c, ""]);
  const grouped = `${mono(p, 1)}${lf(r, s)} ${q < 0 ? "-" : "+"} ${Math.abs(q) === 1 ? "" : Math.abs(q)}${lf(r, s)}`;
  return t(
    `Multiply the leading coefficient and the constant term: $${a} \\cdot ${c < 0 ? `(${c})` : c} = ${a * c}$. Two numbers with product $${a * c}$ and sum $${p * s + q * r}$ are $${p * s}$ and $${q * r}$. Split the middle term and factor by grouping:${steps(`${expr} = ${split}`, `= ${grouped} = ${answer}`)}`,
    `首项系数与常数项相乘：$${a} \\cdot ${c < 0 ? `(${c})` : c} = ${a * c}$。积为 $${a * c}$、和为 $${p * s + q * r}$ 的两个数是 $${p * s}$ 和 $${q * r}$。拆开中间项，再分组分解：${steps(`${expr} = ${split}`, `= ${grouped} = ${answer}`)}`,
  );
}

export const factoringTrinomialsWithLeadingCoefficients: TopicDef = {
  id: "factoring-trinomials-with-leading-coefficients",
  title: t("Factoring Trinomials With Leading Coefficients", "首项系数不为 1 的三项式的因式分解"),
  summary: t("Factor $ax^{2} + bx + c$ by grouping and by the $ac$ method.", "用分组分解法和 $ac$ 法分解 $ax^{2} + bx + c$。"),
  prerequisites: ["factoring-trinomials"],
  encompasses: [{ topic: "factoring-trinomials", weight: 0.5 }],
  xp: 18,
  standards: ["CCSS.HSA.SSE.A.2"],
  knowledgePoints: [
    {
      id: "grouping",
      title: t("Factoring by grouping", "分组分解"),
      explanation: t(
        "A polynomial with four terms can sometimes be factored by **grouping**: take a common factor out of the first two terms and out of the last two, so that the same binomial appears in both, then factor it out.\n\n$$6x^{2} + 4x + 9x + 6 = 2x(3x + 2) + 3(3x + 2) = (3x + 2)(2x + 3)$$\n\nIf the third term is negative, take out a negative factor from the last two terms: $2x^{2} - 6x - x + 3 = 2x(x - 3) - (x - 3) = (x - 3)(2x - 1)$.",
        "四项的多项式有时可以用**分组分解**：从前两项和后两项分别提出公因式，使两组出现同一个二项式，再把它提出来。\n\n$$6x^{2} + 4x + 9x + 6 = 2x(3x + 2) + 3(3x + 2) = (3x + 2)(2x + 3)$$\n\n如果第三项是负的，就从后两项提出一个负因数：$2x^{2} - 6x - x + 3 = 2x(x - 3) - (x - 3) = (x - 3)(2x - 1)$。",
      ),
      keyPrerequisites: ["factoring-polynomials-using-gcfs"],
      generate(rng) {
        const [p, q, r, s] = drawBinomials(rng, 1, 1);
        const expr = poly([p * r, "x^{2}"], [p * s, "x"], [q * r, "x"], [q * s, ""]);
        const answer = `${lf(p, q)}${lf(r, s)}`;
        const grouped = `${mono(p, 1)}${lf(r, s)} ${q < 0 ? "-" : "+"} ${Math.abs(q) === 1 ? "" : Math.abs(q)}${lf(r, s)}`;
        return factoredProblem({
          prompt: t(`Factor $${expr}$ completely by grouping.`, `用分组分解法将 $${expr}$ 彻底分解因式。`),
          answer,
          wrong: [`${lf(p, -q)}${lf(r, s)}`, `${lf(p, q)}${lf(r, -s)}`, `${lf(p, s)}${lf(r, q)}`],
          solution: t(
            `Take $${mono(p, 1)}$ out of the first two terms and $${q}$ out of the last two:${steps(`${expr} = ${grouped} = ${answer}`)}`,
            `从前两项提出 $${mono(p, 1)}$，从后两项提出 $${q}$：${steps(`${expr} = ${grouped} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "prime-leading-coefficient",
      title: t("A prime leading coefficient", "首项系数是质数"),
      explanation: t(
        "When the leading coefficient is a prime such as $3$, the factors must start with $3x$ and $x$: $(3x + m)(x + n)$. Expanding gives $3x^{2} + (3n + m)x + mn$, so try the factor pairs of the constant term in both orders until the middle term matches.\n\nFor $3x^{2} + 10x - 8$: the pair $-2$ and $4$ in $(3x - 2)(x + 4)$ gives the middle term $12x - 2x = 10x$, while $(3x + 4)(x - 2)$ gives $-2x$. So $3x^{2} + 10x - 8 = (3x - 2)(x + 4)$.",
        "当首项系数是质数（例如 $3$）时，两个因式必须以 $3x$ 和 $x$ 开头：$(3x + m)(x + n)$。展开得 $3x^{2} + (3n + m)x + mn$，所以把常数项的因数对按两种顺序依次尝试，直到中间项相符。\n\n对 $3x^{2} + 10x - 8$：$(3x - 2)(x + 4)$ 的中间项是 $12x - 2x = 10x$，而 $(3x + 4)(x - 2)$ 的中间项是 $-2x$。所以 $3x^{2} + 10x - 8 = (3x - 2)(x + 4)$。",
      ),
      generate(rng) {
        let a: number;
        let q: number;
        let s: number;
        do {
          a = rng.pick([2, 3, 5, 7]);
          q = rng.nonZero(-9, 9);
          s = rng.nonZero(-9, 9);
        } while (gcd(a, q) !== 1 || a * s + q === 0);
        const expr = quad(a, a * s + q, q * s);
        const answer = `${lf(a, q)}${lf(1, s)}`;
        return factoredProblem({
          prompt: factorPrompt(expr),
          answer,
          wrong: [`${lf(a, s)}${lf(1, q)}`, `${lf(a, -q)}${lf(1, -s)}`, `${lf(a, q)}${lf(1, -s)}`],
          solution: t(
            `The factors start with $${a}x$ and $x$. Among the factor pairs of $${q * s}$, $${q}$ and $${s}$ in $${answer}$ give the middle term $${mono(a * s, 1)} ${q < 0 ? "-" : "+"} ${mono(Math.abs(q), 1)} = ${mono(a * s + q, 1)}$. So${steps(`${expr} = ${answer}`)}`,
            `两个因式分别以 $${a}x$ 和 $x$ 开头。在 $${q * s}$ 的因数对中，$${answer}$ 中的 $${q}$ 和 $${s}$ 给出中间项 $${mono(a * s, 1)} ${q < 0 ? "-" : "+"} ${mono(Math.abs(q), 1)} = ${mono(a * s + q, 1)}$。所以${steps(`${expr} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "ac-method",
      title: t("The $ac$ method", "$ac$ 法"),
      explanation: t(
        "When there are many factor pairs to try, use the **$ac$ method** for $ax^{2} + bx + c$:\n\n1. Find two numbers with product $ac$ and sum $b$.\n2. Split $bx$ into two terms with these coefficients.\n3. Factor by grouping.\n\nFor $6x^{2} + 7x - 20$: $ac = -120$, and $15 \\cdot (-8) = -120$, $15 + (-8) = 7$. So\n\n$$6x^{2} + 15x - 8x - 20 = 3x(2x + 5) - 4(2x + 5) = (2x + 5)(3x - 4)$$",
        "因数对很多时，对 $ax^{2} + bx + c$ 用 **$ac$ 法**：\n\n1. 找两个数，积为 $ac$，和为 $b$。\n2. 把 $bx$ 拆成以这两个数为系数的两项。\n3. 分组分解。\n\n对 $6x^{2} + 7x - 20$：$ac = -120$，而 $15 \\cdot (-8) = -120$，$15 + (-8) = 7$。所以\n\n$$6x^{2} + 15x - 8x - 20 = 3x(2x + 5) - 4(2x + 5) = (2x + 5)(3x - 4)$$",
      ),
      generate(rng) {
        const [p, q, r, s] = drawBinomials(rng, 2, 2);
        const expr = quad(p * r, p * s + q * r, q * s);
        const answer = `${lf(p, q)}${lf(r, s)}`;
        return factoredProblem({
          prompt: factorPrompt(expr),
          answer,
          wrong: [`${lf(p, s)}${lf(r, q)}`, `${lf(p, -q)}${lf(r, -s)}`, `${lf(p, q)}${lf(r, -s)}`],
          solution: acSolution(expr, p, q, r, s, answer),
        });
      },
    },
  ],
};

export const furtherFactoringTrinomialsWithLeadingCoefficients: TopicDef = {
  id: "further-factoring-trinomials-with-leading-coefficients",
  title: t("Further Factoring Trinomials With Leading Coefficients", "首项系数不为 1 的三项式的进一步分解"),
  summary: t(
    "Factor trinomials with leading coefficients that also have a common factor, a negative leading coefficient or two variables.",
    "分解含公因式、首项系数为负或含两个变量的首项系数不为 1 的三项式。",
  ),
  prerequisites: ["factoring-trinomials-with-leading-coefficients", "factoring-trinomials-using-common-factors"],
  encompasses: [
    { topic: "factoring-trinomials-with-leading-coefficients", weight: 0.7 },
    { topic: "factoring-trinomials-using-common-factors", weight: 0.4 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.SSE.A.2"],
  knowledgePoints: [
    {
      id: "common-factor-first",
      title: t("Taking out a common factor first", "先提取公因式"),
      explanation: t(
        "Take out the greatest common factor before using the $ac$ method; the numbers become smaller and the result is complete:\n\n$$12x^{2} + 2x - 4 = 2(6x^{2} + x - 2) = 2(2x - 1)(3x + 2)$$",
        "用 $ac$ 法之前先提出最大公因数；数会变小，结果也才彻底：\n\n$$12x^{2} + 2x - 4 = 2(6x^{2} + x - 2) = 2(2x - 1)(3x + 2)$$",
      ),
      generate(rng) {
        const k = rng.int(2, 4);
        const [p, q, r, s] = drawBinomials(rng, 1, 2, 7);
        const expr = quad(k * p * r, k * (p * s + q * r), k * q * s);
        const inner = quad(p * r, p * s + q * r, q * s);
        const answer = `${k}${lf(p, q)}${lf(r, s)}`;
        return factoredProblem({
          prompt: factorPrompt(expr),
          answer,
          wrong: [`${k}(${inner})`, `${lf(k * p, k * q)}${lf(r, s)}`, `${k}${lf(p, s)}${lf(r, q)}`, `${lf(p, q)}${lf(r, s)}`],
          solution: t(
            `Take out the common factor $${k}$, then factor $${inner}$:${steps(`${expr} = ${k}(${inner}) = ${answer}`)}`,
            `先提出公因数 $${k}$，再分解 $${inner}$：${steps(`${expr} = ${k}(${inner}) = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "negative-leading-coefficient",
      title: t("A negative leading coefficient", "首项系数为负"),
      explanation: t(
        "Take out $-1$ (or a negative common factor) so that the leading coefficient in parentheses is positive, then factor:\n\n$$-6x^{2} + x + 2 = -(6x^{2} - x - 2) = -(2x + 1)(3x - 2)$$",
        "提出 $-1$（或负的公因数），使括号内首项系数为正，再分解：\n\n$$-6x^{2} + x + 2 = -(6x^{2} - x - 2) = -(2x + 1)(3x - 2)$$",
      ),
      generate(rng) {
        const k = rng.pick([-1, -1, -1, -2]);
        const [p, q, r, s] = drawBinomials(rng, 1, 2, 7);
        const expr = quad(k * p * r, k * (p * s + q * r), k * q * s);
        const inner = quad(p * r, p * s + q * r, q * s);
        const answer = `${front(k)}${lf(p, q)}${lf(r, s)}`;
        return factoredProblem({
          prompt: factorPrompt(expr),
          answer,
          wrong: [`${front(-k)}${lf(p, q)}${lf(r, s)}`, `${front(k)}${lf(p, -q)}${lf(r, -s)}`, `${front(k)}${lf(p, s)}${lf(r, q)}`],
          solution: t(
            `Take out $${k}$, changing the sign of every term, then factor the trinomial:${steps(`${expr} = ${front(k)}(${inner}) = ${answer}`)}`,
            `提出 $${k}$，括号内每一项都变号，再分解三项式：${steps(`${expr} = ${front(k)}(${inner}) = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "two-variables",
      title: t("Two variables", "含两个变量"),
      explanation: t(
        "For $ax^{2} + bxy + cy^{2}$, factor as if $y$ were $1$, then put $y$ after the constants of the factors:\n\n$$6x^{2} - 7xy - 3y^{2} = (2x - 3y)(3x + y)$$\n\nCheck the middle term: $2x \\cdot y + (-3y) \\cdot 3x = -7xy$.",
        "对 $ax^{2} + bxy + cy^{2}$，先把 $y$ 当作 $1$ 来分解，再在各因式的常数后面写上 $y$：\n\n$$6x^{2} - 7xy - 3y^{2} = (2x - 3y)(3x + y)$$\n\n检验中间项：$2x \\cdot y + (-3y) \\cdot 3x = -7xy$。",
      ),
      generate(rng) {
        const [p, q, r, s] = drawBinomials(rng, 1, 2, 7);
        const expr = poly([p * r, "x^{2}"], [p * s + q * r, "xy"], [q * s, "y^{2}"]);
        const answer = `${lf2(p, q)}${lf2(r, s)}`;
        return factoredProblem({
          prompt: factorPrompt(expr),
          answer,
          wrong: [`${lf2(p, s)}${lf2(r, q)}`, `${lf2(p, -q)}${lf2(r, -s)}`, `${lf(p, q)}${lf(r, s, "y")}`],
          solution: t(
            `Factor $${quad(p * r, p * s + q * r, q * s)} = ${lf(p, q)}${lf(r, s)}$ as if $y$ were $1$, then write $y$ after the constants:${steps(`${expr} = ${answer}`)}`,
            `把 $y$ 当作 $1$，先分解 $${quad(p * r, p * s + q * r, q * s)} = ${lf(p, q)}${lf(r, s)}$，再在常数后面写上 $y$：${steps(`${expr} = ${answer}`)}`,
          ),
        });
      },
    },
  ],
};

/** factoringTopics are the topics of the factoring module after the greatest common factor of monomials, in teaching order. */
export const factoringTopics: readonly TopicDef[] = [
  factoringPolynomialsUsingGcfs,
  factoringPerfectSquareTrinomials,
  factoringPerfectSquareTrinomialsWithLeadingCoefficients,
  factoringDifferencesOfSquares,
  factoringTrinomials,
  factoringTrinomialsUsingCommonFactors,
  factoringTrinomialsWithLeadingCoefficients,
  furtherFactoringTrinomialsWithLeadingCoefficients,
];
