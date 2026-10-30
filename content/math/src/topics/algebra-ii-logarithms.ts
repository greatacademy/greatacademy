import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { type Coefficient, dec, gcd, linear, num, paren, poly, Q, rationalRoot } from "@ga/subject-math";

import { choiceProblem, expressionProblem, type NumberProblem, numberProblem, solutionsProblem, steps } from "../problems.ts";

const toQ = (c: Coefficient): Q => (c instanceof Q ? c : Q.of(c));

/** wrapArg writes the argument of a logarithm, in parentheses unless it is a number, a letter, a fraction or a root. */
function wrapArg(x: string): string {
  return /^(\d+(\.\d+)?|[a-z]|\\frac\{\d+\}\{\d+\}|\\sqrt(\[\d\])?\{[^{}]*\})$/.test(x) ? x : `(${x})`;
}

/** logL writes a logarithm to a base: "\log_{2} 8", "\log_{3}(2x + 1)". */
const logL = (b: Coefficient | string, x: string) => `\\log_{${typeof b === "string" ? b : num(b)}} ${wrapArg(x)}`;

/** lnL writes a natural logarithm: "\ln 5", "\ln(x - 4)". */
const lnL = (x: string) => `\\ln ${wrapArg(x)}`;

/** lgL writes a common logarithm: "\log 1000". */
const lgL = (x: string) => `\\log ${wrapArg(x)}`;

/** baseL writes a base for a power, with fractions in parentheses: "2", "\left(\frac{1}{2}\right)". */
const baseL = (b: Coefficient) => (toQ(b).isInteger() && toQ(b).sign() > 0 ? num(b) : `\\left(${num(b)}\\right)`);

/** powL writes b to an exponent given in LaTeX. */
const powL = (b: Coefficient, e: Coefficient | string) => `${baseL(b)}^{${typeof e === "string" ? e : num(e)}}`;

/** coefL writes a coefficient in front of a power or logarithm: "", "-", "3", "\frac{1}{2}". */
function coefL(a: Coefficient): string {
  const v = toQ(a);
  return v.eq(Q.one) ? "" : v.eq(Q.of(-1)) ? "-" : v.toLatex();
}

/** plusK writes "+ k" or "- k" after a term, or nothing for 0. */
const plusK = (k: Coefficient) => {
  const v = toQ(k);
  return v.isZero() ? "" : v.sign() > 0 ? ` + ${v.toLatex()}` : ` - ${v.abs().toLatex()}`;
};

/** qlog is log_b x when it is rational with a small denominator, or undefined. */
function qlog(b: Q, x: Q): Q | undefined {
  if (x.sign() <= 0 || b.sign() <= 0 || b.eq(Q.one)) return undefined;
  for (let d = 1; d <= 6; d++) {
    for (let n = -24; n <= 24; n++) {
      if (gcd(Math.abs(n), d) !== 1 && !(n === 0 && d === 1)) continue;
      if (b.pow(n).eq(x.pow(d))) return Q.of(n, d);
    }
  }
  return undefined;
}

/** rpow is b^c for a rational c when it is rational, or undefined. */
function rpow(b: Q, c: Q): Q | undefined {
  return rationalRoot(b.pow(Number(c.n)), Number(c.d));
}

/** roundTo rounds a number to the given number of decimal places, halves away from zero. */
function roundTo(v: Q, places: number): Q {
  const s = 10n ** BigInt(places);
  const a = v.abs();
  const r = Q.of((2n * a.n * s + a.d) / (2n * a.d), s);
  return v.sign() < 0 ? r.neg() : r;
}

/** approx is x rounded to the given number of decimal places, as an exact rational. */
const approx = (x: number, places = 4) => Q.of(Math.round(x * 10 ** places), 10 ** places);

/**
 * stable tells whether v, computed from rounded values, rounds to the same
 * number as the true value, with the true value well away from a rounding boundary,
 * so that a learner with a calculator gets the same answer.
 */
function stable(v: Q, truth: number, places: number): boolean {
  const scaled = Math.abs(truth) * 10 ** places;
  if (Math.abs(scaled - Math.floor(scaled) - 0.5) < 0.15) return false;
  const exact = Q.of(Math.sign(truth) * Math.round(scaled), 10 ** places);
  return roundTo(v, places).eq(exact);
}

/** lnQ is ln x rounded to four decimal places. */
const lnQ = (x: number) => approx(Math.log(x));

/** prefixed builds a number problem with a prefix such as "\log_{2}" shown before the field. */
function prefixed(p: NumberProblem, prefix: string): Problem {
  const base = numberProblem(p);
  return { ...base, answer: { ...base.answer, input: { kind: "math", prefix } } };
}

/** OneOf describes a multiple-choice problem whose options are shuffled. */
interface OneOf {
  readonly prompt: Text;
  readonly right: Text;
  readonly wrong: readonly Text[];
  readonly solution: Text;
  readonly figure?: Figure;
}

/** oneOf builds a choice problem from the right option and up to three distinct wrong ones, shuffled. */
function oneOf(rng: Rng, p: OneOf): Problem {
  const seen = new Set([p.right.en]);
  const wrong = p.wrong.filter((w) => !seen.has(w.en) && seen.add(w.en)).slice(0, 3);
  const options = [p.right, ...wrong];
  const order = rng.shuffle(options.map((_, i) => i));
  const problem = choiceProblem({
    prompt: p.prompt,
    options: order.map((i) => options[i]!),
    correct: order.indexOf(0),
    solution: p.solution,
  });
  return p.figure ? { ...problem, figure: p.figure } : problem;
}

/** m writes LaTeX as a text that is the same in every locale. */
const m = (latex: string) => same(`$${latex}$`);

/** both builds a text from one English and one Chinese sentence around the same LaTeX steps. */
const both = (en: string, zh: string, ...lines: string[]) => t(`${en}${steps(...lines)}`, `${zh}${steps(...lines)}`);

/** PowerOf is a power b^c = x of a rational base with a rational result. */
interface PowerOf {
  readonly b: Q;
  readonly c: Q;
  readonly x: Q;
}

/** integerPower draws b^c = x with an integer base from 2 to 10 and a small integer exponent, x at most 1000 in size. */
function integerPower(rng: Rng, cMin: number, cMax: number): PowerOf {
  for (;;) {
    const b = rng.int(2, 10);
    const c = rng.int(cMin, cMax);
    const x = Q.of(b).pow(c);
    if (x.n > 1000n || x.d > 1000n) continue;
    return { b: Q.of(b), c: Q.of(c), x };
  }
}

/** rootFamilies are bases written as powers of a common root: 4 = 2², 8 = 2³, 9 = 3², 27 = 3³, 25 = 5². */
const rootFamilies = [
  { r: 2, top: 4 },
  { r: 3, top: 3 },
  { r: 5, top: 2 },
  { r: 6, top: 2 },
  { r: 7, top: 2 },
];

/** fractionalPower draws b = r^p and x = r^q with log_b x = q/p not an integer. */
function fractionalPower(rng: Rng): PowerOf & { r: number; p: number; q: number } {
  for (;;) {
    const { r, top } = rng.pick(rootFamilies);
    const p = rng.int(2, top);
    const q = rng.int(-top, top + 1);
    if (q === 0 || q % p === 0) continue;
    const b = Q.of(r).pow(p);
    const x = Q.of(r).pow(q);
    if (x.n > 2000n || x.d > 2000n) continue;
    return { b, c: Q.of(q, p), x, r, p, q };
  }
}

// Introduction to logarithms.

export const convertingBetweenExponentialAndLogarithmicForm: TopicDef = {
  id: "converting-between-exponential-and-logarithmic-form",
  title: t("Converting Between Exponential and Logarithmic Form", "指数式与对数式的互化"),
  summary: t(
    "Read $\\log_{b} x = c$ as $b^{c} = x$, convert between the two forms, and find a missing argument or base.",
    "把 $\\log_{b} x = c$ 读作 $b^{c} = x$，在两种形式之间互化，并求未知的真数或底数。",
  ),
  prerequisites: ["exponential-functions", "writing-radicals-using-fractional-exponents"],
  encompasses: [
    { topic: "zero-and-negative-exponents", weight: 0.2 },
    { topic: "writing-radicals-using-fractional-exponents", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.BF.B.5", "CCSS.HSF.LE.A.4"],
  knowledgePoints: [
    {
      id: "exponential-to-logarithmic-form",
      title: t("From exponential to logarithmic form", "指数式化为对数式"),
      explanation: t(
        'A **logarithm** is an exponent. For a base $b > 0$ with $b \\ne 1$ and a number $x > 0$,\n\n$$\\log_{b} x = c \\quad \\text{means} \\quad b^{c} = x.$$\n\nRead $\\log_{b} x$ as "the exponent that $b$ must be raised to in order to give $x$". The base stays the base, the exponent becomes the value of the logarithm, and the result of the power becomes the **argument**:\n\n$$2^{5} = 32 \\iff \\log_{2} 32 = 5$$',
        '**对数**就是指数。对于底数 $b > 0$、$b \\ne 1$ 和正数 $x$，\n\n$$\\log_{b} x = c \\quad \\text{的意思是} \\quad b^{c} = x。$$\n\n$\\log_{b} x$ 读作"$b$ 要乘方多少次才得到 $x$"的那个指数。底数仍是底数，指数变成对数的值，乘方的结果变成**真数**：\n\n$$2^{5} = 32 \\iff \\log_{2} 32 = 5$$',
      ),
      generate(rng) {
        for (;;) {
          const { b, c, x } = rng.bool(0.25) ? fractionalPower(rng) : integerPower(rng, -3, 5);
          if (c.isZero() || c.eq(Q.one)) continue;
          const [B, C, X] = [num(b), num(c), num(x)];
          const right = `${logL(B, X)} = ${C}`;
          const wrong = [`${logL(C, X)} = ${B}`, `${logL(X, B)} = ${C}`, `${logL(B, C)} = ${X}`];
          if (c.sign() < 0) wrong[0] = `${logL(B, X)} = ${num(c.neg())}`;
          if (new Set([right, ...wrong]).size < 4) continue;
          return oneOf(rng, {
            prompt: t(
              `Which equation is $${powL(b, c)} = ${X}$ written in logarithmic form?`,
              `把 $${powL(b, c)} = ${X}$ 写成对数式，是下面哪个等式？`,
            ),
            right: m(right),
            wrong: wrong.map(m),
            solution: t(
              `The base $${B}$ stays the base, the exponent $${C}$ is the value of the logarithm, and $${X}$ is the argument: $${right}$.`,
              `底数 $${B}$ 仍是底数，指数 $${C}$ 是对数的值，$${X}$ 是真数：$${right}$。`,
            ),
          });
        }
      },
    },
    {
      id: "logarithmic-to-exponential-form",
      title: t("From logarithmic to exponential form", "对数式化为指数式"),
      explanation: t(
        "To read a logarithm, turn it back into a power: in $\\log_{b} x = c$ the base $b$ is raised to the value $c$ and gives the argument $x$:\n\n$$\\log_{3} 81 = 4 \\iff 3^{4} = 81$$\n\nA quick check: the base of the logarithm is the base of the power, on the same side of the equation as the subscript.",
        "读对数时，把它变回幂：在 $\\log_{b} x = c$ 中，底数 $b$ 的 $c$ 次幂等于真数 $x$：\n\n$$\\log_{3} 81 = 4 \\iff 3^{4} = 81$$\n\n检查方法：对数的底数就是幂的底数。",
      ),
      generate(rng) {
        for (;;) {
          const { b, c, x } = rng.bool(0.25) ? fractionalPower(rng) : integerPower(rng, -3, 5);
          if (c.isZero() || c.eq(Q.one) || c.sign() < 0) continue;
          const [B, C, X] = [num(b), num(c), num(x)];
          const right = `${powL(b, c)} = ${X}`;
          const wrong = [`${powL(c, b)} = ${X}`, `${powL(x, c)} = ${B}`, `${powL(b, x)} = ${C}`];
          if (new Set([right, ...wrong]).size < 4) continue;
          return oneOf(rng, {
            prompt: t(
              `Which equation is $${logL(B, X)} = ${C}$ written in exponential form?`,
              `把 $${logL(B, X)} = ${C}$ 写成指数式，是下面哪个等式？`,
            ),
            right: m(right),
            wrong: wrong.map(m),
            solution: t(
              `$${logL(B, X)} = ${C}$ says that $${B}$ raised to the power $${C}$ gives $${X}$: $${right}$.`,
              `$${logL(B, X)} = ${C}$ 表示 $${B}$ 的 $${C}$ 次幂等于 $${X}$：$${right}$。`,
            ),
          });
        }
      },
    },
    {
      id: "finding-the-argument",
      title: t("Finding the argument", "求真数"),
      explanation: t(
        "To solve $\\log_{b} x = c$ for $x$, write it in exponential form and evaluate the power:\n\n$$\\log_{4} x = -2 \\implies x = 4^{-2} = \\frac{1}{16}$$\n\nA negative value of the logarithm gives an argument between $0$ and $1$, never a negative argument.",
        "解 $\\log_{b} x = c$ 求 $x$：写成指数式，再计算幂：\n\n$$\\log_{4} x = -2 \\implies x = 4^{-2} = \\frac{1}{16}$$\n\n对数值为负时，真数在 $0$ 和 $1$ 之间，而不是负数。",
      ),
      generate(rng) {
        for (;;) {
          const { b, c, x } = rng.bool(0.2) ? fractionalPower(rng) : integerPower(rng, -3, 4);
          if (c.isZero()) continue;
          const [B, C] = [num(b), num(c)];
          return numberProblem({
            prompt: t(`Solve $${logL(B, "x")} = ${C}$.`, `解方程 $${logL(B, "x")} = ${C}$。`),
            answer: x,
            solveFor: "x",
            wrong: [
              b.mul(c),
              ...(c.isInteger() && c.sign() > 0 ? [c.pow(Number(b.n))] : []),
              x.neg(),
              ...(c.sign() < 0 ? [b.pow(-Number(c.n))] : []),
            ],
            solution: both(`Write the equation in exponential form:`, `把方程写成指数式：`, `x = ${powL(b, c)} = ${num(x)}`),
          });
        }
      },
    },
    {
      id: "finding-the-base",
      title: t("Finding the base", "求底数"),
      explanation: t(
        "To solve $\\log_{b} x = c$ for the base, write $b^{c} = x$ and take the root that undoes the power. A base must be positive, so only the positive root counts:\n\n$$\\log_{b} 49 = 2 \\implies b^{2} = 49 \\implies b = 7$$\n\nFor a negative or fractional value, use the rules of exponents: $b^{-3} = \\frac{1}{8}$ gives $b^{3} = 8$, so $b = 2$; $b^{\\frac{1}{2}} = 5$ gives $b = 5^{2} = 25$.",
        "解 $\\log_{b} x = c$ 求底数：写成 $b^{c} = x$，再开方消去乘方。底数必须是正数，所以只取正根：\n\n$$\\log_{b} 49 = 2 \\implies b^{2} = 49 \\implies b = 7$$\n\n对数值为负数或分数时，用指数运算法则：$b^{-3} = \\frac{1}{8}$ 得 $b^{3} = 8$，所以 $b = 2$；$b^{\\frac{1}{2}} = 5$ 得 $b = 5^{2} = 25$。",
      ),
      generate(rng) {
        for (;;) {
          const c = rng.pick([Q.of(2), Q.of(3), Q.of(4), Q.of(-1), Q.of(-2), Q.of(-3), Q.of(1, 2), Q.of(1, 3)]);
          const b = c.isInteger() ? rng.int(2, 9) : rng.int(2, c.d === 2n ? 9 : 5) ** Number(c.d);
          const x = rpow(Q.of(b), c);
          if (!x || x.n > 1000n || x.d > 1000n) continue;
          const C = num(c);
          return numberProblem({
            prompt: t(`Solve $${logL("b", num(x))} = ${C}$ for the base $b$.`, `解方程 $${logL("b", num(x))} = ${C}$，求底数 $b$。`),
            answer: b,
            solveFor: "b",
            wrong: [x.div(c), x.mul(c), ...(c.isInteger() ? [x.pow(Number(c.n))] : []), Q.of(b).neg()],
            solution: both(
              `Write the equation in exponential form and undo the power:`,
              `把方程写成指数式，再消去乘方：`,
              `b^{${C}} = ${num(x)}`,
              `b = ${b}`,
            ),
          });
        }
      },
    },
  ],
  diagnostic: "finding-the-argument",
};

/** logValueProblem asks for the value of a logarithm written in LaTeX. */
function logValueProblem(expr: string, answer: Q, wrong: readonly Coefficient[], solution: Text): Problem {
  return numberProblem({
    prompt: t(`Evaluate $${expr}$.`, `求 $${expr}$ 的值。`),
    answer,
    wrong,
    solution,
  });
}

export const evaluatingLogarithms: TopicDef = {
  id: "evaluating-logarithms",
  title: t("Evaluating Logarithms", "求对数的值"),
  summary: t(
    "Evaluate logarithms such as $\\log_{2} 32$, $\\log_{3} \\frac{1}{9}$ and $\\log_{4} 8$ by writing the argument as a power of the base.",
    "把真数写成底数的幂，求 $\\log_{2} 32$、$\\log_{3} \\frac{1}{9}$、$\\log_{4} 8$ 这样的对数的值。",
  ),
  prerequisites: ["converting-between-exponential-and-logarithmic-form", "solving-exponential-equations-with-fractional-solutions"],
  encompasses: [
    { topic: "converting-between-exponential-and-logarithmic-form", weight: 0.5 },
    { topic: "solving-exponential-equations-with-fractional-solutions", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.BF.B.5"],
  knowledgePoints: [
    {
      id: "whole-number-logarithms",
      title: t("Whole-number logarithms", "整数值的对数"),
      explanation: t(
        "To evaluate $\\log_{b} x$, ask which power of $b$ equals $x$. Write $x$ as a power of $b$, and the exponent is the answer:\n\n$$\\log_{3} 81 = \\log_{3} 3^{4} = 4$$\n\nTwo values hold for every base: $\\log_{b} 1 = 0$, because $b^{0} = 1$, and $\\log_{b} b = 1$, because $b^{1} = b$.",
        "求 $\\log_{b} x$ 时，问：$b$ 的几次幂等于 $x$？把 $x$ 写成 $b$ 的幂，指数就是答案：\n\n$$\\log_{3} 81 = \\log_{3} 3^{4} = 4$$\n\n对任何底数都有两个值：$\\log_{b} 1 = 0$，因为 $b^{0} = 1$；$\\log_{b} b = 1$，因为 $b^{1} = b$。",
      ),
      generate(rng) {
        const { b, c, x } = integerPower(rng, rng.bool(0.15) ? 0 : 1, 6);
        return logValueProblem(
          logL(b, num(x)),
          c,
          [x.div(b), c.add(Q.one), c.sub(Q.one), ...(c.isZero() ? [Q.one] : [])],
          both(
            `Write $${num(x)}$ as a power of $${num(b)}$:`,
            `把 $${num(x)}$ 写成 $${num(b)}$ 的幂：`,
            `${logL(b, num(x))} = ${logL(b, powL(b, c))} = ${num(c)}`,
          ),
        );
      },
    },
    {
      id: "logarithms-of-fractions",
      title: t("Logarithms of fractions", "分数的对数"),
      explanation: t(
        "A fraction $\\frac{1}{b^{n}}$ is the power $b^{-n}$, so its logarithm is negative:\n\n$$\\log_{2} \\frac{1}{8} = \\log_{2} 2^{-3} = -3$$\n\nThe base can be a fraction too: $\\left(\\frac{1}{3}\\right)^{-2} = 9$, so $\\log_{\\frac{1}{3}} 9 = -2$.",
        "分数 $\\frac{1}{b^{n}}$ 就是幂 $b^{-n}$，所以它的对数是负数：\n\n$$\\log_{2} \\frac{1}{8} = \\log_{2} 2^{-3} = -3$$\n\n底数也可以是分数：$\\left(\\frac{1}{3}\\right)^{-2} = 9$，所以 $\\log_{\\frac{1}{3}} 9 = -2$。",
      ),
      generate(rng) {
        const { b, c, x } = integerPower(rng, 1, 5);
        if (rng.bool(0.35)) {
          const B = Q.one.div(b);
          return logValueProblem(
            logL(B, num(x)),
            c.neg(),
            [c, Q.one.div(c), x.mul(B)],
            both(
              `Write $${num(x)}$ as a power of $${num(B)}$: $${num(x)} = ${powL(B, c.neg())}$. So`,
              `把 $${num(x)}$ 写成 $${num(B)}$ 的幂：$${num(x)} = ${powL(B, c.neg())}$。所以`,
              `${logL(B, num(x))} = ${num(c.neg())}`,
            ),
          );
        }
        const X = Q.one.div(x);
        return logValueProblem(
          logL(b, num(X)),
          c.neg(),
          [c, Q.one.div(c).neg(), X.div(b)],
          both(
            `Write $${num(X)}$ as a power of $${num(b)}$:`,
            `把 $${num(X)}$ 写成 $${num(b)}$ 的幂：`,
            `${logL(b, num(X))} = ${logL(b, powL(b, c.neg()))} = ${num(c.neg())}`,
          ),
        );
      },
    },
    {
      id: "fractional-logarithms",
      title: t("Fractional logarithms", "分数值的对数"),
      explanation: t(
        "When the argument is not a whole power of the base, write both as powers of a common root and solve for the exponent:\n\n$$\\log_{4} 8 = c \\implies 4^{c} = 8 \\implies 2^{2c} = 2^{3} \\implies c = \\frac{3}{2}$$\n\nRoots are fractional powers: $\\log_{5} \\sqrt{5} = \\frac{1}{2}$ and $\\log_{2} \\sqrt[3]{2} = \\frac{1}{3}$.",
        "真数不是底数的整数次幂时，把两者写成同一个数的幂，再解指数：\n\n$$\\log_{4} 8 = c \\implies 4^{c} = 8 \\implies 2^{2c} = 2^{3} \\implies c = \\frac{3}{2}$$\n\n根式是分数指数幂：$\\log_{5} \\sqrt{5} = \\frac{1}{2}$，$\\log_{2} \\sqrt[3]{2} = \\frac{1}{3}$。",
      ),
      generate(rng) {
        if (rng.bool(0.25)) {
          const b = rng.int(2, 12);
          const n = rng.int(2, 4);
          const k = rng.int(1, n - 1);
          const arg = `\\sqrt${n === 2 ? "" : `[${n}]`}{${k === 1 ? b : `${b}^{${k}}`}}`;
          const answer = Q.of(k, n);
          return logValueProblem(
            logL(b, arg),
            answer,
            [Q.of(n, k), Q.of(n), Q.of(k).add(Q.of(n))],
            both(
              `A root is a fractional power: $${arg} = ${b}^{${num(answer)}}$. So`,
              `根式是分数指数幂：$${arg} = ${b}^{${num(answer)}}$。所以`,
              `${logL(b, arg)} = ${num(answer)}`,
            ),
          );
        }
        const { b, c, x, r, p, q } = fractionalPower(rng);
        return logValueProblem(
          logL(b, num(x)),
          c,
          [Q.of(p, q), Q.of(q - p), c.neg()],
          both(
            `Write both numbers as powers of $${r}$ and set the exponents equal:`,
            `把两个数都写成 $${r}$ 的幂，再令指数相等：`,
            `${powL(b, "c")} = ${num(x)}`,
            `${r}^{${p}c} = ${r}^{${q}}`,
            `c = ${num(c)}`,
          ),
        );
      },
    },
  ],
};

export const commonLogarithm: TopicDef = {
  id: "common-logarithm",
  title: t("The Common Logarithm", "常用对数"),
  summary: t(
    "Evaluate base-10 logarithms, solve $\\log x = c$, and place $\\log x$ between consecutive integers.",
    "求以 10 为底的对数，解 $\\log x = c$，并判断 $\\log x$ 在哪两个相邻整数之间。",
  ),
  prerequisites: ["evaluating-logarithms", "scientific-notation"],
  encompasses: [
    { topic: "evaluating-logarithms", weight: 0.3 },
    { topic: "scientific-notation", weight: 0.2 },
    { topic: "two-step-equations", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.HSF.LE.A.4"],
  knowledgePoints: [
    {
      id: "evaluating-common-logarithms",
      title: t("Evaluating common logarithms", "求常用对数的值"),
      explanation: t(
        "The **common logarithm** has base $10$ and is written without a base: $\\log x$ means $\\log_{10} x$. The common logarithm of a power of ten is its exponent:\n\n$$\\log 1000 = 3, \\qquad \\log 0.01 = \\log 10^{-2} = -2, \\qquad \\log \\sqrt{10} = \\frac{1}{2}$$",
        "**常用对数**以 $10$ 为底，书写时省略底数：$\\log x$ 表示 $\\log_{10} x$。$10$ 的幂的常用对数就是它的指数：\n\n$$\\log 1000 = 3, \\qquad \\log 0.01 = \\log 10^{-2} = -2, \\qquad \\log \\sqrt{10} = \\frac{1}{2}$$",
      ),
      generate(rng) {
        const kind = rng.int(0, 3);
        if (kind === 3) {
          const n = rng.int(2, 5);
          const k = rng.int(1, n - 1);
          const ten = k === 1 ? "10" : `10^{${k}}`;
          const arg = rng.bool()
            ? `\\sqrt${n === 2 ? "" : `[${n}]`}{${k === 1 ? "10" : String(10 ** k)}}`
            : `\\sqrt${n === 2 ? "" : `[${n}]`}{${ten}}`;
          const answer = Q.of(k, n);
          return logValueProblem(
            lgL(arg),
            answer,
            [Q.of(n, k), Q.of(10 ** k, n)],
            both(`$${arg} = 10^{${num(answer)}}$, so`, `$${arg} = 10^{${num(answer)}}$，所以`, `${lgL(arg)} = ${num(answer)}`),
          );
        }
        const c = kind === 0 ? rng.int(1, 7) : -rng.int(1, 5);
        const x = Q.of(10).pow(c);
        const shown = kind === 2 ? num(x) : dec(x);
        return logValueProblem(
          lgL(shown),
          Q.of(c),
          [c > 0 ? c + 1 : c - 1, -c, c > 0 ? x.div(Q.of(10)) : c + 1],
          both(`Write $${shown}$ as a power of $10$:`, `把 $${shown}$ 写成 $10$ 的幂：`, `${lgL(shown)} = \\log 10^{${c}} = ${c}`),
        );
      },
    },
    {
      id: "solving-common-logarithm-equations",
      title: t("Solving $\\log x = c$", "解 $\\log x = c$"),
      explanation: t(
        "Since $\\log x = c$ means $10^{c} = x$, an equation in a common logarithm is solved by raising $10$ to the value:\n\n$$3\\log x - 2 = 7 \\implies \\log x = 3 \\implies x = 10^{3} = 1000$$",
        "因为 $\\log x = c$ 表示 $10^{c} = x$，解常用对数方程就是求 $10$ 的这个次幂：\n\n$$3\\log x - 2 = 7 \\implies \\log x = 3 \\implies x = 10^{3} = 1000$$",
      ),
      generate(rng) {
        const c = rng.int(-3, 5);
        const a = rng.pick([1, 1, 2, 3, 4, 5]);
        const d = rng.int(-9, 9);
        const rhs = a * c + d;
        const lhs = `${coefL(a)}\\log x${plusK(d)}`;
        const x = Q.of(10).pow(c);
        return numberProblem({
          prompt: t(`Solve $${lhs} = ${rhs}$.`, `解方程 $${lhs} = ${rhs}$。`),
          answer: x,
          solveFor: "x",
          wrong: [Q.of(10 * c), Q.of(10).pow(c + 1), ...(rhs !== c ? [Q.of(10).pow(rhs)] : []), Q.of(c)],
          solution: both(
            "Isolate the logarithm, then write the equation in exponential form:",
            "先把对数单独留在一边，再写成指数式：",
            `${lhs} = ${rhs}`,
            `\\log x = ${c}`,
            `x = 10^{${c}} = ${num(x)}`,
          ),
        });
      },
    },
    {
      id: "estimating-common-logarithms",
      title: t("Estimating common logarithms", "估计常用对数"),
      explanation: t(
        "Between powers of ten, $\\log x$ lies between their exponents, because $\\log$ increases. Since $100 < 350 < 1000$,\n\n$$2 < \\log 350 < 3.$$\n\nFor a number between $0$ and $1$ the exponents are negative: $0.01 < 0.04 < 0.1$, so $-2 < \\log 0.04 < -1$.",
        "$\\log$ 是增函数，所以当 $x$ 在两个 $10$ 的幂之间时，$\\log x$ 在它们的指数之间。因为 $100 < 350 < 1000$，\n\n$$2 < \\log 350 < 3。$$\n\n对于 $0$ 和 $1$ 之间的数，指数是负数：$0.01 < 0.04 < 0.1$，所以 $-2 < \\log 0.04 < -1$。",
      ),
      generate(rng) {
        const n = rng.int(-3, 4);
        const mantissa = rng.int(2, 9) * 10 + rng.pick([0, 0, 5]);
        const x = Q.of(mantissa, 10).mul(Q.of(10).pow(n));
        const shown = dec(x);
        const digits = shown.replace(/\..*/, "").replace("-", "").length;
        return numberProblem({
          prompt: t(
            `The number $${lgL(shown)}$ lies between two consecutive integers $n$ and $n + 1$. What is $n$?`,
            `$${lgL(shown)}$ 在两个相邻整数 $n$ 与 $n + 1$ 之间。$n$ 是多少？`,
          ),
          answer: n,
          solveFor: "n",
          wrong: [n + 1, digits, -n],
          solution: both(
            `$${shown}$ lies between consecutive powers of ten:`,
            `$${shown}$ 在相邻的两个 $10$ 的幂之间：`,
            `10^{${n}} < ${shown} < 10^{${n + 1}}`,
            `${n} < ${lgL(shown)} < ${n + 1}`,
          ),
        });
      },
    },
  ],
};

export const naturalLogarithm: TopicDef = {
  id: "natural-logarithm",
  title: t("The Natural Logarithm", "自然对数"),
  summary: t(
    "Meet the number $e$, evaluate natural logarithms of powers of $e$, and solve $\\ln x = c$ exactly.",
    "认识数 $e$，求 $e$ 的幂的自然对数，并精确地解 $\\ln x = c$。",
  ),
  prerequisites: ["evaluating-logarithms"],
  encompasses: [{ topic: "evaluating-logarithms", weight: 0.3 }],
  xp: 13,
  standards: ["CCSS.HSF.LE.A.4"],
  knowledgePoints: [
    {
      id: "logarithms-of-powers-of-e",
      title: t("Natural logarithms of powers of $e$", "$e$ 的幂的自然对数"),
      explanation: t(
        "The number $e \\approx 2.71828$ is the value that $\\left(1 + \\frac{1}{n}\\right)^{n}$ approaches as $n$ grows. Like $\\pi$, it is irrational. The **natural logarithm** is the logarithm with base $e$, written $\\ln$: $\\ln x = \\log_{e} x$. So\n\n$$\\ln e^{4} = 4, \\qquad \\ln \\frac{1}{e^{2}} = -2, \\qquad \\ln \\sqrt{e} = \\frac{1}{2}, \\qquad \\ln 1 = 0.$$",
        "数 $e \\approx 2.71828$ 是 $n$ 越来越大时 $\\left(1 + \\frac{1}{n}\\right)^{n}$ 趋近的值。它和 $\\pi$ 一样是无理数。以 $e$ 为底的对数叫做**自然对数**，记作 $\\ln$：$\\ln x = \\log_{e} x$。所以\n\n$$\\ln e^{4} = 4, \\qquad \\ln \\frac{1}{e^{2}} = -2, \\qquad \\ln \\sqrt{e} = \\frac{1}{2}, \\qquad \\ln 1 = 0。$$",
      ),
      generate(rng) {
        const kind = rng.int(0, 3);
        let arg: string;
        let answer: Q;
        if (kind === 0) {
          answer = Q.of(rng.int(2, 12));
          arg = `e^{${num(answer)}}`;
        } else if (kind === 1) {
          answer = Q.of(-rng.int(1, 9));
          arg = answer.eq(Q.of(-1)) ? "\\frac{1}{e}" : `\\frac{1}{e^{${num(answer.neg())}}}`;
        } else if (kind === 2) {
          const n = rng.int(2, 5);
          const k = rng.pick([1, 1, 2, 3, 5, 7].filter((j) => gcd(n, j) === 1));
          answer = Q.of(k, n);
          arg = `\\sqrt${n === 2 ? "" : `[${n}]`}{${k === 1 ? "e" : `e^{${k}}`}}`;
        } else {
          const p = rng.int(2, 6);
          const q = rng.nonZero(-5, 5);
          answer = Q.of(p + q);
          arg = `e^{${p}} \\cdot e^{${q}}`;
        }
        return logValueProblem(
          lnL(arg),
          answer,
          [answer.neg(), Q.one.div(answer.isZero() ? Q.one : answer), answer.add(Q.one)],
          both(`Write the argument as a power of $e$:`, `把真数写成 $e$ 的幂：`, `${lnL(arg)} = \\ln e^{${num(answer)}} = ${num(answer)}`),
        );
      },
    },
    {
      id: "solving-natural-logarithm-equations",
      title: t("Solving $\\ln x = c$", "解 $\\ln x = c$"),
      explanation: t(
        "Since $\\ln x = c$ means $e^{c} = x$, the exact solution of $\\ln x = c$ is a power of $e$. Isolate the logarithm first:\n\n$$2\\ln x + 1 = 7 \\implies \\ln x = 3 \\implies x = e^{3}$$\n\nLeave the answer as the power $e^{3}$; it is not $3e$.",
        "因为 $\\ln x = c$ 表示 $e^{c} = x$，$\\ln x = c$ 的精确解是 $e$ 的幂。先把对数单独留在一边：\n\n$$2\\ln x + 1 = 7 \\implies \\ln x = 3 \\implies x = e^{3}$$\n\n答案写成幂 $e^{3}$，它不是 $3e$。",
      ),
      generate(rng) {
        const c = rng.nonZero(-4, 6);
        const a = rng.pick([1, 1, 2, 3, 4]);
        const d = rng.int(-8, 8);
        const lhs = `${coefL(a)}\\ln x${plusK(d)}`;
        const rhs = a * c + d;
        const answer = c === 1 ? "e" : `e^{${c}}`;
        return expressionProblem({
          prompt: t(`Solve $${lhs} = ${rhs}$. Give the exact solution.`, `解方程 $${lhs} = ${rhs}$，给出精确解。`),
          answer,
          prefix: "x =",
          wrong: [`${c}e`, `e^{${rhs}}`, `10^{${c}}`, `e^{${-c}}`],
          solution: both(
            "Isolate the logarithm, then write the equation in exponential form:",
            "先把对数单独留在一边，再写成指数式：",
            `${lhs} = ${rhs}`,
            `\\ln x = ${c}`,
            `x = ${answer}`,
          ),
        });
      },
    },
    {
      id: "inverse-properties-of-the-natural-logarithm",
      title: t("$e$ and $\\ln$ undo each other", "$e$ 与 $\\ln$ 互相抵消"),
      explanation: t(
        "Raising $e$ to a power and taking $\\ln$ undo each other:\n\n$$\\ln e^{u} = u \\quad \\text{for every } u, \\qquad e^{\\ln x} = x \\quad \\text{for } x > 0.$$\n\nSo $e^{\\ln 7} = 7$ and $\\ln e^{2x - 5} = 2x - 5$.",
        "求 $e$ 的幂与取 $\\ln$ 互相抵消：\n\n$$\\ln e^{u} = u \\quad \\text{（对任意 } u\\text{）}, \\qquad e^{\\ln x} = x \\quad \\text{（} x > 0\\text{）}。$$\n\n所以 $e^{\\ln 7} = 7$，$\\ln e^{2x - 5} = 2x - 5$。",
      ),
      generate(rng) {
        if (rng.bool()) {
          const a = rng.int(2, 9);
          const c = rng.int(-9, 9);
          const n = rng.int(2, 30);
          const expr = `${a}e^{\\ln ${n}}${plusK(c)}`;
          return numberProblem({
            prompt: t(`Evaluate $${expr}$.`, `求 $${expr}$ 的值。`),
            answer: a * n + c,
            wrong: [a + n + c, a * n, a * c + n],
            solution: both("$e^{\\ln x} = x$, so", "$e^{\\ln x} = x$，所以", `${expr} = ${a} \\cdot ${n}${plusK(c)} = ${a * n + c}`),
          });
        }
        const p = rng.nonZero(-5, 6);
        const q = rng.int(-9, 9);
        const u = linear(p, q);
        const k = rng.int(-6, 6);
        const expr = `\\ln e^{${u}}${plusK(k)}`;
        const answer = linear(p, q + k);
        return expressionProblem({
          prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
          answer,
          simplified: true,
          wrong: [linear(p, q), `e^{${answer}}`, linear(p + k, q)],
          solution: both("$\\ln e^{u} = u$, so", "$\\ln e^{u} = u$，所以", `${expr} = ${u}${plusK(k)} = ${answer}`),
        });
      },
    },
  ],
  diagnostic: "solving-natural-logarithm-equations",
};

/** LogBase is the base of a logarithm: a number, 10 written as "\log", or e written as "\ln". */
interface LogBase {
  /** of writes the logarithm of an argument. */
  readonly of: (x: string) => string;
  /** power writes the base to an exponent. */
  readonly power: (e: string) => string;
  /** name is the base in LaTeX. */
  readonly name: string;
  /** prefix is the logarithm without its argument, shown before an answer field. */
  readonly prefix: string;
}

/** numberBase is a logarithm base written with a subscript. */
const numberBase = (b: number): LogBase => ({
  of: (x) => logL(b, x),
  power: (e) => `${b}^{${e}}`,
  name: String(b),
  prefix: `\\log_{${b}}`,
});
const tenBase: LogBase = { of: lgL, power: (e) => `10^{${e}}`, name: "10", prefix: "\\log" };
const eBase: LogBase = { of: lnL, power: (e) => `e^{${e}}`, name: "e", prefix: "\\ln" };

/** anyBase draws a base for rules that hold for every base: usually a number, sometimes 10 or e. */
function anyBase(rng: Rng): LogBase {
  const k = rng.int(0, 9);
  return k === 0 ? tenBase : k === 1 ? eBase : numberBase(rng.pick([2, 3, 4, 5, 6, 7, 8, 9]));
}

export const simplifyingLogarithmicExpressions: TopicDef = {
  id: "simplifying-logarithmic-expressions",
  title: t("Simplifying Logarithmic Expressions", "化简对数式"),
  summary: t(
    "Use $\\log_{b} b^{u} = u$ and $b^{\\log_{b} x} = x$ to simplify expressions, and evaluate sums of logarithms.",
    "用 $\\log_{b} b^{u} = u$ 和 $b^{\\log_{b} x} = x$ 化简式子，并计算对数的和差。",
  ),
  prerequisites: ["common-logarithm", "natural-logarithm"],
  encompasses: [
    { topic: "common-logarithm", weight: 0.3 },
    { topic: "natural-logarithm", weight: 0.3 },
    { topic: "evaluating-logarithms", weight: 0.3 },
  ],
  xp: 13,
  standards: ["CCSS.HSF.BF.B.5"],
  knowledgePoints: [
    {
      id: "logarithm-of-a-power-of-the-base",
      title: t("The logarithm of a power of the base", "底数的幂的对数"),
      explanation: t(
        "A logarithm undoes raising its base to a power:\n\n$$\\log_{b} b^{u} = u$$\n\nThis holds for every exponent $u$, including expressions: $\\log_{3} 3^{2x + 1} = 2x + 1$, $\\log 10^{x - 4} = x - 4$ and $\\ln e^{5x} = 5x$. The base of the logarithm must match the base of the power.",
        "对数抵消对其底数的乘方：\n\n$$\\log_{b} b^{u} = u$$\n\n对任何指数 $u$ 都成立，包括代数式：$\\log_{3} 3^{2x + 1} = 2x + 1$，$\\log 10^{x - 4} = x - 4$，$\\ln e^{5x} = 5x$。对数的底数必须与幂的底数相同。",
      ),
      generate(rng) {
        const base = anyBase(rng);
        const p = rng.nonZero(-5, 6);
        const q = rng.int(-9, 9);
        const k = rng.int(-6, 6);
        const u = linear(p, q);
        const expr = `${base.of(base.power(u))}${plusK(k)}`;
        const answer = linear(p, q + k);
        return expressionProblem({
          prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
          answer,
          simplified: true,
          wrong: [u, linear(p + k, q), ...(base.name !== "e" ? [poly([p * Number(base.name), "x"], [q * Number(base.name) + k, ""])] : [])],
          solution: both(
            `$${base.of(base.power("u"))} = u$, so`,
            `$${base.of(base.power("u"))} = u$，所以`,
            `${expr} = ${u}${plusK(k)} = ${answer}`,
          ),
        });
      },
    },
    {
      id: "base-raised-to-a-logarithm",
      title: t("The base raised to a logarithm", "底数的对数次幂"),
      explanation: t(
        "Raising the base to a logarithm undoes the logarithm:\n\n$$b^{\\log_{b} x} = x \\quad (x > 0)$$\n\nbecause $\\log_{b} x$ is exactly the exponent that turns $b$ into $x$. So $5^{\\log_{5} 9} = 9$, $10^{\\log 3} = 3$ and $e^{\\ln 4} = 4$.",
        "底数的对数次幂抵消对数：\n\n$$b^{\\log_{b} x} = x \\quad (x > 0)$$\n\n因为 $\\log_{b} x$ 正是把 $b$ 变成 $x$ 的那个指数。所以 $5^{\\log_{5} 9} = 9$，$10^{\\log 3} = 3$，$e^{\\ln 4} = 4$。",
      ),
      generate(rng) {
        const base = anyBase(rng);
        const a = rng.int(2, 9);
        const n = rng.int(2, 25);
        const c = rng.int(-12, 12);
        const power = base.power(base.of(String(n)));
        const expr = `${a} \\cdot ${power}${plusK(c)}`;
        return numberProblem({
          prompt: t(`Evaluate $${expr}$.`, `求 $${expr}$ 的值。`),
          answer: a * n + c,
          wrong: [a + n + c, a * n, ...(base.name !== "e" ? [a * Number(base.name) * n + c] : [])],
          solution: both(
            `The base raised to a logarithm of the same base gives the argument: $${power} = ${n}$. So`,
            `底数的同底对数次幂等于真数：$${power} = ${n}$。所以`,
            `${expr} = ${a} \\cdot ${n}${plusK(c)} = ${a * n + c}`,
          ),
        });
      },
    },
    {
      id: "arithmetic-with-logarithms",
      title: t("Arithmetic with logarithms", "对数的运算"),
      explanation: t(
        "To evaluate an expression with several logarithms, evaluate each one, then do the arithmetic:\n\n$$2\\log_{3} 9 - \\log_{2} 8 + \\ln e^{4} = 2 \\cdot 2 - 3 + 4 = 5$$",
        "计算含有几个对数的式子时，先分别求出每个对数，再做运算：\n\n$$2\\log_{3} 9 - \\log_{2} 8 + \\ln e^{4} = 2 \\cdot 2 - 3 + 4 = 5$$",
      ),
      generate(rng) {
        const term = (): { latex: string; value: Q } => {
          const k = rng.int(0, 4);
          if (k === 0) {
            const c = rng.int(-3, 6);
            return { latex: lgL(dec(Q.of(10).pow(c))), value: Q.of(c) };
          }
          if (k === 1) {
            const c = rng.nonZero(-4, 8);
            return { latex: lnL(`e^{${c}}`), value: Q.of(c) };
          }
          if (k === 2) {
            const { b, c, x } = fractionalPower(rng);
            return { latex: logL(b, num(x)), value: c };
          }
          const { b, c, x } = integerPower(rng, -3, 5);
          return { latex: logL(b, num(x)), value: c };
        };
        const [u, v, w] = [term(), term(), term()];
        const a = rng.int(2, 4);
        const s = rng.sign();
        const expr = `${a}${u.latex} ${s > 0 ? "+" : "-"} ${v.latex} - ${w.latex}`;
        const answer = u.value
          .mul(Q.of(a))
          .add(v.value.mul(Q.of(s)))
          .sub(w.value);
        return numberProblem({
          prompt: t(`Evaluate $${expr}$.`, `求 $${expr}$ 的值。`),
          answer,
          wrong: [
            u.value.add(v.value.mul(Q.of(s))).sub(w.value),
            u.value
              .mul(Q.of(a))
              .add(v.value.mul(Q.of(s)))
              .add(w.value),
          ],
          solution: both(
            "Evaluate each logarithm, then do the arithmetic:",
            "先求出每个对数，再做运算：",
            `${expr} = ${a} \\cdot ${paren(u.value)} ${s > 0 ? "+" : "-"} ${paren(v.value)} - ${paren(w.value)} = ${num(answer)}`,
          ),
        });
      },
    },
  ],
};

/** nonPowers are arguments that are not powers of a small base, so their logarithms are not rational. */
const nonPowers = [3, 5, 6, 7, 10, 11, 12, 13, 14, 15, 17, 19, 20, 21, 22, 23];

/** ExactProduct is a product M·N = b^c with M and N not powers of b. */
interface ExactProduct {
  readonly b: number;
  readonly c: number;
  readonly M: number;
  readonly N: number;
}

/** exactProducts lists products of two whole numbers above 1 that are powers of 2 to 15, with neither factor a power of the base. */
const exactProducts: readonly ExactProduct[] = (() => {
  const out: ExactProduct[] = [];
  for (let b = 2; b <= 15; b++) {
    for (let c = 1; c <= 4; c++) {
      const v = b ** c;
      if (v > 1000) break;
      for (let M = 2; M * M <= v; M++) {
        const N = v / M;
        if (!Number.isInteger(N)) continue;
        if (qlog(Q.of(b), Q.of(M)) || qlog(Q.of(b), Q.of(N))) continue;
        out.push({ b, c, M, N });
      }
    }
  }
  return out;
})();

export const productRuleForLogarithms: TopicDef = {
  id: "product-rule-for-logarithms",
  title: t("The Product Rule for Logarithms", "对数的积的法则"),
  summary: t(
    "Use $\\log_{b} (MN) = \\log_{b} M + \\log_{b} N$ to combine, evaluate and expand logarithms.",
    "用 $\\log_{b} (MN) = \\log_{b} M + \\log_{b} N$ 合并、计算和展开对数。",
  ),
  prerequisites: ["simplifying-logarithmic-expressions"],
  encompasses: [
    { topic: "simplifying-logarithmic-expressions", weight: 0.2 },
    { topic: "evaluating-logarithms", weight: 0.3 },
  ],
  xp: 13,
  standards: ["CCSS.HSF.LE.A.4"],
  knowledgePoints: [
    {
      id: "condensing-a-sum",
      title: t("Combining a sum of logarithms", "合并对数的和"),
      explanation: t(
        "Multiplying powers adds exponents, $b^{m} \\cdot b^{n} = b^{m + n}$, and logarithms are exponents. So the logarithm of a product is the sum of the logarithms:\n\n$$\\log_{b} (MN) = \\log_{b} M + \\log_{b} N$$\n\nRead from right to left, it combines a sum into one logarithm: $\\log_{3} 5 + \\log_{3} 7 = \\log_{3} 35$. Both logarithms must have the same base. Note that $\\log_{b} M + \\log_{b} N$ is **not** $\\log_{b} (M + N)$.",
        "同底数幂相乘，指数相加：$b^{m} \\cdot b^{n} = b^{m + n}$，而对数就是指数。所以积的对数等于对数的和：\n\n$$\\log_{b} (MN) = \\log_{b} M + \\log_{b} N$$\n\n从右往左用，可以把和合并成一个对数：$\\log_{3} 5 + \\log_{3} 7 = \\log_{3} 35$。两个对数的底数必须相同。注意 $\\log_{b} M + \\log_{b} N$ **不是** $\\log_{b} (M + N)$。",
      ),
      generate(rng) {
        const base = anyBase(rng);
        const [M, N] = rng.sample(nonPowers.slice(0, 10), 2) as [number, number];
        const K = rng.bool(0.3) ? rng.pick([2, 3, 5]) : 1;
        const terms = [base.of(String(M)), base.of(String(N)), ...(K > 1 ? [base.of(String(K))] : [])];
        const expr = terms.join(" + ");
        const answer = M * N * K;
        return prefixed(
          {
            prompt: t(`Write $${expr}$ as a single logarithm.`, `把 $${expr}$ 写成一个对数。`),
            answer,
            wrong: [M + N + K, M * N, ...(K > 1 ? [M * N + K] : [])],
            solution: both(
              "The sum of logarithms is the logarithm of the product:",
              "对数的和等于积的对数：",
              `${expr} = ${base.of(String(answer))}`,
            ),
          },
          base.prefix,
        );
      },
    },
    {
      id: "evaluating-with-the-product-rule",
      title: t("Evaluating with the product rule", "用积的法则求值"),
      explanation: t(
        "Neither $\\log_{6} 4$ nor $\\log_{6} 9$ is a nice number, but their sum is:\n\n$$\\log_{6} 4 + \\log_{6} 9 = \\log_{6} 36 = 2$$\n\nCombine first, then evaluate.",
        "$\\log_{6} 4$ 和 $\\log_{6} 9$ 都不是简单的数，但它们的和是：\n\n$$\\log_{6} 4 + \\log_{6} 9 = \\log_{6} 36 = 2$$\n\n先合并，再求值。",
      ),
      generate(rng) {
        const { b, c, M, N } = rng.pick(exactProducts);
        const base = b === 10 && rng.bool() ? tenBase : numberBase(b);
        const [A, B] = rng.bool() ? [M, N] : [N, M];
        const expr = `${base.of(String(A))} + ${base.of(String(B))}`;
        return numberProblem({
          prompt: t(`Evaluate $${expr}$.`, `求 $${expr}$ 的值。`),
          answer: c,
          wrong: [b ** c, c + 1, A * B],
          solution: both(
            "Combine into one logarithm, then evaluate:",
            "先合并成一个对数，再求值：",
            `${expr} = ${base.of(String(b ** c))} = ${c}`,
          ),
        });
      },
    },
    {
      id: "expanding-a-product",
      title: t("Expanding the logarithm of a product", "展开积的对数"),
      explanation: t(
        "Read from left to right, the product rule splits a logarithm into a sum. A factor that is a power of the base gives a number:\n\n$$\\log_{2} (8x) = \\log_{2} 8 + \\log_{2} x = 3 + \\log_{2} x$$\n\nThe number is **added** to $\\log_{2} x$, not multiplied by it.",
        "从左往右用，积的法则把一个对数拆成和。底数的幂作为因数时得到一个数：\n\n$$\\log_{2} (8x) = \\log_{2} 8 + \\log_{2} x = 3 + \\log_{2} x$$\n\n这个数与 $\\log_{2} x$ 是**相加**，而不是相乘。",
      ),
      generate(rng) {
        const b = rng.pick([2, 3, 4, 5, 10]);
        const n = rng.int(1, b === 10 ? 4 : b === 2 ? 6 : 3);
        const base = b === 10 && rng.bool(0.6) ? tenBase : numberBase(b);
        const k = b ** n;
        const v = rng.pick(["x", "y", "a", "t"]);
        const two = rng.bool(0.4);
        const w = v === "y" ? "x" : "y";
        const arg = `${k}${v}${two ? w : ""}`;
        const rest = `${base.of(v)}${two ? ` + ${base.of(w)}` : ""}`;
        return oneOf(rng, {
          prompt: t(`Which expression equals $${base.of(arg)}$?`, `下列哪个式子等于 $${base.of(arg)}$？`),
          right: m(`${n} + ${rest}`),
          wrong: [
            m(`${n}${base.of(v)}${two ? ` + ${base.of(w)}` : ""}`),
            m(`${k} + ${rest}`),
            m(`${base.of(String(k))} \\cdot ${base.of(v)}${two ? ` \\cdot ${base.of(w)}` : ""}`),
            m(`${n + 1} + ${rest}`),
          ],
          solution: both(
            "Split the product into a sum and evaluate the logarithm of the number:",
            "把积拆成和，再求数的对数：",
            `${base.of(arg)} = ${base.of(String(k))} + ${rest} = ${n} + ${rest}`,
          ),
        });
      },
    },
  ],
};

export const quotientRuleForLogarithms: TopicDef = {
  id: "quotient-rule-for-logarithms",
  title: t("The Quotient Rule for Logarithms", "对数的商的法则"),
  summary: t(
    "Use $\\log_{b} \\frac{M}{N} = \\log_{b} M - \\log_{b} N$ to combine, evaluate and expand logarithms.",
    "用 $\\log_{b} \\frac{M}{N} = \\log_{b} M - \\log_{b} N$ 合并、计算和展开对数。",
  ),
  prerequisites: ["product-rule-for-logarithms"],
  encompasses: [
    { topic: "product-rule-for-logarithms", weight: 0.3 },
    { topic: "evaluating-logarithms", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.HSF.LE.A.4"],
  knowledgePoints: [
    {
      id: "condensing-a-difference",
      title: t("Combining a difference of logarithms", "合并对数的差"),
      explanation: t(
        "Dividing powers subtracts exponents, $\\frac{b^{m}}{b^{n}} = b^{m - n}$, so the logarithm of a quotient is the difference of the logarithms:\n\n$$\\log_{b} \\frac{M}{N} = \\log_{b} M - \\log_{b} N$$\n\nSo $\\log_{5} 12 - \\log_{5} 3 = \\log_{5} 4$ and $\\log_{2} 3 - \\log_{2} 7 = \\log_{2} \\frac{3}{7}$. The logarithm being subtracted goes in the denominator.",
        "同底数幂相除，指数相减：$\\frac{b^{m}}{b^{n}} = b^{m - n}$，所以商的对数等于对数的差：\n\n$$\\log_{b} \\frac{M}{N} = \\log_{b} M - \\log_{b} N$$\n\n所以 $\\log_{5} 12 - \\log_{5} 3 = \\log_{5} 4$，$\\log_{2} 3 - \\log_{2} 7 = \\log_{2} \\frac{3}{7}$。被减去的对数的真数放在分母。",
      ),
      generate(rng) {
        const base = anyBase(rng);
        const [M, N] = rng.sample([2, 3, 5, 6, 7, 10, 11, 12, 14, 15, 18, 20, 21, 24, 28, 30, 35, 36, 40], 2) as [number, number];
        const expr = `${base.of(String(M))} - ${base.of(String(N))}`;
        const answer = Q.of(M, N);
        return prefixed(
          {
            prompt: t(`Write $${expr}$ as a single logarithm.`, `把 $${expr}$ 写成一个对数。`),
            answer,
            wrong: [M - N, Q.of(N, M), M * N],
            solution: both(
              "The difference of logarithms is the logarithm of the quotient:",
              "对数的差等于商的对数：",
              `${expr} = ${base.of(`\\frac{${M}}{${N}}`)} = ${base.of(num(answer))}`,
            ),
          },
          base.prefix,
        );
      },
    },
    {
      id: "evaluating-with-the-quotient-rule",
      title: t("Evaluating with the quotient rule", "用商的法则求值"),
      explanation: t(
        "As with sums, combine first, then evaluate:\n\n$$\\log_{2} 40 - \\log_{2} 5 = \\log_{2} 8 = 3, \\qquad \\log_{3} 2 - \\log_{3} 18 = \\log_{3} \\frac{1}{9} = -2$$",
        "和求和一样，先合并，再求值：\n\n$$\\log_{2} 40 - \\log_{2} 5 = \\log_{2} 8 = 3, \\qquad \\log_{3} 2 - \\log_{3} 18 = \\log_{3} \\frac{1}{9} = -2$$",
      ),
      generate(rng) {
        for (;;) {
          const b = rng.pick([2, 3, 4, 5, 6, 10]);
          const c = rng.int(1, b === 2 ? 5 : 3);
          const N = rng.pick(nonPowers);
          if (qlog(Q.of(b), Q.of(N))) continue;
          const M = N * b ** c;
          if (M > 2000) continue;
          const base = b === 10 && rng.bool() ? tenBase : numberBase(b);
          const flip = rng.bool(0.35);
          const [A, B] = flip ? [N, M] : [M, N];
          const answer = flip ? -c : c;
          const expr = `${base.of(String(A))} - ${base.of(String(B))}`;
          return numberProblem({
            prompt: t(`Evaluate $${expr}$.`, `求 $${expr}$ 的值。`),
            answer,
            wrong: [-answer, b ** c, answer + 1],
            solution: both(
              "Combine into one logarithm, then evaluate:",
              "先合并成一个对数，再求值：",
              `${expr} = ${base.of(num(Q.of(A, B)))} = ${answer}`,
            ),
          });
        }
      },
    },
    {
      id: "expanding-a-quotient",
      title: t("Expanding the logarithm of a quotient", "展开商的对数"),
      explanation: t(
        "Read from left to right, the quotient rule splits a logarithm into a difference, numerator minus denominator:\n\n$$\\log_{3} \\frac{x}{9} = \\log_{3} x - 2, \\qquad \\log_{3} \\frac{9}{x} = 2 - \\log_{3} x$$",
        "从左往右用，商的法则把一个对数拆成差：分子的对数减去分母的对数：\n\n$$\\log_{3} \\frac{x}{9} = \\log_{3} x - 2, \\qquad \\log_{3} \\frac{9}{x} = 2 - \\log_{3} x$$",
      ),
      generate(rng) {
        const b = rng.pick([2, 3, 4, 5, 10]);
        const n = rng.int(1, b === 10 ? 4 : b === 2 ? 6 : 3);
        const base = b === 10 && rng.bool(0.6) ? tenBase : numberBase(b);
        const k = b ** n;
        const v = rng.pick(["x", "y", "a", "t"]);
        const over = rng.bool();
        const arg = over ? `\\frac{${v}}{${k}}` : `\\frac{${k}}{${v}}`;
        const L = base.of(v);
        const right = over ? `${L} - ${n}` : `${n} - ${L}`;
        return oneOf(rng, {
          prompt: t(`Which expression equals $${base.of(arg)}$?`, `下列哪个式子等于 $${base.of(arg)}$？`),
          right: m(right),
          wrong: [
            m(over ? `${n} - ${L}` : `${L} - ${n}`),
            m(over ? `\\frac{${L}}{${n}}` : `\\frac{${n}}{${L}}`),
            m(over ? `${L} - ${k}` : `${k} - ${L}`),
            m(over ? `${L} + ${n}` : `${n} + ${L}`),
          ],
          solution: both(
            "Numerator minus denominator, then evaluate the logarithm of the number:",
            "分子的对数减去分母的对数，再求数的对数：",
            `${base.of(arg)} = ${over ? `${L} - ${base.of(String(k))}` : `${base.of(String(k))} - ${L}`} = ${right}`,
          ),
        });
      },
    },
  ],
};

export const powerRuleForLogarithms: TopicDef = {
  id: "power-rule-for-logarithms",
  title: t("The Power Rule for Logarithms", "对数的幂的法则"),
  summary: t(
    "Use $\\log_{b} M^{k} = k \\log_{b} M$ to evaluate logarithms of powers and roots and to move coefficients into the argument.",
    "用 $\\log_{b} M^{k} = k \\log_{b} M$ 计算幂和根式的对数，并把系数移到真数里。",
  ),
  prerequisites: ["product-rule-for-logarithms"],
  encompasses: [
    { topic: "product-rule-for-logarithms", weight: 0.2 },
    { topic: "evaluating-logarithms", weight: 0.3 },
    { topic: "writing-radicals-using-fractional-exponents", weight: 0.2 },
  ],
  xp: 13,
  standards: ["CCSS.HSF.LE.A.4"],
  knowledgePoints: [
    {
      id: "logarithms-of-powers",
      title: t("Logarithms of powers", "幂的对数"),
      explanation: t(
        "Raising a power to a power multiplies exponents, $(b^{m})^{k} = b^{mk}$, so an exponent inside a logarithm comes out as a factor:\n\n$$\\log_{b} M^{k} = k \\log_{b} M$$\n\nSo $\\log_{2} 8^{5} = 5 \\log_{2} 8 = 5 \\cdot 3 = 15$, and a root is a fractional power: $\\log_{3} \\sqrt{27} = \\frac{1}{2} \\log_{3} 27 = \\frac{3}{2}$.",
        "幂的乘方，指数相乘：$(b^{m})^{k} = b^{mk}$，所以真数的指数可以作为因数提到对数前面：\n\n$$\\log_{b} M^{k} = k \\log_{b} M$$\n\n所以 $\\log_{2} 8^{5} = 5 \\log_{2} 8 = 5 \\cdot 3 = 15$；根式是分数指数幂：$\\log_{3} \\sqrt{27} = \\frac{1}{2} \\log_{3} 27 = \\frac{3}{2}$。",
      ),
      generate(rng) {
        let power: PowerOf;
        do power = rng.bool(0.4) ? fractionalPower(rng) : integerPower(rng, 1, 4);
        while (power.x.d !== 1n || power.x.n > 400n);
        const { b, c, x } = power;
        const root = rng.bool(0.3);
        const k = root ? Q.of(1, rng.int(2, 3)) : Q.of(rng.int(2, 9));
        const arg = root ? `\\sqrt${k.d === 2n ? "" : "[3]"}{${num(x)}}` : `${num(x)}^{${num(k)}}`;
        const answer = c.mul(k);
        return logValueProblem(
          logL(b, arg),
          answer,
          [c.add(k), ...(c.isInteger() && k.isInteger() ? [c.pow(Number(k.n))] : []), c.div(k)],
          both(
            "Bring the exponent in front, then evaluate:",
            "把指数提到前面，再求值：",
            `${logL(b, arg)} = ${num(k)} \\cdot ${logL(b, num(x))} = ${num(k)} \\cdot ${paren(c)} = ${num(answer)}`,
          ),
        );
      },
    },
    {
      id: "moving-coefficients-into-the-argument",
      title: t("Moving a coefficient into the argument", "把系数移到真数里"),
      explanation: t(
        "Read from right to left, the power rule turns a coefficient into an exponent of the argument:\n\n$$3 \\log_{2} 5 = \\log_{2} 5^{3} = \\log_{2} 125, \\qquad \\frac{1}{2} \\log_{7} 36 = \\log_{7} 36^{\\frac{1}{2}} = \\log_{7} 6$$\n\nThe coefficient becomes a power, not a factor: $3 \\log_{2} 5$ is not $\\log_{2} 15$.",
        "从右往左用，幂的法则把系数变成真数的指数：\n\n$$3 \\log_{2} 5 = \\log_{2} 5^{3} = \\log_{2} 125, \\qquad \\frac{1}{2} \\log_{7} 36 = \\log_{7} 36^{\\frac{1}{2}} = \\log_{7} 6$$\n\n系数变成指数，而不是因数：$3 \\log_{2} 5$ 不是 $\\log_{2} 15$。",
      ),
      generate(rng) {
        const base = anyBase(rng);
        if (rng.bool(0.35)) {
          const n = rng.int(2, rng.pick([3, 12]));
          const r = rng.int(2, n === 2 ? 30 : 5);
          const arg = r ** n;
          const k = Q.of(1, n);
          const expr = `${num(k)}${base.of(String(arg))}`;
          return prefixed(
            {
              prompt: t(`Write $${expr}$ as a single logarithm.`, `把 $${expr}$ 写成一个对数。`),
              answer: r,
              wrong: [Q.of(arg, n), arg, r * n],
              solution: both(
                `Move the coefficient into the exponent: a power of $${num(k)}$ is a root.`,
                `把系数移到指数上：$${num(k)}$ 次幂就是开方。`,
                `${expr} = ${base.of(`${arg}^{${num(k)}}`)} = ${base.of(String(r))}`,
              ),
            },
            base.prefix,
          );
        }
        const k = rng.int(2, 4);
        const M = rng.int(2, k === 2 ? 15 : k === 3 ? 8 : 5);
        const expr = `${k}${base.of(String(M))}`;
        return prefixed(
          {
            prompt: t(`Write $${expr}$ as a single logarithm.`, `把 $${expr}$ 写成一个对数。`),
            answer: M ** k,
            wrong: [k * M, k ** M, M + k],
            solution: both(
              "Move the coefficient into the exponent of the argument:",
              "把系数移到真数的指数上：",
              `${expr} = ${base.of(`${M}^{${k}}`)} = ${base.of(String(M ** k))}`,
            ),
          },
          base.prefix,
        );
      },
    },
    {
      id: "power-rule-with-unknown-arguments",
      title: t("Logarithms of powers of an unknown", "未知数的幂的对数"),
      explanation: t(
        "If you know $\\log_{b} x$, the power rule gives the logarithm of every power of $x$. With $\\log_{b} x = 4$:\n\n$$\\log_{b} x^{3} = 3 \\cdot 4 = 12, \\qquad \\log_{b} \\sqrt{x} = \\frac{1}{2} \\cdot 4 = 2, \\qquad \\log_{b} \\frac{1}{x^{2}} = -2 \\cdot 4 = -8$$",
        "已知 $\\log_{b} x$ 时，幂的法则给出 $x$ 的任何次幂的对数。若 $\\log_{b} x = 4$：\n\n$$\\log_{b} x^{3} = 3 \\cdot 4 = 12, \\qquad \\log_{b} \\sqrt{x} = \\frac{1}{2} \\cdot 4 = 2, \\qquad \\log_{b} \\frac{1}{x^{2}} = -2 \\cdot 4 = -8$$",
      ),
      generate(rng) {
        const L = Q.of(rng.nonZero(-6, 9));
        const kind = rng.int(0, 3);
        const [arg, k] =
          kind === 0
            ? (() => {
                const e = rng.int(2, 7);
                return [`x^{${e}}`, Q.of(e)] as const;
              })()
            : kind === 1
              ? (() => {
                  const n = rng.int(2, 3);
                  return [`\\sqrt${n === 2 ? "" : "[3]"}{x}`, Q.of(1, n)] as const;
                })()
              : kind === 2
                ? (() => {
                    const e = rng.int(1, 4);
                    return [`\\frac{1}{${e === 1 ? "x" : `x^{${e}}`}}`, Q.of(-e)] as const;
                  })()
                : (() => {
                    const e = rng.int(2, 5);
                    const n = rng.pick([2, 3].filter((d) => gcd(d, e) === 1));
                    return [`\\sqrt${n === 2 ? "" : `[${n}]`}{x^{${e}}}`, Q.of(e, n)] as const;
                  })();
        const base = rng.pick(["b", "2", "5", "10"]);
        const log = (x: string) => (base === "10" ? lgL(x) : logL(base, x));
        const answer = L.mul(k);
        return numberProblem({
          prompt: t(`Given that $${log("x")} = ${num(L)}$, find $${log(arg)}$.`, `已知 $${log("x")} = ${num(L)}$，求 $${log(arg)}$。`),
          answer,
          wrong: [L.add(k), ...(k.isInteger() && k.sign() > 0 ? [L.pow(Number(k.n))] : []), L.div(k)],
          solution: both(
            `Write the argument as a power of $x$, $${arg} = x^{${num(k)}}$, and bring the exponent in front:`,
            `把真数写成 $x$ 的幂 $${arg} = x^{${num(k)}}$，再把指数提到前面：`,
            `${log(arg)} = ${num(k)} \\cdot ${log("x")} = ${num(k)} \\cdot ${paren(L)} = ${num(answer)}`,
          ),
        });
      },
    },
  ],
};

export const combiningLawsOfLogarithms: TopicDef = {
  id: "combining-laws-of-logarithms",
  title: t("Combining the Laws of Logarithms", "综合运用对数运算法则"),
  summary: t(
    "Combine the product, quotient and power rules to condense, evaluate and expand logarithmic expressions.",
    "综合运用积、商、幂的法则，合并、计算和展开对数式。",
  ),
  prerequisites: ["quotient-rule-for-logarithms", "power-rule-for-logarithms"],
  encompasses: [
    { topic: "quotient-rule-for-logarithms", weight: 0.5 },
    { topic: "power-rule-for-logarithms", weight: 0.5 },
    { topic: "product-rule-for-logarithms", weight: 0.4 },
  ],
  xp: 16,
  standards: ["CCSS.HSF.LE.A.4"],
  knowledgePoints: [
    {
      id: "condensing-expressions",
      title: t("Condensing into one logarithm", "合并成一个对数"),
      explanation: t(
        "To write an expression as a single logarithm, first move every coefficient into its argument with the power rule, then combine sums into products and differences into quotients:\n\n$$2\\log_{3} 5 + \\log_{3} 4 - \\log_{3} 10 = \\log_{3} 25 + \\log_{3} 4 - \\log_{3} 10 = \\log_{3} \\frac{25 \\cdot 4}{10} = \\log_{3} 10$$",
        "要把式子写成一个对数，先用幂的法则把每个系数移到真数的指数上，再把和合并成积、把差合并成商：\n\n$$2\\log_{3} 5 + \\log_{3} 4 - \\log_{3} 10 = \\log_{3} 25 + \\log_{3} 4 - \\log_{3} 10 = \\log_{3} \\frac{25 \\cdot 4}{10} = \\log_{3} 10$$",
      ),
      generate(rng) {
        const base = anyBase(rng);
        const k = rng.int(2, 3);
        const M = rng.int(2, k === 2 ? 9 : 5);
        const N = rng.pick([2, 3, 5, 6, 7, 10]);
        const P = rng.pick([2, 3, 4, 5, 6, 8, 10, 12, 15, 20]);
        const answer = Q.of(M ** k * N, P);
        const expr = `${k}${base.of(String(M))} + ${base.of(String(N))} - ${base.of(String(P))}`;
        return prefixed(
          {
            prompt: t(`Write $${expr}$ as a single logarithm.`, `把 $${expr}$ 写成一个对数。`),
            answer,
            wrong: [Q.of(k * M * N, P), Q.of(M ** k + N - P), Q.of(M ** k * N * P), Q.of(k * M + N - P)],
            solution: both(
              "Move the coefficient into the argument, then combine:",
              "先把系数移到真数上，再合并：",
              `${expr} = ${base.of(String(M ** k))} + ${base.of(String(N))} - ${base.of(String(P))}`,
              `= ${base.of(`\\frac{${M ** k} \\cdot ${N}}{${P}}`)} = ${base.of(num(answer))}`,
            ),
          },
          base.prefix,
        );
      },
    },
    {
      id: "evaluating-combinations",
      title: t("Evaluating combinations of logarithms", "计算对数的组合"),
      explanation: t(
        "An expression of logarithms that are not nice numbers can still have a nice value. Condense it, then evaluate:\n\n$$2\\log_{6} 3 + \\log_{6} 4 = \\log_{6} (9 \\cdot 4) = \\log_{6} 36 = 2$$",
        "由不是简单数的对数组成的式子，值仍可能是简单的数。先合并，再求值：\n\n$$2\\log_{6} 3 + \\log_{6} 4 = \\log_{6} (9 \\cdot 4) = \\log_{6} 36 = 2$$",
      ),
      generate(rng) {
        for (;;) {
          const b = rng.pick([2, 3, 5, 6, 10, 12, 15]);
          const c = rng.int(-2, 3);
          const M = rng.int(2, 6);
          const k = rng.int(2, 3);
          if (qlog(Q.of(b), Q.of(M))) continue;
          const Mk = M ** k;
          const target = Q.of(b).pow(c);
          const plus = rng.bool();
          const other = plus ? target.div(Q.of(Mk)) : Q.of(Mk).div(target);
          if (!other.isInteger() || other.cmp(Q.one) <= 0 || other.n > 500n || qlog(Q.of(b), other)) continue;
          const base = b === 10 && rng.bool() ? tenBase : numberBase(b);
          const expr = `${k}${base.of(String(M))} ${plus ? "+" : "-"} ${base.of(num(other))}`;
          return numberProblem({
            prompt: t(`Evaluate $${expr}$.`, `求 $${expr}$ 的值。`),
            answer: c,
            wrong: [c + 1, ...(c !== 0 ? [-c] : []), num(target) === String(c) ? 0 : target],
            solution: both(
              "Move the coefficient into the argument, combine, then evaluate:",
              "先把系数移到真数上，合并，再求值：",
              `${expr} = ${base.of(String(Mk))} ${plus ? "+" : "-"} ${base.of(num(other))} = ${base.of(num(target))} = ${c}`,
            ),
          });
        }
      },
    },
    {
      id: "in-terms-of-given-logarithms",
      title: t("Writing logarithms in terms of given ones", "用已知对数表示"),
      explanation: t(
        "If $\\log_{b} 2 = p$ and $\\log_{b} 3 = q$, every number built from $2$ and $3$ by products, quotients and powers has a logarithm in terms of $p$ and $q$. Factor the number into primes, then expand:\n\n$$\\log_{b} 12 = \\log_{b} (2^{2} \\cdot 3) = 2\\log_{b} 2 + \\log_{b} 3 = 2p + q$$\n\nA factor of $b$ itself adds $\\log_{b} b = 1$.",
        "若 $\\log_{b} 2 = p$，$\\log_{b} 3 = q$，那么由 $2$ 和 $3$ 经过乘、除、乘方得到的数，它们的对数都可以用 $p$ 和 $q$ 表示。先分解质因数，再展开：\n\n$$\\log_{b} 12 = \\log_{b} (2^{2} \\cdot 3) = 2\\log_{b} 2 + \\log_{b} 3 = 2p + q$$\n\n因数 $b$ 本身贡献 $\\log_{b} b = 1$。",
      ),
      generate(rng) {
        const [P, R] = rng.pick([
          [2, 3],
          [2, 5],
          [3, 5],
          [2, 7],
        ] as const);
        for (;;) {
          const i = rng.int(-2, 4);
          const j = rng.int(-2, 3);
          const withB = rng.bool(0.25);
          if (i === 0 || j === 0 || (i === 1 && j === 1 && !withB)) continue;
          const value = Q.of(P).pow(i).mul(Q.of(R).pow(j));
          if (value.n > 500n || value.d > 500n) continue;
          const arg = withB
            ? `${value.isInteger() ? num(value) : `\\frac{${value.n}b}{${value.d}}`}${value.isInteger() ? "b" : ""}`
            : num(value);
          const answer = poly([i, "p"], [j, "q"], [withB ? 1 : 0, ""]);
          const factored = `${P}^{${i}} \\cdot ${R}^{${j}}${withB ? " \\cdot b" : ""}`;
          return expressionProblem({
            prompt: t(
              `Let $${logL("b", String(P))} = p$ and $${logL("b", String(R))} = q$. Write $${logL("b", arg)}$ in terms of $p$ and $q$.`,
              `设 $${logL("b", String(P))} = p$，$${logL("b", String(R))} = q$。用 $p$ 和 $q$ 表示 $${logL("b", arg)}$。`,
            ),
            answer,
            simplified: true,
            wrong: [
              poly([j, "p"], [i, "q"], [withB ? 1 : 0, ""]),
              poly([i * j, "pq"], [withB ? 1 : 0, ""]),
              poly([i, "p"], [j, "q"]),
              poly([P ** Math.abs(i), "p"], [R ** Math.abs(j), "q"]),
            ],
            solution: both(
              `Factor the argument, $${arg} = ${factored}$, then expand:`,
              `分解真数 $${arg} = ${factored}$，再展开：`,
              `${logL("b", arg)} = ${i}${logL("b", String(P))} ${j < 0 ? "-" : "+"} ${Math.abs(j)}${logL("b", String(R))}${withB ? ` + ${logL("b", "b")}` : ""} = ${answer}`,
            ),
          });
        }
      },
    },
    {
      id: "expanding-expressions",
      title: t("Expanding into simple logarithms", "展开成简单的对数"),
      explanation: t(
        "To expand a logarithm, split products into sums and quotients into differences, then bring exponents in front. Roots are fractional powers. With $A = \\log_{b} x$, $B = \\log_{b} y$ and $C = \\log_{b} z$:\n\n$$\\log_{b} \\frac{x^{2}\\sqrt{y}}{z^{3}} = 2\\log_{b} x + \\frac{1}{2}\\log_{b} y - 3\\log_{b} z = 2A + \\frac{1}{2}B - 3C$$",
        "展开对数时，把积拆成和，把商拆成差，再把指数提到前面。根式是分数指数幂。设 $A = \\log_{b} x$，$B = \\log_{b} y$，$C = \\log_{b} z$：\n\n$$\\log_{b} \\frac{x^{2}\\sqrt{y}}{z^{3}} = 2\\log_{b} x + \\frac{1}{2}\\log_{b} y - 3\\log_{b} z = 2A + \\frac{1}{2}B - 3C$$",
      ),
      generate(rng) {
        const i = rng.int(1, 5);
        const yRoot = rng.bool(0.4);
        const j = yRoot ? Q.of(1, rng.int(2, 3)) : Q.of(rng.int(1, 4));
        const k = rng.int(1, 4);
        const pw = (v: string, e: number) => (e === 1 ? v : `${v}^{${e}}`);
        const yPart = yRoot ? `\\sqrt${j.d === 2n ? "" : "[3]"}{y}` : pw("y", Number(j.n));
        const zTop = rng.bool(0.3);
        const top = `${pw("x", i)}${yPart}${zTop ? pw("z", k) : ""}`;
        const arg = zTop ? top : `\\frac{${top}}{${pw("z", k)}}`;
        const sk = zTop ? k : -k;
        const answer = poly([i, "A"], [j, "B"], [sk, "C"]);
        return expressionProblem({
          prompt: t(
            `Let $A = ${logL("b", "x")}$, $B = ${logL("b", "y")}$ and $C = ${logL("b", "z")}$. Write $${logL("b", arg)}$ in terms of $A$, $B$ and $C$.`,
            `设 $A = ${logL("b", "x")}$，$B = ${logL("b", "y")}$，$C = ${logL("b", "z")}$。用 $A$、$B$、$C$ 表示 $${logL("b", arg)}$。`,
          ),
          answer,
          simplified: true,
          wrong: [
            poly([i, "A"], [j, "B"], [-sk, "C"]),
            poly([1, "A"], [1, "B"], [sk > 0 ? 1 : -1, "C"]),
            ...(yRoot ? [poly([i, "A"], [Number(j.d), "B"], [sk, "C"])] : []),
            poly([i, "A"], [j, "B"], [sk, ""]),
          ],
          solution: both(
            "Split the argument into a sum and difference of logarithms, then bring each exponent in front:",
            "把真数拆成对数的和与差，再把每个指数提到前面：",
            `${logL("b", arg)} = ${i}${logL("b", "x")} + ${num(j)}${logL("b", "y")} ${sk > 0 ? "+" : "-"} ${k}${logL("b", "z")} = ${answer}`,
          ),
        });
      },
    },
  ],
  diagnostic: "condensing-expressions",
};

/** lnTable writes the given approximations of natural logarithms: "\ln 2 \approx 0.6931". */
const lnGiven = (...ns: readonly number[]) => ns.map((n) => `${lnL(String(n))} \\approx ${dec(lnQ(n))}`).join(", \\quad ");

export const changeOfBaseFormula: TopicDef = {
  id: "change-of-base-formula",
  title: t("The Change of Base Formula for Logarithms", "对数的换底公式"),
  summary: t(
    "Rewrite $\\log_{a} x$ as $\\frac{\\log_{b} x}{\\log_{b} a}$ to evaluate products of logarithms and approximate any logarithm with natural logarithms.",
    "把 $\\log_{a} x$ 写成 $\\frac{\\log_{b} x}{\\log_{b} a}$，计算对数的积，并用自然对数求任意对数的近似值。",
  ),
  prerequisites: ["combining-laws-of-logarithms"],
  encompasses: [
    { topic: "power-rule-for-logarithms", weight: 0.3 },
    { topic: "evaluating-logarithms", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.LE.A.4"],
  knowledgePoints: [
    {
      id: "writing-the-change-of-base",
      title: t("The change of base formula", "换底公式"),
      explanation: t(
        "Let $c = \\log_{a} x$, so $a^{c} = x$. Taking $\\log_{b}$ of both sides and using the power rule gives $c \\log_{b} a = \\log_{b} x$, so\n\n$$\\log_{a} x = \\frac{\\log_{b} x}{\\log_{b} a}$$\n\nfor any base $b$. The argument goes on top and the old base at the bottom: $\\log_{7} 20 = \\frac{\\ln 20}{\\ln 7}$. A quotient of logarithms is not the logarithm of a quotient: $\\frac{\\ln 20}{\\ln 7} \\ne \\ln \\frac{20}{7}$.",
        "设 $c = \\log_{a} x$，则 $a^{c} = x$。两边取 $\\log_{b}$ 并用幂的法则，得 $c \\log_{b} a = \\log_{b} x$，所以对任意底数 $b$：\n\n$$\\log_{a} x = \\frac{\\log_{b} x}{\\log_{b} a}$$\n\n真数在分子，原来的底数在分母：$\\log_{7} 20 = \\frac{\\ln 20}{\\ln 7}$。对数的商不是商的对数：$\\frac{\\ln 20}{\\ln 7} \\ne \\ln \\frac{20}{7}$。",
      ),
      generate(rng) {
        const [a, x] = rng.sample([2, 3, 5, 6, 7, 11, 12, 13, 15, 17, 19, 20, 30], 2) as [number, number];
        const useLn = rng.bool();
        const L = (v: number) => (useLn ? lnL(String(v)) : lgL(String(v)));
        const frac = (p: string, q: string) => `\\frac{${p}}{${q}}`;
        return oneOf(rng, {
          prompt: t(`Which expression equals $${logL(a, String(x))}$?`, `下列哪个式子等于 $${logL(a, String(x))}$？`),
          right: m(frac(L(x), L(a))),
          wrong: [
            m(frac(L(a), L(x))),
            m(useLn ? lnL(frac(String(x), String(a))) : lgL(frac(String(x), String(a)))),
            m(`${L(x)} - ${L(a)}`),
            m(frac(L(x), String(a))),
          ],
          solution: both(
            "The argument goes on top, the old base at the bottom:",
            "真数在分子，原来的底数在分母：",
            `${logL(a, String(x))} = ${frac(L(x), L(a))}`,
          ),
        });
      },
    },
    {
      id: "products-of-logarithms",
      title: t("Products of logarithms", "对数的积"),
      explanation: t(
        "Writing both factors with the change of base formula makes the middle number cancel:\n\n$$\\log_{a} b \\cdot \\log_{b} c = \\frac{\\ln b}{\\ln a} \\cdot \\frac{\\ln c}{\\ln b} = \\frac{\\ln c}{\\ln a} = \\log_{a} c$$\n\nSo $\\log_{3} 5 \\cdot \\log_{5} 81 = \\log_{3} 81 = 4$. In particular $\\log_{a} b \\cdot \\log_{b} a = 1$.",
        "用换底公式改写两个因式，中间的数就约掉了：\n\n$$\\log_{a} b \\cdot \\log_{b} c = \\frac{\\ln b}{\\ln a} \\cdot \\frac{\\ln c}{\\ln b} = \\frac{\\ln c}{\\ln a} = \\log_{a} c$$\n\n所以 $\\log_{3} 5 \\cdot \\log_{5} 81 = \\log_{3} 81 = 4$。特别地，$\\log_{a} b \\cdot \\log_{b} a = 1$。",
      ),
      generate(rng) {
        for (;;) {
          const { r, top } = rng.pick(rootFamilies);
          const p = rng.int(1, top);
          const q = rng.nonZero(-top, top + 2);
          const a = Q.of(r).pow(p);
          const c = Q.of(r).pow(q);
          if (c.n > 2000n || c.d > 2000n) continue;
          const mid = rng.pick([2, 3, 5, 6, 7, 10, 11]);
          if (qlog(Q.of(r), Q.of(mid))) continue;
          const answer = Q.of(q, p);
          const expr = `${logL(a, String(mid))} \\cdot ${logL(mid, num(c))}`;
          return numberProblem({
            prompt: t(`Evaluate $${expr}$.`, `求 $${expr}$ 的值。`),
            answer,
            wrong: [Q.of(p, q), Q.of(q), answer.neg()],
            solution: both(
              "Change both logarithms to natural logarithms; the middle number cancels:",
              "把两个对数都换成自然对数，中间的数约掉：",
              `${expr} = \\frac{${lnL(String(mid))}}{${lnL(num(a))}} \\cdot \\frac{${lnL(num(c))}}{${lnL(String(mid))}} = ${logL(a, num(c))} = ${num(answer)}`,
            ),
          });
        }
      },
    },
    {
      id: "approximating-logarithms",
      title: t("Approximating logarithms", "求对数的近似值"),
      explanation: t(
        "Calculators have keys for $\\ln$ and $\\log$, so the change of base formula approximates a logarithm to any base:\n\n$$\\log_{3} 7 = \\frac{\\ln 7}{\\ln 3} \\approx \\frac{1.9459}{1.0986} \\approx 1.77$$\n\nA quick check: $3^{1} = 3 < 7 < 9 = 3^{2}$, so the answer must lie between $1$ and $2$.",
        "计算器上有 $\\ln$ 键和 $\\log$ 键，所以用换底公式可以求任意底数的对数的近似值：\n\n$$\\log_{3} 7 = \\frac{\\ln 7}{\\ln 3} \\approx \\frac{1.9459}{1.0986} \\approx 1.77$$\n\n检查：$3^{1} = 3 < 7 < 9 = 3^{2}$，所以答案一定在 $1$ 和 $2$ 之间。",
      ),
      generate(rng) {
        for (;;) {
          const [a, x] = rng.sample([2, 3, 5, 6, 7, 11, 12, 13, 15, 17, 19, 20, 30, 50], 2) as [number, number];
          const v = lnQ(x).div(lnQ(a));
          const truth = Math.log(x) / Math.log(a);
          if (qlog(Q.of(a), Q.of(x)) || !stable(v, truth, 2)) continue;
          const answer = roundTo(v, 2);
          return numberProblem({
            prompt: t(
              `Use $${lnGiven(a, x)}$ to find $${logL(a, String(x))}$ to the nearest hundredth.`,
              `利用 $${lnGiven(a, x)}$，求 $${logL(a, String(x))}$ 的值（精确到百分位）。`,
            ),
            answer,
            form: "decimal",
            wrong: [roundTo(lnQ(a).div(lnQ(x)), 2), roundTo(lnQ(x).sub(lnQ(a)), 2), roundTo(Q.of(x, a), 2)],
            solution: both(
              "Change to natural logarithms and divide:",
              "换成自然对数，再相除：",
              `${logL(a, String(x))} = \\frac{${lnL(String(x))}}{${lnL(String(a))}} \\approx \\frac{${dec(lnQ(x))}}{${dec(lnQ(a))}} \\approx ${dec(answer)}`,
            ),
          });
        }
      },
    },
  ],
};

// Exponential equations.

/** cpoly writes a sum of terms like poly, with "\cdot" between a coefficient and a term that starts with a digit: "4^{x} - 6 \cdot 2^{x} + 8". */
function cpoly(...terms: readonly (readonly [Coefficient, string])[]): string {
  let out = "";
  for (const [c, v] of terms) {
    const k = toQ(c);
    if (k.isZero()) continue;
    const abs = k.abs();
    const body = v === "" ? abs.toLatex() : abs.eq(Q.one) ? v : `${abs.toLatex()}${/^\d/.test(v) ? " \\cdot " : ""}${v}`;
    out += out === "" ? (k.sign() < 0 ? `-${body}` : body) : k.sign() < 0 ? ` - ${body}` : ` + ${body}`;
  }
  return out === "" ? "0" : out;
}

/** nonPowerOf draws a whole number from 2 to max that is not a rational power of b. */
function nonPowerOf(rng: Rng, b: number, max = 30): number {
  for (;;) {
    const n = rng.int(2, max);
    if (!qlog(Q.of(b), Q.of(n))) return n;
  }
}

export const solvingExponentialEquationsUsingLogarithms: TopicDef = {
  id: "solving-exponential-equations-using-logarithms",
  title: t("Solving Exponential Equations Using Logarithms", "用对数解指数方程"),
  summary: t(
    "Solve equations such as $3 \\cdot 2^{x} = 15$ by isolating the power and taking a logarithm, exactly and approximately.",
    "把幂单独留在一边再取对数，精确地或近似地解 $3 \\cdot 2^{x} = 15$ 这样的方程。",
  ),
  prerequisites: ["change-of-base-formula"],
  encompasses: [
    { topic: "converting-between-exponential-and-logarithmic-form", weight: 0.3 },
    { topic: "change-of-base-formula", weight: 0.3 },
    { topic: "two-step-equations", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.LE.A.4", "CCSS.HSA.REI.B.3"],
  knowledgePoints: [
    {
      id: "solution-as-a-logarithm",
      title: t("The solution as a logarithm", "用对数表示解"),
      explanation: t(
        "When the two sides cannot be written as powers of the same base, logarithms solve the equation. Isolate the power first, then convert to logarithmic form:\n\n$$3 \\cdot 2^{x} + 4 = 19 \\implies 3 \\cdot 2^{x} = 15 \\implies 2^{x} = 5 \\implies x = \\log_{2} 5$$\n\nThe exact solution is $\\log_{2} 5$; it is a number between $2$ and $3$, since $4 < 5 < 8$.",
        "两边不能写成同底数的幂时，用对数解方程。先把幂单独留在一边，再化为对数式：\n\n$$3 \\cdot 2^{x} + 4 = 19 \\implies 3 \\cdot 2^{x} = 15 \\implies 2^{x} = 5 \\implies x = \\log_{2} 5$$\n\n精确解是 $\\log_{2} 5$；因为 $4 < 5 < 8$，它是 $2$ 和 $3$ 之间的一个数。",
      ),
      generate(rng) {
        const b = rng.int(2, 9);
        const N = nonPowerOf(rng, b, 20);
        const a = rng.int(1, 6);
        const c = rng.int(-12, 12);
        const d = a * N + c;
        const lhs = `${cpoly([a, `${b}^{x}`])}${plusK(c)}`;
        return prefixed(
          {
            prompt: t(`Solve $${lhs} = ${d}$. Write the exact solution as a logarithm.`, `解方程 $${lhs} = ${d}$，把精确解写成对数。`),
            answer: N,
            wrong: [d - c, Q.of(d, a), N + c, a * N],
            solution: both(
              "Isolate the power, then convert to logarithmic form:",
              "先把幂单独留在一边，再化为对数式：",
              `${lhs} = ${d}`,
              ...(a === 1 ? [] : [`${cpoly([a, `${b}^{x}`])} = ${a * N}`]),
              `${b}^{x} = ${N}`,
              `x = ${logL(b, String(N))}`,
            ),
          },
          `x = \\log_{${b}}`,
        );
      },
    },
    {
      id: "linear-exponents",
      title: t("Exponents with several terms", "指数是多项式"),
      explanation: t(
        "When the exponent is an expression, convert to logarithmic form and then solve the linear equation for $x$:\n\n$$5^{2x - 1} = 7 \\implies 2x - 1 = \\log_{5} 7 \\implies x = \\frac{\\log_{5} 7 + 1}{2}$$\n\nThe whole exponent equals the logarithm, so undo the $-1$ before dividing by $2$.",
        "指数是代数式时，先化为对数式，再解关于 $x$ 的一次方程：\n\n$$5^{2x - 1} = 7 \\implies 2x - 1 = \\log_{5} 7 \\implies x = \\frac{\\log_{5} 7 + 1}{2}$$\n\n整个指数等于这个对数，所以先消去 $-1$，再除以 $2$。",
      ),
      generate(rng) {
        const b = rng.int(2, 9);
        const N = nonPowerOf(rng, b, 25);
        const k = rng.pick([1, 1, 2, 3, 4]);
        const h = rng.nonZero(-6, 6);
        const L = logL(b, String(N));
        const top = (s: number) => `${L}${plusK(-s)}`;
        const over = (s: string) => (k === 1 ? s : `\\frac{${s}}{${k}}`);
        return oneOf(rng, {
          prompt: t(`Solve $${b}^{${linear(k, h)}} = ${N}$.`, `解方程 $${b}^{${linear(k, h)}} = ${N}$。`),
          right: m(`x = ${over(top(h))}`),
          wrong: [
            m(`x = ${over(top(-h))}`),
            m(`x = ${over(`${logL(b, String(N - h))}`)}`),
            m(k === 1 ? `x = ${logL(N, String(b))}${plusK(-h)}` : `x = \\frac{${L}}{${k}}${plusK(-h)}`),
            m(`x = ${over(`${logL(N, String(b))}${plusK(-h)}`)}`),
          ],
          solution: both(
            "Convert to logarithmic form, then solve for $x$:",
            "化为对数式，再解出 $x$：",
            `${linear(k, h)} = ${L}`,
            ...(k === 1 ? [] : [`${k}x = ${top(h)}`]),
            `x = ${over(top(h))}`,
          ),
        });
      },
    },
    {
      id: "approximating-solutions",
      title: t("Approximate solutions", "近似解"),
      explanation: t(
        "To approximate the solution, write the logarithm with natural logarithms and divide:\n\n$$4 \\cdot 3^{x} = 52 \\implies 3^{x} = 13 \\implies x = \\log_{3} 13 = \\frac{\\ln 13}{\\ln 3} \\approx \\frac{2.5649}{1.0986} \\approx 2.33$$\n\nAnother way gives the same result: take $\\ln$ of both sides of $3^{x} = 13$, so $x \\ln 3 = \\ln 13$.",
        "求近似解时，用自然对数表示这个对数，再相除：\n\n$$4 \\cdot 3^{x} = 52 \\implies 3^{x} = 13 \\implies x = \\log_{3} 13 = \\frac{\\ln 13}{\\ln 3} \\approx \\frac{2.5649}{1.0986} \\approx 2.33$$\n\n也可以对 $3^{x} = 13$ 两边取 $\\ln$，得 $x \\ln 3 = \\ln 13$，结果相同。",
      ),
      generate(rng) {
        for (;;) {
          const b = rng.pick([2, 3, 5, 6, 7]);
          const N = nonPowerOf(rng, b, 40);
          const a = rng.int(1, 8);
          const v = lnQ(N).div(lnQ(b));
          if (!stable(v, Math.log(N) / Math.log(b), 2)) continue;
          const answer = roundTo(v, 2);
          const lhs = cpoly([a, `${b}^{x}`]);
          return numberProblem({
            prompt: t(
              `Solve $${lhs} = ${a * N}$. Use $${lnGiven(b, N)}$ and give $x$ to the nearest hundredth.`,
              `解方程 $${lhs} = ${a * N}$。利用 $${lnGiven(b, N)}$，求 $x$（精确到百分位）。`,
            ),
            answer,
            form: "decimal",
            solveFor: "x",
            wrong: [roundTo(lnQ(b).div(lnQ(N)), 2), roundTo(lnQ(a * N).div(lnQ(b)), 2), roundTo(Q.of(N, b), 2)],
            solution: both(
              "Isolate the power, then take the logarithm:",
              "先把幂单独留在一边，再取对数：",
              ...(a === 1 ? [] : [`${b}^{x} = ${N}`]),
              `x = ${logL(b, String(N))} = \\frac{${lnL(String(N))}}{${lnL(String(b))}} \\approx \\frac{${dec(lnQ(N))}}{${dec(lnQ(b))}} \\approx ${dec(answer)}`,
            ),
          });
        }
      },
    },
  ],
  diagnostic: "solution-as-a-logarithm",
};

export const solvingEquationsContainingTheExponentialFunction: TopicDef = {
  id: "solving-equations-containing-the-exponential-function",
  title: t("Solving Equations Containing the Exponential Function", "解含 $e^{x}$ 的方程"),
  summary: t(
    "Solve equations with powers of $e$, by equating exponents or by taking natural logarithms.",
    "解含 $e$ 的幂的方程：令指数相等，或取自然对数。",
  ),
  prerequisites: ["solving-exponential-equations-using-logarithms"],
  encompasses: [
    { topic: "solving-exponential-equations-using-logarithms", weight: 0.5 },
    { topic: "natural-logarithm", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.LE.A.4"],
  knowledgePoints: [
    {
      id: "equal-powers-of-e",
      title: t("Equal powers of $e$", "$e$ 的幂相等"),
      explanation: t(
        "The function $e^{x}$, the **exponential function**, is a power with base $e$. Equal powers of $e$ have equal exponents, so write both sides as powers of $e$ and solve the linear equation. Remember $1 = e^{0}$ and $\\frac{1}{e^{k}} = e^{-k}$:\n\n$$e^{3x + 1} = \\frac{1}{e^{5}} \\implies 3x + 1 = -5 \\implies x = -2$$",
        "函数 $e^{x}$ 叫做**指数函数**，它是以 $e$ 为底的幂。$e$ 的幂相等时指数相等，所以把两边写成 $e$ 的幂，再解一次方程。记住 $1 = e^{0}$，$\\frac{1}{e^{k}} = e^{-k}$：\n\n$$e^{3x + 1} = \\frac{1}{e^{5}} \\implies 3x + 1 = -5 \\implies x = -2$$",
      ),
      generate(rng) {
        for (;;) {
          const a1 = rng.nonZero(-4, 5);
          const c1 = rng.int(-9, 9);
          const kind = rng.int(0, 2);
          const a2 = kind === 0 ? rng.int(-4, 5) : 0;
          if (a1 === a2) continue;
          const c2 = kind === 2 ? 0 : rng.int(-9, 9);
          if (kind === 1 && c2 >= 0) continue;
          const x = Q.of(c2 - c1, a1 - a2);
          if (x.d > 6n) continue;
          const rhs = kind === 0 ? `e^{${linear(a2, c2)}}` : kind === 1 ? (c2 === -1 ? "\\frac{1}{e}" : `\\frac{1}{e^{${-c2}}}`) : "1";
          return numberProblem({
            prompt: t(`Solve $e^{${linear(a1, c1)}} = ${rhs}$.`, `解方程 $e^{${linear(a1, c1)}} = ${rhs}$。`),
            answer: x,
            solveFor: "x",
            wrong: [Q.of(c2 + c1, a1 - a2), Q.of(-c2 - c1, a1 - a2), x.neg(), ...(kind === 2 ? [Q.of(1 - c1, a1)] : [])],
            solution: both(
              "Write both sides as powers of $e$ and set the exponents equal:",
              "把两边写成 $e$ 的幂，再令指数相等：",
              `e^{${linear(a1, c1)}} = e^{${linear(a2, c2)}}`,
              `${linear(a1, c1)} = ${linear(a2, c2)}`,
              `x = ${num(x)}`,
            ),
          });
        }
      },
    },
    {
      id: "taking-natural-logarithms",
      title: t("Taking natural logarithms", "取自然对数"),
      explanation: t(
        "To solve an equation in $e^{x}$ whose other side is not a power of $e$, isolate $e^{x}$ and take $\\ln$ of both sides, since $\\ln e^{x} = x$:\n\n$$2e^{x} - 3 = 11 \\implies e^{x} = 7 \\implies x = \\ln 7$$",
        "解含 $e^{x}$ 而另一边不是 $e$ 的幂的方程：把 $e^{x}$ 单独留在一边，两边取 $\\ln$，因为 $\\ln e^{x} = x$：\n\n$$2e^{x} - 3 = 11 \\implies e^{x} = 7 \\implies x = \\ln 7$$",
      ),
      generate(rng) {
        const N = rng.int(2, 30);
        const a = rng.int(1, 7);
        const c = rng.int(-15, 15);
        const lhs = `${coefL(a)}e^{x}${plusK(c)}`;
        const d = a * N + c;
        return prefixed(
          {
            prompt: t(`Solve $${lhs} = ${d}$. Give the exact solution.`, `解方程 $${lhs} = ${d}$，给出精确解。`),
            answer: N,
            wrong: [d - c, Q.of(d, a), N + c, Q.of(d + c, a)],
            solution: both(
              "Isolate $e^{x}$, then take the natural logarithm:",
              "先把 $e^{x}$ 单独留在一边，再取自然对数：",
              `${lhs} = ${d}`,
              ...(a === 1 ? [] : [`${a}e^{x} = ${a * N}`]),
              `e^{x} = ${N}`,
              `x = ${lnL(String(N))}`,
            ),
          },
          "x = \\ln",
        );
      },
    },
    {
      id: "approximate-solutions-with-e",
      title: t("Approximate solutions", "近似解"),
      explanation: t(
        "When the exponent is a multiple of $x$, take $\\ln$ and then divide:\n\n$$3e^{2x} = 21 \\implies e^{2x} = 7 \\implies 2x = \\ln 7 \\implies x = \\frac{\\ln 7}{2} \\approx \\frac{1.9459}{2} \\approx 0.97$$\n\nDivide the logarithm by the coefficient of $x$; do not take the logarithm of $\\frac{7}{2}$.",
        "指数是 $x$ 的倍数时，先取 $\\ln$，再相除：\n\n$$3e^{2x} = 21 \\implies e^{2x} = 7 \\implies 2x = \\ln 7 \\implies x = \\frac{\\ln 7}{2} \\approx \\frac{1.9459}{2} \\approx 0.97$$\n\n是用对数除以 $x$ 的系数，而不是求 $\\frac{7}{2}$ 的对数。",
      ),
      generate(rng) {
        for (;;) {
          const N = rng.pick([2, 3, 5, 6, 7, 10, 11, 12, 13, 15, 20]);
          const k = rng.pick([2, 3, 4, 5, -1, -2, -3]);
          const a = rng.int(1, 6);
          const recip = k < 0 && rng.bool();
          const v = lnQ(N).div(Q.of(k));
          if (!stable(v, Math.log(N) / k, 2)) continue;
          const answer = roundTo(v, 2);
          const value = recip ? `\\frac{${a}}{${N}}` : String(a * N);
          const solveTo = recip ? `\\frac{1}{${N}}` : String(N);
          const lnTarget = recip ? `-${lnL(String(N))}` : lnL(String(N));
          return numberProblem({
            prompt: t(
              `Solve $${coefL(a)}e^{${linear(k, 0)}} = ${value}$. Use $${lnGiven(N)}$ and give $x$ to the nearest hundredth.`,
              `解方程 $${coefL(a)}e^{${linear(k, 0)}} = ${value}$。利用 $${lnGiven(N)}$，求 $x$（精确到百分位）。`,
            ),
            answer: recip ? answer.neg() : answer,
            form: "decimal",
            solveFor: "x",
            wrong: [
              roundTo(lnQ(N).mul(Q.of(k)), 2),
              recip ? answer : answer.neg(),
              roundTo(Q.of(Math.round(Math.log(Math.abs(N / k)) * 1e4), 1e4), 2),
            ],
            solution: both(
              "Isolate the power of $e$, take the natural logarithm, and divide:",
              "先把 $e$ 的幂单独留在一边，取自然对数，再相除：",
              `e^{${linear(k, 0)}} = ${solveTo}`,
              `${linear(k, 0)} = ${lnTarget}`,
              `x = \\frac{${lnTarget}}{${k}} \\approx ${dec(recip ? answer.neg() : answer)}`,
            ),
          });
        }
      },
    },
  ],
  diagnostic: "taking-natural-logarithms",
};

/** lnTerm writes c·ln b with the coefficient in front: "\ln 3", "-\ln 3", "2\ln 3". */
const lnTerm = (c: number, b: number) => `${coefL(c)}${lnL(String(b))}`;

export const solvingExponentialEquationsWithDifferentBasesUsingLogarithms: TopicDef = {
  id: "solving-exponential-equations-with-different-bases-using-logarithms",
  title: t("Solving Exponential Equations With Different Bases Using Logarithms", "用对数解不同底数的指数方程"),
  summary: t(
    "Solve equations such as $2^{x} = 3^{x - 1}$ by taking logarithms of both sides and collecting the terms in $x$.",
    "两边取对数并合并含 $x$ 的项，解 $2^{x} = 3^{x - 1}$ 这样的方程。",
  ),
  prerequisites: ["solving-exponential-equations-using-logarithms", "linear-equations-with-unknown-coefficients"],
  encompasses: [
    { topic: "solving-exponential-equations-using-logarithms", weight: 0.5 },
    { topic: "linear-equations-with-unknown-coefficients", weight: 0.3 },
  ],
  xp: 16,
  standards: ["CCSS.HSF.LE.A.4"],
  knowledgePoints: [
    {
      id: "logarithms-of-both-sides",
      title: t("Taking logarithms of both sides", "两边取对数"),
      explanation: t(
        "When the bases differ and cannot be rewritten, take $\\ln$ of both sides and bring the exponents down with the power rule. The equation becomes linear in $x$, with logarithms as coefficients:\n\n$$2^{x} = 3^{x - 1} \\implies x\\ln 2 = (x - 1)\\ln 3 \\implies x\\ln 2 - x\\ln 3 = -\\ln 3$$\n\n$$x(\\ln 2 - \\ln 3) = -\\ln 3 \\implies x = \\frac{-\\ln 3}{\\ln 2 - \\ln 3} = \\frac{\\ln 3}{\\ln 3 - \\ln 2}$$",
        "底数不同且不能改写时，两边取 $\\ln$，用幂的法则把指数移下来。方程就变成以对数为系数的一次方程：\n\n$$2^{x} = 3^{x - 1} \\implies x\\ln 2 = (x - 1)\\ln 3 \\implies x\\ln 2 - x\\ln 3 = -\\ln 3$$\n\n$$x(\\ln 2 - \\ln 3) = -\\ln 3 \\implies x = \\frac{-\\ln 3}{\\ln 2 - \\ln 3} = \\frac{\\ln 3}{\\ln 3 - \\ln 2}$$",
      ),
      generate(rng) {
        const [a, b] = rng.sample([2, 3, 5, 6, 7, 10], 2) as [number, number];
        const c = rng.nonZero(-4, 4);
        const right = `x = \\frac{${lnTerm(c, b)}}{${lnL(String(a))} - ${lnL(String(b))}}`;
        return oneOf(rng, {
          prompt: t(`Solve $${a}^{x} = ${b}^{${linear(1, c)}}$.`, `解方程 $${a}^{x} = ${b}^{${linear(1, c)}}$。`),
          right: m(right),
          wrong: [
            m(`x = \\frac{${lnTerm(c, b)}}{${lnL(String(b))} - ${lnL(String(a))}}`),
            m(`x = \\frac{${lnTerm(c, a)}}{${lnL(String(a))} - ${lnL(String(b))}}`),
            m(`x = \\frac{${lnTerm(c, b)}}{${lnL(String(a))}}`),
            m(`x = \\frac{${c}}{${lnL(String(a))} - ${lnL(String(b))}}`),
          ],
          solution: both(
            "Take $\\ln$ of both sides, collect the terms in $x$ and divide:",
            "两边取 $\\ln$，合并含 $x$ 的项，再相除：",
            `x${lnL(String(a))} = (${linear(1, c)})${lnL(String(b))}`,
            `x${lnL(String(a))} - x${lnL(String(b))} = ${lnTerm(c, b)}`,
            right,
          ),
        });
      },
    },
    {
      id: "approximating-with-different-bases",
      title: t("Approximate solutions", "近似解"),
      explanation: t(
        "Substitute the values of the logarithms into the exact solution:\n\n$$2^{x} = 3^{x - 1} \\implies x = \\frac{\\ln 3}{\\ln 3 - \\ln 2} \\approx \\frac{1.0986}{1.0986 - 0.6931} \\approx 2.71$$\n\nCompute the denominator first, then divide.",
        "把对数的值代入精确解：\n\n$$2^{x} = 3^{x - 1} \\implies x = \\frac{\\ln 3}{\\ln 3 - \\ln 2} \\approx \\frac{1.0986}{1.0986 - 0.6931} \\approx 2.71$$\n\n先算分母，再相除。",
      ),
      generate(rng) {
        for (;;) {
          const [a, b] = rng.sample([2, 3, 5, 7, 11], 2) as [number, number];
          const c = rng.nonZero(-3, 3);
          const v = Q.of(c)
            .mul(lnQ(b))
            .div(lnQ(a).sub(lnQ(b)));
          const truth = (c * Math.log(b)) / (Math.log(a) - Math.log(b));
          if (!stable(v, truth, 2)) continue;
          const answer = roundTo(v, 2);
          return numberProblem({
            prompt: t(
              `Solve $${a}^{x} = ${b}^{${linear(1, c)}}$. Use $${lnGiven(a, b)}$ and give $x$ to the nearest hundredth.`,
              `解方程 $${a}^{x} = ${b}^{${linear(1, c)}}$。利用 $${lnGiven(a, b)}$，求 $x$（精确到百分位）。`,
            ),
            answer,
            form: "decimal",
            solveFor: "x",
            wrong: [
              answer.neg(),
              roundTo(
                Q.of(c)
                  .mul(lnQ(a))
                  .div(lnQ(a).sub(lnQ(b))),
                2,
              ),
              roundTo(Q.of(c).mul(lnQ(b)).div(lnQ(a)), 2),
            ],
            solution: both(
              "Take $\\ln$ of both sides, collect the terms in $x$, then substitute:",
              "两边取 $\\ln$，合并含 $x$ 的项，再代入数值：",
              `x${lnL(String(a))} = (${linear(1, c)})${lnL(String(b))}`,
              `x = \\frac{${lnTerm(c, b)}}{${lnL(String(a))} - ${lnL(String(b))}} \\approx \\frac{${num(c)} \\cdot ${dec(lnQ(b))}}{${dec(lnQ(a))} - ${dec(lnQ(b))}} \\approx ${dec(answer)}`,
            ),
          });
        }
      },
    },
    {
      id: "coefficients-and-different-bases",
      title: t("Coefficients and different bases", "系数与不同底数"),
      explanation: t(
        "With coefficients in front of the powers, divide to gather the powers on one side. Powers with the same exponent combine: $\\frac{b^{x}}{d^{x}} = \\left(\\frac{b}{d}\\right)^{x}$.\n\n$$2 \\cdot 5^{x} = 7 \\cdot 3^{x} \\implies \\left(\\frac{5}{3}\\right)^{x} = \\frac{7}{2} \\implies x = \\frac{\\ln 7 - \\ln 2}{\\ln 5 - \\ln 3}$$\n\nThe quotient rule turns $\\ln \\frac{7}{2}$ into $\\ln 7 - \\ln 2$, so only logarithms of whole numbers are needed.",
        "幂前面有系数时，先相除，把幂集中到一边。指数相同的幂可以合并：$\\frac{b^{x}}{d^{x}} = \\left(\\frac{b}{d}\\right)^{x}$。\n\n$$2 \\cdot 5^{x} = 7 \\cdot 3^{x} \\implies \\left(\\frac{5}{3}\\right)^{x} = \\frac{7}{2} \\implies x = \\frac{\\ln 7 - \\ln 2}{\\ln 5 - \\ln 3}$$\n\n商的法则把 $\\ln \\frac{7}{2}$ 变成 $\\ln 7 - \\ln 2$，所以只需要整数的对数。",
      ),
      generate(rng) {
        for (;;) {
          const [a, c] = rng.sample([2, 3, 5, 7], 2) as [number, number];
          const [b, d] = rng.sample([2, 3, 5, 7, 11], 2) as [number, number];
          const v = lnQ(c)
            .sub(lnQ(a))
            .div(lnQ(b).sub(lnQ(d)));
          const truth = (Math.log(c) - Math.log(a)) / (Math.log(b) - Math.log(d));
          if (!stable(v, truth, 2)) continue;
          const answer = roundTo(v, 2);
          const used = [...new Set([a, b, c, d])].sort((x, y) => x - y);
          return numberProblem({
            prompt: t(
              `Solve $${a} \\cdot ${b}^{x} = ${c} \\cdot ${d}^{x}$. Use $${lnGiven(...used)}$ and give $x$ to the nearest hundredth.`,
              `解方程 $${a} \\cdot ${b}^{x} = ${c} \\cdot ${d}^{x}$。利用 $${lnGiven(...used)}$，求 $x$（精确到百分位）。`,
            ),
            answer,
            form: "decimal",
            solveFor: "x",
            wrong: [
              answer.neg(),
              roundTo(
                lnQ(a)
                  .sub(lnQ(c))
                  .div(lnQ(d).sub(lnQ(b)))
                  .neg(),
                2,
              ),
              roundTo(
                lnQ(c)
                  .div(lnQ(a))
                  .div(lnQ(b).div(lnQ(d))),
                2,
              ),
            ],
            solution: both(
              "Gather the powers on one side, then take the natural logarithm:",
              "把幂集中到一边，再取自然对数：",
              `\\left(\\frac{${b}}{${d}}\\right)^{x} = \\frac{${c}}{${a}}`,
              `x = \\frac{${lnL(String(c))} - ${lnL(String(a))}}{${lnL(String(b))} - ${lnL(String(d))}} \\approx \\frac{${dec(lnQ(c))} - ${dec(lnQ(a))}}{${dec(lnQ(b))} - ${dec(lnQ(d))}} \\approx ${dec(answer)}`,
            ),
          });
        }
      },
    },
  ],
  diagnostic: "logarithms-of-both-sides",
};

export const solvingExponentialEquationsUsingTheZeroProductProperty: TopicDef = {
  id: "solving-exponential-equations-using-the-zero-product-property",
  title: t("Solving Exponential Equations Using the Zero-Product Property", "用零积性质解指数方程"),
  summary: t(
    "Factor exponential equations such as $x \\cdot 2^{x} - 8x = 0$ and $4^{x} - 6 \\cdot 2^{x} + 8 = 0$, and reject impossible factors.",
    "对 $x \\cdot 2^{x} - 8x = 0$、$4^{x} - 6 \\cdot 2^{x} + 8 = 0$ 这样的指数方程因式分解，并舍去不可能的因式。",
  ),
  prerequisites: ["solving-exponential-equations", "solving-quadratic-equations-by-factoring"],
  encompasses: [
    { topic: "solving-exponential-equations", weight: 0.4 },
    { topic: "solving-quadratic-equations-by-factoring", weight: 0.4 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.SSE.A.2", "CCSS.HSA.REI.B.4"],
  knowledgePoints: [
    {
      id: "common-factors",
      title: t("Common factors", "提取公因式"),
      explanation: t(
        "If a product is $0$, one of its factors is $0$. Factor out what the terms share, then solve each factor:\n\n$$x \\cdot 2^{x} - 8x = 0 \\implies x(2^{x} - 8) = 0 \\implies x = 0 \\text{ or } 2^{x} = 8$$\n\nSo $x = 0$ or $x = 3$. Do not divide both sides by $x$: that loses the solution $x = 0$.",
        "积为 $0$ 时，至少有一个因式为 $0$。提取各项的公因式，再分别令每个因式为 $0$：\n\n$$x \\cdot 2^{x} - 8x = 0 \\implies x(2^{x} - 8) = 0 \\implies x = 0 \\text{ 或 } 2^{x} = 8$$\n\n所以 $x = 0$ 或 $x = 3$。不要两边同除以 $x$，那样会丢掉解 $x = 0$。",
      ),
      generate(rng) {
        for (;;) {
          const b = rng.pick([2, 3, 4, 5, 10]);
          const mExp = rng.int(-2, b === 2 ? 5 : 3);
          if (mExp === 0) continue;
          const N = Q.of(b).pow(mExp);
          const p = rng.bool(0.5) ? 0 : rng.nonZero(-5, 5);
          if (p === mExp) continue;
          const eq =
            p === 0
              ? `x \\cdot ${b}^{x} - ${N.isInteger() ? `${num(N)}x` : `${num(N)}x`} = 0`
              : `(${linear(1, -p)})(${b}^{x} - ${num(N)}) = 0`;
          return solutionsProblem({
            prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
            values: [String(p), String(mExp)],
            wrong: [[String(mExp)], [String(p), num(N)], [String(-p), String(mExp)]],
            solution: both(
              "Set each factor equal to $0$:",
              "令每个因式等于 $0$：",
              ...(p === 0 ? [`x(${b}^{x} - ${num(N)}) = 0`] : []),
              `${p === 0 ? "x = 0" : `x = ${p}`} \\quad \\text{or} \\quad ${b}^{x} = ${num(N)} = ${b}^{${mExp}}`,
              `x = ${p} \\quad \\text{or} \\quad x = ${mExp}`,
            ),
          });
        }
      },
    },
    {
      id: "quadratic-in-form",
      title: t("Equations quadratic in a power", "关于幂的二次方程"),
      explanation: t(
        "Since $4^{x} = (2^{2})^{x} = (2^{x})^{2}$, the equation $4^{x} - 6 \\cdot 2^{x} + 8 = 0$ is a quadratic equation in $u = 2^{x}$:\n\n$$u^{2} - 6u + 8 = 0 \\implies (u - 2)(u - 4) = 0 \\implies u = 2 \\text{ or } u = 4$$\n\nThen solve $2^{x} = 2$ and $2^{x} = 4$: $x = 1$ or $x = 2$. The values of $u$ are not the answers; go back to $x$.",
        "因为 $4^{x} = (2^{2})^{x} = (2^{x})^{2}$，方程 $4^{x} - 6 \\cdot 2^{x} + 8 = 0$ 是关于 $u = 2^{x}$ 的二次方程：\n\n$$u^{2} - 6u + 8 = 0 \\implies (u - 2)(u - 4) = 0 \\implies u = 2 \\text{ 或 } u = 4$$\n\n再解 $2^{x} = 2$ 和 $2^{x} = 4$：$x = 1$ 或 $x = 2$。$u$ 的值不是答案，要回到 $x$。",
      ),
      generate(rng) {
        const b = rng.pick([2, 2, 3, 3, 5]);
        const [mm, nn] = rng.sample(b === 2 ? [-1, 0, 1, 2, 3, 4] : [-1, 0, 1, 2], 2) as [number, number];
        const [u1, u2] = [Q.of(b).pow(mm), Q.of(b).pow(nn)];
        const S = u1.add(u2);
        const P = u1.mul(u2);
        const big = rng.bool() ? `${b * b}^{x}` : `${b}^{2x}`;
        const eq = `${cpoly([1, big], [S.neg(), `${b}^{x}`], [P, ""])} = 0`;
        const quad = `${cpoly([1, "u^{2}"], [S.neg(), "u"], [P, ""])} = 0`;
        return solutionsProblem({
          prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
          values: [String(mm), String(nn)],
          wrong: [[num(u1), num(u2)], [String(mm + nn)], [String(Math.max(mm, nn))]],
          solution: both(
            `Let $u = ${b}^{x}$, so $${big} = u^{2}$:`,
            `设 $u = ${b}^{x}$，则 $${big} = u^{2}$：`,
            quad,
            `u = ${num(u1)} \\quad \\text{or} \\quad u = ${num(u2)}`,
            `${b}^{x} = ${b}^{${mm}} \\quad \\text{or} \\quad ${b}^{x} = ${b}^{${nn}}`,
            `x = ${mm} \\quad \\text{or} \\quad x = ${nn}`,
          ),
        });
      },
    },
    {
      id: "rejecting-impossible-factors",
      title: t("Rejecting impossible factors", "舍去不可能的因式"),
      explanation: t(
        "A power with a positive base is always positive, so a factor such as $3^{x} + 1$ is never $0$:\n\n$$9^{x} - 2 \\cdot 3^{x} - 3 = 0 \\implies (3^{x} - 3)(3^{x} + 1) = 0$$\n\n$3^{x} = -1$ has no solution, so the only solution is $x = 1$. An equation where every factor is impossible has no solution.",
        "正底数的幂总是正数，所以 $3^{x} + 1$ 这样的因式永远不等于 $0$：\n\n$$9^{x} - 2 \\cdot 3^{x} - 3 = 0 \\implies (3^{x} - 3)(3^{x} + 1) = 0$$\n\n$3^{x} = -1$ 无解，所以唯一的解是 $x = 1$。如果每个因式都不可能为 $0$，方程无解。",
      ),
      generate(rng) {
        for (;;) {
          const b = rng.pick([2, 3, 5]);
          const mm = rng.int(-1, b === 2 ? 4 : 2);
          const u1 = Q.of(b).pow(mm);
          const c = rng.int(1, 9);
          const none = rng.bool(0.15);
          const roots = none ? [Q.of(-c), Q.of(-rng.int(1, 9))] : [u1, Q.of(-c)];
          const S = roots[0]!.add(roots[1]!);
          const P = roots[0]!.mul(roots[1]!);
          if (S.isZero() || roots[0]!.eq(roots[1]!)) continue;
          const big = `${b * b}^{x}`;
          const eq = `${cpoly([1, big], [S.neg(), `${b}^{x}`], [P, ""])} = 0`;
          const factors = roots.map((r) => `(${b}^{x}${plusK(r.neg())})`).join("");
          return solutionsProblem({
            prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
            values: none ? [] : [String(mm)],
            wrong: none ? [[num(roots[0]!), num(roots[1]!)]] : [[String(mm), String(-c)], [num(u1)], []],
            solution: t(
              `Let $u = ${b}^{x}$ and factor:${steps(`${factors} = 0`)}${none ? `Both factors would need $${b}^{x}$ to be negative, which is impossible. There is no solution.` : `$${b}^{x} = ${-c}$ is impossible, since powers of $${b}$ are positive. So $${b}^{x} = ${num(u1)} = ${b}^{${mm}}$, and $x = ${mm}$.`}`,
              `设 $u = ${b}^{x}$，因式分解：${steps(`${factors} = 0`)}${none ? `两个因式都要求 $${b}^{x}$ 为负数，这不可能。方程无解。` : `$${b}^{x} = ${-c}$ 不可能成立，因为 $${b}$ 的幂都是正数。所以 $${b}^{x} = ${num(u1)} = ${b}^{${mm}}$，$x = ${mm}$。`}`,
            ),
          });
        }
      },
    },
  ],
};

// TOPICS-END

/** algebraIILogarithmTopics are the topics of the exponentials and logarithms unit of Algebra II, in teaching order. */
export const algebraIILogarithmTopics: readonly TopicDef[] = [
  convertingBetweenExponentialAndLogarithmicForm,
  evaluatingLogarithms,
  commonLogarithm,
  naturalLogarithm,
  simplifyingLogarithmicExpressions,
  productRuleForLogarithms,
  quotientRuleForLogarithms,
  powerRuleForLogarithms,
  combiningLawsOfLogarithms,
  changeOfBaseFormula,
  solvingExponentialEquationsUsingLogarithms,
  solvingEquationsContainingTheExponentialFunction,
  solvingExponentialEquationsWithDifferentBasesUsingLogarithms,
  solvingExponentialEquationsUsingTheZeroProductProperty,
];
