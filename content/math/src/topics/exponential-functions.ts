import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import {
  type Coefficient,
  type Compass,
  dec,
  gcd,
  linear,
  num,
  type PlaneMark,
  type PlaneView,
  type Point,
  paren,
  plane,
  poly,
  Q,
  realLine,
} from "@ga/subject-math";

import { choiceProblem, expressionProblem, intervalProblem, numberProblem, steps } from "../problems.ts";

const toQ = (c: Coefficient): Q => (c instanceof Q ? c : Q.of(c));

/** Factors are variables with integer exponents, such as [["x", 3], ["y", -2]]. */
type Factors = readonly (readonly [string, number])[];

/** pw writes a variable to a power: "x", "x^{3}", "x^{-2}". */
const pw = (v: string, e: number) => (e === 1 ? v : `${v}^{${e}}`);

/** vars writes the factors with nonzero exponents, exponents as given: "x^{-3}y^{2}". */
const vars = (f: Factors) =>
  f
    .filter(([, e]) => e !== 0)
    .map(([v, e]) => pw(v, e))
    .join("");

/** mono writes c times the factors, negative exponents included: mono(Q.of(3, 4), [["x", -2]]) is "\frac{3}{4}x^{-2}". */
function mono(c: Coefficient, f: Factors): string {
  const v = toQ(c);
  const body = vars(f);
  if (body === "") return v.toLatex();
  return v.eq(Q.one) ? body : v.eq(Q.of(-1)) ? `-${body}` : `${v.toLatex()}${body}`;
}

/** positive writes c times the factors with positive exponents only, as one fraction: "-\frac{3y^{2}}{4x^{5}}". */
function positive(c: Coefficient, f: Factors): string {
  const v = toQ(c);
  const top = vars(f.filter(([, e]) => e > 0));
  const bottom = vars(f.filter(([, e]) => e < 0).map(([x, e]) => [x, -e] as const));
  const n = v.abs().n;
  const d = v.d;
  const numerator = top === "" ? `${n}` : n === 1n ? top : `${n}${top}`;
  const denominator = bottom === "" ? (d === 1n ? "" : `${d}`) : d === 1n ? bottom : `${d}${bottom}`;
  const body = denominator === "" ? numerator : `\\frac{${numerator}}{${denominator}}`;
  return v.sign() < 0 ? `-${body}` : body;
}

/** root writes the nth root of inner: "\sqrt{x}", "\sqrt[3]{x^{2}}". */
const root = (n: number, inner: string) => (n === 2 ? `\\sqrt{${inner}}` : `\\sqrt[${n}]{${inner}}`);

/** fracExp writes a rational exponent: "3", "\frac{2}{3}", "-\frac{1}{2}". */
const fracExp = (p: number, q: number) => Q.of(p, q).toLatex();

/** plusExp writes the sum of two exponents for a solution step: "3 + (-5)". */
const plusExp = (a: Coefficient, b: Coefficient) => `${num(a)} + ${paren(b)}`;

/** grouped writes a number in decimal notation with thin-space thousands separators when it has five digits or more. */
function grouped(c: Coefficient): string {
  const s = dec(c);
  const [whole = "", frac] = s.replace("-", "").split(".");
  const g = whole.length > 4 ? whole.replace(/\B(?=(\d{3})+$)/g, "{,}") : whole;
  return `${s.startsWith("-") ? "-" : ""}${g}${frac ? `.${frac}` : ""}`;
}

/** roundQ rounds a nonnegative number to the nearest multiple of 1/scale, halves up. */
function roundQ(v: Q, scale = 1): Q {
  const s = BigInt(scale);
  return Q.of((2n * v.n * s + v.d) / (2n * v.d), s);
}

/** pickCoprime draws a, b from the ranges with gcd(a, b) = 1. */
function pickCoprime(rng: Rng, a: [number, number], b: [number, number]): [number, number] {
  for (;;) {
    const x = rng.int(a[0], a[1]);
    const y = rng.int(b[0], b[1]);
    if (gcd(x, y) === 1) return [x, y];
  }
}

/** expo writes a·b^v with the base given in LaTeX: "3(2)^{x}", "2^{x}", "500(1.04)^{t}", "8\left(\frac{1}{2}\right)^{x}". */
function expo(a: Coefficient, base: string, v = "x"): string {
  const A = toQ(a);
  const fraction = base.startsWith("\\frac");
  const lead = A.eq(Q.one) ? "" : A.eq(Q.of(-1)) ? "-" : A.toLatex();
  if (fraction) return `${lead}\\left(${base}\\right)^{${v}}`;
  if (lead === "" && !base.includes(".")) return `${base}^{${v}}`;
  return `${lead}(${base})^{${v}}`;
}

/** cap capitalizes the first letter of an English phrase. */
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const posEn = "Write the answer with positive exponents only.";
const posZh = "结果只用正指数表示。";

/** positiveProblem asks to simplify expr to c times the factors, written with positive exponents only. */
function positiveProblem(expr: string, c: Coefficient, f: Factors, work: readonly string[], lead: Text, wrong: readonly string[]): Problem {
  const answer = positive(c, f);
  const all = [...work, answer].join(" = ");
  return expressionProblem({
    prompt: t(`Simplify $${expr}$. ${posEn}`, `化简 $${expr}$。${posZh}`),
    answer,
    lowest: true,
    wrong: [mono(c, f), ...wrong],
    solution: t(`${lead.en}${steps(`${expr} = ${all}`)}`, `${lead["zh-CN"]}${steps(`${expr} = ${all}`)}`),
  });
}

/** exponentProblem asks for the exponent, an expression in v, of a power of base written as a single power. */
function exponentProblem(expr: string, base: string, v: string, answer: string, work: string, wrong: readonly string[]): Problem {
  return expressionProblem({
    prompt: t(
      `Write $${expr}$ as a single power of $${base}$. What is its exponent? Answer in terms of $${v}$.`,
      `把 $${expr}$ 写成 $${base}$ 的一个幂。它的指数是多少？用 $${v}$ 表示。`,
    ),
    answer,
    simplified: true,
    wrong,
    solution: t(
      `${steps(`${expr} = ${work} = ${base}^{${answer}}`)}The exponent is $${answer}$.`,
      `${steps(`${expr} = ${work} = ${base}^{${answer}}`)}指数是 $${answer}$。`,
    ),
  });
}

/** algebraicExponent draws a linear exponent a·v + b with a ≠ 0. */
function algebraicExponent(rng: Rng, v: string): { a: number; b: number; latex: string } {
  const a = rng.pick([1, 1, 2, 3, 4, 5, -1, -2]);
  const b = rng.int(-6, 6);
  return { a, b, latex: linear(a, b, v) };
}

/** powerBase draws the base of a power with an algebraic exponent, and the letter of the exponent. */
function powerBase(rng: Rng): { base: string; v: string } {
  return { base: rng.pick(["x", "x", "y", "a", "2", "3", "5", "10"]), v: rng.pick(["n", "n", "m", "k"]) };
}

// Unit: rules of exponents with algebraic expressions.

export const writingRadicalsUsingFractionalExponents: TopicDef = {
  id: "writing-radicals-using-fractional-exponents",
  title: t("Writing Radical Expressions Using Fractional Exponents", "用分数指数表示根式"),
  summary: t(
    "Read $a^{\\frac{1}{n}}$ as an $n$th root and $a^{\\frac{m}{n}}$ as a root raised to a power, and convert between radicals and fractional exponents.",
    "把 $a^{\\frac{1}{n}}$ 理解为 $n$ 次方根，把 $a^{\\frac{m}{n}}$ 理解为方根的乘方，并在根式与分数指数之间互相转换。",
  ),
  prerequisites: ["cube-roots-of-algebraic-perfect-cubes"],
  encompasses: [{ topic: "square-roots-and-cube-roots", weight: 0.4 }],
  xp: 15,
  standards: ["CCSS.HSN.RN.A.1", "CCSS.HSN.RN.A.2"],
  knowledgePoints: [
    {
      id: "unit-fraction-exponents",
      title: t("Exponents $\\frac{1}{n}$", "指数 $\\frac{1}{n}$"),
      explanation: t(
        "The power rule $(a^{m})^{n} = a^{mn}$ should keep working for fractional exponents. Then $\\left(8^{\\frac{1}{3}}\\right)^{3} = 8^{1} = 8$, so $8^{\\frac{1}{3}}$ is the number whose cube is $8$: the cube root. In general\n\n$$a^{\\frac{1}{n}} = \\sqrt[n]{a}$$\n\nso $25^{\\frac{1}{2}} = \\sqrt{25} = 5$ and $81^{\\frac{1}{4}} = \\sqrt[4]{81} = 3$. The exponent $\\frac{1}{n}$ does **not** mean dividing by $n$: $8^{\\frac{1}{3}}$ is $2$, not $\\frac{8}{3}$. An odd root of a negative number is negative: $(-27)^{\\frac{1}{3}} = -3$.",
        "幂的乘方法则 $(a^{m})^{n} = a^{mn}$ 对分数指数也应成立。于是 $\\left(8^{\\frac{1}{3}}\\right)^{3} = 8^{1} = 8$，所以 $8^{\\frac{1}{3}}$ 是立方等于 $8$ 的数，即立方根。一般地\n\n$$a^{\\frac{1}{n}} = \\sqrt[n]{a}$$\n\n所以 $25^{\\frac{1}{2}} = \\sqrt{25} = 5$，$81^{\\frac{1}{4}} = \\sqrt[4]{81} = 3$。指数 $\\frac{1}{n}$ **不是**除以 $n$：$8^{\\frac{1}{3}}$ 等于 $2$，而不是 $\\frac{8}{3}$。负数的奇次方根是负数：$(-27)^{\\frac{1}{3}} = -3$。",
      ),
      keyPrerequisites: ["square-roots-and-cube-roots"],
      generate(rng) {
        const n = rng.pick([2, 2, 3, 3, 4, 5]);
        const r = rng.int(2, ({ 2: 20, 3: 6, 4: 4, 5: 3 } as Record<number, number>)[n]!);
        const kind = n % 2 === 1 && rng.bool(0.25) ? "negative" : rng.bool(0.2) ? "reciprocal" : "plain";
        const p = r ** n;
        const base = kind === "negative" ? `(-${p})` : kind === "reciprocal" ? `\\left(\\frac{1}{${p}}\\right)` : `${p}`;
        const inside = kind === "negative" ? `-${p}` : kind === "reciprocal" ? `\\frac{1}{${p}}` : `${p}`;
        const value = kind === "negative" ? Q.of(-r) : kind === "reciprocal" ? Q.of(1, r) : Q.of(r);
        const power =
          kind === "negative"
            ? `(${value.toLatex()})^{${n}}`
            : kind === "reciprocal"
              ? `\\left(${value.toLatex()}\\right)^{${n}}`
              : `${r}^{${n}}`;
        return numberProblem({
          prompt: t(`Evaluate $${base}^{\\frac{1}{${n}}}$.`, `计算 $${base}^{\\frac{1}{${n}}}$。`),
          answer: value,
          wrong: [kind === "reciprocal" ? Q.of(1, p * n) : Q.of(kind === "negative" ? -p : p, n), value.neg(), Q.one.div(value)],
          solution: t(
            `The exponent $\\frac{1}{${n}}$ means the root of index $${n}$:${steps(`${base}^{\\frac{1}{${n}}} = ${root(n, inside)} = ${value.toLatex()}`)}because $${power} = ${inside}$.`,
            `指数 $\\frac{1}{${n}}$ 表示 $${n}$ 次方根：${steps(`${base}^{\\frac{1}{${n}}} = ${root(n, inside)} = ${value.toLatex()}`)}因为 $${power} = ${inside}$。`,
          ),
        });
      },
    },
    {
      id: "rational-exponents",
      title: t("Exponents $\\frac{m}{n}$", "指数 $\\frac{m}{n}$"),
      explanation: t(
        "Since $\\frac{m}{n} = \\frac{1}{n} \\cdot m$, the power rule gives\n\n$$a^{\\frac{m}{n}} = \\left(a^{\\frac{1}{n}}\\right)^{m} = \\left(\\sqrt[n]{a}\\right)^{m}$$\n\nThe denominator is the root, the numerator the power. Take the root first to keep the numbers small: $8^{\\frac{2}{3}} = (\\sqrt[3]{8})^{2} = 2^{2} = 4$. A negative exponent still means the reciprocal: $8^{-\\frac{2}{3}} = \\frac{1}{4}$.",
        "因为 $\\frac{m}{n} = \\frac{1}{n} \\cdot m$，由幂的乘方法则得\n\n$$a^{\\frac{m}{n}} = \\left(a^{\\frac{1}{n}}\\right)^{m} = \\left(\\sqrt[n]{a}\\right)^{m}$$\n\n分母表示开方的次数，分子表示乘方的次数。先开方可以让数保持较小：$8^{\\frac{2}{3}} = (\\sqrt[3]{8})^{2} = 2^{2} = 4$。负指数仍然表示倒数：$8^{-\\frac{2}{3}} = \\frac{1}{4}$。",
      ),
      keyPrerequisites: ["zero-and-negative-exponents"],
      generate(rng) {
        const n = rng.pick([2, 2, 3, 3, 4, 5]);
        const r = rng.int(2, ({ 2: 10, 3: 5, 4: 3, 5: 2 } as Record<number, number>)[n]!);
        const ms = [2, 3, 4, 5].filter((m) => gcd(m, n) === 1 && r ** m <= 1000);
        const m = rng.pick(ms);
        const p = r ** n;
        const negative = rng.bool(0.3);
        const e = negative ? `-\\frac{${m}}{${n}}` : `\\frac{${m}}{${n}}`;
        const positiveValue = Q.of(r ** m);
        const value = negative ? Q.one.div(positiveValue) : positiveValue;
        const work = `(${root(n, String(p))})^{${m}} = ${r}^{${m}} = ${r ** m}`;
        return numberProblem({
          prompt: t(`Evaluate $${p}^{${e}}$.`, `计算 $${p}^{${e}}$。`),
          answer: value,
          wrong: [Q.of(p * m, n), negative ? positiveValue : Q.one.div(positiveValue), negative ? positiveValue.neg() : Q.of(r * m)],
          solution: negative
            ? t(
                `Take the reciprocal of the positive power, then the root, then the power:${steps(`${p}^{${e}} = \\frac{1}{${p}^{\\frac{${m}}{${n}}}}`, `${p}^{\\frac{${m}}{${n}}} = ${work}`)}So $${p}^{${e}} = ${value.toLatex()}$.`,
                `先取正指数幂的倒数，再开方，最后乘方：${steps(`${p}^{${e}} = \\frac{1}{${p}^{\\frac{${m}}{${n}}}}`, `${p}^{\\frac{${m}}{${n}}} = ${work}`)}所以 $${p}^{${e}} = ${value.toLatex()}$。`,
              )
            : t(
                `The denominator $${n}$ is the root and the numerator $${m}$ the power:${steps(`${p}^{${e}} = ${work}`)}`,
                `分母 $${n}$ 表示开方，分子 $${m}$ 表示乘方：${steps(`${p}^{${e}} = ${work}`)}`,
              ),
        });
      },
    },
    {
      id: "radicals-as-powers",
      title: t("Writing radicals as powers", "把根式写成幂"),
      explanation: t(
        "Read $a^{\\frac{m}{n}} = \\sqrt[n]{a^{m}}$ backwards: the index of the root becomes the denominator of the exponent, and the power under it the numerator. For $x > 0$:\n\n$$\\sqrt[5]{x^{3}} = x^{\\frac{3}{5}} \\qquad \\sqrt{x} = x^{\\frac{1}{2}} \\qquad \\frac{1}{\\sqrt[3]{x^{2}}} = x^{-\\frac{2}{3}}$$\n\nA root in a denominator gives a negative exponent. Simplify the fraction in the exponent when you can: $\\sqrt[6]{x^{4}} = x^{\\frac{4}{6}} = x^{\\frac{2}{3}}$.",
        "把 $a^{\\frac{m}{n}} = \\sqrt[n]{a^{m}}$ 倒过来读：根指数成为指数的分母，根号下的幂指数成为分子。当 $x > 0$ 时：\n\n$$\\sqrt[5]{x^{3}} = x^{\\frac{3}{5}} \\qquad \\sqrt{x} = x^{\\frac{1}{2}} \\qquad \\frac{1}{\\sqrt[3]{x^{2}}} = x^{-\\frac{2}{3}}$$\n\n根式在分母中时，指数为负。指数中的分数能约分就要约分：$\\sqrt[6]{x^{4}} = x^{\\frac{4}{6}} = x^{\\frac{2}{3}}$。",
      ),
      generate(rng) {
        const n = rng.int(2, 7);
        let m = rng.int(1, 9);
        while (m === n) m = rng.int(1, 9);
        const inverse = rng.bool(0.3);
        const shape = rng.int(0, 2);
        const radical = shape === 0 && m > 1 ? `\\left(${root(n, "x")}\\right)^{${m}}` : root(n, m === 1 ? "x" : `x^{${m}}`);
        const expr = inverse ? `\\frac{1}{${radical}}` : radical;
        const s = inverse ? -1 : 1;
        const k = Q.of(s * m, n);
        return numberProblem({
          prompt: t(
            `For $x > 0$, write $${expr}$ as a power $x^{k}$. What is $k$?`,
            `设 $x > 0$。把 $${expr}$ 写成幂 $x^{k}$ 的形式，$k$ 是多少？`,
          ),
          answer: k,
          solveFor: "k",
          wrong: [Q.of(s * n, m), Q.of(-s * m, n), Q.of(s * m * n), Q.of(s * m)],
          solution: t(
            `The index $${n}$ of the root is the denominator and the power $${m}$ the numerator${inverse ? "; the root is in a denominator, so the exponent is negative" : ""}:${steps(`${expr} = x^{${fracExp(s * m, n)}}`)}So $k = ${k.toLatex()}$.`,
            `根指数 $${n}$ 是分母，幂指数 $${m}$ 是分子${inverse ? "；根式在分母中，所以指数为负" : ""}：${steps(`${expr} = x^{${fracExp(s * m, n)}}`)}所以 $k = ${k.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "powers-as-radicals",
      title: t("Writing powers as radicals", "把幂写成根式"),
      explanation: t(
        "To write $x^{\\frac{m}{n}}$ as a radical, put $x^{m}$ under a root of index $n$:\n\n$$x^{\\frac{m}{n}} = \\sqrt[n]{x^{m}} = \\left(\\sqrt[n]{x}\\right)^{m}$$\n\nA negative exponent puts the radical in a denominator: $x^{-\\frac{3}{4}} = \\frac{1}{\\sqrt[4]{x^{3}}}$. Do not swap the roles: $x^{\\frac{2}{3}}$ is $\\sqrt[3]{x^{2}}$, not $\\sqrt{x^{3}}$.",
        "把 $x^{\\frac{m}{n}}$ 写成根式时，把 $x^{m}$ 放在 $n$ 次根号下：\n\n$$x^{\\frac{m}{n}} = \\sqrt[n]{x^{m}} = \\left(\\sqrt[n]{x}\\right)^{m}$$\n\n负指数会把根式放到分母中：$x^{-\\frac{3}{4}} = \\frac{1}{\\sqrt[4]{x^{3}}}$。不要把两者弄反：$x^{\\frac{2}{3}}$ 是 $\\sqrt[3]{x^{2}}$，而不是 $\\sqrt{x^{3}}$。",
      ),
      generate(rng) {
        let m: number;
        let n: number;
        do {
          [m, n] = pickCoprime(rng, [1, 7], [2, 6]);
        } while (m === 1 && rng.bool(0.6));
        const negative = rng.bool(0.3);
        const xm = m === 1 ? "x" : `x^{${m}}`;
        const correct = root(n, xm);
        const swapped = m === 1 ? `x^{${n}}` : root(m, `x^{${n}}`);
        const options = [
          negative ? `\\frac{1}{${correct}}` : correct,
          negative ? `-${correct}` : `\\frac{1}{${correct}}`,
          negative ? `\\frac{1}{${swapped}}` : swapped,
          negative ? `-\\frac{${xm}}{${n}}` : `\\frac{${xm}}{${n}}`,
        ];
        const order = rng.shuffle([0, 1, 2, 3]);
        const e = negative ? `-\\frac{${m}}{${n}}` : `\\frac{${m}}{${n}}`;
        return choiceProblem({
          prompt: t(`For $x > 0$, which expression equals $x^{${e}}$?`, `设 $x > 0$。哪个式子等于 $x^{${e}}$？`),
          options: order.map((i) => t(`$${options[i]}$`, `$${options[i]}$`)),
          correct: order.indexOf(0),
          solution: t(
            `The denominator $${n}$ is the index of the root and the numerator $${m}$ the power under it${negative ? "; the negative sign makes it a reciprocal" : ""}:${steps(`x^{${e}} = ${options[0]}`)}`,
            `分母 $${n}$ 是根指数，分子 $${m}$ 是根号下的幂指数${negative ? "；负号表示取倒数" : ""}：${steps(`x^{${e}} = ${options[0]}`)}`,
          ),
        });
      },
    },
  ],
  diagnostic: "rational-exponents",
};

export const productRuleWithAlgebraicExpressions: TopicDef = {
  id: "product-rule-with-algebraic-expressions",
  title: t("The Product Rule for Exponents With Algebraic Expressions", "代数式中的同底数幂乘法"),
  summary: t(
    "Multiply powers of the same base when the exponents are negative, fractional or algebraic.",
    "当指数为负数、分数或代数式时，计算同底数幂的乘法。",
  ),
  prerequisites: ["writing-radicals-using-fractional-exponents", "combining-like-terms"],
  encompasses: [{ topic: "product-and-quotient-rules", weight: 0.5 }],
  xp: 12,
  standards: ["CCSS.HSN.RN.A.2", "CCSS.8.EE.A.1"],
  knowledgePoints: [
    {
      id: "negative-exponents-in-products",
      title: t("Products with negative exponents", "含负指数的乘积"),
      explanation: t(
        "The product rule $x^{m} \\cdot x^{n} = x^{m + n}$ holds for every integer exponent, negative ones included. Multiply the coefficients, add the exponents of each variable, then move every negative power to the denominator:\n\n$$(3x^{2}y^{-4})(2x^{-5}y) = 6x^{2 + (-5)}y^{-4 + 1} = 6x^{-3}y^{-3} = \\frac{6}{x^{3}y^{3}}$$\n\nOnly the power moves to the denominator, not the coefficient. A variable whose exponents add to $0$ disappears, since $x^{0} = 1$. Throughout, no variable is $0$.",
        "同底数幂的乘法 $x^{m} \\cdot x^{n} = x^{m + n}$ 对所有整数指数都成立，包括负指数。系数相乘，同一字母的指数相加，再把负指数幂移到分母：\n\n$$(3x^{2}y^{-4})(2x^{-5}y) = 6x^{2 + (-5)}y^{-4 + 1} = 6x^{-3}y^{-3} = \\frac{6}{x^{3}y^{3}}$$\n\n移到分母的只是幂，系数不动。指数之和为 $0$ 的字母会消失，因为 $x^{0} = 1$。本节中所有字母都不为 $0$。",
      ),
      keyPrerequisites: ["product-and-quotient-rules", "zero-and-negative-exponents"],
      generate(rng) {
        const a = rng.pick([1, 2, 3, 4, 5, 6, -2, -3]);
        const b = rng.int(2, 9);
        const two = rng.bool(0.6);
        let p: number;
        let r: number;
        let q: number;
        let s: number;
        do {
          p = rng.nonZero(-6, 7);
          r = rng.nonZero(-6, 7);
          q = two ? rng.nonZero(-5, 5) : 0;
          s = two ? rng.nonZero(-5, 5) : 0;
        } while (!(p + r < 0 || q + s < 0) || (p + r === 0 && q + s === 0));
        const left = mono(a, [
          ["x", p],
          ["y", q],
        ]);
        const right = mono(b, [
          ["x", r],
          ["y", s],
        ]);
        const result: Factors = [
          ["x", p + r],
          ["y", q + s],
        ];
        const step = `${a * b}x^{${plusExp(p, r)}}${two ? `y^{${plusExp(q, s)}}` : ""}`;
        return positiveProblem(
          `(${left})(${right})`,
          a * b,
          result,
          [step, ...(mono(a * b, result) === positive(a * b, result) ? [] : [mono(a * b, result)])],
          t(
            "Multiply the coefficients and add the exponents, then move the negative powers to the denominator:",
            "系数相乘、指数相加，再把负指数幂移到分母：",
          ),
          [
            positive(a * b, [
              ["x", p * r],
              ["y", q * s],
            ]),
            positive(a + b, result),
            positive(Q.of(1, a * b), result),
          ],
        );
      },
    },
    {
      id: "algebraic-exponents-in-products",
      title: t("Algebraic exponents", "代数式指数"),
      explanation: t(
        "The exponents may themselves be expressions. The product rule still says to add them, and adding them means combining like terms:\n\n$$x^{2n + 1} \\cdot x^{n - 3} = x^{(2n + 1) + (n - 3)} = x^{3n - 2}$$\n\nThe base must be the same, and it can be a number: $2^{n} \\cdot 2^{5} = 2^{n + 5}$. The exponents are added, not multiplied: $x^{2n} \\cdot x^{3}$ is $x^{2n + 3}$, not $x^{6n}$.",
        "指数本身也可以是代数式。同底数幂相乘仍然是指数相加，而相加就是合并同类项：\n\n$$x^{2n + 1} \\cdot x^{n - 3} = x^{(2n + 1) + (n - 3)} = x^{3n - 2}$$\n\n底数必须相同，也可以是数：$2^{n} \\cdot 2^{5} = 2^{n + 5}$。指数是相加而不是相乘：$x^{2n} \\cdot x^{3}$ 是 $x^{2n + 3}$，而不是 $x^{6n}$。",
      ),
      keyPrerequisites: ["combining-like-terms"],
      generate(rng) {
        const { base, v } = powerBase(rng);
        let e1: ReturnType<typeof algebraicExponent>;
        let e2: { a: number; b: number; latex: string };
        do {
          e1 = algebraicExponent(rng, v);
          e2 = rng.bool(0.25) ? { a: 0, b: rng.int(2, 9), latex: "" } : algebraicExponent(rng, v);
          e2 = { ...e2, latex: linear(e2.a, e2.b, v) };
        } while (e1.a + e2.a === 0);
        const answer = linear(e1.a + e2.a, e1.b + e2.b, v);
        return exponentProblem(
          `${base}^{${e1.latex}} \\cdot ${base}^{${e2.latex}}`,
          base,
          v,
          answer,
          `${base}^{(${e1.latex}) + (${e2.latex})}`,
          [
            poly([e1.a * e2.a, `${v}^{2}`], [e1.a * e2.b + e1.b * e2.a, v], [e1.b * e2.b, ""]),
            linear(e1.a + e2.a, e1.b - e2.b, v),
            linear(e1.a - e2.a, e1.b - e2.b, v),
          ],
        );
      },
    },
    {
      id: "fractional-exponents-in-products",
      title: t("Fractional exponents", "分数指数"),
      explanation: t(
        "Fractional exponents add like any fractions. With a common denominator this is quick:\n\n$$x^{\\frac{1}{3}} \\cdot x^{\\frac{5}{3}} = x^{\\frac{1}{3} + \\frac{5}{3}} = x^{\\frac{6}{3}} = x^{2}$$\n\nWith coefficients, multiply them as usual: $(2x^{\\frac{1}{2}})(3x^{\\frac{3}{2}}) = 6x^{2}$. In radical form this says $\\sqrt[3]{x} \\cdot \\sqrt[3]{x^{5}} = x^{2}$. Here $x > 0$.",
        "分数指数的相加与分数加法相同。分母相同时很快：\n\n$$x^{\\frac{1}{3}} \\cdot x^{\\frac{5}{3}} = x^{\\frac{1}{3} + \\frac{5}{3}} = x^{\\frac{6}{3}} = x^{2}$$\n\n有系数时照常相乘：$(2x^{\\frac{1}{2}})(3x^{\\frac{3}{2}}) = 6x^{2}$。用根式表示，就是 $\\sqrt[3]{x} \\cdot \\sqrt[3]{x^{5}} = x^{2}$。这里 $x > 0$。",
      ),
      generate(rng) {
        const q = rng.pick([2, 3, 4, 5]);
        const k = rng.int(1, 5);
        let p: number;
        do p = rng.int(1, k * q - 1);
        while (gcd(p, q) !== 1 || gcd(k * q - p, q) !== 1);
        const r = k * q - p;
        const a = rng.pick([1, 1, 2, 3, 4, 5]);
        const b = rng.pick([1, 2, 3, 4, 6]);
        const left = `${a === 1 ? "" : a}x^{\\frac{${p}}{${q}}}`;
        const right = `${b === 1 ? "" : b}x^{\\frac{${r}}{${q}}}`;
        const expr = a === 1 && b === 1 ? `${left} \\cdot ${right}` : `(${left})(${right})`;
        const answer = mono(a * b, [["x", k]]);
        return expressionProblem({
          prompt: t(`Simplify $${expr}$, where $x > 0$.`, `化简 $${expr}$，其中 $x > 0$。`),
          answer,
          simplified: true,
          wrong: [mono(a * b, [["x", p * r]]), mono(a + b, [["x", k]]), mono(a * b, [["x", p + r]]), mono(a * b, [["x", 2 * k]])],
          solution: t(
            `Add the exponents:${steps(`${expr} = ${a * b === 1 ? "" : a * b}x^{\\frac{${p}}{${q}} + \\frac{${r}}{${q}}} = ${a * b === 1 ? "" : a * b}x^{\\frac{${p + r}}{${q}}} = ${answer}`)}`,
            `指数相加：${steps(`${expr} = ${a * b === 1 ? "" : a * b}x^{\\frac{${p}}{${q}} + \\frac{${r}}{${q}}} = ${a * b === 1 ? "" : a * b}x^{\\frac{${p + r}}{${q}}} = ${answer}`)}`,
          ),
        });
      },
    },
  ],
};

export const quotientRuleWithAlgebraicExpressions: TopicDef = {
  id: "quotient-rule-with-algebraic-expressions",
  title: t("The Quotient Rule for Exponents With Algebraic Expressions", "代数式中的同底数幂除法"),
  summary: t(
    "Divide powers of the same base, writing the result with positive exponents, and with algebraic exponents.",
    "计算同底数幂的除法，结果用正指数表示；指数也可以是代数式。",
  ),
  prerequisites: ["product-rule-with-algebraic-expressions"],
  encompasses: [{ topic: "product-and-quotient-rules", weight: 0.5 }],
  xp: 12,
  standards: ["CCSS.8.EE.A.1"],
  knowledgePoints: [
    {
      id: "quotients-with-negative-results",
      title: t("Quotients with negative exponents in the result", "结果含负指数的商"),
      explanation: t(
        "Divide the coefficients and subtract the exponents, numerator minus denominator, even when the denominator has the larger exponent:\n\n$$\\frac{6x^{2}y^{5}}{8x^{7}y^{2}} = \\frac{3}{4}x^{2 - 7}y^{5 - 2} = \\frac{3}{4}x^{-5}y^{3} = \\frac{3y^{3}}{4x^{5}}$$\n\nA negative result means the factors of $x$ that are left over are in the denominator. Reduce the coefficients like a fraction.",
        "系数相除，指数相减（分子的指数减分母的指数），即使分母的指数更大也一样：\n\n$$\\frac{6x^{2}y^{5}}{8x^{7}y^{2}} = \\frac{3}{4}x^{2 - 7}y^{5 - 2} = \\frac{3}{4}x^{-5}y^{3} = \\frac{3y^{3}}{4x^{5}}$$\n\n结果为负，说明剩下的 $x$ 因数在分母中。系数要像分数一样约分。",
      ),
      generate(rng) {
        const [a, b] = pickCoprime(rng, [1, 9], [1, 9]);
        const g = rng.pick([1, 2, 3, 4]);
        const two = rng.bool(0.7);
        let p: number;
        let q: number;
        let r: number;
        let s: number;
        do {
          [p, r] = [rng.int(1, 8), rng.int(1, 9)];
          [q, s] = two ? [rng.int(1, 7), rng.int(1, 7)] : [0, 0];
        } while (!(p - r < 0 || q - s < 0) || (p === r && q === s));
        const top = mono(a * g, [
          ["x", p],
          ["y", q],
        ]);
        const bottom = mono(b * g, [
          ["x", r],
          ["y", s],
        ]);
        const c = Q.of(a, b);
        const result: Factors = [
          ["x", p - r],
          ["y", q - s],
        ];
        const step = `${c.eq(Q.one) ? "" : c.toLatex()}x^{${p} - ${r}}${two ? `y^{${q} - ${s}}` : ""}`;
        return positiveProblem(
          `\\frac{${top}}{${bottom}}`,
          c,
          result,
          [step, ...(mono(c, result) === positive(c, result) ? [] : [mono(c, result)])],
          t(
            "Divide the coefficients and subtract the exponents, then move the negative powers to the denominator:",
            "系数相除、指数相减，再把负指数幂移到分母：",
          ),
          [
            positive(c, [
              ["x", r - p],
              ["y", s - q],
            ]),
            positive(c, [
              ["x", p + r],
              ["y", q + s],
            ]),
            positive(Q.of(b, a), result),
          ],
        );
      },
    },
    {
      id: "negative-and-fractional-exponents-in-quotients",
      title: t("Negative and fractional exponents in quotients", "商中的负指数与分数指数"),
      explanation: t(
        "Subtracting a negative exponent adds its absolute value, so watch the signs:\n\n$$\\frac{x^{-3}}{x^{4}} = x^{-3 - 4} = x^{-7} = \\frac{1}{x^{7}} \\qquad \\frac{x^{2}}{x^{-5}} = x^{2 - (-5)} = x^{7}$$\n\nFractional exponents subtract like fractions: $\\frac{x^{\\frac{7}{3}}}{x^{\\frac{1}{3}}} = x^{\\frac{6}{3}} = x^{2}$.",
        "减去一个负指数等于加上它的绝对值，要注意符号：\n\n$$\\frac{x^{-3}}{x^{4}} = x^{-3 - 4} = x^{-7} = \\frac{1}{x^{7}} \\qquad \\frac{x^{2}}{x^{-5}} = x^{2 - (-5)} = x^{7}$$\n\n分数指数按分数相减：$\\frac{x^{\\frac{7}{3}}}{x^{\\frac{1}{3}}} = x^{\\frac{6}{3}} = x^{2}$。",
      ),
      generate(rng) {
        if (rng.bool(0.35)) {
          const q = rng.pick([2, 3, 4, 5]);
          const k = rng.nonZero(-3, 4);
          let p: number;
          let r: number;
          do {
            r = rng.int(1, 12) + (k < 0 ? -k * q : 0);
            p = r + k * q;
          } while (p <= 0 || gcd(p, q) !== 1 || gcd(r, q) !== 1);
          const expr = `\\frac{x^{\\frac{${p}}{${q}}}}{x^{\\frac{${r}}{${q}}}}`;
          return positiveProblem(
            expr,
            1,
            [["x", k]],
            [`x^{\\frac{${p}}{${q}} - \\frac{${r}}{${q}}}`, `x^{${fracExp(p - r, q)}}`],
            t("Subtract the exponents:", "指数相减："),
            [positive(1, [["x", -k]]), mono(1, [["x", p - r]])],
          );
        }
        const a = rng.pick([1, 1, 2, 3, 4, 5, 6]);
        const g = rng.pick([1, 1, 2, 3]);
        let p: number;
        let r: number;
        do {
          p = rng.nonZero(-7, 7);
          r = rng.nonZero(-7, 7);
        } while ((p > 0 && r > 0) || p === r);
        const top = mono(a * g, [["x", p]]);
        const bottom = mono(g, [["x", r]]);
        return positiveProblem(
          `\\frac{${top}}{${bottom}}`,
          a,
          [["x", p - r]],
          [`${a === 1 ? "" : a}x^{${p} - ${paren(r)}}`],
          t("Divide the coefficients and subtract the exponents:", "系数相除，指数相减："),
          [positive(a, [["x", p + r]]), positive(a, [["x", r - p]])],
        );
      },
    },
    {
      id: "algebraic-exponents-in-quotients",
      title: t("Algebraic exponents", "代数式指数"),
      explanation: t(
        "To divide, subtract the whole exponent of the denominator. Put it in parentheses so that every term is subtracted:\n\n$$\\frac{x^{5n + 2}}{x^{2n - 1}} = x^{(5n + 2) - (2n - 1)} = x^{5n + 2 - 2n + 1} = x^{3n + 3}$$\n\nForgetting the parentheses gives the wrong constant: $5n + 2 - 2n - 1 = 3n + 1$.",
        "做除法时，要减去分母的整个指数。给它加上括号，保证每一项都被减去：\n\n$$\\frac{x^{5n + 2}}{x^{2n - 1}} = x^{(5n + 2) - (2n - 1)} = x^{5n + 2 - 2n + 1} = x^{3n + 3}$$\n\n忘记括号会得到错误的常数项：$5n + 2 - 2n - 1 = 3n + 1$。",
      ),
      keyPrerequisites: ["combining-like-terms"],
      generate(rng) {
        const { base, v } = powerBase(rng);
        let e1: { a: number; b: number; latex: string };
        let e2: { a: number; b: number; latex: string };
        do {
          e1 = algebraicExponent(rng, v);
          e2 = algebraicExponent(rng, v);
        } while (e1.a === e2.a || e2.b === 0);
        const answer = linear(e1.a - e2.a, e1.b - e2.b, v);
        return exponentProblem(
          `\\frac{${base}^{${e1.latex}}}{${base}^{${e2.latex}}}`,
          base,
          v,
          answer,
          `${base}^{(${e1.latex}) - (${e2.latex})}`,
          [linear(e1.a + e2.a, e1.b + e2.b, v), linear(e1.a - e2.a, e1.b + e2.b, v), linear(e2.a - e1.a, e2.b - e1.b, v)],
        );
      },
    },
  ],
};

export const powerRuleWithAlgebraicExpressions: TopicDef = {
  id: "power-rule-with-algebraic-expressions",
  title: t("The Power Rule for Exponents With Algebraic Expressions", "代数式中的幂的乘方"),
  summary: t(
    "Raise a power to a power when the exponents are negative, fractional or algebraic.",
    "当指数为负数、分数或代数式时，计算幂的乘方。",
  ),
  prerequisites: ["product-rule-with-algebraic-expressions"],
  encompasses: [{ topic: "power-rules", weight: 0.4 }],
  xp: 12,
  standards: ["CCSS.HSN.RN.A.2", "CCSS.8.EE.A.1"],
  knowledgePoints: [
    {
      id: "negative-exponents-in-powers",
      title: t("Powers with negative exponents", "含负指数的幂的乘方"),
      explanation: t(
        "$(x^{m})^{n} = x^{mn}$ for all integers $m$ and $n$. Multiply each exponent inside by the outside exponent, keeping track of the signs, then move negative powers to the denominator:\n\n$$(x^{-3}y^{2})^{-4} = x^{(-3)(-4)}y^{2 \\cdot (-4)} = x^{12}y^{-8} = \\frac{x^{12}}{y^{8}}$$",
        "对所有整数 $m$、$n$，都有 $(x^{m})^{n} = x^{mn}$。把括号里的每个指数都乘以外面的指数，注意符号，再把负指数幂移到分母：\n\n$$(x^{-3}y^{2})^{-4} = x^{(-3)(-4)}y^{2 \\cdot (-4)} = x^{12}y^{-8} = \\frac{x^{12}}{y^{8}}$$",
      ),
      generate(rng) {
        const two = rng.bool(0.6);
        let p: number;
        let q: number;
        let n: number;
        do {
          p = rng.nonZero(-6, 6);
          q = two ? rng.nonZero(-5, 5) : 0;
          n = rng.pick([-4, -3, -2, -1, 2, 3, 4]);
        } while (!(p * n < 0 || q * n < 0) || Math.abs(p * n) > 12 || Math.abs(q * n) > 12);
        const inner = mono(1, [
          ["x", p],
          ["y", q],
        ]);
        const result: Factors = [
          ["x", p * n],
          ["y", q * n],
        ];
        const step = `x^{${paren(p)} \\cdot ${paren(n)}}${two ? `y^{${paren(q)} \\cdot ${paren(n)}}` : ""}`;
        return positiveProblem(
          two || n < 0 ? `(${inner})^{${n}}` : `(${inner})^{${n}}`,
          1,
          result,
          [step, ...(mono(1, result) === positive(1, result) ? [] : [mono(1, result)])],
          t("Multiply each exponent by the outside exponent:", "每个指数都乘以外面的指数："),
          [
            positive(1, [
              ["x", p + n],
              ["y", q === 0 ? 0 : q + n],
            ]),
            positive(1, [
              ["x", p * n],
              ["y", q],
            ]),
            positive(1, [
              ["x", -p * n],
              ["y", -q * n],
            ]),
          ],
        );
      },
    },
    {
      id: "algebraic-exponents-in-powers",
      title: t("Algebraic exponents", "代数式指数"),
      explanation: t(
        "Raising a power to a power multiplies the exponents, so the outside exponent multiplies **every term** of the inside exponent:\n\n$$(x^{n + 2})^{3} = x^{3(n + 2)} = x^{3n + 6} \\qquad (x^{n - 1})^{n} = x^{n(n - 1)} = x^{n^{2} - n}$$\n\nMultiplying only the first term, $x^{3n + 2}$, is a common mistake.",
        "幂的乘方是指数相乘，所以外面的指数要乘以里面指数的**每一项**：\n\n$$(x^{n + 2})^{3} = x^{3(n + 2)} = x^{3n + 6} \\qquad (x^{n - 1})^{n} = x^{n(n - 1)} = x^{n^{2} - n}$$\n\n只乘第一项而得到 $x^{3n + 2}$ 是常见错误。",
      ),
      generate(rng) {
        const { base, v } = powerBase(rng);
        let e: { a: number; b: number; latex: string };
        do e = algebraicExponent(rng, v);
        while (e.b === 0);
        if (rng.bool(0.3)) {
          const answer = poly([e.a, `${v}^{2}`], [e.b, v]);
          return exponentProblem(`(${base}^{${e.latex}})^{${v}}`, base, v, answer, `${base}^{${v}(${e.latex})}`, [
            linear(e.a + 1, e.b, v),
            poly([e.a, `${v}^{2}`], [e.b, ""]),
            linear(e.a, e.b, v),
          ]);
        }
        const c = rng.pick([2, 3, 4, 5, -2, -3]);
        const answer = linear(c * e.a, c * e.b, v);
        return exponentProblem(`(${base}^{${e.latex}})^{${c}}`, base, v, answer, `${base}^{${paren(c)}(${e.latex})}`, [
          linear(c * e.a, e.b, v),
          linear(e.a, e.b + c, v),
          linear(c * e.a, -c * e.b, v),
        ]);
      },
    },
    {
      id: "fractional-exponents-in-powers",
      title: t("Fractional exponents", "分数指数"),
      explanation: t(
        "The power rule works the same with fractions: multiply the exponents.\n\n$$\\left(x^{\\frac{2}{3}}\\right)^{6} = x^{\\frac{2}{3} \\cdot 6} = x^{4} \\qquad \\left(x^{10}\\right)^{\\frac{1}{5}} = x^{10 \\cdot \\frac{1}{5}} = x^{2}$$\n\nThe second one says $\\sqrt[5]{x^{10}} = x^{2}$: a root divides the exponent. Here $x > 0$.",
        "幂的乘方法则对分数指数同样适用：指数相乘。\n\n$$\\left(x^{\\frac{2}{3}}\\right)^{6} = x^{\\frac{2}{3} \\cdot 6} = x^{4} \\qquad \\left(x^{10}\\right)^{\\frac{1}{5}} = x^{10 \\cdot \\frac{1}{5}} = x^{2}$$\n\n第二个式子就是 $\\sqrt[5]{x^{10}} = x^{2}$：开方就是把指数除以根指数。这里 $x > 0$。",
      ),
      generate(rng) {
        const q = rng.pick([2, 3, 4, 5]);
        const negative = rng.bool(0.25);
        if (rng.bool(0.5)) {
          const [p] = pickCoprime(rng, [1, 7], [q, q]);
          const j = rng.int(1, Math.max(1, Math.min(3, Math.floor(12 / p))));
          const r = (negative ? -1 : 1) * q * j;
          const k = p * j * (negative ? -1 : 1);
          const expr = `\\left(x^{\\frac{${p}}{${q}}}\\right)^{${r}}`;
          return positiveProblem(
            expr,
            1,
            [["x", k]],
            [`x^{\\frac{${p}}{${q}} \\cdot ${paren(r)}}`, ...(negative ? [`x^{${k}}`] : [])],
            t("Multiply the exponents:", "指数相乘："),
            [positive(1, [["x", p * r]]), positive(1, [["x", -k]]), positive(1, [["x", p + r]])],
          );
        }
        const k = rng.int(1, 6);
        const m = k * q;
        const e = negative ? `-\\frac{1}{${q}}` : `\\frac{1}{${q}}`;
        const res = negative ? -k : k;
        return positiveProblem(
          `\\left(x^{${m}}\\right)^{${e}}`,
          1,
          [["x", res]],
          [`x^{${m} \\cdot \\left(${e}\\right)}`, ...(negative ? [`x^{${res}}`] : [])],
          t("Multiply the exponents:", "指数相乘："),
          [
            positive(1, [["x", (negative ? -1 : 1) * m * q]]),
            positive(1, [["x", (negative ? -1 : 1) * (m - q)]]),
            positive(1, [["x", -res]]),
          ],
        );
      },
    },
  ],
};

export const powerOfProductRuleWithAlgebraicExpressions: TopicDef = {
  id: "power-of-product-rule-with-algebraic-expressions",
  title: t("The Power of Product Rule With Algebraic Expressions", "代数式中的积的乘方"),
  summary: t(
    "Raise a product of a coefficient and powers to a negative or fractional power.",
    "把由系数和幂组成的积进行负指数或分数指数的乘方。",
  ),
  prerequisites: ["power-rule-with-algebraic-expressions"],
  encompasses: [
    { topic: "power-rule-with-algebraic-expressions", weight: 0.5 },
    { topic: "power-rules", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.HSN.RN.A.2", "CCSS.8.EE.A.1"],
  knowledgePoints: [
    {
      id: "products-with-negative-exponents",
      title: t("Negative exponents inside", "括号内含负指数"),
      explanation: t(
        "$(ab)^{n} = a^{n}b^{n}$: raise every factor in the parentheses to the power, the coefficient included, and multiply the exponents of the variables:\n\n$$(-2x^{3}y^{-2})^{3} = (-2)^{3}x^{9}y^{-6} = -\\frac{8x^{9}}{y^{6}}$$\n\nAn odd power of a negative coefficient stays negative.",
        "$(ab)^{n} = a^{n}b^{n}$：括号里的每个因数都要乘方，包括系数；字母的指数相乘：\n\n$$(-2x^{3}y^{-2})^{3} = (-2)^{3}x^{9}y^{-6} = -\\frac{8x^{9}}{y^{6}}$$\n\n负系数的奇数次幂仍为负。",
      ),
      generate(rng) {
        const c = rng.pick([2, 3, 4, 5, -2, -3]);
        const n = Math.abs(c) >= 4 ? 2 : rng.pick([2, 3]);
        const two = rng.bool(0.7);
        let p: number;
        let q: number;
        do {
          p = rng.nonZero(-4, 5);
          q = two ? rng.nonZero(-4, 4) : 0;
        } while (!(p < 0 || q < 0));
        const inner = mono(c, [
          ["x", p],
          ["y", q],
        ]);
        const cn = c ** n;
        const result: Factors = [
          ["x", p * n],
          ["y", q * n],
        ];
        return positiveProblem(
          `(${inner})^{${n}}`,
          cn,
          result,
          [`${paren(c)}^{${n}}${mono(1, result)}`],
          t("Raise the coefficient and each power to the power, multiplying the exponents:", "系数与每个幂都乘方，指数相乘："),
          [
            positive(c, result),
            positive(c * n, result),
            positive(cn, [
              ["x", p + n],
              ["y", q === 0 ? 0 : q + n],
            ]),
          ],
        );
      },
    },
    {
      id: "negative-powers-of-products",
      title: t("Negative powers of products", "积的负指数幂"),
      explanation: t(
        "A negative outside exponent applies to the coefficient too, so the coefficient ends up in the denominator:\n\n$$(3x^{2}y)^{-2} = 3^{-2}x^{-4}y^{-2} = \\frac{1}{9x^{4}y^{2}}$$\n\nA negative exponent never makes the coefficient negative: $3^{-2} = \\frac{1}{9}$, not $-9$.",
        "外面的负指数同样作用于系数，所以系数最后在分母中：\n\n$$(3x^{2}y)^{-2} = 3^{-2}x^{-4}y^{-2} = \\frac{1}{9x^{4}y^{2}}$$\n\n负指数不会让系数变成负数：$3^{-2} = \\frac{1}{9}$，而不是 $-9$。",
      ),
      generate(rng) {
        const c = rng.int(2, 5);
        const n = c >= 4 ? rng.pick([1, 2]) : rng.pick([1, 2, 3]);
        const two = rng.bool(0.6);
        let p: number;
        let q: number;
        do {
          p = rng.nonZero(-3, 5);
          q = two ? rng.nonZero(-3, 4) : 0;
        } while (p < 0 && q <= 0);
        const inner = mono(c, [
          ["x", p],
          ["y", q],
        ]);
        const cn = c ** n;
        const result: Factors = [
          ["x", -p * n],
          ["y", -q * n],
        ];
        return positiveProblem(
          `(${inner})^{-${n}}`,
          Q.of(1, cn),
          result,
          [`${c}^{-${n}}${mono(1, result)}`],
          t(`Raise every factor to the power $-${n}$, the coefficient included:`, `每个因数都乘方 $-${n}$ 次，包括系数：`),
          [positive(cn, result), positive(-cn, result), positive(Q.of(1, c * n), result), positive(Q.of(1, c), result)],
        );
      },
    },
    {
      id: "fractional-powers-of-products",
      title: t("Fractional powers of products", "积的分数指数幂"),
      explanation: t(
        "A fractional power of a product is the product of the fractional powers. For the coefficient, take the root; for each variable, multiply the exponents:\n\n$$(8x^{6}y^{3})^{\\frac{1}{3}} = 8^{\\frac{1}{3}}x^{2}y = 2x^{2}y \\qquad (9x^{4})^{\\frac{3}{2}} = 9^{\\frac{3}{2}}x^{6} = 27x^{6}$$\n\nHere the variables are positive.",
        "积的分数指数幂等于各因数分数指数幂的积。系数开方；每个字母的指数相乘：\n\n$$(8x^{6}y^{3})^{\\frac{1}{3}} = 8^{\\frac{1}{3}}x^{2}y = 2x^{2}y \\qquad (9x^{4})^{\\frac{3}{2}} = 9^{\\frac{3}{2}}x^{6} = 27x^{6}$$\n\n这里的字母都是正数。",
      ),
      keyPrerequisites: ["writing-radicals-using-fractional-exponents"],
      generate(rng) {
        const n = rng.pick([2, 2, 3]);
        const r = rng.int(2, n === 2 ? 9 : 4);
        const m = rng.bool(0.3) && r <= 5 ? rng.pick(n === 2 ? [3] : [2]) : 1;
        const two = rng.bool(0.5);
        const p = rng.int(1, 4);
        const q = two ? rng.int(1, 3) : 0;
        const inner = mono(r ** n, [
          ["x", n * p],
          ["y", n * q],
        ]);
        const e = m === 1 ? `\\frac{1}{${n}}` : `\\frac{${m}}{${n}}`;
        const result: Factors = [
          ["x", p * m],
          ["y", q * m],
        ];
        const answer = mono(r ** m, result);
        return expressionProblem({
          prompt: t(`Simplify $(${inner})^{${e}}$, where the variables are positive.`, `化简 $(${inner})^{${e}}$，其中字母都是正数。`),
          answer,
          simplified: true,
          positive: true,
          wrong: [
            mono(r ** n, result),
            mono(r ** m, [
              ["x", n * p * m],
              ["y", n * q * m],
            ]),
            mono(r, [
              ["x", p],
              ["y", q],
            ]),
            mono(Q.of(r ** n * m, n), result),
          ],
          solution: t(
            `Take the power $${e}$ of the coefficient and multiply each exponent by $${e}$:${steps(`(${inner})^{${e}} = ${r ** n}^{${e}}${mono(1, result)} = ${answer}`)}because $${r ** n}^{${e}} = (${root(n, String(r ** n))})${m === 1 ? "" : `^{${m}}`} = ${r ** m}$.`,
            `系数取 $${e}$ 次幂，每个指数乘以 $${e}$：${steps(`(${inner})^{${e}} = ${r ** n}^{${e}}${mono(1, result)} = ${answer}`)}因为 $${r ** n}^{${e}} = (${root(n, String(r ** n))})${m === 1 ? "" : `^{${m}}`} = ${r ** m}$。`,
          ),
        });
      },
    },
  ],
};

export const powerOfQuotientRuleWithAlgebraicExpressions: TopicDef = {
  id: "power-of-quotient-rule-with-algebraic-expressions",
  title: t("The Power of Quotient Rule With Algebraic Expressions", "代数式中的商的乘方"),
  summary: t(
    "Raise a quotient of monomials to a power, including negative powers, by raising the numerator and the denominator.",
    "求单项式之商的乘方（包括负指数幂）：分子、分母分别乘方。",
  ),
  prerequisites: ["power-of-product-rule-with-algebraic-expressions", "quotient-rule-with-algebraic-expressions"],
  encompasses: [
    { topic: "power-of-product-rule-with-algebraic-expressions", weight: 0.5 },
    { topic: "quotient-rule-with-algebraic-expressions", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.8.EE.A.1"],
  knowledgePoints: [
    {
      id: "powers-of-quotients",
      title: t("Powers of quotients", "商的乘方"),
      explanation: t(
        "$\\left(\\frac{a}{b}\\right)^{n} = \\frac{a^{n}}{b^{n}}$: raise the whole numerator and the whole denominator to the power, coefficients included:\n\n$$\\left(\\frac{2x^{2}}{3y}\\right)^{3} = \\frac{(2x^{2})^{3}}{(3y)^{3}} = \\frac{8x^{6}}{27y^{3}}$$\n\nA common mistake is to leave the $3$ in the denominator unpowered.",
        "$\\left(\\frac{a}{b}\\right)^{n} = \\frac{a^{n}}{b^{n}}$：整个分子和整个分母都要乘方，包括系数：\n\n$$\\left(\\frac{2x^{2}}{3y}\\right)^{3} = \\frac{(2x^{2})^{3}}{(3y)^{3}} = \\frac{8x^{6}}{27y^{3}}$$\n\n常见错误是忘记给分母中的 $3$ 乘方。",
      ),
      generate(rng) {
        const [a, b] = pickCoprime(rng, [1, 5], [2, 5]);
        const n = Math.max(a, b) >= 4 ? 2 : rng.pick([2, 3]);
        const p = rng.int(1, 5);
        const q = rng.int(1, 4);
        const top = mono(a, [["x", p]]);
        const bottom = mono(b, [["y", q]]);
        const c = Q.of(a ** n, b ** n);
        const result: Factors = [
          ["x", p * n],
          ["y", -q * n],
        ];
        return positiveProblem(
          `\\left(\\frac{${top}}{${bottom}}\\right)^{${n}}`,
          c,
          result,
          [`\\frac{(${top})^{${n}}}{(${bottom})^{${n}}}`],
          t("Raise the numerator and the denominator to the power:", "分子、分母分别乘方："),
          [
            `\\frac{${mono(a ** n, [["x", p * n]])}}{${mono(b, [["y", q * n]])}}`,
            positive(Q.of(a, b), result),
            positive(c, [
              ["x", p + n],
              ["y", -(q + n)],
            ]),
          ],
        );
      },
    },
    {
      id: "negative-powers-of-quotients",
      title: t("Negative powers of quotients", "商的负指数幂"),
      explanation: t(
        "A negative power of a fraction is the positive power of its reciprocal: flip the fraction, then raise it to the power.\n\n$$\\left(\\frac{2x}{y^{3}}\\right)^{-2} = \\left(\\frac{y^{3}}{2x}\\right)^{2} = \\frac{y^{6}}{4x^{2}}$$",
        "分数的负指数幂等于其倒数的正指数幂：先把分数颠倒，再乘方。\n\n$$\\left(\\frac{2x}{y^{3}}\\right)^{-2} = \\left(\\frac{y^{3}}{2x}\\right)^{2} = \\frac{y^{6}}{4x^{2}}$$",
      ),
      generate(rng) {
        const [a, b] = pickCoprime(rng, [1, 5], [1, 4]);
        const n = Math.max(a, b) >= 4 ? rng.pick([1, 2]) : rng.pick([1, 2, 3]);
        const p = rng.int(1, 5);
        const q = rng.int(1, 4);
        const top = mono(a, [["x", p]]);
        const bottom = mono(b, [["y", q]]);
        const c = Q.of(b ** n, a ** n);
        const result: Factors = [
          ["x", -p * n],
          ["y", q * n],
        ];
        const flipped = `\\left(\\frac{${bottom}}{${top}}\\right)${n === 1 ? "" : `^{${n}}`}`;
        return positiveProblem(
          `\\left(\\frac{${top}}{${bottom}}\\right)^{-${n}}`,
          c,
          result,
          [flipped],
          t("Flip the fraction to make the exponent positive, then raise it to the power:", "把分数颠倒使指数变为正数，再乘方："),
          [
            positive(Q.of(a ** n, b ** n), [
              ["x", p * n],
              ["y", -q * n],
            ]),
            positive(Q.of(b, a), result),
            positive(c.neg(), result),
          ],
        );
      },
    },
    {
      id: "simplifying-inside-first",
      title: t("Simplifying inside first", "先化简括号内"),
      explanation: t(
        "When the same variable is in the numerator and the denominator, simplify inside the parentheses first; the numbers stay smaller:\n\n$$\\left(\\frac{6x^{5}}{9x^{2}}\\right)^{2} = \\left(\\frac{2x^{3}}{3}\\right)^{2} = \\frac{4x^{6}}{9}$$",
        "同一个字母同时出现在分子和分母中时，先化简括号内，数会小一些：\n\n$$\\left(\\frac{6x^{5}}{9x^{2}}\\right)^{2} = \\left(\\frac{2x^{3}}{3}\\right)^{2} = \\frac{4x^{6}}{9}$$",
      ),
      generate(rng) {
        const [a, b] = pickCoprime(rng, [1, 4], [1, 4]);
        const g = rng.int(2, 4);
        const n = rng.pick([2, 2, 3, -2]);
        let p: number;
        let r: number;
        do {
          p = rng.int(1, 8);
          r = rng.int(1, 8);
        } while (p === r || Math.abs((p - r) * n) > 12);
        const expr = `\\left(\\frac{${mono(g * a, [["x", p]])}}{${mono(g * b, [["x", r]])}}\\right)^{${n}}`;
        const inside = positive(Q.of(a, b), [["x", p - r]]);
        const c = Q.of(a, b).pow(n);
        const result: Factors = [["x", (p - r) * n]];
        return positiveProblem(
          expr,
          c,
          result,
          [`\\left(${inside}\\right)^{${n}}`],
          t("Simplify inside the parentheses, then raise to the power:", "先化简括号内，再乘方："),
          [
            positive(c, [["x", p - r + n]]),
            positive(Q.of(a, b), result),
            `\\frac{${(g * a) ** Math.abs(n)}x^{${Math.abs((p - r) * n)}}}{${(g * b) ** Math.abs(n)}}`,
          ],
        );
      },
    },
  ],
};

export const combiningRulesOfExponentsWithAlgebraicExpressions: TopicDef = {
  id: "combining-rules-of-exponents-with-algebraic-expressions",
  title: t("Combining the Rules of Exponents With Algebraic Expressions", "综合运用指数法则化简代数式"),
  summary: t(
    "Simplify expressions that need several rules of exponents, writing the result with positive exponents.",
    "化简需要综合运用多条指数法则的式子，结果用正指数表示。",
  ),
  prerequisites: ["power-of-quotient-rule-with-algebraic-expressions"],
  encompasses: [
    { topic: "power-of-quotient-rule-with-algebraic-expressions", weight: 0.4 },
    { topic: "power-of-product-rule-with-algebraic-expressions", weight: 0.5 },
    { topic: "quotient-rule-with-algebraic-expressions", weight: 0.5 },
    { topic: "product-rule-with-algebraic-expressions", weight: 0.5 },
  ],
  xp: 15,
  standards: ["CCSS.8.EE.A.1", "CCSS.HSA.SSE.A.2"],
  knowledgePoints: [
    {
      id: "products-and-quotients-of-powers",
      title: t("Powers, products and quotients", "幂、积与商"),
      explanation: t(
        "Work in order: first the powers of products, then the multiplication in the numerator (add exponents), then the division (subtract exponents), and finally move negative powers to the denominator:\n\n$$\\frac{(2x^{-1}y^{2})^{2} \\cdot 3x^{4}}{6xy^{5}} = \\frac{4x^{-2}y^{4} \\cdot 3x^{4}}{6xy^{5}} = \\frac{12x^{2}y^{4}}{6xy^{5}} = 2xy^{-1} = \\frac{2x}{y}$$",
        "按顺序进行：先算积的乘方，再算分子中的乘法（指数相加），然后做除法（指数相减），最后把负指数幂移到分母：\n\n$$\\frac{(2x^{-1}y^{2})^{2} \\cdot 3x^{4}}{6xy^{5}} = \\frac{4x^{-2}y^{4} \\cdot 3x^{4}}{6xy^{5}} = \\frac{12x^{2}y^{4}}{6xy^{5}} = 2xy^{-1} = \\frac{2x}{y}$$",
      ),
      generate(rng) {
        const c = rng.pick([2, 3, -2]);
        const d = rng.int(1, 6);
        const top = c * c * d;
        const g = rng.pick([1, 2, 3, 4, 6, 8, 12].filter((x) => top % x === 0 && x !== top));
        let p: number;
        let q: number;
        let r: number;
        let s: number;
        let u: number;
        let w: number;
        do {
          [p, q, r, s, u, w] = [rng.nonZero(-3, 4), rng.nonZero(-2, 3), rng.int(1, 5), rng.int(0, 3), rng.int(1, 6), rng.int(1, 6)];
        } while (2 * p + r - u === 0 || !(2 * p + r - u < 0 || 2 * q + s - w < 0) || (p > 0 && q > 0));
        const square = mono(c, [
          ["x", p],
          ["y", q],
        ]);
        const factor = mono(d, [
          ["x", r],
          ["y", s],
        ]);
        const below = mono(g, [
          ["x", u],
          ["y", w],
        ]);
        const expr = `\\frac{(${square})^{2} \\cdot ${factor}}{${below}}`;
        const numerator = mono(top, [
          ["x", 2 * p + r],
          ["y", 2 * q + s],
        ]);
        const coefficient = Q.of(top, g);
        const result: Factors = [
          ["x", 2 * p + r - u],
          ["y", 2 * q + s - w],
        ];
        return positiveProblem(
          expr,
          coefficient,
          result,
          [
            `\\frac{${mono(c * c, [
              ["x", 2 * p],
              ["y", 2 * q],
            ])} \\cdot ${factor}}{${below}}`,
            `\\frac{${numerator}}{${below}}`,
          ],
          t("Square first, then multiply in the numerator, then divide:", "先平方，再算分子中的乘法，最后做除法："),
          [
            positive(Q.of(c * d, g), result),
            positive(coefficient, [
              ["x", p + 2 + r - u],
              ["y", q + 2 + s - w],
            ]),
            positive(coefficient, [
              ["x", 2 * p + r + u],
              ["y", 2 * q + s + w],
            ]),
          ],
        );
      },
    },
    {
      id: "negative-powers-in-combinations",
      title: t("Negative powers in combinations", "综合运算中的负指数幂"),
      explanation: t(
        "Treat a negative power of a fraction first, by flipping the fraction. Then multiply:\n\n$$\\left(\\frac{2x}{y^{2}}\\right)^{-3} \\cdot 4x^{5}y = \\frac{y^{6}}{8x^{3}} \\cdot 4x^{5}y = \\frac{4x^{5}y^{7}}{8x^{3}} = \\frac{x^{2}y^{7}}{2}$$",
        "先处理分数的负指数幂：把分数颠倒。然后再相乘：\n\n$$\\left(\\frac{2x}{y^{2}}\\right)^{-3} \\cdot 4x^{5}y = \\frac{y^{6}}{8x^{3}} \\cdot 4x^{5}y = \\frac{4x^{5}y^{7}}{8x^{3}} = \\frac{x^{2}y^{7}}{2}$$",
      ),
      generate(rng) {
        const a = rng.int(1, 3);
        const n = a === 3 ? rng.pick([1, 2]) : rng.pick([1, 2, 3]);
        const b = rng.int(1, 9);
        let p: number;
        let q: number;
        let r: number;
        let s: number;
        do {
          [p, q, r, s] = [rng.int(1, 4), rng.int(1, 3), rng.int(-4, 8), rng.int(-5, 4)];
        } while (r - p * n === 0 && s + q * n === 0);
        const top = mono(a, [["x", p]]);
        const bottom = pw("y", q);
        const factor = mono(b, [
          ["x", r],
          ["y", s],
        ]);
        const expr = `\\left(\\frac{${top}}{${bottom}}\\right)^{-${n}} \\cdot ${factor}`;
        const coefficient = Q.of(b, a ** n);
        const result: Factors = [
          ["x", r - p * n],
          ["y", s + q * n],
        ];
        return positiveProblem(
          expr,
          coefficient,
          result,
          [
            `${positive(Q.of(1, a ** n), [
              ["x", -p * n],
              ["y", q * n],
            ])} \\cdot ${factor}`,
          ],
          t(
            "Flip the fraction to make its exponent positive, raise it to the power, then multiply:",
            "把分数颠倒使指数为正，乘方后再相乘：",
          ),
          [
            positive(b * a ** n, [
              ["x", r + p * n],
              ["y", s - q * n],
            ]),
            positive(Q.of(b, a), result),
            positive(coefficient, [
              ["x", r - p - n],
              ["y", s + q + n],
            ]),
          ],
        );
      },
    },
    {
      id: "combining-algebraic-exponents",
      title: t("Algebraic exponents", "代数式指数"),
      explanation: t(
        "With algebraic exponents, the same rules turn into algebra on the exponents: a power multiplies, a product adds, a quotient subtracts.\n\n$$\\frac{(x^{n + 1})^{2} \\cdot x^{3n}}{x^{n - 2}} = x^{2(n + 1) + 3n - (n - 2)} = x^{2n + 2 + 3n - n + 2} = x^{4n + 4}$$",
        "指数为代数式时，同样的法则变成对指数的代数运算：乘方相乘，乘法相加，除法相减。\n\n$$\\frac{(x^{n + 1})^{2} \\cdot x^{3n}}{x^{n - 2}} = x^{2(n + 1) + 3n - (n - 2)} = x^{2n + 2 + 3n - n + 2} = x^{4n + 4}$$",
      ),
      generate(rng) {
        const { base, v } = powerBase(rng);
        const c = rng.int(2, 4);
        let e1: { a: number; b: number; latex: string };
        let e2: { a: number; b: number; latex: string };
        let e3: { a: number; b: number; latex: string };
        do {
          e1 = algebraicExponent(rng, v);
          e2 = algebraicExponent(rng, v);
          e3 = algebraicExponent(rng, v);
        } while (c * e1.a + e2.a - e3.a === 0 || e1.b === 0 || e3.b === 0);
        const A = c * e1.a + e2.a - e3.a;
        const answer = linear(A, c * e1.b + e2.b - e3.b, v);
        return exponentProblem(
          `\\frac{(${base}^{${e1.latex}})^{${c}} \\cdot ${base}^{${e2.latex}}}{${base}^{${e3.latex}}}`,
          base,
          v,
          answer,
          `${base}^{${c}(${e1.latex}) + (${e2.latex}) - (${e3.latex})}`,
          [
            linear(A, e1.b + e2.b - e3.b, v),
            linear(A, c * e1.b + e2.b + e3.b, v),
            linear(c * e1.a + e2.a + e3.a, c * e1.b + e2.b + e3.b, v),
          ],
        );
      },
    },
  ],
};

// Unit: exponential expressions and equations.

/** maxExp is the largest exponent of each base whose power is shown as a number. */
const maxExp: Record<number, number> = { 2: 10, 3: 6, 4: 5, 5: 4, 6: 3, 7: 3, 9: 3, 10: 6 };

/** powerValue writes b^k as a number: "32", "1", "\frac{1}{8}". */
function powerValue(b: number, k: number): string {
  return k >= 0 ? grouped(b ** k) : `\\frac{1}{${grouped(b ** -k)}}`;
}

/** families are bases that are powers of a common base b: b^1, b^2, …, b^top. */
const families: readonly { readonly b: number; readonly top: number }[] = [
  { b: 2, top: 5 },
  { b: 2, top: 5 },
  { b: 3, top: 4 },
  { b: 5, top: 3 },
];

/** linearSteps writes the steps that solve p·e1 = q·e2 for x, given the exponents as [a, c] meaning a·x + c. */
function linearSteps(left: readonly [number, number], right: readonly [number, number]): string[] {
  const [a1, c1] = left;
  const [a2, c2] = right;
  const a = a1 - a2;
  const c = c2 - c1;
  const x = Q.of(c, a);
  return [`${linear(a1, c1)} = ${linear(a2, c2)}`, ...(a === 1 ? [] : [`${linear(a, 0)} = ${c}`]), `x = ${x.toLatex()}`];
}

/** rewriteEquation draws (b^p)^(a1·x + c1) = (b^q)^(a2·x + c2) whose solution is an integer (whole) or not. */
function rewriteEquation(rng: Rng, whole: boolean) {
  for (;;) {
    const { b, top } = rng.pick(families);
    const [p, q] = rng.sample(
      Array.from({ length: top }, (_, i) => i + 1),
      2,
    ) as [number, number];
    const [a1, a2] = [rng.int(1, 3), rng.int(1, 3)];
    const [c1, c2] = [rng.int(-5, 5), rng.int(-5, 5)];
    const den = p * a1 - q * a2;
    if (den === 0) continue;
    const x = Q.of(q * c2 - p * c1, den);
    if (x.isInteger() !== whole || (!whole && x.d > 12n) || x.abs().cmp(Q.of(12)) > 0) continue;
    return { b, p, q, a1, a2, c1, c2, x };
  }
}

export const solvingExponentialEquations: TopicDef = {
  id: "solving-exponential-equations",
  title: t("Solving Exponential Equations", "解指数方程"),
  summary: t(
    "Solve equations such as $4^{x + 1} = 8^{x}$ by writing both sides as powers of the same base.",
    "把两边写成同底数的幂，解 $4^{x + 1} = 8^{x}$ 这样的方程。",
  ),
  prerequisites: ["power-rule-with-algebraic-expressions", "equations-with-parentheses"],
  encompasses: [
    { topic: "equations-with-parentheses", weight: 0.3 },
    { topic: "power-rule-with-algebraic-expressions", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.CED.A.1", "CCSS.HSA.REI.B.3"],
  knowledgePoints: [
    {
      id: "equating-exponents",
      title: t("Equating exponents", "令指数相等"),
      explanation: t(
        "In an **exponential equation** the unknown is in an exponent. If two powers of the same base (other than $0$, $1$ and $-1$) are equal, their exponents are equal:\n\n$$b^{m} = b^{n} \\implies m = n$$\n\nTo solve $3^{2x - 1} = 243$, write $243$ as a power of $3$, then solve the equation of the exponents:\n\n$$3^{2x - 1} = 3^{5} \\implies 2x - 1 = 5 \\implies x = 3$$\n\nFractions are negative powers: $\\frac{1}{8} = 2^{-3}$, and $1 = b^{0}$.",
        "未知数在指数中的方程叫做**指数方程**。同底数（不为 $0$、$1$、$-1$）的两个幂相等时，它们的指数相等：\n\n$$b^{m} = b^{n} \\implies m = n$$\n\n解 $3^{2x - 1} = 243$ 时，先把 $243$ 写成 $3$ 的幂，再解关于指数的方程：\n\n$$3^{2x - 1} = 3^{5} \\implies 2x - 1 = 5 \\implies x = 3$$\n\n分数是负指数幂：$\\frac{1}{8} = 2^{-3}$，而 $1 = b^{0}$。",
      ),
      generate(rng) {
        const b = rng.pick([2, 2, 3, 3, 5, 6, 7, 10]);
        let a: number;
        let x: number;
        let k: number;
        let c: number;
        do {
          a = rng.pick([1, 1, 2, 3]);
          x = rng.int(-4, 6);
          k = rng.int(-3, maxExp[b]!);
          c = k - a * x;
        } while (Math.abs(c) > 9 || (a === 1 && c === 0));
        const e = linear(a, c);
        const v = powerValue(b, k);
        return numberProblem({
          prompt: t(`Solve $${b}^{${e}} = ${v}$.`, `解方程 $${b}^{${e}} = ${v}$。`),
          answer: x,
          solveFor: "x",
          wrong: [k, Q.of(k + c, a), k - c],
          solution: t(
            `Write $${v}$ as a power of $${b}$, then set the exponents equal:${steps(`${b}^{${e}} = ${b}^{${k}}`, ...linearSteps([a, c], [0, k]))}`,
            `把 $${v}$ 写成 $${b}$ 的幂，再令指数相等：${steps(`${b}^{${e}} = ${b}^{${k}}`, ...linearSteps([a, c], [0, k]))}`,
          ),
        });
      },
    },
    {
      id: "same-base-on-both-sides",
      title: t("The same base on both sides", "两边底数相同"),
      explanation: t(
        "When both sides are already powers of the same base, set the exponents equal and solve the linear equation:\n\n$$5^{3x - 4} = 5^{x + 2} \\implies 3x - 4 = x + 2 \\implies 2x = 6 \\implies x = 3$$",
        "两边已经是同底数的幂时，令指数相等，再解一元一次方程：\n\n$$5^{3x - 4} = 5^{x + 2} \\implies 3x - 4 = x + 2 \\implies 2x = 6 \\implies x = 3$$",
      ),
      generate(rng) {
        const b = rng.pick([2, 3, 4, 5, 6, 7, 9, 10]);
        let a1: number;
        let a2: number;
        let x: number;
        let c1: number;
        let c2: number;
        do {
          [a1, a2, x, c1] = [rng.int(1, 5), rng.int(1, 5), rng.int(-6, 6), rng.int(-9, 9)];
          c2 = (a1 - a2) * x + c1;
        } while (a1 === a2 || Math.abs(c2) > 12);
        const e1 = linear(a1, c1);
        const e2 = linear(a2, c2);
        return numberProblem({
          prompt: t(`Solve $${b}^{${e1}} = ${b}^{${e2}}$.`, `解方程 $${b}^{${e1}} = ${b}^{${e2}}$。`),
          answer: x,
          solveFor: "x",
          wrong: [Q.of(c2 + c1, a1 - a2), ...(a1 + a2 !== 0 ? [Q.of(c2 - c1, a1 + a2)] : []), -x],
          solution: t(
            `The bases are equal, so the exponents are equal:${steps(...linearSteps([a1, c1], [a2, c2]))}`,
            `底数相同，所以指数相等：${steps(...linearSteps([a1, c1], [a2, c2]))}`,
          ),
        });
      },
    },
    {
      id: "rewriting-bases",
      title: t("Rewriting the bases", "改写底数"),
      explanation: t(
        "When the bases differ, write both as powers of one base. Then the power rule multiplies out the exponents:\n\n$$4^{x + 1} = 8^{x} \\implies (2^{2})^{x + 1} = (2^{3})^{x} \\implies 2^{2x + 2} = 2^{3x} \\implies 2x + 2 = 3x \\implies x = 2$$\n\nMultiply the **whole** exponent: $(2^{2})^{x + 1}$ is $2^{2x + 2}$, not $2^{2x + 1}$.",
        "底数不同时，把两边都写成同一个底数的幂，再用幂的乘方法则展开指数：\n\n$$4^{x + 1} = 8^{x} \\implies (2^{2})^{x + 1} = (2^{3})^{x} \\implies 2^{2x + 2} = 2^{3x} \\implies 2x + 2 = 3x \\implies x = 2$$\n\n要乘以**整个**指数：$(2^{2})^{x + 1}$ 是 $2^{2x + 2}$，而不是 $2^{2x + 1}$。",
      ),
      generate(rng) {
        if (rng.bool(0.4)) {
          for (;;) {
            const { b, top } = rng.pick(families);
            const p = rng.int(2, top);
            const a = rng.int(1, 2);
            const x = rng.int(-3, 4);
            const c = rng.int(-3, 3);
            const k = p * (a * x + c);
            if (k === 0 || k < -4 || k > maxExp[b]! || (a === 1 && c === 0)) continue;
            const B = b ** p;
            const e = linear(a, c);
            const v = powerValue(b, k);
            return numberProblem({
              prompt: t(`Solve $${B}^{${e}} = ${v}$.`, `解方程 $${B}^{${e}} = ${v}$。`),
              answer: x,
              solveFor: "x",
              wrong: [Q.of(k - c, a), Q.of(k, p), Q.of(k - p * c, a)],
              solution: t(
                `Write both sides as powers of $${b}$:${steps(`(${b}^{${p}})^{${e}} = ${b}^{${k}}`, `${b}^{${linear(p * a, p * c)}} = ${b}^{${k}}`, ...linearSteps([p * a, p * c], [0, k]))}`,
                `把两边都写成 $${b}$ 的幂：${steps(`(${b}^{${p}})^{${e}} = ${b}^{${k}}`, `${b}^{${linear(p * a, p * c)}} = ${b}^{${k}}`, ...linearSteps([p * a, p * c], [0, k]))}`,
              ),
            });
          }
        }
        const { b, p, q, a1, a2, c1, c2, x } = rewriteEquation(rng, true);
        const [e1, e2] = [linear(a1, c1), linear(a2, c2)];
        const [B1, B2] = [b ** p, b ** q];
        const lhs = p === 1 ? `${b}^{${e1}}` : `(${b}^{${p}})^{${e1}}`;
        const rhs = q === 1 ? `${b}^{${e2}}` : `(${b}^{${q}})^{${e2}}`;
        return numberProblem({
          prompt: t(`Solve $${B1}^{${e1}} = ${B2}^{${e2}}$.`, `解方程 $${B1}^{${e1}} = ${B2}^{${e2}}$。`),
          answer: x,
          solveFor: "x",
          wrong: [...(a1 !== a2 ? [Q.of(c2 - c1, a1 - a2)] : []), ...(p * a1 !== q * a2 ? [Q.of(c2 - c1, p * a1 - q * a2)] : []), x.neg()],
          solution: t(
            `Write both sides as powers of $${b}$ and multiply out the exponents:${steps(`${lhs} = ${rhs}`, `${b}^{${linear(p * a1, p * c1)}} = ${b}^{${linear(q * a2, q * c2)}}`, ...linearSteps([p * a1, p * c1], [q * a2, q * c2]))}`,
            `把两边都写成 $${b}$ 的幂，并展开指数：${steps(`${lhs} = ${rhs}`, `${b}^{${linear(p * a1, p * c1)}} = ${b}^{${linear(q * a2, q * c2)}}`, ...linearSteps([p * a1, p * c1], [q * a2, q * c2]))}`,
          ),
        });
      },
    },
  ],
};

export const solvingExponentialEquationsWithFractionalSolutions: TopicDef = {
  id: "solving-exponential-equations-with-fractional-solutions",
  title: t("Solving Exponential Equations With Fractional Solutions", "解有分数解的指数方程"),
  summary: t(
    "Solve exponential equations whose solutions are fractions, such as $4^{x} = 8$ and $9^{x} = \\frac{1}{\\sqrt{3}}$.",
    "解分数解的指数方程，例如 $4^{x} = 8$ 和 $9^{x} = \\frac{1}{\\sqrt{3}}$。",
  ),
  prerequisites: ["solving-exponential-equations"],
  encompasses: [
    { topic: "solving-exponential-equations", weight: 0.6 },
    { topic: "writing-radicals-using-fractional-exponents", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.HSA.CED.A.1", "CCSS.HSN.RN.A.2"],
  knowledgePoints: [
    {
      id: "fractional-solutions",
      title: t("Fractional solutions", "分数解"),
      explanation: t(
        "The method is the same as before, but the solution may be a fraction. For $4^{x} = 8$, write both sides as powers of $2$:\n\n$$(2^{2})^{x} = 2^{3} \\implies 2x = 3 \\implies x = \\frac{3}{2}$$\n\nCheck: $4^{\\frac{3}{2}} = (\\sqrt{4})^{3} = 8$. Leave the answer as a fraction in lowest terms.",
        "方法与之前相同，只是解可能是分数。解 $4^{x} = 8$ 时，把两边都写成 $2$ 的幂：\n\n$$(2^{2})^{x} = 2^{3} \\implies 2x = 3 \\implies x = \\frac{3}{2}$$\n\n检验：$4^{\\frac{3}{2}} = (\\sqrt{4})^{3} = 8$。答案写成最简分数。",
      ),
      generate(rng) {
        let fam: { b: number; top: number };
        let p: number;
        let q: number;
        do {
          fam = rng.pick(families);
          p = rng.int(2, fam.top);
          q = rng.nonZero(-4, maxExp[fam.b]!);
        } while (q % p === 0);
        const { b } = fam;
        const B = b ** p;
        const v = powerValue(b, q);
        const x = Q.of(q, p);
        return numberProblem({
          prompt: t(`Solve $${B}^{x} = ${v}$.`, `解方程 $${B}^{x} = ${v}$。`),
          answer: x,
          solveFor: "x",
          wrong: [Q.of(p, q), x.neg(), q],
          solution: t(
            `Write both sides as powers of $${b}$:${steps(`(${b}^{${p}})^{x} = ${b}^{${q}}`, `${p}x = ${q}`, `x = ${x.toLatex()}`)}`,
            `把两边都写成 $${b}$ 的幂：${steps(`(${b}^{${p}})^{x} = ${b}^{${q}}`, `${p}x = ${q}`, `x = ${x.toLatex()}`)}`,
          ),
        });
      },
    },
    {
      id: "fractional-solutions-with-linear-exponents",
      title: t("Linear exponents", "一次式指数"),
      explanation: t(
        "With expressions in the exponents, rewrite the bases, multiply out the exponents, and solve:\n\n$$9^{x + 1} = 27^{x} \\implies 3^{2x + 2} = 3^{3x} \\implies 2x + 2 = 3x \\implies x = 2$$\n\n$$8^{2x} = 4^{x + 1} \\implies 2^{6x} = 2^{2x + 2} \\implies 4x = 2 \\implies x = \\frac{1}{2}$$",
        "指数中含代数式时，改写底数、展开指数，再求解：\n\n$$9^{x + 1} = 27^{x} \\implies 3^{2x + 2} = 3^{3x} \\implies 2x + 2 = 3x \\implies x = 2$$\n\n$$8^{2x} = 4^{x + 1} \\implies 2^{6x} = 2^{2x + 2} \\implies 4x = 2 \\implies x = \\frac{1}{2}$$",
      ),
      generate(rng) {
        const { b, p, q, a1, a2, c1, c2, x } = rewriteEquation(rng, false);
        const [e1, e2] = [linear(a1, c1), linear(a2, c2)];
        const [B1, B2] = [b ** p, b ** q];
        const lhs = p === 1 ? `${b}^{${e1}}` : `(${b}^{${p}})^{${e1}}`;
        const rhs = q === 1 ? `${b}^{${e2}}` : `(${b}^{${q}})^{${e2}}`;
        return numberProblem({
          prompt: t(`Solve $${B1}^{${e1}} = ${B2}^{${e2}}$.`, `解方程 $${B1}^{${e1}} = ${B2}^{${e2}}$。`),
          answer: x,
          solveFor: "x",
          wrong: [...(a1 !== a2 ? [Q.of(c2 - c1, a1 - a2)] : []), Q.of(q * c2 + p * c1, p * a1 - q * a2), x.neg()],
          solution: t(
            `Write both sides as powers of $${b}$ and multiply out the exponents:${steps(`${lhs} = ${rhs}`, `${b}^{${linear(p * a1, p * c1)}} = ${b}^{${linear(q * a2, q * c2)}}`, ...linearSteps([p * a1, p * c1], [q * a2, q * c2]))}`,
            `把两边都写成 $${b}$ 的幂，并展开指数：${steps(`${lhs} = ${rhs}`, `${b}^{${linear(p * a1, p * c1)}} = ${b}^{${linear(q * a2, q * c2)}}`, ...linearSteps([p * a1, p * c1], [q * a2, q * c2]))}`,
          ),
        });
      },
    },
    {
      id: "equations-with-roots",
      title: t("Equations with roots", "含根式的方程"),
      explanation: t(
        "A root is a fractional power, so it can be written as a power of the base too: $\\sqrt[3]{4} = (2^{2})^{\\frac{1}{3}} = 2^{\\frac{2}{3}}$ and $\\frac{1}{\\sqrt{3}} = 3^{-\\frac{1}{2}}$. Then\n\n$$8^{x} = \\sqrt[3]{4} \\implies 2^{3x} = 2^{\\frac{2}{3}} \\implies 3x = \\frac{2}{3} \\implies x = \\frac{2}{9}$$",
        "根式就是分数指数幂，所以它也能写成底数的幂：$\\sqrt[3]{4} = (2^{2})^{\\frac{1}{3}} = 2^{\\frac{2}{3}}$，$\\frac{1}{\\sqrt{3}} = 3^{-\\frac{1}{2}}$。于是\n\n$$8^{x} = \\sqrt[3]{4} \\implies 2^{3x} = 2^{\\frac{2}{3}} \\implies 3x = \\frac{2}{3} \\implies x = \\frac{2}{9}$$",
      ),
      keyPrerequisites: ["writing-radicals-using-fractional-exponents"],
      generate(rng) {
        let fam: { b: number; top: number };
        let n: number;
        let m: number;
        do {
          fam = rng.pick(families);
          n = rng.int(2, 4);
          m = rng.int(1, n + 2);
        } while (gcd(m, n) !== 1 || fam.b ** m > 1000);
        const { b } = fam;
        const p = rng.int(1, fam.top);
        const reciprocal = rng.bool(0.35);
        const s = reciprocal ? -1 : 1;
        const r = root(n, String(b ** m));
        const v = reciprocal ? `\\frac{1}{${r}}` : r;
        const B = b ** p;
        const x = Q.of(s * m, n * p);
        const e = fracExp(s * m, n);
        return numberProblem({
          prompt: t(`Solve $${B}^{x} = ${v}$.`, `解方程 $${B}^{x} = ${v}$。`),
          answer: x,
          solveFor: "x",
          wrong: [Q.of(s * n, m * p), Q.of(s * m, n), x.neg(), Q.of(s * m * p, n)],
          solution: t(
            `Write both sides as powers of $${b}$: $${v} = ${b}^{${e}}$${p === 1 ? "" : ` and $${B} = ${b}^{${p}}$`}. Then${steps(`${p === 1 ? b : `(${b}^{${p}})`}^{x} = ${b}^{${e}}`, `${p === 1 ? "" : p}x = ${e}`, `x = ${x.toLatex()}`)}`,
            `把两边都写成 $${b}$ 的幂：$${v} = ${b}^{${e}}$${p === 1 ? "" : `，$${B} = ${b}^{${p}}$`}。于是${steps(`${p === 1 ? b : `(${b}^{${p}})`}^{x} = ${b}^{${e}}`, `${p === 1 ? "" : p}x = ${e}`, `x = ${x.toLatex()}`)}`,
          ),
        });
      },
    },
  ],
};

/** Change is a quantity that changes by a fixed percent each period. */
interface Change {
  /** name is the letter of the function that models it. */
  readonly name: string;
  /** setup states the starting amount p and the percent r, both in LaTeX. */
  readonly setup: (p: string, r: string) => Text;
  readonly noun: Text;
  /** per is the period, as in "each year" and "每年". */
  readonly per: Text;
  /** span is the period after a count, as in "3 years" and "3 年". */
  readonly span: Text;
}

const year = { per: t("year", "年"), span: t("years", "年") };
const month = { per: t("month", "月"), span: t("months", "个月") };
const hour = { per: t("hour", "小时"), span: t("hours", "小时") };

const growths: readonly Change[] = [
  {
    name: "P",
    setup: (p, r) => t(`A town has a population of $${p}$, which grows by $${r}\\%$ each year.`, `某镇人口为 $${p}$，每年增长 $${r}\\%$。`),
    noun: t("the population", "人口"),
    ...year,
  },
  {
    name: "A",
    setup: (p, r) =>
      t(
        `An account holds $${p}$ dollars and earns $${r}\\%$ interest each year, compounded yearly.`,
        `某账户存有 $${p}$ 元，年利率为 $${r}\\%$，每年复利一次。`,
      ),
    noun: t("the balance of the account", "账户余额"),
    ...year,
  },
  {
    name: "F",
    setup: (p, r) =>
      t(
        `A channel has $${p}$ followers, and the number grows by $${r}\\%$ each month.`,
        `某频道有 $${p}$ 名关注者，人数每月增长 $${r}\\%$。`,
      ),
    noun: t("the number of followers", "关注者人数"),
    ...month,
  },
  {
    name: "V",
    setup: (p, r) =>
      t(`A house is worth $${p}$ dollars, and its value rises by $${r}\\%$ each year.`, `一套房子价值 $${p}$ 元，价值每年上涨 $${r}\\%$。`),
    noun: t("the value of the house", "房子的价值"),
    ...year,
  },
];

const decays: readonly Change[] = [
  {
    name: "V",
    setup: (p, r) =>
      t(`A car is worth $${p}$ dollars, and its value drops by $${r}\\%$ each year.`, `一辆汽车价值 $${p}$ 元，价值每年下降 $${r}\\%$。`),
    noun: t("the value of the car", "汽车的价值"),
    ...year,
  },
  {
    name: "A",
    setup: (p, r) =>
      t(
        `A patient's body holds $${p}$ mg of a medicine, and the amount decreases by $${r}\\%$ each hour.`,
        `病人体内有 $${p}$ 毫克药物，药量每小时减少 $${r}\\%$。`,
      ),
    noun: t("the amount of medicine", "药量"),
    ...hour,
  },
  {
    name: "N",
    setup: (p, r) =>
      t(`A lake has $${p}$ fish, and the number falls by $${r}\\%$ each year.`, `某湖中有 $${p}$ 条鱼，鱼的数量每年减少 $${r}\\%$。`),
    noun: t("the number of fish", "鱼的数量"),
    ...year,
  },
  {
    name: "M",
    setup: (p, r) =>
      t(
        `A club has $${p}$ members, and the number falls by $${r}\\%$ each month.`,
        `某俱乐部有 $${p}$ 名会员，会员人数每月减少 $${r}\\%$。`,
      ),
    noun: t("the number of members", "会员人数"),
    ...month,
  },
];

/** Kind is exponential growth or exponential decay. */
type Kind = "growth" | "decay";

const growthRates = [2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 50];
const decayRates = [2, 4, 5, 8, 10, 12, 15, 20, 25, 30, 40, 60];

/** draw picks a context, a percent rate and the factor 1 ± r/100 of the given kind. */
function draw(rng: Rng, kind: Kind) {
  const c = rng.pick(kind === "growth" ? growths : decays);
  const r = rng.pick(kind === "growth" ? growthRates : decayRates);
  const s = kind === "growth" ? 1 : -1;
  return { c, r, s, f: Q.of(100 + s * r, 100) };
}

/** start draws a starting amount below 10,000. */
const start = (rng: Rng) => rng.pick([rng.int(2, 99) * 100, rng.int(12, 95) * 50, rng.int(11, 99) * 10]);

/** factorProblem asks for the growth or decay factor of a percent change. */
function factorProblem(rng: Rng, kind: Kind): Problem {
  const { c, r, s, f } = draw(rng, kind);
  const setup = c.setup(String(start(rng)), String(r));
  const word = kind === "growth" ? t("Growing", "增长") : t("Decreasing", "减少");
  return numberProblem({
    prompt: t(
      `${setup.en} By what number is ${c.noun.en} multiplied each ${c.per.en}? Give it as a decimal.`,
      `${setup["zh-CN"]}${c.noun["zh-CN"]}每${c.per["zh-CN"]}乘以多少？用小数表示。`,
    ),
    answer: f,
    form: "decimal",
    wrong: [Q.of(r, 100), Q.of(r), Q.of(100 - s * r, 100), ...(r < 10 ? [Q.of(10 + s * r, 10)] : [])],
    solution: t(
      `${word.en} by $${r}\\%$ leaves $100\\% ${s > 0 ? "+" : "-"} ${r}\\% = ${100 + s * r}\\%$ of the amount, so each ${c.per.en} it is multiplied by $${dec(f)}$.`,
      `${word["zh-CN"]} $${r}\\%$ 后变为原来的 $100\\% ${s > 0 ? "+" : "-"} ${r}\\% = ${100 + s * r}\\%$，所以每${c.per["zh-CN"]}乘以 $${dec(f)}$。`,
    ),
  });
}

/** percentExpressionProblem asks for the expression a·(1 ± r)^t of a percent change. */
function percentExpressionProblem(rng: Rng, kind: Kind): Problem {
  const { c, r, s, f } = draw(rng, kind);
  const p = start(rng);
  const setup = c.setup(String(p), String(r));
  const answer = expo(p, dec(f), "t");
  return expressionProblem({
    prompt: t(
      `${setup.en} Write an expression for ${c.noun.en} after $t$ ${c.span.en}.`,
      `${setup["zh-CN"]}写出 $t$ ${c.span["zh-CN"]}后${c.noun["zh-CN"]}的表达式。`,
    ),
    answer,
    wrong: [expo(p, dec(Q.of(r, 100)), "t"), expo(p, dec(Q.of(100 - s * r, 100)), "t"), `${dec(f.mul(Q.of(p)))}t`, `(${dec(f)})^{t}`],
    solution: t(
      `Each ${c.per.en} multiplies ${c.noun.en} by $1 ${s > 0 ? "+" : "-"} ${dec(Q.of(r, 100))} = ${dec(f)}$. After $t$ ${c.span.en} it has been multiplied by $${dec(f)}$ a total of $t$ times:${steps(`${p} \\cdot \\underbrace{${dec(f)} \\cdot ${dec(f)} \\cdots ${dec(f)}}_{t} = ${answer}`)}`,
      `每${c.per["zh-CN"]}${c.noun["zh-CN"]}乘以 $1 ${s > 0 ? "+" : "-"} ${dec(Q.of(r, 100))} = ${dec(f)}$。$t$ ${c.span["zh-CN"]}后共乘了 $t$ 次 $${dec(f)}$：${steps(`${p} \\cdot \\underbrace{${dec(f)} \\cdot ${dec(f)} \\cdots ${dec(f)}}_{t} = ${answer}`)}`,
    ),
  });
}

/** Multiplier is a whole-number factor and the words for multiplying by it. */
const multipliers: readonly { readonly k: number; readonly words: Text }[] = [
  { k: 2, words: t("doubles", "翻一番") },
  { k: 2, words: t("doubles", "翻一番") },
  { k: 3, words: t("triples", "变为原来的 $3$ 倍") },
  { k: 4, words: t("quadruples", "变为原来的 $4$ 倍") },
  { k: 5, words: t("becomes $5$ times as large", "变为原来的 $5$ 倍") },
];

/** multiplyContexts describe a quantity multiplied by a whole number each period. */
const multiplyContexts: readonly { readonly setup: (a: number, m: Text) => Text; readonly what: Text }[] = [
  {
    setup: (a, m) =>
      t(
        `A culture starts with $${a}$ bacteria, and the number ${m.en} every hour.`,
        `某培养皿中起初有 $${a}$ 个细菌，细菌数量每小时${m["zh-CN"]}。`,
      ),
    what: t("the number of bacteria after $t$ hours", "$t$ 小时后的细菌数量"),
  },
  {
    setup: (a, m) =>
      t(`So far $${a}$ people have seen a video, and the number ${m.en} every day.`, `目前有 $${a}$ 人看过某视频，人数每天${m["zh-CN"]}。`),
    what: t("the number of people who have seen it after $t$ days", "$t$ 天后看过它的人数"),
  },
  {
    setup: (a, m) =>
      t(
        `A rumor is known to $${a}$ students, and the number ${m.en} every week.`,
        `有 $${a}$ 名学生知道一个传言，知道的人数每周${m["zh-CN"]}。`,
      ),
    what: t("the number of students who know it after $t$ weeks", "$t$ 周后知道它的学生人数"),
  },
];

export const creatingExponentialGrowthExpressions: TopicDef = {
  id: "creating-exponential-growth-expressions",
  title: t("Creating Exponential Growth Expressions", "建立指数增长的表达式"),
  summary: t(
    "Write expressions such as $500(1.04)^{t}$ for quantities that grow by a fixed percent or factor each period.",
    "为每期按固定百分率或倍数增长的量写出 $500(1.04)^{t}$ 这样的表达式。",
  ),
  prerequisites: ["percent-change", "powers-of-rational-numbers"],
  encompasses: [{ topic: "percent-change", weight: 0.2 }],
  xp: 12,
  standards: ["CCSS.HSF.LE.A.2", "CCSS.HSA.SSE.A.1"],
  knowledgePoints: [
    {
      id: "growth-factors",
      title: t("Growth factors", "增长因子"),
      explanation: t(
        "Increasing an amount by $6\\%$ keeps all of it, $100\\%$, and adds $6\\%$ more, so the new amount is $106\\%$ of the old one: the amount is **multiplied by** $1.06$. This number is the **growth factor**:\n\n$$\\text{growth factor} = 1 + r$$\n\nwhere $r$ is the percent written as a decimal. Increasing by $25\\%$ multiplies by $1.25$; doubling multiplies by $2$. The factor is not $0.06$ or $1.6$.",
        "把一个量增加 $6\\%$，就是保留原来的全部（$100\\%$）再加上 $6\\%$，新量是原量的 $106\\%$：也就是**乘以** $1.06$。这个数叫做**增长因子**：\n\n$$\\text{增长因子} = 1 + r$$\n\n其中 $r$ 是写成小数的百分率。增加 $25\\%$ 就是乘以 $1.25$；翻一番就是乘以 $2$。增长因子不是 $0.06$，也不是 $1.6$。",
      ),
      keyPrerequisites: ["percent-change"],
      generate: (rng) => factorProblem(rng, "growth"),
    },
    {
      id: "percent-growth-expressions",
      title: t("Percent growth", "按百分率增长"),
      explanation: t(
        "A quantity that starts at $a$ and is multiplied by the growth factor $1 + r$ every period is $a(1 + r)$ after one period, $a(1 + r)^{2}$ after two, and after $t$ periods\n\n$$a(1 + r)^{t}$$\n\nA town of $2000$ people growing by $3\\%$ a year has $2000(1.03)^{t}$ people after $t$ years. This is not $2000 \\cdot 1.03t$: the factor is applied again each year, so $t$ is an exponent.",
        "一个量起初为 $a$，每期乘以增长因子 $1 + r$，一期后为 $a(1 + r)$，两期后为 $a(1 + r)^{2}$，$t$ 期后为\n\n$$a(1 + r)^{t}$$\n\n一个 $2000$ 人的小镇，人口每年增长 $3\\%$，$t$ 年后有 $2000(1.03)^{t}$ 人。这不是 $2000 \\cdot 1.03t$：每年都要再乘一次增长因子，所以 $t$ 是指数。",
      ),
      generate: (rng) => percentExpressionProblem(rng, "growth"),
    },
    {
      id: "doubling-and-tripling",
      title: t("Doubling and tripling", "翻倍增长"),
      explanation: t(
        "Doubling multiplies by $2$, tripling by $3$. A quantity that starts at $a$ and doubles every period is $a \\cdot 2$ after one period, $a \\cdot 2 \\cdot 2$ after two, and after $t$ periods\n\n$$a(2)^{t}$$\n\nFor $40$ bacteria doubling every hour: $40(2)^{t}$. The starting amount is the coefficient, not the base: $2(40)^{t}$ would multiply by $40$ each hour.",
        "翻一番就是乘以 $2$，变为原来的 $3$ 倍就是乘以 $3$。一个量起初为 $a$，每期翻一番，一期后为 $a \\cdot 2$，两期后为 $a \\cdot 2 \\cdot 2$，$t$ 期后为\n\n$$a(2)^{t}$$\n\n$40$ 个细菌每小时翻一番：$40(2)^{t}$。起始量是系数而不是底数：$2(40)^{t}$ 表示每小时乘以 $40$。",
      ),
      generate(rng) {
        const ctx = rng.pick(multiplyContexts);
        const m = rng.pick(multipliers);
        const a = rng.int(2, 60);
        const answer = expo(a, String(m.k), "t");
        const setup = ctx.setup(a, m.words);
        return expressionProblem({
          prompt: t(`${setup.en} Write an expression for ${ctx.what.en}.`, `${setup["zh-CN"]}写出${ctx.what["zh-CN"]}的表达式。`),
          answer,
          wrong: [`${a * m.k}t`, expo(m.k, String(a), "t"), `${a * m.k}^{t}`, expo(a, String(m.k), "t - 1")],
          solution: t(
            `The quantity starts at $${a}$ and is multiplied by $${m.k}$ each period, $t$ times in all:${steps(answer)}`,
            `这个量起初为 $${a}$，每期乘以 $${m.k}$，共乘 $t$ 次：${steps(answer)}`,
          ),
        });
      },
    },
  ],
};

export const creatingExponentialDecayExpressions: TopicDef = {
  id: "creating-exponential-decay-expressions",
  title: t("Creating Exponential Decay Expressions", "建立指数衰减的表达式"),
  summary: t(
    "Write expressions such as $1000(0.85)^{t}$ for quantities that shrink by a fixed percent or fraction each period.",
    "为每期按固定百分率或比例减少的量写出 $1000(0.85)^{t}$ 这样的表达式。",
  ),
  prerequisites: ["creating-exponential-growth-expressions"],
  encompasses: [{ topic: "percent-change", weight: 0.2 }],
  xp: 12,
  standards: ["CCSS.HSF.LE.A.2", "CCSS.HSA.SSE.A.1"],
  knowledgePoints: [
    {
      id: "decay-factors",
      title: t("Decay factors", "衰减因子"),
      explanation: t(
        "Decreasing an amount by $15\\%$ leaves $100\\% - 15\\% = 85\\%$ of it, so the amount is multiplied by $0.85$. This is the **decay factor**:\n\n$$\\text{decay factor} = 1 - r$$\n\nA decay factor is between $0$ and $1$. The factor is what **remains**, not what is lost: decreasing by $15\\%$ multiplies by $0.85$, not by $0.15$.",
        "把一个量减少 $15\\%$，剩下 $100\\% - 15\\% = 85\\%$，也就是乘以 $0.85$。这个数叫做**衰减因子**：\n\n$$\\text{衰减因子} = 1 - r$$\n\n衰减因子在 $0$ 与 $1$ 之间。它表示**剩下**的部分，而不是减少的部分：减少 $15\\%$ 是乘以 $0.85$，而不是乘以 $0.15$。",
      ),
      generate: (rng) => factorProblem(rng, "decay"),
    },
    {
      id: "percent-decay-expressions",
      title: t("Percent decay", "按百分率衰减"),
      explanation: t(
        "A quantity that starts at $a$ and decreases by $r$ each period is multiplied by $1 - r$ each period, so after $t$ periods it is\n\n$$a(1 - r)^{t}$$\n\nA car worth $20000$ dollars losing $15\\%$ of its value each year is worth $20000(0.85)^{t}$ dollars after $t$ years.",
        "一个量起初为 $a$，每期减少 $r$，就是每期乘以 $1 - r$，所以 $t$ 期后为\n\n$$a(1 - r)^{t}$$\n\n一辆价值 $20000$ 元的汽车，每年贬值 $15\\%$，$t$ 年后价值 $20000(0.85)^{t}$ 元。",
      ),
      generate: (rng) => percentExpressionProblem(rng, "decay"),
    },
    {
      id: "fractional-decay",
      title: t("Fractions that remain", "按比例衰减"),
      explanation: t(
        "When a fraction is lost each period, the factor is the fraction that **remains**. A tank that loses $\\frac{1}{4}$ of its water each hour keeps $\\frac{3}{4}$, so starting from $80$ liters it holds\n\n$$80\\left(\\frac{3}{4}\\right)^{t}$$\n\nliters after $t$ hours. Halving each period gives the factor $\\frac{1}{2}$.",
        "每期失去一个比例时，因子是**剩下**的比例。一个水箱每小时流失其中 $\\frac{1}{4}$ 的水，剩下 $\\frac{3}{4}$，所以从 $80$ 升开始，$t$ 小时后有\n\n$$80\\left(\\frac{3}{4}\\right)^{t}$$\n\n升水。每期减半时，因子是 $\\frac{1}{2}$。",
      ),
      generate(rng) {
        const [p, q] = rng.pick<[number, number]>([
          [1, 2],
          [1, 3],
          [2, 3],
          [1, 4],
          [3, 4],
          [2, 5],
          [3, 5],
          [4, 5],
        ]);
        const a = rng.int(2, 40) * 10;
        const lose = rng.bool(0.5);
        const kept = lose ? Q.of(q - p, q) : Q.of(p, q);
        const lost = Q.one.sub(kept);
        const setup = lose
          ? t(
              `A tank holds $${a}$ liters of water, and each hour it loses $${num(Q.of(p, q))}$ of the water in it.`,
              `水箱中有 $${a}$ 升水，每小时流失其中的 $${num(Q.of(p, q))}$。`,
            )
          : t(
              `A ball is dropped from a height of $${a}$ cm. Each bounce reaches $${num(kept)}$ of the height of the previous one.`,
              `一个球从 $${a}$ 厘米高处落下，每次弹起的高度是前一次的 $${num(kept)}$。`,
            );
        const what = lose
          ? t("the amount of water after $t$ hours", "$t$ 小时后水箱中的水量")
          : t("the height reached on bounce number $t$", "第 $t$ 次弹起的高度");
        const answer = expo(a, num(kept), "t");
        return expressionProblem({
          prompt: t(`${setup.en} Write an expression for ${what.en}.`, `${setup["zh-CN"]}写出${what["zh-CN"]}的表达式。`),
          answer,
          wrong: [expo(a, num(lost), "t"), poly([kept.mul(Q.of(a)), "t"]), expo(a, num(Q.one.div(kept)), "t"), expo(kept, String(a), "t")],
          solution: lose
            ? t(
                `Losing $${num(lost)}$ each hour leaves $1 - ${num(lost)} = ${num(kept)}$ of the water, so the factor is $${num(kept)}$:${steps(answer)}`,
                `每小时流失 $${num(lost)}$，剩下 $1 - ${num(lost)} = ${num(kept)}$，所以因子是 $${num(kept)}$：${steps(answer)}`,
              )
            : t(
                `Each bounce multiplies the height by $${num(kept)}$, starting from $${a}$:${steps(answer)}`,
                `每次弹起，高度乘以 $${num(kept)}$，起始高度为 $${a}$：${steps(answer)}`,
              ),
        });
      },
    },
  ],
};

// Unit: exponential functions.

/** bracket writes a base for a power, in parentheses when it is a fraction or negative. */
const bracket = (b: Q) => (b.isInteger() && b.sign() > 0 ? b.toLatex() : `\\left(${b.toLatex()}\\right)`);

/** table writes a table of values of a function. */
function table(name: string, xs: readonly number[], ys: readonly Q[]): string {
  return `$$\\begin{array}{c|${"c".repeat(xs.length)}} x & ${xs.join(" & ")} \\\\ \\hline ${name}(x) & ${ys.map((y) => y.toLatex()).join(" & ")} \\end{array}$$`;
}

/** modelText states that the function name(t) = expr models the quantity of a context. */
function modelText(c: Change, expr: string): Text {
  return t(
    `${cap(c.noun.en)} after $t$ ${c.span.en} is $${c.name}(t) = ${expr}$.`,
    `$t$ ${c.span["zh-CN"]}后的${c.noun["zh-CN"]}为 $${c.name}(t) = ${expr}$。`,
  );
}

/** changeWords are the verbs of growth and decay. */
const changeWords = (kind: Kind) => (kind === "growth" ? t("increase", "增加") : t("decrease", "减少"));

/** writeModelProblem asks for the function of a quantity changing by a fixed percent, given the rate or two values. */
function writeModelProblem(rng: Rng, kind: Kind): Problem {
  const { c, r, s, f } = draw(rng, kind);
  const p = rng.int(2, 90) * 100;
  const fromValues = rng.bool(0.5);
  const next = f.mul(Q.of(p));
  const setup = fromValues
    ? t(
        `${cap(c.noun.en)} is $${grouped(p)}$ at first and $${grouped(next)}$ one ${c.per.en} later, and it changes by the same percent every ${c.per.en}.`,
        `${c.noun["zh-CN"]}起初为 $${grouped(p)}$，$1$ ${c.span["zh-CN"]}后为 $${grouped(next)}$，并且每${c.per["zh-CN"]}按相同的百分率变化。`,
      )
    : c.setup(grouped(p), String(r));
  const answer = expo(p, dec(f), "t");
  const reason = fromValues
    ? t(
        `Each ${c.per.en} ${c.noun.en} is multiplied by $\\frac{${grouped(next)}}{${grouped(p)}} = ${dec(f)}$.`,
        `每${c.per["zh-CN"]}${c.noun["zh-CN"]}乘以 $\\frac{${grouped(next)}}{${grouped(p)}} = ${dec(f)}$。`,
      )
    : t(
        `Each ${c.per.en} ${c.noun.en} is multiplied by $1 ${s > 0 ? "+" : "-"} ${dec(Q.of(r, 100))} = ${dec(f)}$.`,
        `每${c.per["zh-CN"]}${c.noun["zh-CN"]}乘以 $1 ${s > 0 ? "+" : "-"} ${dec(Q.of(r, 100))} = ${dec(f)}$。`,
      );
  return expressionProblem({
    prompt: t(
      `${setup.en} Write a function $${c.name}(t)$ for ${c.noun.en} after $t$ ${c.span.en}.`,
      `${setup["zh-CN"]}写出 $t$ ${c.span["zh-CN"]}后${c.noun["zh-CN"]}的函数 $${c.name}(t)$。`,
    ),
    answer,
    prefix: `${c.name}(t) =`,
    wrong: [expo(p, dec(Q.of(r, 100)), "t"), expo(p, dec(Q.of(100 - s * r, 100)), "t"), linear((s * p * r) / 100, p, "t")],
    solution: t(
      `${reason.en} Starting from $${grouped(p)}$:${steps(`${c.name}(t) = ${answer}`)}`,
      `${reason["zh-CN"]}起始值为 $${grouped(p)}$：${steps(`${c.name}(t) = ${answer}`)}`,
    ),
  });
}

/** evaluateModelProblem asks for the value of a percent-change model after n periods, rounded to a whole number. */
function evaluateModelProblem(rng: Rng, kind: Kind): Problem {
  const { c, r, s, f } = draw(rng, kind);
  const p = rng.int(10, 180) * 50;
  const n = rng.int(2, 5);
  const value = f.pow(n).mul(Q.of(p));
  const answer = roundQ(value);
  const expr = expo(p, dec(f), "t");
  const setup = c.setup(grouped(p), String(r));
  const model = modelText(c, expr);
  const simple = Q.of(p).mul(Q.of(100 + s * n * r, 100));
  return numberProblem({
    prompt: t(
      `${setup.en} ${model.en} Find $${c.name}(${n})$, rounded to the nearest whole number.`,
      `${setup["zh-CN"]}${model["zh-CN"]}求 $${c.name}(${n})$，结果四舍五入到整数。`,
    ),
    answer,
    wrong: [...(simple.sign() > 0 ? [roundQ(simple)] : []), roundQ(f.pow(n - 1).mul(Q.of(p))), roundQ(f.mul(Q.of(p * n)))],
    solution: t(
      `Substitute $t = ${n}$:${steps(`${c.name}(${n}) = ${p}(${dec(f)})^{${n}} = ${dec(value)} \\approx ${answer.toLatex()}`)}`,
      `代入 $t = ${n}$：${steps(`${c.name}(${n}) = ${p}(${dec(f)})^{${n}} = ${dec(value)} \\approx ${answer.toLatex()}`)}`,
    ),
  });
}

/** Periodic is a context in which a quantity is multiplied by a fixed factor every d units of time. */
interface Periodic {
  readonly unit: Text;
  readonly units: Text;
  readonly setup: (a: string, change: Text) => Text;
  readonly ask: (x: number) => Text;
  readonly when: (v: string) => Text;
}

/** every writes "every hour" or "every $3$ hours". */
function every(d: number, p: Periodic): Text {
  return d === 1 ? t(`every ${p.unit.en}`, `每${p.unit["zh-CN"]}`) : t(`every $${d}$ ${p.units.en}`, `每 $${d}$ ${p.unit["zh-CN"]}`);
}

const growthPeriodics: readonly Periodic[] = [
  {
    unit: t("hour", "小时"),
    units: t("hours", "小时"),
    setup: (a, ch) =>
      t(`A culture starts with $${a}$ bacteria, and the number ${ch.en}.`, `某培养皿中起初有 $${a}$ 个细菌，细菌数量${ch["zh-CN"]}。`),
    ask: (x) => t(`How many bacteria are there after $${x}$ hours?`, `$${x}$ 小时后有多少个细菌？`),
    when: (v) => t(`After how many hours will there be $${v}$ bacteria?`, `多少小时后细菌数量达到 $${v}$？`),
  },
  {
    unit: t("day", "天"),
    units: t("days", "天"),
    setup: (a, ch) => t(`A video has $${a}$ views, and the number of views ${ch.en}.`, `某视频有 $${a}$ 次播放，播放次数${ch["zh-CN"]}。`),
    ask: (x) => t(`How many views will it have after $${x}$ days?`, `$${x}$ 天后播放次数是多少？`),
    when: (v) => t(`After how many days will it have $${v}$ views?`, `多少天后播放次数达到 $${v}$？`),
  },
  {
    unit: t("year", "年"),
    units: t("years", "年"),
    setup: (a, ch) => t(`An investment is worth $${a}$ dollars, and its value ${ch.en}.`, `一笔投资价值 $${a}$ 元，其价值${ch["zh-CN"]}。`),
    ask: (x) => t(`What is it worth after $${x}$ years?`, `$${x}$ 年后它价值多少元？`),
    when: (v) => t(`After how many years will it be worth $${v}$ dollars?`, `多少年后它价值 $${v}$ 元？`),
  },
];

/** halfLives are contexts of decay given by a half-life of d units of time. */
const halfLives: readonly {
  readonly units: Text;
  readonly setup: (a: number, d: number) => Text;
  readonly ask: (x: number) => Text;
  readonly when: (v: string) => Text;
}[] = [
  {
    units: t("years", "年"),
    setup: (a, d) =>
      t(
        `A sample of a radioactive substance has a mass of $${a}$ g and a half-life of $${d}$ years.`,
        `某放射性物质样本的质量为 $${a}$ 克，半衰期为 $${d}$ 年。`,
      ),
    ask: (x) => t(`What mass remains after $${x}$ years?`, `$${x}$ 年后还剩多少克？`),
    when: (v) => t(`After how many years will $${v}$ g remain?`, `多少年后还剩 $${v}$ 克？`),
  },
  {
    units: t("hours", "小时"),
    setup: (a, d) =>
      t(
        `A patient takes $${a}$ mg of a medicine, which has a half-life of $${d}$ hours.`,
        `病人服用了 $${a}$ 毫克药物，该药物的半衰期为 $${d}$ 小时。`,
      ),
    ask: (x) => t(`How many milligrams remain in the body after $${x}$ hours?`, `$${x}$ 小时后体内还剩多少毫克？`),
    when: (v) => t(`After how many hours will $${v}$ mg remain?`, `多少小时后还剩 $${v}$ 毫克？`),
  },
  {
    units: t("days", "天"),
    setup: (a, d) =>
      t(
        `A medical tracer has an activity of $${a}$ units and a half-life of $${d}$ days.`,
        `某医用示踪剂的放射性活度为 $${a}$ 个单位，半衰期为 $${d}$ 天。`,
      ),
    ask: (x) => t(`What is its activity after $${x}$ days?`, `$${x}$ 天后它的活度是多少？`),
    when: (v) => t(`After how many days will its activity be $${v}$ units?`, `多少天后它的活度为 $${v}$ 个单位？`),
  },
];

const halfLifeExplanation = t(
  "The **half-life** of a substance is the time it takes for half of it to decay. After one half-life $\\frac{1}{2}$ of the amount remains, after two $\\frac{1}{4}$, and after $t$ units of time with half-life $h$ the amount is\n\n$$A(t) = a\\left(\\frac{1}{2}\\right)^{\\frac{t}{h}}$$\n\nThe exponent $\\frac{t}{h}$ counts half-lives. For $80$ g with a half-life of $5$ years, after $15$ years ($3$ half-lives) $80\\left(\\frac{1}{2}\\right)^{3} = 10$ g remain.",
  "物质衰变掉一半所需的时间叫做**半衰期**。经过一个半衰期剩下 $\\frac{1}{2}$，经过两个剩下 $\\frac{1}{4}$；半衰期为 $h$ 时，经过时间 $t$ 后的量为\n\n$$A(t) = a\\left(\\frac{1}{2}\\right)^{\\frac{t}{h}}$$\n\n指数 $\\frac{t}{h}$ 表示经过了几个半衰期。$80$ 克、半衰期为 $5$ 年的物质，$15$ 年（$3$ 个半衰期）后剩下 $80\\left(\\frac{1}{2}\\right)^{3} = 10$ 克。",
);

/** halfLifeProblem asks for the amount left after a whole number of half-lives. */
function halfLifeProblem(rng: Rng): Problem {
  const ctx = rng.pick(halfLives);
  const k = rng.int(1, 5);
  const d = rng.int(2, 12);
  const left = rng.int(1, 25);
  const a = left * 2 ** k;
  const x = k * d;
  const setup = ctx.setup(a, d);
  const ask = ctx.ask(x);
  return numberProblem({
    prompt: t(`${setup.en} ${ask.en}`, `${setup["zh-CN"]}${ask["zh-CN"]}`),
    answer: left,
    wrong: [Q.of(a, 2 * k), Q.of(a, 2 ** (k - 1)), Q.of(a, 2 ** (k + 1)), ...(a - (k * a) / 2 > 0 ? [a - (k * a) / 2] : [])],
    solution: t(
      `$${x}$ ${ctx.units.en} is $\\frac{${x}}{${d}} = ${k}$ half-lives:${steps(`${a}\\left(\\frac{1}{2}\\right)^{${k}} = \\frac{${a}}{${2 ** k}} = ${left}`)}`,
      `$${x}$ ${ctx.units["zh-CN"]}是 $\\frac{${x}}{${d}} = ${k}$ 个半衰期：${steps(`${a}\\left(\\frac{1}{2}\\right)^{${k}} = \\frac{${a}}{${2 ** k}} = ${left}`)}`,
    ),
  });
}

/** percentRateProblem asks for the percent of growth or decay per period of a model. */
function percentRateProblem(rng: Rng, kind: Kind): Problem {
  const { c, r, s, f } = draw(rng, kind);
  const p = start(rng);
  const model = modelText(c, expo(p, dec(f), "t"));
  const w = changeWords(kind);
  return numberProblem({
    prompt: t(
      `${model.en} By what percent does ${c.noun.en} ${w.en} each ${c.per.en}?`,
      `${model["zh-CN"]}${c.noun["zh-CN"]}每${c.per["zh-CN"]}${w["zh-CN"]}百分之几？`,
    ),
    answer: r,
    percent: true,
    wrong: [100 + s * r, Q.of(100 + s * r, 100), Q.of(r, 100), 100 - s * r],
    solution: t(
      `The factor is $${dec(f)} = 1 ${s > 0 ? "+" : "-"} ${dec(Q.of(r, 100))}$, so each ${c.per.en} ${c.noun.en} ${s > 0 ? "increases" : "decreases"} by $${dec(Q.of(r, 100))} = ${r}\\%$.`,
      `因子为 $${dec(f)} = 1 ${s > 0 ? "+" : "-"} ${dec(Q.of(r, 100))}$，所以${c.noun["zh-CN"]}每${c.per["zh-CN"]}${w["zh-CN"]} $${dec(Q.of(r, 100))} = ${r}\\%$。`,
    ),
  });
}

/** statementProblem asks which statement about a percent-change model is true. */
function statementProblem(rng: Rng, kind: Kind): Problem {
  let d: ReturnType<typeof draw>;
  do d = draw(rng, kind);
  while (d.r === 50);
  const { c, r, s, f } = d;
  const p = start(rng);
  const model = modelText(c, expo(p, dec(f), "t"));
  const verb = kind === "growth" ? t("increases", "增加") : t("decreases", "减少");
  const by = (amount: string) =>
    t(`${cap(c.noun.en)} ${verb.en} by ${amount} each ${c.per.en}.`, `${c.noun["zh-CN"]}每${c.per["zh-CN"]}${verb["zh-CN"]} ${amount}。`);
  const options = [
    by(`$${r}\\%$`),
    by(`$${grouped(Q.of(p * r, 100))}$`),
    by(`$${100 + s * r}\\%$`),
    t(`${cap(c.noun.en)} is $${grouped(f.mul(Q.of(p)))}$ at the start.`, `起初${c.noun["zh-CN"]}为 $${grouped(f.mul(Q.of(p)))}$。`),
  ];
  const order = rng.shuffle([0, 1, 2, 3]);
  return choiceProblem({
    prompt: t(`${model.en} Which statement is true?`, `${model["zh-CN"]}下列哪个说法正确？`),
    options: order.map((i) => options[i]!),
    correct: order.indexOf(0),
    solution: t(
      `The coefficient $${p}$ is the starting value, and the factor $${dec(f)} = 1 ${s > 0 ? "+" : "-"} ${dec(Q.of(r, 100))}$ means ${c.noun.en} ${verb.en} by $${r}\\%$ each ${c.per.en}. The amount of change is not the same each ${c.per.en}: it is $${r}\\%$ of the current value.`,
      `系数 $${p}$ 是起始值，因子 $${dec(f)} = 1 ${s > 0 ? "+" : "-"} ${dec(Q.of(r, 100))}$ 表示${c.noun["zh-CN"]}每${c.per["zh-CN"]}${verb["zh-CN"]} $${r}\\%$。每${c.per["zh-CN"]}变化的数量并不相同：它是当前值的 $${r}\\%$。`,
    ),
  });
}

/** totalChangeProblem asks for the total percent change of a model over several periods. */
function totalChangeProblem(rng: Rng, kind: Kind): Problem {
  const n = rng.pick([2, 2, 3]);
  let d: ReturnType<typeof draw>;
  do d = draw(rng, kind);
  while (n === 3 && ![10, 20, 30, 50].includes(d.r));
  const { c, r, s, f } = d;
  const p = start(rng);
  const fn = f.pow(n);
  const total = fn.sub(Q.one).abs().mul(Q.of(100));
  const model = modelText(c, expo(p, dec(f), "t"));
  const w = changeWords(kind);
  return numberProblem({
    prompt: t(
      `${model.en} By what percent does ${c.noun.en} ${w.en} in total over $${n}$ ${c.span.en}?`,
      `${model["zh-CN"]}${n} ${c.span["zh-CN"]}内${c.noun["zh-CN"]}一共${w["zh-CN"]}百分之几？`,
    ),
    answer: total,
    percent: true,
    ...(total.isInteger() ? {} : { form: "decimal" as const }),
    wrong: [n * r, fn.mul(Q.of(100)), fn],
    solution: t(
      `Over $${n}$ ${c.span.en} the value is multiplied by $(${dec(f)})^{${n}} = ${dec(fn)}$, which is a${s > 0 ? "n increase" : " decrease"} of $${dec(total)}\\%$. It is not $${n} \\cdot ${r}\\%$, because each ${c.per.en}'s change applies to the value already changed.`,
      `$${n}$ ${c.span["zh-CN"]}内数值乘以 $(${dec(f)})^{${n}} = ${dec(fn)}$，即${w["zh-CN"]}了 $${dec(total)}\\%$。它不是 $${n} \\cdot ${r}\\%$，因为每${c.per["zh-CN"]}的变化都作用在已经变化后的数值上。`,
    ),
  });
}

/** niceFactor draws a factor 1 ± r/100 and a starting amount p whose values after n periods are whole numbers. */
function niceFactor(rng: Rng, kind: Kind, n: number): { r: number; f: Q; p: number } {
  const r = rng.pick(
    kind === "growth" ? (n === 2 ? [5, 10, 20, 25, 50] : [10, 20, 25, 50]) : n === 2 ? [5, 10, 20, 25, 40, 50] : [10, 20, 40, 50],
  );
  const f = Q.of(100 + (kind === "growth" ? r : -r), 100);
  const unit = Number(f.d) ** n;
  const p = unit * rng.int(Math.max(1, Math.ceil(200 / unit)), Math.max(2, Math.floor(20000 / unit)));
  return { r, f, p };
}

/** initialValueProblem asks for the starting amount of a percent-change model from a later value. */
function initialValueProblem(rng: Rng, kind: Kind): Problem {
  const c = rng.pick(kind === "growth" ? growths : decays);
  const n = rng.pick([2, 2, 3]);
  const { r, f, p } = niceFactor(rng, kind, n);
  const s = kind === "growth" ? 1 : -1;
  const v = f.pow(n).mul(Q.of(p));
  const verb = kind === "growth" ? t("grows", "增长") : t("decreases", "减少");
  return numberProblem({
    prompt: t(
      `${cap(c.noun.en)} ${verb.en} by $${r}\\%$ each ${c.per.en}. After $${n}$ ${c.span.en} it is $${grouped(v)}$. What was it at the start?`,
      `${c.noun["zh-CN"]}每${c.per["zh-CN"]}${verb["zh-CN"]} $${r}\\%$，$${n}$ ${c.span["zh-CN"]}后为 $${grouped(v)}$。起初是多少？`,
    ),
    answer: p,
    wrong: [v.mul(f.pow(n)), ...(100 + s * n * r > 0 ? [v.div(Q.of(100 + s * n * r, 100))] : []), v.mul(Q.of(100 - s * r, 100).pow(n))],
    solution: t(
      `If $a$ is the starting value, then $a(${dec(f)})^{${n}} = ${grouped(v)}$, so${steps(`a = \\frac{${grouped(v)}}{(${dec(f)})^{${n}}} = \\frac{${grouped(v)}}{${dec(f.pow(n))}} = ${grouped(p)}`)}`,
      `设起始值为 $a$，则 $a(${dec(f)})^{${n}} = ${grouped(v)}$，所以${steps(`a = \\frac{${grouped(v)}}{(${dec(f)})^{${n}}} = \\frac{${grouped(v)}}{${dec(f.pow(n))}} = ${grouped(p)}`)}`,
    ),
  });
}

/** rateFromValuesProblem asks for the percent rate of a model from its values two periods apart. */
function rateFromValuesProblem(rng: Rng, kind: Kind): Problem {
  const c = rng.pick(kind === "growth" ? growths : decays);
  const { r, f, p } = niceFactor(rng, kind, 2);
  const v = f.pow(2).mul(Q.of(p));
  const total = f.pow(2).sub(Q.one).abs().mul(Q.of(100));
  const w = changeWords(kind);
  return numberProblem({
    prompt: t(
      `${cap(c.noun.en)} changes by the same percent every ${c.per.en}. It is $${grouped(p)}$ at first and $${grouped(v)}$ after $2$ ${c.span.en}. By what percent does it ${w.en} each ${c.per.en}?`,
      `${c.noun["zh-CN"]}每${c.per["zh-CN"]}按相同的百分率变化。起初为 $${grouped(p)}$，$2$ ${c.span["zh-CN"]}后为 $${grouped(v)}$。它每${c.per["zh-CN"]}${w["zh-CN"]}百分之几？`,
    ),
    answer: r,
    percent: true,
    wrong: [total, total.div(Q.of(2)), f.pow(2).mul(Q.of(100))],
    solution: t(
      `If $b$ is the factor, then $${grouped(p)}b^{2} = ${grouped(v)}$, so${steps(`b^{2} = \\frac{${grouped(v)}}{${grouped(p)}} = ${dec(f.pow(2))}`, `b = ${root(2, dec(f.pow(2)))} = ${dec(f)}`)}The factor $${dec(f)}$ means a${kind === "growth" ? "n increase" : " decrease"} of $${r}\\%$ each ${c.per.en}.`,
      `设因子为 $b$，则 $${grouped(p)}b^{2} = ${grouped(v)}$，所以${steps(`b^{2} = \\frac{${grouped(v)}}{${grouped(p)}} = ${dec(f.pow(2))}`, `b = ${root(2, dec(f.pow(2)))} = ${dec(f)}`)}因子 $${dec(f)}$ 表示每${c.per["zh-CN"]}${w["zh-CN"]} $${r}\\%$。`,
    ),
  });
}

/** evalBases are the bases of exponential functions to evaluate. */
const evalBases = [Q.of(2), Q.of(3), Q.of(4), Q.of(5), Q.of(1, 2), Q.of(1, 3), Q.of(1, 4), Q.of(2, 3), Q.of(3, 2)];

export const exponentialFunctions: TopicDef = {
  id: "exponential-functions",
  title: t("Exponential Functions", "指数函数"),
  summary: t(
    "Recognize and evaluate exponential functions $f(x) = a \\cdot b^{x}$, and find one from a table of values.",
    "识别并计算指数函数 $f(x) = a \\cdot b^{x}$ 的值，并能根据数值表求出它。",
  ),
  prerequisites: ["representations-of-functions", "zero-and-negative-exponents"],
  encompasses: [{ topic: "zero-and-negative-exponents", weight: 0.2 }],
  xp: 12,
  standards: ["CCSS.HSF.IF.A.2", "CCSS.HSF.LE.A.2"],
  knowledgePoints: [
    {
      id: "evaluating-exponential-functions",
      title: t("Evaluating exponential functions", "计算指数函数的值"),
      explanation: t(
        "An **exponential function** has the variable in the exponent:\n\n$$f(x) = a \\cdot b^{x} \\qquad (a \\ne 0,\\; b > 0,\\; b \\ne 1)$$\n\nTo evaluate it, compute the power first, then multiply by $a$: for $f(x) = 3(2)^{x}$, $f(-2) = 3 \\cdot 2^{-2} = 3 \\cdot \\frac{1}{4} = \\frac{3}{4}$. The base alone is raised to the power: $3(2)^{x}$ is not $6^{x}$.",
        "变量在指数中的函数叫做**指数函数**：\n\n$$f(x) = a \\cdot b^{x} \\qquad (a \\ne 0,\\; b > 0,\\; b \\ne 1)$$\n\n求值时先算乘方，再乘以 $a$：对 $f(x) = 3(2)^{x}$，$f(-2) = 3 \\cdot 2^{-2} = 3 \\cdot \\frac{1}{4} = \\frac{3}{4}$。只有底数被乘方：$3(2)^{x}$ 不是 $6^{x}$。",
      ),
      keyPrerequisites: ["zero-and-negative-exponents"],
      generate(rng) {
        let a: number;
        let b: Q;
        let x: number;
        do {
          a = rng.pick([1, 2, 3, 4, 5, 6, -2, -3]);
          b = rng.pick(evalBases);
          x = rng.int(-3, 4);
        } while (b.pow(x).n > 625n || b.pow(x).d > 625n || (a === 1 && x === 1));
        const name = rng.pick(["f", "g", "h"]);
        const value = b.pow(x).mul(Q.of(a));
        return numberProblem({
          prompt: t(
            `Let $${name}(x) = ${expo(a, num(b))}$. Find $${name}(${x})$.`,
            `设 $${name}(x) = ${expo(a, num(b))}$，求 $${name}(${x})$。`,
          ),
          answer: value,
          wrong: [b.mul(Q.of(a)).pow(x), b.mul(Q.of(a * x)), b.pow(-x).mul(Q.of(a))],
          solution: t(
            `Compute the power first, then multiply by $${a}$:${steps(`${name}(${x}) = ${a} \\cdot ${bracket(b)}^{${x}} = ${a} \\cdot ${b.pow(x).toLatex()} = ${value.toLatex()}`)}`,
            `先算乘方，再乘以 $${a}$：${steps(`${name}(${x}) = ${a} \\cdot ${bracket(b)}^{${x}} = ${a} \\cdot ${b.pow(x).toLatex()} = ${value.toLatex()}`)}`,
          ),
        });
      },
    },
    {
      id: "recognizing-exponential-functions",
      title: t("Recognizing exponential functions", "识别指数函数"),
      explanation: t(
        "In $f(x) = a \\cdot b^{x}$ the variable is the **exponent**, and the base is a fixed number with $b > 0$ and $b \\ne 1$.\n\n- $y = 4(3)^{x}$ is exponential.\n- $y = 4x^{3}$ is not: the variable is the base.\n- $y = 3x + 4$ is linear.\n- $y = 4(1)^{x}$ is the constant $4$, and $(-3)^{x}$ is not allowed, since $(-3)^{\\frac{1}{2}}$ is not a real number.",
        "在 $f(x) = a \\cdot b^{x}$ 中，变量是**指数**，底数是固定的数，且 $b > 0$、$b \\ne 1$。\n\n- $y = 4(3)^{x}$ 是指数函数。\n- $y = 4x^{3}$ 不是：变量是底数。\n- $y = 3x + 4$ 是一次函数。\n- $y = 4(1)^{x}$ 就是常数 $4$；$(-3)^{x}$ 不允许，因为 $(-3)^{\\frac{1}{2}}$ 不是实数。",
      ),
      generate(rng) {
        const a = rng.int(2, 9);
        const b = rng.pick(evalBases);
        const k = rng.int(2, 5);
        const options = [
          `y = ${expo(a, num(b))}`,
          `y = ${a}x^{${k}}`,
          `y = ${linear(k, a)}`,
          rng.bool() ? `y = ${a}(1)^{x}` : `y = ${a}(-${k})^{x}`,
        ];
        const which = rng.int(0, 3);
        const shown = options[which]!;
        const reasons = [
          t("Yes", "是"),
          t("No: the variable is the base, not the exponent", "不是：变量是底数，而不是指数"),
          t("No: it is a linear function", "不是：它是一次函数"),
          t("No: the base must be positive and not $1$", "不是：底数必须为正且不等于 $1$"),
        ];
        const explain = [
          t(
            `The variable is the exponent and the base $${b.toLatex()}$ is positive and not $1$, so it is exponential.`,
            `变量是指数，底数 $${b.toLatex()}$ 为正且不等于 $1$，所以它是指数函数。`,
          ),
          t(
            `In $${shown}$ the variable $x$ is the base and the exponent is the fixed number $${k}$.`,
            `在 $${shown}$ 中变量 $x$ 是底数，指数是固定的数 $${k}$。`,
          ),
          t(
            `$${shown}$ adds $${k}$ each time $x$ goes up by $1$: it is linear.`,
            `$x$ 每增加 $1$，$${shown}$ 就增加 $${k}$：它是一次函数。`,
          ),
          t(
            `The base ${shown.includes("(1)") ? "$1$ makes it the constant function" : "is negative, so for some exponents such as $\\frac{1}{2}$ there is no real value"}${shown.includes("(1)") ? ` $y = ${a}$` : ""}.`,
            `底数${shown.includes("(1)") ? `为 $1$，函数就是常数函数 $y = ${a}$` : "为负数，对 $\\frac{1}{2}$ 等指数没有实数值"}。`,
          ),
        ];
        return choiceProblem({
          prompt: t(`Is $${shown}$ an exponential function?`, `$${shown}$ 是指数函数吗？`),
          options: reasons,
          correct: which,
          solution: explain[which]!,
        });
      },
    },
    {
      id: "exponential-functions-from-tables",
      title: t("Finding the function from a table", "由数值表求函数"),
      explanation: t(
        "In a table of an exponential function, each time $x$ goes up by $1$ the value is **multiplied** by the same number $b$. So $b$ is the ratio of consecutive values, and $a = f(0)$.\n\n$$\\begin{array}{c|cccc} x & 0 & 1 & 2 & 3 \\\\ \\hline f(x) & 5 & 15 & 45 & 135 \\end{array}$$\n\nHere $b = \\frac{15}{5} = 3$ and $a = 5$, so $f(x) = 5(3)^{x}$. If the table does not show $x = 0$, step back from a known value: $f(0) = \\frac{f(1)}{b}$.",
        "指数函数的数值表中，$x$ 每增加 $1$，函数值就**乘以**同一个数 $b$。所以 $b$ 是相邻两个函数值之比，而 $a = f(0)$。\n\n$$\\begin{array}{c|cccc} x & 0 & 1 & 2 & 3 \\\\ \\hline f(x) & 5 & 15 & 45 & 135 \\end{array}$$\n\n这里 $b = \\frac{15}{5} = 3$，$a = 5$，所以 $f(x) = 5(3)^{x}$。如果表中没有 $x = 0$，就从已知值往回推：$f(0) = \\frac{f(1)}{b}$。",
      ),
      generate(rng) {
        const b = rng.pick([Q.of(2), Q.of(2), Q.of(3), Q.of(4), Q.of(1, 2), Q.of(1, 3)]);
        const s = rng.pick([0, 0, 1, -1]);
        const xs = [s, s + 1, s + 2, s + 3];
        const den = Number(b.d) ** Math.max(0, s + 3);
        const num0 = Number(b.n) ** Math.max(0, -s);
        const a = rng.int(1, b.d > 1n ? 3 : 6) * den * num0;
        const ys = xs.map((x) => b.pow(x).mul(Q.of(a)));
        const answer = expo(a, num(b));
        const y0 = ys[0]!;
        const y1 = ys[1]!;
        return expressionProblem({
          prompt: t(
            `The table shows values of an exponential function $f(x) = a \\cdot b^{x}$. Find $f(x)$.${table("f", xs, ys)}`,
            `下表给出指数函数 $f(x) = a \\cdot b^{x}$ 的一些值。求 $f(x)$。${table("f", xs, ys)}`,
          ),
          answer,
          prefix: "f(x) =",
          wrong: [expo(b, String(a)), linear(y1.sub(y0), y0.sub(y1.sub(y0).mul(Q.of(s)))), expo(y0, num(b)), expo(a, num(Q.one.div(b)))],
          solution: t(
            `Each step multiplies by $b = \\frac{${y1.toLatex()}}{${y0.toLatex()}} = ${b.toLatex()}$, and $a = f(0) = ${a}$. So${steps(`f(x) = ${answer}`)}`,
            `每一步都乘以 $b = \\frac{${y1.toLatex()}}{${y0.toLatex()}} = ${b.toLatex()}$，而 $a = f(0) = ${a}$。所以${steps(`f(x) = ${answer}`)}`,
          ),
        });
      },
    },
  ],
};

export const modelingExponentialGrowthWithFunctions: TopicDef = {
  id: "modeling-exponential-growth-with-functions",
  title: t("Modeling Exponential Growth With Functions", "用函数表示指数增长"),
  summary: t(
    "Write and evaluate functions $P(t) = a(1 + r)^{t}$ and doubling models for quantities that grow exponentially.",
    "为指数增长的量写出并计算函数 $P(t) = a(1 + r)^{t}$ 以及翻倍模型。",
  ),
  prerequisites: ["exponential-functions", "creating-exponential-growth-expressions"],
  encompasses: [
    { topic: "creating-exponential-growth-expressions", weight: 0.5 },
    { topic: "exponential-functions", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.LE.A.2", "CCSS.HSF.LE.A.1.C"],
  knowledgePoints: [
    {
      id: "writing-growth-functions",
      title: t("Writing growth functions", "写出增长函数"),
      explanation: t(
        "A quantity that starts at $a$ and grows by the same percent $r$ every period is modeled by\n\n$$P(t) = a(1 + r)^{t}$$\n\nwhere $t$ counts the periods. When two values one period apart are given instead of the rate, their ratio is the growth factor: from $2000$ to $2100$ the factor is $\\frac{2100}{2000} = 1.05$, so $P(t) = 2000(1.05)^{t}$.",
        "一个量起初为 $a$，每期按相同的百分率 $r$ 增长，可以用\n\n$$P(t) = a(1 + r)^{t}$$\n\n表示，其中 $t$ 是期数。如果给出的是相隔一期的两个值而不是增长率，它们的比就是增长因子：从 $2000$ 到 $2100$，因子是 $\\frac{2100}{2000} = 1.05$，所以 $P(t) = 2000(1.05)^{t}$。",
      ),
      generate: (rng) => writeModelProblem(rng, "growth"),
    },
    {
      id: "evaluating-growth-models",
      title: t("Evaluating growth models", "计算增长模型的值"),
      explanation: t(
        "To find the value after $n$ periods, substitute $t = n$ and compute the power before multiplying:\n\n$$P(3) = 1500(1.04)^{3} = 1500 \\cdot 1.124864 = 1687.296 \\approx 1687$$\n\nThis is more than $1500 + 3 \\cdot 60 = 1680$, which would be growth by the same amount each year: the growth itself grows.",
        "求 $n$ 期后的值，就把 $t = n$ 代入，先算乘方再相乘：\n\n$$P(3) = 1500(1.04)^{3} = 1500 \\cdot 1.124864 = 1687.296 \\approx 1687$$\n\n这比 $1500 + 3 \\cdot 60 = 1680$ 多；后者是每年增加相同数量的情形。指数增长中，增加的量本身也在增长。",
      ),
      generate: (rng) => evaluateModelProblem(rng, "growth"),
    },
    {
      id: "doubling-time-models",
      title: t("Doubling time", "翻倍时间"),
      explanation: t(
        "If a quantity doubles every $d$ hours, then in $t$ hours it doubles $\\frac{t}{d}$ times:\n\n$$N(t) = a(2)^{\\frac{t}{d}}$$\n\n$300$ bacteria that double every $4$ hours number $300 \\cdot 2^{\\frac{12}{4}} = 300 \\cdot 2^{3} = 2400$ after $12$ hours. Tripling works the same way with base $3$.",
        "如果一个量每 $d$ 小时翻一番，那么 $t$ 小时内它翻了 $\\frac{t}{d}$ 番：\n\n$$N(t) = a(2)^{\\frac{t}{d}}$$\n\n$300$ 个细菌每 $4$ 小时翻一番，$12$ 小时后有 $300 \\cdot 2^{\\frac{12}{4}} = 300 \\cdot 2^{3} = 2400$ 个。变为原来的 $3$ 倍时同理，底数为 $3$。",
      ),
      generate(rng) {
        const ctx = rng.pick(growthPeriodics);
        const m = rng.pick(multipliers.slice(0, 3));
        const d = rng.int(2, 6);
        const k = rng.int(2, m.k === 2 ? 5 : 4);
        const a = rng.int(2, 50) * 10;
        const x = k * d;
        const setup = ctx.setup(String(a), t(`${m.words.en} ${every(d, ctx).en}`, `${every(d, ctx)["zh-CN"]}${m.words["zh-CN"]}`));
        const ask = ctx.ask(x);
        const value = a * m.k ** k;
        return numberProblem({
          prompt: t(`${setup.en} ${ask.en}`, `${setup["zh-CN"]}${ask["zh-CN"]}`),
          answer: value,
          wrong: [...(x <= 12 ? [Q.of(a).mul(Q.of(m.k).pow(x))] : []), a * m.k * k, a * m.k ** (k - 1), a * m.k ** (k + 1)],
          solution: t(
            `In $${x}$ ${ctx.units.en} the quantity is multiplied by $${m.k}$ a total of $\\frac{${x}}{${d}} = ${k}$ times:${steps(`${a} \\cdot ${m.k}^{${k}} = ${a} \\cdot ${m.k ** k} = ${value}`)}`,
            `$${x}$ ${ctx.units["zh-CN"]}内这个量共乘了 $\\frac{${x}}{${d}} = ${k}$ 次 $${m.k}$：${steps(`${a} \\cdot ${m.k}^{${k}} = ${a} \\cdot ${m.k ** k} = ${value}`)}`,
          ),
        });
      },
    },
  ],
};

export const interpretingExponentialGrowth: TopicDef = {
  id: "interpreting-exponential-growth",
  title: t("Interpreting Exponential Growth", "解读指数增长"),
  summary: t(
    "Read the starting value, the growth factor and the percent rate from a growth model, and find the total growth over several periods.",
    "从增长模型中读出起始值、增长因子和增长率，并求若干期内的总增长率。",
  ),
  prerequisites: ["modeling-exponential-growth-with-functions"],
  encompasses: [{ topic: "percent-change", weight: 0.2 }],
  xp: 12,
  standards: ["CCSS.HSF.LE.B.5", "CCSS.HSF.IF.C.8.B"],
  knowledgePoints: [
    {
      id: "starting-value-and-growth-factor",
      title: t("Starting value and growth factor", "起始值与增长因子"),
      explanation: t(
        "In $P(t) = a \\cdot b^{t}$:\n\n- $a = P(0)$ is the **starting value**, since $b^{0} = 1$;\n- $b$ is the **growth factor**, the number the quantity is multiplied by each period.\n\nFor $P(t) = 350(1.12)^{t}$, the quantity starts at $350$ and is multiplied by $1.12$ each period. After one period it is $350 \\cdot 1.12 = 392$, which is not the starting value.",
        "在 $P(t) = a \\cdot b^{t}$ 中：\n\n- $a = P(0)$ 是**起始值**，因为 $b^{0} = 1$；\n- $b$ 是**增长因子**，即这个量每期所乘的数。\n\n对 $P(t) = 350(1.12)^{t}$，这个量起初为 $350$，每期乘以 $1.12$。一期后为 $350 \\cdot 1.12 = 392$，它不是起始值。",
      ),
      generate(rng) {
        const { c, r, f } = draw(rng, "growth");
        const p = start(rng);
        const model = modelText(c, expo(p, dec(f), "t"));
        if (rng.bool()) {
          return numberProblem({
            prompt: t(`${model.en} What was ${c.noun.en} at the start?`, `${model["zh-CN"]}起初${c.noun["zh-CN"]}是多少？`),
            answer: p,
            wrong: [f, f.mul(Q.of(p)), r],
            solution: t(
              `At the start $t = 0$, and $(${dec(f)})^{0} = 1$:${steps(`${c.name}(0) = ${p}(${dec(f)})^{0} = ${p}`)}`,
              `起初 $t = 0$，而 $(${dec(f)})^{0} = 1$：${steps(`${c.name}(0) = ${p}(${dec(f)})^{0} = ${p}`)}`,
            ),
          });
        }
        return numberProblem({
          prompt: t(
            `${model.en} By what number is ${c.noun.en} multiplied each ${c.per.en}?`,
            `${model["zh-CN"]}${c.noun["zh-CN"]}每${c.per["zh-CN"]}乘以多少？`,
          ),
          answer: f,
          form: "decimal",
          wrong: [Q.of(r, 100), Q.of(r), Q.of(p)],
          solution: t(
            `The base $${dec(f)}$ is the growth factor: each ${c.per.en}, ${c.noun.en} is multiplied by $${dec(f)}$.`,
            `底数 $${dec(f)}$ 是增长因子：${c.noun["zh-CN"]}每${c.per["zh-CN"]}乘以 $${dec(f)}$。`,
          ),
        });
      },
    },
    {
      id: "percent-growth-rate",
      title: t("The percent growth rate", "增长率"),
      explanation: t(
        "The growth factor is $b = 1 + r$, so the percent growth rate is $r = b - 1$, written as a percent. For $P(t) = 800(1.07)^{t}$ the rate is $0.07 = 7\\%$ per period; for $P(t) = 50(1.5)^{t}$ it is $50\\%$; for $P(t) = 9(2)^{t}$ it is $100\\%$ (doubling). The rate is not $107\\%$: that is the new amount as a percent of the old one.",
        "增长因子 $b = 1 + r$，所以增长率 $r = b - 1$，写成百分数。对 $P(t) = 800(1.07)^{t}$，增长率为每期 $0.07 = 7\\%$；对 $P(t) = 50(1.5)^{t}$ 为 $50\\%$；对 $P(t) = 9(2)^{t}$ 为 $100\\%$（翻一番）。增长率不是 $107\\%$：那是新量占原量的百分比。",
      ),
      generate: (rng) => percentRateProblem(rng, "growth"),
    },
    {
      id: "interpreting-growth-statements",
      title: t("Interpreting the model", "解读模型"),
      explanation: t(
        "For $V(t) = 1200(1.08)^{t}$, where $t$ is in years:\n\n- the value starts at $1200$;\n- it grows by $8\\%$ each year.\n\nIt does **not** grow by $8$ or by $96$ dollars every year: $8\\%$ of a growing value is a growing amount. And it does not grow by $108\\%$, which would more than double it.",
        "对 $V(t) = 1200(1.08)^{t}$（$t$ 以年为单位）：\n\n- 起始值为 $1200$；\n- 每年增长 $8\\%$。\n\n它**不是**每年增加 $8$ 元或 $96$ 元：不断增长的值的 $8\\%$ 也在不断增长。它也不是每年增长 $108\\%$，那会使它变为原来的两倍多。",
      ),
      generate: (rng) => statementProblem(rng, "growth"),
    },
    {
      id: "growth-over-several-periods",
      title: t("Growth over several periods", "若干期内的增长"),
      explanation: t(
        "Over $n$ periods the quantity is multiplied by $b^{n}$. For a growth of $10\\%$ a year, in $2$ years the factor is $1.1^{2} = 1.21$: the total growth is $21\\%$, not $20\\%$, because the second year's $10\\%$ is taken of a larger amount.",
        "$n$ 期内这个量乘以 $b^{n}$。每年增长 $10\\%$，$2$ 年内的因子是 $1.1^{2} = 1.21$：总增长率是 $21\\%$ 而不是 $20\\%$，因为第二年的 $10\\%$ 是对更大的量取的。",
      ),
      generate: (rng) => totalChangeProblem(rng, "growth"),
    },
  ],
};

export const solvingExponentialGrowthProblems: TopicDef = {
  id: "solving-exponential-growth-problems",
  title: t("Solving Exponential Growth Problems", "解指数增长问题"),
  summary: t(
    "Find the time, the starting value or the growth rate in exponential growth problems.",
    "在指数增长问题中求时间、起始值或增长率。",
  ),
  prerequisites: ["interpreting-exponential-growth", "solving-exponential-equations"],
  encompasses: [
    { topic: "solving-exponential-equations", weight: 0.3 },
    { topic: "modeling-exponential-growth-with-functions", weight: 0.4 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.CED.A.1", "CCSS.HSF.LE.A.2"],
  knowledgePoints: [
    {
      id: "finding-the-time",
      title: t("Finding the time", "求时间"),
      explanation: t(
        "To find when a quantity reaches a value, set the model equal to it and solve the exponential equation. $250$ bacteria doubling every $3$ hours reach $8000$ when\n\n$$250 \\cdot 2^{\\frac{t}{3}} = 8000 \\implies 2^{\\frac{t}{3}} = 32 = 2^{5} \\implies \\frac{t}{3} = 5 \\implies t = 15$$\n\nDivide by the starting value first; the number of doublings, $5$, is not yet the time.",
        "求一个量何时达到某个值，就令模型等于这个值，解指数方程。$250$ 个细菌每 $3$ 小时翻一番，达到 $8000$ 个时\n\n$$250 \\cdot 2^{\\frac{t}{3}} = 8000 \\implies 2^{\\frac{t}{3}} = 32 = 2^{5} \\implies \\frac{t}{3} = 5 \\implies t = 15$$\n\n先除以起始值；翻番的次数 $5$ 还不是时间。",
      ),
      generate(rng) {
        const ctx = rng.pick(growthPeriodics);
        const m = rng.pick(multipliers.slice(0, 3));
        const d = rng.int(1, 6);
        const k = rng.int(2, m.k === 2 ? 6 : 4);
        const a = rng.int(2, 50) * 10;
        const v = a * m.k ** k;
        const setup = ctx.setup(String(a), t(`${m.words.en} ${every(d, ctx).en}`, `${every(d, ctx)["zh-CN"]}${m.words["zh-CN"]}`));
        const when = ctx.when(grouped(v));
        return numberProblem({
          prompt: t(`${setup.en} ${when.en}`, `${setup["zh-CN"]}${when["zh-CN"]}`),
          answer: k * d,
          wrong: [k, m.k ** k, (k + 1) * d, (k - 1) * d],
          solution: t(
            `Solve $${a} \\cdot ${m.k}^{${d === 1 ? "t" : `\\frac{t}{${d}}`}} = ${grouped(v)}$:${steps(`${m.k}^{${d === 1 ? "t" : `\\frac{t}{${d}}`}} = \\frac{${grouped(v)}}{${a}} = ${m.k ** k} = ${m.k}^{${k}}`, d === 1 ? `t = ${k}` : `\\frac{t}{${d}} = ${k} \\implies t = ${k * d}`)}`,
            `解方程 $${a} \\cdot ${m.k}^{${d === 1 ? "t" : `\\frac{t}{${d}}`}} = ${grouped(v)}$：${steps(`${m.k}^{${d === 1 ? "t" : `\\frac{t}{${d}}`}} = \\frac{${grouped(v)}}{${a}} = ${m.k ** k} = ${m.k}^{${k}}`, d === 1 ? `t = ${k}` : `\\frac{t}{${d}} = ${k} \\implies t = ${k * d}`)}`,
          ),
        });
      },
    },
    {
      id: "finding-the-starting-value",
      title: t("Finding the starting value", "求起始值"),
      explanation: t(
        "If the value after $n$ periods and the rate are known, the starting value $a$ satisfies $a \\cdot b^{n} = \\text{value}$, so divide by $b^{n}$:\n\n$$a(1.1)^{3} = 1331 \\implies a = \\frac{1331}{1.331} = 1000$$\n\nDividing by $1 + 3 \\cdot 0.1 = 1.3$ instead would treat the growth as if it were the same amount each period.",
        "已知 $n$ 期后的值和增长率时，起始值 $a$ 满足 $a \\cdot b^{n} = \\text{该值}$，所以除以 $b^{n}$：\n\n$$a(1.1)^{3} = 1331 \\implies a = \\frac{1331}{1.331} = 1000$$\n\n如果改为除以 $1 + 3 \\cdot 0.1 = 1.3$，就把增长当成了每期增加相同的数量。",
      ),
      generate: (rng) => initialValueProblem(rng, "growth"),
    },
    {
      id: "finding-the-growth-rate",
      title: t("Finding the growth rate", "求增长率"),
      explanation: t(
        "If a quantity grows from $a$ to $v$ in $2$ periods at a constant rate, its factor $b$ satisfies $a \\cdot b^{2} = v$, so $b = \\sqrt{\\frac{v}{a}}$:\n\n$$5000b^{2} = 6050 \\implies b^{2} = 1.21 \\implies b = 1.1$$\n\nThe rate is $10\\%$ per period. The total growth, $21\\%$, is not the rate per period.",
        "如果一个量按固定增长率在 $2$ 期内从 $a$ 增长到 $v$，它的因子 $b$ 满足 $a \\cdot b^{2} = v$，所以 $b = \\sqrt{\\frac{v}{a}}$：\n\n$$5000b^{2} = 6050 \\implies b^{2} = 1.21 \\implies b = 1.1$$\n\n增长率为每期 $10\\%$。总增长率 $21\\%$ 不是每期的增长率。",
      ),
      keyPrerequisites: ["square-roots-and-cube-roots"],
      generate: (rng) => rateFromValuesProblem(rng, "growth"),
    },
  ],
};

export const modelingExponentialDecayWithFunctions: TopicDef = {
  id: "modeling-exponential-decay-with-functions",
  title: t("Modeling Exponential Decay With Functions", "用函数表示指数衰减"),
  summary: t(
    "Write and evaluate functions $A(t) = a(1 - r)^{t}$ and half-life models for quantities that decay exponentially.",
    "为指数衰减的量写出并计算函数 $A(t) = a(1 - r)^{t}$ 以及半衰期模型。",
  ),
  prerequisites: ["exponential-functions", "creating-exponential-decay-expressions"],
  encompasses: [
    { topic: "creating-exponential-decay-expressions", weight: 0.5 },
    { topic: "exponential-functions", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.LE.A.2", "CCSS.HSF.LE.A.1.C"],
  knowledgePoints: [
    {
      id: "writing-decay-functions",
      title: t("Writing decay functions", "写出衰减函数"),
      explanation: t(
        "A quantity that starts at $a$ and decreases by the same percent $r$ every period is modeled by\n\n$$A(t) = a(1 - r)^{t}$$\n\nWhen two values one period apart are given, their ratio is the decay factor: from $800$ to $720$ it is $\\frac{720}{800} = 0.9$, so $A(t) = 800(0.9)^{t}$, a decrease of $10\\%$ per period.",
        "一个量起初为 $a$，每期按相同的百分率 $r$ 减少，可以用\n\n$$A(t) = a(1 - r)^{t}$$\n\n表示。如果给出的是相隔一期的两个值，它们的比就是衰减因子：从 $800$ 到 $720$，因子是 $\\frac{720}{800} = 0.9$，所以 $A(t) = 800(0.9)^{t}$，即每期减少 $10\\%$。",
      ),
      generate: (rng) => writeModelProblem(rng, "decay"),
    },
    {
      id: "evaluating-decay-models",
      title: t("Evaluating decay models", "计算衰减模型的值"),
      explanation: t(
        "Substitute the number of periods and compute the power first:\n\n$$V(2) = 20000(0.85)^{2} = 20000 \\cdot 0.7225 = 14450$$\n\nThis is more than $20000 - 2 \\cdot 3000 = 14000$: each year's $15\\%$ is taken of a smaller value, so the losses shrink.",
        "代入期数，先算乘方：\n\n$$V(2) = 20000(0.85)^{2} = 20000 \\cdot 0.7225 = 14450$$\n\n这比 $20000 - 2 \\cdot 3000 = 14000$ 多：每年的 $15\\%$ 是对更小的值取的，所以减少的量越来越小。",
      ),
      generate: (rng) => evaluateModelProblem(rng, "decay"),
    },
    {
      id: "half-life-models",
      title: t("Half-life", "半衰期"),
      explanation: halfLifeExplanation,
      generate: halfLifeProblem,
    },
  ],
};

export const interpretingExponentialDecay: TopicDef = {
  id: "interpreting-exponential-decay",
  title: t("Interpreting Exponential Decay", "解读指数衰减"),
  summary: t(
    "Read the percent rate of a decay model, tell growth from decay, and find the total decrease over several periods.",
    "读出衰减模型的衰减率，区分增长与衰减，并求若干期内的总减少率。",
  ),
  prerequisites: ["modeling-exponential-decay-with-functions", "interpreting-exponential-growth"],
  encompasses: [{ topic: "interpreting-exponential-growth", weight: 0.3 }],
  xp: 12,
  standards: ["CCSS.HSF.LE.B.5", "CCSS.HSF.IF.C.8.B"],
  knowledgePoints: [
    {
      id: "percent-decay-rate",
      title: t("The percent decay rate", "衰减率"),
      explanation: t(
        "The decay factor is $b = 1 - r$, so the percent decay rate is $r = 1 - b$. For $V(t) = 24000(0.85)^{t}$ the value decreases by $1 - 0.85 = 0.15 = 15\\%$ each period. It does not decrease by $85\\%$: $85\\%$ is the part that **remains**.",
        "衰减因子 $b = 1 - r$，所以衰减率 $r = 1 - b$。对 $V(t) = 24000(0.85)^{t}$，数值每期减少 $1 - 0.85 = 0.15 = 15\\%$。它不是减少 $85\\%$：$85\\%$ 是**剩下**的部分。",
      ),
      generate: (rng) => percentRateProblem(rng, "decay"),
    },
    {
      id: "growth-or-decay",
      title: t("Growth or decay?", "增长还是衰减？"),
      explanation: t(
        "For $f(t) = a \\cdot b^{t}$ with $a > 0$:\n\n- if $b > 1$, $f$ models **growth** by $b - 1$ per period;\n- if $0 < b < 1$, $f$ models **decay** by $1 - b$ per period.\n\nSo $1.35^{t}$ is growth by $35\\%$ and $0.65^{t}$ is decay by $35\\%$.",
        "对 $f(t) = a \\cdot b^{t}$（$a > 0$）：\n\n- 若 $b > 1$，$f$ 表示每期**增长** $b - 1$；\n- 若 $0 < b < 1$，$f$ 表示每期**衰减** $1 - b$。\n\n所以 $1.35^{t}$ 表示增长 $35\\%$，$0.65^{t}$ 表示衰减 $35\\%$。",
      ),
      generate(rng) {
        const kind: Kind = rng.bool() ? "growth" : "decay";
        let d: ReturnType<typeof draw>;
        do d = draw(rng, kind);
        while (d.r === 50);
        const { r, f } = d;
        const p = start(rng);
        const name = rng.pick(["f", "g", "A", "P"]);
        const big = Math.round(f.toNumber() * 100);
        const options = [
          kind === "growth"
            ? t(`Growth by $${r}\\%$ per period`, `每期增长 $${r}\\%$`)
            : t(`Decay by $${r}\\%$ per period`, `每期衰减 $${r}\\%$`),
          kind === "growth"
            ? t(`Decay by $${r}\\%$ per period`, `每期衰减 $${r}\\%$`)
            : t(`Growth by $${r}\\%$ per period`, `每期增长 $${r}\\%$`),
          kind === "growth"
            ? t(`Growth by $${big}\\%$ per period`, `每期增长 $${big}\\%$`)
            : t(`Decay by $${big}\\%$ per period`, `每期衰减 $${big}\\%$`),
          kind === "growth"
            ? t(`Decay by $${big}\\%$ per period`, `每期衰减 $${big}\\%$`)
            : t(`Growth by $${big}\\%$ per period`, `每期增长 $${big}\\%$`),
        ];
        const order = rng.shuffle([0, 1, 2, 3]);
        return choiceProblem({
          prompt: t(`Which describes $${name}(t) = ${expo(p, dec(f), "t")}$?`, `哪一项描述了 $${name}(t) = ${expo(p, dec(f), "t")}$？`),
          options: order.map((i) => options[i]!),
          correct: order.indexOf(0),
          solution:
            kind === "growth"
              ? t(
                  `The base $${dec(f)}$ is greater than $1$, so this is growth, by $${dec(f)} - 1 = ${dec(Q.of(r, 100))} = ${r}\\%$ per period.`,
                  `底数 $${dec(f)}$ 大于 $1$，所以是增长，每期增长 $${dec(f)} - 1 = ${dec(Q.of(r, 100))} = ${r}\\%$。`,
                )
              : t(
                  `The base $${dec(f)}$ is between $0$ and $1$, so this is decay, by $1 - ${dec(f)} = ${dec(Q.of(r, 100))} = ${r}\\%$ per period.`,
                  `底数 $${dec(f)}$ 在 $0$ 与 $1$ 之间，所以是衰减，每期衰减 $1 - ${dec(f)} = ${dec(Q.of(r, 100))} = ${r}\\%$。`,
                ),
        });
      },
    },
    {
      id: "interpreting-decay-statements",
      title: t("Interpreting the model", "解读模型"),
      explanation: t(
        "For $N(t) = 5000(0.9)^{t}$, where $t$ is in years: the number starts at $5000$ and decreases by $10\\%$ each year. It does not decrease by $500$ every year (that happens only in the first year), and it does not decrease by $90\\%$.",
        "对 $N(t) = 5000(0.9)^{t}$（$t$ 以年为单位）：数量起初为 $5000$，每年减少 $10\\%$。它不是每年减少 $500$（只有第一年减少 $500$），也不是减少 $90\\%$。",
      ),
      generate: (rng) => statementProblem(rng, "decay"),
    },
    {
      id: "decay-over-several-periods",
      title: t("Decay over several periods", "若干期内的衰减"),
      explanation: t(
        "Over $n$ periods the quantity is multiplied by $b^{n}$. Decreasing by $10\\%$ a year for $2$ years multiplies by $0.9^{2} = 0.81$: $81\\%$ remains, so the total decrease is $19\\%$, not $20\\%$.",
        "$n$ 期内这个量乘以 $b^{n}$。每年减少 $10\\%$，$2$ 年内乘以 $0.9^{2} = 0.81$：剩下 $81\\%$，所以总共减少 $19\\%$ 而不是 $20\\%$。",
      ),
      generate: (rng) => totalChangeProblem(rng, "decay"),
    },
  ],
};

export const solvingExponentialDecayProblems: TopicDef = {
  id: "solving-exponential-decay-problems",
  title: t("Solving Exponential Decay Problems", "解指数衰减问题"),
  summary: t(
    "Find the time, the starting value or the decay rate in exponential decay problems, including half-lives.",
    "在指数衰减问题（包括半衰期问题）中求时间、起始值或衰减率。",
  ),
  prerequisites: ["interpreting-exponential-decay", "solving-exponential-growth-problems"],
  encompasses: [
    { topic: "solving-exponential-equations", weight: 0.3 },
    { topic: "modeling-exponential-decay-with-functions", weight: 0.4 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.CED.A.1", "CCSS.HSF.LE.A.2"],
  knowledgePoints: [
    {
      id: "half-life-time",
      title: t("Time from a half-life", "由半衰期求时间"),
      explanation: t(
        "To find when $a$ decays to a value with half-life $h$, solve $a\\left(\\frac{1}{2}\\right)^{\\frac{t}{h}} = \\text{value}$. For $800$ g with a half-life of $3$ days decaying to $50$ g:\n\n$$\\left(\\frac{1}{2}\\right)^{\\frac{t}{3}} = \\frac{50}{800} = \\frac{1}{16} = \\left(\\frac{1}{2}\\right)^{4} \\implies \\frac{t}{3} = 4 \\implies t = 12$$\n\nThe $4$ counts half-lives; multiply by the half-life to get the time.",
        "半衰期为 $h$ 时，求 $a$ 何时衰减到某个值，就解 $a\\left(\\frac{1}{2}\\right)^{\\frac{t}{h}} = \\text{该值}$。$800$ 克、半衰期 $3$ 天的物质衰减到 $50$ 克：\n\n$$\\left(\\frac{1}{2}\\right)^{\\frac{t}{3}} = \\frac{50}{800} = \\frac{1}{16} = \\left(\\frac{1}{2}\\right)^{4} \\implies \\frac{t}{3} = 4 \\implies t = 12$$\n\n$4$ 是半衰期的个数，乘以半衰期才是时间。",
      ),
      generate(rng) {
        const ctx = rng.pick(halfLives);
        const k = rng.int(2, 6);
        const d = rng.int(2, 12);
        const left = rng.int(1, 15);
        const a = left * 2 ** k;
        const setup = ctx.setup(a, d);
        const when = ctx.when(String(left));
        return numberProblem({
          prompt: t(`${setup.en} ${when.en}`, `${setup["zh-CN"]}${when["zh-CN"]}`),
          answer: k * d,
          wrong: [k, 2 ** k, (k + 1) * d, Q.of(2 * (a - left) * d, a)],
          solution: t(
            `Solve $${a}\\left(\\frac{1}{2}\\right)^{\\frac{t}{${d}}} = ${left}$:${steps(`\\left(\\frac{1}{2}\\right)^{\\frac{t}{${d}}} = \\frac{${left}}{${a}} = \\frac{1}{${2 ** k}} = \\left(\\frac{1}{2}\\right)^{${k}}`, `\\frac{t}{${d}} = ${k} \\implies t = ${k * d}`)}`,
            `解方程 $${a}\\left(\\frac{1}{2}\\right)^{\\frac{t}{${d}}} = ${left}$：${steps(`\\left(\\frac{1}{2}\\right)^{\\frac{t}{${d}}} = \\frac{${left}}{${a}} = \\frac{1}{${2 ** k}} = \\left(\\frac{1}{2}\\right)^{${k}}`, `\\frac{t}{${d}} = ${k} \\implies t = ${k * d}`)}`,
          ),
        });
      },
    },
    {
      id: "finding-the-starting-value-of-decay",
      title: t("Finding the starting value", "求起始值"),
      explanation: t(
        "If the value after $n$ periods is known, divide it by $b^{n}$ to undo the decay:\n\n$$a(0.8)^{2} = 6400 \\implies a = \\frac{6400}{0.64} = 10000$$\n\nMultiplying by $0.64$ again would apply the decay twice more instead of undoing it.",
        "已知 $n$ 期后的值时，把它除以 $b^{n}$，就能还原衰减前的值：\n\n$$a(0.8)^{2} = 6400 \\implies a = \\frac{6400}{0.64} = 10000$$\n\n如果再乘以 $0.64$，就是又衰减了两期，而不是还原。",
      ),
      generate: (rng) => initialValueProblem(rng, "decay"),
    },
    {
      id: "finding-the-decay-rate",
      title: t("Finding the decay rate", "求衰减率"),
      explanation: t(
        "If a quantity decreases from $a$ to $v$ in $2$ periods at a constant rate, the factor is $b = \\sqrt{\\frac{v}{a}}$, and the rate is $1 - b$:\n\n$$10000b^{2} = 6400 \\implies b^{2} = 0.64 \\implies b = 0.8$$\n\nThe value decreases by $20\\%$ per period, not by the total $36\\%$.",
        "如果一个量按固定衰减率在 $2$ 期内从 $a$ 减少到 $v$，因子 $b = \\sqrt{\\frac{v}{a}}$，衰减率为 $1 - b$：\n\n$$10000b^{2} = 6400 \\implies b^{2} = 0.64 \\implies b = 0.8$$\n\n每期减少 $20\\%$，而不是总共的 $36\\%$。",
      ),
      generate: (rng) => rateFromValuesProblem(rng, "decay"),
    },
  ],
};

/** descriptions describe a quantity by a constant change ("linear") or a constant percent ("exponential"). */
const descriptions: readonly ((a: number, k: number, r: number) => { linear: Text; exponential: Text })[] = [
  (a, k, r) => ({
    linear: t(
      `A salary starts at $${a}$ dollars and increases by $${k}$ dollars each year.`,
      `某份工作起薪 $${a}$ 元，每年增加 $${k}$ 元。`,
    ),
    exponential: t(
      `A salary starts at $${a}$ dollars and increases by $${r}\\%$ each year.`,
      `某份工作起薪 $${a}$ 元，每年增加 $${r}\\%$。`,
    ),
  }),
  (a, k, r) => ({
    linear: t(
      `A tank holds $${a}$ liters of water, and $${k}$ liters drain out each minute.`,
      `水箱中有 $${a}$ 升水，每分钟排出 $${k}$ 升。`,
    ),
    exponential: t(
      `A tank holds $${a}$ liters of water, and each minute $${r}\\%$ of the water in it drains out.`,
      `水箱中有 $${a}$ 升水，每分钟排出其中的 $${r}\\%$。`,
    ),
  }),
  (a, k, r) => ({
    linear: t(`A plant is $${a}$ mm tall and grows $${k}$ mm each week.`, `一株植物高 $${a}$ 毫米，每周长高 $${k}$ 毫米。`),
    exponential: t(
      `A plant is $${a}$ mm tall, and its height grows by $${r}\\%$ each week.`,
      `一株植物高 $${a}$ 毫米，高度每周增长 $${r}\\%$。`,
    ),
  }),
  (a, k, r) => ({
    linear: t(
      `A laptop is worth $${a}$ dollars and loses $${k}$ dollars of value each year.`,
      `一台笔记本电脑价值 $${a}$ 元，每年贬值 $${k}$ 元。`,
    ),
    exponential: t(
      `A laptop is worth $${a}$ dollars and loses $${r}\\%$ of its value each year.`,
      `一台笔记本电脑价值 $${a}$ 元，每年贬值 $${r}\\%$。`,
    ),
  }),
];

const linearOrExponential: readonly Text[] = [t("Linear", "一次函数"), t("Exponential", "指数函数")];

export const linearVsExponentialGrowthAndDecay: TopicDef = {
  id: "linear-vs-exponential-growth-and-decay",
  title: t("Linear vs. Exponential Growth and Decay", "线性变化与指数变化"),
  summary: t(
    "Tell linear from exponential change in tables and descriptions, and see that exponential growth eventually overtakes linear growth.",
    "从数值表和文字描述中区分线性变化与指数变化，并认识到指数增长终将超过线性增长。",
  ),
  prerequisites: [
    "modeling-exponential-growth-with-functions",
    "modeling-exponential-decay-with-functions",
    "modeling-with-linear-functions",
  ],
  encompasses: [],
  xp: 12,
  standards: ["CCSS.HSF.LE.A.1", "CCSS.HSF.LE.A.3"],
  knowledgePoints: [
    {
      id: "linear-or-exponential-tables",
      title: t("Tables", "数值表"),
      explanation: t(
        "When $x$ goes up by $1$ each step:\n\n- a **linear** function adds the same number each step (constant differences);\n- an **exponential** function multiplies by the same number each step (constant ratios).\n\n$3, 7, 11, 15$ is linear (add $4$); $3, 6, 12, 24$ is exponential (multiply by $2$); $1, 2, 5, 10$ is neither.",
        "当 $x$ 每次增加 $1$ 时：\n\n- **一次函数**每一步加上同一个数（差相等）；\n- **指数函数**每一步乘以同一个数（比相等）。\n\n$3, 7, 11, 15$ 是一次函数（加 $4$）；$3, 6, 12, 24$ 是指数函数（乘以 $2$）；$1, 2, 5, 10$ 两者都不是。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const xs = [0, 1, 2, 3, 4];
        let ys: Q[];
        if (kind === 0) {
          const c = rng.int(-5, 20);
          const m = rng.nonZero(-9, 9);
          ys = xs.map((x) => Q.of(c + m * x));
        } else if (kind === 1) {
          const b = rng.pick([Q.of(2), Q.of(3), Q.of(1, 2), Q.of(1, 3)]);
          const a = b.d > 1n ? rng.int(1, 3) * Number(b.d) ** 4 : rng.int(1, 6);
          ys = xs.map((x) => b.pow(x).mul(Q.of(a)));
        } else {
          const a = rng.int(1, 3);
          const c = rng.int(-4, 6);
          ys = xs.map((x) => Q.of(a * x * x + c));
        }
        const diffs = ys.slice(1).map((y, i) => y.sub(ys[i]!));
        const ratios = ys.slice(1).map((y, i) => (ys[i]!.isZero() ? undefined : y.div(ys[i]!)));
        const list = (vs: readonly (Q | undefined)[]) => vs.map((v) => (v === undefined ? "-" : v.toLatex())).join(", ");
        const options = [t("Linear", "一次函数"), t("Exponential", "指数函数"), t("Neither", "都不是")];
        return choiceProblem({
          prompt: t(
            `Is the function in the table linear, exponential, or neither?${table("f", xs, ys)}`,
            `下表中的函数是一次函数、指数函数，还是都不是？${table("f", xs, ys)}`,
          ),
          options,
          correct: kind,
          solution: t(
            `The differences of consecutive values are $${list(diffs)}$ and the ratios are $${list(ratios)}$. ${kind === 0 ? "The differences are constant, so the function is linear." : kind === 1 ? "The ratios are constant, so the function is exponential." : "Neither the differences nor the ratios are constant, so it is neither."}`,
            `相邻函数值的差为 $${list(diffs)}$，比为 $${list(ratios)}$。${kind === 0 ? "差相等，所以是一次函数。" : kind === 1 ? "比相等，所以是指数函数。" : "差和比都不相等，所以两者都不是。"}`,
          ),
        });
      },
    },
    {
      id: "linear-or-exponential-descriptions",
      title: t("Descriptions", "文字描述"),
      explanation: t(
        'A quantity that changes by the same **amount** each period is linear: "increases by $50$ dollars each year". A quantity that changes by the same **percent** or factor each period is exponential: "increases by $5\\%$ each year", "doubles every hour", "loses half every day".',
        "每期变化相同**数量**的量是线性的：“每年增加 $50$ 元”。每期变化相同**百分率**或倍数的量是指数的：“每年增加 $5\\%$”“每小时翻一番”“每天减少一半”。",
      ),
      generate(rng) {
        const d = rng.pick(descriptions)(rng.int(10, 99) * 10, rng.int(2, 60), rng.pick([2, 3, 5, 8, 10, 12, 15, 20]));
        const exp = rng.bool();
        return choiceProblem({
          prompt: t(
            `${(exp ? d.exponential : d.linear).en} Is the quantity modeled by a linear or an exponential function?`,
            `${(exp ? d.exponential : d.linear)["zh-CN"]}这个量应该用一次函数还是指数函数表示？`,
          ),
          options: linearOrExponential,
          correct: exp ? 1 : 0,
          solution: exp
            ? t(
                "It changes by the same percent each period, so it is multiplied by the same factor: exponential.",
                "它每期变化相同的百分率，即乘以相同的因子：指数函数。",
              )
            : t("It changes by the same amount each period, so it is linear.", "它每期变化相同的数量，所以是一次函数。"),
        });
      },
    },
    {
      id: "exponential-overtakes-linear",
      title: t("Exponential growth overtakes linear growth", "指数增长超过线性增长"),
      explanation: t(
        "An exponentially growing quantity eventually exceeds any linearly growing one, even if it starts smaller. Compare $f(x) = 20x + 50$ and $g(x) = 2^{x}$:\n\n$$\\begin{array}{c|ccccccccc} x & 0 & 1 & 2 & 3 & 4 & 5 & 6 & 7 & 8 \\\\ \\hline f(x) & 50 & 70 & 90 & 110 & 130 & 150 & 170 & 190 & 210 \\\\ g(x) & 1 & 2 & 4 & 8 & 16 & 32 & 64 & 128 & 256 \\end{array}$$\n\n$g$ passes $f$ at $x = 8$ and stays ahead: from then on it adds more each step than $f$ does.",
        "指数增长的量终将超过任何线性增长的量，即使它起初更小。比较 $f(x) = 20x + 50$ 与 $g(x) = 2^{x}$：\n\n$$\\begin{array}{c|ccccccccc} x & 0 & 1 & 2 & 3 & 4 & 5 & 6 & 7 & 8 \\\\ \\hline f(x) & 50 & 70 & 90 & 110 & 130 & 150 & 170 & 190 & 210 \\\\ g(x) & 1 & 2 & 4 & 8 & 16 & 32 & 64 & 128 & 256 \\end{array}$$\n\n$g$ 在 $x = 8$ 时超过 $f$，并且一直领先：此后它每一步增加的都比 $f$ 多。",
      ),
      generate(rng) {
        for (;;) {
          const m = rng.int(1, 8) * 5;
          const c = rng.int(2, 20) * 5;
          const a = rng.int(1, 5);
          const b = rng.pick([2, 2, 3]);
          if (a >= c) continue;
          let x = 0;
          while (a * b ** x <= m * x + c) x++;
          if (x < 2 || x > 10) continue;
          const g = expo(a, String(b));
          return numberProblem({
            prompt: t(
              `Let $f(x) = ${linear(m, c)}$ and $g(x) = ${g}$. What is the smallest whole number $x$ for which $g(x) > f(x)$?`,
              `设 $f(x) = ${linear(m, c)}$，$g(x) = ${g}$。使 $g(x) > f(x)$ 的最小整数 $x$ 是多少？`,
            ),
            answer: x,
            wrong: [x - 1, x + 1],
            solution: t(
              `Compare the values:${steps(`f(${x - 1}) = ${m * (x - 1) + c},\\; g(${x - 1}) = ${a * b ** (x - 1)}`, `f(${x}) = ${m * x + c},\\; g(${x}) = ${a * b ** x}`)}So $g(x) > f(x)$ first at $x = ${x}$, and $g$ stays ahead after that.`,
              `比较函数值：${steps(`f(${x - 1}) = ${m * (x - 1) + c},\\; g(${x - 1}) = ${a * b ** (x - 1)}`, `f(${x}) = ${m * x + c},\\; g(${x}) = ${a * b ** x}`)}所以 $x = ${x}$ 时首次 $g(x) > f(x)$，此后 $g$ 一直领先。`,
            ),
          });
        }
      },
    },
  ],
};

/** modelContexts describe a quantity by a constant change or a constant percent, with the sign of the change. */
const modelContexts: readonly {
  readonly name: string;
  readonly s: 1 | -1;
  readonly what: Text;
  readonly linear: (p: number, k: number) => Text;
  readonly percent: (p: number, r: number) => Text;
}[] = [
  {
    name: "P",
    s: 1,
    what: t("the population after $t$ years", "$t$ 年后的人口"),
    linear: (p, k) =>
      t(`A town has $${p}$ residents, and the number grows by $${k}$ each year.`, `某镇有 $${p}$ 名居民，每年增加 $${k}$ 人。`),
    percent: (p, r) =>
      t(`A town has $${p}$ residents, and the number grows by $${r}\\%$ each year.`, `某镇有 $${p}$ 名居民，居民人数每年增长 $${r}\\%$。`),
  },
  {
    name: "V",
    s: -1,
    what: t("the value of the car after $t$ years", "$t$ 年后汽车的价值"),
    linear: (p, k) =>
      t(`A car is worth $${p}$ dollars and loses $${k}$ dollars of value each year.`, `一辆汽车价值 $${p}$ 元，每年贬值 $${k}$ 元。`),
    percent: (p, r) =>
      t(`A car is worth $${p}$ dollars and loses $${r}\\%$ of its value each year.`, `一辆汽车价值 $${p}$ 元，每年贬值 $${r}\\%$。`),
  },
  {
    name: "S",
    s: 1,
    what: t("the amount saved after $t$ months", "$t$ 个月后的存款"),
    linear: (p, k) =>
      t(`A savings jar holds $${p}$ dollars, and $${k}$ dollars are added each month.`, `存钱罐里有 $${p}$ 元，每月存入 $${k}$ 元。`),
    percent: (p, r) =>
      t(
        `An account holds $${p}$ dollars and earns $${r}\\%$ interest each month, compounded monthly.`,
        `某账户存有 $${p}$ 元，月利率为 $${r}\\%$，每月复利一次。`,
      ),
  },
  {
    name: "W",
    s: -1,
    what: t("the amount of water after $t$ days", "$t$ 天后的水量"),
    linear: (p, k) =>
      t(`A pool holds $${p}$ liters of water and loses $${k}$ liters each day.`, `水池中有 $${p}$ 升水，每天减少 $${k}$ 升。`),
    percent: (p, r) =>
      t(`A pool holds $${p}$ liters of water and loses $${r}\\%$ of it each day.`, `水池中有 $${p}$ 升水，每天减少其中的 $${r}\\%$。`),
  },
];

export const linearVsExponentialModels: TopicDef = {
  id: "linear-vs-exponential-models",
  title: t("Linear vs. Exponential Growth and Decay Models", "线性模型与指数模型"),
  summary: t(
    "Choose and write a linear or an exponential model for a situation, and compare the predictions of the two kinds of model.",
    "为情境选择并写出一次函数模型或指数函数模型，并比较两类模型的预测。",
  ),
  prerequisites: ["linear-vs-exponential-growth-and-decay"],
  encompasses: [
    { topic: "linear-vs-exponential-growth-and-decay", weight: 0.5 },
    { topic: "modeling-exponential-growth-with-functions", weight: 0.3 },
    { topic: "modeling-with-linear-functions", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.LE.A.1", "CCSS.HSF.LE.A.2"],
  knowledgePoints: [
    {
      id: "writing-linear-or-exponential-models",
      title: t("Writing the model", "写出模型"),
      explanation: t(
        'Decide first whether the change is by an amount or by a percent:\n\n- "grows by $40$ each year" from $500$: $f(t) = 40t + 500$;\n- "grows by $4\\%$ each year" from $500$: $f(t) = 500(1.04)^{t}$;\n- "loses $300$ each year" from $9000$: $f(t) = -300t + 9000$;\n- "loses $12\\%$ each year" from $9000$: $f(t) = 9000(0.88)^{t}$.',
        "先判断变化是按数量还是按百分率：\n\n- 从 $500$ 开始“每年增加 $40$”：$f(t) = 40t + 500$；\n- 从 $500$ 开始“每年增加 $4\\%$”：$f(t) = 500(1.04)^{t}$；\n- 从 $9000$ 开始“每年减少 $300$”：$f(t) = -300t + 9000$；\n- 从 $9000$ 开始“每年减少 $12\\%$”：$f(t) = 9000(0.88)^{t}$。",
      ),
      generate(rng) {
        const ctx = rng.pick(modelContexts);
        const p = rng.int(5, 90) * 100;
        const r = rng.pick([2, 3, 4, 5, 6, 8, 10, 12, 15, 20]);
        const k = rng.int(2, 40) * 10;
        const exp = rng.bool();
        const f = Q.of(100 + ctx.s * r, 100);
        const answer = exp ? expo(p, dec(f), "t") : linear(ctx.s * k, p, "t");
        const setup = exp ? ctx.percent(p, r) : ctx.linear(p, k);
        return expressionProblem({
          prompt: t(
            `${setup.en} Write a function $${ctx.name}(t)$ for ${ctx.what.en}.`,
            `${setup["zh-CN"]}写出${ctx.what["zh-CN"]}的函数 $${ctx.name}(t)$。`,
          ),
          answer,
          prefix: `${ctx.name}(t) =`,
          wrong: exp
            ? [linear((ctx.s * p * r) / 100, p, "t"), expo(p, dec(Q.of(r, 100)), "t"), linear(ctx.s * r, p, "t")]
            : [expo(p, String(k), "t"), linear(-ctx.s * k, p, "t"), linear(p, ctx.s * k, "t")],
          solution: exp
            ? t(
                `The change is a percent, so the model is exponential with factor $1 ${ctx.s > 0 ? "+" : "-"} ${dec(Q.of(r, 100))} = ${dec(f)}$:${steps(`${ctx.name}(t) = ${answer}`)}`,
                `变化是按百分率的，所以是指数模型，因子为 $1 ${ctx.s > 0 ? "+" : "-"} ${dec(Q.of(r, 100))} = ${dec(f)}$：${steps(`${ctx.name}(t) = ${answer}`)}`,
              )
            : t(
                `The change is the same amount each period, so the model is linear with slope $${ctx.s * k}$ and starting value $${p}$:${steps(`${ctx.name}(t) = ${answer}`)}`,
                `每期变化相同的数量，所以是一次函数模型，斜率为 $${ctx.s * k}$，起始值为 $${p}$：${steps(`${ctx.name}(t) = ${answer}`)}`,
              ),
        });
      },
    },
    {
      id: "models-through-two-points",
      title: t("Models through two values", "过两个值的模型"),
      explanation: t(
        "Two values $f(0) = a$ and $f(1) = b$ fit both kinds of model, but they predict differently:\n\n- linear: add $b - a$ each step, so $f(x) = a + (b - a)x$;\n- exponential: multiply by $\\frac{b}{a}$ each step, so $f(x) = a\\left(\\frac{b}{a}\\right)^{x}$.\n\nWith $f(0) = 4$ and $f(1) = 8$: the linear model gives $f(3) = 16$, the exponential one $f(3) = 32$.",
        "两个值 $f(0) = a$ 和 $f(1) = b$ 同时符合两类模型，但预测不同：\n\n- 一次函数：每步加 $b - a$，所以 $f(x) = a + (b - a)x$；\n- 指数函数：每步乘以 $\\frac{b}{a}$，所以 $f(x) = a\\left(\\frac{b}{a}\\right)^{x}$。\n\n若 $f(0) = 4$，$f(1) = 8$：一次函数模型给出 $f(3) = 16$，指数模型给出 $f(3) = 32$。",
      ),
      generate(rng) {
        const n = rng.int(2, 4);
        const ratio = rng.pick([Q.of(2), Q.of(3), Q.of(1, 2)]);
        const a = ratio.d > 1n ? rng.int(1, 6) * 2 ** n : rng.int(2, 9);
        const b = ratio.mul(Q.of(a));
        const exp = rng.bool();
        const lin = (x: number) => b.sub(Q.of(a)).mul(Q.of(x)).add(Q.of(a));
        const ex = (x: number) => ratio.pow(x).mul(Q.of(a));
        const value = exp ? ex(n) : lin(n);
        const kind = exp ? t("exponential", "指数函数") : t("linear", "一次函数");
        return numberProblem({
          prompt: t(
            `A function $f$ has $f(0) = ${a}$ and $f(1) = ${b.toLatex()}$. If $f$ is ${kind.en}, what is $f(${n})$?`,
            `函数 $f$ 满足 $f(0) = ${a}$，$f(1) = ${b.toLatex()}$。若 $f$ 是${kind["zh-CN"]}，$f(${n})$ 是多少？`,
          ),
          answer: value,
          wrong: [exp ? lin(n) : ex(n), exp ? ex(n - 1) : lin(n - 1), exp ? ex(n + 1) : lin(n + 1)],
          solution: exp
            ? t(
                `Each step multiplies by $\\frac{${b.toLatex()}}{${a}} = ${ratio.toLatex()}$:${steps(`f(${n}) = ${a} \\cdot ${bracket(ratio)}^{${n}} = ${value.toLatex()}`)}`,
                `每步乘以 $\\frac{${b.toLatex()}}{${a}} = ${ratio.toLatex()}$：${steps(`f(${n}) = ${a} \\cdot ${bracket(ratio)}^{${n}} = ${value.toLatex()}`)}`,
              )
            : t(
                `Each step adds $${b.toLatex()} - ${a} = ${b.sub(Q.of(a)).toLatex()}$:${steps(`f(${n}) = ${a} + ${n} \\cdot ${paren(b.sub(Q.of(a)))} = ${value.toLatex()}`)}`,
                `每步加上 $${b.toLatex()} - ${a} = ${b.sub(Q.of(a)).toLatex()}$：${steps(`f(${n}) = ${a} + ${n} \\cdot ${paren(b.sub(Q.of(a)))} = ${value.toLatex()}`)}`,
              ),
        });
      },
    },
    {
      id: "comparing-models",
      title: t("Comparing models", "比较模型"),
      explanation: t(
        "To compare two plans at a given time, evaluate both models there. A plan that grows by a percent may start behind a plan that grows by a fixed amount and still pass it later:\n\n$$A(t) = 1000 + 100t,\\qquad B(t) = 1000(1.08)^{t}$$\n\nAfter $5$ years $A = 1500$ and $B \\approx 1469.33$, but after $10$ years $A = 2000$ and $B \\approx 2158.92$.",
        "要比较两个方案在某一时刻的情况，就分别计算两个模型在该时刻的值。按百分率增长的方案起初可能落后于按固定数量增长的方案，但之后会反超：\n\n$$A(t) = 1000 + 100t,\\qquad B(t) = 1000(1.08)^{t}$$\n\n$5$ 年后 $A = 1500$，$B \\approx 1469.33$；但 $10$ 年后 $A = 2000$，$B \\approx 2158.92$。",
      ),
      generate(rng) {
        for (;;) {
          const p = rng.int(5, 50) * 100;
          const r = rng.pick([4, 5, 6, 8, 10, 12, 15]);
          const k = rng.int(2, 30) * 10;
          const n = rng.int(3, 12);
          const f = Q.of(100 + r, 100);
          const a = Q.of(p + k * n);
          const b = f.pow(n).mul(Q.of(p));
          if (a.eq(b) || a.sub(b).abs().cmp(Q.of(1)) < 0) continue;
          const bShown = roundQ(b, 100);
          return choiceProblem({
            prompt: t(
              `Two savings plans both start with $${p}$ dollars. In plan A the balance grows by $${k}$ dollars each year; in plan B it grows by $${r}\\%$ each year. Which plan has the larger balance after $${n}$ years?`,
              `两个储蓄方案都从 $${p}$ 元开始。方案 A 的余额每年增加 $${k}$ 元；方案 B 的余额每年增长 $${r}\\%$。$${n}$ 年后哪个方案的余额更多？`,
            ),
            options: [t("Plan A", "方案 A"), t("Plan B", "方案 B")],
            correct: a.cmp(b) > 0 ? 0 : 1,
            solution: t(
              `Evaluate both models at $t = ${n}$:${steps(`A(${n}) = ${p} + ${k} \\cdot ${n} = ${p + k * n}`, `B(${n}) = ${p}(${dec(f)})^{${n}} \\approx ${dec(bShown)}`)}So plan ${a.cmp(b) > 0 ? "A" : "B"} has more.`,
              `计算两个模型在 $t = ${n}$ 时的值：${steps(`A(${n}) = ${p} + ${k} \\cdot ${n} = ${p + k * n}`, `B(${n}) = ${p}(${dec(f)})^{${n}} \\approx ${dec(bShown)}`)}所以方案 ${a.cmp(b) > 0 ? "A" : "B"} 更多。`,
            ),
          });
        }
      },
    },
  ],
};

// Graphs of exponential functions.

const graphView: PlaneView = { xMin: -5, xMax: 5, yMin: -5, yMax: 10 };

/** expFigure draws y = a·b^x + k with labeled points. */
function expFigure(a: Q, b: Q, k: number, pts: readonly Point[], dir: Compass): Figure {
  const [A, B] = [a.toNumber(), b.toNumber()];
  const marks: PlaneMark[] = [
    { kind: "curve", f: (x) => A * B ** x + k, accent: true },
    ...pts.map((at) => ({ kind: "point" as const, at, label: `(${at[0]}, ${at[1]})`, dir })),
  ];
  const rising = A > 0 === B > 1;
  const side = B > 1 ? t("left", "左") : t("right", "右");
  const through = pts.map((p) => `(${p[0]}, ${p[1]})`).join(pts.length > 1 ? " and " : "");
  const throughZh = pts.map((p) => `(${p[0]}, ${p[1]})`).join("、");
  return {
    svg: plane(graphView, marks),
    alt: t(
      `The ${rising ? "rising" : "falling"} curve of an exponential function${pts.length ? ` through ${through}` : ""}, levelling off near the line y = ${k} on the ${side.en}.`,
      `一条${rising ? "上升" : "下降"}的指数函数曲线${pts.length ? `，经过 ${throughZh}` : ""}，在${side["zh-CN"]}侧逐渐靠近直线 y = ${k}。`,
    ),
  };
}

/** graphPairs lists, for y = a·b^x, the pairs of consecutive points with whole-number coordinates between 1 and 9. */
function graphPairs(combos: readonly (readonly [Q, Q])[]): { a: Q; b: Q; x0: number }[] {
  const out: { a: Q; b: Q; x0: number }[] = [];
  for (const [a, b] of combos) {
    const ok = (x: number) => {
      const y = b.pow(x).mul(a);
      return y.isInteger() && y.cmp(Q.one) >= 0 && y.cmp(Q.of(9)) <= 0;
    };
    for (let x = -4; x <= 4; x++) if (ok(x) && ok(x + 1)) out.push({ a, b, x0: x });
  }
  return out;
}

const growthPairs = graphPairs(
  (
    [
      [1, 2],
      [2, 2],
      [3, 2],
      [4, 2],
      [1, 3],
      [2, 3],
      [3, 3],
      [1, 4],
      [2, 4],
      [1, 5],
      [Q.of(1, 2), 2],
      [Q.of(1, 3), 3],
      [Q.of(1, 4), 4],
      [Q.of(1, 2), 4],
      [2, Q.of(3, 2)],
      [4, Q.of(3, 2)],
      [6, Q.of(3, 2)],
      [2, Q.of(5, 2)],
      [3, Q.of(4, 3)],
    ] as const
  ).map(([a, b]) => [toQ(a), toQ(b)] as const),
);

const decayPairs = graphPairs(
  (
    [
      [1, Q.of(1, 2)],
      [2, Q.of(1, 2)],
      [3, Q.of(1, 2)],
      [4, Q.of(1, 2)],
      [6, Q.of(1, 2)],
      [8, Q.of(1, 2)],
      [1, Q.of(1, 3)],
      [2, Q.of(1, 3)],
      [3, Q.of(1, 3)],
      [9, Q.of(1, 3)],
      [1, Q.of(1, 4)],
      [4, Q.of(1, 4)],
      [4, Q.of(2, 3)],
      [6, Q.of(2, 3)],
      [9, Q.of(2, 3)],
      [8, Q.of(3, 4)],
    ] as const
  ).map(([a, b]) => [toQ(a), toQ(b)] as const),
);

/** equationFromGraphProblem asks for y = a·b^x from its graph through two labeled points. */
function equationFromGraphProblem(rng: Rng, pairs: readonly { a: Q; b: Q; x0: number }[], dir: Compass): Problem {
  const { a, b, x0 } = rng.pick(pairs);
  const y0 = b.pow(x0).mul(a);
  const y1 = b.pow(x0 + 1).mul(a);
  const pts: Point[] = [
    [x0, y0.toNumber()],
    [x0 + 1, y1.toNumber()],
  ];
  const answer = expo(a, num(b));
  const slope = y1.sub(y0);
  return {
    ...expressionProblem({
      prompt: t(
        "The graph of $y = a \\cdot b^{x}$ passes through the labeled points. Find its equation.",
        "如图，$y = a \\cdot b^{x}$ 的图象经过标出的点。求它的解析式。",
      ),
      answer,
      prefix: "y =",
      wrong: [expo(b, num(a)), linear(slope, y0.sub(slope.mul(Q.of(x0)))), expo(y0, num(b)), expo(a, num(Q.one.div(b)))],
      solution: t(
        `Going from $x = ${x0}$ to $x = ${x0 + 1}$ multiplies $y$ by $b = \\frac{${y1.toLatex()}}{${y0.toLatex()}} = ${b.toLatex()}$. Then $a = y(0)$${x0 === 0 ? ` $= ${a.toLatex()}$` : `, found from $a \\cdot ${bracket(b)}^{${x0}} = ${y0.toLatex()}$: $a = ${a.toLatex()}$`}. So${steps(`y = ${answer}`)}`,
        `从 $x = ${x0}$ 到 $x = ${x0 + 1}$，$y$ 乘以 $b = \\frac{${y1.toLatex()}}{${y0.toLatex()}} = ${b.toLatex()}$。而 $a = y(0)$${x0 === 0 ? ` $= ${a.toLatex()}$` : `，由 $a \\cdot ${bracket(b)}^{${x0}} = ${y0.toLatex()}$ 得 $a = ${a.toLatex()}$`}。所以${steps(`y = ${answer}`)}`,
      ),
    }),
    figure: expFigure(a, b, 0, pts, dir),
  };
}

/** shifted writes y = a·b^x + k. */
const shifted = (a: number, b: Q, k: number) => `${expo(a, num(b))}${k === 0 ? "" : k > 0 ? ` + ${k}` : ` - ${-k}`}`;

/** asymptoteProblem asks for the horizontal asymptote of y = a·b^x + k, from its graph or its equation. */
function asymptoteProblem(rng: Rng, bases: readonly Q[]): Problem {
  const a = rng.int(1, 3);
  const b = rng.pick(bases);
  const k = rng.int(-4, 4);
  const growth = b.cmp(Q.one) > 0;
  const fromGraph = rng.bool();
  const direction = growth ? t("decreases", "减小") : t("increases", "增大");
  const p = rng.pick(["y", "f(x)"]);
  const base = {
    answer: k,
    solveFor: "y",
    wrong: [a + k, -k, a, ...(k === 0 ? [] : [0])],
    solution: t(
      `As $x$ ${direction.en}, $${bracket(b)}^{x}$ gets closer and closer to $0$, so $y$ gets closer and closer to $0 ${k < 0 ? "-" : "+"} ${Math.abs(k)} = ${k}$. The asymptote is $y = ${k}$.`,
      `当 $x$ ${direction["zh-CN"]}时，$${bracket(b)}^{x}$ 越来越接近 $0$，所以 $y$ 越来越接近 $0 ${k < 0 ? "-" : "+"} ${Math.abs(k)} = ${k}$。渐近线是 $y = ${k}$。`,
    ),
  };
  if (fromGraph) {
    return {
      ...numberProblem({
        ...base,
        prompt: t(
          `The graph of an exponential function $y = a \\cdot b^{x} + k$ is shown. As $x$ ${direction.en}, the graph gets closer and closer to a horizontal line. What is its equation?`,
          `如图是指数函数 $y = a \\cdot b^{x} + k$ 的图象。当 $x$ ${direction["zh-CN"]}时，图象越来越接近一条水平直线。这条直线的方程是什么？`,
        ),
      }),
      figure: expFigure(Q.of(a), b, k, [[0, a + k]], growth ? "nw" : "ne"),
    };
  }
  return numberProblem({
    ...base,
    prompt: t(
      `What is the horizontal asymptote of the graph of $${p} = ${shifted(a, b, k)}$?`,
      `$${p} = ${shifted(a, b, k)}$ 的图象的水平渐近线是什么？`,
    ),
  });
}

/** rangeProblem asks for the range of f(x) = a·b^x + k in interval notation. */
function rangeProblem(rng: Rng, bases: readonly Q[], reflect: boolean): Problem {
  const a = (reflect && rng.bool() ? -1 : 1) * rng.int(1, 3);
  const b = rng.pick(bases);
  const k = rng.int(-4, 4);
  const above = a > 0;
  const set = [above ? { lo: Q.of(k), loClosed: false, hiClosed: false } : { hi: Q.of(k), loClosed: false, hiClosed: false }];
  const closed = [above ? { lo: Q.of(k), loClosed: true, hiClosed: false } : { hi: Q.of(k), loClosed: false, hiClosed: true }];
  const other = [above ? { hi: Q.of(k), loClosed: false, hiClosed: false } : { lo: Q.of(k), loClosed: false, hiClosed: false }];
  const shiftedSet = [
    above ? { lo: Q.of(a + k), loClosed: false, hiClosed: false } : { hi: Q.of(a + k), loClosed: false, hiClosed: false },
  ];
  return {
    ...intervalProblem({
      prompt: t(
        `What is the range of $f(x) = ${shifted(a, b, k)}$? Write it in interval notation.`,
        `$f(x) = ${shifted(a, b, k)}$ 的值域是什么？用区间表示。`,
      ),
      set,
      form: "interval",
      wrong: [closed, other, realLine, shiftedSet],
      solution: t(
        `$${bracket(b)}^{x}$ takes every positive value and never $0$, so $${a}\\cdot${bracket(b)}^{x}$ takes every ${above ? "positive" : "negative"} value. Adding $${k}$ moves these values to ${above ? `everything above $${k}$` : `everything below $${k}$`}, and the asymptote $y = ${k}$ itself is never reached.`,
        `$${bracket(b)}^{x}$ 取遍所有正数且取不到 $0$，所以 $${a}\\cdot${bracket(b)}^{x}$ 取遍所有${above ? "正数" : "负数"}。加上 $${k}$ 后，取值为${above ? `所有大于 $${k}$ 的数` : `所有小于 $${k}$ 的数`}，而渐近线 $y = ${k}$ 本身取不到。`,
      ),
    }),
    figure: expFigure(Q.of(a), b, k, [], "ne"),
  };
}

const growthBases = [Q.of(2), Q.of(3), Q.of(3, 2)];
const decayBases = [Q.of(1, 2), Q.of(1, 3), Q.of(2, 3)];

export const graphingExponentialGrowthFunctions: TopicDef = {
  id: "graphing-exponential-growth-functions",
  title: t("Graphing Exponential Growth Functions", "指数增长函数的图象"),
  summary: t(
    "Read exponential growth functions from their graphs, and find their horizontal asymptotes and ranges.",
    "根据图象求指数增长函数，并求它们的水平渐近线和值域。",
  ),
  prerequisites: ["exponential-functions", "range-of-a-function"],
  encompasses: [{ topic: "exponential-functions", weight: 0.3 }],
  xp: 15,
  standards: ["CCSS.HSF.IF.C.7.E", "CCSS.HSF.LE.A.2"],
  knowledgePoints: [
    {
      id: "growth-equation-from-graph",
      title: t("The equation from the graph", "由图象求解析式"),
      explanation: t(
        "The graph of $y = a \\cdot b^{x}$ with $a > 0$ and $b > 1$ rises from left to right, ever more steeply. It crosses the $y$-axis at $(0, a)$, and each step of $1$ to the right multiplies the height by $b$. From the points $(0, 2)$ and $(1, 6)$: $a = 2$ and $b = \\frac{6}{2} = 3$, so $y = 2(3)^{x}$.",
        "$y = a \\cdot b^{x}$（$a > 0$，$b > 1$）的图象从左到右上升，而且越来越陡。它与 $y$ 轴交于 $(0, a)$，向右每走 $1$ 个单位，高度就乘以 $b$。由点 $(0, 2)$ 和 $(1, 6)$ 得 $a = 2$，$b = \\frac{6}{2} = 3$，所以 $y = 2(3)^{x}$。",
      ),
      generate: (rng) => equationFromGraphProblem(rng, growthPairs, "nw"),
    },
    {
      id: "growth-horizontal-asymptote",
      title: t("The horizontal asymptote", "水平渐近线"),
      explanation: t(
        "As $x$ decreases, $b^{x}$ (with $b > 1$) gets closer and closer to $0$ without reaching it: $2^{-10} = \\frac{1}{1024}$. So the graph of $y = a \\cdot b^{x}$ approaches the $x$-axis on the left. This line is a **horizontal asymptote**. Adding $k$ shifts the graph up by $k$, and the asymptote becomes $y = k$: for $y = 3(2)^{x} - 4$ it is $y = -4$.",
        "当 $x$ 减小时，$b^{x}$（$b > 1$）越来越接近 $0$ 但取不到 $0$：$2^{-10} = \\frac{1}{1024}$。所以 $y = a \\cdot b^{x}$ 的图象在左侧逐渐靠近 $x$ 轴。这条直线叫做**水平渐近线**。加上 $k$ 会把图象向上平移 $k$，渐近线变为 $y = k$：$y = 3(2)^{x} - 4$ 的渐近线是 $y = -4$。",
      ),
      generate: (rng) => asymptoteProblem(rng, growthBases),
    },
    {
      id: "growth-range",
      title: t("The range", "值域"),
      explanation: t(
        "$b^{x}$ takes every positive value, so for $a > 0$ the function $y = a \\cdot b^{x} + k$ takes every value above the asymptote and none on or below it:\n\n$$\\text{range of } a \\cdot b^{x} + k = (k, \\infty)$$\n\nThe endpoint $k$ is excluded: the graph never touches its asymptote.",
        "$b^{x}$ 取遍所有正数，所以当 $a > 0$ 时，$y = a \\cdot b^{x} + k$ 取遍渐近线上方的所有值，而取不到渐近线上及其下方的值：\n\n$$a \\cdot b^{x} + k \\text{ 的值域} = (k, \\infty)$$\n\n端点 $k$ 不包括在内：图象永远不会碰到渐近线。",
      ),
      generate: (rng) => rangeProblem(rng, growthBases, false),
    },
  ],
  diagnostic: "growth-equation-from-graph",
};

export const graphingExponentialDecayFunctions: TopicDef = {
  id: "graphing-exponential-decay-functions",
  title: t("Graphing Exponential Decay Functions", "指数衰减函数的图象"),
  summary: t(
    "Read exponential decay functions from their graphs, and find their asymptotes and ranges, including reflected graphs.",
    "根据图象求指数衰减函数，并求它们的渐近线和值域（包括翻折后的图象）。",
  ),
  prerequisites: ["graphing-exponential-growth-functions"],
  encompasses: [{ topic: "graphing-exponential-growth-functions", weight: 0.4 }],
  xp: 15,
  standards: ["CCSS.HSF.IF.C.7.E", "CCSS.HSF.LE.A.2"],
  knowledgePoints: [
    {
      id: "decay-equation-from-graph",
      title: t("The equation from the graph", "由图象求解析式"),
      explanation: t(
        "With $0 < b < 1$ the graph of $y = a \\cdot b^{x}$ ($a > 0$) falls from left to right, levelling off toward the $x$-axis. It still crosses the $y$-axis at $(0, a)$, and each step of $1$ to the right multiplies the height by $b$, now a fraction. From $(0, 8)$ and $(1, 4)$: $a = 8$ and $b = \\frac{4}{8} = \\frac{1}{2}$, so $y = 8\\left(\\frac{1}{2}\\right)^{x}$.",
        "当 $0 < b < 1$ 时，$y = a \\cdot b^{x}$（$a > 0$）的图象从左到右下降，并逐渐趋于 $x$ 轴。它仍与 $y$ 轴交于 $(0, a)$，向右每走 $1$ 个单位，高度乘以 $b$（此时 $b$ 是分数）。由 $(0, 8)$ 和 $(1, 4)$ 得 $a = 8$，$b = \\frac{4}{8} = \\frac{1}{2}$，所以 $y = 8\\left(\\frac{1}{2}\\right)^{x}$。",
      ),
      generate: (rng) => equationFromGraphProblem(rng, decayPairs, "ne"),
    },
    {
      id: "decay-horizontal-asymptote",
      title: t("The horizontal asymptote", "水平渐近线"),
      explanation: t(
        "For $0 < b < 1$, $b^{x}$ gets closer and closer to $0$ as $x$ **increases**: $\\left(\\frac{1}{2}\\right)^{10} = \\frac{1}{1024}$. So the graph of a decay function approaches its asymptote on the right. As before, $y = a \\cdot b^{x} + k$ has the asymptote $y = k$.",
        "当 $0 < b < 1$ 时，$x$ **增大**，$b^{x}$ 越来越接近 $0$：$\\left(\\frac{1}{2}\\right)^{10} = \\frac{1}{1024}$。所以衰减函数的图象在右侧靠近渐近线。与之前一样，$y = a \\cdot b^{x} + k$ 的渐近线是 $y = k$。",
      ),
      generate: (rng) => asymptoteProblem(rng, decayBases),
    },
    {
      id: "range-with-reflections",
      title: t("Ranges and reflections", "值域与翻折"),
      explanation: t(
        "A negative coefficient $a$ reflects the graph across its asymptote: $y = -2\\left(\\frac{1}{2}\\right)^{x} + 3$ lies entirely **below** $y = 3$. So for $y = a \\cdot b^{x} + k$:\n\n- if $a > 0$, the range is $(k, \\infty)$;\n- if $a < 0$, the range is $(-\\infty, k)$.\n\nThe asymptote's value $k$ is never taken.",
        "系数 $a$ 为负时，图象关于渐近线翻折：$y = -2\\left(\\frac{1}{2}\\right)^{x} + 3$ 完全位于 $y = 3$ 的**下方**。所以对 $y = a \\cdot b^{x} + k$：\n\n- 若 $a > 0$，值域为 $(k, \\infty)$；\n- 若 $a < 0$，值域为 $(-\\infty, k)$。\n\n渐近线的值 $k$ 永远取不到。",
      ),
      generate: (rng) => rangeProblem(rng, [...decayBases, ...growthBases], true),
    },
  ],
  diagnostic: "decay-equation-from-graph",
};

/** exponentialFunctionTopics are the topics of the exponential functions unit, in teaching order. */
export const exponentialFunctionTopics: readonly TopicDef[] = [
  writingRadicalsUsingFractionalExponents,
  productRuleWithAlgebraicExpressions,
  quotientRuleWithAlgebraicExpressions,
  powerRuleWithAlgebraicExpressions,
  powerOfProductRuleWithAlgebraicExpressions,
  powerOfQuotientRuleWithAlgebraicExpressions,
  combiningRulesOfExponentsWithAlgebraicExpressions,
  solvingExponentialEquations,
  solvingExponentialEquationsWithFractionalSolutions,
  creatingExponentialGrowthExpressions,
  creatingExponentialDecayExpressions,
  exponentialFunctions,
  modelingExponentialGrowthWithFunctions,
  interpretingExponentialGrowth,
  solvingExponentialGrowthProblems,
  modelingExponentialDecayWithFunctions,
  interpretingExponentialDecay,
  solvingExponentialDecayProblems,
  linearVsExponentialGrowthAndDecay,
  linearVsExponentialModels,
  graphingExponentialGrowthFunctions,
  graphingExponentialDecayFunctions,
];
