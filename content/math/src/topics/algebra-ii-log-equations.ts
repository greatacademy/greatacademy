import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import {
  type Coefficient,
  type Compass,
  dec,
  linear,
  num,
  paren,
  type PlaneMark,
  type PlaneView,
  type Point,
  plane,
  poly,
  Q,
  type RealSet,
  realLine,
} from "@ga/subject-math";
import { algebraDrawings2 } from "../explanation-drawings-algebra-2.ts";
import { algebraDrawings3 } from "../explanation-drawings-algebra-3.ts";
import { annotate, at, guides, plain, shift } from "../graph-figures.ts";
import { choiceProblem, expressionProblem, intervalProblem, numberProblem, pointProblem, solutionsProblem, steps } from "../problems.ts";
import { chain, evalAt, stepLabel } from "../solution-kit.ts";
import { reasoned } from "../wrong-reasons.ts";

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

/** orListZh joins solution values for a Chinese sentence: "x = 3 \quad \text{或} \quad x = -2". */
const orListZh = (vs: readonly Coefficient[]) => vs.map((v) => `x = ${num(v)}`).join(" \\quad \\text{或} \\quad ");

/** label writes the bold start of step i of a solution in one locale. */
const label = (i: number, en: string, zh: string) => stepLabel(i, en, zh);

/** undoAdd says how to remove a term c added to x: "subtract $3$ from both sides". */
const undoAdd = (c: Coefficient): Text =>
  toQ(c).sign() > 0
    ? t(`subtract $${num(c)}$ from both sides`, `两边同时减去 $${num(c)}$`)
    : t(`add $${num(toQ(c).neg())}$ to both sides`, `两边同时加上 $${num(toQ(c).neg())}$`);

/** undoTimes says how to remove a factor a of x: "divide both sides by $3$". */
const undoTimes = (a: Coefficient): Text => t(`divide both sides by $${num(a)}$`, `两边同时除以 $${num(a)}$`);

/** joinHow joins the moves of a solution into one phrase: "subtract 3 from both sides, then divide both sides by 2". */
const joinHow = (moves: readonly Text[]): Text => t(moves.map((h) => h.en).join(", then "), moves.map((h) => h["zh-CN"]).join("，再"));

/** LinearSolve is the work of solving a·x + c = v: its lines and the moves that produce them. */
interface LinearSolve {
  readonly lines: readonly string[];
  readonly how: Text;
}

/** solveLinear writes the steps that solve a·x + c = v for x, where the right side v may be written as a LaTeX expression. */
function solveLinear(a: Coefficient, c: Coefficient, v: Coefficient): LinearSolve {
  const A = toQ(a);
  const C = toQ(c);
  const rest = toQ(v).sub(C);
  const lines: string[] = [];
  const moves: Text[] = [];
  if (!C.isZero()) {
    lines.push(`${coefL(A)}x = ${num(rest)}`);
    moves.push(undoAdd(C));
  }
  if (!A.eq(Q.one)) {
    lines.push(`x = ${num(rest.div(A))}`);
    moves.push(undoTimes(A));
  }
  return { lines, how: joinHow(moves) };
}

/** powBase writes a number as the base of a power: "5", "\left(-5\right)", "\left(\frac{1}{5}\right)". */
const powBase = (v: Coefficient) => {
  const q = toQ(v);
  return q.isInteger() && q.sign() >= 0 ? num(q) : `\\left(${num(q)}\\right)`;
};

/** tenNote is the reminder that a logarithm written without a base is the common logarithm, or nothing for another base. */
const tenNote = (B: Base): Text =>
  B.b === 10 ? t(" (with no base written, $\\log$ means $\\log_{10}$)", "（不写底数的 $\\log$ 表示 $\\log_{10}$）") : t("", "");

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
  intro: t(
    `A logarithm is an exponent: $\\log_{b} u = c$ says exactly the same as $b^{c} = u$. So far the unknown was the exponent $c$, as in $\\log_{2} 32 = ?$. In a **logarithmic equation** the unknown sits inside the logarithm, in the argument $u$, and the same two-way translation solves it.

Take $\\log_{3} x = 4$. In exponential form it says that $3$ to the power $4$ is $x$:

$$\\log_{3} x = 4 \\iff x = 3^{4} = 81.$$

When the argument is an expression, the exponential form turns the equation into an ordinary one for that expression. For $\\log_{5}(x + 2) = 2$ the argument must be $5^{2}$:

$$x + 2 = 25, \\qquad x = 23.$$

A logarithm is defined only for positive arguments. Here the argument came out as $25$, which is positive, and that is no accident: a power $b^{c}$ of a positive base is always positive. So when **one** logarithm equals a number, the solution of the exponential form is always a solution of the logarithmic equation.

In this lesson we solve equations whose argument is linear, then equations in which the logarithm must first be isolated, and finally equations in which the logarithm equals a fraction or a negative number.`,
    `对数就是指数：$\\log_{b} u = c$ 与 $b^{c} = u$ 说的是同一件事。以前未知的是指数 $c$，比如 $\\log_{2} 32 = ?$。在**对数方程**中，未知数在对数里面，也就是在真数 $u$ 中，用同样的互化就能解它。

看 $\\log_{3} x = 4$。写成指数式，它说的是 $3$ 的 $4$ 次方等于 $x$：

$$\\log_{3} x = 4 \\iff x = 3^{4} = 81.$$

真数是一个式子时，化为指数式就得到关于这个式子的普通方程。对 $\\log_{5}(x + 2) = 2$，真数必须等于 $5^{2}$：

$$x + 2 = 25, \\qquad x = 23.$$

对数只对正的真数有定义。这里真数算出来是 $25$，是正数，这并非偶然：正底数的幂 $b^{c}$ 总是正数。所以当**一个**对数等于一个数时，由指数式解出的值一定是对数方程的解。

这节课先解真数是一次式的方程，再解需要先把对数单独留在一边的方程，最后解对数等于分数或负数的方程。`,
  ),
  knowledgePoints: [
    {
      id: "linear-arguments",
      title: t("A logarithm of a linear expression", "一次式的对数"),
      explanation: t(
        `To solve an equation in which one logarithm equals a number, rewrite it in exponential form. Since $\\log_{b} u = c$ means $u = b^{c}$, the **argument** equals the base raised to the number on the other side:

$$\\log_{2}(3x - 1) = 3 \\implies 3x - 1 = 2^{3} = 8$$

The logarithm is gone, and a linear equation is left: $3x = 9$, so $x = 3$.

Putting the answer back checks it: for $x = 3$ the argument is $3 \\cdot 3 - 1 = 8$, and $\\log_{2} 8 = 3$ because $2^{3} = 8$.

> **Watch out.** The number on the right is an exponent, so the argument equals $2^{3} = 8$, not $3$: dropping the logarithm and solving $3x - 1 = 3$ is wrong. And $2^{3}$ is $2 \\cdot 2 \\cdot 2$, not $2 \\cdot 3 = 6$ or $3^{2} = 9$.`,
        `一个对数等于一个数时，把方程化为指数式。因为 $\\log_{b} u = c$ 表示 $u = b^{c}$，所以**真数**等于底数的另一边那个数次方：

$$\\log_{2}(3x - 1) = 3 \\implies 3x - 1 = 2^{3} = 8$$

对数没有了，剩下一个一次方程：$3x = 9$，所以 $x = 3$。

把答案代回去就能检验：$x = 3$ 时真数是 $3 \\cdot 3 - 1 = 8$，而 $\\log_{2} 8 = 3$，因为 $2^{3} = 8$。

> **注意。** 右边的数是指数，所以真数等于 $2^{3} = 8$，而不是 $3$：直接去掉对数、解 $3x - 1 = 3$ 是错的。另外 $2^{3}$ 是 $2 \\cdot 2 \\cdot 2$，不是 $2 \\cdot 3 = 6$，也不是 $3^{2} = 9$。`,
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
          const work = solveLinear(a, c, P);
          const note = tenNote(B);
          return numberProblem({
            prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
            answer: x,
            solveFor: "x",
            wrong: [Q.of(k - c, a), Q.of(B.b * k - c, a), Q.of(k ** B.b - c, a)],
            solution: t(
              `${label(1, "Exponential form", "化为指数式").en} One logarithm equals a number${note.en}, so the argument equals the base to that power:${steps(eq, `${arg} = ${B.b}^{${k}} = ${P}`)}${label(2, "Solve for $x$", "解出 $x$").en} The logarithm is gone. To solve the linear equation, ${work.how.en}:${steps(...work.lines)}**Check.** For $x = ${x}$ the argument is $${evalAt(a, x, c)} = ${P}$, and $${B.of(String(P))} = ${k}$ because $${B.b}^{${k}} = ${P}$.`,
              `${label(1, "Exponential form", "化为指数式")["zh-CN"]} 一个对数等于一个数${note["zh-CN"]}，所以真数等于底数的这个数次方：${steps(eq, `${arg} = ${B.b}^{${k}} = ${P}`)}${label(2, "Solve for $x$", "解出 $x$")["zh-CN"]} 对数已经去掉了。解这个一次方程：${work.how["zh-CN"]}：${steps(...work.lines)}**检验。** $x = ${x}$ 时真数是 $${evalAt(a, x, c)} = ${P}$，而 $${B.of(String(P))} = ${k}$，因为 $${B.b}^{${k}} = ${P}$。`,
            ),
          });
        }
      },
    },
    {
      id: "isolating-the-logarithm",
      title: t("Isolating the logarithm", "把对数单独留在一边"),
      explanation: t(
        `The exponential form translates a statement "**a logarithm** equals a number". When the logarithm is multiplied by a number or has a number added to it, the equation is not yet of that shape, so first isolate the logarithm, exactly as you would isolate $x$ in a two-step equation:

$$2\\log_{3}(x + 4) - 1 = 3 \\implies 2\\log_{3}(x + 4) = 4 \\implies \\log_{3}(x + 4) = 2$$

Now one logarithm equals a number, and the exponential form applies: $x + 4 = 3^{2} = 9$, so $x = 5$. Check: $\\log_{3} 9 = 2$, and $2 \\cdot 2 - 1 = 3$.

> **Watch out.** Undo the operations outside the logarithm **before** converting. Writing $x + 4 = 3^{4}$ straight from $2\\log_{3}(x + 4) = 4$ treats $2\\log_{3}(x + 4)$ as if it were $\\log_{3}(x + 4)$. And at the end, $x + 4 = 9$ gives $x = 9 - 4$, not $9 + 4$.`,
        `指数式翻译的是"**一个对数**等于一个数"这样的式子。对数乘了一个数或加了一个数时，方程还不是这个样子，所以要先把对数单独留在一边，就像在两步方程中把 $x$ 单独留下一样：

$$2\\log_{3}(x + 4) - 1 = 3 \\implies 2\\log_{3}(x + 4) = 4 \\implies \\log_{3}(x + 4) = 2$$

现在是一个对数等于一个数，可以化为指数式：$x + 4 = 3^{2} = 9$，所以 $x = 5$。检验：$\\log_{3} 9 = 2$，而 $2 \\cdot 2 - 1 = 3$。

> **注意。** 先撤销对数外面的运算，**再**化为指数式。由 $2\\log_{3}(x + 4) = 4$ 直接写出 $x + 4 = 3^{4}$，就是把 $2\\log_{3}(x + 4)$ 当成了 $\\log_{3}(x + 4)$。最后一步 $x + 4 = 9$ 得 $x = 9 - 4$，而不是 $9 + 4$。`,
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
          const moves = [...(d === 0 ? [] : [undoAdd(d)]), undoTimes(p)];
          const how = joinHow(moves);
          const last = c === 0 ? [] : [`x = ${P} ${c > 0 ? "-" : "+"} ${Math.abs(c)} = ${x}`];
          const note = tenNote(B);
          const outside = p * k;
          return numberProblem({
            prompt: t(`Solve $${lhs} = ${e}$.`, `解方程 $${lhs} = ${e}$。`),
            answer: x,
            solveFor: "x",
            wrong: [P + c, B.b * k - c, ...skipped],
            solution: t(
              `${label(1, "Isolate the logarithm", "把对数单独留在一边").en} The logarithm is ${d === 0 ? "multiplied by a number" : "multiplied by a number and has a number added"}, so ${how.en}:${steps(`${lhs} = ${e}`, ...(d === 0 ? [] : [`${coefL(p)}${B.of(arg)} = ${e - d}`]), `${B.of(arg)} = ${k}`)}${label(2, "Exponential form", "化为指数式").en} Now one logarithm equals a number${note.en}:${steps(`${arg} = ${B.b}^{${k}} = ${P}`, ...last)}**Check.** For $x = ${x}$ the argument is $${P}$ and $${B.of(String(P))} = ${k}$, so the left side is $${p === -1 ? `-(${k})` : `${p} \\cdot ${paren(k)}`}${plusK(d)} = ${outside}${plusK(d)} = ${e}$, as required.`,
              `${label(1, "Isolate the logarithm", "把对数单独留在一边")["zh-CN"]} 对数${d === 0 ? "乘了一个数" : "乘了一个数，还加了一个数"}，所以${how["zh-CN"]}：${steps(`${lhs} = ${e}`, ...(d === 0 ? [] : [`${coefL(p)}${B.of(arg)} = ${e - d}`]), `${B.of(arg)} = ${k}`)}${label(2, "Exponential form", "化为指数式")["zh-CN"]} 现在是一个对数等于一个数${note["zh-CN"]}：${steps(`${arg} = ${B.b}^{${k}} = ${P}`, ...last)}**检验。** $x = ${x}$ 时真数是 $${P}$，$${B.of(String(P))} = ${k}$，所以左边是 $${p === -1 ? `-(${k})` : `${p} \\cdot ${paren(k)}`}${plusK(d)} = ${outside}${plusK(d)} = ${e}$，与右边相等。`,
            ),
          });
        }
      },
    },
    {
      id: "fractional-and-negative-values",
      title: t("Fractional and negative values", "等于分数或负数"),
      explanation: t(
        `A logarithm can equal any real number, so the exponent in the exponential form can be a fraction or a negative number. The method does not change; only evaluating the power takes more care. Recall the two rules:

$$b^{\\frac{m}{n}} = \\left(\\sqrt[n]{b}\\right)^{m}, \\qquad b^{-m} = \\frac{1}{b^{m}}$$

For $\\log_{4}(2x + 1) = \\frac{3}{2}$, the argument is $4^{\\frac{3}{2}}$: take the square root first, then the cube:

$$2x + 1 = 4^{\\frac{3}{2}} = \\left(\\sqrt{4}\\right)^{3} = 2^{3} = 8 \\implies 2x = 7 \\implies x = \\frac{7}{2}$$

For $\\log_{3}(x - 1) = -2$ the power is a reciprocal: $x - 1 = 3^{-2} = \\frac{1}{9}$, so $x = \\frac{10}{9}$.

> **Watch out.** A fractional exponent is a root and a power, not a product: $4^{\\frac{3}{2}}$ is $8$, not $\\frac{3}{2} \\cdot 4 = 6$. A negative exponent makes a reciprocal, not a negative number: $3^{-2} = \\frac{1}{9}$, not $-9$, and not $9$.`,
        `对数可以等于任何实数，所以指数式中的指数可以是分数或负数。方法不变，只是计算幂时要更仔细。回忆两条法则：

$$b^{\\frac{m}{n}} = \\left(\\sqrt[n]{b}\\right)^{m}, \\qquad b^{-m} = \\frac{1}{b^{m}}$$

对 $\\log_{4}(2x + 1) = \\frac{3}{2}$，真数是 $4^{\\frac{3}{2}}$：先开平方，再立方：

$$2x + 1 = 4^{\\frac{3}{2}} = \\left(\\sqrt{4}\\right)^{3} = 2^{3} = 8 \\implies 2x = 7 \\implies x = \\frac{7}{2}$$

对 $\\log_{3}(x - 1) = -2$，幂是一个倒数：$x - 1 = 3^{-2} = \\frac{1}{9}$，所以 $x = \\frac{10}{9}$。

> **注意。** 分数指数表示开方再乘方，而不是相乘：$4^{\\frac{3}{2}}$ 是 $8$，不是 $\\frac{3}{2} \\cdot 4 = 6$。负指数表示倒数，而不是负数：$3^{-2} = \\frac{1}{9}$，不是 $-9$，也不是 $9$。`,
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
          const n = Number(kq.n);
          const dd = Number(kq.d);
          const root = r ** (p / dd);
          const rootL = dd === 1 ? "" : dd === 2 ? `\\sqrt{${b}}` : `\\sqrt[${dd}]{${b}}`;
          const power =
            dd === 1
              ? `${b}^{${n}} = \\frac{1}{${b}^{${-n}}} = ${num(V)}`
              : n === 1
                ? `${b}^{${num(kq)}} = ${rootL} = ${num(V)}`
                : `${b}^{${num(kq)}} = \\left(${rootL}\\right)^{${n}} = ${root}^{${n}} = ${num(V)}`;
          const rule =
            dd === 1
              ? t("A negative exponent gives a reciprocal:", "负指数表示倒数：")
              : n === 1
                ? t(`An exponent $\\frac{1}{${dd}}$ is a root:`, `指数 $\\frac{1}{${dd}}$ 表示开方：`)
                : n < 0
                  ? t(
                      `The denominator $${dd}$ of the exponent is a root, the numerator $${n}$ a power, and its minus sign a reciprocal:`,
                      `指数的分母 $${dd}$ 表示开方，分子 $${n}$ 表示乘方，负号表示取倒数：`,
                    )
                  : t(
                      `The denominator $${dd}$ of the exponent is a root and the numerator $${n}$ a power:`,
                      `指数的分母 $${dd}$ 表示开方，分子 $${n}$ 表示乘方：`,
                    );
          const work = solveLinear(a, c, V);
          return numberProblem({
            prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
            answer: x,
            solveFor: "x",
            wrong: [kq.mul(Q.of(b)).sub(Q.of(c)).div(Q.of(a)), Q.one.div(V).sub(Q.of(c)).div(Q.of(a)), V.add(Q.of(c)).div(Q.of(a))],
            solution: t(
              `${label(1, "Exponential form", "化为指数式").en} The argument equals the base to the power $${num(kq)}$:${steps(eq, `${arg} = ${b}^{${num(kq)}}`)}${label(2, "Evaluate the power", "计算幂").en} ${rule.en}${steps(power)}${label(3, "Solve for $x$", "解出 $x$").en} Now $${arg} = ${num(V)}$; ${work.how.en}:${steps(...work.lines)}**Check.** For $x = ${num(x)}$ the argument is $${evalAt(a, x, c)} = ${num(V)}$, and $${B.of(num(V))} = ${num(kq)}$ because $${b}^{${num(kq)}} = ${num(V)}$.`,
              `${label(1, "Exponential form", "化为指数式")["zh-CN"]} 真数等于底数的 $${num(kq)}$ 次方：${steps(eq, `${arg} = ${b}^{${num(kq)}}`)}${label(2, "Evaluate the power", "计算幂")["zh-CN"]} ${rule["zh-CN"]}${steps(power)}${label(3, "Solve for $x$", "解出 $x$")["zh-CN"]} 现在 $${arg} = ${num(V)}$，${work.how["zh-CN"]}：${steps(...work.lines)}**检验。** $x = ${num(x)}$ 时真数是 $${evalAt(a, x, c)} = ${num(V)}$，而 $${B.of(num(V))} = ${num(kq)}$，因为 $${b}^{${num(kq)}} = ${num(V)}$。`,
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
  encompasses: [{ topic: "solving-logarithmic-equations", weight: 0.6 }],
  xp: 13,
  standards: ["CCSS.HSF.LE.A.4"],
  intro: t(
    `The natural logarithm is the logarithm with base $e \\approx 2.718$: $\\ln u$ means $\\log_{e} u$. So an equation in $\\ln$ is solved exactly like any other logarithmic equation, by writing it in exponential form with base $e$:

$$\\ln u = c \\iff u = e^{c}$$

Take $\\ln x = 2$. It says that $x$ is $e$ to the power $2$:

$$x = e^{2}$$

This is the **exact** solution. The number $e^{2}$ is not a whole number, but it is a perfectly definite number, and we work with it as we would with $\\sqrt{2}$ or $\\pi$: leave it as it is, or approximate it at the very end. A calculator gives $e^{2} \\approx 7.389$, and indeed $\\ln 7.389 \\approx 2$.

In this lesson we write exact solutions such as $x = \\frac{e^{3} + 1}{2}$, isolate the natural logarithm when other operations surround it, and approximate solutions to a given number of decimal places.`,
    `自然对数是以 $e \\approx 2.718$ 为底的对数：$\\ln u$ 表示 $\\log_{e} u$。所以含 $\\ln$ 的方程和其他对数方程的解法完全一样：化为以 $e$ 为底的指数式：

$$\\ln u = c \\iff u = e^{c}$$

看 $\\ln x = 2$。它说的是 $x$ 等于 $e$ 的 $2$ 次方：

$$x = e^{2}$$

这是**精确**解。$e^{2}$ 不是整数，但它是一个完全确定的数，我们像对待 $\\sqrt{2}$ 或 $\\pi$ 一样对待它：保留原样，或者到最后才取近似值。计算器给出 $e^{2} \\approx 7.389$，而确实 $\\ln 7.389 \\approx 2$。

这节课先写出 $x = \\frac{e^{3} + 1}{2}$ 这样的精确解，再在自然对数外面有其他运算时先把它单独留在一边，最后按要求的小数位数求近似解。`,
  ),
  knowledgePoints: [
    {
      id: "exact-solutions",
      title: t("Exact solutions", "精确解"),
      explanation: t(
        `Since $\\ln u = c$ means $u = e^{c}$, an equation in $\\ln$ becomes an equation containing a power of $e$. That power is a number, so solve for $x$ treating it like one: move the constant, then divide.

$$\\ln(2x - 1) = 3 \\implies 2x - 1 = e^{3} \\implies 2x = e^{3} + 1 \\implies x = \\frac{e^{3} + 1}{2}$$

This is the exact solution; it cannot be simplified further, since $e^{3}$ and $1$ are not like terms. Check: $2 \\cdot \\frac{e^{3} + 1}{2} - 1 = e^{3} + 1 - 1 = e^{3}$, and $\\ln e^{3} = 3$.

> **Watch out.** $e^{3}$ is $e \\cdot e \\cdot e$, not $3e$; and $\\ln$ has base $e$, so the power is $e^{3}$, not $10^{3}$. When dividing by $2$, divide the **whole** right side: $\\frac{e^{3} + 1}{2}$, not $\\frac{e^{3}}{2} + 1$.`,
        `因为 $\\ln u = c$ 表示 $u = e^{c}$，含 $\\ln$ 的方程就变成含 $e$ 的幂的方程。这个幂是一个数，把它当作数来解出 $x$：先移常数项，再相除。

$$\\ln(2x - 1) = 3 \\implies 2x - 1 = e^{3} \\implies 2x = e^{3} + 1 \\implies x = \\frac{e^{3} + 1}{2}$$

这就是精确解，不能再化简，因为 $e^{3}$ 和 $1$ 不是同类项。检验：$2 \\cdot \\frac{e^{3} + 1}{2} - 1 = e^{3} + 1 - 1 = e^{3}$，而 $\\ln e^{3} = 3$。

> **注意。** $e^{3}$ 是 $e \\cdot e \\cdot e$，不是 $3e$；$\\ln$ 的底数是 $e$，所以幂是 $e^{3}$，不是 $10^{3}$。除以 $2$ 时要除**整个**右边：$\\frac{e^{3} + 1}{2}$，而不是 $\\frac{e^{3}}{2} + 1$。`,
      ),
      generate(rng) {
        for (;;) {
          const k = rng.nonZero(-3, 5);
          const a = rng.pick([1, 1, 2, 3, 4, 5]);
          const c = rng.int(-9, 9);
          if (a === 1 && c === 0) continue;
          const over = (top: string) => (a === 1 ? top : `\\frac{${top}}{${a}}`);
          const arg = linear(a, c);
          const top = `${ePow(k)}${plusK(-c)}`;
          const answer = over(top);
          const eq = `${lnOf(arg)} = ${k}`;
          const moves = [...(c === 0 ? [] : [undoAdd(c)]), ...(a === 1 ? [] : [undoTimes(a)])];
          const how = joinHow(moves);
          const lines = [...(c === 0 || a === 1 ? [] : [`${a}x = ${top}`]), `x = ${answer}`];
          const back =
            a === 1
              ? `\\left(${top}\\right)${plusK(c)} = ${ePow(k)}`
              : chain(`${a} \\cdot ${answer}${plusK(c)}`, `${top}${plusK(c)}`, ePow(k));
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
            solution: t(
              `${label(1, "Exponential form", "化为指数式").en} The natural logarithm has base $e$, so $\\ln u = ${k}$ means $u = ${ePow(k)}$:${steps(eq, `${arg} = ${ePow(k)}`)}${label(2, "Solve for $x$", "解出 $x$").en} The power $${ePow(k)}$ is a number; ${how.en}, keeping it exact:${steps(...lines)}**Check.** Put the solution into the argument: $${back}$, and $\\ln ${ePow(k)} = ${k}$.`,
              `${label(1, "Exponential form", "化为指数式")["zh-CN"]} 自然对数的底数是 $e$，所以 $\\ln u = ${k}$ 表示 $u = ${ePow(k)}$：${steps(eq, `${arg} = ${ePow(k)}`)}${label(2, "Solve for $x$", "解出 $x$")["zh-CN"]} 幂 $${ePow(k)}$ 是一个数；${how["zh-CN"]}，保留精确形式：${steps(...lines)}**检验。** 把解代入真数：$${back}$，而 $\\ln ${ePow(k)} = ${k}$。`,
            ),
          });
        }
      },
    },
    {
      id: "isolating-the-natural-logarithm",
      title: t("Isolating the natural logarithm", "把自然对数单独留在一边"),
      explanation: t(
        `The exponential form $u = e^{c}$ translates "$\\ln u$ equals a number", so the natural logarithm must stand alone first. Undo the operations around it in reverse order, the added number first, then the factor:

$$3\\ln(x + 2) - 4 = 5 \\implies 3\\ln(x + 2) = 9 \\implies \\ln(x + 2) = 3$$

Only now convert: $x + 2 = e^{3}$, so $x = e^{3} - 2$. Check: $3\\ln e^{3} - 4 = 3 \\cdot 3 - 4 = 5$.

> **Watch out.** Converting too early puts the wrong number in the exponent. Writing $x + 2 = e^{5}$ straight from the equation ignores the $3$ and the $-4$, and writing $x + 2 = e^{9}$ from $3\\ln(x + 2) = 9$ forgets to divide by $3$. The exponent is the value of $\\ln(x + 2)$ alone.`,
        `指数式 $u = e^{c}$ 翻译的是"$\\ln u$ 等于一个数"，所以要先让自然对数单独留在一边。按相反的顺序撤销它外面的运算：先去掉加上的数，再去掉系数：

$$3\\ln(x + 2) - 4 = 5 \\implies 3\\ln(x + 2) = 9 \\implies \\ln(x + 2) = 3$$

这时才化为指数式：$x + 2 = e^{3}$，所以 $x = e^{3} - 2$。检验：$3\\ln e^{3} - 4 = 3 \\cdot 3 - 4 = 5$。

> **注意。** 过早化为指数式会把错误的数放进指数。由原方程直接写出 $x + 2 = e^{5}$，忽略了 $3$ 和 $-4$；由 $3\\ln(x + 2) = 9$ 写出 $x + 2 = e^{9}$，忘了除以 $3$。指数只能是 $\\ln(x + 2)$ 单独的值。`,
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
          const how = joinHow([...(d === 0 ? [] : [undoAdd(d)]), undoTimes(p)]);
          return expressionProblem({
            prompt: t(`Solve $${lhs} = ${e}$. Give the exact solution.`, `解方程 $${lhs} = ${e}$，给出精确解。`),
            answer,
            prefix: "x =",
            wrong: [`${ePow(e)}${plusK(-c)}`, `${ePow(e - d)}${plusK(-c)}`, `${ePow(k)}${plusK(c)}`, `${k}e${plusK(-c)}`],
            solution: t(
              `${label(1, "Isolate the logarithm", "把对数单独留在一边").en} To leave $${lnOf(arg)}$ alone, ${how.en}:${steps(`${lhs} = ${e}`, ...(d === 0 ? [] : [`${coefL(p)}${lnOf(arg)} = ${e - d}`]), `${lnOf(arg)} = ${k}`)}${label(2, "Exponential form", "化为指数式").en} Now $\\ln u = ${k}$ means $u = ${ePow(k)}$:${steps(`${arg} = ${ePow(k)}`, ...(c === 0 ? [] : [`x = ${answer}`]))}**Check.** The argument is then $${ePow(k)}$, and $\\ln ${ePow(k)} = ${k}$, so the left side is $${p === -1 ? `-(${k})` : `${p} \\cdot ${paren(k)}`}${plusK(d)} = ${e}$.`,
              `${label(1, "Isolate the logarithm", "把对数单独留在一边")["zh-CN"]} 要让 $${lnOf(arg)}$ 单独留下，${how["zh-CN"]}：${steps(`${lhs} = ${e}`, ...(d === 0 ? [] : [`${coefL(p)}${lnOf(arg)} = ${e - d}`]), `${lnOf(arg)} = ${k}`)}${label(2, "Exponential form", "化为指数式")["zh-CN"]} 现在 $\\ln u = ${k}$ 表示 $u = ${ePow(k)}$：${steps(`${arg} = ${ePow(k)}`, ...(c === 0 ? [] : [`x = ${answer}`]))}**检验。** 这时真数是 $${ePow(k)}$，$\\ln ${ePow(k)} = ${k}$，所以左边是 $${p === -1 ? `-(${k})` : `${p} \\cdot ${paren(k)}`}${plusK(d)} = ${e}$。`,
            ),
          });
        }
      },
    },
    {
      id: "approximate-solutions-with-ln",
      title: t("Approximate solutions", "近似解"),
      explanation: t(
        `To approximate the solution, solve exactly first, then put in a decimal value of the power of $e$, and round only at the very end:

$$\\ln(2x + 3) = 1.5 \\implies 2x + 3 = e^{1.5} \\approx 4.4817 \\implies x \\approx \\frac{4.4817 - 3}{2} = 0.74085 \\approx 0.74$$

Rounding $e^{1.5}$ to $4.5$ first would give $x \\approx 0.75$, a different answer to the nearest hundredth. Check: $2(0.74) + 3 = 4.48$, close to $e^{1.5}$.

> **Watch out.** The argument equals $e^{1.5}$, not $1.5$: solving $2x + 3 = 1.5$ forgets to convert. And follow the order of operations: subtract $3$ **before** dividing by $2$, since $\\frac{4.4817 - 3}{2}$ is not $\\frac{4.4817}{2} - 3$.`,
        `求近似解时，先精确求解，再代入 $e$ 的幂的小数值，只在最后一步取近似：

$$\\ln(2x + 3) = 1.5 \\implies 2x + 3 = e^{1.5} \\approx 4.4817 \\implies x \\approx \\frac{4.4817 - 3}{2} = 0.74085 \\approx 0.74$$

如果先把 $e^{1.5}$ 近似成 $4.5$，会得到 $x \\approx 0.75$，精确到百分位时就不同了。检验：$2(0.74) + 3 = 4.48$，接近 $e^{1.5}$。

> **注意。** 真数等于 $e^{1.5}$，不是 $1.5$：解 $2x + 3 = 1.5$ 是忘了化为指数式。还要注意运算顺序：先减 $3$，**再**除以 $2$，$\\frac{4.4817 - 3}{2}$ 不等于 $\\frac{4.4817}{2} - 3$。`,
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
          const exact = a === 1 ? `e^{${kL}}${plusK(-c)}` : `\\frac{e^{${kL}}${plusK(-c)}}{${a}}`;
          const approx = a === 1 ? `${dec(E)}${plusK(-c)}` : `\\frac{${dec(E)}${plusK(-c)}}{${a}}`;
          const back = answer.mul(Q.of(a)).add(Q.of(c));
          const v4 = rounded(v.toNumber(), 4) ?? Q.of(Math.round(v.toNumber() * 1e4), 1e4);
          return numberProblem({
            prompt: t(
              `Solve $${lnOf(arg)} = ${kL}$. Use $e^{${kL}} \\approx ${dec(E)}$ and give $x$ to the nearest hundredth.`,
              `解方程 $${lnOf(arg)} = ${kL}$。利用 $e^{${kL}} \\approx ${dec(E)}$，求 $x$（精确到百分位）。`,
            ),
            answer,
            form: "decimal",
            solveFor: "x",
            wrong: defined(rounded((k.toNumber() - c) / a, 2), rounded((E.toNumber() + c) / a, 2), rounded(E.toNumber() / a - c, 2)),
            solution: t(
              `${label(1, "Solve exactly", "精确求解").en} Write the equation in exponential form and solve for $x$, keeping the power of $e$:${steps(`${arg} = e^{${kL}}`, `x = ${exact}`)}${label(2, "Approximate", "取近似值").en} Put in $e^{${kL}} \\approx ${dec(E)}$, and round only the final result:${steps(`x \\approx ${approx} ${v4.eq(v) ? "=" : "\\approx"} ${dec(v4)} \\approx ${dec(answer)}`)}**Check.** With $x = ${dec(answer)}$ the argument is $${a === 1 ? dec(answer) : `${a}(${dec(answer)})`}${plusK(c)} = ${dec(back)}$, close to $e^{${kL}} \\approx ${dec(E)}$.`,
              `${label(1, "Solve exactly", "精确求解")["zh-CN"]} 化为指数式，保留 $e$ 的幂，解出 $x$：${steps(`${arg} = e^{${kL}}`, `x = ${exact}`)}${label(2, "Approximate", "取近似值")["zh-CN"]} 代入 $e^{${kL}} \\approx ${dec(E)}$，只对最后结果取近似：${steps(`x \\approx ${approx} ${v4.eq(v) ? "=" : "\\approx"} ${dec(v4)} \\approx ${dec(answer)}`)}**检验。** $x = ${dec(answer)}$ 时真数是 $${a === 1 ? dec(answer) : `${a}(${dec(answer)})`}${plusK(c)} = ${dec(back)}$，接近 $e^{${kL}} \\approx ${dec(E)}$。`,
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
    { topic: "solving-quadratic-equations-by-factoring", weight: 0.3 },
  ],
  xp: 16,
  standards: ["CCSS.HSF.LE.A.4", "CCSS.HSA.REI.A.2"],
  intro: t(
    `We can solve an equation in which **one** logarithm equals a number. When an equation has two logarithms of the same base, the laws of logarithms combine them into one:

$$\\log_{b} M + \\log_{b} N = \\log_{b} MN, \\qquad \\log_{b} M - \\log_{b} N = \\log_{b} \\frac{M}{N}, \\qquad p\\log_{b} M = \\log_{b} M^{p}$$

For example, $\\log_{2} x + \\log_{2} 4 = 5$ becomes $\\log_{2} 4x = 5$, so $4x = 2^{5} = 32$ and $x = 8$.

There is a catch. Each law holds only when every logarithm in it is defined, that is, when $M$ and $N$ are positive. The combined equation can be defined where the original is not: $\\log_{2} x(x - 3)$ makes sense for $x = -1$, since $(-1)(-4) = 4$, but $\\log_{2}(-1)$ and $\\log_{2}(-4)$ do not. So solving the combined equation gives **candidates**, and each candidate must be put back into the original equation; one that makes an argument zero or negative is rejected.

In this lesson we solve equations with a sum of logarithms, a difference of logarithms, and a power, checking candidates every time.`,
    `我们已经会解**一个**对数等于一个数的方程。当方程中有两个同底数的对数时，对数运算法则能把它们合并成一个：

$$\\log_{b} M + \\log_{b} N = \\log_{b} MN, \\qquad \\log_{b} M - \\log_{b} N = \\log_{b} \\frac{M}{N}, \\qquad p\\log_{b} M = \\log_{b} M^{p}$$

例如 $\\log_{2} x + \\log_{2} 4 = 5$ 变为 $\\log_{2} 4x = 5$，所以 $4x = 2^{5} = 32$，$x = 8$。

但要当心：每条法则只在其中每个对数都有意义，也就是 $M$、$N$ 都为正时才成立。合并后的方程可能在原方程无意义的地方有意义：$x = -1$ 时 $\\log_{2} x(x - 3)$ 有意义，因为 $(-1)(-4) = 4$，但 $\\log_{2}(-1)$ 和 $\\log_{2}(-4)$ 都无意义。所以解合并后的方程得到的是**候选解**，每个候选解都要代回原方程；使某个真数为零或负数的候选解要舍去。

这节课解含对数之和、对数之差和幂的方程，每次都要检验候选解。`,
  ),
  knowledgePoints: [
    {
      id: "product-rule-equations",
      title: t("Sums of logarithms", "对数的和"),
      explanation: t(
        `A sum of two logarithms with the same base is the logarithm of the product, so the product rule turns the equation into one logarithm equal to a number:

$$\\log_{2} x + \\log_{2}(x - 2) = 3 \\implies \\log_{2} x(x - 2) = 3 \\implies x(x - 2) = 2^{3} = 8$$

Expanding gives a quadratic equation, solved by factoring:

$$x^{2} - 2x - 8 = 0 \\implies (x - 4)(x + 2) = 0 \\implies x = 4 \\text{ or } x = -2$$

These are candidates. For $x = -2$ the original equation contains $\\log_{2}(-2)$, which is not defined, so $x = -2$ is rejected. For $x = 4$ both arguments, $4$ and $2$, are positive, and $\\log_{2} 4 + \\log_{2} 2 = 2 + 1 = 3$. The only solution is $x = 4$.

> **Watch out.** Check candidates in the **original** equation, not in the combined one: $x = -2$ makes $x(x - 2) = 8$ positive, yet each of $\\log_{2}(-2)$ and $\\log_{2}(-4)$ is undefined. Giving both values, or only the rejected one, misses this.`,
        `同底数的两个对数之和等于积的对数，所以用积的法则可以把方程化成一个对数等于一个数：

$$\\log_{2} x + \\log_{2}(x - 2) = 3 \\implies \\log_{2} x(x - 2) = 3 \\implies x(x - 2) = 2^{3} = 8$$

展开得到一个二次方程，用因式分解求解：

$$x^{2} - 2x - 8 = 0 \\implies (x - 4)(x + 2) = 0 \\implies x = 4 \\text{ 或 } x = -2$$

这两个是候选解。$x = -2$ 时原方程中出现 $\\log_{2}(-2)$，无意义，所以舍去 $x = -2$。$x = 4$ 时两个真数 $4$ 和 $2$ 都是正数，且 $\\log_{2} 4 + \\log_{2} 2 = 2 + 1 = 3$。唯一的解是 $x = 4$。

> **注意。** 要在**原方程**中检验候选解，而不是在合并后的方程中：$x = -2$ 使 $x(x - 2) = 8$ 为正，但 $\\log_{2}(-2)$ 和 $\\log_{2}(-4)$ 都无意义。把两个值都写上，或者只写被舍去的那个，都是没有注意到这一点。`,
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
          const quad = `${poly([1, "x^{2}"], [a, "x"], [-P, ""])} = 0`;
          return solutionsProblem({
            prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
            values: [sol(r)],
            wrong: [[sol(r), sol(-s)], [sol(-s)], [sol(P)]],
            solution: t(
              `${label(1, "Combine", "合并").en} The sum of two logarithms with the same base is the logarithm of the product:${steps(`${B.of(`x(${linear(1, a)})`)} = ${k}`)}${label(2, "Exponential form", "化为指数式").en} One logarithm equals a number, so its argument is $${B.b}^{${k}} = ${P}$. Expand and factor the quadratic:${steps(`x(${linear(1, a)}) = ${P}`, quad, `(${linear(1, -r)})(${linear(1, s)}) = 0`, orList([r, -s]))}${label(3, "Check the candidates", "检验候选解").en} For $x = ${-s}$ the argument $x$ of $${B.of("x")}$ is negative, so the original equation is not defined there and $x = ${-s}$ is rejected. For $x = ${r}$ the arguments are $${r}$ and $${s}$, both positive.

**Check.** $${B.of(String(r))} + ${B.of(String(s))} = ${B.of(`${r} \\cdot ${s}`)} = ${B.of(String(P))} = ${k}$. The solution is $x = ${r}$.`,
              `${label(1, "Combine", "合并")["zh-CN"]} 同底数的两个对数之和等于积的对数：${steps(`${B.of(`x(${linear(1, a)})`)} = ${k}`)}${label(2, "Exponential form", "化为指数式")["zh-CN"]} 一个对数等于一个数，所以真数等于 $${B.b}^{${k}} = ${P}$。展开后因式分解：${steps(`x(${linear(1, a)}) = ${P}`, quad, `(${linear(1, -r)})(${linear(1, s)}) = 0`, orListZh([r, -s]))}${label(3, "Check the candidates", "检验候选解")["zh-CN"]} $x = ${-s}$ 时 $${B.of("x")}$ 的真数 $x$ 为负数，原方程无意义，所以舍去 $x = ${-s}$。$x = ${r}$ 时两个真数是 $${r}$ 和 $${s}$，都是正数。

**检验。** $${B.of(String(r))} + ${B.of(String(s))} = ${B.of(`${r} \\cdot ${s}`)} = ${B.of(String(P))} = ${k}$。方程的解是 $x = ${r}$。`,
            ),
          });
        }
      },
    },
    {
      id: "quotient-rule-equations",
      title: t("Differences of logarithms", "对数的差"),
      explanation: t(
        `A difference of two logarithms with the same base is the logarithm of the quotient. After the quotient rule and the exponential form, the equation has a fraction; multiply both sides by the denominator to clear it:

$$\\log_{3}(x + 14) - \\log_{3}(x - 2) = 2 \\implies \\frac{x + 14}{x - 2} = 3^{2} = 9$$

$$x + 14 = 9(x - 2) = 9x - 18 \\implies 32 = 8x \\implies x = 4$$

Then check the candidate in the original equation: for $x = 4$ the arguments are $18$ and $2$, both positive, and $\\log_{3} 18 - \\log_{3} 2 = \\log_{3} 9 = 2$.

> **Watch out.** The quotient rule divides the arguments, it does not subtract them: $(x + 14) - (x - 2) = 9$ is not what the equation says. And when clearing the fraction, multiply the **whole** denominator by $9$: $9(x - 2) = 9x - 18$, not $9x - 2$.`,
        `同底数的两个对数之差等于商的对数。用商的法则合并、化为指数式之后，方程中出现分式；两边同乘分母把它去掉：

$$\\log_{3}(x + 14) - \\log_{3}(x - 2) = 2 \\implies \\frac{x + 14}{x - 2} = 3^{2} = 9$$

$$x + 14 = 9(x - 2) = 9x - 18 \\implies 32 = 8x \\implies x = 4$$

再在原方程中检验这个候选解：$x = 4$ 时两个真数是 $18$ 和 $2$，都是正数，并且 $\\log_{3} 18 - \\log_{3} 2 = \\log_{3} 9 = 2$。

> **注意。** 商的法则是把真数相除，而不是相减：方程说的不是 $(x + 14) - (x - 2) = 9$。去分母时要用 $9$ 乘**整个**分母：$9(x - 2) = 9x - 18$，而不是 $9x - 2$。`,
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
          const collect = `${poly([mm - P, "x"])} = ${-P * d - c}`;
          const tail = mm - P === 1 ? [] : [`x = ${x}`];
          const [u, v] = [mm * x + c, x - d];
          return numberProblem({
            prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
            answer: x,
            solveFor: "x",
            wrong: [Q.of(-d - c, mm - P), ...(mm !== k ? [Q.of(-k * d - c, mm - k)] : []), ...(mm !== 1 ? [Q.of(k - c - d, mm - 1)] : [])],
            solution: t(
              `${label(1, "Combine and convert", "合并并化为指数式").en} The difference of two logarithms with the same base is the logarithm of the quotient. Then one logarithm equals a number, so its argument is $${B.b}^{${k}} = ${P}$:${steps(`${B.of(`\\frac{${top}}{${bottom}}`)} = ${k}`, `\\frac{${top}}{${bottom}} = ${P}`)}${label(2, "Clear the fraction", "去分母").en} Multiply both sides by $${bottom}$, distribute, and collect the terms in $x$ on the left:${steps(`${top} = ${P}(${bottom})`, `${top} = ${linear(P, -P * d)}`, collect, ...tail)}${label(3, "Check the candidate", "检验候选解").en} For $x = ${x}$ the arguments are $${u}$ and $${v}$, both positive, so the original equation is defined.

**Check.** $${B.of(String(u))} - ${B.of(String(v))} = ${B.of(`\\frac{${u}}{${v}}`)} = ${B.of(String(P))} = ${k}$.`,
              `${label(1, "Combine and convert", "合并并化为指数式")["zh-CN"]} 同底数的两个对数之差等于商的对数。这样就是一个对数等于一个数，所以真数等于 $${B.b}^{${k}} = ${P}$：${steps(`${B.of(`\\frac{${top}}{${bottom}}`)} = ${k}`, `\\frac{${top}}{${bottom}} = ${P}`)}${label(2, "Clear the fraction", "去分母")["zh-CN"]} 两边同乘 $${bottom}$，展开，再把含 $x$ 的项移到左边：${steps(`${top} = ${P}(${bottom})`, `${top} = ${linear(P, -P * d)}`, collect, ...tail)}${label(3, "Check the candidate", "检验候选解")["zh-CN"]} $x = ${x}$ 时两个真数是 $${u}$ 和 $${v}$，都是正数，所以原方程有意义。

**检验。** $${B.of(String(u))} - ${B.of(String(v))} = ${B.of(`\\frac{${u}}{${v}}`)} = ${B.of(String(P))} = ${k}$。`,
            ),
          });
        }
      },
    },
    {
      id: "power-rule-equations",
      title: t("The power rule and lost solutions", "幂的法则与解的个数"),
      explanation: t(
        `The power rule $\\log_{b} x^{p} = p\\log_{b} x$ holds only when $x > 0$, because the right side needs $\\log_{b} x$ to be defined. So two equations that look alike can have different solutions. In $\\log_{3}(x^{2}) = 4$ the argument is $x^{2}$, positive for every $x \\ne 0$:

$$\\log_{3}(x^{2}) = 4 \\implies x^{2} = 3^{4} = 81 \\implies x = 9 \\text{ or } x = -9$$

Both are solutions, since $(-9)^{2} = 81$ and $\\log_{3} 81 = 4$. But in $2\\log_{3} x = 4$ the argument is $x$ itself:

$$2\\log_{3} x = 4 \\implies \\log_{3} x = 2 \\implies x = 3^{2} = 9$$

and $x = -9$ is not a solution, since $\\log_{3}(-9)$ is not defined. A cube behaves differently again: $x^{3} = 27$ has the single real solution $x = 3$.

> **Watch out.** Look at what the logarithm is taken of. When the argument is $x^{2}$, do not lose the negative solution; when the argument is $x$, do not add one. And $x^{2} = 3^{4}$ gives $x = \\pm 9$, not $x = 3^{4} = 81$: take the square root.`,
        `幂的法则 $\\log_{b} x^{p} = p\\log_{b} x$ 只在 $x > 0$ 时成立，因为右边要求 $\\log_{b} x$ 有意义。所以两个看起来相似的方程可能有不同的解。在 $\\log_{3}(x^{2}) = 4$ 中真数是 $x^{2}$，对每个 $x \\ne 0$ 都是正数：

$$\\log_{3}(x^{2}) = 4 \\implies x^{2} = 3^{4} = 81 \\implies x = 9 \\text{ 或 } x = -9$$

两个都是解，因为 $(-9)^{2} = 81$，$\\log_{3} 81 = 4$。但在 $2\\log_{3} x = 4$ 中真数就是 $x$ 本身：

$$2\\log_{3} x = 4 \\implies \\log_{3} x = 2 \\implies x = 3^{2} = 9$$

$x = -9$ 不是解，因为 $\\log_{3}(-9)$ 无意义。立方又不一样：$x^{3} = 27$ 只有一个实数解 $x = 3$。

> **注意。** 看清对数取的是什么的对数。真数是 $x^{2}$ 时，不要丢掉负数解；真数是 $x$ 时，不要多出负数解。另外，$x^{2} = 3^{4}$ 得 $x = \\pm 9$，而不是 $x = 3^{4} = 81$：要开平方。`,
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
          const note = tenNote(B);
          const inv = `${B.of(num(Vp))} = ${p * k}`;
          return solutionsProblem({
            prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
            values,
            wrong: [[sol(V)], [sol(V), sol(V.neg())], [sol(Q.of(B.b).pow(p * k))], [sol(Q.of(k))]],
            solution: inside
              ? t(
                  `${label(1, "Exponential form", "化为指数式").en} The logarithm of $x^{${p}}$ equals a number${note.en}, so $x^{${p}}$ is the base to that power:${steps(eq, `x^{${p}} = ${B.b}^{${p * k}} = ${num(Vp)}`)}${label(2, p === 2 ? "Take square roots" : "Take the cube root", p === 2 ? "开平方" : "开立方").en} ${p === 2 ? `A positive number has two square roots:${steps(orList([V, V.neg()]))}The argument of the logarithm is $x^{2}$, which is $${num(Vp)} > 0$ for both values, so neither is rejected.` : `A number has exactly one real cube root:${steps(`x = ${num(V)}`)}The argument $x^{3}$ is then $${num(Vp)} > 0$.`}

**Check.** ${p === 2 ? `Both $${powBase(V)}^{2}$ and $${powBase(V.neg())}^{2}$ equal $${num(Vp)}$, and` : `$${powBase(V)}^{3} = ${num(Vp)}$, and`} $${inv}$ because $${B.b}^{${p * k}} = ${num(Vp)}$.`,
                  `${label(1, "Exponential form", "化为指数式")["zh-CN"]} $x^{${p}}$ 的对数等于一个数${note["zh-CN"]}，所以 $x^{${p}}$ 等于底数的这个数次方：${steps(eq, `x^{${p}} = ${B.b}^{${p * k}} = ${num(Vp)}`)}${label(2, p === 2 ? "Take square roots" : "Take the cube root", p === 2 ? "开平方" : "开立方")["zh-CN"]} ${p === 2 ? `正数有两个平方根：${steps(orListZh([V, V.neg()]))}对数的真数是 $x^{2}$，对这两个值都等于 $${num(Vp)} > 0$，所以都不舍去。` : `一个数只有一个实数立方根：${steps(`x = ${num(V)}`)}这时真数 $x^{3} = ${num(Vp)} > 0$。`}

**检验。** ${p === 2 ? `$${powBase(V)}^{2}$ 和 $${powBase(V.neg())}^{2}$ 都等于 $${num(Vp)}$，而` : `$${powBase(V)}^{3} = ${num(Vp)}$，而`} $${inv}$，因为 $${B.b}^{${p * k}} = ${num(Vp)}$。`,
                )
              : t(
                  `${label(1, "Isolate the logarithm", "把对数单独留在一边").en} Divide both sides by $${p}$:${steps(eq, `${B.of("x")} = ${k}`)}${label(2, "Exponential form", "化为指数式").en} One logarithm equals a number${note.en}:${steps(`x = ${B.b}^{${k}} = ${num(V)}`)}The argument here is $x$ itself, and $${B.of("x")}$ is defined only for $x > 0$, so there is no negative solution: $${B.of(`-${wrapArg(num(V))}`)}$ would not be defined.

**Check.** $${p}${B.of(num(V))} = ${p} \\cdot ${paren(k)} = ${p * k}$.`,
                  `${label(1, "Isolate the logarithm", "把对数单独留在一边")["zh-CN"]} 两边同时除以 $${p}$：${steps(eq, `${B.of("x")} = ${k}`)}${label(2, "Exponential form", "化为指数式")["zh-CN"]} 一个对数等于一个数${note["zh-CN"]}：${steps(`x = ${B.b}^{${k}} = ${num(V)}`)}这里的真数就是 $x$ 本身，$${B.of("x")}$ 只在 $x > 0$ 时有意义，所以没有负数解：$${B.of(`-${wrapArg(num(V))}`)}$ 无意义。

**检验。** $${p}${B.of(num(V))} = ${p} \\cdot ${paren(k)} = ${p * k}$。`,
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
  intro: t(
    `Each law of logarithms merges two logarithms or moves a coefficient. An equation with three logarithms, or with a coefficient in front of one, needs several laws in a row, and the order matters: the product and quotient rules combine $\\log_{b} M$ and $\\log_{b} N$ only when both stand without a coefficient. So the plan is always the same:

1. Move every coefficient into its argument with the power rule, $p\\log_{b} M = \\log_{b} M^{p}$.
2. Combine sums with the product rule and differences with the quotient rule, until one logarithm is left.
3. Write the equation in exponential form, solve, and check each candidate in the original equation.

For example, in $\\log_{3}(x + 1) + \\log_{3} 6 - \\log_{3} 2 = 2$ there are no coefficients, and the three logarithms combine into one:

$$\\log_{3} \\frac{6(x + 1)}{2} = 2 \\implies 3(x + 1) = 3^{2} = 9 \\implies x = 2$$

For $x = 2$ the argument $x + 1 = 3$ is positive, and indeed $\\log_{3} 3 + \\log_{3} 6 - \\log_{3} 2 = \\log_{3} 9 = 2$.

In this lesson we combine a power with a sum or a difference, three logarithms, and a power with a linear argument, where a quadratic equation appears.`,
    `每条对数运算法则要么把两个对数合并，要么移动一个系数。含三个对数、或者某个对数前面有系数的方程，需要连续使用几条法则，而且顺序很重要：只有当 $\\log_{b} M$ 和 $\\log_{b} N$ 前面都没有系数时，才能用积或商的法则合并它们。所以步骤总是一样的：

1. 用幂的法则 $p\\log_{b} M = \\log_{b} M^{p}$ 把每个系数移进真数。
2. 和用积的法则、差用商的法则合并，直到只剩一个对数。
3. 化为指数式，求解，并在原方程中检验每个候选解。

例如 $\\log_{3}(x + 1) + \\log_{3} 6 - \\log_{3} 2 = 2$ 中没有系数，三个对数合并成一个：

$$\\log_{3} \\frac{6(x + 1)}{2} = 2 \\implies 3(x + 1) = 3^{2} = 9 \\implies x = 2$$

$x = 2$ 时真数 $x + 1 = 3$ 为正，而且确实 $\\log_{3} 3 + \\log_{3} 6 - \\log_{3} 2 = \\log_{3} 9 = 2$。

这节课把幂与和或差结合起来，合并三个对数，最后处理幂与一次式真数的组合，这时会出现二次方程。`,
  ),
  knowledgePoints: [
    {
      id: "power-and-quotient",
      title: t("Powers with sums and differences", "幂与和、差"),
      explanation: t(
        `A coefficient blocks the product and quotient rules, so first move it into the argument with the power rule. Then combine:

$$2\\log_{3} x - \\log_{3} 4 = 2 \\implies \\log_{3} x^{2} - \\log_{3} 4 = 2 \\implies \\log_{3} \\frac{x^{2}}{4} = 2$$

In exponential form, $\\frac{x^{2}}{4} = 3^{2} = 9$, so $x^{2} = 36$ and $x = 6$ or $x = -6$.

The original equation contains $\\log_{3} x$, which needs $x > 0$, so $x = -6$ is rejected. The power rule is what let the negative candidate in: $\\log_{3} x^{2}$ is defined for $x = -6$, but $2\\log_{3} x$ is not. Check: $2\\log_{3} 6 - \\log_{3} 4 = \\log_{3} \\frac{36}{4} = \\log_{3} 9 = 2$.

> **Watch out.** Finish the square root: $x^{2} = 36$ gives $x = 6$, not $x = 36$. Then reject the negative root, because the original $\\log_{3} x$ is not defined for it, even though $x^{2}$ is positive.`,
        `系数会挡住积和商的法则，所以先用幂的法则把它移进真数，再合并：

$$2\\log_{3} x - \\log_{3} 4 = 2 \\implies \\log_{3} x^{2} - \\log_{3} 4 = 2 \\implies \\log_{3} \\frac{x^{2}}{4} = 2$$

化为指数式，$\\frac{x^{2}}{4} = 3^{2} = 9$，所以 $x^{2} = 36$，$x = 6$ 或 $x = -6$。

原方程含有 $\\log_{3} x$，要求 $x > 0$，所以舍去 $x = -6$。负的候选解正是幂的法则引进来的：$x = -6$ 时 $\\log_{3} x^{2}$ 有意义，但 $2\\log_{3} x$ 无意义。检验：$2\\log_{3} 6 - \\log_{3} 4 = \\log_{3} \\frac{36}{4} = \\log_{3} 9 = 2$。

> **注意。** 要把平方根开完：$x^{2} = 36$ 得 $x = 6$，而不是 $x = 36$。然后舍去负根，因为原方程中的 $\\log_{3} x$ 对它无意义，尽管 $x^{2}$ 是正数。`,
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
          const back = minus ? `\\frac{${num(X2)}}{${mm}}` : `${mm} \\cdot ${num(X2)}`;
          const rule = minus ? t("quotient", "商") : t("product", "积");
          return solutionsProblem({
            prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
            values: [sol(r)],
            wrong: [[sol(r), sol(r.neg())], [sol(X2)], [sol(r.mul(Q.of(2)))]],
            solution: t(
              `${label(1, "Power rule", "幂的法则").en} Move the coefficient $2$ into the argument, so that no logarithm has a coefficient:${steps(`${B.of("x^{2}")} ${sign} ${B.of(String(mm))} = ${k}`)}${label(2, "Combine and convert", "合并并化为指数式").en} The ${rule.en} rule leaves one logarithm, whose argument is $${B.b}^{${k}} = ${P}$:${steps(`${B.of(comb)} = ${k}`, `${comb} = ${P}`, `x^{2} = ${num(X2)}`, orList([r, r.neg()]))}${label(3, "Check the candidates", "检验候选解").en} The original equation contains $${B.of("x")}$, which needs $x > 0$, so $x = ${num(r.neg())}$ is rejected.

**Check.** $2${B.of(num(r))} ${sign} ${B.of(String(mm))} = ${B.of(back)} = ${B.of(String(P))} = ${k}$, since $${powBase(r)}^{2} = ${num(X2)}$. The solution is $x = ${num(r)}$.`,
              `${label(1, "Power rule", "幂的法则")["zh-CN"]} 把系数 $2$ 移进真数，使每个对数前面都没有系数：${steps(`${B.of("x^{2}")} ${sign} ${B.of(String(mm))} = ${k}`)}${label(2, "Combine and convert", "合并并化为指数式")["zh-CN"]} 用${rule["zh-CN"]}的法则合并成一个对数，它的真数等于 $${B.b}^{${k}} = ${P}$：${steps(`${B.of(comb)} = ${k}`, `${comb} = ${P}`, `x^{2} = ${num(X2)}`, orListZh([r, r.neg()]))}${label(3, "Check the candidates", "检验候选解")["zh-CN"]} 原方程含有 $${B.of("x")}$，要求 $x > 0$，所以舍去 $x = ${num(r.neg())}$。

**检验。** $2${B.of(num(r))} ${sign} ${B.of(String(mm))} = ${B.of(back)} = ${B.of(String(P))} = ${k}$，因为 $${powBase(r)}^{2} = ${num(X2)}$。方程的解是 $x = ${num(r)}$。`,
            ),
          });
        }
      },
    },
    {
      id: "three-logarithms",
      title: t("Three logarithms", "三个对数"),
      explanation: t(
        `With three logarithms on one side, combine them all into one: every logarithm added goes into the numerator, every logarithm subtracted into the denominator.

$$\\log_{2} x + \\log_{2}(x + 2) - \\log_{2} 3 = 3 \\implies \\log_{2} \\frac{x(x + 2)}{3} = 3 \\implies \\frac{x(x + 2)}{3} = 2^{3} = 8$$

Multiply by $3$ and solve the quadratic:

$$x^{2} + 2x = 24 \\implies x^{2} + 2x - 24 = 0 \\implies (x - 4)(x + 6) = 0$$

The candidate $x = -6$ makes $\\log_{2} x$ not defined, so the solution is $x = 4$. Check: $\\log_{2} 4 + \\log_{2} 6 - \\log_{2} 3 = \\log_{2} \\frac{24}{3} = \\log_{2} 8 = 3$.

> **Watch out.** The logarithm being subtracted divides the whole product: $\\frac{x(x + 2)}{3} = 8$ means $x(x + 2) = 8 \\cdot 3 = 24$, not $8 - 3$. And reject the negative candidate: both $x$ and $x + 2$ must be positive.`,
        `一边有三个对数时，把它们全部合并成一个：加上的对数进分子，减去的对数进分母。

$$\\log_{2} x + \\log_{2}(x + 2) - \\log_{2} 3 = 3 \\implies \\log_{2} \\frac{x(x + 2)}{3} = 3 \\implies \\frac{x(x + 2)}{3} = 2^{3} = 8$$

两边乘以 $3$，解二次方程：

$$x^{2} + 2x = 24 \\implies x^{2} + 2x - 24 = 0 \\implies (x - 4)(x + 6) = 0$$

候选解 $x = -6$ 使 $\\log_{2} x$ 无意义，所以方程的解是 $x = 4$。检验：$\\log_{2} 4 + \\log_{2} 6 - \\log_{2} 3 = \\log_{2} \\frac{24}{3} = \\log_{2} 8 = 3$。

> **注意。** 被减去的对数要除整个乘积：$\\frac{x(x + 2)}{3} = 8$ 表示 $x(x + 2) = 8 \\cdot 3 = 24$，而不是 $8 - 3$。还要舍去负的候选解：$x$ 和 $x + 2$ 都必须为正。`,
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
          const Pk = B.b ** k;
          return solutionsProblem({
            prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
            values: [sol(r)],
            wrong: [[sol(r), sol(-s)], [sol(-s)]],
            solution: t(
              `${label(1, "Combine", "合并").en} The two logarithms added go into the numerator and the one subtracted into the denominator:${steps(`${B.of(`\\frac{x(${linear(1, a)})}{${mm}}`)} = ${k}`)}${label(2, "Exponential form", "化为指数式").en} The argument is $${B.b}^{${k}} = ${Pk}$; multiply both sides by $${mm}$, expand and factor:${steps(`\\frac{x(${linear(1, a)})}{${mm}} = ${Pk}`, `x(${linear(1, a)}) = ${mm} \\cdot ${Pk} = ${P}`, `${poly([1, "x^{2}"], [a, "x"], [-P, ""])} = 0`, `(${linear(1, -r)})(${linear(1, s)}) = 0`, orList([r, -s]))}${label(3, "Check the candidates", "检验候选解").en} $x = ${-s}$ makes the argument of $${B.of("x")}$ negative, so it is rejected. For $x = ${r}$ the arguments $${r}$ and $${s}$ are positive.

**Check.** $${B.of(String(r))} + ${B.of(String(s))} - ${B.of(String(mm))} = ${B.of(`\\frac{${r} \\cdot ${s}}{${mm}}`)} = ${B.of(String(Pk))} = ${k}$. The solution is $x = ${r}$.`,
              `${label(1, "Combine", "合并")["zh-CN"]} 加上的两个对数进分子，减去的对数进分母：${steps(`${B.of(`\\frac{x(${linear(1, a)})}{${mm}}`)} = ${k}`)}${label(2, "Exponential form", "化为指数式")["zh-CN"]} 真数等于 $${B.b}^{${k}} = ${Pk}$；两边乘以 $${mm}$，展开后因式分解：${steps(`\\frac{x(${linear(1, a)})}{${mm}} = ${Pk}`, `x(${linear(1, a)}) = ${mm} \\cdot ${Pk} = ${P}`, `${poly([1, "x^{2}"], [a, "x"], [-P, ""])} = 0`, `(${linear(1, -r)})(${linear(1, s)}) = 0`, orListZh([r, -s]))}${label(3, "Check the candidates", "检验候选解")["zh-CN"]} $x = ${-s}$ 使 $${B.of("x")}$ 的真数为负，应舍去。$x = ${r}$ 时真数 $${r}$ 和 $${s}$ 都是正数。

**检验。** $${B.of(String(r))} + ${B.of(String(s))} - ${B.of(String(mm))} = ${B.of(`\\frac{${r} \\cdot ${s}}{${mm}}`)} = ${B.of(String(Pk))} = ${k}$。方程的解是 $x = ${r}$。`,
            ),
          });
        }
      },
    },
    {
      id: "coefficients-and-linear-arguments",
      title: t("A power over a linear argument", "幂除以一次式"),
      explanation: t(
        `When the coefficient sits on a logarithm of $x$ and the other logarithm has a linear argument, the power rule and the quotient rule give a fraction with $x^{2}$ on top, and clearing it gives a quadratic equation:

$$2\\log_{2} x - \\log_{2}(x + 4) = 1 \\implies \\log_{2} \\frac{x^{2}}{x + 4} = 1 \\implies \\frac{x^{2}}{x + 4} = 2$$

$$x^{2} = 2(x + 4) = 2x + 8 \\implies x^{2} - 2x - 8 = 0 \\implies (x - 4)(x + 2) = 0$$

The candidate $x = -2$ makes $x + 4 = 2$ positive, but $\\log_{2}(-2)$ in the original equation is not defined, so it is rejected. The solution is $x = 4$: $2\\log_{2} 4 - \\log_{2} 8 = 4 - 3 = 1$.

> **Watch out.** A negative candidate can make $x^{2}$ and the linear argument positive and still fail: the original equation has $\\log_{2} x$, which needs $x$ itself positive. Check every candidate against **every** logarithm of the original equation.`,
        `当系数在 $x$ 的对数前面、另一个对数的真数是一次式时，用幂的法则和商的法则会得到分子为 $x^{2}$ 的分式，去分母后就是一个二次方程：

$$2\\log_{2} x - \\log_{2}(x + 4) = 1 \\implies \\log_{2} \\frac{x^{2}}{x + 4} = 1 \\implies \\frac{x^{2}}{x + 4} = 2$$

$$x^{2} = 2(x + 4) = 2x + 8 \\implies x^{2} - 2x - 8 = 0 \\implies (x - 4)(x + 2) = 0$$

候选解 $x = -2$ 使 $x + 4 = 2$ 为正，但原方程中的 $\\log_{2}(-2)$ 无意义，所以舍去。方程的解是 $x = 4$：$2\\log_{2} 4 - \\log_{2} 8 = 4 - 3 = 1$。

> **注意。** 负的候选解可能使 $x^{2}$ 和一次式真数都为正，却仍然不是解：原方程中有 $\\log_{2} x$，要求 $x$ 本身为正。每个候选解都要对原方程中的**每一个**对数检验。`,
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
          const u = c * r + a;
          const us = c * s + a;
          return solutionsProblem({
            prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
            values: [sol(r)],
            wrong: [[sol(r), sol(s)], [sol(s)]],
            solution: t(
              `${label(1, "Power and quotient rules", "幂的法则与商的法则").en} Move the $2$ into the argument, then combine the difference:${steps(`${B.of("x^{2}")} - ${B.of(arg)} = ${k}`, `${B.of(`\\frac{x^{2}}{${arg}}`)} = ${k}`)}${label(2, "Exponential form", "化为指数式").en} The argument is $${B.b}^{${k}} = ${P}$. Multiply by $${arg}$ and bring every term to one side:${steps(`\\frac{x^{2}}{${arg}} = ${P}`, `x^{2} = ${P === 1 ? arg : `${P}(${arg})`}`, `${poly([1, "x^{2}"], [-P * c, "x"], [-P * a, ""])} = 0`, `(${linear(1, -r)})(${linear(1, -s)}) = 0`, orList([r, s]))}${label(3, "Check the candidates", "检验候选解").en} For $x = ${s}$ the argument of $${B.of("x")}$ is negative${us > 0 ? `, even though $${arg}$ is $${us}$` : ""}, so $x = ${s}$ is rejected. For $x = ${r}$ the arguments $${r}$ and $${u}$ are positive.

**Check.** $2${B.of(String(r))} - ${B.of(String(u))} = ${B.of(`\\frac{${r * r}}{${u}}`)} = ${B.of(String(P))} = ${k}$. The solution is $x = ${r}$.`,
              `${label(1, "Power and quotient rules", "幂的法则与商的法则")["zh-CN"]} 把 $2$ 移进真数，再合并对数之差：${steps(`${B.of("x^{2}")} - ${B.of(arg)} = ${k}`, `${B.of(`\\frac{x^{2}}{${arg}}`)} = ${k}`)}${label(2, "Exponential form", "化为指数式")["zh-CN"]} 真数等于 $${B.b}^{${k}} = ${P}$。两边乘以 $${arg}$，再把所有项移到一边：${steps(`\\frac{x^{2}}{${arg}} = ${P}`, `x^{2} = ${P === 1 ? arg : `${P}(${arg})`}`, `${poly([1, "x^{2}"], [-P * c, "x"], [-P * a, ""])} = 0`, `(${linear(1, -r)})(${linear(1, -s)}) = 0`, orListZh([r, s]))}${label(3, "Check the candidates", "检验候选解")["zh-CN"]} $x = ${s}$ 时 $${B.of("x")}$ 的真数为负${us > 0 ? `（尽管 $${arg}$ 等于 $${us}$）` : ""}，所以舍去 $x = ${s}$。$x = ${r}$ 时真数 $${r}$ 和 $${u}$ 都是正数。

**检验。** $2${B.of(String(r))} - ${B.of(String(u))} = ${B.of(`\\frac{${r * r}}{${u}}`)} = ${B.of(String(P))} = ${k}$。方程的解是 $x = ${r}$。`,
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
    { topic: "solving-logarithmic-equations-using-the-laws-of-logarithms", weight: 0.3 },
    { topic: "equations-with-variables-on-both-sides", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.LE.A.4", "CCSS.HSA.REI.A.2"],
  intro: t(
    `So far one side of each equation was a number, and we wrote the equation in exponential form. When **both** sides are logarithms with the same base, there is a shorter way. The graph of $y = \\log_{b} x$ always rises (or always falls), so it never takes the same value twice:

$$\\log_{b} M = \\log_{b} N \\iff M = N \\qquad (M > 0,\\ N > 0)$$

For example, $\\log_{7}(3x - 2) = \\log_{7} 10$ holds exactly when the arguments are equal:

$$3x - 2 = 10 \\implies 3x = 12 \\implies x = 4$$

The argument $3 \\cdot 4 - 2 = 10$ is positive, so $x = 4$ is the solution.

The condition $M > 0$ and $N > 0$ matters: setting the arguments equal can produce a value for which the logarithms are not defined. In this lesson we set the arguments equal, combine logarithms first with the product rule, and move a coefficient with the power rule, checking every candidate in the original equation.`,
    `前面的方程总有一边是数，我们把它化成指数式来解。当**两边**都是同底数的对数时，有更简便的方法。$y = \\log_{b} x$ 的图像一直上升（或一直下降），所以同一个值不会取两次：

$$\\log_{b} M = \\log_{b} N \\iff M = N \\qquad (M > 0,\\ N > 0)$$

例如，$\\log_{7}(3x - 2) = \\log_{7} 10$ 成立，当且仅当真数相等：

$$3x - 2 = 10 \\implies 3x = 12 \\implies x = 4$$

真数 $3 \\cdot 4 - 2 = 10$ 为正，所以 $x = 4$ 是方程的解。

条件 $M > 0$、$N > 0$ 很重要：令真数相等可能得到一个使对数无意义的值。这节课我们令真数相等，先用积的法则合并对数，再用幂的法则移动系数，并在原方程中检验每个候选解。`,
  ),
  knowledgePoints: [
    {
      id: "equal-arguments",
      title: t("Setting the arguments equal", "令真数相等"),
      explanation: t(
        `A logarithm takes each value only once, so logarithms with the same base are equal exactly when their arguments are equal. Setting the arguments equal turns the equation into a linear equation:

$$\\log_{5}(2x + 1) = \\log_{5}(x + 4) \\implies 2x + 1 = x + 4 \\implies x = 3$$

Check: for $x = 3$ both arguments equal $7$, which is positive, so $x = 3$ is the solution.

Now take $\\log_{5}(3x + 1) = \\log_{5}(x - 3)$. The arguments are equal when $3x + 1 = x - 3$, that is $x = -2$. But then both arguments equal $-5$, and $\\log_{5}(-5)$ is not defined. This equation has **no solution**.

> **Watch out.** The $x$ from the linear equation is only a candidate. Substitute it into the arguments: if their common value is negative or $0$, there is no solution, not $x = -2$. And when you collect the $x$-terms, a term that changes sides changes its sign.`,
        `对数函数的每个值只取一次，所以同底数的两个对数相等，当且仅当它们的真数相等。令真数相等，方程就变成一次方程：

$$\\log_{5}(2x + 1) = \\log_{5}(x + 4) \\implies 2x + 1 = x + 4 \\implies x = 3$$

检验：$x = 3$ 时两个真数都等于 $7$，是正数，所以 $x = 3$ 是方程的解。

再看 $\\log_{5}(3x + 1) = \\log_{5}(x - 3)$。真数相等时 $3x + 1 = x - 3$，即 $x = -2$。但这时两个真数都等于 $-5$，而 $\\log_{5}(-5)$ 无意义。这个方程**无解**。

> **注意。** 由一次方程得到的 $x$ 只是候选解。把它代入真数：如果真数的公共值是负数或 $0$，方程无解，而不是 $x = -2$。移项合并 $x$ 的项时，移到另一边的项要变号。`,
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
          const da = a1 - a2;
          const lines = [`${l} = ${r}`, `${coefL(da)}x = ${c2 - c1}`];
          if (da !== 1) lines.push(`x = ${x}`);
          const subs = `${evalAt(a1, x, c1)} = ${v}`;
          const subs2 = `${evalAt(a2, x, c2)} = ${v}`;
          return solutionsProblem({
            prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
            values: ok ? [sol(x)] : [],
            wrong: [ok ? [] : [sol(x)], [sol(-x)], [sol(Q.of(c2 + c1, a1 - a2))]],
            solution: t(
              `${label(1, "Set the arguments equal", "令真数相等").en} Both sides are logarithms with the same base, so the arguments must be equal. Collect the $x$-terms on the left and the numbers on the right:${steps(...lines)}${label(2, "Check the domain", "检验定义域").en} Substitute $x = ${x}$ into both arguments:${steps(subs, subs2)}${
                ok
                  ? `Both arguments equal $${v}$, which is positive, so both logarithms are defined.

**Check.** Both sides equal $${L(String(v))}$, so $x = ${x}$ is the solution.`
                  : `Both arguments equal $${v}$, which is not positive, so neither logarithm is defined for $x = ${x}$.

**Check.** The only candidate fails, so the equation has no solution.`
              }`,
              `${label(1, "Set the arguments equal", "令真数相等")["zh-CN"]} 两边是同底数的对数，所以真数必须相等。把含 $x$ 的项移到左边，数移到右边：${steps(...lines)}${label(2, "Check the domain", "检验定义域")["zh-CN"]} 把 $x = ${x}$ 代入两个真数：${steps(subs, subs2)}${
                ok
                  ? `两个真数都等于 $${v}$，是正数，两个对数都有意义。

**检验。** 两边都等于 $${L(String(v))}$，所以 $x = ${x}$ 是方程的解。`
                  : `两个真数都等于 $${v}$，不是正数，所以 $x = ${x}$ 时两个对数都无意义。

**检验。** 唯一的候选解不成立，所以方程无解。`
              }`,
            ),
          });
        }
      },
    },
    {
      id: "combining-first",
      title: t("Combining logarithms first", "先合并对数"),
      explanation: t(
        `When one side has two logarithms, first combine them into one with the product rule; then both sides are single logarithms and the arguments can be set equal:

$$\\log_{2} x + \\log_{2}(x + 1) = \\log_{2}(x + 6) \\implies x(x + 1) = x + 6$$

$$x^{2} + x = x + 6 \\implies x^{2} = 6 \\implies x = \\sqrt{6} \\text{ or } x = -\\sqrt{6}$$

For $x = -\\sqrt{6}$ the argument $x$ of $\\log_{2} x$ is negative, so it is rejected. For $x = \\sqrt{6}$ all three arguments $\\sqrt{6}$, $\\sqrt{6} + 1$ and $\\sqrt{6} + 6$ are positive, so the solution is $x = \\sqrt{6}$.

> **Watch out.** The product rule multiplies the arguments: $\\log_{2} x + \\log_{2}(x + 1)$ is $\\log_{2} x(x + 1)$, not $\\log_{2}(2x + 1)$. Check each candidate in **every** logarithm of the original equation: the product $x(x + 1)$ can be positive when $x$ and $x + 1$ are both negative, but then $\\log_{2} x$ is not defined.`,
        `一边有两个对数时，先用积的法则合并成一个；这样两边都是一个对数，就可以令真数相等：

$$\\log_{2} x + \\log_{2}(x + 1) = \\log_{2}(x + 6) \\implies x(x + 1) = x + 6$$

$$x^{2} + x = x + 6 \\implies x^{2} = 6 \\implies x = \\sqrt{6} \\text{ 或 } x = -\\sqrt{6}$$

$x = -\\sqrt{6}$ 时 $\\log_{2} x$ 的真数 $x$ 为负，应舍去。$x = \\sqrt{6}$ 时三个真数 $\\sqrt{6}$、$\\sqrt{6} + 1$、$\\sqrt{6} + 6$ 都是正数，所以方程的解是 $x = \\sqrt{6}$。

> **注意。** 积的法则把真数相乘：$\\log_{2} x + \\log_{2}(x + 1)$ 等于 $\\log_{2} x(x + 1)$，而不是 $\\log_{2}(2x + 1)$。每个候选解都要代入原方程的**每一个**对数检验：当 $x$ 和 $x + 1$ 都是负数时，乘积 $x(x + 1)$ 是正数，但 $\\log_{2} x$ 无意义。`,
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
          const args = (z: number): [string, number][] => [
            ["x", z],
            [linear(1, a), z + a],
            [linear(c, d), c * z + d],
          ];
          const bad = (z: number) => args(z).find(([, v]) => v <= 0) ?? ["x", z];
          const many = values.length > 1;
          const checkLine = (z: number) =>
            `${L(String(z))} + ${L(String(z + a))} = ${L(`${paren(z)} \\cdot ${paren(z + a)}`)} = ${L(String(c * z + d))}`;
          const rejectEn = rejected
            .map(
              (z) => `For $x = ${z}$ the argument $${bad(z)[0]}$ equals $${bad(z)[1]}$, which is not positive, so $x = ${z}$ is rejected.`,
            )
            .join(" ");
          const rejectZh = rejected
            .map((z) => `$x = ${z}$ 时真数 $${bad(z)[0]}$ 等于 $${bad(z)[1]}$，不是正数，所以舍去 $x = ${z}$。`)
            .join("");
          const keptEn = values.map((z) => `$x = ${z}$`).join(" and ");
          const keptZh = values.map((z) => `$x = ${z}$`).join("、");
          const argsEn = (z: number) =>
            args(z)
              .map(([, v]) => `$${v}$`)
              .join(", ");
          const argsZh = (z: number) =>
            args(z)
              .map(([, v]) => `$${v}$`)
              .join("、");
          return solutionsProblem({
            prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
            values: values.map(sol),
            wrong: [[sol(r), sol(s)], [], rejected.map(sol)],
            solution: t(
              `${label(1, "Combine", "合并").en} The product rule turns the left side into one logarithm, and then the arguments of the two sides must be equal:${steps(`${L(`x(${linear(1, a)})`)} = ${L(linear(c, d))}`, `x(${linear(1, a)}) = ${linear(c, d)}`)}${label(2, "Solve the quadratic", "解二次方程").en} Expand, bring every term to the left and factor:${steps(`${poly([1, "x^{2}"], [a, "x"])} = ${linear(c, d)}`, quad, `(${linear(1, -r)})(${linear(1, -s)}) = 0`, orList([r, s]))}${label(3, "Check the domain", "检验定义域").en} ${rejected.length ? rejectEn : "Both candidates make all three arguments positive."}

**Check.** ${values.map((z) => `For $x = ${z}$ the arguments are ${argsEn(z)}, and $${checkLine(z)}$, the right side.`).join(" ")} ${many ? "The solutions are" : "The solution is"} ${keptEn}.`,
              `${label(1, "Combine", "合并")["zh-CN"]} 用积的法则把左边化成一个对数，这样两边的真数必须相等：${steps(`${L(`x(${linear(1, a)})`)} = ${L(linear(c, d))}`, `x(${linear(1, a)}) = ${linear(c, d)}`)}${label(2, "Solve the quadratic", "解二次方程")["zh-CN"]} 展开，把所有项移到左边，再因式分解：${steps(`${poly([1, "x^{2}"], [a, "x"])} = ${linear(c, d)}`, quad, `(${linear(1, -r)})(${linear(1, -s)}) = 0`, orListZh([r, s]))}${label(3, "Check the domain", "检验定义域")["zh-CN"]} ${rejected.length ? rejectZh : "两个候选解都使三个真数为正。"}

**检验。** ${values.map((z) => `$x = ${z}$ 时真数是 ${argsZh(z)}，且 $${checkLine(z)}$，等于右边。`).join("")}方程的解是 ${keptZh}。`,
            ),
          });
        }
      },
    },
    {
      id: "coefficients-on-both-sides",
      title: t("A coefficient on one side", "一边有系数"),
      explanation: t(
        `A coefficient in front of a logarithm has to go into the argument first, with the power rule; only then are both sides single logarithms whose arguments can be set equal:

$$2\\log_{3} x = \\log_{3}(x + 6) \\implies \\log_{3} x^{2} = \\log_{3}(x + 6) \\implies x^{2} = x + 6$$

$$x^{2} - x - 6 = 0 \\implies (x - 3)(x + 2) = 0 \\implies x = 3 \\text{ or } x = -2$$

The original equation contains $\\log_{3} x$, so $x$ must be positive: $x = -2$ is rejected. Check $x = 3$: $2\\log_{3} 3 = 2$ and $\\log_{3} 9 = 2$.

> **Watch out.** The power rule gives $\\log_{3} x^{2}$, so the equation of the arguments is $x^{2} = x + 6$, not $2x = x + 6$. And $x = -2$ is rejected even though $(-2)^{2}$ and $-2 + 6$ are positive: $2\\log_{3} x$ itself needs $x > 0$.`,
        `对数前面的系数要先用幂的法则移进真数；这样两边都是一个对数，才能令真数相等：

$$2\\log_{3} x = \\log_{3}(x + 6) \\implies \\log_{3} x^{2} = \\log_{3}(x + 6) \\implies x^{2} = x + 6$$

$$x^{2} - x - 6 = 0 \\implies (x - 3)(x + 2) = 0 \\implies x = 3 \\text{ 或 } x = -2$$

原方程含有 $\\log_{3} x$，$x$ 必须为正，所以舍去 $x = -2$。检验 $x = 3$：$2\\log_{3} 3 = 2$，$\\log_{3} 9 = 2$。

> **注意。** 幂的法则得到 $\\log_{3} x^{2}$，所以真数满足的方程是 $x^{2} = x + 6$，而不是 $2x = x + 6$。尽管 $(-2)^{2}$ 和 $-2 + 6$ 都是正数，$x = -2$ 也要舍去：$2\\log_{3} x$ 本身要求 $x > 0$。`,
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
          const checkOne = (z: number) =>
            `$x = ${z}$: $${evalAt(p, z, q)} = ${z * z} = ${z}^{2}$, so $2${L(String(z))} = ${L(String(z * z))}$`;
          const checkOneZh = (z: number) =>
            `$x = ${z}$ 时，$${evalAt(p, z, q)} = ${z * z} = ${z}^{2}$，所以 $2${L(String(z))} = ${L(String(z * z))}$`;
          return solutionsProblem({
            prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
            values: values.map(sol),
            wrong: [[sol(r), sol(s)], [sol(r)], [sol(-r), sol(-s)]],
            solution: t(
              `${label(1, "Power rule", "幂的法则").en} Move the coefficient $2$ into the argument, then set the arguments equal:${steps(`${L("x^{2}")} = ${L(linear(p, q))}`, `x^{2} = ${linear(p, q)}`)}${label(2, "Solve the quadratic", "解二次方程").en} Bring every term to the left and factor:${steps(`${poly([1, "x^{2}"], [-p, "x"], [-q, ""])} = 0`, `(${linear(1, -r)})(${linear(1, -s)}) = 0`, orList([r, s].sort((u, v) => u - v)))}${label(3, "Check the domain", "检验定义域").en} ${s < 0 ? `$x = ${s}$ is rejected, because $${L("x")}$ needs $x > 0$.` : `Both values are positive, and then $${linear(p, q)} = x^{2}$ is positive too.`}

**Check.** ${values.map(checkOne).join("; ")}. ${values.length === 1 ? "The solution is" : "The solutions are"} ${values.map((v) => `$x = ${v}$`).join(" and ")}.`,
              `${label(1, "Power rule", "幂的法则")["zh-CN"]} 把系数 $2$ 移进真数，再令真数相等：${steps(`${L("x^{2}")} = ${L(linear(p, q))}`, `x^{2} = ${linear(p, q)}`)}${label(2, "Solve the quadratic", "解二次方程")["zh-CN"]} 把所有项移到左边，再因式分解：${steps(`${poly([1, "x^{2}"], [-p, "x"], [-q, ""])} = 0`, `(${linear(1, -r)})(${linear(1, -s)}) = 0`, orListZh([r, s].sort((u, v) => u - v)))}${label(3, "Check the domain", "检验定义域")["zh-CN"]} ${s < 0 ? `$${L("x")}$ 要求 $x > 0$，所以舍去 $x = ${s}$。` : `两个值都是正数，此时 $${linear(p, q)} = x^{2}$ 也是正数。`}

**检验。** ${values.map(checkOneZh).join("；")}。方程的解是 ${values.map((v) => `$x = ${v}$`).join("、")}。`,
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
    { topic: "solving-quadratic-equations-by-factoring", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.LE.A.4", "CCSS.HSA.SSE.A.2"],
  intro: t(
    `The zero-product property says that a product is $0$ exactly when one of its factors is $0$:

$$AB = 0 \\iff A = 0 \\text{ or } B = 0$$

We used it for exponential equations; it works the same way when the factors contain logarithms. Each factor gives a simpler equation, and each of those is a logarithmic equation of the kind we already solve. For example:

$$(\\log_{2} x - 3)(\\log_{2} x + 1) = 0 \\implies \\log_{2} x = 3 \\text{ or } \\log_{2} x = -1$$

In exponential form, $x = 2^{3} = 8$ or $x = 2^{-1} = \\frac{1}{2}$. Both are positive, so both are solutions: $\\log_{2} 8 - 3 = 0$ and $\\log_{2} \\frac{1}{2} + 1 = 0$.

A logarithm needs a positive argument, so a factor such as $x$ or $x - 1$ can give a candidate for which the logarithm is not defined. In this lesson we factor out a common factor, treat an equation in $\\log_{b} x$ as a quadratic, and see why dividing by a logarithm loses a solution.`,
    `零积性质说：一个乘积等于 $0$，当且仅当其中某个因式等于 $0$：

$$AB = 0 \\iff A = 0 \\text{ 或 } B = 0$$

我们在指数方程中用过它；因式里含有对数时，用法完全一样。每个因式给出一个更简单的方程，而每个都是我们已经会解的对数方程。例如：

$$(\\log_{2} x - 3)(\\log_{2} x + 1) = 0 \\implies \\log_{2} x = 3 \\text{ 或 } \\log_{2} x = -1$$

化为指数式，$x = 2^{3} = 8$ 或 $x = 2^{-1} = \\frac{1}{2}$。两者都是正数，所以都是解：$\\log_{2} 8 - 3 = 0$，$\\log_{2} \\frac{1}{2} + 1 = 0$。

对数要求真数为正，所以像 $x$ 或 $x - 1$ 这样的因式可能给出使对数无意义的候选解。这节课我们提取公因式，把关于 $\\log_{b} x$ 的方程当作二次方程来解，并看看为什么两边同除以对数会丢掉解。`,
  ),
  knowledgePoints: [
    {
      id: "common-factors-with-logarithms",
      title: t("Common factors", "提取公因式"),
      explanation: t(
        `When every term shares a factor, factor it out and set each factor equal to $0$:

$$x\\log_{3} x - 2x = 0 \\implies x(\\log_{3} x - 2) = 0 \\implies x = 0 \\text{ or } \\log_{3} x = 2$$

$\\log_{3} 0$ is not defined, so $x = 0$ is rejected, and $\\log_{3} x = 2$ gives $x = 3^{2} = 9$. Check: $9\\log_{3} 9 - 2 \\cdot 9 = 18 - 18 = 0$.

The factors may also be given already. $(x - 1)\\log_{2}(x + 3) = 0$ gives $x - 1 = 0$ or $\\log_{2}(x + 3) = 0$. A logarithm is $0$ when its argument is $1$, so $x + 3 = 1$ and $x = -2$. For $x = 1$ the argument is $4$ and for $x = -2$ it is $1$, so both are solutions.

> **Watch out.** $\\log_{b}(x + 3) = 0$ means $x + 3 = b^{0} = 1$, not $x + 3 = 0$. And a factor $x = 0$ or $x - p = 0$ only gives a candidate: reject it when it makes an argument $0$ or negative. $\\log_{3} x = 2$ is not the answer $2$ either; convert it to $x = 9$.`,
        `当各项有公因式时，把它提出来，再令每个因式等于 $0$：

$$x\\log_{3} x - 2x = 0 \\implies x(\\log_{3} x - 2) = 0 \\implies x = 0 \\text{ 或 } \\log_{3} x = 2$$

$\\log_{3} 0$ 无意义，所以舍去 $x = 0$；$\\log_{3} x = 2$ 得 $x = 3^{2} = 9$。检验：$9\\log_{3} 9 - 2 \\cdot 9 = 18 - 18 = 0$。

因式也可能已经给出。$(x - 1)\\log_{2}(x + 3) = 0$ 得 $x - 1 = 0$ 或 $\\log_{2}(x + 3) = 0$。真数为 $1$ 时对数等于 $0$，所以 $x + 3 = 1$，$x = -2$。$x = 1$ 时真数为 $4$，$x = -2$ 时真数为 $1$，所以两者都是解。

> **注意。** $\\log_{b}(x + 3) = 0$ 表示 $x + 3 = b^{0} = 1$，而不是 $x + 3 = 0$。因式 $x = 0$ 或 $x - p = 0$ 只给出候选解：如果它使某个真数为 $0$ 或负数，就要舍去。$\\log_{3} x = 2$ 也不是答案 $2$，要化成 $x = 9$。`,
      ),
      generate(rng) {
        if (rng.bool()) {
          const B = drawBase(rng, [2, 3, 4, 5]);
          const k = rng.nonZero(-2, 3);
          const V = Q.of(B.b).pow(k);
          const eq = `x${B.of("x")} ${k > 0 ? "-" : "+"} ${Math.abs(k) === 1 ? "" : Math.abs(k)}x = 0`;
          const back = `${num(V)} \\cdot ${B.of(num(V))} ${k > 0 ? "-" : "+"} ${Math.abs(k) === 1 ? "" : `${Math.abs(k)} \\cdot `}${num(V)}`;
          const value = `${num(V)}\\left(${k}${plusK(-k)}\\right)`;
          return solutionsProblem({
            prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
            values: [sol(V)],
            wrong: [["0", sol(V)], [sol(k)], ["0", sol(k)]],
            solution: t(
              `${label(1, "Factor", "提取公因式").en} Both terms contain $x$; factor it out and set each factor equal to $0$:${steps(`x(${B.of("x")}${plusK(-k)}) = 0`, `x = 0 \\quad \\text{or} \\quad ${B.of("x")} = ${k}`)}${label(2, "Solve each equation", "分别求解").en} $x = 0$ is rejected, because the logarithm of $0$ is not defined${tenNote(B).en}. Write the other equation in exponential form:${steps(`x = ${B.b}^{${k}} = ${num(V)}`)}**Check.** $${B.of(num(V))} = ${k}$, so $${back} = ${value} = 0$. The solution is $x = ${num(V)}$.`,
              `${label(1, "Factor", "提取公因式")["zh-CN"]} 两项都含有 $x$，把它提出来，再令每个因式等于 $0$：${steps(`x(${B.of("x")}${plusK(-k)}) = 0`, `x = 0 \\quad \\text{或} \\quad ${B.of("x")} = ${k}`)}${label(2, "Solve each equation", "分别求解")["zh-CN"]} $0$ 的对数无意义，所以舍去 $x = 0$${tenNote(B)["zh-CN"]}。把另一个方程化为指数式：${steps(`x = ${B.b}^{${k}} = ${num(V)}`)}**检验。** $${B.of(num(V))} = ${k}$，所以 $${back} = ${value} = 0$。方程的解是 $x = ${num(V)}$。`,
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
          const arg = linear(1, q);
          const eq = `(${linear(1, -p)})${B.of(arg)} = 0`;
          const checkOne = `$x = ${one}$: $${arg} = 1$, so $${paren(one - p)}${B.of("1")} = ${paren(one - p)} \\cdot 0 = 0$`;
          const checkOneZh = `$x = ${one}$ 时 $${arg} = 1$，所以 $${paren(one - p)}${B.of("1")} = ${paren(one - p)} \\cdot 0 = 0$`;
          const checkP = `$x = ${p}$: $${arg} = ${p + q}$, so $0 \\cdot ${B.of(String(p + q))} = 0$`;
          const checkPZh = `$x = ${p}$ 时 $${arg} = ${p + q}$，所以 $0 \\cdot ${B.of(String(p + q))} = 0$`;
          return solutionsProblem({
            prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
            values: values.map(sol),
            wrong: [[sol(p), sol(one)], [sol(p), sol(-q)], [sol(p)]],
            solution: t(
              `${label(1, "Zero-product property", "零积性质").en} The product is $0$ when one of the factors is $0$:${steps(`${linear(1, -p)} = 0 \\quad \\text{or} \\quad ${B.of(arg)} = 0`)}${label(2, "Solve each equation", "分别求解").en} A logarithm is $0$ when its argument is $1$${tenNote(B).en}:${steps(`x = ${p} \\quad \\text{or} \\quad ${arg} = ${B.b}^{0} = 1`, orList([p, one]))}${label(3, "Check the domain", "检验定义域").en} ${valid ? `Both candidates make the argument $${arg}$ positive: it is $${p + q}$ for $x = ${p}$ and $1$ for $x = ${one}$.` : `For $x = ${p}$ the argument $${arg}$ is $${p + q}$, which is not positive, so $${B.of(String(p + q))}$ is not defined and $x = ${p}$ is rejected.`}

**Check.** ${valid ? `${checkP}; ${checkOne}. The solutions are $x = ${values[0]}$ and $x = ${values[1]}$.` : `${checkOne}. The solution is $x = ${one}$.`}`,
              `${label(1, "Zero-product property", "零积性质")["zh-CN"]} 乘积等于 $0$，说明某个因式等于 $0$：${steps(`${linear(1, -p)} = 0 \\quad \\text{或} \\quad ${B.of(arg)} = 0`)}${label(2, "Solve each equation", "分别求解")["zh-CN"]} 真数为 $1$ 时对数等于 $0$${tenNote(B)["zh-CN"]}：${steps(`x = ${p} \\quad \\text{或} \\quad ${arg} = ${B.b}^{0} = 1`, orListZh([p, one]))}${label(3, "Check the domain", "检验定义域")["zh-CN"]} ${valid ? `两个候选解都使真数 $${arg}$ 为正：$x = ${p}$ 时为 $${p + q}$，$x = ${one}$ 时为 $1$。` : `$x = ${p}$ 时真数 $${arg}$ 等于 $${p + q}$，不是正数，$${B.of(String(p + q))}$ 无意义，所以舍去 $x = ${p}$。`}

**检验。** ${valid ? `${checkPZh}；${checkOneZh}。方程的解是 $x = ${values[0]}$ 和 $x = ${values[1]}$。` : `${checkOneZh}。方程的解是 $x = ${one}$。`}`,
            ),
          });
        }
      },
    },
    {
      id: "quadratic-in-a-logarithm",
      title: t("Equations quadratic in a logarithm", "关于对数的二次方程"),
      explanation: t(
        `In $(\\log_{2} x)^{2} - 3\\log_{2} x + 2 = 0$ the logarithm appears squared and to the first power, like $x$ in a quadratic. Treat it as a new unknown: with $u = \\log_{2} x$ the equation becomes

$$u^{2} - 3u + 2 = 0 \\implies (u - 1)(u - 2) = 0 \\implies u = 1 \\text{ or } u = 2$$

These are values of the logarithm, not of $x$. Go back to $x$ with exponential form: $\\log_{2} x = 1$ gives $x = 2^{1} = 2$, and $\\log_{2} x = 2$ gives $x = 2^{2} = 4$. Every power of $2$ is positive, so both are solutions. Check $x = 4$: $2^{2} - 3 \\cdot 2 + 2 = 0$.

> **Watch out.** The values $u = 1$ and $u = 2$ are not the answers; each becomes $x = b^{u}$. Convert with a power, not a product: $\\log_{2} x = 2$ gives $x = 2^{2} = 4$, and $\\log_{2} x = -1$ gives $x = \\frac{1}{2}$, not $2 \\cdot (-1)$.`,
        `在 $(\\log_{2} x)^{2} - 3\\log_{2} x + 2 = 0$ 中，对数既以平方出现，又以一次方出现，就像二次方程中的 $x$。把它看作新的未知数：设 $u = \\log_{2} x$，方程变为

$$u^{2} - 3u + 2 = 0 \\implies (u - 1)(u - 2) = 0 \\implies u = 1 \\text{ 或 } u = 2$$

这些是对数的值，不是 $x$ 的值。用指数式回到 $x$：$\\log_{2} x = 1$ 得 $x = 2^{1} = 2$，$\\log_{2} x = 2$ 得 $x = 2^{2} = 4$。$2$ 的任何次幂都是正数，所以两者都是解。检验 $x = 4$：$2^{2} - 3 \\cdot 2 + 2 = 0$。

> **注意。** $u = 1$ 和 $u = 2$ 不是答案，每个都要化成 $x = b^{u}$。要用乘方而不是乘法：$\\log_{2} x = 2$ 得 $x = 2^{2} = 4$，$\\log_{2} x = -1$ 得 $x = \\frac{1}{2}$，而不是 $2 \\cdot (-1)$。`,
      ),
      generate(rng) {
        const B = drawBase(rng, [2, 3, 4, 5]);
        const [u1, u2] = rng.sample(B.b === 10 ? [-2, -1, 0, 1, 2] : [-2, -1, 0, 1, 2, 3], 2) as [number, number];
        const [x1, x2] = [Q.of(B.b).pow(u1), Q.of(B.b).pow(u2)];
        const S = u1 + u2;
        const P = u1 * u2;
        const eq = `${poly([1, logSq(B)], [-S, B.of("x")], [P, ""])} = 0`;
        const factored = `${u1 === 0 ? `u(${linear(1, -u2, "u")})` : u2 === 0 ? `u(${linear(1, -u1, "u")})` : `(${linear(1, -u1, "u")})(${linear(1, -u2, "u")})`} = 0`;
        const subs = (u: number) =>
          chain(
            `${powBase(u)}^{2}${S === 0 ? "" : ` ${S > 0 ? "-" : "+"} ${Math.abs(S) === 1 ? "" : `${Math.abs(S)} \\cdot `}${paren(u)}`}${plusK(P)}`,
            `${u * u}${plusK(-S * u)}${plusK(P)}`,
            "0",
          );
        const back = (u: number, v: Q) => `x = ${B.b}^{${u}} = ${num(v)}`;
        return solutionsProblem({
          prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
          values: [sol(x1), sol(x2)],
          wrong: [[sol(u1), sol(u2)], [sol(x1)], [sol(Q.of(B.b * u1)), sol(Q.of(B.b * u2))]],
          solution: t(
            `${label(1, "Substitute", "换元").en} Let $u = ${B.of("x")}$${tenNote(B).en}; the equation is a quadratic in $u$. Factor it:${steps(`${poly([1, "u^{2}"], [-S, "u"], [P, ""])} = 0`, factored, `u = ${u1} \\quad \\text{or} \\quad u = ${u2}`)}${label(2, "Go back to $x$", "回到 $x$").en} Each value of $u$ is a value of $${B.of("x")}$; write it in exponential form:${steps(`${B.of("x")} = ${u1} \\quad \\text{or} \\quad ${B.of("x")} = ${u2}`, back(u1, x1), back(u2, x2))}Both values are powers of $${B.b}$, so they are positive and the logarithm is defined.

**Check.** For $x = ${num(x1)}$, $u = ${u1}$ and $${subs(u1)}$; for $x = ${num(x2)}$, $u = ${u2}$ and $${subs(u2)}$. The solutions are $x = ${num(x1)}$ and $x = ${num(x2)}$.`,
            `${label(1, "Substitute", "换元")["zh-CN"]} 设 $u = ${B.of("x")}$${tenNote(B)["zh-CN"]}，方程就是关于 $u$ 的二次方程。因式分解：${steps(`${poly([1, "u^{2}"], [-S, "u"], [P, ""])} = 0`, factored, `u = ${u1} \\quad \\text{或} \\quad u = ${u2}`)}${label(2, "Go back to $x$", "回到 $x$")["zh-CN"]} $u$ 的每个值都是 $${B.of("x")}$ 的值，把它化为指数式：${steps(`${B.of("x")} = ${u1} \\quad \\text{或} \\quad ${B.of("x")} = ${u2}`, back(u1, x1), back(u2, x2))}两个值都是 $${B.b}$ 的幂，都是正数，对数有意义。

**检验。** $x = ${num(x1)}$ 时 $u = ${u1}$，$${subs(u1)}$；$x = ${num(x2)}$ 时 $u = ${u2}$，$${subs(u2)}$。方程的解是 $x = ${num(x1)}$ 和 $x = ${num(x2)}$。`,
          ),
        });
      },
    },
    {
      id: "do-not-divide-by-the-logarithm",
      title: t("Do not divide by the logarithm", "不要两边同除以对数"),
      explanation: t(
        `It is tempting to divide $(\\log_{3} x)^{2} = 4\\log_{3} x$ by $\\log_{3} x$ and get $\\log_{3} x = 4$. But dividing by an expression is allowed only when it is not $0$, and $\\log_{3} x = 0$ is exactly one of the solutions. Move everything to one side and factor instead:

$$(\\log_{3} x)^{2} - 4\\log_{3} x = 0 \\implies \\log_{3} x\\,(\\log_{3} x - 4) = 0$$

$\\log_{3} x = 0$ gives $x = 3^{0} = 1$, and $\\log_{3} x = 4$ gives $x = 3^{4} = 81$. Check $x = 1$: both sides are $0^{2} = 4 \\cdot 0 = 0$. Dividing by $\\log_{3} x$ would have lost $x = 1$.

> **Watch out.** Never divide both sides by $\\log_{b} x$: it loses $x = 1$. And $\\log_{b} x = 0$ means $x = b^{0} = 1$, not $x = 0$; $\\log_{b} 0$ is not even defined.`,
        `很容易想到把 $(\\log_{3} x)^{2} = 4\\log_{3} x$ 两边同除以 $\\log_{3} x$，得到 $\\log_{3} x = 4$。但只有当一个式子不等于 $0$ 时才能除以它，而 $\\log_{3} x = 0$ 恰好给出一个解。应该把所有项移到一边再因式分解：

$$(\\log_{3} x)^{2} - 4\\log_{3} x = 0 \\implies \\log_{3} x\\,(\\log_{3} x - 4) = 0$$

$\\log_{3} x = 0$ 得 $x = 3^{0} = 1$，$\\log_{3} x = 4$ 得 $x = 3^{4} = 81$。检验 $x = 1$：两边都是 $0^{2} = 4 \\cdot 0 = 0$。两边同除以 $\\log_{3} x$ 就会丢掉 $x = 1$。

> **注意。** 不要两边同除以 $\\log_{b} x$：这会丢掉 $x = 1$。而且 $\\log_{b} x = 0$ 表示 $x = b^{0} = 1$，不是 $x = 0$；$\\log_{b} 0$ 根本无意义。`,
      ),
      generate(rng) {
        const B = drawBase(rng, [2, 3, 4, 5, 6, 7]);
        const k = rng.nonZero(B.b === 10 ? -2 : -2, B.b === 10 ? 2 : 3);
        const c = rng.pick([1, 1, 2, 3]);
        const V = Q.of(B.b).pow(k);
        const eq = `${coefL(c)}${logSq(B)} = ${coefL(c * k)}${B.of("x")}`;
        const cTimes = c === 1 ? "" : `${c} \\cdot `;
        return solutionsProblem({
          prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
          values: ["1", sol(V)],
          wrong: [[sol(V)], ["0", sol(V)], ["1", sol(k)]],
          solution: t(
            `${label(1, "Factor", "因式分解").en} Do not divide by $${B.of("x")}$, which may be $0$. Move everything to the left and factor out $${c === 1 ? "" : c}${B.of("x")}$${tenNote(B).en}:${steps(`${coefL(c)}${logSq(B)}${plusK(-c * k)}${B.of("x")} = 0`, `${c === 1 ? "" : c}${B.of("x")}(${B.of("x")}${plusK(-k)}) = 0`)}${label(2, "Solve each equation", "分别求解").en} Set each factor equal to $0$ and write it in exponential form:${steps(`${B.of("x")} = 0 \\quad \\text{or} \\quad ${B.of("x")} = ${k}`, `x = ${B.b}^{0} = 1 \\quad \\text{or} \\quad x = ${B.b}^{${k}} = ${num(V)}`)}**Check.** For $x = 1$ the logarithm is $0$, and both sides are $0$. For $x = ${num(V)}$ the logarithm is $${k}$: the left side is $${cTimes}${powBase(k)}^{2} = ${c * k * k}$ and the right side is $${num(c * k)} \\cdot ${paren(k)} = ${c * k * k}$. The solutions are $x = 1$ and $x = ${num(V)}$.`,
            `${label(1, "Factor", "因式分解")["zh-CN"]} 不要两边同除以可能为 $0$ 的 $${B.of("x")}$。把所有项移到左边，提取公因式 $${c === 1 ? "" : c}${B.of("x")}$${tenNote(B)["zh-CN"]}：${steps(`${coefL(c)}${logSq(B)}${plusK(-c * k)}${B.of("x")} = 0`, `${c === 1 ? "" : c}${B.of("x")}(${B.of("x")}${plusK(-k)}) = 0`)}${label(2, "Solve each equation", "分别求解")["zh-CN"]} 令每个因式等于 $0$，再化为指数式：${steps(`${B.of("x")} = 0 \\quad \\text{或} \\quad ${B.of("x")} = ${k}`, `x = ${B.b}^{0} = 1 \\quad \\text{或} \\quad x = ${B.b}^{${k}} = ${num(V)}`)}**检验。** $x = 1$ 时对数为 $0$，两边都是 $0$。$x = ${num(V)}$ 时对数为 $${k}$：左边是 $${cTimes}${powBase(k)}^{2} = ${c * k * k}$，右边是 $${num(c * k)} \\cdot ${paren(k)} = ${c * k * k}$。方程的解是 $x = 1$ 和 $x = ${num(V)}$。`,
          ),
        });
      },
    },
  ],
  diagnostic: "quadratic-in-a-logarithm",
};

// Unit: graphs of exponential functions.

/** Labeled is a point of a graph with the direction of its label; a bare point is drawn without one. */
interface Labeled {
  readonly at: Point;
  readonly dir: Compass;
  readonly bare?: boolean;
}

/** ptL writes a point label: "(1, -2)". */
const ptL = (p: Point) => `(${p[0]}, ${p[1]})`;

const expView: PlaneView = { xMin: -5, xMax: 5, yMin: -6, yMax: 10 };

/** expGraph draws y = f(x) of a transformed exponential function, its horizontal asymptote y = k dashed, with labeled points. */
function expGraph(view: PlaneView, f: (x: number) => number, k: number, pts: readonly Labeled[], rising: boolean, from?: number): Figure {
  const marks: PlaneMark[] = [];
  if (k !== 0) marks.push({ kind: "line", a: [view.xMin, k], b: [view.xMax, k], dashed: true });
  marks.push(from === undefined ? { kind: "curve", f, accent: true } : { kind: "curve", f, from, accent: true });
  for (const p of pts) marks.push(p.bare ? { kind: "point", at: p.at } : { kind: "point", at: p.at, label: ptL(p.at), dir: p.dir });
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
const unitsEn = (n: number) => `$${Math.abs(n)}$ ${Math.abs(n) === 1 ? "unit" : "units"}`;

/** shiftText describes a vertical translation: "$4$ units up", "向上平移 $4$ 个单位". */
const vShift = (k: number) => t(`${unitsEn(k)} ${k > 0 ? "up" : "down"}`, `向${k > 0 ? "上" : "下"}平移 $${Math.abs(k)}$ 个单位`);

/** moveFigure draws y = a·b^x and its translation k units vertically, with the new asymptote y = k dashed and an arrow moving the y-intercept. */
function moveFigure(a: number, b: Q, k: number): Figure {
  const f = expFn(a, b, 0, 0);
  const rising = b.cmp(Q.one) > 0;
  const s = vShift(k);
  return {
    svg: plane(expView, [
      { kind: "curve", f },
      { kind: "line", a: [expView.xMin, k], b: [expView.xMax, k], dashed: true, tone: "result" },
      { kind: "curve", f: expFn(a, b, 0, k), accent: true },
      ...shift([0, a], [0, a + k]),
    ]),
    alt: t(
      `The ${rising ? "rising" : "falling"} graph of f and the graph of g, the same curve moved ${s.en.replaceAll("$", "")}: the y-intercept (0, ${a}) moves to (0, ${a + k}), and the asymptote y = 0 moves to the dashed line y = ${k}.`,
      `f 的${rising ? "上升" : "下降"}图象和 g 的图象，后者是同一条曲线${s["zh-CN"].replaceAll("$", "")}：y 轴截距 (0, ${a}) 移到 (0, ${a + k})，渐近线 y = 0 移到虚线 y = ${k}。`,
    ),
  };
}

export const verticalTranslationsOfExponentialGrowthFunctions: TopicDef = {
  id: "vertical-translations-of-exponential-growth-functions",
  title: t("Vertical Translations of Exponential Growth Functions", "指数增长函数的竖直平移"),
  summary: t(
    "Translate graphs of $y = a \\cdot b^{x}$ up and down, and read translated growth functions from their graphs.",
    "把 $y = a \\cdot b^{x}$ 的图象上下平移，并根据图象求平移后的增长函数。",
  ),
  prerequisites: ["graphing-exponential-growth-functions", "vertical-translations-of-functions"],
  encompasses: [{ topic: "vertical-translations-of-functions", weight: 0.5 }],
  xp: 14,
  standards: ["CCSS.HSF.BF.B.3", "CCSS.HSF.IF.C.7.E"],
  intro: t(
    `The graph of a growth function $y = a \\cdot b^{x}$ with $a > 0$ and $b > 1$ rises from left to right, crosses the $y$-axis at $(0, a)$, and on the left comes closer and closer to the $x$-axis, its horizontal asymptote $y = 0$. We also know that adding a number $k$ to a function, $f(x) + k$, moves every point of its graph $k$ units vertically.

Put the two together. Take $f(x) = 2^{x}$ and $g(x) = 2^{x} + 3$. Every output of $g$ is $3$ more than the output of $f$ at the same $x$:

$$\\begin{array}{c|ccc} x & 0 & 1 & 2 \\\\ \\hline f(x) & 1 & 2 & 4 \\\\ g(x) & 4 & 5 & 7 \\end{array}$$

{{figure 0}}

So the whole curve moves $3$ units up, and the asymptote moves with it: $2^{x}$ is never $0$, so $g(x) = 2^{x} + 3$ is never $3$, and the asymptote of $g$ is the line $y = 3$. The shape does not change; only its height does.

In this lesson we write the translated function, find the equation of a translated graph from its asymptote and a point, and compute values and the $y$-intercept.`,
    `增长函数 $y = a \\cdot b^{x}$（$a > 0$，$b > 1$）的图象从左到右上升，与 $y$ 轴交于 $(0, a)$，向左越来越靠近 $x$ 轴，即水平渐近线 $y = 0$。我们还知道，给函数加上一个数 $k$，即 $f(x) + k$，会把图象上每个点竖直移动 $k$ 个单位。

把这两点结合起来。取 $f(x) = 2^{x}$ 和 $g(x) = 2^{x} + 3$。在同一个 $x$ 处，$g$ 的函数值总比 $f$ 大 $3$：

$$\\begin{array}{c|ccc} x & 0 & 1 & 2 \\\\ \\hline f(x) & 1 & 2 & 4 \\\\ g(x) & 4 & 5 & 7 \\end{array}$$

{{figure 0}}

所以整条曲线向上平移 $3$ 个单位，渐近线也跟着移动：$2^{x}$ 永远不等于 $0$，所以 $g(x) = 2^{x} + 3$ 永远不等于 $3$，$g$ 的渐近线是直线 $y = 3$。形状不变，只有高度变了。

这节课我们写出平移后的函数，由渐近线和一个点求平移后图象的解析式，并计算函数值和 $y$ 轴截距。`,
  ),
  introFigures: [moveFigure(1, Q.of(2), 3)],
  knowledgePoints: [
    {
      id: "translating-growth-graphs",
      figure: algebraDrawings2["vertical-translations-of-exponential-growth-functions#translating-growth-graphs"],
      title: t("Writing the translated function", "写出平移后的函数"),
      explanation: t(
        `Moving a graph vertically changes the outputs, not the inputs: every point $(x, y)$ moves to $(x, y + k)$. So the translated function adds $k$ to the whole function, outside the power. Up means $k > 0$, down means $k < 0$. For $f(x) = 4^{x}$ moved $5$ units down:

$$g(x) = f(x) - 5 = 4^{x} - 5$$

The $y$-intercept $(0, 1)$ moves to $(0, -4)$, and the asymptote moves from $y = 0$ to $y = -5$.

> **Watch out.** Down means subtracting: $5$ units down is $4^{x} - 5$, not $4^{x} + 5$. And the number goes outside the power: $4^{x - 5}$ or $4^{x + 5}$ moves the graph sideways, not up or down.`,
        `竖直移动图象改变的是函数值，不是自变量：每个点 $(x, y)$ 移到 $(x, y + k)$。所以平移后的函数是给整个函数加上 $k$，加在幂的外面。向上 $k > 0$，向下 $k < 0$。把 $f(x) = 4^{x}$ 向下平移 $5$ 个单位：

$$g(x) = f(x) - 5 = 4^{x} - 5$$

$y$ 轴截距 $(0, 1)$ 移到 $(0, -4)$，渐近线从 $y = 0$ 移到 $y = -5$。

> **注意。** 向下是减：向下平移 $5$ 个单位是 $4^{x} - 5$，不是 $4^{x} + 5$。而且这个数要加在幂的外面：$4^{x - 5}$ 或 $4^{x + 5}$ 是左右平移，不是上下平移。`,
      ),
      generate(rng) {
        const a = rng.pick([1, 1, 2, 3, 4]);
        const b = Q.of(rng.pick([2, 3, 4, 5, 10]));
        const k = rng.nonZero(-6, 6);
        const f = expT(a, b, 0, 0);
        const answer = expT(a, b, 0, k);
        const s = vShift(k);
        return {
          ...expressionProblem({
            prompt: t(
              `The graph of $f(x) = ${f}$ is translated ${s.en} to give the graph of $g$. Write $g(x)$.`,
              `把 $f(x) = ${f}$ 的图象${s["zh-CN"]}，得到 $g$ 的图象。写出 $g(x)$。`,
            ),
            answer,
            prefix: "g(x) =",
            wrong: [expT(a, b, 0, -k), expT(a, b, -k, 0), expT(a, b, k, 0)],
            solution: t(
              `${label(1, "Translate the outputs", "平移函数值").en} Moving ${s.en} adds $${k}$ to every output, so $k = ${k}$ is added to the whole function, outside the power:${steps(`g(x) = f(x)${plusK(k)}`)}${label(2, "Substitute", "代入").en} Replace $f(x)$ with $${f}$:${steps(`g(x) = ${answer}`)}{{figure 0}}

**Check.** The $y$-intercept of $f$ is $f(0) = ${a}$, and $g(0) = ${a}${plusK(k)} = ${a + k}$, which is ${s.en} from it. The asymptote moves from $y = 0$ to $y = ${k}$.`,
              `${label(1, "Translate the outputs", "平移函数值")["zh-CN"]} ${s["zh-CN"]}就是给每个函数值加上 $${k}$，所以要在整个函数（幂的外面）加上 $k = ${k}$：${steps(`g(x) = f(x)${plusK(k)}`)}${label(2, "Substitute", "代入")["zh-CN"]} 用 $${f}$ 代替 $f(x)$：${steps(`g(x) = ${answer}`)}{{figure 0}}

**检验。** $f$ 的 $y$ 轴截距是 $f(0) = ${a}$，而 $g(0) = ${a}${plusK(k)} = ${a + k}$，正是把它${s["zh-CN"]}。渐近线从 $y = 0$ 移到 $y = ${k}$。`,
            ),
          }),
          solutionFigures: [moveFigure(a, b, k)],
        };
      },
    },
    {
      id: "translated-growth-graph-equations",
      figure: algebraDrawings2["vertical-translations-of-exponential-growth-functions#translated-growth-graph-equations"],
      title: t("The equation from the graph", "由图象求解析式"),
      explanation: t(
        `The graph of $y = b^{x} + k$ is the graph of $y = b^{x}$ moved $k$ units vertically. The asymptote $y = 0$ of $b^{x}$ moves to $y = k$, so the dashed asymptote gives $k$ directly.

Then a point gives $b$. At $x = 1$ the height is $b^{1} + k = b + k$. If the asymptote is $y = -2$ and the graph passes through $(1, 1)$, then $k = -2$ and

$$b - 2 = 1 \\implies b = 3, \\qquad y = 3^{x} - 2$$

Check with another point: at $x = 0$, $3^{0} - 2 = -1$, so the graph should cross the $y$-axis at $(0, -1)$.

> **Watch out.** The height at $x = 1$ is $b + k$, not $b$: subtract $k$ before you read off the base. And the asymptote gives $k$ with its sign: an asymptote $y = -2$ means $-2$ is added, $y = b^{x} - 2$.`,
        `$y = b^{x} + k$ 的图象是把 $y = b^{x}$ 的图象竖直平移 $k$ 个单位得到的。$b^{x}$ 的渐近线 $y = 0$ 移到 $y = k$，所以由虚线渐近线可以直接读出 $k$。

再用一个点求 $b$。$x = 1$ 时高度是 $b^{1} + k = b + k$。若渐近线是 $y = -2$，图象经过 $(1, 1)$，则 $k = -2$，且

$$b - 2 = 1 \\implies b = 3, \\qquad y = 3^{x} - 2$$

用另一个点检验：$x = 0$ 时 $3^{0} - 2 = -1$，所以图象应与 $y$ 轴交于 $(0, -1)$。

> **注意。** $x = 1$ 处的高度是 $b + k$，不是 $b$：要先减去 $k$ 才能得到底数。渐近线给出的 $k$ 带着符号：渐近线 $y = -2$ 表示加上 $-2$，即 $y = b^{x} - 2$。`,
      ),
      generate(rng) {
        for (;;) {
          const b = rng.pick([2, 3, 4, 5, 6]);
          const k = rng.int(-5, 8);
          if (b + k > 9 || k === 0 || k === -1 || k === -2 || b + k === 0 || b + k === -1) continue;
          const B = Q.of(b);
          const answer = expT(1, B, 0, k);
          return annotate(
            {
              ...expressionProblem({
                prompt: t(
                  `The graph of $y = b^{x} + k$ is shown, with its horizontal asymptote dashed. Find its equation.`,
                  `如图是 $y = b^{x} + k$ 的图象，虚线是它的水平渐近线。求它的解析式。`,
                ),
                answer,
                prefix: "y =",
                wrong: [expT(1, B, 0, -k), expT(1, B, 0, 1 + k), expT(1, Q.of(b + k), 0, k), expT(1, B, -k, 0)],
                solution: t(
                  `${label(1, "Read the asymptote", "读出渐近线").en} The dashed asymptote is $y = ${k}$. The asymptote $y = 0$ of $b^{x}$ moved there, so $k = ${k}$.

${label(2, "Use a point", "用一个点").en} The graph passes through $(1, ${b + k})$, and at $x = 1$ the height is $b^{1}${plusK(k)}$:${steps(`b${plusK(k)} = ${b + k}`, `b = ${b}`)}So the equation is $y = ${answer}$.

**Check.** At $x = 0$: $${b}^{0}${plusK(k)} = ${1 + k}$, and the graph does cross the $y$-axis at $(0, ${1 + k})$.`,
                  `${label(1, "Read the asymptote", "读出渐近线")["zh-CN"]} 虚线渐近线是 $y = ${k}$。$b^{x}$ 的渐近线 $y = 0$ 移到了这里，所以 $k = ${k}$。

${label(2, "Use a point", "用一个点")["zh-CN"]} 图象经过 $(1, ${b + k})$，而 $x = 1$ 时高度是 $b^{1}${plusK(k)}$：${steps(`b${plusK(k)} = ${b + k}`, `b = ${b}`)}所以解析式是 $y = ${answer}$。

**检验。** $x = 0$ 时 $${b}^{0}${plusK(k)} = ${1 + k}$，图象确实与 $y$ 轴交于 $(0, ${1 + k})$。`,
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
            },
            expView,
            [{ kind: "line", a: [0, k], b: [1, k], dashed: true, tone: "result" }, ...shift([0, 1], [0, 1 + k])],
            `The graph of y = ${b}^x moved so that its asymptote is y = ${k}.`,
            `y = ${b}^x 的图象平移，渐近线变为 y = ${k}。`,
          );
        }
      },
    },
    {
      id: "values-of-translated-growth-functions",
      figure: algebraDrawings3["vertical-translations-of-exponential-growth-functions#values-of-translated-growth-functions"],
      title: t("Values and the y-intercept", "函数值与 y 轴截距"),
      explanation: t(
        `To evaluate $a \\cdot b^{x} + k$, follow the order of operations: the power first, then the multiplication by $a$, and the translation $k$ last. For $g(x) = 3(2)^{x} + 4$:

$$g(-1) = 3(2)^{-1} + 4 = 3 \\cdot \\frac{1}{2} + 4 = \\frac{11}{2}$$

The $y$-intercept is the value at $x = 0$. Since $b^{0} = 1$, it is always $a + k$: here $g(0) = 3 \\cdot 1 + 4 = 7$. The graph of $3(2)^{x}$ crosses the $y$-axis at $3$, and the translation moves that point $4$ up.

> **Watch out.** Raise only $b$ to the power: $3(2)^{-1}$ is $3 \\cdot \\frac{1}{2}$, not $6^{-1}$. A power of $0$ is $1$, not $0$, and a negative exponent gives a fraction, not a negative number. Add $k$ at the end, after multiplying.`,
        `计算 $a \\cdot b^{x} + k$ 时要按运算顺序：先算幂，再乘以 $a$，最后加上平移量 $k$。对 $g(x) = 3(2)^{x} + 4$：

$$g(-1) = 3(2)^{-1} + 4 = 3 \\cdot \\frac{1}{2} + 4 = \\frac{11}{2}$$

$y$ 轴截距是 $x = 0$ 处的函数值。因为 $b^{0} = 1$，它总是 $a + k$：这里 $g(0) = 3 \\cdot 1 + 4 = 7$。$3(2)^{x}$ 的图象与 $y$ 轴交于 $3$，平移把这个点向上移动 $4$。

> **注意。** 只有 $b$ 取幂：$3(2)^{-1}$ 是 $3 \\cdot \\frac{1}{2}$，不是 $6^{-1}$。$0$ 次幂等于 $1$，不是 $0$；负指数得到分数，不是负数。乘完之后最后才加 $k$。`,
      ),
      generate(rng) {
        const a = rng.pick([1, 2, 3, 4, 5]);
        const b = rng.pick([2, 3, 4, 5]);
        const k = rng.nonZero(-9, 9);
        const c = rng.pick([-1, 0, 0, 1, 2, 3]);
        const B = Q.of(b);
        const g = expT(a, B, 0, k);
        const power = B.pow(c);
        const product = power.mul(Q.of(a));
        const value = product.add(Q.of(k));
        const intercept = c === 0 && rng.bool();
        const pw = a === 1 ? `${b}^{${c}}` : `${a}(${b})^{${c}}`;
        const times = a === 1 ? num(power) : `${a} \\cdot ${num(power)}`;
        const walk = Array.from({ length: Math.abs(c) + 1 }, (_, j) => num(B.pow(c > 0 ? j : -j).mul(Q.of(a)))).join(" \\to ");
        return numberProblem({
          prompt: intercept
            ? t(`What is the $y$-intercept of the graph of $g(x) = ${g}$?`, `$g(x) = ${g}$ 的图象的 $y$ 轴截距是多少？`)
            : t(`For $g(x) = ${g}$, find $g(${c})$.`, `已知 $g(x) = ${g}$，求 $g(${c})$。`),
          answer: value,
          wrong: [
            product,
            Q.of(a * b)
              .pow(c)
              .add(Q.of(k)),
            Q.of(a * b * c + k),
            B.pow(c).mul(Q.of(a + k)),
          ],
          solution: t(
            `${label(1, "The power", "算幂").en} ${intercept ? "The $y$-intercept is the value at $x = 0$. " : ""}Substitute $x = ${c}$ and raise only the base $${b}$ to the power: $${b}^{${c}} = ${num(power)}$.

${label(2, "Multiply, then add", "先乘后加").en} ${a === 1 ? "There is no coefficient to multiply by, so add" : `Multiply by $${a}$, then add`} the translation $${k}$:${steps(chain(`g(${c}) = ${pw}${plusK(k)}`, `${times}${plusK(k)}`, `${num(product)}${plusK(k)}`, num(value)))}**Check.** ${c === 0 ? `Every power with exponent $0$ is $1$, so the value at $x = 0$ is $a + k = ${a}${plusK(k)} = ${num(value)}$, as for every $y$-intercept of $a \\cdot b^{x} + k$.` : `The part $${expT(a, B, 0, 0)}$ is $${a}$ at $x = 0$ and is ${c > 0 ? "multiplied" : "divided"} by $${b}$ for each step of $1$ to the ${c > 0 ? "right" : "left"}: $${walk}$. Adding $${k}$ gives $${num(value)}$.`}`,
            `${label(1, "The power", "算幂")["zh-CN"]} ${intercept ? "$y$ 轴截距是 $x = 0$ 处的函数值。" : ""}代入 $x = ${c}$，只有底数 $${b}$ 取幂：$${b}^{${c}} = ${num(power)}$。

${label(2, "Multiply, then add", "先乘后加")["zh-CN"]} ${a === 1 ? "没有系数要乘，直接加上" : `乘以 $${a}$，再加上`}平移量 $${k}$：${steps(chain(`g(${c}) = ${pw}${plusK(k)}`, `${times}${plusK(k)}`, `${num(product)}${plusK(k)}`, num(value)))}**检验。** ${c === 0 ? `指数为 $0$ 的幂都等于 $1$，所以 $x = 0$ 处的函数值是 $a + k = ${a}${plusK(k)} = ${num(value)}$，$a \\cdot b^{x} + k$ 的 $y$ 轴截距都是这样。` : `$${expT(a, B, 0, 0)}$ 这部分在 $x = 0$ 时是 $${a}$，$x$ 每${c > 0 ? "增加 $1$ 就乘以" : "减少 $1$ 就除以"} $${b}$：$${walk}$。再加上 $${k}$ 得 $${num(value)}$。`}`,
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
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSF.BF.B.3", "CCSS.HSF.IF.C.7.E"],
  intro: t(
    `A decay function $y = a \\left(\\frac{1}{b}\\right)^{x}$ with $a > 0$ and $b > 1$ falls from left to right and comes closer and closer to the $x$-axis on the **right**. Its base is between $0$ and $1$, so a negative exponent gives a large value: $\\left(\\frac{1}{2}\\right)^{-2} = 2^{2} = 4$.

A vertical translation works exactly as for growth functions: adding $k$ moves every point and the asymptote $k$ units. Take $f(x) = \\left(\\frac{1}{2}\\right)^{x}$ moved $4$ units down, $g(x) = \\left(\\frac{1}{2}\\right)^{x} - 4$:

$$\\begin{array}{c|ccc} x & -2 & -1 & 0 \\\\ \\hline f(x) & 4 & 2 & 1 \\\\ g(x) & 0 & -2 & -3 \\end{array}$$

{{figure 0}}

The asymptote is now $y = -4$, and something new happens: the graph moved down crosses the $x$-axis, here at $x = -2$, where $\\left(\\frac{1}{2}\\right)^{x}$ equals $4$.

In this lesson we write translated decay functions, find their equations from graphs, and find where a translated graph crosses the $x$-axis by solving an exponential equation.`,
    `衰减函数 $y = a \\left(\\frac{1}{b}\\right)^{x}$（$a > 0$，$b > 1$）的图象从左到右下降，在**右侧**越来越靠近 $x$ 轴。它的底数在 $0$ 和 $1$ 之间，所以负指数会得到较大的值：$\\left(\\frac{1}{2}\\right)^{-2} = 2^{2} = 4$。

竖直平移与增长函数完全一样：加上 $k$，每个点和渐近线都移动 $k$ 个单位。把 $f(x) = \\left(\\frac{1}{2}\\right)^{x}$ 向下平移 $4$ 个单位，得 $g(x) = \\left(\\frac{1}{2}\\right)^{x} - 4$：

$$\\begin{array}{c|ccc} x & -2 & -1 & 0 \\\\ \\hline f(x) & 4 & 2 & 1 \\\\ g(x) & 0 & -2 & -3 \\end{array}$$

{{figure 0}}

渐近线变为 $y = -4$，还出现了新情况：向下平移后的图象与 $x$ 轴相交，这里交于 $x = -2$，此处 $\\left(\\frac{1}{2}\\right)^{x}$ 等于 $4$。

这节课我们写出平移后的衰减函数，根据图象求解析式，并通过解指数方程求平移后的图象与 $x$ 轴的交点。`,
  ),
  introFigures: [moveFigure(1, Q.of(1, 2), -4)],
  knowledgePoints: [
    {
      id: "translating-decay-graphs",
      figure: algebraDrawings2["vertical-translations-of-exponential-decay-functions#translating-decay-graphs"],
      title: t("Writing the translated function", "写出平移后的函数"),
      explanation: t(
        `Decay functions translate the same way as growth functions: adding $k$ to the whole function moves the graph and its asymptote $k$ units vertically, and the base stays as it is. For $f(x) = 4\\left(\\frac{1}{3}\\right)^{x}$ moved $2$ units up:

$$g(x) = f(x) + 2 = 4\\left(\\frac{1}{3}\\right)^{x} + 2$$

The $y$-intercept $(0, 4)$ moves to $(0, 6)$, and the graph now falls toward the asymptote $y = 2$ instead of the $x$-axis.

> **Watch out.** Keep the base $\\frac{1}{3}$: changing it to $3$ turns decay into growth. Up means adding, down means subtracting, and the number goes outside the power; $\\left(\\frac{1}{3}\\right)^{x - 2}$ is a horizontal shift.`,
        `衰减函数的平移方法与增长函数相同：给整个函数加上 $k$，图象和渐近线一起竖直移动 $k$ 个单位，底数不变。把 $f(x) = 4\\left(\\frac{1}{3}\\right)^{x}$ 向上平移 $2$ 个单位：

$$g(x) = f(x) + 2 = 4\\left(\\frac{1}{3}\\right)^{x} + 2$$

$y$ 轴截距 $(0, 4)$ 移到 $(0, 6)$，现在图象下降时趋近的是渐近线 $y = 2$，而不是 $x$ 轴。

> **注意。** 底数 $\\frac{1}{3}$ 保持不变：改成 $3$ 会把衰减变成增长。向上是加，向下是减，而且这个数要加在幂的外面；$\\left(\\frac{1}{3}\\right)^{x - 2}$ 是左右平移。`,
      ),
      generate(rng) {
        const a = rng.pick([1, 1, 2, 3, 5]);
        const b = Q.of(1, rng.pick([2, 3, 4, 5, 10]));
        const k = rng.nonZero(-6, 6);
        const f = expT(a, b, 0, 0);
        const answer = expT(a, b, 0, k);
        const s = vShift(k);
        return {
          ...expressionProblem({
            prompt: t(
              `The graph of $f(x) = ${f}$ is translated ${s.en} to give the graph of $g$. Write $g(x)$.`,
              `把 $f(x) = ${f}$ 的图象${s["zh-CN"]}，得到 $g$ 的图象。写出 $g(x)$。`,
            ),
            answer,
            prefix: "g(x) =",
            wrong: [expT(a, b, 0, -k), expT(a, b, -k, 0), expT(a, Q.one.div(b), 0, k)],
            solution: t(
              `${label(1, "Translate the outputs", "平移函数值").en} Moving ${s.en} adds $${k}$ to every output, so $${k}$ is added to the whole function, outside the power; the base $${num(b)}$ does not change:${steps(`g(x) = f(x)${plusK(k)}`)}${label(2, "Substitute", "代入").en} Replace $f(x)$ with $${f}$:${steps(`g(x) = ${answer}`)}{{figure 0}}

**Check.** $f(0) = ${a}$ and $g(0) = ${a}${plusK(k)} = ${a + k}$, which is ${s.en} from it; the graph still falls, toward the asymptote $y = ${k}$.`,
              `${label(1, "Translate the outputs", "平移函数值")["zh-CN"]} ${s["zh-CN"]}就是给每个函数值加上 $${k}$，所以要在整个函数（幂的外面）加上 $${k}$，底数 $${num(b)}$ 不变：${steps(`g(x) = f(x)${plusK(k)}`)}${label(2, "Substitute", "代入")["zh-CN"]} 用 $${f}$ 代替 $f(x)$：${steps(`g(x) = ${answer}`)}{{figure 0}}

**检验。** $f(0) = ${a}$，$g(0) = ${a}${plusK(k)} = ${a + k}$，正是把它${s["zh-CN"]}；图象仍然下降，趋近渐近线 $y = ${k}$。`,
            ),
          }),
          solutionFigures: [moveFigure(a, b, k)],
        };
      },
    },
    {
      id: "translated-decay-graph-equations",
      figure: algebraDrawings3["vertical-translations-of-exponential-decay-functions#translated-decay-graph-equations"],
      title: t("The equation from the graph", "由图象求解析式"),
      explanation: t(
        `A translated decay graph $y = \\left(\\frac{1}{b}\\right)^{x} + k$ falls from left to right toward its asymptote $y = k$, so the dashed asymptote gives $k$.

To find $b$, use the point at $x = -1$, because $\\left(\\frac{1}{b}\\right)^{-1} = b$: the height there is $b + k$. With asymptote $y = 1$ and the point $(-1, 4)$:

$$b + 1 = 4 \\implies b = 3, \\qquad y = \\left(\\frac{1}{3}\\right)^{x} + 1$$

Check with the $y$-intercept: $\\left(\\frac{1}{3}\\right)^{0} + 1 = 2$, so the graph should pass through $(0, 2)$.

> **Watch out.** The height at $x = -1$ is $b + k$: subtract $k$ before reading off $b$. The base of the answer is $\\frac{1}{b}$, not $b$, since the graph falls; a base of $3$ would make it rise.`,
        `平移后的衰减函数 $y = \\left(\\frac{1}{b}\\right)^{x} + k$ 的图象从左到右下降，趋近渐近线 $y = k$，所以由虚线渐近线可以读出 $k$。

求 $b$ 时用 $x = -1$ 处的点，因为 $\\left(\\frac{1}{b}\\right)^{-1} = b$：这一点的高度是 $b + k$。若渐近线是 $y = 1$，图象经过 $(-1, 4)$：

$$b + 1 = 4 \\implies b = 3, \\qquad y = \\left(\\frac{1}{3}\\right)^{x} + 1$$

用 $y$ 轴截距检验：$\\left(\\frac{1}{3}\\right)^{0} + 1 = 2$，所以图象应经过 $(0, 2)$。

> **注意。** $x = -1$ 处的高度是 $b + k$：要先减去 $k$ 才能得到 $b$。答案的底数是 $\\frac{1}{b}$，不是 $b$，因为图象下降；底数为 $3$ 时图象会上升。`,
      ),
      generate(rng) {
        for (;;) {
          const b = rng.pick([2, 3, 4, 5, 6]);
          const k = rng.int(-5, 8);
          if (b + k > 9 || k === 0 || k === -1 || k === -2 || b + k === 0 || b + k === -1) continue;
          const B = Q.of(1, b);
          const answer = expT(1, B, 0, k);
          return annotate(
            {
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
                  `${label(1, "Read the asymptote", "读出渐近线").en} The dashed asymptote is $y = ${k}$, the $x$-axis moved, so $k = ${k}$.

${label(2, "Use a point", "用一个点").en} The graph passes through $(-1, ${b + k})$. At $x = -1$ the power is $\\left(\\frac{1}{b}\\right)^{-1} = b$, so the height is $b${plusK(k)}$:${steps(`b${plusK(k)} = ${b + k}`, `b = ${b}`)}So the equation is $y = ${answer}$.

**Check.** At $x = 0$: $${expT(1, B, 0, 0).replace("{x}", "{0}")}${plusK(k)} = ${1 + k}$, and the graph does cross the $y$-axis at $(0, ${1 + k})$.`,
                  `${label(1, "Read the asymptote", "读出渐近线")["zh-CN"]} 虚线渐近线是 $y = ${k}$，即平移后的 $x$ 轴，所以 $k = ${k}$。

${label(2, "Use a point", "用一个点")["zh-CN"]} 图象经过 $(-1, ${b + k})$。$x = -1$ 时幂为 $\\left(\\frac{1}{b}\\right)^{-1} = b$，所以高度是 $b${plusK(k)}$：${steps(`b${plusK(k)} = ${b + k}`, `b = ${b}`)}所以解析式是 $y = ${answer}$。

**检验。** $x = 0$ 时 $${expT(1, B, 0, 0).replace("{x}", "{0}")}${plusK(k)} = ${1 + k}$，图象确实与 $y$ 轴交于 $(0, ${1 + k})$。`,
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
            },
            expView,
            [{ kind: "line", a: [-1, k], b: [0, k], dashed: true, tone: "result" }, ...shift([-1, b], [-1, b + k])],
            `The graph of y = (1/${b})^x moved so that its asymptote is y = ${k}; the point (-1, ${b}) moves to (-1, ${b + k}).`,
            `y = (1/${b})^x 的图象平移，渐近线变为 y = ${k}；点 (-1, ${b}) 移到 (-1, ${b + k})。`,
          );
        }
      },
    },
    {
      id: "x-intercepts-of-translated-graphs",
      figure: algebraDrawings2["vertical-translations-of-exponential-decay-functions#x-intercepts-of-translated-graphs"],
      title: t("The $x$-intercept", "$x$ 轴截距"),
      explanation: t(
        `A graph moved down below the $x$-axis crosses it. The $x$-intercept is where the function is $0$, so set it equal to $0$, isolate the power, and write both sides as powers of the same base:

$$3\\left(\\frac{1}{2}\\right)^{x} - 24 = 0 \\implies 3\\left(\\frac{1}{2}\\right)^{x} = 24 \\implies \\left(\\frac{1}{2}\\right)^{x} = 8$$

Since $8 = 2^{3} = \\left(\\frac{1}{2}\\right)^{-3}$, the $x$-intercept is at $x = -3$. Check: $3 \\cdot 8 - 24 = 0$. A decay graph reaches large values on the left, so it crosses on the left of the $y$-axis; a growth graph crosses on the right.

> **Watch out.** The number $24$, or $8$ after dividing, is the value of the power, not $x$. For a decay base the exponent is negative: $\\left(\\frac{1}{2}\\right)^{x} = 8$ gives $x = -3$, not $3$. Divide by the coefficient before matching bases.`,
        `向下平移到 $x$ 轴下方的图象会与 $x$ 轴相交。$x$ 轴截距处函数值为 $0$，所以令函数等于 $0$，把幂单独留在一边，再把两边写成同底数的幂：

$$3\\left(\\frac{1}{2}\\right)^{x} - 24 = 0 \\implies 3\\left(\\frac{1}{2}\\right)^{x} = 24 \\implies \\left(\\frac{1}{2}\\right)^{x} = 8$$

因为 $8 = 2^{3} = \\left(\\frac{1}{2}\\right)^{-3}$，$x$ 轴截距在 $x = -3$。检验：$3 \\cdot 8 - 24 = 0$。衰减函数的图象在左侧取较大的值，所以在 $y$ 轴左侧与 $x$ 轴相交；增长函数的图象在右侧相交。

> **注意。** $24$（除以系数后是 $8$）是幂的值，不是 $x$。底数是衰减底数时指数为负：$\\left(\\frac{1}{2}\\right)^{x} = 8$ 得 $x = -3$，不是 $3$。要先除以系数，再比较底数。`,
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
        const power = expT(1, B, 0, 0);
        const at = power.replace("{x}", `{${x}}`);
        const lines = [`${g} = 0`];
        if (a !== 1) lines.push(`${expT(a, B, 0, 0)} = ${-k}`);
        lines.push(`${power} = ${b ** mm} = ${decay ? `${b}^{${mm}} = ${at}` : at}`, `x = ${x}`);
        return numberProblem({
          prompt: t(
            `Find the $x$-intercept of the graph of $g(x) = ${g}$. Give its $x$-coordinate.`,
            `求 $g(x) = ${g}$ 的图象与 $x$ 轴交点的横坐标。`,
          ),
          answer: x,
          solveFor: "x",
          wrong: [-x, -k, Q.of(-k, a)],
          solution: t(
            `${label(1, "Set the function equal to $0$", "令函数值为 $0$").en} The graph crosses the $x$-axis where $g(x) = 0$. Add $${-k}$ to both sides${a === 1 ? "" : `, then divide by $${a}$`}, so the power stands alone.

${label(2, "Match the bases", "化为同底数").en} Write $${b ** mm}$ as a power of $${num(B)}$${decay ? `: $${b ** mm} = ${b}^{${mm}}$, and $${b} = \\left(\\frac{1}{${b}}\\right)^{-1}$, so the exponent is $-${mm}$` : ""}:${steps(...lines)}**Check.** $g(${x}) = ${a === 1 ? "" : `${a} \\cdot `}${b ** mm} - ${-k} = 0$, so the graph crosses the $x$-axis at $(${x}, 0)$, on the ${x < 0 ? "left" : "right"} of the $y$-axis as a ${decay ? "decay" : "growth"} graph should.`,
            `${label(1, "Set the function equal to $0$", "令函数值为 $0$")["zh-CN"]} 图象在 $g(x) = 0$ 处与 $x$ 轴相交。两边同时加上 $${-k}$${a === 1 ? "" : `，再除以 $${a}$`}，使幂单独留在一边。

${label(2, "Match the bases", "化为同底数")["zh-CN"]} 把 $${b ** mm}$ 写成 $${num(B)}$ 的幂${decay ? `：$${b ** mm} = ${b}^{${mm}}$，而 $${b} = \\left(\\frac{1}{${b}}\\right)^{-1}$，所以指数是 $-${mm}$` : ""}：${steps(...lines)}**检验。** $g(${x}) = ${a === 1 ? "" : `${a} \\cdot `}${b ** mm} - ${-k} = 0$，所以图象与 $x$ 轴交于 $(${x}, 0)$，在 $y$ 轴${x < 0 ? "左" : "右"}侧，符合${decay ? "衰减" : "增长"}函数的图象。`,
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
  ],
  xp: 15,
  standards: ["CCSS.HSF.IF.B.4", "CCSS.HSF.LE.B.5"],
  intro: t(
    `An exponential model $y = a \\cdot b^{t}$ describes a quantity that is multiplied by the same factor $b$ in every time unit. We know how to read such a formula: $a$ is the starting value, and $b = 1 + r$ for growth by $r$, or $b = 1 - r$ for decay by $r$, per time unit. A graph carries the same information, and we can read it back.

Take the graph through $(0, 3)$ and $(1, 6)$:

{{figure 0}}

- The starting value is the height at $t = 0$: $a = 3$.
- The factor is the ratio of the heights one time unit apart: $b = \\frac{6}{3} = 2 = 1 + 1$, a growth of $100\\%$ per time unit.
- So the model is $y = 3 \\cdot 2^{t}$, and it predicts $y = 3 \\cdot 2^{3} = 24$ at $t = 3$, beyond the part of the graph we can read.

When the model is translated, $y = a \\cdot b^{t} + k$, the asymptote $y = k$ also has a meaning: it is the level the quantity approaches in the long run. In this lesson we read percent rates of change, predictions and long-run levels from graphs.`,
    `指数模型 $y = a \\cdot b^{t}$ 描述的量每个单位时间都乘以同一个倍数 $b$。我们会读这样的式子：$a$ 是初始值，每单位时间增长 $r$ 时 $b = 1 + r$，减少 $r$ 时 $b = 1 - r$。图象包含同样的信息，我们也能把它读出来。

看经过 $(0, 3)$ 和 $(1, 6)$ 的图象：

{{figure 0}}

- 初始值是 $t = 0$ 处的高度：$a = 3$。
- 倍数是相隔一个单位时间的两个高度之比：$b = \\frac{6}{3} = 2 = 1 + 1$，即每单位时间增长 $100\\%$。
- 所以模型是 $y = 3 \\cdot 2^{t}$，它预测 $t = 3$ 时 $y = 3 \\cdot 2^{3} = 24$，这已经超出了图上能读到的部分。

模型平移后为 $y = a \\cdot b^{t} + k$，这时渐近线 $y = k$ 也有含义：它是这个量长期趋近的水平。这节课我们从图象读出百分变化率、预测值和长期水平。`,
  ),
  introFigures: [modelFigure(3, Q.of(2), 0)],
  knowledgePoints: [
    {
      id: "percent-change-from-a-graph",
      figure: algebraDrawings2["interpreting-graphs-of-exponential-functions#percent-change-from-a-graph"],
      title: t("The percent rate of change", "百分变化率"),
      explanation: t(
        `In a model $y = a \\cdot b^{t}$, the graph meets the vertical axis at the starting value $a$, and each step of $1$ in $t$ multiplies $y$ by $b$. So the factor is the ratio of two heights one time unit apart, and the percent rate is how far $b$ is from $1$.

If the graph passes through $(0, 4)$ and $(1, 6)$, then $b = \\frac{6}{4} = 1.5 = 1 + 0.5$: the quantity grows by $50\\%$ per time unit. If it passes through $(0, 8)$ and $(1, 6)$, then $b = \\frac{6}{8} = 0.75 = 1 - 0.25$: it falls by $25\\%$ per time unit.

> **Watch out.** The rate is $b - 1$ (or $1 - b$), not $b$: a factor of $1.5$ is $50\\%$ growth, not $150\\%$. And divide, do not subtract: going from $4$ to $6$ is a change of $2$ units but a change of $\\frac{2}{4} = 50\\%$.`,
        `模型 $y = a \\cdot b^{t}$ 的图象与纵轴交于初始值 $a$，$t$ 每增加 $1$，$y$ 就乘以 $b$。所以倍数是相隔一个单位时间的两个高度之比，百分变化率是 $b$ 与 $1$ 的差距。

若图象经过 $(0, 4)$ 和 $(1, 6)$，则 $b = \\frac{6}{4} = 1.5 = 1 + 0.5$：这个量每单位时间增长 $50\\%$。若经过 $(0, 8)$ 和 $(1, 6)$，则 $b = \\frac{6}{8} = 0.75 = 1 - 0.25$：每单位时间减少 $25\\%$。

> **注意。** 变化率是 $b - 1$（或 $1 - b$），不是 $b$：倍数 $1.5$ 表示增长 $50\\%$，不是 $150\\%$。要用除法而不是减法：从 $4$ 到 $6$ 变化了 $2$ 个单位，但变化率是 $\\frac{2}{4} = 50\\%$。`,
      ),
      generate(rng) {
        const [a, b] = rng.pick(modelPairs);
        const growth = b.cmp(Q.one) > 0;
        const ctx = rng.pick(growth ? growthContexts : decayContexts);
        const rate = b.sub(Q.one).abs().mul(Q.of(100));
        const y1 = b.mul(Q.of(a));
        const r = b.sub(Q.one).abs();
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
              `${label(1, "Read two points", "读出两个点").en} At $t = 0$ the graph is at $${a}$, the starting value, and one ${ctx.per.en} later, at $t = 1$, it is at $${num(y1)}$.

${label(2, "The factor", "倍数").en} Each ${ctx.per.en} multiplies the quantity by the factor $b$, which is therefore the ratio of the two heights:${steps(`b = \\frac{${num(y1)}}{${a}} = ${dec(b)} = 1 ${growth ? "+" : "-"} ${dec(r)}`)}${label(3, "The percent", "百分率").en} The factor is $${dec(r)}$ ${growth ? "more" : "less"} than $1$, so the quantity ${growth ? "increases" : "decreases"} by $${dec(r)} = ${num(rate)}\\%$ each ${ctx.per.en}.

**Check.** $${a}(1 ${growth ? "+" : "-"} ${dec(r)}) = ${a} \\cdot ${dec(b)} = ${num(y1)}$, the height of the graph at $t = 1$.`,
              `${label(1, "Read two points", "读出两个点")["zh-CN"]} $t = 0$ 时图象高度为 $${a}$，即初始值；一个单位时间后，即 $t = 1$ 时，高度为 $${num(y1)}$。

${label(2, "The factor", "倍数")["zh-CN"]} 这个量${ctx.per["zh-CN"]}乘以倍数 $b$，因此 $b$ 是两个高度之比：${steps(`b = \\frac{${num(y1)}}{${a}} = ${dec(b)} = 1 ${growth ? "+" : "-"} ${dec(r)}`)}${label(3, "The percent", "百分率")["zh-CN"]} 倍数比 $1$ ${growth ? "大" : "小"} $${dec(r)}$，所以这个量${ctx.per["zh-CN"]}${growth ? "增长" : "减少"} $${dec(r)} = ${num(rate)}\\%$。

**检验。** $${a}(1 ${growth ? "+" : "-"} ${dec(r)}) = ${a} \\cdot ${dec(b)} = ${num(y1)}$，正是图象在 $t = 1$ 处的高度。`,
            ),
          }),
          figure: modelFigure(a, b, 0),
        };
      },
    },
    {
      id: "predicting-from-a-graph",
      figure: algebraDrawings3["interpreting-graphs-of-exponential-functions#predicting-from-a-graph"],
      title: t("Predicting later values", "预测以后的值"),
      explanation: t(
        `Once the graph gives $a$ and $b$, the model predicts values beyond the part that is drawn. From $(0, 2)$ and $(1, 3)$: $a = 2$ and $b = \\frac{3}{2}$, so after $3$ time units

$$y = 2\\left(\\frac{3}{2}\\right)^{3} = 2 \\cdot \\frac{27}{8} = \\frac{27}{4} = 6.75$$

Step by step, each time unit multiplies by $\\frac{3}{2}$: $2 \\to 3 \\to 4.5 \\to 6.75$. The increases are $1$, $1.5$, $2.25$: they grow, because the quantity grows by the same percent, not by the same amount.

> **Watch out.** Do not continue the graph as a straight line: adding the first increase $1$ each time would give $5$, not $6.75$. The exponent is $t$ itself, so after $3$ time units the factor $b$ appears $3$ times, and the starting value $a$ stays in front.`,
        `从图象得到 $a$ 和 $b$ 后，就能用模型预测图上画出部分以外的值。由 $(0, 2)$ 和 $(1, 3)$ 得 $a = 2$，$b = \\frac{3}{2}$，所以 $3$ 个单位时间后

$$y = 2\\left(\\frac{3}{2}\\right)^{3} = 2 \\cdot \\frac{27}{8} = \\frac{27}{4} = 6.75$$

一步一步看，每个单位时间乘以 $\\frac{3}{2}$：$2 \\to 3 \\to 4.5 \\to 6.75$。增量是 $1$、$1.5$、$2.25$，越来越大，因为这个量每次按相同的百分率增长，而不是增加相同的量。

> **注意。** 不能把图象当作直线延伸：每次都加上第一次的增量 $1$，会得到 $5$，而不是 $6.75$。指数就是 $t$ 本身，所以 $3$ 个单位时间后倍数 $b$ 出现 $3$ 次，初始值 $a$ 仍然乘在前面。`,
      ),
      generate(rng) {
        const [a, b] = rng.pick(modelPairs);
        const growth = b.cmp(Q.one) > 0;
        const ctx = rng.pick(growth ? growthContexts : decayContexts);
        const n = rng.int(2, 4);
        const value = b.pow(n).mul(Q.of(a));
        const y1 = b.mul(Q.of(a));
        const walk = Array.from({ length: n + 1 }, (_, j) => num(b.pow(j).mul(Q.of(a)))).join(" \\to ");
        return {
          ...numberProblem({
            prompt: t(
              `The graph shows ${ctx.what.en}, modeled by $y = a \\cdot b^{t}$. Find the value of $y$ when $t = ${n}$.`,
              `图象表示${ctx.what["zh-CN"]}，模型为 $y = a \\cdot b^{t}$。求 $t = ${n}$ 时 $y$ 的值。`,
            ),
            answer: value,
            wrong: [y1.sub(Q.of(a)).mul(Q.of(n)).add(Q.of(a)), y1.mul(Q.of(n)), b.pow(n - 1).mul(Q.of(a)), b.pow(n)],
            solution: t(
              `${label(1, "Read the model", "读出模型").en} The graph passes through $(0, ${a})$ and $(1, ${num(y1)})$, so $a = ${a}$ and $b = \\frac{${num(y1)}}{${a}} = ${num(b)}$. The model is $y = ${expT(a, b, 0, 0, "t")}$.

${label(2, "Substitute", "代入").en} Put $t = ${n}$ into the model; the power comes first, then the multiplication:${steps(chain(`y = ${expT(a, b, 0, 0, `${n}`)}`, a === 1 ? num(b.pow(n)) : `${a} \\cdot ${num(b.pow(n))}`, num(value)))}**Check.** One ${ctx.per.en} at a time, the quantity is multiplied by $${num(b)}$: $${walk}$.`,
              `${label(1, "Read the model", "读出模型")["zh-CN"]} 图象经过 $(0, ${a})$ 和 $(1, ${num(y1)})$，所以 $a = ${a}$，$b = \\frac{${num(y1)}}{${a}} = ${num(b)}$。模型是 $y = ${expT(a, b, 0, 0, "t")}$。

${label(2, "Substitute", "代入")["zh-CN"]} 把 $t = ${n}$ 代入模型，先算幂，再相乘：${steps(chain(`y = ${expT(a, b, 0, 0, `${n}`)}`, a === 1 ? num(b.pow(n)) : `${a} \\cdot ${num(b.pow(n))}`, num(value)))}**检验。** 一个单位时间一个单位时间地看，这个量每次乘以 $${num(b)}$：$${walk}$。`,
            ),
          }),
          figure: modelFigure(a, b, 0),
        };
      },
    },
    {
      id: "the-long-run-level",
      figure: algebraDrawings2["interpreting-graphs-of-exponential-functions#the-long-run-level"],
      title: t("The long-run level", "长期水平"),
      explanation: t(
        `In a translated model $y = a \\cdot b^{t} + k$ with $0 < b < 1$, the power $b^{t}$ shrinks toward $0$ as $t$ grows, so $y$ levels off at the asymptote $y = k$: this is the **long-run level** of the quantity. A cooling drink approaches room temperature; a medicine in a steady drip approaches a fixed level.

The total change in the long run is the distance from the starting value to $k$. A drink that starts at $9$ and levels off at $2$ falls by $9 - 2 = 7$ in all. In the model this is $|a|$: $y = 7 \\cdot b^{t} + 2$ starts at $7 + 2 = 9$.

> **Watch out.** The question asks for a change, so subtract: the answer is neither the long-run level $k$ itself nor the starting value. Nor is it the change in the first time unit, which is only part of the total.`,
        `在平移后的模型 $y = a \\cdot b^{t} + k$（$0 < b < 1$）中，随着 $t$ 增大，幂 $b^{t}$ 越来越接近 $0$，所以 $y$ 最终趋于渐近线 $y = k$，这就是这个量的**长期水平**。冷却的饮料趋近室温；持续滴注的药物趋近一个固定水平。

长期的总变化量是初始值与 $k$ 的距离。从 $9$ 开始、最终稳定在 $2$ 的饮料，一共下降 $9 - 2 = 7$。在模型中它就是 $|a|$：$y = 7 \\cdot b^{t} + 2$ 的初始值是 $7 + 2 = 9$。

> **注意。** 题目问的是变化量，所以要相减：答案既不是长期水平 $k$ 本身，也不是初始值，更不是第一个单位时间内的变化量，那只是总变化的一部分。`,
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
          const [hi, lo] = rising ? [k, start] : [start, k];
          return {
            ...numberProblem({
              prompt: t(
                `The graph shows ${ctx.en}, with its asymptote dashed. By how much does the quantity change in all, in the long run?`,
                `图象表示${ctx["zh-CN"]}，虚线是渐近线。从长期看，这个量一共变化了多少？`,
              ),
              answer: a0,
              wrong: [k, start, y1.sub(Q.of(start)).abs()],
              solution: t(
                `${label(1, "The starting value", "初始值").en} At $t = 0$ the graph is at $${start}$.

${label(2, "The long-run level", "长期水平").en} As $t$ grows the graph ${rising ? "rises" : "falls"} toward the dashed asymptote $y = ${k}$ and levels off there, so the long-run level is $${k}$.

${label(3, "The total change", "总变化量").en} The change is the distance between the two levels:${steps(`${hi} - ${lo} = ${a0}`)}**Check.** The model is $y = a \\cdot b^{t} + ${k}$ with $a = ${start} - ${k} = ${a}$; as $b^{t}$ shrinks toward $0$, $y$ moves from $${start}$ to $${k}$, a change of $|a| = ${a0}$. The point $(1, ${num(y1)})$ lies between $${start}$ and $${k}$, as it should.`,
                `${label(1, "The starting value", "初始值")["zh-CN"]} $t = 0$ 时图象高度为 $${start}$。

${label(2, "The long-run level", "长期水平")["zh-CN"]} 随着 $t$ 增大，图象${rising ? "上升" : "下降"}并趋近虚线渐近线 $y = ${k}$，最终稳定在那里，所以长期水平是 $${k}$。

${label(3, "The total change", "总变化量")["zh-CN"]} 变化量是两个水平之间的距离：${steps(`${hi} - ${lo} = ${a0}`)}**检验。** 模型是 $y = a \\cdot b^{t} + ${k}$，其中 $a = ${start} - ${k} = ${a}$；$b^{t}$ 趋近 $0$ 时，$y$ 从 $${start}$ 变到 $${k}$，变化量为 $|a| = ${a0}$。点 $(1, ${num(y1)})$ 在 $${start}$ 与 $${k}$ 之间，符合预期。`,
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

const flipView: PlaneView = { xMin: -5, xMax: 5, yMin: -10, yMax: 10 };

/** flipFigure draws y = a·b^x + k and its reflection across the x-axis, with both asymptotes dashed and an arrow moving the y-intercept. */
function flipFigure(a: number, b: Q, k: number): Figure {
  const marks: PlaneMark[] = [];
  if (k !== 0) {
    marks.push({ kind: "line", a: [flipView.xMin, k], b: [flipView.xMax, k], dashed: true });
    marks.push({ kind: "line", a: [flipView.xMin, -k], b: [flipView.xMax, -k], dashed: true, tone: "result" });
  }
  marks.push(
    { kind: "curve", f: expFn(a, b, 0, k) },
    { kind: "curve", f: expFn(-a, b, 0, -k), accent: true },
    ...shift([0, a + k], [0, -a - k]),
  );
  return {
    svg: plane(flipView, marks),
    alt: t(
      `The graph of f and its mirror image across the x-axis, the graph of g: the y-intercept (0, ${a + k}) moves to (0, ${-a - k})${k === 0 ? ", and the asymptote stays the x-axis" : `, and the asymptote y = ${k} moves to y = ${-k}`}.`,
      `f 的图象和它关于 x 轴的镜像，即 g 的图象：y 轴截距 (0, ${a + k}) 移到 (0, ${-a - k})${k === 0 ? "，渐近线仍是 x 轴" : `，渐近线 y = ${k} 移到 y = ${-k}`}。`,
    ),
  };
}

export const verticalReflectionsOfExponentialFunctions: TopicDef = {
  id: "vertical-reflections-of-exponential-functions",
  title: t("Vertical Reflections of Exponential Functions", "指数函数的上下翻折"),
  summary: t(
    "Reflect exponential graphs across the $x$-axis, read reflected graphs, and find their intercepts.",
    "把指数函数的图象关于 $x$ 轴翻折，根据翻折后的图象求解析式，并求截距。",
  ),
  prerequisites: ["vertical-translations-of-exponential-decay-functions", "vertical-reflections-of-functions"],
  encompasses: [{ topic: "vertical-reflections-of-functions", weight: 0.5 }],
  xp: 14,
  standards: ["CCSS.HSF.BF.B.3", "CCSS.HSF.IF.C.7.E"],
  intro: t(
    `Reflecting a graph across the $x$-axis turns every point $(x, y)$ into $(x, -y)$, so the reflected function is $g(x) = -f(x)$. Apply this to an exponential function. For $f(x) = 2^{x}$ and $g(x) = -2^{x}$:

$$\\begin{array}{c|ccc} x & 0 & 1 & 2 \\\\ \\hline f(x) & 1 & 2 & 4 \\\\ g(x) & -1 & -2 & -4 \\end{array}$$

{{figure 0}}

The graph of $g$ is the graph of $f$ upside down: it lies **below** the $x$-axis and falls ever faster as $x$ grows. The asymptote $y = 0$ is its own mirror image, so it stays. Note that $-2^{x}$ means $-(2^{x})$: the power is computed first, and $-2^{x}$ is never positive.

With a translation as well, the graph of $y = -b^{x} + k$ is the reflected graph moved $k$ units vertically; it lies below its asymptote $y = k$. In this lesson we write reflected functions, read their equations from graphs, and find their intercepts.`,
    `把图象关于 $x$ 轴翻折，每个点 $(x, y)$ 都变成 $(x, -y)$，所以翻折后的函数是 $g(x) = -f(x)$。把它用在指数函数上。对 $f(x) = 2^{x}$ 和 $g(x) = -2^{x}$：

$$\\begin{array}{c|ccc} x & 0 & 1 & 2 \\\\ \\hline f(x) & 1 & 2 & 4 \\\\ g(x) & -1 & -2 & -4 \\end{array}$$

{{figure 0}}

$g$ 的图象是 $f$ 的图象上下颠倒：它位于 $x$ 轴**下方**，随着 $x$ 增大下降得越来越快。渐近线 $y = 0$ 的镜像是它自己，所以不变。注意 $-2^{x}$ 表示 $-(2^{x})$：先算幂，$-2^{x}$ 永远不是正数。

再加上平移，$y = -b^{x} + k$ 的图象就是翻折后的图象竖直平移 $k$ 个单位，它位于渐近线 $y = k$ 的下方。这节课我们写出翻折后的函数，由图象求解析式，并求截距。`,
  ),
  introFigures: [flipFigure(1, Q.of(2), 0)],
  knowledgePoints: [
    {
      id: "reflecting-across-the-x-axis",
      figure: algebraDrawings2["vertical-reflections-of-exponential-functions#reflecting-across-the-x-axis"],
      title: t("Writing the reflected function", "写出翻折后的函数"),
      explanation: t(
        `Reflecting a graph across the $x$-axis negates every output: $g(x) = -f(x)$. The **whole** function is negated, so the minus sign is distributed over every term, the constant term included:

$$f(x) = 2(3)^{x} + 1 \\implies g(x) = -\\left(2(3)^{x} + 1\\right) = -2(3)^{x} - 1$$

The $y$-intercept $(0, 3)$ moves to $(0, -3)$, and the asymptote $y = 1$ moves to its mirror image $y = -1$.

> **Watch out.** Negate both terms: $-2(3)^{x} + 1$ reflects only the power and keeps the asymptote at $y = 1$, which is not a reflection across the $x$-axis. Do not change the base or the exponent either: $\\left(\\frac{1}{3}\\right)^{x} = 3^{-x}$ is a reflection across the $y$-axis.`,
        `把图象关于 $x$ 轴翻折，每个函数值都变为相反数：$g(x) = -f(x)$。要对**整个**函数取相反数，所以负号要分配到每一项，常数项也包括在内：

$$f(x) = 2(3)^{x} + 1 \\implies g(x) = -\\left(2(3)^{x} + 1\\right) = -2(3)^{x} - 1$$

$y$ 轴截距 $(0, 3)$ 移到 $(0, -3)$，渐近线 $y = 1$ 移到它的镜像 $y = -1$。

> **注意。** 两项都要变号：$-2(3)^{x} + 1$ 只翻折了幂，渐近线还在 $y = 1$，这不是关于 $x$ 轴的翻折。也不要改变底数或指数：$\\left(\\frac{1}{3}\\right)^{x} = 3^{-x}$ 是关于 $y$ 轴的翻折。`,
      ),
      generate(rng) {
        const a = rng.pick([1, 2, 3, 4]);
        const b = rng.pick([Q.of(2), Q.of(3), Q.of(4), Q.of(5), Q.of(1, 2), Q.of(1, 3)]);
        const k = rng.int(-6, 6);
        const f = expT(a, b, 0, k);
        const answer = expT(-a, b, 0, -k);
        return {
          ...expressionProblem({
            prompt: t(
              `The graph of $f(x) = ${f}$ is reflected across the $x$-axis to give the graph of $g$. Write $g(x)$.`,
              `把 $f(x) = ${f}$ 的图象关于 $x$ 轴翻折，得到 $g$ 的图象。写出 $g(x)$。`,
            ),
            answer,
            prefix: "g(x) =",
            wrong: [expT(-a, b, 0, k), expT(a, b, 0, -k), expT(a, Q.one.div(b), 0, k)],
            solution: t(
              `${label(1, "Negate the outputs", "函数值取相反数").en} A reflection across the $x$-axis turns each point $(x, y)$ into $(x, -y)$, so $g(x) = -f(x)$.

${label(2, "Distribute the minus sign", "分配负号").en} The minus sign applies to ${k === 0 ? "the whole function" : "both terms"}; the base $${num(b)}$ and the exponent stay as they are:${steps(chain(`g(x) = -\\left(${f}\\right)`, answer))}{{figure 0}}

**Check.** $${chain("f(0)", `${a}${plusK(k)}`, `${a + k}`)}$ and $${chain("g(0)", `${-a}${plusK(-k)}`, `${-a - k}`)}$, its opposite. ${k === 0 ? "The asymptote, the $x$-axis, is its own mirror image." : `The asymptote $y = ${k}$ moves to $y = ${-k}$.`}`,
              `${label(1, "Negate the outputs", "函数值取相反数")["zh-CN"]} 关于 $x$ 轴翻折把每个点 $(x, y)$ 变成 $(x, -y)$，所以 $g(x) = -f(x)$。

${label(2, "Distribute the minus sign", "分配负号")["zh-CN"]} 负号作用于${k === 0 ? "整个函数" : "两项"}；底数 $${num(b)}$ 和指数都不变：${steps(chain(`g(x) = -\\left(${f}\\right)`, answer))}{{figure 0}}

**检验。** $${chain("f(0)", `${a}${plusK(k)}`, `${a + k}`)}$，$${chain("g(0)", `${-a}${plusK(-k)}`, `${-a - k}`)}$，正是它的相反数。${k === 0 ? "渐近线 $x$ 轴的镜像是它自己。" : `渐近线 $y = ${k}$ 移到 $y = ${-k}$。`}`,
            ),
          }),
          solutionFigures: [flipFigure(a, b, k)],
        };
      },
    },
    {
      id: "reflected-graph-equations",
      figure: algebraDrawings3["vertical-reflections-of-exponential-functions#reflected-graph-equations"],
      title: t("The equation from the graph", "由图象求解析式"),
      explanation: t(
        `The graph of $y = -b^{x} + k$ is the graph of $y = b^{x}$ flipped upside down and then moved $k$ units vertically. So it lies **below** its asymptote $y = k$, and a point that was $b^{x}$ above the $x$-axis is now $b^{x}$ below the asymptote.

At $x = 0$ the graph is at $k - 1$, and at $x = 1$ at $k - b$. With asymptote $y = 5$ and the point $(1, 2)$:

$$5 - b = 2 \\implies b = 3, \\qquad y = -3^{x} + 5$$

Check: at $x = 0$ the height is $-1 + 5 = 4$.

> **Watch out.** A graph below its asymptote needs the minus sign in front of the power. The asymptote still gives $k$ with its own sign: reflect first, then shift, so $y = 5$ means $+5$, not $-5$. And read $b$ as the distance from the asymptote, $5 - 2 = 3$, not as the height $2$.`,
        `$y = -b^{x} + k$ 的图象是把 $y = b^{x}$ 的图象上下翻转，再竖直平移 $k$ 个单位得到的。所以它位于渐近线 $y = k$ 的**下方**，原来在 $x$ 轴上方 $b^{x}$ 处的点，现在在渐近线下方 $b^{x}$ 处。

$x = 0$ 时高度为 $k - 1$，$x = 1$ 时为 $k - b$。若渐近线是 $y = 5$，图象经过 $(1, 2)$：

$$5 - b = 2 \\implies b = 3, \\qquad y = -3^{x} + 5$$

检验：$x = 0$ 时高度为 $-1 + 5 = 4$。

> **注意。** 图象在渐近线下方，说明幂前面有负号。渐近线给出的 $k$ 仍带着它自己的符号：先翻折再平移，所以 $y = 5$ 表示 $+5$，不是 $-5$。$b$ 要读作到渐近线的距离 $5 - 2 = 3$，而不是高度 $2$。`,
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
          const pow = decay ? `\\left(\\frac{1}{b}\\right)^{x}` : "b^{x}";
          const powAt = decay ? `\\left(\\frac{1}{b}\\right)^{-1} = b` : "b^{1} = b";
          return annotate(
            {
              ...expressionProblem({
                prompt: t(
                  `The graph shown is the graph of $y = ${decay ? "\\left(\\frac{1}{b}\\right)^{x}" : "b^{x}"}$ for a whole number $b$, reflected across the $x$-axis and then translated vertically. Its asymptote is dashed. Find its equation.`,
                  `如图是 $y = ${decay ? "\\left(\\frac{1}{b}\\right)^{x}" : "b^{x}"}$（$b$ 为整数）的图象关于 $x$ 轴翻折后再竖直平移得到的图象，虚线是它的渐近线。求它的解析式。`,
                ),
                answer,
                prefix: "y =",
                wrong: [expT(1, B, 0, k), expT(-1, B, 0, -k), expT(-1, B, 0, k - 1), expT(-1, Q.one.div(B), 0, k)],
                solution: t(
                  `${label(1, "Read the asymptote", "读出渐近线").en} The asymptote is $y = ${k}$, and the graph lies below it, so the power is reflected and then moved: $y = -${pow}${plusK(k)}$.

${label(2, "Use a point", "用一个点").en} At $x = ${x1}$ the power is $${powAt}$, so the height there is $${k} - b$. The graph passes through $(${x1}, ${k - b})$:${steps(`${k} - b = ${k - b}`, `b = ${b}`)}So the equation is $y = ${answer}$.

**Check.** At $x = 0$: $-1${plusK(k)} = ${k - 1}$, and the graph does cross the $y$-axis at $(0, ${k - 1})$, $1$ unit below the asymptote.`,
                  `${label(1, "Read the asymptote", "读出渐近线")["zh-CN"]} 渐近线是 $y = ${k}$，图象在它下方，所以幂先翻折再平移：$y = -${pow}${plusK(k)}$。

${label(2, "Use a point", "用一个点")["zh-CN"]} $x = ${x1}$ 时幂为 $${powAt}$，所以这一点的高度是 $${k} - b$。图象经过 $(${x1}, ${k - b})$：${steps(`${k} - b = ${k - b}`, `b = ${b}`)}所以解析式是 $y = ${answer}$。

**检验。** $x = 0$ 时 $-1${plusK(k)} = ${k - 1}$，图象确实与 $y$ 轴交于 $(0, ${k - 1})$，在渐近线下方 $1$ 个单位。`,
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
            },
            expView,
            [...shift([x1, b], [x1, -b]), ...shift([x1, -b], [x1, k - b])],
            `The point (${x1}, ${b}) of the unreflected graph flips to (${x1}, ${-b}) and then moves to (${x1}, ${k - b}).`,
            `未翻折图象上的点 (${x1}, ${b}) 翻折到 (${x1}, ${-b})，再移到 (${x1}, ${k - b})。`,
          );
        }
      },
    },
    {
      id: "intercepts-of-reflected-graphs",
      figure: algebraDrawings3["vertical-reflections-of-exponential-functions#intercepts-of-reflected-graphs"],
      title: t("Intercepts", "截距"),
      explanation: t(
        `A reflected graph is found the usual way: set $x = 0$ for the $y$-intercept, and set the function equal to $0$ for the $x$-intercept.

For $g(x) = -a \\cdot b^{x} + k$ with $a > 0$ and $k > 0$, the power is $1$ at $x = 0$, so the $y$-intercept is $g(0) = k - a$. The graph lies below its asymptote $y = k$ and crosses the $x$-axis where $a \\cdot b^{x} = k$:

$$-2(3)^{x} + 18 = 0 \\implies 2(3)^{x} = 18 \\implies 3^{x} = 9 = 3^{2} \\implies x = 2$$

Check: $-2 \\cdot 9 + 18 = 0$, and the $y$-intercept is $-2 + 18 = 16$.

> **Watch out.** At $x = 0$ the power is $1$, so $g(0) = -a + k$: the coefficient is subtracted, not added. For the $x$-intercept, $9$ is the value of $3^{x}$, not of $x$; finish by matching the bases.`,
        `翻折后的图象截距仍按通常的方法求：令 $x = 0$ 得 $y$ 轴截距，令函数值为 $0$ 得 $x$ 轴截距。

对 $g(x) = -a \\cdot b^{x} + k$（$a > 0$，$k > 0$），$x = 0$ 时幂为 $1$，所以 $y$ 轴截距是 $g(0) = k - a$。图象位于渐近线 $y = k$ 下方，在 $a \\cdot b^{x} = k$ 处与 $x$ 轴相交：

$$-2(3)^{x} + 18 = 0 \\implies 2(3)^{x} = 18 \\implies 3^{x} = 9 = 3^{2} \\implies x = 2$$

检验：$-2 \\cdot 9 + 18 = 0$，$y$ 轴截距是 $-2 + 18 = 16$。

> **注意。** $x = 0$ 时幂为 $1$，所以 $g(0) = -a + k$：系数是减去而不是加上。求 $x$ 轴截距时，$9$ 是 $3^{x}$ 的值，不是 $x$ 的值；最后要化成同底数比较指数。`,
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
            solution: t(
              `${label(1, "Substitute $x = 0$", "代入 $x = 0$").en} The $y$-intercept is the value at $x = 0$, where the power is $${b}^{0} = 1$.

${label(2, "Evaluate", "计算").en} The coefficient $${-a}$ multiplies $1$, and then $${k}$ is added:${steps(`g(0) = ${coefL(-a)}${a === 1 ? "" : " \\cdot "}1${plusK(k)} = ${k - a}`)}**Check.** The graph lies below its asymptote $y = ${k}$, and the $y$-intercept $${k - a}$ is $${a}$ below it, $${a}$ being the distance $a \\cdot b^{0}$ at $x = 0$.`,
              `${label(1, "Substitute $x = 0$", "代入 $x = 0$")["zh-CN"]} $y$ 轴截距是 $x = 0$ 处的函数值，此时幂为 $${b}^{0} = 1$。

${label(2, "Evaluate", "计算")["zh-CN"]} 系数 $${-a}$ 乘以 $1$，再加上 $${k}$：${steps(`g(0) = ${coefL(-a)}${a === 1 ? "" : " \\cdot "}1${plusK(k)} = ${k - a}`)}**检验。** 图象在渐近线 $y = ${k}$ 下方，$y$ 轴截距 $${k - a}$ 比它低 $${a}$，而 $${a}$ 正是 $x = 0$ 时的距离 $a \\cdot b^{0}$。`,
            ),
          });
        }
        const lines = [`${g} = 0`, `${expT(a, Q.of(b), 0, 0)} = ${k}`];
        if (a !== 1) lines.push(`${b}^{x} = ${b ** mm}`);
        lines.push(`${b}^{x} = ${b}^{${mm}}`, `x = ${mm}`);
        return numberProblem({
          prompt: t(
            `The graph of $g(x) = ${g}$ crosses the $x$-axis at one point. What is its $x$-coordinate?`,
            `$g(x) = ${g}$ 的图象与 $x$ 轴有一个交点。它的横坐标是多少？`,
          ),
          answer: mm,
          solveFor: "x",
          wrong: [-mm, Q.of(k, a), k],
          solution: t(
            `${label(1, "Set $g(x) = 0$", "令 $g(x) = 0$").en} The graph crosses the $x$-axis where $g(x) = 0$. Add ${a === 1 ? "the power" : `$${expT(a, Q.of(b), 0, 0)}$`} to both sides${a === 1 ? "" : `, then divide by $${a}$`}, so the power stands alone.

${label(2, "Match the bases", "化为同底数").en} Write $${b ** mm}$ as a power of $${b}$${mm === 0 ? `: $1 = ${b}^{0}$` : ""}:${steps(...lines)}**Check.** $g(${mm}) = ${a === 1 ? "-" : `-${a} \\cdot `}${b ** mm}${plusK(k)} = 0$, so the graph crosses the $x$-axis at $(${mm}, 0)$.`,
            `${label(1, "Set $g(x) = 0$", "令 $g(x) = 0$")["zh-CN"]} 图象在 $g(x) = 0$ 处与 $x$ 轴相交。两边同时加上${a === 1 ? "这个幂" : ` $${expT(a, Q.of(b), 0, 0)}$`}${a === 1 ? "" : `，再除以 $${a}$`}，使幂单独留在一边。

${label(2, "Match the bases", "化为同底数")["zh-CN"]} 把 $${b ** mm}$ 写成 $${b}$ 的幂${mm === 0 ? `：$1 = ${b}^{0}$` : ""}：${steps(...lines)}**检验。** $g(${mm}) = ${a === 1 ? "-" : `-${a} \\cdot `}${b ** mm}${plusK(k)} = 0$，所以图象与 $x$ 轴交于 $(${mm}, 0)$。`,
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
    zh.push(`向${h > 0 ? "右" : "左"}平移 $${Math.abs(h)}$ 个单位`);
  }
  if (Math.abs(a) !== 1) {
    en.push(`stretch it vertically by a factor of $${Math.abs(a)}$`);
    zh.push(`竖直方向伸长为原来的 $${Math.abs(a)}$ 倍`);
  }
  if (a < 0) {
    en.push("reflect it across the $x$-axis");
    zh.push("关于 $x$ 轴翻折");
  }
  if (k !== 0) {
    en.push(`shift it ${unitsEn(k)} ${k > 0 ? "up" : "down"}`);
    zh.push(`向${k > 0 ? "上" : "下"}平移 $${Math.abs(k)}$ 个单位`);
  }
  const first = en.join(", then ");
  return t(`${first.charAt(0).toUpperCase()}${first.slice(1)}.`, `${zh.join("，再")}。`);
}

/** hForm writes the exponent x − h, showing for a negative h how it reads as x − h: "x - 2", "x + 3 = x - (-3)", or with first set "x - (-3) = x + 3". */
const hForm = (h: number, first = false) => {
  if (h >= 0) return linear(1, -h);
  return first ? `x - (${h}) = ${linear(1, -h)}` : `${linear(1, -h)} = x - (${h})`;
};

/** pathFigure draws y = b^x and g(x) = a·b^(x − h) + k, with the path of the key point (0, 1) through the shift, the stretch or reflection, and the vertical shift. */
function pathFigure(a: number, b: Q, h: number, k: number): Figure {
  const stages: Point[] = [
    [0, 1],
    [h, 1],
    [h, a],
    [h, a + k],
  ];
  const marks: PlaneMark[] = [];
  if (k !== 0) marks.push({ kind: "line", a: [flipView.xMin, k], b: [flipView.xMax, k], dashed: true, tone: "result" });
  marks.push({ kind: "curve", f: expFn(1, b, 0, 0) }, { kind: "curve", f: expFn(a, b, h, k), accent: true });
  for (let i = 0; i + 1 < stages.length; i++) {
    const [p, q] = [stages[i]!, stages[i + 1]!];
    if (p[0] !== q[0] || p[1] !== q[1]) marks.push({ kind: "arrow", from: p, to: q, tone: "action", thin: true });
  }
  marks.push(
    { kind: "point", at: [0, 1], accent: true },
    { kind: "point", at: [h, a + k], tone: "result", label: ptL([h, a + k]), dir: "e" },
  );
  return {
    svg: plane(flipView, marks),
    alt: t(
      `The graph of y = b^x and the transformed graph of g${k === 0 ? "" : `, with its asymptote y = ${k} dashed`}. Arrows take the key point (0, 1) to (${h}, 1), then to (${h}, ${a}), then to (${h}, ${a + k}).`,
      `y = b^x 的图象和变换后 g 的图象${k === 0 ? "" : `，虚线是它的渐近线 y = ${k}`}。箭头把关键点 (0, 1) 依次移到 (${h}, 1)、(${h}, ${a})、(${h}, ${a + k})。`,
    ),
  };
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
    { topic: "vertical-reflections-of-exponential-functions", weight: 0.3 },
    { topic: "combining-reflections-with-other-graph-transformations", weight: 0.3 },
  ],
  xp: 16,
  standards: ["CCSS.HSF.BF.B.3"],
  intro: t(
    `For any function $f$, the graph of $g(x) = a \\cdot f(x - h) + k$ comes from the graph of $f$ in three moves: a shift of $h$ to the right, a vertical stretch by $|a|$ (with a reflection across the $x$-axis when $a < 0$), and a shift of $k$ up. We have used each move on exponential functions; now we combine them.

Take $f(x) = 2^{x}$ and $g(x) = -2^{x - 1} + 3$, so $h = 1$, $a = -1$ and $k = 3$. Follow the point $(0, 1)$ of $f$:

$$(0, 1) \\xrightarrow{\\text{1 right}} (1, 1) \\xrightarrow{\\text{reflect}} (1, -1) \\xrightarrow{\\text{3 up}} (1, 2)$$

{{figure 0}}

Indeed $g(1) = -2^{0} + 3 = 2$. The asymptote $y = 0$ is not changed by the shift or the reflection, and the last move takes it to $y = 3$; the reflected graph lies below it.

In this lesson we describe the transformations in a formula, write the function after given transformations, track key points, and read the formula from a graph.`,
    `对任意函数 $f$，$g(x) = a \\cdot f(x - h) + k$ 的图象由 $f$ 的图象经过三步得到：向右平移 $h$，竖直伸缩为原来的 $|a|$ 倍（$a < 0$ 时还关于 $x$ 轴翻折），再向上平移 $k$。我们已经在指数函数上分别用过每一步，现在把它们组合起来。

取 $f(x) = 2^{x}$ 和 $g(x) = -2^{x - 1} + 3$，即 $h = 1$，$a = -1$，$k = 3$。追踪 $f$ 上的点 $(0, 1)$：

$$(0, 1) \\xrightarrow{\\text{右移 1}} (1, 1) \\xrightarrow{\\text{翻折}} (1, -1) \\xrightarrow{\\text{上移 3}} (1, 2)$$

{{figure 0}}

确实 $g(1) = -2^{0} + 3 = 2$。平移和翻折不改变渐近线 $y = 0$，最后一步把它移到 $y = 3$；翻折后的图象在它下方。

这节课我们描述式子中的变换，写出给定变换后的函数，追踪关键点，并由图象读出解析式。`,
  ),
  introFigures: [pathFigure(-1, Q.of(2), 1, 3)],
  knowledgePoints: [
    {
      id: "describing-exponential-transformations",
      figure: algebraDrawings3["combining-graph-transformations-of-exponential-functions#describing-exponential-transformations"],
      title: t("Describing the transformations", "描述变换"),
      explanation: t(
        `Write $g$ in the form $a \\cdot b^{x - h} + k$ and read each number. Compared with $f(x) = b^{x}$:

- $x - h$ in the exponent shifts the graph $h$ right (left when $h < 0$);
- the factor $a$ stretches it vertically by $|a|$ and, if $a < 0$, reflects it across the $x$-axis;
- $+ k$ shifts it $k$ up (down when $k < 0$).

So $g(x) = -2(3)^{x + 1} + 4$ has $h = -1$, $a = -2$ and $k = 4$: it is $3^{x}$ shifted $1$ left, stretched by $2$, reflected, and shifted $4$ up. The point $(0, 1)$ ends at $(-1, -2 + 4) = (-1, 2)$, and indeed $g(-1) = -2 \\cdot 1 + 4 = 2$.

> **Watch out.** Inside the exponent the sign is reversed: $x + 1 = x - (-1)$ means $1$ to the **left**. Outside, the sign is taken as it is: $- 4$ is a shift down. A negative factor adds a reflection; a positive one never does.`,
        `把 $g$ 写成 $a \\cdot b^{x - h} + k$ 的形式，读出每个数。与 $f(x) = b^{x}$ 相比：

- 指数中的 $x - h$ 把图象向右平移 $h$（$h < 0$ 时向左）；
- 系数 $a$ 把图象竖直伸长为原来的 $|a|$ 倍，$a < 0$ 时还关于 $x$ 轴翻折；
- $+ k$ 把图象向上平移 $k$（$k < 0$ 时向下）。

所以 $g(x) = -2(3)^{x + 1} + 4$ 中 $h = -1$，$a = -2$，$k = 4$：它是把 $3^{x}$ 向左平移 $1$，伸长为 $2$ 倍，翻折，再向上平移 $4$。点 $(0, 1)$ 最后到达 $(-1, -2 + 4) = (-1, 2)$，而确实 $g(-1) = -2 \\cdot 1 + 4 = 2$。

> **注意。** 指数里的符号要反过来读：$x + 1 = x - (-1)$ 表示向**左** $1$。外面的符号照原样读：$- 4$ 是向下平移。负系数才带来翻折，正系数不会。`,
      ),
      generate(rng) {
        const a = rng.pick([-1, 2, 3, -2, -3]);
        const b = rng.pick([Q.of(2), Q.of(3), Q.of(4), Q.of(5), Q.of(1, 2)]);
        const h = rng.nonZero(-4, 4);
        const k = rng.nonZero(-5, 5);
        const g = expT(a, b, h, k);
        const d = describe(a, h, k);
        return reasoned(
          oneOf(rng, {
            prompt: t(
              `How is the graph of $g(x) = ${g}$ obtained from the graph of $f(x) = ${expT(1, b, 0, 0)}$?`,
              `$g(x) = ${g}$ 的图象如何由 $f(x) = ${expT(1, b, 0, 0)}$ 的图象变换得到？`,
            ),
            right: d,
            wrong: [describe(a, -h, k), describe(a, h, -k), describe(a, -h, -k), describe(-a, h, k)],
            solution: t(
              `${label(1, "Match the form", "对照形式").en} Compare $g(x) = ${g}$ with $a \\cdot b^{x - h} + k$. The exponent is $${hForm(h)}$, so $h = ${h}$; the factor is $a = ${a}$; the number added is $k = ${k}$.

${label(2, "Name the moves", "说出变换").en} In order: the exponent, then the factor, then the number added. ${d.en}

**Check.** The point $(0, 1)$ of $f$ should end at $(h, a + k) = (${h}, ${a + k})$, and indeed $g(${h}) = ${a} \\cdot ${powBase(b)}^{0}${plusK(k)} = ${a + k}$.`,
              `${label(1, "Match the form", "对照形式")["zh-CN"]} 把 $g(x) = ${g}$ 与 $a \\cdot b^{x - h} + k$ 比较。指数是 $${hForm(h)}$，所以 $h = ${h}$；系数 $a = ${a}$；加上的数 $k = ${k}$。

${label(2, "Name the moves", "说出变换")["zh-CN"]} 按顺序：先看指数，再看系数，最后看加上的数。${d["zh-CN"]}

**检验。** $f$ 上的点 $(0, 1)$ 应该到达 $(h, a + k) = (${h}, ${a + k})$，而确实 $g(${h}) = ${a} \\cdot ${powBase(b)}^{0}${plusK(k)} = ${a + k}$。`,
            ),
          }),
          [
            [
              describe(a, -h, k).en,
              "The horizontal shift goes the wrong way: $x - h$ moves the graph to the right when $h$ is positive.",
              "水平平移方向反了：$h$ 为正时，$x - h$ 把图象向右移。",
            ],
            [
              describe(a, h, -k).en,
              "The vertical shift goes the wrong way: the number added outside moves the graph by that amount, sign included.",
              "竖直平移方向反了：加在外面的数连同符号决定图象移动的量。",
            ],
            [describe(a, -h, -k).en, "Both shifts go the wrong way.", "两个平移方向都反了。"],
            [
              describe(-a, h, k).en,
              a < 0
                ? "This leaves out the reflection that the negative factor asks for."
                : "This adds a reflection, but the factor is positive.",
              a < 0 ? "这里漏掉了负系数要求的翻折。" : "这里多了翻折，但系数是正的。",
            ],
          ],
        );
      },
    },
    {
      id: "writing-the-transformed-exponential",
      title: t("Writing the transformed function", "写出变换后的函数"),
      explanation: t(
        `Each move changes the formula in its own place. Starting from $f(x) = 2^{x}$:

- shifting $3$ right replaces $x$ by $x - 3$: $2^{x - 3}$;
- stretching by $4$ multiplies the whole function by $4$: $4(2)^{x - 3}$;
- shifting $1$ down subtracts $1$ at the end: $4(2)^{x - 3} - 1$.

$$2^{x} \\to 2^{x - 3} \\to 4(2)^{x - 3} \\to 4(2)^{x - 3} - 1$$

Check with the key point: $(0, 1)$ moves $3$ right to $(3, 1)$, up to $(3, 4)$ by the stretch, and down to $(3, 3)$; and $4(2)^{0} - 1 = 3$.

> **Watch out.** A shift to the right is $x - h$, not $x + h$. Do the vertical shift last: stretching after it would multiply $k$ too, giving $4(2)^{x - 3} - 4$. And keep the shifts apart: the horizontal number goes in the exponent, the vertical one outside.`,
        `每一步变换改变式子中各自的位置。从 $f(x) = 2^{x}$ 开始：

- 向右平移 $3$，把 $x$ 换成 $x - 3$：$2^{x - 3}$；
- 伸长为 $4$ 倍，整个函数乘以 $4$：$4(2)^{x - 3}$；
- 向下平移 $1$，最后减去 $1$：$4(2)^{x - 3} - 1$。

$$2^{x} \\to 2^{x - 3} \\to 4(2)^{x - 3} \\to 4(2)^{x - 3} - 1$$

用关键点检验：$(0, 1)$ 向右移 $3$ 到 $(3, 1)$，伸长后到 $(3, 4)$，再向下到 $(3, 3)$；而 $4(2)^{0} - 1 = 3$。

> **注意。** 向右平移是 $x - h$，不是 $x + h$。竖直平移要放在最后：如果之后再伸长，$k$ 也会被乘上，得到 $4(2)^{x - 3} - 4$。两个平移不要混淆：水平的数放在指数里，竖直的数放在外面。`,
      ),
      generate(rng) {
        const a = rng.pick([-1, 2, 3, -2, 4]);
        const b = rng.pick([Q.of(2), Q.of(3), Q.of(5), Q.of(1, 2), Q.of(1, 3)]);
        const h = rng.nonZero(-5, 5);
        const k = rng.nonZero(-6, 6);
        const d = describe(a, h, k);
        const f = expT(1, b, 0, 0);
        const answer = expT(a, b, h, k);
        const middle =
          a === -1
            ? t("reflect it across the $x$-axis", "关于 $x$ 轴翻折")
            : a < 0
              ? t(`stretch it by $${-a}$ and reflect it`, `伸长为 $${-a}$ 倍并翻折`)
              : t(`stretch it by $${a}$`, `伸长为 $${a}$ 倍`);
        return {
          ...expressionProblem({
            prompt: t(
              `Start with the graph of $f(x) = ${f}$. ${d.en} Write the function $g$ of the new graph.`,
              `从 $f(x) = ${f}$ 的图象开始，${d["zh-CN"]}写出所得图象对应的函数 $g$。`,
            ),
            answer,
            prefix: "g(x) =",
            wrong: [expT(a, b, -h, k), expT(a, b, h, -k), expT(a, b, k, h), expT(a, b, h, a * k)],
            solution: t(
              `${label(1, "The horizontal shift", "水平平移").en} Shifting ${unitsEn(h)} ${h > 0 ? "right" : "left"} replaces $x$ by $${hForm(h, true)}$:${steps(`${f} \\to ${expT(1, b, h, 0)}`)}${label(2, "The factor", "系数").en} To ${middle.en}, multiply the whole function by $${a}$:${steps(`${expT(1, b, h, 0)} \\to ${expT(a, b, h, 0)}`)}${label(3, "The vertical shift", "竖直平移").en} Last, shifting ${vShift(k).en} adds $${k}$ outside:${steps(`${expT(a, b, h, 0)} \\to ${answer}`)}{{figure 0}}

**Check.** The key point $(0, 1)$ of $f$ moves to $(${h}, 1)$, then to $(${h}, ${a})$, then to $(${h}, ${a + k})$; and $g(${h}) = ${a} \\cdot ${powBase(b)}^{0}${plusK(k)} = ${a + k}$.`,
              `${label(1, "The horizontal shift", "水平平移")["zh-CN"]} 向${h > 0 ? "右" : "左"}平移 $${Math.abs(h)}$ 个单位，就把 $x$ 换成 $${hForm(h, true)}$：${steps(`${f} \\to ${expT(1, b, h, 0)}`)}${label(2, "The factor", "系数")["zh-CN"]} 要${middle["zh-CN"]}，就把整个函数乘以 $${a}$：${steps(`${expT(1, b, h, 0)} \\to ${expT(a, b, h, 0)}`)}${label(3, "The vertical shift", "竖直平移")["zh-CN"]} 最后${vShift(k)["zh-CN"]}，在外面加上 $${k}$：${steps(`${expT(a, b, h, 0)} \\to ${answer}`)}{{figure 0}}

**检验。** $f$ 上的关键点 $(0, 1)$ 先移到 $(${h}, 1)$，再到 $(${h}, ${a})$，最后到 $(${h}, ${a + k})$；而 $g(${h}) = ${a} \\cdot ${powBase(b)}^{0}${plusK(k)} = ${a + k}$。`,
            ),
          }),
          solutionFigures: [pathFigure(a, b, h, k)],
        };
      },
    },
    {
      id: "key-points-under-transformations",
      figure: algebraDrawings2["combining-graph-transformations-of-exponential-functions#key-points-under-transformations"],
      title: t("Key points", "关键点"),
      explanation: t(
        `The points $(0, 1)$ and $(1, b)$ lie on every graph $y = b^{x}$. Under $g(x) = a \\cdot b^{x - h} + k$ each point $(x, y)$ moves in two independent directions: the horizontal shift changes only $x$, to $x + h$, and the factor and the vertical shift change only $y$, to $ay + k$:

$$(x, y) \\to (x + h, \\; ay + k)$$

For $g(x) = 2(3)^{x - 1} - 5$, the point $(1, 3)$ moves to $(1 + 1, \\; 2 \\cdot 3 - 5) = (2, 1)$. Check: $g(2) = 2(3)^{1} - 5 = 1$.

> **Watch out.** $x - h$ in the formula moves points by $+h$: in $3^{x - 1}$ every point moves $1$ to the right. For $y$, multiply first and add $k$ after: $2 \\cdot 3 - 5$, not $2(3 - 5)$, and $k$ keeps its sign.`,
        `点 $(0, 1)$ 和 $(1, b)$ 在每个 $y = b^{x}$ 的图象上。在 $g(x) = a \\cdot b^{x - h} + k$ 下，每个点 $(x, y)$ 在两个方向上分别移动：水平平移只改变 $x$，变为 $x + h$；系数和竖直平移只改变 $y$，变为 $ay + k$：

$$(x, y) \\to (x + h, \\; ay + k)$$

对 $g(x) = 2(3)^{x - 1} - 5$，点 $(1, 3)$ 变到 $(1 + 1, \\; 2 \\cdot 3 - 5) = (2, 1)$。检验：$g(2) = 2(3)^{1} - 5 = 1$。

> **注意。** 式子中的 $x - h$ 让点移动 $+h$：$3^{x - 1}$ 中每个点都向右移 $1$。对 $y$ 要先乘再加 $k$：是 $2 \\cdot 3 - 5$，不是 $2(3 - 5)$，而且 $k$ 保留它的符号。`,
      ),
      generate(rng) {
        const a = rng.pick([-1, 2, 3, -2]);
        const b = rng.pick([2, 3, 4, 5]);
        const h = rng.nonZero(-4, 4);
        const k = rng.nonZero(-6, 6);
        const [x0, y0] = rng.bool() ? [1, b] : [0, 1];
        const g = expT(a, Q.of(b), h, k);
        const X = x0 + h;
        const Y = a * y0 + k;
        return pointProblem({
          prompt: t(
            `The point $(${x0}, ${y0})$ lies on the graph of $f(x) = ${b}^{x}$. To which point does it move on the graph of $g(x) = ${g}$?`,
            `点 $(${x0}, ${y0})$ 在 $f(x) = ${b}^{x}$ 的图象上。在 $g(x) = ${g}$ 的图象上，它变到哪个点？`,
          ),
          answer: [X, Y],
          wrong: [
            [x0 - h, a * y0 + k],
            [x0 + h, a * (y0 + k)],
            [x0 + h, a * y0 - k],
          ],
          solution: t(
            `${label(1, "Read the transformations", "读出变换").en} Compare with $a \\cdot b^{x - h} + k$: $h = ${h}$, $a = ${a}$ and $k = ${k}$. So $(x, y)$ moves to $(x + h, \\; ay + k)$.

${label(2, "Move the point", "移动这个点").en} The horizontal shift changes $x$; the factor and then the vertical shift change $y$:${steps(`(${x0}${plusK(h)}, \\; ${a} \\cdot ${y0}${plusK(k)}) = (${X}, ${Y})`)}**Check.** $g(${X}) = ${expT(a, Q.of(b), 0, 0).replace("{x}", `{${x0}}`)}${plusK(k)} = ${a} \\cdot ${y0}${plusK(k)} = ${Y}$, so $(${X}, ${Y})$ is on the graph of $g$.`,
            `${label(1, "Read the transformations", "读出变换")["zh-CN"]} 与 $a \\cdot b^{x - h} + k$ 比较：$h = ${h}$，$a = ${a}$，$k = ${k}$。所以 $(x, y)$ 变到 $(x + h, \\; ay + k)$。

${label(2, "Move the point", "移动这个点")["zh-CN"]} 水平平移改变 $x$；系数和竖直平移依次改变 $y$：${steps(`(${x0}${plusK(h)}, \\; ${a} \\cdot ${y0}${plusK(k)}) = (${X}, ${Y})`)}**检验。** $g(${X}) = ${expT(a, Q.of(b), 0, 0).replace("{x}", `{${x0}}`)}${plusK(k)} = ${a} \\cdot ${y0}${plusK(k)} = ${Y}$，所以 $(${X}, ${Y})$ 在 $g$ 的图象上。`,
          ),
        });
      },
    },
    {
      id: "the-transformed-exponential-from-its-graph",
      figure: algebraDrawings3["combining-graph-transformations-of-exponential-functions#the-transformed-exponential-from-its-graph"],
      title: t("The equation from the graph", "由图象求解析式"),
      explanation: t(
        `To read $g(x) = a \\cdot b^{x - h} + k$ with $a = \\pm 1$ from its graph, work from the asymptote outward:

1. The horizontal asymptote is $y = k$.
2. The graph lies above it when $a = 1$ and below it when $a = -1$.
3. At $x = h$ the power is $b^{0} = 1$, so the graph is exactly $1$ unit from the asymptote there; that locates $h$.
4. One step to the right the power is $b^{1}$, so the graph is $b$ units away; that gives $b$.

A graph above $y = -2$ through $(1, -1)$ and $(2, 1)$: $-1$ is $1$ unit above the asymptote, so $h = 1$, and $1$ is $3$ units above it, so $b = 3$. The function is $g(x) = 3^{x - 1} - 2$.

> **Watch out.** The point $1$ unit from the asymptote is at $x = h$, so a point at $x = 1$ means $x - 1$ in the exponent, not $x + 1$. Measure distances from the asymptote, not from the $x$-axis: the height $1$ at $x = 2$ is $3$ units above $y = -2$, so $b = 3$, not $2$.`,
        `要从图象读出 $g(x) = a \\cdot b^{x - h} + k$（$a = \\pm 1$），从渐近线开始向外读：

1. 水平渐近线是 $y = k$。
2. $a = 1$ 时图象在渐近线上方，$a = -1$ 时在下方。
3. 在 $x = h$ 处幂为 $b^{0} = 1$，所以图象恰好离渐近线 $1$ 个单位，由此确定 $h$。
4. 向右再走一步，幂为 $b^{1}$，图象离渐近线 $b$ 个单位，由此得到 $b$。

在 $y = -2$ 上方、经过 $(1, -1)$ 和 $(2, 1)$ 的图象：$-1$ 在渐近线上方 $1$ 个单位，所以 $h = 1$；$1$ 在渐近线上方 $3$ 个单位，所以 $b = 3$。函数是 $g(x) = 3^{x - 1} - 2$。

> **注意。** 离渐近线 $1$ 个单位的点在 $x = h$ 处，所以这个点在 $x = 1$ 时，指数是 $x - 1$，不是 $x + 1$。距离要从渐近线量起，而不是从 $x$ 轴量起：$x = 2$ 处的高度 $1$ 在 $y = -2$ 上方 $3$ 个单位，所以 $b = 3$，不是 $2$。`,
      ),
      generate(rng) {
        for (;;) {
          const a = rng.pick([1, -1]);
          const b = rng.pick([2, 3]);
          const h = rng.int(-3, 2);
          const k = rng.int(-3, 4);
          const near = k + a;
          const far = k + a * b;
          if (far > 9 || far < -5 || (h === 0 && near === 0)) continue;
          const B = Q.of(b);
          const answer = expT(a, B, h, k);
          const side = a > 0 ? t("above", "上方") : t("below", "下方");
          return annotate(
            {
              ...expressionProblem({
                prompt: t(
                  `The graph of $g(x) = a \\cdot b^{x - h} + k$ with $a = 1$ or $a = -1$ is shown; its horizontal asymptote is ${k === 0 ? "the $x$-axis" : "dashed"}, and the marked points lie on grid points. Write $g(x)$.`,
                  `如图是 $g(x) = a \\cdot b^{x - h} + k$（$a = 1$ 或 $a = -1$）的图象，${k === 0 ? "它的水平渐近线是 $x$ 轴" : "虚线是它的水平渐近线"}，标出的点都在格点上。写出 $g(x)$。`,
                ),
                answer,
                prefix: "g(x) =",
                wrong: [expT(a, B, -h, k), expT(-a, B, h, k), expT(a, B, h, -k), expT(a, Q.of(b + 1), h, k)],
                solution: t(
                  `${label(1, "The asymptote and the side", "渐近线与位置").en} The asymptote is $y = ${k}$, so $k = ${k}$, and the graph lies ${side.en} it, so $a = ${a}$.

${label(2, "The shift", "平移").en} At $x = ${h}$ the graph is at $(${h}, ${near})$, $1$ unit from the asymptote, where the power is $b^{0} = 1$. So $h = ${h}$.

${label(3, "The base", "底数").en} At $x = ${h + 1}$ the graph is at $(${h + 1}, ${far})$, $${b}$ units from the asymptote, where the power is $b^{1}$. So $b = ${b}$ and $g(x) = ${answer}$.

**Check.** $g(${h}) = ${a === 1 ? "" : "-"}${b}^{0}${plusK(k)} = ${near}$ and $g(${h + 1}) = ${a === 1 ? "" : "-"}${b}^{1}${plusK(k)} = ${far}$: both marked points lie on the graph.`,
                  `${label(1, "The asymptote and the side", "渐近线与位置")["zh-CN"]} 渐近线是 $y = ${k}$，所以 $k = ${k}$；图象在它的${side["zh-CN"]}，所以 $a = ${a}$。

${label(2, "The shift", "平移")["zh-CN"]} 在 $x = ${h}$ 处图象位于 $(${h}, ${near})$，离渐近线 $1$ 个单位，此处幂为 $b^{0} = 1$。所以 $h = ${h}$。

${label(3, "The base", "底数")["zh-CN"]} 在 $x = ${h + 1}$ 处图象位于 $(${h + 1}, ${far})$，离渐近线 $${b}$ 个单位，此处幂为 $b^{1}$。所以 $b = ${b}$，$g(x) = ${answer}$。

**检验。** $g(${h}) = ${a === 1 ? "" : "-"}${b}^{0}${plusK(k)} = ${near}$，$g(${h + 1}) = ${a === 1 ? "" : "-"}${b}^{1}${plusK(k)} = ${far}$：两个标出的点都在图象上。`,
                ),
              }),
              figure: expGraph(
                expView,
                expFn(a, B, h, k),
                k,
                [
                  { at: [h, near], dir: "e", bare: true },
                  { at: [h + 1, far], dir: "e", bare: true },
                ],
                a > 0,
              ),
            },
            expView,
            [{ kind: "line", a: [0, k], b: [1, k], dashed: true, tone: "result" }, ...shift([0, a], [h, near])],
            `The asymptote is y = ${k}, and the key point moves to ${at([h, near])}.`,
            `渐近线是 y = ${k}，关键点移到 ${at([h, near])}。`,
          );
        }
      },
    },
  ],
  diagnostic: "writing-the-transformed-exponential",
};

/** aTimes writes a factor a in front of a power: "2^{0}", "-2^{0}", "3 \cdot 2^{0}". */
const aTimes = (a: number, rest: string) => (a === 1 ? rest : a === -1 ? `-${rest}` : `${a} \\cdot ${rest}`);

/** tenLead is a sentence that opens a solution with the reminder that a logarithm written without a base is the common logarithm, or nothing for another base. */
const tenLead = (B: Base): Text =>
  B.b === 10 ? t("A logarithm written without a base, $\\log$, means $\\log_{10}$. ", "不写底数的 $\\log$ 表示 $\\log_{10}$。") : t("", "");

const propView: PlaneView = { xMin: -8, xMax: 8, yMin: -10, yMax: 10 };

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
  intro: t(
    `We know how the graph of $g(x) = a \\cdot b^{x - h} + k$ comes from the graph of $b^{x}$: a shift of $h$ to the right, a vertical stretch by $|a|$ with a reflection when $a < 0$, and a shift of $k$ up. We also know that a vertical shift moves the range of a function, and a horizontal shift moves its domain. Together they let us read the properties of $g$ straight from its formula, without drawing it first.

Take $f(x) = 2^{x - 1} - 4$, the graph of $2^{x}$ moved $1$ right and $4$ down.

- **Domain.** Any number can be an exponent, so the domain is all real numbers.
- **Asymptote and range.** $2^{x - 1}$ is always positive and gets as close to $0$ as we like, so $f(x) = 2^{x - 1} - 4$ is always greater than $-4$ and comes as close to $-4$ as we like. The asymptote is $y = -4$ and the range is $(-4, \\infty)$.
- **Intercepts.** $f(0) = 2^{-1} - 4 = -\\frac{7}{2}$. Setting $f(x) = 0$ gives $2^{x - 1} = 4 = 2^{2}$, so $x - 1 = 2$ and $x = 3$.
- **Direction.** The base $2$ is greater than $1$ and the factor is positive, so $f$ is increasing.

{{figure 0}}

In this lesson we find the range, the intercepts and the direction of any transformed exponential function.`,
    `我们知道 $g(x) = a \\cdot b^{x - h} + k$ 的图象如何由 $b^{x}$ 的图象得到：向右平移 $h$，竖直伸缩为原来的 $|a|$ 倍（$a < 0$ 时还要翻折），再向上平移 $k$。我们也知道，竖直平移会移动函数的值域，水平平移会移动它的定义域。把这些合起来，不用先画图，就能直接从解析式读出 $g$ 的性质。

取 $f(x) = 2^{x - 1} - 4$，它是把 $2^{x}$ 的图象向右平移 $1$、向下平移 $4$ 得到的。

- **定义域。** 任何数都可以作指数，所以定义域是全体实数。
- **渐近线与值域。** $2^{x - 1}$ 总是正的，并且可以任意接近 $0$，所以 $f(x) = 2^{x - 1} - 4$ 总大于 $-4$，并且可以任意接近 $-4$。渐近线是 $y = -4$，值域是 $(-4, \\infty)$。
- **截距。** $f(0) = 2^{-1} - 4 = -\\frac{7}{2}$。令 $f(x) = 0$，得 $2^{x - 1} = 4 = 2^{2}$，所以 $x - 1 = 2$，$x = 3$。
- **单调性。** 底数 $2$ 大于 $1$，系数为正，所以 $f$ 递增。

{{figure 0}}

这节课我们求任意变换后指数函数的值域、截距和单调性。`,
  ),
  introFigures: [
    expGraph(
      { xMin: -5, xMax: 5, yMin: -6, yMax: 6 },
      expFn(1, Q.of(2), 1, -4),
      -4,
      [
        { at: [1, -3], dir: "se" },
        { at: [3, 0], dir: "se" },
      ],
      true,
    ),
  ],
  knowledgePoints: [
    {
      id: "range-of-transformed-exponentials",
      figure: algebraDrawings3["properties-of-transformed-exponential-functions#range-of-transformed-exponentials"],
      title: t("Domain, asymptote and range", "定义域、渐近线与值域"),
      explanation: t(
        `Every exponential function $f(x) = a \\cdot b^{x - h} + k$ has domain all real numbers, since any number can be an exponent. For the range, build $f$ up in steps:

- $b^{x - h}$ takes every positive value and never $0$: the shift $h$ only slides the graph sideways, so it changes no value;
- multiplying by $a > 0$ keeps the values positive, and multiplying by $a < 0$ makes them all negative;
- adding $k$ moves every value up by $k$, so the values lie on one side of $k$, and the asymptote is $y = k$.

So the range is $(k, \\infty)$ when $a > 0$ and $(-\\infty, k)$ when $a < 0$.

For $f(x) = -3(2)^{x + 4} + 1$: $2^{x + 4} > 0$, so $-3(2)^{x + 4} < 0$ and $f(x) < 1$. The range is $(-\\infty, 1)$.

> **Watch out.** The side is set by the sign of $a$: a negative factor puts the graph below the asymptote. The asymptote itself is never reached, so the range uses a parenthesis at $k$, not a bracket. The range is never all real numbers, and the number $h$ in the exponent has nothing to do with it: only $k$ bounds the range.`,
        `每个指数函数 $f(x) = a \\cdot b^{x - h} + k$ 的定义域都是全体实数，因为任何数都可以作指数。求值域时，把 $f$ 一步步搭起来：

- $b^{x - h}$ 取遍所有正数，但取不到 $0$：平移量 $h$ 只是把图象左右滑动，不改变取到的值；
- 乘以 $a > 0$，值仍然都是正的；乘以 $a < 0$，值全变成负的；
- 加上 $k$，每个值都向上移动 $k$，所以值都在 $k$ 的一侧，渐近线是 $y = k$。

所以 $a > 0$ 时值域是 $(k, \\infty)$，$a < 0$ 时值域是 $(-\\infty, k)$。

对 $f(x) = -3(2)^{x + 4} + 1$：$2^{x + 4} > 0$，于是 $-3(2)^{x + 4} < 0$，$f(x) < 1$。值域是 $(-\\infty, 1)$。

> **注意。** 在哪一侧由 $a$ 的符号决定：负的系数使图象位于渐近线下方。渐近线本身永远取不到，所以值域在 $k$ 处用圆括号，不用方括号。值域永远不是全体实数，指数里的 $h$ 与值域无关：只有 $k$ 是值域的边界。`,
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
        const f = expT(a, b, h, k);
        const power = expT(1, b, h, 0);
        const scaled = expT(a, b, h, 0);
        const range = above ? `(${k}, \\infty)` : `(-\\infty, ${k})`;
        const rel = above ? ">" : "<";
        const rising = above === b.cmp(Q.one) > 0;
        return {
          ...intervalProblem({
            prompt: t(`What is the range of $f(x) = ${f}$? Write it in interval notation.`, `$f(x) = ${f}$ 的值域是什么？用区间表示。`),
            set: side(above),
            form: "interval",
            wrong: [
              side(!above),
              side(above, true),
              realLine,
              ...(h === k ? [] : [above ? [{ lo: H, loClosed: false, hiClosed: false }] : [{ hi: H, loClosed: false, hiClosed: false }]]),
            ],
            solution: t(
              `${label(1, "The power", "幂").en} The power $${power}$ is positive for every $x$ and comes as close to $0$ as we like. ${h === 0 ? "" : `The shift $h = ${h}$ in the exponent only slides the graph sideways.`}

${label(2, "The factor", "系数").en} Multiplying by $a = ${a}$, which is ${above ? "positive" : "negative"}, gives ${above ? "positive" : "negative"} values: $${scaled} ${rel} 0$ for every $x$.

${label(3, "The shift", "平移").en} ${k === 0 ? "Nothing is added, so" : `Adding $${k}$ moves every value by $${k}$, so`} $f(x) ${rel} ${k}$, and $f(x)$ comes as close to $${k}$ as we like. The asymptote is $y = ${k}$ and the graph lies ${above ? "above" : "below"} it:{{figure 0}}The range is $${range}$, with a parenthesis at $${k}$ because $f(x)$ never equals $${k}$.

**Check.** At $x = ${h}$, $f(${h}) = ${aTimes(a, `${powBase(b)}^{0}`)}${plusK(k)} = ${a + k}$, which is ${above ? "greater" : "less"} than $${k}$ and lies in $${range}$.`,
              `${label(1, "The power", "幂")["zh-CN"]} 对每个 $x$，幂 $${power}$ 都是正的，并且可以任意接近 $0$。${h === 0 ? "" : `指数里的平移量 $h = ${h}$ 只是把图象左右滑动。`}

${label(2, "The factor", "系数")["zh-CN"]} 乘以${above ? "正" : "负"}数 $a = ${a}$，得到的值都是${above ? "正" : "负"}的：对每个 $x$，$${scaled} ${rel} 0$。

${label(3, "The shift", "平移")["zh-CN"]} ${k === 0 ? "没有加上常数，所以" : `加上 $${k}$，每个值都移动 $${k}$，于是`} $f(x) ${rel} ${k}$，并且 $f(x)$ 可以任意接近 $${k}$。渐近线是 $y = ${k}$，图象在它的${above ? "上方" : "下方"}：{{figure 0}}值域是 $${range}$；因为 $f(x)$ 永远不等于 $${k}$，在 $${k}$ 处用圆括号。

**检验。** 当 $x = ${h}$ 时，$f(${h}) = ${aTimes(a, `${powBase(b)}^{0}`)}${plusK(k)} = ${a + k}$，它${above ? "大于" : "小于"} $${k}$，确实在 $${range}$ 中。`,
            ),
          }),
          solutionFigures: [expGraph(propView, expFn(a, b, h, k), k, [{ at: [h, a + k], dir: above ? "se" : "ne" }], rising)],
        };
      },
    },
    {
      id: "intercepts-of-transformed-exponentials",
      figure: algebraDrawings3["properties-of-transformed-exponential-functions#intercepts-of-transformed-exponentials"],
      title: t("Intercepts", "截距"),
      explanation: t(
        `The $y$-intercept is where $x = 0$, so it is $f(0)$; every exponential function has exactly one, since $0$ is in the domain. The $x$-intercept is where $f(x) = 0$. There is one only if $0$ is in the range: the graph must reach the $x$-axis from its side of the asymptote, so $a > 0$ needs $k < 0$, and $a < 0$ needs $k > 0$.

For $f(x) = 2(3)^{x - 1} - 18$, put $x = 0$; the exponent becomes $0 - 1 = -1$:

$$f(0) = 2 \\cdot 3^{-1} - 18 = \\frac{2}{3} - 18 = -\\frac{52}{3}$$

For the $x$-intercept, set $f(x) = 0$, move $18$ across, divide by $2$, and write both sides as powers of $3$:

$$2(3)^{x - 1} = 18 \\implies 3^{x - 1} = 9 = 3^{2} \\implies x - 1 = 2 \\implies x = 3$$

> **Watch out.** At $x = 0$ the exponent is $-h$, not $0$ and not $h$: $f(0) = a \\cdot b^{-h} + k$, so $a + k$ is the value at $x = h$, not at $0$. Don't drop the $+ k$. For the $x$-intercept, after finding the exponent $x - h$, add $h$ back; the exponent alone is not $x$.`,
        `$y$ 轴截距是 $x = 0$ 处的值，也就是 $f(0)$；因为 $0$ 在定义域里，每个指数函数都恰有一个。$x$ 轴截距是 $f(x) = 0$ 的点。只有当 $0$ 在值域里时才有：图象要从渐近线的那一侧到达 $x$ 轴，所以 $a > 0$ 时需要 $k < 0$，$a < 0$ 时需要 $k > 0$。

对 $f(x) = 2(3)^{x - 1} - 18$，代入 $x = 0$，指数变成 $0 - 1 = -1$：

$$f(0) = 2 \\cdot 3^{-1} - 18 = \\frac{2}{3} - 18 = -\\frac{52}{3}$$

求 $x$ 轴截距时，令 $f(x) = 0$，把 $18$ 移到另一边，除以 $2$，再把两边写成 $3$ 的幂：

$$2(3)^{x - 1} = 18 \\implies 3^{x - 1} = 9 = 3^{2} \\implies x - 1 = 2 \\implies x = 3$$

> **注意。** $x = 0$ 时指数是 $-h$，不是 $0$，也不是 $h$：$f(0) = a \\cdot b^{-h} + k$，而 $a + k$ 是 $x = h$ 处的值，不是 $x = 0$ 处的值。不要丢掉 $+ k$。求 $x$ 轴截距时，求出指数 $x - h$ 之后还要加回 $h$；指数本身不是 $x$。`,
      ),
      generate(rng) {
        const a = rng.pick([1, 2, 3, -1, -2]);
        const b = rng.pick([2, 3, 5]);
        const h = rng.nonZero(-3, 3);
        const B = Q.of(b);
        if (rng.bool()) {
          const k = rng.int(-9, 9);
          const p = B.pow(-h);
          const ap = p.mul(Q.of(a));
          const value = ap.add(Q.of(k));
          const f = expT(a, B, h, k);
          const above = a > 0;
          return numberProblem({
            prompt: t(`What is the $y$-intercept of the graph of $f(x) = ${f}$?`, `$f(x) = ${f}$ 的图象的 $y$ 轴截距是多少？`),
            answer: value,
            wrong: [Q.of(a + k), B.pow(h).mul(Q.of(a)).add(Q.of(k)), ap],
            solution: t(
              `${label(1, "Put in $x = 0$", "代入 $x = 0$").en} The exponent becomes $0 ${plusK(-h)} = ${-h}$:${steps(`f(0) = ${aTimes(a, `${b}^{${-h}}`)}${plusK(k)}`)}${label(2, "Evaluate", "计算").en} ${h > 0 ? `A negative exponent gives a reciprocal: $${b}^{${-h}} = \\frac{1}{${b}^{${h}}} = ${num(p)}$.` : `$${b}^{${-h}} = ${num(p)}$.`}${steps(chain(`f(0) = ${aTimes(a, num(p))}${plusK(k)}`, `${num(ap)}${plusK(k)}`, num(value)))}The $y$-intercept is $${num(value)}$.

**Check.** The asymptote is $y = ${k}$ and $a = ${a}$ is ${above ? "positive" : "negative"}, so every value of $f$ is ${above ? "greater" : "less"} than $${k}$; indeed $${num(value)} ${above ? ">" : "<"} ${k}$.`,
              `${label(1, "Put in $x = 0$", "代入 $x = 0$")["zh-CN"]} 指数变成 $0 ${plusK(-h)} = ${-h}$：${steps(`f(0) = ${aTimes(a, `${b}^{${-h}}`)}${plusK(k)}`)}${label(2, "Evaluate", "计算")["zh-CN"]} ${h > 0 ? `负指数表示倒数：$${b}^{${-h}} = \\frac{1}{${b}^{${h}}} = ${num(p)}$。` : `$${b}^{${-h}} = ${num(p)}$。`}${steps(chain(`f(0) = ${aTimes(a, num(p))}${plusK(k)}`, `${num(ap)}${plusK(k)}`, num(value)))}$y$ 轴截距是 $${num(value)}$。

**检验。** 渐近线是 $y = ${k}$，$a = ${a}$ ${above ? "为正" : "为负"}，所以 $f$ 的每个值都${above ? "大于" : "小于"} $${k}$；确实 $${num(value)} ${above ? ">" : "<"} ${k}$。`,
            ),
          });
        }
        const mm = rng.int(0, 3);
        const k = -a * b ** mm;
        const f = expT(a, B, h, k);
        const e = linear(1, -h);
        const power = expT(1, B, h, 0);
        const scaled = expT(a, B, h, 0);
        const x = h + mm;
        const how = joinHow(a === 1 ? [undoAdd(k)] : [undoAdd(k), undoTimes(a)]);
        const isolate = {
          en: `To get the power alone, ${how.en}:`,
          zh: `为了单独留下幂，${how["zh-CN"]}：`,
          lines: a === 1 ? [`${power} = ${-k}`] : [`${scaled} = ${-k}`, `${power} = ${b ** mm}`],
        };
        return numberProblem({
          prompt: t(
            `Find the $x$-coordinate of the $x$-intercept of the graph of $f(x) = ${f}$.`,
            `求 $f(x) = ${f}$ 的图象与 $x$ 轴交点的横坐标。`,
          ),
          answer: x,
          solveFor: "x",
          wrong: [mm - h, mm, h - mm],
          solution: t(
            `${label(1, "Set $f(x) = 0$", "令 $f(x) = 0$").en} The $x$-intercept is where the value is $0$:${steps(`${f} = 0`)}${label(2, "Isolate the power", "分离出幂").en} ${isolate.en}${steps(...isolate.lines)}${label(3, "Match the exponents", "比较指数").en} Write $${b ** mm}$ as $${b}^{${mm}}$. Equal powers of $${b}$ have equal exponents:${steps(`${e} = ${mm}`, `x = ${mm}${plusK(h)} = ${x}`)}**Check.** $f(${x}) = ${aTimes(a, `${b}^{${mm}}`)}${plusK(k)} = ${a * b ** mm}${plusK(k)} = 0$.`,
            `${label(1, "Set $f(x) = 0$", "令 $f(x) = 0$")["zh-CN"]} $x$ 轴截距就是函数值为 $0$ 的地方：${steps(`${f} = 0`)}${label(2, "Isolate the power", "分离出幂")["zh-CN"]} ${isolate.zh}${steps(...isolate.lines)}${label(3, "Match the exponents", "比较指数")["zh-CN"]} 把 $${b ** mm}$ 写成 $${b}^{${mm}}$。$${b}$ 的两个幂相等，指数就相等：${steps(`${e} = ${mm}`, `x = ${mm}${plusK(h)} = ${x}`)}**检验。** $f(${x}) = ${aTimes(a, `${b}^{${mm}}`)}${plusK(k)} = ${a * b ** mm}${plusK(k)} = 0$。`,
          ),
        });
      },
    },
    {
      id: "increasing-or-decreasing",
      title: t("Increasing or decreasing", "递增还是递减"),
      explanation: t(
        `$b^{x}$ increases when $b > 1$ and decreases when $0 < b < 1$. The shifts $h$ and $k$ slide the graph without tilting it, so they never change the direction. A positive factor $a$ only stretches the graph, but a negative one reflects it across the $x$-axis, which turns rising into falling and falling into rising. So $f(x) = a \\cdot b^{x - h} + k$ is increasing exactly when

- $a > 0$ and $b > 1$, or
- $a < 0$ and $0 < b < 1$.

For example $f(x) = -2\\left(\\frac{1}{3}\\right)^{x} + 5$: $\\left(\\frac{1}{3}\\right)^{x}$ decreases, and the factor $-2$ reverses that, so $f$ is increasing. Indeed $f(0) = 3$ and $f(1) = -\\frac{2}{3} + 5 = \\frac{13}{3}$, which is larger.

> **Watch out.** Look at the base and the sign of $a$ together; the base alone is not enough. A fraction base such as $\\frac{2}{3}$ is less than $1$ and gives a decreasing power. The signs of $h$ and $k$ say nothing about the direction.`,
        `$b > 1$ 时 $b^{x}$ 递增，$0 < b < 1$ 时递减。平移量 $h$ 和 $k$ 只是滑动图象，不会让它倾斜，所以从不改变单调性。正的系数 $a$ 只是伸缩图象，而负的系数把图象关于 $x$ 轴翻折，上升变下降，下降变上升。所以 $f(x) = a \\cdot b^{x - h} + k$ 递增，当且仅当

- $a > 0$ 且 $b > 1$，或
- $a < 0$ 且 $0 < b < 1$。

例如 $f(x) = -2\\left(\\frac{1}{3}\\right)^{x} + 5$：$\\left(\\frac{1}{3}\\right)^{x}$ 递减，系数 $-2$ 使它反过来，所以 $f$ 递增。确实 $f(0) = 3$，$f(1) = -\\frac{2}{3} + 5 = \\frac{13}{3}$，更大。

> **注意。** 要把底数和 $a$ 的符号放在一起看，只看底数不够。像 $\\frac{2}{3}$ 这样的分数底数小于 $1$，幂是递减的。$h$ 和 $k$ 的符号与单调性无关。`,
      ),
      generate(rng) {
        const a = rng.pick([1, 2, 3, -1, -2, -4]);
        const b = rng.pick([Q.of(2), Q.of(3), Q.of(5), Q.of(1, 2), Q.of(1, 4), Q.of(2, 3)]);
        const h = rng.int(-4, 4);
        const k = rng.int(-6, 6);
        const growth = b.cmp(Q.one) > 0;
        const increasing = a > 0 === growth;
        const f = expT(a, b, h, k);
        const pw = growth ? `${num(b)}^{x}` : `\\left(${num(b)}\\right)^{x}`;
        const next = b.mul(Q.of(a)).add(Q.of(k));
        const wrongWhy: readonly [string, string, string] =
          a > 0
            ? growth
              ? [
                  "Decreasing",
                  "The base is greater than $1$ and the factor is positive, so nothing turns the rising graph over.",
                  "底数大于 $1$，系数为正，没有什么让上升的图象翻过来。",
                ]
              : [
                  "Increasing",
                  "A base between $0$ and $1$ gives a falling power, and a positive factor keeps it falling.",
                  "底数在 $0$ 和 $1$ 之间，幂递减，正的系数让它继续递减。",
                ]
            : growth
              ? [
                  "Increasing",
                  "The base alone would make the graph rise, but the negative factor reflects it, so it falls.",
                  "只看底数图象会上升，但负的系数把它翻折了，所以下降。",
                ]
              : [
                  "Decreasing",
                  "The base alone would make the graph fall, but the negative factor reflects it, so it rises.",
                  "只看底数图象会下降，但负的系数把它翻折了，所以上升。",
                ];
        return reasoned(
          choiceProblem({
            prompt: t(`Is $f(x) = ${f}$ increasing or decreasing?`, `$f(x) = ${f}$ 是递增的还是递减的？`),
            options: [t("Increasing", "递增"), t("Decreasing", "递减")],
            correct: increasing ? 0 : 1,
            solution: t(
              `${label(1, "The base", "底数").en} The base $${num(b)}$ is ${growth ? "greater than $1$" : "between $0$ and $1$"}, so $${pw}$ ${growth ? "increases" : "decreases"}. ${h === 0 && k === 0 ? "" : "The shifts in $f$ slide this graph without changing its direction."}

${label(2, "The factor", "系数").en} ${a < 0 ? `The factor $${a}$ is negative: it reflects the graph across the $x$-axis and reverses the direction.` : a === 1 ? "The factor is $1$, so nothing stretches or reflects the graph." : `The factor $${a}$ is positive: it stretches the graph and keeps the direction.`} So $f$ is ${increasing ? "increasing" : "decreasing"}.

**Check.** Compare two values one step apart: $f(${h}) = ${a + k}$ and $f(${h + 1}) = ${aTimes(a, powBase(b))}${plusK(k)} = ${num(next)}$. The value ${increasing ? "goes up" : "goes down"}.`,
              `${label(1, "The base", "底数")["zh-CN"]} 底数 $${num(b)}$ ${growth ? "大于 $1$" : "在 $0$ 和 $1$ 之间"}，所以 $${pw}$ ${growth ? "递增" : "递减"}。${h === 0 && k === 0 ? "" : "$f$ 中的平移只是滑动这个图象，不改变单调性。"}

${label(2, "The factor", "系数")["zh-CN"]} ${a < 0 ? `系数 $${a}$ 为负：它把图象关于 $x$ 轴翻折，单调性反过来。` : a === 1 ? "系数是 $1$，图象没有伸缩，也没有翻折。" : `系数 $${a}$ 为正：它只伸缩图象，单调性不变。`}所以 $f$ ${increasing ? "递增" : "递减"}。

**检验。** 比较相差 $1$ 的两个值：$f(${h}) = ${a + k}$，$f(${h + 1}) = ${aTimes(a, powBase(b))}${plusK(k)} = ${num(next)}$。函数值${increasing ? "变大了" : "变小了"}。`,
            ),
          }),
          [wrongWhy],
        );
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
    const bare = p.bare || (rising && p.at[0] === 1 && p.at[1] === 0);
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

const mirrorView: PlaneView = { xMin: -3, xMax: 10, yMin: -3, yMax: 10 };

/** mirrorFigure draws y = b^x and y = log_b x with the line y = x dashed, and an arrow taking (p, b^p) to (b^p, p). */
function mirrorFigure(b: number, p: number): Figure {
  const y = Q.of(b).pow(p);
  const v = y.toNumber();
  const from: Point = [p, v];
  const to: Point = [v, p];
  return {
    svg: plane(mirrorView, [
      { kind: "line", a: [0, 0], b: [1, 1], dashed: true },
      { kind: "curve", f: (x) => b ** x },
      { kind: "curve", f: (x) => (x > 0 ? Math.log(x) / Math.log(b) : Number.NaN), from: 1e-6, accent: true },
      { kind: "arrow", from, to, tone: "action", thin: true },
      { kind: "point", at: from, label: `(${p}, ${plain(y)})`, dir: "w" },
      { kind: "point", at: to, tone: "result", label: `(${plain(y)}, ${p})`, dir: "se" },
    ]),
    alt: t(
      `The graphs of y = ${b}^x and y = log_${b} x, mirror images across the dashed line y = x. An arrow takes the point (${p}, ${plain(y)}) to (${plain(y)}, ${p}).`,
      `y = ${b}^x 与 y = log_${b} x 的图象，关于虚线 y = x 对称。箭头把点 (${p}, ${plain(y)}) 移到 (${plain(y)}, ${p})。`,
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
  intro: t(
    `We can evaluate logarithms: $\\log_{b} x$ is the exponent that turns $b$ into $x$, so $\\log_{3} 9 = 2$ because $3^{2} = 9$. To graph $y = \\log_{3} x$, we make a table. The easiest $x$-values are powers of $3$, since their logarithms are whole numbers:

$$\\begin{array}{c|ccccc} x & \\frac{1}{9} & \\frac{1}{3} & 1 & 3 & 9 \\\\ \\hline \\log_{3} x & -2 & -1 & 0 & 1 & 2 \\end{array}$$

{{figure 0}}

The graph tells us a lot:

- only positive $x$ have a logarithm, so the graph lies to the right of the $y$-axis;
- as $x$ gets close to $0$, $\\log_{3} x$ falls without bound, so the $y$-axis is a vertical asymptote;
- the graph keeps rising, but slowly: to go up by $1$, $x$ must be multiplied by $3$.

We also know that the graph of an inverse function is the reflection of the graph across $y = x$. Since $y = \\log_{3} x$ is the inverse of $y = 3^{x}$, its table is the table of $3^{x}$ with the rows swapped.

In this lesson we find points on logarithmic graphs, read the base from a graph, and relate the graph to the exponential one.`,
    `我们会求对数：$\\log_{b} x$ 是把 $b$ 变成 $x$ 的指数，所以 $\\log_{3} 9 = 2$，因为 $3^{2} = 9$。为了画 $y = \\log_{3} x$ 的图象，我们列表。最方便的 $x$ 值是 $3$ 的幂，因为它们的对数是整数：

$$\\begin{array}{c|ccccc} x & \\frac{1}{9} & \\frac{1}{3} & 1 & 3 & 9 \\\\ \\hline \\log_{3} x & -2 & -1 & 0 & 1 & 2 \\end{array}$$

{{figure 0}}

从图象可以看出很多：

- 只有正数 $x$ 才有对数，所以图象在 $y$ 轴的右侧；
- 当 $x$ 接近 $0$ 时，$\\log_{3} x$ 无限减小，所以 $y$ 轴是竖直渐近线；
- 图象一直上升，但很慢：要上升 $1$，$x$ 必须乘以 $3$。

我们也知道，反函数的图象是原图象关于 $y = x$ 的对称图形。因为 $y = \\log_{3} x$ 是 $y = 3^{x}$ 的反函数，它的表就是 $3^{x}$ 的表把两行交换。

这节课我们求对数函数图象上的点，由图象读出底数，并把它与指数函数的图象联系起来。`,
  ),
  introFigures: [
    logGraph(1, 3, 0, 0, [
      { at: [1, 0], dir: "nw" },
      { at: [3, 1], dir: "nw" },
      { at: [9, 2], dir: "nw" },
    ]),
  ],
  knowledgePoints: [
    {
      id: "points-on-logarithmic-graphs",
      title: t("Points on the graph", "图象上的点"),
      explanation: t(
        `A point $(x, y)$ lies on the graph of $y = \\log_{b} x$ exactly when $y = \\log_{b} x$, that is, when $b^{y} = x$. So the height of a point is the exponent that turns $b$ into its $x$-coordinate. For $y = \\log_{2} x$:

$$2^{-2} = \\frac{1}{4}, \\quad 2^{-1} = \\frac{1}{2}, \\quad 2^{0} = 1, \\quad 2^{1} = 2, \\quad 2^{2} = 4, \\quad 2^{3} = 8,$$

so the graph passes through

$$\\left(\\frac{1}{4}, -2\\right), \\quad \\left(\\frac{1}{2}, -1\\right), \\quad (1, 0), \\quad (2, 1), \\quad (4, 2), \\quad (8, 3).$$

To find $y$ from $x$, write $x$ as a power of $b$ and read the exponent. To find $x$ from $y$, raise $b$ to the power $y$.

It is only defined for $x > 0$, rises slowly, and approaches the $y$-axis, its vertical asymptote, as $x$ approaches $0$.

> **Watch out.** The logarithm is an exponent, not a product or a quotient: $\\log_{2} 8 = 3$, not $\\frac{8}{2}$, and the point at height $3$ is $(2^{3}, 3) = (8, 3)$, not $(2 \\cdot 3, 3)$. A fraction $x$ such as $\\frac{1}{4}$ has a **negative** logarithm, and a negative height gives a fraction $x$, never a negative one.`,
        `点 $(x, y)$ 在 $y = \\log_{b} x$ 的图象上，当且仅当 $y = \\log_{b} x$，也就是 $b^{y} = x$。所以点的高度就是把 $b$ 变成它横坐标的那个指数。对 $y = \\log_{2} x$：

$$2^{-2} = \\frac{1}{4}, \\quad 2^{-1} = \\frac{1}{2}, \\quad 2^{0} = 1, \\quad 2^{1} = 2, \\quad 2^{2} = 4, \\quad 2^{3} = 8$$

所以图象经过

$$\\left(\\frac{1}{4}, -2\\right), \\quad \\left(\\frac{1}{2}, -1\\right), \\quad (1, 0), \\quad (2, 1), \\quad (4, 2), \\quad (8, 3)$$

由 $x$ 求 $y$，就把 $x$ 写成 $b$ 的幂，读出指数。由 $y$ 求 $x$，就计算 $b$ 的 $y$ 次幂。

它只在 $x > 0$ 时有定义，缓慢上升，$x$ 趋近 $0$ 时图象靠近 $y$ 轴，$y$ 轴是它的竖直渐近线。

> **注意。** 对数是指数，不是乘积也不是商：$\\log_{2} 8 = 3$，不是 $\\frac{8}{2}$；高度为 $3$ 的点是 $(2^{3}, 3) = (8, 3)$，不是 $(2 \\cdot 3, 3)$。像 $\\frac{1}{4}$ 这样的分数 $x$，对数是**负**的；负的高度对应分数 $x$，永远不会是负的 $x$。`,
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
        const power =
          y < 0
            ? `${B.b}^{${y}} = \\frac{1}{${B.b}^{${-y}}} = ${num(x)}`
            : y === 0
              ? `${B.b}^{0} = 1`
              : y === 1
                ? `${B.b}^{1} = ${B.b}`
                : `${B.b}^{${y}} = ${num(x)}`;
        const note = tenLead(B);
        if (rng.bool()) {
          return numberProblem({
            prompt: t(
              `The point $\\left(${num(x)}, y\\right)$ lies on the graph of $y = ${fn}$. Find $y$.`,
              `点 $\\left(${num(x)}, y\\right)$ 在 $y = ${fn}$ 的图象上。求 $y$。`,
            ),
            answer: y,
            solveFor: "y",
            wrong: [-y, x.div(Q.of(B.b)), Q.of(B.b * y)],
            solution: t(
              `${label(1, "Substitute", "代入").en} ${note.en}The point lies on the graph, so its height is $y = ${B.of(num(x))}$: the exponent that turns $${B.b}$ into $${num(x)}$.

${label(2, "Write the power", "写成幂").en} Write $${num(x)}$ as a power of $${B.b}$:${steps(power)}So the exponent is $${y}$, and $y = ${y}$.

**Check.** The point is $\\left(${num(x)}, ${y}\\right)$, and $${B.b}^{${y}} = ${num(x)}$ is its $x$-coordinate.`,
              `${label(1, "Substitute", "代入")["zh-CN"]} ${note["zh-CN"]}点在图象上，所以它的高度 $y = ${B.of(num(x))}$，也就是把 $${B.b}$ 变成 $${num(x)}$ 的指数。

${label(2, "Write the power", "写成幂")["zh-CN"]} 把 $${num(x)}$ 写成 $${B.b}$ 的幂：${steps(power)}所以指数是 $${y}$，即 $y = ${y}$。

**检验。** 这个点是 $\\left(${num(x)}, ${y}\\right)$，而 $${B.b}^{${y}} = ${num(x)}$ 正是它的横坐标。`,
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
          solution: t(
            `${label(1, "Substitute", "代入").en} ${note.en}Put the height $${y}$ in for $y$:${steps(`${fn} = ${y}`)}${label(2, "Exponential form", "化为指数式").en} $\\log_{b} x = y$ means $b^{y} = x$. Here the base is $${B.b}$ and the exponent is $${y}$:${steps(`x = ${power}`)}**Check.** $${B.of(num(x))} = ${y}$, because $${B.b}^{${y}} = ${num(x)}$; the point is $\\left(${num(x)}, ${y}\\right)$.`,
            `${label(1, "Substitute", "代入")["zh-CN"]} ${note["zh-CN"]}把高度 $${y}$ 代入 $y$：${steps(`${fn} = ${y}`)}${label(2, "Exponential form", "化为指数式")["zh-CN"]} $\\log_{b} x = y$ 表示 $b^{y} = x$。这里底数是 $${B.b}$，指数是 $${y}$：${steps(`x = ${power}`)}**检验。** $${B.of(num(x))} = ${y}$，因为 $${B.b}^{${y}} = ${num(x)}$；这个点是 $\\left(${num(x)}, ${y}\\right)$。`,
          ),
        });
      },
    },
    {
      id: "the-base-from-the-graph",
      figure: algebraDrawings2["graphing-logarithmic-functions#the-base-from-the-graph"],
      title: t("The base from the graph", "由图象求底数"),
      explanation: t(
        `Every graph $y = \\log_{b} x$ passes through $(1, 0)$, since $b^{0} = 1$, and through $(b, 1)$, since $b^{1} = b$. So the point at height $1$ gives the base directly.

Any other point works too. A point $(x, y)$ on the graph means $b^{y} = x$, an equation for $b$. If the graph passes through $(9, 2)$, then $b^{2} = 9$ and $b = 3$, taking the positive root because a base is positive.

A falling graph has a base between $0$ and $1$, and its points to the right of $1$ have negative heights: through $(2, -1)$ means $b^{-1} = 2$, so $\\frac{1}{b} = 2$ and $b = \\frac{1}{2}$.

> **Watch out.** Only the point at height $1$ has the base as its $x$-coordinate: through $(9, 2)$ the base is $3$, not $9$, and it is not the height $2$ either. For a falling graph the base is a fraction: through $(2, -1)$ it is $\\frac{1}{2}$, not $2$.`,
        `每个 $y = \\log_{b} x$ 的图象都经过 $(1, 0)$，因为 $b^{0} = 1$；也经过 $(b, 1)$，因为 $b^{1} = b$。所以高度为 $1$ 的点直接给出底数。

其他点也可以用。图象上的点 $(x, y)$ 表示 $b^{y} = x$，这是关于 $b$ 的方程。若图象经过 $(9, 2)$，则 $b^{2} = 9$，$b = 3$；底数是正数，所以取正根。

下降的图象底数在 $0$ 和 $1$ 之间，它在 $1$ 右边的点高度为负：经过 $(2, -1)$ 表示 $b^{-1} = 2$，即 $\\frac{1}{b} = 2$，所以 $b = \\frac{1}{2}$。

> **注意。** 只有高度为 $1$ 的点，横坐标才是底数：经过 $(9, 2)$ 时底数是 $3$，不是 $9$，也不是高度 $2$。下降图象的底数是分数：经过 $(2, -1)$ 时底数是 $\\frac{1}{2}$，不是 $2$。`,
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
          const n = Math.abs(j);
          const root = n === 1 ? `${x}` : `\\sqrt${n === 2 ? "" : `[${n}]`}{${x}} = ${b}`;
          const lines = falling
            ? n === 1
              ? [`\\frac{1}{b} = ${x}`, `b = ${num(base)}`]
              : [`\\left(\\frac{1}{b}\\right)^{${n}} = ${x}`, `\\frac{1}{b} = ${root}`, `b = ${num(base)}`]
            : n === 1
              ? [`b = ${x}`]
              : [`b^{${j}} = ${x}`, `b = ${root}`];
          const how = falling
            ? n === 1
              ? t(
                  "A negative exponent is a reciprocal, so $b^{-1} = \\frac{1}{b}$. Then flip both sides:",
                  "负指数表示倒数，所以 $b^{-1} = \\frac{1}{b}$。再把两边取倒数：",
                )
              : t(
                  `A negative exponent is a reciprocal, so $b^{${j}} = \\left(\\frac{1}{b}\\right)^{${n}}$. Take the positive ${n === 2 ? "square" : "cube"} root, then flip:`,
                  `负指数表示倒数，所以 $b^{${j}} = \\left(\\frac{1}{b}\\right)^{${n}}$。开正的${n === 2 ? "平方" : "立方"}根，再取倒数：`,
                )
            : n === 1
              ? t("The point at height $1$ gives the base at once:", "高度为 $1$ 的点直接给出底数：")
              : t(
                  `A base is positive, so take the positive ${n === 2 ? "square" : "cube"} root:`,
                  `底数是正数，所以开正的${n === 2 ? "平方" : "立方"}根：`,
                );
          return annotate(
            {
              ...numberProblem({
                prompt: t("The graph of $y = \\log_{b} x$ is shown. Find the base $b$.", "如图是 $y = \\log_{b} x$ 的图象。求底数 $b$。"),
                answer: base,
                solveFor: "b",
                wrong: [Q.of(x), Q.one.div(base), Q.of(j)],
                solution: t(
                  `${label(1, "Read a point", "读出一点").en} The graph passes through $(${x}, ${j})$, so $\\log_{b} ${x} = ${j}$. In exponential form, $b^{${j}} = ${x}$.

${label(2, "Solve for the base", "求底数").en} ${how.en}${steps(...lines)}**Check.** $${powBase(base)}^{${j}} = ${x}$, so $\\log_{${num(base)}} ${x} = ${j}$ and the point $(${x}, ${j})$ is on the graph.${falling ? ` The base is less than $1$, as a falling graph needs.` : ""}`,
                  `${label(1, "Read a point", "读出一点")["zh-CN"]} 图象经过 $(${x}, ${j})$，所以 $\\log_{b} ${x} = ${j}$。化为指数式：$b^{${j}} = ${x}$。

${label(2, "Solve for the base", "求底数")["zh-CN"]} ${how["zh-CN"]}${steps(...lines)}**检验。** $${powBase(base)}^{${j}} = ${x}$，所以 $\\log_{${num(base)}} ${x} = ${j}$，点 $(${x}, ${j})$ 在图象上。${falling ? "底数小于 $1$，符合下降的图象。" : ""}`,
                ),
              }),
              figure: logGraph(1, base.toNumber(), 0, 0, [
                ...(one ? [{ at: [1, 0], dir: falling ? "ne" : "nw" } as const] : []),
                { at: [x, j], dir: falling ? "sw" : "nw" },
              ]),
            },
            logView,
            guides([x, j], at([x, j])),
            `The graph passes through ${at([x, j])}, so the base is ${plain(base)}.`,
            `图象经过 ${at([x, j])}，所以底数是 ${plain(base)}。`,
          );
        }
      },
    },
    {
      id: "reflecting-the-exponential-graph",
      figure: algebraDrawings2["graphing-logarithmic-functions#reflecting-the-exponential-graph"],
      title: t("Reflection of the exponential graph", "与指数函数图象的关系"),
      explanation: t(
        `$y = \\log_{b} x$ and $y = b^{x}$ are inverse functions: $b^{p} = q$ says the same as $\\log_{b} q = p$. So $(p, q)$ is on the graph of $b^{x}$ exactly when $(q, p)$ is on the graph of $\\log_{b} x$. Swapping the coordinates of every point is the reflection across the line $y = x$, so each graph is the mirror image of the other.

Since $(3, 8)$ lies on $y = 2^{x}$, because $2^{3} = 8$, the point $(8, 3)$ lies on $y = \\log_{2} x$, because $\\log_{2} 8 = 3$. The same swap turns the horizontal asymptote $y = 0$ of $b^{x}$ into the vertical asymptote $x = 0$ of $\\log_{b} x$, and the domain of one into the range of the other.

> **Watch out.** Reflecting across $y = x$ swaps the two coordinates; it does not change their signs or take reciprocals. The point $(p, q)$ itself is not on the logarithmic graph: its swapped partner $(q, p)$ is.`,
        `$y = \\log_{b} x$ 与 $y = b^{x}$ 互为反函数：$b^{p} = q$ 与 $\\log_{b} q = p$ 说的是同一件事。所以 $(p, q)$ 在 $b^{x}$ 的图象上，当且仅当 $(q, p)$ 在 $\\log_{b} x$ 的图象上。交换每个点的坐标，就是关于直线 $y = x$ 作对称，所以两个图象互为镜像。

因为 $2^{3} = 8$，$(3, 8)$ 在 $y = 2^{x}$ 上，所以 $(8, 3)$ 在 $y = \\log_{2} x$ 上，因为 $\\log_{2} 8 = 3$。同样的交换把 $b^{x}$ 的水平渐近线 $y = 0$ 变成 $\\log_{b} x$ 的竖直渐近线 $x = 0$，也把一个函数的定义域变成另一个的值域。

> **注意。** 关于 $y = x$ 对称是交换两个坐标，不改变符号，也不取倒数。点 $(p, q)$ 本身不在对数函数的图象上，交换后的 $(q, p)$ 才在。`,
      ),
      generate(rng) {
        const b = rng.int(2, 7);
        const p = rng.int(-2, 3);
        const y = Q.of(b).pow(p);
        const drawn = y.cmp(Q.of(9)) <= 0;
        const problem = pointProblem({
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
          solution: t(
            `${label(1, "Read the point", "读出这个点").en} The point $\\left(${p}, ${num(y)}\\right)$ on $y = ${b}^{x}$ says $${b}^{${p}} = ${num(y)}$. In logarithmic form this is $\\log_{${b}} ${wrapArg(num(y))} = ${p}$.

${label(2, "Swap the coordinates", "交换坐标").en} So at $x = ${num(y)}$ the logarithmic graph has height $${p}$. Reflecting across $y = x$ swaps the coordinates:${steps(`\\left(${p}, ${num(y)}\\right) \\to \\left(${num(y)}, ${p}\\right)`)}${drawn ? "{{figure 0}}" : ""}**Check.** The new point has $y$-coordinate $${p}$, as asked, and $\\log_{${b}} ${wrapArg(num(y))} = ${p}$ because $${b}^{${p}} = ${num(y)}$.`,
            `${label(1, "Read the point", "读出这个点")["zh-CN"]} $y = ${b}^{x}$ 上的点 $\\left(${p}, ${num(y)}\\right)$ 表示 $${b}^{${p}} = ${num(y)}$。写成对数式就是 $\\log_{${b}} ${wrapArg(num(y))} = ${p}$。

${label(2, "Swap the coordinates", "交换坐标")["zh-CN"]} 所以在 $x = ${num(y)}$ 处，对数函数图象的高度是 $${p}$。关于 $y = x$ 对称就是交换坐标：${steps(`\\left(${p}, ${num(y)}\\right) \\to \\left(${num(y)}, ${p}\\right)`)}${drawn ? "{{figure 0}}" : ""}**检验。** 新的点纵坐标是 $${p}$，符合要求；并且 $\\log_{${b}} ${wrapArg(num(y))} = ${p}$，因为 $${b}^{${p}} = ${num(y)}$。`,
          ),
        });
        return drawn ? { ...problem, solutionFigures: [mirrorFigure(b, p)] } : problem;
      },
    },
  ],
  diagnostic: "the-base-from-the-graph",
};

/** logT writes a·log_b(x − h) + k. */
const logT = (a: number, B: Base, h: number, k: number) => `${coefL(a)}${B.of(linear(1, -h))}${plusK(k)}`;

/** logMoveFigure draws y = log_b x and g(x) = a·log_b(x − h) + k with its asymptote x = h dashed, and an arrow taking (x0, y0) to its image. */
function logMoveFigure(a: number, b: number, h: number, k: number, x0: number, y0: number): Figure {
  const to: Point = [x0 + h, a * y0 + k];
  const view: PlaneView = {
    xMin: Math.min(-2, h - 2),
    xMax: Math.max(x0, to[0]) + 3,
    yMin: Math.min(-4, y0 - 2, to[1] - 2),
    yMax: Math.max(4, y0 + 2, to[1] + 2),
  };
  const log = (x: number) => Math.log(x) / Math.log(b);
  const marks: PlaneMark[] = [];
  if (h !== 0) marks.push({ kind: "line", a: [h, view.yMin], b: [h, view.yMax], dashed: true, tone: "result" });
  marks.push(
    { kind: "curve", f: (x) => (x > 0 ? log(x) : Number.NaN), from: 1e-6 },
    { kind: "curve", f: (x) => (x > h ? a * log(x - h) + k : Number.NaN), from: h + 1e-6, accent: true },
    { kind: "arrow", from: [x0, y0], to, tone: "action", thin: true },
    { kind: "point", at: [x0, y0], label: ptL([x0, y0]), dir: "nw" },
    { kind: "point", at: to, tone: "result", label: ptL(to), dir: "se" },
  );
  return {
    svg: plane(view, marks),
    alt: t(
      `The graph of y = log_${b} x and the transformed graph of g${h === 0 ? "" : `, with its asymptote x = ${h} dashed`}. An arrow takes the point ${ptL([x0, y0])} to ${ptL(to)}.`,
      `y = log_${b} x 的图象和变换后 g 的图象${h === 0 ? "" : `，虚线是它的渐近线 x = ${h}`}。箭头把点 ${ptL([x0, y0])} 移到 ${ptL(to)}。`,
    ),
  };
}

export const combiningGraphTransformationsOfLogarithmicFunctions: TopicDef = {
  id: "combining-graph-transformations-of-logarithmic-functions",
  title: t("Combining Graph Transformations of Logarithmic Functions", "对数函数图象的复合变换"),
  summary: t(
    "Find the vertical asymptote and key points of $g(x) = a\\log_{b}(x - h) + k$, and match transformations with equations.",
    "求 $g(x) = a\\log_{b}(x - h) + k$ 的竖直渐近线和关键点，并把变换与解析式对应起来。",
  ),
  prerequisites: ["graphing-logarithmic-functions", "combining-reflections-with-other-graph-transformations"],
  encompasses: [
    { topic: "graphing-logarithmic-functions", weight: 0.3 },
    { topic: "combining-reflections-with-other-graph-transformations", weight: 0.5 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.BF.B.3", "CCSS.HSF.IF.C.7.E"],
  intro: t(
    `The graph of $y = \\log_{b} x$ passes through $(1, 0)$ and $(b, 1)$ and has the $y$-axis as its vertical asymptote. We also know how $g(x) = a \\cdot f(x - h) + k$ moves the graph of any $f$: $h$ to the right, a vertical stretch by $|a|$ with a reflection when $a < 0$, and $k$ up. Put together, they tell us the graph of $g(x) = a\\log_{b}(x - h) + k$ without a table.

Take $g(x) = -\\log_{2}(x - 1) + 3$, so $h = 1$, $a = -1$ and $k = 3$. Follow the two key points of $\\log_{2} x$:

$$(1, 0) \\to (2, 0) \\to (2, 0) \\to (2, 3)$$

$$(2, 1) \\to (3, 1) \\to (3, -1) \\to (3, 2)$$

The shift right moves the asymptote to $x = 1$; the reflection and the shift up leave a vertical line where it is.

{{figure 0}}

Indeed $g(2) = -\\log_{2} 1 + 3 = 3$ and $g(3) = -\\log_{2} 2 + 3 = 2$: the reflected graph falls.

In this lesson we find the asymptote, move key points, write equations from descriptions, and read equations from graphs.`,
    `$y = \\log_{b} x$ 的图象经过 $(1, 0)$ 和 $(b, 1)$，竖直渐近线是 $y$ 轴。我们也知道 $g(x) = a \\cdot f(x - h) + k$ 如何移动任意 $f$ 的图象：向右平移 $h$，竖直伸缩为原来的 $|a|$ 倍（$a < 0$ 时还要翻折），再向上平移 $k$。把它们合起来，不用列表就能得到 $g(x) = a\\log_{b}(x - h) + k$ 的图象。

取 $g(x) = -\\log_{2}(x - 1) + 3$，即 $h = 1$，$a = -1$，$k = 3$。追踪 $\\log_{2} x$ 的两个关键点：

$$(1, 0) \\to (2, 0) \\to (2, 0) \\to (2, 3)$$

$$(2, 1) \\to (3, 1) \\to (3, -1) \\to (3, 2)$$

向右平移把渐近线移到 $x = 1$；翻折和向上平移不会移动竖直直线。

{{figure 0}}

确实 $g(2) = -\\log_{2} 1 + 3 = 3$，$g(3) = -\\log_{2} 2 + 3 = 2$：翻折后的图象是下降的。

这节课我们求渐近线，移动关键点，由描述写出解析式，并由图象读出解析式。`,
  ),
  introFigures: [
    logGraph(-1, 2, 1, 3, [
      { at: [2, 3], dir: "ne" },
      { at: [3, 2], dir: "ne" },
    ]),
  ],
  knowledgePoints: [
    {
      id: "the-vertical-asymptote",
      figure: algebraDrawings2["combining-graph-transformations-of-logarithmic-functions#the-vertical-asymptote"],
      title: t("The vertical asymptote", "竖直渐近线"),
      explanation: t(
        `A logarithm is defined only for a positive argument, and as the argument shrinks toward $0$ the logarithm runs off without bound. So the graph of a logarithm approaches a vertical line exactly where its argument approaches $0$. The vertical asymptote of $g(x) = a\\log_{b}(cx - d) + k$ is where $cx - d = 0$. For $g(x) = 3\\log_{2}(2x - 6) + 1$:

$$2x - 6 = 0 \\implies 2x = 6 \\implies x = 3$$

The factor $a$ stretches the graph up and down, and $k$ slides it up or down; neither moves a vertical line, so neither changes the asymptote.

> **Watch out.** Solve the equation; don't just read off the number: in $\\log_{2}(2x - 6)$ the asymptote is $x = 3$, not $x = 6$ (divide by $2$) and not $x = -6$ (the sign changes when $-6$ moves across). The number $k$ added outside is a vertical shift and never the asymptote.`,
        `对数只对正的真数有定义，真数缩小趋近 $0$ 时，对数无限变化。所以对数的图象恰好在真数趋近 $0$ 的地方靠近一条竖直直线。$g(x) = a\\log_{b}(cx - d) + k$ 的竖直渐近线在 $cx - d = 0$ 处。对 $g(x) = 3\\log_{2}(2x - 6) + 1$：

$$2x - 6 = 0 \\implies 2x = 6 \\implies x = 3$$

系数 $a$ 把图象上下伸缩，$k$ 把图象上下平移；它们都不会移动竖直直线，所以都不改变渐近线。

> **注意。** 要解方程，不能直接读数：$\\log_{2}(2x - 6)$ 的渐近线是 $x = 3$，不是 $x = 6$（还要除以 $2$），也不是 $x = -6$（$-6$ 移到另一边要变号）。加在外面的 $k$ 是竖直平移，永远不是渐近线。`,
      ),
      generate(rng) {
        const B = drawBase(rng, [2, 3, 4, 5]);
        const a = rng.pick([1, 2, 3, -1, -2]);
        const c = rng.pick([1, 1, 2, 3, 4]);
        const d = rng.int(-12, 12);
        const k = rng.int(-6, 6);
        const arg = linear(c, -d);
        const g = `${coefL(a)}${B.of(arg)}${plusK(k)}`;
        const x = Q.of(d, c);
        const solve = solveLinear(c, -d, 0);
        const lines = [`${arg} = 0`, ...(solve.lines.length > 0 ? solve.lines : [`x = 0`])];
        const how = solve.lines.length > 0 ? t(` and ${solve.how.en}`, `，${solve.how["zh-CN"]}`) : t("", "");
        const near = x.add(Q.of(1, c));
        return numberProblem({
          prompt: t(`What is the vertical asymptote of the graph of $g(x) = ${g}$?`, `$g(x) = ${g}$ 的图象的竖直渐近线是什么？`),
          answer: x,
          solveFor: "x",
          wrong: [Q.of(-d, c), Q.of(d), Q.of(k)],
          solution: t(
            `${label(1, "Find the argument", "找出真数").en} ${tenLead(B).en}The logarithm is defined only where its argument $${arg}$ is positive, and the graph runs along a vertical line where the argument approaches $0$. ${a === 1 && k === 0 ? "" : a === 1 ? `The shift $${k}$ does not move that line.` : k === 0 ? `The factor $${a}$ does not move that line.` : `The factor $${a}$ and the shift $${k}$ do not move that line.`}

${label(2, "Set it to zero", "令它为零").en} Set $${arg} = 0$${how.en}:${steps(...lines)}The vertical asymptote is $x = ${num(x)}$.

**Check.** At $x = ${num(x)}$ the argument is $${c === 1 ? num(x) : `${c} \\cdot ${paren(x)}`}${plusK(-d)} = 0$, and just to the right, at $x = ${num(near)}$, it is $1$: so the graph exists to the right of $x = ${num(x)}$ and dives along it.`,
            `${label(1, "Find the argument", "找出真数")["zh-CN"]} ${tenLead(B)["zh-CN"]}对数只在真数 $${arg}$ 为正时有定义，真数趋近 $0$ 时图象沿一条竖直直线延伸。${a === 1 && k === 0 ? "" : a === 1 ? `平移量 $${k}$ 不会移动这条直线。` : k === 0 ? `系数 $${a}$ 不会移动这条直线。` : `系数 $${a}$ 和平移量 $${k}$ 都不会移动这条直线。`}

${label(2, "Set it to zero", "令它为零")["zh-CN"]} 令 $${arg} = 0$${how["zh-CN"]}：${steps(...lines)}竖直渐近线是 $x = ${num(x)}$。

**检验。** 当 $x = ${num(x)}$ 时，真数为 $${c === 1 ? num(x) : `${c} \\cdot ${paren(x)}`}${plusK(-d)} = 0$；在它右边的 $x = ${num(near)}$ 处，真数为 $1$。所以图象在 $x = ${num(x)}$ 的右侧，并沿这条直线延伸。`,
          ),
        });
      },
    },
    {
      id: "key-points-of-logarithmic-graphs",
      figure: algebraDrawings2["combining-graph-transformations-of-logarithmic-functions#key-points-of-logarithmic-graphs"],
      title: t("Key points", "关键点"),
      explanation: t(
        `The graph of $y = \\log_{b} x$ passes through $(1, 0)$ and $(b, 1)$. In $g(x) = a\\log_{b}(x - h) + k$, the argument $x - h$ takes at $x + h$ the value that $x$ had before, so each point moves $h$ to the right; then its height $y$ is multiplied by $a$ and increased by $k$. So $(x, y)$ moves to $(x + h, ay + k)$.

For $g(x) = 2\\log_{3}(x + 1) - 4$ we have $h = -1$, $a = 2$ and $k = -4$. The point $(3, 1)$ moves to

$$(3 - 1, \\; 2 \\cdot 1 - 4) = (2, -2)$$

and indeed $g(2) = 2\\log_{3} 3 - 4 = -2$.

> **Watch out.** The horizontal move goes against the sign inside: $x + 1 = x - (-1)$ moves points $1$ to the **left**. Multiply the height by $a$ before adding $k$, not after: $a(y + k)$ stretches the shift too. And $a$ never touches the $x$-coordinate.`,
        `$y = \\log_{b} x$ 的图象经过 $(1, 0)$ 和 $(b, 1)$。在 $g(x) = a\\log_{b}(x - h) + k$ 中，真数 $x - h$ 在 $x + h$ 处取到原来 $x$ 处的值，所以每个点向右移 $h$；然后它的高度 $y$ 先乘以 $a$，再加上 $k$。所以 $(x, y)$ 变到 $(x + h, ay + k)$。

对 $g(x) = 2\\log_{3}(x + 1) - 4$，$h = -1$，$a = 2$，$k = -4$。点 $(3, 1)$ 变到

$$(3 - 1, \\; 2 \\cdot 1 - 4) = (2, -2)$$

确实 $g(2) = 2\\log_{3} 3 - 4 = -2$。

> **注意。** 水平移动与括号里的符号相反：$x + 1 = x - (-1)$ 使点向**左**移 $1$。高度要先乘以 $a$ 再加 $k$，不能加完再乘：$a(y + k)$ 把平移也伸缩了。$a$ 也从不影响横坐标。`,
      ),
      generate(rng) {
        const b = rng.int(2, 6);
        const B = numBase(b);
        const a = rng.pick([1, 2, 3, -1, -2]);
        const h = rng.nonZero(-5, 5);
        const k = rng.int(-6, 6);
        const [x0, y0] = rng.bool(0.6) ? [b, 1] : [1, 0];
        const g = logT(a, B, h, k);
        const X = x0 + h;
        const Y = a * y0 + k;
        return {
          ...pointProblem({
            prompt: t(
              `The point $(${x0}, ${y0})$ lies on the graph of $f(x) = \\log_{${b}} x$. To which point does it move on the graph of $g(x) = ${g}$?`,
              `点 $(${x0}, ${y0})$ 在 $f(x) = \\log_{${b}} x$ 的图象上。在 $g(x) = ${g}$ 的图象上，它变到哪个点？`,
            ),
            answer: [X, Y],
            wrong: [
              [x0 - h, a * y0 + k],
              [x0 + h, a * (y0 + k)],
              [x0 * a + h, y0 + k],
            ],
            solution: t(
              `${label(1, "Read the numbers", "读出各个数").en} The argument is $${hForm(h)}$, so $h = ${h}$; the factor is $a = ${a}$; the number added is $k = ${k}$. A point $(x, y)$ moves to $(x + h, ay + k)$.

${label(2, "Move the point", "移动这个点").en} The $x$-coordinate moves ${unitsEn(h)} ${h > 0 ? "right" : "left"}; the height is multiplied by $${a}$, then ${k === 0 ? "nothing is added" : `$${k}$ is added`}:${steps(`\\left(${x0}${plusK(h)}, \\; ${a} \\cdot ${paren(y0)}${plusK(k)}\\right) = (${X}, ${Y})`)}{{figure 0}}**Check.** $${chain(`g(${X}) = ${coefL(a)}\\log_{${b}} ${x0}${plusK(k)}`, y0 === 0 ? `0${plusK(k)}` : `${aTimes(a, "1")}${plusK(k)}`, `${Y}`)}$, so $(${X}, ${Y})$ is on the graph of $g$.`,
              `${label(1, "Read the numbers", "读出各个数")["zh-CN"]} 真数是 $${hForm(h)}$，所以 $h = ${h}$；系数 $a = ${a}$；加上的数 $k = ${k}$。点 $(x, y)$ 变到 $(x + h, ay + k)$。

${label(2, "Move the point", "移动这个点")["zh-CN"]} 横坐标向${h > 0 ? "右" : "左"}移 $${Math.abs(h)}$；高度乘以 $${a}$，${k === 0 ? "不再加数" : `再加上 $${k}$`}：${steps(`\\left(${x0}${plusK(h)}, \\; ${a} \\cdot ${paren(y0)}${plusK(k)}\\right) = (${X}, ${Y})`)}{{figure 0}}**检验。** $${chain(`g(${X}) = ${coefL(a)}\\log_{${b}} ${x0}${plusK(k)}`, y0 === 0 ? `0${plusK(k)}` : `${aTimes(a, "1")}${plusK(k)}`, `${Y}`)}$，所以 $(${X}, ${Y})$ 在 $g$ 的图象上。`,
            ),
          }),
          solutionFigures: [logMoveFigure(a, b, h, k, x0, y0)],
        };
      },
    },
    {
      id: "equations-of-transformed-logarithms",
      figure: algebraDrawings3["combining-graph-transformations-of-logarithmic-functions#equations-of-transformed-logarithms"],
      title: t("Equations from descriptions", "由描述写解析式"),
      explanation: t(
        `Build the equation from $f(x) = \\log_{b} x$ one move at a time, each in its own place:

- a shift $h$ to the right replaces $x$ by $x - h$, so that the old value at $x$ now appears at $x + h$;
- a stretch by $|a|$, with a reflection when $a < 0$, multiplies the whole logarithm by $a$;
- a shift $k$ up adds $k$ at the end.

Shifting $\\log_{2} x$ $3$ units left and $2$ units down: left $3$ is $h = -3$, so $x$ becomes $x - (-3) = x + 3$, and down $2$ subtracts $2$:

$$\\log_{2} x \\to \\log_{2}(x + 3) \\to \\log_{2}(x + 3) - 2$$

Check with the key point $(1, 0)$: it should move to $(-2, -2)$, and $\\log_{2}(-2 + 3) - 2 = -2$.

> **Watch out.** A shift to the right is $x - h$ inside, not $x + h$; a shift up is $+ k$ outside. Keep the two apart: the horizontal number goes inside the logarithm and the vertical one outside.`,
        `从 $f(x) = \\log_{b} x$ 出发，一步一步写出解析式，每一步改变各自的位置：

- 向右平移 $h$，把 $x$ 换成 $x - h$，这样原来在 $x$ 处的值出现在 $x + h$ 处；
- 伸长为 $|a|$ 倍（$a < 0$ 时还要翻折），整个对数乘以 $a$；
- 向上平移 $k$，在最后加上 $k$。

把 $\\log_{2} x$ 向左平移 $3$ 个单位、向下平移 $2$ 个单位：向左 $3$ 即 $h = -3$，$x$ 变成 $x - (-3) = x + 3$；向下 $2$ 就减去 $2$：

$$\\log_{2} x \\to \\log_{2}(x + 3) \\to \\log_{2}(x + 3) - 2$$

用关键点 $(1, 0)$ 检验：它应该移到 $(-2, -2)$，而 $\\log_{2}(-2 + 3) - 2 = -2$。

> **注意。** 向右平移在括号里是 $x - h$，不是 $x + h$；向上平移是在外面 $+ k$。两个数不要混淆：水平的数放在对数里面，竖直的数放在外面。`,
      ),
      generate(rng) {
        const B = drawBase(rng, [2, 3, 4, 5]);
        const a = rng.pick([1, 1, -1, 2, 3, -2]);
        const h = rng.nonZero(-5, 5);
        const k = rng.nonZero(-5, 5);
        const d = describe(a, h, k);
        const f = B.of("x");
        const answer = logT(a, B, h, k);
        const factor =
          a === 1
            ? t("There is no stretch or reflection, so the factor stays $1$.", "没有伸缩也没有翻折，系数仍是 $1$。")
            : t(
                `To ${a === -1 ? "reflect it" : a < 0 ? `stretch it by $${-a}$ and reflect it` : `stretch it by $${a}$`}, multiply the logarithm by $${a}$:${steps(`${logT(1, B, h, 0)} \\to ${logT(a, B, h, 0)}`)}`,
                `要${a === -1 ? "翻折" : a < 0 ? `伸长为 $${-a}$ 倍并翻折` : `伸长为 $${a}$ 倍`}，就把对数乘以 $${a}$：${steps(`${logT(1, B, h, 0)} \\to ${logT(a, B, h, 0)}`)}`,
              );
        return reasoned(
          oneOf(rng, {
            prompt: t(
              `Start with the graph of $f(x) = ${f}$. ${d.en} Which function has the new graph?`,
              `从 $f(x) = ${f}$ 的图象开始，${d["zh-CN"]}所得图象是哪个函数的图象？`,
            ),
            right: m(`g(x) = ${answer}`),
            wrong: [
              m(`g(x) = ${logT(a, B, -h, k)}`),
              m(`g(x) = ${logT(a, B, h, -k)}`),
              m(`g(x) = ${logT(a, B, k, h)}`),
              m(`g(x) = ${logT(a, B, -h, -k)}`),
            ],
            solution: t(
              `${label(1, "The horizontal shift", "水平平移").en} ${tenLead(B).en}Shifting ${unitsEn(h)} ${h > 0 ? "right" : "left"} replaces $x$ by $${hForm(h, true)}$:${steps(`${f} \\to ${logT(1, B, h, 0)}`)}${label(2, "The factor", "系数").en} ${factor.en}

${label(3, "The vertical shift", "竖直平移").en} Shifting ${unitsEn(k)} ${k > 0 ? "up" : "down"} adds $${k}$ outside:${steps(`g(x) = ${answer}`)}**Check.** The key point $(1, 0)$ of $f$ should move to $(${1 + h}, ${k})$, and $g(${1 + h}) = ${coefL(a)}${B.of("1")}${plusK(k)} = ${k}$.`,
              `${label(1, "The horizontal shift", "水平平移")["zh-CN"]} ${tenLead(B)["zh-CN"]}向${h > 0 ? "右" : "左"}平移 $${Math.abs(h)}$ 个单位，就把 $x$ 换成 $${hForm(h, true)}$：${steps(`${f} \\to ${logT(1, B, h, 0)}`)}${label(2, "The factor", "系数")["zh-CN"]} ${factor["zh-CN"]}

${label(3, "The vertical shift", "竖直平移")["zh-CN"]} 向${k > 0 ? "上" : "下"}平移 $${Math.abs(k)}$ 个单位，就在外面加上 $${k}$：${steps(`g(x) = ${answer}`)}**检验。** $f$ 的关键点 $(1, 0)$ 应该移到 $(${1 + h}, ${k})$，而 $g(${1 + h}) = ${coefL(a)}${B.of("1")}${plusK(k)} = ${k}$。`,
            ),
          }),
          [
            [
              m(`g(x) = ${logT(a, B, -h, k)}`).en,
              "The horizontal shift has the wrong sign inside: moving right by $h$ makes the argument $x - h$.",
              "水平平移在括号内的符号错了：向右移 $h$，真数变成 $x - h$。",
            ],
            [
              m(`g(x) = ${logT(a, B, h, -k)}`).en,
              "The vertical shift has the wrong sign: moving up adds, and moving down subtracts.",
              "竖直平移的符号错了：向上移是加，向下移是减。",
            ],
            [
              m(`g(x) = ${logT(a, B, k, h)}`).en,
              "The two shifts are swapped: the horizontal one goes inside the logarithm and the vertical one outside.",
              "两个平移弄反了：水平平移在对数里面，竖直平移在外面。",
            ],
            [m(`g(x) = ${logT(a, B, -h, -k)}`).en, "Both shifts have the wrong sign.", "两个平移的符号都错了。"],
          ],
        );
      },
    },
    {
      id: "the-transformed-logarithm-from-its-graph",
      figure: algebraDrawings3["combining-graph-transformations-of-logarithmic-functions#the-transformed-logarithm-from-its-graph"],
      title: t("The equation from the graph", "由图象求解析式"),
      explanation: t(
        `To read $g(x) = a\\log_{b}(x - h) + k$ with $a = \\pm 1$ from its graph, use the two key points of $\\log_{b} x$, moved $h$ to the right:

- the vertical asymptote is $x = h$, which gives $h$;
- one unit right of it, at $x = h + 1$, the argument is $1$ and the logarithm is $0$, so the graph is at height $k$, which gives $k$;
- at $x = h + b$ the logarithm is $1$, so the graph is $1$ unit above $k$ when $a = 1$ and $1$ unit below when $a = -1$; how far this point lies from the asymptote gives $b$, and whether it is above or below gives $a$.

A graph with asymptote $x = 2$ through $(3, 1)$ and $(5, 2)$: $h = 2$; $(3, 1)$ is one unit right of the asymptote, so $k = 1$; $(5, 2)$ is $3$ units right and $1$ unit higher, so $b = 3$ and $a = 1$. It is $g(x) = \\log_{3}(x - 2) + 1$.

> **Watch out.** The asymptote $x = h$ gives the argument $x - h$: an asymptote at $x = -2$ means $x + 2$. Don't take the point $(h + 1, k)$ for the asymptote, and measure $b$ from the asymptote, not from the origin. A graph that falls from left to right has $a = -1$.`,
        `要从图象读出 $g(x) = a\\log_{b}(x - h) + k$（$a = \\pm 1$），就用 $\\log_{b} x$ 的两个关键点，它们都向右移了 $h$：

- 竖直渐近线是 $x = h$，由此得到 $h$；
- 在它右侧 $1$ 个单位，即 $x = h + 1$ 处，真数为 $1$，对数为 $0$，所以图象的高度是 $k$，由此得到 $k$；
- 在 $x = h + b$ 处对数为 $1$，所以 $a = 1$ 时图象比 $k$ 高 $1$，$a = -1$ 时比 $k$ 低 $1$；这个点离渐近线多远给出 $b$，在上方还是下方给出 $a$。

渐近线为 $x = 2$、经过 $(3, 1)$ 和 $(5, 2)$ 的图象：$h = 2$；$(3, 1)$ 在渐近线右侧 $1$ 个单位，所以 $k = 1$；$(5, 2)$ 在右侧 $3$ 个单位且高 $1$，所以 $b = 3$，$a = 1$。它是 $g(x) = \\log_{3}(x - 2) + 1$。

> **注意。** 渐近线 $x = h$ 对应真数 $x - h$：渐近线在 $x = -2$ 表示 $x + 2$。不要把点 $(h + 1, k)$ 当成渐近线；$b$ 要从渐近线量起，不是从原点量起。从左到右下降的图象 $a = -1$。`,
      ),
      generate(rng) {
        const a = rng.pick([1, -1]);
        const b = rng.pick([2, 3, 4]);
        const h = rng.int(-2, 4);
        const k = rng.int(-3, 3);
        const B = numBase(b);
        const g = (aa: number, bb: number, hh: number, kk: number) => m(`g(x) = ${logT(aa, numBase(bb), hh, kk)}`);
        const p1: Point = [h + 1, k];
        const p2: Point = [h + b, k + a];
        return annotate(
          {
            ...reasoned(
              oneOf(rng, {
                prompt: t(
                  `The graph of $g(x) = a\\log_{b}(x - h) + k$ with $a = 1$ or $a = -1$ is shown; its vertical asymptote is ${h === 0 ? "the $y$-axis" : "dashed"}, and the marked points lie on grid points. Which function is it?`,
                  `如图是 $g(x) = a\\log_{b}(x - h) + k$（$a = 1$ 或 $a = -1$）的图象，${h === 0 ? "它的竖直渐近线是 $y$ 轴" : "虚线是它的竖直渐近线"}，标出的点都在格点上。它是哪个函数？`,
                ),
                right: g(a, b, h, k),
                wrong: [g(a, b, -h, k), g(-a, b, h, k), g(a, b + 1, h, k), g(a, b, h + 1, k)],
                solution: t(
                  `${label(1, "The asymptote", "渐近线").en} The vertical asymptote is $x = ${h}$, so the argument is $${linear(1, -h)}$ and $h = ${h}$.

${label(2, "The point where the logarithm is 0", "对数为 0 的点").en} One unit right of the asymptote the argument is $1$ and the logarithm is $0$. The graph passes through $(${p1[0]}, ${k})$, so $k = ${k}$.

${label(3, "The point where the logarithm is 1", "对数为 1 的点").en} The graph also passes through $(${p2[0]}, ${p2[1]})$, which is $${b}$ units right of the asymptote and $1$ unit ${a > 0 ? "above" : "below"} the height $${k}$. So the logarithm is $1$ where the argument is $${b}$, which makes $b = ${b}$, and ${a > 0 ? "the graph rises, so $a = 1$" : "the graph falls, so $a = -1$"}. Hence $g(x) = ${logT(a, B, h, k)}$.

**Check.** $g(${p1[0]}) = ${coefL(a)}\\log_{${b}} 1${plusK(k)} = ${k}$ and $g(${p2[0]}) = ${coefL(a)}\\log_{${b}} ${b}${plusK(k)} = ${p2[1]}$, the two marked points.`,
                  `${label(1, "The asymptote", "渐近线")["zh-CN"]} 竖直渐近线是 $x = ${h}$，所以真数是 $${linear(1, -h)}$，$h = ${h}$。

${label(2, "The point where the logarithm is 0", "对数为 0 的点")["zh-CN"]} 在渐近线右侧 $1$ 个单位处，真数为 $1$，对数为 $0$。图象经过 $(${p1[0]}, ${k})$，所以 $k = ${k}$。

${label(3, "The point where the logarithm is 1", "对数为 1 的点")["zh-CN"]} 图象还经过 $(${p2[0]}, ${p2[1]})$，它在渐近线右侧 $${b}$ 个单位，比高度 $${k}$ ${a > 0 ? "高" : "低"} $1$。所以真数为 $${b}$ 时对数为 $1$，即 $b = ${b}$；${a > 0 ? "图象上升，所以 $a = 1$" : "图象下降，所以 $a = -1$"}。因此 $g(x) = ${logT(a, B, h, k)}$。

**检验。** $g(${p1[0]}) = ${coefL(a)}\\log_{${b}} 1${plusK(k)} = ${k}$，$g(${p2[0]}) = ${coefL(a)}\\log_{${b}} ${b}${plusK(k)} = ${p2[1]}$，正是标出的两个点。`,
                ),
              }),
              [
                [
                  g(a, b, -h, k).en,
                  "The sign inside is reversed: an asymptote at $x = h$ comes from the argument $x - h$.",
                  "括号里的符号反了：渐近线 $x = h$ 来自真数 $x - h$。",
                ],
                [
                  g(-a, b, h, k).en,
                  a > 0
                    ? "This graph would fall from left to right, but the graph shown rises."
                    : "This graph would rise from left to right, but the graph shown falls.",
                  a > 0 ? "这个函数的图象从左到右下降，但图中的图象上升。" : "这个函数的图象从左到右上升，但图中的图象下降。",
                ],
                [
                  g(a, b + 1, h, k).en,
                  `With this base the logarithm would reach $1$ only $${b + 1}$ units right of the asymptote, not $${b}$.`,
                  `用这个底数，对数要在渐近线右侧 $${b + 1}$ 个单位处才等于 $1$，而不是 $${b}$ 个单位。`,
                ],
                [
                  g(a, b, h + 1, k).en,
                  `This puts the asymptote at $x = ${h + 1}$, where the graph already has the height $${k}$: that point is one unit right of the asymptote.`,
                  `这把渐近线放在 $x = ${h + 1}$，但图象在那里已经有高度 $${k}$：那个点在渐近线右侧 $1$ 个单位。`,
                ],
              ],
            ),
            figure: logGraph(a, b, h, k, [
              { at: p1, dir: "e", bare: true },
              { at: p2, dir: "e", bare: true },
            ]),
          },
          logView,
          [
            { kind: "line", a: [h, 0], b: [h, 1], dashed: true, tone: "result" },
            { kind: "point", at: p1, label: at(p1), dir: "se", tone: "result" },
          ],
          `The asymptote is x = ${h}, and the graph passes through ${at(p1)}.`,
          `渐近线是 x = ${h}，图象经过 ${at(p1)}。`,
        );
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
    { topic: "solving-multi-step-inequalities", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.IF.C.7.E", "CCSS.HSF.IF.B.5"],
  intro: t(
    `We can move the graph of $\\log_{b} x$ to the graph of $a\\log_{b}(x - h) + k$, and we can solve logarithmic equations by rewriting them in exponential form. Together they give the properties of a transformed logarithm straight from its formula.

Take $f(x) = 2\\log_{3}(x + 1) - 4$.

- **Domain.** A logarithm needs a positive argument: $x + 1 > 0$, so $x > -1$. The domain is $(-1, \\infty)$, and $x = -1$ is the vertical asymptote.
- **Range.** $\\log_{3} u$ takes every real value, so after stretching and shifting $f$ still does: the range is all real numbers.
- **$x$-intercept.** Solve $f(x) = 0$: $2\\log_{3}(x + 1) = 4$, so $\\log_{3}(x + 1) = 2$, so $x + 1 = 3^{2} = 9$ and $x = 8$.
- **Direction.** As $x$ grows, $x + 1$ grows, so does $\\log_{3}(x + 1)$, and the positive factor $2$ keeps it that way: $f$ is increasing.

{{figure 0}}

In this lesson we find the domain, the $x$-intercept and the direction of any transformed logarithm.`,
    `我们会把 $\\log_{b} x$ 的图象移到 $a\\log_{b}(x - h) + k$ 的图象，也会把对数方程化为指数式来解。把两者结合，就能直接从解析式读出变换后对数函数的性质。

取 $f(x) = 2\\log_{3}(x + 1) - 4$。

- **定义域。** 对数要求真数为正：$x + 1 > 0$，即 $x > -1$。定义域是 $(-1, \\infty)$，$x = -1$ 是竖直渐近线。
- **值域。** $\\log_{3} u$ 取遍所有实数，伸缩和平移之后 $f$ 仍然如此：值域是全体实数。
- **$x$ 轴截距。** 解 $f(x) = 0$：$2\\log_{3}(x + 1) = 4$，所以 $\\log_{3}(x + 1) = 2$，于是 $x + 1 = 3^{2} = 9$，$x = 8$。
- **单调性。** $x$ 增大时 $x + 1$ 增大，$\\log_{3}(x + 1)$ 也增大，正的系数 $2$ 保持这一点：$f$ 递增。

{{figure 0}}

这节课我们求任意变换后对数函数的定义域、$x$ 轴截距和单调性。`,
  ),
  introFigures: [
    logGraph(2, 3, -1, -4, [
      { at: [0, -4], dir: "se" },
      { at: [2, -2], dir: "se" },
      { at: [8, 0], dir: "s" },
    ]),
  ],
  knowledgePoints: [
    {
      id: "the-domain-of-a-transformed-logarithm",
      title: t("The domain", "定义域"),
      explanation: t(
        `A logarithm is defined only for positive arguments: no power of a positive base is $0$ or negative. So the domain of $f(x) = a\\log_{b}(cx + d) + k$ is the solution set of the inequality $cx + d > 0$; the numbers $a$, $b$ and $k$ play no part. For $f(x) = \\log_{3}(6 - 2x) + 1$:

$$6 - 2x > 0 \\implies -2x > -6 \\implies x < 3$$

The domain is $(-\\infty, 3)$. Check with $x = 2$: the argument is $6 - 4 = 2 > 0$. The range of every such function is all real numbers.

> **Watch out.** Dividing by a negative number reverses the inequality: $-2x > -6$ gives $x < 3$, not $x > 3$. The inequality is strict, because $\\log_{b} 0$ is not defined, so the interval is open at its end. And the domain is never all real numbers.`,
        `对数只对正的真数有定义：正底数的幂不会是 $0$ 或负数。所以 $f(x) = a\\log_{b}(cx + d) + k$ 的定义域是不等式 $cx + d > 0$ 的解集，与 $a$、$b$、$k$ 都无关。对 $f(x) = \\log_{3}(6 - 2x) + 1$：

$$6 - 2x > 0 \\implies -2x > -6 \\implies x < 3$$

定义域是 $(-\\infty, 3)$。用 $x = 2$ 检验：真数为 $6 - 4 = 2 > 0$。这类函数的值域都是全体实数。

> **注意。** 除以负数时不等号要改变方向：$-2x > -6$ 得到 $x < 3$，不是 $x > 3$。不等式是严格的，因为 $\\log_{b} 0$ 没有定义，所以区间在端点处是开的。定义域也永远不是全体实数。`,
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
        const rel = right ? ">" : "<";
        const lines = [`${arg} > 0`];
        const moves: Text[] = [];
        if (d !== 0) {
          lines.push(`${coefL(c)}x > ${-d}`);
          moves.push(undoAdd(d));
        }
        if (c !== 1) {
          lines.push(`x ${rel} ${num(edge)}`);
          moves.push(
            c < 0
              ? t(
                  `divide both sides by $${c}$ and reverse the inequality, since $${c}$ is negative`,
                  `两边同时除以 $${c}$，因为 $${c}$ 是负数，不等号要改变方向`,
                )
              : undoTimes(c),
          );
        }
        const how = joinHow(moves);
        const interval = right ? `(${num(edge)}, \\infty)` : `(-\\infty, ${num(edge)})`;
        const test = edge.add(Q.of(right ? 1 : -1));
        const testArg = Math.abs(c);
        return intervalProblem({
          prompt: t(
            `What is the domain of $f(x) = ${coefL(a)}${B.of(arg)}${plusK(k)}$? Write it in interval notation.`,
            `$f(x) = ${coefL(a)}${B.of(arg)}${plusK(k)}$ 的定义域是什么？用区间表示。`,
          ),
          set: set(right),
          form: "interval",
          wrong: [set(!right), set(right, true), realLine, [{ lo: edge.neg(), loClosed: false, hiClosed: false }]],
          solution: t(
            `${label(1, "The argument must be positive", "真数必须为正").en} ${tenLead(B).en}A logarithm is defined only for positive arguments, so we need $${arg} > 0$. The numbers outside the logarithm do not matter.

${label(2, "Solve the inequality", "解不等式").en} ${moves.length > 0 ? `To get $x$ alone, ${how.en}:` : "This already says what $x$ must be:"}${steps(...lines)}The domain is $${interval}$, open at $${num(edge)}$ because the argument is $0$ there.

**Check.** At $x = ${num(test)}$, inside the domain, the argument is $${c === 1 ? num(test) : c === -1 ? `-${paren(test)}` : `${c} \\cdot ${paren(test)}`}${plusK(d)} = ${testArg} > 0$; at $x = ${num(edge)}$ it is $0$.`,
            `${label(1, "The argument must be positive", "真数必须为正")["zh-CN"]} ${tenLead(B)["zh-CN"]}对数只对正的真数有定义，所以需要 $${arg} > 0$。对数外面的数都无关。

${label(2, "Solve the inequality", "解不等式")["zh-CN"]} ${moves.length > 0 ? `为了单独留下 $x$，${how["zh-CN"]}：` : "这已经说明了 $x$ 的范围："}${steps(...lines)}定义域是 $${interval}$；在 $${num(edge)}$ 处真数为 $0$，所以区间在这里是开的。

**检验。** 在定义域内取 $x = ${num(test)}$，真数为 $${c === 1 ? num(test) : c === -1 ? `-${paren(test)}` : `${c} \\cdot ${paren(test)}`}${plusK(d)} = ${testArg} > 0$；在 $x = ${num(edge)}$ 处真数为 $0$。`,
          ),
        });
      },
    },
    {
      id: "the-x-intercept-of-a-transformed-logarithm",
      title: t("The $x$-intercept", "$x$ 轴截距"),
      explanation: t(
        `The $x$-intercept is where $f(x) = 0$. To solve $a\\log_{b}(x - h) + k = 0$, get the logarithm alone, then rewrite $\\log_{b} u = m$ in exponential form $u = b^{m}$, which removes the logarithm:

$$2\\log_{3}(x - 1) + 4 = 0 \\implies \\log_{3}(x - 1) = -2 \\implies x - 1 = 3^{-2} = \\frac{1}{9} \\implies x = \\frac{10}{9}$$

Check: $2\\log_{3}\\frac{1}{9} + 4 = 2(-2) + 4 = 0$.

Unlike an exponential function, a logarithmic function always has exactly one $x$-intercept: its range is all real numbers, so it reaches $0$, and it only rises or only falls, so it reaches $0$ once.

> **Watch out.** $\\log_{3}(x - 1) = -2$ means $x - 1 = 3^{-2}$, a fraction, not $3^{2}$ and not $-2$ itself. After finding $x - 1$, add $1$ back rather than subtracting it.`,
        `$x$ 轴截距是 $f(x) = 0$ 的地方。解 $a\\log_{b}(x - h) + k = 0$ 时，先把对数单独留在一边，再把 $\\log_{b} u = m$ 写成指数式 $u = b^{m}$，对数就消掉了：

$$2\\log_{3}(x - 1) + 4 = 0 \\implies \\log_{3}(x - 1) = -2 \\implies x - 1 = 3^{-2} = \\frac{1}{9} \\implies x = \\frac{10}{9}$$

检验：$2\\log_{3}\\frac{1}{9} + 4 = 2(-2) + 4 = 0$。

与指数函数不同，对数函数总是恰好有一个 $x$ 轴截距：它的值域是全体实数，所以能取到 $0$；它只升不降或只降不升，所以只取到一次。

> **注意。** $\\log_{3}(x - 1) = -2$ 表示 $x - 1 = 3^{-2}$，是一个分数，不是 $3^{2}$，也不是 $-2$ 本身。求出 $x - 1$ 后，要加回 $1$，不是减去 $1$。`,
      ),
      generate(rng) {
        const B = drawBase(rng, [2, 3, 4, 5]);
        const a = rng.pick([1, 2, 3, -1, -2]);
        const mm = rng.int(-2, 3);
        const h = rng.int(-6, 6);
        const k = -a * mm;
        const p = Q.of(B.b).pow(mm);
        const x = p.add(Q.of(h));
        const arg = linear(1, -h);
        const log = B.of(arg);
        const lines = [`${logT(a, B, h, k)} = 0`];
        const moves: Text[] = [];
        if (k !== 0) {
          lines.push(`${coefL(a)}${log} = ${-k}`);
          moves.push(undoAdd(k));
        }
        if (a !== 1) {
          lines.push(`${log} = ${mm}`);
          moves.push(undoTimes(a));
        }
        const power =
          mm === -1
            ? `${B.b}^{-1} = \\frac{1}{${B.b}}`
            : mm < 0
              ? `${B.b}^{${mm}} = \\frac{1}{${B.b}^{${-mm}}} = ${num(p)}`
              : `${B.b}^{${mm}} = ${num(p)}`;
        return numberProblem({
          prompt: t(
            `Find the $x$-coordinate of the $x$-intercept of the graph of $f(x) = ${logT(a, B, h, k)}$.`,
            `求 $f(x) = ${logT(a, B, h, k)}$ 的图象与 $x$ 轴交点的横坐标。`,
          ),
          answer: x,
          solveFor: "x",
          wrong: [Q.of(h).sub(Q.of(B.b).pow(mm)), Q.of(B.b).pow(-mm).add(Q.of(h)), Q.of(h + mm)],
          solution: t(
            `${label(1, "Isolate the logarithm", "单独留下对数").en} ${tenLead(B).en}Set $f(x) = 0$${moves.length > 0 ? ` and ${joinHow(moves).en}` : ""}:${steps(...lines)}${label(2, "Exponential form", "化为指数式").en} $\\log_{${B.b}} u = ${mm}$ means $u = ${B.b}^{${mm}}$, so${steps(`${arg} = ${power}`)}${label(3, "Solve for $x$", "求 $x$").en} ${h === 0 ? "The argument is $x$ itself:" : `${undoAdd(-h).en.charAt(0).toUpperCase()}${undoAdd(-h).en.slice(1)}:`}${steps(chain(`x = ${num(p)}${plusK(h)}`, num(x)))}**Check.** $f\\left(${num(x)}\\right) = ${coefL(a)}${B.of(num(p))}${plusK(k)} = ${a === 1 ? num(mm) : aTimes(a, paren(mm))}${plusK(k)} = 0$.`,
            `${label(1, "Isolate the logarithm", "单独留下对数")["zh-CN"]} ${tenLead(B)["zh-CN"]}令 $f(x) = 0$${moves.length > 0 ? `，${joinHow(moves)["zh-CN"]}` : ""}：${steps(...lines)}${label(2, "Exponential form", "化为指数式")["zh-CN"]} $\\log_{${B.b}} u = ${mm}$ 表示 $u = ${B.b}^{${mm}}$，所以${steps(`${arg} = ${power}`)}${label(3, "Solve for $x$", "求 $x$")["zh-CN"]} ${h === 0 ? "真数就是 $x$ 本身：" : `${undoAdd(-h)["zh-CN"]}：`}${steps(chain(`x = ${num(p)}${plusK(h)}`, num(x)))}**检验。** $f\\left(${num(x)}\\right) = ${coefL(a)}${B.of(num(p))}${plusK(k)} = ${a === 1 ? num(mm) : aTimes(a, paren(mm))}${plusK(k)} = 0$。`,
          ),
        });
      },
    },
    {
      id: "direction-of-a-transformed-logarithm",
      figure: algebraDrawings3["properties-of-transformed-logarithmic-functions#direction-of-a-transformed-logarithm"],
      title: t("Increasing or decreasing", "递增还是递减"),
      explanation: t(
        `With a base $b > 1$, $\\log_{b} u$ increases as $u$ increases. In $f(x) = a\\log_{b}(cx + d) + k$ two signs can turn this around:

- a negative $c$ makes the argument $cx + d$ decrease as $x$ increases, so the logarithm decreases;
- a negative $a$ reflects the graph across the $x$-axis.

Each negative sign reverses the direction once, and $k$ and $d$ only shift the graph. So $f$ increases exactly when $a$ and $c$ have the same sign. For $f(x) = -2\\log_{3}(4 - x)$, both $a = -2$ and $c = -1$ are negative, so $f$ is increasing: at $x = 1$ the value is $-2\\log_{3} 3 = -2$, and at $x = 3$ it is $-2\\log_{3} 1 = 0$.

> **Watch out.** Look at both signs: a negative factor alone makes $f$ decrease, but together with a negative $c$ the two reversals cancel. The constants $d$ and $k$ never change the direction.`,
        `底数 $b > 1$ 时，$\\log_{b} u$ 随 $u$ 增大而增大。在 $f(x) = a\\log_{b}(cx + d) + k$ 中，有两个符号可以把它反过来：

- 负的 $c$ 使真数 $cx + d$ 随 $x$ 增大而减小，于是对数减小；
- 负的 $a$ 把图象关于 $x$ 轴翻折。

每个负号使方向反转一次，$k$ 和 $d$ 只是平移图象。所以 $f$ 递增当且仅当 $a$ 与 $c$ 同号。对 $f(x) = -2\\log_{3}(4 - x)$，$a = -2$ 和 $c = -1$ 都是负的，所以 $f$ 递增：$x = 1$ 时函数值为 $-2\\log_{3} 3 = -2$，$x = 3$ 时为 $-2\\log_{3} 1 = 0$。

> **注意。** 两个符号都要看：只有负的系数时 $f$ 递减，但再加上负的 $c$，两次反转就抵消了。常数 $d$ 和 $k$ 从不改变单调性。`,
      ),
      generate(rng) {
        const B = drawBase(rng, [2, 3, 5, 7]);
        const a = rng.pick([1, 2, 3, -1, -2, -3]);
        const c = rng.pick([1, 2, -1, -2, -3]);
        const d = rng.int(-8, 8);
        const k = rng.int(-5, 5);
        const increasing = a > 0 === c > 0;
        const arg = linear(c, d);
        const f = `${coefL(a)}${B.of(arg)}${plusK(k)}`;
        const x1 = Q.of(1 - d, c);
        const x2 = Q.of(B.b - d, c);
        const left = c > 0 ? x1 : x2;
        const rightX = c > 0 ? x2 : x1;
        const [vLeft, vRight] = c > 0 ? [k, a + k] : [a + k, k];
        const wrongWhy: readonly [string, string, string] = increasing
          ? a > 0
            ? [
                "Decreasing",
                "The argument and the logarithm both increase, and the positive factor keeps the direction.",
                "真数和对数都增大，正的系数保持方向不变。",
              ]
            : [
                "Decreasing",
                "The negative $c$ and the negative factor each reverse the direction, so the two reversals cancel.",
                "负的 $c$ 和负的系数各使方向反转一次，两次反转抵消了。",
              ]
          : a > 0
            ? [
                "Increasing",
                "The argument decreases as $x$ increases, so the logarithm decreases too.",
                "$x$ 增大时真数减小，所以对数也减小。",
              ]
            : [
                "Increasing",
                "The logarithm increases, but the negative factor reflects the graph, so $f$ decreases.",
                "对数递增，但负的系数把图象翻折了，所以 $f$ 递减。",
              ];
        return reasoned(
          choiceProblem({
            prompt: t(`Is $f(x) = ${f}$ increasing or decreasing on its domain?`, `$f(x) = ${f}$ 在定义域上是递增的还是递减的？`),
            options: [t("Increasing", "递增"), t("Decreasing", "递减")],
            correct: increasing ? 0 : 1,
            solution: t(
              `${label(1, "The argument", "真数").en} ${tenLead(B).en}As $x$ increases, the argument $${arg}$ ${c > 0 ? "increases" : "decreases"}, because $c = ${c}$ is ${c > 0 ? "positive" : "negative"}. The base $${B.b}$ is greater than $1$, so the logarithm ${c > 0 ? "increases" : "decreases"} with it.

${label(2, "The factor", "系数").en} ${a < 0 ? `The factor $${a}$ is negative, so it reverses the direction.` : a === 1 ? "There is no factor in front, so the direction stays." : `The factor $${a}$ is positive, so it keeps the direction.`} Hence $f$ is ${increasing ? "increasing" : "decreasing"}.

**Check.** The argument is $1$ at $x = ${num(x1)}$, where $f = ${k}$, and $${B.b}$ at $x = ${num(x2)}$, where $f = ${a + k}$. From $x = ${num(left)}$ to $x = ${num(rightX)}$ the value goes from $${vLeft}$ to $${vRight}$: it ${increasing ? "goes up" : "goes down"}.`,
              `${label(1, "The argument", "真数")["zh-CN"]} ${tenLead(B)["zh-CN"]}$x$ 增大时，真数 $${arg}$ ${c > 0 ? "增大" : "减小"}，因为 $c = ${c}$ ${c > 0 ? "为正" : "为负"}。底数 $${B.b}$ 大于 $1$，所以对数也随之${c > 0 ? "增大" : "减小"}。

${label(2, "The factor", "系数")["zh-CN"]} ${a < 0 ? `系数 $${a}$ 为负，使方向反过来。` : a === 1 ? "前面没有系数，方向不变。" : `系数 $${a}$ 为正，保持方向不变。`}所以 $f$ ${increasing ? "递增" : "递减"}。

**检验。** 在 $x = ${num(x1)}$ 处真数为 $1$，$f = ${k}$；在 $x = ${num(x2)}$ 处真数为 $${B.b}$，$f = ${a + k}$。从 $x = ${num(left)}$ 到 $x = ${num(rightX)}$，函数值从 $${vLeft}$ 变到 $${vRight}$，${increasing ? "变大了" : "变小了"}。`,
            ),
          }),
          [wrongWhy],
        );
      },
    },
  ],
  diagnostic: "the-domain-of-a-transformed-logarithm",
};

const inverseView: PlaneView = { xMin: -3, xMax: 10, yMin: -3, yMax: 10 };

/** inverseFigure draws y = 2^x + 3 and its inverse y = log₂(x − 3), mirror images across the dashed line y = x, with the points (1, 5) and (5, 1). */
function inverseFigure(): Figure {
  return {
    svg: plane(inverseView, [
      { kind: "line", a: [0, 0], b: [1, 1], dashed: true },
      { kind: "curve", f: (x) => 2 ** x + 3 },
      { kind: "curve", f: (x) => (x > 3 ? Math.log2(x - 3) : Number.NaN), from: 3 + 1e-6, accent: true },
      { kind: "point", at: [1, 5], label: "(1, 5)", dir: "w" },
      { kind: "point", at: [5, 1], tone: "result", label: "(5, 1)", dir: "se" },
    ]),
    alt: t(
      "The graphs of y = 2^x + 3 and y = log_2(x − 3), mirror images across the dashed line y = x. The point (1, 5) on the first matches the point (5, 1) on the second.",
      "y = 2^x + 3 与 y = log_2(x − 3) 的图象，关于虚线 y = x 对称。前者上的点 (1, 5) 对应后者上的点 (5, 1)。",
    ),
  };
}

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
    { topic: "solving-exponential-equations", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.BF.B.4", "CCSS.HSF.BF.B.5"],
  intro: t(
    `To find the inverse of a function, we write $y = f(x)$, swap $x$ and $y$, and solve for $y$. We also know that $\\log_{b} x$ is the inverse of $b^{x}$: $b^{y} = x$ and $y = \\log_{b} x$ say the same thing. That conversion is exactly the tool for solving when $y$ sits in an exponent or inside a logarithm.

Take $f(x) = 2^{x} + 3$. Swap $x$ and $y$, get the power alone, and rewrite it in logarithmic form:

$$x = 2^{y} + 3 \\implies 2^{y} = x - 3 \\implies y = \\log_{2}(x - 3)$$

So $f^{-1}(x) = \\log_{2}(x - 3)$. Check: $f(1) = 2 + 3 = 5$ and $f^{-1}(5) = \\log_{2} 2 = 1$; the inverse undoes $f$.

{{figure 0}}

The graphs are mirror images across $y = x$, and the horizontal asymptote $y = 3$ of $f$ becomes the vertical asymptote $x = 3$ of $f^{-1}$.

In this lesson we invert logarithmic and exponential functions and evaluate inverses.`,
    `求函数的反函数时，写成 $y = f(x)$，交换 $x$ 与 $y$，再解出 $y$。我们也知道 $\\log_{b} x$ 是 $b^{x}$ 的反函数：$b^{y} = x$ 与 $y = \\log_{b} x$ 说的是同一件事。当 $y$ 在指数上或对数里时，这种互化正是求解的工具。

取 $f(x) = 2^{x} + 3$。交换 $x$ 与 $y$，把幂单独留下，再写成对数式：

$$x = 2^{y} + 3 \\implies 2^{y} = x - 3 \\implies y = \\log_{2}(x - 3)$$

所以 $f^{-1}(x) = \\log_{2}(x - 3)$。检验：$f(1) = 2 + 3 = 5$，$f^{-1}(5) = \\log_{2} 2 = 1$；反函数把 $f$ 的作用还原了。

{{figure 0}}

两个图象关于 $y = x$ 对称，$f$ 的水平渐近线 $y = 3$ 变成 $f^{-1}$ 的竖直渐近线 $x = 3$。

这节课我们求对数函数和指数函数的反函数，并计算反函数的值。`,
  ),
  introFigures: [inverseFigure()],
  knowledgePoints: [
    {
      id: "inverse-of-a-logarithmic-function",
      title: t("The inverse of a logarithmic function", "对数函数的反函数"),
      explanation: t(
        `To invert $f$, write $y = f(x)$, swap $x$ and $y$, and solve for $y$. When $y$ is inside a logarithm, first get the logarithm alone, then convert $\\log_{b} u = v$ to exponential form $u = b^{v}$, which frees $y$:

$$x = \\log_{2}(y - 1) + 3 \\implies \\log_{2}(y - 1) = x - 3 \\implies y - 1 = 2^{x - 3}$$

So $f^{-1}(x) = 2^{x - 3} + 1$. Check: $f(3) = \\log_{2} 2 + 3 = 4$ and $f^{-1}(4) = 2^{1} + 1 = 3$. The same works for $\\ln$, with base $e$: the inverse of $\\ln(x + 4) - 1$ is $e^{x + 1} - 4$.

> **Watch out.** The number added outside the logarithm moves to the exponent with the **opposite** sign: $+ 3$ becomes $x - 3$. The shift inside the logarithm ends up added outside the power, again with its sign reversed: $y - 1$ gives $+ 1$. Don't swap the two shifts.`,
        `求 $f$ 的反函数：写成 $y = f(x)$，交换 $x$ 与 $y$，再解出 $y$。当 $y$ 在对数里时，先把对数单独留在一边，再把 $\\log_{b} u = v$ 化为指数式 $u = b^{v}$，$y$ 就出来了：

$$x = \\log_{2}(y - 1) + 3 \\implies \\log_{2}(y - 1) = x - 3 \\implies y - 1 = 2^{x - 3}$$

所以 $f^{-1}(x) = 2^{x - 3} + 1$。检验：$f(3) = \\log_{2} 2 + 3 = 4$，$f^{-1}(4) = 2^{1} + 1 = 3$。对 $\\ln$ 也一样，底数是 $e$：$\\ln(x + 4) - 1$ 的反函数是 $e^{x + 1} - 4$。

> **注意。** 对数外面加的数移到指数里时符号**相反**：$+ 3$ 变成 $x - 3$。对数里面的平移最后加在幂的外面，符号也相反：$y - 1$ 得到 $+ 1$。两个平移不要对调。`,
      ),
      generate(rng) {
        const natural = rng.bool(0.25);
        const b = natural ? 0 : rng.pick([2, 3, 4, 5, 10]);
        const h = rng.nonZero(-6, 6);
        const k = rng.int(-6, 6);
        const L = natural ? lnOf : (b === 10 ? tenBase : numBase(b)).of;
        const e = natural ? "e" : String(b);
        const f = `${L(linear(1, -h))}${plusK(k)}`;
        const pow = (hh: number, kk: number) => `${e}^{${linear(1, -kk)}}${plusK(hh)}`;
        const answer = pow(h, k);
        const lines = [`x = ${L(linear(1, -h, "y"))}${plusK(k)}`];
        if (k !== 0) lines.push(`${L(linear(1, -h, "y"))} = ${linear(1, -k)}`);
        const name = natural
          ? t("$\\ln u = v$ means $u = e^{v}$", "$\\ln u = v$ 表示 $u = e^{v}$")
          : t(`$\\log_{${b}} u = v$ means $u = ${b}^{v}$`, `$\\log_{${b}} u = v$ 表示 $u = ${b}^{v}$`);
        const x0 = h + 1;
        return expressionProblem({
          prompt: t(`Find the inverse of $f(x) = ${f}$.`, `求 $f(x) = ${f}$ 的反函数。`),
          answer,
          prefix: "f^{-1}(x) =",
          wrong: [pow(h, -k), pow(-h, k), pow(k, h), pow(-h, -k)],
          solution: t(
            `${label(1, "Swap and isolate", "交换并分离").en} ${tenLead(b === 10 ? tenBase : numBase(2)).en}Write $y = f(x)$ and swap $x$ and $y$${k === 0 ? "; the logarithm is already alone" : `, then ${undoAdd(k).en} to get the logarithm alone`}:${steps(...lines)}${label(2, "Exponential form", "化为指数式").en} ${name.en}, so the argument equals $${e}$ to the power $${linear(1, -k)}$:${steps(`${linear(1, -h, "y")} = ${e}^{${linear(1, -k)}}`)}${label(3, "Solve for $y$", "解出 $y$").en} ${undoAdd(-h).en.charAt(0).toUpperCase()}${undoAdd(-h).en.slice(1)}:${steps(`f^{-1}(x) = ${answer}`)}**Check.** $f(${x0}) = ${L("1")}${plusK(k)} = ${k}$, and $f^{-1}(${k}) = ${e}^{0}${plusK(h)} = ${x0}$: the inverse takes $${k}$ back to $${x0}$.`,
            `${label(1, "Swap and isolate", "交换并分离")["zh-CN"]} ${tenLead(b === 10 ? tenBase : numBase(2))["zh-CN"]}写成 $y = f(x)$，交换 $x$ 与 $y$${k === 0 ? "，对数已经单独在一边" : `，再${undoAdd(k)["zh-CN"]}，把对数单独留下`}：${steps(...lines)}${label(2, "Exponential form", "化为指数式")["zh-CN"]} ${name["zh-CN"]}，所以真数等于 $${e}$ 的 $${linear(1, -k)}$ 次幂：${steps(`${linear(1, -h, "y")} = ${e}^{${linear(1, -k)}}`)}${label(3, "Solve for $y$", "解出 $y$")["zh-CN"]} ${undoAdd(-h)["zh-CN"]}：${steps(`f^{-1}(x) = ${answer}`)}**检验。** $f(${x0}) = ${L("1")}${plusK(k)} = ${k}$，而 $f^{-1}(${k}) = ${e}^{0}${plusK(h)} = ${x0}$：反函数把 $${k}$ 送回 $${x0}$。`,
          ),
        });
      },
    },
    {
      id: "inverse-of-an-exponential-function",
      figure: algebraDrawings3["inverses-of-exponential-and-logarithmic-functions#inverse-of-an-exponential-function"],
      title: t("The inverse of an exponential function", "指数函数的反函数"),
      explanation: t(
        `When $y$ is in an exponent, get the power alone, then convert $b^{u} = v$ to logarithmic form $u = \\log_{b} v$, which brings $y$ down from the exponent:

$$x = 3^{y + 2} - 5 \\implies 3^{y + 2} = x + 5 \\implies y + 2 = \\log_{3}(x + 5)$$

So $f^{-1}(x) = \\log_{3}(x + 5) - 2$. Check: $f(-2) = 3^{0} - 5 = -4$ and $f^{-1}(-4) = \\log_{3} 1 - 2 = -2$. The horizontal asymptote $y = -5$ of $f$ becomes the vertical asymptote $x = -5$ of $f^{-1}$.

> **Watch out.** Move the added number across **before** taking the logarithm: $-5$ becomes $x + 5$ inside the logarithm, with the opposite sign. The shift in the exponent ends up outside the logarithm, also with the opposite sign: $y + 2$ gives $- 2$. Don't swap the two.`,
        `当 $y$ 在指数上时，先把幂单独留下，再把 $b^{u} = v$ 化为对数式 $u = \\log_{b} v$，$y$ 就从指数上下来了：

$$x = 3^{y + 2} - 5 \\implies 3^{y + 2} = x + 5 \\implies y + 2 = \\log_{3}(x + 5)$$

所以 $f^{-1}(x) = \\log_{3}(x + 5) - 2$。检验：$f(-2) = 3^{0} - 5 = -4$，$f^{-1}(-4) = \\log_{3} 1 - 2 = -2$。$f$ 的水平渐近线 $y = -5$ 变成 $f^{-1}$ 的竖直渐近线 $x = -5$。

> **注意。** 取对数**之前**先把加的数移到另一边：$-5$ 变成对数里的 $x + 5$，符号相反。指数里的平移最后在对数外面，符号也相反：$y + 2$ 得到 $- 2$。两者不要对调。`,
      ),
      generate(rng) {
        const natural = rng.bool(0.25);
        const b = rng.pick([2, 3, 4, 5, 7]);
        const L = natural ? lnOf : numBase(b).of;
        const e = natural ? "e" : String(b);
        const h = rng.nonZero(-6, 6);
        const k = rng.nonZero(-6, 6);
        const f = `${e}^{${linear(1, -h)}}${plusK(k)}`;
        const inv = (hh: number, kk: number) => `${L(linear(1, -kk))}${plusK(hh)}`;
        const name = natural
          ? t("$e^{u} = v$ means $u = \\ln v$", "$e^{u} = v$ 表示 $u = \\ln v$")
          : t(`$${b}^{u} = v$ means $u = \\log_{${b}} v$`, `$${b}^{u} = v$ 表示 $u = \\log_{${b}} v$`);
        return reasoned(
          oneOf(rng, {
            prompt: t(`Which function is the inverse of $f(x) = ${f}$?`, `哪个函数是 $f(x) = ${f}$ 的反函数？`),
            right: m(`f^{-1}(x) = ${inv(h, k)}`),
            wrong: [
              m(`f^{-1}(x) = ${inv(h, -k)}`),
              m(`f^{-1}(x) = ${inv(k, h)}`),
              m(`f^{-1}(x) = ${inv(-h, k)}`),
              m(`f^{-1}(x) = ${inv(-h, -k)}`),
            ],
            solution: t(
              `${label(1, "Swap and isolate", "交换并分离").en} Write $y = f(x)$, swap $x$ and $y$, then ${undoAdd(k).en} to get the power alone:${steps(`x = ${e}^{${linear(1, -h, "y")}}${plusK(k)}`, `${e}^{${linear(1, -h, "y")}} = ${linear(1, -k)}`)}${label(2, "Logarithmic form", "化为对数式").en} ${name.en}:${steps(`${linear(1, -h, "y")} = ${L(linear(1, -k))}`)}${label(3, "Solve for $y$", "解出 $y$").en} ${undoAdd(-h).en.charAt(0).toUpperCase()}${undoAdd(-h).en.slice(1)}:${steps(`f^{-1}(x) = ${inv(h, k)}`)}**Check.** $f(${h}) = ${e}^{0}${plusK(k)} = ${1 + k}$, and $f^{-1}(${1 + k}) = ${L("1")}${plusK(h)} = ${h}$: the inverse takes $${1 + k}$ back to $${h}$.`,
              `${label(1, "Swap and isolate", "交换并分离")["zh-CN"]} 写成 $y = f(x)$，交换 $x$ 与 $y$，再${undoAdd(k)["zh-CN"]}，把幂单独留下：${steps(`x = ${e}^{${linear(1, -h, "y")}}${plusK(k)}`, `${e}^{${linear(1, -h, "y")}} = ${linear(1, -k)}`)}${label(2, "Logarithmic form", "化为对数式")["zh-CN"]} ${name["zh-CN"]}：${steps(`${linear(1, -h, "y")} = ${L(linear(1, -k))}`)}${label(3, "Solve for $y$", "解出 $y$")["zh-CN"]} ${undoAdd(-h)["zh-CN"]}：${steps(`f^{-1}(x) = ${inv(h, k)}`)}**检验。** $f(${h}) = ${e}^{0}${plusK(k)} = ${1 + k}$，而 $f^{-1}(${1 + k}) = ${L("1")}${plusK(h)} = ${h}$：反函数把 $${1 + k}$ 送回 $${h}$。`,
            ),
          }),
          [
            [
              m(`f^{-1}(x) = ${inv(h, -k)}`).en,
              `The number added to the power has the wrong sign inside the logarithm: moving $${k}$ across gives $${linear(1, -k)}$.`,
              `幂外面加的数在对数里的符号错了：把 $${k}$ 移到另一边得到 $${linear(1, -k)}$。`,
            ],
            [
              m(`f^{-1}(x) = ${inv(k, h)}`).en,
              "The two shifts are swapped: the number added to the power goes inside the logarithm, and the shift in the exponent goes outside.",
              "两个平移对调了：幂外面加的数进入对数里面，指数里的平移到对数外面。",
            ],
            [
              m(`f^{-1}(x) = ${inv(-h, k)}`).en,
              `The shift from the exponent has the wrong sign: to solve $${linear(1, -h, "y")} = \\dots$ for $y$, ${undoAdd(-h).en}.`,
              `指数里的平移符号错了：由 $${linear(1, -h, "y")} = \\dots$ 解出 $y$，要${undoAdd(-h)["zh-CN"]}。`,
            ],
            [m(`f^{-1}(x) = ${inv(-h, -k)}`).en, "Both shifts have the wrong sign.", "两个平移的符号都错了。"],
          ],
        );
      },
    },
    {
      id: "evaluating-inverses",
      title: t("Evaluating an inverse", "求反函数的值"),
      explanation: t(
        `$f^{-1}(c)$ is the input that $f$ sends to $c$, so it is the solution of $f(x) = c$; there is no need to find the formula of $f^{-1}$ first. For $f(x) = 2(3)^{x} - 1$, find $f^{-1}(53)$ by solving $f(x) = 53$:

$$2(3)^{x} - 1 = 53 \\implies 2(3)^{x} = 54 \\implies 3^{x} = 27 = 3^{3} \\implies x = 3$$

So $f^{-1}(53) = 3$. Check: $f(3) = 2 \\cdot 27 - 1 = 53$.

> **Watch out.** The answer is the exponent $x$, not the power: stopping at $3^{x} = 27$ and answering $27$ is the most common slip. $f^{-1}(53)$ is also not $f(53)$ and not $\\frac{1}{f(53)}$: solve $f(x) = 53$, undoing the $- 1$ before dividing by $2$.`,
        `$f^{-1}(c)$ 是被 $f$ 映到 $c$ 的那个自变量，也就是方程 $f(x) = c$ 的解，不需要先求出 $f^{-1}$ 的解析式。对 $f(x) = 2(3)^{x} - 1$，解 $f(x) = 53$ 就得到 $f^{-1}(53)$：

$$2(3)^{x} - 1 = 53 \\implies 2(3)^{x} = 54 \\implies 3^{x} = 27 = 3^{3} \\implies x = 3$$

所以 $f^{-1}(53) = 3$。检验：$f(3) = 2 \\cdot 27 - 1 = 53$。

> **注意。** 答案是指数 $x$，不是幂：停在 $3^{x} = 27$ 就答 $27$ 是最常见的错误。$f^{-1}(53)$ 也不是 $f(53)$，更不是 $\\frac{1}{f(53)}$：要解 $f(x) = 53$，先消去 $- 1$，再除以 $2$。`,
      ),
      generate(rng) {
        const a = rng.pick([1, 2, 3, 4]);
        const b = rng.pick([2, 3, 5]);
        const mm = rng.int(-1, b === 2 ? 5 : 3);
        const k = rng.int(-9, 9);
        const p = Q.of(b).pow(mm);
        const c = p.mul(Q.of(a)).add(Q.of(k));
        const B = Q.of(b);
        const f = expT(a, B, 0, k);
        const lines = [`${f} = ${num(c)}`];
        const moves: Text[] = [];
        if (k !== 0) {
          lines.push(`${expT(a, B, 0, 0)} = ${num(c.sub(Q.of(k)))}`);
          moves.push(undoAdd(k));
        }
        if (a !== 1) {
          lines.push(`${b}^{x} = ${num(p)}`);
          moves.push(undoTimes(a));
        }
        return numberProblem({
          prompt: t(`For $f(x) = ${f}$, find $f^{-1}(${num(c)})$.`, `已知 $f(x) = ${f}$，求 $f^{-1}(${num(c)})$。`),
          answer: mm,
          wrong: [c.sub(Q.of(k)).div(Q.of(a)), -mm, c.div(Q.of(a))],
          solution: t(
            `${label(1, "Set up the equation", "列方程").en} $f^{-1}(${num(c)})$ is the input that $f$ sends to $${num(c)}$, so it solves $f(x) = ${num(c)}$.${moves.length > 0 ? ` To get the power alone, ${joinHow(moves).en}:` : " The power is already alone:"}${steps(...lines)}${label(2, "Match the exponents", "比较指数").en} Write $${num(p)}$ as a power of $${b}$: $${num(p)} = ${b}^{${mm}}$. Equal powers of $${b}$ have equal exponents, so $x = ${mm}$, and $f^{-1}(${num(c)}) = ${mm}$.

**Check.** $${chain(`f(${mm}) = ${aTimes(a, `${b}^{${mm}}`)}${plusK(k)}`, `${a === 1 ? num(p) : `${a} \\cdot ${num(p)}`}${plusK(k)}`, num(c))}$.`,
            `${label(1, "Set up the equation", "列方程")["zh-CN"]} $f^{-1}(${num(c)})$ 是被 $f$ 映到 $${num(c)}$ 的自变量，所以它满足 $f(x) = ${num(c)}$。${moves.length > 0 ? `为了单独留下幂，${joinHow(moves)["zh-CN"]}：` : "幂已经单独在一边："}${steps(...lines)}${label(2, "Match the exponents", "比较指数")["zh-CN"]} 把 $${num(p)}$ 写成 $${b}$ 的幂：$${num(p)} = ${b}^{${mm}}$。$${b}$ 的两个幂相等，指数就相等，所以 $x = ${mm}$，即 $f^{-1}(${num(c)}) = ${mm}$。

**检验。** $${chain(`f(${mm}) = ${aTimes(a, `${b}^{${mm}}`)}${plusK(k)}`, `${a === 1 ? num(p) : `${a} \\cdot ${num(p)}`}${plusK(k)}`, num(c))}$。`,
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
  intro: t(
    `We know that growth by a fixed percent is exponential: growing by $5\\%$ means multiplying by $1.05$, so after $t$ steps the amount is multiplied by $1.05^{t}$. A bank account that earns **compound interest** grows this way, because each year's interest is added to the balance and earns interest itself.

Put $\\$1000$ in an account at $5\\%$ a year, with the interest added once a year:

$$\\begin{array}{c|cccc} \\text{year} & 0 & 1 & 2 & 3 \\\\ \\hline \\text{balance} & 1000 & 1050 & 1102.50 & 1157.63 \\end{array}$$

Each year multiplies the balance by $1.05$, so after $t$ years it is $1000(1.05)^{t}$. Check: $1000(1.05)^{3} = 1157.625 \\approx 1157.63$, the last entry of the table. In the second year the interest is $\\$52.50$, not $\\$50$, because the first year's $\\$50$ earns interest too.

Banks often add interest several times a year, using a share of the rate each time. In this lesson we write the compound interest formula, find balances with it, and use logarithms to find how long a balance takes to reach a target.`,
    `我们知道按固定百分比增长是指数增长：增长 $5\\%$ 就是乘以 $1.05$，所以经过 $t$ 步，数量乘以 $1.05^{t}$。按**复利**计息的银行账户就是这样增长的，因为每年的利息加入余额，下一年也产生利息。

把 $1000$ 美元存入年利率 $5\\%$ 的账户，每年计息一次：

$$\\begin{array}{c|cccc} \\text{年} & 0 & 1 & 2 & 3 \\\\ \\hline \\text{余额} & 1000 & 1050 & 1102.50 & 1157.63 \\end{array}$$

每年余额乘以 $1.05$，所以 $t$ 年后余额是 $1000(1.05)^{t}$。检验：$1000(1.05)^{3} = 1157.625 \\approx 1157.63$，正是表格的最后一项。第二年的利息是 $52.50$ 美元而不是 $50$ 美元，因为第一年的 $50$ 美元也产生了利息。

银行常常一年计息好几次，每次用利率的一部分。这节课我们写出复利公式，用它求余额，并用对数求余额达到目标需要多长时间。`,
  ),
  knowledgePoints: [
    {
      id: "the-compound-interest-formula",
      title: t("The compound interest formula", "复利公式"),
      explanation: t(
        `When a principal $P$ earns an annual interest rate $r$ (as a decimal), **compounded** $n$ times a year, the year is cut into $n$ periods. Each period adds $\\frac{r}{n}$ of the balance, so it multiplies the balance by $1 + \\frac{r}{n}$, and there are $nt$ periods in $t$ years:

$$A = P\\left(1 + \\frac{r}{n}\\right)^{nt}$$

For $\\$2000$ at $6\\%$ compounded monthly for $5$ years, $r = 0.06$, $n = 12$ and $t = 5$: each month multiplies by $1 + \\frac{0.06}{12} = 1.005$, and there are $12 \\cdot 5 = 60$ months, so $A = 2000\\left(1 + \\frac{0.06}{12}\\right)^{12 \\cdot 5}$.

> **Watch out.** The rate goes in as a decimal: $6\\%$ is $0.06$, not $6$. The rate is **divided** by $n$ and the years are **multiplied** by $n$: using the whole rate $r$ each period, multiplying it by $n$, or keeping $t$ as the exponent all count the periods wrong.`,
        `本金 $P$ 按年利率 $r$（写成小数）**复利**计息，每年计息 $n$ 次时，一年被分成 $n$ 期。每期增加余额的 $\\frac{r}{n}$，也就是把余额乘以 $1 + \\frac{r}{n}$，$t$ 年共有 $nt$ 期：

$$A = P\\left(1 + \\frac{r}{n}\\right)^{nt}$$

$2000$ 美元按年利率 $6\\%$、每月计息一次存 $5$ 年，$r = 0.06$，$n = 12$，$t = 5$：每月乘以 $1 + \\frac{0.06}{12} = 1.005$，共 $12 \\cdot 5 = 60$ 个月，所以 $A = 2000\\left(1 + \\frac{0.06}{12}\\right)^{12 \\cdot 5}$。

> **注意。** 利率要写成小数：$6\\%$ 是 $0.06$，不是 $6$。利率要**除以** $n$，年数要**乘以** $n$：每期用整个利率 $r$、把利率乘以 $n$，或者指数仍用 $t$，期数都算错了。`,
      ),
      generate(rng) {
        const P = rng.pick([500, 1000, 1500, 2000, 2500, 4000, 5000, 8000]);
        const R = rng.pick([2, 3, 4, 5, 6, 8]);
        const { n, name } = rng.pick(compoundings.filter((c) => c.n > 1));
        const tt = rng.int(2, 10);
        const r = rateL(R);
        const form = (inner: string, e: string) => m(`A = ${P}\\left(${inner}\\right)^{${e}}`);
        const wrongs = [
          form(`1 + ${r}`, `${n} \\cdot ${tt}`),
          form(`1 + \\frac{${r}}{${n}}`, `${tt}`),
          form(`1 + \\frac{${R}}{${n}}`, `${n} \\cdot ${tt}`),
          form(`1 + ${n} \\cdot ${r}`, `${tt}`),
        ] as const;
        const formula = `A = ${P}\\left(1 + \\frac{${r}}{${n}}\\right)^{${n} \\cdot ${tt}}`;
        return reasoned(
          oneOf(rng, {
            prompt: t(
              `$${P}$ dollars is invested at an annual interest rate of $${R}\\%$, compounded ${name.en}. Which expression gives the balance $A$ after $${tt}$ years?`,
              `把 $${P}$ 美元按年利率 $${R}\\%$ 存入，${name["zh-CN"]}。哪个式子表示 $${tt}$ 年后的余额 $A$？`,
            ),
            right: form(`1 + \\frac{${r}}{${n}}`, `${n} \\cdot ${tt}`),
            wrong: [...wrongs],
            solution: t(
              `${label(1, "Read the values", "读出各量").en} The principal is $P = ${P}$. The rate $${R}\\%$ as a decimal is $r = ${r}$. Compounded ${name.en} means $n = ${n}$ periods a year, and $t = ${tt}$ years.

${label(2, "Build the formula", "代入公式").en} Each period adds $\\frac{${r}}{${n}}$ of the balance, so it multiplies by $1 + \\frac{${r}}{${n}}$, and $${tt}$ years hold $${n} \\cdot ${tt} = ${n * tt}$ periods:${steps(formula)}**Check.** At $t = 0$ the exponent is $0$ and $A = ${P}$, the deposit; each extra year adds $${n}$ to the exponent, one factor for each of the $${n}$ periods in a year.`,
              `${label(1, "Read the values", "读出各量")["zh-CN"]} 本金 $P = ${P}$。利率 $${R}\\%$ 写成小数是 $r = ${r}$。${name["zh-CN"]}表示每年 $n = ${n}$ 期，$t = ${tt}$ 年。

${label(2, "Build the formula", "代入公式")["zh-CN"]} 每期增加余额的 $\\frac{${r}}{${n}}$，即乘以 $1 + \\frac{${r}}{${n}}$，$${tt}$ 年共 $${n} \\cdot ${tt} = ${n * tt}$ 期：${steps(formula)}**检验。** $t = 0$ 时指数是 $0$，$A = ${P}$，正是存款；每多一年，指数增加 $${n}$，一年中的 $${n}$ 期各乘一次。`,
            ),
          }),
          [
            [
              wrongs[0].en,
              `This uses the whole annual rate $${r}$ in every period; each of the $${n}$ periods earns only $\\frac{${r}}{${n}}$.`,
              `这里每期都用了整个年利率 $${r}$；$${n}$ 期中每期只得到 $\\frac{${r}}{${n}}$。`,
            ],
            [
              wrongs[1].en,
              `The exponent $${tt}$ counts years, but interest is added $${n}$ times a year, so there are $${n} \\cdot ${tt}$ periods.`,
              `指数 $${tt}$ 数的是年数，但每年计息 $${n}$ 次，共有 $${n} \\cdot ${tt}$ 期。`,
            ],
            [
              wrongs[2].en,
              `The rate is used as $${R}$ instead of the decimal $${r}$: $${R}\\%$ means $\\frac{${R}}{100}$.`,
              `利率用成了 $${R}$，应该是小数 $${r}$：$${R}\\%$ 表示 $\\frac{${R}}{100}$。`,
            ],
            [
              wrongs[3].en,
              `The rate is multiplied by $${n}$ instead of divided by it, and the exponent counts years instead of periods.`,
              `利率乘以了 $${n}$ 而不是除以 $${n}$，指数数的也是年数而不是期数。`,
            ],
          ],
        );
      },
    },
    {
      id: "balance-after-compounding",
      title: t("The balance", "余额"),
      explanation: t(
        `To find a balance, substitute $P$, $r$, $n$ and $t$ into the formula and evaluate with a calculator, rounding only at the end. For $\\$2000$ at $6\\%$ compounded monthly for $5$ years:

$$A = 2000\\left(1 + \\frac{0.06}{12}\\right)^{12 \\cdot 5} = 2000(1.005)^{60} \\approx 2697.70$$

More frequent compounding gives a slightly larger balance, because interest starts earning interest sooner: compounded annually, the same deposit grows to $2000(1.06)^{5} \\approx 2676.45$. Both beat simple interest, which pays $6\\%$ of the deposit only: $2000(1 + 0.06 \\cdot 5) = 2600$.

> **Watch out.** Don't use simple interest $P(1 + rt)$, which leaves out the interest on interest, and don't ignore how often interest is compounded: $(1 + r)^{t}$ is annual compounding, and $\\left(1 + \\frac{r}{n}\\right)^{t}$ has too few periods. Don't round $1 + \\frac{r}{n}$ before raising it to the power.`,
        `求余额时，把 $P$、$r$、$n$、$t$ 代入公式，用计算器计算，只在最后取近似值。$2000$ 美元按年利率 $6\\%$、每月计息一次存 $5$ 年：

$$A = 2000\\left(1 + \\frac{0.06}{12}\\right)^{12 \\cdot 5} = 2000(1.005)^{60} \\approx 2697.70$$

计息越频繁，余额略大，因为利息更早开始生息：每年计息一次时，同样的存款增长到 $2000(1.06)^{5} \\approx 2676.45$。两者都比单利多，单利只按存款的 $6\\%$ 付息：$2000(1 + 0.06 \\cdot 5) = 2600$。

> **注意。** 不要用单利 $P(1 + rt)$，它漏掉了利息产生的利息；也不要忽略计息次数：$(1 + r)^{t}$ 是每年计息一次，$\\left(1 + \\frac{r}{n}\\right)^{t}$ 的期数太少。乘方之前不要先把 $1 + \\frac{r}{n}$ 取近似。`,
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
          const r = rateL(R);
          const N = n * tt;
          const inner = n === 1 ? `1 + ${r}` : `1 + \\frac{${r}}{${n}}`;
          const exact6 = Number.isInteger(((100 * n + R) * 1e6) / (100 * n));
          const simple = Q.of(P).mul(Q.of(100 + R * tt, 100));
          const parts = [`A = ${P}\\left(${inner}\\right)^{${n === 1 ? tt : `${n} \\cdot ${tt}`}}`];
          if (exact6) parts.push(`${P}(${dec(factor)})^{${N}}`);
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
            solution: t(
              `${label(1, "Read the values", "读出各量").en} $P = ${P}$, $r = ${r}$, $n = ${n}$ (compounded ${name.en}) and $t = ${tt}$, so there are ${n === 1 ? `$${tt}$ periods` : `$${n} \\cdot ${tt} = ${N}$ periods`}.

${label(2, "Evaluate", "计算").en} Substitute into $A = P\\left(1 + \\frac{r}{n}\\right)^{nt}$ and enter it in one go, rounding only at the end:${steps(`${chain(...parts)} \\approx ${money(answer)}`)}To the nearest cent, $A \\approx ${money(answer)}$ dollars.

**Check.** Compound interest earns at least simple interest: $${P}(1 + ${r} \\cdot ${tt}) = ${money(simple)}$, and $${money(answer)}$ is a little more, from the interest earned on interest.`,
              `${label(1, "Read the values", "读出各量")["zh-CN"]} $P = ${P}$，$r = ${r}$，$n = ${n}$（${name["zh-CN"]}），$t = ${tt}$，所以共有 ${n === 1 ? `$${tt}$ 期` : `$${n} \\cdot ${tt} = ${N}$ 期`}。

${label(2, "Evaluate", "计算")["zh-CN"]} 代入 $A = P\\left(1 + \\frac{r}{n}\\right)^{nt}$，一次输入计算器，只在最后取近似值：${steps(`${chain(...parts)} \\approx ${money(answer)}`)}精确到分，$A \\approx ${money(answer)}$ 美元。

**检验。** 复利至少不比单利少：$${P}(1 + ${r} \\cdot ${tt}) = ${money(simple)}$，而 $${money(answer)}$ 略多一些，多出的是利息产生的利息。`,
            ),
          });
        }
      },
    },
    {
      id: "time-to-reach-a-balance",
      title: t("The time to reach a balance", "达到目标余额的时间"),
      explanation: t(
        `To find when a balance reaches a target, the unknown $t$ is in the exponent, so we need logarithms. Divide both sides by $P$ to get the power alone, take natural logarithms, and bring the exponent down with $\\ln a^{x} = x \\ln a$. When does $\\$1000$ at $4\\%$ compounded quarterly double? Each quarter multiplies by $1 + \\frac{0.04}{4} = 1.01$:

$$1000(1.01)^{4t} = 2000 \\implies (1.01)^{4t} = 2 \\implies 4t\\ln 1.01 = \\ln 2$$

$$t = \\frac{\\ln 2}{4\\ln 1.01} \\approx 17.4 \\text{ years}$$

Check: $1000(1.01)^{4 \\cdot 17.4} \\approx 2000$. The doubling time doesn't depend on the deposit: only the factor $2$ matters.

> **Watch out.** Divide by $P$ **before** taking logarithms. The exponent is $nt$, so divide by $n \\ln\\left(1 + \\frac{r}{n}\\right)$, not just by the logarithm. Shortcuts such as dividing the growth by the rate treat the interest as simple and give the wrong time.`,
        `求余额何时达到目标时，未知数 $t$ 在指数上，所以要用对数。两边除以 $P$，把幂单独留下，再取自然对数，用 $\\ln a^{x} = x \\ln a$ 把指数拿下来。$1000$ 美元按年利率 $4\\%$、每季度计息一次，何时翻倍？每季度乘以 $1 + \\frac{0.04}{4} = 1.01$：

$$1000(1.01)^{4t} = 2000 \\implies (1.01)^{4t} = 2 \\implies 4t\\ln 1.01 = \\ln 2$$

$$t = \\frac{\\ln 2}{4\\ln 1.01} \\approx 17.4 \\text{ 年}$$

检验：$1000(1.01)^{4 \\cdot 17.4} \\approx 2000$。翻倍时间与存款多少无关，只与倍数 $2$ 有关。

> **注意。** 取对数**之前**先除以 $P$。指数是 $nt$，所以要除以 $n \\ln\\left(1 + \\frac{r}{n}\\right)$，不能只除以对数。用增长量除以利率之类的捷径，把利息当成了单利，得到的时间是错的。`,
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
          const base = `\\left(1 + ${n === 1 ? rateL(R) : `\\frac{${rateL(R)}}{${n}}`}\\right)`;
          const nt = n === 1 ? "t" : `${n}t`;
          const back = P * step ** (n * answer.toNumber());
          const backQ = Q.of(Math.round(back * 100), 100);
          const ex = n === 1 ? dec(answer) : `${n} \\cdot ${dec(answer)}`;
          return numberProblem({
            prompt: t(
              `$${P}$ dollars is invested at an annual interest rate of $${R}\\%$, compounded ${name.en}. How many years does it take for the balance to ${goal.en}? Give the answer to the nearest tenth of a year.`,
              `把 $${P}$ 美元按年利率 $${R}\\%$ 存入，${name["zh-CN"]}。余额${goal["zh-CN"]}需要多少年？精确到 $0.1$ 年。`,
            ),
            answer,
            form: "decimal",
            solveFor: "t",
            wrong: defined(rounded(Math.log(g) / Math.log(step), 1), rounded((g - 1) / (R / 100), 1), rounded(Math.log(g) / (R / 100), 1)),
            solution: t(
              `${label(1, "Set up the equation", "列方程").en} The target balance is $${money(target)}$, so $A = P${base}^{${nt}}$ gives an equation in $t$. Divide both sides by $${P}$ to get the power alone:${steps(`${P}${base}^{${nt}} = ${money(target)}`, `${base}^{${nt}} = ${num(growth)}`)}${label(2, "Take logarithms", "取对数").en} Take the natural logarithm of both sides and bring the exponent down:${steps(`${nt} \\ln${base} = \\ln ${num(growth)}`)}${label(3, "Solve for $t$", "解出 $t$").en} Divide by ${n === 1 ? "the logarithm" : `$${n}$ times the logarithm`} and use a calculator:${steps(`t = \\frac{\\ln ${num(growth)}}{${n === 1 ? "" : n}\\ln${base}} \\approx ${dec(answer)}`)}It takes about $${dec(answer)}$ years.

**Check.** $${P}${base}^{${ex}} \\approx ${money(backQ)}$, close to $${money(target)}$; the small gap comes from rounding $t$.`,
              `${label(1, "Set up the equation", "列方程")["zh-CN"]} 目标余额是 $${money(target)}$，所以 $A = P${base}^{${nt}}$ 给出关于 $t$ 的方程。两边除以 $${P}$，把幂单独留下：${steps(`${P}${base}^{${nt}} = ${money(target)}`, `${base}^{${nt}} = ${num(growth)}`)}${label(2, "Take logarithms", "取对数")["zh-CN"]} 两边取自然对数，把指数拿下来：${steps(`${nt} \\ln${base} = \\ln ${num(growth)}`)}${label(3, "Solve for $t$", "解出 $t$")["zh-CN"]} 两边除以${n === 1 ? "这个对数" : `这个对数的 $${n}$ 倍`}，再用计算器：${steps(`t = \\frac{\\ln ${num(growth)}}{${n === 1 ? "" : n}\\ln${base}} \\approx ${dec(answer)}`)}大约需要 $${dec(answer)}$ 年。

**检验。** $${P}${base}^{${ex}} \\approx ${money(backQ)}$，接近 $${money(target)}$；小的差距来自 $t$ 的近似。`,
            ),
          });
        }
      },
    },
  ],
  diagnostic: "balance-after-compounding",
};

/** cents rounds a dollar amount to the cent, for a check. */
const cents = (v: number) => Q.of(Math.round(v * 100), 100);

export const continuouslyCompoundedInterest: TopicDef = {
  id: "continuously-compounded-interest",
  title: t("Continuously Compounded Interest", "连续复利"),
  summary: t(
    "Use $A = Pe^{rt}$ to find balances, times and rates when interest is compounded continuously.",
    "用 $A = Pe^{rt}$ 求连续复利下的余额、时间和利率。",
  ),
  prerequisites: ["modeling-with-compound-interest", "solving-equations-containing-the-exponential-function"],
  encompasses: [{ topic: "solving-equations-containing-the-exponential-function", weight: 0.5 }],
  xp: 15,
  standards: ["CCSS.HSF.LE.A.2", "CCSS.HSF.LE.A.4"],
  intro: t(
    `We know the compound interest formula $A = P\\left(1 + \\frac{r}{n}\\right)^{nt}$, and that compounding more often gives a slightly larger balance. What happens if we compound more and more often? Put $\\$1000$ in for one year at $6\\%$:

$$\\begin{array}{l|c} \\text{compounded} & \\text{balance} \\\\ \\hline \\text{annually, } n = 1 & 1000(1.06)^{1} = 1060.00 \\\\ \\text{monthly, } n = 12 & 1000(1.005)^{12} \\approx 1061.68 \\\\ \\text{daily, } n = 365 & 1000\\left(1 + \\frac{0.06}{365}\\right)^{365} \\approx 1061.83 \\end{array}$$

The balance grows, but by less and less: it levels off at $1000e^{0.06} \\approx 1061.84$, where $e \\approx 2.71828$. This limit is interest **compounded continuously**. Check: $e^{0.06} \\approx 1.06184$, just above the daily factor $1.06183$.

In this lesson we use $A = Pe^{rt}$ to find balances, and solve it with natural logarithms to find times and rates.`,
    `我们知道复利公式 $A = P\\left(1 + \\frac{r}{n}\\right)^{nt}$，也知道计息越频繁，余额略大。如果计息越来越频繁，会怎样？把 $1000$ 美元按年利率 $6\\%$ 存一年：

$$\\begin{array}{l|c} \\text{计息方式} & \\text{余额} \\\\ \\hline \\text{每年一次，} n = 1 & 1000(1.06)^{1} = 1060.00 \\\\ \\text{每月一次，} n = 12 & 1000(1.005)^{12} \\approx 1061.68 \\\\ \\text{每天一次，} n = 365 & 1000\\left(1 + \\frac{0.06}{365}\\right)^{365} \\approx 1061.83 \\end{array}$$

余额在增加，但增加得越来越少：它稳定在 $1000e^{0.06} \\approx 1061.84$，其中 $e \\approx 2.71828$。这个极限就是**连续复利**。检验：$e^{0.06} \\approx 1.06184$，比每天计息的倍数 $1.06183$ 略大。

这节课我们用 $A = Pe^{rt}$ 求余额，并用自然对数解这个式子，求时间和利率。`,
  ),
  knowledgePoints: [
    {
      id: "continuous-balance",
      title: t("The balance", "余额"),
      explanation: t(
        `As the number of compoundings per year grows without bound, $\\left(1 + \\frac{r}{n}\\right)^{nt}$ approaches $e^{rt}$. Interest **compounded continuously** gives

$$A = Pe^{rt}$$

with the rate $r$ as a decimal and $t$ in years. For $\\$3000$ at $5\\%$ for $8$ years, multiply the rate by the time first: $rt = 0.05 \\cdot 8 = 0.4$, so $A = 3000e^{0.4} \\approx 4475.47$. Compounded once a year it would be only $3000(1.05)^{8} \\approx 4432.37$.

> **Watch out.** The exponent is the product $rt$: $Pe^{r} \\cdot t$ multiplies the one-year balance by the years, which is not how growth works. Also don't replace $e^{rt}$ by $(1 + r)^{t}$ (annual compounding) or by $1 + rt$ (simple interest); both give too little.`,
        `每年计息次数无限增大时，$\\left(1 + \\frac{r}{n}\\right)^{nt}$ 趋近 $e^{rt}$。**连续复利**的余额为

$$A = Pe^{rt}$$

其中利率 $r$ 写成小数，$t$ 以年为单位。$3000$ 美元按年利率 $5\\%$ 存 $8$ 年，先把利率乘以时间：$rt = 0.05 \\cdot 8 = 0.4$，所以 $A = 3000e^{0.4} \\approx 4475.47$。如果每年计息一次，只有 $3000(1.05)^{8} \\approx 4432.37$。

> **注意。** 指数是乘积 $rt$：$Pe^{r} \\cdot t$ 是把一年后的余额乘以年数，增长不是这样算的。也不要把 $e^{rt}$ 换成 $(1 + r)^{t}$（每年计息一次）或 $1 + rt$（单利），两者都偏小。`,
      ),
      generate(rng) {
        for (;;) {
          const P = rng.pick([500, 800, 1000, 1500, 2000, 2500, 3000, 6000]);
          const R = rng.pick([2, 3, 4, 5, 6, 7, 8]);
          const tt = rng.int(2, 20);
          const answer = rounded(P * Math.exp((R * tt) / 100), 2);
          if (!answer) continue;
          const yearly = cents(
            Q.of(100 + R, 100)
              .pow(tt)
              .mul(Q.of(P))
              .toNumber(),
          );
          const rt = dec(Q.of(R * tt, 100));
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
            solution: t(
              `${label(1, "The exponent", "指数").en} $P = ${P}$, the rate $${R}\\%$ is $r = ${rateL(R)}$, and $t = ${tt}$. The exponent is the product:${steps(`rt = ${rateL(R)} \\cdot ${tt} = ${rt}`)}${label(2, "Evaluate", "计算").en} Substitute into $A = Pe^{rt}$ and use the $e^{x}$ key of a calculator:${steps(`A = ${P}e^{${rt}} \\approx ${money(answer)}`)}The balance is about $${money(answer)}$ dollars.

**Check.** Continuous compounding earns a little more than compounding once a year: $${P}(${dec(Q.of(100 + R, 100))})^{${tt}} \\approx ${money(yearly)}$, just below $${money(answer)}$.`,
              `${label(1, "The exponent", "指数")["zh-CN"]} $P = ${P}$，利率 $${R}\\%$ 即 $r = ${rateL(R)}$，$t = ${tt}$。指数是乘积：${steps(`rt = ${rateL(R)} \\cdot ${tt} = ${rt}`)}${label(2, "Evaluate", "计算")["zh-CN"]} 代入 $A = Pe^{rt}$，用计算器的 $e^{x}$ 键：${steps(`A = ${P}e^{${rt}} \\approx ${money(answer)}`)}余额约为 $${money(answer)}$ 美元。

**检验。** 连续复利比每年计息一次略多：$${P}(${dec(Q.of(100 + R, 100))})^{${tt}} \\approx ${money(yearly)}$，略小于 $${money(answer)}$。`,
            ),
          });
        }
      },
    },
    {
      id: "time-with-continuous-compounding",
      title: t("The time to reach a balance", "达到目标余额的时间"),
      explanation: t(
        `To find the time, the unknown $t$ is in the exponent, so we use the natural logarithm, which undoes $e$: $\\ln e^{x} = x$. Divide by $P$ first, then take $\\ln$ of both sides:

$$2000e^{0.06t} = 5000 \\implies e^{0.06t} = 2.5 \\implies 0.06t = \\ln 2.5 \\implies t = \\frac{\\ln 2.5}{0.06} \\approx 15.3$$

Check: $2000e^{0.06 \\cdot 15.3} \\approx 5009$, close to $5000$. A balance doubles after $\\frac{\\ln 2}{r}$ years, whatever the principal.

> **Watch out.** Divide by $P$ **before** taking the logarithm: $\\ln 5000$ on its own gives a time far too long. Use $\\ln$ with base $e$, not $\\ln(1 + r)$, which belongs to annual compounding, and don't treat the growth as simple interest.`,
        `求时间时，未知数 $t$ 在指数上，所以用自然对数，它把 $e$ 的作用还原：$\\ln e^{x} = x$。先除以 $P$，再两边取 $\\ln$：

$$2000e^{0.06t} = 5000 \\implies e^{0.06t} = 2.5 \\implies 0.06t = \\ln 2.5 \\implies t = \\frac{\\ln 2.5}{0.06} \\approx 15.3$$

检验：$2000e^{0.06 \\cdot 15.3} \\approx 5009$，接近 $5000$。无论本金多少，余额都在 $\\frac{\\ln 2}{r}$ 年后翻倍。

> **注意。** 取对数**之前**先除以 $P$：直接用 $\\ln 5000$ 得到的时间太长。用以 $e$ 为底的 $\\ln$ 除以 $r$，不要用 $\\ln(1 + r)$，那是每年计息一次的情形；也不要把增长当成单利。`,
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
          const back = cents(P * Math.exp(r * answer.toNumber()));
          return numberProblem({
            prompt: t(
              `$${P}$ dollars is invested at an annual interest rate of $${R}\\%$, compounded continuously. How many years does it take for the balance to reach $${money(target)}$ dollars? Give the answer to the nearest tenth of a year.`,
              `把 $${P}$ 美元按年利率 $${R}\\%$ 连续复利存入。余额达到 $${money(target)}$ 美元需要多少年？精确到 $0.1$ 年。`,
            ),
            answer,
            form: "decimal",
            solveFor: "t",
            wrong: defined(rounded((g - 1) / r, 1), rounded(Math.log(g) / Math.log(1 + r), 1), rounded(Math.log(g * P) / r, 1)),
            solution: t(
              `${label(1, "Set up the equation", "列方程").en} With $r = ${rateL(R)}$, the balance $${P}e^{${rateL(R)}t}$ must equal $${money(target)}$. Divide both sides by $${P}$ to get the power alone:${steps(`${P}e^{${rateL(R)}t} = ${money(target)}`, `e^{${rateL(R)}t} = ${num(growth)}`)}${label(2, "Take the natural logarithm", "取自然对数").en} Since $\\ln e^{x} = x$, the exponent comes down:${steps(`${rateL(R)}t = \\ln ${num(growth)}`)}${label(3, "Solve for $t$", "解出 $t$").en} Divide both sides by $${rateL(R)}$:${steps(`t = \\frac{\\ln ${num(growth)}}{${rateL(R)}} \\approx ${dec(answer)}`)}It takes about $${dec(answer)}$ years.

**Check.** $${P}e^{${rateL(R)} \\cdot ${dec(answer)}} \\approx ${money(back)}$, close to $${money(target)}$; the small gap comes from rounding $t$.`,
              `${label(1, "Set up the equation", "列方程")["zh-CN"]} $r = ${rateL(R)}$，余额 $${P}e^{${rateL(R)}t}$ 要等于 $${money(target)}$。两边除以 $${P}$，把幂单独留下：${steps(`${P}e^{${rateL(R)}t} = ${money(target)}`, `e^{${rateL(R)}t} = ${num(growth)}`)}${label(2, "Take the natural logarithm", "取自然对数")["zh-CN"]} 因为 $\\ln e^{x} = x$，指数就拿下来了：${steps(`${rateL(R)}t = \\ln ${num(growth)}`)}${label(3, "Solve for $t$", "解出 $t$")["zh-CN"]} 两边除以 $${rateL(R)}$：${steps(`t = \\frac{\\ln ${num(growth)}}{${rateL(R)}} \\approx ${dec(answer)}`)}大约需要 $${dec(answer)}$ 年。

**检验。** $${P}e^{${rateL(R)} \\cdot ${dec(answer)}} \\approx ${money(back)}$，接近 $${money(target)}$；小的差距来自 $t$ 的近似。`,
            ),
          });
        }
      },
    },
    {
      id: "rate-for-continuous-growth",
      title: t("The interest rate", "利率"),
      explanation: t(
        `With continuous compounding the balance is $A = Pe^{rt}$. When the rate is the unknown, it is again in the exponent: divide by $P$, take the natural logarithm to bring the exponent down, and divide by the time. For $\\$1000$ that grows to $\\$1500$ in $10$ years:

$$1000e^{10r} = 1500 \\implies e^{10r} = 1.5 \\implies 10r = \\ln 1.5 \\implies r = \\frac{\\ln 1.5}{10} \\approx 0.04055$$

As a percent, $r \\approx 4.05\\%$. Check: $1000e^{0.04055 \\cdot 10} \\approx 1500.05$.

> **Watch out.** $r$ comes out as a decimal: multiply by $100$ for the percent, so $0.04055$ is $4.05\\%$, not $0.04\\%$. Don't divide the growth $\\frac{1500 - 1000}{1000}$ by the years, which is simple interest, and don't take the $10$th root, which is the rate for annual compounding.`,
        `连续复利的余额是 $A = Pe^{rt}$。利率未知时，它同样在指数上：先除以 $P$，再取自然对数把指数拿下来，最后除以时间。$1000$ 美元在 $10$ 年后增长到 $1500$ 美元：

$$1000e^{10r} = 1500 \\implies e^{10r} = 1.5 \\implies 10r = \\ln 1.5 \\implies r = \\frac{\\ln 1.5}{10} \\approx 0.04055$$

写成百分数，$r \\approx 4.05\\%$。检验：$1000e^{0.04055 \\cdot 10} \\approx 1500.05$。

> **注意。** 解出的 $r$ 是小数：乘以 $100$ 才是百分数，$0.04055$ 是 $4.05\\%$，不是 $0.04\\%$。不要把增长率 $\\frac{1500 - 1000}{1000}$ 除以年数，那是单利；也不要开 $10$ 次方，那是每年计息一次的利率。`,
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
          const rDec = Math.log(g) / tt;
          const r5 = dec(Q.of(Math.round(rDec * 1e5), 1e5));
          const back = cents(P * Math.exp((answer.toNumber() / 100) * tt));
          return numberProblem({
            prompt: t(
              `An investment of $${P}$ dollars, compounded continuously, grows to $${money(target)}$ dollars in $${tt}$ years. What is the annual interest rate, as a percent to the nearest hundredth?`,
              `一笔 $${P}$ 美元的连续复利投资在 $${tt}$ 年后增长到 $${money(target)}$ 美元。年利率是百分之几？精确到百分位。`,
            ),
            answer,
            form: "decimal",
            percent: true,
            wrong: defined(rounded((100 * (g - 1)) / tt, 2), rounded(100 * (g ** (1 / tt) - 1), 2), rounded(Math.log(g) / tt, 2)),
            solution: t(
              `${label(1, "Set up the equation", "列方程").en} The balance $${P}e^{${tt}r}$ equals $${money(target)}$. Divide both sides by $${P}$:${steps(`${P}e^{${tt}r} = ${money(target)}`, `e^{${tt}r} = ${num(growth)}`)}${label(2, "Take the natural logarithm", "取自然对数").en} The exponent comes down; then divide by $${tt}$:${steps(`${tt}r = \\ln ${num(growth)}`, `r = \\frac{\\ln ${num(growth)}}{${tt}} \\approx ${r5}`)}${label(3, "Write it as a percent", "写成百分数").en} Multiply by $100$: the rate is about $${dec(answer)}\\%$.

**Check.** $${P}e^{${dec(answer.div(Q.of(100)))} \\cdot ${tt}} \\approx ${money(back)}$, close to $${money(target)}$; the small gap comes from rounding the rate.`,
              `${label(1, "Set up the equation", "列方程")["zh-CN"]} 余额 $${P}e^{${tt}r}$ 等于 $${money(target)}$。两边除以 $${P}$：${steps(`${P}e^{${tt}r} = ${money(target)}`, `e^{${tt}r} = ${num(growth)}`)}${label(2, "Take the natural logarithm", "取自然对数")["zh-CN"]} 指数拿下来，再除以 $${tt}$：${steps(`${tt}r = \\ln ${num(growth)}`, `r = \\frac{\\ln ${num(growth)}}{${tt}} \\approx ${r5}`)}${label(3, "Write it as a percent", "写成百分数")["zh-CN"]} 乘以 $100$：利率约为 $${dec(answer)}\\%$。

**检验。** $${P}e^{${dec(answer.div(Q.of(100)))} \\cdot ${tt}} \\approx ${money(back)}$，接近 $${money(target)}$；小的差距来自利率的近似。`,
            ),
          });
        }
      },
    },
  ],
  diagnostic: "continuous-balance",
};

/** dec5 writes a positive number rounded to five decimal places. */
const dec5 = (v: number) => dec(Q.of(Math.round(v * 1e5), 1e5));

/** dec4 writes a number rounded to four decimal places. */
const dec4 = (v: number) => dec(Q.of(Math.round(v * 1e4), 1e4));

export const convertingBetweenExponents: TopicDef = {
  id: "converting-between-exponents",
  title: t("Converting Between Exponents", "指数形式之间的转换"),
  summary: t(
    "Rewrite exponential models between base $e$ and other bases, and between time units, to compare their rates.",
    "在以 $e$ 为底和以其他数为底之间、在不同时间单位之间改写指数模型，以比较增长率。",
  ),
  prerequisites: ["continuously-compounded-interest"],
  encompasses: [],
  xp: 15,
  standards: ["CCSS.HSA.SSE.B.3.C", "CCSS.HSF.IF.C.8.B"],
  intro: t(
    `We know two ways to write exponential growth: with a growth factor, $A = P(1 + r)^{t}$, and with base $e$, $A = Pe^{kt}$ for continuous growth. We also know the power rule $\\left(a^{m}\\right)^{n} = a^{mn}$ and that $e^{x}$ and $\\ln x$ undo each other. Together they let us move a model from one form to the other.

Which account grows faster: $A(t) = 1000e^{0.05t}$ or $B(t) = 1000(1.051)^{t}$? Written as $1000\\left(e^{0.05}\\right)^{t}$, the first multiplies the balance each year by

$$e^{0.05} \\approx 1.05127$$

which is more than $1.051$, so $A$ grows a little faster: about $5.13\\%$ a year against $5.1\\%$. Check after $10$ years: $1000e^{0.5} \\approx 1648.72$ and $1000(1.051)^{10} \\approx 1644.47$.

In this lesson we turn base $e$ into a growth factor, turn a growth factor into base $e$, and change the time unit of a model.`,
    `我们知道指数增长的两种写法：用增长倍数写成 $A = P(1 + r)^{t}$，以及连续增长时用 $e$ 为底写成 $A = Pe^{kt}$。我们也知道幂的乘方法则 $\\left(a^{m}\\right)^{n} = a^{mn}$，以及 $e^{x}$ 与 $\\ln x$ 互相还原。合起来，就能把模型从一种形式改写成另一种。

哪个账户增长得更快：$A(t) = 1000e^{0.05t}$ 还是 $B(t) = 1000(1.051)^{t}$？把前者写成 $1000\\left(e^{0.05}\\right)^{t}$，它每年把余额乘以

$$e^{0.05} \\approx 1.05127$$

比 $1.051$ 大，所以 $A$ 增长得略快：每年约 $5.13\\%$，而 $B$ 是 $5.1\\%$。用 $10$ 年后的值检验：$1000e^{0.5} \\approx 1648.72$，$1000(1.051)^{10} \\approx 1644.47$。

这节课我们把以 $e$ 为底的模型化为增长倍数，把增长倍数化为以 $e$ 为底，并改变模型的时间单位。`,
  ),
  knowledgePoints: [
    {
      id: "from-base-e-to-a-growth-factor",
      title: t("From base $e$ to a growth factor", "从以 $e$ 为底到增长倍数"),
      explanation: t(
        `Since $e^{kt} = \\left(e^{k}\\right)^{t}$, the model $P = P_{0}e^{kt}$ multiplies the quantity by $e^{k}$ each year: that is its yearly growth factor. Subtract $1$ to get the yearly rate. For $P = 500e^{0.03t}$:

$$e^{0.03} \\approx 1.03045$$

so the quantity grows by about $3.05\\%$ per year, a little more than $3\\%$, because continuous growth keeps adding growth on growth. With $k < 0$ the factor is below $1$ and the quantity decays: $e^{-0.03} \\approx 0.97045$ is a decrease of about $2.96\\%$.

> **Watch out.** The yearly percent is not $k$ itself: $e^{0.03}$ is a little more than $1.03$. And the factor is not the rate: $1.03045$ means $103.05\\%$ of last year's amount, which is a growth of $3.05\\%$; subtract $1$ first.`,
        `因为 $e^{kt} = \\left(e^{k}\\right)^{t}$，模型 $P = P_{0}e^{kt}$ 每年把这个量乘以 $e^{k}$：这就是每年的增长倍数。减去 $1$ 得到每年的增长率。对 $P = 500e^{0.03t}$：

$$e^{0.03} \\approx 1.03045$$

所以这个量每年约增长 $3.05\\%$，比 $3\\%$ 略多，因为连续增长不断在增长上再增长。$k < 0$ 时倍数小于 $1$，这个量在衰减：$e^{-0.03} \\approx 0.97045$，即约减少 $2.96\\%$。

> **注意。** 每年的百分数不是 $k$ 本身：$e^{0.03}$ 比 $1.03$ 略大。倍数也不是增长率：$1.03045$ 表示是上一年的 $103.05\\%$，即增长 $3.05\\%$；要先减去 $1$。`,
      ),
      generate(rng) {
        for (;;) {
          const K = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, -2, -3, -4, -5, -8, -10]);
          const P0 = rng.pick([200, 500, 800, 1200, 3000]);
          const factor = Math.exp(K / 100);
          const answer = rounded(Math.abs(factor - 1) * 100, 2);
          if (!answer) continue;
          const growth = K > 0;
          const k = dec(Q.of(K, 100));
          const f5 = dec5(factor);
          const diff = growth ? `${f5} - 1` : `1 - ${f5}`;
          const change = dec5(Math.abs(factor - 1));
          return numberProblem({
            prompt: t(
              `A quantity is modeled by $P(t) = ${P0}e^{${k}t}$, with $t$ in years. By what percent does it ${growth ? "increase" : "decrease"} each year? Give the percent to the nearest hundredth.`,
              `某个量的模型是 $P(t) = ${P0}e^{${k}t}$，$t$ 的单位是年。它每年${growth ? "增长" : "减少"}百分之几？精确到百分位。`,
            ),
            answer,
            form: "decimal",
            percent: true,
            wrong: defined(Q.of(Math.abs(K)), rounded(Math.abs(Math.log(1 + K / 100)) * 100, 2), rounded(factor * 100, 2)),
            solution: t(
              `${label(1, "The yearly factor", "每年的倍数").en} By the power rule, $e^{${k}t} = \\left(e^{${k}}\\right)^{t}$, so each year multiplies the quantity by $e^{${k}}$:${steps(`P(t) = ${P0}\\left(e^{${k}}\\right)^{t} \\approx ${P0}(${f5})^{t}`)}${label(2, "The rate", "变化率").en} The factor is ${growth ? "above" : "below"} $1$, so the quantity ${growth ? "grows" : "decays"}. The yearly change is:${steps(`${diff} = ${change}`)}As a percent, it ${growth ? "increases" : "decreases"} by about $${dec(answer)}\\%$ each year.

**Check.** Going back, $\\ln ${f5} \\approx ${k}$, the $k$ of the model.`,
              `${label(1, "The yearly factor", "每年的倍数")["zh-CN"]} 由幂的乘方法则，$e^{${k}t} = \\left(e^{${k}}\\right)^{t}$，所以每年这个量乘以 $e^{${k}}$：${steps(`P(t) = ${P0}\\left(e^{${k}}\\right)^{t} \\approx ${P0}(${f5})^{t}`)}${label(2, "The rate", "变化率")["zh-CN"]} 倍数${growth ? "大于" : "小于"} $1$，所以这个量在${growth ? "增长" : "衰减"}。每年的变化是：${steps(`${diff} = ${change}`)}写成百分数，每年约${growth ? "增长" : "减少"} $${dec(answer)}\\%$。

**检验。** 反过来，$\\ln ${f5} \\approx ${k}$，正是模型中的 $k$。`,
            ),
          });
        }
      },
    },
    {
      id: "from-a-growth-factor-to-base-e",
      title: t("From a growth factor to base $e$", "从增长倍数到以 $e$ 为底"),
      explanation: t(
        `Any positive base can be written as a power of $e$, because $e^{x}$ and $\\ln x$ undo each other: $b = e^{\\ln b}$. Then the power rule moves $\\ln b$ into the exponent:

$$P = 200(1.06)^{t} = 200\\left(e^{\\ln 1.06}\\right)^{t} = 200e^{kt}, \\quad k = \\ln 1.06 \\approx 0.0583$$

The continuous rate $k$ is a little less than the yearly rate $0.06$, because growing continuously at $5.83\\%$ adds up to $6\\%$ over a year. Check: $e^{0.0583} \\approx 1.0600$. A decay factor below $1$ gives a negative $k$: $\\ln 0.9 \\approx -0.1054$.

> **Watch out.** $k$ is $\\ln b$, with the natural logarithm: $\\log 1.06$ is base $10$ and gives a much smaller number. And $k$ is not the yearly rate $0.06$ itself, nor $e^{0.06} - 1$, which runs the conversion the wrong way.`,
        `任何正数底都可以写成 $e$ 的幂，因为 $e^{x}$ 与 $\\ln x$ 互相还原：$b = e^{\\ln b}$。再用幂的乘方法则把 $\\ln b$ 移进指数：

$$P = 200(1.06)^{t} = 200\\left(e^{\\ln 1.06}\\right)^{t} = 200e^{kt}, \\quad k = \\ln 1.06 \\approx 0.0583$$

连续增长率 $k$ 比每年的增长率 $0.06$ 略小，因为以 $5.83\\%$ 连续增长，一年累计起来就是 $6\\%$。检验：$e^{0.0583} \\approx 1.0600$。小于 $1$ 的衰减倍数给出负的 $k$：$\\ln 0.9 \\approx -0.1054$。

> **注意。** $k$ 是 $\\ln b$，用自然对数：$\\log 1.06$ 以 $10$ 为底，得到的数小得多。$k$ 也不是每年的增长率 $0.06$ 本身，更不是 $e^{0.06} - 1$，那是把转换方向弄反了。`,
      ),
      generate(rng) {
        for (;;) {
          const R = rng.pick([2, 3, 4, 5, 6, 8, 10, 12, 15, 20, -5, -10, -15, -20, -25]);
          const P0 = rng.pick([100, 200, 400, 750, 1500]);
          const b = Q.of(100 + R, 100);
          const answer = rounded(Math.log(1 + R / 100), 4);
          if (!answer) continue;
          const B = dec(b);
          return numberProblem({
            prompt: t(
              `Write $P(t) = ${P0}(${B})^{t}$ in the form $P(t) = ${P0}e^{kt}$. Find $k$ to four decimal places.`,
              `把 $P(t) = ${P0}(${B})^{t}$ 写成 $P(t) = ${P0}e^{kt}$ 的形式。求 $k$（精确到小数点后第四位）。`,
            ),
            answer,
            form: "decimal",
            solveFor: "k",
            wrong: defined(Q.of(R, 100), rounded(Math.log10(1 + R / 100), 4), rounded(Math.exp(R / 100) - 1, 4)),
            solution: t(
              `${label(1, "Write the base as a power of $e$", "把底数写成 $e$ 的幂").en} Since $e^{x}$ and $\\ln x$ undo each other, $${B} = e^{\\ln ${B}}$. The power rule then moves $\\ln ${B}$ into the exponent:${steps(`P(t) = ${P0}\\left(e^{\\ln ${B}}\\right)^{t} = ${P0}e^{(\\ln ${B})t}`)}${label(2, "Read off $k$", "读出 $k$").en} Comparing with $${P0}e^{kt}$${R < 0 ? ", and since the base is below $1$, $k$ is negative" : ""}:${steps(`k = \\ln ${B} \\approx ${dec(answer)}`)}**Check.** $e^{${dec(answer)}} \\approx ${dec4(Math.exp(answer.toNumber()))}$, which is the base $${B}$ again.`,
              `${label(1, "Write the base as a power of $e$", "把底数写成 $e$ 的幂")["zh-CN"]} 因为 $e^{x}$ 与 $\\ln x$ 互相还原，$${B} = e^{\\ln ${B}}$。再用幂的乘方法则把 $\\ln ${B}$ 移进指数：${steps(`P(t) = ${P0}\\left(e^{\\ln ${B}}\\right)^{t} = ${P0}e^{(\\ln ${B})t}`)}${label(2, "Read off $k$", "读出 $k$")["zh-CN"]} 与 $${P0}e^{kt}$ 比较${R < 0 ? "，底数小于 $1$，所以 $k$ 是负数" : ""}：${steps(`k = \\ln ${B} \\approx ${dec(answer)}`)}**检验。** $e^{${dec(answer)}} \\approx ${dec4(Math.exp(answer.toNumber()))}$，又回到底数 $${B}$。`,
            ),
          });
        }
      },
    },
    {
      id: "changing-the-time-unit",
      title: t("Changing the time unit", "改变时间单位"),
      explanation: t(
        `The power rule also changes the time unit. A yearly factor of $1.12$ is a monthly factor of $1.12^{\\frac{1}{12}}$, since $(1.12)^{t} = \\left(1.12^{\\frac{1}{12}}\\right)^{12t}$ and $12t$ counts months:

$$1.12^{\\frac{1}{12}} \\approx 1.00949$$

That is about $0.95\\%$ per month, not $\\frac{12\\%}{12} = 1\\%$: twelve months of $1\\%$ would compound to more than $12\\%$. In the same way, a half-life of $5$ years, $\\left(\\frac{1}{2}\\right)^{\\frac{t}{5}}$, is a yearly factor of $\\left(\\frac{1}{2}\\right)^{\\frac{1}{5}} \\approx 0.8706$, its value at $t = 1$: a decrease of about $12.94\\%$ per year. Check: $0.8706^{5} \\approx 0.5$.

> **Watch out.** Don't divide the rate by the number of periods: $\\frac{12\\%}{12}$ and $\\frac{50\\%}{5}$ ignore compounding. Take a root of the factor instead, and turn the factor into a percent change by subtracting it from $1$ or $1$ from it.`,
        `幂的乘方法则也能改变时间单位。每年的倍数 $1.12$ 相当于每月的倍数 $1.12^{\\frac{1}{12}}$，因为 $(1.12)^{t} = \\left(1.12^{\\frac{1}{12}}\\right)^{12t}$，而 $12t$ 是月数：

$$1.12^{\\frac{1}{12}} \\approx 1.00949$$

即每月约 $0.95\\%$，而不是 $\\frac{12\\%}{12} = 1\\%$：每月 $1\\%$，十二个月复合起来超过 $12\\%$。同样，半衰期为 $5$ 年的 $\\left(\\frac{1}{2}\\right)^{\\frac{t}{5}}$，每年的倍数是它在 $t = 1$ 时的值 $\\left(\\frac{1}{2}\\right)^{\\frac{1}{5}} \\approx 0.8706$：每年约减少 $12.94\\%$。检验：$0.8706^{5} \\approx 0.5$。

> **注意。** 不要把增长率除以期数：$\\frac{12\\%}{12}$ 和 $\\frac{50\\%}{5}$ 都忽略了复合。应该对倍数开方，再用倍数与 $1$ 的差得到百分比变化。`,
      ),
      generate(rng) {
        for (;;) {
          const kind = rng.int(0, 2);
          if (kind === 0) {
            const R = rng.pick([6, 8, 9, 10, 12, 15, 18, 20, 24, 30]);
            const answer = rounded(((1 + R / 100) ** (1 / 12) - 1) * 100, 2);
            if (!answer) continue;
            const b = dec(Q.of(100 + R, 100));
            const mf = (1 + R / 100) ** (1 / 12);
            return numberProblem({
              prompt: t(
                `A quantity grows by $${R}\\%$ per year, so it is modeled by $A(t) = A_{0}(${b})^{t}$ with $t$ in years. By what percent does it grow each month? Give the percent to the nearest hundredth.`,
                `某个量每年增长 $${R}\\%$，模型为 $A(t) = A_{0}(${b})^{t}$，$t$ 的单位是年。它每月增长百分之几？精确到百分位。`,
              ),
              answer,
              form: "decimal",
              percent: true,
              wrong: defined(rounded(R / 12, 2), rounded(((1 + R / 100) ** 12 - 1) * 100, 2)),
              solution: t(
                `${label(1, "Count months", "按月计").en} In $t$ years there are $12t$ months, so write the yearly factor as a power of a monthly factor:${steps(`(${b})^{t} = \\left(${b}^{\\frac{1}{12}}\\right)^{12t}`)}${label(2, "The monthly factor", "每月的倍数").en} Use a calculator for the $12$th root:${steps(`${b}^{\\frac{1}{12}} \\approx ${dec5(mf)}`)}Subtract $1$: the quantity grows by about $${dec(answer)}\\%$ each month, a little less than $\\frac{${R}\\%}{12}$.

**Check.** Twelve months of growth give back the yearly factor: $${dec5(mf)}^{12} \\approx ${dec4(mf ** 12)}$.`,
                `${label(1, "Count months", "按月计")["zh-CN"]} $t$ 年有 $12t$ 个月，所以把每年的倍数写成每月倍数的幂：${steps(`(${b})^{t} = \\left(${b}^{\\frac{1}{12}}\\right)^{12t}`)}${label(2, "The monthly factor", "每月的倍数")["zh-CN"]} 用计算器开 $12$ 次方：${steps(`${b}^{\\frac{1}{12}} \\approx ${dec5(mf)}`)}减去 $1$：这个量每月约增长 $${dec(answer)}\\%$，比 $\\frac{${R}\\%}{12}$ 略少。

**检验。** 十二个月的增长合起来就是每年的倍数：$${dec5(mf)}^{12} \\approx ${dec4(mf ** 12)}$。`,
              ),
            });
          }
          const H = rng.int(2, 12);
          const half = kind === 1;
          const factor = (half ? 0.5 : 2) ** (1 / H);
          const answer = rounded(Math.abs(factor - 1) * 100, 2);
          if (!answer) continue;
          const shown = half ? `\\left(\\frac{1}{2}\\right)^{\\frac{t}{${H}}}` : `2^{\\frac{t}{${H}}}`;
          const atOne = half ? `\\left(\\frac{1}{2}\\right)^{\\frac{1}{${H}}}` : `2^{\\frac{1}{${H}}}`;
          const f5 = dec5(factor);
          const diff = half ? `1 - ${f5}` : `${f5} - 1`;
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
            solution: t(
              `${label(1, "The yearly factor", "每年的倍数").en} By the power rule, $${shown} = \\left(${atOne}\\right)^{t}$, so the yearly factor is the value at $t = 1$:${steps(`${atOne} \\approx ${f5}`)}${label(2, "The rate", "变化率").en} The factor is ${half ? "below" : "above"} $1$, so the change each year is:${steps(`${diff} = ${dec5(Math.abs(factor - 1))}`)}The ${half ? "amount decreases" : "population grows"} by about $${dec(answer)}\\%$ each year, ${half ? `not $\\frac{50\\%}{${H}}$` : `not $\\frac{100\\%}{${H}}$`}.

**Check.** $${H}$ years of this factor give $${f5}^{${H}} \\approx ${dec4(factor ** H)}$, the ${half ? "half" : "doubling"} again.`,
              `${label(1, "The yearly factor", "每年的倍数")["zh-CN"]} 由幂的乘方法则，$${shown} = \\left(${atOne}\\right)^{t}$，所以每年的倍数就是 $t = 1$ 时的值：${steps(`${atOne} \\approx ${f5}`)}${label(2, "The rate", "变化率")["zh-CN"]} 倍数${half ? "小于" : "大于"} $1$，所以每年的变化是：${steps(`${diff} = ${dec5(Math.abs(factor - 1))}`)}${half ? "剩余量每年约减少" : "种群每年约增长"} $${dec(answer)}\\%$，而不是 $\\frac{${half ? 50 : 100}\\%}{${H}}$。

**检验。** 这个倍数连乘 $${H}$ 年：$${f5}^{${H}} \\approx ${dec4(factor ** H)}$，又${half ? "是一半" : "是两倍"}。`,
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
