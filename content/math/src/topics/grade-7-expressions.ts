import type { KnowledgePointDef, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { linear, num, paren, poly, Q } from "@ga/subject-math";

import { expressionProblem, numberProblem, steps } from "../problems.ts";
import { mathText, pickChoice } from "./grade-4-fractions.ts";

// 7th Grade Math: rewriting linear expressions with the distributive law, subtracted groups and fractional
// coefficients, factoring numerical expressions, and evaluating rational expressions.

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

/** Term is a coefficient and a variable part: [3, "x"] is 3x, and [-5, ""] is the constant −5. */
type Term = readonly [Q | number, string];

/** variables are the letters used for unknowns; none of them reads as an English word. */
const variables = ["x", "y", "n", "m", "p", "k", "t", "w"] as const;

/** pickVar draws a variable letter. */
const pickVar = (rng: Rng) => rng.pick(variables);

/** twoVars draws two different variable letters in alphabetical order. */
function twoVars(rng: Rng): [string, string] {
  const [a, b] = rng.sample([...variables], 2) as [string, string];
  return a < b ? [a, b] : [b, a];
}

/** gcd is the greatest common divisor of two integers. */
const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

/** toQ reads a coefficient as a rational number. */
const toQ = (c: Q | number): Q => (c instanceof Q ? c : Q.of(c));

/** scale multiplies every term by k. */
const scale = (k: Q | number, terms: readonly Term[]): Term[] => terms.map(([c, v]) => [toQ(c).mul(toQ(k)), v]);

/** factor writes a coefficient in front of parentheses: factor(-1, "x + 2") is "-(x + 2)". */
const factor = (a: number, inner: string) => `${a === 1 ? "" : a === -1 ? "-" : num(a)}(${inner})`;

/** termTimes writes k times one term as a product: termTimes(-3, [-2, "y"]) is "(-3) \cdot (-2y)". */
const termTimes = (k: Q | number, [c, v]: Term) => {
  const term = poly([c, v]);
  return `${paren(k)} \\cdot ${toQ(c).sign() < 0 ? `(${term})` : term}`;
};

/** products writes k times each term, joined by plus signs: the middle step of distributing. */
const products = (k: Q | number, terms: readonly Term[]) => terms.map((x) => termTimes(k, x)).join(" + ");

/** tail writes terms that continue an expression, with a leading sign: tail([-2, "x"]) is "- 2x". */
function tail(...terms: readonly Term[]): string {
  const s = poly(...terms);
  return s.startsWith("-") ? `- ${s.slice(1)}` : `+ ${s}`;
}

/** threeTerms draws two variable terms and a constant with nonzero coefficients, in random order. */
function threeTerms(rng: Rng): Term[] {
  const [u, w] = twoVars(rng);
  return rng.shuffle<Term>([
    [rng.nonZero(-9, 9), u],
    [rng.nonZero(-9, 9), w],
    [rng.nonZero(-12, 12), ""],
  ]);
}

// ---------------------------------------------------------------------------
// The distributive law

export const theDistributiveLawWithThreeTerms = topic(
  "the-distributive-law-with-three-terms",
  t("The Distributive Law With Three Terms", "含三项的乘法分配律"),
  t(
    "The distributive law works for any number of terms in the parentheses: $a(b + c + d) = ab + ac + ad$. The factor outside multiplies every term, so $4(2x - y + 3) = 8x - 4y + 12$, and a negative factor changes the sign of every term: $-2(3x + y - 5) = -6x - 2y + 10$.",
    "乘法分配律对括号内任意多项都成立：$a(b + c + d) = ab + ac + ad$。括号外的因数要乘以每一项，所以 $4(2x - y + 3) = 8x - 4y + 12$；负因数会改变每一项的符号：$-2(3x + y - 5) = -6x - 2y + 10$。",
  ),
  ["distributive-property"],
  ["7.EE.A.1"],
  [
    {
      id: "a-positive-factor",
      title: t("A positive factor", "正因数"),
      explanation: t(
        "Multiply the factor outside by **each** of the three terms, keeping each term's sign:\n\n$$5(2a - 3b + 4) = 5 \\cdot 2a + 5 \\cdot (-3b) + 5 \\cdot 4 = 10a - 15b + 20.$$\n\nA common slip is to stop after the first one or two terms; count that the answer has as many terms as the parentheses.",
        "用括号外的因数分别乘以三项中的**每一项**，并保留每一项的符号：\n\n$$5(2a - 3b + 4) = 5 \\cdot 2a + 5 \\cdot (-3b) + 5 \\cdot 4 = 10a - 15b + 20.$$\n\n常见的错误是只乘了前一两项；检查结果的项数是否与括号内相同。",
      ),
      keyPrerequisites: ["distributive-property"],
      generate(rng) {
        const k = rng.int(2, 9);
        const terms = threeTerms(rng);
        const [, b, c] = terms as [Term, Term, Term];
        const expr = `${k}(${poly(...terms)})`;
        const answer = poly(...scale(k, terms));
        const [ka, kb, kc] = scale(k, terms) as [Term, Term, Term];
        return expressionProblem({
          prompt: t(`Expand $${expr}$.`, `展开 $${expr}$。`),
          answer,
          simplified: true,
          wrong: [poly(ka, b, c), poly(ka, kb, c), poly(ka, b, kc)],
          solution: t(
            `Multiply each term by $${k}$: ${steps(`${expr} = ${products(k, terms)} = ${answer}`)}`,
            `用 $${k}$ 乘以每一项：${steps(`${expr} = ${products(k, terms)} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "a-negative-factor",
      title: t("A negative factor", "负因数"),
      explanation: t(
        "A negative factor multiplies every term too, so **every** sign in the parentheses changes:\n\n$$-3(2x - y + 4) = (-3) \\cdot 2x + (-3) \\cdot (-y) + (-3) \\cdot 4 = -6x + 3y - 12.$$\n\nWork term by term: a negative times a negative is positive.",
        "负因数同样要乘以每一项，所以括号内**每一项**的符号都改变：\n\n$$-3(2x - y + 4) = (-3) \\cdot 2x + (-3) \\cdot (-y) + (-3) \\cdot 4 = -6x + 3y - 12.$$\n\n逐项计算：负数乘负数得正数。",
      ),
      keyPrerequisites: ["multiplying-integers"],
      generate(rng) {
        const k = -rng.int(2, 9);
        const terms = threeTerms(rng);
        const [, b, c] = terms as [Term, Term, Term];
        const expr = `${k}(${poly(...terms)})`;
        const answer = poly(...scale(k, terms));
        const [ka, kb] = scale(k, terms) as [Term, Term, Term];
        const [, mb, mc] = scale(-k, terms) as [Term, Term, Term];
        return expressionProblem({
          prompt: t(`Expand $${expr}$.`, `展开 $${expr}$。`),
          answer,
          simplified: true,
          wrong: [poly(ka, mb, mc), poly(ka, b, c), poly(...scale(-k, terms)), poly(ka, kb, mc)],
          solution: t(
            `Multiply each term by $${k}$; every sign changes: ${steps(`${expr} = ${products(k, terms)} = ${answer}`)}`,
            `用 $${k}$ 乘以每一项，每一项都变号：${steps(`${expr} = ${products(k, terms)} = ${answer}`)}`,
          ),
        });
      },
    },
  ],
);

/** groupTerms draws the terms of a group to be negated: one variable and a constant, or two variables and a constant. */
function groupTerms(rng: Rng): Term[] {
  if (rng.bool(0.4)) return threeTerms(rng);
  const v = pickVar(rng);
  const terms: Term[] = [
    [rng.nonZero(-9, 9), v],
    [rng.nonZero(-15, 15), ""],
  ];
  return rng.bool(0.3) ? [terms[1]!, terms[0]!] : terms;
}

export const distributingTheNegativeSignInALinearExpression = topic(
  "distributing-the-negative-sign-in-a-linear-expression",
  t("Distributing the Negative Sign in a Linear Expression", "去掉一次式括号前的负号"),
  t(
    "A negative sign in front of parentheses means multiplying by $-1$, so it changes the sign of every term inside: $-(3x - 2y + 5) = -3x + 2y - 5$. The result is the opposite of the expression in the parentheses: the two add to $0$.",
    "括号前的负号表示乘以 $-1$，所以括号内每一项都要变号：$-(3x - 2y + 5) = -3x + 2y - 5$。结果是括号内式子的相反式：两者相加得 $0$。",
  ),
  ["the-distributive-law-with-three-terms"],
  ["7.EE.A.1", "7.EE.A.2"],
  [
    {
      id: "removing-a-negative-sign",
      title: t("Removing a negative sign before parentheses", "去掉括号前的负号"),
      explanation: t(
        "A negative sign in front of parentheses means the opposite of everything inside.\n\n$-(\\ldots)$ is $-1 \\cdot (\\ldots)$. Distribute the $-1$: every term changes sign, not only the first.\n\n$$-(4n - 7) = -4n + 7, \\qquad -(-2x + y - 3) = 2x - y + 3.$$",
        "括号前的负号表示括号内全部内容的相反数。\n\n$-(\\ldots)$ 就是 $-1 \\cdot (\\ldots)$。把 $-1$ 分配到每一项：每一项都变号，而不只是第一项。\n\n$$-(4n - 7) = -4n + 7, \\qquad -(-2x + y - 3) = 2x - y + 3.$$",
      ),
      keyPrerequisites: ["distributive-property"],
      generate(rng) {
        const terms = groupTerms(rng);
        const expr = `-(${poly(...terms)})`;
        const negated = scale(-1, terms);
        const answer = poly(...negated);
        const [first, ...rest] = terms as [Term, ...Term[]];
        const [nFirst, ...nRest] = negated as [Term, ...Term[]];
        return expressionProblem({
          prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
          answer,
          simplified: true,
          wrong: [poly(nFirst, ...rest), poly(first, ...nRest), poly(...terms)],
          solution: t(
            `Multiply every term by $-1$: ${steps(`${expr} = ${products(-1, terms)} = ${answer}`)}`,
            `每一项都乘以 $-1$：${steps(`${expr} = ${products(-1, terms)} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "the-opposite-of-an-expression",
      title: t("The opposite of an expression", "式子的相反式"),
      explanation: t(
        "The **opposite** of an expression is the expression that adds to it to give $0$. Write it as $-(\\ldots)$ and remove the parentheses: the opposite of $5x - 2y + 1$ is $-(5x - 2y + 1) = -5x + 2y - 1$.\n\nCheck: $(5x - 2y + 1) + (-5x + 2y - 1) = 0$.",
        "与一个式子相加得 $0$ 的式子叫做它的**相反式**。把它写成 $-(\\ldots)$ 再去括号：$5x - 2y + 1$ 的相反式是 $-(5x - 2y + 1) = -5x + 2y - 1$。\n\n检验：$(5x - 2y + 1) + (-5x + 2y - 1) = 0$。",
      ),
      generate(rng) {
        const terms = groupTerms(rng);
        const expr = poly(...terms);
        const negated = scale(-1, terms);
        const answer = poly(...negated);
        const [first, ...rest] = terms as [Term, ...Term[]];
        const [nFirst, ...nRest] = negated as [Term, ...Term[]];
        const asSum = rng.bool();
        return expressionProblem({
          prompt: asSum
            ? t(
                `What expression must be added to $${expr}$ to get $0$? Write it without parentheses.`,
                `$${expr}$ 加上什么式子得 $0$？写出不含括号的结果。`,
              )
            : t(`Write the opposite of $${expr}$ without parentheses.`, `写出 $${expr}$ 的相反式（不含括号）。`),
          answer,
          simplified: true,
          wrong: [poly(nFirst, ...rest), poly(first, ...nRest), expr],
          solution: t(
            `The opposite is $-(${expr})$. Change the sign of every term: ${steps(`-(${expr}) = ${answer}`)}Check: the sum of the two expressions is $0$.`,
            `相反式是 $-(${expr})$。把每一项都变号：${steps(`-(${expr}) = ${answer}`)}检验：两个式子的和为 $0$。`,
          ),
        });
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Simplifying with the distributive law

export const simplifyingLinearExpressionsUsingTheDistributiveLaw = topic(
  "simplifying-linear-expressions-using-the-distributive-law",
  t("Simplifying Linear Expressions Using the Distributive Law", "用乘法分配律化简一次式"),
  t(
    "To simplify an expression with parentheses, first expand every group with the distributive law, then combine like terms: $2(3x + 4) + 5(x - 1) = 6x + 8 + 5x - 5 = 11x + 3$. Multiplication comes before addition, so in $7 + 2(x + 3)$ only the $2$ multiplies the group: $7 + 2x + 6 = 2x + 13$, not $9(x + 3)$.",
    "化简含括号的式子时，先用乘法分配律展开每一组括号，再合并同类项：$2(3x + 4) + 5(x - 1) = 6x + 8 + 5x - 5 = 11x + 3$。乘法先于加法，所以在 $7 + 2(x + 3)$ 中只有 $2$ 乘括号：$7 + 2x + 6 = 2x + 13$，而不是 $9(x + 3)$。",
  ),
  ["the-distributive-law-with-three-terms", "combining-like-terms"],
  ["7.EE.A.1"],
  [
    {
      id: "two-groups",
      title: t("Two groups of parentheses", "两组括号"),
      explanation: t(
        "When an expression has several groups in parentheses, each multiplier applies only to its own group, and a negative multiplier changes the sign of each term in its group.\n\nExpand each group separately, then collect the variable terms and the constants:\n\n$$3(2x - 1) + 4(x + 5) = 6x - 3 + 4x + 20 = 10x + 17.$$",
        "当式子中有几组括号时，每个乘数只作用于它自己的那组括号；乘数是负数时，那组括号里每一项都要变号。\n\n分别展开每一组括号，再把含变量的项和常数项分别合并：\n\n$$3(2x - 1) + 4(x + 5) = 6x - 3 + 4x + 20 = 10x + 17.$$",
      ),
      keyPrerequisites: ["the-distributive-law-with-three-terms", "combining-like-terms"],
      generate(rng) {
        const v = pickVar(rng);
        const a = rng.sign() * rng.int(2, 6);
        const b = rng.nonZero(-5, 5);
        const c = rng.nonZero(-9, 9);
        const d = rng.int(2, 6);
        let e = rng.nonZero(-5, 5);
        while (a * b + d * e === 0) e = rng.nonZero(-5, 5);
        const f = rng.nonZero(-9, 9);
        const expr = `${factor(a, linear(b, c, v))} + ${factor(d, linear(e, f, v))}`;
        const expanded = poly([a * b, v], [a * c, ""], [d * e, v], [d * f, ""]);
        const answer = linear(a * b + d * e, a * c + d * f, v);
        return expressionProblem({
          prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
          answer,
          simplified: true,
          wrong: [linear(a * b + d * e, c + f, v), linear(a * b + e, a * c + f, v), expanded],
          solution: t(
            `Expand both groups, then combine like terms: ${steps(`${expr} = ${expanded}`, `= ${answer}`)}`,
            `展开两组括号，再合并同类项：${steps(`${expr} = ${expanded}`, `= ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "a-term-before-the-parentheses",
      title: t("A term before the parentheses", "括号前还有一项"),
      explanation: t(
        "In $7 + 2(x + 3)$ the $2$ multiplies the group, and the $7$ is added afterward, because multiplication comes before addition. Expand first, then combine:\n\n$$7 + 2(x + 3) = 7 + 2x + 6 = 2x + 13.$$\n\nAdding $7 + 2$ first to get $9(x + 3)$ is wrong.",
        "在 $7 + 2(x + 3)$ 中，$2$ 乘括号，$7$ 是之后再加的，因为乘法先于加法。先展开，再合并：\n\n$$7 + 2(x + 3) = 7 + 2x + 6 = 2x + 13.$$\n\n先算 $7 + 2$ 得到 $9(x + 3)$ 是错误的。",
      ),
      generate(rng) {
        const v = pickVar(rng);
        const a = rng.int(2, 7);
        const b = rng.int(1, 6);
        const d = rng.nonZero(-9, 9);
        const inner = linear(b, d, v);
        if (rng.bool(0.6)) {
          const c = rng.int(2, 15);
          const expr = `${c} + ${a}(${inner})`;
          const answer = linear(a * b, a * d + c, v);
          return expressionProblem({
            prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
            answer,
            simplified: true,
            wrong: [linear((c + a) * b, (c + a) * d, v), linear(a * b, d + c, v), linear(a * b + c, a * d, v)],
            solution: t(
              `Multiply first: only $${a}$ multiplies the group. Then add $${c}$: ${steps(`${expr} = ${poly([c, ""], [a * b, v], [a * d, ""])} = ${answer}`)}`,
              `先算乘法：只有 $${a}$ 乘括号。再加 $${c}$：${steps(`${expr} = ${poly([c, ""], [a * b, v], [a * d, ""])} = ${answer}`)}`,
            ),
          });
        }
        let c = rng.nonZero(-9, 9);
        while (c + a * b === 0) c = rng.nonZero(-9, 9);
        const expr = `${poly([c, v])} + ${a}(${inner})`;
        const answer = linear(c + a * b, a * d, v);
        return expressionProblem({
          prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
          answer,
          simplified: true,
          wrong: [linear(c + a * b, d, v), linear(c + b, a * d, v)],
          solution: t(
            `Expand the group, then combine the $${v}$-terms: ${steps(`${expr} = ${poly([c, v], [a * b, v], [a * d, ""])} = ${answer}`)}`,
            `展开括号，再合并含 $${v}$ 的项：${steps(`${expr} = ${poly([c, v], [a * b, v], [a * d, ""])} = ${answer}`)}`,
          ),
        });
      },
    },
  ],
);

export const simplifyingLinearExpressionsWhenAGroupOfTermsIsSubtracted = topic(
  "simplifying-linear-expressions-when-a-group-of-terms-is-subtracted",
  t("Simplifying Linear Expressions When a Group of Terms Is Subtracted", "化简减去一组项的一次式"),
  t(
    "Subtracting a group means subtracting every term in it, so every sign in the group changes: $(5x + 3) - (2x - 6) = 5x + 3 - 2x + 6 = 3x + 9$. When a number multiplies the subtracted group, distribute the negative number: $4x - 3(x - 2) = 4x - 3x + 6 = x + 6$.",
    "减去一组项就是减去其中的每一项，所以这组项的每个符号都改变：$(5x + 3) - (2x - 6) = 5x + 3 - 2x + 6 = 3x + 9$。被减的一组前面还有因数时，把这个负数分配进去：$4x - 3(x - 2) = 4x - 3x + 6 = x + 6$。",
  ),
  ["simplifying-linear-expressions-using-the-distributive-law", "distributing-the-negative-sign-in-a-linear-expression"],
  ["7.EE.A.1"],
  [
    {
      id: "subtracting-a-group",
      title: t("Subtracting a group", "减去一组项"),
      explanation: t(
        "The minus sign in front of the parentheses applies to **every** term inside. Rewrite without parentheses by changing each sign, then combine like terms:\n\n$$(7n - 2) - (3n - 5) = 7n - 2 - 3n + 5 = 4n + 3.$$",
        "括号前的减号作用于括号内的**每一项**。去括号时把每一项都变号，再合并同类项：\n\n$$(7n - 2) - (3n - 5) = 7n - 2 - 3n + 5 = 4n + 3.$$",
      ),
      keyPrerequisites: ["distributing-the-negative-sign-in-a-linear-expression"],
      generate(rng) {
        const v = pickVar(rng);
        const a = rng.nonZero(-9, 9);
        const b = rng.nonZero(-12, 12);
        let c = rng.nonZero(-9, 9);
        while (a === c) c = rng.nonZero(-9, 9);
        const d = rng.nonZero(-12, 12);
        const first = rng.bool() ? `(${linear(a, b, v)})` : linear(a, b, v);
        const expr = `${first} - (${linear(c, d, v)})`;
        const expanded = poly([a, v], [b, ""], [-c, v], [-d, ""]);
        const answer = linear(a - c, b - d, v);
        return expressionProblem({
          prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
          answer,
          simplified: true,
          wrong: [linear(a - c, b + d, v), linear(a + c, b + d, v), linear(a + c, b - d, v)],
          solution: t(
            `Change the sign of every term in the subtracted group, then combine: ${steps(`${expr} = ${expanded}`, `= ${answer}`)}`,
            `把被减的一组中每一项都变号，再合并：${steps(`${expr} = ${expanded}`, `= ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "subtracting-a-multiple-of-a-group",
      title: t("Subtracting a multiple of a group", "减去一组项的倍数"),
      explanation: t(
        "In $10 - 3(x + 2)$, the factor is $-3$: it multiplies both terms in the group, and multiplication comes before subtraction.\n\n$$10 - 3(x + 2) = 10 - 3x - 6 = -3x + 4.$$\n\nWriting $7(x + 2)$ by subtracting $10 - 3$ first, or $10 - 3x + 6$ by not distributing the sign, are the usual mistakes.",
        "在 $10 - 3(x + 2)$ 中，因数是 $-3$：它乘以括号内的两项，而且乘法先于减法。\n\n$$10 - 3(x + 2) = 10 - 3x - 6 = -3x + 4.$$\n\n先算 $10 - 3$ 写成 $7(x + 2)$，或者没有把负号分配进去写成 $10 - 3x + 6$，都是常见的错误。",
      ),
      generate(rng) {
        const v = pickVar(rng);
        const k = rng.int(2, 6);
        const c = rng.int(1, 6);
        const d = rng.nonZero(-9, 9);
        const b = rng.int(2, 20);
        const group = `${k}(${linear(c, d, v)})`;
        if (rng.bool(0.4)) {
          const expr = `${b} - ${group}`;
          const answer = linear(-k * c, b - k * d, v);
          return expressionProblem({
            prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
            answer,
            simplified: true,
            wrong: [linear((b - k) * c, (b - k) * d, v), linear(-k * c, b + k * d, v), linear(-k * c, b - d, v)],
            solution: t(
              `Distribute $-${k}$ over the group, then combine the constants: ${steps(`${expr} = ${poly([b, ""], [-k * c, v], [-k * d, ""])} = ${answer}`)}`,
              `把 $-${k}$ 分配到括号内每一项，再合并常数项：${steps(`${expr} = ${poly([b, ""], [-k * c, v], [-k * d, ""])} = ${answer}`)}`,
            ),
          });
        }
        let a = rng.nonZero(-9, 12);
        while (a === k * c) a = rng.nonZero(-9, 12);
        const bb = rng.nonZero(-12, 12);
        const expr = `${linear(a, bb, v)} - ${group}`;
        const expanded = poly([a, v], [bb, ""], [-k * c, v], [-k * d, ""]);
        const answer = linear(a - k * c, bb - k * d, v);
        return expressionProblem({
          prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
          answer,
          simplified: true,
          wrong: [linear(a - k * c, bb + k * d, v), linear(a - k * c, bb - d, v), linear(a + k * c, bb + k * d, v)],
          solution: t(
            `Distribute $-${k}$ over the group, then combine like terms: ${steps(`${expr} = ${expanded}`, `= ${answer}`)}`,
            `把 $-${k}$ 分配到括号内每一项，再合并同类项：${steps(`${expr} = ${expanded}`, `= ${answer}`)}`,
          ),
        });
      },
    },
  ],
);

/** properFraction draws a fraction p/q in lowest terms that is not an integer, with q from 2 to maxDen. */
function properFraction(rng: Rng, maxDen: number, maxNum = 7): Q {
  const q = rng.int(2, maxDen);
  let p = rng.int(1, maxNum);
  while (p % q === 0 || gcd(p, q) !== 1) p = rng.int(1, maxNum);
  return Q.of(p, q);
}

export const simplifyingLinearExpressionsContainingFractions = topic(
  "simplifying-linear-expressions-containing-fractions",
  t("Simplifying Linear Expressions Containing Fractions", "化简含分数的一次式"),
  t(
    "Like terms with fractional coefficients are combined by adding the fractions with a common denominator: $\\frac{1}{2}x + \\frac{1}{3}x = \\frac{3}{6}x + \\frac{2}{6}x = \\frac{5}{6}x$. A fraction outside parentheses multiplies every term inside: $\\frac{2}{3}(6x - 9) = 4x - 6$.",
    "系数是分数的同类项，通分后把分数相加来合并：$\\frac{1}{2}x + \\frac{1}{3}x = \\frac{3}{6}x + \\frac{2}{6}x = \\frac{5}{6}x$。括号外的分数要乘以括号内的每一项：$\\frac{2}{3}(6x - 9) = 4x - 6$。",
  ),
  ["simplifying-linear-expressions-using-the-distributive-law", "operations-with-rational-numbers"],
  ["7.EE.A.1"],
  [
    {
      id: "fractional-coefficients",
      title: t("Combining terms with fractional coefficients", "合并分数系数的同类项"),
      explanation: t(
        "Group the like terms and add their coefficients over a common denominator. Never add the denominators:\n\n$$\\frac{3}{4}x + 2 - \\frac{1}{6}x + \\frac{1}{2} = \\left(\\frac{9}{12} - \\frac{2}{12}\\right)x + \\left(\\frac{4}{2} + \\frac{1}{2}\\right) = \\frac{7}{12}x + \\frac{5}{2}.$$",
        "把同类项归在一起，通分后把系数相加。分母不能相加：\n\n$$\\frac{3}{4}x + 2 - \\frac{1}{6}x + \\frac{1}{2} = \\left(\\frac{9}{12} - \\frac{2}{12}\\right)x + \\left(\\frac{4}{2} + \\frac{1}{2}\\right) = \\frac{7}{12}x + \\frac{5}{2}.$$",
      ),
      keyPrerequisites: ["operations-with-rational-numbers", "combining-like-terms"],
      generate(rng) {
        const v = pickVar(rng);
        const f1 = properFraction(rng, 6);
        let f2 = properFraction(rng, 6).mul(Q.of(rng.sign()));
        while (f1.add(f2).isZero() || f1.d === f2.d) f2 = properFraction(rng, 6).mul(Q.of(rng.sign()));
        const g1 = Q.of(rng.nonZero(-9, 9));
        const g2 = properFraction(rng, 4, 5).mul(Q.of(rng.sign()));
        const terms: Term[] = rng.bool()
          ? [
              [f1, v],
              [g1, ""],
              [f2, v],
              [g2, ""],
            ]
          : [
              [g1, ""],
              [f1, v],
              [g2, ""],
              [f2, v],
            ];
        const expr = poly(...terms);
        const x = f1.add(f2);
        const c = g1.add(g2);
        const answer = linear(x, c, v);
        const naive = (p: Q, q: Q) => Q.of(Number(p.n + q.n), Number(p.d + q.d));
        return expressionProblem({
          prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
          answer,
          simplified: true,
          wrong: [linear(naive(f1, f2), c, v), linear(x, g1.sub(g2), v), linear(f1.sub(f2), c, v)],
          solution: t(
            `Combine the $${v}$-terms and the constants separately: ${steps(`${poly([f1, v], [f2, v])} = ${poly([x, v])}`, `${poly([g1, ""], [g2, ""])} = ${num(c)}`)}So the expression simplifies to $${answer}$.`,
            `分别合并含 $${v}$ 的项和常数项：${steps(`${poly([f1, v], [f2, v])} = ${poly([x, v])}`, `${poly([g1, ""], [g2, ""])} = ${num(c)}`)}所以化简结果是 $${answer}$。`,
          ),
        });
      },
    },
    {
      id: "distributing-a-fraction",
      title: t("Distributing a fraction", "分配一个分数"),
      explanation: t(
        "Multiply the fraction by each term in the parentheses, then combine like terms:\n\n$$\\frac{3}{4}(8x - 2) + x = 6x - \\frac{3}{2} + x = 7x - \\frac{3}{2}.$$\n\nMultiplying by $\\frac{3}{4}$ means multiplying by $3$ **and** dividing by $4$.",
        "用这个分数乘以括号内的每一项，再合并同类项：\n\n$$\\frac{3}{4}(8x - 2) + x = 6x - \\frac{3}{2} + x = 7x - \\frac{3}{2}.$$\n\n乘以 $\\frac{3}{4}$ 就是乘以 $3$ **并且**除以 $4$。",
      ),
      keyPrerequisites: ["multiplying-fractions"],
      generate(rng) {
        const v = pickVar(rng);
        const f = properFraction(rng, 5, 4).mul(Q.of(rng.bool(0.3) ? -1 : 1));
        const q = Number(f.d);
        const p = Number(f.n);
        const b = q * rng.nonZero(-4, 4);
        const c = rng.bool(0.7) ? q * rng.nonZero(-4, 4) : rng.nonZero(-9, 9);
        let d = rng.nonZero(-6, 6);
        while (f.mul(Q.of(b)).add(Q.of(d)).isZero()) d = rng.nonZero(-6, 6);
        const e = rng.nonZero(-9, 9);
        const fb = f.mul(Q.of(b));
        const fc = f.mul(Q.of(c));
        const lead = `${f.sign() < 0 ? "-" : ""}${f.abs().toLatex()}`;
        const expr = `${lead}(${linear(b, c, v)}) ${tail([d, v], [e, ""])}`;
        const expanded = poly([fb, v], [fc, ""], [d, v], [e, ""]);
        const answer = linear(fb.add(Q.of(d)), fc.add(Q.of(e)), v);
        return expressionProblem({
          prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
          answer,
          simplified: true,
          wrong: [
            linear(fb.add(Q.of(d)), Q.of(c + e), v),
            linear(Q.of(p * b + d), Q.of(p * c + e), v),
            linear(Q.of(b, q).add(Q.of(d)), Q.of(c, q).add(Q.of(e)), v),
          ],
          solution: t(
            `Multiply each term in the parentheses by $${num(f)}$, then combine like terms: ${steps(`${expr} = ${expanded}`, `= ${answer}`)}`,
            `用 $${num(f)}$ 乘以括号内的每一项，再合并同类项：${steps(`${expr} = ${expanded}`, `= ${answer}`)}`,
          ),
        });
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Factoring numerical expressions

/** composites are common factors with a smaller common factor of their own, so that a factor that is not the greatest exists. */
const composites = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20] as const;

/** coprimePair draws two different whole numbers p, q ≥ 2 with no common factor, with p·g and q·g at most 100. */
function coprimePair(rng: Rng, g: number): [number, number] {
  const max = Math.floor(100 / g);
  let p = rng.int(2, max);
  let q = rng.int(2, max);
  while (p === q || gcd(p, q) !== 1) {
    p = rng.int(2, max);
    q = rng.int(2, max);
  }
  return [p, q];
}

/** smallestPrime is the smallest prime factor of n ≥ 2. */
function smallestPrime(n: number): number {
  for (let p = 2; p * p <= n; p++) if (n % p === 0) return p;
  return n;
}

export const factoringNumericalExpressions = topic(
  "factoring-numerical-expressions",
  t("Factoring Numerical Expressions", "数的式子的因式分解"),
  t(
    "The distributive law also works backward: a sum of two numbers with a common factor can be written as that factor times a sum. Factoring out the greatest common factor leaves a sum of two numbers with no common factor: $36 + 54 = 18(2 + 3)$. Writing $6(6 + 9)$ is true, but $6$ is not the greatest common factor.",
    "乘法分配律也可以反过来用：两个有公因数的数的和，可以写成这个公因数乘一个和。提出最大公因数后，括号内的两个数没有公因数：$36 + 54 = 18(2 + 3)$。写成 $6(6 + 9)$ 虽然成立，但 $6$ 不是最大公因数。",
  ),
  ["greatest-common-factor", "distributive-property"],
  ["6.NS.B.4"],
  [
    {
      id: "factoring-out-the-gcf",
      title: t("Factoring out the greatest common factor", "提取最大公因数"),
      explanation: t(
        "Find the GCF of the two numbers, then divide each number by it to find what goes in the parentheses:\n\n$$24 + 40: \\quad \\gcd(24, 40) = 8, \\quad 24 + 40 = 8(3 + 5).$$\n\nCheck by expanding: $8 \\cdot 3 + 8 \\cdot 5 = 24 + 40$. The two numbers left in the parentheses, $3$ and $5$, have no common factor.",
        "求出两个数的最大公因数，再用它分别去除这两个数，得到括号内的数：\n\n$$24 + 40: \\quad \\gcd(24, 40) = 8, \\quad 24 + 40 = 8(3 + 5).$$\n\n展开检验：$8 \\cdot 3 + 8 \\cdot 5 = 24 + 40$。括号内剩下的 $3$ 和 $5$ 没有公因数。",
      ),
      keyPrerequisites: ["greatest-common-factor"],
      generate(rng) {
        const g = rng.pick(composites);
        const [p, q] = coprimePair(rng, g);
        const [a, b] = [g * p, g * q];
        const s = smallestPrime(g);
        const correct = `${g}(${p} + ${q})`;
        return pickChoice(
          rng,
          t(
            `Which shows $${a} + ${b}$ written as the greatest common factor of $${a}$ and $${b}$ times a sum?`,
            `把 $${a} + ${b}$ 写成 $${a}$ 与 $${b}$ 的最大公因数乘一个和，正确的是哪一个？`,
          ),
          mathText(correct),
          [mathText(`${s}(${a / s} + ${b / s})`), mathText(`${g}(${p} + ${b})`), mathText(`${g}(${a - g} + ${b - g})`)],
          t(
            `The GCF of $${a}$ and $${b}$ is $${g}$, and $${a} = ${g} \\cdot ${p}$, $${b} = ${g} \\cdot ${q}$. So $${a} + ${b} = ${correct}$; $${p}$ and $${q}$ have no common factor.`,
            `$${a}$ 与 $${b}$ 的最大公因数是 $${g}$，且 $${a} = ${g} \\cdot ${p}$，$${b} = ${g} \\cdot ${q}$。所以 $${a} + ${b} = ${correct}$；$${p}$ 与 $${q}$ 没有公因数。`,
          ),
        );
      },
    },
    {
      id: "finding-the-missing-number",
      title: t("Finding the missing number", "求缺少的数"),
      explanation: t(
        "In $42 - 28 = 14(3 - \\square)$, the factor outside is $14$, so the missing number is $28 \\div 14 = 2$. If the factor outside is missing, as in $45 + 75 = \\square(3 + 5)$, it is $45 \\div 3 = 15$. The same works with three numbers: $12 + 18 + 30 = 6(2 + 3 + 5)$.",
        "在 $42 - 28 = 14(3 - \\square)$ 中，括号外的因数是 $14$，所以缺少的数是 $28 \\div 14 = 2$。如果缺少的是括号外的因数，例如 $45 + 75 = \\square(3 + 5)$，它是 $45 \\div 3 = 15$。三个数时方法相同：$12 + 18 + 30 = 6(2 + 3 + 5)$。",
      ),
      generate(rng) {
        const g = rng.int(2, 15);
        const three = rng.bool(0.3);
        const nums: number[] = [];
        for (;;) {
          const max = Math.floor(100 / g);
          nums.length = 0;
          for (let i = 0; i < (three ? 3 : 2); i++) nums.push(rng.int(1, max));
          const distinct = new Set(nums).size === nums.length;
          if (distinct && nums.reduce((x, y) => gcd(x, y)) === 1) break;
        }
        const sub = !three && rng.bool(0.35);
        if (sub) nums.sort((x, y) => y - x);
        const op = (i: number) => (i === 0 ? "" : sub ? " - " : " + ");
        const outer = nums.map((n, i) => `${op(i)}${g * n}`).join("");
        const hide = rng.int(three ? 0 : -1, nums.length - 1);
        const inner = nums.map((n, i) => `${op(i)}${i === hide ? "\\square" : n}`).join("");
        const eq = `${outer} = ${hide === -1 ? "\\square" : g}(${inner})`;
        const answer = hide === -1 ? g : nums[hide]!;
        const shown = hide === -1 ? g * nums[0]! : g * nums[hide]!;
        const wrong = hide === -1 ? [g * nums[0]! - nums[0]!, nums.reduce((x, y) => x * y)] : [shown - g, shown, shown * g];
        return numberProblem({
          prompt: t(`What number goes in the box? $$${eq}$$`, `方框中应填什么数？$$${eq}$$`),
          answer,
          form: "integer",
          wrong,
          solution:
            hide === -1
              ? t(
                  `Each number in the parentheses times the missing factor gives the number on the left: $${shown} \\div ${nums[0]} = ${g}$. Check: ${nums.map((n) => `$${g} \\cdot ${n} = ${g * n}$`).join(", ")}.`,
                  `括号内每个数乘以缺少的因数，得到左边对应的数：$${shown} \\div ${nums[0]} = ${g}$。检验：${nums.map((n) => `$${g} \\cdot ${n} = ${g * n}$`).join("，")}。`,
                )
              : t(
                  `The factor outside is $${g}$, so the missing number is $${shown} \\div ${g} = ${answer}$. Check: $${g} \\cdot ${answer} = ${shown}$.`,
                  `括号外的因数是 $${g}$，所以缺少的数是 $${shown} \\div ${g} = ${answer}$。检验：$${g} \\cdot ${answer} = ${shown}$。`,
                ),
        });
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Rational expressions

/** inParens writes a value substituted for a variable, in parentheses when it is negative. */
const inParens = (x: number) => (x < 0 ? `(${num(x)})` : num(x));

/** times writes a coefficient times a substituted value: times(3, -2) is "3(-2)", times(-1, 4) is "-4". */
const times = (a: number, x: number) => (a === 1 ? inParens(x) : a === -1 ? `-${inParens(x)}` : `${num(a)}(${num(x)})`);

/** substituted writes a·x + b with x replaced by its value: "3(-2) + 5". */
function substituted(a: number, x: number, b: number): string {
  return b === 0 ? times(a, x) : `${times(a, x)} ${b < 0 ? "-" : "+"} ${Math.abs(b)}`;
}

/** plusTimes continues a sum with k times a substituted value: plusTimes(-4, 5) is "- 4(5)", plusTimes(1, -5) is "+ (-5)". */
const plusTimes = (k: number, y: number) => `${k < 0 ? "-" : "+"} ${times(Math.abs(k), y)}`;

/** fraction writes a LaTeX fraction. */
const fraction = (n: string, d: string) => `\\frac{${n}}{${d}}`;

export const evaluatingRationalExpressions = topic(
  "evaluating-rational-expressions",
  t("Evaluating Rational Expressions", "分式求值"),
  t(
    "A rational expression is a fraction whose numerator and denominator are expressions, such as $\\frac{3x + 4}{x - 2}$. To evaluate it, substitute the value into the numerator and the denominator, evaluate each, then divide: for $x = 5$, $\\frac{3(5) + 4}{5 - 2} = \\frac{19}{3}$. The fraction bar groups the numerator and the denominator, so you cannot cancel single terms across it.",
    "分子和分母都是式子的分数叫做分式，例如 $\\frac{3x + 4}{x - 2}$。求值时，把值分别代入分子和分母，分别算出结果，再相除：当 $x = 5$ 时，$\\frac{3(5) + 4}{5 - 2} = \\frac{19}{3}$。分数线把分子、分母各自看作一个整体，所以不能把分子和分母中的单项约掉。",
  ),
  ["evaluating-expressions", "operations-with-rational-numbers"],
  ["7.EE.B.3", "6.EE.A.2.C"],
  [
    {
      id: "linear-numerator-and-denominator",
      title: t("A linear numerator and denominator", "分子和分母都是一次式"),
      explanation: t(
        "Evaluate the numerator and the denominator separately, then simplify the fraction:\n\n$$x = -3: \\quad \\frac{2x - 4}{x + 5} = \\frac{2(-3) - 4}{(-3) + 5} = \\frac{-10}{2} = -5.$$\n\nIf the quotient is not a whole number, give it as a fraction in lowest terms.",
        "分别计算分子和分母，再化简分数：\n\n$$x = -3: \\quad \\frac{2x - 4}{x + 5} = \\frac{2(-3) - 4}{(-3) + 5} = \\frac{-10}{2} = -5.$$\n\n如果商不是整数，就写成最简分数。",
      ),
      keyPrerequisites: ["evaluating-expressions"],
      generate(rng) {
        for (;;) {
          const v = pickVar(rng);
          const a = rng.nonZero(-6, 6);
          const b = rng.nonZero(-12, 12);
          const c = rng.bool(0.6) ? 1 : rng.nonZero(-4, 4);
          const d = rng.nonZero(-9, 9);
          const x = rng.nonZero(-8, 8);
          const top = a * x + b;
          const bottom = c * x + d;
          if (bottom === 0 || top === 0) continue;
          if (top % bottom !== 0 && rng.bool(0.6)) continue;
          const expr = fraction(linear(a, b, v), linear(c, d, v));
          const answer = Q.of(top, bottom);
          const flipped = -c * x + d;
          return numberProblem({
            prompt: t(`Evaluate $${expr}$ when $${v} = ${num(x)}$.`, `当 $${v} = ${num(x)}$ 时，求 $${expr}$ 的值。`),
            answer,
            wrong: [...(flipped !== 0 ? [Q.of(-a * x + b, flipped)] : []), Q.of(bottom, top), ...(c + d !== 0 ? [Q.of(a + b, c + d)] : [])],
            solution: t(
              `Substitute $${num(x)}$ for $${v}$ in the numerator and the denominator: ${steps(`${fraction(substituted(a, x, b), substituted(c, x, d))} = ${fraction(num(top), num(bottom))} = ${num(answer)}`)}`,
              `把分子和分母中的 $${v}$ 都换成 $${num(x)}$：${steps(`${fraction(substituted(a, x, b), substituted(c, x, d))} = ${fraction(num(top), num(bottom))} = ${num(answer)}`)}`,
            ),
          });
        }
      },
    },
    {
      id: "powers-and-two-variables",
      title: t("Powers and two variables", "乘方与两个变量"),
      explanation: t(
        "Substitute every variable in parentheses before computing; this matters most for squares of negative numbers. For $x = -2$ and $y = 3$:\n\n$$\\frac{x^2 + y}{2x - y} = \\frac{(-2)^2 + 3}{2(-2) - 3} = \\frac{7}{-7} = -1.$$",
        "代入时给每个变量的值加上括号再计算；负数的平方尤其要注意。当 $x = -2$，$y = 3$ 时：\n\n$$\\frac{x^2 + y}{2x - y} = \\frac{(-2)^2 + 3}{2(-2) - 3} = \\frac{7}{-7} = -1.$$",
      ),
      keyPrerequisites: ["powers-of-integers"],
      generate(rng) {
        for (;;) {
          const square = rng.bool(0.6);
          const x = square && rng.bool(0.7) ? -rng.int(1, 5) : rng.nonZero(-5, 5);
          const y = rng.nonZero(-6, 6);
          const a = rng.nonZero(-4, 4);
          const b = rng.nonZero(-4, 4);
          // Numerator x² + a·y or a·x + b·y; denominator x + b·y or x·y.
          const top = square ? x * x + a * y : a * x + b * y;
          const bottom = square ? x + b * y : x * y;
          if (bottom === 0 || top === 0) continue;
          if (top % bottom !== 0 && rng.bool(0.5)) continue;
          const numer = square ? poly([1, "x^2"], [a, "y"]) : poly([a, "x"], [b, "y"]);
          const denom = square ? poly([1, "x"], [b, "y"]) : "xy";
          const expr = fraction(numer, denom);
          const subTop = square ? `${inParens(x)}^2 ${plusTimes(a, y)}` : `${times(a, x)} ${plusTimes(b, y)}`;
          const subBottom = square ? `${inParens(x)} ${plusTimes(b, y)}` : `(${num(x)})(${num(y)})`;
          const answer = Q.of(top, bottom);
          const slip = square ? -x * x + a * y : a * x - b * y;
          const swapped = square ? y * y + a * x : a * y + b * x;
          const swappedBottom = square ? y + b * x : x * y;
          return numberProblem({
            prompt: t(
              `Evaluate $${expr}$ when $x = ${num(x)}$ and $y = ${num(y)}$.`,
              `当 $x = ${num(x)}$，$y = ${num(y)}$ 时，求 $${expr}$ 的值。`,
            ),
            answer,
            wrong: [
              ...(square ? [Q.of(slip, bottom), Q.of(2 * x + a * y, bottom)] : [Q.of(slip, bottom)]),
              ...(swappedBottom !== 0 ? [Q.of(swapped, swappedBottom)] : []),
              Q.of(bottom, top),
            ],
            solution: t(
              `Substitute both values, writing negative values in parentheses: ${steps(`${fraction(subTop, subBottom)} = ${fraction(num(top), num(bottom))} = ${num(answer)}`)}`,
              `代入两个值（负数要加括号）：${steps(`${fraction(subTop, subBottom)} = ${fraction(num(top), num(bottom))} = ${num(answer)}`)}`,
            ),
          });
        }
      },
    },
  ],
);

/** grade7ExpressionTopics lists the 7th grade topics on rewriting linear expressions and evaluating rational expressions. */
export const grade7ExpressionTopics: readonly TopicDef[] = [
  theDistributiveLawWithThreeTerms,
  distributingTheNegativeSignInALinearExpression,
  simplifyingLinearExpressionsUsingTheDistributiveLaw,
  simplifyingLinearExpressionsWhenAGroupOfTermsIsSubtracted,
  simplifyingLinearExpressionsContainingFractions,
  factoringNumericalExpressions,
  evaluatingRationalExpressions,
];
