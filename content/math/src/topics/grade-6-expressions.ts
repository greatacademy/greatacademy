import type { KnowledgePointDef, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, poly, Q } from "@ga/subject-math";

import { choiceProblem, expressionProblem, factoredProblem, numberProblem, steps, yesNo } from "../problems.ts";
import { mathText, pickChoice } from "./grade-4-fractions.ts";

// 6th Grade Math: writing, evaluating and reading algebraic expressions, and writing them in equivalent forms.

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

/** variables are the letters used for unknowns; none of them reads as an English word. */
const variables = ["x", "y", "n", "m", "p", "k", "t", "w"] as const;

/** pickVar draws a variable letter. */
const pickVar = (rng: Rng) => rng.pick(variables);

/** twoVars draws two different variable letters. */
function twoVars(rng: Rng): [string, string] {
  const [a, b] = rng.sample([...variables], 2) as [string, string];
  return a < b ? [a, b] : [b, a];
}

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

// ---------------------------------------------------------------------------
// Algebraic expressions

/** Phrase is a way to say a one-operation expression in words, with the expressions typical misreadings produce. */
interface Phrase {
  readonly words: Text;
  readonly latex: string;
  readonly wrong: readonly string[];
  /** misread are wrong phrases for the same numbers, used when the expression is given and the words are asked for. */
  readonly misread: readonly Text[];
}

/** phrases builds the one-operation phrases for a variable v and a number a. */
function phrases(v: string, a: number): Phrase[] {
  return [
    {
      words: t(`$${a}$ more than $${v}$`, `比 $${v}$ 多 $${a}$`),
      latex: `${v} + ${a}`,
      wrong: [`${a}${v}`, `${v} - ${a}`],
      misread: [t(`$${a}$ less than $${v}$`, `比 $${v}$ 少 $${a}$`), t(`the product of $${a}$ and $${v}$`, `$${a}$ 与 $${v}$ 的积`)],
    },
    {
      words: t(`$${a}$ less than $${v}$`, `比 $${v}$ 少 $${a}$`),
      latex: `${v} - ${a}`,
      wrong: [`${a} - ${v}`, `${v} + ${a}`],
      misread: [t(`$${v}$ less than $${a}$`, `比 $${a}$ 少 $${v}$`), t(`$${a}$ more than $${v}$`, `比 $${v}$ 多 $${a}$`)],
    },
    {
      words: t(`$${v}$ decreased by $${a}$`, `$${v}$ 减少 $${a}$`),
      latex: `${v} - ${a}`,
      wrong: [`${a} - ${v}`, `${v} + ${a}`],
      misread: [t(`$${a}$ decreased by $${v}$`, `$${a}$ 减少 $${v}$`), t(`$${v}$ increased by $${a}$`, `$${v}$ 增加 $${a}$`)],
    },
    {
      words: t(`the product of $${a}$ and $${v}$`, `$${a}$ 与 $${v}$ 的积`),
      latex: `${a}${v}`,
      wrong: [`${v} + ${a}`, `\\frac{${v}}{${a}}`],
      misread: [t(`the sum of $${a}$ and $${v}$`, `$${a}$ 与 $${v}$ 的和`), t(`$${v}$ divided by $${a}$`, `$${v}$ 除以 $${a}$`)],
    },
    {
      words: t(`$${v}$ divided by $${a}$`, `$${v}$ 除以 $${a}$`),
      latex: `\\frac{${v}}{${a}}`,
      wrong: [`\\frac{${a}}{${v}}`, `${a}${v}`],
      misread: [t(`$${a}$ divided by $${v}$`, `$${a}$ 除以 $${v}$`), t(`the product of $${a}$ and $${v}$`, `$${a}$ 与 $${v}$ 的积`)],
    },
    {
      words: t(`the quotient of $${v}$ and $${a}$`, `$${v}$ 与 $${a}$ 的商`),
      latex: `\\frac{${v}}{${a}}`,
      wrong: [`\\frac{${a}}{${v}}`, `${v} - ${a}`],
      misread: [
        t(`the quotient of $${a}$ and $${v}$`, `$${a}$ 与 $${v}$ 的商`),
        t(`the difference of $${v}$ and $${a}$`, `$${v}$ 与 $${a}$ 的差`),
      ],
    },
    {
      words: t(`the sum of $${v}$ and $${a}$`, `$${v}$ 与 $${a}$ 的和`),
      latex: `${v} + ${a}`,
      wrong: [`${a}${v}`, `${v} - ${a}`],
      misread: [
        t(`the product of $${v}$ and $${a}$`, `$${v}$ 与 $${a}$ 的积`),
        t(`the difference of $${v}$ and $${a}$`, `$${v}$ 与 $${a}$ 的差`),
      ],
    },
  ];
}

export const introductionToAlgebraicExpressions = topic(
  "introduction-to-algebraic-expressions",
  t("Introduction to Algebraic Expressions", "代数式入门"),
  t(
    "A variable is a letter that stands for a number, and an algebraic expression combines numbers and variables with operations. “5 more than n” is n + 5, “5 less than n” is n − 5 (not 5 − n), “the product of 5 and n” is 5n, and “n divided by 5” is n/5.",
    "变量是代表数的字母，代数式用运算把数和变量连接起来。“比 n 多 5”是 n + 5，“比 n 少 5”是 n − 5（不是 5 − n），“5 与 n 的积”是 5n，“n 除以 5”是 n/5。",
  ),
  ["creating-whole-number-expressions-from-terminology"],
  ["6.EE.A.2a"],
  [
    {
      id: "writing-expressions-from-words",
      title: t("From words to expressions", "把文字写成代数式"),
      explanation: t(
        "A number written next to a variable is multiplied by it: $4n$ means $4 \\times n$. Watch the order in “less than”: $3$ less than $n$ starts with $n$ and takes away $3$, so it is $n - 3$.",
        "数紧挨着变量写表示相乘：$4n$ 表示 $4 \\times n$。注意“少”的顺序：比 $n$ 少 $3$ 是从 $n$ 中减去 $3$，所以是 $n - 3$。",
      ),
      generate(rng) {
        const v = pickVar(rng);
        const a = rng.int(2, 15);
        const p = rng.pick(phrases(v, a));
        return expressionProblem({
          prompt: t(`Write an expression for ${p.words.en}.`, `用代数式表示“${p.words["zh-CN"]}”。`),
          answer: p.latex,
          wrong: [...p.wrong],
          solution: t(`${capitalize(p.words.en)} is $${p.latex}$.`, `“${p.words["zh-CN"]}”写作 $${p.latex}$。`),
        });
      },
    },
    {
      id: "reading-expressions-in-words",
      title: t("From expressions to words", "用文字描述代数式"),
      explanation: t(
        "$\\frac{n}{6}$ can be read “$n$ divided by $6$” or “the quotient of $n$ and $6$”. It is not “$6$ divided by $n$”: the number that is divided comes first.",
        "$\\frac{n}{6}$ 读作“$n$ 除以 $6$”或“$n$ 与 $6$ 的商”，不是“$6$ 除以 $n$”：被除数写在前面。",
      ),
      generate(rng) {
        const v = pickVar(rng);
        const a = rng.int(2, 15);
        const p = rng.pick(phrases(v, a));
        return pickChoice(
          rng,
          t(`Which phrase describes $${p.latex}$?`, `哪个说法描述的是 $${p.latex}$？`),
          p.words,
          p.misread,
          t(`$${p.latex}$ is ${p.words.en}.`, `$${p.latex}$ 是“${p.words["zh-CN"]}”。`),
        );
      },
    },
  ],
);

/** capitalize writes the first letter of a phrase as a capital. */
function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Story is a real-world quantity described by an expression in one variable. */
interface Story {
  readonly en: string;
  readonly zh: string;
  readonly latex: string;
  readonly why: Text;
  readonly wrong: readonly string[];
}

/** oneStepStories builds stories whose expressions use one operation. */
function oneStepStories(v: string, a: number): Story[] {
  return [
    {
      en: `Maya has $${v}$ marbles. Jon has $${a}$ more marbles than Maya. Write an expression for the number of marbles Jon has.`,
      zh: `Maya 有 $${v}$ 颗弹珠，Jon 比 Maya 多 $${a}$ 颗。用代数式表示 Jon 的弹珠数。`,
      latex: `${v} + ${a}`,
      why: t(`“$${a}$ more than $${v}$” means add: $${v} + ${a}$.`, `“比 $${v}$ 多 $${a}$”用加法：$${v} + ${a}$。`),
      wrong: [`${a}${v}`, `${v} - ${a}`],
    },
    {
      en: `Sam had $${v}$ stickers and gave away $${a}$ of them. Write an expression for the number of stickers Sam has left.`,
      zh: `Sam 有 $${v}$ 张贴纸，送出了 $${a}$ 张。用代数式表示 Sam 剩下的贴纸数。`,
      latex: `${v} - ${a}`,
      why: t(
        `Giving away $${a}$ takes them from the $${v}$ he had: $${v} - ${a}$.`,
        `送出 $${a}$ 张，是从原有的 $${v}$ 张中减去：$${v} - ${a}$。`,
      ),
      wrong: [`${a} - ${v}`, `${v} + ${a}`],
    },
    {
      en: `Movie tickets cost $\\$${a}$ each. Write an expression for the cost, in dollars, of $${v}$ tickets.`,
      zh: `电影票每张 $\\$${a}$。用代数式表示 $${v}$ 张票的总价（美元）。`,
      latex: `${a}${v}`,
      why: t(
        `$${v}$ tickets at $\\$${a}$ each cost $${a} \\times ${v} = ${a}${v}$ dollars.`,
        `$${v}$ 张票，每张 $\\$${a}$，共 $${a} \\times ${v} = ${a}${v}$ 美元。`,
      ),
      wrong: [`${v} + ${a}`, `\\frac{${v}}{${a}}`],
    },
    {
      en: `A rope $${v}$ meters long is cut into $${a}$ equal pieces. Write an expression for the length of each piece, in meters.`,
      zh: `一根长 $${v}$ 米的绳子被剪成 $${a}$ 段同样长的绳子。用代数式表示每段的长度（米）。`,
      latex: `\\frac{${v}}{${a}}`,
      why: t(
        `Sharing $${v}$ meters equally among $${a}$ pieces is a division: $\\frac{${v}}{${a}}$.`,
        `把 $${v}$ 米平均分成 $${a}$ 段用除法：$\\frac{${v}}{${a}}$。`,
      ),
      wrong: [`\\frac{${a}}{${v}}`, `${v} - ${a}`],
    },
  ];
}

/** twoStepStories builds stories and phrases whose expressions use two operations. */
function twoStepStories(v: string, a: number, b: number): Story[] {
  return [
    {
      en: `Pencils cost $\\$${a}$ each and a notebook costs $\\$${b}$. Write an expression for the cost, in dollars, of $${v}$ pencils and one notebook.`,
      zh: `铅笔每支 $\\$${a}$，笔记本每本 $\\$${b}$。用代数式表示买 $${v}$ 支铅笔和一本笔记本的总价（美元）。`,
      latex: `${a}${v} + ${b}`,
      why: t(
        `The pencils cost $${a}${v}$ dollars; add the notebook: $${a}${v} + ${b}$.`,
        `铅笔共 $${a}${v}$ 美元，再加上笔记本：$${a}${v} + ${b}$。`,
      ),
      wrong: [`${a}(${v} + ${b})`, `${a} + ${b}${v}`, `${a + b}${v}`],
    },
    {
      en: `A taxi charges $\\$${b}$ to start a ride plus $\\$${a}$ for each mile. Write an expression for the cost, in dollars, of a ride of $${v}$ miles.`,
      zh: `出租车起步价 $\\$${b}$，每英里另收 $\\$${a}$。用代数式表示行驶 $${v}$ 英里的车费（美元）。`,
      latex: `${b} + ${a}${v}`,
      why: t(
        `$${v}$ miles at $\\$${a}$ each cost $${a}${v}$; add the starting charge: $${b} + ${a}${v}$.`,
        `$${v}$ 英里每英里 $\\$${a}$，共 $${a}${v}$；再加上起步价：$${b} + ${a}${v}$。`,
      ),
      wrong: [`${a}(${v} + ${b})`, `${b}${v} + ${a}`, `${a + b}${v}`],
    },
    {
      en: `Write an expression for $${a}$ times the sum of $${v}$ and $${b}$.`,
      zh: `用代数式表示“$${v}$ 与 $${b}$ 的和的 $${a}$ 倍”。`,
      latex: `${a}(${v} + ${b})`,
      why: t(
        `The sum $${v} + ${b}$ is found first, so it goes in parentheses: $${a}(${v} + ${b})$.`,
        `先求和 $${v} + ${b}$，所以要加括号：$${a}(${v} + ${b})$。`,
      ),
      wrong: [`${a}${v} + ${b}`, `${v} + ${a * b}`],
    },
    {
      en: `Write an expression for $${b}$ less than the product of $${a}$ and $${v}$.`,
      zh: `用代数式表示“比 $${a}$ 与 $${v}$ 的积少 $${b}$”。`,
      latex: `${a}${v} - ${b}`,
      why: t(
        `The product is $${a}${v}$, and $${b}$ less than it is $${a}${v} - ${b}$.`,
        `积是 $${a}${v}$，比它少 $${b}$ 是 $${a}${v} - ${b}$。`,
      ),
      wrong: [`${b} - ${a}${v}`, `${a}(${v} - ${b})`],
    },
    {
      en: `Write an expression for the quotient of $${v}$ and $${a}$, increased by $${b}$.`,
      zh: `用代数式表示“$${v}$ 与 $${a}$ 的商再增加 $${b}$”。`,
      latex: `\\frac{${v}}{${a}} + ${b}`,
      why: t(
        `The quotient is $\\frac{${v}}{${a}}$; increasing it by $${b}$ gives $\\frac{${v}}{${a}} + ${b}$.`,
        `商是 $\\frac{${v}}{${a}}$，再增加 $${b}$ 得 $\\frac{${v}}{${a}} + ${b}$。`,
      ),
      wrong: [`\\frac{${v} + ${b}}{${a}}`, `\\frac{${a}}{${v}} + ${b}`],
    },
  ];
}

export const constructingAlgebraicExpressions = topic(
  "constructing-algebraic-expressions",
  t("Constructing Algebraic Expressions", "列代数式"),
  t(
    "To write an expression for a situation, decide which operation each part describes. If pencils cost \\$2 each and a notebook costs \\$5, then p pencils and a notebook cost 2p + 5 dollars. Use parentheses for a sum or difference that is found first: “3 times the sum of x and 4” is 3(x + 4).",
    "为情境列代数式时，先判断每一部分对应哪种运算。铅笔每支 2 美元、笔记本 5 美元，那么 p 支铅笔和一本笔记本共 2p + 5 美元。需要先算的和或差要加括号：“x 与 4 的和的 3 倍”是 3(x + 4)。",
  ),
  ["introduction-to-algebraic-expressions"],
  ["6.EE.A.2a", "6.EE.B.6"],
  [
    {
      id: "one-operation-in-context",
      title: t("One operation in context", "情境中的一步运算"),
      explanation: t(
        "Ask what happens to the unknown amount: more → add, fewer or taken away → subtract, “each” with several → multiply, shared equally → divide. $t$ tickets at $\\$8$ each cost $8t$ dollars.",
        "想一想未知量发生了什么变化：多了 → 加，少了或拿走 → 减，“每个”有几个 → 乘，平均分 → 除。每张 $\\$8$ 的票买 $t$ 张需要 $8t$ 美元。",
      ),
      generate(rng) {
        const s = rng.pick(oneStepStories(pickVar(rng), rng.int(2, 12)));
        return expressionProblem({ prompt: t(s.en, s.zh), answer: s.latex, wrong: [...s.wrong], solution: s.why });
      },
    },
    {
      id: "two-operations",
      title: t("Two operations", "两步运算"),
      explanation: t(
        "Build the expression in the order the quantity is found. A taxi that charges $\\$3$ plus $\\$2$ per mile costs $3 + 2m$ for $m$ miles; “$2$ times the sum of $m$ and $3$” is $2(m + 3)$, which is different.",
        "按求出这个量的先后顺序列式。起步价 $\\$3$、每英里 $\\$2$ 的出租车，行驶 $m$ 英里收费 $3 + 2m$；而“$m$ 与 $3$ 的和的 $2$ 倍”是 $2(m + 3)$，两者不同。",
      ),
      generate(rng) {
        const a = rng.int(2, 9);
        let b: number;
        do b = rng.int(2, 12);
        while (b === a);
        const s = rng.pick(twoStepStories(pickVar(rng), a, b));
        return expressionProblem({ prompt: t(s.en, s.zh), answer: s.latex, wrong: [...s.wrong], solution: s.why });
      },
    },
  ],
);

/** LinearForm is an expression in one variable with a function that evaluates it. */
interface LinearForm {
  readonly latex: string;
  readonly at: (x: Q) => Q;
  /** misread evaluates the expression with the coefficient added instead of multiplied, or the division reversed. */
  readonly misread: (x: Q) => Q;
  /** slip evaluates the expression with the operations in the wrong order. */
  readonly slip: (x: Q) => Q;
  /** sub writes the expression with the value substituted. */
  readonly sub: (x: string) => string;
}

/** linearForms are the shapes of the linear expressions evaluated in this course. */
function linearForms(v: string, a: number, b: number): LinearForm[] {
  const A = Q.of(a);
  const B = Q.of(b);
  return [
    {
      latex: `${a}${v} + ${b}`,
      at: (x) => A.mul(x).add(B),
      misread: (x) => A.add(x).add(B),
      slip: (x) => A.mul(x.add(B)),
      sub: (x) => `${a} \\times ${x} + ${b}`,
    },
    {
      latex: `${a}(${v} + ${b})`,
      at: (x) => A.mul(x.add(B)),
      misread: (x) => A.add(x).add(B),
      slip: (x) => A.mul(x).add(B),
      sub: (x) => `${a} \\times (${x} + ${b})`,
    },
    {
      latex: `${b} + \\frac{${v}}{${a}}`,
      at: (x) => B.add(x.div(A)),
      misread: (x) => B.add(A.div(x)),
      slip: (x) => B.add(x).div(A),
      sub: (x) => `${b} + ${x} \\div ${a}`,
    },
  ];
}

export const evaluatingLinearExpressions = topic(
  "evaluating-linear-expressions",
  t("Evaluating Linear Expressions", "一次式求值"),
  t(
    "To evaluate an expression, replace the variable with its value and follow the order of operations. For x = 4, 3x + 2 = 3 × 4 + 2 = 14, and 3(x + 2) = 3 × 6 = 18. Remember that 3x means 3 × x, not 3 + x.",
    "代数式求值时，把变量换成它的值，再按运算顺序计算。当 x = 4 时，3x + 2 = 3 × 4 + 2 = 14，3(x + 2) = 3 × 6 = 18。注意 3x 表示 3 × x，而不是 3 + x。",
  ),
  ["introduction-to-algebraic-expressions"],
  ["6.EE.A.2c"],
  [
    {
      id: "whole-number-values",
      title: t("Whole-number values", "代入整数"),
      explanation: t(
        "For $n = 6$: $4n + 5 = 4 \\times 6 + 5 = 29$ and $4(n + 5) = 4 \\times 11 = 44$.",
        "当 $n = 6$ 时：$4n + 5 = 4 \\times 6 + 5 = 29$，$4(n + 5) = 4 \\times 11 = 44$。",
      ),
      generate(rng) {
        const v = pickVar(rng);
        const a = rng.int(2, 9);
        const b = rng.int(1, 15);
        const f = rng.pick(linearForms(v, a, b));
        const x = Q.of(f.latex.includes("frac") ? a * rng.int(1, 9) : rng.int(2, 12));
        const value = f.at(x);
        return numberProblem({
          prompt: t(`Evaluate $${f.latex}$ when $${v} = ${x.toString()}$.`, `当 $${v} = ${x.toString()}$ 时，求 $${f.latex}$ 的值。`),
          answer: value,
          form: "integer",
          wrong: [f.misread(x), f.slip(x)],
          solution: t(
            `Replace $${v}$ with $${x.toString()}$: $${f.sub(x.toString())} = ${value.toString()}$.`,
            `把 $${v}$ 换成 $${x.toString()}$：$${f.sub(x.toString())} = ${value.toString()}$。`,
          ),
        });
      },
    },
    {
      id: "fraction-and-decimal-values",
      title: t("Fraction and decimal values", "代入分数和小数"),
      explanation: t(
        "For $x = \\frac{1}{2}$: $6x + 1 = 6 \\times \\frac{1}{2} + 1 = 3 + 1 = 4$. For $x = 2.5$: $4x - 3 = 10 - 3 = 7$.",
        "当 $x = \\frac{1}{2}$ 时：$6x + 1 = 6 \\times \\frac{1}{2} + 1 = 3 + 1 = 4$。当 $x = 2.5$ 时：$4x - 3 = 10 - 3 = 7$。",
      ),
      generate(rng) {
        const v = pickVar(rng);
        const decimal = rng.bool();
        const x = decimal
          ? Q.of(rng.int(11, 59), 10)
          : (([p, q]) => Q.of(p, q))(
              rng.pick([
                [1, 2],
                [1, 3],
                [2, 3],
                [1, 4],
                [3, 4],
                [2, 5],
                [3, 5],
              ] as const),
            );
        if (x.isInteger()) return this.generate(rng);
        const a = decimal ? rng.int(2, 9) : Number(x.d) * rng.int(1, 3);
        const b = rng.int(1, 12);
        const value = Q.of(a).mul(x).add(Q.of(b));
        const xs = decimal ? dec(x) : x.toLatex();
        return numberProblem({
          prompt: t(`Evaluate $${a}${v} + ${b}$ when $${v} = ${xs}$.`, `当 $${v} = ${xs}$ 时，求 $${a}${v} + ${b}$ 的值。`),
          answer: value,
          form: decimal ? "decimal" : value.isInteger() ? "integer" : "fraction",
          wrong: [Q.of(a).add(x).add(Q.of(b)), Q.of(a).mul(x.add(Q.of(b)))],
          solution: t(
            `$${a} \\times ${xs} + ${b} = ${decimal ? dec(Q.of(a).mul(x)) : Q.of(a).mul(x).toLatex()} + ${b} = ${decimal ? dec(value) : value.toLatex()}$.`,
            `$${a} \\times ${xs} + ${b} = ${decimal ? dec(Q.of(a).mul(x)) : Q.of(a).mul(x).toLatex()} + ${b} = ${decimal ? dec(value) : value.toLatex()}$。`,
          ),
        });
      },
    },
  ],
);

export const evaluatingAlgebraicExpressions = topic(
  "evaluating-algebraic-expressions",
  t("Evaluating Algebraic Expressions", "代数式求值"),
  t(
    "Expressions can contain exponents and more than one variable. Substitute every value, then evaluate powers first: for x = 3, x² + 2x = 9 + 6 = 15. For l = 7 and w = 4, the perimeter 2l + 2w = 14 + 8 = 22.",
    "代数式中可以有指数和多个变量。先代入所有的值，再先算乘方：当 x = 3 时，x² + 2x = 9 + 6 = 15。当 l = 7、w = 4 时，周长 2l + 2w = 14 + 8 = 22。",
  ),
  ["evaluating-linear-expressions", "evaluating-whole-number-expressions-containing-exponents"],
  ["6.EE.A.2c"],
  [
    {
      id: "expressions-with-exponents",
      title: t("Expressions with exponents", "含指数的代数式"),
      explanation: t(
        "$x^2$ means $x \\times x$, not $2x$. For $x = 5$: $x^2 - 3x = 25 - 15 = 10$, and $(x + 1)^2 = 6^2 = 36$.",
        "$x^2$ 表示 $x \\times x$，不是 $2x$。当 $x = 5$ 时：$x^2 - 3x = 25 - 15 = 10$，$(x + 1)^2 = 6^2 = 36$。",
      ),
      generate(rng) {
        const v = pickVar(rng);
        const x = rng.int(2, 9);
        const a = rng.int(2, 9);
        const kind = rng.int(0, 3);
        const forms = [
          {
            latex: `${v}^{2} + ${a}${v}`,
            value: x * x + a * x,
            sub: `${x}^{2} + ${a} \\times ${x} = ${x * x} + ${a * x}`,
            slip: 2 * x + a * x,
          },
          { latex: `${a}${v}^{2}`, value: a * x * x, sub: `${a} \\times ${x}^{2} = ${a} \\times ${x * x}`, slip: a * x * a * x },
          { latex: `(${v} + ${a})^{2}`, value: (x + a) ** 2, sub: `(${x} + ${a})^{2} = ${x + a}^{2}`, slip: x * x + a * a },
          { latex: `${v}^{3} - ${a}`, value: x ** 3 - a, sub: `${x}^{3} - ${a} = ${x ** 3} - ${a}`, slip: 3 * x - a },
        ] as const;
        const f = forms[kind]!;
        return numberProblem({
          prompt: t(`Evaluate $${f.latex}$ when $${v} = ${x}$.`, `当 $${v} = ${x}$ 时，求 $${f.latex}$ 的值。`),
          answer: f.value,
          form: "integer",
          wrong: [f.slip],
          solution: t(`Evaluate the power first: $${f.sub} = ${f.value}$.`, `先算乘方：$${f.sub} = ${f.value}$。`),
        });
      },
    },
    {
      id: "expressions-with-two-variables",
      title: t("Two variables and formulas", "两个变量与公式"),
      explanation: t(
        "Substitute each value for its own letter. The area of a triangle is $A = \\frac{1}{2}bh$; for $b = 10$ and $h = 7$, $A = \\frac{1}{2} \\times 10 \\times 7 = 35$.",
        "把每个值代入对应的字母。三角形面积 $A = \\frac{1}{2}bh$；当 $b = 10$，$h = 7$ 时，$A = \\frac{1}{2} \\times 10 \\times 7 = 35$。",
      ),
      generate(rng) {
        const kind = rng.int(0, 3);
        if (kind === 0) {
          const [u, v] = twoVars(rng);
          const a = rng.int(2, 9);
          const b = rng.int(2, 9);
          const x = rng.int(1, 10);
          const y = rng.int(1, 10);
          const value = a * x + b * y;
          return numberProblem({
            prompt: t(
              `Evaluate $${a}${u} + ${b}${v}$ when $${u} = ${x}$ and $${v} = ${y}$.`,
              `当 $${u} = ${x}$，$${v} = ${y}$ 时，求 $${a}${u} + ${b}${v}$ 的值。`,
            ),
            answer: value,
            form: "integer",
            wrong: [a * y + b * x, a + x + b + y],
            solution: t(
              `$${a} \\times ${x} + ${b} \\times ${y} = ${a * x} + ${b * y} = ${value}$.`,
              `$${a} \\times ${x} + ${b} \\times ${y} = ${a * x} + ${b * y} = ${value}$。`,
            ),
          });
        }
        if (kind === 1) {
          const l = rng.int(5, 20);
          const w = rng.int(2, l - 1);
          return numberProblem({
            prompt: t(
              `The perimeter of a rectangle is $P = 2l + 2w$. Find $P$ when $l = ${l}$ cm and $w = ${w}$ cm.`,
              `长方形的周长 $P = 2l + 2w$。当 $l = ${l}$ 厘米，$w = ${w}$ 厘米时，求 $P$。`,
            ),
            answer: 2 * l + 2 * w,
            form: "integer",
            unit: "cm",
            wrong: [l + w, l * w, 2 * l + w],
            solution: t(
              `$P = 2 \\times ${l} + 2 \\times ${w} = ${2 * l} + ${2 * w} = ${2 * l + 2 * w}$ cm.`,
              `$P = 2 \\times ${l} + 2 \\times ${w} = ${2 * l} + ${2 * w} = ${2 * l + 2 * w}$ 厘米。`,
            ),
          });
        }
        if (kind === 2) {
          const b = rng.int(2, 12) * 2;
          const h = rng.int(3, 15);
          return numberProblem({
            prompt: t(
              `The area of a triangle is $A = \\frac{1}{2}bh$. Find $A$ when $b = ${b}$ m and $h = ${h}$ m.`,
              `三角形的面积 $A = \\frac{1}{2}bh$。当 $b = ${b}$ 米，$h = ${h}$ 米时，求 $A$。`,
            ),
            answer: (b * h) / 2,
            form: "integer",
            unit: "m^2",
            wrong: [b * h, b + h],
            solution: t(
              `$A = \\frac{1}{2} \\times ${b} \\times ${h} = ${b / 2} \\times ${h} = ${(b * h) / 2}$ m².`,
              `$A = \\frac{1}{2} \\times ${b} \\times ${h} = ${b / 2} \\times ${h} = ${(b * h) / 2}$ 平方米。`,
            ),
          });
        }
        const s = rng.int(2, 9);
        return numberProblem({
          prompt: t(
            `The volume of a cube with edge length $s$ is $V = s^{3}$. Find $V$ when $s = ${s}$ in.`,
            `棱长为 $s$ 的正方体体积 $V = s^{3}$。当 $s = ${s}$ 英寸时，求 $V$。`,
          ),
          answer: s ** 3,
          form: "integer",
          unit: "in^3",
          wrong: [3 * s, s * s],
          solution: t(
            `$V = ${s}^{3} = ${s} \\times ${s} \\times ${s} = ${s ** 3}$ in³.`,
            `$V = ${s}^{3} = ${s} \\times ${s} \\times ${s} = ${s ** 3}$ 立方英寸。`,
          ),
        });
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Parts of an expression

/** Term is a term of a linear expression: a coefficient and a variable, or a constant when the variable is "". */
type Term = readonly [number, string];

/** termLatex writes one term on its own, with its sign: "-4y", "x", "7". */
const termLatex = ([c, v]: Term) => poly([c, v]);

/** randomExpression draws a linear expression with n terms in two variables and a constant, no two of them alike. */
function randomExpression(rng: Rng, n: number): Term[] {
  const [u, v] = twoVars(rng);
  const kinds = rng.shuffle([u, v, ""]).slice(0, Math.min(n, 3));
  const terms: Term[] = kinds.map((k, i) => [i === 0 ? rng.int(1, 9) : rng.nonZero(-9, 9), k]);
  if (n === 4) terms.push([rng.nonZero(-9, 9), rng.pick([u, v].filter((x) => !kinds.includes(x)).concat([`${u}^{2}`]))]);
  return terms;
}

/** exprLatex writes the terms as an expression. */
const exprLatex = (terms: readonly Term[]) => poly(...terms);

export const identifyingTermsInLinearExpressions = topic(
  "identifying-terms-in-linear-expressions",
  t("Identifying Terms in Linear Expressions", "识别一次式中的项"),
  t(
    "The terms of an expression are the parts that are added or subtracted. 4x + 7 − 2y has three terms: 4x, 7 and −2y. A term can be a number, a variable, or a number times a variable; the 4 in 4x is part of the term, not a term of its own.",
    "代数式中相加或相减的各部分叫做项。4x + 7 − 2y 有三项：4x、7 和 −2y。项可以是一个数、一个变量，或者数与变量的积；4x 中的 4 是这一项的一部分，不是单独的一项。",
  ),
  ["introduction-to-algebraic-expressions"],
  ["6.EE.A.2b"],
  [
    {
      id: "counting-terms",
      title: t("Counting terms", "数一数有几项"),
      explanation: t(
        "Split the expression at each $+$ or $-$ sign that is not inside parentheses: $5m - 3 + n$ has the terms $5m$, $-3$ and $n$, so it has $3$ terms.",
        "在不在括号里的每个 $+$、$-$ 号处把代数式分开：$5m - 3 + n$ 的项是 $5m$、$-3$ 和 $n$，所以有 $3$ 项。",
      ),
      generate(rng) {
        const n = rng.int(2, 4);
        const terms = randomExpression(rng, n);
        const e = exprLatex(terms);
        return numberProblem({
          prompt: t(`How many terms does $${e}$ have?`, `$${e}$ 有几项？`),
          answer: n,
          form: "integer",
          wrong: [n + 1, n - 1, 2 * n],
          solution: t(
            `The terms are the parts added or subtracted: ${terms.map((x) => `$${termLatex(x)}$`).join(", ")}. That is $${n}$ terms.`,
            `相加或相减的各部分是：${terms.map((x) => `$${termLatex(x)}$`).join("、")}。共 $${n}$ 项。`,
          ),
        });
      },
    },
    {
      id: "recognizing-a-term",
      title: t("Recognizing a term", "识别项"),
      explanation: t(
        "In $6x + 2y + 9$, the terms are $6x$, $2y$ and $9$. Neither $6$ (part of the term $6x$) nor $x + 2y$ (a sum of two terms) is a term.",
        "在 $6x + 2y + 9$ 中，项是 $6x$、$2y$ 和 $9$。$6$（是 $6x$ 这一项的一部分）和 $x + 2y$（两项的和）都不是项。",
      ),
      generate(rng) {
        const [u, v] = twoVars(rng);
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const c = rng.int(2, 15);
        if (a === b || a === c) return this.generate(rng);
        const e = `${a}${u} + ${b}${v} + ${c}`;
        const target = rng.pick([`${a}${u}`, `${b}${v}`, `${c}`]);
        return pickChoice(
          rng,
          t(`Which of these is a term of $${e}$?`, `下面哪个是 $${e}$ 的项？`),
          mathText(target),
          [mathText(`${a}`), mathText(`${u} + ${b}${v}`), mathText(`${b}${v} + ${c}`), mathText(u)],
          t(
            `The terms of $${e}$ are $${a}${u}$, $${b}${v}$ and $${c}$, so $${target}$ is a term.`,
            `$${e}$ 的项是 $${a}${u}$、$${b}${v}$ 和 $${c}$，所以 $${target}$ 是它的项。`,
          ),
        );
      },
    },
  ],
);

export const identifyingCoefficientsAndConstants = topic(
  "identifying-coefficients-and-constants",
  t("Identifying Coefficients and Constants", "识别系数和常数项"),
  t(
    "The coefficient of a term is the number that multiplies the variable, and a constant term has no variable. In 5x − 3y + 8, the coefficient of x is 5, the coefficient of y is −3 (because − 3y means + (−3)y), and the constant is 8. A variable on its own, such as y, has coefficient 1.",
    "项中与变量相乘的数叫做系数，不含变量的项叫做常数项。在 5x − 3y + 8 中，x 的系数是 5，y 的系数是 −3（因为 − 3y 就是 + (−3)y），常数项是 8。单独的变量（如 y）系数是 1。",
  ),
  ["identifying-terms-in-linear-expressions", "integers-and-opposites"],
  ["6.EE.A.2b"],
  [
    {
      id: "finding-a-coefficient",
      title: t("Finding a coefficient", "找系数"),
      explanation: t(
        "In $x + 4 - 7y$, the coefficient of $x$ is $1$ and the coefficient of $y$ is $-7$. In $\\frac{2}{3}m$, the coefficient is $\\frac{2}{3}$.",
        "在 $x + 4 - 7y$ 中，$x$ 的系数是 $1$，$y$ 的系数是 $-7$。在 $\\frac{2}{3}m$ 中，系数是 $\\frac{2}{3}$。",
      ),
      generate(rng) {
        const [u, v] = twoVars(rng);
        const kind = rng.int(0, 3);
        const c = rng.nonZero(-12, 12);
        let coef: Q;
        let e: string;
        if (kind === 0) {
          coef = Q.of(rng.pick([1, -1]));
          e = rng.bool() ? poly([rng.int(2, 9), u], [coef, v], [c, ""]) : poly([coef, v], [rng.nonZero(-9, 9), u], [c, ""]);
        } else if (kind === 1) {
          coef = Q.of(-rng.int(2, 12));
          e = poly([rng.int(2, 9), u], [coef, v], [c, ""]);
        } else if (kind === 2) {
          coef = Q.of(rng.int(1, 9), rng.int(2, 5));
          if (coef.isInteger()) return this.generate(rng);
          e = `${coef.toLatex()}${v} ${c < 0 ? "-" : "+"} ${Math.abs(c)}`;
        } else {
          coef = Q.of(rng.int(2, 12));
          e = poly([c, ""], [coef, v], [rng.nonZero(-9, 9), u]);
        }
        return numberProblem({
          prompt: t(`What is the coefficient of $${v}$ in $${e}$?`, `$${e}$ 中 $${v}$ 的系数是多少？`),
          answer: coef,
          wrong: [coef.abs(), Q.of(c), coef.eq(Q.one) ? Q.of(0) : coef.neg()],
          solution: t(
            `The term with $${v}$ is $${poly([coef, v])}$, so the coefficient of $${v}$ is $${coef.toLatex()}$.`,
            `含 $${v}$ 的项是 $${poly([coef, v])}$，所以 $${v}$ 的系数是 $${coef.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "finding-the-constant-term",
      title: t("Finding the constant term", "找常数项"),
      explanation: t(
        "The constant term has no variable. In $3x - 9$, the constant term is $-9$, since $3x - 9 = 3x + (-9)$.",
        "常数项不含变量。在 $3x - 9$ 中，常数项是 $-9$，因为 $3x - 9 = 3x + (-9)$。",
      ),
      generate(rng) {
        const [u, v] = twoVars(rng);
        const c = rng.nonZero(-15, 15);
        const a = rng.int(2, 9);
        const b = rng.nonZero(-9, 9);
        const terms: Term[] = rng.shuffle<Term>([
          [a, u],
          [b, v],
          [c, ""],
        ]);
        if (terms[0]![0] < 0) return this.generate(rng);
        const e = exprLatex(terms);
        return numberProblem({
          prompt: t(`What is the constant term of $${e}$?`, `$${e}$ 的常数项是多少？`),
          answer: c,
          form: "integer",
          wrong: [-c, a, b],
          solution: t(
            `The only term without a variable is $${termLatex([c, ""])}$, so the constant term is $${c}$.`,
            `唯一不含变量的项是 $${termLatex([c, ""])}$，所以常数项是 $${c}$。`,
          ),
        });
      },
    },
  ],
);

export const identifyingLikeTermsInLinearExpressions = topic(
  "identifying-like-terms-in-linear-expressions",
  t("Identifying Like Terms in Linear Expressions", "识别一次式中的同类项"),
  t(
    "Like terms have exactly the same variable part, with the same exponent. 3x and −7x are like terms; 3x and 3y are not, and neither are 3x and 3x² or 3x and 3. All constants are like terms of each other.",
    "变量部分（包括指数）完全相同的项叫做同类项。3x 与 −7x 是同类项；3x 与 3y 不是，3x 与 3x²、3x 与 3 也不是。所有常数项都是同类项。",
  ),
  ["identifying-coefficients-and-constants"],
  ["6.EE.A.3"],
  [
    {
      id: "a-like-term",
      title: t("Finding a like term", "找同类项"),
      explanation: t(
        "A term like $5k$ must have the variable $k$ and nothing else: $-2k$ and $\\frac{1}{2}k$ are like it, but $5m$, $5k^2$ and $5$ are not.",
        "与 $5k$ 是同类项的项只能含变量 $k$：$-2k$、$\\frac{1}{2}k$ 是，$5m$、$5k^2$、$5$ 都不是。",
      ),
      generate(rng) {
        const [u, v] = twoVars(rng);
        const a = rng.int(2, 9);
        let b: number;
        do b = rng.nonZero(-9, 9);
        while (b === a);
        const given = `${a}${u}`;
        return pickChoice(
          rng,
          t(`Which term is a like term of $${given}$?`, `哪一项与 $${given}$ 是同类项？`),
          mathText(poly([b, u])),
          [mathText(`${a}${v}`), mathText(`${a}${u}^{2}`), mathText(`${a}`), mathText(`${b}${u}${v}`)],
          t(
            `$${poly([b, u])}$ has the same variable part, $${u}$, as $${given}$. The others have a different variable, an exponent, or no variable.`,
            `$${poly([b, u])}$ 与 $${given}$ 的变量部分都是 $${u}$。其他各项的变量不同、带指数或不含变量。`,
          ),
        );
      },
    },
    {
      id: "like-terms-in-an-expression",
      title: t("Like terms in an expression", "代数式中的同类项"),
      explanation: t(
        "In $4x + 5y - 2 + 3x$, the terms $4x$ and $3x$ are like terms. $5y$ and $-2$ have no like terms.",
        "在 $4x + 5y - 2 + 3x$ 中，$4x$ 与 $3x$ 是同类项。$5y$ 和 $-2$ 没有同类项。",
      ),
      generate(rng) {
        const [u, v] = twoVars(rng);
        const like = rng.pick([u, v, ""]);
        const others = [u, v, ""].filter((k) => k !== like);
        const p: Term = [rng.int(2, 9), like];
        let q: Term;
        do q = [rng.nonZero(-9, 9), like];
        while (q[0] === p[0]);
        const r: Term = [rng.nonZero(-9, 9), others[0]!];
        const s: Term = [rng.nonZero(-9, 9), others[1]!];
        const terms = rng.shuffle<Term>([p, q, r, s]);
        if (terms[0]![0] < 0) return this.generate(rng);
        const e = exprLatex(terms);
        const pair = (x: Term, y: Term) => t(`$${termLatex(x)}$ and $${termLatex(y)}$`, `$${termLatex(x)}$ 与 $${termLatex(y)}$`);
        return pickChoice(
          rng,
          t(`Which two terms of $${e}$ are like terms?`, `$${e}$ 中哪两项是同类项？`),
          pair(p, q),
          [pair(p, r), pair(r, s), pair(q, s)],
          t(
            `$${termLatex(p)}$ and $${termLatex(q)}$ ${like === "" ? "are both constants" : `both have the variable part $${like}$`}, so they are like terms.`,
            `$${termLatex(p)}$ 与 $${termLatex(q)}$ ${like === "" ? "都是常数项" : `的变量部分都是 $${like}$`}，所以是同类项。`,
          ),
        );
      },
    },
  ],
);

export const theGreatestCommonFactorOfTwoLinearExpressions = topic(
  "the-greatest-common-factor-of-two-linear-expressions",
  t("The Greatest Common Factor of Two Linear Expressions", "两个一次式的最大公因数"),
  t(
    "The greatest common factor of two terms is the largest expression that divides both. Find the GCF of the coefficients, and include a variable only if both terms have it: the GCF of 12x and 18x is 6x, while the GCF of 12x and 18 is 6.",
    "两项的最大公因数是能同时整除它们的最大的式子。先求系数的最大公因数，只有两项都含某个变量时才把这个变量写进去：12x 与 18x 的最大公因数是 6x，12x 与 18 的最大公因数是 6。",
  ),
  ["identifying-coefficients-and-constants", "greatest-common-factor-by-listing"],
  ["6.NS.B.4"],
  [
    {
      id: "gcf-of-terms-with-the-same-variable",
      title: t("Terms with the same variable", "含相同变量的项"),
      explanation: t(
        "$12x = 6 \\cdot 2x$ and $18x = 6 \\cdot 3x$, and $2$ and $3$ share no factor, so the GCF is $6x$.",
        "$12x = 6 \\cdot 2x$，$18x = 6 \\cdot 3x$，$2$ 与 $3$ 没有公因数，所以最大公因数是 $6x$。",
      ),
      generate(rng) {
        const v = pickVar(rng);
        const g = rng.int(2, 9);
        let p: number;
        let q: number;
        do {
          p = rng.int(1, 8);
          q = rng.int(2, 9);
        } while (p === q || gcd(p, q) !== 1);
        const a = g * p;
        const b = g * q;
        return expressionProblem({
          prompt: t(`Find the greatest common factor of $${a}${v}$ and $${b}${v}$.`, `求 $${a}${v}$ 与 $${b}${v}$ 的最大公因数。`),
          answer: `${g}${v}`,
          wrong: [`${g}`, `${a * b}${v}`, `${gcd(a, b) === g ? g * 2 : g}${v}^{2}`],
          solution: t(
            `The GCF of $${a}$ and $${b}$ is $${g}$, and both terms have the factor $${v}$: $${a}${v} = ${g}${v} \\cdot ${p}$ and $${b}${v} = ${g}${v} \\cdot ${q}$. The GCF is $${g}${v}$.`,
            `$${a}$ 与 $${b}$ 的最大公因数是 $${g}$，两项都含因数 $${v}$：$${a}${v} = ${g}${v} \\cdot ${p}$，$${b}${v} = ${g}${v} \\cdot ${q}$。最大公因数是 $${g}${v}$。`,
          ),
        });
      },
    },
    {
      id: "gcf-when-a-variable-is-missing",
      title: t("When only one term has the variable", "只有一项含变量"),
      explanation: t(
        "$18$ has no factor of $x$, so the GCF of $12x$ and $18$ is just the GCF of $12$ and $18$, which is $6$.",
        "$18$ 不含因数 $x$，所以 $12x$ 与 $18$ 的最大公因数就是 $12$ 与 $18$ 的最大公因数 $6$。",
      ),
      generate(rng) {
        const [u, v] = twoVars(rng);
        const g = rng.int(2, 9);
        let p: number;
        let q: number;
        do {
          p = rng.int(1, 8);
          q = rng.int(2, 9);
        } while (p === q || gcd(p, q) !== 1);
        const a = g * p;
        const b = g * q;
        const second = rng.bool() ? "" : v;
        return numberProblem({
          prompt: t(
            `Find the greatest common factor of $${a}${u}$ and $${b}${second}$.`,
            `求 $${a}${u}$ 与 $${b}${second}$ 的最大公因数。`,
          ),
          answer: g,
          form: "integer",
          wrong: [a * b, gcd(a, b) === g ? Math.min(a, b) : g + 1],
          solution: t(
            `${second === "" ? `$${b}$ has no variable` : `The terms have different variables, $${u}$ and $${v}$`}, so the GCF is the GCF of $${a}$ and $${b}$: $${g}$.`,
            `${second === "" ? `$${b}$ 不含变量` : `两项的变量不同（$${u}$ 和 $${v}$）`}，所以最大公因数就是 $${a}$ 与 $${b}$ 的最大公因数：$${g}$。`,
          ),
        });
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Equivalent expressions

export const simplifyingLinearExpressions = topic(
  "simplifying-linear-expressions",
  t("Simplifying Linear Expressions", "化简一次式"),
  t(
    "To simplify an expression, combine like terms by adding or subtracting their coefficients: 7x + 5 − 3x + 2 = (7 − 3)x + (5 + 2) = 4x + 7. Unlike terms such as 4x and 7 cannot be combined.",
    "化简代数式时，把同类项的系数相加减来合并同类项：7x + 5 − 3x + 2 = (7 − 3)x + (5 + 2) = 4x + 7。像 4x 和 7 这样的非同类项不能合并。",
  ),
  ["identifying-like-terms-in-linear-expressions"],
  ["6.EE.A.3", "6.EE.A.4"],
  [
    {
      id: "combining-like-terms-in-one-variable",
      title: t("One variable", "含一个变量"),
      explanation: t(
        "$6m + 4 + m - 1$: the $m$-terms give $6m + m = 7m$ and the constants give $4 - 1 = 3$, so the expression is $7m + 3$.",
        "$6m + 4 + m - 1$：$m$ 的项合并为 $6m + m = 7m$，常数合并为 $4 - 1 = 3$，所以结果是 $7m + 3$。",
      ),
      generate(rng) {
        const v = pickVar(rng);
        const a = rng.int(2, 9);
        const c = rng.nonZero(-(a - 1), 9);
        const b = rng.int(1, 12);
        const d = rng.nonZero(-(b - 1) || -1, 12);
        if (b + d <= 0) return this.generate(rng);
        const e = poly([a, v], [b, ""], [c, v], [d, ""]);
        const x = a + c;
        const k = b + d;
        const answer = poly([x, v], [k, ""]);
        return expressionProblem({
          prompt: t(`Simplify $${e}$.`, `化简 $${e}$。`),
          answer,
          simplified: true,
          wrong: [`${x + k}${v}`, poly([a + Math.abs(c), v], [b + Math.abs(d), ""]), `${a + b + c + d}`],
          solution: t(
            `Combine the $${v}$-terms and the constants: $${poly([a, v], [c, v])} = ${poly([x, v])}$ and $${poly([b, ""], [d, ""])} = ${k}$. So $${e} = ${answer}$.`,
            `合并 $${v}$ 的项和常数项：$${poly([a, v], [c, v])} = ${poly([x, v])}$，$${poly([b, ""], [d, ""])} = ${k}$。所以 $${e} = ${answer}$。`,
          ),
        });
      },
    },
    {
      id: "combining-like-terms-in-two-variables",
      title: t("Two variables", "含两个变量"),
      explanation: t(
        "$5a + 2b - 3a + 4b = (5 - 3)a + (2 + 4)b = 2a + 6b$. The result has two terms because $a$ and $b$ are not like terms.",
        "$5a + 2b - 3a + 4b = (5 - 3)a + (2 + 4)b = 2a + 6b$。$a$ 和 $b$ 不是同类项，所以结果有两项。",
      ),
      generate(rng) {
        const [u, v] = twoVars(rng);
        const a = rng.int(2, 9);
        const c = rng.nonZero(-(a - 1), 9);
        const b = rng.int(1, 9);
        const d = rng.nonZero(-9, 9);
        if (b + d === 0) return this.generate(rng);
        const terms = rng.bool()
          ? ([
              [a, u],
              [b, v],
              [c, u],
              [d, v],
            ] as const)
          : ([
              [a, u],
              [b, v],
              [d, v],
              [c, u],
            ] as const);
        const e = poly(...terms);
        const answer = poly([a + c, u], [b + d, v]);
        return expressionProblem({
          prompt: t(`Simplify $${e}$.`, `化简 $${e}$。`),
          answer,
          simplified: true,
          wrong: [`${a + b + c + d}${u}${v}`, poly([a + c, u], [b - d, v]), `${a + c + b + d}${u}`],
          solution: t(
            `$${u}$-terms: $${poly([a, u], [c, u])} = ${poly([a + c, u])}$; $${v}$-terms: $${poly([b, v], [d, v])} = ${poly([b + d, v])}$. So the expression is $${answer}$.`,
            `$${u}$ 的项：$${poly([a, u], [c, u])} = ${poly([a + c, u])}$；$${v}$ 的项：$${poly([b, v], [d, v])} = ${poly([b + d, v])}$。所以结果是 $${answer}$。`,
          ),
        });
      },
    },
  ],
);

export const applyingTheDistributiveLawToLinearExpressions = topic(
  "applying-the-distributive-law-to-linear-expressions",
  t("Applying the Distributive Law to Linear Expressions", "对一次式运用乘法分配律"),
  t(
    "The distributive law says a(b + c) = ab + ac: the number outside the parentheses multiplies every term inside. So 3(2x + 5) = 6x + 15, not 6x + 5, and 4(x − 2) = 4x − 8.",
    "乘法分配律：a(b + c) = ab + ac，括号外的数要乘括号内的每一项。所以 3(2x + 5) = 6x + 15，而不是 6x + 5；4(x − 2) = 4x − 8。",
  ),
  ["simplifying-linear-expressions"],
  ["6.EE.A.3"],
  [
    {
      id: "expanding-parentheses",
      title: t("Expanding parentheses", "去括号"),
      explanation: t(
        "$5(3n - 2) = 5 \\cdot 3n - 5 \\cdot 2 = 15n - 10$. Multiply both terms, and keep the minus sign.",
        "$5(3n - 2) = 5 \\cdot 3n - 5 \\cdot 2 = 15n - 10$。两项都要乘，并保留减号。",
      ),
      generate(rng) {
        const v = pickVar(rng);
        const a = rng.int(2, 9);
        const b = rng.int(1, 6);
        const c = rng.nonZero(-9, 9);
        const constFirst = rng.bool(0.25);
        const inner = constFirst && c > 0 ? poly([c, ""], [b, v]) : poly([b, v], [c, ""]);
        const answer = poly([a * b, v], [a * c, ""]);
        return expressionProblem({
          prompt: t(`Use the distributive law to expand $${a}(${inner})$.`, `用乘法分配律展开 $${a}(${inner})$。`),
          answer,
          simplified: true,
          wrong: [poly([a * b, v], [c, ""]), poly([b, v], [a * c, ""]), poly([a + b, v], [a * c, ""])],
          solution: t(
            `Multiply each term by $${a}$: $${a} \\cdot ${poly([b, v])} ${c < 0 ? "-" : "+"} ${a} \\cdot ${Math.abs(c)} = ${answer}$.`,
            `用 $${a}$ 乘每一项：$${a} \\cdot ${poly([b, v])} ${c < 0 ? "-" : "+"} ${a} \\cdot ${Math.abs(c)} = ${answer}$。`,
          ),
        });
      },
    },
    {
      id: "expanding-and-combining",
      title: t("Expanding, then combining", "去括号后合并"),
      explanation: t(
        "$2(x + 3) + 4x = 2x + 6 + 4x = 6x + 6$. Expand first, then combine like terms.",
        "$2(x + 3) + 4x = 2x + 6 + 4x = 6x + 6$。先去括号，再合并同类项。",
      ),
      generate(rng) {
        const v = pickVar(rng);
        const a = rng.int(2, 6);
        const c = rng.int(1, 9);
        const d = rng.int(2, 9);
        const constant = rng.bool(0.4);
        const e = constant ? `${a}(${v} + ${c}) + ${d}` : `${a}(${v} + ${c}) + ${d}${v}`;
        const answer = constant ? poly([a, v], [a * c + d, ""]) : poly([a + d, v], [a * c, ""]);
        const expanded = constant ? `${a}${v} + ${a * c} + ${d}` : `${a}${v} + ${a * c} + ${d}${v}`;
        return expressionProblem({
          prompt: t(`Simplify $${e}$.`, `化简 $${e}$。`),
          answer,
          simplified: true,
          wrong: constant
            ? [poly([a, v], [c + d, ""]), poly([a, v], [a * (c + d), ""])]
            : [poly([a + d, v], [c, ""]), poly([a * (1 + d), v], [a * c, ""])],
          solution: t(
            `Distribute $${a}$ over the parentheses, then combine like terms:${steps(`${e} = ${expanded}`, `= ${answer}`)}`,
            `先用 $${a}$ 乘括号内的每一项，再合并同类项：${steps(`${e} = ${expanded}`, `= ${answer}`)}`,
          ),
        });
      },
    },
  ],
);

export const factoringLinearExpressions = topic(
  "factoring-linear-expressions",
  t("Factoring Linear Expressions", "一次式的因式分解"),
  t(
    "Factoring undoes the distributive law. Find the greatest common factor of the terms and write it outside the parentheses: 12x + 18 = 6(2x + 3). Check by expanding: 6 · 2x + 6 · 3 = 12x + 18. Factoring out a smaller common factor, as in 2(6x + 9), is not complete.",
    "因式分解是乘法分配律的逆运算。求出各项的最大公因数，写在括号外：12x + 18 = 6(2x + 3)。展开检验：6 · 2x + 6 · 3 = 12x + 18。只提出较小的公因数（如 2(6x + 9)）不算分解完全。",
  ),
  ["the-greatest-common-factor-of-two-linear-expressions", "applying-the-distributive-law-to-linear-expressions"],
  ["6.EE.A.3", "6.NS.B.4"],
  [
    {
      id: "factoring-out-the-gcf",
      title: t("Factoring out the GCF", "提取最大公因数"),
      explanation: t(
        "$15n - 10$: the GCF of $15$ and $10$ is $5$, so $15n - 10 = 5(3n - 2)$.",
        "$15n - 10$：$15$ 与 $10$ 的最大公因数是 $5$，所以 $15n - 10 = 5(3n - 2)$。",
      ),
      generate(rng) {
        const v = pickVar(rng);
        const g = rng.int(2, 9);
        let p: number;
        let q: number;
        do {
          p = rng.int(1, 9);
          q = rng.nonZero(-9, 9);
        } while (gcd(p, Math.abs(q)) !== 1);
        const e = poly([g * p, v], [g * q, ""]);
        const inner = poly([p, v], [q, ""]);
        const small = [2, 3, 5].find((s) => g % s === 0 && s < g);
        return factoredProblem({
          prompt: t(`Factor $${e}$ completely.`, `把 $${e}$ 因式分解完全。`),
          answer: `${g}(${inner})`,
          wrong: [
            `${g}(${poly([p, v], [g * q, ""])})`,
            ...(small ? [`${small}(${poly([(g / small) * p, v], [(g / small) * q, ""])})`] : []),
          ],
          solution: t(
            `The GCF of $${g * p}$ and $${Math.abs(g * q)}$ is $${g}$: $${e} = ${g} \\cdot ${poly([p, v])} ${q < 0 ? "-" : "+"} ${g} \\cdot ${Math.abs(q)} = ${g}(${inner})$.`,
            `$${g * p}$ 与 $${Math.abs(g * q)}$ 的最大公因数是 $${g}$：$${e} = ${g} \\cdot ${poly([p, v])} ${q < 0 ? "-" : "+"} ${g} \\cdot ${Math.abs(q)} = ${g}(${inner})$。`,
          ),
        });
      },
    },
    {
      id: "factoring-two-variable-expressions",
      title: t("Two variables", "含两个变量"),
      explanation: t(
        "$8a + 12b + 4$: the GCF of $8$, $12$ and $4$ is $4$, so $8a + 12b + 4 = 4(2a + 3b + 1)$.",
        "$8a + 12b + 4$：$8$、$12$、$4$ 的最大公因数是 $4$，所以 $8a + 12b + 4 = 4(2a + 3b + 1)$。",
      ),
      generate(rng) {
        const [u, v] = twoVars(rng);
        const g = rng.int(2, 9);
        const p = rng.int(1, 9);
        const q = rng.int(1, 9);
        const r = rng.bool() ? 0 : rng.int(1, 9);
        if (gcd(gcd(p, q), r) !== 1 || (p === 1 && q === 1)) return this.generate(rng);
        const terms: Term[] = [
          [p, u],
          [q, v],
          [r, ""],
        ];
        const e = poly(...terms.map(([c, x]) => [g * c, x] as const));
        const inner = poly(...terms);
        return factoredProblem({
          prompt: t(`Factor $${e}$ completely.`, `把 $${e}$ 因式分解完全。`),
          answer: `${g}(${inner})`,
          wrong: [
            `${g}(${poly([p, u], [g * q, v], [g * r, ""])})`,
            ...[2, 3]
              .filter((k) => g % k === 0 && k < g)
              .map((k) => `${k}(${poly([(g / k) * p, u], [(g / k) * q, v], [(g / k) * r, ""])})`),
          ],
          solution: t(
            `Every coefficient is a multiple of $${g}$, and $${g}$ is their GCF. Divide each term by $${g}$: $${e} = ${g}(${inner})$.`,
            `每个系数都是 $${g}$ 的倍数，$${g}$ 是它们的最大公因数。每项除以 $${g}$：$${e} = ${g}(${inner})$。`,
          ),
        });
      },
    },
  ],
);

export const identifyingEquivalentExpressions = topic(
  "identifying-equivalent-expressions",
  t("Identifying Equivalent Expressions", "识别等价的代数式"),
  t(
    "Two expressions are equivalent when they have the same value for every value of the variable. To decide, simplify both: 3(x + 2) + x and 4x + 6 are equivalent because 3(x + 2) + x = 3x + 6 + x = 4x + 6. One value that gives different results shows that two expressions are not equivalent.",
    "如果两个代数式对变量的每个值都相等，它们就是等价的。判断时把两个都化简：3(x + 2) + x 与 4x + 6 等价，因为 3(x + 2) + x = 3x + 6 + x = 4x + 6。只要有一个值使结果不同，两个代数式就不等价。",
  ),
  ["factoring-linear-expressions"],
  ["6.EE.A.4"],
  [
    {
      id: "choosing-an-equivalent-expression",
      title: t("Choosing an equivalent expression", "选出等价的代数式"),
      explanation: t(
        "$4(2m + 3) = 8m + 12$, which can also be written $12 + 8m$ or $2(4m + 6)$. $8m + 3$ is not equivalent: the $3$ was not multiplied.",
        "$4(2m + 3) = 8m + 12$，也可以写成 $12 + 8m$ 或 $2(4m + 6)$。$8m + 3$ 不等价：$3$ 没有乘 $4$。",
      ),
      generate(rng) {
        const v = pickVar(rng);
        const a = rng.int(2, 6);
        const b = rng.int(1, 5);
        const c = rng.int(1, 9);
        const given = `${a}(${poly([b, v])} + ${c})`;
        const correct = rng.pick([`${a * c} + ${poly([a * b, v])}`, `${poly([a * b, v])} + ${a * c}`]);
        return pickChoice(
          rng,
          t(`Which expression is equivalent to $${given}$?`, `哪个代数式与 $${given}$ 等价？`),
          mathText(correct),
          [
            mathText(`${poly([a * b, v])} + ${c}`),
            mathText(`${poly([b, v])} + ${a * c}`),
            mathText(`${poly([a + b, v])} + ${a * c}`),
            mathText(`${a * b + a * c}${v}`),
          ],
          t(
            `Distribute: $${given} = ${poly([a * b, v])} + ${a * c}$, which is the same as $${correct}$.`,
            `用分配律：$${given} = ${poly([a * b, v])} + ${a * c}$，与 $${correct}$ 相同。`,
          ),
        );
      },
    },
    {
      id: "deciding-whether-expressions-are-equivalent",
      title: t("Are they equivalent?", "它们等价吗？"),
      explanation: t(
        "Is $2(x + 5) + 3x$ equivalent to $5x + 5$? Simplify: $2x + 10 + 3x = 5x + 10$, which is not $5x + 5$. Check with $x = 0$: $10 \\ne 5$.",
        "$2(x + 5) + 3x$ 与 $5x + 5$ 等价吗？化简：$2x + 10 + 3x = 5x + 10$，不是 $5x + 5$。用 $x = 0$ 检验：$10 \\ne 5$。",
      ),
      generate(rng) {
        const v = pickVar(rng);
        const a = rng.int(2, 6);
        const c = rng.int(1, 9);
        const d = rng.int(2, 9);
        const left = `${a}(${v} + ${c}) + ${d}${v}`;
        const simplified = poly([a + d, v], [a * c, ""]);
        const same = rng.bool();
        const slips = [poly([a + d, v], [c, ""]), poly([a * d, v], [a * c, ""]), poly([a + d, v], [a + c, ""])].filter(
          (s) => s !== simplified,
        );
        const right = same ? rng.pick([simplified, `${a * c} + ${poly([a + d, v])}`]) : rng.pick(slips);
        return choiceProblem({
          prompt: t(`Are $${left}$ and $${right}$ equivalent expressions?`, `$${left}$ 与 $${right}$ 是等价的代数式吗？`),
          options: yesNo,
          correct: same ? 0 : 1,
          solution: t(
            `Simplify the first expression: $${left} = ${a}${v} + ${a * c} + ${d}${v} = ${simplified}$. ${same ? `This is the same as $${right}$, so they are equivalent.` : `This is not the same as $${right}$, so they are not equivalent.`}`,
            `化简第一个代数式：$${left} = ${a}${v} + ${a * c} + ${d}${v} = ${simplified}$。${same ? `这与 $${right}$ 相同，所以它们等价。` : `这与 $${right}$ 不同，所以它们不等价。`}`,
          ),
        });
      },
    },
  ],
);

/** grade6ExpressionTopics lists the 6th grade topics on algebraic expressions and equivalent expressions. */
export const grade6ExpressionTopics: readonly TopicDef[] = [
  introductionToAlgebraicExpressions,
  constructingAlgebraicExpressions,
  evaluatingLinearExpressions,
  evaluatingAlgebraicExpressions,
  identifyingTermsInLinearExpressions,
  identifyingCoefficientsAndConstants,
  identifyingLikeTermsInLinearExpressions,
  theGreatestCommonFactorOfTwoLinearExpressions,
  simplifyingLinearExpressions,
  applyingTheDistributiveLawToLinearExpressions,
  factoringLinearExpressions,
  identifyingEquivalentExpressions,
];
