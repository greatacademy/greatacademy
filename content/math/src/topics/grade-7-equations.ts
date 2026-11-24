import type { Figure, KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import {
  dec,
  type Interval,
  inequalityLatexOf,
  linear,
  num,
  paren,
  plane,
  poly,
  Q,
  type RealSet,
  relSymbol,
  union,
} from "@ga/subject-math";
import { gradeDrawings3 } from "../explanation-drawings-grades-3.ts";

import {
  choiceProblem,
  type InequalityOp,
  inequalityLatex,
  intervalProblem,
  numberProblem,
  steps,
  withMistakes,
  yesNo,
} from "../problems.ts";
import { numberLineFigure, ray } from "./compound-inequalities.ts";
import { type Pair, tableFigure, type Walk, walkThrough } from "./early-grades-more-kit.ts";
import { mathText, pickChoice } from "./grade-4-fractions.ts";
import { bounded, chosen, chosenMath, decided, drawn, expressed, lesson, valued, withIntro } from "./grade-6-kit.ts";
import { stripsFigure, tapeFigure } from "./upper-grades-kit.ts";

// 7th Grade Math: linear equations by trial and error and with fractions, decimals and rational expressions,
// two-variable linear equations and their graphs, and linear inequalities.

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

/** frac is the exact quotient a / b, for the values that mistakes produce. */
const frac = (a: number, b: number) => Q.of(a, b);

/** side writes a coefficient times x: side(-1) is "-x". */
const side = (a: number) => poly([a, "x"]);

/** gcd is the greatest common divisor of two integers. */
const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

/** lcm is the least common multiple of two positive integers. */
const lcm = (a: number, b: number) => (a / gcd(a, b)) * b;

/** moveConstant says how to remove the constant b from the side of the variable. */
const moveConstant = (b: number | Q): Text => {
  const v = b instanceof Q ? b : Q.of(b);
  const shown = (q: Q) => (q.isInteger() ? num(q) : dec(q));
  return v.sign() > 0
    ? t(`Subtract $${shown(v)}$ from both sides`, `两边同时减去 $${shown(v)}$`)
    : t(`Add $${shown(v.neg())}$ to both sides`, `两边同时加上 $${shown(v.neg())}$`);
};

/** isolated writes the last steps of solving k·v = rhs: the equation, then the value, which is left out when k = 1. */
const isolated = (k: number, rhs: string, value: string, v = "x") => [`${poly([k, v])} = ${rhs}`, ...(k === 1 ? [] : [`${v} = ${value}`])];

/** times writes a coefficient times a substituted value: times(3, -2) is "3(-2)", times(-1, 4) is "-4", times(1, -4) is "(-4)". */
const times = (a: number, v: number) => {
  const shown = v < 0 ? `(${num(v)})` : num(v);
  return a === 1 ? shown : a === -1 ? `-${shown}` : `${num(a)}(${num(v)})`;
};

/** plusTimes continues a sum with k times a substituted value: plusTimes(-4, 5) is "- 4(5)". */
const plusTimes = (k: number, v: number) => `${k < 0 ? "-" : "+"} ${times(Math.abs(k), v)}`;

/** solveText is the prompt "Solve …". */
const _solveText = (eq: string): Text => t(`Solve $${eq}$.`, `解方程 $${eq}$。`);

const ops: readonly InequalityOp[] = ["<", "<=", ">", ">="];
const flip: Record<InequalityOp, InequalityOp> = { "<": ">", ">": "<", "<=": ">=", ">=": "<=" };
const strictness: Record<InequalityOp, InequalityOp> = { "<": "<=", "<=": "<", ">": ">=", ">=": ">" };
const holds = (l: Q, op: InequalityOp, r: Q) => {
  const c = l.cmp(r);
  return { "<": c < 0, "<=": c <= 0, ">": c > 0, ">=": c >= 0 }[op];
};

/** solveInequality is the prompt "Solve …" for an inequality. */
const _solveInequality = (ineq: string): Text => t(`Solve $${ineq}$.`, `解不等式 $${ineq}$。`);

/** people are names in word problems. */
const people = ["Mia", "Leo", "Ava", "Noah", "Zoe", "Sam"] as const;

// ---------------------------------------------------------------------------
// Trial and error

/** solvingLinearEquationsByTrialAndError finds solutions by guessing, checking and improving the guess. */
export const solvingLinearEquationsByTrialAndError = withIntro(
  topic(
    "solving-linear-equations-by-trial-and-error",
    t("Solving Linear Equations by Trial and Error", "用试值法解一次方程"),
    t(
      "To solve an equation by trial and error, guess a value, substitute it, and compare the two sides. If they are not equal, use the result to make a better guess. For $4x + 3 = 31$, trying $x = 5$ gives $23$, which is too small; since $4x + 3$ grows as $x$ grows, try a larger value: $x = 7$ gives $31$, so $x = 7$.",
      "用试值法解方程时，先猜一个值，代入后比较两边。如果不相等，就根据结果做出更好的猜测。对于 $4x + 3 = 31$，试 $x = 5$ 得 $23$，太小了；因为 $x$ 变大时 $4x + 3$ 也变大，所以试一个更大的值：$x = 7$ 得 $31$，所以 $x = 7$。",
    ),
    ["identifying-solutions-to-linear-equations", "evaluating-expressions"],
    ["6.EE.B.5", "7.EE.B.4.A"],
    [
      {
        ...lesson(
          "improving-a-guess",
          ["Improving a guess", "改进猜测"],
          [
            [
              "After a guess, ask two questions: is the left side too small or too large, and does it grow or shrink when $x$ grows? In $-3x + 20 = 2$, the guess $x = 4$ gives $8$, which is too large. Because of the $-3$, the left side shrinks as $x$ grows, so the next guess should be greater than $4$.",
              "猜测之后要问两个问题：左边是太小还是太大？$x$ 变大时，左边变大还是变小？在 $-3x + 20 = 2$ 中，猜 $x = 4$ 得 $8$，太大了。由于系数是 $-3$，$x$ 变大时左边变小，所以下一个猜测应该大于 $4$。",
            ],
            [
              "Try $x = 6$: $-3 \\times 6 + 20 = 2$, the right side, so the larger guess was the right move.",
              "试 $x = 6$：$-3 \\times 6 + 20 = 2$，正是右边，所以往大猜是对的。",
            ],
            [
              "Look at the sign of the coefficient: with $-3x$, a larger $x$ makes the left side smaller, not larger.",
              "要看系数的符号：对于 $-3x$，$x$ 越大，左边越小，而不是越大。",
            ],
          ],
          (rng) => {
            const name = rng.pick(people);
            const a = rng.sign() * rng.int(2, 9);
            const b = rng.nonZero(-20, 20);
            const s = rng.int(-6, 12);
            const c = a * s + b;
            const g = rng.bool(0.2) ? s : s + rng.nonZero(-4, 4);
            const value = a * g + b;
            const eq = `${linear(a, b)} = ${num(c)}`;
            const sub = `${substitutedLinear(a, g, b)} = ${num(value)}`;
            const greater: Pair = [`Greater than $${g}$`, `大于 $${g}$`];
            const less: Pair = [`Less than $${g}$`, `小于 $${g}$`];
            const itIs: Pair = [`$x = ${g}$ is the solution`, `$x = ${g}$ 就是解`];
            const grows = a > 0;
            const trend: Pair = grows ? ["grows", "变大"] : ["shrinks", "变小"];
            const size: Pair = value < c ? ["too small", "太小"] : ["too large", "太大"];
            const solved = `x = ${num(c - b)} \\div ${paren(a)} = ${s}`;
            const check: Pair = [
              `Solve with inverse operations: $${poly([a, "x"])} = ${num(c - b)}$, so $${solved}$${g === s ? "" : `, which is ${g < s ? "greater" : "less"} than $${g}$`}.`,
              `用逆运算求解：$${poly([a, "x"])} = ${num(c - b)}$，所以 $${solved}$${g === s ? "" : `，确实${g < s ? "大于" : "小于"} $${g}$`}。`,
            ];
            const equalWhy: [string, string] = [
              `$x = ${g}$ already gives $${num(c)}$, the right side, so no new guess is needed.`,
              `$x = ${g}$ 已经得到右边的 $${num(c)}$，不需要再猜了。`,
            ];
            const wrongWay: [string, string] = [
              `That moves the wrong way: the left side is ${size[0]}, and it ${trend[0]} as $x$ grows.`,
              `方向反了：左边${size[1]}，而 $x$ 变大时左边${trend[1]}。`,
            ];
            const notYet: [string, string] = [
              `$x = ${g}$ gives $${num(value)}$, not $${num(c)}$.`,
              `$x = ${g}$ 得 $${num(value)}$，不是 $${num(c)}$。`,
            ];
            const correct = g === s ? itIs : g < s ? greater : less;
            const others: [Pair, string, string][] =
              g === s
                ? [
                    [greater, ...equalWhy],
                    [less, ...equalWhy],
                  ]
                : [
                    [g < s ? less : greater, ...wrongWay],
                    [itIs, ...notYet],
                  ];
            return chosen(
              rng,
              [
                `${name} solves $${eq}$ by trial and error. The first guess is $x = ${g}$. What should the next guess be?`,
                `${name} 用试值法解 $${eq}$，第一次猜 $x = ${g}$。下一次应该怎样猜？`,
              ],
              correct,
              others,
              [
                [
                  ["Substitute the guess", "代入猜测的值"],
                  [`Put $x = ${g}$ into the left side and compare with $${num(c)}$:`, `把 $x = ${g}$ 代入左边，与 $${num(c)}$ 比较：`],
                  [sub],
                ],
                g === s
                  ? [
                      ["Compare", "比较"],
                      ["The two sides are equal, so the guess is the solution.", "两边相等，所以这个猜测就是解。"],
                    ]
                  : [
                      ["Choose the direction", "确定方向"],
                      [
                        `The left side is ${size[0]}, and $${linear(a, b)}$ ${trend[0]} as $x$ grows, so the next guess should be ${g < s ? "greater" : "less"} than $${g}$.`,
                        `左边${size[1]}，而 $x$ 变大时 $${linear(a, b)}$ ${trend[1]}，所以下一个猜测应该${g < s ? "大于" : "小于"} $${g}$。`,
                      ],
                    ],
              ],
              check,
            );
          },
          tableFigure(["x = 4", "x = 5", "x = 6"], [8, 5, 2]),
        ),
        keyPrerequisites: ["evaluating-expressions"],
      },
      lesson(
        "finding-a-whole-number-solution",
        ["Finding a whole-number solution", "找出整数解"],
        [
          [
            "Try whole numbers one after another and keep track of both sides. For $5x - 4 = 2x + 11$: at $x = 3$ the sides are $11$ and $17$, at $x = 4$ they are $16$ and $19$, and at $x = 5$ both are $21$. The gap shrinks by $3$ each time, until the sides are equal.",
            "依次试整数，并记下两边的值。对于 $5x - 4 = 2x + 11$：$x = 3$ 时两边是 $11$ 和 $17$，$x = 4$ 时是 $16$ 和 $19$，$x = 5$ 时都是 $21$。每试一次，两边的差减少 $3$，直到两边相等。",
          ],
          ["Solve with inverse operations: $3x = 15$, so $x = 5$, the same value.", "用逆运算求解：$3x = 15$，所以 $x = 5$，结果相同。"],
          [
            "Stop only when both sides are equal; a value that makes one side close to the other is not yet the solution.",
            "只有两边相等时才停下来；两边只是接近，还不是解。",
          ],
        ],
        (rng) => {
          const s = rng.int(1, 12);
          const rows = [s - 1, s, s + 1].filter((x) => x >= 0);
          if (rng.bool(0.5)) {
            const a = rng.int(2, 9);
            let c = rng.int(1, 8);
            while (c === a) c = rng.int(1, 8);
            const b = rng.nonZero(-15, 15);
            const d = (a - c) * s + b;
            const left = (x: number) => a * x + b;
            const right = (x: number) => c * x + d;
            const eq = `${linear(a, b)} = ${linear(c, d)}`;
            const row = (x: number) => `x = ${x}:\\ ${num(left(x))} ${x === s ? "=" : "\\ne"} ${num(right(x))}`;
            return valued(
              [`Use trial and error to find the whole number $x$ that solves $${eq}$.`, `用试值法求满足 $${eq}$ 的整数 $x$。`],
              s,
              [
                [["Try whole numbers", "试整数"], ["Put whole numbers into both sides:", "把整数代入两边："], rows.map(row)],
                [
                  ["Find where they are equal", "找出相等的地方"],
                  [`The two sides are equal at $x = ${s}$:`, `两边在 $x = ${s}$ 时相等：`],
                  [`x = ${s}`],
                ],
              ],
              [
                `Solve with inverse operations: $${poly([a - c, "x"])} = ${num(d - b)}$, so $x = ${s}$.`,
                `用逆运算求解：$${poly([a - c, "x"])} = ${num(d - b)}$，所以 $x = ${s}$。`,
              ],
              [
                [
                  frac(d - b, a + c),
                  `That adds the $x$-terms; subtract $${poly([c, "x"])}$ from both sides instead.`,
                  `这是把含 $x$ 的项相加了；应该两边同时减去 $${poly([c, "x"])}$。`,
                ],
                [
                  frac(d + b, a - c),
                  `That adds $${num(b)}$ to the right side; move it with the opposite sign.`,
                  `这是把 $${num(b)}$ 加到了右边；移项时要变号。`,
                ],
                [
                  -s,
                  `The sign is wrong: at $x = ${-s}$ the sides are $${num(left(-s))}$ and $${num(right(-s))}$.`,
                  `符号错了：$x = ${-s}$ 时两边是 $${num(left(-s))}$ 和 $${num(right(-s))}$。`,
                ],
              ],
              { solveFor: "x" },
            );
          }
          const a = rng.int(2, 6);
          const b = rng.nonZero(-6, 6);
          const k = rng.nonZero(-12, 12);
          const d = a * (s + b) + k;
          const left = (x: number) => a * (x + b) + k;
          const eq = `${a}(${linear(1, b)}) ${k < 0 ? "-" : "+"} ${Math.abs(k)} = ${num(d)}`;
          const row = (x: number) => `x = ${x}:\\ ${num(left(x))}`;
          return valued(
            [`Use trial and error to find the whole number $x$ that solves $${eq}$.`, `用试值法求满足 $${eq}$ 的整数 $x$。`],
            s,
            [
              [["Try whole numbers", "试整数"], ["Put whole numbers into the left side:", "把整数代入左边："], rows.map(row)],
              [
                ["Find the match", "找出相符的值"],
                [`The left side equals $${num(d)}$ at $x = ${s}$:`, `左边在 $x = ${s}$ 时等于 $${num(d)}$：`],
                [`x = ${s}`],
              ],
            ],
            [
              `Solve with inverse operations: $${a}(${linear(1, b)}) = ${num(d - k)}$, so $${linear(1, b)} = ${num((d - k) / a)}$ and $x = ${s}$.`,
              `用逆运算求解：$${a}(${linear(1, b)}) = ${num(d - k)}$，所以 $${linear(1, b)} = ${num((d - k) / a)}$，$x = ${s}$。`,
            ],
            [
              [
                frac(d - k - b, a),
                `That takes away $${num(b)}$ before dividing by $${a}$; divide first, then undo the $${num(b)}$.`,
                `这是先处理了 $${num(b)}$ 再除以 $${a}$；应该先除，再处理 $${num(b)}$。`,
              ],
              [frac(d - k, a).add(Q.of(b)), `That moves $${num(b)}$ without changing its sign.`, `这是移动 $${num(b)}$ 时没有变号。`],
              [frac(d + k, a).sub(Q.of(b)), `That moves $${num(k)}$ without changing its sign.`, `这是移动 $${num(k)}$ 时没有变号。`],
            ],
            { solveFor: "x" },
          );
        },
        tableFigure(["x", "5x - 4", "2x + 11"], [5, 21, 21]),
      ),
    ],
  ),
  ["Which whole number makes $2x + 1 = 7$ true: $2$ or $3$?", "哪个整数使 $2x + 1 = 7$ 成立：$2$ 还是 $3$？"],
  ["$3$: $2 \\times 3 + 1 = 7$, while $2 \\times 2 + 1 = 5$ is too small.", "$3$：$2 \\times 3 + 1 = 7$，而 $2 \\times 2 + 1 = 5$ 太小。"],
  ["solve equations by guessing a value, checking it and making a better guess.", "通过猜值、检验、再改进猜测来解方程。"],
);

// ---------------------------------------------------------------------------
// Fractional and decimal coefficients

/** fractionTerm writes (p/q)x with its sign: "\frac{2}{3}x", "-\frac{2}{3}x". */
const fractionTerm = (f: Q, v = "x") => `${f.sign() < 0 ? "-" : ""}${f.abs().toLatex()}${v}`;

/** solvingLinearEquationsWithFractionalCoefficients undoes a fractional coefficient with its reciprocal or the common denominator. */
export const solvingLinearEquationsWithFractionalCoefficients = withIntro(
  topic(
    "solving-linear-equations-with-fractional-coefficients",
    t("Solving Linear Equations With Fractional Coefficients", "解分数系数的一次方程"),
    t(
      "When the coefficient of $x$ is a fraction, undo it by multiplying both sides by its reciprocal: $\\frac{2}{3}x - 4 = 6$ gives $\\frac{2}{3}x = 10$, so $x = \\frac{3}{2} \\cdot 10 = 15$. When several terms have fractions, multiply both sides by the least common denominator to clear them: $\\frac{x}{2} + \\frac{x}{3} = 10$ becomes $3x + 2x = 60$, so $x = 12$.",
      "当 $x$ 的系数是分数时，两边同时乘以它的倒数来消去它：由 $\\frac{2}{3}x - 4 = 6$ 得 $\\frac{2}{3}x = 10$，所以 $x = \\frac{3}{2} \\cdot 10 = 15$。当几项都含分数时，两边同时乘以最小公分母去掉分母：$\\frac{x}{2} + \\frac{x}{3} = 10$ 变为 $3x + 2x = 60$，所以 $x = 12$。",
    ),
    ["two-step-equations", "one-step-multiplication-equations-containing-fractions", "least-common-multiple"],
    ["7.EE.B.4.A"],
    [
      {
        ...lesson(
          "multiplying-by-the-reciprocal",
          ["Multiplying by the reciprocal", "乘以倒数"],
          [
            [
              "First undo the addition or subtraction, then multiply both sides by the reciprocal of the coefficient. For $-\\frac{3}{4}x + 5 = 11$: subtract $5$ to get $-\\frac{3}{4}x = 6$, then $x = -\\frac{4}{3} \\cdot 6 = -8$.",
              "先抵消加减，再两边同时乘以系数的倒数。对于 $-\\frac{3}{4}x + 5 = 11$：减去 $5$ 得 $-\\frac{3}{4}x = 6$，所以 $x = -\\frac{4}{3} \\cdot 6 = -8$。",
            ],
            [
              "Put $x = -8$ back: $-\\frac{3}{4} \\cdot (-8) + 5 = 6 + 5 = 11$.",
              "把 $x = -8$ 代回去：$-\\frac{3}{4} \\cdot (-8) + 5 = 6 + 5 = 11$。",
            ],
            [
              "The reciprocal of a negative fraction is negative: the reciprocal of $-\\frac{3}{4}$ is $-\\frac{4}{3}$.",
              "负分数的倒数也是负数：$-\\frac{3}{4}$ 的倒数是 $-\\frac{4}{3}$。",
            ],
          ],
          (rng) => {
            const q = rng.int(2, 6);
            let p = rng.int(1, 7);
            while (p % q === 0 || gcd(p, q) !== 1) p = rng.int(1, 7);
            const f = Q.of(rng.bool(0.3) ? -p : p, q);
            const m = rng.nonZero(-6, 6);
            const x = q * m;
            const b = rng.nonZero(-15, 15);
            const fx = Number(f.mul(Q.of(x)).n);
            const c = fx + b;
            const eq = `${fractionTerm(f)} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${num(c)}`;
            const r = Q.one.div(f);
            const move = moveConstant(b);
            return valued(
              [`Solve $${eq}$.`, `解方程 $${eq}$。`],
              x,
              [
                [["Undo the constant", "去掉常数项"], [`${move.en}:`, `${move["zh-CN"]}：`], [`${fractionTerm(f)} = ${num(c - b)}`]],
                [
                  ["Multiply by the reciprocal", "乘以倒数"],
                  [`Multiply both sides by $${num(r)}$:`, `两边同时乘以 $${num(r)}$：`],
                  [`x = ${num(r)} \\cdot ${paren(c - b)} = ${num(x)}`],
                ],
              ],
              [
                `Put $x = ${num(x)}$ back: $${num(f)} \\cdot ${paren(x)} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${num(fx)} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${num(c)}$.`,
                `把 $x = ${num(x)}$ 代回去：$${num(f)} \\cdot ${paren(x)} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${num(fx)} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${num(c)}$。`,
              ],
              [
                [
                  Q.of(c - b).mul(f),
                  `That multiplies by $${num(f)}$ itself; multiply by its reciprocal $${num(r)}$.`,
                  `这是乘了 $${num(f)}$ 本身；应该乘它的倒数 $${num(r)}$。`,
                ],
                [
                  r.mul(Q.of(c)).sub(Q.of(b)),
                  `That multiplies by the reciprocal before removing $${num(b)}$; undo the constant first.`,
                  `这是先乘倒数，再处理 $${num(b)}$；应该先去掉常数项。`,
                ],
                [r.mul(Q.of(c + b)), `That moves $${num(b)}$ without changing its sign.`, `这是移动 $${num(b)}$ 时没有变号。`],
              ],
              { solveFor: "x" },
            );
          },
          tapeFigure(
            [
              {
                pieces: [
                  { size: 1, text: "6", lit: true },
                  { size: 1, text: "6", lit: true },
                  { size: 1, text: "6", lit: true },
                  { size: 1, text: "6", dashed: true },
                ],
                total: "x = 24",
              },
            ],
            [
              "A tape for x cut into four equal parts of 6; three of them make 18.",
              "表示 x 的纸条平均分成四份，每份 6；其中三份合起来是 18。",
            ],
          ),
        ),
        keyPrerequisites: ["one-step-multiplication-equations-containing-fractions", "two-step-equations"],
      },
      {
        ...lesson(
          "clearing-denominators",
          ["Clearing the denominators", "去分母"],
          [
            [
              "If $x$ appears in two terms with different denominators, multiply every term on both sides by the least common denominator. For $\\frac{x}{4} - \\frac{x}{6} = 2$, multiply by $12$: $3x - 2x = 24$, so $x = 24$.",
              "如果 $x$ 出现在分母不同的两项中，就把两边的每一项都乘以最小公分母。对于 $\\frac{x}{4} - \\frac{x}{6} = 2$，乘以 $12$：$3x - 2x = 24$，所以 $x = 24$。",
            ],
            [
              "Put $x = 24$ back: $\\frac{24}{4} - \\frac{24}{6} = 6 - 4 = 2$.",
              "把 $x = 24$ 代回去：$\\frac{24}{4} - \\frac{24}{6} = 6 - 4 = 2$。",
            ],
            [
              "Multiply the right side too, and never add the denominators: $\\frac{x}{4} - \\frac{x}{6}$ is not $\\frac{x}{10}$.",
              "右边也要乘，分母也不能相加：$\\frac{x}{4} - \\frac{x}{6}$ 不是 $\\frac{x}{10}$。",
            ],
          ],
          (rng) => {
            let a = rng.int(2, 6);
            let b = rng.int(2, 8);
            while (a === b || lcm(a, b) > 24) [a, b] = [rng.int(2, 6), rng.int(2, 8)];
            const minus = rng.bool(0.4);
            if (minus && a > b) [a, b] = [b, a];
            const L = lcm(a, b);
            const k = L / a + (minus ? -L / b : L / b);
            const x = L * rng.nonZero(-4, 4);
            const c = Q.of(x, a).add(Q.of(minus ? -x : x, b));
            const op = minus ? "-" : "+";
            const eq = `\\frac{x}{${a}} ${op} \\frac{x}{${b}} = ${num(c)}`;
            const Lc = c.mul(Q.of(L));
            return valued(
              [`Solve $${eq}$.`, `解方程 $${eq}$。`],
              x,
              [
                [
                  ["Clear the denominators", "去分母"],
                  [`Multiply every term by the least common denominator $${L}$:`, `每一项都乘以最小公分母 $${L}$：`],
                  [`${poly([L / a, "x"], [minus ? -L / b : L / b, "x"])} = ${num(Lc)}`],
                ],
                [["Solve", "求解"], ["Combine the $x$-terms and divide:", "合并含 $x$ 的项，再相除："], isolated(k, num(Lc), num(x))],
              ],
              [
                `Put $x = ${num(x)}$ back: $${frac(x, a).toLatex()} ${op} ${x < 0 ? `(${frac(x, b).toLatex()})` : frac(x, b).toLatex()} = ${num(c)}$.`,
                `把 $x = ${num(x)}$ 代回去：$${frac(x, a).toLatex()} ${op} ${x < 0 ? `(${frac(x, b).toLatex()})` : frac(x, b).toLatex()} = ${num(c)}$。`,
              ],
              [
                [
                  c.mul(Q.of(minus ? b - a : a + b)),
                  `That puts the two denominators together; multiply every term by $${L}$ instead.`,
                  `这是把两个分母合在一起了；应该每一项都乘以 $${L}$。`,
                ],
                [c.div(Q.of(k)), `That forgets to multiply the right side by $${L}$.`, `这是忘了把右边也乘以 $${L}$。`],
                ...(minus
                  ? ([
                      [
                        Lc.div(Q.of(L / a + L / b)),
                        "That adds the two $x$-terms; one of them is subtracted.",
                        "这是把两个含 $x$ 的项相加了；其中一项是减去的。",
                      ],
                    ] as const)
                  : ([[c.mul(Q.of(a + b, 2)), "That adds the numerators and the denominators.", "这是把分子和分母分别相加了。"]] as const)),
              ],
              { solveFor: "x" },
            );
          },
          stripsFigure([
            { parts: 12, shaded: 3, text: "x/4" },
            { parts: 12, shaded: 2, text: "x/6" },
          ]),
        ),
        keyPrerequisites: ["least-common-multiple"],
      },
    ],
  ),
  ["What is $x$ if $\\frac{1}{2}x = 5$?", "如果 $\\frac{1}{2}x = 5$，$x$ 是多少？"],
  ["$10$: multiply both sides by $2$, and half of $10$ is $5$.", "$10$：两边同时乘以 $2$；$10$ 的一半正是 $5$。"],
  [
    "solve equations whose coefficients are fractions, with the reciprocal or the common denominator.",
    "用倒数或公分母解系数是分数的方程。",
  ],
);

/** decTerm writes a decimal coefficient times a variable, with its sign: "0.4x", "-1.25x". */
const decTerm = (a: Q, v = "x") => `${a.eq(Q.one) ? "" : a.eq(Q.one.neg()) ? "-" : dec(a)}${v}`;

/** decLinear writes a·x + b with decimal numbers. */
const decLinear = (a: Q, b: Q) => (b.isZero() ? decTerm(a) : `${decTerm(a)} ${b.sign() < 0 ? "-" : "+"} ${dec(b.abs())}`);

/** tenths draws a number of tenths between lo and hi that is not a whole number. */
function tenths(rng: Rng, lo: number, hi: number): Q {
  let n = rng.int(lo * 10, hi * 10);
  while (n % 10 === 0) n = rng.int(lo * 10, hi * 10);
  return Q.of(n, 10);
}

/** niceDecimals are coefficients with one or two decimal places. */
const niceDecimals = [0.05, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.6, 0.75, 0.8, 1.2, 1.25, 1.5, 1.75, 2.5].map((d) =>
  Q.of(Math.round(d * 100), 100),
);

/** decTimes writes a decimal coefficient times a value: "1.5(-2)". */
const decTimes = (a: Q, x: Q) => `${dec(a)}${x.sign() < 0 ? `(${dec(x)})` : ` \\cdot ${dec(x)}`}`;

/** solvingLinearEquationsWithDecimalCoefficients solves equations whose coefficients are decimals. */
export const solvingLinearEquationsWithDecimalCoefficients = withIntro(
  topic(
    "solving-linear-equations-with-decimal-coefficients",
    t("Solving Linear Equations With Decimal Coefficients", "解小数系数的一次方程"),
    t(
      "Equations with decimals are solved with the same steps as other linear equations: $0.4x + 1.2 = 3.6$ gives $0.4x = 2.4$, so $x = 2.4 \\div 0.4 = 6$. To avoid decimal arithmetic, multiply every term by $10$ or $100$ first: $4x + 12 = 36$ has the same solution.",
      "含小数的方程与其他一次方程的解法相同：由 $0.4x + 1.2 = 3.6$ 得 $0.4x = 2.4$，所以 $x = 2.4 \\div 0.4 = 6$。为了避免小数运算，可以先把每一项都乘以 $10$ 或 $100$：$4x + 12 = 36$ 的解相同。",
    ),
    ["two-step-equations", "decimal-arithmetic"],
    ["7.EE.B.4.A"],
    [
      {
        ...lesson(
          "tenths",
          ["Coefficients in tenths", "一位小数的系数"],
          [
            [
              "Undo the addition or subtraction, then divide by the coefficient. Or multiply every term by $10$ first: $1.5x - 0.7 = 3.8$ becomes $15x - 7 = 38$, so $15x = 45$ and $x = 3$.",
              "先抵消加减，再除以系数。也可以先把每一项都乘以 $10$：$1.5x - 0.7 = 3.8$ 变成 $15x - 7 = 38$，所以 $15x = 45$，$x = 3$。",
            ],
            ["Put $x = 3$ back: $1.5 \\cdot 3 - 0.7 = 4.5 - 0.7 = 3.8$.", "把 $x = 3$ 代回去：$1.5 \\cdot 3 - 0.7 = 4.5 - 0.7 = 3.8$。"],
            [
              "When you multiply by $10$, multiply every term: $1.5x - 0.7 = 3.8$ becomes $15x - 7 = 38$, not $15x - 0.7 = 38$.",
              "乘以 $10$ 时每一项都要乘：$1.5x - 0.7 = 3.8$ 变成 $15x - 7 = 38$，不是 $15x - 0.7 = 38$。",
            ],
          ],
          (rng) => {
            const a = tenths(rng, 0, 3).mul(Q.of(rng.bool(0.3) ? -1 : 1));
            const x = Q.of(rng.bool(0.25) ? rng.nonZero(-9, 9) * 2 + 1 : rng.nonZero(-10, 10) * 2, 2);
            const b = Q.of(rng.nonZero(-60, 60), 10);
            const c = a.mul(x).add(b);
            const divisor = a.sign() < 0 ? `(${dec(a)})` : dec(a);
            const eq = `${decLinear(a, b)} = ${dec(c)}`;
            const ten = Q.of(10);
            const move = moveConstant(b);
            const sign = b.sign() < 0 ? "-" : "+";
            return valued(
              [`Solve $${eq}$.`, `解方程 $${eq}$。`],
              x,
              [
                [["Undo the constant", "去掉常数项"], [`${move.en}:`, `${move["zh-CN"]}：`], [`${decTerm(a)} = ${dec(c.sub(b))}`]],
                [
                  ["Divide", "相除"],
                  [`Divide both sides by $${dec(a)}$:`, `两边同时除以 $${dec(a)}$：`],
                  [`x = ${dec(c.sub(b))} \\div ${divisor} = ${dec(x)}`],
                ],
              ],
              [
                `Put $x = ${dec(x)}$ back: $${decTimes(a, x)} ${sign} ${dec(b.abs())} = ${dec(a.mul(x))} ${sign} ${dec(b.abs())} = ${dec(c)}$.`,
                `把 $x = ${dec(x)}$ 代回去：$${decTimes(a, x)} ${sign} ${dec(b.abs())} = ${dec(a.mul(x))} ${sign} ${dec(b.abs())} = ${dec(c)}$。`,
              ],
              [
                [c.add(b).div(a), `That moves $${dec(b)}$ without changing its sign.`, `这是移动 $${dec(b)}$ 时没有变号。`],
                [
                  c.div(a).sub(b),
                  `That divides by $${dec(a)}$ before removing $${dec(b)}$; undo the constant first.`,
                  `这是先除以 $${dec(a)}$，再处理 $${dec(b)}$；应该先去掉常数项。`,
                ],
                [
                  c.mul(ten).sub(b).div(a.mul(ten)),
                  `That multiplies only some terms by $10$; multiply every term.`,
                  `这是只把部分项乘了 $10$；每一项都要乘。`,
                ],
              ],
              { solveFor: "x" },
            );
          },
          tableFigure(["1.5x - 0.7", "15x - 7", "x"], [3.8, 38, 3]),
        ),
        keyPrerequisites: ["decimal-arithmetic", "two-step-equations"],
      },
      lesson(
        "hundredths-on-both-sides",
        ["Hundredths and variables on both sides", "两位小数且两边都有变量"],
        [
          [
            "Multiplying both sides by the same number keeps the equation balanced, so the decimals can be cleared first. With hundredths, multiply every term on both sides by $100$: $0.25x + 1.5 = 0.1x + 3$ becomes $25x + 150 = 10x + 300$, so $15x = 150$ and $x = 10$.",
            "方程两边同时乘同一个数，方程仍然成立，所以可以先去掉小数。含两位小数时，把两边的每一项都乘以 $100$：$0.25x + 1.5 = 0.1x + 3$ 变成 $25x + 150 = 10x + 300$，所以 $15x = 150$，$x = 10$。",
          ],
          [
            "Put $x = 10$ back: the left side is $2.5 + 1.5 = 4$ and the right side is $1 + 3 = 4$.",
            "把 $x = 10$ 代回去：左边是 $2.5 + 1.5 = 4$，右边是 $1 + 3 = 4$。",
          ],
          [
            "Choose the power of ten for the most decimal places: with $0.25$, multiplying by $10$ still leaves $2.5$.",
            "要按最多的小数位数选 $10$ 的幂：有 $0.25$ 时乘以 $10$ 还剩 $2.5$。",
          ],
        ],
        (rng) => {
          const [a, c] = rng.sample(niceDecimals, 2) as [Q, Q];
          const x = rng.nonZero(-12, 12);
          const b = Q.of(rng.nonZero(-50, 50), 10);
          const d = a.sub(c).mul(Q.of(x)).add(b);
          const hundred = Q.of(100);
          const eq = `${decLinear(a, b)} = ${decLinear(c, d)}`;
          const [A, B, C, D] = [a, b, c, d].map((v) => v.mul(hundred)) as [Q, Q, Q, Q];
          const X = Q.of(x);
          return valued(
            [`Solve $${eq}$.`, `解方程 $${eq}$。`],
            x,
            [
              [
                ["Clear the decimals", "去掉小数"],
                ["Multiply every term by $100$:", "每一项都乘以 $100$："],
                [`${linear(A, B)} = ${linear(C, D)}`],
              ],
              [
                ["Collect and solve", "移项并求解"],
                [
                  "Collect the $x$-terms on the left and the numbers on the right, then divide:",
                  "把含 $x$ 的项移到左边，数移到右边，再相除：",
                ],
                [`${poly([A.sub(C), "x"])} = ${num(D.sub(B))}`, `x = ${x}`],
              ],
            ],
            [
              `Put $x = ${x}$ back: the left side is $${dec(a.mul(X).add(b))}$ and the right side is $${dec(c.mul(X).add(d))}$.`,
              `把 $x = ${x}$ 代回去：左边是 $${dec(a.mul(X).add(b))}$，右边是 $${dec(c.mul(X).add(d))}$。`,
            ],
            [
              [-x, "The sign is wrong: check which side each term moved to.", "符号错了：看看每一项移到了哪一边。"],
              [
                d.sub(b).div(a.add(c)),
                "That adds the $x$-terms; subtract the one on the right from both sides.",
                "这是把含 $x$ 的项相加了；应该两边同时减去右边的那一项。",
              ],
              [d.add(b).div(a.sub(c)), "That moves the constant on the left without changing its sign.", "这是移动左边的常数时没有变号。"],
            ],
            { solveFor: "x" },
          );
        },
        tableFigure(["0.25x + 1.5", "25x + 150"], [4, 400]),
      ),
    ],
  ),
  ["What is $x$ if $0.5x = 3$?", "如果 $0.5x = 3$，$x$ 是多少？"],
  [
    "$6$: half of $6$ is $3$; multiplying by $10$ gives $5x = 30$, so $x = 6$ again.",
    "$6$：$6$ 的一半是 $3$；乘以 $10$ 得 $5x = 30$，同样 $x = 6$。",
  ],
  ["solve equations whose coefficients are decimals, clearing the decimals when that is easier.", "解系数是小数的方程，需要时先去掉小数。"],
);

// ---------------------------------------------------------------------------
// Rational expressions and cross-multiplication

/** solvingLinearEquationsByClearingARationalExpression clears one denominator by multiplying both sides by it. */
export const solvingLinearEquationsByClearingARationalExpression = withIntro(
  topic(
    "solving-linear-equations-by-clearing-a-rational-expression",
    t("Solving Linear Equations by Clearing a Rational Expression", "去分母解一次方程"),
    t(
      "When one side is a fraction such as $\\frac{2x + 1}{3}$, multiply both sides by the denominator to clear it. The fraction bar groups the whole numerator, so $\\frac{2x + 1}{3} = 5$ becomes $2x + 1 = 15$, and $x = 7$. If the other side is an expression, multiply all of it: $\\frac{x + 9}{2} = x + 3$ becomes $x + 9 = 2(x + 3) = 2x + 6$, so $x = 3$.",
      "当一边是 $\\frac{2x + 1}{3}$ 这样的分数时，两边同时乘以分母把它去掉。分数线把整个分子看作一个整体，所以 $\\frac{2x + 1}{3} = 5$ 变为 $2x + 1 = 15$，$x = 7$。如果另一边是一个式子，要乘以整个式子：$\\frac{x + 9}{2} = x + 3$ 变为 $x + 9 = 2(x + 3) = 2x + 6$，所以 $x = 3$。",
    ),
    ["equations-with-parentheses"],
    ["7.EE.B.4.A", "8.EE.C.7.B"],
    [
      {
        ...lesson(
          "a-fraction-equal-to-a-number",
          ["A fraction equal to a number", "分数等于一个数"],
          [
            [
              "Multiply both sides by the denominator first, then solve the two-step equation that remains. For $\\frac{3x - 4}{5} = -2$: multiplying by $5$ gives $3x - 4 = -10$, so $3x = -6$ and $x = -2$.",
              "先两边同时乘以分母，再解剩下的两步方程。对于 $\\frac{3x - 4}{5} = -2$：乘以 $5$ 得 $3x - 4 = -10$，所以 $3x = -6$，$x = -2$。",
            ],
            [
              "Put $x = -2$ back: $\\frac{3(-2) - 4}{5} = \\frac{-10}{5} = -2$.",
              "把 $x = -2$ 代回去：$\\frac{3(-2) - 4}{5} = \\frac{-10}{5} = -2$。",
            ],
            ["Clear the denominator before moving the $4$: the $4$ is divided by $5$ too.", "要先去分母，再移动 $4$：$4$ 也被 $5$ 除了。"],
          ],
          (rng) => {
            for (;;) {
              const a = rng.sign() * rng.int(1, 6);
              const c = rng.int(2, 9);
              const x = rng.nonZero(-10, 10);
              const d = rng.nonZero(-9, 9);
              const b = c * d - a * x;
              if (b === 0 || Math.abs(b) > 40) continue;
              const left = `\\frac{${linear(a, b)}}{${c}}`;
              const eq = rng.bool(0.75) ? `${left} = ${num(d)}` : `${num(d)} = ${left}`;
              return valued(
                [`Solve $${eq}$.`, `解方程 $${eq}$。`],
                x,
                [
                  [
                    ["Clear the denominator", "去分母"],
                    [`Multiply both sides by $${c}$:`, `两边同时乘以 $${c}$：`],
                    [`${linear(a, b)} = ${num(c * d)}`],
                  ],
                  [
                    ["Solve", "求解"],
                    ["Undo the constant, then the coefficient:", "先去掉常数项，再除以系数："],
                    isolated(a, num(c * d - b), num(x)),
                  ],
                ],
                [
                  `Put $x = ${x}$ back: $\\frac{${substitutedLinear(a, x, b)}}{${c}} = \\frac{${num(c * d)}}{${c}} = ${num(d)}$.`,
                  `把 $x = ${x}$ 代回去：$\\frac{${substitutedLinear(a, x, b)}}{${c}} = \\frac{${num(c * d)}}{${c}} = ${num(d)}$。`,
                ],
                [
                  [
                    frac((d - b) * c, a),
                    `That moves $${num(b)}$ before clearing the denominator; it is divided by $${c}$ too.`,
                    `这是在去分母之前就移动了 $${num(b)}$；它也被 $${c}$ 除了。`,
                  ],
                  [
                    Q.of(d, c).sub(Q.of(b)).div(Q.of(a)),
                    `That divides by $${c}$; multiply both sides by it instead.`,
                    `这是除以了 $${c}$；应该两边同时乘以它。`,
                  ],
                  [frac(c * d + b, a), `That moves $${num(b)}$ without changing its sign.`, `这是移动 $${num(b)}$ 时没有变号。`],
                ],
                { solveFor: "x" },
              );
            }
          },
          tableFigure(["(3x - 4)/5", "3x - 4", "x"], [-2, -10, -2]),
        ),
        keyPrerequisites: ["two-step-equations"],
      },
      {
        ...lesson(
          "a-fraction-equal-to-an-expression",
          ["A fraction equal to an expression", "分数等于一个式子"],
          [
            [
              "When the other side has several terms, multiply all of it by the denominator, using parentheses. For $\\frac{5x + 2}{3} = x - 2$: $5x + 2 = 3(x - 2) = 3x - 6$, so $2x = -8$ and $x = -4$.",
              "当另一边有几项时，要用括号把它整个乘以分母。对于 $\\frac{5x + 2}{3} = x - 2$：$5x + 2 = 3(x - 2) = 3x - 6$，所以 $2x = -8$，$x = -4$。",
            ],
            [
              "Put $x = -4$ back: the left side is $\\frac{-18}{3} = -6$ and the right side is $-4 - 2 = -6$.",
              "把 $x = -4$ 代回去：左边是 $\\frac{-18}{3} = -6$，右边是 $-4 - 2 = -6$。",
            ],
            [
              "Multiply every term on the other side: $3(x - 2)$ is $3x - 6$, not $3x - 2$.",
              "另一边的每一项都要乘：$3(x - 2)$ 是 $3x - 6$，不是 $3x - 2$。",
            ],
          ],
          (rng) => {
            for (;;) {
              const c = rng.int(2, 6);
              const e = rng.nonZero(-3, 3);
              const a = rng.nonZero(-9, 9);
              if (a === c * e || a === e) continue;
              const f = rng.nonZero(-9, 9);
              const x = rng.nonZero(-8, 8);
              const b = c * (e * x + f) - a * x;
              if (b === 0 || Math.abs(b) > 40) continue;
              const eq = `\\frac{${linear(a, b)}}{${c}} = ${linear(e, f)}`;
              const value = e * x + f;
              return valued(
                [`Solve $${eq}$.`, `解方程 $${eq}$。`],
                x,
                [
                  [
                    ["Clear the denominator", "去分母"],
                    [`Multiply both sides by $${c}$, every term of the right side included:`, `两边同时乘以 $${c}$，右边的每一项都要乘：`],
                    [`${linear(a, b)} = ${c}(${linear(e, f)})`, `${linear(a, b)} = ${linear(c * e, c * f)}`],
                  ],
                  [
                    ["Collect and solve", "移项并求解"],
                    ["Collect the $x$-terms on the left and the numbers on the right:", "把含 $x$ 的项移到左边，数移到右边："],
                    isolated(a - c * e, num(c * f - b), num(x)),
                  ],
                ],
                [
                  `Put $x = ${x}$ back: the left side is $\\frac{${num(a * x + b)}}{${c}} = ${num(value)}$ and the right side is $${substitutedLinear(e, x, f)} = ${num(value)}$.`,
                  `把 $x = ${x}$ 代回去：左边是 $\\frac{${num(a * x + b)}}{${c}} = ${num(value)}$，右边是 $${substitutedLinear(e, x, f)} = ${num(value)}$。`,
                ],
                [
                  [
                    frac(f - b, a - c * e),
                    `That multiplies only the $x$-term on the right by $${c}$; multiply $${num(f)}$ too.`,
                    `这是只把右边含 $x$ 的项乘了 $${c}$；$${num(f)}$ 也要乘。`,
                  ],
                  [frac(f - b, a - e), `That forgets to multiply the right side by $${c}$.`, `这是忘了把右边乘以 $${c}$。`],
                  [frac(c * f + b, c * e - a), "That moves the terms across without changing their signs.", "这是移项时没有变号。"],
                ],
                { solveFor: "x" },
              );
            }
          },
          tableFigure(["5x + 2", "3(x - 2)", "x"], [-18, -18, -4]),
        ),
        keyPrerequisites: ["equations-with-parentheses"],
      },
    ],
  ),
  ["What is $x$ if $\\frac{x}{3} = 4$?", "如果 $\\frac{x}{3} = 4$，$x$ 是多少？"],
  ["$12$: multiply both sides by $3$; and $12 \\div 3 = 4$.", "$12$：两边同时乘以 $3$；而 $12 \\div 3 = 4$。"],
  [
    "clear a denominator by multiplying both sides by it, then solve the equation that is left.",
    "两边同时乘以分母来去分母，再解剩下的方程。",
  ],
);

/** solvingLinearEquationsUsingCrossMultiplication clears two denominators at once by cross-multiplying. */
export const solvingLinearEquationsUsingCrossMultiplication = withIntro(
  topic(
    "solving-linear-equations-using-cross-multiplication",
    t("Solving Linear Equations Using Cross-Multiplication", "用交叉相乘解一次方程"),
    t(
      "An equation of two fractions, $\\frac{a}{b} = \\frac{c}{d}$, is true exactly when $ad = bc$. Cross-multiplying clears both denominators at once: $\\frac{x + 1}{4} = \\frac{x - 2}{3}$ becomes $3(x + 1) = 4(x - 2)$, so $3x + 3 = 4x - 8$ and $x = 11$. Each numerator is multiplied by the other fraction's denominator, as a whole.",
      "两个分数相等的方程 $\\frac{a}{b} = \\frac{c}{d}$ 成立，当且仅当 $ad = bc$。交叉相乘可以一次去掉两个分母：$\\frac{x + 1}{4} = \\frac{x - 2}{3}$ 变为 $3(x + 1) = 4(x - 2)$，于是 $3x + 3 = 4x - 8$，$x = 11$。每个分子要整体乘以另一个分数的分母。",
    ),
    ["solving-linear-equations-by-clearing-a-rational-expression", "proportions"],
    ["7.EE.B.4.A", "8.EE.C.7.B"],
    [
      {
        ...lesson(
          "a-binomial-over-a-number",
          ["A binomial over a number", "二项式除以一个数"],
          [
            [
              "Multiply each numerator by the denominator on the other side. For $\\frac{x - 3}{6} = \\frac{5}{2}$: $2(x - 3) = 6 \\cdot 5$, so $2x - 6 = 30$ and $x = 18$. The $2$ multiplies the whole numerator $x - 3$.",
              "把每个分子都乘以另一边的分母。对于 $\\frac{x - 3}{6} = \\frac{5}{2}$：$2(x - 3) = 6 \\cdot 5$，所以 $2x - 6 = 30$，$x = 18$。$2$ 要乘以整个分子 $x - 3$。",
            ],
            [
              "Put $x = 18$ back: $\\frac{15}{6} = \\frac{5}{2}$, dividing the top and bottom by $3$.",
              "把 $x = 18$ 代回去：$\\frac{15}{6} = \\frac{5}{2}$，分子分母同时除以 $3$。",
            ],
            [
              "Multiply the whole numerator: $2(x - 3)$ is $2x - 6$, not $2x - 3$.",
              "要乘整个分子：$2(x - 3)$ 是 $2x - 6$，不是 $2x - 3$。",
            ],
          ],
          (rng) => {
            for (;;) {
              const e = rng.int(2, 5);
              const m = rng.int(2, 3);
              const c = e * m;
              const d = rng.nonZero(-9, 9);
              if (gcd(Math.abs(d), e) !== 1) continue;
              const b = rng.nonZero(-9, 9);
              const x = m * d - b;
              if (x === 0) continue;
              const left = `\\frac{${linear(1, b)}}{${c}}`;
              const right = `${d < 0 ? "-" : ""}\\frac{${Math.abs(d)}}{${e}}`;
              const eq = rng.bool(0.75) ? `${left} = ${right}` : `${right} = ${left}`;
              return valued(
                [`Solve $${eq}$.`, `解方程 $${eq}$。`],
                x,
                [
                  [
                    ["Cross-multiply", "交叉相乘"],
                    [
                      `Multiply each numerator by the other denominator, keeping $${linear(1, b)}$ together:`,
                      `每个分子乘以另一边的分母，$${linear(1, b)}$ 要作为一个整体：`,
                    ],
                    [`${e}(${linear(1, b)}) = ${c} \\cdot ${paren(d)}`, `${linear(e, e * b)} = ${num(c * d)}`],
                  ],
                  [
                    ["Solve", "求解"],
                    ["Undo the constant, then the coefficient:", "先去掉常数项，再除以系数："],
                    isolated(e, num(c * d - e * b), num(x)),
                  ],
                ],
                [
                  `Put $x = ${x}$ back: $\\frac{${num(m * d)}}{${c}} = ${right}$, dividing the top and bottom by $${m}$.`,
                  `把 $x = ${x}$ 代回去：$\\frac{${num(m * d)}}{${c}} = ${right}$，分子分母同时除以 $${m}$。`,
                ],
                [
                  [
                    frac(e * d, c).sub(Q.of(b)),
                    "That swaps the denominators: each numerator is multiplied by the other side's denominator.",
                    "这是把分母弄反了：每个分子要乘以另一边的分母。",
                  ],
                  [
                    frac(c * d - b, e),
                    `That multiplies only $x$ by $${e}$; it multiplies the whole numerator.`,
                    `这是只把 $x$ 乘了 $${e}$；要乘整个分子。`,
                  ],
                  [c * d - b, `That forgets the $${e}$ in front of the numerator.`, `这是忘了分子前面的 $${e}$。`],
                ],
                { solveFor: "x" },
              );
            }
          },
          tableFigure(["2(x - 3)", "6 · 5", "x"], [30, 30, 18]),
        ),
        keyPrerequisites: ["proportions"],
      },
      lesson(
        "binomials-on-both-sides",
        ["Binomials on both sides", "两边都是二项式"],
        [
          [
            "Cross-multiply with parentheses, expand both sides, then collect $x$ on one side. For $\\frac{x + 4}{3} = \\frac{x - 1}{2}$: $2(x + 4) = 3(x - 1)$, so $2x + 8 = 3x - 3$ and $x = 11$.",
            "带括号交叉相乘，展开两边，再把 $x$ 移到一边。对于 $\\frac{x + 4}{3} = \\frac{x - 1}{2}$：$2(x + 4) = 3(x - 1)$，所以 $2x + 8 = 3x - 3$，$x = 11$。",
          ],
          [
            "Put $x = 11$ back: $\\frac{15}{3} = 5$ and $\\frac{10}{2} = 5$.",
            "把 $x = 11$ 代回去：$\\frac{15}{3} = 5$，$\\frac{10}{2} = 5$。",
          ],
          [
            "Multiply each numerator by the other denominator: $3(x + 4) = 2(x - 1)$ uses its own.",
            "每个分子要乘另一边的分母：$3(x + 4) = 2(x - 1)$ 乘的是自己的分母。",
          ],
        ],
        (rng) => {
          for (;;) {
            const [c, e] = rng.sample([2, 3, 4, 5, 6, 7], 2) as [number, number];
            const k = rng.nonZero(-4, 4);
            const x = rng.nonZero(-12, 12);
            const b = c * k - x;
            const d = e * k - x;
            if (b === 0 || d === 0 || Math.abs(b) > 20 || Math.abs(d) > 20) continue;
            const eq = `\\frac{${linear(1, b)}}{${c}} = \\frac{${linear(1, d)}}{${e}}`;
            return valued(
              [`Solve $${eq}$.`, `解方程 $${eq}$。`],
              x,
              [
                [
                  ["Cross-multiply", "交叉相乘"],
                  ["Multiply each numerator by the other denominator, then expand:", "每个分子乘以另一边的分母，再展开："],
                  [`${e}(${linear(1, b)}) = ${c}(${linear(1, d)})`, `${linear(e, e * b)} = ${linear(c, c * d)}`],
                ],
                [
                  ["Collect and solve", "移项并求解"],
                  ["Collect the $x$-terms on the left and the numbers on the right:", "把含 $x$ 的项移到左边，数移到右边："],
                  isolated(e - c, num(c * d - e * b), num(x)),
                ],
              ],
              [
                `Put $x = ${x}$ back: $\\frac{${num(c * k)}}{${c}} = ${k}$ and $\\frac{${num(e * k)}}{${e}} = ${k}$, the same value.`,
                `把 $x = ${x}$ 代回去：$\\frac{${num(c * k)}}{${c}} = ${k}$，$\\frac{${num(e * k)}}{${e}} = ${k}$，两边相同。`,
              ],
              [
                [
                  frac(d - b, e - c),
                  "That multiplies only the $x$-terms by the denominators; multiply the numbers too.",
                  "这是只把含 $x$ 的项乘了分母；数也要乘。",
                ],
                [frac(e * d - c * b, c - e), "That multiplies each numerator by its own denominator.", "这是把每个分子乘了自己的分母。"],
                [-x, "The sign is wrong: check which side each term moved to.", "符号错了：看看每一项移到了哪一边。"],
              ],
              { solveFor: "x" },
            );
          }
        },
        tableFigure(["2(x + 4)", "3(x - 1)", "x"], [30, 30, 11]),
      ),
    ],
  ),
  [
    "Is $\\frac{2}{3} = \\frac{4}{6}$? Compare $2 \\times 6$ and $3 \\times 4$.",
    "$\\frac{2}{3} = \\frac{4}{6}$ 吗？比较 $2 \\times 6$ 和 $3 \\times 4$。",
  ],
  [
    "Yes: $2 \\times 6 = 12$ and $3 \\times 4 = 12$; and $\\frac{4}{6}$ simplifies to $\\frac{2}{3}$.",
    "相等：$2 \\times 6 = 12$，$3 \\times 4 = 12$；而且 $\\frac{4}{6}$ 约分后就是 $\\frac{2}{3}$。",
  ],
  [
    "solve an equation of two fractions by cross-multiplying, then solving the equation that is left.",
    "用交叉相乘解两个分数相等的方程，再解剩下的方程。",
  ],
);

// ---------------------------------------------------------------------------
// Two-variable linear equations

/** std writes a·x + b·y = c. */
const std = (a: number, b: number, c: number) => `${poly([a, "x"], [b, "y"])} = ${num(c)}`;

/** pair writes an ordered pair. */
const pair = (x: number, y: number) => `(${num(x)}, ${num(y)})`;

/** check writes the substitution of (x, y) into a·x + b·y. */
const check = (a: number, b: number, x: number, y: number) => `${times(a, x)} ${plusTimes(b, y)} = ${num(a * x + b * y)}`;

/** substitutedLinear writes a·v + b with the value v substituted: "3(-2) + 5". */
const substitutedLinear = (a: number, v: number, b: number) => `${times(a, v)}${b === 0 ? "" : ` ${b < 0 ? "-" : "+"} ${Math.abs(b)}`}`;

/** TwoVariableEquation is a·x + b·y = c, written in standard form or solved for y. */
interface TwoVariableEquation {
  readonly a: number;
  readonly b: number;
  readonly c: number;
  readonly latex: string;
}

/** twoVariableEquation draws an equation through the integer point (x, y). */
function twoVariableEquation(rng: Rng, x: number, y: number): TwoVariableEquation {
  if (rng.bool(0.35)) {
    const m = rng.nonZero(-5, 5);
    const k = y - m * x;
    // y = m·x + k is −m·x + y = k.
    return { a: -m, b: 1, c: k, latex: `y = ${linear(m, k)}` };
  }
  const a = rng.nonZero(-6, 6);
  const b = rng.nonZero(-6, 6);
  return { a, b, c: a * x + b * y, latex: std(a, b, a * x + b * y) };
}

export const twoVariableLinearEquationsAndTheirSolutions = topic(
  "two-variable-linear-equations-and-their-solutions",
  t("Two-Variable Linear Equations and Their Solutions", "二元一次方程及其解"),
  t(
    "A linear equation in two variables, such as $2x + 3y = 12$, has ordered pairs $(x, y)$ as solutions: a pair is a solution when substituting $x$ and $y$ makes the equation true. $(3, 2)$ is a solution because $2(3) + 3(2) = 12$, but $(2, 3)$ is not, because $2(2) + 3(3) = 13$. Such an equation has infinitely many solutions.",
    "二元一次方程（例如 $2x + 3y = 12$）的解是有序数对 $(x, y)$：代入 $x$ 和 $y$ 后方程成立的数对就是解。$(3, 2)$ 是解，因为 $2(3) + 3(2) = 12$；但 $(2, 3)$ 不是，因为 $2(2) + 3(3) = 13$。这样的方程有无穷多个解。",
  ),
  ["introduction-to-two-variable-equations", "evaluating-expressions"],
  ["6.EE.C.9", "8.EE.C.8.A"],
  [
    {
      id: "checking-an-ordered-pair",
      title: t("Checking an ordered pair", "检验有序数对"),
      explanation: t(
        "In an ordered pair $(x, y)$, the first number is $x$ and the second is $y$. Substitute both and check whether the two sides are equal. For $y = 3x - 5$ and $(2, 1)$: $3(2) - 5 = 1$, so $(2, 1)$ is a solution; $(1, 2)$ is not, because $3(1) - 5 = -2$.",
        "有序数对 $(x, y)$ 中，第一个数是 $x$，第二个数是 $y$。把两个数都代入，看两边是否相等。对于 $y = 3x - 5$ 和 $(2, 1)$：$3(2) - 5 = 1$，所以 $(2, 1)$ 是解；$(1, 2)$ 不是，因为 $3(1) - 5 = -2$。",
      ),
      keyPrerequisites: ["evaluating-expressions"],
      generate(rng) {
        const x0 = rng.int(-6, 6);
        const y0 = rng.int(-6, 6);
        const e = twoVariableEquation(rng, x0, y0);
        const kind = rng.int(0, 2);
        let [x, y] = [x0, y0];
        if (kind === 1 && x0 !== y0) [x, y] = [y0, x0];
        else if (kind > 0) y = y0 + rng.nonZero(-3, 3);
        const value = e.a * x + e.b * y;
        const yes = value === e.c;
        const solved = e.latex.startsWith("y =");
        const work = solved ? `${substitutedLinear(-e.a, x, e.c)} = ${num(-e.a * x + e.c)}` : check(e.a, e.b, x, y);
        return choiceProblem({
          prompt: t(`Is $${pair(x, y)}$ a solution of $${e.latex}$?`, `$${pair(x, y)}$ 是 $${e.latex}$ 的解吗？`),
          options: yesNo,
          correct: yes ? 0 : 1,
          solution: solved
            ? t(
                `Substitute $x = ${num(x)}$ into the right side: $${work}$. ${yes ? `This equals $y = ${num(y)}$, so the pair is a solution.` : `This is not $y = ${num(y)}$, so the pair is not a solution.`}`,
                `把 $x = ${num(x)}$ 代入右边：$${work}$。${yes ? `它等于 $y = ${num(y)}$，所以这个数对是解。` : `它不等于 $y = ${num(y)}$，所以这个数对不是解。`}`,
              )
            : t(
                `Substitute $x = ${num(x)}$ and $y = ${num(y)}$: $${work}$. ${yes ? `This equals $${num(e.c)}$, so the pair is a solution.` : `This is not $${num(e.c)}$, so the pair is not a solution.`}`,
                `代入 $x = ${num(x)}$，$y = ${num(y)}$：$${work}$。${yes ? `它等于 $${num(e.c)}$，所以这个数对是解。` : `它不等于 $${num(e.c)}$，所以这个数对不是解。`}`,
              ),
        });
      },
    },
    {
      id: "choosing-a-solution",
      title: t("Choosing a solution", "选出方程的解"),
      explanation: t(
        "To find which of several pairs is a solution, substitute each one. Watch the order: $(4, -1)$ means $x = 4$ and $y = -1$. For $x - 2y = 6$: $(4, -1)$ gives $4 - 2(-1) = 6$ ✓, while $(-1, 4)$ gives $-1 - 8 = -9$.",
        "要判断几个数对中哪个是解，就逐个代入。注意顺序：$(4, -1)$ 表示 $x = 4$，$y = -1$。对于 $x - 2y = 6$：$(4, -1)$ 得 $4 - 2(-1) = 6$ ✓，而 $(-1, 4)$ 得 $-1 - 8 = -9$。",
      ),
      generate(rng) {
        for (;;) {
          const x = rng.int(-6, 6);
          const y = rng.int(-6, 6);
          if (x === y) continue;
          const a = rng.nonZero(-6, 6);
          const b = rng.nonZero(-6, 6);
          const c = a * x + b * y;
          const candidates: [number, number][] = [
            [y, x],
            [x, -y],
            [-x, y],
            [x, y + rng.nonZero(-2, 2)],
            [x + 1, y],
          ];
          const wrong = candidates.filter(([p, q]) => a * p + b * q !== c).map(([p, q]) => mathText(pair(p, q)));
          if (new Set(wrong.map((w) => w.en)).size < 3) continue;
          const eq = std(a, b, c);
          return pickChoice(
            rng,
            t(`Which ordered pair is a solution of $${eq}$?`, `哪个有序数对是 $${eq}$ 的解？`),
            mathText(pair(x, y)),
            wrong,
            t(
              `Substitute $x = ${num(x)}$ and $y = ${num(y)}$: $${check(a, b, x, y)}$, so $${pair(x, y)}$ is a solution. None of the other pairs gives $${num(c)}$.`,
              `代入 $x = ${num(x)}$，$y = ${num(y)}$：$${check(a, b, x, y)}$，所以 $${pair(x, y)}$ 是解。其他数对代入后的值都不等于 $${num(c)}$。`,
            ),
          );
        }
      },
    },
  ],
);

/** solvingTwoVariableEquations finds a missing coordinate and solves an equation for y. */
export const solvingTwoVariableEquations = withIntro(
  topic(
    "solving-two-variable-equations",
    t("Solving Two-Variable Equations", "解二元方程"),
    t(
      "If one variable of a two-variable equation is known, substitute it and solve the one-variable equation that is left: in $3x + 2y = 16$ with $x = 4$, $12 + 2y = 16$, so $y = 2$. You can also solve for $y$ in terms of $x$: $3x + y = 7$ gives $y = -3x + 7$, which gives $y$ directly for any $x$.",
      "如果二元方程中一个变量的值已知，就把它代入，解剩下的一元方程：在 $3x + 2y = 16$ 中，若 $x = 4$，则 $12 + 2y = 16$，所以 $y = 2$。也可以用 $x$ 表示 $y$：由 $3x + y = 7$ 得 $y = -3x + 7$，对任意 $x$ 都能直接算出 $y$。",
    ),
    ["two-variable-linear-equations-and-their-solutions", "two-step-equations"],
    ["6.EE.C.9", "7.EE.B.4.A"],
    [
      {
        ...lesson(
          "finding-the-missing-coordinate",
          ["Finding the missing coordinate", "求缺少的坐标"],
          [
            [
              "If one coordinate of a solution is known, substitute it, and the equation becomes one with a single variable. $(-2, y)$ is a solution of $4x - 3y = 10$: substituting $x = -2$ gives $-8 - 3y = 10$, so $-3y = 18$ and $y = -6$.",
              "已知解的一个坐标时，把它代入，方程就变成只含一个未知数的方程。$(-2, y)$ 是 $4x - 3y = 10$ 的解：代入 $x = -2$ 得 $-8 - 3y = 10$，所以 $-3y = 18$，$y = -6$。",
            ],
            ["Put both numbers in: $4(-2) - 3(-6) = -8 + 18 = 10$.", "把两个数都代入：$4(-2) - 3(-6) = -8 + 18 = 10$。"],
            ["The first number of a pair is always $x$: in $(-2, y)$, $x = -2$.", "数对的第一个数总是 $x$：在 $(-2, y)$ 中，$x = -2$。"],
          ],
          (rng) => {
            const x = rng.nonZero(-6, 6);
            const y = rng.nonZero(-6, 6);
            const a = rng.nonZero(-6, 6);
            const b = rng.nonZero(-6, 6);
            const c = a * x + b * y;
            const eq = std(a, b, c);
            const findY = rng.bool();
            const [known, unknown, kc, uc, kv, uv] = findY ? ["x", "y", a, b, x, y] : ["y", "x", b, a, y, x];
            const shown = findY ? `(${num(x)}, y)` : `(x, ${num(y)})`;
            const left = findY
              ? `${times(a, x)} ${b < 0 ? "-" : "+"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}y`
              : `${poly([a, "x"])} ${plusTimes(b, y)}`;
            return valued(
              [
                `The ordered pair $${shown}$ is a solution of $${eq}$. Find $${unknown}$.`,
                `有序数对 $${shown}$ 是 $${eq}$ 的解。求 $${unknown}$。`,
              ],
              uv,
              [
                [
                  ["Substitute", "代入"],
                  [`Put $${known} = ${num(kv)}$ into the equation:`, `把 $${known} = ${num(kv)}$ 代入方程：`],
                  [`${left} = ${num(c)}`],
                ],
                [
                  ["Solve", "求解"],
                  [`Solve the equation for $${unknown}$:`, `解这个关于 $${unknown}$ 的方程：`],
                  isolated(uc, num(c - kc * kv), num(uv), unknown),
                ],
              ],
              [`Put both numbers in: $${check(a, b, x, y)}$.`, `把两个数都代入：$${check(a, b, x, y)}$。`],
              [
                [frac(c + kc * kv, uc), "That moves the known term without changing its sign.", "这是移动已知的项时没有变号。"],
                [
                  frac(c - uc * kv, kc),
                  `That uses the coefficients the wrong way round: $${num(kv)}$ goes with $${num(kc)}$.`,
                  `这是把系数用反了：$${num(kv)}$ 要和 $${num(kc)}$ 相乘。`,
                ],
                [
                  c - kc * kv,
                  `That forgets to divide by $${num(uc)}$, the coefficient of $${unknown}$.`,
                  `这是忘了除以 $${unknown}$ 的系数 $${num(uc)}$。`,
                ],
                [
                  kv,
                  `That is the known coordinate, $${known}$; the question asks for $${unknown}$.`,
                  `这是已知的坐标 $${known}$；题目问的是 $${unknown}$。`,
                ],
              ],
              { solveFor: unknown },
            );
          },
          tableFigure(["x", "y", "4x - 3y"], [-2, -6, 10]),
        ),
        keyPrerequisites: ["two-step-equations"],
      },
      lesson(
        "solving-for-y",
        ["Solving for y", "用 x 表示 y"],
        [
          [
            "To solve for $y$, get $y$ alone: move the $x$-term to the other side with the opposite operation, then divide every term by the coefficient of $y$. $6x + 2y = 10$ gives $2y = -6x + 10$, so $y = -3x + 5$.",
            "用 $x$ 表示 $y$，就是让 $y$ 单独在一边：用相反的运算把含 $x$ 的项移到另一边，再把每一项都除以 $y$ 的系数。由 $6x + 2y = 10$ 得 $2y = -6x + 10$，所以 $y = -3x + 5$。",
          ],
          ["Put in $x = 1$: $y = -3 + 5 = 2$, and $6(1) + 2(2) = 10$.", "代入 $x = 1$：$y = -3 + 5 = 2$，而 $6(1) + 2(2) = 10$。"],
          [
            "Divide every term by the coefficient of $y$: $\\frac{-6x + 10}{2}$ is $-3x + 5$, not $-3x + 10$.",
            "每一项都要除以 $y$ 的系数：$\\frac{-6x + 10}{2}$ 是 $-3x + 5$，不是 $-3x + 10$。",
          ],
        ],
        (rng) => {
          const b = rng.pick([1, -1, 2, -2, 3, -3, 4, 5]);
          const m = rng.nonZero(-6, 6);
          const k = rng.nonZero(-8, 8);
          // a·x + b·y = c with y = m·x + k: a = −b·m, c = b·k.
          const a = -b * m;
          const c = b * k;
          const xFirst = rng.bool(0.7);
          const lhs = xFirst ? poly([a, "x"], [b, "y"]) : poly([b, "y"], [a, "x"]);
          const eq = `${lhs} = ${num(c)}`;
          const answer = linear(m, k);
          const candidates: [string, string, string][] = [
            [
              linear(-m, k),
              "The sign of the $x$-term is wrong: moving it across changes its sign.",
              "含 $x$ 的项符号错了：移到另一边时要变号。",
            ],
            [
              linear(-a, k),
              `That divides only the number by $${num(b)}$; divide every term.`,
              `这是只把数除以了 $${num(b)}$；每一项都要除。`,
            ],
            [
              linear(m, c),
              `That divides only the $x$-term by $${num(b)}$; divide every term.`,
              `这是只把含 $x$ 的项除以了 $${num(b)}$；每一项都要除。`,
            ],
            [
              linear(-m, -k),
              "That changes the sign of every term; only the moved term changes sign.",
              "这是把每一项都变了号；只有移动的那一项才变号。",
            ],
          ];
          const saids = candidates.filter(([s], i) => s !== answer && candidates.findIndex(([r]) => r === s) === i);
          const move: Pair =
            a > 0
              ? [`Subtract $${side(a)}$ from both sides:`, `两边同时减去 $${side(a)}$：`]
              : [`Add $${side(-a)}$ to both sides:`, `两边同时加上 $${side(-a)}$：`];
          return expressed(
            [`Solve $${eq}$ for $y$.`, `把方程 $${eq}$ 写成用 $x$ 表示 $y$ 的形式。`],
            answer,
            [
              [["Move the x-term", "移走含 x 的项"], move, [`${poly([b, "y"])} = ${linear(-a, c)}`]],
              b === 1
                ? [
                    ["Read the answer", "得出结果"],
                    ["The coefficient of $y$ is already $1$, so $y$ is alone.", "$y$ 的系数已经是 $1$，$y$ 已经单独在一边。"],
                  ]
                : [
                    ["Divide every term", "每一项都除"],
                    [`Divide every term by $${num(b)}$:`, `每一项都除以 $${num(b)}$：`],
                    [`y = ${answer}`],
                  ],
            ],
            [
              `Put in $x = 1$: $y = ${num(m + k)}$, and $${check(a, b, 1, m + k)}$.`,
              `代入 $x = 1$：$y = ${num(m + k)}$，而 $${check(a, b, 1, m + k)}$。`,
            ],
            saids,
            { prefix: "y =" },
          );
        },
        tableFigure(["x", "6x + 2y", "y = -3x + 5"], [1, 10, 2]),
      ),
    ],
  ),
  ["If $x + y = 10$ and $x = 3$, what is $y$?", "如果 $x + y = 10$，且 $x = 3$，$y$ 是多少？"],
  ["$7$: $3 + y = 10$, so $y = 7$; and $3 + 7 = 10$.", "$7$：$3 + y = 10$，所以 $y = 7$；而 $3 + 7 = 10$。"],
  [
    "find a missing coordinate of a solution and solve an equation for one of its letters.",
    "求解中缺少的坐标，并用一个字母表示另一个字母。",
  ],
);

/** LatticeLine is the line y = m·x + b with the integer points on it inside the view from −8 to 8. */
interface LatticeLine {
  readonly m: Q;
  readonly b: number;
  readonly points: readonly [number, number][];
}

/** latticeLine draws a line with a small slope and an integer y-intercept, with at least three integer points in view. */
function latticeLine(rng: Rng): LatticeLine {
  const slopes = [-3, -2, -1, 1, 2, 3].map((n) => Q.of(n)).concat([Q.of(1, 2), Q.of(-1, 2)]);
  const m = rng.pick(slopes);
  const b = rng.int(-4, 4);
  const points: [number, number][] = [];
  for (let x = -8; x <= 8; x++) {
    const y = m.mul(Q.of(x)).add(Q.of(b));
    if (y.isInteger() && Math.abs(y.toNumber()) <= 7 && Math.abs(x) <= 7) points.push([x, y.toNumber()]);
  }
  return { m, b, points };
}

/** lineFigure graphs the line on a grid from −8 to 8, describing it by two of its integer points. */
function lineFigure(line: LatticeLine, described: readonly [number, number][]): Figure {
  const [p, q] = described as [[number, number], [number, number]];
  return {
    svg: plane({ xMin: -8, xMax: 8, yMin: -8, yMax: 8, step: 1, labelEvery: 2 }, [
      { kind: "line", a: [0, line.b], b: [2, line.m.mul(Q.of(2)).toNumber() + line.b], accent: true },
    ]),
    alt: t(
      `A coordinate grid from −8 to 8 with a straight line through the points (${p[0]}, ${p[1]}) and (${q[0]}, ${q[1]}).`,
      `从 −8 到 8 的坐标网格，一条直线经过点 (${p[0]}, ${p[1]}) 和 (${q[0]}, ${q[1]})。`,
    ),
  };
}

export const graphingLinearEquations = topic(
  "graphing-linear-equations",
  t("Graphing Linear Equations", "画一次方程的图像"),
  t(
    "The graph of an equation in $x$ and $y$ shows all of its solutions: every point $(x, y)$ on the graph is a solution, and every solution is a point on the graph. The graph of a linear equation is a straight line. To graph $y = 2x - 1$, make a table of a few solutions, such as $(0, -1)$, $(1, 1)$ and $(2, 3)$, plot them and draw the line through them.",
    "关于 $x$ 和 $y$ 的方程的图像表示它的所有解：图像上的每个点 $(x, y)$ 都是解，每个解也都是图像上的点。一次方程的图像是一条直线。画 $y = 2x - 1$ 的图像时，先列表求出几个解，例如 $(0, -1)$、$(1, 1)$、$(2, 3)$，描出这些点，再过这些点画直线。",
  ),
  ["solving-two-variable-equations", "the-cartesian-coordinate-system"],
  ["8.F.A.3", "HSA.REI.D.10"],
  [
    {
      id: "reading-a-solution-from-the-graph",
      figure: gradeDrawings3["graphing-linear-equations#reading-a-solution-from-the-graph"],
      title: t("Reading a solution from the graph", "从图像读出解"),
      explanation: t(
        "Each point on the line is a solution of its equation. To find $y$ for a given $x$, go from $x$ on the $x$-axis straight up or down to the line, then across to the $y$-axis. On a line through $(0, 3)$ and $(2, -1)$, the point above or below $x = 4$ is $(4, -5)$, so $y = -5$ when $x = 4$.",
        "直线上的每个点都是它的方程的解。要求某个 $x$ 对应的 $y$，从 $x$ 轴上的 $x$ 处竖直向上或向下到直线，再水平找到 $y$ 轴上的值。在经过 $(0, 3)$ 和 $(2, -1)$ 的直线上，$x = 4$ 处的点是 $(4, -5)$，所以当 $x = 4$ 时，$y = -5$。",
      ),
      keyPrerequisites: ["the-cartesian-coordinate-system"],
      generate(rng) {
        for (;;) {
          const line = latticeLine(rng);
          if (line.points.length < 4) continue;
          const [asked, ...rest] = rng.shuffle(line.points) as [[number, number], ...[number, number][]];
          const described = rest.slice(0, 2);
          const [x, y] = asked;
          const inverse = line.m.isZero() ? undefined : Q.of(x - line.b).div(line.m);
          return {
            ...numberProblem({
              prompt: t(
                `The graph shows a linear equation in $x$ and $y$. What is $y$ when $x = ${num(x)}$?`,
                `图像表示一个关于 $x$ 和 $y$ 的一次方程。当 $x = ${num(x)}$ 时，$y$ 是多少？`,
              ),
              answer: y,
              solveFor: "y",
              wrong: [...(inverse ? [inverse] : []), -y, line.m.mul(Q.of(x))],
              solution: t(
                `The point of the line at $x = ${num(x)}$ is $${pair(x, y)}$, so $y = ${num(y)}$.`,
                `直线在 $x = ${num(x)}$ 处的点是 $${pair(x, y)}$，所以 $y = ${num(y)}$。`,
              ),
            }),
            figure: lineFigure(line, described),
          };
        }
      },
    },
    {
      id: "matching-an-equation-to-its-graph",
      figure: gradeDrawings3["graphing-linear-equations#matching-an-equation-to-its-graph"],
      title: t("Matching an equation to its graph", "根据图像选方程"),
      explanation: t(
        "To check whether an equation has a given line as its graph, read two points of the line and substitute them. The line through $(0, 1)$ and $(2, 5)$ is the graph of $y = 2x + 1$: $2(0) + 1 = 1$ and $2(2) + 1 = 5$. It is not the graph of $y = x + 2$, because $(0, 1)$ does not satisfy it.",
        "要判断一个方程的图像是不是某条直线，读出直线上的两个点代入检验。经过 $(0, 1)$ 和 $(2, 5)$ 的直线是 $y = 2x + 1$ 的图像：$2(0) + 1 = 1$，$2(2) + 1 = 5$。它不是 $y = x + 2$ 的图像，因为 $(0, 1)$ 不满足这个方程。",
      ),
      generate(rng) {
        for (;;) {
          const line = latticeLine(rng);
          if (line.points.length < 3) continue;
          const { m, b } = line;
          const onAxis = line.points.find(([x]) => x === 0)!;
          const other = rng.pick(line.points.filter(([x]) => x !== 0));
          const correct = `y = ${linear(m, b)}`;
          // Swapping the slope and the intercept, and sign errors in either, are the usual misreadings.
          const shifts = b === 0 ? [Q.one, Q.one.neg()] : [Q.of(-b), Q.of(-b)];
          const wrong = [
            ...(m.isInteger() && b !== 0 && !m.eq(Q.of(b)) ? [`y = ${linear(b, m)}`] : []),
            `y = ${linear(m.neg(), b)}`,
            `y = ${linear(m, shifts[0]!)}`,
            `y = ${linear(m.neg(), shifts[1]!)}`,
          ];
          const [x2, y2] = other;
          return pickChoice(
            rng,
            t("Which equation has the line shown as its graph?", "哪个方程的图像是图中的直线？"),
            mathText(correct),
            wrong.map(mathText),
            t(
              `The line passes through $${pair(0, onAxis[1])}$ and $${pair(x2, y2)}$. Both satisfy $${correct}$: $y = ${num(b)}$ at $x = 0$, and $${num(m)} \\cdot ${paren(x2)} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${num(y2)}$. Each of the other equations fails for at least one of these points.`,
              `直线经过 $${pair(0, onAxis[1])}$ 和 $${pair(x2, y2)}$。两点都满足 $${correct}$：$x = 0$ 时 $y = ${num(b)}$，且 $${num(m)} \\cdot ${paren(x2)} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${num(y2)}$。其他方程至少有一个点不满足。`,
            ),
            lineFigure(line, [onAxis, other]),
          );
        }
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Inequalities

/** span is the set of numbers from lo to hi, each end included when closed. */
const span = (lo: number, loClosed: boolean, hi: number, hiClosed: boolean): Interval => ({
  lo: Q.of(lo),
  hi: Q.of(hi),
  loClosed,
  hiClosed,
});

/** lessOp draws < or ≤. */
const lessOp = (rng: Rng): InequalityOp => (rng.bool() ? "<" : "<=");

/** greaterOp draws > or ≥. */
const greaterOp = (rng: Rng): InequalityOp => (rng.bool() ? ">" : ">=");

/** ranged asks for a set written as inequalities, works it in labelled steps with a check, and says why each wrong set is wrong. */
function ranged(
  prompt: Pair,
  set: RealSet,
  walk: readonly Walk[],
  check: Pair,
  wrongs: readonly (readonly [RealSet, string, string])[],
  figure: Figure,
): Problem {
  const problem = intervalProblem({
    prompt: t(prompt[0], prompt[1]),
    set,
    form: "inequality",
    solution: walkThrough(walk, check),
    wrong: wrongs.map(([w]) => w),
  });
  const reasons = wrongs.map(([w, en, zh]) => ({ response: inequalityLatexOf(w, "x"), why: t(en, zh) }));
  return { ...withMistakes(problem, reasons), figure };
}

/** truth writes whether a statement holds. */
const truth = (yes: boolean): Pair => (yes ? ["true", "成立"] : ["false", "不成立"]);

/** compoundInequalities reads and writes inequalities joined by "and" or "or". */
export const compoundInequalities = withIntro(
  topic(
    "compound-inequalities",
    t("Compound Inequalities", "复合不等式"),
    t(
      "A compound inequality joins two inequalities with “and” or “or”. $-2 < x \\le 5$ means $x > -2$ **and** $x \\le 5$: the numbers between $-2$ and $5$, including $5$. $x < -1 \\text{ or } x \\ge 3$ means the numbers that satisfy **at least one** of the two. On a number line, “and” is one shaded segment, and “or” is usually two rays pointing away from each other.",
      "复合不等式用“并且”或“或”把两个不等式连起来。$-2 < x \\le 5$ 表示 $x > -2$ **并且** $x \\le 5$：$-2$ 与 $5$ 之间的数，包括 $5$。$x < -1 \\text{ 或 } x \\ge 3$ 表示**至少满足其中一个**不等式的数。在数轴上，“并且”通常是一条涂色的线段，“或”通常是两条方向相反的射线。",
    ),
    ["representing-inequalities-on-number-lines", "inequalities-and-solutions"],
    ["6.EE.B.8", "7.EE.B.4.B"],
    [
      {
        ...lesson(
          "checking-a-value",
          ["Checking a value", "检验一个值"],
          [
            [
              "For “and”, a value must satisfy both parts; for “or”, one part is enough. $x = 5$ satisfies $-2 < x \\le 5$, since $-2 < 5$ and $5 \\le 5$. $x = 0$ does not satisfy $x < -1 \\text{ or } x \\ge 3$, since both parts are false.",
              "对于“并且”，一个值必须同时满足两部分；对于“或”，满足其中一部分就够了。$x = 5$ 满足 $-2 < x \\le 5$，因为 $-2 < 5$ 且 $5 \\le 5$。$x = 0$ 不满足 $x < -1 \\text{ 或 } x \\ge 3$，因为两部分都不成立。",
            ],
            [
              "Mark $5$ on the graph of $-2 < x \\le 5$: it is the closed dot at the right end, so it is shaded.",
              "在 $-2 < x \\le 5$ 的图像上找 $5$：它是右端的实心点，在涂色部分里。",
            ],
            [
              "An end with $\\le$ or $\\ge$ is included, but an end with $<$ or $>$ is not: $-2$ does not satisfy $-2 < x \\le 5$.",
              "带 $\\le$ 或 $\\ge$ 的端点包括在内，带 $<$ 或 $>$ 的不包括：$-2$ 不满足 $-2 < x \\le 5$。",
            ],
          ],
          (rng) => {
            const lo = rng.int(-9, 5);
            const hi = lo + rng.int(2, 8);
            const opLo = lessOp(rng);
            const opHi = lessOp(rng);
            const and = rng.bool();
            const candidates = [lo - 1, lo, lo + 1, Math.floor((lo + hi) / 2), hi - 1, hi, hi + 1];
            const v = rng.pick(candidates);
            const V = Q.of(v);
            const end = (n: number, closed: boolean): Pair => [
              `$${n}$ ${closed ? "included" : "left out"}`,
              `$${n}$ ${closed ? "包括在内" : "不包括"}`,
            ];
            if (and) {
              const latex = `${lo} ${relSymbol(opLo)} x ${relSymbol(opHi)} ${hi}`;
              const first = holds(Q.of(lo), opLo, V);
              const second = holds(V, opHi, Q.of(hi));
              const yes = first && second;
              const [l, h] = [end(lo, opLo === "<="), end(hi, opHi === "<=")];
              return decided(
                rng,
                [`Is $x = ${v}$ a solution of $${latex}$?`, `$x = ${v}$ 是 $${latex}$ 的解吗？`],
                yes,
                [
                  [
                    ["The first part", "第一部分"],
                    [`$${lo} ${relSymbol(opLo)} ${v}$ is ${truth(first)[0]}.`, `$${lo} ${relSymbol(opLo)} ${v}$ ${truth(first)[1]}。`],
                  ],
                  [
                    ["The second part", "第二部分"],
                    [
                      `$${v} ${relSymbol(opHi)} ${hi}$ is ${truth(second)[0]}. Both parts must be true, so $${v}$ is ${yes ? "" : "not "}a solution.`,
                      `$${v} ${relSymbol(opHi)} ${hi}$ ${truth(second)[1]}。两部分都必须成立，所以 $${v}$ ${yes ? "是" : "不是"}解。`,
                    ],
                  ],
                ],
                [
                  `Mark $${v}$ on the graph, a segment from $${lo}$ to $${hi}$ with ${l[0]} and ${h[0]}: it lies ${yes ? "on" : "off"} the shaded part.`,
                  `在图像上找 $${v}$：图像是从 $${lo}$ 到 $${hi}$ 的线段，${l[1]}，${h[1]}；$${v}$ ${yes ? "在" : "不在"}涂色部分上。`,
                ],
                yes
                  ? ["Both parts are true, and that is all “and” needs.", "两部分都成立，这正是“并且”所要求的。"]
                  : [
                      `The ${first ? "second" : "first"} part is false, and “and” needs both parts.`,
                      `${first ? "第二" : "第一"}部分不成立，而“并且”要求两部分都成立。`,
                    ],
                numberLineFigure(union(span(-2, false, 5, true)), -4, 7),
              );
            }
            const opGreater = greaterOp(rng);
            const latex = (or: string) => `x ${relSymbol(opLo)} ${lo} \\text{ ${or} } x ${relSymbol(opGreater)} ${hi}`;
            const first = holds(V, opLo, Q.of(lo));
            const second = holds(V, opGreater, Q.of(hi));
            const yes = first || second;
            const [l, h] = [end(lo, opLo === "<="), end(hi, opGreater === ">=")];
            return decided(
              rng,
              [`Is $x = ${v}$ a solution of $${latex("or")}$?`, `$x = ${v}$ 是 $${latex("或")}$ 的解吗？`],
              yes,
              [
                [
                  ["The first part", "第一部分"],
                  [`$${v} ${relSymbol(opLo)} ${lo}$ is ${truth(first)[0]}.`, `$${v} ${relSymbol(opLo)} ${lo}$ ${truth(first)[1]}。`],
                ],
                [
                  ["The second part", "第二部分"],
                  [
                    `$${v} ${relSymbol(opGreater)} ${hi}$ is ${truth(second)[0]}. One true part is enough, so $${v}$ is ${yes ? "" : "not "}a solution.`,
                    `$${v} ${relSymbol(opGreater)} ${hi}$ ${truth(second)[1]}。只要有一部分成立就够了，所以 $${v}$ ${yes ? "是" : "不是"}解。`,
                  ],
                ],
              ],
              [
                `Mark $${v}$ on the graph, two rays going out from $${lo}$ and $${hi}$ with ${l[0]} and ${h[0]}: it lies ${yes ? "on" : "off"} the shaded part.`,
                `在图像上找 $${v}$：图像是从 $${lo}$ 和 $${hi}$ 向外的两条射线，${l[1]}，${h[1]}；$${v}$ ${yes ? "在" : "不在"}涂色部分上。`,
              ],
              yes
                ? [
                    `The ${first ? "first" : "second"} part is true, and one true part is enough for “or”.`,
                    `${first ? "第一" : "第二"}部分成立，对于“或”，一部分成立就够了。`,
                  ]
                : ["Both parts are false, so neither part makes it a solution.", "两部分都不成立，所以它不是解。"],
            );
          },
          numberLineFigure(union(span(-2, false, 5, true)), -4, 7),
        ),
        keyPrerequisites: ["inequalities-and-solutions"],
      },
      {
        ...lesson(
          "writing-from-a-graph",
          ["Writing a compound inequality from a graph", "根据图像写复合不等式"],
          [
            [
              "A segment from an open circle at $-3$ to a closed dot at $4$ shows $-3 < x \\le 4$. Two rays, one going left from a closed dot at $-1$ and one going right from an open circle at $2$, show $x \\le -1 \\text{ or } x > 2$.",
              "从 $-3$ 处的空心圈到 $4$ 处的实心点的线段表示 $-3 < x \\le 4$。两条射线，一条从 $-1$ 处的实心点向左，另一条从 $2$ 处的空心圈向右，表示 $x \\le -1 \\text{ 或 } x > 2$。",
            ],
            [
              "Test a point: $0$ is shaded on the segment, and $-3 < 0 \\le 4$ is true.",
              "取一个点检验：$0$ 在线段的涂色部分上，而 $-3 < 0 \\le 4$ 成立。",
            ],
            [
              "A closed dot means the end is included ($\\le$ or $\\ge$); an open circle means it is not ($<$ or $>$).",
              "实心点表示包括端点（$\\le$ 或 $\\ge$）；空心圈表示不包括（$<$ 或 $>$）。",
            ],
          ],
          (rng) => {
            const lo = rng.int(-8, 4);
            const hi = lo + rng.int(2, 7);
            const loClosed = rng.bool();
            const hiClosed = rng.bool();
            const min = lo - 2;
            const max = Math.max(hi + 2, min + 10);
            const dot = (closed: boolean): Pair =>
              closed ? ["a closed dot, included", "实心点，包括"] : ["an open circle, left out", "空心圈，不包括"];
            const prompt: Pair = [
              "Write a compound inequality in $x$ for the numbers shown on the number line.",
              "写出表示数轴上所示数的关于 $x$ 的复合不等式。",
            ];
            const swapped = "That swaps the circles: a closed dot is included and an open circle is not.";
            const swappedZh = "这是把圆圈弄反了：实心点包括端点，空心圈不包括。";
            if (rng.bool(0.55)) {
              const set = union(span(lo, loClosed, hi, hiClosed));
              const latex = `${lo} ${loClosed ? "\\le" : "<"} x ${hiClosed ? "\\le" : "<"} ${hi}`;
              const mid = Math.floor((lo + hi) / 2);
              return ranged(
                prompt,
                set,
                [
                  [
                    ["Read the ends", "读出端点"],
                    [
                      `The shading runs from $${lo}$ (${dot(loClosed)[0]}) to $${hi}$ (${dot(hiClosed)[0]}).`,
                      `涂色部分从 $${lo}$（${dot(loClosed)[1]}）到 $${hi}$（${dot(hiClosed)[1]}）。`,
                    ],
                  ],
                  [
                    ["Write the inequality", "写出不等式"],
                    ["The numbers between the ends are shaded, so $x$ goes in the middle:", "两端之间的数都涂了色，所以 $x$ 写在中间："],
                    [latex],
                  ],
                ],
                [
                  `Test a point: $${mid}$ is shaded, and $${latex.replace(" x ", ` ${mid} `)}$ is true; $${min}$ is not shaded, and it is less than $${lo}$.`,
                  `取一个点检验：$${mid}$ 在涂色部分上，而 $${latex.replace(" x ", ` ${mid} `)}$ 成立；$${min}$ 没有涂色，它小于 $${lo}$。`,
                ],
                [
                  [union(span(lo, !loClosed, hi, !hiClosed)), swapped, swappedZh],
                  [
                    union(ray(loClosed ? "<=" : "<", lo), ray(hiClosed ? ">=" : ">", hi)),
                    "That describes two rays going out; the graph is one segment between the ends.",
                    "这表示两条向外的射线；图像是两端之间的一条线段。",
                  ],
                ],
                numberLineFigure(set, min, max),
              );
            }
            const set = union(ray(loClosed ? "<=" : "<", lo), ray(hiClosed ? ">=" : ">", hi));
            const latex = `x ${loClosed ? "\\le" : "<"} ${lo} \\text{ or } x ${hiClosed ? "\\ge" : ">"} ${hi}`;
            return ranged(
              prompt,
              set,
              [
                [
                  ["Read the rays", "读出射线"],
                  [
                    `One ray goes left from $${lo}$ (${dot(loClosed)[0]}) and the other goes right from $${hi}$ (${dot(hiClosed)[0]}).`,
                    `一条射线从 $${lo}$（${dot(loClosed)[1]}）向左，另一条从 $${hi}$（${dot(hiClosed)[1]}）向右。`,
                  ],
                ],
                [
                  ["Join them with “or”", "用“或”连起来"],
                  ["A number is shaded if it is on either ray:", "在任意一条射线上的数都涂了色："],
                  [latex],
                ],
              ],
              [
                `Test a point: $${min}$ is shaded and $${min} < ${lo}$; $${max}$ is shaded and $${max} > ${hi}$; a number between, such as $${Math.floor((lo + hi) / 2)}$, is not shaded.`,
                `取点检验：$${min}$ 涂了色，且 $${min} < ${lo}$；$${max}$ 涂了色，且 $${max} > ${hi}$；两者之间的数，例如 $${Math.floor((lo + hi) / 2)}$，没有涂色。`,
              ],
              [
                [
                  union(span(lo, loClosed, hi, hiClosed)),
                  "That is the numbers between the ends; the graph shows two rays going out.",
                  "这表示两端之间的数；图像是两条向外的射线。",
                ],
                [union(ray(loClosed ? "<" : "<=", lo), ray(hiClosed ? ">" : ">=", hi)), swapped, swappedZh],
              ],
              numberLineFigure(set, min, max),
            );
          },
          drawn(gradeDrawings3["compound-inequalities#writing-from-a-graph"]),
        ),
        keyPrerequisites: ["representing-inequalities-on-number-lines"],
      },
    ],
  ),
  ["Which whole numbers are greater than $1$ and less than $4$?", "哪些整数大于 $1$ 并且小于 $4$？"],
  [
    "$2$ and $3$: each is greater than $1$ and less than $4$, while $1$ and $4$ themselves are left out.",
    "$2$ 和 $3$：它们都大于 $1$ 并且小于 $4$，而 $1$ 和 $4$ 本身不算。",
  ],
  [
    "check values against inequalities joined by “and” or “or”, and write them from a graph.",
    "检验一个值是否满足用“并且”或“或”连起来的不等式，并根据图像写出这样的不等式。",
  ],
);

/** described says what the difference between the two sides must be for an inequality to hold. */
const described: Record<InequalityOp, Pair> = {
  "<": ["negative", "是负数"],
  "<=": ["zero or negative", "是零或负数"],
  ">": ["positive", "是正数"],
  ">=": ["zero or positive", "是零或正数"],
};

/** verifyingSolutionsOfLinearInequalities tests values by substituting them into both sides. */
export const verifyingSolutionsOfLinearInequalities = withIntro(
  topic(
    "verifying-solutions-of-linear-inequalities",
    t("Verifying Solutions of Linear Inequalities", "检验一次不等式的解"),
    t(
      "To verify that a value is a solution of an inequality, substitute it into both sides, evaluate each side, and check whether the inequality between the two results is true. For $x = 4$, $3(x - 2) \\ge x + 1$ becomes $6 \\ge 5$, which is true, so $4$ is a solution. When the two sides come out equal, the value is a solution of $\\le$ and $\\ge$ but not of $<$ and $>$.",
      "检验一个值是不是不等式的解，把它代入两边，分别计算，再看两个结果之间的不等关系是否成立。当 $x = 4$ 时，$3(x - 2) \\ge x + 1$ 变为 $6 \\ge 5$，成立，所以 $4$ 是解。如果两边相等，这个值是 $\\le$ 和 $\\ge$ 的解，但不是 $<$ 和 $>$ 的解。",
    ),
    ["inequalities-and-solutions", "identifying-solutions-to-linear-inequalities"],
    ["6.EE.B.5", "7.EE.B.4.B"],
    [
      {
        ...lesson(
          "substituting-into-both-sides",
          ["Substituting into both sides", "代入两边"],
          [
            [
              "Evaluate the left side and the right side separately, then compare. For $x = -2$, $4(x + 3) < 2x + 5$ becomes $4(1) < 2(-2) + 5$, that is $4 < 1$, which is false, so $-2$ is not a solution.",
              "分别计算左边和右边，再比较。当 $x = -2$ 时，$4(x + 3) < 2x + 5$ 变为 $4(1) < 2(-2) + 5$，即 $4 < 1$，不成立，所以 $-2$ 不是解。",
            ],
            [
              "Subtract the sides: $4 - 1 = 3$ is positive, but $<$ needs a negative difference.",
              "两边相减：$4 - 1 = 3$ 是正数，而 $<$ 要求差是负数。",
            ],
            [
              "When the two sides are equal, the value works for $\\le$ and $\\ge$ but not for $<$ and $>$.",
              "两边相等时，这个值满足 $\\le$ 和 $\\ge$，但不满足 $<$ 和 $>$。",
            ],
          ],
          (rng) => {
            const k = rng.sign() * rng.int(2, 5);
            const p = rng.nonZero(-6, 6);
            const c = rng.nonZero(-6, 6);
            const v = rng.nonZero(-6, 6);
            const left = k * (v + p);
            const op = rng.pick(ops);
            const target = rng.bool(0.35) ? left : left + rng.nonZero(-4, 4);
            const d = target - c * v;
            const right = c * v + d;
            const latex = `${num(k)}(${linear(1, p)}) ${relSymbol(op)} ${linear(c, d)}`;
            const yes = holds(Q.of(left), op, Q.of(right));
            const statement = `${num(left)} ${relSymbol(op)} ${num(right)}`;
            return decided(
              rng,
              [`Is $x = ${num(v)}$ a solution of $${latex}$?`, `$x = ${num(v)}$ 是 $${latex}$ 的解吗？`],
              yes,
              [
                [
                  ["The left side", "左边"],
                  [`Put $x = ${num(v)}$ into the left side:`, `把 $x = ${num(v)}$ 代入左边：`],
                  [`${num(k)}(${num(v)} ${p < 0 ? "-" : "+"} ${Math.abs(p)}) = ${num(k)}(${num(v + p)}) = ${num(left)}`],
                ],
                [
                  ["The right side and the comparison", "右边并比较"],
                  [
                    `The right side is $${substitutedLinear(c, v, d)} = ${num(right)}$, and $${statement}$ is ${truth(yes)[0]}:`,
                    `右边是 $${substitutedLinear(c, v, d)} = ${num(right)}$，而 $${statement}$ ${truth(yes)[1]}：`,
                  ],
                  [statement],
                ],
              ],
              [
                `Subtract the sides: $${num(left)} - ${paren(right)} = ${num(left - right)}$, and $${relSymbol(op)}$ needs the difference to be ${described[op][0]}.`,
                `两边相减：$${num(left)} - ${paren(right)} = ${num(left - right)}$，而 $${relSymbol(op)}$ 要求差${described[op][1]}。`,
              ],
              yes
                ? [`$${statement}$ is true, so the value is a solution.`, `$${statement}$ 成立，所以这个值是解。`]
                : [`$${statement}$ is false, so the value is not a solution.`, `$${statement}$ 不成立，所以这个值不是解。`],
              tableFigure(["4(x + 3)", "2x + 5"], [4, 1]),
            );
          },
          tableFigure(["4(x + 3)", "2x + 5"], [4, 1]),
        ),
        keyPrerequisites: ["inequalities-and-solutions"],
      },
      lesson(
        "choosing-a-solution-with-a-negative-coefficient",
        ["Choosing a solution when the coefficient is negative", "系数为负时选出解"],
        [
          [
            "With a negative coefficient, greater values of $x$ make the expression smaller. Test each value instead of guessing: for $10 - 3x > 4$, $x = 1$ gives $7 > 4$, which is true, but $x = 3$ gives $1 > 4$, which is false.",
            "系数为负时，$x$ 越大，式子的值越小。不要凭感觉判断，要逐个代入检验：对于 $10 - 3x > 4$，$x = 1$ 得 $7 > 4$，成立；而 $x = 3$ 得 $1 > 4$，不成立。",
          ],
          [
            "Solve it: $-3x > -6$, and dividing by $-3$ reverses the sign, so $x < 2$; $1$ is less than $2$.",
            "解不等式：$-3x > -6$，除以 $-3$ 时不等号反向，所以 $x < 2$；$1$ 确实小于 $2$。",
          ],
          [
            "A larger $x$ does not always give a larger value: with $-3x$, it gives a smaller one.",
            "$x$ 越大，值不一定越大：对于 $-3x$，值反而越小。",
          ],
        ],
        (rng) => {
          const a = rng.int(2, 7);
          const b = rng.int(-10, 20);
          const s = rng.int(-5, 8);
          const c = b - a * s;
          const op = rng.pick(ops);
          // b − a·x op c holds for x flip(op) s.
          const solved = flip[op];
          const candidates =
            solved === "<"
              ? [s - 1, s, s + 1, s + 2]
              : solved === "<="
                ? [s, s + 1, s + 2, s + 3]
                : solved === ">"
                  ? [s - 2, s - 1, s, s + 1]
                  : [s - 3, s - 2, s - 1, s];
          const value = (x: number) => b - a * x;
          const good = candidates.find((x) => holds(Q.of(value(x)), op, Q.of(c)))!;
          const latex = `${b === 0 ? `-${a}x` : `${b} - ${a}x`} ${relSymbol(op)} ${num(c)}`;
          const sub = (x: number) => `${b === 0 ? "" : `${b} `}-${b === 0 ? "" : " "}${a}(${num(x)}) = ${num(value(x))}`;
          return chosenMath(
            rng,
            [`Which value of $x$ is a solution of $${latex}$?`, `$x$ 取哪个值时是 $${latex}$ 的解？`],
            num(good),
            candidates
              .filter((x) => x !== good)
              .map((x) => [
                num(x),
                `$x = ${num(x)}$ gives $${num(value(x))}$, and $${num(value(x))} ${relSymbol(op)} ${num(c)}$ is false.`,
                `$x = ${num(x)}$ 得 $${num(value(x))}$，而 $${num(value(x))} ${relSymbol(op)} ${num(c)}$ 不成立。`,
              ]),
            [
              [
                ["Substitute each value", "逐个代入"],
                ["Work out the left side for each choice:", "对每个选项计算左边："],
                candidates.map(sub),
              ],
              [
                ["Compare", "比较"],
                [
                  `Only $${num(value(good))} ${relSymbol(op)} ${num(c)}$ is true, so $x = ${num(good)}$.`,
                  `只有 $${num(value(good))} ${relSymbol(op)} ${num(c)}$ 成立，所以 $x = ${num(good)}$。`,
                ],
              ],
            ],
            [
              `Solve it: $${poly([-a, "x"])} ${relSymbol(op)} ${num(c - b)}$, and dividing by $${-a}$ reverses the sign, so $x ${relSymbol(solved)} ${s}$; only $${num(good)}$ of the choices fits.`,
              `解不等式：$${poly([-a, "x"])} ${relSymbol(op)} ${num(c - b)}$，除以 $${-a}$ 时不等号反向，所以 $x ${relSymbol(solved)} ${s}$；选项中只有 $${num(good)}$ 符合。`,
            ],
          );
        },
        tableFigure(["x = 1", "x = 3"], [7, 1]),
      ),
    ],
  ),
  ["Is $x = 3$ a solution of $x + 2 > 4$?", "$x = 3$ 是 $x + 2 > 4$ 的解吗？"],
  ["Yes: $3 + 2 = 5$ and $5 > 4$; the difference $5 - 4 = 1$ is positive.", "是：$3 + 2 = 5$，而 $5 > 4$；差 $5 - 4 = 1$ 是正数。"],
  [
    "test whether a value solves an inequality by working out both sides and comparing them.",
    "把值代入两边、分别计算并比较，检验它是不是不等式的解。",
  ],
);

/** reversal says why the symbol of an answer points the wrong way after dividing by k. */
const reversal = (k: Q | number): readonly [string, string] =>
  (k instanceof Q ? k.sign() : Math.sign(k)) < 0
    ? ["The symbol points the wrong way: dividing by a negative number reverses it.", "不等号方向错了：除以负数时不等号要改变方向。"]
    : ["The symbol points the wrong way: dividing by a positive number keeps it.", "不等号方向错了：除以正数时不等号方向不变。"];

/** inside gives a value just inside the solutions of x op v, one step of size `step` away from v. */
const inside = (op: InequalityOp, v: number, step = 1) => (op === ">" || op === ">=" ? v + step : v - step);

/** furtherSolvingLinearInequalities solves inequalities with parentheses and fractional coefficients. */
export const furtherSolvingLinearInequalities = withIntro(
  topic(
    "further-solving-linear-inequalities",
    t("Further Solving Linear Inequalities", "进一步解一次不等式"),
    t(
      "Inequalities with parentheses or fractions are solved like the matching equations: expand, clear fractions, collect $x$ on one side, and isolate it. Reverse the inequality symbol whenever you multiply or divide both sides by a negative number: $-2(x - 3) \\le 10$ gives $-2x + 6 \\le 10$, $-2x \\le 4$, so $x \\ge -2$.",
      "含括号或分数的不等式与对应的方程解法相同：展开、去分母、把 $x$ 移到一边，再求出 $x$。两边乘以或除以负数时，不等号要改变方向：由 $-2(x - 3) \\le 10$ 得 $-2x + 6 \\le 10$，$-2x \\le 4$，所以 $x \\ge -2$。",
    ),
    ["solving-multi-step-inequalities", "equations-with-parentheses", "solving-linear-equations-with-fractional-coefficients"],
    ["7.EE.B.4.B"],
    [
      {
        ...lesson(
          "inequalities-with-parentheses",
          ["Inequalities with parentheses", "含括号的不等式"],
          [
            [
              "Expand first, then solve, and decide the direction of the symbol only at the step where you divide. $3(x + 4) > 5x - 2$ gives $3x + 12 > 5x - 2$, so $-2x > -14$, and dividing by $-2$ reverses the symbol: $x < 7$.",
              "先展开，再求解，只在做除法的那一步判断不等号的方向。由 $3(x + 4) > 5x - 2$ 得 $3x + 12 > 5x - 2$，所以 $-2x > -14$，除以 $-2$ 时不等号改变方向：$x < 7$。",
            ],
            [
              "Test $x = 6$, which should work: the left side is $3 \\times 10 = 30$ and the right side is $28$, and $30 > 28$.",
              "检验 $x = 6$，它应该是解：左边是 $3 \\times 10 = 30$，右边是 $28$，而 $30 > 28$。",
            ],
            [
              "Reverse the symbol only when dividing by a negative number, not every time a minus sign appears.",
              "只有除以负数时才改变不等号方向，不是看到负号就改变。",
            ],
          ],
          (rng) => {
            const k = rng.sign() * rng.int(2, 6);
            const p = rng.nonZero(-6, 6);
            const v = rng.int(-8, 8);
            const op = rng.pick(ops);
            if (rng.bool(0.45)) {
              const c = k * (v + p);
              const answerOp = k < 0 ? flip[op] : op;
              const latex = `${num(k)}(${linear(1, p)}) ${relSymbol(op)} ${num(c)}`;
              const tv = inside(answerOp, v);
              return bounded(
                [`Solve $${latex}$.`, `解不等式 $${latex}$。`],
                "x",
                answerOp,
                v,
                [
                  [
                    ["Expand", "展开"],
                    [`Multiply $${num(k)}$ into the parentheses:`, `用 $${num(k)}$ 乘括号里的每一项：`],
                    [`${linear(k, k * p)} ${relSymbol(op)} ${num(c)}`],
                  ],
                  [
                    ["Isolate x", "求出 x"],
                    k < 0
                      ? [
                          `Undo the constant, then divide by $${num(k)}$, a negative number, so the symbol reverses:`,
                          `先去掉常数项，再除以负数 $${num(k)}$，不等号改变方向：`,
                        ]
                      : [`Undo the constant, then divide by $${num(k)}$:`, `先去掉常数项，再除以 $${num(k)}$：`],
                    [`${side(k)} ${relSymbol(op)} ${num(c - k * p)}`, inequalityLatex("x", answerOp, v)],
                  ],
                ],
                [
                  `Test $x = ${tv}$, which should work: $${num(k)}(${num(tv + p)}) = ${num(k * (tv + p))}$, and $${num(k * (tv + p))} ${relSymbol(op)} ${num(c)}$ is true.`,
                  `检验 $x = ${tv}$，它应该是解：$${num(k)}(${num(tv + p)}) = ${num(k * (tv + p))}$，而 $${num(k * (tv + p))} ${relSymbol(op)} ${num(c)}$ 成立。`,
                ],
                [
                  [flip[answerOp], v, ...reversal(k)],
                  [
                    answerOp,
                    frac(c - p, k),
                    `That takes away $${num(p)}$ instead of $${num(k * p)}$: $${num(k)}$ multiplies $${num(p)}$ too.`,
                    `这是减去了 $${num(p)}$，而不是 $${num(k * p)}$：$${num(k)}$ 也要乘 $${num(p)}$。`,
                  ],
                  [
                    answerOp,
                    frac(c, k).add(Q.of(p)),
                    `That moves $${num(p)}$ without changing its sign.`,
                    `这是移动 $${num(p)}$ 时没有变号。`,
                  ],
                ],
              );
            }
            let m = rng.nonZero(-6, 6);
            while (m === k) m = rng.nonZero(-6, 6);
            const coef = k - m;
            const n = coef * v + k * p;
            const answerOp = coef < 0 ? flip[op] : op;
            const latex = `${num(k)}(${linear(1, p)}) ${relSymbol(op)} ${linear(m, n)}`;
            const tv = inside(answerOp, v);
            return bounded(
              [`Solve $${latex}$.`, `解不等式 $${latex}$。`],
              "x",
              answerOp,
              v,
              [
                [
                  ["Expand", "展开"],
                  [`Multiply $${num(k)}$ into the parentheses:`, `用 $${num(k)}$ 乘括号里的每一项：`],
                  [`${linear(k, k * p)} ${relSymbol(op)} ${linear(m, n)}`],
                ],
                [
                  ["Collect and divide", "移项并相除"],
                  coef < 0
                    ? [
                        `Collect $x$ on the left, then divide by $${num(coef)}$, a negative number, so the symbol reverses:`,
                        `把 $x$ 移到左边，再除以负数 $${num(coef)}$，不等号改变方向：`,
                      ]
                    : coef === 1
                      ? ["Collect $x$ on the left and the numbers on the right:", "把 $x$ 移到左边，数移到右边："]
                      : [`Collect $x$ on the left, then divide by $${num(coef)}$:`, `把 $x$ 移到左边，再除以 $${num(coef)}$：`],
                  coef === 1
                    ? [inequalityLatex("x", answerOp, v)]
                    : [`${side(coef)} ${relSymbol(op)} ${num(n - k * p)}`, inequalityLatex("x", answerOp, v)],
                ],
              ],
              [
                `Test $x = ${tv}$, which should work: the left side is $${num(k * (tv + p))}$ and the right side is $${num(m * tv + n)}$, and $${num(k * (tv + p))} ${relSymbol(op)} ${num(m * tv + n)}$ is true.`,
                `检验 $x = ${tv}$，它应该是解：左边是 $${num(k * (tv + p))}$，右边是 $${num(m * tv + n)}$，而 $${num(k * (tv + p))} ${relSymbol(op)} ${num(m * tv + n)}$ 成立。`,
              ],
              [
                [flip[answerOp], v, ...reversal(coef)],
                [
                  answerOp,
                  frac(n - p, coef),
                  `That takes away $${num(p)}$ instead of $${num(k * p)}$: $${num(k)}$ multiplies $${num(p)}$ too.`,
                  `这是减去了 $${num(p)}$，而不是 $${num(k * p)}$：$${num(k)}$ 也要乘 $${num(p)}$。`,
                ],
                [
                  answerOp,
                  frac(n + k * p, coef),
                  `That moves $${num(k * p)}$ without changing its sign.`,
                  `这是移动 $${num(k * p)}$ 时没有变号。`,
                ],
              ],
            );
          },
          numberLineFigure(union(ray("<", 7)), 2, 10),
        ),
        keyPrerequisites: ["equations-with-parentheses", "solving-multi-step-inequalities"],
      },
      {
        ...lesson(
          "inequalities-with-fractions",
          ["Inequalities with fractional coefficients", "分数系数的不等式"],
          [
            [
              "Multiply both sides by the reciprocal of the coefficient. A negative fraction has a negative reciprocal, so the symbol reverses: $-\\frac{2}{3}x + 1 \\le 7$ gives $-\\frac{2}{3}x \\le 6$, so $x \\ge -\\frac{3}{2} \\cdot 6 = -9$.",
              "两边同时乘以系数的倒数。负分数的倒数是负数，所以不等号要改变方向：由 $-\\frac{2}{3}x + 1 \\le 7$ 得 $-\\frac{2}{3}x \\le 6$，所以 $x \\ge -\\frac{3}{2} \\cdot 6 = -9$。",
            ],
            [
              "Test $x = -6$, which should work: $-\\frac{2}{3} \\cdot (-6) + 1 = 5$, and $5 \\le 7$.",
              "检验 $x = -6$，它应该是解：$-\\frac{2}{3} \\cdot (-6) + 1 = 5$，而 $5 \\le 7$。",
            ],
            [
              "Multiplying by a negative reciprocal reverses the symbol, just like dividing by a negative number.",
              "乘以负的倒数时不等号也要改变方向，就像除以负数一样。",
            ],
          ],
          (rng) => {
            const q = rng.int(2, 6);
            let p = rng.int(1, 5);
            while (p % q === 0 || gcd(p, q) !== 1) p = rng.int(1, 5);
            const f = Q.of(rng.bool(0.5) ? -p : p, q);
            const v = q * rng.nonZero(-4, 4);
            const b = rng.nonZero(-12, 12);
            const c = Number(f.mul(Q.of(v)).n) + b;
            const op = rng.pick(ops);
            const answerOp = f.sign() < 0 ? flip[op] : op;
            const r = Q.one.div(f);
            const latex = `${fractionTerm(f)} ${b < 0 ? "-" : "+"} ${Math.abs(b)} ${relSymbol(op)} ${num(c)}`;
            const tv = inside(answerOp, v, q);
            const value = Number(f.mul(Q.of(tv)).n) + b;
            const move = moveConstant(b);
            return bounded(
              [`Solve $${latex}$.`, `解不等式 $${latex}$。`],
              "x",
              answerOp,
              v,
              [
                [
                  ["Undo the constant", "去掉常数项"],
                  [`${move.en}:`, `${move["zh-CN"]}：`],
                  [`${fractionTerm(f)} ${relSymbol(op)} ${num(c - b)}`],
                ],
                [
                  ["Multiply by the reciprocal", "乘以倒数"],
                  f.sign() < 0
                    ? [
                        `Multiply by $${num(r)}$; it is negative, so the symbol reverses:`,
                        `乘以 $${num(r)}$；它是负数，所以不等号改变方向：`,
                      ]
                    : [`Multiply by $${num(r)}$:`, `乘以 $${num(r)}$：`],
                  [`x ${relSymbol(answerOp)} ${num(r)} \\cdot ${paren(c - b)} = ${num(v)}`],
                ],
              ],
              [
                `Test $x = ${tv}$, which should work: $${num(f)} \\cdot ${paren(tv)} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${num(value)}$, and $${num(value)} ${relSymbol(op)} ${num(c)}$ is true.`,
                `检验 $x = ${tv}$，它应该是解：$${num(f)} \\cdot ${paren(tv)} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${num(value)}$，而 $${num(value)} ${relSymbol(op)} ${num(c)}$ 成立。`,
              ],
              [
                [flip[answerOp], v, ...reversal(f)],
                [
                  answerOp,
                  Q.of(c - b).mul(f),
                  `That multiplies by $${num(f)}$ itself; multiply by its reciprocal $${num(r)}$.`,
                  `这是乘了 $${num(f)}$ 本身；应该乘它的倒数 $${num(r)}$。`,
                ],
                [
                  answerOp,
                  r.mul(Q.of(c)).sub(Q.of(b)),
                  `That multiplies by the reciprocal before removing $${num(b)}$; undo the constant first.`,
                  `这是先乘倒数，再处理 $${num(b)}$；应该先去掉常数项。`,
                ],
              ],
            );
          },
          numberLineFigure(union(ray(">=", -9)), -12, -2),
        ),
        keyPrerequisites: ["solving-linear-equations-with-fractional-coefficients"],
      },
    ],
  ),
  ["If $-x > 2$, is $x$ positive or negative?", "如果 $-x > 2$，$x$ 是正数还是负数？"],
  [
    "Negative: $x < -2$; for example $x = -3$ gives $-(-3) = 3$, and $3 > 2$.",
    "负数：$x < -2$；例如 $x = -3$ 时，$-(-3) = 3$，而 $3 > 2$。",
  ],
  [
    "solve inequalities with parentheses and fractions, reversing the symbol when multiplying or dividing by a negative number.",
    "解含括号和分数的不等式，乘以或除以负数时改变不等号方向。",
  ],
);

/** TwoStep is a generated inequality a·x + b op c whose solution is x solvedOp s. */
interface TwoStep {
  readonly latex: (op: InequalityOp) => string;
  readonly op: InequalityOp;
  readonly solvedOp: InequalityOp;
  readonly s: number;
  readonly work: Text;
}

/** twoStep draws a one- or two-step inequality with an integer boundary s, often with a negative coefficient. */
function twoStep(rng: Rng, s: number): TwoStep {
  const a = rng.bool(0.55) ? -rng.int(2, 6) : rng.int(2, 6);
  const b = rng.bool(0.2) ? 0 : rng.nonZero(-12, 12);
  const c = a * s + b;
  const op = rng.pick(ops);
  const solvedOp = a < 0 ? flip[op] : op;
  const constantFirst = b !== 0 && a < 0 && rng.bool();
  const lhs = constantFirst ? poly([b, ""], [a, "x"]) : linear(a, b);
  return {
    latex: (o) => `${lhs} ${relSymbol(o)} ${num(c)}`,
    op,
    solvedOp,
    s,
    work: (() => {
      const lines = steps(...(b === 0 ? [] : [`${side(a)} ${relSymbol(op)} ${num(c - b)}`]), inequalityLatex("x", solvedOp, s));
      const reverse = a < 0 ? t(", reversing the symbol", "，并改变不等号方向") : t("", "");
      return b === 0
        ? t(`Divide both sides by $${a}$${reverse.en}:${lines}`, `两边同时除以 $${a}$${reverse["zh-CN"]}：${lines}`)
        : t(
            `${moveConstant(b).en}, then divide by $${a}$${reverse.en}:${lines}`,
            `${moveConstant(b)["zh-CN"]}，再同时除以 $${a}$${reverse["zh-CN"]}：${lines}`,
          );
    })(),
  };
}

/** describe says how the graph of x op c looks on a number line. */
const describe = (op: InequalityOp, c: number) => {
  const closed = op === ">=" || op === "<=";
  const right = op === ">" || op === ">=";
  return t(
    `${closed ? "A closed dot" : "An open circle"} at $${c}$, shaded to the ${right ? "right" : "left"}`,
    `$${c}$ 处画${closed ? "实心点" : "空心圈"}，向${right ? "右" : "左"}涂色`,
  );
};

export const representingSolutionsToInequalitiesOnNumberLines = topic(
  "representing-solutions-to-inequalities-on-number-lines",
  t("Representing Solutions to Inequalities on Number Lines", "在数轴上表示不等式的解"),
  t(
    "To graph the solutions of an inequality such as $5 - 2x < 11$, solve it first: $-2x < 6$, so $x > -3$. Then draw an open circle at $-3$, because $-3$ is not a solution, and shade to the right. A closed dot is used for $\\le$ and $\\ge$. Graphing before solving is risky: the symbol may reverse along the way.",
    "要画出 $5 - 2x < 11$ 这类不等式的解，先求解：$-2x < 6$，所以 $x > -3$。然后在 $-3$ 处画空心圈（因为 $-3$ 不是解），并向右涂色。$\\le$ 和 $\\ge$ 用实心点表示。不先求解就画图很容易出错：求解过程中不等号可能会改变方向。",
  ),
  ["solving-multi-step-inequalities", "representing-inequalities-on-number-lines"],
  ["7.EE.B.4.B"],
  [
    {
      id: "describing-the-graph-of-the-solutions",
      figure: gradeDrawings3["representing-solutions-to-inequalities-on-number-lines#describing-the-graph-of-the-solutions"],
      title: t("Describing the graph of the solutions", "描述解的图像"),
      explanation: t(
        "Solve, then read the result: $-4x + 1 \\ge 9$ gives $-4x \\ge 8$, so $x \\le -2$. Its graph is a closed dot at $-2$, shaded to the left.",
        "先求解，再看结果：由 $-4x + 1 \\ge 9$ 得 $-4x \\ge 8$，所以 $x \\le -2$。它的图像是在 $-2$ 处画实心点，向左涂色。",
      ),
      keyPrerequisites: ["solving-multi-step-inequalities"],
      generate(rng) {
        const s = rng.int(-8, 8);
        const q = twoStep(rng, s);
        const latex = q.latex(q.op);
        return choiceProblem({
          prompt: t(
            `Which describes the graph of the solutions of $${latex}$ on a number line?`,
            `$${latex}$ 的解在数轴上的图像是哪一种？`,
          ),
          options: ops.map((o) => describe(o, s)),
          correct: ops.indexOf(q.solvedOp),
          solution: t(`${q.work.en}${describe(q.solvedOp, s).en}.`, `${q.work["zh-CN"]}${describe(q.solvedOp, s)["zh-CN"]}。`),
        });
      },
    },
    {
      id: "choosing-the-inequality-for-a-graph",
      figure: gradeDrawings3["representing-solutions-to-inequalities-on-number-lines#choosing-the-inequality-for-a-graph"],
      title: t("Choosing the inequality for a graph", "根据图像选不等式"),
      explanation: t(
        "To decide which inequality a graph shows, solve each candidate and compare it with the graph. A graph with an open circle at $3$ shaded to the left shows $x < 3$. It matches $-2x > -6$, because dividing by $-2$ gives $x < 3$, but not $-2x < -6$.",
        "要判断图像表示哪个不等式，把每个选项都解出来，再与图像比较。在 $3$ 处画空心圈、向左涂色的图像表示 $x < 3$。它与 $-2x > -6$ 对应，因为两边除以 $-2$ 得 $x < 3$；而与 $-2x < -6$ 不对应。",
      ),
      generate(rng) {
        const s = rng.int(-6, 6);
        const q = twoStep(rng, s);
        const correct = q.latex(q.op);
        const lo = Math.max(-10, s - 5);
        return pickChoice(
          rng,
          t("Which inequality has the solutions shown on the number line?", "哪个不等式的解是数轴上所表示的数？"),
          mathText(correct),
          [mathText(q.latex(flip[q.op])), mathText(q.latex(strictness[q.op])), mathText(q.latex(flip[strictness[q.op]]))],
          t(
            `The graph shows $${inequalityLatex("x", q.solvedOp, s)}$. For $${correct}$: ${q.work.en}The other inequalities have a different symbol, so their solutions differ at $${s}$ or point the other way.`,
            `图像表示 $${inequalityLatex("x", q.solvedOp, s)}$。对于 $${correct}$：${q.work["zh-CN"]}其他不等式的符号不同，所以它们的解在 $${s}$ 处不同，或者方向相反。`,
          ),
          numberLineFigure([ray(q.solvedOp, s)], lo, lo + 10),
        );
      },
    },
  ],
);

/** grade7EquationTopics lists the 7th grade topics on linear equations, two-variable equations and inequalities. */
export const grade7EquationTopics: readonly TopicDef[] = [
  solvingLinearEquationsByTrialAndError,
  solvingLinearEquationsWithFractionalCoefficients,
  solvingLinearEquationsWithDecimalCoefficients,
  solvingLinearEquationsByClearingARationalExpression,
  solvingLinearEquationsUsingCrossMultiplication,
  twoVariableLinearEquationsAndTheirSolutions,
  solvingTwoVariableEquations,
  graphingLinearEquations,
  compoundInequalities,
  verifyingSolutionsOfLinearInequalities,
  furtherSolvingLinearInequalities,
  representingSolutionsToInequalitiesOnNumberLines,
];
