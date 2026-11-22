import type { Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { gcd, lcm, linear, paren, poly } from "@ga/subject-math";
import { algebraDrawings3 } from "../explanation-drawings-algebra-3.ts";
import { expressionProblem, factoredProblem, numberProblem, steps } from "../problems.ts";
import { stepLabel } from "../solution-kit.ts";

/** label is the bold label of step i in both locales, followed by a space in English. */
const label = (i: number, en: string, zh: string): Text => {
  const s = stepLabel(i, en, zh);
  return t(`${s.en} `, s["zh-CN"]);
};

/** join puts texts one after another in each locale. */
const join = (...parts: readonly Text[]): Text => t(parts.map((p) => p.en).join(""), parts.map((p) => p["zh-CN"]).join(""));

/** para starts a new paragraph. */
const para = t("\n\n", "\n\n");

/** said is a closing check paragraph in both locales. */
const said = (en: string, zh: string) => t(`\n\n**Check.** ${en}`, `\n\n**检验。**${zh}`);

/** both is the same displayed work after an English and a Chinese lead-in. */
const both = (en: string, zh: string, ...lines: readonly string[]) => {
  const work = steps(...lines).trimEnd();
  return t(`${en}${work}`, `${zh}${work}`);
};

/** disp is displayed work that closes a paragraph. */
const disp = (...lines: readonly string[]) => steps(...lines).trimEnd();

/** Part is the value of one factor at the test point and the power it is raised to. */
type Part = readonly [number, number];

/** atX picks the first whole number from 2 up at which none of the factors is zero. */
function atX(factors: (x: number) => readonly number[]): number {
  let x = 2;
  while (factors(x).some((f) => f === 0)) x++;
  return x;
}

/** valueCheck compares an expression with its factored form at one value of the variable, with y = 1 when y appears. */
function valueCheck(x: number, value: number, parts: readonly Part[], v = "x", withY = false): Text {
  const product = parts.reduce((a, [b, e]) => a * b ** e, 1);
  if (product !== value) throw new Error(`valueCheck: ${product} is not ${value}`);
  const shown = parts.map(([b, e]) => (e === 1 ? paren(b) : `${paren(b)}^{${e}}`)).join(" \\cdot ");
  const at = withY ? `$${v} = ${x}$ and $y = 1$` : `$${v} = ${x}$`;
  const atZh = withY ? `$${v} = ${x}$，$y = 1$` : `$${v} = ${x}$`;
  return said(
    `Substitute ${at} into both forms. The original expression equals $${value}$, and the factors give $${shown} = ${value}$. The two values agree.`,
    `把 ${atZh} 代入两种形式。原式的值是 $${value}$，各因式的值相乘得 $${shown} = ${value}$，两者相等。`,
  );
}

/** pw writes a power of a variable: "", "x" or "x^{3}". */
const pw = (v: string, e: number) => (e === 0 ? "" : e === 1 ? v : `${v}^{${e}}`);

/** mono writes the monomial c·xᵃ·yᵇ. */
const mono = (c: number, x = 0, y = 0) => poly([c, `${pw("x", x)}${pw("y", y)}`]);

/** front writes a monomial factor before parentheses: "", "-", "3" or "-2x^{2}". */
const front = (c: number, x = 0, y = 0) => (x === 0 && y === 0 ? (c === 1 ? "" : c === -1 ? "-" : String(c)) : mono(c, x, y));

/** lf writes the factor (px + q). */
const lf = (p: number, q: number, v = "x") => `(${linear(p, q, v)})`;

/** quad writes ax² + bx + c in the variable v. */
const quad = (a: number, b: number, c: number, v = "x") => poly([a, pw(v, 2)], [b, v], [c, ""]);

/** bpow writes a factor raised to a power: "(x + 2)" or "(x + 2)^{3}". */
const bpow = (f: string, e: number) => (e === 1 ? f : `${f}^{${e}}`);

/** isSquare tells whether n is the square of an integer. */
const isSquare = (n: number) => n >= 0 && Math.round(Math.sqrt(n)) ** 2 === n;

/** isCube tells whether n is the cube of an integer. */
const isCube = (n: number) => Math.round(Math.cbrt(n)) ** 3 === n;

/** factorPrompt asks to factor an expression completely. */
const factorPrompt = (expr: string): Text => t(`Factor $${expr}$ completely.`, `将 $${expr}$ 彻底分解因式。`);

/** times writes a coefficient before a parenthesized factor in a sum: "", "3" for 3(x + 1), the sign written separately. */
const times = (c: number) => (Math.abs(c) === 1 ? "" : String(Math.abs(c)));

/** signed joins a term to an expression with the sign of c: " + 3(x + 1)" or " - (x + 1)". */
const signed = (c: number, body: string) => ` ${c < 0 ? "-" : "+"} ${times(c)}${body}`;

// ─── 2.3.1 The least common multiple of two monomials ───────────────────────

/** lcmSolution explains the least common multiple of monomials given as [coefficient, x exponent, y exponent]. */
function lcmSolution(ms: readonly (readonly [number, number, number])[]): Text {
  const coefs = ms.map((m) => Math.abs(m[0])).join(", ");
  const l = ms.reduce((a, m) => lcm(a, Math.abs(m[0])), 1);
  const xMax = Math.max(...ms.map((m) => m[1]));
  const yMax = Math.max(...ms.map((m) => m[2]));
  const xs = ms.map((m) => (m[1] === 0 ? "1" : pw("x", m[1]))).join(", ");
  const ys = ms.map((m) => (m[2] === 0 ? "1" : pw("y", m[2]))).join(", ");
  const answer = mono(l, xMax, yMax);
  const yPart =
    yMax === 0
      ? t("", "")
      : t(`, and the largest power of $y$ among $${ys}$ is $${pw("y", yMax)}$`, `；$${ys}$ 中 $y$ 的最高次幂是 $${pw("y", yMax)}$`);
  const negative = ms.some((m) => m[0] < 0);
  const quotients = ms.map((m) => {
    const divisor = mono(m[0], m[1], m[2]);
    return `${answer} \\div ${m[0] < 0 ? `(${divisor})` : divisor} = ${mono((Math.sign(m[0]) * l) / Math.abs(m[0]), xMax - m[1], yMax - m[2])}`;
  });
  return join(
    label(1, "Coefficients", "系数"),
    t(
      `${negative ? "Signs do not matter, so use the absolute values. " : ""}The least common multiple of the coefficients $${coefs}$ is $${l}$.`,
      `${negative ? "符号不影响结果，所以取绝对值。" : ""}系数 $${coefs}$ 的最小公倍数是 $${l}$。`,
    ),
    para,
    label(2, "Variables", "变量"),
    t(
      `Each variable takes its largest exponent. The largest power of $x$ among $${xs}$ is $${pw("x", xMax)}$${yPart.en}. So the least common multiple is $${answer}$.`,
      `每个变量取最高的指数。$${xs}$ 中 $x$ 的最高次幂是 $${pw("x", xMax)}$${yPart["zh-CN"]}。所以最小公倍式是 $${answer}$。`,
    ),
    said(
      `Divide the answer by each monomial:${disp(...quotients)}\n\nEvery quotient is a monomial, so $${answer}$ is a common multiple. The quotients have no common factor other than $\\pm 1$, so no smaller common multiple exists.`,
      `用答案除以每个单项式：${disp(...quotients)}\n\n每个商都是单项式，所以 $${answer}$ 是公倍式。这些商除 $\\pm 1$ 外没有公因式，所以不存在更小的公倍式。`,
    ),
  );
}

/** theLeastCommonMultipleOfTwoMonomials finds the least common multiple of monomials. */
export const theLeastCommonMultipleOfTwoMonomials: TopicDef = {
  id: "the-least-common-multiple-of-two-monomials",
  title: t("The Least Common Multiple of Two Monomials", "两个单项式的最小公倍式"),
  summary: t(
    "Find the least common multiple of monomials: the least common multiple of the coefficients times each variable to its largest power.",
    "求单项式的最小公倍式：系数的最小公倍数乘以每个变量的最高次幂。",
  ),
  prerequisites: ["greatest-common-factor-of-monomials", "least-common-multiple"],
  encompasses: [{ topic: "least-common-multiple", weight: 0.5 }],
  xp: 10,
  intro: t(
    `You can find the least common multiple of two numbers and the greatest common factor of two monomials. The least common multiple of monomials joins the two ideas, and it is the common denominator you need to add fractions whose denominators are monomials.

Take $10x^{2}$ and $15x^{4}$. The least common multiple of $10$ and $15$ is $30$, and the larger power of $x$ is $x^{4}$, so the least common multiple is $30x^{4}$. Both monomials divide it: $30x^{4} = 10x^{2} \\cdot 3x^{2} = 15x^{4} \\cdot 2$.`,
    `你已经会求两个数的最小公倍数，也会求两个单项式的最大公因式。单项式的最小公倍式把这两者结合起来；把分母是单项式的分数相加时，它就是需要的公分母。

看 $10x^{2}$ 和 $15x^{4}$。$10$ 和 $15$ 的最小公倍数是 $30$，$x$ 的较高次幂是 $x^{4}$，所以最小公倍式是 $30x^{4}$。两个单项式都能整除它：$30x^{4} = 10x^{2} \\cdot 3x^{2} = 15x^{4} \\cdot 2$。`,
  ),
  knowledgePoints: [
    {
      id: "one-variable",
      title: t("Two monomials in one variable", "两个一元单项式"),
      explanation: t(
        "The **least common multiple** (LCM) of two monomials is the simplest monomial that both divide. Take the least common multiple of the coefficients, times the variable raised to the **larger** of its two exponents: a multiple of both $x^{5}$ and $x^{3}$ needs at least five factors of $x$.\n\nFor $6x^{5}$ and $8x^{3}$: the LCM of $6$ and $8$ is $24$, and the larger power is $x^{5}$, so the LCM is $24x^{5}$. Check: $24x^{5} = 6x^{5} \\cdot 4 = 8x^{3} \\cdot 3x^{2}$.\n\nThe product $48x^{8}$ is a common multiple too, but not the least one. Compare the greatest common factor, which takes the **smaller** exponent: $2x^{3}$.\n\n> **Watch out.** The LCM of the coefficients is not always their product: the LCM of $6$ and $8$ is $24$, not $48$. Multiply the coefficients only when they have no common factor.",
        "两个单项式的**最小公倍式**是能被它们都整除的最简单的单项式。取系数的最小公倍数，乘以变量的幂，指数取两个指数中**较大**的一个：要同时是 $x^{5}$ 和 $x^{3}$ 的倍式，至少要含有五个 $x$。\n\n对 $6x^{5}$ 和 $8x^{3}$：$6$ 和 $8$ 的最小公倍数是 $24$，较高的幂是 $x^{5}$，所以最小公倍式是 $24x^{5}$。检验：$24x^{5} = 6x^{5} \\cdot 4 = 8x^{3} \\cdot 3x^{2}$。\n\n乘积 $48x^{8}$ 也是公倍式，但不是最小的。对比最大公因式，它取**较小**的指数：$2x^{3}$。\n\n> **注意。** 系数的最小公倍数不一定是它们的积：$6$ 和 $8$ 的最小公倍数是 $24$，不是 $48$。只有两个系数没有公因数时，才能直接相乘。",
      ),
      keyPrerequisites: ["least-common-multiple"],
      generate(rng) {
        let a: number;
        let b: number;
        do {
          a = rng.int(2, 18);
          b = rng.int(2, 18);
        } while (a === b || (gcd(a, b) === 1 && rng.bool(0.6)));
        let m: number;
        let n: number;
        do {
          m = rng.int(1, 7);
          n = rng.int(1, 7);
        } while (m === n);
        const ms = [
          [a, m, 0],
          [b, n, 0],
        ] as const;
        const l = lcm(a, b);
        const hi = Math.max(m, n);
        const lo = Math.min(m, n);
        return expressionProblem({
          prompt: t(
            `Find the least common multiple of $${mono(a, m)}$ and $${mono(b, n)}$.`,
            `求 $${mono(a, m)}$ 和 $${mono(b, n)}$ 的最小公倍式。`,
          ),
          answer: mono(l, hi),
          simplified: true,
          wrong: [mono(a * b, hi), mono(l, m + n), mono(a * b, m + n), mono(gcd(a, b), lo), mono(l, lo)],
          solution: lcmSolution(ms),
        });
      },
    },
    {
      id: "two-variables",
      title: t("Monomials in two variables", "含两个变量的单项式"),
      explanation: t(
        "With several variables, treat each variable separately and take its largest exponent. A variable that appears in only one of the monomials **is** part of the LCM, since the multiple must contain it. Signs do not matter: the LCM is taken positive.\n\n$$\\text{The LCM of } 4x^{2}y^{3} \\text{ and } -6x^{5} \\text{ is } 12x^{5}y^{3}$$\n\nThe greatest common factor of the same monomials, $2x^{2}$, leaves $y$ out; the LCM keeps it.\n\n> **Watch out.** Do not drop a variable that appears in only one monomial, and do not take the smaller exponent: that gives the greatest common factor, not the LCM.",
        "多个变量时，每个变量分别考虑，取最高的指数。只在一个单项式中出现的变量**也要**写进最小公倍式，因为公倍式必须含有它。符号不影响结果：最小公倍式取正的。\n\n$$4x^{2}y^{3} \\text{ 和 } -6x^{5} \\text{ 的最小公倍式是 } 12x^{5}y^{3}$$\n\n这两个单项式的最大公因式是 $2x^{2}$，不含 $y$；而最小公倍式要保留 $y$。\n\n> **注意。** 不要漏掉只出现在一个单项式中的变量，也不要取较小的指数：那样得到的是最大公因式，而不是最小公倍式。",
      ),
      generate(rng) {
        let a: number;
        let b: number;
        do {
          a = rng.int(2, 15);
          b = rng.int(2, 15);
        } while (a === b);
        const i = rng.int(1, 6);
        const k = rng.bool(0.2) ? 0 : rng.int(1, 6);
        const j = rng.bool(0.25) ? 0 : rng.int(1, 5);
        const l = j === 0 ? rng.int(1, 5) : rng.int(0, 5);
        const s = rng.bool(0.25) ? -1 : 1;
        const pair: [number, number, number][] = [
          [s * a, i, j],
          [b, k, l],
        ];
        const ms = rng.bool() ? pair : [pair[1]!, pair[0]!];
        const [m1, m2] = ms as [[number, number, number], [number, number, number]];
        const L = lcm(a, b);
        const X = Math.max(i, k);
        const Y = Math.max(j, l);
        return expressionProblem({
          prompt: t(
            `Find the least common multiple of $${mono(...m1)}$ and $${mono(...m2)}$.`,
            `求 $${mono(...m1)}$ 和 $${mono(...m2)}$ 的最小公倍式。`,
          ),
          answer: mono(L, X, Y),
          simplified: true,
          wrong: [
            mono(gcd(a, b), Math.min(i, k), Math.min(j, l)),
            mono(L, i + k, j + l),
            mono(L, X, Math.min(j, l)),
            mono(L, Math.min(i, k), Y),
            mono(a * b, X, Y),
            mono(-L, X, Y),
          ],
          solution: lcmSolution(ms),
        });
      },
    },
    {
      id: "three-monomials",
      title: t("Three monomials", "三个单项式"),
      explanation: t(
        "For three monomials, the LCM must be a multiple of all three: take the least common multiple of the three coefficients and, for each variable in any of them, its largest exponent.\n\n$$\\text{The LCM of } 2x^{3}y, \\; 3xy^{4} \\text{ and } 4x^{2} \\text{ is } 12x^{3}y^{4}$$\n\n> **Watch out.** Use all three coefficients and all three exponents: the LCM of the first two monomials alone need not be a multiple of the third.",
        "三个单项式的最小公倍式必须是这三个单项式的公倍式：取三个系数的最小公倍数，对任一单项式中出现的每个变量取最高的指数。\n\n$$2x^{3}y, \\; 3xy^{4} \\text{ 和 } 4x^{2} \\text{ 的最小公倍式是 } 12x^{3}y^{4}$$\n\n> **注意。** 三个系数、三个指数都要考虑：只求前两个单项式的最小公倍式，未必是第三个单项式的倍式。",
      ),
      generate(rng) {
        let cs: number[];
        do {
          cs = [rng.int(2, 12), rng.int(2, 12), rng.int(2, 12)];
        } while (new Set(cs).size < 3);
        const ms = cs.map((c) => [c, rng.int(1, 6), rng.bool(0.3) ? 0 : rng.int(1, 5)] as const);
        const L = cs.reduce((a, c) => lcm(a, c), 1);
        const X = Math.max(...ms.map((m) => m[1]));
        const Y = Math.max(...ms.map((m) => m[2]));
        const firstTwo = lcm(cs[0]!, cs[1]!);
        const list = ms.map((m) => mono(...m));
        return expressionProblem({
          prompt: t(
            `Find the least common multiple of $${list[0]}$, $${list[1]}$ and $${list[2]}$.`,
            `求 $${list[0]}$、$${list[1]}$ 和 $${list[2]}$ 的最小公倍式。`,
          ),
          answer: mono(L, X, Y),
          simplified: true,
          wrong: [
            mono(firstTwo, Math.max(ms[0]![1], ms[1]![1]), Math.max(ms[0]![2], ms[1]![2])),
            mono(cs[0]! * cs[1]! * cs[2]!, X, Y),
            mono(L, Math.min(...ms.map((m) => m[1])), Math.min(...ms.map((m) => m[2]))),
            mono(
              L,
              ms.reduce((a, m) => a + m[1], 0),
              ms.reduce((a, m) => a + m[2], 0),
            ),
          ],
          solution: lcmSolution(ms),
        });
      },
    },
  ],
};

// ─── 2.3.2 The least common multiple of two polynomials ─────────────────────

/** theLeastCommonMultipleOfTwoPolynomials finds the least common multiple of polynomials by factoring them. */
export const theLeastCommonMultipleOfTwoPolynomials: TopicDef = {
  id: "the-least-common-multiple-of-two-polynomials",
  title: t("The Least Common Multiple of Two Polynomials", "两个多项式的最小公倍式"),
  summary: t(
    "Factor two polynomials and take every factor to the largest power in which it appears to find their least common multiple.",
    "把两个多项式分解因式，每个因式取它出现的最高次幂，求出最小公倍式。",
  ),
  prerequisites: [
    "the-least-common-multiple-of-two-monomials",
    "factoring-trinomials-using-common-factors",
    "factoring-differences-of-squares",
  ],
  encompasses: [
    { topic: "the-least-common-multiple-of-two-monomials", weight: 0.5 },
    { topic: "factoring-trinomials", weight: 0.4 },
  ],
  xp: 14,
  standards: ["CCSS.HSA.SSE.A.2"],
  intro: t(
    `You can find the least common multiple of monomials, and you can factor trinomials and differences of squares. Polynomials have least common multiples too, built from their factors, and they become the common denominators of rational expressions.

Take $x^{2} - 1$ and $x^{2} + 2x + 1$. Factor them as $(x + 1)(x - 1)$ and $(x + 1)^{2}$. The factor $x + 1$ is taken to its larger power and $x - 1$ once, so the least common multiple is $(x + 1)^{2}(x - 1)$.`,
    `你已经会求单项式的最小公倍式，也会分解三项式和平方差。多项式也有最小公倍式，由它们的因式组成，以后会成为分式的公分母。

看 $x^{2} - 1$ 和 $x^{2} + 2x + 1$。把它们分解为 $(x + 1)(x - 1)$ 和 $(x + 1)^{2}$。因式 $x + 1$ 取较高的次幂，$x - 1$ 取一次，所以最小公倍式是 $(x + 1)^{2}(x - 1)$。`,
  ),
  knowledgePoints: [
    {
      id: "factored-polynomials",
      title: t("Polynomials in factored form", "已分解的多项式"),
      explanation: t(
        "The least common multiple of polynomials works like that of monomials, with the factors in place of the variables: take the LCM of the numerical factors, and every polynomial factor raised to the **largest** power in which it appears in either polynomial.\n\nFor $4(x + 1)^{2}(x - 3)$ and $6(x + 1)(x + 5)$: the LCM of $4$ and $6$ is $12$; $(x + 1)$ appears at most squared; $(x - 3)$ and $(x + 5)$ each appear once. So the LCM is\n\n$$12(x + 1)^{2}(x - 3)(x + 5)$$\n\nThe product of the two polynomials, $24(x + 1)^{3}(x - 3)(x + 5)$, is a common multiple but not the least one.\n\n> **Watch out.** Do not add the exponents of a shared factor: for $(x + 1)^{2}$ and $(x + 1)$ the LCM needs only $(x + 1)^{2}$, not $(x + 1)^{3}$.",
        "多项式的最小公倍式与单项式类似，只是把变量换成了因式：取数字因数的最小公倍数，每个多项式因式取它在两个多项式中出现的**最高**次幂。\n\n对 $4(x + 1)^{2}(x - 3)$ 和 $6(x + 1)(x + 5)$：$4$ 和 $6$ 的最小公倍数是 $12$；$(x + 1)$ 最多出现平方；$(x - 3)$ 和 $(x + 5)$ 各出现一次。所以最小公倍式是\n\n$$12(x + 1)^{2}(x - 3)(x + 5)$$\n\n两个多项式的乘积 $24(x + 1)^{3}(x - 3)(x + 5)$ 是公倍式，但不是最小的。\n\n> **注意。** 公共因式的指数不要相加：对 $(x + 1)^{2}$ 和 $(x + 1)$，最小公倍式只需要 $(x + 1)^{2}$，而不是 $(x + 1)^{3}$。",
      ),
      keyPrerequisites: ["the-least-common-multiple-of-two-monomials"],
      generate(rng) {
        let s: number;
        let r1: number;
        let r2: number;
        do {
          s = rng.nonZero(-9, 9);
          r1 = rng.nonZero(-9, 9);
          r2 = rng.nonZero(-9, 9);
        } while (new Set([s, r1, r2]).size < 3);
        const k1 = rng.int(1, 9);
        const k2 = rng.int(1, 9);
        const e1 = rng.int(1, 3);
        const e2 = rng.int(1, 3);
        const S = lf(1, s);
        const p1 = `${front(k1)}${bpow(S, e1)}${lf(1, r1)}`;
        const p2 = `${front(k2)}${bpow(S, e2)}${lf(1, r2)}`;
        const L = lcm(k1, k2);
        const hi = Math.max(e1, e2);
        const answer = `${front(L)}${bpow(S, hi)}${lf(1, r1)}${lf(1, r2)}`;
        return factoredProblem({
          prompt: t(
            `Find the least common multiple of $${p1}$ and $${p2}$. Write it in factored form.`,
            `求 $${p1}$ 和 $${p2}$ 的最小公倍式，写成因式分解的形式。`,
          ),
          answer,
          wrong: [
            `${front(k1 * k2)}${bpow(S, e1 + e2)}${lf(1, r1)}${lf(1, r2)}`,
            `${front(L)}${bpow(S, e1 + e2)}${lf(1, r1)}${lf(1, r2)}`,
            `${front(L)}${bpow(S, Math.min(e1, e2))}${lf(1, r1)}${lf(1, r2)}`,
            `${front(k1 * k2)}${bpow(S, hi)}${lf(1, r1)}${lf(1, r2)}`,
            `${front(gcd(k1, k2))}${bpow(S, Math.min(e1, e2))}`,
          ],
          solution: join(
            label(1, "Numbers", "数字因数"),
            t(`The LCM of the numbers $${k1}$ and $${k2}$ is $${L}$.`, `数 $${k1}$ 和 $${k2}$ 的最小公倍数是 $${L}$。`),
            para,
            label(2, "Factors", "因式"),
            both(
              `The factor $${S}$ appears to the powers $${e1}$ and $${e2}$; take the larger, $${hi}$. The factors $${lf(1, r1)}$ and $${lf(1, r2)}$ each appear once. So the least common multiple is`,
              `因式 $${S}$ 的次数分别是 $${e1}$ 和 $${e2}$，取较大的 $${hi}$。因式 $${lf(1, r1)}$ 和 $${lf(1, r2)}$ 各出现一次。所以最小公倍式是`,
              `${answer}`,
            ),
            said(
              `Multiply each polynomial by the factors it lacks; both products must be the answer:${disp(
                `${p1} \\cdot ${front(L / k1)}${hi > e1 ? bpow(S, hi - e1) : ""}${lf(1, r2)} = ${answer}`,
                `${p2} \\cdot ${front(L / k2)}${hi > e2 ? bpow(S, hi - e2) : ""}${lf(1, r1)} = ${answer}`,
              )}`,
              `每个多项式乘以它缺少的因式，两个乘积都应等于答案：${disp(
                `${p1} \\cdot ${front(L / k1)}${hi > e1 ? bpow(S, hi - e1) : ""}${lf(1, r2)} = ${answer}`,
                `${p2} \\cdot ${front(L / k2)}${hi > e2 ? bpow(S, hi - e2) : ""}${lf(1, r1)} = ${answer}`,
              )}`,
            ),
          ),
        });
      },
    },
    {
      id: "factoring-first",
      title: t("Factoring the polynomials first", "先分解多项式"),
      explanation: t(
        "When the polynomials are not factored, factor each completely first; then the common factors become visible.\n\nFor $x^{2} - 9$ and $x^{2} + 5x + 6$:\n\n$$x^{2} - 9 = (x + 3)(x - 3) \\qquad x^{2} + 5x + 6 = (x + 2)(x + 3)$$\n\nThe factor $(x + 3)$ is shared, so it is taken once:\n\n$$\\text{LCM} = (x + 3)(x - 3)(x + 2)$$\n\n> **Watch out.** A shared factor is written once: $(x + 3)^{2}(x - 3)(x + 2)$ is a common multiple, but not the least one.",
        "如果多项式没有分解，先把每个多项式彻底分解，公共因式就显现出来了。\n\n对 $x^{2} - 9$ 和 $x^{2} + 5x + 6$：\n\n$$x^{2} - 9 = (x + 3)(x - 3) \\qquad x^{2} + 5x + 6 = (x + 2)(x + 3)$$\n\n因式 $(x + 3)$ 是公共的，只取一次：\n\n$$\\text{最小公倍式} = (x + 3)(x - 3)(x + 2)$$\n\n> **注意。** 公共因式只写一次：$(x + 3)^{2}(x - 3)(x + 2)$ 是公倍式，但不是最小的。",
      ),
      keyPrerequisites: ["factoring-trinomials"],
      generate(rng) {
        let s: number;
        let r1: number;
        let r2: number;
        do {
          s = rng.nonZero(-9, 9);
          r1 = rng.bool(0.3) ? -s : rng.nonZero(-9, 9);
          r2 = rng.nonZero(-9, 9);
        } while (new Set([s, r1, r2]).size < 3);
        const q1 = quad(1, s + r1, s * r1);
        const q2 = quad(1, s + r2, s * r2);
        const [a, b] = rng.bool() ? [q1, q2] : [q2, q1];
        const S = lf(1, s);
        const answer = `${S}${lf(1, r1)}${lf(1, r2)}`;
        return factoredProblem({
          prompt: t(
            `Find the least common multiple of $${a}$ and $${b}$. Write it in factored form.`,
            `求 $${a}$ 和 $${b}$ 的最小公倍式，写成因式分解的形式。`,
          ),
          answer,
          wrong: [`${S}^{2}${lf(1, r1)}${lf(1, r2)}`, `${lf(1, -s)}${lf(1, -r1)}${lf(1, -r2)}`, `${S}${lf(1, r1)}`, `${S}${lf(1, r2)}`],
          solution: join(
            label(1, "Factor both polynomials", "分解两个多项式"),
            both("Factor each one completely:", "把每个多项式彻底分解：", `${q1} = ${S}${lf(1, r1)}`, `${q2} = ${S}${lf(1, r2)}`),
            para,
            label(2, "Combine the factors", "组合因式"),
            both(
              `The factor $${S}$ is shared, so it is taken once, with the other factor of each:`,
              `因式 $${S}$ 是公共的，只取一次，再乘以各自的另一个因式：`,
              `\\text{LCM} = ${answer}`,
            ),
            said(
              `Each polynomial times the factor it lacks gives the answer:${disp(`(${q1})${lf(1, r2)} = ${answer}`, `(${q2})${lf(1, r1)} = ${answer}`)}\n\nNo factor can be dropped, since each of the three linear factors is needed by one of the polynomials.`,
              `每个多项式乘以它缺少的因式都得到答案：${disp(`(${q1})${lf(1, r2)} = ${answer}`, `(${q2})${lf(1, r1)} = ${answer}`)}\n\n没有因式可以去掉，因为三个一次因式都是某个多项式所需要的。`,
            ),
          ),
        });
      },
    },
    {
      id: "monomial-factors",
      title: t("Common factors and monomial factors", "公因数与单项式因式"),
      explanation: t(
        "Take out the greatest common factor of each polynomial too: numbers and powers of $x$ are factors like any other.\n\nFor $2x^{2} + 6x$ and $3x^{2} - 27$:\n\n$$2x^{2} + 6x = 2x(x + 3) \\qquad 3x^{2} - 27 = 3(x + 3)(x - 3)$$\n\nThe LCM takes the LCM of $2$ and $3$, the factor $x$, the shared factor $(x + 3)$ once, and $(x - 3)$:\n\n$$\\text{LCM} = 6x(x + 3)(x - 3)$$\n\n> **Watch out.** Take out the greatest common factor before comparing. The factor $3$ of $3x^{2} - 27$ is easy to miss, and without it the result is not a multiple of $3x^{2} - 27$.",
        "每个多项式也要提出最大公因式：数和 $x$ 的幂与其他因式一样都是因式。\n\n对 $2x^{2} + 6x$ 和 $3x^{2} - 27$：\n\n$$2x^{2} + 6x = 2x(x + 3) \\qquad 3x^{2} - 27 = 3(x + 3)(x - 3)$$\n\n最小公倍式取 $2$ 和 $3$ 的最小公倍数、因式 $x$、公共因式 $(x + 3)$ 一次，以及 $(x - 3)$：\n\n$$\\text{最小公倍式} = 6x(x + 3)(x - 3)$$\n\n> **注意。** 比较之前先提出最大公因式。$3x^{2} - 27$ 的因数 $3$ 容易漏掉，漏掉它，结果就不是 $3x^{2} - 27$ 的倍式。",
      ),
      generate(rng) {
        let s: number;
        let r: number;
        do {
          s = rng.nonZero(-9, 9);
          r = rng.bool(0.4) ? -s : rng.nonZero(-9, 9);
        } while (r === s);
        let k1: number;
        let k2: number;
        do {
          k1 = rng.int(1, 8);
          k2 = rng.int(2, 8);
        } while (k1 === k2);
        const p1 = poly([k1, "x^{2}"], [k1 * s, "x"]);
        const p2 = quad(k2, k2 * (s + r), k2 * s * r);
        const S = lf(1, s);
        const L = lcm(k1, k2);
        const answer = `${front(L, 1)}${S}${lf(1, r)}`;
        const f1 = `${front(k1, 1)}${S}`;
        const f2 = `${front(k2)}${S}${lf(1, r)}`;
        return factoredProblem({
          prompt: t(
            `Find the least common multiple of $${p1}$ and $${p2}$. Write it in factored form.`,
            `求 $${p1}$ 和 $${p2}$ 的最小公倍式，写成因式分解的形式。`,
          ),
          answer,
          wrong: [
            `${front(k1 * k2, 1)}${S}^{2}${lf(1, r)}`,
            `${front(L)}${S}${lf(1, r)}`,
            `${front(k1 * k2, 1)}${S}${lf(1, r)}`,
            `${front(L, 1)}${S}`,
          ],
          solution: join(
            label(1, "Factor both polynomials completely", "把两个多项式彻底分解"),
            both("Take out each greatest common factor first:", "先提出各自的最大公因式：", `${p1} = ${f1}`, `${p2} = ${f2}`),
            para,
            label(2, "Combine the factors", "组合因式"),
            both(
              `Take the LCM of $${k1}$ and $${k2}$, which is $${L}$, the factor $x$, the shared factor $${S}$ once and the factor $${lf(1, r)}$:`,
              `取 $${k1}$ 和 $${k2}$ 的最小公倍数 $${L}$、因式 $x$、公共因式 $${S}$ 一次，以及因式 $${lf(1, r)}$：`,
              `\\text{LCM} = ${answer}`,
            ),
            said(
              `Multiply each factored polynomial by what it lacks; both products must be the answer:${disp(`${f1} \\cdot ${front(L / k1)}${lf(1, r)} = ${answer}`, `${f2} \\cdot ${mono(L / k2, 1)} = ${answer}`)}`,
              `每个分解后的多项式乘以它缺少的部分，两个乘积都应等于答案：${disp(`${f1} \\cdot ${front(L / k1)}${lf(1, r)} = ${answer}`, `${f2} \\cdot ${mono(L / k2, 1)} = ${answer}`)}`,
            ),
          ),
        });
      },
    },
  ],
};

// ─── 2.3.3 Describing relationships using polynomial identities ─────────────

/** describingRelationshipsUsingPolynomialIdentities proves polynomial identities and uses them to describe numerical relationships. */
export const describingRelationshipsUsingPolynomialIdentities: TopicDef = {
  id: "describing-relationships-using-polynomial-identities",
  title: t("Describing Relationships Using Polynomial Identities", "用多项式恒等式描述数量关系"),
  summary: t(
    "Prove polynomial identities by simplifying, and use them to generate Pythagorean triples and to compute with numbers.",
    "通过化简证明多项式恒等式，并用它们构造勾股数、进行数的计算。",
  ),
  prerequisites: ["difference-of-squares-formula"],
  encompasses: [
    { topic: "squaring-binomials", weight: 0.5 },
    { topic: "difference-of-squares-formula", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSA.APR.C.4"],
  intro: t(
    `You know the special products $(a + b)^{2} = a^{2} + 2ab + b^{2}$ and $(a + b)(a - b) = a^{2} - b^{2}$. They are **identities**: true for every value of the variables. Here you prove new identities by simplifying, and use them to describe facts about numbers.

For example, $(n + 1)^{2} - n^{2} = n^{2} + 2n + 1 - n^{2} = 2n + 1$. So two consecutive squares always differ by an odd number: $5^{2} - 4^{2} = 9 = 2 \\cdot 4 + 1$.`,
    `你已经知道乘法公式 $(a + b)^{2} = a^{2} + 2ab + b^{2}$ 和 $(a + b)(a - b) = a^{2} - b^{2}$。它们是**恒等式**：对变量的任何取值都成立。本主题通过化简证明新的恒等式，并用它们描述数的规律。

例如，$(n + 1)^{2} - n^{2} = n^{2} + 2n + 1 - n^{2} = 2n + 1$。所以相邻两个平方数之差总是奇数：$5^{2} - 4^{2} = 9 = 2 \\cdot 4 + 1$。`,
  ),
  knowledgePoints: [
    {
      id: "completing-identities",
      title: t("Proving an identity by simplifying", "通过化简证明恒等式"),
      explanation: t(
        "A **polynomial identity** is an equation of polynomials that is true for every value of the variables. To prove one, simplify one side until it becomes the other.\n\nFor example, expand both squares and subtract:\n\n$$(x + 3)^{2} - (x - 3)^{2} = (x^{2} + 6x + 9) - (x^{2} - 6x + 9) = 12x$$\n\nSo $(x + 3)^{2} - (x - 3)^{2} = 12x$ is an identity: it holds for $x = 1$ ($16 - 4 = 12$), for $x = 10$ ($169 - 49 = 120$), and for every other $x$. Subtracting a whole square changes the sign of **each** of its terms.\n\n> **Watch out.** Do not square term by term: $(x + 3)^{2}$ is $x^{2} + 6x + 9$, not $x^{2} + 9$. Substituting one value can expose a wrong identity, but one value alone does not prove a true one.",
        "**多项式恒等式**是对变量的任何取值都成立的多项式等式。要证明它，就把一边化简，直到变成另一边。\n\n例如，把两个平方展开再相减：\n\n$$(x + 3)^{2} - (x - 3)^{2} = (x^{2} + 6x + 9) - (x^{2} - 6x + 9) = 12x$$\n\n所以 $(x + 3)^{2} - (x - 3)^{2} = 12x$ 是恒等式：$x = 1$ 时成立（$16 - 4 = 12$），$x = 10$ 时成立（$169 - 49 = 120$），对其他任何 $x$ 也都成立。减去整个平方时，它的**每一项**都要变号。\n\n> **注意。** 不要逐项平方：$(x + 3)^{2}$ 是 $x^{2} + 6x + 9$，不是 $x^{2} + 9$。代入一个值可以发现错误的恒等式，但只代入一个值不能证明恒等式成立。",
      ),
      keyPrerequisites: ["squaring-binomials"],
      generate(rng) {
        const a = rng.int(1, 9);
        const family = rng.pick(["difference", "sum", "two-variables", "constants", "squares"] as const);
        let lhs: string;
        let answer: string;
        let wrong: string[];
        let work: string;
        let left: string;
        let value: number;
        let right: string;
        if (family === "difference") {
          lhs = `${lf(1, a)}^{2} - ${lf(1, -a)}^{2}`;
          answer = mono(4 * a, 1);
          wrong = [mono(2 * a, 1), "0", poly([4 * a, "x"], [2 * a * a, ""]), mono(4 * a * a, 1)];
          work = `(${quad(1, 2 * a, a * a)}) - (${quad(1, -2 * a, a * a)})`;
          left = `${2 + a}^{2} - ${paren(2 - a)}^{2}`;
          value = 8 * a;
          right = `${4 * a} \\cdot 2 = ${value}`;
        } else if (family === "sum") {
          lhs = `${lf(1, a)}^{2} + ${lf(1, -a)}^{2}`;
          answer = quad(2, 0, 2 * a * a);
          wrong = [mono(2, 2), quad(2, 0, a * a), quad(2, 4 * a, 2 * a * a), quad(1, 0, a * a)];
          work = `(${quad(1, 2 * a, a * a)}) + (${quad(1, -2 * a, a * a)})`;
          left = `${2 + a}^{2} + ${paren(2 - a)}^{2}`;
          value = 8 + 2 * a * a;
          right = `2 \\cdot 2^{2} + ${2 * a * a} = ${value}`;
        } else if (family === "two-variables") {
          const b = rng.int(1, 6);
          const f = (s: number) => `(${poly([a, "x"], [s * b, "y"])})`;
          const sq = (s: number) => poly([a * a, "x^{2}"], [2 * s * a * b, "xy"], [b * b, "y^{2}"]);
          lhs = `${f(1)}^{2} - ${f(-1)}^{2}`;
          answer = poly([4 * a * b, "xy"]);
          wrong = [poly([2 * a * b, "xy"]), "0", poly([2 * a * a, "x^{2}"], [2 * b * b, "y^{2}"]), poly([4 * a * a * b * b, "xy"])];
          work = `(${sq(1)}) - (${sq(-1)})`;
          left = `${2 * a + b}^{2} - ${paren(2 * a - b)}^{2}`;
          value = 8 * a * b;
          right = `${4 * a * b} \\cdot 2 \\cdot 1 = ${value}`;
        } else if (family === "constants") {
          let b: number;
          do b = rng.int(1, 9);
          while (b === a);
          lhs = `${lf(1, a)}${lf(1, -a)} - ${lf(1, b)}${lf(1, -b)}`;
          answer = String(b * b - a * a);
          wrong = [String(a * a - b * b), quad(2, 0, -a * a - b * b), String(-a * a - b * b), String(b - a)];
          work = `(${quad(1, 0, -a * a)}) - (${quad(1, 0, -b * b)})`;
          left = `${2 + a} \\cdot ${paren(2 - a)} - ${2 + b} \\cdot ${paren(2 - b)}`;
          value = b * b - a * a;
          right = `${value}`;
        } else {
          const q = (s: number) => `(${poly([1, "x^{2}"], [s * a * a, ""])})`;
          const sq = (s: number) => poly([1, "x^{4}"], [2 * s * a * a, "x^{2}"], [a ** 4, ""]);
          lhs = `${q(1)}^{2} - ${q(-1)}^{2}`;
          answer = mono(4 * a * a, 2);
          wrong = [mono(2 * a * a, 2), mono(4 * a, 2), mono(4 * a * a, 4), "0"];
          work = `(${sq(1)}) - (${sq(-1)})`;
          left = `${4 + a * a}^{2} - ${paren(4 - a * a)}^{2}`;
          value = 16 * a * a;
          right = `${4 * a * a} \\cdot 2^{2} = ${value}`;
        }
        return expressionProblem({
          prompt: t(
            `Simplify the left side to complete the identity, writing the right side as a simplified polynomial:$$${lhs} = \\; ?$$`,
            `化简左边，把右边写成最简多项式，补全恒等式：$$${lhs} = \\; ?$$`,
          ),
          answer,
          simplified: true,
          wrong,
          solution: join(
            label(1, "Expand", "展开"),
            both("Expand each product, keeping it in parentheses:", "展开每个乘积，先保留括号：", `${lhs} = ${work}`),
            para,
            label(2, "Combine like terms", "合并同类项"),
            both(
              family === "sum"
                ? "Remove the parentheses and combine like terms:"
                : "Remove the parentheses; subtracting a whole product changes the sign of each of its terms. Then combine:",
              family === "sum" ? "去掉括号，合并同类项：" : "去掉括号，减去整个乘积时，它的每一项都要变号。再合并同类项：",
              `${work} = ${answer}`,
            ),
            said(
              `Substitute $x = 2$${family === "two-variables" ? " and $y = 1$" : ""} into both sides. The left side is $${left} = ${value}$, and the right side is $${right}$. The two sides agree.`,
              `把 $x = 2$${family === "two-variables" ? "，$y = 1$" : ""} 代入两边。左边是 $${left} = ${value}$，右边是 $${right}$，两边相等。`,
            ),
          ),
        });
      },
    },
    {
      id: "pythagorean-triples",
      figure: algebraDrawings3["describing-relationships-using-polynomial-identities#pythagorean-triples"],
      title: t("Generating Pythagorean triples", "构造勾股数"),
      explanation: t(
        "Expanding both sides proves the identity\n\n$$(x^{2} + y^{2})^{2} = (x^{2} - y^{2})^{2} + (2xy)^{2}$$\n\nIt has the form $c^{2} = a^{2} + b^{2}$, so for whole numbers $x > y > 0$ it produces a **Pythagorean triple**: the legs $a = x^{2} - y^{2}$ and $b = 2xy$ and the hypotenuse $c = x^{2} + y^{2}$ of a right triangle.\n\nWith $x = 3$ and $y = 2$: $a = 9 - 4 = 5$, $b = 2 \\cdot 3 \\cdot 2 = 12$ and $c = 9 + 4 = 13$. Indeed $5^{2} + 12^{2} = 25 + 144 = 169 = 13^{2}$.\n\n> **Watch out.** The leg $2xy$ is not always the longer one: with $x = 5$ and $y = 1$ the legs are $24$ and $10$. Compare the two legs before naming the shorter or the longer.",
        "把两边展开即可证明恒等式\n\n$$(x^{2} + y^{2})^{2} = (x^{2} - y^{2})^{2} + (2xy)^{2}$$\n\n它具有 $c^{2} = a^{2} + b^{2}$ 的形式，所以对满足 $x > y > 0$ 的整数，它给出一组**勾股数**：直角三角形的两条直角边 $a = x^{2} - y^{2}$、$b = 2xy$ 和斜边 $c = x^{2} + y^{2}$。\n\n取 $x = 3$，$y = 2$：$a = 9 - 4 = 5$，$b = 2 \\cdot 3 \\cdot 2 = 12$，$c = 9 + 4 = 13$。确实 $5^{2} + 12^{2} = 25 + 144 = 169 = 13^{2}$。\n\n> **注意。** 直角边 $2xy$ 不一定是较长的那条：取 $x = 5$，$y = 1$，两条直角边是 $24$ 和 $10$。说出较短或较长的直角边之前，先比较两条直角边。",
      ),
      generate(rng) {
        const x = rng.int(2, 10);
        const y = rng.int(1, x - 1);
        const a = x * x - y * y;
        const b = 2 * x * y;
        const c = x * x + y * y;
        const ask = rng.pick(["short", "long", "c"] as const);
        const answer = ask === "short" ? Math.min(a, b) : ask === "long" ? Math.max(a, b) : c;
        const name: Text =
          ask === "short"
            ? t("the shorter leg of the triangle", "这个三角形较短的直角边")
            : ask === "long"
              ? t("the longer leg of the triangle", "这个三角形较长的直角边")
              : t("the hypotenuse of the triangle", "这个三角形的斜边");
        return numberProblem({
          prompt: t(
            `The identity $(x^{2} + y^{2})^{2} = (x^{2} - y^{2})^{2} + (2xy)^{2}$ gives the sides of a right triangle for whole numbers $x > y > 0$. With $x = ${x}$ and $y = ${y}$, find ${name.en}.`,
            `对满足 $x > y > 0$ 的整数，恒等式 $(x^{2} + y^{2})^{2} = (x^{2} - y^{2})^{2} + (2xy)^{2}$ 给出一个直角三角形的三边。取 $x = ${x}$，$y = ${y}$，求${name["zh-CN"]}。`,
          ),
          answer,
          wrong: [a, b, c, (x - y) ** 2, (x + y) ** 2, x * y, 2 * x - 2 * y, 2 * x + 2 * y],
          solution: join(
            label(1, "Find the legs", "求两条直角边"),
            both(
              `Substitute $x = ${x}$ and $y = ${y}$ into $a = x^{2} - y^{2}$ and $b = 2xy$:`,
              `把 $x = ${x}$，$y = ${y}$ 代入 $a = x^{2} - y^{2}$ 和 $b = 2xy$：`,
              `a = ${x}^{2} - ${y}^{2} = ${a}`,
              `b = 2 \\cdot ${x} \\cdot ${y} = ${b}`,
            ),
            para,
            label(2, "Find the hypotenuse", "求斜边"),
            both("The hypotenuse is $c = x^{2} + y^{2}$:", "斜边是 $c = x^{2} + y^{2}$：", `c = ${x}^{2} + ${y}^{2} = ${c}`),
            t(`\n\nSo the answer is $${answer}$.`, `\n\n所以答案是 $${answer}$。`),
            said(
              `The three sides must satisfy the Pythagorean theorem:${disp(`${a}^{2} + ${b}^{2} = ${a * a} + ${b * b} = ${a * a + b * b} = ${c}^{2}`)}`,
              `三条边应满足勾股定理：${disp(`${a}^{2} + ${b}^{2} = ${a * a} + ${b * b} = ${a * a + b * b} = ${c}^{2}`)}`,
            ),
          ),
        });
      },
    },
    {
      id: "computing-with-identities",
      title: t("Computing with identities", "用恒等式计算"),
      explanation: t(
        "Identities turn hard products into easy ones. Write the numbers around a round number $a$:\n\n$$47 \\times 53 = (50 - 3)(50 + 3) = 50^{2} - 3^{2} = 2500 - 9 = 2491$$\n\n$$98^{2} = (100 - 2)^{2} = 100^{2} - 2 \\cdot 100 \\cdot 2 + 2^{2} = 10000 - 400 + 4 = 9604$$\n\nThe first uses $(a - b)(a + b) = a^{2} - b^{2}$, the second $(a - b)^{2} = a^{2} - 2ab + b^{2}$; for squares, do not forget the middle term $2ab$.\n\n> **Watch out.** In $(a - b)^{2}$ the last term is $+b^{2}$, although $b$ is subtracted: $98^{2} = 10000 - 400 + 4$, not $10000 - 400 - 4$.",
        "恒等式能把难算的乘积变成容易算的。把数写成接近某个整十（整百）数 $a$ 的形式：\n\n$$47 \\times 53 = (50 - 3)(50 + 3) = 50^{2} - 3^{2} = 2500 - 9 = 2491$$\n\n$$98^{2} = (100 - 2)^{2} = 100^{2} - 2 \\cdot 100 \\cdot 2 + 2^{2} = 10000 - 400 + 4 = 9604$$\n\n第一个用 $(a - b)(a + b) = a^{2} - b^{2}$，第二个用 $(a - b)^{2} = a^{2} - 2ab + b^{2}$；计算平方时不要忘了中间项 $2ab$。\n\n> **注意。** 在 $(a - b)^{2}$ 中，虽然减去的是 $b$，最后一项仍是 $+b^{2}$：$98^{2} = 10000 - 400 + 4$，不是 $10000 - 400 - 4$。",
      ),
      keyPrerequisites: ["difference-of-squares-formula"],
      generate(rng) {
        const a = rng.pick([20, 30, 40, 50, 60, 70, 80, 90, 100]);
        const b = rng.int(1, 9);
        if (rng.bool(0.55)) {
          const answer = a * a - b * b;
          return numberProblem({
            prompt: t(
              `Use the identity $(a - b)(a + b) = a^{2} - b^{2}$ to compute $${a - b} \\times ${a + b}$.`,
              `用恒等式 $(a - b)(a + b) = a^{2} - b^{2}$ 计算 $${a - b} \\times ${a + b}$。`,
            ),
            answer,
            form: "integer",
            wrong: [a * a + b * b, a * a - b, a * a - 2 * b, a * a - 2 * a * b + b * b],
            solution: join(
              label(1, "Write the numbers around a round number", "借助整十、整百数改写"),
              both(
                `Both numbers are $${b}$ away from $${a}$:`,
                `两个数与 $${a}$ 都相差 $${b}$：`,
                `${a - b} \\times ${a + b} = (${a} - ${b})(${a} + ${b})`,
              ),
              para,
              label(2, "Use the identity", "用恒等式"),
              both(
                `With $a = ${a}$ and $b = ${b}$ the product is $a^{2} - b^{2}$:`,
                `取 $a = ${a}$，$b = ${b}$，乘积等于 $a^{2} - b^{2}$：`,
                `(${a} - ${b})(${a} + ${b}) = ${a}^{2} - ${b}^{2} = ${a * a} - ${b * b} = ${answer}`,
              ),
              said(
                `Multiply directly, splitting the second number into $${a}$ and $${b}$:${disp(`${a - b} \\times ${a + b} = ${a - b} \\times ${a} + ${a - b} \\times ${b} = ${(a - b) * a} + ${(a - b) * b} = ${answer}`)}`,
                `直接相乘，把第二个数拆成 $${a}$ 和 $${b}$：${disp(`${a - b} \\times ${a + b} = ${a - b} \\times ${a} + ${a - b} \\times ${b} = ${(a - b) * a} + ${(a - b) * b} = ${answer}`)}`,
              ),
            ),
          });
        }
        const s = rng.sign();
        const n = a + s * b;
        const answer = n * n;
        const op = s < 0 ? "-" : "+";
        return numberProblem({
          prompt: t(
            `Use the identity $(a ${op} b)^{2} = a^{2} ${op} 2ab + b^{2}$ to compute $${n}^{2}$.`,
            `用恒等式 $(a ${op} b)^{2} = a^{2} ${op} 2ab + b^{2}$ 计算 $${n}^{2}$。`,
          ),
          answer,
          form: "integer",
          wrong: [a * a + s * b * b, a * a + b * b, a * a + s * a * b + b * b, a * a + 2 * s * a * b - b * b],
          solution: join(
            label(1, "Write the number around a round number", "借助整十、整百数改写"),
            t(
              `Write $${n} = ${a} ${op} ${b}$, so $a = ${a}$ and $b = ${b}$.`,
              `把 $${n}$ 写成 $${a} ${op} ${b}$，即 $a = ${a}$，$b = ${b}$。`,
            ),
            para,
            label(2, "Use the identity", "用恒等式"),
            both(
              "Keep the middle term $2ab$:",
              "不要漏掉中间项 $2ab$：",
              `${n}^{2} = (${a} ${op} ${b})^{2} = ${a}^{2} ${op} 2 \\cdot ${a} \\cdot ${b} + ${b}^{2} = ${a * a} ${op} ${2 * a * b} + ${b * b} = ${answer}`,
            ),
            said(
              `Multiply directly, splitting one factor into $${a}$ and $${b}$:${disp(`${n} \\times ${n} = ${n} \\times ${a} ${op} ${n} \\times ${b} = ${n * a} ${op} ${n * b} = ${answer}`)}`,
              `直接相乘，把一个因数拆成 $${a}$ 和 $${b}$：${disp(`${n} \\times ${n} = ${n} \\times ${a} ${op} ${n} \\times ${b} = ${n * a} ${op} ${n * b} = ${answer}`)}`,
            ),
          ),
        });
      },
    },
  ],
};

// ─── 2.4.1 Further factoring of polynomials using GCFs ──────────────────────

/** furtherFactoringOfPolynomialsUsingGcfs factors out common binomial factors raised to powers and opposite binomials. */
export const furtherFactoringOfPolynomialsUsingGcfs: TopicDef = {
  id: "further-factoring-of-polynomials-using-gcfs",
  title: t("Further Factoring of Polynomials Using GCFs", "提取公因式的进一步分解"),
  summary: t(
    "Factor out common binomial factors raised to powers, recognize opposite binomials, and factor what is left.",
    "提取带幂的公共二项式因式，识别互为相反数的二项式，并继续分解剩下的部分。",
  ),
  prerequisites: ["factoring-differences-of-squares"],
  encompasses: [
    { topic: "factoring-polynomials-using-gcfs", weight: 0.6 },
    { topic: "factoring-differences-of-squares", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSA.SSE.A.2"],
  intro: t(
    `You can take out a greatest common factor and factor a difference of squares. The common factor can also be a whole binomial, even one raised to a power, and what is left may factor again.

For example, both terms of $(x - 1)^{4} + 2(x - 1)^{3}$ contain $(x - 1)^{3}$:

$$(x - 1)^{4} + 2(x - 1)^{3} = (x - 1)^{3}\\left[(x - 1) + 2\\right] = (x - 1)^{3}(x + 1)$$`,
    `你已经会提取最大公因式，也会分解平方差。公因式也可以是整个二项式，甚至是二项式的幂，提出后剩下的部分可能还能分解。

例如，$(x - 1)^{4} + 2(x - 1)^{3}$ 的两项都含有 $(x - 1)^{3}$：

$$(x - 1)^{4} + 2(x - 1)^{3} = (x - 1)^{3}\\left[(x - 1) + 2\\right] = (x - 1)^{3}(x + 1)$$`,
  ),
  knowledgePoints: [
    {
      id: "powers-of-a-binomial",
      title: t("Powers of a common binomial", "公共二项式的幂"),
      explanation: t(
        "A binomial raised to different powers is factored like a variable: take out the **smaller** power. In $3(x + 2)^{3} + 12(x + 2)^{2}$ the greatest common factor is $3(x + 2)^{2}$:\n\n$$3(x + 2)^{3} + 12(x + 2)^{2} = 3(x + 2)^{2}\\left[(x + 2) + 4\\right] = 3(x + 2)^{2}(x + 6)$$\n\nAfter factoring out, simplify what is left in the brackets: $(x + 2) + 4 = x + 6$.\n\n> **Watch out.** Take out the **smaller** power: $(x + 2)^{3}$ does not divide $12(x + 2)^{2}$. The leftover $(x + 2) + 4$ in the brackets still has to be simplified.",
        "二项式的不同次幂与变量一样处理：提出**较低**的次幂。在 $3(x + 2)^{3} + 12(x + 2)^{2}$ 中，最大公因式是 $3(x + 2)^{2}$：\n\n$$3(x + 2)^{3} + 12(x + 2)^{2} = 3(x + 2)^{2}\\left[(x + 2) + 4\\right] = 3(x + 2)^{2}(x + 6)$$\n\n提出公因式后，要化简括号里剩下的部分：$(x + 2) + 4 = x + 6$。\n\n> **注意。** 提出**较低**的次幂：$(x + 2)^{3}$ 不能整除 $12(x + 2)^{2}$。方括号里剩下的 $(x + 2) + 4$ 还要化简。",
      ),
      keyPrerequisites: ["factoring-polynomials-using-gcfs"],
      generate(rng) {
        let g: number;
        let p: number;
        let q: number;
        let m: number;
        do {
          g = rng.int(1, 6);
          p = rng.int(1, 4);
          q = rng.nonZero(-9, 9);
          m = rng.nonZero(-9, 9);
        } while (gcd(p, q) !== 1 || p * m + q === 0 || (g === 1 && p === 1 && rng.bool(0.5)));
        const k = rng.int(1, 3);
        const B = lf(1, m);
        const expr = `${front(g * p)}${bpow(B, k + 1)}${signed(g * q, bpow(B, k))}`;
        const r = p * m + q;
        const answer = `${front(g)}${bpow(B, k)}${lf(p, r)}`;
        const x0 = atX((x) => [x + m, p * x + r]);
        const bracket = `${front(g)}${bpow(B, k)}\\left[${p === 1 ? "" : p}${B} ${q < 0 ? "-" : "+"} ${Math.abs(q)}\\right]`;
        return factoredProblem({
          prompt: factorPrompt(expr),
          answer,
          wrong: [
            `${front(g)}${bpow(B, k)}${lf(p, q)}`,
            `${front(g)}${bpow(B, k)}${lf(p, p * m - q)}`,
            `${front(g)}${bpow(B, k + 1)}${lf(p, r)}`,
            `${front(g)}${bpow(B, 2 * k + 1)}`,
          ],
          solution: join(
            label(1, "Find the greatest common factor", "找最大公因式"),
            t(
              `The greatest common factor is $${front(g) === "" ? "" : g}${bpow(B, k)}$: the greatest common factor of the coefficients times the smaller power of $${B}$.`,
              `最大公因式是 $${front(g) === "" ? "" : g}${bpow(B, k)}$：系数的最大公因数乘以 $${B}$ 的较低次幂。`,
            ),
            para,
            label(2, "Factor it out and simplify", "提出并化简"),
            both(
              "What is left goes in brackets; then simplify them:",
              "剩下的部分放进方括号，再化简：",
              `${expr} = ${bracket} = ${answer}`,
            ),
            valueCheck(x0, g * p * (x0 + m) ** (k + 1) + g * q * (x0 + m) ** k, [
              ...(g === 1 ? [] : [[g, 1] as const]),
              [x0 + m, k],
              [p * x0 + r, 1],
            ]),
          ),
        });
      },
    },
    {
      id: "opposite-binomials",
      title: t("Opposite binomials", "互为相反数的二项式"),
      explanation: t(
        "The binomials $x - 4$ and $4 - x$ are opposites: $4 - x = -(x - 4)$. Rewrite one of them so that both terms share the same factor:\n\n$$5x(x - 4) + 3(4 - x) = 5x(x - 4) - 3(x - 4) = (x - 4)(5x - 3)$$\n\nThe sign in front of the rewritten term flips, and it goes into the second factor.\n\n> **Watch out.** Forgetting to flip the sign gives $(x - 4)(5x + 3)$, which multiplies back to $5x(x - 4) + 3(x - 4)$, not to the original.",
        "二项式 $x - 4$ 与 $4 - x$ 互为相反数：$4 - x = -(x - 4)$。把其中一个改写，使两项含有相同的因式：\n\n$$5x(x - 4) + 3(4 - x) = 5x(x - 4) - 3(x - 4) = (x - 4)(5x - 3)$$\n\n改写的那一项前面的符号要变号，并进入第二个因式。\n\n> **注意。** 忘记变号会得到 $(x - 4)(5x + 3)$，展开后是 $5x(x - 4) + 3(x - 4)$，不是原式。",
      ),
      generate(rng) {
        let a: number;
        let b: number;
        let m: number;
        do {
          a = rng.int(1, 7);
          b = rng.nonZero(-9, 9);
          m = rng.int(1, 9);
        } while (gcd(a, b) !== 1 || (a === 1 && b === m));
        const v = rng.pick(["x", "x", "y", "t"]);
        const B = lf(1, -m, v);
        const opp = `(${m} - ${v})`;
        const x0 = atX((x) => [x - m, a * x - b]);
        const expr = `${front(a)}${v}${B}${signed(b, opp)}`;
        const rewritten = `${front(a)}${v}${B}${signed(-b, B)}`;
        const answer = `${B}${lf(a, -b, v)}`;
        return factoredProblem({
          prompt: factorPrompt(expr),
          answer,
          wrong: [`${B}${lf(a, b, v)}`, `${lf(1, m, v)}${lf(a, -b, v)}`, `${B}^{2}${lf(a, b, v)}`, `${opp}${lf(a, -b, v)}`],
          solution: join(
            label(1, "Rewrite the opposite binomial", "改写相反的二项式"),
            both(
              `Since $${opp} = -${B}$, the sign in front of the second term flips:`,
              `因为 $${opp} = -${B}$，第二项前面的符号要变号：`,
              `${expr} = ${rewritten}`,
            ),
            para,
            label(2, "Factor out the common binomial", "提出公共二项式"),
            both(`Both terms now contain $${B}$:`, `现在两项都含有 $${B}$：`, `${rewritten} = ${answer}`),
            valueCheck(
              x0,
              a * x0 * (x0 - m) + b * (m - x0),
              [
                [x0 - m, 1],
                [a * x0 - b, 1],
              ],
              v,
            ),
          ),
        });
      },
    },
    {
      id: "factoring-what-is-left",
      title: t("Factoring what is left", "继续分解剩下的因式"),
      explanation: t(
        "After a common binomial is taken out, the other factor may factor further. Keep going until no factor can be factored:\n\n$$x^{2}(x + 5) - 9(x + 5) = (x + 5)(x^{2} - 9) = (x + 5)(x + 3)(x - 3)$$\n\n> **Watch out.** Stopping at $(x + 5)(x^{2} - 9)$ is incomplete. A sum of squares such as $x^{2} + 9$, on the other hand, cannot be factored over the integers.",
        "提出公共二项式之后，另一个因式可能还能分解。继续分解，直到每个因式都不能再分解：\n\n$$x^{2}(x + 5) - 9(x + 5) = (x + 5)(x^{2} - 9) = (x + 5)(x + 3)(x - 3)$$\n\n> **注意。** 停在 $(x + 5)(x^{2} - 9)$ 不算彻底。而像 $x^{2} + 9$ 这样的平方和，在整数范围内不能分解。",
      ),
      keyPrerequisites: ["factoring-differences-of-squares"],
      generate(rng) {
        let p: number;
        let q: number;
        let m: number;
        do {
          p = rng.int(1, 3);
          q = rng.int(1, 9);
          m = rng.nonZero(-9, 9);
        } while (gcd(p, q) !== 1 || (p === 1 && Math.abs(m) === q));
        const g = rng.pick([1, 1, 1, 2, 3, 5]);
        const B = lf(1, m);
        const expr = `${mono(g * p * p, 2)}${B} - ${g * q * q}${B}`;
        const inner = poly([p * p, "x^{2}"], [-q * q, ""]);
        const answer = `${front(g)}${B}${lf(p, q)}${lf(p, -q)}`;
        const x0 = atX((x) => [x + m, p * x - q]);
        const sqx = p === 1 ? "x" : `(${p}x)`;
        return factoredProblem({
          prompt: factorPrompt(expr),
          answer,
          wrong: [`${front(g)}${B}(${inner})`, `${front(g)}${B}(${linear(p, -q)})^{2}`, `${front(g)}${lf(1, -m)}${lf(p, q)}${lf(p, -q)}`],
          solution: join(
            label(1, "Take out the common factor", "提出公因式"),
            both(
              `Both terms contain $${front(g) === "" ? "" : g}${B}$:`,
              `两项都含有 $${front(g) === "" ? "" : g}${B}$：`,
              `${expr} = ${front(g)}${B}(${inner})`,
            ),
            para,
            label(2, "Factor what is left", "分解剩下的部分"),
            both(
              `The factor $${inner}$ is a difference of squares, $${sqx}^{2} - ${q}^{2}$:`,
              `因式 $${inner}$ 是平方差 $${sqx}^{2} - ${q}^{2}$：`,
              `${front(g)}${B}(${inner}) = ${answer}`,
            ),
            valueCheck(x0, g * p * p * x0 * x0 * (x0 + m) - g * q * q * (x0 + m), [
              ...(g === 1 ? [] : [[g, 1] as const]),
              [x0 + m, 1],
              [p * x0 + q, 1],
              [p * x0 - q, 1],
            ]),
          ),
        });
      },
    },
  ],
};

// ─── 2.4.2 Factoring higher-order polynomials as a difference of squares ───

/** factor writes the linear factor (Ax + B) normalized: its content and a negative sign are returned apart. */
function normalize(A: number, B: number): { c: number; f: string } {
  const g = gcd(A, B);
  const s = A < 0 || (A === 0 && B < 0) ? -1 : 1;
  return { c: s * g, f: lf((s * A) / g, (s * B) / g) };
}

/** factoringHigherOrderPolynomialsAsADifferenceOfSquares factors higher powers and squares of binomials as differences of squares. */
export const factoringHigherOrderPolynomialsAsADifferenceOfSquares: TopicDef = {
  id: "factoring-higher-order-polynomials-as-a-difference-of-squares",
  title: t("Factoring Higher-Order Polynomials as a Difference of Squares", "把高次多项式作为平方差分解"),
  summary: t(
    "Factor expressions such as $4x^{6} - 9$, $3x^{5} - 12x$ and $(x + 2)^{2} - 25$ as differences of squares.",
    "把 $4x^{6} - 9$、$3x^{5} - 12x$、$(x + 2)^{2} - 25$ 等式子作为平方差分解。",
  ),
  prerequisites: ["factoring-differences-of-squares"],
  encompasses: [{ topic: "factoring-differences-of-squares", weight: 0.7 }],
  xp: 14,
  standards: ["CCSS.HSA.SSE.A.2"],
  intro: t(
    `You can factor $x^{2} - 9$ as a difference of squares. The same formula works whenever both terms are squares, including higher even powers and whole binomials, and the factors it gives may factor again.

For example, $x^{4} - 81 = (x^{2})^{2} - 9^{2}$, and one of its factors is again a difference of squares:

$$x^{4} - 81 = (x^{2} + 9)(x^{2} - 9) = (x^{2} + 9)(x + 3)(x - 3)$$`,
    `你已经会把 $x^{2} - 9$ 作为平方差分解。只要两项都是平方，同一个公式就适用，包括更高的偶次幂和整个二项式；得到的因式可能还能再分解。

例如，$x^{4} - 81 = (x^{2})^{2} - 9^{2}$，它的一个因式仍是平方差：

$$x^{4} - 81 = (x^{2} + 9)(x^{2} - 9) = (x^{2} + 9)(x + 3)(x - 3)$$`,
  ),
  knowledgePoints: [
    {
      id: "even-powers",
      title: t("Even powers as squares", "偶次幂是平方"),
      explanation: t(
        "Any even power is a square: $x^{4} = (x^{2})^{2}$ and $x^{6} = (x^{3})^{2}$; halve the exponent to find the square root. So\n\n$$4x^{6} - 9 = (2x^{3})^{2} - 3^{2} = (2x^{3} + 3)(2x^{3} - 3)$$\n\n$$x^{4} - 5y^{2} \\text{ is not a difference of squares, but } x^{4} - 25y^{2} = (x^{2} + 5y)(x^{2} - 5y)$$\n\nCheck whether a factor can be factored again: $2x^{3} - 3$ cannot, since $2$ and $3$ are not cubes and the terms are not squares.\n\n> **Watch out.** The square root of $x^{6}$ is $x^{3}$, half the exponent, not $x^{2}$. The number must be a square as well: $x^{6} - 8$ is not a difference of squares.",
        "任何偶次幂都是平方：$x^{4} = (x^{2})^{2}$，$x^{6} = (x^{3})^{2}$；把指数减半就得到平方根。所以\n\n$$4x^{6} - 9 = (2x^{3})^{2} - 3^{2} = (2x^{3} + 3)(2x^{3} - 3)$$\n\n$$x^{4} - 5y^{2} \\text{ 不是平方差，但 } x^{4} - 25y^{2} = (x^{2} + 5y)(x^{2} - 5y)$$\n\n要检查因式能否再分解：$2x^{3} - 3$ 不能，因为 $2$ 和 $3$ 都不是立方数，这两项也都不是平方。\n\n> **注意。** $x^{6}$ 的平方根是 $x^{3}$（指数的一半），不是 $x^{2}$。数也必须是平方数：$x^{6} - 8$ 不是平方差。",
      ),
      generate(rng) {
        let p: number;
        let q: number;
        let k: number;
        let withY: boolean;
        do {
          p = rng.int(1, 5);
          q = rng.int(1, 12);
          k = rng.pick([2, 2, 3, 4]);
          withY = rng.bool(0.35);
        } while (gcd(p, q) !== 1 || (!withY && k % 2 === 0 && isSquare(p) && isSquare(q)) || (!withY && k === 3 && isCube(p) && isCube(q)));
        const yv = withY ? "y" : "";
        const expr = poly([p * p, pw("x", 2 * k)], [-q * q, withY ? "y^{2}" : ""]);
        const f = (s: number, e = k) => `(${poly([p, pw("x", e)], [s * q, yv])})`;
        const answer = `${f(1)}${f(-1)}`;
        const x0 = atX((x) => [p * x ** k - q]);
        const qr = withY && q !== 1 ? `(${poly([q, yv])})` : poly([q, yv]);
        return factoredProblem({
          prompt: factorPrompt(expr),
          answer,
          wrong: [`${f(-1)}^{2}`, `${f(1)}^{2}`, `${f(1, 2 * k - 2)}${f(-1, 2)}`, `${f(1, k + 1)}${f(-1, k - 1)}`],
          solution: join(
            label(1, "Write both terms as squares", "把两项写成平方"),
            t(
              `Halve the exponent to write $${mono(p * p, 2 * k)} = (${mono(p, k)})^{2}$, and $${poly([q * q, withY ? "y^{2}" : ""])} = ${qr}^{2}$.`,
              `指数减半，写成 $${mono(p * p, 2 * k)} = (${mono(p, k)})^{2}$，$${poly([q * q, withY ? "y^{2}" : ""])} = ${qr}^{2}$。`,
            ),
            para,
            label(2, "Factor the difference of squares", "分解平方差"),
            both(
              "Use $a^{2} - b^{2} = (a + b)(a - b)$:",
              "用 $a^{2} - b^{2} = (a + b)(a - b)$：",
              `${expr} = (${mono(p, k)})^{2} - ${qr}^{2} = ${answer}`,
            ),
            t("\n\nNeither factor can be factored further.", "\n\n两个因式都不能再分解。"),
            valueCheck(
              x0,
              p * p * x0 ** (2 * k) - q * q,
              [
                [p * x0 ** k + q, 1],
                [p * x0 ** k - q, 1],
              ],
              "x",
              withY,
            ),
          ),
        });
      },
    },
    {
      id: "common-factor-first",
      title: t("Taking out a common factor first", "先提取公因式"),
      explanation: t(
        "Take out the greatest common factor first, including a power of $x$; a difference of squares may then appear:\n\n$$3x^{5} - 12x = 3x(x^{4} - 4) = 3x(x^{2} + 2)(x^{2} - 2)$$\n\n$$2x^{6} - 32x^{2} = 2x^{2}(x^{4} - 16) = 2x^{2}(x^{2} + 4)(x + 2)(x - 2)$$\n\nIn the second, $x^{2} - 4$ is itself a difference of squares; $x^{2} - 2$ in the first is not, since $2$ is not a square.\n\n> **Watch out.** An odd power of $x$ is not a square: $3x^{5} - 12x$ becomes a difference of squares only after $3x$ is taken out.",
        "先提出最大公因式（包括 $x$ 的幂），括号内可能出现平方差：\n\n$$3x^{5} - 12x = 3x(x^{4} - 4) = 3x(x^{2} + 2)(x^{2} - 2)$$\n\n$$2x^{6} - 32x^{2} = 2x^{2}(x^{4} - 16) = 2x^{2}(x^{2} + 4)(x + 2)(x - 2)$$\n\n第二个式子中，$x^{2} - 4$ 本身还是平方差；第一个式子中的 $x^{2} - 2$ 不是，因为 $2$ 不是平方数。\n\n> **注意。** $x$ 的奇次幂不是平方：$3x^{5} - 12x$ 要先提出 $3x$，才出现平方差。",
      ),
      keyPrerequisites: ["factoring-polynomials-using-gcfs"],
      generate(rng) {
        let p: number;
        let q: number;
        do {
          p = rng.int(1, 4);
          q = rng.int(1, 9);
        } while (gcd(p, q) !== 1);
        const k = rng.int(2, 6);
        const e = rng.int(0, 3);
        const expr = poly([k * p * p, pw("x", 4 + e)], [-k * q * q, pw("x", e)]);
        const inner = poly([p * p, "x^{4}"], [-q * q, ""]);
        const plus = `(${poly([p, "x^{2}"], [q, ""])})`;
        const minus = `(${poly([p, "x^{2}"], [-q, ""])})`;
        const full = isSquare(p) && isSquare(q);
        const u = Math.round(Math.sqrt(p));
        const v = Math.round(Math.sqrt(q));
        const x0 = atX((x) => [p * x * x - q]);
        const answer = `${front(k, e)}${plus}${full ? `${lf(u, v)}${lf(u, -v)}` : minus}`;
        return factoredProblem({
          prompt: factorPrompt(expr),
          answer,
          wrong: [
            `${front(k, e)}(${inner})`,
            `${front(k, e)}${plus}${minus}`,
            `${front(k, e)}${minus}^{2}`,
            ...(e > 0 ? [`${front(k)}(${poly([p, pw("x", 2 + e)], [q, ""])})(${poly([p, pw("x", 2 + e)], [-q, ""])})`] : []),
          ],
          solution: join(
            label(1, "Take out the greatest common factor", "提出最大公因式"),
            both(`The greatest common factor is $${mono(k, e)}$:`, `最大公因式是 $${mono(k, e)}$：`, `${expr} = ${front(k, e)}(${inner})`),
            para,
            label(2, "Factor the difference of squares", "分解平方差"),
            both(
              `The factor $${inner}$ is a difference of squares${full ? ", and so is one of its factors" : ""}:`,
              `因式 $${inner}$ 是平方差${full ? "，它的一个因式也是平方差" : ""}：`,
              `${front(k, e)}(${inner}) = ${front(k, e)}${plus}${minus}${full ? ` = ${answer}` : ""}`,
            ),
            t(
              full ? `\n\nThe sum $${plus}$ cannot be factored further.` : `\n\nThe factor $${minus}$ cannot be factored further.`,
              full ? `\n\n和 $${plus}$ 不能再分解。` : `\n\n因式 $${minus}$ 不能再分解。`,
            ),
            valueCheck(x0, k * p * p * x0 ** (4 + e) - k * q * q * x0 ** e, [
              [k, 1],
              ...(e === 0 ? [] : [[x0, e] as const]),
              [p * x0 * x0 + q, 1],
              ...(full
                ? ([
                    [u * x0 + v, 1],
                    [u * x0 - v, 1],
                  ] as const)
                : [[p * x0 * x0 - q, 1] as const]),
            ]),
          ),
        });
      },
    },
    {
      id: "squares-of-binomials",
      title: t("Squares of binomials", "二项式的平方"),
      explanation: t(
        "In $a^{2} - b^{2} = (a + b)(a - b)$, the square roots $a$ and $b$ may be whole binomials. Keep them in parentheses, then simplify each factor:\n\n$$(x + 2)^{2} - 25 = \\left[(x + 2) + 5\\right]\\left[(x + 2) - 5\\right] = (x + 7)(x - 3)$$\n\n$$(2x + 1)^{2} - (x - 4)^{2} = \\left[(2x + 1) + (x - 4)\\right]\\left[(2x + 1) - (x - 4)\\right] = (3x - 3)(x + 5) = 3(x - 1)(x + 5)$$\n\nIn the second factor the minus sign applies to **both** terms of $(x - 4)$. A factor with a common factor, such as $3x - 3$, is not complete.\n\n> **Watch out.** Do not expand the squares first. It can be done, but it leads to a trinomial that is harder to factor; keep the roots in brackets.",
        "在 $a^{2} - b^{2} = (a + b)(a - b)$ 中，平方根 $a$ 和 $b$ 可以是整个二项式。先保留括号，再化简每个因式：\n\n$$(x + 2)^{2} - 25 = \\left[(x + 2) + 5\\right]\\left[(x + 2) - 5\\right] = (x + 7)(x - 3)$$\n\n$$(2x + 1)^{2} - (x - 4)^{2} = \\left[(2x + 1) + (x - 4)\\right]\\left[(2x + 1) - (x - 4)\\right] = (3x - 3)(x + 5) = 3(x - 1)(x + 5)$$\n\n第二个因式中的减号作用于 $(x - 4)$ 的**两项**。含公因数的因式，例如 $3x - 3$，还没有分解彻底。\n\n> **注意。** 不要先把平方展开。这样也能做，但会得到更难分解的三项式；保留方括号里的平方根。",
      ),
      generate(rng) {
        let a: number;
        let b: number;
        let c: number;
        let d: number;
        const kind = rng.pick(["minus-number", "minus-number", "number-minus", "two-binomials", "two-binomials"] as const);
        do {
          if (kind === "minus-number") {
            a = 1;
            b = rng.nonZero(-9, 9);
            c = 0;
            d = rng.int(1, 9);
          } else if (kind === "number-minus") {
            a = 0;
            b = rng.int(1, 9);
            c = 1;
            d = rng.nonZero(-9, 9);
          } else {
            a = rng.int(1, 4);
            b = rng.nonZero(-9, 9);
            c = rng.int(1, 3);
            d = rng.nonZero(-9, 9);
          }
        } while (a === c || b + d === 0 || b - d === 0 || gcd(a, b) !== 1 || gcd(c, d) !== 1);
        const sq = (p: number, q: number) => (p === 0 ? String(q * q) : `${lf(p, q)}^{2}`);
        const root = (p: number, q: number) => (p === 0 ? String(q) : lf(p, q));
        const expr = `${sq(a, b)} - ${sq(c, d)}`;
        const n1 = normalize(a + c, b + d);
        const n2 = normalize(a - c, b - d);
        const answer = `${front(n1.c * n2.c)}${n1.f}${n2.f}`;
        const raw = `${lf(a + c, b + d)}${lf(a - c, b - d)}`;
        const x0 = atX((x) => [(a + c) * x + b + d, (a - c) * x + b - d]);
        return factoredProblem({
          prompt: factorPrompt(expr),
          answer,
          wrong: [
            `${lf(a + c, b + d)}${lf(a - c, b + d)}`,
            `${lf(a + c, b - d)}${lf(a - c, b + d)}`,
            `${lf(a - c, b - d)}^{2}`,
            ...(n1.c * n2.c !== 1 ? [`${n1.f}${n2.f}`] : []),
          ],
          solution: join(
            label(1, "Write the sum and the difference of the roots", "写出平方根的和与差"),
            both(
              `This is a difference of squares with square roots $${root(a, b)}$ and $${root(c, d)}$. Keep each root in brackets:`,
              `这是平方差，两个平方根是 $${root(a, b)}$ 和 $${root(c, d)}$。每个平方根先保留括号：`,
              `${expr} = \\left[${root(a, b)} + ${root(c, d)}\\right]\\left[${root(a, b)} - ${root(c, d)}\\right]`,
            ),
            para,
            label(2, "Simplify each factor", "化简每个因式"),
            both(
              `The minus sign applies to both terms of the second root${n1.c * n2.c !== 1 ? "; then take out the common factors" : ""}:`,
              `减号作用于第二个平方根的每一项${n1.c * n2.c !== 1 ? "，再提出公因数" : ""}：`,
              `\\left[${root(a, b)} + ${root(c, d)}\\right]\\left[${root(a, b)} - ${root(c, d)}\\right] = ${raw}${raw === answer ? "" : ` = ${answer}`}`,
            ),
            valueCheck(x0, (a * x0 + b) ** 2 - (c * x0 + d) ** 2, [
              ...(n1.c * n2.c === 1 ? [] : [[n1.c * n2.c, 1] as const]),
              [((a + c) * x0 + b + d) / n1.c, 1],
              [((a - c) * x0 + b - d) / n2.c, 1],
            ]),
          ),
        });
      },
    },
  ],
};

// ─── 2.4.3 Factoring cubic expressions by grouping ──────────────────────────

/** irreducible tells whether px² + r (p > 0, gcd 1) cannot be factored over the integers. */
const irreducible = (p: number, r: number) => r > 0 || !(isSquare(p) && isSquare(-r));

/** groupingSolution writes apx³ + bpx² + arx + br = px²(ax + b) + r(ax + b) = (ax + b)(px² + r). */
function groupingSolution(expr: string, a: number, b: number, p: number, r: number): Text {
  const B = lf(a, b);
  const grouped = `${mono(p, 2)}${B}${signed(r, B)}`;
  const Q2 = `(${poly([p, "x^{2}"], [r, ""])})`;
  const x0 = atX((x) => [a * x + b, p * x * x + r]);
  return join(
    label(1, "Group the terms in pairs", "两两分组"),
    both(
      `Take out the greatest common factor of the first two terms and of the last two terms${r < 0 ? ", a negative one from the second pair" : ""}:`,
      `分别提出前两项和后两项的最大公因式${r < 0 ? "（第二组提出负的公因数）" : ""}：`,
      `${expr} = ${grouped}`,
    ),
    para,
    label(2, "Take out the common binomial", "提出公共二项式"),
    both(`Both groups contain $${B}$:`, `两组都含有 $${B}$：`, `${grouped} = ${B}${Q2}`),
    t(`\n\nThe factor $${Q2}$ cannot be factored over the integers.`, `\n\n因式 $${Q2}$ 在整数范围内不能再分解。`),
    valueCheck(x0, a * p * x0 ** 3 + b * p * x0 ** 2 + a * r * x0 + b * r, [
      [a * x0 + b, 1],
      [p * x0 * x0 + r, 1],
    ]),
  );
}

/** factoringCubicExpressionsByGrouping factors four-term cubics by grouping. */
export const factoringCubicExpressionsByGrouping: TopicDef = {
  id: "factoring-cubic-expressions-by-grouping",
  title: t("Factoring Cubic Expressions by Grouping", "用分组分解法分解三次式"),
  summary: t(
    "Factor cubics with four terms, such as $x^{3} + 2x^{2} + 3x + 6$, by grouping pairs of terms and taking out a common binomial.",
    "把 $x^{3} + 2x^{2} + 3x + 6$ 这类四项三次式两两分组，提出公共二项式进行分解。",
  ),
  prerequisites: ["further-factoring-of-polynomials-using-gcfs"],
  encompasses: [
    { topic: "further-factoring-of-polynomials-using-gcfs", weight: 0.4 },
    { topic: "factoring-polynomials-using-gcfs", weight: 0.5 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.SSE.A.2"],
  intro: t(
    `You can take a common binomial out of an expression such as $x^{2}(x + 5) + 2(x + 5)$. Factoring by grouping produces that form from a cubic with four terms, which has no common factor of all its terms.

For example, the two pairs of $x^{3} - x^{2} + 2x - 2$ both leave $x - 1$:

$$x^{3} - x^{2} + 2x - 2 = x^{2}(x - 1) + 2(x - 1) = (x - 1)(x^{2} + 2)$$`,
    `你已经会从 $x^{2}(x + 5) + 2(x + 5)$ 这样的式子中提出公共二项式。四项三次式的各项没有公因式，分组分解法能把它化成这种形式。

例如，$x^{3} - x^{2} + 2x - 2$ 的两组都剩下 $x - 1$：

$$x^{3} - x^{2} + 2x - 2 = x^{2}(x - 1) + 2(x - 1) = (x - 1)(x^{2} + 2)$$`,
  ),
  knowledgePoints: [
    {
      id: "grouping",
      title: t("Factoring by grouping", "分组分解"),
      explanation: t(
        "A cubic with four terms has no common factor of all four terms, but each **pair** may have one. Group the first two and the last two terms, factor each group, and look for a common binomial:\n\n$$x^{3} + 2x^{2} + 3x + 6 = x^{2}(x + 2) + 3(x + 2) = (x + 2)(x^{2} + 3)$$\n\nWhen the third term is negative, take a **negative** factor out of the second pair so that the same binomial appears:\n\n$$x^{3} - 4x^{2} - 5x + 20 = x^{2}(x - 4) - 5(x - 4) = (x - 4)(x^{2} - 5)$$\n\nNeither $x^{2} + 3$ nor $x^{2} - 5$ can be factored over the integers.\n\n> **Watch out.** Check that both groups leave the **same** binomial before taking it out. If they leave $(x - 4)$ and $(-x + 4)$, take a negative factor out of the second group instead.",
        "四项三次式的四项没有公因式，但每**一组**两项可能有。把前两项和后两项各分为一组，分别提出公因式，再找公共的二项式：\n\n$$x^{3} + 2x^{2} + 3x + 6 = x^{2}(x + 2) + 3(x + 2) = (x + 2)(x^{2} + 3)$$\n\n当第三项为负时，第二组要提出**负的**公因数，才能得到相同的二项式：\n\n$$x^{3} - 4x^{2} - 5x + 20 = x^{2}(x - 4) - 5(x - 4) = (x - 4)(x^{2} - 5)$$\n\n$x^{2} + 3$ 和 $x^{2} - 5$ 在整数范围内都不能再分解。\n\n> **注意。** 提出公共二项式之前，先确认两组剩下的二项式**相同**。如果得到 $(x - 4)$ 和 $(-x + 4)$，第二组应改为提出负的公因数。",
      ),
      keyPrerequisites: ["factoring-polynomials-using-gcfs"],
      generate(rng) {
        let p: number;
        let q: number;
        let r: number;
        do {
          p = rng.bool(0.6) ? 1 : rng.int(2, 5);
          q = rng.nonZero(-9, 9);
          r = rng.nonZero(-12, 12);
        } while (gcd(p, r) !== 1 || !irreducible(p, r));
        const expr = poly([p, "x^{3}"], [p * q, "x^{2}"], [r, "x"], [q * r, ""]);
        const Q2 = `(${poly([p, "x^{2}"], [r, ""])})`;
        const answer = `${lf(1, q)}${Q2}`;
        return factoredProblem({
          prompt: factorPrompt(expr),
          answer,
          wrong: [
            `${lf(1, -q)}${Q2}`,
            `${lf(1, q)}(${poly([p, "x^{2}"], [-r, ""])})`,
            `${lf(1, q)}${lf(p, r)}`,
            `${lf(1, q)}(${poly([p, "x^{2}"], [q * r, ""])})`,
          ],
          solution: groupingSolution(expr, 1, q, p, r),
        });
      },
    },
    {
      id: "grouping-then-difference-of-squares",
      title: t("Grouping, then a difference of squares", "分组后再分解平方差"),
      explanation: t(
        "After grouping, the quadratic factor may be a difference of squares; factor it too:\n\n$$x^{3} + 3x^{2} - 4x - 12 = x^{2}(x + 3) - 4(x + 3) = (x + 3)(x^{2} - 4) = (x + 3)(x + 2)(x - 2)$$\n\nLook for a common factor of all four terms first: $2x^{3} + 6x^{2} - 8x - 24 = 2(x^{3} + 3x^{2} - 4x - 12)$.\n\n> **Watch out.** After grouping, $x^{2} - 4$ still factors, but $x^{2} + 4$ does not: a sum of squares cannot be factored over the integers.",
        "分组之后，二次因式可能是平方差，也要分解：\n\n$$x^{3} + 3x^{2} - 4x - 12 = x^{2}(x + 3) - 4(x + 3) = (x + 3)(x^{2} - 4) = (x + 3)(x + 2)(x - 2)$$\n\n先看四项有没有公因数：$2x^{3} + 6x^{2} - 8x - 24 = 2(x^{3} + 3x^{2} - 4x - 12)$。\n\n> **注意。** 分组之后，$x^{2} - 4$ 还能分解，而 $x^{2} + 4$ 不能：平方和在整数范围内不能分解。",
      ),
      keyPrerequisites: ["factoring-differences-of-squares"],
      generate(rng) {
        let u: number;
        let v: number;
        let q: number;
        do {
          u = rng.bool(0.7) ? 1 : rng.int(2, 3);
          v = rng.int(1, 9);
          q = rng.nonZero(-9, 9);
        } while (gcd(u, v) !== 1 || (u === 1 && Math.abs(q) === v));
        const k = rng.pick([1, 1, 1, 2, 3]);
        const p = u * u;
        const r = -v * v;
        const expr = poly([k * p, "x^{3}"], [k * p * q, "x^{2}"], [k * r, "x"], [k * q * r, ""]);
        const inner = poly([p, "x^{3}"], [p * q, "x^{2}"], [r, "x"], [q * r, ""]);
        const answer = `${front(k)}${lf(1, q)}${lf(u, v)}${lf(u, -v)}`;
        const B = lf(1, q);
        const grouped = `${mono(p, 2)}${B}${signed(r, B)}`;
        const Q2 = `(${poly([p, "x^{2}"], [r, ""])})`;
        const x0 = atX((x) => [x + q, u * x - v]);
        return factoredProblem({
          prompt: factorPrompt(expr),
          answer,
          wrong: [
            `${front(k)}${B}${Q2}`,
            `${front(k)}${B}(${linear(u, -v)})^{2}`,
            `${front(k)}${lf(1, -q)}${lf(u, v)}${lf(u, -v)}`,
            ...(k > 1 ? [`${B}${lf(u, v)}${lf(u, -v)}`] : []),
          ],
          solution: join(
            label(1, "Group the terms in pairs", "两两分组"),
            k === 1
              ? both(
                  `Take out the greatest common factor of each pair, then the common binomial $${B}$:`,
                  `提出每组的最大公因式，再提出公共二项式 $${B}$：`,
                  `${expr} = ${grouped} = ${B}${Q2}`,
                )
              : both(
                  `Take out the common factor $${k}$ of all four terms first. Then factor each pair and take out the common binomial $${B}$:`,
                  `先提出四项的公因数 $${k}$，再分别提出每组的公因式，并提出公共二项式 $${B}$：`,
                  `${expr} = ${k}(${inner})`,
                  `= ${k}\\left[${grouped}\\right] = ${k}${B}${Q2}`,
                ),
            para,
            label(2, "Factor the difference of squares", "分解平方差"),
            both(`The factor $${Q2}$ is a difference of squares:`, `因式 $${Q2}$ 是平方差：`, `${front(k)}${B}${Q2} = ${answer}`),
            valueCheck(x0, k * (p * x0 ** 3 + p * q * x0 ** 2 + r * x0 + q * r), [
              ...(k === 1 ? [] : [[k, 1] as const]),
              [x0 + q, 1],
              [u * x0 + v, 1],
              [u * x0 - v, 1],
            ]),
          ),
        });
      },
    },
    {
      id: "leading-coefficients",
      title: t("A binomial with a leading coefficient", "首项系数不为 1 的二项式"),
      explanation: t(
        "The common binomial may have a leading coefficient. Take out the greatest common factor of each pair, coefficients included:\n\n$$6x^{3} - 4x^{2} + 9x - 6 = 2x^{2}(3x - 2) + 3(3x - 2) = (3x - 2)(2x^{2} + 3)$$\n\nIf the two binomials do not match, check the signs and the factors you took out: the grouping works only when both pairs leave the same binomial.\n\n> **Watch out.** Take out the whole greatest common factor of each pair, coefficient included: $6x^{3} - 4x^{2} = x^{2}(6x - 4)$ leaves a binomial that does not match $3x - 2$.",
        "公共二项式的首项系数可以不是 1。提出每组的最大公因式（包括系数）：\n\n$$6x^{3} - 4x^{2} + 9x - 6 = 2x^{2}(3x - 2) + 3(3x - 2) = (3x - 2)(2x^{2} + 3)$$\n\n如果两个二项式不相同，检查符号和提出的公因式：只有两组剩下相同的二项式时，分组分解才能进行。\n\n> **注意。** 提出每组完整的最大公因式（包括系数）：$6x^{3} - 4x^{2} = x^{2}(6x - 4)$ 剩下的二项式与 $3x - 2$ 不一致。",
      ),
      generate(rng) {
        let a: number;
        let b: number;
        let p: number;
        let r: number;
        do {
          a = rng.int(2, 5);
          b = rng.nonZero(-9, 9);
          p = rng.int(1, 4);
          r = rng.nonZero(-9, 9);
        } while (gcd(a, b) !== 1 || gcd(p, r) !== 1 || !irreducible(p, r));
        const expr = poly([a * p, "x^{3}"], [b * p, "x^{2}"], [a * r, "x"], [b * r, ""]);
        const Q2 = `(${poly([p, "x^{2}"], [r, ""])})`;
        const answer = `${lf(a, b)}${Q2}`;
        return factoredProblem({
          prompt: factorPrompt(expr),
          answer,
          wrong: [
            `${lf(a, -b)}${Q2}`,
            `${lf(a, b)}(${poly([p, "x^{2}"], [-r, ""])})`,
            `${lf(p, b)}(${poly([a, "x^{2}"], [r, ""])})`,
            `${lf(a, b)}${lf(p, r)}`,
          ],
          solution: groupingSolution(expr, a, b, p, r),
        });
      },
    },
  ],
};

// ─── 2.4.4 Factoring sums and differences of cubes ──────────────────────────

/** Term is a monomial α·u with α > 0 and u a variable or "". */
type Term = readonly [number, string];

/** sqv writes the square of a variable part: "x^{2}", or "" for a constant. */
const sqv = (u: string) => (u === "" ? "" : `${u}^{2}`);

/** cubeFactors writes A³ + sB³ = (A + sB)(A² − sAB + B²), or with the middle sign wrong when bad is set. */
function cubeFactors(A: Term, B: Term, s: number, bad = 1): string {
  const [a, u] = A;
  const [b, w] = B;
  return `(${poly([a, u], [s * b, w])})(${poly([a * a, sqv(u)], [-bad * s * a * b, `${u}${w}`], [b * b, sqv(w)])})`;
}

/** cube writes the cube of a term: [2, "x"] gives "8x^{3}". */
const cube = ([a, u]: Term) => poly([a ** 3, u === "" ? "" : `${u}^{3}`]);

/** cubeSolution explains a sum or difference of cubes with the cube roots A and B, after taking out a common factor when original is given. */
function cubeSolution(expr: string, A: Term, B: Term, s: number, answer: string, check: Text, original = ""): Text {
  const at = poly(A);
  const bt = poly(B);
  const op = s < 0 ? "-" : "+";
  const n = original === "" ? 0 : 1;
  const cubes = [A, B].filter((T) => T[0] !== 1 || T[1] === "").map((T) => `${cube(T)} = ${T[1] === "" ? T[0] : `(${poly(T)})`}^{3}`);
  return join(
    ...(original === ""
      ? []
      : [
          label(1, "Take out the greatest common factor", "提出最大公因式"),
          both(
            `The terms are not both cubes, but after taking out the greatest common factor the parentheses hold a ${s < 0 ? "difference" : "sum"} of cubes:`,
            `这两项不都是立方，但提出最大公因式后，括号内是立方${s < 0 ? "差" : "和"}：`,
            `${original} = ${expr}`,
          ),
          para,
        ]),
    label(n + 1, "Find the cube roots", "找立方根"),
    t(`Write the terms as cubes: $${cubes.join("$ and $")}$.`, `把各项写成立方：$${cubes.join("$，$")}$。`),
    para,
    label(n + 2, "Use the formula", "用公式"),
    both(
      `Use $a^{3} ${op} b^{3} = (a ${op} b)(a^{2} ${s < 0 ? "+" : "-"} ab + b^{2})$ with $a = ${at}$ and $b = ${bt}$:`,
      `用 $a^{3} ${op} b^{3} = (a ${op} b)(a^{2} ${s < 0 ? "+" : "-"} ab + b^{2})$，其中 $a = ${at}$，$b = ${bt}$：`,
      `${expr} = ${answer}`,
    ),
    t("\n\nThe quadratic factor cannot be factored further.", "\n\n二次因式不能再分解。"),
    check,
  );
}

/** factoringSumsAndDifferencesOfCubes factors a³ + b³ and a³ − b³. */
export const factoringSumsAndDifferencesOfCubes: TopicDef = {
  id: "factoring-sums-and-differences-of-cubes",
  title: t("Factoring Sums and Differences of Cubes", "立方和与立方差的因式分解"),
  summary: t(
    "Factor $a^{3} + b^{3} = (a + b)(a^{2} - ab + b^{2})$ and $a^{3} - b^{3} = (a - b)(a^{2} + ab + b^{2})$.",
    "分解 $a^{3} + b^{3} = (a + b)(a^{2} - ab + b^{2})$ 和 $a^{3} - b^{3} = (a - b)(a^{2} + ab + b^{2})$。",
  ),
  prerequisites: ["multiplying-polynomials", "factoring-polynomials-using-gcfs", "cube-roots-of-algebraic-perfect-cubes"],
  encompasses: [
    { topic: "cube-roots-of-algebraic-perfect-cubes", weight: 0.2 },
    { topic: "factoring-polynomials-using-gcfs", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.SSE.A.2"],
  intro: t(
    `You can multiply polynomials and take the cube root of a perfect cube such as $27x^{3}$. Unlike a sum of squares, a sum of two cubes always factors, and so does a difference; each formula can be checked by multiplying out.

For example, $x^{3} - 1 = (x - 1)(x^{2} + x + 1)$. Multiplying back gives

$$(x - 1)(x^{2} + x + 1) = x^{3} + x^{2} + x - x^{2} - x - 1 = x^{3} - 1$$`,
    `你已经会多项式乘法，也会求 $27x^{3}$ 这类完全立方的立方根。与平方和不同，两个立方的和总能分解，差也一样；每个公式都可以展开检验。

例如，$x^{3} - 1 = (x - 1)(x^{2} + x + 1)$。展开验证：

$$(x - 1)(x^{2} + x + 1) = x^{3} + x^{2} + x - x^{2} - x - 1 = x^{3} - 1$$`,
  ),
  knowledgePoints: [
    {
      id: "monic",
      title: t("Factoring $x^{3} \\pm a^{3}$", "分解 $x^{3} \\pm a^{3}$"),
      explanation: t(
        "Multiplying out proves the two formulas:\n\n$$a^{3} + b^{3} = (a + b)(a^{2} - ab + b^{2}) \\qquad a^{3} - b^{3} = (a - b)(a^{2} + ab + b^{2})$$\n\nThe linear factor has the **same** sign as the expression; the middle term $ab$ of the quadratic factor has the **opposite** sign, and its last term is always $+b^{2}$. Learn the cubes $1, 8, 27, 64, 125, 216, 343, 512, 729, 1000$ to recognize them.\n\n$$x^{3} + 27 = x^{3} + 3^{3} = (x + 3)(x^{2} - 3x + 9) \\qquad x^{3} - 8 = (x - 2)(x^{2} + 2x + 4)$$\n\nThe quadratic factor cannot be factored further. Note that $x^{3} + 27$ is not $(x + 3)^{3}$.\n\n> **Watch out.** A wrong sign shows up when you multiply back: $(x - 2)(x^{2} - 2x + 4) = x^{3} - 4x^{2} + 8x - 8$, not $x^{3} - 8$.",
        "展开即可证明两个公式：\n\n$$a^{3} + b^{3} = (a + b)(a^{2} - ab + b^{2}) \\qquad a^{3} - b^{3} = (a - b)(a^{2} + ab + b^{2})$$\n\n一次因式与原式的符号**相同**；二次因式的中间项 $ab$ 符号**相反**，最后一项总是 $+b^{2}$。熟记立方数 $1, 8, 27, 64, 125, 216, 343, 512, 729, 1000$，便于识别。\n\n$$x^{3} + 27 = x^{3} + 3^{3} = (x + 3)(x^{2} - 3x + 9) \\qquad x^{3} - 8 = (x - 2)(x^{2} + 2x + 4)$$\n\n二次因式不能再分解。注意 $x^{3} + 27$ 不等于 $(x + 3)^{3}$。\n\n> **注意。** 符号写错，展开就能发现：$(x - 2)(x^{2} - 2x + 4) = x^{3} - 4x^{2} + 8x - 8$，不是 $x^{3} - 8$。",
      ),
      keyPrerequisites: ["multiplying-polynomials"],
      generate(rng) {
        const a = rng.int(1, 10);
        const s = rng.sign();
        const v = rng.pick(["x", "x", "y", "t"]);
        const reversed = rng.bool(0.25);
        const A: Term = reversed ? [a, ""] : [1, v];
        const B: Term = reversed ? [1, v] : [a, ""];
        const expr = reversed ? poly([a ** 3, ""], [s, `${v}^{3}`]) : poly([1, `${v}^{3}`], [s * a ** 3, ""]);
        const answer = cubeFactors(A, B, s);
        const x0 = atX((x) => [reversed ? a + s * x : x + s * a]);
        const av = reversed ? a : x0;
        const bv = reversed ? x0 : a;
        return factoredProblem({
          prompt: factorPrompt(expr),
          answer,
          wrong: [
            cubeFactors(A, B, s, -1),
            cubeFactors(A, B, -s),
            `(${poly(A, [s * B[0], B[1]])})^{3}`,
            `(${poly(A, [s * B[0], B[1]])})(${poly([A[0] ** 2, sqv(A[1])], [-2 * s * A[0] * B[0], `${A[1]}${B[1]}`], [B[0] ** 2, sqv(B[1])])})`,
          ],
          solution: cubeSolution(
            expr,
            A,
            B,
            s,
            answer,
            valueCheck(
              x0,
              av ** 3 + s * bv ** 3,
              [
                [av + s * bv, 1],
                [av * av - s * av * bv + bv * bv, 1],
              ],
              v,
            ),
          ),
        });
      },
    },
    {
      id: "terms-with-coefficients",
      title: t("Cubes of terms with coefficients", "带系数的项的立方"),
      explanation: t(
        "Each cube may be a whole term: $8x^{3} = (2x)^{3}$ and $27y^{3} = (3y)^{3}$. Square the whole cube root, coefficient included, for the quadratic factor:\n\n$$8x^{3} - 27y^{3} = (2x)^{3} - (3y)^{3} = (2x - 3y)(4x^{2} + 6xy + 9y^{2})$$\n\nThe middle term is the product of the roots: $2x \\cdot 3y = 6xy$, not twice it.\n\n> **Watch out.** Cube the whole root: $(2x)^{3} = 8x^{3}$, so the cube root of $8x^{3}$ is $2x$, not $8x$ or $2x^{3}$.",
        "立方可以是一个完整的项：$8x^{3} = (2x)^{3}$，$27y^{3} = (3y)^{3}$。二次因式中，把整个立方根（包括系数）平方：\n\n$$8x^{3} - 27y^{3} = (2x)^{3} - (3y)^{3} = (2x - 3y)(4x^{2} + 6xy + 9y^{2})$$\n\n中间项是两个立方根的积：$2x \\cdot 3y = 6xy$，不要乘以 2。\n\n> **注意。** 整个根都要立方：$(2x)^{3} = 8x^{3}$，所以 $8x^{3}$ 的立方根是 $2x$，不是 $8x$ 或 $2x^{3}$。",
      ),
      generate(rng) {
        let p: number;
        let q: number;
        do {
          p = rng.int(1, 5);
          q = rng.int(1, 6);
        } while (gcd(p, q) !== 1 || p * q === 1);
        const s = rng.sign();
        const withY = rng.bool(0.5);
        const A: Term = [p, "x"];
        const B: Term = [q, withY ? "y" : ""];
        const expr = poly([p ** 3, "x^{3}"], [s * q ** 3, withY ? "y^{3}" : ""]);
        const answer = cubeFactors(A, B, s);
        const x0 = atX((x) => [p * x + s * q]);
        return factoredProblem({
          prompt: factorPrompt(expr),
          answer,
          wrong: [
            cubeFactors(A, B, s, -1),
            cubeFactors(A, B, s, 2),
            `(${poly(A, [s * q, B[1]])})(${poly([p, sqv("x")], [-s * p * q, `x${B[1]}`], [q, sqv(B[1])])})`,
            cubeFactors([p, "x"], B, -s),
          ],
          solution: cubeSolution(
            expr,
            A,
            B,
            s,
            answer,
            valueCheck(
              x0,
              p ** 3 * x0 ** 3 + s * q ** 3,
              [
                [p * x0 + s * q, 1],
                [p * p * x0 * x0 - s * p * q * x0 + q * q, 1],
              ],
              "x",
              withY,
            ),
          ),
        });
      },
    },
    {
      id: "common-factor-first",
      title: t("Taking out a common factor first", "先提取公因式"),
      explanation: t(
        "Neither $2x^{3}$ nor $54$ is a cube, but after taking out the common factor $2$ the parentheses hold a sum of cubes:\n\n$$2x^{3} + 54 = 2(x^{3} + 27) = 2(x + 3)(x^{2} - 3x + 9)$$\n\nA common power of $x$ comes out the same way: $x^{4} - 64x = x(x^{3} - 64) = x(x - 4)(x^{2} + 4x + 16)$.\n\n> **Watch out.** Stopping at $2(x^{3} + 27)$ is incomplete, since the sum of cubes in the parentheses still factors.",
        "$2x^{3}$ 和 $54$ 都不是立方数，但提出公因数 $2$ 后，括号内是立方和：\n\n$$2x^{3} + 54 = 2(x^{3} + 27) = 2(x + 3)(x^{2} - 3x + 9)$$\n\n$x$ 的公共幂也同样提出：$x^{4} - 64x = x(x^{3} - 64) = x(x - 4)(x^{2} + 4x + 16)$。\n\n> **注意。** 停在 $2(x^{3} + 27)$ 不算彻底，因为括号里的立方和还能分解。",
      ),
      keyPrerequisites: ["factoring-polynomials-using-gcfs"],
      generate(rng) {
        let p: number;
        let q: number;
        let k: number;
        let e: number;
        do {
          p = rng.int(1, 3);
          q = rng.int(1, 6);
          k = rng.pick([1, 2, 3, 4, 5, 6, 7]);
          e = rng.pick([0, 0, 1, 2]);
        } while (gcd(p, q) !== 1 || (k === 1 && e === 0));
        const s = rng.sign();
        const A: Term = [p, "x"];
        const B: Term = [q, ""];
        const expr = poly([k * p ** 3, pw("x", 3 + e)], [s * k * q ** 3, pw("x", e)]);
        const inner = poly([p ** 3, "x^{3}"], [s * q ** 3, ""]);
        const answer = `${front(k, e)}${cubeFactors(A, B, s)}`;
        const x1 = atX((x) => [p * x + s * q]);
        const value = k * p ** 3 * x1 ** (3 + e) + s * k * q ** 3 * x1 ** e;
        return factoredProblem({
          prompt: factorPrompt(expr),
          answer,
          wrong: [
            `${front(k, e)}(${inner})`,
            `${front(k, e)}${cubeFactors(A, B, s, -1)}`,
            `${front(k, e)}${cubeFactors(A, B, -s)}`,
            ...(e > 0 ? [`${front(k)}${cubeFactors(A, B, s)}`] : []),
          ],
          solution: cubeSolution(
            `${front(k, e)}(${inner})`,
            A,
            B,
            s,
            answer,
            valueCheck(x1, value, [
              ...(k === 1 ? [] : [[k, 1] as const]),
              ...(e === 0 ? [] : [[x1, e] as const]),
              [p * x1 + s * q, 1],
              [p * p * x1 * x1 - s * p * q * x1 + q * q, 1],
            ]),
            expr,
          ),
        });
      },
    },
  ],
};

// ─── 2.4.5 Factoring biquadratic expressions ────────────────────────────────

/** piece writes the factor x² + m·w² (w = "" or "y"), factored further into (x + aw)(x − aw) when m = −a². */
function piece(m: number, w = ""): string {
  if (m < 0 && isSquare(-m)) {
    const a = Math.round(Math.sqrt(-m));
    return `(${poly([1, "x"], [a, w])})(${poly([1, "x"], [-a, w])})`;
  }
  return `(${poly([1, "x^{2}"], [m, sqv(w)])})`;
}

/** pieceParts gives the values at x (and y = 1) of the factors piece(m) writes. */
function pieceParts(m: number, x: number): Part[] {
  if (m < 0 && isSquare(-m)) {
    const a = Math.round(Math.sqrt(-m));
    return [
      [x + a, 1],
      [x - a, 1],
    ];
  }
  return [[x * x + m, 1]];
}

/** biquadraticValue is x⁴ + (m + n)x² + mn at x. */
const biquadraticValue = (m: number, n: number, x: number) => x ** 4 + (m + n) * x * x + m * n;

/** pairStep is the first step of a biquadratic: the two numbers with product mn and sum m + n. */
const pairStep = (m: number, n: number, en = "", zh = "") =>
  join(
    label(1, "Find the two numbers", "找两个数"),
    t(
      `This is a quadratic in $x^{2}$. Find two numbers with product $${m * n}$ and sum $${m + n}$: they are $${m}$ and $${n}$.${en}`,
      `这是 $x^{2}$ 的二次式。找两个数，积为 $${m * n}$，和为 $${m + n}$：它们是 $${m}$ 和 $${n}$。${zh}`,
    ),
  );

/** biquadraticPairs writes up to two factorizations from other factor pairs of m·n, the misreadings of x⁴ + bx² + mn. */
function biquadraticPairs(m: number, n: number, w = ""): string[] {
  const out: [number, number][] = [];
  const c = m * n;
  for (let d = 1; d * d <= Math.abs(c); d++) if (c % d === 0) out.push([d, c / d], [-d, -c / d]);
  return out
    .filter(([d, e]) => d !== m && d !== n && e !== m && e !== n)
    .sort((x, y) => Math.abs(x[0] + x[1] - m - n) - Math.abs(y[0] + y[1] - m - n))
    .slice(0, 2)
    .map(([d, e]) => `(${poly([1, "x^{2}"], [d, sqv(w)])})(${poly([1, "x^{2}"], [e, sqv(w)])})`);
}

/** factoringBiquadraticExpressions factors ax⁴ + bx² + c as a quadratic in x². */
export const factoringBiquadraticExpressions: TopicDef = {
  id: "factoring-biquadratic-expressions",
  title: t("Factoring Biquadratic Expressions", "双二次式的因式分解"),
  summary: t(
    "Factor $ax^{4} + bx^{2} + c$ as a quadratic in $x^{2}$, then factor any difference of squares that remains.",
    "把 $ax^{4} + bx^{2} + c$ 看作 $x^{2}$ 的二次式进行分解，再分解剩下的平方差。",
  ),
  prerequisites: ["factoring-trinomials-with-leading-coefficients", "factoring-higher-order-polynomials-as-a-difference-of-squares"],
  encompasses: [{ topic: "factoring-trinomials", weight: 0.5 }],
  xp: 15,
  standards: ["CCSS.HSA.SSE.A.2"],
  intro: t(
    `You can factor trinomials such as $u^{2} - 10u + 9 = (u - 1)(u - 9)$, and differences of squares of higher powers. With $u = x^{2}$, the same work factors a quartic that has only even powers.

For example, $x^{4} - 10x^{2} + 9 = (x^{2} - 1)(x^{2} - 9)$, and both factors are differences of squares:

$$x^{4} - 10x^{2} + 9 = (x + 1)(x - 1)(x + 3)(x - 3)$$`,
    `你已经会分解 $u^{2} - 10u + 9 = (u - 1)(u - 9)$ 这样的三项式，也会分解高次幂的平方差。令 $u = x^{2}$，同样的方法就能分解只含偶次幂的四次式。

例如，$x^{4} - 10x^{2} + 9 = (x^{2} - 1)(x^{2} - 9)$，两个因式都是平方差：

$$x^{4} - 10x^{2} + 9 = (x + 1)(x - 1)(x + 3)(x - 3)$$`,
  ),
  knowledgePoints: [
    {
      id: "monic",
      title: t("Factoring $x^{4} + bx^{2} + c$", "分解 $x^{4} + bx^{2} + c$"),
      explanation: t(
        "A **biquadratic** expression $x^{4} + bx^{2} + c$ is a quadratic in $x^{2}$: with $u = x^{2}$ it reads $u^{2} + bu + c$. Factor it as usual, with two numbers of product $c$ and sum $b$, and put $x^{2}$ back:\n\n$$x^{4} + 2x^{2} - 15 = (x^{2})^{2} + 2(x^{2}) - 15 = (x^{2} + 5)(x^{2} - 3)$$\n\nHere neither factor can be factored further: $x^{2} + 5$ is a sum, and $3$ is not a square.\n\n> **Watch out.** The factors contain $x^{2}$, not $x$: $(x + 5)(x - 3)$ multiplies to $x^{2} + 2x - 15$, not to $x^{4} + 2x^{2} - 15$.",
        "**双二次式** $x^{4} + bx^{2} + c$ 是 $x^{2}$ 的二次式：令 $u = x^{2}$，它就是 $u^{2} + bu + c$。像平常一样，找积为 $c$、和为 $b$ 的两个数进行分解，再把 $x^{2}$ 代回：\n\n$$x^{4} + 2x^{2} - 15 = (x^{2})^{2} + 2(x^{2}) - 15 = (x^{2} + 5)(x^{2} - 3)$$\n\n这里两个因式都不能再分解：$x^{2} + 5$ 是和，而 $3$ 不是平方数。\n\n> **注意。** 因式中是 $x^{2}$，不是 $x$：$(x + 5)(x - 3)$ 展开是 $x^{2} + 2x - 15$，不是 $x^{4} + 2x^{2} - 15$。",
      ),
      keyPrerequisites: ["factoring-trinomials"],
      generate(rng) {
        let m: number;
        let n: number;
        const ok = (k: number) => k > 0 || !isSquare(-k);
        do {
          m = rng.nonZero(-12, 12);
          n = rng.nonZero(-12, 12);
        } while (m >= n || m + n === 0 || !ok(m) || !ok(n));
        const expr = poly([1, "x^{4}"], [m + n, "x^{2}"], [m * n, ""]);
        const answer = `${piece(m)}${piece(n)}`;
        const x0 = atX((x) => [x * x + m, x * x + n]);
        return factoredProblem({
          prompt: factorPrompt(expr),
          answer,
          wrong: [`${piece(-m)}${piece(-n)}`, `${lf(1, m)}${lf(1, n)}`, ...biquadraticPairs(m, n)],
          solution: join(
            pairStep(m, n),
            para,
            label(2, "Factor", "分解"),
            both("Put $x^{2}$ back into the two factors:", "把 $x^{2}$ 代回两个因式：", `${expr} = ${answer}`),
            t("\n\nNeither factor can be factored further.", "\n\n两个因式都不能再分解。"),
            valueCheck(x0, biquadraticValue(m, n, x0), [...pieceParts(m, x0), ...pieceParts(n, x0)]),
          ),
        });
      },
    },
    {
      id: "factoring-further",
      title: t("Factoring the factors further", "继续分解因式"),
      explanation: t(
        "A factorization is complete only when no factor can be factored again. After the first step, check each quadratic factor for a difference of squares.\n\nA factor $x^{2} - a^{2}$ with a square $a^{2}$ is a difference of squares; factor it to finish:\n\n$$x^{4} - 13x^{2} + 36 = (x^{2} - 4)(x^{2} - 9) = (x + 2)(x - 2)(x + 3)(x - 3)$$\n\n$$x^{4} + 3x^{2} - 4 = (x^{2} + 4)(x^{2} - 1) = (x^{2} + 4)(x + 1)(x - 1)$$\n\n> **Watch out.** A factor $x^{2} + a^{2}$ cannot be factored over the integers; only $x^{2} - a^{2}$, with $a^{2}$ a square, splits again.",
        "只有当每个因式都不能再分解时，因式分解才算完成。第一步之后，检查每个二次因式是不是平方差。\n\n因式 $x^{2} - a^{2}$（$a^{2}$ 是平方数）是平方差，要继续分解：\n\n$$x^{4} - 13x^{2} + 36 = (x^{2} - 4)(x^{2} - 9) = (x + 2)(x - 2)(x + 3)(x - 3)$$\n\n$$x^{4} + 3x^{2} - 4 = (x^{2} + 4)(x^{2} - 1) = (x^{2} + 4)(x + 1)(x - 1)$$\n\n> **注意。** 因式 $x^{2} + a^{2}$ 在整数范围内不能分解；只有 $a^{2}$ 是平方数的 $x^{2} - a^{2}$ 才能继续分解。",
      ),
      keyPrerequisites: ["factoring-higher-order-polynomials-as-a-difference-of-squares"],
      generate(rng) {
        let a: number;
        let n: number;
        do {
          a = rng.int(1, 6);
          n = rng.bool(0.5) ? -(rng.int(1, 7) ** 2) : rng.nonZero(-12, 12);
        } while (n === -a * a || n === a * a);
        const m = -a * a;
        const expr = poly([1, "x^{4}"], [m + n, "x^{2}"], [m * n, ""]);
        const half = `(${poly([1, "x^{2}"], [m, ""])})(${poly([1, "x^{2}"], [n, ""])})`;
        const answer = `${piece(m)}${piece(n)}`;
        const x0 = atX((x) => [x * x + m, x * x + n]);
        return factoredProblem({
          prompt: factorPrompt(expr),
          answer,
          wrong: [half, `${piece(-m)}${piece(-n)}`, `(${linear(1, -a)})^{2}${piece(n)}`, ...biquadraticPairs(m, n)],
          solution: join(
            pairStep(m, n),
            both(" So", "所以", `${expr} = ${half}`),
            para,
            label(2, "Factor further", "继续分解"),
            both("Factor each difference of squares:", "分解其中的每个平方差：", `${half} = ${answer}`),
            valueCheck(x0, biquadraticValue(m, n, x0), [...pieceParts(m, x0), ...pieceParts(n, x0)]),
          ),
        });
      },
    },
    {
      id: "leading-coefficients",
      title: t("A leading coefficient", "首项系数不为 1"),
      explanation: t(
        "For $ax^{4} + bx^{2} + c$, use the $ac$ method on the quadratic in $x^{2}$. For $2x^{4} + 5x^{2} - 3$: $ac = -6$, and $6 \\cdot (-1) = -6$ with $6 + (-1) = 5$, so split the middle term:\n\n$$2x^{4} + 6x^{2} - x^{2} - 3 = 2x^{2}(x^{2} + 3) - (x^{2} + 3) = (2x^{2} - 1)(x^{2} + 3)$$\n\nThen check each factor: $2x^{2} - 1$ cannot be factored over the integers, because $2$ is not a square.\n\n> **Watch out.** The two numbers multiply to $ac$, not to $c$: for $2x^{4} + 5x^{2} - 3$ look for the product $-6$, not $-3$.",
        "对 $ax^{4} + bx^{2} + c$，把它看作 $x^{2}$ 的二次式，用 $ac$ 法。对 $2x^{4} + 5x^{2} - 3$：$ac = -6$，而 $6 \\cdot (-1) = -6$，$6 + (-1) = 5$，于是拆开中间项：\n\n$$2x^{4} + 6x^{2} - x^{2} - 3 = 2x^{2}(x^{2} + 3) - (x^{2} + 3) = (2x^{2} - 1)(x^{2} + 3)$$\n\n再检查每个因式：$2x^{2} - 1$ 在整数范围内不能分解，因为 $2$ 不是平方数。\n\n> **注意。** 两个数的积是 $ac$，不是 $c$：对 $2x^{4} + 5x^{2} - 3$，要找积为 $-6$ 的两个数，而不是 $-3$。",
      ),
      keyPrerequisites: ["factoring-trinomials-with-leading-coefficients"],
      generate(rng) {
        let p: number;
        let q: number;
        let r: number;
        let s: number;
        do {
          p = rng.int(1, 5);
          r = rng.int(1, 5);
          q = rng.nonZero(-9, 9);
          s = rng.nonZero(-9, 9);
        } while (
          p * r === 1 ||
          p > r ||
          gcd(p, q) !== 1 ||
          gcd(r, s) !== 1 ||
          !irreducible(p, q) ||
          !irreducible(r, s) ||
          p * s + q * r === 0 ||
          (p === r && q === s)
        );
        const f = (c: number, d: number) => `(${poly([c, "x^{2}"], [d, ""])})`;
        const expr = poly([p * r, "x^{4}"], [p * s + q * r, "x^{2}"], [q * s, ""]);
        const answer = `${f(p, q)}${f(r, s)}`;
        const x0 = atX((x) => [p * x * x + q, r * x * x + s]);
        return factoredProblem({
          prompt: factorPrompt(expr),
          answer,
          wrong: [`${f(p, s)}${f(r, q)}`, `${f(p, -q)}${f(r, -s)}`, `${lf(p, q)}${lf(r, s)}`],
          solution: join(
            label(1, "Find the two numbers", "找两个数"),
            t(
              `Treat it as a quadratic in $x^{2}$: $ac = ${p * r} \\cdot ${paren(q * s)} = ${p * r * q * s}$, and the two numbers $${p * s}$ and $${q * r}$ have product $${p * r * q * s}$ and sum $${p * s + q * r}$.`,
              `把它看作 $x^{2}$ 的二次式：$ac = ${p * r} \\cdot ${paren(q * s)} = ${p * r * q * s}$，两个数 $${p * s}$ 和 $${q * r}$ 的积为 $${p * r * q * s}$，和为 $${p * s + q * r}$。`,
            ),
            para,
            label(2, "Split the middle term and group", "拆开中间项并分组"),
            both(
              "Write the middle term as the two parts, then take out the common factor of each pair:",
              "把中间项拆成两部分，再提出每组的公因式：",
              `${expr} = ${poly([p * r, "x^{4}"], [p * s, "x^{2}"], [q * r, "x^{2}"], [q * s, ""])}`,
              `= ${mono(p, 2)}${f(r, s)}${signed(q, f(r, s))} = ${answer}`,
            ),
            t("\n\nNeither factor can be factored further.", "\n\n两个因式都不能再分解。"),
            valueCheck(x0, p * r * x0 ** 4 + (p * s + q * r) * x0 * x0 + q * s, [
              [p * x0 * x0 + q, 1],
              [r * x0 * x0 + s, 1],
            ]),
          ),
        });
      },
    },
    {
      id: "two-variables",
      title: t("Two variables", "含两个变量"),
      explanation: t(
        "In $x^{4} + bx^{2}y^{2} + cy^{4}$ the same two numbers appear as coefficients of $y^{2}$:\n\n$$x^{4} - 5x^{2}y^{2} + 4y^{4} = (x^{2} - y^{2})(x^{2} - 4y^{2}) = (x + y)(x - y)(x + 2y)(x - 2y)$$\n\nFactor any difference of squares that appears; $x^{2} + 3y^{2}$ or $x^{2} - 3y^{2}$ cannot be factored over the integers.\n\n> **Watch out.** Keep $y^{2}$ with each number: $(x^{2} - 1)(x^{2} - 4)$ multiplies to $x^{4} - 5x^{2} + 4$, which has no $y$.",
        "在 $x^{4} + bx^{2}y^{2} + cy^{4}$ 中，同样的两个数作为 $y^{2}$ 的系数出现：\n\n$$x^{4} - 5x^{2}y^{2} + 4y^{4} = (x^{2} - y^{2})(x^{2} - 4y^{2}) = (x + y)(x - y)(x + 2y)(x - 2y)$$\n\n出现的平方差都要继续分解；$x^{2} + 3y^{2}$ 或 $x^{2} - 3y^{2}$ 在整数范围内不能分解。\n\n> **注意。** 每个数都要带上 $y^{2}$：$(x^{2} - 1)(x^{2} - 4)$ 展开是 $x^{4} - 5x^{2} + 4$，其中没有 $y$。",
      ),
      generate(rng) {
        let m: number;
        let n: number;
        do {
          m = rng.bool(0.4) ? -(rng.int(1, 5) ** 2) : rng.nonZero(-10, 10);
          n = rng.bool(0.4) ? -(rng.int(1, 5) ** 2) : rng.nonZero(-10, 10);
        } while (m >= n || m + n === 0);
        const expr = poly([1, "x^{4}"], [m + n, "x^{2}y^{2}"], [m * n, "y^{4}"]);
        const q = (k: number) => `(${poly([1, "x^{2}"], [k, "y^{2}"])})`;
        const half = `${q(m)}${q(n)}`;
        const answer = `${piece(m, "y")}${piece(n, "y")}`;
        const x0 = atX((x) => [x * x + m, x * x + n]);
        return factoredProblem({
          prompt: factorPrompt(expr),
          answer,
          wrong: [half, `${q(-m)}${q(-n)}`, `${piece(m)}${piece(n)}`, ...biquadraticPairs(m, n, "y")],
          solution: join(
            label(1, "Find the two numbers", "找两个数"),
            t(
              `Treat it as a quadratic in $x^{2}$. Find two numbers with product $${m * n}$ and sum $${m + n}$: they are $${m}$ and $${n}$.`,
              `把它看作 $x^{2}$ 的二次式。找两个数，积为 $${m * n}$，和为 $${m + n}$：它们是 $${m}$ 和 $${n}$。`,
            ),
            para,
            label(2, "Factor", "分解"),
            both(
              `The two numbers become the coefficients of $y^{2}$${half === answer ? "" : ", and each difference of squares is factored once more"}:`,
              `这两个数作为 $y^{2}$ 的系数${half === answer ? "" : "，每个平方差再分解一次"}：`,
              `${expr} = ${half}${half === answer ? "" : ` = ${answer}`}`,
            ),
            ...(half === answer ? [t("\n\nNeither factor can be factored further.", "\n\n两个因式都不能再分解。")] : []),
            valueCheck(x0, biquadraticValue(m, n, x0), [...pieceParts(m, x0), ...pieceParts(n, x0)], "x", true),
          ),
        });
      },
    },
  ],
};

/** algebraIIFactoringTopics are the Algebra II topics on least common multiples, polynomial identities and factoring, in outline order. */
export const algebraIIFactoringTopics: readonly TopicDef[] = [
  theLeastCommonMultipleOfTwoMonomials,
  theLeastCommonMultipleOfTwoPolynomials,
  describingRelationshipsUsingPolynomialIdentities,
  furtherFactoringOfPolynomialsUsingGcfs,
  factoringHigherOrderPolynomialsAsADifferenceOfSquares,
  factoringCubicExpressionsByGrouping,
  factoringSumsAndDifferencesOfCubes,
  factoringBiquadraticExpressions,
];
