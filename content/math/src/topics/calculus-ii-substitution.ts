import type { Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Coefficient, dec, linear, poly, Q } from "@ga/subject-math";

import { functionProblem, numberProblem, steps } from "../problems.ts";
import { stepLabel } from "../solution-kit.ts";
import { reasoned } from "../wrong-reasons.ts";
import { gcd, oneOf } from "./calculus-common.ts";

// Calculus II unit 1: Integration Techniques, modules 1.1–1.2.

/** plusC writes an antiderivative from its terms, ending in "+ C". */
export const plusC = (...terms: (readonly [Coefficient, string])[]) => `${poly(...terms) || "0"} + C`;

/** coef writes a coefficient in front of a function: "", "-", "3", "\frac{1}{2}". */
export const coef = (c: Q) => (c.eq(Q.one) ? "" : c.eq(Q.one.neg()) ? "-" : c.toLatex());

/** pow writes base raised to a rational exponent, leaving the exponent 1 out. */
export const pow = (base: string, e: Q) => (e.eq(Q.one) ? base : `${base}^{${e.toLatex()}}`);

/** xPow writes x to a natural power: "", "x", "x^{2}". */
export const xPow = (i: number) => (i === 0 ? "" : i === 1 ? "x" : `x^{${i}}`);

/** quotient writes k over a denominator, with the sign in front: "\frac{3}{x}", "-\frac{2}{x + 1}". */
export const quotient = (k: Coefficient, den: string) => {
  const q = k instanceof Q ? k : Q.of(k);
  return `${q.sign() < 0 ? "-" : ""}\\frac{${q.abs().n}}{${q.d === 1n ? "" : q.d}${den}}`;
};

/** fracWith writes k·top over a denominator, with the sign in front: "\frac{3x}{x^{2} + 1}", "-\frac{e^{x}}{e^{x} + 2}". */
export const fracWith = (k: number, top: string, den: string) =>
  `${k < 0 ? "-" : ""}\\frac{${Math.abs(k) === 1 ? top : `${Math.abs(k)}${top}`}}{${den}}`;

/** ratio writes c·x / a reduced: "x", "2x", "\frac{x}{3}", "\frac{2x}{3}". */
export const ratio = (c: number, a: number, v = "x") => {
  const g = gcd(c, a);
  const [cc, aa] = [c / g, a / g];
  return aa === 1 ? poly([cc, v]) : `\\frac{${poly([cc, v])}}{${aa}}`;
};

/** within is the note that restricts x to an interval, in a prompt. */
export interface Domain {
  readonly en: string;
  readonly zh: string;
}

/** integral builds a problem asking for ∫ integrand dx. */
export function integral(integrand: string, answer: string, wrong: readonly string[], en: string, zh: string, domain?: Domain) {
  return asked(integrand, answer, wrong, t(en, zh), domain);
}

/** exactValue builds a problem asking for the exact value of a definite integral. */
export function exactValue(integral: string, answer: string, wrong: readonly string[], en: string, zh: string) {
  return evaluated(integral, answer, wrong, t(en, zh));
}

/** asked builds a problem asking for ∫ integrand dx, with a solution in both languages. */
function asked(integrand: string, answer: string, wrong: readonly string[], solution: Text, domain?: Domain) {
  return functionProblem({
    prompt: t(
      `Find $\\int ${integrand} \\, dx$${domain ? ` for ${domain.en}` : ""}.`,
      `${domain ? `当 ${domain.zh} 时，` : ""}求 $\\int ${integrand} \\, dx$。`,
    ),
    answer,
    antiderivative: true,
    wrong,
    solution,
  });
}

/** evaluated builds a problem asking for the exact value of a definite integral, with a solution in both languages. */
function evaluated(integral: string, answer: string, wrong: readonly string[], solution: Text) {
  return functionProblem({
    prompt: t(`Evaluate $${integral}$. Give an exact answer.`, `计算 $${integral}$，给出精确值。`),
    answer,
    wrong,
    solution,
  });
}

/** Step is one labelled step of a solution: its title in both languages, what it says, and the lines it displays. */
type Step = readonly [title: readonly [string, string], say: Text, lines?: readonly string[]];

/** walked writes labelled steps, each with its displayed lines, followed by a check that takes a second route. */
function walked(parts: readonly Step[], check: Text): Text {
  const write = (locale: keyof Text) =>
    parts
      .map(
        ([[en, zh], say, lines = []], i) =>
          `${stepLabel(i + 1, en, zh)[locale]} ${say[locale]}${lines.length > 0 ? steps(...lines) : "\n\n"}`,
      )
      .join("") + (locale === "en" ? `**Check.** ${check.en}` : `**检验。** ${check["zh-CN"]}`);
  return t(write("en"), write("zh-CN"));
}

/** noC drops the trailing "+ C" of an antiderivative. */
const noC = (answer: string) => answer.replace(/ \+ C$/, "");

/** par writes a number, in parentheses when it is negative. */
const par = (v: Q | number) => {
  const q = v instanceof Q ? v : Q.of(v);
  return q.sign() < 0 ? `\\left(${q.toLatex()}\\right)` : q.toLatex();
};

/** Sub is one substitution worked through: u and du, the integral before and after, its value in u and the answer in x. */
interface Sub {
  readonly u: string;
  readonly du: readonly string[];
  readonly integral: string;
  readonly inU: string;
  readonly valueInU: string;
  readonly answer: string;
  readonly why?: Text;
}

/** substituted walks through a substitution in three steps: choose u, rewrite the integral in u, integrate and substitute back. */
function substituted(s: Sub, check: Text): Text {
  return walked(
    [
      [["Choose u", "选取 u"], s.why ?? t(`Let $u = ${s.u}$. Then:`, `令 $u = ${s.u}$，则：`), s.du],
      [
        ["Rewrite the integral in u", "把积分改写成 u 的积分"],
        t("Replace each part of the integrand:", "替换被积式的每一部分："),
        [`${s.integral} = ${s.inU}`],
      ],
      [
        ["Integrate and substitute back", "积分并代回"],
        t(`Integrate with respect to $u$, then put back $u = ${s.u}$:`, `对 $u$ 积分，再代回 $u = ${s.u}$：`),
        [`${s.inU} = ${s.valueInU} = ${s.answer}`],
      ],
    ],
    check,
  );
}

/** differentiated is the check of an antiderivative: its derivative, worked out in a displayed line, is the integrand. */
const differentiated = (line: string): Text =>
  t(
    `Differentiate the answer. The result should be the integrand:${steps(line).trimEnd()}`,
    `对答案求导，结果应当等于被积函数：${steps(line).trimEnd()}`,
  );

/** ddx writes the derivative of an antiderivative, without its constant. */
const ddx = (answer: string) => `\\frac{d}{dx}\\left[${noC(answer)}\\right]`;

/** scaled writes k·(inner)^m, as a root or a fraction where the exponent calls for one. */
function scaled(k: Coefficient, inner: string, m: Q, factor = ""): string {
  const kq = k instanceof Q ? k : Q.of(k);
  if (m.sign() < 0) {
    const e = m.neg();
    const den = e.eq(Q.of(1, 2)) ? `\\sqrt{${inner}}` : e.eq(Q.one) ? inner : `(${inner})^{${e.toLatex()}}`;
    return `${kq.sign() < 0 ? "-" : ""}\\frac{${poly([kq.abs(), factor]) || "1"}}{${den}}`;
  }
  const body = m.eq(Q.of(1, 2)) ? `\\sqrt{${inner}}` : m.eq(Q.one) ? `(${inner})` : `(${inner})^{${m.toLatex()}}`;
  return `${factor === "" ? coef(kq) : poly([kq, factor])}${body}`;
}

/** powTerm writes c·(inner)^e, as a root or a fraction where the exponent calls for one. */
export function powTerm(c: Q, inner: string, e: Q): string {
  if (e.sign() < 0)
    return quotient(c, e.eq(Q.of(-1, 2)) ? `\\sqrt{${inner}}` : e.eq(Q.of(-1)) ? inner : `(${inner})^{${e.neg().toLatex()}}`);
  return poly([c, e.eq(Q.of(1, 2)) ? `\\sqrt{${inner}}` : pow(`(${inner})`, e)]);
}

/** powerExponents are the exponents m of (inner)^m in substitution problems. */
const powerExponents: readonly Q[] = [...[2, 3, 4, 5, 6, -2, -3].map((n) => Q.of(n)), Q.of(1, 2), Q.of(-1, 2), Q.of(3, 2)];

/** integratingAlgebraicFunctionsUsingSubstitution integrates powers of linear and power-of-x inner functions. */
export const integratingAlgebraicFunctionsUsingSubstitution: TopicDef = {
  id: "integrating-algebraic-functions-using-substitution",
  title: t("Integrating Algebraic Functions Using Substitution", "用换元法求代数函数的积分"),
  summary: t(
    "Integrate powers of a linear or power-of-x inner function by substituting u for the inner function.",
    "用 u 代换内层函数，求以一次式或 x 的幂为内层的幂函数的积分。",
  ),
  prerequisites: ["the-constant-multiple-rule-for-indefinite-integrals"],
  encompasses: [{ topic: "the-constant-multiple-rule-for-indefinite-integrals", weight: 0.4 }],
  xp: 10,
  standards: [],
  intro: t(
    `The constant multiple rule lets a constant pass through the integral sign, so $\\int 6x^{2} \\, dx = 6\\int x^{2} \\, dx$, which is $2x^{3} + C$. The power rule handles a power of $x$, but not a power of an expression such as $(2x + 1)^{3}$, unless we expand it first.

Check: the derivative of $2x^{3}$ is $6x^{2}$, the integrand.

In this lesson we integrate a power of a linear expression, and a power of $ax^{n} + b$ beside a multiple of $x^{n - 1}$, by writing the inner expression as a new variable $u$.`,
    `常数倍法则让常数可以移到积分号外面，所以 $\\int 6x^{2} \\, dx = 6\\int x^{2} \\, dx$，即 $2x^{3} + C$。幂法则能处理 $x$ 的幂，但处理不了 $(2x + 1)^{3}$ 这样的式子的幂，除非先把它展开。

检验：$2x^{3}$ 的导数是 $6x^{2}$，正是被积函数。

这节课我们把内层的式子设为新变量 $u$，求一次式的幂的积分，以及 $ax^{n} + b$ 的幂乘以 $x^{n - 1}$ 的倍数的积分。`,
  ),
  knowledgePoints: [
    {
      id: "substituting-a-linear-inner-function",
      title: t("Substituting a linear inner function", "代换一次内层函数"),
      explanation: t(
        "Substitution reverses the chain rule. For $\\int (ax + b)^{m} \\, dx$ with $m \\ne -1$, let $u = ax + b$. Then $\\frac{du}{dx} = a$, so $dx = \\frac{1}{a} \\, du$ and\n\n$$\\int (ax + b)^{m} \\, dx = \\frac{1}{a}\\int u^{m} \\, du = \\frac{(ax + b)^{m + 1}}{a(m + 1)} + C.$$\n\nFinish by writing the answer in terms of $x$. For example, with $u = 3x - 1$:\n\n$$\\int (3x - 1)^{4} \\, dx = \\frac{1}{3}\\int u^{4} \\, du = \\frac{(3x - 1)^{5}}{15} + C.$$\n\nCheck: by the chain rule, the derivative of $\\frac{(3x - 1)^{5}}{15}$ is $\\frac{5(3x - 1)^{4} \\cdot 3}{15}$, which is $(3x - 1)^{4}$.\n\n> **Watch out.** Do not leave out the factor $\\frac{1}{a}$. Differentiating the answer brings out a factor $a$ from the inner expression, and the $\\frac{1}{a}$ is there to cancel it.",
        "换元法是链式法则的逆运算。对 $\\int (ax + b)^{m} \\, dx$（$m \\ne -1$），令 $u = ax + b$，则 $\\frac{du}{dx} = a$，即 $dx = \\frac{1}{a} \\, du$，于是\n\n$$\\int (ax + b)^{m} \\, dx = \\frac{1}{a}\\int u^{m} \\, du = \\frac{(ax + b)^{m + 1}}{a(m + 1)} + C$$\n\n最后把答案写回关于 $x$ 的形式。例如令 $u = 3x - 1$：\n\n$$\\int (3x - 1)^{4} \\, dx = \\frac{1}{3}\\int u^{4} \\, du = \\frac{(3x - 1)^{5}}{15} + C$$\n\n检验：由链式法则，$\\frac{(3x - 1)^{5}}{15}$ 的导数是 $\\frac{5(3x - 1)^{4} \\cdot 3}{15}$，即 $(3x - 1)^{4}$。\n\n> **注意。** 不要漏掉因子 $\\frac{1}{a}$。对答案求导时，内层的式子会带出因子 $a$，$\\frac{1}{a}$ 正是用来抵消它的。",
      ),
      generate(rng) {
        const m = rng.pick(powerExponents);
        // A root needs ax + b > 0 for most sample points, so take a, b > 0.
        const a = m.isInteger() ? rng.pick([2, 3, 4, 5, -2, -3]) : rng.int(2, 5);
        const b = m.isInteger() ? rng.nonZero(-9, 9) : rng.int(1, 9);
        const k = rng.nonZero(-6, 6);
        const inner = linear(a, b);
        const up = m.add(Q.one);
        const c = Q.of(k).div(Q.of(a).mul(up));
        const answer = `${powTerm(c, inner, up)} + C`;
        const integrand = scaled(k, inner, m);
        return asked(
          integrand,
          answer,
          [
            `${powTerm(Q.of(k).div(up), inner, up)} + C`,
            `${powTerm(Q.of(k * a).div(up), inner, up)} + C`,
            `${powTerm(Q.of(k).mul(m).mul(Q.of(a)), inner, m.sub(Q.one))} + C`,
          ],
          substituted(
            {
              u: inner,
              du: [`du = ${a} \\, dx`, `dx = \\frac{1}{${a}} \\, du`],
              integral: `\\int ${integrand} \\, dx`,
              inU: `${coef(Q.of(k, a))}\\int u^{${m.toLatex()}} \\, du`,
              valueInU: `${poly([c, `u^{${up.toLatex()}}`])} + C`,
              answer,
            },
            differentiated(`${ddx(answer)} = ${c.toLatex()} \\cdot ${par(up)} \\cdot ${par(a)}(${inner})^{${m.toLatex()}} = ${integrand}`),
          ),
        );
      },
    },
    {
      id: "substituting-a-power-of-x",
      title: t("Substituting a power of x", "代换 x 的幂"),
      explanation: t(
        "When the integrand contains $(ax^{n} + b)^{m}$ multiplied by a constant times $x^{n - 1}$, let $u = ax^{n} + b$. Then $du = nax^{n - 1} \\, dx$, which absorbs the factor $x^{n - 1}$. For example, with $u = x^{3} + 2$ and $du = 3x^{2} \\, dx$:\n\n$$\\int 6x^{2}(x^{3} + 2)^{4} \\, dx = 2\\int u^{4} \\, du = \\frac{2}{5}(x^{3} + 2)^{5} + C.$$\n\nCheck: by the chain rule, the derivative of $\\frac{2}{5}(x^{3} + 2)^{5}$ is $2(x^{3} + 2)^{4} \\cdot 3x^{2}$, which is $6x^{2}(x^{3} + 2)^{4}$.\n\n> **Watch out.** The substitution works only when the factor beside the power is a constant multiple of $x^{n - 1}$. In $\\int (x^{3} + 2)^{4} \\, dx$ there is no $x^{2}$ for $du$ to absorb, so $u = x^{3} + 2$ does not help there.",
        "当被积函数含 $(ax^{n} + b)^{m}$，并乘以常数倍的 $x^{n - 1}$ 时，令 $u = ax^{n} + b$，则 $du = nax^{n - 1} \\, dx$，正好吸收因子 $x^{n - 1}$。例如令 $u = x^{3} + 2$，$du = 3x^{2} \\, dx$：\n\n$$\\int 6x^{2}(x^{3} + 2)^{4} \\, dx = 2\\int u^{4} \\, du = \\frac{2}{5}(x^{3} + 2)^{5} + C$$\n\n检验：由链式法则，$\\frac{2}{5}(x^{3} + 2)^{5}$ 的导数是 $2(x^{3} + 2)^{4} \\cdot 3x^{2}$，即 $6x^{2}(x^{3} + 2)^{4}$。\n\n> **注意。** 只有当幂旁边的因子是 $x^{n - 1}$ 的常数倍时，这个代换才可行。在 $\\int (x^{3} + 2)^{4} \\, dx$ 中，没有 $x^{2}$ 可以被 $du$ 吸收，所以代换 $u = x^{3} + 2$ 在那里不起作用。",
      ),
      generate(rng) {
        const n = rng.int(2, 4);
        const m = rng.pick([2, 3, 4, 5, -2, -3].map((v) => Q.of(v)).concat([Q.of(1, 2), Q.of(-1, 2)]));
        const a = m.isInteger() ? rng.pick([1, 1, 2, 3, -1, -2]) : rng.pick([1, 1, 2, 3]);
        const b = m.isInteger() ? rng.nonZero(-9, 9) : rng.int(1, 9);
        const k = rng.bool() ? n * a * rng.nonZero(-3, 3) : rng.nonZero(-9, 9);
        const inner = poly([a, `x^{${n}}`], [b, ""]);
        const up = m.add(Q.one);
        const c = Q.of(k).div(Q.of(n * a).mul(up));
        const answer = `${powTerm(c, inner, up)} + C`;
        const integrand = scaled(k, inner, m, xPow(n - 1));
        const dudx = poly([n * a, xPow(n - 1)]);
        return asked(
          integrand,
          answer,
          [
            `${powTerm(Q.of(k).div(up), inner, up)} + C`,
            `${powTerm(Q.of(k).div(Q.of(a).mul(up)), inner, up)} + C`,
            plusC([c.mul(Q.of(a)), `${xPow(n)}${pow(`(${inner})`, up)}`]),
          ],
          substituted(
            {
              u: inner,
              du: [`du = ${dudx} \\, dx`, `${xPow(n - 1)} \\, dx = \\frac{1}{${n * a}} \\, du`],
              integral: `\\int ${integrand} \\, dx`,
              inU: `${coef(Q.of(k, n * a))}\\int u^{${m.toLatex()}} \\, du`,
              valueInU: `${poly([c, `u^{${up.toLatex()}}`])} + C`,
              answer,
            },
            differentiated(
              `${ddx(answer)} = ${c.toLatex()} \\cdot ${par(up)}(${inner})^{${m.toLatex()}} \\cdot \\left(${dudx}\\right) = ${integrand}`,
            ),
          ),
        );
      },
    },
  ],
};

/** integratingLinearRationalFunctionsUsingSubstitution integrates k/(ax + b) and (cx + d)/(ax + b). */
export const integratingLinearRationalFunctionsUsingSubstitution: TopicDef = {
  id: "integrating-linear-rational-functions-using-substitution",
  title: t("Integrating Linear Rational Functions Using Substitution", "用换元法求一次有理函数的积分"),
  summary: t("Integrate quotients of linear functions, which give logarithms.", "求一次函数之商的积分，结果含对数。"),
  prerequisites: ["integrating-algebraic-functions-using-substitution", "integrating-the-reciprocal-function"],
  encompasses: [
    { topic: "integrating-algebraic-functions-using-substitution", weight: 0.3 },
    { topic: "integrating-the-reciprocal-function", weight: 0.4 },
  ],
  xp: 10,
  standards: [],
  intro: t(
    `The reciprocal function integrates to a logarithm: $\\int \\frac{3}{x} \\, dx = 3\\ln|x| + C$. The power rule cannot give this, because $\\frac{1}{x}$ is $x^{-1}$, and raising the exponent by one would divide by zero.

Check: the derivative of $3\\ln|x|$ is $\\frac{3}{x}$ for $x > 0$ and for $x < 0$ alike.

In this lesson we combine this with substitution to integrate one over a linear expression, and a quotient of two linear expressions after splitting off a constant.`,
    `倒数函数的积分是对数：$\\int \\frac{3}{x} \\, dx = 3\\ln|x| + C$。幂法则得不到这个结果，因为 $\\frac{1}{x}$ 是 $x^{-1}$，指数加一后要除以零。

检验：无论 $x > 0$ 还是 $x < 0$，$3\\ln|x|$ 的导数都是 $\\frac{3}{x}$。

这节课我们把它与换元法结合起来，求一次式的倒数的积分，以及先分出常数后，两个一次式之商的积分。`,
  ),
  knowledgePoints: [
    {
      id: "integrating-one-over-a-linear-function",
      title: t("Integrating one over a linear function", "一次式倒数的积分"),
      explanation: t(
        "Substituting the linear expression turns the integrand into one over the new variable, whose integral is a logarithm; the leftover factor is one over the coefficient. With $u = ax + b$ and $dx = \\frac{1}{a} \\, du$,\n\n$$\\int \\frac{1}{ax + b} \\, dx = \\frac{1}{a}\\int \\frac{1}{u} \\, du = \\frac{1}{a}\\ln|ax + b| + C.$$\n\nThe power rule does not apply because the exponent is $-1$. For example:\n\n$$\\int \\frac{1}{2x + 1} \\, dx = \\frac{1}{2}\\ln|2x + 1| + C.$$\n\nCheck: the derivative of $\\frac{1}{2}\\ln|2x + 1|$ is $\\frac{1}{2} \\cdot \\frac{2}{2x + 1}$, which is $\\frac{1}{2x + 1}$.\n\n> **Watch out.** Keep the absolute value: $ax + b$ is negative for some $x$, and the logarithm of a negative number is not defined.",
        "把一次式换元后，被积函数变成新变量的倒数，它的积分是对数；剩下的因子是系数的倒数。令 $u = ax + b$，$dx = \\frac{1}{a} \\, du$，则\n\n$$\\int \\frac{1}{ax + b} \\, dx = \\frac{1}{a}\\int \\frac{1}{u} \\, du = \\frac{1}{a}\\ln|ax + b| + C$$\n\n指数为 $-1$，所以不能用幂法则。例如：\n\n$$\\int \\frac{1}{2x + 1} \\, dx = \\frac{1}{2}\\ln|2x + 1| + C$$\n\n检验：$\\frac{1}{2}\\ln|2x + 1|$ 的导数是 $\\frac{1}{2} \\cdot \\frac{2}{2x + 1}$，即 $\\frac{1}{2x + 1}$。\n\n> **注意。** 要保留绝对值：对某些 $x$，$ax + b$ 是负数，而负数的对数没有定义。",
      ),
      generate(rng) {
        const a = rng.pick([2, 3, 4, 5, 6, -2, -3, -4]);
        const b = rng.nonZero(-9, 9);
        const k = rng.nonZero(-9, 9);
        const inner = linear(a, b);
        const ln = `\\ln|${inner}|`;
        const answer = plusC([Q.of(k, a), ln]);
        const integrand = quotient(k, inner);
        return asked(
          integrand,
          answer,
          [plusC([k, ln]), plusC([k * a, ln]), plusC([Q.of(-k, a), `(${inner})^{-2}`])],
          substituted(
            {
              u: inner,
              du: [`du = ${a} \\, dx`, `dx = \\frac{1}{${a}} \\, du`],
              integral: `\\int ${integrand} \\, dx`,
              inU: `${coef(Q.of(k, a))}\\int \\frac{1}{u} \\, du`,
              valueInU: plusC([Q.of(k, a), "\\ln|u|"]),
              answer,
            },
            differentiated(`${ddx(answer)} = ${Q.of(k, a).toLatex()} \\cdot \\frac{${a}}{${inner}} = ${integrand}`),
          ),
        );
      },
    },
    {
      id: "integrating-a-quotient-of-linear-functions",
      title: t("Integrating a quotient of linear functions", "一次函数之商的积分"),
      explanation: t(
        "Write the numerator as a multiple of the denominator plus a constant, then integrate term by term:\n\n$$\\int \\frac{2x + 5}{x + 1} \\, dx = \\int \\left(2 + \\frac{3}{x + 1}\\right) dx = 2x + 3\\ln|x + 1| + C.$$\n\nIn general the numerator splits as\n\n$$cx + d = \\frac{c}{a}(ax + b) + \\left(d - \\frac{bc}{a}\\right).$$\n\nCheck: $2(x + 1) + 3$ is $2x + 5$, so the split is right, and the derivative of $2x + 3\\ln|x + 1|$ is $2 + \\frac{3}{x + 1}$.\n\n> **Watch out.** Do not integrate the numerator and the denominator separately. The integral of a quotient is not the quotient of the integrals.",
        "把分子写成分母的倍数加一个常数，再逐项积分：\n\n$$\\int \\frac{2x + 5}{x + 1} \\, dx = \\int \\left(2 + \\frac{3}{x + 1}\\right) dx = 2x + 3\\ln|x + 1| + C$$\n\n一般地，分子可以拆成\n\n$$cx + d = \\frac{c}{a}(ax + b) + \\left(d - \\frac{bc}{a}\\right)$$\n\n检验：$2(x + 1) + 3$ 等于 $2x + 5$，所以拆分正确；$2x + 3\\ln|x + 1|$ 的导数是 $2 + \\frac{3}{x + 1}$。\n\n> **注意。** 不要把分子和分母分别积分。商的积分不等于积分的商。",
      ),
      generate(rng) {
        const a = rng.pick([1, 1, 2, 3]);
        const b = rng.nonZero(-7, 7);
        const c = rng.nonZero(-5, 5);
        let d = rng.nonZero(-9, 9);
        if (a * d === b * c) d += 1;
        const inner = linear(a, b);
        const ln = `\\ln|${inner}|`;
        const rest = Q.of(d).sub(Q.of(b * c, a));
        const lead = Q.of(c, a);
        const answer = plusC([lead, "x"], [rest.div(Q.of(a)), ln]);
        const op = rest.sign() < 0 ? "-" : "+";
        const top = linear(c, d);
        const split = `${lead.toLatex()} ${op} ${quotient(rest.abs(), inner)}`;
        return asked(
          `\\frac{${top}}{${inner}}`,
          answer,
          [plusC([lead, "x"], [rest, ln]), plusC([lead, "x"], [d, ln]), plusC([lead, ln])],
          walked(
            [
              [
                ["Split the numerator", "拆分分子"],
                t("Write the numerator as a multiple of the denominator plus a constant:", "把分子写成分母的倍数加一个常数："),
                [`${top} = ${coef(lead)}(${inner}) ${op} ${rest.abs().toLatex()}`],
              ],
              [
                ["Divide by the denominator", "除以分母"],
                t(
                  "So the integrand is a constant plus a multiple of one over the denominator:",
                  "所以被积函数是一个常数加上分母倒数的倍数：",
                ),
                [`\\frac{${top}}{${inner}} = ${split}`],
              ],
              [
                ["Integrate term by term", "逐项积分"],
                t(
                  `The constant gives a multiple of $x$, and the fraction gives a logarithm${a === 1 ? "" : `, divided by $${a}$ because $du = ${a} \\, dx$ for $u = ${inner}$`}:`,
                  `常数积分得 $x$ 的倍数，分式积分得对数${a === 1 ? "" : `；由于 $u = ${inner}$ 时 $du = ${a} \\, dx$，对数项还要除以 $${a}$`}：`,
                ),
                [`\\int \\left(${split}\\right) dx = ${answer}`],
              ],
            ],
            t(
              `Differentiating the answer gives $${split}$. Over the common denominator $${inner}$, its numerator is $${coef(lead)}(${inner}) ${op} ${rest.abs().toLatex()}$, which expands to $${top}$, so the derivative is the integrand.`,
              `对答案求导得 $${split}$。通分后分母是 $${inner}$，分子是 $${coef(lead)}(${inner}) ${op} ${rest.abs().toLatex()}$，展开得 $${top}$，所以导数正是被积函数。`,
            ),
          ),
        );
      },
    },
  ],
};

/** Choice is one substitution exercise: an integrand, the right choice of u and its du, the integral in u, an antiderivative, its derivative written out, and the wrong choices of u with what is wrong with each. */
interface Choice {
  readonly integrand: string;
  readonly u: string;
  readonly du: string;
  readonly inU: string;
  readonly F: string;
  readonly dF: string;
  readonly wrong: readonly (readonly [u: string, en: string, zh: string])[];
}

/** plain is what is wrong with u = x: it changes nothing. */
const plain = [
  "x",
  "Then $du = dx$, and the integral is exactly the one we started with.",
  "这时 $du = dx$，积分和原来完全一样。",
] as const;

/** substitutionChoice makes an integrand whose substitution must be recognized. */
function substitutionChoice(rng: Rng): Choice {
  const b = rng.nonZero(-9, 9);
  const m = rng.int(2, 7);
  switch (rng.int(0, 5)) {
    case 0: {
      const u = poly([1, "x^{3}"], [b, ""]);
      const integrand = `x^{2}(${u})^{${m}}`;
      return {
        integrand,
        u,
        du: "3x^{2} \\, dx",
        inU: `\\int ${integrand} \\, dx = \\frac{1}{3}\\int u^{${m}} \\, du`,
        F: `\\frac{(${u})^{${m + 1}}}{${3 * (m + 1)}}`,
        dF: `\\frac{${m + 1}(${u})^{${m}} \\cdot 3x^{2}}{${3 * (m + 1)}}`,
        wrong: [
          [
            "x^{2}",
            "$x^{2}$ is the factor beside the power, not the expression inside it; the power would still be in $x$.",
            "$x^{2}$ 是幂旁边的因子，不是幂里面的式子；幂仍然是 $x$ 的式子。",
          ],
          plain,
          [
            poly([1, "x^{2}"], [b, ""]),
            "This is not the expression inside the power, which has $x^{3}$.",
            "这不是幂里面的式子，幂里面是含 $x^{3}$ 的式子。",
          ],
        ],
      };
    }
    case 1: {
      const p = rng.nonZero(-6, 6);
      const u = poly([1, "x^{2}"], [p, "x"], [b, ""]);
      const top = linear(2, p);
      return {
        integrand: `\\frac{${top}}{${u}}`,
        u,
        du: `(${top}) \\, dx`,
        inU: `\\int \\frac{${top}}{${u}} \\, dx = \\int \\frac{1}{u} \\, du`,
        F: `\\ln|${u}|`,
        dF: `\\frac{1}{${u}} \\cdot (${top})`,
        wrong: [
          [
            top,
            "That is the numerator, the derivative of the denominator; the denominator would still be in $x$.",
            "这是分子，即分母的导数；分母仍然是 $x$ 的式子。",
          ],
          [
            "x^{2}",
            "Its derivative $2x$ is not the whole numerator, and the other terms of the denominator stay in $x$.",
            "它的导数 $2x$ 不是整个分子，分母的其他项仍然是 $x$ 的式子。",
          ],
          plain,
        ],
      };
    }
    case 2: {
      const a = rng.nonZero(-4, 4);
      const u = poly([a, "x^{2}"]);
      const d = poly([2 * a, "x"]);
      return {
        integrand: `xe^{${u}}`,
        u,
        du: `${d} \\, dx`,
        inU: `\\int xe^{${u}} \\, dx = \\frac{1}{${2 * a}}\\int e^{u} \\, du`,
        F: `\\frac{1}{${2 * a}}e^{${u}}`,
        dF: `\\frac{1}{${2 * a}}e^{${u}} \\cdot (${d})`,
        wrong: [
          plain,
          [d, "That is the derivative of the exponent, not the exponent itself.", "这是指数的导数，不是指数本身。"],
          [
            "e^{x}",
            `The exponent is $${u}$, not $x$, so $e^{x}$ does not appear in the integrand.`,
            `指数是 $${u}$，不是 $x$，所以被积函数中没有 $e^{x}$。`,
          ],
        ],
      };
    }
    case 3: {
      const j = 2 * rng.int(1, 3);
      return {
        integrand: `\\cos x \\sin^{${j}} x`,
        u: "\\sin x",
        du: "\\cos x \\, dx",
        inU: `\\int \\cos x \\sin^{${j}} x \\, dx = \\int u^{${j}} \\, du`,
        F: `\\frac{\\sin^{${j + 1}} x}{${j + 1}}`,
        dF: `\\frac{${j + 1}\\sin^{${j}} x \\cdot \\cos x}{${j + 1}}`,
        wrong: [
          [
            "\\cos x",
            "Its derivative $-\\sin x$ is not the factor beside the power; that factor is $\\cos x$.",
            "它的导数 $-\\sin x$ 不是幂旁边的因子，那个因子是 $\\cos x$。",
          ],
          ["\\tan x", "Its derivative $\\sec^{2} x$ does not appear in the integrand.", "它的导数 $\\sec^{2} x$ 不在被积函数中。"],
          plain,
        ],
      };
    }
    case 4: {
      const a = rng.int(2, 6);
      return {
        integrand: `\\frac{(\\ln x)^{${m}}}{${a}x}`,
        u: "\\ln x",
        du: "\\frac{1}{x} \\, dx",
        inU: `\\int \\frac{(\\ln x)^{${m}}}{${a}x} \\, dx = \\frac{1}{${a}}\\int u^{${m}} \\, du`,
        F: `\\frac{(\\ln x)^{${m + 1}}}{${a * (m + 1)}}`,
        dF: `\\frac{${m + 1}(\\ln x)^{${m}}}{${a * (m + 1)}} \\cdot \\frac{1}{x}`,
        wrong: [
          [`${a}x`, "Its derivative is a constant, and the logarithm would stay in $x$.", "它的导数是常数，对数仍然是 $x$ 的式子。"],
          [
            "\\frac{1}{x}",
            "Its derivative $-\\frac{1}{x^{2}}$ does not appear in the integrand.",
            "它的导数 $-\\frac{1}{x^{2}}$ 不在被积函数中。",
          ],
          [
            `x^{${m}}`,
            `$x^{${m}}$ is not in the integrand; the power belongs to $\\ln x$.`,
            `被积函数中没有 $x^{${m}}$，这个幂属于 $\\ln x$。`,
          ],
        ],
      };
    }
    default: {
      const c = Math.abs(b);
      const u = poly([1, "x^{2}"], [c, ""]);
      return {
        integrand: `x\\sqrt{${u}}`,
        u,
        du: "2x \\, dx",
        inU: `\\int x\\sqrt{${u}} \\, dx = \\frac{1}{2}\\int u^{\\frac{1}{2}} \\, du`,
        F: `\\frac{1}{3}(${u})^{\\frac{3}{2}}`,
        dF: `\\frac{1}{3} \\cdot \\frac{3}{2}(${u})^{\\frac{1}{2}} \\cdot 2x`,
        wrong: [
          plain,
          [
            "\\sqrt{x}",
            `$\\sqrt{x}$ does not appear in the integrand; the root is of $${u}$.`,
            `被积函数中没有 $\\sqrt{x}$，根号下是 $${u}$。`,
          ],
          [`x + ${c}`, `This is not the expression under the root, which is $${u}$.`, `这不是根号下的式子，根号下是 $${u}$。`],
        ],
      };
    }
  }
}

/** integrationUsingSubstitution chooses substitutions and integrates f(g(x))g'(x). */
export const integrationUsingSubstitution: TopicDef = {
  id: "integration-using-substitution",
  title: t("Integration Using Substitution", "换元积分法"),
  summary: t(
    "Choose u as an inner function whose derivative appears as a factor, and integrate f(g(x))g'(x).",
    "选取导数作为因子出现的内层函数为 u，求 f(g(x))g'(x) 的积分。",
  ),
  prerequisites: ["integrating-algebraic-functions-using-substitution"],
  encompasses: [{ topic: "integrating-algebraic-functions-using-substitution", weight: 0.3 }],
  xp: 10,
  standards: [],
  intro: t(
    `With $u = x^{2} + 1$ and $du = 2x \\, dx$, the integral $\\int 2x(x^{2} + 1)^{3} \\, dx$ becomes $\\int u^{3} \\, du$, which is $\\frac{1}{4}(x^{2} + 1)^{4} + C$. The substitution worked because the factor $2x$ is exactly the derivative of the inner expression.

Check: by the chain rule, the derivative of $\\frac{1}{4}(x^{2} + 1)^{4}$ is $(x^{2} + 1)^{3} \\cdot 2x$, the integrand.

In this lesson we learn to spot the inner function whose derivative appears as a factor, and to integrate any $f(g(x))g'(x)$ this way.`,
    `令 $u = x^{2} + 1$，$du = 2x \\, dx$，积分 $\\int 2x(x^{2} + 1)^{3} \\, dx$ 变成 $\\int u^{3} \\, du$，即 $\\frac{1}{4}(x^{2} + 1)^{4} + C$。代换之所以成功，是因为因子 $2x$ 正是内层式子的导数。

检验：由链式法则，$\\frac{1}{4}(x^{2} + 1)^{4}$ 的导数是 $(x^{2} + 1)^{3} \\cdot 2x$，正是被积函数。

这节课我们学习找出导数作为因子出现的内层函数，并用这种方法求任何 $f(g(x))g'(x)$ 的积分。`,
  ),
  knowledgePoints: [
    {
      id: "choosing-the-substitution",
      title: t("Choosing the substitution", "选择代换"),
      explanation: t(
        "The chain rule gives $\\frac{d}{dx}F(g(x)) = F'(g(x))g'(x)$, so with $u = g(x)$\n\n$$\\int f(g(x))g'(x) \\, dx = \\int f(u) \\, du.$$\n\nLook for an inner function $g(x)$ whose derivative, up to a constant factor, also multiplies the integrand. In $\\int x^{2}(x^{3} + 1)^{5} \\, dx$ the inner function is $x^{3} + 1$, and its derivative $3x^{2}$ appears as $x^{2}$, so the integral becomes $\\frac{1}{3}\\int u^{5} \\, du$.\n\nCheck: the answer $\\frac{1}{18}(x^{3} + 1)^{6}$ has derivative $\\frac{6}{18}(x^{3} + 1)^{5} \\cdot 3x^{2}$, which is $x^{2}(x^{3} + 1)^{5}$.\n\n> **Watch out.** Choose the expression inside the other function, not the factor beside it. Taking $u = x^{2}$ here would leave $(x^{3} + 1)^{5}$ in terms of $x$.",
        "由链式法则，$\\frac{d}{dx}F(g(x)) = F'(g(x))g'(x)$，所以令 $u = g(x)$，\n\n$$\\int f(g(x))g'(x) \\, dx = \\int f(u) \\, du$$\n\n寻找一个内层函数 $g(x)$，使它的导数（相差常数倍）也作为因子出现在被积函数中。在 $\\int x^{2}(x^{3} + 1)^{5} \\, dx$ 中，内层函数是 $x^{3} + 1$，它的导数 $3x^{2}$ 以 $x^{2}$ 的形式出现，所以积分变成 $\\frac{1}{3}\\int u^{5} \\, du$。\n\n检验：答案 $\\frac{1}{18}(x^{3} + 1)^{6}$ 的导数是 $\\frac{6}{18}(x^{3} + 1)^{5} \\cdot 3x^{2}$，即 $x^{2}(x^{3} + 1)^{5}$。\n\n> **注意。** 要选另一个函数里面的式子，而不是它旁边的因子。这里若取 $u = x^{2}$，$(x^{3} + 1)^{5}$ 仍然是 $x$ 的式子。",
      ),
      generate(rng) {
        const c = substitutionChoice(rng);
        const problem = oneOf(
          rng,
          t(
            `Which substitution turns $\\int ${c.integrand} \\, dx$ into an integral of a basic function of $u$?`,
            `哪个代换能把 $\\int ${c.integrand} \\, dx$ 化为关于 $u$ 的基本函数的积分？`,
          ),
          t(`$u = ${c.u}$`, `$u = ${c.u}$`),
          c.wrong.map(([w]) => t(`$u = ${w}$`, `$u = ${w}$`)),
          walked(
            [
              [
                ["Find the inner function and its derivative", "找出内层函数及其导数"],
                t(
                  `In the integrand, $${c.u}$ sits inside another function. With $u = ${c.u}$:`,
                  `在被积函数中，$${c.u}$ 位于另一个函数的里面。令 $u = ${c.u}$：`,
                ),
                [`du = ${c.du}`],
              ],
              [
                ["Rewrite the integral in u", "把积分改写成 u 的积分"],
                t(
                  "The factor beside it is a constant multiple of $du$, so the whole integral is written in $u$:",
                  "它旁边的因子是 $du$ 的常数倍，所以整个积分都能写成 $u$ 的积分：",
                ),
                [c.inU],
              ],
            ],
            t(
              `Integrating gives $${c.F} + C$. By the chain rule its derivative is $${c.dF}$, which simplifies to the integrand $${c.integrand}$.`,
              `积分得 $${c.F} + C$。由链式法则，它的导数是 $${c.dF}$，化简后正是被积函数 $${c.integrand}$。`,
            ),
          ),
        );
        return reasoned(
          problem,
          c.wrong.map(([w, en, zh]) => [`$u = ${w}$`, en, zh]),
        );
      },
    },
    {
      id: "integrating-f-of-g-times-g-prime",
      title: t("Integrating f(g(x))g'(x)", "求 f(g(x))g'(x) 的积分"),
      explanation: t(
        "Look for an inner function whose derivative also appears as a factor, since that is exactly the pattern the chain rule produces when you differentiate. Substitute $u = g(x)$, replace $g'(x) \\, dx$ by $du$ (adjusting a constant factor), integrate in $u$, and substitute back. With $u = x^{2} + 4x + 1$ and $du = (2x + 4) \\, dx = 2(x + 2) \\, dx$:\n\n$$\\int (x + 2)(x^{2} + 4x + 1)^{3} \\, dx = \\frac{1}{2}\\int u^{3} \\, du = \\frac{1}{8}(x^{2} + 4x + 1)^{4} + C.$$\n\nCheck: the derivative of $\\frac{1}{8}(x^{2} + 4x + 1)^{4}$ is $\\frac{4}{8}(x^{2} + 4x + 1)^{3}(2x + 4)$, which is $(x + 2)(x^{2} + 4x + 1)^{3}$.\n\n> **Watch out.** When the factor is half of $du$, as $x + 2$ is half of $2x + 4$, the integral in $u$ needs the factor $\\frac{1}{2}$. Leaving it out doubles the answer.",
        "寻找一个内层函数，使它的导数也作为因子出现，因为这正是求导时链式法则产生的形式。代换 $u = g(x)$，把 $g'(x) \\, dx$ 换成 $du$（调整常数因子），对 $u$ 积分，再代回。令 $u = x^{2} + 4x + 1$，$du = (2x + 4) \\, dx = 2(x + 2) \\, dx$：\n\n$$\\int (x + 2)(x^{2} + 4x + 1)^{3} \\, dx = \\frac{1}{2}\\int u^{3} \\, du = \\frac{1}{8}(x^{2} + 4x + 1)^{4} + C$$\n\n检验：$\\frac{1}{8}(x^{2} + 4x + 1)^{4}$ 的导数是 $\\frac{4}{8}(x^{2} + 4x + 1)^{3}(2x + 4)$，即 $(x + 2)(x^{2} + 4x + 1)^{3}$。\n\n> **注意。** 当因子是 $du$ 的一半时，比如 $x + 2$ 是 $2x + 4$ 的一半，$u$ 的积分前要乘 $\\frac{1}{2}$。漏掉它，答案就会大一倍。",
      ),
      generate(rng) {
        const h = rng.nonZero(-5, 5);
        const q = rng.nonZero(-9, 9);
        const m = rng.int(2, 5);
        const k = rng.nonZero(-6, 6);
        const half = rng.bool();
        const inner = poly([1, "x^{2}"], [2 * h, "x"], [q, ""]);
        const outer = half ? linear(1, h) : linear(2, 2 * h);
        const c = Q.of(k, (half ? 2 : 1) * (m + 1));
        const answer = plusC([c, `(${inner})^{${m + 1}}`]);
        const integrand = `${coef(Q.of(k))}(${outer})(${inner})^{${m}}`;
        return asked(
          integrand,
          answer,
          [
            plusC([Q.of(k, m + 1), `(${inner})^{${m + 1}}`]),
            plusC([c, `(${outer})(${inner})^{${m + 1}}`]),
            plusC([Q.of(k, m), `(${inner})^{${m + 1}}`]),
          ],
          substituted(
            {
              u: inner,
              du: [`du = (${linear(2, 2 * h)}) \\, dx${half ? ` = 2(${outer}) \\, dx` : ""}`],
              integral: `\\int ${integrand} \\, dx`,
              inU: `${coef(Q.of(k, half ? 2 : 1))}\\int u^{${m}} \\, du`,
              valueInU: plusC([c, `u^{${m + 1}}`]),
              answer,
            },
            differentiated(`${ddx(answer)} = ${c.toLatex()} \\cdot ${m + 1}(${inner})^{${m}}(${linear(2, 2 * h)}) = ${integrand}`),
          ),
        );
      },
    },
  ],
};

/** calculatingDefiniteIntegralsUsingSubstitution changes the limits of integration with the substitution. */
export const calculatingDefiniteIntegralsUsingSubstitution: TopicDef = {
  id: "calculating-definite-integrals-using-substitution",
  title: t("Calculating Definite Integrals Using Substitution", "用换元法计算定积分"),
  summary: t(
    "Evaluate definite integrals by substitution, changing the limits to values of u.",
    "用换元法计算定积分，并把积分限换成 u 的值。",
  ),
  prerequisites: [
    "integration-using-substitution",
    "integrating-linear-rational-functions-using-substitution",
    "the-fundamental-theorem-of-calculus",
  ],
  encompasses: [
    { topic: "integration-using-substitution", weight: 0.4 },
    { topic: "the-fundamental-theorem-of-calculus", weight: 0.3 },
  ],
  xp: 10,
  standards: [],
  intro: t(
    `Substitution gives the antiderivative $\\frac{1}{4}(x^{2} + 1)^{4}$ of $2x(x^{2} + 1)^{3}$, and the fundamental theorem then evaluates $\\int_{0}^{1} 2x(x^{2} + 1)^{3} \\, dx$ as its value at $1$ minus its value at $0$: $\\frac{16}{4} - \\frac{1}{4}$, which is $\\frac{15}{4}$.

Check: as $x$ runs from $0$ to $1$, $u = x^{2} + 1$ runs from $1$ to $2$, and $\\int_{1}^{2} u^{3} \\, du$ is $\\frac{16 - 1}{4}$, the same $\\frac{15}{4}$.

In this lesson we change the limits along with the variable, so that a definite integral is finished in $u$ without returning to $x$.`,
    `换元法给出 $2x(x^{2} + 1)^{3}$ 的原函数 $\\frac{1}{4}(x^{2} + 1)^{4}$，再由基本定理，$\\int_{0}^{1} 2x(x^{2} + 1)^{3} \\, dx$ 等于原函数在 $1$ 处的值减去在 $0$ 处的值：$\\frac{16}{4} - \\frac{1}{4}$，即 $\\frac{15}{4}$。

检验：当 $x$ 从 $0$ 变到 $1$ 时，$u = x^{2} + 1$ 从 $1$ 变到 $2$，而 $\\int_{1}^{2} u^{3} \\, du$ 等于 $\\frac{16 - 1}{4}$，同样是 $\\frac{15}{4}$。

这节课我们在换元时把积分限一起换掉，这样定积分在 $u$ 中就能算完，不必再回到 $x$。`,
  ),
  knowledgePoints: [
    {
      id: "changing-the-limits-of-integration",
      title: t("Changing the limits of integration", "变换积分限"),
      explanation: t(
        "In a definite integral, change the limits along with the variable: if $u = g(x)$, then\n\n$$\\int_{a}^{b} f(g(x))g'(x) \\, dx = \\int_{g(a)}^{g(b)} f(u) \\, du.$$\n\nThere is then no need to substitute back. For $\\int_{0}^{1} x(x^{2} + 1)^{2} \\, dx$, let $u = x^{2} + 1$, so $u$ runs from $1$ to $2$:\n\n$$\\frac{1}{2}\\int_{1}^{2} u^{2} \\, du = \\frac{1}{2} \\cdot \\frac{8 - 1}{3} = \\frac{7}{6}.$$\n\nCheck: in $x$, an antiderivative is $\\frac{1}{6}(x^{2} + 1)^{3}$, and its values at $1$ and $0$ are $\\frac{8}{6}$ and $\\frac{1}{6}$, whose difference is $\\frac{7}{6}$.\n\n> **Watch out.** Once the limits are values of $u$, do not put $x$ back. Substituting back and then using the $u$-limits mixes the two variables and gives a wrong value.",
        "在定积分中，换元时积分限也要一起换：若 $u = g(x)$，则\n\n$$\\int_{a}^{b} f(g(x))g'(x) \\, dx = \\int_{g(a)}^{g(b)} f(u) \\, du$$\n\n这样就不必再代回。对 $\\int_{0}^{1} x(x^{2} + 1)^{2} \\, dx$，令 $u = x^{2} + 1$，则 $u$ 从 $1$ 变到 $2$：\n\n$$\\frac{1}{2}\\int_{1}^{2} u^{2} \\, du = \\frac{1}{2} \\cdot \\frac{8 - 1}{3} = \\frac{7}{6}$$\n\n检验：用 $x$ 计算，一个原函数是 $\\frac{1}{6}(x^{2} + 1)^{3}$，它在 $1$ 和 $0$ 处的值是 $\\frac{8}{6}$ 和 $\\frac{1}{6}$，差为 $\\frac{7}{6}$。\n\n> **注意。** 积分限一旦换成 $u$ 的值，就不要再代回 $x$。代回后又用 $u$ 的积分限，就把两个变量混在一起，得到错误的值。",
      ),
      generate(rng) {
        const b = rng.int(1, 4);
        const m = rng.int(1, 3);
        const x0 = rng.int(0, 1);
        const x1 = m === 3 ? 2 : rng.int(x0 + 1, 3);
        const k = rng.int(1, 6);
        const [u0, u1] = [x0 * x0 + b, x1 * x1 + b];
        const value = Q.of(k * (u1 ** (m + 1) - u0 ** (m + 1)), 2 * (m + 1));
        const inner = poly([1, "x^{2}"], [b, ""]);
        const power = m === 1 ? "" : `^{${m}}`;
        const factor = Q.of(k, 2 * (m + 1));
        return numberProblem({
          prompt: t(
            `Evaluate $\\int_{${x0}}^{${x1}} ${poly([k, "x"])}(${inner})${power} \\, dx$.`,
            `计算 $\\int_{${x0}}^{${x1}} ${poly([k, "x"])}(${inner})${power} \\, dx$。`,
          ),
          answer: value,
          wrong: [
            Q.of(k * (x1 ** (m + 1) - x0 ** (m + 1)), 2 * (m + 1)),
            Q.of(k * (u1 ** (m + 1) - u0 ** (m + 1)), m + 1),
            Q.of(k * (u1 ** (m + 1) - u0 ** (m + 1)), 2 * m),
          ],
          solution: walked(
            [
              [
                ["Choose u", "选取 u"],
                t(`Let $u = ${inner}$. Then:`, `令 $u = ${inner}$，则：`),
                ["du = 2x \\, dx", "x \\, dx = \\frac{1}{2} \\, du"],
              ],
              [
                ["Change the limits", "变换积分限"],
                t(
                  `When $x = ${x0}$, $u = ${u0}$, and when $x = ${x1}$, $u = ${u1}$.`,
                  `当 $x = ${x0}$ 时 $u = ${u0}$，当 $x = ${x1}$ 时 $u = ${u1}$。`,
                ),
              ],
              [
                ["Integrate in u", "对 u 积分"],
                t("Integrate between the new limits:", "在新的积分限之间积分："),
                [
                  `${coef(Q.of(k, 2))}\\int_{${u0}}^{${u1}} u${power} \\, du = ${factor.toLatex()}\\left(${u1}^{${m + 1}} - ${u0}^{${m + 1}}\\right) = ${value.toLatex()}`,
                ],
              ],
            ],
            t(
              `Stay with $x$ instead. An antiderivative is $${factor.toLatex()}(${inner})^{${m + 1}}$. Its value at $x = ${x1}$ is $${factor.mul(Q.of(u1 ** (m + 1))).toLatex()}$ and at $x = ${x0}$ it is $${factor.mul(Q.of(u0 ** (m + 1))).toLatex()}$, and the difference is $${value.toLatex()}$.`,
              `改用 $x$ 计算。一个原函数是 $${factor.toLatex()}(${inner})^{${m + 1}}$。它在 $x = ${x1}$ 处的值是 $${factor.mul(Q.of(u1 ** (m + 1))).toLatex()}$，在 $x = ${x0}$ 处是 $${factor.mul(Q.of(u0 ** (m + 1))).toLatex()}$，差为 $${value.toLatex()}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "definite-integrals-giving-logarithms",
      title: t("Definite integrals giving logarithms", "结果为对数的定积分"),
      explanation: t(
        "When you substitute in a definite integral, change the limits to values of the new variable too, so you never need to substitute back. With $u = x^{2} + c$ and $du = 2x \\, dx$, for $c > 0$,\n\n$$\\int_{a}^{b} \\frac{x}{x^{2} + c} \\, dx = \\frac{1}{2}\\int_{a^{2} + c}^{b^{2} + c} \\frac{1}{u} \\, du = \\frac{1}{2}\\ln\\frac{b^{2} + c}{a^{2} + c},$$\n\nusing $\\ln p - \\ln q = \\ln\\frac{p}{q}$. For example, $\\int_{0}^{2} \\frac{x}{x^{2} + 1} \\, dx$ is $\\frac{1}{2}\\ln 5$.\n\nCheck: in $x$, an antiderivative is $\\frac{1}{2}\\ln(x^{2} + 1)$, which is $\\frac{1}{2}\\ln 5$ at $2$ and $0$ at $0$.\n\n> **Watch out.** The limits of $u$ are $a^{2} + c$ and $b^{2} + c$, not $a$ and $b$. Using the old limits in $\\ln u$ gives $\\frac{1}{2}\\ln\\frac{b}{a}$, which is wrong.",
        "在定积分中换元时，把上下限也换成新变量的值，这样就不必再代回原变量。令 $u = x^{2} + c$，$du = 2x \\, dx$，当 $c > 0$ 时\n\n$$\\int_{a}^{b} \\frac{x}{x^{2} + c} \\, dx = \\frac{1}{2}\\int_{a^{2} + c}^{b^{2} + c} \\frac{1}{u} \\, du = \\frac{1}{2}\\ln\\frac{b^{2} + c}{a^{2} + c}$$\n\n这里用到 $\\ln p - \\ln q = \\ln\\frac{p}{q}$。例如，$\\int_{0}^{2} \\frac{x}{x^{2} + 1} \\, dx$ 等于 $\\frac{1}{2}\\ln 5$。\n\n检验：用 $x$ 计算，一个原函数是 $\\frac{1}{2}\\ln(x^{2} + 1)$，它在 $2$ 处为 $\\frac{1}{2}\\ln 5$，在 $0$ 处为 $0$。\n\n> **注意。** $u$ 的积分限是 $a^{2} + c$ 和 $b^{2} + c$，不是 $a$ 和 $b$。把原来的积分限代入 $\\ln u$，得到 $\\frac{1}{2}\\ln\\frac{b}{a}$，这是错的。",
      ),
      generate(rng) {
        const c = rng.int(1, 9);
        const x0 = rng.int(0, 2);
        const x1 = rng.int(x0 + 1, 4);
        const k = rng.nonZero(-6, 6);
        const [u0, u1] = [x0 * x0 + c, x1 * x1 + c];
        const r = Q.of(u1, u0);
        const ln = (q: Q) => (q.isInteger() ? `\\ln ${q.toLatex()}` : `\\ln\\left(${q.toLatex()}\\right)`);
        const answer = `${coef(Q.of(k, 2))}${ln(r)}`;
        const half = Q.of(k, 2);
        const lnAt = (v: number) => `${coef(half)}\\ln ${v}`;
        return evaluated(
          `\\int_{${x0}}^{${x1}} ${fracWith(k, "x", poly([1, "x^{2}"], [c, ""]))} \\, dx`,
          answer,
          [`${coef(Q.of(k))}${ln(r)}`, `${coef(Q.of(k, 2))}\\ln ${u1}`, `${coef(Q.of(k, 2))}\\ln ${u1 - u0}`],
          walked(
            [
              [
                ["Choose u", "选取 u"],
                t(`Let $u = x^{2} + ${c}$. Then:`, `令 $u = x^{2} + ${c}$，则：`),
                ["du = 2x \\, dx", "x \\, dx = \\frac{1}{2} \\, du"],
              ],
              [
                ["Change the limits", "变换积分限"],
                t(
                  `When $x = ${x0}$, $u = ${u0}$, and when $x = ${x1}$, $u = ${u1}$.`,
                  `当 $x = ${x0}$ 时 $u = ${u0}$，当 $x = ${x1}$ 时 $u = ${u1}$。`,
                ),
              ],
              [
                ["Integrate in u", "对 u 积分"],
                t(
                  "The integral of $\\frac{1}{u}$ is $\\ln u$, and the difference of logarithms is the logarithm of the ratio:",
                  "$\\frac{1}{u}$ 的积分是 $\\ln u$，对数之差等于比值的对数：",
                ),
                [
                  `${coef(half)}\\int_{${u0}}^{${u1}} \\frac{1}{u} \\, du = ${half.toLatex()}\\left(\\ln ${u1} - \\ln ${u0}\\right) = ${answer}`,
                ],
              ],
            ],
            t(
              `Stay with $x$ instead. An antiderivative is $${coef(half)}\\ln(x^{2} + ${c})$. At $x = ${x1}$ it is $${lnAt(u1)}$ and at $x = ${x0}$ it is $${lnAt(u0)}$, and their difference is $${answer}$.`,
              `改用 $x$ 计算。一个原函数是 $${coef(half)}\\ln(x^{2} + ${c})$。它在 $x = ${x1}$ 处为 $${lnAt(u1)}$，在 $x = ${x0}$ 处为 $${lnAt(u0)}$，差为 $${answer}$。`,
            ),
          ),
        );
      },
    },
  ],
};

/** furtherIntegrationOfAlgebraicFunctionsUsingSubstitution writes leftover factors of x in terms of u. */
export const furtherIntegrationOfAlgebraicFunctionsUsingSubstitution: TopicDef = {
  id: "further-integration-of-algebraic-functions-using-substitution",
  title: t("Further Integration of Algebraic Functions Using Substitution", "用换元法求代数函数的积分（进阶）"),
  summary: t("Substitute u = x + b and rewrite the leftover x as u − b.", "代换 u = x + b，并把剩下的 x 写成 u − b。"),
  prerequisites: ["integration-using-substitution"],
  encompasses: [{ topic: "integration-using-substitution", weight: 0.5 }],
  xp: 10,
  standards: [],
  intro: t(
    `With $u = x^{2} + 1$, the integral $\\int 2x\\sqrt{x^{2} + 1} \\, dx$ becomes $\\int \\sqrt{u} \\, du$, which is $\\frac{2}{3}(x^{2} + 1)^{\\frac{3}{2}} + C$. Every $x$ disappeared, because $2x \\, dx$ is exactly $du$.

Check: by the chain rule, the derivative of $\\frac{2}{3}(x^{2} + 1)^{\\frac{3}{2}}$ is $(x^{2} + 1)^{\\frac{1}{2}} \\cdot 2x$, the integrand.

In this lesson we handle integrals such as $\\int x(x + 2)^{4} \\, dx$, where substituting $u = x + b$ leaves a factor of $x$ that must be written as $u - b$.`,
    `令 $u = x^{2} + 1$，积分 $\\int 2x\\sqrt{x^{2} + 1} \\, dx$ 变成 $\\int \\sqrt{u} \\, du$，即 $\\frac{2}{3}(x^{2} + 1)^{\\frac{3}{2}} + C$。所有的 $x$ 都消失了，因为 $2x \\, dx$ 正好是 $du$。

检验：由链式法则，$\\frac{2}{3}(x^{2} + 1)^{\\frac{3}{2}}$ 的导数是 $(x^{2} + 1)^{\\frac{1}{2}} \\cdot 2x$，正是被积函数。

这节课我们处理 $\\int x(x + 2)^{4} \\, dx$ 这样的积分：代换 $u = x + b$ 后还剩下因子 $x$，必须把它写成 $u - b$。`,
  ),
  knowledgePoints: [
    {
      id: "rewriting-x-in-terms-of-u",
      title: t("Rewriting x in terms of u", "把 x 写成 u 的式子"),
      explanation: t(
        "If a factor of the original variable remains after substituting, solve the substitution for that variable and replace it, so everything is written in the new variable. For $\\int x(x + 2)^{4} \\, dx$, let $u = x + 2$, so $x = u - 2$:\n\n$$\\int (u - 2)u^{4} \\, du = \\int (u^{5} - 2u^{4}) \\, du = \\frac{(x + 2)^{6}}{6} - \\frac{2(x + 2)^{5}}{5} + C.$$\n\nCheck: the derivative of the answer is $(x + 2)^{5} - 2(x + 2)^{4}$, which factors as $(x + 2)^{4} \\cdot x$, the integrand.\n\n> **Watch out.** Do not leave an $x$ inside an integral in $u$. In $\\int x u^{4} \\, du$ the $x$ is not a constant, so it cannot be taken outside; it must become $u - 2$.",
        "如果换元后还剩下原变量的因子，就从换元式中解出原变量并代入，使所有部分都用新变量表示。对 $\\int x(x + 2)^{4} \\, dx$，令 $u = x + 2$，则 $x = u - 2$：\n\n$$\\int (u - 2)u^{4} \\, du = \\int (u^{5} - 2u^{4}) \\, du = \\frac{(x + 2)^{6}}{6} - \\frac{2(x + 2)^{5}}{5} + C$$\n\n检验：答案的导数是 $(x + 2)^{5} - 2(x + 2)^{4}$，因式分解得 $(x + 2)^{4} \\cdot x$，正是被积函数。\n\n> **注意。** 不要在 $u$ 的积分里留下 $x$。在 $\\int x u^{4} \\, du$ 中，$x$ 不是常数，不能提到积分号外面，必须换成 $u - 2$。",
      ),
      generate(rng) {
        const b = rng.nonZero(-6, 6);
        const m = rng.int(2, 5);
        const k = rng.nonZero(-4, 4);
        const inner = linear(1, b);
        const xInU = linear(1, -b, "u");
        const answer = plusC([Q.of(k, m + 2), `(${inner})^{${m + 2}}`], [Q.of(-k * b, m + 1), `(${inner})^{${m + 1}}`]);
        const integrand = `${poly([k, "x"])}(${inner})^{${m}}`;
        const back = `\\left((${inner}) ${b > 0 ? "-" : "+"} ${Math.abs(b)}\\right)`;
        return asked(
          integrand,
          answer,
          [
            plusC([Q.of(k, 2 * (m + 1)), `x^{2}(${inner})^{${m + 1}}`]),
            plusC([Q.of(k, m + 2), `(${inner})^{${m + 2}}`]),
            plusC([Q.of(k, m + 2), `(${inner})^{${m + 2}}`], [Q.of(k * b, m + 1), `(${inner})^{${m + 1}}`]),
          ],
          substituted(
            {
              u: inner,
              du: ["du = dx", `x = ${xInU}`],
              why: t(
                `Let $u = ${inner}$. Then $du = dx$, and the leftover $x$ is written in terms of $u$:`,
                `令 $u = ${inner}$，则 $du = dx$，剩下的 $x$ 也写成 $u$ 的式子：`,
              ),
              integral: `\\int ${integrand} \\, dx = ${coef(Q.of(k))}\\int (${xInU})u^{${m}} \\, du`,
              inU: `${coef(Q.of(k))}\\int \\left(${poly([1, `u^{${m + 1}}`], [-b, `u^{${m}}`])}\\right) du`,
              valueInU: plusC([Q.of(k, m + 2), `u^{${m + 2}}`], [Q.of(-k * b, m + 1), `u^{${m + 1}}`]),
              answer,
            },
            differentiated(
              `${ddx(answer)} = ${poly([k, `(${inner})^{${m + 1}}`], [-k * b, `(${inner})^{${m}}`])} = ${coef(Q.of(k))}(${inner})^{${m}}${back} = ${integrand}`,
            ),
          ),
        );
      },
    },
    {
      id: "rewriting-x-under-a-root",
      title: t("Rewriting x under a root", "根式中的 x 的改写"),
      explanation: t(
        "Substituting the expression under the root makes the root a simple power, and the leftover variable is rewritten from the substitution before splitting into powers. For $\\int \\frac{x}{\\sqrt{x + 1}} \\, dx$, let $u = x + 1$, so $x = u - 1$:\n\n$$\\int \\frac{u - 1}{\\sqrt{u}} \\, du = \\int \\left(u^{\\frac{1}{2}} - u^{-\\frac{1}{2}}\\right) du = \\frac{2}{3}(x + 1)^{\\frac{3}{2}} - 2\\sqrt{x + 1} + C.$$\n\nCheck: the derivative of the answer is $(x + 1)^{\\frac{1}{2}} - (x + 1)^{-\\frac{1}{2}}$. Over the common denominator $\\sqrt{x + 1}$ this is $\\frac{(x + 1) - 1}{\\sqrt{x + 1}}$, the integrand.\n\n> **Watch out.** Split $\\frac{u - 1}{\\sqrt{u}}$ into two powers before integrating. Integrating the top and the bottom separately is not allowed.",
        "把根号下的式子换元后，根式变成简单的幂，剩下的变量也用换元式改写，再拆成几个幂。对 $\\int \\frac{x}{\\sqrt{x + 1}} \\, dx$，令 $u = x + 1$，则 $x = u - 1$：\n\n$$\\int \\frac{u - 1}{\\sqrt{u}} \\, du = \\int \\left(u^{\\frac{1}{2}} - u^{-\\frac{1}{2}}\\right) du = \\frac{2}{3}(x + 1)^{\\frac{3}{2}} - 2\\sqrt{x + 1} + C$$\n\n检验：答案的导数是 $(x + 1)^{\\frac{1}{2}} - (x + 1)^{-\\frac{1}{2}}$。通分后分母为 $\\sqrt{x + 1}$，得 $\\frac{(x + 1) - 1}{\\sqrt{x + 1}}$，正是被积函数。\n\n> **注意。** 积分前要先把 $\\frac{u - 1}{\\sqrt{u}}$ 拆成两个幂。不能把分子和分母分别积分。",
      ),
      generate(rng) {
        // x + b > 0 must hold at most sample points, so b ≥ −1.
        const b = rng.pick([-1, 1, 2, 3, 4, 5, 6]);
        const k = rng.nonZero(-6, 6);
        const inner = linear(1, b);
        const root = rng.bool();
        // ∫ x·u^m with x = u − b: u^(m+1)/(m+1)·… − b·u^(m+1)… for m = −1/2 (quotient) or 1/2 (product).
        const m = root ? Q.of(1, 2) : Q.of(-1, 2);
        const [e1, e2] = [m.add(Q.of(2)), m.add(Q.one)];
        const answer = plusC(
          [Q.of(k).div(e1), pow(`(${inner})`, e1)],
          [Q.of(-k * b).div(e2), e2.eq(Q.of(1, 2)) ? `\\sqrt{${inner}}` : pow(`(${inner})`, e2)],
        );
        const integrand = root ? `${poly([k, "x"])}\\sqrt{${inner}}` : fracWith(k, "x", `\\sqrt{${inner}}`);
        const xInU = linear(1, -b, "u");
        const p = (e: Q) => `(${inner})^{${e.toLatex()}}`;
        const back = `\\left((${inner}) ${b > 0 ? "-" : "+"} ${Math.abs(b)}\\right)`;
        return asked(
          integrand,
          answer,
          [
            plusC([Q.of(k).div(e1), pow(`(${inner})`, e1)]),
            plusC(
              [Q.of(k).div(e1), pow(`(${inner})`, e1)],
              [Q.of(k * b).div(e2), e2.eq(Q.of(1, 2)) ? `\\sqrt{${inner}}` : pow(`(${inner})`, e2)],
            ),
            plusC([Q.of(k, 2).div(e2), `x^{2}${e2.eq(Q.of(1, 2)) ? `\\sqrt{${inner}}` : pow(`(${inner})`, e2)}`]),
          ],
          substituted(
            {
              u: inner,
              du: ["du = dx", `x = ${xInU}`],
              why: t(
                `Let $u = ${inner}$. Then $du = dx$, and the leftover $x$ is written in terms of $u$:`,
                `令 $u = ${inner}$，则 $du = dx$，剩下的 $x$ 也写成 $u$ 的式子：`,
              ),
              integral: `\\int ${integrand} \\, dx = ${coef(Q.of(k))}\\int (${xInU})u^{${m.toLatex()}} \\, du`,
              inU: `${coef(Q.of(k))}\\int \\left(${poly([1, `u^{${e2.toLatex()}}`], [-b, `u^{${m.toLatex()}}`])}\\right) du`,
              valueInU: plusC([Q.of(k).div(e1), `u^{${e1.toLatex()}}`], [Q.of(-k * b).div(e2), `u^{${e2.toLatex()}}`]),
              answer,
            },
            differentiated(`${ddx(answer)} = ${poly([k, p(e2)], [-k * b, p(m)])} = ${coef(Q.of(k))}${p(m)}${back} = ${integrand}`),
          ),
        );
      },
    },
  ],
};

/** lead writes a coefficient before a product: "", "-", "\frac{2}{3} \cdot ". */
const lead = (q: Q) => (q.eq(Q.one) ? "" : q.eq(Q.one.neg()) ? "-" : `${q.toLatex()} \\cdot `);

/** approx writes a value rounded to three decimal places. */
const approx = (v: number) => dec(Q.of(Math.round(v * 1000), 1000));

/** integratingExponentialFunctionsUsingLinearSubstitution integrates exponentials with linear exponents. */
export const integratingExponentialFunctionsUsingLinearSubstitution: TopicDef = {
  id: "integrating-exponential-functions-using-linear-substitution",
  title: t("Integrating Exponential Functions Using Linear Substitution", "用一次代换求指数函数的积分"),
  summary: t(
    "Integrate exponentials whose exponent is linear, including definite integrals.",
    "求指数为一次式的指数函数的积分，包括定积分。",
  ),
  prerequisites: [
    "integrating-algebraic-functions-using-substitution",
    "applying-the-fundamental-theorem-of-calculus-to-exponential-and-trigonometric-functions",
  ],
  encompasses: [
    { topic: "integrating-exponential-functions", weight: 0.5 },
    { topic: "applying-the-fundamental-theorem-of-calculus-to-exponential-and-trigonometric-functions", weight: 0.3 },
  ],
  xp: 10,
  standards: [],
  intro: t(
    `The fundamental theorem gives $\\int_{0}^{1} e^{x} \\, dx = e^{1} - e^{0}$, which is $e - 1$, because $e^{x}$ is its own antiderivative.

Check: on $[0, 1]$ the integrand $e^{x}$ lies between $1$ and $e$, so the integral lies between $1$ and $e$, and $e - 1$, about $1.718$, does.

In this lesson we integrate $e^{ax + b}$ and $c^{ax + b}$ with the substitution $u = ax + b$, and evaluate definite integrals of them.`,
    `由基本定理，$\\int_{0}^{1} e^{x} \\, dx = e^{1} - e^{0}$，即 $e - 1$，因为 $e^{x}$ 是它自己的原函数。

检验：在 $[0, 1]$ 上，被积函数 $e^{x}$ 介于 $1$ 和 $e$ 之间，所以积分也介于 $1$ 和 $e$ 之间，而 $e - 1$ 约为 $1.718$，确实如此。

这节课我们用代换 $u = ax + b$ 求 $e^{ax + b}$ 和 $c^{ax + b}$ 的积分，并计算它们的定积分。`,
  ),
  knowledgePoints: [
    {
      id: "exponentials-with-linear-exponents",
      title: t("Exponentials with linear exponents", "指数为一次式的指数函数"),
      explanation: t(
        "A linear exponent changes only the scale, so the antiderivative is the same exponential divided by the coefficient of the variable. With $u = ax + b$ and $dx = \\frac{1}{a} \\, du$,\n\n$$\\int e^{ax + b} \\, dx = \\frac{1}{a}e^{ax + b} + C,$$\n\n$$\\int c^{ax + b} \\, dx = \\frac{c^{ax + b}}{a\\ln c} + C.$$\n\nRewrite a reciprocal first: $\\frac{1}{e^{2x}}$ is $e^{-2x}$, whose integral is $-\\frac{1}{2}e^{-2x} + C$.\n\nCheck: the derivative of $-\\frac{1}{2}e^{-2x}$ is $-\\frac{1}{2} \\cdot (-2)e^{-2x}$, which is $e^{-2x}$.\n\n> **Watch out.** Divide by $a$; do not multiply. Differentiating $e^{ax + b}$ brings out a factor $a$, and the integral must undo it.",
        "一次式指数只改变缩放比例，所以原函数是同一个指数式再除以变量的系数。令 $u = ax + b$，$dx = \\frac{1}{a} \\, du$：\n\n$$\\int e^{ax + b} \\, dx = \\frac{1}{a}e^{ax + b} + C$$\n\n$$\\int c^{ax + b} \\, dx = \\frac{c^{ax + b}}{a\\ln c} + C$$\n\n倒数先改写：$\\frac{1}{e^{2x}}$ 就是 $e^{-2x}$，它的积分是 $-\\frac{1}{2}e^{-2x} + C$。\n\n检验：$-\\frac{1}{2}e^{-2x}$ 的导数是 $-\\frac{1}{2} \\cdot (-2)e^{-2x}$，即 $e^{-2x}$。\n\n> **注意。** 要除以 $a$，不是乘以 $a$。对 $e^{ax + b}$ 求导会带出因子 $a$，积分必须把它抵消掉。",
      ),
      generate(rng) {
        const a = rng.pick([2, 3, 4, 5]);
        const b = rng.int(-5, 5);
        const k = rng.nonZero(-9, 9);
        if (rng.bool()) {
          const exponent = linear(-a, -b);
          const e = `e^{${exponent}}`;
          const answer = plusC([Q.of(-k, a), e]);
          const integrand = quotient(k, `e^{${linear(a, b)}}`);
          return asked(
            integrand,
            answer,
            [plusC([Q.of(k, a), e]), plusC([Q.of(k, a), `e^{${linear(a, b)}}`]), plusC([-k * a, e])],
            walked(
              [
                [
                  ["Rewrite the reciprocal", "改写倒数"],
                  t(
                    "An exponential in the denominator is an exponential with the opposite exponent:",
                    "分母中的指数式等于指数取相反数的指数式：",
                  ),
                  [`${integrand} = ${coef(Q.of(k))}${e}`],
                ],
                [
                  ["Choose u", "选取 u"],
                  t(`Let $u = ${exponent}$. Then:`, `令 $u = ${exponent}$，则：`),
                  [`du = ${-a} \\, dx`, `dx = -\\frac{1}{${a}} \\, du`],
                ],
                [
                  ["Integrate and substitute back", "积分并代回"],
                  t("The integral of $e^{u}$ is $e^{u}$:", "$e^{u}$ 的积分是 $e^{u}$："),
                  [`\\int ${coef(Q.of(k))}${e} \\, dx = ${coef(Q.of(-k, a))}\\int e^{u} \\, du = ${answer}`],
                ],
              ],
              differentiated(`${ddx(answer)} = ${Q.of(-k, a).toLatex()} \\cdot (${-a})${e} = ${coef(Q.of(k))}${e}`),
            ),
          );
        }
        const c = rng.pick([2, 3, 5, 10]);
        const p = `${c}^{${linear(a, b)}}`;
        const over = (q: Q) =>
          `${q.sign() < 0 ? "-" : ""}\\frac{${q.n === 1n || q.n === -1n ? "" : `${q.abs().n} \\cdot `}${p}}{${q.d === 1n ? "" : q.d}\\ln ${c}}`;
        const times = (q: Q, tail: string) => `${q.eq(Q.one) ? "" : q.eq(Q.one.neg()) ? "-" : `${q.toLatex()} \\cdot `}${p}${tail}`;
        const answer = `${over(Q.of(k, a))} + C`;
        const integrand = times(Q.of(k), "");
        return asked(
          integrand,
          answer,
          [`${over(Q.of(k))} + C`, `${times(Q.of(k, a), `\\ln ${c}`)} + C`, `${times(Q.of(k, a), "")} + C`],
          substituted(
            {
              u: linear(a, b),
              du: [`du = ${a} \\, dx`, `dx = \\frac{1}{${a}} \\, du`],
              integral: `\\int ${integrand} \\, dx`,
              inU: `${coef(Q.of(k, a))}\\int ${c}^{u} \\, du`,
              valueInU: `${lead(Q.of(k, a))}\\frac{${c}^{u}}{\\ln ${c}} + C`,
              answer,
            },
            differentiated(`${ddx(answer)} = ${lead(Q.of(k, a))}\\frac{${p} \\cdot ${a}\\ln ${c}}{\\ln ${c}} = ${integrand}`),
          ),
        );
      },
    },
    {
      id: "definite-integrals-of-exponentials",
      title: t("Definite integrals of exponentials", "指数函数的定积分"),
      explanation: t(
        "After finding the antiderivative, evaluate it at the upper and lower limits and subtract, simplifying with the rule that any base to the power zero is one. For example:\n\n$$\\int_{0}^{1} e^{2x} \\, dx = \\left[\\frac{1}{2}e^{2x}\\right]_{0}^{1} = \\frac{1}{2}\\left(e^{2} - 1\\right).$$\n\nCheck: on $[0, 1]$ the integrand $e^{2x}$ runs from $1$ to $e^{2}$, so the integral lies between $1$ and $e^{2}$. The answer is about $3.195$, which does.\n\n> **Watch out.** Evaluate the antiderivative at the lower limit too, and remember that $e^{0}$ is $1$, not $0$.",
        "求出原函数后，在上下限处分别求值并相减，再利用任何底数的零次幂都等于 1 来化简。例如：\n\n$$\\int_{0}^{1} e^{2x} \\, dx = \\left[\\frac{1}{2}e^{2x}\\right]_{0}^{1} = \\frac{1}{2}\\left(e^{2} - 1\\right)$$\n\n检验：在 $[0, 1]$ 上，被积函数 $e^{2x}$ 从 $1$ 增大到 $e^{2}$，所以积分介于 $1$ 和 $e^{2}$ 之间。答案约为 $3.195$，确实如此。\n\n> **注意。** 原函数在下限处也要求值，并且记住 $e^{0}$ 等于 $1$，不是 $0$。",
      ),
      generate(rng) {
        const a = rng.pick([2, 3, 4, -1, -2, -3]);
        const x0 = rng.int(0, 1);
        const x1 = rng.int(x0 + 1, 3);
        const k = rng.nonZero(-6, 6);
        const ex = (n: number) => (n === 0 ? "1" : n === 1 ? "e" : `e^{${n}}`);
        const diff = `\\left(${ex(a * x1)} - ${ex(a * x0)}\\right)`;
        const answer = `${coef(Q.of(k, a))}${diff}`;
        const ax = poly([a, "x"]);
        const F = poly([Q.of(k, a), `e^{${ax}}`]);
        const value = (k / a) * (Math.exp(a * x1) - Math.exp(a * x0));
        const ends = [k * Math.exp(a * x0), k * Math.exp(a * x1)];
        const [lo, hi] = [Math.min(...ends) * (x1 - x0), Math.max(...ends) * (x1 - x0)];
        return evaluated(
          `\\int_{${x0}}^{${x1}} ${coef(Q.of(k))}e^{${ax}} \\, dx`,
          answer,
          [`${coef(Q.of(k))}${diff}`, `${coef(Q.of(k * a))}${diff}`, `${coef(Q.of(k, a))}${ex(a * x1)}`],
          walked(
            [
              [
                ["Find an antiderivative", "求原函数"],
                t(
                  `With $u = ${ax}$ and $du = ${a} \\, dx$, the integral of $e^{u}$ is $e^{u}$, divided by $${a}$:`,
                  `令 $u = ${ax}$，$du = ${a} \\, dx$，$e^{u}$ 的积分是 $e^{u}$，再除以 $${a}$：`,
                ),
                [`\\int ${coef(Q.of(k))}e^{${ax}} \\, dx = ${F} + C`],
              ],
              [
                ["Evaluate at the limits", "代入上下限"],
                t("Subtract the value at the lower limit from the value at the upper limit:", "用上限处的值减去下限处的值："),
                [`\\left[${F}\\right]_{${x0}}^{${x1}} = ${answer}`],
              ],
            ],
            t(
              `On $[${x0}, ${x1}]$ the integrand changes steadily from $${approx(ends[0]!)}$ to $${approx(ends[1]!)}$, so the integral lies between $${approx(lo)}$ and $${approx(hi)}$, the interval length times the least and the greatest value. The answer is about $${approx(value)}$, which does.`,
              `在 $[${x0}, ${x1}]$ 上，被积函数从 $${approx(ends[0]!)}$ 单调变化到 $${approx(ends[1]!)}$，所以积分介于 $${approx(lo)}$ 和 $${approx(hi)}$ 之间，即区间长度乘以最小值和最大值。答案约为 $${approx(value)}$，确实如此。`,
            ),
          ),
        );
      },
    },
  ],
};

/** integratingExponentialFunctionsUsingSubstitution integrates exponentials of non-linear inner functions. */
export const integratingExponentialFunctionsUsingSubstitution: TopicDef = {
  id: "integrating-exponential-functions-using-substitution",
  title: t("Integrating Exponential Functions Using Substitution", "用换元法求指数函数的积分"),
  summary: t(
    "Integrate exponentials of power functions and expressions in eˣ by substitution.",
    "用换元法求以幂函数为指数的指数函数及含 eˣ 的式子的积分。",
  ),
  prerequisites: [
    "integrating-exponential-functions-using-linear-substitution",
    "integration-using-substitution",
    "integrating-linear-rational-functions-using-substitution",
  ],
  encompasses: [
    { topic: "integrating-exponential-functions-using-linear-substitution", weight: 0.4 },
    { topic: "integration-using-substitution", weight: 0.3 },
  ],
  xp: 10,
  standards: [],
  intro: t(
    `With $u = 3x$, the integral $\\int e^{3x} \\, dx$ is $\\frac{1}{3}e^{3x} + C$: a linear exponent only divides the answer by its coefficient.

Check: the derivative of $\\frac{1}{3}e^{3x}$ is $\\frac{1}{3} \\cdot 3e^{3x}$, which is $e^{3x}$.

In this lesson we integrate exponentials whose exponent is a power of $x$, and expressions built from $e^{x}$, $\\sqrt{x}$ and $\\frac{1}{x}$, by substituting the right inner expression.`,
    `令 $u = 3x$，积分 $\\int e^{3x} \\, dx$ 等于 $\\frac{1}{3}e^{3x} + C$：一次式的指数只是让答案除以它的系数。

检验：$\\frac{1}{3}e^{3x}$ 的导数是 $\\frac{1}{3} \\cdot 3e^{3x}$，即 $e^{3x}$。

这节课我们代换合适的内层式子，求指数为 $x$ 的幂的指数函数的积分，以及由 $e^{x}$、$\\sqrt{x}$ 和 $\\frac{1}{x}$ 构成的式子的积分。`,
  ),
  knowledgePoints: [
    {
      id: "exponentials-of-powers-of-x",
      title: t("Exponentials of powers of x", "以 x 的幂为指数的指数函数"),
      explanation: t(
        "The substitution works because the power of the variable in front is exactly what differentiating the exponent produces, up to a constant. For $\\int x^{n - 1}e^{ax^{n}} \\, dx$, let $u = ax^{n}$, so $du = nax^{n - 1} \\, dx$:\n\n$$\\int x^{n - 1}e^{ax^{n}} \\, dx = \\frac{1}{na}e^{ax^{n}} + C.$$\n\nFor example, $\\int xe^{x^{2}} \\, dx = \\frac{1}{2}e^{x^{2}} + C$.\n\nCheck: the derivative of $\\frac{1}{2}e^{x^{2}}$ is $\\frac{1}{2}e^{x^{2}} \\cdot 2x$, which is $xe^{x^{2}}$.\n\n> **Watch out.** The power of $x$ in front must be one less than the power in the exponent. $\\int e^{x^{2}} \\, dx$ has no factor $x$, so this substitution does not apply, and that integral has no antiderivative made of elementary functions.",
        "这个换元之所以可行，是因为前面那个变量的幂恰好是指数求导后得到的式子，只差一个常数。对 $\\int x^{n - 1}e^{ax^{n}} \\, dx$，令 $u = ax^{n}$，则 $du = nax^{n - 1} \\, dx$：\n\n$$\\int x^{n - 1}e^{ax^{n}} \\, dx = \\frac{1}{na}e^{ax^{n}} + C$$\n\n例如 $\\int xe^{x^{2}} \\, dx = \\frac{1}{2}e^{x^{2}} + C$。\n\n检验：$\\frac{1}{2}e^{x^{2}}$ 的导数是 $\\frac{1}{2}e^{x^{2}} \\cdot 2x$，即 $xe^{x^{2}}$。\n\n> **注意。** 前面 $x$ 的幂必须比指数中的幂小一。$\\int e^{x^{2}} \\, dx$ 没有因子 $x$，这个代换就用不上，而且这个积分没有由初等函数构成的原函数。",
      ),
      generate(rng) {
        const n = rng.int(2, 3);
        const a = rng.pick([1, 2, 3, -1, -2, -3]);
        const k = rng.nonZero(-9, 9);
        const u = poly([a, `x^{${n}}`]);
        const e = `e^{${u}}`;
        const answer = plusC([Q.of(k, n * a), e]);
        const integrand = `${poly([k, xPow(n - 1)])}${e}`;
        const dudx = poly([n * a, xPow(n - 1)]);
        return asked(
          integrand,
          answer,
          [plusC([Q.of(k, a), e]), plusC([k * n * a, e]), plusC([Q.of(k, n), `${xPow(n)}${e}`])],
          substituted(
            {
              u,
              du: [`du = ${dudx} \\, dx`, `${xPow(n - 1)} \\, dx = \\frac{1}{${n * a}} \\, du`],
              integral: `\\int ${integrand} \\, dx`,
              inU: `${coef(Q.of(k, n * a))}\\int e^{u} \\, du`,
              valueInU: plusC([Q.of(k, n * a), "e^{u}"]),
              answer,
            },
            differentiated(`${ddx(answer)} = ${Q.of(k, n * a).toLatex()}${e} \\cdot \\left(${dudx}\\right) = ${integrand}`),
          ),
        );
      },
    },
    {
      id: "substituting-expressions-in-e-to-the-x",
      title: t("Substituting expressions in eˣ", "代换含 eˣ 的式子"),
      explanation: t(
        "Since the exponential is its own derivative, letting the new variable be an expression in the exponential often turns the integrand into something simple. Other substitutions make exponential integrands simple too:\n\n- $u = e^{x} + b$: $\\int \\frac{e^{x}}{e^{x} + b} \\, dx = \\ln(e^{x} + b) + C$ for $b > 0$.\n- $u = \\sqrt{x}$, $du = \\frac{1}{2\\sqrt{x}} \\, dx$: $\\int \\frac{e^{\\sqrt{x}}}{\\sqrt{x}} \\, dx = 2e^{\\sqrt{x}} + C$.\n- $u = \\frac{1}{x}$, $du = -\\frac{1}{x^{2}} \\, dx$: $\\int \\frac{e^{1/x}}{x^{2}} \\, dx = -e^{1/x} + C$.\n\nCheck: the derivative of $2e^{\\sqrt{x}}$ is $2e^{\\sqrt{x}} \\cdot \\frac{1}{2\\sqrt{x}}$, which is $\\frac{e^{\\sqrt{x}}}{\\sqrt{x}}$.\n\n> **Watch out.** With $u = \\frac{1}{x}$, $du$ carries a minus sign. Forgetting it gives $e^{1/x}$ in place of $-e^{1/x}$.",
        "由于指数函数的导数是它自己，把新变量设为含指数函数的式子，常常能把被积函数变简单。其他代换也能化简指数型被积函数：\n\n- $u = e^{x} + b$：当 $b > 0$ 时 $\\int \\frac{e^{x}}{e^{x} + b} \\, dx = \\ln(e^{x} + b) + C$。\n- $u = \\sqrt{x}$，$du = \\frac{1}{2\\sqrt{x}} \\, dx$：$\\int \\frac{e^{\\sqrt{x}}}{\\sqrt{x}} \\, dx = 2e^{\\sqrt{x}} + C$。\n- $u = \\frac{1}{x}$，$du = -\\frac{1}{x^{2}} \\, dx$：$\\int \\frac{e^{1/x}}{x^{2}} \\, dx = -e^{1/x} + C$。\n\n检验：$2e^{\\sqrt{x}}$ 的导数是 $2e^{\\sqrt{x}} \\cdot \\frac{1}{2\\sqrt{x}}$，即 $\\frac{e^{\\sqrt{x}}}{\\sqrt{x}}$。\n\n> **注意。** 令 $u = \\frac{1}{x}$ 时，$du$ 带有负号。忘了它，就会得到 $e^{1/x}$ 而不是 $-e^{1/x}$。",
      ),
      generate(rng) {
        const k = rng.nonZero(-9, 9);
        const b = rng.int(1, 9);
        const kind = rng.int(0, 3);
        if (kind === 0) {
          const answer = plusC([k, `\\ln(e^{x} + ${b})`]);
          const integrand = fracWith(k, "e^{x}", `e^{x} + ${b}`);
          return asked(
            integrand,
            answer,
            [plusC([k, `e^{x}\\ln(e^{x} + ${b})`]), plusC([k, `\\ln(${b})`], [k, "x"]), plusC([-k, `(e^{x} + ${b})^{-2}`])],
            walked(
              [
                [["Choose u", "选取 u"], t(`Let $u = e^{x} + ${b}$. Then:`, `令 $u = e^{x} + ${b}$，则：`), ["du = e^{x} \\, dx"]],
                [
                  ["Rewrite the integral in u", "把积分改写成 u 的积分"],
                  t("The numerator and $dx$ together make $du$:", "分子和 $dx$ 合起来正好是 $du$："),
                  [`\\int ${integrand} \\, dx = ${coef(Q.of(k))}\\int \\frac{1}{u} \\, du`],
                ],
                [
                  ["Integrate and substitute back", "积分并代回"],
                  t(`No absolute value is needed, because $e^{x} + ${b} > 0$:`, `因为 $e^{x} + ${b} > 0$，不需要绝对值：`),
                  [`${coef(Q.of(k))}\\int \\frac{1}{u} \\, du = ${answer}`],
                ],
              ],
              differentiated(`${ddx(answer)} = ${coef(Q.of(k))}\\frac{1}{e^{x} + ${b}} \\cdot e^{x} = ${integrand}`),
            ),
          );
        }
        if (kind === 1) {
          const m = rng.int(2, 5);
          const answer = plusC([Q.of(k, m + 1), `(e^{x} + ${b})^{${m + 1}}`]);
          const integrand = `${coef(Q.of(k))}e^{x}(e^{x} + ${b})^{${m}}`;
          return asked(
            integrand,
            answer,
            [
              plusC([Q.of(k, m + 1), `e^{x}(e^{x} + ${b})^{${m + 1}}`]),
              plusC([k, `(e^{x} + ${b})^{${m + 1}}`]),
              plusC([Q.of(k, m), `(e^{x} + ${b})^{${m + 1}}`]),
            ],
            substituted(
              {
                u: `e^{x} + ${b}`,
                du: ["du = e^{x} \\, dx"],
                integral: `\\int ${integrand} \\, dx`,
                inU: `${coef(Q.of(k))}\\int u^{${m}} \\, du`,
                valueInU: plusC([Q.of(k, m + 1), `u^{${m + 1}}`]),
                answer,
              },
              differentiated(
                `${ddx(answer)} = ${Q.of(k, m + 1).toLatex()} \\cdot ${m + 1}(e^{x} + ${b})^{${m}} \\cdot e^{x} = ${integrand}`,
              ),
            ),
          );
        }
        if (kind === 2) {
          const answer = plusC([2 * k, "e^{\\sqrt{x}}"]);
          const integrand = fracWith(k, "e^{\\sqrt{x}}", "\\sqrt{x}");
          return asked(
            integrand,
            answer,
            [plusC([k, "e^{\\sqrt{x}}"]), plusC([Q.of(k, 2), "e^{\\sqrt{x}}"]), plusC([k, "\\frac{e^{\\sqrt{x}}}{\\sqrt{x}}"])],
            substituted(
              {
                u: "\\sqrt{x}",
                du: ["du = \\frac{1}{2\\sqrt{x}} \\, dx", "\\frac{dx}{\\sqrt{x}} = 2 \\, du"],
                integral: `\\int ${integrand} \\, dx`,
                inU: `${coef(Q.of(2 * k))}\\int e^{u} \\, du`,
                valueInU: plusC([2 * k, "e^{u}"]),
                answer,
              },
              differentiated(`${ddx(answer)} = ${2 * k}e^{\\sqrt{x}} \\cdot \\frac{1}{2\\sqrt{x}} = ${integrand}`),
            ),
            { en: "$x > 0$", zh: "$x > 0$" },
          );
        }
        const answer = plusC([-k, "e^{\\frac{1}{x}}"]);
        const integrand = fracWith(k, "e^{\\frac{1}{x}}", "x^{2}");
        return asked(
          integrand,
          answer,
          [plusC([k, "e^{\\frac{1}{x}}"]), plusC([-k, "x^{-1}e^{\\frac{1}{x}}"]), plusC([k, "x^{2}e^{\\frac{1}{x}}"])],
          substituted(
            {
              u: "\\frac{1}{x}",
              du: ["du = -\\frac{1}{x^{2}} \\, dx", "\\frac{dx}{x^{2}} = -du"],
              integral: `\\int ${integrand} \\, dx`,
              inU: `${coef(Q.of(-k))}\\int e^{u} \\, du`,
              valueInU: plusC([-k, "e^{u}"]),
              answer,
            },
            differentiated(`${ddx(answer)} = ${-k}e^{\\frac{1}{x}} \\cdot \\left(-\\frac{1}{x^{2}}\\right) = ${integrand}`),
          ),
        );
      },
    },
  ],
};

/** integratingTrigonometricFunctionsUsingSubstitution integrates trigonometric functions of inner functions and powers of sin and cos. */
export const integratingTrigonometricFunctionsUsingSubstitution: TopicDef = {
  id: "integrating-trigonometric-functions-using-substitution",
  title: t("Integrating Trigonometric Functions Using Substitution", "用换元法求三角函数的积分"),
  summary: t(
    "Integrate trigonometric functions of powers of x, powers of sine and cosine times the other, and tangent.",
    "求以 x 的幂为自变量的三角函数、正弦或余弦的幂乘以另一个函数，以及正切的积分。",
  ),
  prerequisites: [
    "integration-using-substitution",
    "integrating-trigonometric-functions",
    "integrating-linear-rational-functions-using-substitution",
  ],
  encompasses: [
    { topic: "integration-using-substitution", weight: 0.3 },
    { topic: "integrating-trigonometric-functions", weight: 0.4 },
  ],
  xp: 10,
  standards: [],
  intro: t(
    `The basic trigonometric integrals are $\\int \\cos x \\, dx = \\sin x + C$ and $\\int \\sin x \\, dx = -\\cos x + C$; the minus sign appears because the derivative of $\\cos x$ is $-\\sin x$.

Check: the derivative of $-\\cos x$ is $-(-\\sin x)$, which is $\\sin x$.

In this lesson we use substitution to integrate sines and cosines of $ax^{n}$, powers of sine, cosine and tangent beside their derivatives, and $\\tan x$ and $\\cot x$.`,
    `基本的三角积分是 $\\int \\cos x \\, dx = \\sin x + C$ 和 $\\int \\sin x \\, dx = -\\cos x + C$；出现负号是因为 $\\cos x$ 的导数是 $-\\sin x$。

检验：$-\\cos x$ 的导数是 $-(-\\sin x)$，即 $\\sin x$。

这节课我们用换元法求 $ax^{n}$ 的正弦和余弦的积分，正弦、余弦、正切的幂乘以它们导数的积分，以及 $\\tan x$ 和 $\\cot x$ 的积分。`,
  ),
  knowledgePoints: [
    {
      id: "trigonometric-functions-of-powers-of-x",
      title: t("Trigonometric functions of powers of x", "以 x 的幂为自变量的三角函数"),
      explanation: t(
        "Let the argument of the trigonometric function be the new variable, and check that the factor in front is its derivative up to a constant. For $\\int x^{n - 1}\\sin(ax^{n}) \\, dx$, let $u = ax^{n}$, so $x^{n - 1} \\, dx = \\frac{1}{na} \\, du$:\n\n$$\\int x^{n - 1}\\sin(ax^{n}) \\, dx = -\\frac{1}{na}\\cos(ax^{n}) + C,$$\n\n$$\\int x^{n - 1}\\cos(ax^{n}) \\, dx = \\frac{1}{na}\\sin(ax^{n}) + C.$$\n\nCheck: the derivative of $-\\frac{1}{2}\\cos(x^{2})$ is $-\\frac{1}{2} \\cdot (-\\sin(x^{2})) \\cdot 2x$, which is $x\\sin(x^{2})$.\n\n> **Watch out.** The integral of $\\sin u$ is $-\\cos u$. Dropping that minus sign is the most common error here.",
        "把三角函数的自变量设为新变量，并检查前面的因子是否是它的导数，最多相差一个常数。对 $\\int x^{n - 1}\\sin(ax^{n}) \\, dx$，令 $u = ax^{n}$，则 $x^{n - 1} \\, dx = \\frac{1}{na} \\, du$：\n\n$$\\int x^{n - 1}\\sin(ax^{n}) \\, dx = -\\frac{1}{na}\\cos(ax^{n}) + C$$\n\n$$\\int x^{n - 1}\\cos(ax^{n}) \\, dx = \\frac{1}{na}\\sin(ax^{n}) + C$$\n\n检验：$-\\frac{1}{2}\\cos(x^{2})$ 的导数是 $-\\frac{1}{2} \\cdot (-\\sin(x^{2})) \\cdot 2x$，即 $x\\sin(x^{2})$。\n\n> **注意。** $\\sin u$ 的积分是 $-\\cos u$。漏掉这个负号是这里最常见的错误。",
      ),
      generate(rng) {
        const n = rng.int(2, 3);
        const a = rng.int(1, 4);
        const k = rng.nonZero(-9, 9);
        const u = poly([a, `x^{${n}}`]);
        const sine = rng.bool();
        const [f, F, sign] = sine ? ["\\sin", "\\cos", -1] : ["\\cos", "\\sin", 1];
        const c = Q.of(sign * k, n * a);
        const answer = plusC([c, `${F}(${u})`]);
        const integrand = `${poly([k, xPow(n - 1)])}${f}(${u})`;
        return asked(
          integrand,
          answer,
          [plusC([c.neg(), `${F}(${u})`]), plusC([Q.of(sign * k, a), `${F}(${u})`]), plusC([Q.of(sign * k, n), `${xPow(n)}${F}(${u})`])],
          substituted(
            {
              u,
              du: [`du = ${poly([n * a, xPow(n - 1)])} \\, dx`, `${xPow(n - 1)} \\, dx = \\frac{1}{${n * a}} \\, du`],
              integral: `\\int ${integrand} \\, dx`,
              inU: `${coef(Q.of(k, n * a))}\\int ${f} u \\, du`,
              valueInU: plusC([c, `${F} u`]),
              answer,
            },
            differentiated(
              `${ddx(answer)} = ${c.toLatex()} \\cdot \\left(${sine ? "-" : ""}${f}(${u})\\right) \\cdot ${poly([n * a, xPow(n - 1)])} = ${integrand}`,
            ),
          ),
        );
      },
    },
    {
      id: "powers-of-sine-cosine-and-tangent",
      title: t("Powers of sine, cosine and tangent", "正弦、余弦与正切的幂"),
      explanation: t(
        "When one trigonometric function is raised to a power and its derivative multiplies it, substitute the function:\n\n- $u = \\sin x$: $\\int \\sin^{m} x\\cos x \\, dx = \\frac{\\sin^{m + 1} x}{m + 1} + C$.\n- $u = \\cos x$, $du = -\\sin x \\, dx$: $\\int \\cos^{m} x\\sin x \\, dx = -\\frac{\\cos^{m + 1} x}{m + 1} + C$.\n- $u = \\tan x$: $\\int \\tan^{m} x\\sec^{2} x \\, dx = \\frac{\\tan^{m + 1} x}{m + 1} + C$.\n- $u = \\cos x$: $\\int \\tan x \\, dx = \\int \\frac{\\sin x}{\\cos x} \\, dx = -\\ln|\\cos x| + C$.\n\nCheck: the derivative of $-\\frac{\\cos^{3} x}{3}$ is $-\\cos^{2} x \\cdot (-\\sin x)$, which is $\\cos^{2} x\\sin x$.\n\n> **Watch out.** For $u = \\cos x$, $du = -\\sin x \\, dx$ carries a minus sign, so $\\int \\tan x \\, dx$ is $-\\ln|\\cos x| + C$, not $\\ln|\\cos x| + C$.",
        "当一个三角函数的幂乘以它的导数时，代换这个函数：\n\n- $u = \\sin x$：$\\int \\sin^{m} x\\cos x \\, dx = \\frac{\\sin^{m + 1} x}{m + 1} + C$。\n- $u = \\cos x$，$du = -\\sin x \\, dx$：$\\int \\cos^{m} x\\sin x \\, dx = -\\frac{\\cos^{m + 1} x}{m + 1} + C$。\n- $u = \\tan x$：$\\int \\tan^{m} x\\sec^{2} x \\, dx = \\frac{\\tan^{m + 1} x}{m + 1} + C$。\n- $u = \\cos x$：$\\int \\tan x \\, dx = \\int \\frac{\\sin x}{\\cos x} \\, dx = -\\ln|\\cos x| + C$。\n\n检验：$-\\frac{\\cos^{3} x}{3}$ 的导数是 $-\\cos^{2} x \\cdot (-\\sin x)$，即 $\\cos^{2} x\\sin x$。\n\n> **注意。** 令 $u = \\cos x$ 时，$du = -\\sin x \\, dx$ 带有负号，所以 $\\int \\tan x \\, dx$ 等于 $-\\ln|\\cos x| + C$，而不是 $\\ln|\\cos x| + C$。",
      ),
      generate(rng) {
        const k = rng.nonZero(-9, 9);
        const m = rng.int(2, 6);
        const kind = rng.int(0, 3);
        if (kind === 3) {
          const tan = rng.bool();
          const answer = tan ? plusC([-k, "\\ln|\\cos x|"]) : plusC([k, "\\ln|\\sin x|"]);
          const integrand = `${coef(Q.of(k))}${tan ? "\\tan" : "\\cot"} x`;
          return asked(
            integrand,
            answer,
            tan
              ? [plusC([k, "\\ln|\\cos x|"]), plusC([k, "\\sec^{2} x"]), plusC([-k, "\\ln|\\sin x|"])]
              : [plusC([-k, "\\ln|\\sin x|"]), plusC([-k, "\\csc^{2} x"]), plusC([k, "\\ln|\\cos x|"])],
            tan
              ? substituted(
                  {
                    u: "\\cos x",
                    du: ["du = -\\sin x \\, dx"],
                    why: t(
                      "Write $\\tan x$ as $\\frac{\\sin x}{\\cos x}$ and let $u = \\cos x$. Then:",
                      "把 $\\tan x$ 写成 $\\frac{\\sin x}{\\cos x}$，令 $u = \\cos x$，则：",
                    ),
                    integral: `\\int ${integrand} \\, dx = ${coef(Q.of(k))}\\int \\frac{\\sin x}{\\cos x} \\, dx`,
                    inU: `${coef(Q.of(-k))}\\int \\frac{1}{u} \\, du`,
                    valueInU: plusC([-k, "\\ln|u|"]),
                    answer,
                  },
                  differentiated(`${ddx(answer)} = ${coef(Q.of(-k))}\\frac{-\\sin x}{\\cos x} = ${integrand}`),
                )
              : substituted(
                  {
                    u: "\\sin x",
                    du: ["du = \\cos x \\, dx"],
                    why: t(
                      "Write $\\cot x$ as $\\frac{\\cos x}{\\sin x}$ and let $u = \\sin x$. Then:",
                      "把 $\\cot x$ 写成 $\\frac{\\cos x}{\\sin x}$，令 $u = \\sin x$，则：",
                    ),
                    integral: `\\int ${integrand} \\, dx = ${coef(Q.of(k))}\\int \\frac{\\cos x}{\\sin x} \\, dx`,
                    inU: `${coef(Q.of(k))}\\int \\frac{1}{u} \\, du`,
                    valueInU: plusC([k, "\\ln|u|"]),
                    answer,
                  },
                  differentiated(`${ddx(answer)} = ${coef(Q.of(k))}\\frac{\\cos x}{\\sin x} = ${integrand}`),
                ),
          );
        }
        const [f, g, sign, du, df] = [
          ["\\sin", "\\cos x", 1, "\\cos x \\, dx", "\\cos x"],
          ["\\cos", "\\sin x", -1, "-\\sin x \\, dx", "-\\sin x"],
          ["\\tan", "\\sec^{2} x", 1, "\\sec^{2} x \\, dx", "\\sec^{2} x"],
        ][kind] as [string, string, number, string, string];
        const c = Q.of(sign * k, m + 1);
        const answer = plusC([c, `${f}^{${m + 1}} x`]);
        const integrand = `${coef(Q.of(k))}${f}^{${m}} x ${g}`;
        return asked(
          integrand,
          answer,
          [
            plusC([Q.of(-sign * k, m + 1), `${f}^{${m + 1}} x`]),
            plusC([Q.of(sign * k, m), `${f}^{${m + 1}} x`]),
            plusC([Q.of(sign * k, m + 1), `${f}^{${m + 1}} x ${g}`]),
          ],
          substituted(
            {
              u: `${f} x`,
              du: [`du = ${du}`],
              integral: `\\int ${integrand} \\, dx`,
              inU: `${coef(Q.of(sign * k))}\\int u^{${m}} \\, du`,
              valueInU: plusC([c, `u^{${m + 1}}`]),
              answer,
            },
            differentiated(`${ddx(answer)} = ${c.toLatex()} \\cdot ${m + 1}${f}^{${m}} x \\cdot \\left(${df}\\right) = ${integrand}`),
          ),
        );
      },
    },
  ],
};

/** lnPow writes a power of ln x: "\ln x", "(\ln x)^{3}". */
const lnPow = (e: number) => (e === 1 ? "\\ln x" : `(\\ln x)^{${e}}`);

/** integratingLogarithmicFunctionsUsingSubstitution substitutes u = ln x. */
export const integratingLogarithmicFunctionsUsingSubstitution: TopicDef = {
  id: "integrating-logarithmic-functions-using-substitution",
  title: t("Integrating Logarithmic Functions Using Substitution", "用换元法求对数函数的积分"),
  summary: t(
    "Integrate expressions in ln x multiplied by 1/x by substituting u = ln x.",
    "代换 u = ln x，求含 ln x 并乘以 1/x 的式子的积分。",
  ),
  prerequisites: ["integration-using-substitution", "integrating-the-reciprocal-function"],
  encompasses: [
    { topic: "integration-using-substitution", weight: 0.3 },
    { topic: "integrating-the-reciprocal-function", weight: 0.3 },
  ],
  xp: 10,
  standards: [],
  intro: t(
    `Since the derivative of $\\ln x$ is $\\frac{1}{x}$, the integral $\\int \\frac{1}{x} \\, dx$ is $\\ln|x| + C$, with the absolute value covering $x < 0$.

Check: for $x < 0$, the derivative of $\\ln(-x)$ is $\\frac{-1}{-x}$, which is $\\frac{1}{x}$ as well.

In this lesson we substitute $u = \\ln x$, whose $du$ is $\\frac{1}{x} \\, dx$, to integrate powers of $\\ln x$ over $x$ and logarithms in the denominator.`,
    `由于 $\\ln x$ 的导数是 $\\frac{1}{x}$，积分 $\\int \\frac{1}{x} \\, dx$ 等于 $\\ln|x| + C$，绝对值照顾到 $x < 0$ 的情形。

检验：当 $x < 0$ 时，$\\ln(-x)$ 的导数是 $\\frac{-1}{-x}$，同样等于 $\\frac{1}{x}$。

这节课我们代换 $u = \\ln x$（它的 $du$ 是 $\\frac{1}{x} \\, dx$），求 $\\ln x$ 的幂除以 $x$ 的积分，以及分母中含对数的积分。`,
  ),
  knowledgePoints: [
    {
      id: "powers-of-ln-x-over-x",
      title: t("Powers of ln x over x", "ln x 的幂除以 x"),
      explanation: t(
        "One over the variable is the derivative of the natural logarithm, so substituting the logarithm turns the integrand into a simple power. The derivative of $\\ln x$ is $\\frac{1}{x}$, so the substitution $u = \\ln x$, $du = \\frac{1}{x} \\, dx$ gives, for $m \\ne -1$,\n\n$$\\int \\frac{(\\ln x)^{m}}{x} \\, dx = \\int u^{m} \\, du = \\frac{(\\ln x)^{m + 1}}{m + 1} + C.$$\n\nCheck: by the chain rule, the derivative of $\\frac{(\\ln x)^{3}}{3}$ is $(\\ln x)^{2} \\cdot \\frac{1}{x}$, so $\\int \\frac{(\\ln x)^{2}}{x} \\, dx$ is $\\frac{(\\ln x)^{3}}{3} + C$, as the formula says.\n\n> **Watch out.** $(\\ln x)^{m}$ is not $\\ln(x^{m})$. The power belongs to the logarithm, and it stays there in the answer.",
        "变量的倒数是自然对数的导数，所以把对数换元后，被积函数就变成简单的幂。$\\ln x$ 的导数是 $\\frac{1}{x}$，所以代换 $u = \\ln x$，$du = \\frac{1}{x} \\, dx$，当 $m \\ne -1$ 时得\n\n$$\\int \\frac{(\\ln x)^{m}}{x} \\, dx = \\int u^{m} \\, du = \\frac{(\\ln x)^{m + 1}}{m + 1} + C$$\n\n检验：由链式法则，$\\frac{(\\ln x)^{3}}{3}$ 的导数是 $(\\ln x)^{2} \\cdot \\frac{1}{x}$，所以 $\\int \\frac{(\\ln x)^{2}}{x} \\, dx$ 等于 $\\frac{(\\ln x)^{3}}{3} + C$，与公式一致。\n\n> **注意。** $(\\ln x)^{m}$ 不是 $\\ln(x^{m})$。幂属于对数，在答案中也留在对数上。",
      ),
      generate(rng) {
        const k = rng.nonZero(-9, 9);
        const m = rng.int(1, 5);
        const integrand = fracWith(k, lnPow(m), "x");
        const c = Q.of(k, m + 1);
        const answer = plusC([c, `(\\ln x)^{${m + 1}}`]);
        return asked(
          integrand,
          answer,
          [
            plusC([k, `(\\ln x)^{${m + 1}}`]),
            plusC([Q.of(k, m + 1), `\\ln x^{${m + 1}}`]),
            plusC([Q.of(k, m + 1), `x(\\ln x)^{${m + 1}}`]),
          ],
          substituted(
            {
              u: "\\ln x",
              du: ["du = \\frac{1}{x} \\, dx"],
              integral: `\\int ${integrand} \\, dx`,
              inU: `${coef(Q.of(k))}\\int u${m === 1 ? "" : `^{${m}}`} \\, du`,
              valueInU: plusC([c, `u^{${m + 1}}`]),
              answer,
            },
            differentiated(`${ddx(answer)} = ${c.toLatex()} \\cdot ${m + 1}${lnPow(m)} \\cdot \\frac{1}{x} = ${integrand}`),
          ),
          { en: "$x > 0$", zh: "$x > 0$" },
        );
      },
    },
    {
      id: "logarithms-in-the-denominator",
      title: t("Logarithms in the denominator", "分母中的对数"),
      explanation: t(
        "With $u = \\ln x$ the same substitution handles a logarithm in the denominator:\n\n$$\\int \\frac{1}{x\\ln x} \\, dx = \\ln|\\ln x| + C,$$\n\n$$\\int \\frac{1}{x(\\ln x)^{2}} \\, dx = -\\frac{1}{\\ln x} + C.$$\n\nFor $\\int \\frac{1}{x(a + b\\ln x)} \\, dx$ let $u = a + b\\ln x$, so $du = \\frac{b}{x} \\, dx$ and the result is $\\frac{1}{b}\\ln|a + b\\ln x| + C$.\n\nCheck: the derivative of $\\ln|\\ln x|$ is $\\frac{1}{\\ln x} \\cdot \\frac{1}{x}$, the integrand of the first formula.\n\n> **Watch out.** The answer to the first integral is not $\\ln|x\\ln x| + C$. After $u = \\ln x$ it is $\\int \\frac{1}{u} \\, du$, so the logarithm is of $\\ln x$ alone.",
        "同样令 $u = \\ln x$，可以处理分母中的对数：\n\n$$\\int \\frac{1}{x\\ln x} \\, dx = \\ln|\\ln x| + C$$\n\n$$\\int \\frac{1}{x(\\ln x)^{2}} \\, dx = -\\frac{1}{\\ln x} + C$$\n\n对 $\\int \\frac{1}{x(a + b\\ln x)} \\, dx$，令 $u = a + b\\ln x$，则 $du = \\frac{b}{x} \\, dx$，结果为 $\\frac{1}{b}\\ln|a + b\\ln x| + C$。\n\n检验：$\\ln|\\ln x|$ 的导数是 $\\frac{1}{\\ln x} \\cdot \\frac{1}{x}$，正是第一个公式的被积函数。\n\n> **注意。** 第一个积分的答案不是 $\\ln|x\\ln x| + C$。代换 $u = \\ln x$ 后它是 $\\int \\frac{1}{u} \\, du$，所以对数里只有 $\\ln x$。",
      ),
      generate(rng) {
        const k = rng.nonZero(-9, 9);
        const kind = rng.int(0, 2);
        const domain = { en: "$x > 0$", zh: "$x > 0$" };
        if (kind === 0) {
          const answer = plusC([k, "\\ln|\\ln x|"]);
          const integrand = quotient(k, "x\\ln x");
          return asked(
            integrand,
            answer,
            [plusC([k, "\\ln|x\\ln x|"]), plusC([k, "\\frac{1}{\\ln x}"]), plusC([-k, "\\ln|\\ln x|"])],
            substituted(
              {
                u: "\\ln x",
                du: ["du = \\frac{1}{x} \\, dx"],
                integral: `\\int ${integrand} \\, dx`,
                inU: `${coef(Q.of(k))}\\int \\frac{1}{u} \\, du`,
                valueInU: plusC([k, "\\ln|u|"]),
                answer,
              },
              differentiated(`${ddx(answer)} = ${coef(Q.of(k))}\\frac{1}{\\ln x} \\cdot \\frac{1}{x} = ${integrand}`),
            ),
            domain,
          );
        }
        if (kind === 1) {
          const n = rng.int(2, 4);
          const answer = `${quotient(Q.of(-k, n - 1), lnPow(n - 1))} + C`;
          const integrand = quotient(k, `x(\\ln x)^{${n}}`);
          return asked(
            integrand,
            answer,
            [
              `${quotient(Q.of(k, n - 1), lnPow(n - 1))} + C`,
              `${quotient(Q.of(-k, n + 1), lnPow(n + 1))} + C`,
              plusC([k, `\\ln|(\\ln x)^{${n}}|`]),
            ],
            substituted(
              {
                u: "\\ln x",
                du: ["du = \\frac{1}{x} \\, dx"],
                integral: `\\int ${integrand} \\, dx`,
                inU: `${coef(Q.of(k))}\\int u^{${-n}} \\, du`,
                valueInU: plusC([Q.of(k, 1 - n), `u^{${1 - n}}`]),
                answer,
              },
              differentiated(
                `${ddx(answer)} = ${Q.of(-k, n - 1).toLatex()} \\cdot (${1 - n})(\\ln x)^{${-n}} \\cdot \\frac{1}{x} = ${integrand}`,
              ),
            ),
            domain,
          );
        }
        const a = rng.nonZero(-5, 5);
        const b = rng.pick([2, 3, 4, 5, -2, -3]);
        const inner = poly([a, ""], [b, "\\ln x"]);
        const answer = plusC([Q.of(k, b), `\\ln|${inner}|`]);
        const integrand = quotient(k, `x(${inner})`);
        return asked(
          integrand,
          answer,
          [plusC([k, `\\ln|${inner}|`]), plusC([k * b, `\\ln|${inner}|`]), plusC([Q.of(k, a), `\\ln|${inner}|`])],
          substituted(
            {
              u: inner,
              du: [`du = \\frac{${b}}{x} \\, dx`, `\\frac{dx}{x} = \\frac{1}{${b}} \\, du`],
              integral: `\\int ${integrand} \\, dx`,
              inU: `${coef(Q.of(k, b))}\\int \\frac{1}{u} \\, du`,
              valueInU: plusC([Q.of(k, b), "\\ln|u|"]),
              answer,
            },
            differentiated(`${ddx(answer)} = ${Q.of(k, b).toLatex()} \\cdot \\frac{1}{${inner}} \\cdot \\frac{${b}}{x} = ${integrand}`),
          ),
          domain,
        );
      },
    },
  ],
};

/** Scale is a pair a, c with the integrand built from a² and c²x². */
type Scale = readonly [number, number];

/** squared writes a² ± c²x² in the order given: "4 + 9x^{2}", "9x^{2} - 4". */
const squared = (a: number, c: number, op: "+" | "-", xFirst = false) =>
  xFirst ? `${poly([c * c, "x^{2}"])} ${op} ${a * a}` : `${a * a} ${op} ${poly([c * c, "x^{2}"])}`;

/** scaledDu are the lines of u = cx: du and dx. */
const scaledDu = (c: number) => [`du = ${c} \\, dx`, `dx = \\frac{1}{${c}} \\, du`];

/** integrationBySubstitutionWithInverseTrigonometricFunctions integrates to arcsine and arctangent after a substitution. */
export const integrationBySubstitutionWithInverseTrigonometricFunctions: TopicDef = {
  id: "integration-by-substitution-with-inverse-trigonometric-functions",
  title: t("Integration by Substitution With Inverse Trigonometric Functions", "换元积分与反三角函数"),
  summary: t(
    "Integrate to arcsine and arctangent after a linear or non-linear substitution.",
    "经一次或非一次代换后积分为反正弦与反正切。",
  ),
  prerequisites: [
    "integration-using-substitution",
    "integration-using-inverse-trigonometric-functions",
    "integrating-exponential-functions-using-linear-substitution",
  ],
  encompasses: [
    { topic: "integration-using-inverse-trigonometric-functions", weight: 0.5 },
    { topic: "integration-using-substitution", weight: 0.3 },
  ],
  xp: 10,
  standards: [],
  intro: t(
    `The standard arctangent integral is $\\int \\frac{dx}{a^{2} + x^{2}} = \\frac{1}{a}\\arctan\\frac{x}{a} + C$. For example, $\\int \\frac{dx}{4 + x^{2}}$ is $\\frac{1}{2}\\arctan\\frac{x}{2} + C$.

Check: the derivative of $\\frac{1}{2}\\arctan\\frac{x}{2}$ is $\\frac{1}{2} \\cdot \\frac{1}{1 + \\frac{x^{2}}{4}} \\cdot \\frac{1}{2}$, which simplifies to $\\frac{1}{4 + x^{2}}$.

In this lesson we reach the arcsine and arctangent forms by substitution: $u = cx$ when $x^{2}$ has a coefficient, and $u = x^{2}$, $e^{x}$, $\\sin x$ or $\\ln x$ when the square is hidden.`,
    `标准的反正切积分是 $\\int \\frac{dx}{a^{2} + x^{2}} = \\frac{1}{a}\\arctan\\frac{x}{a} + C$。例如，$\\int \\frac{dx}{4 + x^{2}}$ 等于 $\\frac{1}{2}\\arctan\\frac{x}{2} + C$。

检验：$\\frac{1}{2}\\arctan\\frac{x}{2}$ 的导数是 $\\frac{1}{2} \\cdot \\frac{1}{1 + \\frac{x^{2}}{4}} \\cdot \\frac{1}{2}$，化简得 $\\frac{1}{4 + x^{2}}$。

这节课我们通过换元得到反正弦和反正切的形式：$x^{2}$ 有系数时用 $u = cx$，平方隐藏起来时用 $u = x^{2}$、$e^{x}$、$\\sin x$ 或 $\\ln x$。`,
  ),
  knowledgePoints: [
    {
      id: "scaled-arcsine-and-arctangent-integrals",
      title: t("Scaled arcsine and arctangent integrals", "带系数的反正弦与反正切积分"),
      explanation: t(
        "When the square has a coefficient, substitute to remove it, which introduces an extra factor of one over that coefficient in the answer. With $u = cx$ and $dx = \\frac{1}{c} \\, du$,\n\n$$\\int \\frac{1}{a^{2} + c^{2}x^{2}} \\, dx = \\frac{1}{ac}\\arctan\\frac{cx}{a} + C,$$\n\n$$\\int \\frac{1}{\\sqrt{a^{2} - c^{2}x^{2}}} \\, dx = \\frac{1}{c}\\arcsin\\frac{cx}{a} + C.$$\n\nFor example:\n\n$$\\int \\frac{1}{4 + 9x^{2}} \\, dx = \\frac{1}{6}\\arctan\\frac{3x}{2} + C.$$\n\nCheck: the derivative of $\\frac{1}{6}\\arctan\\frac{3x}{2}$ is $\\frac{1}{6} \\cdot \\frac{1}{1 + \\frac{9x^{2}}{4}} \\cdot \\frac{3}{2}$, which simplifies to $\\frac{1}{4 + 9x^{2}}$.\n\n> **Watch out.** The arctangent form has the factor $\\frac{1}{ac}$, but the arcsine form only $\\frac{1}{c}$, because the root absorbs the $a$.",
        "当平方项有系数时，用换元去掉它，答案中会多出一个该系数的倒数因子。令 $u = cx$，$dx = \\frac{1}{c} \\, du$：\n\n$$\\int \\frac{1}{a^{2} + c^{2}x^{2}} \\, dx = \\frac{1}{ac}\\arctan\\frac{cx}{a} + C$$\n\n$$\\int \\frac{1}{\\sqrt{a^{2} - c^{2}x^{2}}} \\, dx = \\frac{1}{c}\\arcsin\\frac{cx}{a} + C$$\n\n例如：\n\n$$\\int \\frac{1}{4 + 9x^{2}} \\, dx = \\frac{1}{6}\\arctan\\frac{3x}{2} + C$$\n\n检验：$\\frac{1}{6}\\arctan\\frac{3x}{2}$ 的导数是 $\\frac{1}{6} \\cdot \\frac{1}{1 + \\frac{9x^{2}}{4}} \\cdot \\frac{3}{2}$，化简得 $\\frac{1}{4 + 9x^{2}}$。\n\n> **注意。** 反正切形式的因子是 $\\frac{1}{ac}$，而反正弦形式只有 $\\frac{1}{c}$，因为根号吸收了 $a$。",
      ),
      generate(rng) {
        const k = rng.nonZero(-9, 9);
        if (rng.bool()) {
          const [a, c] = rng.pick<Scale>([
            [1, 2],
            [1, 3],
            [2, 3],
            [3, 2],
            [2, 5],
            [3, 4],
            [4, 3],
            [3, 1],
            [2, 1],
            [5, 2],
          ]);
          const arg = ratio(c, a);
          const answer = `${coef(Q.of(k, a * c))}\\arctan\\left(${arg}\\right) + C`;
          const integrand = quotient(k, squared(a, c, "+"));
          return asked(
            integrand,
            answer,
            [
              `${coef(Q.of(k, c))}\\arctan\\left(${arg}\\right) + C`,
              `${coef(Q.of(k, a))}\\arctan\\left(${arg}\\right) + C`,
              `${coef(Q.of(k, a * c))}\\arctan\\left(${ratio(a, c)}\\right) + C`,
            ],
            substituted(
              {
                u: poly([c, "x"]),
                du: scaledDu(c),
                integral: `\\int ${integrand} \\, dx`,
                inU: `${coef(Q.of(k, c))}\\int \\frac{1}{${a * a} + u^{2}} \\, du`,
                valueInU: `${coef(Q.of(k, a * c))}\\arctan\\left(${ratio(1, a, "u")}\\right) + C`,
                answer,
              },
              differentiated(
                `${ddx(answer)} = ${lead(Q.of(k, a * c))}\\frac{1}{1 + \\left(${arg}\\right)^{2}} \\cdot ${Q.of(c, a).toLatex()} = ${integrand}`,
              ),
            ),
          );
        }
        const [a, c] = rng.pick<Scale>([
          [2, 1],
          [3, 1],
          [3, 2],
          [4, 3],
          [5, 2],
          [5, 3],
          [5, 4],
          [4, 1],
        ]);
        const arg = ratio(c, a);
        const answer = `${coef(Q.of(k, c))}\\arcsin\\left(${arg}\\right) + C`;
        const integrand = quotient(k, `\\sqrt{${squared(a, c, "-")}}`);
        return asked(
          integrand,
          answer,
          [
            `${coef(Q.of(k))}\\arcsin\\left(${arg}\\right) + C`,
            `${coef(Q.of(k, a * c))}\\arcsin\\left(${arg}\\right) + C`,
            `${coef(Q.of(k, c))}\\arcsin\\left(${poly([c, "x"])}\\right) + C`,
          ],
          substituted(
            {
              u: poly([c, "x"]),
              du: scaledDu(c),
              integral: `\\int ${integrand} \\, dx`,
              inU: `${coef(Q.of(k, c))}\\int \\frac{1}{\\sqrt{${a * a} - u^{2}}} \\, du`,
              valueInU: `${coef(Q.of(k, c))}\\arcsin\\left(${ratio(1, a, "u")}\\right) + C`,
              answer,
            },
            differentiated(
              `${ddx(answer)} = ${lead(Q.of(k, c))}\\frac{1}{\\sqrt{1 - \\left(${arg}\\right)^{2}}} \\cdot ${Q.of(c, a).toLatex()} = ${integrand}`,
            ),
          ),
          { en: `$|x| < ${Q.of(a, c).toLatex()}$`, zh: `$|x| < ${Q.of(a, c).toLatex()}$` },
        );
      },
    },
    {
      id: "substitutions-leading-to-inverse-trigonometric-functions",
      title: t("Substitutions leading to inverse trigonometric functions", "化为反三角函数的代换"),
      explanation: t(
        "Look for a square hidden inside the integrand, such as a fourth power or a square of an exponential, whose derivative also appears as a factor. With $u = x^{2}$ and $x \\, dx = \\frac{1}{2} \\, du$:\n\n$$\\int \\frac{x}{x^{4} + a^{2}} \\, dx = \\frac{1}{2a}\\arctan\\frac{x^{2}}{a} + C.$$\n\nOther hidden squares:\n\n- $u = e^{x}$: $\\int \\frac{e^{x}}{1 + e^{2x}} \\, dx = \\arctan(e^{x}) + C$.\n- $u = \\sin x$: $\\int \\frac{\\cos x}{1 + \\sin^{2} x} \\, dx = \\arctan(\\sin x) + C$.\n- $u = \\ln x$: $\\int \\frac{1}{x(1 + (\\ln x)^{2})} \\, dx = \\arctan(\\ln x) + C$.\n\nCheck: the derivative of $\\arctan(e^{x})$ is $\\frac{1}{1 + e^{2x}} \\cdot e^{x}$, the first integrand of the list.\n\n> **Watch out.** The derivative of the hidden $u$ must be a factor of the integrand. $\\int \\frac{1}{1 + e^{2x}} \\, dx$ has no factor $e^{x}$, so it is not $\\arctan(e^{x}) + C$.",
        "寻找被积函数中隐藏的平方，例如四次方或指数式的平方，同时它的导数也作为因子出现。令 $u = x^{2}$，$x \\, dx = \\frac{1}{2} \\, du$：\n\n$$\\int \\frac{x}{x^{4} + a^{2}} \\, dx = \\frac{1}{2a}\\arctan\\frac{x^{2}}{a} + C$$\n\n其他隐藏的平方：\n\n- $u = e^{x}$：$\\int \\frac{e^{x}}{1 + e^{2x}} \\, dx = \\arctan(e^{x}) + C$。\n- $u = \\sin x$：$\\int \\frac{\\cos x}{1 + \\sin^{2} x} \\, dx = \\arctan(\\sin x) + C$。\n- $u = \\ln x$：$\\int \\frac{1}{x(1 + (\\ln x)^{2})} \\, dx = \\arctan(\\ln x) + C$。\n\n检验：$\\arctan(e^{x})$ 的导数是 $\\frac{1}{1 + e^{2x}} \\cdot e^{x}$，正是列表中第一个被积函数。\n\n> **注意。** 隐藏的 $u$ 的导数必须是被积函数的因子。$\\int \\frac{1}{1 + e^{2x}} \\, dx$ 中没有因子 $e^{x}$，所以它不等于 $\\arctan(e^{x}) + C$。",
      ),
      generate(rng) {
        const k = rng.nonZero(-9, 9);
        const kk = Math.abs(k) === 1 ? "" : String(Math.abs(k));
        const sign = k < 0 ? "-" : "";
        const kind = rng.int(0, 3);
        if (kind === 0) {
          const a = rng.int(1, 5);
          const arg = a === 1 ? "x^{2}" : `\\frac{x^{2}}{${a}}`;
          const answer = `${coef(Q.of(k, 2 * a))}\\arctan\\left(${arg}\\right) + C`;
          const integrand = `${sign}\\frac{${kk}x}{x^{4} + ${a * a}}`;
          return asked(
            integrand,
            answer,
            [
              `${coef(Q.of(k, a))}\\arctan\\left(${arg}\\right) + C`,
              `${coef(Q.of(k, 2))}\\arctan\\left(${arg}\\right) + C`,
              `${coef(Q.of(k, 2 * a))}\\arctan\\left(${a === 1 ? "x" : `\\frac{x}{${a}}`}\\right) + C`,
            ],
            substituted(
              {
                u: "x^{2}",
                du: ["du = 2x \\, dx", "x \\, dx = \\frac{1}{2} \\, du"],
                why: t(
                  "The fourth power is the square of $x^{2}$. Let $u = x^{2}$. Then:",
                  "四次方是 $x^{2}$ 的平方。令 $u = x^{2}$，则：",
                ),
                integral: `\\int ${integrand} \\, dx`,
                inU: `${coef(Q.of(k, 2))}\\int \\frac{1}{u^{2} + ${a * a}} \\, du`,
                valueInU: `${coef(Q.of(k, 2 * a))}\\arctan\\left(${ratio(1, a, "u")}\\right) + C`,
                answer,
              },
              differentiated(
                `${ddx(answer)} = ${lead(Q.of(k, 2 * a))}\\frac{1}{1 + \\left(${arg}\\right)^{2}} \\cdot ${a === 1 ? "2x" : `\\frac{2x}{${a}}`} = ${integrand}`,
              ),
            ),
          );
        }
        const [integrand, u, du, square, dudx, domain] = [
          [`${sign}\\frac{${kk}e^{x}}{1 + e^{2x}}`, "e^{x}", "e^{x} \\, dx", "e^{2x}", "e^{x}", undefined],
          [`${sign}\\frac{${kk}\\cos x}{1 + \\sin^{2} x}`, "\\sin x", "\\cos x \\, dx", "\\sin^{2} x", "\\cos x", undefined],
          [
            quotient(k, "x(1 + (\\ln x)^{2})"),
            "\\ln x",
            "\\frac{1}{x} \\, dx",
            "(\\ln x)^{2}",
            "\\frac{1}{x}",
            { en: "$x > 0$", zh: "$x > 0$" },
          ],
        ][kind - 1] as [string, string, string, string, string, Domain | undefined];
        const answer = `${coef(Q.of(k))}\\arctan(${u}) + C`;
        return asked(
          integrand,
          answer,
          [`${coef(Q.of(k))}\\arcsin(${u}) + C`, `${coef(Q.of(k))}\\ln(1 + ${square}) + C`, `${coef(Q.of(-k))}\\arctan(${u}) + C`],
          substituted(
            {
              u,
              du: [`du = ${du}`],
              why: t(
                `The denominator holds $1 + ${square}$, the square of $${u}$ plus one. Let $u = ${u}$. Then:`,
                `分母含 $1 + ${square}$，即 $${u}$ 的平方加一。令 $u = ${u}$，则：`,
              ),
              integral: `\\int ${integrand} \\, dx`,
              inU: `${coef(Q.of(k))}\\int \\frac{1}{1 + u^{2}} \\, du`,
              valueInU: `${coef(Q.of(k))}\\arctan u + C`,
              answer,
            },
            differentiated(`${ddx(answer)} = ${coef(Q.of(k))}\\frac{1}{1 + ${square}} \\cdot ${dudx} = ${integrand}`),
          ),
          domain,
        );
      },
    },
  ],
};

/** integratingHyperbolicFunctionsUsingSubstitution integrates hyperbolic functions of inner functions and their powers. */
export const integratingHyperbolicFunctionsUsingSubstitution: TopicDef = {
  id: "integrating-hyperbolic-functions-using-substitution",
  title: t("Integrating Hyperbolic Functions Using Substitution", "用换元法求双曲函数的积分"),
  summary: t(
    "Integrate hyperbolic functions of powers of x, powers of sinh and cosh, and tanh.",
    "求以 x 的幂为自变量的双曲函数、sinh 与 cosh 的幂以及 tanh 的积分。",
  ),
  prerequisites: [
    "integration-using-substitution",
    "integrating-hyperbolic-functions",
    "integrating-linear-rational-functions-using-substitution",
  ],
  encompasses: [
    { topic: "integrating-hyperbolic-functions", weight: 0.4 },
    { topic: "integration-using-substitution", weight: 0.3 },
  ],
  xp: 10,
  standards: [],
  intro: t(
    `The derivative of $\\cosh x$ is $\\sinh x$ and the derivative of $\\sinh x$ is $\\cosh x$, so $\\int \\sinh x \\, dx = \\cosh x + C$ and $\\int \\cosh x \\, dx = \\sinh x + C$, with no minus signs.

Check: from $\\cosh x = \\frac{e^{x} + e^{-x}}{2}$, the derivative is $\\frac{e^{x} - e^{-x}}{2}$, which is $\\sinh x$.

In this lesson we use substitution to integrate hyperbolic functions of $ax^{n}$, powers of $\\sinh$, $\\cosh$ and $\\tanh$ beside their derivatives, and $\\tanh x$ and $\\coth x$.`,
    `$\\cosh x$ 的导数是 $\\sinh x$，$\\sinh x$ 的导数是 $\\cosh x$，所以 $\\int \\sinh x \\, dx = \\cosh x + C$，$\\int \\cosh x \\, dx = \\sinh x + C$，都没有负号。

检验：由 $\\cosh x = \\frac{e^{x} + e^{-x}}{2}$，它的导数是 $\\frac{e^{x} - e^{-x}}{2}$，即 $\\sinh x$。

这节课我们用换元法求 $ax^{n}$ 的双曲函数的积分，$\\sinh$、$\\cosh$、$\\tanh$ 的幂乘以它们导数的积分，以及 $\\tanh x$ 和 $\\coth x$ 的积分。`,
  ),
  knowledgePoints: [
    {
      id: "hyperbolic-functions-of-powers-of-x",
      title: t("Hyperbolic functions of powers of x", "以 x 的幂为自变量的双曲函数"),
      explanation: t(
        "This works just like the trigonometric case, except that integrating hyperbolic sine and cosine involves no change of sign. With $u = ax^{n}$ and $x^{n - 1} \\, dx = \\frac{1}{na} \\, du$,\n\n$$\\int x^{n - 1}\\sinh(ax^{n}) \\, dx = \\frac{1}{na}\\cosh(ax^{n}) + C,$$\n\n$$\\int x^{n - 1}\\cosh(ax^{n}) \\, dx = \\frac{1}{na}\\sinh(ax^{n}) + C.$$\n\nCheck: the derivative of $\\frac{1}{2}\\cosh(x^{2})$ is $\\frac{1}{2}\\sinh(x^{2}) \\cdot 2x$, which is $x\\sinh(x^{2})$.\n\n> **Watch out.** Do not carry the minus sign over from the trigonometric case. The derivative of $\\cosh u$ is $+\\sinh u$, so $\\int \\sinh u \\, du$ is $\\cosh u + C$.",
        "这与三角函数的情形完全一样，只是对双曲正弦和双曲余弦积分时不需要改变符号。令 $u = ax^{n}$，$x^{n - 1} \\, dx = \\frac{1}{na} \\, du$：\n\n$$\\int x^{n - 1}\\sinh(ax^{n}) \\, dx = \\frac{1}{na}\\cosh(ax^{n}) + C$$\n\n$$\\int x^{n - 1}\\cosh(ax^{n}) \\, dx = \\frac{1}{na}\\sinh(ax^{n}) + C$$\n\n检验：$\\frac{1}{2}\\cosh(x^{2})$ 的导数是 $\\frac{1}{2}\\sinh(x^{2}) \\cdot 2x$，即 $x\\sinh(x^{2})$。\n\n> **注意。** 不要把三角函数情形的负号搬过来。$\\cosh u$ 的导数是 $+\\sinh u$，所以 $\\int \\sinh u \\, du$ 等于 $\\cosh u + C$。",
      ),
      generate(rng) {
        const n = rng.int(2, 3);
        const a = rng.int(1, 3);
        const k = rng.nonZero(-9, 9);
        const u = poly([a, `x^{${n}}`]);
        const [f, F] = rng.bool() ? ["\\sinh", "\\cosh"] : ["\\cosh", "\\sinh"];
        const c = Q.of(k, n * a);
        const answer = plusC([c, `${F}(${u})`]);
        const integrand = `${poly([k, xPow(n - 1)])}${f}(${u})`;
        const dudx = poly([n * a, xPow(n - 1)]);
        return asked(
          integrand,
          answer,
          [plusC([c.neg(), `${F}(${u})`]), plusC([Q.of(k, a), `${F}(${u})`]), plusC([Q.of(k, n), `${xPow(n)}${F}(${u})`])],
          substituted(
            {
              u,
              du: [`du = ${dudx} \\, dx`, `${xPow(n - 1)} \\, dx = \\frac{1}{${n * a}} \\, du`],
              integral: `\\int ${integrand} \\, dx`,
              inU: `${coef(c)}\\int ${f} u \\, du`,
              valueInU: plusC([c, `${F} u`]),
              answer,
            },
            differentiated(`${ddx(answer)} = ${c.toLatex()}${f}(${u}) \\cdot ${dudx} = ${integrand}`),
          ),
        );
      },
    },
    {
      id: "powers-of-hyperbolic-functions",
      title: t("Powers of hyperbolic functions", "双曲函数的幂"),
      explanation: t(
        "Choose the new variable so that its derivative is the other factor in the integrand, which turns the power of a hyperbolic function into a simple power. The derivatives of $\\sinh x$, $\\cosh x$ and $\\tanh x$ are $\\cosh x$, $\\sinh x$ and $\\operatorname{sech}^{2} x$, so:\n\n- $\\int \\sinh^{m} x\\cosh x \\, dx = \\frac{\\sinh^{m + 1} x}{m + 1} + C$ and $\\int \\cosh^{m} x\\sinh x \\, dx = \\frac{\\cosh^{m + 1} x}{m + 1} + C$.\n- $\\int \\tanh^{m} x\\operatorname{sech}^{2} x \\, dx = \\frac{\\tanh^{m + 1} x}{m + 1} + C$.\n- With $u = \\cosh x$: $\\int \\tanh x \\, dx = \\ln(\\cosh x) + C$; with $u = \\sinh x$: $\\int \\coth x \\, dx = \\ln|\\sinh x| + C$.\n\nCheck: the derivative of $\\frac{\\sinh^{3} x}{3}$ is $\\sinh^{2} x \\cdot \\cosh x$, the integrand for $m = 2$.\n\n> **Watch out.** Unlike $\\int \\tan x \\, dx$, the integral $\\int \\tanh x \\, dx$ has no minus sign, since the derivative of $\\cosh x$ is $+\\sinh x$. And $\\cosh x > 0$, so it needs no absolute value.",
        "选择新变量，使它的导数正好是被积函数中的另一个因子，这样双曲函数的幂就变成了简单的幂。$\\sinh x$、$\\cosh x$、$\\tanh x$ 的导数分别是 $\\cosh x$、$\\sinh x$、$\\operatorname{sech}^{2} x$，所以：\n\n- $\\int \\sinh^{m} x\\cosh x \\, dx = \\frac{\\sinh^{m + 1} x}{m + 1} + C$，$\\int \\cosh^{m} x\\sinh x \\, dx = \\frac{\\cosh^{m + 1} x}{m + 1} + C$。\n- $\\int \\tanh^{m} x\\operatorname{sech}^{2} x \\, dx = \\frac{\\tanh^{m + 1} x}{m + 1} + C$。\n- 令 $u = \\cosh x$：$\\int \\tanh x \\, dx = \\ln(\\cosh x) + C$；令 $u = \\sinh x$：$\\int \\coth x \\, dx = \\ln|\\sinh x| + C$。\n\n检验：$\\frac{\\sinh^{3} x}{3}$ 的导数是 $\\sinh^{2} x \\cdot \\cosh x$，正是 $m = 2$ 时的被积函数。\n\n> **注意。** 与 $\\int \\tan x \\, dx$ 不同，$\\int \\tanh x \\, dx$ 没有负号，因为 $\\cosh x$ 的导数是 $+\\sinh x$。而且 $\\cosh x > 0$，不需要绝对值。",
      ),
      generate(rng) {
        const k = rng.nonZero(-9, 9);
        const m = rng.int(2, 6);
        const kind = rng.int(0, 3);
        if (kind === 3) {
          const tanh = rng.bool();
          const answer = tanh ? plusC([k, "\\ln(\\cosh x)"]) : plusC([k, "\\ln|\\sinh x|"]);
          const integrand = `${coef(Q.of(k))}${tanh ? "\\tanh" : "\\coth"} x`;
          return asked(
            integrand,
            answer,
            tanh
              ? [plusC([-k, "\\ln(\\cosh x)"]), plusC([k, "\\operatorname{sech}^{2} x"]), plusC([k, "\\ln|\\sinh x|"])]
              : [plusC([-k, "\\ln|\\sinh x|"]), plusC([-k, "\\operatorname{csch}^{2} x"]), plusC([k, "\\ln(\\cosh x)"])],
            tanh
              ? substituted(
                  {
                    u: "\\cosh x",
                    du: ["du = \\sinh x \\, dx"],
                    why: t(
                      "Write $\\tanh x$ as $\\frac{\\sinh x}{\\cosh x}$ and let $u = \\cosh x$, which is always positive. Then:",
                      "把 $\\tanh x$ 写成 $\\frac{\\sinh x}{\\cosh x}$，令 $u = \\cosh x$，它总是正的，则：",
                    ),
                    integral: `\\int ${integrand} \\, dx = ${coef(Q.of(k))}\\int \\frac{\\sinh x}{\\cosh x} \\, dx`,
                    inU: `${coef(Q.of(k))}\\int \\frac{1}{u} \\, du`,
                    valueInU: plusC([k, "\\ln u"]),
                    answer,
                  },
                  differentiated(`${ddx(answer)} = ${coef(Q.of(k))}\\frac{\\sinh x}{\\cosh x} = ${integrand}`),
                )
              : substituted(
                  {
                    u: "\\sinh x",
                    du: ["du = \\cosh x \\, dx"],
                    why: t(
                      "Write $\\coth x$ as $\\frac{\\cosh x}{\\sinh x}$ and let $u = \\sinh x$. Then:",
                      "把 $\\coth x$ 写成 $\\frac{\\cosh x}{\\sinh x}$，令 $u = \\sinh x$，则：",
                    ),
                    integral: `\\int ${integrand} \\, dx = ${coef(Q.of(k))}\\int \\frac{\\cosh x}{\\sinh x} \\, dx`,
                    inU: `${coef(Q.of(k))}\\int \\frac{1}{u} \\, du`,
                    valueInU: plusC([k, "\\ln|u|"]),
                    answer,
                  },
                  differentiated(`${ddx(answer)} = ${coef(Q.of(k))}\\frac{\\cosh x}{\\sinh x} = ${integrand}`),
                ),
          );
        }
        const [f, g] = [
          ["\\sinh", "\\cosh x"],
          ["\\cosh", "\\sinh x"],
          ["\\tanh", "\\operatorname{sech}^{2} x"],
        ][kind] as [string, string];
        const c = Q.of(k, m + 1);
        const answer = plusC([c, `${f}^{${m + 1}} x`]);
        const integrand = `${coef(Q.of(k))}${f}^{${m}} x ${g}`;
        return asked(
          integrand,
          answer,
          [
            plusC([Q.of(-k, m + 1), `${f}^{${m + 1}} x`]),
            plusC([Q.of(k, m), `${f}^{${m + 1}} x`]),
            plusC([Q.of(k, m + 1), `${f}^{${m + 1}} x ${g}`]),
          ],
          substituted(
            {
              u: `${f} x`,
              du: [`du = ${g} \\, dx`],
              integral: `\\int ${integrand} \\, dx`,
              inU: `${coef(Q.of(k))}\\int u^{${m}} \\, du`,
              valueInU: plusC([c, `u^{${m + 1}}`]),
              answer,
            },
            differentiated(`${ddx(answer)} = ${c.toLatex()} \\cdot ${m + 1}${f}^{${m}} x \\cdot ${g} = ${integrand}`),
          ),
        );
      },
    },
  ],
};

/** integrationBySubstitutionWithInverseHyperbolicFunctions integrates to arsinh, arcosh and artanh after a substitution. */
export const integrationBySubstitutionWithInverseHyperbolicFunctions: TopicDef = {
  id: "integration-by-substitution-with-inverse-hyperbolic-functions",
  title: t("Integration by Substitution With Inverse Hyperbolic Functions", "换元积分与反双曲函数"),
  summary: t(
    "Integrate to arsinh, arcosh and artanh after a linear or non-linear substitution.",
    "经一次或非一次代换后积分为 arsinh、arcosh 与 artanh。",
  ),
  prerequisites: [
    "integration-using-substitution",
    "integration-using-inverse-hyperbolic-functions",
    "integrating-exponential-functions-using-linear-substitution",
  ],
  encompasses: [
    { topic: "integration-using-inverse-hyperbolic-functions", weight: 0.5 },
    { topic: "integration-using-substitution", weight: 0.3 },
  ],
  xp: 10,
  standards: [],
  intro: t(
    `The standard inverse hyperbolic sine integral is $\\int \\frac{dx}{\\sqrt{x^{2} + a^{2}}} = \\operatorname{arsinh}\\frac{x}{a} + C$. For example, $\\int \\frac{dx}{\\sqrt{x^{2} + 9}}$ is $\\operatorname{arsinh}\\frac{x}{3} + C$.

Check: the derivative of $\\operatorname{arsinh}\\frac{x}{3}$ is $\\frac{1}{\\sqrt{\\frac{x^{2}}{9} + 1}} \\cdot \\frac{1}{3}$, which simplifies to $\\frac{1}{\\sqrt{x^{2} + 9}}$.

In this lesson we reach the arsinh, arcosh and artanh forms by substitution: $u = cx$ when $x^{2}$ has a coefficient, and $u = x^{2}$, $e^{x}$ or $\\sin x$ when the square is hidden.`,
    `标准的反双曲正弦积分是 $\\int \\frac{dx}{\\sqrt{x^{2} + a^{2}}} = \\operatorname{arsinh}\\frac{x}{a} + C$。例如，$\\int \\frac{dx}{\\sqrt{x^{2} + 9}}$ 等于 $\\operatorname{arsinh}\\frac{x}{3} + C$。

检验：$\\operatorname{arsinh}\\frac{x}{3}$ 的导数是 $\\frac{1}{\\sqrt{\\frac{x^{2}}{9} + 1}} \\cdot \\frac{1}{3}$，化简得 $\\frac{1}{\\sqrt{x^{2} + 9}}$。

这节课我们通过换元得到 arsinh、arcosh 和 artanh 的形式：$x^{2}$ 有系数时用 $u = cx$，平方隐藏起来时用 $u = x^{2}$、$e^{x}$ 或 $\\sin x$。`,
  ),
  knowledgePoints: [
    {
      id: "scaled-inverse-hyperbolic-integrals",
      title: t("Scaled inverse hyperbolic integrals", "带系数的反双曲函数积分"),
      explanation: t(
        "Substitute to remove the coefficient of the square, then use the standard inverse hyperbolic integral and keep the factor that the substitution introduces. With $u = cx$ and $dx = \\frac{1}{c} \\, du$:\n\n$$\\int \\frac{dx}{\\sqrt{c^{2}x^{2} + a^{2}}} = \\frac{1}{c}\\operatorname{arsinh}\\frac{cx}{a} + C,$$\n\n$$\\int \\frac{dx}{\\sqrt{c^{2}x^{2} - a^{2}}} = \\frac{1}{c}\\operatorname{arcosh}\\frac{cx}{a} + C,$$\n\n$$\\int \\frac{dx}{a^{2} - c^{2}x^{2}} = \\frac{1}{ac}\\operatorname{artanh}\\frac{cx}{a} + C.$$\n\nThe arcosh form holds for $x > \\frac{a}{c}$, and the artanh form for $|x| < \\frac{a}{c}$.\n\nCheck: the derivative of $\\frac{1}{3}\\operatorname{arsinh}\\frac{3x}{2}$ is $\\frac{1}{3} \\cdot \\frac{1}{\\sqrt{\\frac{9x^{2}}{4} + 1}} \\cdot \\frac{3}{2}$, which simplifies to $\\frac{1}{\\sqrt{9x^{2} + 4}}$.\n\n> **Watch out.** Only the artanh form has the factor $\\frac{1}{ac}$. The arsinh and arcosh forms have $\\frac{1}{c}$, because the root absorbs the $a$.",
        "通过换元去掉平方项的系数，再用标准的反双曲函数积分，并保留换元带来的因子。令 $u = cx$，$dx = \\frac{1}{c} \\, du$：\n\n$$\\int \\frac{dx}{\\sqrt{c^{2}x^{2} + a^{2}}} = \\frac{1}{c}\\operatorname{arsinh}\\frac{cx}{a} + C$$\n\n$$\\int \\frac{dx}{\\sqrt{c^{2}x^{2} - a^{2}}} = \\frac{1}{c}\\operatorname{arcosh}\\frac{cx}{a} + C$$\n\n$$\\int \\frac{dx}{a^{2} - c^{2}x^{2}} = \\frac{1}{ac}\\operatorname{artanh}\\frac{cx}{a} + C$$\n\narcosh 形式在 $x > \\frac{a}{c}$ 时成立，artanh 形式在 $|x| < \\frac{a}{c}$ 时成立。\n\n检验：$\\frac{1}{3}\\operatorname{arsinh}\\frac{3x}{2}$ 的导数是 $\\frac{1}{3} \\cdot \\frac{1}{\\sqrt{\\frac{9x^{2}}{4} + 1}} \\cdot \\frac{3}{2}$，化简得 $\\frac{1}{\\sqrt{9x^{2} + 4}}$。\n\n> **注意。** 只有 artanh 形式的因子是 $\\frac{1}{ac}$。arsinh 和 arcosh 形式的因子是 $\\frac{1}{c}$，因为根号吸收了 $a$。",
      ),
      generate(rng) {
        const k = rng.nonZero(-9, 9);
        const kind = rng.int(0, 2);
        if (kind === 0) {
          const [a, c] = rng.pick<Scale>([
            [1, 2],
            [1, 3],
            [2, 3],
            [3, 2],
            [2, 5],
            [3, 4],
            [4, 3],
            [3, 1],
            [2, 1],
            [5, 2],
          ]);
          const arg = ratio(c, a);
          const answer = `${coef(Q.of(k, c))}\\operatorname{arsinh}\\left(${arg}\\right) + C`;
          const integrand = quotient(k, `\\sqrt{${squared(a, c, "+", true)}}`);
          return asked(
            integrand,
            answer,
            [
              `${coef(Q.of(k))}\\operatorname{arsinh}\\left(${arg}\\right) + C`,
              `${coef(Q.of(k, a * c))}\\operatorname{arsinh}\\left(${arg}\\right) + C`,
              `${coef(Q.of(k, c))}\\arcsin\\left(${arg}\\right) + C`,
            ],
            substituted(
              {
                u: poly([c, "x"]),
                du: scaledDu(c),
                integral: `\\int ${integrand} \\, dx`,
                inU: `${coef(Q.of(k, c))}\\int \\frac{du}{\\sqrt{u^{2} + ${a * a}}}`,
                valueInU: `${coef(Q.of(k, c))}\\operatorname{arsinh}\\left(${ratio(1, a, "u")}\\right) + C`,
                answer,
              },
              differentiated(
                `${ddx(answer)} = ${lead(Q.of(k, c))}\\frac{1}{\\sqrt{\\left(${arg}\\right)^{2} + 1}} \\cdot ${Q.of(c, a).toLatex()} = ${integrand}`,
              ),
            ),
          );
        }
        if (kind === 1) {
          const [a, c] = rng.pick<Scale>([
            [1, 2],
            [1, 3],
            [2, 3],
            [3, 4],
            [2, 5],
            [3, 5],
            [4, 5],
            [1, 4],
          ]);
          const arg = ratio(c, a);
          const answer = `${coef(Q.of(k, c))}\\operatorname{arcosh}\\left(${arg}\\right) + C`;
          const integrand = quotient(k, `\\sqrt{${squared(a, c, "-", true)}}`);
          return asked(
            integrand,
            answer,
            [
              `${coef(Q.of(k))}\\operatorname{arcosh}\\left(${arg}\\right) + C`,
              `${coef(Q.of(k, a * c))}\\operatorname{arcosh}\\left(${arg}\\right) + C`,
              `${coef(Q.of(k, c))}\\operatorname{arsinh}\\left(${arg}\\right) + C`,
            ],
            substituted(
              {
                u: poly([c, "x"]),
                du: scaledDu(c),
                integral: `\\int ${integrand} \\, dx`,
                inU: `${coef(Q.of(k, c))}\\int \\frac{du}{\\sqrt{u^{2} - ${a * a}}}`,
                valueInU: `${coef(Q.of(k, c))}\\operatorname{arcosh}\\left(${ratio(1, a, "u")}\\right) + C`,
                answer,
              },
              differentiated(
                `${ddx(answer)} = ${lead(Q.of(k, c))}\\frac{1}{\\sqrt{\\left(${arg}\\right)^{2} - 1}} \\cdot ${Q.of(c, a).toLatex()} = ${integrand}`,
              ),
            ),
            { en: `$x > ${Q.of(a, c).toLatex()}$`, zh: `$x > ${Q.of(a, c).toLatex()}$` },
          );
        }
        const [a, c] = rng.pick<Scale>([
          [2, 1],
          [3, 1],
          [3, 2],
          [4, 3],
          [5, 4],
          [5, 3],
          [5, 2],
          [4, 1],
        ]);
        const arg = ratio(c, a);
        const answer = `${coef(Q.of(k, a * c))}\\operatorname{artanh}\\left(${arg}\\right) + C`;
        const integrand = quotient(k, squared(a, c, "-"));
        return asked(
          integrand,
          answer,
          [
            `${coef(Q.of(k, c))}\\operatorname{artanh}\\left(${arg}\\right) + C`,
            `${coef(Q.of(k, a))}\\operatorname{artanh}\\left(${arg}\\right) + C`,
            `${coef(Q.of(k, a * c))}\\arctan\\left(${arg}\\right) + C`,
          ],
          substituted(
            {
              u: poly([c, "x"]),
              du: scaledDu(c),
              integral: `\\int ${integrand} \\, dx`,
              inU: `${coef(Q.of(k, c))}\\int \\frac{du}{${a * a} - u^{2}}`,
              valueInU: `${coef(Q.of(k, a * c))}\\operatorname{artanh}\\left(${ratio(1, a, "u")}\\right) + C`,
              answer,
            },
            differentiated(
              `${ddx(answer)} = ${lead(Q.of(k, a * c))}\\frac{1}{1 - \\left(${arg}\\right)^{2}} \\cdot ${Q.of(c, a).toLatex()} = ${integrand}`,
            ),
          ),
          { en: `$|x| < ${Q.of(a, c).toLatex()}$`, zh: `$|x| < ${Q.of(a, c).toLatex()}$` },
        );
      },
    },
    {
      id: "substitutions-leading-to-inverse-hyperbolic-functions",
      title: t("Substitutions leading to inverse hyperbolic functions", "化为反双曲函数的代换"),
      explanation: t(
        "As with the inverse trigonometric integrals, a hidden square and its derivative in the integrand point to the right substitution. With $u = x^{2}$ and $x \\, dx = \\frac{1}{2} \\, du$:\n\n$$\\int \\frac{x}{\\sqrt{x^{4} + a^{2}}} \\, dx = \\frac{1}{2}\\operatorname{arsinh}\\frac{x^{2}}{a} + C.$$\n\nOther hidden squares:\n\n- $u = e^{x}$: $\\int \\frac{e^{x}}{\\sqrt{e^{2x} + 1}} \\, dx = \\operatorname{arsinh}(e^{x}) + C$.\n- $u = \\sin x$: $\\int \\frac{\\cos x}{\\sqrt{1 + \\sin^{2} x}} \\, dx = \\operatorname{arsinh}(\\sin x) + C$.\n\nCheck: the derivative of $\\operatorname{arsinh}(\\sin x)$ is $\\frac{1}{\\sqrt{\\sin^{2} x + 1}} \\cdot \\cos x$, the integrand of the last formula.\n\n> **Watch out.** A root of a sum of squares gives arsinh, not arcsine. Arcsine comes from a root of a difference, $\\sqrt{1 - u^{2}}$.",
        "与反三角函数的积分一样，被积函数中隐藏的平方及其导数指明了应该怎样换元。令 $u = x^{2}$，$x \\, dx = \\frac{1}{2} \\, du$：\n\n$$\\int \\frac{x}{\\sqrt{x^{4} + a^{2}}} \\, dx = \\frac{1}{2}\\operatorname{arsinh}\\frac{x^{2}}{a} + C$$\n\n其他隐藏的平方：\n\n- $u = e^{x}$：$\\int \\frac{e^{x}}{\\sqrt{e^{2x} + 1}} \\, dx = \\operatorname{arsinh}(e^{x}) + C$。\n- $u = \\sin x$：$\\int \\frac{\\cos x}{\\sqrt{1 + \\sin^{2} x}} \\, dx = \\operatorname{arsinh}(\\sin x) + C$。\n\n检验：$\\operatorname{arsinh}(\\sin x)$ 的导数是 $\\frac{1}{\\sqrt{\\sin^{2} x + 1}} \\cdot \\cos x$，正是最后一个公式的被积函数。\n\n> **注意。** 平方和的根号给出 arsinh，而不是反正弦。反正弦来自平方差的根号 $\\sqrt{1 - u^{2}}$。",
      ),
      generate(rng) {
        const k = rng.nonZero(-9, 9);
        const kk = Math.abs(k) === 1 ? "" : String(Math.abs(k));
        const sign = k < 0 ? "-" : "";
        const kind = rng.int(0, 2);
        if (kind === 0) {
          const a = rng.int(1, 5);
          const arg = a === 1 ? "x^{2}" : `\\frac{x^{2}}{${a}}`;
          const answer = `${coef(Q.of(k, 2))}\\operatorname{arsinh}\\left(${arg}\\right) + C`;
          const integrand = `${sign}\\frac{${kk}x}{\\sqrt{x^{4} + ${a * a}}}`;
          return asked(
            integrand,
            answer,
            [
              `${coef(Q.of(k))}\\operatorname{arsinh}\\left(${arg}\\right) + C`,
              `${coef(Q.of(k, 2 * a))}\\operatorname{arsinh}\\left(${arg}\\right) + C`,
              `${coef(Q.of(k, 2))}\\arctan\\left(${arg}\\right) + C`,
            ],
            substituted(
              {
                u: "x^{2}",
                du: ["du = 2x \\, dx", "x \\, dx = \\frac{1}{2} \\, du"],
                why: t(
                  "The fourth power is the square of $x^{2}$. Let $u = x^{2}$. Then:",
                  "四次方是 $x^{2}$ 的平方。令 $u = x^{2}$，则：",
                ),
                integral: `\\int ${integrand} \\, dx`,
                inU: `${coef(Q.of(k, 2))}\\int \\frac{du}{\\sqrt{u^{2} + ${a * a}}}`,
                valueInU: `${coef(Q.of(k, 2))}\\operatorname{arsinh}\\left(${ratio(1, a, "u")}\\right) + C`,
                answer,
              },
              differentiated(
                `${ddx(answer)} = ${lead(Q.of(k, 2))}\\frac{1}{\\sqrt{\\left(${arg}\\right)^{2} + 1}} \\cdot ${a === 1 ? "2x" : `\\frac{2x}{${a}}`} = ${integrand}`,
              ),
            ),
          );
        }
        const [integrand, u, du, square, dudx] = (
          kind === 1
            ? [`${sign}\\frac{${kk}e^{x}}{\\sqrt{e^{2x} + 1}}`, "e^{x}", "e^{x} \\, dx", "e^{2x}", "e^{x}"]
            : [`${sign}\\frac{${kk}\\cos x}{\\sqrt{1 + \\sin^{2} x}}`, "\\sin x", "\\cos x \\, dx", "\\sin^{2} x", "\\cos x"]
        ) as [string, string, string, string, string];
        const answer = `${coef(Q.of(k))}\\operatorname{arsinh}(${u}) + C`;
        return asked(
          integrand,
          answer,
          [`${coef(Q.of(k))}\\arcsin(${u}) + C`, `${coef(Q.of(k))}\\arctan(${u}) + C`, `${coef(Q.of(k))}\\operatorname{arcosh}(${u}) + C`],
          substituted(
            {
              u,
              du: [`du = ${du}`],
              why: t(
                `Under the root is $${square}$, the square of $${u}$, plus one. Let $u = ${u}$. Then:`,
                `根号下是 $${square}$（即 $${u}$ 的平方）加一。令 $u = ${u}$，则：`,
              ),
              integral: `\\int ${integrand} \\, dx`,
              inU: `${coef(Q.of(k))}\\int \\frac{du}{\\sqrt{u^{2} + 1}}`,
              valueInU: `${coef(Q.of(k))}\\operatorname{arsinh} u + C`,
              answer,
            },
            differentiated(`${ddx(answer)} = ${coef(Q.of(k))}\\frac{1}{\\sqrt{${square} + 1}} \\cdot ${dudx} = ${integrand}`),
          ),
        );
      },
    },
  ],
};

/** integrationBySubstitutionWithInverseReciprocalHyperbolicFunctions integrates to arsech and arcsch after a substitution. */
export const integrationBySubstitutionWithInverseReciprocalHyperbolicFunctions: TopicDef = {
  id: "integration-by-substitution-with-inverse-reciprocal-hyperbolic-functions",
  title: t("Integration by Substitution With Inverse Reciprocal Hyperbolic Functions", "换元积分与反倒数双曲函数"),
  summary: t("Integrate to arsech and arcsch after a linear substitution or u = x².", "经一次代换或 u = x² 后积分为 arsech 与 arcsch。"),
  prerequisites: [
    "integration-by-substitution-with-inverse-hyperbolic-functions",
    "integration-using-inverse-reciprocal-hyperbolic-functions",
  ],
  encompasses: [{ topic: "integration-using-inverse-reciprocal-hyperbolic-functions", weight: 0.5 }],
  xp: 10,
  standards: [],
  intro: t(
    `For $0 < x < a$, the standard inverse hyperbolic secant integral is $\\int \\frac{dx}{x\\sqrt{a^{2} - x^{2}}} = -\\frac{1}{a}\\operatorname{arsech}\\frac{x}{a} + C$, and for $x > 0$, $\\int \\frac{dx}{x\\sqrt{a^{2} + x^{2}}} = -\\frac{1}{a}\\operatorname{arcsch}\\frac{x}{a} + C$.

Check: $\\operatorname{arsech} z$ decreases as $z$ grows, while the integrand is positive for $0 < x < a$, so the antiderivative must increase. The factor $-\\frac{1}{a}$ makes it do so.

In this lesson we reach these forms after the substitution $u = cx$, when $x^{2}$ has a coefficient, or $u = x^{2}$, when the root holds $x^{4}$.`,
    `当 $0 < x < a$ 时，标准的反双曲正割积分是 $\\int \\frac{dx}{x\\sqrt{a^{2} - x^{2}}} = -\\frac{1}{a}\\operatorname{arsech}\\frac{x}{a} + C$；当 $x > 0$ 时，$\\int \\frac{dx}{x\\sqrt{a^{2} + x^{2}}} = -\\frac{1}{a}\\operatorname{arcsch}\\frac{x}{a} + C$。

检验：$\\operatorname{arsech} z$ 随 $z$ 增大而减小，而当 $0 < x < a$ 时被积函数为正，所以原函数必须递增。因子 $-\\frac{1}{a}$ 正好让它递增。

这节课我们在代换后得到这些形式：$x^{2}$ 有系数时用 $u = cx$，根号下含 $x^{4}$ 时用 $u = x^{2}$。`,
  ),
  knowledgePoints: [
    {
      id: "scaled-arsech-and-arcsch-integrals",
      title: t("Scaled arsech and arcsch integrals", "带系数的 arsech 与 arcsch 积分"),
      explanation: t(
        "Here the factor of the variable outside the root also gets rewritten, and the constants from the substitution cancel, leaving the standard form. With $u = cx$, $dx = \\frac{1}{c} \\, du$ and $x = \\frac{u}{c}$, the factors of $c$ cancel:\n\n$$\\int \\frac{dx}{x\\sqrt{a^{2} - c^{2}x^{2}}} = \\int \\frac{du}{u\\sqrt{a^{2} - u^{2}}} = -\\frac{1}{a}\\operatorname{arsech}\\frac{cx}{a} + C,$$\n\n$$\\int \\frac{dx}{x\\sqrt{a^{2} + c^{2}x^{2}}} = -\\frac{1}{a}\\operatorname{arcsch}\\frac{cx}{a} + C.$$\n\nThe first holds for $0 < x < \\frac{a}{c}$, the second for $x > 0$.\n\nCheck: with $c = 1$ there is nothing to substitute, and the first formula becomes the standard one:\n\n$$\\int \\frac{dx}{x\\sqrt{a^{2} - x^{2}}} = -\\frac{1}{a}\\operatorname{arsech}\\frac{x}{a} + C.$$\n\n> **Watch out.** Unlike the arcsine and arctangent cases, no factor $\\frac{1}{c}$ appears: the $c$ in $dx$ cancels the $c$ in $x$. Do not divide by $c$.",
        "这里根号外的变量因子也要改写，换元产生的常数相互抵消，只剩下标准形式。令 $u = cx$，$dx = \\frac{1}{c} \\, du$，$x = \\frac{u}{c}$，$c$ 的因子相互抵消：\n\n$$\\int \\frac{dx}{x\\sqrt{a^{2} - c^{2}x^{2}}} = \\int \\frac{du}{u\\sqrt{a^{2} - u^{2}}} = -\\frac{1}{a}\\operatorname{arsech}\\frac{cx}{a} + C$$\n\n$$\\int \\frac{dx}{x\\sqrt{a^{2} + c^{2}x^{2}}} = -\\frac{1}{a}\\operatorname{arcsch}\\frac{cx}{a} + C$$\n\n第一个公式在 $0 < x < \\frac{a}{c}$ 时成立，第二个在 $x > 0$ 时成立。\n\n检验：$c = 1$ 时不需要换元，第一个公式就变成标准公式：\n\n$$\\int \\frac{dx}{x\\sqrt{a^{2} - x^{2}}} = -\\frac{1}{a}\\operatorname{arsech}\\frac{x}{a} + C$$\n\n> **注意。** 与反正弦、反正切的情形不同，这里不出现因子 $\\frac{1}{c}$：$dx$ 中的 $c$ 与 $x$ 中的 $c$ 相互抵消。不要除以 $c$。",
      ),
      generate(rng) {
        const k = rng.nonZero(-9, 9);
        const sech = rng.bool();
        const [a, c] = sech
          ? rng.pick<Scale>([
              [2, 1],
              [3, 1],
              [3, 2],
              [4, 1],
              [5, 2],
              [5, 3],
              [4, 3],
              [5, 1],
            ])
          : rng.pick<Scale>([
              [1, 2],
              [1, 3],
              [2, 3],
              [3, 2],
              [2, 1],
              [3, 1],
              [3, 4],
              [5, 2],
            ]);
        const f = sech ? "\\operatorname{arsech}" : "\\operatorname{arcsch}";
        const op = sech ? "-" : "+";
        const arg = ratio(c, a);
        const answer = `${coef(Q.of(-k, a))}${f}\\left(${arg}\\right) + C`;
        const integrand = quotient(k, `x\\sqrt{${squared(a, c, op)}}`);
        return asked(
          integrand,
          answer,
          [
            `${coef(Q.of(k, a))}${f}\\left(${arg}\\right) + C`,
            `${coef(Q.of(-k, a * c))}${f}\\left(${arg}\\right) + C`,
            `${coef(Q.of(-k, a))}${f}\\left(${ratio(1, a)}\\right) + C`,
          ],
          substituted(
            {
              u: poly([c, "x"]),
              du: c === 1 ? ["du = dx"] : [`du = ${c} \\, dx`, `\\frac{dx}{x} = \\frac{${c} \\, dx}{${c}x} = \\frac{du}{u}`],
              why:
                c === 1
                  ? t(
                      "The coefficient of $x^{2}$ is already 1, so the integral is in the standard form with $u = x$:",
                      "$x^{2}$ 的系数已经是 1，所以取 $u = x$，积分已是标准形式：",
                    )
                  : t(
                      `Let $u = ${poly([c, "x"])}$. Then the factor $\\frac{dx}{x}$ is $\\frac{du}{u}$:`,
                      `令 $u = ${poly([c, "x"])}$，则因子 $\\frac{dx}{x}$ 等于 $\\frac{du}{u}$：`,
                    ),
              integral: `\\int ${integrand} \\, dx`,
              inU: `${coef(Q.of(k))}\\int \\frac{du}{u\\sqrt{${a * a} ${op} u^{2}}}`,
              valueInU: `${coef(Q.of(-k, a))}${f}\\left(${ratio(1, a, "u")}\\right) + C`,
              answer,
            },
            differentiated(
              `${ddx(answer)} = ${lead(Q.of(-k, a))}\\left(-\\frac{1}{${arg}\\sqrt{1 ${op} \\left(${arg}\\right)^{2}}}\\right) \\cdot ${Q.of(c, a).toLatex()} = ${integrand}`,
            ),
          ),
          sech ? { en: `$0 < x < ${Q.of(a, c).toLatex()}$`, zh: `$0 < x < ${Q.of(a, c).toLatex()}$` } : { en: "$x > 0$", zh: "$x > 0$" },
        );
      },
    },
    {
      id: "substituting-x-squared-for-arsech-and-arcsch",
      title: t("Substituting $x^2$ for arsech and arcsch", "用 $x^2$ 代换得 arsech 与 arcsch"),
      explanation: t(
        "Multiplying the top and bottom by the variable creates the derivative of its square, so substituting the square turns the integrand into a standard form. Multiply the top and bottom by $x$ and let $u = x^{2}$, so that\n\n$$\\frac{dx}{x} = \\frac{x \\, dx}{x^{2}} = \\frac{du}{2u}.$$\n\nThen\n\n$$\\int \\frac{dx}{x\\sqrt{a^{2} - x^{4}}} = \\frac{1}{2}\\int \\frac{du}{u\\sqrt{a^{2} - u^{2}}} = -\\frac{1}{2a}\\operatorname{arsech}\\frac{x^{2}}{a} + C,$$\n\nand likewise\n\n$$\\int \\frac{dx}{x\\sqrt{a^{2} + x^{4}}} = -\\frac{1}{2a}\\operatorname{arcsch}\\frac{x^{2}}{a} + C.$$\n\nCheck: dividing $du = 2x \\, dx$ by $2u = 2x^{2}$ leaves $\\frac{dx}{x}$ on the right, as used above.\n\n> **Watch out.** Keep the factor $\\frac{1}{2}$ that comes from $du = 2x \\, dx$. Leaving it out doubles the answer.",
        "分子分母同乘以变量就产生了它平方的导数，所以把平方换元后，被积函数就成了标准形式。分子分母同乘 $x$，令 $u = x^{2}$，于是\n\n$$\\frac{dx}{x} = \\frac{x \\, dx}{x^{2}} = \\frac{du}{2u}$$\n\n所以\n\n$$\\int \\frac{dx}{x\\sqrt{a^{2} - x^{4}}} = \\frac{1}{2}\\int \\frac{du}{u\\sqrt{a^{2} - u^{2}}} = -\\frac{1}{2a}\\operatorname{arsech}\\frac{x^{2}}{a} + C$$\n\n同理\n\n$$\\int \\frac{dx}{x\\sqrt{a^{2} + x^{4}}} = -\\frac{1}{2a}\\operatorname{arcsch}\\frac{x^{2}}{a} + C$$\n\n检验：把 $du = 2x \\, dx$ 除以 $2u = 2x^{2}$，右边剩下 $\\frac{dx}{x}$，与上面用到的一致。\n\n> **注意。** 要保留由 $du = 2x \\, dx$ 带来的因子 $\\frac{1}{2}$。漏掉它，答案就会大一倍。",
      ),
      generate(rng) {
        const k = rng.nonZero(-9, 9);
        const sech = rng.bool();
        const a = rng.int(2, 6);
        const f = sech ? "\\operatorname{arsech}" : "\\operatorname{arcsch}";
        const op = sech ? "-" : "+";
        const arg = `\\frac{x^{2}}{${a}}`;
        const answer = `${coef(Q.of(-k, 2 * a))}${f}\\left(${arg}\\right) + C`;
        const integrand = quotient(k, `x\\sqrt{${a * a} ${op} x^{4}}`);
        return asked(
          integrand,
          answer,
          [
            `${coef(Q.of(-k, a))}${f}\\left(${arg}\\right) + C`,
            `${coef(Q.of(k, 2 * a))}${f}\\left(${arg}\\right) + C`,
            `${coef(Q.of(-k, 2 * a))}${f}\\left(\\frac{x}{${a}}\\right) + C`,
          ],
          substituted(
            {
              u: "x^{2}",
              du: ["du = 2x \\, dx", "\\frac{dx}{x} = \\frac{x \\, dx}{x^{2}} = \\frac{du}{2u}"],
              integral: `\\int ${integrand} \\, dx`,
              inU: `${coef(Q.of(k, 2))}\\int \\frac{du}{u\\sqrt{${a * a} ${op} u^{2}}}`,
              valueInU: `${coef(Q.of(-k, 2 * a))}${f}\\left(\\frac{u}{${a}}\\right) + C`,
              answer,
            },
            differentiated(
              `${ddx(answer)} = ${lead(Q.of(-k, 2 * a))}\\left(-\\frac{1}{${arg}\\sqrt{1 ${op} \\left(${arg}\\right)^{2}}}\\right) \\cdot \\frac{2x}{${a}} = ${integrand}`,
            ),
          ),
          sech ? { en: `$0 < x < \\sqrt{${a}}$`, zh: `$0 < x < \\sqrt{${a}}$` } : { en: "$x > 0$", zh: "$x > 0$" },
        );
      },
    },
  ],
};

/** integratingFunctionsUsingPolynomialDivision divides before integrating rational functions. */
export const integratingFunctionsUsingPolynomialDivision: TopicDef = {
  id: "integrating-functions-using-polynomial-division",
  title: t("Integrating Functions Using Polynomial Division", "用多项式除法求函数的积分"),
  summary: t(
    "Divide when the numerator's degree is at least the denominator's, then integrate the quotient and the remainder term.",
    "分子次数不低于分母次数时先做除法，再分别积分商和余项。",
  ),
  prerequisites: [
    "integrating-linear-rational-functions-using-substitution",
    "integration-by-substitution-with-inverse-trigonometric-functions",
  ],
  encompasses: [
    { topic: "integrating-linear-rational-functions-using-substitution", weight: 0.4 },
    { topic: "dividing-polynomials-using-long-division", weight: 0.2 },
  ],
  xp: 10,
  standards: [],
  intro: t(
    `Long division writes $\\frac{x^{2} + 3x + 5}{x + 1}$ as the quotient $x + 2$ plus the remainder term $\\frac{3}{x + 1}$, because $x^{2} + 3x + 5$ is $(x + 2)(x + 1) + 3$.

Check: expanding $(x + 2)(x + 1)$ gives $x^{2} + 3x + 2$, and adding $3$ gives back $x^{2} + 3x + 5$.

In this lesson we integrate rational functions whose numerator has degree at least that of the denominator: we divide first, then integrate the quotient and the remainder term separately.`,
    `长除法把 $\\frac{x^{2} + 3x + 5}{x + 1}$ 写成商 $x + 2$ 加余项 $\\frac{3}{x + 1}$，因为 $x^{2} + 3x + 5$ 等于 $(x + 2)(x + 1) + 3$。

检验：展开 $(x + 2)(x + 1)$ 得 $x^{2} + 3x + 2$，再加 $3$ 就回到 $x^{2} + 3x + 5$。

这节课我们求分子次数不低于分母次数的有理函数的积分：先做除法，再分别积分商和余项。`,
  ),
  knowledgePoints: [
    {
      id: "dividing-by-a-linear-denominator",
      title: t("Dividing by a linear denominator", "除以一次分母"),
      explanation: t(
        "When the top has at least the degree of the bottom, polynomial division leaves a polynomial plus a remainder fraction, and each part integrates easily. If the numerator has degree at least that of the denominator, divide first:\n\n$$\\frac{p(x)}{x + r} = q(x) + \\frac{R}{x + r}.$$\n\nThen, for example,\n\n$$\\int \\frac{x^{2} + 3x + 5}{x + 1} \\, dx = \\int \\left(x + 2 + \\frac{3}{x + 1}\\right) dx = \\frac{x^{2}}{2} + 2x + 3\\ln|x + 1| + C.$$\n\nCheck: the derivative of the answer is $x + 2 + \\frac{3}{x + 1}$, and putting it over $x + 1$ gives back the numerator $x^{2} + 3x + 5$.\n\n> **Watch out.** Do not drop the remainder. Integrating only the quotient $x + 2$ loses the term $3\\ln|x + 1|$.",
        "当分子的次数不低于分母时，用多项式除法得到一个多项式加一个余式分式，每一部分都容易积分。若分子次数不低于分母次数，先做除法：\n\n$$\\frac{p(x)}{x + r} = q(x) + \\frac{R}{x + r}$$\n\n例如\n\n$$\\int \\frac{x^{2} + 3x + 5}{x + 1} \\, dx = \\int \\left(x + 2 + \\frac{3}{x + 1}\\right) dx = \\frac{x^{2}}{2} + 2x + 3\\ln|x + 1| + C$$\n\n检验：答案的导数是 $x + 2 + \\frac{3}{x + 1}$，通分到分母 $x + 1$ 上就得到分子 $x^{2} + 3x + 5$。\n\n> **注意。** 不要丢掉余项。只积分商 $x + 2$ 会漏掉 $3\\ln|x + 1|$ 这一项。",
      ),
      generate(rng) {
        const a = rng.pick([1, 1, 2, 3]);
        const r = rng.nonZero(-5, 5);
        const p = rng.int(-6, 6);
        let q = rng.int(-9, 9);
        const b0 = p - a * r;
        if (q - r * b0 === 0) q += 1;
        const R = q - r * b0;
        const den = linear(1, r);
        const ln = `\\ln|${den}|`;
        const num = poly([a, "x^{2}"], [p, "x"], [q, ""]);
        const integrand = `\\frac{${num}}{${den}}`;
        const answer = plusC([Q.of(a, 2), "x^{2}"], [b0, "x"], [R, ln]);
        const quotientPart = poly([a, "x"], [b0, ""]);
        const split = `${quotientPart} ${R < 0 ? "-" : "+"} \\frac{${Math.abs(R)}}{${den}}`;
        return asked(
          integrand,
          answer,
          [
            plusC([Q.of(a, 2), "x^{2}"], [b0, "x"]),
            plusC([Q.of(a, 2), "x^{2}"], [b0, "x"], [R, `\\ln|${linear(1, -r)}|`]),
            plusC([Q.of(a, 2), "x^{2}"], [b0, "x"], [-R, `(${den})^{-2}`]),
          ],
          walked(
            [
              [
                ["Divide", "做除法"],
                t(
                  `The numerator has degree 2 and the denominator degree 1, so divide. The quotient is $${quotientPart}$ and the remainder is $${R}$:`,
                  `分子是二次，分母是一次，所以先做除法。商为 $${quotientPart}$，余数为 $${R}$：`,
                ),
                [`${integrand} = ${split}`],
              ],
              [
                ["Integrate term by term", "逐项积分"],
                t(
                  `The remainder term integrates to a logarithm, since $\\int \\frac{1}{${den}} \\, dx = ${ln} + C$:`,
                  `余项积分为对数，因为 $\\int \\frac{1}{${den}} \\, dx = ${ln} + C$：`,
                ),
                [`\\int \\left(${split}\\right) dx = ${answer}`],
              ],
            ],
            t(
              `Multiply back. The quotient times the denominator plus the remainder should be the numerator:${steps(`(${quotientPart})(${den}) ${R < 0 ? "-" : "+"} ${Math.abs(R)} = ${num}`).trimEnd()}`,
              `把除法乘回去。商乘以分母再加余数，应当等于分子：${steps(`(${quotientPart})(${den}) ${R < 0 ? "-" : "+"} ${Math.abs(R)} = ${num}`).trimEnd()}`,
            ),
          ),
        );
      },
    },
    {
      id: "dividing-by-x-squared-plus-one",
      title: t("Dividing by $x^2 + 1$", "除以 $x^2 + 1$"),
      explanation: t(
        "After dividing by $x^{2} + 1$, a remainder $bx + c$ splits into a logarithm and an arctangent:\n\n$$\\int \\frac{bx + c}{x^{2} + 1} \\, dx = \\frac{b}{2}\\ln(x^{2} + 1) + c\\arctan x + C,$$\n\nusing $u = x^{2} + 1$ for the first part. For example:\n\n$$\\frac{x^{3} + 2x + 3}{x^{2} + 1} = x + \\frac{x + 3}{x^{2} + 1}.$$\n\nCheck: $x(x^{2} + 1) + (x + 3)$ is $x^{3} + 2x + 3$, the numerator we started with.\n\n> **Watch out.** The term $bx$ gives $\\frac{b}{2}\\ln(x^{2} + 1)$, not $b\\ln(x^{2} + 1)$: with $u = x^{2} + 1$, $du$ is $2x \\, dx$, so half of it is $x \\, dx$.",
        "除以 $x^{2} + 1$ 后，余项 $bx + c$ 拆成对数与反正切：\n\n$$\\int \\frac{bx + c}{x^{2} + 1} \\, dx = \\frac{b}{2}\\ln(x^{2} + 1) + c\\arctan x + C$$\n\n第一部分用 $u = x^{2} + 1$。例如：\n\n$$\\frac{x^{3} + 2x + 3}{x^{2} + 1} = x + \\frac{x + 3}{x^{2} + 1}$$\n\n检验：$x(x^{2} + 1) + (x + 3)$ 等于 $x^{3} + 2x + 3$，正是原来的分子。\n\n> **注意。** $bx$ 一项给出 $\\frac{b}{2}\\ln(x^{2} + 1)$，而不是 $b\\ln(x^{2} + 1)$：令 $u = x^{2} + 1$，$du$ 是 $2x \\, dx$，它的一半才是 $x \\, dx$。",
      ),
      generate(rng) {
        const p = rng.int(-4, 4);
        let q = rng.int(-6, 6);
        let s = rng.int(-6, 6);
        if (q === 1) q = 3;
        if (s === p) s += 2;
        // (x³ + px² + qx + s) = (x + p)(x² + 1) + (q − 1)x + (s − p).
        const [b, c] = [q - 1, s - p];
        const num = poly([1, "x^{3}"], [p, "x^{2}"], [q, "x"], [s, ""]);
        const integrand = `\\frac{${num}}{x^{2} + 1}`;
        const answer = plusC([Q.of(1, 2), "x^{2}"], [p, "x"], [Q.of(b, 2), "\\ln(x^{2} + 1)"], [c, "\\arctan x"]);
        const rem = linear(b, c);
        const xPart = `${b < 0 ? "-" : ""}\\frac{${Math.abs(b) === 1 ? "" : Math.abs(b)}x}{x^{2} + 1}`;
        const parts = c === 0 ? xPart : `${xPart} ${c < 0 ? "-" : "+"} \\frac{${Math.abs(c)}}{x^{2} + 1}`;
        return asked(
          integrand,
          answer,
          [
            plusC([Q.of(1, 2), "x^{2}"], [p, "x"], [Q.of(b, 2), "\\ln(x^{2} + 1)"]),
            plusC([Q.of(1, 2), "x^{2}"], [p, "x"], [b, "\\ln(x^{2} + 1)"], [c, "\\arctan x"]),
            plusC([Q.of(1, 2), "x^{2}"], [p, "x"], [Q.of(b, 2), "\\ln(x^{2} + 1)"], [s, "\\arctan x"]),
          ],
          walked(
            [
              [
                ["Divide", "做除法"],
                t(
                  `Divide by $x^{2} + 1$. The quotient is $${linear(1, p)}$ and the remainder is $${rem}$:`,
                  `除以 $x^{2} + 1$。商为 $${linear(1, p)}$，余式为 $${rem}$：`,
                ),
                [`${integrand} = ${linear(1, p)} + \\frac{${rem}}{x^{2} + 1}`],
              ],
              [
                ["Split the remainder term", "拆开余项"],
                t(
                  "Split the remainder term into an $x$ part, which gives a logarithm by $u = x^{2} + 1$, and a constant part, which gives an arctangent:",
                  "把余项拆成含 $x$ 的部分和常数部分：前者用 $u = x^{2} + 1$ 得对数，后者得反正切：",
                ),
                [`\\frac{${rem}}{x^{2} + 1} = ${parts}`],
              ],
              [
                ["Integrate term by term", "逐项积分"],
                t(
                  "Since $\\int \\frac{x}{x^{2} + 1} \\, dx$ is $\\frac{1}{2}\\ln(x^{2} + 1) + C$ and $\\int \\frac{1}{x^{2} + 1} \\, dx$ is $\\arctan x + C$:",
                  "由于 $\\int \\frac{x}{x^{2} + 1} \\, dx$ 等于 $\\frac{1}{2}\\ln(x^{2} + 1) + C$，$\\int \\frac{1}{x^{2} + 1} \\, dx$ 等于 $\\arctan x + C$：",
                ),
                [`\\int ${integrand} \\, dx = ${answer}`],
              ],
            ],
            t(
              `Multiply back. The quotient times $x^{2} + 1$ plus the remainder should be the numerator:${steps(`(${linear(1, p)})(x^{2} + 1) + (${rem}) = ${num}`).trimEnd()}`,
              `把除法乘回去。商乘以 $x^{2} + 1$ 再加余式，应当等于分子：${steps(`(${linear(1, p)})(x^{2} + 1) + (${rem}) = ${num}`).trimEnd()}`,
            ),
          ),
        );
      },
    },
  ],
};

/** shifted writes x + h, or x when h is 0. */
const shifted = (h: number) => linear(1, h);

/** shiftedArg writes (x + h)/a: "x + 2", "\frac{x - 1}{3}". */
const shiftedArg = (h: number, a: number) => (a === 1 ? shifted(h) : `\\frac{${shifted(h)}}{${a}}`);

/** shiftedPar writes (x + h)/a for use as a factor: in parentheses when a is 1. */
const shiftedPar = (h: number, a: number) => (a === 1 ? `\\left(${shifted(h)}\\right)` : shiftedArg(h, a));

/** overA is the chain-rule factor 1/a, left out when a is 1. */
const overA = (a: number) => (a === 1 ? "" : ` \\cdot \\frac{1}{${a}}`);

/** Square is an integral worked by completing the square: the identity, u, the integral before and after, its value in u and the answer. */
interface Square {
  readonly identity: string;
  readonly u: string;
  readonly integral: string;
  readonly inU: string;
  readonly valueInU: string;
  readonly answer: string;
}

/** completed walks through an integral in three steps: complete the square, substitute, integrate and substitute back. */
function completed(s: Square, check: Text): Text {
  return walked(
    [
      [["Complete the square", "配方"], t("Rewrite the quadratic:", "改写二次式："), [s.identity]],
      [
        ["Substitute", "换元"],
        t(`Let $u = ${s.u}$, so $du = dx$. Then:`, `令 $u = ${s.u}$，则 $du = dx$，于是：`),
        [`${s.integral} = ${s.inU}`],
      ],
      [
        ["Integrate and substitute back", "积分并代回"],
        t(`Use the standard integral, then put back $u = ${s.u}$:`, `用标准积分，再代回 $u = ${s.u}$：`),
        [`${s.inU} = ${s.valueInU} = ${s.answer}`],
      ],
    ],
    check,
  );
}

/** integratingFunctionsByCompletingTheSquare completes the square to integrate to arctangent and arcsine. */
export const integratingFunctionsByCompletingTheSquare: TopicDef = {
  id: "integrating-functions-by-completing-the-square",
  title: t("Integrating Functions by Completing the Square", "用配方法求函数的积分"),
  summary: t("Complete the square in a quadratic to integrate to arctangent and arcsine.", "对二次式配方，积分为反正切与反正弦。"),
  prerequisites: ["integration-by-substitution-with-inverse-trigonometric-functions", "completing-the-square"],
  encompasses: [
    { topic: "integration-by-substitution-with-inverse-trigonometric-functions", weight: 0.4 },
    { topic: "completing-the-square", weight: 0.2 },
  ],
  xp: 10,
  standards: [],
  intro: t(
    `Completing the square writes $x^{2} + 4x + 13$ as $(x + 2)^{2} + 9$: half of the coefficient $4$ is $2$, and $13 - 2^{2}$ is $9$.

Check: expanding $(x + 2)^{2} + 9$ gives $x^{2} + 4x + 4 + 9$, which is $x^{2} + 4x + 13$.

In this lesson we complete the square in a quadratic and shift the variable by $u = x + h$, to integrate to arctangent and arcsine.`,
    `配方把 $x^{2} + 4x + 13$ 写成 $(x + 2)^{2} + 9$：一次项系数 $4$ 的一半是 $2$，而 $13 - 2^{2}$ 等于 $9$。

检验：展开 $(x + 2)^{2} + 9$ 得 $x^{2} + 4x + 4 + 9$，即 $x^{2} + 4x + 13$。

这节课我们对二次式配方，再用 $u = x + h$ 平移变量，积分为反正切与反正弦。`,
  ),
  knowledgePoints: [
    {
      id: "completing-the-square-for-arctangent",
      title: t("Completing the square for arctangent", "配方得反正切"),
      explanation: t(
        "Completing the square turns a quadratic with no real roots into a shifted square plus a constant, so a shift of the variable gives the arctangent form. Write $x^{2} + 2hx + h^{2} + a^{2} = (x + h)^{2} + a^{2}$ and let $u = x + h$:\n\n$$\\int \\frac{dx}{(x + h)^{2} + a^{2}} = \\frac{1}{a}\\arctan\\frac{x + h}{a} + C.$$\n\nFor example, $x^{2} + 4x + 13 = (x + 2)^{2} + 9$, so\n\n$$\\int \\frac{dx}{x^{2} + 4x + 13} = \\frac{1}{3}\\arctan\\frac{x + 2}{3} + C.$$\n\nCheck: the derivative of $\\frac{1}{3}\\arctan\\frac{x + 2}{3}$ is $\\frac{1}{3} \\cdot \\frac{1}{1 + \\frac{(x + 2)^{2}}{9}} \\cdot \\frac{1}{3}$, which simplifies to $\\frac{1}{(x + 2)^{2} + 9}$.\n\n> **Watch out.** The shift keeps its sign: $x^{2} + 4x + 13$ gives $\\frac{x + 2}{3}$, not $\\frac{x - 2}{3}$.",
        "配方把没有实根的二次式变成平移后的平方加常数，所以平移变量后就得到反正切的形式。写成 $x^{2} + 2hx + h^{2} + a^{2} = (x + h)^{2} + a^{2}$，令 $u = x + h$：\n\n$$\\int \\frac{dx}{(x + h)^{2} + a^{2}} = \\frac{1}{a}\\arctan\\frac{x + h}{a} + C$$\n\n例如 $x^{2} + 4x + 13 = (x + 2)^{2} + 9$，所以\n\n$$\\int \\frac{dx}{x^{2} + 4x + 13} = \\frac{1}{3}\\arctan\\frac{x + 2}{3} + C$$\n\n检验：$\\frac{1}{3}\\arctan\\frac{x + 2}{3}$ 的导数是 $\\frac{1}{3} \\cdot \\frac{1}{1 + \\frac{(x + 2)^{2}}{9}} \\cdot \\frac{1}{3}$，化简得 $\\frac{1}{(x + 2)^{2} + 9}$。\n\n> **注意。** 平移保留原来的符号：$x^{2} + 4x + 13$ 给出 $\\frac{x + 2}{3}$，而不是 $\\frac{x - 2}{3}$。",
      ),
      generate(rng) {
        const h = rng.nonZero(-4, 4);
        const a = rng.int(1, 4);
        const k = rng.nonZero(-9, 9);
        const den = poly([1, "x^{2}"], [2 * h, "x"], [h * h + a * a, ""]);
        const answer = `${coef(Q.of(k, a))}\\arctan\\left(${shiftedArg(h, a)}\\right) + C`;
        const integrand = quotient(k, den);
        return asked(
          integrand,
          answer,
          [
            `${coef(Q.of(k))}\\arctan\\left(${shiftedArg(h, a)}\\right) + C`,
            `${coef(Q.of(k, a))}\\arctan\\left(${shiftedArg(-h, a)}\\right) + C`,
            `${coef(Q.of(k, a * a))}\\arctan\\left(${shiftedArg(h, a)}\\right) + C`,
          ],
          completed(
            {
              identity: `${den} = (${shifted(h)})^{2} + ${a * a}`,
              u: shifted(h),
              integral: `\\int ${integrand} \\, dx`,
              inU: `${coef(Q.of(k))}\\int \\frac{du}{u^{2} + ${a * a}}`,
              valueInU: `${coef(Q.of(k, a))}\\arctan\\left(${ratio(1, a, "u")}\\right) + C`,
              answer,
            },
            differentiated(
              `${ddx(answer)} = ${lead(Q.of(k, a))}\\frac{1}{1 + ${a === 1 ? `(${shifted(h)})^{2}` : `\\left(${shiftedArg(h, a)}\\right)^{2}`}}${overA(a)} = ${quotient(k, `(${shifted(h)})^{2} + ${a * a}`)}`,
            ),
          ),
        );
      },
    },
    {
      id: "completing-the-square-for-arcsine",
      title: t("Completing the square for arcsine", "配方得反正弦"),
      explanation: t(
        "Under a root with $-x^{2}$, factor out the minus sign before completing the square: $c - 2hx - x^{2} = a^{2} - (x + h)^{2}$ with $a^{2} = c + h^{2}$. Then\n\n$$\\int \\frac{dx}{\\sqrt{a^{2} - (x + h)^{2}}} = \\arcsin\\frac{x + h}{a} + C.$$\n\nFor example, $8 + 2x - x^{2} = 9 - (x - 1)^{2}$, so the integral of one over its root is $\\arcsin\\frac{x - 1}{3} + C$.\n\nCheck: expanding $9 - (x - 1)^{2}$ gives $9 - x^{2} + 2x - 1$, which is $8 + 2x - x^{2}$.\n\n> **Watch out.** Unlike the arctangent form, the arcsine form has no factor $\\frac{1}{a}$, because the root absorbs it.",
        "根号下含 $-x^{2}$ 时，先提出负号再配方：$c - 2hx - x^{2} = a^{2} - (x + h)^{2}$，其中 $a^{2} = c + h^{2}$。于是\n\n$$\\int \\frac{dx}{\\sqrt{a^{2} - (x + h)^{2}}} = \\arcsin\\frac{x + h}{a} + C$$\n\n例如 $8 + 2x - x^{2} = 9 - (x - 1)^{2}$，所以 1 除以它的平方根的积分是 $\\arcsin\\frac{x - 1}{3} + C$。\n\n检验：展开 $9 - (x - 1)^{2}$ 得 $9 - x^{2} + 2x - 1$，即 $8 + 2x - x^{2}$。\n\n> **注意。** 与反正切形式不同，反正弦形式没有因子 $\\frac{1}{a}$，因为根号吸收了它。",
      ),
      generate(rng) {
        const h = rng.pick([-2, -1, 1, 2]);
        const a = rng.int(2, 4);
        const k = rng.nonZero(-9, 9);
        const inside = poly([a * a - h * h, ""], [-2 * h, "x"], [-1, "x^{2}"]);
        const answer = `${coef(Q.of(k))}\\arcsin\\left(${shiftedArg(h, a)}\\right) + C`;
        const integrand = quotient(k, `\\sqrt{${inside}}`);
        return asked(
          integrand,
          answer,
          [
            `${coef(Q.of(k))}\\arcsin\\left(${shiftedArg(-h, a)}\\right) + C`,
            `${coef(Q.of(k, a))}\\arcsin\\left(${shiftedArg(h, a)}\\right) + C`,
            `${coef(Q.of(k))}\\arcsin\\left(${shifted(h)}\\right) + C`,
          ],
          completed(
            {
              identity: `${inside} = ${a * a} - (${shifted(h)})^{2}`,
              u: shifted(h),
              integral: `\\int ${integrand} \\, dx`,
              inU: `${coef(Q.of(k))}\\int \\frac{du}{\\sqrt{${a * a} - u^{2}}}`,
              valueInU: `${coef(Q.of(k))}\\arcsin\\left(${ratio(1, a, "u")}\\right) + C`,
              answer,
            },
            differentiated(
              `${ddx(answer)} = ${coef(Q.of(k))}\\frac{1}{\\sqrt{1 - \\left(${shiftedArg(h, a)}\\right)^{2}}} \\cdot \\frac{1}{${a}} = ${quotient(k, `\\sqrt{${a * a} - (${shifted(h)})^{2}}`)}`,
            ),
          ),
          { en: `$|${shifted(h)}| < ${a}$`, zh: `$|${shifted(h)}| < ${a}$` },
        );
      },
    },
  ],
};

/** integrationUsingHyperbolicFunctionsAndCompletingTheSquare completes the square to integrate to arsinh and arcosh. */
export const integrationUsingHyperbolicFunctionsAndCompletingTheSquare: TopicDef = {
  id: "integration-using-hyperbolic-functions-and-completing-the-square",
  title: t("Integration Using Hyperbolic Functions and Completing the Square", "用双曲函数与配方法积分"),
  summary: t("Complete the square under a root to integrate to arsinh and arcosh.", "对根号下的二次式配方，积分为 arsinh 与 arcosh。"),
  prerequisites: ["integrating-functions-by-completing-the-square", "integration-by-substitution-with-inverse-hyperbolic-functions"],
  encompasses: [
    { topic: "integrating-functions-by-completing-the-square", weight: 0.4 },
    { topic: "integration-by-substitution-with-inverse-hyperbolic-functions", weight: 0.3 },
  ],
  xp: 10,
  standards: [],
  intro: t(
    `Under a root, $x^{2} - 6x + 13$ completes to $(x - 3)^{2} + 4$, and $x^{2} + 4x$ completes to $(x + 2)^{2} - 4$. The first is a square plus a constant, the second a square minus one.

Check: $(x - 3)^{2} + 4$ expands to $x^{2} - 6x + 9 + 4$, which is $x^{2} - 6x + 13$.

In this lesson we complete the square under a root and shift the variable, to integrate to arsinh when a constant is added and to arcosh when it is subtracted.`,
    `在根号下，$x^{2} - 6x + 13$ 配方得 $(x - 3)^{2} + 4$，$x^{2} + 4x$ 配方得 $(x + 2)^{2} - 4$。前者是平方加常数，后者是平方减常数。

检验：$(x - 3)^{2} + 4$ 展开得 $x^{2} - 6x + 9 + 4$，即 $x^{2} - 6x + 13$。

这节课我们对根号下的二次式配方并平移变量：加常数时积分为 arsinh，减常数时积分为 arcosh。`,
  ),
  knowledgePoints: [
    {
      id: "completing-the-square-for-arsinh",
      title: t("Completing the square for arsinh", "配方得 arsinh"),
      explanation: t(
        "After completing the square under the root, a shifted square plus a positive constant gives the inverse hyperbolic sine form. If $x^{2} + 2hx + c = (x + h)^{2} + a^{2}$ with $a > 0$, let $u = x + h$:\n\n$$\\int \\frac{dx}{\\sqrt{(x + h)^{2} + a^{2}}} = \\operatorname{arsinh}\\frac{x + h}{a} + C.$$\n\nFor example, $x^{2} - 6x + 13 = (x - 3)^{2} + 4$, so the integral of one over its root is $\\operatorname{arsinh}\\frac{x - 3}{2} + C$.\n\nCheck: the derivative of $\\operatorname{arsinh}\\frac{x - 3}{2}$ is $\\frac{1}{\\sqrt{\\frac{(x - 3)^{2}}{4} + 1}} \\cdot \\frac{1}{2}$, which simplifies to $\\frac{1}{\\sqrt{(x - 3)^{2} + 4}}$.\n\n> **Watch out.** A root of a square plus a constant gives arsinh, not arctangent. Arctangent comes from $(x + h)^{2} + a^{2}$ with no root.",
        "在根号下配方后，平移后的平方加正常数就给出反双曲正弦的形式。若 $x^{2} + 2hx + c = (x + h)^{2} + a^{2}$，$a > 0$，令 $u = x + h$：\n\n$$\\int \\frac{dx}{\\sqrt{(x + h)^{2} + a^{2}}} = \\operatorname{arsinh}\\frac{x + h}{a} + C$$\n\n例如 $x^{2} - 6x + 13 = (x - 3)^{2} + 4$，所以 1 除以它的平方根的积分是 $\\operatorname{arsinh}\\frac{x - 3}{2} + C$。\n\n检验：$\\operatorname{arsinh}\\frac{x - 3}{2}$ 的导数是 $\\frac{1}{\\sqrt{\\frac{(x - 3)^{2}}{4} + 1}} \\cdot \\frac{1}{2}$，化简得 $\\frac{1}{\\sqrt{(x - 3)^{2} + 4}}$。\n\n> **注意。** 平方加常数的根号给出 arsinh，而不是反正切。反正切来自没有根号的 $(x + h)^{2} + a^{2}$。",
      ),
      generate(rng) {
        const h = rng.nonZero(-4, 4);
        const a = rng.int(1, 4);
        const k = rng.nonZero(-9, 9);
        const inside = poly([1, "x^{2}"], [2 * h, "x"], [h * h + a * a, ""]);
        const answer = `${coef(Q.of(k))}\\operatorname{arsinh}\\left(${shiftedArg(h, a)}\\right) + C`;
        const integrand = quotient(k, `\\sqrt{${inside}}`);
        return asked(
          integrand,
          answer,
          [
            `${coef(Q.of(k))}\\operatorname{arsinh}\\left(${shiftedArg(-h, a)}\\right) + C`,
            `${coef(Q.of(k, a))}\\operatorname{arsinh}\\left(${shiftedArg(h, a)}\\right) + C`,
            `${coef(Q.of(k, a))}\\arctan\\left(${shiftedArg(h, a)}\\right) + C`,
          ],
          completed(
            {
              identity: `${inside} = (${shifted(h)})^{2} + ${a * a}`,
              u: shifted(h),
              integral: `\\int ${integrand} \\, dx`,
              inU: `${coef(Q.of(k))}\\int \\frac{du}{\\sqrt{u^{2} + ${a * a}}}`,
              valueInU: `${coef(Q.of(k))}\\operatorname{arsinh}\\left(${ratio(1, a, "u")}\\right) + C`,
              answer,
            },
            differentiated(
              `${ddx(answer)} = ${coef(Q.of(k))}\\frac{1}{\\sqrt{\\left(${shiftedArg(h, a)}\\right)^{2} + 1}}${overA(a)} = ${quotient(k, `\\sqrt{(${shifted(h)})^{2} + ${a * a}}`)}`,
            ),
          ),
        );
      },
    },
    {
      id: "completing-the-square-for-arcosh",
      title: t("Completing the square for arcosh", "配方得 arcosh"),
      explanation: t(
        "After completing the square, a shifted square minus a positive constant under the root gives the inverse hyperbolic cosine form on the right side. If $x^{2} + 2hx + c = (x + h)^{2} - a^{2}$ with $a > 0$, then for $x + h > a$\n\n$$\\int \\frac{dx}{\\sqrt{(x + h)^{2} - a^{2}}} = \\operatorname{arcosh}\\frac{x + h}{a} + C.$$\n\nFor example, $x^{2} + 4x = (x + 2)^{2} - 4$, so for $x > 0$ the integral of one over its root is $\\operatorname{arcosh}\\frac{x + 2}{2} + C$.\n\nCheck: at $x + h = a$ the root is $0$ and $\\operatorname{arcosh} 1$ is $0$, so both the integrand's root and the answer start at the same edge, $x = a - h$.\n\n> **Watch out.** The constant to subtract is $h^{2} - c$, not $c$. In $x^{2} + 4x$ there is no constant term, yet completing the square still subtracts $4$.",
        "配方后，根号下平移后的平方减去正常数，就在右侧给出反双曲余弦的形式。若 $x^{2} + 2hx + c = (x + h)^{2} - a^{2}$，$a > 0$，则当 $x + h > a$ 时\n\n$$\\int \\frac{dx}{\\sqrt{(x + h)^{2} - a^{2}}} = \\operatorname{arcosh}\\frac{x + h}{a} + C$$\n\n例如 $x^{2} + 4x = (x + 2)^{2} - 4$，所以当 $x > 0$ 时，1 除以它的平方根的积分是 $\\operatorname{arcosh}\\frac{x + 2}{2} + C$。\n\n检验：在 $x + h = a$ 处，根号为 $0$，而 $\\operatorname{arcosh} 1$ 也是 $0$，所以被积函数的根号与答案都从同一个端点 $x = a - h$ 开始。\n\n> **注意。** 要减去的常数是 $h^{2} - c$，而不是 $c$。$x^{2} + 4x$ 没有常数项，但配方后仍要减去 $4$。",
      ),
      generate(rng) {
        const a = rng.int(1, 3);
        const h = rng.pick([a - 1, a, a + 1].filter((v) => v !== 0));
        const k = rng.nonZero(-9, 9);
        const inside = poly([1, "x^{2}"], [2 * h, "x"], [h * h - a * a, ""]);
        const answer = `${coef(Q.of(k))}\\operatorname{arcosh}\\left(${shiftedArg(h, a)}\\right) + C`;
        const integrand = quotient(k, `\\sqrt{${inside}}`);
        return asked(
          integrand,
          answer,
          [
            `${coef(Q.of(k))}\\operatorname{arsinh}\\left(${shiftedArg(h, a)}\\right) + C`,
            `${coef(Q.of(k, a))}\\operatorname{arcosh}\\left(${shiftedArg(h, a)}\\right) + C`,
            `${coef(Q.of(k))}\\operatorname{arcosh}\\left(${shifted(h)}\\right) + C`,
          ],
          completed(
            {
              identity: `${inside} = (${shifted(h)})^{2} - ${a * a}`,
              u: shifted(h),
              integral: `\\int ${integrand} \\, dx`,
              inU: `${coef(Q.of(k))}\\int \\frac{du}{\\sqrt{u^{2} - ${a * a}}}`,
              valueInU: `${coef(Q.of(k))}\\operatorname{arcosh}\\left(${ratio(1, a, "u")}\\right) + C`,
              answer,
            },
            differentiated(
              `${ddx(answer)} = ${coef(Q.of(k))}\\frac{1}{\\sqrt{\\left(${shiftedArg(h, a)}\\right)^{2} - 1}}${overA(a)} = ${quotient(k, `\\sqrt{(${shifted(h)})^{2} - ${a * a}}`)}`,
            ),
          ),
          { en: `$x > ${a - h}$`, zh: `$x > ${a - h}$` },
        );
      },
    },
  ],
};

/** integrationUsingInverseReciprocalHyperbolicFunctionsAndCompletingTheSquare completes the square to integrate to arsech and arcsch. */
export const integrationUsingInverseReciprocalHyperbolicFunctionsAndCompletingTheSquare: TopicDef = {
  id: "integration-using-inverse-reciprocal-hyperbolic-functions-and-completing-the-square",
  title: t("Integration Using Inverse Reciprocal Hyperbolic Functions and Completing the Square", "用反倒数双曲函数与配方法积分"),
  summary: t(
    "Complete the square to integrate 1/((x + h)√(…)) to arsech and arcsch.",
    "配方后把 1/((x + h)√(…)) 积分为 arsech 与 arcsch。",
  ),
  prerequisites: [
    "integration-using-hyperbolic-functions-and-completing-the-square",
    "integration-by-substitution-with-inverse-reciprocal-hyperbolic-functions",
  ],
  encompasses: [
    { topic: "integration-using-hyperbolic-functions-and-completing-the-square", weight: 0.3 },
    { topic: "integration-by-substitution-with-inverse-reciprocal-hyperbolic-functions", weight: 0.4 },
  ],
  xp: 10,
  standards: [],
  intro: t(
    `With $u = x + 1$, the factor $x + 1$ outside the root and the square $(x + 1)^{2}$ inside it both become expressions in $u$, and $du = dx$. So $\\int \\frac{dx}{(x + 1)\\sqrt{4 - (x + 1)^{2}}}$ becomes $\\int \\frac{du}{u\\sqrt{4 - u^{2}}}$, a standard arsech integral.

Check: substituting back $u = x + 1$ into $u\\sqrt{4 - u^{2}}$ gives $(x + 1)\\sqrt{4 - (x + 1)^{2}}$, the original denominator.

In this lesson we complete the square under the root so that it matches the shifted factor outside, then integrate to arsech and arcsch.`,
    `令 $u = x + 1$，根号外的因子 $x + 1$ 和根号内的平方 $(x + 1)^{2}$ 都变成 $u$ 的式子，而且 $du = dx$。所以 $\\int \\frac{dx}{(x + 1)\\sqrt{4 - (x + 1)^{2}}}$ 变成 $\\int \\frac{du}{u\\sqrt{4 - u^{2}}}$，这是标准的 arsech 积分。

检验：把 $u = x + 1$ 代回 $u\\sqrt{4 - u^{2}}$，得 $(x + 1)\\sqrt{4 - (x + 1)^{2}}$，正是原来的分母。

这节课我们对根号下的二次式配方，使它与根号外的平移因子一致，再积分为 arsech 与 arcsch。`,
  ),
  knowledgePoints: [
    {
      id: "completing-the-square-for-arsech",
      title: t("Completing the square for arsech", "配方得 arsech"),
      explanation: t(
        "Complete the square so that the root holds a constant minus a shifted square, and the shifted factor outside matches, giving the inverse hyperbolic secant form. If $c - 2hx - x^{2} = a^{2} - (x + h)^{2}$, let $u = x + h$. For $0 < x + h < a$,\n\n$$\\int \\frac{dx}{(x + h)\\sqrt{a^{2} - (x + h)^{2}}} = -\\frac{1}{a}\\operatorname{arsech}\\frac{x + h}{a} + C.$$\n\nFor example, $3 - 2x - x^{2} = 4 - (x + 1)^{2}$, so with the factor $x + 1$ outside the integral is $-\\frac{1}{2}\\operatorname{arsech}\\frac{x + 1}{2} + C$.\n\nCheck: $\\operatorname{arsech}$ decreases, while the integrand is positive for $0 < x + h < a$, so the answer must carry the minus sign to increase.\n\n> **Watch out.** The factor outside the root must be the same $x + h$ as inside. If it is not, this substitution does not give the arsech form.",
        "配方使根号下是常数减平移后的平方，根号外的因子也是同样的平移式，就得到反双曲正割的形式。若 $c - 2hx - x^{2} = a^{2} - (x + h)^{2}$，令 $u = x + h$。当 $0 < x + h < a$ 时，\n\n$$\\int \\frac{dx}{(x + h)\\sqrt{a^{2} - (x + h)^{2}}} = -\\frac{1}{a}\\operatorname{arsech}\\frac{x + h}{a} + C$$\n\n例如 $3 - 2x - x^{2} = 4 - (x + 1)^{2}$，根号外有因子 $x + 1$ 时，积分为 $-\\frac{1}{2}\\operatorname{arsech}\\frac{x + 1}{2} + C$。\n\n检验：$\\operatorname{arsech}$ 是递减的，而当 $0 < x + h < a$ 时被积函数为正，所以答案必须带负号才能递增。\n\n> **注意。** 根号外的因子必须与根号内是同一个 $x + h$。如果不一致，这个代换得不到 arsech 的形式。",
      ),
      generate(rng) {
        const [h, a] = rng.pick<Scale>([
          [1, 2],
          [1, 3],
          [1, 4],
          [-1, 2],
          [-1, 3],
          [-1, 4],
          [2, 3],
          [2, 4],
        ]);
        const k = rng.nonZero(-9, 9);
        const inside = poly([a * a - h * h, ""], [-2 * h, "x"], [-1, "x^{2}"]);
        const answer = `${coef(Q.of(-k, a))}\\operatorname{arsech}\\left(${shiftedArg(h, a)}\\right) + C`;
        const integrand = quotient(k, `(${shifted(h)})\\sqrt{${inside}}`);
        const arg = shiftedPar(h, a);
        return asked(
          integrand,
          answer,
          [
            `${coef(Q.of(k, a))}\\operatorname{arsech}\\left(${shiftedArg(h, a)}\\right) + C`,
            `${coef(Q.of(-k))}\\operatorname{arsech}\\left(${shiftedArg(h, a)}\\right) + C`,
            `${coef(Q.of(k))}\\arcsin\\left(${shiftedArg(h, a)}\\right) + C`,
          ],
          completed(
            {
              identity: `${inside} = ${a * a} - (${shifted(h)})^{2}`,
              u: shifted(h),
              integral: `\\int ${integrand} \\, dx`,
              inU: `${coef(Q.of(k))}\\int \\frac{du}{u\\sqrt{${a * a} - u^{2}}}`,
              valueInU: `${coef(Q.of(-k, a))}\\operatorname{arsech}\\left(${ratio(1, a, "u")}\\right) + C`,
              answer,
            },
            differentiated(
              `${ddx(answer)} = ${lead(Q.of(-k, a))}\\left(-\\frac{1}{${arg}\\sqrt{1 - \\left(${shiftedArg(h, a)}\\right)^{2}}}\\right)${overA(a)} = ${quotient(k, `(${shifted(h)})\\sqrt{${a * a} - (${shifted(h)})^{2}}`)}`,
            ),
          ),
          { en: `$${-h} < x < ${a - h}$`, zh: `$${-h} < x < ${a - h}$` },
        );
      },
    },
    {
      id: "completing-the-square-for-arcsch",
      title: t("Completing the square for arcsch", "配方得 arcsch"),
      explanation: t(
        "Complete the square so that the root holds a shifted square plus a constant, and with the matching factor outside, this gives the inverse hyperbolic cosecant form. If $x^{2} + 2hx + c = (x + h)^{2} + a^{2}$, let $u = x + h$. For $x + h > 0$,\n\n$$\\int \\frac{dx}{(x + h)\\sqrt{(x + h)^{2} + a^{2}}} = -\\frac{1}{a}\\operatorname{arcsch}\\frac{x + h}{a} + C.$$\n\nFor example, $x^{2} + 4x + 13 = (x + 2)^{2} + 9$, so with the factor $x + 2$ outside the integral is $-\\frac{1}{3}\\operatorname{arcsch}\\frac{x + 2}{3} + C$ for $x > -2$.\n\nCheck: $(x + 2)^{2} + 9$ expands to $x^{2} + 4x + 4 + 9$, which is $x^{2} + 4x + 13$.\n\n> **Watch out.** With the factor $x + h$ outside the root the answer is arcsch, not arsinh. Arsinh comes from the root alone.",
        "配方使根号下是平移后的平方加常数，根号外有相应的因子，就得到反双曲余割的形式。若 $x^{2} + 2hx + c = (x + h)^{2} + a^{2}$，令 $u = x + h$。当 $x + h > 0$ 时，\n\n$$\\int \\frac{dx}{(x + h)\\sqrt{(x + h)^{2} + a^{2}}} = -\\frac{1}{a}\\operatorname{arcsch}\\frac{x + h}{a} + C$$\n\n例如 $x^{2} + 4x + 13 = (x + 2)^{2} + 9$，根号外有因子 $x + 2$ 时，当 $x > -2$，积分为 $-\\frac{1}{3}\\operatorname{arcsch}\\frac{x + 2}{3} + C$。\n\n检验：$(x + 2)^{2} + 9$ 展开得 $x^{2} + 4x + 4 + 9$，即 $x^{2} + 4x + 13$。\n\n> **注意。** 根号外有因子 $x + h$ 时，答案是 arcsch，而不是 arsinh。arsinh 来自只有根号的情形。",
      ),
      generate(rng) {
        const h = rng.pick([1, 2, 3, -1]);
        const a = rng.int(1, 4);
        const k = rng.nonZero(-9, 9);
        const inside = poly([1, "x^{2}"], [2 * h, "x"], [h * h + a * a, ""]);
        const answer = `${coef(Q.of(-k, a))}\\operatorname{arcsch}\\left(${shiftedArg(h, a)}\\right) + C`;
        const integrand = quotient(k, `(${shifted(h)})\\sqrt{${inside}}`);
        const arg = shiftedPar(h, a);
        return asked(
          integrand,
          answer,
          [
            `${coef(Q.of(k, a))}\\operatorname{arcsch}\\left(${shiftedArg(h, a)}\\right) + C`,
            `${coef(Q.of(-k))}\\operatorname{arcsch}\\left(${shiftedArg(h, a)}\\right) + C`,
            `${coef(Q.of(k))}\\operatorname{arsinh}\\left(${shiftedArg(h, a)}\\right) + C`,
          ],
          completed(
            {
              identity: `${inside} = (${shifted(h)})^{2} + ${a * a}`,
              u: shifted(h),
              integral: `\\int ${integrand} \\, dx`,
              inU: `${coef(Q.of(k))}\\int \\frac{du}{u\\sqrt{u^{2} + ${a * a}}}`,
              valueInU: `${coef(Q.of(-k, a))}\\operatorname{arcsch}\\left(${ratio(1, a, "u")}\\right) + C`,
              answer,
            },
            differentiated(
              `${ddx(answer)} = ${lead(Q.of(-k, a))}\\left(-\\frac{1}{${arg}\\sqrt{1 + \\left(${shiftedArg(h, a)}\\right)^{2}}}\\right)${overA(a)} = ${quotient(k, `(${shifted(h)})\\sqrt{(${shifted(h)})^{2} + ${a * a}}`)}`,
            ),
          ),
          { en: `$x > ${-h}$`, zh: `$x > ${-h}$` },
        );
      },
    },
  ],
};

/** calculusIISubstitutionTopics are the topics of Calculus II modules 1.1–1.2. */
export const calculusIISubstitutionTopics: readonly TopicDef[] = [
  integratingAlgebraicFunctionsUsingSubstitution,
  integratingLinearRationalFunctionsUsingSubstitution,
  integrationUsingSubstitution,
  calculatingDefiniteIntegralsUsingSubstitution,
  furtherIntegrationOfAlgebraicFunctionsUsingSubstitution,
  integratingExponentialFunctionsUsingLinearSubstitution,
  integratingExponentialFunctionsUsingSubstitution,
  integratingTrigonometricFunctionsUsingSubstitution,
  integratingLogarithmicFunctionsUsingSubstitution,
  integrationBySubstitutionWithInverseTrigonometricFunctions,
  integratingHyperbolicFunctionsUsingSubstitution,
  integrationBySubstitutionWithInverseHyperbolicFunctions,
  integrationBySubstitutionWithInverseReciprocalHyperbolicFunctions,
  integratingFunctionsUsingPolynomialDivision,
  integratingFunctionsByCompletingTheSquare,
  integrationUsingHyperbolicFunctionsAndCompletingTheSquare,
  integrationUsingInverseReciprocalHyperbolicFunctionsAndCompletingTheSquare,
];
