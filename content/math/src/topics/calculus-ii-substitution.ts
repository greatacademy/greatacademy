import type { Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Coefficient, linear, poly, Q } from "@ga/subject-math";

import { functionProblem, numberProblem } from "../problems.ts";
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
  return functionProblem({
    prompt: t(
      `Find $\\int ${integrand} \\, dx$${domain ? ` for ${domain.en}` : ""}.`,
      `${domain ? `当 ${domain.zh} 时，` : ""}求 $\\int ${integrand} \\, dx$。`,
    ),
    answer,
    antiderivative: true,
    wrong,
    solution: t(en, zh),
  });
}

/** exactValue builds a problem asking for the exact value of a definite integral. */
export function exactValue(integral: string, answer: string, wrong: readonly string[], en: string, zh: string) {
  return functionProblem({
    prompt: t(`Evaluate $${integral}$. Give an exact answer.`, `计算 $${integral}$，给出精确值。`),
    answer,
    wrong,
    solution: t(en, zh),
  });
}

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
  knowledgePoints: [
    {
      id: "substituting-a-linear-inner-function",
      title: t("Substituting a linear inner function", "代换一次内层函数"),
      explanation: t(
        "Substitution reverses the chain rule. For $\\int (ax + b)^{m} \\, dx$, let $u = ax + b$. Then $\\frac{du}{dx} = a$, so $dx = \\frac{1}{a} \\, du$ and\n\n$$\\int (ax + b)^{m} \\, dx = \\frac{1}{a}\\int u^{m} \\, du = \\frac{(ax + b)^{m + 1}}{a(m + 1)} + C \\quad (m \\ne -1).$$\n\nFinish by writing the answer in terms of $x$. For example, $\\int (3x - 1)^{4} \\, dx = \\frac{(3x - 1)^{5}}{15} + C$.",
        "换元法是链式法则的逆运算。对 $\\int (ax + b)^{m} \\, dx$，令 $u = ax + b$，则 $\\frac{du}{dx} = a$，即 $dx = \\frac{1}{a} \\, du$，于是\n\n$$\\int (ax + b)^{m} \\, dx = \\frac{1}{a}\\int u^{m} \\, du = \\frac{(ax + b)^{m + 1}}{a(m + 1)} + C \\quad (m \\ne -1)$$\n\n最后把答案写回关于 $x$ 的形式。例如 $\\int (3x - 1)^{4} \\, dx = \\frac{(3x - 1)^{5}}{15} + C$。",
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
        return integral(
          scaled(k, inner, m),
          answer,
          [
            `${powTerm(Q.of(k).div(up), inner, up)} + C`,
            `${powTerm(Q.of(k * a).div(up), inner, up)} + C`,
            `${powTerm(Q.of(k).mul(m).mul(Q.of(a)), inner, m.sub(Q.one))} + C`,
          ],
          `Let $u = ${inner}$, so $du = ${a} \\, dx$. The integral becomes $${coef(Q.of(k, a))}\\int u^{${m.toLatex()}} \\, du = ${c.toLatex()}u^{${up.toLatex()}} + C$, that is, $${answer}$.`,
          `令 $u = ${inner}$，则 $du = ${a} \\, dx$。积分变为 $${coef(Q.of(k, a))}\\int u^{${m.toLatex()}} \\, du = ${c.toLatex()}u^{${up.toLatex()}} + C$，即 $${answer}$。`,
        );
      },
    },
    {
      id: "substituting-a-power-of-x",
      title: t("Substituting a power of x", "代换 x 的幂"),
      explanation: t(
        "When the integrand contains $(ax^{n} + b)^{m}$ multiplied by a constant times $x^{n - 1}$, let $u = ax^{n} + b$. Then $du = nax^{n - 1} \\, dx$, which absorbs the factor $x^{n - 1}$. For example, with $u = x^{3} + 2$ and $du = 3x^{2} \\, dx$:\n\n$$\\int 6x^{2}(x^{3} + 2)^{4} \\, dx = 2\\int u^{4} \\, du = \\frac{2}{5}(x^{3} + 2)^{5} + C.$$",
        "当被积函数含 $(ax^{n} + b)^{m}$，并乘以常数倍的 $x^{n - 1}$ 时，令 $u = ax^{n} + b$，则 $du = nax^{n - 1} \\, dx$，正好吸收因子 $x^{n - 1}$。例如令 $u = x^{3} + 2$，$du = 3x^{2} \\, dx$：\n\n$$\\int 6x^{2}(x^{3} + 2)^{4} \\, dx = 2\\int u^{4} \\, du = \\frac{2}{5}(x^{3} + 2)^{5} + C$$",
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
        return integral(
          scaled(k, inner, m, xPow(n - 1)),
          answer,
          [
            `${powTerm(Q.of(k).div(up), inner, up)} + C`,
            `${powTerm(Q.of(k).div(Q.of(a).mul(up)), inner, up)} + C`,
            plusC([c.mul(Q.of(a)), `${xPow(n)}${pow(`(${inner})`, up)}`]),
          ],
          `Let $u = ${inner}$, so $du = ${poly([n * a, xPow(n - 1)])} \\, dx$ and $${xPow(n - 1)} \\, dx = \\frac{1}{${n * a}} \\, du$. The integral becomes $${coef(Q.of(k, n * a))}\\int u^{${m.toLatex()}} \\, du = ${c.toLatex()}u^{${up.toLatex()}} + C$, that is, $${answer}$.`,
          `令 $u = ${inner}$，则 $du = ${poly([n * a, xPow(n - 1)])} \\, dx$，$${xPow(n - 1)} \\, dx = \\frac{1}{${n * a}} \\, du$。积分变为 $${coef(Q.of(k, n * a))}\\int u^{${m.toLatex()}} \\, du = ${c.toLatex()}u^{${up.toLatex()}} + C$，即 $${answer}$。`,
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
  knowledgePoints: [
    {
      id: "integrating-one-over-a-linear-function",
      title: t("Integrating one over a linear function", "一次式倒数的积分"),
      explanation: t(
        "Substituting the linear expression turns the integrand into one over the new variable, whose integral is a logarithm; the leftover factor is one over the coefficient. With $u = ax + b$ and $dx = \\frac{1}{a} \\, du$,\n\n$$\\int \\frac{1}{ax + b} \\, dx = \\frac{1}{a}\\int \\frac{1}{u} \\, du = \\frac{1}{a}\\ln|ax + b| + C.$$\n\nThe power rule does not apply because the exponent is $-1$.",
        "把一次式换元后，被积函数变成新变量的倒数，它的积分是对数；剩下的因子是系数的倒数。令 $u = ax + b$，$dx = \\frac{1}{a} \\, du$，则\n\n$$\\int \\frac{1}{ax + b} \\, dx = \\frac{1}{a}\\int \\frac{1}{u} \\, du = \\frac{1}{a}\\ln|ax + b| + C$$\n\n指数为 $-1$，所以不能用幂法则。",
      ),
      generate(rng) {
        const a = rng.pick([2, 3, 4, 5, 6, -2, -3, -4]);
        const b = rng.nonZero(-9, 9);
        const k = rng.nonZero(-9, 9);
        const inner = linear(a, b);
        const ln = `\\ln|${inner}|`;
        const answer = plusC([Q.of(k, a), ln]);
        return integral(
          quotient(k, inner),
          answer,
          [plusC([k, ln]), plusC([k * a, ln]), plusC([Q.of(-k, a), `(${inner})^{-2}`])],
          `Let $u = ${inner}$, so $dx = \\frac{1}{${a}} \\, du$: $${coef(Q.of(k, a))}\\int \\frac{1}{u} \\, du = ${Q.of(k, a).toLatex()}\\ln|u| + C = ${answer}$.`,
          `令 $u = ${inner}$，则 $dx = \\frac{1}{${a}} \\, du$：$${coef(Q.of(k, a))}\\int \\frac{1}{u} \\, du = ${Q.of(k, a).toLatex()}\\ln|u| + C = ${answer}$。`,
        );
      },
    },
    {
      id: "integrating-a-quotient-of-linear-functions",
      title: t("Integrating a quotient of linear functions", "一次函数之商的积分"),
      explanation: t(
        "Write the numerator as a multiple of the denominator plus a constant, then integrate term by term:\n\n$$\\int \\frac{2x + 5}{x + 1} \\, dx = \\int \\left(2 + \\frac{3}{x + 1}\\right) dx = 2x + 3\\ln|x + 1| + C.$$\n\nIn general $cx + d = \\frac{c}{a}(ax + b) + \\left(d - \\frac{bc}{a}\\right)$.",
        "把分子写成分母的倍数加一个常数，再逐项积分：\n\n$$\\int \\frac{2x + 5}{x + 1} \\, dx = \\int \\left(2 + \\frac{3}{x + 1}\\right) dx = 2x + 3\\ln|x + 1| + C$$\n\n一般地，$cx + d = \\frac{c}{a}(ax + b) + \\left(d - \\frac{bc}{a}\\right)$。",
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
        const answer = plusC([Q.of(c, a), "x"], [rest.div(Q.of(a)), ln]);
        return integral(
          `\\frac{${linear(c, d)}}{${inner}}`,
          answer,
          [plusC([Q.of(c, a), "x"], [rest, ln]), plusC([Q.of(c, a), "x"], [d, ln]), plusC([Q.of(c, a), ln])],
          `$${linear(c, d)} = ${Q.of(c, a).toLatex()}(${inner}) ${rest.sign() < 0 ? "-" : "+"} ${rest.abs().toLatex()}$, so the integrand is $${Q.of(c, a).toLatex()} ${rest.sign() < 0 ? "-" : "+"} ${quotient(rest.abs(), inner)}$. Integrating, $${answer}$.`,
          `$${linear(c, d)} = ${Q.of(c, a).toLatex()}(${inner}) ${rest.sign() < 0 ? "-" : "+"} ${rest.abs().toLatex()}$，所以被积函数为 $${Q.of(c, a).toLatex()} ${rest.sign() < 0 ? "-" : "+"} ${quotient(rest.abs(), inner)}$。积分得 $${answer}$。`,
        );
      },
    },
  ],
};

/** Choice is one substitution exercise: an integrand and the right and wrong choices of u. */
interface Choice {
  readonly integrand: string;
  readonly u: string;
  readonly wrong: readonly string[];
  readonly du: string;
}

/** substitutionChoice makes an integrand whose substitution must be recognized. */
function substitutionChoice(rng: Rng): Choice {
  const b = rng.nonZero(-9, 9);
  const m = rng.int(2, 7);
  switch (rng.int(0, 5)) {
    case 0: {
      const u = poly([1, "x^{3}"], [b, ""]);
      return { integrand: `x^{2}(${u})^{${m}}`, u, wrong: ["x^{2}", "x", poly([1, "x^{2}"], [b, ""])], du: "3x^{2} \\, dx" };
    }
    case 1: {
      const p = rng.nonZero(-6, 6);
      const u = poly([1, "x^{2}"], [p, "x"], [b, ""]);
      return {
        integrand: `\\frac{${linear(2, p)}}{${u}}`,
        u,
        wrong: [linear(2, p), "x^{2}", "x"],
        du: `(${linear(2, p)}) \\, dx`,
      };
    }
    case 2: {
      const a = rng.nonZero(-4, 4);
      const u = poly([a, "x^{2}"]);
      return { integrand: `xe^{${u}}`, u, wrong: ["x", poly([2 * a, "x"]), "e^{x}"], du: `${poly([2 * a, "x"])} \\, dx` };
    }
    case 3:
      return {
        integrand: `\\cos x \\sin^{${2 * rng.int(1, 3)}} x`,
        u: "\\sin x",
        wrong: ["\\cos x", "\\tan x", "x"],
        du: "\\cos x \\, dx",
      };
    case 4: {
      const a = rng.int(2, 6);
      return {
        integrand: `\\frac{(\\ln x)^{${m}}}{${a}x}`,
        u: "\\ln x",
        wrong: [`${a}x`, "\\frac{1}{x}", `x^{${m}}`],
        du: "\\frac{1}{x} \\, dx",
      };
    }
    default: {
      const u = poly([1, "x^{2}"], [Math.abs(b), ""]);
      return { integrand: `x\\sqrt{${u}}`, u, wrong: ["x", "\\sqrt{x}", `x + ${Math.abs(b)}`], du: "2x \\, dx" };
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
  knowledgePoints: [
    {
      id: "choosing-the-substitution",
      title: t("Choosing the substitution", "选择代换"),
      explanation: t(
        "The chain rule gives $\\frac{d}{dx}F(g(x)) = F'(g(x))g'(x)$, so\n\n$$\\int f(g(x))g'(x) \\, dx = \\int f(u) \\, du \\quad \\text{with } u = g(x).$$\n\nLook for an inner function $g(x)$ whose derivative, up to a constant factor, also multiplies the integrand. In $\\int x^{2}(x^{3} + 1)^{5} \\, dx$ the inner function is $x^{3} + 1$ and its derivative $3x^{2}$ appears as $x^{2}$.",
        "由链式法则，$\\frac{d}{dx}F(g(x)) = F'(g(x))g'(x)$，所以\n\n$$\\int f(g(x))g'(x) \\, dx = \\int f(u) \\, du \\quad \\text{其中 } u = g(x)$$\n\n寻找一个内层函数 $g(x)$，使它的导数（相差常数倍）也作为因子出现在被积函数中。在 $\\int x^{2}(x^{3} + 1)^{5} \\, dx$ 中，内层函数是 $x^{3} + 1$，它的导数 $3x^{2}$ 以 $x^{2}$ 的形式出现。",
      ),
      generate(rng) {
        const c = substitutionChoice(rng);
        return oneOf(
          rng,
          t(
            `Which substitution turns $\\int ${c.integrand} \\, dx$ into an integral of a basic function of $u$?`,
            `哪个代换能把 $\\int ${c.integrand} \\, dx$ 化为关于 $u$ 的基本函数的积分？`,
          ),
          t(`$u = ${c.u}$`, `$u = ${c.u}$`),
          c.wrong.map((w) => t(`$u = ${w}$`, `$u = ${w}$`)),
          t(
            `With $u = ${c.u}$, $du = ${c.du}$, which is a constant multiple of the remaining factor, so the integral becomes one in $u$ alone.`,
            `取 $u = ${c.u}$，则 $du = ${c.du}$，它与剩下的因子只差常数倍，因此积分只含 $u$。`,
          ),
        );
      },
    },
    {
      id: "integrating-f-of-g-times-g-prime",
      title: t("Integrating f(g(x))g'(x)", "求 f(g(x))g'(x) 的积分"),
      explanation: t(
        "Look for an inner function whose derivative also appears as a factor, since that is exactly the pattern the chain rule produces when you differentiate. Substitute $u = g(x)$, replace $g'(x) \\, dx$ by $du$ (adjusting a constant factor), integrate in $u$, and substitute back. With $u = x^{2} + 4x + 1$ and $du = (2x + 4) \\, dx = 2(x + 2) \\, dx$:\n\n$$\\int (x + 2)(x^{2} + 4x + 1)^{3} \\, dx = \\frac{1}{2}\\int u^{3} \\, du = \\frac{1}{8}(x^{2} + 4x + 1)^{4} + C.$$",
        "寻找一个内层函数，使它的导数也作为因子出现，因为这正是求导时链式法则产生的形式。代换 $u = g(x)$，把 $g'(x) \\, dx$ 换成 $du$（调整常数因子），对 $u$ 积分，再代回。令 $u = x^{2} + 4x + 1$，$du = (2x + 4) \\, dx = 2(x + 2) \\, dx$：\n\n$$\\int (x + 2)(x^{2} + 4x + 1)^{3} \\, dx = \\frac{1}{2}\\int u^{3} \\, du = \\frac{1}{8}(x^{2} + 4x + 1)^{4} + C$$",
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
        return integral(
          `${coef(Q.of(k))}(${outer})(${inner})^{${m}}`,
          answer,
          [
            plusC([Q.of(k, m + 1), `(${inner})^{${m + 1}}`]),
            plusC([c, `(${outer})(${inner})^{${m + 1}}`]),
            plusC([Q.of(k, m), `(${inner})^{${m + 1}}`]),
          ],
          `Let $u = ${inner}$, so $du = (${linear(2, 2 * h)}) \\, dx${half ? ` = 2(${outer}) \\, dx` : ""}$. The integral becomes $${coef(Q.of(k, half ? 2 : 1))}\\int u^{${m}} \\, du = ${c.toLatex()}u^{${m + 1}} + C$, that is, $${answer}$.`,
          `令 $u = ${inner}$，则 $du = (${linear(2, 2 * h)}) \\, dx${half ? ` = 2(${outer}) \\, dx` : ""}$。积分变为 $${coef(Q.of(k, half ? 2 : 1))}\\int u^{${m}} \\, du = ${c.toLatex()}u^{${m + 1}} + C$，即 $${answer}$。`,
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
  knowledgePoints: [
    {
      id: "changing-the-limits-of-integration",
      title: t("Changing the limits of integration", "变换积分限"),
      explanation: t(
        "In a definite integral, change the limits along with the variable: if $u = g(x)$, then\n\n$$\\int_{a}^{b} f(g(x))g'(x) \\, dx = \\int_{g(a)}^{g(b)} f(u) \\, du.$$\n\nThere is then no need to substitute back. For $\\int_{0}^{1} x(x^{2} + 1)^{2} \\, dx$, let $u = x^{2} + 1$: $u$ runs from $1$ to $2$ and the integral is $\\frac{1}{2}\\int_{1}^{2} u^{2} \\, du = \\frac{1}{2} \\cdot \\frac{8 - 1}{3} = \\frac{7}{6}$.",
        "在定积分中，换元时积分限也要一起换：若 $u = g(x)$，则\n\n$$\\int_{a}^{b} f(g(x))g'(x) \\, dx = \\int_{g(a)}^{g(b)} f(u) \\, du$$\n\n这样就不必再代回。对 $\\int_{0}^{1} x(x^{2} + 1)^{2} \\, dx$，令 $u = x^{2} + 1$：$u$ 从 $1$ 变到 $2$，积分等于 $\\frac{1}{2}\\int_{1}^{2} u^{2} \\, du = \\frac{1}{2} \\cdot \\frac{8 - 1}{3} = \\frac{7}{6}$。",
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
        return numberProblem({
          prompt: t(
            `Evaluate $\\int_{${x0}}^{${x1}} ${poly([k, "x"])}(${inner})${m === 1 ? "" : `^{${m}}`} \\, dx$.`,
            `计算 $\\int_{${x0}}^{${x1}} ${poly([k, "x"])}(${inner})${m === 1 ? "" : `^{${m}}`} \\, dx$。`,
          ),
          answer: value,
          wrong: [
            Q.of(k * (x1 ** (m + 1) - x0 ** (m + 1)), 2 * (m + 1)),
            Q.of(k * (u1 ** (m + 1) - u0 ** (m + 1)), m + 1),
            Q.of(k * (u1 ** (m + 1) - u0 ** (m + 1)), 2 * m),
          ],
          solution: t(
            `Let $u = ${inner}$, so $du = 2x \\, dx$; $x = ${x0}$ gives $u = ${u0}$ and $x = ${x1}$ gives $u = ${u1}$. The integral is $${coef(Q.of(k, 2))}\\int_{${u0}}^{${u1}} u${m === 1 ? "" : `^{${m}}`} \\, du = ${Q.of(k, 2 * (m + 1)).toLatex()}\\left(${u1}^{${m + 1}} - ${u0}^{${m + 1}}\\right) = ${value.toLatex()}$.`,
            `令 $u = ${inner}$，则 $du = 2x \\, dx$；$x = ${x0}$ 时 $u = ${u0}$，$x = ${x1}$ 时 $u = ${u1}$。积分等于 $${coef(Q.of(k, 2))}\\int_{${u0}}^{${u1}} u${m === 1 ? "" : `^{${m}}`} \\, du = ${Q.of(k, 2 * (m + 1)).toLatex()}\\left(${u1}^{${m + 1}} - ${u0}^{${m + 1}}\\right) = ${value.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "definite-integrals-giving-logarithms",
      title: t("Definite integrals giving logarithms", "结果为对数的定积分"),
      explanation: t(
        "When you substitute in a definite integral, change the limits to values of the new variable too, so you never need to substitute back. With $u = x^{2} + c$ and $du = 2x \\, dx$,\n\n$$\\int_{a}^{b} \\frac{x}{x^{2} + c} \\, dx = \\frac{1}{2}\\int_{a^{2} + c}^{b^{2} + c} \\frac{1}{u} \\, du = \\frac{1}{2}\\ln\\frac{b^{2} + c}{a^{2} + c}$$\n\nfor $c > 0$, using $\\ln p - \\ln q = \\ln\\frac{p}{q}$.",
        "在定积分中换元时，把上下限也换成新变量的值，这样就不必再代回原变量。令 $u = x^{2} + c$，$du = 2x \\, dx$，当 $c > 0$ 时\n\n$$\\int_{a}^{b} \\frac{x}{x^{2} + c} \\, dx = \\frac{1}{2}\\int_{a^{2} + c}^{b^{2} + c} \\frac{1}{u} \\, du = \\frac{1}{2}\\ln\\frac{b^{2} + c}{a^{2} + c}$$\n\n这里用到 $\\ln p - \\ln q = \\ln\\frac{p}{q}$。",
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
        return exactValue(
          `\\int_{${x0}}^{${x1}} ${fracWith(k, "x", poly([1, "x^{2}"], [c, ""]))} \\, dx`,
          answer,
          [`${coef(Q.of(k))}${ln(r)}`, `${coef(Q.of(k, 2))}\\ln ${u1}`, `${coef(Q.of(k, 2))}\\ln ${u1 - u0}`],
          `Let $u = x^{2} + ${c}$, so $x \\, dx = \\frac{1}{2} \\, du$; $u$ runs from $${u0}$ to $${u1}$. The integral is $${Q.of(k, 2).toLatex()}\\left(\\ln ${u1} - \\ln ${u0}\\right) = ${answer}$.`,
          `令 $u = x^{2} + ${c}$，则 $x \\, dx = \\frac{1}{2} \\, du$；$u$ 从 $${u0}$ 变到 $${u1}$。积分等于 $${Q.of(k, 2).toLatex()}\\left(\\ln ${u1} - \\ln ${u0}\\right) = ${answer}$。`,
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
  knowledgePoints: [
    {
      id: "rewriting-x-in-terms-of-u",
      title: t("Rewriting x in terms of u", "把 x 写成 u 的式子"),
      explanation: t(
        "If a factor of the original variable remains after substituting, solve the substitution for that variable and replace it, so everything is written in the new variable. When a factor of $x$ is left over, express it through $u$ as well. For $\\int x(x + 2)^{4} \\, dx$, let $u = x + 2$, so $x = u - 2$:\n\n$$\\int (u - 2)u^{4} \\, du = \\int (u^{5} - 2u^{4}) \\, du = \\frac{(x + 2)^{6}}{6} - \\frac{2(x + 2)^{5}}{5} + C.$$",
        "如果换元后还剩下原变量的因子，就从换元式中解出原变量并代入，使所有部分都用新变量表示。当剩下一个因子 $x$ 时，也要用 $u$ 表示它。对 $\\int x(x + 2)^{4} \\, dx$，令 $u = x + 2$，则 $x = u - 2$：\n\n$$\\int (u - 2)u^{4} \\, du = \\int (u^{5} - 2u^{4}) \\, du = \\frac{(x + 2)^{6}}{6} - \\frac{2(x + 2)^{5}}{5} + C$$",
      ),
      generate(rng) {
        const b = rng.nonZero(-6, 6);
        const m = rng.int(2, 5);
        const k = rng.nonZero(-4, 4);
        const inner = linear(1, b);
        const answer = plusC([Q.of(k, m + 2), `(${inner})^{${m + 2}}`], [Q.of(-k * b, m + 1), `(${inner})^{${m + 1}}`]);
        return integral(
          `${poly([k, "x"])}(${inner})^{${m}}`,
          answer,
          [
            plusC([Q.of(k, 2 * (m + 1)), `x^{2}(${inner})^{${m + 1}}`]),
            plusC([Q.of(k, m + 2), `(${inner})^{${m + 2}}`]),
            plusC([Q.of(k, m + 2), `(${inner})^{${m + 2}}`], [Q.of(k * b, m + 1), `(${inner})^{${m + 1}}`]),
          ],
          `Let $u = ${inner}$, so $x = ${linear(1, -b, "u")}$ and $du = dx$. Then $${coef(Q.of(k))}\\int (${linear(1, -b, "u")})u^{${m}} \\, du = ${coef(Q.of(k))}\\int \\left(${poly([1, `u^{${m + 1}}`], [-b, `u^{${m}}`])}\\right) du$, which gives $${answer}$.`,
          `令 $u = ${inner}$，则 $x = ${linear(1, -b, "u")}$，$du = dx$。于是 $${coef(Q.of(k))}\\int (${linear(1, -b, "u")})u^{${m}} \\, du = ${coef(Q.of(k))}\\int \\left(${poly([1, `u^{${m + 1}}`], [-b, `u^{${m}}`])}\\right) du$，得 $${answer}$。`,
        );
      },
    },
    {
      id: "rewriting-x-under-a-root",
      title: t("Rewriting x under a root", "根式中的 x 的改写"),
      explanation: t(
        "Substituting the expression under the root makes the root a simple power, and the leftover variable is rewritten from the substitution before splitting into powers. The same idea works with roots. For $\\int \\frac{x}{\\sqrt{x + 1}} \\, dx$, let $u = x + 1$, so $x = u - 1$:\n\n$$\\int \\frac{u - 1}{\\sqrt{u}} \\, du = \\int \\left(u^{\\frac{1}{2}} - u^{-\\frac{1}{2}}\\right) du = \\frac{2}{3}(x + 1)^{\\frac{3}{2}} - 2\\sqrt{x + 1} + C.$$",
        "把根号下的式子换元后，根式变成简单的幂，剩下的变量也用换元式改写，再拆成几个幂。根式同理。对 $\\int \\frac{x}{\\sqrt{x + 1}} \\, dx$，令 $u = x + 1$，则 $x = u - 1$：\n\n$$\\int \\frac{u - 1}{\\sqrt{u}} \\, du = \\int \\left(u^{\\frac{1}{2}} - u^{-\\frac{1}{2}}\\right) du = \\frac{2}{3}(x + 1)^{\\frac{3}{2}} - 2\\sqrt{x + 1} + C$$",
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
        return integral(
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
          `Let $u = ${inner}$, so $x = ${linear(1, -b, "u")}$. The integrand becomes $${coef(Q.of(k))}\\left(${poly([1, `u^{${e2.toLatex()}}`], [-b, `u^{${m.toLatex()}}`])}\\right)$; integrating term by term gives $${answer}$.`,
          `令 $u = ${inner}$，则 $x = ${linear(1, -b, "u")}$。被积函数变为 $${coef(Q.of(k))}\\left(${poly([1, `u^{${e2.toLatex()}}`], [-b, `u^{${m.toLatex()}}`])}\\right)$，逐项积分得 $${answer}$。`,
        );
      },
    },
  ],
};

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
  knowledgePoints: [
    {
      id: "exponentials-with-linear-exponents",
      title: t("Exponentials with linear exponents", "指数为一次式的指数函数"),
      explanation: t(
        "A linear exponent changes only the scale, so the antiderivative is the same exponential divided by the coefficient of the variable. With $u = ax + b$ and $dx = \\frac{1}{a} \\, du$,\n\n$$\\int e^{ax + b} \\, dx = \\frac{1}{a}e^{ax + b} + C, \\qquad \\int c^{ax + b} \\, dx = \\frac{c^{ax + b}}{a\\ln c} + C.$$\n\nRewrite a reciprocal first: $\\frac{1}{e^{2x}} = e^{-2x}$.",
        "一次式指数只改变缩放比例，所以原函数是同一个指数式再除以变量的系数。令 $u = ax + b$，$dx = \\frac{1}{a} \\, du$：\n\n$$\\int e^{ax + b} \\, dx = \\frac{1}{a}e^{ax + b} + C, \\qquad \\int c^{ax + b} \\, dx = \\frac{c^{ax + b}}{a\\ln c} + C$$\n\n倒数先改写：$\\frac{1}{e^{2x}} = e^{-2x}$。",
      ),
      generate(rng) {
        const a = rng.pick([2, 3, 4, 5]);
        const b = rng.int(-5, 5);
        const k = rng.nonZero(-9, 9);
        if (rng.bool()) {
          const e = `e^{${linear(-a, -b)}}`;
          const answer = plusC([Q.of(-k, a), e]);
          return integral(
            quotient(k, `e^{${linear(a, b)}}`),
            answer,
            [plusC([Q.of(k, a), e]), plusC([Q.of(k, a), `e^{${linear(a, b)}}`]), plusC([-k * a, e])],
            `Write the integrand as $${coef(Q.of(k))}${e}$. With $u = ${linear(-a, -b)}$ and $dx = -\\frac{1}{${a}} \\, du$, the integral is $${answer}$.`,
            `把被积函数写成 $${coef(Q.of(k))}${e}$。令 $u = ${linear(-a, -b)}$，$dx = -\\frac{1}{${a}} \\, du$，积分为 $${answer}$。`,
          );
        }
        const c = rng.pick([2, 3, 5, 10]);
        const p = `${c}^{${linear(a, b)}}`;
        const over = (q: Q) =>
          `${q.sign() < 0 ? "-" : ""}\\frac{${q.n === 1n || q.n === -1n ? "" : `${q.abs().n} \\cdot `}${p}}{${q.d === 1n ? "" : q.d}\\ln ${c}}`;
        const times = (q: Q, tail: string) => `${q.eq(Q.one) ? "" : q.eq(Q.one.neg()) ? "-" : `${q.toLatex()} \\cdot `}${p}${tail}`;
        const answer = `${over(Q.of(k, a))} + C`;
        return integral(
          times(Q.of(k), ""),
          answer,
          [`${over(Q.of(k))} + C`, `${times(Q.of(k, a), `\\ln ${c}`)} + C`, `${times(Q.of(k, a), "")} + C`],
          `With $u = ${linear(a, b)}$ and $dx = \\frac{1}{${a}} \\, du$: $${coef(Q.of(k, a))}\\int ${c}^{u} \\, du = ${Q.of(k, a).toLatex()} \\cdot \\frac{${c}^{u}}{\\ln ${c}} + C$, that is, $${answer}$.`,
          `令 $u = ${linear(a, b)}$，$dx = \\frac{1}{${a}} \\, du$：$${coef(Q.of(k, a))}\\int ${c}^{u} \\, du = ${Q.of(k, a).toLatex()} \\cdot \\frac{${c}^{u}}{\\ln ${c}} + C$，即 $${answer}$。`,
        );
      },
    },
    {
      id: "definite-integrals-of-exponentials",
      title: t("Definite integrals of exponentials", "指数函数的定积分"),
      explanation: t(
        "After finding the antiderivative, evaluate it at the upper and lower limits and subtract, simplifying with the rule that any base to the power zero is one. Find the antiderivative and evaluate it at the limits: $\\int_{0}^{1} e^{2x} \\, dx = \\left[\\frac{1}{2}e^{2x}\\right]_{0}^{1} = \\frac{1}{2}\\left(e^{2} - 1\\right)$, since $e^{0} = 1$.",
        "求出原函数后，在上下限处分别求值并相减，再利用任何底数的零次幂都等于 1 来化简。求出原函数，再代入上下限：$\\int_{0}^{1} e^{2x} \\, dx = \\left[\\frac{1}{2}e^{2x}\\right]_{0}^{1} = \\frac{1}{2}\\left(e^{2} - 1\\right)$，因为 $e^{0} = 1$。",
      ),
      generate(rng) {
        const a = rng.pick([2, 3, 4, -1, -2, -3]);
        const x0 = rng.int(0, 1);
        const x1 = rng.int(x0 + 1, 3);
        const k = rng.nonZero(-6, 6);
        const ex = (n: number) => (n === 0 ? "1" : n === 1 ? "e" : `e^{${n}}`);
        const diff = `\\left(${ex(a * x1)} - ${ex(a * x0)}\\right)`;
        const answer = `${coef(Q.of(k, a))}${diff}`;
        return exactValue(
          `\\int_{${x0}}^{${x1}} ${coef(Q.of(k))}e^{${poly([a, "x"])}} \\, dx`,
          answer,
          [`${coef(Q.of(k))}${diff}`, `${coef(Q.of(k * a))}${diff}`, `${coef(Q.of(k, a))}${ex(a * x1)}`],
          `An antiderivative is $${Q.of(k, a).toLatex()}e^{${poly([a, "x"])}}$, so the integral is $${Q.of(k, a).toLatex()}\\left(${ex(a * x1)} - ${ex(a * x0)}\\right)$.`,
          `一个原函数是 $${Q.of(k, a).toLatex()}e^{${poly([a, "x"])}}$，所以积分等于 $${Q.of(k, a).toLatex()}\\left(${ex(a * x1)} - ${ex(a * x0)}\\right)$。`,
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
  knowledgePoints: [
    {
      id: "exponentials-of-powers-of-x",
      title: t("Exponentials of powers of x", "以 x 的幂为指数的指数函数"),
      explanation: t(
        "The substitution works because the power of the variable in front is exactly what differentiating the exponent produces, up to a constant. For $\\int x^{n - 1}e^{ax^{n}} \\, dx$, let $u = ax^{n}$, so $du = nax^{n - 1} \\, dx$:\n\n$$\\int x^{n - 1}e^{ax^{n}} \\, dx = \\frac{1}{na}e^{ax^{n}} + C.$$\n\nFor example, $\\int xe^{x^{2}} \\, dx = \\frac{1}{2}e^{x^{2}} + C$. Without the factor $x^{n - 1}$ the substitution does not work.",
        "这个换元之所以可行，是因为前面那个变量的幂恰好是指数求导后得到的式子，只差一个常数。对 $\\int x^{n - 1}e^{ax^{n}} \\, dx$，令 $u = ax^{n}$，则 $du = nax^{n - 1} \\, dx$：\n\n$$\\int x^{n - 1}e^{ax^{n}} \\, dx = \\frac{1}{na}e^{ax^{n}} + C$$\n\n例如 $\\int xe^{x^{2}} \\, dx = \\frac{1}{2}e^{x^{2}} + C$。若没有因子 $x^{n - 1}$，这个代换就行不通。",
      ),
      generate(rng) {
        const n = rng.int(2, 3);
        const a = rng.pick([1, 2, 3, -1, -2, -3]);
        const k = rng.nonZero(-9, 9);
        const e = `e^{${poly([a, `x^{${n}}`])}}`;
        const answer = plusC([Q.of(k, n * a), e]);
        return integral(
          `${poly([k, xPow(n - 1)])}${e}`,
          answer,
          [plusC([Q.of(k, a), e]), plusC([k * n * a, e]), plusC([Q.of(k, n), `${xPow(n)}${e}`])],
          `Let $u = ${poly([a, `x^{${n}}`])}$, so $du = ${poly([n * a, xPow(n - 1)])} \\, dx$. The integral becomes $${coef(Q.of(k, n * a))}\\int e^{u} \\, du$, which is $${answer}$.`,
          `令 $u = ${poly([a, `x^{${n}}`])}$，则 $du = ${poly([n * a, xPow(n - 1)])} \\, dx$。积分变为 $${coef(Q.of(k, n * a))}\\int e^{u} \\, du$，即 $${answer}$。`,
        );
      },
    },
    {
      id: "substituting-expressions-in-e-to-the-x",
      title: t("Substituting expressions in eˣ", "代换含 eˣ 的式子"),
      explanation: t(
        "Since the exponential is its own derivative, letting the new variable be an expression in the exponential often turns the integrand into something simple. Other substitutions make exponential integrands simple:\n\n- $u = e^{x} + b$: $\\int \\frac{e^{x}}{e^{x} + b} \\, dx = \\ln(e^{x} + b) + C$ for $b > 0$.\n- $u = \\sqrt{x}$, $du = \\frac{1}{2\\sqrt{x}} \\, dx$: $\\int \\frac{e^{\\sqrt{x}}}{\\sqrt{x}} \\, dx = 2e^{\\sqrt{x}} + C$.\n- $u = \\frac{1}{x}$, $du = -\\frac{1}{x^{2}} \\, dx$: $\\int \\frac{e^{\\frac{1}{x}}}{x^{2}} \\, dx = -e^{\\frac{1}{x}} + C$.",
        "由于指数函数的导数是它自己，把新变量设为含指数函数的式子，常常能把被积函数变简单。其他代换也能化简指数型被积函数：\n\n- $u = e^{x} + b$：当 $b > 0$ 时 $\\int \\frac{e^{x}}{e^{x} + b} \\, dx = \\ln(e^{x} + b) + C$。\n- $u = \\sqrt{x}$，$du = \\frac{1}{2\\sqrt{x}} \\, dx$：$\\int \\frac{e^{\\sqrt{x}}}{\\sqrt{x}} \\, dx = 2e^{\\sqrt{x}} + C$。\n- $u = \\frac{1}{x}$，$du = -\\frac{1}{x^{2}} \\, dx$：$\\int \\frac{e^{\\frac{1}{x}}}{x^{2}} \\, dx = -e^{\\frac{1}{x}} + C$。",
      ),
      generate(rng) {
        const k = rng.nonZero(-9, 9);
        const b = rng.int(1, 9);
        const kind = rng.int(0, 3);
        if (kind === 0) {
          const answer = plusC([k, `\\ln(e^{x} + ${b})`]);
          return integral(
            fracWith(k, "e^{x}", `e^{x} + ${b}`),
            answer,
            [plusC([k, `e^{x}\\ln(e^{x} + ${b})`]), plusC([k, `\\ln(${b})`], [k, "x"]), plusC([-k, `(e^{x} + ${b})^{-2}`])],
            `Let $u = e^{x} + ${b}$, so $du = e^{x} \\, dx$. The integral becomes $${coef(Q.of(k))}\\int \\frac{1}{u} \\, du = ${answer}$; no absolute value is needed since $e^{x} + ${b} > 0$.`,
            `令 $u = e^{x} + ${b}$，则 $du = e^{x} \\, dx$。积分变为 $${coef(Q.of(k))}\\int \\frac{1}{u} \\, du = ${answer}$；因为 $e^{x} + ${b} > 0$，不需要绝对值。`,
          );
        }
        if (kind === 1) {
          const m = rng.int(2, 5);
          const answer = plusC([Q.of(k, m + 1), `(e^{x} + ${b})^{${m + 1}}`]);
          return integral(
            `${coef(Q.of(k))}e^{x}(e^{x} + ${b})^{${m}}`,
            answer,
            [
              plusC([Q.of(k, m + 1), `e^{x}(e^{x} + ${b})^{${m + 1}}`]),
              plusC([k, `(e^{x} + ${b})^{${m + 1}}`]),
              plusC([Q.of(k, m), `(e^{x} + ${b})^{${m + 1}}`]),
            ],
            `Let $u = e^{x} + ${b}$, so $du = e^{x} \\, dx$. The integral becomes $${coef(Q.of(k))}\\int u^{${m}} \\, du = ${answer}$.`,
            `令 $u = e^{x} + ${b}$，则 $du = e^{x} \\, dx$。积分变为 $${coef(Q.of(k))}\\int u^{${m}} \\, du = ${answer}$。`,
          );
        }
        if (kind === 2) {
          const answer = plusC([2 * k, "e^{\\sqrt{x}}"]);
          return integral(
            fracWith(k, "e^{\\sqrt{x}}", "\\sqrt{x}"),
            answer,
            [plusC([k, "e^{\\sqrt{x}}"]), plusC([Q.of(k, 2), "e^{\\sqrt{x}}"]), plusC([k, "\\frac{e^{\\sqrt{x}}}{\\sqrt{x}}"])],
            `Let $u = \\sqrt{x}$, so $du = \\frac{1}{2\\sqrt{x}} \\, dx$ and $\\frac{dx}{\\sqrt{x}} = 2 \\, du$. The integral becomes $${2 * k}\\int e^{u} \\, du = ${answer}$.`,
            `令 $u = \\sqrt{x}$，则 $du = \\frac{1}{2\\sqrt{x}} \\, dx$，$\\frac{dx}{\\sqrt{x}} = 2 \\, du$。积分变为 $${2 * k}\\int e^{u} \\, du = ${answer}$。`,
            { en: "$x > 0$", zh: "$x > 0$" },
          );
        }
        const answer = plusC([-k, "e^{\\frac{1}{x}}"]);
        return integral(
          fracWith(k, "e^{\\frac{1}{x}}", "x^{2}"),
          answer,
          [plusC([k, "e^{\\frac{1}{x}}"]), plusC([-k, "x^{-1}e^{\\frac{1}{x}}"]), plusC([k, "x^{2}e^{\\frac{1}{x}}"])],
          `Let $u = \\frac{1}{x}$, so $du = -\\frac{1}{x^{2}} \\, dx$. The integral becomes $${-k}\\int e^{u} \\, du = ${answer}$.`,
          `令 $u = \\frac{1}{x}$，则 $du = -\\frac{1}{x^{2}} \\, dx$。积分变为 $${-k}\\int e^{u} \\, du = ${answer}$。`,
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
  knowledgePoints: [
    {
      id: "trigonometric-functions-of-powers-of-x",
      title: t("Trigonometric functions of powers of x", "以 x 的幂为自变量的三角函数"),
      explanation: t(
        "Let the argument of the trigonometric function be the new variable, and check that the factor in front is its derivative up to a constant. For $\\int x^{n - 1}\\sin(ax^{n}) \\, dx$, let $u = ax^{n}$, so $x^{n - 1} \\, dx = \\frac{1}{na} \\, du$:\n\n$$\\int x^{n - 1}\\sin(ax^{n}) \\, dx = -\\frac{1}{na}\\cos(ax^{n}) + C, \\qquad \\int x^{n - 1}\\cos(ax^{n}) \\, dx = \\frac{1}{na}\\sin(ax^{n}) + C.$$",
        "把三角函数的自变量设为新变量，并检查前面的因子是否是它的导数，最多相差一个常数。对 $\\int x^{n - 1}\\sin(ax^{n}) \\, dx$，令 $u = ax^{n}$，则 $x^{n - 1} \\, dx = \\frac{1}{na} \\, du$：\n\n$$\\int x^{n - 1}\\sin(ax^{n}) \\, dx = -\\frac{1}{na}\\cos(ax^{n}) + C, \\qquad \\int x^{n - 1}\\cos(ax^{n}) \\, dx = \\frac{1}{na}\\sin(ax^{n}) + C$$",
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
        return integral(
          `${poly([k, xPow(n - 1)])}${f}(${u})`,
          answer,
          [plusC([c.neg(), `${F}(${u})`]), plusC([Q.of(sign * k, a), `${F}(${u})`]), plusC([Q.of(sign * k, n), `${xPow(n)}${F}(${u})`])],
          `Let $u = ${u}$, so $${xPow(n - 1)} \\, dx = \\frac{1}{${n * a}} \\, du$. The integral becomes $${coef(Q.of(k, n * a))}\\int ${f} u \\, du$, which is $${answer}$.`,
          `令 $u = ${u}$，则 $${xPow(n - 1)} \\, dx = \\frac{1}{${n * a}} \\, du$。积分变为 $${coef(Q.of(k, n * a))}\\int ${f} u \\, du$，即 $${answer}$。`,
        );
      },
    },
    {
      id: "powers-of-sine-cosine-and-tangent",
      title: t("Powers of sine, cosine and tangent", "正弦、余弦与正切的幂"),
      explanation: t(
        "When one trigonometric function is raised to a power and its derivative multiplies it, substitute the function:\n\n- $u = \\sin x$: $\\int \\sin^{m} x\\cos x \\, dx = \\frac{\\sin^{m + 1} x}{m + 1} + C$.\n- $u = \\cos x$, $du = -\\sin x \\, dx$: $\\int \\cos^{m} x\\sin x \\, dx = -\\frac{\\cos^{m + 1} x}{m + 1} + C$.\n- $u = \\tan x$: $\\int \\tan^{m} x\\sec^{2} x \\, dx = \\frac{\\tan^{m + 1} x}{m + 1} + C$.\n- $u = \\cos x$: $\\int \\tan x \\, dx = \\int \\frac{\\sin x}{\\cos x} \\, dx = -\\ln|\\cos x| + C$.",
        "当一个三角函数的幂乘以它的导数时，代换这个函数：\n\n- $u = \\sin x$：$\\int \\sin^{m} x\\cos x \\, dx = \\frac{\\sin^{m + 1} x}{m + 1} + C$。\n- $u = \\cos x$，$du = -\\sin x \\, dx$：$\\int \\cos^{m} x\\sin x \\, dx = -\\frac{\\cos^{m + 1} x}{m + 1} + C$。\n- $u = \\tan x$：$\\int \\tan^{m} x\\sec^{2} x \\, dx = \\frac{\\tan^{m + 1} x}{m + 1} + C$。\n- $u = \\cos x$：$\\int \\tan x \\, dx = \\int \\frac{\\sin x}{\\cos x} \\, dx = -\\ln|\\cos x| + C$。",
      ),
      generate(rng) {
        const k = rng.nonZero(-9, 9);
        const m = rng.int(2, 6);
        const kind = rng.int(0, 3);
        if (kind === 3) {
          const tan = rng.bool();
          const answer = tan ? plusC([-k, "\\ln|\\cos x|"]) : plusC([k, "\\ln|\\sin x|"]);
          return integral(
            `${coef(Q.of(k))}${tan ? "\\tan" : "\\cot"} x`,
            answer,
            tan
              ? [plusC([k, "\\ln|\\cos x|"]), plusC([k, "\\sec^{2} x"]), plusC([-k, "\\ln|\\sin x|"])]
              : [plusC([-k, "\\ln|\\sin x|"]), plusC([-k, "\\csc^{2} x"]), plusC([k, "\\ln|\\cos x|"])],
            tan
              ? `Write $\\tan x = \\frac{\\sin x}{\\cos x}$ and let $u = \\cos x$, so $\\sin x \\, dx = -du$: $${-k}\\int \\frac{1}{u} \\, du = ${answer}$.`
              : `Write $\\cot x = \\frac{\\cos x}{\\sin x}$ and let $u = \\sin x$, so $\\cos x \\, dx = du$: $${k}\\int \\frac{1}{u} \\, du = ${answer}$.`,
            tan
              ? `写成 $\\tan x = \\frac{\\sin x}{\\cos x}$，令 $u = \\cos x$，则 $\\sin x \\, dx = -du$：$${-k}\\int \\frac{1}{u} \\, du = ${answer}$。`
              : `写成 $\\cot x = \\frac{\\cos x}{\\sin x}$，令 $u = \\sin x$，则 $\\cos x \\, dx = du$：$${k}\\int \\frac{1}{u} \\, du = ${answer}$。`,
          );
        }
        const [f, g, sign, du] = [
          ["\\sin", "\\cos x", 1, "\\cos x \\, dx"],
          ["\\cos", "\\sin x", -1, "-\\sin x \\, dx"],
          ["\\tan", "\\sec^{2} x", 1, "\\sec^{2} x \\, dx"],
        ][kind] as [string, string, number, string];
        const answer = plusC([Q.of(sign * k, m + 1), `${f}^{${m + 1}} x`]);
        return integral(
          `${coef(Q.of(k))}${f}^{${m}} x ${g}`,
          answer,
          [
            plusC([Q.of(-sign * k, m + 1), `${f}^{${m + 1}} x`]),
            plusC([Q.of(sign * k, m), `${f}^{${m + 1}} x`]),
            plusC([Q.of(sign * k, m + 1), `${f}^{${m + 1}} x ${g}`]),
          ],
          `Let $u = ${f} x$, so $du = ${du}$. The integral becomes $${sign * k}\\int u^{${m}} \\, du = ${answer}$.`,
          `令 $u = ${f} x$，则 $du = ${du}$。积分变为 $${sign * k}\\int u^{${m}} \\, du = ${answer}$。`,
        );
      },
    },
  ],
};

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
  knowledgePoints: [
    {
      id: "powers-of-ln-x-over-x",
      title: t("Powers of ln x over x", "ln x 的幂除以 x"),
      explanation: t(
        "One over the variable is the derivative of the natural logarithm, so substituting the logarithm turns the integrand into a simple power. Since $\\frac{d}{dx}\\ln x = \\frac{1}{x}$, the substitution $u = \\ln x$, $du = \\frac{1}{x} \\, dx$ gives\n\n$$\\int \\frac{(\\ln x)^{m}}{x} \\, dx = \\int u^{m} \\, du = \\frac{(\\ln x)^{m + 1}}{m + 1} + C \\quad (m \\ne -1).$$",
        "变量的倒数是自然对数的导数，所以把对数换元后，被积函数就变成简单的幂。由于 $\\frac{d}{dx}\\ln x = \\frac{1}{x}$，代换 $u = \\ln x$，$du = \\frac{1}{x} \\, dx$，得\n\n$$\\int \\frac{(\\ln x)^{m}}{x} \\, dx = \\int u^{m} \\, du = \\frac{(\\ln x)^{m + 1}}{m + 1} + C \\quad (m \\ne -1)$$",
      ),
      generate(rng) {
        const k = rng.nonZero(-9, 9);
        const m = rng.int(1, 5);
        const num = m === 1 ? "\\ln x" : `(\\ln x)^{${m}}`;
        const answer = plusC([Q.of(k, m + 1), `(\\ln x)^{${m + 1}}`]);
        return integral(
          fracWith(k, num, "x"),
          answer,
          [
            plusC([k, `(\\ln x)^{${m + 1}}`]),
            plusC([Q.of(k, m + 1), `\\ln x^{${m + 1}}`]),
            plusC([Q.of(k, m + 1), `x(\\ln x)^{${m + 1}}`]),
          ],
          `Let $u = \\ln x$, so $du = \\frac{1}{x} \\, dx$. The integral becomes $${coef(Q.of(k))}\\int u^{${m}} \\, du = ${answer}$.`,
          `令 $u = \\ln x$，则 $du = \\frac{1}{x} \\, dx$。积分变为 $${coef(Q.of(k))}\\int u^{${m}} \\, du = ${answer}$。`,
          { en: "$x > 0$", zh: "$x > 0$" },
        );
      },
    },
    {
      id: "logarithms-in-the-denominator",
      title: t("Logarithms in the denominator", "分母中的对数"),
      explanation: t(
        "With $u = \\ln x$ the same substitution handles a logarithm in the denominator:\n\n$$\\int \\frac{1}{x\\ln x} \\, dx = \\ln|\\ln x| + C, \\qquad \\int \\frac{1}{x(\\ln x)^{2}} \\, dx = -\\frac{1}{\\ln x} + C.$$\n\nFor $\\int \\frac{1}{x(a + b\\ln x)} \\, dx$ let $u = a + b\\ln x$, so $du = \\frac{b}{x} \\, dx$ and the result is $\\frac{1}{b}\\ln|a + b\\ln x| + C$.",
        "同样令 $u = \\ln x$，可以处理分母中的对数：\n\n$$\\int \\frac{1}{x\\ln x} \\, dx = \\ln|\\ln x| + C, \\qquad \\int \\frac{1}{x(\\ln x)^{2}} \\, dx = -\\frac{1}{\\ln x} + C$$\n\n对 $\\int \\frac{1}{x(a + b\\ln x)} \\, dx$，令 $u = a + b\\ln x$，则 $du = \\frac{b}{x} \\, dx$，结果为 $\\frac{1}{b}\\ln|a + b\\ln x| + C$。",
      ),
      generate(rng) {
        const k = rng.nonZero(-9, 9);
        const kind = rng.int(0, 2);
        const domain = { en: "$x > 0$", zh: "$x > 0$" };
        if (kind === 0) {
          const answer = plusC([k, "\\ln|\\ln x|"]);
          return integral(
            quotient(k, "x\\ln x"),
            answer,
            [plusC([k, "\\ln|x\\ln x|"]), plusC([k, "\\frac{1}{\\ln x}"]), plusC([-k, "\\ln|\\ln x|"])],
            `Let $u = \\ln x$, so $du = \\frac{1}{x} \\, dx$: $${coef(Q.of(k))}\\int \\frac{1}{u} \\, du = ${answer}$.`,
            `令 $u = \\ln x$，则 $du = \\frac{1}{x} \\, dx$：$${coef(Q.of(k))}\\int \\frac{1}{u} \\, du = ${answer}$。`,
            domain,
          );
        }
        if (kind === 1) {
          const n = rng.int(2, 4);
          const lnPow = (e: number) => (e === 1 ? "\\ln x" : `(\\ln x)^{${e}}`);
          const answer = `${quotient(Q.of(-k, n - 1), lnPow(n - 1))} + C`;
          return integral(
            quotient(k, `x(\\ln x)^{${n}}`),
            answer,
            [
              `${quotient(Q.of(k, n - 1), lnPow(n - 1))} + C`,
              `${quotient(Q.of(-k, n + 1), lnPow(n + 1))} + C`,
              plusC([k, `\\ln|(\\ln x)^{${n}}|`]),
            ],
            `Let $u = \\ln x$, so $du = \\frac{1}{x} \\, dx$: $${coef(Q.of(k))}\\int u^{${-n}} \\, du = ${Q.of(k, 1 - n).toLatex()}u^{${1 - n}} + C$, that is, $${answer}$.`,
            `令 $u = \\ln x$，则 $du = \\frac{1}{x} \\, dx$：$${coef(Q.of(k))}\\int u^{${-n}} \\, du = ${Q.of(k, 1 - n).toLatex()}u^{${1 - n}} + C$，即 $${answer}$。`,
            domain,
          );
        }
        const a = rng.nonZero(-5, 5);
        const b = rng.pick([2, 3, 4, 5, -2, -3]);
        const inner = poly([a, ""], [b, "\\ln x"]);
        const answer = plusC([Q.of(k, b), `\\ln|${inner}|`]);
        return integral(
          quotient(k, `x(${inner})`),
          answer,
          [plusC([k, `\\ln|${inner}|`]), plusC([k * b, `\\ln|${inner}|`]), plusC([Q.of(k, a), `\\ln|${inner}|`])],
          `Let $u = ${inner}$, so $du = \\frac{${b}}{x} \\, dx$: $${coef(Q.of(k, b))}\\int \\frac{1}{u} \\, du = ${answer}$.`,
          `令 $u = ${inner}$，则 $du = \\frac{${b}}{x} \\, dx$：$${coef(Q.of(k, b))}\\int \\frac{1}{u} \\, du = ${answer}$。`,
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
  knowledgePoints: [
    {
      id: "scaled-arcsine-and-arctangent-integrals",
      title: t("Scaled arcsine and arctangent integrals", "带系数的反正弦与反正切积分"),
      explanation: t(
        "When the square has a coefficient, substitute to remove it, which introduces an extra factor of one over that coefficient in the answer. With $u = cx$ and $dx = \\frac{1}{c} \\, du$,\n\n$$\\int \\frac{1}{a^{2} + c^{2}x^{2}} \\, dx = \\frac{1}{ac}\\arctan\\frac{cx}{a} + C, \\qquad \\int \\frac{1}{\\sqrt{a^{2} - c^{2}x^{2}}} \\, dx = \\frac{1}{c}\\arcsin\\frac{cx}{a} + C.$$\n\nFor example, $\\int \\frac{1}{4 + 9x^{2}} \\, dx = \\frac{1}{6}\\arctan\\frac{3x}{2} + C$.",
        "当平方项有系数时，用换元去掉它，答案中会多出一个该系数的倒数因子。令 $u = cx$，$dx = \\frac{1}{c} \\, du$：\n\n$$\\int \\frac{1}{a^{2} + c^{2}x^{2}} \\, dx = \\frac{1}{ac}\\arctan\\frac{cx}{a} + C, \\qquad \\int \\frac{1}{\\sqrt{a^{2} - c^{2}x^{2}}} \\, dx = \\frac{1}{c}\\arcsin\\frac{cx}{a} + C$$\n\n例如 $\\int \\frac{1}{4 + 9x^{2}} \\, dx = \\frac{1}{6}\\arctan\\frac{3x}{2} + C$。",
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
          return integral(
            quotient(k, squared(a, c, "+")),
            answer,
            [
              `${coef(Q.of(k, c))}\\arctan\\left(${arg}\\right) + C`,
              `${coef(Q.of(k, a))}\\arctan\\left(${arg}\\right) + C`,
              `${coef(Q.of(k, a * c))}\\arctan\\left(${ratio(a, c)}\\right) + C`,
            ],
            `Let $u = ${poly([c, "x"])}$, so $dx = \\frac{1}{${c}} \\, du$ and the integral is $${coef(Q.of(k, c))}\\int \\frac{1}{${a * a} + u^{2}} \\, du = ${Q.of(k, c).toLatex()} \\cdot \\frac{1}{${a}}\\arctan\\frac{u}{${a}} + C$, that is, $${answer}$.`,
            `令 $u = ${poly([c, "x"])}$，则 $dx = \\frac{1}{${c}} \\, du$，积分为 $${coef(Q.of(k, c))}\\int \\frac{1}{${a * a} + u^{2}} \\, du = ${Q.of(k, c).toLatex()} \\cdot \\frac{1}{${a}}\\arctan\\frac{u}{${a}} + C$，即 $${answer}$。`,
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
        return integral(
          quotient(k, `\\sqrt{${squared(a, c, "-")}}`),
          answer,
          [
            `${coef(Q.of(k))}\\arcsin\\left(${arg}\\right) + C`,
            `${coef(Q.of(k, a * c))}\\arcsin\\left(${arg}\\right) + C`,
            `${coef(Q.of(k, c))}\\arcsin\\left(${poly([c, "x"])}\\right) + C`,
          ],
          `Let $u = ${poly([c, "x"])}$, so $dx = \\frac{1}{${c}} \\, du$ and the integral is $${coef(Q.of(k, c))}\\int \\frac{1}{\\sqrt{${a * a} - u^{2}}} \\, du = ${Q.of(k, c).toLatex()}\\arcsin\\frac{u}{${a}} + C$, that is, $${answer}$.`,
          `令 $u = ${poly([c, "x"])}$，则 $dx = \\frac{1}{${c}} \\, du$，积分为 $${coef(Q.of(k, c))}\\int \\frac{1}{\\sqrt{${a * a} - u^{2}}} \\, du = ${Q.of(k, c).toLatex()}\\arcsin\\frac{u}{${a}} + C$，即 $${answer}$。`,
          { en: `$|x| < ${Q.of(a, c).toLatex()}$`, zh: `$|x| < ${Q.of(a, c).toLatex()}$` },
        );
      },
    },
    {
      id: "substitutions-leading-to-inverse-trigonometric-functions",
      title: t("Substitutions leading to inverse trigonometric functions", "化为反三角函数的代换"),
      explanation: t(
        "Look for a square hidden inside the integrand, such as a fourth power or a square of an exponential, whose derivative also appears as a factor. Sometimes $u^{2}$ is hidden in the integrand:\n\n- $u = x^{2}$: $\\int \\frac{x}{x^{4} + a^{2}} \\, dx = \\frac{1}{2a}\\arctan\\frac{x^{2}}{a} + C$.\n- $u = e^{x}$: $\\int \\frac{e^{x}}{1 + e^{2x}} \\, dx = \\arctan(e^{x}) + C$.\n- $u = \\sin x$: $\\int \\frac{\\cos x}{1 + \\sin^{2} x} \\, dx = \\arctan(\\sin x) + C$.\n- $u = \\ln x$: $\\int \\frac{1}{x(1 + (\\ln x)^{2})} \\, dx = \\arctan(\\ln x) + C$.",
        "寻找被积函数中隐藏的平方，例如四次方或指数式的平方，同时它的导数也作为因子出现。有时 $u^{2}$ 隐藏在被积函数中：\n\n- $u = x^{2}$：$\\int \\frac{x}{x^{4} + a^{2}} \\, dx = \\frac{1}{2a}\\arctan\\frac{x^{2}}{a} + C$。\n- $u = e^{x}$：$\\int \\frac{e^{x}}{1 + e^{2x}} \\, dx = \\arctan(e^{x}) + C$。\n- $u = \\sin x$：$\\int \\frac{\\cos x}{1 + \\sin^{2} x} \\, dx = \\arctan(\\sin x) + C$。\n- $u = \\ln x$：$\\int \\frac{1}{x(1 + (\\ln x)^{2})} \\, dx = \\arctan(\\ln x) + C$。",
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
          return integral(
            `${sign}\\frac{${kk}x}{x^{4} + ${a * a}}`,
            answer,
            [
              `${coef(Q.of(k, a))}\\arctan\\left(${arg}\\right) + C`,
              `${coef(Q.of(k, 2))}\\arctan\\left(${arg}\\right) + C`,
              `${coef(Q.of(k, 2 * a))}\\arctan\\left(${a === 1 ? "x" : `\\frac{x}{${a}}`}\\right) + C`,
            ],
            `Let $u = x^{2}$, so $x \\, dx = \\frac{1}{2} \\, du$: $${coef(Q.of(k, 2))}\\int \\frac{1}{u^{2} + ${a * a}} \\, du = ${Q.of(k, 2).toLatex()} \\cdot \\frac{1}{${a}}\\arctan\\frac{u}{${a}} + C$, that is, $${answer}$.`,
            `令 $u = x^{2}$，则 $x \\, dx = \\frac{1}{2} \\, du$：$${coef(Q.of(k, 2))}\\int \\frac{1}{u^{2} + ${a * a}} \\, du = ${Q.of(k, 2).toLatex()} \\cdot \\frac{1}{${a}}\\arctan\\frac{u}{${a}} + C$，即 $${answer}$。`,
          );
        }
        const [integrand, u, du, domain] = [
          [`${sign}\\frac{${kk}e^{x}}{1 + e^{2x}}`, "e^{x}", "e^{x} \\, dx", undefined],
          [`${sign}\\frac{${kk}\\cos x}{1 + \\sin^{2} x}`, "\\sin x", "\\cos x \\, dx", undefined],
          [quotient(k, "x(1 + (\\ln x)^{2})"), "\\ln x", "\\frac{1}{x} \\, dx", { en: "$x > 0$", zh: "$x > 0$" }],
        ][kind - 1] as [string, string, string, Domain | undefined];
        const answer = `${coef(Q.of(k))}\\arctan(${u}) + C`;
        return integral(
          integrand,
          answer,
          [
            `${coef(Q.of(k))}\\arcsin(${u}) + C`,
            `${coef(Q.of(k))}\\ln(1 + ${{ "e^{x}": "e^{2x}", "\\sin x": "\\sin^{2} x", "\\ln x": "(\\ln x)^{2}" }[u]}) + C`,
            `${coef(Q.of(-k))}\\arctan(${u}) + C`,
          ],
          `Let $u = ${u}$, so $du = ${du}$: $${coef(Q.of(k))}\\int \\frac{1}{1 + u^{2}} \\, du = ${answer}$.`,
          `令 $u = ${u}$，则 $du = ${du}$：$${coef(Q.of(k))}\\int \\frac{1}{1 + u^{2}} \\, du = ${answer}$。`,
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
  knowledgePoints: [
    {
      id: "hyperbolic-functions-of-powers-of-x",
      title: t("Hyperbolic functions of powers of x", "以 x 的幂为自变量的双曲函数"),
      explanation: t(
        "This works just like the trigonometric case, except that integrating hyperbolic sine and cosine involves no change of sign. With $u = ax^{n}$ and $x^{n - 1} \\, dx = \\frac{1}{na} \\, du$,\n\n$$\\int x^{n - 1}\\sinh(ax^{n}) \\, dx = \\frac{1}{na}\\cosh(ax^{n}) + C, \\qquad \\int x^{n - 1}\\cosh(ax^{n}) \\, dx = \\frac{1}{na}\\sinh(ax^{n}) + C.$$\n\nUnlike the trigonometric case, there is no minus sign.",
        "这与三角函数的情形完全一样，只是对双曲正弦和双曲余弦积分时不需要改变符号。令 $u = ax^{n}$，$x^{n - 1} \\, dx = \\frac{1}{na} \\, du$：\n\n$$\\int x^{n - 1}\\sinh(ax^{n}) \\, dx = \\frac{1}{na}\\cosh(ax^{n}) + C, \\qquad \\int x^{n - 1}\\cosh(ax^{n}) \\, dx = \\frac{1}{na}\\sinh(ax^{n}) + C$$\n\n与三角函数不同，这里没有负号。",
      ),
      generate(rng) {
        const n = rng.int(2, 3);
        const a = rng.int(1, 3);
        const k = rng.nonZero(-9, 9);
        const u = poly([a, `x^{${n}}`]);
        const [f, F] = rng.bool() ? ["\\sinh", "\\cosh"] : ["\\cosh", "\\sinh"];
        const c = Q.of(k, n * a);
        const answer = plusC([c, `${F}(${u})`]);
        return integral(
          `${poly([k, xPow(n - 1)])}${f}(${u})`,
          answer,
          [plusC([c.neg(), `${F}(${u})`]), plusC([Q.of(k, a), `${F}(${u})`]), plusC([Q.of(k, n), `${xPow(n)}${F}(${u})`])],
          `Let $u = ${u}$, so $${xPow(n - 1)} \\, dx = \\frac{1}{${n * a}} \\, du$. The integral becomes $${coef(c)}\\int ${f} u \\, du$, which is $${answer}$.`,
          `令 $u = ${u}$，则 $${xPow(n - 1)} \\, dx = \\frac{1}{${n * a}} \\, du$。积分变为 $${coef(c)}\\int ${f} u \\, du$，即 $${answer}$。`,
        );
      },
    },
    {
      id: "powers-of-hyperbolic-functions",
      title: t("Powers of hyperbolic functions", "双曲函数的幂"),
      explanation: t(
        "Choose the new variable so that its derivative is the other factor in the integrand, which turns the power of a hyperbolic function into a simple power. Since $\\frac{d}{dx}\\sinh x = \\cosh x$, $\\frac{d}{dx}\\cosh x = \\sinh x$ and $\\frac{d}{dx}\\tanh x = \\operatorname{sech}^{2} x$:\n\n- $\\int \\sinh^{m} x\\cosh x \\, dx = \\frac{\\sinh^{m + 1} x}{m + 1} + C$ and $\\int \\cosh^{m} x\\sinh x \\, dx = \\frac{\\cosh^{m + 1} x}{m + 1} + C$.\n- $\\int \\tanh^{m} x\\operatorname{sech}^{2} x \\, dx = \\frac{\\tanh^{m + 1} x}{m + 1} + C$.\n- With $u = \\cosh x$: $\\int \\tanh x \\, dx = \\ln(\\cosh x) + C$; with $u = \\sinh x$: $\\int \\coth x \\, dx = \\ln|\\sinh x| + C$.",
        "选择新变量，使它的导数正好是被积函数中的另一个因子，这样双曲函数的幂就变成了简单的幂。由于 $\\frac{d}{dx}\\sinh x = \\cosh x$，$\\frac{d}{dx}\\cosh x = \\sinh x$，$\\frac{d}{dx}\\tanh x = \\operatorname{sech}^{2} x$：\n\n- $\\int \\sinh^{m} x\\cosh x \\, dx = \\frac{\\sinh^{m + 1} x}{m + 1} + C$，$\\int \\cosh^{m} x\\sinh x \\, dx = \\frac{\\cosh^{m + 1} x}{m + 1} + C$。\n- $\\int \\tanh^{m} x\\operatorname{sech}^{2} x \\, dx = \\frac{\\tanh^{m + 1} x}{m + 1} + C$。\n- 令 $u = \\cosh x$：$\\int \\tanh x \\, dx = \\ln(\\cosh x) + C$；令 $u = \\sinh x$：$\\int \\coth x \\, dx = \\ln|\\sinh x| + C$。",
      ),
      generate(rng) {
        const k = rng.nonZero(-9, 9);
        const m = rng.int(2, 6);
        const kind = rng.int(0, 3);
        if (kind === 3) {
          const tanh = rng.bool();
          const answer = tanh ? plusC([k, "\\ln(\\cosh x)"]) : plusC([k, "\\ln|\\sinh x|"]);
          return integral(
            `${coef(Q.of(k))}${tanh ? "\\tanh" : "\\coth"} x`,
            answer,
            tanh
              ? [plusC([-k, "\\ln(\\cosh x)"]), plusC([k, "\\operatorname{sech}^{2} x"]), plusC([k, "\\ln|\\sinh x|"])]
              : [plusC([-k, "\\ln|\\sinh x|"]), plusC([-k, "\\operatorname{csch}^{2} x"]), plusC([k, "\\ln(\\cosh x)"])],
            tanh
              ? `Write $\\tanh x = \\frac{\\sinh x}{\\cosh x}$ and let $u = \\cosh x$, so $du = \\sinh x \\, dx$: $${coef(Q.of(k))}\\int \\frac{1}{u} \\, du = ${answer}$, with no absolute value since $\\cosh x > 0$.`
              : `Write $\\coth x = \\frac{\\cosh x}{\\sinh x}$ and let $u = \\sinh x$, so $du = \\cosh x \\, dx$: $${coef(Q.of(k))}\\int \\frac{1}{u} \\, du = ${answer}$.`,
            tanh
              ? `写成 $\\tanh x = \\frac{\\sinh x}{\\cosh x}$，令 $u = \\cosh x$，则 $du = \\sinh x \\, dx$：$${coef(Q.of(k))}\\int \\frac{1}{u} \\, du = ${answer}$；因为 $\\cosh x > 0$，不需要绝对值。`
              : `写成 $\\coth x = \\frac{\\cosh x}{\\sinh x}$，令 $u = \\sinh x$，则 $du = \\cosh x \\, dx$：$${coef(Q.of(k))}\\int \\frac{1}{u} \\, du = ${answer}$。`,
          );
        }
        const [f, g] = [
          ["\\sinh", "\\cosh x"],
          ["\\cosh", "\\sinh x"],
          ["\\tanh", "\\operatorname{sech}^{2} x"],
        ][kind] as [string, string];
        const answer = plusC([Q.of(k, m + 1), `${f}^{${m + 1}} x`]);
        return integral(
          `${coef(Q.of(k))}${f}^{${m}} x ${g}`,
          answer,
          [
            plusC([Q.of(-k, m + 1), `${f}^{${m + 1}} x`]),
            plusC([Q.of(k, m), `${f}^{${m + 1}} x`]),
            plusC([Q.of(k, m + 1), `${f}^{${m + 1}} x ${g}`]),
          ],
          `Let $u = ${f} x$, so $du = ${g} \\, dx$. The integral becomes $${coef(Q.of(k))}\\int u^{${m}} \\, du = ${answer}$.`,
          `令 $u = ${f} x$，则 $du = ${g} \\, dx$。积分变为 $${coef(Q.of(k))}\\int u^{${m}} \\, du = ${answer}$。`,
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
  knowledgePoints: [
    {
      id: "scaled-inverse-hyperbolic-integrals",
      title: t("Scaled inverse hyperbolic integrals", "带系数的反双曲函数积分"),
      explanation: t(
        "Substitute to remove the coefficient of the square, then use the standard inverse hyperbolic integral and keep the factor that the substitution introduces. With $u = cx$ and $dx = \\frac{1}{c} \\, du$:\n\n$$\\int \\frac{dx}{\\sqrt{c^{2}x^{2} + a^{2}}} = \\frac{1}{c}\\operatorname{arsinh}\\frac{cx}{a} + C, \\qquad \\int \\frac{dx}{\\sqrt{c^{2}x^{2} - a^{2}}} = \\frac{1}{c}\\operatorname{arcosh}\\frac{cx}{a} + C \\ \\left(x > \\frac{a}{c}\\right),$$\n\n$$\\int \\frac{dx}{a^{2} - c^{2}x^{2}} = \\frac{1}{ac}\\operatorname{artanh}\\frac{cx}{a} + C \\ \\left(|x| < \\frac{a}{c}\\right).$$",
        "通过换元去掉平方项的系数，再用标准的反双曲函数积分，并保留换元带来的因子。令 $u = cx$，$dx = \\frac{1}{c} \\, du$：\n\n$$\\int \\frac{dx}{\\sqrt{c^{2}x^{2} + a^{2}}} = \\frac{1}{c}\\operatorname{arsinh}\\frac{cx}{a} + C, \\qquad \\int \\frac{dx}{\\sqrt{c^{2}x^{2} - a^{2}}} = \\frac{1}{c}\\operatorname{arcosh}\\frac{cx}{a} + C \\ \\left(x > \\frac{a}{c}\\right),$$\n\n$$\\int \\frac{dx}{a^{2} - c^{2}x^{2}} = \\frac{1}{ac}\\operatorname{artanh}\\frac{cx}{a} + C \\ \\left(|x| < \\frac{a}{c}\\right)$$",
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
          return integral(
            quotient(k, `\\sqrt{${squared(a, c, "+", true)}}`),
            answer,
            [
              `${coef(Q.of(k))}\\operatorname{arsinh}\\left(${arg}\\right) + C`,
              `${coef(Q.of(k, a * c))}\\operatorname{arsinh}\\left(${arg}\\right) + C`,
              `${coef(Q.of(k, c))}\\arcsin\\left(${arg}\\right) + C`,
            ],
            `Let $u = ${poly([c, "x"])}$, so $dx = \\frac{1}{${c}} \\, du$ and the integral is $${coef(Q.of(k, c))}\\int \\frac{du}{\\sqrt{u^{2} + ${a * a}}} = ${answer}$.`,
            `令 $u = ${poly([c, "x"])}$，则 $dx = \\frac{1}{${c}} \\, du$，积分为 $${coef(Q.of(k, c))}\\int \\frac{du}{\\sqrt{u^{2} + ${a * a}}} = ${answer}$。`,
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
          return integral(
            quotient(k, `\\sqrt{${squared(a, c, "-", true)}}`),
            answer,
            [
              `${coef(Q.of(k))}\\operatorname{arcosh}\\left(${arg}\\right) + C`,
              `${coef(Q.of(k, a * c))}\\operatorname{arcosh}\\left(${arg}\\right) + C`,
              `${coef(Q.of(k, c))}\\operatorname{arsinh}\\left(${arg}\\right) + C`,
            ],
            `Let $u = ${poly([c, "x"])}$, so $dx = \\frac{1}{${c}} \\, du$ and the integral is $${coef(Q.of(k, c))}\\int \\frac{du}{\\sqrt{u^{2} - ${a * a}}} = ${answer}$.`,
            `令 $u = ${poly([c, "x"])}$，则 $dx = \\frac{1}{${c}} \\, du$，积分为 $${coef(Q.of(k, c))}\\int \\frac{du}{\\sqrt{u^{2} - ${a * a}}} = ${answer}$。`,
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
        return integral(
          quotient(k, squared(a, c, "-")),
          answer,
          [
            `${coef(Q.of(k, c))}\\operatorname{artanh}\\left(${arg}\\right) + C`,
            `${coef(Q.of(k, a))}\\operatorname{artanh}\\left(${arg}\\right) + C`,
            `${coef(Q.of(k, a * c))}\\arctan\\left(${arg}\\right) + C`,
          ],
          `Let $u = ${poly([c, "x"])}$, so $dx = \\frac{1}{${c}} \\, du$ and the integral is $${coef(Q.of(k, c))}\\int \\frac{du}{${a * a} - u^{2}} = ${Q.of(k, c).toLatex()} \\cdot \\frac{1}{${a}}\\operatorname{artanh}\\frac{u}{${a}} + C$, that is, $${answer}$.`,
          `令 $u = ${poly([c, "x"])}$，则 $dx = \\frac{1}{${c}} \\, du$，积分为 $${coef(Q.of(k, c))}\\int \\frac{du}{${a * a} - u^{2}} = ${Q.of(k, c).toLatex()} \\cdot \\frac{1}{${a}}\\operatorname{artanh}\\frac{u}{${a}} + C$，即 $${answer}$。`,
          { en: `$|x| < ${Q.of(a, c).toLatex()}$`, zh: `$|x| < ${Q.of(a, c).toLatex()}$` },
        );
      },
    },
    {
      id: "substitutions-leading-to-inverse-hyperbolic-functions",
      title: t("Substitutions leading to inverse hyperbolic functions", "化为反双曲函数的代换"),
      explanation: t(
        "As with the inverse trigonometric integrals, a hidden square and its derivative in the integrand point to the right substitution. As with arctangent, $u^{2}$ may be hidden:\n\n- $u = x^{2}$: $\\int \\frac{x}{\\sqrt{x^{4} + a^{2}}} \\, dx = \\frac{1}{2}\\operatorname{arsinh}\\frac{x^{2}}{a} + C$.\n- $u = e^{x}$: $\\int \\frac{e^{x}}{\\sqrt{e^{2x} + 1}} \\, dx = \\operatorname{arsinh}(e^{x}) + C$.\n- $u = \\sin x$: $\\int \\frac{\\cos x}{\\sqrt{1 + \\sin^{2} x}} \\, dx = \\operatorname{arsinh}(\\sin x) + C$.",
        "与反三角函数的积分一样，被积函数中隐藏的平方及其导数指明了应该怎样换元。与反正切一样，$u^{2}$ 可能是隐藏的：\n\n- $u = x^{2}$：$\\int \\frac{x}{\\sqrt{x^{4} + a^{2}}} \\, dx = \\frac{1}{2}\\operatorname{arsinh}\\frac{x^{2}}{a} + C$。\n- $u = e^{x}$：$\\int \\frac{e^{x}}{\\sqrt{e^{2x} + 1}} \\, dx = \\operatorname{arsinh}(e^{x}) + C$。\n- $u = \\sin x$：$\\int \\frac{\\cos x}{\\sqrt{1 + \\sin^{2} x}} \\, dx = \\operatorname{arsinh}(\\sin x) + C$。",
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
          return integral(
            `${sign}\\frac{${kk}x}{\\sqrt{x^{4} + ${a * a}}}`,
            answer,
            [
              `${coef(Q.of(k))}\\operatorname{arsinh}\\left(${arg}\\right) + C`,
              `${coef(Q.of(k, 2 * a))}\\operatorname{arsinh}\\left(${arg}\\right) + C`,
              `${coef(Q.of(k, 2))}\\arctan\\left(${arg}\\right) + C`,
            ],
            `Let $u = x^{2}$, so $x \\, dx = \\frac{1}{2} \\, du$: $${coef(Q.of(k, 2))}\\int \\frac{du}{\\sqrt{u^{2} + ${a * a}}} = ${answer}$.`,
            `令 $u = x^{2}$，则 $x \\, dx = \\frac{1}{2} \\, du$：$${coef(Q.of(k, 2))}\\int \\frac{du}{\\sqrt{u^{2} + ${a * a}}} = ${answer}$。`,
          );
        }
        const [integrand, u, du] = (
          kind === 1
            ? [`${sign}\\frac{${kk}e^{x}}{\\sqrt{e^{2x} + 1}}`, "e^{x}", "e^{x} \\, dx"]
            : [`${sign}\\frac{${kk}\\cos x}{\\sqrt{1 + \\sin^{2} x}}`, "\\sin x", "\\cos x \\, dx"]
        ) as [string, string, string];
        const answer = `${coef(Q.of(k))}\\operatorname{arsinh}(${u}) + C`;
        return integral(
          integrand,
          answer,
          [`${coef(Q.of(k))}\\arcsin(${u}) + C`, `${coef(Q.of(k))}\\arctan(${u}) + C`, `${coef(Q.of(k))}\\operatorname{arcosh}(${u}) + C`],
          `Let $u = ${u}$, so $du = ${du}$: $${coef(Q.of(k))}\\int \\frac{du}{\\sqrt{u^{2} + 1}} = ${answer}$.`,
          `令 $u = ${u}$，则 $du = ${du}$：$${coef(Q.of(k))}\\int \\frac{du}{\\sqrt{u^{2} + 1}} = ${answer}$。`,
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
  knowledgePoints: [
    {
      id: "scaled-arsech-and-arcsch-integrals",
      title: t("Scaled arsech and arcsch integrals", "带系数的 arsech 与 arcsch 积分"),
      explanation: t(
        "Here the factor of the variable outside the root also gets rewritten, and the constants from the substitution cancel, leaving the standard form. With $u = cx$, $dx = \\frac{1}{c} \\, du$ and $x = \\frac{u}{c}$, the factors of $c$ cancel:\n\n$$\\int \\frac{dx}{x\\sqrt{a^{2} - c^{2}x^{2}}} = \\int \\frac{du}{u\\sqrt{a^{2} - u^{2}}} = -\\frac{1}{a}\\operatorname{arsech}\\frac{cx}{a} + C \\ \\left(0 < x < \\frac{a}{c}\\right),$$\n\n$$\\int \\frac{dx}{x\\sqrt{a^{2} + c^{2}x^{2}}} = -\\frac{1}{a}\\operatorname{arcsch}\\frac{cx}{a} + C \\ (x > 0).$$",
        "这里根号外的变量因子也要改写，换元产生的常数相互抵消，只剩下标准形式。令 $u = cx$，$dx = \\frac{1}{c} \\, du$，$x = \\frac{u}{c}$，$c$ 的因子相互抵消：\n\n$$\\int \\frac{dx}{x\\sqrt{a^{2} - c^{2}x^{2}}} = \\int \\frac{du}{u\\sqrt{a^{2} - u^{2}}} = -\\frac{1}{a}\\operatorname{arsech}\\frac{cx}{a} + C \\ \\left(0 < x < \\frac{a}{c}\\right),$$\n\n$$\\int \\frac{dx}{x\\sqrt{a^{2} + c^{2}x^{2}}} = -\\frac{1}{a}\\operatorname{arcsch}\\frac{cx}{a} + C \\ (x > 0)$$",
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
        const arg = ratio(c, a);
        const answer = `${coef(Q.of(-k, a))}${f}\\left(${arg}\\right) + C`;
        return integral(
          quotient(k, `x\\sqrt{${squared(a, c, sech ? "-" : "+")}}`),
          answer,
          [
            `${coef(Q.of(k, a))}${f}\\left(${arg}\\right) + C`,
            `${coef(Q.of(-k, a * c))}${f}\\left(${arg}\\right) + C`,
            `${coef(Q.of(-k, a))}${f}\\left(${ratio(1, a)}\\right) + C`,
          ],
          `Let $u = ${poly([c, "x"])}$; then $\\frac{dx}{x} = \\frac{du}{u}$, and the integral is $${coef(Q.of(k))}\\int \\frac{du}{u\\sqrt{${a * a} ${sech ? "-" : "+"} u^{2}}} = ${answer}$.`,
          `令 $u = ${poly([c, "x"])}$，则 $\\frac{dx}{x} = \\frac{du}{u}$，积分为 $${coef(Q.of(k))}\\int \\frac{du}{u\\sqrt{${a * a} ${sech ? "-" : "+"} u^{2}}} = ${answer}$。`,
          sech ? { en: `$0 < x < ${Q.of(a, c).toLatex()}$`, zh: `$0 < x < ${Q.of(a, c).toLatex()}$` } : { en: "$x > 0$", zh: "$x > 0$" },
        );
      },
    },
    {
      id: "substituting-x-squared-for-arsech-and-arcsch",
      title: t("Substituting $x^2$ for arsech and arcsch", "用 $x^2$ 代换得 arsech 与 arcsch"),
      explanation: t(
        "Multiplying the top and bottom by the variable creates the derivative of its square, so substituting the square turns the integrand into a standard form. Multiply the top and bottom by $x$ and let $u = x^{2}$, so $\\frac{dx}{x} = \\frac{x \\, dx}{x^{2}} = \\frac{du}{2u}$:\n\n$$\\int \\frac{dx}{x\\sqrt{a^{2} - x^{4}}} = \\frac{1}{2}\\int \\frac{du}{u\\sqrt{a^{2} - u^{2}}} = -\\frac{1}{2a}\\operatorname{arsech}\\frac{x^{2}}{a} + C,$$\n\nand likewise $\\int \\frac{dx}{x\\sqrt{a^{2} + x^{4}}} = -\\frac{1}{2a}\\operatorname{arcsch}\\frac{x^{2}}{a} + C$.",
        "分子分母同乘以变量就产生了它平方的导数，所以把平方换元后，被积函数就成了标准形式。分子分母同乘 $x$，令 $u = x^{2}$，则 $\\frac{dx}{x} = \\frac{x \\, dx}{x^{2}} = \\frac{du}{2u}$：\n\n$$\\int \\frac{dx}{x\\sqrt{a^{2} - x^{4}}} = \\frac{1}{2}\\int \\frac{du}{u\\sqrt{a^{2} - u^{2}}} = -\\frac{1}{2a}\\operatorname{arsech}\\frac{x^{2}}{a} + C$$\n\n同理 $\\int \\frac{dx}{x\\sqrt{a^{2} + x^{4}}} = -\\frac{1}{2a}\\operatorname{arcsch}\\frac{x^{2}}{a} + C$。",
      ),
      generate(rng) {
        const k = rng.nonZero(-9, 9);
        const sech = rng.bool();
        const a = rng.int(2, 6);
        const f = sech ? "\\operatorname{arsech}" : "\\operatorname{arcsch}";
        const arg = `\\frac{x^{2}}{${a}}`;
        const answer = `${coef(Q.of(-k, 2 * a))}${f}\\left(${arg}\\right) + C`;
        return integral(
          quotient(k, `x\\sqrt{${a * a} ${sech ? "-" : "+"} x^{4}}`),
          answer,
          [
            `${coef(Q.of(-k, a))}${f}\\left(${arg}\\right) + C`,
            `${coef(Q.of(k, 2 * a))}${f}\\left(${arg}\\right) + C`,
            `${coef(Q.of(-k, 2 * a))}${f}\\left(\\frac{x}{${a}}\\right) + C`,
          ],
          `Let $u = x^{2}$, so $\\frac{dx}{x} = \\frac{du}{2u}$: $${coef(Q.of(k, 2))}\\int \\frac{du}{u\\sqrt{${a * a} ${sech ? "-" : "+"} u^{2}}} = ${Q.of(k, 2).toLatex()} \\cdot \\left(-\\frac{1}{${a}}\\right)${f}\\frac{u}{${a}} + C$, that is, $${answer}$.`,
          `令 $u = x^{2}$，则 $\\frac{dx}{x} = \\frac{du}{2u}$：$${coef(Q.of(k, 2))}\\int \\frac{du}{u\\sqrt{${a * a} ${sech ? "-" : "+"} u^{2}}} = ${Q.of(k, 2).toLatex()} \\cdot \\left(-\\frac{1}{${a}}\\right)${f}\\frac{u}{${a}} + C$，即 $${answer}$。`,
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
  knowledgePoints: [
    {
      id: "dividing-by-a-linear-denominator",
      title: t("Dividing by a linear denominator", "除以一次分母"),
      explanation: t(
        "When the top has at least the degree of the bottom, polynomial division leaves a polynomial plus a remainder fraction, and each part integrates easily. If the numerator has degree at least that of the denominator, divide first: $\\frac{p(x)}{x + r} = q(x) + \\frac{R}{x + r}$. Then\n\n$$\\int \\frac{x^{2} + 3x + 5}{x + 1} \\, dx = \\int \\left(x + 2 + \\frac{3}{x + 1}\\right) dx = \\frac{x^{2}}{2} + 2x + 3\\ln|x + 1| + C.$$",
        "当分子的次数不低于分母时，用多项式除法得到一个多项式加一个余式分式，每一部分都容易积分。若分子次数不低于分母次数，先做除法：$\\frac{p(x)}{x + r} = q(x) + \\frac{R}{x + r}$。于是\n\n$$\\int \\frac{x^{2} + 3x + 5}{x + 1} \\, dx = \\int \\left(x + 2 + \\frac{3}{x + 1}\\right) dx = \\frac{x^{2}}{2} + 2x + 3\\ln|x + 1| + C$$",
      ),
      generate(rng) {
        const a = rng.pick([1, 1, 2, 3]);
        const r = rng.nonZero(-5, 5);
        const p = rng.int(-6, 6);
        let q = rng.int(-9, 9);
        const lead = p - a * r;
        if (q - r * lead === 0) q += 1;
        const R = q - r * lead;
        const den = linear(1, r);
        const ln = `\\ln|${den}|`;
        const answer = plusC([Q.of(a, 2), "x^{2}"], [lead, "x"], [R, ln]);
        return integral(
          `\\frac{${poly([a, "x^{2}"], [p, "x"], [q, ""])}}{${den}}`,
          answer,
          [
            plusC([Q.of(a, 2), "x^{2}"], [lead, "x"]),
            plusC([Q.of(a, 2), "x^{2}"], [lead, "x"], [R, `\\ln|${linear(1, -r)}|`]),
            plusC([Q.of(a, 2), "x^{2}"], [lead, "x"], [-R, `(${den})^{-2}`]),
          ],
          `Dividing, $\\frac{${poly([a, "x^{2}"], [p, "x"], [q, ""])}}{${den}} = ${poly([a, "x"], [lead, ""])} ${R < 0 ? "-" : "+"} \\frac{${Math.abs(R)}}{${den}}$. Integrating term by term gives $${answer}$.`,
          `做除法得 $\\frac{${poly([a, "x^{2}"], [p, "x"], [q, ""])}}{${den}} = ${poly([a, "x"], [lead, ""])} ${R < 0 ? "-" : "+"} \\frac{${Math.abs(R)}}{${den}}$。逐项积分得 $${answer}$。`,
        );
      },
    },
    {
      id: "dividing-by-x-squared-plus-one",
      title: t("Dividing by $x^2 + 1$", "除以 $x^2 + 1$"),
      explanation: t(
        "After dividing by $x^{2} + 1$, a remainder $bx + c$ splits into a logarithm and an arctangent:\n\n$$\\int \\frac{bx + c}{x^{2} + 1} \\, dx = \\frac{b}{2}\\ln(x^{2} + 1) + c\\arctan x + C,$$\n\nusing $u = x^{2} + 1$ for the first part. For example, $\\frac{x^{3} + 2x + 3}{x^{2} + 1} = x + \\frac{x + 3}{x^{2} + 1}$.",
        "除以 $x^{2} + 1$ 后，余项 $bx + c$ 拆成对数与反正切：\n\n$$\\int \\frac{bx + c}{x^{2} + 1} \\, dx = \\frac{b}{2}\\ln(x^{2} + 1) + c\\arctan x + C$$\n\n第一部分用 $u = x^{2} + 1$。例如 $\\frac{x^{3} + 2x + 3}{x^{2} + 1} = x + \\frac{x + 3}{x^{2} + 1}$。",
      ),
      generate(rng) {
        const p = rng.int(-4, 4);
        let q = rng.int(-6, 6);
        let s = rng.int(-6, 6);
        if (q === 1) q = 3;
        if (s === p) s += 2;
        // (x³ + px² + qx + s) = (x + p)(x² + 1) + (q − 1)x + (s − p).
        const [b, c] = [q - 1, s - p];
        const answer = plusC([Q.of(1, 2), "x^{2}"], [p, "x"], [Q.of(b, 2), "\\ln(x^{2} + 1)"], [c, "\\arctan x"]);
        return integral(
          `\\frac{${poly([1, "x^{3}"], [p, "x^{2}"], [q, "x"], [s, ""])}}{x^{2} + 1}`,
          answer,
          [
            plusC([Q.of(1, 2), "x^{2}"], [p, "x"], [Q.of(b, 2), "\\ln(x^{2} + 1)"]),
            plusC([Q.of(1, 2), "x^{2}"], [p, "x"], [b, "\\ln(x^{2} + 1)"], [c, "\\arctan x"]),
            plusC([Q.of(1, 2), "x^{2}"], [p, "x"], [Q.of(b, 2), "\\ln(x^{2} + 1)"], [s, "\\arctan x"]),
          ],
          `Dividing, the quotient is $${linear(1, p)}$ with remainder $${linear(b, c) || "0"}$. So the integrand is $${linear(1, p)} + \\frac{${linear(b, c)}}{x^{2} + 1}$, and integrating gives $${answer}$.`,
          `做除法，商为 $${linear(1, p)}$，余式为 $${linear(b, c) || "0"}$。所以被积函数为 $${linear(1, p)} + \\frac{${linear(b, c)}}{x^{2} + 1}$，积分得 $${answer}$。`,
        );
      },
    },
  ],
};

/** shifted writes x + h, or x when h is 0. */
const shifted = (h: number) => linear(1, h);

/** shiftedArg writes (x + h)/a: "x + 2", "\frac{x - 1}{3}". */
const shiftedArg = (h: number, a: number) => (a === 1 ? shifted(h) : `\\frac{${shifted(h)}}{${a}}`);

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
  knowledgePoints: [
    {
      id: "completing-the-square-for-arctangent",
      title: t("Completing the square for arctangent", "配方得反正切"),
      explanation: t(
        "Completing the square turns a quadratic with no real roots into a shifted square plus a constant, so a shift of the variable gives the arctangent form. Write $x^{2} + 2hx + h^{2} + a^{2} = (x + h)^{2} + a^{2}$ and let $u = x + h$:\n\n$$\\int \\frac{dx}{(x + h)^{2} + a^{2}} = \\frac{1}{a}\\arctan\\frac{x + h}{a} + C.$$\n\nFor example, $x^{2} + 4x + 13 = (x + 2)^{2} + 9$, so $\\int \\frac{dx}{x^{2} + 4x + 13} = \\frac{1}{3}\\arctan\\frac{x + 2}{3} + C$.",
        "配方把没有实根的二次式变成平移后的平方加常数，所以平移变量后就得到反正切的形式。写成 $x^{2} + 2hx + h^{2} + a^{2} = (x + h)^{2} + a^{2}$，令 $u = x + h$：\n\n$$\\int \\frac{dx}{(x + h)^{2} + a^{2}} = \\frac{1}{a}\\arctan\\frac{x + h}{a} + C$$\n\n例如 $x^{2} + 4x + 13 = (x + 2)^{2} + 9$，所以 $\\int \\frac{dx}{x^{2} + 4x + 13} = \\frac{1}{3}\\arctan\\frac{x + 2}{3} + C$。",
      ),
      generate(rng) {
        const h = rng.nonZero(-4, 4);
        const a = rng.int(1, 4);
        const k = rng.nonZero(-9, 9);
        const den = poly([1, "x^{2}"], [2 * h, "x"], [h * h + a * a, ""]);
        const answer = `${coef(Q.of(k, a))}\\arctan\\left(${shiftedArg(h, a)}\\right) + C`;
        return integral(
          quotient(k, den),
          answer,
          [
            `${coef(Q.of(k))}\\arctan\\left(${shiftedArg(h, a)}\\right) + C`,
            `${coef(Q.of(k, a))}\\arctan\\left(${shiftedArg(-h, a)}\\right) + C`,
            `${coef(Q.of(k, a * a))}\\arctan\\left(${shiftedArg(h, a)}\\right) + C`,
          ],
          `Complete the square: $${den} = (${shifted(h)})^{2} + ${a * a}$. With $u = ${shifted(h)}$, the integral is $${coef(Q.of(k))}\\int \\frac{du}{u^{2} + ${a * a}} = ${answer}$.`,
          `配方：$${den} = (${shifted(h)})^{2} + ${a * a}$。令 $u = ${shifted(h)}$，积分为 $${coef(Q.of(k))}\\int \\frac{du}{u^{2} + ${a * a}} = ${answer}$。`,
        );
      },
    },
    {
      id: "completing-the-square-for-arcsine",
      title: t("Completing the square for arcsine", "配方得反正弦"),
      explanation: t(
        "Under a root with $-x^{2}$, factor out the minus sign before completing the square: $c - 2hx - x^{2} = a^{2} - (x + h)^{2}$ with $a^{2} = c + h^{2}$. Then\n\n$$\\int \\frac{dx}{\\sqrt{a^{2} - (x + h)^{2}}} = \\arcsin\\frac{x + h}{a} + C.$$\n\nFor example, $8 + 2x - x^{2} = 9 - (x - 1)^{2}$.",
        "根号下含 $-x^{2}$ 时，先提出负号再配方：$c - 2hx - x^{2} = a^{2} - (x + h)^{2}$，其中 $a^{2} = c + h^{2}$。于是\n\n$$\\int \\frac{dx}{\\sqrt{a^{2} - (x + h)^{2}}} = \\arcsin\\frac{x + h}{a} + C$$\n\n例如 $8 + 2x - x^{2} = 9 - (x - 1)^{2}$。",
      ),
      generate(rng) {
        const h = rng.pick([-2, -1, 1, 2]);
        const a = rng.int(2, 4);
        const k = rng.nonZero(-9, 9);
        const inside = poly([a * a - h * h, ""], [-2 * h, "x"], [-1, "x^{2}"]);
        const answer = `${coef(Q.of(k))}\\arcsin\\left(${shiftedArg(h, a)}\\right) + C`;
        return integral(
          quotient(k, `\\sqrt{${inside}}`),
          answer,
          [
            `${coef(Q.of(k))}\\arcsin\\left(${shiftedArg(-h, a)}\\right) + C`,
            `${coef(Q.of(k, a))}\\arcsin\\left(${shiftedArg(h, a)}\\right) + C`,
            `${coef(Q.of(k))}\\arcsin\\left(${shifted(h)}\\right) + C`,
          ],
          `Complete the square: $${inside} = ${a * a} - (${shifted(h)})^{2}$. With $u = ${shifted(h)}$, the integral is $${coef(Q.of(k))}\\int \\frac{du}{\\sqrt{${a * a} - u^{2}}} = ${answer}$.`,
          `配方：$${inside} = ${a * a} - (${shifted(h)})^{2}$。令 $u = ${shifted(h)}$，积分为 $${coef(Q.of(k))}\\int \\frac{du}{\\sqrt{${a * a} - u^{2}}} = ${answer}$。`,
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
  knowledgePoints: [
    {
      id: "completing-the-square-for-arsinh",
      title: t("Completing the square for arsinh", "配方得 arsinh"),
      explanation: t(
        "After completing the square under the root, a shifted square plus a positive constant gives the inverse hyperbolic sine form. If $x^{2} + 2hx + c = (x + h)^{2} + a^{2}$ with $a > 0$, let $u = x + h$:\n\n$$\\int \\frac{dx}{\\sqrt{(x + h)^{2} + a^{2}}} = \\operatorname{arsinh}\\frac{x + h}{a} + C.$$\n\nFor example, $x^{2} - 6x + 13 = (x - 3)^{2} + 4$.",
        "在根号下配方后，平移后的平方加正常数就给出反双曲正弦的形式。若 $x^{2} + 2hx + c = (x + h)^{2} + a^{2}$，$a > 0$，令 $u = x + h$：\n\n$$\\int \\frac{dx}{\\sqrt{(x + h)^{2} + a^{2}}} = \\operatorname{arsinh}\\frac{x + h}{a} + C$$\n\n例如 $x^{2} - 6x + 13 = (x - 3)^{2} + 4$。",
      ),
      generate(rng) {
        const h = rng.nonZero(-4, 4);
        const a = rng.int(1, 4);
        const k = rng.nonZero(-9, 9);
        const inside = poly([1, "x^{2}"], [2 * h, "x"], [h * h + a * a, ""]);
        const answer = `${coef(Q.of(k))}\\operatorname{arsinh}\\left(${shiftedArg(h, a)}\\right) + C`;
        return integral(
          quotient(k, `\\sqrt{${inside}}`),
          answer,
          [
            `${coef(Q.of(k))}\\operatorname{arsinh}\\left(${shiftedArg(-h, a)}\\right) + C`,
            `${coef(Q.of(k, a))}\\operatorname{arsinh}\\left(${shiftedArg(h, a)}\\right) + C`,
            `${coef(Q.of(k, a))}\\arctan\\left(${shiftedArg(h, a)}\\right) + C`,
          ],
          `Complete the square: $${inside} = (${shifted(h)})^{2} + ${a * a}$. With $u = ${shifted(h)}$, the integral is $${coef(Q.of(k))}\\int \\frac{du}{\\sqrt{u^{2} + ${a * a}}} = ${answer}$.`,
          `配方：$${inside} = (${shifted(h)})^{2} + ${a * a}$。令 $u = ${shifted(h)}$，积分为 $${coef(Q.of(k))}\\int \\frac{du}{\\sqrt{u^{2} + ${a * a}}} = ${answer}$。`,
        );
      },
    },
    {
      id: "completing-the-square-for-arcosh",
      title: t("Completing the square for arcosh", "配方得 arcosh"),
      explanation: t(
        "After completing the square, a shifted square minus a positive constant under the root gives the inverse hyperbolic cosine form on the right side. If $x^{2} + 2hx + c = (x + h)^{2} - a^{2}$ with $a > 0$, then for $x + h > a$\n\n$$\\int \\frac{dx}{\\sqrt{(x + h)^{2} - a^{2}}} = \\operatorname{arcosh}\\frac{x + h}{a} + C.$$\n\nFor example, $x^{2} + 4x = (x + 2)^{2} - 4$.",
        "配方后，根号下平移后的平方减去正常数，就在右侧给出反双曲余弦的形式。若 $x^{2} + 2hx + c = (x + h)^{2} - a^{2}$，$a > 0$，则当 $x + h > a$ 时\n\n$$\\int \\frac{dx}{\\sqrt{(x + h)^{2} - a^{2}}} = \\operatorname{arcosh}\\frac{x + h}{a} + C$$\n\n例如 $x^{2} + 4x = (x + 2)^{2} - 4$。",
      ),
      generate(rng) {
        const a = rng.int(1, 3);
        const h = rng.pick([a - 1, a, a + 1].filter((v) => v !== 0));
        const k = rng.nonZero(-9, 9);
        const inside = poly([1, "x^{2}"], [2 * h, "x"], [h * h - a * a, ""]);
        const answer = `${coef(Q.of(k))}\\operatorname{arcosh}\\left(${shiftedArg(h, a)}\\right) + C`;
        return integral(
          quotient(k, `\\sqrt{${inside}}`),
          answer,
          [
            `${coef(Q.of(k))}\\operatorname{arsinh}\\left(${shiftedArg(h, a)}\\right) + C`,
            `${coef(Q.of(k, a))}\\operatorname{arcosh}\\left(${shiftedArg(h, a)}\\right) + C`,
            `${coef(Q.of(k))}\\operatorname{arcosh}\\left(${shifted(h)}\\right) + C`,
          ],
          `Complete the square: $${inside} = (${shifted(h)})^{2} - ${a * a}$. With $u = ${shifted(h)}$, the integral is $${coef(Q.of(k))}\\int \\frac{du}{\\sqrt{u^{2} - ${a * a}}} = ${answer}$.`,
          `配方：$${inside} = (${shifted(h)})^{2} - ${a * a}$。令 $u = ${shifted(h)}$，积分为 $${coef(Q.of(k))}\\int \\frac{du}{\\sqrt{u^{2} - ${a * a}}} = ${answer}$。`,
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
  knowledgePoints: [
    {
      id: "completing-the-square-for-arsech",
      title: t("Completing the square for arsech", "配方得 arsech"),
      explanation: t(
        "Complete the square so that the root holds a constant minus a shifted square, and the shifted factor outside matches, giving the inverse hyperbolic secant form. If $c - 2hx - x^{2} = a^{2} - (x + h)^{2}$, let $u = x + h$. For $0 < x + h < a$,\n\n$$\\int \\frac{dx}{(x + h)\\sqrt{a^{2} - (x + h)^{2}}} = -\\frac{1}{a}\\operatorname{arsech}\\frac{x + h}{a} + C.$$",
        "配方使根号下是常数减平移后的平方，根号外的因子也是同样的平移式，就得到反双曲正割的形式。若 $c - 2hx - x^{2} = a^{2} - (x + h)^{2}$，令 $u = x + h$。当 $0 < x + h < a$ 时，\n\n$$\\int \\frac{dx}{(x + h)\\sqrt{a^{2} - (x + h)^{2}}} = -\\frac{1}{a}\\operatorname{arsech}\\frac{x + h}{a} + C$$",
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
        return integral(
          quotient(k, `(${shifted(h)})\\sqrt{${inside}}`),
          answer,
          [
            `${coef(Q.of(k, a))}\\operatorname{arsech}\\left(${shiftedArg(h, a)}\\right) + C`,
            `${coef(Q.of(-k))}\\operatorname{arsech}\\left(${shiftedArg(h, a)}\\right) + C`,
            `${coef(Q.of(k))}\\arcsin\\left(${shiftedArg(h, a)}\\right) + C`,
          ],
          `Complete the square: $${inside} = ${a * a} - (${shifted(h)})^{2}$. With $u = ${shifted(h)}$, the integral is $${coef(Q.of(k))}\\int \\frac{du}{u\\sqrt{${a * a} - u^{2}}} = ${answer}$.`,
          `配方：$${inside} = ${a * a} - (${shifted(h)})^{2}$。令 $u = ${shifted(h)}$，积分为 $${coef(Q.of(k))}\\int \\frac{du}{u\\sqrt{${a * a} - u^{2}}} = ${answer}$。`,
          { en: `$${-h} < x < ${a - h}$`, zh: `$${-h} < x < ${a - h}$` },
        );
      },
    },
    {
      id: "completing-the-square-for-arcsch",
      title: t("Completing the square for arcsch", "配方得 arcsch"),
      explanation: t(
        "Complete the square so that the root holds a shifted square plus a constant, and with the matching factor outside, this gives the inverse hyperbolic cosecant form. If $x^{2} + 2hx + c = (x + h)^{2} + a^{2}$, let $u = x + h$. For $x + h > 0$,\n\n$$\\int \\frac{dx}{(x + h)\\sqrt{(x + h)^{2} + a^{2}}} = -\\frac{1}{a}\\operatorname{arcsch}\\frac{x + h}{a} + C.$$",
        "配方使根号下是平移后的平方加常数，根号外有相应的因子，就得到反双曲余割的形式。若 $x^{2} + 2hx + c = (x + h)^{2} + a^{2}$，令 $u = x + h$。当 $x + h > 0$ 时，\n\n$$\\int \\frac{dx}{(x + h)\\sqrt{(x + h)^{2} + a^{2}}} = -\\frac{1}{a}\\operatorname{arcsch}\\frac{x + h}{a} + C$$",
      ),
      generate(rng) {
        const h = rng.pick([1, 2, 3, -1]);
        const a = rng.int(1, 4);
        const k = rng.nonZero(-9, 9);
        const inside = poly([1, "x^{2}"], [2 * h, "x"], [h * h + a * a, ""]);
        const answer = `${coef(Q.of(-k, a))}\\operatorname{arcsch}\\left(${shiftedArg(h, a)}\\right) + C`;
        return integral(
          quotient(k, `(${shifted(h)})\\sqrt{${inside}}`),
          answer,
          [
            `${coef(Q.of(k, a))}\\operatorname{arcsch}\\left(${shiftedArg(h, a)}\\right) + C`,
            `${coef(Q.of(-k))}\\operatorname{arcsch}\\left(${shiftedArg(h, a)}\\right) + C`,
            `${coef(Q.of(k))}\\operatorname{arsinh}\\left(${shiftedArg(h, a)}\\right) + C`,
          ],
          `Complete the square: $${inside} = (${shifted(h)})^{2} + ${a * a}$. With $u = ${shifted(h)}$, the integral is $${coef(Q.of(k))}\\int \\frac{du}{u\\sqrt{u^{2} + ${a * a}}} = ${answer}$.`,
          `配方：$${inside} = (${shifted(h)})^{2} + ${a * a}$。令 $u = ${shifted(h)}$，积分为 $${coef(Q.of(k))}\\int \\frac{du}{u\\sqrt{u^{2} + ${a * a}}} = ${answer}$。`,
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
