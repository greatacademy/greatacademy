import type { TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { linear, num, paren, poly } from "@ga/subject-math";

import { expressionProblem, numberProblem, steps } from "../problems.ts";

/** times writes a coefficient multiplying a parenthesized value: times(3, -2) is "3(-2)", times(-1, 4) is "-(4)". */
function times(a: number, value: number): string {
  const p = `(${num(value)})`;
  return a === 1 ? p : a === -1 ? `-${p}` : `${num(a)}${p}`;
}

/** tail writes terms that continue an expression, always with a leading sign: tail([-2, "x"]) is "- 2x". */
function tail(...terms: readonly (readonly [number, string])[]): string {
  const s = poly(...terms);
  return s.startsWith("-") ? `- ${s.slice(1)}` : `+ ${s}`;
}

/** factor writes a coefficient in front of parentheses: factor(-1, "x + 2") is "-(x + 2)". */
function factor(a: number, inner: string): string {
  return `${a === 1 ? "" : a === -1 ? "-" : num(a)}(${inner})`;
}

export const evaluatingExpressions: TopicDef = {
  id: "evaluating-expressions",
  title: t("Evaluating Algebraic Expressions", "代数式求值"),
  summary: t("Substitute integers for variables and evaluate.", "用整数代入变量并求值。"),
  prerequisites: ["order-of-operations-with-integers"],
  encompasses: [{ topic: "order-of-operations-with-integers", weight: 0.6 }],
  xp: 12,
  standards: ["CCSS.6.EE.A.2.C"],
  knowledgePoints: [
    {
      id: "one-variable",
      title: t("Substituting a value", "代入一个值"),
      explanation: t(
        "A **variable** is a letter that stands for a number, and an **algebraic expression** such as $3x - 5$ combines numbers and variables with operations. A number written next to a variable is multiplied by it: $3x$ means $3 \\cdot x$.\n\nTo **evaluate** an expression, replace each variable by its value **in parentheses**, then follow the order of operations. For $x = -4$: $3x - 5 = 3(-4) - 5 = -12 - 5 = -17$.",
        "**变量**是代表数的字母，**代数式**（例如 $3x - 5$）用运算把数和变量连接起来。数紧挨着变量书写表示相乘：$3x$ 表示 $3 \\cdot x$。\n\n**求值**时，把每个变量替换成它的值，并**加上括号**，然后按运算顺序计算。当 $x = -4$ 时：$3x - 5 = 3(-4) - 5 = -12 - 5 = -17$。",
      ),
      keyPrerequisites: ["order-of-operations-with-integers"],
      generate(rng) {
        const a = rng.nonZero(-9, 9);
        const b = rng.nonZero(-20, 20);
        const x = rng.nonZero(-9, 9);
        const v = a * x + b;
        const expr = linear(a, b);
        return numberProblem({
          prompt: t(`Evaluate $${expr}$ when $x = ${num(x)}$.`, `当 $x = ${num(x)}$ 时，求 $${expr}$ 的值。`),
          answer: v,
          wrong: [-a * x + b, a + x + b, a * x - b],
          solution: t(
            `Substitute $${num(x)}$ for $x$: ${steps(`${expr} = ${times(a, x)} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${num(a * x)} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${num(v)}`)}`,
            `把 $x$ 替换为 $${num(x)}$：${steps(`${expr} = ${times(a, x)} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${num(a * x)} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${num(v)}`)}`,
          ),
        });
      },
    },
    {
      id: "powers-and-two-variables",
      title: t("Powers and several variables", "乘方与多个变量"),
      explanation: t(
        "Substitute every variable before computing. Parentheses around a negative value matter most with exponents: for $x = -3$, $x^2 = (-3)^2 = 9$, not $-9$.\n\nFor example, with $x = -3$ and $y = 2$: $x^2 - 4y = (-3)^2 - 4(2) = 9 - 8 = 1$.",
        "先代入所有变量，再计算。负数代入时加括号在乘方中尤为重要：当 $x = -3$ 时，$x^2 = (-3)^2 = 9$，而不是 $-9$。\n\n例如 $x = -3$，$y = 2$ 时：$x^2 - 4y = (-3)^2 - 4(2) = 9 - 8 = 1$。",
      ),
      keyPrerequisites: ["powers-of-integers"],
      generate(rng) {
        const x = rng.bool(0.75) ? -rng.int(1, 6) : rng.int(1, 6);
        const y = rng.nonZero(-9, 9);
        const b = rng.nonZero(-6, 6);
        const v = x * x + b * y;
        const expr = poly([1, "x^{2}"], [b, "y"]);
        return numberProblem({
          prompt: t(
            `Evaluate $${expr}$ when $x = ${num(x)}$ and $y = ${num(y)}$.`,
            `当 $x = ${num(x)}$，$y = ${num(y)}$ 时，求 $${expr}$ 的值。`,
          ),
          answer: v,
          wrong: [-(x * x) + b * y, 2 * x + b * y, x * x - b * y],
          solution: t(
            `Substitute both values, keeping parentheses: ${steps(`${expr} = (${num(x)})^{2} ${b < 0 ? "-" : "+"} ${times(Math.abs(b), y)} = ${x * x} ${b < 0 ? "-" : "+"} ${paren(Math.abs(b) * y)} = ${num(v)}`)}`,
            `代入两个值，并保留括号：${steps(`${expr} = (${num(x)})^{2} ${b < 0 ? "-" : "+"} ${times(Math.abs(b), y)} = ${x * x} ${b < 0 ? "-" : "+"} ${paren(Math.abs(b) * y)} = ${num(v)}`)}`,
          ),
        });
      },
    },
  ],
};

const letters = ["x", "y", "n", "t", "a", "m"] as const;

export const combiningLikeTerms: TopicDef = {
  id: "combining-like-terms",
  title: t("Combining Like Terms", "合并同类项"),
  summary: t("Simplify sums of terms by combining like terms.", "通过合并同类项化简多项式。"),
  prerequisites: ["evaluating-expressions"],
  encompasses: [{ topic: "subtracting-integers", weight: 0.5 }],
  xp: 12,
  standards: ["CCSS.7.EE.A.1"],
  knowledgePoints: [
    {
      id: "like-terms",
      title: t("Adding like terms", "同类项相加"),
      explanation: t(
        "The **terms** of an expression are the parts joined by $+$ and $-$; the sign in front belongs to the term. In $4x - 7x$, the terms are $4x$ and $-7x$. **Like terms** have exactly the same variable part, so they can be combined by adding their **coefficients**:\n\n$$4x - 7x = (4 - 7)x = -3x.$$\n\nA variable on its own has coefficient $1$: $x + 5x = 6x$. Write $1x$ as $x$ and $-1x$ as $-x$.",
        "式子中由 $+$ 和 $-$ 连接起来的各部分叫做**项**，前面的符号属于这一项。$4x - 7x$ 的项是 $4x$ 和 $-7x$。变量部分完全相同的项叫做**同类项**，合并时把它们的**系数**相加：\n\n$$4x - 7x = (4 - 7)x = -3x.$$\n\n单独一个变量的系数是 $1$：$x + 5x = 6x$。$1x$ 要写成 $x$，$-1x$ 要写成 $-x$。",
      ),
      keyPrerequisites: ["subtracting-integers"],
      generate(rng) {
        const v = rng.pick(letters);
        const a = rng.nonZero(-12, 12);
        let b = rng.nonZero(-12, 12);
        while (a + b === 0) b = rng.nonZero(-12, 12);
        const expr = poly([a, v], [b, v]);
        const answer = poly([a + b, v]);
        return expressionProblem({
          prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
          answer,
          simplified: true,
          wrong: [poly([a - b, v]), poly([a + b, `${v}^{2}`]), expr],
          solution: t(
            `Both terms have the variable part $${v}$, so add the coefficients: ${steps(`${expr} = (${num(a)} ${b < 0 ? "-" : "+"} ${Math.abs(b)})${v} = ${answer}`)}`,
            `两项的变量部分都是 $${v}$，把系数相加：${steps(`${expr} = (${num(a)} ${b < 0 ? "-" : "+"} ${Math.abs(b)})${v} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "terms-and-constants",
      title: t("Variable terms and constants", "含变量的项与常数项"),
      explanation: t(
        "A **constant** term has no variable. Constants are like terms of each other, but not of variable terms. Group the like terms, keeping each sign with its term, then combine:\n\n$$5x - 3 - 2x + 8 = (5x - 2x) + (-3 + 8) = 3x + 5.$$",
        "不含变量的项叫做**常数项**。常数项彼此是同类项，但与含变量的项不是同类项。把同类项归在一起（每一项连同它前面的符号），然后合并：\n\n$$5x - 3 - 2x + 8 = (5x - 2x) + (-3 + 8) = 3x + 5.$$",
      ),
      generate(rng) {
        const v = rng.pick(letters);
        const a = rng.nonZero(-9, 9);
        let c = rng.nonZero(-9, 9);
        while (a + c === 0) c = rng.nonZero(-9, 9);
        const b = rng.nonZero(-15, 15);
        const d = rng.nonZero(-15, 15);
        const terms: [number, string][] = [
          [a, v],
          [b, ""],
          [c, v],
          [d, ""],
        ];
        const expr = poly(...(rng.bool() ? terms : [terms[1]!, terms[0]!, terms[3]!, terms[2]!]));
        const answer = poly([a + c, v], [b + d, ""]);
        return expressionProblem({
          prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
          answer,
          simplified: true,
          wrong: [
            poly([a + b + c + d, v]),
            poly([a - c, v], [b + d, ""]),
            poly([a + c, v], [b - d, ""]),
            poly([a, v], [c, v], [b + d, ""]),
          ],
          solution: t(
            `Group the like terms: ${steps(`${expr} = (${poly([a, v], [c, v])}) + (${poly([b, ""], [d, ""])}) = ${answer}`)}`,
            `把同类项归在一起：${steps(`${expr} = (${poly([a, v], [c, v])}) + (${poly([b, ""], [d, ""])}) = ${answer}`)}`,
          ),
        });
      },
    },
  ],
};

export const distributiveProperty: TopicDef = {
  id: "distributive-property",
  title: t("The Distributive Property", "乘法分配律"),
  summary: t("Expand expressions such as $a(bx + c)$.", "展开形如 $a(bx + c)$ 的式子。"),
  prerequisites: ["evaluating-expressions"],
  encompasses: [{ topic: "multiplying-integers", weight: 0.5 }],
  xp: 12,
  standards: ["CCSS.7.EE.A.1"],
  knowledgePoints: [
    {
      id: "positive-factor",
      title: t("Distributing a positive number", "分配一个正数"),
      explanation: t(
        "The **distributive property** says $a(b + c) = ab + ac$: the factor outside multiplies **every** term inside. For example,\n\n$$4(2x - 5) = 4 \\cdot 2x + 4 \\cdot (-5) = 8x - 20.$$",
        "**乘法分配律**：$a(b + c) = ab + ac$，括号外的因数要乘以括号内的**每一项**。例如\n\n$$4(2x - 5) = 4 \\cdot 2x + 4 \\cdot (-5) = 8x - 20.$$",
      ),
      keyPrerequisites: ["multiplying-integers"],
      generate(rng) {
        const a = rng.int(2, 9);
        const b = rng.nonZero(-9, 9);
        const c = rng.nonZero(-12, 12);
        const inner = linear(b, c);
        const expr = factor(a, inner);
        const answer = linear(a * b, a * c);
        return expressionProblem({
          prompt: t(`Expand $${expr}$.`, `展开 $${expr}$。`),
          answer,
          simplified: true,
          wrong: [linear(a * b, c), linear(b, a * c), expr],
          solution: t(
            `Multiply each term by $${a}$: ${steps(`${expr} = ${a} \\cdot ${paren(b)}x + ${a} \\cdot ${paren(c)} = ${answer}`)}`,
            `用 $${a}$ 乘以每一项：${steps(`${expr} = ${a} \\cdot ${paren(b)}x + ${a} \\cdot ${paren(c)} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "negative-factor",
      title: t("Distributing a negative number", "分配一个负数"),
      explanation: t(
        "When the factor outside is negative, it changes the sign of **every** term inside:\n\n$$-3(x - 4) = -3 \\cdot x + (-3)(-4) = -3x + 12.$$\n\nA minus sign in front of parentheses is a factor of $-1$: $-(2x - 7) = -2x + 7$.",
        "括号外的因数是负数时，括号内**每一项**的符号都要改变：\n\n$$-3(x - 4) = -3 \\cdot x + (-3)(-4) = -3x + 12.$$\n\n括号前的负号相当于因数 $-1$：$-(2x - 7) = -2x + 7$。",
      ),
      generate(rng) {
        const a = rng.bool(0.2) ? -1 : -rng.int(2, 9);
        const b = rng.nonZero(-9, 9);
        const c = rng.nonZero(-12, 12);
        const inner = linear(b, c);
        const expr = factor(a, inner);
        const answer = linear(a * b, a * c);
        return expressionProblem({
          prompt: t(`Expand $${expr}$.`, `展开 $${expr}$。`),
          answer,
          simplified: true,
          wrong: [linear(a * b, -a * c), linear(a * b, c), linear(-a * b, -a * c)],
          solution: t(
            `Multiply each term by $${num(a)}$: ${steps(`${expr} = ${paren(a)} \\cdot ${paren(b)}x + ${paren(a)} \\cdot ${paren(c)} = ${answer}`)}`,
            `用 $${num(a)}$ 乘以每一项：${steps(`${expr} = ${paren(a)} \\cdot ${paren(b)}x + ${paren(a)} \\cdot ${paren(c)} = ${answer}`)}`,
          ),
        });
      },
    },
  ],
};

export const simplifyingExpressions: TopicDef = {
  id: "simplifying-expressions",
  title: t("Simplifying Linear Expressions", "化简一次式"),
  summary: t("Expand parentheses and combine like terms.", "去括号并合并同类项。"),
  prerequisites: ["combining-like-terms", "distributive-property"],
  encompasses: [
    { topic: "combining-like-terms", weight: 0.8 },
    { topic: "distributive-property", weight: 0.8 },
  ],
  xp: 12,
  standards: ["CCSS.7.EE.A.1"],
  knowledgePoints: [
    {
      id: "expand-then-combine",
      title: t("Expanding, then combining", "先展开，再合并"),
      explanation: t(
        "To simplify an expression with parentheses, first expand using the distributive property, then combine like terms:\n\n$$2(3x - 1) + 4x + 9 = 6x - 2 + 4x + 9 = 10x + 7.$$",
        "化简含括号的式子时，先用分配律展开，再合并同类项：\n\n$$2(3x - 1) + 4x + 9 = 6x - 2 + 4x + 9 = 10x + 7.$$",
      ),
      keyPrerequisites: ["distributive-property", "combining-like-terms"],
      generate(rng) {
        const a = rng.int(2, 7);
        const b = rng.nonZero(-6, 6);
        const c = rng.nonZero(-9, 9);
        let d = rng.nonZero(-9, 9);
        while (a * b + d === 0) d = rng.nonZero(-9, 9);
        const e = rng.nonZero(-12, 12);
        const expr = `${factor(a, linear(b, c))} ${tail([d, "x"], [e, ""])}`;
        const answer = linear(a * b + d, a * c + e);
        const expanded = poly([a * b, "x"], [a * c, ""], [d, "x"], [e, ""]);
        return expressionProblem({
          prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
          answer,
          simplified: true,
          wrong: [linear(a * b + d, c + e), linear(b + d, a * c + e), expanded],
          solution: t(
            `Expand, then combine like terms: ${steps(`${expr} = ${expanded} = ${answer}`)}`,
            `先展开，再合并同类项：${steps(`${expr} = ${expanded} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "subtracting-parentheses",
      title: t("Subtracting an expression in parentheses", "减去括号里的式子"),
      explanation: t(
        "A minus sign in front of parentheses multiplies every term inside by $-1$, so every sign inside changes:\n\n$$5x + 3 - (2x - 6) = 5x + 3 - 2x + 6 = 3x + 9.$$",
        "括号前的减号把括号内每一项都乘以 $-1$，所以括号内每一项都要变号：\n\n$$5x + 3 - (2x - 6) = 5x + 3 - 2x + 6 = 3x + 9.$$",
      ),
      generate(rng) {
        const a = rng.nonZero(-9, 9);
        const b = rng.nonZero(-12, 12);
        let c = rng.nonZero(-9, 9);
        while (a - c === 0) c = rng.nonZero(-9, 9);
        const d = rng.nonZero(-12, 12);
        const expr = `${linear(a, b)} - (${linear(c, d)})`;
        const answer = linear(a - c, b - d);
        const expanded = poly([a, "x"], [b, ""], [-c, "x"], [-d, ""]);
        return expressionProblem({
          prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
          answer,
          simplified: true,
          wrong: [linear(a - c, b + d), linear(a + c, b + d), expanded],
          solution: t(
            `Change the sign of every term in the parentheses, then combine: ${steps(`${expr} = ${expanded} = ${answer}`)}`,
            `把括号内每一项变号，再合并：${steps(`${expr} = ${expanded} = ${answer}`)}`,
          ),
        });
      },
    },
  ],
};

/** expressionTopics are the topics of the expressions unit, in teaching order. */
export const expressionTopics: readonly TopicDef[] = [
  evaluatingExpressions,
  combiningLikeTerms,
  distributiveProperty,
  simplifyingExpressions,
];
