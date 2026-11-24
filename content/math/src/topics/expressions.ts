import type { TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { linear, num, paren, poly, Q } from "@ga/subject-math";
import { labeledSidesFigure, tableFigure } from "./early-grades-more-kit.ts";
import { chosenMath, expressed, lesson, valued, withIntro } from "./grade-6-kit.ts";
import { areaGridFigure, tapeFigure } from "./upper-grades-kit.ts";

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

/** signTail writes a constant after a term with its own sign: signTail(-5) is "- 5". */
const signTail = (b: number) => `${b < 0 ? "-" : "+"} ${Math.abs(b)}`;

/** evaluatingExpressions teaches substituting integers into expressions. */
export const evaluatingExpressions: TopicDef = withIntro(
  {
    id: "evaluating-expressions",
    title: t("Evaluating Expressions With Integers", "代入整数求代数式的值"),
    summary: t("Substitute integers for variables and evaluate.", "用整数代入变量并求值。"),
    prerequisites: ["order-of-operations-with-integers"],
    encompasses: [
      { topic: "order-of-operations-with-integers", weight: 0.6 },
      { topic: "evaluating-algebraic-expressions", weight: 0.8, nonAncestor: true },
    ],
    xp: 12,
    standards: ["CCSS.6.EE.A.2.C"],
    knowledgePoints: [
      {
        ...lesson(
          "one-variable",
          ["Substituting a value", "代入一个值"],
          [
            [
              "A **variable** is a letter that stands for a number, and $3x$ means $3 \\cdot x$. To **evaluate** an expression, put the value in place of the letter, **in parentheses**, then follow the order of operations. For $x = -4$: $3x - 5 = 3(-4) - 5 = -12 - 5 = -17$.",
              "**变量**是代表数的字母，$3x$ 表示 $3 \\cdot x$。**求值**时，把值代替字母，**加上括号**，再按运算顺序计算。当 $x = -4$ 时：$3x - 5 = 3(-4) - 5 = -12 - 5 = -17$。",
            ],
            ["Work backwards: $-17 + 5 = -12$, and $-12 \\div 3 = -4$.", "倒着算：$-17 + 5 = -12$，$-12 \\div 3 = -4$。"],
            [
              "$3x$ is $3$ times $x$, not $3$ and $x$ side by side. For $x = -4$, $3x$ is $-12$, not $3 - 4$ or $34$.",
              "$3x$ 是 $3$ 乘 $x$，不是把 $3$ 和 $x$ 并排写。当 $x = -4$ 时，$3x$ 是 $-12$，不是 $3 - 4$ 或 $34$。",
            ],
          ],
          (rng) => {
            const a = rng.nonZero(-9, 9);
            const b = rng.nonZero(-20, 20);
            const x = rng.nonZero(-9, 9);
            const v = a * x + b;
            const expr = linear(a, b);
            return valued(
              [`Evaluate $${expr}$ when $x = ${num(x)}$.`, `当 $x = ${num(x)}$ 时，求 $${expr}$ 的值。`],
              v,
              [
                [
                  ["Substitute", "代入"],
                  [`Put $${num(x)}$ in place of $x$, in parentheses:`, `把 $x$ 换成 $${num(x)}$，加上括号：`],
                  [`${expr} = ${times(a, x)} ${signTail(b)}`],
                ],
                [
                  ["Multiply, then add", "先乘，再加减"],
                  ["Multiplication comes first:", "先算乘法："],
                  [`${times(a, x)} ${signTail(b)} = ${num(a * x)} ${signTail(b)} = ${num(v)}`],
                ],
              ],
              [
                `Work backwards: $${num(v)} ${signTail(-b)} = ${num(a * x)}$, and $${num(a * x)} \\div ${paren(a)} = ${num(x)}$.`,
                `倒着算：$${num(v)} ${signTail(-b)} = ${num(a * x)}$，$${num(a * x)} \\div ${paren(a)} = ${num(x)}$。`,
              ],
              [
                [-a * x + b, "The product has the wrong sign.", "乘积的符号错了。"],
                [
                  a + x + b,
                  `That adds $${num(a)}$ and $${num(x)}$; $${a === 1 ? "x" : a === -1 ? "-x" : `${a}x`}$ means multiply.`,
                  `这把 $${num(a)}$ 和 $${num(x)}$ 相加了；系数和变量之间是乘法。`,
                ],
                [a * x - b, "That changes the sign of the constant.", "这把常数项的符号改了。"],
              ],
            );
          },
          tableFigure(["x", "3x−5"], [-4, -17]),
        ),
        keyPrerequisites: ["order-of-operations-with-integers"],
      },
      {
        ...lesson(
          "powers-and-two-variables",
          ["Powers and several variables", "乘方与多个变量"],
          [
            [
              "Put in every value before you compute, each in parentheses. The parentheses matter most with exponents: for $x = -3$, $x^2 = (-3)^2 = 9$. With $x = -3$ and $y = 2$: $x^2 - 4y = (-3)^2 - 4(2) = 9 - 8 = 1$.",
              "先代入所有的值，每个都加括号，再计算。括号在乘方里最重要：当 $x = -3$ 时，$x^2 = (-3)^2 = 9$。当 $x = -3$，$y = 2$ 时：$x^2 - 4y = (-3)^2 - 4(2) = 9 - 8 = 1$。",
            ],
            ["Add in the other order: $-8 + 9 = 1$.", "换个顺序相加：$-8 + 9 = 1$。"],
            [
              "Without parentheses, $-3^2$ would be read as $-9$. Write $(-3)^2$, which is $9$.",
              "不加括号，$-3^2$ 会被读成 $-9$。要写成 $(-3)^2$，它等于 $9$。",
            ],
          ],
          (rng) => {
            const x = rng.bool(0.75) ? -rng.int(1, 6) : rng.int(1, 6);
            const y = rng.nonZero(-9, 9);
            const b = rng.nonZero(-6, 6);
            const v = x * x + b * y;
            const expr = poly([1, "x^{2}"], [b, "y"]);
            return valued(
              [
                `Evaluate $${expr}$ when $x = ${num(x)}$ and $y = ${num(y)}$.`,
                `当 $x = ${num(x)}$，$y = ${num(y)}$ 时，求 $${expr}$ 的值。`,
              ],
              v,
              [
                [
                  ["Substitute", "代入"],
                  ["Put in both values, in parentheses:", "代入两个值，都加上括号："],
                  [`${expr} = (${num(x)})^{2} ${b < 0 ? "-" : "+"} ${times(Math.abs(b), y)}`],
                ],
                [
                  ["Power, multiply, then add", "先乘方和乘法，再加减"],
                  [
                    `$(${num(x)})^{2} = ${x * x}$ and $${times(Math.abs(b), y)} = ${num(Math.abs(b) * y)}$:`,
                    `$(${num(x)})^{2} = ${x * x}$，$${times(Math.abs(b), y)} = ${num(Math.abs(b) * y)}$：`,
                  ],
                  [`${x * x} ${b < 0 ? "-" : "+"} ${paren(Math.abs(b) * y)} = ${num(v)}`],
                ],
              ],
              [`Add in the other order: $${num(b * y)} + ${x * x} = ${num(v)}$.`, `换个顺序相加：$${num(b * y)} + ${x * x} = ${num(v)}$。`],
              [
                [
                  -(x * x) + b * y,
                  `That squares without parentheses; $(${num(x)})^{2}$ is positive.`,
                  `这是不加括号就平方了；$(${num(x)})^{2}$ 是正数。`,
                ],
                [2 * x + b * y, "That doubles $x$ instead of squaring it.", "这是把 $x$ 乘 2，而不是平方。"],
                [x * x - b * y, `That has the wrong sign for the $y$ term.`, "$y$ 项的符号错了。"],
              ],
            );
          },
          tableFigure(["x", "y", "x^2−4y"], [-3, 2, 1]),
        ),
        keyPrerequisites: ["powers-of-integers"],
      },
    ],
  },
  [
    "A taxi ride costs $3 + 2m$ dollars for $m$ miles. For $5$ miles it costs $3 + 2(5) = 3 + 10 = 13$ dollars.",
    "打车 $m$ 英里要 $3 + 2m$ 美元。坐 $5$ 英里要 $3 + 2(5) = 3 + 10 = 13$ 美元。",
  ],
  ["$5$ miles at $2$ dollars a mile is $10$ dollars, and $10 + 3 = 13$.", "$5$ 英里，每英里 $2$ 美元，是 $10$ 美元，$10 + 3 = 13$。"],
  [
    "put integers in place of letters and evaluate expressions, with powers and with formulas.",
    "学习把整数代入字母，求代数式的值，包括含乘方的式子和公式。",
  ],
);

/** aFormulaFromAStory evaluates the Fahrenheit to Celsius formula. */
export const aFormulaFromAStory = lesson(
  "a-formula-from-a-story",
  ["A formula from a story", "故事中的公式"],
  [
    [
      "To use a formula, put each value in place of its letter and follow the order of operations; parentheses come first. With $C = \\frac{5}{9}(F - 32)$ and $F = 50$: $50 - 32 = 18$, and $\\frac{5}{9} \\times 18 = 10$, so $C = 10$.",
      "使用公式时，把每个值代替对应的字母，再按运算顺序计算；先算括号。$C = \\frac{5}{9}(F - 32)$，$F = 50$：$50 - 32 = 18$，$\\frac{5}{9} \\times 18 = 10$，所以 $C = 10$。",
    ],
    [
      "Go back the other way: $F = \\frac{9}{5} \\times 10 + 32 = 18 + 32 = 50$.",
      "反过来换算：$F = \\frac{9}{5} \\times 10 + 32 = 18 + 32 = 50$。",
    ],
    [
      "Subtract $32$ before multiplying by $\\frac{5}{9}$; the parentheses say so. Below $32$ degrees Fahrenheit the result is negative.",
      "先减 $32$，再乘 $\\frac{5}{9}$；括号就是这么规定的。华氏温度低于 $32$ 度时，结果是负数。",
    ],
  ],
  (rng) => {
    const f = 32 + 9 * rng.int(-16, 16);
    const c = ((f - 32) * 5) / 9;
    return valued(
      [
        `The formula $C = \\frac{5}{9}(F - 32)$ converts Fahrenheit to Celsius. What is $C$ when $F = ${f}$?`,
        `公式 $C = \\frac{5}{9}(F - 32)$ 把华氏度换算成摄氏度。$F = ${f}$ 时 $C$ 是多少？`,
      ],
      c,
      [
        [["Parentheses first", "先算括号"], [`Put in $F = ${f}$ and subtract:`, `代入 $F = ${f}$，再相减：`], [`${f} - 32 = ${f - 32}`]],
        [
          ["Multiply", "相乘"],
          ["Then multiply by $\\frac{5}{9}$:", "再乘 $\\frac{5}{9}$："],
          [`\\frac{5}{9} \\times ${paren(f - 32)} = ${num(c)}`],
        ],
      ],
      [
        `Go back the other way: $\\frac{9}{5} \\times ${paren(c)} + 32 = ${num((9 * c) / 5)} + 32 = ${f}$.`,
        `反过来换算：$\\frac{9}{5} \\times ${paren(c)} + 32 = ${num((9 * c) / 5)} + 32 = ${f}$。`,
      ],
      [
        [-c, "That has the wrong sign.", "符号错了。"],
        [f - 32, "That forgets to multiply by $\\frac{5}{9}$.", "这忘了乘 $\\frac{5}{9}$。"],
        [Q.of((f + 32) * 5, 9), "That adds $32$ instead of subtracting it.", "这把 $32$ 加上了，而不是减去。"],
        [Q.of(5 * f - 288, 9), "That multiplies before subtracting, ignoring the parentheses.", "这没管括号，先乘后减了。"],
      ],
    );
  },
  tableFigure(["F", "C"], [50, 10]),
);

const letters = ["x", "y", "n", "t", "a", "m"] as const;

/** valueAt writes the value of a + b·v for a small whole number, for checks by substitution. */
const valueAt = (terms: readonly (readonly [number, string])[], v: number) =>
  terms.reduce((s, [c, name]) => s + (name === "" ? c : c * v), 0);

/** combiningLikeTerms teaches adding the coefficients of like terms. */
export const combiningLikeTerms: TopicDef = withIntro(
  {
    id: "combining-like-terms",
    title: t("Combining Like Terms", "合并同类项"),
    summary: t("Simplify sums of terms by combining like terms.", "通过合并同类项化简多项式。"),
    prerequisites: ["evaluating-expressions"],
    encompasses: [{ topic: "subtracting-integers", weight: 0.5 }],
    xp: 12,
    standards: ["CCSS.7.EE.A.1"],
    knowledgePoints: [
      {
        ...lesson(
          "like-terms",
          ["Adding like terms", "同类项相加"],
          [
            [
              "The **terms** of an expression are the parts joined by $+$ and $-$, and the sign in front belongs to the term. **Like terms** have the same letter part, so you add their **coefficients**: $4x - 7x = (4 - 7)x = -3x$. A letter alone has coefficient $1$: $x + 5x = 6x$.",
              "式子中用 $+$ 和 $-$ 连接起来的各部分叫做**项**，前面的符号属于这一项。字母部分相同的项叫做**同类项**，把它们的**系数**相加：$4x - 7x = (4 - 7)x = -3x$。单独一个字母的系数是 $1$：$x + 5x = 6x$。",
            ],
            [
              "Try $x = 2$: $4 \\cdot 2 - 7 \\cdot 2 = -6$, and $-3 \\cdot 2 = -6$.",
              "试 $x = 2$：$4 \\cdot 2 - 7 \\cdot 2 = -6$，$-3 \\cdot 2 = -6$。",
            ],
            ["Only the coefficient changes. $x + 5x$ is $6x$, not $6x^2$.", "只有系数改变。$x + 5x$ 是 $6x$，不是 $6x^2$。"],
          ],
          (rng) => {
            const v = rng.pick(letters);
            const a = rng.nonZero(-12, 12);
            let b = rng.nonZero(-12, 12);
            while (a + b === 0) b = rng.nonZero(-12, 12);
            const expr = poly([a, v], [b, v]);
            const answer = poly([a + b, v]);
            return expressed(
              [`Simplify $${expr}$.`, `化简 $${expr}$。`],
              answer,
              [
                [
                  ["Spot the like terms", "找同类项"],
                  [
                    `Both terms have the letter part $${v}$, with coefficients $${num(a)}$ and $${num(b)}$.`,
                    `两项的字母部分都是 $${v}$，系数分别是 $${num(a)}$ 和 $${num(b)}$。`,
                  ],
                ],
                [
                  ["Add the coefficients", "系数相加"],
                  ["Keep the letter part:", "字母部分不变："],
                  [`${expr} = (${num(a)} ${signTail(b)})${v} = ${answer}`],
                ],
              ],
              [
                `Try $${v} = 2$: $${num(a * 2)} ${signTail(b * 2)} = ${num((a + b) * 2)}$, and $${num(a + b)} \\cdot 2 = ${num((a + b) * 2)}$.`,
                `试 $${v} = 2$：$${num(a * 2)} ${signTail(b * 2)} = ${num((a + b) * 2)}$，$${num(a + b)} \\cdot 2 = ${num((a + b) * 2)}$。`,
              ],
              [
                [expr, "That is correct but not simplified; combine the two terms.", "这没错，但还没有化简；要把两项合并。"],
                [
                  poly([a - b, v]),
                  "Check the sign of the second term; it stays with its coefficient.",
                  "检查第二项的符号；符号跟着系数走。",
                ],
                [
                  poly([a + b, `${v}^{2}`]),
                  "Adding like terms changes only the coefficient, not the exponent.",
                  "合并同类项只改变系数，不改变指数。",
                ],
              ],
              { simplified: true },
            );
          },
          tapeFigure(
            [
              {
                total: "6x",
                pieces: [
                  { size: 1, text: "x" },
                  { size: 5, text: "5x", lit: true },
                ],
              },
            ],
            ["x plus 5x makes 6x.", "x 加 5x 得 6x。"],
          ),
        ),
        keyPrerequisites: ["subtracting-integers"],
      },
      lesson(
        "terms-and-constants",
        ["Variable terms and constants", "含变量的项与常数项"],
        [
          [
            "A **constant** has no letter. Constants are like terms of each other, but not of letter terms. Group the like terms, each with its own sign, then combine: $5x - 3 - 2x + 8 = (5x - 2x) + (-3 + 8) = 3x + 5$.",
            "不含字母的项叫做**常数项**。常数项彼此是同类项，但和含字母的项不是。把同类项归在一起（每项带着自己的符号），再合并：$5x - 3 - 2x + 8 = (5x - 2x) + (-3 + 8) = 3x + 5$。",
          ],
          ["Try $x = 1$: $5 - 3 - 2 + 8 = 8$, and $3 + 5 = 8$.", "试 $x = 1$：$5 - 3 - 2 + 8 = 8$，$3 + 5 = 8$。"],
          ["A number and a letter term cannot be combined. $3x + 5$ is not $8x$.", "数和含字母的项不能合并。$3x + 5$ 不等于 $8x$。"],
        ],
        (rng) => {
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
          const shown = rng.bool() ? terms : [terms[1]!, terms[0]!, terms[3]!, terms[2]!];
          const expr = poly(...shown);
          const answer = poly([a + c, v], [b + d, ""]);
          const wrongs: [string, string, string][] = [
            [
              poly([a + c, v], [b - d, ""]),
              "Check the sign of each constant; it stays with its number.",
              "检查每个常数的符号；符号跟着数走。",
            ],
            [
              poly([a - c, v], [b + d, ""]),
              `Check the sign of each $${v}$ term; it stays with its coefficient.`,
              `检查每个 $${v}$ 项的符号；符号跟着系数走。`,
            ],
          ];
          if (a + b + c + d !== a + c)
            wrongs.push([
              poly([a + b + c + d, v]),
              "That combines the constants with the letter terms, but they are not like terms.",
              "这把常数项和含字母的项合并了，但它们不是同类项。",
            ]);
          return expressed(
            [`Simplify $${expr}$.`, `化简 $${expr}$。`],
            answer,
            [
              [
                ["Group the like terms", "把同类项归在一起"],
                ["Keep each sign with its term:", "每一项带着自己的符号："],
                [`${expr} = (${poly([a, v], [c, v])}) + (${poly([b, ""], [d, ""])})`],
              ],
              [["Combine each group", "分别合并"], ["Add the coefficients, then the constants:", "系数相加，常数相加："], [`= ${answer}`]],
            ],
            [
              `Try $${v} = 1$: the expression gives $${valueAt(shown, 1)}$, and $${answer}$ gives $${a + c + (b + d)}$ too.`,
              `试 $${v} = 1$：原式得 $${valueAt(shown, 1)}$，$${answer}$ 也得 $${a + c + (b + d)}$。`,
            ],
            wrongs,
            { simplified: true },
          );
        },
        tapeFigure(
          [
            {
              total: "3x",
              pieces: [
                { size: 3, text: "3x", lit: true },
                { size: 2, text: "−2x", dashed: true },
              ],
            },
            {
              total: "5",
              pieces: [
                { size: 5, text: "5", lit: true },
                { size: 3, text: "−3", dashed: true },
              ],
            },
          ],
          ["5x take away 2x leaves 3x, and 8 take away 3 leaves 5.", "5x 去掉 2x 剩 3x，8 去掉 3 剩 5。"],
        ),
      ),
    ],
  },
  [
    "$3$ apples and $5$ more apples make $8$ apples. In the same way, $3a + 5a = 8a$.",
    "$3$ 个苹果再加 $5$ 个苹果是 $8$ 个苹果。同样，$3a + 5a = 8a$。",
  ],
  ["Try $a = 2$: $6 + 10 = 16$, and $8 \\cdot 2 = 16$.", "试 $a = 2$：$6 + 10 = 16$，$8 \\cdot 2 = 16$。"],
  ["find like terms and combine them, with and without constants.", "学习找出同类项并合并，包括含常数项的式子。"],
);

/** xTerm writes the term bx as a factor in a product: "x", "(-x)", "3x", "(-3)x". */
const xTerm = (b: number) => (b === 1 ? "x" : b === -1 ? "(-x)" : `${paren(b)}x`);

/** distributiveProperty teaches expanding a(bx + c). */
export const distributiveProperty: TopicDef = withIntro(
  {
    id: "distributive-property",
    title: t("The Distributive Property", "乘法分配律"),
    summary: t("Expand expressions such as $a(bx + c)$.", "展开形如 $a(bx + c)$ 的式子。"),
    prerequisites: ["evaluating-expressions"],
    encompasses: [{ topic: "multiplying-integers", weight: 0.5 }],
    xp: 12,
    standards: ["CCSS.7.EE.A.1"],
    knowledgePoints: [
      {
        ...lesson(
          "positive-factor",
          ["Distributing a positive number", "分配一个正数"],
          [
            [
              "The **distributive property** says $a(b + c) = ab + ac$: the number outside multiplies **every** term inside, each with its sign. $4(2x - 5) = 4 \\cdot 2x + 4 \\cdot (-5) = 8x - 20$.",
              "**乘法分配律**：$a(b + c) = ab + ac$，括号外的数要乘括号内的**每一项**，每项带着自己的符号。$4(2x - 5) = 4 \\cdot 2x + 4 \\cdot (-5) = 8x - 20$。",
            ],
            ["Try $x = 3$: $4(6 - 5) = 4$, and $24 - 20 = 4$.", "试 $x = 3$：$4(6 - 5) = 4$，$24 - 20 = 4$。"],
            ["Multiply the second term too. $4(2x - 5)$ is not $8x - 5$.", "第二项也要乘。$4(2x - 5)$ 不等于 $8x - 5$。"],
          ],
          (rng) => {
            const a = rng.int(2, 9);
            const b = rng.nonZero(-9, 9);
            const c = rng.nonZero(-12, 12);
            const inner = linear(b, c);
            const expr = factor(a, inner);
            const answer = linear(a * b, a * c);
            return expressed(
              [`Expand $${expr}$.`, `展开 $${expr}$。`],
              answer,
              [
                [
                  ["Multiply each term", "乘每一项"],
                  [`$${a}$ multiplies both terms inside:`, `$${a}$ 要乘括号里的两项：`],
                  [`${expr} = ${a} \\cdot ${xTerm(b)} + ${a} \\cdot ${paren(c)}`],
                ],
                [["Simplify", "化简"], ["Work out each product:", "算出每个积："], [`= ${answer}`]],
              ],
              [
                `Try $x = 1$: $${a}(${b + c}) = ${a * (b + c)}$, and $${num(a * b)} ${signTail(a * c)} = ${a * (b + c)}$.`,
                `试 $x = 1$：$${a}(${b + c}) = ${a * (b + c)}$，$${num(a * b)} ${signTail(a * c)} = ${a * (b + c)}$。`,
              ],
              [
                [expr, "That is the same expression; multiply out the parentheses.", "这还是原式；要把括号乘开。"],
                [
                  linear(a * b, c),
                  "That multiplies only the first term. The number outside multiplies every term inside.",
                  "这只乘了第一项。括号外的数要乘括号内的每一项。",
                ],
                [
                  linear(b, a * c),
                  "That multiplies only the second term. The number outside multiplies every term inside.",
                  "这只乘了第二项。括号外的数要乘括号内的每一项。",
                ],
              ],
              { simplified: true },
            );
          },
          areaGridFigure(["4"], ["2x", "−5"], [["8x", "−20"]]),
        ),
        keyPrerequisites: ["multiplying-integers"],
      },
      lesson(
        "negative-factor",
        ["Distributing a negative number", "分配一个负数"],
        [
          [
            "When the number outside is negative, it changes the sign of **every** term inside: $-3(x - 4) = -3 \\cdot x + (-3)(-4) = -3x + 12$. A minus sign in front of parentheses is a factor of $-1$: $-(2x - 7) = -2x + 7$.",
            "括号外的数是负数时，括号内**每一项**都要变号：$-3(x - 4) = -3 \\cdot x + (-3)(-4) = -3x + 12$。括号前的负号相当于因数 $-1$：$-(2x - 7) = -2x + 7$。",
          ],
          ["Try $x = 5$: $-3(5 - 4) = -3$, and $-15 + 12 = -3$.", "试 $x = 5$：$-3(5 - 4) = -3$，$-15 + 12 = -3$。"],
          [
            "The second term changes sign too. $-3(x - 4)$ is $-3x + 12$, not $-3x - 12$.",
            "第二项也要变号。$-3(x - 4)$ 是 $-3x + 12$，不是 $-3x - 12$。",
          ],
        ],
        (rng) => {
          const a = rng.bool(0.2) ? -1 : -rng.int(2, 9);
          const b = rng.nonZero(-9, 9);
          const c = rng.nonZero(-12, 12);
          const inner = linear(b, c);
          const expr = factor(a, inner);
          const answer = linear(a * b, a * c);
          return expressed(
            [`Expand $${expr}$.`, `展开 $${expr}$。`],
            answer,
            [
              [
                ["Multiply each term", "乘每一项"],
                [`$${num(a)}$ multiplies both terms inside:`, `$${num(a)}$ 要乘括号里的两项：`],
                [`${expr} = ${paren(a)} \\cdot ${xTerm(b)} + ${paren(a)} \\cdot ${paren(c)}`],
              ],
              [["Mind the signs", "注意符号"], ["A negative number changes the sign of each term:", "负数使每一项变号："], [`= ${answer}`]],
            ],
            [
              `Try $x = 1$: $${num(a)} \\cdot ${paren(b + c)} = ${num(a * (b + c))}$, and $${num(a * b)} ${signTail(a * c)} = ${num(a * (b + c))}$.`,
              `试 $x = 1$：$${num(a)} \\cdot ${paren(b + c)} = ${num(a * (b + c))}$，$${num(a * b)} ${signTail(a * c)} = ${num(a * (b + c))}$。`,
            ],
            [
              [
                linear(-a * b, -a * c),
                "That leaves out the minus sign: every term should change sign.",
                "这漏掉了负号：每一项都应该变号。",
              ],
              [
                linear(a * b, -a * c),
                "The minus sign reached only the first term. The second term changes sign too.",
                "负号只作用到第一项。第二项也要变号。",
              ],
              [
                linear(a * b, c),
                "That multiplies only the first term. The number outside multiplies every term inside.",
                "这只乘了第一项。括号外的数要乘括号内的每一项。",
              ],
            ],
            { simplified: true },
          );
        },
        areaGridFigure(["−3"], ["x", "−4"], [["−3x", "+12"]]),
      ),
    ],
  },
  [
    "Three bags each hold $x$ red beads and $2$ blue beads. Altogether there are $3(x + 2) = 3x + 6$ beads.",
    "三个袋子，每袋有 $x$ 颗红珠子和 $2$ 颗蓝珠子。一共有 $3(x + 2) = 3x + 6$ 颗珠子。",
  ],
  ["Try $x = 4$: $3 \\cdot 6 = 18$, and $12 + 6 = 18$.", "试 $x = 4$：$3 \\cdot 6 = 18$，$12 + 6 = 18$。"],
  [
    "expand parentheses by multiplying every term, with positive and negative numbers, and pull a common factor back out.",
    "学习用分配律去括号，乘数可正可负，并把公因数提出来。",
  ],
);

/** theFactorThatWasPulledOut pulls the greatest common factor out of a two-term expression. */
export const theFactorThatWasPulledOut = lesson(
  "the-factor-that-was-pulled-out",
  ["The factor that was pulled out", "提出的公因数"],
  [
    [
      "Reading the distributive property backwards pulls out a common factor. Find the greatest number that divides both terms, then divide each term by it: $12x + 18 = 6(2x + 3)$, because $12 \\div 6 = 2$ and $18 \\div 6 = 3$.",
      "反过来用分配律，就是提公因数。找出能整除两项的最大的数，再用它去除每一项：$12x + 18 = 6(2x + 3)$，因为 $12 \\div 6 = 2$，$18 \\div 6 = 3$。",
    ],
    ["Expand it back: $6 \\cdot 2x + 6 \\cdot 3 = 12x + 18$.", "展开回去：$6 \\cdot 2x + 6 \\cdot 3 = 12x + 18$。"],
    [
      "Pull out the greatest factor, so that nothing common is left inside. $2(6x + 9)$ still has $3$ common inside.",
      "要提出最大的公因数，括号里不能再有公因数。$2(6x + 9)$ 里面还有公因数 $3$。",
    ],
  ],
  (rng) => {
    const g = rng.int(2, 9);
    const [p, q] = rng.pick<[number, number]>([
      [2, 3],
      [3, 4],
      [2, 5],
      [3, 5],
      [4, 5],
      [5, 6],
      [2, 7],
      [3, 7],
      [5, 7],
      [3, 8],
      [5, 8],
      [7, 8],
    ]);
    const sub = rng.bool();
    const op = sub ? "-" : "+";
    return chosenMath(
      rng,
      [`Factor out the greatest common factor: $${g * p}x ${op} ${g * q}$.`, `提出最大公因数：$${g * p}x ${op} ${g * q}$。`],
      `${g}(${p}x ${op} ${q})`,
      [
        [
          `${g}(${p}x ${sub ? "+" : "-"} ${q})`,
          `Expanding gives $${g * p}x ${sub ? "+" : "-"} ${g * q}$; the sign inside must stay.`,
          `展开得 $${g * p}x ${sub ? "+" : "-"} ${g * q}$；括号里的符号不能变。`,
        ],
        [
          `${p}(${g}x ${op} ${g * q})`,
          `Expanding gives $${p * g}x ${op} ${p * g * q}$, not $${g * q}$ for the number term.`,
          `展开后常数项是 $${p * g * q}$，不是 $${g * q}$。`,
        ],
        [
          `${g * p}(x ${op} ${q})`,
          `Expanding gives $${g * p * q}$ for the number term, not $${g * q}$; $${g * p}$ does not divide both terms.`,
          `展开后常数项是 $${g * p * q}$，不是 $${g * q}$；$${g * p}$ 不能整除两项。`,
        ],
      ],
      [
        [
          ["Find the greatest common factor", "找最大公因数"],
          [
            `$${g * p} = ${g} \\times ${p}$ and $${g * q} = ${g} \\times ${q}$, and $${p}$ and $${q}$ share no factor, so it is $${g}$.`,
            `$${g * p} = ${g} \\times ${p}$，$${g * q} = ${g} \\times ${q}$，$${p}$ 和 $${q}$ 没有公因数，所以是 $${g}$。`,
          ],
        ],
        [
          ["Divide each term", "每项都除"],
          [
            `$${g * p}x \\div ${g} = ${p}x$ and $${g * q} \\div ${g} = ${q}$, so the answer is $${g}(${p}x ${op} ${q})$.`,
            `$${g * p}x \\div ${g} = ${p}x$，$${g * q} \\div ${g} = ${q}$，所以答案是 $${g}(${p}x ${op} ${q})$。`,
          ],
        ],
      ],
      [
        `Expand it back: $${g} \\cdot ${p}x ${op} ${g} \\cdot ${q} = ${g * p}x ${op} ${g * q}$.`,
        `展开回去：$${g} \\cdot ${p}x ${op} ${g} \\cdot ${q} = ${g * p}x ${op} ${g * q}$。`,
      ],
    );
  },
  areaGridFigure(["6"], ["2x", "+3"], [["12x", "+18"]]),
);

/** simplifyingExpressions teaches expanding parentheses and combining like terms. */
export const simplifyingExpressions: TopicDef = withIntro(
  {
    id: "simplifying-expressions",
    title: t("Simplifying Expressions With Parentheses", "化简含括号的代数式"),
    summary: t("Expand parentheses and combine like terms.", "去括号并合并同类项。"),
    prerequisites: ["combining-like-terms", "distributive-property"],
    encompasses: [
      { topic: "combining-like-terms", weight: 0.8 },
      { topic: "distributive-property", weight: 0.8 },
      { topic: "simplifying-linear-expressions", weight: 0.8, nonAncestor: true },
    ],
    xp: 12,
    standards: ["CCSS.7.EE.A.1"],
    knowledgePoints: [
      {
        ...lesson(
          "expand-then-combine",
          ["Expanding, then combining", "先展开，再合并"],
          [
            [
              "To simplify an expression with parentheses, first expand with the distributive property, then combine like terms: $2(3x - 1) + 4x + 9 = 6x - 2 + 4x + 9 = 10x + 7$.",
              "化简含括号的式子时，先用分配律展开，再合并同类项：$2(3x - 1) + 4x + 9 = 6x - 2 + 4x + 9 = 10x + 7$。",
            ],
            ["Try $x = 1$: $2 \\cdot 2 + 4 + 9 = 17$, and $10 + 7 = 17$.", "试 $x = 1$：$2 \\cdot 2 + 4 + 9 = 17$，$10 + 7 = 17$。"],
            [
              "Multiply the number term inside too. $2(3x - 1)$ gives $-2$, not $-1$.",
              "括号里的常数也要乘。$2(3x - 1)$ 得 $-2$，不是 $-1$。",
            ],
          ],
          (rng) => {
            const a = rng.int(2, 7);
            const b = rng.nonZero(-6, 6);
            const c = rng.nonZero(-9, 9);
            let d = rng.nonZero(-9, 9);
            while (a * b + d === 0) d = rng.nonZero(-9, 9);
            const e = rng.nonZero(-12, 12);
            const expr = `${factor(a, linear(b, c))} ${tail([d, "x"], [e, ""])}`;
            const answer = linear(a * b + d, a * c + e);
            const expanded = poly([a * b, "x"], [a * c, ""], [d, "x"], [e, ""]);
            const at1 = a * (b + c) + d + e;
            return expressed(
              [`Simplify $${expr}$.`, `化简 $${expr}$。`],
              answer,
              [
                [["Expand", "展开"], [`Multiply both terms inside by $${a}$:`, `用 $${a}$ 乘括号里的两项：`], [`${expr} = ${expanded}`]],
                [
                  ["Combine like terms", "合并同类项"],
                  ["Add the $x$ terms, then the constants:", "$x$ 项相加，常数相加："],
                  [`= ${answer}`],
                ],
              ],
              [
                `Try $x = 1$: the expression gives $${at1}$, and $${answer}$ gives $${at1}$ too.`,
                `试 $x = 1$：原式得 $${at1}$，$${answer}$ 也得 $${at1}$。`,
              ],
              [
                [linear(a * b + d, c + e), `That multiplies only the $x$ term inside by $${a}$.`, `这只用 $${a}$ 乘了括号里的 $x$ 项。`],
                [linear(b + d, a * c + e), `That multiplies only the constant inside by $${a}$.`, `这只用 $${a}$ 乘了括号里的常数。`],
                [expanded, "That is expanded but not simplified; combine the like terms.", "这展开了，但还没化简；要合并同类项。"],
              ],
              { simplified: true },
            );
          },
          areaGridFigure(["2"], ["3x", "−1"], [["6x", "−2"]]),
        ),
        keyPrerequisites: ["distributive-property", "combining-like-terms"],
      },
      lesson(
        "subtracting-parentheses",
        ["Subtracting an expression in parentheses", "减去括号里的式子"],
        [
          [
            "A minus sign in front of parentheses multiplies every term inside by $-1$, so every sign inside changes: $5x + 3 - (2x - 6) = 5x + 3 - 2x + 6 = 3x + 9$.",
            "括号前的减号把括号里每一项都乘 $-1$，所以括号里每一项都变号：$5x + 3 - (2x - 6) = 5x + 3 - 2x + 6 = 3x + 9$。",
          ],
          ["Try $x = 1$: $8 - (-4) = 12$, and $3 + 9 = 12$.", "试 $x = 1$：$8 - (-4) = 12$，$3 + 9 = 12$。"],
          [
            "Change the sign of the last term too. $-(2x - 6)$ is $-2x + 6$, not $-2x - 6$.",
            "最后一项也要变号。$-(2x - 6)$ 是 $-2x + 6$，不是 $-2x - 6$。",
          ],
        ],
        (rng) => {
          const a = rng.nonZero(-9, 9);
          const b = rng.nonZero(-12, 12);
          let c = rng.nonZero(-9, 9);
          while (a - c === 0) c = rng.nonZero(-9, 9);
          const d = rng.nonZero(-12, 12);
          const expr = `${linear(a, b)} - (${linear(c, d)})`;
          const answer = linear(a - c, b - d);
          const expanded = poly([a, "x"], [b, ""], [-c, "x"], [-d, ""]);
          return expressed(
            [`Simplify $${expr}$.`, `化简 $${expr}$。`],
            answer,
            [
              [
                ["Remove the parentheses", "去括号"],
                ["The minus sign changes the sign of every term inside:", "减号使括号里每一项都变号："],
                [`${expr} = ${expanded}`],
              ],
              [["Combine like terms", "合并同类项"], ["Add the $x$ terms, then the constants:", "$x$ 项相加，常数相加："], [`= ${answer}`]],
            ],
            [
              `Try $x = 1$: $${a + b} - ${paren(c + d)} = ${a + b - c - d}$, and $${answer}$ gives $${a - c + b - d}$ too.`,
              `试 $x = 1$：$${a + b} - ${paren(c + d)} = ${a + b - c - d}$，$${answer}$ 也得 $${a - c + b - d}$。`,
            ],
            [
              [linear(a - c, b + d), "That changes the sign of only the first term inside.", "这只把括号里第一项变了号。"],
              [linear(a + c, b + d), "That drops the parentheses without changing any sign.", "这去括号时一个符号都没变。"],
              [
                expanded,
                "That has no parentheses but is not simplified; combine the like terms.",
                "这去了括号，但还没化简；要合并同类项。",
              ],
            ],
            { simplified: true },
          );
        },
        areaGridFigure(["−1"], ["2x", "−6"], [["−2x", "+6"]]),
      ),
    ],
  },
  [
    "$2(x + 3) + x$: first $2(x + 3) = 2x + 6$, then $2x + 6 + x = 3x + 6$.",
    "$2(x + 3) + x$：先算 $2(x + 3) = 2x + 6$，再 $2x + 6 + x = 3x + 6$。",
  ],
  ["Try $x = 1$: $2 \\cdot 4 + 1 = 9$, and $3 + 6 = 9$.", "试 $x = 1$：$2 \\cdot 4 + 1 = 9$，$3 + 6 = 9$。"],
  ["expand parentheses, subtract an expression in parentheses, and combine like terms.", "学习去括号、减去括号里的式子，并合并同类项。"],
);

/** thePerimeterAsAnExpression writes the perimeter of a rectangle with sides given as expressions. */
export const thePerimeterAsAnExpression = lesson(
  "the-perimeter-as-an-expression",
  ["The perimeter as an expression", "周长的表达式"],
  [
    [
      "Sides given as expressions add like any other terms. A rectangle with length $3x + 2$ and width $2x + 1$ has perimeter $2(3x + 2) + 2(2x + 1) = 6x + 4 + 4x + 2 = 10x + 6$.",
      "用式子表示的边长，可以像其他项一样相加。长 $3x + 2$、宽 $2x + 1$ 的长方形，周长是 $2(3x + 2) + 2(2x + 1) = 6x + 4 + 4x + 2 = 10x + 6$。",
    ],
    [
      "Try $x = 1$: the sides are $5$ and $3$, so $2 \\cdot 5 + 2 \\cdot 3 = 16$, and $10 + 6 = 16$.",
      "试 $x = 1$：边长是 $5$ 和 $3$，$2 \\cdot 5 + 2 \\cdot 3 = 16$，$10 + 6 = 16$。",
    ],
    [
      "A rectangle has two lengths and two widths. Adding one length and one width gives only half the perimeter.",
      "长方形有两条长和两条宽。只加一条长和一条宽，只得到周长的一半。",
    ],
  ],
  (rng) => {
    const a = rng.int(2, 9);
    const b = rng.int(1, 12);
    const c = rng.int(2, 9);
    const d = rng.int(1, 12);
    const at1 = 2 * (a + b) + 2 * (c + d);
    return chosenMath(
      rng,
      [
        `A rectangle has length $${a}x + ${b}$ and width $${c}x + ${d}$. Which expression gives its perimeter?`,
        `长方形长 $${a}x + ${b}$，宽 $${c}x + ${d}$。哪个表达式表示它的周长？`,
      ],
      `${2 * (a + c)}x + ${2 * (b + d)}`,
      [
        [
          `${a + c}x + ${b + d}`,
          "That adds one length and one width, which is half the perimeter.",
          "这只加了一条长和一条宽，是周长的一半。",
        ],
        [`${2 * (a + c)}x + ${b + d}`, "That doubles the $x$ terms but not the numbers.", "这只把 $x$ 项乘了 2，常数没有乘。"],
        [
          `${2 * (a + c) + 2 * (b + d)}x`,
          "That combines the numbers with the $x$ terms, but they are not like terms.",
          "这把常数和 $x$ 项合并了，但它们不是同类项。",
        ],
      ],
      [
        [
          ["Add all four sides", "四条边相加"],
          ["Two lengths and two widths:", "两条长和两条宽："],
          [`2(${a}x + ${b}) + 2(${c}x + ${d}) = ${2 * a}x + ${2 * b} + ${2 * c}x + ${2 * d}`],
        ],
        [
          ["Combine like terms", "合并同类项"],
          ["Add the $x$ terms, then the numbers:", "$x$ 项相加，数相加："],
          [`= ${2 * (a + c)}x + ${2 * (b + d)}`],
        ],
      ],
      [
        `Try $x = 1$: the sides are $${a + b}$ and $${c + d}$, so the perimeter is $${at1}$, and $${2 * (a + c)} + ${2 * (b + d)} = ${at1}$.`,
        `试 $x = 1$：边长是 $${a + b}$ 和 $${c + d}$，周长是 $${at1}$，$${2 * (a + c)} + ${2 * (b + d)} = ${at1}$。`,
      ],
    );
  },
  labeledSidesFigure(
    [
      [1, 2],
      [9, 2],
      [9, 8],
      [1, 8],
    ],
    ["3x+2", "2x+1", "3x+2", "2x+1"],
  ),
);

/** expressionTopics are the topics of the expressions unit, in teaching order. */
export const expressionTopics: readonly TopicDef[] = [
  evaluatingExpressions,
  combiningLikeTerms,
  distributiveProperty,
  simplifyingExpressions,
];
