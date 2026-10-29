import type { TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { linear, num, paren, poly, Q } from "@ga/subject-math";

import { choiceProblem, numberProblem, steps } from "../problems.ts";

/** frac is the exact quotient a / b, for the values that mistakes produce. */
const frac = (a: number, b: number) => Q.of(a, b);

/** side writes a coefficient times x: side(-1) is "-x". */
const side = (a: number) => poly([a, "x"]);

export const oneStepEquationsAddition: TopicDef = {
  id: "one-step-equations-addition",
  title: t("One-Step Equations: Addition and Subtraction", "一步方程：加减"),
  summary: t("Solve $x + a = b$ by doing the same to both sides.", "通过在两边做相同的运算解 $x + a = b$。"),
  prerequisites: ["evaluating-expressions"],
  encompasses: [{ topic: "subtracting-integers", weight: 0.5 }],
  xp: 10,
  standards: ["CCSS.6.EE.B.7", "CCSS.7.EE.B.4.A"],
  knowledgePoints: [
    {
      id: "undoing-addition",
      title: t("Undoing addition and subtraction", "抵消加法与减法"),
      explanation: t(
        "An **equation** states that two expressions are equal. A **solution** is a value of the variable that makes it true. To **solve** an equation, get the variable alone by doing the same operation to **both sides**, which keeps them equal.\n\nAddition and subtraction undo each other:\n\n$$x + 7 = -2 \\;\\Rightarrow\\; x + 7 - 7 = -2 - 7 \\;\\Rightarrow\\; x = -9.$$\n\nCheck by substituting: $-9 + 7 = -2$. ✓",
        "**方程**表示两个式子相等。使方程成立的变量的值叫做方程的**解**。**解方程**就是在方程**两边**做相同的运算（两边仍然相等），使变量单独留在一边。\n\n加法和减法互相抵消：\n\n$$x + 7 = -2 \\;\\Rightarrow\\; x + 7 - 7 = -2 - 7 \\;\\Rightarrow\\; x = -9.$$\n\n代入检验：$-9 + 7 = -2$。✓",
      ),
      keyPrerequisites: ["subtracting-integers"],
      generate(rng) {
        const a = rng.nonZero(-20, 20);
        const b = rng.int(-30, 30);
        const x = b - a;
        const eq = `${linear(1, a)} = ${num(b)}`;
        const op = a > 0 ? `- ${a}` : `+ ${-a}`;
        return numberProblem({
          prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
          answer: x,
          solveFor: "x",
          wrong: [b + a, -x],
          solution: t(
            `${a > 0 ? `Subtract $${a}$ from` : `Add $${-a}$ to`} both sides: ${steps(`x = ${num(b)} ${op} = ${num(x)}`)}`,
            `两边同时${a > 0 ? `减去 $${a}$` : `加上 $${-a}$`}：${steps(`x = ${num(b)} ${op} = ${num(x)}`)}`,
          ),
        });
      },
    },
    {
      id: "variable-on-the-right",
      title: t("The variable on either side", "变量在任意一边"),
      explanation: t(
        "The variable may be on either side, and the constant may come first: $5 + x = 2$ is the same as $x + 5 = 2$, and $-4 = x - 6$ is solved by adding $6$ to both sides, giving $2 = x$, that is, $x = 2$.",
        "变量可以在等号的任意一边，常数也可以写在前面：$5 + x = 2$ 与 $x + 5 = 2$ 相同；解 $-4 = x - 6$ 时两边同时加 $6$，得 $2 = x$，即 $x = 2$。",
      ),
      generate(rng) {
        const a = rng.nonZero(-20, 20);
        const b = rng.int(-30, 30);
        const x = b - a;
        const left = rng.bool();
        const expr = left ? linear(1, a) : `${num(a)} + x`;
        const eq = rng.bool() ? `${num(b)} = ${expr}` : `${expr} = ${num(b)}`;
        const op = a > 0 ? `- ${a}` : `+ ${-a}`;
        return numberProblem({
          prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
          answer: x,
          solveFor: "x",
          wrong: [b + a, a - b],
          solution: t(
            `${a > 0 ? `Subtract $${a}$ from` : `Add $${-a}$ to`} both sides: ${steps(`x = ${num(b)} ${op} = ${num(x)}`)}`,
            `两边同时${a > 0 ? `减去 $${a}$` : `加上 $${-a}$`}：${steps(`x = ${num(b)} ${op} = ${num(x)}`)}`,
          ),
        });
      },
    },
  ],
};

export const oneStepEquationsMultiplication: TopicDef = {
  id: "one-step-equations-multiplication",
  title: t("One-Step Equations: Multiplication and Division", "一步方程：乘除"),
  summary: t("Solve $ax = b$ and $\\frac{x}{a} = b$.", "解 $ax = b$ 与 $\\frac{x}{a} = b$。"),
  prerequisites: ["one-step-equations-addition"],
  encompasses: [
    { topic: "dividing-integers", weight: 0.5 },
    { topic: "one-step-equations-addition", weight: 0.3 },
  ],
  xp: 10,
  standards: ["CCSS.6.EE.B.7", "CCSS.7.EE.B.4.A"],
  knowledgePoints: [
    {
      id: "dividing-both-sides",
      title: t("Dividing both sides", "两边同除以一个数"),
      explanation: t(
        "Multiplication and division undo each other. To solve $-6x = 42$, divide both sides by the coefficient $-6$:\n\n$$\\frac{-6x}{-6} = \\frac{42}{-6} \\;\\Rightarrow\\; x = -7.$$\n\nFor $-x = 5$, the coefficient is $-1$, so $x = -5$.",
        "乘法和除法互相抵消。解 $-6x = 42$ 时，两边同时除以系数 $-6$：\n\n$$\\frac{-6x}{-6} = \\frac{42}{-6} \\;\\Rightarrow\\; x = -7.$$\n\n对于 $-x = 5$，系数是 $-1$，所以 $x = -5$。",
      ),
      keyPrerequisites: ["dividing-integers"],
      generate(rng) {
        const a = rng.bool(0.12) ? -1 : rng.sign() * rng.int(2, 12);
        const x = rng.nonZero(-12, 12);
        const b = a * x;
        const eq = `${side(a)} = ${num(b)}`;
        return numberProblem({
          prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
          answer: x,
          solveFor: "x",
          wrong: [-x, b - a, b * a],
          solution: t(
            `Divide both sides by $${num(a)}$: ${steps(`x = \\frac{${num(b)}}{${num(a)}} = ${num(x)}`)}`,
            `两边同时除以 $${num(a)}$：${steps(`x = \\frac{${num(b)}}{${num(a)}} = ${num(x)}`)}`,
          ),
        });
      },
    },
    {
      id: "multiplying-both-sides",
      title: t("Multiplying both sides", "两边同乘以一个数"),
      explanation: t(
        "When the variable is divided by a number, multiply both sides by that number:\n\n$$\\frac{x}{4} = -3 \\;\\Rightarrow\\; 4 \\cdot \\frac{x}{4} = 4 \\cdot (-3) \\;\\Rightarrow\\; x = -12.$$\n\n$-\\frac{x}{4}$ means $\\frac{x}{-4}$, so multiply both sides by $-4$.",
        "当变量被一个数除时，两边同时乘以这个数：\n\n$$\\frac{x}{4} = -3 \\;\\Rightarrow\\; 4 \\cdot \\frac{x}{4} = 4 \\cdot (-3) \\;\\Rightarrow\\; x = -12.$$\n\n$-\\frac{x}{4}$ 表示 $\\frac{x}{-4}$，所以两边同时乘以 $-4$。",
      ),
      keyPrerequisites: ["multiplying-integers"],
      generate(rng) {
        const d = rng.int(2, 9);
        const negative = rng.bool(0.3);
        const a = negative ? -d : d;
        const b = rng.nonZero(-12, 12);
        const x = a * b;
        const eq = `${negative ? "-" : ""}\\frac{x}{${d}} = ${num(b)}`;
        return numberProblem({
          prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
          answer: x,
          solveFor: "x",
          wrong: [-x, frac(b, a), b + d],
          solution: t(
            `Multiply both sides by $${num(a)}$: ${steps(`x = ${paren(a)} \\cdot ${paren(b)} = ${num(x)}`)}`,
            `两边同时乘以 $${num(a)}$：${steps(`x = ${paren(a)} \\cdot ${paren(b)} = ${num(x)}`)}`,
          ),
        });
      },
    },
  ],
};

export const twoStepEquations: TopicDef = {
  id: "two-step-equations",
  title: t("Two-Step Equations", "两步方程"),
  summary: t("Solve $ax + b = c$.", "解 $ax + b = c$。"),
  prerequisites: ["one-step-equations-multiplication"],
  encompasses: [
    { topic: "one-step-equations-multiplication", weight: 1 },
    { topic: "one-step-equations-addition", weight: 1 },
  ],
  xp: 12,
  standards: ["CCSS.7.EE.B.4.A"],
  knowledgePoints: [
    {
      id: "undo-in-reverse-order",
      title: t("Undoing operations in reverse order", "按相反顺序抵消运算"),
      explanation: t(
        "In $3x - 5$, $x$ is first multiplied by $3$, then $5$ is subtracted. To solve, undo these operations in **reverse order**: first add $5$, then divide by $3$.\n\n$$3x - 5 = 16 \\;\\Rightarrow\\; 3x = 21 \\;\\Rightarrow\\; x = 7.$$",
        "在 $3x - 5$ 中，$x$ 先乘以 $3$，再减去 $5$。解方程时按**相反的顺序**抵消这些运算：先加 $5$，再除以 $3$。\n\n$$3x - 5 = 16 \\;\\Rightarrow\\; 3x = 21 \\;\\Rightarrow\\; x = 7.$$",
      ),
      keyPrerequisites: ["one-step-equations-addition", "one-step-equations-multiplication"],
      generate(rng) {
        const a = rng.sign() * rng.int(2, 9);
        const x = rng.nonZero(-10, 10);
        const b = rng.nonZero(-20, 20);
        const c = a * x + b;
        const eq = `${linear(a, b)} = ${num(c)}`;
        return numberProblem({
          prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
          answer: x,
          solveFor: "x",
          wrong: [frac(c + b, a), -x, frac(c, a).sub(Q.of(b))],
          solution: t(
            `${b > 0 ? `Subtract $${b}$ from` : `Add $${-b}$ to`} both sides, then divide by $${num(a)}$: ${steps(`${side(a)} = ${num(c - b)}`, `x = ${num(x)}`)}`,
            `两边同时${b > 0 ? `减去 $${b}$` : `加上 $${-b}$`}，再同时除以 $${num(a)}$：${steps(`${side(a)} = ${num(c - b)}`, `x = ${num(x)}`)}`,
          ),
        });
      },
    },
    {
      id: "other-arrangements",
      title: t("Other arrangements", "其他形式"),
      explanation: t(
        "The constant may come first, and the variable may be divided rather than multiplied. Still undo the addition or subtraction first:\n\n$$8 - 2x = 14 \\;\\Rightarrow\\; -2x = 6 \\;\\Rightarrow\\; x = -3, \\qquad \\frac{x}{5} + 1 = -3 \\;\\Rightarrow\\; \\frac{x}{5} = -4 \\;\\Rightarrow\\; x = -20.$$",
        "常数可能写在前面，变量也可能是被除而不是被乘。仍然先抵消加减：\n\n$$8 - 2x = 14 \\;\\Rightarrow\\; -2x = 6 \\;\\Rightarrow\\; x = -3, \\qquad \\frac{x}{5} + 1 = -3 \\;\\Rightarrow\\; \\frac{x}{5} = -4 \\;\\Rightarrow\\; x = -20.$$",
      ),
      generate(rng) {
        const b = rng.nonZero(-20, 20);
        if (rng.bool()) {
          const a = -rng.int(1, 9);
          const x = rng.nonZero(-10, 10);
          const c = b + a * x;
          const eq = `${num(b)} ${a === -1 ? "- x" : `- ${-a}x`} = ${num(c)}`;
          return numberProblem({
            prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
            answer: x,
            solveFor: "x",
            wrong: [-x, frac(c + b, a), frac(c - b, -a)],
            solution: t(
              `${b > 0 ? `Subtract $${b}$ from` : `Add $${-b}$ to`} both sides, then divide by $${num(a)}$: ${steps(`${side(a)} = ${num(c - b)}`, `x = ${num(x)}`)}`,
              `两边同时${b > 0 ? `减去 $${b}$` : `加上 $${-b}$`}，再同时除以 $${num(a)}$：${steps(`${side(a)} = ${num(c - b)}`, `x = ${num(x)}`)}`,
            ),
          });
        }
        const d = rng.int(2, 6);
        const k = rng.nonZero(-9, 9);
        const x = d * k;
        const c = k + b;
        const eq = `\\frac{x}{${d}} ${b > 0 ? `+ ${b}` : `- ${-b}`} = ${num(c)}`;
        return numberProblem({
          prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
          answer: x,
          solveFor: "x",
          wrong: [d * c - b, d * (c + b), k],
          solution: t(
            `${b > 0 ? `Subtract $${b}$ from` : `Add $${-b}$ to`} both sides, then multiply by $${d}$: ${steps(`\\frac{x}{${d}} = ${num(k)}`, `x = ${num(x)}`)}`,
            `两边同时${b > 0 ? `减去 $${b}$` : `加上 $${-b}$`}，再同时乘以 $${d}$：${steps(`\\frac{x}{${d}} = ${num(k)}`, `x = ${num(x)}`)}`,
          ),
        });
      },
    },
  ],
};

export const equationsWithVariablesOnBothSides: TopicDef = {
  id: "equations-with-variables-on-both-sides",
  title: t("Equations with Variables on Both Sides", "两边都有变量的方程"),
  summary: t(
    "Solve $ax + b = cx + d$, and recognize equations with no solution or infinitely many.",
    "解 $ax + b = cx + d$，识别无解和有无穷多解的方程。",
  ),
  prerequisites: ["two-step-equations", "combining-like-terms"],
  encompasses: [
    { topic: "two-step-equations", weight: 1 },
    { topic: "combining-like-terms", weight: 0.5 },
  ],
  xp: 15,
  standards: ["CCSS.8.EE.C.7"],
  knowledgePoints: [
    {
      id: "collecting-variables",
      title: t("Collecting the variable on one side", "把变量移到一边"),
      explanation: t(
        "Subtract a variable term from both sides so that the variable appears on one side only, then solve the two-step equation that remains:\n\n$$5x - 4 = 2x + 11 \\;\\Rightarrow\\; 3x - 4 = 11 \\;\\Rightarrow\\; 3x = 15 \\;\\Rightarrow\\; x = 5.$$",
        "两边同时减去一个含变量的项，使变量只出现在一边，再解剩下的两步方程：\n\n$$5x - 4 = 2x + 11 \\;\\Rightarrow\\; 3x - 4 = 11 \\;\\Rightarrow\\; 3x = 15 \\;\\Rightarrow\\; x = 5.$$",
      ),
      keyPrerequisites: ["two-step-equations", "combining-like-terms"],
      generate(rng) {
        const a = rng.nonZero(-9, 9);
        let c = rng.nonZero(-9, 9);
        while (c === a) c = rng.nonZero(-9, 9);
        const x = rng.nonZero(-10, 10);
        const b = rng.nonZero(-20, 20);
        const d = (a - c) * x + b;
        const eq = `${linear(a, b)} = ${linear(c, d)}`;
        return numberProblem({
          prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
          answer: x,
          solveFor: "x",
          wrong: [-x, ...(a + c !== 0 ? [frac(d - b, a + c)] : []), frac(d + b, a - c)],
          solution: t(
            `${c > 0 ? `Subtract $${side(c)}$ from` : `Add $${side(-c)}$ to`} both sides, then solve: ${steps(`${linear(a - c, b)} = ${num(d)}`, `${side(a - c)} = ${num(d - b)}`, `x = ${num(x)}`)}`,
            `两边同时${c > 0 ? `减去 $${side(c)}$` : `加上 $${side(-c)}$`}，再求解：${steps(`${linear(a - c, b)} = ${num(d)}`, `${side(a - c)} = ${num(d - b)}`, `x = ${num(x)}`)}`,
          ),
        });
      },
    },
    {
      id: "number-of-solutions",
      title: t("No solution or infinitely many", "无解与无穷多解"),
      explanation: t(
        "Collecting the variable can make it disappear. Then the equation is either\n\n- always true, such as $3 = 3$: **every** number is a solution (infinitely many solutions), or\n- never true, such as $3 = -1$: there is **no solution**.\n\nIf the coefficients of $x$ on the two sides differ, there is exactly one solution.",
        "把变量移到一边时，变量可能会被消去。这时方程要么\n\n- 恒成立，例如 $3 = 3$：**任何**数都是解（有无穷多个解）；\n- 永不成立，例如 $3 = -1$：方程**无解**。\n\n如果两边 $x$ 的系数不同，方程恰有一个解。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const a = rng.nonZero(-9, 9);
        const b = rng.nonZero(-15, 15);
        const c = kind === 0 ? a + rng.sign() * rng.int(1, 4) : a;
        let d = kind === 1 ? b : rng.nonZero(-15, 15);
        if (kind === 2 && d === b) d = b + rng.sign() * rng.int(1, 5);
        const k = rng.int(2, 3);
        // Write the left side unsimplified for the identity case so that it is not visibly the same expression.
        const left = kind === 1 ? `${k}(${linear(a, b)}) - ${k - 1 === 1 ? "" : k - 1}(${linear(a, b)})` : linear(a, b);
        const eq = `${left} = ${linear(c, d)}`;
        const reason = [
          t(
            `The coefficients of $x$, $${num(a)}$ and $${num(c)}$, differ, so there is exactly one solution.`,
            `$x$ 的系数 $${num(a)}$ 与 $${num(c)}$ 不同，所以方程恰有一个解。`,
          ),
          t(
            `The left side simplifies to $${linear(a, b)}$, the same as the right side, so the equation is true for every $x$.`,
            `左边化简为 $${linear(a, b)}$，与右边相同，所以方程对任何 $x$ 都成立。`,
          ),
          t(
            `Subtracting $${side(a)}$ from both sides leaves $${num(b)} = ${num(d)}$, which is false, so there is no solution.`,
            `两边同时减去 $${side(a)}$，得到 $${num(b)} = ${num(d)}$，这不成立，所以方程无解。`,
          ),
        ][kind]!;
        return choiceProblem({
          prompt: t(`How many solutions does $${eq}$ have?`, `方程 $${eq}$ 有几个解？`),
          options: [t("Exactly one", "恰有一个"), t("Infinitely many", "无穷多个"), t("None", "无解")],
          correct: kind,
          solution: reason,
        });
      },
    },
  ],
};

export const equationsWithParentheses: TopicDef = {
  id: "equations-with-parentheses",
  title: t("Equations with Parentheses", "含括号的方程"),
  summary: t("Expand parentheses, then solve linear equations.", "先去括号，再解一元一次方程。"),
  prerequisites: ["equations-with-variables-on-both-sides", "simplifying-expressions"],
  encompasses: [
    { topic: "equations-with-variables-on-both-sides", weight: 0.8 },
    { topic: "simplifying-expressions", weight: 0.8 },
  ],
  xp: 15,
  standards: ["CCSS.8.EE.C.7.B"],
  knowledgePoints: [
    {
      id: "expand-then-solve",
      title: t("Expanding, then solving", "先展开，再求解"),
      explanation: t(
        "When the variable is inside parentheses, expand with the distributive property first, then solve:\n\n$$-3(x - 4) = 21 \\;\\Rightarrow\\; -3x + 12 = 21 \\;\\Rightarrow\\; -3x = 9 \\;\\Rightarrow\\; x = -3.$$",
        "变量在括号里时，先用分配律展开，再求解：\n\n$$-3(x - 4) = 21 \\;\\Rightarrow\\; -3x + 12 = 21 \\;\\Rightarrow\\; -3x = 9 \\;\\Rightarrow\\; x = -3.$$",
      ),
      keyPrerequisites: ["distributive-property", "two-step-equations"],
      generate(rng) {
        const a = rng.sign() * rng.int(2, 9);
        const b = rng.nonZero(-9, 9);
        const x = rng.nonZero(-10, 10);
        const c = a * (x + b);
        const eq = `${num(a)}(${linear(1, b)}) = ${num(c)}`;
        return numberProblem({
          prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
          answer: x,
          solveFor: "x",
          wrong: [frac(c - b, a), frac(c, a).add(Q.of(b)), -x],
          solution: t(
            `Expand, then solve: ${steps(`${linear(a, a * b)} = ${num(c)}`, `${side(a)} = ${num(c - a * b)}`, `x = ${num(x)}`)}`,
            `先展开，再求解：${steps(`${linear(a, a * b)} = ${num(c)}`, `${side(a)} = ${num(c - a * b)}`, `x = ${num(x)}`)}`,
          ),
        });
      },
    },
    {
      id: "parentheses-and-variables-on-both-sides",
      title: t("Parentheses and variables on both sides", "含括号且两边都有变量"),
      explanation: t(
        "Expand every parenthesis, combine like terms on each side, then collect the variable on one side:\n\n$$2(3x + 1) = 4x - 8 \\;\\Rightarrow\\; 6x + 2 = 4x - 8 \\;\\Rightarrow\\; 2x = -10 \\;\\Rightarrow\\; x = -5.$$",
        "展开所有括号，分别合并两边的同类项，再把变量移到一边：\n\n$$2(3x + 1) = 4x - 8 \\;\\Rightarrow\\; 6x + 2 = 4x - 8 \\;\\Rightarrow\\; 2x = -10 \\;\\Rightarrow\\; x = -5.$$",
      ),
      generate(rng) {
        const a = rng.sign() * rng.int(2, 6);
        const b = rng.nonZero(-5, 5);
        const c = rng.nonZero(-9, 9);
        let d = rng.nonZero(-9, 9);
        while (d === a * b) d = rng.nonZero(-9, 9);
        const x = rng.nonZero(-8, 8);
        const e = a * (b * x + c) - d * x;
        const eq = `${num(a)}(${linear(b, c)}) = ${linear(d, e)}`;
        const k = a * b - d;
        return numberProblem({
          prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
          answer: x,
          solveFor: "x",
          wrong: [frac(e - c, k), -x, ...(a * b + d !== 0 ? [frac(e - a * c, a * b + d)] : [])],
          solution: t(
            `Expand, collect $x$ on the left, then solve: ${steps(`${linear(a * b, a * c)} = ${linear(d, e)}`, `${side(k)} = ${num(e - a * c)}`, `x = ${num(x)}`)}`,
            `先展开，把 $x$ 移到左边，再求解：${steps(`${linear(a * b, a * c)} = ${linear(d, e)}`, `${side(k)} = ${num(e - a * c)}`, `x = ${num(x)}`)}`,
          ),
        });
      },
    },
  ],
};

/** equationTopics are the topics of the equations unit, in teaching order. */
export const equationTopics: readonly TopicDef[] = [
  oneStepEquationsAddition,
  oneStepEquationsMultiplication,
  twoStepEquations,
  equationsWithVariablesOnBothSides,
  equationsWithParentheses,
];
