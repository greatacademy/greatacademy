import type { Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { gcd, linear, poly } from "@ga/subject-math";

import { choiceProblem, factoredProblem, say, steps, withMistakes, yesNo } from "../problems.ts";
import { front, isSquare, lf, listed, mono, pw, quad } from "../solution-kit.ts";

/** lf2 writes the factor (px + qy). */
const lf2 = (p: number, q: number) => `(${poly([p, "x"], [q, "y"])})`;

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

/** paragraphs joins the non-empty paragraphs of a worked solution. */
function paragraphs(...ps: readonly Text[]): Text {
  const join = (l: "en" | "zh-CN") =>
    ps
      .map((p) => p[l].trim())
      .filter((s) => s !== "")
      .join("\n\n");
  return t(join("en"), join("zh-CN"));
}

/** sumOf joins written terms into a sum, turning "+ -a" into "- a": "6x \\cdot 2 - 3". */
const sumOf = (pieces: readonly string[]) =>
  pieces.map((p, i) => (i === 0 ? p : p.startsWith("-") ? ` - ${p.slice(1)}` : ` + ${p}`)).join("");

/** multiplyBack writes the check that a factorization multiplies back out to the polynomial: answer = middle = expr. */
function multiplyBack(answer: string, middle: readonly string[], expr: string): Text {
  const line = [answer, ...middle, expr].filter((x, i, xs) => i === 0 || x !== xs[i - 1]).join(" = ");
  return t(
    `**Check.** Multiply the factors back out:${steps(line)}This is the polynomial we started with.`,
    `**检验。** 把因式乘回去：${steps(line)}正是原来的多项式。`,
  );
}

/** gcfSteps writes the steps of factoring out a greatest common factor g: each term divided by g, the factored form, and the check. */
function gcfSteps(
  g: string,
  terms: readonly string[],
  quotients: readonly string[],
  expr: string,
  answer: string,
  negative: boolean,
): Text {
  const lines = terms.map((m, i) => `\\frac{${m}}{${g}} = ${quotients[i]}`);
  const products = quotients.map((q) =>
    q === "1" ? g : q === "-1" ? (g.startsWith("-") ? g.slice(1) : `-${g}`) : `${g} \\cdot ${q.startsWith("-") ? `(${q})` : q}`,
  );
  const gcf = negative ? g.slice(1) : g;
  return paragraphs(
    t(
      `**Step 1: Find the greatest common factor.** Take the greatest common factor of the coefficients and the smallest power of each variable that is in every term: it is $${gcf}$.${negative ? ` The first term is negative, so factor out $${g}$ instead, which leaves the first term in parentheses positive.` : ""}`,
      `**第一步：找出最大公因式。** 取各系数的最大公因数，以及每一项都含有的各变量的最小次幂：是 $${gcf}$。${negative ? `第一项是负的，所以改为提出 $${g}$，使括号内第一项为正。` : ""}`,
    ),
    t(
      `**Step 2: Divide each term by it.** Each term gives one term in the parentheses, signs included:${steps(...lines)}So${steps(`${expr} = ${answer}`)}`,
      `**第二步：用它去除每一项。** 每一项在括号里留下一项，连同符号：${steps(...lines)}所以${steps(`${expr} = ${answer}`)}`,
    ),
    multiplyBack(answer, [sumOf(products)], expr),
  );
}

/** trinomialPairs writes, with write, up to two factorizations from the other factor pairs of m·n: the misreadings of x² + bx + mn. */
function trinomialPairs(m: number, n: number, write: (d: number, e: number) => string): string[] {
  return factorPairs(m * n)
    .filter(([d]) => d !== m && d !== n && d !== -m && d !== -n)
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
  encompasses: [{ topic: "greatest-common-factor-of-monomials", weight: 0.6 }],
  xp: 14,
  standards: ["CCSS.HSA.SSE.A.2"],
  intro: t(
    `The distributive law multiplies a factor into a sum: $6x^{2}(2x + 3) = 12x^{3} + 18x^{2}$. **Factoring** runs it backwards. Given $12x^{3} + 18x^{2}$, we look for the factor that every term shares, the greatest common factor of the terms, which we already know how to find: here $6x^{2}$. Dividing each term by it leaves $2x$ and $3$, so

$$12x^{3} + 18x^{2} = 6x^{2}(2x + 3)$$

A product is often more useful than a sum: it shows what the polynomial is a multiple of, and later it lets us solve equations and simplify fractions.

In this lesson we take the greatest common factor out of binomials, trinomials and polynomials in two variables, and take out a common factor that is a whole binomial.`,
    `分配律把一个因式乘进和里：$6x^{2}(2x + 3) = 12x^{3} + 18x^{2}$。**因式分解**是倒过来做。给出 $12x^{3} + 18x^{2}$，我们找每一项都有的因式，即各项的最大公因式，这我们已经会求：这里是 $6x^{2}$。用它去除每一项，剩下 $2x$ 和 $3$，所以

$$12x^{3} + 18x^{2} = 6x^{2}(2x + 3)$$

乘积往往比和更有用：它说明这个多项式是谁的倍数，以后还能用来解方程、化简分式。

这节课我们从二项式、三项式和含两个变量的多项式中提取最大公因式，还要提取一个完整的二项式公因式。`,
  ),
  knowledgePoints: [
    {
      id: "binomials",
      title: t("Factoring out the GCF of a binomial", "提取二项式的最大公因式"),
      explanation: t(
        `**Factoring** undoes the distributive law: it writes a polynomial as a product. Find the greatest common factor (GCF) of the terms, divide each term by it, and write the quotients in parentheses after it. Each quotient is what the GCF must be multiplied by to give that term:

$$12x^{3} + 18x^{2} = 6x^{2} \\cdot 2x + 6x^{2} \\cdot 3 = 6x^{2}(2x + 3)$$

Distributing gives back $12x^{3} + 18x^{2}$, which checks the result. If the first term is negative, factor out the negative of the GCF, so that the first term in parentheses is positive: $-4x^{2} + 10x = -2x(2x - 5)$. A polynomial is factored **completely** when no factor can be factored further.

> **Watch out.** Take out the whole GCF: $3(4x^{3} + 6x^{2})$ and $x^{2}(12x + 18)$ are true but not complete, since what is in parentheses still has a common factor. Divide the powers too: $\\frac{12x^{3}}{6x^{2}} = 2x$, not $2x^{3}$. And when a negative factor comes out, every sign inside changes: $-4x^{2} + 10x$ is $-2x(2x - 5)$, not $-2x(2x + 5)$.`,
        `**因式分解**是分配律的逆过程：把多项式写成乘积。先找出各项的最大公因式，用它去除每一项，再把商写在它后面的括号里。每个商就是公因式要乘上多少才得到那一项：

$$12x^{3} + 18x^{2} = 6x^{2} \\cdot 2x + 6x^{2} \\cdot 3 = 6x^{2}(2x + 3)$$

用分配律乘回去得 $12x^{3} + 18x^{2}$，这就检验了结果。如果第一项是负的，就提出最大公因式的相反数，使括号内第一项为正：$-4x^{2} + 10x = -2x(2x - 5)$。当每个因式都不能再分解时，多项式才算**彻底**分解。

> **注意。** 要提出整个最大公因式：$3(4x^{3} + 6x^{2})$ 和 $x^{2}(12x + 18)$ 虽然成立，但括号里还有公因式，没有分解彻底。幂也要相除：$\\frac{12x^{3}}{6x^{2}} = 2x$，不是 $2x^{3}$。提出负因式时，括号里每一项都变号：$-4x^{2} + 10x$ 是 $-2x(2x - 5)$，不是 $-2x(2x + 5)$。`,
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
        `The GCF must divide **every** term, so take the greatest common factor of all the coefficients and the smallest power of $x$ among all the terms. In $6x^{4} - 9x^{3} + 15x^{2}$, the coefficients $6$, $9$ and $15$ share $3$, and the smallest power is $x^{2}$:

$$6x^{4} - 9x^{3} + 15x^{2} = 3x^{2}(2x^{2} - 3x + 5)$$

The parentheses keep one term for each term of the original polynomial, here three, because each term is the GCF times one of them. A term equal to the GCF leaves $1$: $2x^{2} + 6x + 2 = 2(x^{2} + 3x + 1)$.

> **Watch out.** Do not lose a term: $2x^{2} + 6x + 2$ is not $2(x^{2} + 3x)$, since $\\frac{2}{2} = 1$, not $0$. Use the smallest power of $x$, or the powers left inside still share a factor of $x$. Take the GCF of all three coefficients, not just two. And divide each sign along with its term: $-9x^{3}$ gives $-3x$.`,
        `最大公因式必须整除**每一**项，所以取所有系数的最大公因数，以及所有项中 $x$ 的最小次幂。在 $6x^{4} - 9x^{3} + 15x^{2}$ 中，系数 $6$、$9$、$15$ 的公因数是 $3$，最小次幂是 $x^{2}$：

$$6x^{4} - 9x^{3} + 15x^{2} = 3x^{2}(2x^{2} - 3x + 5)$$

括号里的项数与原多项式相同，这里是三项，因为每一项都是公因式乘以括号里的一项。与公因式相等的项除完剩下 $1$：$2x^{2} + 6x + 2 = 2(x^{2} + 3x + 1)$。

> **注意。** 不要丢项：$2x^{2} + 6x + 2$ 不是 $2(x^{2} + 3x)$，因为 $\\frac{2}{2} = 1$，不是 $0$。要用 $x$ 的最小次幂，否则括号里的各项还有公因式 $x$。要取三个系数的最大公因数，不是只看两个。符号随项一起除：$-9x^{3}$ 得 $-3x$。`,
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
        `With two variables, the GCF takes the smallest power of each variable that appears in every term, together with the greatest common factor of the coefficients. In $8x^{3}y^{2} - 12xy^{3}$, the coefficients share $4$, the smaller power of $x$ is $x$, and of $y$ it is $y^{2}$:

$$8x^{3}y^{2} - 12xy^{3} = 4xy^{2}(2x^{2} - 3y)$$

The quotients show it: $\\frac{8x^{3}y^{2}}{4xy^{2}} = 2x^{2}$ and $\\frac{-12xy^{3}}{4xy^{2}} = -3y$, and they share no factor.

> **Watch out.** Take out both variables: $4x(2x^{2}y^{2} - 3y^{3})$ leaves $y^{2}$ in both terms inside. Use the smaller power of each, not the larger: $4x^{3}y^{3}$ does not divide $8x^{3}y^{2}$. And keep the sign with its term: the second term inside is $-3y$, not $3y$.`,
        `含两个变量时，最大公因式取各系数的最大公因数，以及每一项都含有的各变量的最小次幂。在 $8x^{3}y^{2} - 12xy^{3}$ 中，系数的公因数是 $4$，$x$ 的较小次幂是 $x$，$y$ 的是 $y^{2}$：

$$8x^{3}y^{2} - 12xy^{3} = 4xy^{2}(2x^{2} - 3y)$$

从商可以看出：$\\frac{8x^{3}y^{2}}{4xy^{2}} = 2x^{2}$，$\\frac{-12xy^{3}}{4xy^{2}} = -3y$，两者没有公因式。

> **注意。** 两个变量都要提出：$4x(2x^{2}y^{2} - 3y^{3})$ 括号里两项还都含 $y^{2}$。每个变量取较小的次幂，不是较大的：$4x^{3}y^{3}$ 不能整除 $8x^{3}y^{2}$。符号随项保留：括号里第二项是 $-3y$，不是 $3y$。`,
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
        `A common factor can be a whole binomial. In $3x(x - 4) + 5(x - 4)$ both terms are multiples of $(x - 4)$: the first is $3x$ of them and the second $5$. Together that is $3x + 5$ of them, which is the distributive law read backwards:

$$3x(x - 4) + 5(x - 4) = (x - 4)(3x + 5)$$

The sign in front of a term belongs to what is left: $2x(x + 1) - 7(x + 1) = (x + 1)(2x - 7)$.

> **Watch out.** Keep the sign with its term: $2x(x + 1) - 7(x + 1)$ is $(x + 1)(2x - 7)$, not $(x + 1)(2x + 7)$. A term that is just the binomial leaves $1$: $x(x + 6) + (x + 6) = (x + 6)(x + 1)$, because the second term is one $(x + 6)$, not zero. And the common factor appears once in the product, not squared.`,
        `公因式也可以是一个完整的二项式。在 $3x(x - 4) + 5(x - 4)$ 中，两项都是 $(x - 4)$ 的倍数：第一项是 $3x$ 个，第二项是 $5$ 个，合起来是 $3x + 5$ 个，这就是倒过来读的分配律：

$$3x(x - 4) + 5(x - 4) = (x - 4)(3x + 5)$$

项前面的符号属于剩下的部分：$2x(x + 1) - 7(x + 1) = (x + 1)(2x - 7)$。

> **注意。** 符号随项保留：$2x(x + 1) - 7(x + 1)$ 是 $(x + 1)(2x - 7)$，不是 $(x + 1)(2x + 7)$。只有二项式本身的那一项剩下 $1$：$x(x + 6) + (x + 6) = (x + 6)(x + 1)$，因为第二项是一个 $(x + 6)$，不是零个。公因式在乘积中只出现一次，不是平方。`,
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
        const xFirst = rng.bool(0.75);
        const expr = xFirst ? `${xTerm} ${b < 0 ? "-" : "+"} ${cTerm}` : `${b < 0 ? "-" : ""}${cTerm} + ${xTerm}`;
        const xPart = [
          [a * p, "x^{2}"],
          [a * m, "x"],
        ] as const;
        const cPart = [
          [b * p, "x"],
          [b * m, ""],
        ] as const;
        const expanded = quad(a * p, a * m + b * p, b * m);
        const answer = `${binom}${lf(a, b)}`;
        return factoredProblem({
          prompt: factorPrompt(expr),
          answer,
          wrong: [`${binom}${lf(a, -b)}`, `${lf(p, -m)}${lf(a, b)}`, `${binom}${lf(a, 0)}`, `${binom}^{2}${lf(a, b)}`],
          solution: paragraphs(
            t(
              `**Step 1: Spot the common factor.** Both terms contain the factor $${binom}$: one is $${coef(a)}x$ times it and the other $${b}$ times it.`,
              `**第一步：找出公因式。** 两项都含有因式 $${binom}$：一项是它的 $${coef(a)}x$ 倍，另一项是它的 $${b}$ 倍。`,
            ),
            t(
              `**Step 2: Factor it out.** Write it once, and in the second bracket what is left of each term, with its sign:${steps(`${expr} = ${answer}`)}`,
              `**第二步：提出公因式。** 公因式只写一次，第二个括号里写每一项剩下的部分（连同符号）：${steps(`${expr} = ${answer}`)}`,
            ),
            t(
              `**Check.** Multiply out both forms. The question gives${steps(`${expr} = ${poly(...(xFirst ? [...xPart, ...cPart] : [...cPart, ...xPart]))} = ${expanded}`)}and the answer gives${steps(`${answer} = ${expanded}`)}They agree.`,
              `**检验。** 把两种形式都乘开。原式得${steps(`${expr} = ${poly(...(xFirst ? [...xPart, ...cPart] : [...cPart, ...xPart]))} = ${expanded}`)}结果得${steps(`${answer} = ${expanded}`)}两者相同。`,
            ),
          ),
        });
      },
    },
  ],
};

/** sq writes the square of a root for a worked solution: "x^{2}", "7^{2}", "(3x)^{2}". */
const sq = (s: string) => (/^([a-z]|\d+)$/.test(s) ? `${s}^{2}` : `(${s})^{2}`);

/** isSq writes "9x^{2} = (3x)^{2}", or just "x^{2}" when the term is written as the square already. */
const isSq = (term: string, root: string) => (term === sq(root) ? term : `${term} = ${sq(root)}`);

/**
 * pstSolution writes the steps of factoring a perfect square trinomial: the roots a and b of the outer terms aSq and bSq,
 * the test of the middle term mid, and the square (a ± b)².
 */
function pstSolution(expr: string, aSq: string, a: string, bSq: string, b: string, mid: string, answer: string): Text {
  const negative = mid.startsWith("-");
  const size = negative ? mid.slice(1) : mid;
  const line = steps(`${expr} = ${sq(a)} ${negative ? "-" : "+"} 2 \\cdot ${a} \\cdot ${b} + ${sq(b)} = ${answer}`);
  return paragraphs(
    t(
      `**Step 1: Find the roots of the outer terms.** Both are squares: $${isSq(aSq, a)}$ and $${isSq(bSq, b)}$. So the roots are $${a}$ and $${b}$.`,
      `**第一步：求首末两项的平方根。** 两项都是平方：$${isSq(aSq, a)}$，$${isSq(bSq, b)}$。所以平方根是 $${a}$ 和 $${b}$。`,
    ),
    t(
      `**Step 2: Test the middle term.** Twice the product of the roots is $2 \\cdot ${a} \\cdot ${b} = ${size}$, and the middle term is $${mid}$, so the trinomial is the square of ${negative ? "a difference" : "a sum"}:${line}`,
      `**第二步：检验中间项。** 两个平方根之积的两倍是 $2 \\cdot ${a} \\cdot ${b} = ${size}$，中间项是 $${mid}$，所以这个三项式是两数${negative ? "差" : "和"}的平方：${line}`,
    ),
  );
}

/** squareCheck writes the check of a perfect square at a point where its roots take the values A and B (A + B ≠ 0). */
function squareCheck(where: Text, A: number, B: number, k = 1): Text {
  const n = k * (A + B) ** 2;
  const sum = `${A * A} ${A * B < 0 ? "-" : "+"} ${Math.abs(2 * A * B)} + ${B * B}`;
  const base = A + B < 0 ? `(${A + B})` : String(A + B);
  const left = k === 1 ? `${sum} = ${n}` : `${k === -1 ? `-(${sum})` : `${k}(${sum})`} = ${n}`;
  const right = k === 1 ? `${base}^{2} = ${n}` : `${k === -1 ? "-" : `${k} \\cdot `}${base}^{2} = ${n}`;
  return t(
    `**Check.** Put ${where.en} into both forms. The question gives $${left}$, and the answer gives $${right}$. They agree.`,
    `**检验。** 把 ${where["zh-CN"]} 代入两种形式。原式得 $${left}$，结果得 $${right}$，两者相同。`,
  );
}

/** firstFit is the first of 1, 2, 3 at which f is not zero. */
const firstFit = (f: (u: number) => number) => [1, 2, 3].find((u) => f(u) !== 0) ?? 1;

export const factoringPerfectSquareTrinomials: TopicDef = {
  id: "factoring-perfect-square-trinomials",
  title: t("Factoring Perfect Square Trinomials", "完全平方三项式的因式分解"),
  summary: t(
    "Recognize trinomials of the form $a^{2} \\pm 2ab + b^{2}$ and factor them as $(a \\pm b)^{2}$.",
    "识别形如 $a^{2} \\pm 2ab + b^{2}$ 的三项式，并分解为 $(a \\pm b)^{2}$。",
  ),
  prerequisites: ["squaring-binomials", "factoring-polynomials-using-gcfs"],
  encompasses: [],
  xp: 12,
  standards: ["CCSS.HSA.SSE.A.2"],
  intro: t(
    `Squaring a binomial gives a trinomial with a recognizable shape: $(x + 5)^{2} = x^{2} + 10x + 25$. Its first and last terms are squares, and its middle term is twice the product of their roots, $2 \\cdot x \\cdot 5 = 10x$. A trinomial of this shape is a **perfect square trinomial**, and factoring it is the square formula read backwards. In $x^{2} - 14x + 49$, the outer terms are the squares of $x$ and $7$, and the middle term is $-2 \\cdot x \\cdot 7$, so

$$x^{2} - 14x + 49 = (x - 7)^{2}$$

In this lesson we recognize perfect square trinomials, factor them when the leading coefficient is $1$, and factor them in two variables.`,
    `二项式的平方是一个形状很好认的三项式：$(x + 5)^{2} = x^{2} + 10x + 25$。它的首末两项都是平方，中间项是两个平方根之积的两倍，$2 \\cdot x \\cdot 5 = 10x$。这种形状的三项式叫**完全平方三项式**，分解它就是把平方公式倒过来读。在 $x^{2} - 14x + 49$ 中，首末两项是 $x$ 和 $7$ 的平方，中间项是 $-2 \\cdot x \\cdot 7$，所以

$$x^{2} - 14x + 49 = (x - 7)^{2}$$

这节课我们识别完全平方三项式，分解首项系数为 $1$ 的完全平方三项式，以及含两个变量的完全平方三项式。`,
  ),
  knowledgePoints: [
    {
      id: "recognizing",
      title: t("Recognizing perfect square trinomials", "识别完全平方三项式"),
      explanation: t(
        `Read the square formulas backwards:

$$a^{2} + 2ab + b^{2} = (a + b)^{2} \\qquad a^{2} - 2ab + b^{2} = (a - b)^{2}$$

In $(x + h)^{2} = x^{2} + 2hx + h^{2}$ the coefficient of $x$ is $2h$, so half of it is $h$, and the constant is $h^{2}$. A trinomial $x^{2} + bx + c$ is therefore a **perfect square trinomial** exactly when its constant term is the square of half the coefficient of $x$: $c = \\left(\\frac{b}{2}\\right)^{2}$. For $x^{2} - 10x + 25$, half of $-10$ is $-5$ and $(-5)^{2} = 25$, so it is $(x - 5)^{2}$.

> **Watch out.** Test with half the middle coefficient, not the whole of it: $x^{2} + 5x + 25$ is not a perfect square, because $\\left(\\frac{5}{2}\\right)^{2} \\neq 25$; its middle term would have to be $10x$. A square is never negative, so $x^{2} + 10x - 25$ is not one either, even though $25 = 5^{2}$.`,
        `把平方公式倒过来读：

$$a^{2} + 2ab + b^{2} = (a + b)^{2} \\qquad a^{2} - 2ab + b^{2} = (a - b)^{2}$$

在 $(x + h)^{2} = x^{2} + 2hx + h^{2}$ 中，$x$ 的系数是 $2h$，它的一半是 $h$，常数项是 $h^{2}$。所以三项式 $x^{2} + bx + c$ 是**完全平方三项式**，当且仅当常数项等于 $x$ 的系数一半的平方：$c = \\left(\\frac{b}{2}\\right)^{2}$。对 $x^{2} - 10x + 25$，$-10$ 的一半是 $-5$，$(-5)^{2} = 25$，所以它是 $(x - 5)^{2}$。

> **注意。** 要用中间项系数的一半来检验，不是整个系数：$x^{2} + 5x + 25$ 不是完全平方，因为 $\\left(\\frac{5}{2}\\right)^{2} \\neq 25$；它的中间项应为 $10x$。平方不会是负数，所以 $x^{2} + 10x - 25$ 也不是，尽管 $25 = 5^{2}$。`,
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
            ? paragraphs(
                t(
                  `Half the coefficient of $x$ is $${half}$, and its square is $${half < 0 ? `(${half})` : half}^{2} = ${c}$.`,
                  `$x$ 的系数的一半是 $${half}$，它的平方是 $${half < 0 ? `(${half})` : half}^{2} = ${c}$。`,
                ),
                t(
                  `That is the constant term, so the trinomial is a perfect square:${steps(`${expr} = (${linear(1, half)})^{2}`)}`,
                  `这正是常数项，所以这个三项式是完全平方：${steps(`${expr} = (${linear(1, half)})^{2}`)}`,
                ),
              )
            : paragraphs(
                t(
                  `A perfect square $(x + h)^{2} = x^{2} + 2hx + h^{2}$ has as its constant the square of half the coefficient of $x$. Here that would be $\\left(\\frac{${b}}{2}\\right)^{2} = ${halfSq}$.`,
                  `完全平方 $(x + h)^{2} = x^{2} + 2hx + h^{2}$ 的常数项是 $x$ 的系数一半的平方。这里应为 $\\left(\\frac{${b}}{2}\\right)^{2} = ${halfSq}$。`,
                ),
                c < 0
                  ? t(
                      `The constant term is $${c}$, which is negative, and a square never is. So it is not a perfect square trinomial.`,
                      `常数项是 $${c}$，是负数，而平方不会是负数。所以它不是完全平方三项式。`,
                    )
                  : t(
                      `The constant term is $${c}$, not $${halfSq}$. So it is not a perfect square trinomial.`,
                      `常数项是 $${c}$，不是 $${halfSq}$。所以它不是完全平方三项式。`,
                    ),
              ),
        });
      },
    },
    {
      id: "monic",
      title: t("Factoring $x^{2} \\pm 2ax + a^{2}$", "分解 $x^{2} \\pm 2ax + a^{2}$"),
      explanation: t(
        `To factor a perfect square trinomial, take the square roots of the first and last terms, test that the middle term is twice their product, and use the sign of the middle term:

$$x^{2} - 14x + 49 = x^{2} - 2 \\cdot x \\cdot 7 + 7^{2} = (x - 7)^{2}$$

The test matters: $x^{2} + 13x + 49$ has the same outer terms but is not a square, since $2 \\cdot x \\cdot 7 = 14x$.

> **Watch out.** The sign in the binomial is the sign of the middle term: $x^{2} - 14x + 49 = (x - 7)^{2}$, not $(x + 7)^{2}$. The root of $49$ is $7$, not $49$ or $14$. And $(x + 7)(x - 7)$ is $x^{2} - 49$, with no middle term, so it is not the answer.`,
        `分解完全平方三项式时，取首末两项的平方根，检验中间项是否等于它们之积的两倍，符号取中间项的符号：

$$x^{2} - 14x + 49 = x^{2} - 2 \\cdot x \\cdot 7 + 7^{2} = (x - 7)^{2}$$

检验很重要：$x^{2} + 13x + 49$ 的首末两项相同，但不是平方，因为 $2 \\cdot x \\cdot 7 = 14x$。

> **注意。** 二项式中的符号是中间项的符号：$x^{2} - 14x + 49 = (x - 7)^{2}$，不是 $(x + 7)^{2}$。$49$ 的平方根是 $7$，不是 $49$ 或 $14$。$(x + 7)(x - 7)$ 是 $x^{2} - 49$，没有中间项，不是答案。`,
      ),
      generate(rng) {
        const a = rng.int(1, 12);
        const s = rng.sign();
        const v = rng.pick(["x", "y", "t"]);
        const reversed = rng.bool(0.25);
        const expr = reversed ? poly([a * a, ""], [2 * s * a, v], [1, `${v}^{2}`]) : quad(1, 2 * s * a, a * a, v);
        const answer = `(${linear(1, s * a, v)})^{2}`;
        const at = firstFit((u) => u + s * a);
        return factoredProblem({
          prompt: factorPrompt(expr),
          answer,
          wrong: [
            `${lf(1, s * a, v)}${lf(1, -s * a, v)}`,
            `(${linear(1, -s * a, v)})^{2}`,
            `(${linear(1, 2 * s * a, v)})^{2}`,
            `(${linear(1, s * a * a, v)})^{2}`,
          ],
          solution: paragraphs(
            reversed
              ? pstSolution(expr, String(a * a), String(a), `${v}^{2}`, v, poly([2 * s * a, v]), answer)
              : pstSolution(expr, `${v}^{2}`, v, String(a * a), String(a), poly([2 * s * a, v]), answer),
            squareCheck(t(`$${v} = ${at}$`, `$${v} = ${at}$`), at, s * a),
          ),
        });
      },
    },
    {
      id: "two-variables",
      title: t("Perfect squares in two variables", "含两个变量的完全平方"),
      explanation: t(
        `A trinomial is a perfect square when its first and last terms are squares and its middle term is twice the product of their roots. A root may contain a variable: $9b^{2} = (3b)^{2}$. So

$$a^{2} + 6ab + 9b^{2} = a^{2} + 2 \\cdot a \\cdot 3b + (3b)^{2} = (a + 3b)^{2}$$

and the middle term $6ab$ contains both variables, as the product of the roots must.

> **Watch out.** Keep the variable in the second root, and take the root of its coefficient: $9b^{2}$ is $(3b)^{2}$, so the answer is $(a + 3b)^{2}$, not $(a + 9b)^{2}$. The sign is the sign of the middle term. And $(a + 3b)(a - 3b)$ has no middle term at all.`,
        `如果一个三项式的首末两项都是平方，并且中间项等于它们的平方根之积的两倍，它就是完全平方。平方根可以含变量：$9b^{2} = (3b)^{2}$。所以

$$a^{2} + 6ab + 9b^{2} = a^{2} + 2 \\cdot a \\cdot 3b + (3b)^{2} = (a + 3b)^{2}$$

中间项 $6ab$ 同时含两个变量，正如两个平方根之积应有的那样。

> **注意。** 第二个平方根要保留变量，系数也要开方：$9b^{2}$ 是 $(3b)^{2}$，所以结果是 $(a + 3b)^{2}$，不是 $(a + 9b)^{2}$。符号取中间项的符号。$(a + 3b)(a - 3b)$ 根本没有中间项。`,
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
        const at = firstFit((x) => x + s * k);
        return factoredProblem({
          prompt: factorPrompt(expr),
          answer,
          wrong: [`(${inner(s * k)})(${inner(-s * k)})`, `(${inner(-s * k)})^{2}`, `(${inner(s * k * k)})^{2}`],
          solution: paragraphs(
            pstSolution(expr, `${u}^{2}`, u, poly([k * k, `${w}^{2}`]), poly([k, w]), poly([2 * s * k, `${u}${w}`]), answer),
            squareCheck(t(`$${u} = ${at}$ and $${w} = 1$`, `$${u} = ${at}$、$${w} = 1$`), at, s * k),
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
  intro: t(
    `So far the perfect squares began with $x^{2}$. The same pattern works when the first term is a square with a coefficient, such as $9x^{2} = (3x)^{2}$: the roots are whole terms, coefficient included. In $9x^{2} - 12x + 4$ the outer terms are the squares of $3x$ and $2$, and twice their product is $2 \\cdot 3x \\cdot 2 = 12x$, the middle term without its sign, so

$$9x^{2} - 12x + 4 = (3x - 2)^{2}$$

Sometimes the square is hidden behind a common factor: $2x^{2} + 12x + 18$ has no square terms, but it is $2(x^{2} + 6x + 9) = 2(x + 3)^{2}$.

In this lesson we factor perfect squares with a square leading coefficient, take out a common factor first, and factor perfect squares in two variables.`,
    `前面的完全平方都以 $x^{2}$ 开头。第一项是带系数的平方，例如 $9x^{2} = (3x)^{2}$ 时，同样的规律也成立：平方根是包括系数在内的整项。在 $9x^{2} - 12x + 4$ 中，首末两项是 $3x$ 和 $2$ 的平方，它们之积的两倍是 $2 \\cdot 3x \\cdot 2 = 12x$，正是不计符号的中间项，所以

$$9x^{2} - 12x + 4 = (3x - 2)^{2}$$

有时平方藏在公因式后面：$2x^{2} + 12x + 18$ 没有平方项，但它等于 $2(x^{2} + 6x + 9) = 2(x + 3)^{2}$。

这节课我们分解首项系数是平方数的完全平方，先提取公因式再分解，以及分解含两个变量的完全平方。`,
  ),
  knowledgePoints: [
    {
      id: "square-leading-coefficient",
      title: t("A square leading coefficient", "首项系数是平方数"),
      explanation: t(
        `When the first term is a square such as $9x^{2} = (3x)^{2}$, its root is the whole term $3x$, because $(3x)^{2} = 3^{2}x^{2} = 9x^{2}$. Take the roots of both outer terms and test the middle term:

$$9x^{2} - 12x + 4 = (3x)^{2} - 2 \\cdot 3x \\cdot 2 + 2^{2} = (3x - 2)^{2}$$

If the middle term is not twice the product of the two roots, the trinomial is not a perfect square: $9x^{2} + 6x + 4$ is not one, since $2 \\cdot 3x \\cdot 2 = 12x$.

> **Watch out.** Take the root of the coefficient too: $9x^{2} = (3x)^{2}$, so the factor is $(3x - 2)$, not $(9x - 2)$; and the root of $4$ is $2$, not $4$. The sign inside is the sign of the middle term. And $(3x + 2)(3x - 2)$ is $9x^{2} - 4$, not a perfect square.`,
        `当第一项是平方，例如 $9x^{2} = (3x)^{2}$ 时，它的平方根是整项 $3x$，因为 $(3x)^{2} = 3^{2}x^{2} = 9x^{2}$。取首末两项的平方根，再检验中间项：

$$9x^{2} - 12x + 4 = (3x)^{2} - 2 \\cdot 3x \\cdot 2 + 2^{2} = (3x - 2)^{2}$$

如果中间项不等于两个平方根之积的两倍，这个三项式就不是完全平方：$9x^{2} + 6x + 4$ 不是，因为 $2 \\cdot 3x \\cdot 2 = 12x$。

> **注意。** 系数也要开方：$9x^{2} = (3x)^{2}$，所以因式是 $(3x - 2)$，不是 $(9x - 2)$；$4$ 的平方根是 $2$，不是 $4$。括号里的符号取中间项的符号。$(3x + 2)(3x - 2)$ 是 $9x^{2} - 4$，不是完全平方。`,
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
          solution: paragraphs(
            pstSolution(expr, mono(p * p, 2), mono(p, 1), String(q * q), String(Math.abs(q)), mono(2 * p * q, 1), answer),
            squareCheck(t("$x = 1$", "$x = 1$"), p, q),
          ),
        });
      },
    },
    {
      id: "common-factor-first",
      title: t("Taking out a common factor first", "先提取公因式"),
      explanation: t(
        `Always look for a common factor first. $2x^{2} + 12x + 18$ is not a perfect square, since $2x^{2}$ and $18$ are not squares, but its terms share $2$, and taking it out leaves one:

$$2x^{2} + 12x + 18 = 2(x^{2} + 6x + 9) = 2(x + 3)^{2}$$

With a negative leading coefficient, take out a negative factor, so that the trinomial in parentheses starts with a positive square: $-4x^{2} + 4x - 1 = -(4x^{2} - 4x + 1) = -(2x - 1)^{2}$.

> **Watch out.** Finish the job: $2(x^{2} + 6x + 9)$ is not factored completely. Taking out a negative factor changes every sign inside: $-4x^{2} + 4x - 1$ is $-(2x - 1)^{2}$, not $(2x - 1)^{2}$ and not $-(2x + 1)^{2}$. And keep the square: $2(x + 3)(x - 3)$ is $2x^{2} - 18$.`,
        `总是先找公因式。$2x^{2} + 12x + 18$ 不是完全平方，因为 $2x^{2}$ 和 $18$ 都不是平方，但各项有公因数 $2$，提出后括号内就是完全平方：

$$2x^{2} + 12x + 18 = 2(x^{2} + 6x + 9) = 2(x + 3)^{2}$$

首项系数为负时，提出一个负因数，使括号内的三项式以正的平方开头：$-4x^{2} + 4x - 1 = -(4x^{2} - 4x + 1) = -(2x - 1)^{2}$。

> **注意。** 要分解到底：$2(x^{2} + 6x + 9)$ 没有分解彻底。提出负因数时括号内每一项都变号：$-4x^{2} + 4x - 1$ 是 $-(2x - 1)^{2}$，不是 $(2x - 1)^{2}$，也不是 $-(2x + 1)^{2}$。还要保持平方：$2(x + 3)(x - 3)$ 是 $2x^{2} - 18$。`,
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
        const at = firstFit((u) => p * u + q);
        return factoredProblem({
          prompt: factorPrompt(expr),
          answer,
          wrong: [
            `${front(k)}(${inner})`,
            `${front(k)}${lf(p, q)}${lf(p, -q)}`,
            `${front(k)}(${linear(p, -q)})^{2}`,
            `${front(-k)}(${linear(p, q)})^{2}`,
          ],
          solution: paragraphs(
            t(
              k === -1
                ? `**Step 1: Take out $-1$.** The leading coefficient is negative, so take out $-1$, which changes every sign inside:${steps(`${expr} = ${front(k)}(${inner})`)}`
                : `**Step 1: Take out the common factor.** The coefficients $${k * p * p}$, $${2 * k * p * q}$ and $${k * q * q}$ share $${Math.abs(k)}$${k < 0 ? `; the leading coefficient is negative, so take out $${k}$, which changes every sign inside` : ""}:${steps(`${expr} = ${front(k)}(${inner})`)}`,
              k === -1
                ? `**第一步：提出 $-1$。** 首项系数为负，所以提出 $-1$，括号内每一项都变号：${steps(`${expr} = ${front(k)}(${inner})`)}`
                : `**第一步：提出公因数。** 系数 $${k * p * p}$、$${2 * k * p * q}$、$${k * q * q}$ 的公因数是 $${Math.abs(k)}$${k < 0 ? `；首项系数为负，所以提出 $${k}$，括号内每一项都变号` : ""}：${steps(`${expr} = ${front(k)}(${inner})`)}`,
            ),
            t(
              `**Step 2: Factor the perfect square.** In $${inner}$ the outer terms are the squares of $${mono(p, 1)}$ and $${Math.abs(q)}$, and $2 \\cdot ${mono(p, 1)} \\cdot ${Math.abs(q)} = ${mono(Math.abs(2 * p * q), 1)}$ matches the middle term:${steps(`${front(k)}(${inner}) = ${answer}`)}`,
              `**第二步：分解完全平方。** 在 $${inner}$ 中，首末两项是 $${mono(p, 1)}$ 和 $${Math.abs(q)}$ 的平方，$2 \\cdot ${mono(p, 1)} \\cdot ${Math.abs(q)} = ${mono(Math.abs(2 * p * q), 1)}$ 与中间项相符：${steps(`${front(k)}(${inner}) = ${answer}`)}`,
            ),
            squareCheck(t(`$x = ${at}$`, `$x = ${at}$`), p * at, q, k),
          ),
        });
      },
    },
    {
      id: "two-variables",
      title: t("Two variables", "含两个变量"),
      explanation: t(
        `For a trinomial in $x$ and $y$, the roots of the outer terms are whole terms with their coefficients and variables. Check that the middle term is twice their product:

$$4x^{2} - 20xy + 25y^{2} = (2x)^{2} - 2 \\cdot 2x \\cdot 5y + (5y)^{2} = (2x - 5y)^{2}$$

The middle term contains $xy$ because it comes from the product of a root with $x$ and a root with $y$.

> **Watch out.** Take the roots of the coefficients: $4x^{2} = (2x)^{2}$ and $25y^{2} = (5y)^{2}$, so the answer is not $(4x - 25y)^{2}$. Use the sign of the middle term inside the square. And $(2x + 5y)(2x - 5y)$ is $4x^{2} - 25y^{2}$, with no $xy$ term.`,
        `对含 $x$ 和 $y$ 的三项式，首末两项的平方根是带系数和变量的整项。检验中间项是否为它们之积的两倍：

$$4x^{2} - 20xy + 25y^{2} = (2x)^{2} - 2 \\cdot 2x \\cdot 5y + (5y)^{2} = (2x - 5y)^{2}$$

中间项含 $xy$，因为它来自含 $x$ 的平方根与含 $y$ 的平方根之积。

> **注意。** 系数要开方：$4x^{2} = (2x)^{2}$，$25y^{2} = (5y)^{2}$，所以结果不是 $(4x - 25y)^{2}$。平方里的符号取中间项的符号。$(2x + 5y)(2x - 5y)$ 是 $4x^{2} - 25y^{2}$，没有 $xy$ 项。`,
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
          solution: paragraphs(
            pstSolution(expr, mono(p * p, 2), mono(p, 1), mono(q * q, 0, 2), mono(Math.abs(q), 0, 1), poly([2 * p * q, "xy"]), answer),
            squareCheck(t("$x = 1$ and $y = 1$", "$x = 1$、$y = 1$"), p, q),
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
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSA.SSE.A.2"],
  intro: t(
    `Multiplying a sum by a difference of the same two terms gives a difference of squares, because the middle products cancel: $(x + 7)(x - 7) = x^{2} - 49$. Factoring reads this backwards. Whenever a binomial is one square minus another,

$$a^{2} - b^{2} = (a + b)(a - b)$$

So $x^{2} - 49$, which is $x^{2} - 7^{2}$, factors as $(x + 7)(x - 7)$. The skill is to see each term as a square: $49 = 7^{2}$, $9x^{2} = (3x)^{2}$, $x^{4} = (x^{2})^{2}$.

In this lesson we factor $x^{2} - a^{2}$, differences of squares of terms with coefficients, differences hidden behind a common factor, and differences that factor twice.`,
    `两个数的和乘以它们的差得到平方差，因为中间的乘积相互抵消：$(x + 7)(x - 7) = x^{2} - 49$。因式分解把它倒过来读。只要一个二项式是一个平方减另一个平方，就有

$$a^{2} - b^{2} = (a + b)(a - b)$$

所以 $x^{2} - 49$ 即 $x^{2} - 7^{2}$，分解为 $(x + 7)(x - 7)$。关键是把每一项看成平方：$49 = 7^{2}$，$9x^{2} = (3x)^{2}$，$x^{4} = (x^{2})^{2}$。

这节课我们分解 $x^{2} - a^{2}$、带系数的项的平方差、藏在公因式后面的平方差，以及要分解两次的平方差。`,
  ),
  knowledgePoints: [
    {
      id: "monic",
      title: t("Factoring $x^{2} - a^{2}$", "分解 $x^{2} - a^{2}$"),
      explanation: t(
        `Read the difference of squares formula backwards: a square minus a square factors as the sum times the difference of the square roots, because multiplying them back gives $a^{2} - ab + ab - b^{2}$, and the middle products cancel.

$$a^{2} - b^{2} = (a + b)(a - b) \\qquad x^{2} - 49 = (x + 7)(x - 7)$$

The roots keep their order: $36 - x^{2} = 6^{2} - x^{2} = (6 + x)(6 - x)$.

> **Watch out.** The two factors have opposite signs: $(x - 7)^{2}$ is $x^{2} - 14x + 49$, not $x^{2} - 49$. Keep the order of the roots: $36 - x^{2}$ is $(6 + x)(6 - x)$, while $(x + 6)(x - 6)$ is $x^{2} - 36$. Use the root of the constant, $7$, not $49$. And a **sum** of squares such as $x^{2} + 49$ cannot be factored over the integers.`,
        `把平方差公式倒过来读：一个平方减去另一个平方，等于两个平方根的和乘以它们的差，因为乘回去得 $a^{2} - ab + ab - b^{2}$，中间的乘积相互抵消。

$$a^{2} - b^{2} = (a + b)(a - b) \\qquad x^{2} - 49 = (x + 7)(x - 7)$$

平方根的顺序要保持：$36 - x^{2} = 6^{2} - x^{2} = (6 + x)(6 - x)$。

> **注意。** 两个因式的符号相反：$(x - 7)^{2}$ 是 $x^{2} - 14x + 49$，不是 $x^{2} - 49$。平方根的顺序要保持：$36 - x^{2}$ 是 $(6 + x)(6 - x)$，而 $(x + 6)(x - 6)$ 是 $x^{2} - 36$。用常数的平方根 $7$，不是 $49$。平方**和**，例如 $x^{2} + 49$，在整数范围内不能分解。`,
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
          solution: paragraphs(
            t(
              `**Step 1: Write both terms as squares.** $${a * a} = ${a}^{2}$, so${steps(`${expr} = ${reversed ? `${a}^{2} - ${v}^{2}` : `${v}^{2} - ${a}^{2}`}`)}`,
              `**第一步：把两项写成平方。** $${a * a} = ${a}^{2}$，所以${steps(`${expr} = ${reversed ? `${a}^{2} - ${v}^{2}` : `${v}^{2} - ${a}^{2}`}`)}`,
            ),
            t(
              `**Step 2: Factor the difference of squares.** It is the sum of the roots times their difference, in the same order:${steps(`${expr} = ${answer}`)}`,
              `**第二步：分解平方差。** 等于两个平方根的和乘以它们的差，顺序不变：${steps(`${expr} = ${answer}`)}`,
            ),
            multiplyBack(
              answer,
              [
                reversed
                  ? `${a * a} - ${poly([a, v])} + ${poly([a, v])} - ${v}^{2}`
                  : `${v}^{2} - ${poly([a, v])} + ${poly([a, v])} - ${a * a}`,
              ],
              expr,
            ),
          ),
        });
      },
    },
    {
      id: "squares-of-terms",
      title: t("Squares of terms with coefficients", "带系数的项的平方"),
      explanation: t(
        `A difference of two squares always factors as the sum times the difference of the square roots. First write each term as the square of something. A square may be a whole term, coefficient included, because $(3x)^{2} = 9x^{2}$ and $(5y)^{2} = 25y^{2}$:

$$9x^{2} - 25y^{2} = (3x)^{2} - (5y)^{2} = (3x + 5y)(3x - 5y)$$

> **Watch out.** Take the roots of the coefficients: $9x^{2} - 25y^{2}$ is not $(9x + 25y)(x - y)$. The factors have opposite signs; $(3x - 5y)^{2}$ has a middle term $-30xy$. And both terms must be squares with a minus between them: $9x^{2} + 25y^{2}$ does not factor.`,
        `两个平方之差总能分解成两个平方根之和乘以它们之差。先把每一项写成某个式子的平方。平方可以是包括系数在内的整项，因为 $(3x)^{2} = 9x^{2}$，$(5y)^{2} = 25y^{2}$：

$$9x^{2} - 25y^{2} = (3x)^{2} - (5y)^{2} = (3x + 5y)(3x - 5y)$$

> **注意。** 系数要开方：$9x^{2} - 25y^{2}$ 不是 $(9x + 25y)(x - y)$。两个因式符号相反；$(3x - 5y)^{2}$ 有中间项 $-30xy$。两项都必须是平方，中间是减号：$9x^{2} + 25y^{2}$ 不能分解。`,
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
          solution: paragraphs(
            t(
              `**Step 1: Write both terms as squares.** The roots are $${a}$ and $${b}$:${steps(`${expr} = ${sq(a)} - ${sq(b)}`)}`,
              `**第一步：把两项写成平方。** 平方根是 $${a}$ 和 $${b}$：${steps(`${expr} = ${sq(a)} - ${sq(b)}`)}`,
            ),
            t(
              `**Step 2: Factor the difference of squares.** It is the sum of the roots times their difference:${steps(`${expr} = ${answer}`)}`,
              `**第二步：分解平方差。** 等于两个平方根的和乘以它们的差：${steps(`${expr} = ${answer}`)}`,
            ),
            multiplyBack(answer, [poly([p * p, "x^{2}"], [-p * q, `x${yv}`], [p * q, `x${yv}`], [-q * q, withY ? "y^{2}" : ""])], expr),
          ),
        });
      },
    },
    {
      id: "common-factor-first",
      title: t("Taking out a common factor first", "先提取公因式"),
      explanation: t(
        `Neither $3x^{2}$ nor $75$ is a square, but both are multiples of $3$. Take out the common factor first; what is left may be a difference of squares:

$$3x^{2} - 75 = 3(x^{2} - 25) = 3(x + 5)(x - 5)$$

The common factor can include $x$: $2x^{3} - 18x = 2x(x^{2} - 9) = 2x(x + 3)(x - 3)$.

> **Watch out.** Finish after taking out the factor: $3(x^{2} - 25)$ is not factored completely. Take out the whole common factor first: $(3x + 15)(x - 5)$ is equal, but a factor $3$ is still inside a bracket. When every term contains $x$, take out $x$ as well. And the factors of the difference have opposite signs, not $(x - 5)^{2}$.`,
        `$3x^{2}$ 和 $75$ 都不是平方，但都是 $3$ 的倍数。先提出公因式，剩下的可能是平方差：

$$3x^{2} - 75 = 3(x^{2} - 25) = 3(x + 5)(x - 5)$$

公因式可以含 $x$：$2x^{3} - 18x = 2x(x^{2} - 9) = 2x(x + 3)(x - 3)$。

> **注意。** 提出公因式后还要继续：$3(x^{2} - 25)$ 没有分解彻底。要先提出整个公因式：$(3x + 15)(x - 5)$ 虽然相等，但括号里还有因数 $3$。每一项都含 $x$ 时，$x$ 也要提出。平方差的两个因式符号相反，不是 $(x - 5)^{2}$。`,
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
          solution: paragraphs(
            t(
              `**Step 1: Take out the common factor.** Both terms are multiples of $${mono(k, e)}$:${steps(`${expr} = ${front(k, e)}(${inner})`)}`,
              `**第一步：提出公因式。** 两项都是 $${mono(k, e)}$ 的倍数：${steps(`${expr} = ${front(k, e)}(${inner})`)}`,
            ),
            t(
              `**Step 2: Factor the difference of squares.** $${inner} = ${sq(mono(p, 1))} - ${q}^{2}$, the roots being $${mono(p, 1)}$ and $${q}$:${steps(`${front(k, e)}(${inner}) = ${answer}`)}`,
              `**第二步：分解平方差。** $${inner} = ${sq(mono(p, 1))} - ${q}^{2}$，平方根是 $${mono(p, 1)}$ 和 $${q}$：${steps(`${front(k, e)}(${inner}) = ${answer}`)}`,
            ),
            multiplyBack(answer, [`${front(k, e)}(${inner})`], expr),
          ),
        });
      },
    },
    {
      id: "factoring-twice",
      title: t("Factoring twice", "两次分解"),
      explanation: t(
        `After one step, a factor may itself be a difference of squares. Since $x^{4} = (x^{2})^{2}$ and $16 = 4^{2}$, the first step gives a sum and a difference of $x^{2}$ and $4$, and the difference factors again:

$$x^{4} - 16 = (x^{2} + 4)(x^{2} - 4) = (x^{2} + 4)(x + 2)(x - 2)$$

The sum of squares $x^{2} + 4$ cannot be factored further, so this is complete.

> **Watch out.** Do not stop after one step: $(x^{2} + 4)(x^{2} - 4)$ is not complete. The sum $x^{2} + 4$ does not factor: it is not $(x + 2)^{2}$, which is $x^{2} + 4x + 4$. And $(x + 2)^{2}(x - 2)^{2}$ multiplies out to $x^{4} - 8x^{2} + 16$.`,
        `分解一次之后，某个因式本身可能还是平方差。因为 $x^{4} = (x^{2})^{2}$，$16 = 4^{2}$，第一步得到 $x^{2}$ 与 $4$ 的和与差，而差还能再分解：

$$x^{4} - 16 = (x^{2} + 4)(x^{2} - 4) = (x^{2} + 4)(x + 2)(x - 2)$$

平方和 $x^{2} + 4$ 不能再分解，所以分解完毕。

> **注意。** 不要分解一次就停：$(x^{2} + 4)(x^{2} - 4)$ 没有分解彻底。平方和 $x^{2} + 4$ 不能分解：它不是 $(x + 2)^{2}$，后者是 $x^{2} + 4x + 4$。$(x + 2)^{2}(x - 2)^{2}$ 乘开是 $x^{4} - 8x^{2} + 16$。`,
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
          solution: paragraphs(
            t(
              `**Step 1: Factor the difference of squares.** ${k === 1 ? "The terms are" : `Take out $${k}$ first; the terms left are`} the squares of $${mono(p * p, 2)}$ and $${withY ? mono(q * q, 0, 2) : q * q}$:${steps(`${expr} = ${front(k)}${sum2}${diff2}`)}`,
              `**第一步：分解平方差。** ${k === 1 ? "两项" : `先提出 $${k}$，剩下的两项`}分别是 $${mono(p * p, 2)}$ 和 $${withY ? mono(q * q, 0, 2) : q * q}$ 的平方：${steps(`${expr} = ${front(k)}${sum2}${diff2}`)}`,
            ),
            t(
              `**Step 2: Factor again.** The sum $${sum2}$ cannot be factored, but $${diff2}$ is again a difference of squares, of $${mono(p, 1)}$ and $${withY ? mono(q, 0, 1) : q}$:${steps(`${front(k)}${sum2}${diff2} = ${answer}`)}`,
              `**第二步：再分解一次。** 和 $${sum2}$ 不能分解，但 $${diff2}$ 又是 $${mono(p, 1)}$ 与 $${withY ? mono(q, 0, 1) : q}$ 的平方差：${steps(`${front(k)}${sum2}${diff2} = ${answer}`)}`,
            ),
            multiplyBack(answer, [`${front(k)}${sum2}${diff2}`], expr),
          ),
        });
      },
    },
  ],
};

/** signed writes a number for a sum, in brackets when negative: "3", "(-4)". */
const signedNum = (n: number) => (n < 0 ? `(${n})` : String(n));

/**
 * monicSolution explains x² + bx + c = (x + m)(x + n): the pairs with product c, the one with sum b, and the check.
 * With w = "y" the trinomial is x² + bxy + cy².
 */
function monicSolution(expr: string, m: number, n: number, answer: string, v = "x", w = ""): Text {
  const c = m * n;
  const b = m + n;
  // The number with the larger absolute value has the sign of b, in both cases.
  const shown = factorPairs(c).filter(([, f]) => f > 0 === b > 0);
  const en = listed(shown.map(([d, f]) => `$${d}, ${f}$ (sum $${d + f}$)`)).en;
  const zh = listed(shown.map(([d, f]) => `$${d}, ${f}$（和为 $${d + f}$）`))["zh-CN"];
  const signs =
    c > 0
      ? t(
          `The product $${c}$ is positive, so both numbers have the sign of the middle coefficient $${b}$.`,
          `积 $${c}$ 是正数，所以两个数同号，且与中间项系数 $${b}$ 同号。`,
        )
      : t(
          `The product $${c}$ is negative, so the numbers have opposite signs, and the one with the larger absolute value has the sign of the sum $${b}$.`,
          `积 $${c}$ 是负数，所以两个数异号，绝对值较大的那个与和 $${b}$ 同号。`,
        );
  const expanded = poly([1, `${v}^{2}`], [n, `${v}${w}`], [m, `${v}${w}`], [c, w ? `${w}^{2}` : ""]);
  return paragraphs(
    t(
      `**Step 1: Find two numbers.** We need two numbers with product $${c}$ and sum $${b}$. ${signs.en} ${shown.length === 1 ? `The only such pair is ${en}.` : `The pairs are ${en}. Only $${m}$ and $${n}$ add up to $${b}$.`}`,
      `**第一步：找两个数。** 要找积为 $${c}$、和为 $${b}$ 的两个数。${signs["zh-CN"]}${shown.length === 1 ? `这样的数对只有 ${zh}。` : `数对有 ${zh}。只有 $${m}$ 和 $${n}$ 的和是 $${b}$。`}`,
    ),
    t(
      `**Step 2: Write the factors.** Each number${w ? `, times $${w}$,` : ""} becomes the second term of one factor:${steps(`${expr} = ${answer}`)}`,
      `**第二步：写出因式。** 两个数${w ? `分别乘以 $${w}$，` : "分别"}作为两个因式的第二项：${steps(`${expr} = ${answer}`)}`,
    ),
    multiplyBack(answer, [expanded], expr),
  );
}

/**
 * commonThenMonic explains taking out a common factor g (written gf before brackets) and factoring x² + (m + n)x + mn left,
 * with the check.
 */
function commonThenMonic(expr: string, g: string, gf: string, inner: string, m: number, n: number, answer: string): Text {
  const first =
    g === "-1"
      ? t(
          `**Step 1: Take out $-1$.** The leading coefficient is negative; taking out $-1$ changes every sign inside:${steps(`${expr} = ${gf}(${inner})`)}`,
          `**第一步：提出 $-1$。** 首项系数为负；提出 $-1$，括号内每一项都变号：${steps(`${expr} = ${gf}(${inner})`)}`,
        )
      : t(
          g.startsWith("-")
            ? `**Step 1: Take out $${g}$.** The coefficients share $${g.slice(1)}$ and the leading one is negative, so take out $${g}$, which changes every sign inside:${steps(`${expr} = ${gf}(${inner})`)}`
            : `**Step 1: Take out the common factor.** Every term is a multiple of $${g}$:${steps(`${expr} = ${gf}(${inner})`)}`,
          g.startsWith("-")
            ? `**第一步：提出 $${g}$。** 各系数有公因数 $${g.slice(1)}$，且首项系数为负，所以提出 $${g}$，括号内每一项都变号：${steps(`${expr} = ${gf}(${inner})`)}`
            : `**第一步：提出公因式。** 每一项都是 $${g}$ 的倍数：${steps(`${expr} = ${gf}(${inner})`)}`,
        );
  return paragraphs(
    first,
    t(
      `**Step 2: Factor the trinomial.** Two numbers with product $${m * n}$ and sum $${m + n}$ are $${m}$ and $${n}$:${steps(`${gf}(${inner}) = ${answer}`)}`,
      `**第二步：分解三项式。** 积为 $${m * n}$、和为 $${m + n}$ 的两个数是 $${m}$ 和 $${n}$：${steps(`${gf}(${inner}) = ${answer}`)}`,
    ),
    multiplyBack(answer, [`${gf}(${inner})`], expr),
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
  encompasses: [],
  xp: 15,
  standards: ["CCSS.HSA.SSE.A.2"],
  intro: t(
    `Multiplying two binomials, $(x + 3)(x + 4) = x^{2} + 4x + 3x + 12 = x^{2} + 7x + 12$. The middle coefficient $7$ is the sum $3 + 4$, and the constant $12$ is the product $3 \\cdot 4$. Factoring a trinomial $x^{2} + bx + c$ runs this backwards: find two numbers whose product is $c$ and whose sum is $b$, and they are the constants of the factors. For $x^{2} + 7x + 12$, the pairs with product $12$ are $1, 12$; $2, 6$; $3, 4$, and only $3 + 4 = 7$, so

$$x^{2} + 7x + 12 = (x + 3)(x + 4)$$

In this lesson we factor trinomials with a positive constant term, with a negative one, and in two variables.`,
    `两个二项式相乘：$(x + 3)(x + 4) = x^{2} + 4x + 3x + 12 = x^{2} + 7x + 12$。中间项系数 $7$ 是和 $3 + 4$，常数项 $12$ 是积 $3 \\cdot 4$。分解三项式 $x^{2} + bx + c$ 就是倒过来做：找两个数，积为 $c$，和为 $b$，它们就是两个因式的常数。对 $x^{2} + 7x + 12$，积为 $12$ 的数对有 $1, 12$；$2, 6$；$3, 4$，只有 $3 + 4 = 7$，所以

$$x^{2} + 7x + 12 = (x + 3)(x + 4)$$

这节课我们分解常数项为正、常数项为负，以及含两个变量的三项式。`,
  ),
  knowledgePoints: [
    {
      id: "positive-constant",
      title: t("A positive constant term", "常数项为正"),
      explanation: t(
        `Multiplying out, $(x + m)(x + n) = x^{2} + (m + n)x + mn$. So to factor $x^{2} + bx + c$, find two numbers $m$ and $n$ with **product** $c$ and **sum** $b$.

For $x^{2} + 7x + 12$: the pairs with product $12$ are $1, 12$; $2, 6$; $3, 4$, and only $3 + 4 = 7$. So $x^{2} + 7x + 12 = (x + 3)(x + 4)$.

When $c > 0$, the two numbers have the same sign, because their product is positive, and it is the sign of $b$, because they add up to $b$: $x^{2} - 7x + 12 = (x - 3)(x - 4)$.

> **Watch out.** The product alone does not decide: $(x + 2)(x + 6)$ also gives $12$, but its middle term is $8x$. And follow the sign of $b$: $x^{2} - 7x + 12$ is $(x - 3)(x - 4)$, since $(x + 3)(x + 4)$ has the middle term $+7x$. Multiply back to check.`,
        `展开 $(x + m)(x + n) = x^{2} + (m + n)x + mn$。所以分解 $x^{2} + bx + c$，就是找两个数 $m$ 和 $n$，使它们的**积**为 $c$，**和**为 $b$。

对 $x^{2} + 7x + 12$：积为 $12$ 的数对有 $1, 12$；$2, 6$；$3, 4$，只有 $3 + 4 = 7$。所以 $x^{2} + 7x + 12 = (x + 3)(x + 4)$。

当 $c > 0$ 时，两个数的积为正，所以同号；它们的和是 $b$，所以与 $b$ 同号：$x^{2} - 7x + 12 = (x - 3)(x - 4)$。

> **注意。** 只看积不够：$(x + 2)(x + 6)$ 的积也是 $12$，但中间项是 $8x$。符号要跟 $b$ 一致：$x^{2} - 7x + 12$ 是 $(x - 3)(x - 4)$，因为 $(x + 3)(x + 4)$ 的中间项是 $+7x$。要乘回去检验。`,
      ),
      keyPrerequisites: ["multiplying-binomials"],
      generate(rng) {
        const [m, n] = drawMonic(rng, true);
        const expr = quad(1, m + n, m * n);
        const answer = `${lf(1, m)}${lf(1, n)}`;
        return withMistakes(
          factoredProblem({
            prompt: factorPrompt(expr),
            answer,
            wrong: [`${lf(1, -m)}${lf(1, -n)}`, ...trinomialPairs(m, n, (d, e) => `${lf(1, d)}${lf(1, e)}`)],
            solution: monicSolution(expr, m, n, answer),
          }),
          [
            say(
              `${lf(1, -m)}${lf(1, -n)}`,
              "The signs are wrong: multiply your factors back and compare the middle term with the original.",
              "符号错了：把你的因式乘回去，对比中间项。",
            ),
          ],
        );
      },
    },
    {
      id: "negative-constant",
      title: t("A negative constant term", "常数项为负"),
      explanation: t(
        `When $c < 0$, the two numbers have opposite signs, since their product is negative. Their sum is $b$, so the one with the larger absolute value has the sign of $b$.

For $x^{2} - 2x - 15$: the product is $-15$ and the sum is $-2$, so the numbers are $3$ and $-5$:

$$x^{2} - 2x - 15 = (x + 3)(x - 5)$$

> **Watch out.** Swapping the signs gives the wrong middle term: $(x - 3)(x + 5)$ is $x^{2} + 2x - 15$. Other pairs with product $-15$, such as $1$ and $-15$, give other middle terms. Always multiply back and compare the middle term.`,
        `当 $c < 0$ 时，两个数的积为负，所以异号。它们的和是 $b$，所以绝对值较大的那个与 $b$ 同号。

对 $x^{2} - 2x - 15$：积是 $-15$，和是 $-2$，所以这两个数是 $3$ 和 $-5$：

$$x^{2} - 2x - 15 = (x + 3)(x - 5)$$

> **注意。** 符号对调会得到错误的中间项：$(x - 3)(x + 5)$ 是 $x^{2} + 2x - 15$。积为 $-15$ 的其他数对，例如 $1$ 和 $-15$，给出别的中间项。一定要乘回去，对比中间项。`,
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
          solution: monicSolution(expr, m, n, answer, v),
        });
      },
    },
    {
      id: "two-variables",
      title: t("Trinomials in two variables", "含两个变量的三项式"),
      explanation: t(
        `Factoring a trinomial in two variables works like factoring one in a single variable. Multiplying out,

$$(x + my)(x + ny) = x^{2} + (m + n)xy + mny^{2}$$

so for $x^{2} + bxy + cy^{2}$ look for two numbers with product $c$ and sum $b$, and write each one with $y$ in a factor. So $x^{2} - xy - 12y^{2} = (x + 3y)(x - 4y)$, since $3 \\cdot (-4) = -12$ and $3 + (-4) = -1$.

> **Watch out.** Both factors need $y$: $(x + 3)(x - 4y)$ multiplies out to $x^{2} - 4xy + 3x - 12y$, which is not the trinomial. The signs follow the same rules as before, so check the middle term $-xy$ by multiplying back.`,
        `二元三项式的分解与一元的相同。展开

$$(x + my)(x + ny) = x^{2} + (m + n)xy + mny^{2}$$

所以对 $x^{2} + bxy + cy^{2}$，找积为 $c$、和为 $b$ 的两个数，在因式中把每个数和 $y$ 写在一起。所以 $x^{2} - xy - 12y^{2} = (x + 3y)(x - 4y)$，因为 $3 \\cdot (-4) = -12$，$3 + (-4) = -1$。

> **注意。** 两个因式都要有 $y$：$(x + 3)(x - 4y)$ 乘开是 $x^{2} - 4xy + 3x - 12y$，不是原来的三项式。符号规则与前面相同，要乘回去检验中间项 $-xy$。`,
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
          solution: monicSolution(expr, m, n, answer, "x", "y"),
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
  intro: t(
    `The sum and product method needs a trinomial that starts with $x^{2}$. Many trinomials start with something else, such as $3x^{2} - 6x - 24$, yet every term shares a factor. Taking it out first, as in factoring with the greatest common factor, leaves a trinomial we can factor:

$$3x^{2} - 6x - 24 = 3(x^{2} - 2x - 8) = 3(x + 2)(x - 4)$$

The common factor stays in front, so the factorization is complete.

In this lesson we take out a number, a power of $x$, and a negative factor before factoring the trinomial.`,
    `“和与积”的方法要求三项式以 $x^{2}$ 开头。很多三项式不是这样，例如 $3x^{2} - 6x - 24$，但它的每一项都有公因数。像提取最大公因式那样先把它提出来，剩下的三项式就能分解了：

$$3x^{2} - 6x - 24 = 3(x^{2} - 2x - 8) = 3(x + 2)(x - 4)$$

公因数留在前面，这样才算彻底分解。

这节课我们在分解三项式之前，先提出一个数、$x$ 的幂或一个负因数。`,
  ),
  knowledgePoints: [
    {
      id: "numeric-factor",
      title: t("A numerical common factor", "数字公因数"),
      explanation: t(
        `First take out the greatest common factor of the coefficients; what is left starts with $x^{2}$, and the sum and product method applies:

$$3x^{2} - 6x - 24 = 3(x^{2} - 2x - 8) = 3(x + 2)(x - 4)$$

Here $2 \\cdot (-4) = -8$ and $2 + (-4) = -2$.

> **Watch out.** Finish after taking out the factor: $3(x^{2} - 2x - 8)$ is not factored completely. Do not leave the factor inside a bracket: $(3x + 6)(x - 4)$ is equal, but its first factor still contains $3$. And do not drop it: $(x + 2)(x - 4)$ is only a third of the polynomial.`,
        `先提出各系数的最大公因数；剩下的以 $x^{2}$ 开头，就能用“和与积”的方法：

$$3x^{2} - 6x - 24 = 3(x^{2} - 2x - 8) = 3(x + 2)(x - 4)$$

这里 $2 \\cdot (-4) = -8$，$2 + (-4) = -2$。

> **注意。** 提出公因数后还要继续：$3(x^{2} - 2x - 8)$ 没有分解彻底。公因数不要留在括号里：$(3x + 6)(x - 4)$ 虽然相等，但第一个因式里还含有 $3$。也不要丢掉它：$(x + 2)(x - 4)$ 只是原式的三分之一。`,
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
          solution: commonThenMonic(expr, String(k), String(k), inner, m, n, answer),
        });
      },
    },
    {
      id: "power-of-x",
      title: t("A common power of $x$", "公因式含 $x$ 的幂"),
      explanation: t(
        `When every term contains $x$, the common factor includes the smallest power of $x$, and what is left is a trinomial of lower degree that starts with $x^{2}$:

$$2x^{3} + 10x^{2} + 12x = 2x(x^{2} + 5x + 6) = 2x(x + 2)(x + 3)$$

> **Watch out.** Take out the smallest power of $x$, all of it: with $2$ alone in front, $2(x^{3} + 5x^{2} + 6x)$ still has a common factor $x$. Then finish: $2x(x^{2} + 5x + 6)$ is not complete. Keep the signs of the two numbers: $(x - 2)(x - 3)$ would give $-5x$.`,
        `当每一项都含有 $x$ 时，公因式包含 $x$ 的最小次幂，剩下的是以 $x^{2}$ 开头、次数更低的三项式：

$$2x^{3} + 10x^{2} + 12x = 2x(x^{2} + 5x + 6) = 2x(x + 2)(x + 3)$$

> **注意。** 要提出 $x$ 的最小次幂，而且全部提出：只在前面提出 $2$，$2(x^{3} + 5x^{2} + 6x)$ 里还有公因式 $x$。然后要继续分解：$2x(x^{2} + 5x + 6)$ 没有分解彻底。两个数的符号要保持：$(x - 2)(x - 3)$ 会得到 $-5x$。`,
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
          solution: commonThenMonic(expr, mono(k, e), g, inner, m, n, answer),
        });
      },
    },
    {
      id: "negative-leading-coefficient",
      title: t("A negative leading coefficient", "首项系数为负"),
      explanation: t(
        `When the leading coefficient is negative, take out a negative factor. Dividing by a negative number changes the sign of every term inside, and then the trinomial in parentheses starts with $x^{2}$:

$$-x^{2} - 2x + 15 = -(x^{2} + 2x - 15) = -(x + 5)(x - 3)$$

> **Watch out.** Change every sign inside, not only the first: $-x^{2} - 2x + 15$ is $-(x^{2} + 2x - 15)$, not $-(x^{2} - 2x + 15)$. Keep the minus sign in front: $(x + 5)(x - 3)$ alone is $x^{2} + 2x - 15$, the opposite polynomial. And finish factoring the trinomial.`,
        `首项系数为负时，提出一个负因数。除以负数时括号内每一项都变号，这样括号内的三项式以 $x^{2}$ 开头：

$$-x^{2} - 2x + 15 = -(x^{2} + 2x - 15) = -(x + 5)(x - 3)$$

> **注意。** 括号内每一项都要变号，不是只变第一项：$-x^{2} - 2x + 15$ 是 $-(x^{2} + 2x - 15)$，不是 $-(x^{2} - 2x + 15)$。前面的负号要保留：只写 $(x + 5)(x - 3)$ 得 $x^{2} + 2x - 15$，正好是相反的多项式。还要把三项式分解完。`,
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
          solution: commonThenMonic(expr, String(k), front(k), inner, m, n, answer),
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

/** acPair explains the pair of numbers of the ac method for (px + q)(rx + s): product ac and sum b. */
function acPair(p: number, q: number, r: number, s: number): Text {
  const a = p * r;
  const c = q * s;
  return t(
    `Here $ac = ${a} \\cdot ${signedNum(c)} = ${a * c}$, and two numbers with product $${a * c}$ and sum $${p * s + q * r}$ are $${p * s}$ and $${q * r}$.`,
    `这里 $ac = ${a} \\cdot ${signedNum(c)} = ${a * c}$，积为 $${a * c}$、和为 $${p * s + q * r}$ 的两个数是 $${p * s}$ 和 $${q * r}$。`,
  );
}

/** grouping writes the grouped form px(rx + s) ± q(rx + s) of (px + q)(rx + s). */
const grouping = (p: number, q: number, r: number, s: number) =>
  `${mono(p, 1)}${lf(r, s)} ${q < 0 ? "-" : "+"} ${Math.abs(q) === 1 ? "" : Math.abs(q)}${lf(r, s)}`;

/** acSolution explains the ac method for (px + q)(rx + s): split the middle term, factor by grouping, and check. */
function acSolution(expr: string, p: number, q: number, r: number, s: number, answer: string): Text {
  const split = poly([p * r, "x^{2}"], [p * s, "x"], [q * r, "x"], [q * s, ""]);
  const pair = acPair(p, q, r, s);
  return paragraphs(
    t(`**Step 1: Find two numbers.** ${pair.en}`, `**第一步：找两个数。** ${pair["zh-CN"]}`),
    t(
      `**Step 2: Split the middle term** into two terms with these coefficients:${steps(`${expr} = ${split}`)}`,
      `**第二步：拆开中间项**，拆成以这两个数为系数的两项：${steps(`${expr} = ${split}`)}`,
    ),
    t(
      `**Step 3: Factor by grouping.** Take $${mono(p, 1)}$ out of the first two terms and $${q}$ out of the last two; the same binomial is left in both:${steps(`${split} = ${grouping(p, q, r, s)} = ${answer}`)}`,
      `**第三步：分组分解。** 从前两项提出 $${mono(p, 1)}$，从后两项提出 $${q}$，两组剩下同一个二项式：${steps(`${split} = ${grouping(p, q, r, s)} = ${answer}`)}`,
    ),
    multiplyBack(answer, [split], expr),
  );
}

export const factoringTrinomialsWithLeadingCoefficients: TopicDef = {
  id: "factoring-trinomials-with-leading-coefficients",
  title: t("Factoring Trinomials With Leading Coefficients", "首项系数不为 1 的三项式的因式分解"),
  summary: t("Factor $ax^{2} + bx + c$ by grouping and by the $ac$ method.", "用分组分解法和 $ac$ 法分解 $ax^{2} + bx + c$。"),
  prerequisites: ["factoring-trinomials"],
  encompasses: [
    { topic: "factoring-trinomials", weight: 0.3 },
    { topic: "factoring-polynomials-using-gcfs", weight: 0.3 },
  ],
  xp: 18,
  standards: ["CCSS.HSA.SSE.A.2"],
  intro: t(
    `When the leading coefficient is not $1$ and cannot be taken out, the sum and product method needs one more idea. Multiplying $(3x + 2)(2x + 3)$ gives four products before they are collected:

$$(3x + 2)(2x + 3) = 6x^{2} + 9x + 4x + 6 = 6x^{2} + 13x + 6$$

To factor $6x^{2} + 13x + 6$ we rebuild those four terms. The two middle coefficients $9$ and $4$ add up to $13$, and their product $36$ equals $6 \\cdot 6$, the leading coefficient times the constant. Splitting $13x$ into $9x + 4x$ gives four terms that factor in pairs: $3x(2x + 3) + 2(2x + 3) = (3x + 2)(2x + 3)$.

In this lesson we factor four terms by grouping, factor trinomials whose leading coefficient is prime, and use the $ac$ method.`,
    `当首项系数不是 $1$、又不能提出来时，“和与积”的方法还需要一个想法。$(3x + 2)(2x + 3)$ 在合并之前有四个乘积：

$$(3x + 2)(2x + 3) = 6x^{2} + 9x + 4x + 6 = 6x^{2} + 13x + 6$$

分解 $6x^{2} + 13x + 6$，就是把这四项重新找回来。两个中间系数 $9$ 和 $4$ 的和是 $13$，积 $36$ 等于 $6 \\cdot 6$，即首项系数乘常数项。把 $13x$ 拆成 $9x + 4x$，得到的四项可以两两分组分解：$3x(2x + 3) + 2(2x + 3) = (3x + 2)(2x + 3)$。

这节课我们用分组分解四项式，分解首项系数是质数的三项式，并使用 $ac$ 法。`,
  ),
  knowledgePoints: [
    {
      id: "grouping",
      title: t("Factoring by grouping", "分组分解"),
      explanation: t(
        `A polynomial with four terms can sometimes be factored by **grouping**: take a common factor out of the first two terms and out of the last two, so that the same binomial appears in both, then factor out that binomial as a common factor.

$$6x^{2} + 4x + 9x + 6 = 2x(3x + 2) + 3(3x + 2) = (3x + 2)(2x + 3)$$

If the third term is negative, take a negative factor out of the last two terms, so that the binomial matches: $2x^{2} - 6x - x + 3 = 2x(x - 3) - (x - 3) = (x - 3)(2x - 1)$.

> **Watch out.** The two brackets must match exactly. Taking $+1$ out of $-x + 3$ gives $(-x + 3)$, which does not match $(x - 3)$; take out $-1$ instead. Keep each factor's sign: the second factor is $(2x - 1)$, not $(2x + 1)$. And the leftover factor is made of what was taken out, $2x$ and $-1$, not the constants of the brackets.`,
        `四项的多项式有时可以用**分组分解**：从前两项和后两项分别提出公因式，使两组出现同一个二项式，再把这个二项式作为公因式提出来。

$$6x^{2} + 4x + 9x + 6 = 2x(3x + 2) + 3(3x + 2) = (3x + 2)(2x + 3)$$

如果第三项是负的，就从后两项提出一个负因数，使二项式相同：$2x^{2} - 6x - x + 3 = 2x(x - 3) - (x - 3) = (x - 3)(2x - 1)$。

> **注意。** 两个括号必须完全相同。从 $-x + 3$ 中提出 $+1$ 得 $(-x + 3)$，与 $(x - 3)$ 不同；应提出 $-1$。每个因式的符号要保持：第二个因式是 $(2x - 1)$，不是 $(2x + 1)$。剩下的因式由提出的部分 $2x$ 和 $-1$ 组成，不是括号里的常数。`,
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
          solution: paragraphs(
            t(
              `**Step 1: Group the terms in pairs.** Take $${mono(p, 1)}$ out of the first two terms and $${q}$ out of the last two, so that both leave $${lf(r, s)}$:${steps(`${expr} = ${grouped}`)}`,
              `**第一步：两两分组。** 从前两项提出 $${mono(p, 1)}$，从后两项提出 $${q}$，两组都剩下 $${lf(r, s)}$：${steps(`${expr} = ${grouped}`)}`,
            ),
            t(
              `**Step 2: Factor out the common binomial.** What was taken out, $${mono(p, 1)}$ and $${q}$, makes the other factor:${steps(`${grouped} = ${answer}`)}`,
              `**第二步：提出公共二项式。** 提出的部分 $${mono(p, 1)}$ 和 $${q}$ 组成另一个因式：${steps(`${grouped} = ${answer}`)}`,
            ),
            multiplyBack(answer, [expr], expr),
          ),
        });
      },
    },
    {
      id: "prime-leading-coefficient",
      title: t("A prime leading coefficient", "首项系数是质数"),
      explanation: t(
        `When the leading coefficient is a prime such as $3$, its only factors are $3$ and $1$, so the factors must start with $3x$ and $x$: $(3x + m)(x + n)$. Expanding gives $3x^{2} + (3n + m)x + mn$, so $m$ and $n$ are a factor pair of the constant, and the one next to $x$ is multiplied by $3$. Try the pairs, in both orders, until the middle term matches.

For $3x^{2} + 10x - 8$: $(3x - 2)(x + 4)$ gives the middle term $12x - 2x = 10x$, while $(3x + 4)(x - 2)$ gives $-6x + 4x = -2x$. So $3x^{2} + 10x - 8 = (3x - 2)(x + 4)$.

> **Watch out.** The order matters: $(3x - 2)(x + 4)$ and $(3x + 4)(x - 2)$ use the same pair but have different middle terms. Swapping both signs, $(3x + 2)(x - 4)$, gives $-10x$. Changing just one sign changes the constant to $+8$. Multiply back to check the middle term.`,
        `当首项系数是质数（例如 $3$）时，它的因数只有 $3$ 和 $1$，所以两个因式必须以 $3x$ 和 $x$ 开头：$(3x + m)(x + n)$。展开得 $3x^{2} + (3n + m)x + mn$，所以 $m$ 和 $n$ 是常数项的一对因数，而与 $x$ 搭配的那个要乘以 $3$。把各数对按两种顺序依次尝试，直到中间项相符。

对 $3x^{2} + 10x - 8$：$(3x - 2)(x + 4)$ 的中间项是 $12x - 2x = 10x$，而 $(3x + 4)(x - 2)$ 的中间项是 $-6x + 4x = -2x$。所以 $3x^{2} + 10x - 8 = (3x - 2)(x + 4)$。

> **注意。** 顺序很重要：$(3x - 2)(x + 4)$ 与 $(3x + 4)(x - 2)$ 用的是同一对数，中间项却不同。两个符号都对调成 $(3x + 2)(x - 4)$，得 $-10x$。只改一个符号，常数项会变成 $+8$。要乘回去检验中间项。`,
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
          solution: paragraphs(
            t(
              `**Step 1: Set up the factors.** $${a}$ is prime, so the factors start with $${a}x$ and $x$: $(${a}x + m)(x + n)$, with $mn = ${q * s}$ and middle coefficient $${a}n + m = ${a * s + q}$.`,
              `**第一步：写出因式的形式。** $${a}$ 是质数，所以两个因式以 $${a}x$ 和 $x$ 开头：$(${a}x + m)(x + n)$，其中 $mn = ${q * s}$，中间项系数 $${a}n + m = ${a * s + q}$。`,
            ),
            t(
              `**Step 2: Try the factor pairs of $${q * s}$.** With $m = ${q}$ and $n = ${s}$, the middle coefficient is $${a} \\cdot ${signedNum(s)} + ${signedNum(q)} = ${a * s + q}$, as needed${a * q + s !== a * s + q ? `; in the other order it would be $${a} \\cdot ${signedNum(q)} + ${signedNum(s)} = ${a * q + s}$` : ""}. So${steps(`${expr} = ${answer}`)}`,
              `**第二步：尝试 $${q * s}$ 的因数对。** 取 $m = ${q}$，$n = ${s}$，中间项系数是 $${a} \\cdot ${signedNum(s)} + ${signedNum(q)} = ${a * s + q}$，符合要求${a * q + s !== a * s + q ? `；换个顺序则是 $${a} \\cdot ${signedNum(q)} + ${signedNum(s)} = ${a * q + s}$` : ""}。所以${steps(`${expr} = ${answer}`)}`,
            ),
            multiplyBack(answer, [poly([a, "x^{2}"], [a * s, "x"], [q, "x"], [q * s, ""])], expr),
          ),
        });
      },
    },
    {
      id: "ac-method",
      title: t("The $ac$ method", "$ac$ 法"),
      explanation: t(
        `When there are many factor pairs to try, use the **$ac$ method** for $ax^{2} + bx + c$. It rebuilds the four products of $(px + q)(rx + s) = prx^{2} + psx + qrx + qs$: the two middle coefficients $ps$ and $qr$ add up to $b$, and their product $pqrs$ is $ac$. So:

1. Find two numbers with product $ac$ and sum $b$.
2. Split $bx$ into two terms with these coefficients.
3. Factor by grouping.

For $6x^{2} + 7x - 20$: $ac = -120$, and $15 \\cdot (-8) = -120$, $15 + (-8) = 7$. So

$$6x^{2} + 15x - 8x - 20 = 3x(2x + 5) - 4(2x + 5) = (2x + 5)(3x - 4)$$

> **Watch out.** Use the product $ac$, not $c$ alone: numbers with product $-20$ and sum $7$ do not lead anywhere here. When grouping, take a negative factor out of the last two terms if their first term is negative, so the brackets match. Check the signs by multiplying back: $(2x - 5)(3x + 4)$ has middle term $-7x$.`,
        `因数对很多时，对 $ax^{2} + bx + c$ 用 **$ac$ 法**。它把 $(px + q)(rx + s) = prx^{2} + psx + qrx + qs$ 的四个乘积重新找回来：两个中间系数 $ps$ 和 $qr$ 的和是 $b$，积 $pqrs$ 等于 $ac$。所以：

1. 找两个数，积为 $ac$，和为 $b$。
2. 把 $bx$ 拆成以这两个数为系数的两项。
3. 分组分解。

对 $6x^{2} + 7x - 20$：$ac = -120$，而 $15 \\cdot (-8) = -120$，$15 + (-8) = 7$。所以

$$6x^{2} + 15x - 8x - 20 = 3x(2x + 5) - 4(2x + 5) = (2x + 5)(3x - 4)$$

> **注意。** 用的是积 $ac$，不是只用 $c$：积为 $-20$、和为 $7$ 的数在这里没有用。分组时，如果后两项的第一项是负的，就提出负因数，使括号相同。要乘回去检验符号：$(2x - 5)(3x + 4)$ 的中间项是 $-7x$。`,
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
  intro: t(
    `The $ac$ method factors $ax^{2} + bx + c$, and taking out a common factor makes a trinomial simpler. Real problems often need both. In $12x^{2} + 2x - 4$ every coefficient is even; taking out $2$ first leaves $6x^{2} + x - 2$, with smaller numbers for the $ac$ method, and keeps the factor $2$ in front so the result is complete:

$$12x^{2} + 2x - 4 = 2(6x^{2} + x - 2) = 2(2x - 1)(3x + 2)$$

In this lesson we take out a common factor first, take out a negative factor when the leading coefficient is negative, and factor trinomials in two variables.`,
    `$ac$ 法能分解 $ax^{2} + bx + c$，提取公因式能让三项式变简单。实际问题常常两者都要用。在 $12x^{2} + 2x - 4$ 中各系数都是偶数；先提出 $2$，剩下 $6x^{2} + x - 2$，用 $ac$ 法时数更小，而且因数 $2$ 留在前面，结果才彻底：

$$12x^{2} + 2x - 4 = 2(6x^{2} + x - 2) = 2(2x - 1)(3x + 2)$$

这节课我们先提取公因式，在首项系数为负时提出负因数，并分解含两个变量的三项式。`,
  ),
  knowledgePoints: [
    {
      id: "common-factor-first",
      title: t("Taking out a common factor first", "先提取公因式"),
      explanation: t(
        `Take out the greatest common factor before using the $ac$ method. The numbers become smaller, so there are fewer pairs to try, and the result is complete:

$$12x^{2} + 2x - 4 = 2(6x^{2} + x - 2) = 2(2x - 1)(3x + 2)$$

For $6x^{2} + x - 2$, $ac = -12$, and $4 + (-3) = 1$.

> **Watch out.** Keep the common factor in front: $(2x - 1)(3x + 2)$ is only half of the polynomial. Do not leave it inside a bracket: $(4x - 2)(3x + 2)$ is equal, but $4x - 2$ still has the factor $2$. And finish: $2(6x^{2} + x - 2)$ is not complete.`,
        `用 $ac$ 法之前先提出最大公因数。数会变小，要试的数对更少，结果也才彻底：

$$12x^{2} + 2x - 4 = 2(6x^{2} + x - 2) = 2(2x - 1)(3x + 2)$$

对 $6x^{2} + x - 2$，$ac = -12$，而 $4 + (-3) = 1$。

> **注意。** 公因数要留在前面：$(2x - 1)(3x + 2)$ 只是原式的一半。也不要把它留在括号里：$(4x - 2)(3x + 2)$ 虽然相等，但 $4x - 2$ 里还有因数 $2$。还要分解完：$2(6x^{2} + x - 2)$ 没有分解彻底。`,
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
          solution: paragraphs(
            t(
              `**Step 1: Take out the common factor.** Every coefficient is a multiple of $${k}$:${steps(`${expr} = ${k}(${inner})`)}`,
              `**第一步：提出公因数。** 每个系数都是 $${k}$ 的倍数：${steps(`${expr} = ${k}(${inner})`)}`,
            ),
            t(
              `**Step 2: Factor the trinomial left.** ${acPair(p, q, r, s).en} Splitting the middle term and grouping:${steps(`${k}(${inner}) = ${k}(${poly([p * r, "x^{2}"], [p * s, "x"], [q * r, "x"], [q * s, ""])}) = ${answer}`)}`,
              `**第二步：分解剩下的三项式。** ${acPair(p, q, r, s)["zh-CN"]}拆开中间项再分组：${steps(`${k}(${inner}) = ${k}(${poly([p * r, "x^{2}"], [p * s, "x"], [q * r, "x"], [q * s, ""])}) = ${answer}`)}`,
            ),
            multiplyBack(answer, [`${k}(${inner})`], expr),
          ),
        });
      },
    },
    {
      id: "negative-leading-coefficient",
      title: t("A negative leading coefficient", "首项系数为负"),
      explanation: t(
        `Take out $-1$, or a negative common factor, so that the leading coefficient in parentheses is positive; dividing by a negative number changes the sign of every term. Then factor as before:

$$-6x^{2} + x + 2 = -(6x^{2} - x - 2) = -(2x + 1)(3x - 2)$$

> **Watch out.** Change every sign inside: $-6x^{2} + x + 2$ is $-(6x^{2} - x - 2)$, not $-(6x^{2} + x + 2)$. Keep the minus sign in front: $(2x + 1)(3x - 2)$ alone is the opposite polynomial. And the pair must give the middle term inside, $-x$: $-(2x - 1)(3x + 2)$ is wrong.`,
        `提出 $-1$ 或负的公因数，使括号内首项系数为正；除以负数时每一项都变号。然后照常分解：

$$-6x^{2} + x + 2 = -(6x^{2} - x - 2) = -(2x + 1)(3x - 2)$$

> **注意。** 括号内每一项都要变号：$-6x^{2} + x + 2$ 是 $-(6x^{2} - x - 2)$，不是 $-(6x^{2} + x + 2)$。前面的负号要保留：只写 $(2x + 1)(3x - 2)$ 是相反的多项式。所选数对要给出括号内的中间项 $-x$：$-(2x - 1)(3x + 2)$ 是错的。`,
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
          solution: paragraphs(
            t(
              k === -1
                ? `**Step 1: Take out $-1$.** The leading coefficient is negative; taking out $-1$ changes every sign inside:${steps(`${expr} = ${front(k)}(${inner})`)}`
                : `**Step 1: Take out $${k}$.** The coefficients share $${-k}$ and the leading one is negative, so take out $${k}$, which changes every sign inside:${steps(`${expr} = ${front(k)}(${inner})`)}`,
              k === -1
                ? `**第一步：提出 $-1$。** 首项系数为负；提出 $-1$，括号内每一项都变号：${steps(`${expr} = ${front(k)}(${inner})`)}`
                : `**第一步：提出 $${k}$。** 各系数有公因数 $${-k}$，且首项系数为负，所以提出 $${k}$，括号内每一项都变号：${steps(`${expr} = ${front(k)}(${inner})`)}`,
            ),
            t(
              `**Step 2: Factor the trinomial left.** ${acPair(p, q, r, s).en} Splitting the middle term and grouping:${steps(`${front(k)}(${inner}) = ${front(k)}(${poly([p * r, "x^{2}"], [p * s, "x"], [q * r, "x"], [q * s, ""])}) = ${answer}`)}`,
              `**第二步：分解剩下的三项式。** ${acPair(p, q, r, s)["zh-CN"]}拆开中间项再分组：${steps(`${front(k)}(${inner}) = ${front(k)}(${poly([p * r, "x^{2}"], [p * s, "x"], [q * r, "x"], [q * s, ""])}) = ${answer}`)}`,
            ),
            multiplyBack(answer, [`${front(k)}(${inner})`], expr),
          ),
        });
      },
    },
    {
      id: "two-variables",
      title: t("Two variables", "含两个变量"),
      explanation: t(
        `For $ax^{2} + bxy + cy^{2}$, every term has degree $2$, so each factor has the form $(px + qy)$. Expanding $(px + qy)(rx + sy) = prx^{2} + (ps + qr)xy + qsy^{2}$ gives the same coefficients as $(px + q)(rx + s)$. So factor as if $y$ were $1$, then put $y$ after the constants of the factors:

$$6x^{2} - 7xy - 3y^{2} = (2x - 3y)(3x + y)$$

Check the middle term: $2x \\cdot y + (-3y) \\cdot 3x = -7xy$.

> **Watch out.** Put $y$ in both factors: $(2x - 3)(3x + y)$ does not multiply to a trinomial in $xy$. The pair is chosen as before, so its order and signs still matter: $(2x + y)(3x - 3y)$ has the right outer terms but the wrong middle term.`,
        `在 $ax^{2} + bxy + cy^{2}$ 中，每一项的次数都是 $2$，所以每个因式形如 $(px + qy)$。展开 $(px + qy)(rx + sy) = prx^{2} + (ps + qr)xy + qsy^{2}$，系数与 $(px + q)(rx + s)$ 相同。所以先把 $y$ 当作 $1$ 来分解，再在各因式的常数后面写上 $y$：

$$6x^{2} - 7xy - 3y^{2} = (2x - 3y)(3x + y)$$

检验中间项：$2x \\cdot y + (-3y) \\cdot 3x = -7xy$。

> **注意。** 两个因式都要写上 $y$：$(2x - 3)(3x + y)$ 乘开不是关于 $xy$ 的三项式。数对的选法与前面相同，顺序和符号仍然重要：$(2x + y)(3x - 3y)$ 首末两项对，但中间项错了。`,
      ),
      generate(rng) {
        const [p, q, r, s] = drawBinomials(rng, 1, 2, 7);
        const expr = poly([p * r, "x^{2}"], [p * s + q * r, "xy"], [q * s, "y^{2}"]);
        const answer = `${lf2(p, q)}${lf2(r, s)}`;
        return factoredProblem({
          prompt: factorPrompt(expr),
          answer,
          wrong: [`${lf2(p, s)}${lf2(r, q)}`, `${lf2(p, -q)}${lf2(r, -s)}`, `${lf(p, q)}${lf(r, s, "y")}`],
          solution: paragraphs(
            t(
              `**Step 1: Factor as if $y$ were $1$.** ${acPair(p, q, r, s).en} So${steps(`${quad(p * r, p * s + q * r, q * s)} = ${lf(p, q)}${lf(r, s)}`)}`,
              `**第一步：把 $y$ 当作 $1$ 来分解。** ${acPair(p, q, r, s)["zh-CN"]}所以${steps(`${quad(p * r, p * s + q * r, q * s)} = ${lf(p, q)}${lf(r, s)}`)}`,
            ),
            t(
              `**Step 2: Put $y$ back.** Write $y$ after the constant of each factor:${steps(`${expr} = ${answer}`)}`,
              `**第二步：写回 $y$。** 在每个因式的常数后面写上 $y$：${steps(`${expr} = ${answer}`)}`,
            ),
            multiplyBack(answer, [poly([p * r, "x^{2}"], [p * s, "xy"], [q * r, "xy"], [q * s, "y^{2}"])], expr),
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
