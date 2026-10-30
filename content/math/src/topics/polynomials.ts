import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { gcd, num, poly } from "@ga/subject-math";

import { choiceProblem, type ExpressionProblem, expressionProblem, numberProblem, steps, yesNo } from "../problems.ts";

/** Term is a monomial c·xᵃ·yᵇ with an integer coefficient. */
interface Term {
  readonly c: number;
  readonly x: number;
  readonly y: number;
}

const term = (c: number, x = 0, y = 0): Term => ({ c, x, y });

/** pw writes a power of a variable: "", "x" or "x^{3}". */
const pw = (v: string, e: number) => (e === 0 ? "" : e === 1 ? v : `${v}^{${e}}`);

/** vars writes the variable part of a term: "x^{2}y". */
const vars = (m: Term) => `${pw("x", m.x)}${pw("y", m.y)}`;

/** write writes terms as a sum, in the order given, with no "+ -", "1x" or "-1x". */
function write(ts: readonly Term[]): string {
  return poly(...ts.map((m) => [m.c, vars(m)] as const));
}

/** mono writes one term. */
const mono = (m: Term) => write([m]);

/** wrap writes terms in parentheses. */
const wrap = (ts: readonly Term[]) => `(${write(ts)})`;

/** front writes a monomial factor before parentheses: "", "-", "3" or "-2x^{2}". */
function front(m: Term): string {
  if (m.x === 0 && m.y === 0) return m.c === 1 ? "" : m.c === -1 ? "-" : String(m.c);
  return mono(m);
}

const degreeOf = (m: Term) => m.x + m.y;
const neg = (m: Term) => term(-m.c, m.x, m.y);
const mul = (a: Term, b: Term) => term(a.c * b.c, a.x + b.x, a.y + b.y);
const scale = (ts: readonly Term[], k: number) => ts.map((m) => term(k * m.c, m.x, m.y));

/** collect combines like terms and sorts them in standard form: decreasing degree, then decreasing power of x. */
function collect(ts: readonly Term[]): Term[] {
  const sums = new Map<string, Term>();
  for (const m of ts) {
    const key = `${m.x},${m.y}`;
    const prev = sums.get(key);
    sums.set(key, term((prev?.c ?? 0) + m.c, m.x, m.y));
  }
  return [...sums.values()].filter((m) => m.c !== 0).sort((a, b) => degreeOf(b) - degreeOf(a) || b.x - a.x);
}

/** products lists every term of a times every term of b, uncombined. */
const products = (a: readonly Term[], b: readonly Term[]) => a.flatMap((p) => b.map((q) => mul(p, q)));

/** times multiplies two polynomials and writes the result in standard form. */
const times = (a: readonly Term[], b: readonly Term[]) => collect(products(a, b));

/** signed writes a term after another, with its sign as the operator: "- 3x", "+ 5". */
const signed = (s: string) => (s.startsWith("-") ? `- ${s.slice(1)}` : `+ ${s}`);

/** scramble shuffles terms so that the term of highest degree does not come first. */
function scramble(rng: Rng, ts: readonly Term[]): Term[] {
  const out = rng.shuffle(ts);
  const top = Math.max(...ts.map(degreeOf));
  if (out.length > 1 && degreeOf(out[0]!) === top) out.push(out.shift()!);
  return out;
}

/** choose is the binomial coefficient C(n, k). */
function choose(n: number, k: number): number {
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return r;
}

/** binomialPower expands (a + b)ⁿ for two terms, with the coefficients given (normally the row of Pascal's triangle). */
function binomialPower(a: Term, b: Term, n: number, coef = (i: number) => choose(n, i), bc = (i: number) => b.c ** i): Term[] {
  const ts: Term[] = [];
  for (let i = 0; i <= n; i++) ts.push(term(coef(i) * a.c ** (n - i) * bc(i), a.x * (n - i) + b.x * i, a.y * (n - i) + b.y * i));
  return collect(ts);
}

/** factorPower writes a factor raised to a power for a worked solution: "", "(2x)", "(-3)^{2}". */
function factorPower(m: Term, e: number): string {
  return e === 0 ? "" : e === 1 ? `(${mono(m)})` : `(${mono(m)})^{${e}}`;
}

/** binomialSteps writes the expansion of (a + b)ⁿ term by term: "(x)^{3} + 3(x)^{2}(-2) + …". */
function binomialSteps(a: Term, b: Term, n: number): string {
  const parts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const c = choose(n, i);
    parts.push(`${c === 1 ? "" : c}${factorPower(a, n - i)}${factorPower(b, i)}`);
  }
  return parts.join(" + ");
}

/** expandProblem builds a problem whose answer is a polynomial in simplest form. */
const expandProblem = (p: Omit<ExpressionProblem, "simplified">): Problem => expressionProblem({ ...p, simplified: true });

/** substituted writes a polynomial in x with a value substituted: "3(-2)^{2} - 5(-2) + 1". */
function substituted(ts: readonly Term[], v: number): string {
  let out = "";
  for (const m of ts) {
    const a = Math.abs(m.c);
    const body = m.x === 0 ? String(a) : `${a === 1 ? "" : a}(${num(v)})${m.x === 1 ? "" : `^{${m.x}}`}`;
    out += out === "" ? (m.c < 0 ? `-${body}` : body) : m.c < 0 ? ` - ${body}` : ` + ${body}`;
  }
  return out;
}

/** valueAt evaluates a polynomial in x at v. */
const valueAt = (ts: readonly Term[], v: number) => ts.reduce((s, m) => s + m.c * v ** m.x, 0);

/** groups writes the like terms of ts in parentheses, in standard order: "(4x^{2} - x^{2}) + (-3x + 5x)". */
function groups(ts: readonly Term[]): string {
  return collect(ts.map((m) => term(1, m.x, m.y)))
    .map((k) => `(${write(ts.filter((m) => m.x === k.x && m.y === k.y))})`)
    .join(" + ");
}

/** coefficientNote explains a hidden coefficient of 1 or -1: ", which means $-1 \cdot x^{2}$". */
function coefficientNote(m: Term): Text {
  if (Math.abs(m.c) !== 1 || degreeOf(m) === 0) return t("", "");
  return t(`, which means $${m.c} \\cdot ${vars(m)}$`, `，即 $${m.c} \\cdot ${vars(m)}$`);
}

export const introductionToPolynomials: TopicDef = {
  id: "introduction-to-polynomials",
  title: t("Introduction to Polynomials", "多项式简介"),
  summary: t(
    "Recognize polynomials, name their terms, coefficients and constant term, and evaluate them.",
    "识别多项式，说出它的项、系数和常数项，并求多项式的值。",
  ),
  prerequisites: ["evaluating-expressions"],
  encompasses: [{ topic: "evaluating-expressions", weight: 0.3 }],
  xp: 12,
  standards: ["CCSS.HSA.SSE.A.1.A"],
  knowledgePoints: [
    {
      id: "terms-and-coefficients",
      title: t("Terms, coefficients and the constant term", "项、系数与常数项"),
      explanation: t(
        "A **polynomial** is a sum of **terms**, each a number times a variable raised to a whole-number power, such as $4x^{3} - x^{2} + 7x - 5$. The sign in front of a term belongs to it: the terms here are $4x^{3}$, $-x^{2}$, $7x$ and $-5$.\n\nThe number in a term is its **coefficient**: the coefficient of $x^{3}$ is $4$, the coefficient of $x^{2}$ is $-1$ (because $-x^{2} = -1 \\cdot x^{2}$) and the coefficient of $x$ is $7$. The term with no variable, here $-5$, is the **constant term**. A polynomial in which every term contains the variable, such as $2x^{2} + x$, has constant term $0$.",
        "**多项式**是若干**项**的和，每一项都是一个数乘以变量的自然数次幂，例如 $4x^{3} - x^{2} + 7x - 5$。项前面的符号属于这一项：这里的项是 $4x^{3}$、$-x^{2}$、$7x$ 和 $-5$。\n\n项中的数叫做这一项的**系数**：$x^{3}$ 的系数是 $4$，$x^{2}$ 的系数是 $-1$（因为 $-x^{2} = -1 \\cdot x^{2}$），$x$ 的系数是 $7$。不含变量的项（这里是 $-5$）叫做**常数项**。如果每一项都含有变量，例如 $2x^{2} + x$，那么常数项是 $0$。",
      ),
      generate(rng) {
        const askConstant = rng.bool(0.35);
        const powers = rng.sample([1, 2, 3, 4, 5], rng.int(2, 3));
        if (rng.bool(askConstant ? 0.8 : 0.6)) powers.push(0);
        const ts = collect(powers.map((e) => term(rng.bool(0.25) ? rng.sign() : rng.nonZero(-9, 9), e)));
        const shown = rng.shuffle(ts);
        const expr = write(shown);
        const lead = ts[0]!;
        if (askConstant) {
          const c0 = ts.find((m) => m.x === 0)?.c ?? 0;
          return numberProblem({
            prompt: t(`What is the constant term of $${expr}$?`, `$${expr}$ 的常数项是多少？`),
            answer: c0,
            wrong: [-c0, lead.c, ts.length, shown[shown.length - 1]!.c],
            solution:
              c0 === 0
                ? t(
                    `Every term of $${expr}$ contains $x$, so the constant term is $0$.`,
                    `$${expr}$ 的每一项都含有 $x$，所以常数项是 $0$。`,
                  )
                : t(
                    `The term with no variable is $${num(c0)}$, sign included, so the constant term is $${num(c0)}$.`,
                    `不含变量的项是 $${num(c0)}$（连同符号），所以常数项是 $${num(c0)}$。`,
                  ),
          });
        }
        const target = rng.pick(ts.filter((m) => m.x > 0));
        const other = rng.pick(ts.filter((m) => m !== target));
        const note = coefficientNote(target);
        return numberProblem({
          prompt: t(`What is the coefficient of $${vars(target)}$ in $${expr}$?`, `在 $${expr}$ 中，$${vars(target)}$ 的系数是多少？`),
          answer: target.c,
          wrong: [-target.c, target.x, other.c],
          solution: t(
            `The term containing $${vars(target)}$ is $${mono(target)}$${note.en}, so the coefficient is $${num(target.c)}$.`,
            `含 $${vars(target)}$ 的项是 $${mono(target)}$${note["zh-CN"]}，所以系数是 $${num(target.c)}$。`,
          ),
        });
      },
    },
    {
      id: "identifying-polynomials",
      title: t("Recognizing polynomials", "识别多项式"),
      explanation: t(
        "In a polynomial, every exponent of the variable is a whole number ($0, 1, 2, \\dots$), and the variable is only multiplied, never divided by or put under a root. Coefficients may be any numbers, fractions and roots of numbers included: $\\frac{x^{2}}{3} = \\frac{1}{3}x^{2}$ and $\\sqrt{2}x$ are terms of a polynomial.\n\nThese are **not** terms of a polynomial: a negative exponent such as $5x^{-2}$; a variable in a denominator such as $\\frac{4}{x}$, which equals $4x^{-1}$; a root of the variable such as $\\sqrt{x}$; and the variable in an exponent such as $2^{x}$.",
        "在多项式中，变量的指数都是自然数（$0, 1, 2, \\dots$），变量只做乘法，不作除数，也不在根号里。系数可以是任意数，包括分数和数的方根：$\\frac{x^{2}}{3} = \\frac{1}{3}x^{2}$ 和 $\\sqrt{2}x$ 都可以是多项式的项。\n\n以下都**不是**多项式的项：负指数，例如 $5x^{-2}$；变量在分母中，例如 $\\frac{4}{x}$，它等于 $4x^{-1}$；变量的方根，例如 $\\sqrt{x}$；变量在指数上，例如 $2^{x}$。",
      ),
      generate(rng) {
        const a = rng.nonZero(-9, 9);
        const m = rng.int(2, 5);
        const b = rng.nonZero(-12, 12);
        const k = rng.int(1, 3);
        const c = rng.int(2, 9);
        const isPoly = rng.bool();
        const kind = isPoly
          ? rng.pick(["fraction", "fractionCoef", "rootCoef"] as const)
          : rng.pick(["negative", "denominator", "root", "exponent"] as const);
        let p = 1;
        let q = 2;
        do {
          q = rng.int(2, 9);
          p = rng.int(1, q - 1);
        } while (gcd(p, q) !== 1);
        const r = rng.pick([2, 3, 5, 6, 7]);
        const special: string = {
          negative: `${c}x^{-${k}}`,
          denominator: `\\frac{${c}}{${pw("x", k)}}`,
          root: `${c}\\sqrt{x}`,
          exponent: `${c}^{x}`,
          fraction: `\\frac{${pw("x", k)}}{${c}}`,
          fractionCoef: `\\frac{${p}}{${q}}${pw("x", k)}`,
          rootCoef: `\\sqrt{${r}}${pw("x", k)}`,
        }[kind];
        const reason: Text = {
          negative: t(`$${special}$ has a negative exponent`, `$${special}$ 的指数是负数`),
          denominator: t(
            `$${special}$ has the variable in the denominator: it equals $${c}x^{-${k}}$`,
            `$${special}$ 的分母含有变量：它等于 $${c}x^{-${k}}$`,
          ),
          root: t(`$${special}$ contains a root of the variable`, `$${special}$ 含有变量的方根`),
          exponent: t(`$${special}$ has the variable in the exponent`, `$${special}$ 的变量在指数上`),
          fraction: t(
            `$${special} = \\frac{1}{${c}}${pw("x", k)}$ has the coefficient $\\frac{1}{${c}}$`,
            `$${special} = \\frac{1}{${c}}${pw("x", k)}$ 的系数是 $\\frac{1}{${c}}$`,
          ),
          fractionCoef: t(`$${special}$ has the coefficient $\\frac{${p}}{${q}}$`, `$${special}$ 的系数是 $\\frac{${p}}{${q}}$`),
          rootCoef: t(
            `$\\sqrt{${r}}$ is a number, so $${special}$ has the coefficient $\\sqrt{${r}}$`,
            `$\\sqrt{${r}}$ 是一个数，所以 $${special}$ 的系数是 $\\sqrt{${r}}$`,
          ),
        }[kind];
        const parts = [mono(term(a, m)), rng.bool() ? `-${special}` : special, String(b)];
        const order = rng.pick([
          [0, 1, 2],
          [1, 0, 2],
          [0, 2, 1],
          [1, 2, 0],
        ]);
        const expr = order.map((i, j) => (j === 0 ? parts[i]! : signed(parts[i]!))).join(" ");
        return choiceProblem({
          prompt: t(`Is $${expr}$ a polynomial?`, `$${expr}$ 是多项式吗？`),
          options: yesNo,
          correct: isPoly ? 0 : 1,
          solution: isPoly
            ? t(
                `${reason.en}. Every term is a number times a whole-number power of $x$, so the expression is a polynomial.`,
                `${reason["zh-CN"]}。每一项都是一个数乘以 $x$ 的自然数次幂，所以它是多项式。`,
              )
            : t(`${reason.en}, so the expression is not a polynomial.`, `${reason["zh-CN"]}，所以它不是多项式。`),
        });
      },
    },
    {
      id: "evaluating-polynomials",
      title: t("Evaluating a polynomial", "求多项式的值"),
      explanation: t(
        "To evaluate a polynomial, substitute the value for the variable **in parentheses** and follow the order of operations: powers first, then products, then sums. For $x = -2$:\n\n$$3x^{2} - 5x + 1 = 3(-2)^{2} - 5(-2) + 1 = 12 + 10 + 1 = 23$$\n\nThe parentheses matter: $(-2)^{2} = 4$, while $-2^{2} = -4$.",
        "求多项式的值时，把变量替换成它的值并**加上括号**，然后按运算顺序计算：先乘方，再乘法，最后加减。当 $x = -2$ 时：\n\n$$3x^{2} - 5x + 1 = 3(-2)^{2} - 5(-2) + 1 = 12 + 10 + 1 = 23$$\n\n括号很重要：$(-2)^{2} = 4$，而 $-2^{2} = -4$。",
      ),
      keyPrerequisites: ["evaluating-expressions"],
      generate(rng) {
        const cubic = rng.bool(0.4);
        const ts = cubic
          ? collect([term(rng.nonZero(-3, 3), 3), term(rng.nonZero(-6, 6), rng.pick([2, 1])), term(rng.nonZero(-9, 9), 0)])
          : collect([term(rng.nonZero(-5, 5), 2), term(rng.nonZero(-9, 9), 1), term(rng.nonZero(-9, 9), 0)]);
        const v = cubic ? rng.nonZero(-3, 3) : rng.nonZero(-5, 5);
        const expr = write(ts);
        const value = valueAt(ts, v);
        const values = poly(...ts.map((m) => [m.c * v ** m.x, ""] as const));
        return numberProblem({
          prompt: t(`Evaluate $${expr}$ when $x = ${num(v)}$.`, `当 $x = ${num(v)}$ 时，求 $${expr}$ 的值。`),
          answer: value,
          wrong: [
            ts.reduce((s, m) => s + m.c * (m.x % 2 === 0 && m.x > 0 ? -(Math.abs(v) ** m.x) : v ** m.x), 0),
            ts.reduce((s, m) => s + m.c * (m.x === 0 ? 1 : m.x * v), 0),
            ts.reduce((s, m) => s + m.c * (m.x === 1 ? -v : v ** m.x), 0),
          ],
          solution: t(
            `Substitute $${num(v)}$ for $x$, in parentheses:${steps(`${expr} = ${substituted(ts, v)} = ${values} = ${num(value)}`)}`,
            `把 $x$ 替换为 $${num(v)}$，并加上括号：${steps(`${expr} = ${substituted(ts, v)} = ${values} = ${num(value)}`)}`,
          ),
        });
      },
    },
  ],
};

export const degreeOfAPolynomial: TopicDef = {
  id: "degree-of-a-polynomial",
  title: t("The Degree of a Polynomial", "多项式的次数"),
  summary: t(
    "Find the degree of a monomial and of a polynomial in one or several variables.",
    "求单项式的次数，以及一元或多元多项式的次数。",
  ),
  prerequisites: ["introduction-to-polynomials"],
  encompasses: [{ topic: "introduction-to-polynomials", weight: 0.3 }],
  xp: 10,
  standards: ["CCSS.HSA.SSE.A.1.A"],
  knowledgePoints: [
    {
      id: "degree-of-a-monomial",
      title: t("The degree of a monomial", "单项式的次数"),
      explanation: t(
        "A polynomial with a single term is a **monomial**. The **degree** of a monomial is the sum of the exponents of its variables; the coefficient plays no part. A variable written without an exponent has exponent $1$.\n\n$$-4x^{3}y^{2} \\text{ has degree } 3 + 2 = 5 \\qquad 7xy \\text{ has degree } 1 + 1 = 2$$\n\nA nonzero constant such as $9$ has no variable, so its degree is $0$.",
        "只有一项的多项式叫做**单项式**。单项式的**次数**是其中所有变量的指数之和，与系数无关。不写指数的变量，指数是 $1$。\n\n$$-4x^{3}y^{2} \\text{ 的次数是 } 3 + 2 = 5 \\qquad 7xy \\text{ 的次数是 } 1 + 1 = 2$$\n\n不为零的常数（例如 $9$）不含变量，所以次数是 $0$。",
      ),
      generate(rng) {
        if (rng.bool(0.1)) {
          const c = rng.nonZero(-20, 20);
          return numberProblem({
            prompt: t(`What is the degree of the monomial $${c}$?`, `单项式 $${c}$ 的次数是多少？`),
            answer: 0,
            wrong: [c, 1],
            solution: t(
              `$${c}$ is a nonzero constant: it contains no variable, so its degree is $0$.`,
              `$${c}$ 是不为零的常数，不含变量，所以次数是 $0$。`,
            ),
          });
        }
        const count = rng.pick([1, 2, 2, 3]);
        const exps = [rng.int(1, 9), count >= 2 ? rng.int(1, 6) : 0, count === 3 ? rng.int(1, 4) : 0];
        const c = rng.pick([1, -1, rng.nonZero(-12, 12), rng.nonZero(-12, 12)]);
        const body = `${pw("x", exps[0]!)}${pw("y", exps[1]!)}${pw("z", exps[2]!)}`;
        const s = `${c === 1 ? "" : c === -1 ? "-" : c}${body}`;
        const used = exps.filter((e) => e > 0);
        const d = used.reduce((x, y) => x + y, 0);
        return numberProblem({
          prompt: t(`What is the degree of the monomial $${s}$?`, `单项式 $${s}$ 的次数是多少？`),
          answer: d,
          wrong: [Math.max(...used), Math.abs(c), used.reduce((x, y) => x * y, 1)],
          solution:
            used.length === 1
              ? t(
                  `The only variable is $x$, with exponent $${d}$, so the degree is $${d}$.`,
                  `唯一的变量是 $x$，指数是 $${d}$，所以次数是 $${d}$。`,
                )
              : t(
                  `Add the exponents of the variables: $${used.join(" + ")} = ${d}$. The degree is $${d}$.`,
                  `把各变量的指数相加：$${used.join(" + ")} = ${d}$。次数是 $${d}$。`,
                ),
        });
      },
    },
    {
      id: "degree-in-one-variable",
      title: t("The degree of a polynomial", "多项式的次数"),
      explanation: t(
        "The **degree** of a polynomial is the greatest degree of its terms. In one variable, it is the greatest exponent. Terms are not always written in order, so look at every term:\n\n$$3x^{2} - x^{5} + 4 \\text{ has degree } 5$$",
        "多项式的**次数**是它各项次数中最大的一个。对一元多项式，就是最大的指数。各项不一定按顺序书写，所以要查看每一项：\n\n$$3x^{2} - x^{5} + 4 \\text{ 的次数是 } 5$$",
      ),
      generate(rng) {
        const powers = rng.sample([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], rng.int(3, 4));
        const ts = powers.map((e) => term(rng.nonZero(-9, 9), e));
        const shown = scramble(rng, ts);
        const d = Math.max(...powers);
        const expr = write(shown);
        const list = shown.map((m) => m.x).join(", ");
        return numberProblem({
          prompt: t(`What is the degree of $${expr}$?`, `$${expr}$ 的次数是多少？`),
          answer: d,
          wrong: [shown[0]!.x, ts.length, Math.max(...ts.map((m) => Math.abs(m.c)))],
          solution: t(
            `The terms have degrees $${list}$. The greatest is $${d}$, so the polynomial has degree $${d}$.`,
            `各项的次数依次是 $${list}$，最大的是 $${d}$，所以多项式的次数是 $${d}$。`,
          ),
        });
      },
    },
    {
      id: "degree-in-several-variables",
      title: t("Polynomials in several variables", "多元多项式的次数"),
      explanation: t(
        "When a polynomial has several variables, find the degree of each term by adding its exponents, then take the greatest. The degree is not the greatest single exponent:\n\n$$x^{4} + 3x^{2}y^{3} - y$$\n\nhas terms of degree $4$, $2 + 3 = 5$ and $1$, so its degree is $5$.",
        "多项式含有多个变量时，先把每一项的指数相加得到这一项的次数，再取最大的。次数不是单个指数中最大的那个：\n\n$$x^{4} + 3x^{2}y^{3} - y$$\n\n各项的次数是 $4$、$2 + 3 = 5$ 和 $1$，所以它的次数是 $5$。",
      ),
      generate(rng) {
        const i = rng.int(2, 4);
        const j = rng.int(2, 4);
        const e = rng.int(Math.max(i, j) + 1, i + j - 1);
        const a = term(rng.nonZero(-9, 9), i, j);
        const b = rng.bool() ? term(rng.nonZero(-9, 9), e, 0) : term(rng.nonZero(-9, 9), 0, e);
        const c = rng.pick([
          term(rng.nonZero(-9, 9), 1, 1),
          term(rng.nonZero(-9, 9), 1, 0),
          term(rng.nonZero(-9, 9), 0, 1),
          term(rng.nonZero(-12, 12)),
        ]);
        const shown = rng.shuffle([a, b, c]);
        const expr = write(shown);
        const list = shown.map((m) => (m.x > 0 && m.y > 0 ? `${m.x} + ${m.y} = ${degreeOf(m)}` : String(degreeOf(m)))).join(", \\; ");
        return numberProblem({
          prompt: t(`What is the degree of $${expr}$?`, `$${expr}$ 的次数是多少？`),
          answer: i + j,
          wrong: [e, shown.reduce((s, m) => s + m.x + m.y, 0), degreeOf(shown[0]!)],
          solution: t(
            `The degrees of the terms, in order, are $${list}$. The greatest is $${i + j}$.`,
            `各项的次数依次是 $${list}$，最大的是 $${i + j}$。`,
          ),
        });
      },
    },
  ],
};

export const simplifyingPolynomials: TopicDef = {
  id: "simplifying-polynomials",
  title: t("Simplifying Polynomials", "化简多项式"),
  summary: t(
    "Combine like terms and write polynomials in standard form, in order of decreasing powers.",
    "合并同类项，并按降幂排列把多项式写成标准形式。",
  ),
  prerequisites: ["degree-of-a-polynomial", "combining-like-terms"],
  encompasses: [
    { topic: "combining-like-terms", weight: 0.7 },
    { topic: "degree-of-a-polynomial", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.HSA.SSE.A.1.A"],
  knowledgePoints: [
    {
      id: "standard-form",
      title: t("Standard form and the leading coefficient", "标准形式与首项系数"),
      explanation: t(
        "A polynomial in one variable is in **standard form** when its terms are written in order of decreasing exponents, with the constant term last. Each term keeps its sign when it moves:\n\n$$-2x + 5x^{3} + 7 - x^{2} = 5x^{3} - x^{2} - 2x + 7$$\n\nIn standard form, the first term is the **leading term** and its coefficient is the **leading coefficient**: here $5x^{3}$ and $5$.",
        "一元多项式的各项按指数从大到小排列、常数项放在最后时，叫做**标准形式**（降幂排列）。每一项移动时都带着自己的符号：\n\n$$-2x + 5x^{3} + 7 - x^{2} = 5x^{3} - x^{2} - 2x + 7$$\n\n在标准形式中，第一项叫做**首项**，它的系数叫做**首项系数**：这里分别是 $5x^{3}$ 和 $5$。",
      ),
      generate(rng) {
        const powers = rng.sample([0, 1, 2, 3, 4, 5, 6], rng.int(3, 4));
        const ts = collect(powers.map((e) => term(rng.nonZero(-9, 9), e)));
        const shown = scramble(rng, ts);
        const expr = write(shown);
        const standard = write(ts);
        const lead = ts[0]!;
        const last = ts[ts.length - 1]!;
        if (rng.bool(0.4)) {
          return numberProblem({
            prompt: t(`What is the leading coefficient of $${expr}$?`, `$${expr}$ 的首项系数是多少？`),
            answer: lead.c,
            wrong: [shown[0]!.c, lead.x, last.c],
            solution: t(
              `In standard form, $${expr} = ${standard}$. The leading term is $${mono(lead)}$, so the leading coefficient is $${num(lead.c)}$.`,
              `写成标准形式：$${expr} = ${standard}$。首项是 $${mono(lead)}$，所以首项系数是 $${num(lead.c)}$。`,
            ),
          });
        }
        const options = rng.shuffle([
          standard,
          write([...ts].reverse()),
          write([neg(lead), ...ts.slice(1)]),
          write([...ts.slice(0, -1), neg(last)]),
        ]);
        return choiceProblem({
          prompt: t(`Which is $${expr}$ written in standard form?`, `把 $${expr}$ 写成标准形式，是下面哪一个？`),
          options: options.map((o) => same(`$${o}$`)),
          correct: options.indexOf(standard),
          solution: t(
            `Order the terms by decreasing exponent, each with its own sign: $${standard}$.`,
            `把各项按指数从大到小排列，每一项带着自己的符号：$${standard}$。`,
          ),
        });
      },
    },
    {
      id: "combining-like-terms-in-polynomials",
      title: t("Combining like terms", "合并同类项"),
      explanation: t(
        "To simplify a polynomial, combine its **like terms**, the terms with the same variable raised to the same power, then write the result in standard form. $x^{2}$ and $x$ are **not** like terms.\n\n$$4x^{2} - 3x + 2 - x^{2} + 5x - 7 = (4x^{2} - x^{2}) + (-3x + 5x) + (2 - 7) = 3x^{2} + 2x - 5$$",
        "化简多项式时，把**同类项**（变量相同、指数也相同的项）合并，再把结果写成标准形式。$x^{2}$ 和 $x$ **不是**同类项。\n\n$$4x^{2} - 3x + 2 - x^{2} + 5x - 7 = (4x^{2} - x^{2}) + (-3x + 5x) + (2 - 7) = 3x^{2} + 2x - 5$$",
      ),
      keyPrerequisites: ["combining-like-terms"],
      generate(rng) {
        let ts: Term[];
        let answer: Term[];
        let d: number;
        do {
          d = rng.int(2, 3);
          ts = [];
          for (let e = d; e >= 0; e--) {
            const n = e === d || rng.bool(0.6) ? 2 : 1;
            for (let i = 0; i < n; i++) ts.push(term(rng.nonZero(-9, 9), e));
          }
          answer = collect(ts);
        } while (answer.length < 2 || answer[0]!.x !== d);
        const shown = rng.shuffle(ts);
        const expr = write(shown);
        const k = rng.int(0, shown.length - 1);
        const nonConstant = ts.filter((m) => m.x > 0).reduce((s, m) => s + m.c, 0);
        return expandProblem({
          prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
          answer: write(answer),
          wrong: [
            write(collect([term(nonConstant, d), ...ts.filter((m) => m.x === 0)])),
            write(collect(shown.map((m, i) => (i === k ? neg(m) : m)))),
            expr,
          ],
          solution: t(
            `Group the like terms, then combine them:${steps(`${expr} = ${groups(shown)} = ${write(answer)}`)}`,
            `把同类项归在一起，再合并：${steps(`${expr} = ${groups(shown)} = ${write(answer)}`)}`,
          ),
        });
      },
    },
    {
      id: "like-terms-in-several-variables",
      title: t("Like terms in several variables", "多元多项式的同类项"),
      explanation: t(
        "With several variables, like terms have the same power of **every** variable. $3x^{2}y$ and $-x^{2}y$ are like terms, but $x^{2}y$ and $xy^{2}$ are not: one has two factors of $x$, the other two factors of $y$.\n\n$$5x^{2}y - 2xy^{2} - 3x^{2}y + 6xy^{2} = 2x^{2}y + 4xy^{2}$$",
        "多个变量时，同类项中**每个**变量的指数都要相同。$3x^{2}y$ 和 $-x^{2}y$ 是同类项，但 $x^{2}y$ 和 $xy^{2}$ 不是：一个含两个 $x$，另一个含两个 $y$。\n\n$$5x^{2}y - 2xy^{2} - 3x^{2}y + 6xy^{2} = 2x^{2}y + 4xy^{2}$$",
      ),
      generate(rng) {
        const others: readonly (readonly [number, number])[] = [
          [1, 1],
          [2, 0],
          [0, 2],
          [1, 0],
          [0, 1],
          [0, 0],
        ];
        let ts: Term[];
        let answer: Term[];
        do {
          const [ox, oy] = rng.pick(others);
          ts = [
            term(rng.nonZero(-9, 9), 2, 1),
            term(rng.nonZero(-9, 9), 2, 1),
            term(rng.nonZero(-9, 9), 1, 2),
            term(rng.nonZero(-9, 9), 1, 2),
            term(rng.nonZero(-9, 9), ox, oy),
          ];
          if (rng.bool()) ts.push(term(rng.nonZero(-9, 9), ox, oy));
          answer = collect(ts);
        } while (!answer.some((m) => m.x === 2 && m.y === 1) || !answer.some((m) => m.x === 1 && m.y === 2));
        const shown = rng.shuffle(ts);
        const expr = write(shown);
        const k = rng.int(0, shown.length - 1);
        const merged = ts.filter((m) => m.x + m.y === 3).reduce((s, m) => s + m.c, 0);
        return expandProblem({
          prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
          answer: write(answer),
          wrong: [
            write(collect([term(merged, 2, 1), ...ts.filter((m) => m.x + m.y !== 3)])),
            write(collect(shown.map((m, i) => (i === k ? neg(m) : m)))),
            expr,
          ],
          solution: t(
            `Group the like terms, then combine them:${steps(`${expr} = ${groups(shown)} = ${write(answer)}`)}`,
            `把同类项归在一起，再合并：${steps(`${expr} = ${groups(shown)} = ${write(answer)}`)}`,
          ),
        });
      },
    },
  ],
};

export const distributiveLawForPolynomials: TopicDef = {
  id: "distributive-law-for-polynomials",
  title: t("The Distributive Law for Polynomials", "单项式乘多项式"),
  summary: t(
    "Multiply a polynomial by a number or a monomial, and simplify sums of such products.",
    "用一个数或单项式乘多项式，并化简这类乘积的和。",
  ),
  prerequisites: ["simplifying-polynomials", "simplifying-expressions", "product-and-quotient-rules"],
  encompasses: [
    { topic: "simplifying-expressions", weight: 0.5 },
    { topic: "product-and-quotient-rules", weight: 0.4 },
  ],
  xp: 14,
  standards: ["CCSS.HSA.APR.A.1"],
  knowledgePoints: [
    {
      id: "number-times-polynomial",
      title: t("A number times a polynomial", "数乘多项式"),
      explanation: t(
        "The distributive law works for polynomials with any number of terms: the factor outside multiplies **every** term inside.\n\n$$-3(2x^{2} - 5x + 4) = (-3)(2x^{2}) + (-3)(-5x) + (-3)(4) = -6x^{2} + 15x - 12$$\n\nA negative factor changes the sign of every term, the last one included.",
        "分配律对任意多项的多项式都成立：括号外的因数要乘以括号内的**每一项**。\n\n$$-3(2x^{2} - 5x + 4) = (-3)(2x^{2}) + (-3)(-5x) + (-3)(4) = -6x^{2} + 15x - 12$$\n\n负的因数会改变每一项的符号，包括最后一项。",
      ),
      keyPrerequisites: ["distributive-property"],
      generate(rng) {
        const k = rng.bool(0.15) ? -1 : rng.sign() * rng.int(2, 9);
        const p = collect(rng.sample([0, 1, 2, 3, 4], 3).map((e) => term(rng.nonZero(-9, 9), e)));
        const expr = `${front(term(k))}${wrap(p)}`;
        const answer = write(scale(p, k));
        const shown = p.map((m) => `(${num(k)})(${mono(m)})`).join(" + ");
        return expandProblem({
          prompt: t(`Expand $${expr}$.`, `展开 $${expr}$。`),
          answer,
          wrong: [
            write([mul(term(k), p[0]!), ...p.slice(1)]),
            write([mul(term(k), p[0]!), ...scale(p.slice(1), Math.abs(k))]),
            write(scale(p, -k)),
          ],
          solution: t(
            `Multiply every term by $${num(k)}$:${steps(`${expr} = ${shown} = ${answer}`)}`,
            `用 $${num(k)}$ 乘以每一项：${steps(`${expr} = ${shown} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "monomial-times-polynomial",
      title: t("A monomial times a polynomial", "单项式乘多项式"),
      explanation: t(
        "To multiply a polynomial by a monomial, multiply each term by the monomial, using the product rule $x^{m} \\cdot x^{n} = x^{m + n}$: multiply the coefficients and **add** the exponents.\n\n$$2x^{3}(4x^{2} - x + 5) = 8x^{5} - 2x^{4} + 10x^{3}$$\n\nThe constant term is multiplied by the power of $x$ too: $2x^{3} \\cdot 5 = 10x^{3}$.",
        "单项式乘多项式时，用单项式乘以每一项，并运用同底数幂的乘法 $x^{m} \\cdot x^{n} = x^{m + n}$：系数相乘，指数**相加**。\n\n$$2x^{3}(4x^{2} - x + 5) = 8x^{5} - 2x^{4} + 10x^{3}$$\n\n常数项也要乘以 $x$ 的幂：$2x^{3} \\cdot 5 = 10x^{3}$。",
      ),
      keyPrerequisites: ["product-and-quotient-rules"],
      generate(rng) {
        const m = term(rng.bool(0.15) ? rng.sign() : rng.nonZero(-6, 6), rng.int(1, 4));
        const powers = rng.sample([1, 2, 3], rng.int(1, 2));
        powers.push(0);
        const p = collect(powers.map((e) => term(rng.nonZero(-9, 9), e)));
        const expr = `${front(m)}${wrap(p)}`;
        const answer = write(times([m], p));
        return expandProblem({
          prompt: t(`Expand $${expr}$.`, `展开 $${expr}$。`),
          answer,
          wrong: [
            write(collect(p.map((q) => term(m.c * q.c, m.x * q.x)))),
            write(p.map((q) => (q.x === 0 ? term(m.c * q.c) : mul(m, q)))),
            write([mul(m, p[0]!), ...p.slice(1)]),
          ],
          solution: t(
            `Multiply every term by $${mono(m)}$, adding the exponents:${steps(`${expr} = ${p.map((q) => `(${mono(m)})(${mono(q)})`).join(" + ")} = ${answer}`)}`,
            `用 $${mono(m)}$ 乘以每一项，指数相加：${steps(`${expr} = ${p.map((q) => `(${mono(m)})(${mono(q)})`).join(" + ")} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "several-variables",
      title: t("Monomials in several variables", "多元单项式乘多项式"),
      explanation: t(
        "With several variables, add the exponents of each variable separately. A variable missing from a term has exponent $0$:\n\n$$-2xy(3x - 4y + 1) = -6x^{2}y + 8xy^{2} - 2xy$$",
        "多个变量时，每个变量的指数分别相加。某一项不含某个变量，就相当于这个变量的指数是 $0$：\n\n$$-2xy(3x - 4y + 1) = -6x^{2}y + 8xy^{2} - 2xy$$",
      ),
      generate(rng) {
        let i: number;
        let j: number;
        let m: Term;
        let p: Term[];
        do {
          i = rng.int(0, 2);
          j = rng.int(0, 2);
          m = term(rng.bool(0.2) ? rng.sign() : rng.nonZero(-6, 6), i, j);
          const keys = rng.pick([
            [
              [2, 0],
              [1, 1],
              [0, 2],
            ],
            [
              [1, 0],
              [0, 1],
              [0, 0],
            ],
            [
              [1, 0],
              [0, 1],
            ],
            [
              [2, 0],
              [0, 1],
            ],
            [
              [1, 1],
              [0, 0],
            ],
          ] as const);
          p = collect(keys.map(([a, b]) => term(rng.nonZero(-9, 9), a, b)));
        } while (i + j === 0);
        const expr = `${front(m)}${wrap(p)}`;
        const answer = write(times([m], p));
        return expandProblem({
          prompt: t(`Expand $${expr}$.`, `展开 $${expr}$。`),
          answer,
          wrong: [write([mul(m, p[0]!), ...p.slice(1)]), write(scale(p, m.c)), write(times([term(Math.abs(m.c), i, j)], p))],
          solution: t(
            `Multiply every term by $${mono(m)}$, adding the exponents of each variable:${steps(`${expr} = ${p.map((q) => `(${mono(m)})(${mono(q)})`).join(" + ")} = ${answer}`)}`,
            `用 $${mono(m)}$ 乘以每一项，每个变量的指数分别相加：${steps(`${expr} = ${p.map((q) => `(${mono(m)})(${mono(q)})`).join(" + ")} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "expanding-and-simplifying",
      title: t("Expanding, then simplifying", "先展开，再化简"),
      explanation: t(
        "When an expression has several products, expand each one, then combine like terms. With a minus sign in front of a product, the negative factor multiplies every term in the parentheses:\n\n$$x(3x - 2) - 2(x^{2} + 4x - 1) = 3x^{2} - 2x - 2x^{2} - 8x + 2 = x^{2} - 10x + 2$$",
        "式子中有几个乘积时，先把每个乘积展开，再合并同类项。乘积前面是减号时，这个负的因数要乘以括号内的每一项：\n\n$$x(3x - 2) - 2(x^{2} + 4x - 1) = 3x^{2} - 2x - 2x^{2} - 8x + 2 = x^{2} - 10x + 2$$",
      ),
      keyPrerequisites: ["simplifying-expressions"],
      generate(rng) {
        let m: Term;
        let p: Term[];
        let k: number;
        let q: Term[];
        let answer: Term[];
        do {
          m = term(rng.nonZero(-5, 5), 1);
          p = [term(rng.nonZero(-6, 6), 1), term(rng.nonZero(-9, 9))];
          k = rng.nonZero(-6, 6);
          q = [term(rng.pick([1, 1, 2, 3, -1]), 2), term(rng.nonZero(-9, 9), 1), term(rng.nonZero(-9, 9))];
          answer = collect([...products([m], p), ...scale(q, k)]);
        } while (answer.length < 2 || answer[0]!.x !== 2);
        const expr = `${front(m)}${wrap(p)} ${k < 0 ? "-" : "+"} ${Math.abs(k) === 1 ? "" : Math.abs(k)}${wrap(q)}`;
        const expanded = write([...products([m], p), ...scale(q, k)]);
        return expandProblem({
          prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
          answer: write(answer),
          wrong: [
            write(collect([...products([m], p), mul(term(k), q[0]!), ...scale(q.slice(1), Math.abs(k))])),
            write(collect([...products([m], p), mul(term(k), q[0]!), ...q.slice(1)])),
            expanded,
          ],
          solution: t(
            `Expand both products, then combine like terms:${steps(`${expr} = ${expanded} = ${write(answer)}`)}`,
            `先展开两个乘积，再合并同类项：${steps(`${expr} = ${expanded} = ${write(answer)}`)}`,
          ),
        });
      },
    },
  ],
};

/** quadraticKeys are the monomials of a quadratic in x and y. */
const quadraticKeys: readonly (readonly [number, number])[] = [
  [2, 0],
  [1, 1],
  [0, 2],
];

/** somePolynomial draws a polynomial in x with the given number of terms and degree, in standard form. */
function somePolynomial(rng: Rng, d: number, count: number): Term[] {
  const lower = rng.sample(
    Array.from({ length: d }, (_, i) => i),
    Math.min(count - 1, d),
  );
  return collect([d, ...lower].map((e) => term(rng.nonZero(-9, 9), e)));
}

export const addingAndSubtractingPolynomials: TopicDef = {
  id: "adding-and-subtracting-polynomials",
  title: t("Adding and Subtracting Polynomials", "多项式的加减"),
  summary: t("Add and subtract polynomials in one or several variables.", "一元或多元多项式的加法与减法。"),
  prerequisites: ["distributive-law-for-polynomials"],
  encompasses: [{ topic: "simplifying-polynomials", weight: 0.6 }],
  xp: 12,
  standards: ["CCSS.HSA.APR.A.1"],
  knowledgePoints: [
    {
      id: "adding-polynomials",
      title: t("Adding polynomials", "多项式相加"),
      explanation: t(
        "To add polynomials, remove the parentheses and combine like terms. Only coefficients are added; the exponents do not change: $x^{2} + x^{2} = 2x^{2}$, not $x^{4}$.\n\n$$(3x^{2} - 2x + 5) + (x^{2} + 4x - 7) = 3x^{2} + x^{2} - 2x + 4x + 5 - 7 = 4x^{2} + 2x - 2$$",
        "多项式相加时，去掉括号，再合并同类项。只有系数相加，指数不变：$x^{2} + x^{2} = 2x^{2}$，而不是 $x^{4}$。\n\n$$(3x^{2} - 2x + 5) + (x^{2} + 4x - 7) = 3x^{2} + x^{2} - 2x + 4x + 5 - 7 = 4x^{2} + 2x - 2$$",
      ),
      generate(rng) {
        let p: Term[];
        let q: Term[];
        let answer: Term[];
        do {
          const d = rng.int(2, 3);
          p = somePolynomial(rng, d, rng.int(3, 4));
          q = somePolynomial(rng, rng.int(1, d), 3);
          answer = collect([...p, ...q]);
        } while (answer.length < 2);
        const expr = `${wrap(p)} + ${wrap(q)}`;
        const shared = (m: Term) => p.some((a) => a.x === m.x) && q.some((b) => b.x === m.x);
        return expandProblem({
          prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
          answer: write(answer),
          wrong: [
            write(collect(answer.map((m) => (shared(m) && m.x > 0 ? term(m.c, 2 * m.x) : m)))),
            write(collect([...p, ...q.map((m) => (m.x === 0 ? neg(m) : m))])),
            write(collect([...p, ...scale(q, -1)])),
          ],
          solution: t(
            `Remove the parentheses and combine like terms:${steps(`${expr} = ${groups([...p, ...q])} = ${write(answer)}`)}`,
            `去掉括号，合并同类项：${steps(`${expr} = ${groups([...p, ...q])} = ${write(answer)}`)}`,
          ),
        });
      },
    },
    {
      id: "subtracting-polynomials",
      title: t("Subtracting polynomials", "多项式相减"),
      explanation: t(
        "To subtract a polynomial, change the sign of **every** one of its terms, then combine like terms:\n\n$$(5x^{2} - 3x + 1) - (2x^{2} - 4x + 6) = 5x^{2} - 3x + 1 - 2x^{2} + 4x - 6 = 3x^{2} + x - 5$$\n\nA common mistake is to change only the sign of the first term.",
        "减去一个多项式时，把它的**每一项**都变号，再合并同类项：\n\n$$(5x^{2} - 3x + 1) - (2x^{2} - 4x + 6) = 5x^{2} - 3x + 1 - 2x^{2} + 4x - 6 = 3x^{2} + x - 5$$\n\n常见错误是只改变第一项的符号。",
      ),
      generate(rng) {
        let p: Term[];
        let q: Term[];
        let answer: Term[];
        do {
          const d = rng.int(2, 3);
          p = somePolynomial(rng, d, rng.int(3, 4));
          q = somePolynomial(rng, rng.int(2, d), 3);
          answer = collect([...p, ...scale(q, -1)]);
        } while (answer.length < 2);
        const expr = `${wrap(p)} - ${wrap(q)}`;
        const removed = write([...p, ...scale(q, -1)]);
        return expandProblem({
          prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
          answer: write(answer),
          wrong: [write(collect([...p, neg(q[0]!), ...q.slice(1)])), write(collect([...p, ...q])), write(collect([...q, ...scale(p, -1)]))],
          solution: t(
            `Change the sign of every term of the second polynomial, then combine like terms:${steps(`${expr} = ${removed} = ${write(answer)}`)}`,
            `把第二个多项式的每一项都变号，再合并同类项：${steps(`${expr} = ${removed} = ${write(answer)}`)}`,
          ),
        });
      },
    },
    {
      id: "subtracting-from",
      title: t("Subtracting from a polynomial in several variables", "从多元多项式中减去多项式"),
      explanation: t(
        '"Subtract $B$ from $A$" means $A - B$: the polynomial after "from" comes first. Polynomials in several variables are added and subtracted in the same way; like terms have the same power of every variable. For example, subtracting $x^{2} + 3xy$ from $4x^{2} - xy + y^{2}$:\n\n$$(4x^{2} - xy + y^{2}) - (x^{2} + 3xy) = 3x^{2} - 4xy + y^{2}$$',
        '"从 $A$ 中减去 $B$"表示 $A - B$。多元多项式的加减方法相同；同类项中每个变量的指数都相同。例如，从 $4x^{2} - xy + y^{2}$ 中减去 $x^{2} + 3xy$：\n\n$$(4x^{2} - xy + y^{2}) - (x^{2} + 3xy) = 3x^{2} - 4xy + y^{2}$$',
      ),
      generate(rng) {
        let p: Term[];
        let q: Term[];
        let answer: Term[];
        do {
          p = collect(quadraticKeys.map(([a, b]) => term(rng.nonZero(-9, 9), a, b)));
          q = collect(rng.sample(quadraticKeys, rng.int(2, 3)).map(([a, b]) => term(rng.nonZero(-9, 9), a, b)));
          if (rng.bool(0.4)) q.push(term(rng.nonZero(-9, 9)));
          answer = collect([...p, ...scale(q, -1)]);
        } while (answer.length < 2);
        const from = write(p);
        const sub = write(q);
        const expr = `${wrap(p)} - ${wrap(q)}`;
        return expandProblem({
          prompt: t(`Subtract $${sub}$ from $${from}$.`, `从 $${from}$ 中减去 $${sub}$。`),
          answer: write(answer),
          wrong: [write(collect([...q, ...scale(p, -1)])), write(collect([...p, ...q])), write(collect([...p, neg(q[0]!), ...q.slice(1)]))],
          solution: t(
            `The result is $${expr}$. Change the sign of every term of $${sub}$, then combine like terms:${steps(`${expr} = ${write([...p, ...scale(q, -1)])} = ${write(answer)}`)}`,
            `所求的是 $${expr}$。把 $${sub}$ 的每一项都变号，再合并同类项：${steps(`${expr} = ${write([...p, ...scale(q, -1)])} = ${write(answer)}`)}`,
          ),
        });
      },
    },
  ],
};

/** termNames are the names of polynomials by number of terms, with "none of these" for four or more. */
const termNames: readonly Text[] = [
  t("Monomial", "单项式"),
  t("Binomial", "二项式"),
  t("Trinomial", "三项式"),
  t("None of these", "以上都不是"),
];

/** termName writes the name of a polynomial with n terms in a sentence. */
function termName(n: number): Text {
  return [
    t("a monomial", "单项式"),
    t("a binomial", "二项式"),
    t("a trinomial", "三项式"),
    t("none of these: it has four terms", "以上都不是：它有四项"),
  ][Math.min(n, 4) - 1]!;
}

/** degreeNames are the names of polynomials in one variable by degree. */
const degreeNames: readonly Text[] = [
  t("Constant", "常数（零次）"),
  t("Linear", "一次"),
  t("Quadratic", "二次"),
  t("Cubic", "三次"),
  t("Quartic", "四次"),
  t("Quintic", "五次"),
];

export const monomialsBinomialsAndTrinomials: TopicDef = {
  id: "monomials-binomials-and-trinomials",
  title: t("Monomials, Binomials and Trinomials", "单项式、二项式与三项式"),
  summary: t("Name polynomials by their number of terms and by their degree.", "按项数和次数给多项式命名。"),
  prerequisites: ["adding-and-subtracting-polynomials"],
  encompasses: [
    { topic: "degree-of-a-polynomial", weight: 0.4 },
    { topic: "adding-and-subtracting-polynomials", weight: 0.2 },
  ],
  xp: 10,
  standards: ["CCSS.HSA.SSE.A.1.A"],
  knowledgePoints: [
    {
      id: "naming-by-number-of-terms",
      title: t("Naming by the number of terms", "按项数命名"),
      explanation: t(
        "A polynomial with one term is a **monomial**, with two terms a **binomial**, and with three terms a **trinomial**. A product of numbers and variables, however long, is a single term: $-7x^{3}y^{2}$ is a monomial, $x^{4} - 9$ a binomial and $2x^{2} + xy - y^{2}$ a trinomial.",
        "只有一项的多项式叫做**单项式**，有两项的叫做**二项式**，有三项的叫做**三项式**。数与变量的乘积无论多长，都只是一项：$-7x^{3}y^{2}$ 是单项式，$x^{4} - 9$ 是二项式，$2x^{2} + xy - y^{2}$ 是三项式。",
      ),
      generate(rng) {
        const n = rng.pick([1, 1, 2, 2, 3, 3, 4]);
        const keys: [number, number][] = [];
        for (let i = 0; i <= 4; i++) for (let j = 0; j <= 3; j++) if (i + j <= 5) keys.push([i, j]);
        const ts = rng.sample(keys, n).map(([a, b]) => term(rng.bool(0.25) ? rng.sign() : rng.nonZero(-9, 9), a, b));
        const expr = write(ts);
        const name = termName(n);
        const list = ts.map((m) => `$${mono(m)}$`).join(", ");
        return choiceProblem({
          prompt: t(`Is $${expr}$ a monomial, a binomial or a trinomial?`, `$${expr}$ 是单项式、二项式还是三项式？`),
          options: termNames,
          correct: n - 1,
          solution: t(
            n === 1 ? `$${expr}$ is a single term, so it is ${name.en}.` : `The terms are ${list}: there are ${n}, so it is ${name.en}.`,
            n === 1 ? `$${expr}$ 只有一项，所以它是${name["zh-CN"]}。` : `它的项是 ${list}，共 ${n} 项，所以它是${name["zh-CN"]}。`,
          ),
        });
      },
    },
    {
      id: "naming-by-degree",
      title: t("Naming by degree", "按次数命名"),
      explanation: t(
        "Polynomials in one variable are also named by their degree:\n\n| Degree | Name |\n| :--- | :--- |\n| $0$ | constant |\n| $1$ | linear |\n| $2$ | quadratic |\n| $3$ | cubic |\n| $4$ | quartic |\n| $5$ | quintic |\n\nThe two names combine: $5 - 3x^{2} + x$ is a quadratic trinomial, and $x^{3} - 8$ a cubic binomial.",
        "一元多项式也按次数命名：\n\n| 次数 | 名称 |\n| :--- | :--- |\n| $0$ | 常数（零次） |\n| $1$ | 一次 |\n| $2$ | 二次 |\n| $3$ | 三次 |\n| $4$ | 四次 |\n| $5$ | 五次 |\n\n两种名称可以合用：$5 - 3x^{2} + x$ 是二次三项式，$x^{3} - 8$ 是三次二项式。",
      ),
      generate(rng) {
        const d = rng.pick([0, 1, 1, 2, 2, 2, 3, 3, 4, 5]);
        const ts =
          d === 0
            ? [term(rng.nonZero(-20, 20))]
            : [
                d,
                ...rng.sample(
                  Array.from({ length: d }, (_, i) => i),
                  rng.int(0, Math.min(d, 2)),
                ),
              ].map((e) => term(rng.nonZero(-9, 9), e));
        const shown = ts.length > 1 ? scramble(rng, ts) : ts;
        const expr = write(shown);
        const name = degreeNames[d]!;
        return choiceProblem({
          prompt: t(`Classify $${expr}$ by its degree.`, `按次数给 $${expr}$ 分类。`),
          options: degreeNames,
          correct: d,
          solution:
            d === 0
              ? t(`$${expr}$ has no variable: its degree is $0$, so it is a constant.`, `$${expr}$ 不含变量，次数是 $0$，所以是常数。`)
              : t(
                  `The greatest exponent of $x$ is $${d}$, so the polynomial has degree $${d}$: it is ${name.en.toLowerCase()}.`,
                  `$x$ 的最大指数是 $${d}$，所以多项式的次数是 $${d}$：它是${name["zh-CN"]}多项式。`,
                ),
        });
      },
    },
    {
      id: "simplifying-before-naming",
      title: t("Simplifying before naming", "先化简，再命名"),
      explanation: t(
        "Name a polynomial by its number of terms only after simplifying it, because like terms combine and may cancel:\n\n$$(2x^{2} + 3x - 1) - (2x^{2} - x + 4) = 4x - 5$$\n\nThe result has two terms, so it is a binomial, even though each polynomial in the expression has three.",
        "要先化简，再按项数命名，因为同类项会合并，甚至相互抵消：\n\n$$(2x^{2} + 3x - 1) - (2x^{2} - x + 4) = 4x - 5$$\n\n结果有两项，所以是二项式，尽管式子中的两个多项式各有三项。",
      ),
      generate(rng) {
        let n: number;
        let r: Term[];
        let q: Term[];
        let p: Term[];
        let plus: boolean;
        do {
          n = rng.int(1, 3);
          r = collect(rng.sample([0, 1, 2, 3], n).map((e) => term(rng.nonZero(-9, 9), e)));
          q = collect(rng.sample([0, 1, 2, 3], rng.int(2, 3)).map((e) => term(rng.nonZero(-9, 9), e)));
          plus = rng.bool();
          p = collect([...r, ...scale(q, plus ? -1 : 1)]);
        } while (p.length < 2 || p.length + q.length < n + 3);
        const expr = `${wrap(p)} ${plus ? "+" : "-"} ${wrap(q)}`;
        const name = termName(n);
        return choiceProblem({
          prompt: t(
            `Simplify $${expr}$. Is the result a monomial, a binomial or a trinomial?`,
            `化简 $${expr}$。结果是单项式、二项式还是三项式？`,
          ),
          options: termNames,
          correct: n - 1,
          solution: t(
            `${steps(`${expr} = ${write(r)}`)}The result has ${n === 1 ? "one term" : `${n} terms`}, so it is ${name.en}.`,
            `${steps(`${expr} = ${write(r)}`)}结果有 ${n} 项，所以它是${name["zh-CN"]}。`,
          ),
        });
      },
    },
  ],
};

export const multiplyingBinomials: TopicDef = {
  id: "multiplying-binomials",
  title: t("Multiplying Binomials", "二项式乘二项式"),
  summary: t("Multiply two binomials by multiplying every term by every term.", "用逐项相乘的方法计算两个二项式的积。"),
  prerequisites: ["distributive-law-for-polynomials"],
  encompasses: [{ topic: "distributive-law-for-polynomials", weight: 0.6 }],
  xp: 12,
  standards: ["CCSS.HSA.APR.A.1"],
  knowledgePoints: [
    {
      id: "monic-binomials",
      title: t("Products such as $(x + a)(x + b)$", "形如 $(x + a)(x + b)$ 的积"),
      explanation: t(
        "To multiply two binomials, multiply **each term of the first by each term of the second** and add the four products, then combine like terms. One way to remember the four products is **FOIL**: First, Outer, Inner, Last.\n\n$$(x + 3)(x - 5) = x^{2} - 5x + 3x - 15 = x^{2} - 2x - 15$$",
        "两个二项式相乘时，用第一个二项式的**每一项**乘以第二个二项式的**每一项**，把四个乘积相加，再合并同类项。\n\n$$(x + 3)(x - 5) = x^{2} - 5x + 3x - 15 = x^{2} - 2x - 15$$",
      ),
      generate(rng) {
        const a = rng.nonZero(-9, 9);
        const b = rng.nonZero(-9, 9);
        const p = [term(1, 1), term(a)];
        const q = [term(1, 1), term(b)];
        const expr = `${wrap(p)}${wrap(q)}`;
        const answer = write(times(p, q));
        return expandProblem({
          prompt: t(`Expand $${expr}$.`, `展开 $${expr}$。`),
          answer,
          wrong: [
            write([term(1, 2), term(a * b)]),
            write(collect([term(1, 2), term(a + b, 1), term(-a * b)])),
            write(collect([term(1, 2), term(a * b, 1), term(a + b)])),
          ],
          solution: t(
            `Multiply every term of the first binomial by every term of the second:${steps(`${expr} = ${write(products(p, q))} = ${answer}`)}`,
            `用第一个二项式的每一项乘以第二个二项式的每一项：${steps(`${expr} = ${write(products(p, q))} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "leading-coefficients",
      title: t("Binomials with leading coefficients", "首项系数不为 1 的二项式"),
      explanation: t(
        "The method is the same when the terms have coefficients: multiply the coefficients and add the exponents in each of the four products.\n\n$$(2x - 3)(4x + 1) = 8x^{2} + 2x - 12x - 3 = 8x^{2} - 10x - 3$$\n\nBoth middle products, outer and inner, must be included.",
        "各项带有系数时方法相同：四个乘积中，每个都是系数相乘、指数相加。\n\n$$(2x - 3)(4x + 1) = 8x^{2} + 2x - 12x - 3 = 8x^{2} - 10x - 3$$\n\n中间的两个乘积都不能漏掉。",
      ),
      generate(rng) {
        const a = rng.pick([2, 3, 4, 5, -2, -3]);
        const c = rng.pick([1, 2, 3, 4, 5, -1, -2]);
        const b = rng.nonZero(-9, 9);
        const d = rng.nonZero(-9, 9);
        const p = [term(a, 1), term(b)];
        const q = [term(c, 1), term(d)];
        const pShown = rng.bool(0.25) && b > 0 ? [p[1]!, p[0]!] : p;
        const [first, second] = rng.bool() ? [pShown, q] : [q, pShown];
        const expr = `${wrap(first)}${wrap(second)}`;
        const answer = write(times(p, q));
        return expandProblem({
          prompt: t(`Expand $${expr}$.`, `展开 $${expr}$。`),
          answer,
          wrong: [
            write([term(a * c, 2), term(b * d)]),
            write(collect([term(a * c, 2), term(a * d, 1), term(b * d)])),
            write(collect([term(a * c, 2), term(a * d + b * c, 1), term(-b * d)])),
          ],
          solution: t(
            `Multiply every term of the first binomial by every term of the second:${steps(`${expr} = ${write(products(first, second))} = ${answer}`)}`,
            `用第一个二项式的每一项乘以第二个二项式的每一项：${steps(`${expr} = ${write(products(first, second))} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "two-variables",
      title: t("Binomials in two variables", "含两个变量的二项式"),
      explanation: t(
        "With two variables, the outer and inner products both contain $xy$, so they are like terms:\n\n$$(x + 2y)(3x - y) = 3x^{2} - xy + 6xy - 2y^{2} = 3x^{2} + 5xy - 2y^{2}$$",
        "含两个变量时，中间的两个乘积都含 $xy$，是同类项：\n\n$$(x + 2y)(3x - y) = 3x^{2} - xy + 6xy - 2y^{2} = 3x^{2} + 5xy - 2y^{2}$$",
      ),
      generate(rng) {
        let a: number;
        let b: number;
        let c: number;
        let d: number;
        do {
          a = rng.nonZero(-5, 5);
          b = rng.nonZero(-6, 6);
          c = rng.nonZero(-5, 5);
          d = rng.nonZero(-6, 6);
        } while (a * d + b * c === 0);
        const p = [term(a, 1), term(b, 0, 1)];
        const q = [term(c, 1), term(d, 0, 1)];
        const expr = `${wrap(p)}${wrap(q)}`;
        const answer = write(times(p, q));
        return expandProblem({
          prompt: t(`Expand $${expr}$.`, `展开 $${expr}$。`),
          answer,
          wrong: [
            write([term(a * c, 2), term(b * d, 0, 2)]),
            write(collect([term(a * c, 2), term(a * d, 1, 1), term(b * d, 0, 2)])),
            write(collect([term(a * c, 2), term(a * d + b * c, 1, 1), term(-b * d, 0, 2)])),
          ],
          solution: t(
            `Multiply every term of the first binomial by every term of the second, then combine the $xy$ terms:${steps(`${expr} = ${write(products(p, q))} = ${answer}`)}`,
            `用第一个二项式的每一项乘以第二个二项式的每一项，再合并含 $xy$ 的项：${steps(`${expr} = ${write(products(p, q))} = ${answer}`)}`,
          ),
        });
      },
    },
  ],
};

export const multiplyingPolynomials: TopicDef = {
  id: "multiplying-polynomials",
  title: t("Multiplying Polynomials", "多项式乘多项式"),
  summary: t("Multiply a binomial by a trinomial, and multiply three binomials.", "计算二项式乘三项式，以及三个二项式的积。"),
  prerequisites: ["multiplying-binomials"],
  encompasses: [{ topic: "multiplying-binomials", weight: 0.7 }],
  xp: 14,
  standards: ["CCSS.HSA.APR.A.1"],
  knowledgePoints: [
    {
      id: "binomial-times-trinomial",
      title: t("A binomial times a trinomial", "二项式乘三项式"),
      explanation: t(
        "To multiply any two polynomials, multiply every term of the first by every term of the second, then combine like terms. A binomial times a trinomial gives $2 \\times 3 = 6$ products:\n\n$$(x + 2)(x^{2} - 3x + 4) = x^{3} - 3x^{2} + 4x + 2x^{2} - 6x + 8 = x^{3} - x^{2} - 2x + 8$$",
        "任意两个多项式相乘，都是用第一个的每一项乘以第二个的每一项，再合并同类项。二项式乘三项式共有 $2 \\times 3 = 6$ 个乘积：\n\n$$(x + 2)(x^{2} - 3x + 4) = x^{3} - 3x^{2} + 4x + 2x^{2} - 6x + 8 = x^{3} - x^{2} - 2x + 8$$",
      ),
      generate(rng) {
        const a = rng.nonZero(-6, 6);
        const p = [term(1, 1), term(a)];
        const q = [term(rng.pick([1, 1, 2, 3, -1]), 2), term(rng.nonZero(-9, 9), 1), term(rng.nonZero(-9, 9))];
        const expr = `${wrap(p)}${wrap(q)}`;
        const answer = write(times(p, q));
        return expandProblem({
          prompt: t(`Expand $${expr}$.`, `展开 $${expr}$。`),
          answer,
          wrong: [
            write(collect([...times([p[0]!], q), mul(p[1]!, q[0]!)])),
            write([mul(p[0]!, q[0]!), mul(p[1]!, q[2]!)]),
            write(times([term(1, 1), term(-a)], q)),
          ],
          solution: t(
            `Multiply $x$ and then $${num(a)}$ by every term of the trinomial, then combine like terms:${steps(`${expr} = ${write(products(p, q))} = ${answer}`)}`,
            `用 $x$ 和 $${num(a)}$ 分别乘以三项式的每一项，再合并同类项：${steps(`${expr} = ${write(products(p, q))} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "leading-coefficients",
      title: t("Polynomials with leading coefficients", "首项系数不为 1 的多项式"),
      explanation: t(
        "Coefficients change nothing in the method: each of the products multiplies the coefficients and adds the exponents. Keep the products in order so that none is missed:\n\n$$(2x - 1)(3x^{2} + x - 4) = 6x^{3} + 2x^{2} - 8x - 3x^{2} - x + 4 = 6x^{3} - x^{2} - 9x + 4$$",
        "系数不改变方法：每个乘积都是系数相乘、指数相加。按顺序逐个相乘，就不会遗漏：\n\n$$(2x - 1)(3x^{2} + x - 4) = 6x^{3} + 2x^{2} - 8x - 3x^{2} - x + 4 = 6x^{3} - x^{2} - 9x + 4$$",
      ),
      generate(rng) {
        const p = [term(rng.pick([2, 3, 4, -2, -3]), 1), term(rng.nonZero(-6, 6))];
        const q = [term(rng.nonZero(-4, 4), 2), term(rng.nonZero(-7, 7), 1), term(rng.nonZero(-7, 7))];
        const [first, second] = rng.bool(0.7) ? [p, q] : [q, p];
        const expr = `${wrap(first)}${wrap(second)}`;
        const answer = write(times(p, q));
        return expandProblem({
          prompt: t(`Expand $${expr}$.`, `展开 $${expr}$。`),
          answer,
          wrong: [
            write(collect([...times([p[0]!], q), mul(p[1]!, q[0]!)])),
            write(collect([...times([p[0]!], q), ...scale(q.slice(1), p[1]!.c)])),
            write(times([p[0]!, neg(p[1]!)], q)),
          ],
          solution: t(
            `Multiply every term of the first polynomial by every term of the second, then combine like terms:${steps(`${expr} = ${write(products(first, second))} = ${answer}`)}`,
            `用第一个多项式的每一项乘以第二个多项式的每一项，再合并同类项：${steps(`${expr} = ${write(products(first, second))} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "three-binomials",
      title: t("A product of three binomials", "三个二项式的积"),
      explanation: t(
        "To multiply three binomials, multiply two of them first, then multiply the result by the third:\n\n$$(x + 1)(x - 2)(x + 3) = (x^{2} - x - 2)(x + 3) = x^{3} + 3x^{2} - x^{2} - 3x - 2x - 6 = x^{3} + 2x^{2} - 5x - 6$$",
        "三个二项式相乘时，先把其中两个相乘，再用结果乘以第三个：\n\n$$(x + 1)(x - 2)(x + 3) = (x^{2} - x - 2)(x + 3) = x^{3} + 3x^{2} - x^{2} - 3x - 2x - 6 = x^{3} + 2x^{2} - 5x - 6$$",
      ),
      generate(rng) {
        const [a, b, c] = [rng.nonZero(-5, 5), rng.nonZero(-5, 5), rng.nonZero(-5, 5)];
        const f = (k: number) => [term(1, 1), term(k)];
        const expr = `${wrap(f(a))}${wrap(f(b))}${wrap(f(c))}`;
        const ab = times(f(a), f(b));
        const answer = write(times(ab, f(c)));
        return expandProblem({
          prompt: t(`Expand $${expr}$.`, `展开 $${expr}$。`),
          answer,
          wrong: [
            write([term(1, 3), term(a * b * c)]),
            write(collect([term(1, 3), term(a + b + c, 2), term(a * b * c)])),
            write(collect([term(1, 3), term(a + b + c, 2), term(a * b + b * c + c * a, 1), term(-a * b * c)])),
          ],
          solution: t(
            `Multiply the first two binomials, then multiply the result by the third:${steps(`${expr} = ${wrap(ab)}${wrap(f(c))} = ${answer}`)}`,
            `先把前两个二项式相乘，再用结果乘以第三个：${steps(`${expr} = ${wrap(ab)}${wrap(f(c))} = ${answer}`)}`,
          ),
        });
      },
    },
  ],
};

/** squareSteps writes (a + b)² = (a)² + 2(a)(b) + (b)². */
function squareSteps(a: Term, b: Term): string {
  return `(${mono(a)})^{2} + 2(${mono(a)})(${mono(b)}) + (${mono(b)})^{2}`;
}

export const squaringBinomials: TopicDef = {
  id: "squaring-binomials",
  title: t("Squaring Binomials", "二项式的平方"),
  summary: t(
    "Expand $(a + b)^{2}$ and $(a - b)^{2}$ with the perfect square formulas.",
    "用完全平方公式展开 $(a + b)^{2}$ 和 $(a - b)^{2}$。",
  ),
  prerequisites: ["multiplying-binomials", "power-rules"],
  encompasses: [
    { topic: "multiplying-binomials", weight: 0.6 },
    { topic: "power-rules", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.HSA.APR.A.1", "CCSS.HSA.SSE.A.2"],
  knowledgePoints: [
    {
      id: "square-of-a-sum-or-difference",
      title: t("The square of a sum or a difference", "和与差的平方"),
      explanation: t(
        "$(a + b)^{2}$ means $(a + b)(a + b)$. Multiplying gives $a^{2} + ab + ba + b^{2}$, and the two middle products are equal, so\n\n$$(a + b)^{2} = a^{2} + 2ab + b^{2} \\qquad (a - b)^{2} = a^{2} - 2ab + b^{2}$$\n\nThe middle term is the one most often forgotten: $(x + 5)^{2} = x^{2} + 10x + 25$, not $x^{2} + 25$.",
        "$(a + b)^{2}$ 表示 $(a + b)(a + b)$。相乘得 $a^{2} + ab + ba + b^{2}$，中间两个乘积相等，所以\n\n$$(a + b)^{2} = a^{2} + 2ab + b^{2} \\qquad (a - b)^{2} = a^{2} - 2ab + b^{2}$$\n\n中间项最容易被遗漏：$(x + 5)^{2} = x^{2} + 10x + 25$，而不是 $x^{2} + 25$。",
      ),
      generate(rng) {
        const a = rng.nonZero(-15, 15);
        const v = rng.bool() ? term(1, 1) : term(1, 0, 1);
        const b = term(a);
        const expr = `${wrap([v, b])}^{2}`;
        const answer = write(binomialPower(v, b, 2));
        return expandProblem({
          prompt: t(`Expand $${expr}$.`, `展开 $${expr}$。`),
          answer,
          wrong: [
            write([mul(v, v), term(a * a)]),
            write([mul(v, v), mul(v, b), term(a * a)]),
            write([mul(v, v), mul(v, term(2 * a)), term(-a * a)]),
            write([mul(v, v), term(-a * a)]),
          ],
          solution: t(
            `Use $(a ${a < 0 ? "-" : "+"} b)^{2} = a^{2} ${a < 0 ? "-" : "+"} 2ab + b^{2}$:${steps(`${expr} = ${squareSteps(v, b)} = ${answer}`)}`,
            `运用 $(a ${a < 0 ? "-" : "+"} b)^{2} = a^{2} ${a < 0 ? "-" : "+"} 2ab + b^{2}$：${steps(`${expr} = ${squareSteps(v, b)} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "leading-coefficients",
      title: t("Squaring with coefficients", "带系数的二项式平方"),
      explanation: t(
        "When a term has a coefficient, square the whole term, coefficient included, and double the product of the two terms:\n\n$$(3x - 4)^{2} = (3x)^{2} - 2(3x)(4) + 4^{2} = 9x^{2} - 24x + 16$$",
        "项带有系数时，整项（包括系数）都要平方，中间项是两项之积的两倍：\n\n$$(3x - 4)^{2} = (3x)^{2} - 2(3x)(4) + 4^{2} = 9x^{2} - 24x + 16$$",
      ),
      keyPrerequisites: ["power-rules"],
      generate(rng) {
        const a = rng.pick([2, 3, 4, 5, 6, -2, -3]);
        const c = rng.nonZero(-9, 9);
        const p = term(a, 1);
        const q = term(c);
        const shown = c > 0 && rng.bool(0.3) ? [q, p] : [p, q];
        const expr = `${wrap(shown)}^{2}`;
        const answer = write(binomialPower(p, q, 2));
        return expandProblem({
          prompt: t(`Expand $${expr}$.`, `展开 $${expr}$。`),
          answer,
          wrong: [
            write([term(a, 2), term(2 * a * c, 1), term(c * c)]),
            write([term(a * a, 2), term(c * c)]),
            write([term(a * a, 2), term(a * c, 1), term(c * c)]),
          ],
          solution: t(
            `Square each term and double their product:${steps(`${expr} = ${squareSteps(shown[0]!, shown[1]!)} = ${answer}`)}`,
            `每一项分别平方，中间项是两项之积的两倍：${steps(`${expr} = ${squareSteps(shown[0]!, shown[1]!)} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "two-variables",
      title: t("Squaring a binomial in two variables", "含两个变量的二项式平方"),
      explanation: t(
        "The formulas hold for any two terms. With $a = 2x$ and $b = 5y$:\n\n$$(2x - 5y)^{2} = (2x)^{2} - 2(2x)(5y) + (5y)^{2} = 4x^{2} - 20xy + 25y^{2}$$",
        "公式对任意两项都成立。取 $a = 2x$，$b = 5y$：\n\n$$(2x - 5y)^{2} = (2x)^{2} - 2(2x)(5y) + (5y)^{2} = 4x^{2} - 20xy + 25y^{2}$$",
      ),
      generate(rng) {
        const a = rng.pick([1, 1, 2, 3, 4, 5]);
        const b = rng.nonZero(-7, 7);
        const p = term(a, 1);
        const q = term(b, 0, 1);
        const expr = `${wrap([p, q])}^{2}`;
        const answer = write(binomialPower(p, q, 2));
        return expandProblem({
          prompt: t(`Expand $${expr}$.`, `展开 $${expr}$。`),
          answer,
          wrong: [
            write([term(a * a, 2), term(b * b, 0, 2)]),
            write([term(a * a, 2), term(a * b, 1, 1), term(b * b, 0, 2)]),
            write([term(a, 2), term(2 * a * b, 1, 1), term(b, 0, 2)]),
          ],
          solution: t(
            `Square each term and double their product:${steps(`${expr} = ${squareSteps(p, q)} = ${answer}`)}`,
            `每一项分别平方，中间项是两项之积的两倍：${steps(`${expr} = ${squareSteps(p, q)} = ${answer}`)}`,
          ),
        });
      },
    },
  ],
};

/** pascalRow writes row n of Pascal's triangle: "1, 4, 6, 4, 1". */
const pascalRow = (n: number) => Array.from({ length: n + 1 }, (_, i) => choose(n, i)).join(", ");

export const expandingBinomialsUsingPascalsTriangle: TopicDef = {
  id: "expanding-binomials-using-pascals-triangle",
  title: t("Expanding Binomials Using Pascal's Triangle", "用杨辉三角展开二项式"),
  summary: t(
    "Expand $(a + b)^{n}$ with the coefficients from Pascal's triangle, and find one coefficient of an expansion.",
    "用杨辉三角中的系数展开 $(a + b)^{n}$，并求展开式中某一项的系数。",
  ),
  prerequisites: ["squaring-binomials", "multiplying-polynomials"],
  encompasses: [
    { topic: "squaring-binomials", weight: 0.5 },
    { topic: "multiplying-polynomials", weight: 0.3 },
  ],
  xp: 16,
  standards: ["CCSS.HSA.APR.C.5"],
  knowledgePoints: [
    {
      id: "pascals-triangle",
      title: t("Pascal's triangle", "杨辉三角"),
      explanation: t(
        "Expanding powers of $a + b$ gives\n\n$$(a + b)^{2} = a^{2} + 2ab + b^{2} \\qquad (a + b)^{3} = a^{3} + 3a^{2}b + 3ab^{2} + b^{3}$$\n\nThe coefficients are the rows of **Pascal's triangle**. Each row starts and ends with $1$, and every other number is the sum of the two numbers above it:\n\n$$\\begin{array}{c} 1 \\\\ 1 \\quad 1 \\\\ 1 \\quad 2 \\quad 1 \\\\ 1 \\quad 3 \\quad 3 \\quad 1 \\\\ 1 \\quad 4 \\quad 6 \\quad 4 \\quad 1 \\\\ 1 \\quad 5 \\quad 10 \\quad 10 \\quad 5 \\quad 1 \\end{array}$$\n\nIn $(a + b)^{n}$, the powers of $a$ go down from $n$ to $0$ while the powers of $b$ go up from $0$ to $n$, and the coefficients are the row that starts $1, n$:\n\n$$(a + b)^{4} = a^{4} + 4a^{3}b + 6a^{2}b^{2} + 4ab^{3} + b^{4}$$",
        "展开 $a + b$ 的乘方：\n\n$$(a + b)^{2} = a^{2} + 2ab + b^{2} \\qquad (a + b)^{3} = a^{3} + 3a^{2}b + 3ab^{2} + b^{3}$$\n\n各项系数正是**杨辉三角**（帕斯卡三角形）的各行。每行首尾都是 $1$，其余每个数都等于它上方两个数之和：\n\n$$\\begin{array}{c} 1 \\\\ 1 \\quad 1 \\\\ 1 \\quad 2 \\quad 1 \\\\ 1 \\quad 3 \\quad 3 \\quad 1 \\\\ 1 \\quad 4 \\quad 6 \\quad 4 \\quad 1 \\\\ 1 \\quad 5 \\quad 10 \\quad 10 \\quad 5 \\quad 1 \\end{array}$$\n\n在 $(a + b)^{n}$ 中，$a$ 的指数从 $n$ 递减到 $0$，$b$ 的指数从 $0$ 递增到 $n$，系数就是以 $1, n$ 开头的那一行：\n\n$$(a + b)^{4} = a^{4} + 4a^{3}b + 6a^{2}b^{2} + 4ab^{3} + b^{4}$$",
      ),
      generate(rng) {
        const n = rng.int(4, 9);
        const k = rng.int(1, n - 1);
        const [u, v] = rng.pick([
          ["x", "y"],
          ["a", "b"],
        ] as const);
        const target = `${pw(u, k)}${pw(v, n - k)}`;
        const c = choose(n, k);
        return numberProblem({
          prompt: t(
            `What is the coefficient of $${target}$ in the expansion of $(${u} + ${v})^{${n}}$?`,
            `$(${u} + ${v})^{${n}}$ 的展开式中，$${target}$ 的系数是多少？`,
          ),
          answer: c,
          wrong: [n, k, choose(n, k - 1), choose(n - 1, k)],
          solution: t(
            `The coefficients of $(${u} + ${v})^{${n}}$ are row $${pascalRow(n)}$ of Pascal's triangle. The powers of $${u}$ go down from $${n}$, so $${target}$ is term number $${n - k + 1}$, with coefficient $${c}$.`,
            `$(${u} + ${v})^{${n}}$ 的系数是杨辉三角中的 $${pascalRow(n)}$ 这一行。$${u}$ 的指数从 $${n}$ 开始递减，所以 $${target}$ 是第 $${n - k + 1}$ 项，系数是 $${c}$。`,
          ),
        });
      },
    },
    {
      id: "cubing-binomials",
      title: t("Cubing a binomial", "二项式的立方"),
      explanation: t(
        "Row $3$ of Pascal's triangle is $1, 3, 3, 1$, so $(a + b)^{3} = a^{3} + 3a^{2}b + 3ab^{2} + b^{3}$. Substitute the two terms of the binomial for $a$ and $b$, with their signs and coefficients, in parentheses:\n\n$$(2x - 1)^{3} = (2x)^{3} + 3(2x)^{2}(-1) + 3(2x)(-1)^{2} + (-1)^{3} = 8x^{3} - 12x^{2} + 6x - 1$$",
        "杨辉三角的第 $3$ 行是 $1, 3, 3, 1$，所以 $(a + b)^{3} = a^{3} + 3a^{2}b + 3ab^{2} + b^{3}$。把二项式的两项连同符号和系数加上括号，分别代入 $a$ 和 $b$：\n\n$$(2x - 1)^{3} = (2x)^{3} + 3(2x)^{2}(-1) + 3(2x)(-1)^{2} + (-1)^{3} = 8x^{3} - 12x^{2} + 6x - 1$$",
      ),
      generate(rng) {
        const p = rng.pick([1, 1, 2, 3]);
        const q = p === 1 ? rng.nonZero(-5, 5) : rng.nonZero(-3, 3);
        const a = term(p, 1);
        const b = term(q);
        const shown = q > 0 && rng.bool(0.3) ? [b, a] : [a, b];
        const expr = `${wrap(shown)}^{3}`;
        const answer = write(binomialPower(a, b, 3));
        return expandProblem({
          prompt: t(`Expand $${expr}$.`, `展开 $${expr}$。`),
          answer,
          wrong: [
            write([term(p ** 3, 3), term(q ** 3)]),
            write(binomialPower(a, b, 3, undefined, (i) => (i === 0 ? 1 : i === 3 ? q ** 3 : q))),
            write(binomialPower(a, b, 3, () => 1)),
          ],
          solution: t(
            `Use row $1, 3, 3, 1$ of Pascal's triangle:${steps(`${expr} = ${binomialSteps(a, b, 3)} = ${answer}`)}`,
            `用杨辉三角的 $1, 3, 3, 1$ 这一行：${steps(`${expr} = ${binomialSteps(a, b, 3)} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "higher-powers",
      title: t("Fourth and higher powers", "四次及更高次幂"),
      explanation: t(
        "Higher powers work the same way with a longer row. With row $1, 4, 6, 4, 1$:\n\n$$(x - 2y)^{4} = x^{4} + 4x^{3}(-2y) + 6x^{2}(-2y)^{2} + 4x(-2y)^{3} + (-2y)^{4} = x^{4} - 8x^{3}y + 24x^{2}y^{2} - 32xy^{3} + 16y^{4}$$\n\nWhen the second term is negative, the signs alternate.",
        "更高次幂的方法相同，只是用更长的一行。用 $1, 4, 6, 4, 1$ 这一行：\n\n$$(x - 2y)^{4} = x^{4} + 4x^{3}(-2y) + 6x^{2}(-2y)^{2} + 4x(-2y)^{3} + (-2y)^{4} = x^{4} - 8x^{3}y + 24x^{2}y^{2} - 32xy^{3} + 16y^{4}$$\n\n第二项为负时，各项符号正负交替。",
      ),
      generate(rng) {
        const n = rng.pick([4, 4, 5, 5, 6]);
        const p = n === 4 ? rng.pick([1, 2]) : 1;
        const q = n === 6 ? rng.pick([1, -1]) : rng.pick([1, -1, 2, -2]);
        const a = term(p, 1);
        const b = rng.bool() ? term(q) : term(q, 0, 1);
        const shown = q > 0 && rng.bool(0.3) ? [b, a] : [a, b];
        const expr = `${wrap(shown)}^{${n}}`;
        const answer = write(binomialPower(a, b, n));
        return expandProblem({
          prompt: t(`Expand $${expr}$.`, `展开 $${expr}$。`),
          answer,
          wrong: [
            write(binomialPower(a, b, n, undefined, (i) => (i === 0 ? 1 : q))),
            write(binomialPower(a, b, n, () => 1)),
            write(binomialPower(a, term(Math.abs(q), b.x, b.y), n)),
          ],
          solution: t(
            `Use row $${pascalRow(n)}$ of Pascal's triangle:${steps(`${expr} = ${binomialSteps(a, b, n)} = ${answer}`)}`,
            `用杨辉三角的 $${pascalRow(n)}$ 这一行：${steps(`${expr} = ${binomialSteps(a, b, n)} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "one-coefficient",
      title: t("Finding one coefficient", "求展开式中某一项的系数"),
      explanation: t(
        "To find one coefficient, there is no need to expand everything. In $(px + q)^{n}$, the term containing $x^{k}$ is $C(px)^{k}q^{n - k}$, where $C$ is the number of Pascal's triangle in row $n$ that goes with $a^{k}b^{n - k}$. In $(2x - 3)^{4}$, the $x^{3}$ term is\n\n$$4(2x)^{3}(-3) = 4 \\cdot 8 \\cdot (-3)x^{3} = -96x^{3}$$\n\nso the coefficient of $x^{3}$ is $-96$.",
        "求某一项的系数，不必全部展开。在 $(px + q)^{n}$ 中，含 $x^{k}$ 的项是 $C(px)^{k}q^{n - k}$，其中 $C$ 是杨辉三角第 $n$ 行中与 $a^{k}b^{n - k}$ 对应的数。在 $(2x - 3)^{4}$ 中，含 $x^{3}$ 的项是\n\n$$4(2x)^{3}(-3) = 4 \\cdot 8 \\cdot (-3)x^{3} = -96x^{3}$$\n\n所以 $x^{3}$ 的系数是 $-96$。",
      ),
      generate(rng) {
        const n = rng.int(3, 6);
        const k = rng.int(1, n - 1);
        const p = rng.pick([1, 2, 2, 3]);
        const q = rng.pick([1, -1, 2, -2, 3, -3]);
        const c = choose(n, k);
        const answer = c * p ** k * q ** (n - k);
        const a = term(p, 1);
        const b = term(q);
        const expr = `${wrap([a, b])}^{${n}}`;
        const piece = `${c === 1 ? "" : c}${factorPower(a, k)}${factorPower(b, n - k)}`;
        return numberProblem({
          prompt: t(
            `What is the coefficient of $${pw("x", k)}$ in the expansion of $${expr}$?`,
            `$${expr}$ 的展开式中，$${pw("x", k)}$ 的系数是多少？`,
          ),
          answer,
          wrong: [c, c * p * q, -answer, c * p ** k],
          solution: t(
            `Row $${n}$ of Pascal's triangle is $${pascalRow(n)}$. The term containing $${pw("x", k)}$ is${steps(`${piece} = ${mono(term(answer, k))}`)}`,
            `杨辉三角的第 $${n}$ 行是 $${pascalRow(n)}$。含 $${pw("x", k)}$ 的项是${steps(`${piece} = ${mono(term(answer, k))}`)}`,
          ),
        });
      },
    },
  ],
};

export const differenceOfSquaresFormula: TopicDef = {
  id: "difference-of-squares-formula",
  title: t("The Difference of Squares Formula", "平方差公式"),
  summary: t(
    "Multiply $(a + b)(a - b) = a^{2} - b^{2}$, and use it for mental arithmetic.",
    "用 $(a + b)(a - b) = a^{2} - b^{2}$ 计算乘积，并用于速算。",
  ),
  prerequisites: ["squaring-binomials"],
  encompasses: [{ topic: "multiplying-binomials", weight: 0.5 }],
  xp: 10,
  standards: ["CCSS.HSA.APR.A.1", "CCSS.HSA.SSE.A.2"],
  knowledgePoints: [
    {
      id: "sum-times-difference",
      title: t("A sum times a difference", "和与差的积"),
      explanation: t(
        "When a sum is multiplied by the difference of the same two terms, the middle products cancel:\n\n$$(a + b)(a - b) = a^{2} - ab + ab - b^{2} = a^{2} - b^{2}$$\n\nThe result is a **difference of squares**, with no middle term: $(x + 7)(x - 7) = x^{2} - 49$.",
        "两个数的和乘以这两个数的差时，中间的两个乘积相互抵消：\n\n$$(a + b)(a - b) = a^{2} - ab + ab - b^{2} = a^{2} - b^{2}$$\n\n结果是两个数的**平方差**，没有中间项：$(x + 7)(x - 7) = x^{2} - 49$。",
      ),
      generate(rng) {
        const a = rng.int(1, 15);
        const v = rng.bool() ? term(1, 1) : term(1, 0, 1);
        const sum = [v, term(a)];
        const diff = [v, term(-a)];
        const expr = rng.bool() ? `${wrap(sum)}${wrap(diff)}` : `${wrap(diff)}${wrap(sum)}`;
        const answer = write([mul(v, v), term(-a * a)]);
        return expandProblem({
          prompt: t(`Expand $${expr}$.`, `展开 $${expr}$。`),
          answer,
          wrong: [write([mul(v, v), term(a * a)]), write([mul(v, v), mul(v, term(-2 * a)), term(-a * a)]), write([mul(v, v), term(-a)])],
          solution: t(
            `Use $(a + b)(a - b) = a^{2} - b^{2}$ with $b = ${a}$:${steps(`${expr} = (${mono(v)})^{2} - ${a}^{2} = ${answer}`)}`,
            `运用 $(a + b)(a - b) = a^{2} - b^{2}$，其中 $b = ${a}$：${steps(`${expr} = (${mono(v)})^{2} - ${a}^{2} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "squares-of-terms",
      title: t("Terms with coefficients and powers", "带系数和幂的项"),
      explanation: t(
        "The formula holds for any two terms. Square each whole term, coefficient included, and subtract the square of the term that changes sign:\n\n$$(5 - 3x)(5 + 3x) = 5^{2} - (3x)^{2} = 25 - 9x^{2} \\qquad (2x^{2} + y)(2x^{2} - y) = 4x^{4} - y^{2}$$",
        "公式对任意两项都成立。把每一项整体（包括系数）平方，再减去改变符号的那一项的平方：\n\n$$(5 - 3x)(5 + 3x) = 5^{2} - (3x)^{2} = 25 - 9x^{2} \\qquad (2x^{2} + y)(2x^{2} - y) = 4x^{4} - y^{2}$$",
      ),
      keyPrerequisites: ["power-rules"],
      generate(rng) {
        const p = rng.int(2, 9);
        const q = rng.int(1, 9);
        const [a, b] = rng.pick([
          [term(p, 1), term(q)],
          [term(p, 1), term(q, 0, 1)],
          [term(q + 1), term(p, 1)],
          [term(rng.int(1, 3), 2), term(q)],
          [term(rng.int(1, 3), 2), term(rng.int(1, 5), 0, 1)],
        ] as const);
        const sum = [a, b];
        const diff = [a, neg(b)];
        const expr = rng.bool() ? `${wrap(sum)}${wrap(diff)}` : `${wrap(diff)}${wrap(sum)}`;
        const answer = write([mul(a, a), neg(mul(b, b))]);
        return expandProblem({
          prompt: t(`Expand $${expr}$.`, `展开 $${expr}$。`),
          answer,
          wrong: [
            write([mul(a, a), mul(b, b)]),
            write([term(a.c, 2 * a.x, 2 * a.y), term(-b.c, 2 * b.x, 2 * b.y)]),
            write([mul(a, a), mul(term(-2), mul(a, b)), neg(mul(b, b))]),
          ],
          solution: t(
            `Use $(a + b)(a - b) = a^{2} - b^{2}$ with $a = ${mono(a)}$ and $b = ${mono(b)}$:${steps(`${expr} = (${mono(a)})^{2} - (${mono(b)})^{2} = ${answer}`)}`,
            `运用 $(a + b)(a - b) = a^{2} - b^{2}$，其中 $a = ${mono(a)}$，$b = ${mono(b)}$：${steps(`${expr} = (${mono(a)})^{2} - (${mono(b)})^{2} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "mental-arithmetic",
      title: t("Mental arithmetic", "用平方差公式速算"),
      explanation: t(
        "The formula turns some products into an easy subtraction. Write the two numbers as the same distance below and above a round number:\n\n$$47 \\times 53 = (50 - 3)(50 + 3) = 50^{2} - 3^{2} = 2500 - 9 = 2491$$",
        "平方差公式可以把一些乘法变成简单的减法。把两个数写成某个整十（或整百）数减去和加上同一个数：\n\n$$47 \\times 53 = (50 - 3)(50 + 3) = 50^{2} - 3^{2} = 2500 - 9 = 2491$$",
      ),
      generate(rng) {
        const c = rng.pick([20, 30, 40, 50, 60, 70, 80, 90, 100, 200]);
        const d = rng.int(1, 9);
        const [m, n] = rng.bool() ? [c - d, c + d] : [c + d, c - d];
        const answer = c * c - d * d;
        return numberProblem({
          prompt: t(`Use the difference of squares formula to compute $${m} \\times ${n}$.`, `用平方差公式计算 $${m} \\times ${n}$。`),
          answer,
          form: "integer",
          wrong: [c * c, c * c + d * d, c * c - d, c * c - 2 * d],
          solution: t(
            `Both numbers are $${d}$ away from $${c}$:${steps(`${m} \\times ${n} = (${c} ${m < n ? "-" : "+"} ${d})(${c} ${m < n ? "+" : "-"} ${d}) = ${c}^{2} - ${d}^{2} = ${c * c} - ${d * d} = ${answer}`)}`,
            `两个数与 $${c}$ 都相差 $${d}$：${steps(`${m} \\times ${n} = (${c} ${m < n ? "-" : "+"} ${d})(${c} ${m < n ? "+" : "-"} ${d}) = ${c}^{2} - ${d}^{2} = ${c * c} - ${d * d} = ${answer}`)}`,
          ),
        });
      },
    },
  ],
};

/** gcfOf finds the greatest common factor of monomials: the positive gcd of the coefficients and the smaller power of each variable. */
function gcfOf(ms: readonly Term[]): Term {
  return term(
    ms.reduce((g, m) => gcd(g, m.c), 0),
    Math.min(...ms.map((m) => m.x)),
    Math.min(...ms.map((m) => m.y)),
  );
}

/** gcfSolution writes the steps of finding the greatest common factor of monomials. */
function gcfSolution(ms: readonly Term[]): Text {
  const g = gcfOf(ms);
  const coefs = ms.map((m) => Math.abs(m.c)).join(", ");
  const xs = ms.map((m) => pw("x", m.x)).join(", ");
  const ys = ms.map((m) => pw("y", m.y)).join(", ");
  const yPart: Text = !ms.some((m) => m.y > 0)
    ? t("", "")
    : g.y === 0
      ? t(", and $y$ is not in every monomial, so it is not a common factor", "；$y$ 不在每个单项式中出现，所以不是公因式")
      : t(`, and the smallest power of $y$ among $${ys}$ is $${pw("y", g.y)}$`, `，$${ys}$ 中 $y$ 的最小次幂是 $${pw("y", g.y)}$`);
  return t(
    `The greatest common factor of the coefficients $${coefs}$ is $${g.c}$. The smallest power of $x$ among $${xs}$ is $${pw("x", g.x)}$${yPart.en}. So the greatest common factor is $${mono(g)}$.`,
    `系数 $${coefs}$ 的最大公因数是 $${g.c}$。$${xs}$ 中 $x$ 的最小次幂是 $${pw("x", g.x)}$${yPart["zh-CN"]}。所以最大公因式是 $${mono(g)}$。`,
  );
}

/** coprimeMultiples draws k coefficients g·pᵢ with pᵢ in [1, 7] and gcd of the pᵢ equal to 1, so their gcd is g. */
function coprimeMultiples(rng: Rng, g: number, k: number): number[] {
  let ps: number[];
  do {
    ps = Array.from({ length: k }, () => rng.int(1, 7));
  } while (ps.reduce((a, b) => gcd(a, b), 0) !== 1 || new Set(ps).size < 2);
  return ps.map((p) => g * p);
}

export const greatestCommonFactorOfMonomials: TopicDef = {
  id: "greatest-common-factor-of-monomials",
  title: t("The Greatest Common Factor of Monomials", "单项式的最大公因式"),
  summary: t("Find the greatest common factor of two or three monomials.", "求两个或三个单项式的最大公因式。"),
  prerequisites: ["product-and-quotient-rules"],
  encompasses: [{ topic: "greatest-common-factor", weight: 0.5 }],
  xp: 10,
  standards: ["CCSS.HSA.SSE.A.2"],
  knowledgePoints: [
    {
      id: "one-variable",
      title: t("Two monomials in one variable", "两个一元单项式"),
      explanation: t(
        "The **greatest common factor** (GCF) of two monomials is the greatest monomial that divides both. Take the greatest common factor of the coefficients, times the variable raised to the **smaller** of its two exponents: $x^{5}$ and $x^{3}$ both contain at least three factors of $x$, but not four.\n\n$$12x^{5} = 6x^{3} \\cdot 2x^{2} \\qquad 18x^{3} = 6x^{3} \\cdot 3$$\n\nso the GCF of $12x^{5}$ and $18x^{3}$ is $6x^{3}$.",
        "两个单项式的**最大公因式**是能同时整除它们的最大的单项式。取系数的最大公因数，乘以变量的幂，指数取两个指数中**较小**的一个：$x^{5}$ 和 $x^{3}$ 都至少含有三个 $x$，但不都含有四个。\n\n$$12x^{5} = 6x^{3} \\cdot 2x^{2} \\qquad 18x^{3} = 6x^{3} \\cdot 3$$\n\n所以 $12x^{5}$ 和 $18x^{3}$ 的最大公因式是 $6x^{3}$。",
      ),
      keyPrerequisites: ["greatest-common-factor"],
      generate(rng) {
        const g = rng.int(1, 9);
        const [a, b] = coprimeMultiples(rng, g, 2);
        let m: number;
        let n: number;
        do {
          m = rng.int(1, 8);
          n = rng.int(1, 8);
        } while (m === n);
        const ms = [term(a!, m), term(b!, n)];
        const answer = mono(gcfOf(ms));
        return expandProblem({
          prompt: t(
            `Find the greatest common factor of $${mono(ms[0]!)}$ and $${mono(ms[1]!)}$.`,
            `求 $${mono(ms[0]!)}$ 和 $${mono(ms[1]!)}$ 的最大公因式。`,
          ),
          answer,
          wrong: [mono(term(g, Math.max(m, n))), mono(term((a! * b!) / g, Math.max(m, n))), mono(term(g, Math.abs(m - n)))],
          solution: gcfSolution(ms),
        });
      },
    },
    {
      id: "two-variables",
      title: t("Monomials in two variables", "含两个变量的单项式"),
      explanation: t(
        "With several variables, treat each variable separately and take its smaller exponent. A variable missing from one of the monomials is not a common factor. Signs do not matter: the GCF is taken positive.\n\n$$\\text{The GCF of } 8x^{2}y^{3} \\text{ and } -12x^{4} \\text{ is } 4x^{2}$$",
        "多个变量时，每个变量分别考虑，取较小的指数。只要有一个单项式不含某个变量，这个变量就不是公因式。符号不影响结果：最大公因式取正的。\n\n$$8x^{2}y^{3} \\text{ 和 } -12x^{4} \\text{ 的最大公因式是 } 4x^{2}$$",
      ),
      generate(rng) {
        const g = rng.int(1, 9);
        const [a, b] = coprimeMultiples(rng, g, 2);
        let i: number;
        let k: number;
        do {
          i = rng.int(1, 6);
          k = rng.int(1, 6);
        } while (i === k && rng.bool(0.8));
        const j = rng.bool(0.25) ? 0 : rng.int(1, 5);
        const l = j === 0 ? rng.int(1, 5) : rng.bool(0.2) ? 0 : rng.int(1, 5);
        const s = rng.bool(0.25) ? -1 : 1;
        const ms = rng.shuffle([term(s * a!, i, j), term(b!, k, l)]);
        const gcf = gcfOf(ms);
        return expandProblem({
          prompt: t(
            `Find the greatest common factor of $${mono(ms[0]!)}$ and $${mono(ms[1]!)}$.`,
            `求 $${mono(ms[0]!)}$ 和 $${mono(ms[1]!)}$ 的最大公因式。`,
          ),
          answer: mono(gcf),
          wrong: [
            mono(term(g, Math.max(i, k), Math.max(j, l))),
            mono(term(g, gcf.x, Math.max(j, l))),
            mono(term(-g, gcf.x, gcf.y)),
            mono(term(g, gcf.x)),
          ],
          solution: gcfSolution(ms),
        });
      },
    },
    {
      id: "three-monomials",
      title: t("Three monomials", "三个单项式"),
      explanation: t(
        "For three monomials, the GCF must divide all three: take the greatest common factor of the three coefficients and, for each variable in all three, its smallest exponent.\n\n$$\\text{The GCF of } 6x^{4}y^{2}, \\; 9x^{2}y^{5} \\text{ and } 15x^{3}y \\text{ is } 3x^{2}y$$",
        "三个单项式的最大公因式必须同时整除这三个单项式：取三个系数的最大公因数，对三个单项式都含有的每个变量取最小的指数。\n\n$$6x^{4}y^{2}, \\; 9x^{2}y^{5} \\text{ 和 } 15x^{3}y \\text{ 的最大公因式是 } 3x^{2}y$$",
      ),
      generate(rng) {
        const g = rng.int(1, 6);
        const cs = coprimeMultiples(rng, g, 3);
        const ms = cs.map((c) => term(c, rng.int(1, 6), rng.bool(0.15) ? 0 : rng.int(1, 5)));
        const gcf = gcfOf(ms);
        const firstTwo = gcfOf(ms.slice(0, 2));
        return expandProblem({
          prompt: t(
            `Find the greatest common factor of $${mono(ms[0]!)}$, $${mono(ms[1]!)}$ and $${mono(ms[2]!)}$.`,
            `求 $${mono(ms[0]!)}$、$${mono(ms[1]!)}$ 和 $${mono(ms[2]!)}$ 的最大公因式。`,
          ),
          answer: mono(gcf),
          wrong: [mono(firstTwo), mono(term(g, Math.max(...ms.map((m) => m.x)), Math.max(...ms.map((m) => m.y)))), mono(term(g))],
          solution: gcfSolution(ms),
        });
      },
    },
  ],
};

/** polynomialTopics are the topics of the polynomials unit, in teaching order. */
export const polynomialTopics: readonly TopicDef[] = [
  introductionToPolynomials,
  degreeOfAPolynomial,
  simplifyingPolynomials,
  distributiveLawForPolynomials,
  addingAndSubtractingPolynomials,
  monomialsBinomialsAndTrinomials,
  multiplyingBinomials,
  multiplyingPolynomials,
  squaringBinomials,
  expandingBinomialsUsingPascalsTriangle,
  differenceOfSquaresFormula,
  greatestCommonFactorOfMonomials,
];
