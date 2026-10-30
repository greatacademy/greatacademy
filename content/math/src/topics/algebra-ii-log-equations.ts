import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import {
  type Coefficient,
  type Compass,
  dec,
  linear,
  num,
  type PlaneMark,
  type PlaneView,
  type Point,
  plane,
  poly,
  Q,
  type RealSet,
  realLine,
} from "@ga/subject-math";

import { choiceProblem, expressionProblem, intervalProblem, numberProblem, pointProblem, solutionsProblem, steps } from "../problems.ts";

const toQ = (c: Coefficient): Q => (c instanceof Q ? c : Q.of(c));

/** wrapArg writes the argument of a logarithm, in parentheses unless it is a number, a letter or a fraction. */
function wrapArg(x: string): string {
  return /^(\d+|[a-z]|\\frac\{\d+\}\{\d+\})$/.test(x) ? x : `(${x})`;
}

/** lnOf writes a natural logarithm: "\ln 5", "\ln (x - 4)". */
const lnOf = (x: string) => `\\ln ${wrapArg(x)}`;

/** Base is the base of a logarithm: a number written as a subscript, or 10 written as "\log". */
interface Base {
  readonly b: number;
  readonly of: (x: string) => string;
}

/** numBase is a logarithm base written with a subscript. */
const numBase = (b: number): Base => ({ b, of: (x) => `\\log_{${b}} ${wrapArg(x)}` });

/** tenBase is the common logarithm, written "\log". */
const tenBase: Base = { b: 10, of: (x) => `\\log ${wrapArg(x)}` };

/** drawBase draws a base: usually a small whole number, sometimes 10. */
function drawBase(rng: Rng, bases: readonly number[] = [2, 3, 4, 5, 6, 7]): Base {
  return rng.bool(0.2) ? tenBase : numBase(rng.pick(bases));
}

/** anyLog draws a logarithm of any base, the natural logarithm included, for equations whose base does not matter. */
function anyLog(rng: Rng): (x: string) => string {
  const k = rng.int(0, 4);
  return k === 0 ? lnOf : k === 1 ? tenBase.of : numBase(rng.pick([2, 3, 5, 7])).of;
}

/** coefL writes a coefficient in front of a factor: "", "-", "3", "\frac{1}{2}". */
function coefL(a: Coefficient): string {
  const v = toQ(a);
  return v.eq(Q.one) ? "" : v.eq(Q.of(-1)) ? "-" : v.toLatex();
}

/** plusK writes "+ k" or "- k" after a term, or nothing for 0. */
const plusK = (k: Coefficient) => {
  const v = toQ(k);
  return v.isZero() ? "" : v.sign() > 0 ? ` + ${v.toLatex()}` : ` - ${v.abs().toLatex()}`;
};

/** ePow writes e to an exponent: "e", "e^{3}", "e^{-2}". */
const ePow = (k: Coefficient) => (toQ(k).eq(Q.one) ? "e" : `e^{${num(k)}}`);

/** rounded is a value rounded to the given number of decimal places, or undefined when it lies too close to a rounding boundary. */
function rounded(value: number, places: number): Q | undefined {
  const scaled = Math.abs(value) * 10 ** places;
  if (!Number.isFinite(scaled) || Math.abs(scaled - Math.floor(scaled) - 0.5) < 0.02) return undefined;
  return Q.of(Math.round(value * 10 ** places), 10 ** places);
}

/** defined keeps the values that are defined. */
const defined = (...vs: readonly (Q | undefined)[]): Q[] => vs.filter((v): v is Q => v !== undefined);

/** divisors lists the positive divisors of n. */
const divisors = (n: number) => Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0);

/** rationalSqrt is the positive square root of a rational number when it is rational, or undefined. */
function rationalSqrt(v: Q): Q | undefined {
  const root = (n: bigint) => {
    const r = BigInt(Math.round(Math.sqrt(Number(n))));
    return r * r === n ? r : undefined;
  };
  if (v.sign() < 0) return undefined;
  const [n, d] = [root(v.n), root(v.d)];
  return n === undefined || d === undefined ? undefined : Q.of(n, d);
}

/** m writes LaTeX as a text that is the same in every locale. */
const m = (latex: string) => same(`$${latex}$`);

/** both builds a text from one English and one Chinese sentence around the same LaTeX steps. */
const both = (en: string, zh: string, ...lines: string[]) => t(`${en}${steps(...lines)}`, `${zh}${steps(...lines)}`);

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

/** sol writes a solution value for the solutions checker. */
const sol = (v: Coefficient) => num(v);

/** ofOrIn joins solution values for a sentence: "x = 3 \quad \text{or} \quad x = -2". */
const orList = (vs: readonly Coefficient[]) => vs.map((v) => `x = ${num(v)}`).join(" \\quad \\text{or} \\quad ");

// Unit: logarithmic equations.

export const solvingLogarithmicEquations: TopicDef = {
  id: "solving-logarithmic-equations",
  title: t("Solving Logarithmic Equations", "解对数方程"),
  summary: t(
    "Solve equations such as $\\log_{2}(3x - 1) = 3$ by writing them in exponential form.",
    "把 $\\log_{2}(3x - 1) = 3$ 这样的方程化为指数式来求解。",
  ),
  prerequisites: ["converting-between-exponential-and-logarithmic-form"],
  encompasses: [
    { topic: "converting-between-exponential-and-logarithmic-form", weight: 0.5 },
    { topic: "two-step-equations", weight: 0.3 },
  ],
  xp: 13,
  standards: ["CCSS.HSF.LE.A.4", "CCSS.HSF.BF.B.5"],
  knowledgePoints: [
    {
      id: "linear-arguments",
      title: t("A logarithm of a linear expression", "一次式的对数"),
      explanation: t(
        "A **logarithmic equation** has the unknown inside a logarithm. When a single logarithm equals a number, write the equation in exponential form, since $\\log_{b} u = c$ means $u = b^{c}$:\n\n$$\\log_{2}(3x - 1) = 3 \\implies 3x - 1 = 2^{3} = 8 \\implies 3x = 9 \\implies x = 3$$\n\nThe argument of the logarithm becomes the power; the number on the other side becomes the exponent.",
        "未知数在对数里面的方程叫做**对数方程**。一个对数等于一个数时，把方程化为指数式，因为 $\\log_{b} u = c$ 表示 $u = b^{c}$：\n\n$$\\log_{2}(3x - 1) = 3 \\implies 3x - 1 = 2^{3} = 8 \\implies 3x = 9 \\implies x = 3$$\n\n对数的真数等于幂，另一边的数是指数。",
      ),
      generate(rng) {
        for (;;) {
          const B = drawBase(rng);
          const k = rng.int(0, 4);
          const P = B.b ** k;
          if (P > 1000) continue;
          const a = rng.pick([1, 1, 2, 3, 4, 5]);
          const x = rng.int(-8, 12);
          const c = P - a * x;
          if (Math.abs(c) > 30 || (a === 1 && c === 0)) continue;
          const arg = linear(a, c);
          const eq = `${B.of(arg)} = ${k}`;
          return numberProblem({
            prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
            answer: x,
            solveFor: "x",
            wrong: [Q.of(k - c, a), Q.of(B.b * k - c, a), Q.of(k ** B.b - c, a)],
            solution: both(
              "Write the equation in exponential form, then solve the linear equation:",
              "化为指数式，再解一次方程：",
              eq,
              `${arg} = ${B.b}^{${k}} = ${P}`,
              ...(a === 1 ? [] : [`${a}x = ${P - c}`]),
              `x = ${x}`,
            ),
          });
        }
      },
    },
    {
      id: "isolating-the-logarithm",
      title: t("Isolating the logarithm", "把对数单独留在一边"),
      explanation: t(
        "When the logarithm is multiplied or has a number added, isolate it first, as you would isolate $x$ in a two-step equation:\n\n$$2\\log_{3}(x + 4) - 1 = 3 \\implies 2\\log_{3}(x + 4) = 4 \\implies \\log_{3}(x + 4) = 2$$\n\nThen convert: $x + 4 = 3^{2} = 9$, so $x = 5$. Converting before isolating would turn $2\\log_{3}(x + 4)$ into something wrong.",
        "对数乘了一个数或加了一个数时，先把对数单独留在一边，就像在两步方程中把 $x$ 单独留下一样：\n\n$$2\\log_{3}(x + 4) - 1 = 3 \\implies 2\\log_{3}(x + 4) = 4 \\implies \\log_{3}(x + 4) = 2$$\n\n再化为指数式：$x + 4 = 3^{2} = 9$，所以 $x = 5$。没有先单独留下对数就化为指数式，会得到错误的结果。",
      ),
      generate(rng) {
        for (;;) {
          const B = drawBase(rng, [2, 3, 4, 5]);
          const k = rng.int(0, 3);
          const P = B.b ** k;
          if (P > 125) continue;
          const p = rng.pick([2, 3, 4, -1, -2]);
          const d = rng.int(-9, 9);
          const c = rng.int(-9, 9);
          const e = p * k + d;
          const arg = linear(1, c);
          const lhs = `${coefL(p)}${B.of(arg)}${plusK(d)}`;
          const x = P - c;
          const skipped = e - d >= 0 && B.b ** (e - d) <= 1e6 ? [B.b ** (e - d) - c] : [];
          return numberProblem({
            prompt: t(`Solve $${lhs} = ${e}$.`, `解方程 $${lhs} = ${e}$。`),
            answer: x,
            solveFor: "x",
            wrong: [P + c, B.b * k - c, ...skipped],
            solution: both(
              "Isolate the logarithm, then write the equation in exponential form:",
              "先把对数单独留在一边，再化为指数式：",
              `${lhs} = ${e}`,
              ...(d === 0 ? [] : [`${coefL(p)}${B.of(arg)} = ${e - d}`]),
              `${B.of(arg)} = ${k}`,
              `${arg} = ${B.b}^{${k}} = ${P}`,
              `x = ${x}`,
            ),
          });
        }
      },
    },
    {
      id: "fractional-and-negative-values",
      title: t("Fractional and negative values", "等于分数或负数"),
      explanation: t(
        "The value of the logarithm can be a fraction or a negative number; the exponential form still works:\n\n$$\\log_{4}(2x + 1) = \\frac{3}{2} \\implies 2x + 1 = 4^{\\frac{3}{2}} = (\\sqrt{4})^{3} = 8 \\implies x = \\frac{7}{2}$$\n\n$$\\log_{3}(x - 1) = -2 \\implies x - 1 = 3^{-2} = \\frac{1}{9} \\implies x = \\frac{10}{9}$$",
        "对数的值可以是分数或负数，化为指数式的方法仍然适用：\n\n$$\\log_{4}(2x + 1) = \\frac{3}{2} \\implies 2x + 1 = 4^{\\frac{3}{2}} = (\\sqrt{4})^{3} = 8 \\implies x = \\frac{7}{2}$$\n\n$$\\log_{3}(x - 1) = -2 \\implies x - 1 = 3^{-2} = \\frac{1}{9} \\implies x = \\frac{10}{9}$$",
      ),
      generate(rng) {
        for (;;) {
          const r = rng.pick([2, 3, 5, 10]);
          const p = r === 10 ? 1 : rng.int(1, r === 2 ? 4 : 3);
          const q = rng.int(-3, 3);
          if (q === 0 || (q > 0 && q % p === 0)) continue;
          const b = r ** p;
          if (b > 27 && b !== 10) continue;
          const B = b === 10 ? tenBase : numBase(b);
          const kq = Q.of(q, p);
          const V = Q.of(r).pow(q);
          const a = rng.int(1, 4);
          const c = rng.int(-9, 9);
          if (a === 1 && c === 0) continue;
          const x = V.sub(Q.of(c)).div(Q.of(a));
          if (x.d > 40n) continue;
          const arg = linear(a, c);
          const eq = `${B.of(arg)} = ${num(kq)}`;
          return numberProblem({
            prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
            answer: x,
            solveFor: "x",
            wrong: [kq.mul(Q.of(b)).sub(Q.of(c)).div(Q.of(a)), Q.one.div(V).sub(Q.of(c)).div(Q.of(a)), V.add(Q.of(c)).div(Q.of(a))],
            solution: both(
              "Write the equation in exponential form and evaluate the power:",
              "化为指数式，再计算幂：",
              eq,
              `${arg} = ${b}^{${num(kq)}} = ${num(V)}`,
              ...(a === 1 ? [] : [`${a}x = ${num(V.sub(Q.of(c)))}`]),
              `x = ${num(x)}`,
            ),
          });
        }
      },
    },
  ],
  diagnostic: "linear-arguments",
};

export const solvingLogarithmicEquationsContainingTheNaturalLogarithm: TopicDef = {
  id: "solving-logarithmic-equations-containing-the-natural-logarithm",
  title: t("Solving Logarithmic Equations Containing the Natural Logarithm", "解含自然对数的方程"),
  summary: t(
    "Solve equations such as $\\ln(2x - 1) = 3$ exactly, as expressions in $e$, and approximately.",
    "精确地（用含 $e$ 的式子）或近似地解 $\\ln(2x - 1) = 3$ 这样的方程。",
  ),
  prerequisites: ["solving-logarithmic-equations", "natural-logarithm"],
  encompasses: [
    { topic: "solving-logarithmic-equations", weight: 0.6 },
    { topic: "natural-logarithm", weight: 0.3 },
  ],
  xp: 13,
  standards: ["CCSS.HSF.LE.A.4"],
  knowledgePoints: [
    {
      id: "exact-solutions",
      title: t("Exact solutions", "精确解"),
      explanation: t(
        "Since $\\ln u = c$ means $u = e^{c}$, an equation in $\\ln$ becomes an equation with a power of $e$. The power of $e$ is a number, so treat it like one:\n\n$$\\ln(2x - 1) = 3 \\implies 2x - 1 = e^{3} \\implies 2x = e^{3} + 1 \\implies x = \\frac{e^{3} + 1}{2}$$\n\nThis is the exact solution. Do not write $e^{3}$ as $3e$.",
        "因为 $\\ln u = c$ 表示 $u = e^{c}$，含 $\\ln$ 的方程就变成含 $e$ 的幂的方程。$e$ 的幂是一个数，就把它当作数来处理：\n\n$$\\ln(2x - 1) = 3 \\implies 2x - 1 = e^{3} \\implies 2x = e^{3} + 1 \\implies x = \\frac{e^{3} + 1}{2}$$\n\n这就是精确解。不要把 $e^{3}$ 写成 $3e$。",
      ),
      generate(rng) {
        for (;;) {
          const k = rng.nonZero(-3, 5);
          const a = rng.pick([1, 1, 2, 3, 4, 5]);
          const c = rng.int(-9, 9);
          if (a === 1 && c === 0) continue;
          const over = (top: string) => (a === 1 ? top : `\\frac{${top}}{${a}}`);
          const arg = linear(a, c);
          const answer = over(`${ePow(k)}${plusK(-c)}`);
          const eq = `${lnOf(arg)} = ${k}`;
          return expressionProblem({
            prompt: t(`Solve $${eq}$. Give the exact solution.`, `解方程 $${eq}$，给出精确解。`),
            answer,
            prefix: "x =",
            wrong: [
              over(`${ePow(k)}${plusK(c)}`),
              over(`${k}e${plusK(-c)}`),
              over(`10^{${k}}${plusK(-c)}`),
              `\\frac{${ePow(k)}}{${a}}${plusK(-c)}`,
              over(`${ePow(-k)}${plusK(-c)}`),
            ],
            solution: both(
              "Write the equation in exponential form, then solve for $x$:",
              "化为指数式，再解出 $x$：",
              eq,
              `${arg} = ${ePow(k)}`,
              ...(a === 1 ? [] : [`${a}x = ${ePow(k)}${plusK(-c)}`]),
              `x = ${answer}`,
            ),
          });
        }
      },
    },
    {
      id: "isolating-the-natural-logarithm",
      title: t("Isolating the natural logarithm", "把自然对数单独留在一边"),
      explanation: t(
        "Isolate $\\ln$ before converting:\n\n$$3\\ln(x + 2) - 4 = 2 \\implies 3\\ln(x + 2) = 6 \\implies \\ln(x + 2) = 2 \\implies x + 2 = e^{2}$$\n\nSo $x = e^{2} - 2$.",
        "先把 $\\ln$ 单独留在一边，再化为指数式：\n\n$$3\\ln(x + 2) - 4 = 2 \\implies 3\\ln(x + 2) = 6 \\implies \\ln(x + 2) = 2 \\implies x + 2 = e^{2}$$\n\n所以 $x = e^{2} - 2$。",
      ),
      generate(rng) {
        for (;;) {
          const k = rng.nonZero(-3, 4);
          const p = rng.pick([2, 3, 4, 5, -1, -2]);
          const d = rng.int(-9, 9);
          const c = rng.int(-9, 9);
          const e = p * k + d;
          const arg = linear(1, c);
          const lhs = `${coefL(p)}${lnOf(arg)}${plusK(d)}`;
          const answer = `${ePow(k)}${plusK(-c)}`;
          if (d === 0 && p === 1) continue;
          return expressionProblem({
            prompt: t(`Solve $${lhs} = ${e}$. Give the exact solution.`, `解方程 $${lhs} = ${e}$，给出精确解。`),
            answer,
            prefix: "x =",
            wrong: [`${ePow(e)}${plusK(-c)}`, `${ePow(e - d)}${plusK(-c)}`, `${ePow(k)}${plusK(c)}`, `${k}e${plusK(-c)}`],
            solution: both(
              "Isolate the logarithm, then write the equation in exponential form:",
              "先把对数单独留在一边，再化为指数式：",
              `${lhs} = ${e}`,
              ...(d === 0 ? [] : [`${coefL(p)}${lnOf(arg)} = ${e - d}`]),
              `${lnOf(arg)} = ${k}`,
              `${arg} = ${ePow(k)}`,
              `x = ${answer}`,
            ),
          });
        }
      },
    },
    {
      id: "approximate-solutions-with-ln",
      title: t("Approximate solutions", "近似解"),
      explanation: t(
        "To approximate the solution, substitute a decimal value of the power of $e$:\n\n$$\\ln(2x + 3) = 1.5 \\implies 2x + 3 = e^{1.5} \\approx 4.4817 \\implies x \\approx \\frac{4.4817 - 3}{2} \\approx 0.74$$\n\nRound only at the end.",
        "求近似解时，代入 $e$ 的幂的小数值：\n\n$$\\ln(2x + 3) = 1.5 \\implies 2x + 3 = e^{1.5} \\approx 4.4817 \\implies x \\approx \\frac{4.4817 - 3}{2} \\approx 0.74$$\n\n只在最后一步取近似值。",
      ),
      generate(rng) {
        for (;;) {
          const k = rng.pick([Q.of(1, 2), Q.one, Q.of(3, 2), Q.of(2), Q.of(5, 2), Q.of(3), Q.of(-1), Q.of(-1, 2), Q.of(4)]);
          const a = rng.int(1, 5);
          const c = rng.int(-9, 9);
          if (a === 1 && c === 0) continue;
          const truth = Math.exp(k.toNumber());
          const E = rounded(truth, 4);
          if (!E) continue;
          const v = E.sub(Q.of(c)).div(Q.of(a));
          const answer = rounded(v.toNumber(), 2);
          const check = rounded((truth - c) / a, 2);
          if (!answer || !check || !answer.eq(check)) continue;
          const arg = linear(a, c);
          const kL = dec(k);
          return numberProblem({
            prompt: t(
              `Solve $${lnOf(arg)} = ${kL}$. Use $e^{${kL}} \\approx ${dec(E)}$ and give $x$ to the nearest hundredth.`,
              `解方程 $${lnOf(arg)} = ${kL}$。利用 $e^{${kL}} \\approx ${dec(E)}$，求 $x$（精确到百分位）。`,
            ),
            answer,
            form: "decimal",
            solveFor: "x",
            wrong: defined(rounded((k.toNumber() - c) / a, 2), rounded((E.toNumber() + c) / a, 2), rounded(E.toNumber() / a - c, 2)),
            solution: both(
              "Write the equation in exponential form, then substitute the value of the power:",
              "化为指数式，再代入幂的值：",
              `${arg} = e^{${kL}} \\approx ${dec(E)}`,
              `x \\approx ${a === 1 ? `${dec(E)}${plusK(-c)}` : `\\frac{${dec(E)}${plusK(-c)}}{${a}}`} \\approx ${dec(answer)}`,
            ),
          });
        }
      },
    },
  ],
  diagnostic: "exact-solutions",
};

export const solvingLogarithmicEquationsUsingTheLawsOfLogarithms: TopicDef = {
  id: "solving-logarithmic-equations-using-the-laws-of-logarithms",
  title: t("Solving Logarithmic Equations Using the Laws of Logarithms", "用对数运算法则解对数方程"),
  summary: t(
    "Combine logarithms with the product, quotient and power rules, solve, and reject solutions outside the domain.",
    "用积、商、幂的对数法则合并对数，解方程，并舍去不在定义域内的解。",
  ),
  prerequisites: ["solving-logarithmic-equations", "combining-laws-of-logarithms", "solving-quadratic-equations-by-factoring"],
  encompasses: [
    { topic: "solving-logarithmic-equations", weight: 0.5 },
    { topic: "product-rule-for-logarithms", weight: 0.3 },
    { topic: "quotient-rule-for-logarithms", weight: 0.2 },
    { topic: "solving-quadratic-equations-by-factoring", weight: 0.3 },
  ],
  xp: 16,
  standards: ["CCSS.HSF.LE.A.4", "CCSS.HSA.REI.A.2"],
  knowledgePoints: [
    {
      id: "product-rule-equations",
      title: t("Sums of logarithms", "对数的和"),
      explanation: t(
        "Combine a sum of logarithms with the product rule, then convert:\n\n$$\\log_{2} x + \\log_{2}(x - 2) = 3 \\implies \\log_{2} x(x - 2) = 3 \\implies x(x - 2) = 8$$\n\n$$x^{2} - 2x - 8 = 0 \\implies (x - 4)(x + 2) = 0 \\implies x = 4 \\text{ or } x = -2$$\n\nA logarithm is defined only for positive arguments, so check every candidate in the **original** equation: $x = -2$ makes $\\log_{2} x$ not defined, so it is rejected. The only solution is $x = 4$.",
        "用积的法则合并对数的和，再化为指数式：\n\n$$\\log_{2} x + \\log_{2}(x - 2) = 3 \\implies \\log_{2} x(x - 2) = 3 \\implies x(x - 2) = 8$$\n\n$$x^{2} - 2x - 8 = 0 \\implies (x - 4)(x + 2) = 0 \\implies x = 4 \\text{ 或 } x = -2$$\n\n对数只对正的真数有定义，所以要把每个候选解代回**原方程**检验：$x = -2$ 使 $\\log_{2} x$ 无意义，应舍去。唯一的解是 $x = 4$。",
      ),
      generate(rng) {
        for (;;) {
          const B = drawBase(rng, [2, 3, 4, 5, 6]);
          const k = rng.int(1, 3);
          const P = B.b ** k;
          if (P > 100) continue;
          const r = rng.pick(divisors(P).filter((d) => d * d !== P));
          const s = P / r;
          const a = s - r;
          const terms = [B.of("x"), B.of(linear(1, a))];
          if (rng.bool()) terms.reverse();
          const eq = `${terms.join(" + ")} = ${k}`;
          return solutionsProblem({
            prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
            values: [sol(r)],
            wrong: [[sol(r), sol(-s)], [sol(-s)], [sol(P)]],
            solution: t(
              `Use the product rule, convert, and solve the quadratic equation:${steps(`${B.of(`x(${linear(1, a)})`)} = ${k}`, `x(${linear(1, a)}) = ${P}`, `${poly([1, "x^{2}"], [a, "x"], [-P, ""])} = 0`, `(${linear(1, -r)})(${linear(1, s)}) = 0`)}So $x = ${r}$ or $x = ${-s}$. For $x = ${-s}$ the argument $x$ is negative, so the logarithm is not defined and this candidate is rejected. The solution is $x = ${r}$.`,
              `用积的法则合并，化为指数式，再解二次方程：${steps(`${B.of(`x(${linear(1, a)})`)} = ${k}`, `x(${linear(1, a)}) = ${P}`, `${poly([1, "x^{2}"], [a, "x"], [-P, ""])} = 0`, `(${linear(1, -r)})(${linear(1, s)}) = 0`)}所以 $x = ${r}$ 或 $x = ${-s}$。$x = ${-s}$ 时真数 $x$ 为负，对数无意义，应舍去。方程的解是 $x = ${r}$。`,
            ),
          });
        }
      },
    },
    {
      id: "quotient-rule-equations",
      title: t("Differences of logarithms", "对数的差"),
      explanation: t(
        "Combine a difference of logarithms with the quotient rule, convert, and clear the fraction:\n\n$$\\log_{3}(x + 14) - \\log_{3}(x - 2) = 2 \\implies \\frac{x + 14}{x - 2} = 9 \\implies x + 14 = 9x - 18 \\implies x = 4$$\n\nCheck: for $x = 4$ both arguments, $18$ and $2$, are positive, so $x = 4$ is the solution.",
        "用商的法则合并对数的差，化为指数式，再去分母：\n\n$$\\log_{3}(x + 14) - \\log_{3}(x - 2) = 2 \\implies \\frac{x + 14}{x - 2} = 9 \\implies x + 14 = 9x - 18 \\implies x = 4$$\n\n检验：$x = 4$ 时两个真数 $18$ 和 $2$ 都是正数，所以 $x = 4$ 是方程的解。",
      ),
      generate(rng) {
        for (;;) {
          const B = drawBase(rng, [2, 3, 4, 5]);
          const k = rng.int(1, 2);
          const P = B.b ** k;
          if (P > 100) continue;
          const mm = rng.int(1, 4);
          const d = rng.int(-5, 5);
          const x = d + rng.int(1, 6);
          const c = P * (x - d) - mm * x;
          if (mm === P || Math.abs(c) > 60) continue;
          const top = linear(mm, c);
          const bottom = linear(1, -d);
          if (top === bottom) continue;
          const eq = `${B.of(top)} - ${B.of(bottom)} = ${k}`;
          return numberProblem({
            prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
            answer: x,
            solveFor: "x",
            wrong: [Q.of(-d - c, mm - P), ...(mm !== k ? [Q.of(-k * d - c, mm - k)] : []), ...(mm !== 1 ? [Q.of(k - c - d, mm - 1)] : [])],
            solution: t(
              `Use the quotient rule, convert, and solve:${steps(`${B.of(`\\frac{${top}}{${bottom}}`)} = ${k}`, `\\frac{${top}}{${bottom}} = ${P}`, `${top} = ${P}(${bottom})`, `${top} = ${linear(P, -P * d)}`, `x = ${x}`)}For $x = ${x}$ the arguments are $${mm * x + c}$ and $${x - d}$, both positive, so the solution is valid.`,
              `用商的法则合并，化为指数式，再求解：${steps(`${B.of(`\\frac{${top}}{${bottom}}`)} = ${k}`, `\\frac{${top}}{${bottom}} = ${P}`, `${top} = ${P}(${bottom})`, `${top} = ${linear(P, -P * d)}`, `x = ${x}`)}$x = ${x}$ 时两个真数分别是 $${mm * x + c}$ 和 $${x - d}$，都是正数，所以这个解成立。`,
            ),
          });
        }
      },
    },
    {
      id: "power-rule-equations",
      title: t("The power rule and lost solutions", "幂的法则与解的个数"),
      explanation: t(
        "The power rule $\\log_{b} x^{p} = p\\log_{b} x$ holds only when $x > 0$, so the two forms of an equation can have different solutions:\n\n$$\\log_{3}(x^{2}) = 4 \\implies x^{2} = 81 \\implies x = 9 \\text{ or } x = -9$$\n\nBoth are solutions, because $(-9)^{2} = 81$ is positive. But\n\n$$2\\log_{3} x = 4 \\implies \\log_{3} x = 2 \\implies x = 9$$\n\nhas only $x = 9$: $\\log_{3}(-9)$ is not defined.",
        "幂的法则 $\\log_{b} x^{p} = p\\log_{b} x$ 只在 $x > 0$ 时成立，所以方程的两种写法可能有不同的解：\n\n$$\\log_{3}(x^{2}) = 4 \\implies x^{2} = 81 \\implies x = 9 \\text{ 或 } x = -9$$\n\n两个都是解，因为 $(-9)^{2} = 81$ 是正数。但是\n\n$$2\\log_{3} x = 4 \\implies \\log_{3} x = 2 \\implies x = 9$$\n\n只有 $x = 9$ 一个解：$\\log_{3}(-9)$ 无意义。",
      ),
      generate(rng) {
        for (;;) {
          const B = drawBase(rng, [2, 3, 4, 5, 6, 7]);
          const k = rng.pick([1, 1, 2, 2, 3, -1]);
          const V = Q.of(B.b).pow(k);
          if (V.cmp(Q.of(125)) > 0) continue;
          const p = rng.pick([2, 2, 3]);
          const inside = rng.bool();
          const eq = inside ? `${B.of(`x^{${p}}`)} = ${p * k}` : `${p}${B.of("x")} = ${p * k}`;
          const values = inside && p === 2 ? [sol(V), sol(V.neg())] : [sol(V)];
          const Vp = V.pow(p);
          return solutionsProblem({
            prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
            values,
            wrong: [[sol(V)], [sol(V), sol(V.neg())], [sol(Q.of(B.b).pow(p * k))], [sol(Q.of(k))]],
            solution: inside
              ? t(
                  `Convert to exponential form:${steps(`x^{${p}} = ${B.b}^{${p * k}} = ${num(Vp)}`)}${p === 2 ? `So $x = ${num(V)}$ or $x = ${num(V.neg())}$. Both make $x^{2}$ positive, so both are solutions.` : `So $x = ${num(V)}$, the only real cube root.`}`,
                  `化为指数式：${steps(`x^{${p}} = ${B.b}^{${p * k}} = ${num(Vp)}`)}${p === 2 ? `所以 $x = ${num(V)}$ 或 $x = ${num(V.neg())}$。两者都使 $x^{2}$ 为正数，所以都是解。` : `所以 $x = ${num(V)}$，它是唯一的实数立方根。`}`,
                )
              : t(
                  `Divide by $${p}$, then convert:${steps(`${B.of("x")} = ${k}`, `x = ${B.b}^{${k}} = ${num(V)}`)}Only positive $x$ are allowed in $${B.of("x")}$, so there is no negative solution.`,
                  `两边除以 $${p}$，再化为指数式：${steps(`${B.of("x")} = ${k}`, `x = ${B.b}^{${k}} = ${num(V)}`)}$${B.of("x")}$ 中 $x$ 只能取正数，所以没有负数解。`,
                ),
          });
        }
      },
    },
  ],
  diagnostic: "product-rule-equations",
};

export const solvingLogarithmicEquationsByCombiningTheLawsOfLogarithms: TopicDef = {
  id: "solving-logarithmic-equations-by-combining-the-laws-of-logarithms",
  title: t("Solving Logarithmic Equations by Combining the Laws of Logarithms", "综合运用对数运算法则解对数方程"),
  summary: t(
    "Use several laws of logarithms in one equation to reduce it to a single logarithm, then solve and check.",
    "在一个方程中综合运用几条对数法则化成一个对数，再求解并检验。",
  ),
  prerequisites: ["solving-logarithmic-equations-using-the-laws-of-logarithms"],
  encompasses: [
    { topic: "solving-logarithmic-equations-using-the-laws-of-logarithms", weight: 0.6 },
    { topic: "combining-laws-of-logarithms", weight: 0.4 },
  ],
  xp: 16,
  standards: ["CCSS.HSF.LE.A.4", "CCSS.HSA.REI.A.2"],
  knowledgePoints: [
    {
      id: "power-and-quotient",
      title: t("Powers with sums and differences", "幂与和、差"),
      explanation: t(
        "First move coefficients into the arguments with the power rule, then combine with the product or quotient rule:\n\n$$2\\log_{3} x - \\log_{3} 4 = 2 \\implies \\log_{3} \\frac{x^{2}}{4} = 2 \\implies \\frac{x^{2}}{4} = 9 \\implies x^{2} = 36$$\n\nSo $x = 6$ or $x = -6$. In the original equation $\\log_{3} x$ needs $x > 0$, so $x = -6$ is rejected and the solution is $x = 6$.",
        "先用幂的法则把系数移进真数，再用积或商的法则合并：\n\n$$2\\log_{3} x - \\log_{3} 4 = 2 \\implies \\log_{3} \\frac{x^{2}}{4} = 2 \\implies \\frac{x^{2}}{4} = 9 \\implies x^{2} = 36$$\n\n所以 $x = 6$ 或 $x = -6$。原方程中 $\\log_{3} x$ 要求 $x > 0$，所以舍去 $x = -6$，方程的解是 $x = 6$。",
      ),
      generate(rng) {
        for (;;) {
          const B = drawBase(rng, [2, 3, 4, 5, 6, 7]);
          const k = rng.int(0, 2);
          const P = B.b ** k;
          const mm = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 12, 16, 18, 25]);
          const minus = rng.bool(0.6);
          const X2 = minus ? Q.of(mm * P) : Q.of(P, mm);
          const r = rationalSqrt(X2);
          if (!r || X2.cmp(Q.of(400)) > 0) continue;
          const sign = minus ? "-" : "+";
          const eq = `2${B.of("x")} ${sign} ${B.of(String(mm))} = ${k}`;
          const comb = minus ? `\\frac{x^{2}}{${mm}}` : `${mm}x^{2}`;
          return solutionsProblem({
            prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
            values: [sol(r)],
            wrong: [[sol(r), sol(r.neg())], [sol(X2)], [sol(r.mul(Q.of(2)))]],
            solution: t(
              `Use the power rule, then the ${minus ? "quotient" : "product"} rule:${steps(`${B.of("x^{2}")} ${sign} ${B.of(String(mm))} = ${k}`, `${B.of(comb)} = ${k}`, `${comb} = ${P}`, `x^{2} = ${num(X2)}`)}So $x = ${num(r)}$ or $x = ${num(r.neg())}$. $${B.of("x")}$ needs $x > 0$, so the solution is $x = ${num(r)}$.`,
              `先用幂的法则，再用${minus ? "商" : "积"}的法则：${steps(`${B.of("x^{2}")} ${sign} ${B.of(String(mm))} = ${k}`, `${B.of(comb)} = ${k}`, `${comb} = ${P}`, `x^{2} = ${num(X2)}`)}所以 $x = ${num(r)}$ 或 $x = ${num(r.neg())}$。$${B.of("x")}$ 要求 $x > 0$，所以方程的解是 $x = ${num(r)}$。`,
            ),
          });
        }
      },
    },
    {
      id: "three-logarithms",
      title: t("Three logarithms", "三个对数"),
      explanation: t(
        "Combine all the logarithms on one side into one, using the product rule for sums and the quotient rule for differences:\n\n$$\\log_{2} x + \\log_{2}(x + 2) - \\log_{2} 3 = 3 \\implies \\log_{2} \\frac{x(x + 2)}{3} = 3 \\implies x(x + 2) = 24$$\n\n$$x^{2} + 2x - 24 = 0 \\implies (x - 4)(x + 6) = 0$$\n\n$x = -6$ makes $\\log_{2} x$ not defined, so the solution is $x = 4$.",
        "把一边的所有对数合并成一个：和用积的法则，差用商的法则：\n\n$$\\log_{2} x + \\log_{2}(x + 2) - \\log_{2} 3 = 3 \\implies \\log_{2} \\frac{x(x + 2)}{3} = 3 \\implies x(x + 2) = 24$$\n\n$$x^{2} + 2x - 24 = 0 \\implies (x - 4)(x + 6) = 0$$\n\n$x = -6$ 使 $\\log_{2} x$ 无意义，所以方程的解是 $x = 4$。",
      ),
      generate(rng) {
        for (;;) {
          const B = drawBase(rng, [2, 3, 4, 5]);
          const k = rng.int(0, 2);
          const mm = rng.int(2, 6);
          const P = mm * B.b ** k;
          if (P > 150) continue;
          const choices = divisors(P).filter((d) => d * d !== P);
          const r = rng.pick(choices);
          const s = P / r;
          const a = s - r;
          const eq = `${B.of("x")} + ${B.of(linear(1, a))} - ${B.of(String(mm))} = ${k}`;
          return solutionsProblem({
            prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
            values: [sol(r)],
            wrong: [[sol(r), sol(-s)], [sol(-s)]],
            solution: t(
              `Combine the logarithms and convert:${steps(`${B.of(`\\frac{x(${linear(1, a)})}{${mm}}`)} = ${k}`, `x(${linear(1, a)}) = ${mm} \\cdot ${B.b}^{${k}} = ${P}`, `(${linear(1, -r)})(${linear(1, s)}) = 0`)}So $x = ${r}$ or $x = ${-s}$. $x = ${-s}$ makes $${B.of("x")}$ not defined, so the solution is $x = ${r}$.`,
              `合并对数，再化为指数式：${steps(`${B.of(`\\frac{x(${linear(1, a)})}{${mm}}`)} = ${k}`, `x(${linear(1, a)}) = ${mm} \\cdot ${B.b}^{${k}} = ${P}`, `(${linear(1, -r)})(${linear(1, s)}) = 0`)}所以 $x = ${r}$ 或 $x = ${-s}$。$x = ${-s}$ 使 $${B.of("x")}$ 无意义，所以方程的解是 $x = ${r}$。`,
            ),
          });
        }
      },
    },
    {
      id: "coefficients-and-linear-arguments",
      title: t("A power over a linear argument", "幂除以一次式"),
      explanation: t(
        "When the coefficient sits on one logarithm and the other has a linear argument, the equation becomes a quadratic:\n\n$$2\\log_{2} x - \\log_{2}(x + 4) = 1 \\implies \\frac{x^{2}}{x + 4} = 2 \\implies x^{2} - 2x - 8 = 0$$\n\n$(x - 4)(x + 2) = 0$, and $x = -2$ is rejected because $\\log_{2} x$ needs $x > 0$. The solution is $x = 4$.",
        "一个对数带系数、另一个对数的真数是一次式时，方程会变成二次方程：\n\n$$2\\log_{2} x - \\log_{2}(x + 4) = 1 \\implies \\frac{x^{2}}{x + 4} = 2 \\implies x^{2} - 2x - 8 = 0$$\n\n$(x - 4)(x + 2) = 0$，而 $\\log_{2} x$ 要求 $x > 0$，所以舍去 $x = -2$。方程的解是 $x = 4$。",
      ),
      generate(rng) {
        for (;;) {
          const B = drawBase(rng, [2, 3, 4, 5]);
          const k = rng.int(0, 2);
          const P = B.b ** k;
          const c = rng.int(1, 3);
          const r = rng.int(P * c + 1, P * c + 12);
          const s = P * c - r;
          if ((-r * s) % P !== 0) continue;
          const a = (-r * s) / P;
          if (a === 0 || a > 80) continue;
          const arg = linear(c, a);
          const eq = `2${B.of("x")} - ${B.of(arg)} = ${k}`;
          return solutionsProblem({
            prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
            values: [sol(r)],
            wrong: [[sol(r), sol(s)], [sol(s)]],
            solution: t(
              `Use the power and quotient rules, then convert:${steps(`${B.of(`\\frac{x^{2}}{${arg}}`)} = ${k}`, `x^{2} = ${P}(${arg})`, `${poly([1, "x^{2}"], [-P * c, "x"], [-P * a, ""])} = 0`, `(${linear(1, -r)})(${linear(1, -s)}) = 0`)}So $x = ${r}$ or $x = ${s}$. $x = ${s}$ makes $${B.of("x")}$ not defined, so the solution is $x = ${r}$.`,
              `用幂和商的法则合并，再化为指数式：${steps(`${B.of(`\\frac{x^{2}}{${arg}}`)} = ${k}`, `x^{2} = ${P}(${arg})`, `${poly([1, "x^{2}"], [-P * c, "x"], [-P * a, ""])} = 0`, `(${linear(1, -r)})(${linear(1, -s)}) = 0`)}所以 $x = ${r}$ 或 $x = ${s}$。$x = ${s}$ 使 $${B.of("x")}$ 无意义，所以方程的解是 $x = ${r}$。`,
            ),
          });
        }
      },
    },
  ],
  diagnostic: "three-logarithms",
};

export const solvingLogarithmicEquationsWithLogarithmsOnBothSides: TopicDef = {
  id: "solving-logarithmic-equations-with-logarithms-on-both-sides",
  title: t("Solving Logarithmic Equations With Logarithms on Both Sides", "解两边都有对数的方程"),
  summary: t(
    "Solve equations such as $\\log_{5}(2x + 1) = \\log_{5}(x + 4)$ by setting the arguments equal, and check the domain.",
    "令真数相等来解 $\\log_{5}(2x + 1) = \\log_{5}(x + 4)$ 这样的方程，并检验定义域。",
  ),
  prerequisites: ["solving-logarithmic-equations-using-the-laws-of-logarithms"],
  encompasses: [
    { topic: "solving-logarithmic-equations-using-the-laws-of-logarithms", weight: 0.5 },
    { topic: "equations-with-variables-on-both-sides", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.LE.A.4", "CCSS.HSA.REI.A.2"],
  knowledgePoints: [
    {
      id: "equal-arguments",
      title: t("Setting the arguments equal", "令真数相等"),
      explanation: t(
        "A logarithm takes each value only once, so logarithms with the same base are equal exactly when their arguments are equal:\n\n$$\\log_{5}(2x + 1) = \\log_{5}(x + 4) \\implies 2x + 1 = x + 4 \\implies x = 3$$\n\nCheck: both arguments equal $7 > 0$. If the common value of the arguments were negative or $0$, the logarithms would be not defined and the equation would have **no solution**.",
        "对数函数的每个值只取一次，所以同底数的两个对数相等，当且仅当它们的真数相等：\n\n$$\\log_{5}(2x + 1) = \\log_{5}(x + 4) \\implies 2x + 1 = x + 4 \\implies x = 3$$\n\n检验：两个真数都等于 $7 > 0$。如果真数的公共值是负数或 $0$，对数无意义，方程**无解**。",
      ),
      generate(rng) {
        for (;;) {
          const L = anyLog(rng);
          const [a1, a2] = rng.sample([1, 2, 3, 4, 5, -1, -2], 2) as [number, number];
          const x = rng.int(-6, 8);
          const v = rng.bool(0.2) ? -rng.int(0, 6) : rng.int(1, 12);
          const c1 = v - a1 * x;
          const c2 = v - a2 * x;
          if (Math.abs(c1) > 30 || Math.abs(c2) > 30) continue;
          const [l, r] = [linear(a1, c1), linear(a2, c2)];
          const eq = `${L(l)} = ${L(r)}`;
          const ok = v > 0;
          return solutionsProblem({
            prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
            values: ok ? [sol(x)] : [],
            wrong: [ok ? [] : [sol(x)], [sol(-x)], [sol(Q.of(c2 + c1, a1 - a2))]],
            solution: t(
              `Set the arguments equal:${steps(`${l} = ${r}`, `x = ${x}`)}${ok ? `Check: both arguments equal $${v}$, which is positive, so $x = ${x}$ is the solution.` : `Check: both arguments equal $${v}$, which is not positive, so the logarithms are not defined. There is no solution.`}`,
              `令真数相等：${steps(`${l} = ${r}`, `x = ${x}`)}${ok ? `检验：两个真数都等于 $${v}$，是正数，所以 $x = ${x}$ 是方程的解。` : `检验：两个真数都等于 $${v}$，不是正数，对数无意义。方程无解。`}`,
            ),
          });
        }
      },
    },
    {
      id: "combining-first",
      title: t("Combining logarithms first", "先合并对数"),
      explanation: t(
        "When one side has two logarithms, combine them into one, then set the arguments equal:\n\n$$\\log_{2} x + \\log_{2}(x + 1) = \\log_{2}(x + 8) \\implies x(x + 1) = x + 8 \\implies x^{2} = 8$$\n\nCheck each candidate in **every** logarithm of the original equation, and keep only those that make all the arguments positive.",
        "一边有两个对数时，先合并成一个，再令真数相等：\n\n$$\\log_{2} x + \\log_{2}(x + 1) = \\log_{2}(x + 8) \\implies x(x + 1) = x + 8 \\implies x^{2} = 8$$\n\n把每个候选解代入原方程的**每一个**对数检验，只保留使所有真数都为正的解。",
      ),
      generate(rng) {
        for (;;) {
          const L = anyLog(rng);
          const [r, s] = rng.sample([-8, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 2) as [number, number];
          const c = rng.int(1, 4);
          const a = c - r - s;
          const d = -r * s;
          if (a === 0 || Math.abs(a) > 9 || Math.abs(d) > 50 || (a === c && d === 0) || (c === 1 && d === a)) continue;
          const valid = (z: number) => z > 0 && z + a > 0 && c * z + d > 0;
          const values = [r, s].filter(valid).sort((p, q) => p - q);
          if (values.length === 0) continue;
          const eq = `${L("x")} + ${L(linear(1, a))} = ${L(linear(c, d))}`;
          const rejected = [r, s].filter((z) => !valid(z));
          const quad = `${poly([1, "x^{2}"], [-(r + s), "x"], [r * s, ""])} = 0`;
          return solutionsProblem({
            prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
            values: values.map(sol),
            wrong: [[sol(r), sol(s)], [], rejected.map(sol)],
            solution: t(
              `Combine the left side with the product rule and set the arguments equal:${steps(`x(${linear(1, a)}) = ${linear(c, d)}`, quad, orList([r, s]))}${rejected.length ? `$x = ${rejected[0]}$ makes an argument of the original equation negative or $0$, so it is rejected. ` : "Both candidates make every argument positive. "}The solution set is $${values.map((v) => `x = ${v}`).join(", ")}$.`,
              `用积的法则合并左边，再令真数相等：${steps(`x(${linear(1, a)}) = ${linear(c, d)}`, quad, orList([r, s]))}${rejected.length ? `$x = ${rejected[0]}$ 使原方程的某个真数为负数或 $0$，应舍去。` : "两个候选解都使所有真数为正。"}方程的解是 $${values.map((v) => `x = ${v}`).join(", ")}$。`,
            ),
          });
        }
      },
    },
    {
      id: "coefficients-on-both-sides",
      title: t("A coefficient on one side", "一边有系数"),
      explanation: t(
        "Move a coefficient into the argument with the power rule before setting the arguments equal:\n\n$$2\\log_{3} x = \\log_{3}(x + 6) \\implies \\log_{3} x^{2} = \\log_{3}(x + 6) \\implies x^{2} - x - 6 = 0$$\n\n$(x - 3)(x + 2) = 0$. The original equation contains $\\log_{3} x$, so $x$ must be positive: $x = -2$ is rejected and the solution is $x = 3$.",
        "令真数相等之前，先用幂的法则把系数移进真数：\n\n$$2\\log_{3} x = \\log_{3}(x + 6) \\implies \\log_{3} x^{2} = \\log_{3}(x + 6) \\implies x^{2} - x - 6 = 0$$\n\n$(x - 3)(x + 2) = 0$。原方程含有 $\\log_{3} x$，$x$ 必须为正，所以舍去 $x = -2$，方程的解是 $x = 3$。",
      ),
      generate(rng) {
        for (;;) {
          const L = anyLog(rng);
          const r = rng.int(1, 9);
          const s = rng.nonZero(-9, 9);
          const p = r + s;
          const q = -r * s;
          if (s === r || p === 0 || Math.abs(q) > 60) continue;
          const values = [r, s].filter((z) => z > 0).sort((u, v) => u - v);
          const eq = `2${L("x")} = ${L(linear(p, q))}`;
          return solutionsProblem({
            prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
            values: values.map(sol),
            wrong: [[sol(r), sol(s)], [sol(r)], [sol(-r), sol(-s)]],
            solution: t(
              `Use the power rule and set the arguments equal:${steps(`x^{2} = ${linear(p, q)}`, `${poly([1, "x^{2}"], [-p, "x"], [-q, ""])} = 0`, `(${linear(1, -r)})(${linear(1, -s)}) = 0`)}${s < 0 ? `$x = ${s}$ is rejected, because $${L("x")}$ needs $x > 0$. ` : `Both values are positive, and then $${linear(p, q)} = x^{2}$ is positive too. `}The solution set is $${values.map((v) => `x = ${v}`).join(", ")}$.`,
              `用幂的法则，再令真数相等：${steps(`x^{2} = ${linear(p, q)}`, `${poly([1, "x^{2}"], [-p, "x"], [-q, ""])} = 0`, `(${linear(1, -r)})(${linear(1, -s)}) = 0`)}${s < 0 ? `$${L("x")}$ 要求 $x > 0$，所以舍去 $x = ${s}$。` : `两个值都是正数，此时 $${linear(p, q)} = x^{2}$ 也是正数。`}方程的解是 $${values.map((v) => `x = ${v}`).join(", ")}$。`,
            ),
          });
        }
      },
    },
  ],
  diagnostic: "equal-arguments",
};

/** logPow writes (log x)²: "(\log_{2} x)^{2}". */
const logSq = (B: Base) => `(${B.of("x")})^{2}`;

export const solvingLogarithmicEquationsUsingTheZeroProductProperty: TopicDef = {
  id: "solving-logarithmic-equations-using-the-zero-product-property",
  title: t("Solving Logarithmic Equations Using the Zero-Product Property", "用零积性质解对数方程"),
  summary: t(
    "Factor equations such as $(\\log_{2} x)^{2} - 3\\log_{2} x + 2 = 0$ and $x\\log_{3} x - 2x = 0$, and reject solutions outside the domain.",
    "对 $(\\log_{2} x)^{2} - 3\\log_{2} x + 2 = 0$、$x\\log_{3} x - 2x = 0$ 这样的方程因式分解，并舍去不在定义域内的解。",
  ),
  prerequisites: ["solving-logarithmic-equations", "solving-exponential-equations-using-the-zero-product-property"],
  encompasses: [
    { topic: "solving-logarithmic-equations", weight: 0.5 },
    { topic: "solving-exponential-equations-using-the-zero-product-property", weight: 0.3 },
    { topic: "solving-quadratic-equations-by-factoring", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.LE.A.4", "CCSS.HSA.SSE.A.2"],
  knowledgePoints: [
    {
      id: "common-factors-with-logarithms",
      title: t("Common factors", "提取公因式"),
      explanation: t(
        "Factor out what the terms share, then set each factor equal to $0$:\n\n$$x\\log_{3} x - 2x = 0 \\implies x(\\log_{3} x - 2) = 0 \\implies x = 0 \\text{ or } \\log_{3} x = 2$$\n\n$x = 0$ is rejected, since $\\log_{3} 0$ is not defined, so the solution is $x = 9$. In the same way, $(x - 1)\\log_{2}(x + 3) = 0$ gives $x = 1$ or $x + 3 = 1$: check each candidate in the original equation.",
        "提取各项的公因式，再令每个因式等于 $0$：\n\n$$x\\log_{3} x - 2x = 0 \\implies x(\\log_{3} x - 2) = 0 \\implies x = 0 \\text{ 或 } \\log_{3} x = 2$$\n\n$\\log_{3} 0$ 无意义，所以舍去 $x = 0$，方程的解是 $x = 9$。同样，$(x - 1)\\log_{2}(x + 3) = 0$ 得 $x = 1$ 或 $x + 3 = 1$：要把每个候选解代回原方程检验。",
      ),
      generate(rng) {
        if (rng.bool()) {
          const B = drawBase(rng, [2, 3, 4, 5]);
          const k = rng.nonZero(-2, 3);
          const V = Q.of(B.b).pow(k);
          const eq = `x${B.of("x")} ${k > 0 ? "-" : "+"} ${Math.abs(k) === 1 ? "" : Math.abs(k)}x = 0`;
          return solutionsProblem({
            prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
            values: [sol(V)],
            wrong: [["0", sol(V)], [sol(k)], ["0", sol(k)]],
            solution: t(
              `Factor out $x$:${steps(`x(${B.of("x")}${plusK(-k)}) = 0`, `x = 0 \\quad \\text{or} \\quad ${B.of("x")} = ${k}`)}$x = 0$ is rejected, because the logarithm of $0$ is not defined. So $x = ${B.b}^{${k}} = ${num(V)}$.`,
              `提取公因式 $x$：${steps(`x(${B.of("x")}${plusK(-k)}) = 0`, `x = 0 \\quad \\text{或} \\quad ${B.of("x")} = ${k}`)}$0$ 的对数无意义，所以舍去 $x = 0$。于是 $x = ${B.b}^{${k}} = ${num(V)}$。`,
            ),
          });
        }
        for (;;) {
          const B = drawBase(rng, [2, 3, 5, 7]);
          const p = rng.nonZero(-6, 6);
          const q = rng.int(-6, 6);
          const one = 1 - q;
          if (p === one) continue;
          const valid = p + q > 0;
          const values = (valid ? [p, one] : [one]).sort((u, v) => u - v);
          const eq = `(${linear(1, -p)})${B.of(linear(1, q))} = 0`;
          return solutionsProblem({
            prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
            values: values.map(sol),
            wrong: [[sol(p), sol(one)], [sol(p), sol(-q)], [sol(p)]],
            solution: t(
              `Set each factor equal to $0$:${steps(`${linear(1, -p)} = 0 \\quad \\text{or} \\quad ${B.of(linear(1, q))} = 0`, `x = ${p} \\quad \\text{or} \\quad ${linear(1, q)} = 1`)}So $x = ${p}$ or $x = ${one}$. ${valid ? `Both make the argument $${linear(1, q)}$ positive, so both are solutions.` : `For $x = ${p}$ the argument is $${p + q}$, which is not positive, so $x = ${p}$ is rejected. The solution is $x = ${one}$.`}`,
              `令每个因式等于 $0$：${steps(`${linear(1, -p)} = 0 \\quad \\text{或} \\quad ${B.of(linear(1, q))} = 0`, `x = ${p} \\quad \\text{或} \\quad ${linear(1, q)} = 1`)}所以 $x = ${p}$ 或 $x = ${one}$。${valid ? `两者都使真数 $${linear(1, q)}$ 为正，所以都是解。` : `$x = ${p}$ 时真数为 $${p + q}$，不是正数，应舍去。方程的解是 $x = ${one}$。`}`,
            ),
          });
        }
      },
    },
    {
      id: "quadratic-in-a-logarithm",
      title: t("Equations quadratic in a logarithm", "关于对数的二次方程"),
      explanation: t(
        "Treat the logarithm as a new unknown. With $u = \\log_{2} x$, the equation $(\\log_{2} x)^{2} - 3\\log_{2} x + 2 = 0$ becomes\n\n$$u^{2} - 3u + 2 = 0 \\implies (u - 1)(u - 2) = 0 \\implies u = 1 \\text{ or } u = 2$$\n\nThen go back to $x$: $\\log_{2} x = 1$ gives $x = 2$, and $\\log_{2} x = 2$ gives $x = 4$. The values of $u$ are not the answers.",
        "把对数看作新的未知数。设 $u = \\log_{2} x$，方程 $(\\log_{2} x)^{2} - 3\\log_{2} x + 2 = 0$ 变为\n\n$$u^{2} - 3u + 2 = 0 \\implies (u - 1)(u - 2) = 0 \\implies u = 1 \\text{ 或 } u = 2$$\n\n再回到 $x$：$\\log_{2} x = 1$ 得 $x = 2$，$\\log_{2} x = 2$ 得 $x = 4$。$u$ 的值不是答案。",
      ),
      generate(rng) {
        const B = drawBase(rng, [2, 3, 4, 5]);
        const [u1, u2] = rng.sample(B.b === 10 ? [-2, -1, 0, 1, 2] : [-2, -1, 0, 1, 2, 3], 2) as [number, number];
        const [x1, x2] = [Q.of(B.b).pow(u1), Q.of(B.b).pow(u2)];
        const S = u1 + u2;
        const P = u1 * u2;
        const eq = `${poly([1, logSq(B)], [-S, B.of("x")], [P, ""])} = 0`;
        return solutionsProblem({
          prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
          values: [sol(x1), sol(x2)],
          wrong: [[sol(u1), sol(u2)], [sol(x1)], [sol(Q.of(B.b * u1)), sol(Q.of(B.b * u2))]],
          solution: both(
            `Let $u = ${B.of("x")}$, factor, then go back to $x$:`,
            `设 $u = ${B.of("x")}$，因式分解，再回到 $x$：`,
            `${poly([1, "u^{2}"], [-S, "u"], [P, ""])} = 0`,
            `(${linear(1, -u1, "u")})(${linear(1, -u2, "u")}) = 0`,
            `${B.of("x")} = ${u1} \\quad \\text{or} \\quad ${B.of("x")} = ${u2}`,
            orList([x1, x2]),
          ),
        });
      },
    },
    {
      id: "do-not-divide-by-the-logarithm",
      title: t("Do not divide by the logarithm", "不要两边同除以对数"),
      explanation: t(
        "Dividing both sides by an expression that can be $0$ loses solutions. Move everything to one side and factor instead:\n\n$$(\\log_{5} x)^{2} = 2\\log_{5} x \\implies \\log_{5} x(\\log_{5} x - 2) = 0$$\n\n$\\log_{5} x = 0$ gives $x = 1$, and $\\log_{5} x = 2$ gives $x = 25$. Dividing by $\\log_{5} x$ would lose $x = 1$.",
        "两边同除以一个可能为 $0$ 的式子会丢掉解。应该把所有项移到一边再因式分解：\n\n$$(\\log_{5} x)^{2} = 2\\log_{5} x \\implies \\log_{5} x(\\log_{5} x - 2) = 0$$\n\n$\\log_{5} x = 0$ 得 $x = 1$，$\\log_{5} x = 2$ 得 $x = 25$。两边同除以 $\\log_{5} x$ 会丢掉 $x = 1$。",
      ),
      generate(rng) {
        const B = drawBase(rng, [2, 3, 4, 5, 6, 7]);
        const k = rng.nonZero(B.b === 10 ? -2 : -2, B.b === 10 ? 2 : 3);
        const c = rng.pick([1, 1, 2, 3]);
        const V = Q.of(B.b).pow(k);
        const eq = `${coefL(c)}${logSq(B)} = ${coefL(c * k)}${B.of("x")}`;
        return solutionsProblem({
          prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
          values: ["1", sol(V)],
          wrong: [[sol(V)], ["0", sol(V)], ["1", sol(k)]],
          solution: both(
            "Move everything to one side and factor out the logarithm:",
            "把所有项移到一边，提取对数作公因式：",
            `${c === 1 ? "" : c}${B.of("x")}(${B.of("x")}${plusK(-k)}) = 0`,
            `${B.of("x")} = 0 \\quad \\text{or} \\quad ${B.of("x")} = ${k}`,
            orList([1, V]),
          ),
        });
      },
    },
  ],
  diagnostic: "quadratic-in-a-logarithm",
};

// Unit: graphs of exponential functions.

/** Labeled is a point of a graph with the direction of its label. */
interface Labeled {
  readonly at: Point;
  readonly dir: Compass;
}

/** ptL writes a point label: "(1, -2)". */
const ptL = (p: Point) => `(${p[0]}, ${p[1]})`;

const expView: PlaneView = { xMin: -5, xMax: 5, yMin: -6, yMax: 10 };

/** expGraph draws y = f(x) of a transformed exponential function, its horizontal asymptote y = k dashed, with labeled points. */
function expGraph(view: PlaneView, f: (x: number) => number, k: number, pts: readonly Labeled[], rising: boolean, from?: number): Figure {
  const marks: PlaneMark[] = [];
  if (k !== 0) marks.push({ kind: "line", a: [view.xMin, k], b: [view.xMax, k], dashed: true });
  marks.push(from === undefined ? { kind: "curve", f, accent: true } : { kind: "curve", f, from, accent: true });
  for (const p of pts) marks.push({ kind: "point", at: p.at, label: ptL(p.at), dir: p.dir });
  const list = pts.map((p) => ptL(p.at));
  const near = k === 0 ? t("the x-axis", "x 轴") : t(`the dashed horizontal line y = ${k}`, `水平虚线 y = ${k}`);
  return {
    svg: plane(view, marks),
    alt: t(
      `A ${rising ? "rising" : "falling"} exponential curve${list.length ? ` through ${list.join(" and ")}` : ""}, approaching ${near.en} on one side.`,
      `一条${rising ? "上升" : "下降"}的指数曲线${list.length ? `，经过 ${list.join("、")}` : ""}，在一侧逐渐靠近${near["zh-CN"]}。`,
    ),
  };
}

/** expT writes a·b^(x − h) + k: "2^{x}", "3(2)^{x - 1} + 4", "-\left(\frac{1}{2}\right)^{x} - 3". */
function expT(a: Coefficient, b: Q, h: number, k: Coefficient, v = "x"): string {
  const e = linear(1, -h, v);
  const A = toQ(a);
  const lead = coefL(A);
  const base = b.isInteger()
    ? lead === "" || lead === "-"
      ? `${num(b)}^{${e}}`
      : `(${num(b)})^{${e}}`
    : `\\left(${num(b)}\\right)^{${e}}`;
  return `${lead}${base}${plusK(k)}`;
}

/** expFn evaluates a·b^(x − h) + k. */
const expFn = (a: number, b: Q, h: number, k: number) => (x: number) => a * b.toNumber() ** (x - h) + k;

/** units writes "1 unit" or "3 units". */
const unitsEn = (n: number) => `${Math.abs(n)} ${Math.abs(n) === 1 ? "unit" : "units"}`;

/** shiftText describes a vertical translation: "4 units up", "向上平移 4 个单位". */
const vShift = (k: number) => t(`${unitsEn(k)} ${k > 0 ? "up" : "down"}`, `向${k > 0 ? "上" : "下"}平移 ${Math.abs(k)} 个单位`);

export const verticalTranslationsOfExponentialGrowthFunctions: TopicDef = {
  id: "vertical-translations-of-exponential-growth-functions",
  title: t("Vertical Translations of Exponential Growth Functions", "指数增长函数的竖直平移"),
  summary: t(
    "Translate graphs of $y = a \\cdot b^{x}$ up and down, and read translated growth functions from their graphs.",
    "把 $y = a \\cdot b^{x}$ 的图象上下平移，并根据图象求平移后的增长函数。",
  ),
  prerequisites: ["graphing-exponential-growth-functions", "vertical-translations-of-functions"],
  encompasses: [
    { topic: "graphing-exponential-growth-functions", weight: 0.5 },
    { topic: "vertical-translations-of-functions", weight: 0.5 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.BF.B.3", "CCSS.HSF.IF.C.7.E"],
  knowledgePoints: [
    {
      id: "translating-growth-graphs",
      title: t("Writing the translated function", "写出平移后的函数"),
      explanation: t(
        "Adding $k$ to a function moves its graph up $k$ units ($k > 0$) or down $|k|$ units ($k < 0$). For $f(x) = 2^{x}$ moved $3$ units down:\n\n$$g(x) = f(x) - 3 = 2^{x} - 3$$\n\nEvery point moves down $3$, and so does the asymptote: it becomes $y = -3$. Do not put the $-3$ into the exponent: $2^{x - 3}$ is a horizontal shift.",
        "给函数加上 $k$，图象向上平移 $k$ 个单位（$k > 0$）或向下平移 $|k|$ 个单位（$k < 0$）。把 $f(x) = 2^{x}$ 向下平移 $3$ 个单位：\n\n$$g(x) = f(x) - 3 = 2^{x} - 3$$\n\n每个点都向下移动 $3$，渐近线也一样，变为 $y = -3$。不要把 $-3$ 放进指数：$2^{x - 3}$ 是水平平移。",
      ),
      generate(rng) {
        const a = rng.pick([1, 1, 2, 3, 4]);
        const b = Q.of(rng.pick([2, 3, 4, 5, 10]));
        const k = rng.nonZero(-6, 6);
        const f = expT(a, b, 0, 0);
        const answer = expT(a, b, 0, k);
        const s = vShift(k);
        return expressionProblem({
          prompt: t(
            `The graph of $f(x) = ${f}$ is translated ${s.en} to give the graph of $g$. Write $g(x)$.`,
            `把 $f(x) = ${f}$ 的图象${s["zh-CN"]}，得到 $g$ 的图象。写出 $g(x)$。`,
          ),
          answer,
          prefix: "g(x) =",
          wrong: [expT(a, b, 0, -k), expT(a, b, -k, 0), expT(a, b, k, 0)],
          solution: both(
            `A vertical translation adds $${k}$ to the output:`,
            `竖直平移是给函数值加上 $${k}$：`,
            `g(x) = f(x)${plusK(k)} = ${answer}`,
          ),
        });
      },
    },
    {
      id: "translated-growth-graph-equations",
      title: t("The equation from the graph", "由图象求解析式"),
      explanation: t(
        "The graph of $y = b^{x} + k$ is the graph of $y = b^{x}$ moved $k$ units vertically, so its horizontal asymptote is $y = k$. Read $k$ from the asymptote, then find $b$ from a point: at $x = 1$ the height is $b + k$. If the asymptote is $y = -2$ and the graph passes through $(1, 1)$, then $b - 2 = 1$, so $b = 3$ and $y = 3^{x} - 2$.",
        "$y = b^{x} + k$ 的图象是把 $y = b^{x}$ 的图象竖直平移 $k$ 个单位得到的，所以它的水平渐近线是 $y = k$。由渐近线读出 $k$，再由一个点求 $b$：$x = 1$ 时高度为 $b + k$。若渐近线是 $y = -2$，图象经过 $(1, 1)$，则 $b - 2 = 1$，所以 $b = 3$，$y = 3^{x} - 2$。",
      ),
      generate(rng) {
        for (;;) {
          const b = rng.pick([2, 3, 4, 5, 6]);
          const k = rng.int(-5, 8);
          if (b + k > 9 || k === 0 || k === -1 || k === -2 || b + k === 0 || b + k === -1) continue;
          const B = Q.of(b);
          const answer = expT(1, B, 0, k);
          return {
            ...expressionProblem({
              prompt: t(
                `The graph of $y = b^{x} + k$ is shown, with its horizontal asymptote dashed. Find its equation.`,
                `如图是 $y = b^{x} + k$ 的图象，虚线是它的水平渐近线。求它的解析式。`,
              ),
              answer,
              prefix: "y =",
              wrong: [expT(1, B, 0, -k), expT(1, B, 0, 1 + k), expT(1, Q.of(b + k), 0, k), expT(1, B, -k, 0)],
              solution: t(
                `The asymptote is $y = ${k}$, so $k = ${k}$. At $x = 1$ the graph is at height $${b + k}$, so $b${plusK(k)} = ${b + k}$ and $b = ${b}$. The equation is $y = ${answer}$.`,
                `渐近线是 $y = ${k}$，所以 $k = ${k}$。$x = 1$ 时图象高度为 $${b + k}$，所以 $b${plusK(k)} = ${b + k}$，$b = ${b}$。解析式是 $y = ${answer}$。`,
              ),
            }),
            figure: expGraph(
              expView,
              expFn(1, B, 0, k),
              k,
              [
                { at: [0, 1 + k], dir: "e" },
                { at: [1, b + k], dir: "e" },
              ],
              true,
            ),
          };
        }
      },
    },
    {
      id: "values-of-translated-growth-functions",
      title: t("Values and the y-intercept", "函数值与 y 轴截距"),
      explanation: t(
        "Evaluate a translated function by computing the power first, then multiplying, then adding $k$. For $g(x) = 3(2)^{x} + 4$, the $y$-intercept is\n\n$$g(0) = 3(2)^{0} + 4 = 3 + 4 = 7$$\n\nand $g(-1) = 3 \\cdot \\frac{1}{2} + 4 = \\frac{11}{2}$. The $y$-intercept of $a \\cdot b^{x} + k$ is always $a + k$.",
        "计算平移后的函数值：先算幂，再乘，最后加 $k$。对 $g(x) = 3(2)^{x} + 4$，$y$ 轴截距是\n\n$$g(0) = 3(2)^{0} + 4 = 3 + 4 = 7$$\n\n而 $g(-1) = 3 \\cdot \\frac{1}{2} + 4 = \\frac{11}{2}$。$a \\cdot b^{x} + k$ 的 $y$ 轴截距总是 $a + k$。",
      ),
      generate(rng) {
        const a = rng.pick([1, 2, 3, 4, 5]);
        const b = rng.pick([2, 3, 4, 5]);
        const k = rng.nonZero(-9, 9);
        const c = rng.pick([-1, 0, 0, 1, 2, 3]);
        const B = Q.of(b);
        const g = expT(a, B, 0, k);
        const value = B.pow(c).mul(Q.of(a)).add(Q.of(k));
        const intercept = c === 0 && rng.bool();
        return numberProblem({
          prompt: intercept
            ? t(`What is the $y$-intercept of the graph of $g(x) = ${g}$?`, `$g(x) = ${g}$ 的图象的 $y$ 轴截距是多少？`)
            : t(`For $g(x) = ${g}$, find $g(${c})$.`, `已知 $g(x) = ${g}$，求 $g(${c})$。`),
          answer: value,
          wrong: [
            B.pow(c).mul(Q.of(a)),
            Q.of(a * b)
              .pow(c)
              .add(Q.of(k)),
            Q.of(a * b * c + k),
            B.pow(c).mul(Q.of(a + k)),
          ],
          solution: both(
            "Compute the power, multiply, then add:",
            "先算幂，再乘，最后相加：",
            `g(${c}) = ${a === 1 ? "" : a}${a === 1 ? `${b}^{${c}}` : `(${b})^{${c}}`}${plusK(k)} = ${a === 1 ? "" : `${a} \\cdot `}${num(B.pow(c))}${plusK(k)} = ${num(value)}`,
          ),
        });
      },
    },
  ],
  diagnostic: "translated-growth-graph-equations",
};

export const verticalTranslationsOfExponentialDecayFunctions: TopicDef = {
  id: "vertical-translations-of-exponential-decay-functions",
  title: t("Vertical Translations of Exponential Decay Functions", "指数衰减函数的竖直平移"),
  summary: t(
    "Translate decay graphs such as $y = \\left(\\frac{1}{2}\\right)^{x}$ vertically, read them from graphs and find their $x$-intercepts.",
    "把 $y = \\left(\\frac{1}{2}\\right)^{x}$ 这样的衰减函数图象竖直平移，根据图象求解析式，并求 $x$ 轴截距。",
  ),
  prerequisites: ["vertical-translations-of-exponential-growth-functions", "graphing-exponential-decay-functions"],
  encompasses: [
    { topic: "vertical-translations-of-exponential-growth-functions", weight: 0.6 },
    { topic: "graphing-exponential-decay-functions", weight: 0.4 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.BF.B.3", "CCSS.HSF.IF.C.7.E"],
  knowledgePoints: [
    {
      id: "translating-decay-graphs",
      title: t("Writing the translated function", "写出平移后的函数"),
      explanation: t(
        "Decay functions translate the same way: adding $k$ moves the graph and its asymptote vertically. For $f(x) = 4\\left(\\frac{1}{3}\\right)^{x}$ moved $2$ units up:\n\n$$g(x) = 4\\left(\\frac{1}{3}\\right)^{x} + 2$$\n\nThe graph now falls toward the asymptote $y = 2$ instead of the $x$-axis.",
        "衰减函数的平移方法相同：加上 $k$ 会把图象和渐近线一起竖直平移。把 $f(x) = 4\\left(\\frac{1}{3}\\right)^{x}$ 向上平移 $2$ 个单位：\n\n$$g(x) = 4\\left(\\frac{1}{3}\\right)^{x} + 2$$\n\n现在图象下降时趋近的是渐近线 $y = 2$，而不是 $x$ 轴。",
      ),
      generate(rng) {
        const a = rng.pick([1, 1, 2, 3, 5]);
        const b = Q.of(1, rng.pick([2, 3, 4, 5, 10]));
        const k = rng.nonZero(-6, 6);
        const f = expT(a, b, 0, 0);
        const answer = expT(a, b, 0, k);
        const s = vShift(k);
        return expressionProblem({
          prompt: t(
            `The graph of $f(x) = ${f}$ is translated ${s.en} to give the graph of $g$. Write $g(x)$.`,
            `把 $f(x) = ${f}$ 的图象${s["zh-CN"]}，得到 $g$ 的图象。写出 $g(x)$。`,
          ),
          answer,
          prefix: "g(x) =",
          wrong: [expT(a, b, 0, -k), expT(a, b, -k, 0), expT(a, Q.one.div(b), 0, k)],
          solution: both(
            `A vertical translation adds $${k}$ to the output:`,
            `竖直平移是给函数值加上 $${k}$：`,
            `g(x) = f(x)${plusK(k)} = ${answer}`,
          ),
        });
      },
    },
    {
      id: "translated-decay-graph-equations",
      title: t("The equation from the graph", "由图象求解析式"),
      explanation: t(
        "A translated decay graph $y = \\left(\\frac{1}{b}\\right)^{x} + k$ falls from left to right toward its asymptote $y = k$. Read $k$ from the asymptote, then use a point on the left: at $x = -1$ the height is $b + k$, since $\\left(\\frac{1}{b}\\right)^{-1} = b$. With asymptote $y = 1$ and the point $(-1, 4)$: $b = 3$, so $y = \\left(\\frac{1}{3}\\right)^{x} + 1$.",
        "平移后的衰减函数 $y = \\left(\\frac{1}{b}\\right)^{x} + k$ 的图象从左到右下降，趋近渐近线 $y = k$。由渐近线读出 $k$，再用左边的一个点：$x = -1$ 时高度为 $b + k$，因为 $\\left(\\frac{1}{b}\\right)^{-1} = b$。若渐近线是 $y = 1$，图象经过 $(-1, 4)$，则 $b = 3$，$y = \\left(\\frac{1}{3}\\right)^{x} + 1$。",
      ),
      generate(rng) {
        for (;;) {
          const b = rng.pick([2, 3, 4, 5, 6]);
          const k = rng.int(-5, 8);
          if (b + k > 9 || k === 0 || k === -1 || k === -2 || b + k === 0 || b + k === -1) continue;
          const B = Q.of(1, b);
          const answer = expT(1, B, 0, k);
          return {
            ...expressionProblem({
              prompt: t(
                `The graph of $y = \\left(\\frac{1}{b}\\right)^{x} + k$ is shown, with its horizontal asymptote dashed. Find its equation.`,
                `如图是 $y = \\left(\\frac{1}{b}\\right)^{x} + k$ 的图象，虚线是它的水平渐近线。求它的解析式。`,
              ),
              answer,
              prefix: "y =",
              wrong: [
                expT(1, Q.of(b), 0, k),
                expT(1, B, 0, -k),
                expT(1, B, 0, 1 + k),
                ...(b + k > 1 ? [expT(1, Q.of(1, b + k), 0, k)] : []),
              ],
              solution: t(
                `The asymptote is $y = ${k}$, so $k = ${k}$. At $x = -1$ the graph is at height $${b + k}$, so $b${plusK(k)} = ${b + k}$ and $b = ${b}$. The equation is $y = ${answer}$.`,
                `渐近线是 $y = ${k}$，所以 $k = ${k}$。$x = -1$ 时图象高度为 $${b + k}$，所以 $b${plusK(k)} = ${b + k}$，$b = ${b}$。解析式是 $y = ${answer}$。`,
              ),
            }),
            figure: expGraph(
              expView,
              expFn(1, B, 0, k),
              k,
              [
                { at: [-1, b + k], dir: "w" },
                { at: [0, 1 + k], dir: "ne" },
              ],
              false,
            ),
          };
        }
      },
    },
    {
      id: "x-intercepts-of-translated-graphs",
      title: t("The $x$-intercept", "$x$ 轴截距"),
      explanation: t(
        "A graph moved down crosses the $x$-axis. To find where, set the function equal to $0$ and solve the exponential equation:\n\n$$\\left(\\frac{1}{2}\\right)^{x} - 8 = 0 \\implies \\left(\\frac{1}{2}\\right)^{x} = 8 = \\left(\\frac{1}{2}\\right)^{-3} \\implies x = -3$$\n\nA decay graph crosses on the left of the $y$-axis, a growth graph on the right.",
        "向下平移后的图象会与 $x$ 轴相交。令函数值为 $0$，解指数方程，求交点的位置：\n\n$$\\left(\\frac{1}{2}\\right)^{x} - 8 = 0 \\implies \\left(\\frac{1}{2}\\right)^{x} = 8 = \\left(\\frac{1}{2}\\right)^{-3} \\implies x = -3$$\n\n衰减函数的图象在 $y$ 轴左侧与 $x$ 轴相交，增长函数的图象在右侧相交。",
      ),
      generate(rng) {
        const b = rng.pick([2, 3, 4, 5]);
        const a = rng.pick([1, 1, 2, 3]);
        const mm = rng.int(1, b === 2 ? 4 : 3);
        const decay = rng.bool(0.6);
        const B = decay ? Q.of(1, b) : Q.of(b);
        const k = -a * b ** mm;
        const x = decay ? -mm : mm;
        const g = expT(a, B, 0, k);
        return numberProblem({
          prompt: t(
            `Find the $x$-intercept of the graph of $g(x) = ${g}$. Give its $x$-coordinate.`,
            `求 $g(x) = ${g}$ 的图象与 $x$ 轴交点的横坐标。`,
          ),
          answer: x,
          solveFor: "x",
          wrong: [-x, -k, Q.of(-k, a)],
          solution: both(
            "Set $g(x) = 0$ and write both sides as powers of the same base:",
            "令 $g(x) = 0$，把两边写成同底数的幂：",
            `${g} = 0`,
            `${expT(1, B, 0, 0)} = ${b ** mm} = ${expT(1, B, 0, 0).replace("{x}", `{${x}}`)}`,
            `x = ${x}`,
          ),
        });
      },
    },
  ],
  diagnostic: "translated-decay-graph-equations",
};

/** Context is a quantity modeled over time t, with the words to describe it. */
interface Context {
  readonly what: Text;
  readonly per: Text;
}

const growthContexts: readonly Context[] = [
  {
    what: t(
      "the number of bacteria in a culture, in thousands, $t$ hours after it is started",
      "培养皿中细菌的数量（单位：千个）随开始培养后的时间 $t$（小时）的变化",
    ),
    per: t("hour", "每小时"),
  },
  {
    what: t(
      "the number of users of an app, in millions, $t$ years after its launch",
      "某应用的用户数（单位：百万）随上线后的时间 $t$（年）的变化",
    ),
    per: t("year", "每年"),
  },
  {
    what: t(
      "the area covered by algae on a pond, in square meters, $t$ weeks after it is first measured",
      "池塘中藻类覆盖的面积（单位：平方米）随首次测量后的时间 $t$（周）的变化",
    ),
    per: t("week", "每周"),
  },
];

const decayContexts: readonly Context[] = [
  {
    what: t(
      "the value of a machine, in thousands of dollars, $t$ years after it is bought",
      "一台机器的价值（单位：千美元）随购买后的时间 $t$（年）的变化",
    ),
    per: t("year", "每年"),
  },
  {
    what: t(
      "the mass of a radioactive sample, in grams, $t$ days after it is measured",
      "某放射性样品的质量（单位：克）随测量后的时间 $t$（天）的变化",
    ),
    per: t("day", "每天"),
  },
  {
    what: t(
      "the amount of a medicine in a patient's body, in milligrams, $t$ hours after a dose",
      "病人体内某药物的含量（单位：毫克）随服药后的时间 $t$（小时）的变化",
    ),
    per: t("hour", "每小时"),
  },
];

/** modelPairs are starting values a and factors b with a and a·b whole numbers from 1 to 9 and a whole-number percent change. */
const modelPairs: readonly (readonly [number, Q])[] = [
  [2, Q.of(3, 2)],
  [4, Q.of(3, 2)],
  [6, Q.of(3, 2)],
  [1, Q.of(2)],
  [2, Q.of(2)],
  [3, Q.of(2)],
  [4, Q.of(2)],
  [1, Q.of(3)],
  [2, Q.of(3)],
  [3, Q.of(3)],
  [4, Q.of(5, 4)],
  [1, Q.of(4)],
  [2, Q.of(4)],
  [2, Q.of(1, 2)],
  [4, Q.of(1, 2)],
  [6, Q.of(1, 2)],
  [8, Q.of(1, 2)],
  [4, Q.of(3, 4)],
  [8, Q.of(3, 4)],
  [4, Q.of(1, 4)],
  [8, Q.of(1, 4)],
  [5, Q.of(2, 5)],
  [5, Q.of(3, 5)],
  [5, Q.of(4, 5)],
];

const timeView: PlaneView = { xMin: -1, xMax: 6, yMin: -1, yMax: 10 };

/** modelFigure draws a model y = a·b^t + k for t ≥ 0 with labeled points at t = 0 and t = 1. */
function modelFigure(a: number, b: Q, k: number): Figure {
  const y1 = b.mul(Q.of(a)).add(Q.of(k)).toNumber();
  return expGraph(
    timeView,
    expFn(a, b, 0, k),
    k,
    [
      { at: [0, a + k], dir: "e" },
      { at: [1, y1], dir: "e" },
    ],
    a > 0 === b.cmp(Q.one) > 0,
    0,
  );
}

export const interpretingGraphsOfExponentialFunctions: TopicDef = {
  id: "interpreting-graphs-of-exponential-functions",
  title: t("Interpreting Graphs of Exponential Functions", "解读指数函数的图象"),
  summary: t(
    "Read starting values, percent rates of change, predictions and long-run levels from graphs of exponential models.",
    "从指数模型的图象读出初始值、百分变化率、预测值和长期水平。",
  ),
  prerequisites: ["vertical-translations-of-exponential-decay-functions", "interpreting-exponential-decay"],
  encompasses: [
    { topic: "interpreting-exponential-decay", weight: 0.4 },
    { topic: "interpreting-exponential-growth", weight: 0.4 },
    { topic: "vertical-translations-of-exponential-decay-functions", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.IF.B.4", "CCSS.HSF.LE.B.5"],
  knowledgePoints: [
    {
      id: "percent-change-from-a-graph",
      title: t("The percent rate of change", "百分变化率"),
      explanation: t(
        "In a model $y = a \\cdot b^{t}$, the graph meets the vertical axis at the starting value $a$, and each step of $1$ in $t$ multiplies $y$ by $b$. If the graph passes through $(0, 4)$ and $(1, 6)$, then $b = \\frac{6}{4} = 1.5$: the quantity grows by $50\\%$ per time unit. If it passes through $(0, 8)$ and $(1, 6)$, then $b = 0.75$ and it falls by $25\\%$ per time unit.",
        "模型 $y = a \\cdot b^{t}$ 的图象与纵轴交于初始值 $a$，$t$ 每增加 $1$，$y$ 就乘以 $b$。若图象经过 $(0, 4)$ 和 $(1, 6)$，则 $b = \\frac{6}{4} = 1.5$：这个量每单位时间增长 $50\\%$。若经过 $(0, 8)$ 和 $(1, 6)$，则 $b = 0.75$，每单位时间减少 $25\\%$。",
      ),
      generate(rng) {
        const [a, b] = rng.pick(modelPairs);
        const growth = b.cmp(Q.one) > 0;
        const ctx = rng.pick(growth ? growthContexts : decayContexts);
        const rate = b.sub(Q.one).abs().mul(Q.of(100));
        const y1 = b.mul(Q.of(a));
        return {
          ...numberProblem({
            prompt: t(
              `The graph shows ${ctx.what.en}. By what percent does the quantity ${growth ? "increase" : "decrease"} each ${ctx.per.en}?`,
              `图象表示${ctx.what["zh-CN"]}。这个量${ctx.per["zh-CN"]}${growth ? "增长" : "减少"}百分之几？`,
            ),
            answer: rate,
            percent: true,
            wrong: [b.mul(Q.of(100)), y1.sub(Q.of(a)).abs(), Q.one.sub(b).abs().mul(Q.of(100)).add(Q.of(100))],
            solution: t(
              `The graph passes through $(0, ${a})$ and $(1, ${num(y1)})$, so the factor is $b = \\frac{${num(y1)}}{${a}} = ${dec(b)}$. ${growth ? `Since $${dec(b)} = 1 + ${dec(b.sub(Q.one))}$, it grows by $${num(rate)}\\%$` : `Since $${dec(b)} = 1 - ${dec(Q.one.sub(b))}$, it falls by $${num(rate)}\\%$`} each ${ctx.per.en}.`,
              `图象经过 $(0, ${a})$ 和 $(1, ${num(y1)})$，所以倍数 $b = \\frac{${num(y1)}}{${a}} = ${dec(b)}$。${growth ? `因为 $${dec(b)} = 1 + ${dec(b.sub(Q.one))}$，它${ctx.per["zh-CN"]}增长 $${num(rate)}\\%$` : `因为 $${dec(b)} = 1 - ${dec(Q.one.sub(b))}$，它${ctx.per["zh-CN"]}减少 $${num(rate)}\\%$`}。`,
            ),
          }),
          figure: modelFigure(a, b, 0),
        };
      },
    },
    {
      id: "predicting-from-a-graph",
      title: t("Predicting later values", "预测以后的值"),
      explanation: t(
        "Once you know $a$ and $b$ from the graph, the model predicts values beyond it. From $(0, 2)$ and $(1, 3)$: $a = 2$, $b = \\frac{3}{2}$, so after $3$ time units\n\n$$y = 2\\left(\\frac{3}{2}\\right)^{3} = 2 \\cdot \\frac{27}{8} = \\frac{27}{4} = 6.75$$\n\nThe increase is not the same each step, so do not continue the graph as a straight line.",
        "从图象得到 $a$ 和 $b$ 后，就能用模型预测图象以外的值。由 $(0, 2)$ 和 $(1, 3)$ 得 $a = 2$，$b = \\frac{3}{2}$，所以 $3$ 个单位时间后\n\n$$y = 2\\left(\\frac{3}{2}\\right)^{3} = 2 \\cdot \\frac{27}{8} = \\frac{27}{4} = 6.75$$\n\n每一步的增量并不相同，所以不能把图象当作直线延伸。",
      ),
      generate(rng) {
        const [a, b] = rng.pick(modelPairs);
        const growth = b.cmp(Q.one) > 0;
        const ctx = rng.pick(growth ? growthContexts : decayContexts);
        const n = rng.int(2, 4);
        const value = b.pow(n).mul(Q.of(a));
        const y1 = b.mul(Q.of(a));
        return {
          ...numberProblem({
            prompt: t(
              `The graph shows ${ctx.what.en}, modeled by $y = a \\cdot b^{t}$. Find the value of $y$ when $t = ${n}$.`,
              `图象表示${ctx.what["zh-CN"]}，模型为 $y = a \\cdot b^{t}$。求 $t = ${n}$ 时 $y$ 的值。`,
            ),
            answer: value,
            wrong: [y1.sub(Q.of(a)).mul(Q.of(n)).add(Q.of(a)), y1.mul(Q.of(n)), b.pow(n - 1).mul(Q.of(a)), b.pow(n)],
            solution: both(
              `From $(0, ${a})$ and $(1, ${num(y1)})$: $a = ${a}$ and $b = ${num(b)}$. So`,
              `由 $(0, ${a})$ 和 $(1, ${num(y1)})$ 得 $a = ${a}$，$b = ${num(b)}$。所以`,
              `y = ${expT(a, b, 0, 0, `${n}`).replace(`{${n}}`, `{${n}}`)} = ${num(value)}`,
            ),
          }),
          figure: modelFigure(a, b, 0),
        };
      },
    },
    {
      id: "the-long-run-level",
      title: t("The long-run level", "长期水平"),
      explanation: t(
        "A translated model $y = a \\cdot b^{t} + k$ with $0 < b < 1$ levels off at the asymptote $y = k$: this is the **long-run level** of the quantity. A cooling drink approaches room temperature; a medicine in a steady drip approaches a fixed level. The total change in the long run is the distance from the starting value to $k$: a drink that starts at $9$ and levels off at $2$ falls by $7$ in all.",
        "平移后的模型 $y = a \\cdot b^{t} + k$（$0 < b < 1$）最终趋于渐近线 $y = k$，这就是这个量的**长期水平**。冷却的饮料趋近室温；持续滴注的药物趋近一个固定水平。长期的总变化量是初始值与 $k$ 的距离：从 $9$ 开始、最终稳定在 $2$ 的饮料，一共下降 $7$。",
      ),
      generate(rng) {
        for (;;) {
          const [a0, b] = rng.pick(modelPairs.filter(([, f]) => f.cmp(Q.one) < 0));
          const rising = rng.bool();
          const k = rng.int(1, 6);
          const a = rising ? -a0 : a0;
          const start = a + k;
          if (start > 9 || start < 0) continue;
          const y1 = b.mul(Q.of(a)).add(Q.of(k));
          if (!y1.isInteger()) continue;
          const ctx = rising
            ? t(
                "the amount of a medicine in a patient's blood, in milligrams per liter, $t$ hours after a steady drip starts",
                "持续滴注开始后，病人血液中某药物的浓度（单位：毫克/升）随时间 $t$（小时）的变化",
              )
            : t(
                "the temperature of a drink, in tens of degrees Celsius, $t$ minutes after it is poured",
                "一杯饮料倒出后，它的温度（单位：十摄氏度）随时间 $t$（分钟）的变化",
              );
          return {
            ...numberProblem({
              prompt: t(
                `The graph shows ${ctx.en}, with its asymptote dashed. By how much does the quantity change in all, in the long run?`,
                `图象表示${ctx["zh-CN"]}，虚线是渐近线。从长期看，这个量一共变化了多少？`,
              ),
              answer: a0,
              wrong: [k, start, y1.sub(Q.of(start)).abs()],
              solution: t(
                `The quantity starts at $${start}$ and levels off at the asymptote $y = ${k}$. It ${rising ? "rises" : "falls"} by $|${start} - ${k}| = ${a0}$ in all.`,
                `这个量从 $${start}$ 开始，最终稳定在渐近线 $y = ${k}$。它一共${rising ? "上升" : "下降"}了 $|${start} - ${k}| = ${a0}$。`,
              ),
            }),
            figure: modelFigure(a, b, k),
          };
        }
      },
    },
  ],
  diagnostic: "percent-change-from-a-graph",
};

export const verticalReflectionsOfExponentialFunctions: TopicDef = {
  id: "vertical-reflections-of-exponential-functions",
  title: t("Vertical Reflections of Exponential Functions", "指数函数的上下翻折"),
  summary: t(
    "Reflect exponential graphs across the $x$-axis, read reflected graphs, and find their intercepts.",
    "把指数函数的图象关于 $x$ 轴翻折，根据翻折后的图象求解析式，并求截距。",
  ),
  prerequisites: ["vertical-translations-of-exponential-decay-functions", "vertical-reflections-of-functions"],
  encompasses: [
    { topic: "vertical-translations-of-exponential-decay-functions", weight: 0.4 },
    { topic: "vertical-reflections-of-functions", weight: 0.5 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.BF.B.3", "CCSS.HSF.IF.C.7.E"],
  knowledgePoints: [
    {
      id: "reflecting-across-the-x-axis",
      title: t("Writing the reflected function", "写出翻折后的函数"),
      explanation: t(
        "Reflecting a graph across the $x$-axis negates every output: $g(x) = -f(x)$. The **whole** function is negated, the constant term included:\n\n$$f(x) = 2(3)^{x} + 1 \\implies g(x) = -\\left(2(3)^{x} + 1\\right) = -2(3)^{x} - 1$$\n\nThe asymptote $y = 1$ becomes $y = -1$. Changing the exponent to $-x$ would reflect across the $y$-axis instead.",
        "把图象关于 $x$ 轴翻折，每个函数值都变为相反数：$g(x) = -f(x)$。要对**整个**函数取相反数，常数项也包括在内：\n\n$$f(x) = 2(3)^{x} + 1 \\implies g(x) = -\\left(2(3)^{x} + 1\\right) = -2(3)^{x} - 1$$\n\n渐近线 $y = 1$ 变为 $y = -1$。把指数改成 $-x$ 则是关于 $y$ 轴翻折。",
      ),
      generate(rng) {
        const a = rng.pick([1, 2, 3, 4]);
        const b = rng.pick([Q.of(2), Q.of(3), Q.of(4), Q.of(5), Q.of(1, 2), Q.of(1, 3)]);
        const k = rng.int(-6, 6);
        const f = expT(a, b, 0, k);
        const answer = expT(-a, b, 0, -k);
        return expressionProblem({
          prompt: t(
            `The graph of $f(x) = ${f}$ is reflected across the $x$-axis to give the graph of $g$. Write $g(x)$.`,
            `把 $f(x) = ${f}$ 的图象关于 $x$ 轴翻折，得到 $g$ 的图象。写出 $g(x)$。`,
          ),
          answer,
          prefix: "g(x) =",
          wrong: [expT(-a, b, 0, k), expT(a, b, 0, -k), expT(a, Q.one.div(b), 0, k)],
          solution: both("Negate the whole function:", "对整个函数取相反数：", `g(x) = -f(x) = -\\left(${f}\\right) = ${answer}`),
        });
      },
    },
    {
      id: "reflected-graph-equations",
      title: t("The equation from the graph", "由图象求解析式"),
      explanation: t(
        "The graph of $y = -b^{x} + k$ is the graph of $y = b^{x}$ flipped upside down and then moved up $k$. It lies **below** its asymptote $y = k$. At $x = 0$ it is at $k - 1$, and at $x = 1$ at $k - b$. With asymptote $y = 5$ and the point $(1, 2)$: $5 - b = 2$, so $b = 3$ and $y = -3^{x} + 5$.",
        "$y = -b^{x} + k$ 的图象是把 $y = b^{x}$ 的图象上下翻转，再向上平移 $k$ 得到的。它位于渐近线 $y = k$ 的**下方**。$x = 0$ 时高度为 $k - 1$，$x = 1$ 时为 $k - b$。若渐近线是 $y = 5$，图象经过 $(1, 2)$，则 $5 - b = 2$，所以 $b = 3$，$y = -3^{x} + 5$。",
      ),
      generate(rng) {
        for (;;) {
          const b = rng.pick([2, 3, 4]);
          const k = rng.int(-2, 8);
          const decay = rng.bool(0.4);
          if (k - b < -5 || k === 0 || k === 1 || k - b === 0 || k - b === -1) continue;
          const B = decay ? Q.of(1, b) : Q.of(b);
          const answer = expT(-1, B, 0, k);
          const x1 = decay ? -1 : 1;
          return {
            ...expressionProblem({
              prompt: t(
                `The graph shown is the graph of $y = ${decay ? "\\left(\\frac{1}{b}\\right)^{x}" : "b^{x}"}$ for a whole number $b$, reflected across the $x$-axis and then translated vertically. Its asymptote is dashed. Find its equation.`,
                `如图是 $y = ${decay ? "\\left(\\frac{1}{b}\\right)^{x}" : "b^{x}"}$（$b$ 为整数）的图象关于 $x$ 轴翻折后再竖直平移得到的图象，虚线是它的渐近线。求它的解析式。`,
              ),
              answer,
              prefix: "y =",
              wrong: [expT(1, B, 0, k), expT(-1, B, 0, -k), expT(-1, B, 0, k - 1), expT(-1, Q.one.div(B), 0, k)],
              solution: t(
                `The asymptote is $y = ${k}$ and the graph lies below it, so $y = -${decay ? `\\left(\\frac{1}{b}\\right)^{x}` : "b^{x}"}${plusK(k)}$. At $x = ${x1}$ the height is $${k - b}$, so $${k} - b = ${k - b}$ and $b = ${b}$. The equation is $y = ${answer}$.`,
                `渐近线是 $y = ${k}$，图象在它下方，所以 $y = -${decay ? `\\left(\\frac{1}{b}\\right)^{x}` : "b^{x}"}${plusK(k)}$。$x = ${x1}$ 时高度为 $${k - b}$，所以 $${k} - b = ${k - b}$，$b = ${b}$。解析式是 $y = ${answer}$。`,
              ),
            }),
            figure: expGraph(
              expView,
              expFn(-1, B, 0, k),
              k,
              [
                { at: [0, k - 1], dir: "e" },
                { at: [x1, k - b], dir: decay ? "w" : "e" },
              ],
              decay,
            ),
          };
        }
      },
    },
    {
      id: "intercepts-of-reflected-graphs",
      title: t("Intercepts", "截距"),
      explanation: t(
        "For $g(x) = -a \\cdot b^{x} + k$ with $a > 0$ and $k > 0$, the $y$-intercept is $g(0) = k - a$, and the graph crosses the $x$-axis where $a \\cdot b^{x} = k$:\n\n$$-2(3)^{x} + 18 = 0 \\implies 2(3)^{x} = 18 \\implies 3^{x} = 9 \\implies x = 2$$",
        "对 $g(x) = -a \\cdot b^{x} + k$（$a > 0$，$k > 0$），$y$ 轴截距是 $g(0) = k - a$，图象在 $a \\cdot b^{x} = k$ 处与 $x$ 轴相交：\n\n$$-2(3)^{x} + 18 = 0 \\implies 2(3)^{x} = 18 \\implies 3^{x} = 9 \\implies x = 2$$",
      ),
      generate(rng) {
        const a = rng.pick([1, 2, 3, 4]);
        const b = rng.pick([2, 3, 5]);
        const mm = rng.int(0, b === 2 ? 4 : 3);
        const k = a * b ** mm;
        const g = expT(-a, Q.of(b), 0, k);
        if (rng.bool()) {
          return numberProblem({
            prompt: t(`What is the $y$-intercept of the graph of $g(x) = ${g}$?`, `$g(x) = ${g}$ 的图象的 $y$ 轴截距是多少？`),
            answer: k - a,
            wrong: [k + a, k, -a - k],
            solution: both(
              "Evaluate at $x = 0$:",
              "计算 $x = 0$ 时的函数值：",
              `g(0) = ${coefL(-a)}${a === 1 ? "" : " \\cdot "}1${plusK(k)} = ${k - a}`,
            ),
          });
        }
        return numberProblem({
          prompt: t(
            `The graph of $g(x) = ${g}$ crosses the $x$-axis at one point. What is its $x$-coordinate?`,
            `$g(x) = ${g}$ 的图象与 $x$ 轴有一个交点。它的横坐标是多少？`,
          ),
          answer: mm,
          solveFor: "x",
          wrong: [-mm, Q.of(k, a), k],
          solution: both(
            "Set $g(x) = 0$ and solve:",
            "令 $g(x) = 0$ 并求解：",
            `${expT(a, Q.of(b), 0, 0)} = ${k}`,
            `${b}^{x} = ${b ** mm} = ${b}^{${mm}}`,
            `x = ${mm}`,
          ),
        });
      },
    },
  ],
  diagnostic: "reflecting-across-the-x-axis",
};

/** describe writes, for g(x) = a·f(x − h) + k, the transformations of the graph of f in the order they apply. */
function describe(a: number, h: number, k: number): Text {
  const en: string[] = [];
  const zh: string[] = [];
  if (h !== 0) {
    en.push(`shift it ${unitsEn(h)} ${h > 0 ? "right" : "left"}`);
    zh.push(`向${h > 0 ? "右" : "左"}平移 ${Math.abs(h)} 个单位`);
  }
  if (Math.abs(a) !== 1) {
    en.push(`stretch it vertically by a factor of ${Math.abs(a)}`);
    zh.push(`竖直方向伸长为原来的 ${Math.abs(a)} 倍`);
  }
  if (a < 0) {
    en.push("reflect it across the $x$-axis");
    zh.push("关于 $x$ 轴翻折");
  }
  if (k !== 0) {
    en.push(`shift it ${unitsEn(k)} ${k > 0 ? "up" : "down"}`);
    zh.push(`向${k > 0 ? "上" : "下"}平移 ${Math.abs(k)} 个单位`);
  }
  const first = en.join(", then ");
  return t(`${first.charAt(0).toUpperCase()}${first.slice(1)}.`, `${zh.join("，再")}。`);
}

export const combiningGraphTransformationsOfExponentialFunctions: TopicDef = {
  id: "combining-graph-transformations-of-exponential-functions",
  title: t("Combining Graph Transformations of Exponential Functions", "指数函数图象的复合变换"),
  summary: t(
    "Describe and build functions such as $g(x) = -2(3)^{x - 1} + 4$ from $f(x) = 3^{x}$, and track points under the transformations.",
    "描述并构造由 $f(x) = 3^{x}$ 变换得到的 $g(x) = -2(3)^{x - 1} + 4$ 这样的函数，并追踪点在变换下的位置。",
  ),
  prerequisites: ["vertical-reflections-of-exponential-functions", "combining-reflections-with-other-graph-transformations"],
  encompasses: [
    { topic: "vertical-reflections-of-exponential-functions", weight: 0.5 },
    { topic: "combining-reflections-with-other-graph-transformations", weight: 0.5 },
  ],
  xp: 16,
  standards: ["CCSS.HSF.BF.B.3"],
  knowledgePoints: [
    {
      id: "describing-exponential-transformations",
      title: t("Describing the transformations", "描述变换"),
      explanation: t(
        "In $g(x) = a \\cdot b^{x - h} + k$, compared with $f(x) = b^{x}$:\n\n- $x - h$ in the exponent shifts the graph $h$ right (left when $h < 0$);\n- the factor $a$ stretches it vertically by $|a|$ and, if $a < 0$, reflects it across the $x$-axis;\n- $+ k$ shifts it $k$ up (down when $k < 0$).\n\nSo $g(x) = -2(3)^{x + 1} + 4$ is $3^{x}$ shifted $1$ left, stretched by $2$, reflected, and shifted $4$ up. Note the sign: $x + 1 = x - (-1)$ means **left**.",
        "与 $f(x) = b^{x}$ 相比，$g(x) = a \\cdot b^{x - h} + k$ 中：\n\n- 指数中的 $x - h$ 把图象向右平移 $h$（$h < 0$ 时向左）；\n- 系数 $a$ 把图象竖直伸长为原来的 $|a|$ 倍，$a < 0$ 时还关于 $x$ 轴翻折；\n- $+ k$ 把图象向上平移 $k$（$k < 0$ 时向下）。\n\n所以 $g(x) = -2(3)^{x + 1} + 4$ 是把 $3^{x}$ 向左平移 $1$，伸长为 $2$ 倍，翻折，再向上平移 $4$。注意符号：$x + 1 = x - (-1)$ 表示向**左**。",
      ),
      generate(rng) {
        const a = rng.pick([-1, 2, 3, -2, -3]);
        const b = rng.pick([Q.of(2), Q.of(3), Q.of(4), Q.of(5), Q.of(1, 2)]);
        const h = rng.nonZero(-4, 4);
        const k = rng.nonZero(-5, 5);
        const g = expT(a, b, h, k);
        return oneOf(rng, {
          prompt: t(
            `How is the graph of $g(x) = ${g}$ obtained from the graph of $f(x) = ${expT(1, b, 0, 0)}$?`,
            `$g(x) = ${g}$ 的图象如何由 $f(x) = ${expT(1, b, 0, 0)}$ 的图象变换得到？`,
          ),
          right: describe(a, h, k),
          wrong: [describe(a, -h, k), describe(a, h, -k), describe(a, -h, -k), describe(-a, h, k)],
          solution: t(
            `Compare $g(x) = ${g}$ with $a \\cdot b^{x - h} + k$: $h = ${h}$, $a = ${a}$, $k = ${k}$. ${describe(a, h, k).en}`,
            `把 $g(x) = ${g}$ 与 $a \\cdot b^{x - h} + k$ 比较：$h = ${h}$，$a = ${a}$，$k = ${k}$。${describe(a, h, k)["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "writing-the-transformed-exponential",
      title: t("Writing the transformed function", "写出变换后的函数"),
      explanation: t(
        "To apply the transformations in order to $f(x) = 2^{x}$: shifting $3$ right replaces $x$ by $x - 3$; stretching by $4$ multiplies by $4$; shifting $1$ down subtracts $1$:\n\n$$2^{x} \\to 2^{x - 3} \\to 4(2)^{x - 3} \\to 4(2)^{x - 3} - 1$$",
        "按顺序对 $f(x) = 2^{x}$ 作变换：向右平移 $3$ 就把 $x$ 换成 $x - 3$；伸长为 $4$ 倍就乘以 $4$；向下平移 $1$ 就减去 $1$：\n\n$$2^{x} \\to 2^{x - 3} \\to 4(2)^{x - 3} \\to 4(2)^{x - 3} - 1$$",
      ),
      generate(rng) {
        const a = rng.pick([-1, 2, 3, -2, 4]);
        const b = rng.pick([Q.of(2), Q.of(3), Q.of(5), Q.of(1, 2), Q.of(1, 3)]);
        const h = rng.nonZero(-5, 5);
        const k = rng.nonZero(-6, 6);
        const d = describe(a, h, k);
        const f = expT(1, b, 0, 0);
        const answer = expT(a, b, h, k);
        return expressionProblem({
          prompt: t(
            `Start with the graph of $f(x) = ${f}$. ${d.en} Write the function $g$ of the new graph.`,
            `从 $f(x) = ${f}$ 的图象开始，${d["zh-CN"]}写出所得图象对应的函数 $g$。`,
          ),
          answer,
          prefix: "g(x) =",
          wrong: [expT(a, b, -h, k), expT(a, b, h, -k), expT(a, b, k, h), expT(a, b, h, a * k)],
          solution: both(
            "Apply the transformations in order:",
            "按顺序作变换：",
            `${f} \\to ${expT(1, b, h, 0)} \\to ${expT(a, b, h, 0)} \\to ${answer}`,
          ),
        });
      },
    },
    {
      id: "key-points-under-transformations",
      title: t("Key points", "关键点"),
      explanation: t(
        "The points $(0, 1)$ and $(1, b)$ lie on every graph $y = b^{x}$. Under $g(x) = a \\cdot b^{x - h} + k$, a point $(x, y)$ moves to $(x + h, ay + k)$. For $g(x) = 2(3)^{x - 1} - 5$, the point $(1, 3)$ moves to\n\n$$(1 + 1, \\; 2 \\cdot 3 - 5) = (2, 1)$$",
        "点 $(0, 1)$ 和 $(1, b)$ 在每个 $y = b^{x}$ 的图象上。在 $g(x) = a \\cdot b^{x - h} + k$ 下，点 $(x, y)$ 变到 $(x + h, ay + k)$。对 $g(x) = 2(3)^{x - 1} - 5$，点 $(1, 3)$ 变到\n\n$$(1 + 1, \\; 2 \\cdot 3 - 5) = (2, 1)$$",
      ),
      generate(rng) {
        const a = rng.pick([-1, 2, 3, -2]);
        const b = rng.pick([2, 3, 4, 5]);
        const h = rng.nonZero(-4, 4);
        const k = rng.nonZero(-6, 6);
        const [x0, y0] = rng.bool() ? [1, b] : [0, 1];
        const g = expT(a, Q.of(b), h, k);
        return pointProblem({
          prompt: t(
            `The point $(${x0}, ${y0})$ lies on the graph of $f(x) = ${b}^{x}$. To which point does it move on the graph of $g(x) = ${g}$?`,
            `点 $(${x0}, ${y0})$ 在 $f(x) = ${b}^{x}$ 的图象上。在 $g(x) = ${g}$ 的图象上，它变到哪个点？`,
          ),
          answer: [x0 + h, a * y0 + k],
          wrong: [
            [x0 - h, a * y0 + k],
            [x0 + h, a * (y0 + k)],
            [x0 + h, a * y0 - k],
          ],
          solution: both(
            `Here $h = ${h}$, $a = ${a}$ and $k = ${k}$, so $(x, y)$ moves to $(x + h, ay + k)$:`,
            `这里 $h = ${h}$，$a = ${a}$，$k = ${k}$，所以 $(x, y)$ 变到 $(x + h, ay + k)$：`,
            `(${x0}${plusK(h)}, \\; ${a} \\cdot ${y0}${plusK(k)}) = (${x0 + h}, ${a * y0 + k})`,
          ),
        });
      },
    },
  ],
  diagnostic: "writing-the-transformed-exponential",
};

export const propertiesOfTransformedExponentialFunctions: TopicDef = {
  id: "properties-of-transformed-exponential-functions",
  title: t("Properties of Transformed Exponential Functions", "变换后指数函数的性质"),
  summary: t(
    "Find the range, asymptote, intercepts and direction of $f(x) = a \\cdot b^{x - h} + k$ from its formula.",
    "根据解析式求 $f(x) = a \\cdot b^{x - h} + k$ 的值域、渐近线、截距和单调性。",
  ),
  prerequisites: ["combining-graph-transformations-of-exponential-functions", "the-domain-and-range-of-transformed-functions"],
  encompasses: [
    { topic: "combining-graph-transformations-of-exponential-functions", weight: 0.5 },
    { topic: "the-domain-and-range-of-transformed-functions", weight: 0.4 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.IF.C.7.E", "CCSS.HSF.BF.B.3"],
  knowledgePoints: [
    {
      id: "range-of-transformed-exponentials",
      title: t("Domain, asymptote and range", "定义域、渐近线与值域"),
      explanation: t(
        "Every exponential function $f(x) = a \\cdot b^{x - h} + k$ has domain all real numbers and the horizontal asymptote $y = k$; the shift $h$ changes neither. The range is the side of the asymptote the graph lies on:\n\n- $a > 0$: range $(k, \\infty)$;\n- $a < 0$: range $(-\\infty, k)$.\n\nFor $f(x) = -3(2)^{x + 4} + 1$ the range is $(-\\infty, 1)$.",
        "每个指数函数 $f(x) = a \\cdot b^{x - h} + k$ 的定义域都是全体实数，水平渐近线是 $y = k$；平移量 $h$ 不改变它们。值域就是图象所在的渐近线的那一侧：\n\n- $a > 0$：值域为 $(k, \\infty)$；\n- $a < 0$：值域为 $(-\\infty, k)$。\n\n$f(x) = -3(2)^{x + 4} + 1$ 的值域是 $(-\\infty, 1)$。",
      ),
      generate(rng) {
        const a = rng.pick([1, 2, 3, -1, -2, -3]);
        const b = rng.pick([Q.of(2), Q.of(3), Q.of(5), Q.of(1, 2), Q.of(1, 3)]);
        const h = rng.int(-5, 5);
        const k = rng.int(-6, 6);
        const above = a > 0;
        const K = Q.of(k);
        const side = (up: boolean, closed = false): RealSet =>
          up ? [{ lo: K, loClosed: closed, hiClosed: false }] : [{ hi: K, loClosed: false, hiClosed: closed }];
        const H = Q.of(h);
        return intervalProblem({
          prompt: t(
            `What is the range of $f(x) = ${expT(a, b, h, k)}$? Write it in interval notation.`,
            `$f(x) = ${expT(a, b, h, k)}$ 的值域是什么？用区间表示。`,
          ),
          set: side(above),
          form: "interval",
          wrong: [
            side(!above),
            side(above, true),
            realLine,
            ...(h === k ? [] : [above ? [{ lo: H, loClosed: false, hiClosed: false }] : [{ hi: H, loClosed: false, hiClosed: false }]]),
          ],
          solution: t(
            `The asymptote is $y = ${k}$. Since $a = ${a}$ is ${above ? "positive" : "negative"}, the graph lies ${above ? "above" : "below"} it and never reaches it. The range is $${above ? `(${k}, \\infty)` : `(-\\infty, ${k})`}$.`,
            `渐近线是 $y = ${k}$。因为 $a = ${a}$ ${above ? "为正" : "为负"}，图象在它的${above ? "上方" : "下方"}，且永远取不到它。值域是 $${above ? `(${k}, \\infty)` : `(-\\infty, ${k})`}$。`,
          ),
        });
      },
    },
    {
      id: "intercepts-of-transformed-exponentials",
      title: t("Intercepts", "截距"),
      explanation: t(
        "The $y$-intercept is $f(0)$. The $x$-intercept, if there is one, solves $f(x) = 0$. For $f(x) = 2(3)^{x - 1} - 18$:\n\n$$f(0) = 2 \\cdot 3^{-1} - 18 = \\frac{2}{3} - 18 = -\\frac{52}{3}$$\n\n$$2(3)^{x - 1} = 18 \\implies 3^{x - 1} = 9 = 3^{2} \\implies x = 3$$",
        "$y$ 轴截距是 $f(0)$。若与 $x$ 轴有交点，它满足 $f(x) = 0$。对 $f(x) = 2(3)^{x - 1} - 18$：\n\n$$f(0) = 2 \\cdot 3^{-1} - 18 = \\frac{2}{3} - 18 = -\\frac{52}{3}$$\n\n$$2(3)^{x - 1} = 18 \\implies 3^{x - 1} = 9 = 3^{2} \\implies x = 3$$",
      ),
      generate(rng) {
        const a = rng.pick([1, 2, 3, -1, -2]);
        const b = rng.pick([2, 3, 5]);
        const h = rng.nonZero(-3, 3);
        const B = Q.of(b);
        if (rng.bool()) {
          const k = rng.int(-9, 9);
          const value = B.pow(-h).mul(Q.of(a)).add(Q.of(k));
          return numberProblem({
            prompt: t(
              `What is the $y$-intercept of the graph of $f(x) = ${expT(a, B, h, k)}$?`,
              `$f(x) = ${expT(a, B, h, k)}$ 的图象的 $y$ 轴截距是多少？`,
            ),
            answer: value,
            wrong: [Q.of(a + k), B.pow(h).mul(Q.of(a)).add(Q.of(k)), B.pow(-h).mul(Q.of(a))],
            solution: both(
              "Evaluate at $x = 0$:",
              "计算 $x = 0$ 时的函数值：",
              `f(0) = ${a} \\cdot ${b}^{${-h}}${plusK(k)} = ${num(value)}`,
            ),
          });
        }
        const mm = rng.int(0, 3);
        const k = -a * b ** mm;
        return numberProblem({
          prompt: t(
            `Find the $x$-coordinate of the $x$-intercept of the graph of $f(x) = ${expT(a, B, h, k)}$.`,
            `求 $f(x) = ${expT(a, B, h, k)}$ 的图象与 $x$ 轴交点的横坐标。`,
          ),
          answer: h + mm,
          solveFor: "x",
          wrong: [mm - h, mm, h - mm],
          solution: both(
            "Set $f(x) = 0$ and solve:",
            "令 $f(x) = 0$ 并求解：",
            `${b}^{${linear(1, -h)}} = ${num(Q.of(-k, a))} = ${b}^{${mm}}`,
            `${linear(1, -h)} = ${mm}`,
            `x = ${h + mm}`,
          ),
        });
      },
    },
    {
      id: "increasing-or-decreasing",
      title: t("Increasing or decreasing", "递增还是递减"),
      explanation: t(
        "$b^{x}$ increases when $b > 1$ and decreases when $0 < b < 1$. Shifts do not change this, but a negative $a$ reverses it. So $f(x) = a \\cdot b^{x - h} + k$ increases exactly when $a > 0$ and $b > 1$, or $a < 0$ and $0 < b < 1$. For example $f(x) = -2\\left(\\frac{1}{3}\\right)^{x} + 5$ is increasing.",
        "$b > 1$ 时 $b^{x}$ 递增，$0 < b < 1$ 时递减。平移不改变这一点，但负的 $a$ 会使它反过来。所以 $f(x) = a \\cdot b^{x - h} + k$ 递增，当且仅当 $a > 0$ 且 $b > 1$，或 $a < 0$ 且 $0 < b < 1$。例如 $f(x) = -2\\left(\\frac{1}{3}\\right)^{x} + 5$ 是递增的。",
      ),
      generate(rng) {
        const a = rng.pick([1, 2, 3, -1, -2, -4]);
        const b = rng.pick([Q.of(2), Q.of(3), Q.of(5), Q.of(1, 2), Q.of(1, 4), Q.of(2, 3)]);
        const h = rng.int(-4, 4);
        const k = rng.int(-6, 6);
        const growth = b.cmp(Q.one) > 0;
        const increasing = a > 0 === growth;
        return choiceProblem({
          prompt: t(`Is $f(x) = ${expT(a, b, h, k)}$ increasing or decreasing?`, `$f(x) = ${expT(a, b, h, k)}$ 是递增的还是递减的？`),
          options: [t("Increasing", "递增"), t("Decreasing", "递减")],
          correct: increasing ? 0 : 1,
          solution: t(
            `The base $${num(b)}$ is ${growth ? "greater than $1$" : "between $0$ and $1$"}, so $${num(b)}^{x}$ ${growth ? "increases" : "decreases"}. ${a < 0 ? "The negative factor reverses this, so" : "The factor is positive, so"} $f$ is ${increasing ? "increasing" : "decreasing"}.`,
            `底数 $${num(b)}$ ${growth ? "大于 $1$" : "在 $0$ 和 $1$ 之间"}，所以 $${num(b)}^{x}$ ${growth ? "递增" : "递减"}。${a < 0 ? "负的系数使它反过来，所以" : "系数为正，所以"} $f$ ${increasing ? "递增" : "递减"}。`,
          ),
        });
      },
    },
  ],
  diagnostic: "range-of-transformed-exponentials",
};

// Unit: graphs of logarithmic functions.

const logView: PlaneView = { xMin: -3, xMax: 10, yMin: -5, yMax: 5 };

/** logGraph draws y = a·log_b(x − h) + k, its vertical asymptote x = h dashed, with labeled points. */
function logGraph(a: number, b: number, h: number, k: number, pts: readonly Labeled[]): Figure {
  const marks: PlaneMark[] = [];
  if (h !== 0) marks.push({ kind: "line", a: [h, logView.yMin], b: [h, logView.yMax], dashed: true });
  marks.push({ kind: "curve", f: (x) => (x > h ? (a * Math.log(x - h)) / Math.log(b) + k : Number.NaN), from: h + 1e-6, accent: true });
  const rising = a > 0 === b > 1;
  for (const p of pts) {
    // The label of (1, 0) on a rising graph would sit on the axes, so that point is drawn without one.
    const bare = rising && p.at[0] === 1 && p.at[1] === 0;
    marks.push(bare ? { kind: "point", at: p.at } : { kind: "point", at: p.at, label: ptL(p.at), dir: p.dir });
  }
  const list = pts.map((p) => ptL(p.at));
  return {
    svg: plane(logView, marks),
    alt: t(
      `A ${rising ? "rising" : "falling"} logarithmic curve${list.length ? ` through ${list.join(" and ")}` : ""}, approaching the vertical line x = ${h} from the right.`,
      `一条${rising ? "上升" : "下降"}的对数曲线${list.length ? `，经过 ${list.join("、")}` : ""}，从右侧逐渐靠近竖直直线 x = ${h}。`,
    ),
  };
}

export const graphingLogarithmicFunctions: TopicDef = {
  id: "graphing-logarithmic-functions",
  title: t("Graphing Logarithmic Functions", "对数函数的图象"),
  summary: t(
    "Find points on the graph of $y = \\log_{b} x$, read its base from the graph, and relate it to the graph of $y = b^{x}$.",
    "求 $y = \\log_{b} x$ 图象上的点，根据图象读出底数，并把它与 $y = b^{x}$ 的图象联系起来。",
  ),
  prerequisites: ["evaluating-logarithms", "graphs-of-inverse-functions", "graphing-exponential-growth-functions"],
  encompasses: [
    { topic: "evaluating-logarithms", weight: 0.4 },
    { topic: "graphs-of-inverse-functions", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.IF.C.7.E", "CCSS.HSF.BF.B.5"],
  knowledgePoints: [
    {
      id: "points-on-logarithmic-graphs",
      title: t("Points on the graph", "图象上的点"),
      explanation: t(
        "A point $(x, y)$ lies on the graph of $y = \\log_{b} x$ exactly when $b^{y} = x$. So the graph of $y = \\log_{2} x$ passes through\n\n$$\\left(\\frac{1}{4}, -2\\right), \\quad \\left(\\frac{1}{2}, -1\\right), \\quad (1, 0), \\quad (2, 1), \\quad (4, 2), \\quad (8, 3).$$\n\nIt is only defined for $x > 0$, rises slowly, and approaches the $y$-axis, its vertical asymptote, as $x$ approaches $0$.",
        "点 $(x, y)$ 在 $y = \\log_{b} x$ 的图象上，当且仅当 $b^{y} = x$。所以 $y = \\log_{2} x$ 的图象经过\n\n$$\\left(\\frac{1}{4}, -2\\right), \\quad \\left(\\frac{1}{2}, -1\\right), \\quad (1, 0), \\quad (2, 1), \\quad (4, 2), \\quad (8, 3)。$$\n\n它只在 $x > 0$ 时有定义，缓慢上升，$x$ 趋近 $0$ 时图象靠近 $y$ 轴，$y$ 轴是它的竖直渐近线。",
      ),
      figure: logGraph(1, 2, 0, 0, [
        { at: [1, 0], dir: "nw" },
        { at: [2, 1], dir: "nw" },
        { at: [4, 2], dir: "nw" },
        { at: [8, 3], dir: "nw" },
      ]),
      generate(rng) {
        const B = drawBase(rng, [2, 3, 4, 5, 6]);
        const y = rng.int(-2, 3);
        const x = Q.of(B.b).pow(y);
        const fn = B.of("x");
        if (rng.bool()) {
          return numberProblem({
            prompt: t(
              `The point $\\left(${num(x)}, y\\right)$ lies on the graph of $y = ${fn}$. Find $y$.`,
              `点 $\\left(${num(x)}, y\\right)$ 在 $y = ${fn}$ 的图象上。求 $y$。`,
            ),
            answer: y,
            solveFor: "y",
            wrong: [-y, x.div(Q.of(B.b)), Q.of(B.b * y)],
            solution: both(
              `Evaluate the logarithm: $${B.b}^{${y}} = ${num(x)}$, so`,
              `求对数：$${B.b}^{${y}} = ${num(x)}$，所以`,
              `y = ${B.of(num(x))} = ${y}`,
            ),
          });
        }
        return numberProblem({
          prompt: t(
            `The point $(x, ${y})$ lies on the graph of $y = ${fn}$. Find $x$.`,
            `点 $(x, ${y})$ 在 $y = ${fn}$ 的图象上。求 $x$。`,
          ),
          answer: x,
          solveFor: "x",
          wrong: [Q.of(B.b * y), Q.of(B.b).pow(-y), Q.of(y).pow(B.b === 10 ? 2 : B.b)],
          solution: both(
            "Write $y = \\log_{b} x$ in exponential form:",
            "把 $y = \\log_{b} x$ 化为指数式：",
            `${fn} = ${y} \\implies x = ${B.b}^{${y}} = ${num(x)}`,
          ),
        });
      },
    },
    {
      id: "the-base-from-the-graph",
      title: t("The base from the graph", "由图象求底数"),
      explanation: t(
        "Every graph $y = \\log_{b} x$ passes through $(1, 0)$, and through $(b, 1)$, since $\\log_{b} b = 1$. So the point at height $1$ gives the base. If the graph passes through $(9, 2)$ instead, then $b^{2} = 9$ and $b = 3$. A falling graph has a base between $0$ and $1$: through $(2, -1)$ means $b^{-1} = 2$, so $b = \\frac{1}{2}$.",
        "每个 $y = \\log_{b} x$ 的图象都经过 $(1, 0)$，也经过 $(b, 1)$，因为 $\\log_{b} b = 1$。所以高度为 $1$ 的点给出底数。若图象经过的是 $(9, 2)$，则 $b^{2} = 9$，$b = 3$。下降的图象底数在 $0$ 和 $1$ 之间：经过 $(2, -1)$ 表示 $b^{-1} = 2$，所以 $b = \\frac{1}{2}$。",
      ),
      generate(rng) {
        for (;;) {
          const falling = rng.bool(0.35);
          const b = rng.int(2, 9);
          const j = (falling ? -1 : 1) * rng.pick([1, 1, 2, 3]);
          const x = b ** Math.abs(j);
          if (x > 9) continue;
          const one = rng.bool(0.7);
          const base = falling ? Q.of(1, b) : Q.of(b);
          return {
            ...numberProblem({
              prompt: t("The graph of $y = \\log_{b} x$ is shown. Find the base $b$.", "如图是 $y = \\log_{b} x$ 的图象。求底数 $b$。"),
              answer: base,
              solveFor: "b",
              wrong: [Q.of(x), Q.one.div(base), Q.of(j)],
              solution: both(
                `The point $(${x}, ${j})$ means $\\log_{b} ${x} = ${j}$, so`,
                `点 $(${x}, ${j})$ 表示 $\\log_{b} ${x} = ${j}$，所以`,
                `b^{${j}} = ${x}`,
                `b = ${num(base)}`,
              ),
            }),
            figure: logGraph(1, base.toNumber(), 0, 0, [
              ...(one ? [{ at: [1, 0], dir: falling ? "ne" : "nw" } as const] : []),
              { at: [x, j], dir: falling ? "sw" : "nw" },
            ]),
          };
        }
      },
    },
    {
      id: "reflecting-the-exponential-graph",
      title: t("Reflection of the exponential graph", "与指数函数图象的关系"),
      explanation: t(
        "$y = \\log_{b} x$ and $y = b^{x}$ are inverse functions, so each graph is the reflection of the other across the line $y = x$: swap the coordinates of every point. Since $(3, 8)$ lies on $y = 2^{x}$, the point $(8, 3)$ lies on $y = \\log_{2} x$. The horizontal asymptote $y = 0$ of $b^{x}$ becomes the vertical asymptote $x = 0$ of $\\log_{b} x$.",
        "$y = \\log_{b} x$ 与 $y = b^{x}$ 互为反函数，所以它们的图象关于直线 $y = x$ 对称：交换每个点的坐标即可。因为 $(3, 8)$ 在 $y = 2^{x}$ 上，所以 $(8, 3)$ 在 $y = \\log_{2} x$ 上。$b^{x}$ 的水平渐近线 $y = 0$ 变成 $\\log_{b} x$ 的竖直渐近线 $x = 0$。",
      ),
      generate(rng) {
        const b = rng.int(2, 7);
        const p = rng.int(-2, 3);
        const y = Q.of(b).pow(p);
        return pointProblem({
          prompt: t(
            `The point $\\left(${p}, ${num(y)}\\right)$ lies on the graph of $y = ${b}^{x}$. Which point with $y$-coordinate $${p}$ lies on the graph of $y = \\log_{${b}} x$?`,
            `点 $\\left(${p}, ${num(y)}\\right)$ 在 $y = ${b}^{x}$ 的图象上。$y = \\log_{${b}} x$ 的图象上纵坐标为 $${p}$ 的点是哪个？`,
          ),
          answer: [y, p],
          wrong: [
            [p, y],
            [y.neg(), p],
            [Q.one.div(y), p],
          ],
          solution: both(
            "Reflecting across $y = x$ swaps the coordinates:",
            "关于 $y = x$ 对称就是交换坐标：",
            `(${p}, ${num(y)}) \\to (${num(y)}, ${p})`,
          ),
        });
      },
    },
  ],
  diagnostic: "the-base-from-the-graph",
};

/** logT writes a·log_b(x − h) + k. */
const logT = (a: number, B: Base, h: number, k: number) => `${coefL(a)}${B.of(linear(1, -h))}${plusK(k)}`;

export const combiningGraphTransformationsOfLogarithmicFunctions: TopicDef = {
  id: "combining-graph-transformations-of-logarithmic-functions",
  title: t("Combining Graph Transformations of Logarithmic Functions", "对数函数图象的复合变换"),
  summary: t(
    "Find the vertical asymptote and key points of $g(x) = a\\log_{b}(x - h) + k$, and match transformations with equations.",
    "求 $g(x) = a\\log_{b}(x - h) + k$ 的竖直渐近线和关键点，并把变换与解析式对应起来。",
  ),
  prerequisites: ["graphing-logarithmic-functions", "combining-reflections-with-other-graph-transformations"],
  encompasses: [
    { topic: "graphing-logarithmic-functions", weight: 0.5 },
    { topic: "combining-reflections-with-other-graph-transformations", weight: 0.5 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.BF.B.3", "CCSS.HSF.IF.C.7.E"],
  knowledgePoints: [
    {
      id: "the-vertical-asymptote",
      title: t("The vertical asymptote", "竖直渐近线"),
      explanation: t(
        "The graph of a logarithm approaches a vertical line where its argument approaches $0$. So the vertical asymptote of $g(x) = a\\log_{b}(cx - d) + k$ is where $cx - d = 0$:\n\n$$g(x) = 3\\log_{2}(2x - 6) + 1: \\quad 2x - 6 = 0 \\implies x = 3$$\n\nThe stretch $a$ and the vertical shift $k$ do not move the asymptote.",
        "对数的图象在真数趋近 $0$ 的地方靠近一条竖直直线。所以 $g(x) = a\\log_{b}(cx - d) + k$ 的竖直渐近线在 $cx - d = 0$ 处：\n\n$$g(x) = 3\\log_{2}(2x - 6) + 1: \\quad 2x - 6 = 0 \\implies x = 3$$\n\n伸缩 $a$ 和竖直平移 $k$ 都不会移动渐近线。",
      ),
      generate(rng) {
        const B = drawBase(rng, [2, 3, 4, 5]);
        const a = rng.pick([1, 2, 3, -1, -2]);
        const c = rng.pick([1, 1, 2, 3, 4]);
        const d = rng.int(-12, 12);
        const k = rng.int(-6, 6);
        const g = `${coefL(a)}${B.of(linear(c, -d))}${plusK(k)}`;
        return numberProblem({
          prompt: t(`What is the vertical asymptote of the graph of $g(x) = ${g}$?`, `$g(x) = ${g}$ 的图象的竖直渐近线是什么？`),
          answer: Q.of(d, c),
          solveFor: "x",
          wrong: [Q.of(-d, c), Q.of(d), Q.of(k)],
          solution: both(
            "The asymptote is where the argument is $0$:",
            "渐近线在真数为 $0$ 处：",
            `${linear(c, -d)} = 0 \\implies x = ${num(Q.of(d, c))}`,
          ),
        });
      },
    },
    {
      id: "key-points-of-logarithmic-graphs",
      title: t("Key points", "关键点"),
      explanation: t(
        "The graph of $y = \\log_{b} x$ passes through $(1, 0)$ and $(b, 1)$. Under $g(x) = a\\log_{b}(x - h) + k$ the point $(x, y)$ moves to $(x + h, ay + k)$. For $g(x) = 2\\log_{3}(x + 1) - 4$, the point $(3, 1)$ moves to\n\n$$(3 - 1, \\; 2 \\cdot 1 - 4) = (2, -2)$$",
        "$y = \\log_{b} x$ 的图象经过 $(1, 0)$ 和 $(b, 1)$。在 $g(x) = a\\log_{b}(x - h) + k$ 下，点 $(x, y)$ 变到 $(x + h, ay + k)$。对 $g(x) = 2\\log_{3}(x + 1) - 4$，点 $(3, 1)$ 变到\n\n$$(3 - 1, \\; 2 \\cdot 1 - 4) = (2, -2)$$",
      ),
      generate(rng) {
        const b = rng.int(2, 6);
        const B = numBase(b);
        const a = rng.pick([1, 2, 3, -1, -2]);
        const h = rng.nonZero(-5, 5);
        const k = rng.int(-6, 6);
        const [x0, y0] = rng.bool(0.6) ? [b, 1] : [1, 0];
        const g = logT(a, B, h, k);
        return pointProblem({
          prompt: t(
            `The point $(${x0}, ${y0})$ lies on the graph of $f(x) = \\log_{${b}} x$. To which point does it move on the graph of $g(x) = ${g}$?`,
            `点 $(${x0}, ${y0})$ 在 $f(x) = \\log_{${b}} x$ 的图象上。在 $g(x) = ${g}$ 的图象上，它变到哪个点？`,
          ),
          answer: [x0 + h, a * y0 + k],
          wrong: [
            [x0 - h, a * y0 + k],
            [x0 + h, a * (y0 + k)],
            [x0 * a + h, y0 + k],
          ],
          solution: both(
            `Here $h = ${h}$, $a = ${a}$ and $k = ${k}$, so $(x, y)$ moves to $(x + h, ay + k)$:`,
            `这里 $h = ${h}$，$a = ${a}$，$k = ${k}$，所以 $(x, y)$ 变到 $(x + h, ay + k)$：`,
            `(${x0}${plusK(h)}, \\; ${a} \\cdot ${y0}${plusK(k)}) = (${x0 + h}, ${a * y0 + k})`,
          ),
        });
      },
    },
    {
      id: "equations-of-transformed-logarithms",
      title: t("Equations from descriptions", "由描述写解析式"),
      explanation: t(
        "Build the equation from $f(x) = \\log_{b} x$ step by step: a shift $h$ right replaces $x$ by $x - h$, a stretch by $|a|$ (with a reflection when $a < 0$) multiplies by $a$, and a shift $k$ up adds $k$. Shifting $\\log_{2} x$ $3$ units left and $2$ units down gives\n\n$$g(x) = \\log_{2}(x + 3) - 2$$",
        "从 $f(x) = \\log_{b} x$ 出发逐步写出解析式：向右平移 $h$ 就把 $x$ 换成 $x - h$；伸长为 $|a|$ 倍（$a < 0$ 时还要翻折）就乘以 $a$；向上平移 $k$ 就加上 $k$。把 $\\log_{2} x$ 向左平移 $3$ 个单位、向下平移 $2$ 个单位，得到\n\n$$g(x) = \\log_{2}(x + 3) - 2$$",
      ),
      generate(rng) {
        const B = drawBase(rng, [2, 3, 4, 5]);
        const a = rng.pick([1, 1, -1, 2, 3, -2]);
        const h = rng.nonZero(-5, 5);
        const k = rng.nonZero(-5, 5);
        const d = describe(a, h, k);
        const f = B.of("x");
        return oneOf(rng, {
          prompt: t(
            `Start with the graph of $f(x) = ${f}$. ${d.en} Which function has the new graph?`,
            `从 $f(x) = ${f}$ 的图象开始，${d["zh-CN"]}所得图象是哪个函数的图象？`,
          ),
          right: m(`g(x) = ${logT(a, B, h, k)}`),
          wrong: [
            m(`g(x) = ${logT(a, B, -h, k)}`),
            m(`g(x) = ${logT(a, B, h, -k)}`),
            m(`g(x) = ${logT(a, B, k, h)}`),
            m(`g(x) = ${logT(a, B, -h, -k)}`),
          ],
          solution: both(
            "Apply the transformations in order:",
            "按顺序作变换：",
            `${f} \\to ${logT(1, B, h, 0)} \\to ${logT(a, B, h, 0)} \\to ${logT(a, B, h, k)}`,
          ),
        });
      },
    },
  ],
  diagnostic: "key-points-of-logarithmic-graphs",
};

export const propertiesOfTransformedLogarithmicFunctions: TopicDef = {
  id: "properties-of-transformed-logarithmic-functions",
  title: t("Properties of Transformed Logarithmic Functions", "变换后对数函数的性质"),
  summary: t(
    "Find the domain, the $x$-intercept and the direction of $f(x) = a\\log_{b}(cx + d) + k$.",
    "求 $f(x) = a\\log_{b}(cx + d) + k$ 的定义域、$x$ 轴截距和单调性。",
  ),
  prerequisites: ["combining-graph-transformations-of-logarithmic-functions", "solving-logarithmic-equations"],
  encompasses: [
    { topic: "combining-graph-transformations-of-logarithmic-functions", weight: 0.5 },
    { topic: "solving-logarithmic-equations", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.IF.C.7.E", "CCSS.HSF.IF.B.5"],
  knowledgePoints: [
    {
      id: "the-domain-of-a-transformed-logarithm",
      title: t("The domain", "定义域"),
      explanation: t(
        "A logarithm is defined only for positive arguments, so the domain of $f(x) = a\\log_{b}(cx + d) + k$ is the solution set of $cx + d > 0$. For $f(x) = \\log_{3}(6 - 2x) + 1$:\n\n$$6 - 2x > 0 \\implies -2x > -6 \\implies x < 3$$\n\nThe domain is $(-\\infty, 3)$: dividing by a negative number reverses the inequality. The range of every such function is all real numbers.",
        "对数只对正的真数有定义，所以 $f(x) = a\\log_{b}(cx + d) + k$ 的定义域是 $cx + d > 0$ 的解集。对 $f(x) = \\log_{3}(6 - 2x) + 1$：\n\n$$6 - 2x > 0 \\implies -2x > -6 \\implies x < 3$$\n\n定义域是 $(-\\infty, 3)$：除以负数时不等号要改变方向。这类函数的值域都是全体实数。",
      ),
      generate(rng) {
        const B = drawBase(rng, [2, 3, 5]);
        const a = rng.pick([1, 2, -1, 3]);
        const c = rng.pick([1, 2, 3, -1, -2]);
        const d = rng.int(-10, 10);
        const k = rng.int(-5, 5);
        const edge = Q.of(-d, c);
        const right = c > 0;
        const set = (r: boolean, closed = false): RealSet =>
          r ? [{ lo: edge, loClosed: closed, hiClosed: false }] : [{ hi: edge, loClosed: false, hiClosed: closed }];
        const arg = linear(c, d);
        return intervalProblem({
          prompt: t(
            `What is the domain of $f(x) = ${coefL(a)}${B.of(arg)}${plusK(k)}$? Write it in interval notation.`,
            `$f(x) = ${coefL(a)}${B.of(arg)}${plusK(k)}$ 的定义域是什么？用区间表示。`,
          ),
          set: set(right),
          form: "interval",
          wrong: [set(!right), set(right, true), realLine, [{ lo: edge.neg(), loClosed: false, hiClosed: false }]],
          solution: both("The argument must be positive:", "真数必须为正：", `${arg} > 0`, `x ${right ? ">" : "<"} ${num(edge)}`),
        });
      },
    },
    {
      id: "the-x-intercept-of-a-transformed-logarithm",
      title: t("The $x$-intercept", "$x$ 轴截距"),
      explanation: t(
        "To find where $f(x) = a\\log_{b}(x - h) + k$ crosses the $x$-axis, solve $f(x) = 0$:\n\n$$2\\log_{3}(x - 1) + 4 = 0 \\implies \\log_{3}(x - 1) = -2 \\implies x - 1 = \\frac{1}{9} \\implies x = \\frac{10}{9}$$\n\nUnlike an exponential function, a logarithmic function always has exactly one $x$-intercept.",
        "求 $f(x) = a\\log_{b}(x - h) + k$ 与 $x$ 轴的交点，就是解 $f(x) = 0$：\n\n$$2\\log_{3}(x - 1) + 4 = 0 \\implies \\log_{3}(x - 1) = -2 \\implies x - 1 = \\frac{1}{9} \\implies x = \\frac{10}{9}$$\n\n与指数函数不同，对数函数总是恰好有一个 $x$ 轴截距。",
      ),
      generate(rng) {
        const B = drawBase(rng, [2, 3, 4, 5]);
        const a = rng.pick([1, 2, 3, -1, -2]);
        const mm = rng.int(-2, 3);
        const h = rng.int(-6, 6);
        const k = -a * mm;
        const x = Q.of(B.b).pow(mm).add(Q.of(h));
        return numberProblem({
          prompt: t(
            `Find the $x$-coordinate of the $x$-intercept of the graph of $f(x) = ${logT(a, B, h, k)}$.`,
            `求 $f(x) = ${logT(a, B, h, k)}$ 的图象与 $x$ 轴交点的横坐标。`,
          ),
          answer: x,
          solveFor: "x",
          wrong: [Q.of(h).sub(Q.of(B.b).pow(mm)), Q.of(B.b).pow(-mm).add(Q.of(h)), Q.of(h + mm)],
          solution: both(
            "Set $f(x) = 0$, isolate the logarithm and convert:",
            "令 $f(x) = 0$，把对数单独留在一边，再化为指数式：",
            `${B.of(linear(1, -h))} = ${mm}`,
            `${linear(1, -h)} = ${B.b}^{${mm}} = ${num(Q.of(B.b).pow(mm))}`,
            `x = ${num(x)}`,
          ),
        });
      },
    },
    {
      id: "direction-of-a-transformed-logarithm",
      title: t("Increasing or decreasing", "递增还是递减"),
      explanation: t(
        "With a base $b > 1$, $\\log_{b} u$ increases as $u$ increases. In $f(x) = a\\log_{b}(cx + d) + k$, a negative $c$ makes the argument decrease as $x$ increases, and a negative $a$ flips the graph. Each negative sign reverses the direction once, so $f$ increases exactly when $a$ and $c$ have the same sign: $f(x) = -2\\log_{3}(4 - x)$ is increasing.",
        "底数 $b > 1$ 时，$\\log_{b} u$ 随 $u$ 增大而增大。在 $f(x) = a\\log_{b}(cx + d) + k$ 中，负的 $c$ 使真数随 $x$ 增大而减小，负的 $a$ 使图象翻折。每个负号使方向反转一次，所以 $f$ 递增当且仅当 $a$ 与 $c$ 同号：$f(x) = -2\\log_{3}(4 - x)$ 是递增的。",
      ),
      generate(rng) {
        const B = drawBase(rng, [2, 3, 5, 7]);
        const a = rng.pick([1, 2, 3, -1, -2, -3]);
        const c = rng.pick([1, 2, -1, -2, -3]);
        const d = rng.int(-8, 8);
        const k = rng.int(-5, 5);
        const increasing = a > 0 === c > 0;
        const f = `${coefL(a)}${B.of(linear(c, d))}${plusK(k)}`;
        return choiceProblem({
          prompt: t(`Is $f(x) = ${f}$ increasing or decreasing on its domain?`, `$f(x) = ${f}$ 在定义域上是递增的还是递减的？`),
          options: [t("Increasing", "递增"), t("Decreasing", "递减")],
          correct: increasing ? 0 : 1,
          solution: t(
            `The argument $${linear(c, d)}$ ${c > 0 ? "increases" : "decreases"} as $x$ increases, so the logarithm ${c > 0 ? "increases" : "decreases"}. ${a < 0 ? "The negative factor reverses this, so" : "The factor is positive, so"} $f$ is ${increasing ? "increasing" : "decreasing"}.`,
            `$x$ 增大时，真数 $${linear(c, d)}$ ${c > 0 ? "增大" : "减小"}，所以对数${c > 0 ? "增大" : "减小"}。${a < 0 ? "负的系数使它反过来，所以" : "系数为正，所以"} $f$ ${increasing ? "递增" : "递减"}。`,
          ),
        });
      },
    },
  ],
  diagnostic: "the-domain-of-a-transformed-logarithm",
};

export const inversesOfExponentialAndLogarithmicFunctions: TopicDef = {
  id: "inverses-of-exponential-and-logarithmic-functions",
  title: t("Inverses of Exponential and Logarithmic Functions", "指数函数与对数函数的反函数"),
  summary: t(
    "Find inverses such as $f^{-1}(x) = 2^{x - 3} + 1$ for $f(x) = \\log_{2}(x - 1) + 3$, and evaluate inverses.",
    "求反函数，例如 $f(x) = \\log_{2}(x - 1) + 3$ 的反函数是 $f^{-1}(x) = 2^{x - 3} + 1$，并计算反函数的值。",
  ),
  prerequisites: ["graphing-logarithmic-functions", "calculating-the-inverse-of-a-function"],
  encompasses: [
    { topic: "calculating-the-inverse-of-a-function", weight: 0.5 },
    { topic: "converting-between-exponential-and-logarithmic-form", weight: 0.4 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.BF.B.4", "CCSS.HSF.BF.B.5"],
  knowledgePoints: [
    {
      id: "inverse-of-a-logarithmic-function",
      title: t("The inverse of a logarithmic function", "对数函数的反函数"),
      explanation: t(
        "To invert $f$, write $y = f(x)$, swap $x$ and $y$, and solve for $y$. For a logarithm, isolate it and convert to exponential form:\n\n$$x = \\log_{2}(y - 1) + 3 \\implies \\log_{2}(y - 1) = x - 3 \\implies y - 1 = 2^{x - 3}$$\n\nSo $f^{-1}(x) = 2^{x - 3} + 1$. The same works for $\\ln$: the inverse of $\\ln(x + 4) - 1$ is $e^{x + 1} - 4$.",
        "求 $f$ 的反函数：写成 $y = f(x)$，交换 $x$ 与 $y$，再解出 $y$。对于对数，先把对数单独留在一边，再化为指数式：\n\n$$x = \\log_{2}(y - 1) + 3 \\implies \\log_{2}(y - 1) = x - 3 \\implies y - 1 = 2^{x - 3}$$\n\n所以 $f^{-1}(x) = 2^{x - 3} + 1$。对 $\\ln$ 也一样：$\\ln(x + 4) - 1$ 的反函数是 $e^{x + 1} - 4$。",
      ),
      generate(rng) {
        const natural = rng.bool(0.25);
        const b = natural ? 0 : rng.pick([2, 3, 4, 5, 10]);
        const h = rng.nonZero(-6, 6);
        const k = rng.int(-6, 6);
        const f = `${natural ? lnOf(linear(1, -h)) : (b === 10 ? tenBase : numBase(b)).of(linear(1, -h))}${plusK(k)}`;
        const pow = (hh: number, kk: number) => `${natural ? "e" : b}^{${linear(1, -kk)}}${plusK(hh)}`;
        const answer = pow(h, k);
        return expressionProblem({
          prompt: t(`Find the inverse of $f(x) = ${f}$.`, `求 $f(x) = ${f}$ 的反函数。`),
          answer,
          prefix: "f^{-1}(x) =",
          wrong: [pow(h, -k), pow(-h, k), pow(k, h), pow(-h, -k)],
          solution: both(
            "Swap $x$ and $y$, isolate the logarithm, and convert:",
            "交换 $x$ 与 $y$，把对数单独留在一边，再化为指数式：",
            `x = ${f.replace(/\bx\b/g, "y")}`,
            `${linear(1, -h, "y")} = ${natural ? "e" : b}^{${linear(1, -k)}}`,
            `f^{-1}(x) = ${answer}`,
          ),
        });
      },
    },
    {
      id: "inverse-of-an-exponential-function",
      title: t("The inverse of an exponential function", "指数函数的反函数"),
      explanation: t(
        "For an exponential function, isolate the power and convert to logarithmic form:\n\n$$x = 3^{y + 2} - 5 \\implies 3^{y + 2} = x + 5 \\implies y + 2 = \\log_{3}(x + 5)$$\n\nSo $f^{-1}(x) = \\log_{3}(x + 5) - 2$. The horizontal asymptote $y = -5$ of $f$ becomes the vertical asymptote $x = -5$ of $f^{-1}$.",
        "对于指数函数，先把幂单独留在一边，再化为对数式：\n\n$$x = 3^{y + 2} - 5 \\implies 3^{y + 2} = x + 5 \\implies y + 2 = \\log_{3}(x + 5)$$\n\n所以 $f^{-1}(x) = \\log_{3}(x + 5) - 2$。$f$ 的水平渐近线 $y = -5$ 变成 $f^{-1}$ 的竖直渐近线 $x = -5$。",
      ),
      generate(rng) {
        const natural = rng.bool(0.25);
        const b = rng.pick([2, 3, 4, 5, 7]);
        const L = natural ? lnOf : numBase(b).of;
        const h = rng.nonZero(-6, 6);
        const k = rng.nonZero(-6, 6);
        const f = `${natural ? "e" : b}^{${linear(1, -h)}}${plusK(k)}`;
        const inv = (hh: number, kk: number) => `${L(linear(1, -kk))}${plusK(hh)}`;
        return oneOf(rng, {
          prompt: t(`Which function is the inverse of $f(x) = ${f}$?`, `哪个函数是 $f(x) = ${f}$ 的反函数？`),
          right: m(`f^{-1}(x) = ${inv(h, k)}`),
          wrong: [
            m(`f^{-1}(x) = ${inv(h, -k)}`),
            m(`f^{-1}(x) = ${inv(k, h)}`),
            m(`f^{-1}(x) = ${inv(-h, k)}`),
            m(`f^{-1}(x) = ${inv(-h, -k)}`),
          ],
          solution: both(
            "Swap $x$ and $y$, isolate the power, and convert:",
            "交换 $x$ 与 $y$，把幂单独留在一边，再化为对数式：",
            `x = ${natural ? "e" : b}^{${linear(1, -h, "y")}}${plusK(k)}`,
            `${linear(1, -h, "y")} = ${L(linear(1, -k))}`,
            `f^{-1}(x) = ${inv(h, k)}`,
          ),
        });
      },
    },
    {
      id: "evaluating-inverses",
      title: t("Evaluating an inverse", "求反函数的值"),
      explanation: t(
        "$f^{-1}(c)$ is the input that $f$ sends to $c$, so it is the solution of $f(x) = c$; there is no need to find the formula of $f^{-1}$. For $f(x) = 2(3)^{x} - 1$:\n\n$$f^{-1}(53) : \\quad 2(3)^{x} - 1 = 53 \\implies 3^{x} = 27 \\implies x = 3$$",
        "$f^{-1}(c)$ 是被 $f$ 映到 $c$ 的那个自变量，也就是方程 $f(x) = c$ 的解，不需要先求出 $f^{-1}$ 的解析式。对 $f(x) = 2(3)^{x} - 1$：\n\n$$f^{-1}(53) : \\quad 2(3)^{x} - 1 = 53 \\implies 3^{x} = 27 \\implies x = 3$$",
      ),
      generate(rng) {
        const a = rng.pick([1, 2, 3, 4]);
        const b = rng.pick([2, 3, 5]);
        const mm = rng.int(-1, b === 2 ? 5 : 3);
        const k = rng.int(-9, 9);
        const c = Q.of(b).pow(mm).mul(Q.of(a)).add(Q.of(k));
        const f = expT(a, Q.of(b), 0, k);
        return numberProblem({
          prompt: t(`For $f(x) = ${f}$, find $f^{-1}(${num(c)})$.`, `已知 $f(x) = ${f}$，求 $f^{-1}(${num(c)})$。`),
          answer: mm,
          wrong: [c.sub(Q.of(k)).div(Q.of(a)), -mm, c.div(Q.of(a))],
          solution: both(
            `$f^{-1}(${num(c)})$ is the solution of $f(x) = ${num(c)}$:`,
            `$f^{-1}(${num(c)})$ 是方程 $f(x) = ${num(c)}$ 的解：`,
            `${f} = ${num(c)}`,
            `${b}^{x} = ${num(Q.of(b).pow(mm))} = ${b}^{${mm}}`,
            `x = ${mm}`,
          ),
        });
      },
    },
  ],
  diagnostic: "inverse-of-a-logarithmic-function",
};

// Unit: modeling with exponential functions.

/** Compounding is how often interest is added in a year. */
interface Compounding {
  readonly n: number;
  readonly name: Text;
}

const compoundings: readonly Compounding[] = [
  { n: 1, name: t("annually", "每年计息一次") },
  { n: 2, name: t("semiannually", "每半年计息一次") },
  { n: 4, name: t("quarterly", "每季度计息一次") },
  { n: 12, name: t("monthly", "每月计息一次") },
];

/** money writes an amount of money with a thin-space thousands separator: "12{,}500.25". */
function money(v: Q): string {
  const s = dec(v);
  const [whole = "", frac] = s.split(".");
  const g = whole.replace(/\B(?=(\d{3})+$)/g, "{,}");
  return frac ? `${g}.${frac.padEnd(2, "0")}` : g;
}

/** rateL writes a percent rate as a decimal: 4 is "0.04". */
const rateL = (R: number) => dec(Q.of(R, 100));

export const modelingWithCompoundInterest: TopicDef = {
  id: "modeling-with-compound-interest",
  title: t("Modeling With Compound Interest", "用复利建模"),
  summary: t(
    "Use $A = P\\left(1 + \\frac{r}{n}\\right)^{nt}$ to find balances, and logarithms to find how long a balance takes to grow.",
    "用 $A = P\\left(1 + \\frac{r}{n}\\right)^{nt}$ 求余额，并用对数求余额增长到目标所需的时间。",
  ),
  prerequisites: ["modeling-exponential-growth-with-functions", "solving-exponential-equations-using-logarithms"],
  encompasses: [
    { topic: "modeling-exponential-growth-with-functions", weight: 0.5 },
    { topic: "solving-exponential-equations-using-logarithms", weight: 0.3 },
  ],
  xp: 16,
  standards: ["CCSS.HSF.LE.A.2", "CCSS.HSA.CED.A.1"],
  knowledgePoints: [
    {
      id: "the-compound-interest-formula",
      title: t("The compound interest formula", "复利公式"),
      explanation: t(
        "When a principal $P$ earns an annual interest rate $r$ (as a decimal), **compounded** $n$ times a year, each period adds $\\frac{r}{n}$ of the balance, and there are $nt$ periods in $t$ years:\n\n$$A = P\\left(1 + \\frac{r}{n}\\right)^{nt}$$\n\nFor $\\$2000$ at $6\\%$ compounded monthly for $5$ years: $A = 2000\\left(1 + \\frac{0.06}{12}\\right)^{12 \\cdot 5}$.",
        "本金 $P$ 按年利率 $r$（写成小数）**复利**计息，每年计息 $n$ 次时，每期增加余额的 $\\frac{r}{n}$，$t$ 年共有 $nt$ 期：\n\n$$A = P\\left(1 + \\frac{r}{n}\\right)^{nt}$$\n\n$2000$ 美元按年利率 $6\\%$、每月计息一次存 $5$ 年：$A = 2000\\left(1 + \\frac{0.06}{12}\\right)^{12 \\cdot 5}$。",
      ),
      generate(rng) {
        const P = rng.pick([500, 1000, 1500, 2000, 2500, 4000, 5000, 8000]);
        const R = rng.pick([2, 3, 4, 5, 6, 8]);
        const { n, name } = rng.pick(compoundings.filter((c) => c.n > 1));
        const tt = rng.int(2, 10);
        const r = rateL(R);
        const form = (inner: string, e: string) => m(`A = ${P}\\left(${inner}\\right)^{${e}}`);
        return oneOf(rng, {
          prompt: t(
            `$${P}$ dollars is invested at an annual interest rate of $${R}\\%$, compounded ${name.en}. Which expression gives the balance $A$ after $${tt}$ years?`,
            `把 $${P}$ 美元按年利率 $${R}\\%$ 存入，${name["zh-CN"]}。哪个式子表示 $${tt}$ 年后的余额 $A$？`,
          ),
          right: form(`1 + \\frac{${r}}{${n}}`, `${n} \\cdot ${tt}`),
          wrong: [
            form(`1 + ${r}`, `${n} \\cdot ${tt}`),
            form(`1 + \\frac{${r}}{${n}}`, `${tt}`),
            form(`1 + \\frac{${R}}{${n}}`, `${n} \\cdot ${tt}`),
            form(`1 + ${n} \\cdot ${r}`, `${tt}`),
          ],
          solution: t(
            `Here $P = ${P}$, $r = ${r}$, $n = ${n}$ and $t = ${tt}$. Each period adds $\\frac{${r}}{${n}}$ of the balance, and there are $${n} \\cdot ${tt}$ periods:${steps(`A = ${P}\\left(1 + \\frac{${r}}{${n}}\\right)^{${n} \\cdot ${tt}}`)}`,
            `这里 $P = ${P}$，$r = ${r}$，$n = ${n}$，$t = ${tt}$。每期增加余额的 $\\frac{${r}}{${n}}$，共有 $${n} \\cdot ${tt}$ 期：${steps(`A = ${P}\\left(1 + \\frac{${r}}{${n}}\\right)^{${n} \\cdot ${tt}}`)}`,
          ),
        });
      },
    },
    {
      id: "balance-after-compounding",
      title: t("The balance", "余额"),
      explanation: t(
        "Substitute into the formula and evaluate with a calculator, rounding only at the end:\n\n$$A = 2000\\left(1 + \\frac{0.06}{12}\\right)^{60} = 2000(1.005)^{60} \\approx 2697.70$$\n\nMore frequent compounding gives a slightly larger balance: compounded annually, the same deposit grows to $2000(1.06)^{5} \\approx 2676.45$.",
        "代入公式，用计算器计算，只在最后取近似值：\n\n$$A = 2000\\left(1 + \\frac{0.06}{12}\\right)^{60} = 2000(1.005)^{60} \\approx 2697.70$$\n\n计息越频繁，余额略大：每年计息一次时，同样的存款增长到 $2000(1.06)^{5} \\approx 2676.45$。",
      ),
      generate(rng) {
        for (;;) {
          const P = rng.pick([500, 800, 1000, 1200, 1500, 2000, 2500, 3000, 5000]);
          const R = rng.pick([2, 3, 4, 5, 6, 8]);
          const { n, name } = rng.pick(compoundings);
          const tt = rng.int(2, 10);
          const factor = Q.of(100 * n + R, 100 * n);
          const exact = factor.pow(n * tt).mul(Q.of(P));
          const answer = rounded(exact.toNumber(), 2);
          if (!answer) continue;
          const yearly = Q.of(100 + R, 100);
          return numberProblem({
            prompt: t(
              `$${P}$ dollars is invested at an annual interest rate of $${R}\\%$, compounded ${name.en}. Find the balance after $${tt}$ years, in dollars, to the nearest cent. Use a calculator.`,
              `把 $${P}$ 美元按年利率 $${R}\\%$ 存入，${name["zh-CN"]}。用计算器求 $${tt}$ 年后的余额（单位：美元，精确到分）。`,
            ),
            answer,
            form: "decimal",
            wrong: defined(
              rounded(P * (1 + (R * tt) / 100), 2),
              rounded(yearly.pow(tt).mul(Q.of(P)).toNumber(), 2),
              rounded(factor.pow(tt).mul(Q.of(P)).toNumber(), 2),
            ),
            solution: both(
              "Substitute into the compound interest formula:",
              "代入复利公式：",
              `A = ${P}\\left(1 + \\frac{${rateL(R)}}{${n}}\\right)^{${n} \\cdot ${tt}} \\approx ${money(answer)}`,
            ),
          });
        }
      },
    },
    {
      id: "time-to-reach-a-balance",
      title: t("The time to reach a balance", "达到目标余额的时间"),
      explanation: t(
        "To find when a balance reaches a target, divide by $P$ and take logarithms of both sides. When does $\\$1000$ at $4\\%$ compounded quarterly double?\n\n$$1000(1.01)^{4t} = 2000 \\implies (1.01)^{4t} = 2 \\implies 4t\\ln 1.01 = \\ln 2$$\n\n$$t = \\frac{\\ln 2}{4\\ln 1.01} \\approx 17.4 \\text{ years}$$",
        "求余额何时达到目标：两边除以 $P$，再两边取对数。$1000$ 美元按年利率 $4\\%$、每季度计息一次，何时翻倍？\n\n$$1000(1.01)^{4t} = 2000 \\implies (1.01)^{4t} = 2 \\implies 4t\\ln 1.01 = \\ln 2$$\n\n$$t = \\frac{\\ln 2}{4\\ln 1.01} \\approx 17.4 \\text{ 年}$$",
      ),
      generate(rng) {
        for (;;) {
          const P = rng.pick([500, 1000, 2000, 4000, 5000]);
          const R = rng.pick([2, 3, 4, 5, 6, 8]);
          const { n, name } = rng.pick(compoundings);
          const growth = rng.pick([Q.of(2), Q.of(3), Q.of(3, 2), Q.of(5, 4), Q.of(5, 2)]);
          const target = growth.mul(Q.of(P));
          if (!target.isInteger()) continue;
          const g = growth.toNumber();
          const step = 1 + R / (100 * n);
          const answer = rounded(Math.log(g) / (n * Math.log(step)), 1);
          if (!answer) continue;
          const goal = growth.eq(Q.of(2))
            ? t("double", "翻倍")
            : growth.eq(Q.of(3))
              ? t("triple", "变为原来的 3 倍")
              : t(`grow to $${money(target)}$ dollars`, `增长到 $${money(target)}$ 美元`);
          return numberProblem({
            prompt: t(
              `$${P}$ dollars is invested at an annual interest rate of $${R}\\%$, compounded ${name.en}. How many years does it take for the balance to ${goal.en}? Give the answer to the nearest tenth of a year.`,
              `把 $${P}$ 美元按年利率 $${R}\\%$ 存入，${name["zh-CN"]}。余额${goal["zh-CN"]}需要多少年？精确到 $0.1$ 年。`,
            ),
            answer,
            form: "decimal",
            solveFor: "t",
            wrong: defined(rounded(Math.log(g) / Math.log(step), 1), rounded((g - 1) / (R / 100), 1), rounded(Math.log(g) / (R / 100), 1)),
            solution: both(
              "Divide by the principal and take natural logarithms:",
              "两边除以本金，再取自然对数：",
              `\\left(1 + \\frac{${rateL(R)}}{${n}}\\right)^{${n}t} = ${num(growth)}`,
              `${n}t \\ln\\left(1 + \\frac{${rateL(R)}}{${n}}\\right) = \\ln ${num(growth)}`,
              `t = \\frac{\\ln ${num(growth)}}{${n}\\ln\\left(1 + \\frac{${rateL(R)}}{${n}}\\right)} \\approx ${dec(answer)}`,
            ),
          });
        }
      },
    },
  ],
  diagnostic: "balance-after-compounding",
};

export const continuouslyCompoundedInterest: TopicDef = {
  id: "continuously-compounded-interest",
  title: t("Continuously Compounded Interest", "连续复利"),
  summary: t(
    "Use $A = Pe^{rt}$ to find balances, times and rates when interest is compounded continuously.",
    "用 $A = Pe^{rt}$ 求连续复利下的余额、时间和利率。",
  ),
  prerequisites: ["modeling-with-compound-interest", "solving-equations-containing-the-exponential-function"],
  encompasses: [
    { topic: "modeling-with-compound-interest", weight: 0.5 },
    { topic: "solving-equations-containing-the-exponential-function", weight: 0.5 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.LE.A.2", "CCSS.HSF.LE.A.4"],
  knowledgePoints: [
    {
      id: "continuous-balance",
      title: t("The balance", "余额"),
      explanation: t(
        "As the number of compoundings per year grows without bound, $\\left(1 + \\frac{r}{n}\\right)^{nt}$ approaches $e^{rt}$. Interest **compounded continuously** gives\n\n$$A = Pe^{rt}$$\n\nFor $\\$3000$ at $5\\%$ for $8$ years: $A = 3000e^{0.05 \\cdot 8} = 3000e^{0.4} \\approx 4475.47$.",
        "每年计息次数无限增大时，$\\left(1 + \\frac{r}{n}\\right)^{nt}$ 趋近 $e^{rt}$。**连续复利**的余额为\n\n$$A = Pe^{rt}$$\n\n$3000$ 美元按年利率 $5\\%$ 存 $8$ 年：$A = 3000e^{0.05 \\cdot 8} = 3000e^{0.4} \\approx 4475.47$。",
      ),
      generate(rng) {
        for (;;) {
          const P = rng.pick([500, 800, 1000, 1500, 2000, 2500, 3000, 6000]);
          const R = rng.pick([2, 3, 4, 5, 6, 7, 8]);
          const tt = rng.int(2, 20);
          const answer = rounded(P * Math.exp((R * tt) / 100), 2);
          if (!answer) continue;
          return numberProblem({
            prompt: t(
              `$${P}$ dollars is invested at an annual interest rate of $${R}\\%$, compounded continuously. Find the balance after $${tt}$ years, in dollars, to the nearest cent. Use a calculator.`,
              `把 $${P}$ 美元按年利率 $${R}\\%$ 连续复利存入。用计算器求 $${tt}$ 年后的余额（单位：美元，精确到分）。`,
            ),
            answer,
            form: "decimal",
            wrong: defined(
              rounded(
                Q.of(100 + R, 100)
                  .pow(tt)
                  .mul(Q.of(P))
                  .toNumber(),
                2,
              ),
              rounded(P * (1 + (R * tt) / 100), 2),
              rounded(P * Math.exp(R / 100) * tt, 2),
            ),
            solution: both(
              "Substitute into $A = Pe^{rt}$:",
              "代入 $A = Pe^{rt}$：",
              `A = ${P}e^{${rateL(R)} \\cdot ${tt}} = ${P}e^{${dec(Q.of(R * tt, 100))}} \\approx ${money(answer)}`,
            ),
          });
        }
      },
    },
    {
      id: "time-with-continuous-compounding",
      title: t("The time to reach a balance", "达到目标余额的时间"),
      explanation: t(
        "Solve $Pe^{rt} = A$ by dividing by $P$ and taking the natural logarithm:\n\n$$2000e^{0.06t} = 5000 \\implies e^{0.06t} = 2.5 \\implies 0.06t = \\ln 2.5 \\implies t = \\frac{\\ln 2.5}{0.06} \\approx 15.3$$\n\nA balance doubles after $\\frac{\\ln 2}{r}$ years, whatever the principal.",
        "解 $Pe^{rt} = A$：两边除以 $P$，再取自然对数：\n\n$$2000e^{0.06t} = 5000 \\implies e^{0.06t} = 2.5 \\implies 0.06t = \\ln 2.5 \\implies t = \\frac{\\ln 2.5}{0.06} \\approx 15.3$$\n\n无论本金多少，余额都在 $\\frac{\\ln 2}{r}$ 年后翻倍。",
      ),
      generate(rng) {
        for (;;) {
          const P = rng.pick([500, 1000, 2000, 4000, 5000]);
          const R = rng.pick([2, 3, 4, 5, 6, 7, 8, 9]);
          const growth = rng.pick([Q.of(2), Q.of(3), Q.of(3, 2), Q.of(5, 2), Q.of(5, 4), Q.of(4)]);
          const target = growth.mul(Q.of(P));
          if (!target.isInteger()) continue;
          const g = growth.toNumber();
          const r = R / 100;
          const answer = rounded(Math.log(g) / r, 1);
          if (!answer) continue;
          return numberProblem({
            prompt: t(
              `$${P}$ dollars is invested at an annual interest rate of $${R}\\%$, compounded continuously. How many years does it take for the balance to reach $${money(target)}$ dollars? Give the answer to the nearest tenth of a year.`,
              `把 $${P}$ 美元按年利率 $${R}\\%$ 连续复利存入。余额达到 $${money(target)}$ 美元需要多少年？精确到 $0.1$ 年。`,
            ),
            answer,
            form: "decimal",
            solveFor: "t",
            wrong: defined(rounded((g - 1) / r, 1), rounded(Math.log(g) / Math.log(1 + r), 1), rounded(Math.log(g * P) / r, 1)),
            solution: both(
              "Divide by the principal and take the natural logarithm:",
              "两边除以本金，再取自然对数：",
              `e^{${rateL(R)}t} = ${num(growth)}`,
              `${rateL(R)}t = \\ln ${num(growth)}`,
              `t = \\frac{\\ln ${num(growth)}}{${rateL(R)}} \\approx ${dec(answer)}`,
            ),
          });
        }
      },
    },
    {
      id: "rate-for-continuous-growth",
      title: t("The interest rate", "利率"),
      explanation: t(
        "To find the rate, solve $Pe^{rt} = A$ for $r$:\n\n$$1000e^{10r} = 1500 \\implies 10r = \\ln 1.5 \\implies r = \\frac{\\ln 1.5}{10} \\approx 0.04055$$\n\nAs a percent, $r \\approx 4.05\\%$.",
        "求利率时，从 $Pe^{rt} = A$ 中解出 $r$：\n\n$$1000e^{10r} = 1500 \\implies 10r = \\ln 1.5 \\implies r = \\frac{\\ln 1.5}{10} \\approx 0.04055$$\n\n写成百分数，$r \\approx 4.05\\%$。",
      ),
      generate(rng) {
        for (;;) {
          const P = rng.pick([500, 1000, 2000, 2500, 4000]);
          const growth = rng.pick([Q.of(2), Q.of(3), Q.of(3, 2), Q.of(5, 2), Q.of(5, 4), Q.of(6, 5), Q.of(7, 4)]);
          const target = growth.mul(Q.of(P));
          if (!target.isInteger()) continue;
          const tt = rng.int(4, 25);
          const g = growth.toNumber();
          const answer = rounded((100 * Math.log(g)) / tt, 2);
          if (!answer) continue;
          return numberProblem({
            prompt: t(
              `An investment of $${P}$ dollars, compounded continuously, grows to $${money(target)}$ dollars in $${tt}$ years. What is the annual interest rate, as a percent to the nearest hundredth?`,
              `一笔 $${P}$ 美元的连续复利投资在 $${tt}$ 年后增长到 $${money(target)}$ 美元。年利率是百分之几？精确到百分位。`,
            ),
            answer,
            form: "decimal",
            percent: true,
            wrong: defined(rounded((100 * (g - 1)) / tt, 2), rounded(100 * (g ** (1 / tt) - 1), 2), rounded(Math.log(g) / tt, 2)),
            solution: both(
              "Divide by the principal, take the natural logarithm, and divide by the time:",
              "两边除以本金，取自然对数，再除以时间：",
              `e^{${tt}r} = ${num(growth)}`,
              `r = \\frac{\\ln ${num(growth)}}{${tt}} \\approx ${dec(answer.div(Q.of(100)))}`,
            ),
          });
        }
      },
    },
  ],
  diagnostic: "continuous-balance",
};

export const convertingBetweenExponents: TopicDef = {
  id: "converting-between-exponents",
  title: t("Converting Between Exponents", "指数形式之间的转换"),
  summary: t(
    "Rewrite exponential models between base $e$ and other bases, and between time units, to compare their rates.",
    "在以 $e$ 为底和以其他数为底之间、在不同时间单位之间改写指数模型，以比较增长率。",
  ),
  prerequisites: ["continuously-compounded-interest"],
  encompasses: [
    { topic: "continuously-compounded-interest", weight: 0.4 },
    { topic: "writing-radicals-using-fractional-exponents", weight: 0.2 },
    { topic: "modeling-with-compound-interest", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.SSE.B.3.C", "CCSS.HSF.IF.C.8.B"],
  knowledgePoints: [
    {
      id: "from-base-e-to-a-growth-factor",
      title: t("From base $e$ to a growth factor", "从以 $e$ 为底到增长倍数"),
      explanation: t(
        "Since $e^{kt} = \\left(e^{k}\\right)^{t}$, the model $P = P_{0}e^{kt}$ has the yearly growth factor $e^{k}$. For $P = 500e^{0.03t}$:\n\n$$e^{0.03} \\approx 1.03045$$\n\nso the quantity grows by about $3.05\\%$ per year, a little more than $3\\%$. With $k < 0$ the factor is below $1$ and the quantity decays.",
        "因为 $e^{kt} = \\left(e^{k}\\right)^{t}$，模型 $P = P_{0}e^{kt}$ 每年的增长倍数是 $e^{k}$。对 $P = 500e^{0.03t}$：\n\n$$e^{0.03} \\approx 1.03045$$\n\n所以这个量每年约增长 $3.05\\%$，比 $3\\%$ 略多。$k < 0$ 时倍数小于 $1$，这个量在衰减。",
      ),
      generate(rng) {
        for (;;) {
          const K = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, -2, -3, -4, -5, -8, -10]);
          const P0 = rng.pick([200, 500, 800, 1200, 3000]);
          const factor = Math.exp(K / 100);
          const answer = rounded(Math.abs(factor - 1) * 100, 2);
          if (!answer) continue;
          const growth = K > 0;
          return numberProblem({
            prompt: t(
              `A quantity is modeled by $P(t) = ${P0}e^{${dec(Q.of(K, 100))}t}$, with $t$ in years. By what percent does it ${growth ? "increase" : "decrease"} each year? Give the percent to the nearest hundredth.`,
              `某个量的模型是 $P(t) = ${P0}e^{${dec(Q.of(K, 100))}t}$，$t$ 的单位是年。它每年${growth ? "增长" : "减少"}百分之几？精确到百分位。`,
            ),
            answer,
            form: "decimal",
            percent: true,
            wrong: defined(Q.of(Math.abs(K)), rounded(Math.abs(Math.log(1 + K / 100)) * 100, 2), rounded(factor * 100, 2)),
            solution: both(
              "The yearly factor is $e^{k}$:",
              "每年的倍数是 $e^{k}$：",
              `P(t) = ${P0}\\left(e^{${dec(Q.of(K, 100))}}\\right)^{t} \\approx ${P0}(${dec(rounded(factor, 5) ?? Q.of(Math.round(factor * 1e5), 1e5))})^{t}`,
              `\\text{${growth ? "rate" : "rate of decrease"}} \\approx ${dec(answer)}\\%`,
            ),
          });
        }
      },
    },
    {
      id: "from-a-growth-factor-to-base-e",
      title: t("From a growth factor to base $e$", "从增长倍数到以 $e$ 为底"),
      explanation: t(
        "Any positive base can be written as a power of $e$: $b = e^{\\ln b}$. So\n\n$$P = 200(1.06)^{t} = 200\\left(e^{\\ln 1.06}\\right)^{t} = 200e^{kt}, \\quad k = \\ln 1.06 \\approx 0.0583$$\n\nThe continuous rate $k$ is a little less than the yearly rate $0.06$. A decay factor below $1$ gives a negative $k$.",
        "任何正数底都可以写成 $e$ 的幂：$b = e^{\\ln b}$。所以\n\n$$P = 200(1.06)^{t} = 200\\left(e^{\\ln 1.06}\\right)^{t} = 200e^{kt}, \\quad k = \\ln 1.06 \\approx 0.0583$$\n\n连续增长率 $k$ 比每年的增长率 $0.06$ 略小。小于 $1$ 的衰减倍数给出负的 $k$。",
      ),
      generate(rng) {
        for (;;) {
          const R = rng.pick([2, 3, 4, 5, 6, 8, 10, 12, 15, 20, -5, -10, -15, -20, -25]);
          const P0 = rng.pick([100, 200, 400, 750, 1500]);
          const b = Q.of(100 + R, 100);
          const answer = rounded(Math.log(1 + R / 100), 4);
          if (!answer) continue;
          return numberProblem({
            prompt: t(
              `Write $P(t) = ${P0}(${dec(b)})^{t}$ in the form $P(t) = ${P0}e^{kt}$. Find $k$ to four decimal places.`,
              `把 $P(t) = ${P0}(${dec(b)})^{t}$ 写成 $P(t) = ${P0}e^{kt}$ 的形式。求 $k$（精确到小数点后第四位）。`,
            ),
            answer,
            form: "decimal",
            solveFor: "k",
            wrong: defined(Q.of(R, 100), rounded(Math.log10(1 + R / 100), 4), rounded(Math.exp(R / 100) - 1, 4)),
            solution: both(
              "Write the base as a power of $e$:",
              "把底数写成 $e$ 的幂：",
              `${dec(b)} = e^{\\ln ${dec(b)}}`,
              `k = \\ln ${dec(b)} \\approx ${dec(answer)}`,
            ),
          });
        }
      },
    },
    {
      id: "changing-the-time-unit",
      title: t("Changing the time unit", "改变时间单位"),
      explanation: t(
        "A rule of exponents changes the time unit. A yearly factor of $1.12$ is a monthly factor of $1.12^{\\frac{1}{12}}$, since $(1.12)^{t} = \\left(1.12^{\\frac{1}{12}}\\right)^{12t}$ and $12t$ counts months:\n\n$$1.12^{\\frac{1}{12}} \\approx 1.00949$$\n\nThat is about $0.95\\%$ per month, not $\\frac{12\\%}{12} = 1\\%$. In the same way, a half-life of $5$ years, $\\left(\\frac{1}{2}\\right)^{\\frac{t}{5}}$, is a yearly factor of $\\left(\\frac{1}{2}\\right)^{\\frac{1}{5}} \\approx 0.8706$: a decrease of about $12.94\\%$ per year.",
        "用指数法则可以改变时间单位。每年的倍数 $1.12$ 相当于每月的倍数 $1.12^{\\frac{1}{12}}$，因为 $(1.12)^{t} = \\left(1.12^{\\frac{1}{12}}\\right)^{12t}$，而 $12t$ 是月数：\n\n$$1.12^{\\frac{1}{12}} \\approx 1.00949$$\n\n即每月约 $0.95\\%$，而不是 $\\frac{12\\%}{12} = 1\\%$。同样，半衰期为 $5$ 年的 $\\left(\\frac{1}{2}\\right)^{\\frac{t}{5}}$ 相当于每年的倍数 $\\left(\\frac{1}{2}\\right)^{\\frac{1}{5}} \\approx 0.8706$：每年约减少 $12.94\\%$。",
      ),
      generate(rng) {
        for (;;) {
          const kind = rng.int(0, 2);
          if (kind === 0) {
            const R = rng.pick([6, 8, 9, 10, 12, 15, 18, 20, 24, 30]);
            const answer = rounded(((1 + R / 100) ** (1 / 12) - 1) * 100, 2);
            if (!answer) continue;
            const b = dec(Q.of(100 + R, 100));
            return numberProblem({
              prompt: t(
                `A quantity grows by $${R}\\%$ per year, so it is modeled by $A(t) = A_{0}(${b})^{t}$ with $t$ in years. By what percent does it grow each month? Give the percent to the nearest hundredth.`,
                `某个量每年增长 $${R}\\%$，模型为 $A(t) = A_{0}(${b})^{t}$，$t$ 的单位是年。它每月增长百分之几？精确到百分位。`,
              ),
              answer,
              form: "decimal",
              percent: true,
              wrong: defined(rounded(R / 12, 2), rounded(((1 + R / 100) ** 12 - 1) * 100, 2)),
              solution: both(
                "Write the yearly factor as a power of a monthly factor:",
                "把每年的倍数写成每月倍数的幂：",
                `(${b})^{t} = \\left(${b}^{\\frac{1}{12}}\\right)^{12t}`,
                `${b}^{\\frac{1}{12}} \\approx ${dec(Q.of(Math.round((1 + R / 100) ** (1 / 12) * 1e5), 1e5))}`,
                `\\text{monthly rate} \\approx ${dec(answer)}\\%`,
              ),
            });
          }
          const H = rng.int(2, 12);
          const half = kind === 1;
          const factor = (half ? 0.5 : 2) ** (1 / H);
          const answer = rounded(Math.abs(factor - 1) * 100, 2);
          if (!answer) continue;
          const shown = half ? `\\left(\\frac{1}{2}\\right)^{\\frac{t}{${H}}}` : `2^{\\frac{t}{${H}}}`;
          return numberProblem({
            prompt: half
              ? t(
                  `A substance has a half-life of $${H}$ years, so the amount left is $A(t) = A_{0}${shown}$ with $t$ in years. By what percent does the amount decrease each year? Give the percent to the nearest hundredth.`,
                  `某物质的半衰期是 $${H}$ 年，剩余量为 $A(t) = A_{0}${shown}$，$t$ 的单位是年。剩余量每年减少百分之几？精确到百分位。`,
                )
              : t(
                  `A population doubles every $${H}$ years, so it is modeled by $P(t) = P_{0}${shown}$ with $t$ in years. By what percent does it grow each year? Give the percent to the nearest hundredth.`,
                  `某种群每 $${H}$ 年翻一番，模型为 $P(t) = P_{0}${shown}$，$t$ 的单位是年。它每年增长百分之几？精确到百分位。`,
                ),
            answer,
            form: "decimal",
            percent: true,
            wrong: defined(rounded((half ? 50 : 100) / H, 2), rounded(factor * 100, 2)),
            solution: both(
              "The yearly factor is the value at $t = 1$:",
              "每年的倍数就是 $t = 1$ 时的值：",
              `${half ? `\\left(\\frac{1}{2}\\right)^{\\frac{1}{${H}}}` : `2^{\\frac{1}{${H}}}`} \\approx ${dec(Q.of(Math.round(factor * 1e5), 1e5))}`,
              `\\text{${half ? "decrease" : "increase"}} \\approx ${dec(answer)}\\%`,
            ),
          });
        }
      },
    },
  ],
  diagnostic: "from-a-growth-factor-to-base-e",
};

/** logarithmicEquationTopics are the topics of logarithmic equations, graphs of exponential and logarithmic functions, and exponential modeling of Algebra II, in teaching order. */
export const logarithmicEquationTopics: readonly TopicDef[] = [
  solvingLogarithmicEquations,
  solvingLogarithmicEquationsContainingTheNaturalLogarithm,
  solvingLogarithmicEquationsUsingTheLawsOfLogarithms,
  solvingLogarithmicEquationsByCombiningTheLawsOfLogarithms,
  solvingLogarithmicEquationsWithLogarithmsOnBothSides,
  solvingLogarithmicEquationsUsingTheZeroProductProperty,
  verticalTranslationsOfExponentialGrowthFunctions,
  verticalTranslationsOfExponentialDecayFunctions,
  interpretingGraphsOfExponentialFunctions,
  verticalReflectionsOfExponentialFunctions,
  combiningGraphTransformationsOfExponentialFunctions,
  propertiesOfTransformedExponentialFunctions,
  graphingLogarithmicFunctions,
  combiningGraphTransformationsOfLogarithmicFunctions,
  propertiesOfTransformedLogarithmicFunctions,
  inversesOfExponentialAndLogarithmicFunctions,
  modelingWithCompoundInterest,
  continuouslyCompoundedInterest,
  convertingBetweenExponents,
];
