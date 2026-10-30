import type { Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, gcd, num, Q, sci } from "@ga/subject-math";

import { expressionProblem, numberProblem, scientificProblem, scientificValue, steps } from "../problems.ts";

/** mono writes a monomial: mono(6, [["x", 5], ["y", 1]]) is "6x^{5}y". */
function mono(c: number, factors: readonly (readonly [string, number])[]): string {
  const vars = factors
    .filter(([, e]) => e !== 0)
    .map(([v, e]) => (e === 1 ? v : `${v}^{${e}}`))
    .join("");
  if (vars === "") return String(c);
  return c === 1 ? vars : c === -1 ? `-${vars}` : `${c}${vars}`;
}

/** coef writes a coefficient before a variable: "", "-" or "3". */
const coef = (c: number) => (c === 1 ? "" : c === -1 ? "-" : String(c));

/** base writes a rational base in parentheses when it is negative or a fraction. */
function base(v: Q): string {
  return v.sign() < 0 || !v.isInteger() ? `\\left(${dec10(v)}\\right)` : dec10(v);
}

/** dec10 writes a number with a denominator dividing a power of ten as a decimal, any other as a fraction. */
function dec10(v: Q): string {
  let d = v.d;
  while (d % 10n === 0n) d /= 10n;
  return d === 1n && !v.isInteger() ? dec(v) : num(v);
}

/** standard writes a number in standard notation, with thin-space thousands separators: "45{,}000", "0.00032". */
function standard(v: Q): string {
  const s = dec(v);
  const [whole = "", frac] = s.replace("-", "").split(".");
  const grouped = whole.length > 4 ? whole.replace(/\B(?=(\d{3})+$)/g, "{,}") : whole;
  return `${v.sign() < 0 ? "-" : ""}${grouped}${frac ? `.${frac}` : ""}`;
}

/** normalize writes a positive v as a × 10^n with 1 ≤ a < 10. */
function normalize(v: Q): { a: Q; n: number } {
  let a = v;
  let n = 0;
  const ten = Q.of(10);
  while (a.cmp(ten) >= 0) {
    a = a.div(ten);
    n++;
  }
  while (a.cmp(Q.one) < 0) {
    a = a.mul(ten);
    n--;
  }
  return { a, n };
}

/** mantissa draws a in [1, 10) with one or two decimal places, such as 4.5 or 3.07. */
function mantissa(rng: Rng): Q {
  return rng.bool(0.6) ? Q.of(rng.int(11, 99), 10) : Q.of(rng.int(101, 999), 100);
}

export const powersOfRationalNumbers: TopicDef = {
  id: "powers-of-rational-numbers",
  title: t("Powers of Rational Numbers", "有理数的乘方"),
  summary: t("Square and cube fractions and decimals, positive or negative.", "求分数和小数（正数或负数）的平方与立方。"),
  prerequisites: ["powers-of-integers", "multiplying-fractions", "decimal-arithmetic"],
  encompasses: [
    { topic: "powers-of-integers", weight: 0.4 },
    { topic: "multiplying-fractions", weight: 0.2 },
  ],
  xp: 10,
  standards: ["CCSS.6.EE.A.1", "CCSS.7.NS.A.2"],
  knowledgePoints: [
    {
      id: "powers-of-fractions",
      title: t("Powers of fractions", "分数的乘方"),
      explanation: t(
        "A power of a fraction is the power of its numerator over the power of its denominator, because multiplying fractions multiplies the numerators and the denominators:\n\n$$\\left(\\frac{2}{3}\\right)^{3} = \\frac{2}{3} \\cdot \\frac{2}{3} \\cdot \\frac{2}{3} = \\frac{2^{3}}{3^{3}} = \\frac{8}{27}$$\n\nThe parentheses matter: the exponent applies to the whole fraction, denominator included. As with integers, an odd power of a negative fraction is negative and an even power is positive.",
        "分数的乘方等于分子的乘方除以分母的乘方，因为分数相乘就是分子乘分子、分母乘分母：\n\n$$\\left(\\frac{2}{3}\\right)^{3} = \\frac{2}{3} \\cdot \\frac{2}{3} \\cdot \\frac{2}{3} = \\frac{2^{3}}{3^{3}} = \\frac{8}{27}$$\n\n括号很重要：指数作用于整个分数，包括分母。与整数一样，负分数的奇数次幂为负，偶数次幂为正。",
      ),
      keyPrerequisites: ["powers-of-integers", "multiplying-fractions"],
      generate(rng) {
        const n = rng.pick([2, 2, 3]);
        let a: number;
        let b: number;
        do {
          a = rng.int(1, n === 2 ? 9 : 5);
          b = rng.int(2, n === 2 ? 10 : 5);
        } while (gcd(a, b) !== 1);
        const s = rng.bool(0.4) ? -1 : 1;
        const v = Q.of(s * a, b);
        const value = v.pow(n);
        const top = s < 0 ? `(-${a})^{${n}}` : `${a}^{${n}}`;
        return numberProblem({
          prompt: t(`Evaluate $${base(v)}^{${n}}$.`, `计算 $${base(v)}^{${n}}$。`),
          answer: value,
          wrong: [Q.of((s < 0 && n % 2 === 1 ? -1 : 1) * a ** n, b), value.neg(), Q.of(s * a * n, b * n)],
          solution: t(
            `Raise the numerator and the denominator to the power ${n}:${steps(`${base(v)}^{${n}} = \\frac{${top}}{${b}^{${n}}} = ${num(value)}`)}`,
            `把分子和分母分别乘方 ${n} 次：${steps(`${base(v)}^{${n}} = \\frac{${top}}{${b}^{${n}}} = ${num(value)}`)}`,
          ),
        });
      },
    },
    {
      id: "powers-of-decimals",
      title: t("Powers of decimals", "小数的乘方"),
      explanation: t(
        "Multiply the decimal by itself. Each factor brings its decimal places, so $0.3^{2}$ has $1 + 1 = 2$ decimal places:\n\n$$0.3^{2} = 0.3 \\times 0.3 = 0.09$$\n\nA common mistake is to write $0.9$: compute $3 \\times 3 = 9$, then place the decimal point so that the result has two decimal places.",
        "把这个小数自乘。每个因数都带来它的小数位数，所以 $0.3^{2}$ 有 $1 + 1 = 2$ 位小数：\n\n$$0.3^{2} = 0.3 \\times 0.3 = 0.09$$\n\n常见错误是写成 $0.9$：先算 $3 \\times 3 = 9$，再点上小数点，使结果有两位小数。",
      ),
      keyPrerequisites: ["decimal-arithmetic"],
      generate(rng) {
        const [k, scale, n] = rng.pick<[number, number, number]>([
          [rng.pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15]), 10, 2],
          [rng.int(1, 5), 10, 3],
          [rng.int(2, 9), 100, 2],
        ]);
        const s = rng.bool(0.3) ? -1 : 1;
        const v = Q.of(s * k, scale);
        const value = v.pow(n);
        const places = String(scale).length - 1;
        const shown = s < 0 ? `\\left(${dec(v)}\\right)` : dec(v);
        const factors = Array(n).fill(shown).join(" \\times ");
        return numberProblem({
          prompt: t(`Evaluate $${shown}^{${n}}$.`, `计算 $${shown}^{${n}}$。`),
          answer: value,
          form: "decimal",
          wrong: [Q.of((n % 2 === 1 ? s : 1) * k ** n, scale), value.neg(), Q.of(s * k * n, scale)],
          solution: t(
            `${steps(`${shown}^{${n}} = ${factors} = ${dec(value)}`)}Since $${k}^{${n}} = ${k ** n}$ and the product has $${n} \\times ${places} = ${n * places}$ decimal places, the result is $${dec(value)}$.`,
            `${steps(`${shown}^{${n}} = ${factors} = ${dec(value)}`)}因为 $${k}^{${n}} = ${k ** n}$，乘积有 $${n} \\times ${places} = ${n * places}$ 位小数，所以结果是 $${dec(value)}$。`,
          ),
        });
      },
    },
  ],
};

export const zeroAndNegativeExponents: TopicDef = {
  id: "zero-and-negative-exponents",
  title: t("Zero and Negative Exponents", "零指数与负指数"),
  summary: t(
    "Evaluate $a^{0}$, powers of $-1$ and negative powers such as $2^{-3}$.",
    "计算 $a^{0}$、$-1$ 的乘方，以及 $2^{-3}$ 这样的负指数幂。",
  ),
  prerequisites: ["powers-of-rational-numbers", "dividing-fractions"],
  encompasses: [{ topic: "powers-of-rational-numbers", weight: 0.3 }],
  xp: 10,
  standards: ["CCSS.8.EE.A.1"],
  knowledgePoints: [
    {
      id: "zeroth-power-and-powers-of-negative-one",
      title: t("The zeroth power and powers of $-1$", "零次幂与 $-1$ 的乘方"),
      explanation: t(
        "Going down the powers of $2$, each step divides by $2$: $2^{3} = 8$, $2^{2} = 4$, $2^{1} = 2$, so the next one is $2^{0} = 2 \\div 2 = 1$. The same holds for every base other than $0$: **$a^{0} = 1$**.\n\nPowers of $-1$ alternate: $(-1)^{n}$ is $1$ when $n$ is even and $-1$ when $n$ is odd. Mind the parentheses: $-5^{0} = -(5^{0}) = -1$.",
        "沿着 $2$ 的乘方往下走，每一步都除以 $2$：$2^{3} = 8$，$2^{2} = 4$，$2^{1} = 2$，所以下一个是 $2^{0} = 2 \\div 2 = 1$。对任何不为 $0$ 的底数都一样：**$a^{0} = 1$**。\n\n$-1$ 的乘方交替出现：$n$ 为偶数时 $(-1)^{n} = 1$，$n$ 为奇数时 $(-1)^{n} = -1$。注意括号：$-5^{0} = -(5^{0}) = -1$。",
      ),
      generate(rng) {
        const kind = rng.pick(["zero", "zero", "negated", "minusOne"] as const);
        if (kind === "minusOne") {
          const n = rng.int(3, 120);
          const value = n % 2 === 0 ? 1 : -1;
          return numberProblem({
            prompt: t(`Evaluate $(-1)^{${n}}$.`, `计算 $(-1)^{${n}}$。`),
            answer: value,
            wrong: [-value, -n],
            solution: t(
              `The exponent $${n}$ is ${n % 2 === 0 ? "even" : "odd"}, so $(-1)^{${n}} = ${value}$.`,
              `指数 $${n}$ 是${n % 2 === 0 ? "偶" : "奇"}数，所以 $(-1)^{${n}} = ${value}$。`,
            ),
          });
        }
        const b = rng.pick([Q.of(rng.int(2, 99)), Q.of(-rng.int(2, 30)), Q.of(rng.int(1, 9), rng.int(10, 13)), Q.of(rng.int(11, 99), 10)]);
        if (kind === "negated" && b.sign() > 0 && b.isInteger()) {
          return numberProblem({
            prompt: t(`Evaluate $-${dec10(b)}^{0}$.`, `计算 $-${dec10(b)}^{0}$。`),
            answer: -1,
            wrong: [1, 0],
            solution: t(
              `The exponent applies to $${dec10(b)}$ only:${steps(`-${dec10(b)}^{0} = -(${dec10(b)}^{0}) = -1`)}`,
              `指数只作用于 $${dec10(b)}$：${steps(`-${dec10(b)}^{0} = -(${dec10(b)}^{0}) = -1`)}`,
            ),
          });
        }
        return numberProblem({
          prompt: t(`Evaluate $${base(b)}^{0}$.`, `计算 $${base(b)}^{0}$。`),
          answer: 1,
          wrong: [0, b, -1],
          solution: t(
            `Any nonzero number to the power $0$ is $1$: $${base(b)}^{0} = 1$.`,
            `任何不为零的数的零次幂都是 $1$：$${base(b)}^{0} = 1$。`,
          ),
        });
      },
    },
    {
      id: "negative-exponents",
      title: t("Negative exponents", "负指数"),
      explanation: t(
        "Continuing the pattern below $2^{0} = 1$: $2^{-1} = \\frac{1}{2}$, $2^{-2} = \\frac{1}{4}$, $2^{-3} = \\frac{1}{8}$. A negative exponent means the **reciprocal** of the positive power:\n\n$$a^{-n} = \\frac{1}{a^{n}} \\qquad \\left(\\frac{a}{b}\\right)^{-n} = \\left(\\frac{b}{a}\\right)^{n}$$\n\nA negative exponent does not make the number negative: $2^{-3} = \\frac{1}{8}$, not $-8$.",
        "沿着 $2^{0} = 1$ 继续往下：$2^{-1} = \\frac{1}{2}$，$2^{-2} = \\frac{1}{4}$，$2^{-3} = \\frac{1}{8}$。负指数表示正指数幂的**倒数**：\n\n$$a^{-n} = \\frac{1}{a^{n}} \\qquad \\left(\\frac{a}{b}\\right)^{-n} = \\left(\\frac{b}{a}\\right)^{n}$$\n\n负指数不会让数变成负数：$2^{-3} = \\frac{1}{8}$，而不是 $-8$。",
      ),
      keyPrerequisites: ["dividing-fractions"],
      generate(rng) {
        const kind = rng.pick(["integer", "integer", "fraction", "negative"] as const);
        let b: Q;
        let n: number;
        if (kind === "fraction") {
          let p: number;
          let q: number;
          do {
            p = rng.int(1, 5);
            q = rng.int(2, 6);
          } while (gcd(p, q) !== 1);
          b = rng.bool() ? Q.of(p, q) : Q.of(q, p);
          n = rng.int(1, 3);
        } else {
          const k = kind === "integer" ? rng.int(2, 10) : -rng.int(2, 5);
          n = rng.int(1, Math.abs(k) <= 3 ? 4 : 2);
          b = Q.of(k);
        }
        const value = b.pow(-n);
        const positive = b.pow(n);
        return numberProblem({
          prompt: t(`Evaluate $${base(b)}^{-${n}}$.`, `计算 $${base(b)}^{-${n}}$。`),
          answer: value,
          form: "fraction",
          wrong: [positive.neg(), positive, b.mul(Q.of(-n))],
          solution: t(
            `A negative exponent is the reciprocal of the positive power:${steps(`${base(b)}^{-${n}} = \\frac{1}{${base(b)}^{${n}}} = \\frac{1}{${num(positive)}} = ${num(value)}`)}`,
            `负指数幂等于正指数幂的倒数：${steps(`${base(b)}^{-${n}} = \\frac{1}{${base(b)}^{${n}}} = \\frac{1}{${num(positive)}} = ${num(value)}`)}`,
          ),
        });
      },
    },
  ],
};

export const productAndQuotientRules: TopicDef = {
  id: "product-and-quotient-rules",
  title: t("The Product and Quotient Rules for Exponents", "同底数幂的乘法与除法"),
  summary: t(
    "Multiply and divide powers of the same base by adding and subtracting exponents.",
    "同底数幂相乘时指数相加，相除时指数相减。",
  ),
  prerequisites: ["zero-and-negative-exponents", "evaluating-expressions"],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.8.EE.A.1"],
  knowledgePoints: [
    {
      id: "product-rule",
      title: t("The product rule", "同底数幂的乘法"),
      explanation: t(
        "$x^{3} \\cdot x^{4}$ is three factors of $x$ followed by four more, seven in all:\n\n$$x^{m} \\cdot x^{n} = x^{m + n}$$\n\nTo multiply monomials, multiply the coefficients and add the exponents of each variable: $(2x^{3})(5x^{4}) = 10x^{7}$. The exponents are **added**, not multiplied, and the rule needs the **same base**.",
        "$x^{3} \\cdot x^{4}$ 是三个 $x$ 再乘四个 $x$，共七个：\n\n$$x^{m} \\cdot x^{n} = x^{m + n}$$\n\n单项式相乘时，系数相乘，同一个字母的指数相加：$(2x^{3})(5x^{4}) = 10x^{7}$。指数是**相加**而不是相乘，而且法则要求**底数相同**。",
      ),
      generate(rng) {
        const a = rng.pick([1, 2, 3, 4, 5, 6, -2, -3]);
        const b = rng.int(2, 9);
        const [m, n] = [rng.int(1, 8), rng.int(2, 8)];
        const two = rng.bool(0.4);
        const [p, q] = two ? [rng.int(1, 4), rng.int(1, 4)] : [0, 0];
        const left = mono(a, [
          ["x", m],
          ["y", p],
        ]);
        const right = mono(b, [
          ["x", n],
          ["y", q],
        ]);
        const answer = mono(a * b, [
          ["x", m + n],
          ["y", p + q],
        ]);
        return expressionProblem({
          prompt: t(`Simplify $(${left})(${right})$.`, `化简 $(${left})(${right})$。`),
          answer,
          simplified: true,
          wrong: [
            mono(a * b, [
              ["x", m * n],
              ["y", p * q],
            ]),
            mono(a + b, [
              ["x", m + n],
              ["y", p + q],
            ]),
          ],
          solution: t(
            `Multiply the coefficients and add the exponents:${steps(`(${left})(${right}) = ${a * b}${two ? `x^{${m} + ${n}}y^{${p} + ${q}}` : `x^{${m} + ${n}}`} = ${answer}`)}`,
            `系数相乘，指数相加：${steps(`(${left})(${right}) = ${a * b}${two ? `x^{${m} + ${n}}y^{${p} + ${q}}` : `x^{${m} + ${n}}`} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "quotient-rule",
      title: t("The quotient rule", "同底数幂的除法"),
      explanation: t(
        "In $\\frac{x^{6}}{x^{2}}$, two factors of $x$ in the denominator cancel two of the six in the numerator, leaving four:\n\n$$\\frac{x^{m}}{x^{n}} = x^{m - n} \\qquad (x \\ne 0)$$\n\nTo divide monomials, divide the coefficients and subtract the exponents: $\\frac{12x^{7}}{4x^{2}} = 3x^{5}$.",
        "在 $\\frac{x^{6}}{x^{2}}$ 中，分母的两个 $x$ 与分子六个 $x$ 中的两个约去，剩下四个：\n\n$$\\frac{x^{m}}{x^{n}} = x^{m - n} \\qquad (x \\ne 0)$$\n\n单项式相除时，系数相除，指数相减：$\\frac{12x^{7}}{4x^{2}} = 3x^{5}$。",
      ),
      generate(rng) {
        const b = rng.int(1, 6);
        const k = rng.pick([1, 2, 3, 4, 5, -2, -3]);
        const n = rng.int(1, 6);
        const m = n + rng.int(1, 7);
        const top = mono(b * k, [["x", m]]);
        const bottom = mono(b, [["x", n]]);
        const answer = mono(k, [["x", m - n]]);
        return expressionProblem({
          prompt: t(`Simplify $\\frac{${top}}{${bottom}}$.`, `化简 $\\frac{${top}}{${bottom}}$。`),
          answer,
          simplified: true,
          wrong: [mono(k, [["x", m + n]]), ...(m % n === 0 ? [mono(k, [["x", m / n]])] : []), mono(b * k - b, [["x", m - n]])],
          solution: t(
            `Divide the coefficients and subtract the exponents:${steps(`\\frac{${top}}{${bottom}} = ${coef(k)}x^{${m} - ${n}} = ${answer}`)}`,
            `系数相除，指数相减：${steps(`\\frac{${top}}{${bottom}} = ${coef(k)}x^{${m} - ${n}} = ${answer}`)}`,
          ),
        });
      },
    },
  ],
};

export const powerRules: TopicDef = {
  id: "power-rules",
  title: t("The Power Rules for Exponents", "幂的乘方与积的乘方"),
  summary: t("Raise powers and products to a power, and combine the rules of exponents.", "求幂的乘方与积的乘方，并综合运用指数法则。"),
  prerequisites: ["product-and-quotient-rules"],
  encompasses: [{ topic: "product-and-quotient-rules", weight: 0.5 }],
  xp: 12,
  standards: ["CCSS.8.EE.A.1"],
  knowledgePoints: [
    {
      id: "power-of-a-power",
      title: t("The power of a power", "幂的乘方"),
      explanation: t(
        "$(x^{3})^{4}$ is four factors of $x^{3}$, so $3 + 3 + 3 + 3 = 3 \\cdot 4$ factors of $x$:\n\n$$(x^{m})^{n} = x^{mn}$$\n\nHere the exponents are **multiplied**. Compare with the product rule, $x^{3} \\cdot x^{4} = x^{7}$, where they are added.",
        "$(x^{3})^{4}$ 是四个 $x^{3}$ 相乘，共有 $3 + 3 + 3 + 3 = 3 \\cdot 4$ 个 $x$：\n\n$$(x^{m})^{n} = x^{mn}$$\n\n这里指数**相乘**。对比同底数幂的乘法 $x^{3} \\cdot x^{4} = x^{7}$，那里指数相加。",
      ),
      generate(rng) {
        const [m, n] = [rng.int(2, 9), rng.int(2, 6)];
        const two = rng.bool(0.4);
        const p = two ? rng.int(1, 5) : 0;
        const inner = mono(1, [
          ["x", m],
          ["y", p],
        ]);
        const answer = mono(1, [
          ["x", m * n],
          ["y", p * n],
        ]);
        return expressionProblem({
          prompt: t(`Simplify $(${inner})^{${n}}$.`, `化简 $(${inner})^{${n}}$。`),
          answer,
          simplified: true,
          wrong: [
            mono(1, [
              ["x", m + n],
              ["y", p === 0 ? 0 : p + n],
            ]),
            mono(1, [
              ["x", m * n],
              ["y", p],
            ]),
          ],
          solution: t(
            `Multiply each exponent by $${n}$:${steps(`(${inner})^{${n}} = ${two ? `x^{${m} \\cdot ${n}}y^{${p} \\cdot ${n}}` : `x^{${m} \\cdot ${n}}`} = ${answer}`)}`,
            `每个指数都乘以 $${n}$：${steps(`(${inner})^{${n}} = ${two ? `x^{${m} \\cdot ${n}}y^{${p} \\cdot ${n}}` : `x^{${m} \\cdot ${n}}`} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "power-of-a-product",
      title: t("The power of a product", "积的乘方"),
      explanation: t(
        "A power of a product is the product of the powers: every factor inside the parentheses is raised to the power, **the coefficient included**:\n\n$$(ab)^{n} = a^{n}b^{n} \\qquad (2x^{3})^{4} = 2^{4}(x^{3})^{4} = 16x^{12}$$",
        "积的乘方等于各因数乘方的积：括号里的每个因数都要乘方，**包括系数**：\n\n$$(ab)^{n} = a^{n}b^{n} \\qquad (2x^{3})^{4} = 2^{4}(x^{3})^{4} = 16x^{12}$$",
      ),
      keyPrerequisites: ["powers-of-integers"],
      generate(rng) {
        const [c, n] = rng.pick<[number, number]>([
          [rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10]), 2],
          [rng.pick([2, 3, 4, 5]), 3],
          [rng.pick([2, 3]), 4],
          [rng.pick([-2, -3, -4]), rng.int(2, 3)],
        ]);
        const m = rng.int(1, 6);
        const inner = mono(c, [["x", m]]);
        const answer = mono(c ** n, [["x", m * n]]);
        return expressionProblem({
          prompt: t(`Simplify $(${inner})^{${n}}$.`, `化简 $(${inner})^{${n}}$。`),
          answer,
          simplified: true,
          wrong: [mono(c, [["x", m * n]]), mono(c * n, [["x", m * n]]), mono(c ** n, [["x", m + n]])],
          solution: t(
            `Raise the coefficient and the power of $x$ to the power $${n}$:${steps(`(${inner})^{${n}} = ${c < 0 ? `(${c})` : c}^{${n}}(x^{${m}})^{${n}} = ${answer}`)}`,
            `系数和 $x$ 的幂都要乘方 $${n}$ 次：${steps(`(${inner})^{${n}} = ${c < 0 ? `(${c})` : c}^{${n}}(x^{${m}})^{${n}} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "combining-the-rules",
      title: t("Combining the rules", "综合运用指数法则"),
      explanation: t(
        "Work in this order: first the powers of products and powers of powers, then multiply (adding exponents), then divide (subtracting exponents):\n\n$$\\frac{(2x^{3})^{2} \\cdot 3x^{4}}{6x^{5}} = \\frac{4x^{6} \\cdot 3x^{4}}{6x^{5}} = \\frac{12x^{10}}{6x^{5}} = 2x^{5}$$",
        "按以下顺序进行：先算积的乘方与幂的乘方，再做乘法（指数相加），最后做除法（指数相减）：\n\n$$\\frac{(2x^{3})^{2} \\cdot 3x^{4}}{6x^{5}} = \\frac{4x^{6} \\cdot 3x^{4}}{6x^{5}} = \\frac{12x^{10}}{6x^{5}} = 2x^{5}$$",
      ),
      generate(rng) {
        const c = rng.int(2, 4);
        const m = rng.int(1, 4);
        const d = rng.int(1, 5);
        const p = rng.int(1, 5);
        const top = c * c * d;
        const divisors = [1, 2, 3, 4, 6, 8, 12].filter((g) => top % g === 0 && g !== top);
        const g = rng.pick(divisors);
        const q = rng.int(1, 2 * m + p - 1);
        const answer = mono(top / g, [["x", 2 * m + p - q]]);
        const expr = `\\frac{(${mono(c, [["x", m]])})^{2} \\cdot ${mono(d, [["x", p]])}}{${mono(g, [["x", q]])}}`;
        return expressionProblem({
          prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
          answer,
          simplified: true,
          wrong: [
            ...((c * d) % g === 0 ? [mono((c * d) / g, [["x", 2 * m + p - q]])] : []),
            mono(top / g, [["x", m + 2 + p - q]]),
            mono(top / g, [["x", 2 * m + p + q]]),
          ],
          solution: t(
            `${steps(`${expr} = \\frac{${mono(c * c, [["x", 2 * m]])} \\cdot ${mono(d, [["x", p]])}}{${mono(g, [["x", q]])}} = \\frac{${mono(top, [["x", 2 * m + p]])}}{${mono(g, [["x", q]])}} = ${answer}`)}`,
            `${steps(`${expr} = \\frac{${mono(c * c, [["x", 2 * m]])} \\cdot ${mono(d, [["x", p]])}}{${mono(g, [["x", q]])}} = \\frac{${mono(top, [["x", 2 * m + p]])}}{${mono(g, [["x", q]])}} = ${answer}`)}`,
          ),
        });
      },
    },
  ],
};

export const scientificNotation: TopicDef = {
  id: "scientific-notation",
  title: t("Scientific Notation", "科学记数法"),
  summary: t(
    "Write very large and very small numbers as $a \\times 10^{n}$, and back.",
    "把很大或很小的数写成 $a \\times 10^{n}$ 的形式，并能还原。",
  ),
  prerequisites: ["zero-and-negative-exponents"],
  encompasses: [{ topic: "zero-and-negative-exponents", weight: 0.2 }],
  xp: 10,
  standards: ["CCSS.8.EE.A.3"],
  knowledgePoints: [
    {
      id: "writing-in-scientific-notation",
      title: t("Writing numbers in scientific notation", "用科学记数法表示数"),
      explanation: t(
        "A number is in **scientific notation** when it is written $a \\times 10^{n}$ with $1 \\le a < 10$ and $n$ an integer.\n\nMove the decimal point until exactly one nonzero digit is before it; $n$ counts the places moved. A large number has $n > 0$, a number less than $1$ has $n < 0$:\n\n$$45{,}000 = 4.5 \\times 10^{4} \\qquad 0.00032 = 3.2 \\times 10^{-4}$$",
        "把一个数写成 $a \\times 10^{n}$ 的形式，其中 $1 \\le a < 10$，$n$ 是整数，这就是**科学记数法**。\n\n移动小数点，使它前面恰好有一个非零数字；$n$ 就是移动的位数。大数的 $n > 0$，小于 $1$ 的数的 $n < 0$：\n\n$$45{,}000 = 4.5 \\times 10^{4} \\qquad 0.00032 = 3.2 \\times 10^{-4}$$",
      ),
      generate(rng) {
        const a = mantissa(rng);
        const n = rng.pick([rng.int(3, 9), rng.int(-7, -2)]);
        const v = scientificValue(a, n);
        return scientificProblem({
          prompt: t(`Write $${standard(v)}$ in scientific notation.`, `用科学记数法表示 $${standard(v)}$。`),
          answer: { a, n },
          wrong: [
            [a, -n],
            [a, n + 1],
            [a, n - 1],
          ],
          solution: t(
            `Move the decimal point ${Math.abs(n)} places to the ${n > 0 ? "left" : "right"} to get $${dec(a)}$, so the exponent is $${n}$:${steps(`${standard(v)} = ${sci(a, n)}`)}`,
            `把小数点向${n > 0 ? "左" : "右"}移动 ${Math.abs(n)} 位得到 $${dec(a)}$，所以指数是 $${n}$：${steps(`${standard(v)} = ${sci(a, n)}`)}`,
          ),
        });
      },
    },
    {
      id: "converting-to-standard-notation",
      title: t("Converting to standard notation", "把科学记数法还原成一般形式"),
      explanation: t(
        "Multiplying by $10^{n}$ moves the decimal point $n$ places to the right; multiplying by $10^{-n}$ moves it $n$ places to the left. Fill the empty places with zeros:\n\n$$6.07 \\times 10^{5} = 607{,}000 \\qquad 2.5 \\times 10^{-3} = 0.0025$$",
        "乘以 $10^{n}$ 就是把小数点向右移动 $n$ 位；乘以 $10^{-n}$ 就是向左移动 $n$ 位。空出的数位用 $0$ 补足：\n\n$$6.07 \\times 10^{5} = 607{,}000 \\qquad 2.5 \\times 10^{-3} = 0.0025$$",
      ),
      generate(rng) {
        const a = mantissa(rng);
        const n = rng.pick([rng.int(2, 7), rng.int(-5, -1)]);
        const v = scientificValue(a, n);
        return numberProblem({
          prompt: t(`Write $${sci(a, n)}$ in standard notation.`, `把 $${sci(a, n)}$ 写成一般形式。`),
          answer: v,
          form: "decimal",
          wrong: [scientificValue(a, -n), scientificValue(a, n + 1), scientificValue(a, n - 1)],
          solution: t(
            `Move the decimal point ${Math.abs(n)} places to the ${n > 0 ? "right" : "left"}:${steps(`${sci(a, n)} = ${standard(v)}`)}`,
            `把小数点向${n > 0 ? "右" : "左"}移动 ${Math.abs(n)} 位：${steps(`${sci(a, n)} = ${standard(v)}`)}`,
          ),
        });
      },
    },
  ],
};

export const operationsInScientificNotation: TopicDef = {
  id: "operations-in-scientific-notation",
  title: t("Multiplying and Dividing in Scientific Notation", "科学记数法的乘除"),
  summary: t(
    "Multiply and divide numbers in scientific notation, and write the result in scientific notation.",
    "用科学记数法表示的数相乘、相除，结果仍用科学记数法表示。",
  ),
  prerequisites: ["scientific-notation", "product-and-quotient-rules"],
  encompasses: [
    { topic: "scientific-notation", weight: 0.5 },
    { topic: "product-and-quotient-rules", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.8.EE.A.4"],
  knowledgePoints: [
    {
      id: "multiplying-in-scientific-notation",
      title: t("Multiplying", "乘法"),
      explanation: t(
        "Multiply the numbers and the powers of ten separately, adding the exponents. If the number part reaches $10$ or more, move one factor of $10$ into the power:\n\n$$(4 \\times 10^{3})(3 \\times 10^{5}) = 12 \\times 10^{8} = 1.2 \\times 10^{9}$$",
        "数字部分与 $10$ 的幂分别相乘，指数相加。若数字部分大于或等于 $10$，就把一个 $10$ 移入幂中：\n\n$$(4 \\times 10^{3})(3 \\times 10^{5}) = 12 \\times 10^{8} = 1.2 \\times 10^{9}$$",
      ),
      generate(rng) {
        const a = Q.of(rng.int(11, 99), 10);
        const b = rng.bool(0.5) ? Q.of(rng.int(2, 9)) : Q.of(rng.int(11, 49), 10);
        const [m, n] = [rng.int(-6, 9), rng.int(-6, 9)];
        const p = a.mul(b);
        const r = normalize(p.mul(scientificValue(1, m + n)));
        return scientificProblem({
          prompt: t(
            `Compute $(${sci(a, m)})(${sci(b, n)})$. Write the answer in scientific notation.`,
            `计算 $(${sci(a, m)})(${sci(b, n)})$，结果用科学记数法表示。`,
          ),
          answer: r,
          wrong: [
            [r.a, m + n],
            [r.a, m * n],
            [r.a, r.n + 1],
          ],
          solution: t(
            `Multiply the numbers and add the exponents:${steps(`(${dec(a)} \\times ${dec(b)}) \\times 10^{${m} + ${n < 0 ? `(${n})` : n}} = ${dec(p)} \\times 10^{${m + n}}${p.cmp(Q.of(10)) >= 0 ? ` = ${sci(r.a, r.n)}` : ""}`)}`,
            `数字相乘，指数相加：${steps(`(${dec(a)} \\times ${dec(b)}) \\times 10^{${m} + ${n < 0 ? `(${n})` : n}} = ${dec(p)} \\times 10^{${m + n}}${p.cmp(Q.of(10)) >= 0 ? ` = ${sci(r.a, r.n)}` : ""}`)}`,
          ),
        });
      },
    },
    {
      id: "dividing-in-scientific-notation",
      title: t("Dividing", "除法"),
      explanation: t(
        "Divide the numbers and the powers of ten separately, subtracting the exponents. If the number part is less than $1$, move one factor of $10$ out of the power:\n\n$$\\frac{3 \\times 10^{4}}{6 \\times 10^{9}} = 0.5 \\times 10^{-5} = 5 \\times 10^{-6}$$",
        "数字部分与 $10$ 的幂分别相除，指数相减。若数字部分小于 $1$，就从幂中移出一个 $10$：\n\n$$\\frac{3 \\times 10^{4}}{6 \\times 10^{9}} = 0.5 \\times 10^{-5} = 5 \\times 10^{-6}$$",
      ),
      generate(rng) {
        const b = rng.pick([2, 4, 5, 8, 1.5, 2.5, 1.2, 1.6].map((x) => Q.of(Math.round(x * 10), 10)));
        const qt = Q.of(rng.int(11, 99), 10);
        const product = qt.mul(b);
        const a = product.cmp(Q.of(10)) >= 0 ? product.div(Q.of(10)) : product;
        const [m, n] = [rng.int(-5, 9), rng.int(-5, 9)];
        const ratio = a.div(b);
        const r = normalize(ratio.mul(scientificValue(1, m - n)));
        return scientificProblem({
          prompt: t(
            `Compute $\\frac{${sci(a, m)}}{${sci(b, n)}}$. Write the answer in scientific notation.`,
            `计算 $\\frac{${sci(a, m)}}{${sci(b, n)}}$，结果用科学记数法表示。`,
          ),
          answer: r,
          wrong: [
            [r.a, m + n],
            [r.a, n - m],
            [r.a, m - n],
          ],
          solution: t(
            `Divide the numbers and subtract the exponents:${steps(`\\frac{${dec(a)}}{${dec(b)}} \\times 10^{${m} - ${n < 0 ? `(${n})` : n}} = ${dec(ratio)} \\times 10^{${m - n}}${ratio.cmp(Q.one) < 0 ? ` = ${sci(r.a, r.n)}` : ""}`)}`,
            `数字相除，指数相减：${steps(`\\frac{${dec(a)}}{${dec(b)}} \\times 10^{${m} - ${n < 0 ? `(${n})` : n}} = ${dec(ratio)} \\times 10^{${m - n}}${ratio.cmp(Q.one) < 0 ? ` = ${sci(r.a, r.n)}` : ""}`)}`,
          ),
        });
      },
    },
  ],
};

/** exponentTopics are the exponent and scientific notation topics. */
export const exponentTopics: readonly TopicDef[] = [
  powersOfRationalNumbers,
  zeroAndNegativeExponents,
  productAndQuotientRules,
  powerRules,
  scientificNotation,
  operationsInScientificNotation,
];
