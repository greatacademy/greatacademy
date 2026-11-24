import type { Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { linear, num, poly, Q, relSymbol } from "@ga/subject-math";
import { gradeDrawings4 } from "../explanation-drawings-grades-4.ts";

import { type InequalityOp, inequalityLatex } from "../problems.ts";
import { numberLineFigure, ray } from "./compound-inequalities.ts";
import { bounded, decided, drawn, lesson, valued, withIntro } from "./grade-6-kit.ts";

const ops: readonly InequalityOp[] = ["<", "<=", ">", ">="];
const flip: Record<InequalityOp, InequalityOp> = { "<": ">", ">": "<", "<=": ">=", ">=": "<=" };
const strictness: Record<InequalityOp, InequalityOp> = { "<": "<=", "<=": "<", ">": ">=", ">=": ">" };
const holds = (l: number, op: InequalityOp, r: number) => ({ "<": l < r, "<=": l <= r, ">": l > r, ">=": l >= r })[op];

/** inside is a whole number on the solution side of x op v, one step past the boundary. */
const inside = (op: InequalityOp, v: number) => (op === ">" || op === ">=" ? v + 1 : v - 1);

/** keeps says that the symbol stays because only adding, subtracting or dividing by a positive number happened. */
const keeps = (en: string, zh: string): [string, string] => [`${en} never reverses the symbol.`, `${zh}不会改变不等号的方向。`];

/** reversed says why forgetting to reverse the symbol is wrong. */
const reversed = (a: number): [string, string] => [
  `Dividing by $${num(a)}$, a negative number, reverses the symbol; this answer kept it.`,
  `除以负数 $${num(a)}$ 要改变不等号方向；这个答案没有改变。`,
];

/** times writes a·v for a substituted value, with parentheses around a negative v. */
const times = (a: number, v: number) =>
  `${a === 1 ? "" : a === -1 ? "-" : num(a)}${a === 1 || a === -1 ? (v < 0 ? `(${num(v)})` : num(v)) : `(${num(v)})`}`;

/** inequalitiesAndSolutions checks solutions of inequalities and writes inequalities from words. */
export const inequalitiesAndSolutions: TopicDef = withIntro(
  {
    id: "inequalities-and-solutions",
    title: t("Inequalities", "不等式"),
    summary: t("Read and write inequalities, and check whether a number is a solution.", "读写不等式，判断一个数是否是不等式的解。"),
    prerequisites: ["evaluating-expressions"],
    encompasses: [],
    xp: 10,
    standards: ["CCSS.6.EE.B.5", "CCSS.6.EE.B.8"],
    knowledgePoints: [
      {
        ...lesson(
          "checking-solutions",
          ["Checking a solution", "检验解"],
          [
            [
              "An **inequality** compares two sides with $<$ (less than), $\\le$ (less than or equal to), $>$ (greater than) or $\\ge$ (greater than or equal to). A value is a **solution** if putting it in makes the inequality true. $x = 4$ solves $2x - 1 \\ge 7$, because $2(4) - 1 = 7$ and $7 \\ge 7$ is true.",
              "**不等式**用 $<$（小于）、$\\le$（小于或等于）、$>$（大于）或 $\\ge$（大于或等于）比较两边。代入后能使不等式成立的值是它的**解**。$x = 4$ 是 $2x - 1 \\ge 7$ 的解，因为 $2(4) - 1 = 7$，而 $7 \\ge 7$ 成立。",
            ],
            ["Solving $2x - 1 \\ge 7$ gives $x \\ge 4$, and $4$ is included.", "解 $2x - 1 \\ge 7$ 得 $x \\ge 4$，$4$ 包含在内。"],
            [
              "Mind the line under the symbol. $x = 4$ does **not** solve $2x - 1 > 7$, because $7 > 7$ is false.",
              "注意符号下面的横线。$x = 4$ **不是** $2x - 1 > 7$ 的解，因为 $7 > 7$ 不成立。",
            ],
          ],
          (rng) => {
            const a = rng.nonZero(-6, 6);
            const b = rng.nonZero(-12, 12);
            const x = rng.nonZero(-8, 8);
            const v = a * x + b;
            const op = rng.pick(ops);
            const c = rng.bool(0.35) ? v : v + rng.nonZero(-6, 6);
            const expr = linear(a, b);
            const ok = holds(v, op, c);
            const sub = `${times(a, x)} ${b < 0 ? "-" : "+"} ${Math.abs(b)}`;
            const solvedOp = a < 0 ? flip[op] : op;
            const bound = Q.of(c - b, a);
            const rel = relSymbol(op);
            return decided(
              rng,
              [
                `Is $x = ${num(x)}$ a solution of $${expr} ${rel} ${num(c)}$?`,
                `$x = ${num(x)}$ 是不等式 $${expr} ${rel} ${num(c)}$ 的解吗？`,
              ],
              ok,
              [
                [
                  ["Substitute", "代入"],
                  [`Put $x = ${num(x)}$ into the left side:`, `把 $x = ${num(x)}$ 代入左边：`],
                  [`${sub} = ${num(v)}`],
                ],
                [
                  ["Compare", "比较"],
                  [
                    `The statement $${num(v)} ${rel} ${num(c)}$ is ${ok ? "true" : "false"}.`,
                    `$${num(v)} ${rel} ${num(c)}$ ${ok ? "成立" : "不成立"}。`,
                  ],
                ],
              ],
              [
                `Solving gives $${inequalityLatex("x", solvedOp, bound)}$, and $${num(x)}$ ${ok ? "is" : "is not"} on that side.`,
                `解不等式得 $${inequalityLatex("x", solvedOp, bound)}$，$${num(x)}$ ${ok ? "在" : "不在"}这个范围内。`,
              ],
              ok
                ? [
                    `$${num(v)} ${rel} ${num(c)}$ is true, so $x = ${num(x)}$ is a solution.`,
                    `$${num(v)} ${rel} ${num(c)}$ 成立，所以 $x = ${num(x)}$ 是解。`,
                  ]
                : v === c
                  ? [`The two sides are equal, but $${rel}$ does not allow equal.`, `两边相等，但 $${rel}$ 不包括相等。`]
                  : [
                      `$${num(v)} ${rel} ${num(c)}$ is false, so $x = ${num(x)}$ is not a solution.`,
                      `$${num(v)} ${rel} ${num(c)}$ 不成立，所以 $x = ${num(x)}$ 不是解。`,
                    ],
            );
          },
          numberLineFigure([ray(">=", 4)], 0, 8),
        ),
        keyPrerequisites: ["evaluating-expressions"],
      },
      lesson(
        "writing-inequalities",
        ["Writing inequalities", "写出不等式"],
        [
          [
            'Words turn into symbols: "less than" is $<$, "at most" or "no more than" is $\\le$, "greater than" is $>$, and "at least" or "no less than" is $\\ge$. "$x$ is at least $-3$" means $x$ can be $-3$ or anything greater: $x \\ge -3$.',
            '文字可以换成符号："小于"是 $<$，"至多"或"不超过"是 $\\le$，"大于"是 $>$，"至少"或"不小于"是 $\\ge$。"$x$ 至少是 $-3$"表示 $x$ 可以等于 $-3$ 或比它大：$x \\ge -3$。',
          ],
          [
            "$-3$ itself fits, since $-3 \\ge -3$, and so does $0$, since $0 \\ge -3$.",
            "$-3$ 本身符合，因为 $-3 \\ge -3$；$0$ 也符合，因为 $0 \\ge -3$。",
          ],
          [
            '"At least" includes the number itself, so it needs the line underneath: $\\ge$, not $>$.',
            '"至少"包括这个数本身，所以符号下面要有横线：是 $\\ge$，不是 $>$。',
          ],
        ],
        (rng) => {
          const phrases: readonly [InequalityOp, Text][] = [
            ["<", t("less than", "小于")],
            ["<=", t("at most", "至多是")],
            ["<=", t("no more than", "不超过")],
            [">", t("greater than", "大于")],
            [">=", t("at least", "至少是")],
            [">=", t("no less than", "不小于")],
          ];
          const [op, phrase] = rng.pick(phrases);
          const v = rng.int(-20, 20);
          const included = op === "<=" || op === ">=";
          const up = op === ">" || op === ">=";
          const tv = inside(op, v);
          return bounded(
            [
              `Write an inequality that says: $x$ is ${phrase.en} $${num(v)}$.`,
              `写出表示下面意思的不等式：$x$ ${phrase["zh-CN"]} $${num(v)}$。`,
            ],
            "x",
            op,
            v,
            [
              [
                ["Pick the direction", "确定方向"],
                [
                  `"${phrase.en}" allows numbers ${up ? "above" : "below"} $${num(v)}$.`,
                  `"${phrase["zh-CN"]}"允许比 $${num(v)}$ ${up ? "大" : "小"}的数。`,
                ],
              ],
              [
                ["Decide about the end", "确定端点"],
                [
                  `$${num(v)}$ itself is ${included ? "allowed" : "not allowed"}, so the symbol is $${relSymbol(op)}$:`,
                  `$${num(v)}$ 本身${included ? "可以" : "不可以"}，所以符号是 $${relSymbol(op)}$：`,
                ],
                [inequalityLatex("x", op, v)],
              ],
            ],
            [
              `$${num(tv)}$ is ${phrase.en} $${num(v)}$ and $${num(tv)} ${relSymbol(op)} ${num(v)}$ is true; $${num(v)} ${relSymbol(op)} ${num(v)}$ is ${included ? "true" : "false"}, as it should be.`,
              `$${num(tv)}$ ${phrase["zh-CN"]} $${num(v)}$，$${num(tv)} ${relSymbol(op)} ${num(v)}$ 成立；$${num(v)} ${relSymbol(op)} ${num(v)}$ ${included ? "成立" : "不成立"}，正应如此。`,
            ],
            [
              [
                strictness[op],
                v,
                included
                  ? `That leaves out $${num(v)}$ itself, which "${phrase.en}" allows.`
                  : `That lets $x$ equal $${num(v)}$, which "${phrase.en}" does not allow.`,
                included
                  ? `这把 $${num(v)}$ 本身排除了，而"${phrase["zh-CN"]}"包括它。`
                  : `这允许 $x$ 等于 $${num(v)}$，而"${phrase["zh-CN"]}"不允许。`,
              ],
              [flip[op], v, "That points the wrong way.", "方向反了。"],
            ],
          );
        },
        drawn(gradeDrawings4["inequalities-and-solutions#writing-inequalities"]),
      ),
    ],
  },
  [
    "A ride says: you must be at least $120$ cm tall. Mia is $125$ cm, so she can ride; so can anyone exactly $120$ cm. The rule is the inequality $h \\ge 120$, and every height that fits is a solution.",
    "一个游乐项目规定：身高至少 $120$ 厘米。小米身高 $125$ 厘米，可以玩；正好 $120$ 厘米的人也可以。这条规定就是不等式 $h \\ge 120$，符合要求的每个身高都是它的解。",
  ],
  [
    "$125 \\ge 120$ is true and $120 \\ge 120$ is true, but $119 \\ge 120$ is false.",
    "$125 \\ge 120$ 成立，$120 \\ge 120$ 成立，但 $119 \\ge 120$ 不成立。",
  ],
  [
    "check whether a number is a solution of an inequality, and write inequalities from words.",
    "学习检验一个数是不是不等式的解，并把文字写成不等式。",
  ],
);

/** countingTheIntegersThatWork counts the integers between two bounds, deciding whether each bound counts. */
export const countingTheIntegersThatWork = lesson(
  "counting-whole-numbers-that-work",
  ["Counting the integers that work", "数符合条件的整数"],
  [
    [
      "Two inequalities together keep only the numbers between two bounds. First decide whether each bound counts: it does with $\\le$ and not with $<$. Then count. $2 \\le x < 6$ allows $2, 3, 4, 5$: four integers.",
      "两个不等式合在一起只留下两个界之间的数。先判断每个界算不算：$\\le$ 时算，$<$ 时不算。然后再数。$2 \\le x < 6$ 允许 $2, 3, 4, 5$：四个整数。",
    ],
    ["From $2$ up to $5$ is $5 - 2 + 1 = 4$ integers.", "从 $2$ 到 $5$ 共有 $5 - 2 + 1 = 4$ 个整数。"],
    [
      "Subtracting the bounds, $6 - 2 = 4$, is right here only by luck: always check which ends count.",
      "两个界相减 $6 - 2 = 4$ 在这里碰巧对了：一定要检查两端算不算。",
    ],
  ],
  (rng) => {
    const low = rng.int(-12, 6);
    const span = rng.int(3, 15);
    const high = low + span;
    const lowIn = rng.bool();
    const highIn = rng.bool();
    const count = span - 1 + (lowIn ? 1 : 0) + (highIn ? 1 : 0);
    const first = lowIn ? low : low + 1;
    const last = highIn ? high : high - 1;
    const expr = `${low} ${lowIn ? "\\le" : "<"} x ${highIn ? "\\le" : "<"} ${high}`;
    return valued(
      [`How many integers satisfy $${expr}$?`, `有多少个整数满足 $${expr}$？`],
      count,
      [
        [
          ["Check the ends", "检查两端"],
          [
            `$${low}$ ${lowIn ? "counts" : "does not count"} and $${high}$ ${highIn ? "counts" : "does not count"}, so the integers run from $${first}$ to $${last}$.`,
            `$${low}$ ${lowIn ? "算" : "不算"}，$${high}$ ${highIn ? "算" : "不算"}，所以整数从 $${first}$ 到 $${last}$。`,
          ],
        ],
        [
          ["Count", "数一数"],
          ["Last minus first, plus one:", "最后一个减第一个，再加一："],
          [`${last} - ${first < 0 ? `(${first})` : first} + 1 = ${count}`],
        ],
      ],
      [
        `Between the bounds there are $${span - 1}$ integers; add $${(lowIn ? 1 : 0) + (highIn ? 1 : 0)}$ for the ends that count: $${count}$.`,
        `两个界之间有 $${span - 1}$ 个整数；再加上算在内的端点 $${(lowIn ? 1 : 0) + (highIn ? 1 : 0)}$ 个：$${count}$。`,
      ],
      [
        [
          span,
          `That only subtracts the bounds, $${high} - ${low < 0 ? `(${low})` : low}$.`,
          `这只是把两个界相减：$${high} - ${low < 0 ? `(${low})` : low}$。`,
        ],
        [span + 1, "That counts both ends, but not both of them are allowed.", "这把两端都算上了，但并不是两端都可以。"],
        [span - 1, "That leaves out both ends, but at least one of them is allowed.", "这把两端都去掉了，但至少有一端是可以的。"],
        [count + 1, "That counts one integer too many.", "多数了一个整数。"],
      ],
    );
  },
  numberLineFigure([{ lo: Q.of(2), hi: Q.of(6), loClosed: true, hiClosed: false }], 0, 8),
);

/** solvingOneStepInequalities solves inequalities in one step, reversing the symbol for a negative divisor. */
export const solvingOneStepInequalities: TopicDef = withIntro(
  {
    id: "solving-one-step-inequalities",
    title: t("Solving One-Step Linear Inequalities", "解一步一次不等式"),
    summary: t(
      "Solve inequalities in one step, reversing the symbol when multiplying or dividing by a negative number.",
      "一步解不等式；乘或除以负数时改变不等号方向。",
    ),
    prerequisites: ["inequalities-and-solutions", "one-step-equations-multiplication"],
    encompasses: [
      { topic: "one-step-equations-multiplication", weight: 0.5 },
      { topic: "one-step-equations-addition", weight: 0.5 },
    ],
    xp: 15,
    standards: ["CCSS.7.EE.B.4.B"],
    knowledgePoints: [
      {
        ...lesson(
          "adding-and-subtracting",
          ["Adding or subtracting on both sides", "两边同时加减"],
          [
            [
              "Adding or subtracting the same number on both sides keeps an inequality true, so solve it like an equation. $x + 6 < 2$: subtract $6$ from both sides, $x < -4$. The answer is not one number but every number less than $-4$.",
              "不等式两边同时加上或减去同一个数，不等式仍然成立，所以像解方程一样解它。$x + 6 < 2$：两边同时减去 $6$，得 $x < -4$。答案不是一个数，而是所有小于 $-4$ 的数。",
            ],
            ["Test $x = -5$: $-5 + 6 = 1$, and $1 < 2$ is true.", "检验 $x = -5$：$-5 + 6 = 1$，$1 < 2$ 成立。"],
            [
              "Subtract $6$, do not add it: $2 + 6 = 8$ would give $x < 8$, which is wrong.",
              "要减去 $6$，不是加上：$2 + 6 = 8$ 会得到 $x < 8$，是错的。",
            ],
          ],
          (rng) => {
            const a = rng.nonZero(-20, 20);
            const b = rng.int(-25, 25);
            const op = rng.pick(ops);
            const v = b - a;
            const tv = inside(op, v);
            return bounded(
              [`Solve $${linear(1, a)} ${relSymbol(op)} ${num(b)}$.`, `解不等式 $${linear(1, a)} ${relSymbol(op)} ${num(b)}$。`],
              "x",
              op,
              v,
              [
                [
                  ["Undo the number", "移走常数"],
                  a > 0
                    ? [`Subtract $${a}$ from both sides:`, `两边同时减去 $${a}$：`]
                    : [`Add $${-a}$ to both sides:`, `两边同时加上 $${-a}$：`],
                  [`x ${relSymbol(op)} ${num(b)} ${a > 0 ? "-" : "+"} ${Math.abs(a)}`],
                ],
                [["Simplify", "化简"], ["The symbol stays the same:", "不等号方向不变："], [inequalityLatex("x", op, v)]],
              ],
              [
                `Test $x = ${num(tv)}$: $${num(tv)} ${a > 0 ? "+" : "-"} ${Math.abs(a)} = ${num(tv + a)}$, and $${num(tv + a)} ${relSymbol(op)} ${num(b)}$ is true.`,
                `检验 $x = ${num(tv)}$：$${num(tv)} ${a > 0 ? "+" : "-"} ${Math.abs(a)} = ${num(tv + a)}$，$${num(tv + a)} ${relSymbol(op)} ${num(b)}$ 成立。`,
              ],
              [
                [
                  op,
                  b + a,
                  a > 0 ? `That adds $${a}$ instead of subtracting it.` : `That subtracts $${-a}$ instead of adding it.`,
                  a > 0 ? `这是加上了 $${a}$，而不是减去。` : `这是减去了 $${-a}$，而不是加上。`,
                ],
                [flip[op], v, ...keeps("Adding or subtracting", "加减")],
              ],
            );
          },
          numberLineFigure([ray("<", -4)], -8, 0),
        ),
        keyPrerequisites: ["one-step-equations-addition"],
      },
      {
        ...lesson(
          "positive-coefficient",
          ["Dividing by a positive number", "除以正数"],
          [
            [
              "Multiplying or dividing both sides by a **positive** number keeps the symbol as it is. $4x \\ge -12$: divide by $4$, $x \\ge -3$.",
              "两边同时乘以或除以一个**正数**，不等号方向不变。$4x \\ge -12$：两边除以 $4$，得 $x \\ge -3$。",
            ],
            ["Test $x = 0$: $4(0) = 0$, and $0 \\ge -12$ is true.", "检验 $x = 0$：$4(0) = 0$，$0 \\ge -12$ 成立。"],
            [
              "Only a negative divisor reverses the symbol. Here $-12$ is negative but the divisor $4$ is not, so $\\ge$ stays.",
              "只有除以负数才改变方向。这里 $-12$ 是负数，但除数 $4$ 不是，所以 $\\ge$ 不变。",
            ],
          ],
          (rng) => {
            const a = rng.int(2, 9);
            const v = rng.int(-10, 10);
            const op = rng.pick(ops);
            const tv = inside(op, v);
            return bounded(
              [`Solve $${a}x ${relSymbol(op)} ${num(a * v)}$.`, `解不等式 $${a}x ${relSymbol(op)} ${num(a * v)}$。`],
              "x",
              op,
              v,
              [
                [
                  ["Divide", "相除"],
                  [`Divide both sides by $${a}$:`, `两边同时除以 $${a}$：`],
                  [`x ${relSymbol(op)} \\frac{${num(a * v)}}{${a}}`],
                ],
                [
                  ["Keep the symbol", "保持方向"],
                  [`$${a}$ is positive, so the symbol stays:`, `$${a}$ 是正数，不等号方向不变：`],
                  [inequalityLatex("x", op, v)],
                ],
              ],
              [
                `Test $x = ${num(tv)}$: $${a}(${num(tv)}) = ${num(a * tv)}$, and $${num(a * tv)} ${relSymbol(op)} ${num(a * v)}$ is true.`,
                `检验 $x = ${num(tv)}$：$${a}(${num(tv)}) = ${num(a * tv)}$，$${num(a * tv)} ${relSymbol(op)} ${num(a * v)}$ 成立。`,
              ],
              [
                [flip[op], v, ...keeps(`Dividing by $${a}$, a positive number,`, `除以正数 $${a}$ `)],
                ...(v === 0
                  ? []
                  : [[op, a * a * v, `That multiplies by $${a}$ instead of dividing.`, `这是乘以 $${a}$，而不是除以 $${a}$。`] as const]),
              ],
            );
          },
          numberLineFigure([ray(">=", -3)], -6, 2),
        ),
        keyPrerequisites: ["one-step-equations-multiplication"],
      },
      lesson(
        "negative-coefficient",
        ["Dividing by a negative number", "除以负数"],
        [
          [
            "Multiplying or dividing both sides by a **negative** number **reverses** the symbol: $2 < 5$, but $-2 > -5$. So $-3x < 12$ becomes $x > -4$ when you divide by $-3$.",
            "两边同时乘以或除以一个**负数**，不等号要**改变方向**：$2 < 5$，但 $-2 > -5$。所以 $-3x < 12$ 两边除以 $-3$ 后变成 $x > -4$。",
          ],
          [
            "Test $x = 0$, which satisfies $x > -4$: $-3(0) = 0$, and $0 < 12$ is true.",
            "检验满足 $x > -4$ 的 $x = 0$：$-3(0) = 0$，$0 < 12$ 成立。",
          ],
          [
            "Reverse the symbol at the moment you divide by the negative number, and only then.",
            "在除以负数的那一步改变方向，而且只在那一步。",
          ],
        ],
        (rng) => {
          const a = rng.bool(0.15) ? -1 : -rng.int(2, 9);
          const v = rng.int(-10, 10);
          const op = rng.pick(ops);
          const answerOp = flip[op];
          const tv = inside(answerOp, v);
          return bounded(
            [`Solve $${poly([a, "x"])} ${relSymbol(op)} ${num(a * v)}$.`, `解不等式 $${poly([a, "x"])} ${relSymbol(op)} ${num(a * v)}$。`],
            "x",
            answerOp,
            v,
            [
              [
                ["Divide", "相除"],
                [`Divide both sides by $${num(a)}$:`, `两边同时除以 $${num(a)}$：`],
                [`\\frac{${num(a * v)}}{${num(a)}} = ${num(v)}`],
              ],
              [
                ["Reverse the symbol", "改变方向"],
                [
                  `$${num(a)}$ is negative, so $${relSymbol(op)}$ becomes $${relSymbol(answerOp)}$:`,
                  `$${num(a)}$ 是负数，所以 $${relSymbol(op)}$ 变成 $${relSymbol(answerOp)}$：`,
                ],
                [inequalityLatex("x", answerOp, v)],
              ],
            ],
            [
              `Test $x = ${num(tv)}$: $${times(a, tv)} = ${num(a * tv)}$, and $${num(a * tv)} ${relSymbol(op)} ${num(a * v)}$ is true.`,
              `检验 $x = ${num(tv)}$：$${times(a, tv)} = ${num(a * tv)}$，$${num(a * tv)} ${relSymbol(op)} ${num(a * v)}$ 成立。`,
            ],
            [
              [op, v, ...reversed(a)],
              ...(v === 0
                ? []
                : ([
                    [answerOp, -v, "That reverses the symbol but gets the sign of the number wrong.", "这改变了方向，但数的符号错了。"],
                    [op, -v, "That keeps the symbol and gets the sign of the number wrong.", "这既没有改变方向，数的符号也错了。"],
                  ] as const)),
            ],
          );
        },
        numberLineFigure([ray(">", -4)], -8, 0),
      ),
    ],
  },
  [
    "A lift can carry at most $600$ kg, and a cart already weighs $150$ kg. The load $x$ must satisfy $x + 150 \\le 600$. Take $150$ from both sides: $x \\le 450$, so any load up to $450$ kg is safe.",
    "一部升降机最多能载 $600$ 千克，推车本身重 $150$ 千克。货物重量 $x$ 要满足 $x + 150 \\le 600$。两边同时减去 $150$：$x \\le 450$，所以不超过 $450$ 千克的货物都安全。",
  ],
  ["$450 + 150 = 600$, exactly the limit, and $400 + 150 = 550 \\le 600$.", "$450 + 150 = 600$，正好是上限；$400 + 150 = 550 \\le 600$。"],
  ["solve inequalities in one step, and learn when the symbol has to be reversed.", "学习一步解不等式，并知道什么时候不等号要改变方向。"],
);

/** solvingMultiStepInequalities solves two-step inequalities and inequalities with the variable on both sides. */
export const solvingMultiStepInequalities: TopicDef = withIntro(
  {
    id: "solving-multi-step-inequalities",
    title: t("Solving Two-Step Inequalities", "解两步不等式"),
    summary: t("Solve linear inequalities with several steps and variables on both sides.", "解需要多步、两边都有变量的一元一次不等式。"),
    prerequisites: ["solving-one-step-inequalities", "equations-with-variables-on-both-sides"],
    encompasses: [{ topic: "solving-one-step-inequalities", weight: 1 }],
    xp: 15,
    standards: ["CCSS.7.EE.B.4.B"],
    knowledgePoints: [
      {
        ...lesson(
          "two-step-inequalities",
          ["Two-step inequalities", "两步不等式"],
          [
            [
              "Solve as for a two-step equation, and reverse the symbol only at the moment you divide by a negative number. $7 - 2x \\ge 13$: subtract $7$, $-2x \\ge 6$; divide by $-2$ and reverse, $x \\le -3$.",
              "按两步方程的方法求解，只在除以负数的那一步改变不等号方向。$7 - 2x \\ge 13$：减去 $7$，得 $-2x \\ge 6$；除以 $-2$ 并改变方向，得 $x \\le -3$。",
            ],
            ["Test $x = -4$: $7 - 2(-4) = 15$, and $15 \\ge 13$ is true.", "检验 $x = -4$：$7 - 2(-4) = 15$，$15 \\ge 13$ 成立。"],
            ["Subtracting $7$ does not reverse anything; only the division by $-2$ does.", "减去 $7$ 不改变方向；只有除以 $-2$ 才改变。"],
          ],
          (rng) => {
            const a = rng.sign() * rng.int(2, 9);
            const b = rng.nonZero(-20, 20);
            const v = rng.int(-10, 10);
            const c = a * v + b;
            const op = rng.pick(ops);
            const answerOp = a < 0 ? flip[op] : op;
            const lhs = rng.bool() || a > 0 ? linear(a, b) : poly([b, ""], [a, "x"]);
            const tv = inside(answerOp, v);
            return bounded(
              [`Solve $${lhs} ${relSymbol(op)} ${num(c)}$.`, `解不等式 $${lhs} ${relSymbol(op)} ${num(c)}$。`],
              "x",
              answerOp,
              v,
              [
                [
                  ["Undo the constant", "移走常数"],
                  b > 0
                    ? [`Subtract $${b}$ from both sides:`, `两边同时减去 $${b}$：`]
                    : [`Add $${-b}$ to both sides:`, `两边同时加上 $${-b}$：`],
                  [`${poly([a, "x"])} ${relSymbol(op)} ${num(c - b)}`],
                ],
                [
                  ["Divide", "相除"],
                  a < 0
                    ? [`Divide by $${num(a)}$, a negative number, so the symbol reverses:`, `除以负数 $${num(a)}$，不等号改变方向：`]
                    : [`Divide by $${a}$, a positive number, so the symbol stays:`, `除以正数 $${a}$，不等号方向不变：`],
                  [inequalityLatex("x", answerOp, v)],
                ],
              ],
              [
                `Test $x = ${num(tv)}$: $${times(a, tv)} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${num(a * tv + b)}$, and $${num(a * tv + b)} ${relSymbol(op)} ${num(c)}$ is true.`,
                `检验 $x = ${num(tv)}$：$${times(a, tv)} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${num(a * tv + b)}$，$${num(a * tv + b)} ${relSymbol(op)} ${num(c)}$ 成立。`,
              ],
              [
                a < 0 ? [op, v, ...reversed(a)] : [flip[op], v, ...keeps(`Dividing by $${a}$, a positive number,`, `除以正数 $${a}$ `)],
                [
                  answerOp,
                  Q.of(c + b, a),
                  b > 0 ? `That adds $${b}$ instead of subtracting it.` : `That subtracts $${-b}$ instead of adding it.`,
                  b > 0 ? `这是加上了 $${b}$，而不是减去。` : `这是减去了 $${-b}$，而不是加上。`,
                ],
                ...(v === 0 ? [] : [[answerOp, -v, "That gets the sign of the number wrong.", "数的符号错了。"] as const]),
              ],
            );
          },
          numberLineFigure([ray("<=", -3)], -6, 2),
        ),
        keyPrerequisites: ["solving-one-step-inequalities", "two-step-equations"],
      },
      lesson(
        "variables-on-both-sides",
        ["Variables on both sides", "两边都有变量"],
        [
          [
            "Collect $x$ on one side first. If its coefficient ends up negative, dividing by it reverses the symbol. $2x + 5 > 5x - 4$: take $5x$ and $5$ from both sides, $-3x > -9$; divide by $-3$ and reverse, $x < 3$.",
            "先把 $x$ 移到一边。如果最后的系数是负数，除以它时要改变不等号方向。$2x + 5 > 5x - 4$：两边同时减去 $5x$ 和 $5$，得 $-3x > -9$；除以 $-3$ 并改变方向，得 $x < 3$。",
          ],
          [
            "Test $x = 2$: $2(2) + 5 = 9$ and $5(2) - 4 = 6$, and $9 > 6$ is true.",
            "检验 $x = 2$：$2(2) + 5 = 9$，$5(2) - 4 = 6$，$9 > 6$ 成立。",
          ],
          [
            "Watch the sign of the coefficient you divide by, not the sign of the number on the right: $-3x > -9$ reverses because of $-3$.",
            "要看除数（$x$ 的系数）的符号，不是右边那个数的符号：$-3x > -9$ 要变号，是因为 $-3$。",
          ],
        ],
        (rng) => {
          const a = rng.nonZero(-9, 9);
          let c = rng.nonZero(-9, 9);
          while (c === a) c = rng.nonZero(-9, 9);
          const k = a - c;
          const v = rng.int(-8, 8);
          const b = rng.nonZero(-15, 15);
          const d = k * v + b;
          const op = rng.pick(ops);
          const answerOp = k < 0 ? flip[op] : op;
          const tv = inside(answerOp, v);
          return bounded(
            [`Solve $${linear(a, b)} ${relSymbol(op)} ${linear(c, d)}$.`, `解不等式 $${linear(a, b)} ${relSymbol(op)} ${linear(c, d)}$。`],
            "x",
            answerOp,
            v,
            [
              [
                ["Collect the terms", "移项"],
                [`Take $${poly([c, "x"])}$ and $${num(b)}$ from both sides:`, `两边同时减去 $${poly([c, "x"])}$ 和 $${num(b)}$：`],
                [`${poly([k, "x"])} ${relSymbol(op)} ${num(d - b)}`],
              ],
              [
                ["Divide", "相除"],
                k < 0
                  ? [`Divide by $${num(k)}$, a negative number, so the symbol reverses:`, `除以负数 $${num(k)}$，不等号改变方向：`]
                  : [`Divide by $${num(k)}$, a positive number, so the symbol stays:`, `除以正数 $${num(k)}$，不等号方向不变：`],
                [inequalityLatex("x", answerOp, v)],
              ],
            ],
            [
              `Test $x = ${num(tv)}$: the left side is $${num(a * tv + b)}$ and the right side is $${num(c * tv + d)}$, and $${num(a * tv + b)} ${relSymbol(op)} ${num(c * tv + d)}$ is true.`,
              `检验 $x = ${num(tv)}$：左边是 $${num(a * tv + b)}$，右边是 $${num(c * tv + d)}$，$${num(a * tv + b)} ${relSymbol(op)} ${num(c * tv + d)}$ 成立。`,
            ],
            [
              k < 0
                ? [op, v, ...reversed(k)]
                : [flip[op], v, ...keeps(`Dividing by $${num(k)}$, a positive number,`, `除以正数 $${num(k)}$ `)],
              ...(v === 0 ? [] : [[answerOp, -v, "That gets the sign of the number wrong.", "数的符号错了。"] as const]),
              ...(a + c !== 0 && !Q.of(d - b, a + c).eq(Q.of(v))
                ? [
                    [
                      answerOp,
                      Q.of(d - b, a + c),
                      `That adds $${poly([c, "x"])}$ to the left instead of taking it away.`,
                      `这是把 $${poly([c, "x"])}$ 加到左边，而不是减去。`,
                    ] as const,
                  ]
                : []),
            ],
          );
        },
        numberLineFigure([ray("<", 3)], -2, 6),
      ),
    ],
  },
  [
    "A taxi charges $\\$3$ plus $\\$2$ a mile, and Leo has $\\$15$. The miles $m$ must satisfy $2m + 3 \\le 15$. Take $3$ away: $2m \\le 12$, then halve: $m \\le 6$.",
    "出租车起步价 $3$ 元，每英里 $2$ 元，小李有 $15$ 元。英里数 $m$ 要满足 $2m + 3 \\le 15$。减去 $3$：$2m \\le 12$，再除以 $2$：$m \\le 6$。",
  ],
  [
    "Six miles cost $2(6) + 3 = 15$, exactly his money; seven would cost $17$.",
    "$6$ 英里要 $2(6) + 3 = 15$ 元，正好够；$7$ 英里要 $17$ 元。",
  ],
  [
    "solve inequalities that take two or more steps, including ones with $x$ on both sides.",
    "学习解需要两步或更多步的不等式，包括两边都有 $x$ 的不等式。",
  ],
);

/** inequalityTopics are the topics of the inequalities unit, in teaching order. */
export const inequalityTopics: readonly TopicDef[] = [inequalitiesAndSolutions, solvingOneStepInequalities, solvingMultiStepInequalities];
