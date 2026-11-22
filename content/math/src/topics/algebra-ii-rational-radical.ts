import type { Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { gcd, lcm, linear, num, paren, poly, Q } from "@ga/subject-math";

import { expressionProblem, numberProblem, steps } from "../problems.ts";
import { stepLabel } from "../solution-kit.ts";

// Writing expressions.

/** frac writes a fraction of two LaTeX expressions. */
const frac = (top: string, bottom: string) => `\\frac{${top}}{${bottom}}`;

/** pw writes a power of a variable: "", "x" or "x^{3}". */
const pw = (v: string, e: number) => (e <= 0 ? "" : e === 1 ? v : `${v}^{${e}}`);

/** grp puts a sum in parentheses, for use as a factor: "(x + 3)"; monomials and groups are left alone. */
const grp = (s: string) => (s.includes(" ") && !s.startsWith("(") ? `(${s})` : s);

/** product writes an integer times factors: "3(x + 1)", "-x(x - 2)", "x + 1"; empty factors are skipped. */
function product(c: number, factors: readonly string[]): string {
  const fs = factors.filter((f) => f !== "");
  if (fs.length === 0) return String(c);
  if (c === 1 && fs.length === 1) return fs[0]!;
  return `${c === 1 ? "" : c === -1 ? "-" : c}${fs.map(grp).join("")}`;
}

/** ratio writes (nc · nf) / (dc · df) with the numbers reduced and the sign in front: "-\frac{2}{3(x + 1)}". */
function ratio(nc: number, nf: readonly string[], dc: number, df: readonly string[]): string {
  const g = gcd(nc, dc);
  let a = nc / g;
  let b = dc / g;
  if (b < 0) {
    a = -a;
    b = -b;
  }
  const bottom = df.filter((f) => f !== "");
  if (b === 1 && bottom.length === 0) return product(a, nf);
  return `${a < 0 ? "-" : ""}${frac(product(Math.abs(a), nf), product(b, bottom))}`;
}

/** bin writes the binomial x + b, or x when b is 0. */
const bin = (b: number) => linear(1, b);

/** expand writes (ax + b)(cx + d) multiplied out. */
const expand = (a: number, b: number, c: number, d: number) => poly([a * c, "x^{2}"], [a * d + b * c, "x"], [b * d, ""]);

/** dedupeQ keeps the first of equal numbers. */
const dedupeQ = (xs: readonly Q[]) => xs.filter((x, i) => xs.findIndex((y) => y.eq(x)) === i);

/** simplifyPrompt asks to simplify an expression, stating the values of x it excludes. */
function simplifyPrompt(expr: string, excluded: readonly Q[]): Text {
  const vs = dedupeQ(excluded).sort((a, b) => a.cmp(b));
  if (vs.length === 0) return t(`Simplify $${expr}$.`, `化简 $${expr}$。`);
  const conds = vs.map((v) => `$x \\neq ${num(v)}$`);
  return t(`Simplify $${expr}$, where ${conds.join(" and ")}.`, `化简 $${expr}$（${conds.join("，")}）。`);
}

/** Lin is a linear factor ux + v with u > 0 and no common factor of u and v. */
type Lin = readonly [number, number];

/** linTex writes a linear factor. */
const linTex = ([u, v]: Lin) => linear(u, v);

/** linRoot is the zero of a linear factor. */
const linRoot = ([u, v]: Lin) => Q.of(-v, u);

/** drawLin draws a linear factor with a leading coefficient from lead. */
function drawLin(rng: Rng, lead: readonly number[]): Lin {
  for (;;) {
    const u = rng.pick(lead);
    const v = rng.nonZero(-9, 9);
    if (gcd(u, v) === 1) return [u, v];
  }
}

/** monoRatio writes c·xᵃ·yᵇ with negative exponents in the denominator: "-\frac{3x^{2}}{2y}". */
function monoRatio(c: Q, ex: number, ey: number): string {
  const topVars = `${pw("x", ex)}${pw("y", ey)}`;
  const botVars = `${pw("x", -ex)}${pw("y", -ey)}`;
  const n = c.abs().n;
  const d = c.d;
  const sign = c.sign() < 0 ? "-" : "";
  const top = topVars === "" ? String(n) : `${n === 1n ? "" : n}${topVars}`;
  const bottom = botVars === "" ? (d === 1n ? "" : String(d)) : `${d === 1n ? "" : d}${botVars}`;
  return bottom === "" ? `${sign}${top}` : `${sign}${frac(top, bottom)}`;
}

/** mono writes c·xᵃ·yᵇ: "3x^{2}y", "-y". */
const mono = (c: number, ex: number, ey: number) => poly([c, `${pw("x", ex)}${pw("y", ey)}`]);

// Writing solutions.

/** Step is one step of a solution: its title in English and Chinese, what it does, and the lines it displays. */
type Step = readonly [title: readonly [en: string, zh: string], say: Text, lines?: readonly string[]];

/** walked writes a solution as labelled steps (one step goes unlabelled) followed by a check, in each locale. */
function walked(parts: readonly Step[], check: Text): Text {
  const write = (locale: keyof Text) =>
    parts
      .map(([[en, zh], say, lines = []], i) => {
        const head = parts.length > 1 ? `${stepLabel(i + 1, en, zh)[locale]} ` : "";
        return `${head}${say[locale]}${lines.length > 0 ? steps(...lines) : "\n\n"}`;
      })
      .join("") + (locale === "en" ? `**Check.** ${check.en}` : `**检验。** ${check["zh-CN"]}`);
  return t(write("en"), write("zh-CN"));
}

/** fr writes a fraction of two integers: "\frac{-3}{4}". */
const fr = (top: number, bottom: number) => frac(String(top), String(bottom));

/** ev writes a quotient of two integers, then its value in lowest terms when that reads differently: "\frac{12}{-4} = -3". */
function ev(top: number, bottom: number): string {
  if (bottom === 1) return String(top);
  const shown = fr(top, bottom);
  const value = num(Q.of(top, bottom));
  return value === shown ? shown : `${shown} = ${value}`;
}

/** nev writes the opposite of a quotient of two integers, then its value in lowest terms when that reads differently: "-\frac{5}{-2} = \frac{5}{2}". */
function nev(top: number, bottom: number): string {
  const shown = `-${fr(top, bottom)}`;
  const value = num(Q.of(-top, bottom));
  return value === shown ? shown : `${shown} = ${value}`;
}

/** reduceNote says how the numbers in front reduce, ", and \frac{6}{4} reduces to \frac{3}{2}", or nothing when they are already in lowest terms. */
function reduceNote(top: number, bottom: number): Text {
  if (gcd(top, bottom) === 1) return t("", "");
  const v = num(Q.of(top, bottom));
  return t(`, and $${fr(top, bottom)}$ reduces to $${v}$`, `，$${fr(top, bottom)}$ 约成 $${v}$`);
}

/** agree writes a check that the original expression and the answer take the same value at a point. */
function agree(at: string, original: string, answer: string): Text {
  return t(
    `Substitute $${at}$. The original expression gives $${original}$, and the answer gives $${answer}$. The values agree.`,
    `代入 $${at}$。原式得 $${original}$，结果得 $${answer}$。两者相等。`,
  );
}

/** tryX lists the values of x tried, in order, for a check by substitution. */
const tryX = [2, 3, 1, -1, -2, 4, 5, -3, 6, -4, 7, 10, 11, -10, 13];

/** checkAt checks an answer at the first value of x to try at which none of the given values vanish; write gives the values of the original expression and of the answer there. */
function checkAt(nonzero: (x: number) => readonly number[], write: (x: number) => readonly [original: string, answer: string]): Text {
  const x = tryX.find((v) => nonzero(v).every((z) => z !== 0)) ?? 2;
  const [original, answer] = write(x);
  return agree(`x = ${x}`, original, answer);
}

// Rational expressions.

export const simplifyingRationalExpressionsUsingPolynomialFactorization: TopicDef = {
  id: "simplifying-rational-expressions-using-polynomial-factorization",
  title: t("Simplifying Rational Expressions Using Polynomial Factorization", "用多项式因式分解化简分式"),
  summary: t(
    "Simplify rational expressions whose numerators and denominators are trinomials with leading coefficients, after taking out common factors, and with opposite factors.",
    "化简分子和分母是带首项系数的三项式的分式：先提取公因式，再分解，并处理互为相反数的因式。",
  ),
  prerequisites: [
    "simplifying-rational-expressions-by-factoring",
    "factoring-trinomials-with-leading-coefficients",
    "factoring-trinomials-using-common-factors",
  ],
  encompasses: [
    { topic: "simplifying-rational-expressions-by-factoring", weight: 0.7 },
    { topic: "factoring-trinomials-with-leading-coefficients", weight: 0.4 },
  ],
  xp: 16,
  standards: ["CCSS.HSA.APR.D.6", "CCSS.HSA.SSE.A.2"],
  intro: t(
    `A fraction such as $\\frac{6}{9}$ is simplified by writing the top and the bottom as products, $\\frac{3 \\cdot 2}{3 \\cdot 3}$, and dividing both by the common factor $3$. A rational expression is simplified the same way, once its numerator and denominator are factored:

$$\\frac{3x^{2} + 5x - 2}{3x^{2} - 7x + 2} = \\frac{(3x - 1)(x + 2)}{(3x - 1)(x - 2)} = \\frac{x + 2}{x - 2}, \\quad x \\neq \\frac{1}{3}, \\ x \\neq 2$$

Check at $x = 1$: the original gives $\\frac{3 + 5 - 2}{3 - 7 + 2} = \\frac{6}{-2} = -3$, and the answer gives $\\frac{1 + 2}{1 - 2} = -3$.

In this lesson we simplify rational expressions whose trinomials have leading coefficients, whose terms share a number, and whose factors are opposites.`,
    `像 $\\frac{6}{9}$ 这样的分数，化简时把分子和分母写成积 $\\frac{3 \\cdot 2}{3 \\cdot 3}$，再同时除以公因数 $3$。分式也一样，只要先把分子和分母分解因式：

$$\\frac{3x^{2} + 5x - 2}{3x^{2} - 7x + 2} = \\frac{(3x - 1)(x + 2)}{(3x - 1)(x - 2)} = \\frac{x + 2}{x - 2}, \\quad x \\neq \\frac{1}{3}, \\ x \\neq 2$$

在 $x = 1$ 处检验：原式得 $\\frac{3 + 5 - 2}{3 - 7 + 2} = \\frac{6}{-2} = -3$，结果得 $\\frac{1 + 2}{1 - 2} = -3$。

这节课我们化简三种分式：三项式带首项系数的，各项有公因数的，以及含有互为相反数的因式的。`,
  ),
  knowledgePoints: [
    {
      id: "trinomials-with-leading-coefficients",
      title: t("Trinomials with leading coefficients", "带首项系数的三项式"),
      explanation: t(
        `Dividing the numerator and the denominator by the same nonzero factor does not change the value of a fraction, but only a factor, a part that multiplies everything else, can be divided out. So factor every numerator and denominator completely first, using the $ac$ method for a trinomial with a leading coefficient.

For $2x^{2} + 5x - 3$, $ac = 2 \\cdot (-3) = -6$, and $6$ and $-1$ multiply to $-6$ and add to $5$, so $2x^{2} + 6x - x - 3 = (2x - 1)(x + 3)$. In the same way $2x^{2} - 7x + 3 = (2x - 1)(x - 3)$. Then cancel the common factor:

$$\\frac{2x^{2} + 5x - 3}{2x^{2} - 7x + 3} = \\frac{(2x - 1)(x + 3)}{(2x - 1)(x - 3)} = \\frac{x + 3}{x - 3}, \\quad x \\neq \\frac{1}{2}, \\ x \\neq 3$$

The value $x = \\frac{1}{2}$ stays excluded: the original expression is undefined there even though the factor has cancelled. Check at $x = 1$: $\\frac{2 + 5 - 3}{2 - 7 + 3} = \\frac{4}{-2} = -2$ and $\\frac{1 + 3}{1 - 3} = -2$.

> **Watch out.** Cancel only whole factors: crossing out the terms $2x^{2}$ leaves $\\frac{5x - 3}{-7x + 3}$, which is wrong. Keep the numerator's factor on top: $\\frac{x - 3}{x + 3}$ is the reciprocal. Take the signs from the factoring: $x + 3$ and $x - 3$ are different factors.`,
        `分子和分母同时除以同一个不为零的因式，分式的值不变；但能约去的只有因式，也就是乘着其余部分的整体。所以先把每个分子和分母都完全分解，带首项系数的三项式用 $ac$ 法分解。

对 $2x^{2} + 5x - 3$，$ac = 2 \\cdot (-3) = -6$，$6$ 与 $-1$ 之积是 $-6$、之和是 $5$，所以 $2x^{2} + 6x - x - 3 = (2x - 1)(x + 3)$。同样 $2x^{2} - 7x + 3 = (2x - 1)(x - 3)$。再约去公因式：

$$\\frac{2x^{2} + 5x - 3}{2x^{2} - 7x + 3} = \\frac{(2x - 1)(x + 3)}{(2x - 1)(x - 3)} = \\frac{x + 3}{x - 3}, \\quad x \\neq \\frac{1}{2}, \\ x \\neq 3$$

$x = \\frac{1}{2}$ 仍要排除：虽然这个因式约去了，原式在这里没有意义。在 $x = 1$ 处检验：$\\frac{2 + 5 - 3}{2 - 7 + 3} = \\frac{4}{-2} = -2$，$\\frac{1 + 3}{1 - 3} = -2$。

> **注意。** 只能约去完整的因式：把 $2x^{2}$ 这两项划掉得到 $\\frac{5x - 3}{-7x + 3}$，是错的。分子的因式留在上面：$\\frac{x - 3}{x + 3}$ 是倒数。因式里的符号以分解结果为准：$x + 3$ 和 $x - 3$ 是不同的因式。`,
      ),
      keyPrerequisites: ["factoring-trinomials-with-leading-coefficients"],
      generate(rng) {
        for (;;) {
          const C = drawLin(rng, [1, 1, 2, 3, 4, 5]);
          const N = drawLin(rng, [1, 1, 2, 3]);
          const D = drawLin(rng, [1, 1, 2, 3]);
          if (C[0] + N[0] + D[0] === 3) continue;
          const [rc, rn, rd] = [linRoot(C), linRoot(N), linRoot(D)];
          if (rc.eq(rn) || rc.eq(rd) || rn.eq(rd)) continue;
          const expr = frac(expand(C[0], C[1], N[0], N[1]), expand(C[0], C[1], D[0], D[1]));
          const answer = frac(linTex(N), linTex(D));
          const factored = frac(`(${linTex(C)})(${linTex(N)})`, `(${linTex(C)})(${linTex(D)})`);
          return expressionProblem({
            prompt: simplifyPrompt(expr, [rc, rd]),
            answer,
            lowest: true,
            wrong: [
              frac(linTex(D), linTex(N)),
              frac(linear(N[0], -N[1]), linear(D[0], -D[1])),
              frac(linear(C[0] * N[1] + C[1] * N[0], C[1] * N[1]), linear(C[0] * D[1] + C[1] * D[0], C[1] * D[1])),
            ],
            solution: walked(
              [
                ...[N, D].map(
                  (F, i): Step => [
                    i === 0 ? ["Factor the numerator", "分解分子"] : ["Factor the denominator", "分解分母"],
                    t(
                      `For $${expand(C[0], C[1], F[0], F[1])}$, $ac = ${C[0] * F[0] * C[1] * F[1]}$, and $${C[0] * F[1]}$ and $${C[1] * F[0]}$ multiply to it and add to the coefficient of $x$, $${C[0] * F[1] + C[1] * F[0]}$:`,
                      `对 $${expand(C[0], C[1], F[0], F[1])}$，$ac = ${C[0] * F[0] * C[1] * F[1]}$，$${C[0] * F[1]}$ 与 $${C[1] * F[0]}$ 之积等于它，之和等于 $x$ 的系数 $${C[0] * F[1] + C[1] * F[0]}$：`,
                    ),
                    [`${expand(C[0], C[1], F[0], F[1])} = (${linTex(C)})(${linTex(F)})`],
                  ],
                ),
                [
                  ["Cancel", "约分"],
                  t(
                    `The factor $${linTex(C)}$ is common to both, so it cancels; the value that makes it zero stays excluded:`,
                    `因式 $${linTex(C)}$ 是公因式，可以约去；使它为零的值仍要排除：`,
                  ),
                  [`${expr} = ${factored} = ${answer}`],
                ],
              ],
              checkAt(
                (x) => [C, N, D].map(([u, v]) => u * x + v),
                (x) => {
                  const [c, n, d] = [C, N, D].map(([u, v]) => u * x + v) as [number, number, number];
                  return [ev(c * n, c * d), ev(n, d)];
                },
              ),
            ),
          });
        }
      },
    },
    {
      id: "common-factors-then-trinomials",
      title: t("Common factors first", "先提取公因数"),
      explanation: t(
        `When every term shares a number, take it out first: what is left is a trinomial with leading coefficient $1$, which is easy to factor. The numbers taken out are factors too, so they cancel like $\\frac{3}{6} = \\frac{1}{2}$.

$$\\frac{3x^{2} - 3x - 18}{6x^{2} - 54} = \\frac{3(x^{2} - x - 6)}{6(x^{2} - 9)} = \\frac{3(x - 3)(x + 2)}{6(x - 3)(x + 3)} = \\frac{x + 2}{2(x + 3)}, \\quad x \\neq 3$$

The factor $x - 3$ cancels and $\\frac{3}{6}$ reduces to $\\frac{1}{2}$. Check at $x = 1$: $\\frac{3 - 3 - 18}{6 - 54} = \\frac{-18}{-48} = \\frac{3}{8}$ and $\\frac{1 + 2}{2(1 + 3)} = \\frac{3}{8}$.

> **Watch out.** Cancel the numbers too: $\\frac{x + 2}{x + 3}$ forgets that $\\frac{3}{6} = \\frac{1}{2}$. Keep each number on its own side: the $3$ was on top, so the result is not $\\frac{2(x + 2)}{x + 3}$. Keep the signs of the factors: $x - 2$ and $x + 2$ are different.`,
        `当各项都有公因数时，先把它提出来：剩下的是首项系数为 $1$ 的三项式，容易分解。提出来的数也是因式，可以像 $\\frac{3}{6} = \\frac{1}{2}$ 那样约分。

$$\\frac{3x^{2} - 3x - 18}{6x^{2} - 54} = \\frac{3(x^{2} - x - 6)}{6(x^{2} - 9)} = \\frac{3(x - 3)(x + 2)}{6(x - 3)(x + 3)} = \\frac{x + 2}{2(x + 3)}, \\quad x \\neq 3$$

约去因式 $x - 3$，$\\frac{3}{6}$ 约成 $\\frac{1}{2}$。在 $x = 1$ 处检验：$\\frac{3 - 3 - 18}{6 - 54} = \\frac{-18}{-48} = \\frac{3}{8}$，$\\frac{1 + 2}{2(1 + 3)} = \\frac{3}{8}$。

> **注意。** 数也要约：$\\frac{x + 2}{x + 3}$ 忘了 $\\frac{3}{6} = \\frac{1}{2}$。每个数留在原来的一边：$3$ 在分子上，所以结果不是 $\\frac{2(x + 2)}{x + 3}$。保留因式的符号：$x - 2$ 和 $x + 2$ 不同。`,
      ),
      keyPrerequisites: ["factoring-trinomials-using-common-factors"],
      generate(rng) {
        for (;;) {
          const a = rng.nonZero(-8, 8);
          const b = rng.nonZero(-8, 8);
          const c = rng.nonZero(-8, 8);
          const k = rng.int(1, 6);
          const m = rng.int(1, 6);
          if (a === b || a === c || b === c || k === m || Math.max(k, m) === 1) continue;
          const tri = (s: number, u: number, v: number) => poly([s, "x^{2}"], [s * (u + v), "x"], [s * u * v, ""]);
          const expr = frac(tri(k, a, b), tri(m, a, c));
          const answer = ratio(k, [bin(b)], m, [bin(c)]);
          const factored = frac(product(k, [bin(a), bin(b)]), product(m, [bin(a), bin(c)]));
          return expressionProblem({
            prompt: simplifyPrompt(expr, [Q.of(-a), Q.of(-c)]),
            answer,
            lowest: true,
            wrong: [
              frac(bin(b), bin(c)),
              ratio(m, [bin(b)], k, [bin(c)]),
              ratio(k, [bin(-b)], m, [bin(-c)]),
              ratio(k, [bin(c)], m, [bin(b)]),
            ],
            solution: walked(
              [
                [
                  ["Take out the numbers", "提取公因数"],
                  t("Take out the common number:", "提取公因数："),
                  (
                    [
                      [k, b],
                      [m, c],
                    ] as const
                  )
                    .filter(([w]) => w !== 1)
                    .map(([w, v]) => `${tri(w, a, v)} = ${product(w, [tri(1, a, v)])}`),
                ],
                [
                  ["Factor and cancel", "分解并约分"],
                  t(
                    `Factor $${tri(1, a, b)} = ${prod2(bin(a), bin(b))}$ and $${tri(1, a, c)} = ${prod2(bin(a), bin(c))}$. Cancel $${bin(a)}$${reduceNote(k, m).en}:`,
                    `分解 $${tri(1, a, b)} = ${prod2(bin(a), bin(b))}$，$${tri(1, a, c)} = ${prod2(bin(a), bin(c))}$。约去 $${bin(a)}$${reduceNote(k, m)["zh-CN"]}：`,
                  ),
                  [`${expr} = ${factored} = ${answer}`],
                ],
              ],
              checkAt(
                (x) => [x + a, x + b, x + c],
                (x) => [ev(k * (x + a) * (x + b), m * (x + a) * (x + c)), ev(k * (x + b), m * (x + c))],
              ),
            ),
          });
        }
      },
    },
    {
      id: "opposite-factors-with-trinomials",
      title: t("Opposite factors", "互为相反数的因式"),
      explanation: t(
        `A difference written the other way round has the same size and the opposite sign: $4 - x = -(x - 4)$, so $16 - x^{2} = -(x^{2} - 16) = -(x - 4)(x + 4)$. Taking out $-1$ makes the factor match the one in the denominator, and then it cancels:

$$\\frac{16 - x^{2}}{x^{2} - 2x - 8} = \\frac{-(x - 4)(x + 4)}{(x - 4)(x + 2)} = -\\frac{x + 4}{x + 2}, \\quad x \\neq 4$$

Check at $x = 0$: $\\frac{16}{-8} = -2$ and $-\\frac{0 + 4}{0 + 2} = -2$.

> **Watch out.** Keep the $-1$: $\\frac{x + 4}{x + 2}$ is the opposite of the answer. $4 - x$ and $x - 4$ do not cancel to $1$; their quotient is $-1$. Cancel the matching factor $x - 4$, not $x + 4$.`,
        `顺序相反的差大小相同、符号相反：$4 - x = -(x - 4)$，所以 $16 - x^{2} = -(x^{2} - 16) = -(x - 4)(x + 4)$。提取 $-1$ 后，这个因式与分母中的因式相同，就可以约去：

$$\\frac{16 - x^{2}}{x^{2} - 2x - 8} = \\frac{-(x - 4)(x + 4)}{(x - 4)(x + 2)} = -\\frac{x + 4}{x + 2}, \\quad x \\neq 4$$

在 $x = 0$ 处检验：$\\frac{16}{-8} = -2$，$-\\frac{0 + 4}{0 + 2} = -2$。

> **注意。** 不要丢掉 $-1$：$\\frac{x + 4}{x + 2}$ 是答案的相反数。$4 - x$ 与 $x - 4$ 相除得 $-1$，不是 $1$。约去的是相同的因式 $x - 4$，不是 $x + 4$。`,
      ),
      keyPrerequisites: ["factoring-differences-of-squares"],
      generate(rng) {
        for (;;) {
          const b = rng.int(1, 9);
          const c = rng.nonZero(-9, 9);
          const k = rng.int(2, 7);
          if (c === b || c === -b) continue;
          const tri = poly([1, "x^{2}"], [c - b, "x"], [-b * c, ""]);
          const triF = `(${bin(-b)})(${bin(c)})`;
          const variant = rng.int(0, 2);
          if (variant === 0) {
            const expr = frac(`${b * b} - x^{2}`, tri);
            const answer = `-${frac(bin(b), bin(c))}`;
            return expressionProblem({
              prompt: simplifyPrompt(expr, [Q.of(b), Q.of(-c)]),
              answer,
              lowest: true,
              wrong: [frac(bin(b), bin(c)), `-${frac(bin(-b), bin(c))}`, frac(bin(-b), bin(c))],
              solution: walked(
                [
                  [
                    ["Take out −1", "提取 −1"],
                    t(
                      `Write $${b * b} - x^{2}$ as $-(x^{2} - ${b * b})$ and factor the difference of squares, so that the numerator shows the factor $${bin(-b)}$:`,
                      `把 $${b * b} - x^{2}$ 写成 $-(x^{2} - ${b * b})$，再按平方差分解，使分子出现因式 $${bin(-b)}$：`,
                    ),
                    [`${b * b} - x^{2} = -(${bin(-b)})(${bin(b)})`],
                  ],
                  [
                    ["Factor and cancel", "分解并约分"],
                    t(
                      `The denominator is $${triF}$. Cancel $${bin(-b)}$; the $-1$ stays in front:`,
                      `分母是 $${triF}$。约去 $${bin(-b)}$，$-1$ 留在前面：`,
                    ),
                    [`${expr} = ${frac(`-(${bin(-b)})(${bin(b)})`, triF)} = ${answer}`],
                  ],
                ],
                checkAt(
                  (x) => [x - b, x + b, x + c],
                  (x) => [ev(b * b - x * x, (x - b) * (x + c)), nev(x + b, x + c)],
                ),
              ),
            });
          }
          if (variant === 1) {
            const expr = frac(poly([k * b, ""], [-k, "x"]), tri);
            const answer = ratio(-k, [], 1, [bin(c)]);
            return expressionProblem({
              prompt: simplifyPrompt(expr, [Q.of(b), Q.of(-c)]),
              answer,
              lowest: true,
              wrong: [ratio(k, [], 1, [bin(c)]), ratio(-1, [], 1, [bin(c)]), ratio(-k, [], 1, [bin(-c)])],
              solution: walked(
                [
                  [
                    [`Take out ${-k}`, `提取 ${-k}`],
                    t(
                      `Take $${-k}$ out of the numerator, so that it shows the factor $${bin(-b)}$:`,
                      `从分子中提取 $${-k}$，使它出现因式 $${bin(-b)}$：`,
                    ),
                    [`${poly([k * b, ""], [-k, "x"])} = ${product(-k, [bin(-b)])}`],
                  ],
                  [
                    ["Factor and cancel", "分解并约分"],
                    t(
                      `The denominator is $${triF}$. Cancel $${bin(-b)}$; the $${-k}$ stays on top:`,
                      `分母是 $${triF}$。约去 $${bin(-b)}$，$${-k}$ 留在分子上：`,
                    ),
                    [`${expr} = ${frac(product(-k, [bin(-b)]), triF)} = ${answer}`],
                  ],
                ],
                checkAt(
                  (x) => [x - b, x + c],
                  (x) => [ev(k * b - k * x, (x - b) * (x + c)), ev(-k, x + c)],
                ),
              ),
            });
          }
          const expr = frac(tri, `${b * b} - x^{2}`);
          const answer = `-${frac(bin(c), bin(b))}`;
          return expressionProblem({
            prompt: simplifyPrompt(expr, [Q.of(b), Q.of(-b)]),
            answer,
            lowest: true,
            wrong: [frac(bin(c), bin(b)), `-${frac(bin(c), bin(-b))}`, frac(bin(c), bin(-b))],
            solution: walked(
              [
                [
                  ["Take out −1", "提取 −1"],
                  t(
                    `Write $${b * b} - x^{2}$ as $-(x^{2} - ${b * b})$ and factor the difference of squares, so that the denominator shows the factor $${bin(-b)}$:`,
                    `把 $${b * b} - x^{2}$ 写成 $-(x^{2} - ${b * b})$，再按平方差分解，使分母出现因式 $${bin(-b)}$：`,
                  ),
                  [`${b * b} - x^{2} = -(${bin(-b)})(${bin(b)})`],
                ],
                [
                  ["Factor and cancel", "分解并约分"],
                  t(
                    `The numerator is $${triF}$. Cancel $${bin(-b)}$; the $-1$ goes in front:`,
                    `分子是 $${triF}$。约去 $${bin(-b)}$，$-1$ 放到前面：`,
                  ),
                  [`${expr} = ${frac(triF, `-(${bin(-b)})(${bin(b)})`)} = ${answer}`],
                ],
              ],
              checkAt(
                (x) => [x - b, x + b, x + c],
                (x) => [ev((x - b) * (x + c), b * b - x * x), nev(x + c, x + b)],
              ),
            ),
          });
        }
      },
    },
  ],
};

export const splittingRationalExpressionsIntoTerms: TopicDef = {
  id: "splitting-rational-expressions-into-terms",
  title: t("Splitting Rational Expressions Into Separate Terms", "把分式拆成几项"),
  summary: t(
    "Divide each term of a polynomial by a monomial, and rewrite a fraction as a polynomial plus a simpler fraction.",
    "用单项式去除多项式的每一项，并把分式改写成多项式加上一个更简单的分式。",
  ),
  prerequisites: ["simplifying-rational-expressions"],
  encompasses: [
    { topic: "equivalent-expressions-with-fractions", weight: 0.4 },
    { topic: "product-and-quotient-rules", weight: 0.3 },
  ],
  xp: 13,
  standards: ["CCSS.HSA.APR.D.6", "CCSS.HSA.SSE.A.2"],
  intro: t(
    `Dividing a sum divides every part of it: $\\frac{10 + 4}{2} = \\frac{10}{2} + \\frac{4}{2} = 5 + 2$. A polynomial over a monomial splits the same way, one fraction per term:

$$\\frac{8x^{3} - 4x^{2} + 2x}{2x} = \\frac{8x^{3}}{2x} - \\frac{4x^{2}}{2x} + \\frac{2x}{2x} = 4x^{2} - 2x + 1$$

Check by multiplying back: $2x(4x^{2} - 2x + 1) = 8x^{3} - 4x^{2} + 2x$.

In this lesson we divide a polynomial by a monomial term by term, keep as a fraction a term that does not divide evenly, and write a fraction as a constant plus a simpler fraction.`,
    `一个和除以一个数，和的每一部分都要除：$\\frac{10 + 4}{2} = \\frac{10}{2} + \\frac{4}{2} = 5 + 2$。多项式除以单项式也这样拆，每一项各成一个分式：

$$\\frac{8x^{3} - 4x^{2} + 2x}{2x} = \\frac{8x^{3}}{2x} - \\frac{4x^{2}}{2x} + \\frac{2x}{2x} = 4x^{2} - 2x + 1$$

乘回去检验：$2x(4x^{2} - 2x + 1) = 8x^{3} - 4x^{2} + 2x$。

这节课我们用单项式逐项去除多项式，把不能整除的项保留为分式，并把一个分式写成常数加上一个更简单的分式。`,
  ),
  knowledgePoints: [
    {
      id: "polynomial-over-monomial",
      title: t("A polynomial over a monomial", "多项式除以单项式"),
      explanation: t(
        `A fraction whose numerator is a sum splits into one fraction per term, because $\\frac{a + b}{c} = \\frac{a}{c} + \\frac{b}{c}$: dividing a sum divides **every** term. Then simplify each term with the quotient rule, dividing the coefficients and subtracting the exponents:

$$\\frac{6x^{4} - 9x^{3} + 3x^{2}}{3x^{2}} = \\frac{6x^{4}}{3x^{2}} - \\frac{9x^{3}}{3x^{2}} + \\frac{3x^{2}}{3x^{2}} = 2x^{2} - 3x + 1$$

Check by multiplying back: $3x^{2}(2x^{2} - 3x + 1) = 6x^{4} - 9x^{3} + 3x^{2}$.

> **Watch out.** Divide every term, not just the first. A term divided by itself leaves $1$, not $0$ and not $x$. Do both parts of each term: divide the coefficient **and** subtract the exponent.`,
        `分子是和的分式可以拆成每一项各自的分式，因为 $\\frac{a + b}{c} = \\frac{a}{c} + \\frac{b}{c}$：一个和除以一个式子，**每一项**都要除。再用商的法则化简每一项：系数相除，指数相减：

$$\\frac{6x^{4} - 9x^{3} + 3x^{2}}{3x^{2}} = \\frac{6x^{4}}{3x^{2}} - \\frac{9x^{3}}{3x^{2}} + \\frac{3x^{2}}{3x^{2}} = 2x^{2} - 3x + 1$$

乘回去检验：$3x^{2}(2x^{2} - 3x + 1) = 6x^{4} - 9x^{3} + 3x^{2}$。

> **注意。** 每一项都要除，不能只除第一项。一项除以它自己得 $1$，不是 $0$，也不是 $x$。每一项的两部分都要处理：系数相除，**并且**指数相减。`,
      ),
      keyPrerequisites: ["product-and-quotient-rules"],
      generate(rng) {
        const d = rng.sign() * rng.int(1, 6);
        const m = rng.int(1, 3);
        const q2 = rng.nonZero(-6, 6);
        const q1 = rng.int(-6, 6);
        const q0 = rng.nonZero(-6, 6);
        const top = poly([d * q2, pw("x", m + 2)], [d * q1, pw("x", m + 1)], [d * q0, pw("x", m)]);
        const bottom = poly([d, pw("x", m)]);
        const expr = frac(top, bottom);
        const answer = poly([q2, "x^{2}"], [q1, "x"], [q0, ""]);
        const split = poly([d * q2, pw("x", m + 2)]);
        const terms = `${frac(split, bottom)} ${d * q1 === 0 ? "" : `${d * q1 < 0 ? "-" : "+"} ${frac(poly([Math.abs(d * q1), pw("x", m + 1)]), bottom)}`} ${d * q0 < 0 ? "-" : "+"} ${frac(poly([Math.abs(d * q0), pw("x", m)]), bottom)}`;
        return expressionProblem({
          prompt: t(`Simplify $${expr}$, where $x \\neq 0$.`, `化简 $${expr}$（$x \\neq 0$）。`),
          answer,
          simplified: true,
          wrong: [
            poly([q2, "x^{2}"], [q1, "x"]),
            poly([q2, "x^{2}"], [q1, "x"], [q0, "x"]),
            poly([q2, "x^{2}"], [d * q1, pw("x", m + 1)], [d * q0, pw("x", m)]),
            poly([q2, pw("x", m + 2)], [q1, pw("x", m + 1)], [q0, pw("x", m)]),
          ],
          solution: walked(
            [
              [
                ["Split", "拆分"],
                t(
                  `Dividing a sum divides every term, so give each term of the numerator the denominator $${bottom}$:`,
                  `一个和除以一个式子，每一项都要除，所以分子的每一项各自除以 $${bottom}$：`,
                ),
                [`${expr} = ${terms}`],
              ],
              [
                ["Divide each term", "逐项相除"],
                t(
                  `Divide each coefficient by $${d}$ and subtract $${m}$ from each exponent of $x$; in the last term the powers of $x$ cancel completely, leaving $${q0}$:`,
                  `每个系数除以 $${d}$，$x$ 的每个指数减去 $${m}$；最后一项中 $x$ 的幂完全约去，剩下 $${q0}$：`,
                ),
                [`${terms} = ${answer}`],
              ],
            ],
            t(`Multiply back: $${bottom}(${answer}) = ${top}$, the numerator.`, `乘回去：$${bottom}(${answer}) = ${top}$，正是分子。`),
          ),
        });
      },
    },
    {
      id: "terms-with-a-fraction-left-over",
      title: t("A fraction left over", "余下一个分式"),
      explanation: t(
        `Splitting works term by term, but a term of the numerator that the denominator does not divide evenly stays a fraction:

$$\\frac{4x^{2} - 6x + 5}{2x} = \\frac{4x^{2}}{2x} - \\frac{6x}{2x} + \\frac{5}{2x} = 2x - 3 + \\frac{5}{2x}$$

In the form $px + q + \\frac{r}{x}$, the last term is $\\frac{5}{2x} = \\frac{5}{2} \\cdot \\frac{1}{x}$, so $p = 2$, $q = -3$ and $r = \\frac{5}{2}$. Check by multiplying back: $2x(2x - 3) + 2x \\cdot \\frac{5}{2x} = 4x^{2} - 6x + 5$.

> **Watch out.** $r$ is the number over $x$ alone: $\\frac{5}{2x}$ means $r = \\frac{5}{2}$, not $5$ and not $10$. Divide every term by the coefficient $2$: $q$ is $-3$, not $-6$. Keep the signs.`,
        `拆分是逐项进行的，但分子中不能被分母整除的项仍保留为分式：

$$\\frac{4x^{2} - 6x + 5}{2x} = \\frac{4x^{2}}{2x} - \\frac{6x}{2x} + \\frac{5}{2x} = 2x - 3 + \\frac{5}{2x}$$

写成 $px + q + \\frac{r}{x}$ 的形式时，最后一项是 $\\frac{5}{2x} = \\frac{5}{2} \\cdot \\frac{1}{x}$，所以 $p = 2$，$q = -3$，$r = \\frac{5}{2}$。乘回去检验：$2x(2x - 3) + 2x \\cdot \\frac{5}{2x} = 4x^{2} - 6x + 5$。

> **注意。** $r$ 是单独除以 $x$ 的那个数：$\\frac{5}{2x}$ 对应 $r = \\frac{5}{2}$，不是 $5$，也不是 $10$。每一项都要除以系数 $2$：$q$ 是 $-3$，不是 $-6$。注意保留符号。`,
      ),
      generate(rng) {
        const d = rng.int(1, 5);
        const p = rng.nonZero(-6, 6);
        const q = rng.nonZero(-6, 6);
        const c = rng.nonZero(-12, 12);
        const expr = frac(poly([d * p, "x^{2}"], [d * q, "x"], [c, ""]), poly([d, "x"]));
        const r = Q.of(c, d);
        const target = rng.pick(["q", "r", "r"] as const);
        const split = `${poly([p, "x"], [q, ""])} ${c < 0 ? "-" : "+"} ${frac(String(Math.abs(c)), poly([d, "x"]))}`;
        const dx = poly([d, "x"]);
        const parts = `${frac(poly([d * p, "x^{2}"]), dx)} ${d * q < 0 ? "-" : "+"} ${frac(poly([Math.abs(d * q), "x"]), dx)} ${c < 0 ? "-" : "+"} ${frac(String(Math.abs(c)), dx)}`;
        const rTex = r.sign() < 0 ? `\\left(${num(r)}\\right)` : num(r);
        return numberProblem({
          prompt: t(
            `Write $${expr}$ in the form $px + q + \\frac{r}{x}$. Find $${target}$.`,
            `把 $${expr}$ 写成 $px + q + \\frac{r}{x}$ 的形式。求 $${target}$。`,
          ),
          answer: target === "q" ? q : r,
          solveFor: target,
          wrong: target === "q" ? [d * q, -q, p] : [c, c * d, r.neg(), Q.of(d, c)],
          solution: walked(
            [
              [
                ["Split", "拆分"],
                t(`Give each term of the numerator the denominator $${dx}$:`, `分子的每一项各自除以 $${dx}$：`),
                [`${expr} = ${parts}`],
              ],
              [
                ["Simplify each term", "逐项化简"],
                t(
                  `The first two terms divide evenly, but $${dx}$ does not divide $${c}$, so the last term stays a fraction:`,
                  `前两项能整除，但 $${c}$ 不能被 $${dx}$ 整除，所以最后一项仍是分式：`,
                ),
                [`${parts} = ${split}`],
              ],
              [
                ["Read off", "对照"],
                t(
                  `${d === 1 ? "" : `The last term is $${c < 0 ? "-" : ""}${frac(String(Math.abs(c)), dx)} = ${num(r)} \\cdot \\frac{1}{x}$. `}So $p = ${p}$, $q = ${q}$ and $r = ${num(r)}$, and the answer is $${target} = ${target === "q" ? q : num(r)}$.`,
                  `${d === 1 ? "" : `最后一项是 $${c < 0 ? "-" : ""}${frac(String(Math.abs(c)), dx)} = ${num(r)} \\cdot \\frac{1}{x}$。`}所以 $p = ${p}$，$q = ${q}$，$r = ${num(r)}$，答案是 $${target} = ${target === "q" ? q : num(r)}$。`,
                ),
              ],
            ],
            t(
              `Multiply back by $${dx}$: $${dx}(${poly([p, "x"], [q, ""])}) = ${poly([d * p, "x^{2}"], [d * q, "x"])}$ and $${dx} \\cdot ${rTex} \\cdot \\frac{1}{x} = ${c}$, which together rebuild the numerator $${poly([d * p, "x^{2}"], [d * q, "x"], [c, ""])}$.`,
              `乘回 $${dx}$：$${dx}(${poly([p, "x"], [q, ""])}) = ${poly([d * p, "x^{2}"], [d * q, "x"])}$，$${dx} \\cdot ${rTex} \\cdot \\frac{1}{x} = ${c}$，合起来正是分子 $${poly([d * p, "x^{2}"], [d * q, "x"], [c, ""])}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "a-constant-plus-a-fraction",
      title: t("A constant plus a fraction", "常数加一个分式"),
      explanation: t(
        `When the denominator is a binomial, the terms of the numerator cannot be divided one by one. Instead write the numerator as a multiple of the denominator plus what is left; the multiple then divides out exactly:

$$\\frac{3x + 7}{x + 2} = \\frac{3(x + 2) + 1}{x + 2} = \\frac{3(x + 2)}{x + 2} + \\frac{1}{x + 2} = 3 + \\frac{1}{x + 2}$$

The multiple is $3$ because the numerator has $3x$; then $3(x + 2) = 3x + 6$, and $7 - 6 = 1$ is left over. So $k = 3$ and $r = 1$. Check: $3(x + 2) + 1 = 3x + 7$, the numerator.

> **Watch out.** $r$ is what is left after taking $3(x + 2)$ away: subtract $3 \\cdot 2 = 6$ from $7$; adding gives $13$, and $7$ itself is not $r$. $k$ is the coefficient of $x$, $3$, not $\\frac{7}{2}$.`,
        `当分母是二项式时，分子的各项不能逐项去除。这时把分子写成分母的倍数加上余下的部分；倍数那部分正好约去：

$$\\frac{3x + 7}{x + 2} = \\frac{3(x + 2) + 1}{x + 2} = \\frac{3(x + 2)}{x + 2} + \\frac{1}{x + 2} = 3 + \\frac{1}{x + 2}$$

倍数是 $3$，因为分子中有 $3x$；于是 $3(x + 2) = 3x + 6$，余下 $7 - 6 = 1$。所以 $k = 3$，$r = 1$。检验：$3(x + 2) + 1 = 3x + 7$，正是分子。

> **注意。** $r$ 是去掉 $3(x + 2)$ 之后余下的部分：用 $7$ 减去 $3 \\cdot 2 = 6$；加上会得到 $13$，而 $7$ 本身也不是 $r$。$k$ 是 $x$ 的系数 $3$，不是 $\\frac{7}{2}$。`,
      ),
      generate(rng) {
        for (;;) {
          const a = rng.nonZero(-6, 6);
          const h = rng.nonZero(-9, 9);
          const b = rng.int(-15, 15);
          const r = b - a * h;
          if (r === 0) continue;
          const expr = frac(linear(a, b), bin(h));
          const askK = rng.bool(0.25);
          const work = [
            `${expr} = ${frac(`${product(a, [bin(h)])} ${r < 0 ? "-" : "+"} ${Math.abs(r)}`, bin(h))} = ${a}${r < 0 ? " - " : " + "}${frac(String(Math.abs(r)), bin(h))}`,
          ];
          return numberProblem({
            prompt: t(
              `Write $${expr}$ in the form $k + \\frac{r}{${bin(h)}}$. Find $${askK ? "k" : "r"}$.`,
              `把 $${expr}$ 写成 $k + \\frac{r}{${bin(h)}}$ 的形式。求 $${askK ? "k" : "r"}$。`,
            ),
            answer: askK ? a : r,
            solveFor: askK ? "k" : "r",
            wrong: askK ? [b, Q.of(b, h), -a] : [b, b + a * h, b - h, -r],
            solution: walked(
              [
                [
                  ["Match the denominator", "凑出分母"],
                  a === 1
                    ? t(
                        `The denominator $${bin(h)}$ has the same $x$-term as the numerator, and $${b} - ${paren(a * h)} = ${r}$ is left over:`,
                        `分母 $${bin(h)}$ 与分子的 $x$ 项相同，余下 $${b} - ${paren(a * h)} = ${r}$：`,
                      )
                    : t(
                        `$${product(a, [bin(h)])} = ${linear(a, a * h)}$ has the same $x$-term as the numerator, and $${b} - ${paren(a * h)} = ${r}$ is left over:`,
                        `$${product(a, [bin(h)])} = ${linear(a, a * h)}$ 与分子的 $x$ 项相同，余下 $${b} - ${paren(a * h)} = ${r}$：`,
                      ),
                  [`${linear(a, b)} = ${a === 1 ? `(${bin(h)})` : product(a, [bin(h)])} ${r < 0 ? "-" : "+"} ${Math.abs(r)}`],
                ],
                [
                  ["Split", "拆分"],
                  t("Split the fraction in two; the multiple of the denominator divides out:", "把分式拆成两个；分母的倍数那部分约去："),
                  work,
                ],
                [
                  ["Read off", "对照"],
                  t(
                    `So $k = ${a}$ and $r = ${r}$, and the answer is $${askK ? "k" : "r"} = ${askK ? a : r}$.`,
                    `所以 $k = ${a}$，$r = ${r}$，答案是 $${askK ? "k" : "r"} = ${askK ? a : r}$。`,
                  ),
                ],
              ],
              t(
                `Put it back together: $${a === 1 ? `(${bin(h)})` : product(a, [bin(h)])} ${r < 0 ? "-" : "+"} ${Math.abs(r)}${a === 1 ? "" : ` = ${linear(a, a * h)} ${r < 0 ? "-" : "+"} ${Math.abs(r)}`} = ${linear(a, b)}$, the numerator.`,
                `合回去：$${a === 1 ? `(${bin(h)})` : product(a, [bin(h)])} ${r < 0 ? "-" : "+"} ${Math.abs(r)}${a === 1 ? "" : ` = ${linear(a, a * h)} ${r < 0 ? "-" : "+"} ${Math.abs(r)}`} = ${linear(a, b)}$，正是分子。`,
              ),
            ),
          });
        }
      },
    },
  ],
};

/** prod2 writes the product of two binomials: "(x + 1)(x - 2)", "x(x + 3)". */
const prod2 = (a: string, b: string) => product(1, [a, b]);

/** overProduct writes c₁x + c₀ over a product of factors, in lowest terms when they share no factor. */
function overProduct(c1: number, c0: number, factors: readonly string[]): string {
  if (c1 === 0) return ratio(c0, [], 1, factors);
  return frac(linear(c1, c0), product(1, factors));
}

export const addingAndSubtractingRationalExpressions: TopicDef = {
  id: "adding-and-subtracting-rational-expressions",
  title: t("Adding and Subtracting Rational Expressions", "分式的加减"),
  summary: t(
    "Add and subtract rational expressions with the same denominator, with monomial denominators, and with denominators that share a factor, using the least common denominator.",
    "加减同分母的分式、分母是单项式的分式，以及分母有公因式的分式，使用最简公分母。",
  ),
  prerequisites: ["simplifying-rational-expressions-by-factoring", "the-least-common-multiple-of-two-polynomials"],
  encompasses: [
    { topic: "simplifying-rational-expressions-by-factoring", weight: 0.3 },
    { topic: "equivalent-expressions-with-fractions", weight: 0.4 },
    { topic: "adding-and-subtracting-fractions", weight: 0.3 },
    { topic: "the-least-common-multiple-of-two-polynomials", weight: 0.4 },
  ],
  xp: 16,
  standards: ["CCSS.HSA.APR.D.7"],
  intro: t(
    `Fractions are added only once they show the same denominator: $\\frac{1}{6} + \\frac{1}{4} = \\frac{2}{12} + \\frac{3}{12} = \\frac{5}{12}$. Rational expressions work the same way; the common denominator is built from the factors of the denominators:

$$\\frac{3}{x} + \\frac{2}{x^{2}} = \\frac{3x}{x^{2}} + \\frac{2}{x^{2}} = \\frac{3x + 2}{x^{2}}$$

Check at $x = 2$: $\\frac{3}{2} + \\frac{2}{4} = 2$ and $\\frac{6 + 2}{4} = 2$.

In this lesson we add and subtract rational expressions with the same denominator, with monomial denominators, and with denominators that share a factor.`,
    `分数要化成同分母才能相加：$\\frac{1}{6} + \\frac{1}{4} = \\frac{2}{12} + \\frac{3}{12} = \\frac{5}{12}$。分式也一样，公分母由各分母的因式组成：

$$\\frac{3}{x} + \\frac{2}{x^{2}} = \\frac{3x}{x^{2}} + \\frac{2}{x^{2}} = \\frac{3x + 2}{x^{2}}$$

在 $x = 2$ 处检验：$\\frac{3}{2} + \\frac{2}{4} = 2$，$\\frac{6 + 2}{4} = 2$。

这节课我们加减三种分式：同分母的，分母是单项式的，以及分母有公因式的。`,
  ),
  knowledgePoints: [
    {
      id: "the-same-denominator",
      title: t("The same denominator", "同分母"),
      explanation: t(
        `The denominator names the size of the parts and the numerator counts them, so fractions with the same denominator combine by adding or subtracting the numerators over that denominator, $\\frac{a}{c} \\pm \\frac{b}{c} = \\frac{a \\pm b}{c}$. When subtracting, the minus sign applies to **every** term of the second numerator:

$$\\frac{2x + 1}{x - 3} - \\frac{x - 2}{x - 3} = \\frac{2x + 1 - (x - 2)}{x - 3} = \\frac{2x + 1 - x + 2}{x - 3} = \\frac{x + 3}{x - 3}$$

Check at $x = 4$: $\\frac{9}{1} - \\frac{2}{1} = 7$ and $\\frac{4 + 3}{4 - 3} = 7$.

Then simplify if you can: $\\frac{x^{2}}{x + 4} - \\frac{16}{x + 4} = \\frac{(x + 4)(x - 4)}{x + 4} = x - 4$.

> **Watch out.** Subtract the whole second numerator: $2x + 1 - x - 2 = x - 1$ forgets to change the sign of $-2$. Keep the denominator: adding the denominators to get $2x - 6$ is wrong. Simplify at the end when the numerator factors.`,
        `分母表示每份的大小，分子表示有几份，所以同分母的分式相加减，就把分子相加减，分母不变：$\\frac{a}{c} \\pm \\frac{b}{c} = \\frac{a \\pm b}{c}$。做减法时，减号要作用在第二个分子的**每一项**上：

$$\\frac{2x + 1}{x - 3} - \\frac{x - 2}{x - 3} = \\frac{2x + 1 - (x - 2)}{x - 3} = \\frac{2x + 1 - x + 2}{x - 3} = \\frac{x + 3}{x - 3}$$

在 $x = 4$ 处检验：$\\frac{9}{1} - \\frac{2}{1} = 7$，$\\frac{4 + 3}{4 - 3} = 7$。

能化简就化简：$\\frac{x^{2}}{x + 4} - \\frac{16}{x + 4} = \\frac{(x + 4)(x - 4)}{x + 4} = x - 4$。

> **注意。** 要减去整个第二个分子：$2x + 1 - x - 2 = x - 1$ 忘了改变 $-2$ 的符号。分母保持不变：把分母相加得到 $2x - 6$ 是错的。分子能分解时，最后要化简。`,
      ),
      generate(rng) {
        for (;;) {
          const h = rng.nonZero(-9, 9);
          const D = bin(h);
          const variant = rng.pick([0, 0, 1, 2]);
          if (variant === 2) {
            const expr = `${frac("x^{2}", D)} - ${frac(String(h * h), D)}`;
            const answer = bin(-h);
            return expressionProblem({
              prompt: simplifyPrompt(expr, [Q.of(-h)]),
              answer,
              lowest: true,
              wrong: [bin(h), frac(`x^{2} - ${h * h}`, D), frac(poly([1, "x^{2}"], [-h * h, ""]), linear(2, 2 * h))],
              solution: walked(
                [
                  [
                    ["Combine the numerators", "合并分子"],
                    t(
                      "The denominators are the same, so subtract the numerators and keep the denominator:",
                      "分母相同，分子相减，分母不变：",
                    ),
                    [`${expr} = ${frac(`x^{2} - ${h * h}`, D)}`],
                  ],
                  [
                    ["Factor and cancel", "分解并约分"],
                    t(
                      "The numerator is a difference of squares, and one of its factors is the denominator:",
                      "分子是平方差，其中一个因式正是分母：",
                    ),
                    [`${frac(`x^{2} - ${h * h}`, D)} = ${frac(`(${bin(h)})(${bin(-h)})`, D)} = ${answer}`],
                  ],
                ],
                checkAt(
                  (x) => [x + h, x - h],
                  (x) => [
                    `${fr(x * x, x + h)} - ${fr(h * h, x + h)} = ${num(Q.of(x * x - h * h, x + h))}`,
                    `${x} ${h > 0 ? "-" : "+"} ${Math.abs(h)} = ${x - h}`,
                  ],
                ),
              ),
            });
          }
          const minus = rng.bool();
          const p = rng.nonZero(-6, 6);
          const r = rng.int(-9, 9);
          let u: number;
          let v: number;
          if (variant === 1) {
            u = rng.nonZero(-5, 5);
            v = u * h;
          } else {
            u = rng.nonZero(-6, 6);
            v = rng.int(-12, 12);
            if (v === u * h) continue;
          }
          const q = minus ? p - u : u - p;
          const s = minus ? r - v : v - r;
          if (q === 0 && s === 0) continue;
          const second = q === 0 ? String(s) : linear(q, s);
          const op = minus ? "-" : "+";
          const expr = `${frac(linear(p, r), D)} ${op} ${frac(second, D)}`;
          const answer = v === u * h ? String(u) : frac(linear(u, v), D);
          const combined = minus
            ? `${linear(p, r)} - ${second.startsWith("-") ? `(${second})` : grp(second)}`
            : `${linear(p, r)} + ${second.startsWith("-") ? `(${second})` : second}`;
          const wrongSign = minus ? frac(linear(p - q, r + s), D) : frac(linear(p + q, r - s), D);
          return expressionProblem({
            prompt: simplifyPrompt(expr, [Q.of(-h)]),
            answer,
            lowest: true,
            wrong: [wrongSign, frac(linear(u, v), linear(2, 2 * h)), frac(linear(u, v), D)],
            solution: walked(
              [
                [
                  ["Combine the numerators", "合并分子"],
                  minus
                    ? t(
                        "Subtract the numerators over the common denominator; the minus sign applies to the whole second numerator:",
                        "分母不变，分子相减；减号作用于整个第二个分子：",
                      )
                    : t("Add the numerators over the common denominator:", "分母不变，分子相加："),
                  [`${expr} = ${frac(combined, D)}`],
                ],
                [
                  ["Collect like terms", "合并同类项"],
                  v === u * h
                    ? t(
                        `Collect like terms. The numerator $${linear(u, v)}$ is $${u}$ times the denominator, so the denominator cancels:`,
                        `合并同类项。分子 $${linear(u, v)}$ 是分母的 $${u}$ 倍，所以分母约去：`,
                      )
                    : t("Collect like terms; the numerator shares no factor with the denominator:", "合并同类项；分子与分母没有公因式："),
                  [`${frac(combined, D)} = ${frac(linear(u, v), D)}${answer === frac(linear(u, v), D) ? "" : ` = ${answer}`}`],
                ],
              ],
              checkAt(
                (x) => [x + h, u * x + v],
                (x) => [
                  `${fr(p * x + r, x + h)} ${op} ${fr(q * x + s, x + h)} = ${num(Q.of(u * x + v, x + h))}`,
                  v === u * h ? String(u) : ev(u * x + v, x + h),
                ],
              ),
            ),
          });
        }
      },
    },
    {
      id: "monomial-denominators",
      title: t("Monomial denominators", "单项式分母"),
      explanation: t(
        `A common denominator must be a multiple of each denominator, and the least one keeps the numbers small. For monomials, take the least common multiple of the numbers and the highest power of each variable. Then multiply the top and bottom of each fraction by what its denominator lacks, and combine:

$$\\frac{5}{6x} + \\frac{3}{4x^{2}} = \\frac{5 \\cdot 2x}{12x^{2}} + \\frac{3 \\cdot 3}{12x^{2}} = \\frac{10x + 9}{12x^{2}}$$

Here the LCD is $12x^{2}$: $6x$ lacks $2x$, and $4x^{2}$ lacks $3$. Check at $x = 1$: $\\frac{5}{6} + \\frac{3}{4} = \\frac{19}{12}$ and $\\frac{10 + 9}{12} = \\frac{19}{12}$.

> **Watch out.** Scale each numerator by the same factor as its denominator: adding the numerators straight away gives $\\frac{8}{12x^{2}}$, which is wrong. Do not add the denominators. The product $24x^{3}$ is a common denominator, but not the least, and the result then has to be reduced.`,
        `公分母必须是每个分母的倍数，取最小的那个能让数保持较小。单项式的最简公分母取各数的最小公倍数，以及每个变量的最高次幂。再把每个分式的分子分母同乘它的分母所缺的部分，然后合并：

$$\\frac{5}{6x} + \\frac{3}{4x^{2}} = \\frac{5 \\cdot 2x}{12x^{2}} + \\frac{3 \\cdot 3}{12x^{2}} = \\frac{10x + 9}{12x^{2}}$$

这里最简公分母是 $12x^{2}$：$6x$ 缺 $2x$，$4x^{2}$ 缺 $3$。在 $x = 1$ 处检验：$\\frac{5}{6} + \\frac{3}{4} = \\frac{19}{12}$，$\\frac{10 + 9}{12} = \\frac{19}{12}$。

> **注意。** 分子要乘以和它的分母相同的因式：直接把分子相加得到 $\\frac{8}{12x^{2}}$，是错的。不要把分母相加。乘积 $24x^{3}$ 也是公分母，但不是最简的，最后还得约分。`,
      ),
      keyPrerequisites: ["least-common-multiple"],
      generate(rng) {
        const [m, n] = rng.sample([1, 2, 3, 4, 5, 6, 8, 9, 10], 2) as [number, number];
        // Each fraction starts in lowest terms: a numerator shares no factor with its coefficient.
        let a = rng.nonZero(-9, 9);
        while (gcd(Math.abs(a), m) > 1) a += a > 0 ? 1 : -1;
        let b = rng.int(1, 9);
        while (gcd(b, n) > 1) b += 1;
        const minus = rng.bool();
        const sg = minus ? -1 : 1;
        const op = minus ? "-" : "+";
        const L = lcm(m, n);
        const twoVars = rng.bool(0.4);
        const c1 = a * (L / m);
        const c0 = sg * b * (L / n);
        const g = gcd(gcd(c1, c0), L);
        const [vy, dx] = twoVars ? ["y", "xy"] : ["x", "x^{2}"];
        const second = twoVars ? poly([n, "y"]) : poly([n, "x^{2}"]);
        const expr = `${frac(String(a), poly([m, "x"]))} ${op} ${frac(String(b), second)}`;
        const top = twoVars ? poly([c1 / g, "y"], [c0 / g, "x"]) : linear(c1 / g, c0 / g);
        const answer = frac(top, poly([L / g, dx]));
        const raw = twoVars ? poly([c1, "y"], [c0, "x"]) : linear(c1, c0);
        const lcdTex = poly([L, dx]);
        const scaled2 = twoVars ? poly([b * (L / n), "x"]) : String(b * (L / n));
        const work = [
          `${expr} = ${frac(poly([c1, vy]), lcdTex)} ${op} ${frac(scaled2, lcdTex)} = ${frac(raw, lcdTex)}${g === 1 ? "" : ` = ${answer}`}`,
        ];
        return expressionProblem({
          prompt: t(
            `Simplify $${expr}$, where ${twoVars ? "$x \\neq 0$ and $y \\neq 0$" : "$x \\neq 0$"}.`,
            `化简 $${expr}$（${twoVars ? "$x \\neq 0$，$y \\neq 0$" : "$x \\neq 0$"}）。`,
          ),
          answer,
          lowest: true,
          wrong: [
            ...(a + sg * b !== 0 ? [frac(String(a + sg * b), lcdTex), frac(String(a + sg * b), poly([m + n, dx]))] : []),
            frac(twoVars ? poly([a * n, "y"], [sg * b * m, "x"]) : linear(a * n, sg * b * m), poly([m * n, twoVars ? "x^{2}y" : "x^{3}"])),
            frac(twoVars ? poly([c1, "x"], [c0, "y"]) : linear(c0, c1), poly([L, dx])),
          ],
          solution: walked(
            [
              [
                ["Find the LCD", "求最简公分母"],
                t(
                  `The least common multiple of $${m}$ and $${n}$ is $${L}$, and the highest power of each variable is ${twoVars ? "$x$ and $y$" : "$x^{2}$"}, so the least common denominator is $${lcdTex}$.`,
                  `$${m}$ 与 $${n}$ 的最小公倍数是 $${L}$，各字母的最高次幂是 ${twoVars ? "$x$ 和 $y$" : "$x^{2}$"}，所以最简公分母是 $${lcdTex}$。`,
                ),
              ],
              [
                ["Rewrite and combine", "通分并合并"],
                t(
                  `Multiply the top and bottom of each fraction by what its denominator lacks, $${poly([L / m, vy])}$ and $${twoVars ? poly([L / n, "x"]) : L / n}$, then combine the numerators${g === 1 ? "" : ` and divide out the common factor $${g}$`}:`,
                  `每个分式的分子分母同乘它的分母所缺的部分，分别是 $${poly([L / m, vy])}$ 和 $${twoVars ? poly([L / n, "x"]) : L / n}$，再合并分子${g === 1 ? "" : `，并约去公因数 $${g}$`}：`,
                ),
                work,
              ],
            ],
            agree(
              twoVars ? "x = 2, y = 3" : "x = 2",
              `${fr(a, 2 * m)} ${op} ${fr(b, twoVars ? 3 * n : 4 * n)} = ${num(Q.of(a, 2 * m).add(Q.of(sg * b, twoVars ? 3 * n : 4 * n)))}`,
              ev(twoVars ? (c1 / g) * 3 + (c0 / g) * 2 : (c1 / g) * 2 + c0 / g, (L / g) * (twoVars ? 6 : 4)),
            ),
          ),
        });
      },
    },
    {
      id: "denominators-with-a-common-factor",
      title: t("Denominators with a common factor", "分母有公因式"),
      explanation: t(
        `Factor the denominators first: the LCD must contain every factor that appears, each as often as it appears in any one denominator, and a factor shared by two denominators is counted only once. Here $x^{2} - 9 = (x + 3)(x - 3)$ already contains $x + 3$, so it is the LCD itself:

$$\\frac{4}{x^{2} - 9} + \\frac{1}{x + 3} = \\frac{4}{(x + 3)(x - 3)} + \\frac{x - 3}{(x + 3)(x - 3)} = \\frac{x + 1}{(x + 3)(x - 3)}$$

Check at $x = 0$: $\\frac{4}{-9} + \\frac{1}{3} = -\\frac{1}{9}$ and $\\frac{0 + 1}{3 \\cdot (-3)} = -\\frac{1}{9}$. Multiplying the denominators, $(x^{2} - 9)(x + 3)$, also works, but then the result has to be simplified.

> **Watch out.** Scale the numerator before combining: $\\frac{4 + 1}{(x + 3)(x - 3)}$ forgets the factor $x - 3$. Multiply every term: $2(x - 3)$ is $2x - 6$, not $2x - 3$. A minus sign in front changes the sign of both terms of the scaled numerator.`,
        `先把分母分解因式：最简公分母包含出现过的每一个因式，次数取它在各个分母中出现的最高次数，两个分母共有的因式只算一次。这里 $x^{2} - 9 = (x + 3)(x - 3)$ 已经含有 $x + 3$，所以它本身就是最简公分母：

$$\\frac{4}{x^{2} - 9} + \\frac{1}{x + 3} = \\frac{4}{(x + 3)(x - 3)} + \\frac{x - 3}{(x + 3)(x - 3)} = \\frac{x + 1}{(x + 3)(x - 3)}$$

在 $x = 0$ 处检验：$\\frac{4}{-9} + \\frac{1}{3} = -\\frac{1}{9}$，$\\frac{0 + 1}{3 \\cdot (-3)} = -\\frac{1}{9}$。直接用两个分母的积 $(x^{2} - 9)(x + 3)$ 作公分母也可以，但最后还需要化简。

> **注意。** 合并之前先把分子乘上所缺的因式：$\\frac{4 + 1}{(x + 3)(x - 3)}$ 漏乘了 $x - 3$。每一项都要乘：$2(x - 3)$ 是 $2x - 6$，不是 $2x - 3$。前面是减号时，乘出来的分子两项都要变号。`,
      ),
      keyPrerequisites: ["factoring-trinomials"],
      generate(rng) {
        for (;;) {
          const p = rng.nonZero(-9, 9);
          const q = rng.nonZero(-9, 9);
          if (p === q || Math.abs(p * q) > 40) continue;
          const a = rng.nonZero(-9, 9);
          const b = rng.int(1, 6);
          const minus = rng.bool();
          const sg = minus ? -1 : 1;
          const op = minus ? "-" : "+";
          // a/((x + p)(x + q)) ± b/(x + p) = (a ± b(x + q)) / ((x + p)(x + q))
          const c1 = sg * b;
          const c0 = a + sg * b * q;
          const shares = (r: number) => c1 * r + c0 === 0;
          if (shares(-p) || shares(-q)) continue;
          const tri = q === -p ? `x^{2} - ${p * p}` : poly([1, "x^{2}"], [p + q, "x"], [p * q, ""]);
          const factors = [bin(p), bin(q)];
          const expr = `${frac(String(a), tri)} ${op} ${frac(String(b), bin(p))}`;
          const answer = overProduct(c1, c0, factors);
          const lcd = prod2(bin(p), bin(q));
          const scaled = b === 1 ? `(${bin(q)})` : product(b, [bin(q)]);
          return expressionProblem({
            prompt: simplifyPrompt(expr, [Q.of(-p), Q.of(-q)]),
            answer,
            lowest: true,
            wrong: [
              ...(a + sg * b !== 0 ? [ratio(a + sg * b, [], 1, factors)] : []),
              overProduct(c1, a + sg * b, factors),
              overProduct(c1, a - sg * b * q, factors),
            ],
            solution: walked(
              [
                [["Factor the denominator", "分解分母"], t("Factor the first denominator:", "把第一个分母分解因式："), [`${tri} = ${lcd}`]],
                [
                  ["Rewrite", "通分"],
                  t(
                    `It already contains the other denominator $${bin(p)}$, so it is the least common denominator. Multiply the second fraction by $${frac(bin(q), bin(q))}$:`,
                    `它已经含有另一个分母 $${bin(p)}$，所以它就是最简公分母。把第二个分式的分子分母同乘 $${bin(q)}$：`,
                  ),
                  [`${expr} = ${frac(String(a), lcd)} ${op} ${frac(product(b, [bin(q)]), lcd)}`],
                ],
                [
                  ["Combine", "合并"],
                  t(
                    `${minus ? "Subtract" : "Add"} the numerators: $${a} ${op} ${scaled} = ${linear(c1, c0)}$, which shares no factor with the denominator:`,
                    `分子${minus ? "相减" : "相加"}：$${a} ${op} ${scaled} = ${linear(c1, c0)}$，与分母没有公因式：`,
                  ),
                  [`${frac(`${a} ${op} ${scaled}`, lcd)} = ${answer}`],
                ],
              ],
              checkAt(
                (x) => [x + p, x + q, c1 * x + c0],
                (x) => [
                  `${fr(a, (x + p) * (x + q))} ${op} ${fr(b, x + p)} = ${num(Q.of(c1 * x + c0, (x + p) * (x + q)))}`,
                  ev(c1 * x + c0, (x + p) * (x + q)),
                ],
              ),
            ),
          });
        }
      },
    },
  ],
};

export const addingRationalExpressionsWithUnlikeDenominators: TopicDef = {
  id: "adding-rational-expressions-with-unlike-denominators",
  title: t("Adding Rational Expressions With No Common Factors in the Denominator", "分母没有公因式的分式相加"),
  summary: t(
    "Add and subtract rational expressions whose denominators share no factor, using their product as the common denominator, including a polynomial plus a fraction.",
    "加减分母没有公因式的分式，以分母之积为公分母，包括多项式与分式相加。",
  ),
  prerequisites: ["adding-and-subtracting-rational-expressions"],
  encompasses: [
    { topic: "adding-and-subtracting-rational-expressions", weight: 0.5 },
    { topic: "multiplying-binomials", weight: 0.3 },
    { topic: "distributive-law-for-polynomials", weight: 0.2 },
  ],
  xp: 16,
  standards: ["CCSS.HSA.APR.D.7"],
  intro: t(
    `When two denominators share no factor, the least common denominator is their product, just as $\\frac{1}{2} + \\frac{1}{3} = \\frac{3 + 2}{6}$. Each numerator is multiplied by the other denominator:

$$\\frac{1}{x} + \\frac{1}{x + 1} = \\frac{(x + 1) + x}{x(x + 1)} = \\frac{2x + 1}{x(x + 1)}$$

Check at $x = 1$: $1 + \\frac{1}{2} = \\frac{3}{2}$ and $\\frac{2 + 1}{1 \\cdot 2} = \\frac{3}{2}$.

In this lesson we add and subtract fractions with two binomial denominators, with leading coefficients in the denominators, with binomial numerators, and a polynomial plus a fraction.`,
    `当两个分母没有公因式时，最简公分母就是它们的积，正如 $\\frac{1}{2} + \\frac{1}{3} = \\frac{3 + 2}{6}$。每个分子都乘以另一个分母：

$$\\frac{1}{x} + \\frac{1}{x + 1} = \\frac{(x + 1) + x}{x(x + 1)} = \\frac{2x + 1}{x(x + 1)}$$

在 $x = 1$ 处检验：$1 + \\frac{1}{2} = \\frac{3}{2}$，$\\frac{2 + 1}{1 \\cdot 2} = \\frac{3}{2}$。

这节课我们加减分母是两个二项式的分式、分母带首项系数的分式、分子是二项式的分式，以及多项式与分式之和。`,
  ),
  knowledgePoints: [
    {
      id: "two-binomial-denominators",
      title: t("Two binomial denominators", "两个二项式分母"),
      explanation: t(
        `When the denominators have no common factor, their product is the least common denominator. Multiplying a fraction by $\\frac{x - 4}{x - 4} = 1$ does not change it, so multiply each numerator by the **other** denominator:

$$\\frac{2}{x + 1} + \\frac{3}{x - 4} = \\frac{2(x - 4) + 3(x + 1)}{(x + 1)(x - 4)} = \\frac{2x - 8 + 3x + 3}{(x + 1)(x - 4)} = \\frac{5x - 5}{(x + 1)(x - 4)}$$

Check at $x = 0$: $2 + \\frac{3}{-4} = \\frac{5}{4}$ and $\\frac{-5}{1 \\cdot (-4)} = \\frac{5}{4}$. Leave the denominator factored: it shows at once that nothing cancels.

> **Watch out.** Multiply each numerator by the other denominator, not its own: $2(x + 1) + 3(x - 4)$ is wrong. Do not just add the numerators over the product, $\\frac{5}{(x + 1)(x - 4)}$, and do not add the denominators.`,
        `当两个分母没有公因式时，它们的积就是最简公分母。分式乘以 $\\frac{x - 4}{x - 4} = 1$ 不改变它的值，所以每个分子都乘以**另一个**分母：

$$\\frac{2}{x + 1} + \\frac{3}{x - 4} = \\frac{2(x - 4) + 3(x + 1)}{(x + 1)(x - 4)} = \\frac{2x - 8 + 3x + 3}{(x + 1)(x - 4)} = \\frac{5x - 5}{(x + 1)(x - 4)}$$

在 $x = 0$ 处检验：$2 + \\frac{3}{-4} = \\frac{5}{4}$，$\\frac{-5}{1 \\cdot (-4)} = \\frac{5}{4}$。分母保持分解的形式：一眼就能看出没有可以约去的因式。

> **注意。** 每个分子乘以另一个分母，而不是它自己的分母：$2(x + 1) + 3(x - 4)$ 是错的。不能只把分子相加放在积上得 $\\frac{5}{(x + 1)(x - 4)}$，也不能把分母相加。`,
      ),
      generate(rng) {
        for (;;) {
          const p = rng.int(-9, 9);
          const q = rng.int(-9, 9);
          const a = rng.nonZero(-9, 9);
          const b = rng.int(1, 9);
          if (p === q) continue;
          const minus = rng.bool();
          const sg = minus ? -1 : 1;
          const op = minus ? "-" : "+";
          const c1 = a + sg * b;
          const c0 = a * q + sg * b * p;
          const expr = `${frac(String(a), bin(p))} ${op} ${frac(String(b), bin(q))}`;
          const factors = [bin(p), bin(q)];
          const answer = overProduct(c1, c0, factors);
          const lcd = product(1, factors);
          const first = `${product(a, [bin(q)])} ${op} ${b === 1 && p !== 0 ? `(${bin(p)})` : product(b, [bin(p)])}`;
          const expanded = `${linear(a, a * q)} ${op} ${grp(linear(b, b * p))}`;
          return expressionProblem({
            prompt: simplifyPrompt(expr, [Q.of(-p), Q.of(-q)]),
            answer,
            lowest: true,
            wrong: [
              ...(c1 !== 0 ? [ratio(c1, [], 1, factors), frac(String(c1), linear(2, p + q))] : []),
              overProduct(c1, a * q - sg * b * p, factors),
              overProduct(c1, a * p + sg * b * q, factors),
            ],
            solution: walked(
              [
                [
                  ["Find the LCD", "求公分母"],
                  t(
                    `$${bin(p)}$ and $${bin(q)}$ share no factor, so the least common denominator is their product. Multiply each numerator by the other denominator:`,
                    `$${bin(p)}$ 与 $${bin(q)}$ 没有公因式，所以最简公分母是它们的积。每个分子乘以另一个分母：`,
                  ),
                  [`${expr} = ${frac(first, lcd)}`],
                ],
                [
                  ["Expand and combine", "展开并合并"],
                  t("Expand both products and collect like terms:", "展开两个乘积，合并同类项："),
                  [`${frac(first, lcd)}${expanded === first ? "" : ` = ${frac(expanded, lcd)}`} = ${answer}`],
                ],
              ],
              checkAt(
                (x) => [x + p, x + q, c1 * x + c0],
                (x) => [
                  `${fr(a, x + p)} ${op} ${fr(b, x + q)} = ${num(Q.of(c1 * x + c0, (x + p) * (x + q)))}`,
                  ev(c1 * x + c0, (x + p) * (x + q)),
                ],
              ),
            ),
          });
        }
      },
    },
    {
      id: "leading-coefficients-in-denominators",
      title: t("Leading coefficients in the denominators", "分母带首项系数"),
      explanation: t(
        `The same method works whatever the denominators look like, as long as they share no factor: the product is the LCD, and each numerator is multiplied by the other denominator, leading coefficient included:

$$\\frac{1}{2x + 1} + \\frac{3}{x - 2} = \\frac{(x - 2) + 3(2x + 1)}{(2x + 1)(x - 2)} = \\frac{x - 2 + 6x + 3}{(2x + 1)(x - 2)} = \\frac{7x + 1}{(2x + 1)(x - 2)}$$

Check at $x = 0$: $1 + \\frac{3}{-2} = -\\frac{1}{2}$ and $\\frac{1}{1 \\cdot (-2)} = -\\frac{1}{2}$.

> **Watch out.** Multiply the leading coefficient too: $3(2x + 1) = 6x + 3$, so the $x$-term is $6x$, not $3x$. When subtracting, put the second product in parentheses before distributing the minus sign, so that both of its terms change sign.`,
        `无论分母是什么样子，只要没有公因式，方法都一样：两分母之积就是最简公分母，每个分子都乘以另一个分母，首项系数也要乘：

$$\\frac{1}{2x + 1} + \\frac{3}{x - 2} = \\frac{(x - 2) + 3(2x + 1)}{(2x + 1)(x - 2)} = \\frac{x - 2 + 6x + 3}{(2x + 1)(x - 2)} = \\frac{7x + 1}{(2x + 1)(x - 2)}$$

在 $x = 0$ 处检验：$1 + \\frac{3}{-2} = -\\frac{1}{2}$，$\\frac{1}{1 \\cdot (-2)} = -\\frac{1}{2}$。

> **注意。** 首项系数也要乘：$3(2x + 1) = 6x + 3$，所以 $x$ 项是 $6x$，不是 $3x$。做减法时，先给第二个乘积加上括号，再把减号分配进去，使它的两项都变号。`,
      ),
      generate(rng) {
        for (;;) {
          const [m, p] = drawLin(rng, [2, 3, 4, 5]);
          const q = rng.int(-9, 9);
          const a = rng.nonZero(-9, 9);
          const b = rng.int(1, 9);
          if (p === m * q) continue;
          const minus = rng.bool();
          const sg = minus ? -1 : 1;
          const op = minus ? "-" : "+";
          const L = linear(m, p);
          // a/(mx + p) ± b/(x + q) = (a(x + q) ± b(mx + p)) / ((mx + p)(x + q))
          const c1 = a + sg * b * m;
          const c0 = a * q + sg * b * p;
          const factors = [L, bin(q)];
          const expr = `${frac(String(a), L)} ${op} ${frac(String(b), bin(q))}`;
          const answer = overProduct(c1, c0, factors);
          const lcd = product(1, factors);
          const first = `${product(a, [bin(q)])} ${op} ${b === 1 ? `(${L})` : product(b, [L])}`;
          const expanded = `${linear(a, a * q)} ${op} ${grp(linear(b * m, b * p))}`;
          return expressionProblem({
            prompt: simplifyPrompt(expr, [Q.of(-p, m), Q.of(-q)]),
            answer,
            lowest: true,
            wrong: [
              overProduct(a + sg * b, c0, factors),
              overProduct(c1, a * q + b * p * -sg, factors),
              ...(a + sg * b !== 0 ? [ratio(a + sg * b, [], 1, factors)] : []),
            ],
            solution: walked(
              [
                [
                  ["Find the LCD", "求公分母"],
                  t(
                    `$${L}$ and $${bin(q)}$ share no factor, so the least common denominator is their product. Multiply each numerator by the other denominator:`,
                    `$${L}$ 与 $${bin(q)}$ 没有公因式，所以最简公分母是它们的积。每个分子乘以另一个分母：`,
                  ),
                  [`${expr} = ${frac(first, lcd)}`],
                ],
                [
                  ["Expand and combine", "展开并合并"],
                  t(
                    `Expand both products, the leading coefficient $${m}$ included, and collect like terms:`,
                    `展开两个乘积（首项系数 $${m}$ 也要乘），合并同类项：`,
                  ),
                  [`${frac(first, lcd)} = ${frac(expanded, lcd)} = ${answer}`],
                ],
              ],
              checkAt(
                (x) => [m * x + p, x + q, c1 * x + c0],
                (x) => [
                  `${fr(a, m * x + p)} ${op} ${fr(b, x + q)} = ${num(Q.of(c1 * x + c0, (m * x + p) * (x + q)))}`,
                  ev(c1 * x + c0, (m * x + p) * (x + q)),
                ],
              ),
            ),
          });
        }
      },
    },
    {
      id: "a-polynomial-plus-a-fraction",
      title: t("A polynomial plus a fraction", "多项式加分式"),
      explanation: t(
        `A polynomial is a fraction with denominator $1$, and $2 = \\frac{2(x - 1)}{x - 1}$ because the factor $x - 1$ cancels. So rewrite the polynomial over the denominator of the fraction, then combine the numerators:

$$2 + \\frac{3}{x - 1} = \\frac{2(x - 1)}{x - 1} + \\frac{3}{x - 1} = \\frac{2x + 1}{x - 1} \\qquad x - \\frac{6}{x + 1} = \\frac{x(x + 1) - 6}{x + 1} = \\frac{x^{2} + x - 6}{x + 1}$$

Check the first at $x = 2$: $2 + 3 = 5$ and $\\frac{4 + 1}{1} = 5$. Check the second at $x = 1$: $1 - 3 = -2$ and $\\frac{1 + 1 - 6}{2} = -2$.

> **Watch out.** $2 + \\frac{3}{x - 1}$ is not $\\frac{5}{x - 1}$: the $2$ has to be put over the denominator first. Multiply the whole denominator: $2(x - 1) = 2x - 2$, not $2x - 1$. When subtracting, the sign belongs to the fraction's numerator.`,
        `多项式可以看作分母为 $1$ 的分式，而 $2 = \\frac{2(x - 1)}{x - 1}$，因为因式 $x - 1$ 可以约去。所以把多项式化成与分式同分母，再把分子合并：

$$2 + \\frac{3}{x - 1} = \\frac{2(x - 1)}{x - 1} + \\frac{3}{x - 1} = \\frac{2x + 1}{x - 1} \\qquad x - \\frac{6}{x + 1} = \\frac{x(x + 1) - 6}{x + 1} = \\frac{x^{2} + x - 6}{x + 1}$$

第一个在 $x = 2$ 处检验：$2 + 3 = 5$，$\\frac{4 + 1}{1} = 5$。第二个在 $x = 1$ 处检验：$1 - 3 = -2$，$\\frac{1 + 1 - 6}{2} = -2$。

> **注意。** $2 + \\frac{3}{x - 1}$ 不等于 $\\frac{5}{x - 1}$：要先把 $2$ 化成同分母。要乘整个分母：$2(x - 1) = 2x - 2$，不是 $2x - 1$。做减法时，减号属于分式的分子。`,
      ),
      generate(rng) {
        const p = rng.nonZero(-9, 9);
        const a = rng.int(1, 12);
        const minus = rng.bool();
        const sg = minus ? -1 : 1;
        const op = minus ? "-" : "+";
        const D = bin(p);
        if (rng.bool(0.6)) {
          const c = rng.nonZero(-6, 6);
          const expr = `${c} ${op} ${frac(String(a), D)}`;
          const answer = frac(linear(c, c * p + sg * a), D);
          return expressionProblem({
            prompt: simplifyPrompt(expr, [Q.of(-p)]),
            answer,
            lowest: true,
            wrong: [frac(String(c + sg * a), D), frac(linear(c, sg * a), D), frac(linear(c, c * p - sg * a), D)],
            solution: walked(
              [
                [
                  ["Write the number as a fraction", "把数写成分式"],
                  t(
                    `Write $${c}$ over the denominator, $${c} = ${frac(product(c, [D]), D)}$, and combine the numerators:`,
                    `把 $${c}$ 化成同分母，$${c} = ${frac(product(c, [D]), D)}$，再合并分子：`,
                  ),
                  [`${expr} = ${frac(`${product(c, [D])} ${op} ${a}`, D)}`],
                ],
                [
                  ["Expand", "展开"],
                  c === 1
                    ? t(`${minus ? "Subtract" : "Add"} $${a}$ to the constant term:`, `常数项${minus ? "减去" : "加上"} $${a}$：`)
                    : t(
                        `Expand $${product(c, [D])} = ${linear(c, c * p)}$ and ${minus ? "subtract" : "add"} $${a}$:`,
                        `展开 $${product(c, [D])} = ${linear(c, c * p)}$，再${minus ? "减去" : "加上"} $${a}$：`,
                      ),
                  [`${frac(`${product(c, [D])} ${op} ${a}`, D)} = ${answer}`],
                ],
              ],
              checkAt(
                (x) => [x + p],
                (x) => [`${c} ${op} ${fr(a, x + p)} = ${num(Q.of(c * (x + p) + sg * a, x + p))}`, ev(c * x + c * p + sg * a, x + p)],
              ),
            ),
          });
        }
        const expr = `x ${op} ${frac(String(a), D)}`;
        const answer = frac(poly([1, "x^{2}"], [p, "x"], [sg * a, ""]), D);
        return expressionProblem({
          prompt: simplifyPrompt(expr, [Q.of(-p)]),
          answer,
          lowest: true,
          wrong: [
            frac(linear(1, sg * a), D),
            frac(poly([1, "x^{2}"], [sg * a, ""]), D),
            frac(poly([1, "x^{2}"], [p, "x"], [-sg * a, ""]), D),
          ],
          solution: walked(
            [
              [
                ["Write x as a fraction", "把 x 写成分式"],
                t(
                  `Write $x$ over the denominator, $x = ${frac(`x(${D})`, D)}$, and combine the numerators:`,
                  `把 $x$ 化成同分母，$x = ${frac(`x(${D})`, D)}$，再合并分子：`,
                ),
                [`${expr} = ${frac(`x(${D}) ${op} ${a}`, D)}`],
              ],
              [
                ["Expand", "展开"],
                t(
                  `Expand $x(${D}) = ${poly([1, "x^{2}"], [p, "x"])}$ and ${minus ? "subtract" : "add"} $${a}$:`,
                  `展开 $x(${D}) = ${poly([1, "x^{2}"], [p, "x"])}$，再${minus ? "减去" : "加上"} $${a}$：`,
                ),
                [`${frac(`x(${D}) ${op} ${a}`, D)} = ${answer}`],
              ],
            ],
            checkAt(
              (x) => [x + p],
              (x) => [`${x} ${op} ${fr(a, x + p)} = ${num(Q.of(x * (x + p) + sg * a, x + p))}`, ev(x * x + p * x + sg * a, x + p)],
            ),
          ),
        });
      },
    },
    {
      id: "binomial-numerators",
      title: t("Binomial numerators", "分子是二项式"),
      explanation: t(
        `With binomial numerators the method is the same, but each cross product is a product of two binomials. Expand both, keeping each in parentheses, then combine like terms; when subtracting, the minus sign changes every term of the second product:

$$\\frac{x + 2}{x - 1} - \\frac{x - 3}{x + 1} = \\frac{(x + 2)(x + 1) - (x - 3)(x - 1)}{(x - 1)(x + 1)} = \\frac{(x^{2} + 3x + 2) - (x^{2} - 4x + 3)}{(x - 1)(x + 1)} = \\frac{7x - 1}{(x - 1)(x + 1)}$$

Check at $x = 0$: $\\frac{2}{-1} - \\frac{-3}{1} = 1$ and $\\frac{-1}{(-1) \\cdot 1} = 1$.

> **Watch out.** Distribute the minus sign over the whole second product: $-(x^{2} - 4x + 3) = -x^{2} + 4x - 3$; changing only the first term is wrong. Do not add the numerators straight over the product, $\\frac{(x + 2) - (x - 3)}{(x - 1)(x + 1)}$: each numerator must be multiplied by the other denominator first.`,
        `分子是二项式时，方法相同，只是每个交叉乘积都是两个二项式之积。把两个乘积展开，各自保留括号，再合并同类项；做减法时，减号改变第二个乘积的每一项：

$$\\frac{x + 2}{x - 1} - \\frac{x - 3}{x + 1} = \\frac{(x + 2)(x + 1) - (x - 3)(x - 1)}{(x - 1)(x + 1)} = \\frac{(x^{2} + 3x + 2) - (x^{2} - 4x + 3)}{(x - 1)(x + 1)} = \\frac{7x - 1}{(x - 1)(x + 1)}$$

在 $x = 0$ 处检验：$\\frac{2}{-1} - \\frac{-3}{1} = 1$，$\\frac{-1}{(-1) \\cdot 1} = 1$。

> **注意。** 减号要分配到整个第二个乘积上：$-(x^{2} - 4x + 3) = -x^{2} + 4x - 3$；只改第一项的符号是错的。不能把分子直接相减放在积上得 $\\frac{(x + 2) - (x - 3)}{(x - 1)(x + 1)}$：每个分子要先乘以另一个分母。`,
      ),
      keyPrerequisites: ["multiplying-binomials"],
      generate(rng) {
        for (;;) {
          const [a, b, p, q] = [rng.nonZero(-7, 7), rng.nonZero(-7, 7), rng.nonZero(-7, 7), rng.nonZero(-7, 7)];
          if (p === q || a === p || b === q) continue;
          const minus = rng.bool();
          const sg = minus ? -1 : 1;
          const op = minus ? "-" : "+";
          const c2 = 1 + sg;
          const c1 = a + q + sg * (b + p);
          const c0 = a * q + sg * b * p;
          if (c2 === 0 && c1 === 0) continue;
          const factors = [bin(p), bin(q)];
          const lcd = product(1, factors);
          const top = poly([c2, "x^{2}"], [c1, "x"], [c0, ""]);
          const answer = c2 === 0 ? overProduct(c1, c0, factors) : frac(top, lcd);
          const expr = `${frac(bin(a), bin(p))} ${op} ${frac(bin(b), bin(q))}`;
          const e1 = poly([1, "x^{2}"], [a + q, "x"], [a * q, ""]);
          const e2 = poly([1, "x^{2}"], [b + p, "x"], [b * p, ""]);
          return expressionProblem({
            prompt: simplifyPrompt(expr, [Q.of(-p), Q.of(-q)]),
            answer,
            lowest: true,
            wrong: [
              frac(poly([c2, "x^{2}"], [a + q + b + p - (minus ? 2 * (b + p) : 0), "x"], [a * q + b * p, ""]), lcd),
              ...(minus ? [frac(poly([0, "x^{2}"], [a + q - b - p, "x"], [a * q + b * p, ""]), lcd)] : []),
              frac(linear(1 + sg, a + sg * b), lcd),
            ],
            solution: walked(
              [
                [
                  ["Find the LCD", "求公分母"],
                  t(
                    "The denominators share no factor, so the common denominator is their product. Multiply each numerator by the other denominator:",
                    "两个分母没有公因式，所以公分母是它们的积。每个分子乘以另一个分母：",
                  ),
                  [`${expr} = ${frac(`(${bin(a)})(${bin(q)}) ${op} (${bin(b)})(${bin(p)})`, lcd)}`],
                ],
                [
                  ["Expand", "展开"],
                  t(
                    `$(${bin(a)})(${bin(q)}) = ${e1}$ and $(${bin(b)})(${bin(p)}) = ${e2}$; keep each product in parentheses:`,
                    `$(${bin(a)})(${bin(q)}) = ${e1}$，$(${bin(b)})(${bin(p)}) = ${e2}$；每个乘积保留括号：`,
                  ),
                  [`${frac(`(${bin(a)})(${bin(q)}) ${op} (${bin(b)})(${bin(p)})`, lcd)} = ${frac(`(${e1}) ${op} (${e2})`, lcd)}`],
                ],
                [
                  ["Combine", "合并"],
                  minus
                    ? t(
                        "The minus sign changes every term of the second product; then collect like terms:",
                        "减号改变第二个乘积的每一项，再合并同类项：",
                      )
                    : t("Collect like terms:", "合并同类项："),
                  [`${frac(`(${e1}) ${op} (${e2})`, lcd)} = ${answer}`],
                ],
              ],
              checkAt(
                (x) => [x + p, x + q],
                (x) => [
                  `${fr(x + a, x + p)} ${op} ${fr(x + b, x + q)} = ${num(Q.of(c2 * x * x + c1 * x + c0, (x + p) * (x + q)))}`,
                  ev(c2 * x * x + c1 * x + c0, (x + p) * (x + q)),
                ],
              ),
            ),
          });
        }
      },
    },
  ],
};

export const multiplyingRationalExpressions: TopicDef = {
  id: "multiplying-rational-expressions",
  title: t("Multiplying Rational Expressions", "分式的乘法"),
  summary: t(
    "Multiply rational expressions by multiplying numerators and denominators, cancelling common factors of monomials and of factored polynomials.",
    "分式相乘：分子乘分子、分母乘分母，并约去单项式和已分解多项式的公因式。",
  ),
  prerequisites: ["simplifying-rational-expressions-by-factoring"],
  encompasses: [
    { topic: "simplifying-rational-expressions-by-factoring", weight: 0.5 },
    { topic: "simplifying-rational-expressions", weight: 0.4 },
    { topic: "multiplying-fractions", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.APR.D.7"],
  intro: t(
    `Rational expressions multiply like numerical fractions, numerator times numerator over denominator times denominator, and a factor on top of one fraction cancels the same factor below the other: $\\frac{2}{3} \\cdot \\frac{9}{4} = \\frac{2 \\cdot 9}{3 \\cdot 4} = \\frac{3}{2}$. With variables:

$$\\frac{x}{3} \\cdot \\frac{6}{x^{2}} = \\frac{6x}{3x^{2}} = \\frac{2}{x}$$

Check at $x = 2$: $\\frac{2}{3} \\cdot \\frac{6}{4} = 1$ and $\\frac{2}{2} = 1$.

In this lesson we multiply fractions of monomials, fractions of factored polynomials, and fractions that have to be factored first.`,
    `分式相乘与数的分数一样：分子乘分子，分母乘分母，一个分式分子中的因式可以与另一个分式分母中相同的因式约去：$\\frac{2}{3} \\cdot \\frac{9}{4} = \\frac{2 \\cdot 9}{3 \\cdot 4} = \\frac{3}{2}$。含字母时：

$$\\frac{x}{3} \\cdot \\frac{6}{x^{2}} = \\frac{6x}{3x^{2}} = \\frac{2}{x}$$

在 $x = 2$ 处检验：$\\frac{2}{3} \\cdot \\frac{6}{4} = 1$，$\\frac{2}{2} = 1$。

这节课我们做三种乘法：单项式分式相乘，已分解的多项式分式相乘，以及需要先分解因式的分式相乘。`,
  ),
  knowledgePoints: [
    {
      id: "multiplying-monomial-fractions",
      title: t("Monomial fractions", "单项式分式"),
      explanation: t(
        `Multiply rational expressions like numerical fractions: numerator times numerator over denominator times denominator. Then cancel: reduce the numbers, and for each variable subtract the exponent below from the exponent above, by the quotient rule $\\frac{x^{a}}{x^{b}} = x^{a - b}$:

$$\\frac{3x^{2}}{4y} \\cdot \\frac{8y^{3}}{9x} = \\frac{24x^{2}y^{3}}{36xy} = \\frac{2xy^{2}}{3}$$

Here $\\frac{24}{36} = \\frac{2}{3}$, $x^{2 - 1} = x$ and $y^{3 - 1} = y^{2}$. Check at $x = 2$, $y = 3$: $\\frac{12}{12} \\cdot \\frac{216}{18} = 12$ and $\\frac{2 \\cdot 2 \\cdot 9}{3} = 12$.

> **Watch out.** Multiply straight across; do not flip the second fraction, which only division does. Subtract the exponents of a variable that is on top and below: adding them gives $x^{3}$. One negative factor makes the whole product negative.`,
        `分式相乘与数的分数一样：分子乘分子，分母乘分母。然后约分：数约分，每个字母用商的法则 $\\frac{x^{a}}{x^{b}} = x^{a - b}$，上面的指数减去下面的指数：

$$\\frac{3x^{2}}{4y} \\cdot \\frac{8y^{3}}{9x} = \\frac{24x^{2}y^{3}}{36xy} = \\frac{2xy^{2}}{3}$$

这里 $\\frac{24}{36} = \\frac{2}{3}$，$x^{2 - 1} = x$，$y^{3 - 1} = y^{2}$。在 $x = 2$，$y = 3$ 处检验：$\\frac{12}{12} \\cdot \\frac{216}{18} = 12$，$\\frac{2 \\cdot 2 \\cdot 9}{3} = 12$。

> **注意。** 直接相乘，不要把第二个分式颠倒，那是除法才做的。同一个字母上下都有时，指数相减：相加会得到 $x^{3}$。只有一个负因数时，积是负的。`,
      ),
      keyPrerequisites: ["multiplying-fractions", "product-and-quotient-rules"],
      generate(rng) {
        for (;;) {
          const [a, b, c, d] = [rng.int(1, 9), rng.int(1, 9), rng.int(1, 9), rng.int(1, 9)];
          const [e1, f1, f2, e2] = [rng.int(1, 5), rng.int(1, 4), rng.int(1, 4), rng.int(1, 4)];
          const s = rng.bool(0.3) ? -1 : 1;
          if (e1 === e2 && f1 === f2) continue;
          const coef = Q.of(s * a * c, b * d);
          if (coef.d === BigInt(b * d) && gcd(a, b) === 1 && gcd(c, d) === 1 && gcd(a, d) === 1 && gcd(c, b) === 1) continue;
          const expr = `${frac(mono(s * a, e1, 0), mono(b, 0, f1))} \\cdot ${frac(mono(c, 0, f2), mono(d, e2, 0))}`;
          const answer = monoRatio(coef, e1 - e2, f2 - f1);
          return expressionProblem({
            prompt: t(`Simplify $${expr}$, where $x \\neq 0$ and $y \\neq 0$.`, `化简 $${expr}$（$x \\neq 0$，$y \\neq 0$）。`),
            answer,
            lowest: true,
            wrong: [
              monoRatio(coef, e1 + e2, f2 + f1),
              monoRatio(Q.of(s * a * d, b * c), e1 + e2, -f1 - f2),
              monoRatio(coef.neg(), e1 - e2, f2 - f1),
              monoRatio(coef, e2 - e1, f1 - f2),
            ],
            solution: walked(
              [
                [
                  ["Multiply", "相乘"],
                  t("Multiply the numerators together and the denominators together:", "分子乘分子，分母乘分母："),
                  [`${expr} = ${frac(mono(s * a * c, e1, f2), mono(b * d, e2, f1))}`],
                ],
                [
                  ["Cancel", "约分"],
                  t(
                    `The numbers give $${ev(s * a * c, b * d)}$. Subtract exponents: $x$ gets $${e1} - ${e2} = ${e1 - e2}$ and $y$ gets $${f2} - ${f1} = ${f2 - f1}$; a negative exponent puts the power in the denominator, and exponent $0$ leaves no factor:`,
                    `数约分得 $${ev(s * a * c, b * d)}$。指数相减：$x$ 的指数是 $${e1} - ${e2} = ${e1 - e2}$，$y$ 的指数是 $${f2} - ${f1} = ${f2 - f1}$；负指数表示这个幂在分母上，指数为 $0$ 则没有这个因式：`,
                  ),
                  [`${frac(mono(s * a * c, e1, f2), mono(b * d, e2, f1))} = ${answer}`],
                ],
              ],
              agree(
                "x = 2, y = 3",
                `${fr(s * a * 2 ** e1, b * 3 ** f1)} \\cdot ${fr(c * 3 ** f2, d * 2 ** e2)} = ${num(Q.of(s * a * c * 2 ** e1 * 3 ** f2, b * d * 3 ** f1 * 2 ** e2))}`,
                `${num(coef)} \\cdot 2^{${e1 - e2}} \\cdot 3^{${f2 - f1}} = ${num(Q.of(s * a * c * 2 ** e1 * 3 ** f2, b * d * 3 ** f1 * 2 ** e2))}`,
              ),
            ),
          });
        }
      },
    },
    {
      id: "multiplying-factored-expressions",
      title: t("Factored polynomials", "已分解的多项式"),
      explanation: t(
        `A factor in the numerator of one fraction and the same factor in the denominator of the other make $\\frac{x - 3}{x - 3} = 1$ in the product, so they cancel across the two fractions. With everything already factored, cancel each such pair and reduce the numbers, then multiply what is left:

$$\\frac{2(x + 1)}{(x - 3)(x + 4)} \\cdot \\frac{x - 3}{6(x + 1)(x - 5)} = \\frac{1}{3(x + 4)(x - 5)}$$

Here $x + 1$ and $x - 3$ cancel and $\\frac{2}{6} = \\frac{1}{3}$. Check at $x = 0$: $\\frac{2}{-12} \\cdot \\frac{-3}{-30} = -\\frac{1}{60}$ and $\\frac{1}{3 \\cdot 4 \\cdot (-5)} = -\\frac{1}{60}$.

> **Watch out.** Only identical factors cancel: $x - 3$ and $x + 3$ do not. Reduce the numbers the right way up: $\\frac{2}{6}$ is $\\frac{1}{3}$, not $3$. When every factor of the numerator cancels, $1$ is left, not $0$.`,
        `一个分式分子中的因式与另一个分式分母中相同的因式，在乘积中构成 $\\frac{x - 3}{x - 3} = 1$，所以可以跨分式约去。各部分已分解时，约去每一对这样的因式，并把数约分，再把剩下的相乘：

$$\\frac{2(x + 1)}{(x - 3)(x + 4)} \\cdot \\frac{x - 3}{6(x + 1)(x - 5)} = \\frac{1}{3(x + 4)(x - 5)}$$

这里约去 $x + 1$ 和 $x - 3$，$\\frac{2}{6} = \\frac{1}{3}$。在 $x = 0$ 处检验：$\\frac{2}{-12} \\cdot \\frac{-3}{-30} = -\\frac{1}{60}$，$\\frac{1}{3 \\cdot 4 \\cdot (-5)} = -\\frac{1}{60}$。

> **注意。** 只有完全相同的因式才能约去：$x - 3$ 和 $x + 3$ 不能约。数要按正确的方向约分：$\\frac{2}{6}$ 是 $\\frac{1}{3}$，不是 $3$。当分子的因式全部约去时，剩下的是 $1$，而不是 $0$。`,
      ),
      generate(rng) {
        for (;;) {
          const vals = rng.sample([-8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8], 4) as [number, number, number, number];
          const [p, q, r, s] = vals;
          const A = rng.int(1, 8);
          const B = rng.int(1, 8);
          if (A === B) continue;
          const variant = rng.int(0, 2);
          const [P, Qf, R, S] = [bin(p), bin(q), bin(r), bin(s)];
          const [expr, answer, excluded, cancelled] =
            variant === 0
              ? [`${frac(product(A, [P]), Qf)} \\cdot ${frac(Qf, product(B, [R]))}`, ratio(A, [P], B, [R]), [q, r], Qf]
              : variant === 1
                ? [
                    `${frac(product(A, [P]), prod2(Qf, R))} \\cdot ${frac(prod2(Qf, S), product(B, [P]))}`,
                    ratio(A, [S], B, [R]),
                    [q, r, p],
                    `${Qf}$ and $${P}`,
                  ]
                : [
                    `${frac(`(${P})^{2}`, product(A, [Qf]))} \\cdot ${frac(product(B, [Qf]), prod2(P, R))}`,
                    ratio(B, [P], A, [R]),
                    [q, p, r],
                    `${Qf}$ and $${P}`,
                  ];
          const joined =
            variant === 0
              ? frac(product(A, [P, Qf]), product(B, [Qf, R]))
              : variant === 1
                ? frac(product(A, [P, Qf, S]), product(B, [Qf, R, P]))
                : frac(product(B, [`(${P})^{2}`, Qf]), product(A, [Qf, P, R]));
          return expressionProblem({
            prompt: simplifyPrompt(
              expr,
              excluded.map((v) => Q.of(-v)),
            ),
            answer,
            lowest: true,
            wrong: [
              variant === 2 ? ratio(A, [P], B, [R]) : ratio(B, [variant === 0 ? P : S], A, [R]),
              variant === 1 ? ratio(A, [S], B, [Qf]) : ratio(A, [bin(-p)], B, [bin(-r)]),
              variant === 0 ? ratio(A, [P, Qf], B, [Qf, R]) : ratio(1, [variant === 1 ? S : P], 1, [R]),
            ],
            solution: walked(
              [
                [["Multiply", "相乘"], t("Write the product as one fraction:", "写成一个分式："), [`${expr} = ${joined}`]],
                [
                  ["Cancel", "约分"],
                  t(
                    `Cancel $${cancelled}$${variant === 2 ? ` (one factor $${P}$ is left on top)` : ""}${(variant === 2 ? reduceNote(B, A) : reduceNote(A, B)).en}:`,
                    `约去 $${cancelled.replace("$ and $", "$ 和 $")}$${variant === 2 ? `（分子上还剩一个因式 $${P}$）` : ""}${(variant === 2 ? reduceNote(B, A) : reduceNote(A, B))["zh-CN"]}：`,
                  ),
                  [`${joined} = ${answer}`],
                ],
              ],
              checkAt(
                (x) => [x + p, x + q, x + r, x + s],
                (x) => {
                  const [vp, vq, vr, vs] = [x + p, x + q, x + r, x + s];
                  return variant === 0
                    ? [ev(A * vp * vq, B * vq * vr), ev(A * vp, B * vr)]
                    : variant === 1
                      ? [ev(A * vp * vq * vs, B * vq * vr * vp), ev(A * vs, B * vr)]
                      : [ev(B * vp * vp * vq, A * vq * vp * vr), ev(B * vp, A * vr)];
                },
              ),
            ),
          });
        }
      },
    },
    {
      id: "factoring-before-multiplying",
      title: t("Factoring before multiplying", "先分解再相乘"),
      explanation: t(
        `Cancelling needs factors, so factor every numerator and denominator first; then cancel and multiply what is left. Multiplying out first only makes the polynomials harder to factor.

$$\\frac{x^{2} - 9}{2x + 4} \\cdot \\frac{x + 2}{x^{2} - x - 6} = \\frac{(x + 3)(x - 3)}{2(x + 2)} \\cdot \\frac{x + 2}{(x - 3)(x + 2)} = \\frac{x + 3}{2(x + 2)}$$

The factors $x - 3$ and one $x + 2$ cancel. Check at $x = 0$: $\\frac{-9}{4} \\cdot \\frac{2}{-6} = \\frac{3}{4}$ and $\\frac{3}{2 \\cdot 2} = \\frac{3}{4}$.

> **Watch out.** Factor the numbers out too: $2x + 4 = 2(x + 2)$, and that $2$ stays in the answer. Keep each number on its own side; flipping $\\frac{m}{k}$ gives the reciprocal. Keep the signs of the factors: $x + 3$ is not $x - 3$.`,
        `约分需要因式，所以先把每个分子和分母都分解因式，再约分，最后把剩下的相乘。先乘开只会让多项式更难分解。

$$\\frac{x^{2} - 9}{2x + 4} \\cdot \\frac{x + 2}{x^{2} - x - 6} = \\frac{(x + 3)(x - 3)}{2(x + 2)} \\cdot \\frac{x + 2}{(x - 3)(x + 2)} = \\frac{x + 3}{2(x + 2)}$$

约去因式 $x - 3$ 和一个 $x + 2$。在 $x = 0$ 处检验：$\\frac{-9}{4} \\cdot \\frac{2}{-6} = \\frac{3}{4}$，$\\frac{3}{2 \\cdot 2} = \\frac{3}{4}$。

> **注意。** 数也要提出来：$2x + 4 = 2(x + 2)$，这个 $2$ 留在答案中。每个数留在原来的一边；把 $\\frac{m}{k}$ 颠倒就成了倒数。保留因式的符号：$x + 3$ 不是 $x - 3$。`,
      ),
      keyPrerequisites: ["factoring-trinomials"],
      generate(rng) {
        for (;;) {
          const [a, b, c, d] = rng.sample([-7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7], 4) as [number, number, number, number];
          const k = rng.int(1, 5);
          const m = rng.int(1, 5);
          if (k === 1 && m === 1) continue;
          const tri = (u: number, v: number) => (u === -v ? `x^{2} - ${u * u}` : poly([1, "x^{2}"], [u + v, "x"], [u * v, ""]));
          const expr = `${frac(tri(a, b), linear(k, k * c))} \\cdot ${frac(linear(m, m * c), tri(a, d))}`;
          const answer = ratio(m, [bin(b)], k, [bin(d)]);
          const factored = `${frac(prod2(bin(a), bin(b)), product(k, [bin(c)]))} \\cdot ${frac(product(m, [bin(c)]), prod2(bin(a), bin(d)))}`;
          return expressionProblem({
            prompt: simplifyPrompt(expr, [Q.of(-c), Q.of(-a), Q.of(-d)]),
            answer,
            lowest: true,
            wrong: [ratio(1, [bin(b)], 1, [bin(d)]), ratio(k, [bin(d)], m, [bin(b)]), ratio(m, [bin(-b)], k, [bin(-d)])],
            solution: walked(
              [
                [
                  ["Factor", "分解因式"],
                  t("Factor every numerator and denominator:", "把每个分子和分母分解因式："),
                  [`${expr} = ${factored}`],
                ],
                [
                  ["Cancel", "约分"],
                  t(
                    `Cancel $${bin(a)}$ and $${bin(c)}$, which appear above and below${reduceNote(m, k).en}:`,
                    `约去上下都出现的 $${bin(a)}$ 和 $${bin(c)}$${reduceNote(m, k)["zh-CN"]}：`,
                  ),
                  [`${factored} = ${answer}`],
                ],
              ],
              checkAt(
                (x) => [x + a, x + b, x + c, x + d],
                (x) => [
                  `${fr((x + a) * (x + b), k * (x + c))} \\cdot ${fr(m * (x + c), (x + a) * (x + d))} = ${num(Q.of(m * (x + b), k * (x + d)))}`,
                  ev(m * (x + b), k * (x + d)),
                ],
              ),
            ),
          });
        }
      },
    },
  ],
};

export const dividingRationalExpressions: TopicDef = {
  id: "dividing-rational-expressions",
  title: t("Dividing Rational Expressions", "分式的除法"),
  summary: t(
    "Divide rational expressions by multiplying by the reciprocal of the divisor, factoring and cancelling.",
    "分式相除：乘以除式的倒数，再分解因式、约分。",
  ),
  prerequisites: ["multiplying-rational-expressions"],
  encompasses: [
    { topic: "multiplying-rational-expressions", weight: 0.7 },
    { topic: "dividing-fractions", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.APR.D.7"],
  intro: t(
    `Dividing by a fraction is multiplying by its reciprocal: $\\frac{3}{4} \\div \\frac{1}{2} = \\frac{3}{4} \\cdot 2 = \\frac{3}{2}$, since $\\frac{1}{2}$ fits into $\\frac{3}{4}$ one and a half times. Rational expressions divide the same way:

$$\\frac{x}{3} \\div \\frac{x^{2}}{6} = \\frac{x}{3} \\cdot \\frac{6}{x^{2}} = \\frac{2}{x}$$

Check at $x = 3$: $1 \\div \\frac{9}{6} = \\frac{2}{3}$, and $\\frac{2}{x}$ gives $\\frac{2}{3}$ too.

In this lesson we divide fractions of monomials, divide by a polynomial, and factor before dividing.`,
    `除以一个分数等于乘以它的倒数：$\\frac{3}{4} \\div \\frac{1}{2} = \\frac{3}{4} \\cdot 2 = \\frac{3}{2}$，因为 $\\frac{3}{4}$ 里含有一个半 $\\frac{1}{2}$。分式的除法也一样：

$$\\frac{x}{3} \\div \\frac{x^{2}}{6} = \\frac{x}{3} \\cdot \\frac{6}{x^{2}} = \\frac{2}{x}$$

在 $x = 3$ 处检验：$1 \\div \\frac{9}{6} = \\frac{2}{3}$，$\\frac{2}{x}$ 也得 $\\frac{2}{3}$。

这节课我们做三种除法：单项式分式相除，除以多项式，以及先分解因式再相除。`,
  ),
  knowledgePoints: [
    {
      id: "dividing-monomial-fractions",
      title: t("Monomial fractions", "单项式分式"),
      explanation: t(
        `Multiplying by $\\frac{c}{d}$ is undone by multiplying by $\\frac{d}{c}$, so dividing by a fraction is multiplying by its reciprocal: flip the **second** fraction only. Then multiply and cancel common factors of the coefficients and of each variable:

$$\\frac{4x^{3}}{5y} \\div \\frac{2x}{15y^{2}} = \\frac{4x^{3}}{5y} \\cdot \\frac{15y^{2}}{2x} = \\frac{60x^{3}y^{2}}{10xy} = 6x^{2}y$$

Check at $x = 2$, $y = 3$: $\\frac{32}{15} \\div \\frac{4}{135} = \\frac{32}{15} \\cdot \\frac{135}{4} = 72$ and $6 \\cdot 4 \\cdot 3 = 72$.

> **Watch out.** Flip the divisor, not the first fraction: flipping the first gives the reciprocal of the answer. Do not multiply without flipping. After flipping, subtract exponents as in any product.`,
        `乘以 $\\frac{c}{d}$ 可以用乘以 $\\frac{d}{c}$ 来抵消，所以除以一个分式等于乘以它的倒数：只把**第二个**分式颠倒过来。再相乘，约去系数和每个字母的公因式：

$$\\frac{4x^{3}}{5y} \\div \\frac{2x}{15y^{2}} = \\frac{4x^{3}}{5y} \\cdot \\frac{15y^{2}}{2x} = \\frac{60x^{3}y^{2}}{10xy} = 6x^{2}y$$

在 $x = 2$，$y = 3$ 处检验：$\\frac{32}{15} \\div \\frac{4}{135} = \\frac{32}{15} \\cdot \\frac{135}{4} = 72$，$6 \\cdot 4 \\cdot 3 = 72$。

> **注意。** 颠倒的是除式，不是第一个分式：颠倒第一个会得到答案的倒数。不能不颠倒就直接相乘。颠倒之后，像一般的乘法一样指数相减。`,
      ),
      keyPrerequisites: ["dividing-fractions"],
      generate(rng) {
        for (;;) {
          const [a, b, c, d] = [rng.int(1, 9), rng.int(1, 9), rng.int(1, 9), rng.int(1, 9)];
          const [i, j, k, l] = [rng.int(1, 5), rng.int(1, 3), rng.int(1, 4), rng.int(1, 4)];
          const s = rng.bool(0.3) ? -1 : 1;
          if (i === k && j === l) continue;
          if (gcd(a * d, b * c) === 1) continue;
          const coef = Q.of(s * a * d, b * c);
          const expr = `${frac(mono(s * a, i, 0), mono(b, 0, j))} \\div ${frac(mono(c, k, 0), mono(d, 0, l))}`;
          const answer = monoRatio(coef, i - k, l - j);
          const byReciprocal = `${frac(mono(s * a, i, 0), mono(b, 0, j))} \\cdot ${frac(mono(d, 0, l), mono(c, k, 0))}`;
          return expressionProblem({
            prompt: t(`Simplify $${expr}$, where $x \\neq 0$ and $y \\neq 0$.`, `化简 $${expr}$（$x \\neq 0$，$y \\neq 0$）。`),
            answer,
            lowest: true,
            wrong: [
              monoRatio(Q.of(s * a * c, b * d), i + k, -j - l),
              monoRatio(Q.one.div(coef), k - i, j - l),
              monoRatio(coef, i + k, l - j),
            ],
            solution: walked(
              [
                [
                  ["Flip the divisor", "颠倒除式"],
                  t(
                    "Dividing by a fraction is multiplying by its reciprocal, so flip the second fraction only:",
                    "除以一个分式等于乘以它的倒数，所以只颠倒第二个分式：",
                  ),
                  [`${expr} = ${byReciprocal}`],
                ],
                [
                  ["Multiply and cancel", "相乘并约分"],
                  t(
                    `The numbers give $${ev(s * a * d, b * c)}$. The exponent of $x$ is $${i} - ${k} = ${i - k}$ and that of $y$ is $${l} - ${j} = ${l - j}$; a negative exponent puts the power in the denominator, and exponent $0$ leaves no factor:`,
                    `数约分得 $${ev(s * a * d, b * c)}$。$x$ 的指数是 $${i} - ${k} = ${i - k}$，$y$ 的指数是 $${l} - ${j} = ${l - j}$；负指数表示这个幂在分母上，指数为 $0$ 则没有这个因式：`,
                  ),
                  [`${byReciprocal} = ${answer}`],
                ],
              ],
              agree(
                "x = 2, y = 3",
                `${fr(s * a * 2 ** i, b * 3 ** j)} \\div ${fr(c * 2 ** k, d * 3 ** l)} = ${num(Q.of(s * a * d * 2 ** i * 3 ** l, b * c * 3 ** j * 2 ** k))}`,
                `${num(coef)} \\cdot 2^{${i - k}} \\cdot 3^{${l - j}} = ${num(Q.of(s * a * d * 2 ** i * 3 ** l, b * c * 3 ** j * 2 ** k))}`,
              ),
            ),
          });
        }
      },
    },
    {
      id: "dividing-by-a-polynomial",
      title: t("Dividing by a polynomial", "除以多项式"),
      explanation: t(
        `A polynomial is a fraction with denominator $1$, so its reciprocal has it in the denominator: dividing by $x + 5$ multiplies by $\\frac{1}{x + 5}$. Factor, then cancel:

$$\\frac{x^{2} - 25}{3x} \\div (x + 5) = \\frac{(x + 5)(x - 5)}{3x} \\cdot \\frac{1}{x + 5} = \\frac{x - 5}{3x}$$

Check at $x = 1$: $\\frac{-24}{3} \\div 6 = -\\frac{4}{3}$ and $\\frac{1 - 5}{3} = -\\frac{4}{3}$. Dividing a polynomial by a fraction multiplies it by the flipped fraction: $(x + 2) \\div \\frac{x + 2}{4} = (x + 2) \\cdot \\frac{4}{x + 2} = 4$.

> **Watch out.** Dividing by $x + 5$ is not multiplying by $x + 5$: that would give $\\frac{(x + 5)^{2}(x - 5)}{3x}$. Cancel the factor you divided by, $x + 5$, not $x - 5$. Flip only the divisor.`,
        `多项式可以看作分母为 $1$ 的分式，所以它的倒数把它放在分母上：除以 $x + 5$ 就是乘以 $\\frac{1}{x + 5}$。先分解，再约分：

$$\\frac{x^{2} - 25}{3x} \\div (x + 5) = \\frac{(x + 5)(x - 5)}{3x} \\cdot \\frac{1}{x + 5} = \\frac{x - 5}{3x}$$

在 $x = 1$ 处检验：$\\frac{-24}{3} \\div 6 = -\\frac{4}{3}$，$\\frac{1 - 5}{3} = -\\frac{4}{3}$。多项式除以分式，就是乘以颠倒后的分式：$(x + 2) \\div \\frac{x + 2}{4} = (x + 2) \\cdot \\frac{4}{x + 2} = 4$。

> **注意。** 除以 $x + 5$ 不是乘以 $x + 5$：那样会得到 $\\frac{(x + 5)^{2}(x - 5)}{3x}$。约去的是除掉的那个因式 $x + 5$，不是 $x - 5$。只颠倒除式。`,
      ),
      generate(rng) {
        for (;;) {
          const h = rng.nonZero(-9, 9);
          const q = rng.nonZero(-9, 9);
          const A = rng.int(2, 9);
          if (q === h) continue;
          const variant = rng.int(0, 2);
          if (variant === 0) {
            const expr = `${frac(`x^{2} - ${h * h}`, poly([A, "x"]))} \\div (${bin(h)})`;
            const answer = frac(bin(-h), poly([A, "x"]));
            return expressionProblem({
              prompt: simplifyPrompt(expr, [Q.zero, Q.of(-h)]),
              answer,
              lowest: true,
              wrong: [frac(bin(h), poly([A, "x"])), frac(`(${bin(h)})^{2}(${bin(-h)})`, poly([A, "x"])), frac(poly([A, "x"]), bin(-h))],
              solution: walked(
                [
                  [
                    ["Multiply by the reciprocal", "乘以倒数"],
                    t(
                      `Dividing by $${bin(h)}$ is multiplying by $${frac("1", bin(h))}$. Factor the difference of squares in the numerator:`,
                      `除以 $${bin(h)}$ 就是乘以 $${frac("1", bin(h))}$。把分子按平方差分解：`,
                    ),
                    [`${expr} = ${frac(`(${bin(h)})(${bin(-h)})`, poly([A, "x"]))} \\cdot ${frac("1", bin(h))}`],
                  ],
                  [
                    ["Cancel", "约分"],
                    t(`Cancel $${bin(h)}$:`, `约去 $${bin(h)}$：`),
                    [`${frac(`(${bin(h)})(${bin(-h)})`, poly([A, "x"]))} \\cdot ${frac("1", bin(h))} = ${answer}`],
                  ],
                ],
                checkAt(
                  (x) => [x, x + h, x - h],
                  (x) => [`${fr(x * x - h * h, A * x)} \\div ${paren(x + h)} = ${num(Q.of(x - h, A * x))}`, ev(x - h, A * x)],
                ),
              ),
            });
          }
          if (variant === 1) {
            const expr = `${frac(linear(A, A * h), bin(q))} \\div (${bin(h)})`;
            const answer = frac(String(A), bin(q));
            return expressionProblem({
              prompt: simplifyPrompt(expr, [Q.of(-q), Q.of(-h)]),
              answer,
              lowest: true,
              wrong: [frac(`${A}(${bin(h)})^{2}`, bin(q)), frac(bin(q), String(A)), String(A)],
              solution: walked(
                [
                  [
                    ["Factor", "分解因式"],
                    t(
                      `Take $${A}$ out of the numerator, $${linear(A, A * h)} = ${product(A, [bin(h)])}$; dividing by $${bin(h)}$ is multiplying by $${frac("1", bin(h))}$:`,
                      `从分子中提取 $${A}$，$${linear(A, A * h)} = ${product(A, [bin(h)])}$；除以 $${bin(h)}$ 就是乘以 $${frac("1", bin(h))}$：`,
                    ),
                    [`${expr} = ${frac(product(A, [bin(h)]), bin(q))} \\cdot ${frac("1", bin(h))}`],
                  ],
                  [
                    ["Cancel", "约分"],
                    t(`Cancel $${bin(h)}$:`, `约去 $${bin(h)}$：`),
                    [`${frac(product(A, [bin(h)]), bin(q))} \\cdot ${frac("1", bin(h))} = ${answer}`],
                  ],
                ],
                checkAt(
                  (x) => [x + q, x + h],
                  (x) => [`${fr(A * (x + h), x + q)} \\div ${paren(x + h)} = ${num(Q.of(A, x + q))}`, ev(A, x + q)],
                ),
              ),
            });
          }
          if (Math.abs(h * q) > 40) continue;
          const tri = poly([1, "x^{2}"], [h + q, "x"], [h * q, ""]);
          const expr = `(${bin(h)}) \\div ${frac(tri, String(A))}`;
          const answer = frac(String(A), bin(q));
          return expressionProblem({
            prompt: simplifyPrompt(expr, [Q.of(-q), Q.of(-h)]),
            answer,
            lowest: true,
            wrong: [frac(bin(q), String(A)), frac(`(${bin(h)})^{2}(${bin(q)})`, String(A)), frac("1", product(A, [bin(q)]))],
            solution: walked(
              [
                [
                  ["Multiply by the reciprocal", "乘以倒数"],
                  t("Flip the divisor and multiply:", "把除式颠倒，再相乘："),
                  [`${expr} = (${bin(h)}) \\cdot ${frac(String(A), tri)}`],
                ],
                [
                  ["Factor and cancel", "分解并约分"],
                  t(
                    `Factor $${tri} = ${prod2(bin(h), bin(q))}$ and cancel $${bin(h)}$:`,
                    `分解 $${tri} = ${prod2(bin(h), bin(q))}$，约去 $${bin(h)}$：`,
                  ),
                  [`(${bin(h)}) \\cdot ${frac(String(A), tri)} = (${bin(h)}) \\cdot ${frac(String(A), prod2(bin(h), bin(q)))} = ${answer}`],
                ],
              ],
              checkAt(
                (x) => [x + h, x + q],
                (x) => [`${paren(x + h)} \\div ${fr((x + h) * (x + q), A)} = ${num(Q.of(A, x + q))}`, ev(A, x + q)],
              ),
            ),
          });
        }
      },
    },
    {
      id: "factoring-before-dividing",
      title: t("Factoring before dividing", "先分解再相除"),
      explanation: t(
        `Turn the division into a multiplication by flipping the divisor, then factor everything and cancel, as in any product:

$$\\frac{x^{2} + x - 6}{4x - 8} \\div \\frac{x^{2} + 5x + 6}{2x - 4} = \\frac{(x + 3)(x - 2)}{4(x - 2)} \\cdot \\frac{2(x - 2)}{(x + 3)(x + 2)} = \\frac{x - 2}{2(x + 2)}$$

The factor $x + 3$ and one $x - 2$ cancel, and $\\frac{2}{4} = \\frac{1}{2}$. Check at $x = 0$: $\\frac{-6}{-8} \\div \\frac{6}{-4} = \\frac{3}{4} \\cdot \\left(-\\frac{2}{3}\\right) = -\\frac{1}{2}$ and $\\frac{-2}{2 \\cdot 2} = -\\frac{1}{2}$.

The values excluded are those that make a denominator zero **and** those that make the divisor zero, since division by zero is not defined: here $x \\neq 2$, $x \\neq -2$ and $x \\neq -3$.

> **Watch out.** Flip the divisor, not the first fraction: flipping the wrong one gives the reciprocal of the answer. Do not multiply the fractions as they stand. Keep the numbers: $\\frac{2}{4} = \\frac{1}{2}$ stays in the answer.`,
        `把除式颠倒，化除法为乘法，再像一般的乘法一样，把所有式子分解因式并约分：

$$\\frac{x^{2} + x - 6}{4x - 8} \\div \\frac{x^{2} + 5x + 6}{2x - 4} = \\frac{(x + 3)(x - 2)}{4(x - 2)} \\cdot \\frac{2(x - 2)}{(x + 3)(x + 2)} = \\frac{x - 2}{2(x + 2)}$$

约去因式 $x + 3$ 和一个 $x - 2$，$\\frac{2}{4} = \\frac{1}{2}$。在 $x = 0$ 处检验：$\\frac{-6}{-8} \\div \\frac{6}{-4} = \\frac{3}{4} \\cdot \\left(-\\frac{2}{3}\\right) = -\\frac{1}{2}$，$\\frac{-2}{2 \\cdot 2} = -\\frac{1}{2}$。

要排除的值包括使分母为零的值，**以及**使除式为零的值，因为除以零没有意义：这里 $x \\neq 2$，$x \\neq -2$，$x \\neq -3$。

> **注意。** 颠倒的是除式，不是第一个分式：颠倒错了会得到答案的倒数。不能按原样直接相乘。数要保留：$\\frac{2}{4} = \\frac{1}{2}$ 留在答案中。`,
      ),
      keyPrerequisites: ["factoring-trinomials"],
      generate(rng) {
        for (;;) {
          const [a, b, c, d] = rng.sample([-7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7], 4) as [number, number, number, number];
          const k = rng.int(1, 6);
          const m = rng.int(1, 6);
          if (k === m) continue;
          const tri = (u: number, v: number) => (u === -v ? `x^{2} - ${u * u}` : poly([1, "x^{2}"], [u + v, "x"], [u * v, ""]));
          const expr = `${frac(tri(a, b), linear(k, k * c))} \\div ${frac(tri(a, d), linear(m, m * c))}`;
          const answer = ratio(m, [bin(b)], k, [bin(d)]);
          const flipped = `${frac(prod2(bin(a), bin(b)), product(k, [bin(c)]))} \\cdot ${frac(product(m, [bin(c)]), prod2(bin(a), bin(d)))}`;
          return expressionProblem({
            prompt: simplifyPrompt(expr, [Q.of(-c), Q.of(-a), Q.of(-d)]),
            answer,
            lowest: true,
            wrong: [
              ratio(k, [bin(d)], m, [bin(b)]),
              ratio(1, [prod2(bin(a), bin(b)), prod2(bin(a), bin(d))].map(grp), k * m, [prod2(bin(c), bin(c))]),
              ratio(1, [bin(b)], 1, [bin(d)]),
            ],
            solution: walked(
              [
                [
                  ["Flip the divisor", "颠倒除式"],
                  t("Multiply by the reciprocal of the divisor:", "乘以除式的倒数："),
                  [`${expr} = ${frac(tri(a, b), linear(k, k * c))} \\cdot ${frac(linear(m, m * c), tri(a, d))}`],
                ],
                [
                  ["Factor", "分解因式"],
                  t("Factor every numerator and denominator:", "把每个分子和分母分解因式："),
                  [`${frac(tri(a, b), linear(k, k * c))} \\cdot ${frac(linear(m, m * c), tri(a, d))} = ${flipped}`],
                ],
                [
                  ["Cancel", "约分"],
                  t(
                    `Cancel $${bin(a)}$ and $${bin(c)}$${reduceNote(m, k).en}:`,
                    `约去 $${bin(a)}$ 和 $${bin(c)}$${reduceNote(m, k)["zh-CN"]}：`,
                  ),
                  [`${flipped} = ${answer}`],
                ],
              ],
              checkAt(
                (x) => [x + a, x + b, x + c, x + d],
                (x) => [
                  `${fr((x + a) * (x + b), k * (x + c))} \\div ${fr((x + a) * (x + d), m * (x + c))} = ${num(Q.of(m * (x + b), k * (x + d)))}`,
                  ev(m * (x + b), k * (x + d)),
                ],
              ),
            ),
          });
        }
      },
    },
  ],
};

export const simplifyingComplexFractions: TopicDef = {
  id: "simplifying-complex-fractions",
  title: t("Simplifying Complex Fractions", "化简繁分式"),
  summary: t(
    "Simplify fractions whose numerator or denominator contains fractions, by dividing or by multiplying through by the least common denominator.",
    "化简分子或分母中含有分式的繁分式：用除法，或同乘最简公分母。",
  ),
  prerequisites: ["dividing-rational-expressions", "adding-rational-expressions-with-unlike-denominators"],
  encompasses: [
    { topic: "dividing-rational-expressions", weight: 0.5 },
    { topic: "adding-rational-expressions-with-unlike-denominators", weight: 0.3 },
  ],
  xp: 16,
  standards: ["CCSS.HSA.APR.D.7"],
  intro: t(
    `A **complex fraction** has fractions inside its numerator or denominator, such as $\\dfrac{\\;\\frac{1}{2}\\;}{\\frac{3}{4}}$. Its main fraction bar is a division, so $\\dfrac{\\;\\frac{1}{2}\\;}{\\frac{3}{4}} = \\frac{1}{2} \\cdot \\frac{4}{3} = \\frac{2}{3}$. With variables:

$$\\frac{\\;\\frac{3}{x}\\;}{\\frac{6}{x^{2}}} = \\frac{3}{x} \\cdot \\frac{x^{2}}{6} = \\frac{x}{2}$$

Check at $x = 2$: $\\frac{3}{2} \\div \\frac{6}{4} = 1$ and $\\frac{2}{2} = 1$.

In this lesson we simplify a fraction over a fraction, clear sums of fractions by multiplying through by their least common denominator, and factor and cancel what is left.`,
    `分子或分母中含有分式的分式叫**繁分式**，例如 $\\dfrac{\\;\\frac{1}{2}\\;}{\\frac{3}{4}}$。它的主分数线表示除法，所以 $\\dfrac{\\;\\frac{1}{2}\\;}{\\frac{3}{4}} = \\frac{1}{2} \\cdot \\frac{4}{3} = \\frac{2}{3}$。含字母时：

$$\\frac{\\;\\frac{3}{x}\\;}{\\frac{6}{x^{2}}} = \\frac{3}{x} \\cdot \\frac{x^{2}}{6} = \\frac{x}{2}$$

在 $x = 2$ 处检验：$\\frac{3}{2} \\div \\frac{6}{4} = 1$，$\\frac{2}{2} = 1$。

这节课我们化简分式除以分式的繁分式，用同乘最简公分母的方法消去含分式的和，再把剩下的式子分解因式并约分。`,
  ),
  knowledgePoints: [
    {
      id: "a-fraction-over-a-fraction",
      title: t("A fraction over a fraction", "分式除以分式"),
      explanation: t(
        `Treat the main fraction bar as a division sign: $\\dfrac{\\;\\frac{a}{b}\\;}{\\frac{c}{d}} = \\frac{a}{b} \\div \\frac{c}{d} = \\frac{a}{b} \\cdot \\frac{d}{c}$. So multiply the top fraction by the reciprocal of the bottom one, then cancel:

$$\\frac{\\;\\frac{6}{x + 2}\\;}{\\frac{4}{(x + 2)(x - 1)}} = \\frac{6}{x + 2} \\cdot \\frac{(x + 2)(x - 1)}{4} = \\frac{3(x - 1)}{2}$$

Check at $x = 0$: $\\frac{6}{2} \\div \\frac{4}{-2} = 3 \\div (-2) = -\\frac{3}{2}$ and $\\frac{3 \\cdot (-1)}{2} = -\\frac{3}{2}$.

> **Watch out.** Flip the bottom fraction, not the top one: flipping the top gives the reciprocal, $\\frac{2}{3(x - 1)}$. Cancel the factor the two share, $x + 2$; the factor $x - 1$ stays. Reduce the numbers: $\\frac{6}{4} = \\frac{3}{2}$.`,
        `把主分数线看作除号：$\\dfrac{\\;\\frac{a}{b}\\;}{\\frac{c}{d}} = \\frac{a}{b} \\div \\frac{c}{d} = \\frac{a}{b} \\cdot \\frac{d}{c}$。所以用上面的分式乘以下面分式的倒数，再约分：

$$\\frac{\\;\\frac{6}{x + 2}\\;}{\\frac{4}{(x + 2)(x - 1)}} = \\frac{6}{x + 2} \\cdot \\frac{(x + 2)(x - 1)}{4} = \\frac{3(x - 1)}{2}$$

在 $x = 0$ 处检验：$\\frac{6}{2} \\div \\frac{4}{-2} = 3 \\div (-2) = -\\frac{3}{2}$，$\\frac{3 \\cdot (-1)}{2} = -\\frac{3}{2}$。

> **注意。** 颠倒的是下面的分式，不是上面的：颠倒上面的会得到倒数 $\\frac{2}{3(x - 1)}$。约去两者共有的因式 $x + 2$；因式 $x - 1$ 保留。数要约分：$\\frac{6}{4} = \\frac{3}{2}$。`,
      ),
      generate(rng) {
        for (;;) {
          const p = rng.nonZero(-9, 9);
          const q = rng.nonZero(-9, 9);
          const A = rng.sign() * rng.int(1, 9);
          const B = rng.int(2, 9);
          if (p === q || gcd(A, B) === Math.abs(A) * 0 + 99) continue;
          if (rng.bool()) {
            const expr = frac(`\\;${frac(String(A), bin(p))}\\;`, frac(String(B), prod2(bin(p), bin(q))));
            const answer = ratio(A, [bin(q)], B, []);
            return expressionProblem({
              prompt: simplifyPrompt(expr, [Q.of(-p), Q.of(-q)]),
              answer,
              lowest: true,
              wrong: [ratio(B, [], A, [bin(q)]), ratio(A, [], B, [bin(q)]), ratio(A, [bin(p)], B, [])],
              solution: walked(
                [
                  [
                    ["Divide", "做除法"],
                    t(
                      "The main fraction bar means division: multiply the top fraction by the reciprocal of the bottom one:",
                      "主分数线表示除法：用上面的分式乘以下面分式的倒数：",
                    ),
                    [`${expr} = ${frac(String(A), bin(p))} \\cdot ${frac(prod2(bin(p), bin(q)), String(B))}`],
                  ],
                  [
                    ["Cancel", "约分"],
                    t(`Cancel $${bin(p)}$${reduceNote(A, B).en}:`, `约去 $${bin(p)}$${reduceNote(A, B)["zh-CN"]}：`),
                    [`${frac(String(A), bin(p))} \\cdot ${frac(prod2(bin(p), bin(q)), String(B))} = ${answer}`],
                  ],
                ],
                checkAt(
                  (x) => [x + p, x + q],
                  (x) => [`${frac(`\\;${fr(A, x + p)}\\;`, fr(B, (x + p) * (x + q)))} = ${num(Q.of(A * (x + q), B))}`, ev(A * (x + q), B)],
                ),
              ),
            });
          }
          const h = Math.abs(p);
          const expr = frac(`\\;${frac(`x^{2} - ${h * h}`, String(B))}\\;`, frac(bin(h), String(Math.abs(A))));
          const answer = ratio(Math.abs(A), [bin(-h)], B, []);
          return expressionProblem({
            prompt: simplifyPrompt(expr, [Q.of(-h)]),
            answer,
            lowest: true,
            wrong: [ratio(B, [bin(-h)], Math.abs(A), []), ratio(Math.abs(A), [bin(h)], B, []), ratio(1, [bin(-h)], B * Math.abs(A), [])],
            solution: walked(
              [
                [
                  ["Divide", "做除法"],
                  t(
                    "Multiply the top fraction by the reciprocal of the bottom one, and factor the difference of squares:",
                    "用上面的分式乘以下面分式的倒数，并按平方差分解：",
                  ),
                  [`${expr} = ${frac(`(${bin(h)})(${bin(-h)})`, String(B))} \\cdot ${frac(String(Math.abs(A)), bin(h))}`],
                ],
                [
                  ["Cancel", "约分"],
                  t(`Cancel $${bin(h)}$${reduceNote(Math.abs(A), B).en}:`, `约去 $${bin(h)}$${reduceNote(Math.abs(A), B)["zh-CN"]}：`),
                  [`${frac(`(${bin(h)})(${bin(-h)})`, String(B))} \\cdot ${frac(String(Math.abs(A)), bin(h))} = ${answer}`],
                ],
              ],
              checkAt(
                (x) => [x + h, x - h],
                (x) => [
                  `${frac(`\\;${fr(x * x - h * h, B)}\\;`, fr(x + h, Math.abs(A)))} = ${num(Q.of(Math.abs(A) * (x - h), B))}`,
                  ev(Math.abs(A) * (x - h), B),
                ],
              ),
            ),
          });
        }
      },
    },
    {
      id: "multiplying-by-the-lcd",
      title: t("Multiplying through by the LCD", "同乘最简公分母"),
      explanation: t(
        `Multiplying the numerator and the denominator by the same nonzero expression does not change a fraction. Choose the least common denominator of all the small fractions: it clears every one of them at once. Here every small denominator is $x$:

$$\\frac{2 + \\frac{3}{x}}{1 - \\frac{4}{x}} = \\frac{\\left(2 + \\frac{3}{x}\\right) \\cdot x}{\\left(1 - \\frac{4}{x}\\right) \\cdot x} = \\frac{2x + 3}{x - 4}$$

Check at $x = 2$: $\\frac{2 + \\frac{3}{2}}{1 - 2} = -\\frac{7}{2}$ and $\\frac{7}{-2} = -\\frac{7}{2}$.

> **Watch out.** Multiply **every** term by the LCD, the whole numbers too: forgetting them gives $\\frac{2 + 3}{1 - 4}$ for every $x$. Keep each sign with its term. The numerator stays on top: do not turn the fraction upside down.`,
        `分子和分母同乘一个不为零的式子，分式的值不变。选所有小分式的最简公分母来乘，所有小分式一次就被消去。这里每个小分母都是 $x$：

$$\\frac{2 + \\frac{3}{x}}{1 - \\frac{4}{x}} = \\frac{\\left(2 + \\frac{3}{x}\\right) \\cdot x}{\\left(1 - \\frac{4}{x}\\right) \\cdot x} = \\frac{2x + 3}{x - 4}$$

在 $x = 2$ 处检验：$\\frac{2 + \\frac{3}{2}}{1 - 2} = -\\frac{7}{2}$，$\\frac{7}{-2} = -\\frac{7}{2}$。

> **注意。** **每一项**都要乘以最简公分母，整数项也不例外：漏乘它们会对任何 $x$ 都得到 $\\frac{2 + 3}{1 - 4}$。每项的符号跟着这一项。分子仍在上面：不要把分式颠倒。`,
      ),
      generate(rng) {
        for (;;) {
          const c = rng.int(1, 6);
          const d = rng.int(1, 6);
          const a = rng.nonZero(-9, 9);
          const b = rng.nonZero(-9, 9);
          if (gcd(c, a) !== 1 || gcd(d, b) !== 1 || Q.of(-a, c).eq(Q.of(-b, d))) continue;
          const part = (w: number, v: number) => `${w} ${v < 0 ? "-" : "+"} ${frac(String(Math.abs(v)), "x")}`;
          const expr = frac(part(c, a), part(d, b));
          const answer = frac(linear(c, a), linear(d, b));
          return expressionProblem({
            prompt: simplifyPrompt(expr, [Q.zero, Q.of(-b, d)]),
            answer,
            lowest: true,
            wrong: [
              frac(String(c + a), String(d + b)),
              frac(linear(1, a * c), linear(1, b * d)),
              frac(linear(c, -a), linear(d, -b)),
              frac(linear(d, b), linear(c, a)),
            ],
            solution: walked(
              [
                [
                  ["Multiply by the LCD", "同乘最简公分母"],
                  t(
                    "The only small denominator is $x$. Multiply the numerator and the denominator by $x$, every term of each:",
                    "小分式的分母只有 $x$。把分子和分母同乘 $x$，每一项都要乘：",
                  ),
                  [`${expr} = ${frac(`\\left(${part(c, a)}\\right) \\cdot x`, `\\left(${part(d, b)}\\right) \\cdot x`)}`],
                ],
                [
                  ["Distribute", "去括号"],
                  t(
                    `The whole numbers become $${poly([c, "x"])}$ and $${poly([d, "x"])}$, and each small fraction loses its $x$:`,
                    `整数项变成 $${poly([c, "x"])}$ 和 $${poly([d, "x"])}$，每个小分式的 $x$ 被消去：`,
                  ),
                  [`${frac(`\\left(${part(c, a)}\\right) \\cdot x`, `\\left(${part(d, b)}\\right) \\cdot x`)} = ${answer}`],
                ],
              ],
              checkAt(
                (x) => [x, d * x + b, c * x + a],
                (x) => {
                  const at = (w: number, v: number) => `${w} ${v < 0 ? "-" : "+"} ${fr(Math.abs(v), x)}`;
                  return [`${frac(at(c, a), at(d, b))} = ${num(Q.of(c * x + a, d * x + b))}`, ev(c * x + a, d * x + b)];
                },
              ),
            ),
          });
        }
      },
    },
    {
      id: "complex-fractions-that-factor",
      title: t("Complex fractions that factor", "可以分解的繁分式"),
      explanation: t(
        `Multiply the numerator and the denominator by the least common denominator of all the small fractions to clear them in one step. What is left is an ordinary rational expression, so factor it and cancel:

$$\\frac{1 - \\frac{9}{x^{2}}}{1 + \\frac{3}{x}} = \\frac{x^{2} - 9}{x^{2} + 3x} = \\frac{(x + 3)(x - 3)}{x(x + 3)} = \\frac{x - 3}{x}$$

Here the LCD of $\\frac{9}{x^{2}}$ and $\\frac{3}{x}$ is $x^{2}$. Check at $x = 1$: $\\frac{1 - 9}{1 + 3} = -2$ and $\\frac{1 - 3}{1} = -2$.

> **Watch out.** Use the LCD $x^{2}$, not $x$: multiplying by $x$ leaves $\\frac{9}{x}$ behind. Cancel the factor the two share, $x + 3$, not $x - 3$. Keep the denominator $x$: $x - 3$ alone is wrong.`,
        `把分子和分母同乘所有小分式的最简公分母，一步就能去掉这些小分式。剩下的是普通的分式，再分解因式并约分：

$$\\frac{1 - \\frac{9}{x^{2}}}{1 + \\frac{3}{x}} = \\frac{x^{2} - 9}{x^{2} + 3x} = \\frac{(x + 3)(x - 3)}{x(x + 3)} = \\frac{x - 3}{x}$$

这里 $\\frac{9}{x^{2}}$ 与 $\\frac{3}{x}$ 的最简公分母是 $x^{2}$。在 $x = 1$ 处检验：$\\frac{1 - 9}{1 + 3} = -2$，$\\frac{1 - 3}{1} = -2$。

> **注意。** 要乘最简公分母 $x^{2}$，不是 $x$：只乘 $x$ 会留下 $\\frac{9}{x}$。约去两者共有的因式 $x + 3$，不是 $x - 3$。分母 $x$ 要保留：只写 $x - 3$ 是错的。`,
      ),
      generate(rng) {
        const a = rng.nonZero(-9, 9);
        const variant = rng.int(0, 2);
        const sq = `1 - ${frac(String(a * a), "x^{2}")}`;
        const lin = `1 ${a < 0 ? "-" : "+"} ${frac(String(Math.abs(a)), "x")}`;
        if (variant === 0) {
          const expr = frac(sq, lin);
          const answer = frac(bin(-a), "x");
          return expressionProblem({
            prompt: simplifyPrompt(expr, [Q.zero, Q.of(-a)]),
            answer,
            lowest: true,
            wrong: [frac(bin(a), "x"), bin(-a), frac("x", bin(-a))],
            solution: walked(
              [
                [
                  ["Clear the small fractions", "消去小分式"],
                  t(
                    "The least common denominator of the small fractions is $x^{2}$. Multiply the numerator and the denominator by it:",
                    "小分式的最简公分母是 $x^{2}$。把分子和分母同乘它：",
                  ),
                  [`${expr} = ${frac(`x^{2} - ${a * a}`, poly([1, "x^{2}"], [a, "x"]))}`],
                ],
                [
                  ["Factor and cancel", "分解并约分"],
                  t(`Factor both and cancel $${bin(a)}$:`, `分别分解因式，约去 $${bin(a)}$：`),
                  [
                    `${frac(`x^{2} - ${a * a}`, poly([1, "x^{2}"], [a, "x"]))} = ${frac(`(${bin(a)})(${bin(-a)})`, `x(${bin(a)})`)} = ${answer}`,
                  ],
                ],
              ],
              checkAt(
                (x) => [x, x + a, x - a],
                (x) => [
                  `${frac(`1 - ${fr(a * a, x * x)}`, `1 ${a < 0 ? "-" : "+"} ${fr(Math.abs(a), x)}`)} = ${num(Q.of(x - a, x))}`,
                  ev(x - a, x),
                ],
              ),
            ),
          });
        }
        if (variant === 1) {
          const expr = frac(lin, sq);
          const answer = frac("x", bin(-a));
          return expressionProblem({
            prompt: simplifyPrompt(expr, [Q.zero, Q.of(a), Q.of(-a)]),
            answer,
            lowest: true,
            wrong: [frac("x", bin(a)), frac(bin(-a), "x"), frac("1", bin(-a))],
            solution: walked(
              [
                [
                  ["Clear the small fractions", "消去小分式"],
                  t(
                    "The least common denominator of the small fractions is $x^{2}$. Multiply the numerator and the denominator by it:",
                    "小分式的最简公分母是 $x^{2}$。把分子和分母同乘它：",
                  ),
                  [`${expr} = ${frac(poly([1, "x^{2}"], [a, "x"]), `x^{2} - ${a * a}`)}`],
                ],
                [
                  ["Factor and cancel", "分解并约分"],
                  t(`Factor both and cancel $${bin(a)}$:`, `分别分解因式，约去 $${bin(a)}$：`),
                  [
                    `${frac(poly([1, "x^{2}"], [a, "x"]), `x^{2} - ${a * a}`)} = ${frac(`x(${bin(a)})`, `(${bin(a)})(${bin(-a)})`)} = ${answer}`,
                  ],
                ],
              ],
              checkAt(
                (x) => [x, x + a, x - a],
                (x) => [
                  `${frac(`1 ${a < 0 ? "-" : "+"} ${fr(Math.abs(a), x)}`, `1 - ${fr(a * a, x * x)}`)} = ${num(Q.of(x, x - a))}`,
                  ev(x, x - a),
                ],
              ),
            ),
          });
        }
        const expr = frac(`${frac("1", "x")} - ${frac("1", String(a))}`, bin(-a));
        const answer = ratio(-1, [], a, ["x"]);
        return expressionProblem({
          prompt: simplifyPrompt(expr, [Q.zero, Q.of(a)]),
          answer,
          lowest: true,
          wrong: [ratio(1, [], a, ["x"]), ratio(-1, [], 1, ["x"]), ratio(1, [], a, ["x", bin(-a)])],
          solution: walked(
            [
              [
                ["Clear the small fractions", "消去小分式"],
                t(
                  `The least common denominator of $${frac("1", "x")}$ and $${frac("1", String(a))}$ is $${poly([a, "x"])}$. Multiply the numerator and the denominator by it:`,
                  `$${frac("1", "x")}$ 与 $${frac("1", String(a))}$ 的最简公分母是 $${poly([a, "x"])}$。把分子和分母同乘它：`,
                ),
                [`${expr} = ${frac(poly([a, ""], [-1, "x"]), `${poly([a, "x"])}(${bin(-a)})`)}`],
              ],
              [
                ["Cancel the opposite factor", "约去相反的因式"],
                t(
                  `The numerator $${poly([a, ""], [-1, "x"])}$ is $-(${bin(-a)})$, the opposite of the factor below; cancel it, keeping the $-1$:`,
                  `分子 $${poly([a, ""], [-1, "x"])}$ 等于 $-(${bin(-a)})$，是下面那个因式的相反数；约去它，保留 $-1$：`,
                ),
                [`${frac(poly([a, ""], [-1, "x"]), `${poly([a, "x"])}(${bin(-a)})`)} = ${answer}`],
              ],
            ],
            checkAt(
              (x) => [x, x - a],
              (x) => [`${frac(`${fr(1, x)} - ${fr(1, a)}`, String(x - a))} = ${num(Q.of(-1, a * x))}`, ev(-1, a * x)],
            ),
          ),
        });
      },
    },
  ],
};

/** algebraIIRationalRadicalTopics are the rational and radical topics of Algebra II in teaching order. */
export const algebraIIRationalRadicalTopics: readonly TopicDef[] = [
  simplifyingRationalExpressionsUsingPolynomialFactorization,
  splittingRationalExpressionsIntoTerms,
  addingAndSubtractingRationalExpressions,
  addingRationalExpressionsWithUnlikeDenominators,
  multiplyingRationalExpressions,
  dividingRationalExpressions,
  simplifyingComplexFractions,
];
