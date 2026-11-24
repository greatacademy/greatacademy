import type { KnowledgePointDef, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, poly, Q } from "@ga/subject-math";
import { gradeDrawings4 } from "../explanation-drawings-grades-4.ts";

import type { Pair, Walk, Wrong } from "./early-grades-more-kit.ts";
import { chosen, chosenMath, decided, drawn, expressed, factored, lesson, type Off, type Said, valued, withIntro } from "./grade-6-kit.ts";
import { areaGridFigure, lineFigure, tapeFigure } from "./upper-grades-kit.ts";

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

/** evaluateTerms evaluates terms of a linear expression at values of its letters, a constant having the letter "". */
const evaluateTerms = (terms: readonly Term[], at: Readonly<Record<string, number>>) =>
  terms.reduce((s, [c, v]) => s + c * (v === "" ? 1 : (at[v] ?? 0)), 0);

// ---------------------------------------------------------------------------
// Algebraic expressions

/** Phrase is a way to say a one-operation expression in words, with the step that writes it, a value to try, and the usual misreadings. */
interface Phrase {
  readonly words: Pair;
  readonly latex: string;
  /** how says which operation the words describe. */
  readonly how: Pair;
  /** reads says what the expression does, for reading it back in words. */
  readonly reads: Pair;
  /** x is a value of the letter to try, and sub the expression with it put in, worth value. */
  readonly x: number;
  readonly sub: string;
  readonly value: number;
  /** wrong are expressions that misreading the words gives. */
  readonly wrong: readonly Said[];
  /** misread are wrong phrases for the same numbers, used when the expression is given and the words are asked for. */
  readonly misread: readonly Wrong[];
}

/** phrases builds the one-operation phrases for a variable v and a number a. */
function phrases(v: string, a: number): Phrase[] {
  return [
    {
      words: [`$${a}$ more than $${v}$`, `比 $${v}$ 多 $${a}$`],
      latex: `${v} + ${a}`,
      how: ["“More than” means add, starting from the letter.", "“多”就是加，从字母开始加。"],
      reads: [`$${v} + ${a}$ adds $${a}$ to $${v}$.`, `$${v} + ${a}$ 是在 $${v}$ 上加 $${a}$。`],
      x: 10,
      sub: `10 + ${a}`,
      value: 10 + a,
      wrong: [
        [`${a}${v}`, `That multiplies $${v}$ by $${a}$. “More than” adds.`, `这是把 $${v}$ 乘 $${a}$。“多”要用加法。`],
        [`${v} - ${a}`, `That is $${a}$ less than $${v}$. “More than” adds.`, `这是比 $${v}$ 少 $${a}$。“多”要用加法。`],
      ],
      misread: [
        [
          [`$${a}$ less than $${v}$`, `比 $${v}$ 少 $${a}$`],
          `That would be $${v} - ${a}$, which takes away.`,
          `那是 $${v} - ${a}$，是减法。`,
        ],
        [
          [`the product of $${a}$ and $${v}$`, `$${a}$ 与 $${v}$ 的积`],
          `That would be $${a}${v}$, which multiplies.`,
          `那是 $${a}${v}$，是乘法。`,
        ],
      ],
    },
    {
      words: [`$${a}$ less than $${v}$`, `比 $${v}$ 少 $${a}$`],
      latex: `${v} - ${a}`,
      how: [`“Less than” takes away. Start from $${v}$ and take $${a}$ away.`, `“少”是减法。从 $${v}$ 开始，减去 $${a}$。`],
      reads: [`$${v} - ${a}$ starts from $${v}$ and takes $${a}$ away.`, `$${v} - ${a}$ 是从 $${v}$ 中减去 $${a}$。`],
      x: a + 10,
      sub: `${a + 10} - ${a}`,
      value: 10,
      wrong: [
        [
          `${a} - ${v}`,
          `That starts from $${a}$. “$${a}$ less than $${v}$” starts from $${v}$ and takes $${a}$ away.`,
          `这是从 $${a}$ 开始减。“比 $${v}$ 少 $${a}$”要从 $${v}$ 中减去 $${a}$。`,
        ],
        [`${v} + ${a}`, "That adds. “Less than” takes away.", "这是加法。“少”要用减法。"],
      ],
      misread: [
        [
          [`$${v}$ less than $${a}$`, `比 $${a}$ 少 $${v}$`],
          `That would be $${a} - ${v}$, which starts from $${a}$.`,
          `那是 $${a} - ${v}$，是从 $${a}$ 开始减。`,
        ],
        [[`$${a}$ more than $${v}$`, `比 $${v}$ 多 $${a}$`], `That would be $${v} + ${a}$, which adds.`, `那是 $${v} + ${a}$，是加法。`],
      ],
    },
    {
      words: [`$${v}$ decreased by $${a}$`, `$${v}$ 减少 $${a}$`],
      latex: `${v} - ${a}`,
      how: [`“Decreased by” makes $${v}$ smaller, so take $${a}$ away from it.`, `“减少”是让 $${v}$ 变小，所以从中减去 $${a}$。`],
      reads: [`$${v} - ${a}$ makes $${v}$ smaller by $${a}$.`, `$${v} - ${a}$ 是让 $${v}$ 减少 $${a}$。`],
      x: a + 10,
      sub: `${a + 10} - ${a}`,
      value: 10,
      wrong: [
        [`${a} - ${v}`, `That decreases $${a}$ by $${v}$. Start from $${v}$.`, `这是 $${a}$ 减少 $${v}$。要从 $${v}$ 开始。`],
        [`${v} + ${a}`, "“Decreased” means made smaller, so subtract.", "“减少”是变小，要用减法。"],
      ],
      misread: [
        [
          [`$${a}$ decreased by $${v}$`, `$${a}$ 减少 $${v}$`],
          `That would be $${a} - ${v}$, which starts from $${a}$.`,
          `那是 $${a} - ${v}$，是从 $${a}$ 开始减。`,
        ],
        [
          [`$${v}$ increased by $${a}$`, `$${v}$ 增加 $${a}$`],
          `That would be $${v} + ${a}$, which makes $${v}$ larger.`,
          `那是 $${v} + ${a}$，让 $${v}$ 变大。`,
        ],
      ],
    },
    {
      words: [`the product of $${a}$ and $${v}$`, `$${a}$ 与 $${v}$ 的积`],
      latex: `${a}${v}`,
      how: [
        `A product multiplies. A number written next to a letter means times: $${a} \\times ${v} = ${a}${v}$.`,
        `积是乘法。数写在字母前面就表示相乘：$${a} \\times ${v} = ${a}${v}$。`,
      ],
      reads: [`$${a}${v}$ means $${a} \\times ${v}$, a product.`, `$${a}${v}$ 表示 $${a} \\times ${v}$，是积。`],
      x: 10,
      sub: `${a} \\times 10`,
      value: 10 * a,
      wrong: [
        [`${v} + ${a}`, "That adds. A product multiplies.", "这是加法。积要用乘法。"],
        [`\\frac{${v}}{${a}}`, "That divides. A product multiplies.", "这是除法。积要用乘法。"],
      ],
      misread: [
        [
          [`the sum of $${a}$ and $${v}$`, `$${a}$ 与 $${v}$ 的和`],
          `A sum adds: that would be $${a} + ${v}$.`,
          `和是加法：那是 $${a} + ${v}$。`,
        ],
        [
          [`$${v}$ divided by $${a}$`, `$${v}$ 除以 $${a}$`],
          `That would be $\\frac{${v}}{${a}}$, which divides.`,
          `那是 $\\frac{${v}}{${a}}$，是除法。`,
        ],
      ],
    },
    {
      words: [`$${v}$ divided by $${a}$`, `$${v}$ 除以 $${a}$`],
      latex: `\\frac{${v}}{${a}}`,
      how: [`Divide $${v}$ by $${a}$. The number being divided, $${v}$, goes on top.`, `用 $${v}$ 除以 $${a}$。被除数 $${v}$ 写在上面。`],
      reads: [`$\\frac{${v}}{${a}}$ shares $${v}$ into $${a}$ equal parts.`, `$\\frac{${v}}{${a}}$ 是把 $${v}$ 平均分成 $${a}$ 份。`],
      x: 10 * a,
      sub: `${10 * a} \\div ${a}`,
      value: 10,
      wrong: [
        [
          `\\frac{${a}}{${v}}`,
          `That divides $${a}$ by $${v}$. The number being divided, $${v}$, goes on top.`,
          `这是 $${a}$ 除以 $${v}$。被除数 $${v}$ 应写在上面。`,
        ],
        [`${a}${v}`, "That multiplies. “Divided by” divides.", "这是乘法。“除以”要用除法。"],
      ],
      misread: [
        [
          [`$${a}$ divided by $${v}$`, `$${a}$ 除以 $${v}$`],
          `That would be $\\frac{${a}}{${v}}$, with $${a}$ on top.`,
          `那是 $\\frac{${a}}{${v}}$，$${a}$ 在上面。`,
        ],
        [
          [`the product of $${a}$ and $${v}$`, `$${a}$ 与 $${v}$ 的积`],
          `That would be $${a}${v}$, which multiplies.`,
          `那是 $${a}${v}$，是乘法。`,
        ],
      ],
    },
    {
      words: [`the quotient of $${v}$ and $${a}$`, `$${v}$ 与 $${a}$ 的商`],
      latex: `\\frac{${v}}{${a}}`,
      how: [
        `A quotient divides the first number named by the second: $${v}$ by $${a}$.`,
        `商是用前面说的数除以后面说的数：$${v}$ 除以 $${a}$。`,
      ],
      reads: [`$\\frac{${v}}{${a}}$ divides $${v}$ by $${a}$, a quotient.`, `$\\frac{${v}}{${a}}$ 是 $${v}$ 除以 $${a}$，是商。`],
      x: 10 * a,
      sub: `${10 * a} \\div ${a}`,
      value: 10,
      wrong: [
        [
          `\\frac{${a}}{${v}}`,
          `The quotient of $${v}$ and $${a}$ divides $${v}$ by $${a}$, so $${v}$ goes on top.`,
          `$${v}$ 与 $${a}$ 的商是 $${v}$ 除以 $${a}$，$${v}$ 写在上面。`,
        ],
        [`${v} - ${a}`, "That subtracts. A quotient divides.", "这是减法。商要用除法。"],
      ],
      misread: [
        [
          [`the quotient of $${a}$ and $${v}$`, `$${a}$ 与 $${v}$ 的商`],
          `That would be $\\frac{${a}}{${v}}$, with $${a}$ on top.`,
          `那是 $\\frac{${a}}{${v}}$，$${a}$ 在上面。`,
        ],
        [
          [`the difference of $${v}$ and $${a}$`, `$${v}$ 与 $${a}$ 的差`],
          `A difference subtracts: that would be $${v} - ${a}$.`,
          `差是减法：那是 $${v} - ${a}$。`,
        ],
      ],
    },
    {
      words: [`the sum of $${v}$ and $${a}$`, `$${v}$ 与 $${a}$ 的和`],
      latex: `${v} + ${a}`,
      how: ["A sum adds the two numbers.", "和就是把两个数相加。"],
      reads: [`$${v} + ${a}$ adds $${v}$ and $${a}$, a sum.`, `$${v} + ${a}$ 是 $${v}$ 与 $${a}$ 相加，是和。`],
      x: 10,
      sub: `10 + ${a}`,
      value: 10 + a,
      wrong: [
        [`${a}${v}`, "That multiplies. A sum adds.", "这是乘法。和要用加法。"],
        [`${v} - ${a}`, "That subtracts. A sum adds.", "这是减法。和要用加法。"],
      ],
      misread: [
        [
          [`the product of $${v}$ and $${a}$`, `$${v}$ 与 $${a}$ 的积`],
          `A product multiplies: that would be $${a}${v}$.`,
          `积是乘法：那是 $${a}${v}$。`,
        ],
        [
          [`the difference of $${v}$ and $${a}$`, `$${v}$ 与 $${a}$ 的差`],
          `A difference subtracts: that would be $${v} - ${a}$.`,
          `差是减法：那是 $${v} - ${a}$。`,
        ],
      ],
    },
  ];
}

/** tried checks a phrase by putting a value in for the letter. */
const tried = (v: string, p: Phrase): Pair => [
  `Try $${v} = ${p.x}$: ${p.words[0]} is $${p.value}$, and $${p.sub} = ${p.value}$.`,
  `取 $${v} = ${p.x}$：${p.words[1]}是 $${p.value}$，而 $${p.sub} = ${p.value}$。`,
];

export const introductionToAlgebraicExpressions = withIntro(
  topic(
    "introduction-to-algebraic-expressions",
    t("Introduction to Algebraic Expressions", "代数式入门"),
    t(
      "A variable is a letter that stands for a number, and an algebraic expression combines numbers and variables with operations. “5 more than n” is n + 5, “5 less than n” is n − 5 (not 5 − n), “the product of 5 and n” is 5n, and “n divided by 5” is n/5.",
      "变量是代表数的字母，代数式用运算把数和变量连接起来。“比 n 多 5”是 n + 5，“比 n 少 5”是 n − 5（不是 5 − n），“5 与 n 的积”是 5n，“n 除以 5”是 n/5。",
    ),
    ["creating-whole-number-expressions-from-terminology"],
    ["6.EE.A.2a"],
    [
      lesson(
        "writing-expressions-from-words",
        ["From words to expressions", "把文字写成代数式"],
        [
          [
            "A letter such as $n$ stands for a number we do not know yet. “$5$ more than $n$” adds: $n + 5$. “$3$ less than $n$” starts with $n$ and takes $3$ away: $n - 3$. A number written next to a letter multiplies it, so “the product of $4$ and $n$” is $4n$, and “$n$ divided by $6$” is $\\frac{n}{6}$.",
            "像 $n$ 这样的字母代表一个还不知道的数。“比 $n$ 多 $5$”是加法：$n + 5$。“比 $n$ 少 $3$”是从 $n$ 中减去 $3$：$n - 3$。数紧挨着字母写表示相乘，所以“$4$ 与 $n$ 的积”是 $4n$，“$n$ 除以 $6$”是 $\\frac{n}{6}$。",
          ],
          ["Try $n = 10$: $3$ less than $10$ is $7$, and $10 - 3 = 7$.", "取 $n = 10$：比 $10$ 少 $3$ 是 $7$，而 $10 - 3 = 7$。"],
          [
            "“$3$ less than $n$” is $n - 3$, not $3 - n$. The words say $3$ first, but $3$ is the part taken away.",
            "“比 $n$ 少 $3$”是 $n - 3$，不是 $3 - n$。虽然先说到 $3$，但 $3$ 是被减去的部分。",
          ],
        ],
        (rng) => {
          const v = pickVar(rng);
          const a = rng.int(2, 15);
          const p = rng.pick(phrases(v, a));
          return expressed(
            [`Write an expression for ${p.words[0]}.`, `用代数式表示“${p.words[1]}”。`],
            p.latex,
            [
              [["Find the operation", "找出运算"], p.how],
              [
                ["Write the expression", "写出代数式"],
                ["Put the letter and the number in that order:", "按这个顺序写出字母和数："],
                [p.latex],
              ],
            ],
            tried(v, p),
            p.wrong,
          );
        },
        tapeFigure(
          [
            {
              total: "n + 5",
              pieces: [
                { size: 4, text: "n" },
                { size: 2, text: "5", lit: true },
              ],
            },
            {
              total: "n",
              pieces: [
                { size: 3, text: "n − 3" },
                { size: 1, text: "3", dashed: true },
              ],
            },
          ],
          [
            "Two bars. The first is n with a piece of 5 joined on: n + 5. The second is n with a piece of 3 cut off, leaving n − 3.",
            "两个长条。第一个是 n 再接上 5：n + 5。第二个是 n 去掉 3，剩下 n − 3。",
          ],
        ),
      ),
      lesson(
        "reading-expressions-in-words",
        ["From expressions to words", "用文字描述代数式"],
        [
          [
            "To read an expression, name its operation and keep the order. $n + 5$ is “$5$ more than $n$” or “the sum of $n$ and $5$”. $\\frac{n}{6}$ is “$n$ divided by $6$” or “the quotient of $n$ and $6$”: $n$ is shared into $6$ equal parts.",
            "读代数式时，说出它的运算，并保持顺序。$n + 5$ 读作“比 $n$ 多 $5$”或“$n$ 与 $5$ 的和”。$\\frac{n}{6}$ 读作“$n$ 除以 $6$”或“$n$ 与 $6$ 的商”：把 $n$ 平均分成 $6$ 份。",
          ],
          [
            "With $n = 18$: $\\frac{18}{6} = 3$, which is one of the $6$ equal parts of $18$.",
            "当 $n = 18$ 时：$\\frac{18}{6} = 3$，正是 $18$ 平均分成 $6$ 份后的一份。",
          ],
          [
            "$\\frac{n}{6}$ is not “$6$ divided by $n$”. The number on top is the one being divided.",
            "$\\frac{n}{6}$ 不是“$6$ 除以 $n$”。写在上面的数是被除数。",
          ],
        ],
        (rng) => {
          const v = pickVar(rng);
          const a = rng.int(2, 15);
          const p = rng.pick(phrases(v, a));
          return chosen(
            rng,
            [`Which phrase describes $${p.latex}$?`, `哪个说法描述的是 $${p.latex}$？`],
            p.words,
            p.misread,
            [
              [["Read the operation", "看运算"], p.reads],
              [
                ["Say it in words", "用文字说"],
                [`So $${p.latex}$ is ${p.words[0]}.`, `所以 $${p.latex}$ 是“${p.words[1]}”。`],
              ],
            ],
            tried(v, p),
          );
        },
        tapeFigure(
          [{ total: "n", pieces: Array.from({ length: 6 }, (_, i) => ({ size: 1, text: "n/6", lit: i === 0 })) }],
          ["A bar n shared into 6 equal parts; one part, n/6, is shaded.", "长条 n 平均分成 6 份，涂色的一份是 n/6。"],
        ),
      ),
    ],
  ),
  [
    "Lena keeps her stickers in a closed box, so we do not know how many there are. We call the number $n$. Her friend gives her $5$ more, and now she has $n + 5$ stickers.",
    "Lena 把贴纸放在一个关着的盒子里，我们不知道有多少张，就把这个数叫做 $n$。朋友又给了她 $5$ 张，现在她有 $n + 5$ 张。",
  ],
  ["If the box holds $8$ stickers, she now has $8 + 5 = 13$.", "如果盒子里有 $8$ 张，她现在有 $8 + 5 = 13$ 张。"],
  [
    "write words as expressions, with a letter for the unknown number, and read expressions back in words.",
    "用字母表示不知道的数，把文字写成代数式，也把代数式读成文字。",
  ],
);

/** Story is a real-world quantity described by an expression in one variable, with its worked steps, a check and the usual wrong expressions. */
interface Story {
  readonly prompt: Pair;
  readonly latex: string;
  readonly walk: readonly Walk[];
  readonly check: Pair;
  readonly wrong: readonly Said[];
}

/** oneStepStories builds stories whose expressions use one operation. */
function oneStepStories(v: string, a: number): Story[] {
  return [
    {
      prompt: [
        `Maya has $${v}$ marbles. Jon has $${a}$ more marbles than Maya. Write an expression for the number of marbles Jon has.`,
        `Maya 有 $${v}$ 颗弹珠，Jon 比 Maya 多 $${a}$ 颗。用代数式表示 Jon 的弹珠数。`,
      ],
      latex: `${v} + ${a}`,
      walk: [
        [
          ["Find the operation", "找出运算"],
          [`Jon has as many as Maya and $${a}$ more, so add.`, `Jon 和 Maya 一样多，再多 $${a}$ 颗，所以用加法。`],
        ],
        [["Write the expression", "写出代数式"], [`Start from Maya's $${v}$:`, `从 Maya 的 $${v}$ 颗开始：`], [`${v} + ${a}`]],
      ],
      check: [
        `If Maya has $10$, Jon has $10 + ${a} = ${10 + a}$, which is $${a}$ more.`,
        `如果 Maya 有 $10$ 颗，Jon 有 $10 + ${a} = ${10 + a}$ 颗，正好多 $${a}$ 颗。`,
      ],
      wrong: [
        [
          `${a}${v}`,
          `That multiplies. Jon has only $${a}$ more, not $${a}$ times as many.`,
          `这是乘法。Jon 只是多 $${a}$ 颗，不是 $${a}$ 倍。`,
        ],
        [`${v} - ${a}`, `That gives Jon fewer marbles. He has $${a}$ more.`, `这样 Jon 反而少了。他是多 $${a}$ 颗。`],
      ],
    },
    {
      prompt: [
        `Sam had $${v}$ stickers and gave away $${a}$ of them. Write an expression for the number of stickers Sam has left.`,
        `Sam 有 $${v}$ 张贴纸，送出了 $${a}$ 张。用代数式表示 Sam 剩下的贴纸数。`,
      ],
      latex: `${v} - ${a}`,
      walk: [
        [
          ["Find the operation", "找出运算"],
          ["Giving away takes stickers from what Sam had, so subtract.", "送出是从原有的贴纸中拿走，所以用减法。"],
        ],
        [["Write the expression", "写出代数式"], [`Start from the $${v}$ Sam had:`, `从 Sam 原有的 $${v}$ 张开始：`], [`${v} - ${a}`]],
      ],
      check: [
        `If Sam had $${a + 10}$, he has $${a + 10} - ${a} = 10$ left, and $10 + ${a}$ gives back $${a + 10}$.`,
        `如果 Sam 有 $${a + 10}$ 张，剩下 $${a + 10} - ${a} = 10$ 张，而 $10 + ${a}$ 又回到 $${a + 10}$。`,
      ],
      wrong: [
        [
          `${a} - ${v}`,
          `That starts from the $${a}$ given away. Start from the $${v}$ Sam had.`,
          `这是从送出的 $${a}$ 张开始减。要从 Sam 原有的 $${v}$ 张开始。`,
        ],
        [`${v} + ${a}`, "That adds. Giving stickers away leaves fewer.", "这是加法。送出贴纸后会变少。"],
      ],
    },
    {
      prompt: [
        `Movie tickets cost $\\$${a}$ each. Write an expression for the cost, in dollars, of $${v}$ tickets.`,
        `电影票每张 $\\$${a}$。用代数式表示 $${v}$ 张票的总价（美元）。`,
      ],
      latex: `${a}${v}`,
      walk: [
        [
          ["Find the operation", "找出运算"],
          [
            `Each of the $${v}$ tickets costs $\\$${a}$: equal groups, so multiply.`,
            `$${v}$ 张票每张都是 $\\$${a}$：相同的组，所以用乘法。`,
          ],
        ],
        [
          ["Write the expression", "写出代数式"],
          [`Write the number before the letter:`, `把数写在字母前面：`],
          [`${a} \\times ${v} = ${a}${v}`],
        ],
      ],
      check: [
        `$3$ tickets cost $${a} + ${a} + ${a} = ${3 * a}$ dollars, and $${a} \\times 3 = ${3 * a}$.`,
        `$3$ 张票要 $${a} + ${a} + ${a} = ${3 * a}$ 美元，而 $${a} \\times 3 = ${3 * a}$。`,
      ],
      wrong: [
        [
          `${v} + ${a}`,
          `That adds one price to the number of tickets. Each ticket costs $\\$${a}$, so multiply.`,
          `这是把票价和张数相加。每张都要 $\\$${a}$，应该相乘。`,
        ],
        [`\\frac{${v}}{${a}}`, "That divides. Buying more tickets costs more, so multiply.", "这是除法。票买得越多花钱越多，应该相乘。"],
      ],
    },
    {
      prompt: [
        `A rope $${v}$ meters long is cut into $${a}$ equal pieces. Write an expression for the length of each piece, in meters.`,
        `一根长 $${v}$ 米的绳子被剪成 $${a}$ 段同样长的绳子。用代数式表示每段的长度（米）。`,
      ],
      latex: `\\frac{${v}}{${a}}`,
      walk: [
        [
          ["Find the operation", "找出运算"],
          [`The rope is shared into $${a}$ equal pieces, so divide.`, `绳子被平均分成 $${a}$ 段，所以用除法。`],
        ],
        [
          ["Write the expression", "写出代数式"],
          [`The length being shared, $${v}$, goes on top:`, `被分的长度 $${v}$ 写在上面：`],
          [`\\frac{${v}}{${a}}`],
        ],
      ],
      check: [
        `A rope of $${10 * a}$ meters gives pieces of $\\frac{${10 * a}}{${a}} = 10$ meters, and $${a}$ pieces of $10$ make $${10 * a}$.`,
        `长 $${10 * a}$ 米的绳子，每段 $\\frac{${10 * a}}{${a}} = 10$ 米，而 $${a}$ 段 $10$ 米合起来是 $${10 * a}$ 米。`,
      ],
      wrong: [
        [
          `\\frac{${a}}{${v}}`,
          `That divides $${a}$ by the length. The length $${v}$ is what is shared, so it goes on top.`,
          `这是 $${a}$ 除以长度。被分的是长度 $${v}$，它应写在上面。`,
        ],
        [`${v} - ${a}`, "That cuts off a piece. Sharing into equal pieces divides.", "这是剪掉一段。平均分成几段要用除法。"],
      ],
    },
  ];
}

/** twoStepStories builds stories and phrases whose expressions use two operations. */
function twoStepStories(v: string, a: number, b: number): Story[] {
  return [
    {
      prompt: [
        `Pencils cost $\\$${a}$ each and a notebook costs $\\$${b}$. Write an expression for the cost, in dollars, of $${v}$ pencils and one notebook.`,
        `铅笔每支 $\\$${a}$，笔记本每本 $\\$${b}$。用代数式表示买 $${v}$ 支铅笔和一本笔记本的总价（美元）。`,
      ],
      latex: `${a}${v} + ${b}`,
      walk: [
        [["Price the pencils", "算铅笔的钱"], [`$${v}$ pencils at $\\$${a}$ each cost`, `$${v}$ 支铅笔每支 $\\$${a}$，共`], [`${a}${v}`]],
        [["Add the notebook", "加上笔记本"], [`The notebook is bought once:`, `笔记本只买一本：`], [`${a}${v} + ${b}`]],
      ],
      check: [
        `For $2$ pencils: $${a} + ${a} + ${b} = ${2 * a + b}$, and $${a} \\times 2 + ${b} = ${2 * a + b}$.`,
        `买 $2$ 支铅笔：$${a} + ${a} + ${b} = ${2 * a + b}$，而 $${a} \\times 2 + ${b} = ${2 * a + b}$。`,
      ],
      wrong: [
        [
          `${a}(${v} + ${b})`,
          `That pays $\\$${a}$ for the notebook's $${b}$ too. Only the pencils cost $\\$${a}$ each.`,
          `这把笔记本的 $${b}$ 也乘了 $${a}$。只有铅笔是每支 $\\$${a}$。`,
        ],
        [
          `${a} + ${b}${v}`,
          `That swaps the prices: the notebook does not cost $\\$${b}$ for each pencil.`,
          `这把价格弄反了：笔记本不是每支铅笔收 $\\$${b}$。`,
        ],
        [
          `${a + b}${v}`,
          `That pays for a notebook with every pencil. There is only one notebook.`,
          `这相当于每支铅笔都配一本笔记本。笔记本只有一本。`,
        ],
      ],
    },
    {
      prompt: [
        `A taxi charges $\\$${b}$ to start a ride plus $\\$${a}$ for each mile. Write an expression for the cost, in dollars, of a ride of $${v}$ miles.`,
        `出租车起步价 $\\$${b}$，每英里另收 $\\$${a}$。用代数式表示行驶 $${v}$ 英里的车费（美元）。`,
      ],
      latex: `${b} + ${a}${v}`,
      walk: [
        [["Price the miles", "算里程的钱"], [`$${v}$ miles at $\\$${a}$ each cost`, `$${v}$ 英里每英里 $\\$${a}$，共`], [`${a}${v}`]],
        [["Add the start", "加上起步价"], [`The starting charge is paid once:`, `起步价只付一次：`], [`${b} + ${a}${v}`]],
      ],
      check: [
        `For a ride of $1$ mile: $${b} + ${a} = ${a + b}$, and $${b} + ${a} \\times 1 = ${a + b}$.`,
        `行驶 $1$ 英里：$${b} + ${a} = ${a + b}$，而 $${b} + ${a} \\times 1 = ${a + b}$。`,
      ],
      wrong: [
        [
          `${a}(${v} + ${b})`,
          `That charges $\\$${a}$ for each dollar of the start too. The start is paid once.`,
          `这把起步价也乘了 $${a}$。起步价只付一次。`,
        ],
        [
          `${b}${v} + ${a}`,
          `That swaps the charges: $\\$${a}$ is the one paid for each mile.`,
          `这把两种收费弄反了：每英里收的是 $\\$${a}$。`,
        ],
        [
          `${a + b}${v}`,
          "That pays the start again for every mile. It is paid only once.",
          "这相当于每英里都再付一次起步价。起步价只付一次。",
        ],
      ],
    },
    {
      prompt: [`Write an expression for $${a}$ times the sum of $${v}$ and $${b}$.`, `用代数式表示“$${v}$ 与 $${b}$ 的和的 $${a}$ 倍”。`],
      latex: `${a}(${v} + ${b})`,
      walk: [
        [
          ["Find the sum first", "先求和"],
          [`The sum of $${v}$ and $${b}$ is found first, so it goes in parentheses:`, `先求 $${v}$ 与 $${b}$ 的和，所以要加括号：`],
          [`(${v} + ${b})`],
        ],
        [["Multiply the sum", "再乘"], [`$${a}$ times that sum:`, `这个和的 $${a}$ 倍：`], [`${a}(${v} + ${b})`]],
      ],
      check: [
        `For $${v} = 1$: the sum is $${1 + b}$, and $${a}$ times it is $${a * (1 + b)}$; $${a}(1 + ${b}) = ${a * (1 + b)}$.`,
        `取 $${v} = 1$：和是 $${1 + b}$，它的 $${a}$ 倍是 $${a * (1 + b)}$；$${a}(1 + ${b}) = ${a * (1 + b)}$。`,
      ],
      wrong: [
        [
          `${a}${v} + ${b}`,
          `Without parentheses only $${v}$ is multiplied by $${a}$. The whole sum is.`,
          `不加括号就只有 $${v}$ 乘了 $${a}$。要乘的是整个和。`,
        ],
        [
          `${v} + ${a * b}`,
          `That multiplies only $${b}$ by $${a}$. The whole sum is multiplied.`,
          `这只把 $${b}$ 乘了 $${a}$。要乘的是整个和。`,
        ],
      ],
    },
    {
      prompt: [
        `Write an expression for $${b}$ less than the product of $${a}$ and $${v}$.`,
        `用代数式表示“比 $${a}$ 与 $${v}$ 的积少 $${b}$”。`,
      ],
      latex: `${a}${v} - ${b}`,
      walk: [
        [["Find the product", "先写积"], [`The product of $${a}$ and $${v}$ is`, `$${a}$ 与 $${v}$ 的积是`], [`${a}${v}`]],
        [["Take away", "再减"], [`$${b}$ less than it starts from the product:`, `比它少 $${b}$，就从积中减去：`], [`${a}${v} - ${b}`]],
      ],
      check: [
        `For $${v} = 10$: the product is $${10 * a}$, and $${b}$ less is $${10 * a - b}$; $${a} \\times 10 - ${b} = ${10 * a - b}$.`,
        `取 $${v} = 10$：积是 $${10 * a}$，少 $${b}$ 是 $${10 * a - b}$；$${a} \\times 10 - ${b} = ${10 * a - b}$。`,
      ],
      wrong: [
        [
          `${b} - ${a}${v}`,
          `That starts from $${b}$. “$${b}$ less than the product” starts from the product.`,
          `这是从 $${b}$ 开始减。“比积少 $${b}$”要从积开始减。`,
        ],
        [
          `${a}(${v} - ${b})`,
          `That takes $${b}$ from $${v}$ before multiplying. Take it from the product.`,
          `这是先从 $${v}$ 中减 $${b}$ 再乘。应该从积中减。`,
        ],
      ],
    },
    {
      prompt: [
        `Write an expression for the quotient of $${v}$ and $${a}$, increased by $${b}$.`,
        `用代数式表示“$${v}$ 与 $${a}$ 的商再增加 $${b}$”。`,
      ],
      latex: `\\frac{${v}}{${a}} + ${b}`,
      walk: [
        [["Find the quotient", "先写商"], [`The quotient of $${v}$ and $${a}$ is`, `$${v}$ 与 $${a}$ 的商是`], [`\\frac{${v}}{${a}}`]],
        [
          ["Increase it", "再增加"],
          [`Increased by $${b}$ adds to the quotient:`, `增加 $${b}$ 就是给商加上 $${b}$：`],
          [`\\frac{${v}}{${a}} + ${b}`],
        ],
      ],
      check: [
        `For $${v} = ${10 * a}$: the quotient is $10$, and increased by $${b}$ it is $${10 + b}$; $\\frac{${10 * a}}{${a}} + ${b} = ${10 + b}$.`,
        `取 $${v} = ${10 * a}$：商是 $10$，增加 $${b}$ 是 $${10 + b}$；$\\frac{${10 * a}}{${a}} + ${b} = ${10 + b}$。`,
      ],
      wrong: [
        [
          `\\frac{${v} + ${b}}{${a}}`,
          `That adds $${b}$ before dividing. The quotient is found first, then increased.`,
          `这是先加 $${b}$ 再除。应先求商，再增加。`,
        ],
        [
          `\\frac{${a}}{${v}} + ${b}`,
          `That divides $${a}$ by $${v}$. In the quotient of $${v}$ and $${a}$, $${v}$ goes on top.`,
          `这是 $${a}$ 除以 $${v}$。$${v}$ 与 $${a}$ 的商中，$${v}$ 在上面。`,
        ],
      ],
    },
  ];
}

export const constructingAlgebraicExpressions = withIntro(
  topic(
    "constructing-algebraic-expressions",
    t("Constructing Algebraic Expressions", "列代数式"),
    t(
      "To write an expression for a situation, decide which operation each part describes. If pencils cost \\$2 each and a notebook costs \\$5, then p pencils and a notebook cost 2p + 5 dollars. Use parentheses for a sum or difference that is found first: “3 times the sum of x and 4” is 3(x + 4).",
      "为情境列代数式时，先判断每一部分对应哪种运算。铅笔每支 2 美元、笔记本 5 美元，那么 p 支铅笔和一本笔记本共 2p + 5 美元。需要先算的和或差要加括号：“x 与 4 的和的 3 倍”是 3(x + 4)。",
    ),
    ["introduction-to-algebraic-expressions"],
    ["6.EE.A.2a", "6.EE.B.6"],
    [
      lesson(
        "one-operation-in-context",
        ["One operation in context", "情境中的一步运算"],
        [
          [
            "Ask what happens to the unknown amount. More of it means add; fewer, or some taken away, means subtract; the same amount for each of several means multiply; shared equally means divide. So $t$ tickets at $\\$8$ each cost $8t$ dollars.",
            "想一想这个未知的量发生了什么。变多就加；变少或拿走一些就减；几个、每个一样多就乘；平均分就除。所以每张 $\\$8$ 的票买 $t$ 张要 $8t$ 美元。",
          ],
          [
            "$4$ tickets cost $8 + 8 + 8 + 8 = 32$ dollars, and $8 \\times 4 = 32$.",
            "$4$ 张票要 $8 + 8 + 8 + 8 = 32$ 美元，而 $8 \\times 4 = 32$。",
          ],
          [
            "“Each” with many items means multiply, not add: $t$ tickets at $\\$8$ cost $8t$, not $t + 8$.",
            "“每个”再乘上个数要用乘法，不是加法：每张 $\\$8$ 的票买 $t$ 张是 $8t$，不是 $t + 8$。",
          ],
        ],
        (rng) => {
          const v = pickVar(rng);
          const s = rng.pick(oneStepStories(v, rng.int(2, 12)));
          return expressed(s.prompt, s.latex, s.walk, s.check, s.wrong);
        },
        tapeFigure(
          [{ total: "8t", pieces: Array.from({ length: 4 }, () => ({ size: 1, text: "8" })) }],
          [
            "A bar of 4 equal pieces of 8, one for each ticket: 4 tickets cost 8 × 4. For t tickets the bar has t pieces, 8t.",
            "一个长条有 4 段，每段 8，每段是一张票：4 张票要 8 × 4。t 张票就有 t 段，共 8t。",
          ],
        ),
      ),
      lesson(
        "two-operations",
        ["Two operations", "两步运算"],
        [
          [
            "Build the expression in the order the amount is found. A taxi that charges $\\$3$ to start plus $\\$2$ for each mile costs $2m$ for $m$ miles and then $3$ more: $3 + 2m$. “$2$ times the sum of $m$ and $3$” finds the sum first, so it needs parentheses: $2(m + 3)$.",
            "按求出这个量的先后顺序列式。起步价 $\\$3$、每英里 $\\$2$ 的出租车，行驶 $m$ 英里先算 $2m$，再加 $3$：$3 + 2m$。“$m$ 与 $3$ 的和的 $2$ 倍”要先求和，所以要加括号：$2(m + 3)$。",
          ],
          [
            "For $m = 4$: $3 + 2 \\times 4 = 11$, and the bar shows $3 + 2 + 2 + 2 + 2 = 11$.",
            "当 $m = 4$ 时：$3 + 2 \\times 4 = 11$，长条也是 $3 + 2 + 2 + 2 + 2 = 11$。",
          ],
          [
            "$3 + 2m$ and $2(m + 3)$ are different: for $m = 4$ they give $11$ and $14$. Use parentheses only when the sum is found first.",
            "$3 + 2m$ 与 $2(m + 3)$ 不同：当 $m = 4$ 时分别得 $11$ 和 $14$。只有先求和时才加括号。",
          ],
        ],
        (rng) => {
          const a = rng.int(2, 9);
          let b: number;
          do b = rng.int(2, 12);
          while (b === a);
          const s = rng.pick(twoStepStories(pickVar(rng), a, b));
          return expressed(s.prompt, s.latex, s.walk, s.check, s.wrong);
        },
        tapeFigure(
          [
            {
              total: "3 + 2m",
              pieces: [{ size: 1.5, text: "3", lit: true }, ...Array.from({ length: 4 }, () => ({ size: 1, text: "2" }))],
            },
          ],
          [
            "A bar: a shaded piece of 3 for the start, then a piece of 2 for each mile; 4 miles are shown.",
            "一个长条：涂色的一段 3 是起步价，后面每英里一段 2；图中画了 4 英里。",
          ],
        ),
      ),
    ],
  ),
  [
    "A cinema ticket costs $\\$8$. Two tickets cost $8 \\times 2$ dollars and five cost $8 \\times 5$. For any number $t$ of tickets the cost is $8t$ dollars, one expression for every case.",
    "一张电影票 $\\$8$。两张要 $8 \\times 2$ 美元，五张要 $8 \\times 5$ 美元。不管买多少张，设张数为 $t$，总价就是 $8t$ 美元，一个代数式管所有情况。",
  ],
  ["For $t = 3$: $8 \\times 3 = 24$, the same as $8 + 8 + 8$.", "当 $t = 3$ 时：$8 \\times 3 = 24$，和 $8 + 8 + 8$ 一样。"],
  ["turn a story into an expression, first with one operation and then with two.", "把情境写成代数式，先是一步运算，再是两步运算。"],
);

/** LinearForm is an expression in one variable that is evaluated in steps, with the values two usual slips give. */
interface LinearForm {
  readonly latex: string;
  readonly at: (x: number) => number;
  /** sub writes the expression with the value put in. */
  readonly sub: (x: number) => string;
  /** work writes the order of operations step and its lines. */
  readonly work: (x: number) => Walk;
  /** back works from the value back to x. */
  readonly back: (x: number) => Pair;
  readonly offs: (x: number) => Off[];
}

/** linearForms are the shapes of the linear expressions evaluated in this course. */
function linearForms(v: string, a: number, b: number): LinearForm[] {
  return [
    {
      latex: `${a}${v} + ${b}`,
      at: (x) => a * x + b,
      sub: (x) => `${a} \\times ${x} + ${b}`,
      work: (x) => [
        ["Multiply, then add", "先乘后加"],
        ["Multiplication comes before addition:", "先算乘法，再算加法："],
        [`${a} \\times ${x} + ${b} = ${a * x} + ${b} = ${a * x + b}`],
      ],
      back: (x) => [
        `Work backwards: $${a * x + b} - ${b} = ${a * x}$ and $${a * x} \\div ${a} = ${x}$, the value we put in.`,
        `倒着算：$${a * x + b} - ${b} = ${a * x}$，$${a * x} \\div ${a} = ${x}$，正是代入的值。`,
      ],
      offs: (x) => [
        [a + x + b, `That adds $${a}$. $${a}${v}$ means $${a} \\times ${v}$.`, `这是加上了 $${a}$。$${a}${v}$ 表示 $${a} \\times ${v}$。`],
        [a * (x + b), `That adds $${b}$ before multiplying. Multiply first, then add.`, `这是先加 $${b}$ 再乘。要先乘后加。`],
      ],
    },
    {
      latex: `${a}(${v} + ${b})`,
      at: (x) => a * (x + b),
      sub: (x) => `${a} \\times (${x} + ${b})`,
      work: (x) => [
        ["Parentheses first", "先算括号"],
        ["Add inside the parentheses, then multiply:", "先算括号里的加法，再乘："],
        [`${a} \\times (${x} + ${b}) = ${a} \\times ${x + b} = ${a * (x + b)}`],
      ],
      back: (x) => [
        `Work backwards: $${a * (x + b)} \\div ${a} = ${x + b}$ and $${x + b} - ${b} = ${x}$, the value we put in.`,
        `倒着算：$${a * (x + b)} \\div ${a} = ${x + b}$，$${x + b} - ${b} = ${x}$，正是代入的值。`,
      ],
      offs: (x) => [
        [a + x + b, `That adds $${a}$. The $${a}$ outside the parentheses multiplies.`, `这是加上了 $${a}$。括号外的 $${a}$ 表示相乘。`],
        [
          a * x + b,
          `That multiplies only $${v}$ by $${a}$. The whole sum in the parentheses is multiplied.`,
          `这只把 $${v}$ 乘了 $${a}$。括号里的整个和都要乘。`,
        ],
      ],
    },
    {
      latex: `${b} + \\frac{${v}}{${a}}`,
      at: (x) => b + x / a,
      sub: (x) => `${b} + ${x} \\div ${a}`,
      work: (x) => [
        ["Divide, then add", "先除后加"],
        ["Division comes before addition:", "先算除法，再算加法："],
        [`${b} + ${x} \\div ${a} = ${b} + ${x / a} = ${b + x / a}`],
      ],
      back: (x) => [
        `Work backwards: $${b + x / a} - ${b} = ${x / a}$ and $${x / a} \\times ${a} = ${x}$, the value we put in.`,
        `倒着算：$${b + x / a} - ${b} = ${x / a}$，$${x / a} \\times ${a} = ${x}$，正是代入的值。`,
      ],
      offs: (x) => [
        [
          Q.of(b * x + a, x),
          `That divides $${a}$ by the value. $\\frac{${v}}{${a}}$ divides the value by $${a}$.`,
          `这是 $${a}$ 除以代入的值。$\\frac{${v}}{${a}}$ 是用代入的值除以 $${a}$。`,
        ],
        [Q.of(b + x, a), `That divides the whole sum by $${a}$. Only $${v}$ is divided.`, `这是把整个和除以 $${a}$。只有 $${v}$ 被除。`],
      ],
    },
  ];
}

export const evaluatingLinearExpressions = withIntro(
  topic(
    "evaluating-linear-expressions",
    t("Evaluating Linear Expressions", "一次式求值"),
    t(
      "To evaluate an expression, replace the variable with its value and follow the order of operations. For x = 4, 3x + 2 = 3 × 4 + 2 = 14, and 3(x + 2) = 3 × 6 = 18. Remember that 3x means 3 × x, not 3 + x.",
      "代数式求值时，把变量换成它的值，再按运算顺序计算。当 x = 4 时，3x + 2 = 3 × 4 + 2 = 14，3(x + 2) = 3 × 6 = 18。注意 3x 表示 3 × x，而不是 3 + x。",
    ),
    ["introduction-to-algebraic-expressions"],
    ["6.EE.A.2c"],
    [
      lesson(
        "whole-number-values",
        ["Whole-number values", "代入整数"],
        [
          [
            "To evaluate an expression, put the value in place of the letter and follow the order of operations: parentheses first, then multiplication, then addition. A number written next to a letter means multiply. For $n = 6$: $4n + 5 = 4 \\times 6 + 5 = 29$, but $4(n + 5) = 4 \\times 11 = 44$, because the parentheses come first.",
            "求代数式的值，就把字母换成它的值，再按运算顺序计算：先算括号，再算乘法，最后算加法。数写在字母前面表示相乘。当 $n = 6$ 时：$4n + 5 = 4 \\times 6 + 5 = 29$；而 $4(n + 5) = 4 \\times 11 = 44$，因为要先算括号。",
          ],
          [
            "The area model shows $4(6 + 5)$ as $4 \\times 6 + 4 \\times 5 = 24 + 20 = 44$.",
            "面积模型把 $4(6 + 5)$ 看成 $4 \\times 6 + 4 \\times 5 = 24 + 20 = 44$。",
          ],
          [
            "$4n$ means $4 \\times n$. For $n = 6$ it is $24$, not $46$ and not $4 + 6$.",
            "$4n$ 表示 $4 \\times n$。当 $n = 6$ 时它是 $24$，不是 $46$，也不是 $4 + 6$。",
          ],
        ],
        (rng) => {
          const v = pickVar(rng);
          const a = rng.int(2, 9);
          const b = rng.int(1, 15);
          const f = rng.pick(linearForms(v, a, b));
          const x = f.latex.includes("frac") ? a * rng.int(1, 9) : rng.int(2, 12);
          return valued(
            [`Evaluate $${f.latex}$ when $${v} = ${x}$.`, `当 $${v} = ${x}$ 时，求 $${f.latex}$ 的值。`],
            f.at(x),
            [[["Put the value in", "代入"], [`Write $${x}$ in place of $${v}$:`, `把 $${v}$ 换成 $${x}$：`], [f.sub(x)]], f.work(x)],
            f.back(x),
            f.offs(x),
          );
        },
        areaGridFigure(["4"], ["6", "5"], [["24", "20"]]),
      ),
      lesson(
        "fraction-and-decimal-values",
        ["Fraction and decimal values", "代入分数和小数"],
        [
          [
            "Fraction and decimal values are put in the same way. Multiply first, then add or subtract. For $x = \\frac{1}{2}$: $6x + 1 = 6 \\times \\frac{1}{2} + 1 = 3 + 1 = 4$. For $x = 2.5$: $4x - 3 = 10 - 3 = 7$.",
            "字母的值是分数或小数时，也一样代入。先算乘法，再算加减。当 $x = \\frac{1}{2}$ 时：$6x + 1 = 6 \\times \\frac{1}{2} + 1 = 3 + 1 = 4$。当 $x = 2.5$ 时：$4x - 3 = 10 - 3 = 7$。",
          ],
          [
            "On the number line, six hops of $\\frac{1}{2}$ reach $3$, and one more hop of $1$ reaches $4$.",
            "在数轴上，跳 $6$ 次 $\\frac{1}{2}$ 到 $3$，再跳 $1$ 到 $4$。",
          ],
          [
            "Do not add the coefficient to the value: $6x$ for $x = \\frac{1}{2}$ is $3$, not $6\\frac{1}{2}$.",
            "不要把系数和值相加：当 $x = \\frac{1}{2}$ 时，$6x$ 是 $3$，不是 $6\\frac{1}{2}$。",
          ],
        ],
        (rng) => {
          const v = pickVar(rng);
          const decimal = rng.bool();
          const x = decimal
            ? Q.of(rng.pick([11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 23, 25, 27, 32, 35, 45]), 10)
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
          const a = decimal ? rng.int(2, 9) : Number(x.d) * rng.int(1, 3);
          const b = rng.int(1, 12);
          const product = Q.of(a).mul(x);
          const value = product.add(Q.of(b));
          const w = (c: Q) => (decimal ? dec(c) : c.toLatex());
          const xs = w(x);
          return valued(
            [`Evaluate $${a}${v} + ${b}$ when $${v} = ${xs}$.`, `当 $${v} = ${xs}$ 时，求 $${a}${v} + ${b}$ 的值。`],
            value,
            [
              [
                ["Put the value in", "代入"],
                [`Write $${xs}$ in place of $${v}$:`, `把 $${v}$ 换成 $${xs}$：`],
                [`${a} \\times ${xs} + ${b}`],
              ],
              [["Multiply", "先乘"], [`$${a}$ groups of $${xs}$:`, `$${a}$ 个 $${xs}$：`], [`${a} \\times ${xs} = ${w(product)}`]],
              [["Add", "再加"], ["", ""], [`${w(product)} + ${b} = ${w(value)}`]],
            ],
            [
              `Work backwards: $${w(value)} - ${b} = ${w(product)}$ and $${w(product)} \\div ${a} = ${xs}$, the value we put in.`,
              `倒着算：$${w(value)} - ${b} = ${w(product)}$，$${w(product)} \\div ${a} = ${xs}$，正是代入的值。`,
            ],
            [
              [
                Q.of(a).add(x).add(Q.of(b)),
                `That adds $${a}$ to the value. $${a}${v}$ means $${a} \\times ${v}$.`,
                `这是把 $${a}$ 和值相加。$${a}${v}$ 表示 $${a} \\times ${v}$。`,
              ],
              [
                Q.of(a).mul(x.add(Q.of(b))),
                `That adds $${b}$ before multiplying. Multiply first, then add.`,
                `这是先加 $${b}$ 再乘。要先乘后加。`,
              ],
            ],
            { form: decimal ? "decimal" : value.isInteger() ? "integer" : "fraction" },
          );
        },
        lineFigure(
          {
            lo: 0,
            hi: 5,
            step: 0.5,
            labels: [0, 1, 2, 3, 4, 5],
            jumps: [...Array.from({ length: 6 }, (_, i) => [i / 2, (i + 1) / 2] as const), [3, 4]],
            marks: [{ at: 4, result: true }],
          },
          [
            "Six hops of one half from 0 reach 3, then a hop of 1 reaches 4: 6 × 1/2 + 1 = 4.",
            "从 0 开始跳 6 次二分之一到 3，再跳 1 到 4：6 × 1/2 + 1 = 4。",
          ],
        ),
      ),
    ],
  ),
  [
    "A gym charges $\\$5$ to join and $\\$3$ for each visit, so $v$ visits cost $3v + 5$ dollars. Ana went $6$ times. To find her bill we put $6$ in place of $v$.",
    "健身房入会费 $\\$5$，每次再收 $\\$3$，所以去 $v$ 次要 $3v + 5$ 美元。Ana 去了 $6$ 次。要算她的费用，就把 $v$ 换成 $6$。",
  ],
  [
    "$3 \\times 6 + 5 = 18 + 5 = 23$, and adding $3$ six times to $5$ also gives $23$.",
    "$3 \\times 6 + 5 = 18 + 5 = 23$；从 $5$ 开始加 $6$ 次 $3$，也得 $23$。",
  ],
  [
    "put a value in place of the letter and follow the order of operations, with whole numbers, fractions and decimals.",
    "把值代入字母，按运算顺序计算，值可以是整数、分数或小数。",
  ],
);

/** PowerForm is an expression with an exponent, evaluated in steps, with another way to reach its value and the usual slips. */
interface PowerForm {
  readonly latex: string;
  readonly value: number;
  readonly walk: readonly Walk[];
  readonly check: Pair;
  readonly offs: readonly Off[];
}

/** powerForms are the expressions with exponents evaluated in this course, for a letter v at x with a number a. */
function powerForms(v: string, x: number, a: number): PowerForm[] {
  const put: Walk = [
    ["Put the value in", "代入"],
    [`Write $${x}$ in place of $${v}$.`, `把 $${v}$ 换成 $${x}$。`],
  ];
  return [
    {
      latex: `${v}^{2} + ${a}${v}`,
      value: x * x + a * x,
      walk: [
        put,
        [["Powers first", "先算乘方"], ["", ""], [`${x}^{2} = ${x} \\times ${x} = ${x * x}`]],
        [["Multiply and add", "再乘再加"], ["", ""], [`${x * x} + ${a} \\times ${x} = ${x * x} + ${a * x} = ${x * x + a * x}`]],
      ],
      check: [
        `$${v}^{2} + ${a}${v} = ${v}(${v} + ${a})$, and $${x} \\times ${x + a} = ${x * (x + a)}$.`,
        `$${v}^{2} + ${a}${v} = ${v}(${v} + ${a})$，而 $${x} \\times ${x + a} = ${x * (x + a)}$。`,
      ],
      offs: [
        [
          2 * x + a * x,
          `That doubles $${x}$. $${v}^{2}$ means $${v} \\times ${v}$, not $2 \\times ${v}$.`,
          `这是把 $${x}$ 乘 $2$。$${v}^{2}$ 表示 $${v} \\times ${v}$，不是 $2 \\times ${v}$。`,
        ],
        [
          x * x + a + x,
          `That adds $${a}$ to $${x}$. $${a}${v}$ means $${a} \\times ${v}$.`,
          `这是把 $${a}$ 和 $${x}$ 相加。$${a}${v}$ 表示 $${a} \\times ${v}$。`,
        ],
      ],
    },
    {
      latex: `${a}${v}^{2}`,
      value: a * x * x,
      walk: [
        put,
        [["Powers first", "先算乘方"], [`Only $${v}$ is squared:`, `只有 $${v}$ 平方：`], [`${x}^{2} = ${x * x}`]],
        [["Then multiply", "再乘"], ["", ""], [`${a} \\times ${x * x} = ${a * x * x}`]],
      ],
      check: [
        `Multiply in another order: $${a} \\times ${x} = ${a * x}$ and $${a * x} \\times ${x} = ${a * x * x}$.`,
        `换个顺序乘：$${a} \\times ${x} = ${a * x}$，$${a * x} \\times ${x} = ${a * x * x}$。`,
      ],
      offs: [
        [
          a * x * a * x,
          `That squares $${a}$ too. In $${a}${v}^{2}$ only $${v}$ is squared.`,
          `这把 $${a}$ 也平方了。在 $${a}${v}^{2}$ 中只有 $${v}$ 平方。`,
        ],
        [
          2 * a * x,
          `That doubles instead of squaring. $${v}^{2}$ means $${v} \\times ${v}$.`,
          `这是乘 $2$ 而不是平方。$${v}^{2}$ 表示 $${v} \\times ${v}$。`,
        ],
      ],
    },
    {
      latex: `(${v} + ${a})^{2}`,
      value: (x + a) ** 2,
      walk: [
        put,
        [["Parentheses first", "先算括号"], ["", ""], [`${x} + ${a} = ${x + a}`]],
        [["Then the power", "再算乘方"], ["", ""], [`${x + a}^{2} = ${x + a} \\times ${x + a} = ${(x + a) ** 2}`]],
      ],
      check: [
        `A square of side $${x} + ${a}$ splits into $${x * x} + ${a * x} + ${a * x} + ${a * a} = ${(x + a) ** 2}$.`,
        `边长为 $${x} + ${a}$ 的正方形可以分成 $${x * x} + ${a * x} + ${a * x} + ${a * a} = ${(x + a) ** 2}$。`,
      ],
      offs: [
        [
          x * x + a * a,
          `That squares each part. Add inside the parentheses first, then square the sum.`,
          `这是把每部分分别平方。要先算括号里的和，再把和平方。`,
        ],
        [2 * (x + a), `That doubles the sum. Squaring multiplies it by itself.`, `这是把和乘 $2$。平方是自己乘自己。`],
      ],
    },
    {
      latex: `${v}^{3} - ${a}`,
      value: x ** 3 - a,
      walk: [
        put,
        [
          ["Powers first", "先算乘方"],
          [`Three factors of $${x}$:`, `三个 $${x}$ 相乘：`],
          [`${x}^{3} = ${x} \\times ${x} \\times ${x} = ${x ** 3}`],
        ],
        [["Then subtract", "再减"], ["", ""], [`${x ** 3} - ${a} = ${x ** 3 - a}`]],
      ],
      check: [
        `Work backwards: $${x ** 3 - a} + ${a} = ${x ** 3}$, and $${x ** 3} \\div ${x} \\div ${x} = ${x}$.`,
        `倒着算：$${x ** 3 - a} + ${a} = ${x ** 3}$，$${x ** 3} \\div ${x} \\div ${x} = ${x}$。`,
      ],
      offs: [
        [3 * x - a, `That multiplies by $3$. $${v}^{3}$ means three factors of $${v}$.`, `这是乘 $3$。$${v}^{3}$ 表示三个 $${v}$ 相乘。`],
        [x * x - a, `That uses only two factors of $${x}$. The exponent $3$ asks for three.`, `这只乘了两个 $${x}$。指数 $3$ 要三个相乘。`],
      ],
    },
  ];
}

export const evaluatingAlgebraicExpressions = withIntro(
  topic(
    "evaluating-algebraic-expressions",
    t("Evaluating Algebraic Expressions", "代数式求值"),
    t(
      "Expressions can contain exponents and more than one variable. Substitute every value, then evaluate powers first: for x = 3, x² + 2x = 9 + 6 = 15. For l = 7 and w = 4, the perimeter 2l + 2w = 14 + 8 = 22.",
      "代数式中可以有指数和多个变量。先代入所有的值，再先算乘方：当 x = 3 时，x² + 2x = 9 + 6 = 15。当 l = 7、w = 4 时，周长 2l + 2w = 14 + 8 = 22。",
    ),
    ["evaluating-linear-expressions", "evaluating-whole-number-expressions-containing-exponents"],
    ["6.EE.A.2c"],
    [
      lesson(
        "expressions-with-exponents",
        ["Expressions with exponents", "含指数的代数式"],
        [
          [
            "Put the value in, then work out powers before multiplying or adding. $x^2$ means $x \\times x$, not $2x$, and in $6x^2$ only $x$ is squared. For $x = 5$: $x^2 + 3x = 25 + 15 = 40$, and $(x + 1)^2 = 6^2 = 36$.",
            "代入后，先算乘方，再算乘法和加减。$x^2$ 表示 $x \\times x$，不是 $2x$；在 $6x^2$ 中，只有 $x$ 平方。当 $x = 5$ 时：$x^2 + 3x = 25 + 15 = 40$，$(x + 1)^2 = 6^2 = 36$。",
          ],
          [
            "The area model shows $5 \\times (5 + 3) = 25 + 15 = 40$, the same value.",
            "面积模型显示 $5 \\times (5 + 3) = 25 + 15 = 40$，值相同。",
          ],
          ["$x^2$ is $x$ times itself. For $x = 5$ it is $25$, not $10$.", "$x^2$ 是 $x$ 自己乘自己。当 $x = 5$ 时它是 $25$，不是 $10$。"],
        ],
        (rng) => {
          const v = pickVar(rng);
          const x = rng.int(2, 9);
          const a = rng.int(2, 9);
          const f = rng.pick(powerForms(v, x, a));
          return valued(
            [`Evaluate $${f.latex}$ when $${v} = ${x}$.`, `当 $${v} = ${x}$ 时，求 $${f.latex}$ 的值。`],
            f.value,
            f.walk,
            f.check,
            f.offs,
          );
        },
        areaGridFigure(["5"], ["5", "3"], [["25", "15"]], [1], [5, 3]),
      ),
      lesson(
        "expressions-with-two-variables",
        ["Two variables and formulas", "两个变量与公式"],
        [
          [
            "Put each value in for its own letter, then follow the order of operations. Formulas are expressions like this, with letters that stand for measurements. The area of a triangle is $A = \\frac{1}{2}bh$; for $b = 10$ and $h = 7$, $A = \\frac{1}{2} \\times 10 \\times 7 = 35$.",
            "把每个值代入对应的字母，再按运算顺序计算。公式也是这样的代数式，字母表示各种量。三角形面积 $A = \\frac{1}{2}bh$；当 $b = 10$，$h = 7$ 时，$A = \\frac{1}{2} \\times 10 \\times 7 = 35$。",
          ],
          [
            "The triangle is half of a $10$ by $7$ rectangle, and $70 \\div 2 = 35$.",
            "这个三角形是 $10 \\times 7$ 长方形的一半，$70 \\div 2 = 35$。",
          ],
          [
            "Each value goes with its own letter. Swapping them, as $10$ for $h$ and $7$ for $b$, can change the answer.",
            "每个值要代入对应的字母。把值放错字母，结果可能会变。",
          ],
        ],
        (rng) => {
          const kind = rng.int(0, 3);
          if (kind === 0) {
            const [u, v] = twoVars(rng);
            const a = rng.int(2, 9);
            let b = rng.int(2, 9);
            if (b === a) b = a === 9 ? 2 : a + 1;
            const x = rng.int(1, 10);
            let y = rng.int(1, 10);
            if (y === x) y = x === 10 ? 1 : x + 1;
            const value = a * x + b * y;
            return valued(
              [
                `Evaluate $${a}${u} + ${b}${v}$ when $${u} = ${x}$ and $${v} = ${y}$.`,
                `当 $${u} = ${x}$，$${v} = ${y}$ 时，求 $${a}${u} + ${b}${v}$ 的值。`,
              ],
              value,
              [
                [
                  ["Put the values in", "代入"],
                  [`$${x}$ for $${u}$ and $${y}$ for $${v}$:`, `$${u}$ 换成 $${x}$，$${v}$ 换成 $${y}$：`],
                  [`${a} \\times ${x} + ${b} \\times ${y}`],
                ],
                [["Multiply, then add", "先乘后加"], ["", ""], [`${a * x} + ${b * y} = ${value}`]],
              ],
              [`Add in the other order: $${b * y} + ${a * x} = ${value}$.`, `换个顺序加：$${b * y} + ${a * x} = ${value}$。`],
              [
                [
                  a * y + b * x,
                  "That swaps the values. Each value goes with its own letter.",
                  "这是把两个值放错了字母。每个值要代入对应的字母。",
                ],
                [a + x + b + y, `That adds. $${a}${u}$ means $${a} \\times ${u}$.`, `这是相加。$${a}${u}$ 表示 $${a} \\times ${u}$。`],
              ],
            );
          }
          if (kind === 1) {
            const l = rng.int(5, 20);
            const w = rng.int(2, l - 1);
            const p = 2 * l + 2 * w;
            return valued(
              [
                `The perimeter of a rectangle is $P = 2l + 2w$. Find $P$ when $l = ${l}$ cm and $w = ${w}$ cm.`,
                `长方形的周长 $P = 2l + 2w$。当 $l = ${l}$ 厘米，$w = ${w}$ 厘米时，求 $P$。`,
              ],
              p,
              [
                [["Put the values in", "代入"], ["", ""], [`P = 2 \\times ${l} + 2 \\times ${w}`]],
                [["Multiply, then add", "先乘后加"], ["", ""], [`P = ${2 * l} + ${2 * w} = ${p}`]],
              ],
              [
                `Walk around the rectangle: $${l} + ${w} + ${l} + ${w} = ${p}$ cm.`,
                `沿长方形走一圈：$${l} + ${w} + ${l} + ${w} = ${p}$ 厘米。`,
              ],
              [
                [
                  l + w,
                  "That is half the perimeter: one length and one width. The rectangle has two of each.",
                  "这只是周长的一半：一条长和一条宽。长方形各有两条。",
                ],
                [l * w, "That multiplies the sides, which gives the area, not the perimeter.", "这是把两边相乘，得到的是面积，不是周长。"],
                [2 * l + w, "That counts the width only once. There are two widths.", "宽只算了一次。宽有两条。"],
              ],
              { unit: "cm" },
            );
          }
          if (kind === 2) {
            const b = rng.int(2, 12) * 2;
            const h = rng.int(3, 15);
            const area = (b * h) / 2;
            return valued(
              [
                `The area of a triangle is $A = \\frac{1}{2}bh$. Find $A$ when $b = ${b}$ m and $h = ${h}$ m.`,
                `三角形的面积 $A = \\frac{1}{2}bh$。当 $b = ${b}$ 米，$h = ${h}$ 米时，求 $A$。`,
              ],
              area,
              [
                [["Put the values in", "代入"], ["", ""], [`A = \\frac{1}{2} \\times ${b} \\times ${h}`]],
                [
                  ["Halve, then multiply", "先取一半再乘"],
                  [`Half of $${b}$ is $${b / 2}$:`, `$${b}$ 的一半是 $${b / 2}$：`],
                  [`A = ${b / 2} \\times ${h} = ${area}`],
                ],
              ],
              [
                `The rectangle around it is $${b} \\times ${h} = ${b * h}$ m², and half of that is $${area}$ m².`,
                `外面的长方形是 $${b} \\times ${h} = ${b * h}$ 平方米，它的一半是 $${area}$ 平方米。`,
              ],
              [
                [b * h, "That is the whole rectangle. The triangle is half of it.", "这是整个长方形。三角形只有它的一半。"],
                [b + h, "That adds the base and height. Area multiplies.", "这是把底和高相加。面积要相乘。"],
              ],
              { unit: "m^2" },
            );
          }
          const s = rng.int(2, 9);
          return valued(
            [
              `The volume of a cube with edge length $s$ is $V = s^{3}$. Find $V$ when $s = ${s}$ in.`,
              `棱长为 $s$ 的正方体体积 $V = s^{3}$。当 $s = ${s}$ 英寸时，求 $V$。`,
            ],
            s ** 3,
            [
              [["Put the value in", "代入"], ["", ""], [`V = ${s}^{3}`]],
              [["Three factors", "三个因数相乘"], ["", ""], [`V = ${s} \\times ${s} \\times ${s} = ${s * s} \\times ${s} = ${s ** 3}`]],
            ],
            [
              `One layer holds $${s} \\times ${s} = ${s * s}$ unit cubes, and there are $${s}$ layers: $${s * s} \\times ${s} = ${s ** 3}$.`,
              `一层有 $${s} \\times ${s} = ${s * s}$ 个小正方体，共 $${s}$ 层：$${s * s} \\times ${s} = ${s ** 3}$。`,
            ],
            [
              [3 * s, "That multiplies by 3. $s^{3}$ means three factors of $s$.", "这是乘 $3$。$s^{3}$ 表示三个 $s$ 相乘。"],
              [s * s, "That is one face, with only two factors. Volume needs three.", "这是一个面，只有两个因数相乘。体积要三个。"],
            ],
            { unit: "in^3" },
          );
        },
        drawn(gradeDrawings4["evaluating-algebraic-expressions#expressions-with-two-variables"]),
      ),
    ],
  ),
  [
    "A square garden has side $s$ meters, so its area is $s^{2}$ square meters. When the side is $6$ meters, we put $6$ in for $s$ and work out the power first.",
    "一块正方形菜地边长 $s$ 米，面积是 $s^{2}$ 平方米。当边长是 $6$ 米时，把 $s$ 换成 $6$，先算乘方。",
  ],
  [
    "$6^{2} = 6 \\times 6 = 36$, and $6$ rows of $6$ square meters also make $36$.",
    "$6^{2} = 6 \\times 6 = 36$；$6$ 行、每行 $6$ 平方米，也是 $36$。",
  ],
  [
    "evaluate expressions with exponents and with more than one letter, including formulas.",
    "求含指数、含多个字母的代数式的值，包括公式。",
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

/** partOf names the letter part of a term in words. */
const partOf = ([, v]: Term): Pair => (v === "" ? ["no letter", "不含字母"] : [`the letter part $${v}$`, `字母部分是 $${v}$`]);

export const identifyingTermsInLinearExpressions = withIntro(
  topic(
    "identifying-terms-in-linear-expressions",
    t("Identifying Terms in Linear Expressions", "识别一次式中的项"),
    t(
      "The terms of an expression are the parts that are added or subtracted. 4x + 7 − 2y has three terms: 4x, 7 and −2y. A term can be a number, a variable, or a number times a variable; the 4 in 4x is part of the term, not a term of its own.",
      "代数式中相加或相减的各部分叫做项。4x + 7 − 2y 有三项：4x、7 和 −2y。项可以是一个数、一个变量，或者数与变量的积；4x 中的 4 是这一项的一部分，不是单独的一项。",
    ),
    ["introduction-to-algebraic-expressions"],
    ["6.EE.A.2b"],
    [
      lesson(
        "counting-terms",
        ["Counting terms", "数一数有几项"],
        [
          [
            "The terms are the parts joined by $+$ and $-$ signs. Split the expression at each $+$ or $-$ that is not inside parentheses. $5m - 3 + n$ has the terms $5m$, $-3$ and $n$, so it has $3$ terms.",
            "项是用 $+$、$-$ 号连起来的各部分。在不在括号里的每个 $+$、$-$ 号处把代数式分开。$5m - 3 + n$ 的项是 $5m$、$-3$ 和 $n$，所以有 $3$ 项。",
          ],
          [
            "$5m - 3 + n$ has $2$ signs between its parts, and $2$ signs join $3$ terms.",
            "$5m - 3 + n$ 的各部分之间有 $2$ 个符号，$2$ 个符号连起 $3$ 项。",
          ],
          [
            "$5m$ is one term, not two. The $5$ and the $m$ are multiplied, and only $+$ and $-$ separate terms.",
            "$5m$ 是一项，不是两项。$5$ 和 $m$ 是相乘的，只有 $+$、$-$ 号才分开项。",
          ],
        ],
        (rng) => {
          const n = rng.int(2, 4);
          const terms = randomExpression(rng, n);
          const e = exprLatex(terms);
          const list = terms.map((x) => `$${termLatex(x)}$`);
          return valued(
            [`How many terms does $${e}$ have?`, `$${e}$ 有几项？`],
            n,
            [
              [
                ["Split at the signs", "在符号处分开"],
                [`Cut at each $+$ and $-$: ${list.join(", ")}.`, `在每个 $+$、$-$ 号处分开：${list.join("、")}。`],
              ],
              [
                ["Count the parts", "数一数"],
                [`That is $${n}$ terms.`, `共 $${n}$ 项。`],
              ],
            ],
            [
              `There are $${n - 1}$ signs between the parts, and $${n - 1}$ signs join $${n}$ terms.`,
              `各部分之间有 $${n - 1}$ 个符号，$${n - 1}$ 个符号连起 $${n}$ 项。`,
            ],
            [
              [
                n - 1,
                "That counts the signs between the terms. There is one more term than signs.",
                "这是数了项之间的符号。项比符号多一个。",
              ],
              [
                n + 1,
                "That counts one part too many. A number and its letter, like $4x$, make one term.",
                "多数了一项。数和它的字母（如 $4x$）合起来是一项。",
              ],
              [
                2 * n,
                "That counts each number and each letter on its own. A coefficient and its letter make one term.",
                "这是把每个数和每个字母分开数了。系数和字母合起来是一项。",
              ],
            ],
          );
        },
        tapeFigure(
          [
            {
              total: "5m − 3 + n",
              pieces: [
                { size: 3, text: "5m" },
                { size: 2, text: "−3", lit: true },
                { size: 2, text: "n" },
              ],
            },
          ],
          ["A bar cut at each sign into three pieces: 5m, −3 and n.", "一个长条在每个符号处切开，分成三段：5m、−3 和 n。"],
        ),
      ),
      lesson(
        "recognizing-a-term",
        ["Recognizing a term", "识别项"],
        [
          [
            "A term is one whole part between the signs. In $6x + 2y + 9$ the terms are $6x$, $2y$ and $9$. The $6$ alone is only part of the term $6x$, and $x + 2y$ joins pieces of two terms, so neither is a term.",
            "项是符号之间完整的一部分。在 $6x + 2y + 9$ 中，项是 $6x$、$2y$ 和 $9$。单独的 $6$ 只是 $6x$ 这一项的一部分，$x + 2y$ 把两项的部分连在一起，所以它们都不是项。",
          ],
          [
            "Adding the terms back together, $6x + 2y + 9$, gives the whole expression again.",
            "把各项加回去，$6x + 2y + 9$，又得到原来的代数式。",
          ],
          [
            "A term keeps its number and its letter together: $6x$ is a term, but the $6$ or the $x$ on its own is not.",
            "项要把数和字母放在一起：$6x$ 是项，单独的 $6$ 或 $x$ 不是。",
          ],
        ],
        (rng) => {
          const [u, v] = twoVars(rng);
          const a = rng.int(2, 9);
          let b = rng.int(2, 9);
          if (b === a) b = a === 9 ? 2 : a + 1;
          let c = rng.int(2, 15);
          if (c === a || c === b) c += 10;
          const e = `${a}${u} + ${b}${v} + ${c}`;
          const target = rng.pick([`${a}${u}`, `${b}${v}`, `${c}`]);
          return chosenMath(
            rng,
            [`Which of these is a term of $${e}$?`, `下面哪个是 $${e}$ 的项？`],
            target,
            [
              [`${a}`, `That is only the number in the term $${a}${u}$.`, `这只是 $${a}${u}$ 这一项中的数。`],
              [
                `${u} + ${b}${v}`,
                "That joins pieces of two terms. A term lies between two signs.",
                "这把两项的部分连在一起了。项在两个符号之间。",
              ],
              [`${b}${v} + ${c}`, "That is two terms together, not one.", "这是两项合在一起，不是一项。"],
              [u, `That is only the letter of the term $${a}${u}$.`, `这只是 $${a}${u}$ 这一项中的字母。`],
            ],
            [
              [
                ["Split at the signs", "在符号处分开"],
                [`The terms of $${e}$ are $${a}${u}$, $${b}${v}$ and $${c}$.`, `$${e}$ 的项是 $${a}${u}$、$${b}${v}$ 和 $${c}$。`],
              ],
              [
                ["Find it in the list", "在其中找"],
                [`$${target}$ is one of them.`, `$${target}$ 是其中之一。`],
              ],
            ],
            [
              `Adding the terms back gives $${a}${u} + ${b}${v} + ${c}$, the whole expression.`,
              `把各项加回去得 $${a}${u} + ${b}${v} + ${c}$，正是原式。`,
            ],
          );
        },
        tapeFigure(
          [
            {
              total: "6x + 2y + 9",
              pieces: [
                { size: 3, text: "6x", lit: true },
                { size: 2, text: "2y", lit: true },
                { size: 2, text: "9", lit: true },
              ],
            },
          ],
          ["A bar in three whole pieces, 6x, 2y and 9: each piece is a term.", "一个长条分成完整的三段：6x、2y 和 9，每段是一项。"],
        ),
      ),
    ],
  ),
  [
    "At the fair, Kai buys $4$ drinks at $x$ dollars each, $2$ hot dogs at $y$ dollars each, and pays $7$ dollars to get in. His total is $4x + 2y + 7$: one part for each kind of thing he paid for.",
    "在集市上，Kai 买了 $4$ 杯饮料，每杯 $x$ 美元；$2$ 个热狗，每个 $y$ 美元；门票 $7$ 美元。他一共花 $4x + 2y + 7$ 美元：每种花费是一部分。",
  ],
  ["The parts are $4x$, $2y$ and $7$: three parts for three kinds of cost.", "各部分是 $4x$、$2y$ 和 $7$：三种花费，三个部分。"],
  ["find the terms of an expression, the parts joined by plus and minus signs.", "找出代数式的项，也就是用加号、减号连起来的各部分。"],
);

export const identifyingCoefficientsAndConstants = withIntro(
  topic(
    "identifying-coefficients-and-constants",
    t("Identifying Coefficients and Constants", "识别系数和常数项"),
    t(
      "The coefficient of a term is the number that multiplies the variable, and a constant term has no variable. In 5x − 3y + 8, the coefficient of x is 5, the coefficient of y is −3 (because − 3y means + (−3)y), and the constant is 8. A variable on its own, such as y, has coefficient 1.",
      "项中与变量相乘的数叫做系数，不含变量的项叫做常数项。在 5x − 3y + 8 中，x 的系数是 5，y 的系数是 −3（因为 − 3y 就是 + (−3)y），常数项是 8。单独的变量（如 y）系数是 1。",
    ),
    ["identifying-terms-in-linear-expressions", "integers-and-opposites"],
    ["6.EE.A.2b"],
    [
      lesson(
        "finding-a-coefficient",
        ["Finding a coefficient", "找系数"],
        [
          [
            "The coefficient of a letter is the number that multiplies it, with the sign in front. $5x$ is $5$ groups of $x$, so its coefficient is $5$. A letter alone has coefficient $1$, and one with only a minus sign has coefficient $-1$. In $x + 4 - 7y$, the coefficient of $x$ is $1$ and the coefficient of $y$ is $-7$.",
            "字母的系数是与它相乘的数，连同前面的符号。$5x$ 是 $5$ 个 $x$，系数是 $5$。单独一个字母的系数是 $1$，只带负号的字母系数是 $-1$。在 $x + 4 - 7y$ 中，$x$ 的系数是 $1$，$y$ 的系数是 $-7$。",
          ],
          ["$x + 4 - 7y = 1x + 4 + (-7)y$, which shows both coefficients.", "$x + 4 - 7y = 1x + 4 + (-7)y$，两个系数一目了然。"],
          [
            "The minus sign belongs to the coefficient: in $x - 7y$ the coefficient of $y$ is $-7$, not $7$.",
            "负号属于系数：在 $x - 7y$ 中，$y$ 的系数是 $-7$，不是 $7$。",
          ],
        ],
        (rng) => {
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
            const n = rng.pick([1, 2, 3, 4, 5, 7]);
            coef = Q.of(n, rng.pick([2, 3, 4, 5].filter((d) => n % d !== 0)));
            e = `${coef.toLatex()}${v} ${c < 0 ? "-" : "+"} ${Math.abs(c)}`;
          } else {
            coef = Q.of(rng.int(2, 12));
            e = poly([c, ""], [coef, v], [rng.nonZero(-9, 9), u]);
          }
          const term = poly([coef, v]);
          const offs: Off[] = [
            [
              Q.of(c),
              `That is the constant term. It has no letter, so it is no coefficient of $${v}$.`,
              `这是常数项。它不含字母，不是 $${v}$ 的系数。`,
            ],
          ];
          if (coef.sign() < 0)
            offs.push([
              coef.abs(),
              "That drops the minus sign. The sign in front belongs to the coefficient.",
              "这丢了负号。前面的符号属于系数。",
            ]);
          if (coef.abs().eq(Q.one))
            offs.push([
              Q.of(0),
              `A letter alone is one of it: $${v}$ means $1${v}$, so its coefficient is not $0$.`,
              `单独的字母表示一个它：$${v}$ 就是 $1${v}$，系数不是 $0$。`,
            ]);
          return valued(
            [`What is the coefficient of $${v}$ in $${e}$?`, `$${e}$ 中 $${v}$ 的系数是多少？`],
            coef,
            [
              [
                ["Find the term", "找出这一项"],
                [`The term with $${v}$, with its sign, is $${term}$.`, `含 $${v}$ 的项（连同符号）是 $${term}$。`],
              ],
              [
                ["Read the number", "读出系数"],
                [`The number multiplying $${v}$ is $${coef.toLatex()}$.`, `与 $${v}$ 相乘的数是 $${coef.toLatex()}$。`],
              ],
            ],
            [`$${term} = ${coef.toLatex()} \\times ${v}$.`, `$${term} = ${coef.toLatex()} \\times ${v}$。`],
            offs,
          );
        },
        tapeFigure(
          [{ total: "5x", pieces: Array.from({ length: 5 }, () => ({ size: 1, text: "x" })) }],
          [
            "A bar of 5 pieces, each x: 5x is 5 groups of x, so the coefficient is 5.",
            "一个长条有 5 段，每段是 x：5x 是 5 个 x，系数是 5。",
          ],
        ),
      ),
      lesson(
        "finding-the-constant-term",
        ["Finding the constant term", "找常数项"],
        [
          [
            "The constant term is the term with no letter. Its sign belongs to it, because subtracting a number is adding its opposite. In $3x - 9$, the constant term is $-9$, since $3x - 9 = 3x + (-9)$.",
            "常数项是不含字母的项。它前面的符号属于它，因为减去一个数等于加上它的相反数。在 $3x - 9$ 中，常数项是 $-9$，因为 $3x - 9 = 3x + (-9)$。",
          ],
          [
            "For any $x$, $3x - 9$ is $9$ less than $3x$: for $x = 5$, $15 - 9 = 6$, and $15 + (-9) = 6$.",
            "不论 $x$ 是几，$3x - 9$ 都比 $3x$ 少 $9$：当 $x = 5$ 时，$15 - 9 = 6$，$15 + (-9) = 6$。",
          ],
          [
            "A constant has no letter. The $3$ in $3x$ is a coefficient, not the constant term.",
            "常数项不含字母。$3x$ 中的 $3$ 是系数，不是常数项。",
          ],
        ],
        (rng) => {
          const [u, v] = twoVars(rng);
          const c = rng.nonZero(-15, 15);
          const a = rng.int(2, 9);
          let b = rng.nonZero(-9, 9);
          if (b === c || b === -c) b = b > 0 ? b - 1 || 2 : b + 1 || -2;
          const terms: Term[] = rng.shuffle<Term>([
            [a, u],
            [b, v],
            [c, ""],
          ]);
          if ((terms[0]?.[0] ?? 0) < 0) terms.reverse();
          const e = exprLatex(terms);
          return valued(
            [`What is the constant term of $${e}$?`, `$${e}$ 的常数项是多少？`],
            c,
            [
              [
                ["Find the term with no letter", "找不含字母的项"],
                [`The only term without a letter is $${termLatex([c, ""])}$.`, `唯一不含字母的项是 $${termLatex([c, ""])}$。`],
              ],
              [
                ["Keep its sign", "带上符号"],
                [`So the constant term is $${c}$.`, `所以常数项是 $${c}$。`],
              ],
            ],
            [
              `Put $${u} = 0$ and $${v} = 0$: every letter term becomes $0$ and the expression equals $${c}$.`,
              `令 $${u} = 0$，$${v} = 0$：含字母的项都变成 $0$，代数式等于 $${c}$。`,
            ],
            [
              [-c, "That changes the sign. The sign in front belongs to the constant.", "这改变了符号。前面的符号属于常数项。"],
              [a, `That is the coefficient of $${u}$, which multiplies a letter.`, `这是 $${u}$ 的系数，它乘着字母。`],
              [b, `That is the coefficient of $${v}$, which multiplies a letter.`, `这是 $${v}$ 的系数，它乘着字母。`],
            ],
          );
        },
        tapeFigure(
          [
            {
              total: "3x",
              pieces: [
                { size: 3, text: "3x − 9" },
                { size: 3, text: "9", dashed: true },
              ],
            },
          ],
          [
            "A bar 3x with a piece of 9 cut off, leaving 3x − 9: the constant term is −9.",
            "长条 3x 去掉一段 9，剩下 3x − 9：常数项是 −9。",
          ],
        ),
      ),
    ],
  ),
  [
    "A phone plan costs $\\$12$ a month plus $\\$3$ for each gigabyte of data, so $g$ gigabytes cost $3g + 12$ dollars. The $3$ changes the bill with every gigabyte; the $12$ is paid no matter what.",
    "一个手机套餐每月 $\\$12$，每用一个 G 的流量再加 $\\$3$，所以用 $g$ 个 G 要 $3g + 12$ 美元。$3$ 随着每个 G 增加费用；$12$ 不管怎样都要付。",
  ],
  [
    "With no data, $g = 0$, the bill is $3 \\times 0 + 12 = 12$ dollars: just the constant.",
    "不用流量，$g = 0$，费用是 $3 \\times 0 + 12 = 12$ 美元：只剩常数项。",
  ],
  ["name the coefficient of each letter and the constant term, with their signs.", "说出每个字母的系数和常数项，连同它们的符号。"],
);

export const identifyingLikeTermsInLinearExpressions = withIntro(
  topic(
    "identifying-like-terms-in-linear-expressions",
    t("Identifying Like Terms in Linear Expressions", "识别一次式中的同类项"),
    t(
      "Like terms have exactly the same variable part, with the same exponent. 3x and −7x are like terms; 3x and 3y are not, and neither are 3x and 3x² or 3x and 3. All constants are like terms of each other.",
      "变量部分（包括指数）完全相同的项叫做同类项。3x 与 −7x 是同类项；3x 与 3y 不是，3x 与 3x²、3x 与 3 也不是。所有常数项都是同类项。",
    ),
    ["identifying-coefficients-and-constants"],
    ["6.EE.A.3"],
    [
      lesson(
        "a-like-term",
        ["Finding a like term", "找同类项"],
        [
          [
            "Like terms have exactly the same letter part; only the numbers in front may differ. A term like $5k$ must have the letter $k$ and nothing else: $-2k$ and $\\frac{1}{2}k$ are like it, but $5m$, $5k^2$ and $5$ are not.",
            "同类项的字母部分完全相同，只有前面的数可以不同。与 $5k$ 同类的项只能含字母 $k$：$-2k$、$\\frac{1}{2}k$ 是，$5m$、$5k^2$、$5$ 都不是。",
          ],
          [
            "Like terms can be joined into one: $5k + (-2k) = 3k$. $5k$ and $5m$ cannot.",
            "同类项可以合成一项：$5k + (-2k) = 3k$。$5k$ 与 $5m$ 不能合并。",
          ],
          [
            "The same number does not make terms alike. $5k$ and $5m$ share the $5$ but not the letter.",
            "数相同不等于同类项。$5k$ 与 $5m$ 的数相同，字母不同。",
          ],
        ],
        (rng) => {
          const [u, v] = twoVars(rng);
          const a = rng.int(2, 9);
          let b: number;
          do b = rng.nonZero(-9, 9);
          while (b === a || b === -a);
          const given = `${a}${u}`;
          const like = poly([b, u]);
          return chosenMath(
            rng,
            [`Which term is a like term of $${given}$?`, `哪一项与 $${given}$ 是同类项？`],
            like,
            [
              [`${a}${v}`, `It has the letter $${v}$, not $${u}$.`, `它的字母是 $${v}$，不是 $${u}$。`],
              [`${a}${u}^{2}`, `It has $${u}^{2}$. The exponent must be the same too.`, `它含 $${u}^{2}$。指数也必须相同。`],
              [`${a}`, "It has no letter: it is a constant.", "它不含字母，是常数项。"],
              [`${b}${u}${v}`, `It has two letters, $${u}${v}$, not just $${u}$.`, `它含两个字母 $${u}${v}$，不只是 $${u}$。`],
            ],
            [
              [
                ["Read the letter part", "看字母部分"],
                [`The letter part of $${given}$ is $${u}$.`, `$${given}$ 的字母部分是 $${u}$。`],
              ],
              [
                ["Match it", "找相同的"],
                [`$${like}$ also has exactly $${u}$.`, `$${like}$ 的字母部分也恰好是 $${u}$。`],
              ],
            ],
            [
              `They join into one term: $${given} + (${like}) = ${poly([a + b, u])}$.`,
              `它们能合成一项：$${given} + (${like}) = ${poly([a + b, u])}$。`,
            ],
          );
        },
        tapeFigure(
          [
            { pieces: Array.from({ length: 3 }, () => ({ size: 2, text: "x", lit: true })) },
            { pieces: Array.from({ length: 2 }, () => ({ size: 2, text: "x", lit: true })) },
            { pieces: Array.from({ length: 2 }, () => ({ size: 3, text: "y" })) },
          ],
          [
            "Three x pieces, then two x pieces of the same size: 3x and 2x are like terms. The y pieces have another size.",
            "三段 x，再两段同样大小的 x：3x 与 2x 是同类项。y 段的大小不同。",
          ],
        ),
      ),
      lesson(
        "like-terms-in-an-expression",
        ["Like terms in an expression", "代数式中的同类项"],
        [
          [
            "Like terms have exactly the same letter part; only their numbers may differ. Constants are like terms with each other. In $4x + 5y - 2 + 3x$, the terms $4x$ and $3x$ are like terms. $5y$ and $-2$ have no like terms.",
            "同类项是字母部分完全相同的项，只有数可以不同。常数项与常数项也是同类项。在 $4x + 5y - 2 + 3x$ 中，$4x$ 与 $3x$ 是同类项。$5y$ 和 $-2$ 没有同类项。",
          ],
          [
            "Sort the terms by letter part: $x$: $4x$, $3x$; $y$: $5y$; none: $-2$. Only the $x$ group has two terms.",
            "按字母部分分组：$x$：$4x$、$3x$；$y$：$5y$；不含字母：$-2$。只有 $x$ 组有两项。",
          ],
          [
            "Terms next to each other are not always alike. $4x$ and $5y$ sit side by side but have different letters.",
            "挨在一起的项不一定是同类项。$4x$ 与 $5y$ 挨着，但字母不同。",
          ],
        ],
        (rng) => {
          const [u, v] = twoVars(rng);
          const like = rng.pick([u, v, ""]);
          const others = [u, v, ""].filter((k) => k !== like);
          const p: Term = [rng.int(2, 9), like];
          let q: Term;
          do q = [rng.nonZero(-9, 9), like];
          while (q[0] === p[0]);
          const r: Term = [rng.nonZero(-9, 9), others[0] ?? u];
          const s: Term = [rng.nonZero(-9, 9), others[1] ?? v];
          const terms = rng.shuffle<Term>([p, q, r, s]);
          if ((terms[0]?.[0] ?? 0) < 0) terms.reverse();
          if ((terms[0]?.[0] ?? 0) < 0)
            terms.splice(
              0,
              0,
              ...terms.splice(
                terms.findIndex((x) => x[0] > 0),
                1,
              ),
            );
          const e = exprLatex(terms);
          const pair = (x: Term, y: Term): Pair => [`$${termLatex(x)}$ and $${termLatex(y)}$`, `$${termLatex(x)}$ 与 $${termLatex(y)}$`];
          const unlike = (x: Term, y: Term): Wrong => [
            pair(x, y),
            `$${termLatex(x)}$ has ${partOf(x)[0]} but $${termLatex(y)}$ has ${partOf(y)[0]}.`,
            `$${termLatex(x)}$ ${partOf(x)[1] === "不含字母" ? "不含字母" : `的${partOf(x)[1]}`}，而 $${termLatex(y)}$ ${partOf(y)[1] === "不含字母" ? "不含字母" : `的${partOf(y)[1]}`}。`,
          ];
          const shared: Pair =
            like === ""
              ? ["both have no letter: they are constants", "都不含字母，是常数项"]
              : [`both have the letter part $${like}$`, `的字母部分都是 $${like}$`];
          return chosen(
            rng,
            [`Which two terms of $${e}$ are like terms?`, `$${e}$ 中哪两项是同类项？`],
            pair(p, q),
            [unlike(p, r), unlike(r, s), unlike(q, s)],
            [
              [
                ["List the terms", "列出各项"],
                [
                  `The terms are ${terms.map((x) => `$${termLatex(x)}$`).join(", ")}.`,
                  `各项是 ${terms.map((x) => `$${termLatex(x)}$`).join("、")}。`,
                ],
              ],
              [
                ["Match the letter parts", "比较字母部分"],
                [`$${termLatex(p)}$ and $${termLatex(q)}$ ${shared[0]}.`, `$${termLatex(p)}$ 与 $${termLatex(q)}$ ${shared[1]}。`],
              ],
            ],
            [
              `They join into one term: $${poly(p, q)} = ${termLatex([p[0] + q[0], like]) || "0"}$.`,
              `它们能合成一项：$${poly(p, q)} = ${termLatex([p[0] + q[0], like]) || "0"}$。`,
            ],
          );
        },
        tapeFigure(
          [
            {
              pieces: [
                { size: 4, text: "4x", lit: true },
                { size: 3, text: "3x", lit: true },
              ],
            },
            { pieces: [{ size: 5, text: "5y" }] },
            { pieces: [{ size: 2, text: "−2" }] },
          ],
          [
            "The terms of 4x + 5y − 2 + 3x sorted by letter part: 4x and 3x in one row, 5y alone, −2 alone.",
            "把 4x + 5y − 2 + 3x 的项按字母部分分组：4x 和 3x 一行，5y 单独一行，−2 单独一行。",
          ],
        ),
      ),
    ],
  ),
  [
    "In a fruit basket there are $3$ apples, $2$ pears and $4$ more apples. Counting apples with apples, the basket holds $7$ apples and $2$ pears. Terms work the same way: $3a + 2p + 4a$ has like terms $3a$ and $4a$.",
    "果篮里有 $3$ 个苹果、$2$ 个梨，又放进 $4$ 个苹果。苹果和苹果一起数，篮里有 $7$ 个苹果、$2$ 个梨。项也是这样：$3a + 2p + 4a$ 中 $3a$ 与 $4a$ 是同类项。",
  ],
  ["$3a + 4a = 7a$, and $3$ apples and $4$ apples make $7$ apples.", "$3a + 4a = 7a$，$3$ 个苹果加 $4$ 个苹果是 $7$ 个苹果。"],
  [
    "tell which terms are like terms: the same letter part, with only the numbers different.",
    "判断哪些项是同类项：字母部分相同，只有数不同。",
  ],
);

/** coprimePair draws two different numbers with no common factor but 1. */
function coprimePair(rng: Rng): [number, number] {
  let p: number;
  let q: number;
  do {
    p = rng.int(1, 8);
    q = rng.int(2, 9);
  } while (p === q || gcd(p, q) !== 1);
  return [p, q];
}

export const theGreatestCommonFactorOfTwoLinearExpressions = withIntro(
  topic(
    "the-greatest-common-factor-of-two-linear-expressions",
    t("The Greatest Common Factor of Two Linear Expressions", "两个一次式的最大公因数"),
    t(
      "The greatest common factor of two terms is the largest expression that divides both. Find the GCF of the coefficients, and include a variable only if both terms have it: the GCF of 12x and 18x is 6x, while the GCF of 12x and 18 is 6.",
      "两项的最大公因数是能同时整除它们的最大的式子。先求系数的最大公因数，只有两项都含某个变量时才把这个变量写进去：12x 与 18x 的最大公因数是 6x，12x 与 18 的最大公因数是 6。",
    ),
    ["identifying-coefficients-and-constants", "greatest-common-factor-by-listing"],
    ["6.NS.B.4"],
    [
      lesson(
        "gcf-of-terms-with-the-same-variable",
        ["Terms with the same variable", "含相同变量的项"],
        [
          [
            "To find the greatest common factor of two terms with the same letter, find the GCF of the numbers and keep the shared letter. $12x = 6x \\cdot 2$ and $18x = 6x \\cdot 3$, and $2$ and $3$ share no factor but $1$, so the GCF is $6x$.",
            "求两个含相同字母的项的最大公因数，先求数的最大公因数，再带上相同的字母。$12x = 6x \\cdot 2$，$18x = 6x \\cdot 3$，$2$ 与 $3$ 除了 $1$ 没有公因数，所以最大公因数是 $6x$。",
          ],
          [
            "$12x \\div 6x = 2$ and $18x \\div 6x = 3$: both divide exactly, and nothing larger does.",
            "$12x \\div 6x = 2$，$18x \\div 6x = 3$：都能整除，再大的就不行了。",
          ],
          [
            "Keep the letter. Both $12x$ and $18x$ have a factor $x$, so the GCF is $6x$, not just $6$.",
            "别丢了字母。$12x$ 和 $18x$ 都有因数 $x$，所以最大公因数是 $6x$，不只是 $6$。",
          ],
        ],
        (rng) => {
          const v = pickVar(rng);
          const g = rng.int(2, 9);
          const [p, q] = coprimePair(rng);
          const a = g * p;
          const b = g * q;
          const small = [2, 3, 5, 7].find((s) => g % s === 0 && s < g);
          return expressed(
            [`Find the greatest common factor of $${a}${v}$ and $${b}${v}$.`, `求 $${a}${v}$ 与 $${b}${v}$ 的最大公因数。`],
            `${g}${v}`,
            [
              [
                ["The numbers", "先看数"],
                [`The GCF of $${a}$ and $${b}$ is $${g}$.`, `$${a}$ 与 $${b}$ 的最大公因数是 $${g}$。`],
              ],
              [
                ["The letter", "再看字母"],
                [`Both terms have the factor $${v}$, so keep it:`, `两项都有因数 $${v}$，要带上：`],
                [`${g}${v}`],
              ],
            ],
            [
              `$${a}${v} \\div ${g}${v} = ${p}$ and $${b}${v} \\div ${g}${v} = ${q}$, and $${p}$ and $${q}$ share no factor but $1$.`,
              `$${a}${v} \\div ${g}${v} = ${p}$，$${b}${v} \\div ${g}${v} = ${q}$，$${p}$ 与 $${q}$ 除了 $1$ 没有公因数。`,
            ],
            [
              [`${g}`, `That drops the letter. Both terms have the factor $${v}$.`, `这丢了字母。两项都有因数 $${v}$。`],
              [`${a * b}${v}`, "That multiplies the numbers. A common factor divides both terms.", "这是把数相乘。公因数要能整除两项。"],
              [
                `${g}${v}^{2}`,
                `Each term has only one factor of $${v}$, so the GCF cannot have $${v}^{2}$.`,
                `每项只有一个因数 $${v}$，最大公因数不能含 $${v}^{2}$。`,
              ],
              ...(small
                ? [
                    [
                      `${small}${v}`,
                      `$${small}${v}$ is a common factor, but not the greatest: $${g}${v}$ also divides both.`,
                      `$${small}${v}$ 是公因数，但不是最大的：$${g}${v}$ 也能整除两项。`,
                    ] as const,
                  ]
                : []),
            ],
          );
        },
        areaGridFigure(["6x"], ["2", "3"], [["12x", "18x"]], [1], [2, 3]),
      ),
      lesson(
        "gcf-when-a-variable-is-missing",
        ["When only one term has the variable", "只有一项含变量"],
        [
          [
            "A letter belongs in the GCF only if every term has it. $18$ has no factor $x$, so the GCF of $12x$ and $18$ is just the GCF of $12$ and $18$, which is $6$. The same holds when the terms have different letters, as $12x$ and $18y$.",
            "只有每一项都含某个字母，它才能写进最大公因数。$18$ 不含因数 $x$，所以 $12x$ 与 $18$ 的最大公因数就是 $12$ 与 $18$ 的最大公因数 $6$。两项字母不同（如 $12x$ 与 $18y$）时也一样。",
          ],
          [
            "$12x = 6 \\cdot 2x$ and $18 = 6 \\cdot 3$, and $2x$ and $3$ share no factor but $1$.",
            "$12x = 6 \\cdot 2x$，$18 = 6 \\cdot 3$，$2x$ 与 $3$ 除了 $1$ 没有公因数。",
          ],
          [
            "Do not write $6x$: $6x$ does not divide $18$, because $18$ has no $x$.",
            "不要写 $6x$：$6x$ 不能整除 $18$，因为 $18$ 不含 $x$。",
          ],
        ],
        (rng) => {
          const [u, v] = twoVars(rng);
          const g = rng.int(2, 9);
          const [p, q] = coprimePair(rng);
          const a = g * p;
          const b = g * q;
          const second = rng.bool() ? "" : v;
          const small = [2, 3, 5, 7].find((s) => g % s === 0 && s < g);
          return valued(
            [`Find the greatest common factor of $${a}${u}$ and $${b}${second}$.`, `求 $${a}${u}$ 与 $${b}${second}$ 的最大公因数。`],
            g,
            [
              [
                ["The letters", "先看字母"],
                second === ""
                  ? [`$${b}$ has no letter, so no letter is in the GCF.`, `$${b}$ 不含字母，所以最大公因数不含字母。`]
                  : [
                      `The letters differ, $${u}$ and $${v}$, so no letter is in the GCF.`,
                      `两项字母不同（$${u}$ 和 $${v}$），所以最大公因数不含字母。`,
                    ],
              ],
              [
                ["The numbers", "再看数"],
                [`The GCF of $${a}$ and $${b}$ is $${g}$.`, `$${a}$ 与 $${b}$ 的最大公因数是 $${g}$。`],
              ],
            ],
            [
              `$${a} \\div ${g} = ${p}$ and $${b} \\div ${g} = ${q}$, and $${p}$ and $${q}$ share no factor but $1$.`,
              `$${a} \\div ${g} = ${p}$，$${b} \\div ${g} = ${q}$，$${p}$ 与 $${q}$ 除了 $1$ 没有公因数。`,
            ],
            [
              [a * b, "That multiplies the numbers. A common factor divides both.", "这是把两个数相乘。公因数要能整除两个数。"],
              [
                Math.min(a, b),
                `$${Math.min(a, b)}$ does not divide $${Math.max(a, b)}$, so it is no common factor.`,
                `$${Math.min(a, b)}$ 不能整除 $${Math.max(a, b)}$，不是公因数。`,
              ],
              ...(small
                ? [
                    [
                      small,
                      `$${small}$ is a common factor, but not the greatest: $${g}$ also divides both.`,
                      `$${small}$ 是公因数，但不是最大的：$${g}$ 也能整除两个数。`,
                    ] as const,
                  ]
                : []),
            ],
          );
        },
        areaGridFigure(["6"], ["2x", "3"], [["12x", "18"]], [1], [2, 3]),
      ),
    ],
  ),
  [
    "A teacher has $12$ red pens and $18$ blue pens and wants to make identical packs with no pens left over. The largest number of packs is $6$, each with $2$ red and $3$ blue. Terms with letters share factors in the same way.",
    "老师有 $12$ 支红笔和 $18$ 支蓝笔，想分成完全相同的几包，不剩笔。最多能分 $6$ 包，每包 $2$ 支红笔、$3$ 支蓝笔。含字母的项也能这样找公因数。",
  ],
  [
    "$6 \\times 2 = 12$ and $6 \\times 3 = 18$, and $2$ and $3$ share no factor but $1$.",
    "$6 \\times 2 = 12$，$6 \\times 3 = 18$，$2$ 与 $3$ 除了 $1$ 没有公因数。",
  ],
  [
    "find the greatest common factor of two terms, keeping a letter only when both terms have it.",
    "求两项的最大公因数，只有两项都含某个字母时才带上它。",
  ],
);

// ---------------------------------------------------------------------------
// Equivalent expressions

export const simplifyingLinearExpressions = withIntro(
  topic(
    "simplifying-linear-expressions",
    t("Simplifying Linear Expressions", "化简一次式"),
    t(
      "To simplify an expression, combine like terms by adding or subtracting their coefficients: 7x + 5 − 3x + 2 = (7 − 3)x + (5 + 2) = 4x + 7. Unlike terms such as 4x and 7 cannot be combined.",
      "化简代数式时，把同类项的系数相加减来合并同类项：7x + 5 − 3x + 2 = (7 − 3)x + (5 + 2) = 4x + 7。像 4x 和 7 这样的非同类项不能合并。",
    ),
    ["identifying-like-terms-in-linear-expressions"],
    ["6.EE.A.3", "6.EE.A.4"],
    [
      lesson(
        "combining-like-terms-in-one-variable",
        ["One variable", "含一个变量"],
        [
          [
            "To simplify, combine like terms: add the numbers in front of the letter terms, and add the constants on their own. A letter alone counts as $1$ of it. In $6m + 4 + m - 1$, the $m$ terms give $6m + m = 7m$ and the constants give $4 - 1 = 3$, so the expression is $7m + 3$.",
            "化简时要合并同类项：把含字母的项前面的数相加，常数项另外相加。单独一个字母算作 $1$ 个。在 $6m + 4 + m - 1$ 中，$m$ 的项合并为 $6m + m = 7m$，常数合并为 $4 - 1 = 3$，所以结果是 $7m + 3$。",
          ],
          [
            "Try $m = 2$: $12 + 4 + 2 - 1 = 17$, and $7 \\times 2 + 3 = 17$.",
            "取 $m = 2$：$12 + 4 + 2 - 1 = 17$，而 $7 \\times 2 + 3 = 17$。",
          ],
          [
            "$7m$ and $3$ are not like terms, so $7m + 3$ is finished. Writing $10m$ joins a letter term with a number.",
            "$7m$ 与 $3$ 不是同类项，所以 $7m + 3$ 已经化简完了。写成 $10m$ 是把字母项和数合在一起了。",
          ],
        ],
        (rng) => {
          const v = pickVar(rng);
          const a = rng.int(2, 9);
          const c = rng.nonZero(-(a - 1), 9);
          const b = rng.int(2, 12);
          const dd = rng.nonZero(-(b - 1), 12);
          const k = b + dd;
          const e = poly([a, v], [b, ""], [c, v], [dd, ""]);
          const x = a + c;
          const answer = poly([x, v], [k, ""]);
          const terms: Term[] = [
            [a, v],
            [b, ""],
            [c, v],
            [dd, ""],
          ];
          const at = evaluateTerms(terms, { [v]: 2 });
          return expressed(
            [`Simplify $${e}$.`, `化简 $${e}$。`],
            answer,
            [
              [["Combine the letter terms", "合并含字母的项"], ["", ""], [`${poly([a, v], [c, v])} = ${poly([x, v])}`]],
              [["Combine the constants", "合并常数项"], ["", ""], [`${poly([b, ""], [dd, ""])} = ${k}`]],
              [["Write the result", "写出结果"], ["", ""], [`${e} = ${answer}`]],
            ],
            [
              `Try $${v} = 2$: the original gives $${at}$, and $${x} \\times 2 ${k < 0 ? "-" : "+"} ${Math.abs(k)} = ${2 * x + k}$.`,
              `取 $${v} = 2$：原式得 $${at}$，而 $${x} \\times 2 ${k < 0 ? "-" : "+"} ${Math.abs(k)} = ${2 * x + k}$。`,
            ],
            [
              [
                `${x + k}${v}`,
                "That joins the letter term and the constant. They are not like terms.",
                "这把字母项和常数项合在一起了。它们不是同类项。",
              ],
              [
                poly([a + Math.abs(c), v], [b + Math.abs(dd), ""]),
                "That ignores a minus sign. Subtracted terms take away.",
                "这忽略了负号。减去的项要减掉。",
              ],
              [
                `${a + b + c + dd}`,
                "That adds every number and drops the letter. Only like terms combine.",
                "这把所有数加起来，丢了字母。只有同类项才能合并。",
              ],
            ],
            { simplified: true },
          );
        },
        tapeFigure(
          [
            {
              total: "7m",
              pieces: [
                { size: 6, text: "6m" },
                { size: 1, text: "m", lit: true },
              ],
            },
            {
              total: "3",
              pieces: [
                { size: 3, text: "4 − 1" },
                { size: 1, text: "1", dashed: true },
              ],
            },
          ],
          [
            "The m pieces 6m and m join into 7m; the constants 4 and −1 make 3. So 6m + 4 + m − 1 = 7m + 3.",
            "m 的部分 6m 和 m 合成 7m；常数 4 和 −1 得 3。所以 6m + 4 + m − 1 = 7m + 3。",
          ],
        ),
      ),
      lesson(
        "combining-like-terms-in-two-variables",
        ["Two variables", "含两个变量"],
        [
          [
            "Combine the terms of each letter separately; terms with different letters stay apart. $5a + 2b - 3a + 4b = (5 - 3)a + (2 + 4)b = 2a + 6b$. The result has two terms because $a$ and $b$ are not like terms.",
            "每个字母的项分别合并；字母不同的项要分开。$5a + 2b - 3a + 4b = (5 - 3)a + (2 + 4)b = 2a + 6b$。$a$ 和 $b$ 不是同类项，所以结果有两项。",
          ],
          ["Try $a = 1$ and $b = 1$: $5 + 2 - 3 + 4 = 8$, and $2 + 6 = 8$.", "取 $a = 1$，$b = 1$：$5 + 2 - 3 + 4 = 8$，而 $2 + 6 = 8$。"],
          [
            "Do not join $2a$ and $6b$ into $8ab$. Different letters are not like terms.",
            "不要把 $2a$ 和 $6b$ 合成 $8ab$。字母不同就不是同类项。",
          ],
        ],
        (rng) => {
          const [u, v] = twoVars(rng);
          const a = rng.int(2, 9);
          const c = rng.nonZero(-(a - 1), 9);
          const b = rng.int(1, 9);
          let d = rng.nonZero(-9, 9);
          if (b + d === 0) d += d > 0 ? 1 : -1;
          const terms: Term[] = rng.bool()
            ? [
                [a, u],
                [b, v],
                [c, u],
                [d, v],
              ]
            : [
                [a, u],
                [b, v],
                [d, v],
                [c, u],
              ];
          const e = poly(...terms);
          const answer = poly([a + c, u], [b + d, v]);
          const at = evaluateTerms(terms, { [u]: 1, [v]: 2 });
          return expressed(
            [`Simplify $${e}$.`, `化简 $${e}$。`],
            answer,
            [
              [[`Combine the ${u} terms`, `合并 ${u} 的项`], ["", ""], [`${poly([a, u], [c, u])} = ${poly([a + c, u])}`]],
              [[`Combine the ${v} terms`, `合并 ${v} 的项`], ["", ""], [`${poly([b, v], [d, v])} = ${poly([b + d, v])}`]],
              [["Write the result", "写出结果"], ["The two kinds of term stay apart:", "两类项分开写："], [`${e} = ${answer}`]],
            ],
            [
              `Try $${u} = 1$, $${v} = 2$: the original gives $${at}$, and so does $${answer}$: $${a + c + 2 * (b + d)}$.`,
              `取 $${u} = 1$，$${v} = 2$：原式得 $${at}$，$${answer}$ 也得 $${a + c + 2 * (b + d)}$。`,
            ],
            [
              [
                `${a + b + c + d}${u}${v}`,
                "That joins unlike terms into one. Different letters stay apart.",
                "这把非同类项合成一项了。字母不同的项要分开。",
              ],
              [
                poly([a + c, u], [b - d, v]),
                `That takes $${d}${v}$ the wrong way: its sign was changed.`,
                `这把 $${d}${v}$ 的符号弄反了。`,
              ],
              [
                `${a + c + b + d}${u}`,
                `That puts the $${v}$ terms with the $${u}$ terms. They are not alike.`,
                `这把 $${v}$ 的项算进了 $${u}$ 的项。它们不是同类项。`,
              ],
            ],
            { simplified: true },
          );
        },
        tapeFigure(
          [
            {
              total: "2a",
              pieces: [
                { size: 5, text: "5a" },
                { size: 3, text: "−3a", dashed: true },
              ],
            },
            {
              total: "6b",
              pieces: [
                { size: 2, text: "2b", lit: true },
                { size: 4, text: "4b", lit: true },
              ],
            },
          ],
          [
            "The a terms 5a and −3a make 2a; the b terms 2b and 4b make 6b. They stay in two rows.",
            "a 的项 5a 与 −3a 得 2a；b 的项 2b 与 4b 得 6b。两行分开。",
          ],
        ),
      ),
    ],
  ),
  [
    "A shop counts its stock: $6$ boxes of pens, then $4$ loose erasers, then $1$ more box of pens, and $1$ eraser is sold. Counting like with like, the shop has $7$ boxes and $3$ erasers. With $m$ pens in a box, that is $7m + 3$ things.",
    "商店清点库存：$6$ 盒笔，$4$ 块散装橡皮，又来 $1$ 盒笔，卖掉 $1$ 块橡皮。同类和同类一起数，有 $7$ 盒笔、$3$ 块橡皮。每盒 $m$ 支笔，就是 $7m + 3$ 件。",
  ],
  [
    "With $m = 10$: $60 + 4 + 10 - 1 = 73$, and $7 \\times 10 + 3 = 73$.",
    "当 $m = 10$ 时：$60 + 4 + 10 - 1 = 73$，而 $7 \\times 10 + 3 = 73$。",
  ],
  ["simplify expressions by combining like terms, in one letter and in two.", "合并同类项来化简代数式，含一个字母或两个字母。"],
);

export const applyingTheDistributiveLawToLinearExpressions = withIntro(
  topic(
    "applying-the-distributive-law-to-linear-expressions",
    t("Applying the Distributive Law to Linear Expressions", "对一次式运用乘法分配律"),
    t(
      "The distributive law says a(b + c) = ab + ac: the number outside the parentheses multiplies every term inside. So 3(2x + 5) = 6x + 15, not 6x + 5, and 4(x − 2) = 4x − 8.",
      "乘法分配律：a(b + c) = ab + ac，括号外的数要乘括号内的每一项。所以 3(2x + 5) = 6x + 15，而不是 6x + 5；4(x − 2) = 4x − 8。",
    ),
    ["simplifying-linear-expressions"],
    ["6.EE.A.3"],
    [
      lesson(
        "expanding-parentheses",
        ["Expanding parentheses", "去括号"],
        [
          [
            "The distributive law says the number outside the parentheses multiplies every term inside. Multiply each term and keep its sign. $3(2x + 5) = 3 \\cdot 2x + 3 \\cdot 5 = 6x + 15$, and $5(3n - 2) = 15n - 10$.",
            "乘法分配律：括号外的数要乘括号里的每一项。每一项都乘，并保留它的符号。$3(2x + 5) = 3 \\cdot 2x + 3 \\cdot 5 = 6x + 15$，$5(3n - 2) = 15n - 10$。",
          ],
          [
            "The area model has sides $3$ and $2x + 5$; its two parts are $6x$ and $15$.",
            "面积模型的两边是 $3$ 和 $2x + 5$，两块面积是 $6x$ 和 $15$。",
          ],
          [
            "Multiply every term inside. $3(2x + 5)$ is not $6x + 5$: the $5$ is multiplied by $3$ too.",
            "括号里每一项都要乘。$3(2x + 5)$ 不是 $6x + 5$：$5$ 也要乘 $3$。",
          ],
        ],
        (rng) => {
          const v = pickVar(rng);
          const a = rng.int(2, 9);
          const b = rng.int(1, 6);
          const c = rng.nonZero(-9, 9);
          const constFirst = rng.bool(0.25);
          const inner = constFirst && c > 0 ? poly([c, ""], [b, v]) : poly([b, v], [c, ""]);
          const answer = poly([a * b, v], [a * c, ""]);
          return expressed(
            [`Use the distributive law to expand $${a}(${inner})$.`, `用乘法分配律展开 $${a}(${inner})$。`],
            answer,
            [
              [["Multiply the letter term", "乘含字母的项"], ["", ""], [`${a} \\cdot ${poly([b, v])} = ${poly([a * b, v])}`]],
              [
                ["Multiply the constant", "乘常数项"],
                [`Keep its sign:`, `保留它的符号：`],
                [`${a} \\cdot ${c < 0 ? `(${c})` : c} = ${a * c}`],
              ],
              [["Write the result", "写出结果"], ["", ""], [answer]],
            ],
            [
              `Try $${v} = 1$: $${a}(${b} ${c < 0 ? "-" : "+"} ${Math.abs(c)}) = ${a * (b + c)}$, and $${a * b} ${a * c < 0 ? "-" : "+"} ${Math.abs(a * c)} = ${a * b + a * c}$.`,
              `取 $${v} = 1$：$${a}(${b} ${c < 0 ? "-" : "+"} ${Math.abs(c)}) = ${a * (b + c)}$，而 $${a * b} ${a * c < 0 ? "-" : "+"} ${Math.abs(a * c)} = ${a * b + a * c}$。`,
            ],
            [
              [
                poly([a * b, v], [c, ""]),
                `That multiplies only the first term. The $${c}$ is multiplied by $${a}$ too.`,
                `这只乘了第一项。$${c}$ 也要乘 $${a}$。`,
              ],
              [
                poly([b, v], [a * c, ""]),
                `That multiplies only the constant. The $${poly([b, v])}$ is multiplied by $${a}$ too.`,
                `这只乘了常数项。$${poly([b, v])}$ 也要乘 $${a}$。`,
              ],
              [
                poly([a + b, v], [a * c, ""]),
                `That adds $${a}$ to the coefficient of $${v}$. Multiply it instead.`,
                `这是把 $${a}$ 加到 $${v}$ 的系数上。应该相乘。`,
              ],
            ],
            { simplified: true },
          );
        },
        areaGridFigure(["3"], ["2x", "5"], [["6x", "15"]], [1], [2, 1.4]),
      ),
      lesson(
        "expanding-and-combining",
        ["Expanding, then combining", "去括号后合并"],
        [
          [
            "When an expression has parentheses and other terms, expand the parentheses first, then combine like terms. $2(x + 3) + 4x = 2x + 6 + 4x = 6x + 6$.",
            "式子中既有括号又有其他项时，先用分配律去括号，再合并同类项。$2(x + 3) + 4x = 2x + 6 + 4x = 6x + 6$。",
          ],
          ["Try $x = 1$: $2 \\times 4 + 4 = 12$, and $6 + 6 = 12$.", "取 $x = 1$：$2 \\times 4 + 4 = 12$，而 $6 + 6 = 12$。"],
          [
            "Expand before combining. $2(x + 3) + 4x$ is not $2(5x + 3)$: the $4x$ is outside the parentheses and is not multiplied by $2$.",
            "先去括号再合并。$2(x + 3) + 4x$ 不是 $2(5x + 3)$：$4x$ 在括号外，不乘 $2$。",
          ],
        ],
        (rng) => {
          const v = pickVar(rng);
          const a = rng.int(2, 6);
          const c = rng.int(1, 9);
          const d = rng.int(2, 9);
          const constant = rng.bool(0.4);
          const e = constant ? `${a}(${v} + ${c}) + ${d}` : `${a}(${v} + ${c}) + ${d}${v}`;
          const answer = constant ? poly([a, v], [a * c + d, ""]) : poly([a + d, v], [a * c, ""]);
          const expanded = constant ? `${a}${v} + ${a * c} + ${d}` : `${a}${v} + ${a * c} + ${d}${v}`;
          const original = a * (1 + c) + d;
          return expressed(
            [`Simplify $${e}$.`, `化简 $${e}$。`],
            answer,
            [
              [
                ["Expand the parentheses", "去括号"],
                [`Multiply both terms inside by $${a}$:`, `用 $${a}$ 乘括号里的两项：`],
                [`${e} = ${expanded}`],
              ],
              [["Combine like terms", "合并同类项"], ["", ""], [`${expanded} = ${answer}`]],
            ],
            [
              `Try $${v} = 1$: $${a} \\times ${1 + c} + ${d} = ${original}$, and the result gives $${original}$ too.`,
              `取 $${v} = 1$：$${a} \\times ${1 + c} + ${d} = ${original}$，结果也得 $${original}$。`,
            ],
            constant
              ? [
                  [poly([a, v], [c + d, ""]), `That forgets to multiply $${c}$ by $${a}$.`, `这忘了把 $${c}$ 乘 $${a}$。`],
                  [
                    poly([a, v], [a * (c + d), ""]),
                    `That multiplies $${d}$ by $${a}$ too, but $${d}$ is outside the parentheses.`,
                    `这把 $${d}$ 也乘了 $${a}$，但 $${d}$ 在括号外。`,
                  ],
                ]
              : [
                  [poly([a + d, v], [c, ""]), `That forgets to multiply $${c}$ by $${a}$.`, `这忘了把 $${c}$ 乘 $${a}$。`],
                  [
                    poly([a * (1 + d), v], [a * c, ""]),
                    `That multiplies $${d}${v}$ by $${a}$ too, but it is outside the parentheses.`,
                    `这把 $${d}${v}$ 也乘了 $${a}$，但它在括号外。`,
                  ],
                ],
            { simplified: true },
          );
        },
        areaGridFigure(["2"], ["x", "3"], [["2x", "6"]], [1], [2, 1.4]),
      ),
    ],
  ),
  [
    "Three friends each buy a sandwich for $s$ dollars and a juice for $2$ dollars. The bill is $3(s + 2)$. It is also $3s + 6$: three sandwiches and three juices.",
    "三个朋友每人买一个 $s$ 美元的三明治和一瓶 $2$ 美元的果汁。总价是 $3(s + 2)$，也可以写成 $3s + 6$：三个三明治加三瓶果汁。",
  ],
  ["For $s = 5$: $3 \\times 7 = 21$, and $15 + 6 = 21$.", "当 $s = 5$ 时：$3 \\times 7 = 21$，而 $15 + 6 = 21$。"],
  ["multiply every term inside the parentheses, then combine like terms.", "用括号外的数乘括号里的每一项，再合并同类项。"],
);

export const factoringLinearExpressions = withIntro(
  topic(
    "factoring-linear-expressions",
    t("Factoring Linear Expressions", "一次式的因式分解"),
    t(
      "Factoring undoes the distributive law. Find the greatest common factor of the terms and write it outside the parentheses: 12x + 18 = 6(2x + 3). Check by expanding: 6 · 2x + 6 · 3 = 12x + 18. Factoring out a smaller common factor, as in 2(6x + 9), is not complete.",
      "因式分解是乘法分配律的逆运算。求出各项的最大公因数，写在括号外：12x + 18 = 6(2x + 3)。展开检验：6 · 2x + 6 · 3 = 12x + 18。只提出较小的公因数（如 2(6x + 9)）不算分解完全。",
    ),
    ["the-greatest-common-factor-of-two-linear-expressions", "applying-the-distributive-law-to-linear-expressions"],
    ["6.EE.A.3", "6.NS.B.4"],
    [
      lesson(
        "factoring-out-the-gcf",
        ["Factoring out the GCF", "提取最大公因数"],
        [
          [
            "Factoring undoes the distributive law. Find the GCF of all the terms, write it outside the parentheses, and divide each term by it to get what goes inside. $12x + 18$: the GCF of $12$ and $18$ is $6$, so $12x + 18 = 6(2x + 3)$.",
            "因式分解是分配律的逆运算。先求所有项的最大公因数，写在括号外面，再用它去除每一项，得到括号里的式子。$12x + 18$：$12$ 与 $18$ 的最大公因数是 $6$，所以 $12x + 18 = 6(2x + 3)$。",
          ],
          ["Expand back: $6 \\cdot 2x + 6 \\cdot 3 = 12x + 18$.", "展开回去：$6 \\cdot 2x + 6 \\cdot 3 = 12x + 18$。"],
          [
            "Take out the greatest factor. $2(6x + 9)$ is equal, but $6x$ and $9$ still share a $3$, so it is not finished.",
            "要提出最大公因数。$2(6x + 9)$ 也相等，但 $6x$ 和 $9$ 还有公因数 $3$，没有分解完。",
          ],
        ],
        (rng) => {
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
          const small = [2, 3, 5, 7].find((s) => g % s === 0 && s < g);
          return factored(
            [`Factor $${e}$ completely.`, `把 $${e}$ 因式分解完全。`],
            `${g}(${inner})`,
            [
              [
                ["Find the GCF", "求最大公因数"],
                [`The GCF of $${g * p}$ and $${Math.abs(g * q)}$ is $${g}$.`, `$${g * p}$ 与 $${Math.abs(g * q)}$ 的最大公因数是 $${g}$。`],
              ],
              [
                ["Divide each term", "每项除以它"],
                ["", ""],
                [`${poly([g * p, v])} \\div ${g} = ${poly([p, v])}`, `${g * q} \\div ${g} = ${q}`],
              ],
              [["Write the factors", "写出因式"], ["", ""], [`${e} = ${g}(${inner})`]],
            ],
            [
              `Expand back: $${g} \\cdot ${poly([p, v])} ${q < 0 ? "-" : "+"} ${g} \\cdot ${Math.abs(q)} = ${e}$.`,
              `展开回去：$${g} \\cdot ${poly([p, v])} ${q < 0 ? "-" : "+"} ${g} \\cdot ${Math.abs(q)} = ${e}$。`,
            ],
            [
              [
                `${g}(${poly([p, v], [g * q, ""])})`,
                `That divides only the letter term by $${g}$. The constant is divided too.`,
                `这只把字母项除以了 $${g}$。常数项也要除。`,
              ],
              ...(small
                ? [
                    [
                      `${small}(${poly([(g / small) * p, v], [(g / small) * q, ""])})`,
                      `$${small}$ is a common factor, but not the greatest: the terms inside still share a factor.`,
                      `$${small}$ 是公因数，但不是最大的：括号里的项还有公因数。`,
                    ] as const,
                  ]
                : []),
            ],
            areaGridFigure(["6"], ["2x", "3"], [["12x", "18"]], [1], [2, 1.4]),
          );
        },
        areaGridFigure(["6"], ["2x", "3"], [["12x", "18"]], [1], [2, 1.4]),
      ),
      lesson(
        "factoring-two-variable-expressions",
        ["Two variables", "含两个变量"],
        [
          [
            "Find the GCF of all the numbers. Divide every term by it, and do not drop a term that becomes $1$. $8a + 12b + 4$: the GCF of $8$, $12$ and $4$ is $4$, so $8a + 12b + 4 = 4(2a + 3b + 1)$.",
            "求所有数的最大公因数，用它去除每一项。某一项除完得 $1$ 时，这个 $1$ 不能丢。$8a + 12b + 4$：$8$、$12$、$4$ 的最大公因数是 $4$，所以 $8a + 12b + 4 = 4(2a + 3b + 1)$。",
          ],
          [
            "Expand back: $4 \\cdot 2a + 4 \\cdot 3b + 4 \\cdot 1 = 8a + 12b + 4$.",
            "展开回去：$4 \\cdot 2a + 4 \\cdot 3b + 4 \\cdot 1 = 8a + 12b + 4$。",
          ],
          [
            "$4 \\div 4 = 1$, so a $1$ stays inside. $4(2a + 3b)$ expands to $8a + 12b$ and loses the $4$.",
            "$4 \\div 4 = 1$，所以括号里留下 $1$。$4(2a + 3b)$ 展开是 $8a + 12b$，丢了 $4$。",
          ],
        ],
        (rng) => {
          const [u, v] = twoVars(rng);
          const g = rng.int(2, 9);
          let p: number;
          let q: number;
          let r: number;
          do {
            p = rng.int(1, 9);
            q = rng.int(1, 9);
            r = rng.bool() ? 0 : rng.int(1, 9);
          } while (gcd(gcd(p, q), r) !== 1 || (p === 1 && q === 1));
          const terms: Term[] = [
            [p, u],
            [q, v],
            [r, ""],
          ];
          const big: Term[] = terms.map(([c, x]) => [g * c, x]);
          const e = poly(...big);
          const inner = poly(...terms);
          const smalls = [2, 3, 5, 7].filter((k) => g % k === 0 && k < g).slice(0, 1);
          return factored(
            [`Factor $${e}$ completely.`, `把 $${e}$ 因式分解完全。`],
            `${g}(${inner})`,
            [
              [
                ["Find the GCF", "求最大公因数"],
                [`Every number is a multiple of $${g}$, and $${g}$ is their GCF.`, `每个数都是 $${g}$ 的倍数，$${g}$ 是它们的最大公因数。`],
              ],
              [
                ["Divide each term", "每项除以它"],
                ["", ""],
                big.filter(([c]) => c !== 0).map(([c, x], i) => `${poly([c, x])} \\div ${g} = ${poly(terms[i] ?? [0, ""])}`),
              ],
              [["Write the factors", "写出因式"], ["", ""], [`${e} = ${g}(${inner})`]],
            ],
            [`Expand back: $${g}(${inner}) = ${e}$, term by term.`, `逐项展开回去：$${g}(${inner}) = ${e}$。`],
            [
              [
                `${g}(${poly([p, u], [g * q, v], [g * r, ""])})`,
                `That divides only the first term by $${g}$. Every term is divided.`,
                `这只把第一项除以了 $${g}$。每一项都要除。`,
              ],
              ...smalls.map(
                (k) =>
                  [
                    `${k}(${poly([(g / k) * p, u], [(g / k) * q, v], [(g / k) * r, ""])})`,
                    `$${k}$ is a common factor, but not the greatest: the terms inside still share a factor.`,
                    `$${k}$ 是公因数，但不是最大的：括号里的项还有公因数。`,
                  ] as const,
              ),
              ...(r === 1
                ? [
                    [
                      `${g}(${poly([p, u], [q, v])})`,
                      `$${g} \\div ${g} = 1$, so a $1$ stays inside the parentheses.`,
                      `$${g} \\div ${g} = 1$，括号里要留下 $1$。`,
                    ] as const,
                  ]
                : []),
            ],
          );
        },
        areaGridFigure(["4"], ["2a", "3b", "1"], [["8a", "12b", "4"]], [1], [2, 2, 1]),
      ),
    ],
  ),
  [
    "A baker has $12$ muffins and $18$ cookies and packs them into $6$ equal boxes: each box gets $2$ muffins and $3$ cookies. In symbols, $12m + 18c = 6(2m + 3c)$.",
    "面包师有 $12$ 个松饼和 $18$ 块饼干，平均装进 $6$ 个盒子：每盒 $2$ 个松饼、$3$ 块饼干。用式子写，$12m + 18c = 6(2m + 3c)$。",
  ],
  [
    "$6$ boxes of $2$ muffins make $12$, and $6$ boxes of $3$ cookies make $18$.",
    "$6$ 盒、每盒 $2$ 个松饼是 $12$ 个；$6$ 盒、每盒 $3$ 块饼干是 $18$ 块。",
  ],
  ["take the greatest common factor out of every term and check by expanding.", "从每一项中提出最大公因数，再展开检验。"],
);

export const identifyingEquivalentExpressions = withIntro(
  topic(
    "identifying-equivalent-expressions",
    t("Identifying Equivalent Expressions", "识别等价的代数式"),
    t(
      "Two expressions are equivalent when they have the same value for every value of the variable. To decide, simplify both: 3(x + 2) + x and 4x + 6 are equivalent because 3(x + 2) + x = 3x + 6 + x = 4x + 6. One value that gives different results shows that two expressions are not equivalent.",
      "如果两个代数式对变量的每个值都相等，它们就是等价的。判断时把两个都化简：3(x + 2) + x 与 4x + 6 等价，因为 3(x + 2) + x = 3x + 6 + x = 4x + 6。只要有一个值使结果不同，两个代数式就不等价。",
    ),
    ["factoring-linear-expressions"],
    ["6.EE.A.4"],
    [
      lesson(
        "choosing-an-equivalent-expression",
        ["Choosing an equivalent expression", "选出等价的代数式"],
        [
          [
            "Equivalent expressions have the same value for every value of the letter. To find one, write both in the same form, for example by expanding and combining. $4(2m + 3) = 8m + 12$, which can also be written $12 + 8m$ or $2(4m + 6)$.",
            "等价的代数式对字母的任何值都相等。判断时把它们化成同一种形式，比如去括号并合并同类项。$4(2m + 3) = 8m + 12$，也可以写成 $12 + 8m$ 或 $2(4m + 6)$。",
          ],
          ["Try $m = 1$: $4 \\times 5 = 20$, and $8 + 12 = 20$.", "取 $m = 1$：$4 \\times 5 = 20$，而 $8 + 12 = 20$。"],
          [
            "$8m + 3$ is not equivalent to $4(2m + 3)$: the $3$ was not multiplied by $4$.",
            "$8m + 3$ 与 $4(2m + 3)$ 不等价：$3$ 没有乘 $4$。",
          ],
        ],
        (rng) => {
          const v = pickVar(rng);
          const a = rng.int(2, 6);
          const b = rng.int(1, 5);
          const c = rng.int(1, 9);
          const given = `${a}(${poly([b, v])} + ${c})`;
          const expanded = `${poly([a * b, v])} + ${a * c}`;
          const correct = rng.pick([`${a * c} + ${poly([a * b, v])}`, expanded]);
          return chosenMath(
            rng,
            [`Which expression is equivalent to $${given}$?`, `哪个代数式与 $${given}$ 等价？`],
            correct,
            [
              [`${poly([a * b, v])} + ${c}`, `The $${c}$ was not multiplied by $${a}$.`, `$${c}$ 没有乘 $${a}$。`],
              [`${poly([b, v])} + ${a * c}`, `The $${poly([b, v])}$ was not multiplied by $${a}$.`, `$${poly([b, v])}$ 没有乘 $${a}$。`],
              [
                `${poly([a + b, v])} + ${a * c}`,
                `That adds $${a}$ to the coefficient of $${v}$ instead of multiplying.`,
                `这是把 $${a}$ 加到 $${v}$ 的系数上，而不是相乘。`,
              ],
              [
                `${a * b + a * c}${v}`,
                "That joins a letter term and a constant, which are not like terms.",
                "这把字母项和常数项合在一起了，它们不是同类项。",
              ],
            ],
            [
              [["Expand", "去括号"], [`Multiply both terms by $${a}$:`, `两项都乘 $${a}$：`], [`${given} = ${expanded}`]],
              [
                ["Compare", "比较"],
                [
                  `$${correct}$ has the same two terms${correct === expanded ? "" : " in another order"}.`,
                  `$${correct}$ 的两项相同${correct === expanded ? "" : "，只是顺序不同"}。`,
                ],
              ],
            ],
            [
              `Try $${v} = 1$: $${a} \\times ${b + c} = ${a * (b + c)}$, and $${correct}$ gives $${a * b + a * c}$.`,
              `取 $${v} = 1$：$${a} \\times ${b + c} = ${a * (b + c)}$，$${correct}$ 也得 $${a * b + a * c}$。`,
            ],
          );
        },
        areaGridFigure(["4"], ["2m", "3"], [["8m", "12"]], [1], [2, 1.4]),
      ),
      lesson(
        "deciding-whether-expressions-are-equivalent",
        ["Are they equivalent?", "它们等价吗？"],
        [
          [
            "Simplify both expressions and compare. If they differ, putting in a value shows it. Is $2(x + 5) + 3x$ equivalent to $5x + 5$? Simplify: $2x + 10 + 3x = 5x + 10$, which is not $5x + 5$.",
            "把两个式子都化简再比较。如果不同，代入一个值就能看出来。$2(x + 5) + 3x$ 与 $5x + 5$ 等价吗？化简：$2x + 10 + 3x = 5x + 10$，不是 $5x + 5$。",
          ],
          ["Try $x = 0$: $2(0 + 5) + 0 = 10$, but $5 \\times 0 + 5 = 5$.", "取 $x = 0$：$2(0 + 5) + 0 = 10$，而 $5 \\times 0 + 5 = 5$。"],
          [
            "One value that agrees is not enough to say yes; it takes simplifying. But one value that disagrees is enough to say no.",
            "一个值相等不能说明等价，要化简才行。但只要一个值不相等，就能说明不等价。",
          ],
        ],
        (rng) => {
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
          const at0 = a * c;
          const rightAt0 = (() => {
            const m = right.match(/([+-]) (\d+)$/);
            return m ? Number(m[2]) * (m[1] === "-" ? -1 : 1) : at0;
          })();
          return decided(
            rng,
            [`Are $${left}$ and $${right}$ equivalent expressions?`, `$${left}$ 与 $${right}$ 是等价的代数式吗？`],
            same,
            [
              [["Simplify the first", "化简第一个"], ["", ""], [`${left} = ${a}${v} + ${a * c} + ${d}${v} = ${simplified}`]],
              [
                ["Compare", "比较"],
                same
                  ? [`This is the same as $${right}$, so they are equivalent.`, `这与 $${right}$ 相同，所以它们等价。`]
                  : [`This is not the same as $${right}$, so they are not equivalent.`, `这与 $${right}$ 不同，所以它们不等价。`],
              ],
            ],
            same
              ? [
                  `Try $${v} = 1$: $${a} \\times ${1 + c} + ${d} = ${a * (1 + c) + d}$, and $${right}$ gives $${a + d + a * c}$ too.`,
                  `取 $${v} = 1$：$${a} \\times ${1 + c} + ${d} = ${a * (1 + c) + d}$，$${right}$ 也得 $${a + d + a * c}$。`,
                ]
              : [
                  `Try $${v} = 0$: the first gives $${at0}$, but $${right}$ gives $${rightAt0}$.`,
                  `取 $${v} = 0$：第一个得 $${at0}$，而 $${right}$ 得 $${rightAt0}$。`,
                ],
            same
              ? ["Both simplify to the same expression, so they agree for every value.", "两个式子化简后完全相同，所以对每个值都相等。"]
              : ["Simplifying gives different expressions, and they give different values.", "化简后的式子不同，代入的值也不同。"],
          );
        },
        areaGridFigure(["2"], ["x", "5"], [["2x", "10"]], [1], [2, 1.4]),
      ),
    ],
  ),
  [
    "Two friends work out the cost of $3$ packs of $x$ stickers plus $2$ loose ones. One writes $3x + 2$; the other counts pack by pack and writes $x + x + x + 2$. Both always give the same number.",
    "两个朋友算 $3$ 包、每包 $x$ 张贴纸，再加 $2$ 张散的。一个写 $3x + 2$；另一个一包一包地数，写成 $x + x + x + 2$。两个式子总是得同样的数。",
  ],
  [
    "For $x = 10$: $3 \\times 10 + 2 = 32$, and $10 + 10 + 10 + 2 = 32$.",
    "当 $x = 10$ 时：$3 \\times 10 + 2 = 32$，而 $10 + 10 + 10 + 2 = 32$。",
  ],
  [
    "decide whether two expressions are equivalent by simplifying them, and show they are not with one value.",
    "通过化简判断两个代数式是否等价，并用一个值说明它们不等价。",
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
