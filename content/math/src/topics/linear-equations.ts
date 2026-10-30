import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, linear, num, poly, Q, relSymbol } from "@ga/subject-math";

import {
  choiceProblem,
  type ExpressionProblem,
  expressionProblem,
  type InequalityOp,
  inequalityLatex,
  inequalityProblem,
  numberProblem,
  steps,
} from "../problems.ts";

/** frac is the exact quotient a / b, for the values that mistakes produce. */
const frac = (a: number, b: number) => Q.of(a, b);

/** over writes a fraction of two LaTeX expressions. */
const over = (n: string | number, d: string | number) => `\\frac{${n}}{${d}}`;

/** signedOver writes k / d for an integer k with the sign in front: "-\frac{7}{a}". */
const signedOver = (k: number, d: string) => (k < 0 ? `-${over(-k, d)}` : over(k, d));

/** solveFor builds an expression problem whose field is preceded by "v =". */
function solveFor(variable: string, p: ExpressionProblem): Problem {
  return expressionProblem({ ...p, prefix: `${variable} =` });
}

/** equation writes an equation with its sides in either order. */
const equation = (rng: Rng, left: string, right: string) => (rng.bool() ? `${left} = ${right}` : `${right} = ${left}`);

/** moveConstant says how to remove the constant b from the side of the variable. */
const moveConstant = (b: number): Text =>
  b > 0 ? t(`subtract $${b}$ from both sides`, `两边同时减去 $${b}$`) : t(`add $${-b}$ to both sides`, `两边同时加上 $${-b}$`);

/** pick picks a multiple of step in [min, max]. */
const pickStep = (rng: Rng, [min, max, step]: readonly [number, number, number]) => min + step * rng.int(0, Math.floor((max - min) / step));

/** coefficientLetters are the letters used for unknown coefficients; x is the unknown. */
const coefficientLetters = ["a", "b", "c", "k", "m", "n", "p", "q", "r", "s"] as const;

/** letterTriples are sets of three letters for equations whose every coefficient is unknown. */
const letterTriples = [
  ["a", "b", "c"],
  ["m", "n", "p"],
  ["p", "q", "r"],
  ["k", "m", "n"],
  ["a", "b", "d"],
  ["r", "s", "t"],
  ["u", "v", "w"],
  ["a", "c", "d"],
] as const;

/** letterPool are the letters sampled for many-variable equations. */
const letterPool = ["a", "b", "c", "d", "h", "k", "m", "n", "p", "q", "r", "s", "t", "u", "v", "w"] as const;

/** letters samples n distinct letters; only the first n entries of the tuple are defined. */
const letters = (rng: Rng, n: number, pool: readonly string[] = letterPool) => rng.sample(pool, n) as [string, string, string, string];

const ops: readonly InequalityOp[] = ["<", "<=", ">", ">="];
const flip: Record<InequalityOp, InequalityOp> = { "<": ">", ">": "<", "<=": ">=", ">=": "<=" };

const solveText = (eq: string, assumption?: Text): Text =>
  assumption
    ? t(`Solve $${eq}$ for $x$. ${assumption.en}`, `解关于 $x$ 的方程 $${eq}$。${assumption["zh-CN"]}`)
    : t(`Solve $${eq}$ for $x$.`, `解关于 $x$ 的方程 $${eq}$。`);

const nonzero = (letters: string): Text => t(`Assume $${letters} \\ne 0$.`, `假设 $${letters} \\ne 0$。`);

const oneSolution = t("Assume the equation has exactly one solution.", "假设方程恰有一个解。");

export const linearEquationsWithUnknownCoefficients: TopicDef = {
  id: "linear-equations-with-unknown-coefficients",
  title: t("Solving Linear Equations With Unknown Coefficients", "解含字母系数的一元一次方程"),
  summary: t(
    "Solve linear equations such as $ax + b = c$ for $x$, writing the solution in terms of the other letters.",
    "解 $ax + b = c$ 这类关于 $x$ 的一次方程，用其他字母表示解。",
  ),
  prerequisites: ["equations-with-parentheses"],
  encompasses: [
    { topic: "two-step-equations", weight: 0.6 },
    { topic: "equations-with-parentheses", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.REI.B.3"],
  knowledgePoints: [
    {
      id: "an-unknown-coefficient",
      title: t("An unknown coefficient", "字母系数"),
      explanation: t(
        "A letter other than $x$ stands for a fixed but unknown number. Solve exactly as with numbers, treating the letter as a number; the solution is an expression in that letter. Since you divide by the coefficient, it must not be zero:\n\n$$ax + 5 = 12 \\;\\Rightarrow\\; ax = 7 \\;\\Rightarrow\\; x = \\frac{7}{a} \\quad (a \\ne 0).$$\n\nWith $\\frac{x}{a} - 3 = 4$, add $3$, then multiply by $a$: $x = 7a$.",
        "$x$ 以外的字母表示一个确定但未知的数。把字母当作数，按通常的步骤求解，解是含这个字母的式子。因为要除以系数，所以系数不能为零：\n\n$$ax + 5 = 12 \\;\\Rightarrow\\; ax = 7 \\;\\Rightarrow\\; x = \\frac{7}{a} \\quad (a \\ne 0).$$\n\n对于 $\\frac{x}{a} - 3 = 4$，先两边加 $3$，再两边乘以 $a$：$x = 7a$。",
      ),
      keyPrerequisites: ["two-step-equations"],
      generate(rng) {
        const a = rng.pick(coefficientLetters);
        const b = rng.nonZero(-15, 15);
        let c = rng.int(-20, 20);
        if (c === b) c = b + rng.nonZero(-9, 9);
        const d = c - b;
        const form = rng.int(0, 2);
        const move = moveConstant(b);
        if (form === 0) {
          const answer = signedOver(d, a);
          const eq = equation(rng, poly([1, `${a}x`], [b, ""]), num(c));
          return solveFor("x", {
            prompt: solveText(eq, nonzero(a)),
            answer,
            wrong: [signedOver(c + b, a), poly([d, a]), `${over(num(c), a)} ${b > 0 ? "-" : "+"} ${Math.abs(b)}`, signedOver(-d, a)],
            solution: t(
              `First ${move.en}, then divide both sides by $${a}$: ${steps(`${a}x = ${num(d)}`, `x = ${answer}`)}`,
              `先${move["zh-CN"]}，再两边同时除以 $${a}$：${steps(`${a}x = ${num(d)}`, `x = ${answer}`)}`,
            ),
          });
        }
        if (form === 1) {
          const answer = signedOver(-d, a);
          const eq = equation(rng, poly([b, ""], [-1, `${a}x`]), num(c));
          return solveFor("x", {
            prompt: solveText(eq, nonzero(a)),
            answer,
            wrong: [signedOver(d, a), signedOver(b + c, a), poly([-d, a])],
            solution: t(
              `First ${move.en}, then divide both sides by $-${a}$: ${steps(`-${a}x = ${num(d)}`, `x = ${answer}`)}`,
              `先${move["zh-CN"]}，再两边同时除以 $-${a}$：${steps(`-${a}x = ${num(d)}`, `x = ${answer}`)}`,
            ),
          });
        }
        const answer = poly([d, a]);
        const eq = equation(rng, `\\frac{x}{${a}} ${b > 0 ? "+" : "-"} ${Math.abs(b)}`, num(c));
        return solveFor("x", {
          prompt: solveText(eq, nonzero(a)),
          answer,
          wrong: [signedOver(d, a), poly([c + b, a]), poly([c, a], [-b, ""])],
          solution: t(
            `First ${move.en}, then multiply both sides by $${a}$: ${steps(`\\frac{x}{${a}} = ${num(d)}`, `x = ${answer}`)}`,
            `先${move["zh-CN"]}，再两边同时乘以 $${a}$：${steps(`\\frac{x}{${a}} = ${num(d)}`, `x = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "unknown-constants",
      title: t("Unknown constants", "字母常数"),
      explanation: t(
        "When the constants are letters, they cannot be combined with each other, so the solution keeps them as a sum or difference. Divide the **whole** side by the coefficient, not just one term:\n\n$$3x + b = c \\;\\Rightarrow\\; 3x = c - b \\;\\Rightarrow\\; x = \\frac{c - b}{3}.$$\n\nWriting $\\frac{c}{3} - b$ is a common mistake: it divides only $c$ by $3$.",
        "常数是字母时，它们之间不能合并，所以解中保留它们的和或差。要用系数去除**整个**一边，而不是其中一项：\n\n$$3x + b = c \\;\\Rightarrow\\; 3x = c - b \\;\\Rightarrow\\; x = \\frac{c - b}{3}.$$\n\n写成 $\\frac{c}{3} - b$ 是常见错误：它只把 $c$ 除以了 $3$。",
      ),
      generate(rng) {
        const [, b, c] = rng.pick(letterTriples);
        const k = rng.sign() * rng.int(2, 9);
        const kx = poly([k, "x"]);
        /** quotient writes (s·c + u·b) / k with a positive denominator. */
        const quotient = (sc: number, sb: number) => {
          const [pc, pb] = k < 0 ? [-sc, -sb] : [sc, sb];
          const top = pc > 0 ? poly([pc, c], [pb, b]) : poly([pb, b], [pc, c]);
          return over(top, Math.abs(k));
        };
        const form = rng.int(0, 2);
        if (form === 2) {
          const answer = `${k < 0 ? "-" : ""}${over(c, Math.abs(k))} - ${b}`;
          const eq = equation(rng, `${k}(x + ${b})`, c);
          return solveFor("x", {
            prompt: solveText(eq),
            answer,
            wrong: [quotient(1, -1), `${over(c, k)} + ${b}`, poly([1, c], [-k, b])],
            solution: t(
              `Divide both sides by $${k}$, then subtract $${b}$: ${steps(`x + ${b} = ${over(c, k)}`, `x = ${answer}`)}`,
              `两边同时除以 $${k}$，再同时减去 $${b}$：${steps(`x + ${b} = ${over(c, k)}`, `x = ${answer}`)}`,
            ),
          });
        }
        const sign = form === 0 ? 1 : -1;
        const answer = quotient(1, -sign);
        const lhs = `${kx} ${sign > 0 ? "+" : "-"} ${b}`;
        const eq = equation(rng, lhs, c);
        const moved = poly([1, c], [-sign, b]);
        return solveFor("x", {
          prompt: solveText(eq),
          answer,
          wrong: [quotient(1, sign), `${over(c, k)} ${sign > 0 ? "-" : "+"} ${b}`, `${k}(${moved})`, over(moved, -k)],
          solution: t(
            `${sign > 0 ? `Subtract $${b}$ from` : `Add $${b}$ to`} both sides, then divide the whole side by $${k}$: ${steps(`${kx} = ${moved}`, `x = ${answer}`)}`,
            `两边同时${sign > 0 ? `减去 $${b}$` : `加上 $${b}$`}，再用 $${k}$ 去除整个一边：${steps(`${kx} = ${moved}`, `x = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "all-coefficients-unknown",
      title: t("Every coefficient unknown", "系数全是字母"),
      explanation: t(
        "With letters everywhere, the steps are the same as for $3x + 5 = 11$: undo the operations on $x$ in reverse order.\n\n$$ax - b = c \\;\\Rightarrow\\; ax = c + b \\;\\Rightarrow\\; x = \\frac{b + c}{a}, \\qquad a(x + b) = c \\;\\Rightarrow\\; x + b = \\frac{c}{a} \\;\\Rightarrow\\; x = \\frac{c}{a} - b.$$\n\nAssume that whatever you divide by is not zero.",
        "到处都是字母时，步骤与解 $3x + 5 = 11$ 相同：按相反的顺序抵消作用在 $x$ 上的运算。\n\n$$ax - b = c \\;\\Rightarrow\\; ax = c + b \\;\\Rightarrow\\; x = \\frac{b + c}{a}, \\qquad a(x + b) = c \\;\\Rightarrow\\; x + b = \\frac{c}{a} \\;\\Rightarrow\\; x = \\frac{c}{a} - b.$$\n\n假设所除的数都不为零。",
      ),
      generate(rng) {
        const [a, b, c] = rng.pick(letterTriples);
        const forms = [
          {
            eq: `${a}x + ${b}`,
            answer: over(`${c} - ${b}`, a),
            wrong: [over(`${c} + ${b}`, a), `${over(c, a)} - ${b}`, over(a, `${c} - ${b}`)],
            work: `${a}x = ${c} - ${b}`,
            nz: a,
          },
          {
            eq: `${a}x - ${b}`,
            answer: over(`${b} + ${c}`, a),
            wrong: [over(`${c} - ${b}`, a), `${over(c, a)} + ${b}`, `${a}(${b} + ${c})`],
            work: `${a}x = ${c} + ${b}`,
            nz: a,
          },
          {
            eq: `${b} - ${a}x`,
            answer: over(`${b} - ${c}`, a),
            wrong: [over(`${c} - ${b}`, a), over(`${b} + ${c}`, a), `${b} - ${over(c, a)}`],
            work: `-${a}x = ${c} - ${b}`,
            nz: a,
          },
          {
            eq: `${a}(x + ${b})`,
            answer: `${over(c, a)} - ${b}`,
            wrong: [over(`${c} - ${b}`, a), `${over(c, a)} + ${b}`, `${c} - ${a}${b}`],
            work: `x + ${b} = ${over(c, a)}`,
            nz: a,
          },
          {
            eq: `\\frac{x}{${a}} + ${b}`,
            answer: `${a}(${c} - ${b})`,
            wrong: [over(`${c} - ${b}`, a), `${a}${c} - ${b}`, `${a}(${c} + ${b})`],
            work: `\\frac{x}{${a}} = ${c} - ${b}`,
            nz: a,
          },
          {
            eq: `\\frac{${a}x}{${b}}`,
            answer: over(`${b}${c}`, a),
            wrong: [over(`${a}${c}`, b), over(`${a}${b}`, c), over(c, `${a}${b}`)],
            work: `${a}x = ${b}${c}`,
            nz: `${a}, ${b}`,
          },
        ];
        const f = rng.pick(forms);
        const eq = equation(rng, f.eq, c);
        return solveFor("x", {
          prompt: solveText(eq, nonzero(f.nz)),
          answer: f.answer,
          wrong: f.wrong,
          solution: t(
            `Undo the operations on $x$ in reverse order: ${steps(f.work, `x = ${f.answer}`)}`,
            `按相反的顺序抵消作用在 $x$ 上的运算：${steps(f.work, `x = ${f.answer}`)}`,
          ),
        });
      },
    },
  ],
};

export const unknownCoefficientsByFactoring: TopicDef = {
  id: "unknown-coefficients-by-factoring",
  title: t("Solving Linear Equations With Unknown Coefficients by Factoring", "用提取公因式解含字母系数的方程"),
  summary: t(
    "Collect the terms with $x$, factor $x$ out, and divide: $ax + bx = c$ gives $x = \\frac{c}{a + b}$.",
    "把含 $x$ 的项移到一边，提出 $x$ 再相除：由 $ax + bx = c$ 得 $x = \\frac{c}{a + b}$。",
  ),
  prerequisites: ["linear-equations-with-unknown-coefficients"],
  encompasses: [
    { topic: "linear-equations-with-unknown-coefficients", weight: 0.5 },
    { topic: "equations-with-variables-on-both-sides", weight: 0.4 },
    { topic: "distributive-property", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.REI.B.3"],
  knowledgePoints: [
    {
      id: "factoring-out-x",
      title: t("Factoring out $x$", "提出 $x$"),
      explanation: t(
        "$ax$ and $bx$ are not like terms with numbers you can add, but both contain $x$. By the distributive property, $ax + bx = x(a + b)$, so\n\n$$ax + bx = c \\;\\Rightarrow\\; x(a + b) = c \\;\\Rightarrow\\; x = \\frac{c}{a + b}.$$\n\nLikewise $ax - 3x = 5$ gives $x(a - 3) = 5$ and $x = \\frac{5}{a - 3}$. This works when the factor is not zero, that is, when the equation has exactly one solution.",
        "$ax$ 与 $bx$ 的系数不能直接相加，但它们都含有 $x$。由分配律，$ax + bx = x(a + b)$，所以\n\n$$ax + bx = c \\;\\Rightarrow\\; x(a + b) = c \\;\\Rightarrow\\; x = \\frac{c}{a + b}.$$\n\n同样，由 $ax - 3x = 5$ 得 $x(a - 3) = 5$，$x = \\frac{5}{a - 3}$。这要求括号里的因式不为零，也就是方程恰有一个解。",
      ),
      keyPrerequisites: ["distributive-property"],
      generate(rng) {
        const [a, b, c] = rng.pick(letterTriples);
        const s = rng.sign();
        const letter = rng.bool();
        const n = rng.nonZero(-9, 9);
        const second = letter ? `${s > 0 ? "+" : "-"} ${b}x` : `${n > 0 ? "+" : "-"} ${poly([Math.abs(n), "x"])}`;
        const secondAbs = letter ? b : String(Math.abs(n));
        const sv = letter ? s : Math.sign(n);
        const den = letter ? poly([1, a], [s, b]) : poly([1, a], [n, ""]);
        const flipped = letter ? poly([1, a], [-s, b]) : poly([1, a], [-n, ""]);
        const product = letter ? `${s < 0 ? "-" : ""}${a}${b}` : poly([n, a]);
        const m = rng.nonZero(-20, 20);
        const rhs = rng.bool() ? c : num(m);
        const answer = rhs === c || m > 0 ? over(rhs, den) : `-${over(-m, den)}`;
        const eq = equation(rng, `${a}x ${second}`, rhs);
        return solveFor("x", {
          prompt: solveText(eq, oneSolution),
          answer,
          wrong: [over(`${rhs} ${sv > 0 ? "-" : "+"} ${secondAbs}`, a), over(rhs, flipped), over(rhs, product)],
          solution: t(
            `Factor $x$ out of the left side, then divide by the factor: ${steps(`x(${den}) = ${rhs}`, `x = ${answer}`)}`,
            `把左边的 $x$ 提出来，再除以括号里的因式：${steps(`x(${den}) = ${rhs}`, `x = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "collecting-then-factoring",
      title: t("Collecting, then factoring", "先移项，再提公因式"),
      explanation: t(
        "When $x$ appears on both sides, first move every term with $x$ to one side and every other term to the other side, then factor:\n\n$$ax + b = cx + d \\;\\Rightarrow\\; ax - cx = d - b \\;\\Rightarrow\\; x(a - c) = d - b \\;\\Rightarrow\\; x = \\frac{d - b}{a - c}.$$",
        "当 $x$ 出现在两边时，先把所有含 $x$ 的项移到一边，其余的项移到另一边，再提公因式：\n\n$$ax + b = cx + d \\;\\Rightarrow\\; ax - cx = d - b \\;\\Rightarrow\\; x(a - c) = d - b \\;\\Rightarrow\\; x = \\frac{d - b}{a - c}.$$",
      ),
      keyPrerequisites: ["equations-with-variables-on-both-sides"],
      generate(rng) {
        const kind = rng.int(0, 2);
        if (kind === 0) {
          const [a, b, c, d] = letters(rng, 4);
          const answer = over(`${d} - ${b}`, `${a} - ${c}`);
          const eq = equation(rng, `${a}x + ${b}`, `${c}x + ${d}`);
          return solveFor("x", {
            prompt: solveText(eq, oneSolution),
            answer,
            wrong: [over(`${d} - ${b}`, `${a} + ${c}`), over(`${d} + ${b}`, `${a} - ${c}`), over(`${b} - ${d}`, `${a} - ${c}`)],
            solution: t(
              `Collect the terms with $x$ on the left, then factor: ${steps(`${a}x - ${c}x = ${d} - ${b}`, `x(${a} - ${c}) = ${d} - ${b}`, `x = ${answer}`)}`,
              `把含 $x$ 的项移到左边，再提公因式：${steps(`${a}x - ${c}x = ${d} - ${b}`, `x(${a} - ${c}) = ${d} - ${b}`, `x = ${answer}`)}`,
            ),
          });
        }
        if (kind === 1) {
          const a = rng.pick(coefficientLetters);
          const n = rng.nonZero(-9, 9);
          const b = rng.nonZero(-12, 12);
          let c = rng.int(-15, 15);
          if (c === b) c = b + rng.nonZero(-6, 6);
          const d = c - b;
          const den = poly([1, a], [-n, ""]);
          const answer = d > 0 ? over(d, den) : over(-d, poly([n, ""], [-1, a]));
          const eq = equation(rng, poly([1, `${a}x`], [b, ""]), poly([n, "x"], [c, ""]));
          return solveFor("x", {
            prompt: solveText(eq, oneSolution),
            answer,
            wrong: [signedOver(d, poly([1, a], [n, ""])), signedOver(c + b, den), signedOver(-d, den)],
            solution: t(
              `Collect the terms with $x$ on the left and the numbers on the right, then factor: ${steps(`${a}x ${n > 0 ? "-" : "+"} ${poly([Math.abs(n), "x"])} = ${num(d)}`, `x(${den}) = ${num(d)}`, `x = ${answer}`)}`,
              `把含 $x$ 的项移到左边、数移到右边，再提公因式：${steps(`${a}x ${n > 0 ? "-" : "+"} ${poly([Math.abs(n), "x"])} = ${num(d)}`, `x(${den}) = ${num(d)}`, `x = ${answer}`)}`,
            ),
          });
        }
        const [a, b, c] = letters(rng, 3);
        const answer = over(b, `${a} + ${c}`);
        const eq = equation(rng, `${a}x`, `${b} - ${c}x`);
        return solveFor("x", {
          prompt: solveText(eq, oneSolution),
          answer,
          wrong: [over(b, `${a} - ${c}`), over(`${b} - ${c}`, a), over(b, `${a}${c}`)],
          solution: t(
            `Add $${c}x$ to both sides, then factor: ${steps(`${a}x + ${c}x = ${b}`, `x(${a} + ${c}) = ${b}`, `x = ${answer}`)}`,
            `两边同时加上 $${c}x$，再提公因式：${steps(`${a}x + ${c}x = ${b}`, `x(${a} + ${c}) = ${b}`, `x = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "expanding-then-factoring",
      title: t("Expanding, then factoring", "先展开，再提公因式"),
      explanation: t(
        "If $x$ is inside parentheses, expand first; only then can the terms with $x$ be collected:\n\n$$a(x + 2) = 5x + b \\;\\Rightarrow\\; ax + 2a = 5x + b \\;\\Rightarrow\\; x(a - 5) = b - 2a \\;\\Rightarrow\\; x = \\frac{b - 2a}{a - 5}.$$",
        "如果 $x$ 在括号里，要先展开，然后才能把含 $x$ 的项移到一起：\n\n$$a(x + 2) = 5x + b \\;\\Rightarrow\\; ax + 2a = 5x + b \\;\\Rightarrow\\; x(a - 5) = b - 2a \\;\\Rightarrow\\; x = \\frac{b - 2a}{a - 5}.$$",
      ),
      generate(rng) {
        if (rng.bool()) {
          const [a, b, c] = letters(rng, 3);
          const s = rng.sign();
          // a(x + s·b) = cx  ⇒  x(a - c) = -s·ab
          const answer = s > 0 ? over(`${a}${b}`, `${c} - ${a}`) : over(`${a}${b}`, `${a} - ${c}`);
          const wrongDen = s > 0 ? `${a} - ${c}` : `${c} - ${a}`;
          const eq = equation(rng, `${a}(x ${s > 0 ? "+" : "-"} ${b})`, `${c}x`);
          return solveFor("x", {
            prompt: solveText(eq, oneSolution),
            answer,
            wrong: [over(`${a}${b}`, wrongDen), over(b, s > 0 ? `${c} - ${a}` : `${a} - ${c}`), over(`${a}${b}`, `${a} + ${c}`)],
            solution: t(
              `Expand, collect the terms with $x$, then factor: ${steps(`${a}x ${s > 0 ? "+" : "-"} ${a}${b} = ${c}x`, `x(${a} - ${c}) = ${s > 0 ? "-" : ""}${a}${b}`, `x = ${answer}`)}`,
              `先展开，把含 $x$ 的项移到一起，再提公因式：${steps(`${a}x ${s > 0 ? "+" : "-"} ${a}${b} = ${c}x`, `x(${a} - ${c}) = ${s > 0 ? "-" : ""}${a}${b}`, `x = ${answer}`)}`,
            ),
          });
        }
        const [a, b] = letters(rng, 2);
        const n = rng.nonZero(-9, 9);
        const m = rng.nonZero(-9, 9);
        // a(x + n) = mx + b  ⇒  x(a - m) = b - na
        const top = poly([1, b], [-n, a]);
        const den = poly([1, a], [-m, ""]);
        const answer = over(top, den);
        const eq = equation(rng, `${a}(${linear(1, n)})`, poly([m, "x"], [1, b]));
        return solveFor("x", {
          prompt: solveText(eq, oneSolution),
          answer,
          wrong: [over(poly([1, b], [-n, ""]), den), over(poly([1, b], [n, a]), den), over(top, poly([1, a], [m, ""]))],
          solution: t(
            `Expand, collect the terms with $x$ on the left, then factor: ${steps(`${a}x ${n > 0 ? "+" : "-"} ${poly([Math.abs(n), a])} = ${poly([m, "x"], [1, b])}`, `x(${den}) = ${top}`, `x = ${answer}`)}`,
            `先展开，把含 $x$ 的项移到左边，再提公因式：${steps(`${a}x ${n > 0 ? "+" : "-"} ${poly([Math.abs(n), a])} = ${poly([m, "x"], [1, b])}`, `x(${den}) = ${top}`, `x = ${answer}`)}`,
          ),
        });
      },
    },
  ],
};

const givenSign = (k: string, positive: boolean): Text =>
  t(`Given $${k} ${positive ? ">" : "<"} 0$`, `已知 $${k} ${positive ? ">" : "<"} 0$`);

export const linearInequalitiesWithParameters: TopicDef = {
  id: "linear-inequalities-with-parameters",
  title: t("Solving Linear Inequalities With Unknown Parameters", "解含参数的一元一次不等式"),
  summary: t(
    "Solve inequalities with a letter coefficient whose sign is known, reversing the symbol when it is negative.",
    "解字母系数符号已知的不等式；系数为负时改变不等号方向。",
  ),
  prerequisites: ["linear-equations-with-unknown-coefficients", "solving-multi-step-inequalities"],
  encompasses: [
    { topic: "solving-multi-step-inequalities", weight: 0.5 },
    { topic: "linear-equations-with-unknown-coefficients", weight: 0.4 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.REI.B.3"],
  knowledgePoints: [
    {
      id: "dividing-by-a-parameter",
      title: t("Dividing by a parameter of known sign", "除以符号已知的参数"),
      explanation: t(
        "To divide both sides of an inequality by a letter, you must know its sign: dividing by a positive number keeps the symbol, dividing by a negative number reverses it. If $k < 0$,\n\n$$kx - 2k > 5k \\;\\Rightarrow\\; kx > 7k \\;\\Rightarrow\\; x < 7.$$\n\nIf instead $k > 0$, the same steps give $x > 7$.",
        "两边同时除以一个字母时，必须知道它的符号：除以正数不等号方向不变，除以负数不等号方向改变。若 $k < 0$，\n\n$$kx - 2k > 5k \\;\\Rightarrow\\; kx > 7k \\;\\Rightarrow\\; x < 7.$$\n\n若 $k > 0$，同样的步骤得到 $x > 7$。",
      ),
      keyPrerequisites: ["solving-multi-step-inequalities"],
      generate(rng) {
        const k = rng.pick(["a", "k", "m", "p", "r"]);
        const positive = rng.bool();
        const op = rng.pick(ops);
        const answerOp = positive ? op : flip[op];
        const v = rng.int(-9, 9);
        const e = rng.nonZero(-9, 9);
        const c = v + e;
        const factored = rng.bool();
        const lhs = factored ? `${k}(${linear(1, e)})` : poly([1, `${k}x`], [e, k]);
        const ineq = `${lhs} ${relSymbol(op)} ${poly([c, k])}`;
        const middle = factored ? `${linear(1, e)} ${relSymbol(answerOp)} ${num(c)}` : `${k}x ${relSymbol(op)} ${poly([v, k])}`;
        const work = factored
          ? t(`Divide both sides by $${k}$, then ${moveConstant(e).en}`, `两边同时除以 $${k}$，再${moveConstant(e)["zh-CN"]}`)
          : t(
              `${e > 0 ? `Subtract $${poly([e, k])}$ from` : `Add $${poly([-e, k])}$ to`} both sides, then divide by $${k}$`,
              `两边同时${e > 0 ? `减去 $${poly([e, k])}$` : `加上 $${poly([-e, k])}$`}，再同时除以 $${k}$`,
            );
        return inequalityProblem({
          prompt: t(
            `${givenSign(k, positive).en}, solve $${ineq}$ for $x$.`,
            `${givenSign(k, positive)["zh-CN"]}，解关于 $x$ 的不等式 $${ineq}$。`,
          ),
          op: answerOp,
          value: v,
          wrong: [
            [flip[answerOp], v],
            [answerOp, -v],
          ],
          solution: t(
            `${work.en}. Since $${k}$ is ${positive ? "positive, the symbol stays" : "negative, the symbol reverses"}: ${steps(middle, inequalityLatex("x", answerOp, v))}`,
            `${work["zh-CN"]}。因为 $${k}$ 是${positive ? "正数，不等号方向不变" : "负数，不等号方向改变"}：${steps(middle, inequalityLatex("x", answerOp, v))}`,
          ),
        });
      },
    },
    {
      id: "a-boundary-with-a-parameter",
      title: t("A boundary in terms of a parameter", "用参数表示的边界"),
      explanation: t(
        "When the parameter does not cancel, the boundary of the solution is an expression in the parameter. If $a < 0$,\n\n$$ax + 3 \\le 11 \\;\\Rightarrow\\; ax \\le 8 \\;\\Rightarrow\\; x \\ge \\frac{8}{a}.$$\n\nThe symbol reverses because you divide by the negative number $a$.",
        "参数不能约去时，解的边界是含参数的式子。若 $a < 0$，\n\n$$ax + 3 \\le 11 \\;\\Rightarrow\\; ax \\le 8 \\;\\Rightarrow\\; x \\ge \\frac{8}{a}.$$\n\n因为除以的是负数 $a$，所以不等号方向改变。",
      ),
      generate(rng) {
        const a = rng.pick(["a", "k", "m", "p", "r"]);
        const positive = rng.bool();
        const op = rng.pick(ops);
        const answerOp = positive ? op : flip[op];
        const b = rng.nonZero(-12, 12);
        let c = rng.int(-15, 15);
        if (c === b) c = b + rng.nonZero(-6, 6);
        const d = c - b;
        const bound = signedOver(d, a);
        const other = c + b !== 0 ? signedOver(c + b, a) : poly([d, a]);
        const choices = [
          `x ${relSymbol(answerOp)} ${bound}`,
          `x ${relSymbol(flip[answerOp])} ${bound}`,
          `x ${relSymbol(answerOp)} ${other}`,
          `x ${relSymbol(flip[answerOp])} ${other}`,
        ];
        const order = rng.shuffle([0, 1, 2, 3]);
        const ineq = `${poly([1, `${a}x`], [b, ""])} ${relSymbol(op)} ${num(c)}`;
        const move = moveConstant(b);
        return choiceProblem({
          prompt: t(
            `${givenSign(a, positive).en}, solve $${ineq}$ for $x$.`,
            `${givenSign(a, positive)["zh-CN"]}，解关于 $x$ 的不等式 $${ineq}$。`,
          ),
          options: order.map((i) => t(`$${choices[i]}$`, `$${choices[i]}$`)),
          correct: order.indexOf(0),
          solution: t(
            `First ${move.en}, then divide by $${a}$, which is ${positive ? "positive, so the symbol stays" : "negative, so the symbol reverses"}: ${steps(`${a}x ${relSymbol(op)} ${num(d)}`, choices[0]!)}`,
            `先${move["zh-CN"]}，再同时除以 $${a}$。它是${positive ? "正数，不等号方向不变" : "负数，不等号方向改变"}：${steps(`${a}x ${relSymbol(op)} ${num(d)}`, choices[0]!)}`,
          ),
        });
      },
    },
    {
      id: "the-sign-of-an-expression",
      title: t("The sign of an expression in the parameter", "含参数式子的符号"),
      explanation: t(
        "Sometimes the coefficient of $x$ is an expression such as $a - 3$. Its sign follows from what is given: if $a < 3$, then $a - 3 < 0$. So for $a < 3$,\n\n$$ax > 3x + 5 \\;\\Rightarrow\\; (a - 3)x > 5 \\;\\Rightarrow\\; x < \\frac{5}{a - 3}.$$",
        "有时 $x$ 的系数是 $a - 3$ 这样的式子。它的符号由已知条件决定：若 $a < 3$，则 $a - 3 < 0$。所以当 $a < 3$ 时，\n\n$$ax > 3x + 5 \\;\\Rightarrow\\; (a - 3)x > 5 \\;\\Rightarrow\\; x < \\frac{5}{a - 3}.$$",
      ),
      generate(rng) {
        const a = rng.pick(["a", "k", "m", "p", "r"]);
        const n = rng.int(1, 9);
        const above = rng.bool();
        const op = rng.pick(ops);
        const answerOp = above ? op : flip[op];
        const c = rng.nonZero(-20, 20);
        const den = poly([1, a], [-n, ""]);
        const bound = signedOver(c, den);
        const other = signedOver(c, poly([n, ""], [-1, a]));
        const choices = [
          `x ${relSymbol(answerOp)} ${bound}`,
          `x ${relSymbol(flip[answerOp])} ${bound}`,
          `x ${relSymbol(answerOp)} ${other}`,
          `x ${relSymbol(flip[answerOp])} ${other}`,
        ];
        const order = rng.shuffle([0, 1, 2, 3]);
        const ineq = rng.bool() ? `${a}x ${relSymbol(op)} ${poly([n, "x"], [c, ""])}` : `(${den})x ${relSymbol(op)} ${num(c)}`;
        const given = `${a} ${above ? ">" : "<"} ${num(n)}`;
        return choiceProblem({
          prompt: t(`Given $${given}$, solve $${ineq}$ for $x$.`, `已知 $${given}$，解关于 $x$ 的不等式 $${ineq}$。`),
          options: order.map((i) => t(`$${choices[i]}$`, `$${choices[i]}$`)),
          correct: order.indexOf(0),
          solution: t(
            `Write the inequality as $(${den})x ${relSymbol(op)} ${num(c)}$. Since $${given}$, $${den}$ is ${above ? "positive, so the symbol stays" : "negative, so the symbol reverses"} when you divide by it: $${choices[0]}$.`,
            `把不等式写成 $(${den})x ${relSymbol(op)} ${num(c)}$。因为 $${given}$，$${den}$ 是${above ? "正数，两边同时除以它时不等号方向不变" : "负数，两边同时除以它时不等号方向改变"}：$${choices[0]}$。`,
          ),
        });
      },
    },
  ],
};

export const manyVariableEquations: TopicDef = {
  id: "many-variable-equations",
  title: t("Solving Many-Variable Equations", "解多元方程中的一个变量"),
  summary: t(
    "Solve an equation with several variables for one of them, treating the others as numbers.",
    "把其他变量当作数，从含多个变量的方程中解出其中一个。",
  ),
  prerequisites: ["linear-equations-with-unknown-coefficients"],
  encompasses: [{ topic: "linear-equations-with-unknown-coefficients", weight: 0.6 }],
  xp: 15,
  standards: ["CCSS.HSA.CED.A.4"],
  knowledgePoints: [
    {
      id: "solving-for-y",
      title: t("Solving a two-variable equation for one variable", "从二元方程中解出一个变量"),
      explanation: t(
        "To **solve for** $y$ means to get $y$ alone on one side; the other side may contain $x$. Move the $x$ term, then divide **every** term by the coefficient of $y$:\n\n$$3x + 2y = 12 \\;\\Rightarrow\\; 2y = 12 - 3x \\;\\Rightarrow\\; y = 6 - \\frac{3}{2}x.$$",
        "**解出** $y$ 就是让 $y$ 单独在一边，另一边可以含有 $x$。先移走含 $x$ 的项，再把**每一项**都除以 $y$ 的系数：\n\n$$3x + 2y = 12 \\;\\Rightarrow\\; 2y = 12 - 3x \\;\\Rightarrow\\; y = 6 - \\frac{3}{2}x.$$",
      ),
      generate(rng) {
        const forY = rng.bool();
        const [u, w] = forY ? ["y", "x"] : ["x", "y"];
        const cu = rng.sign() * rng.int(2, 9);
        const cw = rng.nonZero(-9, 9);
        const c = rng.nonZero(-24, 24);
        const lhs = rng.bool() ? poly([cw, w], [cu, u]) : poly([cu, u], [cw, w]);
        const answer = poly([frac(-cw, cu), w], [frac(c, cu), ""]);
        return solveFor(u, {
          prompt: t(`Solve $${lhs} = ${num(c)}$ for $${u}$.`, `从方程 $${lhs} = ${num(c)}$ 中解出 $${u}$。`),
          answer,
          wrong: [poly([-cw, w], [c, ""]), poly([-cw, w], [frac(c, cu), ""]), poly([frac(cw, cu), w], [frac(c, cu), ""])],
          solution: t(
            `Move the $${w}$ term to the right, then divide every term by $${num(cu)}$: ${steps(`${poly([cu, u])} = ${poly([c, ""], [-cw, w])}`, `${u} = ${answer}`)}`,
            `把含 $${w}$ 的项移到右边，再把每一项都除以 $${num(cu)}$：${steps(`${poly([cu, u])} = ${poly([c, ""], [-cw, w])}`, `${u} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "solving-for-a-letter",
      title: t("Solving for any letter", "解出任意一个字母"),
      explanation: t(
        "Any letter can be the one you solve for. Treat all the other letters as numbers and undo the operations on the chosen letter in reverse order:\n\n$$\\frac{p + q}{r} = s \\;\\Rightarrow\\; p + q = rs \\;\\Rightarrow\\; q = rs - p.$$",
        "任何一个字母都可以作为要解出的未知数。把其他字母都当作数，按相反的顺序抵消作用在这个字母上的运算：\n\n$$\\frac{p + q}{r} = s \\;\\Rightarrow\\; p + q = rs \\;\\Rightarrow\\; q = rs - p.$$",
      ),
      generate(rng) {
        const [p, q, r, s] = letters(rng, 4);
        const k = rng.int(2, 9);
        const forms = [
          {
            eq: `${p}${q} + ${r} = ${s}`,
            v: q,
            work: `${p}${q} = ${s} - ${r}`,
            answer: over(`${s} - ${r}`, p),
            wrong: [over(`${s} + ${r}`, p), `${over(s, p)} - ${r}`, `${p}(${s} - ${r})`],
          },
          {
            eq: `${k}${p} - ${q}${r} = ${s}`,
            v: r,
            work: `-${q}${r} = ${s} - ${k}${p}`,
            answer: over(`${k}${p} - ${s}`, q),
            wrong: [over(`${s} - ${k}${p}`, q), over(`${k}${p} + ${s}`, q), `${k}${p} - ${over(s, q)}`],
          },
          {
            eq: `\\frac{${p} + ${q}}{${r}} = ${s}`,
            v: q,
            work: `${p} + ${q} = ${r}${s}`,
            answer: `${r}${s} - ${p}`,
            wrong: [`${over(s, r)} - ${p}`, `${r}${s} + ${p}`, `${r}(${s} - ${p})`],
          },
          {
            eq: `${p}(${q} + ${r}) = ${s}`,
            v: r,
            work: `${q} + ${r} = ${over(s, p)}`,
            answer: `${over(s, p)} - ${q}`,
            wrong: [over(`${s} - ${q}`, p), `${s} - ${p}${q}`, `${over(s, p)} + ${q}`],
          },
          {
            eq: `\\frac{${p}}{${q}} - ${r} = ${s}`,
            v: p,
            work: `\\frac{${p}}{${q}} = ${s} + ${r}`,
            answer: `${q}(${s} + ${r})`,
            wrong: [`${q}${s} + ${r}`, `${q}(${s} - ${r})`, over(`${s} + ${r}`, q)],
          },
          {
            eq: `${k}${p} + ${q}${r} = ${s}${r}`,
            v: p,
            work: `${k}${p} = ${s}${r} - ${q}${r}`,
            answer: over(`${s}${r} - ${q}${r}`, k),
            wrong: [`${over(`${s}${r}`, k)} - ${q}${r}`, over(`${s}${r} + ${q}${r}`, k), `${s}${r} - ${q}${r} - ${k}`],
          },
        ];
        const f = rng.pick(forms);
        const [left, right] = f.eq.split(" = ") as [string, string];
        const eq = equation(rng, left, right);
        return solveFor(f.v, {
          prompt: t(
            `Solve $${eq}$ for $${f.v}$. Assume no variable you divide by is zero.`,
            `从方程 $${eq}$ 中解出 $${f.v}$。假设作为除数的变量都不为零。`,
          ),
          answer: f.answer,
          wrong: f.wrong,
          solution: t(
            `Treat the other letters as numbers and undo the operations on $${f.v}$: ${steps(f.work, `${f.v} = ${f.answer}`)}`,
            `把其他字母当作数，抵消作用在 $${f.v}$ 上的运算：${steps(f.work, `${f.v} = ${f.answer}`)}`,
          ),
        });
      },
    },
  ],
};

/** ProductFormula is a formula L = k · v₁v₂…, with k = num/den. */
interface ProductFormula {
  readonly lhs: string;
  readonly vars: readonly string[];
  readonly k?: readonly [number, number];
}

const productFormulas: readonly ProductFormula[] = [
  { lhs: "d", vars: ["r", "t"] },
  { lhs: "A", vars: ["l", "w"] },
  { lhs: "V", vars: ["l", "w", "h"] },
  { lhs: "I", vars: ["P", "r", "t"] },
  { lhs: "A", vars: ["b", "h"], k: [1, 2] },
  { lhs: "V", vars: ["B", "h"], k: [1, 3] },
  { lhs: "V", vars: ["B", "h"] },
  { lhs: "F", vars: ["m", "a"] },
  { lhs: "W", vars: ["F", "d"] },
  { lhs: "p", vars: ["m", "v"] },
  { lhs: "E", vars: ["P", "t"] },
  { lhs: "P", vars: ["s"], k: [4, 1] },
];

/** QuotientFormula is a formula L = n / d. */
const quotientFormulas: readonly (readonly [string, string, string])[] = [
  ["s", "d", "t"],
  ["D", "m", "V"],
  ["P", "F", "A"],
];

/** FormulaCase is a formula solved for one of its letters. */
interface FormulaCase {
  readonly left: string;
  readonly right: string;
  readonly v: string;
  readonly answer: string;
  readonly wrong: readonly string[];
}

const formulaPrompt = (eq: string, v: string): Text =>
  t(`Solve the formula $${eq}$ for $${v}$. Assume every quantity is positive.`, `从公式 $${eq}$ 中解出 $${v}$。假设所有的量都是正数。`);

function formulaProblem(rng: Rng, c: FormulaCase, how: Text): Problem {
  const eq = equation(rng, c.left, c.right);
  return solveFor(c.v, {
    prompt: formulaPrompt(eq, c.v),
    answer: c.answer,
    wrong: c.wrong,
    solution: t(`${how.en} ${steps(`${c.v} = ${c.answer}`)}`, `${how["zh-CN"]}${steps(`${c.v} = ${c.answer}`)}`),
  });
}

const twoStepFormulas: readonly FormulaCase[] = [
  {
    left: "P",
    right: "2l + 2w",
    v: "w",
    answer: "\\frac{P - 2l}{2}",
    wrong: ["P - 2l", "\\frac{P}{2} - 2l", "\\frac{P + 2l}{2}"],
  },
  {
    left: "P",
    right: "2l + 2w",
    v: "l",
    answer: "\\frac{P - 2w}{2}",
    wrong: ["P - 2w", "\\frac{P}{2} - 2w", "\\frac{P + 2w}{2}"],
  },
  { left: "y", right: "mx + b", v: "x", answer: "\\frac{y - b}{m}", wrong: ["\\frac{y}{m} - b", "\\frac{y + b}{m}", "m(y - b)"] },
  { left: "y", right: "mx + b", v: "m", answer: "\\frac{y - b}{x}", wrong: ["\\frac{y}{x} - b", "\\frac{y + b}{x}", "x(y - b)"] },
  { left: "y", right: "mx + b", v: "b", answer: "y - mx", wrong: ["mx - y", "y + mx", "\\frac{y}{mx}"] },
  {
    left: "F",
    right: "\\frac{9}{5}C + 32",
    v: "C",
    answer: "\\frac{5}{9}(F - 32)",
    wrong: ["\\frac{5}{9}F - 32", "\\frac{9}{5}(F - 32)", "\\frac{5}{9}(F + 32)"],
  },
  { left: "v", right: "u + at", v: "a", answer: "\\frac{v - u}{t}", wrong: ["\\frac{v}{t} - u", "\\frac{v + u}{t}", "t(v - u)"] },
  { left: "v", right: "u + at", v: "t", answer: "\\frac{v - u}{a}", wrong: ["\\frac{v}{a} - u", "\\frac{v + u}{a}", "a(v - u)"] },
  { left: "v", right: "u + at", v: "u", answer: "v - at", wrong: ["at - v", "v + at", "\\frac{v}{at}"] },
  {
    left: "A",
    right: "\\frac{1}{2}(a + b)h",
    v: "a",
    answer: "\\frac{2A}{h} - b",
    wrong: ["\\frac{A}{2h} - b", "\\frac{2A - b}{h}", "2Ah - b"],
  },
  {
    left: "A",
    right: "\\frac{1}{2}(a + b)h",
    v: "h",
    answer: "\\frac{2A}{a + b}",
    wrong: ["\\frac{A}{2(a + b)}", "\\frac{2A}{a} - b", "2A - a - b"],
  },
  { left: "M", right: "\\frac{a + b}{2}", v: "b", answer: "2M - a", wrong: ["\\frac{M}{2} - a", "2M + a", "2(M - a)"] },
  {
    left: "L",
    right: "a + (n - 1)d",
    v: "d",
    answer: "\\frac{L - a}{n - 1}",
    wrong: ["\\frac{L - a}{n} - 1", "\\frac{L + a}{n - 1}", "\\frac{L}{n - 1} - a"],
  },
  {
    left: "L",
    right: "a + (n - 1)d",
    v: "n",
    answer: "\\frac{L - a}{d} + 1",
    wrong: ["\\frac{L - a}{d} - 1", "\\frac{L - a + 1}{d}", "\\frac{L}{d} - a + 1"],
  },
  {
    left: "S",
    right: "\\frac{n(a + L)}{2}",
    v: "a",
    answer: "\\frac{2S}{n} - L",
    wrong: ["\\frac{S}{2n} - L", "\\frac{2S - L}{n}", "2Sn - L"],
  },
  { left: "c", right: "ax + by", v: "y", answer: "\\frac{c - ax}{b}", wrong: ["c - ax", "\\frac{c}{b} - ax", "\\frac{c + ax}{b}"] },
  { left: "c", right: "ax + by", v: "a", answer: "\\frac{c - by}{x}", wrong: ["c - by", "\\frac{c}{x} - by", "\\frac{c + by}{x}"] },
];

const factoringFormulas: readonly FormulaCase[] = [
  { left: "A", right: "P + Prt", v: "P", answer: "\\frac{A}{1 + rt}", wrong: ["\\frac{A}{rt}", "A - rt", "\\frac{A}{1 - rt}"] },
  {
    left: "S",
    right: "2lw + 2lh + 2wh",
    v: "h",
    answer: "\\frac{S - 2lw}{2l + 2w}",
    wrong: ["\\frac{S - 2lw}{4lw}", "\\frac{S + 2lw}{2l + 2w}", "\\frac{S}{2l + 2w} - 2lw"],
  },
  {
    left: "S",
    right: "2lw + 2lh + 2wh",
    v: "w",
    answer: "\\frac{S - 2lh}{2l + 2h}",
    wrong: ["\\frac{S - 2lh}{4lh}", "\\frac{S + 2lh}{2l + 2h}", "\\frac{S}{2l + 2h} - 2lh"],
  },
  {
    left: "S",
    right: "2lw + 2lh + 2wh",
    v: "l",
    answer: "\\frac{S - 2wh}{2w + 2h}",
    wrong: ["\\frac{S - 2wh}{4wh}", "\\frac{S + 2wh}{2w + 2h}", "\\frac{S}{2w + 2h} - 2wh"],
  },
  {
    left: "E",
    right: "mgh + \\frac{1}{2}mv^2",
    v: "m",
    answer: "\\frac{E}{gh + \\frac{1}{2}v^2}",
    wrong: ["\\frac{E}{gh} - \\frac{1}{2}v^2", "\\frac{E}{ghv^2}", "\\frac{2E}{gh + v^2}"],
  },
];

export const rearrangingFormulas: TopicDef = {
  id: "rearranging-formulas",
  title: t("Rearranging Formulas", "公式变形"),
  summary: t(
    "Solve formulas such as $A = \\frac{1}{2}bh$ and $P = 2l + 2w$ for any of their letters.",
    "从 $A = \\frac{1}{2}bh$、$P = 2l + 2w$ 等公式中解出其中任意一个字母。",
  ),
  prerequisites: ["many-variable-equations", "unknown-coefficients-by-factoring"],
  encompasses: [
    { topic: "many-variable-equations", weight: 0.6 },
    { topic: "unknown-coefficients-by-factoring", weight: 0.3 },
  ],
  xp: 18,
  standards: ["CCSS.HSA.CED.A.4"],
  knowledgePoints: [
    {
      id: "products-and-quotients",
      title: t("Formulas with products and quotients", "乘除形式的公式"),
      explanation: t(
        "A formula is an equation relating several quantities. To solve $V = lwh$ for $h$, divide both sides by everything multiplied by $h$: $h = \\frac{V}{lw}$.\n\nA fraction in front is undone by its reciprocal: $A = \\frac{1}{2}bh$ gives $2A = bh$, so $h = \\frac{2A}{b}$. A letter in a denominator is cleared first: $s = \\frac{d}{t}$ gives $st = d$, so $t = \\frac{d}{s}$.",
        "公式是表示几个量之间关系的等式。从 $V = lwh$ 中解出 $h$，两边同时除以与 $h$ 相乘的所有量：$h = \\frac{V}{lw}$。\n\n前面的分数用它的倒数抵消：由 $A = \\frac{1}{2}bh$ 得 $2A = bh$，所以 $h = \\frac{2A}{b}$。分母中的字母先去掉：由 $s = \\frac{d}{t}$ 得 $st = d$，所以 $t = \\frac{d}{s}$。",
      ),
      keyPrerequisites: ["many-variable-equations"],
      generate(rng) {
        if (rng.bool(0.25)) {
          const [l, n, d] = rng.pick(quotientFormulas);
          const forNumerator = rng.bool();
          const c: FormulaCase = forNumerator
            ? { left: l, right: over(n, d), v: n, answer: `${l}${d}`, wrong: [over(l, d), over(d, l)] }
            : { left: l, right: over(n, d), v: d, answer: over(n, l), wrong: [`${l}${n}`, over(l, n)] };
          return formulaProblem(
            rng,
            c,
            forNumerator
              ? t(`Multiply both sides by $${d}$:`, `两边同时乘以 $${d}$：`)
              : t(`Multiply both sides by $${d}$, then divide by $${l}$:`, `两边同时乘以 $${d}$，再同时除以 $${l}$：`),
          );
        }
        const f = rng.pick(productFormulas);
        const [kn, kd] = f.k ?? [1, 1];
        const v = rng.pick(f.vars);
        const others = f.vars.filter((x) => x !== v).join("");
        const kLatex = kd === 1 ? (kn === 1 ? "" : String(kn)) : over(kn, kd);
        const top = `${kd === 1 ? "" : kd}${f.lhs}`;
        const bottom = `${kn === 1 ? "" : kn}${others}`;
        const answer = bottom === "" ? top : over(top, bottom);
        const wrong = [`${f.lhs}${others}`, over(bottom === "" ? 1 : bottom, top)];
        if (f.k) wrong.push(others === "" ? `${kn}${f.lhs}` : over(f.lhs, others));
        const divide = bottom === "" ? "" : bottom;
        return formulaProblem(
          rng,
          { left: f.lhs, right: `${kLatex}${f.vars.join("")}`, v, answer, wrong },
          kd === 1
            ? t(`Divide both sides by $${divide}$:`, `两边同时除以 $${divide}$：`)
            : t(`Multiply both sides by $${kd}$, then divide by $${divide}$:`, `两边同时乘以 $${kd}$，再同时除以 $${divide}$：`),
        );
      },
    },
    {
      id: "two-step-formulas",
      title: t("Formulas with sums", "含加减的公式"),
      explanation: t(
        "When the letter you want is in one term of a sum, first move the other terms, then divide the **whole** other side:\n\n$$P = 2l + 2w \\;\\Rightarrow\\; P - 2l = 2w \\;\\Rightarrow\\; w = \\frac{P - 2l}{2}.$$\n\nIf the letter is inside parentheses or a fraction, undo the outer operations first: $A = \\frac{1}{2}(a + b)h$ gives $\\frac{2A}{h} = a + b$, so $a = \\frac{2A}{h} - b$.",
        "当要解出的字母在和的某一项中时，先移走其他项，再用系数去除另一边的**整体**：\n\n$$P = 2l + 2w \\;\\Rightarrow\\; P - 2l = 2w \\;\\Rightarrow\\; w = \\frac{P - 2l}{2}.$$\n\n如果字母在括号或分数里，先抵消外层的运算：由 $A = \\frac{1}{2}(a + b)h$ 得 $\\frac{2A}{h} = a + b$，所以 $a = \\frac{2A}{h} - b$。",
      ),
      generate(rng) {
        const c = rng.pick(twoStepFormulas);
        return formulaProblem(
          rng,
          c,
          t(
            `Move the terms without $${c.v}$ to the other side, then undo what multiplies or divides $${c.v}$:`,
            `把不含 $${c.v}$ 的项移到另一边，再抵消与 $${c.v}$ 相乘或相除的量：`,
          ),
        );
      },
    },
    {
      id: "formulas-that-need-factoring",
      title: t("Formulas that need factoring", "需要提公因式的公式"),
      explanation: t(
        "If the letter you want appears in more than one term, collect those terms on one side and factor it out:\n\n$$A = P + Prt \\;\\Rightarrow\\; A = P(1 + rt) \\;\\Rightarrow\\; P = \\frac{A}{1 + rt}.$$",
        "如果要解出的字母出现在不止一项中，先把这些项移到同一边，再把它提出来：\n\n$$A = P + Prt \\;\\Rightarrow\\; A = P(1 + rt) \\;\\Rightarrow\\; P = \\frac{A}{1 + rt}.$$",
      ),
      keyPrerequisites: ["unknown-coefficients-by-factoring"],
      generate(rng) {
        if (rng.bool(0.4)) {
          const c = rng.pick(factoringFormulas);
          return formulaProblem(
            rng,
            c,
            t(
              `Collect the terms with $${c.v}$ on one side, factor out $${c.v}$, then divide:`,
              `把含 $${c.v}$ 的项移到一边，提出 $${c.v}$，再相除：`,
            ),
          );
        }
        const [a, b, c, s] = letters(
          rng,
          4,
          letterPool.filter((l) => l !== "t"),
        );
        const v = "t";
        const kind = rng.int(0, 2);
        const cases: FormulaCase[] = [
          {
            left: s,
            right: `${a}${v} + ${b}${v} + ${c}`,
            v,
            answer: over(`${s} - ${c}`, `${a} + ${b}`),
            wrong: [over(`${s} - ${c}`, `${a}${b}`), over(`${s} + ${c}`, `${a} + ${b}`), `${over(s, `${a} + ${b}`)} - ${c}`],
          },
          {
            left: `${a}${v} - ${c}`,
            right: `${b}${v}`,
            v,
            answer: over(c, `${a} - ${b}`),
            wrong: [over(c, `${a} + ${b}`), over(c, `${b} - ${a}`), over(`${c} - ${b}`, a)],
          },
          {
            left: `${a}${v}`,
            right: `${b}(${v} + ${c})`,
            v,
            answer: over(`${b}${c}`, `${a} - ${b}`),
            wrong: [over(c, `${a} - ${b}`), over(`${b}${c}`, `${b} - ${a}`), over(`${b}${c}`, `${a} + ${b}`)],
          },
        ];
        const f = cases[kind]!;
        const eq = equation(rng, f.left, f.right);
        return solveFor(v, {
          prompt: t(
            `Solve $${eq}$ for $${v}$. Assume the equation has exactly one solution.`,
            `从方程 $${eq}$ 中解出 $${v}$。假设方程恰有一个解。`,
          ),
          answer: f.answer,
          wrong: f.wrong,
          solution: t(
            `Collect the terms with $${v}$ on one side, factor out $${v}$, then divide: ${steps(`${v} = ${f.answer}`)}`,
            `把含 $${v}$ 的项移到一边，提出 $${v}$，再相除：${steps(`${v} = ${f.answer}`)}`,
          ),
        });
      },
    },
  ],
};

/** LinearContext is a situation described by a starting amount that changes at a constant rate. */
interface LinearContext {
  readonly v: string;
  /** grows tells whether the quantity increases with v. */
  readonly grows: boolean;
  /** fixed and rate are ranges [min, max, step]; they never overlap, so the two numbers differ. */
  readonly fixed: readonly [number, number, number];
  readonly rate: readonly [number, number, number];
  /** count is the range of v in modeling problems. */
  readonly count: readonly [number, number];
  readonly quantity: Text;
  readonly unit: Text;
  readonly fixedMeaning: Text;
  readonly rateMeaning: Text;
  readonly vMeaning: Text;
  readonly totalMeaning: Text;
  readonly describe: (f: number, r: number) => Text;
  readonly findV: (total: number) => Text;
}

const dollars = t("dollars", "元");

const linearContexts: readonly LinearContext[] = [
  {
    v: "m",
    grows: true,
    fixed: [6, 12, 1],
    rate: [2, 5, 1],
    count: [3, 25],
    quantity: t("the cost, in dollars, of a taxi ride of $m$ kilometers", "乘出租车行驶 $m$ 千米的费用（单位：元）"),
    unit: dollars,
    fixedMeaning: t("the fixed charge for every ride", "每次乘车的起步价"),
    rateMeaning: t("the cost per kilometer", "每千米的费用"),
    vMeaning: t("the number of kilometers", "行驶的千米数"),
    totalMeaning: t("the total cost of the ride", "这次乘车的总费用"),
    describe: (f, r) =>
      t(
        `A taxi charges $\\$${f}$ for every ride plus $\\$${r}$ per kilometer.`,
        `出租车每次乘车收费 $${f}$ 元，另外每千米收费 $${r}$ 元。`,
      ),
    findV: (n) => t(`A ride cost $\\$${n}$. How many kilometers long was it?`, `某次乘车共花费 $${n}$ 元。这次行驶了多少千米？`),
  },
  {
    v: "n",
    grows: true,
    fixed: [50, 150, 10],
    rate: [15, 45, 5],
    count: [2, 24],
    quantity: t("the total cost, in dollars, of a gym membership for $n$ months", "健身房会员 $n$ 个月的总费用（单位：元）"),
    unit: dollars,
    fixedMeaning: t("the sign-up fee", "入会费"),
    rateMeaning: t("the fee for each month", "每个月的月费"),
    vMeaning: t("the number of months", "会员的月数"),
    totalMeaning: t("the total cost of the membership", "会员的总费用"),
    describe: (f, r) =>
      t(`A gym charges a $\\$${f}$ sign-up fee plus $\\$${r}$ per month.`, `一家健身房收取 $${f}$ 元入会费，另外每月收费 $${r}$ 元。`),
    findV: (n) =>
      t(`Leo has paid $\\$${n}$ in total. For how many months has he been a member?`, `小李一共付了 $${n}$ 元。他当了几个月的会员？`),
  },
  {
    v: "h",
    grows: true,
    fixed: [60, 120, 5],
    rate: [25, 55, 5],
    count: [1, 9],
    quantity: t("the bill, in dollars, for a repair that takes $h$ hours", "一次耗时 $h$ 小时的维修的账单（单位：元）"),
    unit: dollars,
    fixedMeaning: t("the call-out fee charged for every visit", "每次上门收取的出车费"),
    rateMeaning: t("the charge for each hour of work", "每小时工作的收费"),
    vMeaning: t("the number of hours of work", "工作的小时数"),
    totalMeaning: t("the total bill", "账单的总额"),
    describe: (f, r) =>
      t(
        `A plumber charges a $\\$${f}$ call-out fee plus $\\$${r}$ per hour of work.`,
        `一位水管工每次上门收取 $${f}$ 元出车费，另外每工作一小时收费 $${r}$ 元。`,
      ),
    findV: (n) =>
      t(`A repair bill came to $\\$${n}$. How many hours did the repair take?`, `一次维修的账单是 $${n}$ 元。这次维修用了几个小时？`),
  },
  {
    v: "w",
    grows: false,
    fixed: [600, 1500, 50],
    rate: [20, 60, 5],
    count: [2, 9],
    quantity: t("the amount, in dollars, left in Mia's account after $w$ weeks", "$w$ 周后小美账户里剩下的钱（单位：元）"),
    unit: dollars,
    fixedMeaning: t("the amount in the account at the start", "账户里最初的钱数"),
    rateMeaning: t("the amount withdrawn each week", "每周取出的钱数"),
    vMeaning: t("the number of weeks", "周数"),
    totalMeaning: t("the amount left after $w$ weeks", "$w$ 周后剩下的钱数"),
    describe: (f, r) =>
      t(`Mia has $\\$${f}$ in her account and withdraws $\\$${r}$ every week.`, `小美的账户里有 $${f}$ 元，她每周取出 $${r}$ 元。`),
    findV: (n) => t(`After how many weeks will $\\$${n}$ be left?`, `几周后账户里会剩下 $${n}$ 元？`),
  },
  {
    v: "t",
    grows: false,
    fixed: [24, 40, 2],
    rate: [2, 4, 1],
    count: [2, 5],
    quantity: t("the height, in centimeters, of a burning candle $t$ hours after it is lit", "蜡烛点燃 $t$ 小时后的高度（单位：厘米）"),
    unit: t("centimeters", "厘米"),
    fixedMeaning: t("the height of the candle before it is lit", "蜡烛点燃前的高度"),
    rateMeaning: t("how many centimeters the candle burns down each hour", "蜡烛每小时燃烧掉的厘米数"),
    vMeaning: t("the number of hours the candle has burned", "蜡烛燃烧的小时数"),
    totalMeaning: t("the height of the candle after $t$ hours", "$t$ 小时后蜡烛的高度"),
    describe: (f, r) =>
      t(`A candle is $${f}$ cm tall and burns down $${r}$ cm every hour.`, `一支蜡烛高 $${f}$ 厘米，每小时燃烧掉 $${r}$ 厘米。`),
    findV: (n) => t(`After how many hours will the candle be $${n}$ cm tall?`, `几小时后蜡烛高 $${n}$ 厘米？`),
  },
  {
    v: "d",
    grows: true,
    fixed: [10, 40, 1],
    rate: [2, 6, 1],
    count: [3, 20],
    quantity: t(
      "the height, in millimeters, of a seedling $d$ days after it is first measured",
      "幼苗第一次测量后第 $d$ 天的高度（单位：毫米）",
    ),
    unit: t("millimeters", "毫米"),
    fixedMeaning: t("the height of the seedling when it was first measured", "第一次测量时幼苗的高度"),
    rateMeaning: t("how many millimeters the seedling grows each day", "幼苗每天长高的毫米数"),
    vMeaning: t("the number of days since the first measurement", "第一次测量后经过的天数"),
    totalMeaning: t("the height of the seedling after $d$ days", "$d$ 天后幼苗的高度"),
    describe: (f, r) => t(`A seedling is $${f}$ mm tall and grows $${r}$ mm every day.`, `一株幼苗高 $${f}$ 毫米，每天长高 $${r}$ 毫米。`),
    findV: (n) => t(`After how many days will it be $${n}$ mm tall?`, `几天后它高 $${n}$ 毫米？`),
  },
  {
    v: "t",
    grows: false,
    fixed: [400, 900, 20],
    rate: [5, 25, 5],
    count: [3, 15],
    quantity: t(
      "the volume, in liters, of water in a tank $t$ minutes after it starts draining",
      "水箱开始放水 $t$ 分钟后箱中水的体积（单位：升）",
    ),
    unit: t("liters", "升"),
    fixedMeaning: t("the volume of water when draining starts", "开始放水时水的体积"),
    rateMeaning: t("the number of liters drained each minute", "每分钟放出的升数"),
    vMeaning: t("the number of minutes of draining", "放水的分钟数"),
    totalMeaning: t("the volume of water left after $t$ minutes", "$t$ 分钟后剩下的水的体积"),
    describe: (f, r) =>
      t(
        `A tank holds $${f}$ liters of water. It drains at $${r}$ liters per minute.`,
        `一个水箱装有 $${f}$ 升水，以每分钟 $${r}$ 升的速度放水。`,
      ),
    findV: (n) => t(`After how many minutes will $${n}$ liters be left?`, `几分钟后水箱里剩下 $${n}$ 升水？`),
  },
  {
    v: "g",
    grows: true,
    fixed: [15, 40, 5],
    rate: [2, 8, 1],
    count: [2, 15],
    quantity: t("the monthly phone bill, in dollars, when $g$ gigabytes of data are used", "使用 $g$ GB 流量时每月的话费（单位：元）"),
    unit: dollars,
    fixedMeaning: t("the basic monthly charge", "每月的基本费用"),
    rateMeaning: t("the charge per gigabyte of data", "每 GB 流量的费用"),
    vMeaning: t("the number of gigabytes used", "使用的流量（GB）"),
    totalMeaning: t("the total monthly bill", "每月的总话费"),
    describe: (f, r) =>
      t(
        `A phone plan costs $\\$${f}$ per month plus $\\$${r}$ per gigabyte of data.`,
        `一种手机套餐每月基本费用 $${f}$ 元，另外每 GB 流量收费 $${r}$ 元。`,
      ),
    findV: (n) => t(`One month's bill was $\\$${n}$. How many gigabytes were used?`, `某个月的话费是 $${n}$ 元。这个月用了多少 GB 流量？`),
  },
];

/** contextExpression writes the expression of a context: "25m + 40", "40 + 25m" or "1200 - 75w". */
function contextExpression(rng: Rng, c: LinearContext, f: number, r: number): string {
  if (!c.grows) return `${f} - ${r}${c.v}`;
  return rng.bool() ? `${r}${c.v} + ${f}` : `${f} + ${r}${c.v}`;
}

export const interpretingLinearExpressions: TopicDef = {
  id: "interpreting-linear-expressions",
  title: t("Interpreting Linear Expressions", "理解一次式的含义"),
  summary: t(
    "Explain what the terms and coefficients of a linear expression mean in a real situation, and write such expressions.",
    "说明实际情境中一次式的各项和系数的含义，并写出这样的式子。",
  ),
  prerequisites: ["evaluating-expressions", "unit-rates"],
  encompasses: [
    { topic: "evaluating-expressions", weight: 0.3 },
    { topic: "unit-rates", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.HSA.SSE.A.1"],
  knowledgePoints: [
    {
      id: "meaning-of-terms",
      title: t("The meaning of the constant and the coefficient", "常数项与系数的含义"),
      explanation: t(
        "In an expression such as $40 + 25m$ for the cost of $m$ months at a gym:\n\n- the **constant** $40$ does not depend on $m$: it is the starting amount, here a one-time fee;\n- the **coefficient** $25$ multiplies $m$: it is the **rate**, the change for each additional month.\n\nIn $1200 - 75w$, the amount starts at $1200$ and **decreases** by $75$ for each $w$.",
        "在表示健身房 $m$ 个月费用的式子 $40 + 25m$ 中：\n\n- **常数项** $40$ 与 $m$ 无关：它是起始量，这里是一次性的费用；\n- **系数** $25$ 与 $m$ 相乘：它是**变化率**，即每多一个月增加的量。\n\n在 $1200 - 75w$ 中，数量从 $1200$ 开始，$w$ 每增加 $1$ 就**减少** $75$。",
      ),
      generate(rng) {
        const c = rng.pick(linearContexts);
        const f = pickStep(rng, c.fixed);
        const r = pickStep(rng, c.rate);
        const expr = contextExpression(rng, c, f, r);
        const askRate = rng.bool();
        const meanings = [askRate ? c.rateMeaning : c.fixedMeaning, askRate ? c.fixedMeaning : c.rateMeaning, c.totalMeaning, c.vMeaning];
        const order = rng.shuffle([0, 1, 2, 3]);
        const asked = askRate ? r : f;
        return choiceProblem({
          prompt: t(
            `The expression $${expr}$ gives ${c.quantity.en}. What does $${asked}$ represent?`,
            `式子 $${expr}$ 表示${c.quantity["zh-CN"]}。其中 $${asked}$ 表示什么？`,
          ),
          options: order.map((i) => meanings[i]!),
          correct: order.indexOf(0),
          solution: askRate
            ? t(
                `$${r}$ multiplies $${c.v}$, so the total ${c.grows ? "increases" : "decreases"} by $${r}$ for each increase of $1$ in $${c.v}$: it is ${c.rateMeaning.en}.`,
                `$${r}$ 与 $${c.v}$ 相乘，$${c.v}$ 每增加 $1$，总量就${c.grows ? "增加" : "减少"} $${r}$：它是${c.rateMeaning["zh-CN"]}。`,
              )
            : t(
                `$${f}$ does not depend on $${c.v}$; it is the value when $${c.v} = 0$: ${c.fixedMeaning.en}.`,
                `$${f}$ 与 $${c.v}$ 无关，是 $${c.v} = 0$ 时的值：${c.fixedMeaning["zh-CN"]}。`,
              ),
        });
      },
    },
    {
      id: "writing-linear-expressions",
      title: t("Writing a linear expression", "写出一次式"),
      explanation: t(
        "A quantity that starts at an amount and changes by the same amount for each unit is written as **start + rate × number** (or **start − rate × number** when it decreases). A taxi that charges $\\$8$ plus $\\$3$ per kilometer costs\n\n$$8 + 3m \\text{ dollars for } m \\text{ kilometers}.$$",
        "从某个起始量开始、每增加一个单位就变化相同数量的量，写成**起始量 + 变化率 × 数量**（减少时写成**起始量 − 变化率 × 数量**）。出租车起步价 $8$ 元、每千米 $3$ 元，行驶 $m$ 千米的费用是\n\n$$8 + 3m \\text{ 元}.$$",
      ),
      generate(rng) {
        const c = rng.pick(linearContexts);
        const f = pickStep(rng, c.fixed);
        const r = pickStep(rng, c.rate);
        const answer = c.grows ? poly([r, c.v], [f, ""]) : poly([f, ""], [-r, c.v]);
        const wrong = c.grows
          ? [poly([f, c.v], [r, ""]), poly([r + f, c.v]), poly([r, c.v], [-f, ""])]
          : [poly([r, c.v], [-f, ""]), poly([f, ""], [r, c.v]), poly([f, c.v], [-r, ""])];
        return expressionProblem({
          prompt: t(
            `${c.describe(f, r).en} Write an expression for ${c.quantity.en}.`,
            `${c.describe(f, r)["zh-CN"]}写出表示${c.quantity["zh-CN"]}的式子。`,
          ),
          answer,
          wrong,
          solution: t(
            `The starting amount is $${f}$, and each unit of $${c.v}$ ${c.grows ? "adds" : "takes away"} $${r}$: $${answer}$.`,
            `起始量是 $${f}$，$${c.v}$ 每增加 $1$ 就${c.grows ? "增加" : "减少"} $${r}$：$${answer}$。`,
          ),
        });
      },
    },
    {
      id: "effect-of-a-change",
      title: t("The effect of a change", "变化带来的影响"),
      explanation: t(
        "The coefficient is the change in the expression for each increase of $1$ in the variable. So when the variable increases by $k$, the expression changes by $k$ times the coefficient, whatever the starting value. In $40 + 25m$, three more months cost $3 \\cdot 25 = 75$ dollars more.",
        "系数是变量每增加 $1$ 时式子的变化量。所以变量增加 $k$ 时，式子变化系数的 $k$ 倍，与变量原来的值无关。在 $40 + 25m$ 中，多三个月要多花 $3 \\cdot 25 = 75$ 元。",
      ),
      generate(rng) {
        const c = rng.pick(linearContexts);
        const f = pickStep(rng, c.fixed);
        const r = pickStep(rng, c.rate);
        const k = rng.int(2, 6);
        const expr = contextExpression(rng, c, f, r);
        return numberProblem({
          prompt: t(
            `The expression $${expr}$ gives ${c.quantity.en}. By how many ${c.unit.en} does it ${c.grows ? "increase" : "decrease"} when $${c.v}$ increases by $${k}$?`,
            `式子 $${expr}$ 表示${c.quantity["zh-CN"]}。当 $${c.v}$ 增加 $${k}$ 时，它${c.grows ? "增加" : "减少"}多少${c.unit["zh-CN"]}？`,
          ),
          answer: r * k,
          wrong: [k, r + k, f + r * k, r],
          solution: t(
            `Each increase of $1$ in $${c.v}$ changes the expression by $${r}$, so an increase of $${k}$ changes it by $${k} \\cdot ${r} = ${r * k}$.`,
            `$${c.v}$ 每增加 $1$，式子变化 $${r}$，所以增加 $${k}$ 时变化 $${k} \\cdot ${r} = ${r * k}$。`,
          ),
        });
      },
    },
  ],
};

export const modelingWithLinearEquations: TopicDef = {
  id: "modeling-with-linear-equations",
  title: t("Modeling With Linear Equations", "用一次方程建模"),
  summary: t("Write a linear equation for a situation and solve it.", "为实际情境列出一次方程并求解。"),
  prerequisites: ["interpreting-linear-expressions", "equations-with-parentheses"],
  encompasses: [
    { topic: "two-step-equations", weight: 0.6 },
    { topic: "interpreting-linear-expressions", weight: 0.4 },
    { topic: "equations-with-variables-on-both-sides", weight: 0.5 },
  ],
  xp: 18,
  standards: ["CCSS.HSA.CED.A.1"],
  knowledgePoints: [
    {
      id: "start-plus-rate",
      title: t("A starting amount and a rate", "起始量与变化率"),
      explanation: t(
        "To answer a question about a situation:\n\n1. Name the unknown with a variable.\n2. Write an equation that says the same thing as the words.\n3. Solve it, and check that the answer makes sense.\n\nA plumber charges $\\$60$ plus $\\$45$ per hour, and a bill is $\\$285$. With $h$ hours, $60 + 45h = 285$, so $45h = 225$ and $h = 5$ hours.",
        "回答实际情境中的问题时：\n\n1. 用一个变量表示未知量。\n2. 写出与文字意思相同的方程。\n3. 解方程，并检验答案是否合理。\n\n水管工收费 $60$ 元加每小时 $45$ 元，某次账单是 $285$ 元。设工作 $h$ 小时，$60 + 45h = 285$，所以 $45h = 225$，$h = 5$ 小时。",
      ),
      keyPrerequisites: ["two-step-equations", "interpreting-linear-expressions"],
      generate(rng) {
        const c = rng.pick(linearContexts);
        const f = pickStep(rng, c.fixed);
        const r = pickStep(rng, c.rate);
        const n = rng.int(c.count[0], c.count[1]);
        const total = c.grows ? f + r * n : f - r * n;
        const eq = c.grows ? `${f} + ${r}${c.v} = ${total}` : `${f} - ${r}${c.v} = ${total}`;
        return numberProblem({
          prompt: t(`${c.describe(f, r).en} ${c.findV(total).en}`, `${c.describe(f, r)["zh-CN"]}${c.findV(total)["zh-CN"]}`),
          answer: n,
          wrong: c.grows ? [frac(total, r), frac(total + f, r), frac(total, f + r)] : [frac(total, r), frac(f + total, r), -n],
          solution: t(
            `Let $${c.v}$ be ${c.vMeaning.en}. Then ${steps(eq, `${r}${c.v} = ${Math.abs(total - f)}`, `${c.v} = ${n}`)}`,
            `设$${c.v}$为${c.vMeaning["zh-CN"]}。则${steps(eq, `${r}${c.v} = ${Math.abs(total - f)}`, `${c.v} = ${n}`)}`,
          ),
        });
      },
    },
    {
      id: "splitting-a-total",
      title: t("Splitting a total", "分配总量"),
      explanation: t(
        "When a total is split into two parts described in terms of each other, let $x$ be the smaller part and write the other part in terms of $x$. A $50$ m rope is cut into two pieces, one $8$ m longer than the other:\n\n$$x + (x + 8) = 50 \\;\\Rightarrow\\; 2x = 42 \\;\\Rightarrow\\; x = 21.$$\n\nThe pieces are $21$ m and $29$ m.",
        "当总量被分成两部分、且一部分用另一部分来描述时，设较小的部分为 $x$，用 $x$ 表示另一部分。一根 $50$ 米长的绳子剪成两段，一段比另一段长 $8$ 米：\n\n$$x + (x + 8) = 50 \\;\\Rightarrow\\; 2x = 42 \\;\\Rightarrow\\; x = 21.$$\n\n两段分别长 $21$ 米和 $29$ 米。",
      ),
      generate(rng) {
        const money = rng.bool();
        const x = rng.int(5, 40);
        const kind = rng.int(0, 2);
        const k = rng.int(2, 4);
        const d = kind === 1 ? 0 : kind === 0 ? rng.int(1, 15) : rng.bool() ? rng.int(1, 12) : -rng.int(1, 4);
        const kk = kind === 0 ? 1 : k;
        const other = kk * x + d;
        const total = x + other;
        const otherLatex = poly([kk, "x"], [d, ""]);
        const relEn =
          kind === 0
            ? `$${d}$ ${money ? "dollars more than" : "m longer than"}`
            : kind === 1
              ? `$${k}$ times ${money ? "as much as" : "as long as"}`
              : `$${Math.abs(d)}$ ${money ? "dollars" : "m"} ${d > 0 ? "more" : "less"} than $${k}$ times`;
        const relZh =
          kind === 0
            ? money
              ? `比小安多 $${d}$ 元`
              : `比另一段长 $${d}$ 米`
            : kind === 1
              ? money
                ? `是小安的 $${k}$ 倍`
                : `是另一段的 $${k}$ 倍`
              : money
                ? `比小安的 $${k}$ 倍${d > 0 ? "多" : "少"} $${Math.abs(d)}$ 元`
                : `比另一段的 $${k}$ 倍${d > 0 ? "多" : "少"} $${Math.abs(d)}$ 米`;
        const prompt = money
          ? t(
              `Ana and Ben share $\\$${total}$. Ben gets ${relEn} ${kind === 2 ? "Ana's share" : "Ana"}. How many dollars does Ana get?`,
              `小安和小本分 $${total}$ 元，小本分到的钱${relZh}。小安分到多少元？`,
            )
          : t(
              `A rope $${total}$ m long is cut into two pieces. One piece is ${relEn} the other. How long, in meters, is the shorter piece?`,
              `一根长 $${total}$ 米的绳子被剪成两段，其中一段${relZh}。较短的一段长多少米？`,
            );
        const wrong =
          kind === 0
            ? [frac(total, 2), other, total - d]
            : kind === 1
              ? [frac(total, k), other]
              : [frac(total - d, k), frac(total + d, k + 1), other];
        return numberProblem({
          prompt,
          answer: x,
          wrong,
          solution: t(
            `Let $x$ be the smaller part; the other is $${otherLatex}$. ${steps(`x + ${otherLatex.includes(" ") ? `(${otherLatex})` : otherLatex} = ${total}`, `${poly([kk + 1, "x"])} = ${total - d}`, `x = ${x}`)}`,
            `设较小的部分为 $x$，另一部分为 $${otherLatex}$。${steps(`x + ${otherLatex.includes(" ") ? `(${otherLatex})` : otherLatex} = ${total}`, `${poly([kk + 1, "x"])} = ${total - d}`, `x = ${x}`)}`,
          ),
        });
      },
    },
    {
      id: "number-sentences",
      title: t("Translating a sentence about a number", "把关于数的句子译成方程"),
      explanation: t(
        'Translate the sentence piece by piece: "$5$ more than $3$ times a number" is $3n + 5$; "$13$ less than $6$ times the number" is $6n - 13$; "is" is $=$.\n\n$$3n + 5 = 6n - 13 \\;\\Rightarrow\\; 18 = 3n \\;\\Rightarrow\\; n = 6.$$\n\nNote the order: "$13$ less than $6n$" is $6n - 13$, not $13 - 6n$.',
        "逐段翻译：“一个数的 $3$ 倍加上 $5$”是 $3n + 5$；“这个数的 $6$ 倍减去 $13$”是 $6n - 13$；“等于”是 $=$。\n\n$$3n + 5 = 6n - 13 \\;\\Rightarrow\\; 18 = 3n \\;\\Rightarrow\\; n = 6.$$\n\n注意顺序：“$6n$ 减去 $13$”是 $6n - 13$，不是 $13 - 6n$。",
      ),
      keyPrerequisites: ["equations-with-variables-on-both-sides"],
      generate(rng) {
        const a = rng.int(2, 9);
        let c = rng.int(2, 9);
        if (c === a) c = a === 9 ? 2 : a + 1;
        const n = rng.nonZero(-10, 15);
        const b = rng.nonZero(-20, 20);
        const d = c * n - a * n - b;
        const leftEn = `$${Math.abs(b)}$ ${b > 0 ? "more" : "less"} than $${a}$ times a number`;
        const rightEn = d === 0 ? `$${c}$ times the number` : `$${Math.abs(d)}$ ${d > 0 ? "less" : "more"} than $${c}$ times the number`;
        const leftZh = `一个数的 $${a}$ 倍${b > 0 ? "加上" : "减去"} $${Math.abs(b)}$`;
        const rightZh = d === 0 ? `这个数的 $${c}$ 倍` : `这个数的 $${c}$ 倍${d > 0 ? "减去" : "加上"} $${Math.abs(d)}$`;
        const eq = `${linear(a, b, "n")} = ${linear(c, -d, "n")}`;
        return numberProblem({
          prompt: t(
            `${leftEn[0]!.toUpperCase()}${leftEn.slice(1)} is ${rightEn}. Find the number.`,
            `${leftZh}，等于${rightZh}。求这个数。`,
          ),
          answer: n,
          wrong: [-n, frac(b - d, c - a), frac(b + d, a + c)],
          solution: t(
            `Let $n$ be the number: ${steps(eq, `${num(b + d)} = ${poly([c - a, "n"])}`, `n = ${num(n)}`)}`,
            `设这个数为 $n$：${steps(eq, `${num(b + d)} = ${poly([c - a, "n"])}`, `n = ${num(n)}`)}`,
          ),
        });
      },
    },
    {
      id: "comparing-two-plans",
      title: t("When two plans cost the same", "两种方案费用相同"),
      explanation: t(
        "To find when two linear quantities are equal, set their expressions equal. Plan A costs $20 + 8d$ and plan B costs $50 + 5d$ for $d$ days:\n\n$$20 + 8d = 50 + 5d \\;\\Rightarrow\\; 3d = 30 \\;\\Rightarrow\\; d = 10.$$\n\nFor fewer than $10$ days plan A is cheaper; for more, plan B.",
        "要求两个一次量何时相等，就令它们的式子相等。方案甲 $d$ 天费用 $20 + 8d$，方案乙 $50 + 5d$：\n\n$$20 + 8d = 50 + 5d \\;\\Rightarrow\\; 3d = 30 \\;\\Rightarrow\\; d = 10.$$\n\n少于 $10$ 天时方案甲便宜，多于 $10$ 天时方案乙便宜。",
      ),
      generate(rng) {
        const plans = [
          { v: "d", en: "day", ens: "days", zh: "天", what: t("Two car rental companies", "两家租车公司") },
          { v: "c", en: "class", ens: "classes", zh: "节课", what: t("Two dance studios", "两家舞蹈室") },
          { v: "g", en: "gigabyte", ens: "gigabytes", zh: "GB", what: t("Two phone plans", "两种手机套餐") },
          { v: "h", en: "hour", ens: "hours", zh: "小时", what: t("Two bike rental shops", "两家自行车租赁店") },
        ] as const;
        const p = rng.pick(plans);
        const r2 = rng.int(2, 12);
        const r1 = r2 + rng.int(1, 8);
        const n = rng.int(2, 20);
        const f1 = 5 * rng.int(0, 10);
        const f2 = f1 + (r1 - r2) * n;
        return numberProblem({
          prompt: t(
            `${p.what.en} charge differently: the first charges $\\$${f1}$ plus $\\$${r1}$ per ${p.en}, the second $\\$${f2}$ plus $\\$${r2}$ per ${p.en}. For how many ${p.ens} do they cost the same?`,
            `${p.what["zh-CN"]}的收费不同：第一家收 $${f1}$ 元，另外每${p.zh}收 $${r1}$ 元；第二家收 $${f2}$ 元，另外每${p.zh}收 $${r2}$ 元。多少${p.zh}时两者费用相同？`,
          ),
          answer: n,
          wrong: [frac(f2 - f1, r1 + r2), frac(f2 + f1, r1 - r2), frac(f2 - f1, r1)],
          solution: t(
            `Set the two costs equal: ${steps(`${poly([f1, ""], [r1, p.v])} = ${f2} + ${r2}${p.v}`, `${poly([r1 - r2, p.v])} = ${f2 - f1}`, `${p.v} = ${n}`)}`,
            `令两者费用相等：${steps(`${poly([f1, ""], [r1, p.v])} = ${f2} + ${r2}${p.v}`, `${poly([r1 - r2, p.v])} = ${f2 - f1}`, `${p.v} = ${n}`)}`,
          ),
        });
      },
    },
  ],
};

/** IntegerKind is the kind of consecutive integers: step 1, or step 2 starting from an even or an odd number. */
const integerKinds = [
  { step: 1, parity: -1, en: "consecutive integers", zh: "连续整数" },
  { step: 2, parity: 0, en: "consecutive even integers", zh: "连续偶数" },
  { step: 2, parity: 1, en: "consecutive odd integers", zh: "连续奇数" },
] as const;

const ends = (k: number) =>
  k === 2 ? { small: t("smaller", "较小"), large: t("larger", "较大") } : { small: t("smallest", "最小"), large: t("largest", "最大") };

export const consecutiveIntegerProblems: TopicDef = {
  id: "consecutive-integer-problems",
  title: t("Consecutive Integer Problems", "连续整数问题"),
  summary: t(
    "Write and solve equations about consecutive, consecutive even and consecutive odd integers.",
    "列方程解决连续整数、连续偶数和连续奇数问题。",
  ),
  prerequisites: ["modeling-with-linear-equations"],
  encompasses: [
    { topic: "modeling-with-linear-equations", weight: 0.4 },
    { topic: "two-step-equations", weight: 0.5 },
    { topic: "combining-like-terms", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.CED.A.1"],
  knowledgePoints: [
    {
      id: "consecutive-integers",
      title: t("Consecutive integers", "连续整数"),
      explanation: t(
        "**Consecutive integers** follow each other: if the first is $n$, the next ones are $n + 1$, $n + 2$, … . If three consecutive integers add up to $54$,\n\n$$n + (n + 1) + (n + 2) = 54 \\;\\Rightarrow\\; 3n + 3 = 54 \\;\\Rightarrow\\; n = 17,$$\n\nso the integers are $17$, $18$ and $19$.",
        "**连续整数**一个接一个：如果第一个是 $n$，后面的依次是 $n + 1$、$n + 2$、……。如果三个连续整数的和是 $54$，\n\n$$n + (n + 1) + (n + 2) = 54 \\;\\Rightarrow\\; 3n + 3 = 54 \\;\\Rightarrow\\; n = 17,$$\n\n所以这三个整数是 $17$、$18$、$19$。",
      ),
      generate(rng) {
        const k = rng.int(2, 5);
        const n = rng.int(-30, 60);
        const tri = (k * (k - 1)) / 2;
        const sum = k * n + tri;
        const largest = rng.bool();
        const answer = largest ? n + k - 1 : n;
        const e = ends(k);
        const terms = Array.from({ length: k }, (_, i) => (i === 0 ? "n" : `(n + ${i})`)).join(" + ");
        return numberProblem({
          prompt: t(
            `The sum of $${k}$ consecutive integers is $${sum}$. What is the ${largest ? e.large.en : e.small.en} of them?`,
            `$${k}$ 个连续整数的和是 $${sum}$。其中${largest ? e.large["zh-CN"] : e.small["zh-CN"]}的数是多少？`,
          ),
          answer,
          wrong: [largest ? n : n + k - 1, frac(sum, k), largest ? n + k : n - 1],
          solution: t(
            `Let the smallest be $n$: ${steps(`${terms} = ${num(sum)}`, `${k}n + ${tri} = ${num(sum)}`, `n = ${num(n)}`)}The integers run from $${num(n)}$ to $${num(n + k - 1)}$.`,
            `设最小的数为 $n$：${steps(`${terms} = ${num(sum)}`, `${k}n + ${tri} = ${num(sum)}`, `n = ${num(n)}`)}这些整数从 $${num(n)}$ 到 $${num(n + k - 1)}$。`,
          ),
        });
      },
    },
    {
      id: "consecutive-even-and-odd",
      title: t("Consecutive even and odd integers", "连续偶数与连续奇数"),
      explanation: t(
        "Consecutive **even** integers, such as $8, 10, 12$, differ by $2$, and so do consecutive **odd** integers, such as $7, 9, 11$. Either way they are $n$, $n + 2$, $n + 4$, …; whether $n$ is even or odd decides which. If three consecutive odd integers add up to $81$,\n\n$$n + (n + 2) + (n + 4) = 81 \\;\\Rightarrow\\; 3n + 6 = 81 \\;\\Rightarrow\\; n = 25.$$",
        "连续**偶数**（如 $8, 10, 12$）相差 $2$，连续**奇数**（如 $7, 9, 11$）也相差 $2$。两种情况都写成 $n$、$n + 2$、$n + 4$、……；$n$ 是偶数还是奇数决定了是哪一种。如果三个连续奇数的和是 $81$，\n\n$$n + (n + 2) + (n + 4) = 81 \\;\\Rightarrow\\; 3n + 6 = 81 \\;\\Rightarrow\\; n = 25.$$",
      ),
      generate(rng) {
        const kind = integerKinds[rng.int(1, 2)]!;
        const k = rng.int(2, 4);
        const n = 2 * rng.int(-15, 30) + kind.parity;
        const tri = k * (k - 1);
        const sum = k * n + tri;
        const largest = rng.bool();
        const answer = largest ? n + 2 * (k - 1) : n;
        const stepOne = frac(sum - tri / 2, k);
        const e = ends(k);
        const terms = Array.from({ length: k }, (_, i) => (i === 0 ? "n" : `(n + ${2 * i})`)).join(" + ");
        return numberProblem({
          prompt: t(
            `The sum of $${k}$ ${kind.en} is $${sum}$. What is the ${largest ? e.large.en : e.small.en} of them?`,
            `$${k}$ 个${kind.zh}的和是 $${sum}$。其中${largest ? e.large["zh-CN"] : e.small["zh-CN"]}的数是多少？`,
          ),
          answer,
          wrong: [largest ? n : n + 2 * (k - 1), largest ? stepOne.add(Q.of(k - 1)) : stepOne, frac(sum, k)],
          solution: t(
            `Let the smallest be $n$; the others are $2$, $4$, … more: ${steps(`${terms} = ${num(sum)}`, `${k}n + ${tri} = ${num(sum)}`, `n = ${num(n)}`)}The ${largest ? e.large.en : e.small.en} is $${num(answer)}$.`,
            `设最小的数为 $n$，其余的依次多 $2$、$4$、……：${steps(`${terms} = ${num(sum)}`, `${k}n + ${tri} = ${num(sum)}`, `n = ${num(n)}`)}${largest ? e.large["zh-CN"] : e.small["zh-CN"]}的数是 $${num(answer)}$。`,
          ),
        });
      },
    },
    {
      id: "relations-between-consecutive-integers",
      title: t("Relations between consecutive integers", "连续整数之间的关系"),
      explanation: t(
        'Other conditions are translated the same way. For three consecutive even integers $n$, $n + 2$, $n + 4$: "three times the smallest is $10$ more than the largest" is\n\n$$3n = (n + 4) + 10 \\;\\Rightarrow\\; 2n = 14 \\;\\Rightarrow\\; n = 7.$$\n\nBut $7$ is odd, so no three consecutive even integers have this property; always check the answer against the conditions.',
        "其他条件也用同样的方法翻译。三个连续偶数 $n$、$n + 2$、$n + 4$ 中，“最小数的 $3$ 倍比最大数多 $10$”是\n\n$$3n = (n + 4) + 10 \\;\\Rightarrow\\; 2n = 14 \\;\\Rightarrow\\; n = 7.$$\n\n但 $7$ 是奇数，所以没有满足这个条件的三个连续偶数。求出答案后一定要对照条件检验。",
      ),
      generate(rng) {
        const kind = rng.pick(integerKinds);
        const k = rng.int(2, 3);
        const s = kind.step;
        const n = kind.parity < 0 ? rng.int(1, 40) : 2 * rng.int(1, 20) + kind.parity;
        const last = n + (k - 1) * s;
        const e = ends(k);
        const otherStep = s === 1 ? 2 : 1;
        if (rng.bool()) {
          const p = rng.int(2, 5);
          const c = p * n - last;
          const relEn = c === 0 ? "equal to" : `$${Math.abs(c)}$ ${c > 0 ? "more" : "less"} than`;
          const relZh = c === 0 ? "等于" : `比${e.large["zh-CN"]}的数${c > 0 ? "多" : "少"} $${Math.abs(c)}$`;
          return numberProblem({
            prompt: t(
              `For $${k}$ ${kind.en}, $${p}$ times the ${e.small.en} is ${relEn} the ${e.large.en}. Find the ${e.small.en}.`,
              `有 $${k}$ 个${kind.zh}，${e.small["zh-CN"]}的数的 $${p}$ 倍${c === 0 ? `等于${e.large["zh-CN"]}的数` : relZh}。求${e.small["zh-CN"]}的数。`,
            ),
            answer: n,
            wrong: [last, frac(c + (k - 1) * otherStep, p - 1), frac(c, p - 1)],
            solution: t(
              `Let the ${e.small.en} be $n$; the ${e.large.en} is $n + ${(k - 1) * s}$. ${steps(`${p}n = n + ${(k - 1) * s} ${c >= 0 ? "+" : "-"} ${Math.abs(c)}`, `${p - 1 === 1 ? "" : p - 1}n = ${(k - 1) * s + c}`, `n = ${n}`)}`,
              `设${e.small["zh-CN"]}的数为 $n$，${e.large["zh-CN"]}的数为 $n + ${(k - 1) * s}$。${steps(`${p}n = n + ${(k - 1) * s} ${c >= 0 ? "+" : "-"} ${Math.abs(c)}`, `${p - 1 === 1 ? "" : p - 1}n = ${(k - 1) * s + c}`, `n = ${n}`)}`,
            ),
          });
        }
        const p = rng.int(2, 4);
        const total = n + p * last;
        return numberProblem({
          prompt: t(
            `For $${k}$ ${kind.en}, the sum of the ${e.small.en} and $${p}$ times the ${e.large.en} is $${total}$. Find the ${e.small.en}.`,
            `有 $${k}$ 个${kind.zh}，${e.small["zh-CN"]}的数与${e.large["zh-CN"]}的数的 $${p}$ 倍之和是 $${total}$。求${e.small["zh-CN"]}的数。`,
          ),
          answer: n,
          wrong: [last, frac(total - (k - 1) * s, p + 1), frac(total - p * (k - 1) * otherStep, p + 1)],
          solution: t(
            `Let the ${e.small.en} be $n$; the ${e.large.en} is $n + ${(k - 1) * s}$. ${steps(`n + ${p}(n + ${(k - 1) * s}) = ${total}`, `${p + 1}n + ${p * (k - 1) * s} = ${total}`, `n = ${n}`)}`,
            `设${e.small["zh-CN"]}的数为 $n$，${e.large["zh-CN"]}的数为 $n + ${(k - 1) * s}$。${steps(`n + ${p}(n + ${(k - 1) * s}) = ${total}`, `${p + 1}n + ${p * (k - 1) * s} = ${total}`, `n = ${n}`)}`,
          ),
        });
      },
    },
  ],
};

/** movers travel at r = 6k km/h for k in the given range, so that times in minutes give terminating decimals. */
const movers = [
  { en: "A runner", zh: "一位跑步者", k: [1, 3] },
  { en: "A cyclist", zh: "一位骑车人", k: [2, 6] },
  { en: "A bus", zh: "一辆公交车", k: [5, 12] },
  { en: "A train", zh: "一列火车", k: [8, 15] },
] as const;

const minuteChoices = [10, 15, 20, 25, 30, 40, 45, 50, 75, 90] as const;

/** harmonicPairs are pairs of different speeds whose harmonic mean 2ab/(a+b) is an integer. */
const harmonicPairs: readonly (readonly [number, number])[] = (() => {
  const out: [number, number][] = [];
  for (let a = 10; a <= 90; a += 5) {
    for (let b = a + 5; b <= 90; b += 5) {
      if ((2 * a * b) % (a + b) === 0) out.push([a, b]);
    }
  }
  return out;
})();

/** boatSpeeds are still-water speeds b and current speeds c with (b² − c²)/b an integer. */
const boatSpeeds: readonly (readonly [number, number])[] = (() => {
  const out: [number, number][] = [];
  for (let b = 6; b <= 30; b++) {
    for (let c = 1; c < b / 2; c++) {
      if ((c * c) % b === 0) out.push([b, c]);
    }
  }
  return out;
})();

const halves = (rng: Rng, min: number, max: number) => frac(rng.int(2 * min, 2 * max), 2);

export const speedDistanceTime: TopicDef = {
  id: "speed-distance-time",
  title: t("Speed, Distance and Time Problems", "速度、路程与时间问题"),
  summary: t(
    "Use $d = rt$ with consistent units, trips in two parts and average speed.",
    "使用单位一致的 $d = rt$，解决分两段的行程和平均速度问题。",
  ),
  prerequisites: ["modeling-with-linear-equations", "adding-and-subtracting-fractions"],
  encompasses: [
    { topic: "unit-rates", weight: 0.4 },
    { topic: "modeling-with-linear-equations", weight: 0.3 },
    { topic: "equations-with-parentheses", weight: 0.3 },
    { topic: "adding-and-subtracting-fractions", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.CED.A.1", "CCSS.HSN.Q.A.1"],
  knowledgePoints: [
    {
      id: "distance-rate-time",
      title: t("Distance, rate and time", "路程、速度与时间"),
      explanation: t(
        "Distance equals rate times time: $d = rt$, so also $r = \\frac{d}{t}$ and $t = \\frac{d}{r}$. The units must match: with a speed in kilometers per hour, the time must be in **hours**. $40$ minutes is $\\frac{40}{60} = \\frac{2}{3}$ hour, so at $27$ km/h a cyclist covers\n\n$$27 \\cdot \\frac{2}{3} = 18 \\text{ km}.$$",
        "路程等于速度乘以时间：$d = rt$，所以 $r = \\frac{d}{t}$，$t = \\frac{d}{r}$。单位必须一致：速度以千米每小时为单位时，时间必须以**小时**为单位。$40$ 分钟是 $\\frac{40}{60} = \\frac{2}{3}$ 小时，所以以 $27$ 千米/时的速度骑行，路程是\n\n$$27 \\cdot \\frac{2}{3} = 18 \\text{ 千米}.$$",
      ),
      keyPrerequisites: ["unit-rates"],
      generate(rng) {
        const m = rng.pick(movers);
        const k = rng.int(m.k[0], m.k[1]);
        const r = 6 * k;
        const minutes = rng.pick(minuteChoices);
        const d = frac(k * minutes, 10);
        const hours = frac(minutes, 60);
        const kind = rng.int(0, 2);
        if (kind === 0) {
          return numberProblem({
            prompt: t(
              `${m.en} travels $${dec(d)}$ km in $${minutes}$ minutes. What is its average speed in kilometers per hour?`,
              `${m.zh}在 $${minutes}$ 分钟内行进了 $${dec(d)}$ 千米。它的平均速度是每小时多少千米？`,
            ),
            answer: r,
            wrong: [frac(r, 60), 10 * k, d.mul(Q.of(minutes))],
            solution: t(
              `$${minutes}$ minutes is $${hours.toLatex()}$ hour, so ${steps(`r = \\frac{d}{t} = ${dec(d)} \\div ${hours.toLatex()} = ${r}`)}`,
              `$${minutes}$ 分钟是 $${hours.toLatex()}$ 小时，所以${steps(`r = \\frac{d}{t} = ${dec(d)} \\div ${hours.toLatex()} = ${r}`)}`,
            ),
          });
        }
        if (kind === 1) {
          return numberProblem({
            prompt: t(
              `${m.en} travels at $${r}$ km/h. How many minutes does it take to cover $${dec(d)}$ km?`,
              `${m.zh}的速度是 $${r}$ 千米/时。行进 $${dec(d)}$ 千米需要多少分钟？`,
            ),
            answer: minutes,
            wrong: [hours, frac(5 * minutes, 3), frac(3600, minutes)],
            solution: t(
              `${steps(`t = \\frac{d}{r} = \\frac{${dec(d)}}{${r}} = ${hours.toLatex()} \\text{ hour}`)}which is $${hours.toLatex()} \\cdot 60 = ${minutes}$ minutes.`,
              `${steps(`t = \\frac{d}{r} = \\frac{${dec(d)}}{${r}} = ${hours.toLatex()} \\text{ 小时}`)}即 $${hours.toLatex()} \\cdot 60 = ${minutes}$ 分钟。`,
            ),
          });
        }
        return numberProblem({
          prompt: t(
            `${m.en} travels at $${r}$ km/h for $${minutes}$ minutes. How many kilometers does it cover?`,
            `${m.zh}以 $${r}$ 千米/时的速度行进 $${minutes}$ 分钟。它行进了多少千米？`,
          ),
          answer: d,
          wrong: [r * minutes, frac(r * minutes, 100), frac(r, minutes)],
          solution: t(
            `$${minutes}$ minutes is $${hours.toLatex()}$ hour, so ${steps(`d = rt = ${r} \\cdot ${hours.toLatex()} = ${dec(d)}`)}`,
            `$${minutes}$ 分钟是 $${hours.toLatex()}$ 小时，所以${steps(`d = rt = ${r} \\cdot ${hours.toLatex()} = ${dec(d)}`)}`,
          ),
        });
      },
    },
    {
      id: "trips-in-two-parts",
      title: t("Trips in two parts", "分两段的行程"),
      explanation: t(
        "When a trip has two parts at different speeds, let $t$ be the time of one part; the other part takes the rest of the total time. Sam drives $260$ km in $4$ hours, partly at $80$ km/h and partly at $50$ km/h:\n\n$$80t + 50(4 - t) = 260 \\;\\Rightarrow\\; 30t + 200 = 260 \\;\\Rightarrow\\; t = 2.$$",
        "当行程分两段、速度不同时，设其中一段用时为 $t$，另一段用时为总时间减去 $t$。小山用 $4$ 小时开了 $260$ 千米，一部分速度是 $80$ 千米/时，其余是 $50$ 千米/时：\n\n$$80t + 50(4 - t) = 260 \\;\\Rightarrow\\; 30t + 200 = 260 \\;\\Rightarrow\\; t = 2.$$",
      ),
      generate(rng) {
        const r1 = 10 * rng.int(4, 12);
        let r2 = 10 * rng.int(3, 10);
        if (r2 === r1) r2 = r1 - 10;
        const t1 = halves(rng, 1, 4);
        const t2 = halves(rng, 1, 4);
        const total = t1.add(t2);
        const dist = t1.mul(Q.of(r1)).add(t2.mul(Q.of(r2)));
        return numberProblem({
          prompt: t(
            `Sam drove $${dec(dist)}$ km in $${dec(total)}$ hours. He drove at $${r1}$ km/h on the highway and at $${r2}$ km/h on the rest of the trip. How many hours did he spend on the highway?`,
            `小山用 $${dec(total)}$ 小时开了 $${dec(dist)}$ 千米。他在高速公路上的速度是 $${r1}$ 千米/时，其余路段的速度是 $${r2}$ 千米/时。他在高速公路上开了多少小时？`,
          ),
          answer: t1,
          wrong: [t2, dist.div(Q.of(r1 + r2)), total.div(Q.of(2))],
          solution: t(
            `Let $t$ be the hours on the highway; the rest took $${dec(total)} - t$ hours. ${steps(`${r1}t + ${r2}(${dec(total)} - t) = ${dec(dist)}`, `${poly([r1 - r2, "t"])} = ${dec(dist.sub(total.mul(Q.of(r2))))}`, `t = ${dec(t1)}`)}`,
            `设在高速公路上开了 $t$ 小时，其余路段用了 $${dec(total)} - t$ 小时。${steps(`${r1}t + ${r2}(${dec(total)} - t) = ${dec(dist)}`, `${poly([r1 - r2, "t"])} = ${dec(dist.sub(total.mul(Q.of(r2))))}`, `t = ${dec(t1)}`)}`,
          ),
        });
      },
    },
    {
      id: "average-speed",
      title: t("Average speed", "平均速度"),
      explanation: t(
        "Average speed is **total distance divided by total time**, not the average of the speeds. Driving $120$ km at $40$ km/h ($3$ hours) and back at $60$ km/h ($2$ hours) covers $240$ km in $5$ hours:\n\n$$\\frac{240}{5} = 48 \\text{ km/h}, \\text{ not } \\frac{40 + 60}{2} = 50.$$\n\nThe slower part takes longer, so it counts for more.",
        "平均速度是**总路程除以总时间**，而不是各速度的平均数。以 $40$ 千米/时开 $120$ 千米（$3$ 小时），再以 $60$ 千米/时开回来（$2$ 小时），$5$ 小时共行驶 $240$ 千米：\n\n$$\\frac{240}{5} = 48 \\text{ 千米/时}，\\text{而不是 } \\frac{40 + 60}{2} = 50.$$\n\n较慢的一段用时更长，所以所占的分量更大。",
      ),
      generate(rng) {
        if (rng.bool()) {
          const [a, b] = rng.pick(harmonicPairs);
          const [r1, r2] = rng.bool() ? [a, b] : [b, a];
          const avg = frac(2 * r1 * r2, r1 + r2);
          return numberProblem({
            prompt: t(
              `Lena drives from her home to a lake at $${r1}$ km/h and back along the same road at $${r2}$ km/h. What is her average speed for the round trip, in km/h?`,
              `小莲从家开车去湖边，速度是 $${r1}$ 千米/时，沿原路返回的速度是 $${r2}$ 千米/时。往返的平均速度是多少千米/时？`,
            ),
            answer: avg,
            wrong: [frac(r1 + r2, 2), frac(r1 * r2, r1 + r2)],
            solution: t(
              `Let $d$ be the one-way distance. The total time is $\\frac{d}{${r1}} + \\frac{d}{${r2}} = \\frac{${r1 + r2}d}{${r1 * r2}}$, so ${steps(`\\text{average speed} = \\frac{2d}{\\frac{${r1 + r2}d}{${r1 * r2}}} = \\frac{${2 * r1 * r2}}{${r1 + r2}} = ${avg.toLatex()}`)}`,
              `设单程距离为 $d$。总时间是 $\\frac{d}{${r1}} + \\frac{d}{${r2}} = \\frac{${r1 + r2}d}{${r1 * r2}}$，所以${steps(`\\text{平均速度} = \\frac{2d}{\\frac{${r1 + r2}d}{${r1 * r2}}} = \\frac{${2 * r1 * r2}}{${r1 + r2}} = ${avg.toLatex()}`)}`,
            ),
          });
        }
        const r1 = 5 * rng.int(4, 18);
        let r2 = 5 * rng.int(4, 18);
        if (r2 === r1) r2 = r1 + 5;
        const t1 = rng.int(1, 4);
        let t2 = rng.int(1, 4);
        if (t2 === t1) t2 = t1 === 4 ? 1 : t1 + 1;
        const dist = r1 * t1 + r2 * t2;
        const avg = frac(dist, t1 + t2);
        return numberProblem({
          prompt: t(
            `A truck drives for $${t1}$ hour${t1 === 1 ? "" : "s"} at $${r1}$ km/h, then for $${t2}$ hour${t2 === 1 ? "" : "s"} at $${r2}$ km/h. What is its average speed for the whole trip, in km/h?`,
            `一辆卡车以 $${r1}$ 千米/时的速度行驶 $${t1}$ 小时，再以 $${r2}$ 千米/时的速度行驶 $${t2}$ 小时。全程的平均速度是多少千米/时？`,
          ),
          answer: avg,
          wrong: [frac(r1 + r2, 2), frac(dist, 2)],
          solution: t(
            `The total distance is $${r1} \\cdot ${t1} + ${r2} \\cdot ${t2} = ${dist}$ km in $${t1 + t2}$ hours: ${steps(`\\frac{${dist}}{${t1 + t2}} = ${avg.toLatex()}`)}`,
            `总路程是 $${r1} \\cdot ${t1} + ${r2} \\cdot ${t2} = ${dist}$ 千米，总时间 $${t1 + t2}$ 小时：${steps(`\\frac{${dist}}{${t1 + t2}} = ${avg.toLatex()}`)}`,
          ),
        });
      },
    },
  ],
};

export const furtherSpeedDistanceTime: TopicDef = {
  id: "further-speed-distance-time",
  title: t("Further Speed, Distance and Time Problems", "速度、路程与时间问题（进阶）"),
  summary: t(
    "Solve problems about two movers approaching or catching up with each other, and round trips at different speeds.",
    "解决两个物体相向而行、追及以及不同速度往返的问题。",
  ),
  prerequisites: ["speed-distance-time"],
  encompasses: [
    { topic: "speed-distance-time", weight: 0.6 },
    { topic: "equations-with-parentheses", weight: 0.3 },
    { topic: "adding-and-subtracting-fractions", weight: 0.2 },
  ],
  xp: 18,
  standards: ["CCSS.HSA.CED.A.1"],
  knowledgePoints: [
    {
      id: "moving-toward-each-other",
      title: t("Moving toward each other", "相向而行"),
      explanation: t(
        "Two movers that head toward each other close the gap at the **sum** of their speeds. Towns $210$ km apart, cars at $60$ and $45$ km/h: after $t$ hours they have covered $60t + 45t$ together, so\n\n$$105t = 210 \\;\\Rightarrow\\; t = 2 \\text{ hours}.$$\n\nThe same holds for two movers leaving one place in opposite directions: the distance between them grows at the sum of the speeds.",
        "两个物体相向而行时，它们之间的距离以速度之**和**缩短。两城相距 $210$ 千米，两辆车速度分别是 $60$ 和 $45$ 千米/时：$t$ 小时后它们一共行驶了 $60t + 45t$，所以\n\n$$105t = 210 \\;\\Rightarrow\\; t = 2 \\text{ 小时}.$$\n\n两个物体从同一地点向相反方向出发时也一样：它们之间的距离以速度之和增加。",
      ),
      generate(rng) {
        const r1 = 5 * rng.int(2, 16);
        let r2 = 5 * rng.int(2, 16);
        if (r2 === r1) r2 = r1 + 5;
        const time = halves(rng, 1, 4);
        const dist = time.mul(Q.of(r1 + r2));
        const kind = rng.int(0, 2);
        if (kind === 2) {
          const where = time.mul(Q.of(r1));
          return numberProblem({
            prompt: t(
              `Towns A and B are $${dec(dist)}$ km apart. A car leaves A for B at $${r1}$ km/h, and at the same time a truck leaves B for A at $${r2}$ km/h. How far from A, in km, do they meet?`,
              `甲、乙两城相距 $${dec(dist)}$ 千米。一辆小汽车以 $${r1}$ 千米/时的速度从甲城开往乙城，同时一辆卡车以 $${r2}$ 千米/时的速度从乙城开往甲城。它们在离甲城多少千米处相遇？`,
            ),
            answer: where,
            wrong: [dist.div(Q.of(2)), time.mul(Q.of(r2)), time],
            solution: t(
              `They close the gap at $${r1} + ${r2} = ${r1 + r2}$ km/h, so they meet after $${dec(dist)} \\div ${r1 + r2} = ${dec(time)}$ hours. The car has then gone $${r1} \\cdot ${dec(time)} = ${dec(where)}$ km.`,
              `它们之间的距离以 $${r1} + ${r2} = ${r1 + r2}$ 千米/时缩短，所以 $${dec(dist)} \\div ${r1 + r2} = ${dec(time)}$ 小时后相遇。这时小汽车行驶了 $${r1} \\cdot ${dec(time)} = ${dec(where)}$ 千米。`,
            ),
          });
        }
        const toward = kind === 0;
        return numberProblem({
          prompt: toward
            ? t(
                `Two cyclists are $${dec(dist)}$ km apart and ride toward each other, one at $${r1}$ km/h and the other at $${r2}$ km/h. After how many hours do they meet?`,
                `两位骑车人相距 $${dec(dist)}$ 千米，相向而行，速度分别是 $${r1}$ 千米/时和 $${r2}$ 千米/时。多少小时后他们相遇？`,
              )
            : t(
                `Two trains leave the same station at the same time in opposite directions, one at $${r1}$ km/h and the other at $${r2}$ km/h. After how many hours are they $${dec(dist)}$ km apart?`,
                `两列火车同时从同一车站向相反方向出发，速度分别是 $${r1}$ 千米/时和 $${r2}$ 千米/时。多少小时后它们相距 $${dec(dist)}$ 千米？`,
              ),
          answer: time,
          wrong: [dist.div(Q.of(Math.abs(r1 - r2))), time.mul(Q.of(2)), dist.div(Q.of(r1))],
          solution: t(
            `The distance between them changes at $${r1} + ${r2} = ${r1 + r2}$ km/h: ${steps(`${r1 + r2}t = ${dec(dist)}`, `t = ${dec(time)}`)}`,
            `它们之间的距离以 $${r1} + ${r2} = ${r1 + r2}$ 千米/时变化：${steps(`${r1 + r2}t = ${dec(dist)}`, `t = ${dec(time)}`)}`,
          ),
        });
      },
    },
    {
      id: "catching-up",
      title: t("Catching up", "追及问题"),
      explanation: t(
        "When a faster mover follows a slower one that had a head start, it catches up when both have covered the **same distance**. A truck leaves at $50$ km/h; $2$ hours later a car follows at $75$ km/h. If the car drives $t$ hours, the truck has driven $t + 2$ hours:\n\n$$75t = 50(t + 2) \\;\\Rightarrow\\; 25t = 100 \\;\\Rightarrow\\; t = 4.$$",
        "较快的物体追赶先出发的较慢物体时，两者走过的**路程相同**时追上。一辆卡车以 $50$ 千米/时出发，$2$ 小时后一辆小汽车以 $75$ 千米/时沿同一路线追赶。若小汽车开了 $t$ 小时，卡车就开了 $t + 2$ 小时：\n\n$$75t = 50(t + 2) \\;\\Rightarrow\\; 25t = 100 \\;\\Rightarrow\\; t = 4.$$",
      ),
      generate(rng) {
        const time = rng.int(1, 6);
        const gap = 5 * rng.int(1, 4);
        const head = rng.pick([1, 2, 3].filter((h) => (gap * time) % h === 0));
        const r1 = (gap * time) / head;
        const r2 = r1 + gap;
        const walking = r1 <= 15;
        return numberProblem({
          prompt: walking
            ? t(
                `Mo leaves home on foot at $${r1}$ km/h. $${head}$ hour${head === 1 ? "" : "s"} later his sister follows the same route by bike at $${r2}$ km/h. How many hours after she leaves does she catch up with him?`,
                `小默以 $${r1}$ 千米/时的速度从家步行出发。$${head}$ 小时后，他姐姐骑自行车以 $${r2}$ 千米/时的速度沿同一路线追赶。姐姐出发后多少小时追上他？`,
              )
            : t(
                `A truck leaves a depot at $${r1}$ km/h. $${head}$ hour${head === 1 ? "" : "s"} later a car leaves the same depot along the same road at $${r2}$ km/h. How many hours after the car leaves does it catch up with the truck?`,
                `一辆卡车以 $${r1}$ 千米/时的速度从车场出发。$${head}$ 小时后，一辆小汽车以 $${r2}$ 千米/时的速度从同一车场沿同一条路出发。小汽车出发后多少小时追上卡车？`,
              ),
          answer: time,
          wrong: [frac(r1 * head, r1 + r2), time + head, frac(r2 * head, gap)],
          solution: t(
            `Let $t$ be the hours after the second one leaves; the first has then traveled $t + ${head}$ hours. Equal distances: ${steps(`${r2}t = ${r1}(t + ${head})`, `${gap}t = ${r1 * head}`, `t = ${time}`)}`,
            `设后出发者出发后经过 $t$ 小时，先出发者已行进 $t + ${head}$ 小时。路程相等：${steps(`${r2}t = ${r1}(t + ${head})`, `${gap}t = ${r1 * head}`, `t = ${time}`)}`,
          ),
        });
      },
    },
    {
      id: "round-trips",
      title: t("Round trips at different speeds", "不同速度的往返"),
      explanation: t(
        "On a round trip the distance is the same both ways but the times differ. If the one-way distance is $d$, the total time is $\\frac{d}{r_1} + \\frac{d}{r_2}$. Going at $30$ km/h and returning at $20$ km/h takes $5$ hours in all:\n\n$$\\frac{d}{30} + \\frac{d}{20} = 5 \\;\\Rightarrow\\; 2d + 3d = 300 \\;\\Rightarrow\\; d = 60 \\text{ km}.$$\n\nA boat going downstream moves at its own speed **plus** the current; upstream, its speed **minus** the current.",
        "往返时两个方向的路程相同，但用时不同。设单程距离为 $d$，总时间是 $\\frac{d}{r_1} + \\frac{d}{r_2}$。去时 $30$ 千米/时、回时 $20$ 千米/时，共用 $5$ 小时：\n\n$$\\frac{d}{30} + \\frac{d}{20} = 5 \\;\\Rightarrow\\; 2d + 3d = 300 \\;\\Rightarrow\\; d = 60 \\text{ 千米}.$$\n\n船顺流而下的速度是船速**加**水速；逆流而上的速度是船速**减**水速。",
      ),
      generate(rng) {
        const time = halves(rng, 2, 6);
        if (rng.bool()) {
          const [a, b] = rng.pick(harmonicPairs);
          const [r1, r2] = rng.bool() ? [a, b] : [b, a];
          const d = time.mul(Q.of(r1 * r2)).div(Q.of(r1 + r2));
          return numberProblem({
            prompt: t(
              `A courier rides to a village at $${r1}$ km/h and returns along the same road at $${r2}$ km/h. The round trip takes $${dec(time)}$ hours. How far, in km, is the village?`,
              `一位快递员以 $${r1}$ 千米/时的速度骑车去一个村子，再以 $${r2}$ 千米/时的速度沿原路返回，往返共用 $${dec(time)}$ 小时。村子有多远（千米）？`,
            ),
            answer: d,
            wrong: [time.mul(Q.of(r1 + r2)).div(Q.of(4)), d.mul(Q.of(2)), time.mul(Q.of(r1 + r2)).div(Q.of(2))],
            solution: t(
              `Let $d$ be the distance: ${steps(`\\frac{d}{${r1}} + \\frac{d}{${r2}} = ${dec(time)}`, `\\frac{${r1 + r2}d}{${r1 * r2}} = ${dec(time)}`, `d = ${d.toLatex()}`)}`,
              `设距离为 $d$：${steps(`\\frac{d}{${r1}} + \\frac{d}{${r2}} = ${dec(time)}`, `\\frac{${r1 + r2}d}{${r1 * r2}} = ${dec(time)}`, `d = ${d.toLatex()}`)}`,
            ),
          });
        }
        const [b, c] = rng.pick(boatSpeeds);
        const down = b + c;
        const up = b - c;
        const d = time.mul(Q.of(down * up)).div(Q.of(2 * b));
        return numberProblem({
          prompt: t(
            `A boat moves at $${b}$ km/h in still water, and the river's current flows at $${c}$ km/h. The boat goes downstream to a dock and comes back upstream in $${dec(time)}$ hours in all. How far, in km, is the dock?`,
            `一艘船在静水中的速度是 $${b}$ 千米/时，河水的流速是 $${c}$ 千米/时。船顺流而下到一个码头，再逆流返回，共用 $${dec(time)}$ 小时。码头有多远（千米）？`,
          ),
          answer: d,
          wrong: [time.mul(Q.of(b)).div(Q.of(2)), d.mul(Q.of(2)), time.mul(Q.of(down)).div(Q.of(2))],
          solution: t(
            `Downstream the boat moves at $${b} + ${c} = ${down}$ km/h, upstream at $${b} - ${c} = ${up}$ km/h. Let $d$ be the distance: ${steps(`\\frac{d}{${down}} + \\frac{d}{${up}} = ${dec(time)}`, `d = ${d.toLatex()}`)}`,
            `顺流速度是 $${b} + ${c} = ${down}$ 千米/时，逆流速度是 $${b} - ${c} = ${up}$ 千米/时。设距离为 $d$：${steps(`\\frac{d}{${down}} + \\frac{d}{${up}} = ${dec(time)}`, `d = ${d.toLatex()}`)}`,
          ),
        });
      },
    },
  ],
};

const workers = [
  { a: t("Ana", "安娜"), b: t("Ben", "本"), task: t("paint a fence", "粉刷一道篱笆") },
  { a: t("Pipe A", "甲管"), b: t("pipe B", "乙管"), task: t("fill a pool", "注满一个水池") },
  { a: t("Printer A", "甲打印机"), b: t("printer B", "乙打印机"), task: t("print a batch of flyers", "打印一批传单") },
  { a: t("Mei", "小美"), b: t("Raj", "小杰"), task: t("mow a lawn", "修剪一片草坪") },
] as const;

/** sharedTimes are pairs of different solo times a, b whose time together ab/(a+b) is a whole or half number of hours. */
const sharedTimes: readonly (readonly [number, number])[] = (() => {
  const out: [number, number][] = [];
  for (let a = 2; a <= 30; a++) {
    for (let b = 2; b <= 30; b++) {
      if (a !== b && (2 * a * b) % (a + b) === 0) out.push([a, b]);
    }
  }
  return out;
})();

export const workProblems: TopicDef = {
  id: "work-problems",
  title: t("Work Problems", "工作问题"),
  summary: t(
    "Add rates of work to solve problems about people or machines working together.",
    "把工作效率相加，解决多人或多台机器合作的问题。",
  ),
  prerequisites: ["modeling-with-linear-equations", "adding-and-subtracting-fractions"],
  encompasses: [
    { topic: "adding-and-subtracting-fractions", weight: 0.5 },
    { topic: "modeling-with-linear-equations", weight: 0.3 },
  ],
  xp: 18,
  standards: ["CCSS.HSA.CED.A.1"],
  knowledgePoints: [
    {
      id: "working-together",
      title: t("Working together", "合作完成"),
      explanation: t(
        "Add **rates of work**, not times. If Ana paints a fence in $3$ hours, she paints $\\frac{1}{3}$ of it per hour; if Ben takes $6$ hours, he paints $\\frac{1}{6}$ per hour. Together they paint $\\frac{1}{3} + \\frac{1}{6} = \\frac{1}{2}$ per hour, so in $t$ hours:\n\n$$\\frac{t}{3} + \\frac{t}{6} = 1 \\;\\Rightarrow\\; 2t + t = 6 \\;\\Rightarrow\\; t = 2 \\text{ hours}.$$\n\nThe time together is shorter than either time alone; it is not their average.",
        "相加的是**工作效率**，而不是时间。安娜 $3$ 小时刷完篱笆，每小时刷 $\\frac{1}{3}$；本要 $6$ 小时，每小时刷 $\\frac{1}{6}$。两人合作每小时刷 $\\frac{1}{3} + \\frac{1}{6} = \\frac{1}{2}$，所以 $t$ 小时后：\n\n$$\\frac{t}{3} + \\frac{t}{6} = 1 \\;\\Rightarrow\\; 2t + t = 6 \\;\\Rightarrow\\; t = 2 \\text{ 小时}.$$\n\n合作的时间比任何一方单独做的时间都短，不是两者的平均数。",
      ),
      keyPrerequisites: ["adding-and-subtracting-fractions"],
      generate(rng) {
        const w = rng.pick(workers);
        const a = rng.int(2, 12);
        let b = rng.int(2, 15);
        if (b === a) b = a + rng.int(1, 3);
        const together = frac(a * b, a + b);
        return numberProblem({
          prompt: t(
            `${w.a.en} can ${w.task.en} alone in $${a}$ hours, and ${w.b.en} can do it alone in $${b}$ hours. How many hours does it take them working together?`,
            `${w.a["zh-CN"]}单独${w.task["zh-CN"]}需要 $${a}$ 小时，${w.b["zh-CN"]}单独完成需要 $${b}$ 小时。两者合作需要多少小时？`,
          ),
          answer: together,
          wrong: [frac(a + b, 2), a + b, frac(a + b, a * b)],
          solution: t(
            `Together they do $\\frac{1}{${a}} + \\frac{1}{${b}}$ of the job per hour: ${steps(`\\frac{t}{${a}} + \\frac{t}{${b}} = 1`, `${b}t + ${a}t = ${a * b}`, `t = ${together.toLatex()}`)}`,
            `合作每小时完成 $\\frac{1}{${a}} + \\frac{1}{${b}}$：${steps(`\\frac{t}{${a}} + \\frac{t}{${b}} = 1`, `${b}t + ${a}t = ${a * b}`, `t = ${together.toLatex()}`)}`,
          ),
        });
      },
    },
    {
      id: "finding-one-rate",
      title: t("Finding one worker's time", "求其中一方的时间"),
      explanation: t(
        "If the time together and one worker's time are known, the other rate is the **difference** of the rates. Together $4$ hours, Ana alone $6$ hours: Ben does $\\frac{1}{4} - \\frac{1}{6} = \\frac{1}{12}$ per hour, so he needs $12$ hours alone. As an equation in Ben's time $b$:\n\n$$\\frac{4}{6} + \\frac{4}{b} = 1 \\;\\Rightarrow\\; \\frac{4}{b} = \\frac{1}{3} \\;\\Rightarrow\\; b = 12.$$",
        "已知合作时间和其中一方的时间，另一方的效率是两个效率之**差**。合作 $4$ 小时，安娜单独 $6$ 小时：本每小时完成 $\\frac{1}{4} - \\frac{1}{6} = \\frac{1}{12}$，所以他单独要 $12$ 小时。用本的时间 $b$ 列方程：\n\n$$\\frac{4}{6} + \\frac{4}{b} = 1 \\;\\Rightarrow\\; \\frac{4}{b} = \\frac{1}{3} \\;\\Rightarrow\\; b = 12.$$",
      ),
      generate(rng) {
        const w = rng.pick(workers);
        const [a, b] = rng.pick(sharedTimes);
        const together = frac(a * b, a + b);
        return numberProblem({
          prompt: t(
            `Working together, ${w.a.en} and ${w.b.en} ${w.task.en} in $${dec(together)}$ hours. ${w.a.en} alone takes $${a}$ hours. How many hours does ${w.b.en} take alone?`,
            `${w.a["zh-CN"]}和${w.b["zh-CN"]}合作 $${dec(together)}$ 小时能${w.task["zh-CN"]}。${w.a["zh-CN"]}单独完成需要 $${a}$ 小时。${w.b["zh-CN"]}单独完成需要多少小时？`,
          ),
          answer: b,
          wrong: [together.mul(Q.of(2)).sub(Q.of(a)), Q.of(a).sub(together), together.mul(Q.of(a)).div(together.add(Q.of(a)))],
          solution: t(
            `Let $b$ be the time alone: ${steps(`\\frac{${dec(together)}}{${a}} + \\frac{${dec(together)}}{b} = 1`, `\\frac{${dec(together)}}{b} = ${Q.one.sub(together.div(Q.of(a))).toLatex()}`, `b = ${b}`)}`,
            `设单独完成需要 $b$ 小时：${steps(`\\frac{${dec(together)}}{${a}} + \\frac{${dec(together)}}{b} = 1`, `\\frac{${dec(together)}}{b} = ${Q.one.sub(together.div(Q.of(a))).toLatex()}`, `b = ${b}`)}`,
          ),
        });
      },
    },
    {
      id: "filling-and-draining",
      title: t("Filling and draining", "注水与放水"),
      explanation: t(
        "Work that undoes the job has a **negative** rate. A pipe fills a tank in $3$ hours ($+\\frac{1}{3}$ per hour) while a drain empties it in $5$ hours ($-\\frac{1}{5}$ per hour). With both open:\n\n$$\\frac{t}{3} - \\frac{t}{5} = 1 \\;\\Rightarrow\\; 5t - 3t = 15 \\;\\Rightarrow\\; t = 7.5 \\text{ hours}.$$",
        "起相反作用的工作效率是**负数**。一根水管 $3$ 小时注满水箱（每小时 $+\\frac{1}{3}$），一个排水口 $5$ 小时放空水箱（每小时 $-\\frac{1}{5}$）。两者同时打开时：\n\n$$\\frac{t}{3} - \\frac{t}{5} = 1 \\;\\Rightarrow\\; 5t - 3t = 15 \\;\\Rightarrow\\; t = 7.5 \\text{ 小时}.$$",
      ),
      generate(rng) {
        const a = rng.int(2, 10);
        const b = a + rng.int(1, 10);
        const time = frac(a * b, b - a);
        return numberProblem({
          prompt: t(
            `An inlet pipe fills an empty tank in $${a}$ hours. A drain empties a full tank in $${b}$ hours. If the tank is empty and both are open, how many hours does it take to fill the tank?`,
            `一根进水管 $${a}$ 小时能注满空水箱，一个排水口 $${b}$ 小时能放空满水箱。水箱是空的，如果两者同时打开，需要多少小时注满水箱？`,
          ),
          answer: time,
          wrong: [frac(a * b, a + b), b - a, frac(a + b, 2)],
          solution: t(
            `The tank fills at $\\frac{1}{${a}} - \\frac{1}{${b}}$ per hour: ${steps(`\\frac{t}{${a}} - \\frac{t}{${b}} = 1`, `${b}t - ${a}t = ${a * b}`, `t = ${time.toLatex()}`)}`,
            `水箱每小时注入 $\\frac{1}{${a}} - \\frac{1}{${b}}$：${steps(`\\frac{t}{${a}} - \\frac{t}{${b}} = 1`, `${b}t - ${a}t = ${a * b}`, `t = ${time.toLatex()}`)}`,
          ),
        });
      },
    },
    {
      id: "starting-alone",
      title: t("Starting alone, finishing together", "先单独做，再合作完成"),
      explanation: t(
        "Add up the fractions of the job each worker completes. Ana ($6$ hours alone) works $2$ hours, then Ben ($3$ hours alone) joins. If they then work together for $t$ hours, Ana works $2 + t$ hours in all:\n\n$$\\frac{2 + t}{6} + \\frac{t}{3} = 1 \\;\\Rightarrow\\; 2 + t + 2t = 6 \\;\\Rightarrow\\; t = \\frac{4}{3} \\text{ hours}.$$",
        "把每一方完成的工作量（占全部的几分之几）加起来。安娜（单独 $6$ 小时）先做 $2$ 小时，然后本（单独 $3$ 小时）加入。若之后两人合作 $t$ 小时，安娜一共做了 $2 + t$ 小时：\n\n$$\\frac{2 + t}{6} + \\frac{t}{3} = 1 \\;\\Rightarrow\\; 2 + t + 2t = 6 \\;\\Rightarrow\\; t = \\frac{4}{3} \\text{ 小时}.$$",
      ),
      generate(rng) {
        const w = rng.pick(workers);
        const a = rng.int(4, 12);
        const h = rng.int(1, a - 2);
        const b = rng.int(2, 12);
        const time = frac((a - h) * b, a + b);
        return numberProblem({
          prompt: t(
            `${w.a.en} can ${w.task.en} alone in $${a}$ hours, and ${w.b.en} can do it alone in $${b}$ hours. ${w.a.en} works alone for $${h}$ hour${h === 1 ? "" : "s"}, then ${w.b.en} joins in. How many more hours does it take to finish?`,
            `${w.a["zh-CN"]}单独${w.task["zh-CN"]}需要 $${a}$ 小时，${w.b["zh-CN"]}单独完成需要 $${b}$ 小时。${w.a["zh-CN"]}先单独做 $${h}$ 小时，然后${w.b["zh-CN"]}加入。还需要多少小时才能完成？`,
          ),
          answer: time,
          wrong: [frac(a * b, a + b), frac(a * b, a + b).sub(Q.of(h)), a - h],
          solution: t(
            `Let $t$ be the hours together; ${w.a.en} works $${h} + t$ hours in all: ${steps(`\\frac{${h} + t}{${a}} + \\frac{t}{${b}} = 1`, `${b}(${h} + t) + ${a}t = ${a * b}`, `${a + b}t = ${(a - h) * b}`, `t = ${time.toLatex()}`)}`,
            `设合作 $t$ 小时，${w.a["zh-CN"]}一共做了 $${h} + t$ 小时：${steps(`\\frac{${h} + t}{${a}} + \\frac{t}{${b}} = 1`, `${b}(${h} + t) + ${a}t = ${a * b}`, `${a + b}t = ${(a - h) * b}`, `t = ${time.toLatex()}`)}`,
          ),
        });
      },
    },
  ],
};

const solutions = [
  { en: "acid solution", zh: "酸溶液", pure: t("pure acid", "纯酸") },
  { en: "alcohol solution", zh: "酒精溶液", pure: t("pure alcohol", "纯酒精") },
  { en: "bleach solution", zh: "漂白剂溶液", pure: t("pure bleach", "纯漂白剂") },
  { en: "antifreeze solution", zh: "防冻液", pure: t("pure antifreeze", "纯防冻剂") },
] as const;

/** mixTwo are [p, q, r, V, x]: x liters at p% added to V liters at q% give r%. */
const mixTwo: readonly (readonly [number, number, number, number, number])[] = (() => {
  const out: [number, number, number, number, number][] = [];
  for (let p = 5; p <= 60; p += 5) {
    for (let q = p + 10; q <= 90; q += 5) {
      for (let r = p + 5; r < q; r += 5) {
        for (let v = 10; v <= 60; v += 10) {
          const x = (v * (q - r)) / (r - p);
          if (Number.isInteger(x) && x <= 120 && x !== v) out.push([p, q, r, v, x]);
        }
      }
    }
  }
  return out;
})();

/** mixTotal are [p, q, r, T, x]: x liters at p% and T − x liters at q% make T liters at r%. */
const mixTotal: readonly (readonly [number, number, number, number, number])[] = (() => {
  const out: [number, number, number, number, number][] = [];
  for (let p = 5; p <= 60; p += 5) {
    for (let q = p + 10; q <= 90; q += 5) {
      for (let r = p + 5; r < q; r += 5) {
        for (let total = 10; total <= 100; total += 10) {
          const x = (total * (q - r)) / (q - p);
          if (Number.isInteger(x) && 2 * x !== total) out.push([p, q, r, total, x]);
        }
      }
    }
  }
  return out;
})();

/** dilutions are [p, r, V, x]: x liters of water added to V liters at p% give r%. */
const dilutions: readonly (readonly [number, number, number, number])[] = (() => {
  const out: [number, number, number, number][] = [];
  for (let p = 10; p <= 60; p += 5) {
    for (let r = 5; r < p; r += 5) {
      for (let v = 10; v <= 60; v += 5) {
        const x = (v * (p - r)) / r;
        if (Number.isInteger(x) && x <= 150) out.push([p, r, v, x]);
      }
    }
  }
  return out;
})();

/** concentrations are [p, r, V, x]: x liters of pure substance added to V liters at p% give r%. */
const concentrations: readonly (readonly [number, number, number, number])[] = (() => {
  const out: [number, number, number, number][] = [];
  for (let p = 5; p <= 50; p += 5) {
    for (let r = p + 5; r <= 80; r += 5) {
      for (let v = 10; v <= 60; v += 5) {
        const x = (v * (r - p)) / (100 - r);
        if (Number.isInteger(x) && x <= 60) out.push([p, r, v, x]);
      }
    }
  }
  return out;
})();

export const mixtureProblems: TopicDef = {
  id: "mixture-problems",
  title: t("Mixture Problems", "混合问题"),
  summary: t(
    "Solve problems about mixing solutions of different concentrations and mixing items of different values.",
    "解决不同浓度溶液混合以及不同单价物品混合的问题。",
  ),
  prerequisites: ["modeling-with-linear-equations", "percent-of-a-number"],
  encompasses: [
    { topic: "equations-with-parentheses", weight: 0.5 },
    { topic: "percent-of-a-number", weight: 0.4 },
    { topic: "modeling-with-linear-equations", weight: 0.4 },
  ],
  xp: 18,
  standards: ["CCSS.HSA.CED.A.1"],
  knowledgePoints: [
    {
      id: "mixing-two-solutions",
      title: t("Mixing two solutions", "两种溶液混合"),
      explanation: t(
        "Track the **amount of the pure substance**: in $V$ liters of a $p\\%$ solution there are $\\frac{p}{100}V$ liters of it. When solutions are mixed, the amounts add, and so do the volumes. Adding $x$ liters of $10\\%$ acid to $20$ liters of $40\\%$ acid to get $25\\%$ acid:\n\n$$0.10x + 0.40 \\cdot 20 = 0.25(x + 20) \\;\\Rightarrow\\; 10x + 800 = 25x + 500 \\;\\Rightarrow\\; x = 20.$$\n\nThe concentrations do not simply average unless the volumes are equal.",
        "追踪**纯物质的量**：$V$ 升浓度为 $p\\%$ 的溶液中含有 $\\frac{p}{100}V$ 升纯物质。溶液混合时，纯物质的量相加，体积也相加。把 $x$ 升 $10\\%$ 的酸溶液加入 $20$ 升 $40\\%$ 的酸溶液，得到 $25\\%$ 的酸溶液：\n\n$$0.10x + 0.40 \\cdot 20 = 0.25(x + 20) \\;\\Rightarrow\\; 10x + 800 = 25x + 500 \\;\\Rightarrow\\; x = 20.$$\n\n除非体积相等，浓度并不是简单地取平均数。",
      ),
      keyPrerequisites: ["percent-of-a-number"],
      generate(rng) {
        const s = rng.pick(solutions);
        if (rng.bool()) {
          const [p, q, r, v, x] = rng.pick(mixTwo);
          return numberProblem({
            prompt: t(
              `How many liters of a $${p}\\%$ ${s.en} must be added to $${v}$ liters of a $${q}\\%$ ${s.en} to make a $${r}\\%$ ${s.en}?`,
              `需要在 $${v}$ 升浓度为 $${q}\\%$ 的${s.zh}中加入多少升浓度为 $${p}\\%$ 的${s.zh}，才能得到浓度为 $${r}\\%$ 的${s.zh}？`,
            ),
            answer: x,
            wrong: [frac(v * (r - p), q - r), v, frac(v * (q - r), q - p)],
            solution: t(
              `Let $x$ be the liters added. The pure substance before and after mixing is the same: ${steps(`${p}x + ${q} \\cdot ${v} = ${r}(x + ${v})`, `${q * v - r * v} = ${r - p}x`, `x = ${x}`)}`,
              `设加入 $x$ 升。混合前后纯物质的量相同：${steps(`${p}x + ${q} \\cdot ${v} = ${r}(x + ${v})`, `${q * v - r * v} = ${r - p}x`, `x = ${x}`)}`,
            ),
          });
        }
        const [p, q, r, total, x] = rng.pick(mixTotal);
        return numberProblem({
          prompt: t(
            `A chemist mixes a $${p}\\%$ ${s.en} with a $${q}\\%$ ${s.en} to make $${total}$ liters of a $${r}\\%$ ${s.en}. How many liters of the $${p}\\%$ ${s.en} does she use?`,
            `一位化学家把浓度为 $${p}\\%$ 和 $${q}\\%$ 的${s.zh}混合，配成 $${total}$ 升浓度为 $${r}\\%$ 的${s.zh}。她用了多少升浓度为 $${p}\\%$ 的${s.zh}？`,
          ),
          answer: x,
          wrong: [total - x, frac(total, 2), frac(total * (r - p), q - r)],
          solution: t(
            `Let $x$ be the liters at $${p}\\%$; the rest, $${total} - x$ liters, is at $${q}\\%$: ${steps(`${p}x + ${q}(${total} - x) = ${r} \\cdot ${total}`, `${q * total - r * total} = ${q - p}x`, `x = ${x}`)}`,
            `设浓度为 $${p}\\%$ 的用了 $x$ 升，其余 $${total} - x$ 升浓度为 $${q}\\%$：${steps(`${p}x + ${q}(${total} - x) = ${r} \\cdot ${total}`, `${q * total - r * total} = ${q - p}x`, `x = ${x}`)}`,
          ),
        });
      },
    },
    {
      id: "adding-water-or-pure-substance",
      title: t("Adding water or pure substance", "加水或加纯物质"),
      explanation: t(
        "Water is a $0\\%$ solution and a pure substance is a $100\\%$ solution. Adding $x$ liters of water to $30$ liters of $20\\%$ salt solution to dilute it to $12\\%$: the salt stays the same, so\n\n$$0.20 \\cdot 30 = 0.12(30 + x) \\;\\Rightarrow\\; 600 = 360 + 12x \\;\\Rightarrow\\; x = 20.$$",
        "水是浓度为 $0\\%$ 的溶液，纯物质是浓度为 $100\\%$ 的溶液。在 $30$ 升浓度为 $20\\%$ 的盐水中加入 $x$ 升水，稀释为 $12\\%$：盐的量不变，所以\n\n$$0.20 \\cdot 30 = 0.12(30 + x) \\;\\Rightarrow\\; 600 = 360 + 12x \\;\\Rightarrow\\; x = 20.$$",
      ),
      generate(rng) {
        const s = rng.pick(solutions);
        if (rng.bool()) {
          const [p, r, v, x] = rng.pick(dilutions);
          return numberProblem({
            prompt: t(
              `How many liters of water must be added to $${v}$ liters of a $${p}\\%$ ${s.en} to dilute it to $${r}\\%$?`,
              `需要在 $${v}$ 升浓度为 $${p}\\%$ 的${s.zh}中加入多少升水，才能把浓度稀释为 $${r}\\%$？`,
            ),
            answer: x,
            wrong: [frac(v * p, r), frac(v * (p - r), 100), frac(v * (p - r), p)],
            solution: t(
              `The pure substance does not change: ${steps(`${p} \\cdot ${v} = ${r}(${v} + x)`, `${p * v - r * v} = ${r}x`, `x = ${x}`)}`,
              `纯物质的量不变：${steps(`${p} \\cdot ${v} = ${r}(${v} + x)`, `${p * v - r * v} = ${r}x`, `x = ${x}`)}`,
            ),
          });
        }
        const [p, r, v, x] = rng.pick(concentrations);
        return numberProblem({
          prompt: t(
            `How many liters of ${s.pure.en} must be added to $${v}$ liters of a $${p}\\%$ ${s.en} to raise the concentration to $${r}\\%$?`,
            `需要在 $${v}$ 升浓度为 $${p}\\%$ 的${s.zh}中加入多少升${s.pure["zh-CN"]}，才能把浓度提高到 $${r}\\%$？`,
          ),
          answer: x,
          wrong: [frac(v * (r - p), 100), frac(v * (r - p), 100 - p), frac(v * (r - p), r)],
          solution: t(
            `Pure substance is $100\\%$: ${steps(`${p} \\cdot ${v} + 100x = ${r}(${v} + x)`, `${100 - r}x = ${r * v - p * v}`, `x = ${x}`)}`,
            `纯物质的浓度是 $100\\%$：${steps(`${p} \\cdot ${v} + 100x = ${r}(${v} + x)`, `${100 - r}x = ${r * v - p * v}`, `x = ${x}`)}`,
          ),
        });
      },
    },
    {
      id: "value-mixtures",
      title: t("Mixtures of values", "不同单价的混合"),
      explanation: t(
        "The same idea works with money: the values of the parts add up to the total value. $200$ tickets were sold, adult tickets at $\\$12$ and child tickets at $\\$5$, for $\\$1814$. With $a$ adult tickets there are $200 - a$ child tickets:\n\n$$12a + 5(200 - a) = 1814 \\;\\Rightarrow\\; 7a + 1000 = 1814 \\;\\Rightarrow\\; a = 116.$$",
        "同样的想法也适用于钱：各部分的价值之和等于总价值。售出 $200$ 张票，成人票每张 $12$ 元，儿童票每张 $5$ 元，共收入 $1814$ 元。设成人票 $a$ 张，儿童票就是 $200 - a$ 张：\n\n$$12a + 5(200 - a) = 1814 \\;\\Rightarrow\\; 7a + 1000 = 1814 \\;\\Rightarrow\\; a = 116.$$",
      ),
      keyPrerequisites: ["equations-with-parentheses"],
      generate(rng) {
        if (rng.bool()) {
          const adult = rng.int(8, 20);
          const child = rng.int(3, adult - 2);
          const total = 10 * rng.int(5, 30);
          const a = rng.int(10, total - 10);
          const revenue = adult * a + child * (total - a);
          return numberProblem({
            prompt: t(
              `A theater sold $${total}$ tickets: adult tickets at $\\$${adult}$ and child tickets at $\\$${child}$. The tickets brought in $\\$${revenue}$. How many adult tickets were sold?`,
              `一家剧院卖出 $${total}$ 张票，成人票每张 $${adult}$ 元，儿童票每张 $${child}$ 元，共收入 $${revenue}$ 元。卖出了多少张成人票？`,
            ),
            answer: a,
            wrong: [total - a, frac(revenue, adult), frac(revenue - child * total, adult + child)],
            solution: t(
              `Let $a$ be the adult tickets; there are $${total} - a$ child tickets. ${steps(`${adult}a + ${child}(${total} - a) = ${revenue}`, `${adult - child}a = ${revenue - child * total}`, `a = ${a}`)}`,
              `设成人票 $a$ 张，儿童票 $${total} - a$ 张。${steps(`${adult}a + ${child}(${total} - a) = ${revenue}`, `${adult - child}a = ${revenue - child * total}`, `a = ${a}`)}`,
            ),
          });
        }
        const n = rng.int(10, 40);
        const q = rng.int(1, n - 1);
        const cents = 25 * q + 10 * (n - q);
        const value = frac(cents, 100);
        return numberProblem({
          prompt: t(
            `A jar holds $${n}$ coins, all dimes ($10$¢) and quarters ($25$¢), worth $\\$${dec(value)}$ in all. How many quarters are there?`,
            `一个罐子里有 $${n}$ 枚硬币，都是 $10$ 美分和 $25$ 美分的，共值 $${dec(value)}$ 美元。$25$ 美分的硬币有多少枚？`,
          ),
          answer: q,
          wrong: [n - q, frac(cents, 25), frac(cents - 10 * n, 35)],
          solution: t(
            `Work in cents. Let $q$ be the quarters; there are $${n} - q$ dimes. ${steps(`25q + 10(${n} - q) = ${cents}`, `15q = ${cents - 10 * n}`, `q = ${q}`)}`,
            `以美分为单位。设 $25$ 美分的硬币有 $q$ 枚，$10$ 美分的有 $${n} - q$ 枚。${steps(`25q + 10(${n} - q) = ${cents}`, `15q = ${cents - 10 * n}`, `q = ${q}`)}`,
          ),
        });
      },
    },
  ],
};

/** linearEquationTopics are the topics on linear equations with letters and on modeling with linear equations, in teaching order. */
export const linearEquationTopics: readonly TopicDef[] = [
  linearEquationsWithUnknownCoefficients,
  unknownCoefficientsByFactoring,
  linearInequalitiesWithParameters,
  manyVariableEquations,
  rearrangingFormulas,
  interpretingLinearExpressions,
  modelingWithLinearEquations,
  consecutiveIntegerProblems,
  speedDistanceTime,
  furtherSpeedDistanceTime,
  workProblems,
  mixtureProblems,
];
