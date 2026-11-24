import type { TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { linear, num, paren, poly, Q } from "@ga/subject-math";

import { type Pair, tableFigure, type Walk } from "./early-grades-more-kit.ts";
import { chosen, lesson, valued, withIntro } from "./grade-6-kit.ts";
import { areaGridFigure, lineFigure, tapeFigure } from "./upper-grades-kit.ts";

/** frac is the exact quotient a / b, for the values that mistakes produce. */
const frac = (a: number, b: number) => Q.of(a, b);

/** side writes a coefficient times x: side(-1) is "-x". */
const side = (a: number) => poly([a, "x"]);

/** undoAdd works x + a = b in two labelled steps. */
const undoAdd = (a: number, b: number, eqLeft: string): Walk[] => [
  [
    ["Undo the addition", "撤销加法"],
    [
      a > 0 ? `$${a}$ is added to $x$, so subtract $${a}$ from both sides:` : `$${-a}$ is taken from $x$, so add $${-a}$ to both sides:`,
      a > 0 ? `$x$ 加了 $${a}$，所以两边同时减去 $${a}$：` : `$x$ 减了 $${-a}$，所以两边同时加上 $${-a}$：`,
    ],
    [`${eqLeft} ${a > 0 ? `- ${a}` : `+ ${-a}`} = ${num(b)} ${a > 0 ? `- ${a}` : `+ ${-a}`}`],
  ],
  [["Simplify", "化简"], ["The left side is now just $x$:", "左边只剩 $x$："], [`x = ${num(b - a)}`]],
];

/** oneStepEquationsAddition teaches undoing addition and subtraction on both sides. */
export const oneStepEquationsAddition: TopicDef = withIntro(
  {
    id: "one-step-equations-addition",
    title: t("Solving One-Step Addition and Subtraction Equations", "解一步加减法方程"),
    summary: t("Solve $x + a = b$ by doing the same to both sides.", "通过在两边做相同的运算解 $x + a = b$。"),
    prerequisites: ["evaluating-expressions"],
    encompasses: [{ topic: "subtracting-integers", weight: 0.3 }],
    xp: 10,
    standards: ["CCSS.6.EE.B.7", "CCSS.7.EE.B.4.A"],
    knowledgePoints: [
      {
        ...lesson(
          "undoing-addition",
          ["Undoing addition and subtraction", "抵消加法与减法"],
          [
            [
              "An **equation** says two expressions are equal, and a **solution** is a value that makes it true. To **solve**, get $x$ alone by doing the same thing to **both sides**. Addition and subtraction undo each other: $x + 7 = -2$, so $x = -2 - 7 = -9$.",
              "**方程**表示两个式子相等，使它成立的值叫做**解**。**解方程**就是在**两边**做相同的运算，让 $x$ 单独留下。加法和减法互相抵消：$x + 7 = -2$，所以 $x = -2 - 7 = -9$。",
            ],
            ["Put it back: $-9 + 7 = -2$.", "代回去：$-9 + 7 = -2$。"],
            [
              "Do the opposite, not the same. To undo $+ 7$, subtract $7$; adding $7$ again gives $5$, which is wrong.",
              "要做相反的运算。撤销 $+ 7$ 要减 $7$；再加 $7$ 得 $5$，是错的。",
            ],
          ],
          (rng) => {
            const a = rng.nonZero(-20, 20);
            const b = rng.int(-30, 30);
            const x = b - a;
            const eq = `${linear(1, a)} = ${num(b)}`;
            return valued(
              [`Solve $${eq}$.`, `解方程 $${eq}$。`],
              x,
              undoAdd(a, b, linear(1, a)),
              [
                `Put it back: $${num(x)} ${a > 0 ? `+ ${a}` : `- ${-a}`} = ${num(b)}$.`,
                `代回去：$${num(x)} ${a > 0 ? `+ ${a}` : `- ${-a}`} = ${num(b)}$。`,
              ],
              [
                [-x, "That has the wrong sign.", "符号错了。"],
                [b + a, "That repeats the operation instead of undoing it.", "这是把运算又做了一遍，而不是撤销它。"],
                [a - b, "That subtracts in the wrong order.", "这是倒过来相减了。"],
              ],
              { solveFor: "x" },
            );
          },
          tableFigure(["x", "x+7"], [-9, -2]),
        ),
        keyPrerequisites: ["subtracting-integers"],
      },
      lesson(
        "variable-on-the-right",
        ["The variable on either side", "变量在任意一边"],
        [
          [
            "The letter may be on either side, and the number may come first. $5 + x = 2$ is the same as $x + 5 = 2$. To solve $-4 = x - 6$, add $6$ to both sides: $2 = x$, so $x = 2$.",
            "字母可以在等号任意一边，数也可以写在前面。$5 + x = 2$ 与 $x + 5 = 2$ 相同。解 $-4 = x - 6$ 时，两边同时加 $6$：$2 = x$，所以 $x = 2$。",
          ],
          ["Put it back: $2 - 6 = -4$.", "代回去：$2 - 6 = -4$。"],
          [
            "$2 = x$ and $x = 2$ say the same thing. Do not change the sign when you swap the sides.",
            "$2 = x$ 和 $x = 2$ 意思一样。左右交换时不要改变符号。",
          ],
        ],
        (rng) => {
          const a = rng.nonZero(-20, 20);
          const b = rng.int(-30, 30);
          const x = b - a;
          const left = rng.bool();
          const expr = left ? linear(1, a) : `${num(a)} + x`;
          const eq = rng.bool() ? `${num(b)} = ${expr}` : `${expr} = ${num(b)}`;
          return valued(
            [`Solve $${eq}$.`, `解方程 $${eq}$。`],
            x,
            [
              [
                ["Write x side first", "把含 x 的一边写在前面"],
                [`The equation says the same as:`, `这个方程也可以写成：`],
                [`${linear(1, a)} = ${num(b)}`],
              ],
              ...undoAdd(a, b, linear(1, a)),
            ],
            [
              `Put it back into $${eq}$: $${expr.replace("x", paren(x))} = ${num(b)}$.`,
              `代回 $${eq}$：$${expr.replace("x", paren(x))} = ${num(b)}$。`,
            ],
            [
              [-x, "That has the wrong sign.", "符号错了。"],
              [b + a, "That repeats the operation instead of undoing it.", "这是把运算又做了一遍，而不是撤销它。"],
              [a - b, "That subtracts in the wrong order. Start from the side without $x$.", "这是倒过来相减了。应从不含 $x$ 的一边开始。"],
            ],
            { solveFor: "x" },
          );
        },
        tableFigure(["x", "x−6"], [2, -4]),
      ),
    ],
  },
  [
    "Sam had some stickers and got $7$ more. Now he has $12$. So $x + 7 = 12$, and $x = 12 - 7 = 5$.",
    "萨姆有一些贴纸，又得到 $7$ 张，现在有 $12$ 张。所以 $x + 7 = 12$，$x = 12 - 7 = 5$。",
  ],
  ["$5 + 7 = 12$.", "$5 + 7 = 12$。"],
  [
    "solve equations like $x + a = b$ by doing the opposite to both sides, and write them from stories.",
    "学习在两边做相反的运算解 $x + a = b$ 这样的方程，并根据故事列方程。",
  ],
);

/** storiesWithOneStepEquations finds the start of a change from a story. */
export const storiesWithOneStepEquations = lesson(
  "stories-with-one-step-equations",
  ["Stories with one-step equations", "一步方程的故事"],
  [
    [
      "A story about a change gives the equation start $+$ change $=$ end. Call the unknown start $x$ and undo the change. If the temperature rose $8$ degrees to $3$ degrees: $x + 8 = 3$, so $x = 3 - 8 = -5$.",
      "关于变化的故事可以写成“开始 $+$ 变化 $=$ 结果”。把未知的开始设为 $x$，再撤销变化。气温上升 $8$ 度后是 $3$ 度：$x + 8 = 3$，所以 $x = 3 - 8 = -5$。",
    ],
    ["$-5 + 8 = 3$.", "$-5 + 8 = 3$。"],
    [
      "The start can be negative. Do not swap the numbers to get a positive answer: $8 - 3$ is wrong.",
      "开始值可以是负数。不要为了得正数而交换两个数：$8 - 3$ 是错的。",
    ],
  ],
  (rng) => {
    const rise = rng.int(3, 25);
    const end = rng.int(-12, 15);
    const start = end - rise;
    return valued(
      [
        `The temperature rose by $${rise}$ degrees and is now $${end}$ degrees. What was the temperature before the rise?`,
        `气温上升了 $${rise}$ 度，现在是 $${end}$ 度。上升前是多少度？`,
      ],
      start,
      [
        [
          ["Write the equation", "列方程"],
          ["Start plus the rise is the end:", "开始的气温加上升的度数等于现在的气温："],
          [`x + ${rise} = ${num(end)}`],
        ],
        [
          ["Undo the rise", "撤销上升"],
          [`Subtract $${rise}$ from both sides:`, `两边同时减去 $${rise}$：`],
          [`x = ${num(end)} - ${rise} = ${num(start)}`],
        ],
      ],
      [`$${num(start)} + ${rise} = ${num(end)}$.`, `$${num(start)} + ${rise} = ${num(end)}$。`],
      [
        [end + rise, "That adds the rise again instead of undoing it.", "这又加了一次上升的度数，而不是撤销它。"],
        [rise - end, "That subtracts in the wrong order.", "这是倒过来相减了。"],
        [-start, "That has the wrong sign.", "符号错了。"],
      ],
    );
  },
  lineFigure(
    {
      lo: -6,
      hi: 4,
      step: 1,
      labels: [-6, -5, 0, 3, 4],
      label: (v) => (v < 0 ? `−${-v}` : String(v)),
      marks: [{ at: -5 }, { at: 3 }],
      jumps: [[-5, 3]],
    },
    ["A rise of 8 from −5 reaches 3.", "从 −5 上升 8 到达 3。"],
  ),
);

/** oneStepEquationsMultiplication teaches undoing multiplication and division on both sides. */
export const oneStepEquationsMultiplication: TopicDef = withIntro(
  {
    id: "one-step-equations-multiplication",
    title: t("Solving One-Step Multiplication and Division Equations", "解一步乘除法方程"),
    summary: t("Solve $ax = b$ and $\\frac{x}{a} = b$.", "解 $ax = b$ 与 $\\frac{x}{a} = b$。"),
    prerequisites: ["one-step-equations-addition"],
    encompasses: [{ topic: "dividing-integers", weight: 0.5 }],
    xp: 10,
    standards: ["CCSS.6.EE.B.7", "CCSS.7.EE.B.4.A"],
    knowledgePoints: [
      {
        ...lesson(
          "dividing-both-sides",
          ["Dividing both sides", "两边同除以一个数"],
          [
            [
              "Multiplication and division undo each other. To solve $-6x = 42$, divide both sides by the number in front of $x$, which is $-6$: $x = 42 \\div (-6) = -7$. For $-x = 5$, the number in front is $-1$, so $x = -5$.",
              "乘法和除法互相抵消。解 $-6x = 42$ 时，两边同时除以 $x$ 前面的数 $-6$：$x = 42 \\div (-6) = -7$。对于 $-x = 5$，前面的数是 $-1$，所以 $x = -5$。",
            ],
            ["Put it back: $-6 \\cdot (-7) = 42$.", "代回去：$-6 \\cdot (-7) = 42$。"],
            [
              "Divide by the whole coefficient, sign and all. Dividing $42$ by $6$ gives $7$, which has the wrong sign.",
              "要除以整个系数，连同符号。$42$ 除以 $6$ 得 $7$，符号错了。",
            ],
          ],
          (rng) => {
            const a = rng.bool(0.12) ? -1 : rng.sign() * rng.int(2, 12);
            const x = rng.nonZero(-12, 12);
            const b = a * x;
            const eq = `${side(a)} = ${num(b)}`;
            return valued(
              [`Solve $${eq}$.`, `解方程 $${eq}$。`],
              x,
              [
                [
                  ["Divide both sides", "两边同除"],
                  [
                    `$x$ is multiplied by $${num(a)}$, so divide both sides by $${num(a)}$:`,
                    `$x$ 乘了 $${num(a)}$，所以两边同时除以 $${num(a)}$：`,
                  ],
                  [`x = \\frac{${num(b)}}{${num(a)}}`],
                ],
                [
                  ["Work out the quotient", "算出商"],
                  [
                    a < 0 === b < 0 ? "The signs are the same, so $x$ is positive:" : "The signs differ, so $x$ is negative:",
                    a < 0 === b < 0 ? "同号，所以 $x$ 为正：" : "异号，所以 $x$ 为负：",
                  ],
                  [`x = ${num(x)}`],
                ],
              ],
              [`Put it back: $${num(a)} \\cdot ${paren(x)} = ${num(b)}$.`, `代回去：$${num(a)} \\cdot ${paren(x)} = ${num(b)}$。`],
              [
                [-x, "That divides by the size of the coefficient but drops its sign.", "这除以了系数的大小，但丢了符号。"],
                [
                  b - a,
                  "That subtracts the coefficient. It multiplies $x$, so divide by it.",
                  "这减去了系数。系数是乘在 $x$ 上的，要除以它。",
                ],
                [b * a, "That multiplies by the coefficient. To undo a multiplication, divide.", "这乘了系数。要撤销乘法，应该做除法。"],
              ],
              { solveFor: "x" },
            );
          },
          tableFigure(["x", "−6x"], [-7, 42]),
        ),
        keyPrerequisites: ["dividing-integers"],
      },
      {
        ...lesson(
          "multiplying-both-sides",
          ["Multiplying both sides", "两边同乘以一个数"],
          [
            [
              "When $x$ is divided by a number, multiply both sides by that number: $\\frac{x}{4} = -3$, so $x = 4 \\cdot (-3) = -12$. A minus sign in front, as in $-\\frac{x}{4}$, means dividing by $-4$, so multiply by $-4$.",
              "当 $x$ 被一个数除时，两边同时乘这个数：$\\frac{x}{4} = -3$，所以 $x = 4 \\cdot (-3) = -12$。前面有负号时，比如 $-\\frac{x}{4}$，表示除以 $-4$，所以要乘 $-4$。",
            ],
            ["Put it back: $-12 \\div 4 = -3$.", "代回去：$-12 \\div 4 = -3$。"],
            ["Multiply to undo a division. Dividing $-3$ by $4$ goes the wrong way.", "撤销除法要用乘法。用 $-3$ 除以 $4$ 是走反了。"],
          ],
          (rng) => {
            const d = rng.int(2, 9);
            const negative = rng.bool(0.3);
            const a = negative ? -d : d;
            const b = rng.nonZero(-12, 12);
            const x = a * b;
            const eq = `${negative ? "-" : ""}\\frac{x}{${d}} = ${num(b)}`;
            return valued(
              [`Solve $${eq}$.`, `解方程 $${eq}$。`],
              x,
              [
                [
                  ["Multiply both sides", "两边同乘"],
                  [
                    negative
                      ? `$x$ is divided by $${a}$, so multiply both sides by $${a}$:`
                      : `$x$ is divided by $${d}$, so multiply both sides by $${d}$:`,
                    negative ? `$x$ 除以了 $${a}$，所以两边同时乘 $${a}$：` : `$x$ 除以了 $${d}$，所以两边同时乘 $${d}$：`,
                  ],
                  [`x = ${paren(a)} \\cdot ${paren(b)}`],
                ],
                [["Work out the product", "算出积"], ["Multiply, minding the signs:", "相乘，注意符号："], [`x = ${num(x)}`]],
              ],
              [
                `Put it back: $${negative ? "-" : ""}\\frac{${num(x)}}{${d}} = ${num(b)}$.`,
                `代回去：$${negative ? "-" : ""}\\frac{${num(x)}}{${d}} = ${num(b)}$。`,
              ],
              [
                [
                  -x,
                  negative ? "That leaves out the minus sign in front." : "That has the wrong sign.",
                  negative ? "这漏掉了前面的负号。" : "符号错了。",
                ],
                [frac(b, a), "That divides. $x$ is being divided, so multiply to undo it.", "这做了除法。$x$ 正在被除，要撤销就要乘。"],
                [b + d, "That adds the denominator. To undo a division, multiply.", "这加上了分母。要撤销除法，应该做乘法。"],
              ],
              { solveFor: "x" },
            );
          },
          tableFigure(["x", "x/4"], [-12, -3]),
        ),
        keyPrerequisites: ["multiplying-integers"],
      },
    ],
  },
  [
    "Four friends share a bill equally, and each pays $9$ dollars. So $\\frac{x}{4} = 9$, and $x = 4 \\cdot 9 = 36$ dollars.",
    "四个朋友平分账单，每人付 $9$ 美元。所以 $\\frac{x}{4} = 9$，$x = 4 \\cdot 9 = 36$ 美元。",
  ],
  ["$36 \\div 4 = 9$.", "$36 \\div 4 = 9$。"],
  [
    "solve equations like $ax = b$ and $\\frac{x}{a} = b$ by multiplying or dividing both sides.",
    "学习在两边同乘或同除，解 $ax = b$ 和 $\\frac{x}{a} = b$ 这样的方程。",
  ],
);

/** aFractionTimesTheUnknown solves a fraction times x equals a number with the reciprocal. */
export const aFractionTimesTheUnknown = lesson(
  "a-fraction-times-the-unknown",
  ["A fraction times the unknown", "分数乘未知数"],
  [
    [
      "When a fraction multiplies $x$, multiply both sides by its reciprocal, the fraction turned upside down. $\\frac{2}{3}x = 10$, so $x = \\frac{3}{2} \\cdot 10 = 15$. One step does the work of dividing by $2$ and multiplying by $3$.",
      "分数乘 $x$ 时，两边同乘它的倒数，也就是把分数倒过来。$\\frac{2}{3}x = 10$，所以 $x = \\frac{3}{2} \\cdot 10 = 15$。一步就完成了除以 $2$ 再乘 $3$。",
    ],
    [
      "$\\frac{2}{3}$ of $15$ is $10$: $15 \\div 3 = 5$ and $5 \\cdot 2 = 10$.",
      "$15$ 的 $\\frac{2}{3}$ 是 $10$：$15 \\div 3 = 5$，$5 \\cdot 2 = 10$。",
    ],
    [
      "Multiply by the reciprocal, not by the fraction itself. $\\frac{2}{3} \\cdot 10$ makes $x$ smaller, not larger.",
      "要乘倒数，不是乘分数本身。$\\frac{2}{3} \\cdot 10$ 会让结果变小，而不是变大。",
    ],
  ],
  (rng) => {
    const [n, d] = rng.pick<[number, number]>([
      [2, 3],
      [3, 4],
      [2, 5],
      [3, 5],
      [4, 5],
      [5, 6],
      [3, 7],
      [5, 7],
      [3, 8],
      [7, 8],
      [4, 9],
      [7, 9],
    ]);
    const k = rng.nonZero(-12, 12);
    const rhs = n * k;
    return valued(
      [`Solve $\\frac{${n}}{${d}}x = ${num(rhs)}$.`, `解方程 $\\frac{${n}}{${d}}x = ${num(rhs)}$。`],
      d * k,
      [
        [
          ["Find the reciprocal", "找倒数"],
          [
            `The reciprocal of $\\frac{${n}}{${d}}$ is $\\frac{${d}}{${n}}$; multiply both sides by it:`,
            `$\\frac{${n}}{${d}}$ 的倒数是 $\\frac{${d}}{${n}}$，两边同乘它：`,
          ],
          [`x = \\frac{${d}}{${n}} \\cdot ${paren(rhs)}`],
        ],
        [
          ["Multiply", "相乘"],
          [`Divide by $${n}$, then multiply by $${d}$:`, `先除以 $${n}$，再乘 $${d}$：`],
          [`${num(rhs)} \\div ${n} = ${num(k)}`, `${num(k)} \\cdot ${d} = ${num(d * k)}`],
        ],
      ],
      [
        `$${num(d * k)} \\div ${d} = ${num(k)}$ and $${num(k)} \\cdot ${n} = ${num(rhs)}$.`,
        `$${num(d * k)} \\div ${d} = ${num(k)}$，$${num(k)} \\cdot ${n} = ${num(rhs)}$。`,
      ],
      [
        [Q.of(n * rhs, d), "That multiplies by the fraction itself instead of its reciprocal.", "这乘的是分数本身，而不是它的倒数。"],
        [k, `That divides by $${n}$ but forgets to multiply by $${d}$.`, `这除以了 $${n}$，但忘了乘 $${d}$。`],
        [rhs - d, "That subtracts the denominator; the fraction multiplies $x$.", "这减去了分母；分数是乘在 $x$ 上的。"],
        [-d * k, "That has the wrong sign.", "符号错了。"],
      ],
      { solveFor: "x" },
    );
  },
  tapeFigure(
    [
      {
        total: "15",
        pieces: [
          { size: 1, text: "5", lit: true },
          { size: 1, text: "5", lit: true },
          { size: 1, text: "5" },
        ],
      },
    ],
    ["Two of three equal parts make 10, so each part is 5 and the whole is 15.", "三等份中的两份是 10，所以每份 5，整体是 15。"],
  ),
);
/** undo writes the step that removes a constant b from both sides. */
const undo = (b: number): Pair => [b > 0 ? `Subtract $${b}$ from` : `Add $${-b}$ to`, b > 0 ? `减去 $${b}$` : `加上 $${-b}$`];

/** plus writes "+ b" or "- |b|" after a term, and nothing for zero. */
const plus = (b: number) => (b === 0 ? "" : b > 0 ? ` + ${b}` : ` - ${-b}`);

/** at writes a times x plus b at the value v, worked out: "3 \cdot (-2) + 5 = -1". */
const at = (a: number, b: number, v: number) => `${num(a)} \\cdot ${paren(v)}${plus(b)} = ${num(a * v + b)}`;

export const twoStepEquations: TopicDef = withIntro(
  {
    id: "two-step-equations",
    title: t("Solving Two-Step Equations", "解两步方程"),
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
        ...lesson(
          "undo-in-reverse-order",
          ["Undoing operations in reverse order", "按相反顺序抵消运算"],
          [
            [
              "In $3x - 5$, $x$ is first multiplied by $3$, then $5$ is subtracted. To solve, undo these operations in **reverse order**: first add $5$, then divide by $3$.\n\n$$3x - 5 = 16 \\;\\Rightarrow\\; 3x = 21 \\;\\Rightarrow\\; x = 7.$$",
              "在 $3x - 5$ 中，$x$ 先乘以 $3$，再减去 $5$。解方程时按**相反的顺序**抵消这些运算：先加 $5$，再除以 $3$。\n\n$$3x - 5 = 16 \\;\\Rightarrow\\; 3x = 21 \\;\\Rightarrow\\; x = 7.$$",
            ],
            [
              "Put $x = 7$ back: $3 \\cdot 7 - 5 = 21 - 5 = 16$, the right side.",
              "把 $x = 7$ 代回去：$3 \\cdot 7 - 5 = 21 - 5 = 16$，正是右边。",
            ],
            [
              "Take off the $-5$ before dividing by $3$. Dividing first would split $16$ into thirds and still leave the $5$ to deal with.",
              "先去掉 $-5$，再除以 $3$。如果先除，$16$ 会变成三分之一的份数，而 $5$ 还没处理。",
            ],
          ],
          (rng) => {
            const a = rng.sign() * rng.int(2, 9);
            const x = rng.nonZero(-10, 10);
            const b = rng.nonZero(-20, 20);
            const c = a * x + b;
            const eq = `${linear(a, b)} = ${num(c)}`;
            const [en, zh] = undo(b);
            return valued(
              [`Solve $${eq}$.`, `解方程 $${eq}$。`],
              x,
              [
                [["Undo the last step", "先抵消最后一步"], [`${en} both sides:`, `两边同时${zh}：`], [`${side(a)} = ${num(c - b)}`]],
                [
                  ["Undo the multiplication", "再抵消乘法"],
                  [`Divide both sides by $${num(a)}$:`, `两边同时除以 $${num(a)}$：`],
                  [`x = ${num(x)}`],
                ],
              ],
              [`Put $x = ${num(x)}$ back: $${at(a, b, x)}$, the right side.`, `把 $x = ${num(x)}$ 代回去：$${at(a, b, x)}$，正是右边。`],
              [
                [
                  frac(c + b, a),
                  `That moves the $${Math.abs(b)}$ the wrong way. ${en} both sides, so the right side becomes $${num(c - b)}$.`,
                  `这是把 $${Math.abs(b)}$ 移错了方向。应在两边同时${zh}，右边变成 $${num(c - b)}$。`,
                ],
                [
                  -x,
                  `The sign is off: $${num(c - b)} \\div ${paren(a)} = ${num(x)}$.`,
                  `符号错了：$${num(c - b)} \\div ${paren(a)} = ${num(x)}$。`,
                ],
                [
                  frac(c, a).sub(Q.of(b)),
                  `That divides first. Undo in reverse order: the $${plus(b).trim()}$ comes off before the division.`,
                  `这是先做了除法。要按相反顺序抵消：先去掉 $${plus(b).trim()}$，再做除法。`,
                ],
              ],
              { solveFor: "x" },
            );
          },
          tableFigure(["3x - 5", "3x", "x"], [16, 21, 7]),
        ),
        keyPrerequisites: ["one-step-equations-addition", "one-step-equations-multiplication"],
      },
      lesson(
        "other-arrangements",
        ["Other arrangements", "其他形式"],
        [
          [
            "The constant may come first, and the variable may be divided rather than multiplied. Still undo the addition or subtraction first:\n\n$$8 - 2x = 14 \\;\\Rightarrow\\; -2x = 6 \\;\\Rightarrow\\; x = -3, \\qquad \\frac{x}{5} + 1 = -3 \\;\\Rightarrow\\; \\frac{x}{5} = -4 \\;\\Rightarrow\\; x = -20.$$",
            "常数可能写在前面，变量也可能是被除而不是被乘。仍然先抵消加减：\n\n$$8 - 2x = 14 \\;\\Rightarrow\\; -2x = 6 \\;\\Rightarrow\\; x = -3, \\qquad \\frac{x}{5} + 1 = -3 \\;\\Rightarrow\\; \\frac{x}{5} = -4 \\;\\Rightarrow\\; x = -20.$$",
          ],
          [
            "Put them back: $8 - 2 \\cdot (-3) = 8 + 6 = 14$, and $\\frac{-20}{5} + 1 = -4 + 1 = -3$.",
            "代回去检验：$8 - 2 \\cdot (-3) = 8 + 6 = 14$，$\\frac{-20}{5} + 1 = -4 + 1 = -3$。",
          ],
          [
            "In $8 - 2x$ the minus sign belongs to $2x$: the coefficient is $-2$, so divide by $-2$, not by $2$.",
            "在 $8 - 2x$ 中，减号属于 $2x$：系数是 $-2$，所以要除以 $-2$，而不是 $2$。",
          ],
        ],
        (rng) => {
          const b = rng.nonZero(-20, 20);
          const [en, zh] = undo(b);
          if (rng.bool()) {
            const a = -rng.int(1, 9);
            const x = rng.nonZero(-10, 10);
            const c = b + a * x;
            const eq = `${num(b)} ${a === -1 ? "- x" : `- ${-a}x`} = ${num(c)}`;
            return valued(
              [`Solve $${eq}$.`, `解方程 $${eq}$。`],
              x,
              [
                [["Undo the constant", "先抵消常数"], [`${en} both sides:`, `两边同时${zh}：`], [`${side(a)} = ${num(c - b)}`]],
                [
                  ["Undo the multiplication", "再抵消乘法"],
                  [`Divide both sides by $${num(a)}$:`, `两边同时除以 $${num(a)}$：`],
                  [`x = ${num(x)}`],
                ],
              ],
              [
                `Put $x = ${num(x)}$ back: $${num(b)} - ${a === -1 ? "" : `${-a} \\cdot `}${paren(x)} = ${num(c)}$, the right side.`,
                `把 $x = ${num(x)}$ 代回去：$${num(b)} - ${a === -1 ? "" : `${-a} \\cdot `}${paren(x)} = ${num(c)}$，正是右边。`,
              ],
              [
                [
                  -x,
                  `The sign is off: the coefficient of $x$ is $${a}$, so divide $${num(c - b)}$ by $${a}$.`,
                  `符号错了：$x$ 的系数是 $${a}$，所以要用 $${num(c - b)}$ 除以 $${a}$。`,
                ],
                [
                  frac(c + b, a),
                  `That moves the $${Math.abs(b)}$ the wrong way. ${en} both sides, so the right side becomes $${num(c - b)}$.`,
                  `这是把 $${Math.abs(b)}$ 移错了方向。应在两边同时${zh}，右边变成 $${num(c - b)}$。`,
                ],
                [
                  frac(c - b, -a),
                  `That drops the minus sign in front of $x$: the coefficient is $${a}$, not $${-a}$.`,
                  `这是丢掉了 $x$ 前面的减号：系数是 $${a}$，不是 $${-a}$。`,
                ],
              ],
              { solveFor: "x" },
            );
          }
          const d = rng.int(2, 6);
          const k = rng.nonZero(-9, 9);
          const x = d * k;
          const c = k + b;
          const eq = `\\frac{x}{${d}}${plus(b)} = ${num(c)}`;
          return valued(
            [`Solve $${eq}$.`, `解方程 $${eq}$。`],
            x,
            [
              [["Undo the constant", "先抵消常数"], [`${en} both sides:`, `两边同时${zh}：`], [`\\frac{x}{${d}} = ${num(k)}`]],
              [["Undo the division", "再抵消除法"], [`Multiply both sides by $${d}$:`, `两边同时乘以 $${d}$：`], [`x = ${num(x)}`]],
            ],
            [
              `Put $x = ${num(x)}$ back: $\\frac{${num(x)}}{${d}}${plus(b)} = ${num(k)}${plus(b)} = ${num(c)}$, the right side.`,
              `把 $x = ${num(x)}$ 代回去：$\\frac{${num(x)}}{${d}}${plus(b)} = ${num(k)}${plus(b)} = ${num(c)}$，正是右边。`,
            ],
            [
              [
                d * c - b,
                `That multiplies by $${d}$ before taking off the constant. Undo in reverse order: the $${plus(b).trim()}$ comes off first.`,
                `这是先乘以 $${d}$，再去掉常数。要按相反顺序抵消：先去掉 $${plus(b).trim()}$。`,
              ],
              [
                d * (c + b),
                `That moves the $${Math.abs(b)}$ the wrong way. ${en} both sides, so $\\frac{x}{${d}} = ${num(k)}$.`,
                `这是把 $${Math.abs(b)}$ 移错了方向。应在两边同时${zh}，得 $\\frac{x}{${d}} = ${num(k)}$。`,
              ],
              [
                k,
                `That is $\\frac{x}{${d}}$, not $x$: multiply by $${d}$ to finish.`,
                `这是 $\\frac{x}{${d}}$ 的值，不是 $x$：还要乘以 $${d}$。`,
              ],
            ],
            { solveFor: "x" },
          );
        },
        tableFigure(["8 - 2x", "-2x", "x"], [14, 6, -3]),
      ),
    ],
  },
  [
    "A ride costs $3$ dollars to start and $2$ dollars for each kilometre, and the bill is $11$ dollars. So $2m + 3 = 11$. Take off the $3$ to start: $2m = 8$. Then share the $8$ into $2$ equal parts: $m = 4$ kilometres.",
    "打车起步价 $3$ 元，每千米 $2$ 元，一共付了 $11$ 元。于是 $2m + 3 = 11$。先去掉起步的 $3$ 元：$2m = 8$。再把 $8$ 平均分成 $2$ 份：$m = 4$ 千米。",
  ],
  ["$4$ kilometres cost $2 \\cdot 4 + 3 = 8 + 3 = 11$ dollars.", "$4$ 千米的车费是 $2 \\cdot 4 + 3 = 8 + 3 = 11$ 元。"],
  [
    "undo the two operations in $ax + b = c$ in reverse order, and solve equations written in other ways.",
    "按相反顺序抵消 $ax + b = c$ 中的两步运算，并解写法不同的两步方程。",
  ],
);

export const equationsWithVariablesOnBothSides: TopicDef = withIntro(
  {
    id: "equations-with-variables-on-both-sides",
    title: t("Solving Linear Equations With Variables on Both Sides", "解两边都有未知数的一次方程"),
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
        ...lesson(
          "collecting-variables",
          ["Collecting the variable on one side", "把变量移到一边"],
          [
            [
              "Subtract a variable term from both sides so that the variable appears on one side only, then solve the two-step equation that remains:\n\n$$5x - 4 = 2x + 11 \\;\\Rightarrow\\; 3x - 4 = 11 \\;\\Rightarrow\\; 3x = 15 \\;\\Rightarrow\\; x = 5.$$",
              "两边同时减去一个含变量的项，使变量只出现在一边，再解剩下的两步方程：\n\n$$5x - 4 = 2x + 11 \\;\\Rightarrow\\; 3x - 4 = 11 \\;\\Rightarrow\\; 3x = 15 \\;\\Rightarrow\\; x = 5.$$",
            ],
            [
              "Put $x = 5$ into both sides: $5 \\cdot 5 - 4 = 21$ and $2 \\cdot 5 + 11 = 21$. The sides match.",
              "把 $x = 5$ 代入两边：$5 \\cdot 5 - 4 = 21$，$2 \\cdot 5 + 11 = 21$。两边相等。",
            ],
            [
              "Subtract the variable term from both sides. Adding $5x$ and $2x$ gives $7x$, and the $x$ is still on both sides.",
              "要在两边同时减去含变量的项。把 $5x$ 和 $2x$ 相加得 $7x$，$x$ 仍然在两边。",
            ],
          ],
          (rng) => {
            const a = rng.nonZero(-9, 9);
            let c = rng.nonZero(-9, 9);
            while (c === a) c = rng.nonZero(-9, 9);
            const x = rng.nonZero(-10, 10);
            const b = rng.nonZero(-20, 20);
            const d = (a - c) * x + b;
            const eq = `${linear(a, b)} = ${linear(c, d)}`;
            const [en, zh] = undo(b);
            const k = a - c;
            return valued(
              [`Solve $${eq}$.`, `解方程 $${eq}$。`],
              x,
              [
                [
                  ["Collect x on one side", "把 x 移到一边"],
                  [
                    `${c > 0 ? `Subtract $${side(c)}$ from` : `Add $${side(-c)}$ to`} both sides:`,
                    `两边同时${c > 0 ? `减去 $${side(c)}$` : `加上 $${side(-c)}$`}：`,
                  ],
                  [`${linear(k, b)} = ${num(d)}`],
                ],
                [
                  ["Solve the two-step equation", "解两步方程"],
                  [
                    `${en} both sides${k === 1 ? "" : `, then divide by $${num(k)}$`}:`,
                    `两边同时${zh}${k === 1 ? "" : `，再同时除以 $${num(k)}$`}：`,
                  ],
                  k === 1 ? [`x = ${num(x)}`] : [`${side(k)} = ${num(d - b)}`, `x = ${num(x)}`],
                ],
              ],
              [
                `Put $x = ${num(x)}$ into both sides: $${at(a, b, x)}$ and $${at(c, d, x)}$. The sides match.`,
                `把 $x = ${num(x)}$ 代入两边：$${at(a, b, x)}$，$${at(c, d, x)}$。两边相等。`,
              ],
              [
                [
                  -x,
                  `The sign is off: $${num(d - b)} \\div ${paren(k)} = ${num(x)}$.`,
                  `符号错了：$${num(d - b)} \\div ${paren(k)} = ${num(x)}$。`,
                ],
                ...(a + c !== 0
                  ? [
                      [
                        frac(d - b, a + c),
                        "You added the variable terms. To collect them on one side, subtract one from both sides.",
                        "你把含变量的项相加了。要把它们集中到一边，应在两边同时减去其中一项。",
                      ] as const,
                    ]
                  : []),
                [
                  frac(d + b, k),
                  `That moves the $${Math.abs(b)}$ the wrong way. ${en} both sides, so $${side(k)} = ${num(d - b)}$.`,
                  `这是把 $${Math.abs(b)}$ 移错了方向。应在两边同时${zh}，得 $${side(k)} = ${num(d - b)}$。`,
                ],
              ],
              { solveFor: "x" },
            );
          },
          tableFigure(["x", "5x - 4", "2x + 11"], [5, 21, 21]),
        ),
        keyPrerequisites: ["two-step-equations", "combining-like-terms"],
      },
      lesson(
        "number-of-solutions",
        ["No solution or infinitely many", "无解与无穷多解"],
        [
          [
            "Collecting the variable can make it disappear. Then the equation is either\n\n- always true, such as $3 = 3$: **every** number is a solution (infinitely many solutions), or\n- never true, such as $3 = -1$: there is **no solution**.\n\nIf the coefficients of $x$ on the two sides differ, there is exactly one solution.",
            "把变量移到一边时，变量可能会被消去。这时方程要么\n\n- 恒成立，例如 $3 = 3$：**任何**数都是解（有无穷多个解）；\n- 永不成立，例如 $3 = -1$：方程**无解**。\n\n如果两边 $x$ 的系数不同，方程恰有一个解。",
          ],
          [
            "Try a few values in $2x + 3 = 2x - 1$: at $x = 0$ the sides are $3$ and $-1$, at $x = 1$ they are $5$ and $1$. The gap is always $4$, so they never meet.",
            "在 $2x + 3 = 2x - 1$ 中试几个值：$x = 0$ 时两边是 $3$ 和 $-1$，$x = 1$ 时是 $5$ 和 $1$。差总是 $4$，所以两边永远不相等。",
          ],
          [
            "When $x$ disappears, the answer is not $x = 0$. Look at what is left: a true statement means every number works, and a false one means none does.",
            "$x$ 被消去时，答案不是 $x = 0$。要看剩下的式子：成立就说明任何数都是解，不成立就说明无解。",
          ],
        ],
        (rng) => {
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
          const one: Pair = ["Exactly one", "恰有一个"];
          const many: Pair = ["Infinitely many", "无穷多个"];
          const none: Pair = ["None", "无解"];
          const options = [one, many, none] as const;
          const reasons: readonly Pair[] = [
            [
              `The coefficients of $x$, $${num(a)}$ and $${num(c)}$, differ, so the sides meet for exactly one value of $x$.`,
              `$x$ 的系数 $${num(a)}$ 和 $${num(c)}$ 不同，所以两边恰好在一个 $x$ 值处相等。`,
            ],
            [
              `Taking $${side(a)}$ from both sides leaves $${num(b)} = ${num(b)}$, which is always true, so every $x$ works.`,
              `两边同时去掉 $${side(a)}$，剩下 $${num(b)} = ${num(b)}$，这总是成立，所以任何 $x$ 都是解。`,
            ],
            [
              `Taking $${side(a)}$ from both sides leaves $${num(b)} = ${num(d)}$, which is false, so no $x$ works.`,
              `两边同时去掉 $${side(a)}$，剩下 $${num(b)} = ${num(d)}$，这不成立，所以没有 $x$ 是解。`,
            ],
          ];
          const last: readonly [string, string, string] =
            kind === 0
              ? [
                  `${linear(a - c, b)} = ${num(d)}`,
                  `Take $${side(c)}$ away from both sides; $${side(a - c)}$ is left, so $x$ stays:`,
                  `两边同时去掉 $${side(c)}$，还剩 $${side(a - c)}$，$x$ 没有消去：`,
                ]
              : [
                  `${num(b)} = ${num(d)}`,
                  `Take $${side(a)}$ away from both sides; $x$ disappears, and the statement left is ${kind === 1 ? "true" : "false"}:`,
                  `两边同时去掉 $${side(a)}$，$x$ 被消去，剩下的式子${kind === 1 ? "成立" : "不成立"}：`,
                ];
          const check: Pair =
            kind === 0
              ? [
                  `The gap between the two sides changes by $${Math.abs(a - c)}$ each time $x$ goes up by $1$, so it is zero for exactly one $x$.`,
                  `$x$ 每增加 $1$，两边的差就变化 $${Math.abs(a - c)}$，所以恰好有一个 $x$ 使差为零。`,
                ]
              : kind === 1
                ? [
                    `Try two values: $x = 0$ makes both sides $${num(b)}$, and $x = 1$ makes both sides $${num(a + b)}$.`,
                    `试两个值：$x = 0$ 时两边都是 $${num(b)}$，$x = 1$ 时两边都是 $${num(a + b)}$。`,
                  ]
                : [
                    `Try two values: at $x = 0$ the sides are $${num(b)}$ and $${num(d)}$, at $x = 1$ they are $${num(a + b)}$ and $${num(a + d)}$. They always differ by $${Math.abs(b - d)}$.`,
                    `试两个值：$x = 0$ 时两边是 $${num(b)}$ 和 $${num(d)}$，$x = 1$ 时是 $${num(a + b)}$ 和 $${num(a + d)}$。两边总是相差 $${Math.abs(b - d)}$。`,
                  ];
          const wrongs = [0, 1, 2]
            .filter((i) => i !== kind)
            .map((i) => {
              const reason = reasons[kind] as Pair;
              const lead: Pair =
                i === 0
                  ? [`Exactly one solution needs different coefficients of $x$.`, `恰有一个解，要求两边 $x$ 的系数不同。`]
                  : i === 1
                    ? [`Every $x$ works only when the two sides are the same expression.`, `只有两边是同一个式子时，任何 $x$ 才都是解。`]
                    : [`No solution needs $x$ to disappear and leave a false statement.`, `无解要求 $x$ 被消去后剩下不成立的式子。`];
              return [options[i] as Pair, `${lead[0]} ${reason[0]}`, `${lead[1]}${reason[1]}`] as const;
            });
          return chosen(
            rng,
            [`How many solutions does $${eq}$ have?`, `方程 $${eq}$ 有几个解？`],
            options[kind] as Pair,
            wrongs,
            [
              [
                ["Compare the x terms", "比较 x 的系数"],
                [
                  `Simplified, the left side is $${linear(a, b)}$ and the right side is $${linear(c, d)}$, so the coefficients of $x$ are:`,
                  `化简后左边是 $${linear(a, b)}$，右边是 $${linear(c, d)}$，所以 $x$ 的系数是：`,
                ],
                [`${num(a)},\\ ${num(c)}`],
              ],
              [["Collect x", "移项"], [last[1], last[2]], [last[0]]],
            ],
            check,
          );
        },
        tableFigure(["x", "2x + 3", "2x - 1"], [0, 3, -1]),
      ),
    ],
  },
  [
    "Mia has $5$ full boxes of pens but gives away $4$ pens. Leo has $2$ full boxes and $11$ loose pens. They end up with the same number, so $5x - 4 = 2x + 11$. Take $2$ boxes from each side: $3x - 4 = 11$, so $3x = 15$ and each box holds $x = 5$ pens.",
    "米娅有 $5$ 整盒笔，送出去 $4$ 支；利奥有 $2$ 整盒笔，另外还有 $11$ 支。两人的笔一样多，所以 $5x - 4 = 2x + 11$。两边各去掉 $2$ 盒：$3x - 4 = 11$，于是 $3x = 15$，每盒有 $x = 5$ 支笔。",
  ],
  [
    "Mia has $5 \\cdot 5 - 4 = 21$ pens and Leo has $2 \\cdot 5 + 11 = 21$.",
    "米娅有 $5 \\cdot 5 - 4 = 21$ 支，利奥有 $2 \\cdot 5 + 11 = 21$ 支。",
  ],
  [
    "gather the variable on one side and solve, and tell when an equation has no solution or infinitely many.",
    "把变量集中到一边再求解，并判断方程什么时候无解、什么时候有无穷多个解。",
  ],
);

/** equationsWithParentheses teaches expanding parentheses before solving. */
export const equationsWithParentheses: TopicDef = withIntro(
  {
    id: "equations-with-parentheses",
    title: t("Solving Linear Equations Using the Distributive Property", "用分配律解一次方程"),
    summary: t("Expand parentheses, then solve linear equations.", "先去括号，再解一元一次方程。"),
    prerequisites: ["equations-with-variables-on-both-sides", "simplifying-expressions"],
    encompasses: [{ topic: "simplifying-expressions", weight: 0.8 }],
    xp: 15,
    standards: ["CCSS.8.EE.C.7.B"],
    knowledgePoints: [
      {
        ...lesson(
          "expand-then-solve",
          ["Expanding, then solving", "先展开，再求解"],
          [
            [
              "When $x$ is inside parentheses, expand first: the number outside multiplies every term inside, sign and all. Then it is an ordinary two-step equation. $-3(x - 4) = 21$: $-3x + 12 = 21$, $-3x = 9$, $x = -3$.",
              "$x$ 在括号里时，先展开：括号外的数要乘括号里的每一项，连同符号。然后就是普通的两步方程。$-3(x - 4) = 21$：$-3x + 12 = 21$，$-3x = 9$，$x = -3$。",
            ],
            ["Put it back: $-3(-3 - 4) = -3 \\cdot (-7) = 21$.", "代回去：$-3(-3 - 4) = -3 \\cdot (-7) = 21$。"],
            [
              "Multiply the number inside too. $-3(x - 4)$ is $-3x + 12$, not $-3x - 4$.",
              "括号里的数也要乘。$-3(x - 4)$ 是 $-3x + 12$，不是 $-3x - 4$。",
            ],
          ],
          (rng) => {
            const a = rng.sign() * rng.int(2, 9);
            const b = rng.nonZero(-9, 9);
            const x = rng.nonZero(-10, 10);
            const c = a * (x + b);
            const eq = `${num(a)}(${linear(1, b)}) = ${num(c)}`;
            return valued(
              [`Solve $${eq}$.`, `解方程 $${eq}$。`],
              x,
              [
                [
                  ["Expand", "展开"],
                  [`Multiply both terms inside by $${num(a)}$:`, `用 $${num(a)}$ 乘括号里的两项：`],
                  [`${linear(a, a * b)} = ${num(c)}`],
                ],
                [
                  ["Undo the constant", "移走常数"],
                  [`${undo(a * b)[0]} both sides:`, `两边同时${undo(a * b)[1]}：`],
                  [`${side(a)} = ${num(c - a * b)}`],
                ],
                [["Divide", "相除"], [`Divide both sides by $${num(a)}$:`, `两边同时除以 $${num(a)}$：`], [`x = ${num(x)}`]],
              ],
              [
                `Put it back: $${num(a)}(${num(x)}${plus(b)}) = ${num(a)} \\cdot ${paren(x + b)} = ${num(c)}$.`,
                `代回去：$${num(a)}(${num(x)}${plus(b)}) = ${num(a)} \\cdot ${paren(x + b)} = ${num(c)}$。`,
              ],
              [
                [
                  frac(c - b, a),
                  `That multiplies only $x$ by $${num(a)}$, not the $${num(b)}$.`,
                  `这只用 $${num(a)}$ 乘了 $x$，没有乘 $${num(b)}$。`,
                ],
                [
                  frac(c, a).add(Q.of(b)),
                  `That divides by $${num(a)}$ correctly but then moves $${num(b)}$ with the wrong sign.`,
                  `这正确地除以了 $${num(a)}$，但移动 $${num(b)}$ 时符号错了。`,
                ],
                [-x, "That has the wrong sign.", "符号错了。"],
              ],
              { solveFor: "x" },
            );
          },
          areaGridFigure(["−3"], ["x", "−4"], [["−3x", "+12"]]),
        ),
        keyPrerequisites: ["distributive-property", "two-step-equations"],
      },
      lesson(
        "parentheses-and-variables-on-both-sides",
        ["Parentheses and variables on both sides", "含括号且两边都有变量"],
        [
          [
            "Expand every parenthesis, then collect $x$ on one side and the numbers on the other. $2(3x + 1) = 4x - 8$: $6x + 2 = 4x - 8$, so $2x = -10$ and $x = -5$.",
            "展开所有括号，再把 $x$ 移到一边，数移到另一边。$2(3x + 1) = 4x - 8$：$6x + 2 = 4x - 8$，所以 $2x = -10$，$x = -5$。",
          ],
          ["Both sides at $x = -5$: $2(-15 + 1) = -28$ and $-20 - 8 = -28$.", "$x = -5$ 时两边：$2(-15 + 1) = -28$，$-20 - 8 = -28$。"],
          [
            "When you move $4x$ across, subtract it; adding it gives $10x$, which is wrong.",
            "把 $4x$ 移过去要减去它；加上它会得到 $10x$，是错的。",
          ],
        ],
        (rng) => {
          const a = rng.sign() * rng.int(2, 6);
          const b = rng.nonZero(-5, 5);
          const c = rng.nonZero(-9, 9);
          let d = rng.nonZero(-9, 9);
          while (d === a * b) d = rng.nonZero(-9, 9);
          const x = rng.nonZero(-8, 8);
          const e = a * (b * x + c) - d * x;
          const eq = `${num(a)}(${linear(b, c)}) = ${linear(d, e)}`;
          const k = a * b - d;
          const both = a * (b * x + c);
          return valued(
            [`Solve $${eq}$.`, `解方程 $${eq}$。`],
            x,
            [
              [
                ["Expand", "展开"],
                [`Multiply both terms inside by $${num(a)}$:`, `用 $${num(a)}$ 乘括号里的两项：`],
                [`${linear(a * b, a * c)} = ${linear(d, e)}`],
              ],
              [
                ["Collect the terms", "移项"],
                [`Take $${side(d)}$ and $${num(a * c)}$ from both sides:`, `两边同时减去 $${side(d)}$ 和 $${num(a * c)}$：`],
                [`${side(k)} = ${num(e - a * c)}`],
              ],
              [["Divide", "相除"], [`Divide both sides by $${num(k)}$:`, `两边同时除以 $${num(k)}$：`], [`x = ${num(x)}`]],
            ],
            [
              `At $x = ${num(x)}$ the left side is $${num(a)} \\cdot ${paren(b * x + c)} = ${num(both)}$ and the right side is $${num(d * x)}${plus(e)} = ${num(both)}$.`,
              `$x = ${num(x)}$ 时，左边是 $${num(a)} \\cdot ${paren(b * x + c)} = ${num(both)}$，右边是 $${num(d * x)}${plus(e)} = ${num(both)}$。`,
            ],
            [
              [frac(e - c, k), `That leaves $${num(c)}$ unmultiplied when expanding.`, `展开时没有用 $${num(a)}$ 乘 $${num(c)}$。`],
              [-x, "That has the wrong sign.", "符号错了。"],
              ...(a * b + d !== 0
                ? [
                    [
                      frac(e - a * c, a * b + d),
                      `That adds $${side(d)}$ to the left instead of subtracting it.`,
                      `这把 $${side(d)}$ 加到了左边，而不是减去。`,
                    ] as const,
                  ]
                : []),
            ],
            { solveFor: "x" },
          );
        },
        tableFigure(["x", "2(3x+1)", "4x−8"], [-5, -28, -28]),
      ),
    ],
  },
  [
    "$3(x + 2) = 21$ means three equal groups of $x + 2$ make $21$. Expand: $3x + 6 = 21$, so $3x = 15$ and $x = 5$.",
    "$3(x + 2) = 21$ 表示三组相同的 $x + 2$ 一共是 $21$。展开：$3x + 6 = 21$，所以 $3x = 15$，$x = 5$。",
  ],
  ["Each group is $21 \\div 3 = 7$, and $x = 7 - 2 = 5$.", "每组是 $21 \\div 3 = 7$，$x = 7 - 2 = 5$。"],
  [
    "expand parentheses in an equation first, then solve it, even with $x$ on both sides.",
    "学习先展开方程里的括号再求解，包括两边都有 $x$ 的方程。",
  ],
);

/** subtractingAGroup solves an equation where a group in parentheses is subtracted. */
export const subtractingAGroup = lesson(
  "subtracting-a-group",
  ["Subtracting a group", "减去一个括号"],
  [
    [
      "A minus sign before parentheses changes the sign of **every** term inside. $7x - (3x - 5) + 2 = 23$: $7x - 3x + 5 + 2 = 23$, so $4x + 7 = 23$, $4x = 16$ and $x = 4$.",
      "括号前的减号要改变括号里**每一项**的符号。$7x - (3x - 5) + 2 = 23$：$7x - 3x + 5 + 2 = 23$，所以 $4x + 7 = 23$，$4x = 16$，$x = 4$。",
    ],
    ["Put it back: $28 - (12 - 5) + 2 = 28 - 7 + 2 = 23$.", "代回去：$28 - (12 - 5) + 2 = 28 - 7 + 2 = 23$。"],
    [
      "Change the sign of the last term inside too. $-(3x - 5)$ is $-3x + 5$, not $-3x - 5$.",
      "括号里最后一项也要变号。$-(3x - 5)$ 是 $-3x + 5$，不是 $-3x - 5$。",
    ],
  ],
  (rng) => {
    const a = rng.int(2, 6);
    const x = rng.nonZero(-9, 9);
    const b = rng.int(1, 9);
    const c = rng.int(1, a * 3);
    const k = a + rng.int(1, 4);
    const right = k * x - (a * x - c) + b;
    const m = k - a;
    return valued(
      [`Solve $${k}x - (${a}x - ${c}) + ${b} = ${num(right)}$.`, `解方程 $${k}x - (${a}x - ${c}) + ${b} = ${num(right)}$。`],
      x,
      [
        [
          ["Remove the parentheses", "去括号"],
          ["The minus sign changes both signs inside:", "减号使括号里两项都变号："],
          [`${k}x - ${a}x + ${c} + ${b} = ${num(right)}`],
        ],
        [["Combine", "合并"], ["Combine like terms on the left:", "合并左边的同类项："], [`${side(m)} + ${c + b} = ${num(right)}`]],
        [
          ["Solve", "求解"],
          [`Subtract $${c + b}$, then divide by $${m}$:`, `减去 $${c + b}$，再除以 $${m}$：`],
          [`${side(m)} = ${num(right - c - b)}`, `x = ${num(x)}`],
        ],
      ],
      [
        `Put it back: $${k} \\cdot ${paren(x)} - (${a} \\cdot ${paren(x)} - ${c}) + ${b} = ${num(k * x)} - ${paren(a * x - c)} + ${b} = ${num(right)}$.`,
        `代回去：$${k} \\cdot ${paren(x)} - (${a} \\cdot ${paren(x)} - ${c}) + ${b} = ${num(k * x)} - ${paren(a * x - c)} + ${b} = ${num(right)}$。`,
      ],
      [
        [
          frac(right + c - b, m),
          `That changes only the sign of $${a}x$, leaving $-${c}$ as it was.`,
          `这只改变了 $${a}x$ 的符号，$-${c}$ 没有变号。`,
        ],
        [-x, "That has the wrong sign.", "符号错了。"],
        [
          right - b,
          "That only takes away the last number; the equation still has to be solved.",
          "这只是减去了最后一个数；方程还没有解完。",
        ],
      ],
      { solveFor: "x" },
    );
  },
  areaGridFigure(["−1"], ["3x", "−5"], [["−3x", "+5"]]),
);
/** equationTopics are the topics of the equations unit, in teaching order. */
export const equationTopics: readonly TopicDef[] = [
  oneStepEquationsAddition,
  oneStepEquationsMultiplication,
  twoStepEquations,
  equationsWithVariablesOnBothSides,
  equationsWithParentheses,
];
