import type { TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { linear, num, paren, poly, Q } from "@ga/subject-math";

import { numberProblem, steps, why } from "../problems.ts";
import { type Pair, tableFigure } from "./early-grades-more-kit.ts";
import { chosen, lesson, valued, withIntro } from "./grade-6-kit.ts";

/** frac is the exact quotient a / b, for the values that mistakes produce. */
const frac = (a: number, b: number) => Q.of(a, b);

/** side writes a coefficient times x: side(-1) is "-x". */
const side = (a: number) => poly([a, "x"]);

export const oneStepEquationsAddition: TopicDef = {
  id: "one-step-equations-addition",
  title: t("Solving One-Step Addition and Subtraction Equations", "解一步加减法方程"),
  summary: t("Solve $x + a = b$ by doing the same to both sides.", "通过在两边做相同的运算解 $x + a = b$。"),
  prerequisites: ["evaluating-expressions"],
  encompasses: [{ topic: "subtracting-integers", weight: 0.3 }],
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
          wrong: [-x],
          mistakes: [
            why(
              b + a,
              "That repeats the operation instead of undoing it. Do the opposite on both sides.",
              "这是把运算又做了一遍，而不是撤销它。两边要做相反的运算。",
            ),
          ],
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
          mistakes: [
            why(
              b + a,
              "That repeats the operation instead of undoing it. Do the opposite on both sides.",
              "这是把运算又做了一遍，而不是撤销它。两边要做相反的运算。",
            ),
            why(
              a - b,
              "You subtracted in the wrong order. Start from the side without $x$ and take away the number that was added to $x$.",
              "你减的顺序反了。应从不含 $x$ 的一边开始，减去加在 $x$ 上的数。",
            ),
          ],
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
  title: t("Solving One-Step Multiplication and Division Equations", "解一步乘除法方程"),
  summary: t("Solve $ax = b$ and $\\frac{x}{a} = b$.", "解 $ax = b$ 与 $\\frac{x}{a} = b$。"),
  prerequisites: ["one-step-equations-addition"],
  encompasses: [{ topic: "dividing-integers", weight: 0.5 }],
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
          wrong: [-x],
          mistakes: [
            why(
              b - a,
              "You subtracted the coefficient. The coefficient multiplies $x$, so divide both sides by it.",
              "你减去了系数。系数是乘在 $x$ 上的，所以两边要除以它。",
            ),
            why(b * a, "You multiplied by the coefficient. To undo a multiplication, divide.", "你乘了系数。要撤销乘法，应该做除法。"),
          ],
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
          wrong: [-x],
          mistakes: [
            why(
              frac(b, a),
              "You divided. The unknown is being divided, so multiply both sides to undo it.",
              "你做了除法。未知数正在被除，要撤销就应在两边做乘法。",
            ),
            why(b + d, "You added the denominator. To undo a division, multiply.", "你加上了分母。要撤销除法，应该做乘法。"),
          ],
          solution: t(
            `Multiply both sides by $${num(a)}$: ${steps(`x = ${paren(a)} \\cdot ${paren(b)} = ${num(x)}`)}`,
            `两边同时乘以 $${num(a)}$：${steps(`x = ${paren(a)} \\cdot ${paren(b)} = ${num(x)}`)}`,
          ),
        });
      },
    },
  ],
};

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

export const equationsWithParentheses: TopicDef = {
  id: "equations-with-parentheses",
  title: t("Solving Linear Equations Using the Distributive Property", "用分配律解一次方程"),
  summary: t("Expand parentheses, then solve linear equations.", "先去括号，再解一元一次方程。"),
  prerequisites: ["equations-with-variables-on-both-sides", "simplifying-expressions"],
  encompasses: [{ topic: "simplifying-expressions", weight: 0.8 }],
  xp: 15,
  standards: ["CCSS.8.EE.C.7.B"],
  knowledgePoints: [
    {
      id: "expand-then-solve",
      title: t("Expanding, then solving", "先展开，再求解"),
      explanation: t(
        "A number multiplying a group must multiply every term inside it, including its sign. Once the parentheses are gone, the equation is an ordinary two-step equation.\n\nWhen the variable is inside parentheses, expand with the distributive property first, then solve:\n\n$$-3(x - 4) = 21 \\;\\Rightarrow\\; -3x + 12 = 21 \\;\\Rightarrow\\; -3x = 9 \\;\\Rightarrow\\; x = -3.$$",
        "括号前的数要乘括号内的每一项，包括它的符号。去掉括号后，方程就成了普通的两步方程。\n\n变量在括号里时，先用分配律展开，再求解：\n\n$$-3(x - 4) = 21 \\;\\Rightarrow\\; -3x + 12 = 21 \\;\\Rightarrow\\; -3x = 9 \\;\\Rightarrow\\; x = -3.$$",
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
