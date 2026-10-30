import type { Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { gcd, lcm, linear, num, paren, poly, Q } from "@ga/subject-math";

import { expressionProblem, numberProblem, steps } from "../problems.ts";

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
    { topic: "factoring-trinomials-using-common-factors", weight: 0.3 },
  ],
  xp: 16,
  standards: ["CCSS.HSA.APR.D.6", "CCSS.HSA.SSE.A.2"],
  knowledgePoints: [
    {
      id: "trinomials-with-leading-coefficients",
      title: t("Trinomials with leading coefficients", "带首项系数的三项式"),
      explanation: t(
        "Factor every numerator and denominator completely, using the $ac$ method for trinomials with a leading coefficient, then cancel the common factors:\n\n$$\\frac{2x^{2} + 5x - 3}{2x^{2} - 7x + 3} = \\frac{(2x - 1)(x + 3)}{(2x - 1)(x - 3)} = \\frac{x + 3}{x - 3}, \\quad x \\neq \\frac{1}{2}$$\n\nOnly whole factors cancel: the terms $2x^{2}$ do not.",
        "把每个分子和分母都完全分解，带首项系数的三项式用 $ac$ 法分解，再约去公因式：\n\n$$\\frac{2x^{2} + 5x - 3}{2x^{2} - 7x + 3} = \\frac{(2x - 1)(x + 3)}{(2x - 1)(x - 3)} = \\frac{x + 3}{x - 3}, \\quad x \\neq \\frac{1}{2}$$\n\n只有完整的因式才能约去：$2x^{2}$ 这些项不能约。",
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
            solution: t(
              `Factor the numerator and the denominator, then cancel the common factor $${linTex(C)}$:${steps(`${expr} = ${factored} = ${answer}`)}`,
              `分解分子和分母，再约去公因式 $${linTex(C)}$：${steps(`${expr} = ${factored} = ${answer}`)}`,
            ),
          });
        }
      },
    },
    {
      id: "common-factors-then-trinomials",
      title: t("Common factors first", "先提取公因数"),
      explanation: t(
        "When the terms share a number, take it out first; then factor what is left and cancel both the common numbers and the common binomials:\n\n$$\\frac{3x^{2} - 3x - 18}{6x^{2} - 54} = \\frac{3(x - 3)(x + 2)}{6(x - 3)(x + 3)} = \\frac{x + 2}{2(x + 3)}, \\quad x \\neq 3$$",
        "当各项有公因数时，先把它提出来；再分解剩下的部分，约去公共的数和公共的二项式：\n\n$$\\frac{3x^{2} - 3x - 18}{6x^{2} - 54} = \\frac{3(x - 3)(x + 2)}{6(x - 3)(x + 3)} = \\frac{x + 2}{2(x + 3)}, \\quad x \\neq 3$$",
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
            solution: t(
              `Take out $${k}$ and $${m}$, factor, then cancel $${bin(a)}$ and the common factor of the numbers:${steps(`${expr} = ${factored} = ${answer}`)}`,
              `提取 $${k}$ 和 $${m}$，分解因式，再约去 $${bin(a)}$ 以及数的公因数：${steps(`${expr} = ${factored} = ${answer}`)}`,
            ),
          });
        }
      },
    },
    {
      id: "opposite-factors-with-trinomials",
      title: t("Opposite factors", "互为相反数的因式"),
      explanation: t(
        "A difference written the other way round is the opposite: $b - x = -(x - b)$ and $b^{2} - x^{2} = -(x - b)(x + b)$. Take out $-1$ so that the factors match, then cancel:\n\n$$\\frac{16 - x^{2}}{x^{2} - 2x - 8} = \\frac{-(x - 4)(x + 4)}{(x - 4)(x + 2)} = -\\frac{x + 4}{x + 2}, \\quad x \\neq 4$$",
        "顺序相反的差是相反数：$b - x = -(x - b)$，$b^{2} - x^{2} = -(x - b)(x + b)$。提取 $-1$ 使因式相同，再约分：\n\n$$\\frac{16 - x^{2}}{x^{2} - 2x - 8} = \\frac{-(x - 4)(x + 4)}{(x - 4)(x + 2)} = -\\frac{x + 4}{x + 2}, \\quad x \\neq 4$$",
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
              solution: t(
                `$${b * b} - x^{2} = -(${bin(-b)})(${bin(b)})$. Factor, then cancel $${bin(-b)}$:${steps(`${expr} = ${frac(`-(${bin(-b)})(${bin(b)})`, triF)} = ${answer}`)}`,
                `$${b * b} - x^{2} = -(${bin(-b)})(${bin(b)})$。分解因式，再约去 $${bin(-b)}$：${steps(`${expr} = ${frac(`-(${bin(-b)})(${bin(b)})`, triF)} = ${answer}`)}`,
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
              solution: t(
                `Take out $${-k}$ from the numerator so that $${bin(-b)}$ appears in both, then cancel it:${steps(`${expr} = ${frac(product(-k, [bin(-b)]), triF)} = ${answer}`)}`,
                `从分子中提取 $${-k}$，使分子和分母都出现 $${bin(-b)}$，再约去：${steps(`${expr} = ${frac(product(-k, [bin(-b)]), triF)} = ${answer}`)}`,
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
            solution: t(
              `$${b * b} - x^{2} = -(${bin(-b)})(${bin(b)})$. Factor, then cancel $${bin(-b)}$:${steps(`${expr} = ${frac(triF, `-(${bin(-b)})(${bin(b)})`)} = ${answer}`)}`,
              `$${b * b} - x^{2} = -(${bin(-b)})(${bin(b)})$。分解因式，再约去 $${bin(-b)}$：${steps(`${expr} = ${frac(triF, `-(${bin(-b)})(${bin(b)})`)} = ${answer}`)}`,
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
    { topic: "simplifying-rational-expressions", weight: 0.3 },
    { topic: "equivalent-expressions-with-fractions", weight: 0.4 },
    { topic: "product-and-quotient-rules", weight: 0.3 },
  ],
  xp: 13,
  standards: ["CCSS.HSA.APR.D.6", "CCSS.HSA.SSE.A.2"],
  knowledgePoints: [
    {
      id: "polynomial-over-monomial",
      title: t("A polynomial over a monomial", "多项式除以单项式"),
      explanation: t(
        "A fraction whose numerator is a sum splits into one fraction per term, because dividing a sum divides **every** term. Then simplify each term with the quotient rule:\n\n$$\\frac{6x^{4} - 9x^{3} + 3x^{2}}{3x^{2}} = \\frac{6x^{4}}{3x^{2}} - \\frac{9x^{3}}{3x^{2}} + \\frac{3x^{2}}{3x^{2}} = 2x^{2} - 3x + 1$$\n\nThe last term is $1$, not $0$: a term divided by itself leaves $1$.",
        "分子是和的分式可以拆成每一项各自的分式，因为一个和除以一个式子时，**每一项**都要除。再用商的法则化简每一项：\n\n$$\\frac{6x^{4} - 9x^{3} + 3x^{2}}{3x^{2}} = \\frac{6x^{4}}{3x^{2}} - \\frac{9x^{3}}{3x^{2}} + \\frac{3x^{2}}{3x^{2}} = 2x^{2} - 3x + 1$$\n\n最后一项是 $1$ 而不是 $0$：一项除以它自己得 $1$。",
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
          solution: t(
            `Divide each term of the numerator by $${bottom}$:${steps(`${expr} = ${frac(split, bottom)} ${d * q1 === 0 ? "" : `${d * q1 < 0 ? "-" : "+"} ${frac(poly([Math.abs(d * q1), pw("x", m + 1)]), bottom)}`} ${d * q0 < 0 ? "-" : "+"} ${frac(poly([Math.abs(d * q0), pw("x", m)]), bottom)} = ${answer}`)}`,
            `把分子的每一项都除以 $${bottom}$：${steps(`${expr} = ${frac(split, bottom)} ${d * q1 === 0 ? "" : `${d * q1 < 0 ? "-" : "+"} ${frac(poly([Math.abs(d * q1), pw("x", m + 1)]), bottom)}`} ${d * q0 < 0 ? "-" : "+"} ${frac(poly([Math.abs(d * q0), pw("x", m)]), bottom)} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "terms-with-a-fraction-left-over",
      title: t("A fraction left over", "余下一个分式"),
      explanation: t(
        "When a term of the numerator is not divisible by the denominator, it stays a fraction:\n\n$$\\frac{4x^{2} - 6x + 5}{2x} = \\frac{4x^{2}}{2x} - \\frac{6x}{2x} + \\frac{5}{2x} = 2x - 3 + \\frac{5}{2x}$$\n\nIn the form $px + q + \\frac{r}{x}$, the last term is $\\frac{5}{2x} = \\frac{5}{2} \\cdot \\frac{1}{x}$, so $p = 2$, $q = -3$ and $r = \\frac{5}{2}$.",
        "当分子的某一项不能被分母整除时，它仍是一个分式：\n\n$$\\frac{4x^{2} - 6x + 5}{2x} = \\frac{4x^{2}}{2x} - \\frac{6x}{2x} + \\frac{5}{2x} = 2x - 3 + \\frac{5}{2x}$$\n\n写成 $px + q + \\frac{r}{x}$ 的形式时，最后一项是 $\\frac{5}{2x} = \\frac{5}{2} \\cdot \\frac{1}{x}$，所以 $p = 2$，$q = -3$，$r = \\frac{5}{2}$。",
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
        return numberProblem({
          prompt: t(
            `Write $${expr}$ in the form $px + q + \\frac{r}{x}$. Find $${target}$.`,
            `把 $${expr}$ 写成 $px + q + \\frac{r}{x}$ 的形式。求 $${target}$。`,
          ),
          answer: target === "q" ? q : r,
          solveFor: target,
          wrong: target === "q" ? [d * q, -q, p] : [c, c * d, r.neg(), Q.of(d, c)],
          solution: t(
            `Divide each term by $${poly([d, "x"])}$:${steps(`${expr} = ${split}`)}${d === 1 ? "" : `The last term is $\\frac{${num(r)}}{x}$. `}So $p = ${p}$, $q = ${q}$ and $r = ${num(r)}$.`,
            `把每一项都除以 $${poly([d, "x"])}$：${steps(`${expr} = ${split}`)}${d === 1 ? "" : `最后一项是 $\\frac{${num(r)}}{x}$。`}所以 $p = ${p}$，$q = ${q}$，$r = ${num(r)}$。`,
          ),
        });
      },
    },
    {
      id: "a-constant-plus-a-fraction",
      title: t("A constant plus a fraction", "常数加一个分式"),
      explanation: t(
        "To split $\\frac{ax + b}{x + h}$, write the numerator as a multiple of the denominator plus what is left:\n\n$$\\frac{3x + 7}{x + 2} = \\frac{3(x + 2) + 1}{x + 2} = 3 + \\frac{1}{x + 2}$$\n\nHere $3(x + 2) = 3x + 6$, and $7 - 6 = 1$ is left over.",
        "要拆分 $\\frac{ax + b}{x + h}$，把分子写成分母的倍数加上余下的部分：\n\n$$\\frac{3x + 7}{x + 2} = \\frac{3(x + 2) + 1}{x + 2} = 3 + \\frac{1}{x + 2}$$\n\n这里 $3(x + 2) = 3x + 6$，余下 $7 - 6 = 1$。",
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
          const work = steps(
            `${expr} = ${frac(`${product(a, [bin(h)])} ${r < 0 ? "-" : "+"} ${Math.abs(r)}`, bin(h))} = ${a}${r < 0 ? " - " : " + "}${frac(String(Math.abs(r)), bin(h))}`,
          );
          return numberProblem({
            prompt: t(
              `Write $${expr}$ in the form $k + \\frac{r}{${bin(h)}}$. Find $${askK ? "k" : "r"}$.`,
              `把 $${expr}$ 写成 $k + \\frac{r}{${bin(h)}}$ 的形式。求 $${askK ? "k" : "r"}$。`,
            ),
            answer: askK ? a : r,
            solveFor: askK ? "k" : "r",
            wrong: askK ? [b, Q.of(b, h), -a] : [b, b + a * h, b - h, -r],
            solution: t(
              `$${product(a, [bin(h)])} = ${linear(a, a * h)}$, and $${b} - ${paren(a * h)} = ${r}$ is left over:${work}So $k = ${a}$ and $r = ${r}$.`,
              `$${product(a, [bin(h)])} = ${linear(a, a * h)}$，余下 $${b} - ${paren(a * h)} = ${r}$：${work}所以 $k = ${a}$，$r = ${r}$。`,
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
  knowledgePoints: [
    {
      id: "the-same-denominator",
      title: t("The same denominator", "同分母"),
      explanation: t(
        "Fractions with the same denominator are added or subtracted by combining the numerators over that denominator. When subtracting, the minus sign applies to **every** term of the second numerator:\n\n$$\\frac{2x + 1}{x - 3} - \\frac{x - 2}{x - 3} = \\frac{2x + 1 - x + 2}{x - 3} = \\frac{x + 3}{x - 3}$$\n\nThen simplify if you can: $\\frac{x^{2}}{x + 4} - \\frac{16}{x + 4} = \\frac{(x + 4)(x - 4)}{x + 4} = x - 4$.",
        "同分母的分式相加减，把分子合并，分母不变。做减法时，减号要作用在第二个分子的**每一项**上：\n\n$$\\frac{2x + 1}{x - 3} - \\frac{x - 2}{x - 3} = \\frac{2x + 1 - x + 2}{x - 3} = \\frac{x + 3}{x - 3}$$\n\n能化简就化简：$\\frac{x^{2}}{x + 4} - \\frac{16}{x + 4} = \\frac{(x + 4)(x - 4)}{x + 4} = x - 4$。",
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
              solution: t(
                `Combine the numerators, factor and cancel:${steps(`${expr} = ${frac(`x^{2} - ${h * h}`, D)} = ${frac(`(${bin(h)})(${bin(-h)})`, D)} = ${answer}`)}`,
                `合并分子，分解因式再约分：${steps(`${expr} = ${frac(`x^{2} - ${h * h}`, D)} = ${frac(`(${bin(h)})(${bin(-h)})`, D)} = ${answer}`)}`,
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
            ? `${linear(p, r)} - ${grp(second)}`
            : `${linear(p, r)} + ${second.startsWith("-") ? `(${second})` : second}`;
          const wrongSign = minus ? frac(linear(p - q, r + s), D) : frac(linear(p + q, r - s), D);
          return expressionProblem({
            prompt: simplifyPrompt(expr, [Q.of(-h)]),
            answer,
            lowest: true,
            wrong: [wrongSign, frac(linear(u, v), linear(2, 2 * h)), frac(linear(u, v), D)],
            solution: t(
              `Combine the numerators over the common denominator:${steps(`${expr} = ${frac(combined, D)} = ${frac(linear(u, v), D)}${answer === frac(linear(u, v), D) ? "" : ` = ${answer}`}`)}`,
              `分母不变，合并分子：${steps(`${expr} = ${frac(combined, D)} = ${frac(linear(u, v), D)}${answer === frac(linear(u, v), D) ? "" : ` = ${answer}`}`)}`,
            ),
          });
        }
      },
    },
    {
      id: "monomial-denominators",
      title: t("Monomial denominators", "单项式分母"),
      explanation: t(
        "The least common denominator (LCD) of monomials takes the least common multiple of the numbers and the highest power of each variable. Rewrite each fraction over the LCD, then combine:\n\n$$\\frac{5}{6x} + \\frac{3}{4x^{2}} = \\frac{5 \\cdot 2x}{12x^{2}} + \\frac{3 \\cdot 3}{12x^{2}} = \\frac{10x + 9}{12x^{2}}$$",
        "单项式的最简公分母取各数的最小公倍数，以及每个变量的最高次幂。把每个分式化成以最简公分母为分母的分式，再合并：\n\n$$\\frac{5}{6x} + \\frac{3}{4x^{2}} = \\frac{5 \\cdot 2x}{12x^{2}} + \\frac{3 \\cdot 3}{12x^{2}} = \\frac{10x + 9}{12x^{2}}$$",
      ),
      keyPrerequisites: ["least-common-multiple"],
      generate(rng) {
        const [m, n] = rng.sample([1, 2, 3, 4, 5, 6, 8, 9, 10], 2) as [number, number];
        const a = rng.nonZero(-9, 9);
        const b = rng.int(1, 9);
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
        const work = steps(
          `${expr} = ${frac(poly([c1, vy]), lcdTex)} ${op} ${frac(scaled2, lcdTex)} = ${frac(raw, lcdTex)}${g === 1 ? "" : ` = ${answer}`}`,
        );
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
          solution: t(`The least common denominator is $${lcdTex}$:${work}`, `最简公分母是 $${lcdTex}$：${work}`),
        });
      },
    },
    {
      id: "denominators-with-a-common-factor",
      title: t("Denominators with a common factor", "分母有公因式"),
      explanation: t(
        "Factor the denominators first. The LCD contains every factor that appears, each as often as it appears in any one denominator:\n\n$$\\frac{4}{x^{2} - 9} + \\frac{1}{x + 3} = \\frac{4}{(x + 3)(x - 3)} + \\frac{x - 3}{(x + 3)(x - 3)} = \\frac{x + 1}{(x + 3)(x - 3)}$$\n\nMultiplying the denominators, $(x^{2} - 9)(x + 3)$, also works, but then the result has to be simplified.",
        "先把分母分解因式。最简公分母包含出现过的每一个因式，次数取它在各个分母中出现的最高次数：\n\n$$\\frac{4}{x^{2} - 9} + \\frac{1}{x + 3} = \\frac{4}{(x + 3)(x - 3)} + \\frac{x - 3}{(x + 3)(x - 3)} = \\frac{x + 1}{(x + 3)(x - 3)}$$\n\n直接用两个分母的积 $(x^{2} - 9)(x + 3)$ 作公分母也可以，但最后还需要化简。",
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
          return expressionProblem({
            prompt: simplifyPrompt(expr, [Q.of(-p), Q.of(-q)]),
            answer,
            lowest: true,
            wrong: [
              ...(a + sg * b !== 0 ? [ratio(a + sg * b, [], 1, factors)] : []),
              overProduct(c1, a + sg * b, factors),
              overProduct(c1, a - sg * b * q, factors),
            ],
            solution: t(
              `Factor: $${tri} = ${lcd}$, which is the least common denominator. Multiply the second fraction by $\\frac{${bin(q)}}{${bin(q)}}$:${steps(`${expr} = ${frac(String(a), lcd)} ${op} ${frac(product(b, [bin(q)]), lcd)} = ${answer}`)}`,
              `分解因式：$${tri} = ${lcd}$，这就是最简公分母。把第二个分式的分子分母同乘 $${bin(q)}$：${steps(`${expr} = ${frac(String(a), lcd)} ${op} ${frac(product(b, [bin(q)]), lcd)} = ${answer}`)}`,
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
  knowledgePoints: [
    {
      id: "two-binomial-denominators",
      title: t("Two binomial denominators", "两个二项式分母"),
      explanation: t(
        "When the denominators have no common factor, their product is the least common denominator. Multiply each numerator by the other denominator:\n\n$$\\frac{2}{x + 1} + \\frac{3}{x - 4} = \\frac{2(x - 4) + 3(x + 1)}{(x + 1)(x - 4)} = \\frac{5x - 5}{(x + 1)(x - 4)}$$\n\nLeave the denominator factored: it shows at once that nothing cancels.",
        "当两个分母没有公因式时，它们的积就是最简公分母。每个分子都乘以另一个分母：\n\n$$\\frac{2}{x + 1} + \\frac{3}{x - 4} = \\frac{2(x - 4) + 3(x + 1)}{(x + 1)(x - 4)} = \\frac{5x - 5}{(x + 1)(x - 4)}$$\n\n分母保持分解的形式：一眼就能看出没有可以约去的因式。",
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
          return expressionProblem({
            prompt: simplifyPrompt(expr, [Q.of(-p), Q.of(-q)]),
            answer,
            lowest: true,
            wrong: [
              ...(c1 !== 0 ? [ratio(c1, [], 1, factors), frac(String(c1), linear(2, p + q))] : []),
              overProduct(c1, a * q - sg * b * p, factors),
              overProduct(c1, a * p + sg * b * q, factors),
            ],
            solution: t(
              `The least common denominator is $${lcd}$:${steps(`${expr} = ${frac(`${product(a, [bin(q)])} ${op} ${product(b, [bin(p)])}`, lcd)} = ${answer}`)}`,
              `最简公分母是 $${lcd}$：${steps(`${expr} = ${frac(`${product(a, [bin(q)])} ${op} ${product(b, [bin(p)])}`, lcd)} = ${answer}`)}`,
            ),
          });
        }
      },
    },
    {
      id: "leading-coefficients-in-denominators",
      title: t("Leading coefficients in the denominators", "分母带首项系数"),
      explanation: t(
        "The same method works whatever the denominators look like, as long as they share no factor:\n\n$$\\frac{1}{2x + 1} + \\frac{3}{x - 2} = \\frac{(x - 2) + 3(2x + 1)}{(2x + 1)(x - 2)} = \\frac{7x + 1}{(2x + 1)(x - 2)}$$\n\nWhen subtracting, put the second product in parentheses before distributing the minus sign.",
        "无论分母是什么样子，只要没有公因式，方法都一样：\n\n$$\\frac{1}{2x + 1} + \\frac{3}{x - 2} = \\frac{(x - 2) + 3(2x + 1)}{(2x + 1)(x - 2)} = \\frac{7x + 1}{(2x + 1)(x - 2)}$$\n\n做减法时，先给第二个乘积加上括号，再把减号分配进去。",
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
          return expressionProblem({
            prompt: simplifyPrompt(expr, [Q.of(-p, m), Q.of(-q)]),
            answer,
            lowest: true,
            wrong: [
              overProduct(a + sg * b, c0, factors),
              overProduct(c1, a * q + b * p * -sg, factors),
              ...(a + sg * b !== 0 ? [ratio(a + sg * b, [], 1, factors)] : []),
            ],
            solution: t(
              `The least common denominator is $${lcd}$:${steps(`${expr} = ${frac(`${product(a, [bin(q)])} ${op} ${product(b, [L])}`, lcd)} = ${answer}`)}`,
              `最简公分母是 $${lcd}$：${steps(`${expr} = ${frac(`${product(a, [bin(q)])} ${op} ${product(b, [L])}`, lcd)} = ${answer}`)}`,
            ),
          });
        }
      },
    },
    {
      id: "a-polynomial-plus-a-fraction",
      title: t("A polynomial plus a fraction", "多项式加分式"),
      explanation: t(
        "A polynomial is a fraction with denominator $1$. Rewrite it over the denominator of the fraction, then combine:\n\n$$2 + \\frac{3}{x - 1} = \\frac{2(x - 1)}{x - 1} + \\frac{3}{x - 1} = \\frac{2x + 1}{x - 1} \\qquad x - \\frac{6}{x + 1} = \\frac{x(x + 1) - 6}{x + 1} = \\frac{x^{2} + x - 6}{x + 1}$$",
        "多项式可以看作分母为 $1$ 的分式。把它化成与分式同分母，再合并：\n\n$$2 + \\frac{3}{x - 1} = \\frac{2(x - 1)}{x - 1} + \\frac{3}{x - 1} = \\frac{2x + 1}{x - 1} \\qquad x - \\frac{6}{x + 1} = \\frac{x(x + 1) - 6}{x + 1} = \\frac{x^{2} + x - 6}{x + 1}$$",
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
            solution: t(
              `Write $${c}$ as $${frac(product(c, [D]), D)}$ and combine:${steps(`${expr} = ${frac(`${product(c, [D])} ${op} ${a}`, D)} = ${answer}`)}`,
              `把 $${c}$ 写成 $${frac(product(c, [D]), D)}$，再合并：${steps(`${expr} = ${frac(`${product(c, [D])} ${op} ${a}`, D)} = ${answer}`)}`,
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
          solution: t(
            `Write $x$ as $${frac(`x(${D})`, D)}$ and combine:${steps(`${expr} = ${frac(`x(${D}) ${op} ${a}`, D)} = ${answer}`)}`,
            `把 $x$ 写成 $${frac(`x(${D})`, D)}$，再合并：${steps(`${expr} = ${frac(`x(${D}) ${op} ${a}`, D)} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "binomial-numerators",
      title: t("Binomial numerators", "分子是二项式"),
      explanation: t(
        "With binomial numerators, each product is a product of two binomials. Expand both, then combine like terms; when subtracting, the minus sign changes every term of the second product:\n\n$$\\frac{x + 2}{x - 1} - \\frac{x - 3}{x + 1} = \\frac{(x + 2)(x + 1) - (x - 3)(x - 1)}{(x - 1)(x + 1)} = \\frac{(x^{2} + 3x + 2) - (x^{2} - 4x + 3)}{(x - 1)(x + 1)} = \\frac{7x - 1}{(x - 1)(x + 1)}$$",
        "分子是二项式时，每个乘积都是两个二项式之积。把两个乘积展开，再合并同类项；做减法时，减号改变第二个乘积的每一项：\n\n$$\\frac{x + 2}{x - 1} - \\frac{x - 3}{x + 1} = \\frac{(x + 2)(x + 1) - (x - 3)(x - 1)}{(x - 1)(x + 1)} = \\frac{(x^{2} + 3x + 2) - (x^{2} - 4x + 3)}{(x - 1)(x + 1)} = \\frac{7x - 1}{(x - 1)(x + 1)}$$",
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
            solution: t(
              `Use the common denominator $${lcd}$ and expand:${steps(`${expr} = ${frac(`(${bin(a)})(${bin(q)}) ${op} (${bin(b)})(${bin(p)})`, lcd)}`, `= ${frac(`(${e1}) ${op} (${e2})`, lcd)} = ${answer}`)}`,
              `用公分母 $${lcd}$，再展开：${steps(`${expr} = ${frac(`(${bin(a)})(${bin(q)}) ${op} (${bin(b)})(${bin(p)})`, lcd)}`, `= ${frac(`(${e1}) ${op} (${e2})`, lcd)} = ${answer}`)}`,
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
  knowledgePoints: [
    {
      id: "multiplying-monomial-fractions",
      title: t("Monomial fractions", "单项式分式"),
      explanation: t(
        "Multiply rational expressions like numerical fractions: numerator times numerator over denominator times denominator. Cancel common factors, ideally before multiplying:\n\n$$\\frac{3x^{2}}{4y} \\cdot \\frac{8y^{3}}{9x} = \\frac{24x^{2}y^{3}}{36xy} = \\frac{2xy^{2}}{3}$$",
        "分式相乘与数的分数一样：分子乘分子，分母乘分母。约去公因式，最好在相乘之前就约：\n\n$$\\frac{3x^{2}}{4y} \\cdot \\frac{8y^{3}}{9x} = \\frac{24x^{2}y^{3}}{36xy} = \\frac{2xy^{2}}{3}$$",
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
            solution: t(
              `Multiply the numerators and the denominators, then cancel common factors:${steps(`${expr} = ${frac(mono(s * a * c, e1, f2), mono(b * d, e2, f1))} = ${answer}`)}`,
              `分子乘分子，分母乘分母，再约去公因式：${steps(`${expr} = ${frac(mono(s * a * c, e1, f2), mono(b * d, e2, f1))} = ${answer}`)}`,
            ),
          });
        }
      },
    },
    {
      id: "multiplying-factored-expressions",
      title: t("Factored polynomials", "已分解的多项式"),
      explanation: t(
        "When the numerators and denominators are already factored, cancel each factor that appears in a numerator and in a denominator, across the two fractions:\n\n$$\\frac{2(x + 1)}{(x - 3)(x + 4)} \\cdot \\frac{x - 3}{6(x + 1)(x - 5)} = \\frac{1}{3(x + 4)(x - 5)}$$\n\nWhen every factor of the numerator cancels, $1$ is left, not $0$.",
        "当分子和分母都已分解时，在两个分式之间约去同时出现在某个分子和某个分母中的因式：\n\n$$\\frac{2(x + 1)}{(x - 3)(x + 4)} \\cdot \\frac{x - 3}{6(x + 1)(x - 5)} = \\frac{1}{3(x + 4)(x - 5)}$$\n\n当分子的因式全部约去时，剩下的是 $1$，而不是 $0$。",
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
            solution: t(
              `Cancel the common factors $${cancelled}$ and the common factor of the numbers:${steps(`${expr} = ${answer}`)}`,
              `约去公因式 $${cancelled}$ 以及数的公因数：${steps(`${expr} = ${answer}`)}`,
            ),
          });
        }
      },
    },
    {
      id: "factoring-before-multiplying",
      title: t("Factoring before multiplying", "先分解再相乘"),
      explanation: t(
        "Factor every numerator and denominator first; then cancel and multiply what is left. Multiplying out first only makes the polynomials harder to factor.\n\n$$\\frac{x^{2} - 9}{2x + 4} \\cdot \\frac{x + 2}{x^{2} - x - 6} = \\frac{(x + 3)(x - 3)}{2(x + 2)} \\cdot \\frac{x + 2}{(x - 3)(x + 2)} = \\frac{x + 3}{2(x + 2)}$$",
        "先把每个分子和分母都分解因式，再约分，最后把剩下的相乘。先乘开只会让多项式更难分解。\n\n$$\\frac{x^{2} - 9}{2x + 4} \\cdot \\frac{x + 2}{x^{2} - x - 6} = \\frac{(x + 3)(x - 3)}{2(x + 2)} \\cdot \\frac{x + 2}{(x - 3)(x + 2)} = \\frac{x + 3}{2(x + 2)}$$",
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
            solution: t(
              `Factor, then cancel $${bin(a)}$, $${bin(c)}$ and the common factor of the numbers:${steps(`${expr} = ${factored}`, `= ${answer}`)}`,
              `分解因式，再约去 $${bin(a)}$、$${bin(c)}$ 以及数的公因数：${steps(`${expr} = ${factored}`, `= ${answer}`)}`,
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
  knowledgePoints: [
    {
      id: "dividing-monomial-fractions",
      title: t("Monomial fractions", "单项式分式"),
      explanation: t(
        "To divide by a fraction, multiply by its reciprocal: flip the **second** fraction only.\n\n$$\\frac{4x^{3}}{5y} \\div \\frac{2x}{15y^{2}} = \\frac{4x^{3}}{5y} \\cdot \\frac{15y^{2}}{2x} = 6x^{2}y$$",
        "除以一个分式等于乘以它的倒数：只把**第二个**分式颠倒过来。\n\n$$\\frac{4x^{3}}{5y} \\div \\frac{2x}{15y^{2}} = \\frac{4x^{3}}{5y} \\cdot \\frac{15y^{2}}{2x} = 6x^{2}y$$",
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
          return expressionProblem({
            prompt: t(`Simplify $${expr}$, where $x \\neq 0$ and $y \\neq 0$.`, `化简 $${expr}$（$x \\neq 0$，$y \\neq 0$）。`),
            answer,
            lowest: true,
            wrong: [
              monoRatio(Q.of(s * a * c, b * d), i + k, -j - l),
              monoRatio(Q.one.div(coef), k - i, j - l),
              monoRatio(coef, i + k, l - j),
            ],
            solution: t(
              `Multiply by the reciprocal of the second fraction:${steps(`${expr} = ${frac(mono(s * a, i, 0), mono(b, 0, j))} \\cdot ${frac(mono(d, 0, l), mono(c, k, 0))} = ${answer}`)}`,
              `乘以第二个分式的倒数：${steps(`${expr} = ${frac(mono(s * a, i, 0), mono(b, 0, j))} \\cdot ${frac(mono(d, 0, l), mono(c, k, 0))} = ${answer}`)}`,
            ),
          });
        }
      },
    },
    {
      id: "dividing-by-a-polynomial",
      title: t("Dividing by a polynomial", "除以多项式"),
      explanation: t(
        "A polynomial is a fraction with denominator $1$, so dividing by it multiplies by $1$ over it:\n\n$$\\frac{x^{2} - 25}{3x} \\div (x + 5) = \\frac{(x + 5)(x - 5)}{3x} \\cdot \\frac{1}{x + 5} = \\frac{x - 5}{3x}$$\n\nDividing a polynomial by a fraction multiplies it by the flipped fraction: $(x + 2) \\div \\frac{x + 2}{4} = 4$.",
        "多项式可以看作分母为 $1$ 的分式，所以除以它就是乘以 $1$ 除以它：\n\n$$\\frac{x^{2} - 25}{3x} \\div (x + 5) = \\frac{(x + 5)(x - 5)}{3x} \\cdot \\frac{1}{x + 5} = \\frac{x - 5}{3x}$$\n\n多项式除以分式，就是乘以颠倒后的分式：$(x + 2) \\div \\frac{x + 2}{4} = 4$。",
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
              solution: t(
                `Multiply by $\\frac{1}{${bin(h)}}$ and cancel:${steps(`${expr} = ${frac(`(${bin(h)})(${bin(-h)})`, poly([A, "x"]))} \\cdot ${frac("1", bin(h))} = ${answer}`)}`,
                `乘以 $\\frac{1}{${bin(h)}}$ 再约分：${steps(`${expr} = ${frac(`(${bin(h)})(${bin(-h)})`, poly([A, "x"]))} \\cdot ${frac("1", bin(h))} = ${answer}`)}`,
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
              solution: t(
                `Factor the numerator, multiply by $\\frac{1}{${bin(h)}}$ and cancel:${steps(`${expr} = ${frac(product(A, [bin(h)]), bin(q))} \\cdot ${frac("1", bin(h))} = ${answer}`)}`,
                `分解分子，乘以 $\\frac{1}{${bin(h)}}$ 再约分：${steps(`${expr} = ${frac(product(A, [bin(h)]), bin(q))} \\cdot ${frac("1", bin(h))} = ${answer}`)}`,
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
            solution: t(
              `Factor $${tri} = ${prod2(bin(h), bin(q))}$, multiply by the reciprocal and cancel:${steps(`${expr} = (${bin(h)}) \\cdot ${frac(String(A), prod2(bin(h), bin(q)))} = ${answer}`)}`,
              `分解 $${tri} = ${prod2(bin(h), bin(q))}$，乘以倒数再约分：${steps(`${expr} = (${bin(h)}) \\cdot ${frac(String(A), prod2(bin(h), bin(q)))} = ${answer}`)}`,
            ),
          });
        }
      },
    },
    {
      id: "factoring-before-dividing",
      title: t("Factoring before dividing", "先分解再相除"),
      explanation: t(
        "Flip the divisor, then factor everything and cancel:\n\n$$\\frac{x^{2} + x - 6}{4x - 8} \\div \\frac{x^{2} + 5x + 6}{2x - 4} = \\frac{(x + 3)(x - 2)}{4(x - 2)} \\cdot \\frac{2(x - 2)}{(x + 3)(x + 2)} = \\frac{x - 2}{2(x + 2)}$$\n\nThe values excluded are those that make a denominator zero **and** those that make the divisor zero, since division by zero is not defined.",
        "把除式颠倒，再把所有式子分解因式并约分：\n\n$$\\frac{x^{2} + x - 6}{4x - 8} \\div \\frac{x^{2} + 5x + 6}{2x - 4} = \\frac{(x + 3)(x - 2)}{4(x - 2)} \\cdot \\frac{2(x - 2)}{(x + 3)(x + 2)} = \\frac{x - 2}{2(x + 2)}$$\n\n要排除的值包括使分母为零的值，**以及**使除式为零的值，因为除以零没有意义。",
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
            solution: t(
              `Multiply by the reciprocal of the divisor, factor and cancel:${steps(`${expr} = ${flipped}`, `= ${answer}`)}`,
              `乘以除式的倒数，分解因式再约分：${steps(`${expr} = ${flipped}`, `= ${answer}`)}`,
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
    { topic: "adding-and-subtracting-rational-expressions", weight: 0.3 },
  ],
  xp: 16,
  standards: ["CCSS.HSA.APR.D.7"],
  knowledgePoints: [
    {
      id: "a-fraction-over-a-fraction",
      title: t("A fraction over a fraction", "分式除以分式"),
      explanation: t(
        "A **complex fraction** has fractions in its numerator or denominator. A fraction over a fraction is a division: $\\dfrac{\\;\\frac{a}{b}\\;}{\\frac{c}{d}} = \\frac{a}{b} \\div \\frac{c}{d} = \\frac{a}{b} \\cdot \\frac{d}{c}$.\n\n$$\\frac{\\;\\frac{6}{x + 2}\\;}{\\frac{4}{(x + 2)(x - 1)}} = \\frac{6}{x + 2} \\cdot \\frac{(x + 2)(x - 1)}{4} = \\frac{3(x - 1)}{2}$$",
        "分子或分母中含有分式的分式叫**繁分式**。分式除以分式就是除法：$\\dfrac{\\;\\frac{a}{b}\\;}{\\frac{c}{d}} = \\frac{a}{b} \\div \\frac{c}{d} = \\frac{a}{b} \\cdot \\frac{d}{c}$。\n\n$$\\frac{\\;\\frac{6}{x + 2}\\;}{\\frac{4}{(x + 2)(x - 1)}} = \\frac{6}{x + 2} \\cdot \\frac{(x + 2)(x - 1)}{4} = \\frac{3(x - 1)}{2}$$",
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
              solution: t(
                `Divide: multiply the top fraction by the reciprocal of the bottom one, then cancel:${steps(`${expr} = ${frac(String(A), bin(p))} \\cdot ${frac(prod2(bin(p), bin(q)), String(B))} = ${answer}`)}`,
                `做除法：用上面的分式乘以下面分式的倒数，再约分：${steps(`${expr} = ${frac(String(A), bin(p))} \\cdot ${frac(prod2(bin(p), bin(q)), String(B))} = ${answer}`)}`,
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
            solution: t(
              `Divide, factor and cancel:${steps(`${expr} = ${frac(`(${bin(h)})(${bin(-h)})`, String(B))} \\cdot ${frac(String(Math.abs(A)), bin(h))} = ${answer}`)}`,
              `做除法，分解因式再约分：${steps(`${expr} = ${frac(`(${bin(h)})(${bin(-h)})`, String(B))} \\cdot ${frac(String(Math.abs(A)), bin(h))} = ${answer}`)}`,
            ),
          });
        }
      },
    },
    {
      id: "multiplying-by-the-lcd",
      title: t("Multiplying through by the LCD", "同乘最简公分母"),
      explanation: t(
        "When the numerator and the denominator are sums containing fractions, multiply both by the least common denominator of all the small fractions. Every small fraction clears at once:\n\n$$\\frac{2 + \\frac{3}{x}}{1 - \\frac{4}{x}} = \\frac{\\left(2 + \\frac{3}{x}\\right) \\cdot x}{\\left(1 - \\frac{4}{x}\\right) \\cdot x} = \\frac{2x + 3}{x - 4}$$\n\nMultiply **every** term by the LCD, the whole numbers too.",
        "当分子和分母是含有分式的和时，把分子和分母同乘所有小分式的最简公分母，所有小分式一次就被消去：\n\n$$\\frac{2 + \\frac{3}{x}}{1 - \\frac{4}{x}} = \\frac{\\left(2 + \\frac{3}{x}\\right) \\cdot x}{\\left(1 - \\frac{4}{x}\\right) \\cdot x} = \\frac{2x + 3}{x - 4}$$\n\n**每一项**都要乘以最简公分母，整数项也不例外。",
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
            solution: t(
              `Multiply the numerator and the denominator by $x$:${steps(`${expr} = ${frac(`\\left(${part(c, a)}\\right) \\cdot x`, `\\left(${part(d, b)}\\right) \\cdot x`)} = ${answer}`)}`,
              `分子和分母同乘 $x$：${steps(`${expr} = ${frac(`\\left(${part(c, a)}\\right) \\cdot x`, `\\left(${part(d, b)}\\right) \\cdot x`)} = ${answer}`)}`,
            ),
          });
        }
      },
    },
    {
      id: "complex-fractions-that-factor",
      title: t("Complex fractions that factor", "可以分解的繁分式"),
      explanation: t(
        "After clearing the small fractions, factor and cancel:\n\n$$\\frac{1 - \\frac{9}{x^{2}}}{1 + \\frac{3}{x}} = \\frac{x^{2} - 9}{x^{2} + 3x} = \\frac{(x + 3)(x - 3)}{x(x + 3)} = \\frac{x - 3}{x}$$\n\nHere the LCD of $\\frac{9}{x^{2}}$ and $\\frac{3}{x}$ is $x^{2}$.",
        "消去小分式之后，再分解因式并约分：\n\n$$\\frac{1 - \\frac{9}{x^{2}}}{1 + \\frac{3}{x}} = \\frac{x^{2} - 9}{x^{2} + 3x} = \\frac{(x + 3)(x - 3)}{x(x + 3)} = \\frac{x - 3}{x}$$\n\n这里 $\\frac{9}{x^{2}}$ 与 $\\frac{3}{x}$ 的最简公分母是 $x^{2}$。",
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
            solution: t(
              `Multiply the numerator and the denominator by $x^{2}$, factor and cancel:${steps(`${expr} = ${frac(`x^{2} - ${a * a}`, poly([1, "x^{2}"], [a, "x"]))} = ${frac(`(${bin(a)})(${bin(-a)})`, `x(${bin(a)})`)} = ${answer}`)}`,
              `分子和分母同乘 $x^{2}$，分解因式再约分：${steps(`${expr} = ${frac(`x^{2} - ${a * a}`, poly([1, "x^{2}"], [a, "x"]))} = ${frac(`(${bin(a)})(${bin(-a)})`, `x(${bin(a)})`)} = ${answer}`)}`,
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
            solution: t(
              `Multiply the numerator and the denominator by $x^{2}$, factor and cancel:${steps(`${expr} = ${frac(poly([1, "x^{2}"], [a, "x"]), `x^{2} - ${a * a}`)} = ${frac(`x(${bin(a)})`, `(${bin(a)})(${bin(-a)})`)} = ${answer}`)}`,
              `分子和分母同乘 $x^{2}$，分解因式再约分：${steps(`${expr} = ${frac(poly([1, "x^{2}"], [a, "x"]), `x^{2} - ${a * a}`)} = ${frac(`x(${bin(a)})`, `(${bin(a)})(${bin(-a)})`)} = ${answer}`)}`,
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
          solution: t(
            `Multiply the numerator and the denominator by $${num(a)}x$. The numerator becomes $${poly([a, ""], [-1, "x"])} = -(${bin(-a)})$:${steps(`${expr} = ${frac(poly([a, ""], [-1, "x"]), `${a}x(${bin(-a)})`)} = ${answer}`)}`,
            `分子和分母同乘 $${num(a)}x$，分子变为 $${poly([a, ""], [-1, "x"])} = -(${bin(-a)})$：${steps(`${expr} = ${frac(poly([a, ""], [-1, "x"]), `${a}x(${bin(-a)})`)} = ${answer}`)}`,
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
