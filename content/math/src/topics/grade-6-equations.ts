import type { Figure, KnowledgePointDef, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, type PlaneMark, plane, Q, relSymbol } from "@ga/subject-math";
import { gradeDrawings3 } from "../explanation-drawings-grades-3.ts";

import { type InequalityOp, inequalityLatex } from "../problems.ts";
import { numberLineFigure, ray } from "./compound-inequalities.ts";
import { type MathWrong, type Pair, tableFigure, type Walk, type Wrong } from "./early-grades-more-kit.ts";
import {
  bounded,
  chosen,
  chosenMath,
  decided,
  drawn,
  type Edge,
  expressed,
  lesson,
  type Off,
  type Said,
  valued,
  withIntro,
} from "./grade-6-kit.ts";
import { equalTape, lineFigure, tapeFigure } from "./upper-grades-kit.ts";

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

/** undone writes the two steps of a one-step equation: undo the operation on both sides, then work out the value. */
function undone(title: Pair, said: Pair, line: string, result: string): Walk[] {
  return [
    [title, said, [line]],
    [["Work it out", "算出结果"], ["", ""], [result]],
  ];
}

/** putBack checks a solution by putting it back into the equation. */
const putBack = (v: string, s: string, sum: string): Pair => [
  `Put $${v} = ${s}$ back into the equation: $${sum}$.`,
  `把 $${v} = ${s}$ 代回原方程：$${sum}$。`,
];

// ---------------------------------------------------------------------------
// Solutions of equations

export const identifyingSolutionsToLinearEquations = withIntro(
  topic(
    "identifying-solutions-to-linear-equations",
    t("Identifying Solutions to Linear Equations", "判断一次方程的解"),
    t(
      "An equation says that two expressions are equal. A solution is a value of the variable that makes the equation true. To check a value, substitute it and see whether both sides are equal: x = 4 is a solution of 3x + 2 = 14 because 3 × 4 + 2 = 14, but x = 5 is not, because 3 × 5 + 2 = 17.",
      "方程表示两个式子相等。使方程成立的变量的值叫做方程的解。检验一个值时，把它代入方程，看两边是否相等：x = 4 是 3x + 2 = 14 的解，因为 3 × 4 + 2 = 14；x = 5 不是，因为 3 × 5 + 2 = 17。",
    ),
    ["evaluating-linear-expressions"],
    ["6.EE.B.5"],
    [
      lesson(
        "checking-a-value",
        ["Checking a value", "检验一个值"],
        [
          [
            "A solution is a value of the letter that makes the equation true. To test a value, put it in place of the letter, work out the left side, and compare it with the right side. For $4n - 5 = 19$ and $n = 6$: $4 \\times 6 - 5 = 24 - 5 = 19$, the same as the right side, so $n = 6$ is a solution.",
            "方程的解是使等式成立的字母的值。检验一个值时，用它代替字母，算出左边，再和右边比较。对于 $4n - 5 = 19$ 和 $n = 6$：$4 \\times 6 - 5 = 24 - 5 = 19$，和右边相等，所以 $n = 6$ 是方程的解。",
          ],
          [
            "Work backwards from $19$: add $5$ to get $24$, then divide by $4$ to get $6$.",
            "从 $19$ 倒推：加上 $5$ 得 $24$，再除以 $4$ 得 $6$。",
          ],
          [
            "Work out the whole left side before comparing. $4 \\times 6 = 24$ is not the left side yet: the $- 5$ still has to be done.",
            "要把左边全部算完再比较。$4 \\times 6 = 24$ 还不是左边的值，还要再减 $5$。",
          ],
        ],
        (rng) => {
          const v = pickVar(rng);
          const a = rng.int(2, 9);
          const b = rng.int(1, 20);
          const s = rng.int(1, 12);
          const minus = rng.bool() && a * s > b;
          const sign = minus ? "-" : "+";
          const c = minus ? a * s - b : a * s + b;
          const test = rng.bool() ? s : s + rng.pick(s > 1 ? [-1, 1, 2] : [1, 2]);
          const value = minus ? a * test - b : a * test + b;
          const yes = value === c;
          return decided(
            rng,
            [
              `Is $${v} = ${test}$ a solution of $${a}${v} ${sign} ${b} = ${c}$?`,
              `$${v} = ${test}$ 是 $${a}${v} ${sign} ${b} = ${c}$ 的解吗？`,
            ],
            yes,
            [
              [
                ["Substitute", "代入"],
                [`Put $${test}$ in place of $${v}$:`, `用 $${test}$ 代替 $${v}$：`],
                [`${a} \\times ${test} ${sign} ${b} = ${a * test} ${sign} ${b} = ${value}`],
              ],
              [
                ["Compare the sides", "比较两边"],
                yes
                  ? [
                      `The left side is $${value}$ and the right side is $${c}$. They are equal, so $${v} = ${test}$ is a solution.`,
                      `左边是 $${value}$，右边是 $${c}$，两边相等，所以 $${v} = ${test}$ 是方程的解。`,
                    ]
                  : [
                      `The left side is $${value}$ but the right side is $${c}$, so $${v} = ${test}$ is not a solution.`,
                      `左边是 $${value}$，右边却是 $${c}$，所以 $${v} = ${test}$ 不是方程的解。`,
                    ],
              ],
            ],
            [
              `Work backwards from $${c}$: ${minus ? "add" : "take away"} $${b}$ to get $${a * s}$, then divide by $${a}$ to get $${s}$. The solution is $${s}$, ${yes ? "the value we tested" : `not $${test}$`}.`,
              `从 $${c}$ 倒推：${minus ? "加上" : "减去"} $${b}$ 得 $${a * s}$，再除以 $${a}$ 得 $${s}$。方程的解是 $${s}$，${yes ? "正是检验的这个值" : `不是 $${test}$`}。`,
            ],
            yes
              ? [`Both sides come out as $${c}$, so the equation is true for $${v} = ${test}$.`, `代入后两边都是 $${c}$，等式成立。`]
              : [
                  `Putting in $${test}$ gives $${value}$, not $${c}$. A solution must make both sides equal.`,
                  `代入 $${test}$ 得 $${value}$，不是 $${c}$。解必须使两边相等。`,
                ],
          );
        },
        tapeFigure(
          [
            {
              total: "14",
              pieces: [
                { size: 4, text: "x" },
                { size: 4, text: "x" },
                { size: 4, text: "x" },
                { size: 2, text: "2", lit: true },
              ],
            },
          ],
          [
            "A bar of 14 made of three pieces x and a piece 2. With x = 4, the pieces are 4 + 4 + 4 + 2 = 14.",
            "总长 14 的长条由三段 x 和一段 2 组成。x = 4 时，4 + 4 + 4 + 2 = 14。",
          ],
        ),
      ),
      lesson(
        "choosing-the-solution",
        ["Choosing the solution from a list", "从几个值中选出解"],
        [
          [
            "To find the solution in a list, put each value into the equation in turn and keep the one that makes both sides equal. Which of $2, 3, 4, 5$ solves $5(x - 1) = 15$? The left side comes out as $5, 10, 15, 20$, so only $x = 4$ works.",
            "要从几个数中找出方程的解，就把它们一个一个代入，留下使两边相等的那个。$2, 3, 4, 5$ 中哪个是 $5(x - 1) = 15$ 的解？左边分别得 $5, 10, 15, 20$，所以只有 $x = 4$ 符合。",
          ],
          ["Work backwards: $15 \\div 5 = 3$, and $3 + 1 = 4$.", "倒推：$15 \\div 5 = 3$，$3 + 1 = 4$。"],
          [
            "Work inside the brackets first. For $x = 4$, $5(4 - 1) = 5 \\times 3$, not $5 \\times 4 - 1$.",
            "先算括号里面。$x = 4$ 时，$5(4 - 1) = 5 \\times 3$，不是 $5 \\times 4 - 1$。",
          ],
        ],
        (rng) => {
          const v = pickVar(rng);
          const a = rng.int(2, 9);
          const b = rng.int(1, 9);
          const s = rng.int(b + 1, b + 9);
          const grouped = rng.bool();
          const left = grouped ? `${a}(${v} - ${b})` : `${a}${v} - ${b}`;
          const value = (o: number) => (grouped ? a * (o - b) : a * o - b);
          const shown = (o: number) => (grouped ? `${a}(${o} - ${b})` : `${a} \\times ${o} - ${b}`);
          const c = value(s);
          const others = [s - 1, s + 1, s + 2, s - 2].filter((o) => o > b).slice(0, 3);
          return chosenMath(
            rng,
            [`Which value of $${v}$ is a solution of $${left} = ${c}$?`, `$${v}$ 取哪个值时是 $${left} = ${c}$ 的解？`],
            String(s),
            others.map(
              (o): MathWrong => [
                String(o),
                `$${v} = ${o}$ makes the left side $${value(o)}$, not $${c}$.`,
                `$${v} = ${o}$ 使左边等于 $${value(o)}$，不是 $${c}$。`,
              ],
            ),
            [
              [
                ["Try each value", "逐个代入"],
                ["Work out the left side for each choice:", "对每个选项算出左边："],
                [...others, s].sort((x, y) => x - y).map((o) => `${shown(o)} = ${value(o)}`),
              ],
              [
                ["Pick the match", "找出相等的"],
                [`Only $${v} = ${s}$ gives $${c}$.`, `只有 $${v} = ${s}$ 得到 $${c}$。`],
              ],
            ],
            grouped
              ? [
                  `Work backwards: $${c} \\div ${a} = ${s - b}$, and $${s - b} + ${b} = ${s}$.`,
                  `倒推：$${c} \\div ${a} = ${s - b}$，$${s - b} + ${b} = ${s}$。`,
                ]
              : [
                  `Work backwards: $${c} + ${b} = ${a * s}$, and $${a * s} \\div ${a} = ${s}$.`,
                  `倒推：$${c} + ${b} = ${a * s}$，$${a * s} \\div ${a} = ${s}$。`,
                ],
          );
        },
        tableFigure(["x = 2", "x = 3", "x = 4", "x = 5"], [5, 10, 15, 20]),
      ),
    ],
  ),
  [
    "Mia thinks of a number. She multiplies it by $3$, adds $2$, and gets $14$: $3x + 2 = 14$. Her friend guesses that the number is $4$.",
    "Mia 想了一个数，把它乘 $3$ 再加 $2$，得到 $14$：$3x + 2 = 14$。她的朋友猜这个数是 $4$。",
  ],
  ["$3 \\times 4 + 2 = 12 + 2 = 14$, so the guess is right.", "$3 \\times 4 + 2 = 12 + 2 = 14$，所以猜对了。"],
  [
    "test whether a value is a solution by putting it into the equation, and pick the solution from a list.",
    "把一个值代入方程，判断它是不是解，并从几个值中选出解。",
  ],
);

// ---------------------------------------------------------------------------
// One-step equations

export const oneStepAdditionEquations = withIntro(
  topic(
    "one-step-addition-equations",
    t("One-Step Addition Equations", "一步加法方程"),
    t(
      "To solve x + a = b, undo the addition by subtracting a from both sides: x + 7 = 15 gives x = 15 − 7 = 8. Subtracting the same number from both sides keeps the equation balanced.",
      "解 x + a = b 时，在两边同时减去 a 来抵消加法：x + 7 = 15，得 x = 15 − 7 = 8。两边减去同一个数，等式仍然成立。",
    ),
    ["identifying-solutions-to-linear-equations"],
    ["6.EE.B.7"],
    [
      lesson(
        "whole-numbers",
        ["Whole numbers", "整数"],
        [
          [
            "To solve an equation, get the letter alone. Undo what was done to it, and do the same to both sides so they stay equal. Subtraction undoes addition: for $x + 12 = 30$, subtract $12$ from both sides, so $x = 30 - 12 = 18$.",
            "解方程就是让字母单独留在一边。用逆运算抵消字母经历的运算，两边做同样的运算，等式才保持成立。减法是加法的逆运算：$x + 12 = 30$，两边同时减去 $12$，得 $x = 30 - 12 = 18$。",
          ],
          ["$18 + 12 = 30$, so $x = 18$ makes the equation true.", "$18 + 12 = 30$，所以 $x = 18$ 使方程成立。"],
          [
            "Subtract the number that was added. Adding it again gives $30 + 12 = 42$, and $42 + 12$ is not $30$.",
            "要减去加上的那个数。再加一次得 $30 + 12 = 42$，而 $42 + 12$ 不等于 $30$。",
          ],
        ],
        (rng) => {
          const v = pickVar(rng);
          const a = rng.int(2, 60);
          const s = rng.int(1, 80);
          const b = s + a;
          const eq = rng.bool(0.7) ? `${v} + ${a} = ${b}` : `${a} + ${v} = ${b}`;
          return valued(
            [`Solve $${eq}$.`, `解方程 $${eq}$。`],
            s,
            undone(
              ["Undo the addition", "抵消加法"],
              [`Subtract $${a}$ from both sides:`, `两边同时减去 $${a}$：`],
              `${v} = ${b} - ${a}`,
              `${v} = ${s}`,
            ),
            putBack(v, String(s), `${s} + ${a} = ${b}`),
            [
              [
                a + b,
                `That adds $${a}$ again. To undo adding $${a}$, subtract it.`,
                `这是又加了 $${a}$。要抵消加 $${a}$，应该减去 $${a}$。`,
              ],
              [
                a - b,
                `That is $${a} - ${b}$, the wrong way round. Take $${a}$ away from $${b}$.`,
                `这是 $${a} - ${b}$，减反了。应该用 $${b}$ 减去 $${a}$。`,
              ],
              [b, `That is the right side as it stands. The $${a}$ still has to be taken away.`, `这是右边原来的数，还没有减去 $${a}$。`],
            ],
            { solveFor: v },
          );
        },
        tapeFigure(
          [
            {
              total: "30",
              pieces: [
                { size: 18, text: "x" },
                { size: 12, text: "12", lit: true },
              ],
            },
          ],
          ["A bar of 30 made of x and 12. Taking away the 12 leaves x = 18.", "总长 30 的长条由 x 和 12 组成。去掉 12，剩下 x = 18。"],
        ),
      ),
      lesson(
        "decimals-and-fractions",
        ["Decimals and fractions", "小数和分数"],
        [
          [
            "Decimals and fractions are solved the same way: subtract the added number from both sides. Line up the decimal points, and give fractions a common denominator. $x + 2.6 = 7.1$ gives $x = 7.1 - 2.6 = 4.5$, and $x + \\frac{1}{4} = \\frac{5}{6}$ gives $x = \\frac{10}{12} - \\frac{3}{12} = \\frac{7}{12}$.",
            "有小数和分数时方法一样：两边同时减去加上的那个数。小数要对齐小数点，分数要先通分。$x + 2.6 = 7.1$，得 $x = 7.1 - 2.6 = 4.5$；$x + \\frac{1}{4} = \\frac{5}{6}$，得 $x = \\frac{10}{12} - \\frac{3}{12} = \\frac{7}{12}$。",
          ],
          [
            "$4.5 + 2.6 = 7.1$, and $\\frac{7}{12} + \\frac{3}{12} = \\frac{10}{12} = \\frac{5}{6}$.",
            "$4.5 + 2.6 = 7.1$，$\\frac{7}{12} + \\frac{3}{12} = \\frac{10}{12} = \\frac{5}{6}$。",
          ],
          [
            "Subtract fractions over a common denominator. Subtracting tops and bottoms separately, $\\frac{5 - 1}{6 - 4} = \\frac{4}{2}$, is wrong.",
            "分数相减要先通分。分子减分子、分母减分母，$\\frac{5 - 1}{6 - 4} = \\frac{4}{2}$，是错的。",
          ],
        ],
        (rng) => {
          const v = pickVar(rng);
          const decimal = rng.bool();
          const a = decimal ? tenths(rng, 1, 20) : smallFraction(rng);
          const s = decimal ? tenths(rng, 1, 20) : smallFraction(rng);
          const b = s.add(a);
          const [A, B, S] = [show(a, decimal), show(b, decimal), show(s, decimal)];
          return valued(
            [`Solve $${v} + ${A} = ${B}$.`, `解方程 $${v} + ${A} = ${B}$。`],
            s,
            undone(
              ["Undo the addition", "抵消加法"],
              [`Subtract $${A}$ from both sides:`, `两边同时减去 $${A}$：`],
              `${v} = ${B} - ${A}`,
              `${v} = ${S}`,
            ),
            putBack(v, S, `${S} + ${A} = ${B}`),
            [
              [a.add(b), `That adds $${A}$ again. To undo adding it, subtract it.`, `这是又加了 $${A}$。要抵消加法，应该减去它。`],
              [
                a.sub(b),
                `That is $${A} - ${B}$, the wrong way round. Take $${A}$ away from $${B}$.`,
                `这是 $${A} - ${B}$，减反了。应该用 $${B}$ 减去 $${A}$。`,
              ],
              [b, `That is the right side as it stands. The $${A}$ still has to be taken away.`, `这是右边原来的数，还没有减去 $${A}$。`],
            ],
            { solveFor: v, ...(decimal && { form: "decimal" as const }) },
          );
        },
        tapeFigure(
          [
            {
              total: "7.1",
              pieces: [
                { size: 45, text: "x" },
                { size: 26, text: "2.6", lit: true },
              ],
            },
          ],
          [
            "A bar of 7.1 made of x and 2.6. Taking away the 2.6 leaves x = 4.5.",
            "总长 7.1 的长条由 x 和 2.6 组成。去掉 2.6，剩下 x = 4.5。",
          ],
        ),
      ),
    ],
  ),
  [
    "A bag of apples and a $12$ kg weight balance $30$ kg on a scale: $x + 12 = 30$. Take $12$ kg off each side, and the scale still balances.",
    "天平一边放一袋苹果和一个 $12$ 千克的砝码，另一边放 $30$ 千克，天平平衡：$x + 12 = 30$。两边各拿走 $12$ 千克，天平仍然平衡。",
  ],
  ["$30 - 12 = 18$, and $18 + 12 = 30$, so the apples weigh $18$ kg.", "$30 - 12 = 18$，而 $18 + 12 = 30$，所以苹果重 $18$ 千克。"],
  [
    "solve $x + a = b$ by subtracting $a$ from both sides, with whole numbers, decimals and fractions.",
    "用两边同时减去 $a$ 的方法解 $x + a = b$，数可以是整数、小数和分数。",
  ],
);

export const oneStepSubtractionEquations = withIntro(
  topic(
    "one-step-subtraction-equations",
    t("One-Step Subtraction Equations", "一步减法方程"),
    t(
      "To solve x − a = b, undo the subtraction by adding a to both sides: x − 9 = 14 gives x = 14 + 9 = 23. When the variable is subtracted, as in 20 − x = 6, ask what must be taken from 20 to leave 6: x = 20 − 6 = 14.",
      "解 x − a = b 时，在两边同时加上 a 来抵消减法：x − 9 = 14，得 x = 14 + 9 = 23。当减去的是变量时，如 20 − x = 6，想一想从 20 里减去多少剩下 6：x = 20 − 6 = 14。",
    ),
    ["one-step-addition-equations"],
    ["6.EE.B.7"],
    [
      lesson(
        "subtracting-a-number",
        ["A number is subtracted", "减去一个数"],
        [
          [
            "When a number is taken away from the letter, add it back to both sides. Addition undoes subtraction: for $x - 3.5 = 8$, add $3.5$ to both sides, so $x = 8 + 3.5 = 11.5$.",
            "字母减去一个数时，两边同时把这个数加回来。加法是减法的逆运算：$x - 3.5 = 8$，两边同时加上 $3.5$，得 $x = 8 + 3.5 = 11.5$。",
          ],
          ["$11.5 - 3.5 = 8$.", "$11.5 - 3.5 = 8$。"],
          [
            "Here $x$ is what you had before $3.5$ was taken away, so it is larger than $8$. Subtracting, $8 - 3.5 = 4.5$, goes the wrong way.",
            "这里的 $x$ 是减去 $3.5$ 之前的数，所以比 $8$ 大。用减法算 $8 - 3.5 = 4.5$ 就反了。",
          ],
        ],
        (rng) => {
          const v = pickVar(rng);
          const decimal = rng.bool(0.4);
          const a = decimal ? tenths(rng, 1, 20) : Q.of(rng.int(2, 60));
          const b = decimal ? Q.of(rng.int(1, 30)) : Q.of(rng.int(1, 80));
          const s = a.add(b);
          const [A, B, S] = [show(a, decimal), b.toString(), show(s, decimal)];
          return valued(
            [`Solve $${v} - ${A} = ${B}$.`, `解方程 $${v} - ${A} = ${B}$。`],
            s,
            undone(
              ["Undo the subtraction", "抵消减法"],
              [`Add $${A}$ to both sides:`, `两边同时加上 $${A}$：`],
              `${v} = ${B} + ${A}`,
              `${v} = ${S}`,
            ),
            putBack(v, S, `${S} - ${A} = ${B}`),
            [
              [b.sub(a), `That takes $${A}$ away again. To undo taking it away, add it.`, `这是又减了 $${A}$。要抵消减法，应该加上它。`],
              [
                a.sub(b),
                `That takes $${B}$ away from $${A}$. Undo the subtraction by adding $${A}$ to $${B}$.`,
                `这是从 $${A}$ 中减去 $${B}$。要抵消减法，应该用 $${B}$ 加上 $${A}$。`,
              ],
              [
                b,
                `That is the right side as it stands. The $${A}$ still has to be added back.`,
                `这是右边原来的数，还没有把 $${A}$ 加回来。`,
              ],
            ],
            { solveFor: v, form: decimal ? "decimal" : "integer" },
          );
        },
        tapeFigure(
          [
            {
              total: "x",
              pieces: [
                { size: 8, text: "8" },
                { size: 3.5, text: "3.5", dashed: true },
              ],
            },
          ],
          ["A bar x: taking away 3.5 leaves 8, so x = 8 + 3.5 = 11.5.", "长条 x：去掉 3.5 后剩 8，所以 x = 8 + 3.5 = 11.5。"],
        ),
      ),
      lesson(
        "subtracting-the-variable",
        ["The variable is subtracted", "减去的是变量"],
        [
          [
            "When the letter is taken away from a number, ask how much must be taken away to leave the right side. For $20 - x = 6$, adding $x$ to both sides gives $20 = 6 + x$, so $x = 20 - 6 = 14$.",
            "一个数减去字母时，想一想要减去多少才剩下右边的数。$20 - x = 6$，两边同时加上 $x$，得 $20 = 6 + x$，所以 $x = 20 - 6 = 14$。",
          ],
          ["$20 - 14 = 6$.", "$20 - 14 = 6$。"],
          [
            "Do not add the two numbers. $x = 20 + 6 = 26$ gives $20 - 26$, which is less than zero, not $6$.",
            "不要把两个数相加。$x = 20 + 6 = 26$ 时，$20 - 26$ 小于零，不是 $6$。",
          ],
        ],
        (rng) => {
          const v = pickVar(rng);
          const a = rng.int(10, 90);
          const b = rng.int(1, a - 1);
          const s = a - b;
          return valued(
            [`Solve $${a} - ${v} = ${b}$.`, `解方程 $${a} - ${v} = ${b}$。`],
            s,
            [
              [["Move the letter", "移走字母"], [`Add $${v}$ to both sides:`, `两边同时加上 $${v}$：`], [`${a} = ${b} + ${v}`]],
              [
                ["Undo the addition", "抵消加法"],
                [`Subtract $${b}$ from both sides:`, `两边同时减去 $${b}$：`],
                [`${v} = ${a} - ${b} = ${s}`],
              ],
            ],
            putBack(v, String(s), `${a} - ${s} = ${b}`),
            [
              [
                a + b,
                `That adds the numbers. Then $${a} - ${a + b}$ is less than zero, not $${b}$.`,
                `这是把两个数相加。那样 $${a} - ${a + b}$ 小于零，不是 $${b}$。`,
              ],
              [
                b - a,
                `That is $${b} - ${a}$, the wrong way round. Take $${b}$ away from $${a}$.`,
                `这是 $${b} - ${a}$，减反了。应该用 $${a}$ 减去 $${b}$。`,
              ],
              [b, `That is the number left over, not the number taken away.`, `这是剩下的数，不是减去的数。`],
            ],
            { solveFor: v },
          );
        },
        tapeFigure(
          [
            {
              total: "20",
              pieces: [
                { size: 6, text: "6" },
                { size: 14, text: "x", lit: true },
              ],
            },
          ],
          ["A bar of 20 split into 6 and x, so x = 20 − 6 = 14.", "总长 20 的长条分成 6 和 x，所以 x = 20 − 6 = 14。"],
        ),
      ),
    ],
  ),
  [
    "Sam had some marbles and gave $9$ away. Now he has $14$: $x - 9 = 14$. To find how many he had, give the $9$ back.",
    "Sam 有一些弹珠，送出 $9$ 颗后还剩 $14$ 颗：$x - 9 = 14$。要知道他原来有多少颗，就把 $9$ 颗加回来。",
  ],
  ["$14 + 9 = 23$, and $23 - 9 = 14$.", "$14 + 9 = 23$，而 $23 - 9 = 14$。"],
  [
    "solve equations where a number is taken away from the letter, and where the letter is taken away from a number.",
    "解字母减去一个数的方程，也解一个数减去字母的方程。",
  ],
);

export const oneStepMultiplicationEquations = withIntro(
  topic(
    "one-step-multiplication-equations",
    t("One-Step Multiplication Equations", "一步乘法方程"),
    t(
      "To solve ax = b, undo the multiplication by dividing both sides by a: 6x = 42 gives x = 42 ÷ 6 = 7. The solution need not be a whole number: 4x = 10 gives x = 10/4 = 2.5.",
      "解 ax = b 时，两边同时除以 a 来抵消乘法：6x = 42，得 x = 42 ÷ 6 = 7。解不一定是整数：4x = 10，得 x = 10/4 = 2.5。",
    ),
    ["identifying-solutions-to-linear-equations"],
    ["6.EE.B.7"],
    [
      lesson(
        "whole-number-solutions",
        ["Whole-number solutions", "解是整数"],
        [
          [
            "$8n$ means $8 \\times n$. Division undoes multiplication, so divide both sides by $8$: for $8n = 56$, $n = 56 \\div 8 = 7$.",
            "$8n$ 表示 $8 \\times n$。除法是乘法的逆运算，所以两边同时除以 $8$：$8n = 56$，得 $n = 56 \\div 8 = 7$。",
          ],
          ["$8 \\times 7 = 56$.", "$8 \\times 7 = 56$。"],
          [
            "Divide by the number in front of the letter. Subtracting it, $56 - 8 = 48$, treats $8n$ as if it were $n + 8$.",
            "要除以字母前面的数。用减法算 $56 - 8 = 48$，就把 $8n$ 当成了 $n + 8$。",
          ],
        ],
        (rng) => {
          const v = pickVar(rng);
          const a = rng.int(2, 15);
          const s = rng.int(2, 15);
          const b = a * s;
          return valued(
            [`Solve $${a}${v} = ${b}$.`, `解方程 $${a}${v} = ${b}$。`],
            s,
            undone(
              ["Undo the multiplication", "抵消乘法"],
              [
                `$${a}${v}$ means $${a} \\times ${v}$. Divide both sides by $${a}$:`,
                `$${a}${v}$ 表示 $${a} \\times ${v}$。两边同时除以 $${a}$：`,
              ],
              `${v} = ${b} \\div ${a}`,
              `${v} = ${s}`,
            ),
            putBack(v, String(s), `${a} \\times ${s} = ${b}`),
            [
              [a * b, `That multiplies by $${a}$ again. Division undoes multiplication.`, `这是又乘了 $${a}$。要抵消乘法，应该用除法。`],
              [
                b - a,
                `That subtracts $${a}$. $${a}${v}$ means $${a}$ times $${v}$, so divide.`,
                `这是减去了 $${a}$。$${a}${v}$ 表示 $${a}$ 乘 $${v}$，所以要除。`,
              ],
              [b, `That is the right side as it stands. It still has to be divided by $${a}$.`, `这是右边原来的数，还没有除以 $${a}$。`],
            ],
            { solveFor: v },
          );
        },
        equalTape(8, "n", "56"),
      ),
      lesson(
        "decimal-coefficients-and-solutions",
        ["Decimals", "含小数"],
        [
          [
            "Divide both sides by the number in front of the letter, even when it or the answer is a decimal. $4x = 10$ gives $x = 10 \\div 4 = 2.5$. To divide by a decimal, move both decimal points the same number of places: $0.6x = 4.2$ gives $x = 4.2 \\div 0.6 = 42 \\div 6 = 7$.",
            "两边同时除以字母前面的数，即使这个数或结果是小数也一样。$4x = 10$，得 $x = 10 \\div 4 = 2.5$。除以小数时，把两个数的小数点向右移动同样的位数：$0.6x = 4.2$，得 $x = 4.2 \\div 0.6 = 42 \\div 6 = 7$。",
          ],
          ["$4 \\times 2.5 = 10$ and $0.6 \\times 7 = 4.2$.", "$4 \\times 2.5 = 10$，$0.6 \\times 7 = 4.2$。"],
          [
            "Move the decimal point in both numbers. Moving it only in $4.2$ gives $42 \\div 0.6 = 70$, ten times too big.",
            "两个数的小数点都要移动。只移动 $4.2$ 的小数点，得 $42 \\div 0.6 = 70$，大了十倍。",
          ],
        ],
        (rng) => {
          const v = pickVar(rng);
          if (rng.bool()) {
            const a = rng.pick([2, 4, 5, 8]);
            let b: number;
            do b = rng.int(3, 60);
            while (b % a === 0);
            const s = Q.of(b, a);
            return valued(
              [`Solve $${a}${v} = ${b}$. Write the answer as a decimal.`, `解方程 $${a}${v} = ${b}$，结果写成小数。`],
              s,
              undone(
                ["Undo the multiplication", "抵消乘法"],
                [`Divide both sides by $${a}$:`, `两边同时除以 $${a}$：`],
                `${v} = ${b} \\div ${a}`,
                `${v} = ${dec(s)}`,
              ),
              putBack(v, dec(s), `${a} \\times ${dec(s)} = ${b}`),
              [
                [a * b, `That multiplies by $${a}$ again. Division undoes multiplication.`, `这是又乘了 $${a}$。要抵消乘法，应该用除法。`],
                [
                  Q.of(a, b),
                  `That is $${a} \\div ${b}$, the wrong way round. Divide $${b}$ by $${a}$.`,
                  `这是 $${a} \\div ${b}$，除反了。应该用 $${b}$ 除以 $${a}$。`,
                ],
                [
                  b - a,
                  `That subtracts $${a}$. $${a}${v}$ means $${a}$ times $${v}$, so divide.`,
                  `这是减去了 $${a}$。$${a}${v}$ 表示 $${a}$ 乘 $${v}$，所以要除。`,
                ],
              ],
              { solveFor: v, form: "decimal" },
            );
          }
          const a = tenths(rng, 0, 3);
          const s = rng.int(2, 15);
          const b = a.mul(Q.of(s));
          const ten = Q.of(10);
          return valued(
            [`Solve $${dec(a)}${v} = ${dec(b)}$.`, `解方程 $${dec(a)}${v} = ${dec(b)}$。`],
            s,
            [
              [
                ["Undo the multiplication", "抵消乘法"],
                [`Divide both sides by $${dec(a)}$:`, `两边同时除以 $${dec(a)}$：`],
                [`${v} = ${dec(b)} \\div ${dec(a)}`],
              ],
              [
                ["Make the divisor whole", "把除数变成整数"],
                ["Move both decimal points one place to the right:", "把两个数的小数点都向右移动一位："],
                [`${v} = ${dec(b.mul(ten))} \\div ${dec(a.mul(ten))} = ${s}`],
              ],
            ],
            putBack(v, String(s), `${dec(a)} \\times ${s} = ${dec(b)}`),
            [
              [
                s * 10,
                `That moves the decimal point in $${dec(b)}$ but not in $${dec(a)}$. Move both by the same amount.`,
                `这只移动了 $${dec(b)}$ 的小数点，没有移动 $${dec(a)}$ 的。两个数要移动同样的位数。`,
              ],
              [
                Q.of(s, 100),
                `That moves the decimal point in $${dec(a)}$ but not in $${dec(b)}$. Move both by the same amount.`,
                `这只移动了 $${dec(a)}$ 的小数点，没有移动 $${dec(b)}$ 的。两个数要移动同样的位数。`,
              ],
              [
                a.mul(b),
                `That multiplies by $${dec(a)}$ again. Division undoes multiplication.`,
                `这是又乘了 $${dec(a)}$。要抵消乘法，应该用除法。`,
              ],
            ],
            { solveFor: v },
          );
        },
        equalTape(4, "2.5", "10"),
      ),
    ],
  ),
  [
    "Six boxes hold $42$ pencils in all, with the same number in each box: $6x = 42$. To find one box, share $42$ into $6$ equal parts.",
    "$6$ 个盒子一共装了 $42$ 支铅笔，每盒一样多：$6x = 42$。要求一盒有几支，就把 $42$ 平均分成 $6$ 份。",
  ],
  ["$42 \\div 6 = 7$, and $6 \\times 7 = 42$.", "$42 \\div 6 = 7$，而 $6 \\times 7 = 42$。"],
  [
    "solve $ax = b$ by dividing both sides by $a$, including numbers and answers that are decimals.",
    "用两边同时除以 $a$ 的方法解 $ax = b$，数和解都可以是小数。",
  ],
);

export const oneStepMultiplicationEquationsContainingFractions = withIntro(
  topic(
    "one-step-multiplication-equations-containing-fractions",
    t("One-Step Multiplication Equations Containing Fractions", "含分数的一步乘法方程"),
    t(
      "To solve (p/q)x = b, multiply both sides by the reciprocal q/p, which undoes multiplying by p/q: (2/3)x = 8 gives x = 8 × 3/2 = 12. The same works when b is a fraction: 3x = 2/5 gives x = 2/5 × 1/3 = 2/15.",
      "解 (p/q)x = b 时，两边同时乘倒数 q/p，抵消乘 p/q：(2/3)x = 8，得 x = 8 × 3/2 = 12。b 是分数时也一样：3x = 2/5，得 x = 2/5 × 1/3 = 2/15。",
    ),
    ["one-step-multiplication-equations", "reciprocals"],
    ["6.EE.B.7"],
    [
      lesson(
        "fraction-coefficients",
        ["A fraction times the variable", "分数乘变量"],
        [
          [
            "When the number in front of the letter is a fraction, multiply both sides by its reciprocal. That undoes the fraction and leaves the letter alone. For $\\frac{3}{4}m = 12$, multiply both sides by $\\frac{4}{3}$: $m = 12 \\times \\frac{4}{3} = 16$.",
            "字母前面的数是分数时，两边同时乘它的倒数。这样就抵消了分数，只剩下字母。$\\frac{3}{4}m = 12$，两边同时乘 $\\frac{4}{3}$：$m = 12 \\times \\frac{4}{3} = 16$。",
          ],
          [
            "$\\frac{3}{4}$ of $16$: $16 \\div 4 = 4$, and $4 \\times 3 = 12$.",
            "$16$ 的 $\\frac{3}{4}$：$16 \\div 4 = 4$，$4 \\times 3 = 12$。",
          ],
          [
            "Multiply by the reciprocal, not by the fraction itself. $12 \\times \\frac{3}{4} = 9$, and $\\frac{3}{4}$ of $9$ is not $12$.",
            "要乘倒数，不是乘这个分数本身。$12 \\times \\frac{3}{4} = 9$，而 $9$ 的 $\\frac{3}{4}$ 不是 $12$。",
          ],
        ],
        (rng) => {
          const v = pickVar(rng);
          let a = smallFraction(rng);
          while (a.cmp(Q.one) > 0 && rng.bool(0.6)) a = smallFraction(rng);
          const [n, d] = [Number(a.n), Number(a.d)];
          const s = d * rng.int(1, 8);
          const b = a.mul(Q.of(s));
          const recip = Q.one.div(a);
          return valued(
            [`Solve $${a.toLatex()}${v} = ${b.toLatex()}$.`, `解方程 $${a.toLatex()}${v} = ${b.toLatex()}$。`],
            s,
            undone(
              ["Use the reciprocal", "乘倒数"],
              [
                `The reciprocal of $${a.toLatex()}$ is $${recip.toLatex()}$. Multiply both sides by it:`,
                `$${a.toLatex()}$ 的倒数是 $${recip.toLatex()}$。两边同时乘它：`,
              ],
              `${v} = ${b.toLatex()} \\times ${recip.toLatex()}`,
              `${v} = ${s}`,
            ),
            [
              `Take $${a.toLatex()}$ of $${s}$: $${s} \\div ${d} = ${s / d}$, and $${s / d} \\times ${n} = ${b.toLatex()}$.`,
              `求 $${s}$ 的 $${a.toLatex()}$：$${s} \\div ${d} = ${s / d}$，$${s / d} \\times ${n} = ${b.toLatex()}$。`,
            ],
            [
              [a.mul(b), "That multiplies by the fraction instead of by its reciprocal.", "这是乘了这个分数，而不是乘它的倒数。"],
              [
                b.mul(Q.of(d)),
                `That multiplies by $${d}$ only. The reciprocal also divides by $${n}$.`,
                `这只乘了 $${d}$。乘倒数还要再除以 $${n}$。`,
              ],
            ],
            { solveFor: v },
          );
        },
        tapeFigure(
          [{ total: "m = 16", pieces: [0, 1, 2, 3].map((i) => ({ size: 1, text: "4", lit: i < 3 })) }],
          [
            "A bar m in 4 equal parts of 4. Three of the parts, 3/4 of m, make 12, so m = 16.",
            "长条 m 平均分成 4 份，每份 4。其中 3 份（m 的 3/4）是 12，所以 m = 16。",
          ],
        ),
      ),
      lesson(
        "fractional-solutions",
        ["Fractional solutions", "解是分数"],
        [
          [
            "Multiply both sides by the reciprocal of the number in front of the letter, then simplify. The solution may be a fraction: $\\frac{2}{3}x = \\frac{4}{5}$ gives $x = \\frac{4}{5} \\times \\frac{3}{2} = \\frac{12}{10} = \\frac{6}{5}$. For $3x = \\frac{2}{5}$, the reciprocal of $3$ is $\\frac{1}{3}$, so $x = \\frac{2}{15}$.",
            "两边同时乘字母前面的数的倒数，再约分。解可能是分数：$\\frac{2}{3}x = \\frac{4}{5}$，得 $x = \\frac{4}{5} \\times \\frac{3}{2} = \\frac{12}{10} = \\frac{6}{5}$。$3x = \\frac{2}{5}$ 中，$3$ 的倒数是 $\\frac{1}{3}$，所以 $x = \\frac{2}{15}$。",
          ],
          [
            "$\\frac{2}{3} \\times \\frac{6}{5} = \\frac{12}{15} = \\frac{4}{5}$.",
            "$\\frac{2}{3} \\times \\frac{6}{5} = \\frac{12}{15} = \\frac{4}{5}$。",
          ],
          [
            "Divide the right side by the number in front, not the other way round. $\\frac{2}{3} \\div \\frac{4}{5} = \\frac{5}{6}$ is the wrong way round.",
            "要用右边除以字母前面的数，不能反过来。$\\frac{2}{3} \\div \\frac{4}{5} = \\frac{5}{6}$ 就除反了。",
          ],
        ],
        (rng) => {
          const v = pickVar(rng);
          let a: Q;
          let b: Q;
          let s: Q;
          do {
            a = rng.bool(0.3) ? Q.of(rng.int(2, 9)) : smallFraction(rng);
            b = smallFraction(rng);
            s = b.div(a);
          } while (s.isInteger() || a.eq(b));
          const recip = Q.one.div(a);
          return valued(
            [`Solve $${a.toLatex()}${v} = ${b.toLatex()}$.`, `解方程 $${a.toLatex()}${v} = ${b.toLatex()}$。`],
            s,
            undone(
              ["Use the reciprocal", "乘倒数"],
              [
                `Multiply both sides by $${recip.toLatex()}$, the reciprocal of $${a.toLatex()}$:`,
                `两边同时乘 $${a.toLatex()}$ 的倒数 $${recip.toLatex()}$：`,
              ],
              `${v} = ${b.toLatex()} \\times ${recip.toLatex()}`,
              `${v} = ${s.toLatex()}`,
            ),
            putBack(v, s.toLatex(), `${a.toLatex()} \\times ${s.toLatex()} = ${b.toLatex()}`),
            [
              [
                a.mul(b),
                "That multiplies by the number in front instead of by its reciprocal.",
                "这是乘了字母前面的数，而不是乘它的倒数。",
              ],
              [
                a.div(b),
                "That divides the number in front by the right side, the wrong way round.",
                "这是用字母前面的数除以右边，除反了。",
              ],
            ],
            { solveFor: v },
          );
        },
        tapeFigure(
          [{ total: "x = 6/5", pieces: [0, 1, 2].map((i) => ({ size: 1, text: "2/5", lit: i < 2 })) }],
          [
            "A bar x in 3 equal parts of 2/5. Two parts, 2/3 of x, make 4/5, so x = 3 × 2/5 = 6/5.",
            "长条 x 平均分成 3 份，每份 2/5。其中 2 份（x 的 2/3）是 4/5，所以 x = 3 × 2/5 = 6/5。",
          ],
        ),
      ),
    ],
  ),
  [
    "Two thirds of a class, $16$ children, walk to school: $\\frac{2}{3}c = 16$. If $2$ thirds are $16$ children, one third is $8$, and the whole class is $3 \\times 8 = 24$.",
    "一个班有三分之二的同学步行上学，共 $16$ 人：$\\frac{2}{3}c = 16$。$2$ 份是 $16$ 人，$1$ 份就是 $8$ 人，全班是 $3 \\times 8 = 24$ 人。",
  ],
  ["$16 \\times \\frac{3}{2} = 24$ gives the same answer.", "$16 \\times \\frac{3}{2} = 24$，结果相同。"],
  ["solve equations with a fraction in front of the letter by multiplying by its reciprocal.", "用乘倒数的方法解字母前面是分数的方程。"],
);

export const oneStepDivisionEquations = withIntro(
  topic(
    "one-step-division-equations",
    t("One-Step Division Equations", "一步除法方程"),
    t(
      "To solve x/a = b, undo the division by multiplying both sides by a: x/6 = 9 gives x = 9 × 6 = 54. Check: 54 ÷ 6 = 9.",
      "解 x/a = b 时，两边同时乘 a 来抵消除法：x/6 = 9，得 x = 9 × 6 = 54。检验：54 ÷ 6 = 9。",
    ),
    ["one-step-multiplication-equations"],
    ["6.EE.B.7"],
    [
      lesson(
        "whole-numbers",
        ["Whole numbers", "整数"],
        [
          [
            "When the letter is divided by a number, multiply both sides by that number. Multiplication undoes division: for $\\frac{n}{7} = 8$, $n = 8 \\times 7 = 56$.",
            "字母除以一个数时，两边同时乘这个数。乘法是除法的逆运算：$\\frac{n}{7} = 8$，得 $n = 8 \\times 7 = 56$。",
          ],
          ["$56 \\div 7 = 8$.", "$56 \\div 7 = 8$。"],
          [
            "Do not divide again. $n$ shared into $7$ parts gives $8$ each, so $n$ is bigger than $8$, but $8 \\div 7$ is smaller.",
            "不要再除一次。$n$ 平均分成 $7$ 份，每份是 $8$，所以 $n$ 比 $8$ 大，而 $8 \\div 7$ 比 $8$ 小。",
          ],
        ],
        (rng) => {
          const v = pickVar(rng);
          const a = rng.int(2, 12);
          const b = rng.int(2, 15);
          return valued(
            [`Solve $\\frac{${v}}{${a}} = ${b}$.`, `解方程 $\\frac{${v}}{${a}} = ${b}$。`],
            a * b,
            undone(
              ["Undo the division", "抵消除法"],
              [`Multiply both sides by $${a}$:`, `两边同时乘 $${a}$：`],
              `${v} = ${b} \\times ${a}`,
              `${v} = ${a * b}`,
            ),
            putBack(v, String(a * b), `${a * b} \\div ${a} = ${b}`),
            [
              [
                Q.of(b, a),
                `That divides by $${a}$ again. Multiplication undoes division.`,
                `这是又除以了 $${a}$。要抵消除法，应该用乘法。`,
              ],
              [
                Q.of(a, b),
                `That is $${a} \\div ${b}$. Undo dividing by $${a}$ by multiplying.`,
                `这是 $${a} \\div ${b}$。要抵消除以 $${a}$，应该乘 $${a}$。`,
              ],
              [a + b, `That adds $${a}$. Undo dividing by $${a}$ by multiplying.`, `这是加上了 $${a}$。要抵消除以 $${a}$，应该乘 $${a}$。`],
            ],
            { solveFor: v, form: "integer" },
          );
        },
        equalTape(7, "8", "n"),
      ),
      lesson(
        "decimal-and-fraction-quotients",
        ["Decimals and fractions", "小数和分数"],
        [
          [
            "Multiply both sides by the number the letter is divided by, even when the other side is a decimal or a fraction. $\\frac{x}{4} = 2.5$ gives $x = 2.5 \\times 4 = 10$, and $\\frac{x}{3} = \\frac{2}{5}$ gives $x = \\frac{2}{5} \\times 3 = \\frac{6}{5}$.",
            "两边同时乘字母所除以的数，即使另一边是小数或分数也一样。$\\frac{x}{4} = 2.5$，得 $x = 2.5 \\times 4 = 10$；$\\frac{x}{3} = \\frac{2}{5}$，得 $x = \\frac{2}{5} \\times 3 = \\frac{6}{5}$。",
          ],
          [
            "$10 \\div 4 = 2.5$, and $\\frac{6}{5} \\div 3 = \\frac{6}{15} = \\frac{2}{5}$.",
            "$10 \\div 4 = 2.5$，$\\frac{6}{5} \\div 3 = \\frac{6}{15} = \\frac{2}{5}$。",
          ],
          [
            "To multiply a fraction by a whole number, multiply only the top: $\\frac{2}{5} \\times 3 = \\frac{6}{5}$, not $\\frac{6}{15}$.",
            "分数乘整数，只用分子乘：$\\frac{2}{5} \\times 3 = \\frac{6}{5}$，不是 $\\frac{6}{15}$。",
          ],
        ],
        (rng) => {
          const v = pickVar(rng);
          const decimal = rng.bool();
          const a = rng.int(2, 9);
          const b = decimal ? tenths(rng, 0, 12) : smallFraction(rng);
          const s = b.mul(Q.of(a));
          const [B, S] = [show(b, decimal), show(s, decimal)];
          return valued(
            [`Solve $\\frac{${v}}{${a}} = ${B}$.`, `解方程 $\\frac{${v}}{${a}} = ${B}$。`],
            s,
            undone(
              ["Undo the division", "抵消除法"],
              [`Multiply both sides by $${a}$:`, `两边同时乘 $${a}$：`],
              `${v} = ${B} \\times ${a}`,
              `${v} = ${S}`,
            ),
            putBack(v, S, `${S} \\div ${a} = ${B}`),
            [
              [
                b.div(Q.of(a)),
                `That divides by $${a}$ again. Multiplication undoes division.`,
                `这是又除以了 $${a}$。要抵消除法，应该用乘法。`,
              ],
              [
                b.add(Q.of(a)),
                `That adds $${a}$. Undo dividing by $${a}$ by multiplying.`,
                `这是加上了 $${a}$。要抵消除以 $${a}$，应该乘 $${a}$。`,
              ],
              [b, "That is the right side as it stands. It still has to be multiplied.", "这是右边原来的数，还没有乘。"],
            ],
            { solveFor: v, ...(decimal && { form: "decimal" as const }) },
          );
        },
        equalTape(4, "2.5", "x = 10"),
      ),
    ],
  ),
  [
    "A ribbon is cut into $6$ equal pieces, and each piece is $9$ cm long: $\\frac{r}{6} = 9$. Put the $6$ pieces back together to get the whole ribbon.",
    "一条丝带剪成同样长的 $6$ 段，每段长 $9$ 厘米：$\\frac{r}{6} = 9$。把 $6$ 段拼回去，就是整条丝带。",
  ],
  ["$6 \\times 9 = 54$, and $54 \\div 6 = 9$.", "$6 \\times 9 = 54$，而 $54 \\div 6 = 9$。"],
  ["solve $\\frac{x}{a} = b$ by multiplying both sides by $a$.", "用两边同时乘 $a$ 的方法解 $\\frac{x}{a} = b$。"],
);

// ---------------------------------------------------------------------------
// Real-world one-step equations

/** Situation is a word problem modeled by a one-step equation in a variable, with tempting wrong equations and answers and their reasons. */
interface Situation {
  readonly story: Pair;
  readonly variable: string;
  readonly equation: string;
  readonly wrongEquations: readonly MathWrong[];
  /** relation says the relationship in words; undo says the step that solves it, and solve is that step in symbols. */
  readonly relation: Pair;
  readonly undo: Pair;
  readonly solve: string;
  readonly answer: number;
  readonly wrongAnswers: readonly Off[];
  /** back checks the answer against the story. */
  readonly back: Pair;
}

/** additiveSituations builds word problems modeled by x + a = b or x − a = b. */
function additiveSituations(rng: Rng): Situation[] {
  const a = rng.int(5, 40);
  const b = rng.int(a + 5, a + 80);
  const gap = rng.int(2, 12);
  const age = gap + rng.int(3, 40);
  return [
    {
      story: [
        `A sunflower grew $${a}$ cm this month and is now $${b}$ cm tall. Let $h$ be its height, in cm, at the start of the month.`,
        `一株向日葵这个月长高了 $${a}$ 厘米，现在高 $${b}$ 厘米。设月初它的高度为 $h$ 厘米。`,
      ],
      variable: "h",
      equation: `h + ${a} = ${b}`,
      wrongEquations: [
        [
          `h - ${a} = ${b}`,
          "That takes the growth away. The plant grew, so the growth is added to its starting height.",
          "这是减去长高的部分。植物长高了，应该在月初高度上加上它。",
        ],
        [
          `${a}h = ${b}`,
          "That multiplies. Growing adds some height; it does not make copies.",
          "这是乘法。长高是加上一段高度，不是乘几倍。",
        ],
        [
          `h = ${a} + ${b}`,
          "That adds the growth to the height now, which makes the start taller than the end.",
          "这是把长高的部分加到现在的高度上，月初反而比现在高了。",
        ],
      ],
      relation: ["The starting height plus the growth is the height now.", "月初高度加上长高的部分等于现在的高度。"],
      undo: [`Subtract $${a}$ from both sides:`, `两边同时减去 $${a}$：`],
      solve: `h = ${b} - ${a} = ${b - a}`,
      answer: b - a,
      wrongAnswers: [
        [
          a + b,
          "That adds the growth to the height now. The plant was shorter at the start, so subtract.",
          "这是把长高的部分加到现在的高度上。月初更矮，应该减。",
        ],
        [a, "That is how much it grew, not its height.", "这是长高的部分，不是月初的高度。"],
      ],
      back: [`$${b - a} + ${a} = ${b}$ cm, the height now.`, `$${b - a} + ${a} = ${b}$ 厘米，正是现在的高度。`],
    },
    {
      story: [
        `After spending $\\$${a}$ on a jacket, Ana has $\\$${b}$ left. Let $m$ be the amount of money, in dollars, Ana had before.`,
        `Ana 花 $\\$${a}$ 买了一件夹克后，还剩 $\\$${b}$。设 Ana 原来有 $m$ 美元。`,
      ],
      variable: "m",
      equation: `m - ${a} = ${b}`,
      wrongEquations: [
        [`m + ${a} = ${b}`, "That adds the cost. Spending takes money away.", "这是加上花掉的钱。花钱是减少。"],
        [
          `${a} - m = ${b}`,
          `That takes $m$ away from $${a}$. The cost is taken from Ana's money.`,
          `这是从 $${a}$ 中减去 $m$。应该从 Ana 原有的钱中减去花掉的钱。`,
        ],
        [
          `\\frac{m}{${a}} = ${b}`,
          "That divides. Spending takes the cost away; it does not share the money.",
          "这是除法。花钱是减去花掉的钱，不是平均分。",
        ],
      ],
      relation: ["The money before minus the money spent is the money left.", "原有的钱减去花掉的钱等于剩下的钱。"],
      undo: [`Add $${a}$ to both sides:`, `两边同时加上 $${a}$：`],
      solve: `m = ${b} + ${a} = ${a + b}`,
      answer: a + b,
      wrongAnswers: [
        [b - a, "That subtracts again. Ana had more before she spent, so add.", "这是又减了一次。花钱前钱更多，应该加。"],
        [b, "That is the money left after spending.", "这是花钱后剩下的钱。"],
      ],
      back: [`$${a + b} - ${a} = ${b}$ dollars left.`, `$${a + b} - ${a} = ${b}$ 美元，正是剩下的钱。`],
    },
    {
      story: [
        `Leo is $${gap}$ years older than his cousin. Leo is $${age}$ years old. Let $c$ be the cousin's age, in years.`,
        `Leo 比表弟大 $${gap}$ 岁，Leo 今年 $${age}$ 岁。设表弟 $c$ 岁。`,
      ],
      variable: "c",
      equation: `c + ${gap} = ${age}`,
      wrongEquations: [
        [
          `c - ${gap} = ${age}`,
          "That makes the cousin older than Leo. Leo is older, so add the gap to the cousin's age.",
          "这样表弟比 Leo 还大。Leo 年龄大，应该在表弟的年龄上加上相差的岁数。",
        ],
        [`${age} + c = ${gap}`, "That adds the two ages and says they make the gap.", "这是把两人的年龄加起来，说它等于年龄差。"],
        [`${gap}c = ${age}`, "That multiplies. Being older by some years adds years.", "这是乘法。大几岁是加上几岁。"],
      ],
      relation: [`The cousin's age plus $${gap}$ years is Leo's age.`, `表弟的年龄加上 $${gap}$ 岁等于 Leo 的年龄。`],
      undo: [`Subtract $${gap}$ from both sides:`, `两边同时减去 $${gap}$：`],
      solve: `c = ${age} - ${gap} = ${age - gap}`,
      answer: age - gap,
      wrongAnswers: [
        [age + gap, "That makes the cousin older than Leo. The cousin is younger, so subtract.", "这样表弟比 Leo 还大。表弟更小，应该减。"],
      ],
      back: [`$${age - gap} + ${gap} = ${age}$, Leo's age.`, `$${age - gap} + ${gap} = ${age}$，正是 Leo 的年龄。`],
    },
    {
      story: [
        `A bus had some passengers. At a stop, $${a}$ passengers got off, leaving $${b}$ on the bus. Let $p$ be the number of passengers before the stop.`,
        `一辆公交车上有一些乘客。到站后下车 $${a}$ 人，车上还剩 $${b}$ 人。设到站前车上有 $p$ 人。`,
      ],
      variable: "p",
      equation: `p - ${a} = ${b}`,
      wrongEquations: [
        [`p + ${a} = ${b}`, "That adds the people who got off. Getting off takes people away.", "这是加上下车的人。下车是减少。"],
        [
          `${a} - p = ${b}`,
          `That takes $p$ away from $${a}$. The people who got off are taken from $p$.`,
          `这是从 $${a}$ 中减去 $p$。应该从 $p$ 中减去下车的人数。`,
        ],
        [`${a}p = ${b}`, "That multiplies. Getting off takes people away.", "这是乘法。下车是减少。"],
      ],
      relation: ["The passengers before minus those who got off are those left.", "到站前的人数减去下车的人数等于剩下的人数。"],
      undo: [`Add $${a}$ to both sides:`, `两边同时加上 $${a}$：`],
      solve: `p = ${b} + ${a} = ${a + b}`,
      answer: a + b,
      wrongAnswers: [
        [b - a, "That subtracts again. More people were on the bus before the stop.", "这是又减了一次。到站前车上的人更多。"],
        [b, "That is the number left on the bus.", "这是车上剩下的人数。"],
      ],
      back: [`$${a + b} - ${a} = ${b}$ passengers left.`, `$${a + b} - ${a} = ${b}$ 人，正是剩下的人数。`],
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
  const speed = a * 10;
  return [
    {
      story: [
        `Tickets to a show cost $\\$${a}$ each. A group paid $\\$${a * s}$ in all. Let $n$ be the number of tickets the group bought.`,
        `演出票每张 $\\$${a}$，一个小组一共付了 $\\$${a * s}$。设他们买了 $n$ 张票。`,
      ],
      variable: "n",
      equation: `${a}n = ${a * s}`,
      wrongEquations: [
        [
          `\\frac{n}{${a}} = ${a * s}`,
          "That divides the tickets by the price. The cost of several tickets is the price times the number.",
          "这是用张数除以单价。几张票的总价是单价乘张数。",
        ],
        [
          `n + ${a} = ${a * s}`,
          "That adds one price. Each ticket costs the price, so multiply.",
          "这只加了一次单价。每张票都要付一次单价，所以要乘。",
        ],
        [`${a * s}n = ${a}`, "That swaps the price and the total.", "这把单价和总价对调了。"],
      ],
      relation: ["The price of one ticket times the number of tickets is the total.", "单价乘张数等于总价。"],
      undo: [`Divide both sides by $${a}$:`, `两边同时除以 $${a}$：`],
      solve: `n = ${a * s} \\div ${a} = ${s}`,
      answer: s,
      wrongAnswers: [
        [
          a * a * s,
          "That multiplies the total by the price. Divide to share the total among the tickets.",
          "这是用总价乘单价。应该用总价除以单价。",
        ],
        [
          a * s - a,
          "That takes away one price. The total holds many prices, so divide.",
          "这只减去了一次单价。总价里有很多个单价，应该除。",
        ],
      ],
      back: [
        `$${s}$ tickets at $\\$${a}$ each cost $${s} \\times ${a} = ${a * s}$ dollars.`,
        `$${s}$ 张票，每张 $\\$${a}$，共 $${s} \\times ${a} = ${a * s}$ 美元。`,
      ],
    },
    {
      story: [
        `A ribbon is cut into $${a}$ equal pieces, and each piece is $${s}$ inches long. Let $r$ be the length of the ribbon, in inches.`,
        `一条丝带被剪成 $${a}$ 段同样长的丝带，每段长 $${s}$ 英寸。设丝带原长 $r$ 英寸。`,
      ],
      variable: "r",
      equation: `\\frac{r}{${a}} = ${s}`,
      wrongEquations: [
        [
          `${a}r = ${s}`,
          "That multiplies the ribbon by the number of pieces. Cutting into equal pieces divides.",
          "这是用丝带长乘段数。平均剪成几段是除法。",
        ],
        [
          `r - ${a} = ${s}`,
          "That takes away the number of pieces. Cutting into equal pieces divides.",
          "这是减去段数。平均剪成几段是除法。",
        ],
        [
          `\\frac{${a}}{r} = ${s}`,
          `That divides $${a}$ by the length. The length is what gets divided.`,
          `这是用 $${a}$ 除以全长。被平均分的是全长。`,
        ],
      ],
      relation: [
        `The length divided into $${a}$ equal pieces gives the length of each piece.`,
        `把全长平均分成 $${a}$ 段，得到每段的长度。`,
      ],
      undo: [`Multiply both sides by $${a}$:`, `两边同时乘 $${a}$：`],
      solve: `r = ${s} \\times ${a} = ${a * s}`,
      answer: a * s,
      wrongAnswers: [
        [
          Q.of(s, a),
          "That divides again. The whole ribbon is longer than one piece, so multiply.",
          "这是又除了一次。整条丝带比一段长，应该乘。",
        ],
        [
          a + s,
          `That adds the number of pieces. Putting $${a}$ equal pieces together multiplies.`,
          `这是加上段数。把 $${a}$ 段同样长的拼起来，要用乘法。`,
        ],
      ],
      back: [`$${a * s} \\div ${a} = ${s}$ inches for each piece.`, `$${a * s} \\div ${a} = ${s}$ 英寸，正是每段的长度。`],
    },
    {
      story: [
        `A train travels at a steady $${speed}$ miles per hour and covers $${speed * s}$ miles. Let $t$ be the travel time, in hours.`,
        `一列火车以每小时 $${speed}$ 英里的速度匀速行驶了 $${speed * s}$ 英里。设行驶时间为 $t$ 小时。`,
      ],
      variable: "t",
      equation: `${speed}t = ${speed * s}`,
      wrongEquations: [
        [
          `\\frac{t}{${speed}} = ${speed * s}`,
          "That divides the time by the speed. Distance is speed times time.",
          "这是用时间除以速度。路程等于速度乘时间。",
        ],
        [
          `t + ${speed} = ${speed * s}`,
          "That adds the speed once. Each hour covers that many miles, so multiply.",
          "这只加了一次速度。每小时都走这么远，所以要乘。",
        ],
        [`${speed * s}t = ${speed}`, "That swaps the speed and the distance.", "这把速度和路程对调了。"],
      ],
      relation: ["Speed times time is distance.", "速度乘时间等于路程。"],
      undo: [`Divide both sides by $${speed}$:`, `两边同时除以 $${speed}$：`],
      solve: `t = ${speed * s} \\div ${speed} = ${s}`,
      answer: s,
      wrongAnswers: [
        [
          speed * s - speed,
          "That takes away one hour's distance. Divide the distance by the speed.",
          "这只减去了一小时的路程。应该用路程除以速度。",
        ],
      ],
      back: [
        `$${speed}$ miles an hour for $${s}$ hours is $${speed} \\times ${s} = ${speed * s}$ miles.`,
        `每小时 $${speed}$ 英里，行驶 $${s}$ 小时，共 $${speed} \\times ${s} = ${speed * s}$ 英里。`,
      ],
    },
    {
      story: [
        `In a class, $\\frac{${p}}{${q}}$ of the students walk to school. That is $${p * k}$ students. Let $c$ be the number of students in the class.`,
        `一个班里 $\\frac{${p}}{${q}}$ 的学生步行上学，共 $${p * k}$ 人。设全班有 $c$ 人。`,
      ],
      variable: "c",
      equation: `\\frac{${p}}{${q}}c = ${p * k}`,
      wrongEquations: [
        [
          `c + \\frac{${p}}{${q}} = ${p * k}`,
          "That adds the fraction. A fraction of the class is the fraction times the class.",
          "这是加上分数。全班的几分之几是分数乘全班人数。",
        ],
        [
          `\\frac{${q}}{${p}}c = ${p * k}`,
          `That uses the reciprocal. The walkers are $\\frac{${p}}{${q}}$ of the class.`,
          `这用了倒数。步行的是全班的 $\\frac{${p}}{${q}}$。`,
        ],
        [
          `c = \\frac{${p}}{${q}} \\times ${p * k}`,
          `That takes $\\frac{${p}}{${q}}$ of the walkers, not of the class.`,
          `这是求步行人数的 $\\frac{${p}}{${q}}$，不是全班的。`,
        ],
      ],
      relation: [`$\\frac{${p}}{${q}}$ of the class is the number who walk.`, `全班人数的 $\\frac{${p}}{${q}}$ 是步行的人数。`],
      undo: [`Multiply both sides by the reciprocal $\\frac{${q}}{${p}}$:`, `两边同时乘倒数 $\\frac{${q}}{${p}}$：`],
      solve: `c = ${p * k} \\times \\frac{${q}}{${p}} = ${q * k}`,
      answer: q * k,
      wrongAnswers: [
        [
          Q.of(p * p * k, q),
          "That multiplies by the fraction instead of its reciprocal. The class is bigger than the walkers.",
          "这是乘了分数而不是它的倒数。全班人数应该比步行人数多。",
        ],
        [p * k, "That is the number who walk, not the whole class.", "这是步行的人数，不是全班人数。"],
      ],
      back: [
        `$\\frac{${p}}{${q}}$ of $${q * k}$: $${q * k} \\div ${q} = ${k}$, and $${k} \\times ${p} = ${p * k}$ walkers.`,
        `$${q * k}$ 的 $\\frac{${p}}{${q}}$：$${q * k} \\div ${q} = ${k}$，$${k} \\times ${p} = ${p * k}$ 人步行。`,
      ],
    },
  ];
}

/** modelProblem asks which equation models a situation. */
function modelProblem(rng: Rng, s: Situation) {
  return chosenMath(
    rng,
    [`${s.story[0]} Which equation models this situation?`, `${s.story[1]}哪个方程能表示这个情境？`],
    s.equation,
    s.wrongEquations,
    [
      [["Say it in words", "用文字说"], s.relation],
      [["Write it in symbols", "写成式子"], ["So the equation is:", "所以方程是："], [s.equation]],
    ],
    [
      `Solving it gives $${s.variable} = ${s.answer}$, which fits the story: ${s.back[0]}`,
      `解得 $${s.variable} = ${s.answer}$，符合题意：${s.back[1]}`,
    ],
  );
}

/** solveProblem asks for the value of the unknown in a situation. */
function solveProblem(s: Situation) {
  return valued(
    [`${s.story[0]} Find $${s.variable}$.`, `${s.story[1]}求 $${s.variable}$。`],
    s.answer,
    [
      [["Write the equation", "列方程"], s.relation, [s.equation]],
      [["Solve it", "解方程"], s.undo, [s.solve]],
    ],
    s.back,
    s.wrongAnswers,
    { form: "integer" },
  );
}

export const modelingRealWorldProblemsUsingOneStepEquations = withIntro(
  topic(
    "modeling-real-world-problems-using-one-step-equations",
    t("Modeling Real-World Problems Using One-Step Equations", "用一步方程表示实际问题"),
    t(
      "To model a situation with an equation, name the unknown with a variable and write the relationship the story describes. If a plant grew 5 cm and is now 30 cm tall, its starting height h satisfies h + 5 = 30. If 6 equal tickets cost \\$48, the price p satisfies 6p = 48.",
      "用方程表示情境时，先用变量表示未知量，再写出题目描述的数量关系。一株植物长高了 5 厘米，现在高 30 厘米，原来的高度 h 满足 h + 5 = 30。6 张同价的票共 48 美元，单价 p 满足 6p = 48。",
    ),
    ["one-step-subtraction-equations", "one-step-division-equations", "constructing-algebraic-expressions"],
    ["6.EE.B.6", "6.EE.B.7"],
    [
      lesson(
        "additive-situations",
        ["Adding and subtracting", "加法和减法情境"],
        [
          [
            "To write an equation, say in words what happens to the unknown, then write it in symbols. Spending, giving away or getting off takes away; growing, getting more or joining adds. “After spending $\\$12$, Ana has $\\$30$ left” says that what she had minus $12$ is $30$: $m - 12 = 30$.",
            "列方程时，先用语言说出未知数经历了什么，再写成式子。花掉、送出、下车是减少；长高、得到、加入是增加。“花了 $\\$12$ 后还剩 $\\$30$”说的是原有的钱减去 $12$ 等于 $30$：$m - 12 = 30$。",
          ],
          ["With $m = 42$: $42 - 12 = 30$, the money left.", "当 $m = 42$ 时：$42 - 12 = 30$，正是剩下的钱。"],
          [
            "Follow the story, not the order of the numbers. The $12$ is taken from Ana's money, so it is $m - 12$, not $12 - m$.",
            "要按情境写，不要按数出现的顺序写。$12$ 是从 Ana 的钱里减去的，所以是 $m - 12$，不是 $12 - m$。",
          ],
        ],
        (rng) => modelProblem(rng, rng.pick(additiveSituations(rng))),
        tapeFigure(
          [
            {
              total: "m",
              pieces: [
                { size: 30, text: "30" },
                { size: 12, text: "12", dashed: true },
              ],
            },
          ],
          ["A bar m: taking away 12 leaves 30, so m − 12 = 30.", "长条 m：去掉 12 后剩 30，所以 m − 12 = 30。"],
        ),
      ),
      lesson(
        "multiplicative-situations",
        ["Multiplying and dividing", "乘法和除法情境"],
        [
          [
            "Equal groups put together multiply; a whole cut into equal parts divides. “A ribbon cut into $4$ equal pieces of $9$ inches” says that the length divided by $4$ is $9$: $\\frac{r}{4} = 9$.",
            "几个相同的组合起来用乘法，把整体平均分成几份用除法。“一条丝带剪成 $4$ 段，每段 $9$ 英寸”说的是全长除以 $4$ 等于 $9$：$\\frac{r}{4} = 9$。",
          ],
          ["With $r = 36$: $36 \\div 4 = 9$, the length of each piece.", "当 $r = 36$ 时：$36 \\div 4 = 9$，正是每段的长度。"],
          [
            "Cutting into pieces divides the length. $4r = 9$ would make the whole ribbon shorter than one piece.",
            "剪成几段是把全长除以段数。$4r = 9$ 会让整条丝带比一段还短。",
          ],
        ],
        (rng) => modelProblem(rng, rng.pick(multiplicativeSituations(rng))),
        equalTape(4, "9", "r"),
      ),
    ],
  ),
  [
    "A sunflower grew $12$ cm this month and is now $60$ cm tall. We do not know how tall it was before, so we call that height $h$. The story says $h + 12 = 60$.",
    "一株向日葵这个月长高了 $12$ 厘米，现在高 $60$ 厘米。我们不知道它原来多高，就把原来的高度叫做 $h$。题目告诉我们 $h + 12 = 60$。",
  ],
  ["If $h = 48$, then $48 + 12 = 60$, which matches the story.", "如果 $h = 48$，那么 $48 + 12 = 60$，和题目相符。"],
  ["turn stories into one-step equations, with a letter for the unknown.", "用字母表示未知量，把实际问题写成一步方程。"],
);

export const solvingRealWorldProblemsUsingOneStepEquations = withIntro(
  topic(
    "solving-real-world-problems-using-one-step-equations",
    t("Solving Real-World Problems Using One-Step Equations", "用一步方程解决实际问题"),
    t(
      "Write an equation for the situation, solve it, and check that the answer makes sense in the story. A train at 60 miles per hour that covers 240 miles travels for t hours, where 60t = 240, so t = 4 hours.",
      "先为情境列方程，再解方程，最后检查答案是否符合题意。一列火车以每小时 60 英里的速度行驶了 240 英里，行驶时间 t 满足 60t = 240，所以 t = 4 小时。",
    ),
    ["modeling-real-world-problems-using-one-step-equations"],
    ["6.EE.B.7"],
    [
      lesson(
        "additive-situations",
        ["Adding and subtracting", "加法和减法情境"],
        [
          [
            "Write the equation for the story, then solve it by doing the opposite operation to both sides. $14$ passengers got off and $23$ are left: $p - 14 = 23$, so $p = 23 + 14 = 37$ were on before the stop.",
            "先根据情境列方程，再在两边做逆运算求解。下车 $14$ 人后还剩 $23$ 人：$p - 14 = 23$，所以 $p = 23 + 14 = 37$，到站前车上有 $37$ 人。",
          ],
          ["$37 - 14 = 23$, the number left.", "$37 - 14 = 23$，正是剩下的人数。"],
          [
            "Ask whether the answer should be bigger or smaller. People got off, so more were on before: $37$, not $23 - 14 = 9$.",
            "想一想答案应该更大还是更小。有人下车，所以之前人更多：是 $37$，不是 $23 - 14 = 9$。",
          ],
        ],
        (rng) => solveProblem(rng.pick(additiveSituations(rng))),
        tapeFigure(
          [
            {
              total: "p",
              pieces: [
                { size: 23, text: "23" },
                { size: 14, text: "14", dashed: true },
              ],
            },
          ],
          ["A bar p: 14 got off and 23 are left, so p = 23 + 14 = 37.", "长条 p：下车 14 人，还剩 23 人，所以 p = 23 + 14 = 37。"],
        ),
      ),
      lesson(
        "multiplicative-situations",
        ["Multiplying and dividing", "乘法和除法情境"],
        [
          [
            "Write the equation, then undo the multiplication or division. For a fraction of an unknown total, multiply both sides by the reciprocal. $\\frac{3}{4}$ of a class is $18$ students: $\\frac{3}{4}c = 18$, so $c = 18 \\times \\frac{4}{3} = 24$.",
            "先列方程，再用逆运算抵消乘法或除法。已知一个未知总数的几分之几时，两边同时乘这个分数的倒数。全班的 $\\frac{3}{4}$ 是 $18$ 人：$\\frac{3}{4}c = 18$，所以 $c = 18 \\times \\frac{4}{3} = 24$。",
          ],
          [
            "$\\frac{3}{4}$ of $24$: $24 \\div 4 = 6$, and $6 \\times 3 = 18$.",
            "$24$ 的 $\\frac{3}{4}$：$24 \\div 4 = 6$，$6 \\times 3 = 18$。",
          ],
          [
            "A part is smaller than the whole. $18 \\times \\frac{3}{4} = 13.5$ is smaller than $18$, so it cannot be the whole class.",
            "部分比整体小。$18 \\times \\frac{3}{4} = 13.5$ 比 $18$ 还小，不可能是全班人数。",
          ],
        ],
        (rng) => solveProblem(rng.pick(multiplicativeSituations(rng))),
        tapeFigure(
          [{ total: "c = 24", pieces: [0, 1, 2, 3].map((i) => ({ size: 1, text: "6", lit: i < 3 })) }],
          [
            "A bar c in 4 equal parts of 6. Three parts, 3/4 of c, make 18, so c = 24.",
            "长条 c 平均分成 4 份，每份 6。其中 3 份（c 的 3/4）是 18，所以 c = 24。",
          ],
        ),
      ),
    ],
  ),
  [
    "Tickets cost $\\$8$ each, and a group paid $\\$56$. The equation $8n = 56$ tells the story, and solving it tells how many tickets they bought.",
    "每张票 $\\$8$，一个小组一共付了 $\\$56$。方程 $8n = 56$ 表示这个情境，解方程就知道他们买了几张票。",
  ],
  ["$56 \\div 8 = 7$ tickets, and $7 \\times 8 = 56$ dollars.", "$56 \\div 8 = 7$ 张，而 $7 \\times 8 = 56$ 美元。"],
  [
    "write an equation for a story, solve it, and check that the answer fits the story.",
    "为实际问题列方程，解方程，再检验答案是否符合题意。",
  ],
);

// ---------------------------------------------------------------------------
// Inequalities

const holds = (l: Q, op: InequalityOp, r: Q) => ({ "<": l.cmp(r) < 0, "<=": l.cmp(r) <= 0, ">": l.cmp(r) > 0, ">=": l.cmp(r) >= 0 })[op];
const opWords: Record<InequalityOp, Pair> = {
  "<": ["less than", "小于"],
  "<=": ["less than or equal to", "小于或等于"],
  ">": ["greater than", "大于"],
  ">=": ["greater than or equal to", "大于或等于"],
};
const ops: readonly InequalityOp[] = ["<", "<=", ">", ">="];
/** flipped points an inequality the other way; strictness adds or removes the boundary. */
const flipped: Record<InequalityOp, InequalityOp> = { "<": ">", ">": "<", "<=": ">=", ">=": "<=" };
const strictness: Record<InequalityOp, InequalityOp> = { "<": "<=", "<=": "<", ">": ">=", ">=": ">" };
/** includes tells whether a symbol includes its boundary; upward whether its solutions lie to the right. */
const includes = (op: InequalityOp) => op === "<=" || op === ">=";
const upward = (op: InequalityOp) => op === ">" || op === ">=";

export const identifyingSolutionsToLinearInequalities = withIntro(
  topic(
    "identifying-solutions-to-linear-inequalities",
    t("Identifying Solutions to Linear Inequalities", "判断一次不等式的解"),
    t(
      "An inequality such as x > 4 has infinitely many solutions: every number greater than 4, such as 4.1, 5 and 100. The boundary 4 itself is a solution of x ≥ 4 but not of x > 4. To test a value in an inequality such as 3x < 15, substitute it and check whether the statement is true.",
      "像 x > 4 这样的不等式有无数个解：所有大于 4 的数，例如 4.1、5、100。边界 4 是 x ≥ 4 的解，但不是 x > 4 的解。检验一个值是否是 3x < 15 这类不等式的解，把它代入，看不等式是否成立。",
    ),
    ["identifying-solutions-to-linear-equations", "comparing-rational-numbers"],
    ["6.EE.B.5", "6.EE.B.8"],
    [
      lesson(
        "testing-a-value",
        ["Testing a value", "检验一个值"],
        [
          [
            "A value is a solution of an inequality if putting it in makes the inequality true. $\\le$ and $\\ge$ include the boundary; $<$ and $>$ do not. Is $7$ a solution of $x \\le 7$? Yes, $7 \\le 7$ is true. Is it a solution of $x < 7$? No, $7 < 7$ is false.",
            "把一个值代入不等式，如果不等式成立，它就是不等式的解。$\\le$ 和 $\\ge$ 包括边界，$<$ 和 $>$ 不包括。$7$ 是 $x \\le 7$ 的解吗？是，$7 \\le 7$ 成立。它是 $x < 7$ 的解吗？不是，$7 < 7$ 不成立。",
          ],
          [
            "On a number line, the solutions of $x \\le 7$ are $7$ and everything to its left, so $7$ is filled in.",
            "在数轴上，$x \\le 7$ 的解是 $7$ 和它左边的所有数，所以 $7$ 要涂实。",
          ],
          [
            "An inequality has many solutions, not just one. $6$, $0$ and $-2.5$ are all solutions of $x \\le 7$ too.",
            "不等式的解不止一个。$6$、$0$、$-2.5$ 也都是 $x \\le 7$ 的解。",
          ],
        ],
        (rng) => {
          const v = pickVar(rng);
          const op = rng.pick(ops);
          const c = rng.int(-10, 10);
          const value = rng.bool(0.35) ? Q.of(c) : rng.bool() ? Q.of(c + rng.nonZero(-5, 5)) : Q.of(2 * c + rng.pick([-1, 1]), 2);
          const yes = holds(value, op, Q.of(c));
          const shown = value.isInteger() ? value.toString() : dec(value);
          const statement = `${shown} ${relSymbol(op)} ${c}`;
          const side = value.cmp(Q.of(c));
          const where: Pair =
            side === 0
              ? [
                  `$${shown}$ is the boundary itself, which $${relSymbol(op)}$ ${includes(op) ? "includes" : "leaves out"}`,
                  `$${shown}$ 就是边界，$${relSymbol(op)}$ ${includes(op) ? "包括" : "不包括"}它`,
                ]
              : [
                  `On a number line, $${shown}$ lies to the ${side < 0 ? "left" : "right"} of $${c}$, and the solutions lie to the ${upward(op) ? "right" : "left"}`,
                  `在数轴上，$${shown}$ 在 $${c}$ 的${side < 0 ? "左" : "右"}边，而解在 $${c}$ 的${upward(op) ? "右" : "左"}边`,
                ];
          return decided(
            rng,
            [
              `Is $${v} = ${shown}$ a solution of $${inequalityLatex(v, op, c)}$?`,
              `$${v} = ${shown}$ 是 $${inequalityLatex(v, op, c)}$ 的解吗？`,
            ],
            yes,
            [
              [["Substitute", "代入"], [`Put $${shown}$ in place of $${v}$:`, `用 $${shown}$ 代替 $${v}$：`], [statement]],
              [
                ["Decide", "判断"],
                yes
                  ? [`$${statement}$ is true, so $${shown}$ is a solution.`, `$${statement}$ 成立，所以 $${shown}$ 是它的解。`]
                  : [`$${statement}$ is false, so $${shown}$ is not a solution.`, `$${statement}$ 不成立，所以 $${shown}$ 不是它的解。`],
              ],
            ],
            [`${where[0]}, so the answer is ${yes ? "yes" : "no"}.`, `${where[1]}，所以答案是“${yes ? "是" : "否"}”。`],
            yes
              ? [`$${statement}$ is true, so the value works.`, `$${statement}$ 成立，这个值满足不等式。`]
              : side === 0
                ? [
                    `$${statement}$ is false: $${relSymbol(op)}$ leaves out the boundary.`,
                    `$${statement}$ 不成立：$${relSymbol(op)}$ 不包括边界。`,
                  ]
                : [`$${statement}$ is false, so the value does not work.`, `$${statement}$ 不成立，这个值不满足不等式。`],
          );
        },
        numberLineFigure([ray("<=", 7)], 2, 12),
      ),
      lesson(
        "testing-values-in-an-inequality-with-an-operation",
        ["Inequalities with an operation", "含运算的不等式"],
        [
          [
            "Put each value in, work out the expression, and check whether the comparison is true. Which of $3, 4, 5, 6$ is a solution of $2x + 1 > 11$? The left side comes out as $7, 9, 11, 13$, and only $13 > 11$, so $x = 6$.",
            "把每个值代入，算出式子的值，再看不等关系是否成立。$3, 4, 5, 6$ 中哪个是 $2x + 1 > 11$ 的解？左边分别得 $7, 9, 11, 13$，只有 $13 > 11$，所以是 $x = 6$。",
          ],
          [
            "Solve $2x + 1 = 11$ to find the boundary, $x = 5$. The solutions are greater than $5$, and of the four values only $6$ is.",
            "解 $2x + 1 = 11$ 找到边界 $x = 5$。不等式的解大于 $5$，四个值中只有 $6$ 符合。",
          ],
          [
            "A value that gives exactly the right side is not a solution of $>$. $x = 5$ gives $11$, and $11 > 11$ is false.",
            "代入后正好等于右边的值不是 $>$ 的解。$x = 5$ 得 $11$，而 $11 > 11$ 不成立。",
          ],
        ],
        (rng) => {
          for (;;) {
            const v = pickVar(rng);
            const a = rng.int(2, 6);
            const b = rng.int(1, 9);
            const greater = rng.bool();
            const strict = rng.bool();
            const op: InequalityOp = greater ? (strict ? ">" : ">=") : strict ? "<" : "<=";
            const sym = relSymbol(op);
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
            if (good.length !== 1 || candidates.some((x) => x < 0)) continue;
            const s = good[0] ?? 0;
            const left = `${a}${v} + ${b}`;
            return chosenMath(
              rng,
              [`Which value of $${v}$ is a solution of $${left} ${sym} ${c}$?`, `$${v}$ 取哪个值时是 $${left} ${sym} ${c}$ 的解？`],
              String(s),
              candidates
                .filter((x) => x !== s)
                .map(
                  (x): MathWrong =>
                    a * x + b === c
                      ? [
                          String(x),
                          `It gives exactly $${c}$, and $${c} ${sym} ${c}$ is false: the boundary is left out.`,
                          `代入得正好 $${c}$，而 $${c} ${sym} ${c}$ 不成立：不包括边界。`,
                        ]
                      : [
                          String(x),
                          `It gives $${a * x + b}$, and $${a * x + b} ${sym} ${c}$ is false.`,
                          `代入得 $${a * x + b}$，而 $${a * x + b} ${sym} ${c}$ 不成立。`,
                        ],
                ),
              [
                [
                  ["Try each value", "逐个代入"],
                  ["Work out the left side for each choice:", "对每个选项算出左边："],
                  candidates.map((x) => `${a}(${x}) + ${b} = ${a * x + b}`),
                ],
                [
                  ["Compare", "比较"],
                  [
                    `Only $${a * s + b} ${sym} ${c}$ is true, so $${v} = ${s}$.`,
                    `只有 $${a * s + b} ${sym} ${c}$ 成立，所以 $${v} = ${s}$。`,
                  ],
                ],
              ],
              [
                `The boundary is where $${left} = ${c}$, at $${v} = ${s0}$. The solutions are ${opWords[op][0]} $${s0}$, and of the choices only $${s}$ is.`,
                `边界是 $${left} = ${c}$ 的解 $${v} = ${s0}$。不等式的解${opWords[op][1]} $${s0}$，选项中只有 $${s}$ 符合。`,
              ],
            );
          }
        },
        tableFigure(["x = 3", "x = 4", "x = 5", "x = 6"], [7, 9, 11, 13]),
      ),
    ],
  ),
  [
    "A ride says riders must be taller than $120$ cm: $h > 120$. A child who is $125$ cm tall may ride, but a child who is exactly $120$ cm may not.",
    "一个游乐设施要求乘客身高超过 $120$ 厘米：$h > 120$。身高 $125$ 厘米的孩子可以玩，身高正好 $120$ 厘米的孩子不行。",
  ],
  ["$125 > 120$ is true, but $120 > 120$ is false.", "$125 > 120$ 成立，但 $120 > 120$ 不成立。"],
  [
    "test whether a value is a solution of an inequality, with and without an operation on the letter.",
    "判断一个值是不是不等式的解，包括字母带运算的不等式。",
  ],
);

/** inequalityFigure graphs v op c on a number line centered near c. */
function inequalityFigure(op: InequalityOp, c: number): Figure {
  const lo = Math.max(-10, c - 5 - (c % 2 === 0 ? 0 : 1));
  return numberLineFigure([ray(op, c)], lo, lo + 10);
}

export const representingInequalitiesOnNumberLines = withIntro(
  topic(
    "representing-inequalities-on-number-lines",
    t("Representing Inequalities on Number Lines", "在数轴上表示不等式"),
    t(
      "The solutions of an inequality such as x > 2 are shown on a number line by shading every solution. An open circle at 2 shows that 2 is not included (> or <); a closed dot shows that it is included (≥ or ≤). Shading to the right means greater, and shading to the left means less. Note that 5 > x means the same as x < 5.",
      "像 x > 2 这样的不等式，可以在数轴上把所有的解涂色来表示。2 处画空心圈表示不包括 2（> 或 <）；画实心点表示包括 2（≥ 或 ≤）。向右涂色表示大于，向左涂色表示小于。注意 5 > x 与 x < 5 的意思相同。",
    ),
    ["identifying-solutions-to-linear-inequalities"],
    ["6.EE.B.8"],
    [
      lesson(
        "writing-an-inequality-from-a-graph",
        ["Reading a graph", "根据图像写不等式"],
        [
          [
            "On a number line, a dot marks the boundary and the shading shows all the solutions. A filled dot means the boundary is included ($\\le$ or $\\ge$); an open circle means it is not ($<$ or $>$). Shading to the right means greater, and to the left means less. A filled dot at $-3$ shaded to the right shows $x \\ge -3$; an open circle at $4$ shaded to the left shows $x < 4$.",
            "在数轴上，点表示边界，涂色部分表示所有的解。实心点表示包括边界（$\\le$ 或 $\\ge$），空心圈表示不包括（$<$ 或 $>$）。向右涂色表示大于，向左涂色表示小于。$-3$ 处画实心点、向右涂色，表示 $x \\ge -3$；$4$ 处画空心圈、向左涂色，表示 $x < 4$。",
          ],
          ["$0$ is shaded on the first graph, and $0 \\ge -3$ is true.", "第一个图中 $0$ 在涂色部分，而 $0 \\ge -3$ 成立。"],
          [
            "The circle and the direction are two separate choices, so read both. An open circle shaded to the right is $x > c$, not $x \\ge c$.",
            "圆圈和方向是两件事，两样都要看。空心圈、向右涂色是 $x > c$，不是 $x \\ge c$。",
          ],
        ],
        (rng) => {
          const op = rng.pick(ops);
          const c = rng.int(-8, 8);
          const right = upward(op);
          const filled = includes(op);
          const sym = relSymbol(op);
          const test = right ? c + 2 : c - 2;
          const edges: Edge[] = [
            [
              flipped[op],
              c,
              "The shading goes the other way. Shading to the right means greater, and to the left means less.",
              "涂色方向反了。向右涂色表示大于，向左涂色表示小于。",
            ],
            [
              strictness[op],
              c,
              filled
                ? `The dot at $${c}$ is filled in, so $${c}$ is included: the symbol needs the line under it.`
                : `The circle at $${c}$ is open, so $${c}$ is left out: the symbol has no line under it.`,
              filled ? `$${c}$ 处是实心点，包括 $${c}$：符号下面要有一横。` : `$${c}$ 处是空心圈，不包括 $${c}$：符号下面没有一横。`,
            ],
          ];
          return bounded(
            ["Write an inequality in $x$ for the numbers shown on the number line.", "写出表示数轴上所示数的关于 $x$ 的不等式。"],
            "x",
            op,
            c,
            [
              [
                ["Read the circle", "看圆圈"],
                filled
                  ? [
                      `The dot at $${c}$ is filled in, so $${c}$ is included: use $${right ? "\\ge" : "\\le"}$.`,
                      `$${c}$ 处是实心点，包括 $${c}$：用 $${right ? "\\ge" : "\\le"}$。`,
                    ]
                  : [
                      `The circle at $${c}$ is open, so $${c}$ is left out: use $${right ? ">" : "<"}$.`,
                      `$${c}$ 处是空心圈，不包括 $${c}$：用 $${right ? ">" : "<"}$。`,
                    ],
              ],
              [
                ["Read the direction", "看方向"],
                [
                  `The shading goes to the ${right ? "right, toward larger" : "left, toward smaller"} numbers:`,
                  `向${right ? "右" : "左"}涂色，表示${right ? "更大" : "更小"}的数：`,
                ],
                [inequalityLatex("x", op, c)],
              ],
            ],
            [`$${test}$ is shaded, and $${test} ${sym} ${c}$ is true.`, `$${test}$ 在涂色部分，而 $${test} ${sym} ${c}$ 成立。`],
            edges,
            inequalityFigure(op, c),
          );
        },
        drawn(gradeDrawings3["representing-inequalities-on-number-lines#writing-an-inequality-from-a-graph"]),
      ),
      lesson(
        "describing-the-graph-of-an-inequality",
        ["Describing the graph", "描述不等式的图像"],
        [
          [
            "To graph an inequality, first read it starting from the letter. $6 \\ge x$ means $x \\le 6$: a filled dot at $6$, shaded to the left.",
            "画不等式的图像时，先把它改写成从字母读起。$6 \\ge x$ 即 $x \\le 6$：$6$ 处画实心点，向左涂色。",
          ],
          [
            "$0 \\le 6$ is true, and $0$ lies to the left of $6$, so the left side is shaded.",
            "$0 \\le 6$ 成立，而 $0$ 在 $6$ 的左边，所以左边涂色。",
          ],
          [
            "When the number comes first, turn the inequality around. In $6 \\ge x$ the symbol opens toward $6$, but the solutions are less than $6$.",
            "数写在前面时，要把不等式倒过来读。$6 \\ge x$ 的开口朝着 $6$，但解是小于 $6$ 的数。",
          ],
        ],
        (rng) => {
          const v = pickVar(rng);
          const op = rng.pick(ops);
          const c = rng.int(-9, 9);
          const reversed = rng.bool();
          const normal = inequalityLatex(v, op, c);
          const shown = reversed ? `${c} ${relSymbol(flipped[op])} ${v}` : normal;
          const describe = (o: InequalityOp): Pair => [
            `${includes(o) ? "A filled dot" : "An open circle"} at $${c}$, shaded to the ${upward(o) ? "right" : "left"}`,
            `$${c}$ 处画${includes(o) ? "实心点" : "空心圈"}，向${upward(o) ? "右" : "左"}涂色`,
          ];
          const circle: Pair = includes(op)
            ? [`$${normal}$ includes $${c}$, so the dot must be filled in.`, `$${normal}$ 包括 $${c}$，所以要画实心点。`]
            : [`$${normal}$ leaves out $${c}$, so the circle must be open.`, `$${normal}$ 不包括 $${c}$，所以要画空心圈。`];
          const direction: Pair = upward(op)
            ? [
                `$${normal}$ has its solutions on the greater side, to the right of $${c}$.`,
                `$${normal}$ 的解在较大的一侧，即 $${c}$ 的右边。`,
              ]
            : [
                `$${normal}$ has its solutions on the smaller side, to the left of $${c}$.`,
                `$${normal}$ 的解在较小的一侧，即 $${c}$ 的左边。`,
              ];
          const wrong = ops
            .filter((o) => o !== op)
            .map((o): Wrong => {
              const reasons = [includes(o) !== includes(op) && circle, upward(o) !== upward(op) && direction].filter(
                (r): r is Pair => r !== false,
              );
              return [describe(o), reasons.map((r) => r[0]).join(" "), reasons.map((r) => r[1]).join("")];
            });
          const test = upward(op) ? c + 1 : c - 1;
          return chosen(
            rng,
            [`Which describes the graph of $${shown}$ on a number line?`, `$${shown}$ 在数轴上的图像是哪一种？`],
            describe(op),
            wrong,
            [
              [
                ["Start from the letter", "从字母读起"],
                reversed
                  ? [`$${shown}$ means the same as $${normal}$.`, `$${shown}$ 与 $${normal}$ 意思相同。`]
                  : [`The inequality already starts with $${v}$: $${normal}$.`, `不等式已经以 $${v}$ 开头：$${normal}$。`],
              ],
              [
                ["Choose the circle and the direction", "确定圆圈和方向"],
                [`${circle[0]} ${direction[0]}`, `${circle[1]}${direction[1]}`],
              ],
            ],
            [`$${test}$ makes $${shown}$ true, so it is shaded.`, `$${test}$ 使 $${shown}$ 成立，所以它在涂色部分。`],
          );
        },
        drawn(gradeDrawings3["representing-inequalities-on-number-lines#describing-the-graph-of-an-inequality"]),
      ),
    ],
  ),
  [
    "A sign in an elevator says at most $8$ people: $p \\le 8$. On a number line, we put a filled dot at $8$ and shade everything to its left.",
    "电梯里的牌子写着最多 $8$ 人：$p \\le 8$。在数轴上，我们在 $8$ 处画实心点，并把它左边的部分都涂色。",
  ],
  [
    "$8 \\le 8$ is true, so $8$ itself is filled in; $9 \\le 8$ is false, so $9$ is not shaded.",
    "$8 \\le 8$ 成立，所以 $8$ 要涂实；$9 \\le 8$ 不成立，所以 $9$ 不涂色。",
  ],
  ["read an inequality from its graph, and describe the graph of an inequality.", "根据图像写不等式，并描述不等式的图像。"],
);

/** Constraint is a real-world limit described in words and modeled by an inequality, with the key words that set its symbol. */
interface Constraint {
  readonly story: Pair;
  readonly key: Pair;
  readonly variable: string;
  readonly op: InequalityOp;
  readonly value: number;
}

export const modelingRealWorldProblemsUsingInequalities = withIntro(
  topic(
    "modeling-real-world-problems-using-inequalities",
    t("Modeling Real-World Problems Using Inequalities", "用不等式表示实际问题"),
    t(
      "Words such as “at least”, “at most”, “more than” and “fewer than” describe inequalities. “At least 48” includes 48, so it is ≥ 48; “at most 30” is ≤ 30; “more than 12” is > 12; “fewer than 5” is < 5. When each item has a cost, the total cost is the price times the number of items: at most \\$50 for tickets at \\$8 each is 8t ≤ 50.",
      "“至少”“至多”“多于”“少于”等词语描述的是不等关系。“至少 48”包括 48，所以是 ≥ 48；“至多 30”是 ≤ 30；“多于 12”是 > 12；“少于 5”是 < 5。每件物品有价格时，总价是单价乘件数：每张票 8 美元，最多花 50 美元，就是 8t ≤ 50。",
    ),
    ["representing-inequalities-on-number-lines", "constructing-algebraic-expressions"],
    ["6.EE.B.8"],
    [
      lesson(
        "translating-inequality-words",
        ["At least, at most, more than, fewer than", "至少、至多、多于、少于"],
        [
          [
            "Some words describe a limit. “At least” means greater than or equal to ($\\ge$); “at most” and “cannot exceed” mean less than or equal to ($\\le$). “More than”, “above” and “fewer than” leave out the number itself ($>$ and $<$). “Riders must be at least $48$ inches tall” is $h \\ge 48$.",
            "有些词语描述的是限制。“至少”表示大于或等于（$\\ge$）；“至多”“不能超过”表示小于或等于（$\\le$）。“多于”“高于”“少于”不包括这个数本身（$>$ 和 $<$）。“乘客身高必须至少 $48$ 英寸”是 $h \\ge 48$。",
          ],
          [
            "A rider who is exactly $48$ inches tall may ride, and $48 \\ge 48$ is true.",
            "身高正好 $48$ 英寸的乘客可以乘坐，而 $48 \\ge 48$ 成立。",
          ],
          [
            "“At least” uses $\\ge$, not $\\le$: at least $48$ means $48$ or more.",
            "“至少”用 $\\ge$，不用 $\\le$：至少 $48$ 表示 $48$ 或更多。",
          ],
        ],
        (rng) => {
          const cs: Constraint[] = [
            (() => {
              const v = rng.int(40, 54);
              return {
                story: [
                  `To go on a ride, a rider's height $h$ must be at least $${v}$ inches.`,
                  `乘坐某游乐设施，乘客的身高 $h$ 必须至少 $${v}$ 英寸。`,
                ],
                key: ["at least", "至少"],
                variable: "h",
                op: ">=",
                value: v,
              } satisfies Constraint;
            })(),
            (() => {
              const v = rng.int(8, 40);
              return {
                story: [
                  `A room can hold at most $${v}$ people. Let $p$ be the number of people in the room.`,
                  `一个房间至多容纳 $${v}$ 人。设房间里有 $p$ 人。`,
                ],
                key: ["at most", "至多"],
                variable: "p",
                op: "<=",
                value: v,
              } satisfies Constraint;
            })(),
            (() => {
              const v = rng.int(10, 30) * 5;
              return {
                story: [
                  `To get free shipping, an order's total $c$ must be more than $\\$${v}$.`,
                  `订单总额 $c$ 必须多于 $\\$${v}$ 才能免运费。`,
                ],
                key: ["more than", "多于"],
                variable: "c",
                op: ">",
                value: v,
              } satisfies Constraint;
            })(),
            (() => {
              const v = rng.int(3, 12);
              return {
                story: [
                  `A team has fewer than $${v}$ games left. Let $g$ be the number of games left.`,
                  `一支球队剩下的比赛少于 $${v}$ 场。设剩下 $g$ 场比赛。`,
                ],
                key: ["fewer than", "少于"],
                variable: "g",
                op: "<",
                value: v,
              } satisfies Constraint;
            })(),
            (() => {
              const v = rng.int(30, 75);
              return {
                story: [
                  `The speed limit is $${v}$ miles per hour, so a driver's speed $s$ cannot exceed it.`,
                  `限速为每小时 $${v}$ 英里，所以司机的车速 $s$ 不能超过它。`,
                ],
                key: ["cannot exceed", "不能超过"],
                variable: "s",
                op: "<=",
                value: v,
              } satisfies Constraint;
            })(),
            (() => {
              const v = rng.int(2, 10) * 10;
              return {
                story: [
                  `You need a score above $${v}$ points to win a prize. Let $x$ be your score.`,
                  `得分要高于 $${v}$ 分才能获奖。设你的得分为 $x$。`,
                ],
                key: ["above", "高于"],
                variable: "x",
                op: ">",
                value: v,
              } satisfies Constraint;
            })(),
          ];
          const c = rng.pick(cs);
          const sym = relSymbol(c.op);
          const inside = includes(c.op);
          return bounded(
            [`${c.story[0]} Write an inequality for $${c.variable}$.`, `${c.story[1]}写出关于 $${c.variable}$ 的不等式。`],
            c.variable,
            c.op,
            c.value,
            [
              [
                ["Find the key words", "找关键词"],
                [`“${c.key[0]}” means ${opWords[c.op][0]}, $${sym}$.`, `“${c.key[1]}”表示${opWords[c.op][1]}，即 $${sym}$。`],
              ],
              [["Write the inequality", "写出不等式"], ["", ""], [inequalityLatex(c.variable, c.op, c.value)]],
            ],
            [
              `$${c.value}$ itself is ${inside ? "" : "not "}allowed by “${c.key[0]}”, and $${c.value} ${sym} ${c.value}$ is ${inside ? "true" : "false"}.`,
              `“${c.key[1]}”${inside ? "包括" : "不包括"} $${c.value}$ 本身，而 $${c.value} ${sym} ${c.value}$ ${inside ? "成立" : "不成立"}。`,
            ],
            [
              [
                flipped[c.op],
                c.value,
                `That points the wrong way. “${c.key[0]}” means ${opWords[c.op][0]}.`,
                `方向反了。“${c.key[1]}”表示${opWords[c.op][1]}。`,
              ],
              [
                strictness[c.op],
                c.value,
                inside
                  ? `“${c.key[0]}” includes $${c.value}$ itself, so the symbol needs the line under it.`
                  : `“${c.key[0]}” leaves out $${c.value}$ itself, so the symbol has no line under it.`,
                inside
                  ? `“${c.key[1]}”包括 $${c.value}$ 本身，所以符号下面要有一横。`
                  : `“${c.key[1]}”不包括 $${c.value}$ 本身，所以符号下面没有一横。`,
              ],
            ],
          );
        },
        numberLineFigure([ray(">=", 48)], 43, 53),
      ),
      lesson(
        "inequalities-with-a-rate",
        ["Totals with a price or rate", "含单价或速率的总量"],
        [
          [
            "When each item costs the same, the total is the price times the number of items. Write that total, then compare it with the limit. With at most $\\$50$ to spend on $\\$8$ tickets, $t$ tickets cost $8t$, so $8t \\le 50$.",
            "每件物品价格相同时，总价是单价乘件数。先写出总量，再和限制比较。最多花 $\\$50$ 买每张 $\\$8$ 的票，$t$ 张票共 $8t$ 美元，所以 $8t \\le 50$。",
          ],
          [
            "$6$ tickets cost $48$, and $48 \\le 50$ is true; $7$ tickets cost $56$, which is too much.",
            "$6$ 张票要 $48$ 美元，$48 \\le 50$ 成立；$7$ 张要 $56$ 美元，超出了。",
          ],
          [
            "Compare the total, not the number of items. $t \\le 50$ would allow $50$ tickets.",
            "要比较总价，不是比较件数。$t \\le 50$ 会允许买 $50$ 张票。",
          ],
        ],
        (rng) => {
          const a = rng.int(3, 15);
          const b = rng.int(4, 12) * 10;
          const kind = rng.int(0, 2);
          const story: { readonly text: Pair; readonly v: string; readonly op: InequalityOp } =
            kind === 0
              ? {
                  text: [
                    `Tickets cost $\\$${a}$ each, and Mia can spend at most $\\$${b}$. Let $t$ be the number of tickets she buys.`,
                    `每张票 $\\$${a}$，Mia 最多能花 $\\$${b}$。设她买 $t$ 张票。`,
                  ],
                  v: "t",
                  op: "<=",
                }
              : kind === 1
                ? {
                    text: [
                      `A box weighs $${a}$ pounds, and the total load in an elevator must be less than $${b * 10}$ pounds. Let $n$ be the number of boxes loaded.`,
                      `每个箱子重 $${a}$ 磅，电梯里的总重必须小于 $${b * 10}$ 磅。设装了 $n$ 个箱子。`,
                    ],
                    v: "n",
                    op: "<",
                  }
                : {
                    text: [
                      `Jo earns $\\$${a}$ per hour and wants to earn at least $\\$${b}$. Let $h$ be the number of hours Jo works.`,
                      `Jo 每小时挣 $\\$${a}$，她想至少挣 $\\$${b}$。设她工作 $h$ 小时。`,
                    ],
                    v: "h",
                    op: ">=",
                  };
          const limit = kind === 1 ? b * 10 : b;
          const sym = relSymbol(story.op);
          const right = (lhs: string, op: InequalityOp) => `${lhs} ${relSymbol(op)} ${limit}`;
          const correct = right(`${a}${story.v}`, story.op);
          const n0 = story.op === "<=" ? Math.floor(limit / a) : story.op === "<" ? Math.ceil(limit / a) - 1 : Math.ceil(limit / a);
          return chosenMath(
            rng,
            [`${story.text[0]} Which inequality models this situation?`, `${story.text[1]}哪个不等式能表示这个情境？`],
            correct,
            [
              [
                right(`${a}${story.v}`, flipped[story.op]),
                `That turns the limit around. The total must be ${opWords[story.op][0]} $${limit}$.`,
                `这把限制反过来了。总量必须${opWords[story.op][1]} $${limit}$。`,
              ],
              [
                right(`${story.v} + ${a}`, story.op),
                `That adds $${a}$ once. Each one adds $${a}$, so the total is $${a}${story.v}$.`,
                `这只加了一次 $${a}$。每个都是 $${a}$，所以总量是 $${a}${story.v}$。`,
              ],
              [
                right(`\\frac{${story.v}}{${a}}`, story.op),
                `That divides. The total for $${story.v}$ of them is $${a}$ times $${story.v}$.`,
                `这是除法。$${story.v}$ 个的总量是 $${a}$ 乘 $${story.v}$。`,
              ],
            ],
            [
              [
                ["Write the total", "写出总量"],
                [
                  `Each one is $${a}$, so $${story.v}$ of them make $${a}${story.v}$.`,
                  `每个是 $${a}$，$${story.v}$ 个就是 $${a}${story.v}$。`,
                ],
              ],
              [
                ["Compare with the limit", "和限制比较"],
                [`The total must be ${opWords[story.op][0]} $${limit}$:`, `总量必须${opWords[story.op][1]} $${limit}$：`],
                [correct],
              ],
            ],
            [
              `Try $${story.v} = ${n0}$: $${a} \\times ${n0} = ${a * n0}$, and $${a * n0} ${sym} ${limit}$ is true, so $${n0}$ fits the story.`,
              `取 $${story.v} = ${n0}$：$${a} \\times ${n0} = ${a * n0}$，而 $${a * n0} ${sym} ${limit}$ 成立，符合题意。`,
            ],
          );
        },
        lineFigure(
          {
            lo: 0,
            hi: 56,
            step: 8,
            labels: [0, 48],
            jumps: [
              [0, 8],
              [8, 16],
              [16, 24],
              [24, 32],
              [32, 40],
              [40, 48],
            ],
            marks: [{ at: 50, text: "50", result: true }],
          },
          [
            "Six jumps of 8 reach 48, just under the limit of 50; a seventh jump would pass it.",
            "跳 6 次、每次 8，到 48，没超过 50；再跳一次就超过了。",
          ],
        ),
      ),
    ],
  ),
  [
    "Mia has $\\$20$ to spend on stickers that cost $\\$3$ each. She can buy $s$ stickers as long as $3s \\le 20$.",
    "Mia 有 $\\$20$，要买每张 $\\$3$ 的贴纸。只要 $3s \\le 20$，她就能买 $s$ 张。",
  ],
  [
    "$6$ stickers cost $18$ dollars, and $18 \\le 20$; $7$ cost $21$, which is more than $20$.",
    "$6$ 张要 $18$ 美元，$18 \\le 20$；$7$ 张要 $21$ 美元，超过了 $20$。",
  ],
  [
    "turn words such as “at least” and “at most” into inequalities, including totals with a price or a rate.",
    "把“至少”“至多”等说法写成不等式，包括含单价或速率的总量。",
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
  readonly xWords: Pair;
  readonly yWords: Pair;
}

/** relations builds real-world equations in two variables. */
function relations(rng: Rng): Relation[] {
  const k = rng.int(2, 12);
  const b = rng.int(2, 20);
  const grow = Math.min(k, 6);
  return [
    {
      x: "h",
      y: "e",
      k: k + 5,
      b: 0,
      en: `A lifeguard earns $\\$${k + 5}$ per hour. Her earnings $e$, in dollars, after working $h$ hours are given by $e = ${k + 5}h$.`,
      zh: `一名救生员每小时挣 $\\$${k + 5}$。她工作 $h$ 小时的收入 $e$（美元）为 $e = ${k + 5}h$。`,
      xWords: ["the number of hours worked", "工作的小时数"],
      yWords: ["the earnings", "收入"],
    },
    {
      x: "m",
      y: "c",
      k,
      b,
      en: `A bike rental costs $\\$${b}$ plus $\\$${k}$ per hour. The cost $c$, in dollars, of renting for $m$ hours is $c = ${k}m + ${b}$.`,
      zh: `租自行车的费用是 $\\$${b}$ 加上每小时 $\\$${k}$。租 $m$ 小时的费用 $c$（美元）为 $c = ${k}m + ${b}$。`,
      xWords: ["the number of hours", "租用的小时数"],
      yWords: ["the cost", "费用"],
    },
    {
      x: "w",
      y: "h",
      k: grow,
      b: b + 10,
      en: `A plant is $${b + 10}$ cm tall and grows $${grow}$ cm per week. Its height $h$, in cm, after $w$ weeks is $h = ${grow}w + ${b + 10}$.`,
      zh: `一株植物高 $${b + 10}$ 厘米，每周长高 $${grow}$ 厘米。$w$ 周后它的高度 $h$（厘米）为 $h = ${grow}w + ${b + 10}$。`,
      xWords: ["the number of weeks", "周数"],
      yWords: ["the height", "高度"],
    },
    {
      x: "t",
      y: "d",
      k: k * 5,
      b: 0,
      en: `A car travels at $${k * 5}$ miles per hour. The distance $d$, in miles, it travels in $t$ hours is $d = ${k * 5}t$.`,
      zh: `一辆汽车以每小时 $${k * 5}$ 英里的速度行驶。它 $t$ 小时行驶的路程 $d$（英里）为 $d = ${k * 5}t$。`,
      xWords: ["the time", "时间"],
      yWords: ["the distance", "路程"],
    },
  ];
}

/** capitalize writes the first letter of a phrase as a capital. */
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const introductionToTwoVariableEquations = withIntro(
  topic(
    "introduction-to-two-variable-equations",
    t("Introduction to Two-Variable Equations", "二元方程入门"),
    t(
      "An equation such as c = 3m + 5 relates two quantities. The independent variable (here m) is the one we choose; the dependent variable (here c) depends on it. To find the dependent variable, substitute the value of the independent variable: for m = 4, c = 3 × 4 + 5 = 17.",
      "像 c = 3m + 5 这样的方程把两个量联系起来。自变量（这里是 m）是可以自己选定的量；因变量（这里是 c）随它变化。要求因变量，就把自变量的值代入：当 m = 4 时，c = 3 × 4 + 5 = 17。",
    ),
    ["evaluating-linear-expressions"],
    ["6.EE.C.9"],
    [
      lesson(
        "finding-the-dependent-variable",
        ["Finding the dependent variable", "求因变量"],
        [
          [
            "An equation such as $d = 55t$ links two quantities. To find one of them, put the value of the other in and work it out. After $3$ hours, $d = 55 \\times 3 = 165$ miles.",
            "像 $d = 55t$ 这样的方程把两个量联系起来。要求其中一个，就把另一个的值代入算出来。$3$ 小时后，$d = 55 \\times 3 = 165$ 英里。",
          ],
          [
            "Count up by $55$: $55$, $110$, $165$ after $1$, $2$ and $3$ hours.",
            "每次加 $55$：$1$、$2$、$3$ 小时后分别是 $55$、$110$、$165$。",
          ],
          [
            "In $c = 4m + 6$, multiply before adding. For $m = 2$, $c = 8 + 6 = 14$, not $4 \\times 8 = 32$.",
            "在 $c = 4m + 6$ 中，要先乘后加。$m = 2$ 时，$c = 8 + 6 = 14$，不是 $4 \\times 8 = 32$。",
          ],
        ],
        (rng) => {
          const r = rng.pick(relations(rng));
          const x = rng.int(2, 10);
          const y = r.k * x + r.b;
          return valued(
            [`${r.en} Find $${r.y}$ when $${r.x} = ${x}$.`, `${r.zh}当 $${r.x} = ${x}$ 时，求 $${r.y}$。`],
            y,
            [
              [
                ["Substitute", "代入"],
                [`Put $${x}$ in place of $${r.x}$:`, `用 $${x}$ 代替 $${r.x}$：`],
                [r.b ? `${r.y} = ${r.k} \\times ${x} + ${r.b}` : `${r.y} = ${r.k} \\times ${x}`],
              ],
              [
                ["Work it out", "算出结果"],
                r.b ? ["Multiply first, then add:", "先乘，再加："] : ["Multiply:", "相乘："],
                [r.b ? `${r.y} = ${r.k * x} + ${r.b} = ${y}` : `${r.y} = ${y}`],
              ],
            ],
            [
              `Each extra $1$ in $${r.x}$ adds $${r.k}$. At $${r.x} = ${x - 1}$, $${r.y} = ${y - r.k}$, and $${y - r.k} + ${r.k} = ${y}$.`,
              `$${r.x}$ 每增加 $1$，$${r.y}$ 就增加 $${r.k}$。$${r.x} = ${x - 1}$ 时 $${r.y} = ${y - r.k}$，而 $${y - r.k} + ${r.k} = ${y}$。`,
            ],
            [
              [
                r.k + x + r.b,
                `That adds $${r.k}$ and $${x}$. $${r.k}${r.x}$ means $${r.k}$ times $${r.x}$.`,
                `这是把 $${r.k}$ 和 $${x}$ 相加。$${r.k}${r.x}$ 表示 $${r.k}$ 乘 $${r.x}$。`,
              ],
              [
                r.k * (x + r.b),
                `That adds $${r.b}$ before multiplying. Multiply first, then add.`,
                `这是先加 $${r.b}$ 再乘。应该先乘后加。`,
              ],
              [r.k * x, `That leaves out the $${r.b}$ that is added on.`, `这漏掉了要加上的 $${r.b}$。`],
              [x, `That is the value of $${r.x}$, not of $${r.y}$.`, `这是 $${r.x}$ 的值，不是 $${r.y}$ 的值。`],
            ],
          );
        },
        tableFigure(["t = 1", "t = 2", "t = 3"], [55, 110, 165]),
      ),
      lesson(
        "independent-and-dependent-variables",
        ["Independent and dependent variables", "自变量与因变量"],
        [
          [
            "In $e = 15h$, the earnings depend on the hours worked. The quantity we choose, $h$, is the independent variable; the quantity worked out from it, $e$, is the dependent variable.",
            "在 $e = 15h$ 中，收入取决于工作的小时数。我们选定的量 $h$ 是自变量；由它算出来的量 $e$ 是因变量。",
          ],
          ["Choose $h = 2$: then $e = 15 \\times 2 = 30$ is worked out from it.", "选定 $h = 2$：由它算出 $e = 15 \\times 2 = 30$。"],
          [
            "The dependent variable is the one written alone, worked out from the other. In $e = 15h$, $e$ stands alone, so $e$ depends on $h$.",
            "因变量是单独写在一边、由另一个量算出来的那个。$e = 15h$ 中 $e$ 单独在一边，所以 $e$ 取决于 $h$。",
          ],
        ],
        (rng) => {
          const r = rng.pick(relations(rng));
          const askDependent = rng.bool();
          const xOption: Pair = [`$${r.x}$, ${r.xWords[0]}`, `$${r.x}$，${r.xWords[1]}`];
          const yOption: Pair = [`$${r.y}$, ${r.yWords[0]}`, `$${r.y}$，${r.yWords[1]}`];
          const rule = r.b ? `${r.y} = ${r.k}${r.x} + ${r.b}` : `${r.y} = ${r.k}${r.x}`;
          return chosen(
            rng,
            askDependent
              ? [`${r.en} Which is the dependent variable?`, `${r.zh}哪个是因变量？`]
              : [`${r.en} Which is the independent variable?`, `${r.zh}哪个是自变量？`],
            askDependent ? yOption : xOption,
            [
              askDependent
                ? [
                    xOption,
                    `$${r.x}$ is the one we choose, so it is the independent variable.`,
                    `$${r.x}$ 是我们选定的量，所以它是自变量。`,
                  ]
                : [
                    yOption,
                    `$${r.y}$ is worked out from $${r.x}$, so it is the dependent variable.`,
                    `$${r.y}$ 是由 $${r.x}$ 算出来的，所以它是因变量。`,
                  ],
            ],
            [
              [
                ["Ask what depends on what", "看谁取决于谁"],
                [`${capitalize(r.yWords[0])} depends on ${r.xWords[0]}.`, `${r.yWords[1]}取决于${r.xWords[1]}。`],
              ],
              [
                ["Name the variables", "说出变量"],
                [
                  `So $${r.x}$ is the independent variable and $${r.y}$ is the dependent variable.`,
                  `所以 $${r.x}$ 是自变量，$${r.y}$ 是因变量。`,
                ],
              ],
            ],
            [
              `In $${rule}$, we choose $${r.x}$ and work out $${r.y}$ from it, and $${r.y}$ stands alone.`,
              `在 $${rule}$ 中，我们选定 $${r.x}$，再由它算出 $${r.y}$，$${r.y}$ 单独在一边。`,
            ],
          );
        },
        tableFigure(["h = 1", "h = 2", "h = 3"], [15, 30, 45]),
      ),
    ],
  ),
  [
    "A bike rental costs $\\$5$ plus $\\$3$ an hour, so the cost for $m$ hours is $c = 3m + 5$. When the hours change, the cost changes too.",
    "租自行车要 $\\$5$，再加每小时 $\\$3$，所以租 $m$ 小时的费用是 $c = 3m + 5$。小时数变了，费用也跟着变。",
  ],
  ["For $m = 4$: $c = 3 \\times 4 + 5 = 17$ dollars.", "当 $m = 4$ 时：$c = 3 \\times 4 + 5 = 17$ 美元。"],
  [
    "find the dependent variable from the independent one, and tell which is which.",
    "由自变量求因变量，并分清哪个是自变量、哪个是因变量。",
  ],
);

export const twoVariableEquationsSolvingForTheIndependentVariable = withIntro(
  topic(
    "two-variable-equations-solving-for-the-independent-variable",
    t("Two-Variable Equations: Solving for the Independent Variable", "二元方程：求自变量"),
    t(
      "When the dependent variable is known, substitute it and solve a one-step equation for the independent variable. If d = 60t and d = 240, then 60t = 240, so t = 4. If c = m + 15 and c = 40, then m = 40 − 15 = 25.",
      "已知因变量时，把它代入，再解一步方程求自变量。如果 d = 60t，d = 240，那么 60t = 240，所以 t = 4。如果 c = m + 15，c = 40，那么 m = 40 − 15 = 25。",
    ),
    ["introduction-to-two-variable-equations", "one-step-multiplication-equations", "one-step-addition-equations"],
    ["6.EE.C.9", "6.EE.B.7"],
    [
      lesson(
        "proportional-equations",
        ["Equations of the form y = kx", "形如 y = kx 的方程"],
        [
          [
            "When the dependent variable is known, put it in and solve the one-step equation that is left. For $y = kx$, divide by $k$. $e = 18h$ and $e = 126$ give $126 = 18h$, so $h = 126 \\div 18 = 7$ hours.",
            "已知因变量时，把它代入，再解剩下的一步方程。对于 $y = kx$，两边同时除以 $k$。$e = 18h$，$e = 126$，得 $126 = 18h$，所以 $h = 126 \\div 18 = 7$ 小时。",
          ],
          ["$18 \\times 7 = 126$.", "$18 \\times 7 = 126$。"],
          [
            "Put the known value in the right place. $126$ is $e$, not $h$, so the equation is $126 = 18h$, not $e = 18 \\times 126$.",
            "已知的值要代到正确的位置。$126$ 是 $e$ 的值，不是 $h$ 的值，所以方程是 $126 = 18h$，不是 $e = 18 \\times 126$。",
          ],
        ],
        (rng) => {
          const r = rng.pick(relations(rng).filter((x) => x.b === 0));
          const x = rng.int(2, 12);
          const y = r.k * x;
          return valued(
            [`${r.en} Find $${r.x}$ when $${r.y} = ${y}$.`, `${r.zh}当 $${r.y} = ${y}$ 时，求 $${r.x}$。`],
            x,
            [
              [["Substitute", "代入"], [`Put $${y}$ in place of $${r.y}$:`, `用 $${y}$ 代替 $${r.y}$：`], [`${y} = ${r.k}${r.x}`]],
              [
                ["Undo the multiplication", "抵消乘法"],
                [`Divide both sides by $${r.k}$:`, `两边同时除以 $${r.k}$：`],
                [`${r.x} = ${y} \\div ${r.k} = ${x}`],
              ],
            ],
            [`$${r.k} \\times ${x} = ${y}$, the value of $${r.y}$ we were given.`, `$${r.k} \\times ${x} = ${y}$，正是已知的 $${r.y}$。`],
            [
              [
                y * r.k,
                `That puts $${y}$ in for $${r.x}$ and multiplies. $${y}$ is the value of $${r.y}$, so divide.`,
                `这是把 $${y}$ 当成 $${r.x}$ 再相乘。$${y}$ 是 $${r.y}$ 的值，应该除。`,
              ],
              [
                y - r.k,
                `That subtracts $${r.k}$. $${r.k}${r.x}$ means $${r.k}$ times $${r.x}$, so divide.`,
                `这是减去了 $${r.k}$。$${r.k}${r.x}$ 表示 $${r.k}$ 乘 $${r.x}$，所以要除。`,
              ],
            ],
          );
        },
        equalTape(7, "18", "126"),
      ),
      lesson(
        "additive-equations",
        ["Equations of the form y = x + b", "形如 y = x + b 的方程"],
        [
          [
            "For an equation like $b = a + 4$, put in the known value and subtract. Ben is always $4$ years older than Ava: when $b = 15$, $15 = a + 4$, so $a = 15 - 4 = 11$.",
            "对于 $b = a + 4$ 这样的方程，代入已知的值，再减去。Ben 总是比 Ava 大 $4$ 岁：当 $b = 15$ 时，$15 = a + 4$，所以 $a = 15 - 4 = 11$。",
          ],
          ["$11 + 4 = 15$, Ben's age.", "$11 + 4 = 15$，正是 Ben 的年龄。"],
          [
            "Ava is younger, so her age is less than $15$. Adding, $15 + 4 = 19$, goes the wrong way.",
            "Ava 更小，所以她的年龄小于 $15$。用加法算 $15 + 4 = 19$ 就反了。",
          ],
        ],
        (rng) => {
          const d = rng.int(2, 9);
          const x = rng.int(5, 40);
          const kind = rng.bool();
          const prompt: Pair = kind
            ? [
                `Ben is always $${d}$ years older than Ava, so $b = a + ${d}$, where $b$ is Ben's age and $a$ is Ava's age. Find $a$ when $b = ${x + d}$.`,
                `Ben 总是比妹妹 Ava 大 $${d}$ 岁，所以 $b = a + ${d}$，其中 $b$ 是 Ben 的年龄，$a$ 是 Ava 的年龄。当 $b = ${x + d}$ 时，求 $a$。`,
              ]
            : [
                `A shop sells a phone case for $\\$${d}$ more than it paid, so $s = p + ${d}$, where $s$ is the selling price and $p$ is the price paid, in dollars. Find $p$ when $s = ${x + d}$.`,
                `一家店卖手机壳的售价比进价高 $\\$${d}$，所以 $s = p + ${d}$，其中 $s$ 是售价，$p$ 是进价（美元）。当 $s = ${x + d}$ 时，求 $p$。`,
              ];
          const [xv, yv] = kind ? ["a", "b"] : ["p", "s"];
          return valued(
            prompt,
            x,
            [
              [
                ["Substitute", "代入"],
                [`Put $${x + d}$ in place of $${yv}$:`, `用 $${x + d}$ 代替 $${yv}$：`],
                [`${x + d} = ${xv} + ${d}`],
              ],
              [
                ["Undo the addition", "抵消加法"],
                [`Subtract $${d}$ from both sides:`, `两边同时减去 $${d}$：`],
                [`${xv} = ${x + d} - ${d} = ${x}`],
              ],
            ],
            [`$${x} + ${d} = ${x + d}$, the value of $${yv}$ we were given.`, `$${x} + ${d} = ${x + d}$，正是已知的 $${yv}$。`],
            [
              [
                x + 2 * d,
                `That adds $${d}$ instead of subtracting it. $${xv}$ is the smaller one.`,
                `这是加上了 $${d}$，应该减去。$${xv}$ 是较小的那个。`,
              ],
              [x + d, `That is the value of $${yv}$ we were given, not $${xv}$.`, `这是已知的 $${yv}$ 的值，不是 $${xv}$。`],
            ],
          );
        },
        tapeFigure(
          [
            {
              total: "15",
              pieces: [
                { size: 11, text: "a" },
                { size: 4, text: "4", lit: true },
              ],
            },
          ],
          ["A bar of 15 made of a and 4, so a = 15 − 4 = 11.", "总长 15 的长条由 a 和 4 组成，所以 a = 15 − 4 = 11。"],
        ),
      ),
    ],
  ),
  [
    "A car travels at $60$ miles an hour, so $d = 60t$. How long does it take to go $240$ miles? Put $240$ in for $d$: $240 = 60t$.",
    "一辆汽车每小时行驶 $60$ 英里，所以 $d = 60t$。行驶 $240$ 英里要多长时间？把 $240$ 代入 $d$：$240 = 60t$。",
  ],
  ["$240 \\div 60 = 4$ hours, and $60 \\times 4 = 240$.", "$240 \\div 60 = 4$ 小时，而 $60 \\times 4 = 240$。"],
  ["put in a known value of the dependent variable and solve for the independent one.", "代入已知的因变量，求出自变量。"],
);

/** tableLatex writes a two-row table of values. */
function tableLatex(x: string, y: string, xs: readonly string[], ys: readonly string[]): string {
  return `\\begin{array}{|c|${xs.map(() => "c").join("|")}|}\\hline ${x} & ${xs.join(" & ")} \\\\ \\hline ${y} & ${ys.join(" & ")} \\\\ \\hline\\end{array}`;
}

export const analyzingTwoVariableEquationsUsingTables = withIntro(
  topic(
    "analyzing-two-variable-equations-using-tables",
    t("Analyzing Two-Variable Equations Using Tables", "用表格分析二元方程"),
    t(
      "A table lists pairs of values that satisfy an equation. For y = 4x, the pairs are (1, 4), (2, 8), (3, 12), …. To find the equation from a table, look for the rule that turns each x into its y: if every y is 4 times x, then y = 4x; if every y is 6 more than x, then y = x + 6.",
      "表格列出满足方程的数对。对于 y = 4x，数对是 (1, 4)、(2, 8)、(3, 12)……从表格找方程时，寻找把每个 x 变成对应 y 的规律：如果每个 y 都是 x 的 4 倍，则 y = 4x；如果每个 y 都比 x 大 6，则 y = x + 6。",
    ),
    ["introduction-to-two-variable-equations", "ratio-tables"],
    ["6.EE.C.9"],
    [
      lesson(
        "completing-a-table",
        ["Completing a table", "补全表格"],
        [
          [
            "Each column of the table is a pair of values that fits the equation. To fill a gap, put that column's $x$ into the equation. For $y = 3x + 1$ and $x = 5$, $y = 3 \\times 5 + 1 = 16$.",
            "表中每一列都是满足方程的一对值。要填空缺，就把这一列的 $x$ 代入方程。对于 $y = 3x + 1$，当 $x = 5$ 时，$y = 3 \\times 5 + 1 = 16$。",
          ],
          [
            "Each step of $1$ in $x$ adds $3$ to $y$: after $13$ at $x = 4$ comes $16$.",
            "$x$ 每增加 $1$，$y$ 就增加 $3$：$x = 4$ 时是 $13$，下一个是 $16$。",
          ],
          [
            "The $x$ values may jump by more than $1$. Put in the column's own $x$ rather than adding $3$ to the last value.",
            "$x$ 的值可能一次增加不止 $1$。要代入这一列自己的 $x$，不要只在前一个值上加 $3$。",
          ],
        ],
        (rng) => {
          const k = rng.int(2, 9);
          const b = rng.bool() ? 0 : rng.int(1, 9);
          const start = rng.int(0, 4);
          const xs = [0, 1, 2, 3].map((i) => start + i * rng.pick([1, 1, 2]) + i);
          const ys = xs.map((x) => k * x + b);
          const hole = rng.int(1, 3);
          const [xh, yh, xp, yp] = [xs[hole] ?? 0, ys[hole] ?? 0, xs[hole - 1] ?? 0, ys[hole - 1] ?? 0];
          const eq = b ? `y = ${k}x + ${b}` : `y = ${k}x`;
          const table = tableLatex(
            "x",
            "y",
            xs.map(String),
            ys.map((y, i) => (i === hole ? "?" : String(y))),
          );
          return valued(
            [
              `The table shows values of $${eq}$. What is the missing value? $$${table}$$`,
              `表格列出 $${eq}$ 的一些值。缺少的值是多少？$$${table}$$`,
            ],
            yh,
            [
              [
                ["Find the column", "找到这一列"],
                [`The missing value is under $x = ${xh}$.`, `空缺的值在 $x = ${xh}$ 下面。`],
              ],
              [
                ["Substitute", "代入"],
                [`Put $${xh}$ in place of $x$:`, `用 $${xh}$ 代替 $x$：`],
                [`y = ${k} \\times ${xh}${b ? ` + ${b}` : ""} = ${yh}`],
              ],
            ],
            [
              `Each step of $1$ in $x$ adds $${k}$ to $y$. From $x = ${xp}$ to $x = ${xh}$ is $${xh - xp}$ step${xh - xp === 1 ? "" : "s"}: $${yp} + ${k} \\times ${xh - xp} = ${yh}$.`,
              `$x$ 每增加 $1$，$y$ 就增加 $${k}$。从 $x = ${xp}$ 到 $x = ${xh}$ 增加了 $${xh - xp}$：$${yp} + ${k} \\times ${xh - xp} = ${yh}$。`,
            ],
            [
              [k * (xh + b), `That adds $${b}$ before multiplying. Multiply first, then add.`, `这是先加 $${b}$ 再乘。应该先乘后加。`],
              [
                yp + k,
                `That adds $${k}$ to the value before it, but $x$ goes up by $${xh - xp}$ here.`,
                `这是在前一个值上加 $${k}$，但这里 $x$ 增加了 $${xh - xp}$。`,
              ],
              [k + xh + b, `That adds $${k}$ instead of multiplying by it.`, `这是加上了 $${k}$，应该乘 $${k}$。`],
            ],
          );
        },
        tableFigure(["x = 3", "x = 4", "x = 5"], [10, 13, null]),
      ),
      lesson(
        "writing-the-equation-from-a-table",
        ["Writing the equation", "写出方程"],
        [
          [
            "To find the equation, look for one rule that turns every $x$ into its $y$. If $x = 2, 5, 7$ give $y = 10, 25, 35$, each $y$ is $5$ times $x$, so $y = 5x$. If they give $y = 8, 11, 13$, each $y$ is $6$ more than $x$, so $y = x + 6$.",
            "找方程，就是找一条把每个 $x$ 都变成对应 $y$ 的规律。如果 $x = 2, 5, 7$ 对应 $y = 10, 25, 35$，每个 $y$ 都是 $x$ 的 $5$ 倍，所以 $y = 5x$。如果对应 $y = 8, 11, 13$，每个 $y$ 都比 $x$ 大 $6$，所以 $y = x + 6$。",
          ],
          [
            "$5 \\times 7 = 35$ and $7 + 6 = 13$: both rules work on the last column too.",
            "$5 \\times 7 = 35$，$7 + 6 = 13$：两条规律对最后一列也成立。",
          ],
          [
            "A rule must fit every column. $y = x + 8$ fits $2 \\to 10$, but $5 + 8$ is not $25$.",
            "规律必须对每一列都成立。$y = x + 8$ 符合 $2 \\to 10$，但 $5 + 8$ 不等于 $25$。",
          ],
        ],
        (rng) => {
          const multiplicative = rng.bool();
          const k = rng.int(2, 9);
          const xs = rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 4).sort((a, b) => a - b);
          const ys = xs.map((x) => (multiplicative ? k * x : x + k));
          const [x0, y0, x3, y3] = [xs[0] ?? 0, ys[0] ?? 0, xs[3] ?? 0, ys[3] ?? 0];
          const answer = multiplicative ? `${k}x` : `x + ${k}`;
          const table = tableLatex("x", "y", xs.map(String), ys.map(String));
          const saids: Said[] = multiplicative
            ? [
                [
                  `x + ${y0 - x0}`,
                  `That fits the first column only. For $x = ${x3}$ it gives $${x3 + y0 - x0}$, not $${y3}$.`,
                  `这只符合第一列。$x = ${x3}$ 时得 $${x3 + y0 - x0}$，不是 $${y3}$。`,
                ],
                [
                  `\\frac{x}{${k}}`,
                  "That divides. Each $y$ is bigger than its $x$, so multiply.",
                  "这是除法。每个 $y$ 都比对应的 $x$ 大，所以要乘。",
                ],
              ]
            : [
                [
                  `${Math.round(y0 / x0)}x`,
                  `That treats the first column as a multiple. For $x = ${x3}$ it gives $${Math.round(y0 / x0) * x3}$, not $${y3}$.`,
                  `这是把第一列看成了倍数关系。$x = ${x3}$ 时得 $${Math.round(y0 / x0) * x3}$，不是 $${y3}$。`,
                ],
                [`x - ${k}`, `That subtracts. Each $y$ is $${k}$ more than its $x$.`, `这是减法。每个 $y$ 都比对应的 $x$ 大 $${k}$。`],
              ];
          return expressed(
            [
              `Write an equation for $y$ in terms of $x$ for the values in the table. $$${table}$$`,
              `根据表格中的值，写出用 $x$ 表示 $y$ 的方程。$$${table}$$`,
            ],
            answer,
            [
              [
                ["Compare each pair", "比较每一对"],
                multiplicative
                  ? [`Each $y$ is $${k}$ times its $x$:`, `每个 $y$ 都是对应 $x$ 的 $${k}$ 倍：`]
                  : [`Each $y$ is $${k}$ more than its $x$:`, `每个 $y$ 都比对应的 $x$ 大 $${k}$：`],
                xs.map((x) => (multiplicative ? `${k} \\times ${x} = ${k * x}` : `${x} + ${k} = ${x + k}`)),
              ],
              [["Write the rule", "写出规律"], ["", ""], [`y = ${answer}`]],
            ],
            [
              `Put the first $x$ in: $${multiplicative ? `${k} \\times ${x0}` : `${x0} + ${k}`} = ${y0}$, which is the first $y$ in the table.`,
              `代入第一个 $x$：$${multiplicative ? `${k} \\times ${x0}` : `${x0} + ${k}`} = ${y0}$，正是表中第一个 $y$。`,
            ],
            saids,
            { prefix: "y =" },
          );
        },
        tableFigure(["x = 2", "x = 5", "x = 7"], [10, 25, 35]),
      ),
    ],
  ),
  [
    "A plant is $5$ cm tall and grows $2$ cm a week. In a table of weeks and heights, week $0$ has $5$, week $1$ has $7$ and week $2$ has $9$, so $h = 2w + 5$.",
    "一株植物高 $5$ 厘米，每周长高 $2$ 厘米。在周数和高度的表格中，第 $0$ 周是 $5$，第 $1$ 周是 $7$，第 $2$ 周是 $9$，所以 $h = 2w + 5$。",
  ],
  ["Week $3$: $2 \\times 3 + 5 = 11$, and $9 + 2 = 11$.", "第 $3$ 周：$2 \\times 3 + 5 = 11$，而 $9 + 2 = 11$。"],
  ["complete tables of values from an equation, and find the equation from a table.", "根据方程补全表格，并根据表格写出方程。"],
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

export const analyzingTwoVariableEquationsUsingGraphs = withIntro(
  topic(
    "analyzing-two-variable-equations-using-graphs",
    t("Analyzing Two-Variable Equations Using Graphs", "用图像分析二元方程"),
    t(
      "Every pair (x, y) that satisfies an equation is a point on its graph. To read a value from the graph, go up from x to the line and across to the y-axis. A graph that starts at (0, 0) and rises 3 units for each unit to the right shows y = 3x; one that starts at (0, 2) and rises 3 units shows y = 3x + 2.",
      "满足方程的每一个数对 (x, y) 都是图像上的点。从图像读值时，从 x 处竖直向上找到直线，再水平找到 y 轴上的值。从 (0, 0) 出发、每向右 1 个单位上升 3 个单位的图像表示 y = 3x；从 (0, 2) 出发、每向右 1 个单位上升 3 个单位的图像表示 y = 3x + 2。",
    ),
    ["analyzing-two-variable-equations-using-tables", "graphing-ratios"],
    ["6.EE.C.9"],
    [
      lesson(
        "reading-values-from-a-graph",
        ["Reading values", "读取数值"],
        [
          [
            "Every point on the graph of an equation is a pair $(x, y)$ that fits it. To read $y$ for a given $x$, find that $x$ on the horizontal axis, go up to the line, then read across to the vertical axis. On the graph of $y = 2x + 1$, the point above $x = 4$ is $(4, 9)$, so $y = 9$.",
            "方程图像上的每个点 $(x, y)$ 都满足方程。要读出某个 $x$ 对应的 $y$，先在横轴上找到这个 $x$，向上走到直线，再横着读出纵轴上的值。在 $y = 2x + 1$ 的图像上，$x = 4$ 正上方的点是 $(4, 9)$，所以 $y = 9$。",
          ],
          ["$2 \\times 4 + 1 = 9$.", "$2 \\times 4 + 1 = 9$。"],
          [
            "Read the answer on the vertical axis. The $4$ on the horizontal axis is the $x$ you started from.",
            "答案要在纵轴上读。横轴上的 $4$ 是开始时的 $x$。",
          ],
        ],
        (rng) => {
          const k = rng.int(1, 5);
          const b = rng.bool() ? 0 : rng.int(1, 5);
          const { figure, view } = lineGraph(k, b);
          const x = rng.int(1, Math.floor((view - b) / k));
          const y = k * x + b;
          return valued(
            [
              `The graph shows an equation in $x$ and $y$. What is $y$ when $x = ${x}$?`,
              `图像表示一个关于 $x$ 和 $y$ 的方程。当 $x = ${x}$ 时，$y$ 是多少？`,
            ],
            y,
            [
              [
                ["Go up from x", "从 x 向上"],
                [`Start at $${x}$ on the horizontal axis and go up to the line.`, `从横轴上的 $${x}$ 向上走到直线。`],
              ],
              [
                ["Read across", "横着读"],
                [`Read across to the vertical axis: the point is $(${x}, ${y})$.`, `再横着读出纵轴上的值：这个点是 $(${x}, ${y})$。`],
              ],
            ],
            [
              `The line starts at $(0, ${b})$ and rises $${k}$ for each step to the right: $${b} + ${k} \\times ${x} = ${y}$.`,
              `直线从 $(0, ${b})$ 出发，每向右 $1$ 格上升 $${k}$：$${b} + ${k} \\times ${x} = ${y}$。`,
            ],
            [
              [x, "That is the value of $x$. Read the answer across on the vertical axis.", "这是 $x$ 的值。答案要横着在纵轴上读。"],
              [
                k * x,
                `That leaves out the start: the line begins at $${b}$, not $0$.`,
                `这漏掉了起点：直线从 $${b}$ 开始，不是从 $0$ 开始。`,
              ],
              [y + k, "That reads the point one step to the right.", "这读成了右边一格的点。"],
            ],
            { figure },
          );
        },
        drawn(gradeDrawings3["analyzing-two-variable-equations-using-graphs#reading-values-from-a-graph"]),
      ),
      lesson(
        "writing-the-equation-from-a-graph",
        ["Writing the equation", "写出方程"],
        [
          [
            "Read where the line meets the $y$-axis: that is $y$ when $x = 0$. Then read how much $y$ goes up each time $x$ goes up by $1$. $y$ is that rise times $x$, plus the start. A line through $(0, 3)$, $(1, 5)$ and $(2, 7)$ starts at $3$ and rises $2$, so $y = 2x + 3$.",
            "先读出直线与 $y$ 轴的交点，也就是 $x = 0$ 时的 $y$。再看 $x$ 每增加 $1$，$y$ 增加多少。$y$ 就等于每次增加的量乘 $x$，再加上起点。经过 $(0, 3)$、$(1, 5)$、$(2, 7)$ 的直线从 $3$ 开始，每次上升 $2$，所以 $y = 2x + 3$。",
          ],
          ["At $x = 2$: $2 \\times 2 + 3 = 7$, and $(2, 7)$ is on the line.", "$x = 2$ 时：$2 \\times 2 + 3 = 7$，而 $(2, 7)$ 在直线上。"],
          [
            "The rise multiplies $x$ and the start is added. $y = 3x + 2$ swaps them and misses $(1, 5)$.",
            "上升量乘 $x$，起点是加上的。$y = 3x + 2$ 把两者对调了，不经过 $(1, 5)$。",
          ],
        ],
        (rng) => {
          const k = rng.int(1, 5);
          const b0 = rng.bool() ? 0 : rng.int(1, 5);
          const b = k === 1 && b0 === 0 ? rng.int(1, 5) : b0;
          const { figure } = lineGraph(k, b);
          const answer = b ? `${k === 1 ? "" : k}x + ${b}` : `${k}x`;
          const saids: Said[] = b
            ? [
                [
                  `${b}x + ${k}`,
                  "That swaps the start and the rise. The rise multiplies $x$; the start is added.",
                  "这把起点和上升量对调了。上升量乘 $x$，起点是加上的。",
                ],
                [
                  `${k}x`,
                  `That leaves out the start: at $x = 0$ the line is at $${b}$, not $0$.`,
                  `这漏掉了起点：$x = 0$ 时直线在 $${b}$，不在 $0$。`,
                ],
              ]
            : [
                [
                  `x + ${k}`,
                  `That adds the rise once. $y$ goes up $${k}$ for every step, so multiply.`,
                  `这只加了一次上升量。每走一格 $y$ 都上升 $${k}$，所以要乘。`,
                ],
                [`\\frac{x}{${k}}`, "That divides. $y$ grows faster than $x$, so multiply.", "这是除法。$y$ 比 $x$ 增长得快，所以要乘。"],
              ];
          return expressed(
            ["Write an equation for $y$ in terms of $x$ for the line on the graph.", "写出图中直线所表示的、用 $x$ 表示 $y$ 的方程。"],
            answer,
            [
              [
                ["Read the start", "读起点"],
                [`At $x = 0$ the line is at $y = ${b}$.`, `$x = 0$ 时直线在 $y = ${b}$。`],
              ],
              [
                ["Read the rise", "读上升量"],
                [`For each step of $1$ to the right, $y$ goes up by $${k}$. So:`, `每向右 $1$ 格，$y$ 就上升 $${k}$。所以：`],
                [`y = ${answer}`],
              ],
            ],
            [
              `The marked point at $x = 3$ is $(3, ${3 * k + b})$, and $${k} \\times 3 + ${b} = ${3 * k + b}$.`,
              `$x = 3$ 处标出的点是 $(3, ${3 * k + b})$，而 $${k} \\times 3 + ${b} = ${3 * k + b}$。`,
            ],
            saids,
            { prefix: "y =", figure },
          );
        },
        lineGraph(2, 3).figure,
      ),
    ],
  ),
  [
    "A taxi charges $\\$2$ to start and $\\$3$ a mile. With miles across and dollars up, the points $(0, 2)$, $(1, 5)$ and $(2, 8)$ lie on a straight line.",
    "出租车起步价 $\\$2$，每英里 $\\$3$。横轴表示英里数，纵轴表示美元，点 $(0, 2)$、$(1, 5)$、$(2, 8)$ 在一条直线上。",
  ],
  ["$3 \\times 2 + 2 = 8$, so $(2, 8)$ fits $y = 3x + 2$.", "$3 \\times 2 + 2 = 8$，所以 $(2, 8)$ 满足 $y = 3x + 2$。"],
  ["read values from the graph of an equation, and write the equation from its graph.", "从方程的图像上读值，并根据图像写出方程。"],
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
