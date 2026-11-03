import type { Figure, KnowledgePointDef, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, type PlaneMark, plane, Q, relSymbol } from "@ga/subject-math";

import {
  choiceProblem,
  expressionProblem,
  type InequalityOp,
  inequalityLatex,
  inequalityProblem,
  numberProblem,
  yesNo,
} from "../problems.ts";
import { numberLineFigure, ray } from "./compound-inequalities.ts";
import { mathText, pickChoice } from "./grade-4-fractions.ts";

// 6th Grade Math: one-step equations, inequalities and their graphs, and equations in two variables.

/** ccss is a helper for writing Common Core codes. */
const ccss = (...codes: string[]) => codes.map((c) => `CCSS.${c}`);

/** topic builds a TopicDef with the common fields filled in. */
function topic(
  id: string,
  title: Text,
  summary: Text,
  prerequisites: string[],
  standards: string[],
  knowledgePoints: KnowledgePointDef[],
): TopicDef {
  return { id, title, summary, prerequisites, encompasses: [], xp: 10, standards: ccss(...standards), knowledgePoints };
}

/** pickVar draws a variable letter. */
const pickVar = (rng: Rng) => rng.pick(["x", "y", "n", "m", "p", "k", "t", "w"] as const);

/** show writes a positive rational number as an integer, a decimal or a fraction, following how it was drawn. */
const show = (q: Q, decimal: boolean) => (decimal ? dec(q) : q.toLatex());

/** smallFraction draws a fraction with a denominator from 2 to 8 that is not an integer. */
function smallFraction(rng: Rng): Q {
  const d = rng.int(2, 8);
  let n: number;
  do n = rng.int(1, 3 * d);
  while (n % d === 0);
  return Q.of(n, d);
}

/** tenths draws a decimal with one decimal place between lo and hi that is not an integer. */
function tenths(rng: Rng, lo: number, hi: number): Q {
  let n: number;
  do n = rng.int(lo * 10, hi * 10);
  while (n % 10 === 0);
  return Q.of(n, 10);
}

// ---------------------------------------------------------------------------
// Solutions of equations

export const identifyingSolutionsToLinearEquations = topic(
  "identifying-solutions-to-linear-equations",
  t("Identifying Solutions to Linear Equations", "判断一次方程的解"),
  t(
    "An equation says that two expressions are equal. A solution is a value of the variable that makes the equation true. To check a value, substitute it and see whether both sides are equal: x = 4 is a solution of 3x + 2 = 14 because 3 × 4 + 2 = 14, but x = 5 is not, because 3 × 5 + 2 = 17.",
    "方程表示两个式子相等。使方程成立的变量的值叫做方程的解。检验一个值时，把它代入方程，看两边是否相等：x = 4 是 3x + 2 = 14 的解，因为 3 × 4 + 2 = 14；x = 5 不是，因为 3 × 5 + 2 = 17。",
  ),
  ["evaluating-linear-expressions"],
  ["6.EE.B.5"],
  [
    {
      id: "checking-a-value",
      title: t("Checking a value", "检验一个值"),
      explanation: t(
        "A solution makes the equation true. To check a value, substitute it for the variable and work out both sides; it is a solution only if the two sides are equal.\n\nIs $n = 6$ a solution of $4n - 5 = 19$? $4 \\times 6 - 5 = 24 - 5 = 19$, so yes.",
        "方程的解能使等式成立。检验一个值时，把它代入方程，分别算出两边；两边相等，它才是解。\n\n$n = 6$ 是 $4n - 5 = 19$ 的解吗？$4 \\times 6 - 5 = 24 - 5 = 19$，所以是。",
      ),
      generate(rng) {
        const v = pickVar(rng);
        const a = rng.int(2, 9);
        const b = rng.int(1, 20);
        const s = rng.int(1, 12);
        const minus = rng.bool() && a * s > b;
        const c = minus ? a * s - b : a * s + b;
        const test = rng.bool() ? s : s + rng.pick([-1, 1, 2]);
        if (test <= 0) return this.generate(rng);
        const left = `${a}${v} ${minus ? "-" : "+"} ${b}`;
        const value = minus ? a * test - b : a * test + b;
        const yes = value === c;
        return choiceProblem({
          prompt: t(`Is $${v} = ${test}$ a solution of $${left} = ${c}$?`, `$${v} = ${test}$ 是 $${left} = ${c}$ 的解吗？`),
          options: yesNo,
          correct: yes ? 0 : 1,
          solution: t(
            `Substitute: $${a} \\times ${test} ${minus ? "-" : "+"} ${b} = ${a * test} ${minus ? "-" : "+"} ${b} = ${value}$${yes ? `, which equals $${c}$. So $${v} = ${test}$ is a solution.` : `, not $${c}$. So $${v} = ${test}$ is not a solution.`}`,
            `代入：$${a} \\times ${test} ${minus ? "-" : "+"} ${b} = ${a * test} ${minus ? "-" : "+"} ${b} = ${value}$，${yes ? `等于 $${c}$。所以 $${v} = ${test}$ 是方程的解。` : `不等于 $${c}$。所以 $${v} = ${test}$ 不是方程的解。`}`,
          ),
        });
      },
    },
    {
      id: "choosing-the-solution",
      title: t("Choosing the solution from a list", "从几个值中选出解"),
      explanation: t(
        "To find the solution in a list, substitute each value in turn and keep the one that makes both sides equal.\n\nWhich of $2, 3, 4, 5$ solves $5(x - 1) = 15$? Try each: only $x = 4$ gives $5 \\times 3 = 15$.",
        "从几个数中找方程的解，就把它们一个一个代入，找出使两边相等的那个。\n\n$2, 3, 4, 5$ 中哪个是 $5(x - 1) = 15$ 的解？逐个代入：只有 $x = 4$ 时 $5 \\times 3 = 15$。",
      ),
      generate(rng) {
        const v = pickVar(rng);
        const a = rng.int(2, 9);
        const b = rng.int(1, 9);
        const s = rng.int(b + 1, b + 9);
        const grouped = rng.bool();
        const left = grouped ? `${a}(${v} - ${b})` : `${a}${v} - ${b}`;
        const c = grouped ? a * (s - b) : a * s - b;
        const others = [s - 1, s + 1, s + 2, s - 2].filter((o) => o > b);
        return pickChoice(
          rng,
          t(`Which value of $${v}$ is a solution of $${left} = ${c}$?`, `$${v}$ 取哪个值时是 $${left} = ${c}$ 的解？`),
          mathText(String(s)),
          others.map((o) => mathText(String(o))),
          t(
            `Substitute $${v} = ${s}$: $${grouped ? `${a}(${s} - ${b}) = ${a} \\times ${s - b}` : `${a} \\times ${s} - ${b} = ${a * s} - ${b}`} = ${c}$. The other values give different results.`,
            `代入 $${v} = ${s}$：$${grouped ? `${a}(${s} - ${b}) = ${a} \\times ${s - b}` : `${a} \\times ${s} - ${b} = ${a * s} - ${b}`} = ${c}$。其他值得到的结果都不相等。`,
          ),
        );
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// One-step equations

/** checkLine writes the check of a solution, such as "Check: 9 + 4 = 13." */
const check = (lhs: string, rhs: string) => t(` Check: $${lhs} = ${rhs}$.`, `检验：$${lhs} = ${rhs}$。`);

export const oneStepAdditionEquations = topic(
  "one-step-addition-equations",
  t("One-Step Addition Equations", "一步加法方程"),
  t(
    "To solve x + a = b, undo the addition by subtracting a from both sides: x + 7 = 15 gives x = 15 − 7 = 8. Subtracting the same number from both sides keeps the equation balanced.",
    "解 x + a = b 时，在两边同时减去 a 来抵消加法：x + 7 = 15，得 x = 15 − 7 = 8。两边减去同一个数，等式仍然成立。",
  ),
  ["identifying-solutions-to-linear-equations"],
  ["6.EE.B.7"],
  [
    {
      id: "whole-numbers",
      title: t("Whole numbers", "整数"),
      explanation: t(
        "To solve an equation, get the variable alone by undoing what was done to it, doing the same to both sides so they stay equal. Subtraction undoes addition.\n\n$x + 12 = 30$: subtract $12$ from both sides, $x = 30 - 12 = 18$. Check: $18 + 12 = 30$.",
        "解方程，就是用逆运算让字母单独留在一边，等式两边要做同样的运算，才能保持相等。减法是加法的逆运算。\n\n$x + 12 = 30$：两边同时减去 $12$，$x = 30 - 12 = 18$。检验：$18 + 12 = 30$。",
      ),
      generate(rng) {
        const v = pickVar(rng);
        const a = rng.int(2, 60);
        const s = rng.int(1, 80);
        const b = s + a;
        const eq = rng.bool(0.7) ? `${v} + ${a} = ${b}` : `${a} + ${v} = ${b}`;
        const c = check(`${s} + ${a}`, `${b}`);
        return numberProblem({
          prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
          answer: s,
          solveFor: v,
          form: "integer",
          wrong: [a + b, a - b],
          solution: t(
            `Subtract $${a}$ from both sides: $${v} = ${b} - ${a} = ${s}$.${c.en}`,
            `两边同时减去 $${a}$：$${v} = ${b} - ${a} = ${s}$。${c["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "decimals-and-fractions",
      title: t("Decimals and fractions", "小数和分数"),
      explanation: t(
        "The method is the same with decimals and fractions: subtract the added number from both sides. For fractions, use a common denominator.\n\n$x + 2.6 = 7.1$ gives $x = 7.1 - 2.6 = 4.5$, and $x + \\frac{1}{4} = \\frac{5}{6}$ gives $x = \\frac{10}{12} - \\frac{3}{12} = \\frac{7}{12}$.",
        "有小数和分数时方法一样：两边同时减去加上的那个数。分数要先通分。\n\n$x + 2.6 = 7.1$，得 $x = 7.1 - 2.6 = 4.5$；$x + \\frac{1}{4} = \\frac{5}{6}$，得 $x = \\frac{10}{12} - \\frac{3}{12} = \\frac{7}{12}$。",
      ),
      generate(rng) {
        const v = pickVar(rng);
        const decimal = rng.bool();
        const a = decimal ? tenths(rng, 1, 20) : smallFraction(rng);
        const s = decimal ? tenths(rng, 1, 20) : smallFraction(rng);
        const b = s.add(a);
        const eq = `${v} + ${show(a, decimal)} = ${show(b, decimal)}`;
        return numberProblem({
          prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
          answer: s,
          solveFor: v,
          ...(decimal && { form: "decimal" as const }),
          wrong: [a.add(b), a.sub(b)],
          solution: t(
            `Subtract $${show(a, decimal)}$ from both sides: $${v} = ${show(b, decimal)} - ${show(a, decimal)} = ${show(s, decimal)}$.`,
            `两边同时减去 $${show(a, decimal)}$：$${v} = ${show(b, decimal)} - ${show(a, decimal)} = ${show(s, decimal)}$。`,
          ),
        });
      },
    },
  ],
);

export const oneStepSubtractionEquations = topic(
  "one-step-subtraction-equations",
  t("One-Step Subtraction Equations", "一步减法方程"),
  t(
    "To solve x − a = b, undo the subtraction by adding a to both sides: x − 9 = 14 gives x = 14 + 9 = 23. When the variable is subtracted, as in 20 − x = 6, ask what must be taken from 20 to leave 6: x = 20 − 6 = 14.",
    "解 x − a = b 时，在两边同时加上 a 来抵消减法：x − 9 = 14，得 x = 14 + 9 = 23。当减去的是变量时，如 20 − x = 6，想一想从 20 里减去多少剩下 6：x = 20 − 6 = 14。",
  ),
  ["one-step-addition-equations"],
  ["6.EE.B.7"],
  [
    {
      id: "subtracting-a-number",
      title: t("A number is subtracted", "减去一个数"),
      explanation: t(
        "When a number is subtracted from the variable, add it to both sides to undo the subtraction.\n\n$x - 3.5 = 8$: add $3.5$ to both sides, $x = 8 + 3.5 = 11.5$. Check: $11.5 - 3.5 = 8$.",
        "字母减去一个数时，两边同时加上这个数，抵消减法。\n\n$x - 3.5 = 8$：两边同时加上 $3.5$，$x = 8 + 3.5 = 11.5$。检验：$11.5 - 3.5 = 8$。",
      ),
      generate(rng) {
        const v = pickVar(rng);
        const decimal = rng.bool(0.4);
        const a = decimal ? tenths(rng, 1, 20) : Q.of(rng.int(2, 60));
        const b = decimal ? Q.of(rng.int(1, 30)) : Q.of(rng.int(1, 80));
        const s = a.add(b);
        const c = check(`${show(s, decimal)} - ${show(a, decimal)}`, show(b, decimal));
        return numberProblem({
          prompt: t(`Solve $${v} - ${show(a, decimal)} = ${b.toString()}$.`, `解方程 $${v} - ${show(a, decimal)} = ${b.toString()}$。`),
          answer: s,
          solveFor: v,
          form: decimal ? "decimal" : "integer",
          wrong: [b.sub(a), a.sub(b)],
          solution: t(
            `Add $${show(a, decimal)}$ to both sides: $${v} = ${b.toString()} + ${show(a, decimal)} = ${show(s, decimal)}$.${c.en}`,
            `两边同时加上 $${show(a, decimal)}$：$${v} = ${b.toString()} + ${show(a, decimal)} = ${show(s, decimal)}$。${c["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "subtracting-the-variable",
      title: t("The variable is subtracted", "减去的是变量"),
      explanation: t(
        "When the variable is subtracted from a number, add the variable to both sides so it is no longer subtracted, then subtract to get it alone.\n\n$20 - x = 6$: adding $x$ to both sides gives $20 = 6 + x$, so $x = 20 - 6 = 14$. Adding $20 + 6$ would be a mistake: check $20 - 26 \\ne 6$.",
        "一个数减去字母时，两边同时加上这个字母，使它不再被减，再用减法求出字母。\n\n$20 - x = 6$：两边同时加上 $x$，得 $20 = 6 + x$，所以 $x = 20 - 6 = 14$。如果算成 $20 + 6$ 就错了：检验 $20 - 26 \\ne 6$。",
      ),
      generate(rng) {
        const v = pickVar(rng);
        const a = rng.int(10, 90);
        const b = rng.int(1, a - 1);
        const s = a - b;
        const c = check(`${a} - ${s}`, `${b}`);
        return numberProblem({
          prompt: t(`Solve $${a} - ${v} = ${b}$.`, `解方程 $${a} - ${v} = ${b}$。`),
          answer: s,
          solveFor: v,
          form: "integer",
          wrong: [a + b, b - a],
          solution: t(
            `Add $${v}$ to both sides: $${a} = ${b} + ${v}$. Then subtract $${b}$: $${v} = ${a} - ${b} = ${s}$.${c.en}`,
            `两边同时加上 $${v}$：$${a} = ${b} + ${v}$。再减去 $${b}$：$${v} = ${a} - ${b} = ${s}$。${c["zh-CN"]}`,
          ),
        });
      },
    },
  ],
);

export const oneStepMultiplicationEquations = topic(
  "one-step-multiplication-equations",
  t("One-Step Multiplication Equations", "一步乘法方程"),
  t(
    "To solve ax = b, undo the multiplication by dividing both sides by a: 6x = 42 gives x = 42 ÷ 6 = 7. The solution need not be a whole number: 4x = 10 gives x = 10/4 = 2.5.",
    "解 ax = b 时，两边同时除以 a 来抵消乘法：6x = 42，得 x = 42 ÷ 6 = 7。解不一定是整数：4x = 10，得 x = 10/4 = 2.5。",
  ),
  ["identifying-solutions-to-linear-equations"],
  ["6.EE.B.7"],
  [
    {
      id: "whole-number-solutions",
      title: t("Whole-number solutions", "解是整数"),
      explanation: t(
        "When the variable is multiplied by a number, divide both sides by that number. Division undoes multiplication.\n\n$8n = 56$: divide both sides by $8$, $n = 56 \\div 8 = 7$. Check: $8 \\times 7 = 56$.",
        "字母乘一个数时，两边同时除以这个数。除法是乘法的逆运算。\n\n$8n = 56$：两边同时除以 $8$，$n = 56 \\div 8 = 7$。检验：$8 \\times 7 = 56$。",
      ),
      generate(rng) {
        const v = pickVar(rng);
        const a = rng.int(2, 15);
        const s = rng.int(2, 15);
        const b = a * s;
        const c = check(`${a} \\times ${s}`, `${b}`);
        return numberProblem({
          prompt: t(`Solve $${a}${v} = ${b}$.`, `解方程 $${a}${v} = ${b}$。`),
          answer: s,
          solveFor: v,
          form: "integer",
          wrong: [a * b, b - a],
          solution: t(
            `Divide both sides by $${a}$: $${v} = ${b} \\div ${a} = ${s}$.${c.en}`,
            `两边同时除以 $${a}$：$${v} = ${b} \\div ${a} = ${s}$。${c["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "decimal-coefficients-and-solutions",
      title: t("Decimals", "含小数"),
      explanation: t(
        "Divide both sides by the coefficient, even when the answer or the coefficient is a decimal. To divide by a decimal, move both decimal points until the divisor is whole.\n\n$4x = 10$ gives $x = 10 \\div 4 = 2.5$, and $0.6x = 4.2$ gives $x = 4.2 \\div 0.6 = 42 \\div 6 = 7$.",
        "两边同时除以系数，即使系数或结果是小数也一样。除以小数时，把两个小数点同时移动，使除数变成整数。\n\n$4x = 10$，得 $x = 10 \\div 4 = 2.5$；$0.6x = 4.2$，得 $x = 4.2 \\div 0.6 = 42 \\div 6 = 7$。",
      ),
      generate(rng) {
        const v = pickVar(rng);
        if (rng.bool()) {
          const a = rng.pick([2, 4, 5, 8]);
          let b: number;
          do b = rng.int(3, 60);
          while (b % a === 0);
          const s = Q.of(b, a);
          return numberProblem({
            prompt: t(`Solve $${a}${v} = ${b}$. Write the answer as a decimal.`, `解方程 $${a}${v} = ${b}$，结果写成小数。`),
            answer: s,
            solveFor: v,
            form: "decimal",
            wrong: [Q.of(a * b), Q.of(a, b), Q.of(b - a)],
            solution: t(
              `Divide both sides by $${a}$: $${v} = ${b} \\div ${a} = ${dec(s)}$.`,
              `两边同时除以 $${a}$：$${v} = ${b} \\div ${a} = ${dec(s)}$。`,
            ),
          });
        }
        const a = tenths(rng, 0, 3);
        const s = rng.int(2, 15);
        const b = a.mul(Q.of(s));
        return numberProblem({
          prompt: t(`Solve $${dec(a)}${v} = ${dec(b)}$.`, `解方程 $${dec(a)}${v} = ${dec(b)}$。`),
          answer: s,
          solveFor: v,
          wrong: [Q.of(s, 10), Q.of(s * 10), a.mul(b)],
          solution: t(
            `Divide both sides by $${dec(a)}$: $${v} = ${dec(b)} \\div ${dec(a)} = ${s}$. Check: $${dec(a)} \\times ${s} = ${dec(b)}$.`,
            `两边同时除以 $${dec(a)}$：$${v} = ${dec(b)} \\div ${dec(a)} = ${s}$。检验：$${dec(a)} \\times ${s} = ${dec(b)}$。`,
          ),
        });
      },
    },
  ],
);

export const oneStepMultiplicationEquationsContainingFractions = topic(
  "one-step-multiplication-equations-containing-fractions",
  t("One-Step Multiplication Equations Containing Fractions", "含分数的一步乘法方程"),
  t(
    "To solve (p/q)x = b, multiply both sides by the reciprocal q/p, which undoes multiplying by p/q: (2/3)x = 8 gives x = 8 × 3/2 = 12. The same works when b is a fraction: 3x = 2/5 gives x = 2/5 × 1/3 = 2/15.",
    "解 (p/q)x = b 时，两边同时乘倒数 q/p，抵消乘 p/q：(2/3)x = 8，得 x = 8 × 3/2 = 12。b 是分数时也一样：3x = 2/5，得 x = 2/5 × 1/3 = 2/15。",
  ),
  ["one-step-multiplication-equations", "reciprocals"],
  ["6.EE.B.7"],
  [
    {
      id: "fraction-coefficients",
      title: t("A fraction times the variable", "分数乘变量"),
      explanation: t(
        "When the coefficient is a fraction, multiply both sides by its reciprocal. This is the same as dividing by the fraction, and it leaves $1$ times the variable.\n\n$\\frac{3}{4}m = 12$: multiply both sides by $\\frac{4}{3}$, $m = 12 \\times \\frac{4}{3} = 16$. Check: $\\frac{3}{4} \\times 16 = 12$.",
        "系数是分数时，两边同时乘它的倒数。这和除以这个分数一样，左边就只剩下字母。\n\n$\\frac{3}{4}m = 12$：两边同时乘 $\\frac{4}{3}$，$m = 12 \\times \\frac{4}{3} = 16$。检验：$\\frac{3}{4} \\times 16 = 12$。",
      ),
      generate(rng) {
        const v = pickVar(rng);
        const a = smallFraction(rng);
        if (a.cmp(Q.one) > 0 && rng.bool(0.6)) return this.generate(rng);
        const s = Number(a.d) * rng.int(1, 8);
        const b = a.mul(Q.of(s));
        const recip = Q.one.div(a);
        return numberProblem({
          prompt: t(`Solve $${a.toLatex()}${v} = ${b.toLatex()}$.`, `解方程 $${a.toLatex()}${v} = ${b.toLatex()}$。`),
          answer: s,
          solveFor: v,
          wrong: [a.mul(b), b.mul(Q.of(a.d))],
          solution: t(
            `Multiply both sides by the reciprocal $${recip.toLatex()}$: $${v} = ${b.toLatex()} \\times ${recip.toLatex()} = ${s}$.`,
            `两边同时乘倒数 $${recip.toLatex()}$：$${v} = ${b.toLatex()} \\times ${recip.toLatex()} = ${s}$。`,
          ),
        });
      },
    },
    {
      id: "fractional-solutions",
      title: t("Fractional solutions", "解是分数"),
      explanation: t(
        "Multiply both sides by the reciprocal of the coefficient, then simplify. The solution may be a fraction.\n\n$\\frac{2}{3}x = \\frac{4}{5}$: $x = \\frac{4}{5} \\times \\frac{3}{2} = \\frac{12}{10} = \\frac{6}{5}$.",
        "两边同时乘系数的倒数，再约分。方程的解可能是分数。\n\n$\\frac{2}{3}x = \\frac{4}{5}$：$x = \\frac{4}{5} \\times \\frac{3}{2} = \\frac{12}{10} = \\frac{6}{5}$。",
      ),
      generate(rng) {
        const v = pickVar(rng);
        const a = rng.bool(0.3) ? Q.of(rng.int(2, 9)) : smallFraction(rng);
        const b = smallFraction(rng);
        const s = b.div(a);
        if (s.isInteger() || a.eq(b)) return this.generate(rng);
        const recip = Q.one.div(a);
        return numberProblem({
          prompt: t(`Solve $${a.toLatex()}${v} = ${b.toLatex()}$.`, `解方程 $${a.toLatex()}${v} = ${b.toLatex()}$。`),
          answer: s,
          solveFor: v,
          wrong: [a.mul(b), a.div(b)],
          solution: t(
            `Multiply both sides by $${recip.toLatex()}$: $${v} = ${b.toLatex()} \\times ${recip.toLatex()} = ${s.toLatex()}$.`,
            `两边同时乘 $${recip.toLatex()}$：$${v} = ${b.toLatex()} \\times ${recip.toLatex()} = ${s.toLatex()}$。`,
          ),
        });
      },
    },
  ],
);

export const oneStepDivisionEquations = topic(
  "one-step-division-equations",
  t("One-Step Division Equations", "一步除法方程"),
  t(
    "To solve x/a = b, undo the division by multiplying both sides by a: x/6 = 9 gives x = 9 × 6 = 54. Check: 54 ÷ 6 = 9.",
    "解 x/a = b 时，两边同时乘 a 来抵消除法：x/6 = 9，得 x = 9 × 6 = 54。检验：54 ÷ 6 = 9。",
  ),
  ["one-step-multiplication-equations"],
  ["6.EE.B.7"],
  [
    {
      id: "whole-numbers",
      title: t("Whole numbers", "整数"),
      explanation: t(
        "When the variable is divided by a number, multiply both sides by that number. Multiplication undoes division.\n\n$\\frac{n}{7} = 8$: multiply both sides by $7$, $n = 8 \\times 7 = 56$. Dividing $8$ by $7$ instead is a common mistake.",
        "字母除以一个数时，两边同时乘这个数。乘法是除法的逆运算。\n\n$\\frac{n}{7} = 8$：两边同时乘 $7$，$n = 8 \\times 7 = 56$。用 $8$ 除以 $7$ 是常见的错误。",
      ),
      generate(rng) {
        const v = pickVar(rng);
        const a = rng.int(2, 12);
        const b = rng.int(2, 15);
        const c = check(`${a * b} \\div ${a}`, `${b}`);
        return numberProblem({
          prompt: t(`Solve $\\frac{${v}}{${a}} = ${b}$.`, `解方程 $\\frac{${v}}{${a}} = ${b}$。`),
          answer: a * b,
          solveFor: v,
          form: "integer",
          wrong: [b + a, Q.of(b, a), Q.of(a, b)],
          solution: t(
            `Multiply both sides by $${a}$: $${v} = ${b} \\times ${a} = ${a * b}$.${c.en}`,
            `两边同时乘 $${a}$：$${v} = ${b} \\times ${a} = ${a * b}$。${c["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "decimal-and-fraction-quotients",
      title: t("Decimals and fractions", "小数和分数"),
      explanation: t(
        "When the variable is divided by a number, multiply both sides by that number, even when the other side is a decimal or a fraction.\n\n$\\frac{x}{4} = 2.5$ gives $x = 2.5 \\times 4 = 10$, and $\\frac{x}{3} = \\frac{2}{5}$ gives $x = \\frac{2}{5} \\times 3 = \\frac{6}{5}$.",
        "字母除以一个数时，两边同时乘这个数，即使另一边是小数或分数也一样。\n\n$\\frac{x}{4} = 2.5$，得 $x = 2.5 \\times 4 = 10$；$\\frac{x}{3} = \\frac{2}{5}$，得 $x = \\frac{2}{5} \\times 3 = \\frac{6}{5}$。",
      ),
      generate(rng) {
        const v = pickVar(rng);
        const decimal = rng.bool();
        const a = rng.int(2, 9);
        const b = decimal ? tenths(rng, 0, 12) : smallFraction(rng);
        const s = b.mul(Q.of(a));
        return numberProblem({
          prompt: t(`Solve $\\frac{${v}}{${a}} = ${show(b, decimal)}$.`, `解方程 $\\frac{${v}}{${a}} = ${show(b, decimal)}$。`),
          answer: s,
          solveFor: v,
          wrong: [b.div(Q.of(a)), b.add(Q.of(a))],
          solution: t(
            `Multiply both sides by $${a}$: $${v} = ${show(b, decimal)} \\times ${a} = ${show(s, decimal)}$.`,
            `两边同时乘 $${a}$：$${v} = ${show(b, decimal)} \\times ${a} = ${show(s, decimal)}$。`,
          ),
        });
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Real-world one-step equations

/** Situation is a word problem modeled by a one-step equation in a variable, with tempting wrong equations. */
interface Situation {
  readonly en: string;
  readonly zh: string;
  readonly variable: string;
  readonly equation: string;
  readonly wrongEquations: readonly string[];
  readonly answer: Q;
  readonly wrongAnswers: readonly Q[];
  readonly unit: Text;
  readonly why: Text;
}

/** additiveSituations builds word problems modeled by x + a = b or x − a = b. */
function additiveSituations(rng: Rng): Situation[] {
  const a = rng.int(5, 40);
  const b = rng.int(a + 5, a + 80);
  const gap = rng.int(2, 12);
  const age = gap + rng.int(3, 40);
  return [
    {
      en: `A sunflower grew $${a}$ cm this month and is now $${b}$ cm tall. Let $h$ be its height, in cm, at the start of the month.`,
      zh: `一株向日葵这个月长高了 $${a}$ 厘米，现在高 $${b}$ 厘米。设月初它的高度为 $h$ 厘米。`,
      variable: "h",
      equation: `h + ${a} = ${b}`,
      wrongEquations: [`h - ${a} = ${b}`, `${a}h = ${b}`, `h = ${a} + ${b}`],
      answer: Q.of(b - a),
      wrongAnswers: [Q.of(a + b)],
      unit: t("cm", "厘米"),
      why: t(
        `The starting height plus the growth is the height now: $h + ${a} = ${b}$, so $h = ${b} - ${a} = ${b - a}$ cm.`,
        `月初高度加上长高的部分等于现在的高度：$h + ${a} = ${b}$，所以 $h = ${b} - ${a} = ${b - a}$ 厘米。`,
      ),
    },
    {
      en: `After spending $\\$${a}$ on a jacket, Ana has $\\$${b}$ left. Let $m$ be the amount of money, in dollars, she had before.`,
      zh: `Ana 花 $\\$${a}$ 买了一件夹克后，还剩 $\\$${b}$。设她原来有 $m$ 美元。`,
      variable: "m",
      equation: `m - ${a} = ${b}`,
      wrongEquations: [`m + ${a} = ${b}`, `${a} - m = ${b}`, `\\frac{m}{${a}} = ${b}`],
      answer: Q.of(a + b),
      wrongAnswers: [Q.of(b - a)],
      unit: t("dollars", "美元"),
      why: t(
        `What she had minus what she spent is what is left: $m - ${a} = ${b}$, so $m = ${b} + ${a} = ${a + b}$ dollars.`,
        `原有的钱减去花掉的钱等于剩下的钱：$m - ${a} = ${b}$，所以 $m = ${b} + ${a} = ${a + b}$ 美元。`,
      ),
    },
    {
      en: `Leo is $${gap}$ years older than his cousin. Leo is $${age}$ years old. Let $c$ be his cousin's age, in years.`,
      zh: `Leo 比他的表弟大 $${gap}$ 岁，Leo 今年 $${age}$ 岁。设表弟 $c$ 岁。`,
      variable: "c",
      equation: `c + ${gap} = ${age}`,
      wrongEquations: [`c - ${gap} = ${age}`, `${age} + c = ${gap}`, `${gap}c = ${age}`],
      answer: Q.of(age - gap),
      wrongAnswers: [Q.of(age + gap)],
      unit: t("years", "岁"),
      why: t(
        `The cousin's age plus $${gap}$ years is Leo's age: $c + ${gap} = ${age}$, so $c = ${age} - ${gap} = ${age - gap}$.`,
        `表弟的年龄加上 $${gap}$ 岁等于 Leo 的年龄：$c + ${gap} = ${age}$，所以 $c = ${age} - ${gap} = ${age - gap}$。`,
      ),
    },
    {
      en: `A bus had some passengers. At a stop, $${a}$ passengers got off, leaving $${b}$ on the bus. Let $p$ be the number of passengers before the stop.`,
      zh: `一辆公交车上有一些乘客。到站后下车 $${a}$ 人，车上还剩 $${b}$ 人。设到站前车上有 $p$ 人。`,
      variable: "p",
      equation: `p - ${a} = ${b}`,
      wrongEquations: [`p + ${a} = ${b}`, `${a} - p = ${b}`, `${a}p = ${b}`],
      answer: Q.of(a + b),
      wrongAnswers: [Q.of(b - a)],
      unit: t("passengers", "人"),
      why: t(
        `Passengers before minus those who got off is those left: $p - ${a} = ${b}$, so $p = ${b} + ${a} = ${a + b}$.`,
        `到站前的人数减去下车的人数等于剩下的人数：$p - ${a} = ${b}$，所以 $p = ${b} + ${a} = ${a + b}$。`,
      ),
    },
  ];
}

/** multiplicativeSituations builds word problems modeled by ax = b or x/a = b. */
function multiplicativeSituations(rng: Rng): Situation[] {
  const a = rng.int(3, 12);
  const s = rng.int(3, 15);
  const [p, q] = rng.pick([
    [2, 3],
    [3, 4],
    [3, 5],
    [2, 5],
    [4, 5],
    [5, 6],
  ] as const);
  const k = rng.int(2, 8);
  return [
    {
      en: `Tickets to a show cost $\\$${a}$ each. A group paid $\\$${a * s}$ in all. Let $n$ be the number of tickets the group bought.`,
      zh: `演出票每张 $\\$${a}$，一个小组一共付了 $\\$${a * s}$。设他们买了 $n$ 张票。`,
      variable: "n",
      equation: `${a}n = ${a * s}`,
      wrongEquations: [`\\frac{n}{${a}} = ${a * s}`, `n + ${a} = ${a * s}`, `${a * s}n = ${a}`],
      answer: Q.of(s),
      wrongAnswers: [Q.of(a * a * s), Q.of(a * s - a)],
      unit: t("tickets", "张"),
      why: t(
        `The price per ticket times the number of tickets is the total: $${a}n = ${a * s}$, so $n = ${a * s} \\div ${a} = ${s}$.`,
        `单价乘张数等于总价：$${a}n = ${a * s}$，所以 $n = ${a * s} \\div ${a} = ${s}$。`,
      ),
    },
    {
      en: `A ribbon is cut into $${a}$ equal pieces, and each piece is $${s}$ inches long. Let $r$ be the length of the ribbon, in inches.`,
      zh: `一条丝带被剪成 $${a}$ 段同样长的丝带，每段长 $${s}$ 英寸。设丝带原长 $r$ 英寸。`,
      variable: "r",
      equation: `\\frac{r}{${a}} = ${s}`,
      wrongEquations: [`${a}r = ${s}`, `r - ${a} = ${s}`, `\\frac{${a}}{r} = ${s}`],
      answer: Q.of(a * s),
      wrongAnswers: [Q.of(s, a), Q.of(a + s)],
      unit: t("inches", "英寸"),
      why: t(
        `The length divided into $${a}$ equal pieces gives the length of each: $\\frac{r}{${a}} = ${s}$, so $r = ${s} \\times ${a} = ${a * s}$ inches.`,
        `把全长平均分成 $${a}$ 段得到每段的长度：$\\frac{r}{${a}} = ${s}$，所以 $r = ${s} \\times ${a} = ${a * s}$ 英寸。`,
      ),
    },
    {
      en: `A train travels at a steady $${a * 10}$ miles per hour and covers $${a * 10 * s}$ miles. Let $t$ be the travel time, in hours.`,
      zh: `一列火车以每小时 $${a * 10}$ 英里的速度匀速行驶了 $${a * 10 * s}$ 英里。设行驶时间为 $t$ 小时。`,
      variable: "t",
      equation: `${a * 10}t = ${a * 10 * s}`,
      wrongEquations: [`\\frac{t}{${a * 10}} = ${a * 10 * s}`, `t + ${a * 10} = ${a * 10 * s}`, `${a * 10 * s}t = ${a * 10}`],
      answer: Q.of(s),
      wrongAnswers: [Q.of(a * 10 * s - a * 10)],
      unit: t("hours", "小时"),
      why: t(
        `Speed times time is distance: $${a * 10}t = ${a * 10 * s}$, so $t = ${a * 10 * s} \\div ${a * 10} = ${s}$ hours.`,
        `速度乘时间等于路程：$${a * 10}t = ${a * 10 * s}$，所以 $t = ${a * 10 * s} \\div ${a * 10} = ${s}$ 小时。`,
      ),
    },
    {
      en: `In a class, $\\frac{${p}}{${q}}$ of the students walk to school. That is $${p * k}$ students. Let $c$ be the number of students in the class.`,
      zh: `一个班里 $\\frac{${p}}{${q}}$ 的学生步行上学，共 $${p * k}$ 人。设全班有 $c$ 人。`,
      variable: "c",
      equation: `\\frac{${p}}{${q}}c = ${p * k}`,
      wrongEquations: [`c + \\frac{${p}}{${q}} = ${p * k}`, `\\frac{${q}}{${p}}c = ${p * k}`, `c = \\frac{${p}}{${q}} \\times ${p * k}`],
      answer: Q.of(q * k),
      wrongAnswers: [Q.of(p * p * k, q)],
      unit: t("students", "人"),
      why: t(
        `$\\frac{${p}}{${q}}$ of the class is $${p * k}$: $\\frac{${p}}{${q}}c = ${p * k}$, so $c = ${p * k} \\times \\frac{${q}}{${p}} = ${q * k}$.`,
        `全班的 $\\frac{${p}}{${q}}$ 是 $${p * k}$ 人：$\\frac{${p}}{${q}}c = ${p * k}$，所以 $c = ${p * k} \\times \\frac{${q}}{${p}} = ${q * k}$。`,
      ),
    },
  ];
}

/** modelProblem asks which equation models a situation. */
function modelProblem(rng: Rng, s: Situation) {
  return pickChoice(
    rng,
    t(`${s.en} Which equation models this situation?`, `${s.zh}哪个方程能表示这个情境？`),
    mathText(s.equation),
    s.wrongEquations.map(mathText),
    s.why,
  );
}

/** solveProblem asks for the value of the unknown in a situation. */
function solveProblem(s: Situation) {
  return numberProblem({
    prompt: t(`${s.en} Find $${s.variable}$.`, `${s.zh}求 $${s.variable}$。`),
    answer: s.answer,
    form: "integer",
    wrong: [...s.wrongAnswers],
    solution: s.why,
  });
}

export const modelingRealWorldProblemsUsingOneStepEquations = topic(
  "modeling-real-world-problems-using-one-step-equations",
  t("Modeling Real-World Problems Using One-Step Equations", "用一步方程表示实际问题"),
  t(
    "To model a situation with an equation, name the unknown with a variable and write the relationship the story describes. If a plant grew 5 cm and is now 30 cm tall, its starting height h satisfies h + 5 = 30. If 6 equal tickets cost \\$48, the price p satisfies 6p = 48.",
    "用方程表示情境时，先用变量表示未知量，再写出题目描述的数量关系。一株植物长高了 5 厘米，现在高 30 厘米，原来的高度 h 满足 h + 5 = 30。6 张同价的票共 48 美元，单价 p 满足 6p = 48。",
  ),
  ["one-step-subtraction-equations", "one-step-division-equations", "constructing-algebraic-expressions"],
  ["6.EE.B.6", "6.EE.B.7"],
  [
    {
      id: "additive-situations",
      title: t("Adding and subtracting", "加法和减法情境"),
      explanation: t(
        'To write an equation, say in words what happens to the unknown, then write it in symbols. Spending, giving away or losing means subtract; receiving or adding on means add.\n\n"After spending $\\$12$, Ana has $\\$30$ left": what she had minus $12$ is $30$, so $m - 12 = 30$, not $m + 12 = 30$.',
        '列方程时，先用语言说出未知数经历了什么，再写成式子。花掉、送出、减少用减法；得到、增加用加法。\n\n"花了 $\\$12$ 后还剩 $\\$30$"：原有的钱减去 $12$ 等于 $30$，所以是 $m - 12 = 30$，而不是 $m + 12 = 30$。',
      ),
      generate(rng) {
        return modelProblem(rng, rng.pick(additiveSituations(rng)));
      },
    },
    {
      id: "multiplicative-situations",
      title: t("Multiplying and dividing", "乘法和除法情境"),
      explanation: t(
        'Splitting a whole into equal parts means divide; several equal groups means multiply. Write what happens to the unknown, and set it equal to the known result.\n\n"A ribbon cut into $4$ equal pieces of $9$ inches": the length divided by $4$ is $9$, so $\\frac{r}{4} = 9$.',
        '把整体平均分成几份用除法，几个相同的组合起来用乘法。写出未知数经过的运算，让它等于已知的结果。\n\n"一条丝带剪成 $4$ 段，每段 $9$ 英寸"：全长除以 $4$ 等于 $9$，所以 $\\frac{r}{4} = 9$。',
      ),
      generate(rng) {
        return modelProblem(rng, rng.pick(multiplicativeSituations(rng)));
      },
    },
  ],
);

export const solvingRealWorldProblemsUsingOneStepEquations = topic(
  "solving-real-world-problems-using-one-step-equations",
  t("Solving Real-World Problems Using One-Step Equations", "用一步方程解决实际问题"),
  t(
    "Write an equation for the situation, solve it, and check that the answer makes sense in the story. A train at 60 miles per hour that covers 240 miles travels for t hours, where 60t = 240, so t = 4 hours.",
    "先为情境列方程，再解方程，最后检查答案是否符合题意。一列火车以每小时 60 英里的速度行驶了 240 英里，行驶时间 t 满足 60t = 240，所以 t = 4 小时。",
  ),
  ["modeling-real-world-problems-using-one-step-equations"],
  ["6.EE.B.7"],
  [
    {
      id: "additive-situations",
      title: t("Adding and subtracting", "加法和减法情境"),
      explanation: t(
        "Write the equation for the situation, then solve it by doing the inverse operation to both sides. Check that the answer makes sense in the story.\n\n$14$ passengers got off and $23$ are left: $p - 14 = 23$, so $p = 23 + 14 = 37$ passengers were on before the stop.",
        "先根据情境列方程，再在两边做逆运算求解。最后检查答案在情境中是否合理。\n\n下车 $14$ 人后还有 $23$ 人：$p - 14 = 23$，所以 $p = 23 + 14 = 37$，到站前车上有 $37$ 人。",
      ),
      generate(rng) {
        return solveProblem(rng.pick(additiveSituations(rng)));
      },
    },
    {
      id: "multiplicative-situations",
      title: t("Multiplying and dividing", "乘法和除法情境"),
      explanation: t(
        "Write the equation, then undo the multiplication or division. For a fraction of an unknown total, multiply both sides by the reciprocal of the fraction.\n\n$\\frac{3}{4}$ of a class is $18$ students: $\\frac{3}{4}c = 18$, so $c = 18 \\times \\frac{4}{3} = 24$. The class is larger than $18$, as it should be.",
        "先列方程，再用逆运算抵消乘法或除法。已知一个未知总数的几分之几时，两边同时乘这个分数的倒数。\n\n全班的 $\\frac{3}{4}$ 是 $18$ 人：$\\frac{3}{4}c = 18$，所以 $c = 18 \\times \\frac{4}{3} = 24$。全班人数比 $18$ 多，这是合理的。",
      ),
      generate(rng) {
        return solveProblem(rng.pick(multiplicativeSituations(rng)));
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Inequalities

const holds = (l: Q, op: InequalityOp, r: Q) => ({ "<": l.cmp(r) < 0, "<=": l.cmp(r) <= 0, ">": l.cmp(r) > 0, ">=": l.cmp(r) >= 0 })[op];
const opWords: Record<InequalityOp, Text> = {
  "<": t("less than", "小于"),
  "<=": t("less than or equal to", "小于或等于"),
  ">": t("greater than", "大于"),
  ">=": t("greater than or equal to", "大于或等于"),
};
const ops: readonly InequalityOp[] = ["<", "<=", ">", ">="];

export const identifyingSolutionsToLinearInequalities = topic(
  "identifying-solutions-to-linear-inequalities",
  t("Identifying Solutions to Linear Inequalities", "判断一次不等式的解"),
  t(
    "An inequality such as x > 4 has infinitely many solutions: every number greater than 4, such as 4.1, 5 and 100. The boundary 4 itself is a solution of x ≥ 4 but not of x > 4. To test a value in an inequality such as 3x < 15, substitute it and check whether the statement is true.",
    "像 x > 4 这样的不等式有无数个解：所有大于 4 的数，例如 4.1、5、100。边界 4 是 x ≥ 4 的解，但不是 x > 4 的解。检验一个值是否是 3x < 15 这类不等式的解，把它代入，看不等式是否成立。",
  ),
  ["identifying-solutions-to-linear-equations", "comparing-rational-numbers"],
  ["6.EE.B.5", "6.EE.B.8"],
  [
    {
      id: "testing-a-value",
      title: t("Testing a value", "检验一个值"),
      explanation: t(
        "A value is a solution of an inequality if substituting it makes the inequality true. The symbols $\\le$ and $\\ge$ include equality; $<$ and $>$ do not.\n\nIs $7$ a solution of $x \\le 7$? Yes, $7 \\le 7$ is true. Is it a solution of $x < 7$? No, $7 < 7$ is false.",
        "把一个值代入不等式，如果不等式成立，它就是不等式的解。$\\le$ 和 $\\ge$ 包括相等的情况，$<$ 和 $>$ 不包括。\n\n$7$ 是 $x \\le 7$ 的解吗？是，$7 \\le 7$ 成立。它是 $x < 7$ 的解吗？不是，$7 < 7$ 不成立。",
      ),
      generate(rng) {
        const v = pickVar(rng);
        const op = rng.pick(ops);
        const c = rng.int(-10, 10);
        const value = rng.bool(0.35) ? Q.of(c) : rng.bool() ? Q.of(c + rng.nonZero(-5, 5)) : Q.of(2 * c + rng.pick([-1, 1]), 2);
        const yes = holds(value, op, Q.of(c));
        const shown = value.isInteger() ? value.toString() : dec(value);
        const statement = `${shown} ${relSymbol(op)} ${c}`;
        return choiceProblem({
          prompt: t(
            `Is $${v} = ${shown}$ a solution of $${inequalityLatex(v, op, c)}$?`,
            `$${v} = ${shown}$ 是 $${inequalityLatex(v, op, c)}$ 的解吗？`,
          ),
          options: yesNo,
          correct: yes ? 0 : 1,
          solution: t(
            `Substitute: $${statement}$ is ${yes ? "true" : "false"}, so $${shown}$ is ${yes ? "" : "not "}a solution.`,
            `代入：$${statement}$ ${yes ? "成立" : "不成立"}，所以 $${shown}$ ${yes ? "是" : "不是"}它的解。`,
          ),
        });
      },
    },
    {
      id: "testing-values-in-an-inequality-with-an-operation",
      title: t("Inequalities with an operation", "含运算的不等式"),
      explanation: t(
        "Substitute each value, work out the expression, and check whether the comparison is true.\n\nWhich of $3, 4, 5, 6$ is a solution of $2x + 1 > 11$? Substituting gives $7, 9, 11, 13$, and only $13 > 11$, so $x = 6$. The value $5$ gives exactly $11$, which is not greater than $11$.",
        "把每个值代入，算出式子的值，再看不等关系是否成立。\n\n$3, 4, 5, 6$ 中哪个是 $2x + 1 > 11$ 的解？代入得 $7, 9, 11, 13$，只有 $13 > 11$，所以是 $x = 6$。$5$ 代入正好得 $11$，并不大于 $11$。",
      ),
      generate(rng) {
        const v = pickVar(rng);
        const a = rng.int(2, 6);
        const b = rng.int(1, 9);
        const greater = rng.bool();
        const strict = rng.bool();
        const op: InequalityOp = greater ? (strict ? ">" : ">=") : strict ? "<" : "<=";
        const s0 = rng.int(2, 9);
        const c = a * s0 + b;
        // Values s0 - 2 … s0 + 1 (greater) or s0 - 1 … s0 + 2 (less): exactly one satisfies the inequality when the boundary is strict.
        const candidates = greater
          ? strict
            ? [s0 - 2, s0 - 1, s0, s0 + 1]
            : [s0 - 3, s0 - 2, s0 - 1, s0]
          : strict
            ? [s0 - 1, s0, s0 + 1, s0 + 2]
            : [s0, s0 + 1, s0 + 2, s0 + 3];
        const good = candidates.filter((x) => holds(Q.of(a * x + b), op, Q.of(c)));
        if (good.length !== 1 || candidates.some((x) => x < 0)) return this.generate(rng);
        const s = good[0]!;
        const left = `${a}${v} + ${b}`;
        return choiceProblem({
          prompt: t(
            `Which value of $${v}$ is a solution of $${left} ${relSymbol(op)} ${c}$?`,
            `$${v}$ 取哪个值时是 $${left} ${relSymbol(op)} ${c}$ 的解？`,
          ),
          options: candidates.map((x) => mathText(String(x))),
          correct: candidates.indexOf(s),
          solution: t(
            `Substitute each value: ${candidates.map((x) => `$${a}(${x}) + ${b} = ${a * x + b}$`).join(", ")}. Only $${a * s + b} ${relSymbol(op)} ${c}$ is true, so $${v} = ${s}$.`,
            `逐个代入：${candidates.map((x) => `$${a}(${x}) + ${b} = ${a * x + b}$`).join("，")}。只有 $${a * s + b} ${relSymbol(op)} ${c}$ 成立，所以 $${v} = ${s}$。`,
          ),
        });
      },
    },
  ],
);

/** inequalityFigure graphs v op c on a number line centered near c. */
function inequalityFigure(op: InequalityOp, c: number): Figure {
  const lo = Math.max(-10, c - 5 - (c % 2 === 0 ? 0 : 1));
  return numberLineFigure([ray(op, c)], lo, lo + 10);
}

export const representingInequalitiesOnNumberLines = topic(
  "representing-inequalities-on-number-lines",
  t("Representing Inequalities on Number Lines", "在数轴上表示不等式"),
  t(
    "The solutions of an inequality such as x > 2 are shown on a number line by shading every solution. An open circle at 2 shows that 2 is not included (> or <); a closed dot shows that it is included (≥ or ≤). Shading to the right means greater, and shading to the left means less. Note that 5 > x means the same as x < 5.",
    "像 x > 2 这样的不等式，可以在数轴上把所有的解涂色来表示。2 处画空心圈表示不包括 2（> 或 <）；画实心点表示包括 2（≥ 或 ≤）。向右涂色表示大于，向左涂色表示小于。注意 5 > x 与 x < 5 的意思相同。",
  ),
  ["identifying-solutions-to-linear-inequalities"],
  ["6.EE.B.8"],
  [
    {
      id: "writing-an-inequality-from-a-graph",
      title: t("Reading a graph", "根据图像写不等式"),
      explanation: t(
        "A closed dot at $-3$ with shading to the right shows $x \\ge -3$; an open circle at $4$ with shading to the left shows $x < 4$.",
        "$-3$ 处是实心点、向右涂色，表示 $x \\ge -3$；$4$ 处是空心圈、向左涂色，表示 $x < 4$。",
      ),
      generate(rng) {
        const op = rng.pick(ops);
        const c = rng.int(-8, 8);
        const greater = op === ">" || op === ">=";
        const closed = op === ">=" || op === "<=";
        return {
          ...inequalityProblem({
            prompt: t("Write an inequality in $x$ for the numbers shown on the number line.", "写出表示数轴上所示数的关于 $x$ 的不等式。"),
            op,
            value: c,
            wrong: [
              [greater ? (closed ? "<=" : "<") : closed ? ">=" : ">", c],
              [closed ? (greater ? ">" : "<") : greater ? ">=" : "<=", c],
            ],
            solution: t(
              `The ${closed ? "closed dot" : "open circle"} at $${c}$ means $${c}$ is ${closed ? "" : "not "}included, and the shading goes to the ${greater ? "right" : "left"}, so the graph shows $${inequalityLatex("x", op, c)}$.`,
              `$${c}$ 处是${closed ? "实心点" : "空心圈"}，表示${closed ? "包括" : "不包括"} $${c}$；向${greater ? "右" : "左"}涂色，所以图像表示 $${inequalityLatex("x", op, c)}$。`,
            ),
          }),
          figure: inequalityFigure(op, c),
        };
      },
    },
    {
      id: "describing-the-graph-of-an-inequality",
      title: t("Describing the graph", "描述不等式的图像"),
      explanation: t(
        "$6 \\ge x$ means $x \\le 6$: a closed dot at $6$ with shading to the left. Read the inequality starting from $x$ before deciding the direction.",
        "$6 \\ge x$ 即 $x \\le 6$：$6$ 处画实心点，向左涂色。先把不等式改写成以 $x$ 开头，再判断方向。",
      ),
      generate(rng) {
        const v = pickVar(rng);
        const op = rng.pick(ops);
        const c = rng.int(-9, 9);
        const reversed = rng.bool();
        const flipOp: Record<InequalityOp, InequalityOp> = { "<": ">", ">": "<", "<=": ">=", ">=": "<=" };
        const shown = reversed ? `${c} ${relSymbol(flipOp[op])} ${v}` : inequalityLatex(v, op, c);
        const describe = (o: InequalityOp) => {
          const closed = o === ">=" || o === "<=";
          const right = o === ">" || o === ">=";
          return t(
            `${closed ? "A closed dot" : "An open circle"} at $${c}$, shaded to the ${right ? "right" : "left"}`,
            `$${c}$ 处画${closed ? "实心点" : "空心圈"}，向${right ? "右" : "左"}涂色`,
          );
        };
        const options = ops.map(describe);
        return choiceProblem({
          prompt: t(`Which describes the graph of $${shown}$ on a number line?`, `$${shown}$ 在数轴上的图像是哪一种？`),
          options,
          correct: ops.indexOf(op),
          solution: t(
            `${reversed ? `$${shown}$ means the same as $${inequalityLatex(v, op, c)}$. ` : ""}${describe(op).en}.`,
            `${reversed ? `$${shown}$ 与 $${inequalityLatex(v, op, c)}$ 意思相同。` : ""}${describe(op)["zh-CN"]}。`,
          ),
        });
      },
    },
  ],
);

/** Constraint is a real-world limit described in words and modeled by an inequality. */
interface Constraint {
  readonly en: string;
  readonly zh: string;
  readonly variable: string;
  readonly op: InequalityOp;
  readonly value: number;
}

export const modelingRealWorldProblemsUsingInequalities = topic(
  "modeling-real-world-problems-using-inequalities",
  t("Modeling Real-World Problems Using Inequalities", "用不等式表示实际问题"),
  t(
    "Words such as “at least”, “at most”, “more than” and “fewer than” describe inequalities. “At least 48” includes 48, so it is ≥ 48; “at most 30” is ≤ 30; “more than 12” is > 12; “fewer than 5” is < 5. When each item has a cost, the total cost is the price times the number of items: at most \\$50 for tickets at \\$8 each is 8t ≤ 50.",
    "“至少”“至多”“多于”“少于”等词语描述的是不等关系。“至少 48”包括 48，所以是 ≥ 48；“至多 30”是 ≤ 30；“多于 12”是 > 12；“少于 5”是 < 5。每件物品有价格时，总价是单价乘件数：每张票 8 美元，最多花 50 美元，就是 8t ≤ 50。",
  ),
  ["representing-inequalities-on-number-lines", "constructing-algebraic-expressions"],
  ["6.EE.B.8"],
  [
    {
      id: "translating-inequality-words",
      title: t("At least, at most, more than, fewer than", "至少、至多、多于、少于"),
      explanation: t(
        '"At least" means greater than or equal to ($\\ge$), and "at most" or "cannot exceed" means less than or equal to ($\\le$). "More than" and "fewer than" leave out equality ($>$ and $<$).\n\n"Riders must be at least $48$ inches tall" is $h \\ge 48$. "Fewer than $20$ people" is $p < 20$.',
        '"至少"表示大于或等于（$\\ge$），"至多""不超过"表示小于或等于（$\\le$）。"多于""少于"不包括相等（$>$ 和 $<$）。\n\n"乘客身高必须至少 $48$ 英寸"是 $h \\ge 48$。"少于 $20$ 人"是 $p < 20$。',
      ),
      generate(rng) {
        const cs: Constraint[] = [
          (() => {
            const v = rng.int(40, 54);
            return {
              en: `To go on a ride, a rider's height $h$ must be at least $${v}$ inches.`,
              zh: `乘坐某游乐设施，乘客的身高 $h$ 必须至少 $${v}$ 英寸。`,
              variable: "h",
              op: ">=",
              value: v,
            };
          })(),
          (() => {
            const v = rng.int(8, 40);
            return {
              en: `A room can hold at most $${v}$ people. Let $p$ be the number of people in the room.`,
              zh: `一个房间至多容纳 $${v}$ 人。设房间里有 $p$ 人。`,
              variable: "p",
              op: "<=",
              value: v,
            };
          })(),
          (() => {
            const v = rng.int(10, 30) * 5;
            return {
              en: `To get free shipping, an order's total $c$ must be more than $\\$${v}$.`,
              zh: `订单总额 $c$ 必须多于 $\\$${v}$ 才能免运费。`,
              variable: "c",
              op: ">",
              value: v,
            };
          })(),
          (() => {
            const v = rng.int(3, 12);
            return {
              en: `A team has fewer than $${v}$ games left. Let $g$ be the number of games left.`,
              zh: `一支球队剩下的比赛少于 $${v}$ 场。设剩下 $g$ 场比赛。`,
              variable: "g",
              op: "<",
              value: v,
            };
          })(),
          (() => {
            const v = rng.int(30, 75);
            return {
              en: `The speed limit is $${v}$ miles per hour, so a driver's speed $s$ cannot exceed it.`,
              zh: `限速为每小时 $${v}$ 英里，所以司机的车速 $s$ 不能超过它。`,
              variable: "s",
              op: "<=",
              value: v,
            };
          })(),
          (() => {
            const v = rng.int(2, 10) * 10;
            return {
              en: `You need a score above $${v}$ points to win a prize. Let $x$ be your score.`,
              zh: `得分要高于 $${v}$ 分才能获奖。设你的得分为 $x$。`,
              variable: "x",
              op: ">",
              value: v,
            };
          })(),
        ];
        const c = rng.pick(cs);
        const flip: Record<InequalityOp, InequalityOp> = { "<": ">", ">": "<", "<=": ">=", ">=": "<=" };
        const strictness: Record<InequalityOp, InequalityOp> = { "<": "<=", "<=": "<", ">": ">=", ">=": ">" };
        return inequalityProblem({
          prompt: t(`${c.en} Write an inequality for $${c.variable}$.`, `${c.zh}写出关于 $${c.variable}$ 的不等式。`),
          variable: c.variable,
          op: c.op,
          value: c.value,
          wrong: [
            [flip[c.op], c.value],
            [strictness[c.op], c.value],
          ],
          solution: t(
            `The allowed values are ${opWords[c.op].en} $${c.value}$: $${inequalityLatex(c.variable, c.op, c.value)}$.`,
            `允许的值${opWords[c.op]["zh-CN"]} $${c.value}$：$${inequalityLatex(c.variable, c.op, c.value)}$。`,
          ),
        });
      },
    },
    {
      id: "inequalities-with-a-rate",
      title: t("Totals with a price or rate", "含单价或速率的总量"),
      explanation: t(
        "Write the total as the price or rate times the unknown number, then compare it with the limit using the right symbol.\n\nWith $\\$50$ to spend on $\\$8$ tickets, the cost of $t$ tickets is $8t$, and it can be at most $50$: $8t \\le 50$.",
        "把总量写成单价或单位量乘未知的个数，再用合适的符号和限制的量比较。\n\n有 $\\$50$ 买每张 $\\$8$ 的票，$t$ 张票共 $8t$ 美元，最多是 $50$：$8t \\le 50$。",
      ),
      generate(rng) {
        const a = rng.int(3, 15);
        const b = rng.int(4, 12) * 10;
        const kind = rng.int(0, 2);
        const story =
          kind === 0
            ? {
                en: `Tickets cost $\\$${a}$ each, and Mia can spend at most $\\$${b}$. Let $t$ be the number of tickets she buys.`,
                zh: `每张票 $\\$${a}$，Mia 最多能花 $\\$${b}$。设她买 $t$ 张票。`,
                v: "t",
                op: "<=" as InequalityOp,
              }
            : kind === 1
              ? {
                  en: `A box weighs $${a}$ pounds, and the total load in an elevator must be less than $${b * 10}$ pounds. Let $n$ be the number of boxes loaded.`,
                  zh: `每个箱子重 $${a}$ 磅，电梯里的总重必须小于 $${b * 10}$ 磅。设装了 $n$ 个箱子。`,
                  v: "n",
                  op: "<" as InequalityOp,
                }
              : {
                  en: `Jo earns $\\$${a}$ per hour and wants to earn at least $\\$${b}$. Let $h$ be the number of hours she works.`,
                  zh: `Jo 每小时挣 $\\$${a}$，她想至少挣 $\\$${b}$。设她工作 $h$ 小时。`,
                  v: "h",
                  op: ">=" as InequalityOp,
                };
        const limit = kind === 1 ? b * 10 : b;
        const right = (lhs: string, op: InequalityOp) => `${lhs} ${relSymbol(op)} ${limit}`;
        const flip: Record<InequalityOp, InequalityOp> = { "<": ">", ">": "<", "<=": ">=", ">=": "<=" };
        const correct = right(`${a}${story.v}`, story.op);
        return pickChoice(
          rng,
          t(`${story.en} Which inequality models this situation?`, `${story.zh}哪个不等式能表示这个情境？`),
          mathText(correct),
          [
            mathText(right(`${a}${story.v}`, flip[story.op])),
            mathText(right(`${story.v} + ${a}`, story.op)),
            mathText(right(`\\frac{${story.v}}{${a}}`, story.op)),
          ],
          t(
            `The total is $${a}$ times $${story.v}$, which is $${a}${story.v}$, and it must be ${opWords[story.op].en} $${limit}$: $${correct}$.`,
            `总量是 $${a}$ 乘 $${story.v}$，即 $${a}${story.v}$，它必须${opWords[story.op]["zh-CN"]} $${limit}$：$${correct}$。`,
          ),
        );
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Two-variable equations

/** Relation is a real-world equation y = kx + b with its variables and their meanings. */
interface Relation {
  readonly x: string;
  readonly y: string;
  readonly k: number;
  readonly b: number;
  readonly en: string;
  readonly zh: string;
  readonly xWords: Text;
  readonly yWords: Text;
}

/** relations builds real-world equations in two variables. */
function relations(rng: Rng): Relation[] {
  const k = rng.int(2, 12);
  const b = rng.int(2, 20);
  return [
    {
      x: "h",
      y: "e",
      k: k + 5,
      b: 0,
      en: `A lifeguard earns $\\$${k + 5}$ per hour. Her earnings $e$, in dollars, after working $h$ hours are given by $e = ${k + 5}h$.`,
      zh: `一名救生员每小时挣 $\\$${k + 5}$。她工作 $h$ 小时的收入 $e$（美元）为 $e = ${k + 5}h$。`,
      xWords: t("the number of hours worked", "工作的小时数"),
      yWords: t("the earnings", "收入"),
    },
    {
      x: "m",
      y: "c",
      k,
      b,
      en: `A bike rental costs $\\$${b}$ plus $\\$${k}$ per hour. The cost $c$, in dollars, of renting for $m$ hours is $c = ${k}m + ${b}$.`,
      zh: `租自行车的费用是 $\\$${b}$ 加上每小时 $\\$${k}$。租 $m$ 小时的费用 $c$（美元）为 $c = ${k}m + ${b}$。`,
      xWords: t("the number of hours", "租用的小时数"),
      yWords: t("the cost", "费用"),
    },
    {
      x: "w",
      y: "h",
      k: Math.min(k, 6),
      b: b + 10,
      en: `A plant is $${b + 10}$ cm tall and grows $${Math.min(k, 6)}$ cm per week. Its height $h$, in cm, after $w$ weeks is $h = ${Math.min(k, 6)}w + ${b + 10}$.`,
      zh: `一株植物高 $${b + 10}$ 厘米，每周长高 $${Math.min(k, 6)}$ 厘米。$w$ 周后它的高度 $h$（厘米）为 $h = ${Math.min(k, 6)}w + ${b + 10}$。`,
      xWords: t("the number of weeks", "周数"),
      yWords: t("the height", "高度"),
    },
    {
      x: "t",
      y: "d",
      k: k * 5,
      b: 0,
      en: `A car travels at $${k * 5}$ miles per hour. The distance $d$, in miles, it travels in $t$ hours is $d = ${k * 5}t$.`,
      zh: `一辆汽车以每小时 $${k * 5}$ 英里的速度行驶。它 $t$ 小时行驶的路程 $d$（英里）为 $d = ${k * 5}t$。`,
      xWords: t("the time", "时间"),
      yWords: t("the distance", "路程"),
    },
  ];
}

export const introductionToTwoVariableEquations = topic(
  "introduction-to-two-variable-equations",
  t("Introduction to Two-Variable Equations", "二元方程入门"),
  t(
    "An equation such as c = 3m + 5 relates two quantities. The independent variable (here m) is the one we choose; the dependent variable (here c) depends on it. To find the dependent variable, substitute the value of the independent variable: for m = 4, c = 3 × 4 + 5 = 17.",
    "像 c = 3m + 5 这样的方程把两个量联系起来。自变量（这里是 m）是可以自己选定的量；因变量（这里是 c）随它变化。要求因变量，就把自变量的值代入：当 m = 4 时，c = 3 × 4 + 5 = 17。",
  ),
  ["evaluating-linear-expressions"],
  ["6.EE.C.9"],
  [
    {
      id: "finding-the-dependent-variable",
      title: t("Finding the dependent variable", "求因变量"),
      explanation: t(
        "In an equation with two variables, the dependent variable is worked out from the independent one. Substitute the value of the independent variable and evaluate.\n\nIf $d = 55t$, then after $3$ hours $d = 55 \\times 3 = 165$ miles.",
        "在含两个字母的方程中，因变量由自变量决定。把自变量的值代入，算出因变量。\n\n如果 $d = 55t$，那么 $3$ 小时后 $d = 55 \\times 3 = 165$ 英里。",
      ),
      generate(rng) {
        const r = rng.pick(relations(rng));
        const x = rng.int(2, 10);
        const y = r.k * x + r.b;
        return numberProblem({
          prompt: t(`${r.en} Find $${r.y}$ when $${r.x} = ${x}$.`, `${r.zh}当 $${r.x} = ${x}$ 时，求 $${r.y}$。`),
          answer: y,
          form: "integer",
          wrong: [r.k + x + r.b, r.k * (x + r.b), r.k * x].filter((w) => w !== y),
          solution: t(
            `Substitute $${r.x} = ${x}$: $${r.y} = ${r.b ? `${r.k} \\times ${x} + ${r.b} = ${r.k * x} + ${r.b}` : `${r.k} \\times ${x}`} = ${y}$.`,
            `代入 $${r.x} = ${x}$：$${r.y} = ${r.b ? `${r.k} \\times ${x} + ${r.b} = ${r.k * x} + ${r.b}` : `${r.k} \\times ${x}`} = ${y}$。`,
          ),
        });
      },
    },
    {
      id: "independent-and-dependent-variables",
      title: t("Independent and dependent variables", "自变量与因变量"),
      explanation: t(
        "In $e = 15h$, the earnings depend on the hours worked: $h$ is the independent variable and $e$ is the dependent variable.",
        "在 $e = 15h$ 中，收入取决于工作时间：$h$ 是自变量，$e$ 是因变量。",
      ),
      generate(rng) {
        const r = rng.pick(relations(rng));
        const askDependent = rng.bool();
        return choiceProblem({
          prompt: askDependent
            ? t(`${r.en} Which is the dependent variable?`, `${r.zh}哪个是因变量？`)
            : t(`${r.en} Which is the independent variable?`, `${r.zh}哪个是自变量？`),
          options: [
            t(`$${r.x}$, ${r.xWords.en}`, `$${r.x}$，${r.xWords["zh-CN"]}`),
            t(`$${r.y}$, ${r.yWords.en}`, `$${r.y}$，${r.yWords["zh-CN"]}`),
          ],
          correct: askDependent ? 1 : 0,
          solution: t(
            `${capitalize(r.yWords.en)} depends on ${r.xWords.en}, so $${r.x}$ is the independent variable and $${r.y}$ is the dependent variable.`,
            `${r.yWords["zh-CN"]}取决于${r.xWords["zh-CN"]}，所以 $${r.x}$ 是自变量，$${r.y}$ 是因变量。`,
          ),
        });
      },
    },
  ],
);

/** capitalize writes the first letter of a phrase as a capital. */
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const twoVariableEquationsSolvingForTheIndependentVariable = topic(
  "two-variable-equations-solving-for-the-independent-variable",
  t("Two-Variable Equations: Solving for the Independent Variable", "二元方程：求自变量"),
  t(
    "When the dependent variable is known, substitute it and solve a one-step equation for the independent variable. If d = 60t and d = 240, then 60t = 240, so t = 4. If c = m + 15 and c = 40, then m = 40 − 15 = 25.",
    "已知因变量时，把它代入，再解一步方程求自变量。如果 d = 60t，d = 240，那么 60t = 240，所以 t = 4。如果 c = m + 15，c = 40，那么 m = 40 − 15 = 25。",
  ),
  ["introduction-to-two-variable-equations", "one-step-multiplication-equations", "one-step-addition-equations"],
  ["6.EE.C.9", "6.EE.B.7"],
  [
    {
      id: "proportional-equations",
      title: t("Equations of the form y = kx", "形如 y = kx 的方程"),
      explanation: t(
        "When the dependent variable is known, substitute it and solve the one-step equation that remains. For $y = kx$, divide by $k$.\n\n$e = 18h$ and $e = 126$: $18h = 126$, so $h = 126 \\div 18 = 7$ hours.",
        "已知因变量时，把它代入，再解剩下的一步方程。对于 $y = kx$，两边同时除以 $k$。\n\n$e = 18h$，$e = 126$：$18h = 126$，所以 $h = 126 \\div 18 = 7$ 小时。",
      ),
      generate(rng) {
        const r = rng.pick(relations(rng).filter((x) => x.b === 0));
        const x = rng.int(2, 12);
        const y = r.k * x;
        return numberProblem({
          prompt: t(`${r.en} Find $${r.x}$ when $${r.y} = ${y}$.`, `${r.zh}当 $${r.y} = ${y}$ 时，求 $${r.x}$。`),
          answer: x,
          form: "integer",
          wrong: [y * r.k, y - r.k],
          solution: t(
            `Substitute: $${y} = ${r.k}${r.x}$. Divide both sides by $${r.k}$: $${r.x} = ${y} \\div ${r.k} = ${x}$.`,
            `代入：$${y} = ${r.k}${r.x}$。两边同时除以 $${r.k}$：$${r.x} = ${y} \\div ${r.k} = ${x}$。`,
          ),
        });
      },
    },
    {
      id: "additive-equations",
      title: t("Equations of the form y = x + b", "形如 y = x + b 的方程"),
      explanation: t(
        "For an equation like $y = x + b$, substitute the known value of $y$ and subtract $b$ from both sides.\n\nBen is always $4$ years older than Ava: $b = a + 4$. When $b = 15$, $a = 15 - 4 = 11$.",
        "对于 $y = x + b$ 这样的方程，把已知的 $y$ 代入，再两边同时减去 $b$。\n\nBen 总是比 Ava 大 $4$ 岁：$b = a + 4$。当 $b = 15$ 时，$a = 15 - 4 = 11$。",
      ),
      generate(rng) {
        const d = rng.int(2, 9);
        const x = rng.int(5, 40);
        const kind = rng.bool();
        const en = kind
          ? `Ben is always $${d}$ years older than his sister Ava, so $b = a + ${d}$, where $b$ is Ben's age and $a$ is Ava's age. Find $a$ when $b = ${x + d}$.`
          : `A shop sells a phone case for $\\$${d}$ more than it paid, so $s = p + ${d}$, where $s$ is the selling price and $p$ is the price paid, in dollars. Find $p$ when $s = ${x + d}$.`;
        const zh = kind
          ? `Ben 总是比妹妹 Ava 大 $${d}$ 岁，所以 $b = a + ${d}$，其中 $b$ 是 Ben 的年龄，$a$ 是 Ava 的年龄。当 $b = ${x + d}$ 时，求 $a$。`
          : `一家店卖手机壳的售价比进价高 $\\$${d}$，所以 $s = p + ${d}$，其中 $s$ 是售价，$p$ 是进价（美元）。当 $s = ${x + d}$ 时，求 $p$。`;
        const xv = kind ? "a" : "p";
        return numberProblem({
          prompt: t(en, zh),
          answer: x,
          form: "integer",
          wrong: [x + 2 * d],
          solution: t(
            `Substitute: $${x + d} = ${xv} + ${d}$. Subtract $${d}$: $${xv} = ${x + d} - ${d} = ${x}$.`,
            `代入：$${x + d} = ${xv} + ${d}$。两边减去 $${d}$：$${xv} = ${x + d} - ${d} = ${x}$。`,
          ),
        });
      },
    },
  ],
);

/** tableLatex writes a two-row table of values. */
function tableLatex(x: string, y: string, xs: readonly string[], ys: readonly string[]): string {
  return `\\begin{array}{|c|${xs.map(() => "c").join("|")}|}\\hline ${x} & ${xs.join(" & ")} \\\\ \\hline ${y} & ${ys.join(" & ")} \\\\ \\hline\\end{array}`;
}

export const analyzingTwoVariableEquationsUsingTables = topic(
  "analyzing-two-variable-equations-using-tables",
  t("Analyzing Two-Variable Equations Using Tables", "用表格分析二元方程"),
  t(
    "A table lists pairs of values that satisfy an equation. For y = 4x, the pairs are (1, 4), (2, 8), (3, 12), …. To find the equation from a table, look for the rule that turns each x into its y: if every y is 4 times x, then y = 4x; if every y is 6 more than x, then y = x + 6.",
    "表格列出满足方程的数对。对于 y = 4x，数对是 (1, 4)、(2, 8)、(3, 12)……从表格找方程时，寻找把每个 x 变成对应 y 的规律：如果每个 y 都是 x 的 4 倍，则 y = 4x；如果每个 y 都比 x 大 6，则 y = x + 6。",
  ),
  ["introduction-to-two-variable-equations", "ratio-tables"],
  ["6.EE.C.9"],
  [
    {
      id: "completing-a-table",
      title: t("Completing a table", "补全表格"),
      explanation: t(
        "Each column of the table is a pair of values that fits the equation. To fill in a missing $y$, substitute that column's $x$ into the equation.\n\nFor $y = 3x + 1$ and $x = 5$, the missing entry is $y = 3 \\times 5 + 1 = 16$.",
        "表中每一列都是满足方程的一对值。要填空缺的 $y$，就把这一列的 $x$ 代入方程。\n\n对于 $y = 3x + 1$，当 $x = 5$ 时，缺少的值是 $y = 3 \\times 5 + 1 = 16$。",
      ),
      generate(rng) {
        const k = rng.int(2, 9);
        const b = rng.bool() ? 0 : rng.int(1, 9);
        const start = rng.int(0, 4);
        const xs = [0, 1, 2, 3].map((i) => start + i * rng.pick([1, 1, 2]) + i);
        const ys = xs.map((x) => k * x + b);
        const hole = rng.int(1, 3);
        const eq = b ? `y = ${k}x + ${b}` : `y = ${k}x`;
        return numberProblem({
          prompt: t(
            `The table shows values of $${eq}$. What is the missing value? $$${tableLatex(
              "x",
              "y",
              xs.map(String),
              ys.map((y, i) => (i === hole ? "?" : String(y))),
            )}$$`,
            `表格列出 $${eq}$ 的一些值。缺少的值是多少？$$${tableLatex(
              "x",
              "y",
              xs.map(String),
              ys.map((y, i) => (i === hole ? "?" : String(y))),
            )}$$`,
          ),
          answer: ys[hole]!,
          form: "integer",
          wrong: [k * (xs[hole]! + b), ys[hole - 1]! + k, k + xs[hole]! + b].filter((w) => w !== ys[hole]),
          solution: t(
            `Substitute $x = ${xs[hole]}$: $y = ${k} \\times ${xs[hole]}${b ? ` + ${b}` : ""} = ${ys[hole]}$.`,
            `代入 $x = ${xs[hole]}$：$y = ${k} \\times ${xs[hole]}${b ? ` + ${b}` : ""} = ${ys[hole]}$。`,
          ),
        });
      },
    },
    {
      id: "writing-the-equation-from-a-table",
      title: t("Writing the equation", "写出方程"),
      explanation: t(
        "In a table with $x = 2, 5, 7$ and $y = 10, 25, 35$, each $y$ is $5$ times $x$, so $y = 5x$. If instead $y = 8, 11, 13$, each $y$ is $6$ more than $x$, so $y = x + 6$.",
        "表格中 $x = 2, 5, 7$，$y = 10, 25, 35$，每个 $y$ 都是 $x$ 的 $5$ 倍，所以 $y = 5x$。如果 $y = 8, 11, 13$，每个 $y$ 都比 $x$ 大 $6$，所以 $y = x + 6$。",
      ),
      generate(rng) {
        const multiplicative = rng.bool();
        const k = rng.int(2, 9);
        const xs = rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 4).sort((a, b) => a - b);
        const ys = xs.map((x) => (multiplicative ? k * x : x + k));
        const answer = multiplicative ? `${k}x` : `x + ${k}`;
        return expressionProblem({
          prompt: t(
            `Write an equation for $y$ in terms of $x$ for the values in the table. $$${tableLatex("x", "y", xs.map(String), ys.map(String))}$$`,
            `根据表格中的值，写出用 $x$ 表示 $y$ 的方程。$$${tableLatex("x", "y", xs.map(String), ys.map(String))}$$`,
          ),
          answer,
          prefix: "y =",
          wrong: multiplicative ? [`x + ${ys[0]! - xs[0]!}`, `\\frac{x}{${k}}`] : [`${Math.round(ys[0]! / xs[0]!)}x`, `x - ${k}`],
          solution: multiplicative
            ? t(
                `Each $y$ is $${k}$ times its $x$: ${xs.map((x) => `$${k} \\times ${x} = ${k * x}$`).join(", ")}. So $y = ${k}x$.`,
                `每个 $y$ 都是对应 $x$ 的 $${k}$ 倍：${xs.map((x) => `$${k} \\times ${x} = ${k * x}$`).join("，")}。所以 $y = ${k}x$。`,
              )
            : t(
                `Each $y$ is $${k}$ more than its $x$: ${xs.map((x) => `$${x} + ${k} = ${x + k}$`).join(", ")}. So $y = x + ${k}$.`,
                `每个 $y$ 都比对应的 $x$ 大 $${k}$：${xs.map((x) => `$${x} + ${k} = ${x + k}$`).join("，")}。所以 $y = x + ${k}$。`,
              ),
        });
      },
    },
  ],
);

/** lineGraph draws y = kx + b (k ≤ 5, b ≤ 5) in the first quadrant with the points at x = 1, 2, 3 marked. */
function lineGraph(k: number, b: number): { figure: Figure; view: number } {
  const view = 3 * k + b <= 12 ? 12 : 20;
  const xEnd = Math.min(view, (view - b) / k);
  const marks: PlaneMark[] = [
    { kind: "segment", a: [0, b], b: [xEnd, k * xEnd + b], accent: true },
    ...[1, 2, 3].map((x) => ({ kind: "point" as const, at: [x, k * x + b] as [number, number], accent: true })),
  ];
  return {
    view,
    figure: {
      svg: plane({ xMin: 0, xMax: view, yMin: 0, yMax: view, step: 1, labelEvery: 2 }, marks),
      alt: t(
        `A line in the first quadrant starting at (0, ${b}) and rising ${k} unit${k === 1 ? "" : "s"} for each unit to the right.`,
        `第一象限中的一条直线，从 (0, ${b}) 出发，每向右 1 个单位上升 ${k} 个单位。`,
      ),
    },
  };
}

export const analyzingTwoVariableEquationsUsingGraphs = topic(
  "analyzing-two-variable-equations-using-graphs",
  t("Analyzing Two-Variable Equations Using Graphs", "用图像分析二元方程"),
  t(
    "Every pair (x, y) that satisfies an equation is a point on its graph. To read a value from the graph, go up from x to the line and across to the y-axis. A graph that starts at (0, 0) and rises 3 units for each unit to the right shows y = 3x; one that starts at (0, 2) and rises 3 units shows y = 3x + 2.",
    "满足方程的每一个数对 (x, y) 都是图像上的点。从图像读值时，从 x 处竖直向上找到直线，再水平找到 y 轴上的值。从 (0, 0) 出发、每向右 1 个单位上升 3 个单位的图像表示 y = 3x；从 (0, 2) 出发、每向右 1 个单位上升 3 个单位的图像表示 y = 3x + 2。",
  ),
  ["analyzing-two-variable-equations-using-tables", "graphing-ratios"],
  ["6.EE.C.9"],
  [
    {
      id: "reading-values-from-a-graph",
      title: t("Reading values", "读取数值"),
      explanation: t(
        "Every point on the graph of an equation is a pair $(x, y)$ that fits it. To read $y$ for a given $x$, go to that $x$ on the horizontal axis, move up or down to the line, then read across to the vertical axis.\n\nOn the graph of $y = 2x + 1$, the point above $x = 4$ is $(4, 9)$, so $y = 9$ when $x = 4$.",
        "方程图像上的每个点 $(x, y)$ 都满足方程。要读出某个 $x$ 对应的 $y$，先在横轴上找到这个 $x$，向上或向下找到直线上的点，再横着看纵轴上的值。\n\n在 $y = 2x + 1$ 的图像上，$x = 4$ 正上方的点是 $(4, 9)$，所以当 $x = 4$ 时，$y = 9$。",
      ),
      generate(rng) {
        const k = rng.int(1, 5);
        const b = rng.bool() ? 0 : rng.int(1, 5);
        const { figure, view } = lineGraph(k, b);
        const xMax = Math.floor((view - b) / k);
        const x = rng.int(1, xMax);
        const y = k * x + b;
        return {
          ...numberProblem({
            prompt: t(
              `The graph shows an equation in $x$ and $y$. What is $y$ when $x = ${x}$?`,
              `图像表示一个关于 $x$ 和 $y$ 的方程。当 $x = ${x}$ 时，$y$ 是多少？`,
            ),
            answer: y,
            form: "integer",
            wrong: [x, k * x, y + k].filter((w) => w !== y),
            solution: t(
              `The line starts at $(0, ${b})$ and rises $${k}$ for each unit to the right, so at $x = ${x}$ it is at $y = ${b ? `${b} + ` : ""}${k} \\times ${x} = ${y}$.`,
              `直线从 $(0, ${b})$ 出发，每向右 1 个单位上升 $${k}$，所以在 $x = ${x}$ 处 $y = ${b ? `${b} + ` : ""}${k} \\times ${x} = ${y}$。`,
            ),
          }),
          figure,
        };
      },
    },
    {
      id: "writing-the-equation-from-a-graph",
      title: t("Writing the equation", "写出方程"),
      explanation: t(
        "Read where the line crosses the $y$-axis, which is the value at $x = 0$, and how much $y$ rises each time $x$ goes up by $1$. Then $y$ is the rise times $x$ plus the starting value.\n\nA line through $(0, 0)$, $(1, 4)$ and $(2, 8)$ has $y = 4x$. A line through $(0, 3)$, $(1, 5)$ and $(2, 7)$ starts at $3$ and rises $2$ per unit, so $y = 2x + 3$.",
        "先读出直线与 $y$ 轴的交点（即 $x = 0$ 时的值），再看 $x$ 每增加 $1$，$y$ 增加多少。$y$ 就等于每次增加的量乘 $x$，再加上起始值。\n\n经过 $(0, 0)$、$(1, 4)$、$(2, 8)$ 的直线是 $y = 4x$。经过 $(0, 3)$、$(1, 5)$、$(2, 7)$ 的直线从 $3$ 出发，每个单位上升 $2$，所以是 $y = 2x + 3$。",
      ),
      generate(rng) {
        const k = rng.int(1, 5);
        const b = rng.bool() ? 0 : rng.int(1, 5);
        if (k === 1 && b === 0) return this.generate(rng);
        const { figure } = lineGraph(k, b);
        const answer = b ? `${k === 1 ? "" : k}x + ${b}` : `${k}x`;
        return {
          ...expressionProblem({
            prompt: t(
              "Write an equation for $y$ in terms of $x$ for the line on the graph.",
              "写出图中直线所表示的、用 $x$ 表示 $y$ 的方程。",
            ),
            answer,
            prefix: "y =",
            wrong: [b ? `${b}x + ${k}` : `x + ${k}`, b ? `${k}x` : `\\frac{x}{${k}}`],
            solution: t(
              `The line starts at $(0, ${b})$ and $y$ increases by $${k}$ each time $x$ increases by $1$, so $y = ${answer}$.`,
              `直线从 $(0, ${b})$ 出发，$x$ 每增加 $1$，$y$ 增加 $${k}$，所以 $y = ${answer}$。`,
            ),
          }),
          figure,
        };
      },
    },
  ],
);

/** grade6EquationTopics lists the 6th grade topics on equations, inequalities and two-variable relationships. */
export const grade6EquationTopics: readonly TopicDef[] = [
  identifyingSolutionsToLinearEquations,
  oneStepAdditionEquations,
  oneStepSubtractionEquations,
  oneStepMultiplicationEquations,
  oneStepMultiplicationEquationsContainingFractions,
  oneStepDivisionEquations,
  modelingRealWorldProblemsUsingOneStepEquations,
  solvingRealWorldProblemsUsingOneStepEquations,
  identifyingSolutionsToLinearInequalities,
  representingInequalitiesOnNumberLines,
  modelingRealWorldProblemsUsingInequalities,
  introductionToTwoVariableEquations,
  twoVariableEquationsSolvingForTheIndependentVariable,
  analyzingTwoVariableEquationsUsingTables,
  analyzingTwoVariableEquationsUsingGraphs,
];
